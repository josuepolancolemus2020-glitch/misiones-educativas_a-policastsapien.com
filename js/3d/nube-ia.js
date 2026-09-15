/* ============================================================
   M.E.T.A.S · La nube de puntos de la Ruta de la Máquina que
   Aprende
   ------------------------------------------------------------
   Los seis juegos de este parque enseñan cosas distintas, pero
   los seis miran LO MISMO: unos ejemplos colocados en un espacio
   de tres medidas. Ahí está la idea que el papel no puede dar —
   dos cosas se parecen si están CERCA— y ahí están, por tanto,
   las mismas doscientas líneas en los seis archivos si no se
   sacan a un sitio.

   Se sacan por la lección que este proyecto ya pagó dos veces: el
   andamio de los juegos 3D estuvo copiado en doce archivos, y
   cuando el lienzo se sentó encima de los botones hubo que
   arreglarlo en doce sitios; una de las doce copias se quedó sin
   el arreglo y nadie lo notó. Empezar un parque nuevo copiando
   seis veces sería hacerlo a sabiendas.

   Esto NO sustituye a `js/3d/parque-3d.js`: aquel es el andamio
   de TODOS los juegos 3D (el telón, los velos, el respiro, la
   racha); este es el aparato de ESTE parque. Los juegos cargan
   los dos, en ese orden.

   Lo que hay aquí, y por qué cada cosa:

   · `rng` y `generar` — las nubes se SIEMBRAN, no se teclean. Un
     juego con doscientas coordenadas escritas a mano es un juego
     donde nadie puede comprobar si «estos dos grupos se separan»
     es verdad. Sembradas con semilla, la sonda las reproduce
     exactamente y comprueba la afirmación de cada nivel en vez de
     creérsela.
   · `escena` — el cubo, las luces, la cámara que se gira con el
     dedo y los rótulos que flotan. El cubo no es adorno: sin
     paredes, una nube de puntos en el aire no se lee, no se sabe
     dónde está el suelo y girarla marea.
   · `vecino`, `knn`, `kmedias` — las tres cuentas que deciden lo
     que el alumno ve. Viven aquí, en un solo sitio, porque tres
     juegos distintos preguntan por la misma: «¿a cuál se parece
     más?». Si dos juegos contestaran distinto a eso, la ruta se
     estaría contradiciendo a sí misma, que es lo peor que puede
     hacer una pantalla que califica.

   Los rótulos son HTML sobre el lienzo, no texturas: se leen
   nítidos, crecen con el Aa del andamio y no gastan memoria de
   vídeo, que en un teléfono modesto es lo que se acaba primero.
   ============================================================ */
(function(){
'use strict';

/* El cubo va de -LADO a LADO en la pantalla; las medidas del alumno
   van siempre de -1 a 1. Separar las dos escalas es lo que permite
   cambiar el tamaño del dibujo sin tocar una sola cuenta. */
var LADO = 5;

/* ============================================================
   El azar con semilla
   ------------------------------------------------------------
   mulberry32: el mismo que usan las evaluaciones de las misiones.
   Con la misma semilla salen los mismos puntos hoy, mañana y en la
   sonda — que es lo que permite comprobar las cuentas de un juego
   sin abrirlo.
   ============================================================ */
function rng(semilla){
  var s = semilla >>> 0;
  return function(){
    s = (s + 0x6D2B79F5) >>> 0;
    var t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Siembra los ejemplos. Cada nube declara su centro, su radio y
   cuántos ejemplos trae; el resultado son puntos en [-1,1]³ con su
   clase y su grupo.

   El radio es por eje a propósito (un cubito, no una bola): así una
   nube puede ser ancha en una medida y estrecha en otra, que es lo
   que pasa de verdad —los mangos varían mucho de peso y poco de
   color— y es justo lo que hace interesante la frontera. */
function generar(nubes, semilla){
  var az = rng(semilla), pts = [], i, j;
  for(i=0;i<nubes.length;i++){
    var nb = nubes[i];
    var r = nb.radio;
    var rx = (typeof r === 'number') ? r : r[0];
    var ry = (typeof r === 'number') ? r : r[1];
    var rz = (typeof r === 'number') ? r : r[2];
    for(j=0;j<nb.n;j++){
      pts.push({
        x: recorta(nb.centro[0] + (az()*2-1)*rx),
        y: recorta(nb.centro[1] + (az()*2-1)*ry),
        z: recorta(nb.centro[2] + (az()*2-1)*rz),
        clase: nb.clase, grupo: nb.grupo, i: pts.length
      });
    }
  }
  return pts;
}
function recorta(v){ return Math.max(-1, Math.min(1, Math.round(v*1000)/1000)); }

/* ============================================================
   Las tres cuentas que deciden lo que el alumno ve
   ============================================================ */
function dist(a, b){
  var dx = a.x-b.x, dy = a.y-b.y, dz = a.z-b.z;
  return Math.sqrt(dx*dx + dy*dy + dz*dz);
}
/* El vecino más cercano: el índice del ejemplo al que más se
   parece. Es la máquina de la misión de I Ciclo, dicha en una
   frase: le pone el nombre del que tiene más cerca. */
function vecino(p, ejemplos){
  var mejor = -1, md = Infinity;
  for(var i=0;i<ejemplos.length;i++){
    var d = dist(p, ejemplos[i]);
    if(d < md){ md = d; mejor = i; }
  }
  return mejor;
}
/* Y con k vecinos: votan los k más cercanos. El empate lo rompe el
   MÁS CERCANO de todos, nunca el orden de la lista: si lo rompiera
   el orden, mover un ejemplo de sitio en el archivo cambiaría la
   respuesta y el juego dejaría de ser el mismo. */
function knn(p, ejemplos, k){
  var orden = ejemplos.map(function(e, i){ return {i:i, d:dist(p, e), clase:e.clase}; })
                      .sort(function(a,b){ return a.d - b.d || a.i - b.i; });
  var kk = Math.min(k, orden.length), votos = {}, i;
  for(i=0;i<kk;i++) votos[orden[i].clase] = (votos[orden[i].clase]||0) + 1;
  var mejor = orden[0].clase, mv = -1;
  for(i=0;i<kk;i++){
    var c = orden[i].clase;
    if(votos[c] > mv){ mv = votos[c]; mejor = c; }
  }
  return mejor;
}

/* k-medias, SIN azar en el arranque. Los centros de partida son los
   puntos más separados entre sí: así el resultado es el mismo en el
   teléfono del alumno, en el del maestro y en la sonda. Con el
   arranque al azar que trae de fábrica, dos alumnos verían grupos
   distintos con los mismos datos y uno de los dos creería que se
   equivocó. */
function kmedias(pts, k){
  var i, j, c;
  if(!pts.length || k < 1) return {asign:[], centros:[], iter:0};
  var centros = [], medio = {x:0,y:0,z:0};
  for(i=0;i<pts.length;i++){ medio.x+=pts[i].x; medio.y+=pts[i].y; medio.z+=pts[i].z; }
  medio.x/=pts.length; medio.y/=pts.length; medio.z/=pts.length;
  var primero = 0, md = -1;
  for(i=0;i<pts.length;i++){ var d = dist(pts[i], medio); if(d > md){ md = d; primero = i; } }
  centros.push({x:pts[primero].x, y:pts[primero].y, z:pts[primero].z});
  while(centros.length < k){
    var lejos = 0, mejorD = -1;
    for(i=0;i<pts.length;i++){
      var cerca = Infinity;
      for(c=0;c<centros.length;c++) cerca = Math.min(cerca, dist(pts[i], centros[c]));
      if(cerca > mejorD){ mejorD = cerca; lejos = i; }
    }
    centros.push({x:pts[lejos].x, y:pts[lejos].y, z:pts[lejos].z});
  }
  /* Se guarda la foto de cada vuelta. El juego de los grupos la
     reproduce paso a paso para que se VEA cómo los centros se van
     acomodando; sin esto tendría que llevar su propia copia del
     algoritmo, y dos copias del mismo algoritmo acaban contestando
     cosas distintas. Una sola cuenta, y la animación la lee. */
  var asign = pts.map(function(){ return -1; }), iter = 0, cambio = true, pasos = [];
  while(cambio && iter < 40){
    cambio = false; iter++;
    for(i=0;i<pts.length;i++){
      var mejorC = 0, mejorDist = Infinity;
      for(c=0;c<centros.length;c++){
        var dd = dist(pts[i], centros[c]);
        if(dd < mejorDist){ mejorDist = dd; mejorC = c; }
      }
      if(asign[i] !== mejorC){ asign[i] = mejorC; cambio = true; }
    }
    for(c=0;c<centros.length;c++){
      var sx=0, sy=0, sz=0, n=0;
      for(i=0;i<pts.length;i++) if(asign[i]===c){ sx+=pts[i].x; sy+=pts[i].y; sz+=pts[i].z; n++; }
      /* Un centro que se queda sin nadie NO se mueve: llevarlo al
         origen lo pondría en medio de otro grupo y lo partiría en
         dos, y el alumno vería tres grupos donde el dibujo enseña
         dos. Se queda donde estaba y la ronda siguiente decide. */
      if(n){ centros[c] = {x:sx/n, y:sy/n, z:sz/n}; }
    }
    pasos.push({asign:asign.slice(), centros:centros.map(function(q){ return {x:q.x,y:q.y,z:q.z}; })});
  }
  return {asign:asign, centros:centros, iter:iter, pasos:pasos};
}

/* ============================================================
   La escena
   ------------------------------------------------------------
   El cubo con sus tres ejes rotulados. Las paredes no son adorno:
   una nube de puntos flotando sin caja no se lee —no se sabe
   dónde está el suelo— y girarla marea en vez de enseñar.
   ============================================================ */
function escena(cfg){
  cfg = cfg || {};
  var cont = document.getElementById('lienzo');
  var esc = new THREE.Scene();
  var cam = new THREE.PerspectiveCamera(46, cont.clientWidth/Math.max(1,cont.clientHeight), 0.1, 400);
  var rend = new THREE.WebGLRenderer({antialias:true, alpha:true});
  rend.setPixelRatio(Math.min(window.devicePixelRatio||1, 2));
  rend.setSize(cont.clientWidth, cont.clientHeight);
  cont.appendChild(rend.domElement);

  esc.add(new THREE.AmbientLight(0xffffff, 0.72));
  var l1 = new THREE.DirectionalLight(0xffffff, 0.7);  l1.position.set(8, 14, 10);  esc.add(l1);
  var l2 = new THREE.DirectionalLight(0xe0a3ff, 0.3);  l2.position.set(-9, 5, -8);  esc.add(l2);

  var mundo = new THREE.Group();
  esc.add(mundo);

  /* La caja: aristas, no caras. Con caras, los puntos de detrás se
     pierden y el alumno cree que su nube tiene la mitad. */
  var caja = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(LADO*2, LADO*2, LADO*2)),
    new THREE.LineBasicMaterial({color:0x6b4a7a}));
  mundo.add(caja);
  /* El suelo cuadriculado da la referencia que falta al girar. */
  var rej = new THREE.GridHelper(LADO*2, 8, 0xa855c7, 0x4a3358);
  rej.position.y = -LADO;
  mundo.add(rej);

  /* La cámara vive en coordenadas de esfera: girar con el dedo es
     mover dos ángulos, y así nunca se pone del revés ni se aleja
     sola. */
  var giroH = cfg.giroH === undefined ? 0.7 : cfg.giroH;
  var giroV = cfg.giroV === undefined ? 0.42 : cfg.giroV;
  var radio  = cfg.radio || 17;
  var dedo = null, autoGiro = cfg.autoGiro !== false;

  function colocarCamara(){
    cam.position.set(radio*Math.cos(giroV)*Math.sin(giroH),
                     radio*Math.sin(giroV),
                     radio*Math.cos(giroV)*Math.cos(giroH));
    cam.lookAt(0, 0, 0);
  }
  colocarCamara();

  function ajustar(){
    if(!cont.clientHeight) return;
    cam.aspect = cont.clientWidth/cont.clientHeight;
    cam.updateProjectionMatrix();
    rend.setSize(cont.clientWidth, cont.clientHeight);
  }

  /* ---- Los rótulos, en HTML sobre el lienzo ---- */
  var rots = [];
  function rotulo(texto, x, y, z, clase){
    var el = document.createElement('div');
    el.className = 'rot' + (clase ? ' '+clase : '');
    el.innerHTML = texto;
    cont.appendChild(el);
    var r = {el:el, p:new THREE.Vector3(x, y, z)};
    rots.push(r);
    return r;
  }
  function limpiarRotulos(){
    rots.forEach(function(r){ if(r.el.parentNode) r.el.parentNode.removeChild(r.el); });
    rots = [];
  }
  function moverRotulos(){
    var an = cont.clientWidth, al = cont.clientHeight;
    for(var i=0;i<rots.length;i++){
      var r = rots[i];
      var v = r.p.clone();
      mundo.localToWorld(v);
      v.project(cam);
      r.el.style.left = ((v.x*0.5+0.5)*an) + 'px';
      r.el.style.top  = ((-v.y*0.5+0.5)*al) + 'px';
      /* Lo que queda detrás de la cámara se esconde: si no, el
         rótulo del fondo salta al otro lado de la pantalla y
         parece otro punto. */
      r.el.style.display = (v.z > 1 || v.z < -1) ? 'none' : '';
    }
  }

  /* El dedo gira la CÁMARA, no la nube. Es la diferencia que
     importa: los juegos de este parque ponen cosas dentro del cubo
     —un plano, unos centros— y si girara la nube, esas cosas se
     quedarían quietas y el dibujo mentiría. */
  function girar(){
    dedo = Parque3D.giroConElDedo(function(dx, dy){
      giroH -= dx*0.007;
      giroV = Math.max(-1.25, Math.min(1.25, giroV + dy*0.006));
      colocarCamara();
    }, cfg.alToque);
    return dedo;
  }

  function animarCamara(){
    if(dedo && (dedo.arrastrando() || dedo.reposo() < 2500)) return;
    if(!autoGiro) return;
    giroH += 0.0022;
    colocarCamara();
  }

  return {
    esc:esc, cam:cam, rend:rend, mundo:mundo, cont:cont, LADO:LADO,
    ajustar:ajustar, rotulo:rotulo, limpiarRotulos:limpiarRotulos, moverRotulos:moverRotulos,
    girar:girar, animarCamara:animarCamara, colocarCamara:colocarCamara,
    dedo: function(){ return dedo; },
    verAuto: function(v){ autoGiro = v; },
    pintar: function(){ rend.render(esc, cam); }
  };
}

/* Un ejemplo, dibujado. El tamaño sube un poco con el eje que no se
   ve de frente para que la nube tenga profundidad; nada más. */
function esfera(p, color, r){
  var m = new THREE.Mesh(
    new THREE.SphereGeometry(r || 0.28, 14, 10),
    new THREE.MeshLambertMaterial({color:color}));
  m.position.set(p.x*LADO, p.y*LADO, p.z*LADO);
  return m;
}

/* De la medida del alumno (-1..1) al dibujo, y al revés. Las dos en
   un solo sitio: cada juego que hiciera su propia conversión sería
   una ocasión de que un punto y su rótulo no coincidieran. */
function aPantalla(v){ return v*LADO; }
function aMedida(v){ return v/LADO; }

/* En el navegador se cuelga de `window`; en Node no hay `window` y
   pedirlo reventaría antes de llegar al `module.exports` de abajo,
   que es justo por donde entra la sonda. */
if(typeof window !== 'undefined'){
  window.NubeIA = {
    LADO: LADO, rng: rng, generar: generar, dist: dist, vecino: vecino, knn: knn,
    kmedias: kmedias, escena: escena, esfera: esfera, aPantalla: aPantalla, aMedida: aMedida
  };
}

/* La sonda corre este mismo archivo en Node para comprobar las
   cuentas sin abrir el navegador: las cuatro de arriba no tocan el
   DOM ni Three.js a propósito, justamente para eso. */
if(typeof module !== 'undefined' && module.exports){
  module.exports = {rng:rng, generar:generar, dist:dist, vecino:vecino, knn:knn, kmedias:kmedias, LADO:LADO};
}
})();
