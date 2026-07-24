// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
function compartirMision(){const url=window.location.href;const texto=`🚀 *Misión Asignada* 🚀\n\nPractica sobre este tema y sobresale en ser de los mejores alumnos. 🏆\n\nDesbloquea *todos los logros* y puedes poner *tus datos* para que tu maestro observe todos tus logros. 📋\n\n_Se te hará prueba escrita y serás excelente estudiante en Ciencias Naturales._ ✍️\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;_waShare(texto);}
function toggleLetra(){document.body.classList.toggle('letra-grande');if(typeof sfx==='function')sfx('click');localStorage.setItem('preferenciaLetra',document.body.classList.contains('letra-grande'));}
window.addEventListener('DOMContentLoaded',()=>{if(localStorage.getItem('preferenciaLetra')==='true')document.body.classList.add('letra-grande');});

// ===================== UTILIDADES =====================
const _pick=(arr,n)=>[...arr].sort(()=>Math.random()-0.5).slice(0,n);
const _shuffle=(arr)=>[...arr].sort(()=>Math.random()-0.5);
function fb(id,msg,isOk){const el=document.getElementById(id);if(el){el.textContent=msg;el.className='fb show '+(isOk?'ok':'err');}}

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY='universo_sistema_solar_v1';
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
  primer_quiz:{icon:'🌟',label:'Primera prueba del universo y el sistema solar superada'},
  flash_master:{icon:'🃏',label:'Todas las flashcards del universo exploradas'},
  clasif_pro:{icon:'🗂️',label:'Clasificador de astros experto'},
  id_master:{icon:'🔍',label:'Identificador del universo y el sistema solar maestro'},
  reto_hero:{icon:'🏆',label:'Héroe del reto del universo y el sistema solar'},
  nivel3:{icon:'🪐',label:'¡Naturalista! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡Explorador del Espacio! Nivel 6'},
  widgets_master:{icon:'🧩',label:'Widgets del universo dominados'}
};
function unlockAchievement(id){if(unlockedAch.includes(id))return;unlockedAch.push(id);sfx('ach');showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label);launchConfetti();renderAchPanel();saveProgress();}
function renderAchPanel(){const list=document.getElementById('achList');list.innerHTML='';Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{const div=document.createElement('div');div.className='ach-item'+(unlockedAch.includes(id)?'':' locked');div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`;list.appendChild(div);});}
function toggleAchPanel(){sfx('click');document.getElementById('achPanel').classList.toggle('open');}
function showToast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}t.textContent=msg;t.style.display='block';clearTimeout(t._tid);t._tid=setTimeout(()=>t.style.display='none',3200);}
function launchConfetti(){const colors=['#16a34a','#4ade80','#0d9488','#5eead4','#00b894'];for(let i=0;i<60;i++){const c=document.createElement('div');c.className='confetti-piece';c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`;document.body.appendChild(c);c.addEventListener('animationend',()=>c.remove());}}

// ===================== XP =====================
const lvls=[{t:0,n:'Aprendiz 🌱'},{t:25,n:'Explorador 🔬'},{t:55,n:'Naturalista 🪐'},{t:90,n:'Astrónomo 🔭'},{t:130,n:'Investigador 🚀'},{t:165,n:'Cosmonauta 🏅'},{t:190,n:'Explorador del Espacio 🏆'}];
function pts(n){xp=Math.max(0,Math.min(MXP,xp+n));updateXPBar();saveProgress();}
function updateXPBar(){const pct=Math.round((xp/MXP)*100);document.getElementById('xpFill').style.width=pct+'%';const el=document.getElementById('xpPts');el.textContent='⭐ '+xp;el.style.transform='scale(1.3)';setTimeout(()=>el.style.transform='',300);let lv=0;for(let i=0;i<lvls.length;i++)if(xp>=lvls[i].t)lv=i;document.getElementById('xpLvl').textContent=lvls[lv].n;if(lv!==prevLevel){if(lv>=2)unlockAchievement('nivel3');if(lv>=5)unlockAchievement('nivel5');prevLevel=lv;}}
function resetXP(){sfx('click');xp=0;updateXPBar();showToast('🔄 XP reiniciado a 0');}
function fin(id,showFX=true){if(!done.has(id)){done.add(id);const b=document.querySelector(`[data-s="${id}"]`);if(b)b.classList.add('done');if(showFX){sfx('up');launchConfetti();}saveProgress();}}
function getProgress(){return Math.round((done.size/TOTAL_SECTIONS)*100);}

// ===================== NAV =====================
function go(id){sfx('click');document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});document.getElementById(id).classList.add('active');const btn=document.querySelector(`[data-s="${id}"]`);if(btn){btn.classList.add('active');btn.setAttribute('aria-selected','true');}window.scrollTo({top:0,behavior:'smooth'});if(id==='s-sopa'){setTimeout(buildSopa,50);}if(id==='s-widgets'){setTimeout(buildRoute,50);}}

// ===================== FLASHCARD DATA =====================
const fcData=[
  {w:'Universo',a:'🌌 <strong>Todo lo que existe</strong>: el espacio y todos los astros que hay en él.'},
  {w:'Astro',a:'✨ Cualquier <strong>cuerpo del espacio</strong>: estrellas, planetas, satélites, cometas…'},
  {w:'Estrella',a:'⭐ Astro con <strong>luz propia</strong>. El <strong>Sol</strong> es la estrella más cercana.'},
  {w:'Planeta',a:'🪐 Astro que <strong>gira alrededor de una estrella</strong> y <strong>no tiene luz propia</strong>.'},
  {w:'Satélite',a:'🌙 Astro que <strong>gira alrededor de un planeta</strong>. La <strong>Luna</strong> es el satélite de la Tierra.'},
  {w:'Galaxia',a:'🌌 Enorme <strong>grupo de estrellas</strong>. La nuestra es la <strong>Vía Láctea</strong>.'},
  {w:'Sistema Solar',a:'☀️ El <strong>Sol</strong> y todos los astros que giran a su alrededor: 8 planetas y otros cuerpos.'},
  {w:'Cometa',a:'☄️ Astro de <strong>hielo y polvo</strong> que forma una <strong>cola</strong> al acercarse al Sol.'},
  {w:'El Sol',a:'☀️ La <strong>estrella</strong> del centro del sistema solar. Nos da <strong>luz y calor</strong>.'},
  {w:'La Tierra',a:'🌍 El <strong>tercer planeta</strong> desde el Sol; el único con <strong>vida</strong> conocida.'},
  {w:'La Luna',a:'🌙 El <strong>satélite</strong> de la Tierra. No tiene luz propia: <strong>refleja</strong> la del Sol.'},
  {w:'Rotación',a:'🔁 Movimiento de la Tierra <strong>sobre sí misma</strong>. Dura un día y produce el <strong>día y la noche</strong>.'},
  {w:'Traslación',a:'🔃 Movimiento de la Tierra <strong>alrededor del Sol</strong>. Dura un año y produce las <strong>estaciones</strong>.'},
  {w:'Eclipse',a:'🌑 Ocurre cuando un astro <strong>tapa</strong> la luz de otro (de Sol o de Luna).'},
];
let fcIdx=0;
function upFC(){document.getElementById('fcInner').classList.remove('flipped');document.getElementById('fcW').textContent=fcData[fcIdx].w;document.getElementById('fcA').innerHTML=fcData[fcIdx].a;document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length;}
function flipCard(){sfx('flip');document.getElementById('fcInner').classList.toggle('flipped');if(!xpTracker.fc.has(fcIdx)){xpTracker.fc.add(fcIdx);pts(1);}if(xpTracker.fc.size===fcData.length){fin('s-flash');unlockAchievement('flash_master');}}
function nextFC(){sfx('click');fcIdx=(fcIdx+1)%fcData.length;upFC();}
function prevFC(){sfx('click');fcIdx=(fcIdx-1+fcData.length)%fcData.length;upFC();}

// ===================== QUIZ DATA =====================
const qzData=[
  {q:'¿Qué es el universo?',o:['a) Solo la Tierra','b) Todo lo que existe: el espacio y los astros','c) Solo el Sol','d) Solo las estrellas'],c:1},
  {q:'¿Qué astro tiene luz propia?',o:['a) El planeta','b) El satélite','c) La estrella','d) El cometa'],c:2},
  {q:'¿Qué es un planeta?',o:['a) Un astro con luz propia','b) Un astro que gira alrededor de una estrella','c) Una galaxia','d) Un cometa'],c:1},
  {q:'¿Cuál es el satélite natural de la Tierra?',o:['a) El Sol','b) Marte','c) La Luna','d) Venus'],c:2},
  {q:'¿Cuál es la estrella del sistema solar?',o:['a) La Luna','b) El Sol','c) Júpiter','d) La Tierra'],c:1},
  {q:'¿Cuántos planetas tiene el sistema solar?',o:['a) Seis','b) Siete','c) Ocho','d) Diez'],c:2},
  {q:'¿Qué movimiento de la Tierra produce el día y la noche?',o:['a) La traslación','b) La rotación','c) El eclipse','d) La fase lunar'],c:1},
  {q:'¿Qué movimiento de la Tierra dura un año?',o:['a) La rotación','b) La traslación','c) La fase lunar','d) El eclipse'],c:1},
  {q:'¿Cómo se llama nuestra galaxia?',o:['a) El Sistema Solar','b) La Osa Mayor','c) La Vía Láctea','d) Andrómeda'],c:2},
];
let qzIdx=0,qzSel=-1,qzDone=false;
function buildQz(){qzIdx=0;qzSel=-1;qzDone=false;showQz();}
function showQz(){if(qzIdx>=qzData.length){document.getElementById('qzQ').textContent='🎉 ¡Quiz completado!';document.getElementById('qzOpts').innerHTML='';fin('s-quiz');unlockAchievement('primer_quiz');return;}const q=qzData[qzIdx];document.getElementById('qzProg').textContent=`Pregunta ${qzIdx+1} de ${qzData.length}`;document.getElementById('qzQ').textContent=q.q;const opts=document.getElementById('qzOpts');opts.innerHTML='';q.o.forEach((o,i)=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=o;b.onclick=()=>{if(qzDone)return;document.querySelectorAll('.qz-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');qzSel=i;sfx('click');};opts.appendChild(b);});qzDone=false;}
function checkQz(){if(qzSel<0)return fb('fbQz','Selecciona una respuesta.',false);qzDone=true;const opts=document.querySelectorAll('.qz-opt');if(qzSel===qzData[qzIdx].c){opts[qzSel].classList.add('correct');fb('fbQz','¡Correcto! +5 XP',true);if(!xpTracker.qz.has(qzIdx)){xpTracker.qz.add(qzIdx);pts(5);}sfx('ok');}else{opts[qzSel].classList.add('wrong');opts[qzData[qzIdx].c].classList.add('correct');fb('fbQz','Incorrecto. Revisa la respuesta correcta.',false);sfx('no');}setTimeout(()=>{qzIdx++;qzSel=-1;showQz();},1600);}
function resetQz(){sfx('click');qzIdx=0;qzSel=-1;qzDone=false;showQz();document.getElementById('fbQz').classList.remove('show');}

// ===================== CLASIFICACIÓN =====================
const classGroups=[
  {label:['Con luz propia','Sin luz propia'],headA:'⭐ Con luz propia',headB:'🪐 Sin luz propia',colA:'luz',colB:'sinluz',
   words:[{w:'El Sol',t:'luz'},{w:'La Luna',t:'sinluz'},{w:'Las estrellas',t:'luz'},{w:'Los planetas',t:'sinluz'},{w:'La Tierra',t:'sinluz'},{w:'Otra estrella lejana',t:'luz'},{w:'Marte',t:'sinluz'},{w:'Un satélite',t:'sinluz'}]},
  {label:['Rotación','Traslación'],headA:'🔁 Rotación',headB:'🔃 Traslación',colA:'rot',colB:'tras',
   words:[{w:'Gira sobre sí misma',t:'rot'},{w:'Gira alrededor del Sol',t:'tras'},{w:'Produce el día y la noche',t:'rot'},{w:'Produce las estaciones',t:'tras'},{w:'Dura 24 horas',t:'rot'},{w:'Dura un año',t:'tras'},{w:'Dura un día',t:'rot'},{w:'Dura 365 días',t:'tras'},{w:'Da vueltas sobre su eje',t:'rot'},{w:'Recorre su órbita',t:'tras'}]},
  {label:['Astro','No es astro'],headA:'✨ Es un astro',headB:'🚫 No es un astro',colA:'astro',colB:'no',
   words:[{w:'Estrella',t:'astro'},{w:'Nube',t:'no'},{w:'Planeta',t:'astro'},{w:'Montaña',t:'no'},{w:'Satélite',t:'astro'},{w:'Río',t:'no'},{w:'Cometa',t:'astro'},{w:'Árbol',t:'no'},{w:'Galaxia',t:'astro'},{w:'Avión',t:'no'}]},
  {label:['El Sol','La Luna'],headA:'☀️ El Sol',headB:'🌙 La Luna',colA:'sol',colB:'luna',
   words:[{w:'Es una estrella',t:'sol'},{w:'Es un satélite',t:'luna'},{w:'Tiene luz propia',t:'sol'},{w:'Refleja la luz del Sol',t:'luna'},{w:'Da calor a la Tierra',t:'sol'},{w:'Tiene fases',t:'luna'},{w:'Está en el centro del sistema solar',t:'sol'},{w:'Gira alrededor de la Tierra',t:'luna'}]},
];
let currentClassGroupIdx=0,clsSelectedWord=null;
function buildClass(){const group=classGroups[currentClassGroupIdx];document.getElementById('col-left-head').textContent=group.headA;document.getElementById('col-right-head').textContent=group.headB;const bank=document.getElementById('clsBank');bank.innerHTML='';clsSelectedWord=null;document.getElementById('items-left').innerHTML='';document.getElementById('items-right').innerHTML='';_shuffle([...group.words]).forEach(w=>{const el=document.createElement('div');el.className='wb-item';el.textContent=w.w;el.dataset.t=w.t;el.onclick=()=>{document.querySelectorAll('.wb-item').forEach(i=>i.classList.remove('sel-word'));el.classList.add('sel-word');clsSelectedWord=el;sfx('click');};bank.appendChild(el);});['col-left','col-right'].forEach(colId=>{const col=document.getElementById(colId);col.onclick=(e)=>{if(!clsSelectedWord||e.target.classList.contains('drop-item'))return;const targetId=colId==='col-left'?'items-left':'items-right';const wordsCol=document.getElementById(targetId);const item=document.createElement('div');item.className='drop-item';item.textContent=clsSelectedWord.textContent;item.dataset.t=clsSelectedWord.dataset.t;const original=clsSelectedWord;item.onclick=(ev)=>{ev.stopPropagation();if(clsSelectedWord!==null){col.click();}else{document.getElementById('clsBank').appendChild(original);original.classList.remove('sel-word');item.remove();if(typeof sfx==='function')sfx('click');}};wordsCol.appendChild(item);clsSelectedWord.remove();clsSelectedWord=null;sfx('click');};});}
function checkClass(){const remaining=document.querySelectorAll('#clsBank .wb-item').length;if(remaining>0){fb('fbCls','Mueve todas las palabras a las columnas primero.',false);return;}const group=classGroups[currentClassGroupIdx];let allOk=true;document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{const inLeft=el.parentElement.id==='items-left';const expectedType=inLeft?group.colA:group.colB;if(el.dataset.t===expectedType){el.classList.add('cls-ok');}else{el.classList.add('cls-no');allOk=false;}});if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);}if(allOk){fb('fbCls','¡Perfecto! +5 XP',true);sfx('fan');fin('s-clasifica');unlockAchievement('clasif_pro');}else{fb('fbCls','Hay errores. Marcados en rojo.',false);sfx('no');}}
function nextClassGroup(){sfx('click');currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length;buildClass();document.getElementById('fbCls').classList.remove('show');showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]);}
function resetClass(){sfx('click');buildClass();document.getElementById('fbCls').classList.remove('show');}

// ===================== IDENTIFICAR =====================
const idData=[
  {s:['El','Sol','es','la','estrella','del','sistema','solar.'],c:1,art:'La estrella del sistema solar'},
  {s:['La','Luna','es','el','satélite','de','la','Tierra.'],c:1,art:'El satélite de la Tierra'},
  {s:['La','rotación','produce','el','día','y','la','noche.'],c:1,art:'Movimiento que produce el día y la noche'},
  {s:['La','traslación','produce','las','estaciones','del','año.'],c:1,art:'Movimiento que produce las estaciones'},
  {s:['Las','estrellas','tienen','luz','propia.'],c:1,art:'Astros que tienen luz propia'},
  {s:['La','Tierra','es','el','tercer','planeta','del','sistema','solar.'],c:1,art:'El planeta donde vivimos'},
  {s:['Nuestra','galaxia','se','llama','Vía','Láctea.'],c:1,art:'Enorme grupo de estrellas'},
  {s:['El','cometa','tiene','una','cola','de','hielo','y','polvo.'],c:1,art:'Astro de hielo con cola'},
];
let idIdx=0,idDone=false;
function showId(){idDone=false;if(idIdx>=idData.length){document.getElementById('idSent').innerHTML='🎉 ¡Completado!';fin('s-identifica');unlockAchievement('id_master');return;}const d=idData[idIdx];document.getElementById('idProg').textContent=`Oración ${idIdx+1} de ${idData.length}`;document.getElementById('idInfo').textContent=`Busca: ${d.art}`;const sent=document.getElementById('idSent');sent.innerHTML='';d.s.forEach((w,i)=>{const span=document.createElement('span');span.className='id-word';span.textContent=w+' ';span.onclick=()=>checkId(i,span);sent.appendChild(span);});}
function checkId(i,span){if(idDone)return;document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected'));span.classList.add('selected');if(i===idData[idIdx].c){idDone=true;span.classList.add('id-ok');fb('fbId','¡Correcto! +5 XP',true);if(!xpTracker.id.has(idIdx)){xpTracker.id.add(idIdx);pts(5);}sfx('ok');}else{span.classList.add('id-no');fb('fbId','Ese no es el término solicitado.',false);sfx('no');}}
function nextId(){sfx('click');idIdx++;showId();document.getElementById('fbId').classList.remove('show');}
function resetId(){sfx('click');idIdx=0;showId();document.getElementById('fbId').classList.remove('show');}

// ===================== COMPLETA =====================
const cmpData=[
  {s:'El ___ es la estrella del sistema solar.',opts:['planeta','Sol','satélite'],c:1},
  {s:'La ___ es el satélite de la Tierra.',opts:['estrella','Luna','galaxia'],c:1},
  {s:'La ___ produce el día y la noche.',opts:['traslación','rotación','órbita'],c:1},
  {s:'La ___ produce las estaciones del año.',opts:['rotación','traslación','fase'],c:1},
  {s:'El sistema solar tiene ___ planetas.',opts:['seis','siete','ocho'],c:2},
  {s:'Las ___ tienen luz propia.',opts:['estrellas','planetas','lunas'],c:0},
  {s:'Nuestra galaxia es la ___.',opts:['Osa Mayor','Vía Láctea','Andrómeda'],c:1},
  {s:'La Luna no tiene luz propia: ___ la del Sol.',opts:['produce','refleja','apaga'],c:1},
];
let cmpIdx=0,cmpSel=-1,cmpDone=false;
function showCmp(){if(cmpIdx>=cmpData.length){document.getElementById('cmpSent').innerHTML='🎉 ¡Completado!';document.getElementById('cmpOpts').innerHTML='';fin('s-completa');return;}const d=cmpData[cmpIdx];document.getElementById('cmpProg').textContent=`Oración ${cmpIdx+1} de ${cmpData.length}`;document.getElementById('cmpSent').innerHTML=d.s.replace('___','<span class="blank">___</span>');const opts=document.getElementById('cmpOpts');opts.innerHTML='';cmpSel=-1;cmpDone=false;d.opts.forEach((o,i)=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=o;b.onclick=()=>{if(cmpDone)return;document.querySelectorAll('.cmp-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');cmpSel=i;sfx('click');};opts.appendChild(b);});}
function checkCmp(){if(cmpSel<0)return fb('fbCmp','Selecciona una opción.',false);cmpDone=true;const opts=document.querySelectorAll('.cmp-opt');if(cmpSel===cmpData[cmpIdx].c){opts[cmpSel].classList.add('correct');document.getElementById('cmpSent').innerHTML=cmpData[cmpIdx].s.replace('___',`<span class="blank" style="color:var(--jade);border-color:var(--jade)">${opts[cmpSel].textContent}</span>`);fb('fbCmp','¡Correcto! +5 XP',true);if(!xpTracker.cmp.has(cmpIdx)){xpTracker.cmp.add(cmpIdx);pts(5);}sfx('ok');}else{opts[cmpSel].classList.add('wrong');opts[cmpData[cmpIdx].c].classList.add('correct');fb('fbCmp','Incorrecto. Revisa bien la respuesta.',false);sfx('no');}setTimeout(()=>{cmpIdx++;document.getElementById('fbCmp').classList.remove('show');showCmp();},1600);}

// ===================== WIDGETS =====================
// Widget 1: Ordenar secuencias
const routeSets=[
  {label:'Los planetas desde el Sol (en orden)',steps:['Mercurio','Venus','Tierra','Marte','Júpiter','Saturno','Urano','Neptuno']},
  {label:'De lo pequeño a lo grande',steps:['La Luna','La Tierra','El Sol','El Sistema Solar','La galaxia (Vía Láctea)']},
  {label:'Las fases de la Luna (en orden)',steps:['Luna nueva','Cuarto creciente','Luna llena','Cuarto menguante']},
];
let currentRouteIdx=0,routeItems=[];
function buildRoute(){routeItems=_shuffle([...routeSets[currentRouteIdx].steps]);renderRoute();const fbEl=document.getElementById('fbRoute');if(fbEl)fbEl.classList.remove('show');}
function renderRoute(){const list=document.getElementById('routeList');if(!list)return;list.innerHTML='';routeItems.forEach((step,i)=>{const div=document.createElement('div');div.className='sort-item';div.innerHTML=`<div class="sort-arrows"><button class="sort-arrow" onclick="routeMove(${i},-1)"${i===0?' disabled':''}>▲</button><button class="sort-arrow" onclick="routeMove(${i},1)"${i===routeItems.length-1?' disabled':''}>▼</button></div><div class="sort-step-num">${i+1}.</div><div class="sort-item-txt">${step}</div>`;list.appendChild(div);});}
function routeMove(idx,dir){sfx('click');const ni=idx+dir;if(ni<0||ni>=routeItems.length)return;[routeItems[idx],routeItems[ni]]=[routeItems[ni],routeItems[idx]];renderRoute();}
function checkRoute(){const correct=routeSets[currentRouteIdx].steps;const isOk=routeItems.every((s,i)=>s===correct[i]);if(isOk){fb('fbRoute','¡Perfecto! Orden correcto. +4 XP',true);if(!xpTracker.wgt.has('route_'+currentRouteIdx)){xpTracker.wgt.add('route_'+currentRouteIdx);pts(4);}sfx('fan');fin('s-widgets');unlockAchievement('widgets_master');}else{fb('fbRoute','Hay pasos fuera de orden. Revisa el arreglo.',false);sfx('no');}}
function nextRoute(){sfx('click');currentRouteIdx=(currentRouteIdx+1)%routeSets.length;buildRoute();showToast('🔄 Secuencia: '+routeSets[currentRouteIdx].label);}

// Widget 2: Identifica el astro o concepto
const neuronPartes=[
  {desc:'La estrella del centro del sistema solar',ans:'El Sol',opts:['El Sol','La Luna','Marte','La Tierra']},
  {desc:'El satélite natural de la Tierra',ans:'La Luna',opts:['La Luna','El Sol','Venus','Un cometa']},
  {desc:'El planeta donde vivimos',ans:'La Tierra',opts:['La Tierra','Júpiter','El Sol','La Luna']},
  {desc:'Astro que tiene luz propia',ans:'Estrella',opts:['Estrella','Planeta','Satélite','Cometa']},
  {desc:'Astro que gira alrededor de un planeta',ans:'Satélite',opts:['Satélite','Estrella','Galaxia','Sol']},
  {desc:'Enorme grupo de estrellas',ans:'Galaxia',opts:['Galaxia','Planeta','Cometa','Luna']},
  {desc:'Astro de hielo y polvo que forma una cola',ans:'Cometa',opts:['Cometa','Estrella','Satélite','Planeta']},
  {desc:'Movimiento de la Tierra que produce el día y la noche',ans:'Rotación',opts:['Rotación','Traslación','Eclipse','Fase']},
];
let neuronIdx=0,neuronDone=false;
function showNeuron(){neuronDone=false;if(neuronIdx>=neuronPartes.length){const el=document.getElementById('neuronDesc');if(el)el.textContent='🎉 ¡Todos los astros y conceptos identificados!';const opts=document.getElementById('neuronOpts');if(opts)opts.innerHTML='';fin('s-widgets');return;}const d=neuronPartes[neuronIdx];const prog=document.getElementById('neuronProg');if(prog)prog.textContent=`Pista ${neuronIdx+1} de ${neuronPartes.length}`;const desc=document.getElementById('neuronDesc');if(desc)desc.textContent=d.desc;const opts=document.getElementById('neuronOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=opt;b.onclick=()=>checkNeuron(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuron');if(fbEl)fbEl.classList.remove('show');}
function checkNeuron(opt,btn,d){if(neuronDone)return;neuronDone=true;document.querySelectorAll('#neuronOpts .cmp-opt').forEach(b=>{if(b.textContent===d.ans)b.classList.add('correct');else if(b===btn&&b.textContent!==d.ans)b.classList.add('wrong');});const isOk=opt===d.ans;if(isOk){fb('fbNeuron','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuron_'+neuronIdx)){xpTracker.wgt.add('neuron_'+neuronIdx);pts(3);}sfx('ok');}else{fb('fbNeuron','La respuesta correcta es: '+d.ans,false);sfx('no');}}
function nextNeuron(){sfx('click');neuronIdx++;showNeuron();}
function resetNeuron(){sfx('click');neuronIdx=0;showNeuron();}

// Widget 3: Órgano → Función
const neuroPairs=[
  {trans:'El Sol',func:'Da luz y calor a la Tierra',opts:['Da luz y calor a la Tierra','Gira alrededor de la Tierra','No tiene luz propia','Es un satélite']},
  {trans:'La Luna',func:'Gira alrededor de la Tierra',opts:['Gira alrededor de la Tierra','Da luz propia','Es una estrella','Está en el centro del sistema solar']},
  {trans:'Rotación',func:'Produce el día y la noche',opts:['Produce el día y la noche','Produce las estaciones','Forma los eclipses','Dura un año']},
  {trans:'Traslación',func:'Produce las estaciones del año',opts:['Produce las estaciones del año','Produce el día y la noche','Dura 24 horas','Ilumina la Luna']},
  {trans:'Estrella',func:'Astro que tiene luz propia',opts:['Astro que tiene luz propia','Gira alrededor de un planeta','No tiene luz propia','Es un satélite']},
];
let neuroIdx=0,neuroDone=false;
function showNeuro(){neuroDone=false;if(neuroIdx>=neuroPairs.length){const el=document.getElementById('neuroTrans');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('neuroOpts');if(opts)opts.innerHTML='';return;}const d=neuroPairs[neuroIdx];const prog=document.getElementById('neuroProg');if(prog)prog.textContent=`${neuroIdx+1} de ${neuroPairs.length}`;const trans=document.getElementById('neuroTrans');if(trans)trans.textContent=d.trans;const opts=document.getElementById('neuroOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkNeuro(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuro');if(fbEl)fbEl.classList.remove('show');}
function checkNeuro(opt,btn,d){if(neuroDone)return;neuroDone=true;document.querySelectorAll('#neuroOpts .qz-opt').forEach(b=>{if(b.textContent===d.func)b.classList.add('correct');else if(b===btn&&b.textContent!==d.func)b.classList.add('wrong');});const isOk=opt===d.func;if(isOk){fb('fbNeuro','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuro_'+neuroIdx)){xpTracker.wgt.add('neuro_'+neuroIdx);pts(3);}sfx('ok');}else{fb('fbNeuro','Correcto: '+d.func,false);sfx('no');}setTimeout(()=>{neuroIdx++;showNeuro();},1800);}
function resetNeuro(){sfx('click');neuroIdx=0;showNeuro();}

// Widget 4: Órgano → ¿A qué sistema pertenece?
const enfermedadData=[
  {disease:'El Sol',characteristic:'Estrella',opts:['Estrella','Planeta','Satélite']},
  {disease:'La Tierra',characteristic:'Planeta',opts:['Planeta','Estrella','Satélite']},
  {disease:'La Luna',characteristic:'Satélite',opts:['Satélite','Estrella','Planeta']},
  {disease:'Marte',characteristic:'Planeta',opts:['Planeta','Estrella','Satélite']},
  {disease:'Una estrella lejana',characteristic:'Estrella',opts:['Estrella','Planeta','Satélite']},
  {disease:'Júpiter',characteristic:'Planeta',opts:['Planeta','Estrella','Satélite']},
];
let enferIdx=0,enferDone=false;
function showEnfer(){enferDone=false;if(enferIdx>=enfermedadData.length){const el=document.getElementById('enferDisease');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('enferOpts');if(opts)opts.innerHTML='';return;}const d=enfermedadData[enferIdx];const prog=document.getElementById('enferProg');if(prog)prog.textContent=`${enferIdx+1} de ${enfermedadData.length}`;const dis=document.getElementById('enferDisease');if(dis)dis.textContent=d.disease;const opts=document.getElementById('enferOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkEnfer(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbEnfer');if(fbEl)fbEl.classList.remove('show');}
function checkEnfer(opt,btn,d){if(enferDone)return;enferDone=true;document.querySelectorAll('#enferOpts .qz-opt').forEach(b=>{if(b.textContent===d.characteristic)b.classList.add('correct');else if(b===btn&&b.textContent!==d.characteristic)b.classList.add('wrong');});const isOk=opt===d.characteristic;if(isOk){fb('fbEnfer','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('enfer_'+enferIdx)){xpTracker.wgt.add('enfer_'+enferIdx);pts(3);}sfx('ok');}else{fb('fbEnfer','Correcto: '+d.characteristic,false);sfx('no');}setTimeout(()=>{enferIdx++;showEnfer();},1800);}
function resetEnfer(){sfx('click');enferIdx=0;showEnfer();}

// ===================== RETO FINAL =====================
const retoPairs=[
  {label:['Rotación','Traslación'],btnA:'🔁 Rotación',btnB:'🔃 Traslación',colA:'rot',colB:'tras',
   words:[{w:'Gira sobre sí misma',t:'rot'},{w:'Gira alrededor del Sol',t:'tras'},{w:'Día y noche',t:'rot'},{w:'Las estaciones',t:'tras'},{w:'Dura 24 horas',t:'rot'},{w:'Dura un año',t:'tras'},{w:'Dura un día',t:'rot'},{w:'Dura 365 días',t:'tras'},{w:'Sobre su eje',t:'rot'},{w:'Recorre su órbita',t:'tras'}]},
  {label:['Con luz propia','Sin luz propia'],btnA:'⭐ Luz propia',btnB:'🪐 Sin luz propia',colA:'luz',colB:'sinluz',
   words:[{w:'El Sol',t:'luz'},{w:'La Luna',t:'sinluz'},{w:'Las estrellas',t:'luz'},{w:'Los planetas',t:'sinluz'},{w:'La Tierra',t:'sinluz'},{w:'Marte',t:'sinluz'},{w:'Una estrella lejana',t:'luz'},{w:'Un satélite',t:'sinluz'},{w:'Venus',t:'sinluz'},{w:'El astro que nos da calor',t:'luz'}]},
  {label:['Astro','No es astro'],btnA:'✨ Astro',btnB:'🚫 No es astro',colA:'astro',colB:'no',
   words:[{w:'Estrella',t:'astro'},{w:'Nube',t:'no'},{w:'Planeta',t:'astro'},{w:'Montaña',t:'no'},{w:'Cometa',t:'astro'},{w:'Río',t:'no'},{w:'Satélite',t:'astro'},{w:'Árbol',t:'no'},{w:'Galaxia',t:'astro'},{w:'Avión',t:'no'}]},
];
let currentRetoPairIdx=0,retoPool=[],retoOk=0,retoErr=0,retoTimerInt=null,retoSec=30,retoRunning=false,retoCurrent=null;
function updateRetoButtons(){const pair=retoPairs[currentRetoPairIdx];document.querySelectorAll('.reto-btns .btn')[0].textContent=pair.btnA;document.querySelectorAll('.reto-btns .btn')[1].textContent=pair.btnB;document.querySelectorAll('.reto-btns .btn')[0].onclick=()=>ansReto(pair.colA);document.querySelectorAll('.reto-btns .btn')[1].onclick=()=>ansReto(pair.colB);}
function startReto(){if(retoRunning)return;sfx('click');retoRunning=true;retoOk=0;retoErr=0;retoSec=30;retoPool=_shuffle([...retoPairs[currentRetoPairIdx].words,...retoPairs[currentRetoPairIdx].words]);showRetoWord();retoTimerInt=setInterval(()=>{retoSec--;sfx('tick');document.getElementById('retoTimer').textContent='⏱ '+retoSec;if(retoSec<=10)document.getElementById('retoTimer').style.color='var(--red)';if(retoSec<=0){clearInterval(retoTimerInt);endReto();}},1000);}
function showRetoWord(){if(retoPool.length===0)retoPool=_shuffle([...retoPairs[currentRetoPairIdx].words,...retoPairs[currentRetoPairIdx].words]);retoCurrent=retoPool.pop();document.getElementById('retoWord').textContent=retoCurrent.w;}
function ansReto(t){if(!retoRunning||!retoCurrent)return;const firstPlay=!xpTracker.reto.has(currentRetoPairIdx);if(t===retoCurrent.t){sfx('ok');retoOk++;if(firstPlay)pts(1);}else{sfx('no');retoErr++;if(firstPlay)pts(-1);}document.getElementById('retoScore').textContent=`✅ ${retoOk} correctas | ❌ ${retoErr} errores`;showRetoWord();}
function endReto(){retoRunning=false;document.getElementById('retoWord').textContent='🏁 ¡Tiempo!';document.getElementById('retoTimer').style.color='var(--pri)';xpTracker.reto.add(currentRetoPairIdx);const total=retoOk+retoErr;const pct=total>0?Math.round((retoOk/total)*100):0;fb('fbReto',`Resultado: ${retoOk}/${total} (${pct}%) ¡Bien hecho!`,true);fin('s-reto');sfx('fan');unlockAchievement('reto_hero');}
function nextRetoPair(){sfx('click');clearInterval(retoTimerInt);retoRunning=false;retoSec=30;retoOk=0;retoErr=0;currentRetoPairIdx=(currentRetoPairIdx+1)%retoPairs.length;updateRetoButtons();document.getElementById('retoTimer').textContent='⏱ 30';document.getElementById('retoTimer').style.color='var(--pri)';document.getElementById('retoWord').textContent='¡Prepárate!';document.getElementById('retoScore').textContent='✅ 0 correctas | ❌ 0 errores';document.getElementById('fbReto').classList.remove('show');showToast(`🔄 Pareja: ${retoPairs[currentRetoPairIdx].label[0]} vs ${retoPairs[currentRetoPairIdx].label[1]}`);}
function resetReto(){sfx('click');clearInterval(retoTimerInt);retoRunning=false;retoSec=30;retoOk=0;retoErr=0;document.getElementById('retoTimer').textContent='⏱ 30';document.getElementById('retoTimer').style.color='var(--pri)';document.getElementById('retoWord').textContent='¡Prepárate!';document.getElementById('retoScore').textContent='✅ 0 correctas | ❌ 0 errores';document.getElementById('fbReto').classList.remove('show');}

// ===================== TASK GENERATOR =====================
const identifyTaskDB=[
  {s:'El universo es todo lo que existe: el espacio y los astros.',type:'El universo'},
  {s:'El Sol es la estrella del sistema solar.',type:'El Sol'},
  {s:'La Luna es el satélite de la Tierra.',type:'La Luna'},
  {s:'La Tierra es el tercer planeta desde el Sol.',type:'La Tierra'},
  {s:'La rotación produce el día y la noche.',type:'La rotación'},
  {s:'La traslación produce las estaciones del año.',type:'La traslación'},
  {s:'Las estrellas tienen luz propia.',type:'Las estrellas'},
  {s:'Nuestra galaxia se llama Vía Láctea.',type:'La galaxia'},
  {s:'El cometa es un astro de hielo y polvo con cola.',type:'El cometa'},
  {s:'El sistema solar tiene ocho planetas.',type:'El sistema solar'},
];
const classifyTaskDB=[
  {w:'El Sol',gen:'Estrella que da luz y calor',n:'Estrella',g:'Nunca mirarlo directamente',t:'Está en el centro del sistema solar'},
  {w:'La Tierra',gen:'Planeta donde vivimos',n:'Planeta',g:'Cuidar el planeta y su naturaleza',t:'Es el tercer planeta desde el Sol'},
  {w:'La Luna',gen:'Satélite de la Tierra',n:'Satélite',g:'Observarla en sus distintas fases',t:'Refleja la luz del Sol'},
  {w:'Marte',gen:'Planeta rojo del sistema solar',n:'Planeta',g:'Se estudia con sondas espaciales',t:'Es el cuarto planeta desde el Sol'},
  {w:'La Vía Láctea',gen:'Galaxia donde está el Sol',n:'Galaxia',g:'Se observa en el cielo oscuro',t:'Tiene miles de millones de estrellas'},
];
const completeTaskDB=[
  {s:'El ___ es la estrella del sistema solar.',opts:['planeta','Sol','satélite'],ans:'Sol'},
  {s:'La ___ es el satélite de la Tierra.',opts:['estrella','Luna','galaxia'],ans:'Luna'},
  {s:'La ___ produce el día y la noche.',opts:['traslación','rotación','órbita'],ans:'rotación'},
  {s:'La ___ produce las estaciones del año.',opts:['rotación','traslación','fase'],ans:'traslación'},
  {s:'El sistema solar tiene ___ planetas.',opts:['seis','siete','ocho'],ans:'ocho'},
  {s:'Las ___ tienen luz propia.',opts:['estrellas','planetas','lunas'],ans:'estrellas'},
  {s:'Nuestra galaxia es la ___.',opts:['Osa Mayor','Vía Láctea','Andrómeda'],ans:'Vía Láctea'},
  {s:'La Luna ___ la luz del Sol.',opts:['produce','refleja','apaga'],ans:'refleja'},
];
const explainQuestions=[
  {q:'¿Qué es el universo y qué hay en él?',ans:'El universo es todo lo que existe: el espacio y todos los astros (estrellas, planetas, satélites, galaxias, cometas). Es tan grande que no conocemos sus límites.'},
  {q:'¿Qué diferencia hay entre una estrella, un planeta y un satélite?',ans:'La estrella tiene luz propia (como el Sol); el planeta gira alrededor de una estrella y no tiene luz propia; el satélite gira alrededor de un planeta (como la Luna).'},
  {q:'¿Qué es el sistema solar y qué lo forma?',ans:'Es el Sol y todos los astros que giran a su alrededor: ocho planetas, sus satélites y otros cuerpos como asteroides y cometas. El Sol está en el centro.'},
  {q:'¿Qué diferencia hay entre la rotación y la traslación de la Tierra?',ans:'La rotación es el giro de la Tierra sobre sí misma; dura un día y produce el día y la noche. La traslación es el giro alrededor del Sol; dura un año y produce las estaciones.'},
  {q:'¿Por qué el Sol es importante para la vida?',ans:'Porque da luz y calor a la Tierra. Sin el Sol no habría vida: las plantas, los animales y las personas lo necesitan.'},
];
let ansVisible=false;
function genTask(){sfx('click');const type=document.getElementById('tgType').value;const count=parseInt(document.getElementById('tgCount').value);ansVisible=false;const out=document.getElementById('tgOut');out.innerHTML='';if(type==='identify')genIdentifyTask(out,count);else if(type==='classify')genClassifyTask(out,count);else if(type==='complete')genCompleteTask(out,count);else if(type==='explain')genExplainTask(out,count);fin('s-tareas');}
function _instrBlock(out,title,lines){const ib=document.createElement('div');ib.className='tg-instruction-block';ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join('');out.appendChild(ib);}
function genIdentifyTask(out,count){_instrBlock(out,'Instrucción',['Copia en tu cuaderno; subraya, colorea o encierra el concepto indicado en cada oración. Escribe al lado a qué astro o concepto del universo se refiere.','<strong>Ejemplo:</strong> El Sol es una estrella. → <span style="color:var(--jade);font-weight:700;">El Sol</span>']);_pick(identifyTaskDB,Math.min(count,identifyTaskDB.length)).forEach((item,i)=>{const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.type}</div></div>`;out.appendChild(div);});}
function genClassifyTask(out,count){_instrBlock(out,'Instrucción',['Copia la siguiente tabla en tu cuaderno. Para cada astro, completa su descripción, qué tipo de astro es, una curiosidad y un dato.']);const items=_pick(classifyTaskDB,Math.min(count,classifyTaskDB.length));const wrap=document.createElement('div');wrap.style.overflowX='auto';const th=(t,extra='')=>`<th style="padding:0.3rem 0.4rem;border:1px solid var(--border);font-size:0.72rem;text-align:center;${extra}">${t}</th>`;let html=`<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:520px;"><thead><tr style="background:var(--pri-gl);">${th('Astro','text-align:left;')}${th('Descripción')}${th('Tipo')}${th('Curiosidad')}${th('Dato')}</tr></thead><tbody>`;items.forEach(it=>{html+=`<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td>`+Array(4).fill(`<td style="padding:0.4rem;border:1px solid var(--border);min-width:50px;"></td>`).join('')+'</tr>';});html+='</tbody></table>';wrap.innerHTML=html;out.appendChild(wrap);const ans=document.createElement('div');ans.className='tg-answer';ans.style.marginTop='0.8rem';ans.innerHTML='<strong>✅ Respuestas:</strong><br>'+items.map(it=>`<strong>${it.w}:</strong> Descripción: ${it.gen} | Tipo: ${it.n} | Curiosidad: ${it.g} | Dato: ${it.t}`).join('<br>');out.appendChild(ans);}
function genCompleteTask(out,count){_instrBlock(out,'Instrucción',['Copia y resuelve en tu cuaderno. Cada oración tiene un espacio ___. Elige y escribe la opción correcta.']);const pool=_shuffle([...completeTaskDB]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';const sent=item.s.replace('___','<span class="tg-blank" style="min-width:90px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${sent}</strong><div style="margin-top:0.4rem;font-size:0.82rem;color:var(--gray);">📝 Opciones: <strong>${item.opts.join(' | ')}</strong></div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function genExplainTask(out,count){_instrBlock(out,'Instrucción',['Copia las siguientes preguntas en tu cuaderno y responde cada una de forma clara y completa.']);const pool=_shuffle([...explainQuestions]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.3rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function toggleAns(){ansVisible=!ansVisible;document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none');sfx('click');}

// ===================== SOPA DE LETRAS =====================
const sopaSets=[
  {size:10,grid:[
    ['C','D','O','N','O','T','R','E','N','O'],
    ['L','O','S','P','W','D','X','F','X','Z'],
    ['V','A','I','X','A','L','A','G','Y','T'],
    ['C','K','O','V','Q','V','E','K','Z','D'],
    ['H','B','A','P','A','R','R','E','I','T'],
    ['J','Z','N','L','N','F','R','S','T','T'],
    ['J','Y','U','A','T','E','N','A','L','P'],
    ['Z','G','L','Z','C','B','R','D','Z','X'],
    ['B','Z','V','N','Y','G','G','N','O','T'],
    ['V','E','S','T','R','E','L','L','A','M']
  ],words:[
    {w:'SOL',cells:[[1,2],[1,1],[1,0]]},
    {w:'LUNA',cells:[[7,2],[6,2],[5,2],[4,2]]},
    {w:'TIERRA',cells:[[4,9],[4,8],[4,7],[4,6],[4,5],[4,4]]},
    {w:'PLANETA',cells:[[6,9],[6,8],[6,7],[6,6],[6,5],[6,4],[6,3]]},
    {w:'ESTRELLA',cells:[[9,1],[9,2],[9,3],[9,4],[9,5],[9,6],[9,7],[9,8]]},
    {w:'GALAXIA',cells:[[2,7],[2,6],[2,5],[2,4],[2,3],[2,2],[2,1]]}
  ]},
  {size:10,grid:[
    ['D','T','K','O','X','C','Y','N','E','T'],
    ['T','D','I','S','V','C','E','K','T','R'],
    ['N','W','L','R','H','O','T','K','I','A'],
    ['Z','V','L','E','L','M','R','N','L','S'],
    ['Y','Y','H','V','F','E','A','K','E','L'],
    ['H','F','T','I','G','T','M','F','T','A'],
    ['I','U','Y','N','B','A','L','L','A','C'],
    ['B','I','R','U','V','V','F','S','S','I'],
    ['N','O','I','C','A','T','O','R','B','O'],
    ['H','P','V','N','B','Q','U','L','S','N']
  ],words:[
    {w:'ROTACION',cells:[[8,7],[8,6],[8,5],[8,4],[8,3],[8,2],[8,1],[8,0]]},
    {w:'TRASLACION',cells:[[0,9],[1,9],[2,9],[3,9],[4,9],[5,9],[6,9],[7,9],[8,9],[9,9]]},
    {w:'COMETA',cells:[[1,5],[2,5],[3,5],[4,5],[5,5],[6,5]]},
    {w:'SATELITE',cells:[[7,8],[6,8],[5,8],[4,8],[3,8],[2,8],[1,8],[0,8]]},
    {w:'UNIVERSO',cells:[[7,3],[6,3],[5,3],[4,3],[3,3],[2,3],[1,3],[0,3]]},
    {w:'MARTE',cells:[[5,6],[4,6],[3,6],[2,6],[1,6]]}
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
  {q:'El universo es todo lo que existe: el espacio y los astros.',a:true},
  {q:'Los planetas tienen luz propia.',a:false},
  {q:'Las estrellas tienen luz propia.',a:true},
  {q:'El Sol es la estrella del sistema solar.',a:true},
  {q:'La Luna es un planeta.',a:false},
  {q:'La Luna es el satélite de la Tierra.',a:true},
  {q:'El sistema solar tiene ocho planetas.',a:true},
  {q:'La rotación de la Tierra produce el día y la noche.',a:true},
  {q:'La traslación de la Tierra produce las estaciones.',a:true},
  {q:'La Tierra es el tercer planeta desde el Sol.',a:true},
  {q:'La Luna tiene luz propia.',a:false},
  {q:'Nuestra galaxia se llama Vía Láctea.',a:true},
  {q:'Un satélite gira alrededor de un planeta.',a:true},
  {q:'La rotación de la Tierra dura un año.',a:false},
  {q:'El cometa es un astro de hielo y polvo con cola.',a:true},
];
const evalMCBank=[
  {q:'¿Qué es el universo?',o:['a) Solo la Tierra','b) Todo lo que existe: el espacio y los astros','c) Solo el Sol','d) Solo la Luna'],a:1},
  {q:'¿Qué astro tiene luz propia?',o:['a) El planeta','b) El satélite','c) La estrella','d) El cometa'],a:2},
  {q:'¿Qué es un planeta?',o:['a) Un astro con luz propia','b) Un astro que gira alrededor de una estrella','c) Una galaxia','d) Un cometa'],a:1},
  {q:'¿Cuál es la estrella del sistema solar?',o:['a) La Luna','b) El Sol','c) Marte','d) La Tierra'],a:1},
  {q:'¿Cuál es el satélite de la Tierra?',o:['a) El Sol','b) Venus','c) La Luna','d) Júpiter'],a:2},
  {q:'¿Cuántos planetas tiene el sistema solar?',o:['a) Seis','b) Siete','c) Ocho','d) Diez'],a:2},
  {q:'¿Qué movimiento produce el día y la noche?',o:['a) La traslación','b) La rotación','c) El eclipse','d) La fase lunar'],a:1},
  {q:'¿Qué movimiento produce las estaciones?',o:['a) La rotación','b) La traslación','c) La fase lunar','d) El eclipse'],a:1},
  {q:'¿Cómo se llama nuestra galaxia?',o:['a) El Sistema Solar','b) La Osa Mayor','c) La Vía Láctea','d) Andrómeda'],a:2},
  {q:'¿Qué astro gira alrededor de un planeta?',o:['a) La estrella','b) El satélite','c) La galaxia','d) El Sol'],a:1},
  {q:'¿Qué planeta es el nuestro?',o:['a) Marte','b) La Tierra','c) Venus','d) Saturno'],a:1},
  {q:'¿Cuánto dura la rotación de la Tierra?',o:['a) Un año','b) Un día (24 horas)','c) Un mes','d) Una hora'],a:1},
  {q:'¿Qué astro es de hielo y polvo y forma una cola?',o:['a) La estrella','b) El cometa','c) El planeta','d) El satélite'],a:1},
  {q:'La Luna no tiene luz propia: ella…',o:['a) produce luz','b) refleja la luz del Sol','c) apaga la luz','d) no se ve nunca'],a:1},
  {q:'El astro que da luz y calor a la Tierra es…',o:['a) la Luna','b) el Sol','c) Marte','d) una galaxia'],a:1},
];
const evalCPBank=[
  {q:'El ___ es la estrella del sistema solar.',a:'Sol'},
  {q:'La ___ es el satélite de la Tierra.',a:'Luna'},
  {q:'La ___ produce el día y la noche.',a:'rotación'},
  {q:'La ___ produce las estaciones del año.',a:'traslación'},
  {q:'El sistema solar tiene ___ planetas.',a:'ocho'},
  {q:'Las ___ tienen luz propia.',a:'estrellas'},
  {q:'Nuestra galaxia es la ___ Láctea.',a:'Vía'},
  {q:'La Luna ___ la luz del Sol.',a:'refleja'},
  {q:'La Tierra es el ___ planeta desde el Sol.',a:'tercer'},
  {q:'Un ___ gira alrededor de un planeta.',a:'satélite'},
  {q:'El ___ es un astro de hielo y polvo con cola.',a:'cometa'},
  {q:'Un enorme grupo de estrellas es una ___.',a:'galaxia'},
  {q:'La rotación de la Tierra dura un ___.',a:'día'},
  {q:'La traslación de la Tierra dura un ___.',a:'año'},
  {q:'El astro que nos da luz y calor es el ___.',a:'Sol'},
];
const evalPRBank=[
  {term:'Universo',def:'Todo lo que existe: el espacio y los astros'},
  {term:'Estrella',def:'Astro que tiene luz propia'},
  {term:'Planeta',def:'Gira alrededor de una estrella; sin luz propia'},
  {term:'Satélite',def:'Gira alrededor de un planeta'},
  {term:'El Sol',def:'La estrella del sistema solar'},
  {term:'La Tierra',def:'El planeta donde vivimos'},
  {term:'La Luna',def:'El satélite de la Tierra'},
  {term:'Galaxia',def:'Enorme grupo de estrellas'},
  {term:'Vía Láctea',def:'El nombre de nuestra galaxia'},
  {term:'Cometa',def:'Astro de hielo y polvo con cola'},
  {term:'Rotación',def:'Giro de la Tierra sobre sí misma (día y noche)'},
  {term:'Traslación',def:'Giro de la Tierra alrededor del Sol (un año)'},
  {term:'Sistema Solar',def:'El Sol y los astros que giran a su alrededor'},
  {term:'Eclipse',def:'Cuando un astro tapa la luz de otro'},
  {term:'Fases de la Luna',def:'Los distintos aspectos con que vemos la Luna'},
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

function genEval(){sfx('click');_evalFormaSelector(); const _selF = document.getElementById('evalFormaSel'); if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10))); const cf = evalFormNum; const rng = _evalRng(cf); window._currentEvalForm=cf;evalFormNum = (evalFormNum % EVAL_FORMAS) + 1; _evalFormaSelector();saveProgress();document.getElementById('eval-screen-title').textContent=`🎓 Evaluación Final · Forma ${cf} · El Universo y el Sistema Solar`;evalAnsVisible=false;const out=document.getElementById('evalOut');out.innerHTML='';const bar=document.createElement('div');bar.className='eval-score-bar';bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje · 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25 pts</span><span class="eval-score-pill esp-tf">V/F 25 pts</span><span class="eval-score-pill esp-mc">Selección 25 pts</span><span class="eval-score-pill esp-pr">Pareados 25 pts</span></div>`;out.appendChild(bar);const cpItems=_pickF(evalCPBank,5, rng);const s1=document.createElement('div');s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';cpItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='cp';d.dataset.evalIndex=i;const qHtml=item.q.replace('___',`<input class="eval-cp-input" type="text" data-cp="${i}" autocomplete="off">`);d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbCp${i}" aria-live="polite"></div>`;s1.appendChild(d);});out.appendChild(s1);const tfItems=_pickF(evalTFBank,5, rng);const s2=document.createElement('div');s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';tfItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='tf';d.dataset.evalIndex=i;d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="true"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="false"> Falso</label></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbTf${i}" aria-live="polite"></div>`;s2.appendChild(d);});out.appendChild(s2);const mcItems=_pickF(evalMCBank,5, rng);const s3=document.createElement('div');s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';mcItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='mc';d.dataset.evalIndex=i;const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join('');d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbMc${i}" aria-live="polite"></div>`;s3.appendChild(d);});out.appendChild(s3);const prItems=_pickF(evalPRBank,5, rng);const shuffledDefs=_shuffleF(prItems, rng);const letters=['A','B','C','D','E'];const s4=document.createElement('div');s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';const matchCard=document.createElement('div');matchCard.className='eval-item';let colLeft='<div class="eval-match-col"><h4>📌 Términos</h4>';prItems.forEach((item,i)=>{colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> <select class="eval-match-select" data-pr="${i}" aria-label="Respuesta pareada ${i+16}"><option value="">—</option>${letters.map(l=>`<option value="${l}">${l}</option>`).join('')}</select> ${item.term}</div>`;});colLeft+='</div>';let colRight='<div class="eval-match-col"><h4>🔑 Definiciones</h4>';shuffledDefs.forEach((item,i)=>{colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`;});colRight+='</div>';const ansKey=prItems.map((item,i)=>{const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)];return`${i+16}→${letter}`;}).join(' · ');matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div><div class="eval-item-feedback" id="evalFbPr" aria-live="polite"></div>`;s4.appendChild(matchCard);out.appendChild(s4);window._evalPrintData={tf:tfItems,mc:mcItems,cp:cpItems,pr:{terms:prItems,shuffledDefs,letters}};const autoPanel=document.createElement('div');autoPanel.id='evalAutoResult';autoPanel.className='eval-auto-result';autoPanel.innerHTML='<strong>🧮 Evaluación interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato original sin respuestas digitadas.';out.appendChild(autoPanel);fin('s-evaluacion');}
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación El Universo y el Sistema Solar · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.12rem 0.4rem;margin:0.22rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #27ae60;background:#e8f8f5;color:#27ae60;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#27ae60;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #27ae60;height:12px;}.obt-pct{white-space:nowrap;}.qn{font-weight:700;min-width:22px;flex-shrink:0;}.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:40px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.18rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.14rem 0.35rem;margin-bottom:0.1rem;break-inside:avoid;page-break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.3;display:flex;gap:0.28rem;margin-bottom:0.07rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.1rem 0.5rem;}.mc-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:0.04rem 0.15rem;margin-left:0.8rem;}.mc-opt{font-size:9pt;display:flex;align-items:center;gap:0.15rem;}.mc-opt input{width:10px;height:10px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{margin-top:0.1rem;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.08rem 0.4rem;margin-top:0.08rem;}.pr-head{font-size:9pt;font-weight:700;color:#555;margin-bottom:0.1rem;}.pr-item{font-size:10.5pt;padding:0.1rem 0.28rem;background:#e8f8f5;border-radius:3px;margin-bottom:0.07rem;display:flex;align-items:center;gap:0.2rem;line-height:1.2;break-inside:avoid;page-break-inside:avoid;}.pr-num{font-weight:700;color:#27ae60;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.22rem;padding:0.15rem 0;page-break-before:avoid;break-before:avoid;color:#27ae60;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #27ae60;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#555;}.pa{color:#007a00;font-weight:600;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · El Universo y el Sistema Solar · Educación Básica · Ciencias Naturales</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Evaluación Final · El Universo y el Sistema Solar · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u</div></div><div class="p-grid">${pR}</div>
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
  {txt:'De día no vemos las estrellas, pero de noche el cielo se llena de ellas.',
   g:['Se observa el paso del día a la noche: de día la luz del Sol nos impide ver las estrellas.',
      'De día la fuerte luz del Sol tapa la luz débil de las estrellas; de noche nuestro lado de la Tierra mira al espacio oscuro y las vemos.',
      'El Sol (con su luz) y la rotación de la Tierra.',
      'Nos ayuda a entender la rotación de la Tierra, medir el tiempo y despertar la curiosidad por la ciencia.']},
  {txt:'En un lugar de la Tierra es de día mientras que en otro, al mismo tiempo, es de noche.',
   g:['Se observa el día y la noche ocurriendo a la vez en distintos lugares de la Tierra.',
      'La Tierra es redonda y gira sobre sí misma; el Sol solo ilumina la mitad que da hacia él, así que una mitad tiene día y la otra, noche.',
      'La rotación de la Tierra (junto con la luz del Sol).',
      'Nos ayuda a comprender por qué no amanece a la misma hora en todo el mundo y a medir el tiempo.']},
  {txt:'A lo largo del año, en Honduras hay una época seca y una época lluviosa.',
   g:['Se observa el cambio de estaciones (época seca y época lluviosa) a lo largo del año.',
      'La traslación de la Tierra alrededor del Sol hace que a lo largo del año cambie el clima en cada región.',
      'La traslación de la Tierra alrededor del Sol.',
      'Nos ayuda a planificar la siembra y la cosecha, prepararnos para las lluvias y entender el clima de Honduras.']},
  {txt:'Cada cierto tiempo la Luna se ve completa (llena) y otras veces no se ve (nueva).',
   g:['Se observan las fases de la Luna.',
      'La Luna gira alrededor de la Tierra y el Sol la ilumina desde distintas posiciones; según dónde esté, vemos más o menos parte iluminada.',
      'La Luna (su giro alrededor de la Tierra) y la luz del Sol que la ilumina.',
      'Nos ayuda a seguir el calendario, entender las mareas y apreciar los movimientos de los astros.']},
  {txt:'Un niño cree que el Sol se mueve alrededor de la Tierra porque lo ve salir y ponerse.',
   g:['Se observa el movimiento aparente del Sol: parece salir y ponerse (amanecer y anochecer).',
      'El Sol no gira alrededor de la Tierra: es la Tierra la que gira sobre sí misma (rotación), y por eso el Sol parece cruzar el cielo.',
      'La rotación de la Tierra (no el Sol).',
      'Nos ayuda a corregir ideas equivocadas y a pensar con base científica, no solo con lo que "parece".']},
  {txt:'Miramos una estrella muy lejana y la vemos como un puntito, aunque es gigante.',
   g:['Se observa una estrella lejana que se ve como un pequeño puntito de luz.',
      'La estrella está tan lejos que su luz nos llega muy débil y la vemos pequeña, aunque en realidad es enorme (muchas son más grandes que el Sol).',
      'La estrella (por su enorme distancia) y su luz propia.',
      'Nos ayuda a dimensionar el tamaño del universo, valorar las distancias del espacio y usar telescopios para estudiarlo.']},
];
const critCaseQuestions=[
  '1. ¿Qué fenómeno del universo o del sistema solar se observa en este caso?',
  '2. ¿Por qué ocurre? Relaciónalo con los astros o los movimientos de la Tierra.',
  '3. ¿Qué astro o movimiento es el responsable?',
  '4. ¿Por qué es importante observar y conocer el cielo?',
];
const critErrorBank=[
  {txt:'"Los planetas tienen luz propia igual que las estrellas."',
   g1:'Los planetas NO tienen luz propia.',
   g2:'Solo las ESTRELLAS (como el Sol) tienen luz propia.'},
  {txt:'"La Luna es un planeta que gira alrededor del Sol."',
   g1:'La Luna es un SATÉLITE, no un planeta.',
   g2:'La Luna gira alrededor de la TIERRA, no del Sol.'},
  {txt:'"La rotación de la Tierra produce las estaciones del año."',
   g1:'La rotación produce el DÍA Y LA NOCHE.',
   g2:'Las estaciones las produce la TRASLACIÓN.'},
  {txt:'"El Sol gira alrededor de la Tierra."',
   g1:'Es la TIERRA la que gira alrededor del Sol.',
   g2:'Vemos salir y ponerse el Sol por la ROTACIÓN de la Tierra.'},
  {txt:'"La Luna tiene luz propia."',
   g1:'La Luna NO tiene luz propia.',
   g2:'La Luna REFLEJA la luz del Sol.'},
];
const critDecisionBank=[
  'Para observar bien las estrellas, es mejor hacerlo en la ciudad con muchas luces, o en el campo con el cielo oscuro.',
  'Para conocer mejor los planetas lejanos, conviene usar un telescopio, o mirar solo a simple vista.',
  'Para saber la hora aproximada de día, podemos guiarnos por la posición del Sol, o adivinar sin observar.',
  'Para cuidar la vista al observar el cielo, nunca debemos mirar directamente al Sol, o podemos mirarlo fijamente.',
  'Para aprender sobre el universo, conviene leer, observar y preguntar, o quedarse con ideas equivocadas.',
];
const critDecisionGuide='La mejor decisión es la que se apoya en la observación y la ciencia: mirar el cielo en lugares oscuros, usar telescopios, guiarse por el Sol con cuidado (nunca mirarlo directamente) e informarse leyendo y preguntando. Observar y estudiar el universo con curiosidad nos ayuda a entender mejor nuestro planeta y el cielo.';
const critCompareBank=[
  {a:'Astro que tiene luz propia.',b:'Astro que gira alrededor de una estrella y no tiene luz propia.',
   ga:'La estrella (como el Sol).',
   gb:'El planeta.',
   gr:'Los dos son astros, pero la estrella brilla con luz propia y el planeta solo refleja la luz de su estrella.'},
  {a:'Giro de la Tierra sobre sí misma.',b:'Giro de la Tierra alrededor del Sol.',
   ga:'La rotación.',
   gb:'La traslación.',
   gr:'Los dos son movimientos de la Tierra, pero la rotación produce el día y la noche y la traslación produce las estaciones.'},
  {a:'El astro que da luz y calor al sistema solar.',b:'El satélite que gira alrededor de la Tierra.',
   ga:'El Sol.',
   gb:'La Luna.',
   gr:'El Sol es una estrella con luz propia y la Luna es un satélite que refleja la luz del Sol; son astros muy diferentes.'},
  {a:'La Luna se coloca entre el Sol y la Tierra y tapa la luz del Sol.',b:'La Tierra se coloca entre el Sol y la Luna y le tapa la luz.',
   ga:'El eclipse de Sol.',
   gb:'El eclipse de Luna.',
   gr:'En los dos, un astro tapa la luz de otro, pero en el eclipse de Sol la Luna cubre al Sol, y en el de Luna es la sombra de la Tierra la que cubre a la Luna.'},
  {a:'Planeta pequeño y sólido, como la Tierra o Marte.',b:'Planeta enorme formado sobre todo por gas, como Júpiter o Saturno.',
   ga:'El planeta rocoso.',
   gb:'El planeta gigante gaseoso.',
   gr:'Los dos son planetas que giran alrededor del Sol y no tienen luz propia, pero los rocosos son pequeños y sólidos y los gigantes gaseosos son enormes y de gas.'},
  {a:'El Sol y todos los astros que giran a su alrededor.',b:'Enorme grupo de millones de estrellas.',
   ga:'El sistema solar.',
   gb:'La galaxia (Vía Láctea).',
   gr:'El sistema solar es solo nuestro Sol con sus planetas; la galaxia es muchísimo más grande y contiene millones de estrellas como el Sol.'},
];
const critCauseBank=[
  {cause:'La Tierra gira sobre sí misma (rotación).',guide:'Se produce el día y la noche.'},
  {cause:'La Tierra gira alrededor del Sol (traslación).',guide:'Se producen las estaciones del año.'},
  {cause:'La Luna se coloca entre el Sol y la Tierra.',guide:'Ocurre un eclipse de Sol.'},
  {cause:'El Sol ilumina la Luna desde distintas posiciones.',guide:'Vemos las diferentes fases de la Luna.'},
];
const critEffectBank=[
  {effect:'En una parte de la Tierra es de día y en otra es de noche.',guide:'Es efecto de la rotación de la Tierra.'},
  {effect:'A lo largo del año cambian las estaciones.',guide:'Es efecto de la traslación de la Tierra alrededor del Sol.'},
  {effect:'De noche vemos las estrellas como puntitos de luz.',guide:'Están tan lejos que se ven pequeñas, aunque muchas son enormes.'},
  {effect:'La Luna se ve con distintas formas cada semana.',guide:'Son las fases de la Luna, según cómo la ilumina el Sol.'},
];
function genEvalCrit(){
  sfx('click');
  _injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });
  const _sC = document.getElementById('evalCritFormaSel');
  if (_sC && parseInt(_sC.value, 10)) evalCritFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sC.value, 10)));
  const cf=evalCritFormNum;window._currentEvalCritForm=cf;const rngC = _evalRng(200000 + cf);evalCritFormNum=(evalCritFormNum%EVAL_FORMAS)+1;_injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });saveProgress();
  document.getElementById('evalcrit-screen-title').textContent=`🧠 Pensamiento Crítico · Forma ${cf} · El Universo y el Sistema Solar`;
  evalCritAnsVisible=false;
  const out=document.getElementById('evalCritOut');out.innerHTML='';
  const kase=_pickF(critCaseBank,1,rngC)[0];
  const s1=document.createElement('div');
  s1.innerHTML=`<div class="eval-section-title">I. Caso de análisis: el universo y el cielo <span class="eval-pts">20 pts · 4 preguntas × 5 pts</span></div><div class="eval-item"><div class="crit-scenario">${kase.txt}</div>${critCaseQuestions.map((q,i)=>`<div class="crit-q-block"><div class="crit-q-label">${q}</div><textarea class="crit-textarea" rows="2" aria-label="${q}"></textarea><div class="crit-pauta">${kase.g[i]}</div></div>`).join('')}<div class="crit-selfscore"><label for="critScore0">Obtenido:</label><input type="number" id="critScore0" class="crit-score-input" data-score="0" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s1);
  const err=_pickF(critErrorBank,1,rngC)[0];
  const s2=document.createElement('div');
  s2.innerHTML=`<div class="eval-section-title">II. Corrige el error <span class="eval-pts">20 pts · 2 errores × 10 pts</span></div><div class="eval-item"><div class="crit-scenario">${err.txt}</div><p style="font-size:0.85rem;margin-bottom:0.5rem;">Identifica <strong>dos errores</strong> y corrígelos con tus propias palabras:</p><div class="crit-q-block"><div class="crit-q-label">Error 1 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 1 y su corrección"></textarea><div class="crit-pauta">${err.g1}</div></div><div class="crit-q-block"><div class="crit-q-label">Error 2 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 2 y su corrección"></textarea><div class="crit-pauta">${err.g2}</div></div><div class="crit-selfscore"><label for="critScore1">Obtenido:</label><input type="number" id="critScore1" class="crit-score-input" data-score="1" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s2);
  const dec=_pickF(critDecisionBank,1,rngC)[0];
  const s3=document.createElement('div');
  s3.innerHTML=`<div class="eval-section-title">III. Toma de decisiones: observar el cielo <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${dec}</div><div class="crit-q-block"><div class="crit-q-label">¿Qué opción recomendarías para conocer mejor el universo? Explica por qué, relacionándolo con los astros y los movimientos de la Tierra.</div><textarea class="crit-textarea" rows="4" aria-label="Recomendaciones y su justificación"></textarea><div class="crit-pauta">${critDecisionGuide}</div></div><div class="crit-selfscore"><label for="critScore2">Obtenido:</label><input type="number" id="critScore2" class="crit-score-input" data-score="2" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s3);
  const cmp=_pickF(critCompareBank,1,rngC)[0];
  const s4=document.createElement('div');
  s4.innerHTML=`<div class="eval-section-title">IV. Comparación razonada <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-compare-grid"><div class="crit-compare-box"><h5>Caso A</h5>${cmp.a}</div><div class="crit-compare-box"><h5>Caso B</h5>${cmp.b}</div></div><div class="crit-q-block"><div class="crit-q-label">1. ¿Qué astro o concepto corresponde a cada caso? 2. ¿Qué caracteriza a cada uno? 3. ¿Por qué no son lo mismo?</div><textarea class="crit-textarea" rows="4" aria-label="Comparación razonada de los casos A y B"></textarea><div class="crit-pauta">Caso A: ${cmp.ga} · Caso B: ${cmp.gb} · ${cmp.gr}</div></div><div class="crit-selfscore"><label for="critScore3">Obtenido:</label><input type="number" id="critScore3" class="crit-score-input" data-score="3" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s4);
  const causes=_pickF(critCauseBank,2,rngC),effects=_pickF(critEffectBank,3,rngC);
  let ceRows='';
  causes.forEach((it,i)=>{ceRows+=`<div class="crit-ce-item"><div class="crit-ce-row"><div class="crit-ce-cell crit-ce-given"><span class="crit-ce-tag">Causa</span>${it.cause}</div><div class="crit-ce-cell"><span class="crit-ce-tag">Efecto</span><textarea class="crit-textarea" rows="2" aria-label="Efecto de: ${it.cause}" placeholder="Escribe el efecto..."></textarea></div></div><div class="crit-pauta">${it.guide}</div></div>`;});
  effects.forEach((it,i)=>{ceRows+=`<div class="crit-ce-item"><div class="crit-ce-row"><div class="crit-ce-cell"><span class="crit-ce-tag">Causa</span><textarea class="crit-textarea" rows="2" aria-label="Causa de: ${it.effect}" placeholder="Escribe la causa..."></textarea></div><div class="crit-ce-cell crit-ce-given"><span class="crit-ce-tag">Efecto</span>${it.effect}</div></div><div class="crit-pauta">${it.guide}</div></div>`;});
  const s5=document.createElement('div');
  s5.innerHTML=`<div class="eval-section-title">V. Análisis de causas y efectos <span class="eval-pts">20 pts · 5 ítems × 4 pts</span></div><div class="eval-item"><p style="font-size:0.85rem;margin-bottom:0.5rem;">Completa la <strong>causa</strong> o el <strong>efecto</strong> que falta en cada fila (5 ítems × 4 pts).</p>${ceRows}<div class="crit-selfscore"><label for="critScore4">Obtenido:</label><input type="number" id="critScore4" class="crit-score-input" data-score="4" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
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
  let s1=`<div class="sec-title"><span>I. Caso de análisis: el universo y el cielo (4 preguntas × 5 pts)</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.kase.txt}</p>`;
  critCaseQuestions.forEach(q=>{s1+=`<p class="crit-print-q">${q}</p>${lines(1)}`;});
  let s2=`<div class="sec-title"><span>II. Corrige el error (2 errores × 10 pts)</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.err.txt}</p><p class="crit-print-q">Identifica dos errores y corrígelos con tus propias palabras:</p><p class="crit-print-q"><strong>Error 1:</strong></p>${lines(1)}<p class="crit-print-q"><strong>Error 2:</strong></p>${lines(1)}`;
  let s3=`<div class="sec-title"><span>III. Toma de decisiones: observar el cielo</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.dec}</p><p class="crit-print-q">¿Qué opción recomendarías para conocer mejor el universo? Explica por qué, relacionándolo con los astros y los movimientos de la Tierra.</p>${lines(2)}`;
  let s4=`<div class="sec-title"><span>IV. Comparación razonada</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><div class="crit-compare-print-grid"><div class="crit-compare-print-box"><strong>Caso A:</strong> ${d.cmp.a}</div><div class="crit-compare-print-box"><strong>Caso B:</strong> ${d.cmp.b}</div></div><p class="crit-print-q">1. ¿Qué astro o concepto corresponde a cada caso? 2. ¿Qué caracteriza a cada uno? 3. ¿Por qué no son lo mismo?</p>${lines(2)}`;
  let ceTbl='<table class="crit-print-tbl"><tr><th>Causa</th><th>Efecto</th></tr>';
  d.causes.forEach(it=>{ceTbl+=`<tr><td>${it.cause}</td><td></td></tr>`;});
  d.effects.forEach(it=>{ceTbl+=`<tr><td></td><td>${it.effect}</td></tr>`;});
  ceTbl+='</table>';
  let s5=`<div class="sec-title"><span>V. Análisis de causas y efectos (5 ítems × 4 pts)</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div>${ceTbl}`;
  let pR='';
  pR+=`<div class="p-sec"><div class="p-ttl">I. Caso</div>${critCaseQuestions.map((q,i)=>`<div class="p-crit-line"><strong>${i+1}.</strong> ${d.kase.g[i]}</div>`).join('')}</div>`;
  pR+=`<div class="p-sec"><div class="p-ttl">II. Corrige el error</div><div class="p-crit-line"><strong>Error 1:</strong> ${d.err.g1}</div><div class="p-crit-line"><strong>Error 2:</strong> ${d.err.g2}</div></div>`;
  pR+=`<div class="p-sec"><div class="p-ttl">III. Toma de decisiones</div><div class="p-crit-line">${critDecisionGuide}</div></div>`;
  pR+=`<div class="p-sec"><div class="p-ttl">IV. Comparación</div><div class="p-crit-line"><strong>Caso A:</strong> ${d.cmp.ga}</div><div class="p-crit-line"><strong>Caso B:</strong> ${d.cmp.gb}</div><div class="p-crit-line">${d.cmp.gr}</div></div>`;
  pR+=`<div class="p-sec" style="grid-column:1/-1;"><div class="p-ttl">V. Causas y efectos</div>${d.causes.map(it=>`<div class="p-crit-line"><strong>Causa:</strong> ${it.cause} → <strong>Efecto:</strong> ${it.guide}</div>`).join('')}${d.effects.map(it=>`<div class="p-crit-line"><strong>Efecto:</strong> ${it.effect} → <strong>Causa:</strong> ${it.guide}</div>`).join('')}</div>`;
  const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Pensamiento Crítico El Universo y el Sistema Solar · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.1rem 0.4rem;margin:0.2rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #27ae60;background:#e8f8f5;color:#27ae60;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#27ae60;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #27ae60;height:12px;}.obt-pct{white-space:nowrap;}.crit-print-scenario{font-size:10.5pt;background:#e8f8f5;border-left:3px solid #27ae60;padding:0.2rem 0.5rem;margin:0.1rem 0 0.2rem;line-height:1.3;}.crit-print-q{font-size:10pt;font-weight:600;margin:0.15rem 0 0.08rem;line-height:1.25;}.ln{border-bottom:1px solid #111;min-height:12px;margin-bottom:2px;}.crit-compare-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin:0.15rem 0;}.crit-compare-print-box{font-size:9.5pt;background:#e8f8f5;border-radius:4px;padding:0.25rem 0.4rem;line-height:1.25;}.crit-print-tbl{width:100%;border-collapse:collapse;font-size:9.5pt;margin-top:0.15rem;}.crit-print-tbl th,.crit-print-tbl td{border:1px solid #999;padding:0.3rem 0.45rem;text-align:left;height:30px;vertical-align:middle;}.crit-print-tbl th{background:#e8f8f5;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.08rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.9rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.45rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.1rem;margin-bottom:0.18rem;}.p-crit-line{font-size:11pt;color:#007a00;margin-bottom:0.18rem;line-height:1.35;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.2rem;padding:0.1rem 0;color:#27ae60;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #27ae60;}.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:12.7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalCritPage"><div class="ph"><h2>Evaluación Competencial · Pensamiento Crítico · El Universo y el Sistema Solar · Educación Básica · Ciencias Naturales</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 5 secciones de 20 puntos</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100</span></div></div><div class="pauta-wrap" id="pautaCritPage"><div class="p-head"><div class="p-main">✅ PAUTA — Pensamiento Crítico · El Universo y el Sistema Solar · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 5 secciones × 20 pts c/u — respuesta abierta, usar como guía de corrección</div></div><div class="p-grid">${pR}</div></div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("evalCritPage",250,0.55,1.2);fit("pautaCritPage",250,0.55,1.2);})();<\/script></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(doc);win.document.close();setTimeout(()=>win.print(),400);
}

// ===================== LABORATORIO DE ASTROS =====================
const parteData={
  sol:{
    nombre:'El Sol',icon:'☀️',
    estructura:{title:'¿Qué es?',info:'• Es una <strong>estrella</strong>: una esfera de gas muy caliente<br>• Está en el <strong>centro</strong> del sistema solar<br>• Es la estrella <strong>más cercana</strong> a la Tierra'},
    funcion:{title:'¿Qué hace?',info:'• Da <strong>luz y calor</strong> a todo el sistema solar<br>• Hace posible la <strong>vida</strong> en la Tierra<br>• Los planetas <strong>giran</strong> a su alrededor'},
    ubicacion:{title:'Curiosidad',info:'• Cabrían más de un <strong>millón de Tierras</strong> dentro del Sol<br>• Su luz tarda unos <strong>8 minutos</strong> en llegar a la Tierra<br>• Es una estrella de tamaño mediano'},
    dato:{title:'Dato curioso',info:'• ¡<strong>Nunca</strong> lo mires directamente: puede dañar tus ojos!<br>• La energía del Sol mueve el clima y las plantas<br>• Sin el Sol, la Tierra sería un lugar oscuro y helado'}
  },
  tierra:{
    nombre:'La Tierra',icon:'🌍',
    estructura:{title:'¿Qué es?',info:'• Es el <strong>tercer planeta</strong> desde el Sol<br>• Es un planeta <strong>rocoso</strong> con agua y aire<br>• Su satélite es la <strong>Luna</strong>'},
    funcion:{title:'¿Qué hace?',info:'• <strong>Gira sobre sí misma</strong> (rotación): día y noche<br>• <strong>Gira alrededor del Sol</strong> (traslación): las estaciones<br>• Es el <strong>único</strong> planeta con vida conocida'},
    ubicacion:{title:'Curiosidad',info:'• Tiene <strong>agua líquida</strong>, algo muy raro en el universo<br>• Su atmósfera nos protege y nos da aire<br>• Da una vuelta al Sol cada <strong>365 días</strong>'},
    dato:{title:'Dato curioso',info:'• Desde el espacio se ve <strong>azul</strong> por sus océanos<br>• Es nuestro <strong>hogar</strong>: hay que cuidarlo<br>• Gira a gran velocidad, ¡aunque no lo sintamos!'}
  },
  luna:{
    nombre:'La Luna',icon:'🌙',
    estructura:{title:'¿Qué es?',info:'• Es el <strong>satélite natural</strong> de la Tierra<br>• Es un astro <strong>rocoso</strong> sin aire ni agua<br>• <strong>No tiene luz propia</strong>'},
    funcion:{title:'¿Qué hace?',info:'• <strong>Gira alrededor de la Tierra</strong><br>• <strong>Refleja</strong> la luz del Sol<br>• Cambia de aspecto: son sus <strong>fases</strong>'},
    ubicacion:{title:'Curiosidad',info:'• Sus fases son: <strong>nueva, creciente, llena y menguante</strong><br>• Influye en las <strong>mareas</strong> del mar<br>• Es el astro que vemos más grande de noche'},
    dato:{title:'Dato curioso',info:'• El ser humano <strong>llegó a la Luna</strong> en 1969<br>• En la Luna pesarías <strong>mucho menos</strong> que en la Tierra<br>• Siempre nos muestra la <strong>misma cara</strong>'}
  },
  planetas:{
    nombre:'Los planetas',icon:'🪐',
    estructura:{title:'¿Qué es?',info:'• Astros que <strong>giran alrededor del Sol</strong><br>• <strong>No tienen luz propia</strong><br>• El sistema solar tiene <strong>ocho</strong>'},
    funcion:{title:'¿Qué hace?',info:'• Cada uno recorre su <strong>órbita</strong> alrededor del Sol<br>• Algunos tienen <strong>satélites</strong> (lunas)<br>• Se dividen en rocosos y gigantes de gas'},
    ubicacion:{title:'Curiosidad',info:'• En orden: <strong>Mercurio, Venus, Tierra, Marte, Júpiter, Saturno, Urano, Neptuno</strong><br>• <strong>Júpiter</strong> es el más grande<br>• <strong>Saturno</strong> tiene anillos'},
    dato:{title:'Dato curioso',info:'• <strong>Marte</strong> es el planeta rojo<br>• <strong>Mercurio</strong> es el más cercano al Sol<br>• Se estudian con <strong>telescopios</strong> y sondas espaciales'}
  },
  universo:{
    nombre:'El universo',icon:'🌌',
    estructura:{title:'¿Qué es?',info:'• Es <strong>todo lo que existe</strong>: el espacio y los astros<br>• Es tan grande que no conocemos sus <strong>límites</strong><br>• Contiene millones de <strong>galaxias</strong>'},
    funcion:{title:'¿Qué hace?',info:'• Reúne las <strong>estrellas, planetas, satélites y cometas</strong><br>• Las estrellas se agrupan en <strong>galaxias</strong><br>• Nuestra galaxia es la <strong>Vía Láctea</strong>'},
    ubicacion:{title:'Curiosidad',info:'• Se observa con <strong>telescopios</strong><br>• Muchas estrellas que ves ya son muy <strong>antiguas</strong><br>• El universo sigue <strong>creciendo</strong>'},
    dato:{title:'Dato curioso',info:'• Hay <strong>más estrellas</strong> que granos de arena en las playas<br>• La luz de algunas estrellas tarda <strong>años</strong> en llegar<br>• ¡Todavía queda muchísimo por descubrir!'}
  }
};
let labParte='sol',labAspecto='estructura';
function labShowParte(parteKey){labParte=parteKey;updateLabDisplay();document.querySelectorAll('.lab-cont-btn').forEach(b=>b.classList.remove('active-pri'));const btn=document.querySelector(`[data-parte="${parteKey}"]`);if(btn)btn.classList.add('active-pri');if(typeof sfx==='function')sfx('click');}
function labShowAspecto(aspectoKey){labAspecto=aspectoKey;updateLabDisplay();document.querySelectorAll('.lab-asp-btn').forEach(b=>b.classList.remove('active-sec'));const btn=document.querySelector(`[data-aspecto="${aspectoKey}"]`);if(btn)btn.classList.add('active-sec');if(typeof sfx==='function')sfx('click');}
function updateLabDisplay(){const data=parteData[labParte];const asp=data[labAspecto];document.getElementById('lab-sentence').innerHTML=`🔬 Explorando: <strong>${data.nombre}</strong> → <strong>${asp.title}</strong>`;document.getElementById('lab-display').innerHTML=`<div class="lab-cont-header">${data.icon} ${data.nombre}</div><div class="lab-asp-title">${asp.title}</div><div class="lab-asp-info">${asp.info}</div>`;}

// ===================== DIPLOMA =====================
function _diplPct(){return xp>=MXP?100:Math.round((xp/MXP)*100);}
function openDiploma(){sfx('fan');const pct=_diplPct();document.getElementById('diplPct').textContent=pct+'%';document.getElementById('diplBar').style.width=pct+'%';document.getElementById('diplDate').textContent='Fecha: '+new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});const msgs=['¡Sigue aprendiendo!','¡Muy buen trabajo!','¡Vas muy bien!','¡Dominas el universo y el Sistema Solar!','¡Explorador del Espacio!'];document.getElementById('diplMsg').textContent=msgs[Math.min(Math.floor(pct/25),4)];const stars=['⭐','⭐⭐','⭐⭐⭐'];document.getElementById('diplStars').textContent=stars[Math.min(Math.floor(pct/40),2)];const achTxt=unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(' · ');document.getElementById('diplAch').textContent=achTxt||'Sigue completando secciones para desbloquear logros';document.getElementById('diplomaOverlay').classList.add('open');launchConfetti();}
function closeDiploma(){document.getElementById('diplomaOverlay').classList.remove('open');}
function updateDiplomaName(v){document.getElementById('diplName').textContent=v||'Estudiante';}
function shareWA(){const name=document.getElementById('diplName').textContent||'Estudiante';const pct=_diplPct();const msg=`🪐 ¡${name} completó la Misión "El Universo y el Sistema Solar"! 🏅 Progreso: ${pct}% · 🌱 policastsapien.com`;_waShare(msg);}
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
  document.querySelector('[data-parte="sol"]')?.classList.add('active-pri');
  document.querySelector('[data-aspecto="estructura"]')?.classList.add('active-sec');
  renderAchPanel();
});

(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalCrit==='function') _injectFormaSel('genEvalCrit','evalCritFormaSel',evalCritFormNum,function(v){evalCritFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();
