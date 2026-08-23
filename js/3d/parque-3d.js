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

function cerrar(id){
  var v = document.getElementById(id);
  if(v) v.classList.remove('ver');
}
function abrir(id){
  var v = document.getElementById(id);
  if(v) v.classList.add('ver');
}

window.Parque3D = {
  CDN3D: CDN3D, PLAZO: PLAZO,
  cargar3D: cargar3D, arrancar: arrancar, quitarCarga: quitarCarga,
  alTocar: alTocar, vigilarHueco: vigilarHueco, ajustarVelos: ajustarVelos,
  respiro: respiro, cerrar: cerrar, abrir: abrir
};

/* Los velos se cierran desde atributos `onclick` del HTML, así que
   `cerrar` tiene que existir suelto. */
window.cerrar = cerrar;
})();
