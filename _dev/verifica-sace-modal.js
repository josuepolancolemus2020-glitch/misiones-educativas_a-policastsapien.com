/* ══════════════════════════════════════════════════════════════
   M.E.T.A.S · «Guardar lo marcado» siempre a la vista (lectura de código)
   ──────────────────────────────────────────────────────────────
   Con 41 alumnos la vista previa de la lista del SACE medía varias
   pantallas: no se desplazaba y el botón de guardar quedaba fuera, en
   la PC y en el teléfono. Esta es la mitad rápida: mira que la ventana
   esté ARMADA para que no vuelva a pasar. La mitad que mide de verdad,
   con Chromium, es verifica-sace-modal-navegador (va de noche).

   Uso:  node _dev/verifica-sace-modal.js
   ══════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const RAIZ = path.resolve(__dirname, '..');
const css = fs.readFileSync(path.join(RAIZ, 'css', 'app.css'), 'utf8');
const js = fs.readFileSync(path.join(RAIZ, 'js', 'tools', 'registros-admin.js'), 'utf8');

let fallos = 0;
const ok = (c, t) => { console.log((c ? '✓ ' : '✘ ') + t); if (!c) fallos++; };
const regla = sel => { const m = css.match(new RegExp('(^|\\n)' + sel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*\\{([^}]*)\\}')); return m ? m[2] : ''; };

const cuerpo = regla('.ad-sace-cuerpo');
ok(/overflow-y:\s*auto/.test(cuerpo), 'el cuerpo de la ventana se desplaza (overflow-y: auto)');
ok(/max-height:\s*calc\(100vh - 160px\)/.test(cuerpo), 'el cuerpo tiene alto máximo calc(100vh - 160px)');
ok(/min-height:\s*0/.test(cuerpo), 'y puede encogerse dentro de la ventana (min-height: 0)');
ok(/flex:\s*none/.test(regla('.ad-sace-pie')), 'el pie no se encoge: los botones no se van');
ok(/max-height:\s*calc\(100d?vh/.test(regla('.ad-sace-card')), 'la ventana entera cabe en la pantalla');
ok(/#metasInstallBtn\s*\{\s*display:\s*none/.test(css.split('body:has(.ad-sace-card)')[1] || ''), 'el botón «Instalar app» no tapa «Guardar» mientras está abierta');

const i = js.indexOf('function adSaceImportarTexto(');
const plantilla = js.slice(i, js.indexOf('document.body.appendChild(ov)', i));
const pCuerpo = plantilla.indexOf('class="ad-sace-cuerpo"'), pPie = plantilla.indexOf('ad-gen-foot ad-sace-pie');
const pSi = plantilla.indexOf('id="ad-sace-si"'), pNo = plantilla.indexOf('id="ad-sace-no"');
ok(pCuerpo > 0 && pPie > pCuerpo, 'los grupos van dentro del cuerpo y el pie va después');
ok(pSi > pPie && pNo > pPie, '«Cancelar» y «Guardar lo marcado» viven en el pie fijo');
/* el pie cierra el cuerpo antes de abrirse: el cuerpo no lo contiene */
const entre = plantilla.slice(pCuerpo, pPie);
const abre = (entre.match(/<div\b/g) || []).length, cierra = (entre.match(/<\/div>/g) || []).length;
ok(cierra >= abre, 'el cuerpo se cierra antes del pie');

console.log(fallos ? '\n✘ ' + fallos + ' comprobación(es) fallaron' : '\n✓ La ventana del SACE está armada para desplazarse con el pie a la vista');
process.exit(fallos ? 1 : 0);
