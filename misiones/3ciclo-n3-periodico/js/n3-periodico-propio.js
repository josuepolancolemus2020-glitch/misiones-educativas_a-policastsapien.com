/* ============================================================
   M.E.T.A.S · Misión El periódico y los textos de todos los días · lo que es solo suyo
   ------------------------------------------------------------
   Lo común a todas las misiones está en js/motor-mision.js y lo que
   esta misión dice y pregunta está en js/contenido.js. Aquí queda el
   código que es de esta misión y de ninguna otra:

   · su laboratorio, «la redacción del periódico escolar».

   Con los mismos hechos (inventados: la asamblea de octavo grado y la
   siembra de los 40 árboles) el alumno escribe una noticia, una carta
   de lector o un acta. Lo arma eligiendo, con botones, cómo empieza,
   qué pone en el cuerpo, cómo lo cuenta y cómo termina. El laboratorio
   le enseña el texto que va quedando y, paso por paso, si cada pieza
   le sirve a ese texto y por qué.

   Por qué es así y no un juego de aciertos: lo que la misión enseña es
   que ninguna pieza es «la buena» por sí sola. El mismo titular que le
   sirve a la noticia le sobra a la carta, y la firma que cierra la
   carta no cierra la noticia. Por eso el alumno puede cambiar de texto
   sin perder lo que eligió y ver cómo la misma pieza pasa de «Sirve» a
   «No sirve». No da XP ni lo quita.

   Debajo va un cuadro fijo, «¿qué cambia de un texto a otro?», que
   pone los tres textos lado a lado. Va apilado (una pregunta, tres
   renglones) y no en una tabla de cuatro columnas, que en un teléfono
   de 390 px obligaría a deslizar de lado.

   Todo se hace tocando: no hay nada que arrastrar. Y el resultado no
   se dice solo con color: cada renglón lleva su marca (✓, ◐ o ✗) y su
   palabra («Sirve», «A medias», «No sirve»).

   Los datos (los hechos, los tres textos, las opciones de cada paso y
   el cuadro) están en contenido.js, en `redaccionEscolar`.
   ============================================================ */

// ===================== LABORATORIO: LA REDACCIÓN DEL PERIÓDICO ESCOLAR =====================
let redTexto=null;
let redElegido={};
const RED_MARCA={si:{signo:'✓',palabra:'Sirve',clase:'rd-si'},medio:{signo:'◐',palabra:'A medias',clase:'rd-medio'},no:{signo:'✗',palabra:'No sirve',clase:'rd-no'}};

function redDatos(){return typeof redaccionEscolar!=='undefined'&&redaccionEscolar?redaccionEscolar:null;}
function redPasos(){const d=redDatos();return d?d.pasos:[];}
function redTextoDe(id){const d=redDatos();return (d?d.textos:[]).find(function(t){return t.id===id;})||null;}
function redOpcionDe(paso){return paso.opciones.find(function(o){return o.id===redElegido[paso.id];})||null;}

/* Los grupos de botones de cada paso se pintan desde los datos: así una
   opción nueva se escribe en contenido.js y aparece sola. */
function redArma(){
  const caja=document.getElementById('rd-pasos');
  if(!caja)return;
  caja.innerHTML='';
  redPasos().forEach(function(paso){
    const grupo=document.createElement('div');
    grupo.className='rd-paso';
    const titulo=document.createElement('div');
    titulo.className='rd-paso-t';
    titulo.textContent=paso.titulo;
    grupo.appendChild(titulo);
    const ops=document.createElement('div');
    ops.className='rd-ops';
    ops.setAttribute('role','group');
    ops.setAttribute('aria-label',paso.titulo);
    paso.opciones.forEach(function(op){
      const b=document.createElement('button');
      b.type='button';
      b.className='rd-op';
      b.dataset.paso=paso.id;
      b.dataset.op=op.id;
      b.setAttribute('aria-pressed','false');
      b.textContent=op.txt;
      b.onclick=function(){redOpcion(paso.id,op.id);};
      ops.appendChild(b);
    });
    grupo.appendChild(ops);
    caja.appendChild(grupo);
  });
}

/* El cuadro de «qué cambia»: una pregunta y, debajo, lo que responde
   cada uno de los tres textos. No depende de lo que el alumno elija. */
function redCompara(){
  const caja=document.getElementById('rd-compara');
  const d=redDatos();
  if(!caja||!d)return;
  caja.innerHTML=d.compara.map(function(f){
    return '<div class="rd-cmp"><div class="rd-cmp-q">'+f.que+'</div><ul>'
      +d.textos.map(function(t){return '<li><strong>'+t.emoji+' '+t.nombre.replace(/^Una? /,'').replace(/^./,function(c){return c.toUpperCase();})+':</strong> '+f[t.id]+'</li>';}).join('')
      +'</ul></div>';
  }).join('');
}

function redElige(id){
  redTexto=id;
  document.querySelectorAll('[data-texto]').forEach(function(b){
    const suyo=b.dataset.texto===id;
    b.classList.toggle('active-pri',suyo);
    b.setAttribute('aria-pressed',suyo?'true':'false');
  });
  if(typeof sfx==='function')sfx('click');
  redPinta();
}

function redOpcion(pasoId,opId){
  redElegido[pasoId]=opId;
  document.querySelectorAll('.rd-op[data-paso="'+pasoId+'"]').forEach(function(b){
    b.setAttribute('aria-pressed',b.dataset.op===opId?'true':'false');
  });
  if(typeof sfx==='function')sfx('click');
  redPinta();
}

function redReinicia(){
  redTexto=null;redElegido={};
  document.querySelectorAll('[data-texto]').forEach(function(b){b.classList.remove('active-pri');b.setAttribute('aria-pressed','false');});
  document.querySelectorAll('.rd-op').forEach(function(b){b.setAttribute('aria-pressed','false');});
  if(typeof sfx==='function')sfx('click');
  redPinta();
}

function redPinta(){
  const caja=document.getElementById('lab-display');
  const frase=document.getElementById('lab-sentence');
  const d=redDatos();
  if(!caja||!d)return;
  /* En un solo <span>: la caja es flexible y partiría el rótulo y los hechos en columnas. */
  if(frase)frase.innerHTML='<span>📋 <strong>Los hechos:</strong> '+d.hechos+'</span>';
  const texto=redTextoDe(redTexto);
  const pasos=redPasos();
  const faltan=pasos.filter(function(p){return !redOpcionDe(p);});
  if(!texto||faltan.length){
    const pide=[];
    if(!texto)pide.push('qué vas a escribir');
    faltan.forEach(function(p){pide.push(p.titulo.replace(/^\S+\s/,'').toLowerCase());});
    caja.innerHTML='<div class="lab-asp-title">Arma tu texto</div><div class="lab-asp-info">Te falta elegir: <strong>'+pide.join('</strong>, <strong>')+'</strong>.</div>';
    return;
  }
  /* Lo que el alumno armó, pieza por pieza: solo las opciones que ponen
     una línea en el texto (la manera de contarlo no pone ninguna). */
  const lineas=pasos.map(redOpcionDe).filter(function(o){return o.linea;}).map(function(o){return '<p>'+o.linea+'</p>';}).join('');
  let peor='si';
  const renglones=pasos.map(function(p){
    const op=redOpcionDe(p),v=op.sirve[texto.id],m=RED_MARCA[v];
    if(v==='no')peor='no';else if(v==='medio'&&peor!=='no')peor='medio';
    return '<li class="'+m.clase+'"><span class="rd-marca">'+m.signo+' '+m.palabra+'.</span> '+op.por[texto.id]+'</li>';
  }).join('');
  const nombre=texto.nombre.toLowerCase();
  const veredicto=peor==='si'
    ?'✓ <strong>Te quedó '+nombre+' completa.</strong> Ahora cambia de texto arriba, sin tocar lo demás, y mira cómo las mismas piezas dejan de servir.'
    :peor==='medio'
      ?'◐ <strong>Casi es '+nombre+'.</strong> Cambia lo que está marcado «A medias» y vuelve a mirar.'
      :'✗ <strong>Así todavía no es '+nombre+'.</strong> Cambia lo que está marcado «No sirve» y vuelve a mirar.';
  caja.innerHTML='<div class="lab-cont-header">'+texto.emoji+' '+texto.nombre+', '+texto.para+'</div>'
    +'<div class="lab-asp-title">Así va quedando</div>'
    +'<div class="rd-texto">'+lineas+'</div>'
    +'<ul class="rd-res">'+renglones+'</ul>'
    +'<div class="rd-veredicto">'+veredicto+'</div>';
}

MotorMisiones.registrarLaboratorio(function(){
  redArma();
  redCompara();
  redPinta();
});
