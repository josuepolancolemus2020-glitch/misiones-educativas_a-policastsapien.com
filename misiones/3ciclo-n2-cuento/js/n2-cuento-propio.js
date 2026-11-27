/* ============================================================
   M.E.T.A.S · Misión El cuento · lo que es solo suyo
   ------------------------------------------------------------
   Lo común a todas las misiones está en js/motor-mision.js y lo que
   esta misión dice y pregunta está en js/contenido.js. Aquí queda el
   código que es de esta misión y de ninguna otra:

   · su laboratorio, «la cámara del narrador».

   Tiene dos paneles.

   En el primero el alumno elige una escena y quién la narra. El mismo
   suceso sale contado por cuatro narradores (el protagonista, un
   testigo, el narrador objetivo y el omnisciente), y el laboratorio
   dice de cada uno qué sabe, qué no sabe y en qué palabras se nota.
   Lo que se aprende no es el nombre del narrador: es que cambiar quién
   cuenta cambia lo que el lector llega a saber.

   En el segundo el alumno arma el esqueleto de un cuento propio:
   elige un personaje, un ambiente, un problema y quién narra, y el
   laboratorio le devuelve el plan en tres partes y la oración con que
   puede empezar. El cierre no se lo da: decidir cómo termina es
   justamente lo que hace suyo al cuento, y un final escrito por la
   máquina sería copiar.

   No es un juego de aciertos: no da XP ni lo quita. Lleva la cuenta de
   los narradores que el alumno ya escuchó en cada escena, para que
   pruebe los que le faltan.

   Todo se hace tocando: no hay nada que arrastrar. Y nada se dice solo
   con color: lo que el narrador sabe lleva ✓ y lo que no sabe, ✗, cada
   uno con sus palabras.

   Los datos (los narradores, las escenas con sus cuatro voces y las
   piezas del esqueleto) están en contenido.js, en `camaraNarrador`.
   ============================================================ */

// ===================== LABORATORIO: LA CÁMARA DEL NARRADOR =====================
let camEscena=null;
let camNarrador='';
const camOidos={};
const esqEleccion={personaje:'',ambiente:'',problema:'',narrador:''};

function camDatos(){return typeof camaraNarrador!=='undefined'&&camaraNarrador?camaraNarrador:null;}
function camEscenaDe(id){const d=camDatos();return (d?d.escenas:[]).find(function(e){return e.id===id;})||null;}

function camBoton(grupo,texto,sub,alTocar){
  const b=document.createElement('button');
  b.type='button';
  b.className='cn-op';
  b.setAttribute('aria-pressed','false');
  b.appendChild(document.createTextNode(texto));
  if(sub){const s=document.createElement('small');s.textContent=sub;b.appendChild(s);}
  b.onclick=alTocar;
  b.dataset.grupo=grupo;
  return b;
}

/* Los botones se pintan desde los datos: una escena nueva se escribe en
   contenido.js y aparece sola. */
function camArma(){
  const d=camDatos();
  const caja=document.getElementById('cn-escenas');
  if(!d||!caja)return;
  caja.innerHTML='';
  d.escenas.forEach(function(e){
    const b=camBoton('escena',e.titulo,'',function(){camEligeEscena(e.id);});
    b.dataset.valor=e.id;
    caja.appendChild(b);
  });
  const cajaN=document.getElementById('cn-narradores');
  if(cajaN){
    cajaN.innerHTML='';
    Object.keys(d.narradores).forEach(function(id){
      const n=d.narradores[id];
      const b=camBoton('narrador',n.nombre,n.persona,function(){camEligeNarrador(id);});
      b.dataset.valor=id;
      cajaN.appendChild(b);
    });
  }
  esqArma();
}

function camMarca(){
  document.querySelectorAll('[data-grupo="escena"]').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.valor===camEscena?'true':'false');});
  document.querySelectorAll('[data-grupo="narrador"]').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.valor===camNarrador?'true':'false');});
}

function camEligeEscena(id){
  camEscena=id;camNarrador='';
  if(typeof sfx==='function')sfx('click');
  camMarca();
  camPinta();
}

function camEligeNarrador(id){
  camNarrador=id;
  if(typeof sfx==='function')sfx('click');
  camMarca();
  camPinta();
}

function camReinicia(){
  camEscena=null;camNarrador='';
  Object.keys(camOidos).forEach(function(k){delete camOidos[k];});
  if(typeof sfx==='function')sfx('click');
  camMarca();
  camPinta();
}

function camPinta(){
  const caja=document.getElementById('lab-display');
  const d=camDatos();
  if(!caja||!d)return;
  const escena=camEscenaDe(camEscena);
  if(!escena){
    caja.innerHTML='<div class="lab-asp-title">Un suceso, cuatro narradores</div><div class="lab-asp-info">Elige arriba una <strong>escena</strong>. Después elige <strong>quién la narra</strong> y mira qué cambia.</div>';
    return;
  }
  const total=Object.keys(d.narradores).length;
  const oidos=camOidos[escena.id]||(camOidos[escena.id]={});
  const cuenta=function(){return '<div class="cn-cuenta">Narradores de esta escena que ya escuchaste: <strong>'+Object.keys(oidos).length+' de '+total+'</strong></div>';};
  const suceso='<div class="cn-suceso"><strong>Lo que pasó:</strong> '+escena.suceso+'</div>';
  const voz=camNarrador?escena.voces[camNarrador]:null;
  if(!voz){
    caja.innerHTML=suceso+'<div class="lab-asp-info">Ahora elige <strong>quién narra</strong>. El suceso es el mismo; lo que cambia es lo que el lector llega a saber.</div>'+cuenta();
    return;
  }
  oidos[camNarrador]=true;
  const n=d.narradores[camNarrador];
  caja.innerHTML=suceso
    +'<div class="cn-quien">'+n.nombre+'</div>'
    +'<div class="cn-persona">'+n.persona+'</div>'
    +'<div class="cn-voz">«'+voz.txt+'»</div>'
    +'<div class="cn-aviso cn-si"><span class="cn-marca">✓ Sabe:</span> '+voz.sabe+'</div>'
    +'<div class="cn-aviso cn-no"><span class="cn-marca">✗ No sabe o no cuenta:</span> '+voz.noSabe+'</div>'
    +'<div class="cn-nota">🧭 Se nota en: '+voz.pista+'</div>'
    +cuenta();
}

/* ── Segundo panel: el esqueleto de tu cuento ── */
const ESQ_GRUPOS=[
  ['personaje','personajes','👤 ¿Quién es tu personaje?'],
  ['ambiente','ambientes','🌄 ¿Dónde y cuándo pasa?'],
  ['problema','problemas','🌀 ¿Qué problema aparece?'],
  ['narrador','narradores','🎙️ ¿Quién narra?']
];

function esqArma(){
  const d=camDatos();
  const caja=document.getElementById('cn-esqueleto');
  if(!d||!d.esqueleto||!caja)return;
  caja.innerHTML='';
  ESQ_GRUPOS.forEach(function(g){
    const paso=document.createElement('div');
    paso.className='cn-paso';
    const t=document.createElement('div');
    t.className='cn-paso-t';
    t.textContent=g[2];
    paso.appendChild(t);
    const ops=document.createElement('div');
    ops.className='cn-ops cn-ops-col';
    ops.setAttribute('role','group');
    ops.setAttribute('aria-label',g[2]);
    d.esqueleto[g[1]].forEach(function(o){
      const b=camBoton('esq-'+g[0],o.txt,'',function(){esqElige(g[0],o.id);});
      b.dataset.valor=o.id;
      ops.appendChild(b);
    });
    paso.appendChild(ops);
    caja.appendChild(paso);
  });
}

function esqElige(grupo,id){
  esqEleccion[grupo]=id;
  if(typeof sfx==='function')sfx('click');
  document.querySelectorAll('[data-grupo="esq-'+grupo+'"]').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.valor===id?'true':'false');});
  esqPinta();
}

function esqReinicia(){
  Object.keys(esqEleccion).forEach(function(k){esqEleccion[k]='';});
  if(typeof sfx==='function')sfx('click');
  document.querySelectorAll('[data-grupo^="esq-"]').forEach(function(b){b.setAttribute('aria-pressed','false');});
  esqPinta();
}

function esqPinta(){
  const caja=document.getElementById('cn-plan');
  const d=camDatos();
  if(!caja||!d||!d.esqueleto)return;
  const e=d.esqueleto;
  const de=function(lista,id){return lista.find(function(o){return o.id===id;})||null;};
  const per=de(e.personajes,esqEleccion.personaje);
  const amb=de(e.ambientes,esqEleccion.ambiente);
  const pro=de(e.problemas,esqEleccion.problema);
  const nar=de(e.narradores,esqEleccion.narrador);
  const faltan=[];
  if(!per)faltan.push('el personaje');
  if(!amb)faltan.push('el ambiente');
  if(!pro)faltan.push('el problema');
  if(!nar)faltan.push('quién narra');
  if(faltan.length){
    caja.innerHTML='<div class="lab-asp-title">El esqueleto de tu cuento</div><div class="lab-asp-info">Te falta elegir: <strong>'+faltan.join(', ')+'</strong>. Cuando tengas los cuatro, aquí sale tu plan.</div>';
    return;
  }
  const arranque=(nar.id==='yo'?per.yo:per.el)+'…';
  caja.innerHTML='<div class="cn-quien">Tu plan en tres partes</div>'
    +'<div class="cn-aviso cn-si"><span class="cn-marca">1. Inicio.</span> Presenta a '+per.txt+' y di cómo es por fuera y por dentro. Sitúa la historia '+amb.txt+'.</div>'
    +'<div class="cn-aviso cn-si"><span class="cn-marca">2. Desarrollo.</span> '+pro.txt+'. Cuenta qué hace tu personaje para enfrentarlo.</div>'
    +'<div class="cn-aviso cn-si"><span class="cn-marca">3. Cierre.</span> El problema se resuelve, para bien o para mal. ¿Cómo? Eso lo decides tú.</div>'
    +'<div class="cn-voz">Puedes empezar así: «'+arranque+'»</div>'
    +'<div class="cn-nota">✍️ Narra '+(nar.id==='yo'?'el propio personaje: escribe todo el cuento con «yo»':'alguien de fuera: escribe todo el cuento con «él» o «ella»')+', sin cambiar de narrador. Copia el plan en tu cuaderno, escribe el borrador, revísalo y pásalo en limpio.</div>';
}

MotorMisiones.registrarLaboratorio(function(){
  camArma();
  camPinta();
  esqPinta();
});
