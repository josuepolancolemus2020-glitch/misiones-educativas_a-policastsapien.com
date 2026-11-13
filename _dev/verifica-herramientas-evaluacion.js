/* ═══════════════════════════════════════════════════════════════
   📏 HERRAMIENTAS DE EVALUACIÓN, ABIERTAS Y SACADAS EN PAPEL

   El caso que la pidió: «mañana evalúo el Himno en 6º-1, cinco
   actividades, cada una vale 100 %, la final es el promedio; quiero la
   hoja con los nombres para poner la nota a mano». Esta sonda abre la
   herramienta en un teléfono de 360 px con un 6º-1 de 43 (dos de ellos
   de prueba y uno que se fue) y comprueba:

   · QUE LOS NOMBRES SEAN LOS DE MI AULA: 40, por número de lista, sin
     el de prueba ni el que se fue.
   · QUE LA HOJA DIGA CÓMO SE CALIFICA, y que el grupo salga como 6º-1.
   · QUE SEA UNA HOJA CARTA: dentro del tope de 248 mm y un solo PDF de
     una página; y en dos hojas, dos páginas.
   · QUE LA RÚBRICA POR ALUMNO salga dos por hoja, con su nombre.
   · QUE LO GUARDADO VUELVA, y que se pueda tocar todo a 44 px sin que
     nada se salga del teléfono.

   Uso:
     node _dev/servidor-estatico.js       (en otra terminal)
     node _dev/verifica-herramientas-evaluacion.js
═══════════════════════════════════════════════════════════════ */
'use strict';
const { abrir, SIN_SW } = require('./lib-navegador');

const BASE = process.env.METAS_BASE || 'http://localhost:8123';
let fallos = 0;
function comprueba(que, ok, detalle) {
  console.log((ok ? '  ✓ ' : '  ✗ ') + que + (ok || detalle === undefined ? '' : '  → ' + JSON.stringify(detalle)));
  if (!ok) fallos++;
}

const NOMBRES = ['María José', 'Carlos Eduardo', 'Kenia Yamileth', 'Nelson Josué', 'Ana Gabriela', 'Luis Fernando',
  'Dilcia Marisol', 'José Ángel', 'Wendy Carolina', 'Óscar Alexander'];
const APELLIDOS = ['Paz Rodríguez', 'Ramírez Mejía', 'Varela Castillo', 'Hernández López', 'Zelaya Bonilla'];
function sembrado() {
  const lista = [];
  for (let n = 1; n <= 43; n++) {
    lista.push({ num: n, nombre: NOMBRES[n % 10] + ' ' + APELLIDOS[n % 5], alta: 1 });
  }
  lista[41].prueba = true;            /* el 42, inventado para probar */
  lista[42].nombre = 'Josué Test';
  lista[42].prueba = true;            /* el 43 también */
  lista[9].estado = 'trasladado';     /* el 10 se fue */
  return { v: 2, activo: 'G1', grupos: [{ id: 'G1', escuela: 'Esc. Francisco Morazán', grado: '6', seccion: '1', lista,
    boleta: { docente: 'Prof. de prueba' } }] };
}

(async () => {
  const nav = await abrir();
  const pg = await nav.newPage({ ...SIN_SW, viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true });
  const errores = [];
  pg.on('pageerror', e => errores.push(e.message));
  await pg.route('**/rest/v1/**', r => r.abort('failed'));
  await pg.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
  await pg.waitForFunction(() => typeof window.heRender === 'function' && typeof window.adState === 'function');
  await pg.evaluate(s => {
    localStorage.setItem('METAS_ADMIN_V1', JSON.stringify(s));
    localStorage.removeItem('METAS_INSTRUMENTOS_V1');
    switchView('view-herr-eval');
  }, sembrado());

  console.log('\n── el mosaico y el menú ──');
  comprueba('el mosaico está en la Zona Docente', await pg.$('#zd-grid #goto-heval-btn') !== null);
  const plant = await pg.$$eval('[data-plant]', bs => bs.map(b => b.textContent.replace(/\s+/g, ' ').trim()));
  comprueba('el Himno está entre las plantillas', plant.some(t => /Himno Nacional/.test(t)), plant);

  await pg.click('[data-plant="0"]');
  await pg.waitForSelector('#he-imp-lista');
  console.log('\n── la hoja del Himno ──');
  comprueba('trae las cinco actividades', (await pg.$$('.he-crit')).length === 5);
  comprueba('el grupo dice 6º-1 y está elegido', /6º-1/.test(await pg.textContent('.he-chip-on')));
  comprueba('cuenta 40 alumnos (sin los dos de prueba ni el que se fue)',
    /40 alumnos/.test(await pg.textContent('#he-body')));
  comprueba('dice cómo se califica', /Cada actividad vale 100 %\. La nota final es el promedio de las 5/
    .test(await pg.textContent('#he-como')));

  /* todo se toca a 44 px y nada se sale */
  const chicos = await pg.$$eval('#he-body button, #he-body summary', bs => bs
    .filter(b => b.offsetParent).map(b => { const r = b.getBoundingClientRect(); return { t: b.textContent.trim().slice(0, 30), w: r.width, h: r.height }; })
    .filter(r => r.h < 44 || r.w < 44));
  comprueba('todo lo que se toca mide 44 px o más', !chicos.length, chicos);
  const ancho = await pg.evaluate(() => document.querySelector('#view-herr-eval .view-scroll').scrollWidth);
  comprueba('nada se sale de los 360 px', ancho <= 360, ancho);

  const [hoja] = await Promise.all([pg.waitForEvent('popup'), pg.click('#he-imp-lista')]);
  await hoja.waitForLoadState('load');
  const datos = await hoja.evaluate(() => {
    const mm = (() => { const d = document.createElement('div'); d.style.cssText = 'position:absolute;height:100mm';
      document.body.appendChild(d); const r = d.getBoundingClientRect().height / 100; d.remove(); return r; })();
    const h = document.querySelector('.v-una .hoja');
    const filas = [...h.querySelectorAll('tbody tr')];
    return {
      filas: filas.length,
      nombres: filas.map(f => f.children[1].textContent),
      nums: filas.map(f => f.children[0].textContent),
      altoMm: h.getBoundingClientRect().height / mm,
      renglon: filas[0].getBoundingClientRect().height / mm,
      texto: h.textContent.replace(/\s+/g, ' '),
      cols: h.querySelectorAll('thead th').length
    };
  });
  comprueba('salen 40 filas', datos.filas === 40, datos.filas);
  comprueba('ni el de prueba ni el que se fue', !datos.nombres.some(n => /Test/.test(n)) && !datos.nums.includes('10') && !datos.nums.includes('42'));
  comprueba('van por número de lista', datos.nums[0] === '1' && datos.nums[datos.nums.length - 1] === '41', [datos.nums[0], datos.nums.slice(-1)[0]]);
  comprueba('Nº, alumno, cinco actividades y la nota final', datos.cols === 8, datos.cols);
  comprueba('el encabezado dice grupo, escuela y cómo se califica',
    /Grupo: 6º-1/.test(datos.texto) && /Francisco Morazán/i.test(datos.texto) && /promedio de las 5 actividades/.test(datos.texto));
  comprueba('cabe en el tope de 248 mm', datos.altoMm <= 248.5, datos.altoMm.toFixed(1));
  comprueba('el renglón aprovecha la hoja (5 mm o más para escribir la nota)', datos.renglon >= 5, datos.renglon.toFixed(1));
  const paginas = async () => {
    await hoja.emulateMedia({ media: 'print' });
    const pdf = await hoja.pdf({ preferCSSPageSize: true });
    await hoja.emulateMedia({ media: 'screen' });
    return (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
  };
  comprueba('en PDF es una sola página', await paginas() === 1);
  /* el PDF dispara «afterprint» y sale el aviso de volver: se cierra */
  await hoja.evaluate(() => { const o = document.getElementById('ad-volver-lista'); if (o) o.style.display = 'none'; });
  await hoja.click('#he-modo');
  const dos = await hoja.evaluate(() => [...document.querySelectorAll('.v-dos .hoja')].map(h => ({
    filas: h.querySelectorAll('tbody tr').length, mm: +h.dataset.mm })));
  comprueba('en dos hojas: 20 y 20 alumnos, renglón más alto', dos.length === 2 && dos[0].filas === 20 && dos[1].filas === 20
    && dos[0].mm > datos.renglon, dos);
  comprueba('y en PDF son dos páginas', await paginas() === 2);
  await hoja.close();

  console.log('\n── guardar y volver ──');
  await pg.fill('#he-titulo', 'Himno Nacional · viernes');
  await pg.click('#he-guardar');
  await pg.click('#he-menu');
  comprueba('la hoja guardada aparece en el menú', /Himno Nacional · viernes/.test(await pg.textContent('#he-body')));

  console.log('\n── rúbrica por alumno ──');
  await pg.click('[data-plant="1"]');
  await pg.waitForSelector('#he-imp-rub');
  const [rub] = await Promise.all([pg.waitForEvent('popup'), pg.click('#he-imp-rub')]);
  await rub.waitForLoadState('load');
  const r = await rub.evaluate(() => {
    const mm = (() => { const d = document.createElement('div'); d.style.cssText = 'position:absolute;height:100mm';
      document.body.appendChild(d); const x = d.getBoundingClientRect().height / 100; d.remove(); return x; })();
    const hs = [...document.querySelectorAll('.hoja')];
    return { hojas: hs.length, rubs: document.querySelectorAll('.rub').length,
      max: Math.max(...hs.map(h => h.getBoundingClientRect().height / mm)),
      primera: document.querySelector('.rub').textContent.replace(/\s+/g, ' ') };
  });
  comprueba('40 rúbricas en 20 hojas', r.rubs === 40 && r.hojas === 20, r);
  comprueba('cada hoja dentro de 248 mm', r.max <= 248.5, r.max.toFixed(1));
  comprueba('la rúbrica lleva el nombre y los niveles', /Nombre: \S/.test(r.primera) && /Lo logra muy bien/.test(r.primera));
  await rub.close();

  comprueba('sin errores en la página', !errores.length, errores);
  await nav.close();
  console.log(fallos ? `\n✗ ${fallos} fallo(s)` : '\n✓ Todo bien');
  process.exit(fallos ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
