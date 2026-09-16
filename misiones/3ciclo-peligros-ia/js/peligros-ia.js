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
const SAVE_KEY='peligros_ia_v1';
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
  primer_quiz:{icon:'🏅',label:'Primer quiz de los peligros superado'},
  flash_master:{icon:'🃏',label:'Se sabe las señales, las familias y el botiquín'},
  clasif_pro:{icon:'🗂️',label:'Distingue una señal de estafa de un mensaje normal'},
  id_master:{icon:'🔍',label:'Encuentra el peligro dentro de la oración'},
  reto_hero:{icon:'🏆',label:'Campeón del reto de los peligros'},
  nivel3:{icon:'🎖️',label:'¡Buen criterio! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡No lo agarran desprevenido! Nivel 6'},
  widgets_master:{icon:'🧩',label:'Widgets de los peligros dominados'},
  senalero:{icon:'🚨',label:'Cazó las tres señales en los mensajes que llegan'},
  blindado:{icon:'🛡️',label:'Armó la estafa por dentro y supo qué la hubiera parado'}
};
function unlockAchievement(id){if(unlockedAch.includes(id))return;unlockedAch.push(id);sfx('ach');showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label);launchConfetti();renderAchPanel();saveProgress();}
function renderAchPanel(){const list=document.getElementById('achList');list.innerHTML='';Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{const div=document.createElement('div');div.className='ach-item'+(unlockedAch.includes(id)?'':' locked');div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`;list.appendChild(div);});}
function toggleAchPanel(){sfx('click');document.getElementById('achPanel').classList.toggle('open');}
function showToast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}t.textContent=msg;t.style.display='block';clearTimeout(t._tid);t._tid=setTimeout(()=>t.style.display='none',3200);}
function launchConfetti(){const colors=['#86198f','#e879f9','#4338ca','#f59e0b','#c026d3'];for(let i=0;i<60;i++){const c=document.createElement('div');c.className='confetti-piece';c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`;document.body.appendChild(c);c.addEventListener('animationend',()=>c.remove());}}

// ===================== XP =====================
const lvls=[{t:0,n:'Aprendiz 🌱'},{t:25,n:'Conoce las señales 🚨'},{t:55,n:'Comprueba por otro camino 📞'},{t:90,n:'Pregunta a quién le cae el error ⚖️'},{t:130,n:'Cuida lo suyo y lo ajeno 🔒'},{t:165,n:'Decide y lo puede explicar 🧠'},{t:190,n:'Criterio blindado 🛡️'}];
function pts(n){xp=Math.max(0,Math.min(MXP,xp+n));updateXPBar();saveProgress();}
function updateXPBar(){const pct=Math.round((xp/MXP)*100);document.getElementById('xpFill').style.width=pct+'%';const el=document.getElementById('xpPts');el.textContent='⭐ '+xp;el.style.transform='scale(1.3)';setTimeout(()=>el.style.transform='',300);let lv=0;for(let i=0;i<lvls.length;i++)if(xp>=lvls[i].t)lv=i;document.getElementById('xpLvl').textContent=lvls[lv].n;if(lv!==prevLevel){if(lv>=2)unlockAchievement('nivel3');if(lv>=5)unlockAchievement('nivel5');prevLevel=lv;}}
function resetXP(){sfx('click');xp=0;updateXPBar();showToast('🔄 XP reiniciado a 0');}
function fin(id,showFX=true){if(!done.has(id)){done.add(id);const b=document.querySelector(`[data-s="${id}"]`);if(b)b.classList.add('done');if(showFX){sfx('up');launchConfetti();}saveProgress();}}
function getProgress(){return Math.round((done.size/TOTAL_SECTIONS)*100);}

// ===================== NAV =====================
function go(id){sfx('click');document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});document.getElementById(id).classList.add('active');const btn=document.querySelector(`[data-s="${id}"]`);if(btn){btn.classList.add('active');btn.setAttribute('aria-selected','true');}window.scrollTo({top:0,behavior:'smooth'});if(id==='s-sopa'){setTimeout(buildSopa,50);}if(id==='s-widgets'){setTimeout(buildRoute,50);}}

// ===================== FLASHCARD DATA =====================
const fcData = (function () {
  /* De los archivos de datos de la ruta: las tres señales, las cuatro
     familias, los trece peligros y el botiquín. Si mañana se corrige un
     mecanismo, se corrige aquí, en la ficha impresa y en el Laboratorio a la
     vez, porque los tres salen del mismo sitio. */
  const f = [];
  IA_SENALES.forEach(s => {
    f.push({ w: s.emoji + ' ' + s.nombre + '<br><small>una de las tres señales</small>', a: '<strong>' + s.suena + '</strong><br><br>' + s.porque });
  });
  IA_FAMILIAS.forEach(x => {
    f.push({ w: x.emoji + ' ' + x.nombre + '<br><small>¿qué pregunta lo desarma?</small>', a: '<strong>' + x.pregunta + '</strong><br><br>' + x.que });
  });
  IA_PELIGROS.forEach(p => {
    f.push({ w: p.emoji + ' ' + p.nombre + '<br><small>¿qué es, y qué lo desarma?</small>', a: '<strong>' + p.pregunta + '</strong><br><br>' + p.mecanismo });
  });
  IA_DEFENSAS.forEach(d => {
    f.push({ w: d.emoji + ' ' + d.nombre + '<br><small>¿para qué NO sirve?</small>', a: '<strong>' + d.noPara + '</strong><br><br>Sí sirve para: ' + d.para });
  });
  IA_REGLAS_ORO.forEach(r => {
    f.push({ w: r.emoji + ' Una de las tres reglas de oro', a: '<strong>' + r.regla + '</strong><br><br>' + r.porque });
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
  {q:'¿Cuáles son las tres señales que trae casi toda estafa?',o:['Urgencia, secreto y canal nuevo','Faltas de ortografía, mayúsculas y emojis','Un número largo, una foto y un enlace','Que sea de noche, en fin de semana y por audio'],c:0,
   e:'Y no se pueden quitar: sin ellas el engaño no funciona. Por eso son lo que hay que saberse de memoria.'},
  {q:'Te llega un audio con la voz de tu mamá pidiendo dinero urgente a un número nuevo. ¿Qué hacés primero?',o:['Colgar y llamarla yo al número de siempre','Le contesto por audio para comprobar','Reconozco su voz, así que lo mando','Le pregunto algo que solo ella sabe'],c:0,
   e:'La voz es lo que se fabrica, y lo que «solo ella sabe» puede estar publicado. El número de siempre, no.'},
  {q:'Un programa acierta el 95 % de las veces. ¿Qué NO te dice ese número?',o:['Cuántos aciertos tuvo','Cuántos casos revisó','Que se equivoca a veces','A quién le cae el 5 % que falla'],c:3,
   e:'Ese 5 % puede caer siempre sobre el mismo grupo. El promedio esconde justo eso.'},
  {q:'¿Por qué una palabra clave de la familia deja de servir si se escribió en un grupo?',o:['Porque se olvida','Porque cambia cada mes','Porque ya la puede leer cualquiera que vea el grupo','Porque los grupos no son seguros para nada'],c:2,
   e:'Una defensa que se publicó ya no es una defensa. Por eso se acuerda en persona.'},
  {q:'¿Qué tienen en común el video falso y la cuenta que se hace pasar por otro?',o:['Que se arreglan borrando la aplicación','Que los dos se desarman comprobando por OTRO camino','Que solo pasan de noche','Que se notan a simple vista'],c:1,
   e:'Es la pregunta madre de esa familia: ¿lo comprobé por otro camino?'},
  {q:'Subís al grupo la foto de todo el salón con los nombres escritos. ¿Qué pasó?',o:['Publicaste datos de treinta personas que no te los dieron','Nada, es una foto normal','Solo importa si sale alguien feo','Es problema de la aplicación'],c:0,
   e:'Lo de otros no es tuyo para subirlo, y lo que salió ya no vuelve.'},
  {q:'Un chat siempre te contesta que tenés razón. ¿Qué está haciendo?',o:['Te entiende mejor que nadie','Predice lo que encaja con lo que escribiste','Se preocupa por vos','Aprendió a quererte'],c:1,
   e:'No te acompaña: sigue la conversación. Lo que duele se habla con una persona.'},
  {q:'¿Cuál de estas defensas sirve SIEMPRE?',o:['Reconocer la voz','Volver por el canal de siempre','Mirar si el mensaje tiene faltas','Pedir una foto'],c:1,
   e:'Del otro lado del número que ya tenías guardado está la persona de verdad.'},
  {q:'Un mensaje del maestro avisa de la reunión del jueves, sin prisa y sin secreto. ¿Qué es?',o:['Una estafa disimulada','Un mensaje sospechoso por ser de un grupo','Un mensaje normal: no trae ninguna de las tres señales','Una prueba'],c:2,
   e:'Desconfiar de todo cuesta lo mismo que creerlo todo: el aviso de verdad deja de leerse.'},
  {q:'¿Qué hace que un caso de estafa sea creíble?',o:['Que el que engaña sea muy listo','Que llame de madrugada','Que escriba muy bien','Que use información que la propia familia publicó'],c:3,
   e:'Casi nada se roba: el nombre, la escuela, dónde trabaja tu mamá y hasta su voz suelen estar publicados.'}
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
  {label:['Es una SEÑAL de estafa','Es un mensaje normal'],headA:'🚨 Señal',headB:'✅ Normal',colA:'senal',colB:'norm',
   words:[{w:'«Mandámelo a este otro número»',t:'senal'},{w:'«La reunión es el jueves a las 2»',t:'norm'},{w:'«No le digás a nadie todavía»',t:'senal'},{w:'«Si no podés venir, avisame por aquí»',t:'norm'},{w:'«Tenés dos horas o lo pierde»',t:'senal'},{w:'«No hay que llevar nada»',t:'norm'},{w:'«Es urgente, ya»',t:'senal'},{w:'«Cualquier duda me escriben»',t:'norm'}]},
  {label:['Lo desarma comprobar por otro camino','Lo desarma preguntar con qué ejemplos se entrenó'],headA:'📞 Otro camino',headB:'⚖️ Los ejemplos',colA:'camino',colB:'ejemplos',
   words:[{w:'Un audio con la voz de un familiar',t:'camino'},{w:'Un programa que descarta solicitudes',t:'ejemplos'},{w:'Un video del director en un grupo',t:'camino'},{w:'Una máquina que califica redacciones',t:'ejemplos'},{w:'Una cuenta nueva que dice ser tu primo',t:'camino'},{w:'El aparato que abre la puerta con la cara',t:'ejemplos'},{w:'Una noticia que solo existe en WhatsApp',t:'camino'},{w:'El que decide a quién se atiende primero',t:'ejemplos'}]},
  {label:['Se quedan con lo tuyo','Te quitan el criterio'],headA:'🔒 Lo tuyo',headB:'🧠 El criterio',colA:'tuyo',colB:'criterio',
   words:[{w:'Subir la foto del salón con los nombres',t:'tuyo'},{w:'Entregar un ensayo que no podés explicar',t:'criterio'},{w:'Escribirle la dirección de tu casa a un chat',t:'tuyo'},{w:'Ver una hora y media de videos que no elegiste',t:'criterio'},{w:'El juguete que pregunta cómo se llama tu mamá',t:'tuyo'},{w:'Creerle a un chat que siempre te da la razón',t:'criterio'},{w:'Guardar tu cara para abrir una puerta',t:'tuyo'},{w:'Copiar un dato sin comprobarlo',t:'criterio'}]}
];
let currentClassGroupIdx=0,clsSelectedWord=null;
function buildClass(){const group=classGroups[currentClassGroupIdx];document.getElementById('col-left-head').textContent=group.headA;document.getElementById('col-right-head').textContent=group.headB;const bank=document.getElementById('clsBank');bank.innerHTML='';clsSelectedWord=null;document.getElementById('items-left').innerHTML='';document.getElementById('items-right').innerHTML='';_shuffle([...group.words]).forEach(w=>{const el=document.createElement('div');el.className='wb-item';el.textContent=w.w;el.dataset.t=w.t;el.onclick=()=>{document.querySelectorAll('.wb-item').forEach(i=>i.classList.remove('sel-word'));el.classList.add('sel-word');clsSelectedWord=el;sfx('click');};bank.appendChild(el);});['col-left','col-right'].forEach(colId=>{const col=document.getElementById(colId);col.onclick=(e)=>{if(!clsSelectedWord||e.target.classList.contains('drop-item'))return;const targetId=colId==='col-left'?'items-left':'items-right';const wordsCol=document.getElementById(targetId);const item=document.createElement('div');item.className='drop-item';item.textContent=clsSelectedWord.textContent;item.dataset.t=clsSelectedWord.dataset.t;const original=clsSelectedWord;item.onclick=(ev)=>{ev.stopPropagation();if(clsSelectedWord!==null){col.click();}else{document.getElementById('clsBank').appendChild(original);original.classList.remove('sel-word');item.remove();if(typeof sfx==='function')sfx('click');}};wordsCol.appendChild(item);clsSelectedWord.remove();clsSelectedWord=null;sfx('click');};});}
function checkClass(){const remaining=document.querySelectorAll('#clsBank .wb-item').length;if(remaining>0){fb('fbCls','Mueve todas las palabras a las columnas primero.',false);return;}const group=classGroups[currentClassGroupIdx];let allOk=true;document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{const inLeft=el.parentElement.id==='items-left';const expectedType=inLeft?group.colA:group.colB;if(el.dataset.t===expectedType){el.classList.add('cls-ok');}else{el.classList.add('cls-no');allOk=false;}});if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);}if(allOk){fb('fbCls','¡Perfecto! +5 XP',true);sfx('fan');fin('s-clasifica');unlockAchievement('clasif_pro');}else{fb('fbCls','Hay errores. Los errados llevan ✗.',false);sfx('no');}}
function nextClassGroup(){sfx('click');currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length;buildClass();document.getElementById('fbCls').classList.remove('show');showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]);}
function resetClass(){sfx('click');buildClass();document.getElementById('fbCls').classList.remove('show');}

// ===================== IDENTIFICAR =====================
const idData=[
  {s:['Un','mensaje','que','pide','algo','urgente','trae','una','señal.'],c:5,art:'La señal que te quita el tiempo de pensar'},
  {s:['Pedir','que','no','se','lo','contés','a','nadie','es','secreto.'],c:9,art:'La señal que te deja sin quien te aconseje'},
  {s:['Cambiar','a','un','número','nuevo','es','la','tercera','señal.'],c:3,art:'Lo que cambian para que no contestes por donde siempre'},
  {s:['Con','una','grabación','corta','se','fabrica','una','voz.'],c:5,art:'Lo que se le hace hoy a una voz'},
  {s:['Un','promedio','alto','puede','esconder','a','quién','le','falla.'],c:1,art:'El número que esconde a quién le cae el error'},
  {s:['Lo','que','subís','de','otras','personas','no','es','tuyo.'],c:2,art:'Lo que hacés con una foto cuando la publicás'},
  {s:['La','mejor','defensa','es','volver','por','el','canal','de','siempre.'],c:7,art:'Por dónde se comprueba un mensaje raro'},
  {s:['Un','trabajo','que','no','podés','explicar','no','es','tuyo.'],c:5,art:'Lo que tenés que poder hacer con lo que entregás'}
];
let idIdx=0,idDone=false;
function showId(){idDone=false;if(idIdx>=idData.length){document.getElementById('idSent').innerHTML='🎉 ¡Completado!';fin('s-identifica');unlockAchievement('id_master');return;}const d=idData[idIdx];document.getElementById('idProg').textContent=`Oración ${idIdx+1} de ${idData.length}`;document.getElementById('idInfo').textContent=`Busca: ${d.art}`;const sent=document.getElementById('idSent');sent.innerHTML='';d.s.forEach((w,i)=>{const span=document.createElement('span');span.className='id-word';span.textContent=w+' ';span.onclick=()=>checkId(i,span);sent.appendChild(span);});}
function checkId(i,span){if(idDone)return;document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected'));span.classList.add('selected');if(i===idData[idIdx].c){idDone=true;span.classList.add('id-ok');fb('fbId','¡Correcto! +5 XP',true);if(!xpTracker.id.has(idIdx)){xpTracker.id.add(idIdx);pts(5);}sfx('ok');}else{span.classList.add('id-no');fb('fbId','Ese no es el término solicitado.',false);sfx('no');}}
function nextId(){sfx('click');idIdx++;showId();document.getElementById('fbId').classList.remove('show');}
function resetId(){sfx('click');idIdx=0;showId();document.getElementById('fbId').classList.remove('show');}

// ===================== COMPLETA =====================
const cmpData=[
  {s:'Las tres señales de una estafa son urgencia, secreto y canal ___.',opts:['viejo','nuevo','seguro'],c:1},
  {s:'La defensa que sirve siempre es volver por el canal de ___.',opts:['siempre','moda','emergencia'],c:0},
  {s:'La voz de alguien ya no es una ___.',opts:['ayuda','señal','prueba'],c:2},
  {s:'Un promedio alto puede esconder a quién le cae el ___.',opts:['error','premio','turno'],c:0},
  {s:'La palabra clave de la familia se acuerda en ___.',opts:['persona','un grupo','un mensaje'],c:0},
  {s:'Lo que subís de otras personas no es ___ para publicarlo.',opts:['bonito','tuyo','urgente'],c:1},
  {s:'Un trabajo que no podés ___ no es tuyo.',opts:['imprimir','copiar','explicar'],c:2},
  {s:'Lo que más convence de un engaño es la parte que no es ___.',opts:['importante','mentira','larga'],c:1}
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
  { label: 'Ordena lo que hacés cuando llega un mensaje raro', steps: ['1. Parar: no contestar todavía', '2. Buscar las tres señales: urgencia, secreto, canal nuevo', '3. Volver por el canal de siempre', '4. Contárselo a alguien antes de hacer nada', '5. Si era falso, avisar para que no caiga otro'] },
  { label: 'Ordena las tres preguntas ante algo que decide sobre personas', steps: ['1. ¿Con qué ejemplos se entrenó?', '2. ¿Quién eligió esos ejemplos?', '3. ¿A quién le cae el error?'] }
];
let currentRouteIdx=0,routeItems=[];
function buildRoute(){routeItems=_shuffle([...routeSets[currentRouteIdx].steps]);renderRoute();const fbEl=document.getElementById('fbRoute');if(fbEl)fbEl.classList.remove('show');}
function renderRoute(){const list=document.getElementById('routeList');if(!list)return;list.innerHTML='';routeItems.forEach((step,i)=>{const div=document.createElement('div');div.className='sort-item';div.innerHTML=`<div class="sort-arrows"><button class="sort-arrow" onclick="routeMove(${i},-1)"${i===0?' disabled':''}>▲</button><button class="sort-arrow" onclick="routeMove(${i},1)"${i===routeItems.length-1?' disabled':''}>▼</button></div><div class="sort-step-num">${i+1}.</div><div class="sort-item-txt">${step}</div>`;list.appendChild(div);});}
function routeMove(idx,dir){sfx('click');const ni=idx+dir;if(ni<0||ni>=routeItems.length)return;[routeItems[idx],routeItems[ni]]=[routeItems[ni],routeItems[idx]];renderRoute();}
function checkRoute(){const correct=routeSets[currentRouteIdx].steps;const isOk=routeItems.every((s,i)=>s===correct[i]);if(isOk){fb('fbRoute','¡Perfecto! Orden correcto. +4 XP',true);if(!xpTracker.wgt.has('route_'+currentRouteIdx)){xpTracker.wgt.add('route_'+currentRouteIdx);pts(4);}sfx('fan');fin('s-widgets');unlockAchievement('widgets_master');}else{fb('fbRoute','Hay pasos fuera de orden. Revisa el arreglo.',false);sfx('no');}}
function nextRoute(){sfx('click');currentRouteIdx=(currentRouteIdx+1)%routeSets.length;buildRoute();showToast('🔄 Secuencia: '+routeSets[currentRouteIdx].label);}

// Widget 2: Identifica el concepto
const neuronPartes = (function () {
  /* Cada peligro por su mecanismo y por su pregunta: son las dos cosas que el
     alumno tiene que poder decir de cualquiera de los trece. */
  const nombres = IA_PELIGROS.map(p => p.nombre);
  const p = [];
  IA_PELIGROS.forEach(x => {
    p.push({ desc: x.mecanismo, ans: x.nombre, opts: nombres.slice() });
    if (x.caso) p.push({ desc: x.caso, ans: x.nombre, opts: nombres.slice() });
  });
  return p;
})();
let neuronIdx=0,neuronDone=false;
function showNeuron(){neuronDone=false;if(neuronIdx>=neuronPartes.length){const el=document.getElementById('neuronDesc');if(el)el.textContent='🎉 ¡Ya reconoces a cada uno por lo que hizo!';const opts=document.getElementById('neuronOpts');if(opts)opts.innerHTML='';fin('s-widgets');return;}const d=neuronPartes[neuronIdx];const prog=document.getElementById('neuronProg');if(prog)prog.textContent=`Pista ${neuronIdx+1} de ${neuronPartes.length}`;const desc=document.getElementById('neuronDesc');if(desc)desc.textContent=d.desc;const opts=document.getElementById('neuronOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=opt;b.onclick=()=>checkNeuron(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuron');if(fbEl)fbEl.classList.remove('show');}
function checkNeuron(opt,btn,d){if(neuronDone)return;neuronDone=true;document.querySelectorAll('#neuronOpts .cmp-opt').forEach(b=>{if(b.textContent===d.ans)b.classList.add('correct');else if(b===btn&&b.textContent!==d.ans)b.classList.add('wrong');});const isOk=opt===d.ans;if(isOk){fb('fbNeuron','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuron_'+neuronIdx)){xpTracker.wgt.add('neuron_'+neuronIdx);pts(3);}sfx('ok');}else{fb('fbNeuron','La respuesta correcta es: '+d.ans,false);sfx('no');}}
function nextNeuron(){sfx('click');neuronIdx++;showNeuron();}
function resetNeuron(){sfx('click');neuronIdx=0;showNeuron();}

// Widget 3: Concepto → Significado
const neuroPairs = (function () {
  /* Un caso, y la defensa del botiquín que le toca. Es lo que el alumno va a
     hacer con el teléfono en la mano. */
  const ds = IA_DEFENSAS.map(d => d.nombre);
  const de = k => IA_DEFENSAS.find(d => d.k === k).nombre;
  return [
    {trans:'Un audio con la voz de tu mamá pide dinero a un número nuevo.',func:de('llamar'),opts:ds.slice()},
    {trans:'Del otro lado juran ser tu tía, y la voz suena igual.',func:de('palabra'),opts:ds.slice()},
    {trans:'Un texto dice que un té cura una enfermedad, según «un estudio».',func:de('fuente'),opts:ds.slice()},
    {trans:'Un programa decidió quién pasa a la entrevista y quién no.',func:de('tres'),opts:ds.slice()},
    {trans:'Querés subir la foto del salón con los nombres de todos.',func:de('ajeno'),opts:ds.slice()},
    {trans:'El mensaje dice que tenés dos horas y que no se lo cuentes a nadie.',func:de('diez'),opts:ds.slice()}
  ];
})();
let neuroIdx=0,neuroDone=false;
function showNeuro(){neuroDone=false;if(neuroIdx>=neuroPairs.length){const el=document.getElementById('neuroTrans');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('neuroOpts');if(opts)opts.innerHTML='';return;}const d=neuroPairs[neuroIdx];const prog=document.getElementById('neuroProg');if(prog)prog.textContent=`${neuroIdx+1} de ${neuroPairs.length}`;const trans=document.getElementById('neuroTrans');if(trans)trans.textContent=d.trans;const opts=document.getElementById('neuroOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkNeuro(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuro');if(fbEl)fbEl.classList.remove('show');}
function checkNeuro(opt,btn,d){if(neuroDone)return;neuroDone=true;document.querySelectorAll('#neuroOpts .qz-opt').forEach(b=>{if(b.textContent===d.func)b.classList.add('correct');else if(b===btn&&b.textContent!==d.func)b.classList.add('wrong');});const isOk=opt===d.func;if(isOk){fb('fbNeuro','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuro_'+neuroIdx)){xpTracker.wgt.add('neuro_'+neuroIdx);pts(3);}sfx('ok');}else{fb('fbNeuro','Correcto: '+d.func,false);sfx('no');}setTimeout(()=>{neuroIdx++;showNeuro();},1800);}
function resetNeuro(){sfx('click');neuroIdx=0;showNeuro();}

// Widget 4: Fuente → ¿Renovable o no renovable?
const enfermedadData = (function () {
  /* El caso → de qué familia es. Las cuatro opciones son siempre las mismas
     cuatro familias, que es lo que el alumno tiene que aprender a distinguir. */
  const opts = IA_FAMILIAS.map(f => f.nombre);
  const nom = k => IA_FAMILIAS.find(f => f.k === k).nombre;
  return IA_PELIGROS.filter(p => p.caso).map(p => ({ disease: p.caso, characteristic: nom(p.familia), opts: opts.slice() }));
})();
let enferIdx=0,enferDone=false;
function showEnfer(){enferDone=false;if(enferIdx>=enfermedadData.length){const el=document.getElementById('enferDisease');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('enferOpts');if(opts)opts.innerHTML='';return;}const d=enfermedadData[enferIdx];const prog=document.getElementById('enferProg');if(prog)prog.textContent=`${enferIdx+1} de ${enfermedadData.length}`;const dis=document.getElementById('enferDisease');if(dis)dis.textContent=d.disease;const opts=document.getElementById('enferOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkEnfer(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbEnfer');if(fbEl)fbEl.classList.remove('show');}
function checkEnfer(opt,btn,d){if(enferDone)return;enferDone=true;document.querySelectorAll('#enferOpts .qz-opt').forEach(b=>{if(b.textContent===d.characteristic)b.classList.add('correct');else if(b===btn&&b.textContent!==d.characteristic)b.classList.add('wrong');});const isOk=opt===d.characteristic;if(isOk){fb('fbEnfer','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('enfer_'+enferIdx)){xpTracker.wgt.add('enfer_'+enferIdx);pts(3);}sfx('ok');}else{fb('fbEnfer','Correcto: '+d.characteristic,false);sfx('no');}setTimeout(()=>{enferIdx++;showEnfer();},1800);}
function resetEnfer(){sfx('click');enferIdx=0;showEnfer();}

// ===================== RETO FINAL =====================
const retoPairs=[
  {label:['Es una SEÑAL de estafa','Es un mensaje normal'],btnA:'🚨 Señal',btnB:'✅ Normal',colA:'senal',colB:'norm',
   words:[{w:'«Mandámelo a este otro número»',t:'senal'},{w:'«La reunión es el jueves a las 2»',t:'norm'},{w:'«No le digás a nadie todavía»',t:'senal'},{w:'«Si no podés venir, avisame»',t:'norm'},{w:'«Tenés dos horas o lo pierde»',t:'senal'},{w:'«No hay que llevar nada»',t:'norm'},{w:'«Es urgente, ya»',t:'senal'},{w:'«Cualquier duda me escriben»',t:'norm'},{w:'«Perdí mi número, este es el nuevo»',t:'senal'},{w:'«Los espero en el aula»',t:'norm'}]},
  {label:['Lo desarma comprobar por otro camino','Lo desarma preguntar con qué ejemplos se entrenó'],btnA:'📞 Otro camino',btnB:'⚖️ Los ejemplos',colA:'camino',colB:'ejemplos',
   words:[{w:'Un audio con la voz de un familiar',t:'camino'},{w:'Un programa que descarta solicitudes',t:'ejemplos'},{w:'Un video del director en un grupo',t:'camino'},{w:'Una máquina que califica redacciones',t:'ejemplos'},{w:'Una cuenta nueva que dice ser tu primo',t:'camino'},{w:'El aparato que abre la puerta con la cara',t:'ejemplos'},{w:'Una noticia que solo existe en un grupo',t:'camino'},{w:'El que decide a quién se atiende primero',t:'ejemplos'},{w:'Una foto de un desastre que se reenvía',t:'camino'},{w:'El que ordena las solicitudes de beca',t:'ejemplos'}]},
  {label:['Se quedan con lo tuyo','Te quitan el criterio'],btnA:'🔒 Lo tuyo',btnB:'🧠 El criterio',colA:'tuyo',colB:'criterio',
   words:[{w:'Subir la foto del salón con los nombres',t:'tuyo'},{w:'Entregar un ensayo que no podés explicar',t:'criterio'},{w:'Escribirle la dirección de tu casa a un chat',t:'tuyo'},{w:'Ver hora y media de videos que no elegiste',t:'criterio'},{w:'El juguete que pregunta por tu mamá',t:'tuyo'},{w:'Creerle a un chat que siempre te da la razón',t:'criterio'},{w:'Guardar tu cara para abrir una puerta',t:'tuyo'},{w:'Copiar un dato sin comprobarlo',t:'criterio'},{w:'Dar tu número para «personalizar»',t:'tuyo'},{w:'Dejar que el orden de la pantalla elija por vos',t:'criterio'}]}
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
  {s:'Un mensaje que pide algo urgente trae la primera señal.',type:'urgente'},
  {s:'Pedir que no se lo contés a nadie es la señal del secreto.',type:'secreto'},
  {s:'Cambiar a un número nuevo es la tercera señal.',type:'número nuevo'},
  {s:'Con una grabación corta se fabrica la voz de cualquiera.',type:'fabrica'},
  {s:'Un promedio alto puede esconder a quién le cae el error.',type:'promedio'},
  {s:'Volver por el canal de siempre es la defensa que sirve siempre.',type:'canal de siempre'},
  {s:'La palabra clave de la familia se acuerda en persona.',type:'en persona'},
  {s:'Lo que subís de otras personas no es tuyo.',type:'no es tuyo'},
  {s:'Un trabajo que no podés explicar no lo hiciste vos.',type:'explicar'},
  {s:'Lo que más convence de un engaño es la parte que es verdad.',type:'verdad'}
];
const classifyTaskDB=[
  {w:'Urgencia',gen:'La señal que te quita el tiempo de pensar',n:'«Antes de las cinco»',g:'Esperá diez minutos',t:''},
  {w:'Secreto',gen:'La señal que te deja sin quien te aconseje',n:'«No le digás a nadie»',g:'Contáselo a alguien',t:''},
  {w:'Canal nuevo',gen:'La señal que impide que contestes por donde siempre',n:'«Este es mi número nuevo»',g:'Volvé al número de siempre',t:''},
  {w:'Voz fabricada',gen:'Se hace con una grabación corta',n:'Un audio pidiendo dinero',g:'Llamá vos, no contestes ahí',t:''},
  {w:'Sesgo que decide',gen:'El error cae siempre sobre los mismos',n:'La beca rechazada en cuatro segundos',g:'Las tres preguntas',t:''},
  {w:'Privacidad',gen:'Lo que subís queda, y no todo es tuyo',n:'La foto del salón con los nombres',g:'No subir lo de otros',t:''},
  {w:'Criterio',gen:'Lo que se pierde cuando decide la pantalla',n:'Un ensayo que no podés explicar',g:'Hacerlo vos y poder defenderlo',t:''}
];
const completeTaskDB=[
  {s:'Las tres señales son urgencia, secreto y canal ___.',a:'nuevo'},
  {s:'La defensa que sirve siempre es volver por el canal de ___.',a:'siempre'},
  {s:'Una voz ya no es una ___.',a:'prueba'},
  {s:'Un promedio alto puede esconder a quién le cae el ___.',a:'error'},
  {s:'La palabra clave se acuerda en ___, nunca en un grupo.',a:'persona'},
  {s:'Lo que subís de otras personas no es ___.',a:'tuyo'},
  {s:'Un trabajo que no podés ___ no es tuyo.',a:'explicar'},
  {s:'Ante algo que decide sobre personas se pregunta con qué ___ se entrenó.',a:'ejemplos'},
  {s:'Lo que más convence de un engaño es la parte que no es ___.',a:'mentira'},
  {s:'Un mensaje sin ninguna de las tres señales es un mensaje ___.',a:'normal'}
];
const explainQuestions=[
  '¿Por qué las tres señales no se pueden quitar de una estafa?',
  '¿Por qué reconocer la voz de alguien ya no sirve como prueba?',
  '¿Qué esconde un porcentaje de aciertos, y cómo se averigua?',
  '¿Por qué una palabra clave escrita en un grupo deja de servir?',
  '¿Qué diferencia hay entre que te engañen y que te quiten el criterio?',
  '¿Por qué desconfiar de TODO es tan malo como creerlo todo?'
];
let ansVisible=false;
function genTask(){sfx('click');const type=document.getElementById('tgType').value;const count=parseInt(document.getElementById('tgCount').value);ansVisible=false;const out=document.getElementById('tgOut');out.innerHTML='';if(type==='identify')genIdentifyTask(out,count);else if(type==='classify')genClassifyTask(out,count);else if(type==='complete')genCompleteTask(out,count);else if(type==='explain')genExplainTask(out,count);fin('s-tareas');}
function _instrBlock(out,title,lines){const ib=document.createElement('div');ib.className='tg-instruction-block';ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join('');out.appendChild(ib);}
function genIdentifyTask(out,count){_instrBlock(out,'Instrucción',['Copia en tu cuaderno; subraya, colorea o encierra el concepto que se pide en cada oración. Escribe al lado qué peligro nombra y con qué pregunta se desarma.','<strong>Ejemplo:</strong> Un mensaje que pide algo urgente y en secreto trae dos señales. → <span style="color:var(--jade);font-weight:700;">señales</span>']);_pick(identifyTaskDB,Math.min(count,identifyTaskDB.length)).forEach((item,i)=>{const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.type}</div></div>`;out.appendChild(div);});}
function genClassifyTask(out,count){_instrBlock(out,'Instrucción',['Copia la siguiente tabla en tu cuaderno. Para cada peligro, completa de qué familia es, a quién le pasa, qué le cuesta y la pregunta que lo desarma.']);const items=_pick(classifyTaskDB,Math.min(count,classifyTaskDB.length));const wrap=document.createElement('div');wrap.style.overflowX='auto';const th=(t,extra='')=>`<th style="padding:0.3rem 0.4rem;border:1px solid var(--border);font-size:0.72rem;text-align:center;${extra}">${t}</th>`;let html=`<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:520px;"><thead><tr style="background:var(--pri-gl);">${th('Peligro','text-align:left;')}${th('¿De qué familia?')}${th('¿A quién le pasa?')}${th('¿Qué le cuesta?')}${th('La pregunta que lo desarma')}</tr></thead><tbody>`;items.forEach(it=>{html+=`<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td>`+Array(4).fill(`<td style="padding:0.4rem;border:1px solid var(--border);min-width:50px;"></td>`).join('')+'</tr>';});html+='</tbody></table>';wrap.innerHTML=html;out.appendChild(wrap);const ans=document.createElement('div');ans.className='tg-answer';ans.style.marginTop='0.8rem';ans.innerHTML='<strong>✅ Respuestas:</strong><br>'+items.map(it=>`<strong>${it.w}:</strong> Qué es: ${it.gen} | Clase: ${it.n} | Desde cuándo: ${it.g} | Dato: ${it.t}`).join('<br>');out.appendChild(ans);}
function genCompleteTask(out,count){_instrBlock(out,'Instrucción',['Copia y resuelve en tu cuaderno. Cada oración tiene un espacio ___. Elige y escribe la opción correcta.']);const pool=_shuffle([...completeTaskDB]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';const sent=item.s.replace('___','<span class="tg-blank" style="min-width:90px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${sent}</strong><div style="margin-top:0.4rem;font-size:0.82rem;color:var(--gray);">📝 Opciones: <strong>${item.opts.join(' | ')}</strong></div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function genExplainTask(out,count){_instrBlock(out,'Instrucción',['Copia las siguientes preguntas en tu cuaderno y responde cada una de forma clara y completa.']);const pool=_shuffle([...explainQuestions]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.3rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function toggleAns(){ansVisible=!ansVisible;document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none');sfx('click');}

// ===================== SOPA DE LETRAS =====================
const sopaSets=[
  {size:12,grid:[
    ['S','U','F','O','I','S','H','Z','H','L','Ñ','Y'],
    ['C','Z','B','S','E','B','T','H','V','I','Q','T'],
    ['A','N','S','F','E','Y','G','C','B','F','Y','G'],
    ['I','X','E','F','O','C','M','X','K','C','Z','D'],
    ['M','H','L','A','A','B','R','W','V','P','A','L'],
    ['S','U','A','B','U','F','O','E','O','C','I','R'],
    ['Y','W','N','R','N','K','A','V','T','Z','C','A'],
    ['E','Y','E','I','R','I','U','T','I','O','N','M'],
    ['Z','D','S','C','R','G','K','G','S','O','E','A'],
    ['L','Ñ','U','A','G','P','W','H','B','E','G','L'],
    ['K','U','X','D','E','N','E','U','D','F','R','L'],
    ['M','U','Z','A','C','Z','U','D','M','T','U','U']
  ],words:[
    {w:'URGENCIA',cells:[[11,10],[10,10],[9,10],[8,10],[7,10],[6,10],[5,10],[4,10]]},
    {w:'SECRETO',cells:[[1,3],[2,4],[3,5],[4,6],[5,7],[6,8],[7,9]]},
    {w:'ESTAFA',cells:[[9,9],[8,8],[7,7],[6,6],[5,5],[4,4]]},
    {w:'FABRICADA',cells:[[3,3],[4,3],[5,3],[6,3],[7,3],[8,3],[9,3],[10,3],[11,3]]},
    {w:'LLAMAR',cells:[[10,11],[9,11],[8,11],[7,11],[6,11],[5,11]]},
    {w:'SENALES',cells:[[8,2],[7,2],[6,2],[5,2],[4,2],[3,2],[2,2]]}
  ]},
  {size:12,grid:[
    ['A','I','G','M','S','Ñ','C','B','I','R','N','P'],
    ['K','L','Ñ','F','A','S','N','E','F','E','D','X'],
    ['P','P','D','B','F','Q','P','Ñ','T','Z','E','B'],
    ['K','L','R','A','M','U','G','K','B','C','J','N'],
    ['W','S','O','O','D','N','E','T','H','U','N','S'],
    ['Z','P','I','A','M','I','K','N','F','O','O','D'],
    ['V','O','R','Ñ','U','E','C','E','T','N','U','W'],
    ['N','O','E','K','S','P','D','A','Q','E','Z','S'],
    ['N','L','T','C','E','I','O','I','V','X','I','U'],
    ['I','Y','I','T','S','E','K','L','O','I','N','O'],
    ['S','N','R','J','G','S','C','O','R','Q','R','M'],
    ['S','I','C','B','O','V','H','I','F','M','Ñ','P']
  ],words:[
    {w:'SESGO',cells:[[7,4],[8,4],[9,4],[10,4],[11,4]]},
    {w:'PRIVACIDAD',cells:[[11,11],[10,10],[9,9],[8,8],[7,7],[6,6],[5,5],[4,4],[3,3],[2,2]]},
    {w:'CRITERIO',cells:[[11,2],[10,2],[9,2],[8,2],[7,2],[6,2],[5,2],[4,2]]},
    {w:'FUENTE',cells:[[2,4],[3,5],[4,6],[5,7],[6,8],[7,9]]},
    {w:'DEFENSA',cells:[[1,10],[1,9],[1,8],[1,7],[1,6],[1,5],[1,4]]},
    {w:'PROMEDIO',cells:[[2,1],[3,2],[4,3],[5,4],[6,5],[7,6],[8,7],[9,8]]}
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
  {q:'Las tres señales de una estafa son urgencia, secreto y canal nuevo.',a:true},
  {q:'Si la voz suena igual a la de tu mamá, el mensaje es de tu mamá.',a:false},
  {q:'Volver por el canal de siempre sirve aunque el mensaje parezca real.',a:true},
  {q:'Un programa que acierta el 95 % reparte sus errores por igual entre todos.',a:false},
  {q:'La palabra clave de la familia se acuerda en persona.',a:true},
  {q:'Subir una foto de tus compañeros con sus nombres no afecta a nadie más que a vos.',a:false},
  {q:'Un mensaje sin urgencia, sin secreto y por el canal de siempre puede ser perfectamente normal.',a:true},
  {q:'Preguntarle por audio algo que «solo ella sabe» es una defensa segura.',a:false},
  {q:'Lo que más convence de un engaño suele ser la parte que es verdad.',a:true},
  {q:'Un ensayo generado que no podés explicar sigue siendo tuyo si le ponés tu nombre.',a:false},
  {q:'Una decisión de un programa sobre una persona la tiene que poder revisar una persona.',a:true},
  {q:'Los peligros de la IA se arreglan borrando las aplicaciones del teléfono.',a:false},
  {q:'Esperar diez minutos y contárselo a alguien desarma la urgencia y el secreto.',a:true},
  {q:'La opinión fabricada se nota porque las cuentas repiten el mensaje muchas veces.',a:false},
  {q:'Un sistema que no tiene otra forma de entrar deja gente afuera cuando falla.',a:true}
];
const evalMCBank=[
  {q:'¿Cuál NO es una de las tres señales?',o:['Urgencia','Faltas de ortografía','Secreto','Canal nuevo'],a:1},
  {q:'La defensa que sirve siempre ante un mensaje que pide dinero es…',o:['Reconocer la voz','Pedir una foto','Volver por el canal de siempre','Contestar por audio'],a:2},
  {q:'Un promedio de aciertos alto NO dice…',o:['Cuántas veces acertó','A quién le cae el error','Que se equivoca a veces','Cuántos casos revisó'],a:1},
  {q:'La familia «Deciden por vos» se desarma con…',o:['Apagar el teléfono','Reconocer la voz','Borrar la cuenta','Las tres preguntas del sesgo'],a:3},
  {q:'¿Por qué una palabra clave escrita en un grupo ya no sirve?',o:['Porque la puede leer cualquiera que vea el grupo','Porque se olvida','Porque caduca','Porque cambia sola'],a:0},
  {q:'La foto del salón con los nombres, subida al grupo, es un problema de…',o:['Ortografía','Espacio','Privacidad de treinta personas','Batería'],a:2},
  {q:'Un chat que siempre te da la razón está…',o:['Cuidándote','Aprendiendo a quererte','Prediciendo lo que encaja con lo que escribiste','Comprobando datos'],a:2},
  {q:'De qué está hecha una estafa creíble:',o:['De tecnología muy cara','De información que la propia familia publicó','De suerte','De un día festivo'],a:1},
  {q:'Un mensaje del maestro sin prisa ni secreto por el grupo de siempre es…',o:['Un mensaje normal','Sospechoso','Una estafa disimulada','Una prueba'],a:0},
  {q:'La pregunta que desarma la familia «Te engañan» es…',o:['¿Cuánto cuesta?','¿Quién lo hizo?','¿Lo comprobé por otro camino?','¿Está de moda?'],a:2},
  {q:'La pregunta que desarma la familia «Se quedan con lo tuyo» es…',o:['¿Cuánta batería gasta?','¿Es gratis?','¿Lo usan mis amigos?','¿Se lo daría a un desconocido en la calle?'],a:3},
  {q:'La pregunta que desarma la familia «Te quitan el criterio» es…',o:['¿Es rápido?','¿Me gusta?','¿Es popular?','¿Esto lo decidí yo, y lo puedo explicar?'],a:3},
  {q:'Ante un remedio que «cura todo» según un estudio, lo primero es…',o:['Preguntar qué estudio, quién lo hizo y dónde está','Probarlo un día','Compartirlo por si sirve','Comprarlo barato'],a:0},
  {q:'Cuando un sistema con cámara no reconoce una cara, lo que hace falta es…',o:['Cambiar de cara','Que siempre haya otra forma de entrar','Esperar','Reclamar al aparato'],a:1},
  {q:'Reenviar un video sin comprobarlo es…',o:['Parte del daño','Ayudar a avisar','Neutral','Obligatorio'],a:0}
];
const evalCPBank=[
  {q:'La señal que te quita el tiempo de pensar es la ___.',a:'urgencia'},
  {q:'La señal que te deja sin contárselo a nadie es el ___.',a:'secreto'},
  {q:'La tercera señal es el canal ___.',a:'nuevo'},
  {q:'La defensa que sirve siempre es volver por el canal de ___.',a:'siempre'},
  {q:'Una voz fabricada demuestra que la voz ya no es una ___.',a:'prueba'},
  {q:'Un promedio alto puede esconder a quién le cae el ___.',a:'error'},
  {q:'La palabra de la familia se acuerda en ___.',a:'persona'},
  {q:'Lo que subís de otras personas no es ___.',a:'tuyo'},
  {q:'Un trabajo que no podés ___ no es tuyo.',a:'explicar'},
  {q:'Ante algo que decide sobre personas se pregunta con qué ___ se entrenó.',a:'ejemplos'},
  {q:'La familia que te engaña se desarma comprobando por otro ___.',a:'camino'},
  {q:'Lo que más convence de un engaño es la parte que no es ___.',a:'mentira'},
  {q:'Un mensaje sin ninguna de las tres señales es un mensaje ___.',a:'normal'},
  {q:'Una decisión sobre una persona la revisa una ___.',a:'persona'},
  {q:'Un sistema sin otra forma de entrar deja gente ___.',a:'afuera'}
];
const evalPRBank=[
  {term:'Urgencia',def:'La señal que te quita el tiempo de pensar'},
  {term:'Secreto',def:'La señal que te deja sin quien te aconseje'},
  {term:'Canal nuevo',def:'La señal que impide que contestes por donde siempre'},
  {term:'Voz fabricada',def:'Se hace con una grabación corta de la persona'},
  {term:'Video de algo que no pasó',def:'Alguien diciendo lo que nunca dijo, con su cara'},
  {term:'Suplantación',def:'Una cuenta nueva que parece la de un conocido'},
  {term:'Sesgo que decide',def:'El error del programa cae siempre sobre los mismos'},
  {term:'Promedio que esconde',def:'Un porcentaje alto que no dice a quién le falla'},
  {term:'Privacidad',def:'Lo que subís queda, y lo de otros no es tuyo'},
  {term:'Juguete que oye',def:'Un aparato que necesita escuchar para funcionar'},
  {term:'El que decide qué ves',def:'Te da más de lo que te hace quedarte, no lo que te sirve'},
  {term:'El que siempre te da la razón',def:'Un chat que predice lo que encaja con lo que escribiste'},
  {term:'Volver por el canal de siempre',def:'La defensa que sirve ante cualquier mensaje raro'},
  {term:'Palabra acordada en persona',def:'Sirve mientras no se escriba en ningún grupo'},
  {term:'Las tres preguntas',def:'Con qué ejemplos, quién los eligió, a quién le cae el error'}
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

function genEval(){sfx('click');_evalFormaSelector(); const _selF = document.getElementById('evalFormaSel'); if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10))); const cf = evalFormNum; const rng = _evalRng(cf); window._currentEvalForm=cf;evalFormNum = (evalFormNum % EVAL_FORMAS) + 1; _evalFormaSelector();saveProgress();document.getElementById('eval-screen-title').textContent=`🎓 Evaluación Final · Forma ${cf} · Los Peligros de la Inteligencia Artificial`;evalAnsVisible=false;const out=document.getElementById('evalOut');out.innerHTML='';const bar=document.createElement('div');bar.className='eval-score-bar';bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje · 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25 pts</span><span class="eval-score-pill esp-tf">V/F 25 pts</span><span class="eval-score-pill esp-mc">Selección 25 pts</span><span class="eval-score-pill esp-pr">Pareados 25 pts</span></div>`;out.appendChild(bar);const cpItems=_pickF(evalCPBank,5, rng);const s1=document.createElement('div');s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';cpItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='cp';d.dataset.evalIndex=i;const qHtml=item.q.replace('___',`<input class="eval-cp-input" type="text" data-cp="${i}" autocomplete="off">`);d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbCp${i}" aria-live="polite"></div>`;s1.appendChild(d);});out.appendChild(s1);const tfItems=_pickF(evalTFBank,5, rng);const s2=document.createElement('div');s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';tfItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='tf';d.dataset.evalIndex=i;d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="true"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="false"> Falso</label></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbTf${i}" aria-live="polite"></div>`;s2.appendChild(d);});out.appendChild(s2);const mcItems=_pickF(evalMCBank,5, rng);const s3=document.createElement('div');s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';mcItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='mc';d.dataset.evalIndex=i;const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join('');d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbMc${i}" aria-live="polite"></div>`;s3.appendChild(d);});out.appendChild(s3);const prItems=_pickF(evalPRBank,5, rng);const shuffledDefs=_shuffleF(prItems, rng);const letters=['A','B','C','D','E'];const s4=document.createElement('div');s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';const matchCard=document.createElement('div');matchCard.className='eval-item';let colLeft='<div class="eval-match-col"><h4>📌 Términos</h4>';prItems.forEach((item,i)=>{colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> <select class="eval-match-select" data-pr="${i}" aria-label="Respuesta pareada ${i+16}"><option value="">—</option>${letters.map(l=>`<option value="${l}">${l}</option>`).join('')}</select> ${item.term}</div>`;});colLeft+='</div>';let colRight='<div class="eval-match-col"><h4>🔑 Definiciones</h4>';shuffledDefs.forEach((item,i)=>{colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`;});colRight+='</div>';const ansKey=prItems.map((item,i)=>{const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)];return`${i+16}→${letter}`;}).join(' · ');matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div><div class="eval-item-feedback" id="evalFbPr" aria-live="polite"></div>`;s4.appendChild(matchCard);out.appendChild(s4);window._evalPrintData={tf:tfItems,mc:mcItems,cp:cpItems,pr:{terms:prItems,shuffledDefs,letters}};const autoPanel=document.createElement('div');autoPanel.id='evalAutoResult';autoPanel.className='eval-auto-result';autoPanel.innerHTML='<strong>🧮 Evaluación interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato original sin respuestas digitadas.';out.appendChild(autoPanel);fin('s-evaluacion');}
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación Los Peligros de la Inteligencia Artificial · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.12rem 0.4rem;margin:0.22rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #86198f;background:#fdf4ff;color:#86198f;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#86198f;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #86198f;height:12px;}.obt-pct{white-space:nowrap;}.qn{font-weight:700;min-width:22px;flex-shrink:0;}.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:40px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.18rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.14rem 0.35rem;margin-bottom:0.1rem;break-inside:avoid;page-break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.3;display:flex;gap:0.28rem;margin-bottom:0.07rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.1rem 0.5rem;}.mc-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:0.04rem 0.15rem;margin-left:0.8rem;}.mc-opt{font-size:9pt;display:flex;align-items:center;gap:0.15rem;}.mc-opt input{width:10px;height:10px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{margin-top:0.1rem;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.08rem 0.4rem;margin-top:0.08rem;}.pr-head{font-size:9pt;font-weight:700;color:#555;margin-bottom:0.1rem;}.pr-item{font-size:10.5pt;padding:0.1rem 0.28rem;background:#fdf4ff;border-radius:3px;margin-bottom:0.07rem;display:flex;align-items:center;gap:0.2rem;line-height:1.2;break-inside:avoid;page-break-inside:avoid;}.pr-num{font-weight:700;color:#86198f;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.22rem;padding:0.15rem 0;page-break-before:avoid;break-before:avoid;color:#86198f;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #86198f;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#555;}.pa{color:#007a00;font-weight:600;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · Los Peligros de la Inteligencia Artificial · Educación Básica · III Ciclo · Inteligencia Artificial</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Evaluación Final · Los Peligros de la Inteligencia Artificial · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u</div></div><div class="p-grid">${pR}</div>
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
  {txt:'A un alumno le llega un audio con la voz de su papá pidiéndole que retire dinero y no le diga a nadie hasta la noche.'},
  {txt:'En el grupo de la comunidad circula un video del director anunciando que se suspenden las clases. Nadie lo encuentra en ninguna cuenta oficial.'},
  {txt:'Un programa descarta las solicitudes de beca de las escuelas pequeñas porque casi no vio ninguna al entrenarse. Acierta el 92 % del total.'},
  {txt:'Una alumna sube al grupo la foto del salón con el nombre y la sección de cada compañero.'},
  {txt:'Un estudiante pasa dos horas viendo videos que no buscó, después de entrar a estudiar.'},
  {txt:'El maestro avisa por el grupo de siempre, sin prisa y sin secreto, de la reunión del jueves.'}
];
const critCaseQuestions=[
  '1. ¿De qué familia de peligro es, y cómo se llama?',
  '2. ¿A quién le cae el daño, y qué le cuesta exactamente?',
  '3. ¿Qué pregunta lo desarma, y qué haría falta hacer?',
  '4. ¿Qué harías vos si te pasa mañana?'
];
const critCaseGuides=[
  'Se valora que nombre la familia: te engañan, deciden por vos, se quedan con lo tuyo o te quitan el criterio. El último caso NO es ninguna: es un mensaje normal, y reconocerlo es parte de la destreza — desconfiar de todo cuesta lo mismo que creerlo todo.',
  'Se valora que nombre a la persona y el precio: el dinero de la familia, una semana de clases, el año de estudio de quien cumplía los requisitos, la privacidad de treinta compañeros que no la dieron, la tarde de estudio.',
  'Cada caso tiene su pregunta: ¿lo comprobé por otro camino? ¿con qué ejemplos se entrenó y a quién le cae el error? ¿se lo daría a un desconocido en la calle? ¿esto lo decidí yo?',
  'Respuesta abierta. Se valora que sea concreta y que la pueda hacer con el teléfono que tiene: llamar al número de siempre, pedir que una persona revise, borrar la foto y pedir permiso, poner la hora de salir.'
];
const critErrorBank=[
  {txt:'"Yo me doy cuenta de una estafa por la voz."',
   g1:'La voz es lo que se fabrica, y hace falta poca grabación.',
   g2:'Lo que no se puede fabricar es el número de siempre: por ahí se comprueba.'},
  {txt:'"Ese programa acierta el 95 %, así que es justo."',
   g1:'Acertar mucho y repartir bien los errores no son lo mismo.',
   g2:'Ese 5 % puede caer siempre sobre el mismo grupo; el promedio no lo enseña.'},
  {txt:'"Es una foto del salón, no es información privada."',
   g1:'Sí lo es: son treinta caras con nombre y sección que no te las dieron a vos para publicarlas.',
   g2:'Y lo que salió no vuelve.'},
  {txt:'"Como puede haber estafas, mejor no le creo a ningún mensaje."',
   g1:'Desconfiar de todo cuesta lo mismo que creerlo todo: el aviso de verdad deja de leerse.',
   g2:'Por eso se miran las tres señales, que separan un mensaje raro de uno normal.'},
  {txt:'"Si el chat me da la razón es porque tengo razón."',
   g1:'Está hecho para seguir la conversación, así que tiende a encajar con lo que escribiste.',
   g2:'Lo que duele o lo que importa se habla con una persona, que sí te va a contradecir.'},
  {txt:'"Yo no mandé el video falso, solo lo reenvié."',
   g1:'La desinformación vive de los reenvíos, no de quien la fabrica.',
   g2:'Comprobar antes de compartir es la parte que te toca a vos.'}
];
const critDecisionBank=[
  'Te llega un audio urgente con la voz de un familiar pidiendo dinero; conviene mandarlo para no perder tiempo, o colgar y llamar vos al número de siempre.',
  'Un video que te indigna circula en el grupo; conviene reenviarlo para avisar, o buscar primero si está en la cuenta que lo firma.',
  'Un programa rechazó la solicitud de tu prima en segundos; conviene aceptarlo porque acierta mucho, o pedir que una persona la revise.',
  'Querés subir la foto del salón; conviene subirla porque salen todos bien, o preguntarles antes a los que salen.',
  'Un compañero está por mandar dinero por un mensaje raro; conviene no meterse, o decirle que llame primero.'
];
const critDecisionGuide='La mejor decisión comprueba por otro camino antes de actuar, pide que una persona revise lo que decidió un programa, pregunta antes de publicar lo que es de otros, y avisa a quien está a punto de caer. Todas cuestan unos minutos, y ese es justo el punto: las tres señales —urgencia, secreto y canal nuevo— están puestas para que no tengas esos minutos. Y avisarle a un compañero no es meterse: es lo que hace un amigo.';
const critCompareBank=[
  {a:'Una alucinación.',b:'Una estafa con voz fabricada.',
   ga:'El modelo se inventa un dato sin que nadie se lo pida.',
   gb:'Una persona fabrica la voz a propósito para quitarte dinero.',
   gr:'La primera es cómo funciona la máquina; la segunda es una decisión de alguien. Las dos engañan, pero solo en una hay intención, y eso cambia quién responde.'},
  {a:'Un programa que acierta el 95 % repartido parejo.',b:'Un programa que acierta el 95 % fallando siempre con el mismo grupo.',
   ga:'El error le toca de vez en cuando a cualquiera.',
   gb:'El error le toca siempre a los mismos.',
   gr:'El promedio es idéntico y las dos cosas no se parecen en nada. Por eso la pregunta no es «¿cuánto acierta?», sino «¿a quién le cae el error?».'},
  {a:'Desconfiar de todo mensaje.',b:'Mirar las tres señales.',
   ga:'Te deja sin poder creerle a nadie, ni al aviso de verdad del maestro.',
   gb:'Te deja separar un mensaje raro de uno normal en diez segundos.',
   gr:'Defenderse no es vivir asustado: es tener una comprobación corta y usarla siempre. Un alumno que desconfía de todo acaba sin leer el aviso que sí importaba.'}
];
const critCauseBank=[
  {cause:'Quien engaña necesita que no pienses, que no consultes y que no contestes por donde siempre.',guide:'Por eso las tres señales —urgencia, secreto y canal nuevo— están en casi toda estafa: sin ellas no funciona.'},
  {cause:'Una voz se fabrica con muy poca grabación.',guide:'Por eso reconocer la voz dejó de ser una prueba, y la comprobación tiene que ir por otro camino.'},
  {cause:'Un modelo acierta más sobre los grupos de los que vio más ejemplos.',guide:'Por eso un promedio alto puede esconder que a un grupo pequeño le falla casi siempre.'},
  {cause:'Lo que se publica queda y lo puede leer cualquiera.',guide:'Por eso una estafa creíble se arma casi toda con información que la propia familia subió.'},
  {cause:'Un chat está hecho para seguir la conversación.',guide:'Por eso tiende a darte la razón, y por eso no sustituye a una persona que te contradiga.'}
];
const critEffectBank=[
  {effect:'Una familia pierde el dinero de una matrícula por un audio.',guide:'Porque la voz se fabricó con un video público y nadie llamó al número de siempre.'},
  {effect:'Una alumna de una escuela de aldea se queda sin beca aunque cumplía.',guide:'Porque el programa casi no vio solicitudes como la suya, y su error cae siempre sobre las mismas.'},
  {effect:'Treinta compañeros quedan publicados con su nombre y su sección.',guide:'Porque alguien subió una foto que no era suya para subirla, y lo que salió no vuelve.'},
  {effect:'Un aviso de verdad del maestro no lo lee casi nadie.',guide:'Porque en ese grupo ya circularon tantos mensajes falsos que la gente dejó de creer todo, que es el otro daño de la desinformación.'},
  {effect:'Un alumno se defiende de un mensaje raro en diez segundos.',guide:'Porque buscó las tres señales y volvió por el canal de siempre, en vez de contestar ahí.'}
];
function genEvalCrit(){
  sfx('click');
  _injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });
  const _sC = document.getElementById('evalCritFormaSel');
  if (_sC && parseInt(_sC.value, 10)) evalCritFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sC.value, 10)));
  const cf=evalCritFormNum;window._currentEvalCritForm=cf;const rngC = _evalRng(200000 + cf);evalCritFormNum=(evalCritFormNum%EVAL_FORMAS)+1;_injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });saveProgress();
  document.getElementById('evalcrit-screen-title').textContent=`🧠 Pensamiento Crítico · Forma ${cf} · Los Peligros de la Inteligencia Artificial`;
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
  const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Pensamiento Crítico Los Peligros de la Inteligencia Artificial · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.1rem 0.4rem;margin:0.2rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #86198f;background:#fdf4ff;color:#86198f;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#86198f;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #86198f;height:12px;}.obt-pct{white-space:nowrap;}.crit-print-scenario{font-size:10.5pt;background:#fdf4ff;border-left:3px solid #86198f;padding:0.2rem 0.5rem;margin:0.1rem 0 0.2rem;line-height:1.3;}.crit-print-q{font-size:10pt;font-weight:600;margin:0.15rem 0 0.08rem;line-height:1.25;}.ln{border-bottom:1px solid #111;min-height:12px;margin-bottom:2px;}.crit-compare-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin:0.15rem 0;}.crit-compare-print-box{font-size:9.5pt;background:#fdf4ff;border-radius:4px;padding:0.25rem 0.4rem;line-height:1.25;}.crit-print-tbl{width:100%;border-collapse:collapse;font-size:9.5pt;margin-top:0.15rem;}.crit-print-tbl th,.crit-print-tbl td{border:1px solid #999;padding:0.3rem 0.45rem;text-align:left;height:30px;vertical-align:middle;}.crit-print-tbl th{background:#fdf4ff;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.08rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.9rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.45rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.1rem;margin-bottom:0.18rem;}.p-crit-line{font-size:11pt;color:#007a00;margin-bottom:0.18rem;line-height:1.35;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.2rem;padding:0.1rem 0;color:#86198f;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #86198f;}.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:12.7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="critEvalPage"><div class="ph"><h2>Evaluación Competencial · Pensamiento Crítico · Los Peligros de la Inteligencia Artificial · Educación Básica · III Ciclo · Inteligencia Artificial</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 5 secciones de 20 puntos</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100</span></div></div><div class="pauta-wrap" id="critPautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Pensamiento Crítico · Los Peligros de la Inteligencia Artificial · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 5 secciones × 20 pts c/u — respuesta abierta, usar como guía de corrección</div></div><div class="p-grid">${pR}</div></div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("critEvalPage",250,0.55,1.2);fit("critPautaPage",250,0.55,1.2);})();<\/script></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(doc);win.document.close();setTimeout(()=>win.print(),400);
}

// ===================== LABORATORIO DE LOS SÍMBOLOS =====================
const parteData = (function () {
  /* Las cuatro familias, con lo que el alumno tiene que poder decir de cada
     una: qué es, un caso, la pregunta que la desarma y con qué se defiende.
     Sale de js/data/ia-peligros.js, igual que la ficha impresa. */
  const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const out = {};
  IA_FAMILIAS.forEach(f => {
    const dentro = IA_PELIGROS.filter(p => p.familia === f.k);
    const conCaso = dentro.find(p => p.caso) || dentro[0];
    out[f.k] = {
      nombre: f.nombre, icon: f.emoji,
      estructura: { title: '¿Qué es?',                info: '<strong>' + esc(f.que) + '</strong><br><br>Aquí dentro van: ' + dentro.map(p => esc(p.emoji + ' ' + p.nombre)).join(' · ') },
      funcion:    { title: 'A alguien le pasó',        info: '<strong>' + esc(conCaso.nombre) + '.</strong><br><br>' + esc(conCaso.caso || conCaso.mecanismo) + '<br><br><em>Le cuesta: ' + esc(conCaso.cuesta) + '</em>' },
      ubicacion:  { title: 'La pregunta que lo desarma', info: '❓ <strong>' + esc(f.pregunta) + '</strong>' },
      dato:       { title: '¿Cómo te defendés?',       info: '🛡️ ' + esc(conCaso.defensa) }
    };
  });
  return out;
})();
let labParte='enganan',labAspecto='estructura';
function labShowParte(parteKey){labParte=parteKey;updateLabDisplay();document.querySelectorAll('.lab-cont-btn').forEach(b=>b.classList.remove('active-pri'));const btn=document.querySelector(`[data-parte="${parteKey}"]`);if(btn)btn.classList.add('active-pri');if(typeof sfx==='function')sfx('click');}
function labShowAspecto(aspectoKey){labAspecto=aspectoKey;updateLabDisplay();document.querySelectorAll('.lab-asp-btn').forEach(b=>b.classList.remove('active-sec'));const btn=document.querySelector(`[data-aspecto="${aspectoKey}"]`);if(btn)btn.classList.add('active-sec');if(typeof sfx==='function')sfx('click');}
function updateLabDisplay(){const data=parteData[labParte];const asp=data[labAspecto];document.getElementById('lab-sentence').innerHTML=`🔬 Explorando: <strong>${data.nombre}</strong> → <strong>${asp.title}</strong>`;document.getElementById('lab-display').innerHTML=`<div class="lab-cont-header">${data.icon} ${data.nombre}</div><div class="lab-asp-title">${asp.title}</div><div class="lab-asp-info">${asp.info}</div>`;}

// ===================== DIPLOMA =====================
function _diplPct(){return xp>=MXP?100:Math.round((xp/MXP)*100);}
function openDiploma(){sfx('fan');const pct=_diplPct();document.getElementById('diplPct').textContent=pct+'%';document.getElementById('diplBar').style.width=pct+'%';document.getElementById('diplDate').textContent='Fecha: '+new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});const msgs=['¡Sigue aprendiendo!','¡Muy buen trabajo!','¡Vas muy bien!','¡Conoces a los que hicieron Honduras!','¡Guardián de la Patria!'];document.getElementById('diplMsg').textContent=msgs[Math.min(Math.floor(pct/25),4)];const stars=['⭐','⭐⭐','⭐⭐⭐'];document.getElementById('diplStars').textContent=stars[Math.min(Math.floor(pct/40),2)];const achTxt=unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(' · ');document.getElementById('diplAch').textContent=achTxt||'Sigue completando secciones para desbloquear logros';document.getElementById('diplomaOverlay').classList.add('open');launchConfetti();}
function closeDiploma(){document.getElementById('diplomaOverlay').classList.remove('open');}
function updateDiplomaName(v){document.getElementById('diplName').textContent=v||'Estudiante';}
function shareWA(){const name=document.getElementById('diplName').textContent||'Estudiante';const pct=_diplPct();const msg=`🛡️ ¡${name} completó la Misión "Los Peligros de la Inteligencia Artificial"! 🏅 Progreso: ${pct}% · 🌱 policastsapien.com`;_waShare(msg);}
async function captureDiploma(){if(typeof html2canvas==='undefined'){showToast('⚠️ Cargando... intenta de nuevo');return;}sfx('click');const card=document.querySelector('.diploma-card');const btn=document.querySelector('.diploma-actions .btn-pri');const toHide=[card.querySelector('.diploma-input'),card.querySelector('.diploma-actions'),card.querySelector('hr')];if(btn){btn.disabled=true;btn.textContent='⏳ Capturando...';}toHide.forEach(el=>{if(el)el.style.display='none';});let dataUrl='';try{const canvas=await html2canvas(card,{scale:2,useCORS:true,backgroundColor:'#ffffff'});toHide.forEach(el=>{if(el)el.style.display='';});dataUrl=canvas.toDataURL('image/png');const name=(document.getElementById('diplName').textContent||'Estudiante').replace(/\s+/g,'-');const fileName='constancia-'+name+'.png';const cap=window.Capacitor;if(cap&&cap.isNativePlatform&&cap.isNativePlatform()&&cap.Plugins?.Filesystem&&cap.Plugins?.Share){const base64Data=dataUrl.split(',')[1];const result=await cap.Plugins.Filesystem.writeFile({path:fileName,data:base64Data,directory:'CACHE'});await cap.Plugins.Share.share({url:result.uri,dialogTitle:'Guardar / Compartir Constancia'});}else{const a=document.createElement('a');a.href=dataUrl;a.download=fileName;a.click();}}catch(e){toHide.forEach(el=>{if(el)el.style.display='';});if(e.name!=='AbortError')showToast('⚠️ No se pudo guardar la constancia');}finally{if(btn){btn.disabled=false;btn.textContent='📷 Guardar foto';}}}

// ===================== INIT =====================

// ===================== LOS PELIGROS, EN LA PANTALLA =====================
/* Las señales, las familias, el catálogo y el botiquín se PINTAN desde
   js/data/ia-peligros.js, y las tres reglas de oro desde
   js/data/ia-conceptos.js: la pantalla y la ficha que se fotocopia salen del
   mismo sitio, así que no pueden decir cosas distintas. De ahí sale la
   comprobación de `_dev/verifica-ia.js`. */
function _esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

function pintarIaSenales(){
  const cont=document.getElementById('ia-senales');if(!cont)return;
  cont.innerHTML=IA_SENALES.map((s,i)=>
    `<div class="ciclo-paso"><div class="ciclo-e">${s.emoji}</div><div><h4>${i+1}. ${_esc(s.nombre)}</h4><p><em>${_esc(s.suena)}</em></p><p>${_esc(s.porque)}</p><p class="sen-def">🛡️ ${_esc(s.defensa)}</p></div></div>`
  ).join('');
}

function pintarIaFamilias(){
  const cont=document.getElementById('ia-familias');if(!cont)return;
  cont.innerHTML=IA_FAMILIAS.map(f=>
    `<div class="fam-caja"><h4>${f.emoji} ${_esc(f.nombre)}</h4><p>${_esc(f.que)}</p><p class="fam-preg">❓ ${_esc(f.pregunta)}</p></div>`
  ).join('');
}

/* El catálogo entero, agrupado por familia. El que va SIN caso lo dice: son
   los tres que no se cuentan con nombres a propósito (la salud y las
   decisiones públicas), porque en un pueblo un caso con nombres es alguien. */
function pintarIaCatalogo(){
  const cont=document.getElementById('ia-catalogo');if(!cont)return;
  cont.innerHTML=IA_FAMILIAS.map(f=>{
    const dentro=IA_PELIGROS.filter(p=>p.familia===f.k);
    return `<div class="cat-fam"><h4>${f.emoji} ${_esc(f.nombre)}</h4>${dentro.map(p=>
      `<div class="cat-p"><div class="cat-tit">${p.emoji} ${_esc(p.nombre)}</div>`+
      `<p class="cat-mec">${_esc(p.mecanismo)}</p>`+
      (p.caso?`<p class="cat-caso">👤 ${_esc(p.caso)} <em>Le cuesta: ${_esc(p.cuesta)}.</em></p>`
             :`<p class="cat-caso cat-sincaso">Este va <strong>sin caso, a propósito</strong>: cuesta ${_esc(p.cuesta)}, y contarlo con nombres acabaría señalando a alguien del pueblo.</p>`)+
      `<p class="cat-preg">❓ ${_esc(p.pregunta)}</p><p class="cat-def">🛡️ ${_esc(p.defensa)}</p></div>`
    ).join('')}</div>`;
  }).join('');
}

function pintarIaBotiquin(){
  const cont=document.getElementById('ia-botiquin');if(!cont)return;
  cont.innerHTML=IA_DEFENSAS.map(d=>
    `<div class="bot-caja"><h4>${d.emoji} ${_esc(d.nombre)}</h4><p><strong>Sirve para:</strong> ${_esc(d.para)}</p><p class="bot-no"><strong>NO sirve:</strong> ${_esc(d.noPara)}</p></div>`
  ).join('');
}

function pintarIaReglas(){
  const cont=document.getElementById('ia-reglas');if(!cont)return;
  cont.innerHTML=IA_REGLAS_ORO.map((r,i)=>
    `<div class="ia-regla"><div class="ia-regla-n">${r.emoji}</div><div><h4>${i+1}. ${_esc(r.regla)}</h4><p>${_esc(r.porque)}</p></div></div>`
  ).join('');
}

// ═════════════ 🚨 LAS TRES SEÑALES, EN MENSAJES DE VERDAD ═════════════
/* El alumno marca en el mensaje los pedazos que son señal. Se usan las mismas
   clases del cazador de la etapa 4 (`caz-trozo` y sus estados), así que el
   resultado se lee igual: ✅ lo que marcó bien, ⬅️ la señal que se le pasó,
   ❌ lo que marcó y no era. Símbolo ADEMÁS de color, la regla de siempre.

   ⚠️ El cuarto mensaje NO TRAE NINGUNA SEÑAL, y es el que más enseña: una
   misión de peligros que solo enseñe mensajes malos fabrica un alumno que
   desconfía de todo, y eso cuesta lo mismo que creerlo todo. */
let iaMsgIdx=0, iaMsgMarcas={}, iaMsgVisto={}, iaMsgHechos=new Set();

function iaMsgPintarLista(){
  const c=document.getElementById('msg-lista');if(!c)return;
  c.innerHTML=IA_MENSAJES.map((m,i)=>
    `<button type="button" class="desc-chip${i===iaMsgIdx?' desc-on':''}${iaMsgHechos.has(m.k)?' desc-hecho':''}" onclick="iaMsgElegir(${i})">${m.emoji} ${_esc(m.de)}</button>`
  ).join('');
}
function iaMsgElegir(i){iaMsgIdx=i;iaMsgPintarLista();iaMsgPintar(!!iaMsgVisto[IA_MENSAJES[i].k]);}
function iaMsgTocar(i){
  const m=IA_MENSAJES[iaMsgIdx];const s=iaMsgMarcas[m.k]||(iaMsgMarcas[m.k]=new Set());
  if(s.has(i))s.delete(i);else s.add(i);
  iaMsgPintar(false);
}
function iaMsgPintar(revisado){
  const caja=document.getElementById('msg-caja');if(!caja)return;
  const m=IA_MENSAJES[iaMsgIdx];const marcas=iaMsgMarcas[m.k]||new Set();
  let html=`<p class="msg-de">${m.emoji} <strong>${_esc(m.de)}</strong></p><div class="caz-texto msg-texto">`;
  m.trozos.forEach((z,i)=>{
    if(revisado){
      const marcado=marcas.has(i), esSenal=!!z.t;
      const cls=esSenal?(marcado?'caz-ok':'caz-falta'):(marcado?'caz-sobra':'caz-ok');
      /* ⚠️ Los cuatro casos llevan símbolo, también el trozo normal que se dejó
         sin marcar: un recuadro verde sin glifo es decir el acierto SOLO con
         color, y uno de cada doce niños no lo distingue. */
      const sim=esSenal?(marcado?'✅ ':'⬅️ '):(marcado?'❌ ':'✅ ');
      html+=`<span class="caz-trozo ${cls}">${sim}${_esc(z.txt)}</span> `;
    }else{
      html+=`<button type="button" class="caz-trozo${marcas.has(i)?' caz-marcado':''}" aria-pressed="${marcas.has(i)?'true':'false'}" onclick="iaMsgTocar(${i})">${_esc(z.txt)}</button> `;
    }
  });
  html+='</div>';
  if(revisado){
    const sen=m.trozos.filter(z=>z.t);
    html+=sen.length
      ?'<div class="caz-detalle">'+sen.map(z=>{const s=IA_SENALES.find(x=>x.k===z.t);return `<p><strong>${s.emoji} ${_esc(s.nombre)}:</strong> «${_esc(z.txt.trim())}» — ${_esc(s.porque)}</p>`;}).join('')+'</div>'
      :'<div class="caz-detalle"><p><strong>✅ Ninguna señal.</strong> Este mensaje no pide nada urgente, no pide secreto y llega por donde siempre. <strong>No todo mensaje es una estafa</strong>, y desconfiar de todo cuesta lo mismo que creerlo todo: el día que el aviso sea de verdad, nadie lo lee.</p></div>';
  }
  html+='<div class="ens-btns">'+(revisado?'':'<button class="btn btn-g" onclick="iaMsgRevisar()">✔ Revisar</button>')+
    '<button class="btn btn-d" onclick="iaMsgReiniciar()">🔄 Empezar de nuevo</button></div>';
  caja.innerHTML=html;
}
function iaMsgRevisar(){
  const m=IA_MENSAJES[iaMsgIdx];const marcas=iaMsgMarcas[m.k]||new Set();
  let bien=0;m.trozos.forEach((z,i)=>{if((!!z.t)===marcas.has(i))bien++;});
  const todo=bien===m.trozos.length;sfx(todo?'ok':'no');
  fb('fbMsg',todo?'✅ Las '+m.trozos.length+' bien. Eso son diez segundos de comprobación.':'Acertaste '+bien+' de '+m.trozos.length+'. Mirá abajo cuál se te pasó.',todo);
  if(!iaMsgHechos.has(m.k)){iaMsgHechos.add(m.k);if(!xpTracker.wgt.has('msg_'+m.k)){xpTracker.wgt.add('msg_'+m.k);pts(2);}}
  if(todo&&!xpTracker.wgt.has('msg_ok_'+m.k)){xpTracker.wgt.add('msg_ok_'+m.k);pts(2);}
  if(iaMsgHechos.size>=IA_MENSAJES.length){fin('s-estructura');unlockAchievement('senalero');}
  iaMsgVisto[m.k]=true;iaMsgPintarLista();iaMsgPintar(true);
}
function iaMsgReiniciar(){
  const m=IA_MENSAJES[iaMsgIdx];iaMsgMarcas[m.k]=new Set();iaMsgVisto[m.k]=false;
  const f=document.getElementById('fbMsg');if(f){f.textContent='';f.className='fb';}
  iaMsgPintar(false);
}

window.addEventListener('DOMContentLoaded',()=>{
  try{iaDescInit();}catch(e){} // 🔭 Descubre: pinta las actividades; no marca ninguna sección. Si el archivo de datos no llegó, la misión sigue.
  initTheme();
  loadProgress();
  pintarIaSenales();
  pintarIaFamilias();
  pintarIaCatalogo();
  pintarIaBotiquin();
  pintarIaReglas();
  iaMsgPintarLista();
  iaMsgPintar(false);
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
  document.querySelector('[data-parte="enganan"]')?.classList.add('active-pri');
  document.querySelector('[data-aspecto="estructura"]')?.classList.add('active-sec');
  renderAchPanel();
});

(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalCrit==='function') _injectFormaSel('genEvalCrit','evalCritFormaSel',evalCritFormNum,function(v){evalCritFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();

// ===================== 🔭 DESCUBRE · LOS PELIGROS =====================
/* Dos actividades de descubrimiento. Las CUENTAS viven en
   js/data/ia-descubre.js (iaEstafaMensaje, iaExactitud): es lo que la sonda
   `verifica-descubre-ia` recalcula, y por eso aquí solo se pinta, se lleva el
   XP y se guarda lo que el alumno escribe. */
const DESC_KEY = SAVE_KEY + '_descubre';
function iaDescGuardar(k, v) { try { const s = JSON.parse(localStorage.getItem(DESC_KEY) || '{}'); s[k] = v; localStorage.setItem(DESC_KEY, JSON.stringify(s)); } catch (e) {} }
function iaDescLeer(k) { try { return (JSON.parse(localStorage.getItem(DESC_KEY) || '{}'))[k]; } catch (e) { return undefined; } }
/* La sección se gana HACIENDO las dos: armar el mensaje con al menos cuatro
   piezas, mirar tres defensas y probar tres repartos. Nunca se marca al abrir. */
function iaDescubreListo() {
  if (iaEstPiezas.length >= 4 && iaEstDefVistas.size >= 3 && iaProProbados.size >= 3) { fin('s-descubre'); unlockAchievement('blindado'); }
}

/* ── 🎙️ ¿Cuánto hace falta para una estafa? ───────────────────────────────
   El alumno se pone del otro lado y arma el mensaje. No se le enseña a
   fabricar nada: se le enseña DE QUÉ ESTÁ HECHO el engaño —información que la
   propia familia publicó— y termina siempre en la otra mitad, qué lo hubiera
   parado. Es la educación de defensa que se hace con el correo falso en
   cualquier oficina, y aquí acaba en algo que el alumno decide. */
let iaEstPiezas = [], iaEstDefVistas = new Set();
function iaEstPintar() {
  const lista = document.getElementById('est-piezas');
  if (lista) lista.innerHTML = IA_ESTAFA_PIEZAS.map(p =>
    '<button type="button" class="desc-chip' + (iaEstPiezas.indexOf(p.k) >= 0 ? ' desc-on' : '') + '" onclick="iaEstToggle(\'' + p.k + '\')">' + p.emoji + ' ' + _esc(p.que) + '</button>').join('');
  const caja = document.getElementById('est-caja'); if (!caja) return;
  const msg = iaEstafaMensaje(iaEstPiezas);
  /* Las tres señales se resaltan dentro del mensaje armado: están con piezas
     y sin piezas, porque son el esqueleto del engaño y no un adorno. */
  let pintado = _esc(msg);
  IA_ESTAFA_SENALES.forEach(s => {
    const b = _esc(s.busca);
    pintado = pintado.replace(b, '<mark class="est-senal">' + b + '</mark>');
  });
  const usadas = IA_ESTAFA_PIEZAS.filter(p => iaEstPiezas.indexOf(p.k) >= 0);
  let html = '<p class="est-rot">📨 El mensaje que le llegaría a Yoselin, con <strong>' + iaEstPiezas.length + ' de ' + IA_ESTAFA_PIEZAS.length + '</strong> piezas:</p>' +
    '<p class="est-msg">' + pintado + '</p>';
  html += usadas.length
    ? '<div class="est-aporta">' + usadas.map(p => '<p><strong>' + p.emoji + ' ' + _esc(p.que) + ':</strong> ' + _esc(p.aporta) + '<br><em>De dónde salió: ' + _esc(p.publico) + '</em></p>').join('') + '</div>'
    : '<p class="est-vacio">Sin ninguna pieza el mensaje es genérico: ni siquiera sabe tu nombre. Así lo dudaría cualquiera. Andá añadiendo piezas y mirá en qué se convierte.</p>';
  if (iaEstPiezas.length >= IA_ESTAFA_PIEZAS.length) {
    html += '<p class="est-fin">🎯 <strong>Ninguna de estas piezas se robó.</strong> El video del cumpleaños, el nombre, la escuela, dónde trabaja tu mamá y hasta el aviso de la matrícula estaban publicados. Lo único que puso quien engaña es el número nuevo. <strong>Y fijate en lo resaltado:</strong> las tres señales están ahí con piezas y sin piezas, porque sin ellas la estafa no funciona. Son lo único que no pueden quitar, y por eso son lo que hay que mirar.</p>';
  }
  caja.innerHTML = html;
}
function iaEstToggle(k) {
  const i = iaEstPiezas.indexOf(k);
  if (i >= 0) iaEstPiezas.splice(i, 1); else iaEstPiezas.push(k);
  sfx('click');
  if (i < 0 && !xpTracker.wgt.has('est_' + k)) { xpTracker.wgt.add('est_' + k); pts(1); }
  if (iaEstPiezas.length === IA_ESTAFA_PIEZAS.length && !xpTracker.wgt.has('est_todas')) {
    xpTracker.wgt.add('est_todas'); pts(3);
    fb('fbEst', '+3 XP: con las seis piezas el mensaje es indistinguible… y las seis salieron de algo publicado.', true);
  }
  iaEstPintar(); iaDescubreListo();
}
function iaEstPintarDefensas() {
  const c = document.getElementById('est-defensas'); if (!c) return;
  c.innerHTML = IA_ESTAFA_DEFENSAS.map(d => {
    const visto = iaEstDefVistas.has(d.k);
    const marca = d.vale === 'si' ? '✅ Sí lo para' : (d.vale === 'no' ? '❌ No lo para' : '⚠️ A medias');
    const cls = d.vale === 'si' ? 'def-si' : (d.vale === 'no' ? 'def-no' : 'def-medias');
    return '<div class="est-def ' + (visto ? cls : '') + '">' +
      '<button type="button" class="pet-op' + (visto ? ' pet-on' : '') + '" onclick="iaEstDefensa(\'' + d.k + '\')"' + (visto ? ' disabled' : '') + '>' + d.emoji + ' ' + _esc(d.que) + '</button>' +
      (visto ? '<p class="est-def-r"><strong>' + marca + '.</strong> ' + _esc(d.porque) + '</p>' : '') + '</div>';
  }).join('');
}
function iaEstDefensa(k) {
  if (iaEstDefVistas.has(k)) return;
  iaEstDefVistas.add(k); sfx('ok');
  if (!xpTracker.wgt.has('estdef_' + k)) { xpTracker.wgt.add('estdef_' + k); pts(1); }
  if (iaEstDefVistas.size === IA_ESTAFA_DEFENSAS.length && !xpTracker.wgt.has('estdef_todas')) {
    xpTracker.wgt.add('estdef_todas'); pts(3);
    fb('fbEst', '+3 XP: de las cinco, solo tres paran esto. Las otras dos se caen justo con las piezas que armaste.', true);
  }
  iaEstPintarDefensas(); iaDescubreListo();
}
function iaEstReiniciar() { iaEstPiezas = []; iaEstDefVistas = new Set(); iaEstPintar(); iaEstPintarDefensas(); }
function iaEstGuardar() {
  const v = id => ((document.getElementById(id) || {}).value || '').trim();
  const acuerdo = v('est-acuerdo'), publico = v('est-publico');
  if (acuerdo.length < 4 && publico.length < 4) { fb('fbEst', 'Contestá al menos una de las dos, con lo que vas a hacer de verdad.', false); return; }
  iaDescGuardar('estafa', { acuerdo: acuerdo, publico: publico });
  iaEstMostrarGuardado({ acuerdo: acuerdo, publico: publico }); sfx('up');
  if (!xpTracker.wgt.has('est_plan')) { xpTracker.wgt.add('est_plan'); pts(3); }
  fb('fbEst', '+3 XP: eso es lo único de esta pantalla que de verdad te defiende.', true);
}
function iaEstMostrarGuardado(g) {
  const c = document.getElementById('est-guardado'); if (!c || !g) return;
  c.innerHTML = '💾 Guardado: ' + (g.acuerdo ? '<strong>acordar la palabra</strong> ' + _esc(g.acuerdo) + '. ' : '') +
    (g.publico ? '<strong>Dejar de publicar:</strong> ' + _esc(g.publico) + '.' : '');
}

/* ── ⚖️ El promedio que esconde ───────────────────────────────────────────
   La idea que no se ve en un párrafo: el porcentaje de aciertos no dice a
   quién le cae el error. El alumno reparte los ejemplos y mira la exactitud
   por grupo. La cuenta es determinista y vive en el archivo de datos, así que
   la sonda la rehace igual. */
let iaProSis = 0, iaProRep = 'poblacion', iaProProbados = new Set();
function iaProPintarSistemas() {
  const c = document.getElementById('pro-sistemas'); if (!c) return;
  c.innerHTML = IA_SISTEMAS.map((s, i) =>
    '<button type="button" class="desc-chip' + (i === iaProSis ? ' desc-on' : '') + '" onclick="iaProSistema(' + i + ')">' + s.emoji + ' ' + _esc(s.nombre) + '</button>').join('');
  const r = document.getElementById('pro-repartos');
  if (r) r.innerHTML = IA_REPARTOS.map(x =>
    '<button type="button" class="desc-chip' + (x.k === iaProRep ? ' desc-on' : '') + (iaProProbados.has(IA_SISTEMAS[iaProSis].k + ':' + x.k) ? ' desc-hecho' : '') +
    '" onclick="iaProReparto(\'' + x.k + '\')">' + _esc(x.nombre) + '</button>').join('');
}
function iaProSistema(i) { iaProSis = i; iaProPintarSistemas(); iaProPintar(); }
function iaProReparto(k) {
  iaProRep = k; const s = IA_SISTEMAS[iaProSis]; const clave = s.k + ':' + k;
  if (!iaProProbados.has(clave)) {
    iaProProbados.add(clave);
    if (!xpTracker.wgt.has('pro_' + clave)) { xpTracker.wgt.add('pro_' + clave); pts(1); }
  }
  const todos = IA_REPARTOS.every(r => iaProProbados.has(s.k + ':' + r.k));
  if (todos && !xpTracker.wgt.has('pro_todo_' + s.k)) { xpTracker.wgt.add('pro_todo_' + s.k); pts(3); }
  sfx('ok'); iaProPintarSistemas(); iaProPintar(); iaDescubreListo();
}
function iaProPintar() {
  const caja = document.getElementById('pro-caja'); if (!caja) return;
  const s = IA_SISTEMAS[iaProSis]; const e = iaExactitud(s, iaProRep);
  const chico = e.porGrupo.reduce((a, g) => (g.cuantos < a.cuantos ? g : a), e.porGrupo[0]);
  const grande = e.porGrupo.reduce((a, g) => (g.cuantos > a.cuantos ? g : a), e.porGrupo[0]);
  let html = '<p class="pro-tit">' + s.emoji + ' ' + _esc(s.nombre) + '</p>' +
    '<p class="pro-que">Decide <strong>' + _esc(s.decide) + '</strong>. Cuando falla, cuesta <strong>' + _esc(s.cuesta) + '</strong>.</p>' +
    '<p class="pro-media">📣 Lo que se presume: <strong>' + e.media + ' % de aciertos</strong> sobre las ' + e.total + ' personas.</p>' +
    '<div class="pro-barras">' + e.porGrupo.map(g =>
      '<div class="curva-fila"><span class="pro-g">' + _esc(g.nombre) + '<small>' + g.cuantos + ' personas · ' + g.ejemplos + ' ejemplos</small></span>' +
      '<span class="curva-barra"><i style="width:' + g.pct + '%"></i></span><span class="curva-pct">' + g.pct + ' %</span></div>').join('') + '</div>' +
    '<p class="pro-fallan">Se equivoca con <strong>' + e.fallan[0] + '</strong> de ' + e.porGrupo[0].cuantos + ' y con <strong>' + e.fallan[1] + '</strong> de ' + e.porGrupo[1].cuantos + '.</p>';
  if (chico.pct <= 55) {
    html += '<p class="pro-nota pro-mal">⚠️ Fijate: el promedio dice <strong>' + e.media + ' %</strong> y suena bien. Pero para <strong>' + _esc(chico.nombre.toLowerCase()) + '</strong> esto es <strong>echar una moneda al aire</strong>: nunca vio un ejemplo suyo. El promedio lo salva el grupo grande.</p>';
  } else if (Math.abs(grande.pct - chico.pct) >= 10) {
    html += '<p class="pro-nota">El promedio se ve bien y la diferencia entre los dos grupos es de <strong>' + Math.abs(grande.pct - chico.pct) + ' puntos</strong>. El número de arriba no lo enseña: hay que preguntarlo.</p>';
  } else {
    html += '<p class="pro-nota pro-bien">✅ Con este reparto los dos grupos van casi igual… y además el promedio es el más alto de los cuatro. <strong>En este caso</strong>, repartir parejo no solo es más justo: acierta más. No es una ley: es lo que pasa cuando el grupo pequeño estaba sin aprender.</p>';
  }
  if (iaProProbados.size >= 3) {
    html += '<p class="pro-fin">🎯 Por eso la pregunta ante cualquier sistema que decide sobre personas no es <em>«¿cuánto acierta?»</em> sino las tres de siempre: <strong>¿con qué ejemplos se entrenó, quién los eligió y a quién le cae el error?</strong></p>';
  }
  caja.innerHTML = html;
}
function iaProGuardar() {
  const i = document.getElementById('pro-pido'); const t = (i && i.value || '').trim();
  if (t.length < 8) { fb('fbPro', 'Escribí la petición entera, como se la dirías a quien hizo el programa.', false); return; }
  iaDescGuardar('pido', t); iaProMostrarGuardado(t); sfx('up');
  if (!xpTracker.wgt.has('pro_pido')) { xpTracker.wgt.add('pro_pido'); pts(3); }
  fb('fbPro', '+3 XP: eso es lo que se le pide a un sistema que decide sobre personas.', true);
}
function iaProMostrarGuardado(t) { const c = document.getElementById('pro-guardado'); if (c) c.innerHTML = '💾 Lo que vas a pedir: «' + _esc(t) + '».'; }

function iaDescInit() {
  iaEstPintar(); iaEstPintarDefensas(); iaProPintarSistemas(); iaProPintar();
  const g = iaDescLeer('estafa');
  if (g) {
    const a = document.getElementById('est-acuerdo'); if (a) a.value = g.acuerdo || '';
    const p = document.getElementById('est-publico'); if (p) p.value = g.publico || '';
    iaEstMostrarGuardado(g);
  }
  const t = iaDescLeer('pido'); if (t) { const i = document.getElementById('pro-pido'); if (i) i.value = t; iaProMostrarGuardado(t); }
}
