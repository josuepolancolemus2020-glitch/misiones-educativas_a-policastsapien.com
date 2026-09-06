/*
  M.E.T.A.S — _dev/verifica-sin-autoavance.js

  El quiz y el «Completa» avanzaban solos a los 1,6 segundos. Medido con
  capturas: a los 0,3 s la respuesta correcta estaba marcada en verde; a los
  1,75 s la pantalla ya decía «Pregunta 2 de 9», la correcta había
  desaparecido, y el «✗ Incorrecto» seguía colgado DEBAJO de la pregunta
  siguiente —que el alumno todavía no había contestado—. O sea: el que falla
  no llega a ver qué era lo correcto, y encima lee un «incorrecto» que se
  refiere a otra pregunta. Es la retroalimentación al revés.

  Ahora avanza el alumno con ▶ Siguiente. Esta sonda vigila las dos mitades:
  que al fallar la corrección SIGA en pantalla pasado el tiempo viejo, y que
  al pasar de pregunta el mensaje anterior se haya borrado.
*/
const { abrir } = require('./lib-navegador');
const glob = require('fs');
const path = require('path');
const BASE = process.env.BASE || 'http://localhost:8123';

// una muestra de misiones de materias distintas; el resto lo cubre la lectura
// del archivo, más abajo, que sí mira las 66
const MUESTRA = [
  { dir: '2y3ciclo-fracciones',        pag: 'fracciones.html' },
  { dir: '2y3ciclo-la-celula',         pag: 'la-celula.html' },
  { dir: '2y3ciclo-verbos',            pag: 'verbos-II-III-ciclo-basica.html' },
  { dir: '2y3ciclo-mayas-precolombinas', pag: 'mayas-precolombinas.html' },
];

let fallos = 0;
const ok = (bien, txt, extra) => {
  if (!bien) fallos++;
  console.log((bien ? '  ✓ ' : '  ✘ ') + txt + (extra !== undefined ? '  → ' + JSON.stringify(extra) : ''));
};

// ---------- 1 · lectura del archivo: las 66, sin abrir el navegador ----------
function revisarArchivos() {
  console.log('\nTodas las misiones (leídas del archivo)');
  const dirs = glob.readdirSync('misiones').filter(d => glob.statSync(path.join('misiones', d)).isDirectory());
  const conAuto = [], sinBoton = [], sinLimpiar = [];
  for (const d of dirs) {
    const base = path.join('misiones', d);
    const jsFiles = glob.readdirSync(path.join(base, 'js')).filter(x => x.endsWith('.js') && !x.includes('html2canvas') && !x.endsWith('-en.js'));
    const js = jsFiles.map(x => glob.readFileSync(path.join(base, 'js', x), 'utf8')).join('\n');
    const htmls = glob.readdirSync(base).filter(x => x.endsWith('.html'));
    const htm = htmls.map(x => glob.readFileSync(path.join(base, x), 'utf8')).join('\n');
    for (const [fn, show, next, fb] of [['checkQz', 'showQz', 'nextQz', 'fbQz'], ['checkCmp', 'showCmp', 'nextCmp', 'fbCmp']]) {
      if (js.indexOf('function ' + fn) < 0) continue;
      // cualquier retardo, no solo 1600: había un segundo autoavance de 3,5 s
      // escondido en la rama del fallo de 21 misiones, y uno de 2 s en sustantivos
      if (new RegExp('setTimeout\\([^;]{0,200}?' + show + '\\(\\)').test(js)) conAuto.push(d + '·' + fn);
      if (js.indexOf('function ' + next) < 0 || htm.indexOf('onclick="' + next + '()"') < 0) sinBoton.push(d + '·' + next);
      // la corrección anterior se borra al pintar lo siguiente
      // se mira el cuerpo entero de la función, no sus primeros caracteres
      const m = js.match(new RegExp('function\\s+' + show + '\\s*\\(\\s*\\)\\s*\\{([\\s\\S]*?)\\n(?=function |// )'));
      if (!m || m[1].indexOf(fb) < 0) sinLimpiar.push(d + '·' + show);
    }
  }
  ok(conAuto.length === 0, 'ninguna misión avanza sola a los 1,6 s', conAuto.slice(0, 6));
  ok(sinBoton.length === 0, 'todas tienen ▶ Siguiente, con su función y su botón', sinBoton.slice(0, 6));
  ok(sinLimpiar.length === 0, 'todas borran la corrección al pintar lo siguiente', sinLimpiar.slice(0, 6));
}

// ---------- 2 · en el navegador, sobre una muestra ----------
(async () => {
  revisarArchivos();
  const nav = await abrir({ args: ['--no-sandbox'] });

  for (const m of MUESTRA) {
    console.log('\n' + m.dir);
    const ctx = await nav.newContext({ viewport: { width: 393, height: 873 }, isMobile: true, hasTouch: true, locale: 'es-HN' });
    await ctx.route('**/*.supabase.co/**', r => r.abort());
    const pag = await ctx.newPage();
    const errores = [];
    pag.on('pageerror', e => errores.push(e.message));
    await pag.goto(`${BASE}/misiones/${m.dir}/${m.pag}`, { waitUntil: 'domcontentloaded' });
    await pag.waitForFunction(() => typeof window.checkQz === 'function' && typeof window.nextQz === 'function', { timeout: 15000 });

    // contesta MAL la primera pregunta a propósito
    // qzData es una constante del módulo y no se puede leer desde fuera; se
    // falla a propósito probando la primera opción y, si acierta, la siguiente
    const antes = await pag.evaluate(() => {
      const estado = () => ({
        prog: document.getElementById('qzProg').textContent,
        marcadas: document.querySelectorAll('.qz-opt.correct').length,
        fallada: document.querySelectorAll('.qz-opt.wrong').length,
        fb: document.getElementById('fbQz').classList.contains('show'),
      });
      for (let intento = 0; intento < 8; intento++) {
        const ops = [...document.querySelectorAll('.qz-opt')];
        if (!ops.length) break;
        ops[intento % ops.length].click();
        window.checkQz();
        const e = estado();
        if (e.fallada === 1) return e;   // conseguido: contestó mal
        window.nextQz();
      }
      return estado();
    });
    ok(antes.fallada === 1 && antes.marcadas === 1 && antes.fb, 'al fallar, se marca la correcta y sale el mensaje', antes);

    // pasado el tiempo del autoavance viejo, la corrección SIGUE ahí
    await pag.waitForTimeout(2200);
    const luego = await pag.evaluate(() => ({
      prog: document.getElementById('qzProg').textContent,
      marcadas: document.querySelectorAll('.qz-opt.correct').length,
      fb: document.getElementById('fbQz').classList.contains('show'),
    }));
    ok(luego.prog === antes.prog, 'a los 2,2 s NO ha cambiado de pregunta solo', luego.prog);
    ok(luego.marcadas === 1, 'la respuesta correcta sigue marcada', luego.marcadas);
    ok(luego.fb, 'y la corrección sigue en pantalla');

    // ▶ Siguiente avanza y limpia el mensaje anterior
    const tras = await pag.evaluate(() => {
      window.nextQz();
      return {
        prog: document.getElementById('qzProg').textContent,
        fb: document.getElementById('fbQz').classList.contains('show'),
        marcadas: document.querySelectorAll('.qz-opt.correct').length,
      };
    });
    ok(tras.prog !== antes.prog, '▶ Siguiente sí avanza', tras.prog);
    ok(!tras.fb, 'y el «Incorrecto» de la anterior ya NO cuelga debajo', tras.fb);
    ok(tras.marcadas === 0, 'la pregunta nueva sale limpia', tras.marcadas);

    // tocar Siguiente sin verificar no deja al alumno mirando un botón mudo
    const mudo = await pag.evaluate(() => {
      const p = document.getElementById('qzProg').textContent;
      window.nextQz();
      return { igual: document.getElementById('qzProg').textContent === p,
               avisa: document.getElementById('fbQz').classList.contains('show') };
    });
    ok(mudo.igual && mudo.avisa, 'sin verificar, ▶ Siguiente no salta y lo dice', mudo);

    ok(errores.length === 0, 'sin errores de JavaScript', errores.slice(0, 2));
    await ctx.close();
  }

  await nav.close();
  console.log('\n' + (fallos ? `✘ ${fallos} comprobaciones fallaron` : '✓ la corrección se lee; el alumno avanza cuando quiere'));
  process.exit(fallos ? 1 : 0);
})();
