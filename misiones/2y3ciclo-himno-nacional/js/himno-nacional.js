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
const SAVE_KEY='himno_nacional_v1';
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
  primer_quiz:{icon:'🎵',label:'Primera prueba del Himno superada'},
  flash_master:{icon:'🃏',label:'Todas las flashcards del Himno exploradas'},
  clasif_pro:{icon:'🗂️',label:'Sabe distinguir el coro de las estrofas'},
  id_master:{icon:'🔍',label:'Reconoce de qué estrofa es cada verso'},
  reto_hero:{icon:'🏆',label:'Héroe del reto del Himno'},
  nivel3:{icon:'🎖️',label:'¡Buena voz! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡Guardián del Himno! Nivel 6'},
  widgets_master:{icon:'🧩',label:'Widgets del Himno dominados'}
};
function unlockAchievement(id){if(unlockedAch.includes(id))return;unlockedAch.push(id);sfx('ach');showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label);launchConfetti();renderAchPanel();saveProgress();}
function renderAchPanel(){const list=document.getElementById('achList');list.innerHTML='';Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{const div=document.createElement('div');div.className='ach-item'+(unlockedAch.includes(id)?'':' locked');div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`;list.appendChild(div);});}
function toggleAchPanel(){sfx('click');document.getElementById('achPanel').classList.toggle('open');}
function showToast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}t.textContent=msg;t.style.display='block';clearTimeout(t._tid);t._tid=setTimeout(()=>t.style.display='none',3200);}
function launchConfetti(){const colors=['#3f6212','#2dd4bf','#b45309','#f59e0b','#14b8a6'];for(let i=0;i<60;i++){const c=document.createElement('div');c.className='confetti-piece';c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`;document.body.appendChild(c);c.addEventListener('animationend',()=>c.remove());}}

// ===================== XP =====================
const lvls=[{t:0,n:'Aprendiz 🌱'},{t:25,n:'Buen oído 👂'},{t:55,n:'Corista 🎼'},{t:90,n:'Buena voz 🎤'},{t:130,n:'Conoce las estrofas 📖'},{t:165,n:'Sabe el Himno 🏅'},{t:190,n:'Guardián del Himno 🏆'}];
function pts(n){xp=Math.max(0,Math.min(MXP,xp+n));updateXPBar();saveProgress();}
function updateXPBar(){const pct=Math.round((xp/MXP)*100);document.getElementById('xpFill').style.width=pct+'%';const el=document.getElementById('xpPts');el.textContent='⭐ '+xp;el.style.transform='scale(1.3)';setTimeout(()=>el.style.transform='',300);let lv=0;for(let i=0;i<lvls.length;i++)if(xp>=lvls[i].t)lv=i;document.getElementById('xpLvl').textContent=lvls[lv].n;if(lv!==prevLevel){if(lv>=2)unlockAchievement('nivel3');if(lv>=5)unlockAchievement('nivel5');prevLevel=lv;}}
function resetXP(){sfx('click');xp=0;updateXPBar();showToast('🔄 XP reiniciado a 0');}
function fin(id,showFX=true){if(!done.has(id)){done.add(id);const b=document.querySelector(`[data-s="${id}"]`);if(b)b.classList.add('done');if(showFX){sfx('up');launchConfetti();}saveProgress();}}
function getProgress(){return Math.round((done.size/TOTAL_SECTIONS)*100);}

// ===================== NAV =====================
function go(id){sfx('click');document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});document.getElementById(id).classList.add('active');const btn=document.querySelector(`[data-s="${id}"]`);if(btn){btn.classList.add('active');btn.setAttribute('aria-selected','true');}window.scrollTo({top:0,behavior:'smooth'});if(id==='s-sopa'){setTimeout(buildSopa,50);}if(id==='s-widgets'){setTimeout(buildRoute,50);}}

// ===================== FLASHCARD DATA =====================
const fcData=[
  {w:'¿Quién escribió la letra?',a:'✍️ <strong>Augusto C. Coello</strong>, escritor hondureño. La escribió en <strong>1903</strong>.'},
  {w:'¿Quién compuso la música?',a:'🎼 <strong>Carlos Hartling</strong>, músico <strong>alemán</strong> que vivía en Honduras.'},
  {w:'¿Cuántas estrofas tiene?',a:'7️⃣ Un <strong>coro</strong> y <strong>siete estrofas</strong>, de ocho versos cada una: 64 versos.'},
  {w:'¿Cuál se canta en los actos?',a:'🏫 El <strong>coro</strong>, la <strong>séptima estrofa</strong> y otra vez el <strong>coro</strong>.'},
  {w:'¿De qué habla el coro?',a:'🇭🇳 De la <strong>Bandera</strong> y del <strong>Escudo</strong>: las franjas, las cinco estrellas, el mar, el volcán y el sol.'},
  {w:'Primera estrofa',a:'⛵ La llegada de <strong>Cristóbal Colón</strong> a las costas de Honduras, en <strong>1502</strong>.'},
  {w:'Segunda estrofa',a:'🏴 De dónde vino Colón, y el <strong>«extraño pendón»</strong>: la bandera de otro país ondeando aquí.'},
  {w:'Tercera estrofa',a:'🏹 La resistencia y la muerte de <strong>Lempira</strong>. De su tumba solo quedó la leyenda.'},
  {w:'Cuarta estrofa',a:'⛓️ Los <strong>tres siglos</strong> de colonia, y el <strong>León</strong> que ruge al otro lado del mar.'},
  {w:'Quinta estrofa',a:'🇫🇷 El León era <strong>Francia</strong>: la Revolución Francesa, Dantón y la diosa Razón.'},
  {w:'Sexta estrofa',a:'⛓️‍💥 La <strong>Independencia</strong>: Honduras rompe el «infame eslabón» y la colonia se va.'},
  {w:'Séptima estrofa',a:'✋ El <strong>juramento</strong>: defender la Bandera hasta la muerte, y caer con honor.'},
  {w:'«Lampo»',a:'✨ <strong>Resplandor, destello de luz.</strong> «Tu bandera es un lampo de cielo».'},
  {w:'«Infame eslabón»',a:'⛓️ El <strong>anillo de la cadena</strong> de la opresión colonial, que Honduras rompió.'},
];
let fcIdx=0;
function upFC(){document.getElementById('fcInner').classList.remove('flipped');document.getElementById('fcW').textContent=fcData[fcIdx].w;document.getElementById('fcA').innerHTML=fcData[fcIdx].a;document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length;}
function flipCard(){sfx('flip');document.getElementById('fcInner').classList.toggle('flipped');if(!xpTracker.fc.has(fcIdx)){xpTracker.fc.add(fcIdx);pts(1);}if(xpTracker.fc.size===fcData.length){fin('s-flash');unlockAchievement('flash_master');}}
function nextFC(){sfx('click');fcIdx=(fcIdx+1)%fcData.length;upFC();}
function prevFC(){sfx('click');fcIdx=(fcIdx-1+fcData.length)%fcData.length;upFC();}

// ===================== QUIZ DATA =====================
const qzData=[
  {q:'¿Cuántas estrofas tiene el Himno Nacional?',o:['a) Cinco','b) Siete','c) Nueve','d) Tres'],c:1},
  {q:'¿Qué se canta en los actos escolares?',o:['a) Las siete estrofas seguidas','b) Solo la primera estrofa','c) El coro, la séptima estrofa y el coro','d) Solo el coro'],c:2},
  {q:'¿De qué habla el coro del Himno?',o:['a) De la Bandera y del Escudo','b) De la Independencia','c) De Lempira','d) De la Revolución Francesa'],c:0},
  {q:'¿A qué se refiere la primera estrofa?',o:['a) A la muerte de Lempira','b) A la llegada de Cristóbal Colón','c) A los tres siglos de colonia','d) A la Independencia'],c:1},
  {q:'¿Qué estrofa habla de la muerte de Lempira?',o:['a) La primera','b) La segunda','c) La tercera','d) La séptima'],c:2},
  {q:'En la cuarta estrofa, ¿quién es el León que ruge indignado?',o:['a) España','b) Inglaterra','c) Honduras','d) Francia'],c:3},
  {q:'¿Qué cuenta la sexta estrofa?',o:['a) La Independencia de Centroamérica','b) La conquista española','c) La llegada de Colón','d) La Revolución Francesa'],c:0},
  {q:'¿Qué significa «lampo» en el coro?',o:['a) Una lámpara','b) Resplandor, destello de luz','c) Un pedazo de tela','d) Una nube'],c:1},
  {q:'¿Qué es el «infame eslabón» de la sexta estrofa?',o:['a) Una joya del rey','b) Una montaña de Honduras','c) La cadena de la opresión colonial','d) El escudo de España'],c:2},
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
  {label:['Del coro','De una estrofa'],headA:'🎼 Es del coro',headB:'📖 Es de una estrofa',colA:'coro',colB:'est',
   words:[{w:'Tu bandera es un lampo de cielo',t:'coro'},{w:'India virgen y hermosa dormías',t:'est'},{w:'cinco estrellas de pálido azul',t:'coro'},{w:'porque envuelto en su sangre Lempira',t:'est'},{w:'hay un astro de nítida luz',t:'coro'},{w:'Por tres siglos tus hijos oyeron',t:'est'},{w:'con sus ondas bravías escuda',t:'coro'},{w:'Era Francia, la libre, la heroica',t:'est'}]},
  {label:['Antes de la Independencia','La Independencia o después'],headA:'⛓️ Antes',headB:'🕊️ Independencia',colA:'antes',colB:'indep',
   words:[{w:'Llega Cristóbal Colón',t:'antes'},{w:'Honduras rompe el eslabón',t:'indep'},{w:'Muere Lempira',t:'antes'},{w:'La colonia se pierde de vista',t:'indep'},{w:'Tres siglos oyendo al amo',t:'antes'},{w:'Se jura defender la Bandera',t:'indep'},{w:'Ondea un extraño pendón',t:'antes'},{w:'Se enseña al mundo la cadena rota',t:'indep'}]},
  {label:['Palabra del Himno','No sale en el Himno'],headA:'📜 Sí sale',headB:'🚫 No sale',colA:'si',colB:'no',
   words:[{w:'lampo',t:'si'},{w:'antorcha',t:'no'},{w:'pendón',t:'si'},{w:'quetzal',t:'no'},{w:'eslabón',t:'si'},{w:'catracho',t:'no'},{w:'peñón',t:'si'},{w:'marimba',t:'no'},{w:'dombo',t:'si'},{w:'ceiba',t:'no'}]},
  {label:['Habla de Honduras','Habla de otro país'],headA:'🇭🇳 De Honduras',headB:'🌍 De otro país',colA:'hn',colB:'otro',
   words:[{w:'La muerte de Lempira',t:'hn'},{w:'La Revolución Francesa',t:'otro'},{w:'Las cinco estrellas de la Bandera',t:'hn'},{w:'La cabeza del rey consagrado',t:'otro'},{w:'El Peñol donde cayó el cacique',t:'hn'},{w:'El reclamo viril de Dantón',t:'otro'},{w:'El suelo bendito tras el monte',t:'hn'},{w:'El altar de la diosa Razón',t:'otro'}]},
];
let currentClassGroupIdx=0,clsSelectedWord=null;
function buildClass(){const group=classGroups[currentClassGroupIdx];document.getElementById('col-left-head').textContent=group.headA;document.getElementById('col-right-head').textContent=group.headB;const bank=document.getElementById('clsBank');bank.innerHTML='';clsSelectedWord=null;document.getElementById('items-left').innerHTML='';document.getElementById('items-right').innerHTML='';_shuffle([...group.words]).forEach(w=>{const el=document.createElement('div');el.className='wb-item';el.textContent=w.w;el.dataset.t=w.t;el.onclick=()=>{document.querySelectorAll('.wb-item').forEach(i=>i.classList.remove('sel-word'));el.classList.add('sel-word');clsSelectedWord=el;sfx('click');};bank.appendChild(el);});['col-left','col-right'].forEach(colId=>{const col=document.getElementById(colId);col.onclick=(e)=>{if(!clsSelectedWord||e.target.classList.contains('drop-item'))return;const targetId=colId==='col-left'?'items-left':'items-right';const wordsCol=document.getElementById(targetId);const item=document.createElement('div');item.className='drop-item';item.textContent=clsSelectedWord.textContent;item.dataset.t=clsSelectedWord.dataset.t;const original=clsSelectedWord;item.onclick=(ev)=>{ev.stopPropagation();if(clsSelectedWord!==null){col.click();}else{document.getElementById('clsBank').appendChild(original);original.classList.remove('sel-word');item.remove();if(typeof sfx==='function')sfx('click');}};wordsCol.appendChild(item);clsSelectedWord.remove();clsSelectedWord=null;sfx('click');};});}
function checkClass(){const remaining=document.querySelectorAll('#clsBank .wb-item').length;if(remaining>0){fb('fbCls','Mueve todas las palabras a las columnas primero.',false);return;}const group=classGroups[currentClassGroupIdx];let allOk=true;document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{const inLeft=el.parentElement.id==='items-left';const expectedType=inLeft?group.colA:group.colB;if(el.dataset.t===expectedType){el.classList.add('cls-ok');}else{el.classList.add('cls-no');allOk=false;}});if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);}if(allOk){fb('fbCls','¡Perfecto! +5 XP',true);sfx('fan');fin('s-clasifica');unlockAchievement('clasif_pro');}else{fb('fbCls','Hay errores. Marcados en rojo.',false);sfx('no');}}
function nextClassGroup(){sfx('click');currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length;buildClass();document.getElementById('fbCls').classList.remove('show');showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]);}
function resetClass(){sfx('click');buildClass();document.getElementById('fbCls').classList.remove('show');}

// ===================== IDENTIFICAR =====================
const idData=[
  {s:['Tu','bandera','es','un','lampo','de','cielo'],c:4,art:'La palabra que significa «resplandor»'},
  {s:['cinco','estrellas','de','pálido','azul'],c:0,art:'Cuántas estrellas nombra el coro'},
  {s:['el','audaz','navegante','te','halló'],c:2,art:'Así llama el Himno a Cristóbal Colón (una palabra)'},
  {s:['ya','flotaba','un','extraño','pendón'],c:4,art:'La palabra que significa «bandera»'},
  {s:['porque','envuelto','en','su','sangre','Lempira'],c:5,art:'El héroe que nombra la tercera estrofa'},
  {s:['el','mandato','imperioso','del','amo'],c:4,art:'Así llama el Himno al poder colonial'},
  {s:['indignado','rugía','un','León'],c:3,art:'La figura que representa a Francia'},
  {s:['destrozado','el','infame','eslabón'],c:3,art:'Lo que Honduras rompió al independizarse'},
];
let idIdx=0,idDone=false;
function showId(){idDone=false;if(idIdx>=idData.length){document.getElementById('idSent').innerHTML='🎉 ¡Completado!';fin('s-identifica');unlockAchievement('id_master');return;}const d=idData[idIdx];document.getElementById('idProg').textContent=`Oración ${idIdx+1} de ${idData.length}`;document.getElementById('idInfo').textContent=`Busca: ${d.art}`;const sent=document.getElementById('idSent');sent.innerHTML='';d.s.forEach((w,i)=>{const span=document.createElement('span');span.className='id-word';span.textContent=w+' ';span.onclick=()=>checkId(i,span);sent.appendChild(span);});}
function checkId(i,span){if(idDone)return;document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected'));span.classList.add('selected');if(i===idData[idIdx].c){idDone=true;span.classList.add('id-ok');fb('fbId','¡Correcto! +5 XP',true);if(!xpTracker.id.has(idIdx)){xpTracker.id.add(idIdx);pts(5);}sfx('ok');}else{span.classList.add('id-no');fb('fbId','Ese no es el término solicitado.',false);sfx('no');}}
function nextId(){sfx('click');idIdx++;showId();document.getElementById('fbId').classList.remove('show');}
function resetId(){sfx('click');idIdx=0;showId();document.getElementById('fbId').classList.remove('show');}

// ===================== COMPLETA =====================
const cmpData=[
  {s:'Tu bandera es un ___ de cielo.',opts:['lampo','manto','campo'],c:0},
  {s:'Cinco estrellas de ___ azul.',opts:['vivo','pálido','claro'],c:1},
  {s:'India virgen y hermosa ___.',opts:['cantabas','soñabas','dormías'],c:2},
  {s:'Porque envuelto en su sangre ___.',opts:['Lempira','Morazán','Valle'],c:0},
  {s:'Por tres siglos tus hijos ___.',opts:['callaron','oyeron','lucharon'],c:1},
  {s:'Era Francia, la libre, la ___.',opts:['valiente','fuerte','heroica'],c:2},
  {s:'Destrozado el infame ___.',opts:['eslabón','pendón','peñón'],c:0},
  {s:'Pero todos caerán con ___.',opts:['valor','honor','dolor'],c:1},
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
const routeSets = ['coro', 'e4', 'e7'].map(function (c) {
  /* Del dato, por lo mismo que el Lab. Se ordenan los OCHO versos: es la
     forma de estudiar una estrofa que el maestro ya usa en el pizarrón. */
  const e = himnoPorClave(c);
  return { label: 'Ordena los versos · ' + e.titulo, steps: e.versos.slice() };
});
let currentRouteIdx=0,routeItems=[];
function buildRoute(){routeItems=_shuffle([...routeSets[currentRouteIdx].steps]);renderRoute();const fbEl=document.getElementById('fbRoute');if(fbEl)fbEl.classList.remove('show');}
function renderRoute(){const list=document.getElementById('routeList');if(!list)return;list.innerHTML='';routeItems.forEach((step,i)=>{const div=document.createElement('div');div.className='sort-item';div.innerHTML=`<div class="sort-arrows"><button class="sort-arrow" onclick="routeMove(${i},-1)"${i===0?' disabled':''}>▲</button><button class="sort-arrow" onclick="routeMove(${i},1)"${i===routeItems.length-1?' disabled':''}>▼</button></div><div class="sort-step-num">${i+1}.</div><div class="sort-item-txt">${step}</div>`;list.appendChild(div);});}
function routeMove(idx,dir){sfx('click');const ni=idx+dir;if(ni<0||ni>=routeItems.length)return;[routeItems[idx],routeItems[ni]]=[routeItems[ni],routeItems[idx]];renderRoute();}
function checkRoute(){const correct=routeSets[currentRouteIdx].steps;const isOk=routeItems.every((s,i)=>s===correct[i]);if(isOk){fb('fbRoute','¡Perfecto! Orden correcto. +4 XP',true);if(!xpTracker.wgt.has('route_'+currentRouteIdx)){xpTracker.wgt.add('route_'+currentRouteIdx);pts(4);}sfx('fan');fin('s-widgets');unlockAchievement('widgets_master');}else{fb('fbRoute','Hay pasos fuera de orden. Revisa el arreglo.',false);sfx('no');}}
function nextRoute(){sfx('click');currentRouteIdx=(currentRouteIdx+1)%routeSets.length;buildRoute();showToast('🔄 Secuencia: '+routeSets[currentRouteIdx].label);}

// Widget 2: Identifica el concepto
const neuronPartes=[
  {desc:'«Tu bandera es un lampo de cielo»',ans:'El coro',opts:['El coro','Primera estrofa','Cuarta estrofa','Séptima estrofa']},
  {desc:'«India virgen y hermosa dormías»',ans:'Primera estrofa',opts:['Primera estrofa','El coro','Tercera estrofa','Sexta estrofa']},
  {desc:'«ya flotaba un extraño pendón»',ans:'Segunda estrofa',opts:['Segunda estrofa','Primera estrofa','Cuarta estrofa','El coro']},
  {desc:'«porque envuelto en su sangre Lempira»',ans:'Tercera estrofa',opts:['Tercera estrofa','Segunda estrofa','Quinta estrofa','Séptima estrofa']},
  {desc:'«Por tres siglos tus hijos oyeron»',ans:'Cuarta estrofa',opts:['Cuarta estrofa','Tercera estrofa','Sexta estrofa','El coro']},
  {desc:'«al reclamo viril de Dantón»',ans:'Quinta estrofa',opts:['Quinta estrofa','Cuarta estrofa','Segunda estrofa','Sexta estrofa']},
  {desc:'«destrozado el infame eslabón»',ans:'Sexta estrofa',opts:['Sexta estrofa','Quinta estrofa','Séptima estrofa','Tercera estrofa']},
  {desc:'«pero todos caerán con honor»',ans:'Séptima estrofa',opts:['Séptima estrofa','Sexta estrofa','El coro','Primera estrofa']},
];
let neuronIdx=0,neuronDone=false;
function showNeuron(){neuronDone=false;if(neuronIdx>=neuronPartes.length){const el=document.getElementById('neuronDesc');if(el)el.textContent='🎉 ¡Ya reconoces de qué parte es cada verso!';const opts=document.getElementById('neuronOpts');if(opts)opts.innerHTML='';fin('s-widgets');return;}const d=neuronPartes[neuronIdx];const prog=document.getElementById('neuronProg');if(prog)prog.textContent=`Pista ${neuronIdx+1} de ${neuronPartes.length}`;const desc=document.getElementById('neuronDesc');if(desc)desc.textContent=d.desc;const opts=document.getElementById('neuronOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=opt;b.onclick=()=>checkNeuron(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuron');if(fbEl)fbEl.classList.remove('show');}
function checkNeuron(opt,btn,d){if(neuronDone)return;neuronDone=true;document.querySelectorAll('#neuronOpts .cmp-opt').forEach(b=>{if(b.textContent===d.ans)b.classList.add('correct');else if(b===btn&&b.textContent!==d.ans)b.classList.add('wrong');});const isOk=opt===d.ans;if(isOk){fb('fbNeuron','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuron_'+neuronIdx)){xpTracker.wgt.add('neuron_'+neuronIdx);pts(3);}sfx('ok');}else{fb('fbNeuron','La respuesta correcta es: '+d.ans,false);sfx('no');}}
function nextNeuron(){sfx('click');neuronIdx++;showNeuron();}
function resetNeuron(){sfx('click');neuronIdx=0;showNeuron();}

// Widget 3: Concepto → Significado
const neuroPairs=[
  {trans:'«un lampo de cielo»',func:'Un destello del cielo: el azul de la Bandera',opts:['Un destello del cielo: el azul de la Bandera','Una lámpara encendida','Un pedazo de tela azul','Una nube de tormenta']},
  {trans:'«por un bloque de nieve cruzado»',func:'La franja blanca que cruza la Bandera',opts:['La franja blanca que cruza la Bandera','Un cerro nevado del país','El hielo del mar','Una nube blanca']},
  {trans:'«el audaz navegante»',func:'Cristóbal Colón',opts:['Cristóbal Colón','Francisco Morazán','El cacique Lempira','Un pescador de la costa']},
  {trans:'«un extraño pendón»',func:'La bandera de otro país ondeando aquí',opts:['La bandera de otro país ondeando aquí','Una nube con forma rara','Un barco desconocido','Un ave que nadie conocía']},
  {trans:'«el mandato imperioso del amo»',func:'Las órdenes del poder colonial',opts:['Las órdenes del poder colonial','El consejo de un maestro','La ley de Honduras','El grito de Lempira']},
  {trans:'«el infame eslabón»',func:'La cadena de la opresión, que se rompió',opts:['La cadena de la opresión, que se rompió','Una joya del rey de España','Un puente sobre el río','El ancla de un barco']},
];
let neuroIdx=0,neuroDone=false;
function showNeuro(){neuroDone=false;if(neuroIdx>=neuroPairs.length){const el=document.getElementById('neuroTrans');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('neuroOpts');if(opts)opts.innerHTML='';return;}const d=neuroPairs[neuroIdx];const prog=document.getElementById('neuroProg');if(prog)prog.textContent=`${neuroIdx+1} de ${neuroPairs.length}`;const trans=document.getElementById('neuroTrans');if(trans)trans.textContent=d.trans;const opts=document.getElementById('neuroOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkNeuro(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuro');if(fbEl)fbEl.classList.remove('show');}
function checkNeuro(opt,btn,d){if(neuroDone)return;neuroDone=true;document.querySelectorAll('#neuroOpts .qz-opt').forEach(b=>{if(b.textContent===d.func)b.classList.add('correct');else if(b===btn&&b.textContent!==d.func)b.classList.add('wrong');});const isOk=opt===d.func;if(isOk){fb('fbNeuro','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuro_'+neuroIdx)){xpTracker.wgt.add('neuro_'+neuroIdx);pts(3);}sfx('ok');}else{fb('fbNeuro','Correcto: '+d.func,false);sfx('no');}setTimeout(()=>{neuroIdx++;showNeuro();},1800);}
function resetNeuro(){sfx('click');neuroIdx=0;showNeuro();}

// Widget 4: Fuente → ¿Renovable o no renovable?
const enfermedadData=[
  {disease:'Cuenta la historia de Honduras',characteristic:'Las seis primeras',opts:['Las seis primeras','La séptima']},
  {disease:'Es una promesa para el futuro',characteristic:'La séptima',opts:['La séptima','Las seis primeras']},
  {disease:'Habla de la llegada de Colón',characteristic:'Las seis primeras',opts:['Las seis primeras','La séptima']},
  {disease:'Dice «marcharemos, ¡oh patria!, a la muerte»',characteristic:'La séptima',opts:['La séptima','Las seis primeras']},
  {disease:'Cuenta la muerte de Lempira',characteristic:'Las seis primeras',opts:['Las seis primeras','La séptima']},
  {disease:'Se canta en el acto del lunes',characteristic:'La séptima',opts:['La séptima','Las seis primeras']},
  {disease:'Habla de la Revolución Francesa',characteristic:'Las seis primeras',opts:['Las seis primeras','La séptima']},
  {disease:'Jura defender la santa bandera',characteristic:'La séptima',opts:['La séptima','Las seis primeras']},
];
let enferIdx=0,enferDone=false;
function showEnfer(){enferDone=false;if(enferIdx>=enfermedadData.length){const el=document.getElementById('enferDisease');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('enferOpts');if(opts)opts.innerHTML='';return;}const d=enfermedadData[enferIdx];const prog=document.getElementById('enferProg');if(prog)prog.textContent=`${enferIdx+1} de ${enfermedadData.length}`;const dis=document.getElementById('enferDisease');if(dis)dis.textContent=d.disease;const opts=document.getElementById('enferOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkEnfer(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbEnfer');if(fbEl)fbEl.classList.remove('show');}
function checkEnfer(opt,btn,d){if(enferDone)return;enferDone=true;document.querySelectorAll('#enferOpts .qz-opt').forEach(b=>{if(b.textContent===d.characteristic)b.classList.add('correct');else if(b===btn&&b.textContent!==d.characteristic)b.classList.add('wrong');});const isOk=opt===d.characteristic;if(isOk){fb('fbEnfer','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('enfer_'+enferIdx)){xpTracker.wgt.add('enfer_'+enferIdx);pts(3);}sfx('ok');}else{fb('fbEnfer','Correcto: '+d.characteristic,false);sfx('no');}setTimeout(()=>{enferIdx++;showEnfer();},1800);}
function resetEnfer(){sfx('click');enferIdx=0;showEnfer();}

// ===================== RETO FINAL =====================
const retoPairs=[
  {label:['Del coro','De una estrofa'],btnA:'🎼 Coro',btnB:'📖 Estrofa',colA:'coro',colB:'est',
   words:[{w:'un lampo de cielo',t:'coro'},{w:'India virgen y hermosa',t:'est'},{w:'cinco estrellas',t:'coro'},{w:'en su sangre Lempira',t:'est'},{w:'un astro de nítida luz',t:'coro'},{w:'Por tres siglos',t:'est'},{w:'ondas bravías',t:'coro'},{w:'la diosa Razón',t:'est'},{w:'un mar rumoroso',t:'coro'},{w:'el infame eslabón',t:'est'}]},
  {label:['Antes de la Independencia','Independencia o después'],btnA:'⛓️ Antes',btnB:'🕊️ Después',colA:'antes',colB:'desp',
   words:[{w:'Llega Colón',t:'antes'},{w:'Se rompe el eslabón',t:'desp'},{w:'Muere Lempira',t:'antes'},{w:'Se va la colonia',t:'desp'},{w:'Tres siglos de amo',t:'antes'},{w:'Se jura la Bandera',t:'desp'},{w:'Ondea un extraño pendón',t:'antes'},{w:'Honduras se alza',t:'desp'}]},
  {label:['Está en el Himno','No está'],btnA:'📜 Sí está',btnB:'🚫 No está',colA:'si',colB:'no',
   words:[{w:'lampo',t:'si'},{w:'antorcha',t:'no'},{w:'pendón',t:'si'},{w:'quetzal',t:'no'},{w:'eslabón',t:'si'},{w:'catracho',t:'no'},{w:'peñón',t:'si'},{w:'marimba',t:'no'},{w:'dombo',t:'si'},{w:'ceiba',t:'no'}]},
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
  {s:'El coro del Himno describe la Bandera y el Escudo Nacional.',type:'El coro'},
  {s:'La primera estrofa cuenta la llegada de Cristóbal Colón en 1502.',type:'Primera estrofa'},
  {s:'En la segunda estrofa ya ondea un extraño pendón sobre nuestro cielo.',type:'Segunda estrofa'},
  {s:'La tercera estrofa cuenta que Lempira cayó envuelto en su sangre.',type:'Tercera estrofa'},
  {s:'La cuarta estrofa habla de los tres siglos de dominio colonial.',type:'Cuarta estrofa'},
  {s:'En la quinta estrofa el León resulta ser Francia y su Revolución.',type:'Quinta estrofa'},
  {s:'La sexta estrofa cuenta la Independencia y el eslabón destrozado.',type:'Sexta estrofa'},
  {s:'La séptima estrofa jura defender la santa bandera hasta la muerte.',type:'Séptima estrofa'},
  {s:'La letra del Himno Nacional la escribió Augusto C. Coello.',type:'Augusto C. Coello'},
  {s:'La música del Himno Nacional la compuso Carlos Hartling.',type:'Carlos Hartling'},
];
const classifyTaskDB=[
  {w:'El coro',gen:'Describe la Bandera y el Escudo',n:'No cuenta historia',g:'Se canta antes y después de la estrofa',t:'Las cinco estrellas son las naciones de Centroamérica'},
  {w:'Primera estrofa',gen:'La llegada de Cristóbal Colón',n:'Época precolombina y 1502',g:'Empieza «India virgen y hermosa dormías»',t:'Llama a Colón «el audaz navegante»'},
  {w:'Tercera estrofa',gen:'La resistencia y la muerte de Lempira',n:'La conquista, hacia 1537',g:'Empieza «Era inútil que el indio, tu amado»',t:'Dice que el lugar de su sepulcro es ignorado'},
  {w:'Cuarta estrofa',gen:'Los tres siglos de dominio colonial',n:'La colonia, de 1502 a 1821',g:'Empieza «Por tres siglos tus hijos oyeron»',t:'Termina con el León que ruge: es Francia'},
  {w:'Quinta estrofa',gen:'La Revolución Francesa',n:'Francia, 1789',g:'Empieza «Era Francia, la libre, la heroica»',t:'Nombra a Dantón y a la diosa Razón'},
  {w:'Sexta estrofa',gen:'La Independencia de Centroamérica',n:'15 de septiembre de 1821',g:'Empieza «Tú también, ¡oh mi patria!, te alzaste»',t:'El «infame eslabón» es la cadena rota'},
  {w:'Séptima estrofa',gen:'El juramento de defender la patria',n:'No es historia: es promesa',g:'Empieza «Por guardar ese emblema divino»',t:'Es la que se canta en los actos escolares'},
];
const completeTaskDB=[
  {s:'Tu bandera es un ___ de cielo.',opts:['lampo','manto','campo'],ans:'lampo'},
  {s:'Cinco estrellas de ___ azul.',opts:['vivo','pálido','claro'],ans:'pálido'},
  {s:'India virgen y hermosa ___.',opts:['cantabas','dormías','soñabas'],ans:'dormías'},
  {s:'Ya flotaba un extraño ___.',opts:['pendón','peñón','eslabón'],ans:'pendón'},
  {s:'Porque envuelto en su sangre ___.',opts:['Lempira','Morazán','Valle'],ans:'Lempira'},
  {s:'Por tres siglos tus hijos ___.',opts:['callaron','oyeron','lucharon'],ans:'oyeron'},
  {s:'Era ___, la libre, la heroica.',opts:['España','Francia','Honduras'],ans:'Francia'},
  {s:'Destrozado el infame ___.',opts:['eslabón','pendón','peñón'],ans:'eslabón'},
  {s:'Pero todos caerán con ___.',opts:['valor','honor','dolor'],ans:'honor'},
];
const explainQuestions=[
  {q:'¿Quiénes hicieron el Himno Nacional y cuándo se declaró oficial?',ans:'La letra es de Augusto C. Coello, escritor hondureño, y la música de Carlos Hartling, músico alemán. Se compuso en 1903, se cantó por primera vez el 15 de septiembre de 1904 y el gobierno lo declaró oficial en 1915.'},
  {q:'¿Cómo está formado el Himno Nacional y qué se canta en los actos?',ans:'Tiene un coro y siete estrofas de ocho versos cada una, o sea 64 versos. En los actos escolares se canta el coro, la séptima estrofa y otra vez el coro.'},
    /* El coro NO se escribe aquí: sale de js/data/himno.js. Esta es la CLAVE
     con la que el maestro corrige lo que el alumno copió de memoria; si se
     quedara con una letra vieja, le marcaría mal al que la escribió bien. */
  {q:'Escribe el coro del Himno Nacional y explica de qué habla.',ans:'«'+himnoTexto('coro').replace(/\n/g,' ')+'» Describe la Bandera (las franjas azules y la blanca, las cinco estrellas de la antigua Federación de Centroamérica) y después el Escudo (el mar que lo rodea, el volcán entre las torres y el sol naciente, que es el astro de nítida luz). No cuenta historia: pinta los dos símbolos que se ven.'},
  {q:'Explica la tercera estrofa del Himno Nacional.',ans:'Cuenta la resistencia indígena contra la conquista y la muerte de Lempira, que cayó envuelto en su sangre hacia 1537. Y dice que de aquella hazaña no quedó ni la tumba: solo la leyenda y el perfil de un peñón, el Peñol de Cerquín.'},
  {q:'Explica la cuarta estrofa del Himno Nacional.',ans:'Habla de los tres siglos de dominio colonial, en que los hondureños obedecían al amo y reclamaban sin ser escuchados. Al final aparece una esperanza lejana: un León que ruge indignado al otro lado del Atlántico. Ese León es Francia.'},
  {q:'Explica la quinta estrofa del Himno Nacional.',ans:'Dice quién era el León de la estrofa anterior: Francia. Cuenta la Revolución Francesa de 1789, cuando el pueblo despertó llamado por Dantón, mandó a la muerte al rey y levantó el altar de la diosa Razón. De ahí salieron las ideas de libertad que llegaron a América.'},
  {q:'Explica la sexta estrofa del Himno Nacional.',ans:'Es la estrofa de la Independencia. Honduras despierta de su sueño servil, le enseña al mundo el infame eslabón destrozado, que es la cadena rota, y la colonia se pierde detrás de las montañas como un ave de negro plumaje. Ocurrió el 15 de septiembre de 1821.'},
  {q:'¿Por qué la séptima estrofa es distinta de las seis primeras?',ans:'Porque las seis primeras cuentan la historia de Honduras en orden, y la séptima no cuenta el pasado: es una promesa. Jura defender la Bandera hasta la muerte y caer con honor. Por eso es la que se canta en los actos.'},
  {q:'Escribe qué significan estas palabras del Himno: lampo, pendón, eslabón y peñón.',ans:'Lampo es un resplandor o destello de luz. Pendón es una bandera o estandarte. Eslabón es cada anillo de una cadena, y en el Himno representa la opresión colonial. Peñón es un monte de piedra, el lugar donde cayó Lempira.'},
];
let ansVisible=false;
function genTask(){sfx('click');const type=document.getElementById('tgType').value;const count=parseInt(document.getElementById('tgCount').value);ansVisible=false;const out=document.getElementById('tgOut');out.innerHTML='';if(type==='identify')genIdentifyTask(out,count);else if(type==='classify')genClassifyTask(out,count);else if(type==='complete')genCompleteTask(out,count);else if(type==='explain')genExplainTask(out,count);fin('s-tareas');}
function _instrBlock(out,title,lines){const ib=document.createElement('div');ib.className='tg-instruction-block';ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join('');out.appendChild(ib);}
function genIdentifyTask(out,count){_instrBlock(out,'Instrucción',['Copia en tu cuaderno; subraya, colorea o encierra el concepto indicado en cada oración. Escribe al lado a qué símbolo, prócer o fecha cívica se refiere.','<strong>Ejemplo:</strong> La Bandera Nacional lleva cinco estrellas en la franja blanca. → <span style="color:var(--jade);font-weight:700;">cinco estrellas</span>']);_pick(identifyTaskDB,Math.min(count,identifyTaskDB.length)).forEach((item,i)=>{const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.type}</div></div>`;out.appendChild(div);});}
function genClassifyTask(out,count){_instrBlock(out,'Instrucción',['Copia la siguiente tabla en tu cuaderno. Para cada parte del Himno, completa de qué trata, cuándo pasa lo que cuenta, cómo empieza y un dato que la distinga.']);const items=_pick(classifyTaskDB,Math.min(count,classifyTaskDB.length));const wrap=document.createElement('div');wrap.style.overflowX='auto';const th=(t,extra='')=>`<th style="padding:0.3rem 0.4rem;border:1px solid var(--border);font-size:0.72rem;text-align:center;${extra}">${t}</th>`;let html=`<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:520px;"><thead><tr style="background:var(--pri-gl);">${th('Parte del Himno','text-align:left;')}${th('De qué trata')}${th('Cuándo pasa')}${th('Cómo empieza')}${th('Dato')}</tr></thead><tbody>`;items.forEach(it=>{html+=`<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td>`+Array(4).fill(`<td style="padding:0.4rem;border:1px solid var(--border);min-width:50px;"></td>`).join('')+'</tr>';});html+='</tbody></table>';wrap.innerHTML=html;out.appendChild(wrap);const ans=document.createElement('div');ans.className='tg-answer';ans.style.marginTop='0.8rem';ans.innerHTML='<strong>✅ Respuestas:</strong><br>'+items.map(it=>`<strong>${it.w}:</strong> Qué es: ${it.gen} | Clase: ${it.n} | Desde cuándo: ${it.g} | Dato: ${it.t}`).join('<br>');out.appendChild(ans);}
function genCompleteTask(out,count){_instrBlock(out,'Instrucción',['Copia y resuelve en tu cuaderno. Cada oración tiene un espacio ___. Elige y escribe la opción correcta.']);const pool=_shuffle([...completeTaskDB]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';const sent=item.s.replace('___','<span class="tg-blank" style="min-width:90px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${sent}</strong><div style="margin-top:0.4rem;font-size:0.82rem;color:var(--gray);">📝 Opciones: <strong>${item.opts.join(' | ')}</strong></div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function genExplainTask(out,count){_instrBlock(out,'Instrucción',['Copia las siguientes preguntas en tu cuaderno y responde cada una de forma clara y completa.']);const pool=_shuffle([...explainQuestions]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.3rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function toggleAns(){ansVisible=!ansVisible;document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none');sfx('click');}

// ===================== SOPA DE LETRAS =====================
const sopaSets=[
  {size:10,grid:[
    ['K','H','X','M','W','Y','Y','I','C','N'],
    ['W','O','X','B','S','W','V','Q','C','B'],
    ['O','P','H','K','L','F','O','D','O','S'],
    ['M','O','D','A','Z','O','L','O','R','E'],
    ['I','R','M','V','Q','D','C','R','T','F'],
    ['K','P','M','N','Q','P','A','O','S','Q'],
    ['O','N','E','T','J','A','N','C','A','X'],
    ['E','S','T','R','E','L','L','A','Q','H'],
    ['W','H','G','O','U','E','V','E','I','N'],
    ['P','T','W','L','V','J','J','U','A','E']
  ],words:[
    {w:'LAMPO',cells:[[2,4],[3,3],[4,2],[5,1],[6,0]]},
    {w:'NIEVE',cells:[[8,9],[8,8],[8,7],[8,6],[8,5]]},
    {w:'ESTRELLA',cells:[[7,0],[7,1],[7,2],[7,3],[7,4],[7,5],[7,6],[7,7]]},
    {w:'VOLCAN',cells:[[1,6],[2,6],[3,6],[4,6],[5,6],[6,6]]},
    {w:'ASTRO',cells:[[6,8],[5,8],[4,8],[3,8],[2,8]]},
    {w:'CORO',cells:[[6,7],[5,7],[4,7],[3,7]]}
  ]},
  {size:10,grid:[
    ['C','D','T','G','I','C','C','Z','N','L'],
    ['O','N','G','N','V','W','E','K','Z','E'],
    ['E','O','S','I','X','J','S','F','Q','M'],
    ['L','D','L','L','Z','Q','T','P','L','P'],
    ['L','N','N','T','O','T','R','C','Y','I'],
    ['O','E','Q','R','N','B','O','H','F','R'],
    ['Z','P','B','A','M','T','F','W','W','A'],
    ['J','E','G','H','I','N','A','M','M','X'],
    ['E','F','L','E','H','I','S','L','N','E'],
    ['V','X','Z','Z','C','K','G','P','U','J']
  ],words:[
    {w:'COELLO',cells:[[0,0],[1,0],[2,0],[3,0],[4,0],[5,0]]},
    {w:'HARTLING',cells:[[7,3],[6,3],[5,3],[4,3],[3,3],[2,3],[1,3],[0,3]]},
    {w:'ESTROFA',cells:[[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6]]},
    {w:'LEMPIRA',cells:[[0,9],[1,9],[2,9],[3,9],[4,9],[5,9],[6,9]]},
    {w:'PENDON',cells:[[6,1],[5,1],[4,1],[3,1],[2,1],[1,1]]},
    {w:'HIMNO',cells:[[8,4],[7,4],[6,4],[5,4],[4,4]]}
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
  {q:'La letra del Himno Nacional es de Augusto C. Coello.',a:true},
  {q:'La música del Himno Nacional la compuso un músico alemán, Carlos Hartling.',a:true},
  {q:'El Himno Nacional tiene un coro y siete estrofas.',a:true},
  {q:'Cada estrofa del Himno tiene cinco versos.',a:false},
  {q:'En los actos escolares se canta el coro, la séptima estrofa y otra vez el coro.',a:true},
  {q:'El coro del Himno describe la Bandera y el Escudo.',a:true},
  {q:'La primera estrofa habla de la Independencia de Centroamérica.',a:false},
  {q:'La primera estrofa se refiere a la llegada de Cristóbal Colón.',a:true},
  {q:'El «extraño pendón» de la segunda estrofa es la bandera de otro país.',a:true},
  {q:'La tercera estrofa cuenta la muerte de Lempira.',a:true},
  {q:'Del sepulcro de Lempira se conoce el lugar exacto.',a:false},
  {q:'La cuarta estrofa habla de los tres siglos de dominio colonial.',a:true},
  {q:'El León que ruge indignado en la cuarta estrofa es España.',a:false},
  {q:'La quinta estrofa se refiere a la Revolución Francesa.',a:true},
  {q:'Dantón fue un orador de la Revolución Francesa.',a:true},
  {q:'La sexta estrofa cuenta la Independencia de Honduras.',a:true},
  {q:'El «infame eslabón» representa la cadena de la opresión colonial.',a:true},
  {q:'La séptima estrofa cuenta un hecho del pasado.',a:false},
  {q:'La séptima estrofa es el juramento de defender la Bandera.',a:true},
  {q:'El Himno Nacional se declaró oficial en 1915.',a:true},
];
const evalMCBank=[
  {q:'¿Quién escribió la letra del Himno Nacional de Honduras?',o:['a) Carlos Hartling','b) Augusto C. Coello','c) Francisco Morazán','d) José Cecilio del Valle'],a:1},
  {q:'¿Quién compuso la música del Himno Nacional?',o:['a) Carlos Hartling','b) Augusto C. Coello','c) José Trinidad Reyes','d) Ramón Rosa'],a:0},
  {q:'¿Cómo está formado el Himno Nacional?',o:['a) Tres estrofas y un coro','b) Solo siete estrofas','c) Un coro y siete estrofas','d) Un coro y cinco estrofas'],a:2},
  {q:'¿Cuántos versos tiene cada estrofa del Himno?',o:['a) Cuatro','b) Seis','c) Diez','d) Ocho'],a:3},
  {q:'¿Qué describe el coro del Himno Nacional?',o:['a) La Bandera y el Escudo','b) La Independencia','c) La conquista española','d) Los próceres del país'],a:0},
  {q:'«Cinco estrellas de pálido azul» se refiere a:',o:['a) Los cinco departamentos del sur','b) Las cinco naciones de la antigua Federación de Centroamérica','c) Los cinco próceres','d) Las cinco estrofas cantadas'],a:1},
  {q:'¿A qué hecho se refiere la primera estrofa?',o:['a) A la muerte de Lempira','b) A la Independencia','c) A la llegada de Cristóbal Colón','d) A la Revolución Francesa'],a:2},
  {q:'En la segunda estrofa, ¿qué es «un extraño pendón»?',o:['a) Un ave desconocida','b) Una nube con forma rara','c) Un barco perdido','d) La bandera de otro país'],a:3},
  {q:'¿Qué cuenta la tercera estrofa?',o:['a) La resistencia y la muerte de Lempira','b) La llegada de los españoles','c) La firma del Acta de Independencia','d) El juramento a la Bandera'],a:0},
  {q:'Según la tercera estrofa, del sepulcro de Lempira se sabe que:',o:['a) Está en la capital','b) Su lugar es ignorado','c) Está en Copán','d) Se perdió en el mar'],a:1},
  {q:'¿Cuántos siglos de dominio colonial nombra la cuarta estrofa?',o:['a) Dos','b) Cinco','c) Tres','d) Cuatro'],a:2},
  {q:'En la cuarta estrofa, el León que ruge indignado representa a:',o:['a) España','b) Inglaterra','c) Honduras','d) Francia'],a:3},
  {q:'¿Qué acontecimiento cuenta la quinta estrofa?',o:['a) La Revolución Francesa','b) La conquista de Honduras','c) La llegada de Colón','d) La Reforma Liberal'],a:0},
  {q:'¿Qué representa el «infame eslabón» de la sexta estrofa?',o:['a) Una joya del rey','b) La cadena de la opresión colonial','c) El ancla de un barco','d) Un puente sobre el río'],a:1},
  {q:'¿Por qué la séptima estrofa es la que se canta en los actos?',o:['a) Porque es la más corta','b) Porque la escribió Hartling','c) Porque es el juramento de defender la patria','d) Porque cuenta la llegada de Colón'],a:2},
];
const evalCPBank=[
  {q:'Tu bandera es un ___ de cielo.',a:'lampo'},
  {q:'Por un bloque de ___ cruzado.',a:'nieve'},
  {q:'Cinco estrellas de ___ azul.',a:'pálido'},
  {q:'India virgen y hermosa ___.',a:'dormías'},
  {q:'El audaz ___ te halló.',a:'navegante'},
  {q:'Ya flotaba un extraño ___.',a:'pendón'},
  {q:'Porque envuelto en su sangre ___.',a:'Lempira'},
  {q:'Y el severo perfil de un ___.',a:'peñón'},
  {q:'Por tres ___ tus hijos oyeron.',a:'siglos'},
  {q:'Indignado rugía un ___.',a:'León'},
  {q:'Era ___, la libre, la heroica.',a:'Francia'},
  {q:'Al reclamo viril de ___.',a:'Dantón'},
  {q:'Destrozado el infame ___.',a:'eslabón'},
  {q:'Por guardar ese ___ divino.',a:'emblema'},
  {q:'Pero todos caerán con ___.',a:'honor'},
];
const evalPRBank=[
  {term:'El coro',def:'Describe la Bandera y el Escudo'},
  {term:'Primera estrofa',def:'La llegada de Cristóbal Colón'},
  {term:'Segunda estrofa',def:'El extraño pendón sobre nuestro cielo'},
  {term:'Tercera estrofa',def:'La resistencia y la muerte de Lempira'},
  {term:'Cuarta estrofa',def:'Los tres siglos de colonia'},
  {term:'Quinta estrofa',def:'La Revolución Francesa y Dantón'},
  {term:'Sexta estrofa',def:'La Independencia y el eslabón roto'},
  {term:'Séptima estrofa',def:'El juramento de defender la Bandera'},
  {term:'Augusto C. Coello',def:'Escribió la letra del Himno'},
  {term:'Carlos Hartling',def:'Compuso la música del Himno'},
  {term:'Lampo',def:'Resplandor, destello de luz'},
  {term:'Pendón',def:'Bandera o estandarte'},
  {term:'Eslabón',def:'Anillo de una cadena'},
  {term:'Peñón',def:'Monte de piedra donde cayó Lempira'},
  {term:'1915',def:'Año en que se declaró oficial'},
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

function genEval(){sfx('click');_evalFormaSelector(); const _selF = document.getElementById('evalFormaSel'); if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10))); const cf = evalFormNum; const rng = _evalRng(cf); window._currentEvalForm=cf;evalFormNum = (evalFormNum % EVAL_FORMAS) + 1; _evalFormaSelector();saveProgress();document.getElementById('eval-screen-title').textContent=`🎓 Evaluación Final · Forma ${cf} · El Himno Nacional de Honduras`;evalAnsVisible=false;const out=document.getElementById('evalOut');out.innerHTML='';const bar=document.createElement('div');bar.className='eval-score-bar';bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje · 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25 pts</span><span class="eval-score-pill esp-tf">V/F 25 pts</span><span class="eval-score-pill esp-mc">Selección 25 pts</span><span class="eval-score-pill esp-pr">Pareados 25 pts</span></div>`;out.appendChild(bar);const cpItems=_pickF(evalCPBank,5, rng);const s1=document.createElement('div');s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';cpItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='cp';d.dataset.evalIndex=i;const qHtml=item.q.replace('___',`<input class="eval-cp-input" type="text" data-cp="${i}" autocomplete="off">`);d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbCp${i}" aria-live="polite"></div>`;s1.appendChild(d);});out.appendChild(s1);const tfItems=_pickF(evalTFBank,5, rng);const s2=document.createElement('div');s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';tfItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='tf';d.dataset.evalIndex=i;d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="true"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="false"> Falso</label></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbTf${i}" aria-live="polite"></div>`;s2.appendChild(d);});out.appendChild(s2);const mcItems=_pickF(evalMCBank,5, rng);const s3=document.createElement('div');s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';mcItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='mc';d.dataset.evalIndex=i;const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join('');d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbMc${i}" aria-live="polite"></div>`;s3.appendChild(d);});out.appendChild(s3);const prItems=_pickF(evalPRBank,5, rng);const shuffledDefs=_shuffleF(prItems, rng);const letters=['A','B','C','D','E'];const s4=document.createElement('div');s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';const matchCard=document.createElement('div');matchCard.className='eval-item';let colLeft='<div class="eval-match-col"><h4>📌 Términos</h4>';prItems.forEach((item,i)=>{colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> <select class="eval-match-select" data-pr="${i}" aria-label="Respuesta pareada ${i+16}"><option value="">—</option>${letters.map(l=>`<option value="${l}">${l}</option>`).join('')}</select> ${item.term}</div>`;});colLeft+='</div>';let colRight='<div class="eval-match-col"><h4>🔑 Definiciones</h4>';shuffledDefs.forEach((item,i)=>{colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`;});colRight+='</div>';const ansKey=prItems.map((item,i)=>{const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)];return`${i+16}→${letter}`;}).join(' · ');matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div><div class="eval-item-feedback" id="evalFbPr" aria-live="polite"></div>`;s4.appendChild(matchCard);out.appendChild(s4);window._evalPrintData={tf:tfItems,mc:mcItems,cp:cpItems,pr:{terms:prItems,shuffledDefs,letters}};const autoPanel=document.createElement('div');autoPanel.id='evalAutoResult';autoPanel.className='eval-auto-result';autoPanel.innerHTML='<strong>🧮 Evaluación interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato original sin respuestas digitadas.';out.appendChild(autoPanel);fin('s-evaluacion');}
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación El Himno Nacional de Honduras · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.12rem 0.4rem;margin:0.22rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #3f6212;background:#f2f7e6;color:#3f6212;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#3f6212;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #3f6212;height:12px;}.obt-pct{white-space:nowrap;}.qn{font-weight:700;min-width:22px;flex-shrink:0;}.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:40px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.18rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.14rem 0.35rem;margin-bottom:0.1rem;break-inside:avoid;page-break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.3;display:flex;gap:0.28rem;margin-bottom:0.07rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.1rem 0.5rem;}.mc-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:0.04rem 0.15rem;margin-left:0.8rem;}.mc-opt{font-size:9pt;display:flex;align-items:center;gap:0.15rem;}.mc-opt input{width:10px;height:10px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{margin-top:0.1rem;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.08rem 0.4rem;margin-top:0.08rem;}.pr-head{font-size:9pt;font-weight:700;color:#555;margin-bottom:0.1rem;}.pr-item{font-size:10.5pt;padding:0.1rem 0.28rem;background:#f2f7e6;border-radius:3px;margin-bottom:0.07rem;display:flex;align-items:center;gap:0.2rem;line-height:1.2;break-inside:avoid;page-break-inside:avoid;}.pr-num{font-weight:700;color:#3f6212;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.22rem;padding:0.15rem 0;page-break-before:avoid;break-before:avoid;color:#3f6212;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #3f6212;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#555;}.pa{color:#007a00;font-weight:600;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · El Himno Nacional de Honduras · Educación Básica · Educación Cívica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Evaluación Final · El Himno Nacional de Honduras · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u</div></div><div class="p-grid">${pR}</div>
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
  {txt:'En el acto del lunes, un alumno de sexto grado canta el coro y después se queda callado cuando empieza la séptima estrofa, porque no se la sabe.'},
  {txt:'Una alumna de noveno copia en el examen la séptima estrofa así: «Por guardar ese emblema divino, por guardar ese emblema divino, marcharemos, oh patria, a la muerte…».'},
  {txt:'Un maestro explica que el coro del Himno no cuenta ninguna historia: describe la Bandera y el Escudo con palabras.'},
  {txt:'Un niño pregunta por qué en la tercera estrofa dice que la lucha del indio fue «inútil», si Lempira es el héroe nacional.'},
  {txt:'En clase se comenta que la quinta estrofa del Himno habla de Francia y de la diosa Razón, y alguien dice que eso no tiene nada que ver con Honduras.'},
  {txt:'Una alumna dice que el Himno tiene cuatro estrofas, porque son las que alcanzó a escuchar en el desfile.'},
];
const critCaseQuestions=[
  '1. ¿De qué parte del Himno habla este caso: del coro o de alguna estrofa? ¿De cuál?',
  '2. ¿Lo que se dice o se hace en el caso es correcto? ¿Por qué?',
  '3. ¿Qué cuenta o qué describe esa parte del Himno?',
  '4. ¿Qué le explicarías tú a ese compañero para que le quede claro?',
];
const critCaseGuides=[
  'Puede ser el coro —que describe la Bandera y el Escudo— o una de las siete estrofas, cada una con su tema: Colón, la conquista, Lempira, la colonia, Francia y la Independencia.',
  'Se valora que el alumno distinga lo cantado de lo escrito (las repeticiones son de la música), que sepa que el Himno tiene un coro y SIETE estrofas, y que en los actos se canta el coro y la séptima.',
  'Cada parte tiene un trabajo: el coro pinta los símbolos; las seis primeras estrofas cuentan la historia en orden; la séptima es la promesa de defender la patria.',
  'Respuesta abierta. Se valora que explique con respeto y con un dato concreto del Himno, no que se burle del compañero.',
];
const critErrorBank=[
  {txt:'"La letra del Himno Nacional la escribió Carlos Hartling y la música es de Augusto C. Coello."',
   g1:'Es al revés: la LETRA es de Augusto C. Coello, escritor hondureño.',
   g2:'La MÚSICA es de Carlos Hartling, músico alemán que vivió en Honduras.'},
  {txt:'"El Himno Nacional tiene tres estrofas y en los actos escolares se canta la primera."',
   g1:'El Himno tiene un coro y SIETE estrofas, de ocho versos cada una.',
   g2:'En los actos se canta el coro, la SÉPTIMA estrofa y otra vez el coro.'},
  {txt:'"El coro del Himno cuenta la llegada de Cristóbal Colón a Honduras."',
   g1:'El coro NO cuenta historia: describe la Bandera y el Escudo.',
   g2:'La llegada de Colón se cuenta en la PRIMERA estrofa: «el audaz navegante te halló».'},
  {txt:'"En la tercera estrofa del Himno, el héroe que muere envuelto en su sangre es Francisco Morazán."',
   g1:'El de la tercera estrofa es LEMPIRA, el cacique lenca que resistió la conquista hacia 1537.',
   g2:'Francisco Morazán NO aparece en el Himno; el único hondureño nombrado es Lempira.'},
  {txt:'"El León que ruge indignado al otro lado del Atlante, en la cuarta estrofa, es España."',
   g1:'El León es FRANCIA, y la quinta estrofa lo dice con su nombre: «Era Francia, la libre, la heroica».',
   g2:'España es de donde vino Colón —«un país donde el sol se levanta»— y quien mantuvo la colonia tres siglos.'},
  {txt:'"El Himno se escribió en 1821, el año de la Independencia, y se volvió oficial ese mismo día."',
   g1:'La letra se escribió en 1903 y se cantó por primera vez el 15 de septiembre de 1904.',
   g2:'Se declaró oficial en 1915: pasaron once años entre el estreno y el decreto.'},
];
const critDecisionBank=[
  'Cuando empieza el Himno Nacional en el acto cívico, conviene ponerse de pie y cantarlo, o quedarse sentado esperando a que termine.',
  'Para aprenderse la séptima estrofa antes del examen, conviene estudiarla verso por verso entendiendo lo que dice, o repetirla de corrido sin saber qué significa.',
  'Al copiar el coro en el examen, conviene escribirlo como está escrito, o copiarlo con las repeticiones que se cantan («Tu bandera, tu bandera…»).',
  'Si un compañero dice que el Himno tiene cinco estrofas, conviene mostrarle la letra completa y contarlas juntos, o reírse de él delante de todos.',
  'Para explicar una estrofa en el examen, conviene decir con tus palabras de qué habla y qué significan sus palabras difíciles, o volver a copiar la estrofa más bonito.',
];
const critDecisionGuide='La mejor decisión respeta el Himno y respeta a las personas: ante el Himno se está de pie y se canta; una estrofa se estudia entendiéndola, no repitiéndola a ciegas; escrito, el verso va una sola vez, sin las repeticiones de la música; explicar es decirlo con tus palabras, no volver a copiarlo; y a un compañero equivocado se le corrige con respeto y con el dato en la mano.';
const critCompareBank=[
  {a:'Parte del Himno que describe la Bandera y el Escudo.',b:'Parte del Himno que promete defender la patria hasta la muerte.',
   ga:'El coro.',
   gb:'La séptima estrofa.',
   gr:'Las dos se cantan en el acto cívico, pero hacen cosas distintas: el coro PINTA los símbolos y no cuenta historia, y la séptima es la única que mira al futuro, porque promete.'},
  {a:'Estrofa que cuenta la llegada de Cristóbal Colón a las costas de Honduras.',b:'Estrofa que cuenta la muerte de Lempira y el peñón que lo recuerda.',
   ga:'La primera estrofa.',
   gb:'La tercera estrofa.',
   gr:'Las dos cuentan la época de la conquista, pero la primera es el encuentro —Colón admirado besa la orilla del mar— y la tercera es la resistencia que termina en derrota.'},
  {a:'Estrofa que resume los tres siglos de la colonia y oye rugir a un León.',b:'Estrofa que dice quién era ese León y cuenta su revolución.',
   ga:'La cuarta estrofa.',
   gb:'La quinta estrofa.',
   gr:'Van pegadas y hay que leerlas juntas: la cuarta deja la pregunta —un León ruge al otro lado del Atlante— y la quinta la contesta: era Francia.'},
];
const critCauseBank=[
  {cause:'La música del Himno repite pedazos del coro para que cuadre con la melodía.',guide:'Por eso cantado se oye «Tu bandera, tu bandera…», pero escrito el verso va UNA sola vez.'},
  {cause:'El Himno completo es largo: un coro y siete estrofas de ocho versos cada una.',guide:'Por eso en los actos escolares se canta solo el coro y la séptima estrofa.'},
  {cause:'Las seis primeras estrofas cuentan la historia de Honduras en orden.',guide:'Por eso el Himno se puede estudiar como una película: Colón, la conquista, Lempira, la colonia, Francia y la Independencia.'},
  {cause:'Nunca se supo dónde quedó enterrado el cacique Lempira.',guide:'Por eso la tercera estrofa dice que de aquella hazaña solo quedaron la leyenda, un sepulcro ignorado y el perfil de un peñón.'},
  {cause:'Los versos del Himno tienen que medir todos lo mismo para que la música les calce.',guide:'Por eso la sexta estrofa dice «enseñastes» con -s: sin esa letra al verso le faltaría una sílaba.'},
];
const critEffectBank=[
  {effect:'La séptima estrofa es la que se canta en las escuelas y en los partidos.',guide:'Porque es la única que no cuenta el pasado: es el juramento de defender la Bandera, y eso vale para hoy.'},
  {effect:'La quinta estrofa del Himno habla de Francia, de Dantón y de la diosa Razón.',guide:'Porque de la Revolución Francesa salieron las ideas de libertad e igualdad que llegaron a América y empujaron la Independencia.'},
  {effect:'El coro nombra un mar, un volcán y un astro de nítida luz.',guide:'Porque está describiendo el Escudo Nacional: el mar que lo rodea, el volcán entre las torres y el sol naciente sobre la cima.'},
  {effect:'En la segunda estrofa Honduras levanta la frente y ya ondea «un extraño pendón».',guide:'Porque ese es el momento en que empieza la conquista: la bandera que ondea sobre el país es la de otra nación.'},
  {effect:'La sexta estrofa habla de un «infame eslabón» destrozado.',guide:'Porque el eslabón es la cadena de la opresión colonial, y romperla es la Independencia del 15 de septiembre de 1821.'},
];
function genEvalCrit(){
  sfx('click');
  _injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });
  const _sC = document.getElementById('evalCritFormaSel');
  if (_sC && parseInt(_sC.value, 10)) evalCritFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sC.value, 10)));
  const cf=evalCritFormNum;window._currentEvalCritForm=cf;const rngC = _evalRng(200000 + cf);evalCritFormNum=(evalCritFormNum%EVAL_FORMAS)+1;_injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });saveProgress();
  document.getElementById('evalcrit-screen-title').textContent=`🧠 Pensamiento Crítico · Forma ${cf} · El Himno Nacional de Honduras`;
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
  s3.innerHTML=`<div class="eval-section-title">III. Toma de decisiones: el Himno y su estudio <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${dec}</div><div class="crit-q-block"><div class="crit-q-label">¿Qué opción recomendarías? Explica por qué, relacionándolo con lo que dice el Himno y con el respeto que se le debe.</div><textarea class="crit-textarea" rows="4" aria-label="Recomendaciones y su justificación"></textarea><div class="crit-pauta">${critDecisionGuide}</div></div><div class="crit-selfscore"><label for="critScore2">Obtenido:</label><input type="number" id="critScore2" class="crit-score-input" data-score="2" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
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
  let s3=`<div class="sec-title"><span>III. Toma de decisiones: el Himno y su estudio</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.dec}</p><p class="crit-print-q">¿Qué opción recomendarías? Explica por qué, relacionándolo con lo que dice el Himno y con el respeto que se le debe.</p>${lines(2)}`;
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
  const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Pensamiento Crítico El Himno Nacional de Honduras · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.1rem 0.4rem;margin:0.2rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #3f6212;background:#f2f7e6;color:#3f6212;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#3f6212;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #3f6212;height:12px;}.obt-pct{white-space:nowrap;}.crit-print-scenario{font-size:10.5pt;background:#f2f7e6;border-left:3px solid #3f6212;padding:0.2rem 0.5rem;margin:0.1rem 0 0.2rem;line-height:1.3;}.crit-print-q{font-size:10pt;font-weight:600;margin:0.15rem 0 0.08rem;line-height:1.25;}.ln{border-bottom:1px solid #111;min-height:12px;margin-bottom:2px;}.crit-compare-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin:0.15rem 0;}.crit-compare-print-box{font-size:9.5pt;background:#f2f7e6;border-radius:4px;padding:0.25rem 0.4rem;line-height:1.25;}.crit-print-tbl{width:100%;border-collapse:collapse;font-size:9.5pt;margin-top:0.15rem;}.crit-print-tbl th,.crit-print-tbl td{border:1px solid #999;padding:0.3rem 0.45rem;text-align:left;height:30px;vertical-align:middle;}.crit-print-tbl th{background:#f2f7e6;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.08rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.9rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.45rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.1rem;margin-bottom:0.18rem;}.p-crit-line{font-size:11pt;color:#007a00;margin-bottom:0.18rem;line-height:1.35;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.2rem;padding:0.1rem 0;color:#3f6212;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #3f6212;}.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:12.7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="critEvalPage"><div class="ph"><h2>Evaluación Competencial · Pensamiento Crítico · El Himno Nacional de Honduras · Educación Básica · Educación Cívica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 5 secciones de 20 puntos</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100</span></div></div><div class="pauta-wrap" id="critPautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Pensamiento Crítico · El Himno Nacional de Honduras · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 5 secciones × 20 pts c/u — respuesta abierta, usar como guía de corrección</div></div><div class="p-grid">${pR}</div></div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("critEvalPage",250,0.55,1.2);fit("critPautaPage",250,0.55,1.2);})();<\/script></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(doc);win.document.close();setTimeout(()=>win.print(),400);
}

// ===================== LABORATORIO DE LOS SÍMBOLOS =====================
const parteData = (function () {
  /* Se arma desde js/data/himno.js. Escribir aquí los versos otra vez sería
     abrir la puerta a que la pantalla y el papel dejen de decir lo mismo. */
  const out = {};
  HIMNO.forEach(e => {
    const versos = e.versos.map(v => v.replace(/&/g, '&amp;').replace(/</g, '&lt;')).join('<br>');
    const cantado = e.clave === 'coro'
      ? '<br><br><em>Y así se CANTA, con las repeticiones que pide la música:</em><br>' +
        HIMNO_CORO_CANTADO.join('<br>')
      : '';
    out[e.clave] = {
      nombre: e.titulo, icon: e.clave === 'coro' ? '🎼' : '' + e.n + '️⃣',
      estructura: { title: 'La letra', info: versos + cantado },
      funcion:    { title: '¿Qué dice?', info: '• <strong>' + e.tema + '</strong><br>• ' + e.explicacion },
      ubicacion:  { title: 'Las palabras', info: e.palabras.map(w => '• <strong>' + w.p + ':</strong> ' + w.s).join('<br>') },
      dato:       { title: 'Dato curioso', info: '• ' + e.dato }
    };
  });
  return out;
})();
let labParte='coro',labAspecto='estructura';
function labShowParte(parteKey){labParte=parteKey;updateLabDisplay();document.querySelectorAll('.lab-cont-btn').forEach(b=>b.classList.remove('active-pri'));const btn=document.querySelector(`[data-parte="${parteKey}"]`);if(btn)btn.classList.add('active-pri');if(typeof sfx==='function')sfx('click');}
function labShowAspecto(aspectoKey){labAspecto=aspectoKey;updateLabDisplay();document.querySelectorAll('.lab-asp-btn').forEach(b=>b.classList.remove('active-sec'));const btn=document.querySelector(`[data-aspecto="${aspectoKey}"]`);if(btn)btn.classList.add('active-sec');if(typeof sfx==='function')sfx('click');}
function updateLabDisplay(){const data=parteData[labParte];const asp=data[labAspecto];document.getElementById('lab-sentence').innerHTML=`🔬 Explorando: <strong>${data.nombre}</strong> → <strong>${asp.title}</strong>`;document.getElementById('lab-display').innerHTML=`<div class="lab-cont-header">${data.icon} ${data.nombre}</div><div class="lab-asp-title">${asp.title}</div><div class="lab-asp-info">${asp.info}</div>`;}

// ===================== DIPLOMA =====================
function _diplPct(){return xp>=MXP?100:Math.round((xp/MXP)*100);}
function openDiploma(){sfx('fan');const pct=_diplPct();document.getElementById('diplPct').textContent=pct+'%';document.getElementById('diplBar').style.width=pct+'%';document.getElementById('diplDate').textContent='Fecha: '+new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});const msgs=['¡Sigue aprendiendo!','¡Muy buen trabajo!','¡Vas muy bien!','¡Te sabes el Himno!','¡Guardián de la Patria!'];document.getElementById('diplMsg').textContent=msgs[Math.min(Math.floor(pct/25),4)];const stars=['⭐','⭐⭐','⭐⭐⭐'];document.getElementById('diplStars').textContent=stars[Math.min(Math.floor(pct/40),2)];const achTxt=unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(' · ');document.getElementById('diplAch').textContent=achTxt||'Sigue completando secciones para desbloquear logros';document.getElementById('diplomaOverlay').classList.add('open');launchConfetti();}
function closeDiploma(){document.getElementById('diplomaOverlay').classList.remove('open');}
function updateDiplomaName(v){document.getElementById('diplName').textContent=v||'Estudiante';}
function shareWA(){const name=document.getElementById('diplName').textContent||'Estudiante';const pct=_diplPct();const msg=`🇭🇳 ¡${name} completó la Misión "El Himno Nacional de Honduras"! 🏅 Progreso: ${pct}% · 🌱 policastsapien.com`;_waShare(msg);}
async function captureDiploma(){if(typeof html2canvas==='undefined'){showToast('⚠️ Cargando... intenta de nuevo');return;}sfx('click');const card=document.querySelector('.diploma-card');const btn=document.querySelector('.diploma-actions .btn-pri');const toHide=[card.querySelector('.diploma-input'),card.querySelector('.diploma-actions'),card.querySelector('hr')];if(btn){btn.disabled=true;btn.textContent='⏳ Capturando...';}toHide.forEach(el=>{if(el)el.style.display='none';});let dataUrl='';try{const canvas=await html2canvas(card,{scale:2,useCORS:true,backgroundColor:'#ffffff'});toHide.forEach(el=>{if(el)el.style.display='';});dataUrl=canvas.toDataURL('image/png');const name=(document.getElementById('diplName').textContent||'Estudiante').replace(/\s+/g,'-');const fileName='constancia-'+name+'.png';const cap=window.Capacitor;if(cap&&cap.isNativePlatform&&cap.isNativePlatform()&&cap.Plugins?.Filesystem&&cap.Plugins?.Share){const base64Data=dataUrl.split(',')[1];const result=await cap.Plugins.Filesystem.writeFile({path:fileName,data:base64Data,directory:'CACHE'});await cap.Plugins.Share.share({url:result.uri,dialogTitle:'Guardar / Compartir Constancia'});}else{const a=document.createElement('a');a.href=dataUrl;a.download=fileName;a.click();}}catch(e){toHide.forEach(el=>{if(el)el.style.display='';});if(e.name!=='AbortError')showToast('⚠️ No se pudo guardar la constancia');}finally{if(btn){btn.disabled=false;btn.textContent='📷 Guardar foto';}}}

// ===================== INIT =====================

// ===================== EL HIMNO EN LA PANTALLA =====================
/* El mapa y el texto completo se PINTAN desde js/data/himno.js, no se
   escriben en el HTML. El Himno vive en dos sitios que la gente lee —esta
   pantalla y la ficha que se fotocopia— y si cada uno llevara su propia
   copia acabarían diciendo cosas distintas; el alumno estudiaría una letra
   y el examen le pediría la otra. De ahí sale también `_dev/verifica-himno.js`,
   que compara la ficha contra este mismo archivo. */
function _esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

/* Los dos versos de muestra de «Se escribe de un modo y se canta de otro».
   Salen de los datos por lo mismo que todo lo demás: una copia a mano en el
   HTML sería un segundo original, y la muestra de la diferencia es justo
   donde una errata pasa desapercibida. */
function pintarEjemploCantado(){
  const esc=document.getElementById('ej-escrito'),can=document.getElementById('ej-cantado');
  if(!esc||!can)return;
  const coro=himnoPorClave('coro');
  esc.innerHTML=coro.versos.slice(0,2).map(v=>'<span class="hn-v">'+_esc(v)+'</span>').join('');
  /* Se resalta lo que se REPITE, que es lo único que cambia entre las dos
     versiones: se busca el trozo del cantado que no está en el escrito. */
  can.innerHTML=HIMNO_CORO_CANTADO.slice(0,2).map((v,i)=>{
    const corte=v.length-coro.versos[i].length;
    return corte>0
      ? '<span class="hn-v"><span class="hl">'+_esc(v.slice(0,corte).trim())+'</span> '+_esc(v.slice(corte))+'</span>'
      : '<span class="hn-v">'+_esc(v)+'</span>';
  }).join('');
}

function pintarHimnoMapa(){
  const cont=document.getElementById('himno-mapa');if(!cont)return;
  const tonos=['tc-teal','tc-gold','tc-amber','tc-jade','tc-purple'];
  cont.innerHTML=HIMNO.map((e,i)=>{
    const icon=e.clave==='coro'?'🎼':''+e.n+'️⃣';
    /* En la tarjeta va el RESUMEN, que es una frase entera y cabe; el `tema`
       —de tres palabras— se guarda para la insignia que va al lado de cada
       título, donde no hay sitio para más. */
    return `<div class="type-chip ${tonos[i%tonos.length]}"><div class="t-art">${icon} ${_esc(e.titulo)}</div><div class="t-info">${_esc(e.resumen)}</div></div>`;
  }).join('');
}

function pintarHimnoLista(){
  const cont=document.getElementById('himno-lista');if(!cont)return;
  cont.innerHTML=HIMNO.map(e=>{
    const icon=e.clave==='coro'?'🎼':''+e.n+'️⃣';
    /* Cada verso en su propio bloque y CON SU NÚMERO. Lo segundo no es
       adorno: un verso de diez sílabas no cabe de ancho en un teléfono
       —medido, 65 de los 72 se parten a 360 px— y sin el número el alumno
       no sabe si lo que baja es el mismo verso o el siguiente. Justo eso
       es lo que el examen le pide contar: son OCHO, ni siete ni nueve.
       Encogerle la letra hasta que quepan era la otra salida, y se
       descartó: la misión arranca en letra grande a propósito. */
    const versos=e.versos.map((v,i)=>'<span class="hn-v"><b class="hn-n">'+(i+1)+'</b>'+_esc(v)+'</span>').join('');
    /* Solo el coro lleva el cantado: es el único que se repite al cantarse,
       y es donde el alumno copia de más en el examen. */
    const cantado=e.clave==='coro'
      ? `<div class="ex-box" style="margin-top:0.6rem;"><span class="ex-tag ex-d">🎤 Y así se CANTA, con las repeticiones de la música</span>${HIMNO_CORO_CANTADO.map((v,i)=>'<span class="hn-v"><b class="hn-n">'+(i+1)+'</b>'+_esc(v)+'</span>').join('')}</div>`
      : '';
    const palabras=e.palabras.map(w=>`<li><strong>${_esc(w.p)}:</strong> ${_esc(w.s)}</li>`).join('');
    return `<div class="hn-parte">
      <h3 class="hn-tit">${icon} ${_esc(e.titulo)} <span class="hn-tema">${_esc(e.tema)}</span></h3>
      <div class="hn-versos">${versos}</div>
      ${cantado}
      <p class="hn-expl"><strong>Qué dice:</strong> ${_esc(e.explicacion)}</p>
      <p class="hn-pal-tit">📚 Las palabras difíciles</p>
      <ul class="hn-pal">${palabras}</ul>
      <div class="tip"><span class="ti">💡</span><div>${_esc(e.dato)}</div></div>
    </div>`;
  }).join('');
}

window.addEventListener('DOMContentLoaded',()=>{
  initTheme();
  loadProgress();
  pintarEjemploCantado();
  pintarHimnoMapa();
  pintarHimnoLista();
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
  document.querySelector('[data-parte="coro"]')?.classList.add('active-pri');
  document.querySelector('[data-aspecto="estructura"]')?.classList.add('active-sec');
  renderAchPanel();
});

(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalCrit==='function') _injectFormaSel('genEvalCrit','evalCritFormaSel',evalCritFormNum,function(v){evalCritFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();
