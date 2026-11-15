#!/usr/bin/env node
/* ============================================================
   M.E.T.A.S · Las misiones usan el motor y no su copia
   ------------------------------------------------------------
   El generador de las formas de examen estaba copiado, idéntico, en 84
   misiones. Ahora vive una sola vez en `js/motor-misiones.js`. Esto
   vigila que siga así:

   · ninguna misión vuelve a traer su copia (pasa al crear una misión
     nueva copiando una de antes de este cambio);
   · toda misión que usa esas funciones carga el motor, y lo carga ANTES
     que su propio archivo;
   · la misión trae la guarda para el teléfono que abre una página
     guardada de antes, que no pide el motor;
   · el motor trae las cuatro funciones y el generador da los números
     de siempre.

   Que las formas salgan iguales lo comprueba `verifica-formas-oro.js`.
   Esta mira que la tubería esté bien puesta.

     node _dev/verifica-misiones-motor.js
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RAIZ = path.resolve(__dirname, '..');
const DIR = path.join(RAIZ, 'misiones');
const MOTOR = path.join(RAIZ, 'js', 'motor-misiones.js');

/* Lo que ya se pasó al motor. Al pasar otra tanda, se añade aquí. */
const EN_EL_MOTOR = ['_evalRng', '_shuffleF', '_pickF', '_injectFormaSel'];

let fallos = 0;
const ok = (nombre, cond, detalle) => {
  console.log((cond ? '  ✔ ' : '  ✘ ') + nombre);
  if (!cond) { fallos++; if (detalle) console.log(detalle); }
};
const lista = xs => xs.slice(0, 15).map(x => '      ' + x).join('\n') + (xs.length > 15 ? '\n      … y ' + (xs.length - 15) + ' más' : '');
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* ── el motor ────────────────────────────────────────────────── */
console.log('— El motor —');
const motor = fs.readFileSync(MOTOR, 'utf8');
const ventana = { document: {}, location: { search: '' }, URLSearchParams };
ventana.window = ventana;
vm.createContext(ventana);
let errorMotor = '';
try { vm.runInContext(motor, ventana, { filename: MOTOR }); } catch (e) { errorMotor = e.message; }
ok('carga sin error y sin hacer nada por su cuenta (no abre ninguna misión al cargarse)', !errorMotor, '      ' + errorMotor);
ok('publica ' + EN_EL_MOTOR.join(', '), EN_EL_MOTOR.every(n => typeof ventana[n] === 'function'),
  '      falta: ' + EN_EL_MOTOR.filter(n => typeof ventana[n] !== 'function').join(', '));

/* El generador v1, escrito aquí otra vez a propósito: es la definición
   contra la que se compara el del motor. Si alguien «mejora» el del
   motor, los números dejan de coincidir y las claves impresas dejan de
   valer. */
function rngDeSiempre(forma) {
  let s = (forma * 2654435761 + 909090909) >>> 0;
  return function () {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
if (typeof ventana._evalRng === 'function') {
  const distintos = [];
  /* Las semillas que usan las tres pruebas y Fin de grado en Español. */
  [0, 100000, 200000, 500000].forEach(base => {
    for (let f = 1; f <= 50; f++) {
      const a = ventana._evalRng(base + f), b = rngDeSiempre(base + f);
      for (let i = 0; i < 40; i++) if (a() !== b()) { distintos.push(base + f); break; }
    }
  });
  ok('el generador da los números de siempre (200 semillas, 40 números cada una)', distintos.length === 0, '      cambian las semillas: ' + distintos.slice(0, 10).join(', '));
  const banco = Array.from({ length: 10 }, (_, i) => 'p' + i);
  const antes = banco.slice();
  const esperado = (() => { const r = rngDeSiempre(7), a = banco.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; })();
  ok('barajar y elegir dan lo de siempre y no tocan el banco',
    JSON.stringify(ventana._shuffleF(banco, ventana._evalRng(7))) === JSON.stringify(esperado) &&
    JSON.stringify(ventana._pickF(banco, 5, ventana._evalRng(7))) === JSON.stringify(esperado.slice(0, 5)) &&
    JSON.stringify(banco) === JSON.stringify(antes));
}

/* ── las misiones ────────────────────────────────────────────── */
console.log('— Las misiones —');
const define = n => new RegExp('(?:^|[;{}\\s])(?:function\\s+' + esc(n) + '\\s*\\(|(?:const|let|var)\\s+' + esc(n) + '\\s*=)', 'm');
const usa = n => new RegExp('(?:^|[^\\w$.])' + esc(n) + '\\s*\\(');

const conCopia = [], sinMotor = [], motorDespues = [], sinGuarda = [], migradas = [], sinExamen = [];
fs.readdirSync(DIR).sort().forEach(carpeta => {
  const dir = path.join(DIR, carpeta);
  if (!fs.statSync(dir).isDirectory()) return;
  const dirJs = path.join(dir, 'js');
  const guiones = fs.existsSync(dirJs) ? fs.readdirSync(dirJs).filter(f => f.endsWith('.js') && !/html2canvas/.test(f)) : [];
  const paginas = fs.readdirSync(dir).filter(f => f.endsWith('.html')).map(f => ({ f, t: fs.readFileSync(path.join(dir, f), 'utf8') }));
  let usaAlguna = false;
  guiones.forEach(g => {
    const codigo = fs.readFileSync(path.join(dirJs, g), 'utf8');
    const copias = EN_EL_MOTOR.filter(n => define(n).test(codigo));
    if (copias.length) conCopia.push(carpeta + '/js/' + g + ': ' + copias.join(', '));
    if (!EN_EL_MOTOR.some(n => usa(n).test(codigo))) return;
    usaAlguna = true;
    if (!/typeof _evalRng !== 'function'[\s\S]{0,200}motor-misiones\.js/.test(codigo)) sinGuarda.push(carpeta + '/js/' + g);
    /* Cada página que carga este archivo tiene que cargar antes el motor,
       y por una ruta que llegue de verdad a js/motor-misiones.js. */
    const reSuyo = new RegExp('<script[^>]*\\ssrc="js/' + esc(g) + '(?:\\?[^"]*)?"');
    const suyas = paginas.filter(p => reSuyo.test(p.t));
    if (!suyas.length) sinMotor.push(carpeta + '/js/' + g + ': ninguna página lo carga');
    suyas.forEach(p => {
      const m = /<script[^>]*\ssrc="([^"]*motor-misiones\.js)(?:\?[^"]*)?"/.exec(p.t);
      if (!m || path.resolve(dir, m[1]) !== MOTOR) { sinMotor.push(carpeta + '/' + p.f); return; }
      if (m.index > reSuyo.exec(p.t).index) motorDespues.push(carpeta + '/' + p.f);
    });
  });
  (usaAlguna ? migradas : sinExamen).push(carpeta);
});

ok('ninguna misión trae su copia de lo que ya está en el motor', conCopia.length === 0, lista(conCopia));
ok('las ' + migradas.length + ' misiones que usan el examen por formas cargan el motor', sinMotor.length === 0, lista(sinMotor));
ok('y lo cargan antes que su propio archivo', motorDespues.length === 0, lista(motorDespues));
ok('y traen la guarda para la página guardada de antes', sinGuarda.length === 0, lista(sinGuarda));
ok('son 84 o más (si bajan, una misión dejó de usar el examen por formas)', migradas.length >= 84, '      son ' + migradas.length);
console.log('  · no usan el examen por formas del motor (' + sinExamen.length + '): ' + sinExamen.join(', '));

/* ── el service worker ───────────────────────────────────────── */
console.log('— El service worker —');
ok('guarda el motor con el armazón', /['"]\.\/js\/motor-misiones\.js['"]/.test(fs.readFileSync(path.join(RAIZ, 'sw.js'), 'utf8')));

console.log(fallos === 0 ? '\n✅ ' + migradas.length + ' misiones usan el motor y ninguna trae su copia.' : '\n❌ ' + fallos + ' fallo(s).');
process.exit(fallos === 0 ? 0 : 1);
