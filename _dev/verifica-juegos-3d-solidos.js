/* ============================================================
   M.E.T.A.S · Sonda de los seis juegos 3D de Sólidos Geométricos
   ------------------------------------------------------------
   Uso:  node _dev/servidor-estatico.js   (en otra terminal)
         node _dev/verifica-juegos-3d-solidos.js
   Si el navegador vive aparte:
         METAS_CHROMIUM=/ruta/al/chrome node _dev/verifica-juegos-3d-solidos.js

   Qué vigila, y por qué cada cosa:

   · Las CUENTAS de cada sólido. Un juego que premia «el cubo tiene
     5 caras» le enseña el error con refuerzo positivo, que es la
     peor forma de aprenderlo. Se comprueban contra la tabla de la
     misión y contra la cuenta de Euler, que es la que el alumno va
     a usar en el examen para revisarse.
   · Que las trampas SIGAN siendo trampas: que el cono no cuente
     como pirámide, que el prisma triangular no pase por pirámide
     cuadrangular (los dos tienen 5 caras, y ahí es donde se
     equivoca todo el mundo), y que la esfera no tenga vértices.
   · Que los seis patrones tengan las caras que dicen, y que el de
     los seis en fila siga marcado como que NO cierra.
   · Que sin internet el juego lo DIGA en vez de quedarse negro.
   · Que solo se usen piezas de Three.js r128 que existen.

   El dibujo en 3D NO se comprueba aquí: se pone un Three.js de
   mentira (_dev/three-de-mentira.js) para poder mover la lógica
   sin tarjeta gráfica ni internet. Que la pantalla se vea bien hay
   que mirarlo con los ojos, una vez, en el teléfono.
   ============================================================ */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const STUB = require('./three-de-mentira');

const RAIZ = path.resolve(__dirname, '..');
const DIR = 'misiones/2ciclo-solidos-geometricos';
const BASE = 'http://localhost:8123/' + DIR + '/';
const JUEGOS = [
  'juego-contador-partes-3d.html',
  'juego-armador-patrones-3d.html',
  'juego-revolucion-3d.html',
  'juego-fabrica-solidos-3d.html',
  'juego-caza-solidos-3d.html',
  'juego-relampago-solidos-3d.html'
];

const R128 = new Set(['AmbientLight','BoxGeometry','BufferAttribute','BufferGeometry','CircleGeometry',
  'Clock','Color','ConeGeometry','CylinderGeometry','DirectionalLight','DoubleSide','EdgesGeometry','Fog',
  'GridHelper','Group','LatheGeometry','Line','LineBasicMaterial','LineSegments','Mesh','MeshBasicMaterial',
  'MeshLambertMaterial','MeshPhongMaterial','MeshStandardMaterial','Object3D','PerspectiveCamera',
  'PlaneGeometry','PointLight','Points','PointsMaterial','Raycaster','RingGeometry','Scene','Shape',
  'ShapeGeometry','SphereGeometry','TorusGeometry','Vector2','Vector3','WebGLRenderer']);

let fallos = 0, pruebas = 0;
function ok(cond, txt, extra){
  pruebas++;
  if(cond) console.log('  ✅ ' + txt);
  else { fallos++; console.log('  ❌ ' + txt + (extra !== undefined ? '  → ' + JSON.stringify(extra) : '')); }
}

async function abrir(nav, archivo, conStub){
  const p = await nav.newPage({ viewport:{width:412, height:820} });
  const errores = [];
  p.on('pageerror', e => errores.push(String(e.message)));
  if(conStub) await p.addInitScript(STUB);
  await p.route('**cdnjs.cloudflare.com/**', r => r.abort());
  await p.goto(BASE + archivo, { waitUntil:'domcontentloaded' });
  await p.waitForTimeout(320);
  await p.evaluate(() => localStorage.clear());
  await p.reload({ waitUntil:'domcontentloaded' });
  await p.waitForTimeout(320);
  p.__errores = errores;
  return p;
}

/* ============================================================ */
function revisarFuente(){
  console.log('\n📄 El archivo, antes de abrirlo');
  for(const j of JUEGOS){
    const src = fs.readFileSync(path.join(RAIZ, DIR, j), 'utf8');
    const nom = j.replace('juego-','').replace('-3d.html','').replace('.html','');
    ok(/cdnjs\.cloudflare\.com\/ajax\/libs\/three\.js\/r128\/three\.min\.js/.test(src),
       nom+': baja Three.js r128 del CDN');
    ok(src.includes('if (window.THREE) return listo()'),
       nom+': si la pieza de 3D ya está puesta, la usa (funciona sin red y se puede probar)');
    ok(/Hace falta internet la primera vez/.test(src),
       nom+': sin red avisa en vez de quedarse en negro');
    ok(/href="solidos-geometricos\.html"/.test(src), nom+': tiene la vuelta a la misión');
    ok(/<html lang="es">/.test(src) && /name="viewport"/.test(src), nom+': español y adaptado al teléfono');
    const malos = [...src.matchAll(/THREE\.([A-Za-z0-9_]+)/g)].map(m=>m[1]).filter(n=>!R128.has(n));
    ok(malos.length===0, nom+': solo usa piezas que existen en r128', [...new Set(malos)]);
    ok(/j3d_[a-z]+_v1/.test(src), nom+': guarda su avance en su propia llave');
    ok(!/matematica_solidos|SAVE_KEY/.test(src), nom+': y no toca la llave del progreso de la misión');
  }
}

/* ============================================================ */
async function contador(nav){
  console.log('\n🔍 El Contador de Partes');
  const p = await abrir(nav, JUEGOS[0], true);

  /* La tabla del Bloque 5 de la misión. Si esto se separa, el juego
     y el material impreso dicen cosas distintas. */
  const tabla = await p.evaluate(() => {
    const j = window.__j3d;
    const cuenta = f => ({caras:f.c.length, vertices:f.v.length, aristas:j.aristasDe(f).length});
    return {
      cubo:      cuenta(j.prismaRegular(4, 1, 1.5)),
      prismaTri: cuenta(j.prismaRegular(3, 1, 1.5)),
      pirCuad:   cuenta(j.piramideRegular(4, 1, 1.5)),
      prismaHex: cuenta(j.prismaRegular(6, 1, 1.5)),
      pirTri:    cuenta(j.piramideRegular(3, 1, 1.5))
    };
  });
  ok(tabla.cubo.caras===6 && tabla.cubo.aristas===12 && tabla.cubo.vertices===8,
     'cubo: 6 caras, 12 aristas, 8 vértices', tabla.cubo);
  ok(tabla.prismaTri.caras===5 && tabla.prismaTri.aristas===9 && tabla.prismaTri.vertices===6,
     'prisma triangular: 5, 9, 6', tabla.prismaTri);
  ok(tabla.pirCuad.caras===5 && tabla.pirCuad.aristas===8 && tabla.pirCuad.vertices===5,
     'pirámide cuadrangular: 5, 8, 5', tabla.pirCuad);
  ok(tabla.prismaHex.caras===8 && tabla.prismaHex.aristas===18 && tabla.prismaHex.vertices===12,
     'prisma hexagonal: 8, 18, 12', tabla.prismaHex);
  ok(tabla.pirTri.caras===4 && tabla.pirTri.aristas===6 && tabla.pirTri.vertices===4,
     'pirámide triangular: 4, 6, 4 · el sólido con menos caras', tabla.pirTri);

  // el patrón general, no solo las cinco filas de la tabla
  const patron = await p.evaluate(() => {
    const j = window.__j3d, malos = [];
    for(let n=3;n<=10;n++){
      const pr = j.prismaRegular(n,1,1), pi = j.piramideRegular(n,1,1);
      if(pr.c.length !== n+2 || j.aristasDe(pr).length !== 3*n || pr.v.length !== 2*n) malos.push('prisma '+n);
      if(pi.c.length !== n+1 || j.aristasDe(pi).length !== 2*n || pi.v.length !== n+1) malos.push('pirámide '+n);
    }
    return malos;
  });
  ok(patron.length===0, 'de 3 a 10 lados: prisma n+2/3n/2n y pirámide n+1/2n/n+1', patron);

  const euler = await p.evaluate(() => {
    const j = window.__j3d, malos = [];
    j.solidos.forEach(function(s, i){
      if(s.tipo !== 'poliedro') return;
      const C = s.forma.c.length, V = s.forma.v.length, A = j.aristasDe(s.forma).length;
      if(C + V !== A + 2) malos.push(s.n);
    });
    return malos;
  });
  ok(euler.length===0, 'caras + vértices = aristas + 2 en los cinco poliedros', euler);

  const redondos = await p.evaluate(() => {
    const j = window.__j3d;
    return j.solidos.filter(s => s.tipo === 'redondo').map(s => s.n);
  });
  ok(redondos.length===2 && redondos.indexOf('Cilindro')>=0 && redondos.indexOf('Esfera')>=0,
     'el cilindro y la esfera están, y son la trampa: cuerpos redondos', redondos);

  await p.evaluate(() => window.__j3d.empezar());
  await p.waitForTimeout(200);
  // contar de menos no vale
  await p.evaluate(() => window.__j3d.terminarParte());
  const corto = await p.evaluate(() => ({est: window.__j3d.estado(),
    av: document.getElementById('aviso').textContent}));
  ok(corto.est.parte === 0 && /faltan/.test(corto.av),
     'decir «ya las conté» con caras de menos no pasa de parte', corto.av);

  // contarlas todas, sí
  const bien = await p.evaluate(() => {
    window.__j3d.contarTodas(); window.__j3d.terminarParte();
    return window.__j3d.estado();
  });
  ok(bien.parte === 1 && bien.resultado.caras === 6, 'con las 6 caras del cubo pasa a las aristas', bien);

  const completo = await p.evaluate(() => {
    window.__j3d.contarTodas(); window.__j3d.terminarParte();   // aristas
    window.__j3d.contarTodas(); window.__j3d.terminarParte();   // vértices
    return window.__j3d.estado();
  });
  ok(completo.resultado.aristas === 12 && completo.resultado.vertices === 8,
     'y las 12 aristas y los 8 vértices cierran el sólido', completo.resultado);
  await p.waitForTimeout(900);
  const euTxt = await p.locator('#fin-euler').textContent();
  ok(/6 \+ 8 = 12 \+ 2/.test(euTxt), 'y le enseña Euler con SUS números, no con los de la tabla', euTxt);

  ok(p.__errores.length === 0, 'sin errores de JavaScript', p.__errores);
  await p.close();
}

/* ============================================================ */
async function patrones(nav){
  console.log('\n✂️ El Armador de Patrones');
  const p = await abrir(nav, JUEGOS[1], true);

  const lista = await p.evaluate(() => window.__j3d.patrones.map(x => ({n:x.n, cierra:x.cierra, arma:x.arma,
    ops:x.ops.length, buena:x.buena})));
  ok(lista.length === 6, 'son seis patrones', lista.length);
  ok(lista.filter(x => !x.cierra).length === 1 && lista.find(x => !x.cierra).n === 'Seis en fila',
     'y solo uno NO cierra: los seis en fila', lista.map(x=>x.n+':'+x.cierra));
  ok(lista.every(x => x.ops === 3 && x.buena >= 0 && x.buena < 3), 'cada uno con tres respuestas y una buena');

  await p.evaluate(() => window.__j3d.empezar());
  await p.waitForTimeout(250);
  const caras = await p.evaluate(async () => {
    const r = [];
    for(let i=0;i<6;i++){ window.__j3d.irA(i); r.push(window.__j3d.estado().caras); }
    return r;
  });
  ok(caras[0]===6 && caras[1]===6 && caras[2]===6, 'los tres patrones de cubo tienen 6 caras', caras.slice(0,3));
  ok(caras[3]===5, 'la pirámide cuadrangular: base y cuatro triángulos', caras[3]);
  ok(caras[4]===5, 'el prisma triangular: tres rectángulos y dos triángulos', caras[4]);
  ok(caras[5]===26, 'el cilindro: el rectángulo en 24 tiras más los dos círculos', caras[5]);

  const bis = await p.evaluate(() => { window.__j3d.irA(0); return window.__j3d.estado().bisagras; });
  ok(bis === 5, 'la cruz tiene 5 dobleces (seis caras colgando unas de otras)', bis);

  // el doblez llega al final
  await p.evaluate(() => { window.__j3d.irA(0); window.__j3d.doblar(1); });
  const doblada = await p.evaluate(() => window.__j3d.estado());
  ok(doblada.t === 1, 'el patrón se puede doblar del todo', doblada.t);

  // responder bien puntúa
  await p.evaluate(() => { window.__j3d.irA(1); });            // los seis en fila
  await p.waitForTimeout(120);
  const antes = await p.evaluate(() => window.__j3d.estado().estrellas);
  await p.evaluate(() => window.__j3d.responder(window.__j3d.patrones[1].buena));
  await p.waitForTimeout(900);
  const desp = await p.evaluate(() => window.__j3d.estado());
  ok(desp.estrellas > antes, 'acertar que NO cierra suma estrellas', {antes, desp:desp.estrellas});
  const tit = await p.locator('#fin-tit').textContent();
  ok(/NO cierra/.test(tit), 'y la pantalla lo dice con todas las letras', tit);

  ok(p.__errores.length === 0, 'sin errores de JavaScript', p.__errores);
  await p.close();
}

/* ============================================================ */
async function revolucion(nav){
  console.log('\n🔄 La Máquina de Revolución');
  const p = await abrir(nav, JUEGOS[2], true);

  const figs = await p.evaluate(() => window.__j3d.figuras.map(f => ({
    n:f.n, sale:f.sale, buena:f.ops[f.buena], ops:f.ops.length, espejo:f.espejo, puntos:f.perfil.length})));
  ok(figs.length === 6, 'son seis figuras', figs.length);
  ok(figs[0].sale === 'Cilindro' && /Cilindro/.test(figs[0].buena), 'rectángulo → cilindro', figs[0]);
  ok(figs[1].sale === 'Cono' && /Cono/.test(figs[1].buena), 'triángulo → cono', figs[1]);
  ok(figs[2].sale === 'Esfera' && /Esfera/.test(figs[2].buena), 'semicírculo → esfera', figs[2]);
  ok(figs[2].espejo === false,
     'y el semicírculo se enseña tal cual: gira apoyado en su diámetro, no doblado', figs[2].espejo);
  ok(figs[0].espejo === true, 'el rectángulo sí se enseña entero, con el eje por el medio');
  ok(figs.every(f => f.ops === 3), 'cada figura ofrece tres respuestas');

  await p.evaluate(() => window.__j3d.empezar());
  await p.waitForTimeout(200);
  const planos = await p.evaluate(() => ({espejo: window.__j3d.puntosPlanos().length,
    perfil: window.__j3d.figuras[0].perfil.length}));
  ok(planos.espejo === planos.perfil*2, 'la figura entera es el perfil doblado por el eje', planos);

  await p.evaluate(() => window.__j3d.responder(window.__j3d.figuras[0].buena));
  await p.waitForTimeout(900);
  const est = await p.evaluate(() => window.__j3d.estado());
  ok(est.estrellas > 0, 'acertar suma estrellas', est.estrellas);

  await p.evaluate(() => { document.getElementById('velo-fin').classList.remove('ver');
    window.__j3d.girar(); window.__j3d.saltarGiro(); });
  await p.waitForTimeout(400);
  const giro = await p.evaluate(() => window.__j3d.estado());
  ok(giro.grados === 360, 'la figura da la vuelta entera: 360°', giro.grados);

  ok(p.__errores.length === 0, 'sin errores de JavaScript', p.__errores);
  await p.close();
}

/* ============================================================ */
async function fabrica(nav){
  console.log('\n🏭 La Fábrica de Sólidos');
  const p = await abrir(nav, JUEGOS[3], true);

  const f = await p.evaluate(() => {
    const j = window.__j3d, r = [];
    for(let n=3;n<=10;n++){
      r.push({n:n, pr:j.partes('prisma',n), pi:j.partes('piramide',n),
        nomPr:j.nombreDe('prisma',n), nomPi:j.nombreDe('piramide',n)});
    }
    return r;
  });
  ok(f.every(x => x.pr.caras===x.n+2 && x.pr.aristas===3*x.n && x.pr.vertices===2*x.n),
     'prisma de n lados: n+2 caras, 3n aristas, 2n vértices');
  ok(f.every(x => x.pi.caras===x.n+1 && x.pi.aristas===2*x.n && x.pi.vertices===x.n+1),
     'pirámide de n lados: n+1 caras, 2n aristas, n+1 vértices');
  ok(f.every(x => x.pr.caras+x.pr.vertices === x.pr.aristas+2 && x.pi.caras+x.pi.vertices === x.pi.aristas+2),
     'y Euler se cumple en los dieciséis');
  ok(f[2].nomPr === 'Prisma pentagonal' && f[3].nomPi === 'Pirámide hexagonal',
     'el apellido sale de la base: pentagonal, hexagonal', [f[2].nomPr, f[3].nomPi]);

  // cada pedido se puede fabricar, y solo con SU sólido
  const pedidos = await p.evaluate(() => window.__j3d.pedidos.map(x => ({tipo:x.tipo, n:x.n})));
  for(let i=0;i<pedidos.length;i++){
    const r = await p.evaluate(async (i) => {
      window.__j3d.irA(i);
      const pe = window.__j3d.pedidos[i];
      window.__j3d.poner(pe.tipo, pe.n);
      window.__j3d.fabricar();
      const gano = document.getElementById('velo-fin').classList.contains('ver');
      document.getElementById('velo-fin').classList.remove('ver');
      return {gano:gano, nombre:window.__j3d.estado().nombre};
    }, i);
    ok(r.gano, 'pedido '+(i+1)+': se puede fabricar ('+r.nombre+')', r);
  }

  /* La trampa fina del tema: el prisma triangular y la pirámide
     cuadrangular tienen los DOS cinco caras. Lo que los separa son
     los vértices, y el pedido 5 pide justo eso. */
  const trampa = await p.evaluate(() => {
    window.__j3d.irA(4);                       // «5 caras y 5 vértices»
    window.__j3d.poner('prisma', 3);           // prisma triangular: 5 caras, pero 6 vértices
    window.__j3d.fabricar();
    const paso = document.getElementById('velo-fin').classList.contains('ver');
    const av = document.getElementById('aviso').textContent;
    document.getElementById('velo-fin').classList.remove('ver');
    return {paso:paso, av:av, partes:window.__j3d.partes('prisma',3)};
  });
  ok(trampa.partes.caras === 5, 'el prisma triangular también tiene 5 caras', trampa.partes);
  ok(!trampa.paso, 'pero NO pasa el pedido de «5 caras y 5 vértices»');
  ok(/vértices/.test(trampa.av) || /prisma/.test(trampa.av),
     'y el aviso dice qué es lo que falla, no solo que falla', trampa.av);

  ok(p.__errores.length === 0, 'sin errores de JavaScript', p.__errores);
  await p.close();
}

/* ============================================================ */
async function caza(nav){
  console.log('\n🏠 Caza Sólidos');
  const p = await abrir(nav, JUEGOS[4], true);

  const d = await p.evaluate(() => ({
    cosas: window.__j3d.cosas.map(c => ({n:c.n, clase:c.clase})),
    rondas: window.__j3d.rondas.map(r => ({q:r.q, vale:r.vale, seg:r.seg}))
  }));
  ok(d.cosas.length >= 12, 'el cuarto tiene doce cosas o más', d.cosas.length);
  ok(d.rondas.length === 5, 'son cinco rondas', d.rondas.length);

  const clases = {};
  d.cosas.forEach(c => clases[c.clase] = (clases[c.clase]||0)+1);
  ok(clases.cilindro >= 3 && clases.esfera >= 2 && clases.cono >= 2 && clases.piramide >= 2 && clases.prisma >= 3,
     'y de todo: cilindros, esferas, conos, pirámides y prismas', clases);

  const pirs = d.rondas[4];
  ok(pirs.vale.length === 1 && pirs.vale[0] === 'piramide',
     'la ronda de las pirámides NO cuenta los conos: es la trampa del tema', pirs.vale);
  const redondos = d.rondas[0];
  ok(redondos.vale.indexOf('cilindro')>=0 && redondos.vale.indexOf('cono')>=0 && redondos.vale.indexOf('esfera')>=0,
     'los cuerpos redondos son los tres: cilindro, cono y esfera', redondos.vale);
  const poli = d.rondas[3];
  ok(poli.vale.indexOf('cono') < 0 && poli.vale.indexOf('cilindro') < 0 && poli.vale.indexOf('esfera') < 0,
     'y en la de poliedros no entra ninguno de los redondos', poli.vale);

  await p.evaluate(() => { window.__j3d.empezar(); window.__j3d.irA(4); });   // pirámides
  await p.waitForTimeout(200);
  const mal = await p.evaluate(() => {
    const cosas = window.__j3d.cosas;
    const cono = cosas.findIndex(c => c.clase === 'cono');
    const antes = window.__j3d.estado().seg;
    window.__j3d.tocarCosa(cono);
    return {antes:antes, est:window.__j3d.estado(), cono:cosas[cono].n};
  });
  ok(mal.est.errores === 1 && mal.antes - mal.est.seg >= 4,
     'tocar un cono en la ronda de pirámides falla y cuesta 5 segundos', mal);

  const todas = await p.evaluate(() => {
    window.__j3d.cosas.forEach(function(c, i){ if(window.__j3d.esBuena(c)) window.__j3d.tocarCosa(i); });
    return window.__j3d.estado();
  });
  ok(todas.lleva === todas.total, 'tocando todas las pirámides se cierra la ronda', todas);
  await p.waitForTimeout(400);
  ok(await p.locator('#velo-fin').isVisible(), 'y sale el resumen');
  const nota = await p.locator('#fin-nota').textContent();
  ok(/CÍRCULO|conos/.test(nota), 'que explica por qué el cono no era', nota);

  ok(p.__errores.length === 0, 'sin errores de JavaScript', p.__errores);
  await p.close();
}

/* ============================================================ */
async function relampago(nav){
  console.log('\n⚡ El Relámpago de Sólidos');
  const p = await abrir(nav, JUEGOS[5], true);

  const s = await p.evaluate(() => window.__j3d.solidos.map(x => ({n:x.n, fam:x.fam,
    caras:x.caras, aristas:x.aristas, vertices:x.vertices})));
  const poli = s.filter(x => x.fam !== 'redondo');
  ok(poli.every(x => x.caras + x.vertices === x.aristas + 2),
     'Euler se cumple en los siete poliedros del banco', poli.filter(x => x.caras+x.vertices !== x.aristas+2));
  ok(s.find(x => x.n === 'Cubo').caras === 6 && s.find(x => x.n === 'Prisma hexagonal').aristas === 18,
     'y sus cuentas cuadran con la tabla de la misión');
  ok(s.filter(x => x.fam === 'redondo').length === 3, 'están los tres cuerpos redondos');

  await p.evaluate(() => window.__j3d.empezar());
  await p.waitForTimeout(250);
  const e0 = await p.evaluate(() => window.__j3d.estado());
  ok(e0.corriendo && e0.seg <= 60 && e0.seg > 50, 'el reloj arranca en 60 segundos', e0.seg);
  ok(e0.opciones >= 2, 'y hay opciones que tocar', e0.opciones);

  const bien = await p.evaluate(async () => {
    window.__j3d.contestarBien();
    await new Promise(r => setTimeout(r, 420));
    return window.__j3d.estado();
  });
  ok(bien.puntos >= 10 && bien.racha === 1, 'acertar suma puntos y arranca la racha', bien);

  const mal = await p.evaluate(async () => {
    const antes = window.__j3d.estado();
    window.__j3d.contestarMal();
    await new Promise(r => setTimeout(r, 1400));
    return {antes:antes, est:window.__j3d.estado()};
  });
  ok(mal.est.racha === 0, 'fallar rompe la racha', mal.est.racha);
  ok(mal.antes.seg - mal.est.seg >= 3, 'y cuesta 3 segundos', {antes:mal.antes.seg, desp:mal.est.seg});

  await p.evaluate(() => window.__j3d.acabar());
  await p.waitForTimeout(700);
  ok(await p.locator('#velo-fin').isVisible(), 'al acabarse el tiempo se cierra la partida');

  ok(p.__errores.length === 0, 'sin errores de JavaScript', p.__errores);
  await p.close();
}

/* ============================================================ */
async function mision(nav){
  console.log('\n📚 La misión, con los juegos dentro');
  const p = await nav.newPage({ viewport:{width:412, height:820} });
  const errores = [];
  p.on('pageerror', e => errores.push(String(e.message)));
  await p.addInitScript(() => {
    try{ localStorage.setItem('METAS_ALUMNO_V1', JSON.stringify(
      {nombre:'Sonda', escuela:'Centro de prueba', grado:'6', docente:'—'})); }catch(e){}
  });
  await p.goto('http://localhost:8123/'+DIR+'/solidos-geometricos.html', { waitUntil:'domcontentloaded' });
  await p.waitForTimeout(700);
  await p.evaluate(() => { const m = document.getElementById('metasIdModal'); if(m) m.remove(); });

  ok(await p.locator('.nav-t[data-s="s-juegos3d"]').count() === 1, 'hay pestaña del Parque 3D');
  await p.locator('.nav-t[data-s="s-juegos3d"]').click();
  await p.waitForTimeout(250);
  ok(await p.locator('#s-juegos3d.active').count() === 1, 'y se abre al tocarla');
  ok(await p.locator('#s-juegos3d .juego-card').count() === 6, 'con las seis tarjetas');
  for(const j of JUEGOS){
    ok(await p.locator('#s-juegos3d a[href="'+j+'"]').count() === 1,
       'la tarjeta de '+j.replace('juego-','').replace('-3d.html','')+' enlaza a su juego');
  }
  ok(await p.locator('#s-juegos3d a[target="_blank"]').count() === 6,
     'los seis se abren en otra pestaña, sin sacar al alumno de la misión');

  const antes = await p.locator('#s-juegos3d [data-medalla="contador"]').textContent();
  ok(/sin empezar/.test(antes), 'sin haber jugado, la tarjeta dice «sin empezar»', antes);
  await p.evaluate(() => localStorage.setItem('j3d_contador_v1', JSON.stringify({nivel:3, estrellas:30})));
  await p.reload({ waitUntil:'domcontentloaded' });
  await p.waitForTimeout(600);
  await p.evaluate(() => { const m = document.getElementById('metasIdModal'); if(m) m.remove(); });
  await p.locator('.nav-t[data-s="s-juegos3d"]').click();
  await p.waitForTimeout(200);
  const desp = await p.locator('#s-juegos3d [data-medalla="contador"]').textContent();
  ok(/sólido 4 de 7/.test(desp), 'y después de jugar enseña por dónde iba', desp);

  ok(await p.locator('.salto3d').count() === 6, 'cada widget del mismo tema tiene su salto al juego 3D');
  await p.locator('.nav-t[data-s="s-lab"]').click();
  await p.waitForTimeout(200);
  ok(await p.locator('#s-lab a.salto3d[href="juego-armador-patrones-3d.html"]').isVisible(),
     'en el Armador de Patrones está el salto al juego que SÍ lo dobla');
  ok(await p.locator('#s-lab a.salto3d[href="juego-contador-partes-3d.html"]').isVisible(),
     'y en el Contador de Partes, el salto al sólido que se gira');

  ok(errores.length === 0, 'la misión no tiene errores de JavaScript', errores);
  await p.close();
}

/* ============================================================ */
async function sinRed(nav){
  console.log('\n🌐 Sin internet (que es como está el aula la mitad del tiempo)');
  for(const j of JUEGOS){
    const p = await nav.newPage({ viewport:{width:412, height:820} });
    await p.route('**cdnjs.cloudflare.com/**', r => r.abort());
    await p.goto(BASE + j, { waitUntil:'domcontentloaded' });
    await p.waitForTimeout(650);
    ok(await p.locator('#velo-red').isVisible(),
       j.replace('juego-','').replace('-3d.html','')+': avisa que hace falta señal la primera vez');
    await p.close();
  }
}

/* ============================================================ */
(async () => {
  console.log('════════════════════════════════════════════');
  console.log(' Sonda de los juegos 3D · Sólidos Geométricos');
  console.log('════════════════════════════════════════════');
  revisarFuente();
  const nav = await chromium.launch(
    process.env.METAS_CHROMIUM ? { executablePath: process.env.METAS_CHROMIUM } : {});
  try{
    await contador(nav);
    await patrones(nav);
    await revolucion(nav);
    await fabrica(nav);
    await caza(nav);
    await relampago(nav);
    await mision(nav);
    await sinRed(nav);
  } finally { await nav.close(); }
  console.log('\n════════════════════════════════════════════');
  console.log(fallos === 0
    ? ' ✅ '+pruebas+' comprobaciones, ninguna falla'
    : ' ❌ '+fallos+' fallas de '+pruebas+' comprobaciones');
  console.log('════════════════════════════════════════════');
  process.exit(fallos === 0 ? 0 : 1);
})();
