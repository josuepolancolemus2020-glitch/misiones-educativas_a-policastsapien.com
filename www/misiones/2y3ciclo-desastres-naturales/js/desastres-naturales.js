// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
function compartirMision(){const url=window.location.href;const texto=`🚀 *Misión Asignada* 🚀\n\nPractica sobre este tema y sobresale en ser de los mejores alumnos. 🏆\n\nDesbloquea *todos los logros* y envía a tu maestro la *constancia de logro* cuando hayas culminado. 📋\n\n_Se te hará prueba escrita y serás excelente estudiante en Ciencias Naturales._ ✍️\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;_waShare(texto);}
function toggleLetra(){document.body.classList.toggle('letra-grande');if(typeof sfx==='function')sfx('click');localStorage.setItem('preferenciaLetra',document.body.classList.contains('letra-grande'));}
window.addEventListener('DOMContentLoaded',()=>{if(localStorage.getItem('preferenciaLetra')==='true')document.body.classList.add('letra-grande');});

// ===================== UTILIDADES =====================
const _pick=(arr,n)=>[...arr].sort(()=>Math.random()-0.5).slice(0,n);
const _shuffle=(arr)=>[...arr].sort(()=>Math.random()-0.5);
function fb(id,msg,isOk){const el=document.getElementById(id);if(el){el.textContent=msg;el.className='fb show '+(isOk?'ok':'err');}}

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY='desastres_naturales_v1';
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
  primer_quiz:{icon:'🧠',label:'Primera prueba sobre desastres superada'},
  flash_master:{icon:'🃏',label:'Todas las flashcards de desastres exploradas'},
  clasif_pro:{icon:'🗂️',label:'Clasificador de amenazas y prevención experto'},
  id_master:{icon:'🔍',label:'Identificador de conceptos de riesgo maestro'},
  reto_hero:{icon:'🏆',label:'Héroe del reto de gestión de riesgos'},
  nivel3:{icon:'🌦️',label:'¡Brigadista junior! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡Maestro en Prevención de Desastres! Nivel 6'},
  widgets_master:{icon:'🧩',label:'Widgets de desastres dominados'}
};
function unlockAchievement(id){if(unlockedAch.includes(id))return;unlockedAch.push(id);sfx('ach');showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label);launchConfetti();renderAchPanel();saveProgress();}
function renderAchPanel(){const list=document.getElementById('achList');list.innerHTML='';Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{const div=document.createElement('div');div.className='ach-item'+(unlockedAch.includes(id)?'':' locked');div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`;list.appendChild(div);});}
function toggleAchPanel(){sfx('click');document.getElementById('achPanel').classList.toggle('open');}
function showToast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}t.textContent=msg;t.style.display='block';clearTimeout(t._tid);t._tid=setTimeout(()=>t.style.display='none',3200);}
function launchConfetti(){const colors=['#1565a3','#4d94c9','#e8590c','#ff922b','#00b894'];for(let i=0;i<60;i++){const c=document.createElement('div');c.className='confetti-piece';c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`;document.body.appendChild(c);c.addEventListener('animationend',()=>c.remove());}}

// ===================== XP =====================
const lvls=[{t:0,n:'Aprendiz 🌱'},{t:25,n:'Explorador 🔎'},{t:55,n:'Observador del clima 🌦️'},{t:90,n:'Brigadista 🦺'},{t:130,n:'Analista de riesgos 📊'},{t:165,n:'Gestor de riesgos 🛡️'},{t:190,n:'Maestro en Prevención 🏆'}];
function pts(n){xp=Math.max(0,Math.min(MXP,xp+n));updateXPBar();saveProgress();}
function updateXPBar(){const pct=Math.round((xp/MXP)*100);document.getElementById('xpFill').style.width=pct+'%';const el=document.getElementById('xpPts');el.textContent='⭐ '+xp;el.style.transform='scale(1.3)';setTimeout(()=>el.style.transform='',300);let lv=0;for(let i=0;i<lvls.length;i++)if(xp>=lvls[i].t)lv=i;document.getElementById('xpLvl').textContent=lvls[lv].n;if(lv!==prevLevel){if(lv>=2)unlockAchievement('nivel3');if(lv>=5)unlockAchievement('nivel5');prevLevel=lv;}}
function resetXP(){sfx('click');xp=0;updateXPBar();showToast('🔄 XP reiniciado a 0');}
function fin(id,showFX=true){if(!done.has(id)){done.add(id);const b=document.querySelector(`[data-s="${id}"]`);if(b)b.classList.add('done');if(showFX){sfx('up');launchConfetti();}saveProgress();}}
function getProgress(){return Math.round((done.size/TOTAL_SECTIONS)*100);}

// ===================== NAV =====================
function go(id){sfx('click');document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});document.getElementById(id).classList.add('active');const btn=document.querySelector(`[data-s="${id}"]`);if(btn){btn.classList.add('active');btn.setAttribute('aria-selected','true');}window.scrollTo({top:0,behavior:'smooth'});if(id==='s-sopa'){setTimeout(buildSopa,50);}if(id==='s-widgets'){setTimeout(buildRoute,50);}}

// ===================== FLASHCARD DATA =====================
const fcData=[
  {w:'Desastre natural',a:'🌍 Es la <strong>gran alteración</strong> que ocurre cuando un fenómeno natural (una <strong>amenaza</strong>) afecta a una comunidad <strong>vulnerable</strong> y causa daños que superan su capacidad de responder por sí sola. El fenómeno solo se vuelve desastre cuando hay <strong>población en riesgo</strong>.'},
  {w:'Amenaza (peligro)',a:'⚠️ Es el <strong>fenómeno o evento</strong> que puede causar daño: un huracán, un terremoto, una inundación o un deslizamiento. Puede ser <strong>natural</strong> (sismo) o <strong>provocada por el ser humano</strong> (deforestación, mala construcción).'},
  {w:'Vulnerabilidad',a:'🏚️ Es la <strong>debilidad o el grado de exposición</strong> de una comunidad ante una amenaza. Vivir a la orilla de un río, en laderas inestables o en casas mal construidas <strong>aumenta la vulnerabilidad</strong>.'},
  {w:'Riesgo',a:'📊 Es la <strong>probabilidad de sufrir daños</strong> cuando se juntan una amenaza y la vulnerabilidad. Se resume así: <strong>Riesgo = Amenaza × Vulnerabilidad</strong>. Reduciendo la vulnerabilidad y preparándonos, <strong>baja el riesgo</strong>.'},
  {w:'Huracán Mitch',a:'🌀 Poderoso huracán de <strong>categoría 5</strong> que en <strong>octubre y noviembre de 1998</strong> golpeó Centroamérica. Fue uno de los <strong>peores desastres de la historia de Honduras</strong>: dejó miles de muertos, inundaciones, deslizamientos y enormes pérdidas.'},
  {w:'Huracán (ciclón tropical)',a:'🌪️ Enorme tormenta giratoria que se forma sobre el <strong>mar cálido</strong> (más de 26 °C). Tiene un centro tranquilo llamado <strong>ojo</strong>, rodeado por la <strong>pared del ojo</strong> y <strong>bandas de nubes</strong> con vientos y lluvias muy fuertes.'},
  {w:'Escala Saffir-Simpson',a:'🌬️ Escala que clasifica los huracanes en <strong>5 categorías</strong> según la <strong>velocidad de sus vientos</strong>. La categoría 1 es la más débil y la <strong>categoría 5</strong> la más destructiva. El Mitch alcanzó la <strong>categoría 5</strong>.'},
  {w:'Inundación',a:'🌊 Ocurre cuando el <strong>agua cubre terrenos que normalmente están secos</strong>, por lluvias intensas o el desbordamiento de ríos. Fue uno de los mayores daños del Mitch: ríos crecidos arrasaron casas y cultivos.'},
  {w:'Deslizamiento de tierra',a:'⛰️ Es el <strong>desplazamiento de tierra, lodo y rocas</strong> por una ladera. Las <strong>lluvias intensas</strong> y la <strong>deforestación</strong> lo provocan. Durante el Mitch sepultó comunidades enteras, como en el volcán Casita (Nicaragua).'},
  {w:'Terremoto (sismo)',a:'🏚️ Es un <strong>movimiento brusco del suelo</strong> causado por la liberación de energía dentro de la Tierra. Es una amenaza <strong>geológica</strong>. Ante un sismo hay que <strong>agacharse, cubrirse y sujetarse</strong>.'},
  {w:'Prevención',a:'🛡️ Son las <strong>acciones para evitar o reducir</strong> los daños de un desastre <strong>antes</strong> de que ocurra: reforestar, no construir en zonas de riesgo, tener un plan familiar y practicar simulacros.'},
  {w:'Mitigación',a:'🧱 Son las medidas para <strong>disminuir el impacto</strong> de una amenaza: construir muros de contención, drenajes, obras seguras y reforestar laderas. No evita el fenómeno, pero <strong>reduce el daño</strong>.'},
  {w:'Alerta temprana',a:'🚨 Sistema que <strong>avisa a tiempo</strong> sobre una amenaza para poder evacuar. Suele usar colores: <strong>verde</strong> (normal), <strong>amarilla</strong> (atención), <strong>roja</strong> (peligro, evacuar).'},
  {w:'COPECO',a:'🏛️ <strong>Comité Permanente de Contingencias</strong> de Honduras. Es la institución encargada de <strong>prevenir, preparar y coordinar la respuesta</strong> ante los desastres. Se fortaleció tras el huracán Mitch.'},
];
let fcIdx=0;
function upFC(){document.getElementById('fcInner').classList.remove('flipped');document.getElementById('fcW').textContent=fcData[fcIdx].w;document.getElementById('fcA').innerHTML=fcData[fcIdx].a;document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length;}
function flipCard(){sfx('flip');document.getElementById('fcInner').classList.toggle('flipped');if(!xpTracker.fc.has(fcIdx)){xpTracker.fc.add(fcIdx);pts(1);}if(xpTracker.fc.size===fcData.length){fin('s-flash');unlockAchievement('flash_master');}}
function nextFC(){sfx('click');fcIdx=(fcIdx+1)%fcData.length;upFC();}
function prevFC(){sfx('click');fcIdx=(fcIdx-1+fcData.length)%fcData.length;upFC();}

// ===================== QUIZ DATA =====================
const qzData=[
  {q:'¿Cuándo un fenómeno natural se convierte en desastre?',o:['a) Siempre que ocurre','b) Cuando afecta a una comunidad vulnerable y causa daños','c) Solo si ocurre de noche','d) Cuando lo predice la ciencia'],c:1},
  {q:'¿En qué año golpeó el huracán Mitch a Centroamérica?',o:['a) 1988','b) 1998','c) 2008','d) 2018'],c:1},
  {q:'¿Qué categoría máxima alcanzó el huracán Mitch?',o:['a) Categoría 1','b) Categoría 3','c) Categoría 5','d) Categoría 7'],c:2},
  {q:'¿Cómo se llama la fórmula del riesgo de desastre?',o:['a) Riesgo = Amenaza × Vulnerabilidad','b) Riesgo = Lluvia + Viento','c) Riesgo = Amenaza − Prevención','d) Riesgo = Población'],c:0},
  {q:'¿Cuál de estas es una amenaza GEOLÓGICA?',o:['a) Huracán','b) Inundación','c) Terremoto','d) Sequía'],c:2},
  {q:'¿Sobre qué se forman los huracanes?',o:['a) Sobre montañas frías','b) Sobre el mar cálido','c) Sobre desiertos','d) Sobre los polos'],c:1},
  {q:'¿Qué acción REDUCE la vulnerabilidad ante deslizamientos?',o:['a) Deforestar las laderas','b) Construir a la orilla del río','c) Reforestar y no construir en laderas','d) Ignorar las alertas'],c:2},
  {q:'¿Qué institución coordina la respuesta a desastres en Honduras?',o:['a) COPECO','b) La alcaldía únicamente','c) La escuela','d) El hospital'],c:0},
  {q:'¿Qué significa una ALERTA ROJA?',o:['a) Todo está normal','b) Hay que estar atentos','c) Peligro: hay que evacuar','d) Ya pasó el peligro'],c:2},
];
let qzIdx=0,qzSel=-1,qzDone=false;
function buildQz(){qzIdx=0;qzSel=-1;qzDone=false;showQz();}
function showQz(){if(qzIdx>=qzData.length){document.getElementById('qzQ').textContent='🎉 ¡Quiz completado!';document.getElementById('qzOpts').innerHTML='';fin('s-quiz');unlockAchievement('primer_quiz');return;}const q=qzData[qzIdx];document.getElementById('qzProg').textContent=`Pregunta ${qzIdx+1} de ${qzData.length}`;document.getElementById('qzQ').textContent=q.q;const opts=document.getElementById('qzOpts');opts.innerHTML='';q.o.forEach((o,i)=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=o;b.onclick=()=>{if(qzDone)return;document.querySelectorAll('.qz-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');qzSel=i;sfx('click');};opts.appendChild(b);});qzDone=false;}
function checkQz(){if(qzSel<0)return fb('fbQz','Selecciona una respuesta.',false);qzDone=true;const opts=document.querySelectorAll('.qz-opt');if(qzSel===qzData[qzIdx].c){opts[qzSel].classList.add('correct');fb('fbQz','¡Correcto! +5 XP',true);if(!xpTracker.qz.has(qzIdx)){xpTracker.qz.add(qzIdx);pts(5);}sfx('ok');}else{opts[qzSel].classList.add('wrong');opts[qzData[qzIdx].c].classList.add('correct');fb('fbQz','Incorrecto. Revisa la respuesta correcta.',false);sfx('no');}setTimeout(()=>{qzIdx++;qzSel=-1;showQz();},1600);}
function resetQz(){sfx('click');qzIdx=0;qzSel=-1;qzDone=false;showQz();document.getElementById('fbQz').classList.remove('show');}

// ===================== CLASIFICACIÓN =====================
const classGroups=[
  {label:['Amenaza','Prevención'],headA:'⚠️ Es una Amenaza',headB:'🛡️ Es una acción de Prevención',colA:'amenaza',colB:'prev',
   words:[{w:'Huracán',t:'amenaza'},{w:'Reforestar las laderas',t:'prev'},{w:'Terremoto',t:'amenaza'},{w:'Tener un plan familiar',t:'prev'},{w:'Inundación',t:'amenaza'},{w:'Hacer simulacros',t:'prev'},{w:'Deslizamiento',t:'amenaza'},{w:'No construir en zonas de riesgo',t:'prev'},{w:'Sequía',t:'amenaza'},{w:'Preparar una mochila de emergencia',t:'prev'}]},
  {label:['Geológica','Hidrometeorológica'],headA:'🏔️ Amenaza Geológica',headB:'🌧️ Amenaza Hidrometeorológica',colA:'geo',colB:'hidro',
   words:[{w:'Terremoto',t:'geo'},{w:'Huracán',t:'hidro'},{w:'Erupción volcánica',t:'geo'},{w:'Inundación',t:'hidro'},{w:'Tsunami',t:'geo'},{w:'Sequía',t:'hidro'},{w:'Sismo',t:'geo'},{w:'Tormenta tropical',t:'hidro'},{w:'Falla geológica',t:'geo'},{w:'Lluvias intensas',t:'hidro'}]},
  {label:['Aumenta riesgo','Reduce riesgo'],headA:'📈 Aumenta el riesgo',headB:'📉 Reduce el riesgo',colA:'sube',colB:'baja',
   words:[{w:'Deforestar los cerros',t:'sube'},{w:'Reforestar',t:'baja'},{w:'Construir a la orilla del río',t:'sube'},{w:'Respetar las zonas seguras',t:'baja'},{w:'Ignorar las alertas',t:'sube'},{w:'Atender la alerta temprana',t:'baja'},{w:'Tirar basura en los cauces',t:'sube'},{w:'Limpiar drenajes',t:'baja'},{w:'Casas mal construidas',t:'sube'},{w:'Construcción segura',t:'baja'}]},
  {label:['Antes','Durante/Después'],headA:'📝 ANTES del desastre',headB:'🚨 DURANTE o DESPUÉS',colA:'antes',colB:'dur',
   words:[{w:'Elaborar el plan de emergencia',t:'antes'},{w:'Evacuar a la zona segura',t:'dur'},{w:'Identificar rutas de evacuación',t:'antes'},{w:'Mantener la calma y protegerse',t:'dur'},{w:'Preparar la mochila de emergencia',t:'antes'},{w:'Ayudar a los heridos',t:'dur'},{w:'Practicar simulacros',t:'antes'},{w:'No cruzar ríos crecidos',t:'dur'},{w:'Reforestar y hacer obras',t:'antes'},{w:'Revisar daños con cuidado',t:'dur'}]},
];
let currentClassGroupIdx=0,clsSelectedWord=null;
function buildClass(){const group=classGroups[currentClassGroupIdx];document.getElementById('col-left-head').textContent=group.headA;document.getElementById('col-right-head').textContent=group.headB;const bank=document.getElementById('clsBank');bank.innerHTML='';clsSelectedWord=null;document.getElementById('items-left').innerHTML='';document.getElementById('items-right').innerHTML='';_shuffle([...group.words]).forEach(w=>{const el=document.createElement('div');el.className='wb-item';el.textContent=w.w;el.dataset.t=w.t;el.onclick=()=>{document.querySelectorAll('.wb-item').forEach(i=>i.classList.remove('sel-word'));el.classList.add('sel-word');clsSelectedWord=el;sfx('click');};bank.appendChild(el);});['col-left','col-right'].forEach(colId=>{const col=document.getElementById(colId);col.onclick=(e)=>{if(!clsSelectedWord||e.target.classList.contains('drop-item'))return;const targetId=colId==='col-left'?'items-left':'items-right';const wordsCol=document.getElementById(targetId);const item=document.createElement('div');item.className='drop-item';item.textContent=clsSelectedWord.textContent;item.dataset.t=clsSelectedWord.dataset.t;const original=clsSelectedWord;item.onclick=(ev)=>{ev.stopPropagation();if(clsSelectedWord!==null){col.click();}else{document.getElementById('clsBank').appendChild(original);original.classList.remove('sel-word');item.remove();if(typeof sfx==='function')sfx('click');}};wordsCol.appendChild(item);clsSelectedWord.remove();clsSelectedWord=null;sfx('click');};});}
function checkClass(){const remaining=document.querySelectorAll('#clsBank .wb-item').length;if(remaining>0){fb('fbCls','Mueve todas las palabras a las columnas primero.',false);return;}const group=classGroups[currentClassGroupIdx];let allOk=true;document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{const inLeft=el.parentElement.id==='items-left';const expectedType=inLeft?group.colA:group.colB;if(el.dataset.t===expectedType){el.classList.add('cls-ok');}else{el.classList.add('cls-no');allOk=false;}});if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);}if(allOk){fb('fbCls','¡Perfecto! +5 XP',true);sfx('fan');fin('s-clasifica');unlockAchievement('clasif_pro');}else{fb('fbCls','Hay errores. Marcados en rojo.',false);sfx('no');}}
function nextClassGroup(){sfx('click');currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length;buildClass();document.getElementById('fbCls').classList.remove('show');showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]);}
function resetClass(){sfx('click');buildClass();document.getElementById('fbCls').classList.remove('show');}

// ===================== IDENTIFICAR =====================
const idData=[
  {s:['El','huracán','Mitch','devastó','Honduras','en','1998.'],c:1,art:'El fenómeno que causó el desastre de 1998'},
  {s:['La','vulnerabilidad','aumenta','al','vivir','en','laderas','inestables.'],c:1,art:'La debilidad de la comunidad ante la amenaza'},
  {s:['La','inundación','cubrió','casas','y','cultivos','de','agua.'],c:1,art:'Amenaza que cubre de agua terrenos secos'},
  {s:['Un','deslizamiento','arrastró','lodo','por','la','ladera.'],c:1,art:'Desplazamiento de tierra y rocas por una pendiente'},
  {s:['La','prevención','reduce','los','daños','antes','del','desastre.'],c:1,art:'Acciones para evitar o reducir daños antes'},
  {s:['COPECO','coordina','la','respuesta','ante','emergencias','en','Honduras.'],c:0,art:'Institución hondureña de contingencias'},
  {s:['La','alerta','roja','indica','que','hay','que','evacuar.'],c:2,art:'Nivel de alerta que ordena evacuar'},
  {s:['El','riesgo','depende','de','la','amenaza','y','la','vulnerabilidad.'],c:1,art:'Probabilidad de sufrir daños'},
];
let idIdx=0,idDone=false;
function showId(){idDone=false;if(idIdx>=idData.length){document.getElementById('idSent').innerHTML='🎉 ¡Completado!';fin('s-identifica');unlockAchievement('id_master');return;}const d=idData[idIdx];document.getElementById('idProg').textContent=`Oración ${idIdx+1} de ${idData.length}`;document.getElementById('idInfo').textContent=`Busca: ${d.art}`;const sent=document.getElementById('idSent');sent.innerHTML='';d.s.forEach((w,i)=>{const span=document.createElement('span');span.className='id-word';span.textContent=w+' ';span.onclick=()=>checkId(i,span);sent.appendChild(span);});}
function checkId(i,span){if(idDone)return;document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected'));span.classList.add('selected');if(i===idData[idIdx].c){idDone=true;span.classList.add('id-ok');fb('fbId','¡Correcto! +5 XP',true);if(!xpTracker.id.has(idIdx)){xpTracker.id.add(idIdx);pts(5);}sfx('ok');}else{span.classList.add('id-no');fb('fbId','Ese no es el término solicitado.',false);sfx('no');}}
function nextId(){sfx('click');idIdx++;showId();document.getElementById('fbId').classList.remove('show');}
function resetId(){sfx('click');idIdx=0;showId();document.getElementById('fbId').classList.remove('show');}

// ===================== COMPLETA =====================
const cmpData=[
  {s:'El huracán ___ fue uno de los peores desastres de Honduras en 1998.',opts:['Mitch','Félix','Eta'],c:0},
  {s:'La ___ es el fenómeno que puede causar daño, como un sismo o un huracán.',opts:['prevención','amenaza','constancia'],c:1},
  {s:'La ___ es la debilidad de una comunidad ante una amenaza.',opts:['vulnerabilidad','mitigación','alerta'],c:0},
  {s:'Los huracanes se forman sobre el ___ cálido.',opts:['desierto','mar','glaciar'],c:1},
  {s:'El ___ es un movimiento brusco del suelo y es una amenaza geológica.',opts:['huracán','terremoto','deslizamiento'],c:1},
  {s:'La alerta ___ indica que hay peligro y hay que evacuar.',opts:['verde','amarilla','roja'],c:2},
  {s:'Reforestar las laderas ayuda a evitar ___ de tierra.',opts:['deslizamientos','terremotos','tsunamis'],c:0},
  {s:'En Honduras, ___ coordina la respuesta ante los desastres.',opts:['COPECO','la biblioteca','el correo'],c:0},
];
let cmpIdx=0,cmpSel=-1,cmpDone=false;
function showCmp(){if(cmpIdx>=cmpData.length){document.getElementById('cmpSent').innerHTML='🎉 ¡Completado!';document.getElementById('cmpOpts').innerHTML='';fin('s-completa');return;}const d=cmpData[cmpIdx];document.getElementById('cmpProg').textContent=`Oración ${cmpIdx+1} de ${cmpData.length}`;document.getElementById('cmpSent').innerHTML=d.s.replace('___','<span class="blank">___</span>');const opts=document.getElementById('cmpOpts');opts.innerHTML='';cmpSel=-1;cmpDone=false;d.opts.forEach((o,i)=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=o;b.onclick=()=>{if(cmpDone)return;document.querySelectorAll('.cmp-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');cmpSel=i;sfx('click');};opts.appendChild(b);});}
function checkCmp(){if(cmpSel<0)return fb('fbCmp','Selecciona una opción.',false);cmpDone=true;const opts=document.querySelectorAll('.cmp-opt');if(cmpSel===cmpData[cmpIdx].c){opts[cmpSel].classList.add('correct');document.getElementById('cmpSent').innerHTML=cmpData[cmpIdx].s.replace('___',`<span class="blank" style="color:var(--jade);border-color:var(--jade)">${opts[cmpSel].textContent}</span>`);fb('fbCmp','¡Correcto! +5 XP',true);if(!xpTracker.cmp.has(cmpIdx)){xpTracker.cmp.add(cmpIdx);pts(5);}sfx('ok');}else{opts[cmpSel].classList.add('wrong');opts[cmpData[cmpIdx].c].classList.add('correct');fb('fbCmp','Incorrecto. Revisa bien la respuesta.',false);sfx('no');}setTimeout(()=>{cmpIdx++;document.getElementById('fbCmp').classList.remove('show');showCmp();},1600);}

// ===================== WIDGETS =====================
// Widget 1: Ordenar secuencias
const routeSets=[
  {label:'Formación de un huracán',steps:['El mar se calienta a más de 26 °C','El aire húmedo sube y forma nubes','Los vientos empiezan a girar','Se forma el ojo del huracán','El huracán toca tierra con lluvia y viento']},
  {label:'Ante una alerta roja de huracán',steps:['Escuchar el aviso de alerta temprana','Tomar la mochila de emergencia','Salir por la ruta de evacuación','Llegar al refugio o zona segura','Esperar el aviso de que pasó el peligro']},
  {label:'Cómo se produce un deslizamiento',steps:['La ladera pierde árboles por la deforestación','Caen lluvias muy intensas','El suelo se satura de agua','La tierra y el lodo se desprenden','El deslizamiento baja por la pendiente']},
];
let currentRouteIdx=0,routeItems=[];
function buildRoute(){routeItems=_shuffle([...routeSets[currentRouteIdx].steps]);renderRoute();const fbEl=document.getElementById('fbRoute');if(fbEl)fbEl.classList.remove('show');}
function renderRoute(){const list=document.getElementById('routeList');if(!list)return;list.innerHTML='';routeItems.forEach((step,i)=>{const div=document.createElement('div');div.className='sort-item';div.innerHTML=`<div class="sort-arrows"><button class="sort-arrow" onclick="routeMove(${i},-1)"${i===0?' disabled':''}>▲</button><button class="sort-arrow" onclick="routeMove(${i},1)"${i===routeItems.length-1?' disabled':''}>▼</button></div><div class="sort-step-num">${i+1}.</div><div class="sort-item-txt">${step}</div>`;list.appendChild(div);});}
function routeMove(idx,dir){sfx('click');const ni=idx+dir;if(ni<0||ni>=routeItems.length)return;[routeItems[idx],routeItems[ni]]=[routeItems[ni],routeItems[idx]];renderRoute();}
function checkRoute(){const correct=routeSets[currentRouteIdx].steps;const isOk=routeItems.every((s,i)=>s===correct[i]);if(isOk){fb('fbRoute','¡Perfecto! Orden correcto. +4 XP',true);if(!xpTracker.wgt.has('route_'+currentRouteIdx)){xpTracker.wgt.add('route_'+currentRouteIdx);pts(4);}sfx('fan');fin('s-widgets');unlockAchievement('widgets_master');}else{fb('fbRoute','Hay pasos fuera de orden. Revisa el arreglo.',false);sfx('no');}}
function nextRoute(){sfx('click');currentRouteIdx=(currentRouteIdx+1)%routeSets.length;buildRoute();showToast('🔄 Secuencia: '+routeSets[currentRouteIdx].label);}

// Widget 2: Identifica el concepto o fenómeno
const neuronPartes=[
  {desc:'Fenómeno que puede causar daño, como un sismo o un huracán',ans:'Amenaza',opts:['Amenaza','Prevención','Refugio','Simulacro']},
  {desc:'Debilidad o exposición de una comunidad ante una amenaza',ans:'Vulnerabilidad',opts:['Vulnerabilidad','Mitigación','Alerta','Riesgo']},
  {desc:'Probabilidad de sufrir daños: Amenaza × Vulnerabilidad',ans:'Riesgo',opts:['Riesgo','Amenaza','Refugio','Evacuación']},
  {desc:'Tormenta giratoria que se forma sobre el mar cálido',ans:'Huracán',opts:['Huracán','Terremoto','Sequía','Tsunami']},
  {desc:'Movimiento brusco del suelo por energía dentro de la Tierra',ans:'Terremoto',opts:['Terremoto','Inundación','Huracán','Deslizamiento']},
  {desc:'Desplazamiento de tierra, lodo y rocas por una ladera',ans:'Deslizamiento',opts:['Deslizamiento','Inundación','Sequía','Sismo']},
  {desc:'Institución hondureña que coordina la respuesta a desastres',ans:'COPECO',opts:['COPECO','La alcaldía','La escuela','El hospital']},
  {desc:'Sistema que avisa a tiempo para poder evacuar',ans:'Alerta temprana',opts:['Alerta temprana','Deslizamiento','Vulnerabilidad','Terremoto']},
];
let neuronIdx=0,neuronDone=false;
function showNeuron(){neuronDone=false;if(neuronIdx>=neuronPartes.length){const el=document.getElementById('neuronDesc');if(el)el.textContent='🎉 ¡Todos los conceptos identificados!';const opts=document.getElementById('neuronOpts');if(opts)opts.innerHTML='';fin('s-widgets');return;}const d=neuronPartes[neuronIdx];const prog=document.getElementById('neuronProg');if(prog)prog.textContent=`Concepto ${neuronIdx+1} de ${neuronPartes.length}`;const desc=document.getElementById('neuronDesc');if(desc)desc.textContent=d.desc;const opts=document.getElementById('neuronOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=opt;b.onclick=()=>checkNeuron(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuron');if(fbEl)fbEl.classList.remove('show');}
function checkNeuron(opt,btn,d){if(neuronDone)return;neuronDone=true;document.querySelectorAll('#neuronOpts .cmp-opt').forEach(b=>{if(b.textContent===d.ans)b.classList.add('correct');else if(b===btn&&b.textContent!==d.ans)b.classList.add('wrong');});const isOk=opt===d.ans;if(isOk){fb('fbNeuron','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuron_'+neuronIdx)){xpTracker.wgt.add('neuron_'+neuronIdx);pts(3);}sfx('ok');}else{fb('fbNeuron','La respuesta correcta es: '+d.ans,false);sfx('no');}}
function nextNeuron(){sfx('click');neuronIdx++;showNeuron();}
function resetNeuron(){sfx('click');neuronIdx=0;showNeuron();}

// Widget 3: Concepto → Definición
const neuroPairs=[
  {trans:'Amenaza',func:'Fenómeno o evento que puede causar daño',opts:['Fenómeno o evento que puede causar daño','Debilidad de una comunidad','Acción para evitar daños antes','Aviso para evacuar a tiempo']},
  {trans:'Vulnerabilidad',func:'Debilidad o exposición de una comunidad',opts:['Debilidad o exposición de una comunidad','Fenómeno que causa daño','Movimiento brusco del suelo','Institución de contingencias']},
  {trans:'Prevención',func:'Acciones para evitar o reducir daños antes',opts:['Acciones para evitar o reducir daños antes','Cubrir de agua terrenos secos','Girar sobre el mar cálido','Debilidad de la comunidad']},
  {trans:'Alerta temprana',func:'Sistema que avisa a tiempo para evacuar',opts:['Sistema que avisa a tiempo para evacuar','Desplazamiento de tierra por la ladera','Probabilidad de sufrir daños','Movimiento brusco del suelo']},
  {trans:'Mitigación',func:'Medidas para disminuir el impacto de la amenaza',opts:['Medidas para disminuir el impacto de la amenaza','Aviso para evacuar','Fenómeno que causa daño','Debilidad de la comunidad']},
];
let neuroIdx=0,neuroDone=false;
function showNeuro(){neuroDone=false;if(neuroIdx>=neuroPairs.length){const el=document.getElementById('neuroTrans');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('neuroOpts');if(opts)opts.innerHTML='';return;}const d=neuroPairs[neuroIdx];const prog=document.getElementById('neuroProg');if(prog)prog.textContent=`${neuroIdx+1} de ${neuroPairs.length}`;const trans=document.getElementById('neuroTrans');if(trans)trans.textContent=d.trans;const opts=document.getElementById('neuroOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkNeuro(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuro');if(fbEl)fbEl.classList.remove('show');}
function checkNeuro(opt,btn,d){if(neuroDone)return;neuroDone=true;document.querySelectorAll('#neuroOpts .qz-opt').forEach(b=>{if(b.textContent===d.func)b.classList.add('correct');else if(b===btn&&b.textContent!==d.func)b.classList.add('wrong');});const isOk=opt===d.func;if(isOk){fb('fbNeuro','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuro_'+neuroIdx)){xpTracker.wgt.add('neuro_'+neuroIdx);pts(3);}sfx('ok');}else{fb('fbNeuro','Correcto: '+d.func,false);sfx('no');}setTimeout(()=>{neuroIdx++;showNeuro();},1800);}
function resetNeuro(){sfx('click');neuroIdx=0;showNeuro();}

// Widget 4: Situación de riesgo → Medida de prevención correcta
const enfermedadData=[
  {disease:'Viene un huracán con alerta roja',characteristic:'Evacuar a tiempo hacia la zona segura o el refugio',opts:['Evacuar a tiempo hacia la zona segura o el refugio','Salir a ver el río crecido','Quedarse a grabar videos','Cruzar la corriente a pie']},
  {disease:'Un cerro deforestado sobre las casas',characteristic:'Reforestar la ladera y no construir debajo',opts:['Reforestar la ladera y no construir debajo','Cortar más árboles','Botar basura en la ladera','Construir más casas encima']},
  {disease:'Está temblando (terremoto)',characteristic:'Agacharse, cubrirse la cabeza y sujetarse',opts:['Agacharse, cubrirse la cabeza y sujetarse','Correr por las escaleras','Usar el ascensor','Quedarse junto a las ventanas']},
  {disease:'Un río empieza a desbordarse',characteristic:'Alejarse del cauce y buscar zonas altas',opts:['Alejarse del cauce y buscar zonas altas','Cruzar el río crecido','Nadar en la corriente','Acercarse a mirar']},
  {disease:'La familia no sabe qué hacer en emergencias',characteristic:'Elaborar un plan familiar y practicar simulacros',opts:['Elaborar un plan familiar y practicar simulacros','Esperar a que pase algo','Ignorar las alertas','Improvisar en el momento']},
  {disease:'Se acumula basura en los drenajes del barrio',characteristic:'Limpiar los drenajes y cauces para evitar inundaciones',opts:['Limpiar los drenajes y cauces para evitar inundaciones','Tirar más basura','Tapar los desagües','No hacer nada']},
];
let enferIdx=0,enferDone=false;
function showEnfer(){enferDone=false;if(enferIdx>=enfermedadData.length){const el=document.getElementById('enferDisease');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('enferOpts');if(opts)opts.innerHTML='';return;}const d=enfermedadData[enferIdx];const prog=document.getElementById('enferProg');if(prog)prog.textContent=`${enferIdx+1} de ${enfermedadData.length}`;const dis=document.getElementById('enferDisease');if(dis)dis.textContent=d.disease;const opts=document.getElementById('enferOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkEnfer(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbEnfer');if(fbEl)fbEl.classList.remove('show');}
function checkEnfer(opt,btn,d){if(enferDone)return;enferDone=true;document.querySelectorAll('#enferOpts .qz-opt').forEach(b=>{if(b.textContent===d.characteristic)b.classList.add('correct');else if(b===btn&&b.textContent!==d.characteristic)b.classList.add('wrong');});const isOk=opt===d.characteristic;if(isOk){fb('fbEnfer','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('enfer_'+enferIdx)){xpTracker.wgt.add('enfer_'+enferIdx);pts(3);}sfx('ok');}else{fb('fbEnfer','Correcto: '+d.characteristic,false);sfx('no');}setTimeout(()=>{enferIdx++;showEnfer();},1800);}
function resetEnfer(){sfx('click');enferIdx=0;showEnfer();}

// ===================== RETO FINAL =====================
const retoPairs=[
  {label:['Amenaza','Prevención'],btnA:'⚠️ Amenaza',btnB:'🛡️ Prevención',colA:'amenaza',colB:'prev',
   words:[{w:'Huracán',t:'amenaza'},{w:'Reforestar',t:'prev'},{w:'Terremoto',t:'amenaza'},{w:'Plan familiar',t:'prev'},{w:'Inundación',t:'amenaza'},{w:'Simulacro',t:'prev'},{w:'Deslizamiento',t:'amenaza'},{w:'Ruta de evacuación',t:'prev'},{w:'Sequía',t:'amenaza'},{w:'Mochila de emergencia',t:'prev'}]},
  {label:['Geológica','Hidrometeorológica'],btnA:'🏔️ Geológica',btnB:'🌧️ Hidrometeoro.',colA:'geo',colB:'hidro',
   words:[{w:'Terremoto',t:'geo'},{w:'Huracán',t:'hidro'},{w:'Volcán',t:'geo'},{w:'Inundación',t:'hidro'},{w:'Tsunami',t:'geo'},{w:'Sequía',t:'hidro'},{w:'Sismo',t:'geo'},{w:'Tormenta',t:'hidro'},{w:'Falla',t:'geo'},{w:'Lluvia intensa',t:'hidro'}]},
  {label:['Aumenta riesgo','Reduce riesgo'],btnA:'📈 Aumenta',btnB:'📉 Reduce',colA:'sube',colB:'baja',
   words:[{w:'Deforestar',t:'sube'},{w:'Reforestar',t:'baja'},{w:'Construir junto al río',t:'sube'},{w:'Zona segura',t:'baja'},{w:'Ignorar la alerta',t:'sube'},{w:'Atender la alerta',t:'baja'},{w:'Basura en el cauce',t:'sube'},{w:'Limpiar drenajes',t:'baja'},{w:'Casa mal construida',t:'sube'},{w:'Construcción segura',t:'baja'}]},
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
  {s:'Un desastre natural ocurre cuando una amenaza afecta a una comunidad vulnerable y causa daños que superan su capacidad de responder.',type:'Concepto de desastre natural'},
  {s:'El huracán Mitch, de categoría 5, golpeó Centroamérica en 1998 y fue uno de los peores desastres de Honduras.',type:'Huracán Mitch: hecho histórico'},
  {s:'La amenaza es el fenómeno que puede causar daño; puede ser natural o provocada por el ser humano.',type:'Amenaza (peligro)'},
  {s:'La vulnerabilidad aumenta al vivir en laderas inestables, a la orilla de ríos o en casas mal construidas.',type:'Vulnerabilidad'},
  {s:'El riesgo es la probabilidad de sufrir daños y se resume como Riesgo = Amenaza × Vulnerabilidad.',type:'Riesgo de desastre'},
  {s:'Los terremotos, las erupciones volcánicas y los tsunamis son amenazas geológicas.',type:'Amenazas geológicas'},
  {s:'Los huracanes, las inundaciones y las sequías son amenazas hidrometeorológicas.',type:'Amenazas hidrometeorológicas'},
  {s:'La prevención y la mitigación reducen los daños antes de que ocurra el desastre.',type:'Prevención y mitigación'},
  {s:'La alerta temprana avisa a tiempo con colores: verde, amarilla y roja, para poder evacuar.',type:'Alerta temprana'},
  {s:'COPECO es la institución de Honduras que coordina la prevención y la respuesta ante desastres.',type:'COPECO'},
];
const classifyTaskDB=[
  {w:'Huracán',gen:'Amenaza hidrometeorológica',n:'Sobre el mar cálido',g:'Peligro',t:'Tormenta giratoria con vientos y lluvias muy fuertes'},
  {w:'Terremoto',gen:'Amenaza geológica',n:'En el interior de la Tierra',g:'Peligro',t:'Movimiento brusco del suelo'},
  {w:'Inundación',gen:'Amenaza hidrometeorológica',n:'Ríos y zonas bajas',g:'Peligro',t:'El agua cubre terrenos secos'},
  {w:'Deslizamiento',gen:'Amenaza geológica',n:'Laderas y cerros',g:'Peligro',t:'Tierra y rocas bajan por la pendiente'},
  {w:'Vulnerabilidad',gen:'Condición social',n:'En la comunidad',g:'Debilidad',t:'Grado de exposición ante la amenaza'},
  {w:'Prevención',gen:'Acción',n:'Antes del desastre',g:'Protección',t:'Evitar o reducir los daños'},
  {w:'Alerta temprana',gen:'Sistema de aviso',n:'Antes y durante',g:'Protección',t:'Avisa a tiempo para evacuar'},
  {w:'COPECO',gen:'Institución',n:'En Honduras',g:'Coordinación',t:'Prevención y respuesta ante desastres'},
];
const completeTaskDB=[
  {s:'El huracán ___ golpeó Honduras en 1998.',opts:['Mitch','Eta','Iota'],ans:'Mitch'},
  {s:'La ___ es el fenómeno que puede causar daño.',opts:['prevención','amenaza','mitigación'],ans:'amenaza'},
  {s:'La ___ es la debilidad de la comunidad ante la amenaza.',opts:['vulnerabilidad','alerta','constancia'],ans:'vulnerabilidad'},
  {s:'Riesgo = Amenaza × ___.',opts:['prevención','vulnerabilidad','refugio'],ans:'vulnerabilidad'},
  {s:'El ___ es una amenaza geológica que mueve el suelo.',opts:['huracán','terremoto','inundación'],ans:'terremoto'},
  {s:'La alerta ___ indica que hay que evacuar.',opts:['verde','roja','amarilla'],ans:'roja'},
  {s:'Reforestar ayuda a prevenir ___ de tierra.',opts:['deslizamientos','sismos','tsunamis'],ans:'deslizamientos'},
  {s:'En Honduras, ___ coordina la respuesta ante desastres.',opts:['COPECO','el correo','la radio'],ans:'COPECO'},
];
const explainQuestions=[
  {q:'¿Qué es un desastre natural y en qué se diferencia de una amenaza?',ans:'La amenaza es el fenómeno que puede causar daño (un huracán, un sismo). El desastre ocurre cuando esa amenaza afecta a una comunidad vulnerable y causa daños que superan su capacidad de responder. El fenómeno solo se vuelve desastre si hay población en riesgo.'},
  {q:'¿Qué fue el huracán Mitch y por qué es importante para Honduras?',ans:'Fue un huracán de categoría 5 que en 1998 provocó lluvias, inundaciones y deslizamientos en Centroamérica. En Honduras causó miles de muertos y enormes pérdidas; fue uno de los peores desastres del país y ayudó a fortalecer la gestión de riesgos (COPECO).'},
  {q:'Explica la fórmula del riesgo: Riesgo = Amenaza × Vulnerabilidad.',ans:'El riesgo aumenta cuando hay una amenaza fuerte y, además, la comunidad es muy vulnerable (vive en zonas peligrosas, casas frágiles). Si reducimos la vulnerabilidad y nos preparamos, el riesgo baja aunque la amenaza siga existiendo.'},
  {q:'Menciona la diferencia entre amenazas geológicas e hidrometeorológicas con ejemplos.',ans:'Las geológicas se originan en la Tierra: terremotos, erupciones volcánicas y tsunamis. Las hidrometeorológicas se relacionan con el agua y el clima: huracanes, inundaciones, sequías y tormentas.'},
  {q:'¿Qué medidas de prevención puede tomar una familia ante los desastres? Menciona cuatro.',ans:'Elaborar un plan familiar de emergencia, identificar rutas de evacuación y zonas seguras, preparar una mochila de emergencia, practicar simulacros, atender las alertas tempranas, reforestar y no construir en zonas de riesgo.'},
];
let ansVisible=false;
function genTask(){sfx('click');const type=document.getElementById('tgType').value;const count=parseInt(document.getElementById('tgCount').value);ansVisible=false;const out=document.getElementById('tgOut');out.innerHTML='';if(type==='identify')genIdentifyTask(out,count);else if(type==='classify')genClassifyTask(out,count);else if(type==='complete')genCompleteTask(out,count);else if(type==='explain')genExplainTask(out,count);fin('s-tareas');}
function _instrBlock(out,title,lines){const ib=document.createElement('div');ib.className='tg-instruction-block';ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join('');out.appendChild(ib);}
function genIdentifyTask(out,count){_instrBlock(out,'Instrucción',['Copia en tu cuaderno; subraya, colorea o encierra el concepto de gestión de riesgos indicado en cada oración. Escribe al lado qué tipo de elemento es.','<strong>Ejemplo:</strong> El huracán Mitch golpeó Honduras. → <span style="color:var(--jade);font-weight:700;">Amenaza hidrometeorológica</span>']);_pick(identifyTaskDB,Math.min(count,identifyTaskDB.length)).forEach((item,i)=>{const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.type}</div></div>`;out.appendChild(div);});}
function genClassifyTask(out,count){_instrBlock(out,'Instrucción',['Copia la siguiente tabla en tu cuaderno. Para cada elemento, completa su tipo, dónde ocurre, categoría y descripción.']);const items=_pick(classifyTaskDB,Math.min(count,classifyTaskDB.length));const wrap=document.createElement('div');wrap.style.overflowX='auto';const th=(t,extra='')=>`<th style="padding:0.3rem 0.4rem;border:1px solid var(--border);font-size:0.72rem;text-align:center;${extra}">${t}</th>`;let html=`<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:520px;"><thead><tr style="background:var(--pri-gl);">${th('Elemento','text-align:left;')}${th('Tipo')}${th('Dónde ocurre')}${th('Categoría')}${th('Descripción')}</tr></thead><tbody>`;items.forEach(it=>{html+=`<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td>`+Array(4).fill(`<td style="padding:0.4rem;border:1px solid var(--border);min-width:50px;"></td>`).join('')+'</tr>';});html+='</tbody></table>';wrap.innerHTML=html;out.appendChild(wrap);const ans=document.createElement('div');ans.className='tg-answer';ans.style.marginTop='0.8rem';ans.innerHTML='<strong>✅ Respuestas:</strong><br>'+items.map(it=>`<strong>${it.w}:</strong> Tipo: ${it.gen} | Dónde: ${it.n} | Categoría: ${it.g} | Descripción: ${it.t}`).join('<br>');out.appendChild(ans);}
function genCompleteTask(out,count){_instrBlock(out,'Instrucción',['Copia y resuelve en tu cuaderno. Cada oración tiene un espacio ___. Elige y escribe la opción correcta.']);const pool=_shuffle([...completeTaskDB]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';const sent=item.s.replace('___','<span class="tg-blank" style="min-width:90px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${sent}</strong><div style="margin-top:0.4rem;font-size:0.82rem;color:var(--gray);">📝 Opciones: <strong>${item.opts.join(' | ')}</strong></div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function genExplainTask(out,count){_instrBlock(out,'Instrucción',['Copia las siguientes preguntas en tu cuaderno y responde cada una de forma clara y completa.']);const pool=_shuffle([...explainQuestions]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.3rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function toggleAns(){ansVisible=!ansVisible;document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none');sfx('click');}

// ===================== SOPA DE LETRAS =====================
const sopaSets=[
  {size:10,grid:[
    ['A','M','E','N','A','Z','A','B','K','P'],
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['R','I','E','S','G','O','M','K','L','J'],
    ['Z','X','C','V','B','N','M','A','S','D'],
    ['H','U','R','A','C','A','N','F','G','H'],
    ['P','L','M','O','K','N','J','I','B','H'],
    ['I','N','U','N','D','A','C','I','O','N'],
    ['G','Y','H','N','U','J','M','I','K','O'],
    ['T','E','R','R','E','M','O','T','O','W'],
    ['E','V','A','C','U','A','R','M','P','S']
  ],words:[
    {w:'AMENAZA',cells:[[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6]]},
    {w:'RIESGO',cells:[[2,0],[2,1],[2,2],[2,3],[2,4],[2,5]]},
    {w:'HURACAN',cells:[[4,0],[4,1],[4,2],[4,3],[4,4],[4,5],[4,6]]},
    {w:'INUNDACION',cells:[[6,0],[6,1],[6,2],[6,3],[6,4],[6,5],[6,6],[6,7],[6,8],[6,9]]},
    {w:'TERREMOTO',cells:[[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,6],[8,7],[8,8]]},
    {w:'EVACUAR',cells:[[9,0],[9,1],[9,2],[9,3],[9,4],[9,5],[9,6]]}
  ]},
  {size:10,grid:[
    ['P','R','E','V','E','N','C','I','O','N'],
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['S','I','M','U','L','A','C','R','O','X'],
    ['Z','X','C','V','B','N','M','K','L','J'],
    ['D','E','S','A','S','T','R','E','K','L'],
    ['P','O','I','U','Y','T','R','E','W','Q'],
    ['R','E','F','U','G','I','O','X','Y','Z'],
    ['M','N','B','V','C','X','Z','A','S','D'],
    ['A','L','E','R','T','A','K','L','M','P'],
    ['C','O','P','E','C','O','M','N','B','V']
  ],words:[
    {w:'PREVENCION',cells:[[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[0,9]]},
    {w:'SIMULACRO',cells:[[2,0],[2,1],[2,2],[2,3],[2,4],[2,5],[2,6],[2,7],[2,8]]},
    {w:'DESASTRE',cells:[[4,0],[4,1],[4,2],[4,3],[4,4],[4,5],[4,6],[4,7]]},
    {w:'REFUGIO',cells:[[6,0],[6,1],[6,2],[6,3],[6,4],[6,5],[6,6]]},
    {w:'ALERTA',cells:[[8,0],[8,1],[8,2],[8,3],[8,4],[8,5]]},
    {w:'COPECO',cells:[[9,0],[9,1],[9,2],[9,3],[9,4],[9,5]]}
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
  {q:'Un fenómeno natural se convierte en desastre cuando afecta a una comunidad vulnerable.',a:true},
  {q:'El huracán Mitch ocurrió en el año 1998.',a:true},
  {q:'El huracán Mitch alcanzó la categoría 1 en la escala Saffir-Simpson.',a:false},
  {q:'El riesgo se calcula como Amenaza × Vulnerabilidad.',a:true},
  {q:'El terremoto es una amenaza hidrometeorológica.',a:false},
  {q:'Los huracanes se forman sobre el mar cálido.',a:true},
  {q:'Reforestar las laderas ayuda a prevenir deslizamientos.',a:true},
  {q:'La alerta roja significa que todo está normal.',a:false},
  {q:'COPECO coordina la respuesta ante desastres en Honduras.',a:true},
  {q:'La vulnerabilidad disminuye al vivir a la orilla de un río crecido.',a:false},
  {q:'La prevención se realiza antes de que ocurra el desastre.',a:true},
  {q:'La inundación ocurre cuando el agua cubre terrenos normalmente secos.',a:true},
  {q:'La deforestación reduce el riesgo de deslizamientos.',a:false},
  {q:'Durante un terremoto conviene agacharse, cubrirse y sujetarse.',a:true},
  {q:'El Mitch causó pocos daños en Honduras.',a:false},
];
const evalMCBank=[
  {q:'¿Cuándo un fenómeno natural se vuelve desastre?',o:['a) Siempre','b) Cuando afecta a una comunidad vulnerable','c) Solo de noche','d) Nunca'],a:1},
  {q:'¿En qué año ocurrió el huracán Mitch?',o:['a) 1988','b) 1998','c) 2008','d) 2020'],a:1},
  {q:'¿Qué categoría alcanzó el huracán Mitch?',o:['a) 1','b) 3','c) 5','d) 2'],a:2},
  {q:'¿Cuál es la fórmula del riesgo?',o:['a) Amenaza × Vulnerabilidad','b) Lluvia + Viento','c) Amenaza − Prevención','d) Solo la amenaza'],a:0},
  {q:'¿Cuál es una amenaza geológica?',o:['a) Huracán','b) Sequía','c) Terremoto','d) Inundación'],a:2},
  {q:'¿Sobre qué se forman los huracanes?',o:['a) Montañas','b) Mar cálido','c) Desiertos','d) Polos'],a:1},
  {q:'¿Qué acción reduce el riesgo de deslizamiento?',o:['a) Deforestar','b) Reforestar','c) Botar basura','d) Construir en la ladera'],a:1},
  {q:'¿Qué institución coordina los desastres en Honduras?',o:['a) COPECO','b) La escuela','c) El hospital','d) El correo'],a:0},
  {q:'¿Qué significa la alerta roja?',o:['a) Normal','b) Atención','c) Peligro, evacuar','d) Ya pasó'],a:2},
  {q:'¿Qué es la vulnerabilidad?',o:['a) El fenómeno peligroso','b) La debilidad de la comunidad','c) Un tipo de huracán','d) Una institución'],a:1},
  {q:'¿Cuál es una amenaza hidrometeorológica?',o:['a) Terremoto','b) Erupción volcánica','c) Inundación','d) Tsunami'],a:2},
  {q:'¿Qué es la mitigación?',o:['a) Provocar el desastre','b) Disminuir el impacto de la amenaza','c) Ignorar el peligro','d) Aumentar el riesgo'],a:1},
  {q:'¿Qué se debe hacer durante un terremoto?',o:['a) Correr sin mirar','b) Usar el ascensor','c) Agacharse, cubrirse y sujetarse','d) Asomarse a la ventana'],a:2},
  {q:'¿Qué parte tranquila tiene el huracán en su centro?',o:['a) La cola','b) El ojo','c) La base','d) La raíz'],a:1},
  {q:'¿Qué se prepara para estar listos ante una emergencia?',o:['a) Una mochila de emergencia','b) Un juego de mesa','c) Nada','d) Más basura'],a:0},
];
const evalCPBank=[
  {q:'El huracán ___ golpeó Honduras en 1998.',a:'mitch'},
  {q:'La ___ es el fenómeno que puede causar daño.',a:'amenaza'},
  {q:'La ___ es la debilidad de la comunidad ante la amenaza.',a:'vulnerabilidad'},
  {q:'El ___ es la probabilidad de sufrir daños.',a:'riesgo'},
  {q:'Los huracanes se forman sobre el ___ cálido.',a:'mar'},
  {q:'El ___ es una amenaza geológica que mueve el suelo.',a:'terremoto'},
  {q:'La ___ es cuando el agua cubre terrenos secos.',a:'inundación'},
  {q:'La alerta ___ indica que hay que evacuar.',a:'roja'},
  {q:'La ___ son acciones para evitar daños antes del desastre.',a:'prevención'},
  {q:'En Honduras, ___ coordina la respuesta a desastres.',a:'copeco'},
  {q:'La escala ___ clasifica los huracanes en 5 categorías.',a:'saffir-simpson'},
  {q:'El ___ es el desplazamiento de tierra por una ladera.',a:'deslizamiento'},
  {q:'La ___ temprana avisa a tiempo para poder evacuar.',a:'alerta'},
  {q:'La ___ busca disminuir el impacto de la amenaza.',a:'mitigación'},
  {q:'El centro tranquilo del huracán se llama ___.',a:'ojo'},
];
const evalPRBank=[
  {term:'Amenaza',def:'Fenómeno que puede causar daño'},
  {term:'Vulnerabilidad',def:'Debilidad de la comunidad ante la amenaza'},
  {term:'Riesgo',def:'Probabilidad de sufrir daños'},
  {term:'Huracán Mitch',def:'Desastre categoría 5 que golpeó Honduras en 1998'},
  {term:'Inundación',def:'El agua cubre terrenos normalmente secos'},
  {term:'Deslizamiento',def:'Tierra y rocas bajan por una ladera'},
  {term:'Terremoto',def:'Movimiento brusco del suelo'},
  {term:'Prevención',def:'Acciones para evitar daños antes'},
  {term:'Mitigación',def:'Medidas para disminuir el impacto'},
  {term:'Alerta temprana',def:'Aviso a tiempo para evacuar'},
  {term:'COPECO',def:'Institución hondureña de contingencias'},
  {term:'Saffir-Simpson',def:'Escala que clasifica los huracanes'},
  {term:'Ojo del huracán',def:'Centro tranquilo del huracán'},
  {term:'Refugio',def:'Lugar seguro donde protegerse'},
  {term:'Reforestar',def:'Sembrar árboles para reducir deslizamientos'},
];

// ══════════ Formas deterministas v1 (M.E.T.A.S, jul 2026) ══════════
// La Forma N genera SIEMPRE el mismo examen y la misma pauta («bucle exacto»),
// en cualquier navegador y aunque se cierre el programa. PRNG mulberry32
// (aritmética entera exacta) + barajado Fisher-Yates. ⚠️ NO usar
// sort(() => rng() - 0.5): el resultado depende del motor del navegador.
// ⚠️ Editar los bancos de preguntas CAMBIA el contenido de todas las formas.
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
// Selector «Forma exacta»: el docente elige qué forma generar (p.ej. para
// reimprimir la pauta de la Forma 15 que ya repartió a los alumnos).
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

function genEval(){sfx('click');_evalFormaSelector(); const _selF = document.getElementById('evalFormaSel'); if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10))); const cf = evalFormNum; const rng = _evalRng(cf); /* la Forma cf siembra TODO el azar de esta evaluación */window._currentEvalForm=cf;evalFormNum = (evalFormNum % EVAL_FORMAS) + 1; _evalFormaSelector();saveProgress();document.getElementById('eval-screen-title').textContent=`🎓 Evaluación Final · Forma ${cf} · Desastres Naturales`;evalAnsVisible=false;const out=document.getElementById('evalOut');out.innerHTML='';const bar=document.createElement('div');bar.className='eval-score-bar';bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje · 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25 pts</span><span class="eval-score-pill esp-tf">V/F 25 pts</span><span class="eval-score-pill esp-mc">Selección 25 pts</span><span class="eval-score-pill esp-pr">Pareados 25 pts</span></div>`;out.appendChild(bar);const cpItems=_pickF(evalCPBank,5, rng);const s1=document.createElement('div');s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';cpItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='cp';d.dataset.evalIndex=i;const qHtml=item.q.replace('___',`<input class="eval-cp-input" type="text" data-cp="${i}" autocomplete="off">`);d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbCp${i}" aria-live="polite"></div>`;s1.appendChild(d);});out.appendChild(s1);const tfItems=_pickF(evalTFBank,5, rng);const s2=document.createElement('div');s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';tfItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='tf';d.dataset.evalIndex=i;d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="true"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="false"> Falso</label></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbTf${i}" aria-live="polite"></div>`;s2.appendChild(d);});out.appendChild(s2);const mcItems=_pickF(evalMCBank,5, rng);const s3=document.createElement('div');s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';mcItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='mc';d.dataset.evalIndex=i;const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join('');d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbMc${i}" aria-live="polite"></div>`;s3.appendChild(d);});out.appendChild(s3);const prItems=_pickF(evalPRBank,5, rng);const shuffledDefs=_shuffleF(prItems, rng);const letters=['A','B','C','D','E'];const s4=document.createElement('div');s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';const matchCard=document.createElement('div');matchCard.className='eval-item';let colLeft='<div class="eval-match-col"><h4>📌 Términos</h4>';prItems.forEach((item,i)=>{colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> <select class="eval-match-select" data-pr="${i}" aria-label="Respuesta pareada ${i+16}"><option value="">—</option>${letters.map(l=>`<option value="${l}">${l}</option>`).join('')}</select> ${item.term}</div>`;});colLeft+='</div>';let colRight='<div class="eval-match-col"><h4>🔑 Definiciones</h4>';shuffledDefs.forEach((item,i)=>{colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`;});colRight+='</div>';const ansKey=prItems.map((item,i)=>{const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)];return`${i+16}→${letter}`;}).join(' · ');matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div><div class="eval-item-feedback" id="evalFbPr" aria-live="polite"></div>`;s4.appendChild(matchCard);out.appendChild(s4);window._evalPrintData={tf:tfItems,mc:mcItems,cp:cpItems,pr:{terms:prItems,shuffledDefs,letters}};const autoPanel=document.createElement('div');autoPanel.id='evalAutoResult';autoPanel.className='eval-auto-result';autoPanel.innerHTML='<strong>🧮 Evaluación interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato original sin respuestas digitadas.';out.appendChild(autoPanel);fin('s-evaluacion');}
function toggleEvalAns(){evalAnsVisible=!evalAnsVisible;document.querySelectorAll('#evalOut .eval-answer').forEach(el=>el.style.display=evalAnsVisible?'block':'none');sfx('click');}
function normalizeEvalAnswer(v){return(v||'').toString().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\s+/g,' ').replace(/[()]/g,'').trim();}
function isCpCorrect(student,expected){const s=normalizeEvalAnswer(student);const e=normalizeEvalAnswer(expected);if(!s)return false;const variants=new Set([e]);if(e.includes(' '))e.split(' ').forEach(x=>x&&variants.add(x));return variants.has(s)||e.replace(/[^a-z0-9]/g,'')===s.replace(/[^a-z0-9]/g,'');}
function setEvalFeedback(id,ok,msg){const el=document.getElementById(id);if(!el)return;el.textContent=msg;el.className='eval-item-feedback '+(ok?'eval-ok':'eval-no');}
function gradeEval(){if(!window._evalPrintData){showToast('⚠️ Genera una evaluación primero');return;}sfx('click');const d=window._evalPrintData;let total=0;const detail={cp:0,tf:0,mc:0,pr:0};d.cp.forEach((it,i)=>{const input=document.querySelector(`[data-cp="${i}"]`);const ok=isCpCorrect(input?input.value:'',it.a);if(input){input.classList.toggle('eval-input-ok',ok);input.classList.toggle('eval-input-no',!ok);}if(ok){detail.cp++;total+=5;}setEvalFeedback('evalFbCp'+i,ok,ok?'Correcto. +5 pts':'Revisar. Respuesta esperada: '+it.a);});d.tf.forEach((it,i)=>{const selected=document.querySelector(`input[name="tf${i}"]:checked`);const ok=!!selected&&(selected.value==='true')===it.a;if(ok){detail.tf++;total+=5;}setEvalFeedback('evalFbTf'+i,ok,ok?'Correcto. +5 pts':'Revisar. Respuesta esperada: '+(it.a?'Verdadero':'Falso'));});d.mc.forEach((it,i)=>{const selected=document.querySelector(`input[name="mc${i}"]:checked`);const ok=!!selected&&Number(selected.value)===it.a;if(ok){detail.mc++;total+=5;}setEvalFeedback('evalFbMc'+i,ok,ok?'Correcto. +5 pts':'Revisar. Respuesta esperada: '+it.o[it.a]);});const expectedLetters=d.pr.terms.map(it=>d.pr.letters[d.pr.shuffledDefs.findIndex(df=>df.def===it.def)]);expectedLetters.forEach((letter,i)=>{const sel=document.querySelector(`[data-pr="${i}"]`);const ok=!!sel&&sel.value===letter;if(sel){sel.classList.toggle('eval-input-ok',ok);sel.classList.toggle('eval-input-no',!ok);}if(ok){detail.pr++;total+=5;}});const prMsg=`Pareados: ${detail.pr}/5 correctos. ${detail.pr===5?'Excelente. +25 pts':'Clave: '+expectedLetters.map((l,i)=>(i+16)+'→'+l).join(' · ')}`;setEvalFeedback('evalFbPr',detail.pr===5,prMsg);const result=document.getElementById('evalAutoResult');if(result){result.className='eval-auto-result '+(total>=70?'eval-auto-pass':'eval-auto-risk');result.innerHTML=`<strong>Resultado automático: ${total}/100 puntos</strong><br><span>Completar: ${detail.cp*5}/25 · V/F: ${detail.tf*5}/25 · Selección: ${detail.mc*5}/25 · Pareados: ${detail.pr*5}/25</span><br><em>Este resultado es solo para revisión en pantalla; la impresión conserva el formato limpio para papel.</em>`;}if(total>=70){pts(8);showToast('🎯 Evaluación calificada: '+total+'/100');}else showToast('🧮 Evaluación calificada: '+total+'/100. Revisa las respuestas marcadas.');}
function printEval(){if(!window._evalPrintData){showToast('⚠️ Genera una evaluación primero');return;}sfx('click');const forma=window._currentEvalForm||1;const d=window._evalPrintData;let s1=`<div class="sec-title"><span>I. Completar el espacio</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div>`;d.cp.forEach((it,i)=>{const q=it.q.replace('___','<span class="cp-blank"></span>');s1+=`<div class="cp-row"><span class="qn">${i+1}.</span><span class="cp-text">${q}</span></div>`;});let s2=`<div class="sec-title"><span>II. Verdadero o Falso</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div>`;d.tf.forEach((it,i)=>{s2+=`<div class="tf-row"><span class="qn">${i+6}.</span><span class="tf-blank"></span><span class="tf-text">${it.q}</span></div>`;});let s3=`<div class="sec-title"><span>III. Selección Múltiple</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div><div class="mc-grid">`;d.mc.forEach((it,i)=>{const opts=it.o.map((op,oi)=>`<label class="mc-opt"><input type="radio" name="mcp${i}"> ${op}</label>`).join('');s3+=`<div class="mc-item"><div class="mc-q"><span class="qn">${i+11}.</span><span>${it.q}</span></div><div class="mc-opts">${opts}</div></div>`;});s3+=`</div>`;let colL='<div class="pr-col"><div class="pr-head">📌 Términos</div>';d.pr.terms.forEach((it,i)=>{colL+=`<div class="pr-item"><span class="pr-num">${i+16}.</span><span class="pr-line"></span>${it.term}</div>`;});colL+='</div>';let colR='<div class="pr-col"><div class="pr-head">🔑 Definiciones</div>';d.pr.shuffledDefs.forEach((it,i)=>{colR+=`<div class="pr-item"><span class="pr-num">${d.pr.letters[i]}.</span>${it.def}</div>`;});colR+='</div>';let s4=`<div class="pr-section"><div class="sec-title"><span>IV. Términos Pareados</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div><div class="pr-grid">${colL}${colR}</div></div>`;let pR='';pR+=`<div class="p-sec"><div class="p-ttl">I. Completar</div><table class="p-tbl">`;d.cp.forEach((it,i)=>{pR+=`<tr><td class="pn">${i+1}.</td><td class="pa">${it.a}</td></tr>`;});pR+=`</table></div><div class="p-sec"><div class="p-ttl">II. V o F</div><table class="p-tbl">`;d.tf.forEach((it,i)=>{pR+=`<tr><td class="pn">${i+6}.</td><td class="pa">${it.a?'V':'F'}</td></tr>`;});pR+=`</table></div><div class="p-sec"><div class="p-ttl">III. Selección</div><table class="p-tbl">`;d.mc.forEach((it,i)=>{pR+=`<tr><td class="pn">${i+11}.</td><td class="pa">${it.o[it.a]}</td></tr>`;});pR+=`</table></div><div class="p-sec"><div class="p-ttl">IV. Pareados</div><table class="p-tbl">`;d.pr.terms.forEach((it,i)=>{const l=d.pr.letters[d.pr.shuffledDefs.findIndex(df=>df.def===it.def)];pR+=`<tr><td class="pn">${i+16}.</td><td class="pa">${i+16}→${l}</td></tr>`;});pR+=`</table></div>`;
    // ── Clave rápida estilo ZipGrade (círculos rellenados automáticamente con la pauta)
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación Desastres Naturales · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.12rem 0.4rem;margin:0.22rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #27ae60;background:#e8f8f5;color:#27ae60;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#27ae60;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #27ae60;height:12px;}.obt-pct{white-space:nowrap;}.qn{font-weight:700;min-width:22px;flex-shrink:0;}.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:40px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.18rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.14rem 0.35rem;margin-bottom:0.1rem;break-inside:avoid;page-break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.3;display:flex;gap:0.28rem;margin-bottom:0.07rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.1rem 0.5rem;}.mc-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:0.04rem 0.15rem;margin-left:0.8rem;}.mc-opt{font-size:9pt;display:flex;align-items:center;gap:0.15rem;}.mc-opt input{width:10px;height:10px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{margin-top:0.1rem;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.08rem 0.4rem;margin-top:0.08rem;}.pr-head{font-size:9pt;font-weight:700;color:#555;margin-bottom:0.1rem;}.pr-item{font-size:10.5pt;padding:0.1rem 0.28rem;background:#e8f8f5;border-radius:3px;margin-bottom:0.07rem;display:flex;align-items:center;gap:0.2rem;line-height:1.2;break-inside:avoid;page-break-inside:avoid;}.pr-num{font-weight:700;color:#27ae60;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.22rem;padding:0.15rem 0;page-break-before:avoid;break-before:avoid;color:#27ae60;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #27ae60;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#555;}.pa{color:#007a00;font-weight:600;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · Desastres Naturales y el Huracán Mitch · II y III Ciclo · Ciencias Naturales</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Evaluación Final · Desastres Naturales · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u</div></div><div class="p-grid">${pR}</div>
  ${zgBlock}</div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("evalPage",252,0.55,1.45);fit("pautaPage",252,0.55,1.3);})();</script></body></html>`;const win=window.open('','_blank','');if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}win.document.write(doc);win.document.close();setTimeout(()=>win.print(),400);}

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
  {txt:'En 1998, en una comunidad hondureña ubicada a la orilla de un río y con los cerros cercanos deforestados, cayeron lluvias muy intensas durante varios días por el huracán Mitch. El río se desbordó, hubo deslizamientos y muchas casas quedaron destruidas.'},
  {txt:'Un barrio construido al pie de un cerro sin árboles recibe lluvias fuertes durante una semana. El suelo se satura de agua, la ladera cede y un deslizamiento afecta varias viviendas de la parte baja.'},
  {txt:'Una aldea situada junto a un río, con viviendas frágiles y sin plan de emergencia, es sorprendida por una tormenta tropical. El río crece de noche y el agua inunda las casas antes de que la gente pueda salir.'},
  {txt:'Durante un huracán, una comunidad que había deforestado sus montañas y tirado basura en los cauces sufre inundaciones y deslizamientos más graves que las comunidades vecinas que conservaban sus bosques.'},
  {txt:'Tras días de lluvia por un ciclón, una familia que vive en una zona baja y de riesgo no atendió la alerta amarilla. Cuando llegó la alerta roja, el agua ya subía y tuvieron que ser rescatados del techo de su casa.'},
  {txt:'Una escuela ubicada cerca de una quebrada, sin muros de contención ni simulacros, queda incomunicada cuando las lluvias intensas de un huracán provocan el desbordamiento de la quebrada y un deslizamiento en el camino.'},
];
const critCaseQuestions=[
  '1. Identifica en el caso cuál es la amenaza y cuáles son las condiciones de vulnerabilidad.',
  '2. Explica por qué este fenómeno natural se convirtió en un desastre.',
  '3. ¿Qué acciones de prevención o mitigación habrían reducido los daños?',
  '4. ¿Qué debió hacer la comunidad al recibir la alerta temprana?',
];
const critCaseGuides=[
  'La amenaza es el fenómeno hidrometeorológico (huracán, tormenta o lluvias intensas). La vulnerabilidad está en vivir junto al río o al pie de cerros deforestados, con casas frágiles y sin plan de emergencia.',
  'Porque la amenaza afectó a una comunidad vulnerable y causó daños (destrucción, inundación, deslizamientos) que superaron su capacidad de responder. Sin vulnerabilidad, el mismo fenómeno no habría causado un desastre tan grave.',
  'Reforestar los cerros, no construir en zonas de riesgo, construir muros de contención y drenajes, limpiar los cauces, elaborar un plan de emergencia y practicar simulacros.',
  'Atender el aviso, tomar la mochila de emergencia, evacuar por la ruta hacia la zona segura o refugio y no esperar a que el agua o el deslizamiento llegaran.',
];

const critErrorBank=[
  {txt:'"Un fenómeno natural siempre es un desastre, aunque ocurra en un lugar deshabitado y no cause ningún daño."',
   g1:'Un fenómeno natural solo se convierte en desastre cuando afecta a una comunidad vulnerable y causa daños.',
   g2:'Si ocurre en un lugar deshabitado y no hay daños, es solo un fenómeno o una amenaza, no un desastre.'},
  {txt:'"El riesgo se calcula sumando la lluvia y el viento, y no tiene nada que ver con cómo vive la gente."',
   g1:'El riesgo se calcula como Amenaza × Vulnerabilidad, no sumando lluvia y viento.',
   g2:'Sí depende de cómo vive la gente: la vulnerabilidad (zonas peligrosas, casas frágiles) es parte del riesgo.'},
  {txt:'"El terremoto y la inundación son amenazas hidrometeorológicas, porque ambos se relacionan con la lluvia."',
   g1:'El terremoto es una amenaza geológica, se origina dentro de la Tierra, no en el clima.',
   g2:'La inundación sí es hidrometeorológica; el error es meter al terremoto en ese grupo.'},
  {txt:'"Para prevenir deslizamientos lo mejor es cortar todos los árboles del cerro y construir casas en la ladera."',
   g1:'Cortar los árboles (deforestar) aumenta el riesgo de deslizamiento, no lo previene.',
   g2:'Construir en la ladera aumenta la vulnerabilidad; lo correcto es reforestar y no construir en zonas de riesgo.'},
  {txt:'"La alerta roja significa que ya pasó el peligro y podemos volver tranquilos a la orilla del río."',
   g1:'La alerta roja significa peligro y que hay que evacuar, no que ya pasó.',
   g2:'Volver a la orilla del río crecido es muy peligroso; hay que alejarse del cauce y buscar zonas altas.'},
  {txt:'"El huracán Mitch ocurrió en 2008, fue de categoría 1 y casi no afectó a Honduras."',
   g1:'El huracán Mitch ocurrió en 1998, no en 2008.',
   g2:'Fue de categoría 5 y causó uno de los peores desastres de la historia de Honduras.'},
];

const critDecisionBank=[
  'Una familia vive a la orilla de un río que se desborda cada invierno, en una casa frágil, y no sabe qué hacer cuando llueve mucho.',
  'Un barrio está al pie de un cerro que fue deforestado; cada temporada de lluvias caen piedras y lodo hacia las casas.',
  'Una escuela cercana a una quebrada nunca ha hecho simulacros y no tiene señaladas rutas de evacuación ni zonas seguras.',
  'Una comunidad tira su basura en el cauce de la quebrada y los drenajes están tapados justo antes de la temporada de huracanes.',
  'Una familia escucha en la radio una alerta amarilla por un huracán que se acerca, pero decide no hacer nada porque "todavía no llueve".',
];
const critDecisionGuide='Debe proponer 3 acciones concretas de gestión de riesgos (reforestar, no construir o reubicarse fuera de la zona de riesgo, elaborar un plan familiar y practicar simulacros, preparar la mochila de emergencia, identificar rutas y zonas seguras, limpiar cauces y drenajes, atender las alertas tempranas) y explicar por qué cada una reduce la vulnerabilidad y el riesgo de desastre.';

const critCompareBank=[
  {a:'Una comunidad con cerros reforestados, casas seguras y un plan de emergencia recibe un huracán y sufre pocos daños.',b:'Una comunidad con cerros deforestados, casas frágiles y sin plan recibe el mismo huracán y sufre inundaciones y deslizamientos graves.',
   ga:'Baja vulnerabilidad: la prevención y el buen manejo del ambiente redujeron el riesgo.',
   gb:'Alta vulnerabilidad: la deforestación y la falta de preparación aumentaron el riesgo.',
   gr:'La amenaza (el huracán) fue la misma; la diferencia en los daños se debe a la distinta vulnerabilidad de cada comunidad.'},
  {a:'Un terremoto sacude una ciudad y derrumba edificios en pocos segundos.',b:'Un huracán se acerca durante varios días y provoca lluvias, inundaciones y deslizamientos.',
   ga:'Amenaza geológica: se origina dentro de la Tierra y actúa de forma rápida y repentina.',
   gb:'Amenaza hidrometeorológica: se relaciona con el clima y suele avisarse con días de anticipación.',
   gr:'No son el mismo tipo de amenaza: una es geológica y súbita, la otra es hidrometeorológica y permite alerta temprana.'},
  {a:'Una familia atiende la alerta temprana, evacua a tiempo y llega segura al refugio.',b:'Otra familia ignora la alerta, se queda en su casa junto al río y debe ser rescatada.',
   ga:'Buena gestión del riesgo: la preparación y la evacuación salvaron vidas.',
   gb:'Mala gestión del riesgo: ignorar la alerta aumentó el peligro.',
   gr:'Ante la misma amenaza, la decisión de prepararse y evacuar marcó la diferencia entre estar a salvo o en peligro.'},
  {a:'Una inundación cubre de agua los cultivos de una zona baja cercana a un río.',b:'Un deslizamiento de lodo y rocas baja por una ladera deforestada tras las lluvias.',
   ga:'Inundación: el agua cubre terrenos secos por el desbordamiento del río.',
   gb:'Deslizamiento: la tierra saturada de agua se desprende por la pendiente.',
   gr:'Ambos pueden ocurrir por las mismas lluvias, pero son amenazas distintas: una es exceso de agua en zonas bajas y la otra es movimiento de tierra en laderas.'},
];

const critCauseBank=[
  {cause:'Una comunidad deforesta los cerros que rodean sus casas.',guide:'El suelo queda sin raíces que lo sostengan y, con las lluvias, aumenta el riesgo de deslizamientos.'},
  {cause:'Las personas tiran basura en el cauce del río y tapan los drenajes.',guide:'El agua no corre bien y, al llover fuerte, el río se desborda y provoca inundaciones.'},
  {cause:'Una familia construye su casa a la orilla de un río que se desborda.',guide:'Aumenta su vulnerabilidad: ante una crecida, la casa puede inundarse o ser arrastrada.'},
  {cause:'Una comunidad ignora la alerta temprana de un huracán.',guide:'No evacua a tiempo y queda expuesta al peligro, con más riesgo de pérdidas humanas.'},
];
const critEffectBank=[
  {effect:'El río se desborda de noche e inunda las casas de una zona baja.',guide:'Lluvias muy intensas de un huracán o tormenta, sumadas a vivir en zona inundable.'},
  {effect:'Un deslizamiento de lodo sepulta viviendas al pie de un cerro.',guide:'Deforestación de la ladera y suelo saturado por lluvias prolongadas.'},
  {effect:'En 1998 Honduras sufre uno de sus peores desastres, con miles de víctimas.',guide:'El paso del huracán Mitch, de categoría 5, sobre comunidades vulnerables.'},
  {effect:'Una familia logra ponerse a salvo antes de que llegue la crecida.',guide:'Atendió la alerta temprana y evacuó a tiempo hacia una zona segura.'},
];

function genEvalCrit(){
  sfx('click');
  _injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });
  const _sC = document.getElementById('evalCritFormaSel');
  if (_sC && parseInt(_sC.value, 10)) evalCritFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sC.value, 10)));
  const cf=evalCritFormNum;window._currentEvalCritForm=cf;const rngC = _evalRng(200000 + cf);evalCritFormNum=(evalCritFormNum%EVAL_FORMAS)+1;_injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });saveProgress();
  document.getElementById('evalcrit-screen-title').textContent=`🧠 Pensamiento Crítico · Forma ${cf} · Desastres Naturales`;
  evalCritAnsVisible=false;
  const out=document.getElementById('evalCritOut');out.innerHTML='';

  const kase=_pickF(critCaseBank,1,rngC)[0];
  const s1=document.createElement('div');
  s1.innerHTML=`<div class="eval-section-title">I. Caso de análisis: un desastre en la comunidad <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${kase.txt}</div>${critCaseQuestions.map((q,i)=>`<div class="crit-q-block"><div class="crit-q-label">${q}</div><textarea class="crit-textarea" rows="2" aria-label="${q}"></textarea><div class="crit-pauta">${critCaseGuides[i]}</div></div>`).join('')}<div class="crit-selfscore"><label for="critScore0">Obtenido:</label><input type="number" id="critScore0" class="crit-score-input" data-score="0" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s1);

  const err=_pickF(critErrorBank,1,rngC)[0];
  const s2=document.createElement('div');
  s2.innerHTML=`<div class="eval-section-title">II. Corrige el error <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${err.txt}</div><p style="font-size:0.85rem;margin-bottom:0.5rem;">Identifica <strong>dos errores</strong> y corrígelos con tus propias palabras:</p><div class="crit-q-block"><div class="crit-q-label">Error 1 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 1 y su corrección"></textarea><div class="crit-pauta">${err.g1}</div></div><div class="crit-q-block"><div class="crit-q-label">Error 2 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 2 y su corrección"></textarea><div class="crit-pauta">${err.g2}</div></div><div class="crit-selfscore"><label for="critScore1">Obtenido:</label><input type="number" id="critScore1" class="crit-score-input" data-score="1" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s2);

  const dec=_pickF(critDecisionBank,1,rngC)[0];
  const s3=document.createElement('div');
  s3.innerHTML=`<div class="eval-section-title">III. Toma de decisiones: reducir el riesgo <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${dec}</div><div class="crit-q-block"><div class="crit-q-label">¿Qué tres acciones recomendarías para reducir el riesgo de desastre? Explica por qué ayudaría cada una.</div><textarea class="crit-textarea" rows="4" aria-label="Tres acciones recomendadas y su justificación"></textarea><div class="crit-pauta">${critDecisionGuide}</div></div><div class="crit-selfscore"><label for="critScore2">Obtenido:</label><input type="number" id="critScore2" class="crit-score-input" data-score="2" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s3);

  const cmp=_pickF(critCompareBank,1,rngC)[0];
  const s4=document.createElement('div');
  s4.innerHTML=`<div class="eval-section-title">IV. Comparación razonada <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-compare-grid"><div class="crit-compare-box"><h5>Caso A</h5>${cmp.a}</div><div class="crit-compare-box"><h5>Caso B</h5>${cmp.b}</div></div><div class="crit-q-block"><div class="crit-q-label">1. ¿Qué concepto o tipo de amenaza representa cada caso? 2. ¿Qué factor explica la diferencia? 3. ¿Por qué no son lo mismo?</div><textarea class="crit-textarea" rows="4" aria-label="Comparación razonada de los casos A y B"></textarea><div class="crit-pauta">Caso A: ${cmp.ga} · Caso B: ${cmp.gb} · ${cmp.gr}</div></div><div class="crit-selfscore"><label for="critScore3">Obtenido:</label><input type="number" id="critScore3" class="crit-score-input" data-score="3" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
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
  let s1=`<div class="sec-title"><span>I. Caso de análisis: un desastre en la comunidad</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.kase.txt}</p>`;
  critCaseQuestions.forEach(q=>{s1+=`<p class="crit-print-q">${q}</p>${lines(1)}`;});
  let s2=`<div class="sec-title"><span>II. Corrige el error</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.err.txt}</p><p class="crit-print-q">Identifica dos errores y corrígelos con tus propias palabras:</p><p class="crit-print-q"><strong>Error 1:</strong></p>${lines(1)}<p class="crit-print-q"><strong>Error 2:</strong></p>${lines(1)}`;
  let s3=`<div class="sec-title"><span>III. Toma de decisiones: reducir el riesgo</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.dec}</p><p class="crit-print-q">¿Qué tres acciones recomendarías para reducir el riesgo de desastre? Explica por qué ayudaría cada una.</p>${lines(2)}`;
  let s4=`<div class="sec-title"><span>IV. Comparación razonada</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><div class="crit-compare-print-grid"><div class="crit-compare-print-box"><strong>Caso A:</strong> ${d.cmp.a}</div><div class="crit-compare-print-box"><strong>Caso B:</strong> ${d.cmp.b}</div></div><p class="crit-print-q">1. ¿Qué concepto o tipo de amenaza representa cada caso? 2. ¿Qué factor explica la diferencia? 3. ¿Por qué no son lo mismo?</p>${lines(2)}`;
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
  const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Pensamiento Crítico Desastres Naturales · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.1rem 0.4rem;margin:0.2rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #27ae60;background:#e8f8f5;color:#27ae60;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#27ae60;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #27ae60;height:12px;}.obt-pct{white-space:nowrap;}.crit-print-scenario{font-size:10.5pt;background:#e8f8f5;border-left:3px solid #27ae60;padding:0.2rem 0.5rem;margin:0.1rem 0 0.2rem;line-height:1.3;}.crit-print-q{font-size:10pt;font-weight:600;margin:0.15rem 0 0.08rem;line-height:1.25;}.ln{border-bottom:1px solid #111;min-height:12px;margin-bottom:2px;}.crit-compare-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin:0.15rem 0;}.crit-compare-print-box{font-size:9.5pt;background:#e8f8f5;border-radius:4px;padding:0.25rem 0.4rem;line-height:1.25;}.crit-print-tbl{width:100%;border-collapse:collapse;font-size:9.5pt;margin-top:0.15rem;}.crit-print-tbl th,.crit-print-tbl td{border:1px solid #999;padding:0.3rem 0.45rem;text-align:left;height:30px;vertical-align:middle;}.crit-print-tbl th{background:#e8f8f5;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:9.5pt;font-weight:700;}.p-sub{font-size:7pt;color:#c00;font-weight:700;margin:0.08rem 0;}.p-meta{font-size:7pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.9rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.45rem;}.p-ttl{font-size:8pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.1rem;margin-bottom:0.18rem;}.p-crit-line{font-size:7.5pt;color:#27ae60;margin-bottom:0.18rem;line-height:1.35;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.2rem;padding:0.1rem 0;color:#27ae60;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #27ae60;}.forma-tag{position:fixed;bottom:5mm;right:6mm;font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;}@media print{@page{size:letter portrait;margin:12.7mm;}}</style></head><body><div class="ph"><h2>Evaluación Competencial · Pensamiento Crítico · Desastres Naturales y el Huracán Mitch · II y III Ciclo</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Institución:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 5 secciones de 20 puntos</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100</span></div><div class="pauta-wrap"><div class="p-head"><div class="p-main">✅ PAUTA — Pensamiento Crítico · Desastres Naturales · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 5 secciones × 20 pts c/u — respuesta abierta, usar como guía de corrección</div></div><div class="p-grid">${pR}</div></div><div class="forma-tag">Forma ${forma}</div></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(doc);win.document.close();setTimeout(()=>win.print(),400);
}

// ===================== LABORATORIO DE AMENAZAS =====================
const parteData={
  huracan:{
    nombre:'Huracán',icon:'🌀',
    queEs:{title:'¿Qué es?',info:'• Enorme <strong>tormenta giratoria</strong> que se forma sobre el mar cálido<br>• Tiene un centro tranquilo llamado <strong>ojo</strong>, rodeado por la <strong>pared del ojo</strong> y <strong>bandas de nubes</strong><br>• Trae <strong>vientos fuertes, lluvias intensas y marejadas</strong><br>• Se clasifica en <strong>5 categorías</strong> (escala Saffir-Simpson)<br>• Es una amenaza <strong>hidrometeorológica</strong>'},
    causas:{title:'Causas',info:'• Se forma cuando el <strong>mar está caliente</strong> (más de 26 °C)<br>• El <strong>aire húmedo sube</strong> y forma grandes nubes de tormenta<br>• Los vientos <strong>empiezan a girar</strong> y la tormenta crece<br>• Se alimenta del <strong>calor y la humedad</strong> del océano<br>• Se debilita al tocar tierra o aguas frías'},
    senales:{title:'Señales de alerta',info:'• <strong>Avisos meteorológicos</strong> y boletines de COPECO<br>• Cielo muy nublado, <strong>lluvias y vientos crecientes</strong><br>• El mar se agita y sube su nivel<br>• Se declara <strong>alerta verde, amarilla o roja</strong> según el peligro<br>• Hay que estar atentos a la <strong>radio y las autoridades</strong>'},
    prevencion:{title:'Prevención',info:'• <strong>Atender la alerta temprana</strong> y evacuar a tiempo<br>• Preparar la <strong>mochila de emergencia</strong> (agua, comida, linterna, documentos)<br>• Conocer la <strong>ruta de evacuación</strong> y la zona segura<br>• Asegurar techos y no vivir en zonas inundables<br>• <strong>No cruzar ríos crecidos</strong> ni salir durante el paso del huracán'}
  },
  terremoto:{
    nombre:'Terremoto',icon:'🏚️',
    queEs:{title:'¿Qué es?',info:'• <strong>Movimiento brusco del suelo</strong> por la liberación de energía dentro de la Tierra<br>• Se origina en <strong>fallas geológicas</strong> y en el choque de placas<br>• Es una amenaza <strong>geológica</strong><br>• Ocurre de forma <strong>repentina</strong>, casi sin aviso<br>• Su intensidad se mide con instrumentos (sismógrafos)'},
    causas:{title:'Causas',info:'• El <strong>movimiento de las placas</strong> tectónicas de la Tierra<br>• La energía acumulada se <strong>libera de golpe</strong><br>• Las <strong>fallas geológicas</strong> se rompen o deslizan<br>• También puede haber sismos por <strong>actividad volcánica</strong><br>• Es un fenómeno <strong>natural</strong> del interior del planeta'},
    senales:{title:'Qué hacer',info:'• <strong>Agacharse, cubrirse</strong> la cabeza y <strong>sujetarse</strong><br>• Alejarse de <strong>ventanas y objetos</strong> que puedan caer<br>• <strong>No usar el ascensor</strong>; usar las escaleras al salir<br>• Ubicarse en <strong>zonas seguras</strong> señaladas<br>• Mantener la <strong>calma</strong> y seguir el plan de emergencia'},
    prevencion:{title:'Prevención',info:'• <strong>Construcciones seguras</strong> y resistentes a sismos<br>• Fijar bien <strong>muebles y objetos pesados</strong><br>• Identificar <strong>zonas seguras</strong> y rutas de salida<br>• Practicar <strong>simulacros</strong> en la escuela y la casa<br>• Tener a mano la <strong>mochila de emergencia</strong>'}
  },
  inundacion:{
    nombre:'Inundación',icon:'🌊',
    queEs:{title:'¿Qué es?',info:'• Ocurre cuando el <strong>agua cubre terrenos</strong> que normalmente están secos<br>• Suele deberse al <strong>desbordamiento de ríos</strong> o lluvias intensas<br>• Es una amenaza <strong>hidrometeorológica</strong><br>• Fue uno de los mayores daños del <strong>huracán Mitch</strong><br>• Afecta casas, cultivos, caminos y puentes'},
    causas:{title:'Causas',info:'• <strong>Lluvias muy intensas</strong> o prolongadas<br>• <strong>Desbordamiento</strong> de ríos y quebradas<br>• <strong>Basura en los cauces</strong> y drenajes tapados<br>• <strong>Deforestación</strong>, que impide que el suelo absorba el agua<br>• Vivir en <strong>zonas bajas</strong> o inundables'},
    senales:{title:'Señales de alerta',info:'• El <strong>río o la quebrada crecen</strong> rápidamente<br>• El agua cambia de color y arrastra ramas y lodo<br>• <strong>Lluvias fuertes</strong> que no paran<br>• Avisos de <strong>alerta temprana</strong> de las autoridades<br>• Hay que estar atentos, sobre todo de <strong>noche</strong>'},
    prevencion:{title:'Prevención',info:'• <strong>No construir</strong> a la orilla de ríos ni en zonas bajas<br>• <strong>Limpiar cauces y drenajes</strong>; no tirar basura<br>• <strong>Reforestar</strong> para que el suelo absorba el agua<br>• Alejarse del cauce y buscar <strong>zonas altas</strong><br>• <strong>No cruzar</strong> corrientes de agua a pie ni en vehículo'}
  },
  deslizamiento:{
    nombre:'Deslizamiento',icon:'⛰️',
    queEs:{title:'¿Qué es?',info:'• <strong>Desplazamiento de tierra, lodo y rocas</strong> por una ladera<br>• Se produce cuando el <strong>suelo se satura de agua</strong><br>• Es común en <strong>cerros deforestados</strong> y pendientes fuertes<br>• Puede sepultar casas y caminos en pocos segundos<br>• Durante el Mitch causó tragedias como la del <strong>volcán Casita</strong>'},
    causas:{title:'Causas',info:'• <strong>Lluvias intensas</strong> que saturan el suelo<br>• <strong>Deforestación</strong>: sin raíces, la tierra no se sostiene<br>• <strong>Pendientes muy inclinadas</strong> e inestables<br>• Cortes en las laderas para construir o hacer caminos<br>• A veces se combina con <strong>sismos</strong>'},
    senales:{title:'Señales de alerta',info:'• Aparecen <strong>grietas</strong> en el suelo o en las paredes<br>• Caen <strong>piedras o tierra</strong> por la ladera<br>• El terreno se <strong>hunde o se inclina</strong><br>• Ruidos extraños en el cerro durante las lluvias<br>• <strong>Árboles o postes inclinados</strong>'},
    prevencion:{title:'Prevención',info:'• <strong>Reforestar</strong> las laderas y no talar los cerros<br>• <strong>No construir</strong> al pie ni sobre pendientes inestables<br>• Construir <strong>muros de contención</strong> y buen drenaje<br>• Estar atentos a las <strong>señales de alerta</strong> y evacuar<br>• Respetar las <strong>zonas de riesgo</strong> señaladas'}
  }
};
let labParte='huracan',labAspecto='queEs';
function labShowParte(parteKey){labParte=parteKey;updateLabDisplay();document.querySelectorAll('.lab-cont-btn').forEach(b=>b.classList.remove('active-pri'));const btn=document.querySelector(`[data-parte="${parteKey}"]`);if(btn)btn.classList.add('active-pri');if(typeof sfx==='function')sfx('click');}
function labShowAspecto(aspectoKey){labAspecto=aspectoKey;updateLabDisplay();document.querySelectorAll('.lab-asp-btn').forEach(b=>b.classList.remove('active-sec'));const btn=document.querySelector(`[data-aspecto="${aspectoKey}"]`);if(btn)btn.classList.add('active-sec');if(typeof sfx==='function')sfx('click');}
function updateLabDisplay(){const data=parteData[labParte];const asp=data[labAspecto];document.getElementById('lab-sentence').innerHTML=`🌀 Explorando: <strong>${data.nombre}</strong> → <strong>${asp.title}</strong>`;document.getElementById('lab-display').innerHTML=`<div class="lab-cont-header">${data.icon} ${data.nombre}</div><div class="lab-asp-title">${asp.title}</div><div class="lab-asp-info">${asp.info}</div>`;}

// ===================== DIPLOMA =====================
function _diplPct(){return xp>=MXP?100:Math.round((xp/MXP)*100);}
function openDiploma(){sfx('fan');const pct=_diplPct();document.getElementById('diplPct').textContent=pct+'%';document.getElementById('diplBar').style.width=pct+'%';document.getElementById('diplDate').textContent='Fecha: '+new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});const msgs=['¡Sigue aprendiendo!','¡Muy buen trabajo!','¡Excelente en gestión de riesgos!','¡Eres un experto en prevención de desastres!','¡Maestro en Prevención de Desastres!'];document.getElementById('diplMsg').textContent=msgs[Math.min(Math.floor(pct/25),4)];const stars=['⭐','⭐⭐','⭐⭐⭐'];document.getElementById('diplStars').textContent=stars[Math.min(Math.floor(pct/40),2)];const achTxt=unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(' · ');document.getElementById('diplAch').textContent=achTxt||'Sigue completando secciones para desbloquear logros';document.getElementById('diplomaOverlay').classList.add('open');launchConfetti();}
function closeDiploma(){document.getElementById('diplomaOverlay').classList.remove('open');}
function updateDiplomaName(v){document.getElementById('diplName').textContent=v||'Estudiante';}
function shareWA(){const name=document.getElementById('diplName').textContent||'Estudiante';const pct=_diplPct();const msg=`🌀 ¡${name} completó la Misión "Desastres Naturales y el Huracán Mitch"! 🏅 Progreso: ${pct}% · 🛡️ policastsapien.com`;_waShare(msg);}
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
  document.querySelector('[data-parte="huracan"]')?.classList.add('active-pri');
  document.querySelector('[data-aspecto="queEs"]')?.classList.add('active-sec');
  renderAchPanel();
});

// Formas deterministas v1: selectores de forma visibles desde la carga de la página
(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalOp==='function') _injectFormaSel('genEvalOp','evalOpFormaSel',evalOpFormNum,function(v){evalOpFormNum=v;}); }catch(e){} try{ if(typeof genEvalCrit==='function') _injectFormaSel('genEvalCrit','evalCritFormaSel',evalCritFormNum,function(v){evalCritFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();
