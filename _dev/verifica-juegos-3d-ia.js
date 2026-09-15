/* ============================================================
   M.E.T.A.S · Sonda de los seis juegos 3D de la Ruta de la
   Máquina que Aprende
   ------------------------------------------------------------
   Uso:  node _dev/servidor-estatico.js   (en otra terminal)
         node _dev/verifica-juegos-3d-ia.js

   Qué vigila, y por qué cada cosa:

   · Las CUENTAS, una por una, y calculadas APARTE. En los otros
     parques un error de cuenta le enseña mal una fórmula; aquí le
     enseña mal cómo piensa una máquina, que es peor: el alumno no
     tiene con qué comprobarlo. Por eso la sonda no le pregunta al
     juego si acertó — recalcula ella el vecino más cercano, las
     k-medias y el mejor plano, y compara.
   · Que cada nivel CUMPLA LO QUE PROMETE. «Con el tamaño solo
     basta», «ningún plano los separa», «sin el plátano le falla al
     plátano»: si una de esas frases es falsa, el juego le está
     enseñando al alumno a no creerle a la pantalla, que es lo
     contrario de esta ruta entera.
   · Que la trampa siga siendo trampa: que el que memoriza saque
     100 % en lo que ya vio y falle con lo nuevo, que la máquina
     conteste ante una PIEDRA, y que pedirle tres grupos donde hay
     uno le devuelva tres.
   · Que ningún juego escriba en el progreso de la misión.

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
const fs = require('fs');
const path = require('path');
const lib = require('./lib-sonda-3d');
/* El aparato compartido del parque se carga EN NODE, no en el
   navegador: sus cuatro cuentas no tocan el DOM justamente para
   esto, y así la sonda recalcula con el mismo código que el juego
   en vez de fiarse de lo que el juego diga. */
const N = require('../js/3d/nube-ia.js');

const RAIZ = path.resolve(__dirname, '..');
const DIR = 'misiones/2ciclo-como-aprende-una-maquina';
const BASE = 'http://localhost:8123/' + DIR + '/';
const JUEGOS = [
  'juego-separador-3d.html',
  'juego-vecino-3d.html',
  'juego-grupos-3d.html',
  'juego-sesgo-3d.html',
  'juego-memorizo-3d.html',
  'juego-refuerzo-3d.html'
];

/* Qué se toca en cada juego: el botón de empezar y después el primer
   mando de verdad. */
const TOQUES = [
  ['juego-separador-3d.html', '#velo-ini .bt-p', ['#bt-listo', '.botones .bt-s']],
  ['juego-vecino-3d.html',    '#velo-ini .bt-p', ['#ops .op']],
  ['juego-grupos-3d.html',    '#velo-ini .bt-p', ['#bt-agrupar']],
  ['juego-sesgo-3d.html',     '#velo-ini .bt-p', ['#bt-entrenar']],
  ['juego-memorizo-3d.html',  '#velo-ini .bt-p', ['#bt-examinar']],
  ['juego-refuerzo-3d.html',  '#velo-ini .bt-p', ['#bt-uno']]
];

const M = lib.marcador();
const ok = M.ok, casi = M.casi;
const G = lib.parque({ raiz:RAIZ, dir:DIR, base:BASE, juegos:JUEGOS, toques:TOQUES,
                       vuelta:'como-aprende-una-maquina.html', ok:ok });
const abrir = G.abrir;

/* ============================================================
   El archivo, antes de abrirlo
   ============================================================ */
function revisarFuente(){
  console.log('\n📄 El archivo, antes de abrirlo');
  G.revisarAndamio();
  const NUBE = fs.readFileSync(path.join(RAIZ, 'js/3d/nube-ia.js'), 'utf8');
  /* El andamio compartido mira las piezas de Three.js que usa CADA
     juego, pero aquí casi todas viven en el aparato del parque: sin
     esta comprobación, un nombre mal escrito ahí dentro no lo caza
     nadie hasta que el juego se abre delante del niño. */
  const malas = [...NUBE.matchAll(/THREE\.([A-Za-z0-9_]+)/g)].map(m => m[1]).filter(n => !lib.R128.has(n));
  ok(malas.length === 0, 'nube-ia: solo usa piezas de Three.js que existen en r128', [...new Set(malas)]);
  ok(/if\(typeof window !== 'undefined'\)/.test(NUBE) && /module\.exports/.test(NUBE),
     'nube-ia: corre también en Node, que es como esta sonda recalcula las cuentas');

  for(const j of JUEGOS){
    const src = G.fuente(j), nom = G.nombre(j);
    ok(/<html lang="es">/.test(src) && /name="viewport"/.test(src), nom+': español y adaptado al teléfono');
    ok(/j3d_[a-z]+_v1/.test(src), nom+': guarda su avance en su propia llave');
    /* La misión guarda su estado entero de un golpe: un juego que
       escribiera en su llave le borraría al alumno el XP que acaba de
       ganar en otra pestaña. */
    ok(!/METAS_IA|SAVE_KEY|progresoMaquina|METAS_ALUMNO/.test(src),
       nom+': y no toca la llave del progreso de la misión');
    ok(/<script src="\.\.\/\.\.\/js\/3d\/nube-ia\.js"><\/script>/.test(src),
       nom+': carga el aparato del parque (la nube, el vecino, las k-medias)');
    /* El CSS del parque va DESPUÉS del andamio: de ahí saca su color y
       así lo pisa por orden, sin un solo !important. */
    const iAndamio = src.indexOf('css/parque-3d.css'), iParque = src.indexOf('css/parque-ia.css');
    ok(iAndamio >= 0 && iParque > iAndamio, nom+': y su CSS va después del andamio, que es de donde lo pisa');
    /* Aquí no hay círculos: el único π que puede aparecer es el de
       pasar GRADOS a radianes —para girar la cámara o el plano—, y
       eso el alumno no lo lee nunca: lo que él mueve y lo que la
       pantalla le dice son grados. Cualquier otro π estaría metido en
       una cuenta suya, y sería un número que no le cuadra con el
       cuaderno. */
    const cuentas = src.split('\n').filter(l => /Math\.PI/.test(l) && !/Math\.PI\s*\/\s*180/.test(l));
    ok(cuentas.length === 0, nom+': el π no entra en ninguna cuenta que vea el alumno', cuentas);
  }
  /* Los seis marcan el error del MISMO modo —blanco y más grande— y
     ninguno usa rojo contra ámbar, que es el par que no distingue uno
     de cada doce niños. Seis juegos con seis convenciones distintas
     obligarían a reaprender el dibujo en cada uno. */
  for(const j of ['juego-separador-3d.html','juego-sesgo-3d.html','juego-memorizo-3d.html']){
    const src = G.fuente(j);
    ok(/0xffffff/.test(src) && /scale\.set\(s, s, s\)/.test(src),
       G.nombre(j)+': lo que la máquina falla se marca en blanco y más grande, como en los otros');
  }
}

/* ============================================================
   1 · El Separador: la frontera, y el caso que no tiene
   ============================================================ */
const GIRO_PASO = 5, INC_PASO = 5, DES_PASO = 0.06, DES_TOPE = 30;
function normalDe(g, i){
  const rg = g*Math.PI/180, ri = i*Math.PI/180;
  return {x:Math.cos(ri)*Math.cos(rg), y:Math.sin(ri), z:Math.cos(ri)*Math.sin(rg)};
}
function aciertosCon(pts, n, d){
  let a = 0;
  for(const p of pts) if(((n.x*p.x + n.y*p.y + n.z*p.z) > d ? 0 : 1) === p.clase) a++;
  return Math.max(a, pts.length - a);
}
/* La misma búsqueda que hace el juego, escrita aparte a propósito: si
   las dos coinciden es que las dos hicieron bien la misma cuenta. */
function mejorPosible(pts, ejes){
  let top = 0;
  for(let g=0; g<360; g+=GIRO_PASO){
    for(let i=-90; i<=90; i+=INC_PASO){
      let n = normalDe(g, i);
      if(ejes){
        n = {x: ejes.includes(0)?n.x:0, y: ejes.includes(1)?n.y:0, z: ejes.includes(2)?n.z:0};
        if(Math.sqrt(n.x*n.x+n.y*n.y+n.z*n.z) < 1e-6) continue;
      }
      for(let d=-DES_TOPE; d<=DES_TOPE; d++){
        const a = aciertosCon(pts, n, d*DES_PASO);
        if(a > top){ top = a; if(top === pts.length && !ejes) return top; }
      }
    }
  }
  return top;
}

async function probarSeparador(nav){
  console.log('\n🔪 El Separador · la frontera que traza una máquina');
  const p = await abrir(nav, 'juego-separador-3d.html', true);
  const casos = await p.evaluate(() => window.__j3d.casos.map(c => ({
    n:c.n, nubes:c.nubes, semilla:c.semilla, imposible:!!c.imposible, clases:c.clases.length
  })));
  ok(casos.length === 4, 'trae los cuatro casos', casos.length);

  const esperado = [
    {i:0, solo:[0],   nota:'con el TAMAÑO solo ya se separan'},
    {i:1, solo:null,  dos:[0,1], nota:'ninguna medida sola alcanza, y el tamaño con el peso sí'},
    {i:2, solo:[1],   sin:[0,2], nota:'desde arriba están revueltas y la medida de en medio los separa'},
    {i:3, imposible:true, nota:'ningún plano los separa'}
  ];
  for(const e of esperado){
    const c = casos[e.i];
    const pts = N.generar(c.nubes, c.semilla);
    const todo = mejorPosible(pts, null);
    ok(pts.length >= 20, 'caso '+(e.i+1)+' «'+c.n+'»: trae ejemplos de sobra ('+pts.length+')');
    if(e.imposible){
      ok(todo < pts.length, 'caso '+(e.i+1)+': '+e.nota+' (lo más: '+todo+' de '+pts.length+')');
      ok(c.imposible === true, 'caso '+(e.i+1)+': y el juego lo declara imposible, no promete una salida');
      ok(todo >= pts.length*0.7, 'caso '+(e.i+1)+': pero se puede llegar lejos, no es un castigo', todo);
    } else {
      ok(todo === pts.length, 'caso '+(e.i+1)+' «'+c.n+'»: con las tres medidas SÍ se separan del todo', todo+'/'+pts.length);
    }
    if(e.solo){
      ok(mejorPosible(pts, e.solo) === pts.length, 'caso '+(e.i+1)+': '+e.nota);
      for(const otro of [0,1,2].filter(x => !e.solo.includes(x))){
        ok(mejorPosible(pts, [otro]) < pts.length,
           'caso '+(e.i+1)+': y la medida '+(otro+1)+' sola NO alcanza', mejorPosible(pts, [otro]));
      }
    }
    if(e.solo === null && e.dos){
      for(const uno of [0,1,2]) ok(mejorPosible(pts, [uno]) < pts.length,
        'caso '+(e.i+1)+': la medida '+(uno+1)+' sola no alcanza', mejorPosible(pts, [uno]));
      ok(mejorPosible(pts, e.dos) === pts.length, 'caso '+(e.i+1)+': '+e.nota);
    }
    if(e.sin){
      ok(mejorPosible(pts, e.sin) < pts.length,
         'caso '+(e.i+1)+': quitando la medida que manda, ya no se separan', mejorPosible(pts, e.sin));
    }
  }

  /* Lo que el juego le PIDE al alumno tiene que ser alcanzable con los
     mandos que le da. Es la comprobación que impide pedirle un
     imposible —o regalarle el caso—, y por eso la meta se calcula y no
     se escribe. */
  const delJuego = await p.evaluate(() => {
    const r = [];
    for(let i=0;i<window.__j3d.casos.length;i++){
      const c = window.__j3d.casos[i];
      const pts = NubeIA.generar(c.nubes, c.semilla);
      r.push(window.__j3d.mejorPosible(pts, null));
    }
    return r;
  });
  for(let i=0;i<casos.length;i++){
    const pts = N.generar(casos[i].nubes, casos[i].semilla);
    ok(delJuego[i] === mejorPosible(pts, null),
       'caso '+(i+1)+': la meta que pide el juego es la que de verdad se puede',
       {juego:delJuego[i], sonda:mejorPosible(pts, null)});
  }

  /* ⚠️ Que ningún caso salga RESUELTO de fábrica. Arrancaba con el
     plano de pie en el centro y así el primer caso ya estaba hecho al
     abrir: se tocaba «Ya está» sin mover nada y caían tres estrellas
     del caso que enseña que el tamaño basta, sin haberlo visto. */
  const ini = await p.evaluate(() => window.__j3d.inicio);
  const nIni = normalDe(ini.giro, ini.inc);
  for(let i=0;i<casos.length;i++){
    const pts = N.generar(casos[i].nubes, casos[i].semilla);
    const deSalida = aciertosCon(pts, nIni, ini.des*DES_PASO);
    ok(deSalida < mejorPosible(pts, null),
       'caso '+(i+1)+': al abrir NO está resuelto — hay algo que hacer',
       {salida:deSalida, meta:mejorPosible(pts, null)});
  }

  /* Y que el plano de verdad cuente bien: se pone uno a mano y se
     comparan los aciertos que enseña la pantalla con los de la sonda. */
  await p.locator('#velo-ini .bt-p').click();
  await p.waitForTimeout(250);
  await p.evaluate(() => window.__j3d.poner(0, 0, 0));
  await p.waitForTimeout(150);
  const est = await p.evaluate(() => window.__j3d.estado());
  const pts0 = N.generar(casos[0].nubes, casos[0].semilla);
  ok(est.aciertos === aciertosCon(pts0, normalDe(0, 0), 0),
     'con el plano de pie en el centro, cuenta los mismos aciertos que la sonda',
     {juego:est.aciertos, sonda:aciertosCon(pts0, normalDe(0,0), 0)});
  ok(est.aciertos === pts0.length,
     'y ese plano ya resuelve el primer caso: el tamaño basta', est.aciertos+'/'+pts0.length);

  /* Con el plano puesto mal no se pasa de nivel: un juego que dé la
     estrella igual enseña que da lo mismo. */
  await p.evaluate(() => window.__j3d.poner(0, 90, 0));
  await p.waitForTimeout(120);
  const mal = await p.evaluate(() => window.__j3d.estado());
  ok(mal.aciertos < mal.meta, 'con el plano acostado, el juego dice que todavía no', mal);
  await p.evaluate(() => window.__j3d.listo());
  await p.waitForTimeout(200);
  const trasFallo = await p.evaluate(() => ({e:window.__j3d.estado(),
    av:document.getElementById('aviso').textContent, velo:document.querySelectorAll('.velo.ver').length}));
  ok(trasFallo.e.caso === 0 && /lado que no es/.test(trasFallo.av),
     'no lo da por bueno y le dice cuántos le quedan mal', trasFallo.av);
  await p.close();
}

/* ============================================================
   2 · El Vecino Más Cercano: la piedra y el mango verde
   ============================================================ */
async function probarVecino(nav){
  console.log('\n📏 El Vecino Más Cercano · cómo decide, y por qué contesta siempre');
  const p = await abrir(nav, 'juego-vecino-3d.html', true);
  const d = await p.evaluate(() => ({
    rondas: window.__j3d.rondas.map(r => ({que:r.que, p:r.p, ense:r.enseña || null, ojo:!!r.ojo})),
    base: window.__j3d.base,
    clases: window.__j3d.clases.map(c => c.nombre)
  }));
  ok(d.rondas.length === 6, 'trae las seis rondas', d.rondas.length);
  ok(d.base.length === 12, 'y los doce ejemplos etiquetados', d.base.length);

  const ej = d.base.map(e => ({x:e.x, y:e.y, z:e.z, clase:e.clase}));
  const dice = (q, lista) => lista[N.vecino(q, lista)].clase;
  const dist = (q, lista) => N.dist(q, lista[N.vecino(q, lista)]);

  ok(dice(d.rondas[0].p, ej) === 1, 'ronda 1: el que cae entre los mangos → Mango');
  ok(dice(d.rondas[1].p, ej) === 2, 'ronda 2: el que cae entre las sandías → Sandía');

  /* La piedra: no es ninguna de las tres frutas y la máquina contesta
     igual. Es la lección entera del juego, así que se comprueba que
     siga pasando Y que de verdad esté lejísimos —si algún día alguien
     la mueve cerca de un montón, el aviso dejaría de ser cierto—. */
  const piedra = d.rondas[3];
  ok(/PIEDRA/i.test(piedra.que), 'ronda 4: le ponen una piedra');
  ok([0,1,2].includes(dice(piedra.p, ej)), 'y la máquina le pone nombre de fruta igual: nunca dice «no sé»');
  const lejos = dist(piedra.p, ej);
  const cercaMedia = d.rondas.slice(0,3).reduce((a,r) => a + dist(r.p, ej), 0) / 3;
  ok(lejos > cercaMedia*2, 'y le queda mucho más lejos que cualquier fruta de verdad',
     {piedra:+lejos.toFixed(2), frutas:+cercaMedia.toFixed(2)});
  ok(piedra.ojo, 'y la pantalla lo AVISA en vez de dejarlo pasar');

  /* El mango chico y verde: la máquina acierta su cuenta y se equivoca
     de fruta. Sin esto el juego no enseña de dónde viene un error. */
  const verde = d.rondas[4];
  ok(dice(verde.p, ej) === 0, 'ronda 5: al mango chico y verde le dice Limón —le faltaba el ejemplo—');
  ok(verde.ojo, 'y lo explica: no falló la cuenta, faltaba el ejemplo');
  ok(verde.ense && verde.ense.clase === 1, 'y ofrece enseñarle el mango que le faltaba');

  const conMango = ej.concat([{x:verde.ense.x, y:verde.ense.y, z:verde.ense.z, clase:verde.ense.clase}]);
  ok(dice(d.rondas[5].p, conMango) === 1,
     'ronda 6: con ese único ejemplo nuevo, la misma fruta ya le sale Mango');
  ok(d.rondas[5].p.x === verde.p.x && d.rondas[5].p.y === verde.p.y && d.rondas[5].p.z === verde.p.z,
     'y es exactamente la MISMA fruta: si fuera otra, no probaría nada');

  /* Y jugando: se contesta lo que la sonda dice que va a contestar. */
  await p.locator('#velo-ini .bt-p').click();
  await p.waitForTimeout(250);
  await p.locator('#ops .op[data-v="1"]').click();
  await p.waitForTimeout(400);
  const e1 = await p.evaluate(() => ({e:window.__j3d.estado(),
    buena:document.querySelector('#ops .op.buena') ? document.querySelector('#ops .op.buena').dataset.v : null}));
  ok(e1.buena === '1', 'en pantalla, la respuesta buena de la ronda 1 es Mango', e1.buena);
  ok(e1.e.aciertos === 1, 'y se le cuenta el acierto', e1.e);
  await p.close();
}

/* ============================================================
   3 · Los Grupos Escondidos: los que hay y los que le pidas
   ============================================================ */
async function probarGrupos(nav){
  console.log('\n🗂️ Los Grupos Escondidos · sin una sola etiqueta');
  const p = await abrir(nav, 'juego-grupos-3d.html', true);
  const montones = await p.evaluate(() => window.__j3d.montones.map(x => ({
    n:x.n, k:x.k, nubes:x.nubes, semilla:x.semilla, trampa:!!x.trampa, ojo:!!x.ojo
  })));
  ok(montones.length === 4, 'trae los cuatro montones', montones.length);

  for(let i=0;i<montones.length;i++){
    const m = montones[i];
    const pts = N.generar(m.nubes, m.semilla);
    ok(m.nubes.length === m.k,
       'montón '+(i+1)+' «'+m.n+'»: la respuesta que pide es la cantidad de nubes con que se sembró', {k:m.k, nubes:m.nubes.length});
    const r = N.kmedias(pts, m.k);
    /* Pureza: cada grupo que encuentra la máquina tiene que salir de
       UNA sola nube de las que se sembraron. Si no, la respuesta que
       el juego da por buena no es la que el dibujo enseña. */
    const de = {};
    r.asign.forEach((g, j) => { (de[g] = de[g] || new Set()).add(pts[j].grupo); });
    const puro = Object.keys(de).every(g => de[g].size === 1);
    ok(puro, 'montón '+(i+1)+': con '+m.k+', la máquina recupera exactamente los montones sembrados');
    ok(Object.keys(de).length === m.k, 'montón '+(i+1)+': y salen los '+m.k+' que se le pidieron');
  }

  /* La trampa: en el montón único, pedirle tres le devuelve TRES. Es
     lo que el juego promete enseñar, así que se comprueba. */
  const t = montones.find(x => x.trampa);
  ok(!!t && t.k === 1, 'hay un montón que es UNO solo, y es el que enseña la trampa');
  const ptsT = N.generar(t.nubes, t.semilla);
  for(const k of [2,3,4]){
    const r = N.kmedias(ptsT, k);
    const distintos = new Set(r.asign).size;
    ok(distintos === k, 'y pidiéndole '+k+' grupos donde hay uno, te da '+k, distintos);
  }
  ok(t.ojo, 'y la pantalla lo dice con todas las letras en vez de dejarlo pasar');

  /* Y jugando: pedir el número que no es NO pasa de nivel. */
  await p.locator('#velo-ini .bt-p').click();
  await p.waitForTimeout(250);
  await p.evaluate(() => window.__j3d.pedirK(4));
  await p.locator('#bt-agrupar').click();
  await p.waitForTimeout(2600);
  await p.evaluate(() => window.__j3d.listo());
  await p.waitForTimeout(250);
  const e = await p.evaluate(() => ({e:window.__j3d.estado(),
    av:document.getElementById('aviso').textContent}));
  ok(e.e.nivel === 0 && /no son|por en medio/i.test(e.av),
     'pidiendo 4 donde hay 2, no lo da por bueno', e.av);
  await p.close();
}

/* ============================================================
   4 · El Sesgo a la Vista: a quién le falla, y por qué
   ============================================================ */
async function probarSesgo(nav){
  console.log('\n⚖️ El Sesgo a la Vista · el sesgo no se cuenta, se produce');
  const p = await abrir(nav, 'juego-sesgo-3d.html', true);
  const d = await p.evaluate(() => ({
    cultivos: window.__j3d.cultivos,
    forastero: window.__j3d.forastero,
    retos: window.__j3d.retos.map(r => ({n:r.n, forastero:!!r.forastero, meta:r.metaBien, ojo:!!r.ojo})),
    ejemplos: window.__j3d.ejemplos(),
    prueba: window.__j3d.prueba()
  }));
  ok(d.cultivos.length === 5, 'cinco cultivos que se pueden encender y apagar', d.cultivos.length);
  ok(d.retos.length === 4, 'y cuatro retos', d.retos.length);

  const ej = d.ejemplos, pr = d.prueba;
  function correr(excluidos, prueba){
    const ent = ej.filter(e => !excluidos.includes(e.grupo));
    let bien = 0; const falla = {};
    for(const q of prueba){
      const v = ent[N.vecino(q, ent)];
      if(v.clase === q.clase) bien++; else falla[q.grupo] = (falla[q.grupo]||0) + 1;
    }
    return {bien, total:prueba.length, falla};
  }
  const todos = correr([], pr);
  ok(todos.bien === pr.length, 'con los cinco entrenados no falla ni una hoja', todos);

  /* La lección del juego: quitar un cultivo le hace fallar A ESE
     cultivo, y siempre. Si esto dejara de pasar, el reto del plátano
     seguiría en pantalla contando algo que ya no ocurre. */
  const porCultivo = {};
  pr.forEach(q => { porCultivo[q.grupo] = (porCultivo[q.grupo]||0) + 1; });
  for(const c of d.cultivos){
    const r = correr([c.clave], pr);
    ok((r.falla[c.clave]||0) > 0,
       'sin '+c.nombre+', el detector le falla al '+c.nombre, r.falla);
    ok(Object.keys(r.falla).every(g => g === c.clave),
       'y SOLO a ese: a los demás les sigue acertando', r.falla);
  }
  const platano = correr(['platano'], pr);
  ok((platano.falla.platano||0) === porCultivo.platano,
     'y al plátano le falla las '+porCultivo.platano+' hojas, no alguna suelta', platano.falla);
  /* Y le falla para el LADO que cuenta el juego: le dice enfermo al
     sano. Sin esto, el aviso del productor de plátano sería un
     adorno. */
  const ent4 = ej.filter(e => e.grupo !== 'platano');
  const sanos = pr.filter(q => q.grupo === 'platano' && q.clase === 0);
  const dichos = sanos.map(q => ent4[N.vecino(q, ent4)].clase);
  ok(sanos.length > 0 && dichos.every(c => c === 1),
     'y a las hojas de plátano SANAS les dice «enferma», que es lo que arruina al productor', dichos);
  ok(d.retos[2].ojo, 'y la pantalla explica de quién es la culpa: de quien eligió los ejemplos');

  /* El cuarto reto: el cultivo que no está en ningún chip. Se elija lo
     que se elija, le falla — y eso también hay que comprobarlo, porque
     es lo que el juego promete que NO tiene arreglo. */
  ok(d.retos[3].forastero, 'el cuarto reto trae un cultivo que no está en ningún chip');
  const prMango = [];
  const nubesMango = await p.evaluate(() => {
    const F = window.__j3d.forastero;
    return [{clase:0, grupo:F.clave, centro:[F.x, F.s, 0], radio:[0.07,0.08,0.15], n:3},
            {clase:1, grupo:F.clave, centro:[F.x, F.s+0.35, 0], radio:[0.07,0.08,0.15], n:3}];
  });
  N.generar(nubesMango, 7703).forEach(q => prMango.push(q));
  const conTodo = correr([], prMango);
  ok(conTodo.bien < prMango.length,
     'y con los CINCO encendidos le sigue fallando: no hay elección que lo arregle',
     conTodo.bien+' de '+prMango.length);
  ok(d.retos[3].ojo, 'y lo dice, en vez de dejar creer que eligiendo mejor se arregla');

  /* Y jugando: con un solo cultivo, el detector se hunde. */
  await p.locator('#velo-ini .bt-p').click();
  await p.waitForTimeout(250);
  await p.evaluate(() => window.__j3d.elegir(['maiz']));
  await p.locator('#bt-entrenar').click();
  await p.waitForTimeout(200);
  await p.locator('#bt-probar').click();
  await p.waitForTimeout(400);
  const e = await p.evaluate(() => window.__j3d.estado());
  ok(e.ultimo && e.ultimo.bien === correr(['frijol','cafe','platano','yuca'], pr).bien,
     'entrenado solo con maíz, la pantalla da la misma nota que la sonda',
     {juego:e.ultimo && e.ultimo.bien, sonda:correr(['frijol','cafe','platano','yuca'], pr).bien});
  await p.close();
}

/* ============================================================
   5 · ¿Aprendió o se lo memorizó?
   ============================================================ */
async function probarMemorizo(nav){
  console.log('\n🧠 ¿Aprendió o se lo memorizó? · la prueba con ejemplos que nunca vio');
  const p = await abrir(nav, 'juego-memorizo-3d.html', true);
  const d = await p.evaluate(() => ({
    KS: window.__j3d.KS,
    tandas: window.__j3d.tandas.map(t => ({n:t.n, meta:t.meta, nubesEj:t.nubesEj, semEj:t.semEj,
      traidores:t.traidores, nubesPr:t.nubesPr, semPr:t.semPr}))
  }));
  ok(d.tandas.length === 3, 'trae las tres tandas', d.tandas.length);
  ok(d.KS.every(k => k % 2 === 1), 'y todos los números de vecinos son impares: sin empates que desempatar', d.KS);

  for(let i=0;i<d.tandas.length;i++){
    const t = d.tandas[i];
    const ej = N.generar(t.nubesEj, t.semEj).concat(t.traidores.map(x =>
      ({x:x.x, y:x.y, z:x.z, clase:x.clase, grupo:x.grupo, traidor:true})));
    ej.forEach((q, j) => { q.i = j; });
    const pr = N.generar(t.nubesPr, t.semPr);
    const ya = k => ej.filter(q => N.knn(q, ej, k) === q.clase).length;
    const nuevo = k => pr.filter(q => N.knn(q, ej, k) === q.clase).length;

    ok(t.traidores.length >= 4, 'tanda '+(i+1)+' «'+t.n+'»: trae ejemplos mal etiquetados a propósito', t.traidores.length);
    /* La trampa: con un vecino saca el 100 % de los que ya vio. Eso no
       es un truco del juego, es lo que pasa —el más cercano a cada
       ejemplo es él mismo— y es toda la lección. */
    ok(ya(1) === ej.length, 'tanda '+(i+1)+': con 1 vecino acierta TODOS los que ya vio', ya(1)+'/'+ej.length);
    ok(nuevo(1) < t.meta, 'tanda '+(i+1)+': y con los nuevos se queda por debajo de la meta',
       {nuevo:nuevo(1)+'/'+pr.length, meta:t.meta});
    /* Y la meta tiene que ser alcanzable con los mandos que hay: si no,
       el juego le estaría pidiendo al alumno un imposible. */
    const alcanzan = d.KS.filter(k => nuevo(k) >= t.meta);
    ok(alcanzan.length > 0, 'tanda '+(i+1)+': hay números de vecinos que SÍ llegan a la meta', alcanzan);
    ok(!alcanzan.includes(1), 'tanda '+(i+1)+': y memorizando no se llega nunca');
    /* Al subir los vecinos, la nota de los que ya vio BAJA: es la otra
       mitad de la lección y se puede leer en pantalla. */
    const mejorK = alcanzan[0];
    ok(ya(mejorK) < ya(1),
       'tanda '+(i+1)+': el modelo que sí aprende saca MENOS en los que ya conocía',
       {con1:ya(1), ['con'+mejorK]:ya(mejorK)});
  }
  /* La tanda desigual trae además el otro extremo: con demasiados
     vecinos se mira media nube y vuelve a fallar. */
  const t2 = d.tandas[1];
  const ej2 = N.generar(t2.nubesEj, t2.semEj).concat(t2.traidores.map(x =>
    ({x:x.x, y:x.y, z:x.z, clase:x.clase, grupo:x.grupo, traidor:true})));
  ej2.forEach((q, j) => { q.i = j; });
  const pr2 = N.generar(t2.nubesPr, t2.semPr);
  const conMax = pr2.filter(q => N.knn(q, ej2, d.KS[d.KS.length-1]) === q.clase).length;
  ok(conMax < t2.meta, 'y con demasiados vecinos también se falla: ni tan poco ni tanto',
     {con:d.KS[d.KS.length-1], nuevo:conMax+'/'+pr2.length, meta:t2.meta});

  /* Y en pantalla: la nota de los nuevos está TAPADA hasta examinarla.
     Si se viera mientras se ajusta, el juego sería «mueve hasta que el
     número suba», que es el vicio que viene a enseñar a evitar. */
  await p.locator('#velo-ini .bt-p').click();
  await p.waitForTimeout(250);
  const tapada = await p.evaluate(() => ({
    txt: document.getElementById('n-nuevo').textContent,
    clase: document.querySelector('.nota.nuevo').className,
    ya: document.getElementById('n-ya').textContent
  }));
  ok(tapada.txt === '?' && /tapada/.test(tapada.clase),
     'la nota de los que nunca vio está tapada mientras se ajusta', tapada);
  ok(/^\d+\/\d+$/.test(tapada.ya), 'y la de los que ya vio se ve desde el principio', tapada.ya);
  await p.locator('#bt-examinar').click();
  await p.waitForTimeout(400);
  const tras = await p.evaluate(() => ({e:window.__j3d.estado(),
    txt:document.getElementById('n-nuevo').textContent}));
  ok(tras.e.examenes === 1 && tras.txt !== '?', 'al examinarla sale, y gasta un examen', tras);
  const tanda0 = d.tandas[0];
  const ejA = N.generar(tanda0.nubesEj, tanda0.semEj).concat(tanda0.traidores.map(x =>
    ({x:x.x, y:x.y, z:x.z, clase:x.clase, grupo:x.grupo, traidor:true})));
  ejA.forEach((q, j) => { q.i = j; });
  const prA = N.generar(tanda0.nubesPr, tanda0.semPr);
  ok(tras.e.ultima.nuevo === prA.filter(q => N.knn(q, ejA, 1) === q.clase).length,
     'y la nota que enseña es la que sale de contar', tras.e.ultima);
  await p.close();
}

/* ============================================================
   6 · El Robot que Aprende Probando
   ============================================================ */
async function probarRefuerzo(nav){
  console.log('\n🤖 El Robot que Aprende Probando · nadie le dice el camino');
  const p = await abrir(nav, 'juego-refuerzo-3d.html', true);
  const patios = await p.evaluate(() => window.__j3d.patios.map(x => ({
    n:x.n, an:x.an, al:x.al, inicio:x.inicio, meta:x.meta, hoyos:x.hoyos, oro:x.oro, plata:x.plata
  })));
  ok(patios.length === 3, 'trae los tres patios', patios.length);
  for(const q of patios){
    ok(!q.hoyos.some(h => (h[0]===q.inicio[0] && h[1]===q.inicio[1]) || (h[0]===q.meta[0] && h[1]===q.meta[1])),
       q.n+': ni la salida ni la meta son un hoyo');
    /* Que la meta se pueda alcanzar sin pasar por un hoyo: un patio sin
       salida haría al robot probar para siempre y el alumno creería que
       el juego está roto. */
    ok(hayCamino(q), q.n+': hay camino de la salida a la meta sin caer en un hoyo');
  }

  /* Lo que de verdad importa: que a fuerza de intentos el robot acabe
     yendo SOLO. Se entrena dentro de la página con su propio código y
     se le pregunta por el camino sin azar. */
  await p.locator('#velo-ini .bt-p').click();
  await p.waitForTimeout(250);
  for(let i=0;i<patios.length;i++){
    const q = patios[i];
    const r = await p.evaluate(({i, n}) => {
      window.__j3d.irA(i);
      window.__j3d.entrenar(n);
      const c = window.__j3d.caminoSolo();
      return {fin:c.fin, pasos:c.ruta.length-1, e:window.__j3d.estado()};
    }, {i, n:q.oro});
    ok(r.fin === 'llegó', q.n+': con '+q.oro+' intentos (la marca de oro) ya va solo hasta la meta', r);
    const minimo = Math.abs(q.meta[0]-q.inicio[0]) + Math.abs(q.meta[1]-q.inicio[1]);
    ok(r.pasos >= minimo, q.n+': y el camino que encontró no es más corto que el más corto posible',
       {suyo:r.pasos, minimo:minimo});
    ok(r.e.caidas >= 0 && r.e.intentos === q.oro, q.n+': y la cuenta de intentos es la que se le pidió', r.e);
  }
  /* Sin entrenar no va: si fuera ya al principio, el juego no estaría
     enseñando nada. */
  const crudo = await p.evaluate(() => {
    window.__j3d.irA(0);
    return window.__j3d.caminoSolo().fin;
  });
  ok(crudo !== 'llegó', 'y recién nacido NO va solo: el camino sale de probar', crudo);
  /* Olvidar borra de verdad: el suelo vuelve a estar plano. */
  const olvido = await p.evaluate(() => {
    window.__j3d.irA(1);
    window.__j3d.entrenar(30);
    const antes = window.__j3d.valor(0, 0);
    window.__j3d.olvidar();
    return {antes:antes, despues:window.__j3d.valor(0, 0), e:window.__j3d.estado()};
  });
  /* `antes` puede ser NEGATIVO y está bien: cada paso cuesta un
     poquito, así que al principio todas las baldosas valen menos que
     cero. Lo que se comprueba es que valían ALGO y que después no
     valen nada. */
  ok(olvido.antes !== 0 && olvido.despues === 0 && olvido.e.intentos === 0,
     'y «que olvide» le borra de verdad lo aprendido', olvido);
  await p.close();
}
/* Camino de la salida a la meta esquivando los hoyos, por anchura. */
function hayCamino(q){
  const hoyo = (x, z) => q.hoyos.some(h => h[0]===x && h[1]===z);
  const visto = {}, cola = [q.inicio];
  visto[q.inicio.join()] = 1;
  while(cola.length){
    const [x, z] = cola.shift();
    if(x === q.meta[0] && z === q.meta[1]) return true;
    for(const [dx, dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const nx = x+dx, nz = z+dz;
      if(nx<0 || nz<0 || nx>=q.an || nz>=q.al) continue;
      if(hoyo(nx, nz) || visto[[nx,nz].join()]) continue;
      visto[[nx,nz].join()] = 1;
      cola.push([nx, nz]);
    }
  }
  return false;
}

/* ============================================================
   La misión: que el parque esté y que los juegos no le toquen
   el progreso al alumno
   ============================================================ */
async function probarMision(nav){
  console.log('\n🧪 La misión que aloja el parque');
  const src = fs.readFileSync(path.join(RAIZ, DIR, 'como-aprende-una-maquina.html'), 'utf8');
  ok(/<div class="sec" id="s-juegos3d"/.test(src), 'la misión tiene la sección del Parque de Juegos 3D');
  ok(/data-s="s-juegos3d"/.test(src), 'y su pestaña para llegar');
  ok(src.indexOf('id="s-juegos3d"') < src.indexOf('id="s-recursos"'),
     'y va antes de Recursos, que es donde el alumno la busca');
  for(const j of JUEGOS){
    ok(new RegExp('href="'+j+'"').test(src), 'la tarjeta de '+G.nombre(j)+' enlaza a su juego');
  }
  const js = fs.readFileSync(path.join(RAIZ, DIR, 'js/como-aprende-una-maquina.js'), 'utf8');
  ok(/function abrirSeccionDelEnlace/.test(js),
     'y al volver de un juego, la misión abre el Parque en vez de la primera sección');

  /* Las otras tres misiones de la ruta llevan al mismo parque: es UNO
     para las cuatro. Copiarlo a cada una habría repartido el avance
     entre cuatro parques con el mismo nombre. */
  for(const otra of ['misiones/1ciclo-que-es-la-ia/que-es-la-ia.html',
                     'misiones/2y3ciclo-historia-ia/historia-ia.html',
                     'misiones/3ciclo-ia-generativa/ia-generativa.html']){
    const s = fs.readFileSync(path.join(RAIZ, otra), 'utf8');
    ok(/como-aprende-una-maquina\.html#s-juegos3d/.test(s),
       path.basename(otra)+': lleva al Parque de la ruta');
    ok(!/id="s-juegos3d"/.test(s), path.basename(otra)+': y NO tiene un parque propio que partiera el avance');
  }

  /* Que un juego no le borre al alumno el XP de la misión: se abre la
     misión, se guarda su progreso, se juega y se vuelve a mirar. */
  /* Las dos páginas comparten contexto A PROPÓSITO: es el mismo
     navegador del alumno, con el mismo almacén, que es justo donde se
     verían las pisadas de un juego sobre el progreso de la misión. */
  const ctx = await nav.newContext({ viewport:{width:412, height:820} });
  const p = await ctx.newPage();
  await p.addInitScript(lib.STUB);
  await p.route('**cdnjs.cloudflare.com/**', r => r.abort());
  await p.goto(BASE + 'como-aprende-una-maquina.html', { waitUntil:'domcontentloaded' });
  await p.waitForTimeout(500);
  const llaves = await p.evaluate(() => {
    const r = {};
    for(let i=0;i<localStorage.length;i++){
      const k = localStorage.key(i);
      if(k.indexOf('j3d_') !== 0) r[k] = localStorage.getItem(k);
    }
    return r;
  });
  const p2 = await ctx.newPage();
  await p2.addInitScript(lib.STUB);
  await p2.route('**cdnjs.cloudflare.com/**', r => r.abort());
  await p2.goto(BASE + 'juego-separador-3d.html', { waitUntil:'domcontentloaded' });
  await p2.waitForTimeout(400);
  await p2.evaluate(() => { window.__j3d.poner(0, 0, 0); window.__j3d.listo(); });
  await p2.waitForTimeout(300);
  const despues = await p2.evaluate(() => {
    const r = {};
    for(let i=0;i<localStorage.length;i++){
      const k = localStorage.key(i);
      if(k.indexOf('j3d_') !== 0) r[k] = localStorage.getItem(k);
    }
    return r;
  });
  ok(JSON.stringify(llaves) === JSON.stringify(despues),
     'jugar no le toca ni una llave del progreso de la misión',
     {antes:Object.keys(llaves), despues:Object.keys(despues)});
  const suya = await p2.evaluate(() => localStorage.getItem('j3d_separador_v1'));
  ok(!!suya && /estrellas/.test(suya), 'y su avance sí se guarda, en su propia llave', suya);
  await p2.close();
  await p.close();
  await ctx.close();
}

/* ============================================================ */
(async () => {
  revisarFuente();
  const nav = await abrirNavegador();
  try{
    await probarSeparador(nav);
    await probarVecino(nav);
    await probarGrupos(nav);
    await probarSesgo(nav);
    await probarMemorizo(nav);
    await probarRefuerzo(nav);
    await probarMision(nav);
    await G.guardianes(nav);
  } finally {
    await nav.close();
  }
  M.resumen();
})();
