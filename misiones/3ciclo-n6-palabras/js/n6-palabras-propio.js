/* ============================================================
   M.E.T.A.S · Misión Las palabras y sus significados · lo que es solo suyo
   ------------------------------------------------------------
   Lo común a todas las misiones está en js/motor-mision.js y lo que
   esta misión dice y pregunta está en js/contenido.js. Aquí queda el
   código que es de esta misión y de ninguna otra:

   · su laboratorio, «la fábrica de palabras».

   Tiene dos paneles.

   En el primero el alumno elige una palabra base y le pone, con
   botones, un prefijo, un sufijo o los dos. El laboratorio escribe la
   palabra que sale, la parte en sus piezas y dice una de dos cosas: que
   es una palabra de uso común, con su significado y un ejemplo, o que
   esa combinación no está en su lista.

   Por qué dice «no está en la lista» y no «no existe»: el laboratorio
   solo conoce las palabras que trae escritas en contenido.js, y en el
   repositorio no hay un diccionario con qué acreditar que una palabra
   no existe. Lo que sí enseña, y es lo que pide el currículo, es que no
   toda combinación de piezas da una palabra y que la que uno arma se
   comprueba en el diccionario antes de usarla.

   En el segundo panel una misma palabra aparece en tres oraciones. El
   alumno toca una y el laboratorio le dice qué significa ahí y qué
   palabras de la oración se lo dijeron: eso es leer por el contexto.

   No es un juego de aciertos: no da XP ni lo quita. Lleva la cuenta de
   las palabras de cada base que el alumno ya encontró, para que busque
   las que le faltan.

   Todo se hace tocando: no hay nada que arrastrar. Y el resultado no
   se dice solo con color: cada aviso lleva su marca (✓ o ✗) y sus
   palabras.

   Los datos (los prefijos, los sufijos, las bases con las palabras que
   salen de cada una, y las oraciones) están en contenido.js, en
   `fabricaPalabras`.
   ============================================================ */

// ===================== LABORATORIO: LA FÁBRICA DE PALABRAS =====================
let fabBase=null;
let fabPre='';
let fabSuf='';
const fabHalladas={};
let fabPalabra=null;
let fabOracion=-1;

function fabDatos(){return typeof fabricaPalabras!=='undefined'&&fabricaPalabras?fabricaPalabras:null;}
function fabBaseDe(id){const d=fabDatos();return (d?d.bases:[]).find(function(b){return b.id===id;})||null;}

/* Cómo queda escrita la palabra con las piezas elegidas, exista o no:
   el prefijo delante (con la forma que pide esa base) y la base ya
   unida a su sufijo, tal como la trae contenido.js. */
function fabEscribe(base,pre,suf){
  const d=fabDatos();
  const cola=suf?(base.conSufijo&&base.conSufijo[suf])||(base.palabra+d.sufijos[suf].txt.replace('-','')):base.palabra;
  const cabeza=pre?(base.prefijoComo&&base.prefijoComo[pre])||d.prefijos[pre].txt.replace('-',''):'';
  return cabeza+cola;
}

function fabBoton(clase,texto,sub,alTocar){
  const b=document.createElement('button');
  b.type='button';
  b.className='fp-op';
  b.setAttribute('aria-pressed','false');
  b.appendChild(document.createTextNode(texto));
  if(sub){const s=document.createElement('small');s.textContent=sub;b.appendChild(s);}
  b.onclick=alTocar;
  if(clase)b.dataset.grupo=clase;
  return b;
}

/* Los botones de las bases y de las palabras del segundo panel se
   pintan desde los datos: una base nueva se escribe en contenido.js y
   aparece sola. */
function fabArma(){
  const d=fabDatos();
  const caja=document.getElementById('fp-bases');
  if(!d||!caja)return;
  caja.innerHTML='';
  d.bases.forEach(function(base){
    const b=fabBoton('base',base.palabra,'',function(){fabEligeBase(base.id);});
    b.dataset.base=base.id;
    caja.appendChild(b);
  });
  const cajaP=document.getElementById('fp-palabras');
  if(cajaP){
    cajaP.innerHTML='';
    d.sentidos.forEach(function(s,i){
      const b=fabBoton('palabra',s.palabra,'',function(){fabEligePalabra(i);});
      b.dataset.palabra=i;
      cajaP.appendChild(b);
    });
  }
}

/* Los prefijos y los sufijos que se ofrecen cambian con la base: cada
   una trae los suyos, y alguno que no le sirve. «Sin prefijo» y «sin
   sufijo» son botones como los demás, para poder quitar una pieza. */
function fabArmaPiezas(){
  const d=fabDatos();
  const caja=document.getElementById('fp-piezas');
  if(!d||!caja)return;
  caja.innerHTML='';
  const base=fabBaseDe(fabBase);
  if(!base)return;
  [['pre','⬅️ Ponle un prefijo (va delante)',base.prefijos,d.prefijos,'Sin prefijo'],
   ['suf','➡️ Ponle un sufijo (va detrás)',base.sufijos,d.sufijos,'Sin sufijo']].forEach(function(g){
    const paso=document.createElement('div');
    paso.className='fp-paso';
    const t=document.createElement('div');
    t.className='fp-paso-t';
    t.textContent=g[1];
    paso.appendChild(t);
    const ops=document.createElement('div');
    ops.className='fp-ops';
    ops.setAttribute('role','group');
    ops.setAttribute('aria-label',g[1]);
    const ninguno=fabBoton(g[0],g[4],'',function(){fabEligePieza(g[0],'');});
    ninguno.dataset.pieza='';
    ops.appendChild(ninguno);
    g[2].forEach(function(id){
      const b=fabBoton(g[0],g[3][id].txt,g[3][id].sig,function(){fabEligePieza(g[0],id);});
      b.dataset.pieza=id;
      ops.appendChild(b);
    });
    paso.appendChild(ops);
    caja.appendChild(paso);
  });
  fabMarca();
}

function fabMarca(){
  document.querySelectorAll('[data-base]').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.base===fabBase?'true':'false');});
  document.querySelectorAll('[data-grupo="pre"]').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.pieza===fabPre?'true':'false');});
  document.querySelectorAll('[data-grupo="suf"]').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.pieza===fabSuf?'true':'false');});
}

function fabEligeBase(id){
  fabBase=id;fabPre='';fabSuf='';
  if(typeof sfx==='function')sfx('click');
  fabArmaPiezas();
  fabPinta();
}

function fabEligePieza(grupo,id){
  if(grupo==='pre')fabPre=id;else fabSuf=id;
  if(typeof sfx==='function')sfx('click');
  fabMarca();
  fabPinta();
}

function fabReinicia(){
  fabBase=null;fabPre='';fabSuf='';
  Object.keys(fabHalladas).forEach(function(k){delete fabHalladas[k];});
  if(typeof sfx==='function')sfx('click');
  const caja=document.getElementById('fp-piezas');
  if(caja)caja.innerHTML='';
  fabMarca();
  fabPinta();
}

function fabPinta(){
  const caja=document.getElementById('lab-display');
  const d=fabDatos();
  if(!caja||!d)return;
  const base=fabBaseDe(fabBase);
  if(!base){
    caja.innerHTML='<div class="lab-asp-title">Arma una palabra</div><div class="lab-asp-info">Elige arriba una <strong>palabra base</strong>. Después ponle un prefijo, un sufijo o los dos, y mira qué sale.</div>';
    return;
  }
  const total=Object.keys(base.salen).length;
  const halladas=fabHalladas[base.id]||(fabHalladas[base.id]={});
  const cuenta=function(){return '<div class="fp-cuenta">Palabras de «'+base.palabra+'» que ya encontraste: <strong>'+Object.keys(halladas).length+' de '+total+'</strong></div>';};
  if(!fabPre&&!fabSuf){
    caja.innerHTML='<div class="fp-palabra">'+base.palabra+'</div>'
      +'<div class="fp-suma">Es la palabra base: todavía no tiene piezas.</div>'
      +'<div class="lab-asp-info">Ponle un prefijo delante, un sufijo detrás o los dos. De «'+base.palabra+'» salen <strong>'+total+' palabras</strong> de uso común con estas piezas: búscalas.</div>'
      +cuenta();
    return;
  }
  const palabra=fabEscribe(base,fabPre,fabSuf);
  const piezas=[];
  if(fabPre)piezas.push('<strong>'+d.prefijos[fabPre].txt+'</strong> ('+d.prefijos[fabPre].sig+')');
  piezas.push('<strong>'+base.palabra+'</strong>');
  if(fabSuf)piezas.push('<strong>'+d.sufijos[fabSuf].txt+'</strong> ('+d.sufijos[fabSuf].sig+')');
  const sale=base.salen[fabPre+'|'+fabSuf];
  let aviso;
  if(sale){
    halladas[fabPre+'|'+fabSuf]=true;
    aviso='<div class="fp-aviso fp-si"><span class="fp-marca">✓ Es una palabra de uso común.</span> '+sale.s+'</div>'
      +'<div class="fp-nota">Ejemplo: «'+sale.ej.replace(/\.$/,'')+'».</div>';
  }else{
    aviso='<div class="fp-aviso fp-no"><span class="fp-marca">✗ «'+palabra+'» no está en la lista de este laboratorio.</span> No toda combinación de piezas da una palabra. Si armas una por tu cuenta, compruébala en el diccionario antes de usarla.</div>';
  }
  caja.innerHTML='<div class="fp-palabra">'+palabra+'</div>'
    +'<div class="fp-suma">'+piezas.join(' + ')+'</div>'
    +aviso+cuenta();
}

/* ── Segundo panel: una palabra, varios significados ── */
function fabEligePalabra(i){
  fabPalabra=i;fabOracion=-1;
  if(typeof sfx==='function')sfx('click');
  document.querySelectorAll('[data-palabra]').forEach(function(b){b.setAttribute('aria-pressed',+b.dataset.palabra===i?'true':'false');});
  const d=fabDatos();
  const caja=document.getElementById('fp-oraciones');
  if(!d||!caja)return;
  caja.innerHTML='';
  const t=document.createElement('div');
  t.className='fp-paso-t';
  t.textContent='Toca una oración: ¿qué significa «'+d.sentidos[i].palabra+'» ahí?';
  caja.appendChild(t);
  const ops=document.createElement('div');
  ops.className='fp-ops fp-ops-col';
  ops.setAttribute('role','group');
  ops.setAttribute('aria-label','Oraciones con «'+d.sentidos[i].palabra+'»');
  d.sentidos[i].oraciones.forEach(function(o,j){
    const b=fabBoton('oracion',o.txt,'',function(){fabEligeOracion(j);});
    b.dataset.oracion=j;
    ops.appendChild(b);
  });
  caja.appendChild(ops);
  fabPintaSentido();
}

function fabEligeOracion(j){
  fabOracion=j;
  if(typeof sfx==='function')sfx('click');
  document.querySelectorAll('[data-oracion]').forEach(function(b){b.setAttribute('aria-pressed',+b.dataset.oracion===j?'true':'false');});
  fabPintaSentido();
}

function fabPintaSentido(){
  const caja=document.getElementById('fp-sentido');
  const d=fabDatos();
  if(!caja||!d)return;
  if(fabPalabra===null){
    caja.innerHTML='<div class="lab-asp-title">La misma palabra, otra oración</div><div class="lab-asp-info">Elige arriba una <strong>palabra</strong>. Verás tres oraciones: en cada una significa otra cosa.</div>';
    return;
  }
  const s=d.sentidos[fabPalabra];
  if(fabOracion<0){
    caja.innerHTML='<div class="fp-palabra">'+s.palabra+'</div><div class="lab-asp-info">Tiene varios significados. Toca una de las tres oraciones para ver cuál vale en cada una.</div>';
    return;
  }
  const o=s.oraciones[fabOracion];
  caja.innerHTML='<div class="fp-palabra">'+s.palabra+'</div>'
    +'<div class="fp-suma">«'+o.txt.replace(/\.$/,'')+'».</div>'
    +'<div class="fp-aviso fp-si"><span class="fp-marca">Aquí significa:</span> '+o.sentido+'</div>'
    +'<div class="fp-nota">🧭 La pista del contexto: '+o.pista+'</div>';
}

MotorMisiones.registrarLaboratorio(function(){
  fabArma();
  fabPinta();
  fabPintaSentido();
});
