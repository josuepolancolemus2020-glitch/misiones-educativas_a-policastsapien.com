#!/usr/bin/env node
/* ============================================================
   M.E.T.A.S · Corre las sondas de una vez
   ------------------------------------------------------------
   Hasta hoy las sondas estaban escritas y nadie las corría todas:
   había que acordarse de cuál tocaba, y en CLAUDE.md hay nueve
   listas distintas de «antes de publicar, corre esto». Lo que
   pasaba es lo previsible: se corría la de lo que uno acababa de
   tocar y las demás se quedaban rojas meses sin que nadie lo
   supiera. Cuando por fin se corrieron todas había tres en rojo,
   y ninguna era de esta semana.

   Se corren en dos tandas porque cuestan cosas muy distintas:

     node _dev/corre-sondas.js            → las rápidas (npm test)
     node _dev/corre-sondas.js navegador  → las de Playwright

   Las rápidas solo leen archivos: tardan segundos y caben en
   cada empujón. Las del navegador abren Chromium, miden hojas
   impresas y cuentan páginas de PDF: tardan mucho y por eso van
   de noche.

   El servidor estático lo levanta y lo baja esta misma
   herramienta: era el paso que más se olvidaba, y una sonda sin
   servidor no dice «falta el servidor», dice que la página está
   rota.
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn, spawnSync } = require('child_process');

const DIR = __dirname;
const RAIZ = path.resolve(DIR, '..');
const MODO = (process.argv[2] || 'rapidas').toLowerCase();

/* Lo que vive en _dev/ y NO es una sonda. Se nombra una por una y con su
   motivo: descubrirlas solas por el nombre acabaría dejando fuera una sonda
   nueva por llamarse distinto, que es justo el fallo que esto viene a tapar. */
const NO_SON_SONDAS = {
  'servidor-estatico':      'es el servidor; lo levanta esta herramienta',
  'corre-sondas':           'es esta misma herramienta',
  'lib-sonda-3d':           'es una biblioteca que usan las sondas de los juegos',
  'lib-navegador':          'es quien abre el navegador; no comprueba nada',
  'three-de-mentira':       'es el Three.js de mentira de esas sondas',
  'estado':                 'lleva la cuenta de la auditoría, no comprueba nada',
  'playwright-abrir':       'es un ayudante de la auditoría',
  'wf-auditoria':           'es un flujo de la auditoría',
  'wf-priorizar':           'es un flujo de la auditoría',
  'arma-ficha-fin-de-grado':'ESCRIBE la ficha; se corre a mano y pide el grado',
  'reparte-hojas-ficha':    'ESCRIBE las fichas; se corre a mano',
  'repagina-ficha':         'ESCRIBE una ficha; pide el nombre',
  'genera-qr-mision':       'genera los QR; es de Python y pide ids',
  'dcnb-a-markdown':        'convierte el currículo; es de Python',
  'barrido-en':             'pide la misión que se quiere barrer',
  'verifica-mision-nueva':  'pide la carpeta de la misión nueva',
  'verifica-bancos-en':     'pide la misión cuyos bancos se comparan',
  'verifica-ficha-paginas': 'cuenta las hojas de UNA ficha o de las 74: va aparte, tarda minutos',
  'verifica-mision-navegador': 'abre Chromium sin executablePath y no arranca en este entorno'
};

/* ── qué sondas hay ──────────────────────────────────────────── */
const todas = fs.readdirSync(DIR)
  .filter(f => f.endsWith('.js'))
  .map(f => f.slice(0, -3))
  .filter(n => !(n in NO_SON_SONDAS))
  .sort();

/* Una sonda es «de navegador» si pide el ayudante que lo abre —o Playwright
   directo, por si alguna vuelve a hacerlo—. Se miró antes solo por
   `require('playwright')`, y el día que las sondas pasaron a pedir el ayudante
   las 24 se colaron en la tanda rápida y salieron rojas de golpe: sin servidor,
   una sonda no dice «falta el servidor», dice que la página está rota. */
const conNavegador = n => /require\((['"])(playwright|\.\/lib-navegador)\1\)/.test(
  fs.readFileSync(path.join(DIR, n + '.js'), 'utf8'));

const sondas = todas.filter(n => (MODO === 'navegador') === conNavegador(n));

/* ── el servidor, si hace falta ──────────────────────────────── */
function esperarPuerto(intentos) {
  return new Promise((listo, falla) => {
    const probar = quedan => {
      const req = http.get('http://localhost:8123/index.html', r => { r.resume(); listo(); });
      req.on('error', () => quedan > 0 ? setTimeout(() => probar(quedan - 1), 300) : falla(new Error('el servidor no levantó')));
      req.setTimeout(1000, () => req.destroy());
    };
    probar(intentos);
  });
}

/* ── correr una ──────────────────────────────────────────────── */
function correr(nombre) {
  const t0 = Date.now();
  const r = spawnSync(process.execPath, [path.join(DIR, nombre + '.js')],
    { cwd: RAIZ, encoding: 'utf8', timeout: 15 * 60 * 1000 });
  const seg = ((Date.now() - t0) / 1000).toFixed(0);
  const salida = (r.stdout || '') + (r.stderr || '');
  return { nombre, ok: r.status === 0, seg, salida };
}

(async () => {
  console.log(`\n════════ SONDAS · ${MODO} · ${sondas.length} ════════\n`);

  let servidor = null;
  if (MODO === 'navegador') {
    servidor = spawn(process.execPath, [path.join(DIR, 'servidor-estatico.js')],
      { cwd: RAIZ, stdio: 'ignore' });
    try { await esperarPuerto(30); console.log('· servidor estático en pie\n'); }
    catch (e) { console.error('✘ ' + e.message); servidor.kill(); process.exit(1); }
  }

  const rojas = [];
  for (const n of sondas) {
    process.stdout.write('  ' + n.padEnd(42));
    const r = correr(n);
    console.log((r.ok ? '✔' : '✘') + '  ' + r.seg + 's');
    if (!r.ok) rojas.push(r);
  }

  if (servidor) servidor.kill();

  /* Lo que se saltó se DICE. Una lista silenciosa de exclusiones es la forma
     más fácil de que una sonda se quede fuera un año sin que nadie lo note. */
  const saltadas = Object.keys(NO_SON_SONDAS).filter(n => fs.existsSync(path.join(DIR, n + '.js')));
  console.log(`\n· fuera de la tanda (${saltadas.length}): ` + saltadas.join(', '));

  if (rojas.length) {
    console.log('\n──────── LO QUE FALLÓ ────────');
    rojas.forEach(r => {
      console.log('\n✘ ' + r.nombre + '\n');
      console.log(r.salida.split('\n').slice(-40).join('\n'));
    });
    console.log(`\n❌ ${rojas.length} de ${sondas.length} en rojo.\n`);
    process.exit(1);
  }
  console.log(`\n✅ Las ${sondas.length} sondas ${MODO === 'navegador' ? 'de navegador ' : ''}en verde.\n`);
})();
