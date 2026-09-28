/*
  M.E.T.A.S — _dev/verifica-fracciones-equivalentes.js

  La misión enseña a simplificar en ✂️ Simplificar y en las flashcards, y
  después su evaluación conceptual le quitaba 5 puntos al alumno que escribía
  «1/2» donde la pauta decía «2/4» —porque comparaba TEXTO, no valor—. Esa
  nota es la que js/metas-registro.js anota en la Evidencia del maestro.
  La prueba operativa sí aceptaba equivalentes desde siempre, lo que hacía la
  contradicción más grande: la misma misión premiaba y castigaba lo mismo.
*/
const { abrir } = require('./lib-navegador');
const BASE = process.env.BASE || 'http://localhost:8123';

let fallos = 0;
const ok = (bien, txt, extra) => {
  if (!bien) fallos++;
  console.log((bien ? '  ✓ ' : '  ✘ ') + txt + (extra !== undefined ? '  → ' + JSON.stringify(extra) : ''));
};

(async () => {
  const nav = await abrir({ args: ['--no-sandbox'] });
  const ctx = await nav.newContext({ viewport: { width: 393, height: 873 }, isMobile: true, hasTouch: true, locale: 'es-HN' });
  await ctx.route('**/*.supabase.co/**', r => r.abort());
  const pag = await ctx.newPage();
  const errores = [];
  pag.on('pageerror', e => errores.push(e.message));
  await pag.goto(`${BASE}/misiones/2y3ciclo-fracciones/fracciones.html`, { waitUntil: 'domcontentloaded' });
  await pag.waitForFunction(() => typeof window.isCpOk === 'function', { timeout: 15000 });

  console.log('La forma equivalente vale, venga simplificada o no');
  const casos = await pag.evaluate(() => ([
    ['1/2', '1/2'], ['2/4', '1/2'], ['3/6', '1/2'], ['4/8', '1/2'],
    ['3/4', '3/4'], ['6/8', '3/4'],
    ['1/3', '1/2'], ['2/3', '3/4'],
    ['numerador', 'numerador'], ['denominador', 'numerador'],
  ].map(([alumno, pauta]) => [alumno, pauta, window.isCpOk(alumno, pauta)])));
  const espera = { '1/2|1/2': true, '2/4|1/2': true, '3/6|1/2': true, '4/8|1/2': true,
                   '3/4|3/4': true, '6/8|3/4': true,
                   '1/3|1/2': false, '2/3|3/4': false,
                   'numerador|numerador': true, 'denominador|numerador': false };
  for (const [al, pa, r] of casos) {
    const e = espera[al + '|' + pa];
    ok(r === e, `el alumno escribe «${al}» y la pauta dice «${pa}» → ${r ? 'vale' : 'no vale'}`);
  }

  // evalCPBank y enfermedadData son constantes del módulo y no se pueden leer
  // desde fuera; se comprueban en el archivo, que es donde viven.
  const fuente = require('fs').readFileSync('misiones/2y3ciclo-fracciones/js/fracciones.js', 'utf8');

  /* Esto miraba UNA pregunta, «3/4 − 1/4 = ___», cuya pauta decía «2/4». La
     pregunta salió del banco el 25 de septiembre de 2026, en la revisión de
     «ninguna pregunta le regala la respuesta a otra», y la sonda se quedó roja
     buscando algo que ya no existe: una sonda que falla sin avería enseña a no
     mirarla. Lo que de verdad vigilaba sigue valiendo para todo el banco: que
     ninguna respuesta modelo en forma de fracción se pueda simplificar, que es
     la que el maestro lee en la pauta. */
  console.log('\nY las pautas del completar ya vienen simplificadas');
  const banco = (fuente.match(/const evalCPBank=\[([\s\S]*?)\n\];/) || [])[1] || '';
  const fracs = [...banco.matchAll(/a:'(\d+)\/(\d+)'/g)].map(m => [+m[1], +m[2]]);
  const mcd = (a, b) => (b ? mcd(b, a % b) : a);
  const sinSimplificar = fracs.filter(([n, d]) => mcd(n, d) !== 1).map(([n, d]) => `${n}/${d}`);
  ok(fracs.length > 0 && sinSimplificar.length === 0,
    `ninguna de las ${fracs.length} respuestas modelo en fracción se puede simplificar`, sinSimplificar);

  console.log('\nEl problema del pastel enseña a simplificar en vez de callarlo');
  const conSimp = (fuente.match(/characteristic:'[^']+',simp:'[^']+'/g) || []);
  ok(conSimp.length === 3, 'los tres resultados que se pueden simplificar lo dicen', conSimp.length);
  ok(/¡Correcto! \+3 XP'\+\(d\.simp\?/.test(fuente), 'y el acierto lo dice en pantalla');

  ok(errores.length === 0, 'sin errores de JavaScript', errores.slice(0, 2));
  await nav.close();
  console.log('\n' + (fallos ? `✘ ${fallos} comprobaciones fallaron` : '✓ simplificar ya no le cuesta puntos al alumno'));
  process.exit(fallos ? 1 : 0);
})();
