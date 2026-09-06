/* ============================================================
   M.E.T.A.S · Sonda de los seis juegos 3D de Perímetro y Área
   ------------------------------------------------------------
   Uso:  node _dev/servidor-estatico.js   (en otra terminal)
         node _dev/verifica-juegos-3d-perimetro.js
   Si el navegador vive aparte:
         CHROMIUM_BIN=/ruta/al/chrome node _dev/verifica-juegos-3d-perimetro.js

   Qué vigila, y por qué cada cosa:

   · Las CUENTAS, una por una. Un juego que premia «el perímetro de
     un 8 × 5 son 40» le enseña el error al alumno con refuerzo
     positivo, que es la peor forma de aprenderlo. Aquí los
     perímetros y las áreas se comprueban contra las medidas de la
     figura, calculadas aparte en la sonda: si el juego y la sonda
     coinciden, es que los dos hicieron la misma cuenta bien.
   · Que el DISTRACTOR sea el error de verdad y se llame por su
     nombre: comprar el área de malla, o el perímetro de baldosas.
     Es lo que separa un juego que enseña de uno que solo puntúa.
   · Que el romboide y el trapecio no mientan: el perímetro va por
     los LADOS y el área por la ALTURA. Es la trampa del tema.
   · Que en «el terreno más grande» gane de verdad el cuadrado —o,
     cuando el cuadrado exacto no cabe, el que más se le parece—, y
     que la malla NO cambie mientras se prueban formas.
   · Que sin internet el juego lo DIGA en vez de quedarse negro.

   Los guardianes que comparten todos los parques —que lo que se ve
   se pueda tocar, la pantalla corta, la señal mala, el toque de
   verdad con el ratón, el CDN colgado y el sin internet— viven en
   `_dev/lib-sonda-3d.js` y se corren de un golpe al final.

   El dibujo en 3D NO se comprueba aquí: se pone un Three.js de
   mentira para poder mover la lógica sin tarjeta gráfica ni
   internet. Que la pantalla se vea bien hay que mirarlo con los
   ojos, una vez, en el teléfono.
   ============================================================ */
const { abrir: abrirNavegador } = require('./lib-navegador');
const path = require('path');
const lib = require('./lib-sonda-3d');

const RAIZ = path.resolve(__dirname, '..');
const DIR = 'misiones/2ciclo-perimetro-cuadrilateros';
const BASE = 'http://localhost:8123/' + DIR + '/';
const JUEGOS = [
  'juego-cercador-3d.html',
  'juego-pintor-canchas-3d.html',
  'juego-cerco-o-pintura-3d.html',
  'juego-terreno-grande-3d.html',
  'juego-cuarto-en-l-3d.html',
  'juego-fabrica-cuadrilateros-3d.html'
];

/* Qué se toca en cada juego: el botón de empezar y después el primer
   mando de verdad. En la fábrica se toca un tipo que el pedido NO
   pide —tiene que decirlo y no cambiar— y después se entrega. */
const TOQUES = [
  ['juego-cercador-3d.html',      '#velo-ini .bt-p', ['#bt-comprar', '.botones .bt-s']],
  ['juego-pintor-canchas-3d.html','#velo-ini .bt-p', ['#bt-comprar', '.botones .bt-s']],
  ['juego-cerco-o-pintura-3d.html','#velo-ini .bt-p', ['#ops .op']],
  ['juego-terreno-grande-3d.html','#velo-ini .bt-p', ['#bt-probar', '#bt-listo']],
  ['juego-cuarto-en-l-3d.html',   '#velo-ini .bt-p', ['#ops .op']],
  ['juego-fabrica-cuadrilateros-3d.html', '#velo-ini .bt-p', ['.tipo[data-t="romboide"]', '#bt-entregar']]
];

const M = lib.marcador();
const ok = M.ok, casi = M.casi;
const G = lib.parque({ raiz:RAIZ, dir:DIR, base:BASE, juegos:JUEGOS, toques:TOQUES,
                       vuelta:'perimetro-cuadrilateros.html', ok:ok });
const abrir = G.abrir;

/* ============================================================ */
function revisarFuente(){
  console.log('\n📄 El archivo, antes de abrirlo');
  G.revisarAndamio();
  for(const j of JUEGOS){
    const src = G.fuente(j), nom = G.nombre(j);
    ok(/<html lang="es">/.test(src) && /name="viewport"/.test(src), nom+': español y adaptado al teléfono');
    ok(/j3d_[a-z]+_v1/.test(src), nom+': guarda su avance en su propia llave');
    /* La misión guarda su estado entero de un golpe: un juego que
       escribiera en su llave le borraría al alumno el XP que acaba de
       ganar en otra pestaña. */
    ok(!/METAS_PERIMETRO|SAVE_KEY|progresoPerimetro/.test(src), nom+': y no toca la llave del progreso de la misión');
    /* Aquí no hay círculos, así que π no pinta nada en ninguna
       cuenta. Si aparece es para girar la cámara o el listón, y eso
       no lo ve el alumno; en una cuenta suya sería un número que no
       le cuadra con el cuaderno. */
    const cuentas = src.split('\n').filter(l => /Math\.PI/.test(l) &&
      /perímetro|perimetro|área|areaDe|metros|m²/.test(l));
    ok(cuentas.length === 0, nom+': el π no entra en ninguna cuenta que vea el alumno', cuentas);
  }
}

/* ============================================================
   🚧 El Cercador
   ------------------------------------------------------------
   Los perímetros y las áreas se comprueban contra la figura: la
   sonda suma los lados y aplica la fórmula del zapatero por su
   cuenta, y tiene que dar lo mismo que el juego.
   ============================================================ */
async function cercador(nav){
  console.log('\n🚧 El Cercador');
  const p = await abrir(nav, JUEGOS[0], true);
  await p.evaluate(() => localStorage.clear());
  await p.reload({ waitUntil:'domcontentloaded' });
  await p.waitForTimeout(320);
  await p.evaluate(() => document.getElementById('velo-ini').classList.remove('ver'));

  const ts = await p.evaluate(() => window.__j3d.terrenos.map(t => ({
    n:t.n, tipo:t.tipo, pts:t.pts,
    P: window.__j3d.perimetro(t), A: window.__j3d.area(t), L: window.__j3d.lados(t)
  })));
  ok(ts.length === 6, 'son seis terrenos', ts.length);

  /* Lo que la sonda calcula por su cuenta. Si esto se copiara del
     juego no comprobaría nada. */
  const periSonda = pts => pts.reduce((s, a, i) => {
    const b = pts[(i+1) % pts.length];
    return s + Math.hypot(b[0]-a[0], b[1]-a[1]);
  }, 0);
  const areaSonda = pts => Math.abs(pts.reduce((s, a, i) => {
    const b = pts[(i+1) % pts.length];
    return s + a[0]*b[1] - b[0]*a[1];
  }, 0)) / 2;

  ts.forEach(t => {
    ok(casi(t.P, periSonda(t.pts), 0.02), t.n+': el perímetro es la suma de sus lados', {dice:t.P, sonda:periSonda(t.pts)});
    ok(casi(t.A, areaSonda(t.pts), 0.02), t.n+': y el área cuadra con su figura', {dice:t.A, sonda:areaSonda(t.pts)});
    ok(t.P !== t.A, t.n+': el perímetro y el área NO dan lo mismo (si no, no distingue nada)', {P:t.P, A:t.A});
  });

  /* Los cuatro cuadriláteros del DCNB, y las dos trampas del tema:
     en el rombo los lados no son las diagonales, y en el romboide
     y el trapecio la altura NO es un lado. */
  const tipos = ts.map(t => t.tipo);
  ['cuadrado','rectángulo','rombo','romboide','trapecio'].forEach(x =>
    ok(tipos.indexOf(x) >= 0, 'entra el '+x+', que lo pide el DCNB', tipos));
  const rombo = ts.find(t => t.tipo === 'rombo');
  ok(rombo.L.every(l => casi(l, rombo.L[0], 0.01)), 'rombo: los cuatro lados miden igual', rombo.L);
  const romboide = ts.find(t => t.tipo === 'romboide');
  ok(casi(romboide.L[0], romboide.L[2], 0.01) && casi(romboide.L[1], romboide.L[3], 0.01),
     'romboide: los lados opuestos miden igual', romboide.L);
  const alturaRomboide = romboide.A / romboide.L[0];
  ok(romboide.L.every(l => !casi(l, alturaRomboide, 0.01)),
     'romboide: la ALTURA no es ninguno de sus lados (la trampa del tema)',
     {altura:alturaRomboide, lados:romboide.L});

  // comprar el ÁREA de malla: se llama por su nombre y cuesta un rollo
  const antes = await p.evaluate(() => window.__j3d.estado());
  const malo = await p.evaluate(() => {
    window.__j3d.comprar(window.__j3d.estado().area);
    return {est: window.__j3d.estado(), av: document.getElementById('aviso').textContent};
  });
  ok(malo.est.vidas === antes.vidas - 1, 'comprar mal cuesta un rollo', malo.est.vidas);
  ok(/ÁREA/.test(malo.av), 'y si compró el ÁREA, la pantalla se lo dice por su nombre', malo.av);

  await p.evaluate(() => { window.__j3d.cercar(); window.__j3d.saltarCerco(); });
  await p.waitForTimeout(1000);
  ok(await p.locator('#velo-fin').isVisible(), 'al cercar se ve el resultado');
  const cuenta = await p.locator('#fin-form').textContent();
  ok(/26/.test(cuenta) && /8/.test(cuenta), 'y la cuenta paso a paso, lado por lado', cuenta.slice(0,120));

  await p.evaluate(() => window.siguiente());
  await p.waitForTimeout(200);
  const est2 = await p.evaluate(() => window.__j3d.estado());
  ok(est2.nivel === 1 && est2.perimetro === 48, 'el segundo terreno es el corral cuadrado de 48 m', est2);
  const bien = await p.evaluate(() => {
    window.__j3d.comprar(window.__j3d.estado().perimetro);
    return window.__j3d.estado();
  });
  ok(bien.vidas === est2.vidas, 'acertar no cuesta rollos', bien.vidas);

  ok(p.__errores.length === 0, 'sin errores de JavaScript', p.__errores);
  await p.close();
}

/* ============================================================
   🎨 El Pintor de Canchas
   ============================================================ */
async function pintor(nav){
  console.log('\n🎨 El Pintor de Canchas');
  const p = await abrir(nav, JUEGOS[1], true);
  await p.evaluate(() => localStorage.clear());
  await p.reload({ waitUntil:'domcontentloaded' });
  await p.waitForTimeout(320);
  await p.evaluate(() => document.getElementById('velo-ini').classList.remove('ver'));

  const ps = await p.evaluate(() => window.__j3d.pisos.map(x => ({
    n:x.n, b:x.b, h:x.h, A: window.__j3d.areaDe(x), P: window.__j3d.perimetroDe(x)
  })));
  ok(ps.length === 6, 'son seis pisos', ps.length);
  ps.forEach(x => {
    ok(x.A === x.b * x.h, x.n+': el área es base × altura', {dice:x.A, sonda:x.b*x.h});
    ok(x.P === 2*(x.b + x.h), x.n+': y el perímetro, 2 × (base + altura)', {dice:x.P, sonda:2*(x.b+x.h)});
  });
  /* El pasillo largo y flaco está puesto a propósito: ahí el
     perímetro es MAYOR que el área, y se cae la idea de que «el área
     siempre da más». Sin un caso así, el alumno aprende una regla
     falsa que le funciona hasta el examen. */
  ok(ps.some(x => x.P > x.A), 'hay un piso donde el perímetro es MAYOR que el área',
     ps.map(x => x.n+': P='+x.P+' A='+x.A));

  const antes = await p.evaluate(() => window.__j3d.estado());
  const malo = await p.evaluate(() => {
    window.__j3d.comprar(window.__j3d.estado().perimetro);
    return {est: window.__j3d.estado(), av: document.getElementById('aviso').textContent};
  });
  ok(malo.est.vidas === antes.vidas - 1, 'comprar mal cuesta una caja', malo.est.vidas);
  ok(/PERÍMETRO/.test(malo.av), 'y si compró el PERÍMETRO, la pantalla se lo dice por su nombre', malo.av);

  await p.evaluate(() => { window.__j3d.cubrir(); window.__j3d.saltarCubierta(); });
  await p.waitForTimeout(1000);
  ok(await p.locator('#velo-fin').isVisible(), 'al cubrir se ve el resultado');
  const cuenta = await p.locator('#fin-form').textContent();
  ok(/filas de/.test(cuenta), 'y la cuenta se explica en filas de baldosas, no solo con la fórmula', cuenta.slice(0,140));

  ok(p.__errores.length === 0, 'sin errores de JavaScript', p.__errores);
  await p.close();
}

/* ============================================================
   ⚖️ ¿Cerco o Pintura?
   ============================================================ */
async function cercoOPintura(nav){
  console.log('\n⚖️ ¿Cerco o Pintura?');
  const p = await abrir(nav, JUEGOS[2], true);
  await p.evaluate(() => localStorage.clear());
  await p.reload({ waitUntil:'domcontentloaded' });
  await p.waitForTimeout(400);
  await p.evaluate(() => document.getElementById('velo-ini').classList.remove('ver'));

  const es = await p.evaluate(() => window.__j3d.encargos.map(x => ({
    t:x.t, cosa:x.cosa, b:x.b, h:x.h, que:x.que,
    r: window.__j3d.respuesta(x), u: window.__j3d.unidadDe(x)
  })));
  ok(es.length === 8, 'son ocho encargos', es.length);
  es.forEach(x => {
    const esperado = x.que === 'area' ? x.b*x.h : 2*(x.b+x.h);
    ok(x.r === esperado, x.cosa+' — '+(x.que==='area'?'área':'perímetro')+': la respuesta cuadra', {dice:x.r, sonda:esperado});
    ok(x.u === (x.que === 'area' ? 'm²' : 'm'), x.cosa+': la unidad es la que toca', x.u);
  });
  ok(es.filter(x => x.que === 'perimetro').length === 4 && es.filter(x => x.que === 'area').length === 4,
     'están repartidos mitad y mitad: no se puede acertar contestando siempre lo mismo');
  /* La misma cosa, dos encargos: el marco de la ventana y su vidrio.
     Es donde se ve que la respuesta no la manda el objeto sino el
     trabajo, y sin ese par el juego se contesta por el dibujo. */
  const pares = {};
  es.forEach(x => { const k = x.cosa+'|'+x.b+'x'+x.h; (pares[k] = pares[k] || []).push(x.que); });
  const conLosDos = Object.keys(pares).filter(k => pares[k].indexOf('area') >= 0 && pares[k].indexOf('perimetro') >= 0);
  ok(conLosDos.length >= 1, 'hay una misma cosa con los dos encargos (el marco y el vidrio)', conLosDos);

  // elegir mal en el primer paso cuesta una herramienta
  const antes = await p.evaluate(() => window.__j3d.estado());
  const malo = await p.evaluate(() => {
    const d = window.__j3d.estado();
    window.__j3d.tocar(d.que === 'area' ? 'perimetro' : 'area');
    return {est: window.__j3d.estado(), av: document.getElementById('aviso').textContent};
  });
  ok(malo.est.vidas === antes.vidas - 1, 'elegir mal qué se mide cuesta una herramienta', malo.est.vidas);

  // el camino bueno: qué se mide → unidad → número
  await p.reload({ waitUntil:'domcontentloaded' });
  await p.waitForTimeout(400);
  await p.evaluate(() => document.getElementById('velo-ini').classList.remove('ver'));
  const est0 = await p.evaluate(() => window.__j3d.estado());
  await p.evaluate(q => window.__j3d.tocar(q), est0.que);
  await p.waitForTimeout(1100);
  const est1 = await p.evaluate(() => window.__j3d.estado());
  ok(est1.paso === 1, 'acertando qué se mide, pregunta la unidad', est1.paso);
  await p.evaluate(u => window.__j3d.tocar(u), est1.unidad);
  await p.waitForTimeout(1100);
  const est2 = await p.evaluate(() => window.__j3d.estado());
  ok(est2.paso === 2, 'y acertando la unidad, pide el número', est2.paso);
  await p.evaluate(() => window.__j3d.tocar('buena'));
  await p.waitForTimeout(900);
  const est3 = await p.evaluate(() => window.__j3d.estado());
  ok(est3.vidas === est0.vidas && est3.estrellas > est0.estrellas,
     'el camino entero bien no cuesta nada y suma estrellas', est3);

  ok(p.__errores.length === 0, 'sin errores de JavaScript', p.__errores);
  await p.close();
}

/* ============================================================
   🏗️ El Terreno más Grande
   ------------------------------------------------------------
   Aquí lo que hay que defender es la idea entera del juego: que la
   MALLA no cambie mientras se prueban formas (si cambiara, no
   estaría comparando nada) y que el que gana sea de verdad el
   cuadrado —o el que más se le parece cuando el cuadrado exacto no
   cabe—.
   ============================================================ */
async function terreno(nav){
  console.log('\n🏗️ El Terreno más Grande');
  const p = await abrir(nav, JUEGOS[3], true);
  await p.evaluate(() => localStorage.clear());
  await p.reload({ waitUntil:'domcontentloaded' });
  await p.waitForTimeout(320);
  await p.evaluate(() => document.getElementById('velo-ini').classList.remove('ver'));

  const rs = await p.evaluate(() => window.__j3d.retos.map((re, i) => {
    const bs = window.__j3d.basesDe(re);
    return {n:re.n, modo:re.modo, v:re.v, bases:bs,
      areas: bs.map(b => window.__j3d.areaDe(re, b)),
      perims: bs.map(b => window.__j3d.perimetroDe(re, b)),
      mejor: window.__j3d.mejorBase(re),
      altMejor: window.__j3d.alturaDe(re, window.__j3d.mejorBase(re))};
  }));
  ok(rs.length === 6, 'son seis retos', rs.length);
  ok(rs.filter(x => x.modo === 'malla').length >= 3 && rs.filter(x => x.modo === 'terreno').length >= 2,
     'y van por los dos lados: misma malla, y mismo terreno');

  rs.forEach(x => {
    if(x.modo === 'malla'){
      const todos = x.perims.every(q => casi(q, x.v, 0.01));
      ok(todos, x.n+': la malla NO cambia al probar formas (si cambiara, no compararía nada)', x.perims);
      const max = Math.max.apply(null, x.areas);
      ok(casi(x.areas[x.bases.indexOf(x.mejor)], max, 0.01),
         x.n+': el que gana es de verdad el de mayor área', {mejor:x.mejor, max:max});
    } else {
      const todas = x.areas.every(q => casi(q, x.v, 0.01));
      ok(todas, x.n+': el terreno NO cambia al probar formas', x.areas);
      const min = Math.min.apply(null, x.perims);
      ok(casi(x.perims[x.bases.indexOf(x.mejor)], min, 0.01),
         x.n+': el que gana es de verdad el de menor perímetro', {mejor:x.mejor, min:min});
    }
    /* La regla de verdad no es «gana el cuadrado»: es «gana el que
       más se parece a un cuadrado». Con base y altura enteras hay
       retos donde el cuadrado exacto no cabe, y ahí el ganador tiene
       que ser el de lados más parecidos. */
    const dif = Math.abs(x.mejor - x.altMejor);
    x.bases.forEach((b, i) => {
      const h = (x.modo === 'malla') ? (x.v/2 - b) : (x.v/b);
      const empata = (x.modo === 'malla') ? casi(x.areas[i], x.areas[x.bases.indexOf(x.mejor)], 0.01)
                                          : casi(x.perims[i], x.perims[x.bases.indexOf(x.mejor)], 0.01);
      if(!empata) return;
      ok(Math.abs(b - h) >= dif - 0.01, x.n+': el ganador es el que más se parece a un cuadrado', {b:b, h:h, dif:dif});
    });
  });
  /* Y el caso que lo enseña: el más flaco encierra muchísimo menos
     que el cuadrado, con la MISMA malla. */
  const malla = rs.find(x => x.modo === 'malla');
  ok(malla.areas[0] < Math.max.apply(null, malla.areas) / 2,
     'el rectángulo más flaco encierra menos de la mitad que el mejor, con la misma malla',
     {flaco:malla.areas[0], mejor:Math.max.apply(null, malla.areas)});

  // declarar el bueno gana estrellas; declarar el flaco, no
  const antes = await p.evaluate(() => window.__j3d.estado());
  await p.evaluate(b => window.__j3d.poner(b), rs[0].mejor);
  await p.evaluate(() => { window.__j3d.anotar(); window.__j3d.declarar(); });
  await p.waitForTimeout(300);
  const desp = await p.evaluate(() => window.__j3d.estado());
  ok(desp.estrellas > antes.estrellas, 'acertar el mejor suma estrellas', desp.estrellas);
  const tit = await p.locator('#fin-tit').textContent();
  ok(/más grande|más corta/.test(tit), 'y lo dice', tit);
  const tabla = await p.locator('#fin-form').textContent();
  ok(/el más flaco/.test(tabla) && /el mejor/.test(tabla),
     'el resultado compara el más flaco con el mejor: sin comparar no se ve nada', tabla.slice(0,140));

  ok(p.__errores.length === 0, 'sin errores de JavaScript', p.__errores);
  await p.close();
}

/* ============================================================
   🧩 El Cuarto en L
   ============================================================ */
async function cuartoEnL(nav){
  console.log('\n🧩 El Cuarto en L');
  const p = await abrir(nav, JUEGOS[4], true);
  await p.evaluate(() => localStorage.clear());
  await p.reload({ waitUntil:'domcontentloaded' });
  await p.waitForTimeout(320);
  await p.evaluate(() => document.getElementById('velo-ini').classList.remove('ver'));

  const fs = await p.evaluate(() => window.__j3d.figuras.map(f => {
    const cs = window.__j3d.cortesDe(f);
    return {n:f.n, W:f.W, H:f.H, w:f.w, h:f.h, esq:f.esq,
      A: window.__j3d.areaDe(f), entera: window.__j3d.areaEntera(f), hueco: window.__j3d.areaHueco(f),
      cortes: cs.map(c => {
        const pz = window.__j3d.partir(f, c), kA = window.__j3d.caja(pz[0]), kB = window.__j3d.caja(pz[1]);
        return {eje:c.eje, en:c.en, vale: window.__j3d.corteVale(f, c),
                piezas: [pz[0].length, pz[1].length],
                cajas: [kA && kA.b*kA.a, kB && kB.b*kB.a]};
      })};
  }));
  ok(fs.length === 6, 'son seis figuras', fs.length);
  fs.forEach(f => {
    ok(f.A === f.W*f.H - f.w*f.h, f.n+': el área es el rectángulo entero menos el pedazo que falta',
       {dice:f.A, sonda:f.W*f.H - f.w*f.h});
    ok(f.entera === f.W*f.H && f.hueco === f.w*f.h, f.n+': y las dos piezas de esa resta cuadran', {e:f.entera, h:f.hueco});
    const buenos = f.cortes.filter(c => c.vale);
    ok(buenos.length === 2, f.n+': se ofrecen DOS cortes que valen (hay más de una forma de partirlo)', f.cortes.length);
    ok(f.cortes.some(c => !c.vale), f.n+': y uno que NO vale, porque deja un pedazo raro');
    buenos.forEach(c => {
      ok(c.piezas[0] + c.piezas[1] === f.A, f.n+' · corte '+c.eje+c.en+': los dos pedazos suman el área entera', c.piezas);
      ok(c.cajas[0] === c.piezas[0] && c.cajas[1] === c.piezas[1],
         f.n+' · corte '+c.eje+c.en+': los dos pedazos son rectángulos llenos', {cajas:c.cajas, piezas:c.piezas});
    });
  });

  // cortar por donde no vale cuesta una tijera y lo explica
  const antes = await p.evaluate(() => window.__j3d.estado());
  const malo = await p.evaluate(() => {
    const bs = document.querySelectorAll('#ops .op');
    const f = window.__j3d.figuras[window.__j3d.estado().indice];
    const cs = window.__j3d.cortesDe(f);
    const malo = cs.filter(c => !window.__j3d.corteVale(f, c))[0];
    for(const b of bs){ if(b.textContent.indexOf(malo.sub) >= 0){ b.click(); break; } }
    return {est: window.__j3d.estado(), av: document.getElementById('aviso').textContent};
  });
  ok(malo.est.vidas === antes.vidas - 1, 'cortar por donde no vale cuesta una tijera', malo.est.vidas);
  ok(/raro/.test(malo.av), 'y explica por qué: queda un pedazo al que no se le puede aplicar base × altura', malo.av);

  // el corte bueno abre el paso de la suma
  await p.evaluate(() => window.__j3d.tocarCorteBueno());
  await p.waitForTimeout(1300);
  const est1 = await p.evaluate(() => window.__j3d.estado());
  ok(est1.paso === 1, 'con un corte bueno, pregunta cuánto suma', est1.paso);
  await p.evaluate(() => window.__j3d.tocar('buena'));
  await p.waitForTimeout(900);
  const form = await p.locator('#fin-form').textContent();
  ok(/Partiendo en dos/.test(form) && /Por resta/.test(form),
     'y el resultado enseña LOS DOS caminos, aunque solo se usara uno', form.slice(0,120));

  ok(p.__errores.length === 0, 'sin errores de JavaScript', p.__errores);
  await p.close();
}

/* ============================================================
   📐 La Fábrica de Cuadriláteros
   ============================================================ */
async function fabrica(nav){
  console.log('\n📐 La Fábrica de Cuadriláteros');
  const p = await abrir(nav, JUEGOS[5], true);
  await p.evaluate(() => localStorage.clear());
  await p.reload({ waitUntil:'domcontentloaded' });
  await p.waitForTimeout(320);
  await p.evaluate(() => document.getElementById('velo-ini').classList.remove('ver'));

  /* Que las cuatro fórmulas den lo que dice el libro de sexto. Se
     comprueban contra las cuentas escritas aparte en la sonda. */
  const f = await p.evaluate(() => {
    const J = window.__j3d, out = [];
    [['cuadrado',6,6,0],['rectangulo',8,4,0],['romboide',10,4,0],['trapecio',12,8,6]].forEach(x => {
      const pts = J.esquinas(x[0], x[1], x[2], x[3]);
      out.push({tipo:x[0], b:x[1], h:x[2], m:x[3], P:J.perimetroDe(pts), A:J.areaDe(pts), L:J.ladosDe(pts)});
    });
    return {casos:out, sesgo:J.SESGO};
  });
  const esperado = {
    cuadrado:   {P: 4*6,                A: 6*6},
    rectangulo: {P: 2*(8+4),            A: 8*4},
    romboide:   {P: 2*(10+Math.hypot(4, f.sesgo)), A: 10*4},
    trapecio:   {P: 12 + 6 + 8 + Math.hypot(8, 12-6), A: (12+6)/2*8}
  };
  f.casos.forEach(c => {
    ok(casi(c.P, esperado[c.tipo].P, 0.02), c.tipo+': el perímetro es la suma de sus lados', {dice:c.P, sonda:esperado[c.tipo].P});
    ok(casi(c.A, esperado[c.tipo].A, 0.02), c.tipo+': y el área, la fórmula del libro', {dice:c.A, sonda:esperado[c.tipo].A});
  });
  /* La trampa del tema, y la razón de ser de este juego: en el
     romboide y en el trapecio el área usa la ALTURA y el perímetro
     usa los LADOS. Si la altura fuera uno de los lados, el alumno
     podría sumarla al perímetro y acertar por casualidad. */
  const romb = f.casos.find(c => c.tipo === 'romboide');
  ok(romb.L.every(l => !casi(l, romb.h, 0.01)),
     'romboide: la altura NO es ninguno de sus lados', {altura:romb.h, lados:romb.L});
  const trap = f.casos.find(c => c.tipo === 'trapecio');
  ok(casi(romb.L[1], 5, 0.01), 'romboide: con altura 4 el lado inclinado da 5 exactos (el 3-4-5)', romb.L[1]);
  ok(casi(trap.L[1], 10, 0.01), 'trapecio: y su lado inclinado, 10 exactos', trap.L[1]);

  /* Cada pedido tiene que poder cumplirse con los mandos que hay. Un
     pedido imposible deja al alumno moviendo la barra en vano hasta
     que cierra el juego. */
  const posibles = await p.evaluate(() => {
    const J = window.__j3d;
    return J.pedidos.map(pd => {
      for(let b=1; b<=20; b++){
        for(let h=1; h<=20; h++){
          for(let m=1; m<b; m++){
            const pts = J.esquinas(pd.tipo, b, (pd.tipo==='cuadrado'?b:h), m);
            const P = J.perimetroDe(pts), A = J.areaDe(pts);
            if(pd.base && b !== pd.base) continue;
            if(pd.menor && m !== pd.menor) continue;
            if(pd.area !== undefined && Math.abs(A - pd.area) > 0.01) continue;
            if(pd.perim !== undefined && Math.abs(P - pd.perim) > 0.01) continue;
            return {t:pd.t, b:b, h:h, m:m};
          }
        }
      }
      return {t:pd.t, imposible:true};
    });
  });
  ok(posibles.length === 6, 'son seis pedidos', posibles.length);
  posibles.forEach(x => ok(!x.imposible, 'se puede cumplir: '+x.t, x));

  // entregar lo que no es no pasa; entregar lo bueno, sí
  const flojo = await p.evaluate(() => {
    window.__j3d.poner('cuadrado', 5, 5);
    window.__j3d.entregar();
    return window.__j3d.estado();
  });
  ok(!(await p.locator('#velo-fin').isVisible()) && /Todavía no/.test(flojo.aviso),
     'con las medidas equivocadas no entrega, y dice qué falta', flojo.aviso);
  await p.evaluate(() => { window.__j3d.poner('cuadrado', 6, 6); window.__j3d.entregar(); });
  await p.waitForTimeout(200);
  ok(await p.locator('#velo-fin').isVisible(), 'y con las buenas, entrega');

  ok(p.__errores.length === 0, 'sin errores de JavaScript', p.__errores);
  await p.close();
}

/* ============================================================
   📚 La misión, con los juegos dentro
   ============================================================ */
async function mision(nav){
  console.log('\n📚 La misión, con los juegos dentro');
  const p = await nav.newPage({ viewport:{width:412, height:820} });
  const errores = [];
  p.on('pageerror', e => errores.push(String(e.message)));
  await p.addInitScript(() => {
    try{ localStorage.setItem('METAS_ALUMNO_V1', JSON.stringify(
      {nombre:'Sonda', escuela:'Centro de prueba', grado:'6', docente:'—'})); }catch(e){}
  });
  await p.goto('http://localhost:8123/'+DIR+'/perimetro-cuadrilateros.html', { waitUntil:'domcontentloaded' });
  await p.waitForTimeout(700);
  await p.evaluate(() => { const m = document.getElementById('metasIdModal'); if(m) m.remove(); });

  ok(await p.locator('.nav-t[data-s="s-juegos3d"]').count() === 1, 'hay pestaña del Parque 3D');
  await p.locator('.nav-t[data-s="s-juegos3d"]').click();
  await p.waitForTimeout(250);
  ok(await p.locator('#s-juegos3d.active').count() === 1, 'y se abre al tocarla');
  ok(await p.locator('#s-juegos3d .juego-card').count() === 6, 'con las seis tarjetas');
  for(const j of JUEGOS){
    ok(await p.locator('#s-juegos3d a[href="'+j+'"]').count() === 1,
       'la tarjeta de '+G.nombre(j)+' enlaza a su juego');
  }
  ok(await p.locator('#s-juegos3d a[target="_blank"]').count() === 6,
     'los seis se abren en otra pestaña, sin sacar al alumno de la misión');

  const antes = await p.locator('#s-juegos3d [data-medalla="cercador"]').textContent();
  ok(/sin empezar/.test(antes), 'sin haber jugado, la tarjeta dice «sin empezar»', antes);
  await p.evaluate(() => localStorage.setItem('j3d_cercador_v1', JSON.stringify({nivel:2, estrellas:12})));
  await p.reload({ waitUntil:'domcontentloaded' });
  await p.waitForTimeout(600);
  await p.evaluate(() => { const m = document.getElementById('metasIdModal'); if(m) m.remove(); });
  await p.locator('.nav-t[data-s="s-juegos3d"]').click();
  await p.waitForTimeout(200);
  const desp = await p.locator('#s-juegos3d [data-medalla="cercador"]').textContent();
  ok(/terreno 3 de 6/.test(desp), 'y después de jugar enseña por dónde iba', desp);

  ok(await p.locator('.salto3d').count() === 6, 'cada widget del mismo tema tiene su salto al juego 3D');
  await p.locator('.nav-t[data-s="s-lab"]').click();
  await p.waitForTimeout(200);
  ok(await p.locator('#s-lab a.salto3d[href="juego-cercador-3d.html"]').isVisible(),
     'en la calculadora de perímetros está el salto al Cercador');
  ok(await p.locator('#s-lab a.salto3d[href="juego-pintor-canchas-3d.html"]').isVisible(),
     'y en la de áreas, el salto al Pintor de Canchas');

  /* La vuelta desde un juego: el botón ← trae con «#s-juegos3d»
     detrás y la misión tiene que abrir esa sección, no la primera.
     El alumno que sale de un juego va a abrir otro. */
  await p.goto('http://localhost:8123/'+DIR+'/perimetro-cuadrilateros.html#s-juegos3d', { waitUntil:'domcontentloaded' });
  await p.waitForTimeout(800);
  await p.evaluate(() => { const m = document.getElementById('metasIdModal'); if(m) m.remove(); });
  ok(await p.locator('#s-juegos3d.active').count() === 1,
     'volviendo de un juego, la misión abre en el Parque de Juegos 3D');

  ok(errores.length === 0, 'la misión no tiene errores de JavaScript', errores);
  await p.close();
}

/* ============================================================ */
(async () => {
  console.log('════════════════════════════════════════════');
  console.log(' Sonda de los juegos 3D · Perímetro y Área');
  console.log('════════════════════════════════════════════');
  revisarFuente();
  const nav = await abrirNavegador();
  try{
    await cercador(nav);
    await pintor(nav);
    await cercoOPintura(nav);
    await terreno(nav);
    await cuartoEnL(nav);
    await fabrica(nav);
    await mision(nav);
    /* Los seis guardianes que comparten todos los parques: que lo que
       se ve se pueda tocar, la pantalla corta, la señal mala, el toque
       de verdad con el ratón, el CDN colgado y el sin internet. */
    await G.guardianes(nav);
  } finally { await nav.close(); }
  M.resumen();
})();
