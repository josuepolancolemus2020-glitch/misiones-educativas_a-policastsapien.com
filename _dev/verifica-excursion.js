/* ══════════════════════════════════════════════════════════════════
   Comprueba la IDA Y VUELTA de 🚌 Salida o excursión.
   ══════════════════════════════════════════════════════════════════
   Es la prueba que de verdad importa, porque el enlace ya está en el
   teléfono de las familias cuando el error aparece: si el codificador
   de «Mi aula» y el lector de excursion.html dejan de entenderse, el
   maestro no se entera —él lo probó el sábado— y la madre abre el
   enlace el lunes y le sale «este enlace está incompleto».

   Se comprueban tres cosas:
     1) lo que empaca excursion.js lo desempaca excursion.html IGUAL,
        con tildes, ñ, emoji y campos vacíos;
     2) la línea corta que el padre manda por WhatsApp la lee el
        contador, aunque venga con la basura que WhatsApp le pega
        delante al copiar («[8/8/26, 10:32] Mamá de Juan:»);
     3) las cuentas: personas, buses y dinero.

   Corre sin navegador ni servidor:  node _dev/verifica-excursion.js
   ══════════════════════════════════════════════════════════════════ */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RAIZ = path.join(__dirname, '..');
let fallos = 0, pruebas = 0;

function ok(que, cond, detalle) {
  pruebas++;
  if (cond) { console.log('  ✔ ' + que); return; }
  fallos++;
  console.log('  ✘ ' + que + (detalle ? '\n      ' + detalle : ''));
}

/* ── Se cargan los DOS lados en cajas separadas, como en la vida real:
   uno es la app del maestro, el otro la página suelta de la familia. ── */
function cajaBase() {
  return {
    btoa: s => Buffer.from(s, 'binary').toString('base64'),
    atob: s => Buffer.from(s, 'base64').toString('binary'),
    escape, unescape,
    console, location: { origin: 'https://metas.policastsapien.com', pathname: '/index.html' },
    window: {}, document: { getElementById: () => null, querySelectorAll: () => [] },
  };
}

/* Lado del maestro: js/tools/excursion.js. Se le quitan las funciones de
   pantalla —piden DOM— y se deja lo que calcula, que es lo que se prueba. */
const maestro = cajaBase();
vm.createContext(maestro);
vm.runInContext(fs.readFileSync(path.join(RAIZ, 'js/tools/excursion.js'), 'utf8'), maestro);

/* Lado de la familia: el <script> de excursion.html, tal cual se sirve. */
const htmlFam = fs.readFileSync(path.join(RAIZ, 'excursion.html'), 'utf8');
const mScript = htmlFam.match(/<script>([\s\S]*)<\/script>/);
if (!mScript) { console.error('✘ No encontré el <script> de excursion.html'); process.exit(1); }
const familia = cajaBase();
familia.location.hash = '';
familia.window = { addEventListener: () => {} };
familia.document = { getElementById: () => ({ innerHTML: '', addEventListener: () => {} }) };
vm.createContext(familia);
vm.runInContext(mScript[1], familia);

/* ══════════ 1 · el enlace viaja entero ══════════ */
console.log('\n🔗 El enlace: lo que empaca «Mi aula» lo lee la familia');

const SALIDA = {
  titulo: 'Museo Ferroviario de El Progreso',
  fecha: '2026-08-15', hsal: '7:00 a. m.', hreg: '4:00 p. m.',
  precio: '150', incluye: 'Transporte y entrada',
  llevar: 'Gorra, agua y su merienda',
  wa: '9999-8888', limite: '2026-08-11',
  maestro: 'José Policarpo Núñez', escuela: 'Escuela Ramón Rosa',
  punto: 'Del portón de la escuela', cap: '45', grupo: '6º-1',
  gancho: '¡El tren que sale en el libro lo van a ver de cerca! 🚂',
  pago: 'De lunes a viernes, en el aula', icono: '🚂',
};

const enlace = maestro.excEnlace(SALIDA);
ok('el enlace apunta a excursion.html', /\/excursion\.html#/.test(enlace), enlace.slice(0, 70));
ok('no lleva caracteres que WhatsApp estropee (+ / = _)',
  !/[+/=_]/.test(enlace.split('#')[1]),
  'sospechosos: ' + (enlace.split('#')[1].match(/[+/=_]/g) || []).join(''));

const leido = familia.excLeer(enlace.split('#')[1]);
ok('la familia lo puede abrir', !!leido);
if (leido) {
  Object.keys(SALIDA).forEach(k => {
    ok('viaja «' + k + '» tal cual', leido[k] === SALIDA[k],
      'esperaba «' + SALIDA[k] + '» y llegó «' + leido[k] + '»');
  });
}

/* Campos vacíos y textos con lo que de verdad escribe un maestro */
const RAROS = {
  titulo: 'Excursión a La Tigra — «El Rosario» 🌳', fecha: '2026-09-03',
  hsal: '', hreg: '', precio: '0', incluye: '', llevar: 'Zapato cerrado, ¡nada de chancletas!',
  wa: '504 9999 8888', limite: '2026-09-01', maestro: 'Prof.ª Ana Sánchez',
  escuela: '', punto: '', cap: '30', grupo: '', gancho: '', pago: '', icono: '🌳',
};
const leido2 = familia.excLeer(maestro.excEnlace(RAROS).split('#')[1]);
ok('aguanta tildes, comillas, guiones largos y emoji',
  !!leido2 && leido2.titulo === RAROS.titulo, leido2 && leido2.titulo);
ok('aguanta campos vacíos sin correr los demás',
  !!leido2 && leido2.llevar === RAROS.llevar && leido2.cap === '30',
  leido2 && ('llevar=«' + leido2.llevar + '» cap=«' + leido2.cap + '»'));

/* Un enlace cortado (pasa cuando se copia a medias del WhatsApp) tiene que
   avisar, no reventar ni pintar una salida a medias. */
let reventó = false, medio = null;
try { medio = familia.excLeer(enlace.split('#')[1].slice(0, 20)); } catch (_) { reventó = true; }
ok('un enlace cortado avisa en vez de reventar', !reventó && !medio);

/* ══════════ 2 · la respuesta vuelve ══════════ */
console.log('\n📲 La respuesta: lo que manda la familia lo cuenta «Mi aula»');

/* Se arma con el MISMO código de la página de la familia, no a mano: así
   la prueba se entera si alguien le cambia el formato a un lado solo. */
function respuestaDe(va, nombre, grado, seccion, alumnos, adultos) {
  familia.CFG = leido;
  familia.R = { va, nombre, grado, seccion, alumnos, adultos };
  return familia.mensaje();
}

const msg1 = respuestaDe(true, 'Juan Carlos Pérez Mejía', '6', '1', 1, 2);
ok('el mensaje trae la línea corta', /#METAS\|SI\|1\|2\|6\|1\|/.test(msg1),
  msg1.split('\n').pop());
ok('el mensaje se entiende sin la línea corta', /SÍ VAMOS/.test(msg1) && /3 personas/.test(msg1));
ok('dice cuánto va a pagar', /L 450/.test(msg1), msg1);

const p1 = maestro.excParsear(msg1);
ok('se lee una respuesta del mensaje entero', p1.length === 1);
ok('con su nombre, grado, sección y personas',
  p1[0] && p1[0].va === true && p1[0].nombre === 'Juan Carlos Pérez Mejía' &&
  p1[0].grado === '6' && p1[0].seccion === '1' && p1[0].alumnos === 1 && p1[0].adultos === 2,
  JSON.stringify(p1[0]));

/* Como llega de verdad: varios mensajes copiados de golpe, con el sello de
   fecha y el nombre del contacto que WhatsApp le pega delante a cada uno. */
const pegote =
  '[8/8/26, 10:32] Mamá de Juan: ' + msg1.replace(/\n/g, '\n') + '\n' +
  '[8/8/26, 10:41] Doña Marta: ' + respuestaDe(true, 'Keyla Fernández', '3', 'A', 2, 1) + '\n' +
  '[8/8/26, 11:02] +504 9876-5432: ' + respuestaDe(false, 'Óscar Andino Cruz', '6', '1', 0, 0) + '\n' +
  'buenas tardes profe, gracias por avisar 🙏\n';
const p2 = maestro.excParsear(pegote);
ok('lee las 3 de un pegote con sellos de fecha y charla suelta', p2.length === 3,
  'leyó ' + p2.length);
ok('distingue el que dijo que NO', p2.filter(r => !r.va).length === 1);

/* ══════════ 3 · las cuentas ══════════ */
console.log('\n🚌 Las cuentas: personas, buses y dinero');

const e = { precio: '150', cap: '45', respuestas: p2.slice() };
ok('cuenta 6 personas (3+1 y 2 que no van)', maestro.excPersonas(e) === 6, String(maestro.excPersonas(e)));
ok('con 45 por bus, 1 bus', maestro.excBuses(e) === 1, String(maestro.excBuses(e)));
ok('sobran 39 campos', maestro.excSobran(e) === 39, String(maestro.excSobran(e)));
ok('debería recogerse L 900', maestro.excDinero(e) === 900, String(maestro.excDinero(e)));

/* El bus que se pasa por UNA persona: es justo el caso donde equivocarse
   cuesta un bus entero de alquiler. */
const e2 = { precio: '150', cap: '45', respuestas: [{ va: 1, alumnos: 46, adultos: 0, nombre: 'x', grado: '1', seccion: '1' }] };
ok('46 personas en buses de 45 = 2 buses', maestro.excBuses(e2) === 2, String(maestro.excBuses(e2)));
const e3 = { precio: '0', cap: '45', respuestas: [] };
ok('sin nadie confirmado, 0 buses (no 1)', maestro.excBuses(e3) === 0, String(maestro.excBuses(e3)));

/* Contestar dos veces = corregirse, no apartar campos de más. */
console.log('\n✏️ Corregirse: la última respuesta manda');
const a = { va: true, alumnos: 1, adultos: 3, grado: '6', seccion: '1', nombre: 'Juan Perez' };
const b = { va: true, alumnos: 1, adultos: 0, grado: '6', seccion: '1', nombre: 'Juan Carlos Pérez Mejía' };
ok('«Juan Perez» y «Juan Carlos Pérez Mejía» son el mismo niño',
  maestro.excMismaResp(a, b));
ok('«Juan Pérez» y «Juana Pérez» NO son el mismo',
  !maestro.excMismoNombre('Juan Pérez Mejía', 'Juana Pérez Mejía'));
ok('el mismo nombre en otra sección NO es el mismo niño',
  !maestro.excMismaResp(a, Object.assign({}, b, { seccion: '2' })));

/* ══════════ 4 · el número de WhatsApp ══════════ */
console.log('\n📞 El número del maestro');
ok('8 dígitos hondureños reciben su 504', maestro.excWaNum('9999-8888') === '50499998888',
  maestro.excWaNum('9999-8888'));
ok('con el 504 puesto no se duplica', maestro.excWaNum('+504 9999 8888') === '50499998888',
  maestro.excWaNum('+504 9999 8888'));
ok('un número de otro país se respeta', maestro.excWaNum('+1 305 555 0199') === '13055550199',
  maestro.excWaNum('+1 305 555 0199'));

/* ══════════ 5 · las dos copias del codificador ══════════ */
console.log('\n👯 Las dos copias del código del enlace');
ok('«Mi aula» y excursion.html empacan IGUAL',
  maestro.excEmpacar(['a', 'ñ', '🚂']) === familia.excEmpacar(['a', 'ñ', '🚂']));
ok('los dos tienen la MISMA lista de campos, en el mismo orden',
  maestro.EXC_CAMPOS.join(',') === familia.EXC_CAMPOS.join(','),
  'app: ' + maestro.EXC_CAMPOS.join(',') + '\n      web: ' + familia.EXC_CAMPOS.join(','));

console.log('\n' + (fallos ? '✘ ' + fallos + ' fallo(s) de ' + pruebas
  : '✔ Las ' + pruebas + ' comprobaciones pasaron') + '\n');
process.exit(fallos ? 1 : 0);
