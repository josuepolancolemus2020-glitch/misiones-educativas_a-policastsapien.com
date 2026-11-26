/* ============================================================
   M.E.T.A.S · Misión Conversar en lengua estándar · lo que es solo suyo
   ------------------------------------------------------------
   Lo común a todas las misiones está en js/motor-mision.js y lo que
   esta misión dice y pregunta está en js/contenido.js. Aquí queda el
   código que es de esta misión y de ninguna otra:

   · su laboratorio, «la misma noticia, cuatro bocas».

   Un mismo aviso se le da a cuatro personas (un amigo, la abuela, el
   director y todo el grado en una charla). El alumno arma cómo lo
   dice eligiendo, con botones, el saludo, las palabras, la voz y las
   pausas. El laboratorio le dice qué nivel de la lengua le quedó y,
   paso por paso, si eso sirve para esa persona y por qué.

   Por qué es así y no un juego de aciertos: lo que la misión enseña es
   que ningún nivel es «el bueno», sino que se elige según con quién se
   habla. Por eso la misma opción sale bien con el amigo y mal con el
   director, y el alumno puede probar las cuatro bocas sin que nada lo
   castigue. No da XP ni lo quita.

   Todo se hace tocando: no hay nada que arrastrar. Y el resultado no
   se dice solo con color: cada renglón lleva su marca (✓, ◐ o ✗) y su
   palabra («Sirve», «A medias», «No sirve»).

   Los datos (el aviso, las cuatro bocas y las opciones de cada paso)
   están en contenido.js, en `cuatroBocas`.
   ============================================================ */

// ===================== LABORATORIO: LA MISMA NOTICIA, CUATRO BOCAS =====================
let bocaActual=null;
let bocasElegido={};
const BOCAS_MARCA={si:{signo:'✓',palabra:'Sirve',clase:'cb-si'},medio:{signo:'◐',palabra:'A medias',clase:'cb-medio'},no:{signo:'✗',palabra:'No sirve',clase:'cb-no'}};

function bocasPasos(){return typeof cuatroBocas!=='undefined'&&cuatroBocas?cuatroBocas.pasos:[];}
function bocasBoca(id){return (typeof cuatroBocas!=='undefined'?cuatroBocas.bocas:[]).find(function(b){return b.id===id;})||null;}
function bocasOpcionDe(paso){return paso.opciones.find(function(o){return o.id===bocasElegido[paso.id];})||null;}

/* Los grupos de botones de cada paso se pintan desde los datos: así una
   opción nueva se escribe en contenido.js y aparece sola. */
function bocasArma(){
  const caja=document.getElementById('cb-pasos');
  if(!caja)return;
  caja.innerHTML='';
  bocasPasos().forEach(function(paso){
    const grupo=document.createElement('div');
    grupo.className='cb-paso';
    const titulo=document.createElement('div');
    titulo.className='cb-paso-t';
    titulo.textContent=paso.titulo;
    grupo.appendChild(titulo);
    const ops=document.createElement('div');
    ops.className='cb-ops';
    ops.setAttribute('role','group');
    ops.setAttribute('aria-label',paso.titulo);
    paso.opciones.forEach(function(op){
      const b=document.createElement('button');
      b.type='button';
      b.className='cb-op';
      b.dataset.paso=paso.id;
      b.dataset.op=op.id;
      b.setAttribute('aria-pressed','false');
      b.textContent=op.txt;
      b.onclick=function(){bocasOpcion(paso.id,op.id);};
      ops.appendChild(b);
    });
    grupo.appendChild(ops);
    caja.appendChild(grupo);
  });
}

function bocasElige(id){
  bocaActual=id;
  document.querySelectorAll('[data-boca]').forEach(function(b){
    const suya=b.dataset.boca===id;
    b.classList.toggle('active-pri',suya);
    b.setAttribute('aria-pressed',suya?'true':'false');
  });
  if(typeof sfx==='function')sfx('click');
  bocasPinta();
}

function bocasOpcion(pasoId,opId){
  bocasElegido[pasoId]=opId;
  document.querySelectorAll('.cb-op[data-paso="'+pasoId+'"]').forEach(function(b){
    b.setAttribute('aria-pressed',b.dataset.op===opId?'true':'false');
  });
  if(typeof sfx==='function')sfx('click');
  bocasPinta();
}

function bocasReinicia(){
  bocaActual=null;bocasElegido={};
  document.querySelectorAll('[data-boca]').forEach(function(b){b.classList.remove('active-pri');b.setAttribute('aria-pressed','false');});
  document.querySelectorAll('.cb-op').forEach(function(b){b.setAttribute('aria-pressed','false');});
  if(typeof sfx==='function')sfx('click');
  bocasPinta();
}

function bocasPinta(){
  const caja=document.getElementById('lab-display');
  const frase=document.getElementById('lab-sentence');
  if(!caja||typeof cuatroBocas==='undefined')return;
  /* En un solo <span>: la caja es flexible y partiría el rótulo y el aviso en columnas. */
  if(frase)frase.innerHTML='<span>📢 <strong>El aviso:</strong> '+cuatroBocas.hecho+'</span>';
  const boca=bocasBoca(bocaActual);
  const pasos=bocasPasos();
  const faltan=pasos.filter(function(p){return !bocasOpcionDe(p);});
  if(!boca||faltan.length){
    const pide=[];
    if(!boca)pide.push('a quién se lo dices');
    faltan.forEach(function(p){pide.push(p.titulo.replace(/^\S+\s/,'').toLowerCase());});
    caja.innerHTML='<div class="lab-asp-title">Arma tu aviso</div><div class="lab-asp-info">Te falta elegir: <strong>'+pide.join('</strong>, <strong>')+'</strong>.</div>';
    return;
  }
  /* Lo que el alumno armó, dicho de corrido: el saludo (si eligió uno que
     se dice) y las palabras del aviso. */
  const saludo=bocasOpcionDe(pasos[0]),palabras=pasos.map(bocasOpcionDe).find(function(o){return o.nivel;});
  const dicho=(/^«/.test(saludo.txt)?saludo.txt+' ':'')+(palabras?palabras.txt:'');
  let peor='si';
  const renglones=pasos.map(function(p){
    const op=bocasOpcionDe(p),v=op.sirve[boca.id],m=BOCAS_MARCA[v];
    if(v==='no')peor='no';else if(v==='medio'&&peor!=='no')peor='medio';
    return '<li class="'+m.clase+'"><span class="cb-marca">'+m.signo+' '+m.palabra+'.</span> '+op.por[boca.id]+'</li>';
  }).join('');
  const veredicto=peor==='si'
    ?'✓ <strong>Sirve para esta situación.</strong> Elegiste el saludo, las palabras, la voz y las pausas que pide.'
    :peor==='medio'
      ?'◐ <strong>Se entiende, pero se puede ajustar.</strong> Cambia lo que está marcado «A medias» y vuelve a mirar.'
      :'✗ <strong>Así no sirve para esta situación.</strong> Cambia lo que está marcado «No sirve» y vuelve a mirar.';
  caja.innerHTML='<div class="lab-cont-header">'+boca.emoji+' '+boca.nombre+', '+boca.donde+'</div>'
    +'<div class="cb-frase">'+dicho+'</div>'
    +'<div class="lab-asp-title">Te quedó en: '+(palabras?palabras.nivel:'')+'</div>'
    +'<ul class="cb-res">'+renglones+'</ul>'
    +'<div class="cb-veredicto">'+veredicto+'</div>';
}

MotorMisiones.registrarLaboratorio(function(){
  bocasArma();
  bocasPinta();
});
