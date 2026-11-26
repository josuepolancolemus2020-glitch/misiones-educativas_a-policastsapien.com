#!/usr/bin/env node
/* ============================================================
   M.E.T.A.S · Las misiones usan el motor y no su copia
   ------------------------------------------------------------
   El generador de las formas de examen estaba copiado, idéntico, en 84
   misiones. Ahora vive una sola vez en `js/motor-misiones.js`. Esto
   vigila que siga así:

   · ninguna misión vuelve a traer su copia (pasa al crear una misión
     nueva copiando una de antes de este cambio);
   · toda misión que usa esas funciones carga el motor, lo carga ANTES
     que su propio archivo y con el mismo sello ?v= que mision.html;
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
const EN_EL_MOTOR = ['_evalRng', '_shuffleF', '_pickF', '_injectFormaSel',
  /* El reparto de la prueba de pensamiento crítico (v538). */
  '_repartoCritica', '_formasCritica', '_conjuntosCritica', '_turnoCritica', '_selectorCritica'];

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

/* El sello con que mision.html pide el motor es el de referencia. Si una
   página de misión lo pidiera con otro, o sin ninguno, dos teléfonos (o
   la puerta y la misión en el mismo teléfono) podrían correr dos motores
   distintos después de publicar. */
const SELLO = (/src="js\/motor-misiones\.js(\?v=\d+)"/.exec(fs.readFileSync(path.join(RAIZ, 'mision.html'), 'utf8')) || [])[1];
ok('mision.html pide el motor con sello (' + SELLO + ')', !!SELLO);
const otroSello = [];
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
    /* La guarda es para el archivo único de antes, que una página guardada
       puede pedir sin haber pedido el motor. Una misión que ya usa la
       plantilla del motor no la necesita: sus archivos tienen nombres
       nuevos, que la página de antes no conoce. */
    const conPlantilla = paginas.some(p => /<script[^>]*\ssrc="[^"]*js\/motor-mision\.js/.test(p.t));
    if (!conPlantilla && !/typeof _evalRng !== 'function'[\s\S]{0,200}motor-misiones\.js/.test(codigo)) sinGuarda.push(carpeta + '/js/' + g);
    /* Cada página que carga este archivo tiene que cargar antes el motor,
       y por una ruta que llegue de verdad a js/motor-misiones.js. */
    const reSuyo = new RegExp('<script[^>]*\\ssrc="js/' + esc(g) + '(?:\\?[^"]*)?"');
    const suyas = paginas.filter(p => reSuyo.test(p.t));
    if (!suyas.length) sinMotor.push(carpeta + '/js/' + g + ': ninguna página lo carga');
    suyas.forEach(p => {
      const m = /<script[^>]*\ssrc="([^"]*motor-misiones\.js)(\?v=\d+)?"/.exec(p.t);
      if (!m || path.resolve(dir, m[1]) !== MOTOR) { sinMotor.push(carpeta + '/' + p.f); return; }
      if (m[2] !== SELLO) otroSello.push(carpeta + '/' + p.f + ': ' + (m[2] || 'sin sello'));
      if (m.index > reSuyo.exec(p.t).index) motorDespues.push(carpeta + '/' + p.f);
    });
  });
  /* Una misión de la plantilla puede no llamar al motor desde ningún
     archivo suyo: el examen y la prueba crítica los arma js/motor-mision.js
     (así quedó La Célula al pasar su prueba crítica a la plantilla). Usa el
     examen por formas igual, y su página tiene que pedir el motor por la
     misma ruta y con el mismo sello que las demás. */
  paginas.filter(p => /<script[^>]*\ssrc="[^"]*js\/motor-mision\.js/.test(p.t)).forEach(p => {
    usaAlguna = true;
    const m = /<script[^>]*\ssrc="([^"]*motor-misiones\.js)(\?v=\d+)?"/.exec(p.t);
    if (!m || path.resolve(dir, m[1]) !== MOTOR) { sinMotor.push(carpeta + '/' + p.f); return; }
    if (m[2] !== SELLO) otroSello.push(carpeta + '/' + p.f + ': ' + (m[2] || 'sin sello'));
  });
  (usaAlguna ? migradas : sinExamen).push(carpeta);
});

ok('ninguna misión trae su copia de lo que ya está en el motor', conCopia.length === 0, lista(conCopia));
ok('las ' + migradas.length + ' misiones que usan el examen por formas cargan el motor', sinMotor.length === 0, lista(sinMotor));
ok('todas lo piden con el mismo sello que mision.html (' + SELLO + ')', otroSello.length === 0, lista(otroSello));
ok('y lo cargan antes que su propio archivo', motorDespues.length === 0, lista(motorDespues));
ok('y traen la guarda para la página guardada de antes', sinGuarda.length === 0, lista(sinGuarda));
ok('son 84 o más (si bajan, una misión dejó de usar el examen por formas)', migradas.length >= 84, '      son ' + migradas.length);
console.log('  · no usan el examen por formas del motor (' + sinExamen.length + '): ' + sinExamen.join(', '));

/* ── las misiones que ya usan la plantilla del motor ──────────── */
/* Una misión migrada son tres archivos: el motor (lo que toda misión
   hace), su contenido (solo datos) y lo propio (su laboratorio). Aquí se
   vigila que cada cosa esté en su sitio y que no vuelva a mezclarse. */
console.log('— Las misiones que usan la plantilla del motor (js/motor-mision.js) —');
const PLANTILLA = path.join(RAIZ, 'js', 'motor-mision.js');
const plantilla = fs.readFileSync(PLANTILLA, 'utf8');
const nombresDe = codigo => {
  const fn = new Set(), dato = new Set();
  let m; const reF = /^(?:async\s+)?function\s+([\w$]+)/gm, reD = /^(?:const|let|var)\s+([\w$]+)/gm;
  while ((m = reF.exec(codigo))) fn.add(m[1]);
  while ((m = reD.exec(codigo))) dato.add(m[1]);
  return { fn, dato };
};
const delMotor = nombresDe(plantilla);
ok('el motor no trae ningún dato de ninguna misión (ni banco ni lista de contenido)',
  !/^(?:const|let|var)\s+(?:\w*Bank\w*|\w+Data|\w+DB|\w+Sets|\w+Pairs|ACHIEVEMENTS|lvls|SAVE_KEY|TEXTOS)\s*=/m.test(plantilla));

const piloto = [];
fs.readdirSync(DIR).sort().forEach(carpeta => {
  const dir = path.join(DIR, carpeta);
  if (!fs.statSync(dir).isDirectory()) return;
  fs.readdirSync(dir).filter(f => f.endsWith('.html')).forEach(f => {
    const t = fs.readFileSync(path.join(dir, f), 'utf8');
    if (/<script[^>]*\ssrc="[^"]*js\/motor-mision\.js/.test(t)) piloto.push({ carpeta, dir, f, t });
  });
});
ok('hay al menos una (' + piloto.map(p => p.carpeta).join(', ') + ')', piloto.length >= 1);

piloto.forEach(p => {
  const srcs = [...p.t.matchAll(/<script[^>]*\ssrc="([^"]+)"/g)].map(x => x[1]);
  const pos = re => srcs.findIndex(s => re.test(s));
  const iMotor = pos(/js\/motor-misiones\.js/), iPlant = pos(/js\/motor-mision\.js/), iCont = pos(/^js\/contenido\.js/);
  const suyos = srcs.filter(s => /^js\//.test(s)).map(s => s.split('?')[0]);
  const iPropio = srcs.findIndex((s, i) => i > iCont && /^js\//.test(s));
  ok(p.carpeta + ': carga motor-misiones → motor-mision → contenido → lo propio, en ese orden',
    iMotor >= 0 && iMotor < iPlant && iPlant < iCont && (iPropio < 0 || iCont < iPropio), '      orden: ' + srcs.join(' · '));
  /* El sello: los tres archivos de la misión con el mismo ?v=. */
  const sellos = srcs.filter(s => /js\/motor-mision\.js|^js\/(?!animacion-)/.test(s)).map(s => (s.split('?')[1] || 'sin sello'));
  ok(p.carpeta + ': el motor de la plantilla y sus archivos van con el mismo sello (' + sellos[0] + ')',
    sellos.length > 0 && sellos.every(x => x === sellos[0] && /^v=\d+$/.test(x)), '      ' + sellos.join(', '));

  /* contenido.js: solo datos. Se corre sin nada alrededor: si llamara a
     una función o tocara la página, reventaría aquí. Y lo que declara
     tiene que poder escribirse como JSON, o sea, no ser código. */
  const rutaCont = path.join(p.dir, 'js', 'contenido.js');
  const cont = fs.readFileSync(rutaCont, 'utf8');
  const nCont = nombresDe(cont);
  const caja = vm.createContext({});
  let errCont = '', noDatos = [];
  try {
    vm.runInContext(cont, caja, { filename: rutaCont });
    nCont.dato.forEach(n => {
      const v = vm.runInContext(n, caja);
      const j = JSON.stringify(v);
      if (j === undefined || JSON.stringify(JSON.parse(j)) !== j || /"\s*function|=>/.test(typeof v === 'function' ? 'function' : '')) noDatos.push(n);
      (function mira(x, camino) { if (typeof x === 'function') noDatos.push(camino); else if (x && typeof x === 'object') Object.keys(x).forEach(k => mira(x[k], camino + '.' + k)); })(v, n);
    });
  } catch (e) { errCont = e.message; }
  ok(p.carpeta + '/js/contenido.js: solo datos (' + nCont.dato.size + ' declaraciones, ninguna función, nada que toque la página)',
    !errCont && nCont.fn.size === 0 && noDatos.length === 0 && !/\bdocument\b|\bwindow\b|localStorage|=>/.test(cont.replace(/\/\*[\s\S]*?\*\/|^\s*\/\/.*$/gm, '').replace(/'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`/g, "''")),
    '      ' + (errCont || [...nCont.fn].concat(noDatos).join(', ')));
  /* Lo único que el motor no sabe suplir es el examen: los widgets que no
     traen datos se saltan, y los textos, la llave y los logros tienen
     reserva (lo prueba verifica-motor-arranque.js). Que la misión declare
     su título lo exige verifica-titulos-ajenos.js, que lo necesita para
     saber qué nombre es el suyo. */
  ok(p.carpeta + '/js/contenido.js: trae su examen (los cuatro bancos y EVAL_FORMAS)',
    ['evalTFBank', 'evalMCBank', 'evalCPBank', 'evalPRBank', 'EVAL_FORMAS'].every(n => nCont.dato.has(n)));
  /* La prueba crítica es opcional, pero entera: el motor la enseña solo si
     están todas sus piezas, y a una misión que olvidó un banco se le
     escondería la prueba sin que nadie lo notara. Lo mismo con los rótulos
     que la hoja lee de critTextos: uno que falte saldría «undefined». */
  const PIEZAS_CRITICA = ['critCaseBank', 'critErrorBank', 'critDecisionBank', 'critCompareBank', 'critCauseBank', 'critEffectBank', 'critCaseQuestions', 'critCaseGuides', 'critDecisionGuide', 'critTextos'];
  const piezas = PIEZAS_CRITICA.filter(n => nCont.dato.has(n));
  let rotulosFaltan = [];
  if (nCont.dato.has('critTextos') && !errCont) {
    const t = vm.runInContext('critTextos', caja) || {};
    rotulosFaltan = ['caso', 'decision', 'decisionPregunta', 'comparacionPregunta'].filter(k => typeof t[k] !== 'string' || !t[k].trim());
  }
  ok(p.carpeta + '/js/contenido.js: ' + (piezas.length ? 'trae la prueba crítica entera, con sus rótulos' : 'no trae prueba crítica (el motor no la enseña)'),
    (piezas.length === 0 || piezas.length === PIEZAS_CRITICA.length) && rotulosFaltan.length === 0,
    '      falta: ' + PIEZAS_CRITICA.filter(n => !nCont.dato.has(n)).concat(rotulosFaltan.map(k => 'critTextos.' + k)).join(', '));

  /* Lo propio: nada de lo que ya hace el motor, y ningún dato. */
  const repetidas = [], datosFuera = [];
  suyos.filter(s => s !== 'js/contenido.js' && !/animacion-/.test(s)).forEach(s => {
    const n = nombresDe(fs.readFileSync(path.join(p.dir, s), 'utf8'));
    n.fn.forEach(x => { if (delMotor.fn.has(x)) repetidas.push(s + ': ' + x); });
    n.dato.forEach(x => { if (nCont.dato.has(x) || /Bank|Data$|DB$/.test(x)) datosFuera.push(s + ': ' + x); });
  });
  ok(p.carpeta + ': su código propio no repite ninguna función del motor', repetidas.length === 0, lista(repetidas));
  ok(p.carpeta + ': su código propio no trae datos (van en contenido.js)', datosFuera.length === 0, lista(datosFuera));
  ok(p.carpeta + ': ya no existe el archivo único de antes', !fs.readdirSync(path.join(p.dir, 'js')).some(g => /function genEval\(/.test(fs.readFileSync(path.join(p.dir, 'js', g), 'utf8'))));
});

/* ── el service worker ───────────────────────────────────────── */
console.log('— El service worker —');
const sw = fs.readFileSync(path.join(RAIZ, 'sw.js'), 'utf8');
ok('guarda el motor y su plantilla con el armazón', /['"]\.\/js\/motor-misiones\.js['"]/.test(sw) && /['"]\.\/js\/motor-mision\.js['"]/.test(sw));

console.log(fallos === 0 ? '\n✅ ' + migradas.length + ' misiones usan el motor y ninguna trae su copia.' : '\n❌ ' + fallos + ' fallo(s).');
process.exit(fallos === 0 ? 0 : 1);
