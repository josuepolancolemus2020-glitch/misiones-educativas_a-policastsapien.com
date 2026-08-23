/* ============================================================
   M.E.T.A.S · Sonda de los seis juegos 3D del volumen
   ------------------------------------------------------------
   Uso:  node _dev/servidor-estatico.js   (en otra terminal)
         node _dev/verifica-juegos-3d.js
   Si el navegador vive aparte:
         METAS_CHROMIUM=/ruta/al/chrome node _dev/verifica-juegos-3d.js

   Qué vigila, y por qué cada cosa:

   · Las CUENTAS. Un juego que premia una respuesta equivocada le
     enseña el error al alumno con refuerzo positivo, que es la
     peor forma de aprenderlo. Se comprueban los volúmenes, las
     áreas, los litros y las conversiones, uno por uno.
   · El π de sexto grado (3.14). Si la pantalla calcula con el π
     largo y el alumno con 3.14, los números no coinciden y él
     cree que se equivocó.
   · Que el laberinto SIEMPRE tenga salida y que las puertas estén
     en el camino. Un laberinto sin salida deja al alumno dando
     vueltas hasta que se le acaba el reloj sin culpa suya.
   · Que sin internet el juego lo DIGA en vez de quedarse negro.
   · Que solo se usen piezas de Three.js r128 que existen: un
     nombre mal escrito no da la cara hasta que se abre el juego.

   El dibujo en 3D NO se comprueba aquí: se pone un Three.js de
   mentira para poder mover la lógica sin tarjeta gráfica ni
   internet. Que la pantalla se vea bien hay que mirarlo con los
   ojos, una vez, en el teléfono.
   ============================================================ */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const DIR = 'misiones/2ciclo-volumen-cuerpos';
const BASE = 'http://localhost:8123/' + DIR + '/';
const JUEGOS = [
  'juego-constructor-cubitos-3d.html',
  'juego-fabrica-latas-3d.html',
  'juego-desafio-tanque-3d.html',
  'juego-laberinto-unidades-3d.html',
  'juego-duelo-dimensiones-3d.html',
  'juego-tetris-volumen-3d.html'
];

/* Piezas de Three.js r128 que los juegos tienen permitido usar.
   Escribir mal un nombre (CylinderBufferGeometry, que ya no está)
   no falla al cargar: falla al abrir el juego, delante del niño. */
const R128 = new Set(['AmbientLight','BoxGeometry','BufferAttribute','BufferGeometry','CircleGeometry',
  'Clock','Color','ConeGeometry','CylinderGeometry','DirectionalLight','DoubleSide','EdgesGeometry','Fog',
  'GridHelper','Group','Line','LineBasicMaterial','LineSegments','Mesh','MeshBasicMaterial',
  'MeshLambertMaterial','MeshPhongMaterial','MeshStandardMaterial','Object3D','PerspectiveCamera',
  'PlaneGeometry','PointLight','Points','PointsMaterial','Raycaster','RingGeometry','Scene','Shape',
  'ShapeGeometry','SphereGeometry','TorusGeometry','Vector2','Vector3','WebGLRenderer']);


/* Qué se toca en cada juego: el botón de empezar y después el
   primer mando de verdad. */
const TOQUES = [
  ['juego-constructor-cubitos-3d.html', null, ['#velo-pred .bt-s']],
  ['juego-fabrica-latas-3d.html', '#velo-ini .bt-p', ['.botones .bt-v', '.finos .fino']],
  ['juego-desafio-tanque-3d.html', '#velo-ini .bt-p', ['#bt-apostar', '.botones .bt-s']],
  ['juego-laberinto-unidades-3d.html', '#velo-ini .bt-p', ['.cruz .fl.e']],
  ['juego-duelo-dimensiones-3d.html', '#velo-ini .bt-p', ['#at-area']],
  /* En el tetris se pone antes una caja de 1×1×1: una de 3 de ancho
     no se puede correr a la derecha —el pozo mide 3— y el botón haría
     bien en no hacer nada. Lo que se comprueba es el mando, no el
     azar de la pieza que tocó. */
  ['juego-tetris-volumen-3d.html', '#velo-ini .modo', ['.mando .fl.e', '.lado .bl.tirar'],
   () => window.__j3d.ponerCaja(1,1,1)]
];

let fallos = 0, pruebas = 0;
function ok(cond, txt, extra){
  pruebas++;
  if(cond) console.log('  ✅ ' + txt);
  else { fallos++; console.log('  ❌ ' + txt + (extra !== undefined ? '  → ' + JSON.stringify(extra) : '')); }
}
function casi(a, b, tol){ return Math.abs(a-b) <= (tol === undefined ? 0.01 : tol); }

/* ============================================================
   Un Three.js de mentira: lo justo para que la lógica corra.
   ============================================================ */
const STUB = require('./three-de-mentira');

async function abrir(navegador, archivo, conStub){
  const pag = await navegador.newPage({ viewport:{width:412, height:820} });
  const errores = [];
  pag.on('pageerror', e => errores.push(String(e.message)));
  if(conStub) await pag.addInitScript(STUB);
  // la red se corta a propósito: en el aula tampoco hay
  await pag.route('**cdnjs.cloudflare.com/**', r => r.abort());
  await pag.goto(BASE + archivo, { waitUntil:'domcontentloaded' });
  await pag.waitForTimeout(320);
  pag.__errores = errores;
  return pag;
}

/* ============================================================ */
async function revisarFuente(){
  console.log('\n📄 El archivo, antes de abrirlo');
  for(const j of JUEGOS){
    const src = fs.readFileSync(path.join(RAIZ, DIR, j), 'utf8');
    const nom = j.replace('juego-','').replace('-3d.html','');
    ok(/cdnjs\.cloudflare\.com\/ajax\/libs\/three\.js\/r128\/three\.min\.js/.test(src),
       nom+': baja Three.js r128 del CDN');
    ok(src.includes('if (window.THREE) return listo()'),
       nom+': si la pieza de 3D ya está puesta, la usa (funciona sin red y se puede probar)');
    ok(/Hace falta internet la primera vez/.test(src),
       nom+': sin red avisa en vez de quedarse en negro');
    /* La vuelta cae en el Parque de Juegos 3D, no al principio de la
       misión: el que sale de un juego quiere abrir el siguiente, y
       buscar el Parque entre dieciocho pestañas es donde se abandona. */
    ok(/href="volumen-cuerpos\.html#s-juegos3d"/.test(src), nom+': la vuelta cae en el Parque de Juegos 3D');
    ok(/<html lang="es">/.test(src), nom+': declara español');
    ok(/name="viewport"/.test(src), nom+': se adapta al teléfono');
    /* `touch-action: none` en el BODY le quita al navegador el toque
       por defecto en toda la página. Encima del dibujo hace falta —para
       arrastrar y girar sin que la página se deslice—, pero puesto en el
       body se lleva por delante los botones: en una tableta con Android
       el alumno se quedaba con la pregunta en pantalla y sin poder
       contestarla. Va en `#lienzo`, y en ningún otro sitio. */
    const cuerpo = (src.match(/\nbody\{[^}]*\}/) || [''])[0];
    ok(!/touch-action:\s*none/.test(cuerpo),
       nom+': el body no le quita el toque a toda la página', cuerpo.slice(0,120));
    const lienzoCss = (src.match(/#lienzo\{[^}]*\}/) || [''])[0];
    const arrastra = /pointermove/.test(src);
    ok(!arrastra || /touch-action:\s*none/.test(lienzoCss),
       nom+': y si se gira con el dedo, el lienzo sí lo pide');
    const malos = [...src.matchAll(/THREE\.([A-Za-z0-9_]+)/g)].map(m=>m[1]).filter(n=>!R128.has(n));
    ok(malos.length===0, nom+': solo usa piezas que existen en r128', [...new Set(malos)]);
    // el π del libro de 6.º: Math.PI en una fórmula de volumen descuadra al alumno
    if(/cilindro|latas|tanque|duelo/.test(j)){
      ok(/var PI = 3\.14;/.test(src), nom+': calcula con π = 3.14, el del libro de 6.º');
      /* Math.PI puede aparecer para girar la cámara o repartir chispas
         en círculo: eso no lo ve el alumno. Lo que no puede es entrar
         en una CUENTA, que es donde descuadraría con su cuaderno. */
      const cuentas = src.split('\n').filter(l => /Math\.PI/.test(l) &&
        /valor|volumen|litros|área|area|cm³|cm²/.test(l));
      ok(cuentas.length === 0, nom+': el π largo no entra en ninguna cuenta que vea el alumno', cuentas);
    }
  }
}

/* ============================================================ */
async function constructor_(nav){
  console.log('\n🧊 El Constructor de Cubitos');
  const p = await abrir(nav, JUEGOS[0], true);
  await p.evaluate(() => localStorage.clear());
  await p.reload({ waitUntil:'domcontentloaded' });
  await p.waitForTimeout(320);

  const niveles = await p.evaluate(() => window.__j3d.niveles);
  ok(niveles.length === 5, 'son cinco niveles', niveles.length);
  const est0 = await p.evaluate(() => window.__j3d.estado());
  ok(est0.objetivo === niveles[0].l*niveles[0].a*niveles[0].h,
     'el objetivo del nivel 1 es largo × ancho × alto', est0.objetivo);

  ok(await p.locator('#velo-pred').isVisible(), 'antes de construir pregunta cuántos cubitos van');
  await p.evaluate(() => window.__j3d.predecir(999));
  ok(await p.locator('#velo-pred').isVisible(), 'una predicción falsa no abre el nivel');
  const pista = await p.locator('#pred-av').textContent();
  ok(/capa/.test(pista), 'y explica el error contando una capa', pista);

  await p.evaluate(n => window.__j3d.predecir(n), est0.objetivo);
  await p.waitForTimeout(1300);
  ok(!(await p.locator('#velo-pred').isVisible()), 'con la predicción buena, a construir');

  await p.evaluate(() => { window.__j3d.ponerCubo(0,0,0); });     // fuera de la caja objetivo
  const fuera = await p.locator('#fuera').isVisible();
  ok(fuera, 'un cubito fuera de la caja se marca en rojo');

  await p.evaluate(() => window.__j3d.llenarObjetivo());
  const est1 = await p.evaluate(() => window.__j3d.estado());
  ok(est1.cuenta.dentro === est0.objetivo, 'la caja se llena con los cubitos justos', est1.cuenta);
  ok(!(await p.locator('#velo-fin').isVisible()),
     'con un cubito de sobra fuera, el nivel NO se da por bueno');

  await p.evaluate(() => window.__j3d.estado());
  await p.evaluate(() => { document.querySelector('.herr#h-menos').click(); });
  await p.waitForTimeout(60);

  // se limpia y se llena solo lo que toca
  await p.evaluate(() => { window.limpiar(); window.__j3d.llenarObjetivo(); });
  await p.waitForTimeout(200);
  ok(await p.locator('#velo-fin').isVisible(), 'llena exacta: nivel ganado');
  const form = await p.locator('#fin-form').textContent();
  ok(form.includes(String(est0.objetivo)+' cm³'), 'y enseña la fórmula con su resultado', form);

  ok(p.__errores.length === 0, 'sin errores de JavaScript', p.__errores);
  await p.close();
}

/* ============================================================ */
async function latas(nav){
  console.log('\n🏭 La Fábrica de Latas');
  const p = await abrir(nav, JUEGOS[1], true);
  await p.evaluate(() => localStorage.clear());
  await p.reload({ waitUntil:'domcontentloaded' });
  await p.waitForTimeout(320);
  await p.evaluate(() => document.getElementById('velo-ini').classList.remove('ver'));

  const v = await p.evaluate(() => window.__j3d.volumen(10,10));
  ok(casi(v, 3.14*100*10, 0.001), 'V = 3.14 × r × r × h', v);

  const pedidos = await p.evaluate(() => window.__j3d.pedidos.map(x => ({n:x.n, ml:x.ml, cond:x.cond})));
  ok(pedidos[0].ml === 330 && pedidos[1].ml === 1000 && pedidos[2].ml === 5000 && pedidos[3].ml === 208000,
     'los cuatro pedidos son 330 ml, 1 L, 5 L y 55 galones', pedidos.map(x=>x.ml));

  const alcanzables = await p.evaluate(() => {
    return window.__j3d.pedidos.map(function(pe){
      var mejor = 1e9;
      for(var r10=5; r10<=500; r10++){
        var r = r10/10;
        var h = pe.ml/(3.14*r*r);
        if(h < 1 || h > 200) continue;
        var h10 = Math.round(h*10)/10;
        var v = 3.14*r*r*h10;
        var dif = Math.abs(v-pe.ml)/pe.ml;
        var forma = pe.cond==='alta' ? (h10 > 2*r) : pe.cond==='ancha' ? (2*r > h10) : pe.cond==='h80' ? (h10>=80) : true;
        if(forma && dif < mejor) mejor = dif;
      }
      return {n:pe.n, dif:mejor};
    });
  });
  alcanzables.forEach(a => ok(a.dif <= 0.01,
    a.n+': se puede clavar dentro del 1 % con los mandos que hay', a));

  // lejos del objetivo: no sale la lata
  await p.evaluate(() => window.__j3d.poner(3, 20));
  await p.evaluate(() => window.__j3d.fabricar());
  ok(!(await p.locator('#velo-fin').isVisible()), 'con el volumen equivocado no fabrica');

  // 330 ml exactos: r = 3.3, h = 9.65 → 3.14·10.89·9.65 = 330.0
  const st = await p.evaluate(() => {
    // la altura que despeja la fórmula, redondeada a la décima que
    // permite el mando: si esto no cayera dentro del 1 %, el pedido
    // sería imposible de clavar y el alumno movería los mandos en vano
    var r = 3.3, meta = 330, h = Math.round(meta/(3.14*r*r)*10)/10;
    window.__j3d.poner(r, h);
    return window.__j3d.estado();
  });
  ok(Math.abs(st.v - 330)/330 <= 0.01, 'con r = 3.3 cm y su altura, la lata da 330 ml', st.v);
  await p.evaluate(() => window.__j3d.fabricar());
  await p.waitForTimeout(150);
  ok(await p.locator('#velo-fin').isVisible(), 'y entonces sí la fabrica');

  // el pedido 2 pide ALTA: mismo volumen, forma equivocada
  await p.evaluate(() => { window.siguiente(); });
  await p.waitForTimeout(120);
  const baja = await p.evaluate(() => {
    var r = 8, h = Math.round(1000/(3.14*r*r)*10)/10;    // 1 000 cm³ pero ancha
    window.__j3d.poner(r, h);
    window.__j3d.fabricar();
    return {estado: window.__j3d.estado(), aviso: document.getElementById('dif').textContent};
  });
  ok(Math.abs(baja.estado.v-1000)/1000 <= 0.03, 'el litro sale con radio 8 cm', baja.estado.v);
  ok(!(await p.locator('#velo-fin').isVisible()) && /forma/.test(baja.aviso),
     'pero como pidieron una botella ALTA, la rechaza', baja.aviso);

  ok(p.__errores.length === 0, 'sin errores de JavaScript', p.__errores);
  await p.close();
}

/* ============================================================ */
async function tanque(nav){
  console.log('\n💧 El Desafío del Tanque');
  const p = await abrir(nav, JUEGOS[2], true);
  await p.evaluate(() => localStorage.clear());
  await p.reload({ waitUntil:'domcontentloaded' });
  await p.waitForTimeout(320);
  await p.evaluate(() => document.getElementById('velo-ini').classList.remove('ver'));

  const t = await p.evaluate(() => window.__j3d.tanques.map(x => ({
    n:x.n, u:x.u, litros:x.litros, calc: window.__j3d.cuenta(x)
  })));
  ok(t.length === 6, 'son seis tanques', t.length);
  t.forEach(x => {
    // litros = volumen en dm³: cm³ ÷ 1 000, o m³ × 1 000
    const esperado = (x.u === 'm') ? x.calc*1000 : x.calc/1000;
    ok(casi(esperado, x.litros, 0.02), x.n+': los litros cuadran con la cuenta', {esperado, dice:x.litros});
  });

  const est = await p.evaluate(() => window.__j3d.estado());
  await p.evaluate(() => window.__j3d.apostar(7));      // la cubeta son 10 L
  const malo = await p.evaluate(() => window.__j3d.estado());
  ok(malo.vidas === est.vidas-1, 'apostar mal cuesta una gota', malo.vidas);

  await p.evaluate(() => { window.__j3d.llenar(); window.__j3d.saltarLlenado(); });
  await p.waitForTimeout(900);
  ok(await p.locator('#velo-fin').isVisible(), 'al llenarlo se ve el resultado');
  const cuenta = await p.locator('#fin-form').textContent();
  ok(/20 × 20 × 25/.test(cuenta) && /10/.test(cuenta), 'y la cuenta paso a paso', cuenta);

  await p.evaluate(() => window.siguiente());
  await p.waitForTimeout(150);
  const est2 = await p.evaluate(() => window.__j3d.estado());
  ok(est2.nivel === 1 && est2.litros === 200, 'el segundo tanque es la pila de 200 litros', est2);
  await p.evaluate(() => window.__j3d.apostar(200));
  const bien = await p.evaluate(() => ({est: window.__j3d.estado(), av: document.getElementById('aviso').textContent}));
  ok(bien.est.vidas === est2.vidas, 'acertar no cuesta gotas', bien.est.vidas);

  ok(p.__errores.length === 0, 'sin errores de JavaScript', p.__errores);
  await p.close();
}

/* ============================================================ */
async function laberinto(nav){
  console.log('\n🌀 El Laberinto de las Unidades');
  const p = await abrir(nav, JUEGOS[3], true);
  await p.evaluate(() => localStorage.clear());
  await p.reload({ waitUntil:'domcontentloaded' });
  await p.waitForTimeout(320);

  // veinte laberintos seguidos: todos tienen que tener salida
  const salidas = await p.evaluate(() => {
    var malos = 0;
    for(var i=0;i<20;i++){
      window.__j3d.generar(i%2 ? 11 : 15);
      var r = window.__j3d.caminoCorto();
      if(!r || r.length < 3) malos++;
    }
    return malos;
  });
  ok(salidas === 0, 'veinte laberintos seguidos, y todos con salida', salidas);

  // las conversiones: la buena es la de mil en mil, las malas son ÷10 y ÷100
  const qs = await p.evaluate(() => {
    var res = [];
    for(var i=0;i<60;i++){
      var q = window.__j3d.pregunta(i%2===1);
      var esc = ['mm³','cm³','dm³','m³','dam³','hm³','km³'];
      var m = q.preg.match(/^([\d.,]+)\s+(\S+)\s+=/);
      var n = Number(String(m[1]).replace(/[.,\s]/g,''));
      var de = esc.indexOf(m[2]), a = esc.indexOf(q.preg.match(/cuántos (\S+)\?/)[1]);
      var esperado = (de > a) ? n*Math.pow(1000, de-a) : n/Math.pow(1000, a-de);
      res.push({ok: Math.abs(esperado - q.buena) < 1e-6, buena:q.buena, esperado:esperado,
        tres: q.ops.length === 3, unaBuena: q.ops.filter(function(o){return o.ok;}).length === 1,
        sinRepe: new Set(q.ops.map(function(o){return o.v;})).size === q.ops.length});
    }
    return res;
  });
  ok(qs.every(x=>x.ok), 'sesenta conversiones y todas suben o bajan de mil en mil',
     qs.filter(x=>!x.ok).slice(0,3));
  ok(qs.every(x=>x.tres), 'cada puerta ofrece tres respuestas');
  ok(qs.every(x=>x.unaBuena), 'y solo una es la correcta');
  ok(qs.every(x=>x.sinRepe), 'sin opciones repetidas');

  await p.evaluate(() => window.__j3d.empezar());
  await p.waitForTimeout(200);
  const e0 = await p.evaluate(() => window.__j3d.estado());
  ok(e0.puertas === 3, 'el piso 1 trae tres puertas', e0.puertas);
  ok(e0.corriendo && e0.seg > 0, 'el reloj corre', e0.seg);

  // fallar una puerta cuesta 15 segundos
  const castigo = await p.evaluate(async () => {
    var p0 = window.__j3d.puertas()[0];
    var antes = window.__j3d.estado().seg;
    window.mover(0,0);
    // se abre la puerta a mano y se contesta mal
    window.abrirPuerta(p0);
    var mala = p0.q.ops.filter(function(o){ return !o.ok; })[0];
    window.responder(mala, document.createElement('button'));
    return {antes: antes, despues: window.__j3d.estado().seg, texto: document.getElementById('pt-cast').textContent};
  });
  ok(castigo.antes - castigo.despues >= 14, 'contestar mal quita 15 segundos', castigo);
  ok(/mil en mil/.test(castigo.texto), 'y le recuerda que la escalera va de mil en mil', castigo.texto);

  const abre = await p.evaluate(() => { window.__j3d.responderBien(); return window.__j3d.estado(); });
  ok(abre.abiertas === 1, 'contestar bien abre la puerta', abre.abiertas);

  ok(p.__errores.length === 0, 'sin errores de JavaScript', p.__errores);
  await p.close();
}

/* ============================================================ */
async function duelo(nav){
  console.log('\n⚔️ El Duelo de las Dimensiones');
  const p = await abrir(nav, JUEGOS[4], true);
  await p.evaluate(() => localStorage.clear());
  await p.reload({ waitUntil:'domcontentloaded' });
  await p.waitForTimeout(320);

  const f = await p.evaluate(() => ({
    cuadrado: window.__j3d.figura({f:'cuadrado',   dims:{l:5}}),
    rect:     window.__j3d.figura({f:'rectangulo', dims:{l:6,a:4}}),
    tri:      window.__j3d.figura({f:'triangulo',  dims:{b:8,h:5}}),
    circ:     window.__j3d.figura({f:'circulo',    dims:{r:4}}),
    cubo:     window.__j3d.figura({f:'cubo',       dims:{l:3}}),
    prisma:   window.__j3d.figura({f:'prisma',     dims:{l:5,a:3,h:2}}),
    cil:      window.__j3d.figura({f:'cilindro',   dims:{r:3,h:5}})
  }));
  ok(f.cuadrado.valor === 25 && f.cuadrado.plano, 'cuadrado de 5: área 25 cm², y es plano', f.cuadrado.valor);
  ok(f.rect.valor === 24 && f.rect.plano, 'rectángulo 6 × 4: área 24 cm²', f.rect.valor);
  ok(f.tri.valor === 20 && f.tri.plano, 'triángulo 8 × 5 ÷ 2: área 20 cm²', f.tri.valor);
  ok(casi(f.circ.valor, 50.24) && f.circ.plano, 'círculo de radio 4: 3.14 × 16 = 50.24 cm²', f.circ.valor);
  ok(f.cubo.valor === 27 && !f.cubo.plano, 'cubo de 3: volumen 27 cm³, y es un cuerpo', f.cubo.valor);
  ok(f.prisma.valor === 30 && !f.prisma.plano, 'prisma 5 × 3 × 2: 30 cm³', f.prisma.valor);
  ok(casi(f.cil.valor, 141.3) && !f.cil.plano, 'cilindro r 3 h 5: 3.14 × 9 × 5 = 141.3 cm³', f.cil.valor);
  // los distractores son el error de verdad, no números al azar
  ok(f.cubo.malos.some(m => m.v === 9) && f.cubo.malos.some(m => m.v === 54),
     'al cubo se le ofrece una cara (9) y su superficie (54): los dos errores clásicos',
     f.cubo.malos.map(m=>m.v));
  ok(f.cil.malos.some(m => casi(m.v, 28.26)), 'y al cilindro, la tapa sin el alto', f.cil.malos.map(m=>m.v));

  await p.evaluate(() => window.__j3d.empezar());
  await p.waitForTimeout(200);
  const e0 = await p.evaluate(() => window.__j3d.estado());
  ok(e0.plano === true, 'el primer enemigo es plano', e0);

  await p.evaluate(() => window.__j3d.atacar('volumen'));   // ataque equivocado
  await p.waitForTimeout(120);
  const rebote = await p.evaluate(() => window.__j3d.estado());
  ok(rebote.vidaYo < 100, 'atacar con volumen a algo plano te lo llevas tú', rebote.vidaYo);

  await p.waitForTimeout(1100);
  await p.evaluate(() => window.__j3d.atacar('area'));
  await p.waitForTimeout(120);
  const acierta = await p.evaluate(() => { window.__j3d.elegir(true); return true; });
  await p.waitForTimeout(200);
  const golpe = await p.evaluate(() => window.__j3d.estado());
  ok(golpe.vidaEl < e0.vidaEl, 'con el ataque bueno y la cuenta buena, el enemigo pierde vida', golpe.vidaEl);

  // el jefe cambia de plano a cuerpo a media pelea
  const jefe = await p.evaluate(() => {
    var z = window.__j3d.zonas[2].bichos[2];
    return {antes: z.base.f, despues: z.mitad.f};
  });
  ok(jefe.antes === 'rectangulo' && jefe.despues === 'prisma',
     'el jefe empieza plano y a media vida se vuelve cuerpo', jefe);

  ok(p.__errores.length === 0, 'sin errores de JavaScript', p.__errores);
  await p.close();
}

/* ============================================================ */
async function tetris(nav){
  console.log('\n🧩 El Tetris del Volumen');
  const p = await abrir(nav, JUEGOS[5], true);
  await p.evaluate(() => localStorage.clear());
  await p.reload({ waitUntil:'domcontentloaded' });
  await p.waitForTimeout(320);

  await p.evaluate(() => window.__j3d.empezar('clasico'));
  await p.waitForTimeout(150);
  const e0 = await p.evaluate(() => window.__j3d.estado());
  ok(e0.objetivo === 18, 'el nivel 1 pide 18 cm³', e0.objetivo);
  ok(e0.suma === 0 && e0.botes === 3, 'arranca en cero y con tres cajas para botar', e0);

  // una caja de 2 × 2 × 2 suma 8
  await p.evaluate(() => { window.__j3d.ponerCaja(2,2,2); window.__j3d.soltar(); });
  await p.waitForTimeout(120);
  const e1 = await p.evaluate(() => window.__j3d.estado());
  ok(e1.suma === 8, 'una caja de 2 × 2 × 2 suma 8 cm³', e1.suma);

  // el hueco de debajo no suma pero ocupa
  await p.evaluate(() => { window.__j3d.ponerCaja(3,3,1); window.__j3d.soltar(); });
  await p.waitForTimeout(120);
  const e2 = await p.evaluate(() => window.__j3d.estado());
  ok(e2.suma === 17, 'y una tapa de 3 × 3 × 1 suma 9 más', e2.suma);
  ok(e2.desperdicio > 0, 'el hueco que quedó debajo se cuenta como espacio desperdiciado', e2.desperdicio);

  // pasarse del objetivo se pierde
  await p.evaluate(() => { window.__j3d.ponerCaja(2,2,2); window.__j3d.soltar(); });
  await p.waitForTimeout(200);
  ok(await p.locator('#velo-fin').isVisible(), 'pasarse del objetivo termina la partida');
  const txt = await p.locator('#fin-tit').textContent();
  ok(/pasaste/.test(txt), 'y lo dice con todas las letras', txt);

  // llegar justo
  await p.evaluate(() => { document.getElementById('velo-fin').classList.remove('ver'); window.__j3d.empezar('clasico'); });
  await p.waitForTimeout(150);
  const justo = await p.evaluate(async () => {
    // 18 = 3×3×1 + 3×3×1
    window.__j3d.ponerCaja(3,3,1); window.__j3d.soltar();
    window.__j3d.ponerCaja(3,3,1); window.__j3d.soltar();
    return {suma: window.__j3d.estado().suma, tit: document.getElementById('fin-tit').textContent};
  });
  ok(justo.suma === 18 && /Justo/.test(justo.tit), 'llegar justo al objetivo gana el nivel', justo);

  // botar una caja gasta un turno de los tres
  await p.evaluate(() => { document.getElementById('velo-fin').classList.remove('ver'); window.__j3d.empezar('manual'); });
  await p.waitForTimeout(150);
  const bot = await p.evaluate(() => { window.__j3d.descartar(); return window.__j3d.estado(); });
  ok(bot.botes === 2, 'botar una caja gasta una de las tres', bot.botes);
  const oculto = await p.evaluate(() => document.getElementById('pieza').textContent);
  ok(/cuánto es/.test(oculto), 'en cálculo manual la caja no dice su volumen', oculto);

  ok(p.__errores.length === 0, 'sin errores de JavaScript', p.__errores);
  await p.close();
}

/* ============================================================
   La misión: que la puerta a los juegos exista y esté donde toca
   ============================================================ */
async function mision(nav){
  console.log('\n📚 La misión, con los juegos dentro');
  const p = await nav.newPage({ viewport:{width:412, height:820} });
  const errores = [];
  p.on('pageerror', e => errores.push(String(e.message)));
  /* La misión saluda con la ventana de identificarse, que tapa la
     pantalla entera. Se le deja puesto un alumno de mentira para que
     no salga: lo que se está mirando aquí son los juegos. */
  await p.addInitScript(() => {
    try{ localStorage.setItem('METAS_ALUMNO_V1', JSON.stringify(
      {nombre:'Sonda', escuela:'Centro de prueba', grado:'6', docente:'—'})); }catch(e){}
  });
  await p.goto('http://localhost:8123/'+DIR+'/volumen-cuerpos.html', { waitUntil:'domcontentloaded' });
  await p.waitForTimeout(700);
  await p.evaluate(() => { const m = document.getElementById('metasIdModal'); if(m) m.remove(); });

  ok(await p.locator('.nav-t[data-s="s-juegos3d"]').count() === 1, 'hay pestaña del Parque 3D');
  await p.locator('.nav-t[data-s="s-juegos3d"]').click();
  await p.waitForTimeout(250);
  ok(await p.locator('#s-juegos3d.active').count() === 1, 'y se abre al tocarla');

  const tarjetas = await p.locator('#s-juegos3d .juego-card').count();
  ok(tarjetas === 6, 'con las seis tarjetas', tarjetas);

  for(const j of JUEGOS){
    ok(await p.locator('#s-juegos3d a[href="'+j+'"]').count() === 1,
       'la tarjeta de '+j.replace('juego-','').replace('-3d.html','')+' enlaza a su juego');
  }
  const nuevas = await p.locator('#s-juegos3d a[target="_blank"]').count();
  ok(nuevas === 6, 'los seis se abren en otra pestaña, sin sacar al alumno de la misión', nuevas);

  // sin haber jugado, la medalla lo dice; después de jugar, cambia
  const antes = await p.locator('#s-juegos3d [data-medalla="cubitos"]').textContent();
  ok(/sin empezar/.test(antes), 'sin haber jugado, la tarjeta dice «sin empezar»', antes);
  await p.evaluate(() => localStorage.setItem('j3d_cubitos_v1', JSON.stringify({nivel:2, estrellas:20})));
  await p.reload({ waitUntil:'domcontentloaded' });
  await p.waitForTimeout(600);
  await p.evaluate(() => { const m = document.getElementById('metasIdModal'); if(m) m.remove(); });
  await p.locator('.nav-t[data-s="s-juegos3d"]').click();
  await p.waitForTimeout(200);
  const despues = await p.locator('#s-juegos3d [data-medalla="cubitos"]').textContent();
  ok(/nivel 3 de 5/.test(despues), 'y después de jugar enseña por dónde iba', despues);

  // que el progreso de la misión NO lo toquen los juegos
  const mision = await p.evaluate(() => localStorage.getItem('matematica_volumen_cuerpos_v1'));
  ok(mision === null || !/j3d/.test(mision), 'los juegos no escriben en el progreso de la misión', mision);

  // el salto desde el widget del mismo tema
  const saltos = await p.locator('.salto3d').count();
  ok(saltos === 6, 'cada widget del mismo tema tiene su salto al juego 3D', saltos);
  await p.locator('.nav-t[data-s="s-lab"]').click();
  await p.waitForTimeout(200);
  ok(await p.locator('#s-lab a.salto3d[href="juego-constructor-cubitos-3d.html"]').isVisible(),
     'en el Laboratorio de cubitos está el salto al Constructor');
  await p.locator('.nav-t[data-s="s-widgets"]').click();
  await p.waitForTimeout(200);
  ok(await p.locator('#s-widgets a.salto3d[href="juego-laberinto-unidades-3d.html"]').isVisible(),
     'en la Escalera de Unidades está el salto al Laberinto');

  /* La vuelta desde un juego: el botón ← trae con «#s-juegos3d»
     detrás y la misión tiene que abrir esa sección, no la primera.
     El alumno que sale de un juego va a abrir otro. */
  await p.goto('http://localhost:8123/'+DIR+'/volumen-cuerpos.html#s-juegos3d', { waitUntil:'domcontentloaded' });
  await p.waitForTimeout(800);
  await p.evaluate(() => { const m = document.getElementById('metasIdModal'); if(m) m.remove(); });
  ok(await p.locator('#s-juegos3d.active').count() === 1,
     'volviendo de un juego, la misión abre en el Parque de Juegos 3D');

  ok(errores.length === 0, 'la misión no tiene errores de JavaScript', errores);
  await p.close();
}



/* ============================================================
   Que lo que se ve, se pueda tocar
   ------------------------------------------------------------
   Este bloque existe por un fallo que llegó a un teléfono de
   verdad: el lienzo 3D se salía 133 px por debajo de su hueco y
   quedaba encima de los botones de responder. Se veían perfectos
   y el dedo no los tocaba nunca. El alumno se queda con la
   pregunta en pantalla y sin forma de contestarla, y lo que hace
   es cerrar la aplicación.

   No bastaba con probar «este botón responde»: hay que preguntar,
   control por control y en CADA momento de la partida, si el
   elemento que recibiría el toque es ese control o hay algo
   encima. Y hay que hacerlo con las medidas de un teléfono, que
   es donde el reparto de la pantalla aprieta.
   ============================================================ */
async function nadaTapado(p, cuando){
  return await p.evaluate(() => {
    const malos = [];
    const sel = 'button, input, a[href], [onclick], [onpointerdown]';
    document.querySelectorAll(sel).forEach(el => {
      const r = el.getBoundingClientRect();
      if(r.width < 4 || r.height < 4) return;
      const cs = getComputedStyle(el);
      if(cs.visibility === 'hidden' || cs.display === 'none' || cs.pointerEvents === 'none') return;
      if(el.disabled) return;
      // fuera de la ventana: eso se mira aparte
      const cx = r.left + r.width/2, cy = r.top + r.height/2;
      if(cx < 0 || cy < 0 || cx > window.innerWidth || cy > window.innerHeight){
        malos.push({txt:(el.textContent||el.id||'').trim().slice(0,20), tapa:'FUERA DE LA VENTANA'});
        return;
      }
      const arriba = document.elementFromPoint(cx, cy);
      if(arriba === el || el.contains(arriba)) return;
      /* Que una ventana abierta tape lo de detrás es lo que tiene que
         hacer: es un modal, y el alumno tiene que atenderlo antes de
         seguir. Lo que NO puede pasar es que tape el DIBUJO, o
         cualquier cosa que no sea una ventana. */
      const veloArriba = arriba && arriba.closest ? arriba.closest('.velo.ver') : null;
      if(veloArriba && !veloArriba.contains(el)) return;
      malos.push({txt:(el.textContent||el.id||'').trim().slice(0,20),
        tapa: arriba ? (arriba.tagName + (arriba.id?'#'+arriba.id:'') + (arriba.className && typeof arriba.className === 'string' ? '.'+arriba.className.split(' ')[0] : '')) : 'nada'});
    });
    return malos;
  });
}

/* Se recorre el juego entero con medidas de teléfono y se comprueba
   en cada momento. Las paradas van en TOQUES: el mismo recorrido que
   ya se toca con el ratón. */
async function todoAlcanzable(nav){
  console.log('\n🖐️ Que lo que se ve, se pueda tocar (medidas de teléfono)');
  for(const medida of [{width:393,height:873,n:'teléfono 393×873'}, {width:360,height:640,n:'pantalla chica 360×640'}]){
    for(const [j, arranque, botones, preparar] of TOQUES){
      const ctx = await nav.newContext({viewport:{width:medida.width, height:medida.height},
        deviceScaleFactor:2.75, isMobile:true, hasTouch:true});
      const p = await ctx.newPage();
      await p.addInitScript(STUB);
      await p.route('**cdnjs.cloudflare.com/**', r => r.abort());
      await p.goto(BASE + j, { waitUntil:'domcontentloaded' });
      await p.waitForTimeout(400);
      const nom = j.replace('juego-','').replace('-3d.html','').replace('.html','');

      let malos = await nadaTapado(p, 'al abrir');
      ok(malos.length === 0, nom+' · '+medida.n+': al abrir, nada tapado', malos);

      if(arranque){
        const b = p.locator(arranque).first();
        if(await b.count()) { await b.tap({timeout:5000}).catch(()=>{}); await p.waitForTimeout(500); }
      }
      malos = await nadaTapado(p, 'ya jugando');
      ok(malos.length === 0, nom+' · '+medida.n+': ya jugando, nada tapado', malos);

      if(preparar){ await p.evaluate(preparar); await p.waitForTimeout(150); }
      // se actúa una vez y se vuelve a mirar: los paneles de resultado
      // cambian el reparto de la pantalla, que es cuando se torcía
      for(const s of botones){
        const loc = p.locator(s).first();
        if(await loc.count() && await loc.isVisible()){
          await loc.tap({timeout:5000}).catch(()=>{});
          await p.waitForTimeout(700);
          break;
        }
      }
      malos = await nadaTapado(p, 'después de actuar');
      ok(malos.length === 0, nom+' · '+medida.n+': después de responder, nada tapado', malos);

      await ctx.close();
    }
  }
}

/* ============================================================
   La señal MALA, que es la del aula
   ------------------------------------------------------------
   Este bloque nació de un fallo que se escapó a producción: la
   sonda inyectaba Three.js ya puesto, así que el motor estaba
   listo antes del primer cuadro y la carrera no existía. En el
   sitio real el motor llega de un CDN, y el alumno impaciente
   toca «Empezar» antes. El juego reventaba por dentro y se
   quedaba en una pantalla muerta: ni pregunta, ni botones, ni
   aviso —«no funciona», y sin nada que mirar—.

   Aquí se retrasa el CDN a propósito y se toca todo lo que hay
   en pantalla durante la espera. Después tiene que quedar un
   juego jugable, no un cadáver.
   ============================================================ */
async function señalMala(nav){
  console.log('\n📶 Con la señal de un pueblo (el motor 3D tarda en llegar)');
  for(const j of JUEGOS){
    const p = await nav.newPage({ viewport:{width:412, height:820} });
    const errores = [];
    p.on('pageerror', e => errores.push(String(e.message).split('\n')[0]));
    await p.route('**cdnjs.cloudflare.com/**', async route => {
      await new Promise(r => setTimeout(r, 1500));
      await route.fulfill({status:200, contentType:'text/javascript', body: STUB});
    });
    await p.goto(BASE + j, { waitUntil:'domcontentloaded' });
    await p.waitForTimeout(300);
    const nom = j.replace('juego-','').replace('-3d.html','').replace('.html','');

    // mientras carga, el telón tapa: no hay nada que tocar
    ok(await p.locator('#velo-carga').isVisible(), nom+': mientras baja el motor, avisa y no deja tocar nada');
    let tocables = 0;
    for(const b of await p.locator('button:visible, input:visible').all()){
      const caja = await b.boundingBox();
      if(!caja) continue;
      const dentro = await p.evaluate(c => {
        const el = document.elementFromPoint(c.x + c.w/2, c.y + c.h/2);
        return !!(el && el.closest('#velo-carga'));
      }, {x:caja.x, y:caja.y, w:caja.width, h:caja.height});
      if(!dentro) tocables++;
    }
    ok(tocables === 0, nom+': ni un botón alcanzable por debajo del telón', tocables);

    await p.waitForTimeout(1900);                       // ya llegó el motor
    ok(!(await p.locator('#velo-carga').isVisible()), nom+': al llegar el motor, el telón se va');
    ok(errores.length === 0, nom+': y llegó entero, sin reventar por el camino', errores.slice(0,2));
    await p.close();
  }
}

/* ============================================================
   Tocar de verdad, no llamar a la función
   ------------------------------------------------------------
   La sonda llamaba a los manejadores por dentro. Así pasa una
   pantalla en la que el botón está tapado, o desplazado fuera, o
   con otro elemento encima: la lógica contesta y el dedo no. Aquí
   se toca con el ratón, sobre las coordenadas de verdad.
   ============================================================ */
async function tocarDeVerdad(nav){
  console.log('\n👆 Tocando los botones de verdad, con el ratón');
  for(const [j, arranque, botones, preparar] of TOQUES){
    const p = await abrir(nav, j, true);
    const nom = j.replace('juego-','').replace('-3d.html','').replace('.html','');
    if(arranque){
      const b = p.locator(arranque);
      ok(await b.count() > 0 && await b.first().isVisible(), nom+': el botón de empezar se ve');
      await b.first().click({timeout:5000});
      await p.waitForTimeout(450);
    }
    if(preparar){ await p.evaluate(preparar); await p.waitForTimeout(120); }
    for(const sel of botones){
      const loc = p.locator(sel).first();
      const hay = await loc.count() > 0 && await loc.isVisible();
      if(!hay){ ok(false, nom+': no aparece '+sel); continue; }
      /* «Responder» no siempre es cambiar de estado: decirle al alumno
         «te faltan tres» también es responder, y es lo que hace el
         botón de contar cuando todavía no ha contado todo. Así que se
         mira TODO lo que ve él: el estado, los velos y los avisos. */
      const foto = () => p.evaluate(() => {
        const t = [];
        document.querySelectorAll('#aviso,#globo,.aviso,.dif,#pt-cast,#preg,#chapa,#consigna,#que,#cuenta')
          .forEach(e => t.push(e.textContent));
        document.querySelectorAll('#ops .op').forEach(e => t.push(e.className));
        return JSON.stringify({e:window.__j3d.estado(), t:t, v:document.querySelectorAll('.velo.ver').length});
      });
      const antes = await foto();
      let movio = false;
      try{
        await loc.click({timeout:5000});
        await p.waitForTimeout(700);
        movio = (await foto()) !== antes;
      }catch(e){ movio = false; }
      ok(movio, nom+': al tocar '+sel+' con el ratón, el juego responde');
    }
    await p.close();
  }
}

/* ============================================================
   Sin internet: la pantalla lo dice y no se queda negra
   ============================================================ */
async function sinRed(nav){
  console.log('\n🌐 Sin internet (que es como está el aula la mitad del tiempo)');
  for(const j of JUEGOS){
    const p = await abrir(nav, j, false);     // sin THREE puesto y con el CDN cortado
    await p.waitForTimeout(600);
    const visible = await p.locator('#velo-red').isVisible();
    ok(visible, j.replace('juego-','').replace('-3d.html','')+': avisa que hace falta señal la primera vez');
    await p.close();
  }
}

/* ============================================================ */
(async () => {
  console.log('════════════════════════════════════════════');
  console.log(' Sonda de los juegos 3D · Misión Volumen');
  console.log('════════════════════════════════════════════');
  await revisarFuente();
  // misma llave que las demás sondas del proyecto
  const nav = await chromium.launch(
    process.env.METAS_CHROMIUM ? { executablePath: process.env.METAS_CHROMIUM } : {});
  try{
    await constructor_(nav);
    await latas(nav);
    await tanque(nav);
    await laberinto(nav);
    await duelo(nav);
    await tetris(nav);
    await mision(nav);
    await todoAlcanzable(nav);
    await señalMala(nav);
    await tocarDeVerdad(nav);
    await sinRed(nav);
  } finally { await nav.close(); }
  console.log('\n════════════════════════════════════════════');
  console.log(fallos === 0
    ? ' ✅ '+pruebas+' comprobaciones, ninguna falla'
    : ' ❌ '+fallos+' fallas de '+pruebas+' comprobaciones');
  console.log('════════════════════════════════════════════');
  process.exit(fallos === 0 ? 0 : 1);
})();
