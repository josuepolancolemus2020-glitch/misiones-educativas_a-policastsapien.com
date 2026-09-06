/*
  M.E.T.A.S — _dev/verifica-buscador.js

  El buscador de misiones distinguía tildes. Medido: «numeros» daba 0
  resultados y «números» daba 3; «millon» 0 y «millón» 2; «angulos» 0.
  Un teclado de teléfono no pone tildes solo y un niño de 4º no las escribe,
  así que la lista se le quedaba vacía y concluía que su tema no existe.

  Esta sonda escribe en el buscador como escribe un niño —sin tildes, y a
  veces con las palabras cambiadas de orden— y exige que encuentre lo mismo
  que con la ortografía perfecta.
*/
const { abrir } = require('./lib-navegador');
const BASE = process.env.BASE || 'http://localhost:8123';

// pares «como se escribe de verdad» → «como se escribiría con tildes»
const PARES = [
  ['numeros', 'números'],
  ['millon', 'millón'],
  ['angulos', 'ángulos'],
  ['matematicas', 'matemáticas'],
  ['division', 'división'],
  ['celula', 'célula'],
];
// búsquedas que tienen que dar algo, aunque el orden no sea el del título
const SUELTAS = ['numeros grandes', 'grandes numeros', 'NUMEROS', '  numeros  '];

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

  await pag.goto(`${BASE}/index.html?view=misiones`, { waitUntil: 'domcontentloaded' });
  await pag.waitForFunction(() => typeof window.renderMissions === 'function', { timeout: 15000 });

  // cuenta cuántas tarjetas salen con una búsqueda dada
  const cuenta = q => pag.evaluate(t => {
    window.renderMissions('all', t);
    return document.querySelectorAll('#missions-container .mission-card').length;
  }, q);

  const total = await cuenta('');
  ok(total > 0, `la lista sin buscar trae misiones (${total})`, total);

  console.log('\nSin tildes tiene que encontrar lo mismo que con tildes');
  for (const [sin, con] of PARES) {
    const a = await cuenta(sin), b = await cuenta(con);
    ok(a === b && a > 0, `«${sin}» = «${con}»`, { [sin]: a, [con]: b });
  }

  console.log('\nComo lo escribe un niño');
  for (const q of SUELTAS) {
    const n = await cuenta(q);
    ok(n > 0, `«${q}» encuentra algo`, n);
  }

  console.log('\nY sigue filtrando de verdad');
  const basura = await cuenta('zzzzqqq');
  ok(basura === 0, 'una palabra que no existe no devuelve nada', basura);
  const mate = await cuenta('matematicas');
  ok(mate < total, 'buscar una materia no devuelve el catálogo entero', { mate, total });

  // El buscador de maestros del director usa el mismo ayudante y no se puede
  // recorrer sin cuenta, así que se comprueba el ayudante directamente: un
  // director escribe «cortes» y tiene que salirle Cortés.
  console.log('\nEl ayudante que comparten los dos buscadores');
  const casos = await pag.evaluate(() => ['Cortés', 'José', 'ÁNGULOS', 'Atlántida', 'Comayagüela']
    .map(t => [t, window.sinTildes(t)]));
  const esperado = { 'Cortés': 'cortes', 'José': 'jose', 'ÁNGULOS': 'angulos',
                     'Atlántida': 'atlantida', 'Comayagüela': 'comayaguela' };
  for (const [dentro, fuera] of casos) ok(fuera === esperado[dentro], `«${dentro}» → «${fuera}»`);

  ok(errores.length === 0, 'sin errores de JavaScript', errores.slice(0, 2));

  await nav.close();
  console.log('\n' + (fallos ? `✘ ${fallos} comprobaciones fallaron` : '✓ el buscador encuentra aunque no se escriban las tildes'));
  process.exit(fallos ? 1 : 0);
})();
