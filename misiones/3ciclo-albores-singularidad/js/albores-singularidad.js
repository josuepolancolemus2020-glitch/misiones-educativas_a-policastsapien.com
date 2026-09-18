// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
function compartirMision(){const url=window.location.href;const texto=`🚀 *Misión Asignada* 🚀\n\nPractica sobre este tema y sobresale en ser de los mejores alumnos. 🏆\n\nDesbloquea *todos los logros* y puedes poner *tus datos* para que tu maestro observe todos tus logros. 📋\n\n_Se te hará prueba escrita y serás excelente estudiante en Inteligencia Artificial._ ✍️\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;_waShare(texto);}
function toggleLetra(){document.body.classList.toggle('letra-grande');if(typeof sfx==='function')sfx('click');localStorage.setItem('preferenciaLetra',document.body.classList.contains('letra-grande'));}
window.addEventListener('DOMContentLoaded',()=>{if(localStorage.getItem('preferenciaLetra')==='true')document.body.classList.add('letra-grande');});

// ===================== UTILIDADES =====================
const _pick=(arr,n)=>[...arr].sort(()=>Math.random()-0.5).slice(0,n);
const _shuffle=(arr)=>[...arr].sort(()=>Math.random()-0.5);
function fb(id,msg,isOk){const el=document.getElementById(id);if(el){el.textContent=msg;el.className='fb show '+(isOk?'ok':'err');}}

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY='albores_singularidad_v1';
let xp=0,MXP=200,done=new Set(),evalAnsVisible=false;
let evalFormNum=1,unlockedAch=[],darkMode=false,prevLevel=0;
let evalCritFormNum=1,evalCritAnsVisible=false;
const TOTAL_SECTIONS=14;
const xpTracker={fc:new Set(),qz:new Set(),cls:new Set(),id:new Set(),cmp:new Set(),reto:new Set(),sopa:new Set(),wgt:new Set()};

// ===================== SONIDO =====================
let sndOn=true;let AC=null;
function getAC(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}}return AC;}
function sfx(t){if(!sndOn)return;try{const ac=getAC();if(!ac)return;const g=ac.createGain();g.connect(ac.destination);const o=ac.createOscillator();o.connect(g);if(t==='click'){o.type='sine';o.frequency.setValueAtTime(800,ac.currentTime);o.frequency.linearRampToValueAtTime(1200,ac.currentTime+0.1);g.gain.setValueAtTime(0.2,ac.currentTime);g.gain.linearRampToValueAtTime(0,ac.currentTime+0.12);o.start();o.stop(ac.currentTime+0.12);}else if(t==='ok'){[523,659,784].forEach((f,i)=>{const o2=ac.createOscillator();const g2=ac.createGain();o2.connect(g2);g2.connect(ac.destination);o2.type='triangle';o2.frequency.value=f;g2.gain.setValueAtTime(0.15,ac.currentTime+i*0.1);g2.gain.linearRampToValueAtTime(0,ac.currentTime+i*0.1+0.15);o2.start(ac.currentTime+i*0.1);o2.stop(ac.currentTime+i*0.1+0.15);});}else if(t==='no'){o.type='square';o.frequency.setValueAtTime(200,ac.currentTime);o.frequency.linearRampToValueAtTime(100,ac.currentTime+0.2);g.gain.setValueAtTime(0.15,ac.currentTime);g.gain.linearRampToValueAtTime(0,ac.currentTime+0.2);o.start();o.stop(ac.currentTime+0.2);}else if(t==='up'){[523,659,784,1047].forEach((f,i)=>{const o2=ac.createOscillator();const g2=ac.createGain();o2.connect(g2);g2.connect(ac.destination);o2.type='triangle';o2.frequency.value=f;g2.gain.setValueAtTime(0.18,ac.currentTime+i*0.12);g2.gain.linearRampToValueAtTime(0,ac.currentTime+i*0.12+0.18);o2.start(ac.currentTime+i*0.12);o2.stop(ac.currentTime+i*0.12+0.18);});}else if(t==='fan'){[523,587,659,698,784,1047].forEach((f,i)=>{const o2=ac.createOscillator();const g2=ac.createGain();o2.connect(g2);g2.connect(ac.destination);o2.type='triangle';o2.frequency.value=f;g2.gain.setValueAtTime(0.15,ac.currentTime+i*0.1);g2.gain.linearRampToValueAtTime(0,ac.currentTime+i*0.1+0.2);o2.start(ac.currentTime+i*0.1);o2.stop(ac.currentTime+i*0.1+0.2);});}else if(t==='flip'){o.type='sine';o.frequency.setValueAtTime(400,ac.currentTime);o.frequency.linearRampToValueAtTime(900,ac.currentTime+0.15);g.gain.setValueAtTime(0.12,ac.currentTime);g.gain.linearRampToValueAtTime(0,ac.currentTime+0.18);o.start();o.stop(ac.currentTime+0.18);}else if(t==='tick'){o.type='sine';o.frequency.value=1000;g.gain.setValueAtTime(0.1,ac.currentTime);g.gain.linearRampToValueAtTime(0,ac.currentTime+0.05);o.start();o.stop(ac.currentTime+0.05);}else if(t==='ach'){[880,1047,1319].forEach((f,i)=>{const o2=ac.createOscillator();const g2=ac.createGain();o2.connect(g2);g2.connect(ac.destination);o2.type='triangle';o2.frequency.value=f;g2.gain.setValueAtTime(0.2,ac.currentTime+i*0.12);g2.gain.linearRampToValueAtTime(0,ac.currentTime+i*0.12+0.22);o2.start(ac.currentTime+i*0.12);o2.stop(ac.currentTime+i*0.12+0.22);});}}catch(e){}}
function toggleSnd(){sndOn=!sndOn;document.getElementById('sndBtn').textContent=sndOn?'🔊 Sonido':'🔇 Sonido';}

// ===================== DARK MODE =====================
function toggleTheme(){darkMode=!darkMode;document.documentElement.setAttribute('data-theme',darkMode?'dark':'light');document.getElementById('themeBtn').textContent=darkMode?'☀️ Tema':'🌙 Tema';localStorage.setItem(SAVE_KEY+'_theme',darkMode?'dark':'light');sfx('click');}
function initTheme(){const s=localStorage.getItem(SAVE_KEY+'_theme');const sys=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;darkMode=(s==='dark')||(s===null&&sys);if(darkMode){document.documentElement.setAttribute('data-theme','dark');document.getElementById('themeBtn').textContent='☀️ Tema';}}

// ===================== LOCALSTORAGE =====================
function saveProgress(){try{localStorage.setItem(SAVE_KEY,JSON.stringify({doneSections:Array.from(done),unlockedAch,evalFormNum,evalCritFormNum,xp}));}catch(e){}}
function loadProgress(){try{const s=JSON.parse(localStorage.getItem(SAVE_KEY));if(!s)return;if(s.doneSections&&Array.isArray(s.doneSections))s.doneSections.forEach(id=>{done.add(id);const b=document.querySelector(`[data-s="${id}"]`);if(b)b.classList.add('done');});if(s.unlockedAch&&Array.isArray(s.unlockedAch))unlockedAch=s.unlockedAch.filter(id=>ACHIEVEMENTS[id]!==undefined);if(s.evalFormNum)evalFormNum=s.evalFormNum;if(s.evalCritFormNum)evalCritFormNum=s.evalCritFormNum;if(s.xp!==undefined){xp=s.xp;updateXPBar();}}catch(e){}}

// ===================== ACHIEVEMENTS =====================
const ACHIEVEMENTS={
  primer_quiz:{icon:'🏅',label:'Primer quiz de la actualidad superado'},
  flash_master:{icon:'🃏',label:'Se sabe el termómetro y la vara de los inviernos'},
  clasif_pro:{icon:'🗂️',label:'Distingue lo que se sabe de lo que se afirma'},
  id_master:{icon:'🔍',label:'Encuentra la pregunta que le falta a una afirmación'},
  reto_hero:{icon:'🏆',label:'Campeón del reto de la actualidad'},
  nivel3:{icon:'🎖️',label:'¡Buen criterio! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡No se lo traga! Nivel 6'},
  widgets_master:{icon:'🧩',label:'Widgets de la actualidad dominados'},
  archivista:{icon:'📰',label:'Clasificó el dossier de este mes por lo que trae'},
  cronometro:{icon:'📅',label:'Fechó una promesa y se puso día para volver'}
};
function unlockAchievement(id){if(unlockedAch.includes(id))return;unlockedAch.push(id);sfx('ach');showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label);launchConfetti();renderAchPanel();saveProgress();}
function renderAchPanel(){const list=document.getElementById('achList');list.innerHTML='';Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{const div=document.createElement('div');div.className='ach-item'+(unlockedAch.includes(id)?'':' locked');div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`;list.appendChild(div);});}
function toggleAchPanel(){sfx('click');document.getElementById('achPanel').classList.toggle('open');}
function showToast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}t.textContent=msg;t.style.display='block';clearTimeout(t._tid);t._tid=setTimeout(()=>t.style.display='none',3200);}
function launchConfetti(){const colors=['#86198f','#e879f9','#4338ca','#f59e0b','#c026d3'];for(let i=0;i<60;i++){const c=document.createElement('div');c.className='confetti-piece';c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`;document.body.appendChild(c);c.addEventListener('animationend',()=>c.remove());}}

// ===================== XP =====================
const lvls=[{t:0,n:'Aprendiz 🌱'},{t:25,n:'Pregunta quién lo dice 🧑'},{t:55,n:'Pregunta qué gana 💰'},{t:90,n:'Le pone fecha a la promesa 📅'},{t:130,n:'Busca el documento 📎'},{t:165,n:'Distingue el hito del eco 🧭'},{t:190,n:'Lee su propio tiempo 🏆'}];
function pts(n){xp=Math.max(0,Math.min(MXP,xp+n));updateXPBar();saveProgress();}
function updateXPBar(){const pct=Math.round((xp/MXP)*100);document.getElementById('xpFill').style.width=pct+'%';const el=document.getElementById('xpPts');el.textContent='⭐ '+xp;el.style.transform='scale(1.3)';setTimeout(()=>el.style.transform='',300);let lv=0;for(let i=0;i<lvls.length;i++)if(xp>=lvls[i].t)lv=i;document.getElementById('xpLvl').textContent=lvls[lv].n;if(lv!==prevLevel){if(lv>=2)unlockAchievement('nivel3');if(lv>=5)unlockAchievement('nivel5');prevLevel=lv;}}
function resetXP(){sfx('click');xp=0;updateXPBar();showToast('🔄 XP reiniciado a 0');}
function fin(id,showFX=true){if(!done.has(id)){done.add(id);const b=document.querySelector(`[data-s="${id}"]`);if(b)b.classList.add('done');if(showFX){sfx('up');launchConfetti();}saveProgress();}}
function getProgress(){return Math.round((done.size/TOTAL_SECTIONS)*100);}

// ===================== NAV =====================
function go(id){sfx('click');document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});document.getElementById(id).classList.add('active');const btn=document.querySelector(`[data-s="${id}"]`);if(btn){btn.classList.add('active');btn.setAttribute('aria-selected','true');}window.scrollTo({top:0,behavior:'smooth'});if(id==='s-sopa'){setTimeout(buildSopa,50);}if(id==='s-widgets'){setTimeout(buildRoute,50);}}

// ===================== FLASHCARD DATA =====================
const fcData = (function () {
  /* Del dossier y del termómetro (js/data/ia-actualidad.js). Las tarjetas de
     la actualidad llevan SIEMPRE su fecha delante: una tarjeta de «lo que está
     pasando» sin fecha es una mentira dentro de tres meses. */
  const f = [];
  IA_TERMOMETRO.forEach(t => {
    f.push({ w: t.emoji + ' ' + t.pregunta + '<br><small>una de las cuatro preguntas</small>', a: '<strong>' + t.porque + '</strong><br><br>Suena a sí: ' + t.si + '<br>Suena a no: ' + t.no });
  });
  IA_TERMOMETRO_TRAMOS.forEach(t => {
    f.push({ w: t.emoji + ' ' + t.nombre + '<br><small>¿qué hacés con una así?</small>', a: t.dice });
  });
  IA_HOY.forEach(h => {
    f.push({ w: h.emoji + ' ' + h.fecha + '<br><small>' + h.afirma.slice(0, 90) + '…</small>', a: '<strong>Lo comprobás así:</strong> ' + h.comprueba + '<br><br>' + h.importa });
  });
  IA_INFLEXION.reglas.forEach(r => {
    f.push({ w: r.e + ' ' + r.t + '<br><small>una regla del punto de inflexión</small>', a: r.p });
  });
  IA_SINGULARIDAD.seSabe.forEach(x => {
    f.push({ w: x.e + ' ¿Se sabe o se afirma?<br><small>«' + x.t + '»</small>', a: '<strong>Se SABE.</strong><br><br>' + x.p });
  });
  return f;
})();
let fcIdx=0;
function upFC(){document.getElementById('fcInner').classList.remove('flipped');document.getElementById('fcW').innerHTML=fcData[fcIdx].w;document.getElementById('fcA').innerHTML=fcData[fcIdx].a;document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length;}
function flipCard(){sfx('flip');document.getElementById('fcInner').classList.toggle('flipped');if(!xpTracker.fc.has(fcIdx)){xpTracker.fc.add(fcIdx);pts(1);}if(xpTracker.fc.size===fcData.length){fin('s-flash');unlockAchievement('flash_master');}}
function nextFC(){sfx('click');fcIdx=(fcIdx+1)%fcData.length;upFC();}
function prevFC(){sfx('click');fcIdx=(fcIdx-1+fcData.length)%fcData.length;upFC();}

// ===================== QUIZ DATA =====================
const qzData=[
  {q:'¿Qué afirma la palabra «singularidad»?',o:['Que una máquina mejore máquinas más rápido de lo que podemos seguir','Que la IA ya piensa como una persona','Que las computadoras se van a apagar','Que la IA es peligrosa'],c:0,
   e:'Habla del futuro: hoy no se puede comprobar. Preguntale a quien la hace.'},
  {q:'¿Qué SÍ se sabe hoy de las máquinas que aprenden?',o:['Que quieren cosas','Que aprenden de ejemplos que alguien eligió','Que se mejoran solas sin nadie','Que entienden lo que leen'],c:1,
   e:'Lo produjiste vos en la etapa 1.'},
  {q:'Una promesa sin fecha…',o:['Es más seria','No se puede incumplir nunca','Se cumple sola','Vale más que una con fecha'],c:1,
   e:'Ponele vos la fecha y volvé a leerla ese día.'},
  {q:'Cinco páginas dicen lo mismo y ninguna dice de dónde. ¿Qué tenés?',o:['Un eco','Cinco fuentes','Una fuente muy buena','Una prueba'],c:0,
   e:'Se descarta en segundos. Lo caro es leerlo todo.'},
  {q:'¿Cuándo se reconoce un punto de inflexión?',o:['El mismo día, por el ruido que hace','Cuando lo dice un experto','Cuando sale en la televisión','Casi siempre mirando para atrás'],c:3,
   e:'El artículo del que salen los chats de hoy pasó desapercibido.'},
  {q:'Saber qué gana alguien diciendo algo…',o:['Lo vuelve falso','Lo vuelve verdadero','No sirve de nada','Pone lo que dice en su sitio'],c:3,
   e:'Quien vende exagera. Quien teme, también.'},
  {q:'¿Qué fue un «invierno» de la Inteligencia Artificial?',o:['Un fallo de las computadoras','Una guerra','Un tiempo en que se prometió de más y el campo casi se para','Un virus'],c:2,
   e:'Lo que se rompió fue la confianza.'},
  {q:'Un anuncio dice «contenido patrocinado». ¿Qué significa?',o:['Que alguien pagó por publicarlo, y el medio lo dice','Que es mentira','Que es del gobierno','Que es gratis'],c:0,
   e:'Que lo diga es honesto. No lo vuelve falso.'},
  {q:'Dos noticias del mes se contradicen. ¿Qué es lo más probable?',o:['Una miente','Las dos mienten','Miden cosas distintas','Hay que creerle a la más nueva'],c:2,
   e:'Puede haber becas y faltar infraestructura a la vez.'},
  {q:'¿Por qué esta misión NO dice si estamos en los albores?',o:['Porque es secreto','Porque nadie lo sabe','Porque es muy difícil','Porque no importa'],c:1,
   e:'Te da la vara para medir a quien lo afirme.'}
];
let qzIdx=0,qzSel=-1,qzDone=false;
function buildQz(){qzIdx=0;qzSel=-1;qzDone=false;showQz();}
function showQz(){var _fbQ=document.getElementById('fbQz');if(_fbQ)_fbQ.classList.remove('show');if(qzIdx>=qzData.length){document.getElementById('qzQ').textContent='🎉 ¡Quiz completado!';document.getElementById('qzOpts').innerHTML='';fin('s-quiz');unlockAchievement('primer_quiz');return;}const q=qzData[qzIdx];document.getElementById('qzProg').textContent=`Pregunta ${qzIdx+1} de ${qzData.length}`;document.getElementById('qzQ').textContent=q.q;const opts=document.getElementById('qzOpts');opts.innerHTML='';q.o.forEach((o,i)=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=o;b.onclick=()=>{if(qzDone)return;document.querySelectorAll('.qz-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');qzSel=i;sfx('click');};opts.appendChild(b);});qzDone=false;}
// El quiz ya NO avanza solo a los 1,6 s. Con el avance automático, el alumno que
// fallaba veía la respuesta correcta medio segundo y desaparecía antes de poder
// leerla; y el «Incorrecto» se quedaba colgado debajo de la pregunta SIGUIENTE,
// que todavía no había contestado. Ahora avanza él, cuando ya la leyó.
function nextQz(){
  if(!qzDone)return fb('fbQz','Primero toca «Verificar».',false);
  qzIdx++; qzSel=-1; qzDone=false; showQz();
}
function checkQz(){if(qzSel<0)return fb('fbQz','Selecciona una respuesta.',false);qzDone=true;const opts=document.querySelectorAll('.qz-opt');if(qzSel===qzData[qzIdx].c){opts[qzSel].classList.add('correct');fb('fbQz','¡Correcto! +5 XP',true);if(!xpTracker.qz.has(qzIdx)){xpTracker.qz.add(qzIdx);pts(5);}sfx('ok');}else{opts[qzSel].classList.add('wrong');opts[qzData[qzIdx].c].classList.add('correct');fb('fbQz','Incorrecto. Revisa la respuesta correcta.',false);sfx('no');}}
function resetQz(){sfx('click');qzIdx=0;qzSel=-1;qzDone=false;showQz();document.getElementById('fbQz').classList.remove('show');}

// ===================== CLASIFICACIÓN =====================
const classGroups=[
  {label:['Se SABE hoy','Se AFIRMA sobre el futuro'],headA:'📎 Se sabe',headB:'🔮 Se afirma',colA:'sabe',colB:'afirma',
   words:[{w:'Aprende de ejemplos que alguien eligió',t:'sabe'},{w:'Va a mejorarse sola sin nadie',t:'afirma'},{w:'Se equivoca con lo que no vio',t:'sabe'},{w:'En dos años lo hará todo',t:'afirma'},{w:'Predice, no comprueba',t:'sabe'},{w:'Va a volverse más lista que cualquiera',t:'afirma'},{w:'La entrena gente con datos que costaron dinero',t:'sabe'},{w:'El cambio se va a acelerar solo',t:'afirma'}]},
  {label:['Trae con qué comprobarse','No trae nada que abrir'],headA:'📎 Comprobable',headB:'💨 Eco',colA:'comp',colB:'eco',
   words:[{w:'El texto de una ley, con su artículo',t:'comp'},{w:'«Dicen que los expertos creen»',t:'eco'},{w:'Un estudio con su institución y su fecha',t:'comp'},{w:'«Está a la vuelta de la esquina»',t:'eco'},{w:'Una publicación firmada, con fecha',t:'comp'},{w:'Cinco blogs repitiendo lo mismo',t:'eco'},{w:'Un anuncio en el sitio de la alcaldía',t:'comp'},{w:'Un titular sin autor',t:'eco'}]},
  {label:['Fue un punto de inflexión','Fue un invierno'],headA:'🧭 Inflexión',headB:'❄️ Invierno',colA:'inf',colB:'inv',
   words:[{w:'Se juntaron datos, cómputo y algoritmos',t:'inf'},{w:'Se prometió más de lo que se podía',t:'inv'},{w:'Después de eso todo se hizo distinto',t:'inf'},{w:'Se cortó el dinero y el campo se paró',t:'inv'},{w:'Una idea vieja por fin tuvo con qué',t:'inf'},{w:'La gente dejó de creerle al campo',t:'inv'},{w:'Se reconoció años después, no ese día',t:'inf'},{w:'Lo que se rompió fue la confianza',t:'inv'}]}
];
let currentClassGroupIdx=0,clsSelectedWord=null;
function buildClass(){const group=classGroups[currentClassGroupIdx];document.getElementById('col-left-head').textContent=group.headA;document.getElementById('col-right-head').textContent=group.headB;const bank=document.getElementById('clsBank');bank.innerHTML='';clsSelectedWord=null;document.getElementById('items-left').innerHTML='';document.getElementById('items-right').innerHTML='';_shuffle([...group.words]).forEach(w=>{const el=document.createElement('div');el.className='wb-item';el.textContent=w.w;el.dataset.t=w.t;el.onclick=()=>{document.querySelectorAll('.wb-item').forEach(i=>i.classList.remove('sel-word'));el.classList.add('sel-word');clsSelectedWord=el;sfx('click');};bank.appendChild(el);});['col-left','col-right'].forEach(colId=>{const col=document.getElementById(colId);col.onclick=(e)=>{if(!clsSelectedWord||e.target.classList.contains('drop-item'))return;const targetId=colId==='col-left'?'items-left':'items-right';const wordsCol=document.getElementById(targetId);const item=document.createElement('div');item.className='drop-item';item.textContent=clsSelectedWord.textContent;item.dataset.t=clsSelectedWord.dataset.t;const original=clsSelectedWord;item.onclick=(ev)=>{ev.stopPropagation();if(clsSelectedWord!==null){col.click();}else{document.getElementById('clsBank').appendChild(original);original.classList.remove('sel-word');item.remove();if(typeof sfx==='function')sfx('click');}};wordsCol.appendChild(item);clsSelectedWord.remove();clsSelectedWord=null;sfx('click');};});}
function checkClass(){const remaining=document.querySelectorAll('#clsBank .wb-item').length;if(remaining>0){fb('fbCls','Mueve todas las palabras a las columnas primero.',false);return;}const group=classGroups[currentClassGroupIdx];let allOk=true;document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{const inLeft=el.parentElement.id==='items-left';const expectedType=inLeft?group.colA:group.colB;if(el.dataset.t===expectedType){el.classList.add('cls-ok');}else{el.classList.add('cls-no');allOk=false;}});if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);}if(allOk){fb('fbCls','¡Perfecto! +5 XP',true);sfx('fan');fin('s-clasifica');unlockAchievement('clasif_pro');}else{fb('fbCls','Hay errores. Los errados llevan ✗.',false);sfx('no');}}
function nextClassGroup(){sfx('click');currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length;buildClass();document.getElementById('fbCls').classList.remove('show');showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]);}
function resetClass(){sfx('click');buildClass();document.getElementById('fbCls').classList.remove('show');}

// ===================== IDENTIFICAR =====================
const idData=[
  {s:['Una','promesa','sin','fecha','no','se','puede','incumplir.'],c:3,art:'Lo que le falta a una promesa que nunca se juzga'},
  {s:['Cinco','páginas','que','repiten','lo','mismo','son','un','eco.'],c:8,art:'Lo que parece muchas fuentes y es una'},
  {s:['Un','punto','de','inflexión','se','reconoce','mirando','para','atrás.'],c:3,art:'El día en que todo cambió de rumbo'},
  {s:['En','un','invierno','se','rompió','la','confianza.'],c:2,art:'El tiempo en que el campo casi se para'},
  {s:['Lo','primero','es','preguntar','quién','lo','dice.'],c:4,art:'La primera pregunta del termómetro'},
  {s:['Saber','qué','gana','no','lo','vuelve','falso.'],c:2,art:'Lo que se le pregunta a quien afirma algo'},
  {s:['La','fuente','original','es','la','que','responde.'],c:1,art:'Lo que hay que abrir para comprobar'},
  {s:['Nadie','sabe','si','habrá','una','singularidad.'],c:5,art:'La palabra de un futuro que se acelera solo'}
];
let idIdx=0,idDone=false;
function showId(){idDone=false;if(idIdx>=idData.length){document.getElementById('idSent').innerHTML='🎉 ¡Completado!';fin('s-identifica');unlockAchievement('id_master');return;}const d=idData[idIdx];document.getElementById('idProg').textContent=`Oración ${idIdx+1} de ${idData.length}`;document.getElementById('idInfo').textContent=`Busca: ${d.art}`;const sent=document.getElementById('idSent');sent.innerHTML='';d.s.forEach((w,i)=>{const span=document.createElement('span');span.className='id-word';span.textContent=w+' ';span.onclick=()=>checkId(i,span);sent.appendChild(span);});}
function checkId(i,span){if(idDone)return;document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected'));span.classList.add('selected');if(i===idData[idIdx].c){idDone=true;span.classList.add('id-ok');fb('fbId','¡Correcto! +5 XP',true);if(!xpTracker.id.has(idIdx)){xpTracker.id.add(idIdx);pts(5);}sfx('ok');}else{span.classList.add('id-no');fb('fbId','Ese no es el término solicitado.',false);sfx('no');}}
function nextId(){sfx('click');idIdx++;showId();document.getElementById('fbId').classList.remove('show');}
function resetId(){sfx('click');idIdx=0;showId();document.getElementById('fbId').classList.remove('show');}

// ===================== COMPLETA =====================
const cmpData=[
  {s:'Una promesa sin ___ no se puede incumplir.',opts:['dueño','precio','fecha'],c:2},
  {s:'Cinco páginas que copian lo mismo son un ___.',opts:['eco','estudio','archivo'],c:0},
  {s:'Un punto de inflexión se reconoce mirando para ___.',opts:['adelante','atrás','arriba'],c:1},
  {s:'En los dos inviernos se rompió la ___.',opts:['confianza','máquina','ley'],c:0},
  {s:'La primera pregunta es quién lo ___.',opts:['compra','lee','dice'],c:2},
  {s:'Saber qué gana no vuelve la afirmación ___.',opts:['urgente','falsa','larga'],c:1},
  {s:'La máquina aprende de ___ que alguien eligió.',opts:['reglas','ejemplos','órdenes'],c:1},
  {s:'Esta misión no afirma si estamos en los albores: da la ___ para medirlo.',opts:['vara','fecha','respuesta'],c:0}
];
let cmpIdx=0,cmpSel=-1,cmpDone=false;
function showCmp(){var _fbC=document.getElementById('fbCmp');if(_fbC)_fbC.classList.remove('show');if(cmpIdx>=cmpData.length){document.getElementById('cmpSent').innerHTML='🎉 ¡Completado!';document.getElementById('cmpOpts').innerHTML='';fin('s-completa');return;}const d=cmpData[cmpIdx];document.getElementById('cmpProg').textContent=`Oración ${cmpIdx+1} de ${cmpData.length}`;document.getElementById('cmpSent').innerHTML=d.s.replace('___','<span class="blank">___</span>');const opts=document.getElementById('cmpOpts');opts.innerHTML='';cmpSel=-1;cmpDone=false;d.opts.forEach((o,i)=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=o;b.onclick=()=>{if(cmpDone)return;document.querySelectorAll('.cmp-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');cmpSel=i;sfx('click');};opts.appendChild(b);});}
// Misma razón que en el quiz: la corrección se lee, no se persigue.
function nextCmp(){
  if(!cmpDone)return fb('fbCmp','Primero toca «Verificar».',false);
  cmpIdx++; cmpSel=-1; cmpDone=false; showCmp();
}
function checkCmp(){if(cmpSel<0)return fb('fbCmp','Selecciona una opción.',false);cmpDone=true;const opts=document.querySelectorAll('.cmp-opt');if(cmpSel===cmpData[cmpIdx].c){opts[cmpSel].classList.add('correct');document.getElementById('cmpSent').innerHTML=cmpData[cmpIdx].s.replace('___',`<span class="blank" style="color:var(--jade);border-color:var(--jade)">${opts[cmpSel].textContent}</span>`);fb('fbCmp','¡Correcto! +5 XP',true);if(!xpTracker.cmp.has(cmpIdx)){xpTracker.cmp.add(cmpIdx);pts(5);}sfx('ok');}else{opts[cmpSel].classList.add('wrong');opts[cmpData[cmpIdx].c].classList.add('correct');fb('fbCmp','Incorrecto. Revisa bien la respuesta.',false);sfx('no');}}

// ===================== WIDGETS =====================
// Widget 1: Ordenar secuencias
const routeSets = [
  { label: 'Ordena el termómetro de la promesa', steps: IA_TERMOMETRO.map((t, i) => (i + 1) + '. ' + t.pregunta) },
  { label: 'Ordena qué hacés con una noticia', steps: ['1. Mirar la fecha del hecho, no la del artículo', '2. Buscar quién lo dice, con su nombre', '3. Preguntarse qué gana diciéndolo', '4. Buscar el documento, no el resumen', '5. Si es promesa, apuntar la fecha'] }
];
let currentRouteIdx=0,routeItems=[];
function buildRoute(){routeItems=_shuffle([...routeSets[currentRouteIdx].steps]);renderRoute();const fbEl=document.getElementById('fbRoute');if(fbEl)fbEl.classList.remove('show');}
function renderRoute(){const list=document.getElementById('routeList');if(!list)return;list.innerHTML='';routeItems.forEach((step,i)=>{const div=document.createElement('div');div.className='sort-item';div.innerHTML=`<div class="sort-arrows"><button class="sort-arrow" onclick="routeMove(${i},-1)"${i===0?' disabled':''}>▲</button><button class="sort-arrow" onclick="routeMove(${i},1)"${i===routeItems.length-1?' disabled':''}>▼</button></div><div class="sort-step-num">${i+1}.</div><div class="sort-item-txt">${step}</div>`;list.appendChild(div);});}
function routeMove(idx,dir){sfx('click');const ni=idx+dir;if(ni<0||ni>=routeItems.length)return;[routeItems[idx],routeItems[ni]]=[routeItems[ni],routeItems[idx]];renderRoute();}
function checkRoute(){const correct=routeSets[currentRouteIdx].steps;const isOk=routeItems.every((s,i)=>s===correct[i]);if(isOk){fb('fbRoute','¡Perfecto! Orden correcto. +4 XP',true);if(!xpTracker.wgt.has('route_'+currentRouteIdx)){xpTracker.wgt.add('route_'+currentRouteIdx);pts(4);}sfx('fan');fin('s-widgets');unlockAchievement('widgets_master');}else{fb('fbRoute','Hay pasos fuera de orden. Revisa el arreglo.',false);sfx('no');}}
function nextRoute(){sfx('click');currentRouteIdx=(currentRouteIdx+1)%routeSets.length;buildRoute();showToast('🔄 Secuencia: '+routeSets[currentRouteIdx].label);}

// Widget 2: Identifica el concepto
const neuronPartes = (function () {
  const nombres = IA_TERMOMETRO.map(t => t.pregunta);
  const p = [];
  IA_TERMOMETRO.forEach(t => {
    p.push({ desc: t.porque, ans: t.pregunta, opts: nombres.slice() });
    p.push({ desc: 'Suena así cuando la respuesta es NO: ' + t.no, ans: t.pregunta, opts: nombres.slice() });
  });
  return p;
})();
let neuronIdx=0,neuronDone=false;
function showNeuron(){neuronDone=false;if(neuronIdx>=neuronPartes.length){const el=document.getElementById('neuronDesc');if(el)el.textContent='🎉 ¡Ya reconocés cada pregunta por su pista!';const opts=document.getElementById('neuronOpts');if(opts)opts.innerHTML='';fin('s-widgets');return;}const d=neuronPartes[neuronIdx];const prog=document.getElementById('neuronProg');if(prog)prog.textContent=`Pista ${neuronIdx+1} de ${neuronPartes.length}`;const desc=document.getElementById('neuronDesc');if(desc)desc.textContent=d.desc;const opts=document.getElementById('neuronOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=opt;b.onclick=()=>checkNeuron(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuron');if(fbEl)fbEl.classList.remove('show');}
function checkNeuron(opt,btn,d){if(neuronDone)return;neuronDone=true;document.querySelectorAll('#neuronOpts .cmp-opt').forEach(b=>{if(b.textContent===d.ans)b.classList.add('correct');else if(b===btn&&b.textContent!==d.ans)b.classList.add('wrong');});const isOk=opt===d.ans;if(isOk){fb('fbNeuron','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuron_'+neuronIdx)){xpTracker.wgt.add('neuron_'+neuronIdx);pts(3);}sfx('ok');}else{fb('fbNeuron','La respuesta correcta es: '+d.ans,false);sfx('no');}}
function nextNeuron(){sfx('click');neuronIdx++;showNeuron();}
function resetNeuron(){sfx('click');neuronIdx=0;showNeuron();}

// Widget 3: Concepto → Significado
const neuroPairs = (function () {
  /* Una frase de verdad, y la pregunta del termómetro que le FALTA. Es lo que
     el alumno va a hacer con el teléfono en la mano. */
  const ops = IA_TERMOMETRO.map(t => t.pregunta);
  const q = k => IA_TERMOMETRO.find(t => t.k === k).pregunta;
  return [
    {trans:'«Está a la vuelta de la esquina.»',func:q('cuando'),opts:ops.slice()},
    {trans:'«Dicen que los expertos ya lo dan por hecho.»',func:q('quien'),opts:ops.slice()},
    {trans:'«Lo leí en cinco páginas distintas, todas decían lo mismo.»',func:q('comprueba'),opts:ops.slice()},
    {trans:'«Lo anuncia la empresa que vende el curso.»',func:q('gana'),opts:ops.slice()},
    {trans:'«Un investigador con nombre lo escribió y su empresa contestó.»',func:q('cuando'),opts:ops.slice()},
    {trans:'«Según un estudio, sin decir cuál.»',func:q('comprueba'),opts:ops.slice()}
  ];
})();
let neuroIdx=0,neuroDone=false;
function showNeuro(){neuroDone=false;if(neuroIdx>=neuroPairs.length){const el=document.getElementById('neuroTrans');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('neuroOpts');if(opts)opts.innerHTML='';return;}const d=neuroPairs[neuroIdx];const prog=document.getElementById('neuroProg');if(prog)prog.textContent=`${neuroIdx+1} de ${neuroPairs.length}`;const trans=document.getElementById('neuroTrans');if(trans)trans.textContent=d.trans;const opts=document.getElementById('neuroOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkNeuro(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuro');if(fbEl)fbEl.classList.remove('show');}
function checkNeuro(opt,btn,d){if(neuroDone)return;neuroDone=true;document.querySelectorAll('#neuroOpts .qz-opt').forEach(b=>{if(b.textContent===d.func)b.classList.add('correct');else if(b===btn&&b.textContent!==d.func)b.classList.add('wrong');});const isOk=opt===d.func;if(isOk){fb('fbNeuro','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuro_'+neuroIdx)){xpTracker.wgt.add('neuro_'+neuroIdx);pts(3);}sfx('ok');}else{fb('fbNeuro','Correcto: '+d.func,false);sfx('no');}setTimeout(()=>{neuroIdx++;showNeuro();},1800);}
function resetNeuro(){sfx('click');neuroIdx=0;showNeuro();}

// Widget 4: Fuente → ¿Renovable o no renovable?
const enfermedadData = (function () {
  /* La afirmación del dossier → cuánto trae para comprobarse. Las tres
     opciones son siempre las mismas, que es lo que hay que aprender a ver. */
  const opts = ['Trae mucho: institución, fecha y documento', 'Trae algo: varios medios y una fecha', 'No trae casi nada'];
  const nom = { alta: opts[0], media: opts[1], baja: opts[2] };
  return IA_HOY.map(h => ({ disease: h.afirma, characteristic: nom[h.comprobable], opts: opts.slice() }));
})();
let enferIdx=0,enferDone=false;
function showEnfer(){enferDone=false;if(enferIdx>=enfermedadData.length){const el=document.getElementById('enferDisease');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('enferOpts');if(opts)opts.innerHTML='';return;}const d=enfermedadData[enferIdx];const prog=document.getElementById('enferProg');if(prog)prog.textContent=`${enferIdx+1} de ${enfermedadData.length}`;const dis=document.getElementById('enferDisease');if(dis)dis.textContent=d.disease;const opts=document.getElementById('enferOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkEnfer(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbEnfer');if(fbEl)fbEl.classList.remove('show');}
function checkEnfer(opt,btn,d){if(enferDone)return;enferDone=true;document.querySelectorAll('#enferOpts .qz-opt').forEach(b=>{if(b.textContent===d.characteristic)b.classList.add('correct');else if(b===btn&&b.textContent!==d.characteristic)b.classList.add('wrong');});const isOk=opt===d.characteristic;if(isOk){fb('fbEnfer','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('enfer_'+enferIdx)){xpTracker.wgt.add('enfer_'+enferIdx);pts(3);}sfx('ok');}else{fb('fbEnfer','Correcto: '+d.characteristic,false);sfx('no');}setTimeout(()=>{enferIdx++;showEnfer();},1800);}
function resetEnfer(){sfx('click');enferIdx=0;showEnfer();}

// ===================== RETO FINAL =====================
const retoPairs=[
  {label:['Se SABE hoy','Se AFIRMA sobre el futuro'],btnA:'📎 Se sabe',btnB:'🔮 Se afirma',colA:'sabe',colB:'afirma',
   words:[{w:'Aprende de ejemplos que alguien eligió',t:'sabe'},{w:'Va a mejorarse sola sin nadie',t:'afirma'},{w:'Se equivoca con lo que no vio',t:'sabe'},{w:'En dos años lo hará todo',t:'afirma'},{w:'Predice, no comprueba',t:'sabe'},{w:'Va a volverse más lista que cualquiera',t:'afirma'},{w:'La entrena gente',t:'sabe'},{w:'El cambio se acelerará solo',t:'afirma'},{w:'El error cae siempre sobre los mismos',t:'sabe'},{w:'Va a resolver todos los problemas',t:'afirma'}]},
  {label:['Trae con qué comprobarse','No trae nada que abrir'],btnA:'📎 Comprobable',btnB:'💨 Eco',colA:'comp',colB:'eco',
   words:[{w:'El texto de una ley con su artículo',t:'comp'},{w:'«Dicen que los expertos creen»',t:'eco'},{w:'Un estudio con su institución y su fecha',t:'comp'},{w:'«Está a la vuelta de la esquina»',t:'eco'},{w:'Una publicación firmada, con fecha',t:'comp'},{w:'Cinco blogs repitiendo lo mismo',t:'eco'},{w:'Un anuncio en el sitio de la alcaldía',t:'comp'},{w:'Un titular sin autor',t:'eco'},{w:'Un informe publicado que se puede abrir',t:'comp'},{w:'«Según un estudio», sin decir cuál',t:'eco'}]},
  {label:['Fue un punto de inflexión','Fue un invierno'],btnA:'🧭 Inflexión',btnB:'❄️ Invierno',colA:'inf',colB:'inv',
   words:[{w:'Se juntaron datos, cómputo y algoritmos',t:'inf'},{w:'Se prometió más de lo que se podía',t:'inv'},{w:'Después de eso todo se hizo distinto',t:'inf'},{w:'Se cortó el dinero y el campo se paró',t:'inv'},{w:'Una idea vieja por fin tuvo con qué',t:'inf'},{w:'La gente dejó de creerle al campo',t:'inv'},{w:'Se reconoció años después',t:'inf'},{w:'Lo que se rompió fue la confianza',t:'inv'},{w:'Cambió lo que se podía hacer',t:'inf'},{w:'Quedó un campo sin dinero y sin fama',t:'inv'}]}
];
let currentRetoPairIdx=0,retoPool=[],retoOk=0,retoErr=0,retoTimerInt=null,retoSec=30,retoRunning=false,retoCurrent=null;
function updateRetoButtons(){const pair=retoPairs[currentRetoPairIdx];document.querySelectorAll('.reto-btns .btn')[0].textContent=pair.btnA;document.querySelectorAll('.reto-btns .btn')[1].textContent=pair.btnB;document.querySelectorAll('.reto-btns .btn')[0].onclick=()=>ansReto(pair.colA);document.querySelectorAll('.reto-btns .btn')[1].onclick=()=>ansReto(pair.colB);}
function startReto(){if(retoRunning)return;sfx('click');retoRunning=true;retoOk=0;retoErr=0;retoSec=30;retoPool=_shuffle([...retoPairs[currentRetoPairIdx].words,...retoPairs[currentRetoPairIdx].words]);showRetoWord();retoTimerInt=setInterval(()=>{retoSec--;sfx('tick');document.getElementById('retoTimer').textContent='⏱ '+retoSec;if(retoSec<=10)document.getElementById('retoTimer').style.color='var(--red)';if(retoSec<=0){clearInterval(retoTimerInt);endReto();}},1000);}
function showRetoWord(){if(retoPool.length===0)retoPool=_shuffle([...retoPairs[currentRetoPairIdx].words,...retoPairs[currentRetoPairIdx].words]);retoCurrent=retoPool.pop();document.getElementById('retoWord').textContent=retoCurrent.w;}
function ansReto(t){if(!retoRunning||!retoCurrent)return;const firstPlay=!xpTracker.reto.has(currentRetoPairIdx);if(t===retoCurrent.t){sfx('ok');retoOk++;if(firstPlay)pts(1);}else{sfx('no');retoErr++;if(firstPlay)pts(-1);}document.getElementById('retoScore').textContent=`✅ ${retoOk} correctas | ❌ ${retoErr} errores`;showRetoWord();}
/* El elogio del Reto depende del resultado. Antes decía «¡Bien hecho!»
   con 0 de 8, en verde y con su logro: un elogio que no distingue
   acertar de no acertar le enseña al alumno que el elogio no significa
   nada. La escala es la misma que ya usa la Constancia. */
function _retoElogio(pct){
  if(pct>=90) return '¡Excelente!';
  if(pct>=70) return '¡Bien hecho!';
  if(pct>=40) return 'Vas bien, sigue practicando.';
  return 'Todavía no. Repasa y vuelve a intentarlo.';
}
function endReto(){retoRunning=false;document.getElementById('retoWord').textContent='🏁 ¡Tiempo!';document.getElementById('retoTimer').style.color='var(--pri)';xpTracker.reto.add(currentRetoPairIdx);const total=retoOk+retoErr;const pct=total>0?Math.round((retoOk/total)*100):0;fb('fbReto',`Resultado: ${retoOk}/${total} (${pct}%) ${_retoElogio(pct)}`,pct>=40);fin('s-reto');sfx('fan');if(pct>=70) unlockAchievement('reto_hero');}
function nextRetoPair(){sfx('click');clearInterval(retoTimerInt);retoRunning=false;retoSec=30;retoOk=0;retoErr=0;currentRetoPairIdx=(currentRetoPairIdx+1)%retoPairs.length;updateRetoButtons();document.getElementById('retoTimer').textContent='⏱ 30';document.getElementById('retoTimer').style.color='var(--pri)';document.getElementById('retoWord').textContent='¡Prepárate!';document.getElementById('retoScore').textContent='✅ 0 correctas | ❌ 0 errores';document.getElementById('fbReto').classList.remove('show');showToast(`🔄 Pareja: ${retoPairs[currentRetoPairIdx].label[0]} vs ${retoPairs[currentRetoPairIdx].label[1]}`);}
function resetReto(){sfx('click');clearInterval(retoTimerInt);retoRunning=false;retoSec=30;retoOk=0;retoErr=0;document.getElementById('retoTimer').textContent='⏱ 30';document.getElementById('retoTimer').style.color='var(--pri)';document.getElementById('retoWord').textContent='¡Prepárate!';document.getElementById('retoScore').textContent='✅ 0 correctas | ❌ 0 errores';document.getElementById('fbReto').classList.remove('show');}

// ===================== TASK GENERATOR =====================
const identifyTaskDB=[
  {s:'Una promesa sin fecha no se puede incumplir.',type:'fecha'},
  {s:'Cinco páginas que copian lo mismo son un eco.',type:'eco'},
  {s:'Un punto de inflexión se reconoce mirando atrás.',type:'inflexión'},
  {s:'En un invierno se rompió la confianza.',type:'confianza'},
  {s:'La primera pregunta es quién lo dice.',type:'quién'},
  {s:'Saber qué gana pone lo dicho en su sitio.',type:'gana'},
  {s:'La singularidad afirma algo del futuro.',type:'singularidad'},
  {s:'Contenido patrocinado es lo que alguien pagó por publicar.',type:'patrocinado'},
  {s:'Dos noticias contrarias miden cosas distintas.',type:'distintas'},
  {s:'La máquina aprende de ejemplos que alguien eligió.',type:'ejemplos'}
];
const classifyTaskDB=[
  {w:'Singularidad',gen:'Un futuro que se acelera solo',n:'«En dos años lo hará todo»',g:'Hoy no se puede comprobar',t:''},
  {w:'Punto de inflexión',gen:'El día en que algo se pudo hacer',n:'Cuando se juntaron las tres patas',g:'Se reconoce mirando atrás',t:''},
  {w:'Invierno',gen:'Se prometió de más y el campo se paró',n:'Dos veces en esta historia',g:'Se rompe la confianza',t:''},
  {w:'Eco',gen:'Muchas páginas copiando sin fuente',n:'Las listas de «avances del mes»',g:'Parecen muchas fuentes y son ninguna',t:''},
  {w:'Termómetro',gen:'Las cuatro preguntas de una afirmación',n:'Quién, qué gana, cuándo, con qué',g:'Sirve hasta para un remedio milagroso',t:''},
  {w:'Contenido patrocinado',gen:'Lo que alguien pagó por publicar',n:'Un anuncio de becas',g:'Dice qué preguntar, no que sea falso',t:''},
  {w:'Fuente original',gen:'El documento que responde por el dato',n:'La ley, el estudio, la firma',g:'Se abre eso, no el resumen',t:''}
];
/* ⚠️ Cada fila lleva sus `opts`, y no es adorno: `genCompleteTask` pinta
   «📝 Opciones: ${item.opts.join(' | ')}», así que una fila sin ese campo
   **revienta la sección entera** del Generador de Tareas —el maestro toca
   «Completa la oración» y no sale nada, sin un solo aviso en la pantalla—.
   Estaba así en doce misiones publicadas; lo vigila
   `_dev/verifica-bancos-tareas.js`. */
const completeTaskDB=[
  {s:'Una promesa sin ___ no se puede incumplir.',opts:['título','fecha','nombre'],ans:'fecha'},
  {s:'Muchas páginas copiando lo mismo son un ___.',opts:['documento','dossier','eco'],ans:'eco'},
  {s:'Un punto de inflexión se reconoce mirando para ___.',opts:['atrás','adelante','arriba'],ans:'atrás'},
  {s:'En los inviernos se rompió la ___.',opts:['fecha','confianza','máquina'],ans:'confianza'},
  {s:'La primera pregunta es quién lo ___.',opts:['comparte','repite','dice'],ans:'dice'},
  {s:'La máquina aprende de ___ que alguien eligió.',opts:['ejemplos','reglas','órdenes'],ans:'ejemplos'},
  {s:'Lo que alguien pagó por publicar es contenido ___.',opts:['comprobado','patrocinado','original'],ans:'patrocinado'},
  {s:'Dos noticias contrarias miden cosas ___.',opts:['falsas','iguales','distintas'],ans:'distintas'},
  {s:'Para comprobar se abre la fuente ___.',opts:['original','copiada','traducida'],ans:'original'},
  {s:'La singularidad afirma algo del ___.',opts:['presente','futuro','pasado'],ans:'futuro'}
];
/* ⚠️ Eran nueve CADENAS sueltas y `genExplainTask` lee `item.q` e `item.ans`:
   el alumno recibía la tarea con «undefined» donde iba la pregunta y el
   maestro sin la pauta. No daba ningún error —el archivo compila, la sección
   se pinta— y se descubrió con `_dev/verifica-bancos-tareas.js`, que lee qué
   campos PINTA cada función en vez de fiarse de una lista escrita. */
const explainQuestions=[
  {q:'¿Por qué conviene prometer sin fecha?',ans:'Porque una promesa sin fecha no se puede incumplir: nunca llega el día en que se le pueda pedir cuentas. Lo honesto es ponerle fecha a lo que se promete.'},
  {q:'¿Qué diferencia hay entre cinco fuentes y un eco?',ans:'Cinco fuentes de verdad averiguaron cada una por su lado. Un eco son cinco páginas copiando a la misma. Se distingue mirando si alguna abre el documento original.'},
  {q:'¿Por qué un punto de inflexión se reconoce después?',ans:'Porque mientras está pasando no se sabe en qué va a terminar. Se reconoce mirando para atrás, cuando ya se ve qué cambió y qué no.'},
  {q:'¿Qué se rompió en los dos inviernos?',ans:'La confianza. Se había prometido más de lo que se podía hacer, y cuando no llegó, el dinero y el interés se fueron. Por eso las promesas de hoy se fechan.'},
  {q:'¿Por qué saber qué gana alguien no lo vuelve falso?',ans:'Porque quien gana algo con una noticia también puede estar diciendo la verdad. Saber qué gana sirve para mirar con más cuidado, no para dar por falso lo que dice.'},
  {q:'¿Por qué esta misión no dice si estamos en los albores?',ans:'Porque no se pudo abrir ninguna de las fuentes desde aquí. Afirmar algo sin haberlo leído es lo que esta misión enseña a no hacer. Comprobarlo es tu trabajo.'}
];
let ansVisible=false;
function genTask(){sfx('click');const type=document.getElementById('tgType').value;const count=parseInt(document.getElementById('tgCount').value);ansVisible=false;const out=document.getElementById('tgOut');out.innerHTML='';if(type==='identify')genIdentifyTask(out,count);else if(type==='classify')genClassifyTask(out,count);else if(type==='complete')genCompleteTask(out,count);else if(type==='explain')genExplainTask(out,count);fin('s-tareas');}
function _instrBlock(out,title,lines){const ib=document.createElement('div');ib.className='tg-instruction-block';ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join('');out.appendChild(ib);}
function genIdentifyTask(out,count){_instrBlock(out,'Instrucción',['Copia cada oración en tu cuaderno y subraya el concepto que se pide.','Escribe al lado qué pregunta del termómetro le falta.','<strong>Ejemplo:</strong> Una promesa sin fecha no se puede incumplir. → <span style="color:var(--jade);font-weight:700;">fecha</span>']);_pick(identifyTaskDB,Math.min(count,identifyTaskDB.length)).forEach((item,i)=>{const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.type}</div></div>`;out.appendChild(div);});}
function genClassifyTask(out,count){_instrBlock(out,'Instrucción',['Copia la tabla en tu cuaderno.','Para cada afirmación, completa quién la dice, qué gana, para cuándo y con qué se comprueba.']);const items=_pick(classifyTaskDB,Math.min(count,classifyTaskDB.length));const wrap=document.createElement('div');wrap.style.overflowX='auto';const th=(t,extra='')=>`<th style="padding:0.3rem 0.4rem;border:1px solid var(--border);font-size:0.72rem;text-align:center;${extra}">${t}</th>`;let html=`<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:520px;"><thead><tr style="background:var(--pri-gl);">${th('La afirmación','text-align:left;')}${th('¿Quién lo dice?')}${th('¿Qué gana?')}${th('¿Para cuándo?')}${th('¿Con qué se comprueba?')}</tr></thead><tbody>`;items.forEach(it=>{html+=`<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td>`+Array(4).fill(`<td style="padding:0.4rem;border:1px solid var(--border);min-width:50px;"></td>`).join('')+'</tr>';});html+='</tbody></table>';wrap.innerHTML=html;out.appendChild(wrap);const ans=document.createElement('div');ans.className='tg-answer';ans.style.marginTop='0.8rem';ans.innerHTML='<strong>✅ Respuestas:</strong><br>'+items.map(it=>`<strong>${it.w}:</strong> Qué es: ${it.gen} | Clase: ${it.n} | Desde cuándo: ${it.g} | Dato: ${it.t}`).join('<br>');out.appendChild(ans);}
function genCompleteTask(out,count){_instrBlock(out,'Instrucción',['Copia y resuelve en tu cuaderno.','Cada oración tiene un espacio ___. Escribe la opción correcta.']);const pool=_shuffle([...completeTaskDB]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';const sent=item.s.replace('___','<span class="tg-blank" style="min-width:90px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${sent}</strong><div style="margin-top:0.4rem;font-size:0.82rem;color:var(--gray);">📝 Opciones: <strong>${item.opts.join(' | ')}</strong></div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function genExplainTask(out,count){_instrBlock(out,'Instrucción',['Copia las preguntas en tu cuaderno y responde cada una.']);const pool=_shuffle([...explainQuestions]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.3rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function toggleAns(){ansVisible=!ansVisible;document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none');sfx('click');}

// ===================== SOPA DE LETRAS =====================
const sopaSets=[
  {size:12,grid:[
    ['G','U','N','V','M','C','F','Y','I','U','P','Ñ'],
    ['N','O','I','X','E','L','F','N','I','S','O','F'],
    ['P','R','O','M','E','S','A','B','R','X','U','Q'],
    ['Q','C','L','O','E','T','N','E','U','F','G','O'],
    ['P','G','D','S','M','J','O','S','S','O','I','P'],
    ['D','A','D','I','R','A','L','U','G','N','I','S'],
    ['G','W','U','W','T','E','K','Y','V','R','U','H'],
    ['P','A','X','M','K','Ñ','S','E','E','E','R','X'],
    ['V','S','N','T','N','Z','L','V','I','I','N','D'],
    ['E','Z','T','U','X','N','H','O','U','V','D','K'],
    ['R','X','Q','Z','X','Q','A','W','U','N','J','Y'],
    ['C','D','A','H','C','E','F','U','Ñ','I','O','D']
  ],words:[
    {w:'SINGULARIDAD',cells:[[5,11],[5,10],[5,9],[5,8],[5,7],[5,6],[5,5],[5,4],[5,3],[5,2],[5,1],[5,0]]},
    {w:'INFLEXION',cells:[[1,8],[1,7],[1,6],[1,5],[1,4],[1,3],[1,2],[1,1],[1,0]]},
    {w:'PROMESA',cells:[[2,0],[2,1],[2,2],[2,3],[2,4],[2,5],[2,6]]},
    {w:'INVIERNO',cells:[[11,9],[10,9],[9,9],[8,9],[7,9],[6,9],[5,9],[4,9]]},
    {w:'FUENTE',cells:[[3,9],[3,8],[3,7],[3,6],[3,5],[3,4]]},
    {w:'FECHA',cells:[[11,6],[11,5],[11,4],[11,3],[11,2]]}
  ]},
  {size:12,grid:[
    ['I','H','A','J','M','D','S','W','E','M','Q','T'],
    ['F','D','R','K','B','R','V','F','X','J','R','M'],
    ['D','P','S','U','F','J','J','D','R','W','F','Z'],
    ['I','U','Y','R','M','U','O','Y','A','Z','Z','J'],
    ['J','I','V','U','V','S','R','S','B','C','Q','N'],
    ['C','J','H','S','S','X','O','R','O','H','Z','D'],
    ['W','N','S','I','B','G','M','K','R','Y','J','R'],
    ['A','P','E','M','N','D','U','I','P','X','V','O'],
    ['K','R','V','Q','Y','Ñ','R','H','M','B','Ñ','Z'],
    ['O','U','C','F','Y','L','Ñ','C','O','D','K','A'],
    ['U','P','O','O','T','I','H','Q','C','Ñ','L','L'],
    ['X','V','W','X','M','A','M','R','I','F','T','P']
  ],words:[
    {w:'COMPROBAR',cells:[[10,8],[9,8],[8,8],[7,8],[6,8],[5,8],[4,8],[3,8],[2,8]]},
    {w:'HITO',cells:[[10,6],[10,5],[10,4],[10,3]]},
    {w:'RUMOR',cells:[[8,6],[7,6],[6,6],[5,6],[4,6]]},
    {w:'PLAZO',cells:[[11,11],[10,11],[9,11],[8,11],[7,11]]},
    {w:'FIRMA',cells:[[11,9],[11,8],[11,7],[11,6],[11,5]]},
    {w:'DOSSIER',cells:[[2,7],[3,6],[4,5],[5,4],[6,3],[7,2],[8,1]]}
  ]}
];
let currentSopaSetIdx=0,sopaFoundWords=new Set();
let sopaFirstClickCell=null,sopaPointerStartCell=null,sopaPointerMoved=false,sopaSelectedCells=[];
function getSopaCellSize(){const container=document.getElementById('sopaGrid');if(!container||!container.parentElement)return 28;const avail=container.parentElement.clientWidth-16;const set=sopaSets[currentSopaSetIdx];return Math.max(20,Math.min(32,Math.floor(avail/set.size)));}
function buildSopa(){const set=sopaSets[currentSopaSetIdx];const grid=document.getElementById('sopaGrid');grid.innerHTML='';const sz=getSopaCellSize();grid.style.gridTemplateColumns=`repeat(${set.size},${sz}px)`;grid.style.gridTemplateRows=`repeat(${set.size},${sz}px)`;sopaFirstClickCell=null;sopaSelectedCells=[];for(let r=0;r<set.size;r++)for(let c=0;c<set.size;c++){const cell=document.createElement('div');cell.className='sopa-cell';cell.style.width=sz+'px';cell.style.height=sz+'px';cell.style.fontSize=Math.max(11,sz-10)+'px';cell.textContent=set.grid[r][c];cell.dataset.row=r;cell.dataset.col=c;const alreadyFound=set.words.find(w=>sopaFoundWords.has(w.w)&&w.cells.some(([wr,wc])=>wr===r&&wc===c));if(alreadyFound)cell.classList.add('sopa-found');grid.appendChild(cell);}setupSopaEvents();const wl=document.getElementById('sopaWords');wl.innerHTML='';set.words.forEach(wObj=>{const sp=document.createElement('span');sp.className='sopa-w'+(sopaFoundWords.has(wObj.w)?' found':'');sp.id='sw-'+wObj.w;sp.textContent=wObj.w;wl.appendChild(sp);});}
function setupSopaEvents(){const grid=document.getElementById('sopaGrid');grid.onpointerdown=e=>{const cell=e.target.closest('.sopa-cell');if(!cell)return;e.preventDefault();grid.setPointerCapture(e.pointerId);sopaPointerStartCell=cell;sopaPointerMoved=false;cell.classList.add('sopa-sel');sopaSelectedCells=[cell];};grid.onpointermove=e=>{if(!sopaPointerStartCell)return;e.preventDefault();const el=document.elementFromPoint(e.clientX,e.clientY);const cell=el?el.closest('.sopa-cell'):null;if(!cell)return;const sr=parseInt(sopaPointerStartCell.dataset.row),sc=parseInt(sopaPointerStartCell.dataset.col);const er=parseInt(cell.dataset.row),ec=parseInt(cell.dataset.col);if(sr!==er||sc!==ec)sopaPointerMoved=true;document.querySelectorAll('.sopa-cell.sopa-sel').forEach(c=>c.classList.remove('sopa-sel'));sopaSelectedCells=[];getSopaPath(sr,sc,er,ec).forEach(([r,c])=>{const pc=document.querySelector(`#sopaGrid [data-row="${r}"][data-col="${c}"]`);if(pc){pc.classList.add('sopa-sel');sopaSelectedCells.push(pc);}});};grid.onpointerup=e=>{if(!sopaPointerStartCell)return;e.preventDefault();grid.releasePointerCapture(e.pointerId);if(sopaPointerMoved&&sopaSelectedCells.length>1){checkSopaSelection();}else{const cell=sopaPointerStartCell;document.querySelectorAll('.sopa-cell.sopa-sel').forEach(c=>c.classList.remove('sopa-sel'));sopaSelectedCells=[];if(!sopaFirstClickCell){sopaFirstClickCell=cell;cell.classList.add('sopa-start');}else if(sopaFirstClickCell===cell){cell.classList.remove('sopa-start');sopaFirstClickCell=null;}else{const sr=parseInt(sopaFirstClickCell.dataset.row),sc=parseInt(sopaFirstClickCell.dataset.col);const er=parseInt(cell.dataset.row),ec=parseInt(cell.dataset.col);sopaFirstClickCell.classList.remove('sopa-start');sopaFirstClickCell=null;getSopaPath(sr,sc,er,ec).forEach(([r,c])=>{const pc=document.querySelector(`#sopaGrid [data-row="${r}"][data-col="${c}"]`);if(pc){pc.classList.add('sopa-sel');sopaSelectedCells.push(pc);}});checkSopaSelection();}}sopaPointerStartCell=null;sopaPointerMoved=false;};}
function getSopaPath(r1,c1,r2,c2){const dr=Math.sign(r2-r1),dc=Math.sign(c2-c1);const lr=Math.abs(r2-r1),lc=Math.abs(c2-c1);if(lr!==0&&lc!==0&&lr!==lc)return[[r1,c1]];const len=Math.max(lr,lc);const path=[];for(let i=0;i<=len;i++)path.push([r1+dr*i,c1+dc*i]);return path;}
function checkSopaSelection(){const set=sopaSets[currentSopaSetIdx];const word=sopaSelectedCells.map(c=>c.textContent).join('');const wordRev=word.split('').reverse().join('');const found=set.words.find(wObj=>!sopaFoundWords.has(wObj.w)&&(wObj.w===word||wObj.w===wordRev));if(found){sopaFoundWords.add(found.w);found.cells.forEach(([r,c])=>{const cell=document.querySelector(`#sopaGrid [data-row="${r}"][data-col="${c}"]`);if(cell){cell.classList.remove('sopa-sel','sopa-start');cell.classList.add('sopa-found');}});const sp=document.getElementById('sw-'+found.w);if(sp)sp.classList.add('found');if(!xpTracker.sopa.has(found.w)){xpTracker.sopa.add(found.w);pts(1);}sfx('ok');if(sopaFoundWords.size===set.words.length){fin('s-sopa');sfx('fan');showToast('🎉 ¡Todas las palabras encontradas!');}else showToast('✅ ¡Encontraste: '+found.w+'!');}else sfx('no');document.querySelectorAll('.sopa-cell.sopa-sel').forEach(c=>c.classList.remove('sopa-sel'));sopaSelectedCells=[];}
function nextSopaSet(){sfx('click');sopaFoundWords=new Set();currentSopaSetIdx=(currentSopaSetIdx+1)%sopaSets.length;buildSopa();showToast('🔄 Nueva sopa cargada');}
let _sopaResizeTimer=null;
window.addEventListener('resize',()=>{clearTimeout(_sopaResizeTimer);_sopaResizeTimer=setTimeout(()=>{if(document.getElementById('s-sopa').classList.contains('active'))buildSopa();},200);});

// ===================== EVALUACIÓN FINAL =====================
const evalTFBank=[
  {q:'Una promesa sin fecha no se puede incumplir.',a:true},
  {q:'Si cinco páginas dicen lo mismo, el dato está comprobado.',a:false},
  {q:'Un punto de inflexión se reconoce mirando atrás.',a:true},
  {q:'En los inviernos de la IA falló la electricidad.',a:false},
  {q:'Saber qué gana ayuda a leerlo, sin volverlo falso.',a:true},
  {q:'Que un texto diga «contenido patrocinado» significa que es mentira.',a:false},
  {q:'Las máquinas aprenden de ejemplos que alguien eligió.',a:true},
  {q:'Ya existen máquinas que se mejoran solas, sin nadie.',a:false},
  {q:'Dos noticias que se contradicen suelen medir cosas distintas.',a:true},
  {q:'La singularidad ya se puede comprobar.',a:false},
  {q:'La fecha del hecho y la del artículo pueden ser distintas.',a:true},
  {q:'Un titular que asusta trae más pruebas que uno aburrido.',a:false},
  {q:'En los inviernos se rompió la confianza.',a:true},
  {q:'Si una afirmación no dice quién la hace, se le puede preguntar igual.',a:false},
  {q:'Ponerle vos una fecha a una promesa te deja juzgarla ese día.',a:true}
];
const evalMCBank=[
  {q:'¿Qué afirma la palabra «singularidad»?',o:['Que una máquina mejore máquinas más rápido de lo que podemos seguir','Que la IA ya siente','Que las computadoras fallarán','Que la IA se apagará sola'],a:0},
  {q:'La primera pregunta del termómetro es…',o:['¿Cuánto cuesta?','¿Es nuevo?','¿Lo comparten muchos?','¿Quién lo dice, con su nombre?'],a:3},
  {q:'Una promesa sin fecha…',o:['Es más seria','No se puede incumplir nunca','Se cumple sola','Vale más'],a:1},
  {q:'Cinco páginas copiando lo mismo son…',o:['Cinco fuentes','Un eco','Una prueba','Un estudio'],a:1},
  {q:'Un punto de inflexión se reconoce…',o:['Por el ruido del día','En la televisión','Mirando para atrás','Cuando lo dice una empresa'],a:2},
  {q:'¿Qué se rompió en los dos inviernos?',o:['Las computadoras','Los cables','Las leyes','La confianza'],a:3},
  {q:'Lo que SÍ se sabe hoy es que la máquina…',o:['Quiere cosas','Aprende de ejemplos que alguien eligió','Se mejora sola','Entiende lo que lee'],a:1},
  {q:'«Contenido patrocinado» quiere decir…',o:['Que es falso','Que alguien pagó por publicarlo y el medio lo dice','Que es del gobierno','Que es viejo'],a:1},
  {q:'Dos noticias del mes se contradicen. Lo más probable es que…',o:['Midan cosas distintas','Una mienta','Las dos mientan','La nueva tenga razón'],a:0},
  {q:'¿Qué hace comprobable a una afirmación?',o:['Que la compartan mucho','Que suene segura','Que traiga quién, cuándo y un documento','Que esté bien escrita'],a:2},
  {q:'Para comprobar hay que abrir…',o:['La fuente original','El resumen','Otro artículo','Un foro'],a:0},
  {q:'Si una promesa no trae plazo, te toca…',o:['Ponerle vos una fecha y volver ese día','Creerla','Descartarla siempre','Compartirla'],a:0},
  {q:'Un titular con la palabra más fuerte busca…',o:['Precisión','Ayudar','Explicar','Que se comparta'],a:3},
  {q:'Esta misión no dice si estamos en los albores porque…',o:['Es secreto','Es difícil','Nadie lo sabe','No importa'],a:2},
  {q:'La fecha que más importa es la…',o:['Del artículo','De la foto','Del hecho','Del comentario'],a:2}
];
const evalCPBank=[
  {q:'Una promesa sin ___ no se puede incumplir.',a:'fecha'},
  {q:'Muchas páginas copiando lo mismo son un ___.',a:'eco'},
  {q:'Un punto de inflexión se reconoce mirando ___.',a:'atrás'},
  {q:'En los inviernos se rompió la ___.',a:'confianza'},
  {q:'La primera pregunta es quién lo ___.',a:'dice'},
  {q:'La segunda es qué ___ diciéndolo.',a:'gana'},
  {q:'La cuarta es con qué se ___.',a:'comprueba'},
  {q:'La máquina aprende de ___.',a:'ejemplos'},
  {q:'Lo que alguien pagó por publicar es contenido ___.',a:'patrocinado'},
  {q:'Para comprobar se abre la fuente ___.',a:'original'},
  {q:'La singularidad afirma algo del ___.',a:'futuro'},
  {q:'Dos noticias contrarias miden cosas ___.',a:'distintas'},
  {q:'De una noticia importa la fecha del ___, no la del artículo.',a:'hecho'},
  {q:'A una afirmación sin dueño no se le puede ___.',a:'preguntar'},
  {q:'La vara para leer lo de hoy son los dos ___.',a:'inviernos'}
];
const evalPRBank=[
  {term:'Singularidad',def:'La afirmación de que el cambio se acelerará solo'},
  {term:'Punto de inflexión',def:'El día en que algo que no se podía hacer se pudo'},
  {term:'Invierno',def:'Cuando se prometió de más y el campo casi se para'},
  {term:'Eco',def:'Muchas páginas copiando lo mismo sin fuente'},
  {term:'Fuente original',def:'El documento que responde por el dato'},
  {term:'Contenido patrocinado',def:'Lo que alguien pagó por publicar'},
  {term:'¿Quién lo dice?',def:'La pregunta que busca a alguien que responda'},
  {term:'¿Qué gana?',def:'La pregunta que pone la afirmación en su sitio'},
  {term:'¿Para cuándo?',def:'La pregunta que deja juzgar una promesa'},
  {term:'¿Con qué se comprueba?',def:'La pregunta que pide un documento'},
  {term:'Fecha del hecho',def:'Cuándo pasó, no cuándo se publicó'},
  {term:'Caducidad',def:'El día de volver a mirar si se cumplió'},
  {term:'Cápsula del tiempo',def:'Tu predicción escrita hoy, con su fecha'},
  {term:'Las tres patas',def:'Datos, cómputo y algoritmos'},
  {term:'Dossier',def:'Las afirmaciones de un mes, con su fecha'}
];

// ══════════ Formas deterministas v1 (M.E.T.A.S, jul 2026) ══════════
const EVAL_FORMAS = 30;
function _evalRng(forma) {
    let s = (forma * 2654435761 + 909090909) >>> 0;
    return function () {
        s = (s + 0x6D2B79F5) >>> 0;
        let t = s;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
const _shuffleF = (arr, rng) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); const tmp = a[i]; a[i] = a[j]; a[j] = tmp; } return a; };
const _pickF = (arr, n, rng) => _shuffleF(arr, rng).slice(0, n);
function _injectFormaSel(fnName, selId, actual, onPick) {
    const ya = document.getElementById(selId);
    if (ya) { ya.value = String(actual); return; }
    const btn = document.querySelector('[onclick*="' + fnName + '()"]');
    if (!btn || !btn.parentNode) return;
    const wrap = document.createElement('label');
    wrap.style.cssText = 'display:inline-flex;align-items:center;gap:6px;margin:0 8px 6px 0;font-weight:700;font-size:0.95rem;';
    let ops = '';
    for (let i = 1; i <= EVAL_FORMAS; i++) ops += '<option value="' + i + '"' + (i === actual ? ' selected' : '') + '>Forma ' + i + '</option>';
    wrap.innerHTML = '📋 <select id="' + selId + '" style="padding:6px 10px;border-radius:8px;border:2px solid #888;font-weight:700;font-size:0.95rem;background:#fff;color:#222;" aria-label="Elegir número de forma exacta (1 a ' + EVAL_FORMAS + ')">' + ops + '</select>';
    btn.parentNode.insertBefore(wrap, btn);
    const sel = wrap.querySelector('select');
    if (sel) sel.addEventListener('change', function () { onPick(parseInt(this.value, 10) || 1); try { saveProgress(); } catch (e) { } });
}
function _evalFormaSelector() { _injectFormaSel('genEval', 'evalFormaSel', evalFormNum, function (v) { evalFormNum = v; }); }

function genEval(){sfx('click');_evalFormaSelector(); const _selF = document.getElementById('evalFormaSel'); if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10))); const cf = evalFormNum; const rng = _evalRng(cf); window._currentEvalForm=cf;evalFormNum = (evalFormNum % EVAL_FORMAS) + 1; _evalFormaSelector();saveProgress();document.getElementById('eval-screen-title').textContent=`🎓 Evaluación Final · Forma ${cf} · En los Albores de la Singularidad`;evalAnsVisible=false;const out=document.getElementById('evalOut');out.innerHTML='';const bar=document.createElement('div');bar.className='eval-score-bar';bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje · 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25 pts</span><span class="eval-score-pill esp-tf">V/F 25 pts</span><span class="eval-score-pill esp-mc">Selección 25 pts</span><span class="eval-score-pill esp-pr">Pareados 25 pts</span></div>`;out.appendChild(bar);const cpItems=_pickF(evalCPBank,5, rng);const s1=document.createElement('div');s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';cpItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='cp';d.dataset.evalIndex=i;const qHtml=item.q.replace('___',`<input class="eval-cp-input" type="text" data-cp="${i}" autocomplete="off">`);d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbCp${i}" aria-live="polite"></div>`;s1.appendChild(d);});out.appendChild(s1);const tfItems=_pickF(evalTFBank,5, rng);const s2=document.createElement('div');s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';tfItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='tf';d.dataset.evalIndex=i;d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="true"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="false"> Falso</label></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbTf${i}" aria-live="polite"></div>`;s2.appendChild(d);});out.appendChild(s2);const mcItems=_pickF(evalMCBank,5, rng);const s3=document.createElement('div');s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';mcItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='mc';d.dataset.evalIndex=i;const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join('');d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbMc${i}" aria-live="polite"></div>`;s3.appendChild(d);});out.appendChild(s3);const prItems=_pickF(evalPRBank,5, rng);const shuffledDefs=_shuffleF(prItems, rng);const letters=['A','B','C','D','E'];const s4=document.createElement('div');s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';const matchCard=document.createElement('div');matchCard.className='eval-item';let colLeft='<div class="eval-match-col"><h4>📌 Términos</h4>';prItems.forEach((item,i)=>{colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> <select class="eval-match-select" data-pr="${i}" aria-label="Respuesta pareada ${i+16}"><option value="">—</option>${letters.map(l=>`<option value="${l}">${l}</option>`).join('')}</select> ${item.term}</div>`;});colLeft+='</div>';let colRight='<div class="eval-match-col"><h4>🔑 Definiciones</h4>';shuffledDefs.forEach((item,i)=>{colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`;});colRight+='</div>';const ansKey=prItems.map((item,i)=>{const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)];return`${i+16}→${letter}`;}).join(' · ');matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div><div class="eval-item-feedback" id="evalFbPr" aria-live="polite"></div>`;s4.appendChild(matchCard);out.appendChild(s4);window._evalPrintData={tf:tfItems,mc:mcItems,cp:cpItems,pr:{terms:prItems,shuffledDefs,letters}};const autoPanel=document.createElement('div');autoPanel.id='evalAutoResult';autoPanel.className='eval-auto-result';autoPanel.innerHTML='<strong>🧮 Evaluación interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato original sin respuestas digitadas.';out.appendChild(autoPanel);fin('s-evaluacion');}
function toggleEvalAns(){evalAnsVisible=!evalAnsVisible;document.querySelectorAll('#evalOut .eval-answer').forEach(el=>el.style.display=evalAnsVisible?'block':'none');sfx('click');}
function normalizeEvalAnswer(v){return(v||'').toString().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\s+/g,' ').replace(/[()]/g,'').trim();}
function isCpCorrect(student,expected){const s=normalizeEvalAnswer(student);const e=normalizeEvalAnswer(expected);if(!s)return false;const variants=new Set([e]);if(e.includes(' '))e.split(' ').forEach(x=>x&&variants.add(x));return variants.has(s)||e.replace(/[^a-z0-9]/g,'')===s.replace(/[^a-z0-9]/g,'');}
function setEvalFeedback(id,ok,msg){const el=document.getElementById(id);if(!el)return;el.textContent=msg;el.className='eval-item-feedback '+(ok?'eval-ok':'eval-no');}
function gradeEval(){if(!window._evalPrintData){showToast('⚠️ Genera una evaluación primero');return;}sfx('click');const d=window._evalPrintData;let total=0;const detail={cp:0,tf:0,mc:0,pr:0};d.cp.forEach((it,i)=>{const input=document.querySelector(`[data-cp="${i}"]`);const ok=isCpCorrect(input?input.value:'',it.a);if(input){input.classList.toggle('eval-input-ok',ok);input.classList.toggle('eval-input-no',!ok);}if(ok){detail.cp++;total+=5;}setEvalFeedback('evalFbCp'+i,ok,ok?'Correcto. +5 pts':'Revisar. Respuesta esperada: '+it.a);});d.tf.forEach((it,i)=>{const selected=document.querySelector(`input[name="tf${i}"]:checked`);const ok=!!selected&&(selected.value==='true')===it.a;if(ok){detail.tf++;total+=5;}setEvalFeedback('evalFbTf'+i,ok,ok?'Correcto. +5 pts':'Revisar. Respuesta esperada: '+(it.a?'Verdadero':'Falso'));});d.mc.forEach((it,i)=>{const selected=document.querySelector(`input[name="mc${i}"]:checked`);const ok=!!selected&&Number(selected.value)===it.a;if(ok){detail.mc++;total+=5;}setEvalFeedback('evalFbMc'+i,ok,ok?'Correcto. +5 pts':'Revisar. Respuesta esperada: '+it.o[it.a]);});const expectedLetters=d.pr.terms.map(it=>d.pr.letters[d.pr.shuffledDefs.findIndex(df=>df.def===it.def)]);expectedLetters.forEach((letter,i)=>{const sel=document.querySelector(`[data-pr="${i}"]`);const ok=!!sel&&sel.value===letter;if(sel){sel.classList.toggle('eval-input-ok',ok);sel.classList.toggle('eval-input-no',!ok);}if(ok){detail.pr++;total+=5;}});const prMsg=`Pareados: ${detail.pr}/5 correctos. ${detail.pr===5?'Excelente. +25 pts':'Clave: '+expectedLetters.map((l,i)=>(i+16)+'→'+l).join(' · ')}`;setEvalFeedback('evalFbPr',detail.pr===5,prMsg);const result=document.getElementById('evalAutoResult');if(result){result.className='eval-auto-result '+(total>=70?'eval-auto-pass':'eval-auto-risk');result.innerHTML=`<strong>Resultado automático: ${total}/100 puntos</strong><br><span>Completar: ${detail.cp*5}/25 · V/F: ${detail.tf*5}/25 · Selección: ${detail.mc*5}/25 · Pareados: ${detail.pr*5}/25</span><br><em>Este resultado es solo para revisión en pantalla; la impresión conserva el formato limpio para papel.</em>`;}if(total>=70){pts(8);showToast('🎯 Evaluación calificada: '+total+'/100');}else showToast('🧮 Evaluación calificada: '+total+'/100. Revisa las respuestas marcadas.');}
function printEval(){if(!window._evalPrintData){showToast('⚠️ Genera una evaluación primero');return;}sfx('click');const forma=window._currentEvalForm||1;const d=window._evalPrintData;let s1=`<div class="sec-title"><span>I. Completar el espacio</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div>`;d.cp.forEach((it,i)=>{const q=it.q.replace('___','<span class="cp-blank"></span>');s1+=`<div class="cp-row"><span class="qn">${i+1}.</span><span class="cp-text">${q}</span></div>`;});let s2=`<div class="sec-title"><span>II. Verdadero o Falso</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div>`;d.tf.forEach((it,i)=>{s2+=`<div class="tf-row"><span class="qn">${i+6}.</span><span class="tf-blank"></span><span class="tf-text">${it.q}</span></div>`;});let s3=`<div class="sec-title"><span>III. Selección Múltiple</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div><div class="mc-grid">`;d.mc.forEach((it,i)=>{const opts=it.o.map((op,oi)=>`<label class="mc-opt"><input type="radio" name="mcp${i}"> ${op}</label>`).join('');s3+=`<div class="mc-item"><div class="mc-q"><span class="qn">${i+11}.</span><span>${it.q}</span></div><div class="mc-opts">${opts}</div></div>`;});s3+=`</div>`;let colL='<div class="pr-col"><div class="pr-head">📌 Términos</div>';d.pr.terms.forEach((it,i)=>{colL+=`<div class="pr-item"><span class="pr-num">${i+16}.</span><span class="pr-line"></span>${it.term}</div>`;});colL+='</div>';let colR='<div class="pr-col"><div class="pr-head">🔑 Definiciones</div>';d.pr.shuffledDefs.forEach((it,i)=>{colR+=`<div class="pr-item"><span class="pr-num">${d.pr.letters[i]}.</span>${it.def}</div>`;});colR+='</div>';let s4=`<div class="pr-section"><div class="sec-title"><span>IV. Términos Pareados</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div><div class="pr-grid">${colL}${colR}</div></div>`;let pR='';pR+=`<div class="p-sec"><div class="p-ttl">I. Completar</div><table class="p-tbl">`;d.cp.forEach((it,i)=>{pR+=`<tr><td class="pn">${i+1}.</td><td class="pa">${it.a}</td></tr>`;});pR+=`</table></div><div class="p-sec"><div class="p-ttl">II. V o F</div><table class="p-tbl">`;d.tf.forEach((it,i)=>{pR+=`<tr><td class="pn">${i+6}.</td><td class="pa">${it.a?'V':'F'}</td></tr>`;});pR+=`</table></div><div class="p-sec"><div class="p-ttl">III. Selección</div><table class="p-tbl">`;d.mc.forEach((it,i)=>{pR+=`<tr><td class="pn">${i+11}.</td><td class="pa">${it.o[it.a]}</td></tr>`;});pR+=`</table></div><div class="p-sec"><div class="p-ttl">IV. Pareados</div><table class="p-tbl">`;d.pr.terms.forEach((it,i)=>{const l=d.pr.letters[d.pr.shuffledDefs.findIndex(df=>df.def===it.def)];pR+=`<tr><td class="pn">${i+16}.</td><td class="pa">${i+16}→${l}</td></tr>`;});pR+=`</table></div>`;
    const zgKey = [];
    d.cp.forEach((it, i) => zgKey.push({ n: i + 1, fill: 0, labels: ['✓', '✗', '', '', ''] }));
    d.tf.forEach((it, i) => zgKey.push({ n: i + 6, fill: it.a ? 0 : 1, labels: ['V', 'F', '', '', ''] }));
    d.mc.forEach((it, i) => zgKey.push({ n: i + 11, fill: it.a, labels: ['', '', '', '', ''] }));
    d.pr.terms.forEach((it, i) => { const l = d.pr.letters[d.pr.shuffledDefs.findIndex(df=>df.def===it.def)]; zgKey.push({ n: i + 16, fill: 'ABCDE'.indexOf(l), labels: ['', '', '', '', ''] }); });
    const zgRow = r => `<div class="zg-row"><span class="zg-n">${r.n}</span>${r.labels.map((lb, ci) => ci === r.fill ? `<span class="zg-c zg-fill">${lb || '●'}</span>` : `<span class="zg-c">${lb}</span>`).join('')}</div>`;
    const zgHead = '<div class="zg-head"><span class="zg-n"></span><span>A</span><span>B</span><span>C</span><span>D</span><span>E</span></div>';
    const zgCol1 = zgHead + zgKey.slice(0, 10).map(zgRow).join('');
    const zgCol2 = zgHead + zgKey.slice(10).map(zgRow).join('');
    const zgVer = ['A', 'B', 'C', 'D'].map((v, i) => ((forma - 1) % 4) === i ? `<span class="zg-c zg-fill">${v}</span>` : `<span class="zg-c">${v}</span>`).join('');
    const zgBlock = `<div class="zg-wrap"><div class="zg-title">🎯 Clave rápida estilo ZipGrade · Forma ${forma} — respuestas correctas ya rellenadas para digitar la clave en la app</div><div class="zg-grid"><div class="zg-col">${zgCol1}</div><div class="zg-col">${zgCol2}</div></div><div class="zg-ver"><span>Test Version / Forma:</span>${zgVer}</div><div class="zg-note">1–5 (Completar): se revisan a mano → ✓ (A) equivale a respuesta correcta · 6–10: V=A, F=B · Réplica visual de referencia; para escanear alumnos usa la hoja oficial de ZipGrade.</div></div>`;

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación En los Albores de la Singularidad · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.12rem 0.4rem;margin:0.22rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #86198f;background:#fdf4ff;color:#86198f;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#86198f;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #86198f;height:12px;}.obt-pct{white-space:nowrap;}.qn{font-weight:700;min-width:22px;flex-shrink:0;}.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:40px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.18rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.14rem 0.35rem;margin-bottom:0.1rem;break-inside:avoid;page-break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.3;display:flex;gap:0.28rem;margin-bottom:0.07rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.1rem 0.5rem;}.mc-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:0.04rem 0.15rem;margin-left:0.8rem;}.mc-opt{font-size:9pt;display:flex;align-items:center;gap:0.15rem;}.mc-opt input{width:10px;height:10px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{margin-top:0.1rem;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.08rem 0.4rem;margin-top:0.08rem;}.pr-head{font-size:9pt;font-weight:700;color:#555;margin-bottom:0.1rem;}.pr-item{font-size:10.5pt;padding:0.1rem 0.28rem;background:#fdf4ff;border-radius:3px;margin-bottom:0.07rem;display:flex;align-items:center;gap:0.2rem;line-height:1.2;break-inside:avoid;page-break-inside:avoid;}.pr-num{font-weight:700;color:#86198f;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.22rem;padding:0.15rem 0;page-break-before:avoid;break-before:avoid;color:#86198f;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #86198f;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#555;}.pa{color:#007a00;font-weight:600;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
.zg-title{font-size:9.5pt;font-weight:700;margin-bottom:0.3rem;}
.zg-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 1.4rem;}
.zg-head{display:flex;gap:5px;align-items:center;font-weight:700;font-size:10pt;letter-spacing:1px;}
.zg-head span:not(.zg-n){width:17px;text-align:center;}
.zg-row{display:flex;gap:5px;align-items:center;margin-top:3px;}
.zg-n{width:22px;text-align:right;font-weight:700;font-size:10.5pt;margin-right:5px;flex-shrink:0;}
.zg-c{width:17px;height:17px;border:1.4px solid #555;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:8pt;color:#666;background:#fff;flex-shrink:0;}
.zg-fill{background:#111;color:#fff;border-color:#111;font-weight:700;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.zg-ver{margin-top:0.3rem;display:flex;gap:5px;align-items:center;font-size:8.5pt;font-weight:700;}
.zg-note{font-size:7pt;color:#555;margin-top:0.22rem;}
.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}
.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}
.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}
.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · En los Albores de la Singularidad · Educación Básica · III Ciclo · Inteligencia Artificial</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Evaluación Final · En los Albores de la Singularidad · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u</div></div><div class="p-grid">${pR}</div>
  ${zgBlock}</div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("evalPage",252,0.55,1.45);fit("pautaPage",252,0.55,1.3);})();<\/script></body></html>`;const win=window.open('','_blank','');if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}win.document.write(doc);win.document.close();setTimeout(()=>win.print(),400);}

// ===================== PRUEBA DE PENSAMIENTO CRÍTICO =====================
function evalSwitchMode(mode){
  sfx('click');
  const cWrap=document.getElementById('evalConceptWrap'),critWrap=document.getElementById('evalCritWrap');
  const cBtn=document.getElementById('evalModeBtnConcept'),critBtn=document.getElementById('evalModeBtnCrit');
  if(mode==='crit'){
    cWrap.style.display='none';critWrap.style.display='block';
    cBtn.classList.remove('active');cBtn.setAttribute('aria-selected','false');
    critBtn.classList.add('active');critBtn.setAttribute('aria-selected','true');
    if(!window._evalCritData)genEvalCrit();
  }else{
    critWrap.style.display='none';cWrap.style.display='block';
    critBtn.classList.remove('active');critBtn.setAttribute('aria-selected','false');
    cBtn.classList.add('active');cBtn.setAttribute('aria-selected','true');
  }
}
const critCaseBank=[
  {txt:'En el grupo del colegio circula que «en dos años la IA lo hará todo». Un compañero deja de inscribirse.'},
  {txt:'Un diario publica, marcado como contenido patrocinado, que habrá becas de Inteligencia Artificial.'},
  {txt:'El mismo mes, otro diario publica que al país le falta infraestructura y gente formada.'},
  {txt:'Un titular dice que los modelos de IA «mienten, roban y matan». Debajo hay un juego inventado.'},
  {txt:'Un organismo internacional publica un estudio, con fecha y método, sobre cuánta IA usan las universidades.'},
  {txt:'Un investigador de seguridad renuncia y explica por escrito por qué cree que la industria va muy rápido.'}
];
const critCaseQuestions=[
  '1. Pasá la afirmación por las cuatro preguntas. ¿Cuántas contesta?',
  '2. ¿En qué tramo cae? ¿Qué te toca hacer?',
  '3. ¿Qué gana quien la publica? ¿Eso la vuelve falsa?',
  '4. Si es promesa, ¿qué fecha le ponés para volver?'
];
const critCaseGuides=[
  'Se valora que aplique las cuatro preguntas, no una. El del grupo del colegio contesta una sola; el del organismo, todas.',
  'El tramo tiene que llevar a una acción: abrir el documento, buscar lo que falta o ponerle fecha. Decir «es falso» no es el ejercicio.',
  'Que nombre el interés sin usarlo como sentencia: la empresa gana gente formada, el medio gana lectores, el investigador dice que perdió dinero. Eso no prueba nada.',
  'Respuesta abierta, pero tiene que traer una FECHA concreta. Sin fecha no hay examen posible.'
];
const critErrorBank=[
  {txt:'"Lo leí en cinco páginas distintas, así que es verdad."',
   g1:'Sin decir de dónde, son un eco: no cinco fuentes.',
   g2:'Una fuente que se pueda abrir vale más que cincuenta copias.'},
  {txt:'"Lo dice una empresa que vende cursos de IA, así que es mentira."',
   g1:'Saber qué gana lo pone en su sitio, no lo vuelve falso.',
   g2:'Se comprueba igual.'},
  {txt:'"Como puede haber una singularidad, no vale la pena estudiar nada."',
   g1:'Es decidir tu vida con algo que nadie puede comprobar.',
   g2:'Si mañana no pasa, el año perdido es el tuyo.'},
  {txt:'"Esta noticia es de septiembre, así que el hecho es de septiembre."',
   g1:'La fecha del artículo no es la del hecho.',
   g2:'Muchas listas traen como nuevo algo de hace años.'},
  {txt:'"Si el titular es tan fuerte, algo habrá."',
   g1:'La palabra más fuerte es la que más se comparte.',
   g2:'Debajo suele haber algo más pequeño: una simulación.'},
  {txt:'"Dos noticias se contradicen: una de las dos miente."',
   g1:'Casi siempre miden cosas distintas.',
   g2:'Puede haber becas y faltar infraestructura a la vez.'}
];
const critDecisionBank=[
  'Un compañero deja de inscribirse por un mensaje del grupo. ¿No meterse, o pasar esa frase con él por las cuatro preguntas?',
  'Encontraste una afirmación con institución, fecha y documento. ¿Creerle porque suena seria, o abrir el documento?',
  'Un anuncio de becas te interesa y está marcado como patrocinado. ¿Descartarlo, o buscar los requisitos?',
  'Una promesa de la industria no trae plazo. ¿Discutirla ahora, o apuntarla con fecha y volver ese día?',
  'Un titular te indigna y el grupo está abierto. ¿Compartirlo, o buscar primero el estudio que hay debajo?'
];
const critDecisionGuide='La mejor decisión va al documento y le pone fecha a lo que no se puede juzgar. Abrir el estudio, buscar los requisitos, apuntar la promesa: se hacen en minutos. Y ayudar a un compañero con esa frase no es meterse.';
const critCompareBank=[
  {a:'Una afirmación comprobable.',b:'Una afirmación verdadera.',
   ga:'Trae quién, cuándo y un documento que se puede abrir.',
   gb:'Coincide con lo que pasó.',
   gr:'No son lo mismo. Algo comprobable puede resultar falso al comprobarlo. Y algo verdadero puede llegar sin nada que abrir. A una noticia de hoy solo podés exigirle lo primero.'},
  {a:'Un punto de inflexión.',b:'Una noticia grande.',
   ga:'Cambia lo que se puede hacer, y se nota años después.',
   gb:'Ocupa portadas el día que pasa.',
   gr:'Casi nunca coinciden. El artículo del que salen los chats de hoy pasó desapercibido. Por eso lo honesto es fechar y volver.'},
  {a:'«En dos años lo hará todo.»',b:'«Desde agosto, esta ley obliga a etiquetar lo generado por IA.»',
   ga:'No dice quién, ni qué gana, ni con qué. Solo un plazo.',
   gb:'Dice quién, desde cuándo, y el texto está publicado.',
   gr:'Las dos hablan del futuro y no se parecen. Una se puede abrir hoy mismo; la otra no tiene por dónde agarrarse.'}
];
const critCauseBank=[
  {cause:'Una promesa sin fecha no se puede incumplir.',guide:'Por eso quien promete evita los plazos. Ponerle vos la fecha es la defensa.'},
  {cause:'Publicar «lo último» cada mes da visitas, y copiar sale barato.',guide:'Por eso casi todo lo que sale al buscar noticias de IA son ecos.'},
  {cause:'Un titular con la palabra más fuerte se comparte más.',guide:'Por eso «sacó a un jugador de un juego» se publica como «mata».'},
  {cause:'En los dos inviernos se prometió de más.',guide:'Por eso la vara no es si algo impresiona, sino qué se prometió y para cuándo.'},
  {cause:'Tu vida se decide con lo que sabés ese día.',guide:'Por eso una frase sin dueño puede costar una matrícula.'}
];
const critEffectBank=[
  {effect:'Un alumno deja de inscribirse por un mensaje reenviado.',guide:'Porque la frase traía un plazo y sonaba segura, y nadie preguntó quién la decía.'},
  {effect:'Una familia se entera tarde de unas becas que sí existían.',guide:'Porque el anuncio venía marcado como patrocinado y se descartó entero.'},
  {effect:'Un titular de verdad sobre IA deja de leerse.',guide:'Porque antes se gastaron las alarmas con titulares sin nada debajo.'},
  {effect:'Una promesa se puede juzgar dentro de un año.',guide:'Porque alguien la apuntó con su fecha el día que se hizo.'},
  {effect:'Dos noticias contrarias resultan ser las dos ciertas.',guide:'Porque una medía anuncios y la otra infraestructura.'}
];
function genEvalCrit(){
  sfx('click');
  _injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });
  const _sC = document.getElementById('evalCritFormaSel');
  if (_sC && parseInt(_sC.value, 10)) evalCritFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sC.value, 10)));
  const cf=evalCritFormNum;window._currentEvalCritForm=cf;const rngC = _evalRng(200000 + cf);evalCritFormNum=(evalCritFormNum%EVAL_FORMAS)+1;_injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });saveProgress();
  document.getElementById('evalcrit-screen-title').textContent=`🧠 Pensamiento Crítico · Forma ${cf} · En los Albores de la Singularidad`;
  evalCritAnsVisible=false;
  const out=document.getElementById('evalCritOut');out.innerHTML='';
  const kase=_pickF(critCaseBank,1,rngC)[0];
  const s1=document.createElement('div');
  s1.innerHTML=`<div class="eval-section-title">I. Caso de análisis: el civismo de todos los días <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${kase.txt}</div>${critCaseQuestions.map((q,i)=>`<div class="crit-q-block"><div class="crit-q-label">${q}</div><textarea class="crit-textarea" rows="2" aria-label="${q}"></textarea><div class="crit-pauta">${critCaseGuides[i]}</div></div>`).join('')}<div class="crit-selfscore"><label for="critScore0">Obtenido:</label><input type="number" id="critScore0" class="crit-score-input" data-score="0" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s1);
  const err=_pickF(critErrorBank,1,rngC)[0];
  const s2=document.createElement('div');
  s2.innerHTML=`<div class="eval-section-title">II. Corrige el error <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${err.txt}</div><p style="font-size:0.85rem;margin-bottom:0.5rem;">Identifica <strong>dos errores</strong> y corrígelos con tus propias palabras:</p><div class="crit-q-block"><div class="crit-q-label">Error 1 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 1 y su corrección"></textarea><div class="crit-pauta">${err.g1}</div></div><div class="crit-q-block"><div class="crit-q-label">Error 2 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 2 y su corrección"></textarea><div class="crit-pauta">${err.g2}</div></div><div class="crit-selfscore"><label for="critScore1">Obtenido:</label><input type="number" id="critScore1" class="crit-score-input" data-score="1" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s2);
  const dec=_pickF(critDecisionBank,1,rngC)[0];
  const s3=document.createElement('div');
  s3.innerHTML=`<div class="eval-section-title">III. Toma de decisiones: la ley y la rendición de cuentas <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${dec}</div><div class="crit-q-block"><div class="crit-q-label">¿Qué opción recomendarías? Explica por qué, relacionándolo con lo que hace cada poder del Estado y con la rendición de cuentas.</div><textarea class="crit-textarea" rows="4" aria-label="Recomendaciones y su justificación"></textarea><div class="crit-pauta">${critDecisionGuide}</div></div><div class="crit-selfscore"><label for="critScore2">Obtenido:</label><input type="number" id="critScore2" class="crit-score-input" data-score="2" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s3);
  const cmp=_pickF(critCompareBank,1,rngC)[0];
  const s4=document.createElement('div');
  s4.innerHTML=`<div class="eval-section-title">IV. Comparación razonada <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-compare-grid"><div class="crit-compare-box"><h5>Caso A</h5>${cmp.a}</div><div class="crit-compare-box"><h5>Caso B</h5>${cmp.b}</div></div><div class="crit-q-block"><div class="crit-q-label">1. ¿Qué cultura, lugar o concepto corresponde a cada caso? 2. ¿Qué característica tiene cada uno? 3. ¿Por qué no son lo mismo?</div><textarea class="crit-textarea" rows="4" aria-label="Comparación razonada de los casos A y B"></textarea><div class="crit-pauta">Caso A: ${cmp.ga} · Caso B: ${cmp.gb} · ${cmp.gr}</div></div><div class="crit-selfscore"><label for="critScore3">Obtenido:</label><input type="number" id="critScore3" class="crit-score-input" data-score="3" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s4);
  const causes=_pickF(critCauseBank,2,rngC),effects=_pickF(critEffectBank,3,rngC);
  let ceRows='';
  causes.forEach((it,i)=>{ceRows+=`<div class="crit-ce-item"><div class="crit-ce-row"><div class="crit-ce-cell crit-ce-given"><span class="crit-ce-tag">Causa</span>${it.cause}</div><div class="crit-ce-cell"><span class="crit-ce-tag">Efecto</span><textarea class="crit-textarea" rows="2" aria-label="Efecto de: ${it.cause}" placeholder="Escribe el efecto..."></textarea></div></div><div class="crit-pauta">${it.guide}</div></div>`;});
  effects.forEach((it,i)=>{ceRows+=`<div class="crit-ce-item"><div class="crit-ce-row"><div class="crit-ce-cell"><span class="crit-ce-tag">Causa</span><textarea class="crit-textarea" rows="2" aria-label="Causa de: ${it.effect}" placeholder="Escribe la causa..."></textarea></div><div class="crit-ce-cell crit-ce-given"><span class="crit-ce-tag">Efecto</span>${it.effect}</div></div><div class="crit-pauta">${it.guide}</div></div>`;});
  const s5=document.createElement('div');
  s5.innerHTML=`<div class="eval-section-title">V. Análisis de causas y efectos <span class="eval-pts">20 pts</span></div><div class="eval-item">${ceRows}<div class="crit-selfscore"><label for="critScore4">Obtenido:</label><input type="number" id="critScore4" class="crit-score-input" data-score="4" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s5);
  window._evalCritData={kase,err,dec,cmp,causes,effects};
  const totalPanel=document.createElement('div');totalPanel.id='evalCritTotalResult';totalPanel.className='crit-total-panel';totalPanel.innerHTML='<strong>🧮 Autoevaluación:</strong> responde cada sección, compara con la <em>Pauta</em> y anota tu puntaje (0–20) en cada casilla. Luego presiona <em>Calcular Total</em>.';out.appendChild(totalPanel);
  fin('s-evaluacion');
}
function toggleEvalCritAns(){evalCritAnsVisible=!evalCritAnsVisible;document.querySelectorAll('#evalCritOut .crit-pauta').forEach(el=>el.style.display=evalCritAnsVisible?'block':'none');sfx('click');}
function calcCritTotal(){
  if(!window._evalCritData){showToast('⚠️ Genera una prueba primero');return;}
  sfx('click');
  let total=0;
  document.querySelectorAll('#evalCritOut .crit-score-input').forEach(inp=>{let v=parseInt(inp.value)||0;v=Math.max(0,Math.min(20,v));inp.value=v;total+=v;});
  const panel=document.getElementById('evalCritTotalResult');
  if(panel){panel.className='crit-total-panel '+(total>=70?'eval-auto-pass':'eval-auto-risk');panel.innerHTML=`<strong>Puntaje total autoevaluado: ${total}/100</strong><br><em>Compara siempre tus respuestas con la Pauta antes de anotar el puntaje de cada sección.</em>`;}
  const formKey='crit_'+(window._currentEvalCritForm||1);
  if(total>=70){if(!xpTracker.wgt.has(formKey)){xpTracker.wgt.add(formKey);pts(8);}showToast('🎯 Pensamiento crítico: '+total+'/100');}
  else showToast('🧮 Puntaje registrado: '+total+'/100. ¡Sigue practicando!');
}
function printEvalCrit(){
  if(!window._evalCritData){showToast('⚠️ Genera una prueba primero');return;}
  sfx('click');
  const forma=window._currentEvalCritForm||1;const d=window._evalCritData;
  const lines=(n)=>Array(n).fill('<div class="ln"></div>').join('');
  let s1=`<div class="sec-title"><span>I. Caso de análisis: el civismo de todos los días</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.kase.txt}</p>`;
  critCaseQuestions.forEach(q=>{s1+=`<p class="crit-print-q">${q}</p>${lines(1)}`;});
  let s2=`<div class="sec-title"><span>II. Corrige el error</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.err.txt}</p><p class="crit-print-q">Identifica dos errores y corrígelos con tus propias palabras:</p><p class="crit-print-q"><strong>Error 1:</strong></p>${lines(1)}<p class="crit-print-q"><strong>Error 2:</strong></p>${lines(1)}`;
  let s3=`<div class="sec-title"><span>III. Toma de decisiones: la ley y la rendición de cuentas</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.dec}</p><p class="crit-print-q">¿Qué opción recomendarías? Explica por qué, relacionándolo con lo que hace cada poder del Estado y con la rendición de cuentas.</p>${lines(2)}`;
  let s4=`<div class="sec-title"><span>IV. Comparación razonada</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><div class="crit-compare-print-grid"><div class="crit-compare-print-box"><strong>Caso A:</strong> ${d.cmp.a}</div><div class="crit-compare-print-box"><strong>Caso B:</strong> ${d.cmp.b}</div></div><p class="crit-print-q">1. ¿Qué cultura, lugar o concepto corresponde a cada caso? 2. ¿Qué característica tiene cada uno? 3. ¿Por qué no son lo mismo?</p>${lines(2)}`;
  let ceTbl='<table class="crit-print-tbl"><tr><th>Causa</th><th>Efecto</th></tr>';
  d.causes.forEach(it=>{ceTbl+=`<tr><td>${it.cause}</td><td></td></tr>`;});
  d.effects.forEach(it=>{ceTbl+=`<tr><td></td><td>${it.effect}</td></tr>`;});
  ceTbl+='</table>';
  let s5=`<div class="sec-title"><span>V. Análisis de causas y efectos</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div>${ceTbl}`;
  let pR='';
  pR+=`<div class="p-sec"><div class="p-ttl">I. Caso</div>${critCaseQuestions.map((q,i)=>`<div class="p-crit-line"><strong>${i+1}.</strong> ${critCaseGuides[i]}</div>`).join('')}</div>`;
  pR+=`<div class="p-sec"><div class="p-ttl">II. Corrige el error</div><div class="p-crit-line"><strong>Error 1:</strong> ${d.err.g1}</div><div class="p-crit-line"><strong>Error 2:</strong> ${d.err.g2}</div></div>`;
  pR+=`<div class="p-sec"><div class="p-ttl">III. Toma de decisiones</div><div class="p-crit-line">${critDecisionGuide}</div></div>`;
  pR+=`<div class="p-sec"><div class="p-ttl">IV. Comparación</div><div class="p-crit-line"><strong>Caso A:</strong> ${d.cmp.ga}</div><div class="p-crit-line"><strong>Caso B:</strong> ${d.cmp.gb}</div><div class="p-crit-line">${d.cmp.gr}</div></div>`;
  pR+=`<div class="p-sec" style="grid-column:1/-1;"><div class="p-ttl">V. Causas y efectos</div>${d.causes.map(it=>`<div class="p-crit-line"><strong>Causa:</strong> ${it.cause} → <strong>Efecto:</strong> ${it.guide}</div>`).join('')}${d.effects.map(it=>`<div class="p-crit-line"><strong>Efecto:</strong> ${it.effect} → <strong>Causa:</strong> ${it.guide}</div>`).join('')}</div>`;
  const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Pensamiento Crítico En los Albores de la Singularidad · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.1rem 0.4rem;margin:0.2rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #86198f;background:#fdf4ff;color:#86198f;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#86198f;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #86198f;height:12px;}.obt-pct{white-space:nowrap;}.crit-print-scenario{font-size:10.5pt;background:#fdf4ff;border-left:3px solid #86198f;padding:0.2rem 0.5rem;margin:0.1rem 0 0.2rem;line-height:1.3;}.crit-print-q{font-size:10pt;font-weight:600;margin:0.15rem 0 0.08rem;line-height:1.25;}.ln{border-bottom:1px solid #111;min-height:12px;margin-bottom:2px;}.crit-compare-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin:0.15rem 0;}.crit-compare-print-box{font-size:9.5pt;background:#fdf4ff;border-radius:4px;padding:0.25rem 0.4rem;line-height:1.25;}.crit-print-tbl{width:100%;border-collapse:collapse;font-size:9.5pt;margin-top:0.15rem;}.crit-print-tbl th,.crit-print-tbl td{border:1px solid #999;padding:0.3rem 0.45rem;text-align:left;height:30px;vertical-align:middle;}.crit-print-tbl th{background:#fdf4ff;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.08rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.9rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.45rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.1rem;margin-bottom:0.18rem;}.p-crit-line{font-size:11pt;color:#007a00;margin-bottom:0.18rem;line-height:1.35;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.2rem;padding:0.1rem 0;color:#86198f;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #86198f;}.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:12.7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="critEvalPage"><div class="ph"><h2>Evaluación Competencial · Pensamiento Crítico · En los Albores de la Singularidad · Educación Básica · III Ciclo · Inteligencia Artificial</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 5 secciones de 20 puntos</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100</span></div></div><div class="pauta-wrap" id="critPautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Pensamiento Crítico · En los Albores de la Singularidad · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 5 secciones × 20 pts c/u — respuesta abierta, usar como guía de corrección</div></div><div class="p-grid">${pR}</div></div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("critEvalPage",250,0.55,1.2);fit("critPautaPage",250,0.55,1.2);})();<\/script></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(doc);win.document.close();setTimeout(()=>win.print(),400);
}

// ===================== LABORATORIO DE LOS SÍMBOLOS =====================
const parteData = (function () {
  /* Las cuatro preguntas del termómetro, que es lo que el alumno se lleva de
     esta misión para toda la vida. Sale de js/data/ia-actualidad.js, igual
     que la ficha impresa. */
  const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const out = {};
  IA_TERMOMETRO.forEach(t => {
    out[t.k] = {
      nombre: t.pregunta, icon: t.emoji,
      estructura: { title: '¿Por qué sirve?', info: '<strong>' + esc(t.porque) + '</strong>' },
      funcion:    { title: 'Cuando la respuesta es SÍ',  info: '✅ ' + esc(t.si) },
      ubicacion:  { title: 'Cuando la respuesta es NO',  info: '🚫 ' + esc(t.no) },
      dato:       { title: 'En el dossier de este mes',  info: esc(IA_HOY.filter(h => h.comprobable === 'alta').length + ' de las ' + IA_HOY.length + ' afirmaciones traen institución, fecha y documento. Las demás, no. Aquí ninguna se da por cierta: se comprueban.') }
    };
  });
  return out;
})();
let labParte='quien',labAspecto='estructura';
function labShowParte(parteKey){labParte=parteKey;updateLabDisplay();document.querySelectorAll('.lab-cont-btn').forEach(b=>b.classList.remove('active-pri'));const btn=document.querySelector(`[data-parte="${parteKey}"]`);if(btn)btn.classList.add('active-pri');if(typeof sfx==='function')sfx('click');}
function labShowAspecto(aspectoKey){labAspecto=aspectoKey;updateLabDisplay();document.querySelectorAll('.lab-asp-btn').forEach(b=>b.classList.remove('active-sec'));const btn=document.querySelector(`[data-aspecto="${aspectoKey}"]`);if(btn)btn.classList.add('active-sec');if(typeof sfx==='function')sfx('click');}
function updateLabDisplay(){const data=parteData[labParte];const asp=data[labAspecto];document.getElementById('lab-sentence').innerHTML=`🔬 Explorando: <strong>${data.nombre}</strong> → <strong>${asp.title}</strong>`;document.getElementById('lab-display').innerHTML=`<div class="lab-cont-header">${data.icon} ${data.nombre}</div><div class="lab-asp-title">${asp.title}</div><div class="lab-asp-info">${asp.info}</div>`;}

// ===================== DIPLOMA =====================
function _diplPct(){return xp>=MXP?100:Math.round((xp/MXP)*100);}
function openDiploma(){sfx('fan');const pct=_diplPct();document.getElementById('diplPct').textContent=pct+'%';document.getElementById('diplBar').style.width=pct+'%';document.getElementById('diplDate').textContent='Fecha: '+new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});const msgs=['¡Sigue aprendiendo!','¡Muy buen trabajo!','¡Vas muy bien!','¡Ya sabés a quién preguntarle!','¡Con el termómetro en la mano!'];document.getElementById('diplMsg').textContent=msgs[Math.min(Math.floor(pct/25),4)];const stars=['⭐','⭐⭐','⭐⭐⭐'];document.getElementById('diplStars').textContent=stars[Math.min(Math.floor(pct/40),2)];const achTxt=unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(' · ');document.getElementById('diplAch').textContent=achTxt||'Sigue completando secciones para desbloquear logros';document.getElementById('diplomaOverlay').classList.add('open');launchConfetti();}
function closeDiploma(){document.getElementById('diplomaOverlay').classList.remove('open');}
function updateDiplomaName(v){document.getElementById('diplName').textContent=v||'Estudiante';}
function shareWA(){const name=document.getElementById('diplName').textContent||'Estudiante';const pct=_diplPct();const msg=`🧭 ¡${name} completó la Misión "En los Albores de la Singularidad"! 🏅 Progreso: ${pct}% · 🌱 policastsapien.com`;_waShare(msg);}
async function captureDiploma(){if(typeof html2canvas==='undefined'){showToast('⚠️ Cargando... intenta de nuevo');return;}sfx('click');const card=document.querySelector('.diploma-card');const btn=document.querySelector('.diploma-actions .btn-pri');const toHide=[card.querySelector('.diploma-input'),card.querySelector('.diploma-actions'),card.querySelector('hr')];if(btn){btn.disabled=true;btn.textContent='⏳ Capturando...';}toHide.forEach(el=>{if(el)el.style.display='none';});let dataUrl='';try{const canvas=await html2canvas(card,{scale:2,useCORS:true,backgroundColor:'#ffffff'});toHide.forEach(el=>{if(el)el.style.display='';});dataUrl=canvas.toDataURL('image/png');const name=(document.getElementById('diplName').textContent||'Estudiante').replace(/\s+/g,'-');const fileName='constancia-'+name+'.png';const cap=window.Capacitor;if(cap&&cap.isNativePlatform&&cap.isNativePlatform()&&cap.Plugins?.Filesystem&&cap.Plugins?.Share){const base64Data=dataUrl.split(',')[1];const result=await cap.Plugins.Filesystem.writeFile({path:fileName,data:base64Data,directory:'CACHE'});await cap.Plugins.Share.share({url:result.uri,dialogTitle:'Guardar / Compartir Constancia'});}else{const a=document.createElement('a');a.href=dataUrl;a.download=fileName;a.click();}}catch(e){toHide.forEach(el=>{if(el)el.style.display='';});if(e.name!=='AbortError')showToast('⚠️ No se pudo guardar la constancia');}finally{if(btn){btn.disabled=false;btn.textContent='📷 Guardar foto';}}}

// ===================== INIT =====================

// ===================== LA ACTUALIDAD, EN LA PANTALLA =====================
/* El dossier, el termómetro y lo que se sabe de la singularidad se PINTAN
   desde js/data/ia-actualidad.js: la pantalla y la ficha que se fotocopia
   salen del mismo sitio. `_dev/verifica-ia.js` compara las dos.

   ⚠️ Y esta misión no afirma un solo hecho de actualidad: enseña la
   afirmación, quién la publicó y cómo se comprueba. La razón está escrita en
   el archivo de datos, y es que quien la escribió NO PUDO ABRIR ninguna de
   esas páginas. Buscar no es leer. */
function _esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

function pintarIaFecha(){
  document.querySelectorAll('[data-hoy]').forEach(e=>{e.textContent=IA_HOY_FECHA;});
  document.querySelectorAll('[data-mes]').forEach(e=>{e.textContent=IA_HOY_MES;});
}

function pintarIaSingularidad(){
  const s=document.getElementById('ia-sabe');
  if(s) s.innerHTML=IA_SINGULARIDAD.seSabe.map(x=>
    `<div class="sing-fila sing-si"><div class="sing-e">${x.e}</div><div><h4>${_esc(x.t)}</h4><p>${_esc(x.p)}</p></div></div>`).join('');
  const n=document.getElementById('ia-nosabe');
  if(n) n.innerHTML='<ul class="sing-no">'+IA_SINGULARIDAD.noSeSabe.map(x=>`<li>${_esc(x)}</li>`).join('')+'</ul>';
  const a=document.getElementById('ia-afirmacion');
  if(a) a.innerHTML=`<p class="sing-afirma">${_esc(IA_SINGULARIDAD.afirmacion)}</p><p class="sing-albores">${_esc(IA_SINGULARIDAD.albores)}</p>`;
  const p=document.getElementById('ia-porque');
  if(p) p.innerHTML=`<p>${_esc(IA_SINGULARIDAD.porQue)}</p><p class="sing-vara">🧭 ${_esc(IA_SINGULARIDAD.vara)}</p>`;
}

function pintarIaInflexion(){
  const c=document.getElementById('ia-inflexion');if(!c)return;
  c.innerHTML=`<p class="infl-que">${_esc(IA_INFLEXION.que)}</p><p class="infl-cuando">${_esc(IA_INFLEXION.cuando)}</p>`+
    IA_INFLEXION.reglas.map(r=>`<div class="ciclo-paso"><div class="ciclo-e">${r.e}</div><div><h4>${_esc(r.t)}</h4><p>${_esc(r.p)}</p></div></div>`).join('');
}

/* El termómetro, como fichas de repaso: la pregunta, cómo suena el sí y cómo
   suena el no. Lo de «cómo suena» es lo que de verdad se usa: en un mensaje
   real nadie escribe «no tengo fuente». */
function pintarIaTermometro(){
  const c=document.getElementById('ia-termometro');if(!c)return;
  c.innerHTML=IA_TERMOMETRO.map((t,i)=>
    `<div class="term-caja"><h4>${t.emoji} ${i+1}. ${_esc(t.pregunta)}</h4><p class="term-si">✅ ${_esc(t.si)}</p><p class="term-no">🚫 ${_esc(t.no)}</p><p class="term-por">${_esc(t.porque)}</p></div>`
  ).join('');
}

// ═════════════ 📰 EL DOSSIER DE ESTE MES ═════════════
/* El alumno clasifica cada afirmación por LO QUE TRAE, no por si le gusta.
   Después de decidir ve la ficha entera: quién lo dice, qué gana, qué trae,
   cómo se comprueba y por qué le importa a él. */
const IA_NIVELES=[
  {k:'alta',emoji:'📎',n:'Trae mucho',d:'Nombra a quien responde, con fecha y documento.'},
  {k:'media',emoji:'🧭',n:'Trae algo',d:'Varios medios con fecha, pero sin el documento.'},
  {k:'baja',emoji:'💨',n:'No trae casi nada',d:'No dice quién, ni cuándo, ni de dónde.'}
];
let iaDosIdx=0, iaDosElegido={}, iaDosHechos=new Set();

function iaDosPintarLista(){
  const c=document.getElementById('dos-lista');if(!c)return;
  c.innerHTML=IA_HOY.map((h,i)=>
    `<button type="button" class="desc-chip${i===iaDosIdx?' desc-on':''}${iaDosHechos.has(h.k)?' desc-hecho':''}" onclick="iaDosElegir(${i})">${h.emoji} ${_esc(h.fecha)}</button>`
  ).join('');
}
function iaDosElegir(i){iaDosIdx=i;iaDosPintarLista();iaDosPintar();}
function iaDosPintar(){
  const caja=document.getElementById('dos-caja');if(!caja)return;
  const h=IA_HOY[iaDosIdx];const el=iaDosElegido[h.k];
  let html=`<p class="dos-fecha">${h.emoji} <strong>${_esc(h.fecha)}</strong></p><p class="dos-afirma">«${_esc(h.afirma)}»</p>`;
  if(el===undefined){
    html+='<p class="dos-preg">¿Cuánto trae esta afirmación para poder comprobarla?</p><div class="esc-ops">'+
      IA_NIVELES.map(n=>`<button type="button" class="pet-op" onclick="iaDosDecidir('${n.k}')">${n.emoji} ${n.n} — <em>${_esc(n.d)}</em></button>`).join('')+'</div>';
  }else{
    const ok=el===h.comprobable;const real=IA_NIVELES.find(n=>n.k===h.comprobable);
    html+=`<p class="dos-res ${ok?'dos-ok':'dos-no'}">${ok?'✅ Eso mismo.':'⬅️ No era esa.'} Esta afirmación <strong>${real.emoji} ${_esc(real.n.toLowerCase())}</strong>.</p>`+
      `<div class="dos-ficha">`+
      `<p><strong>🧑 Quién lo dice:</strong> ${_esc(h.quien)}</p>`+
      `<p><strong>💰 Qué gana:</strong> ${_esc(h.gana)}</p>`+
      `<p><strong>📎 Qué trae:</strong> ${_esc(h.trae)}</p>`+
      `<p class="dos-comp"><strong>🔎 Cómo lo comprobás:</strong> ${h.comprueba}</p>`+
      `<p class="dos-imp"><strong>🎯 Por qué te importa:</strong> ${_esc(h.importa)}</p></div>`+
      '<div class="ens-btns">'+(iaDosIdx<IA_HOY.length-1?`<button class="btn btn-pri" onclick="iaDosElegir(${iaDosIdx+1})">Siguiente ▶</button>`:'')+
      `<button class="btn btn-d" onclick="iaDosOtra()">🔄 Decidir otra vez</button></div>`;
  }
  caja.innerHTML=html;
}
function iaDosDecidir(k){
  const h=IA_HOY[iaDosIdx];iaDosElegido[h.k]=k;
  const ok=k===h.comprobable;sfx(ok?'ok':'no');
  if(!iaDosHechos.has(h.k)){iaDosHechos.add(h.k);if(!xpTracker.wgt.has('dos_'+h.k)){xpTracker.wgt.add('dos_'+h.k);pts(2);}}
  if(ok&&!xpTracker.wgt.has('dos_ok_'+h.k)){xpTracker.wgt.add('dos_ok_'+h.k);pts(1);}
  fb('fbDos',ok?'✅ Clasificada por lo que trae.':'Mirá abajo qué trae. Eso decide, no si estás de acuerdo.',ok);
  if(iaDosHechos.size>=IA_HOY.length){fin('s-estructura');unlockAchievement('archivista');}
  iaDosPintarLista();iaDosPintar();
}
function iaDosOtra(){const h=IA_HOY[iaDosIdx];delete iaDosElegido[h.k];iaDosPintar();}

window.addEventListener('DOMContentLoaded',()=>{
  try{iaDescInit();}catch(e){} // 🔭 Descubre: pinta las actividades; no marca ninguna sección. Si el archivo de datos no llegó, la misión sigue.
  initTheme();
  loadProgress();
  pintarIaFecha();
  pintarIaSingularidad();
  pintarIaInflexion();
  pintarIaTermometro();
  iaDosPintarLista();
  iaDosPintar();
  upFC();
  buildQz();
  showQz();
  buildClass();
  showId();
  showCmp();
  updateRetoButtons();
  buildRoute();
  showNeuron();
  showNeuro();
  showEnfer();
  updateLabDisplay();
  document.querySelector('[data-parte="quien"]')?.classList.add('active-pri');
  document.querySelector('[data-aspecto="estructura"]')?.classList.add('active-sec');
  renderAchPanel();
});

(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalCrit==='function') _injectFormaSel('genEvalCrit','evalCritFormaSel',evalCritFormNum,function(v){evalCritFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();

// ===================== 🔭 DESCUBRE · LA ACTUALIDAD =====================
/* Dos actividades. Las CUENTAS viven en js/data/ia-actualidad.js
   (iaFraseCuenta, iaFraseTramo): es lo que la sonda `verifica-descubre-ia`
   recalcula, y por eso aquí solo se pinta, se lleva el XP y se guarda lo que
   el alumno escribe. */
const DESC_KEY = SAVE_KEY + '_descubre';
function iaDescGuardar(k, v) { try { const s = JSON.parse(localStorage.getItem(DESC_KEY) || '{}'); s[k] = v; localStorage.setItem(DESC_KEY, JSON.stringify(s)); } catch (e) {} }
function iaDescLeer(k) { try { return (JSON.parse(localStorage.getItem(DESC_KEY) || '{}'))[k]; } catch (e) { return undefined; } }
/* La sección se gana HACIENDO las dos: tres frases pasadas por el termómetro
   y la cápsula escrita con su fecha. Nunca se marca al abrir. */
function iaDescubreListo() { if (iaTermHechas.size >= 3 && iaDescLeer('capsula')) { fin('s-descubre'); unlockAchievement('cronometro'); } }

/* ── 🌡️ El termómetro de la promesa ──────────────────────────────────────
   El alumno JUZGA primero y compara después. El orden importa: si la pantalla
   le enseñara antes lo que trae la frase, estaría adivinando lo que queremos
   oír en vez de mirarla. */
let iaTermIdx = 0, iaTermResp = {}, iaTermHechas = new Set();
function iaTermPintarLista() {
  const c = document.getElementById('term-frases'); if (!c) return;
  c.innerHTML = IA_FRASES.map((f, i) =>
    '<button type="button" class="desc-chip' + (i === iaTermIdx ? ' desc-on' : '') + (iaTermHechas.has(f.k) ? ' desc-hecho' : '') +
    '" onclick="iaTermElegir(' + i + ')">' + f.emoji + ' ' + _esc(f.de) + '</button>').join('');
}
function iaTermElegir(i) { iaTermIdx = i; iaTermPintarLista(); iaTermPintar(); }
function iaTermContestar(k, v) {
  const f = IA_FRASES[iaTermIdx];
  const r = iaTermResp[f.k] || (iaTermResp[f.k] = {});
  r[k] = v; iaTermPintar();
}
function iaTermPintar() {
  const caja = document.getElementById('term-caja'); if (!caja) return;
  const f = IA_FRASES[iaTermIdx]; const r = iaTermResp[f.k] || {};
  const contestadas = IA_TERMOMETRO.filter(t => r[t.k] !== undefined).length;
  let html = '<p class="term-de">' + f.emoji + ' <em>' + _esc(f.de) + '</em></p>' +
    '<p class="term-frase">«' + _esc(f.texto) + '»</p>';
  if (contestadas < IA_TERMOMETRO.length) {
    const t = IA_TERMOMETRO.find(x => r[x.k] === undefined);
    html += '<p class="term-preg">' + t.emoji + ' <strong>' + _esc(t.pregunta) + '</strong></p>' +
      '<p class="term-ayuda">Sí: ' + _esc(t.si) + '<br>No: ' + _esc(t.no) + '</p>' +
      '<div class="ens-btns"><button class="btn btn-pri" onclick="iaTermContestar(\'' + t.k + '\',true)">✅ Sí, lo trae</button>' +
      '<button class="btn btn-sec" onclick="iaTermContestar(\'' + t.k + '\',false)">🚫 No lo trae</button></div>' +
      '<p class="term-cuenta">' + contestadas + ' de ' + IA_TERMOMETRO.length + ' contestadas</p>';
  } else {
    /* La cuenta del alumno y la de verdad, una al lado de la otra. */
    const mias = IA_TERMOMETRO.filter(t => r[t.k]).length;
    const reales = iaFraseCuenta(f);
    const tramoMio = iaFraseTramo(mias), tramoReal = iaFraseTramo(reales);
    html += '<div class="term-tabla">' + IA_TERMOMETRO.map(t => {
      const mio = !!r[t.k], real = !!f.tiene[t.k];
      return '<div class="term-fila ' + (mio === real ? 'term-igual' : 'term-dist') + '"><span class="term-q">' + t.emoji + ' ' + _esc(t.pregunta) + '</span>' +
        '<span class="term-v">Vos: <strong>' + (mio ? 'sí' : 'no') + '</strong> · De verdad: <strong>' + (real ? 'sí' : 'no') + '</strong> ' + (mio === real ? '✅' : '⬅️') + '</span></div>';
    }).join('') + '</div>';
    html += '<p class="term-tramo"><strong>' + tramoReal.emoji + ' ' + _esc(tramoReal.nombre) + '</strong> — trae ' + reales + ' de ' + IA_TERMOMETRO.length + '.</p>' +
      '<p class="term-dice">' + tramoReal.dice.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') + '</p>' +
      '<p class="term-porque">' + _esc(f.porque) + '</p>';
    if (tramoMio.k !== tramoReal.k) html += '<p class="term-ojo">👀 Vos la pusiste en «' + _esc(tramoMio.nombre) + '». Mirá arriba en qué pregunta se separan.</p>';
    html += '<div class="ens-btns">' + (iaTermIdx < IA_FRASES.length - 1 ? '<button class="btn btn-pri" onclick="iaTermElegir(' + (iaTermIdx + 1) + ')">Siguiente frase ▶</button>' : '') +
      '<button class="btn btn-d" onclick="iaTermOtra()">🔄 Juzgarla otra vez</button></div>';
    if (!iaTermHechas.has(f.k)) {
      iaTermHechas.add(f.k); sfx('ok');
      if (!xpTracker.wgt.has('term_' + f.k)) { xpTracker.wgt.add('term_' + f.k); pts(2); }
      const iguales = IA_TERMOMETRO.filter(t => !!r[t.k] === !!f.tiene[t.k]).length;
      if (iguales === IA_TERMOMETRO.length && !xpTracker.wgt.has('term_ok_' + f.k)) { xpTracker.wgt.add('term_ok_' + f.k); pts(2); }
      if (iaTermHechas.size === IA_FRASES.length && !xpTracker.wgt.has('term_todas')) {
        xpTracker.wgt.add('term_todas'); pts(3);
        fb('fbTerm', '+3 XP: las cinco. De ellas, dos traen con qué comprobarse. Desconfiar de todo cuesta lo mismo que creerlo todo.', true);
      }
      iaDescubreListo();
    }
  }
  caja.innerHTML = html;
  iaTermPintarLista();
}
function iaTermOtra() { const f = IA_FRASES[iaTermIdx]; iaTermResp[f.k] = {}; iaTermPintar(); }

/* ── 📅 La cápsula del tiempo ─────────────────────────────────────────────
   Lo único que de verdad separa un hito de un invierno es el tiempo, y el
   tiempo no se puede apurar: se apunta. El alumno escribe hoy lo que se
   promete y lo que él cree, y la pantalla le da el DÍA en que tiene que
   volver a leerlo. Se guarda en su teléfono, no viaja a ninguna parte. */
function iaCapFecha() {
  const d = new Date(); d.setFullYear(d.getFullYear() + 1);
  return d.toLocaleDateString('es-HN', { year: 'numeric', month: 'long', day: 'numeric' });
}
function iaCapGuardar() {
  const v = id => ((document.getElementById(id) || {}).value || '').trim();
  const promesa = v('cap-promesa'), quien = v('cap-quien'), creo = v('cap-creo');
  if (promesa.length < 10) { fb('fbCap', 'Copiá la promesa tal cual, con una oración entera.', false); return; }
  if (quien.length < 2) { fb('fbCap', 'Falta quién la hace. Sin eso no hay a quién preguntarle en un año.', false); return; }
  if (creo.length < 4) { fb('fbCap', 'Escribí qué creés vos. Equivocarse también enseña.', false); return; }
  const c = { promesa: promesa, quien: quien, creo: creo, hoy: IA_HOY_FECHA, vuelve: iaCapFecha() };
  iaDescGuardar('capsula', c); iaCapPintar(c); sfx('up');
  if (!xpTracker.wgt.has('cap')) { xpTracker.wgt.add('cap'); pts(5); }
  fb('fbCap', '+5 XP: tu cápsula quedó guardada. Volvé el ' + c.vuelve + ' y leela.', true);
  iaDescubreListo();
}
function iaCapPintar(c) {
  const e = document.getElementById('cap-guardada'); if (!e || !c) return;
  e.innerHTML = '<div class="cap-caja"><p class="cap-tit">📅 Escrita el ' + _esc(c.hoy) + '</p>' +
    '<p><strong>Se promete:</strong> «' + _esc(c.promesa) + '»</p>' +
    '<p><strong>Lo dice:</strong> ' + _esc(c.quien) + '</p>' +
    '<p><strong>Yo creo que:</strong> ' + _esc(c.creo) + '</p>' +
    '<p class="cap-vuelve">⏰ Volvé a leer esto el <strong>' + _esc(c.vuelve) + '</strong>. Ese día vas a saber si era un hito o un invierno.</p></div>';
}
function iaCapBorrar() {
  if (!confirm('¿Borrar tu cápsula del tiempo? Lo que escribiste se pierde.')) return;
  iaDescGuardar('capsula', null);
  const e = document.getElementById('cap-guardada'); if (e) e.innerHTML = '';
  ['cap-promesa', 'cap-quien', 'cap-creo'].forEach(id => { const i = document.getElementById(id); if (i) i.value = ''; });
  sfx('click');
}

function iaDescInit() {
  iaTermPintarLista(); iaTermPintar();
  const f = document.getElementById('cap-fecha'); if (f) f.textContent = iaCapFecha();
  const c = iaDescLeer('capsula');
  if (c) {
    iaCapPintar(c);
    const p = document.getElementById('cap-promesa'); if (p) p.value = c.promesa || '';
    const q = document.getElementById('cap-quien'); if (q) q.value = c.quien || '';
    const r = document.getElementById('cap-creo'); if (r) r.value = c.creo || '';
  }
}
