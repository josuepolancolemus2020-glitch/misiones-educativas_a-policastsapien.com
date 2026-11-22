/* ============================================================
   M.E.T.A.S · La nube entrega 1 000 por vez: que se vean TODOS
   ------------------------------------------------------------
   El maestro con 2 345 resultados veía 1 000. La nube entrega como
   mucho 1 000 filas por vez y «Resultados de mis alumnos» y
   Estadísticas las pedían de una sola vez: la página contaba,
   promediaba y armaba el informe sobre 1 000 sin decir nada.

   Con SUPABASE-TOPES-Y-PAGINAS.sql la nube tiene dos consultas
   nuevas que entregan por páginas (cursor fecha + id). Esta sonda,
   con una nube DE MENTIRA (nunca la de verdad), comprueba:

   1. consulta-nube.html y Estadísticas muestran 2 345, no 1 000, y
      piden páginas de 500 hasta la que viene corta.
   2. Si la nube todavía no tiene la función nueva (404 / PGRST202),
      usan la de siempre; y si esa devuelve justo 1 000, aparece
      «Puede que falten resultados: la nube entrega 1 000 por vez».
   3. Con más de 20 000, se paran en 40 páginas y lo dicen.
   4. Si salta el tope de altas, el maestro lee qué pasó y qué hacer.

   La nube de mentira ordena y corta con el MISMO cursor que el SQL
   (fecha desc, id desc; «antes de» la última fila), y entrega como
   mucho 1 000 por página aunque se le pidan más, como la de verdad.

   Uso:  node _dev/servidor-estatico.js   (en otra terminal)
         node _dev/verifica-paginas-nube.js
   ============================================================ */
'use strict';

const { abrir, SIN_SW } = require('./lib-navegador');

const BASE = process.env.METAS_BASE || 'http://localhost:8123';
let fallos = 0;
const ok = (nombre, cond, extra) => {
  console.log((cond ? '  ✔ ' : '  ✘ ') + nombre + (cond || extra === undefined ? '' : ' → ' + JSON.stringify(extra).slice(0, 300)));
  if (!cond) fallos++;
};
const plano = s => String(s || '').replace(/\s+/g, ' ');

/* n resultados de un maestro, con fechas repetidas de a tres para que el
   desempate por id importe (como en la base de verdad, donde un lote de
   200 entra con la misma hora). */
function resultados(n) {
  const filas = [];
  const t0 = Date.parse('2026-11-20T12:00:00Z');
  for (let i = 1; i <= n; i++) {
    const t = new Date(t0 - Math.floor(i / 3) * 60000).toISOString();
    filas.push({ id: i, evento_id: 'E-' + i, tipo: 'evaluacion', mision: 'prueba', forma: 1,
      nota: 70 + (i % 30), base: 100, alumno: 'Alumno ' + (1 + (i % 12)), codigo_lista: String(1 + (i % 12)),
      grado: '6º-1', docente: 'Prof. Prueba', docente_codigo: 'PROF-TEST', verificado: true,
      dispositivo: 'D-' + (i % 7), fecha: t, creado_en: t });
  }
  return filas;
}
function progresos(n) {
  const filas = [];
  for (let i = 1; i <= n; i++) {
    filas.push({ id: i, dispositivo: 'D-' + i, alumno: 'Alumno ' + i, codigo_lista: String(i), grado: '6º-1',
      docente: 'Prof. Prueba', resumen: { minutos: 5, secciones: 2 },
      actualizado_en: new Date(Date.parse('2026-11-20T12:00:00Z') - i * 1000).toISOString() });
  }
  return filas;
}

/* Una página como la entrega metas_consultar_*_pag. */
function pagina(filas, campo, cuerpo) {
  const lim = Math.min(Math.max(Number(cuerpo.p_limite) || 500, 1), 1000);
  const orden = filas.slice().sort((a, b) => (a[campo] < b[campo] ? 1 : a[campo] > b[campo] ? -1 : b.id - a.id));
  const antes = cuerpo.p_antes_fecha
    ? orden.filter(f => f[campo] < cuerpo.p_antes_fecha || (f[campo] === cuerpo.p_antes_fecha && f.id < cuerpo.p_antes_id))
    : orden;
  return antes.slice(0, lim);
}

/* La nube de mentira. `conPag` = ya se pegó el SQL nuevo. */
async function nube(pg, { res, prog, conPag }) {
  const llamadas = [];
  await pg.route('**/rest/v1/**', async route => {
    const u = route.request().url();
    if (u.indexOf('/rpc/') < 0) return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    const fn = u.split('/rpc/')[1].split('?')[0];
    let cuerpo = {};
    try { cuerpo = JSON.parse(route.request().postData() || '{}'); } catch (_) {}
    llamadas.push({ fn, cuerpo });
    const json = (b, status) => route.fulfill({ status: status || 200, contentType: 'application/json', body: JSON.stringify(b) });
    if (fn === 'metas_consultar_docente_pag' || fn === 'metas_consultar_progreso_docente_pag') {
      if (!conPag) return json({ code: 'PGRST202', message: 'Could not find the function ' + fn }, 404);
      return fn === 'metas_consultar_docente_pag'
        ? json(pagina(res, 'creado_en', cuerpo))
        : json(pagina(prog, 'actualizado_en', cuerpo));
    }
    // Las de siempre: la nube corta en 1 000 por petición.
    if (fn === 'metas_consultar_docente') return json(pagina(res, 'creado_en', { p_limite: 1000 }));
    if (fn === 'metas_consultar_progreso_docente') return json(pagina(prog, 'actualizado_en', { p_limite: 1000 }));
    return json(null);
  });
  return llamadas;
}

const MAESTRO = () => {
  try { localStorage.setItem('METAS_DOCENTE_V1', JSON.stringify({ codigo: 'PROF-TEST', clave: 'x', nombre: 'Prof. Prueba' })); } catch (_) {}
};

async function consultaNube(nav, opciones) {
  const ctx = await nav.newContext({ ...SIN_SW, viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true });
  const pg = await ctx.newPage();
  const errores = [];
  pg.on('pageerror', e => errores.push(e.message));
  const llamadas = await nube(pg, opciones);
  await pg.addInitScript(MAESTRO);
  await pg.goto(BASE + '/consulta-nube.html', { waitUntil: 'domcontentloaded' });
  await pg.waitForFunction(() => /resultados|No se pudo|Aún no hay/.test(document.getElementById('estado').textContent), null, { timeout: 30000 });
  const estado = plano(await pg.innerText('#estado'));
  const n = await pg.evaluate(() => DATOS.length);
  await ctx.close();
  return { estado, n, llamadas, errores };
}

/* Mi aula con un grupo de 12 y la pestaña Estadísticas abierta. */
function sembrado() {
  const lista = Array.from({ length: 12 }, (_, i) => ({ num: i + 1, nombre: 'Alumno ' + (i + 1), sexo: i % 2 ? 'M' : 'F' }));
  return { v: 2, activo: 'G1', grupos: [{ id: 'G1', grado: '6', seccion: '1', escuela: 'ESC. DE PRUEBA',
    materias: ['Español'], lista, colectas: [], notas: {}, boleta: { parcialFechas: {} },
    asistencia: [], controles: [], bitacora: [], lectura: [], convocatorias: [] }] };
}
async function estadisticas(nav, opciones) {
  const ctx = await nav.newContext({ ...SIN_SW, viewport: { width: 1280, height: 900 } });
  const pg = await ctx.newPage();
  const errores = [];
  pg.on('pageerror', e => errores.push(e.message));
  const llamadas = await nube(pg, opciones);
  await pg.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
  await pg.waitForFunction(() => typeof window.renderAdmin === 'function' && typeof window.adRenderEstadisticas === 'function');
  await pg.evaluate(s => {
    localStorage.clear();
    localStorage.setItem('METAS_DOCENTE_V1', JSON.stringify({ codigo: 'PROF-TEST', clave: 'x', nombre: 'Prof. Prueba' }));
    localStorage.setItem('METAS_ADMIN_V1', JSON.stringify(s));
    localStorage.setItem('METAS_EST_AYUDA_VISTA_V1', '1');
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-admin').classList.add('active');
    _adTab = 'est'; renderAdmin(true);
  }, sembrado());
  await pg.waitForSelector('#est-nube-btn');
  await pg.click('#est-nube-btn');
  await pg.waitForSelector('#est-nube-cuenta', { timeout: 30000 });
  const cuenta = plano(await pg.innerText('#est-nube-cuenta'));
  const avisos = plano(await pg.$$eval('.est-nube-aviso', ps => ps.map(p => p.innerText).join(' | ')));
  const n = await pg.evaluate(() => (estNubeCache().resultados || []).length);
  await ctx.close();
  return { cuenta, avisos, n, llamadas, errores };
}

(async () => {
  console.log('\n════════ LA NUBE ENTREGA 1 000 POR VEZ: QUE SE VEAN TODOS ════════\n');
  const nav = await abrir({ args: ['--no-sandbox'] });
  const R = resultados(2345), P = progresos(37);

  console.log('1) consulta-nube.html con la función nueva y 2 345 resultados');
  const a = await consultaNube(nav, { res: R, prog: P, conPag: true });
  ok('dice 2 345 resultados, no 1 000', /2 345 resultados/.test(a.estado), a.estado);
  ok('tiene las 2 345 filas', a.n === 2345, a.n);
  const pagsA = a.llamadas.filter(l => l.fn === 'metas_consultar_docente_pag');
  ok('pidió páginas de 500 hasta la corta (5)', pagsA.length === 5 && pagsA.every(l => l.cuerpo.p_limite === 500), pagsA.length);
  ok('la primera sin cursor; las siguientes con la fecha y el id de la última fila',
    pagsA[0].cuerpo.p_antes_fecha === null && pagsA[1].cuerpo.p_antes_id != null && !!pagsA[1].cuerpo.p_antes_fecha);
  ok('no usó la consulta vieja', !a.llamadas.some(l => l.fn === 'metas_consultar_docente'));
  ok('sin aviso de que falte algo', !/Puede que falten|hay más en la nube/.test(a.estado), a.estado);
  ok('sin errores en la página', !a.errores.length, a.errores);

  console.log('\n2) Estadísticas con la función nueva y 2 345 resultados');
  const b = await estadisticas(nav, { res: R, prog: P, conPag: true });
  ok('Estadísticas dice 2 345 resultados', /2 345 resultados/.test(b.cuenta), b.cuenta);
  ok('y cuenta sobre las 2 345 filas', b.n === 2345, b.n);
  ok('sin aviso', !b.avisos, b.avisos);
  ok('sin errores en la página', !b.errores.length, b.errores);

  console.log('\n3) Sin la función nueva (falta pegar el SQL) y la vieja devuelve justo 1 000');
  const c = await consultaNube(nav, { res: R, prog: P, conPag: false });
  ok('consulta-nube usa la de siempre y muestra 1 000', c.n === 1000 && c.llamadas.some(l => l.fn === 'metas_consultar_docente'), c.n);
  ok('y avisa «Puede que falten resultados: la nube entrega 1 000 por vez»',
    /Puede que falten resultados: la nube entrega 1 000 por vez/.test(c.estado), c.estado);
  const d = await estadisticas(nav, { res: R, prog: P, conPag: false });
  ok('Estadísticas también lo avisa',
    /Puede que falten resultados: la nube entrega 1 000 por vez/.test(d.avisos), d.avisos);
  const e = await consultaNube(nav, { res: resultados(640), prog: P, conPag: false });
  ok('con la de siempre y 640 filas NO hay aviso (no se asusta al maestro de gusto)',
    e.n === 640 && !/Puede que falten/.test(e.estado), e.estado);

  console.log('\n4) Con más de 20 000 se para en 40 páginas y lo dice');
  const f = await consultaNube(nav, { res: resultados(20750), prog: P, conPag: true });
  ok('trajo 20 000 en 40 páginas', f.n === 20000 && f.llamadas.filter(l => l.fn === 'metas_consultar_docente_pag').length === 40, f.n);
  ok('y dice «Se trajeron 20 000 resultados; hay más en la nube»',
    /Se trajeron 20 000 resultados; hay más en la nube/.test(f.estado), f.estado);

  console.log('\n5) El tope de altas de docente se dice con palabras');
  {
    const ctx = await nav.newContext({ ...SIN_SW, viewport: { width: 412, height: 915 } });
    const pg = await ctx.newPage();
    await pg.route('**/rest/v1/**', r => {
      if (r.request().url().indexOf('metas_docente_alta_v2') >= 0) {
        return r.fulfill({ status: 400, contentType: 'application/json',
          body: JSON.stringify({ code: 'P0001', message: 'tope_altas_ip', hint: 'Se crearon muchas cuentas desde esta conexión hoy.' }) });
      }
      return r.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    });
    await pg.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
    await pg.waitForFunction(() => typeof window.docenteSuscribir === 'function');
    const visto = await pg.evaluate(async () => {
      const vistos = [];
      window.metasAlert = (m) => { vistos.push(String(m)); return Promise.resolve(); };
      window.toast = (m) => { vistos.push('TOAST ' + m); };
      const poner = (id, v) => { let i = document.getElementById(id);
        if (!i) { i = document.createElement('input'); i.id = id; i.type = 'hidden'; document.body.appendChild(i); } i.value = v; };
      poner('doc-nombre', 'Maestra De Prueba'); poner('doc-correo', 'prueba@ejemplo.invalid'); poner('doc-clave', 'clave-larga');
      await window.docenteSuscribir();
      return vistos;
    });
    ok('el maestro lee «Se crearon muchas cuentas desde esta conexión hoy. Prueba mañana o escríbenos»',
      visto.some(m => /Se crearon muchas cuentas desde esta conexión hoy\. Prueba mañana o escríbenos/.test(m)), visto);
    ok('y no un «No se pudo» genérico', !visto.some(m => /No se pudo/.test(m)), visto);
    await ctx.close();
  }

  await nav.close();
  console.log('\n' + (fallos ? '✘ ' + fallos + ' fallo(s)' : '✔ Todo en verde') + '\n');
  process.exit(fallos ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
