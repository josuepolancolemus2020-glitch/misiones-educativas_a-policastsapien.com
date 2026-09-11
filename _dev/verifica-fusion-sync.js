/* ============================================================
   M.E.T.A.S · El maestro no pierde su trabajo entre dos equipos
   ------------------------------------------------------------
   Medido el 9 de septiembre de 2026, antes de tocar nada, con la nube
   de mentira y el reloj de verdad:

     el maestro pasa lista en el TELÉFONO a las 9:00, sin señal;
     a las 20:00 pone una nota en la PC;
     al volver la señal → **la asistencia del día desaparecía**,
     el teléfono ni siquiera llegaba a subirla,
     y «Recuperar» no aparecía porque el aula no estaba vacía.

   Y al revés, con el reloj del teléfono adelantado, la que se perdía
   era la nota de la PC. Las dos direcciones perdían.

   Un día de asistencia son 43 nombres que el maestro ya no puede
   reconstruir: no estaba mirando, estaba dando clase.

   La fusión dato por dato vive en `js/metas-fusion-aula.js` y se prueba
   sola y sin navegador con `node _dev/prueba-fusion-aula.js`. Esta sonda
   comprueba la otra mitad, la que solo se ve abriendo la aplicación: que
   el espejo la USE, que la copia fusionada SUBA —si no, mañana el otro
   equipo vuelve a mandar la suya a medias— y que los dos equipos acaben
   con lo mismo.

   La nube NO se toca: se pone un Supabase de mentira con page.route.

   Uso:  node _dev/servidor-estatico.js   (en otra terminal)
         node _dev/verifica-fusion-sync.js
   ============================================================ */
'use strict';

const { abrir, SIN_SW } = require('./lib-navegador');
const BASE = 'http://localhost:8123';
const COD = 'PROF-TEST', CLAVE = 'clave-de-prueba';

let fallos = 0;
const ok = (nombre, cond, extra) => {
  console.log((cond ? '  ✔ ' : '  ✘ ') + nombre + (cond || extra === undefined ? '' : ' → ' + JSON.stringify(extra)));
  if (!cond) fallos++;
};

/* El aula de siempre: tres alumnos de 6º-1 */
function aula(extra) {
  return JSON.stringify({ v: 2, activo: 'G1', grupos: [Object.assign({
    id: 'G1', escuela: 'John Arnold Cook', grado: '6', seccion: '1',
    materias: ['Español', 'Matemáticas'],
    lista: [{ num: 1, nombre: 'Ana López' }, { num: 2, nombre: 'Luis Cruz' }, { num: 3, nombre: 'Sara Mejía' }],
    colectas: [], asistencia: [], notas: {}, controles: [], bitacora: [], lectura: [], convocatorias: []
  }, extra || {})] });
}
const VACIA = aula();
const CON_ASISTENCIA = aula({ asistencia: [{ f: '2026-09-09', aus: { 2: 'F' } }] });
const CON_NOTA = aula({ notas: { p1: { 'Español': { 1: '85' } } } });

/* Una «nube» que se comporta como el servidor: guarda por clave y versión. */
function nubeNueva(inicial) {
  return { datos: Object.assign({}, inicial || {}), subidas: [] };
}
async function ponerNube(pg, nube) {
  await pg.route('**/rest/v1/rpc/**', async route => {
    const fn = route.request().url().split('/rpc/')[1].split('?')[0];
    let c = {};
    try { c = JSON.parse(route.request().postData() || '{}'); } catch (_) {}
    const json = b => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(b) });
    if (fn === 'metas_docente_estado_leer') {
      return json(Object.keys(nube.datos).map(k => ({ k, valor: { raw: nube.datos[k].raw }, version: nube.datos[k].version })));
    }
    if (fn === 'metas_docente_estado_guardar') {
      (c.p_entradas || []).forEach(e => {
        nube.subidas.push({ k: e.k, raw: e.valor.raw, version: e.version });
        nube.datos[e.k] = { raw: e.valor.raw, version: e.version };
      });
      return json((c.p_entradas || []).length);
    }
    if (fn === 'metas_docente_papelera') return json({ hay: false });
    return json(null);
  });
}

/* Abre la aplicación como un EQUIPO del maestro: con su sesión, su copia
   local del aula y su versión, y sincroniza. */
async function equipo(nav, nube, opciones) {
  const ctx = await nav.newContext({ ...SIN_SW });
  const pg = await ctx.newPage();
  await ponerNube(pg, nube);
  await pg.addInitScript(([cod, clave, raw, ver, sinFusion, baseRaw, alDia]) => {
    /* el mismo djb2 del espejo: si la huella no calza, scanLocal re-estampa
       la versión con Date.now() y la prueba mediría otra cosa */
    const hash = s => { if (s == null) return '0'; let h = 5381, i = s.length; while (i) h = (h * 33) ^ s.charCodeAt(--i); return (h >>> 0).toString(36); };
    localStorage.setItem('METAS_DOCENTE_V1', JSON.stringify({ codigo: cod, clave: clave, nombre: 'Prof. Prueba' }));
    localStorage.setItem('METAS_DS_OWNER', cod);
    if (raw != null) localStorage.setItem('METAS_ADMIN_V1', raw);
    localStorage.setItem('METAS_DOCSYNC_V1', JSON.stringify({
      /* sv < v  = editado y sin subir;  sv === v = todo subido */
      'METAS_ADMIN_V1': { v: ver, h: hash(raw), sv: alDia ? ver : ver - 1 }
    }));
    if (baseRaw) localStorage.setItem('METAS_DOCSYNC_BASE_V1', JSON.stringify({ 'METAS_ADMIN_V1': baseRaw }));
    if (sinFusion) { Object.defineProperty(window, 'MetasFusion', { value: undefined, writable: true }); }
  }, [COD, CLAVE, opciones.raw, opciones.version, !!opciones.sinFusion, opciones.base || null, !!opciones.alDia]);
  await pg.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
  await pg.waitForFunction(() => typeof window.dsSync === 'function');
  if (opciones.sinFusion) await pg.evaluate(() => { window.MetasFusion = undefined; });
  await pg.evaluate(() => window.dsSync());
  await pg.waitForTimeout(1000);
  const leer = () => pg.evaluate(() => {
    const d = JSON.parse(localStorage.getItem('METAS_ADMIN_V1') || '{}');
    const g = (d.grupos || [])[0] || {};
    return {
      alumnos: (g.lista || []).length,
      dias: (g.asistencia || []).map(x => x.f),
      falta2: (((g.asistencia || [])[0] || {}).aus || {})[2] || null,
      nota: (((g.notas || {}).p1 || {})['Español'] || {})[1] || null,
      base: !!(JSON.parse(localStorage.getItem('METAS_DOCSYNC_BASE_V1') || 'null') || {})['METAS_ADMIN_V1'],
      recuperar: !!window.dsTieneRespaldo()
    };
  });
  const r = await leer();
  await ctx.close();
  return r;
}

(async () => {
  console.log('M.E.T.A.S · El maestro no pierde su trabajo entre dos equipos');
  const nav = await abrir();
  const AYER = Date.now() - 24 * 3600000;
  const T_MANANA = AYER + 9 * 3600000, T_NOCHE = AYER + 20 * 3600000;

  console.log('\n1 · El caso medido: lista en el teléfono, nota en la PC');
  {
    /* La PC ya subió su nota. El teléfono, sin señal, tiene la asistencia. */
    const nube = nubeNueva({ 'METAS_ADMIN_V1': { raw: CON_NOTA, version: T_NOCHE } });
    const tel = await equipo(nav, nube, { raw: CON_ASISTENCIA, version: T_MANANA, base: VACIA });
    ok('la asistencia del teléfono NO se pierde', tel.dias.length === 1 && tel.dias[0] === '2026-09-09', tel.dias);
    ok('la falta de Luis sigue anotada', tel.falta2 === 'F');
    ok('la nota de la PC llega al teléfono', tel.nota === '85');
    ok('los tres alumnos siguen ahí', tel.alumnos === 3);
    ok('y la copia fusionada SUBE (si no, mañana vuelve a medias)',
       nube.subidas.some(s => s.k === 'METAS_ADMIN_V1' && s.raw.indexOf('2026-09-09') > -1 && s.raw.indexOf('"85"') > -1),
       nube.subidas.map(s => s.k));

    /* Y ahora la PC entra: tiene que recibir la asistencia del teléfono. */
    const pc = await equipo(nav, nube, { raw: CON_NOTA, version: T_NOCHE, base: VACIA });
    ok('los dos equipos acaban con lo mismo', pc.dias.length === 1 && pc.nota === '85', pc);
  }

  console.log('\n2 · Al revés: con el reloj del teléfono adelantado');
  {
    const nube = nubeNueva({ 'METAS_ADMIN_V1': { raw: CON_NOTA, version: T_MANANA } });
    const tel = await equipo(nav, nube, { raw: CON_ASISTENCIA, version: T_NOCHE, base: VACIA });
    ok('tampoco se pierde la nota de la PC', tel.nota === '85' && tel.dias.length === 1, tel);
  }

  console.log('\n3 · La base se guarda: es lo que distingue añadir de borrar');
  {
    const nube = nubeNueva({ 'METAS_ADMIN_V1': { raw: CON_NOTA, version: T_NOCHE } });
    const tel = await equipo(nav, nube, { raw: CON_ASISTENCIA, version: T_MANANA, base: VACIA });
    ok('queda base para la próxima sincronización', tel.base === true);
  }

  console.log('\n4 · Si la fusión no está, se hace lo de siempre — y AHÍ sale «Recuperar»');
  {
    const nube = nubeNueva({ 'METAS_ADMIN_V1': { raw: CON_NOTA, version: T_NOCHE } });
    const tel = await equipo(nav, nube, { raw: CON_ASISTENCIA, version: T_MANANA, base: VACIA, sinFusion: true });
    ok('sin la fusión la nube pisa (comportamiento de siempre, no revienta)', tel.nota === '85' && tel.dias.length === 0, tel);
    ok('pero el botón «Recuperar» SÍ aparece, con el aula llena', tel.recuperar === true);
  }

  console.log('\n5 · El teléfono con el reloj adelantado dos años seguía trayendo lo nuevo');
  {
    /* Sin cambios pendientes, pero con una versión local absurda porque un día
       se editó con el reloj mal puesto. Antes «la nube no es más nueva» lo
       dejaba congelado: veía su aula de siempre mientras la PC trabajaba. */
    const nube = nubeNueva({ 'METAS_ADMIN_V1': { raw: CON_NOTA, version: T_NOCHE } });
    const tel = await equipo(nav, nube, { raw: VACIA, version: Date.now() + 730 * 24 * 3600000, alDia: true, base: VACIA });
    ok('la nota de la PC llega igual', tel.nota === '85', tel);
  }

  await nav.close();
  console.log('\n' + '─'.repeat(52));
  if (fallos) { console.log(`✖ ${fallos} problema(s).`); process.exit(1); }
  console.log('✅ Ni la asistencia del teléfono ni la nota de la PC se pierden.');
})().catch(e => { console.error('✘ La sonda tropezó:', e.message); process.exit(1); });
