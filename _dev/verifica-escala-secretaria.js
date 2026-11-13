/* ═══════════════════════════════════════════════════════════════
   📏 UNA SOLA ESCALA: LA DE LA SECRETARÍA DE EDUCACIÓN

   Inicial hasta 69 · Básico 70 a 79 · Avanzado 80 a 90 · Excelente 91
   a 100. Hasta noviembre de 2026 (v506) convivían tres: esta en Notas
   SACE, la boleta y el Resumen final; otra de cinco niveles (Avanzado
   95+, Muy Bueno, Satisfactorio, Debe Mejorar, Insatisfactorio) en el
   Plan de Acción y Estadísticas; y una tercera de colores en la tabla
   del Plan de Acción. Un 85 se llamaba distinto en cada pantalla. El
   maestro pidió usar en todo la de la Secretaría.

   Esta sonda falla si alguna pantalla, misión o ficha vuelve a usar
   otra: compara los cortes nota por nota del 0 al 100.

   Uso:  node _dev/verifica-escala-secretaria.js
═══════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RAIZ = path.resolve(__dirname, '..');
const lee = r => fs.readFileSync(path.join(RAIZ, r), 'utf8');
let fallos = 0;
const ok = (c, m, extra) => { console.log((c ? '✓ ' : '✘ ') + m + (c || extra === undefined ? '' : '  ' + JSON.stringify(extra).slice(0, 300))); if (!c) fallos++; };

/* la escala de referencia: la de Notas SACE y el Resumen final */
const RS = require(path.join(RAIZ, 'js', 'tools', 'cuadros-sace.js'));
const NOMBRE = { I: 'Inicial', B: 'Básico', A: 'Avanzado', E: 'Excelente' };
const oficial = v => NOMBRE[RS.escalaDe(v)];
const notas = [...Array(101).keys()];
ok(oficial(69) === 'Inicial' && oficial(70) === 'Básico' && oficial(79) === 'Básico' && oficial(80) === 'Avanzado' &&
  oficial(90) === 'Avanzado' && oficial(91) === 'Excelente', 'la referencia: Inicial ≤69 · Básico 70–79 · Avanzado 80–90 · Excelente 91–100');

/* un bloque `const X = …;` de un archivo, evaluado aparte */
const bloque = (src, nombre, fin) => { const i = src.indexOf('const ' + nombre + ' ='); return src.slice(i, src.indexOf(fin, i) + fin.length); };

const adm = lee('js/tools/registros-admin.js');
const ctxA = {};
vm.runInNewContext(bloque(adm, 'AD_NOTA_ESCALA_INFO', '};') + '\n' + bloque(adm, 'AD_NOTA_CATS', '}));') +
  '\nthis.CATS = AD_NOTA_CATS;', ctxA);
const adNotaCat = v => ctxA.CATS.find(c => v >= c.min) || ctxA.CATS[ctxA.CATS.length - 1];
const malA = notas.filter(v => adNotaCat(v).label !== oficial(v));
ok(ctxA.CATS.length === 4 && !malA.length, 'Estadísticas (AD_NOTA_CATS): del 0 al 100 cada nota cae en el nivel de la Secretaría', malA);

const pa = lee('js/tools/plan-accion.js');
const ctxP = {};
vm.runInNewContext(bloque(pa, 'PA_CATS', '];') + '\nthis.CATS = PA_CATS;', ctxP);
const malP = notas.filter(v => { const c = ctxP.CATS.filter(x => v >= x.min && v <= x.max); return c.length !== 1 || c[0].label !== oficial(v); });
ok(ctxP.CATS.length === 4 && !malP.length, 'Plan de Acción (PA_CATS): del 0 al 100 cada nota cae en un solo nivel, el de la Secretaría', malP);
const sugs = pa.slice(pa.indexOf('const PA_SUGS'), pa.indexOf('};', pa.indexOf('const PA_SUGS')));
const msgs = pa.slice(pa.indexOf('const PA_MSG_PADRES'), pa.indexOf('};', pa.indexOf('const PA_MSG_PADRES')));
ok(ctxP.CATS.every(c => new RegExp('\\b' + c.key + ':').test(sugs) && new RegExp('\\b' + c.key + ':').test(msgs)),
  'cada nivel tiene su sugerencia y su mensaje a la familia');
const colores = pa.slice(pa.indexOf('function paGradeColors'), pa.indexOf('\n}\n', pa.indexOf('function paGradeColors')));
ok(/g >= 91/.test(colores) && /g >= 80/.test(colores) && /g >= 70/.test(colores) && !/g >= (95|60)/.test(colores),
  'los colores de la tabla del Plan de Acción cortan en 91, 80 y 70');

/* ninguna pantalla, misión o ficha publicada nombra la escala vieja */
/* «Muy Bueno» solo como nivel de NOTAS: en Personalidad (4:Sobresaliente,
   3:Muy Bueno, 2:Bueno) es la escala oficial de conducta y se queda */
const VIEJA = /Debe Mejorar|Insatisfactorio|cinco categor|label:\s*'Muy Bueno'|nivel Muy Bueno/;
const archivos = ['js/tools/plan-accion.js', 'js/tools/estadisticas-alumno.js', 'js/tools/registros-admin.js',
  'js/tools/formacion-docente.js', 'misiones/docente-bienvenida-metas/js/bienvenida-metas.js',
  'misiones/docente-bienvenida-metas/bienvenida-metas.html', 'misiones/docente-metas-sace/js/metas-sace.js',
  'fichas/ficha-docente-bienvenida-metas.html', 'fichas/ficha-docente-metas-sace.html'];
const sinComentarios = s => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '').replace(/<!--[\s\S]*?-->/g, '');
const conVieja = archivos.filter(a => VIEJA.test(sinComentarios(lee(a))));
ok(!conVieja.length, 'ningún texto que se lee nombra Muy Bueno, Debe Mejorar, Insatisfactorio o «cinco categorías»', conVieja);
const fichaB = lee('fichas/ficha-docente-bienvenida-metas.html');
ok(/<td><b>Excelente<\/b><\/td><td>91 a 100<\/td>/.test(fichaB) && /<td><b>Inicial<\/b><\/td><td>hasta 69<\/td>/.test(fichaB),
  'la ficha de bienvenida trae la tabla con los cuatro niveles y sus notas');

console.log(fallos ? '\n✘ ' + fallos + ' comprobación(es) fallaron' : '\n✓ Una sola escala en toda la plataforma: la de la Secretaría');
process.exit(fallos ? 1 : 0);
