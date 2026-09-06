/* ============================================================
   M.E.T.A.S · Las notas que ya calculó la aplicación llegan a la boleta
   ------------------------------------------------------------
   El circuito estaba cortado justo en el último paso: la
   aplicación califica al alumno, la nota sube a la nube… y el
   maestro corregía los 43 exámenes otra vez y las tecleaba a
   mano. `grep metas_consultar js/tools/plan-accion.js` daba cero.

   Es la modificación con más impacto comercial de la auditoría,
   porque es la respuesta a «¿y esto qué me ahorra?».

   Lo que vigila esta sonda:

   1. Trae la nota de cada número de lista, de ESA misión.
   2. NO pisa lo que el maestro ya escribió a mano: puede haber
      corregido en papel al alumno que no tiene teléfono.
   3. Respeta el tipo: la conceptual y la operativa son dos
      pruebas distintas y meter una por la otra es meter en la
      boleta la nota de otra cosa.
   4. Ignora las calificadas con la pauta abierta, con la MISMA
      regla que Rutas y que el ⚠️ del registro.
   5. Y dice qué hizo: cuántas trajo, cuántas respetó, cuántas
      no estaban y cuántas ignoró.

   Uso:  node _dev/servidor-estatico.js   (en otra terminal)
         node _dev/verifica-notas-nube.js
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

/* Una misión de verdad del catálogo, para que la carpeta case. */
function misionDePrueba() {
  const ctx = { window: {}, document: {}, console };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(RAIZ, 'js/data/misiones.js'), 'utf8'), ctx, { filename: 'm' });
  const M = vm.runInContext('MISSIONS', ctx);
  const m = M.find(x => /fracciones/.test(x.url || '')) || M[0];
  const seg = String(m.url || '').split('/')[1] || '';
  return { id: m.id, title: m.title, carpeta: decodeURIComponent(seg).toLowerCase() };
}

(async () => {
  const MIS = misionDePrueba();
  console.log(`\n════════ LAS NOTAS LLEGAN A LA BOLETA · ${MIS.title} ════════\n`);

  const F = (num, tipo, nota, forma, extra) => Object.assign({
    codigo_lista: String(num), grado: '6º-1', alumno: 'Alumno ' + num,
    mision: MIS.carpeta, tipo, nota, base: 100, forma: forma,
    fecha: '2026-09-07T10:00:00Z', dispositivo: 'D-1'
  }, extra || {});

  const nube = { t: Date.now(), progreso: [], resultados: [
    F(1, 'evaluacion', 85, '3'),
    F(2, 'evaluacion', 40, '3'),
    F(3, 'evaluacion', 95, '3'),                                   // este ya tiene nota a mano
    F(4, 'prueba_operativa', 70, '3'),                             // otro tipo: no debe entrar
    F(5, 'evaluacion', 60, '7'),                                   // otra forma: no debe entrar
    F(6, 'evaluacion', 100, '3', { fecha: '2026-09-07T12:00:00Z' }),  // copió la pauta
    { codigo_lista: '6', grado: '6º-1', mision: MIS.carpeta, tipo: 'pauta_vista',
      fecha: '2026-09-07T11:00:00Z', dispositivo: 'D-1' },
    F(1, 'evaluacion', 55, '3', { fecha: '2026-09-06T10:00:00Z' }),   // intento anterior: gana el último
  ] };

  const nav = await abrir({ args: ['--no-sandbox'] });
  const ctx = await nav.newContext({ viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true, locale: 'es-HN' });
  await ctx.route('**/*.supabase.co/**', r => r.abort());
  const pg = await ctx.newPage();
  const errores = [];
  pg.on('pageerror', e => errores.push(String(e)));
  await pg.addInitScript(datos => {
    try {
      localStorage.setItem('METAS_DOCENTE_V1', JSON.stringify({ codigo: 'PROF-TEST', clave: 'x', nombre: 'Prof. Prueba' }));
      localStorage.setItem('METAS_STATS_NUBE_V1', JSON.stringify(datos));
    } catch (_) {}
  }, nube);
  await pg.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
  await pg.waitForFunction(() => typeof window.paAbrirPlan === 'function');
  await pg.evaluate(() => paAbrirPlan());
  await pg.waitForSelector('#pa-nube-btn', { timeout: 10000 });

  console.log('1) El botón está donde el maestro va a teclear');
  ok('la portada carga sin errores', errores.length === 0, errores[0]);
  ok('el botón existe y se ve', await pg.locator('#pa-nube-btn').isVisible());

  console.log('\n2) Sin elegir misión, lo dice en vez de traer cualquier cosa');
  await pg.click('#pa-nube-btn');
  await pg.waitForTimeout(300);
  ok('avisa de que falta elegir la misión', /misión/i.test(await pg.innerText('#pa-nube-msg')),
     await pg.innerText('#pa-nube-msg'));

  console.log('\n3) Trae las notas de esa misión, esa forma y ese tipo');
  await pg.evaluate(m => {
    /* Se preparan los selectores como los deja el maestro y seis alumnos, uno
       de ellos con la nota ya escrita a mano. */
    const sel = document.getElementById('pa-mision');
    sel.innerHTML = '<option value="' + m.id + '">' + m.title + '</option>';
    sel.value = String(m.id);
    const f = document.getElementById('pa-forma');
    f.innerHTML = '<option value="3">3</option>'; f.value = '3';
    document.getElementById('pa-tipo').value = 'conceptual';
    document.getElementById('pa-students-list').innerHTML = '';
    for (let i = 1; i <= 7; i++) paAddRow(i, 'Alumno ' + i, i === 3 ? '77' : '');
  }, MIS);
  await pg.click('#pa-nube-btn');
  await pg.waitForTimeout(700);

  const notas = await pg.$$eval('.pa-student-row', rows => rows.map(r => ({
    num: r.querySelector('.pa-inp-num').value,
    nota: r.querySelector('.pa-inp-grade-cell').value,
    azul: r.querySelector('.pa-inp-grade-cell').classList.contains('pa-de-nube')
  })));
  const de = n => (notas.find(x => x.num === String(n)) || {});

  ok('el nº 1 recibe su nota', de(1).nota === '85', de(1));
  ok('y es la ÚLTIMA, no la mejor (85, no 55)', de(1).nota !== '55');
  ok('el nº 2 recibe la suya', de(2).nota === '40', de(2));
  ok('el nº 3 conserva la que el maestro escribió a mano (77)', de(3).nota === '77', de(3));
  ok('el nº 4 no recibe la operativa en la conceptual', de(4).nota === '', de(4));
  ok('el nº 5 no recibe la de otra forma', de(5).nota === '', de(5));
  ok('el nº 6 no recibe la copiada de la pauta', de(6).nota === '', de(6));
  ok('el nº 7, que no practicó, se queda vacío', de(7).nota === '', de(7));
  ok('lo traído se marca (en azul) y lo escrito a mano no', de(1).azul && !de(3).azul,
     { traido: de(1).azul, aMano: de(3).azul });

  console.log('\n4) Y dice qué hizo');
  const msg = await pg.innerText('#pa-nube-msg');
  ok('cuántas trajo', /2 notas traídas/.test(msg), msg);
  ok('cuántas respetó', /respetaron/.test(msg) && /1/.test(msg));
  ok('cuántas ignoró por la pauta', /pauta abierta/.test(msg));
  ok('y que es la última, no la mejor', /la última/.test(msg));

  console.log('\n5) La operativa sí llega cuando es la que se pide');
  await pg.evaluate(() => {
    document.getElementById('pa-tipo').value = 'operativa';
    document.getElementById('pa-students-list').innerHTML = '';
    paAddRow(4, 'Alumno 4', '');
  });
  await pg.click('#pa-nube-btn');
  await pg.waitForTimeout(600);
  const op = await pg.$eval('.pa-student-row .pa-inp-grade-cell', e => e.value);
  ok('el nº 4 recibe su 70 de la operativa', op === '70', op);

  console.log('\n6) Y si el maestro la corrige encima, deja de ser de la nube');
  await pg.fill('.pa-student-row .pa-inp-grade-cell', '65');
  await pg.waitForTimeout(200);
  ok('se le quita la marca al escribir encima',
     !(await pg.$eval('.pa-student-row .pa-inp-grade-cell', e => e.classList.contains('pa-de-nube'))));

  await nav.close();
  console.log('\n' + '─'.repeat(50));
  if (fallos) { console.log(`✖ ${fallos} problema(s): el maestro sigue tecleando lo que la máquina ya calculó.`); process.exit(1); }
  console.log('✅ TODO EN VERDE: la nota que calculó la aplicación llega sola a la boleta.');
})().catch(e => { console.error('✘ La sonda tropezó:', e.message); process.exit(1); });
