/* ═══════════════════════════════════════════════════════════════
   🤝 LOS EQUIPOS DE TRABAJO, ABIERTOS Y USADOS CON EL DEDO

   _dev/prueba-equipos.js comprueba el reparto sin pantalla. Esta abre
   Mi aula en un teléfono de 360 px, con un grupo de 43 como los de
   verdad —dos alumnos inventados para probar, tres que faltaron hoy,
   dos sin anotar si son niña o varón, tres sin notas— y comprueba lo
   que solo se ve abriéndola:

   · QUE LOS DE PRUEBA SE PUEDAN DEJAR FUERA, que es lo que se pidió: con
     la casilla puesta no salen en ningún equipo, ni en WhatsApp, ni en
     el papel; y la sugerencia de marcar al que SE LLAMA «Test» funciona.
   · QUE LOS QUE FALTARON HOY Y LOS QUE SE DEJAN FUERA A MANO no entren.
   · QUE EL AVISO DE ANTES DE ARMAR DIGA LA VERDAD: los equipos que salen
     son los que la pantalla prometió.
   · QUE LOS COORDINADORES SE ELIJAN COMO SE PASA LISTA: los mismos
     chips, un toque marca y guarda, sin repintar; que el aviso diga
     cuántos van para cuántos equipos; que a cada equipo le toque el
     suyo, primero en su equipo, en WhatsApp y en el papel; y que lo que
     un maestro había separado antes se lea como sus coordinadores.
   · QUE SALGAN PAREJOS de verdad, contado sobre lo que se pintó.
   · QUE LAS NOTAS NO SALGAN en los equipos.
   · QUE SE CAMBIEN A MANO sin repintar la pantalla entera, y que «Los de
     antes» devuelva lo anterior.
   · QUE AGUANTE CERRAR LA APLICACIÓN.
   · QUE EL PAPEL SEA UNA HOJA, también en el peor caso: parejas con
     nombres de cuatro apellidos.
   · QUE TODO SE PUEDA TOCAR a 44 px y nada se salga del teléfono.

   Uso:
     node _dev/servidor-estatico.js       (en otra terminal)
     node _dev/verifica-equipos.js
═══════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { abrir, SIN_SW } = require('./lib-navegador');

const BASE = process.env.METAS_BASE || 'http://localhost:8123';
const RAIZ = path.resolve(__dirname, '..');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'metas-equipos-'));
let fallos = 0, pasan = 0;
const comprueba = (m, c, extra) => {
  if (c) { pasan++; console.log('  ✅ ' + m); }
  else { fallos++; console.log('  ❌ ' + m + (extra !== undefined ? '  ' + JSON.stringify(extra).slice(0, 400) : '')); }
};

/* Nombres largos de verdad: el que parte el renglón no es «Ana Paz». */
const NOMS = ['Ada Sarai Sevilla', 'Ashly Belén Miranda', 'Brianna Monserrath López', 'Carlos Eduardo Paz',
  'Cristy Daniela Amador Villanueva', 'Daniel Alejandro Reyes', 'Emanuel Josué Cruz Maldonado',
  'Génesis Nicolle Zelaya Fúnez', 'José Fernando Bautista Ordóñez', 'Kevin Josué Martínez',
  'María de los Ángeles Hernández Sabillón', 'Marvin Antonio Flores', 'Nahomy Alejandra Rivera',
  'Óscar David Mejía', 'Paola Michelle Castro', 'Selvin Omar Rodríguez', 'Kenia Yamileth Ramírez',
  'Wilmer Isaac Lagos', 'Yeimy Dayana Osorio', 'Allan Ricardo Pineda', 'Dania Gabriela Suazo',
  'Elvin Adonay Martínez', 'Fátima Nicole Aguilar', 'Gerson Alexis Bonilla', 'Heidy Karina Zúniga',
  'Iván Eduardo Chávez', 'Jennifer Paola Díaz', 'Luis Fernando Núñez', 'Mayra Alejandra Salgado',
  'Nelson Josué Varela', 'Olga Marina Espinal', 'Pedro Pablo Irías', 'Rosa Emilia Cárcamo',
  'Samuel David Andino', 'Tania Lizeth Mendoza', 'Ulises Mauricio Rápalo', 'Valeria Sofía Turcios',
  'Walter Enrique Cálix', 'Ximena Julieth Ortez', 'Yosselin Marisol Amaya', 'Zoila Esperanza Figueroa',
  'Alumno de Prueba', 'Josué Test'];
const NINAS = /^(Ada|Ashly|Brianna|Cristy|Génesis|María|Nahomy|Paola|Kenia|Yeimy|Dania|Fátima|Heidy|Jennifer|Mayra|Olga|Rosa|Tania|Valeria|Ximena|Yosselin|Zoila)\b/;
const AUSENTES = { 4: 'A', 17: 'A', 30: 'E' };

function hoy() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function sembrado(opc) {
  opc = opc || {};
  const lista = NOMS.map((n, i) => {
    const a = { num: i + 1, nombre: n };
    if (i !== 5 && i !== 20) a.sexo = NINAS.test(n) ? 'F' : 'M';
    if (i === 41) a.prueba = true;             /* #42, ya marcado */
    return a;
  });
  const mats = ['Español', 'Matemáticas', 'Ciencias Naturales', 'Ciencias Sociales'];
  const notas = {};
  if (!opc.sinNotas) {
    ['I', 'II'].forEach((p, k) => {
      notas[p] = {};
      mats.forEach(m => {
        notas[p][m] = {};
        lista.forEach(a => { if (a.num <= 40) notas[p][m][a.num] = 55 + ((a.num * 37 + k * 11 + m.length * 7) % 44); });
      });
    });
  }
  return { v: 2, activo: 'G1', grupos: [{ id: 'G1', grado: '6', seccion: '1', escuela: 'ESC. JOHN ARNOLD COOK',
    materias: mats, lista, colectas: [], asistencia: [{ f: hoy(), aus: AUSENTES }], notas,
    controles: [], bitacora: [], lectura: [], convocatorias: [] }] };
}

/* Cuenta las páginas del PDF, que es la verdad de la impresora, y lee
   la letra que la hoja escogió para caber. Se le quita solo el disparo
   de imprimir: el ajuste de la letra corre como en el teléfono. */
async function paginasDe(nav, html, nombre) {
  const archivo = path.join(TMP, nombre + '.html');
  fs.writeFileSync(archivo, html.replace(/<script>window\.onload[\s\S]*?<\/script>/, ''));
  const hoja = await nav.newPage(SIN_SW);
  await hoja.emulateMedia({ media: 'print' });
  await hoja.goto('file://' + archivo);
  const letra = await hoja.evaluate(() => +document.querySelector('.hoja').dataset.letra);
  /* la ★ del coordinador va en el margen, en lugar de su número: se lee lo
     que pinta el navegador, no el HTML */
  const estrellas = await hoja.evaluate(() => [...document.querySelectorAll('li')]
    .filter(li => getComputedStyle(li).listStyleType.includes('★')).length);
  const pdf = path.join(TMP, nombre + '.pdf');
  await hoja.pdf({ path: pdf, format: 'Letter', printBackground: true });
  await hoja.close();
  return { paginas: (fs.readFileSync(pdf).toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length, letra, estrellas };
}

(async () => {
  /* ── 0 · leído del archivo ── */
  console.log('\n── en el archivo ──');
  const ra = fs.readFileSync(path.join(RAIZ, 'js/tools/registros-admin.js'), 'utf8');
  const idx = fs.readFileSync(path.join(RAIZ, 'index.html'), 'utf8');
  const insertar = (ra.match(/async function adInsertarAlumno\(\)[\s\S]*?\n}\n/) || [''])[0];
  comprueba('al insertar un alumno a media lista, los equipos guardados se recorren con él',
    /eqRecorrer\(d, pos\)/.test(insertar));
  comprueba('la portada carga js/tools/equipos.js, sellado como los demás',
    /<script src="js\/tools\/equipos\.js\?v=\d+"><\/script>/.test(idx));
  const orden = [...ra.matchAll(/data-adtab="(\w+)"/g)].map(m => m[1]);
  comprueba('la pestaña 🤝 Equipos va justo detrás de 📋 Asistencia: se pasa lista y se arman con los que vinieron',
    orden.indexOf('eq') === orden.indexOf('asis') + 1, orden);

  const nav = await abrir();
  const pg = await nav.newPage({ ...SIN_SW, viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true });
  const errores = [];
  pg.on('pageerror', e => errores.push(e.message));
  await pg.route('**/rest/v1/**', r => r.abort('failed'));   /* la nube no se toca */
  await pg.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
  await pg.waitForFunction(() => typeof window.renderAdmin === 'function' && typeof window.adRenderEquipos === 'function');
  const abrirTab = async sem => {
    await pg.evaluate(s => {
      if (s) localStorage.setItem('METAS_ADMIN_V1', JSON.stringify(s));
      document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
      document.getElementById('view-admin').classList.add('active');
      renderAdmin();
      document.querySelector('[data-adtab="eq"]').click();
    }, sem || null);
    await pg.waitForSelector('#eq-armar');
  };
  const eq = () => pg.evaluate(() => JSON.parse(localStorage.getItem('METAS_ADMIN_V1')).grupos[0].equipos || {});
  const cuenta = () => pg.$eval('#eq-cuenta strong', n => +n.textContent);
  const equiposPintados = () => pg.$$eval('.eq-eq:not(.eq-eq-sin)', ss => ss.map(s =>
    [...s.querySelectorAll('[data-eqal]')].map(b => ({ n: +b.dataset.eqal, fuera: b.classList.contains('eq-al-fuera') }))));
  const aceptar = async () => { await pg.waitForSelector('#mdlg-ok'); await pg.click('#mdlg-ok'); await pg.waitForTimeout(250); };

  await abrirTab(sembrado());

  /* ── 1 · quiénes entran ── */
  console.log('\n── quiénes entran ──');
  comprueba('entran 39 de 43: fuera el #42 de prueba y los tres que faltaron hoy', await cuenta() === 39, await cuenta());
  comprueba('los de prueba quedan fuera sin que el maestro lo pida (la casilla viene puesta)',
    await pg.isChecked('#eq-sin-prueba'));
  await pg.click('#eq-sin-prueba'); await pg.waitForTimeout(150);
  comprueba('quitando la casilla, el de prueba vuelve a entrar (40)', await cuenta() === 40);
  comprueba('y la elección se guarda', (await eq()).conf.sinPrueba === false);
  await pg.click('#eq-sin-prueba'); await pg.waitForTimeout(150);
  comprueba('y el foco se queda en la casilla, no se va al principio de la página',
    await pg.evaluate(() => document.activeElement && document.activeElement.id) === 'eq-sin-prueba');
  const sug = await pg.$$eval('[data-eqprueba]', bs => bs.map(b => +b.dataset.eqprueba));
  comprueba('sugiere marcar de prueba a «Josué Test» (#43), y solo a él', JSON.stringify(sug) === '[43]', sug);
  await pg.click('[data-eqprueba="43"]'); await aceptar();
  comprueba('con un toque queda marcado: entran 38', await cuenta() === 38);
  comprueba('y la marca es la misma de 📈 Estadísticas (sale también del informe del grado)',
    await pg.evaluate(() => JSON.parse(localStorage.getItem('METAS_ADMIN_V1')).grupos[0].lista[42].prueba === true));
  comprueba('los que faltaron hoy salen nombrados', /Carlos Eduardo Paz.*Kenia Yamileth Ramírez.*Nelson Josué Varela/
    .test(await pg.textContent('#eq-quien')));
  await pg.click('#eq-det-fuera summary');
  await pg.click('[data-eqfuera="10"]'); await pg.waitForTimeout(150);
  comprueba('dejar fuera a mano a #10: entran 37', await cuenta() === 37);
  const fu = (await eq()).fuera;
  comprueba('se guarda solo por HOY', fu && fu.f === hoy() && JSON.stringify(fu.nums) === '[10]', fu);
  comprueba('el cajón se queda abierto y el foco en el mismo alumno',
    await pg.evaluate(() => document.querySelector('#eq-det-fuera').open &&
      document.activeElement && document.activeElement.dataset.eqfuera === '10'));
  comprueba('el que se deja fuera se ve tachado y con la palabra «fuera», no solo con otro color',
    await pg.$eval('[data-eqfuera="10"]', b => b.textContent.includes('fuera') &&
      getComputedStyle(b.querySelector('.ad-chip-num')).textDecorationLine.includes('line-through')));

  /* ── 1-bis · los coordinadores, como se pasa lista ── */
  console.log('\n── los coordinadores, como se pasa lista ──');
  const estado = () => pg.$eval('#eq-coord-estado', e => e.hidden ? '' : e.textContent.trim());
  const kHoy = await pg.evaluate(() => eqTamanos(37, 'tam', 4).length);
  comprueba('el cajón viene cerrado: no le alarga la pantalla a quien no los usa',
    !(await pg.$eval('#eq-det-coord', x => x.open)) && await estado() === '');
  await pg.click('#eq-det-coord summary');
  const chipsCoord = await pg.$$eval('#eq-det-coord .ad-chips > .ad-chip', bs => bs.map(b => ({
    n: +b.dataset.eqcoord, num: b.querySelector('.ad-chip-num').textContent.trim(),
    nom: (b.querySelector('.ad-chip-nom') || {}).textContent })));
  comprueba('son los chips de pasar lista: los 43 de la lista, con su número y su primer nombre',
    chipsCoord.length === 43 && chipsCoord[0].num === '#1' && chipsCoord[0].nom === 'Ada', chipsCoord.slice(0, 2));
  const chip1 = await pg.$('[data-eqcoord="1"]');
  const fondoSin = await pg.$eval('[data-eqcoord="2"]', b => getComputedStyle(b).backgroundColor);
  await pg.click('[data-eqcoord="1"]'); await pg.waitForTimeout(350);
  comprueba('un toque lo hace coordinador y se guarda en el momento, sin botón de guardar',
    JSON.stringify((await eq()).coord) === '[1]', (await eq()).coord);
  comprueba('el chip queda relleno y con ⭐, no solo de otro color, sin repintar la lista',
    await pg.$eval('[data-eqcoord="1"]', (b, f) => b.getAttribute('aria-pressed') === 'true' &&
      b.querySelector('.ad-chip-num').textContent.includes('⭐') && getComputedStyle(b).backgroundColor !== f, fondoSin) &&
    await pg.evaluate(el => el.isConnected, chip1));
  comprueba('y el foco se queda en el chip que tocó',
    await pg.evaluate(() => document.activeElement && document.activeElement.dataset.eqcoord) === '1');
  comprueba(`el aviso dice en el momento cuántos van para cuántos equipos (hoy salen ${kHoy})`,
    (await estado()).startsWith('⚠️ 1 coordinador para ' + kHoy + ' equipos'), await estado());
  await pg.click('[data-eqcoord="1"]'); await pg.waitForTimeout(150);
  comprueba('otro toque lo quita, y el aviso se calla',
    JSON.stringify((await eq()).coord) === '[]' && await estado() === '' &&
    !(await pg.$eval('[data-eqcoord="1"]', b => b.textContent.includes('⭐'))));
  const aus = await pg.$eval('[data-eqcoord="4"]', b => ({ tag: b.textContent.includes('🚫 faltó'),
    raya: getComputedStyle(b).borderTopStyle }));
  comprueba('el que faltó hoy se ve con la raya cortada y «🚫 faltó»', aus.tag && aus.raya === 'dashed', aus);
  const COORD = [1, 3, 5, 7, 9, 11, 13, 15, 18, 20].slice(0, kHoy);
  for (const n of COORD) await pg.click(`[data-eqcoord="${n}"]`);
  await pg.waitForTimeout(150);
  comprueba(`se eligen ${kHoy} de un toque cada uno y se guardan en orden`,
    JSON.stringify((await eq()).coord) === JSON.stringify(COORD), (await eq()).coord);
  comprueba('con uno por equipo el aviso lo confirma',
    await estado() === '✅ ' + kHoy + ' coordinadores para ' + kHoy + ' equipos: uno en cada equipo', await estado());
  comprueba('y el cajón dice cuántos son', (await pg.textContent('#eq-coord-n')).trim() === '(' + kHoy + ')');
  await pg.click('[data-eqcoord="4"]'); await pg.waitForTimeout(150);
  comprueba('un coordinador que hoy no entra se cuenta aparte',
    (await estado()).endsWith('· 1 no entra hoy'), await estado());
  await pg.click('[data-eqcoord="4"]'); await pg.waitForTimeout(150);
  const tamCoord = await pg.$$eval('#eq-det-coord .ad-chip', bs => Math.min(...bs.map(b => b.getBoundingClientRect().height)));
  comprueba('los chips miden 44 px o más', tamCoord >= 43.5, tamCoord);

  /* ── 2 · el aviso de antes de armar ── */
  console.log('\n── cuántos, dicho antes de armar ──');
  const prev = await pg.textContent('#eq-prev');
  const esperado = await pg.evaluate(() => eqTamanosTxt(eqTamanos(37, 'tam', 4)));
  comprueba(`con 37 y «de a 4» avisa «${esperado}»`, prev.includes(esperado), prev);
  await pg.click('#eq-mas'); await pg.waitForTimeout(120);
  comprueba('«+» pasa a 5 por equipo', (await pg.textContent('#eq-valor')).trim() === '5' && (await eq()).conf.valor === 5);
  const k5 = await pg.evaluate(() => eqTamanos(37, 'tam', 5).length);
  comprueba(`y el aviso de los coordinadores cambia con él: ${kHoy} para ${k5} equipos`,
    (await estado()).startsWith('⚠️ ' + kHoy + ' coordinadores para ' + k5 + ' equipos: en ' + (kHoy - k5)), await estado());
  await pg.click('#eq-menos'); await pg.waitForTimeout(120);
  comprueba('y vuelve con «−»', (await estado()).startsWith('✅'), await estado());

  /* ── 3 · armar ── */
  console.log('\n── los equipos ──');
  const confAntes = await pg.$('.eq-card-conf');
  await pg.click('#eq-armar'); await pg.waitForTimeout(500);
  let gs = await equiposPintados();
  const todos = gs.flat().map(o => o.n).sort((a, b) => a - b);
  const entran = Array.from({ length: 43 }, (_, i) => i + 1).filter(n => ![42, 43, 4, 17, 30, 10].includes(n));
  comprueba('los 37 que entran están en UN equipo cada uno, y ninguno de los que se quedan fuera',
    JSON.stringify(todos) === JSON.stringify(entran), todos);
  comprueba(`salen los equipos que se avisaron (${esperado})`,
    await pg.evaluate(t => eqTamanosTxt(t), gs.map(g => g.length)) === esperado);
  const sexo = await pg.evaluate(() => JSON.parse(localStorage.getItem('METAS_ADMIN_V1')).grupos[0].lista
    .reduce((o, a) => (o[a.num] = a.sexo || '', o), {}));
  const F = entran.filter(n => sexo[n] === 'F').length;
  const malSexo = gs.filter(g => { const f = g.filter(o => sexo[o.n] === 'F').length, e = F * g.length / 37; return f > Math.ceil(e) || f < Math.floor(e); });
  comprueba(`niñas y varones mezclados: a cada equipo le tocan las niñas que le corresponden (${F} entre ${gs.length})`, !malSexo.length, malSexo);
  const medida = await pg.textContent('.eq-medida');
  comprueba('debajo se cuenta cómo quedaron: tamaños, niñas y varones, y el promedio de los equipos',
    /Niñas por equipo/.test(medida) && /promedio/.test(medida) && /van mejor/.test(medida), medida);
  const rango = (medida.match(/entre (\d+) y (\d+)/) || medida.match(/promedio: (\d+)()/) || []).slice(1).filter(Boolean).map(Number);
  comprueba('y el promedio de un equipo al otro cambia a lo más 4 puntos', rango.length && (rango.length === 1 || rango[1] - rango[0] <= 4), rango);
  const conNumeros = await pg.$$eval('.eq-eq', ss => ss.map(s => s.textContent
    .replace(/#\d+/g, '').replace(/Equipo \d+/g, '').replace(/hoy \d+ de \d+/g, '').replace(/^\s*\d+\s*$/m, '')
    .match(/\b\d{2,3}\b/g)).filter(Boolean));
  comprueba('ninguna nota sale al lado de un nombre', !conNumeros.length, conNumeros);
  const coordsEq = await pg.$$eval('.eq-eq:not(.eq-eq-sin)', ss => ss.map(s => {
    const bs = [...s.querySelectorAll('[data-eqal]')];
    return { n: bs.filter(b => b.classList.contains('eq-al-coord')).length,
             primero: !!bs[0] && bs[0].classList.contains('eq-al-coord') && bs[0].textContent.includes('⭐ coordina') };
  }));
  comprueba('a cada equipo le tocó un coordinador, y va primero con «⭐ coordina»',
    coordsEq.every(c => c.n === 1 && c.primero), coordsEq);
  comprueba('y la pantalla lo dice debajo, sin avisos en ninguna tarjeta',
    /Cada equipo tiene su coordinador/.test(medida) && !(await pg.$('.eq-eq-aviso')), medida);
  comprueba('armar no repinta la pantalla entera (la parte de arriba es la misma)',
    await pg.evaluate(el => el.isConnected, confAntes));
  const reparto1 = (await eq()).reparto;

  /* ── 4 · a mano ── */
  console.log('\n── cambiarlos a mano ──');
  const a = gs[0][0].n, b = gs[1][0].n;
  await pg.click(`[data-eqal="${a}"]`); await pg.waitForTimeout(100);
  comprueba('el elegido se ve elegido con ✋ y aro, no solo con color',
    await pg.$eval(`[data-eqal="${a}"]`, x => x.getAttribute('aria-pressed') === 'true' && x.textContent.includes('✋')));
  comprueba('y todos los demás equipos ofrecen «Pasar aquí»',
    (await pg.$$('[data-eqpasar]')).length === gs.length - 1);
  await pg.click(`[data-eqal="${b}"]`); await pg.waitForTimeout(150);
  gs = await equiposPintados();
  comprueba(`tocar a #${a} y después a #${b} los cambia de equipo`,
    gs[0].some(o => o.n === b) && gs[1].some(o => o.n === a) && !gs[0].some(o => o.n === a));
  comprueba('queda anotado que el maestro los cambió', (await eq()).mano === true && /con tus cambios/.test(await pg.textContent('#eq-res')));
  comprueba('y el foco sigue en el alumno que tocó', await pg.evaluate(() => document.activeElement && document.activeElement.dataset.eqal) === String(b));
  const c = gs[2][0].n, tam3 = gs[2].length, tam0 = gs[0].length;
  await pg.click(`[data-eqal="${c}"]`); await pg.click('[data-eqpasar="0"]'); await pg.waitForTimeout(150);
  gs = await equiposPintados();
  comprueba(`«Pasar aquí» lleva a #${c} al equipo 1`, gs[0].some(o => o.n === c) && gs[0].length === tam0 + 1 && gs[2].length === tam3 - 1);
  comprueba('#' + c + ' coordinaba el equipo 3: el equipo 1 dice que quedó con dos y el 3 que quedó sin',
    /2 coordinadores juntos/.test(await pg.$eval('.eq-grid > .eq-eq:nth-child(1)', x => x.textContent)) &&
    /Sin coordinador/.test(await pg.$eval('.eq-grid > .eq-eq:nth-child(3)', x => x.textContent)));
  comprueba('y la medida lo cuenta, con qué hacer',
    /En 1 equipo quedaron dos coordinadores juntos y 1 equipo sin ninguno: arma otros o cámbialos a mano/
      .test(await pg.textContent('.eq-medida')), await pg.textContent('.eq-medida'));
  comprueba('la parte de arriba sigue siendo la misma: nada se repintó de más', await pg.evaluate(el => el.isConnected, confAntes));

  /* ── 5 · armar otros y volver ── */
  console.log('\n── «Armar otros» y «Los de antes» ──');
  const hechoAMano = (await eq()).reparto;
  await pg.click('#eq-armar'); await pg.waitForTimeout(500);
  const reparto2 = (await eq()).reparto;
  comprueba('«Armar otros» da otros', reparto2 && reparto2 !== hechoAMano && reparto2 !== reparto1);
  await pg.click('#eq-antes'); await pg.waitForTimeout(200);
  comprueba('«Los de antes» devuelve los que el maestro había arreglado a mano', (await eq()).reparto === hechoAMano);
  await pg.click('#eq-antes'); await pg.waitForTimeout(200);
  comprueba('y tocarlo otra vez vuelve a los nuevos', (await eq()).reparto === reparto2);

  /* ── 6 · faltó después de armar ── */
  console.log('\n── si alguien se va después de armar ──');
  const quien = (await equiposPintados())[0][0].n;
  await pg.evaluate(n => { const s = JSON.parse(localStorage.getItem('METAS_ADMIN_V1'));
    s.grupos[0].asistencia[0].aus[n] = 'A'; localStorage.setItem('METAS_ADMIN_V1', JSON.stringify(s)); }, quien);
  await abrirTab();
  const tachado = await pg.$eval(`[data-eqal="${quien}"]`, x => x.classList.contains('eq-al-fuera') && /faltó hoy/.test(x.textContent));
  comprueba(`#${quien} faltó después de armar: sigue en su equipo, tachado y con «faltó hoy»`, tachado);
  comprueba('y el equipo dice cuántos tiene hoy', /hoy \d+ de \d+/.test(await pg.textContent('.eq-eq')));

  /* ── 7 · cerrar la aplicación ── */
  console.log('\n── cerrar la aplicación ──');
  const guardado = (await eq()).reparto;
  await pg.reload({ waitUntil: 'domcontentloaded' });
  await pg.waitForFunction(() => typeof window.renderAdmin === 'function');
  await abrirTab();
  comprueba('al volver, los equipos siguen ahí', (await equiposPintados()).flat().length > 30 && (await eq()).reparto === guardado);
  comprueba('y lo que se dejó fuera hoy también', await cuenta() === 36);

  /* ── 8 · lo que sale del teléfono ── */
  console.log('\n── WhatsApp y papel ──');
  const txt = await pg.evaluate(() => eqTexto(adLoad()));
  const fuera = ['Alumno de Prueba', 'Josué Test', 'Carlos Eduardo Paz', 'Kenia Yamileth Ramírez', 'Nelson Josué Varela', 'Kevin Josué Martínez'];
  const presentes = await pg.$$eval('[data-eqal]:not(.eq-al-fuera) .eq-al-nom', ns => ns.map(n => n.textContent.trim()));
  comprueba('el mensaje de WhatsApp lleva los equipos con los nombres de todos los que están',
    /\*Equipo 1:\*/.test(txt) && presentes.length === 36 && presentes.every(n => txt.includes(n)), presentes.filter(n => !txt.includes(n)));
  comprueba('y no lleva a los de prueba, ni a los que faltaron, ni a los que se dejaron fuera',
    !fuera.some(n => txt.includes(n)), fuera.filter(n => txt.includes(n)));
  const coordsHoy = await pg.$$eval('.eq-al-coord:not(.eq-al-fuera) .eq-al-nom', ns => ns.map(n => n.textContent.trim()));
  comprueba(`los ${coordsHoy.length} coordinadores de hoy van marcados en WhatsApp: «⭐ nombre (coordina)»`,
    coordsHoy.length >= kHoy - 1 && coordsHoy.every(n => txt.includes('⭐ ' + n + ' (coordina)')) &&
    (txt.match(/\(coordina\)/g) || []).length === coordsHoy.length, coordsHoy.filter(n => !txt.includes('⭐ ' + n)));
  const impreso = await pg.evaluate(() => { let h = ''; const o = window.adPrintAbrir; window.adPrintAbrir = x => { h = x; return null; };
    eqImprimir(adLoad()); window.adPrintAbrir = o; return h; });
  const listas = (impreso.match(/<ol>[\s\S]*?<\/ol>/g) || []).map(ol => (ol.match(/<li[^>]*>/g) || []).map(li => li.includes('class="co"')));
  comprueba('y en el papel van primeros en su lista',
    (impreso.match(/<li class="co">/g) || []).length === coordsHoy.length &&
    listas.every(l => l.indexOf(false) < 0 || l.lastIndexOf(true) < l.indexOf(false)), listas);
  const titulos = (impreso.match(/<div class="eq"><h2>[\s\S]*?<\/ol>/g) || [])
    .map(b => ({ dice: b.includes('★ coordina</span>'), tiene: b.includes('<li class="co">') }));
  comprueba('y el título de cada equipo con coordinador dice qué es la ★, para que la tira recortada se entienda sola',
    titulos.length && titulos.every(t => t.dice === t.tiene), titulos);
  comprueba('el papel tampoco lleva a los que no entran', !fuera.some(n => impreso.includes(n)));
  comprueba('ni ninguna nota', !/promedio|Notas SACE/i.test(impreso));
  comprueba('los 36 de hoy salen en el papel', (impreso.match(/<li[\s>]/g) || []).length === 36);
  const h1 = await paginasDe(nav, impreso, 'hoy');
  comprueba(`el de hoy cabe en UNA hoja carta, y con letra de pizarra (${h1.letra} pt)`, h1.paginas === 1 && h1.letra >= 14, h1);
  comprueba('con la estrella que se fotocopia (★) en el margen de cada coordinador, en lugar de su número',
    h1.estrellas === coordsHoy.length, { estrellas: h1.estrellas, coordinadores: coordsHoy.length });
  /* el peor caso: 43 en parejas, todos con nombres de cuatro apellidos */
  const peor = await pg.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('METAS_ADMIN_V1'));
    const g = s.grupos[0];
    g.lista.forEach(a => { delete a.prueba; a.nombre = 'María de los Ángeles Hernández Sabillón ' + a.num; });
    g.asistencia = [];
    const nums = g.lista.map(a => a.num);
    const gs = eqTamanos(43, 'tam', 2); let p = 0;
    const partes = gs.map(t => { const x = nums.slice(p, p + t); p += t; return x; });
    /* con un coordinador en cada pareja: cada título lleva además
       «★ coordina», y es el caso que más ocupa */
    g.equipos = { reparto: partes.map(x => x.join(',')).join('|'), coord: partes.map(x => x[0]) };
    let h = ''; const o = window.adPrintAbrir; window.adPrintAbrir = x => { h = x; return null; };
    eqImprimir(g); window.adPrintAbrir = o; return h;
  });
  const h2 = await paginasDe(nav, peor, 'peor');
  comprueba(`43 en parejas con nombres largos y un coordinador en cada una también cabe en UNA hoja (${h2.letra} pt)`,
    h2.paginas === 1 && h2.letra >= 10 && (peor.match(/<li class="co">/g) || []).length === 21, h2);
  const pocos = await pg.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('METAS_ADMIN_V1'));
    const g = s.grupos[0];
    g.lista.forEach(a => { delete a.prueba; a.nombre = 'María de los Ángeles Hernández Sabillón ' + a.num; });
    g.asistencia = [];
    const nums = g.lista.map(a => a.num);
    g.equipos = { reparto: [nums.slice(0, 22).join(','), nums.slice(22).join(',')].join('|') };
    let h = ''; const o = window.adPrintAbrir; window.adPrintAbrir = x => { h = x; return null; };
    eqImprimir(g); window.adPrintAbrir = o; return h;
  });
  const h3 = await paginasDe(nav, pocos, 'dos');
  comprueba(`y dos equipos de 22 también (${h3.letra} pt)`, h3.paginas === 1 && h3.letra >= 10, h3);

  /* ── 9 · con el dedo, en el teléfono ── */
  console.log('\n── se toca con el dedo y cabe en el teléfono ──');
  await pg.click('#eq-det-fuera summary').catch(() => {});
  await pg.evaluate(() => { const d = document.querySelector('#eq-det-coord'); if (d) d.open = true; });
  /* el chip del coordinador entra con su «pop» al abrir el cajón: medido
     en ese instante, uno de 44 mide 41. Se mide cuando ya pasó */
  await pg.waitForTimeout(400);
  const chicos = await pg.evaluate(() => {
    const raiz = document.getElementById('ad-tab-body');
    const sel = 'button, summary, label.eq-sw, select, [data-eqal]';
    return [...raiz.querySelectorAll(sel)].filter(el => el.getClientRects().length && !el.classList.contains('eq-link'))
      .map(el => ({ q: (el.id || el.className || el.tagName) + ' «' + el.textContent.trim().slice(0, 18) + '»',
        h: Math.round(el.getBoundingClientRect().height) }))
      .filter(o => o.h < 44);
  });
  comprueba('todo lo que se toca mide 44 px o más', !chicos.length, chicos.slice(0, 5));
  const enlace = await pg.evaluate(() => {
    const e = document.querySelector('#eq-res') && document.querySelector('.eq-link');
    return e ? Math.round(e.getBoundingClientRect().height) : 44;
  });
  comprueba('también los enlaces dentro de una frase', enlace >= 44, enlace);
  comprueba('nada se sale del teléfono de 360 px', await pg.evaluate(() => document.documentElement.scrollWidth) <= 361);
  /* con la letra del maestro en el tope (Aa, 1,45): los equipos tienen
     nombres de cuatro apellidos, y es donde un renglón se sale */
  const conLetra = await pg.evaluate(() => {
    document.documentElement.style.setProperty('--metas-fz', '1.45');
    const raiz = document.getElementById('ad-tab-body');
    const fuera = [...raiz.querySelectorAll('*')].filter(el => el.getClientRects().length &&
      el.getBoundingClientRect().right > window.innerWidth + 1).map(el => el.className || el.tagName);
    const doc = document.documentElement.scrollWidth;
    document.documentElement.style.removeProperty('--metas-fz');
    return { doc, fuera: fuera.slice(0, 3) };
  });
  comprueba('y con la letra del maestro en el tope, tampoco', conLetra.doc <= 361 && !conLetra.fuera.length, conLetra);

  /* ── 10 · lo que se separó antes de los coordinadores ── */
  console.log('\n── lo que un maestro separó antes ──');
  const conSep = sembrado();
  conSep.grupos[0].equipos = { separar: [[1, 2], [5, 7]] };
  await abrirTab(conSep);
  const marcados = await pg.$$eval('[data-eqcoord][aria-pressed="true"]', bs => bs.map(b => +b.dataset.eqcoord));
  comprueba('lo que había separado se ve marcado como sus coordinadores: no se pierde callado',
    JSON.stringify(marcados) === '[1,2,5,7]' && /\(4\)/.test(await pg.textContent('#eq-det-coord summary')), marcados);
  await pg.click('#eq-det-coord summary');
  await pg.click('[data-eqcoord="9"]'); await pg.waitForTimeout(150);
  const tras = await eq();
  comprueba('al tocar uno se guarda como coordinadores, y lo de antes se va',
    JSON.stringify(tras.coord) === '[1,2,5,7,9]' && !('separar' in tras), tras);

  /* ── 11 · sin notas ── */
  console.log('\n── un grupo sin notas ──');
  await abrirTab(sembrado({ sinNotas: true }));
  comprueba('«parejos» y «por nivel» no se ofrecen si no hay notas, y se dice por qué',
    await pg.$eval('input[value="parejos"]', r => r.disabled) && await pg.$eval('input[value="nivel"]', r => r.disabled) &&
    /cuando tengas notas/.test(await pg.textContent('#eq-como')));
  await pg.click('#eq-armar'); await pg.waitForTimeout(400);
  comprueba('y se arman igual', (await equiposPintados()).flat().length === 39);
  comprueba('sin inventar un promedio', !/promedio/.test(await pg.textContent('.eq-medida')));

  errores.forEach(e => comprueba('error de página: ' + e, false));
  await nav.close();
  console.log(`\n${fallos ? '❌' : '✅'} ${pasan} bien · ${fallos} mal\n`);
  process.exit(fallos ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
