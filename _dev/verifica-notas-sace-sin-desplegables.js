/* ═══════════════════════════════════════════════════════════════
   🧾 NOTAS SACE SIN DESPLEGABLES · lo que se ve en el archivo

   Gemela rápida de verifica-notas-sace-simple.js (esa abre el navegador
   y corre de noche). Esta solo lee registros-admin.js y app.css, así
   que corre en cada empujón:

   · la plantilla de adRenderSace no tiene <select> ni <details>;
   · cada id de botón que había antes del rediseño (v504) sigue ahí;
   · la protección de «Sugerir notas» sigue en su manejador;
   · las llaves nuevas son nuevas y las de siempre se siguen usando.

   Uso:  node _dev/verifica-notas-sace-sin-desplegables.js
═══════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const adm = fs.readFileSync(path.join(RAIZ, 'js', 'tools', 'registros-admin.js'), 'utf8');
const css = fs.readFileSync(path.join(RAIZ, 'css', 'app.css'), 'utf8');
let fallos = 0;
const ok = (c, m, extra) => { console.log((c ? '✓ ' : '✘ ') + m + (c || extra === undefined ? '' : '  ' + JSON.stringify(extra))); if (!c) fallos++; };

const i0 = adm.indexOf('\nfunction adRenderSace(');
const i1 = adm.indexOf('\n}\n', adm.indexOf('${adUndoTarjetaHtml()}`;', i0));
const sace = adm.slice(i0, i1);
const plantilla = sace.slice(sace.indexOf('body.innerHTML = `'), sace.indexOf('${adUndoTarjetaHtml()}`;'));

ok(i0 > 0 && plantilla.length > 2000, 'se encuentra la plantilla de Notas SACE');
ok(!/<select\b/i.test(plantilla), 'la plantilla no tiene ningún <select>');
ok(!/<details\b/i.test(plantilla), 'ni acordeones <details>');

const ANTES = ['ad-sace-parcial', 'ad-sace-vista', 'ad-sace-recuperar', 'ad-sace-versiones', 'ad-sace-revisar-solas',
  'ad-sace-sugerir', 'ad-sace-autorizar-iv', 'ad-sace-bloquear-iv', 'ad-sace-ir-rec', 'ad-sace-rec-aviso',
  'ad-sace-addmat', 'ad-sace-orden-az', 'ad-sace-orden-gen', 'ad-sace-nocopy', 'ad-sace-bol-quien',
  'ad-sace-boletas', 'ad-sace-cfinal', 'ad-sace-resumen', 'ad-sace-perdidos', 'ad-sace-csv-num', 'ad-sace-csv',
  'ad-sace-estado', 'ad-inasis-traer', 'ad-inasis-desde', 'ad-inasis-hasta', 'ad-pers-editescala',
  'ad-logo-file', 'ad-logo-quitar', 'ad-logosec-file', 'ad-logosec-quitar', 'ad-boleta-centro', 'ad-bol-director',
  'ad-bol-docente', 'ad-bol-lugar', 'ad-bol-municipio', 'ad-bol-depto', 'ad-bol-anio'];
const faltan = ANTES.filter(id => !plantilla.includes('id="' + id + '"'));
ok(!faltan.length, 'siguen los ' + ANTES.length + ' ids de antes del rediseño', faltan);
const sinManejador = ['ad-sace-recuperar', 'ad-sace-versiones', 'ad-sace-revisar-solas', 'ad-sace-sugerir',
  'ad-sace-autorizar-iv', 'ad-sace-bloquear-iv', 'ad-sace-orden-az', 'ad-sace-orden-gen', 'ad-sace-nocopy',
  'ad-sace-cfinal', 'ad-sace-resumen', 'ad-sace-perdidos', 'ad-sace-addmat', 'ad-inasis-traer']
  .filter(id => !new RegExp("getElementById\\('" + id + "'\\)\\??\\.addEventListener\\('click'").test(sace));
ok(!sinManejador.length, 'y cada botón conserva su manejador de clic', sinManejador);

ok(/if \(parcial !== 'IV' \|\| !\(dd\.boleta && dd\.boleta\.sugerirIVAuth\)\)/.test(sace),
  '«Sugerir notas» sigue protegido en su manejador: solo Parcial IV y con autorización');
ok(/localStorage\.setItem\('METAS_SACE_PARCIAL', v\)/.test(sace) && /localStorage\.setItem\('METAS_SACE_VISTA', v\)/.test(sace),
  'parcial y sección se siguen recordando en sus llaves de siempre');
const nuevas = ['METAS_SACE_AYUDA_VISTA_V1', 'METAS_SACE_CANDADO_AVISO_V1'];
ok(nuevas.every(k => adm.split("'" + k + "'").length === 2), 'las dos llaves nuevas, solo de vista, se declaran una vez');
ok(!/METAS_ADMIN_V1|METAS_ALUMNO_V1/.test(adm.slice(adm.indexOf('const AD_SACE_CERRADOS'), i0)),
  'y no se guardan dentro de los datos del maestro');

const pasos = [...adm.slice(adm.indexOf('function adSacePasos('), adm.indexOf('\n}\n', adm.indexOf('function adSacePasos('))).matchAll(/'([^']+)'/g)]
  .map(m => m[1]).filter(t => /\s/.test(t));
ok(pasos.length >= 3 && pasos.every(t => t.split(/\s+/).length <= 12), 'los pasos de «¿Cómo se llena?» tienen 12 palabras o menos',
  pasos.filter(t => t.split(/\s+/).length > 12));

const bloque = css.slice(css.indexOf('/* ── Notas SACE simple (v504)'));
ok(/\.ad-seg-btn\s*\{[^}]*min-height: 44px/.test(bloque) && /\.ad-herr\s*\{[^}]*min-height: 44px/.test(bloque),
  'botones de parcial y sección, y los chips, de 44 px de alto');
ok(/transition:[^;]*150ms/.test(bloque), 'la marca cambia en 150 ms');
ok(!/\.ad-chips?\b/.test(bloque), 'los estilos nuevos no pisan los .ad-chip de Asistencia');

console.log(fallos ? '\n✘ ' + fallos + ' comprobación(es) fallaron' : '\n✓ Notas SACE sin desplegables y sin perder botones');
process.exit(fallos ? 1 : 0);
