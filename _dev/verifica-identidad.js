/* ============================================================
   M.E.T.A.S · Dos niños no pueden ser el mismo, ni uno ser tres
   ------------------------------------------------------------
   El problema de fondo nº 2 del informe, en tres piezas:

   1. Estadísticas emparejaba por número de lista y por los
      DÍGITOS del grado, sin mirar nunca la sección: el número 7
      de 6º-1 y el número 7 de 6º-2 eran el mismo alumno. La
      madre firmaba un informe con la práctica del hijo de otra.
   2. Por el otro lado se partía: «Ana López» y «ana lopez» eran
      dos alumnas, y el número de lista era OPCIONAL aunque es la
      única llave con la que el maestro encuentra a su alumno.
   3. En un teléfono compartido —la norma en estas aulas—
      «Cambiar alumno» no cambiaba de dueño el avance: Ana juega,
      entra Bruno, y el reporte de Bruno salía con el XP, las
      secciones y los logros de Ana.

   Uso:  node _dev/servidor-estatico.js   (en otra terminal)
         node _dev/verifica-identidad.js
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { abrir } = require('./lib-navegador');

const RAIZ = path.resolve(__dirname, '..');
const BASE = 'http://localhost:8123';

let fallos = 0;
const ok = (nombre, cond, extra) => {
  console.log((cond ? '  ✔ ' : '  ✘ ') + nombre + (cond || extra === undefined ? '' : ' → ' + JSON.stringify(extra)));
  if (!cond) fallos++;
};

/* estMisiones y sus ayudantes se prueban SIN navegador: son función pura sobre
   la caché de la nube, y así la prueba dice exactamente qué entra y qué no. */
function cargarEstadisticas(grupos, cacheNube) {
  const ctx = {
    console,
    MISSIONS: [],
    adState: () => ({ v: 2, activo: 'G1', grupos }),
    adEsc: t => String(t == null ? '' : t),
    adGradoSeccion: (g, s) => String(g) + 'º-' + String(s),
    adNotaCat: () => ({ color: '#000' }),
    localStorage: { getItem: () => null, setItem: () => {} },
    document: { getElementById: () => null },
    window: {},
  };
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(RAIZ, 'js/tools/estadisticas-alumno.js'), 'utf8'),
                  ctx, { filename: 'estadisticas-alumno.js' });
  /* estNubeCache lee de localStorage; se sustituye por la caché de la prueba. */
  vm.runInContext('estNubeCache = function () { return ' + JSON.stringify(cacheNube) + '; };', ctx);
  return ctx;
}

const fila = (num, grado, alumno, nota, mision) => ({
  codigo_lista: String(num), grado, alumno, mision, tipo: 'evaluacion',
  nota, base: 100, fecha: '2026-09-07T10:00:00Z'
});

(async () => {
  console.log('\n════════ LA IDENTIDAD DEL ALUMNO ════════\n');

  /* ── 1. Dos grupos del mismo grado ───────────────────────── */
  console.log('1) El nº 7 de 6º-1 y el nº 7 de 6º-2 son DOS niños');
  const dosGrupos = [
    { id: 'G1', grado: '6', seccion: '1', escuela: 'E' },
    { id: 'G2', grado: '6', seccion: '2', escuela: 'E' },
  ];
  const cache = { t: 1, resultados: [
    fila(7, '6º-1', 'Ana López',   90, 'mision-a'),
    fila(7, '6º-2', 'Bruno Mejía', 40, 'mision-b'),
    fila(7, '6',    'Sin sección', 55, 'mision-c'),
  ], progreso: [] };

  let ctx = cargarEstadisticas(dosGrupos, cache);
  const uno = vm.runInContext('estMisiones({grado:"6",seccion:"1"}, 7)', ctx);
  ok('el de 6º-1 recibe SOLO lo suyo', uno.filas.length === 1 && uno.filas[0].mision === 'mision-a',
     uno.filas.map(f => f.mision));
  ok('y no la nota del otro (90, no 40)', uno.filas[0] && uno.filas[0].mejor === 90);

  ctx = cargarEstadisticas(dosGrupos, cache);
  const dos = vm.runInContext('estMisiones({grado:"6",seccion:"2"}, 7)', ctx);
  ok('el de 6º-2 recibe SOLO lo suyo', dos.filas.length === 1 && dos.filas[0].mision === 'mision-b',
     dos.filas.map(f => f.mision));

  console.log('\n2) Y lo que no se puede asignar, se DICE (no se reparte)');
  ok('la fila sin sección no se cuenta para ninguno', uno.sinSeccion === 1 && dos.sinSeccion === 1,
     { uno: uno.sinSeccion, dos: dos.sinSeccion });

  /* ── 3. Un solo grupo: no hay ambigüedad ─────────────────── */
  console.log('\n3) Con un solo grupo en ese grado, un «6» pelado SÍ es suyo');
  ctx = cargarEstadisticas([{ id: 'G1', grado: '6', seccion: '1', escuela: 'E' }], cache);
  const solo = vm.runInContext('estMisiones({grado:"6",seccion:"1"}, 7)', ctx);
  ok('entra la suya y la que no dice sección', solo.filas.length === 2, solo.filas.map(f => f.mision));
  ok('y sigue fuera la del otro grupo', !solo.filas.some(f => f.mision === 'mision-b'));
  ok('no hay nada que avisar', solo.sinSeccion === 0);

  /* ── 4. La misma niña escrita de tres formas ─────────────── */
  console.log('\n4) «Ana López», «ana lopez» y «ANA LOPEZ» son UNA niña');
  const cache2 = { t: 1, resultados: [
    fila(3, '5', 'Ana López', 80, 'm1'),
    fila(3, '5', 'ana lopez', 70, 'm2'),
    fila(3, '5', 'ANA  LÓPEZ', 60, 'm3'),
  ], progreso: [] };
  ctx = cargarEstadisticas([{ id: 'G1', grado: '5', seccion: '1', escuela: 'E' }], cache2);
  const ana = vm.runInContext('estMisiones({grado:"5",seccion:"1"}, 3)', ctx);
  ok('se enseña un solo nombre, no tres', ana.nombres.length === 1, ana.nombres);
  ok('y las tres prácticas son suyas', ana.filas.length === 3);

  /* ── 5. Lo que el niño escribe de verdad ─────────────────── */
  console.log('\n5) Se entiende como el niño escribe («6», «6º-1», «6to A», «61»)');
  ctx = cargarEstadisticas([], { t: 1, resultados: [], progreso: [] });
  const casos = [
    ['6',      '6', { grado: '6', seccion: '' }],
    ['6º-1',   '6', { grado: '6', seccion: '1' }],
    ['6to A',  '6', { grado: '6', seccion: 'A' }],
    ['61',     '6', { grado: '6', seccion: '1' }],
    ['6 2',    '6', { grado: '6', seccion: '2' }],
    ['7',      '6', { grado: '7', seccion: '' }],
  ];
  casos.forEach(([txt, gd, esp]) => {
    const r = vm.runInContext('estParteGrupo(' + JSON.stringify(txt) + ',' + JSON.stringify(gd) + ')', ctx);
    ok(`«${txt}» → grado ${esp.grado}${esp.seccion ? ', sección ' + esp.seccion : ', sin sección'}`,
       r.grado === esp.grado && r.seccion === esp.seccion, r);
  });

  /* ── 6. El modal, en el navegador ────────────────────────── */
  console.log('\n6) El número de lista deja de ser opcional cuando hay código de aula');
  const nav = await abrir({ args: ['--no-sandbox'] });
  const c = await nav.newContext({ viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true });
  await c.route('**/*.supabase.co/**', r => r.abort());
  const pg = await c.newPage();
  await pg.goto(BASE + '/misiones/2y3ciclo-fracciones/fracciones.html', { waitUntil: 'domcontentloaded' });
  await pg.waitForFunction(() => typeof window.METAS === 'object' && typeof METAS.identificar === 'function'
                              || typeof window.gradeEval === 'function');
  await pg.evaluate(() => (window.METAS && METAS.abrirIdentificacion) ? METAS.identificar() : null);
  await pg.waitForSelector('#metasIdModal', { timeout: 8000 }).catch(() => {});
  if (await pg.$('#metasIdModal')) {
    ok('el rótulo dice «opcional» mientras no hay código de aula',
       /opcional/i.test(await pg.innerText('#metasIdNumOpc')));
    await pg.fill('#metasIdNombre', 'Bruno Mejía');
    await pg.fill('#metasIdAula', 'K2M9P');
    await pg.waitForTimeout(200);
    ok('y deja de decirlo en cuanto lo escribe',
       !/opcional/i.test(await pg.innerText('#metasIdNumOpc')), await pg.innerText('#metasIdNumOpc'));
    await pg.click('#metasIdGuardar');
    await pg.waitForTimeout(300);
    ok('sin número de lista no deja guardar', !!(await pg.$('#metasIdModal')));
    ok('y explica por qué', /número de lista/i.test(await pg.innerText('#metasIdNumMsg')),
       await pg.innerText('#metasIdNumMsg'));
    await pg.fill('#metasIdNum', '7');
    await pg.click('#metasIdGuardar');
    await pg.waitForTimeout(400);
    ok('con número, guarda', !(await pg.$('#metasIdModal')));
  } else {
    ok('se pudo abrir el modal de identificación', false);
  }
  await c.close();

  /* ── 7. El teléfono compartido ───────────────────────────── */
  console.log('\n7) Entra Bruno y NO hereda el avance de Ana');
  const c2 = await nav.newContext({ viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true });
  await c2.route('**/*.supabase.co/**', r => r.abort());
  const p2 = await c2.newPage();
  /* Ana ya trabajó: se siembra el avance con la MISMA forma que guardan las
     66 misiones, que es por donde el arnés la reconoce. */
  /* ⚠️ Se siembra UNA SOLA VEZ: addInitScript corre en cada navegación, y el
     arreglo recarga la página. Sin la marca, la recarga volvía a poner el
     avance de Ana y la prueba decía que el arreglo no funcionaba. */
  await p2.addInitScript(() => {
    try {
      if (localStorage.getItem('__sembrado')) return;
      localStorage.setItem('__sembrado', '1');
      localStorage.setItem('fracciones_v1', JSON.stringify({
        doneSections: ['s-aprende', 's-practica'], unlockedAch: ['a1'],
        evalFormNum: 3, evalOpFormNum: 2, xp: 120
      }));
      localStorage.setItem('METAS_ALUMNO_V1', JSON.stringify({
        nombre: 'Ana López', num: '7', grado: '6º-1', escuela: 'E', codigo_aula: '', docente: ''
      }));
    } catch (_) {}
  });
  await p2.goto(BASE + '/misiones/2y3ciclo-fracciones/fracciones.html', { waitUntil: 'domcontentloaded' });
  await p2.waitForFunction(() => typeof window.gradeEval === 'function');
  await p2.evaluate(() => METAS.identificar());
  await p2.waitForSelector('#metasIdModal');

  ok('mientras sea Ana, no se le pregunta nada',
     !(await p2.locator('#metasIdReinicio').isVisible()));

  await p2.fill('#metasIdNombre', 'ana lopez');
  await p2.waitForTimeout(150);
  ok('ni aunque escriba su nombre sin tildes ni mayúsculas',
     !(await p2.locator('#metasIdReinicio').isVisible()));

  await p2.fill('#metasIdNombre', 'Bruno Mejía');
  await p2.waitForTimeout(150);
  ok('con otro nombre SÍ se pregunta', await p2.locator('#metasIdReinicio').isVisible());
  const txt = await p2.innerText('#metasIdReinicioTxt');
  ok('y se dice de quién es el avance y cuánto hay',
     /Ana López/.test(txt) && /2 secciones/.test(txt), txt.slice(0, 110));
  ok('y que lo de Ana no se pierde', /no se pierde/i.test(txt));

  await p2.click('#metasIdGuardar');
  await p2.waitForTimeout(900);
  const quedo = await p2.evaluate(() => localStorage.getItem('fracciones_v1'));
  ok('el avance de Ana ya no es de Bruno', quedo === null, quedo);
  const idAhora = await p2.evaluate(() => JSON.parse(localStorage.getItem('METAS_ALUMNO_V1') || '{}'));
  ok('y el teléfono es de Bruno', idAhora.nombre === 'Bruno Mejía', idAhora.nombre);
  await c2.close();

  await nav.close();

  console.log('\n' + '─'.repeat(50));
  if (fallos) { console.log(`✖ ${fallos} problema(s): la identidad del alumno todavía funde o parte.`); process.exit(1); }
  console.log('✅ TODO EN VERDE: cada niño es uno, y uno solo.');
})().catch(e => { console.error('✘ La sonda tropezó:', e.message); process.exit(1); });
