// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
function compartirMision(){const url=window.location.href;const texto=`🚀 *Misión Asignada* 🚀\n\nPractica sobre este tema y sobresale en ser de los mejores alumnos. 🏆\n\nDesbloquea *todos los logros* y puedes poner *tus datos* para que tu maestro observe todos tus logros. 📋\n\n_Se te hará prueba escrita y serás excelente estudiante en Ciencias Sociales._ ✍️\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;_waShare(texto);}
function toggleLetra(){document.body.classList.toggle('letra-grande');if(typeof sfx==='function')sfx('click');localStorage.setItem('preferenciaLetra',document.body.classList.contains('letra-grande'));}
window.addEventListener('DOMContentLoaded',()=>{if(localStorage.getItem('preferenciaLetra')==='true')document.body.classList.add('letra-grande');});

// ===================== UTILIDADES =====================
const _pick=(arr,n)=>[...arr].sort(()=>Math.random()-0.5).slice(0,n);
const _shuffle=(arr)=>[...arr].sort(()=>Math.random()-0.5);
function fb(id,msg,isOk){const el=document.getElementById(id);if(el){el.textContent=msg;el.className='fb show '+(isOk?'ok':'err');}}

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY='mayas_precolombinas_v1';
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
  primer_quiz:{icon:'🗿',label:'Primera prueba del mundo maya superada'},
  flash_master:{icon:'🃏',label:'Todas las flashcards precolombinas exploradas'},
  clasif_pro:{icon:'🗂️',label:'Clasificador del mundo precolombino experto'},
  id_master:{icon:'🔍',label:'Identificador de la historia maestro'},
  reto_hero:{icon:'🏆',label:'Héroe del reto de Copán'},
  nivel3:{icon:'⏳',label:'¡Viajero del Tiempo! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡Guardián de Copán! Nivel 6'},
  widgets_master:{icon:'🧩',label:'Widgets del mundo maya dominados'}
};
function unlockAchievement(id){if(unlockedAch.includes(id))return;unlockedAch.push(id);sfx('ach');showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label);launchConfetti();renderAchPanel();saveProgress();}
function renderAchPanel(){const list=document.getElementById('achList');list.innerHTML='';Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{const div=document.createElement('div');div.className='ach-item'+(unlockedAch.includes(id)?'':' locked');div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`;list.appendChild(div);});}
function toggleAchPanel(){sfx('click');document.getElementById('achPanel').classList.toggle('open');}
function showToast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}t.textContent=msg;t.style.display='block';clearTimeout(t._tid);t._tid=setTimeout(()=>t.style.display='none',3200);}
function launchConfetti(){const colors=['#0369a1','#38bdf8','#15803d','#4ade80','#0ea5e9'];for(let i=0;i<60;i++){const c=document.createElement('div');c.className='confetti-piece';c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`;document.body.appendChild(c);c.addEventListener('animationend',()=>c.remove());}}

// ===================== XP =====================
const lvls=[{t:0,n:'Aprendiz 🌱'},{t:25,n:'Explorador 🧭'},{t:55,n:'Viajero del Tiempo ⏳'},{t:90,n:'Arqueólogo 🗿'},{t:130,n:'Investigador 🔎'},{t:165,n:'Historiador 🏅'},{t:190,n:'Guardián de Copán 🏆'}];
function pts(n){xp=Math.max(0,Math.min(MXP,xp+n));updateXPBar();saveProgress();}
function updateXPBar(){const pct=Math.round((xp/MXP)*100);document.getElementById('xpFill').style.width=pct+'%';const el=document.getElementById('xpPts');el.textContent='⭐ '+xp;el.style.transform='scale(1.3)';setTimeout(()=>el.style.transform='',300);let lv=0;for(let i=0;i<lvls.length;i++)if(xp>=lvls[i].t)lv=i;document.getElementById('xpLvl').textContent=lvls[lv].n;if(lv!==prevLevel){if(lv>=2)unlockAchievement('nivel3');if(lv>=5)unlockAchievement('nivel5');prevLevel=lv;}}
function resetXP(){sfx('click');xp=0;updateXPBar();showToast('🔄 XP reiniciado a 0');}
function fin(id,showFX=true){if(!done.has(id)){done.add(id);const b=document.querySelector(`[data-s="${id}"]`);if(b)b.classList.add('done');if(showFX){sfx('up');launchConfetti();}saveProgress();}}
function getProgress(){return Math.round((done.size/TOTAL_SECTIONS)*100);}

// ===================== NAV =====================
function go(id){sfx('click');document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});document.getElementById(id).classList.add('active');const btn=document.querySelector(`[data-s="${id}"]`);if(btn){btn.classList.add('active');btn.setAttribute('aria-selected','true');}window.scrollTo({top:0,behavior:'smooth'});if(id==='s-sopa'){setTimeout(buildSopa,50);}if(id==='s-widgets'){setTimeout(buildRoute,50);}}

// ===================== FLASHCARD DATA =====================
const fcData=[
  {w:'Honduras',a:'🇭🇳 País de <strong>Centroamérica</strong> con unos <strong>112,492 km²</strong>; «el corazón de Centroamérica».'},
  {w:'Límites',a:'🧭 <strong>Norte:</strong> Mar Caribe · <strong>Sur:</strong> Golfo de Fonseca, Nicaragua y El Salvador · <strong>Este:</strong> Nicaragua · <strong>Oeste:</strong> Guatemala y El Salvador.'},
  {w:'Relieve',a:'⛰️ Honduras es un país <strong>montañoso</strong>: cerca de las <strong>tres cuartas partes</strong> son montañas.'},
  {w:'Cerro Las Minas',a:'🏔️ El <strong>punto más alto</strong> del país (2,870 m), en la Montaña de <strong>Celaque</strong>, Lempira.'},
  {w:'Vertiente del Caribe',a:'🌊 Agrupa los ríos <strong>largos</strong>: Ulúa, Chamelecón, Aguán, Patuca y Coco o Segovia.'},
  {w:'Vertiente del Pacífico',a:'🌅 Agrupa los ríos <strong>cortos</strong> que llegan al Golfo de Fonseca: Choluteca, Goascorán y Nacaome.'},
  {w:'Río Coco o Segovia',a:'🏞️ El río <strong>más largo</strong> de Honduras; marca la frontera con Nicaragua.'},
  {w:'Lago de Yojoa',a:'💧 El <strong>único lago natural</strong> del país; famoso por sus aves y peces.'},
  {w:'Laguna de Caratasca',a:'🌴 La laguna <strong>más grande</strong>, en La Mosquitia (Gracias a Dios).'},
  {w:'Clima',a:'🌦️ <strong>Tropical</strong>: cálido en las costas y templado en las montañas; estación lluviosa y seca.'},
  {w:'Departamentos',a:'🏛️ Honduras se divide en <strong>18 departamentos</strong> y estos en <strong>298 municipios</strong>.'},
  {w:'Tegucigalpa',a:'🏙️ La <strong>capital</strong>, en el municipio del Distrito Central (con Comayagüela).'},
  {w:'Islas de la Bahía',a:'🏝️ El departamento <strong>insular</strong>: Roatán, Utila y Guanaja.'},
  {w:'Golfo de Fonseca',a:'🌅 La entrada del <strong>Océano Pacífico</strong>; compartido con El Salvador y Nicaragua.'},
];
let fcIdx=0;
function upFC(){document.getElementById('fcInner').classList.remove('flipped');document.getElementById('fcW').textContent=fcData[fcIdx].w;document.getElementById('fcA').innerHTML=fcData[fcIdx].a;document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length;}
function flipCard(){sfx('flip');document.getElementById('fcInner').classList.toggle('flipped');if(!xpTracker.fc.has(fcIdx)){xpTracker.fc.add(fcIdx);pts(1);}if(xpTracker.fc.size===fcData.length){fin('s-flash');unlockAchievement('flash_master');}}
function nextFC(){sfx('click');fcIdx=(fcIdx+1)%fcData.length;upFC();}
function prevFC(){sfx('click');fcIdx=(fcIdx-1+fcData.length)%fcData.length;upFC();}

// ===================== QUIZ DATA =====================
const qzData=[
  {q:'¿En qué región de América está Honduras?',o:['a) Sudamérica','b) Centroamérica','c) Norteamérica','d) El Caribe insular'],c:1},
  {q:'¿Cuál es el punto más alto de Honduras?',o:['a) El Cerro Las Minas','b) El Pico Bonito','c) El Cerro Azul','d) La Montaña de la Flor'],c:0},
  {q:'¿Cuál es el río más largo del país?',o:['a) El Ulúa','b) El Choluteca','c) El Coco o Segovia','d) El Aguán'],c:2},
  {q:'¿Cuál es el único lago natural de Honduras?',o:['a) La Laguna de Caratasca','b) El Cajón','c) El Lago de Yojoa','d) El Golfo de Fonseca'],c:2},
  {q:'¿En cuántos departamentos se divide Honduras?',o:['a) 15','b) 18','c) 22','d) 298'],c:1},
  {q:'¿Cuál es la capital de Honduras?',o:['a) San Pedro Sula','b) Comayagua','c) Tegucigalpa','d) Choluteca'],c:2},
  {q:'¿Con qué mar limita Honduras al norte?',o:['a) El Océano Pacífico','b) El Mar Caribe','c) El Golfo de Fonseca','d) El Mar Mediterráneo'],c:1},
  {q:'¿Qué río pertenece a la vertiente del Pacífico?',o:['a) El Ulúa','b) El Patuca','c) El Choluteca','d) El Aguán'],c:2},
  {q:'¿Cuál es el departamento insular de Honduras?',o:['a) Gracias a Dios','b) Islas de la Bahía','c) Atlántida','d) Valle'],c:1},
];
let qzIdx=0,qzSel=-1,qzDone=false;
function buildQz(){qzIdx=0;qzSel=-1;qzDone=false;showQz();}
function showQz(){if(qzIdx>=qzData.length){document.getElementById('qzQ').textContent='🎉 ¡Quiz completado!';document.getElementById('qzOpts').innerHTML='';fin('s-quiz');unlockAchievement('primer_quiz');return;}const q=qzData[qzIdx];document.getElementById('qzProg').textContent=`Pregunta ${qzIdx+1} de ${qzData.length}`;document.getElementById('qzQ').textContent=q.q;const opts=document.getElementById('qzOpts');opts.innerHTML='';q.o.forEach((o,i)=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=o;b.onclick=()=>{if(qzDone)return;document.querySelectorAll('.qz-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');qzSel=i;sfx('click');};opts.appendChild(b);});qzDone=false;}
function checkQz(){if(qzSel<0)return fb('fbQz','Selecciona una respuesta.',false);qzDone=true;const opts=document.querySelectorAll('.qz-opt');if(qzSel===qzData[qzIdx].c){opts[qzSel].classList.add('correct');fb('fbQz','¡Correcto! +5 XP',true);if(!xpTracker.qz.has(qzIdx)){xpTracker.qz.add(qzIdx);pts(5);}sfx('ok');}else{opts[qzSel].classList.add('wrong');opts[qzData[qzIdx].c].classList.add('correct');fb('fbQz','Incorrecto. Revisa la respuesta correcta.',false);sfx('no');}setTimeout(()=>{qzIdx++;qzSel=-1;showQz();},1600);}
function resetQz(){sfx('click');qzIdx=0;qzSel=-1;qzDone=false;showQz();document.getElementById('fbQz').classList.remove('show');}

// ===================== CLASIFICACIÓN =====================
const classGroups=[
  {label:['Vertiente del Caribe','Vertiente del Pacífico'],headA:'🌊 Vertiente del Caribe',headB:'🌅 Vertiente del Pacífico',colA:'car',colB:'pac',
   words:[{w:'Río Ulúa',t:'car'},{w:'Río Choluteca',t:'pac'},{w:'Río Patuca',t:'car'},{w:'Río Goascorán',t:'pac'},{w:'Río Aguán',t:'car'},{w:'Río Nacaome',t:'pac'},{w:'Río Chamelecón',t:'car'},{w:'Río Coco o Segovia',t:'car'}]},
  {label:['Forma de relieve','Forma de agua'],headA:'⛰️ Relieve',headB:'💧 Aguas',colA:'rel',colB:'agua',
   words:[{w:'Montaña',t:'rel'},{w:'Río',t:'agua'},{w:'Valle',t:'rel'},{w:'Lago',t:'agua'},{w:'Cordillera',t:'rel'},{w:'Laguna',t:'agua'},{w:'Llanura',t:'rel'},{w:'Golfo',t:'agua'},{w:'Cerro',t:'rel'},{w:'Mar',t:'agua'}]},
  {label:['Costa Norte (Caribe)','Costa Sur (Pacífico)'],headA:'🌊 Costa Norte',headB:'🌅 Costa Sur',colA:'nor',colB:'sur',
   words:[{w:'Puerto Cortés',t:'nor'},{w:'San Lorenzo',t:'sur'},{w:'La Ceiba',t:'nor'},{w:'Golfo de Fonseca',t:'sur'},{w:'Trujillo',t:'nor'},{w:'Amapala',t:'sur'},{w:'Tela',t:'nor'},{w:'Isla del Tigre',t:'sur'}]},
  {label:['Departamento','Ciudad'],headA:'🏛️ Departamento',headB:'🏙️ Ciudad',colA:'dep',colB:'ciu',
   words:[{w:'Cortés',t:'dep'},{w:'San Pedro Sula',t:'ciu'},{w:'Atlántida',t:'dep'},{w:'La Ceiba',t:'ciu'},{w:'Olancho',t:'dep'},{w:'Juticalpa',t:'ciu'},{w:'Gracias a Dios',t:'dep'},{w:'Puerto Lempira',t:'ciu'}]},
];
let currentClassGroupIdx=0,clsSelectedWord=null;
function buildClass(){const group=classGroups[currentClassGroupIdx];document.getElementById('col-left-head').textContent=group.headA;document.getElementById('col-right-head').textContent=group.headB;const bank=document.getElementById('clsBank');bank.innerHTML='';clsSelectedWord=null;document.getElementById('items-left').innerHTML='';document.getElementById('items-right').innerHTML='';_shuffle([...group.words]).forEach(w=>{const el=document.createElement('div');el.className='wb-item';el.textContent=w.w;el.dataset.t=w.t;el.onclick=()=>{document.querySelectorAll('.wb-item').forEach(i=>i.classList.remove('sel-word'));el.classList.add('sel-word');clsSelectedWord=el;sfx('click');};bank.appendChild(el);});['col-left','col-right'].forEach(colId=>{const col=document.getElementById(colId);col.onclick=(e)=>{if(!clsSelectedWord||e.target.classList.contains('drop-item'))return;const targetId=colId==='col-left'?'items-left':'items-right';const wordsCol=document.getElementById(targetId);const item=document.createElement('div');item.className='drop-item';item.textContent=clsSelectedWord.textContent;item.dataset.t=clsSelectedWord.dataset.t;const original=clsSelectedWord;item.onclick=(ev)=>{ev.stopPropagation();if(clsSelectedWord!==null){col.click();}else{document.getElementById('clsBank').appendChild(original);original.classList.remove('sel-word');item.remove();if(typeof sfx==='function')sfx('click');}};wordsCol.appendChild(item);clsSelectedWord.remove();clsSelectedWord=null;sfx('click');};});}
function checkClass(){const remaining=document.querySelectorAll('#clsBank .wb-item').length;if(remaining>0){fb('fbCls','Mueve todas las palabras a las columnas primero.',false);return;}const group=classGroups[currentClassGroupIdx];let allOk=true;document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{const inLeft=el.parentElement.id==='items-left';const expectedType=inLeft?group.colA:group.colB;if(el.dataset.t===expectedType){el.classList.add('cls-ok');}else{el.classList.add('cls-no');allOk=false;}});if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);}if(allOk){fb('fbCls','¡Perfecto! +5 XP',true);sfx('fan');fin('s-clasifica');unlockAchievement('clasif_pro');}else{fb('fbCls','Hay errores. Marcados en rojo.',false);sfx('no');}}
function nextClassGroup(){sfx('click');currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length;buildClass();document.getElementById('fbCls').classList.remove('show');showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]);}
function resetClass(){sfx('click');buildClass();document.getElementById('fbCls').classList.remove('show');}

// ===================== IDENTIFICAR =====================
const idData=[
  {s:['Honduras','está','en','Centroamérica.'],c:3,art:'La región de América donde está Honduras'},
  {s:['El','río','Coco','es','el','más','largo','del','país.'],c:2,art:'El río más largo de Honduras'},
  {s:['El','Lago','de','Yojoa','es','el','único','lago','natural.'],c:3,art:'El único lago natural del país'},
  {s:['La','capital','de','Honduras','es','Tegucigalpa.'],c:5,art:'La capital del país'},
  {s:['Honduras','tiene','dieciocho','departamentos.'],c:2,art:'El número de departamentos'},
  {s:['El','Mar','Caribe','limita','al','norte','del','país.'],c:2,art:'El mar que limita al norte de Honduras'},
  {s:['Roatán','pertenece','a','las','Islas','de','la','Bahía.'],c:0,art:'La isla más conocida del Caribe hondureño'},
  {s:['El','clima','de','Honduras','es','tropical.'],c:5,art:'El tipo de clima del país'},
];
let idIdx=0,idDone=false;
function showId(){idDone=false;if(idIdx>=idData.length){document.getElementById('idSent').innerHTML='🎉 ¡Completado!';fin('s-identifica');unlockAchievement('id_master');return;}const d=idData[idIdx];document.getElementById('idProg').textContent=`Oración ${idIdx+1} de ${idData.length}`;document.getElementById('idInfo').textContent=`Busca: ${d.art}`;const sent=document.getElementById('idSent');sent.innerHTML='';d.s.forEach((w,i)=>{const span=document.createElement('span');span.className='id-word';span.textContent=w+' ';span.onclick=()=>checkId(i,span);sent.appendChild(span);});}
function checkId(i,span){if(idDone)return;document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected'));span.classList.add('selected');if(i===idData[idIdx].c){idDone=true;span.classList.add('id-ok');fb('fbId','¡Correcto! +5 XP',true);if(!xpTracker.id.has(idIdx)){xpTracker.id.add(idIdx);pts(5);}sfx('ok');}else{span.classList.add('id-no');fb('fbId','Ese no es el término solicitado.',false);sfx('no');}}
function nextId(){sfx('click');idIdx++;showId();document.getElementById('fbId').classList.remove('show');}
function resetId(){sfx('click');idIdx=0;showId();document.getElementById('fbId').classList.remove('show');}

// ===================== COMPLETA =====================
const cmpData=[
  {s:'Honduras está en ___.',opts:['Sudamérica','Centroamérica','Norteamérica'],c:1},
  {s:'El punto más alto es el Cerro ___.',opts:['Las Minas','Bonito','Azul'],c:0},
  {s:'El río más largo es el ___.',opts:['Ulúa','Coco o Segovia','Choluteca'],c:1},
  {s:'El único lago natural es el Lago de ___.',opts:['Caratasca','Yojoa','Fonseca'],c:1},
  {s:'Honduras tiene ___ departamentos.',opts:['16','18','20'],c:1},
  {s:'La capital de Honduras es ___.',opts:['San Pedro Sula','Tegucigalpa','Comayagua'],c:1},
  {s:'Al norte, Honduras limita con el ___.',opts:['Mar Caribe','Océano Pacífico','Golfo de Fonseca'],c:0},
  {s:'El río Choluteca pertenece a la vertiente del ___.',opts:['Caribe','Pacífico','Atlántico'],c:1},
];
let cmpIdx=0,cmpSel=-1,cmpDone=false;
function showCmp(){if(cmpIdx>=cmpData.length){document.getElementById('cmpSent').innerHTML='🎉 ¡Completado!';document.getElementById('cmpOpts').innerHTML='';fin('s-completa');return;}const d=cmpData[cmpIdx];document.getElementById('cmpProg').textContent=`Oración ${cmpIdx+1} de ${cmpData.length}`;document.getElementById('cmpSent').innerHTML=d.s.replace('___','<span class="blank">___</span>');const opts=document.getElementById('cmpOpts');opts.innerHTML='';cmpSel=-1;cmpDone=false;d.opts.forEach((o,i)=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=o;b.onclick=()=>{if(cmpDone)return;document.querySelectorAll('.cmp-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');cmpSel=i;sfx('click');};opts.appendChild(b);});}
function checkCmp(){if(cmpSel<0)return fb('fbCmp','Selecciona una opción.',false);cmpDone=true;const opts=document.querySelectorAll('.cmp-opt');if(cmpSel===cmpData[cmpIdx].c){opts[cmpSel].classList.add('correct');document.getElementById('cmpSent').innerHTML=cmpData[cmpIdx].s.replace('___',`<span class="blank" style="color:var(--jade);border-color:var(--jade)">${opts[cmpSel].textContent}</span>`);fb('fbCmp','¡Correcto! +5 XP',true);if(!xpTracker.cmp.has(cmpIdx)){xpTracker.cmp.add(cmpIdx);pts(5);}sfx('ok');}else{opts[cmpSel].classList.add('wrong');opts[cmpData[cmpIdx].c].classList.add('correct');fb('fbCmp','Incorrecto. Revisa bien la respuesta.',false);sfx('no');}setTimeout(()=>{cmpIdx++;document.getElementById('fbCmp').classList.remove('show');showCmp();},1600);}

// ===================== WIDGETS =====================
// Widget 1: Ordenar secuencias
const routeSets=[
  {label:'De la división más grande a la más pequeña',steps:['País (Honduras)','Departamento','Municipio','Aldea','Caserío']},
  {label:'El viaje de una gota: de la montaña al Caribe',steps:['Llueve en la montaña','El agua baja por las quebradas','Se une al río Ulúa','El río cruza el Valle de Sula','Desemboca en el Mar Caribe']},
  {label:'La costa norte, de oeste a este',steps:['Puerto Cortés','Tela','La Ceiba','Trujillo','La Mosquitia']},
];
let currentRouteIdx=0,routeItems=[];
function buildRoute(){routeItems=_shuffle([...routeSets[currentRouteIdx].steps]);renderRoute();const fbEl=document.getElementById('fbRoute');if(fbEl)fbEl.classList.remove('show');}
function renderRoute(){const list=document.getElementById('routeList');if(!list)return;list.innerHTML='';routeItems.forEach((step,i)=>{const div=document.createElement('div');div.className='sort-item';div.innerHTML=`<div class="sort-arrows"><button class="sort-arrow" onclick="routeMove(${i},-1)"${i===0?' disabled':''}>▲</button><button class="sort-arrow" onclick="routeMove(${i},1)"${i===routeItems.length-1?' disabled':''}>▼</button></div><div class="sort-step-num">${i+1}.</div><div class="sort-item-txt">${step}</div>`;list.appendChild(div);});}
function routeMove(idx,dir){sfx('click');const ni=idx+dir;if(ni<0||ni>=routeItems.length)return;[routeItems[idx],routeItems[ni]]=[routeItems[ni],routeItems[idx]];renderRoute();}
function checkRoute(){const correct=routeSets[currentRouteIdx].steps;const isOk=routeItems.every((s,i)=>s===correct[i]);if(isOk){fb('fbRoute','¡Perfecto! Orden correcto. +4 XP',true);if(!xpTracker.wgt.has('route_'+currentRouteIdx)){xpTracker.wgt.add('route_'+currentRouteIdx);pts(4);}sfx('fan');fin('s-widgets');unlockAchievement('widgets_master');}else{fb('fbRoute','Hay pasos fuera de orden. Revisa el arreglo.',false);sfx('no');}}
function nextRoute(){sfx('click');currentRouteIdx=(currentRouteIdx+1)%routeSets.length;buildRoute();showToast('🔄 Secuencia: '+routeSets[currentRouteIdx].label);}

// Widget 2: Identifica el concepto
const neuronPartes=[
  {desc:'El punto más alto de Honduras (2,870 m)',ans:'Cerro Las Minas',opts:['Cerro Las Minas','Pico Bonito','Cerro Azul','Montaña de la Flor']},
  {desc:'El único lago natural del país',ans:'Lago de Yojoa',opts:['Lago de Yojoa','Laguna de Caratasca','El Cajón','Golfo de Fonseca']},
  {desc:'El río más largo; marca la frontera con Nicaragua',ans:'Río Coco o Segovia',opts:['Río Coco o Segovia','Río Ulúa','Río Choluteca','Río Aguán']},
  {desc:'La capital de Honduras',ans:'Tegucigalpa',opts:['Tegucigalpa','San Pedro Sula','Comayagua','Choluteca']},
  {desc:'El departamento insular del Caribe',ans:'Islas de la Bahía',opts:['Islas de la Bahía','Gracias a Dios','Atlántida','Valle']},
  {desc:'La laguna más grande, en La Mosquitia',ans:'Laguna de Caratasca',opts:['Laguna de Caratasca','Lago de Yojoa','Golfo de Fonseca','Laguna de Alvarado']},
  {desc:'La entrada del Océano Pacífico, al sur del país',ans:'Golfo de Fonseca',opts:['Golfo de Fonseca','Mar Caribe','Bahía de Trujillo','Lago de Yojoa']},
  {desc:'El puerto más importante de Honduras, en el Caribe',ans:'Puerto Cortés',opts:['Puerto Cortés','San Lorenzo','Amapala','La Ceiba']},
];
let neuronIdx=0,neuronDone=false;
function showNeuron(){neuronDone=false;if(neuronIdx>=neuronPartes.length){const el=document.getElementById('neuronDesc');if(el)el.textContent='🎉 ¡Todos los lugares de Honduras identificados!';const opts=document.getElementById('neuronOpts');if(opts)opts.innerHTML='';fin('s-widgets');return;}const d=neuronPartes[neuronIdx];const prog=document.getElementById('neuronProg');if(prog)prog.textContent=`Pista ${neuronIdx+1} de ${neuronPartes.length}`;const desc=document.getElementById('neuronDesc');if(desc)desc.textContent=d.desc;const opts=document.getElementById('neuronOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=opt;b.onclick=()=>checkNeuron(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuron');if(fbEl)fbEl.classList.remove('show');}
function checkNeuron(opt,btn,d){if(neuronDone)return;neuronDone=true;document.querySelectorAll('#neuronOpts .cmp-opt').forEach(b=>{if(b.textContent===d.ans)b.classList.add('correct');else if(b===btn&&b.textContent!==d.ans)b.classList.add('wrong');});const isOk=opt===d.ans;if(isOk){fb('fbNeuron','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuron_'+neuronIdx)){xpTracker.wgt.add('neuron_'+neuronIdx);pts(3);}sfx('ok');}else{fb('fbNeuron','La respuesta correcta es: '+d.ans,false);sfx('no');}}
function nextNeuron(){sfx('click');neuronIdx++;showNeuron();}
function resetNeuron(){sfx('click');neuronIdx=0;showNeuron();}

// Widget 3: Concepto → Significado
const neuroPairs=[
  {trans:'El Lago de Yojoa',func:'El único lago natural de Honduras',opts:['El único lago natural de Honduras','La laguna más grande del país','El punto más alto del país','El río más largo del país']},
  {trans:'El Cerro Las Minas',func:'El punto más alto del país (2,870 m)',opts:['El punto más alto del país (2,870 m)','El único lago natural','Un puerto del Caribe','La capital de Honduras']},
  {trans:'El Río Ulúa',func:'Riega el fértil Valle de Sula',opts:['Riega el fértil Valle de Sula','Desemboca en el Golfo de Fonseca','Es el punto más alto','Es una laguna costera']},
  {trans:'La Mosquitia',func:'La región oriental de grandes bosques, poco poblada',opts:['La región oriental de grandes bosques, poco poblada','La región más poblada del país','Una isla del Caribe','Un volcán del sur']},
  {trans:'El Distrito Central',func:'El municipio de la capital (Tegucigalpa y Comayagüela)',opts:['El municipio de la capital (Tegucigalpa y Comayagüela)','El departamento insular','El puerto más importante','El lago más grande']},
];
let neuroIdx=0,neuroDone=false;
function showNeuro(){neuroDone=false;if(neuroIdx>=neuroPairs.length){const el=document.getElementById('neuroTrans');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('neuroOpts');if(opts)opts.innerHTML='';return;}const d=neuroPairs[neuroIdx];const prog=document.getElementById('neuroProg');if(prog)prog.textContent=`${neuroIdx+1} de ${neuroPairs.length}`;const trans=document.getElementById('neuroTrans');if(trans)trans.textContent=d.trans;const opts=document.getElementById('neuroOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkNeuro(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuro');if(fbEl)fbEl.classList.remove('show');}
function checkNeuro(opt,btn,d){if(neuroDone)return;neuroDone=true;document.querySelectorAll('#neuroOpts .qz-opt').forEach(b=>{if(b.textContent===d.func)b.classList.add('correct');else if(b===btn&&b.textContent!==d.func)b.classList.add('wrong');});const isOk=opt===d.func;if(isOk){fb('fbNeuro','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuro_'+neuroIdx)){xpTracker.wgt.add('neuro_'+neuroIdx);pts(3);}sfx('ok');}else{fb('fbNeuro','Correcto: '+d.func,false);sfx('no');}setTimeout(()=>{neuroIdx++;showNeuro();},1800);}
function resetNeuro(){sfx('click');neuroIdx=0;showNeuro();}

// Widget 4: Fuente → ¿Renovable o no renovable?
const enfermedadData=[
  {disease:'Río Ulúa',characteristic:'Vertiente del Caribe',opts:['Vertiente del Caribe','Vertiente del Pacífico']},
  {disease:'Río Choluteca',characteristic:'Vertiente del Pacífico',opts:['Vertiente del Pacífico','Vertiente del Caribe']},
  {disease:'Río Patuca',characteristic:'Vertiente del Caribe',opts:['Vertiente del Caribe','Vertiente del Pacífico']},
  {disease:'Río Goascorán',characteristic:'Vertiente del Pacífico',opts:['Vertiente del Pacífico','Vertiente del Caribe']},
  {disease:'Río Aguán',characteristic:'Vertiente del Caribe',opts:['Vertiente del Caribe','Vertiente del Pacífico']},
  {disease:'Río Nacaome',characteristic:'Vertiente del Pacífico',opts:['Vertiente del Pacífico','Vertiente del Caribe']},
];
let enferIdx=0,enferDone=false;
function showEnfer(){enferDone=false;if(enferIdx>=enfermedadData.length){const el=document.getElementById('enferDisease');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('enferOpts');if(opts)opts.innerHTML='';return;}const d=enfermedadData[enferIdx];const prog=document.getElementById('enferProg');if(prog)prog.textContent=`${enferIdx+1} de ${enfermedadData.length}`;const dis=document.getElementById('enferDisease');if(dis)dis.textContent=d.disease;const opts=document.getElementById('enferOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkEnfer(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbEnfer');if(fbEl)fbEl.classList.remove('show');}
function checkEnfer(opt,btn,d){if(enferDone)return;enferDone=true;document.querySelectorAll('#enferOpts .qz-opt').forEach(b=>{if(b.textContent===d.characteristic)b.classList.add('correct');else if(b===btn&&b.textContent!==d.characteristic)b.classList.add('wrong');});const isOk=opt===d.characteristic;if(isOk){fb('fbEnfer','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('enfer_'+enferIdx)){xpTracker.wgt.add('enfer_'+enferIdx);pts(3);}sfx('ok');}else{fb('fbEnfer','Correcto: '+d.characteristic,false);sfx('no');}setTimeout(()=>{enferIdx++;showEnfer();},1800);}
function resetEnfer(){sfx('click');enferIdx=0;showEnfer();}

// ===================== RETO FINAL =====================
const retoPairs=[
  {label:['Caribe','Pacífico'],btnA:'🌊 Caribe',btnB:'🌅 Pacífico',colA:'car',colB:'pac',
   words:[{w:'Río Ulúa',t:'car'},{w:'Río Choluteca',t:'pac'},{w:'Río Patuca',t:'car'},{w:'Río Goascorán',t:'pac'},{w:'Río Chamelecón',t:'car'},{w:'Río Nacaome',t:'pac'},{w:'Puerto Cortés',t:'car'},{w:'San Lorenzo',t:'pac'},{w:'La Ceiba',t:'car'},{w:'Amapala',t:'pac'}]},
  {label:['Relieve','Aguas'],btnA:'⛰️ Relieve',btnB:'💧 Aguas',colA:'rel',colB:'agua',
   words:[{w:'Montaña',t:'rel'},{w:'Río',t:'agua'},{w:'Valle',t:'rel'},{w:'Lago',t:'agua'},{w:'Cordillera',t:'rel'},{w:'Laguna',t:'agua'},{w:'Llanura',t:'rel'},{w:'Golfo',t:'agua'},{w:'Cerro',t:'rel'},{w:'Mar',t:'agua'}]},
  {label:['Departamento','Ciudad'],btnA:'🏛️ Departamento',btnB:'🏙️ Ciudad',colA:'dep',colB:'ciu',
   words:[{w:'Cortés',t:'dep'},{w:'San Pedro Sula',t:'ciu'},{w:'Atlántida',t:'dep'},{w:'La Ceiba',t:'ciu'},{w:'Olancho',t:'dep'},{w:'Juticalpa',t:'ciu'},{w:'Yoro',t:'dep'},{w:'El Progreso',t:'ciu'},{w:'Copán',t:'dep'},{w:'Santa Rosa de Copán',t:'ciu'}]},
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
  {s:'Honduras está en el centro de América, en Centroamérica.',type:'Ubicación de Honduras'},
  {s:'El Cerro Las Minas es el punto más alto del país.',type:'Cerro Las Minas'},
  {s:'El río Coco o Segovia es el más largo de Honduras.',type:'Río Coco o Segovia'},
  {s:'El Lago de Yojoa es el único lago natural.',type:'Lago de Yojoa'},
  {s:'Honduras se divide en 18 departamentos.',type:'División política'},
  {s:'La capital de Honduras es Tegucigalpa.',type:'La capital'},
  {s:'El Mar Caribe limita al norte de Honduras.',type:'Límite norte'},
  {s:'El Golfo de Fonseca está al sur del país.',type:'Golfo de Fonseca'},
  {s:'Las Islas de la Bahía son Roatán, Utila y Guanaja.',type:'Islas de la Bahía'},
  {s:'El clima de Honduras es tropical.',type:'El clima'},
];
const classifyTaskDB=[
  {w:'Río Ulúa',gen:'Río caudaloso que riega el Valle de Sula',n:'Río (vertiente del Caribe)',g:'Noroccidente del país',t:'Uno de los más importantes'},
  {w:'Lago de Yojoa',gen:'El único lago natural de Honduras',n:'Lago',g:'Entre Comayagua, Cortés y Santa Bárbara',t:'Famoso por sus aves y peces'},
  {w:'Cerro Las Minas',gen:'El punto más alto del país (2,870 m)',n:'Montaña',g:'Montaña de Celaque, Lempira',t:'También se le llama Pico Celaque'},
  {w:'Golfo de Fonseca',gen:'Entrada del Océano Pacífico',n:'Golfo',g:'Sur del país',t:'Compartido con El Salvador y Nicaragua'},
  {w:'Islas de la Bahía',gen:'Departamento insular del Caribe',n:'Islas',g:'Frente a la costa norte',t:'Roatán, Utila y Guanaja'},
];
const completeTaskDB=[
  {s:'Honduras está en ___.',opts:['Sudamérica','Centroamérica','Norteamérica'],ans:'Centroamérica'},
  {s:'El punto más alto es el Cerro ___.',opts:['Las Minas','Bonito','Azul'],ans:'Las Minas'},
  {s:'El río más largo es el ___.',opts:['Ulúa','Coco o Segovia','Choluteca'],ans:'Coco o Segovia'},
  {s:'El único lago natural es el Lago de ___.',opts:['Caratasca','Yojoa','Fonseca'],ans:'Yojoa'},
  {s:'Honduras tiene ___ departamentos.',opts:['16','18','20'],ans:'18'},
  {s:'La capital de Honduras es ___.',opts:['San Pedro Sula','Tegucigalpa','Comayagua'],ans:'Tegucigalpa'},
  {s:'Al norte, Honduras limita con el ___.',opts:['Mar Caribe','Océano Pacífico','Golfo de Fonseca'],ans:'Mar Caribe'},
  {s:'El río Choluteca es de la vertiente del ___.',opts:['Caribe','Pacífico','Atlántico'],ans:'Pacífico'},
];
const explainQuestions=[
  {q:'¿Dónde está Honduras y cuáles son sus límites?',ans:'Honduras está en Centroamérica. Limita al norte con el Mar Caribe; al sur con el Golfo de Fonseca (Pacífico), Nicaragua y El Salvador; al este con Nicaragua; y al oeste con Guatemala y El Salvador.'},
  {q:'¿Por qué se dice que Honduras es un país montañoso?',ans:'Porque cerca de las tres cuartas partes de su territorio son montañas y cordilleras. El punto más alto es el Cerro Las Minas (2,870 m), en la Montaña de Celaque.'},
  {q:'¿Cuáles son las dos vertientes de Honduras y en qué se diferencian?',ans:'La vertiente del Caribe, con ríos largos y caudalosos (Ulúa, Patuca, Coco o Segovia), y la vertiente del Pacífico, con ríos cortos que llegan al Golfo de Fonseca (Choluteca, Goascorán, Nacaome).'},
  {q:'¿Cómo se divide políticamente Honduras?',ans:'En 18 departamentos, que se dividen en 298 municipios. La capital es Tegucigalpa, en el municipio del Distrito Central, junto con Comayagüela.'},
  {q:'¿Cómo cambia el clima de Honduras según la altitud?',ans:'El clima es tropical: en las costas y llanuras hace calor todo el año, y en las montañas el clima es templado y fresco. Además hay una estación lluviosa (mayo a octubre) y una seca (noviembre a abril).'},
];
let ansVisible=false;
function genTask(){sfx('click');const type=document.getElementById('tgType').value;const count=parseInt(document.getElementById('tgCount').value);ansVisible=false;const out=document.getElementById('tgOut');out.innerHTML='';if(type==='identify')genIdentifyTask(out,count);else if(type==='classify')genClassifyTask(out,count);else if(type==='complete')genCompleteTask(out,count);else if(type==='explain')genExplainTask(out,count);fin('s-tareas');}
function _instrBlock(out,title,lines){const ib=document.createElement('div');ib.className='tg-instruction-block';ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join('');out.appendChild(ib);}
function genIdentifyTask(out,count){_instrBlock(out,'Instrucción',['Copia en tu cuaderno; subraya, colorea o encierra el concepto indicado en cada oración. Escribe al lado a qué lugar o concepto de la geografía de Honduras se refiere.','<strong>Ejemplo:</strong> El Lago de Yojoa es el único lago natural. → <span style="color:var(--jade);font-weight:700;">Lago de Yojoa</span>']);_pick(identifyTaskDB,Math.min(count,identifyTaskDB.length)).forEach((item,i)=>{const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.type}</div></div>`;out.appendChild(div);});}
function genClassifyTask(out,count){_instrBlock(out,'Instrucción',['Copia la siguiente tabla en tu cuaderno. Para cada lugar, completa su descripción, qué tipo de lugar es, dónde está y un dato.']);const items=_pick(classifyTaskDB,Math.min(count,classifyTaskDB.length));const wrap=document.createElement('div');wrap.style.overflowX='auto';const th=(t,extra='')=>`<th style="padding:0.3rem 0.4rem;border:1px solid var(--border);font-size:0.72rem;text-align:center;${extra}">${t}</th>`;let html=`<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:520px;"><thead><tr style="background:var(--pri-gl);">${th('Lugar','text-align:left;')}${th('Descripción')}${th('Tipo')}${th('Ubicación')}${th('Dato')}</tr></thead><tbody>`;items.forEach(it=>{html+=`<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td>`+Array(4).fill(`<td style="padding:0.4rem;border:1px solid var(--border);min-width:50px;"></td>`).join('')+'</tr>';});html+='</tbody></table>';wrap.innerHTML=html;out.appendChild(wrap);const ans=document.createElement('div');ans.className='tg-answer';ans.style.marginTop='0.8rem';ans.innerHTML='<strong>✅ Respuestas:</strong><br>'+items.map(it=>`<strong>${it.w}:</strong> Descripción: ${it.gen} | Tipo: ${it.n} | Ubicación: ${it.g} | Dato: ${it.t}`).join('<br>');out.appendChild(ans);}
function genCompleteTask(out,count){_instrBlock(out,'Instrucción',['Copia y resuelve en tu cuaderno. Cada oración tiene un espacio ___. Elige y escribe la opción correcta.']);const pool=_shuffle([...completeTaskDB]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';const sent=item.s.replace('___','<span class="tg-blank" style="min-width:90px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${sent}</strong><div style="margin-top:0.4rem;font-size:0.82rem;color:var(--gray);">📝 Opciones: <strong>${item.opts.join(' | ')}</strong></div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function genExplainTask(out,count){_instrBlock(out,'Instrucción',['Copia las siguientes preguntas en tu cuaderno y responde cada una de forma clara y completa.']);const pool=_shuffle([...explainQuestions]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.3rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function toggleAns(){ansVisible=!ansVisible;document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none');sfx('click');}

// ===================== SOPA DE LETRAS =====================
const sopaSets=[
  {size:10,grid:[
    ['K','U','W','Q','M','L','L','R','Z','S'],
    ['H','L','I','G','P','V','A','L','L','E'],
    ['S','U','Y','V','F','C','Z','D','W','L'],
    ['A','A','O','O','W','Y','P','J','Z','C'],
    ['R','L','J','E','H','B','G','G','Z','N'],
    ['U','P','O','X','C','A','R','I','B','E'],
    ['D','U','A','P','N','D','Y','C','M','B'],
    ['N','L','M','U','A','V','B','A','K','N'],
    ['O','M','J','X','U','W','M','N','A','F'],
    ['H','L','I','S','L','A','I','B','S','W']
  ],words:[
    {w:'HONDURAS',cells:[[9,0],[8,0],[7,0],[6,0],[5,0],[4,0],[3,0],[2,0]]},
    {w:'CARIBE',cells:[[5,4],[5,5],[5,6],[5,7],[5,8],[5,9]]},
    {w:'YOJOA',cells:[[2,2],[3,2],[4,2],[5,2],[6,2]]},
    {w:'ULUA',cells:[[0,1],[1,1],[2,1],[3,1]]},
    {w:'VALLE',cells:[[1,5],[1,6],[1,7],[1,8],[1,9]]},
    {w:'ISLA',cells:[[9,2],[9,3],[9,4],[9,5]]}
  ]},
  {size:10,grid:[
    ['D','M','N','C','F','P','M','K','Y','M'],
    ['N','C','U','V','Z','P','Q','S','E','O'],
    ['R','O','A','T','A','N','O','O','U','N'],
    ['G','J','D','S','O','G','L','C','Q','T'],
    ['U','C','P','H','K','N','D','O','A','A'],
    ['L','O','M','A','I','G','U','C','L','N'],
    ['C','L','N','O','T','H','R','V','E','A'],
    ['O','M','E','M','N','U','Z','A','C','K'],
    ['A','O','C','I','F','I','C','A','P','Y'],
    ['D','R','D','W','X','O','E','A','J','M']
  ],words:[
    {w:'PACIFICO',cells:[[8,8],[8,7],[8,6],[8,5],[8,4],[8,3],[8,2],[8,1]]},
    {w:'PATUCA',cells:[[4,2],[5,3],[6,4],[7,5],[8,6],[9,7]]},
    {w:'ROATAN',cells:[[2,0],[2,1],[2,2],[2,3],[2,4],[2,5]]},
    {w:'CELAQUE',cells:[[7,8],[6,8],[5,8],[4,8],[3,8],[2,8],[1,8]]},
    {w:'MONTANA',cells:[[0,9],[1,9],[2,9],[3,9],[4,9],[5,9],[6,9]]},
    {w:'COCO',cells:[[5,7],[4,7],[3,7],[2,7]]}
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
  {q:'Honduras está ubicada en Centroamérica.',a:true},
  {q:'El punto más alto de Honduras es el Pico Bonito.',a:false},
  {q:'El río Coco o Segovia es el más largo del país.',a:true},
  {q:'El Lago de Yojoa es el único lago natural de Honduras.',a:true},
  {q:'Honduras se divide en 18 departamentos.',a:true},
  {q:'La capital de Honduras es San Pedro Sula.',a:false},
  {q:'El Mar Caribe limita al norte de Honduras.',a:true},
  {q:'El río Choluteca pertenece a la vertiente del Caribe.',a:false},
  {q:'Las Islas de la Bahía son Roatán, Utila y Guanaja.',a:true},
  {q:'La Laguna de Caratasca está en La Mosquitia.',a:true},
  {q:'Honduras tiene costas en el Mar Caribe y en el Océano Pacífico.',a:true},
  {q:'En las montañas hace más calor que en las costas.',a:false},
  {q:'Los departamentos se dividen en municipios.',a:true},
  {q:'El Golfo de Fonseca está al norte del país.',a:false},
  {q:'Cerca de las tres cuartas partes de Honduras son montañas.',a:true},
];
const evalMCBank=[
  {q:'¿En qué región de América está Honduras?',o:['a) Sudamérica','b) Centroamérica','c) Norteamérica','d) El Caribe insular'],a:1},
  {q:'¿Cuál es el punto más alto de Honduras?',o:['a) El Cerro Las Minas','b) El Pico Bonito','c) El Cerro Azul','d) La Montaña de la Flor'],a:0},
  {q:'¿Cuál es el río más largo del país?',o:['a) El Ulúa','b) El Choluteca','c) El Coco o Segovia','d) El Aguán'],a:2},
  {q:'¿Cuál es el único lago natural de Honduras?',o:['a) La Laguna de Caratasca','b) El Cajón','c) El Lago de Yojoa','d) El Golfo de Fonseca'],a:2},
  {q:'¿En cuántos departamentos se divide Honduras?',o:['a) 15','b) 18','c) 22','d) 298'],a:1},
  {q:'¿Cuál es la capital de Honduras?',o:['a) San Pedro Sula','b) Comayagua','c) Tegucigalpa','d) Choluteca'],a:2},
  {q:'¿Con qué mar limita Honduras al norte?',o:['a) El Océano Pacífico','b) El Mar Caribe','c) El Golfo de Fonseca','d) El Mar Mediterráneo'],a:1},
  {q:'¿Qué río pertenece a la vertiente del Pacífico?',o:['a) El Ulúa','b) El Patuca','c) El Choluteca','d) El Aguán'],a:2},
  {q:'¿Cuál es el departamento insular de Honduras?',o:['a) Gracias a Dios','b) Islas de la Bahía','c) Atlántida','d) Valle'],a:1},
  {q:'¿Cuál es la laguna más grande del país?',o:['a) La de Yojoa','b) La de Caratasca','c) La de Fonseca','d) La de Alvarado'],a:1},
  {q:'¿En qué departamento está el Cerro Las Minas?',o:['a) Lempira','b) Cortés','c) Olancho','d) Valle'],a:0},
  {q:'¿Cuántos municipios tiene Honduras?',o:['a) 100','b) 200','c) 298','d) 350'],a:2},
  {q:'¿Qué río riega el fértil Valle de Sula?',o:['a) El Ulúa','b) El Choluteca','c) El Coco','d) El Nacaome'],a:0},
  {q:'¿Cuál es la extensión aproximada de Honduras?',o:['a) 112,492 km²','b) 50,000 km²','c) 200,000 km²','d) 8,000 km²'],a:0},
  {q:'¿Cómo se llama la región oriental de grandes bosques?',o:['a) La Mosquitia','b) El Merendón','c) El Valle de Sula','d) El Golfo de Fonseca'],a:0},
];
const evalCPBank=[
  {q:'Honduras está en la región de ___.',a:'Centroamérica'},
  {q:'El punto más alto es el Cerro ___.',a:'Las Minas'},
  {q:'El río más largo es el ___.',a:'Coco o Segovia'},
  {q:'El único lago natural es el Lago de ___.',a:'Yojoa'},
  {q:'Honduras tiene ___ departamentos.',a:'18'},
  {q:'La capital de Honduras es ___.',a:'Tegucigalpa'},
  {q:'Al norte, Honduras limita con el Mar ___.',a:'Caribe'},
  {q:'Al sur del país está el Golfo de ___.',a:'Fonseca'},
  {q:'Los ríos Choluteca y Nacaome son de la vertiente del ___.',a:'Pacífico'},
  {q:'Las Islas de la Bahía son Roatán, Utila y ___.',a:'Guanaja'},
  {q:'La laguna más grande es la de ___.',a:'Caratasca'},
  {q:'Los departamentos se dividen en ___.',a:'municipios'},
  {q:'El clima de Honduras es ___.',a:'tropical'},
  {q:'La región oriental de grandes bosques es La ___.',a:'Mosquitia'},
  {q:'El río ___ riega el Valle de Sula.',a:'Ulúa'},
];
const evalPRBank=[
  {term:'Honduras',def:'País del centro de Centroamérica (112,492 km²)'},
  {term:'Cerro Las Minas',def:'El punto más alto del país (2,870 m)'},
  {term:'Río Coco o Segovia',def:'El río más largo de Honduras'},
  {term:'Lago de Yojoa',def:'El único lago natural'},
  {term:'Laguna de Caratasca',def:'La laguna más grande, en La Mosquitia'},
  {term:'Tegucigalpa',def:'La capital de Honduras'},
  {term:'Mar Caribe',def:'El mar que limita al norte'},
  {term:'Golfo de Fonseca',def:'La entrada del Pacífico, al sur'},
  {term:'Islas de la Bahía',def:'Departamento insular: Roatán, Utila y Guanaja'},
  {term:'Vertiente del Caribe',def:'Agrupa ríos largos como el Ulúa y el Patuca'},
  {term:'Vertiente del Pacífico',def:'Agrupa ríos cortos como el Choluteca'},
  {term:'Departamento',def:'División política grande (hay 18)'},
  {term:'Municipio',def:'División dentro del departamento (hay 298)'},
  {term:'La Mosquitia',def:'Región oriental de grandes bosques'},
  {term:'Puerto Cortés',def:'El puerto más importante, en el Caribe'},
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

function genEval(){sfx('click');_evalFormaSelector(); const _selF = document.getElementById('evalFormaSel'); if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10))); const cf = evalFormNum; const rng = _evalRng(cf); window._currentEvalForm=cf;evalFormNum = (evalFormNum % EVAL_FORMAS) + 1; _evalFormaSelector();saveProgress();document.getElementById('eval-screen-title').textContent=`🎓 Evaluación Final · Forma ${cf} · Geografía de Honduras`;evalAnsVisible=false;const out=document.getElementById('evalOut');out.innerHTML='';const bar=document.createElement('div');bar.className='eval-score-bar';bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje · 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25 pts</span><span class="eval-score-pill esp-tf">V/F 25 pts</span><span class="eval-score-pill esp-mc">Selección 25 pts</span><span class="eval-score-pill esp-pr">Pareados 25 pts</span></div>`;out.appendChild(bar);const cpItems=_pickF(evalCPBank,5, rng);const s1=document.createElement('div');s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';cpItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='cp';d.dataset.evalIndex=i;const qHtml=item.q.replace('___',`<input class="eval-cp-input" type="text" data-cp="${i}" autocomplete="off">`);d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbCp${i}" aria-live="polite"></div>`;s1.appendChild(d);});out.appendChild(s1);const tfItems=_pickF(evalTFBank,5, rng);const s2=document.createElement('div');s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';tfItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='tf';d.dataset.evalIndex=i;d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="true"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="false"> Falso</label></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbTf${i}" aria-live="polite"></div>`;s2.appendChild(d);});out.appendChild(s2);const mcItems=_pickF(evalMCBank,5, rng);const s3=document.createElement('div');s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';mcItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='mc';d.dataset.evalIndex=i;const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join('');d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbMc${i}" aria-live="polite"></div>`;s3.appendChild(d);});out.appendChild(s3);const prItems=_pickF(evalPRBank,5, rng);const shuffledDefs=_shuffleF(prItems, rng);const letters=['A','B','C','D','E'];const s4=document.createElement('div');s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';const matchCard=document.createElement('div');matchCard.className='eval-item';let colLeft='<div class="eval-match-col"><h4>📌 Términos</h4>';prItems.forEach((item,i)=>{colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> <select class="eval-match-select" data-pr="${i}" aria-label="Respuesta pareada ${i+16}"><option value="">—</option>${letters.map(l=>`<option value="${l}">${l}</option>`).join('')}</select> ${item.term}</div>`;});colLeft+='</div>';let colRight='<div class="eval-match-col"><h4>🔑 Definiciones</h4>';shuffledDefs.forEach((item,i)=>{colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`;});colRight+='</div>';const ansKey=prItems.map((item,i)=>{const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)];return`${i+16}→${letter}`;}).join(' · ');matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div><div class="eval-item-feedback" id="evalFbPr" aria-live="polite"></div>`;s4.appendChild(matchCard);out.appendChild(s4);window._evalPrintData={tf:tfItems,mc:mcItems,cp:cpItems,pr:{terms:prItems,shuffledDefs,letters}};const autoPanel=document.createElement('div');autoPanel.id='evalAutoResult';autoPanel.className='eval-auto-result';autoPanel.innerHTML='<strong>🧮 Evaluación interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato original sin respuestas digitadas.';out.appendChild(autoPanel);fin('s-evaluacion');}
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación Geografía de Honduras · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.12rem 0.4rem;margin:0.22rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #2471a3;background:#eaf2f8;color:#2471a3;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#2471a3;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #2471a3;height:12px;}.obt-pct{white-space:nowrap;}.qn{font-weight:700;min-width:22px;flex-shrink:0;}.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:40px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.18rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.14rem 0.35rem;margin-bottom:0.1rem;break-inside:avoid;page-break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.3;display:flex;gap:0.28rem;margin-bottom:0.07rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.1rem 0.5rem;}.mc-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:0.04rem 0.15rem;margin-left:0.8rem;}.mc-opt{font-size:9pt;display:flex;align-items:center;gap:0.15rem;}.mc-opt input{width:10px;height:10px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{margin-top:0.1rem;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.08rem 0.4rem;margin-top:0.08rem;}.pr-head{font-size:9pt;font-weight:700;color:#555;margin-bottom:0.1rem;}.pr-item{font-size:10.5pt;padding:0.1rem 0.28rem;background:#eaf2f8;border-radius:3px;margin-bottom:0.07rem;display:flex;align-items:center;gap:0.2rem;line-height:1.2;break-inside:avoid;page-break-inside:avoid;}.pr-num{font-weight:700;color:#2471a3;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.22rem;padding:0.15rem 0;page-break-before:avoid;break-before:avoid;color:#2471a3;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #2471a3;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#555;}.pa{color:#007a00;font-weight:600;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · Geografía de Honduras · Educación Básica · Ciencias Sociales</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Evaluación Final · Geografía de Honduras · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u</div></div><div class="p-grid">${pR}</div>
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
  {txt:'Una familia de Choluteca viaja de vacaciones a Roatán: sale del calor seco del sur y llega a una isla del Caribe.'},
  {txt:'En el Valle de Sula, el río Ulúa crece con las lluvias de mayo a octubre y a veces se desborda sobre los cultivos.'},
  {txt:'Un turista quiere subir al punto más alto de Honduras y pregunta a qué departamento debe viajar.'},
  {txt:'Un pueblo pesquero del Golfo de Fonseca vive de la pesca y del cultivo de camarón.'},
  {txt:'Una cooperativa de café busca tierras frescas de montaña para sembrar un cafetal de calidad.'},
  {txt:'Un barco carga bananos en Puerto Cortés y los lleva a otros países.'},
];
const critCaseQuestions=[
  '1. ¿Qué lugares o elementos geográficos de Honduras aparecen en este caso?',
  '2. ¿En qué región o vertiente del país ocurre? ¿Cómo lo sabes?',
  '3. ¿Cómo influye la geografía (el relieve, el clima o el agua) en lo que ocurre?',
  '4. ¿Qué recomendación o conclusión puedes dar usando lo que sabes del mapa de Honduras?',
];
const critCaseGuides=[
  'Pueden aparecer ríos (Ulúa), valles (Sula), montañas (Celaque), costas (Caribe o Golfo de Fonseca), islas (Roatán) o puertos (Puerto Cortés).',
  'La región se reconoce por sus señas: el Caribe al norte, el Golfo de Fonseca al sur, las montañas en el centro-occidente y La Mosquitia al oriente.',
  'El relieve y el clima explican lo que pasa: las lluvias crecen los ríos, la altitud refresca el clima, las costas permiten pesca y puertos.',
  'Una buena recomendación usa la geografía: sembrar café en montaña, construir lejos de ríos que se desbordan, usar el puerto más cercano.',
];
const critErrorBank=[
  {txt:'"La capital de Honduras es San Pedro Sula y el país tiene 15 departamentos."',
   g1:'La capital es TEGUCIGALPA (Distrito Central).',
   g2:'Honduras tiene 18 departamentos.'},
  {txt:'"El río más largo de Honduras es el Ulúa y desemboca en el Océano Pacífico."',
   g1:'El río más largo es el COCO O SEGOVIA.',
   g2:'El Ulúa desemboca en el MAR CARIBE.'},
  {txt:'"El Lago de Yojoa es una laguna que está en La Mosquitia."',
   g1:'El Lago de Yojoa es el ÚNICO LAGO NATURAL, entre Comayagua, Cortés y Santa Bárbara.',
   g2:'La laguna de La Mosquitia es la de CARATASCA.'},
  {txt:'"Honduras limita al norte con el Océano Pacífico y al sur con el Mar Caribe."',
   g1:'Al NORTE está el Mar Caribe.',
   g2:'Al SUR está el Golfo de Fonseca (Océano Pacífico).'},
  {txt:'"Honduras es un país plano y su punto más alto es el Pico Bonito."',
   g1:'Honduras es MONTAÑOSO: unas tres cuartas partes son montañas.',
   g2:'El punto más alto es el CERRO LAS MINAS (2,870 m), en Celaque.'},
];
const critDecisionBank=[
  'Para sembrar café de calidad, conviene elegir tierras frescas de montaña, o las llanuras cálidas de la costa.',
  'Para exportar bananos del Valle de Sula, conviene usar Puerto Cortés en el Caribe, o el puerto de San Lorenzo en el Pacífico.',
  'Para conocer arrecifes de coral, conviene viajar a las Islas de la Bahía, o al Lago de Yojoa.',
  'Si una comunidad vive junto a un río que se desborda cada año, conviene construir las casas en zonas altas, o en la orilla del río.',
  'Para observar aves y pescar en agua dulce, conviene visitar el Lago de Yojoa, o el Golfo de Fonseca.',
];
const critDecisionGuide='La mejor decisión aprovecha la geografía: el café se da en montañas frescas; los bananos del Valle de Sula salen por Puerto Cortés porque está cerca y en el Caribe; los arrecifes están en las Islas de la Bahía; junto a un río que se desborda se construye en zonas altas; y el Lago de Yojoa es agua dulce, ideal para aves y pesca.';
const critCompareBank=[
  {a:'Agrupa ríos largos y caudalosos que desembocan en el Mar Caribe.',b:'Agrupa ríos cortos que desembocan en el Golfo de Fonseca.',
   ga:'La vertiente del Caribe.',
   gb:'La vertiente del Pacífico.',
   gr:'Las dos agrupan ríos, pero se diferencian por el mar donde desembocan y por el largo de sus ríos.'},
  {a:'División política grande; Honduras tiene 18.',b:'División más pequeña; Honduras tiene 298.',
   ga:'El departamento.',
   gb:'El municipio.',
   gr:'Los dos organizan el territorio, pero los municipios están dentro de los departamentos.'},
  {a:'El único lago natural, famoso por sus aves y peces.',b:'La laguna más grande, en La Mosquitia.',
   ga:'El Lago de Yojoa.',
   gb:'La Laguna de Caratasca.',
   gr:'Los dos son cuerpos de agua tranquila, pero uno es un lago del interior y la otra es una laguna costera del oriente.'},
];
const critCauseBank=[
  {cause:'Honduras tiene montañas altas y frescas.',guide:'En ellas se cultiva café de buena calidad y el clima es templado.'},
  {cause:'Llueve mucho de mayo a octubre.',guide:'Los ríos crecen y algunos, como el Ulúa, pueden desbordarse.'},
  {cause:'El Valle de Sula es plano, fértil y regado por el río Ulúa.',guide:'Allí hay grandes cultivos y ciudades como San Pedro Sula.'},
  {cause:'Honduras tiene costas en el Caribe y en el Pacífico.',guide:'Puede pescar y comerciar por los dos mares con sus puertos.'},
];
const critEffectBank=[
  {effect:'A las Islas de la Bahía llegan muchos turistas.',guide:'Porque tienen playas y arrecifes de coral en el Mar Caribe.'},
  {effect:'En la costa hace más calor que en la montaña.',guide:'Porque el clima cambia con la altitud: a mayor altura, más fresco.'},
  {effect:'La Mosquitia tiene pocos habitantes.',guide:'Porque es una región de grandes bosques y ríos, de difícil acceso.'},
  {effect:'El sur del país produce camarones y melones.',guide:'Porque el Golfo de Fonseca y su llanura cálida lo permiten.'},
];
function genEvalCrit(){
  sfx('click');
  _injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });
  const _sC = document.getElementById('evalCritFormaSel');
  if (_sC && parseInt(_sC.value, 10)) evalCritFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sC.value, 10)));
  const cf=evalCritFormNum;window._currentEvalCritForm=cf;const rngC = _evalRng(200000 + cf);evalCritFormNum=(evalCritFormNum%EVAL_FORMAS)+1;_injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });saveProgress();
  document.getElementById('evalcrit-screen-title').textContent=`🧠 Pensamiento Crítico · Forma ${cf} · Geografía de Honduras`;
  evalCritAnsVisible=false;
  const out=document.getElementById('evalCritOut');out.innerHTML='';
  const kase=_pickF(critCaseBank,1,rngC)[0];
  const s1=document.createElement('div');
  s1.innerHTML=`<div class="eval-section-title">I. Caso de análisis: la geografía en la vida diaria <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${kase.txt}</div>${critCaseQuestions.map((q,i)=>`<div class="crit-q-block"><div class="crit-q-label">${q}</div><textarea class="crit-textarea" rows="2" aria-label="${q}"></textarea><div class="crit-pauta">${critCaseGuides[i]}</div></div>`).join('')}<div class="crit-selfscore"><label for="critScore0">Obtenido:</label><input type="number" id="critScore0" class="crit-score-input" data-score="0" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s1);
  const err=_pickF(critErrorBank,1,rngC)[0];
  const s2=document.createElement('div');
  s2.innerHTML=`<div class="eval-section-title">II. Corrige el error <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${err.txt}</div><p style="font-size:0.85rem;margin-bottom:0.5rem;">Identifica <strong>dos errores</strong> y corrígelos con tus propias palabras:</p><div class="crit-q-block"><div class="crit-q-label">Error 1 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 1 y su corrección"></textarea><div class="crit-pauta">${err.g1}</div></div><div class="crit-q-block"><div class="crit-q-label">Error 2 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 2 y su corrección"></textarea><div class="crit-pauta">${err.g2}</div></div><div class="crit-selfscore"><label for="critScore1">Obtenido:</label><input type="number" id="critScore1" class="crit-score-input" data-score="1" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s2);
  const dec=_pickF(critDecisionBank,1,rngC)[0];
  const s3=document.createElement('div');
  s3.innerHTML=`<div class="eval-section-title">III. Toma de decisiones: usar el mapa <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${dec}</div><div class="crit-q-block"><div class="crit-q-label">¿Qué opción recomendarías? Explica por qué, relacionándolo con el relieve, el clima, los ríos y las regiones de Honduras.</div><textarea class="crit-textarea" rows="4" aria-label="Recomendaciones y su justificación"></textarea><div class="crit-pauta">${critDecisionGuide}</div></div><div class="crit-selfscore"><label for="critScore2">Obtenido:</label><input type="number" id="critScore2" class="crit-score-input" data-score="2" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s3);
  const cmp=_pickF(critCompareBank,1,rngC)[0];
  const s4=document.createElement('div');
  s4.innerHTML=`<div class="eval-section-title">IV. Comparación razonada <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-compare-grid"><div class="crit-compare-box"><h5>Caso A</h5>${cmp.a}</div><div class="crit-compare-box"><h5>Caso B</h5>${cmp.b}</div></div><div class="crit-q-block"><div class="crit-q-label">1. ¿Qué lugar o concepto de Honduras corresponde a cada caso? 2. ¿Qué característica tiene cada uno? 3. ¿Por qué no son lo mismo?</div><textarea class="crit-textarea" rows="4" aria-label="Comparación razonada de los casos A y B"></textarea><div class="crit-pauta">Caso A: ${cmp.ga} · Caso B: ${cmp.gb} · ${cmp.gr}</div></div><div class="crit-selfscore"><label for="critScore3">Obtenido:</label><input type="number" id="critScore3" class="crit-score-input" data-score="3" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
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
  let s1=`<div class="sec-title"><span>I. Caso de análisis: la geografía en la vida diaria</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.kase.txt}</p>`;
  critCaseQuestions.forEach(q=>{s1+=`<p class="crit-print-q">${q}</p>${lines(1)}`;});
  let s2=`<div class="sec-title"><span>II. Corrige el error</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.err.txt}</p><p class="crit-print-q">Identifica dos errores y corrígelos con tus propias palabras:</p><p class="crit-print-q"><strong>Error 1:</strong></p>${lines(1)}<p class="crit-print-q"><strong>Error 2:</strong></p>${lines(1)}`;
  let s3=`<div class="sec-title"><span>III. Toma de decisiones: usar el mapa</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.dec}</p><p class="crit-print-q">¿Qué opción recomendarías? Explica por qué, relacionándolo con el relieve, el clima, los ríos y las regiones de Honduras.</p>${lines(2)}`;
  let s4=`<div class="sec-title"><span>IV. Comparación razonada</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><div class="crit-compare-print-grid"><div class="crit-compare-print-box"><strong>Caso A:</strong> ${d.cmp.a}</div><div class="crit-compare-print-box"><strong>Caso B:</strong> ${d.cmp.b}</div></div><p class="crit-print-q">1. ¿Qué lugar o concepto de Honduras corresponde a cada caso? 2. ¿Qué característica tiene cada uno? 3. ¿Por qué no son lo mismo?</p>${lines(2)}`;
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
  const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Pensamiento Crítico Geografía de Honduras · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.1rem 0.4rem;margin:0.2rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #2471a3;background:#eaf2f8;color:#2471a3;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#2471a3;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #2471a3;height:12px;}.obt-pct{white-space:nowrap;}.crit-print-scenario{font-size:10.5pt;background:#eaf2f8;border-left:3px solid #2471a3;padding:0.2rem 0.5rem;margin:0.1rem 0 0.2rem;line-height:1.3;}.crit-print-q{font-size:10pt;font-weight:600;margin:0.15rem 0 0.08rem;line-height:1.25;}.ln{border-bottom:1px solid #111;min-height:12px;margin-bottom:2px;}.crit-compare-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin:0.15rem 0;}.crit-compare-print-box{font-size:9.5pt;background:#eaf2f8;border-radius:4px;padding:0.25rem 0.4rem;line-height:1.25;}.crit-print-tbl{width:100%;border-collapse:collapse;font-size:9.5pt;margin-top:0.15rem;}.crit-print-tbl th,.crit-print-tbl td{border:1px solid #999;padding:0.3rem 0.45rem;text-align:left;height:30px;vertical-align:middle;}.crit-print-tbl th{background:#eaf2f8;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:9.5pt;font-weight:700;}.p-sub{font-size:7pt;color:#c00;font-weight:700;margin:0.08rem 0;}.p-meta{font-size:7pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.9rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.45rem;}.p-ttl{font-size:8pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.1rem;margin-bottom:0.18rem;}.p-crit-line{font-size:7.5pt;color:#007a00;margin-bottom:0.18rem;line-height:1.35;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.2rem;padding:0.1rem 0;color:#2471a3;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #2471a3;}.forma-tag{position:fixed;bottom:5mm;right:6mm;font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;}@media print{@page{size:letter portrait;margin:12.7mm;}}</style></head><body><div class="ph"><h2>Evaluación Competencial · Pensamiento Crítico · Geografía de Honduras · Educación Básica · Ciencias Sociales</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Institución:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 5 secciones de 20 puntos</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100</span></div><div class="pauta-wrap"><div class="p-head"><div class="p-main">✅ PAUTA — Pensamiento Crítico · Geografía de Honduras · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 5 secciones × 20 pts c/u — respuesta abierta, usar como guía de corrección</div></div><div class="p-grid">${pR}</div></div><div class="forma-tag">Forma ${forma}</div></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(doc);win.document.close();setTimeout(()=>win.print(),400);
}

// ===================== LABORATORIO DE GEOGRAFÍA =====================
const parteData={
  ubicacion:{
    nombre:'Ubicación y límites',icon:'🧭',
    estructura:{title:'¿Qué es?',info:'• Honduras está en <strong>Centroamérica</strong><br>• Extensión: unos <strong>112,492 km²</strong><br>• Se le llama «el corazón de Centroamérica»'},
    funcion:{title:'Características',info:'• <strong>Norte:</strong> Mar Caribe<br>• <strong>Sur:</strong> Golfo de Fonseca, Nicaragua y El Salvador<br>• <strong>Este:</strong> Nicaragua<br>• <strong>Oeste:</strong> Guatemala y El Salvador'},
    ubicacion:{title:'Ejemplos',info:'• Costa <strong>norte</strong>: larga, sobre el Caribe<br>• Costa <strong>sur</strong>: corta, en el Golfo de Fonseca<br>• Fronteras con <strong>3 países</strong> vecinos'},
    dato:{title:'Dato curioso',info:'• Honduras tiene <strong>dos costas</strong>: puede ver el amanecer en el Caribe y el atardecer en el Pacífico<br>• Sus islas llegan hasta los arrecifes de coral<br>• Es el segundo país más grande de Centroamérica'}
  },
  relieve:{
    nombre:'El relieve',icon:'⛰️',
    estructura:{title:'¿Qué es?',info:'• Son las <strong>formas del terreno</strong>: montañas, valles y llanuras<br>• Honduras es un país <strong>montañoso</strong><br>• Unas <strong>tres cuartas partes</strong> son montañas'},
    funcion:{title:'Características',info:'• <strong>Cordilleras</strong> como el Merendón y Nombre de Dios<br>• <strong>Valles</strong> fértiles: Sula, Comayagua, Aguán<br>• <strong>Llanuras</strong> en las costas'},
    ubicacion:{title:'Ejemplos',info:'• <strong>Cerro Las Minas</strong> (2,870 m): el punto más alto, en Celaque<br>• <strong>Valle de Sula</strong>: el más productivo<br>• Llanura costera del <strong>Caribe</strong>'},
    dato:{title:'Dato curioso',info:'• Al Cerro Las Minas también se le llama <strong>Pico Celaque</strong><br>• En las montañas altas hace <strong>frío</strong> aunque el país sea tropical<br>• El café hondureño crece en las montañas'}
  },
  aguas:{
    nombre:'Ríos, lagos y lagunas',icon:'🏞️',
    estructura:{title:'¿Qué es?',info:'• Son las <strong>aguas</strong> del país: ríos, lagos y lagunas<br>• Los ríos se agrupan en <strong>dos vertientes</strong><br>• Según el mar donde desembocan'},
    funcion:{title:'Características',info:'• <strong>Vertiente del Caribe:</strong> ríos largos (Ulúa, Chamelecón, Aguán, Patuca, Coco)<br>• <strong>Vertiente del Pacífico:</strong> ríos cortos (Choluteca, Goascorán, Nacaome)'},
    ubicacion:{title:'Ejemplos',info:'• <strong>Río Coco o Segovia:</strong> el más largo<br>• <strong>Lago de Yojoa:</strong> el único lago natural<br>• <strong>Laguna de Caratasca:</strong> la más grande, en La Mosquitia'},
    dato:{title:'Dato curioso',info:'• El río <strong>Choluteca</strong> pasa por Tegucigalpa y desemboca en el Pacífico<br>• En el <strong>Lago de Yojoa</strong> viven cientos de especies de aves<br>• La represa <strong>El Cajón</strong> forma un gran lago artificial'}
  },
  clima:{
    nombre:'El clima',icon:'🌦️',
    estructura:{title:'¿Qué es?',info:'• Es el estado del tiempo <strong>a lo largo del año</strong><br>• El de Honduras es <strong>tropical</strong><br>• Cambia con la <strong>altitud</strong>'},
    funcion:{title:'Características',info:'• <strong>Costas y llanuras:</strong> cálidas todo el año<br>• <strong>Montañas:</strong> clima templado y fresco<br>• <strong>Lluviosa:</strong> mayo a octubre · <strong>Seca:</strong> noviembre a abril'},
    ubicacion:{title:'Ejemplos',info:'• <strong>La Ceiba</strong> (costa): calor y lluvia<br>• <strong>La Esperanza</strong> (montaña): la ciudad más fresca<br>• <strong>Choluteca</strong> (sur): muy calurosa y seca'},
    dato:{title:'Dato curioso',info:'• A mayor <strong>altura</strong>, más fresco el clima<br>• En Celaque puede bajar cerca de los <strong>0 °C</strong><br>• Las lluvias del Caribe alimentan los grandes ríos'}
  },
  division:{
    nombre:'La división política',icon:'🏛️',
    estructura:{title:'¿Qué es?',info:'• Es la forma de <strong>organizar el territorio</strong> para gobernarlo<br>• Honduras tiene <strong>18 departamentos</strong><br>• Divididos en <strong>298 municipios</strong>'},
    funcion:{title:'Características',info:'• Cada departamento tiene su <strong>cabecera</strong><br>• La capital es <strong>Tegucigalpa</strong> (Distrito Central)<br>• <strong>Islas de la Bahía</strong> es el departamento insular'},
    ubicacion:{title:'Ejemplos',info:'• <strong>Cortés</strong> → San Pedro Sula<br>• <strong>Atlántida</strong> → La Ceiba<br>• <strong>Gracias a Dios</strong> → Puerto Lempira (La Mosquitia)'},
    dato:{title:'Dato curioso',info:'• El Distrito Central une <strong>dos ciudades</strong>: Tegucigalpa y Comayagüela<br>• <strong>Gracias a Dios</strong> debe su nombre a una frase de Colón<br>• El departamento más pequeño es <strong>Islas de la Bahía</strong>'}
  }
};
let labParte='ubicacion',labAspecto='estructura';
function labShowParte(parteKey){labParte=parteKey;updateLabDisplay();document.querySelectorAll('.lab-cont-btn').forEach(b=>b.classList.remove('active-pri'));const btn=document.querySelector(`[data-parte="${parteKey}"]`);if(btn)btn.classList.add('active-pri');if(typeof sfx==='function')sfx('click');}
function labShowAspecto(aspectoKey){labAspecto=aspectoKey;updateLabDisplay();document.querySelectorAll('.lab-asp-btn').forEach(b=>b.classList.remove('active-sec'));const btn=document.querySelector(`[data-aspecto="${aspectoKey}"]`);if(btn)btn.classList.add('active-sec');if(typeof sfx==='function')sfx('click');}
function updateLabDisplay(){const data=parteData[labParte];const asp=data[labAspecto];document.getElementById('lab-sentence').innerHTML=`🔬 Explorando: <strong>${data.nombre}</strong> → <strong>${asp.title}</strong>`;document.getElementById('lab-display').innerHTML=`<div class="lab-cont-header">${data.icon} ${data.nombre}</div><div class="lab-asp-title">${asp.title}</div><div class="lab-asp-info">${asp.info}</div>`;}

// ===================== DIPLOMA =====================
function _diplPct(){return xp>=MXP?100:Math.round((xp/MXP)*100);}
function openDiploma(){sfx('fan');const pct=_diplPct();document.getElementById('diplPct').textContent=pct+'%';document.getElementById('diplBar').style.width=pct+'%';document.getElementById('diplDate').textContent='Fecha: '+new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});const msgs=['¡Sigue aprendiendo!','¡Muy buen trabajo!','¡Vas muy bien!','¡Dominas el mundo maya y precolombino!','¡Guardián de Copán!'];document.getElementById('diplMsg').textContent=msgs[Math.min(Math.floor(pct/25),4)];const stars=['⭐','⭐⭐','⭐⭐⭐'];document.getElementById('diplStars').textContent=stars[Math.min(Math.floor(pct/40),2)];const achTxt=unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(' · ');document.getElementById('diplAch').textContent=achTxt||'Sigue completando secciones para desbloquear logros';document.getElementById('diplomaOverlay').classList.add('open');launchConfetti();}
function closeDiploma(){document.getElementById('diplomaOverlay').classList.remove('open');}
function updateDiplomaName(v){document.getElementById('diplName').textContent=v||'Estudiante';}
function shareWA(){const name=document.getElementById('diplName').textContent||'Estudiante';const pct=_diplPct();const msg=`🗿 ¡${name} completó la Misión "Los Mayas y las Culturas Precolombinas"! 🏅 Progreso: ${pct}% · 🌱 policastsapien.com`;_waShare(msg);}
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
  document.querySelector('[data-parte="mayas"]')?.classList.add('active-pri');
  document.querySelector('[data-aspecto="estructura"]')?.classList.add('active-sec');
  renderAchPanel();
});

(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalCrit==='function') _injectFormaSel('genEvalCrit','evalCritFormaSel',evalCritFormNum,function(v){evalCritFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();
