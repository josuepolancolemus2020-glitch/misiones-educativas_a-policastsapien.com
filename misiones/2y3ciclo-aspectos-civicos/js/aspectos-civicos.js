// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
function compartirMision(){const url=window.location.href;const texto=`🚀 *Misión Asignada* 🚀\n\nPractica sobre este tema y sobresale en ser de los mejores alumnos. 🏆\n\nDesbloquea *todos los logros* y puedes poner *tus datos* para que tu maestro observe todos tus logros. 📋\n\n_Se te hará prueba escrita y serás excelente estudiante en Educación Cívica._ ✍️\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;_waShare(texto);}
function toggleLetra(){document.body.classList.toggle('letra-grande');if(typeof sfx==='function')sfx('click');localStorage.setItem('preferenciaLetra',document.body.classList.contains('letra-grande'));}
window.addEventListener('DOMContentLoaded',()=>{if(localStorage.getItem('preferenciaLetra')==='true')document.body.classList.add('letra-grande');});

// ===================== UTILIDADES =====================
const _pick=(arr,n)=>[...arr].sort(()=>Math.random()-0.5).slice(0,n);
const _shuffle=(arr)=>[...arr].sort(()=>Math.random()-0.5);
function fb(id,msg,isOk){const el=document.getElementById(id);if(el){el.textContent=msg;el.className='fb show '+(isOk?'ok':'err');}}

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY='aspectos_civicos_v1';
let xp=0,MXP=200,done=new Set(),evalAnsVisible=false;
let evalFormNum=1,unlockedAch=[],darkMode=false,prevLevel=0;
let evalCritFormNum=1,evalCritAnsVisible=false;
const TOTAL_SECTIONS=13;
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
  primer_quiz:{icon:'🇭🇳',label:'Primera prueba cívica superada'},
  flash_master:{icon:'🃏',label:'Todas las flashcards de los símbolos exploradas'},
  clasif_pro:{icon:'🗂️',label:'Clasificador de símbolos patrios experto'},
  id_master:{icon:'🔍',label:'Identificador de la historia maestro'},
  reto_hero:{icon:'🏆',label:'Héroe del reto cívico'},
  nivel3:{icon:'🎖️',label:'¡Buen Ciudadano! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡Guardián de la Patria! Nivel 6'},
  widgets_master:{icon:'🧩',label:'Widgets cívicos dominados'}
};
function unlockAchievement(id){if(unlockedAch.includes(id))return;unlockedAch.push(id);sfx('ach');showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label);launchConfetti();renderAchPanel();saveProgress();}
function renderAchPanel(){const list=document.getElementById('achList');list.innerHTML='';Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{const div=document.createElement('div');div.className='ach-item'+(unlockedAch.includes(id)?'':' locked');div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`;list.appendChild(div);});}
function toggleAchPanel(){sfx('click');document.getElementById('achPanel').classList.toggle('open');}
function showToast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}t.textContent=msg;t.style.display='block';clearTimeout(t._tid);t._tid=setTimeout(()=>t.style.display='none',3200);}
function launchConfetti(){const colors=['#3f6212','#2dd4bf','#b45309','#f59e0b','#14b8a6'];for(let i=0;i<60;i++){const c=document.createElement('div');c.className='confetti-piece';c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`;document.body.appendChild(c);c.addEventListener('animationend',()=>c.remove());}}

// ===================== XP =====================
const lvls=[{t:0,n:'Aprendiz 🌱'},{t:25,n:'Abanderado 🧭'},{t:55,n:'Escolta 🎖️'},{t:90,n:'Buen Ciudadano 🤝'},{t:130,n:'Cívico 🔎'},{t:165,n:'Patriota 🏅'},{t:190,n:'Guardián de la Patria 🏆'}];
function pts(n){xp=Math.max(0,Math.min(MXP,xp+n));updateXPBar();saveProgress();}
function updateXPBar(){const pct=Math.round((xp/MXP)*100);document.getElementById('xpFill').style.width=pct+'%';const el=document.getElementById('xpPts');el.textContent='⭐ '+xp;el.style.transform='scale(1.3)';setTimeout(()=>el.style.transform='',300);let lv=0;for(let i=0;i<lvls.length;i++)if(xp>=lvls[i].t)lv=i;document.getElementById('xpLvl').textContent=lvls[lv].n;if(lv!==prevLevel){if(lv>=2)unlockAchievement('nivel3');if(lv>=5)unlockAchievement('nivel5');prevLevel=lv;}}
function resetXP(){sfx('click');xp=0;updateXPBar();showToast('🔄 XP reiniciado a 0');}
function fin(id,showFX=true){if(!done.has(id)){done.add(id);const b=document.querySelector(`[data-s="${id}"]`);if(b)b.classList.add('done');if(showFX){sfx('up');launchConfetti();}saveProgress();}}
function getProgress(){return Math.round((done.size/TOTAL_SECTIONS)*100);}

// ===================== NAV =====================
function go(id){sfx('click');document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});document.getElementById(id).classList.add('active');const btn=document.querySelector(`[data-s="${id}"]`);if(btn){btn.classList.add('active');btn.setAttribute('aria-selected','true');}window.scrollTo({top:0,behavior:'smooth'});if(id==='s-sopa'){setTimeout(buildSopa,50);}if(id==='s-widgets'){setTimeout(buildRoute,50);}}

// ===================== FLASHCARD DATA =====================
const fcData=[
  {w:'Símbolos patrios',a:'🇭🇳 Los signos que <strong>representan a Honduras</strong>. Los <strong>mayores</strong> son tres: Bandera, Escudo e Himno.'},
  {w:'La Bandera Nacional',a:'🏳️ Tres franjas: <strong>azul turquesa, blanca y azul turquesa</strong>, con <strong>cinco estrellas</strong> en el centro.'},
  {w:'Las cinco estrellas',a:'\u2B50 Las <strong>cinco naciones</strong> de la antigua Federación de Centroamérica: Guatemala, El Salvador, Honduras, Nicaragua y Costa Rica.'},
  {w:'El azul de la Bandera',a:'🌊 Los <strong>dos mares</strong> que bañan al país (el Caribe y el Pacífico) y el <strong>cielo</strong> de Honduras.'},
  {w:'El blanco de la Bandera',a:'🕊️ La <strong>paz</strong> y la <strong>pureza</strong> del pueblo hondureño.'},
  {w:'El Escudo Nacional',a:'🛡️ Un <strong>triángulo equilátero</strong> con un volcán entre dos torres, el arco iris y el sol naciente, dentro de un óvalo.'},
  {w:'El Himno Nacional',a:'🎵 Letra de <strong>Augusto C. Coello</strong> y música de <strong>Carlos Hartling</strong>. Tiene un <strong>coro y siete estrofas</strong>.'},
  {w:'La séptima estrofa',a:'\u270B La que se canta en los actos: es el <strong>juramento</strong> de defender la Bandera y la patria.'},
  {w:'El Pino',a:'🌲 El <strong>árbol nacional</strong> desde 1928. Honduras tiene el mayor bosque de pino de Centroamérica.'},
  {w:'La orquídea',a:'🌺 La <strong>flor nacional</strong> desde 1969: la <em>Rhyncholaelia digbyana</em>. Antes lo era la rosa, que no es de aquí.'},
  {w:'La Guara Roja',a:'🦜 El <strong>ave nacional</strong> desde 1993 (<em>Ara macao</em>). Vive en Copán y en La Mosquitia.'},
  {w:'El Venado Cola Blanca',a:'🦌 El <strong>mamífero nacional</strong> desde 1993, el mismo día que la Guara Roja.'},
  {w:'Lempira',a:'🏹 <strong>Héroe Nacional</strong>: el cacique lenca que dirigió la resistencia contra la conquista. La moneda lleva su nombre.'},
  {w:'Francisco Morazán',a:'\u2694️ El <strong>Paladín de la Unión Centroamericana</strong>. Nació el 3 de octubre de 1792 y murió el 15 de septiembre de 1842.'},
];
let fcIdx=0;
function upFC(){document.getElementById('fcInner').classList.remove('flipped');document.getElementById('fcW').textContent=fcData[fcIdx].w;document.getElementById('fcA').innerHTML=fcData[fcIdx].a;document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length;}
function flipCard(){sfx('flip');document.getElementById('fcInner').classList.toggle('flipped');if(!xpTracker.fc.has(fcIdx)){xpTracker.fc.add(fcIdx);pts(1);}if(xpTracker.fc.size===fcData.length){fin('s-flash');unlockAchievement('flash_master');}}
function nextFC(){sfx('click');fcIdx=(fcIdx+1)%fcData.length;upFC();}
function prevFC(){sfx('click');fcIdx=(fcIdx-1+fcData.length)%fcData.length;upFC();}

// ===================== QUIZ DATA =====================
const qzData=[
  {q:'¿Cuáles son los tres símbolos patrios mayores?',o:['a) El pino, la orquídea y la guara','b) La Bandera, el Escudo y el Himno','c) El mapa, la moneda y la lengua','d) El venado, el mapa y el escudo'],c:1},
  {q:'¿Qué representan las cinco estrellas de la Bandera?',o:['a) Los cinco departamentos más grandes','b) Los cinco ríos principales','c) Las cinco naciones de la antigua Federación de Centroamérica','d) Los cinco próceres de Honduras'],c:2},
  {q:'¿Quién escribió la letra del Himno Nacional?',o:['a) Augusto C. Coello','b) Carlos Hartling','c) Francisco Morazán','d) José Cecilio del Valle'],c:0},
  {q:'¿Quién compuso la música del Himno Nacional?',o:['a) Augusto C. Coello','b) Ramón Rosa','c) Carlos Hartling','d) José Trinidad Reyes'],c:2},
  {q:'¿Cuántas estrofas tiene el Himno Nacional?',o:['a) Cinco','b) Siete','c) Tres','d) Diez'],c:1},
  {q:'¿Cuál es el árbol nacional de Honduras?',o:['a) La ceiba','b) El roble','c) El pino','d) El caoba'],c:2},
  {q:'¿Cuál es el ave nacional de Honduras?',o:['a) La guara roja','b) El tucán','c) El colibrí','d) El quetzal'],c:0},
  {q:'¿Quién redactó el Acta de Independencia de Centroamérica?',o:['a) Francisco Morazán','b) Dionisio de Herrera','c) José Trinidad Cabañas','d) José Cecilio del Valle'],c:3},
  {q:'¿Qué se celebra el 1 de septiembre en Honduras?',o:['a) La Independencia','b) El Día de la Bandera Nacional','c) El Día del Maestro','d) El Día de Lempira'],c:1},
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
  {label:['Símbolo mayor','Símbolo menor'],headA:'🎖️ Símbolo mayor',headB:'🌿 Símbolo menor',colA:'mayor',colB:'menor',
   words:[{w:'La Bandera',t:'mayor'},{w:'El Pino',t:'menor'},{w:'El Escudo',t:'menor'},{w:'La orquídea',t:'menor'},{w:'El Himno Nacional',t:'mayor'},{w:'La Guara Roja',t:'menor'},{w:'El Venado Cola Blanca',t:'menor'},{w:'El mapa de Honduras',t:'menor'}]},
  {label:['Está en la Bandera','Está en el Escudo'],headA:'🏳️ En la Bandera',headB:'🛡️ En el Escudo',colA:'ban',colB:'esc',
   words:[{w:'Cinco estrellas',t:'ban'},{w:'Un volcán',t:'esc'},{w:'Franja blanca en medio',t:'ban'},{w:'Dos torres',t:'esc'},{w:'Azul turquesa',t:'ban'},{w:'El arco iris',t:'esc'},{w:'Tres franjas',t:'ban'},{w:'Cornucopias',t:'esc'},{w:'Aljabas con flechas',t:'esc'},{w:'Robles y pinos',t:'esc'}]},
  {label:['Prócer o héroe','No es prócer'],headA:'🏅 Prócer o héroe',headB:'🚫 No es prócer',colA:'pro',colB:'no',
   words:[{w:'Lempira',t:'pro'},{w:'Cristóbal Colón',t:'no'},{w:'Francisco Morazán',t:'pro'},{w:'Carlos Hartling',t:'no'},{w:'José Cecilio del Valle',t:'pro'},{w:'Pedro de Alvarado',t:'no'},{w:'José Trinidad Cabañas',t:'pro'},{w:'Hernán Cortés',t:'no'},{w:'Dionisio de Herrera',t:'pro'},{w:'William Walker',t:'no'}]},
  {label:['Fecha de septiembre','Otro mes del año'],headA:'📅 En septiembre',headB:'🗓️ En otro mes',colA:'sep',colB:'otro',
   words:[{w:'Día de la Bandera',t:'sep'},{w:'Día de Lempira',t:'otro'},{w:'Independencia de Centroamérica',t:'sep'},{w:'Día del Estudiante',t:'otro'},{w:'Día del Niño Hondureño',t:'sep'},{w:'Día de las Fuerzas Armadas',t:'otro'},{w:'Día del Maestro Hondureño',t:'sep'},{w:'Día de la Guara Roja',t:'otro'}]},
];
let currentClassGroupIdx=0,clsSelectedWord=null;
function buildClass(){const group=classGroups[currentClassGroupIdx];document.getElementById('col-left-head').textContent=group.headA;document.getElementById('col-right-head').textContent=group.headB;const bank=document.getElementById('clsBank');bank.innerHTML='';clsSelectedWord=null;document.getElementById('items-left').innerHTML='';document.getElementById('items-right').innerHTML='';_shuffle([...group.words]).forEach(w=>{const el=document.createElement('div');el.className='wb-item';el.textContent=w.w;el.dataset.t=w.t;el.onclick=()=>{document.querySelectorAll('.wb-item').forEach(i=>i.classList.remove('sel-word'));el.classList.add('sel-word');clsSelectedWord=el;sfx('click');};bank.appendChild(el);});['col-left','col-right'].forEach(colId=>{const col=document.getElementById(colId);col.onclick=(e)=>{if(!clsSelectedWord||e.target.classList.contains('drop-item'))return;const targetId=colId==='col-left'?'items-left':'items-right';const wordsCol=document.getElementById(targetId);const item=document.createElement('div');item.className='drop-item';item.textContent=clsSelectedWord.textContent;item.dataset.t=clsSelectedWord.dataset.t;const original=clsSelectedWord;item.onclick=(ev)=>{ev.stopPropagation();if(clsSelectedWord!==null){col.click();}else{document.getElementById('clsBank').appendChild(original);original.classList.remove('sel-word');item.remove();if(typeof sfx==='function')sfx('click');}};wordsCol.appendChild(item);clsSelectedWord.remove();clsSelectedWord=null;sfx('click');};});}
function checkClass(){const remaining=document.querySelectorAll('#clsBank .wb-item').length;if(remaining>0){fb('fbCls','Mueve todas las palabras a las columnas primero.',false);return;}const group=classGroups[currentClassGroupIdx];let allOk=true;document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{const inLeft=el.parentElement.id==='items-left';const expectedType=inLeft?group.colA:group.colB;if(el.dataset.t===expectedType){el.classList.add('cls-ok');}else{el.classList.add('cls-no');allOk=false;}});if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);}if(allOk){fb('fbCls','¡Perfecto! +5 XP',true);sfx('fan');fin('s-clasifica');unlockAchievement('clasif_pro');}else{fb('fbCls','Hay errores. Marcados en rojo.',false);sfx('no');}}
function nextClassGroup(){sfx('click');currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length;buildClass();document.getElementById('fbCls').classList.remove('show');showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]);}
function resetClass(){sfx('click');buildClass();document.getElementById('fbCls').classList.remove('show');}

// ===================== IDENTIFICAR =====================
const idData=[
  {s:['La','Bandera','de','Honduras','lleva','cinco','estrellas.'],c:5,art:'El número de estrellas de la Bandera'},
  {s:['El','Himno','Nacional','tiene','siete','estrofas','y','un','coro.'],c:4,art:'El número de estrofas del Himno'},
  {s:['La','letra','del','Himno','la','escribió','Augusto','Coello.'],c:6,art:'El autor de la letra del Himno (su nombre)'},
  {s:['La','música','del','Himno','la','compuso','Carlos','Hartling.'],c:6,art:'El autor de la música del Himno (su nombre)'},
  {s:['El','árbol','nacional','de','Honduras','es','el','pino.'],c:7,art:'El árbol nacional'},
  {s:['Lempira','fue','el','cacique','lenca','que','resistió','la','conquista.'],c:0,art:'El Héroe Nacional de Honduras'},
  {s:['Morazán','luchó','por','la','unión','de','Centroamérica.'],c:0,art:'El Paladín de la Unión Centroamericana'},
  {s:['La','Independencia','se','celebra','el','quince','de','septiembre.'],c:5,art:'El día del mes en que se celebra la Independencia'},
];
let idIdx=0,idDone=false;
function showId(){idDone=false;if(idIdx>=idData.length){document.getElementById('idSent').innerHTML='🎉 ¡Completado!';fin('s-identifica');unlockAchievement('id_master');return;}const d=idData[idIdx];document.getElementById('idProg').textContent=`Oración ${idIdx+1} de ${idData.length}`;document.getElementById('idInfo').textContent=`Busca: ${d.art}`;const sent=document.getElementById('idSent');sent.innerHTML='';d.s.forEach((w,i)=>{const span=document.createElement('span');span.className='id-word';span.textContent=w+' ';span.onclick=()=>checkId(i,span);sent.appendChild(span);});}
function checkId(i,span){if(idDone)return;document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected'));span.classList.add('selected');if(i===idData[idIdx].c){idDone=true;span.classList.add('id-ok');fb('fbId','¡Correcto! +5 XP',true);if(!xpTracker.id.has(idIdx)){xpTracker.id.add(idIdx);pts(5);}sfx('ok');}else{span.classList.add('id-no');fb('fbId','Ese no es el término solicitado.',false);sfx('no');}}
function nextId(){sfx('click');idIdx++;showId();document.getElementById('fbId').classList.remove('show');}
function resetId(){sfx('click');idIdx=0;showId();document.getElementById('fbId').classList.remove('show');}

// ===================== COMPLETA =====================
const cmpData=[
  {s:'Los símbolos patrios mayores son la Bandera, el Escudo y el ___.',opts:['Himno Nacional','pino','mapa'],c:0},
  {s:'La franja del centro de la Bandera es de color ___.',opts:['azul','blanco','verde'],c:1},
  {s:'Las cinco estrellas recuerdan a las cinco naciones de la antigua ___.',opts:['Federación de Centroamérica','América del Sur','Unión Europea'],c:0},
  {s:'La letra del Himno Nacional es de Augusto C. ___.',opts:['Hartling','Rosa','Coello'],c:2},
  {s:'En los actos escolares se canta el coro y la ___ estrofa.',opts:['primera','séptima','tercera'],c:1},
  {s:'La flor nacional de Honduras es la ___.',opts:['rosa','orquídea','buganvilia'],c:1},
  {s:'El Héroe Nacional que resistió la conquista fue ___.',opts:['Morazán','Valle','Lempira'],c:2},
  {s:'La Independencia de Centroamérica se firmó en el año ___.',opts:['1821','1866','1915'],c:0},
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
const routeSets=[
  {label:'Los símbolos patrios, en el orden en que nacieron',steps:['El Escudo Nacional (1825)','La Bandera Nacional (1866)','El Himno Nacional (1915)','El Pino, árbol nacional (1928)','La orquídea, flor nacional (1969)','La Guara Roja y el Venado (1993)']},
  {label:'El acto cívico del lunes, paso a paso',steps:['Los alumnos forman en el patio','Entra la escolta con la Bandera','Se iza la Bandera Nacional','Se canta el Himno Nacional','El maestro da el mensaje del día','Los alumnos entran a las aulas']},
  {label:'Las fechas del Mes de la Patria, en orden',steps:['1 de septiembre: Día de la Bandera','10 de septiembre: Día del Niño Hondureño','15 de septiembre: Independencia de Centroamérica','17 de septiembre: Día del Maestro Hondureño','3 de octubre: natalicio de Francisco Morazán']},
];
let currentRouteIdx=0,routeItems=[];
function buildRoute(){routeItems=_shuffle([...routeSets[currentRouteIdx].steps]);renderRoute();const fbEl=document.getElementById('fbRoute');if(fbEl)fbEl.classList.remove('show');}
function renderRoute(){const list=document.getElementById('routeList');if(!list)return;list.innerHTML='';routeItems.forEach((step,i)=>{const div=document.createElement('div');div.className='sort-item';div.innerHTML=`<div class="sort-arrows"><button class="sort-arrow" onclick="routeMove(${i},-1)"${i===0?' disabled':''}>▲</button><button class="sort-arrow" onclick="routeMove(${i},1)"${i===routeItems.length-1?' disabled':''}>▼</button></div><div class="sort-step-num">${i+1}.</div><div class="sort-item-txt">${step}</div>`;list.appendChild(div);});}
function routeMove(idx,dir){sfx('click');const ni=idx+dir;if(ni<0||ni>=routeItems.length)return;[routeItems[idx],routeItems[ni]]=[routeItems[ni],routeItems[idx]];renderRoute();}
function checkRoute(){const correct=routeSets[currentRouteIdx].steps;const isOk=routeItems.every((s,i)=>s===correct[i]);if(isOk){fb('fbRoute','¡Perfecto! Orden correcto. +4 XP',true);if(!xpTracker.wgt.has('route_'+currentRouteIdx)){xpTracker.wgt.add('route_'+currentRouteIdx);pts(4);}sfx('fan');fin('s-widgets');unlockAchievement('widgets_master');}else{fb('fbRoute','Hay pasos fuera de orden. Revisa el arreglo.',false);sfx('no');}}
function nextRoute(){sfx('click');currentRouteIdx=(currentRouteIdx+1)%routeSets.length;buildRoute();showToast('🔄 Secuencia: '+routeSets[currentRouteIdx].label);}

// Widget 2: Identifica el concepto
const neuronPartes=[
  {desc:'El símbolo patrio con tres franjas y cinco estrellas',ans:'La Bandera',opts:['La Bandera','El Escudo','El Himno','El mapa']},
  {desc:'El símbolo patrio con un volcán entre dos torres',ans:'El Escudo',opts:['El Escudo','La Bandera','La orquídea','El Pino']},
  {desc:'El cacique lenca declarado Héroe Nacional de Honduras',ans:'Lempira',opts:['Lempira','Morazán','Valle','Cabañas']},
  {desc:'El prócer llamado Paladín de la Unión Centroamericana',ans:'Francisco Morazán',opts:['Francisco Morazán','Lempira','Dionisio de Herrera','Carlos Hartling']},
  {desc:'El sabio que redactó el Acta de Independencia de Centroamérica',ans:'José Cecilio del Valle',opts:['José Cecilio del Valle','José Trinidad Reyes','Ramón Rosa','Marco Aurelio Soto']},
  {desc:'El árbol nacional, el que más abunda en las montañas de Honduras',ans:'El Pino',opts:['El Pino','La ceiba','El roble','El caoba']},
  {desc:'El ave nacional que vuela sobre las ruinas de Copán',ans:'La Guara Roja',opts:['La Guara Roja','El quetzal','El tucán','La lechuza']},
  {desc:'El día en que Honduras rinde homenaje a su Bandera',ans:'1 de septiembre',opts:['1 de septiembre','15 de septiembre','3 de octubre','20 de julio']},
];
let neuronIdx=0,neuronDone=false;
function showNeuron(){neuronDone=false;if(neuronIdx>=neuronPartes.length){const el=document.getElementById('neuronDesc');if(el)el.textContent='🎉 ¡Todos los símbolos identificados!';const opts=document.getElementById('neuronOpts');if(opts)opts.innerHTML='';fin('s-widgets');return;}const d=neuronPartes[neuronIdx];const prog=document.getElementById('neuronProg');if(prog)prog.textContent=`Pista ${neuronIdx+1} de ${neuronPartes.length}`;const desc=document.getElementById('neuronDesc');if(desc)desc.textContent=d.desc;const opts=document.getElementById('neuronOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=opt;b.onclick=()=>checkNeuron(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuron');if(fbEl)fbEl.classList.remove('show');}
function checkNeuron(opt,btn,d){if(neuronDone)return;neuronDone=true;document.querySelectorAll('#neuronOpts .cmp-opt').forEach(b=>{if(b.textContent===d.ans)b.classList.add('correct');else if(b===btn&&b.textContent!==d.ans)b.classList.add('wrong');});const isOk=opt===d.ans;if(isOk){fb('fbNeuron','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuron_'+neuronIdx)){xpTracker.wgt.add('neuron_'+neuronIdx);pts(3);}sfx('ok');}else{fb('fbNeuron','La respuesta correcta es: '+d.ans,false);sfx('no');}}
function nextNeuron(){sfx('click');neuronIdx++;showNeuron();}
function resetNeuron(){sfx('click');neuronIdx=0;showNeuron();}

// Widget 3: Concepto → Significado
const neuroPairs=[
  {trans:'Las cinco estrellas',func:'Las cinco naciones de la antigua Federación de Centroamérica',opts:['Las cinco naciones de la antigua Federación de Centroamérica','Los cinco ríos más largos','Las cinco ciudades más grandes','Los cinco próceres']},
  {trans:'El azul de la Bandera',func:'Los dos mares que bañan al país y el cielo',opts:['Los dos mares que bañan al país y el cielo','La riqueza minera','Los bosques de pino','La sangre de los héroes']},
  {trans:'El blanco de la Bandera',func:'La paz y la pureza del pueblo hondureño',opts:['La paz y la pureza del pueblo hondureño','La nieve de las montañas','El algodón que se cultiva','Las nubes del Caribe']},
  {trans:'El triángulo del Escudo',func:'La igualdad ante la ley: sus tres lados miden lo mismo',opts:['La igualdad ante la ley: sus tres lados miden lo mismo','Las tres franjas de la Bandera','Los tres poderes del Estado','Los tres siglos de colonia']},
  {trans:'Las dos torres del Escudo',func:'La defensa y la soberanía del territorio',opts:['La defensa y la soberanía del territorio','Las dos ciudades capitales','Los dos océanos','Las dos cordilleras']},
  {trans:'Las cornucopias del Escudo',func:'La abundancia y la riqueza de la tierra',opts:['La abundancia y la riqueza de la tierra','La música del Himno','El trabajo de los mineros','La unión centroamericana']},
];
let neuroIdx=0,neuroDone=false;
function showNeuro(){neuroDone=false;if(neuroIdx>=neuroPairs.length){const el=document.getElementById('neuroTrans');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('neuroOpts');if(opts)opts.innerHTML='';return;}const d=neuroPairs[neuroIdx];const prog=document.getElementById('neuroProg');if(prog)prog.textContent=`${neuroIdx+1} de ${neuroPairs.length}`;const trans=document.getElementById('neuroTrans');if(trans)trans.textContent=d.trans;const opts=document.getElementById('neuroOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkNeuro(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuro');if(fbEl)fbEl.classList.remove('show');}
function checkNeuro(opt,btn,d){if(neuroDone)return;neuroDone=true;document.querySelectorAll('#neuroOpts .qz-opt').forEach(b=>{if(b.textContent===d.func)b.classList.add('correct');else if(b===btn&&b.textContent!==d.func)b.classList.add('wrong');});const isOk=opt===d.func;if(isOk){fb('fbNeuro','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuro_'+neuroIdx)){xpTracker.wgt.add('neuro_'+neuroIdx);pts(3);}sfx('ok');}else{fb('fbNeuro','Correcto: '+d.func,false);sfx('no');}setTimeout(()=>{neuroIdx++;showNeuro();},1800);}
function resetNeuro(){sfx('click');neuroIdx=0;showNeuro();}

// Widget 4: Fuente → ¿Renovable o no renovable?
const enfermedadData=[
  {disease:'Estar de pie y en silencio mientras se canta el Himno',characteristic:'Se respeta',opts:['Se respeta','No se respeta']},
  {disease:'Dejar que la Bandera toque el suelo',characteristic:'No se respeta',opts:['No se respeta','Se respeta']},
  {disease:'Guardar la Bandera limpia y bien doblada',characteristic:'Se respeta',opts:['Se respeta','No se respeta']},
  {disease:'Platicar y reírse durante el acto cívico',characteristic:'No se respeta',opts:['No se respeta','Se respeta']},
  {disease:'Quedarse quieto y firme cuando pasa la Bandera',characteristic:'Se respeta',opts:['Se respeta','No se respeta']},
  {disease:'Usar la Bandera como mantel o como adorno de una silla',characteristic:'No se respeta',opts:['No se respeta','Se respeta']},
  {disease:'Cantar el Himno completo, sin cambiarle la letra',characteristic:'Se respeta',opts:['Se respeta','No se respeta']},
  {disease:'Escribir o dibujar encima del Escudo Nacional',characteristic:'No se respeta',opts:['No se respeta','Se respeta']},
];
let enferIdx=0,enferDone=false;
function showEnfer(){enferDone=false;if(enferIdx>=enfermedadData.length){const el=document.getElementById('enferDisease');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('enferOpts');if(opts)opts.innerHTML='';return;}const d=enfermedadData[enferIdx];const prog=document.getElementById('enferProg');if(prog)prog.textContent=`${enferIdx+1} de ${enfermedadData.length}`;const dis=document.getElementById('enferDisease');if(dis)dis.textContent=d.disease;const opts=document.getElementById('enferOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkEnfer(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbEnfer');if(fbEl)fbEl.classList.remove('show');}
function checkEnfer(opt,btn,d){if(enferDone)return;enferDone=true;document.querySelectorAll('#enferOpts .qz-opt').forEach(b=>{if(b.textContent===d.characteristic)b.classList.add('correct');else if(b===btn&&b.textContent!==d.characteristic)b.classList.add('wrong');});const isOk=opt===d.characteristic;if(isOk){fb('fbEnfer','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('enfer_'+enferIdx)){xpTracker.wgt.add('enfer_'+enferIdx);pts(3);}sfx('ok');}else{fb('fbEnfer','Correcto: '+d.characteristic,false);sfx('no');}setTimeout(()=>{enferIdx++;showEnfer();},1800);}
function resetEnfer(){sfx('click');enferIdx=0;showEnfer();}

// ===================== RETO FINAL =====================
const retoPairs=[
  {label:['Símbolo mayor','Símbolo menor'],btnA:'🎖️ Mayor',btnB:'🌿 Menor',colA:'mayor',colB:'menor',
   words:[{w:'La Bandera',t:'mayor'},{w:'El Pino',t:'menor'},{w:'El Escudo',t:'mayor'},{w:'La orquídea',t:'menor'},{w:'El Himno',t:'mayor'},{w:'La Guara Roja',t:'menor'},{w:'El Venado',t:'menor'},{w:'El mapa',t:'menor'}]},
  {label:['Prócer o héroe','No es prócer'],btnA:'🏅 Prócer',btnB:'🚫 No lo es',colA:'pro',colB:'no',
   words:[{w:'Lempira',t:'pro'},{w:'Cristóbal Colón',t:'no'},{w:'Morazán',t:'pro'},{w:'Carlos Hartling',t:'no'},{w:'José Cecilio del Valle',t:'pro'},{w:'Pedro de Alvarado',t:'no'},{w:'José Trinidad Cabañas',t:'pro'},{w:'Hernán Cortés',t:'no'},{w:'Dionisio de Herrera',t:'pro'},{w:'William Walker',t:'no'}]},
  {label:['En la Bandera','En el Escudo'],btnA:'🏳️ Bandera',btnB:'🛡️ Escudo',colA:'ban',colB:'esc',
   words:[{w:'Cinco estrellas',t:'ban'},{w:'Un volcán',t:'esc'},{w:'Tres franjas',t:'ban'},{w:'Dos torres',t:'esc'},{w:'Azul turquesa',t:'ban'},{w:'El arco iris',t:'esc'},{w:'Franja blanca',t:'ban'},{w:'Cornucopias',t:'esc'},{w:'Aljabas con flechas',t:'esc'},{w:'Robles y pinos',t:'esc'}]},
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
  {s:'La Bandera Nacional lleva cinco estrellas en la franja blanca.',type:'La Bandera'},
  {s:'El Escudo Nacional tiene un volcán entre dos torres.',type:'El Escudo'},
  {s:'El Himno Nacional tiene un coro y siete estrofas.',type:'El Himno'},
  {s:'La letra del Himno Nacional la escribió Augusto C. Coello.',type:'Augusto C. Coello'},
  {s:'La música del Himno Nacional la compuso Carlos Hartling.',type:'Carlos Hartling'},
  {s:'El pino es el árbol nacional de Honduras.',type:'El Pino'},
  {s:'La orquídea Rhyncholaelia digbyana es la flor nacional.',type:'La orquídea'},
  {s:'La guara roja es el ave nacional y vuela sobre Copán.',type:'La Guara Roja'},
  {s:'Lempira dirigió la resistencia de los lencas contra la conquista.',type:'Lempira'},
  {s:'Francisco Morazán luchó por la unión de Centroamérica.',type:'Francisco Morazán'},
  {s:'José Cecilio del Valle redactó el Acta de Independencia.',type:'José Cecilio del Valle'},
  {s:'El 15 de septiembre se celebra la Independencia de Centroamérica.',type:'15 de septiembre'},
];
const classifyTaskDB=[
  {w:'La Bandera Nacional',gen:'Tres franjas y cinco estrellas azul turquesa',n:'Símbolo mayor',g:'Decreto del 16 de febrero de 1866',t:'Se le rinde homenaje el 1 de septiembre'},
  {w:'El Escudo Nacional',gen:'Triángulo con un volcán entre dos torres',n:'Símbolo mayor',g:'Decreto del 3 de octubre de 1825',t:'Lleva la fecha 15 de septiembre de 1821'},
  {w:'El Himno Nacional',gen:'Un coro y siete estrofas',n:'Símbolo mayor',g:'Oficializado en 1915',t:'Letra de Augusto C. Coello y música de Carlos Hartling'},
  {w:'El Pino',gen:'El árbol que más abunda en las montañas del país',n:'Símbolo menor',g:'Declarado árbol nacional en 1928',t:'Honduras tiene el mayor bosque de pino de Centroamérica'},
  {w:'La orquídea',gen:'Flor blanco-verdosa de fragancia nocturna',n:'Símbolo menor',g:'Declarada flor nacional en 1969',t:'Sustituyó a la rosa, que no es originaria del país'},
  {w:'La Guara Roja',gen:'Ave de plumaje rojo, azul y amarillo',n:'Símbolo menor',g:'Declarada ave nacional en 1993',t:'Vuela libre sobre las ruinas de Copán'},
  {w:'El Venado Cola Blanca',gen:'Mamífero veloz de los bosques y sabanas',n:'Símbolo menor',g:'Declarado mamífero nacional en 1993',t:'Se declaró el mismo día que la guara roja'},
];
const completeTaskDB=[
  {s:'Los símbolos patrios mayores son la Bandera, el Escudo y el ___.',opts:['Himno','pino','mapa'],ans:'Himno'},
  {s:'La franja del centro de la Bandera es de color ___.',opts:['azul','blanco','verde'],ans:'blanco'},
  {s:'La Bandera Nacional lleva ___ estrellas.',opts:['tres','cinco','siete'],ans:'cinco'},
  {s:'El Escudo Nacional tiene la forma de un ___.',opts:['triángulo','círculo','cuadrado'],ans:'triángulo'},
  {s:'La letra del Himno Nacional es de Augusto C. ___.',opts:['Coello','Hartling','Rosa'],ans:'Coello'},
  {s:'El Himno Nacional tiene ___ estrofas.',opts:['cinco','siete','tres'],ans:'siete'},
  {s:'El árbol nacional de Honduras es el ___.',opts:['pino','roble','cedro'],ans:'pino'},
  {s:'El Héroe Nacional que resistió la conquista fue ___.',opts:['Lempira','Morazán','Valle'],ans:'Lempira'},
  {s:'La Independencia de Centroamérica se firmó en ___.',opts:['1821','1866','1915'],ans:'1821'},
];
const explainQuestions=[
  {q:'¿Cuáles son los símbolos patrios mayores y por qué se llaman así?',ans:'Son la Bandera, el Escudo y el Himno Nacional. Se llaman mayores porque representan al Estado de Honduras ante el mundo: son los que se usan en los actos oficiales, en los documentos del gobierno y cuando el país se presenta fuera de sus fronteras.'},
  {q:'Describe la Bandera Nacional y explica qué significa cada parte.',ans:'Tiene tres franjas horizontales del mismo ancho: azul turquesa arriba, blanca en medio y azul turquesa abajo, con cinco estrellas azul turquesa en el centro. El azul representa los dos mares que bañan al país y el cielo; el blanco, la paz y la pureza del pueblo; y las cinco estrellas, las cinco naciones de la antigua Federación de Centroamérica.'},
  {q:'¿Quiénes hicieron el Himno Nacional y cuántas estrofas tiene?',ans:'La letra es de Augusto C. Coello y la música del alemán Carlos Hartling. Tiene un coro y siete estrofas. En los actos escolares se canta el coro, la séptima estrofa y otra vez el coro.'},
  {q:'Menciona los símbolos patrios menores de Honduras y di qué es cada uno.',ans:'El Pino (árbol nacional), la orquídea Rhyncholaelia digbyana (flor nacional), la guara roja (ave nacional), el venado cola blanca (mamífero nacional) y el mapa del territorio nacional.'},
  {q:'¿Quién fue Lempira y por qué es el Héroe Nacional?',ans:'Fue un cacique lenca que dirigió la mayor resistencia indígena contra la conquista española, hacia 1537, en el Peñol de Cerquín. Es Héroe Nacional porque defendió su tierra y su pueblo. Su nombre lo llevan la moneda de Honduras y un departamento del país.'},
  {q:'¿Por qué se recuerda a Francisco Morazán?',ans:'Porque luchó por mantener unida a Centroamérica en una sola nación. Fue presidente de la República Federal de Centro América y por eso se le llama el Paladín de la Unión Centroamericana. Nació el 3 de octubre de 1792 y murió el 15 de septiembre de 1842.'},
  {q:'Escribe tres formas de mostrar respeto a los símbolos patrios.',ans:'Respuesta abierta. Por ejemplo: estar de pie, firme y en silencio mientras se canta el Himno; no dejar que la Bandera toque el suelo y guardarla limpia y doblada; y quedarse quieto cuando pasa la Bandera en el desfile.'},
  {q:'¿Qué fechas cívicas se celebran en septiembre y qué recuerda cada una?',ans:'El 1 de septiembre, el Día de la Bandera Nacional, que abre el Mes de la Patria; el 10, el Día del Niño Hondureño; el 15, la Independencia de Centroamérica de 1821; y el 17, el Día del Maestro Hondureño.'},
];
let ansVisible=false;
function genTask(){sfx('click');const type=document.getElementById('tgType').value;const count=parseInt(document.getElementById('tgCount').value);ansVisible=false;const out=document.getElementById('tgOut');out.innerHTML='';if(type==='identify')genIdentifyTask(out,count);else if(type==='classify')genClassifyTask(out,count);else if(type==='complete')genCompleteTask(out,count);else if(type==='explain')genExplainTask(out,count);fin('s-tareas');}
function _instrBlock(out,title,lines){const ib=document.createElement('div');ib.className='tg-instruction-block';ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join('');out.appendChild(ib);}
function genIdentifyTask(out,count){_instrBlock(out,'Instrucción',['Copia en tu cuaderno; subraya, colorea o encierra el concepto indicado en cada oración. Escribe al lado a qué símbolo, prócer o fecha cívica se refiere.','<strong>Ejemplo:</strong> La Bandera Nacional lleva cinco estrellas en la franja blanca. → <span style="color:var(--jade);font-weight:700;">cinco estrellas</span>']);_pick(identifyTaskDB,Math.min(count,identifyTaskDB.length)).forEach((item,i)=>{const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.type}</div></div>`;out.appendChild(div);});}
function genClassifyTask(out,count){_instrBlock(out,'Instrucción',['Copia la siguiente tabla en tu cuaderno. Para cada símbolo, completa qué es, si es mayor o menor, desde cuándo lo es y un dato que lo distinga.']);const items=_pick(classifyTaskDB,Math.min(count,classifyTaskDB.length));const wrap=document.createElement('div');wrap.style.overflowX='auto';const th=(t,extra='')=>`<th style="padding:0.3rem 0.4rem;border:1px solid var(--border);font-size:0.72rem;text-align:center;${extra}">${t}</th>`;let html=`<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:520px;"><thead><tr style="background:var(--pri-gl);">${th('Símbolo','text-align:left;')}${th('Qué es')}${th('Clase')}${th('Desde cuándo')}${th('Dato')}</tr></thead><tbody>`;items.forEach(it=>{html+=`<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td>`+Array(4).fill(`<td style="padding:0.4rem;border:1px solid var(--border);min-width:50px;"></td>`).join('')+'</tr>';});html+='</tbody></table>';wrap.innerHTML=html;out.appendChild(wrap);const ans=document.createElement('div');ans.className='tg-answer';ans.style.marginTop='0.8rem';ans.innerHTML='<strong>✅ Respuestas:</strong><br>'+items.map(it=>`<strong>${it.w}:</strong> Qué es: ${it.gen} | Clase: ${it.n} | Desde cuándo: ${it.g} | Dato: ${it.t}`).join('<br>');out.appendChild(ans);}
function genCompleteTask(out,count){_instrBlock(out,'Instrucción',['Copia y resuelve en tu cuaderno. Cada oración tiene un espacio ___. Elige y escribe la opción correcta.']);const pool=_shuffle([...completeTaskDB]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';const sent=item.s.replace('___','<span class="tg-blank" style="min-width:90px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${sent}</strong><div style="margin-top:0.4rem;font-size:0.82rem;color:var(--gray);">📝 Opciones: <strong>${item.opts.join(' | ')}</strong></div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function genExplainTask(out,count){_instrBlock(out,'Instrucción',['Copia las siguientes preguntas en tu cuaderno y responde cada una de forma clara y completa.']);const pool=_shuffle([...explainQuestions]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.3rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function toggleAns(){ansVisible=!ansVisible;document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none');sfx('click');}

// ===================== SOPA DE LETRAS =====================
const sopaSets=[
  {size:10,grid:[
    ['A','R','E','D','N','A','B','H','F','H'],
    ['R','H','J','A','L','C','K','K','K','C'],
    ['A','I','A','V','I','P','I','N','O','Q'],
    ['Z','M','Z','S','J','R','V','E','S','W'],
    ['O','N','J','B','K','A','T','D','T','S'],
    ['N','O','D','F','R','D','M','A','K','U'],
    ['U','Q','U','S','W','F','I','F','P','L'],
    ['G','C','O','D','U','C','S','E','C','I'],
    ['H','E','S','T','R','E','L','L','A','X'],
    ['G','F','F','E','Y','S','Z','F','T','S']
  ],words:[
    {w:'BANDERA',cells:[[0,6],[0,5],[0,4],[0,3],[0,2],[0,1],[0,0]]},
    {w:'ESCUDO',cells:[[7,7],[7,6],[7,5],[7,4],[7,3],[7,2]]},
    {w:'HIMNO',cells:[[1,1],[2,1],[3,1],[4,1],[5,1]]},
    {w:'PINO',cells:[[2,5],[2,6],[2,7],[2,8]]},
    {w:'ESTRELLA',cells:[[8,1],[8,2],[8,3],[8,4],[8,5],[8,6],[8,7],[8,8]]},
    {w:'PATRIA',cells:[[6,8],[5,7],[4,6],[3,5],[2,4],[1,3]]}
  ]},
  {size:10,grid:[
    ['C','S','F','T','Z','B','M','A','X','Z'],
    ['F','X','M','V','Z','A','W','F','E','G'],
    ['L','E','M','P','I','R','A','E','Y','U'],
    ['L','D','W','S','P','N','C','L','Z','A'],
    ['O','O','G','U','Y','A','I','L','D','R'],
    ['Z','D','R','G','N','Z','V','A','U','A'],
    ['Y','A','S','U','F','A','I','V','A','G'],
    ['P','N','J','O','G','R','C','P','B','J'],
    ['U','E','X','I','Y','O','A','T','X','M'],
    ['M','V','T','T','A','M','N','M','P','E']
  ],words:[
    {w:'LEMPIRA',cells:[[2,0],[2,1],[2,2],[2,3],[2,4],[2,5],[2,6]]},
    {w:'MORAZAN',cells:[[9,5],[8,5],[7,5],[6,5],[5,5],[4,5],[3,5]]},
    {w:'VALLE',cells:[[6,7],[5,7],[4,7],[3,7],[2,7]]},
    {w:'GUARA',cells:[[1,9],[2,9],[3,9],[4,9],[5,9]]},
    {w:'VENADO',cells:[[9,1],[8,1],[7,1],[6,1],[5,1],[4,1]]},
    {w:'CIVICA',cells:[[3,6],[4,6],[5,6],[6,6],[7,6],[8,6]]}
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
  {q:'Los símbolos patrios mayores son la Bandera, el Escudo y el Himno Nacional.',a:true},
  {q:'La Bandera Nacional tiene cuatro estrellas en el centro.',a:false},
  {q:'Las cinco estrellas representan a las cinco naciones de la antigua Federación de Centroamérica.',a:true},
  {q:'La franja del centro de la Bandera es de color blanco.',a:true},
  {q:'El azul de la Bandera representa los dos mares que bañan al país y el cielo.',a:true},
  {q:'El Escudo Nacional es un cuadrado con un río en el centro.',a:false},
  {q:'En el Escudo Nacional hay un volcán entre dos torres.',a:true},
  {q:'La letra del Himno Nacional la escribió Augusto C. Coello.',a:true},
  {q:'La música del Himno Nacional la compuso Francisco Morazán.',a:false},
  {q:'El Himno Nacional tiene un coro y siete estrofas.',a:true},
  {q:'En los actos escolares se canta el coro y la séptima estrofa.',a:true},
  {q:'El árbol nacional de Honduras es la ceiba.',a:false},
  {q:'La flor nacional de Honduras es la orquídea Rhyncholaelia digbyana.',a:true},
  {q:'La guara roja es el ave nacional y el venado cola blanca el mamífero nacional.',a:true},
  {q:'Lempira fue el cacique lenca que dirigió la resistencia contra la conquista.',a:true},
  {q:'Francisco Morazán luchó por separar a los países de Centroamérica.',a:false},
  {q:'José Cecilio del Valle redactó el Acta de Independencia de Centroamérica.',a:true},
  {q:'La Independencia de Centroamérica se firmó el 15 de septiembre de 1821.',a:true},
  {q:'El Día de la Bandera Nacional se celebra el 15 de septiembre.',a:false},
  {q:'Mientras se canta el Himno Nacional hay que quedarse de pie y en silencio.',a:true},
];
const evalMCBank=[
  {q:'¿Cuáles son los tres símbolos patrios mayores de Honduras?',o:['a) El pino, la orquídea y la guara roja','b) La Bandera, el Escudo y el Himno Nacional','c) El mapa, la moneda y la lengua','d) El venado, el volcán y el arco iris'],a:1},
  {q:'¿Cuántas estrellas tiene la Bandera Nacional y qué representan?',o:['a) Tres, los poderes del Estado','b) Siete, las estrofas del Himno','c) Cinco, las naciones de la antigua Federación de Centroamérica','d) Cinco, los mares que rodean al país'],a:2},
  {q:'¿De qué colores son las franjas de la Bandera Nacional?',o:['a) Azul turquesa, blanca y azul turquesa','b) Azul, blanca y roja','c) Verde, blanca y azul','d) Blanca, azul y blanca'],a:0},
  {q:'¿Qué representa el color blanco de la Bandera?',o:['a) Los bosques de pino','b) La riqueza de las minas','c) La sangre de los héroes','d) La paz y la pureza del pueblo'],a:3},
  {q:'¿Qué figura geométrica forma el centro del Escudo Nacional?',o:['a) Un círculo','b) Un triángulo equilátero','c) Un cuadrado','d) Un rombo'],a:1},
  {q:'¿Qué se ve en la base del triángulo del Escudo Nacional?',o:['a) Un volcán entre dos torres','b) Un puerto con barcos','c) Una escuela y una iglesia','d) Un río entre dos montañas'],a:0},
  {q:'¿Qué representan las cornucopias del Escudo Nacional?',o:['a) La unión centroamericana','b) La defensa del territorio','c) La abundancia y la riqueza de la tierra','d) Los tres poderes del Estado'],a:2},
  {q:'¿Quién escribió la letra del Himno Nacional de Honduras?',o:['a) Carlos Hartling','b) Ramón Rosa','c) José Trinidad Reyes','d) Augusto C. Coello'],a:3},
  {q:'¿Quién compuso la música del Himno Nacional de Honduras?',o:['a) Carlos Hartling','b) Augusto C. Coello','c) Marco Aurelio Soto','d) Dionisio de Herrera'],a:0},
  {q:'¿Cuántas estrofas tiene el Himno Nacional?',o:['a) Cinco','b) Siete','c) Nueve','d) Tres'],a:1},
  {q:'¿Cuál es el árbol nacional de Honduras?',o:['a) La ceiba','b) El roble','c) El pino','d) El cedro'],a:2},
  {q:'¿Cuál es la flor nacional de Honduras desde 1969?',o:['a) La rosa','b) El girasol','c) La buganvilia','d) La orquídea Rhyncholaelia digbyana'],a:3},
  {q:'¿Quién es el Héroe Nacional que resistió la conquista española?',o:['a) Lempira','b) Francisco Morazán','c) José Cecilio del Valle','d) José Trinidad Cabañas'],a:0},
  {q:'¿Por qué se recuerda a Francisco Morazán?',o:['a) Por escribir el Himno Nacional','b) Por luchar por la unión de Centroamérica','c) Por fundar la primera universidad','d) Por diseñar la Bandera'],a:1},
  {q:'¿Qué se conmemora el 15 de septiembre?',o:['a) El Día de la Bandera','b) El Día del Maestro','c) La Independencia de Centroamérica','d) El Día de Lempira'],a:2},
];
const evalCPBank=[
  {q:'Los tres símbolos patrios mayores son la Bandera, el Escudo y el ___.',a:'Himno'},
  {q:'La franja del centro de la Bandera Nacional es de color ___.',a:'blanco'},
  {q:'La Bandera Nacional lleva ___ estrellas en el centro.',a:'cinco'},
  {q:'Las estrellas representan a las naciones de la antigua Federación de ___.',a:'Centroamérica'},
  {q:'La figura del centro del Escudo Nacional es un ___ equilátero.',a:'triángulo'},
  {q:'En el Escudo, entre las dos torres, se levanta un ___.',a:'volcán'},
  {q:'La letra del Himno Nacional es de Augusto C. ___.',a:'Coello'},
  {q:'La música del Himno Nacional es de Carlos ___.',a:'Hartling'},
  {q:'El Himno Nacional tiene un coro y ___ estrofas.',a:'siete'},
  {q:'En los actos escolares se canta el coro y la ___ estrofa.',a:'séptima'},
  {q:'El árbol nacional de Honduras es el ___.',a:'pino'},
  {q:'La flor nacional de Honduras es la ___.',a:'orquídea'},
  {q:'El Héroe Nacional que resistió la conquista fue ___.',a:'Lempira'},
  {q:'El Acta de Independencia la redactó José Cecilio del ___.',a:'Valle'},
  {q:'La Independencia de Centroamérica se firmó en el año ___.',a:'1821'},
];
const evalPRBank=[
  {term:'La Bandera Nacional',def:'Tres franjas y cinco estrellas azul turquesa'},
  {term:'El Escudo Nacional',def:'Triángulo con un volcán entre dos torres'},
  {term:'El Himno Nacional',def:'Un coro y siete estrofas'},
  {term:'Augusto C. Coello',def:'Escribió la letra del Himno Nacional'},
  {term:'Carlos Hartling',def:'Compuso la música del Himno Nacional'},
  {term:'Las cinco estrellas',def:'Las naciones de la antigua Federación de Centroamérica'},
  {term:'El color blanco',def:'La paz y la pureza del pueblo'},
  {term:'El Pino',def:'El árbol nacional de Honduras'},
  {term:'La orquídea',def:'La flor nacional desde 1969'},
  {term:'La Guara Roja',def:'El ave nacional de Honduras'},
  {term:'El Venado Cola Blanca',def:'El mamífero nacional de Honduras'},
  {term:'Lempira',def:'El cacique lenca, Héroe Nacional'},
  {term:'Francisco Morazán',def:'El Paladín de la Unión Centroamericana'},
  {term:'José Cecilio del Valle',def:'Redactó el Acta de Independencia'},
  {term:'15 de septiembre de 1821',def:'Independencia de Centroamérica'},
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

function genEval(){sfx('click');_evalFormaSelector(); const _selF = document.getElementById('evalFormaSel'); if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10))); const cf = evalFormNum; const rng = _evalRng(cf); window._currentEvalForm=cf;evalFormNum = (evalFormNum % EVAL_FORMAS) + 1; _evalFormaSelector();saveProgress();document.getElementById('eval-screen-title').textContent=`🎓 Evaluación Final · Forma ${cf} · Aspectos Cívicos de Honduras`;evalAnsVisible=false;const out=document.getElementById('evalOut');out.innerHTML='';const bar=document.createElement('div');bar.className='eval-score-bar';bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje · 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25 pts</span><span class="eval-score-pill esp-tf">V/F 25 pts</span><span class="eval-score-pill esp-mc">Selección 25 pts</span><span class="eval-score-pill esp-pr">Pareados 25 pts</span></div>`;out.appendChild(bar);const cpItems=_pickF(evalCPBank,5, rng);const s1=document.createElement('div');s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';cpItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='cp';d.dataset.evalIndex=i;const qHtml=item.q.replace('___',`<input class="eval-cp-input" type="text" data-cp="${i}" autocomplete="off">`);d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbCp${i}" aria-live="polite"></div>`;s1.appendChild(d);});out.appendChild(s1);const tfItems=_pickF(evalTFBank,5, rng);const s2=document.createElement('div');s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';tfItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='tf';d.dataset.evalIndex=i;d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="true"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="false"> Falso</label></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbTf${i}" aria-live="polite"></div>`;s2.appendChild(d);});out.appendChild(s2);const mcItems=_pickF(evalMCBank,5, rng);const s3=document.createElement('div');s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';mcItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='mc';d.dataset.evalIndex=i;const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join('');d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbMc${i}" aria-live="polite"></div>`;s3.appendChild(d);});out.appendChild(s3);const prItems=_pickF(evalPRBank,5, rng);const shuffledDefs=_shuffleF(prItems, rng);const letters=['A','B','C','D','E'];const s4=document.createElement('div');s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';const matchCard=document.createElement('div');matchCard.className='eval-item';let colLeft='<div class="eval-match-col"><h4>📌 Términos</h4>';prItems.forEach((item,i)=>{colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> <select class="eval-match-select" data-pr="${i}" aria-label="Respuesta pareada ${i+16}"><option value="">—</option>${letters.map(l=>`<option value="${l}">${l}</option>`).join('')}</select> ${item.term}</div>`;});colLeft+='</div>';let colRight='<div class="eval-match-col"><h4>🔑 Definiciones</h4>';shuffledDefs.forEach((item,i)=>{colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`;});colRight+='</div>';const ansKey=prItems.map((item,i)=>{const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)];return`${i+16}→${letter}`;}).join(' · ');matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div><div class="eval-item-feedback" id="evalFbPr" aria-live="polite"></div>`;s4.appendChild(matchCard);out.appendChild(s4);window._evalPrintData={tf:tfItems,mc:mcItems,cp:cpItems,pr:{terms:prItems,shuffledDefs,letters}};const autoPanel=document.createElement('div');autoPanel.id='evalAutoResult';autoPanel.className='eval-auto-result';autoPanel.innerHTML='<strong>🧮 Evaluación interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato original sin respuestas digitadas.';out.appendChild(autoPanel);fin('s-evaluacion');}
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación Aspectos Cívicos de Honduras · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.12rem 0.4rem;margin:0.22rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #3f6212;background:#f2f7e6;color:#3f6212;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#3f6212;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #3f6212;height:12px;}.obt-pct{white-space:nowrap;}.qn{font-weight:700;min-width:22px;flex-shrink:0;}.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:40px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.18rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.14rem 0.35rem;margin-bottom:0.1rem;break-inside:avoid;page-break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.3;display:flex;gap:0.28rem;margin-bottom:0.07rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.1rem 0.5rem;}.mc-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:0.04rem 0.15rem;margin-left:0.8rem;}.mc-opt{font-size:9pt;display:flex;align-items:center;gap:0.15rem;}.mc-opt input{width:10px;height:10px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{margin-top:0.1rem;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.08rem 0.4rem;margin-top:0.08rem;}.pr-head{font-size:9pt;font-weight:700;color:#555;margin-bottom:0.1rem;}.pr-item{font-size:10.5pt;padding:0.1rem 0.28rem;background:#f2f7e6;border-radius:3px;margin-bottom:0.07rem;display:flex;align-items:center;gap:0.2rem;line-height:1.2;break-inside:avoid;page-break-inside:avoid;}.pr-num{font-weight:700;color:#3f6212;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.22rem;padding:0.15rem 0;page-break-before:avoid;break-before:avoid;color:#3f6212;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #3f6212;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#555;}.pa{color:#007a00;font-weight:600;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · Aspectos Cívicos de Honduras · Educación Básica · Educación Cívica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Evaluación Final · Aspectos Cívicos de Honduras · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u</div></div><div class="p-grid">${pR}</div>
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
  {txt:'En el acto del lunes, un alumno de sexto grado se queda platicando mientras sus compañeros cantan el Himno Nacional.'},
  {txt:'La escolta de la escuela iza la Bandera Nacional y todos los alumnos se quedan de pie y en silencio hasta que llega arriba.'},
  {txt:'Una maestra explica que las cinco estrellas de la Bandera recuerdan a los países que formaron una sola nación centroamericana.'},
  {txt:'Un grupo de alumnos prepara el desfile del 15 de septiembre y ensaya el Himno Nacional todas las tardes.'},
  {txt:'Un niño pregunta por qué la moneda de Honduras se llama Lempira si Lempira fue un cacique y no un presidente.'},
  {txt:'En la clase se comenta que la flor nacional dejó de ser la rosa porque esa flor no nace en Honduras.'},
];
const critCaseQuestions=[
  '1. ¿Qué símbolo patrio o qué fecha cívica aparece en este caso?',
  '2. ¿La conducta que se describe respeta el símbolo o no? ¿Por qué?',
  '3. ¿Qué explica este caso sobre la historia o el significado de ese símbolo?',
  '4. ¿Qué harías tú en esa situación y qué le dirías a un compañero?',
];
const critCaseGuides=[
  'Puede aparecer un símbolo mayor (la Bandera, el Escudo, el Himno), uno menor (el pino, la orquídea, la guara roja, el venado) o una fecha cívica.',
  'Se respeta cuando se está de pie, firme y en silencio, y cuando la Bandera no toca el suelo ni se usa de adorno. No se respeta cuando se platica, se juega o se le pinta encima.',
  'Cada símbolo cuenta algo: las cinco estrellas hablan de la Federación de Centroamérica, el nombre de la moneda honra a Lempira, y la orquídea sustituyó a la rosa por ser originaria del país.',
  'Respuesta abierta. Se valora que el alumno proponga corregir con respeto y explicar el porqué, no burlarse ni acusar.',
];
const critErrorBank=[
  {txt:'"La Bandera de Honduras tiene tres estrellas y la franja del centro es azul."',
   g1:'La Bandera lleva CINCO estrellas, no tres.',
   g2:'La franja del centro es BLANCA; las de arriba y abajo son azul turquesa.'},
  {txt:'"La letra del Himno Nacional la escribió Carlos Hartling y la música es de Augusto C. Coello."',
   g1:'Es al revés: la LETRA es de Augusto C. Coello.',
   g2:'La MÚSICA es de Carlos Hartling, músico alemán.'},
  {txt:'"El Himno Nacional tiene tres estrofas y en los actos se canta la primera."',
   g1:'El Himno tiene un coro y SIETE estrofas.',
   g2:'En los actos escolares se canta el coro y la SÉPTIMA estrofa.'},
  {txt:'"El árbol nacional de Honduras es la ceiba y la flor nacional es la rosa."',
   g1:'El árbol nacional es el PINO, declarado en 1928.',
   g2:'La flor nacional es la ORQUÍDEA desde 1969; la rosa lo fue antes y se cambió por no ser originaria del país.'},
  {txt:'"Lempira firmó el Acta de Independencia y Francisco Morazán fue un cacique lenca."',
   g1:'El Acta de Independencia la redactó JOSÉ CECILIO DEL VALLE, en 1821.',
   g2:'LEMPIRA fue el cacique lenca; MORAZÁN fue el presidente que luchó por la unión de Centroamérica.'},
  {txt:'"El Día de la Bandera es el 15 de septiembre y ese mismo día nació Francisco Morazán."',
   g1:'El Día de la Bandera es el 1 DE SEPTIEMBRE; el 15 es la Independencia de Centroamérica.',
   g2:'Morazán NACIÓ el 3 de octubre de 1792; el 15 de septiembre de 1842 fue el día de su MUERTE.'},
];
const critDecisionBank=[
  'Cuando empieza el Himno Nacional en el acto cívico, conviene ponerse de pie y guardar silencio, o seguir platicando con el compañero de al lado.',
  'Si la Bandera Nacional se cae al patio, conviene levantarla enseguida y guardarla limpia y doblada, o dejarla ahí hasta que termine el acto.',
  'Para saber qué representan las cinco estrellas de la Bandera, conviene buscarlo en el libro de Ciencias Sociales o preguntarle al maestro, o inventar una explicación.',
  'Para un mural del Mes de la Patria, conviene dibujar el Escudo Nacional completo con todas sus partes, o dibujar solo el triángulo porque es más fácil.',
  'Si un compañero dice que el árbol nacional es la ceiba, conviene explicarle con respeto que es el pino y mostrarle dónde lo dice, o reírse de él delante de todos.',
];
const critDecisionGuide='La mejor decisión respeta el símbolo y respeta a las personas: ante el Himno se está de pie y en silencio; la Bandera nunca se deja en el suelo; los datos se consultan y no se inventan; un símbolo patrio se muestra COMPLETO y no a medias; y a un compañero equivocado se le corrige con respeto, no con burla.';
const critCompareBank=[
  {a:'Símbolo con tres franjas y cinco estrellas azul turquesa.',b:'Símbolo con un triángulo, un volcán y dos torres.',
   ga:'La Bandera Nacional.',
   gb:'El Escudo Nacional.',
   gr:'Los dos son símbolos patrios mayores, pero la Bandera se iza y se lleva en el desfile, y el Escudo se usa en los documentos y sellos oficiales del Estado.'},
  {a:'Cacique lenca que resistió la conquista española hacia 1537.',b:'Presidente que luchó por mantener unida a Centroamérica.',
   ga:'Lempira.',
   gb:'Francisco Morazán.',
   gr:'Los dos son héroes de Honduras, pero vivieron en épocas muy distintas: Lempira defendió su pueblo de la conquista, y Morazán, tres siglos después, defendió la unión de las cinco naciones ya independientes.'},
  {a:'Se le rinde homenaje el 1 de septiembre y abre el Mes de la Patria.',b:'Se celebra el 15 de septiembre y recuerda el año 1821.',
   ga:'El Día de la Bandera Nacional.',
   gb:'El Día de la Independencia de Centroamérica.',
   gr:'Las dos son fechas cívicas de septiembre, pero una honra a un símbolo y la otra recuerda un hecho histórico: la firma del Acta de Independencia.'},
];
const critCauseBank=[
  {cause:'Las cinco naciones de Centroamérica se independizaron juntas en 1821.',guide:'Por eso la Bandera lleva cinco estrellas: recuerdan a la Federación que formaron.'},
  {cause:'La rosa no es una flor originaria de Honduras.',guide:'Por eso en 1969 se cambió la flor nacional por la orquídea, que sí nace en los bosques del país.'},
  {cause:'El pino es el árbol que más abunda en las montañas hondureñas.',guide:'Por eso se declaró árbol nacional, y Honduras tiene el mayor bosque de pino de Centroamérica.'},
  {cause:'Los símbolos patrios representan a todo el país.',guide:'Por eso se les rinde honores y no se usan como adorno ni se les dibuja encima.'},
  {cause:'El Himno Nacional es largo: tiene un coro y siete estrofas.',guide:'Por eso en los actos escolares se canta solo el coro y la séptima estrofa.'},
];
const critEffectBank=[
  {effect:'La moneda de Honduras se llama Lempira.',guide:'Porque el país honra así al cacique lenca que dirigió la resistencia contra la conquista.'},
  {effect:'El Escudo Nacional lleva la fecha 15 de septiembre de 1821.',guide:'Porque ese día se firmó el Acta de Independencia de Centroamérica.'},
  {effect:'En septiembre las escuelas ensayan el Himno y preparan desfiles.',guide:'Porque septiembre es el Mes de la Patria: empieza el día 1 con el Día de la Bandera y culmina el 15 con la Independencia.'},
  {effect:'Hoy hay guaras rojas volando libres sobre las ruinas de Copán.',guide:'Porque el ave nacional está protegida y varios grupos las crían y las devuelven al bosque.'},
  {effect:'El 17 de septiembre se celebra el Día del Maestro Hondureño.',guide:'Porque honra a José Trinidad Reyes, el sacerdote que fundó la primera universidad del país.'},
];
function genEvalCrit(){
  sfx('click');
  _injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });
  const _sC = document.getElementById('evalCritFormaSel');
  if (_sC && parseInt(_sC.value, 10)) evalCritFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sC.value, 10)));
  const cf=evalCritFormNum;window._currentEvalCritForm=cf;const rngC = _evalRng(200000 + cf);evalCritFormNum=(evalCritFormNum%EVAL_FORMAS)+1;_injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });saveProgress();
  document.getElementById('evalcrit-screen-title').textContent=`🧠 Pensamiento Crítico · Forma ${cf} · Aspectos Cívicos de Honduras`;
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
  s3.innerHTML=`<div class="eval-section-title">III. Toma de decisiones: respetar los símbolos <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${dec}</div><div class="crit-q-block"><div class="crit-q-label">¿Qué opción recomendarías? Explica por qué, relacionándolo con los símbolos patrios, los próceres y el respeto que se les debe.</div><textarea class="crit-textarea" rows="4" aria-label="Recomendaciones y su justificación"></textarea><div class="crit-pauta">${critDecisionGuide}</div></div><div class="crit-selfscore"><label for="critScore2">Obtenido:</label><input type="number" id="critScore2" class="crit-score-input" data-score="2" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
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
  let s3=`<div class="sec-title"><span>III. Toma de decisiones: respetar los símbolos</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.dec}</p><p class="crit-print-q">¿Qué opción recomendarías? Explica por qué, relacionándolo con los símbolos patrios, los próceres y el respeto que se les debe.</p>${lines(2)}`;
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
  const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Pensamiento Crítico Aspectos Cívicos de Honduras · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.1rem 0.4rem;margin:0.2rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #3f6212;background:#f2f7e6;color:#3f6212;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#3f6212;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #3f6212;height:12px;}.obt-pct{white-space:nowrap;}.crit-print-scenario{font-size:10.5pt;background:#f2f7e6;border-left:3px solid #3f6212;padding:0.2rem 0.5rem;margin:0.1rem 0 0.2rem;line-height:1.3;}.crit-print-q{font-size:10pt;font-weight:600;margin:0.15rem 0 0.08rem;line-height:1.25;}.ln{border-bottom:1px solid #111;min-height:12px;margin-bottom:2px;}.crit-compare-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin:0.15rem 0;}.crit-compare-print-box{font-size:9.5pt;background:#f2f7e6;border-radius:4px;padding:0.25rem 0.4rem;line-height:1.25;}.crit-print-tbl{width:100%;border-collapse:collapse;font-size:9.5pt;margin-top:0.15rem;}.crit-print-tbl th,.crit-print-tbl td{border:1px solid #999;padding:0.3rem 0.45rem;text-align:left;height:30px;vertical-align:middle;}.crit-print-tbl th{background:#f2f7e6;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.08rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.9rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.45rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.1rem;margin-bottom:0.18rem;}.p-crit-line{font-size:11pt;color:#007a00;margin-bottom:0.18rem;line-height:1.35;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.2rem;padding:0.1rem 0;color:#3f6212;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #3f6212;}.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:12.7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="critEvalPage"><div class="ph"><h2>Evaluación Competencial · Pensamiento Crítico · Aspectos Cívicos de Honduras · Educación Básica · Educación Cívica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 5 secciones de 20 puntos</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100</span></div></div><div class="pauta-wrap" id="critPautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Pensamiento Crítico · Aspectos Cívicos de Honduras · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 5 secciones × 20 pts c/u — respuesta abierta, usar como guía de corrección</div></div><div class="p-grid">${pR}</div></div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("critEvalPage",250,0.55,1.2);fit("critPautaPage",250,0.55,1.2);})();<\/script></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(doc);win.document.close();setTimeout(()=>win.print(),400);
}

// ===================== LABORATORIO DE LOS SÍMBOLOS =====================
const parteData={
  bandera:{
    nombre:'La Bandera Nacional',icon:'🇭🇳',
    estructura:{title:'¿Qué es?',info:'• El <strong>símbolo patrio mayor</strong> que representa a Honduras<br>• Se iza en las escuelas, en los edificios del Estado y en el desfile<br>• Se le rinde homenaje el <strong>1 de septiembre</strong>, Día de la Bandera'},
    funcion:{title:'¿Cómo es?',info:'• <strong>Tres franjas</strong> horizontales del mismo ancho<br>• Azul turquesa arriba, <strong>blanca en medio</strong>, azul turquesa abajo<br>• <strong>Cinco estrellas</strong> azul turquesa en el centro de la franja blanca'},
    ubicacion:{title:'¿Qué significa?',info:'• El <strong>azul:</strong> los dos mares que bañan al país y el cielo<br>• El <strong>blanco:</strong> la paz y la pureza del pueblo<br>• Las <strong>cinco estrellas:</strong> Guatemala, El Salvador, Honduras, Nicaragua y Costa Rica'},
    dato:{title:'Dato curioso',info:'• Nació por decreto del <strong>16 de febrero de 1866</strong><br>• Se basó en la bandera de las <strong>Provincias Unidas del Centro de América</strong><br>• Nunca debe tocar el suelo ni usarse como adorno'}
  },
  escudo:{
    nombre:'El Escudo Nacional',icon:'🛡️',
    estructura:{title:'¿Qué es?',info:'• El <strong>símbolo patrio mayor</strong> del Estado de Honduras<br>• Va en los <strong>documentos oficiales</strong>, los sellos y la moneda<br>• Es el <strong>más antiguo</strong> de los tres símbolos mayores'},
    funcion:{title:'¿Cómo es?',info:'• Un <strong>triángulo equilátero</strong> dentro de un óvalo<br>• En su base, un <strong>volcán entre dos torres</strong>, con el arco iris y el sol naciente<br>• Arriba, una cordillera con <strong>robles y pinos</strong>, herramientas de minería, <strong>aljabas</strong> con flechas y <strong>cornucopias</strong>'},
    ubicacion:{title:'¿Qué significa?',info:'• El <strong>triángulo:</strong> la igualdad, porque sus tres lados miden lo mismo<br>• Las <strong>torres:</strong> la defensa y la soberanía del territorio<br>• Las <strong>cornucopias:</strong> la abundancia y la riqueza de la tierra'},
    dato:{title:'Dato curioso',info:'• Creado el <strong>3 de octubre de 1825</strong>, con Dionisio de Herrera de Jefe de Estado<br>• El óvalo lleva escrito: <strong>República de Honduras, libre, soberana e independiente</strong><br>• Al principio decía «Estado de Honduras de la Federación del Centro», porque el país todavía era parte de la Federación'}
  },
  himno:{
    nombre:'El Himno Nacional',icon:'🎵',
    estructura:{title:'¿Qué es?',info:'• El <strong>canto</strong> con que Honduras se presenta ante el mundo<br>• Se canta de pie, firme y en silencio<br>• Es el <strong>tercer</strong> símbolo patrio mayor'},
    funcion:{title:'¿Cómo es?',info:'• Tiene un <strong>coro y siete estrofas</strong><br>• El <strong>coro describe la Bandera:</strong> «Tu bandera es un lampo de cielo…»<br>• En los actos escolares se canta el <strong>coro, la séptima estrofa y el coro</strong>'},
    ubicacion:{title:'¿Quién lo hizo?',info:'• <strong>Letra:</strong> Augusto C. Coello, escritor hondureño<br>• <strong>Música:</strong> Carlos Hartling, músico alemán<br>• Oficializado por acuerdo del gobierno en <strong>1915</strong>'},
    dato:{title:'Dato curioso',info:'• Se compuso en <strong>1903</strong> y se llamaba «Canto a Honduras»<br>• Se cantó por primera vez el <strong>15 de septiembre de 1904</strong><br>• Las seis primeras estrofas cuentan la <strong>historia del país</strong>: la llegada de Colón, la colonia, la resistencia de Lempira y la Independencia'}
  },
  menores:{
    nombre:'Los símbolos menores',icon:'🌲',
    estructura:{title:'¿Qué son?',info:'• Los símbolos que representan la <strong>naturaleza y el territorio</strong> del país<br>• No sustituyen a los mayores: los <strong>acompañan</strong><br>• Se declararon <strong>mucho después</strong> que la Bandera, el Escudo y el Himno'},
    funcion:{title:'¿Cuáles son?',info:'• <strong>El Pino:</strong> árbol nacional (1928)<br>• <strong>La orquídea</strong> <em>Rhyncholaelia digbyana</em>: flor nacional (1969)<br>• <strong>La guara roja</strong> y <strong>el venado cola blanca</strong>: ave y mamífero nacional (1993)'},
    ubicacion:{title:'¿Dónde se ven?',info:'• El <strong>pino</strong> cubre las montañas: Honduras tiene el mayor bosque de pino de Centroamérica<br>• La <strong>guara roja</strong> vuela sobre Copán y en La Mosquitia<br>• El <strong>venado</strong> vive en bosques y sabanas de todo el país'},
    dato:{title:'Dato curioso',info:'• De 1946 a 1969 la flor nacional fue <strong>la rosa</strong>: se cambió porque no nace en Honduras<br>• La guara roja y el venado se declararon <strong>el mismo día</strong>, el 28 de junio de 1993<br>• El <strong>mapa</strong> del territorio también se cuenta entre los símbolos: 18 departamentos y dos mares'}
  },
  proceres:{
    nombre:'Próceres y héroes',icon:'🏅',
    estructura:{title:'¿Quiénes son?',info:'• Las personas que <strong>hicieron la patria</strong> con su trabajo o su lucha<br>• Un <strong>héroe</strong> defiende a su pueblo; un <strong>prócer</strong> ayuda a fundar la nación<br>• Sus nombres están en calles, parques, monedas y departamentos'},
    funcion:{title:'Los principales',info:'• <strong>Lempira:</strong> cacique lenca, Héroe Nacional<br>• <strong>Francisco Morazán:</strong> el Paladín de la Unión Centroamericana<br>• <strong>José Cecilio del Valle:</strong> el Sabio Valle, redactó el Acta de Independencia'},
    ubicacion:{title:'Otros que hay que conocer',info:'• <strong>Dionisio de Herrera:</strong> primer Jefe de Estado de Honduras (1824)<br>• <strong>José Trinidad Cabañas:</strong> presidente, «el caballero sin tacha y sin miedo»<br>• <strong>José Trinidad Reyes:</strong> sacerdote, fundó la primera universidad del país'},
    dato:{title:'Dato curioso',info:'• La <strong>moneda</strong> de Honduras se llama Lempira en honor al cacique<br>• Morazán <strong>nació</strong> un 3 de octubre y <strong>murió</strong> un 15 de septiembre<br>• El <strong>Día del Maestro</strong>, 17 de septiembre, honra a José Trinidad Reyes'}
  },
  fechas:{
    nombre:'El Mes de la Patria',icon:'📅',
    estructura:{title:'¿Qué es?',info:'• <strong>Septiembre</strong>, el mes en que Honduras celebra su historia<br>• Abre el <strong>1 de septiembre</strong> con el Día de la Bandera<br>• Culmina el <strong>15 de septiembre</strong> con la Independencia'},
    funcion:{title:'Las fechas de septiembre',info:'• <strong>1:</strong> Día de la Bandera Nacional<br>• <strong>10:</strong> Día del Niño Hondureño<br>• <strong>15:</strong> Independencia de Centroamérica (1821)<br>• <strong>17:</strong> Día del Maestro Hondureño'},
    ubicacion:{title:'Otras fechas cívicas',info:'• <strong>11 de junio:</strong> Día del Estudiante Hondureño<br>• <strong>20 de julio:</strong> Día de Lempira<br>• <strong>3 de octubre:</strong> natalicio de Francisco Morazán'},
    dato:{title:'Dato curioso',info:'• El <strong>15 de septiembre de 1821</strong> se firmó el Acta en Guatemala, y se independizaron <strong>cinco naciones a la vez</strong><br>• Por eso Guatemala, El Salvador, Honduras, Nicaragua y Costa Rica celebran <strong>el mismo día</strong><br>• La <strong>antorcha</strong> que recorre el país anuncia la llegada del 15'}
  }
};
let labParte='bandera',labAspecto='estructura';
function labShowParte(parteKey){labParte=parteKey;updateLabDisplay();document.querySelectorAll('.lab-cont-btn').forEach(b=>b.classList.remove('active-pri'));const btn=document.querySelector(`[data-parte="${parteKey}"]`);if(btn)btn.classList.add('active-pri');if(typeof sfx==='function')sfx('click');}
function labShowAspecto(aspectoKey){labAspecto=aspectoKey;updateLabDisplay();document.querySelectorAll('.lab-asp-btn').forEach(b=>b.classList.remove('active-sec'));const btn=document.querySelector(`[data-aspecto="${aspectoKey}"]`);if(btn)btn.classList.add('active-sec');if(typeof sfx==='function')sfx('click');}
function updateLabDisplay(){const data=parteData[labParte];const asp=data[labAspecto];document.getElementById('lab-sentence').innerHTML=`🔬 Explorando: <strong>${data.nombre}</strong> → <strong>${asp.title}</strong>`;document.getElementById('lab-display').innerHTML=`<div class="lab-cont-header">${data.icon} ${data.nombre}</div><div class="lab-asp-title">${asp.title}</div><div class="lab-asp-info">${asp.info}</div>`;}

// ===================== DIPLOMA =====================
function _diplPct(){return xp>=MXP?100:Math.round((xp/MXP)*100);}
function openDiploma(){sfx('fan');const pct=_diplPct();document.getElementById('diplPct').textContent=pct+'%';document.getElementById('diplBar').style.width=pct+'%';document.getElementById('diplDate').textContent='Fecha: '+new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});const msgs=['¡Sigue aprendiendo!','¡Muy buen trabajo!','¡Vas muy bien!','¡Dominas los símbolos patrios!','¡Guardián de la Patria!'];document.getElementById('diplMsg').textContent=msgs[Math.min(Math.floor(pct/25),4)];const stars=['⭐','⭐⭐','⭐⭐⭐'];document.getElementById('diplStars').textContent=stars[Math.min(Math.floor(pct/40),2)];const achTxt=unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(' · ');document.getElementById('diplAch').textContent=achTxt||'Sigue completando secciones para desbloquear logros';document.getElementById('diplomaOverlay').classList.add('open');launchConfetti();}
function closeDiploma(){document.getElementById('diplomaOverlay').classList.remove('open');}
function updateDiplomaName(v){document.getElementById('diplName').textContent=v||'Estudiante';}
function shareWA(){const name=document.getElementById('diplName').textContent||'Estudiante';const pct=_diplPct();const msg=`🇭🇳 ¡${name} completó la Misión "Aspectos Cívicos de Honduras"! 🏅 Progreso: ${pct}% · 🌱 policastsapien.com`;_waShare(msg);}
async function captureDiploma(){if(typeof html2canvas==='undefined'){showToast('⚠️ Cargando... intenta de nuevo');return;}sfx('click');const card=document.querySelector('.diploma-card');const btn=document.querySelector('.diploma-actions .btn-pri');const toHide=[card.querySelector('.diploma-input'),card.querySelector('.diploma-actions'),card.querySelector('hr')];if(btn){btn.disabled=true;btn.textContent='⏳ Capturando...';}toHide.forEach(el=>{if(el)el.style.display='none';});let dataUrl='';try{const canvas=await html2canvas(card,{scale:2,useCORS:true,backgroundColor:'#ffffff'});toHide.forEach(el=>{if(el)el.style.display='';});dataUrl=canvas.toDataURL('image/png');const name=(document.getElementById('diplName').textContent||'Estudiante').replace(/\s+/g,'-');const fileName='constancia-'+name+'.png';const cap=window.Capacitor;if(cap&&cap.isNativePlatform&&cap.isNativePlatform()&&cap.Plugins?.Filesystem&&cap.Plugins?.Share){const base64Data=dataUrl.split(',')[1];const result=await cap.Plugins.Filesystem.writeFile({path:fileName,data:base64Data,directory:'CACHE'});await cap.Plugins.Share.share({url:result.uri,dialogTitle:'Guardar / Compartir Constancia'});}else{const a=document.createElement('a');a.href=dataUrl;a.download=fileName;a.click();}}catch(e){toHide.forEach(el=>{if(el)el.style.display='';});if(e.name!=='AbortError')showToast('⚠️ No se pudo guardar la constancia');}finally{if(btn){btn.disabled=false;btn.textContent='📷 Guardar foto';}}}

// ===================== INIT =====================
window.addEventListener('DOMContentLoaded',()=>{
  initTheme();
  loadProgress();
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
  document.querySelector('[data-parte="bandera"]')?.classList.add('active-pri');
  document.querySelector('[data-aspecto="estructura"]')?.classList.add('active-sec');
  renderAchPanel();
});

(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalCrit==='function') _injectFormaSel('genEvalCrit','evalCritFormaSel',evalCritFormNum,function(v){evalCritFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();
