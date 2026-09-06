/* ============================================================
   M.E.T.A.S · La puerta de escritura anónima a la nube
   ------------------------------------------------------------
   `metas_guardar` aceptaba hasta 500 filas de cualquiera con la
   clave publicable —que va escrita en este repositorio, como
   debe ser—, sin freno y sin cuenta, y decidía de quién era cada
   fila por el TEXTO del nombre del maestro. Cualquiera podía
   escribir 500 notas falsas a nombre de un maestro cuyo nombre
   adivinara, y no existía forma de borrarlas: en toda la base no
   había un solo `delete from resultados`. Esas filas salen en
   Estadísticas y de ahí en el informe que firma la madre.

   ⚠️ Esta sonda NO toca la nube de verdad —nunca— y tampoco
   puede correr SQL. Lo que comprueba es lo que sí depende del
   repositorio:

   1. Que el SQL esté escrito, entero e idempotente, y que haga
      las seis cosas que tiene que hacer.
   2. Que la pantalla del maestro marque lo que llegó sin código
      de aula, y SOLO eso.
   3. ⚠️ Que con el servidor VIEJO —el que todavía no tiene la
      columna— no se marque nada. Es lo que más importa: el SQL
      lo pega una persona a mano desde una tableta, y entre que
      se publica esto y se pega puede pasar una semana. Si la
      pantalla se llenara de avisos mientras tanto, el maestro
      dejaría de leerlos.
   4. Que se pueda borrar, y que si el servidor aún no sabe, lo
      diga con el nombre del archivo que falta correr.

   Uso:  node _dev/servidor-estatico.js   (en otra terminal)
         node _dev/verifica-puerta-nube.js
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const { abrir } = require('./lib-navegador');

const RAIZ = path.resolve(__dirname, '..');
const BASE = 'http://localhost:8123';
const SQL = fs.readFileSync(path.join(RAIZ, 'SUPABASE-PUERTA-ANONIMA.sql'), 'utf8');

let fallos = 0;
const ok = (nombre, cond, extra) => {
  console.log((cond ? '  ✔ ' : '  ✘ ') + nombre + (cond || extra === undefined ? '' : ' → ' + JSON.stringify(extra)));
  if (!cond) fallos++;
};

/* Filas como las que devuelve metas_consultar_docente. */
const fila = (id, extra) => Object.assign({
  id: id, evento_id: 'E-' + id, tipo: 'evaluacion', mision: 'prueba',
  alumno: 'Alumno ' + id, codigo_lista: String(id), grado: '6º-1',
  nota: 80, base: 100, forma: 1, dispositivo: 'D-1',
  fecha: '2026-09-07T10:00:00Z', creado_en: '2026-09-07T10:00:00Z'
}, extra || {});

async function abrirConsulta(nav, filas, alBorrar) {
  const ctx = await nav.newContext({ viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true });
  const pg = await ctx.newPage();
  await pg.route('**/rest/v1/rpc/**', async route => {
    const u = route.request().url();
    const fn = u.split('/rpc/')[1].split('?')[0];
    if (fn === 'metas_consultar_docente') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(filas) });
    }
    if (fn === 'metas_resultados_borrar') return alBorrar(route);
    return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
  });
  await pg.addInitScript(() => {
    try {
      localStorage.setItem('METAS_DOCENTE_V1', JSON.stringify({ codigo: 'PROF-TEST', clave: 'x', nombre: 'Prof. Prueba' }));
    } catch (_) {}
  });
  await pg.goto(BASE + '/consulta-nube.html', { waitUntil: 'domcontentloaded' });
  await pg.waitForTimeout(500);
  await pg.evaluate(() => consultar && consultar());
  await pg.waitForSelector('#tbody tr', { timeout: 8000 });
  return { ctx, pg };
}

(async () => {
  console.log('\n════════ LA PUERTA DE ESCRITURA ANÓNIMA ════════\n');

  console.log('1) El SQL está escrito y hace las seis cosas');
  const debe = [
    ['acota el lote a 200', /jsonb_array_length\(filas\) > 200/],
    ['pasa por el freno de siempre', /metas_rate_ok\(\)/],
    ['acota la nota a «0..base»', /greatest\(0, least\(f\.nota/],
    ['guarda el código del maestro RESUELTO', /docente_codigo/],
    ['quita la política heredada', /drop policy if exists resultados_insertar/],
    ['retira las dos heredadas por NOMBRE', /proname in \('metas_consultar', 'metas_suscribir_docente'\)/],
    /* La primera versión hacía `revoke` antes del `drop`, y eso reventó al
       pegarlo: revoke sobre una función que ya no existe da ERROR 42883 y,
       como el editor corre todo en una transacción, se deshizo el script
       entero sin aplicar nada. */
    ['sin revoke sobre las heredadas (aborta si ya no están)',
     !/revoke all on function public\.metas_(consultar|suscribir_docente)\(/.test(SQL) || 'queda un revoke'],
    ['añade el borrado del maestro', /function public\.metas_resultados_borrar/],
  ];
  debe.forEach(([q, re]) => ok(q, re === true ? true : (typeof re === 'string' ? false : re.test(SQL)), typeof re === 'string' ? re : undefined));
  ok('es idempotente (create or replace / if not exists / if exists)',
     !/\bcreate table (?!if not exists)/.test(SQL) && /add column if not exists/.test(SQL));
  ok('dice cómo comprobarlo sin fiarse del «Success»', /CÓMO SE COMPRUEBA/.test(SQL));
  ok('y dice lo que NO hace', /LO QUE ESTO \*\*NO\*\* HACE|NO\*\* HACE/.test(SQL));

  const nav = await abrir({ args: ['--no-sandbox'] });

  console.log('\n2) Con el servidor NUEVO: se marca lo que llegó sin código');
  const a = await abrirConsulta(nav, [
    fila(1, { verificado: true,  docente_codigo: 'PROF-TEST' }),
    fila(2, { verificado: false, docente_codigo: null, alumno: 'Inventado' }),
  ], r => r.fulfill({ status: 200, contentType: 'application/json', body: '1' }));
  const filas = await a.pg.$$eval('#tbody tr', trs => trs.map(t => ({
    txt: t.innerText.replace(/\n/g, ' '),
    marcada: t.classList.contains('fila-sinver'),
    borra: !!t.querySelector('.btn-borrar')
  })));
  ok('la verificada NO lleva aviso', !/sin verificar/.test(filas[0].txt) && !filas[0].marcada, filas[0].txt.slice(0, 60));
  ok('la que llegó sin código SÍ', /sin verificar/.test(filas[1].txt) && filas[1].marcada, filas[1].txt.slice(0, 60));
  ok('las dos se pueden borrar', filas[0].borra && filas[1].borra);

  console.log('\n3) ⚠️ Con el servidor VIEJO no se marca NADA');
  await a.ctx.close();
  const b = await abrirConsulta(nav, [fila(1), fila(2)],
    r => r.fulfill({ status: 404, contentType: 'application/json', body: '{}' }));
  const viejas = await b.pg.$$eval('#tbody tr', trs => trs.map(t => t.innerText));
  ok('ninguna fila se pinta como sin verificar', !viejas.some(t => /sin verificar/.test(t)), viejas[0]);

  console.log('\n4) Y si el servidor aún no sabe borrar, lo dice con el archivo que falta');
  b.pg.on('dialog', d => d.accept());
  await b.pg.click('#tbody tr .btn-borrar');
  await b.pg.waitForTimeout(600);
  const est = await b.pg.innerText('#estado');
  ok('nombra SUPABASE-PUERTA-ANONIMA.sql', /SUPABASE-PUERTA-ANONIMA\.sql/.test(est), est);
  await b.ctx.close();

  console.log('\n5) Y con el servidor nuevo, borra de verdad');
  const c = await abrirConsulta(nav, [fila(9, { verificado: false })],
    r => r.fulfill({ status: 200, contentType: 'application/json', body: '1' }));
  c.pg.on('dialog', d => d.accept());
  const antes = await c.pg.$$eval('#tbody tr', t => t.length);
  await c.pg.click('#tbody tr .btn-borrar');
  await c.pg.waitForTimeout(600);
  const despues = await c.pg.$$eval('#tbody tr', t => t.length);
  ok('la fila desaparece de la tabla', despues === antes - 1, { antes, despues });
  ok('y se dice', /quitada/.test(await c.pg.innerText('#estado')));
  await c.ctx.close();

  await nav.close();
  console.log('\n' + '─'.repeat(50));
  if (fallos) { console.log(`✖ ${fallos} problema(s).`); process.exit(1); }
  console.log('✅ TODO EN VERDE: lo que entra sin código se ve, y se puede quitar.');
})().catch(e => { console.error('✘ La sonda tropezó:', e.message); process.exit(1); });
