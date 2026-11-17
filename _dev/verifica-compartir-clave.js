/* ═══════════════════════════════════════════════════════════════
   🔑 COMPARTIR LA CLAVE DE FAMILIA: EL MENSAJE Y EL ENLACE

   En Mi aula › Alumnos, la ficha de un alumno con clave trae «📋 Copiar»
   y el botón de WhatsApp. Esta sonda carga js/datos/claves-familia.js tal
   como lo carga la página y comprueba, con nombres ficticios:

   · el mensaje, palabra por palabra, con SOLO el primer nombre;
   · el enlace https://wa.me/?text=… sin número y bien codificado
     (los saltos de renglón, los dos puntos, las barras y las tildes);
   · que la pantalla pinta los botones solo si el alumno tiene clave,
     con el ícono verde de WhatsApp y su nombre para el lector de
     pantalla.

   Que los botones no aparezcan sin clave y que copien y abran lo que
   deben, en el navegador, lo prueba la capa C (C20).

   Uso:  node _dev/verifica-compartir-clave.js
═══════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RAIZ = path.resolve(__dirname, '..');
let fallos = 0;
function comprueba(que, ok, detalle) {
  console.log((ok ? '  ✓ ' : '  ✗ ') + que + (ok || detalle === undefined ? '' : '  → ' + JSON.stringify(detalle)));
  if (!ok) fallos++;
}

const ventana = { crypto: globalThis.crypto, TextEncoder };
ventana.window = ventana;
vm.createContext(ventana);
vm.runInContext(fs.readFileSync(path.join(RAIZ, 'js/datos/claves-familia.js'), 'utf8'), ventana);
const C = ventana.MetasDatos && ventana.MetasDatos.clavesFamilia;

console.log('▶ El mensaje de la clave');
comprueba('el módulo tiene mensaje() y enlaceWhatsApp()', !!(C && C.mensaje && C.enlaceWhatsApp));
const esperado = 'Clave de familia de Ana en M.E.T.A.S: ACYFS-4RGM2\n'
  + 'Entre aquí y escríbala: https://metas.policastsapien.com/padres.html\n'
  + 'No la comparta con nadie.';
const texto = C.mensaje('  Ana María Ficticia Pérez ', 'ACYFS-4RGM2');
comprueba('dice exactamente lo acordado', texto === esperado, texto);
comprueba('solo el primer nombre (sin apellidos)', !/María|Ficticia|Pérez/.test(texto));
comprueba('sin dinero ni notas', !/L\s*\d|\d+\.\d{2}|nota/i.test(texto.replace('ACYFS-4RGM2', '')));
comprueba('una clave vieja también va tal como se la dan', C.mensaje('Beto Ficticio', '15-K7QM').startsWith('Clave de familia de Beto en M.E.T.A.S: 15-K7QM\n'));

console.log('▶ El enlace de WhatsApp');
const enlace = C.enlaceWhatsApp(texto);
comprueba('es wa.me sin número', enlace.startsWith('https://wa.me/?text='), enlace.slice(0, 40));
const q = enlace.slice('https://wa.me/?text='.length);
comprueba('lleva el mensaje codificado con encodeURIComponent', q === encodeURIComponent(esperado));
comprueba('al leerlo de vuelta es el mismo mensaje', decodeURIComponent(q) === esperado);
comprueba('los saltos de renglón van como %0A', (q.match(/%0A/g) || []).length === 2);
comprueba('sin espacios, «:», «/», «?» ni «&» sueltos', !/[ :/?&\n]/.test(q), q.match(/[ :/?&\n]/g));
comprueba('las tildes van codificadas (aquí, escríbala)', q.includes('aqu%C3%AD') && q.includes('escr%C3%ADbala'));
const url = new URL(enlace);
comprueba('el navegador lo lee igual: host wa.me, texto en «text»', url.host === 'wa.me' && url.searchParams.get('text') === esperado);

console.log('▶ Los botones en Mi aula');
const pantalla = fs.readFileSync(path.join(RAIZ, 'js/tools/mi-aula.js'), 'utf8');
comprueba('solo se pintan si el alumno tiene clave en metas.familias',
  /fichaDe\[a\.id\] && fichaDe\[a\.id\]\.clave \? botonesCompartir\(a\) : ''/.test(pantalla));
comprueba('«📋 Copiar» con data-metas="clave-copiar"', pantalla.includes('data-metas="clave-copiar"') && pantalla.includes('📋 Copiar'));
comprueba('WhatsApp: solo el ícono, verde #25D366, con aria-label «Enviar por WhatsApp»',
  pantalla.includes('data-metas="clave-whatsapp"') && pantalla.includes('fill="#25D366"') && pantalla.includes('aria-label="Enviar por WhatsApp"'));
comprueba('el mismo botón que «Su tira» (ma-btn ma-btn-chico)',
  /class="ma-btn ma-btn-chico" data-metas="clave-copiar"/.test(pantalla) && /class="ma-btn ma-btn-chico" data-metas="clave-whatsapp"/.test(pantalla));
comprueba('no se le habla a ningún servidor al compartir',
  !/function compartirClave[\s\S]{0,900}(fetch\(|\.rpc\(|d\.crear|d\.editar|_nube)/.test(pantalla));

console.log(fallos ? `\n✘ ${fallos} comprobaciones de compartir la clave fallaron` : '\n✅ Compartir la clave: mensaje, enlace y botones en orden');
process.exit(fallos ? 1 : 0);
