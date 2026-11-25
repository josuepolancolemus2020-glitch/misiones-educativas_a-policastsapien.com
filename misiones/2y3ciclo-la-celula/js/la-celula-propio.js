/* ============================================================
   M.E.T.A.S · Misión La Célula · lo que es solo de esta misión
   ------------------------------------------------------------
   Lo común a todas las misiones está en js/motor-mision.js y lo que
   esta misión dice y pregunta está en js/contenido.js. Aquí queda el
   código que es de La Célula y de ninguna otra:

   · su laboratorio (explorar las partes de la célula).

   La prueba de pensamiento crítico ya no está aquí: la arma, la pinta y
   la imprime el motor (js/motor-mision.js) con el banco de contenido.js.

   Este archivo antes se llamaba la-celula.js y lo traía todo. Lleva
   otro nombre a propósito: un teléfono que abra la página guardada de
   antes pide la-celula.js, no lo encuentra en la red y usa su copia
   guardada, que es la versión completa de antes. Así nunca se mezcla
   la página vieja con el código nuevo.
   ============================================================ */

// ===================== LABORATORIO DE LA CÉLULA =====================
let labParte='nucleo',labAspecto='estructura';
function labShowParte(parteKey){labParte=parteKey;updateLabDisplay();document.querySelectorAll('.lab-cont-btn').forEach(b=>b.classList.remove('active-pri'));const btn=document.querySelector(`[data-parte="${parteKey}"]`);if(btn)btn.classList.add('active-pri');if(typeof sfx==='function')sfx('click');}
function labShowAspecto(aspectoKey){labAspecto=aspectoKey;updateLabDisplay();document.querySelectorAll('.lab-asp-btn').forEach(b=>b.classList.remove('active-sec'));const btn=document.querySelector(`[data-aspecto="${aspectoKey}"]`);if(btn)btn.classList.add('active-sec');if(typeof sfx==='function')sfx('click');}
function updateLabDisplay(){const data=parteData[labParte];const asp=data[labAspecto];document.getElementById('lab-sentence').innerHTML=`🔬 Explorando: <strong>${data.nombre}</strong> → <strong>${asp.title}</strong>`;document.getElementById('lab-display').innerHTML=`<div class="lab-cont-header">${data.icon} ${data.nombre}</div><div class="lab-asp-title">${asp.title}</div><div class="lab-asp-info">${asp.info}</div>`;}
MotorMisiones.registrarLaboratorio(function(){
  updateLabDisplay();
  document.querySelector('[data-parte="nucleo"]')?.classList.add('active-pri');
  document.querySelector('[data-aspecto="estructura"]')?.classList.add('active-sec');
});
