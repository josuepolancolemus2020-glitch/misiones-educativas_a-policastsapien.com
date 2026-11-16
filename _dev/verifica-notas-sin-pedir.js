/* ═══════════════════════════════════════════════════════════════
   🧮 NINGUNA NOTA SE ESCRIBE SIN QUE EL MAESTRO LA PIDA

   El 10 de noviembre de 2026 (v479) se publicó un «autocompletado de los
   Parciales I–III» que corría solo cada vez que se abría Mi aula: donde
   no había nota, la inventaba (84 de base, nunca menos de 72, «MB» en
   Personalidad), «reparaba» las notas bajas del III Parcial y lo subía
   todo a la nube de las familias. Nadie lo pidió y nadie lo vio venir.

   Esta sonda falla si vuelve a pasar algo parecido:

   · EN EL ARCHIVO: nada que se llame al pintar Mi aula o la boleta llama
     a la reconstrucción; la reconstrucción no guarda nada por su cuenta
     ni lleva valores por defecto.
   · ABRIENDO MI AULA de un 6º con notas a medias y celdas vacías, y
     pasando por TODAS las pestañas y los cuatro parciales de la boleta:
     las notas quedan idénticas, y no aparece la marca del autocompletado.
   · SIN RESPALDOS, la reconstrucción no propone ni un cambio.
   · CON UN RESPALDO: copia solo la nota que ya existía y solo a la celda
     vacía; no pisa lo escrito; no usa una copia que traiga la marca.
   · EL BOTÓN enseña la lista antes de copiar; «No copiar» no cambia nada;
     «Sí» copia eso y nada más, y guarda una copia en «🕘 Deshacer».
   · LA REVISIÓN de lo que ya se inventó lista lo puesto solo contra la
     copia de antes, y no borra nada hasta el segundo «Sí».

   Uso:
     node _dev/servidor-estatico.js       (en otra terminal)
     node _dev/verifica-notas-sin-pedir.js
═══════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const { abrir, SIN_SW } = require('./lib-navegador');

const BASE = process.env.METAS_BASE || 'http://localhost:8123';
const RAIZ = path.resolve(__dirname, '..');
let fallos = 0, pasan = 0;
const comprueba = (m, c, extra) => {
  if (c) { pasan++; console.log('  ✅ ' + m); }
  else { fallos++; console.log('  ❌ ' + m + (extra !== undefined ? '  ' + JSON.stringify(extra).slice(0, 400) : '')); }
};

/* El cuerpo de una función de nivel superior, hasta la llave que la cierra
   en la primera columna. */
function cuerpo(src, nombre) {
  const m = src.match(new RegExp('\\n(?:async )?function ' + nombre + '\\([\\s\\S]*?\\n}\\n'));
  return m ? m[0] : '';
}
/* Qué función de nivel superior contiene cada llamada a `nombre(` */
function quienesLlaman(src, nombre) {
  const out = new Set();
  const re = new RegExp('\\b' + nombre + '\\(', 'g');
  let m;
  while ((m = re.exec(src))) {
    const antes = src.slice(0, m.index);
    const f = [...antes.matchAll(/\n(?:async )?function (\w+)\(/g)].pop();
    const esDef = /function\s+$/.test(antes.slice(-20));
    if (!esDef) out.add(f ? f[1] : '(arriba)');
  }
  return [...out];
}

const MATS = ['Español', 'Matemáticas', 'Ciencias Naturales', 'Ciencias Sociales', 'Inglés'];
const NOMS = ['Ada Sarai Sevilla', 'Carlos Eduardo Paz', 'Daniel Alejandro Reyes', 'Génesis Nicolle Zelaya',
  'Kevin Josué Martínez', 'María de los Ángeles Hernández', 'Óscar David Mejía', 'Paola Michelle Castro'];

/* Un 6º como los de verdad a mitad de año: el I completo, el II a medias,
   el III con dos notas bajas (que el autocompletado «reparaba») y casi
   todo vacío, personalidad solo de algunos. */
function sembrado(extraBoleta) {
  const lista = NOMS.map((n, i) => ({ num: i + 1, nombre: n }));
  const notas = { I: {}, II: {}, III: {}, IV: {} };
  MATS.forEach((m, k) => {
    notas.I[m] = {}; notas.II[m] = {}; notas.III[m] = {};
    lista.forEach(a => {
      notas.I[m][a.num] = 60 + ((a.num * 13 + k * 7) % 40);
      if (a.num <= 4) notas.II[m][a.num] = 65 + ((a.num * 11 + k * 5) % 35);
    });
  });
  notas.III['Matemáticas'][2] = 58;
  notas.III['Español'][5] = 63;
  notas.I['Responsabilidad'] = { 1: 'MB', 3: 'S' };
  return { v: 2, activo: 'G1', grupos: [{ id: 'G1', grado: '6', seccion: '1', escuela: 'ESC. DE PRUEBA',
    materias: MATS, lista, colectas: [], asistencia: [{ f: '2026-08-12', aus: { 3: 'A' } }], notas,
    boleta: Object.assign({ parcialFechas: {} }, extraBoleta || {}),
    controles: [], bitacora: [], lectura: [], convocatorias: [] }] };
}

(async () => {
  /* ── 0 · en el archivo ── */
  console.log('\n── en el archivo ──');
  const ra = fs.readFileSync(path.join(RAIZ, 'js/tools/registros-admin.js'), 'utf8');
  /* Sin comentarios: el que cuenta la historia nombra las funciones */
  const srcSin = ra.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  comprueba('ya no existe el autocompletado que corría al abrir Mi aula',
    !/\badAutoAsegurarParcialesI_III\b/.test(srcSin));
  const PERMITIDOS = ['adReconstruirDesdeNubeYRespaldos', 'adRecuperarNotasNube', 'adAbrirHistorialVersionesModal'];
  const llamanRec = quienesLlaman(srcSin, 'adReconstruirParcialesI_IIISincrono')
    .concat(quienesLlaman(srcSin, 'adReconstruirDesdeNubeYRespaldos'));
  comprueba('la reconstrucción solo se llama desde los botones que pulsa el maestro',
    llamanRec.length > 0 && llamanRec.every(f => PERMITIDOS.includes(f)), llamanRec);
  const llamanRev = quienesLlaman(srcSin, 'adRevisarNotasPuestasSolas');
  comprueba('la revisión de lo inventado solo se abre desde un botón',
    llamanRev.every(f => /^adRender(Lista|Sace)$/.test(f)) &&
    /addEventListener\('click', e => \{?\s*adRevisarNotasPuestasSolas/.test(srcSin), llamanRev);
  const rec = cuerpo(srcSin, 'adReconstruirParcialesI_IIISincrono');
  comprueba('la reconstrucción no guarda nada por su cuenta (ni adSave, ni el Plan de Acción, ni localStorage)',
    rec && !/\badSave\(|paSaveData|localStorage\.setItem|adSyncProgramar/.test(rec));
  comprueba('ni lleva notas o letras por defecto (84, 72, MB…) ni pone la marca',
    rec && !/\b(84|72|74|75|92)\b|'(MB|S|B)'|autoRecI_III_v479\s*=/.test(rec));
  /* Al pintar se pueden ENGANCHAR los botones (addEventListener), pero no
     llamar a la reconstrucción ni a la revisión de corrido. */
  for (const f of ['renderAdmin', 'adRenderSace', 'adRenderLista']) {
    const lineas = cuerpo(srcSin, f).split('\n');
    const malas = lineas.filter((l, i) => /adReconstruir|adRecuperarNotasNube\(|adRevisarNotasPuestasSolas\(/.test(l) &&
      !/addEventListener|=>/.test(l + (lineas[i - 1] || '')));
    comprueba('pintar (' + f + ') no llama a la reconstrucción ni a la revisión', lineas.length > 1 && !malas.length, malas);
  }

  /* ── 1 · abriendo Mi aula ── */
  const nav = await abrir();
  const pg = await nav.newPage({ ...SIN_SW, viewport: { width: 390, height: 800 } });
  const errores = [];
  pg.on('pageerror', e => errores.push(e.message));
  await pg.route('**/rest/v1/**', r => r.abort('failed'));   /* la nube no se toca */
  await pg.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
  await pg.waitForFunction(() => typeof window.renderAdmin === 'function' && typeof window.adReconstruirParcialesI_IIISincrono === 'function');

  const sembrar = (sem, extra) => pg.evaluate(([s, x]) => {
    localStorage.clear();
    localStorage.setItem('METAS_ADMIN_V1', JSON.stringify(s));
    Object.keys(x || {}).forEach(k => localStorage.setItem(k, typeof x[k] === 'string' ? x[k] : JSON.stringify(x[k])));
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-admin').classList.add('active');
  }, [sem, extra || null]);
  const notas = () => pg.evaluate(() => JSON.stringify(JSON.parse(localStorage.getItem('METAS_ADMIN_V1')).grupos[0].notas));
  const grupo = () => pg.evaluate(() => JSON.parse(localStorage.getItem('METAS_ADMIN_V1')).grupos[0]);
  /* Lo que importa es lo LLENO: una celda '' y una que no existe dicen lo mismo */
  const llenas = n => {
    const o = typeof n === 'string' ? JSON.parse(n) : n, out = {};
    Object.keys(o || {}).forEach(p => Object.keys(o[p] || {}).forEach(c => Object.keys(o[p][c] || {}).forEach(a => {
      const v = o[p][c][a]; if (v !== '' && v != null) out[p + '|' + c + '|' + a] = v;
    })));
    return out;
  };

  console.log('\n── abriendo Mi aula, todas las pestañas ──');
  const sem = sembrado();
  await sembrar(sem);
  const antes = JSON.stringify(llenas(sem.grupos[0].notas));
  await pg.evaluate(() => renderAdmin());
  await pg.waitForTimeout(300);
  for (const tab of ['lista', 'asis', 'eq', 'sace', 'est', 'lec', 'ctrl', 'eco', 'com']) {
    const hay = await pg.$('[data-adtab="' + tab + '"]');
    if (!hay) continue;
    await pg.click('[data-adtab="' + tab + '"]');
    await pg.waitForTimeout(250);
    if (tab === 'sace') {
      /* los cuatro parciales y las tres vistas (notas, personalidad, faltas) */
      await pg.evaluate(() => {
        const b = document.getElementById('ad-tab-body');
        ['I', 'II', 'III', 'IV'].forEach(p => ['aprov', 'pers', 'inasis'].forEach(v => {
          b.dataset.parcial = p; b.dataset.vista = v; adRenderSace(b, adLoad());
        }));
      });
    }
  }
  await pg.evaluate(() => renderAdmin(true));
  await pg.waitForTimeout(1500);   /* lo que antes corría «en segundo plano» */
  comprueba('después de pasar por todas las pestañas y los cuatro parciales, las notas son las mismas',
    JSON.stringify(llenas(await notas())) === antes);
  const g1 = await grupo();
  comprueba('las dos notas bajas del III Parcial siguen como el maestro las puso (58 y 63)',
    g1.notas.III['Matemáticas'][2] === 58 && g1.notas.III['Español'][5] === 63);
  comprueba('no aparece la marca del autocompletado', !(g1.boleta && g1.boleta.autoRecI_III_v479));
  comprueba('nadie guardó una copia «Autocompletar…» en Deshacer',
    !(await pg.evaluate(() => (JSON.parse(localStorage.getItem('METAS_ADMIN_UNDO_V1') || '[]')).some(u => /Autocompletar/.test(u.e)))));

  /* ── 2 · la reconstrucción, sin y con respaldos ── */
  console.log('\n── la reconstrucción, sin respaldos ──');
  const sinResp = await pg.evaluate(() => {
    const d = adLoad();
    const r = adReconstruirParcialesI_IIISincrono(d, { versiones: [] });
    return { n: r.cambios.length, igual: JSON.stringify(r.grupoRecuperado.notas) === JSON.stringify(d.notas) };
  });
  comprueba('sin respaldos no propone ni un cambio', sinResp.n === 0 && sinResp.igual, sinResp);

  console.log('\n── con un respaldo de verdad ──');
  /* El respaldo trae: una nota que aquí está vacía (debe copiarse), otra
     distinta en una celda llena (no debe pisarse) y un día de asistencia
     nuevo. Una SEGUNDA copia con la marca trae una nota inventada que no
     debe copiarse. */
  const resp = sembrado();
  resp.grupos[0].notas.II['Inglés'][6] = 88;           // vacía hoy → se copia
  resp.grupos[0].notas.III['Matemáticas'][2] = 95;     // hoy 58 → NO se pisa
  resp.grupos[0].asistencia.push({ f: '2026-08-20', aus: { 7: 'E' } });
  const marcado = sembrado({ autoRecI_III_v479: 1 });
  marcado.grupos[0].notas.III['Inglés'] = { 1: 84, 2: 84, 3: 84 };
  const undo = [
    { t: '2026-11-01T15:00:00.000Z', e: 'Cambio local', admin: JSON.stringify(resp) },
    { t: '2026-11-10T16:00:00.000Z', e: 'Cambio local', admin: JSON.stringify(marcado) }
  ];
  await sembrar(sembrado(), { METAS_ADMIN_UNDO_V1: undo });
  const conResp = await pg.evaluate(() => {
    const r = adReconstruirParcialesI_IIISincrono(adLoad());
    return { cambios: r.cambios, omit: r.omitidas, g: r.grupoRecuperado };
  });
  const notasCam = conResp.cambios.filter(c => c.campo !== 'Asistencia');
  comprueba('copia exactamente la nota que ya existía y faltaba (II · Inglés · #6 = 88)',
    notasCam.length === 1 && notasCam[0].parcial === 'II' && notasCam[0].campo === 'Inglés' && notasCam[0].num === 6 && notasCam[0].valor === 88, conResp.cambios);
  comprueba('no pisa la nota que el maestro ya tenía (III · Matemáticas · #2 sigue en 58)',
    conResp.g.notas.III['Matemáticas'][2] === 58);
  comprueba('no copia nada de la copia que trae la marca del autocompletado',
    conResp.omit.versiones === 1 && !conResp.g.notas.III['Inglés'][1], conResp.omit);
  comprueba('copia el día de asistencia que faltaba, y solo ese',
    conResp.cambios.filter(c => c.campo === 'Asistencia').length === 1);
  comprueba('cada cambio dice de dónde sale', conResp.cambios.every(c => c.fuente));

  /* ── 3 y 4 · los botones de rescate (rev. 9) ──
     «Copiar notas de mis respaldos» y «Revisar notas que la aplicación puso
     sola» salen de la pantalla: en el modelo nuevo nada se repone de copias
     y la ventana 🛟 ya no tiene por dónde abrirse (09-INTERFAZ.md, Notas
     SACE). Lo que se comprueba ahora es que el chip ya no esté. */
  console.log('\n── sin la ventana de rescate ──');
  await pg.evaluate(() => { _adTab = 'sace'; renderAdmin(true); });
  comprueba('ya no está el chip «🛟 Recuperar o revisar notas»', !(await pg.$('#ad-sace-chip-rescate')));
  comprueba('ni «🕓 Ver cambios guardados»', !(await pg.$('#ad-sace-versiones')));
  void llenas; void notas; void grupo; void sembrar; void sembrado;

  comprueba('ningún error de JavaScript en la página', errores.length === 0, errores);
  await nav.close();
  console.log('\n' + (fallos ? '❌ ' + fallos + ' fallo(s)' : '✅ todo en verde') + ' · ' + pasan + ' comprobaciones\n');
  process.exit(fallos ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
