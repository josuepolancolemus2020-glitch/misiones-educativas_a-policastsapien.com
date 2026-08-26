/* ============================================================
   M.E.T.A.S · El andamio de los juegos 3D
   ------------------------------------------------------------
   Todo lo que los juegos 3D hacen IGUAL: bajar el motor de
   dibujo, levantar el telón cuando llega, atender los toques del
   dedo, vigilar que el lienzo no se salga de su hueco y apretar
   los paneles que no caben.

   Está aquí porque estuvo COPIADO doce veces. Cuando el lienzo se
   sentó encima de los botones de responder hubo que arreglarlo en
   doce archivos; el `touch-action`, en siete; el centrado de los
   paneles, en doce. Cada juego nuevo era una copia más y una
   ocasión más de olvidar una.

   Un juego lo carga así, antes de su propio <script>:

     <script src="../../js/3d/parque-3d.js"></script>

   y se atiene a tres nombres del HTML:

     #velo-carga   el telón de «Preparando el 3D…»
     #velo-red     la pantalla de «hace falta internet la primera vez»
     #lienzo       el hueco del dibujo

   El telón y esa pantalla van ESCRITOS en el HTML de cada juego, no
   los pinta este archivo: tienen que estar puestos antes de que
   corra una sola línea de JavaScript. Un telón que aparece cuando
   el JS ya arrancó llega tarde justo el rato en que hace falta.
   ============================================================ */
(function(){
'use strict';

var CDN3D = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
/* El plazo para rendirse. La señal mala no siempre FALLA: muchas
   veces se queda colgada y no contesta nunca, y entonces `onerror`
   no salta. Sin plazo, el telón se quedaba puesto para siempre, sin
   aviso y sin salida. */
var PLAZO = 20000;

/* El telón se levanta cuando el motor ya está —o cuando se sabe que
   no va a llegar—, nunca antes: lo que hay detrás no funciona sin
   él. Sin esto, el alumno impaciente toca «Empezar» mientras
   Three.js viene bajando, el juego revienta por dentro —`armar()`
   sin escena— y se queda en una pantalla muerta: ni pregunta, ni
   botones, ni aviso. Con buena señal no se nota nunca; con la señal
   del aula, pasa siempre. */
function quitarCarga(){
  var v = document.getElementById('velo-carga');
  if(v) v.classList.remove('ver');
}

/* Baja Three.js r128 del CDN. Primero mira si ya está puesto: eso es
   lo que permite probar los juegos sin internet —la sonda le pone un
   Three.js de mentira— y lo que dejaría guardar mañana una copia
   dentro del sitio sin tocar los juegos. */
function cargar3D(listo, falla){
  if (window.THREE) return listo();
  var yaFue = false;
  function unaVez(fn){ return function(){ if(yaFue) return; yaFue = true; fn(); }; }
  var seRindio = unaVez(falla);
  var plazo = setTimeout(seRindio, PLAZO);
  var s = document.createElement('script');
  s.src = CDN3D;
  s.onload = unaVez(function(){ clearTimeout(plazo); window.THREE ? listo() : falla(); });
  s.onerror = function(){ clearTimeout(plazo); seRindio(); };
  document.head.appendChild(s);
}

/* El arranque completo, que es lo que hacen los doce igual: baja el
   motor, quita el telón y llama al juego; y si no llega, quita el
   telón, cierra la pantalla de bienvenida y enseña la de «hace falta
   internet». Un juego que se queda negro parece roto y no se vuelve
   a abrir. */
function arrancar(montar, veloInicial){
  cargar3D(function(){
    quitarCarga();
    montar();
  }, function(){
    quitarCarga();
    var ini = document.getElementById(veloInicial || 'velo-ini');
    if(ini) ini.classList.remove('ver');
    var red = document.getElementById('velo-red');
    if(red) red.classList.add('ver');
  });
}

/* Los botones de responder se atan al toque Y al clic, y el primero
   que llegue se queda con la jugada. Es cinturón y tirantes: un
   navegador de tableta que no sintetice el clic dejaría al alumno
   con la pregunta en pantalla y sin poder contestarla, que es justo
   lo que pasó. Dos disparos por el mismo dedo no hacen daño: el
   segundo se descarta aquí. */
function alTocar(el, accion){
  var usado = false;
  function una(e){
    if(usado) return;
    usado = true;
    setTimeout(function(){ usado = false; }, 400);
    accion(e);
  }
  el.addEventListener('pointerup', una);
  el.addEventListener('click', una);
}

/* El dibujo sigue al hueco. Sin esto, el lienzo se estira por CSS
   pero su imagen se queda del tamaño viejo y sale achatada; y peor,
   la cámara conserva la proporción vieja y el lienzo se DERRAMA por
   debajo, encima de los botones de responder. `resize` de la ventana
   no basta: lo que cambia es el reparto de la pantalla —aparecen las
   opciones y la franja de abajo crece—, sin que la ventana se mueva
   ni un píxel.

   Se le pasa la función del juego que rehace cámara y lienzo; se ata
   también al `resize` de la ventana, que es el otro camino. */
function vigilarHueco(ajustar){
  window.addEventListener('resize', ajustar);
  if(typeof ResizeObserver === 'undefined') return;
  var cont = document.getElementById('lienzo');
  if(!cont) return;
  new ResizeObserver(function(){ ajustar(); }).observe(cont);
}

/* Mira si el panel cabe. Si no, lo aprieta; y si apretado tampoco,
   enciende el aviso de deslizar. Se podía deslizar desde siempre; lo
   que faltaba era decirlo.

   Se comprueba diez veces por segundo y desde aquí, no desde el
   bucle de dibujo de cada juego: los velos se abren desde muchos
   sitios y engancharlos uno por uno se olvida siempre. */
function ajustarVelos(){
  var velos = document.querySelectorAll('.velo.ver');
  for(var i=0;i<velos.length;i++){
    var v = velos[i], p = v.querySelector('.panel');
    if(!p) continue;
    var hueco = v.clientHeight - 16;
    if(!v.classList.contains('apretado') && p.scrollHeight > hueco) v.classList.add('apretado');
    else if(v.classList.contains('apretado') && p.scrollHeight < hueco - 60) v.classList.remove('apretado');
    var sobra = p.getBoundingClientRect().height > v.clientHeight - 8;
    if(sobra !== v.classList.contains('desliza')) v.classList.toggle('desliza', sobra);
  }
}
setInterval(ajustarVelos, 100);

/* Después de cambiar de pantalla, un respiro antes de aceptar
   toques. En varios juegos lo nuevo sale en los MISMOS píxeles que
   lo viejo —las respuestas donde estaban los ataques, la pregunta
   siguiente donde estaba la anterior—, y el segundo toque de un dedo
   impaciente contestaba algo que el alumno no había visto: le rompía
   la racha o le quitaba segundos.

   Y se VE apagado, que es la otra mitad: un botón encendido que no
   contesta es un teléfono que el niño da por trabado. */
function respiro(cont, ms){
  if(!cont) return;
  cont.style.pointerEvents = 'none';
  cont.style.opacity = '0.45';
  setTimeout(function(){ cont.style.pointerEvents = ''; cont.style.opacity = ''; }, ms || 350);
}

/* El respiro, puesto SOLO. Los velos se abren y se cierran desde
   decenas de sitios y llamar al respiro en cada uno se olvidaba en
   casi todos los juegos (es la misma lección de ajustarVelos). Un
   observador mira la clase de los velos: al ABRIRSE uno, su panel
   respira —el botón del velo cae donde estaba lo de antes—; al
   CERRARSE, respira la franja de mandos —que reaparece con los
   botones en los mismos píxeles donde estaba el botón del velo—.
   El telón de carga cuenta igual: al levantarse, los mandos también
   acaban de nacer bajo el dedo. */
function vigilarRespiro(){
  if(typeof MutationObserver === 'undefined') return;
  function tenia(viejo){ return (' '+(viejo||'')+' ').indexOf(' ver ') >= 0; }
  new MutationObserver(function(cambios){
    cambios.forEach(function(c){
      var el = c.target;
      if(!el.classList || !el.classList.contains('velo')) return;
      var abierto = el.classList.contains('ver');
      if(abierto === tenia(c.oldValue)) return;
      if(abierto) respiro(el.querySelector('.panel'), 380);
      else respiro(document.querySelector('.mandos'), 380);
    });
  }).observe(document.body, {attributes:true, attributeFilter:['class'], subtree:true, attributeOldValue:true});
}

/* Todo botón que quedó atado con `onclick` pelado se re-ata aquí al
   toque Y al clic. La regla es vieja —la tableta que no sintetiza el
   clic dejaba al alumno sin poder ni empezar— pero estaba cumplida
   solo en los botones de responder; los de «Empezar», «Siguiente» y
   los velos seguían con el onclick a secas en catorce juegos.
   Arreglarlo aquí lo arregla en todos, y en los que vengan. */
function atarOnclicks(){
  var lista = document.querySelectorAll('button[onclick]');
  for(var i=0;i<lista.length;i++){
    (function(b){
      var fn = b.onclick;
      if(!fn) return;
      b.onclick = null;
      b.removeAttribute('onclick');
      alTocar(b, function(e){ fn.call(b, e); });
    })(lista[i]);
  }
}

/* ============================================================
   El giro con el dedo, hecho UNA vez
   ------------------------------------------------------------
   Casi todos los juegos quieren lo mismo: arrastrar sobre el
   dibujo gira la figura, y un toque corto (si el juego lo pide)
   es una jugada. Cada juego lo copiaba con sus propios vicios:
   sin capturar el puntero (el ratón soltado fuera dejaba la
   figura pegada al cursor), midiendo solo el arrastre horizontal
   (un arrastre vertical contaba como toque y cazaba lo que
   hubiera debajo), y mezclando dos dedos en una sola variable.

   El juego da sus funciones y esto pone la mecánica:
     alGirar(dx, dy)  → mientras se arrastra, con el paso del dedo
     alToque(e)       → toque corto que no llegó a arrastre
   Devuelve { arrastrando(), reposo() } para que el bucle del juego
   pause su giro automático mientras el dedo manda y un ratito
   después (reposo() da los ms desde el último arrastre). */
function giroConElDedo(alGirar, alToque){
  var l = document.getElementById('lienzo');
  var punt = null, x0 = 0, y0 = 0, ux = 0, uy = 0, movio = false, fin = 0;
  if(!l) return { arrastrando:function(){return false;}, reposo:function(){return 1e9;} };
  l.addEventListener('pointerdown', function(e){
    if(punt !== null) return;
    /* Un toque sobre una chapa o un cartel que flota encima del
       dibujo NO es un toque al dibujo: era la avería de cazar un
       objeto tapado detrás del cartel de la instrucción. */
    if(e.target !== l && e.target.tagName !== 'CANVAS') return;
    punt = e.pointerId; x0 = ux = e.clientX; y0 = uy = e.clientY; movio = false;
    try{ l.setPointerCapture(punt); }catch(err){}
  });
  l.addEventListener('pointermove', function(e){
    if(e.pointerId !== punt) return;
    if(!movio && Math.abs(e.clientX-x0) < 8 && Math.abs(e.clientY-y0) < 8) return;
    movio = true;
    if(alGirar) alGirar(e.clientX-ux, e.clientY-uy, e);
    ux = e.clientX; uy = e.clientY;
  });
  function soltar(e){
    if(e.pointerId !== punt) return;
    punt = null;
    if(movio){ fin = Date.now(); }
    else if(alToque && e.type === 'pointerup') alToque(e);
  }
  l.addEventListener('pointerup', soltar);
  l.addEventListener('pointercancel', soltar);
  return {
    arrastrando: function(){ return punt !== null && movio; },
    reposo: function(){ return punt !== null ? 0 : Date.now() - fin; }
  };
}

/* Tirar de verdad un objeto 3D: geometrías y materiales incluidos.
   `remove()` solo lo saca del árbol; los buffers se quedan vivos en
   la memoria de la tarjeta, y en un teléfono modesto una sesión
   larga —que es justo lo que se quiere— acababa comiéndosela. */
function tirar(obj){
  if(!obj) return;
  var lista = [];
  (function anda(o){ (o.children||[]).slice().forEach(anda); lista.push(o); })(obj);
  lista.forEach(function(o){
    if(o.geometry && o.geometry.dispose) o.geometry.dispose();
    if(o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(function(m){
      if(m && m.dispose) m.dispose();
    });
  });
  if(obj.parent) obj.parent.remove(obj);
}

function cerrar(id){
  var v = document.getElementById(id);
  if(v) v.classList.remove('ver');
}
function abrir(id){
  var v = document.getElementById(id);
  if(v) v.classList.add('ver');
}

/* ============================================================
   La letra se agranda — Aa
   ------------------------------------------------------------
   Todo el texto de los juegos está en rem, así que agrandar la
   raíz agranda pregunta, opciones y paneles de una vez; el hueco
   del dibujo se reacomoda solo (vigilarHueco) y los paneles que
   dejen de caber se aprietan solos (ajustarVelos).

   El tamaño se guarda UNA vez para los dieciocho juegos
   (j3d_letra_v1), como el retoque del proyector en las lecturas:
   el alumno que necesita letra grande la necesita en todos, no
   va a pedirla juego por juego. */
var LETRA_LLAVE = 'j3d_letra_v1';
var LETRAS = [100, 112, 124, 136];
var letraPaso = 0;
try{ letraPaso = Math.min(parseInt(localStorage.getItem(LETRA_LLAVE),10)||0, LETRAS.length-1); }catch(e){}
function aplicarLetra(){
  document.documentElement.style.fontSize = (16*LETRAS[letraPaso]/100)+'px';
}
function cicloLetra(){
  letraPaso = (letraPaso+1) % LETRAS.length;
  aplicarLetra();
  try{ localStorage.setItem(LETRA_LLAVE, String(letraPaso)); }catch(e){}
  var bt = document.getElementById('j3d-letra');
  if(bt) bt.setAttribute('aria-label', 'Tamaño de letra '+(letraPaso+1)+' de '+LETRAS.length);
  aviso(letraPaso ? 'Letra: '+['normal','grande','muy grande','enorme'][letraPaso] : 'Letra: normal');
}

/* ============================================================
   Pantalla completa — ⛶
   ------------------------------------------------------------
   El juego entero, sin la barra del navegador: en un teléfono de
   5 pulgadas esa barra es un dedo de dibujo. Si el navegador no
   sabe (iPhone viejo), el botón ni aparece: un botón que no hace
   nada enseña a no tocar botones. */
function pantallaCompleta(){
  var d = document;
  if(d.fullscreenElement){ if(d.exitFullscreen) d.exitFullscreen().catch(function(){}); }
  else if(d.documentElement.requestFullscreen){
    d.documentElement.requestFullscreen().catch(function(){});
  }
}

/* Los dos botones se montan solos en la franja de arriba de cada
   juego: es el andamio, no se copia en dieciocho archivos. */
function montarMandosComunes(){
  var top = document.querySelector('.top');
  if(!top) return;
  var aa = document.createElement('button');
  aa.id = 'j3d-letra'; aa.className = 'top-bt'; aa.type = 'button';
  aa.textContent = 'Aa';
  aa.setAttribute('aria-label', 'Tamaño de letra');
  alTocar(aa, cicloLetra);
  top.appendChild(aa);
  if(document.documentElement.requestFullscreen){
    var fs = document.createElement('button');
    fs.id = 'j3d-full'; fs.className = 'top-bt'; fs.type = 'button';
    fs.textContent = '⛶';
    fs.setAttribute('aria-label', 'Pantalla completa');
    alTocar(fs, pantallaCompleta);
    top.appendChild(fs);
    document.addEventListener('fullscreenchange', function(){
      fs.classList.toggle('activo', !!document.fullscreenElement);
    });
  }
  aplicarLetra();
}

/* ============================================================
   El festejo — confeti, racha y avisos
   ------------------------------------------------------------
   Acertar tiene que SENTIRSE: una lluvia breve de confeti y la
   racha creciendo es lo que hace que el alumno quiera una ronda
   más. Sin sonido, a propósito: en un aula hay cuarenta teléfonos,
   y cuarenta teléfonos pitando no ayudan a nadie.

   La capa no se puede tocar (pointer-events:none) y vive por
   debajo de los velos: jamás le roba un toque a un botón. Con
   «reducir movimiento» puesto en el teléfono, el confeti no sale. */
var rachaN = 0, rachaChip = null, toastEl = null;
function sinMovimiento(){
  try{ return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){ return false; }
}
function confeti(fuerte){
  if(sinMovimiento()) return;
  var capa = document.createElement('div');
  capa.className = 'j3d-confeti';
  var colores = ['#ffd54f','#4a90d9','#27ae60','#e07a52','#a06fd6','#37b6c4'];
  var n = fuerte ? 26 : 14;
  for(var i=0;i<n;i++){
    var p = document.createElement('i');
    p.style.left = (18+Math.random()*64)+'%';
    p.style.background = colores[i % colores.length];
    p.style.animationDelay = (Math.random()*0.18)+'s';
    p.style.animationDuration = (0.7+Math.random()*0.5)+'s';
    p.style.setProperty('--vx', (Math.random()*2-1).toFixed(2));
    if(i%3===0) p.style.borderRadius = '50%';
    capa.appendChild(p);
  }
  document.body.appendChild(capa);
  setTimeout(function(){ if(capa.parentNode) capa.parentNode.removeChild(capa); }, 1500);
}
function aviso(txt, ms){
  if(!toastEl){
    toastEl = document.createElement('div');
    toastEl.className = 'j3d-toast';
    document.body.appendChild(toastEl);
  }
  toastEl.textContent = txt;
  toastEl.classList.add('ver');
  clearTimeout(toastEl._t);
  toastEl._t = setTimeout(function(){ toastEl.classList.remove('ver'); }, ms || 1500);
}
function pintarRacha(){
  if(!rachaChip){
    rachaChip = document.createElement('div');
    rachaChip.className = 'j3d-racha';
    var l = document.getElementById('lienzo');
    (l || document.body).appendChild(rachaChip);
  }
  if(rachaN >= 2){
    rachaChip.textContent = '🔥 ×'+rachaN;
    rachaChip.classList.add('ver');
    rachaChip.classList.remove('late');
    void rachaChip.offsetWidth;           // reencender la animación
    rachaChip.classList.add('late');
  } else {
    rachaChip.classList.remove('ver');
  }
}
/* Lo llama el juego al ACERTAR. Devuelve la racha, por si el juego
   quiere premiarla; en 3, 5 y 10 seguidas el festejo sube solo. */
function acierto(){
  rachaN++;
  pintarRacha();
  var hito = (rachaN===3 || rachaN===5 || rachaN===10);
  confeti(hito);
  if(hito) aviso(rachaN===3 ? '🔥 ¡Tres seguidas!' : rachaN===5 ? '🔥 ¡Cinco seguidas!' : '🏆 ¡DIEZ seguidas!');
  /* Un toquecito en la mano: celebración física, silenciosa y sin
     archivos. Donde no exista, no pasa nada. */
  try{ if(navigator.vibrate) navigator.vibrate(hito ? 60 : 25); }catch(e){}
  return rachaN;
}
/* Y esto al FALLAR: la racha vuelve a cero sin castigo ni ruido —
   equivocarse es parte de aprender, no algo que suene feo. */
function fallo(){
  rachaN = 0;
  pintarRacha();
}
/* El festejo grande del final (medalla, juego completado). */
function festejarFin(){
  confeti(true);
  setTimeout(function(){ confeti(true); }, 420);
}

/* Los mandos comunes, el re-atado de los onclick y el respiro
   automático se montan en cuanto el andamio carga: los juegos lo
   cargan al final del <body>, así que el HTML ya está entero. */
montarMandosComunes();
atarOnclicks();
vigilarRespiro();

window.Parque3D = {
  CDN3D: CDN3D, PLAZO: PLAZO,
  cargar3D: cargar3D, arrancar: arrancar, quitarCarga: quitarCarga,
  alTocar: alTocar, vigilarHueco: vigilarHueco, ajustarVelos: ajustarVelos,
  respiro: respiro, cerrar: cerrar, abrir: abrir,
  acierto: acierto, fallo: fallo, festejarFin: festejarFin,
  confeti: confeti, aviso: aviso, racha: function(){ return rachaN; },
  giroConElDedo: giroConElDedo, tirar: tirar
};

/* Los velos se cierran desde atributos `onclick` del HTML, así que
   `cerrar` tiene que existir suelto. */
window.cerrar = cerrar;
})();
