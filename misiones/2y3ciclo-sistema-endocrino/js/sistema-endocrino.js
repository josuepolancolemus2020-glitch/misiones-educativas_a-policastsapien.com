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
const SAVE_KEY='sistema_endocrino_v1';
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
  primer_quiz:{icon:'🧠',label:'Primera prueba del sistema endocrino superada'},
  flash_master:{icon:'🃏',label:'Todas las flashcards del sistema endocrino exploradas'},
  clasif_pro:{icon:'🗂️',label:'Clasificador de glándulas y hormonas experto'},
  id_master:{icon:'🔍',label:'Identificador de conceptos endocrinos maestro'},
  reto_hero:{icon:'🏆',label:'Héroe del reto de clasificación endocrina'},
  nivel3:{icon:'🔬',label:'¡Endocrinólogo junior! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡Maestro del Sistema Endocrino! Nivel 6'},
  widgets_master:{icon:'🧩',label:'Widgets del sistema endocrino dominados'}
};
function unlockAchievement(id){if(unlockedAch.includes(id))return;unlockedAch.push(id);sfx('ach');showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label);launchConfetti();renderAchPanel();saveProgress();}
function renderAchPanel(){const list=document.getElementById('achList');list.innerHTML='';Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{const div=document.createElement('div');div.className='ach-item'+(unlockedAch.includes(id)?'':' locked');div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`;list.appendChild(div);});}
function toggleAchPanel(){sfx('click');document.getElementById('achPanel').classList.toggle('open');}
function showToast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}t.textContent=msg;t.style.display='block';clearTimeout(t._tid);t._tid=setTimeout(()=>t.style.display='none',3200);}
function launchConfetti(){const colors=['#6c5ce7','#a29bfe','#0984e3','#74b9ff','#00b894'];for(let i=0;i<60;i++){const c=document.createElement('div');c.className='confetti-piece';c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`;document.body.appendChild(c);c.addEventListener('animationend',()=>c.remove());}}

// ===================== XP =====================
const lvls=[{t:0,n:'Aprendiz 🌱'},{t:25,n:'Explorador 🔬'},{t:55,n:'Endocrinólogo Jr. 🧪'},{t:90,n:'Bioquímico 🧬'},{t:130,n:'Investigador 🔭'},{t:165,n:'Endocrino-especialista 🏅'},{t:190,n:'Maestro del S. Endocrino 🏆'}];
function pts(n){xp=Math.max(0,Math.min(MXP,xp+n));updateXPBar();saveProgress();}
function updateXPBar(){const pct=Math.round((xp/MXP)*100);document.getElementById('xpFill').style.width=pct+'%';const el=document.getElementById('xpPts');el.textContent='⭐ '+xp;el.style.transform='scale(1.3)';setTimeout(()=>el.style.transform='',300);let lv=0;for(let i=0;i<lvls.length;i++)if(xp>=lvls[i].t)lv=i;document.getElementById('xpLvl').textContent=lvls[lv].n;if(lv!==prevLevel){if(lv>=2)unlockAchievement('nivel3');if(lv>=5)unlockAchievement('nivel5');prevLevel=lv;}}
function resetXP(){sfx('click');xp=0;updateXPBar();showToast('🔄 XP reiniciado a 0');}
function fin(id,showFX=true){if(!done.has(id)){done.add(id);const b=document.querySelector(`[data-s="${id}"]`);if(b)b.classList.add('done');if(showFX){sfx('up');launchConfetti();}saveProgress();}}
function getProgress(){return Math.round((done.size/TOTAL_SECTIONS)*100);}

// ===================== NAV =====================
function go(id){sfx('click');document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});document.getElementById(id).classList.add('active');const btn=document.querySelector(`[data-s="${id}"]`);if(btn){btn.classList.add('active');btn.setAttribute('aria-selected','true');}window.scrollTo({top:0,behavior:'smooth'});if(id==='s-sopa'){setTimeout(buildSopa,50);}if(id==='s-widgets'){setTimeout(buildRoute,50);}}

// ===================== FLASHCARD DATA =====================
const fcData=[
  {w:'Sistema Endocrino',a:'⚗️ Sistema de <strong>control y comunicación</strong> que usa <strong>mensajeros químicos (hormonas)</strong> transportados por la <strong>sangre</strong>. Regula el crecimiento, el metabolismo, la reproducción y el equilibrio interno (<strong>homeostasis</strong>).'},
  {w:'Hormona',a:'💊 <strong>Mensajero químico</strong> producido por una glándula endocrina. Viaja por la sangre y actúa solo sobre las <strong>células blanco</strong> que tienen su <strong>receptor</strong>. Basta una cantidad diminuta para producir grandes efectos.'},
  {w:'Glándula endocrina',a:'⚗️ Órgano que libera hormonas <strong>directamente a la sangre, sin conductos</strong>. Ejemplos: hipófisis, tiroides, páncreas, suprarrenales. Se diferencia de la <strong>exocrina</strong>, que usa conductos (sudor, saliva).'},
  {w:'Hipófisis',a:'👑 La <strong>glándula maestra</strong>. Ubicada bajo el cerebro, dirige a las demás glándulas. Produce la <strong>hormona del crecimiento (GH)</strong> y hormonas que controlan la tiroides, las suprarrenales y las gónadas.'},
  {w:'Hipotálamo',a:'🧠 <strong>Puente entre el sistema nervioso y el endocrino</strong>. Recibe señales nerviosas del cerebro y las convierte en órdenes hormonales que envía a la <strong>hipófisis</strong>. Coordina el sistema <strong>neuroendocrino</strong>.'},
  {w:'Tiroides',a:'🦋 Glándula con forma de mariposa en el cuello. Produce la <strong>tiroxina</strong>, que regula el <strong>metabolismo</strong> y la producción de energía. Necesita <strong>yodo</strong>; su falta causa <strong>bocio</strong>.'},
  {w:'Insulina',a:'⬇️ Hormona del <strong>páncreas</strong> que <strong>baja el nivel de azúcar (glucosa)</strong> en la sangre, ordenando a las células que la capten y guarden. Su falta o mal uso causa la <strong>diabetes</strong>.'},
  {w:'Glucagón',a:'⬆️ Hormona del <strong>páncreas</strong> que <strong>sube el nivel de azúcar</strong> en la sangre liberando la glucosa almacenada. Actúa sobre todo en el <strong>ayuno</strong>. Es la contraparte de la insulina.'},
  {w:'Adrenalina',a:'⚡ Hormona de las <strong>glándulas suprarrenales</strong>. Prepara el cuerpo ante el peligro (<strong>"lucha o huye"</strong>): acelera el corazón, dilata las pupilas y sube el azúcar. Trabaja junto al sistema nervioso.'},
  {w:'Cortisol',a:'🔥 Hormona del <strong>estrés</strong> producida por las <strong>suprarrenales</strong>. Ayuda a afrontar situaciones difíciles, pero en exceso y de forma crónica daña el sueño, el ánimo y las defensas.'},
  {w:'Melatonina',a:'🌙 Hormona de la <strong>glándula pineal</strong>. Regula el <strong>ciclo de sueño y vigilia</strong>: aumenta de noche para darnos sueño. El exceso de pantallas por la noche reduce su producción.'},
  {w:'Homeostasis',a:'⚖️ <strong>Equilibrio interno</strong> del cuerpo. El sistema endocrino la mantiene ajustando los niveles de azúcar, agua, temperatura y otras variables mediante hormonas y <strong>retroalimentación</strong>.'},
  {w:'Retroalimentación negativa',a:'🔁 Mecanismo de control: cuando hay <strong>suficiente hormona</strong>, esta avisa a la glándula que <strong>deje de producir más</strong>. Funciona como un <strong>termostato</strong> y mantiene la homeostasis.'},
  {w:'Diabetes',a:'🩸 Enfermedad endocrina por <strong>falta o mal uso de la insulina</strong>. La glucosa se acumula en la sangre. Síntomas: mucha sed, orina frecuente y cansancio. Se controla con dieta, ejercicio y tratamiento.'},
];
let fcIdx=0;
function upFC(){document.getElementById('fcInner').classList.remove('flipped');document.getElementById('fcW').textContent=fcData[fcIdx].w;document.getElementById('fcA').innerHTML=fcData[fcIdx].a;document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length;}
function flipCard(){sfx('flip');document.getElementById('fcInner').classList.toggle('flipped');if(!xpTracker.fc.has(fcIdx)){xpTracker.fc.add(fcIdx);pts(1);}if(xpTracker.fc.size===fcData.length){fin('s-flash');unlockAchievement('flash_master');}}
function nextFC(){sfx('click');fcIdx=(fcIdx+1)%fcData.length;upFC();}
function prevFC(){sfx('click');fcIdx=(fcIdx-1+fcData.length)%fcData.length;upFC();}

// ===================== QUIZ DATA =====================
const qzData=[
  {q:'¿Qué mensajero químico usa el sistema endocrino para comunicarse?',o:['a) El impulso eléctrico','b) La hormona','c) El neurotransmisor','d) La enzima'],c:1},
  {q:'¿Cuál es la "glándula maestra" que dirige a las demás glándulas?',o:['a) La tiroides','b) El páncreas','c) La hipófisis','d) La glándula pineal'],c:2},
  {q:'¿Qué hormona baja el nivel de azúcar (glucosa) en la sangre?',o:['a) Glucagón','b) Adrenalina','c) Insulina','d) Cortisol'],c:2},
  {q:'¿Qué glándula regula el metabolismo mediante la tiroxina?',o:['a) Tiroides','b) Suprarrenal','c) Timo','d) Hipófisis'],c:0},
  {q:'¿Por dónde viajan las hormonas hasta las células blanco?',o:['a) Por los nervios','b) Por la sangre','c) Por la linfa','d) Por la médula'],c:1},
  {q:'¿Qué estructura une el sistema nervioso con el sistema endocrino?',o:['a) El cerebelo','b) La médula espinal','c) El hipotálamo','d) El timo'],c:2},
  {q:'¿Qué hormona prepara el cuerpo ante el peligro ("lucha o huye")?',o:['a) Melatonina','b) Insulina','c) Tiroxina','d) Adrenalina'],c:3},
  {q:'¿Cómo se llama el equilibrio interno que mantiene el sistema endocrino?',o:['a) Metabolismo','b) Homeostasis','c) Sinapsis','d) Digestión'],c:1},
  {q:'¿Qué enfermedad se produce por falta o mal uso de la insulina?',o:['a) Bocio','b) Gigantismo','c) Diabetes','d) Cushing'],c:2},
];
let qzIdx=0,qzSel=-1,qzDone=false;
function buildQz(){qzIdx=0;qzSel=-1;qzDone=false;showQz();}
function showQz(){if(qzIdx>=qzData.length){document.getElementById('qzQ').textContent='🎉 ¡Quiz completado!';document.getElementById('qzOpts').innerHTML='';fin('s-quiz');unlockAchievement('primer_quiz');return;}const q=qzData[qzIdx];document.getElementById('qzProg').textContent=`Pregunta ${qzIdx+1} de ${qzData.length}`;document.getElementById('qzQ').textContent=q.q;const opts=document.getElementById('qzOpts');opts.innerHTML='';q.o.forEach((o,i)=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=o;b.onclick=()=>{if(qzDone)return;document.querySelectorAll('.qz-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');qzSel=i;sfx('click');};opts.appendChild(b);});qzDone=false;}
function checkQz(){if(qzSel<0)return fb('fbQz','Selecciona una respuesta.',false);qzDone=true;const opts=document.querySelectorAll('.qz-opt');if(qzSel===qzData[qzIdx].c){opts[qzSel].classList.add('correct');fb('fbQz','¡Correcto! +5 XP',true);if(!xpTracker.qz.has(qzIdx)){xpTracker.qz.add(qzIdx);pts(5);}sfx('ok');}else{opts[qzSel].classList.add('wrong');opts[qzData[qzIdx].c].classList.add('correct');fb('fbQz','Incorrecto. Revisa la respuesta correcta.',false);sfx('no');}setTimeout(()=>{qzIdx++;qzSel=-1;showQz();},1600);}
function resetQz(){sfx('click');qzIdx=0;qzSel=-1;qzDone=false;showQz();document.getElementById('fbQz').classList.remove('show');}

// ===================== CLASIFICACIÓN =====================
const classGroups=[
  {label:['Endocrina','Exocrina'],headA:'⚗️ Glándula Endocrina',headB:'💧 Glándula Exocrina',colA:'endo',colB:'exo',
   words:[{w:'Tiroides',t:'endo'},{w:'Glándula sudorípara',t:'exo'},{w:'Hipófisis',t:'endo'},{w:'Glándula salival',t:'exo'},{w:'Islotes del páncreas',t:'endo'},{w:'Glándula lagrimal',t:'exo'},{w:'Suprarrenal',t:'endo'},{w:'Glándula sebácea',t:'exo'},{w:'Glándula pineal',t:'endo'},{w:'Glándula mamaria',t:'exo'}]},
  {label:['Nervioso','Endocrino'],headA:'🧠 Sistema Nervioso',headB:'⚗️ Sistema Endocrino',colA:'ner',colB:'end',
   words:[{w:'Impulso eléctrico',t:'ner'},{w:'Hormonas',t:'end'},{w:'Viaja por neuronas',t:'ner'},{w:'Viaja por la sangre',t:'end'},{w:'Respuesta rápida',t:'ner'},{w:'Respuesta lenta',t:'end'},{w:'Efecto breve',t:'ner'},{w:'Efecto duradero',t:'end'},{w:'Actúa por nervios',t:'ner'},{w:'Actúa por glándulas',t:'end'}]},
  {label:['Hormona','Glándula'],headA:'💊 Es una Hormona',headB:'⚗️ Es una Glándula',colA:'horm',colB:'gland',
   words:[{w:'Insulina',t:'horm'},{w:'Páncreas',t:'gland'},{w:'Tiroxina',t:'horm'},{w:'Tiroides',t:'gland'},{w:'Adrenalina',t:'horm'},{w:'Suprarrenal',t:'gland'},{w:'Melatonina',t:'horm'},{w:'Glándula pineal',t:'gland'},{w:'Cortisol',t:'horm'},{w:'Hipófisis',t:'gland'}]},
  {label:['Baja glucosa','Sube glucosa'],headA:'⬇️ Baja la glucosa (Insulina)',headB:'⬆️ Sube la glucosa (Glucagón)',colA:'baja',colB:'sube',
   words:[{w:'Insulina',t:'baja'},{w:'Glucagón',t:'sube'},{w:'Después de comer',t:'baja'},{w:'Durante el ayuno',t:'sube'},{w:'Guarda azúcar en las células',t:'baja'},{w:'Libera azúcar a la sangre',t:'sube'},{w:'Almacena glucógeno',t:'baja'},{w:'Adrenalina en un susto',t:'sube'},{w:'Reduce la glucemia',t:'baja'},{w:'Aumenta la glucemia',t:'sube'}]},
];
let currentClassGroupIdx=0,clsSelectedWord=null;
function buildClass(){const group=classGroups[currentClassGroupIdx];document.getElementById('col-left-head').textContent=group.headA;document.getElementById('col-right-head').textContent=group.headB;const bank=document.getElementById('clsBank');bank.innerHTML='';clsSelectedWord=null;document.getElementById('items-left').innerHTML='';document.getElementById('items-right').innerHTML='';_shuffle([...group.words]).forEach(w=>{const el=document.createElement('div');el.className='wb-item';el.textContent=w.w;el.dataset.t=w.t;el.onclick=()=>{document.querySelectorAll('.wb-item').forEach(i=>i.classList.remove('sel-word'));el.classList.add('sel-word');clsSelectedWord=el;sfx('click');};bank.appendChild(el);});['col-left','col-right'].forEach(colId=>{const col=document.getElementById(colId);col.onclick=(e)=>{if(!clsSelectedWord||e.target.classList.contains('drop-item'))return;const targetId=colId==='col-left'?'items-left':'items-right';const wordsCol=document.getElementById(targetId);const item=document.createElement('div');item.className='drop-item';item.textContent=clsSelectedWord.textContent;item.dataset.t=clsSelectedWord.dataset.t;const original=clsSelectedWord;item.onclick=(ev)=>{ev.stopPropagation();if(clsSelectedWord!==null){col.click();}else{document.getElementById('clsBank').appendChild(original);original.classList.remove('sel-word');item.remove();if(typeof sfx==='function')sfx('click');}};wordsCol.appendChild(item);clsSelectedWord.remove();clsSelectedWord=null;sfx('click');};});}
function checkClass(){const remaining=document.querySelectorAll('#clsBank .wb-item').length;if(remaining>0){fb('fbCls','Mueve todas las palabras a las columnas primero.',false);return;}const group=classGroups[currentClassGroupIdx];let allOk=true;document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{const inLeft=el.parentElement.id==='items-left';const expectedType=inLeft?group.colA:group.colB;if(el.dataset.t===expectedType){el.classList.add('cls-ok');}else{el.classList.add('cls-no');allOk=false;}});if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);}if(allOk){fb('fbCls','¡Perfecto! +5 XP',true);sfx('fan');fin('s-clasifica');unlockAchievement('clasif_pro');}else{fb('fbCls','Hay errores. Marcados en rojo.',false);sfx('no');}}
function nextClassGroup(){sfx('click');currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length;buildClass();document.getElementById('fbCls').classList.remove('show');showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]);}
function resetClass(){sfx('click');buildClass();document.getElementById('fbCls').classList.remove('show');}

// ===================== IDENTIFICAR =====================
const idData=[
  {s:['La','insulina','reduce','el','nivel','de','azúcar','en','la','sangre.'],c:1,art:'Hormona que baja la glucosa'},
  {s:['La','hipófisis','dirige','a','las','demás','glándulas','del','cuerpo.'],c:1,art:'La glándula maestra'},
  {s:['La','tiroides','regula','el','metabolismo','con','la','tiroxina.'],c:1,art:'Glándula del metabolismo'},
  {s:['Las','hormonas','viajan','por','la','sangre','hasta','las','células.'],c:1,art:'Mensajeros químicos del sistema endocrino'},
  {s:['El','páncreas','produce','insulina','y','glucagón.'],c:1,art:'Glándula que controla la glucosa'},
  {s:['La','adrenalina','prepara','el','cuerpo','ante','el','peligro.'],c:1,art:'Hormona del estrés (lucha o huye)'},
  {s:['La','melatonina','regula','el','ciclo','del','sueño.'],c:1,art:'Hormona del sueño'},
  {s:['El','hipotálamo','une','el','sistema','nervioso','con','el','endocrino.'],c:1,art:'Puente neuroendocrino'},
];
let idIdx=0,idDone=false;
function showId(){idDone=false;if(idIdx>=idData.length){document.getElementById('idSent').innerHTML='🎉 ¡Completado!';fin('s-identifica');unlockAchievement('id_master');return;}const d=idData[idIdx];document.getElementById('idProg').textContent=`Oración ${idIdx+1} de ${idData.length}`;document.getElementById('idInfo').textContent=`Busca: ${d.art}`;const sent=document.getElementById('idSent');sent.innerHTML='';d.s.forEach((w,i)=>{const span=document.createElement('span');span.className='id-word';span.textContent=w+' ';span.onclick=()=>checkId(i,span);sent.appendChild(span);});}
function checkId(i,span){if(idDone)return;document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected'));span.classList.add('selected');if(i===idData[idIdx].c){idDone=true;span.classList.add('id-ok');fb('fbId','¡Correcto! +5 XP',true);if(!xpTracker.id.has(idIdx)){xpTracker.id.add(idIdx);pts(5);}sfx('ok');}else{span.classList.add('id-no');fb('fbId','Ese no es el término solicitado.',false);sfx('no');}}
function nextId(){sfx('click');idIdx++;showId();document.getElementById('fbId').classList.remove('show');}
function resetId(){sfx('click');idIdx=0;showId();document.getElementById('fbId').classList.remove('show');}

// ===================== COMPLETA =====================
const cmpData=[
  {s:'La ___ es la hormona que baja el azúcar en la sangre.',opts:['insulina','glucagón','tiroxina'],c:0},
  {s:'La ___ es la glándula maestra del sistema endocrino.',opts:['tiroides','hipófisis','pineal'],c:1},
  {s:'La glándula ___ regula el metabolismo con la tiroxina.',opts:['suprarrenal','pineal','tiroides'],c:2},
  {s:'Las hormonas viajan por el cuerpo a través de la ___.',opts:['linfa','sangre','saliva'],c:1},
  {s:'La ___ prepara el cuerpo ante el peligro (lucha o huye).',opts:['melatonina','insulina','adrenalina'],c:2},
  {s:'La enfermedad por falta o mal uso de la insulina es la ___.',opts:['bocio','diabetes','gigantismo'],c:1},
  {s:'La hormona ___ regula el ciclo de sueño y vigilia.',opts:['cortisol','melatonina','glucagón'],c:1},
  {s:'El equilibrio interno del cuerpo se llama ___.',opts:['homeostasis','metabolismo','sinapsis'],c:0},
];
let cmpIdx=0,cmpSel=-1,cmpDone=false;
function showCmp(){if(cmpIdx>=cmpData.length){document.getElementById('cmpSent').innerHTML='🎉 ¡Completado!';document.getElementById('cmpOpts').innerHTML='';fin('s-completa');return;}const d=cmpData[cmpIdx];document.getElementById('cmpProg').textContent=`Oración ${cmpIdx+1} de ${cmpData.length}`;document.getElementById('cmpSent').innerHTML=d.s.replace('___','<span class="blank">___</span>');const opts=document.getElementById('cmpOpts');opts.innerHTML='';cmpSel=-1;cmpDone=false;d.opts.forEach((o,i)=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=o;b.onclick=()=>{if(cmpDone)return;document.querySelectorAll('.cmp-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');cmpSel=i;sfx('click');};opts.appendChild(b);});}
function checkCmp(){if(cmpSel<0)return fb('fbCmp','Selecciona una opción.',false);cmpDone=true;const opts=document.querySelectorAll('.cmp-opt');if(cmpSel===cmpData[cmpIdx].c){opts[cmpSel].classList.add('correct');document.getElementById('cmpSent').innerHTML=cmpData[cmpIdx].s.replace('___',`<span class="blank" style="color:var(--jade);border-color:var(--jade)">${opts[cmpSel].textContent}</span>`);fb('fbCmp','¡Correcto! +5 XP',true);if(!xpTracker.cmp.has(cmpIdx)){xpTracker.cmp.add(cmpIdx);pts(5);}sfx('ok');}else{opts[cmpSel].classList.add('wrong');opts[cmpData[cmpIdx].c].classList.add('correct');fb('fbCmp','Incorrecto. Revisa bien la respuesta.',false);sfx('no');}setTimeout(()=>{cmpIdx++;document.getElementById('fbCmp').classList.remove('show');showCmp();},1600);}

// ===================== WIDGETS =====================
// Widget 1: Ordenar Ruta Hormonal
const routeSets=[
  {label:'Ruta de una Orden Hormonal',steps:['Hipotálamo','Hipófisis','Glándula diana (ej. tiroides)','Hormona en la sangre','Célula blanco','Respuesta del cuerpo']},
  {label:'Respuesta al Estrés',steps:['Situación de peligro','El hipotálamo se activa','Glándulas suprarrenales','Liberación de adrenalina','El corazón se acelera y el cuerpo se alerta']},
  {label:'Control del Azúcar (después de comer)',steps:['Sube la glucosa en la sangre','El páncreas lo detecta','Libera insulina','Las células captan la glucosa','La glucemia vuelve a la normalidad']},
];
let currentRouteIdx=0,routeItems=[];
function buildRoute(){routeItems=_shuffle([...routeSets[currentRouteIdx].steps]);renderRoute();const fbEl=document.getElementById('fbRoute');if(fbEl)fbEl.classList.remove('show');}
function renderRoute(){const list=document.getElementById('routeList');if(!list)return;list.innerHTML='';routeItems.forEach((step,i)=>{const div=document.createElement('div');div.className='sort-item';div.innerHTML=`<div class="sort-arrows"><button class="sort-arrow" onclick="routeMove(${i},-1)"${i===0?' disabled':''}>▲</button><button class="sort-arrow" onclick="routeMove(${i},1)"${i===routeItems.length-1?' disabled':''}>▼</button></div><div class="sort-step-num">${i+1}.</div><div class="sort-item-txt">${step}</div>`;list.appendChild(div);});}
function routeMove(idx,dir){sfx('click');const ni=idx+dir;if(ni<0||ni>=routeItems.length)return;[routeItems[idx],routeItems[ni]]=[routeItems[ni],routeItems[idx]];renderRoute();}
function checkRoute(){const correct=routeSets[currentRouteIdx].steps;const isOk=routeItems.every((s,i)=>s===correct[i]);if(isOk){fb('fbRoute','¡Perfecto! Orden correcto. +4 XP',true);if(!xpTracker.wgt.has('route_'+currentRouteIdx)){xpTracker.wgt.add('route_'+currentRouteIdx);pts(4);}sfx('fan');fin('s-widgets');unlockAchievement('widgets_master');}else{fb('fbRoute','Hay pasos fuera de orden. Revisa el arreglo.',false);sfx('no');}}
function nextRoute(){sfx('click');currentRouteIdx=(currentRouteIdx+1)%routeSets.length;buildRoute();showToast('🔄 Ruta: '+routeSets[currentRouteIdx].label);}

// Widget 2: Identifica la Glándula
const neuronPartes=[
  {desc:'Glándula maestra que dirige a todas las demás glándulas',ans:'Hipófisis',opts:['Hipófisis','Tiroides','Páncreas','Pineal']},
  {desc:'Regula el metabolismo mediante la hormona tiroxina',ans:'Tiroides',opts:['Tiroides','Suprarrenal','Hipófisis','Timo']},
  {desc:'Produce insulina y glucagón para controlar la glucosa',ans:'Páncreas',opts:['Hígado','Páncreas','Tiroides','Pineal']},
  {desc:'Libera adrenalina y cortisol ante el estrés o el peligro',ans:'Glándulas suprarrenales',opts:['Glándulas suprarrenales','Tiroides','Pineal','Paratiroides']},
  {desc:'Produce melatonina y regula el ciclo de sueño y vigilia',ans:'Glándula pineal',opts:['Glándula pineal','Hipófisis','Timo','Tiroides']},
  {desc:'Une el sistema nervioso con el sistema endocrino',ans:'Hipotálamo',opts:['Hipotálamo','Cerebelo','Páncreas','Tiroides']},
  {desc:'Madura los linfocitos T del sistema inmunitario',ans:'Timo',opts:['Timo','Tiroides','Suprarrenal','Hipófisis']},
  {desc:'Controla el nivel de calcio con la hormona paratiroidea',ans:'Paratiroides',opts:['Paratiroides','Páncreas','Pineal','Timo']},
];
let neuronIdx=0,neuronDone=false;
function showNeuron(){neuronDone=false;if(neuronIdx>=neuronPartes.length){const el=document.getElementById('neuronDesc');if(el)el.textContent='🎉 ¡Todas las glándulas identificadas!';const opts=document.getElementById('neuronOpts');if(opts)opts.innerHTML='';fin('s-widgets');return;}const d=neuronPartes[neuronIdx];const prog=document.getElementById('neuronProg');if(prog)prog.textContent=`Glándula ${neuronIdx+1} de ${neuronPartes.length}`;const desc=document.getElementById('neuronDesc');if(desc)desc.textContent=d.desc;const opts=document.getElementById('neuronOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=opt;b.onclick=()=>checkNeuron(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuron');if(fbEl)fbEl.classList.remove('show');}
function checkNeuron(opt,btn,d){if(neuronDone)return;neuronDone=true;document.querySelectorAll('#neuronOpts .cmp-opt').forEach(b=>{if(b.textContent===d.ans)b.classList.add('correct');else if(b===btn&&b.textContent!==d.ans)b.classList.add('wrong');});const isOk=opt===d.ans;if(isOk){fb('fbNeuron','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuron_'+neuronIdx)){xpTracker.wgt.add('neuron_'+neuronIdx);pts(3);}sfx('ok');}else{fb('fbNeuron','La respuesta correcta es: '+d.ans,false);sfx('no');}}
function nextNeuron(){sfx('click');neuronIdx++;showNeuron();}
function resetNeuron(){sfx('click');neuronIdx=0;showNeuron();}

// Widget 3: Hormona → Función
const neuroPairs=[
  {trans:'Insulina',func:'Baja el nivel de azúcar (glucosa) en la sangre',opts:['Baja el nivel de azúcar (glucosa) en la sangre','Sube el nivel de azúcar en la sangre','Regula el ciclo del sueño','Prepara el cuerpo ante el peligro']},
  {trans:'Glucagón',func:'Sube el nivel de azúcar en la sangre',opts:['Baja el nivel de azúcar (glucosa) en la sangre','Sube el nivel de azúcar en la sangre','Regula el metabolismo','Madura los linfocitos T']},
  {trans:'Tiroxina',func:'Regula el metabolismo y la energía del cuerpo',opts:['Regula el metabolismo y la energía del cuerpo','Baja el azúcar en la sangre','Regula el ciclo del sueño','Prepara el cuerpo ante el peligro']},
  {trans:'Adrenalina',func:'Prepara el cuerpo ante el peligro (lucha o huye)',opts:['Prepara el cuerpo ante el peligro (lucha o huye)','Regula el metabolismo','Baja el azúcar en la sangre','Regula el ciclo del sueño']},
  {trans:'Melatonina',func:'Regula el ciclo de sueño y vigilia',opts:['Regula el ciclo de sueño y vigilia','Sube el azúcar en la sangre','Prepara el cuerpo ante el peligro','Regula el metabolismo']},
];
let neuroIdx=0,neuroDone=false;
function showNeuro(){neuroDone=false;if(neuroIdx>=neuroPairs.length){const el=document.getElementById('neuroTrans');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('neuroOpts');if(opts)opts.innerHTML='';return;}const d=neuroPairs[neuroIdx];const prog=document.getElementById('neuroProg');if(prog)prog.textContent=`${neuroIdx+1} de ${neuroPairs.length}`;const trans=document.getElementById('neuroTrans');if(trans)trans.textContent=d.trans;const opts=document.getElementById('neuroOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkNeuro(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuro');if(fbEl)fbEl.classList.remove('show');}
function checkNeuro(opt,btn,d){if(neuroDone)return;neuroDone=true;document.querySelectorAll('#neuroOpts .qz-opt').forEach(b=>{if(b.textContent===d.func)b.classList.add('correct');else if(b===btn&&b.textContent!==d.func)b.classList.add('wrong');});const isOk=opt===d.func;if(isOk){fb('fbNeuro','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuro_'+neuroIdx)){xpTracker.wgt.add('neuro_'+neuroIdx);pts(3);}sfx('ok');}else{fb('fbNeuro','Correcto: '+d.func,false);sfx('no');}setTimeout(()=>{neuroIdx++;showNeuro();},1800);}
function resetNeuro(){sfx('click');neuroIdx=0;showNeuro();}

// Widget 4: Enfermedades Endocrinas → Característica
const enfermedadData=[
  {disease:'Diabetes',characteristic:'Falta o mal uso de la insulina; sube el azúcar en la sangre',opts:['Falta o mal uso de la insulina; sube el azúcar en la sangre','Exceso de tiroxina con nerviosismo','Exceso de hormona del crecimiento','Exceso de cortisol']},
  {disease:'Hipotiroidismo',characteristic:'Poca tiroxina; cansancio, frío y aumento de peso',opts:['Falta o mal uso de la insulina','Poca tiroxina; cansancio, frío y aumento de peso','Exceso de hormona del crecimiento','Descargas eléctricas en el cerebro']},
  {disease:'Hipertiroidismo',characteristic:'Exceso de tiroxina; nerviosismo, pérdida de peso y bocio',opts:['Poca tiroxina; cansancio y frío','Exceso de tiroxina; nerviosismo, pérdida de peso y bocio','Falta de insulina','Falta de hormona del crecimiento']},
  {disease:'Gigantismo',characteristic:'Exceso de hormona del crecimiento (GH) en la niñez',opts:['Exceso de hormona del crecimiento (GH) en la niñez','Falta de insulina','Exceso de melatonina','Poca tiroxina']},
  {disease:'Enanismo hipofisario',characteristic:'Falta de hormona del crecimiento (GH)',opts:['Falta de hormona del crecimiento (GH)','Exceso de cortisol','Falta de insulina','Exceso de tiroxina']},
  {disease:'Síndrome de Cushing',characteristic:'Exceso de cortisol; cara redonda y grasa en el tronco',opts:['Exceso de cortisol; cara redonda y grasa en el tronco','Falta de insulina','Poca tiroxina','Falta de hormona del crecimiento']},
];
let enferIdx=0,enferDone=false;
function showEnfer(){enferDone=false;if(enferIdx>=enfermedadData.length){const el=document.getElementById('enferDisease');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('enferOpts');if(opts)opts.innerHTML='';return;}const d=enfermedadData[enferIdx];const prog=document.getElementById('enferProg');if(prog)prog.textContent=`${enferIdx+1} de ${enfermedadData.length}`;const dis=document.getElementById('enferDisease');if(dis)dis.textContent=d.disease;const opts=document.getElementById('enferOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkEnfer(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbEnfer');if(fbEl)fbEl.classList.remove('show');}
function checkEnfer(opt,btn,d){if(enferDone)return;enferDone=true;document.querySelectorAll('#enferOpts .qz-opt').forEach(b=>{if(b.textContent===d.characteristic)b.classList.add('correct');else if(b===btn&&b.textContent!==d.characteristic)b.classList.add('wrong');});const isOk=opt===d.characteristic;if(isOk){fb('fbEnfer','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('enfer_'+enferIdx)){xpTracker.wgt.add('enfer_'+enferIdx);pts(3);}sfx('ok');}else{fb('fbEnfer','Correcto: '+d.characteristic,false);sfx('no');}setTimeout(()=>{enferIdx++;showEnfer();},1800);}
function resetEnfer(){sfx('click');enferIdx=0;showEnfer();}

// ===================== RETO FINAL =====================
const retoPairs=[
  {label:['Endocrina','Exocrina'],btnA:'⚗️ Endocrina',btnB:'💧 Exocrina',colA:'endo',colB:'exo',
   words:[{w:'Tiroides',t:'endo'},{w:'G. sudorípara',t:'exo'},{w:'Hipófisis',t:'endo'},{w:'G. salival',t:'exo'},{w:'Páncreas',t:'endo'},{w:'G. lagrimal',t:'exo'},{w:'Suprarrenal',t:'endo'},{w:'G. sebácea',t:'exo'},{w:'G. pineal',t:'endo'},{w:'G. mamaria',t:'exo'}]},
  {label:['Nervioso','Endocrino'],btnA:'🧠 Nervioso',btnB:'⚗️ Endocrino',colA:'ner',colB:'end',
   words:[{w:'Impulso eléctrico',t:'ner'},{w:'Hormonas',t:'end'},{w:'Neuronas',t:'ner'},{w:'Sangre',t:'end'},{w:'Respuesta rápida',t:'ner'},{w:'Respuesta lenta',t:'end'},{w:'Efecto breve',t:'ner'},{w:'Efecto duradero',t:'end'},{w:'Nervios',t:'ner'},{w:'Glándulas',t:'end'}]},
  {label:['Sube glucosa','Baja glucosa'],btnA:'⬆️ Sube glucosa',btnB:'⬇️ Baja glucosa',colA:'sube',colB:'baja',
   words:[{w:'Glucagón',t:'sube'},{w:'Insulina',t:'baja'},{w:'En ayuno',t:'sube'},{w:'Después de comer',t:'baja'},{w:'Libera azúcar',t:'sube'},{w:'Guarda azúcar',t:'baja'},{w:'Adrenalina',t:'sube'},{w:'Almacena glucógeno',t:'baja'},{w:'Aumenta glucemia',t:'sube'},{w:'Reduce glucemia',t:'baja'}]},
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
  {s:'El sistema endocrino usa hormonas transportadas por la sangre para controlar el cuerpo, en lugar de impulsos eléctricos.',type:'Sistema endocrino: control químico'},
  {s:'La hipófisis, ubicada bajo el cerebro, es la glándula maestra que dirige a todas las demás glándulas del cuerpo.',type:'Hipófisis: glándula maestra'},
  {s:'La tiroides regula el metabolismo con la tiroxina. Necesita yodo; su falta produce bocio.',type:'Tiroides y tiroxina'},
  {s:'El páncreas controla el azúcar en la sangre: la insulina la baja y el glucagón la sube.',type:'Páncreas: insulina y glucagón'},
  {s:'La adrenalina, producida por las suprarrenales, prepara el cuerpo ante el peligro (lucha o huye).',type:'Adrenalina y respuesta al estrés'},
  {s:'El hipotálamo une el sistema nervioso con el endocrino y controla a la hipófisis.',type:'Hipotálamo: puente neuroendocrino'},
  {s:'La melatonina de la glándula pineal regula el ciclo de sueño y vigilia.',type:'Melatonina y el sueño'},
  {s:'La diabetes es una enfermedad causada por falta o mal uso de la insulina, que sube el azúcar en la sangre.',type:'Diabetes: falla de la insulina'},
  {s:'La retroalimentación negativa mantiene la homeostasis: cuando hay suficiente hormona, la glándula deja de producir más.',type:'Retroalimentación y homeostasis'},
  {s:'Las glándulas endocrinas liberan hormonas a la sangre sin conductos; las exocrinas usan conductos (sudor, saliva).',type:'Endocrina vs exocrina'},
];
const classifyTaskDB=[
  {w:'Hipófisis',gen:'Glándula endocrina',n:'Bajo el cerebro',g:'Glándula maestra',t:'Dirige a las demás glándulas; produce GH'},
  {w:'Tiroides',gen:'Glándula endocrina',n:'En el cuello',g:'Metabolismo',t:'Produce tiroxina; regula la energía del cuerpo'},
  {w:'Páncreas',gen:'Glándula mixta',n:'En el abdomen',g:'Control de glucosa',t:'Produce insulina y glucagón'},
  {w:'Suprarrenales',gen:'Glándula endocrina',n:'Sobre los riñones',g:'Estrés',t:'Producen adrenalina y cortisol'},
  {w:'Glándula pineal',gen:'Glándula endocrina',n:'En el cerebro',g:'Ciclo del sueño',t:'Produce melatonina'},
  {w:'Insulina',gen:'Hormona',n:'Del páncreas',g:'Baja la glucosa',t:'Ordena a las células captar el azúcar'},
  {w:'Adrenalina',gen:'Hormona',n:'De las suprarrenales',g:'Lucha o huye',t:'Prepara el cuerpo ante el peligro'},
  {w:'Homeostasis',gen:'Proceso',n:'En todo el cuerpo',g:'Equilibrio interno',t:'Mantiene estables las variables del organismo'},
];
const completeTaskDB=[
  {s:'La ___ es la hormona que baja el azúcar en la sangre.',opts:['glucagón','insulina','tiroxina'],ans:'insulina'},
  {s:'La glándula maestra del sistema endocrino es la ___.',opts:['tiroides','hipófisis','pineal'],ans:'hipófisis'},
  {s:'La ___ regula el metabolismo mediante la tiroxina.',opts:['suprarrenal','tiroides','pineal'],ans:'tiroides'},
  {s:'Las hormonas viajan por la ___ hasta las células blanco.',opts:['linfa','sangre','saliva'],ans:'sangre'},
  {s:'La ___ prepara el cuerpo ante el peligro (lucha o huye).',opts:['melatonina','adrenalina','insulina'],ans:'adrenalina'},
  {s:'La enfermedad por falta o mal uso de la insulina es la ___.',opts:['bocio','diabetes','cushing'],ans:'diabetes'},
  {s:'El ___ une el sistema nervioso con el endocrino.',opts:['cerebelo','hipotálamo','timo'],ans:'hipotálamo'},
  {s:'El equilibrio interno del cuerpo se llama ___.',opts:['metabolismo','homeostasis','digestión'],ans:'homeostasis'},
];
const explainQuestions=[
  {q:'¿Qué es el sistema endocrino y en qué se diferencia del sistema nervioso?',ans:'El sistema endocrino controla el cuerpo con hormonas que viajan por la sangre; el nervioso usa impulsos eléctricos por las neuronas. El endocrino es lento y duradero; el nervioso es rápido y breve. Ambos mantienen el equilibrio (homeostasis).'},
  {q:'¿Cómo se coordinan el sistema nervioso y el endocrino? Menciona al hipotálamo.',ans:'El hipotálamo es el puente: recibe señales nerviosas y las convierte en órdenes hormonales que envía a la hipófisis. Por eso se habla del sistema neuroendocrino. Ejemplo: ante un susto, el nervioso reacciona y ordena liberar adrenalina.'},
  {q:'¿Cómo controla el páncreas el azúcar en la sangre?',ans:'Cuando la glucosa sube (tras comer), el páncreas libera insulina, que ordena a las células captar y guardar el azúcar, bajando la glucemia. En el ayuno libera glucagón, que sube la glucosa. Es un ejemplo de retroalimentación y homeostasis.'},
  {q:'Menciona tres glándulas endocrinas y la hormona principal de cada una.',ans:'Tiroides → tiroxina (metabolismo). Páncreas → insulina y glucagón (glucosa). Suprarrenales → adrenalina y cortisol (estrés). También: hipófisis → GH (crecimiento); pineal → melatonina (sueño).'},
  {q:'¿Por qué es importante cuidar el sistema endocrino? Menciona cuatro hábitos.',ans:'Alimentación balanceada y baja en azúcar, consumir sal yodada (previene el bocio), hacer ejercicio (regula la insulina), dormir 8–9 h (equilibra melatonina y cortisol), manejar el estrés y evitar la automedicación hormonal.'},
];
let ansVisible=false;
function genTask(){sfx('click');const type=document.getElementById('tgType').value;const count=parseInt(document.getElementById('tgCount').value);ansVisible=false;const out=document.getElementById('tgOut');out.innerHTML='';if(type==='identify')genIdentifyTask(out,count);else if(type==='classify')genClassifyTask(out,count);else if(type==='complete')genCompleteTask(out,count);else if(type==='explain')genExplainTask(out,count);fin('s-tareas');}
function _instrBlock(out,title,lines){const ib=document.createElement('div');ib.className='tg-instruction-block';ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join('');out.appendChild(ib);}
function genIdentifyTask(out,count){_instrBlock(out,'Instrucción',['Copia en tu cuaderno; subraya, colorea o encierra el concepto del sistema endocrino indicado en cada oración. Escribe al lado qué tipo de elemento es.','<strong>Ejemplo:</strong> La insulina baja el azúcar. → <span style="color:var(--jade);font-weight:700;">Hormona del páncreas</span>']);_pick(identifyTaskDB,Math.min(count,identifyTaskDB.length)).forEach((item,i)=>{const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.type}</div></div>`;out.appendChild(div);});}
function genClassifyTask(out,count){_instrBlock(out,'Instrucción',['Copia la siguiente tabla en tu cuaderno. Para cada elemento del sistema endocrino, completa su tipo, características, categoría y función.']);const items=_pick(classifyTaskDB,Math.min(count,classifyTaskDB.length));const wrap=document.createElement('div');wrap.style.overflowX='auto';const th=(t,extra='')=>`<th style="padding:0.3rem 0.4rem;border:1px solid var(--border);font-size:0.72rem;text-align:center;${extra}">${t}</th>`;let html=`<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:520px;"><thead><tr style="background:var(--pri-gl);">${th('Elemento','text-align:left;')}${th('Tipo')}${th('Características')}${th('Categoría')}${th('Función')}</tr></thead><tbody>`;items.forEach(it=>{html+=`<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td>`+Array(4).fill(`<td style="padding:0.4rem;border:1px solid var(--border);min-width:50px;"></td>`).join('')+'</tr>';});html+='</tbody></table>';wrap.innerHTML=html;out.appendChild(wrap);const ans=document.createElement('div');ans.className='tg-answer';ans.style.marginTop='0.8rem';ans.innerHTML='<strong>✅ Respuestas:</strong><br>'+items.map(it=>`<strong>${it.w}:</strong> Tipo: ${it.gen} | Características: ${it.n} | Categoría: ${it.g} | Función: ${it.t}`).join('<br>');out.appendChild(ans);}
function genCompleteTask(out,count){_instrBlock(out,'Instrucción',['Copia y resuelve en tu cuaderno. Cada oración tiene un espacio ___. Elige y escribe la opción correcta.']);const pool=_shuffle([...completeTaskDB]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';const sent=item.s.replace('___','<span class="tg-blank" style="min-width:90px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${sent}</strong><div style="margin-top:0.4rem;font-size:0.82rem;color:var(--gray);">📝 Opciones: <strong>${item.opts.join(' | ')}</strong></div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function genExplainTask(out,count){_instrBlock(out,'Instrucción',['Copia las siguientes preguntas en tu cuaderno y responde cada una de forma clara y completa.']);const pool=_shuffle([...explainQuestions]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.3rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function toggleAns(){ansVisible=!ansVisible;document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none');sfx('click');}

// ===================== SOPA DE LETRAS =====================
const sopaSets=[
  {size:10,grid:[
    ['H','O','R','M','O','N','A','X','Y','Z'],
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['T','I','R','O','I','D','E','S','K','L'],
    ['Z','X','C','V','B','N','M','A','S','D'],
    ['I','N','S','U','L','I','N','A','F','G'],
    ['P','L','M','O','K','N','J','I','B','H'],
    ['P','A','N','C','R','E','A','S','T','U'],
    ['G','Y','H','N','U','J','M','I','K','O'],
    ['G','L','A','N','D','U','L','A','R','E'],
    ['H','I','P','O','F','I','S','I','S','W']
  ],words:[
    {w:'HORMONA',cells:[[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6]]},
    {w:'TIROIDES',cells:[[2,0],[2,1],[2,2],[2,3],[2,4],[2,5],[2,6],[2,7]]},
    {w:'INSULINA',cells:[[4,0],[4,1],[4,2],[4,3],[4,4],[4,5],[4,6],[4,7]]},
    {w:'PANCREAS',cells:[[6,0],[6,1],[6,2],[6,3],[6,4],[6,5],[6,6],[6,7]]},
    {w:'GLANDULA',cells:[[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,6],[8,7]]},
    {w:'HIPOFISIS',cells:[[9,0],[9,1],[9,2],[9,3],[9,4],[9,5],[9,6],[9,7],[9,8]]}
  ]},
  {size:10,grid:[
    ['M','E','L','A','T','O','N','I','N','A'],
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['H','I','P','O','T','A','L','A','M','O'],
    ['Z','X','C','V','B','N','M','K','L','J'],
    ['A','D','R','E','N','A','L','I','N','A'],
    ['P','O','I','U','Y','T','R','E','W','Q'],
    ['C','O','R','T','I','S','O','L','X','Y'],
    ['M','N','B','V','C','X','Z','A','S','D'],
    ['T','I','R','O','X','I','N','A','K','L'],
    ['G','L','U','C','A','G','O','N','M','P']
  ],words:[
    {w:'MELATONINA',cells:[[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[0,9]]},
    {w:'HIPOTALAMO',cells:[[2,0],[2,1],[2,2],[2,3],[2,4],[2,5],[2,6],[2,7],[2,8],[2,9]]},
    {w:'ADRENALINA',cells:[[4,0],[4,1],[4,2],[4,3],[4,4],[4,5],[4,6],[4,7],[4,8],[4,9]]},
    {w:'CORTISOL',cells:[[6,0],[6,1],[6,2],[6,3],[6,4],[6,5],[6,6],[6,7]]},
    {w:'TIROXINA',cells:[[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,6],[8,7]]},
    {w:'GLUCAGON',cells:[[9,0],[9,1],[9,2],[9,3],[9,4],[9,5],[9,6],[9,7]]}
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
  {q:'El sistema endocrino usa hormonas que viajan por la sangre.',a:true},
  {q:'La insulina sube el nivel de azúcar en la sangre.',a:false},
  {q:'La hipófisis es la glándula maestra del sistema endocrino.',a:true},
  {q:'La tiroides regula el metabolismo mediante la tiroxina.',a:true},
  {q:'Las glándulas exocrinas liberan hormonas directamente a la sangre.',a:false},
  {q:'El glucagón sube el nivel de azúcar en la sangre.',a:true},
  {q:'El hipotálamo une el sistema nervioso con el sistema endocrino.',a:true},
  {q:'La adrenalina prepara el cuerpo ante el peligro (lucha o huye).',a:true},
  {q:'La melatonina regula el metabolismo del cuerpo.',a:false},
  {q:'La diabetes se produce por falta o mal uso de la insulina.',a:true},
  {q:'El sistema endocrino responde más rápido que el sistema nervioso.',a:false},
  {q:'La homeostasis es el equilibrio interno que mantiene el cuerpo.',a:true},
  {q:'El páncreas produce insulina y glucagón.',a:true},
  {q:'La falta de yodo puede provocar bocio en la tiroides.',a:true},
  {q:'El cortisol es la hormona que regula el ciclo del sueño.',a:false},
];
const evalMCBank=[
  {q:'¿Qué mensajero químico usa el sistema endocrino?',o:['a) Impulso eléctrico','b) Neurotransmisor','c) Hormona','d) Enzima'],a:2},
  {q:'¿Cuál es la glándula maestra?',o:['a) Tiroides','b) Hipófisis','c) Páncreas','d) Pineal'],a:1},
  {q:'¿Qué hormona baja el azúcar en la sangre?',o:['a) Glucagón','b) Adrenalina','c) Insulina','d) Cortisol'],a:2},
  {q:'¿Qué glándula regula el metabolismo con la tiroxina?',o:['a) Suprarrenal','b) Tiroides','c) Timo','d) Hipófisis'],a:1},
  {q:'¿Por dónde viajan las hormonas?',o:['a) Nervios','b) Linfa','c) Sangre','d) Médula'],a:2},
  {q:'¿Qué estructura une el sistema nervioso y el endocrino?',o:['a) Cerebelo','b) Hipotálamo','c) Timo','d) Médula'],a:1},
  {q:'¿Qué hormona prepara el cuerpo ante el peligro?',o:['a) Melatonina','b) Insulina','c) Tiroxina','d) Adrenalina'],a:3},
  {q:'¿Cómo se llama el equilibrio interno del cuerpo?',o:['a) Metabolismo','b) Homeostasis','c) Sinapsis','d) Digestión'],a:1},
  {q:'¿Qué enfermedad causa la falta o mal uso de la insulina?',o:['a) Bocio','b) Gigantismo','c) Diabetes','d) Cushing'],a:2},
  {q:'¿Qué hormona sube el azúcar en la sangre durante el ayuno?',o:['a) Insulina','b) Glucagón','c) Melatonina','d) Tiroxina'],a:1},
  {q:'¿Qué glándula produce melatonina?',o:['a) Pineal','b) Tiroides','c) Suprarrenal','d) Hipófisis'],a:0},
  {q:'¿Qué diferencia al sistema endocrino del nervioso?',o:['a) Es más rápido','b) Usa impulsos eléctricos','c) Es lento y duradero','d) No usa la sangre'],a:2},
  {q:'¿Qué glándulas producen adrenalina y cortisol?',o:['a) Tiroides','b) Suprarrenales','c) Pineal','d) Paratiroides'],a:1},
  {q:'¿Qué mineral necesita la tiroides para producir tiroxina?',o:['a) Hierro','b) Calcio','c) Yodo','d) Sodio'],a:2},
  {q:'¿Cómo libera sus hormonas una glándula endocrina?',o:['a) Por conductos','b) Directo a la sangre','c) Por la saliva','d) Por el sudor'],a:1},
];
const evalCPBank=[
  {q:'La ___ es la hormona que baja el azúcar en la sangre.',a:'insulina'},
  {q:'La glándula maestra del sistema endocrino es la ___.',a:'hipófisis'},
  {q:'La tiroides regula el metabolismo mediante la ___.',a:'tiroxina'},
  {q:'Las hormonas viajan por el cuerpo a través de la ___.',a:'sangre'},
  {q:'El ___ une el sistema nervioso con el sistema endocrino.',a:'hipotálamo'},
  {q:'La ___ prepara el cuerpo ante el peligro (lucha o huye).',a:'adrenalina'},
  {q:'El equilibrio interno del cuerpo se llama ___.',a:'homeostasis'},
  {q:'La enfermedad por falta o mal uso de la insulina es la ___.',a:'diabetes'},
  {q:'El ___ sube el azúcar en la sangre durante el ayuno.',a:'glucagón'},
  {q:'La hormona ___ regula el ciclo de sueño y vigilia.',a:'melatonina'},
  {q:'La falta de yodo en la dieta puede causar ___ en la tiroides.',a:'bocio'},
  {q:'Las glándulas ___ producen adrenalina y cortisol.',a:'suprarrenales'},
  {q:'El ___ produce insulina y glucagón para controlar la glucosa.',a:'páncreas'},
  {q:'El mecanismo por el que una hormona frena su propia producción es la ___ negativa.',a:'retroalimentación'},
  {q:'La hormona del crecimiento (GH) es producida por la ___.',a:'hipófisis'},
];
const evalPRBank=[
  {term:'Hormona',def:'Mensajero químico que viaja por la sangre'},
  {term:'Hipófisis',def:'Glándula maestra que dirige a las demás'},
  {term:'Tiroides',def:'Regula el metabolismo con la tiroxina'},
  {term:'Insulina',def:'Hormona que baja el azúcar en la sangre'},
  {term:'Glucagón',def:'Hormona que sube el azúcar en la sangre'},
  {term:'Adrenalina',def:'Prepara el cuerpo ante el peligro (lucha o huye)'},
  {term:'Melatonina',def:'Regula el ciclo de sueño y vigilia'},
  {term:'Páncreas',def:'Glándula que produce insulina y glucagón'},
  {term:'Hipotálamo',def:'Une el sistema nervioso con el endocrino'},
  {term:'Homeostasis',def:'Equilibrio interno que mantiene el cuerpo'},
  {term:'Cortisol',def:'Hormona del estrés de las suprarrenales'},
  {term:'Diabetes',def:'Enfermedad por falta o mal uso de la insulina'},
  {term:'Glándula exocrina',def:'Libera sustancias por conductos, sin hormonas'},
  {term:'Bocio',def:'Agrandamiento de la tiroides por falta de yodo'},
  {term:'Retroalimentación',def:'Mecanismo que frena la producción de hormona'},
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

function genEval(){sfx('click');_evalFormaSelector(); const _selF = document.getElementById('evalFormaSel'); if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10))); const cf = evalFormNum; const rng = _evalRng(cf); /* la Forma cf siembra TODO el azar de esta evaluación */window._currentEvalForm=cf;evalFormNum = (evalFormNum % EVAL_FORMAS) + 1; _evalFormaSelector();saveProgress();document.getElementById('eval-screen-title').textContent=`🎓 Evaluación Final · Forma ${cf} · El Sistema Endocrino`;evalAnsVisible=false;const out=document.getElementById('evalOut');out.innerHTML='';const bar=document.createElement('div');bar.className='eval-score-bar';bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje · 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25 pts</span><span class="eval-score-pill esp-tf">V/F 25 pts</span><span class="eval-score-pill esp-mc">Selección 25 pts</span><span class="eval-score-pill esp-pr">Pareados 25 pts</span></div>`;out.appendChild(bar);const cpItems=_pickF(evalCPBank,5, rng);const s1=document.createElement('div');s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';cpItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='cp';d.dataset.evalIndex=i;const qHtml=item.q.replace('___',`<input class="eval-cp-input" type="text" data-cp="${i}" autocomplete="off">`);d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbCp${i}" aria-live="polite"></div>`;s1.appendChild(d);});out.appendChild(s1);const tfItems=_pickF(evalTFBank,5, rng);const s2=document.createElement('div');s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';tfItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='tf';d.dataset.evalIndex=i;d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="true"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="false"> Falso</label></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbTf${i}" aria-live="polite"></div>`;s2.appendChild(d);});out.appendChild(s2);const mcItems=_pickF(evalMCBank,5, rng);const s3=document.createElement('div');s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';mcItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='mc';d.dataset.evalIndex=i;const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join('');d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbMc${i}" aria-live="polite"></div>`;s3.appendChild(d);});out.appendChild(s3);const prItems=_pickF(evalPRBank,5, rng);const shuffledDefs=_shuffleF(prItems, rng);const letters=['A','B','C','D','E'];const s4=document.createElement('div');s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';const matchCard=document.createElement('div');matchCard.className='eval-item';let colLeft='<div class="eval-match-col"><h4>📌 Términos</h4>';prItems.forEach((item,i)=>{colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> <select class="eval-match-select" data-pr="${i}" aria-label="Respuesta pareada ${i+16}"><option value="">—</option>${letters.map(l=>`<option value="${l}">${l}</option>`).join('')}</select> ${item.term}</div>`;});colLeft+='</div>';let colRight='<div class="eval-match-col"><h4>🔑 Definiciones</h4>';shuffledDefs.forEach((item,i)=>{colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`;});colRight+='</div>';const ansKey=prItems.map((item,i)=>{const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)];return`${i+16}→${letter}`;}).join(' · ');matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div><div class="eval-item-feedback" id="evalFbPr" aria-live="polite"></div>`;s4.appendChild(matchCard);out.appendChild(s4);window._evalPrintData={tf:tfItems,mc:mcItems,cp:cpItems,pr:{terms:prItems,shuffledDefs,letters}};const autoPanel=document.createElement('div');autoPanel.id='evalAutoResult';autoPanel.className='eval-auto-result';autoPanel.innerHTML='<strong>🧮 Evaluación interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato original sin respuestas digitadas.';out.appendChild(autoPanel);fin('s-evaluacion');}
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación El Sistema Endocrino · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.12rem 0.4rem;margin:0.22rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #27ae60;background:#e8f8f5;color:#27ae60;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#27ae60;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #27ae60;height:12px;}.obt-pct{white-space:nowrap;}.qn{font-weight:700;min-width:22px;flex-shrink:0;}.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:40px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.18rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.14rem 0.35rem;margin-bottom:0.1rem;break-inside:avoid;page-break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.3;display:flex;gap:0.28rem;margin-bottom:0.07rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.1rem 0.5rem;}.mc-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:0.04rem 0.15rem;margin-left:0.8rem;}.mc-opt{font-size:9pt;display:flex;align-items:center;gap:0.15rem;}.mc-opt input{width:10px;height:10px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{margin-top:0.1rem;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.08rem 0.4rem;margin-top:0.08rem;}.pr-head{font-size:9pt;font-weight:700;color:#555;margin-bottom:0.1rem;}.pr-item{font-size:10.5pt;padding:0.1rem 0.28rem;background:#e8f8f5;border-radius:3px;margin-bottom:0.07rem;display:flex;align-items:center;gap:0.2rem;line-height:1.2;break-inside:avoid;page-break-inside:avoid;}.pr-num{font-weight:700;color:#27ae60;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.22rem;padding:0.15rem 0;page-break-before:avoid;break-before:avoid;color:#27ae60;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #27ae60;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#555;}.pa{color:#007a00;font-weight:600;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · El Sistema Endocrino · Educación Básica · Ciencias Naturales</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Evaluación Final · El Sistema Endocrino · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u</div></div><div class="p-grid">${pR}</div>
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
  {txt:'Ana se come un gran pedazo de pastel muy dulce. Un rato después, su nivel de azúcar en la sangre, que había subido bastante, vuelve por sí solo a la normalidad sin que ella haga nada conscientemente.'},
  {txt:'Luis toma un vaso grande de jugo azucarado. Al poco tiempo, la glucosa en su sangre, que se había elevado, regresa sola a su valor normal.'},
  {txt:'Después del almuerzo, a Sofía le sube el azúcar en la sangre; en las horas siguientes su cuerpo la regula hasta dejarla en un nivel normal.'},
  {txt:'Mario desayuna cereal con mucha azúcar. Su glucemia se dispara, pero pasado un tiempo su organismo la hace descender hasta la normalidad.'},
  {txt:'Una persona come varios dulces seguidos y su azúcar en sangre sube; poco después su cuerpo la equilibra de nuevo sin ayuda externa.'},
  {txt:'Tras merendar pan y refresco, a Carla le sube la glucosa, pero su cuerpo la vuelve a bajar hasta un nivel estable en un par de horas.'},
];
const critCaseQuestions=[
  '1. Explica qué ocurrió en su sistema endocrino desde que subió el azúcar hasta que volvió a la normalidad.',
  '2. ¿Qué glándula y qué hormona fueron las principales responsables de esta respuesta?',
  '3. ¿Por qué este efecto es más lento y duradero que una reacción del sistema nervioso?',
  '4. ¿Qué pasaría si esa glándula no produjera bien esa hormona?',
];
const critCaseGuides=[
  'Al subir la glucosa tras comer, el páncreas lo detecta y libera insulina; la insulina ordena a las células captar y almacenar el azúcar, por lo que la glucemia baja hasta lo normal. Es un ejemplo de homeostasis por retroalimentación negativa.',
  'La glándula es el páncreas (islotes de Langerhans) y la hormona es la insulina, que baja el azúcar. En el ayuno actuaría la hormona contraria, el glucagón, que lo sube.',
  'Porque es una respuesta hormonal: la insulina viaja por la sangre y actúa sobre muchas células del cuerpo, así que su efecto es más lento y prolongado que un impulso nervioso, que es rápido y breve.',
  'Si el páncreas no produjera insulina o el cuerpo no la usara bien, la glucosa quedaría alta en la sangre. Eso es justamente lo que ocurre en la diabetes.',
];

const critErrorBank=[
  {txt:'"El sistema endocrino envía mensajes eléctricos por los nervios y produce respuestas muy rápidas y de corta duración."',
   g1:'El sistema endocrino usa mensajeros químicos (hormonas) transportados por la sangre, no impulsos eléctricos por los nervios.',
   g2:'Sus respuestas son lentas y duraderas; las rápidas y breves son las del sistema nervioso.'},
  {txt:'"La insulina sube el nivel de azúcar en la sangre, y el glucagón lo baja."',
   g1:'La insulina baja la glucosa, ordenando a las células que la capten y guarden.',
   g2:'El glucagón sube la glucosa, liberándola a la sangre; las funciones están invertidas.'},
  {txt:'"La tiroides es la glándula maestra que controla a todas las demás, y la hipófisis regula el metabolismo con la tiroxina."',
   g1:'La glándula maestra es la hipófisis, no la tiroides.',
   g2:'La que regula el metabolismo con la tiroxina es la tiroides, no la hipófisis.'},
  {txt:'"Las glándulas endocrinas liberan sus hormonas a través de conductos, igual que las glándulas sudoríparas."',
   g1:'Las glándulas endocrinas liberan las hormonas directamente a la sangre, sin conductos.',
   g2:'Las que usan conductos son las exocrinas (como las sudoríparas), y esas no producen hormonas.'},
  {txt:'"La adrenalina es producida por la tiroides y sirve para regular el sueño durante la noche."',
   g1:'La adrenalina la producen las glándulas suprarrenales, no la tiroides.',
   g2:'La adrenalina prepara el cuerpo ante el peligro; la que regula el sueño es la melatonina (glándula pineal).'},
  {txt:'"La diabetes se produce por exceso de tiroxina, y el bocio por falta de insulina."',
   g1:'La diabetes se debe a la falta o mal uso de la insulina, no al exceso de tiroxina.',
   g2:'El bocio se relaciona con problemas de la tiroides y la falta de yodo, no con la insulina.'},
];

const critDecisionBank=[
  'Un estudiante consume muchos dulces y refrescos todos los días, casi no hace ejercicio y ha subido de peso rápidamente. En un chequeo le dicen que tiene riesgo de diabetes.',
  'Una persona vive con mucho estrés, duerme muy pocas horas y siempre está cansada, irritable y con las defensas bajas.',
  'Una joven casi no consume sal yodada ni alimentos variados y ha notado su cuello un poco inflamado, con cansancio y frío frecuente.',
  'Un joven usa el celular hasta muy tarde todas las noches, duerme pocas horas y le cuesta mucho conciliar el sueño.',
  'Una persona se automedica con hormonas sin control médico para "verse mejor" y ha presentado cambios de humor y molestias.',
];
const critDecisionGuide='Debe proponer 3 cambios concretos relacionados con el cuidado del sistema endocrino (alimentación balanceada y baja en azúcar, consumir sal yodada, hacer ejercicio, dormir 8–9 h, manejar el estrés, evitar la automedicación hormonal, hacerse chequeos médicos) y explicar con sus palabras por qué cada cambio ayuda al equilibrio hormonal (homeostasis).';

const critCompareBank=[
  {a:'Una persona siempre tiene frío, se siente muy cansada, sube de peso y su ritmo corporal es lento.',b:'Una persona está nerviosa, pierde peso, suda mucho y su corazón late muy rápido.',
   ga:'Hipotiroidismo — hay poca tiroxina, por lo que el metabolismo va lento.',
   gb:'Hipertiroidismo — hay exceso de tiroxina, por lo que el metabolismo va acelerado.',
   gr:'No son el mismo problema: uno se debe a la falta de hormona tiroidea y el otro a su exceso; producen efectos opuestos en el metabolismo.'},
  {a:'Una persona orina mucho, tiene mucha sed y su azúcar en la sangre está muy alta.',b:'Un niño crece muchísimo más que los demás debido a un exceso de hormona del crecimiento.',
   ga:'Diabetes — falta o mal uso de la insulina, con azúcar alta en la sangre.',
   gb:'Gigantismo — exceso de hormona del crecimiento (GH) producida por la hipófisis.',
   gr:'No son el mismo problema: uno afecta el control del azúcar (páncreas/insulina) y el otro el crecimiento (hipófisis/GH).'},
  {a:'Un niño no crece lo suficiente porque le falta hormona del crecimiento.',b:'Un adulto tiene la cara redonda, grasa en el tronco y debilidad por un exceso de cortisol.',
   ga:'Enanismo hipofisario — falta de hormona del crecimiento (GH).',
   gb:'Síndrome de Cushing — exceso de cortisol producido por las suprarrenales.',
   gr:'No son el mismo problema: uno es por falta de GH y el otro por exceso de cortisol; intervienen glándulas y hormonas distintas.'},
  {a:'Después de comer, a una persona no le baja el azúcar porque su cuerpo no usa bien la insulina.',b:'Una persona tiene el cuello inflamado (bocio) por falta de yodo en su alimentación.',
   ga:'Diabetes tipo 2 — el cuerpo no responde bien a la insulina (resistencia).',
   gb:'Bocio — la tiroides se agranda por falta de yodo para producir tiroxina.',
   gr:'No son el mismo problema: uno afecta el control de la glucosa (insulina) y el otro la producción de hormona tiroidea (tiroides/yodo).'},
];

const critCauseBank=[
  {cause:'Una persona come muchos dulces y su páncreas no logra usar bien la insulina.',guide:'La glucosa se acumula en la sangre y, con el tiempo, puede desarrollar diabetes.'},
  {cause:'Una persona no consume sal yodada ni alimentos con yodo.',guide:'La tiroides no fabrica suficiente tiroxina y puede aparecer bocio (agrandamiento de la tiroides).'},
  {cause:'Una persona vive con estrés constante durante mucho tiempo.',guide:'Sus glándulas suprarrenales liberan cortisol de forma prolongada, lo que afecta el sueño, el ánimo y las defensas.'},
  {cause:'Una persona usa pantallas hasta muy tarde y duerme muy poco.',guide:'Se altera la producción de melatonina y se desregula el ciclo de sueño y vigilia.'},
];
const critEffectBank=[
  {effect:'Tiene mucha sed, orina con frecuencia y su azúcar en sangre está alta.',guide:'Falta o mal uso de la insulina, como ocurre en la diabetes.'},
  {effect:'Siempre tiene frío, está cansada y su metabolismo es lento.',guide:'Poca producción de tiroxina por la tiroides (hipotiroidismo).'},
  {effect:'Un niño crece exageradamente más que los demás.',guide:'Exceso de hormona del crecimiento (GH) de la hipófisis (gigantismo).'},
  {effect:'Ante un susto, el corazón se acelera y el cuerpo se pone alerta.',guide:'Liberación de adrenalina por las glándulas suprarrenales.'},
];

function genEvalCrit(){
  sfx('click');
  _injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });
  const _sC = document.getElementById('evalCritFormaSel');
  if (_sC && parseInt(_sC.value, 10)) evalCritFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sC.value, 10)));
  const cf=evalCritFormNum;window._currentEvalCritForm=cf;const rngC = _evalRng(200000 + cf); /* la Forma cf siembra TODO el azar de esta prueba */ evalCritFormNum=(evalCritFormNum%EVAL_FORMAS)+1;_injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });saveProgress();
  document.getElementById('evalcrit-screen-title').textContent=`🧠 Pensamiento Crítico · Forma ${cf} · El Sistema Endocrino`;
  evalCritAnsVisible=false;
  const out=document.getElementById('evalCritOut');out.innerHTML='';

  const kase=_pickF(critCaseBank,1,rngC)[0];
  const s1=document.createElement('div');
  s1.innerHTML=`<div class="eval-section-title">I. Caso de análisis: la regulación del azúcar <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${kase.txt}</div>${critCaseQuestions.map((q,i)=>`<div class="crit-q-block"><div class="crit-q-label">${q}</div><textarea class="crit-textarea" rows="2" aria-label="${q}"></textarea><div class="crit-pauta">${critCaseGuides[i]}</div></div>`).join('')}<div class="crit-selfscore"><label for="critScore0">Obtenido:</label><input type="number" id="critScore0" class="crit-score-input" data-score="0" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s1);

  const err=_pickF(critErrorBank,1,rngC)[0];
  const s2=document.createElement('div');
  s2.innerHTML=`<div class="eval-section-title">II. Corrige el error <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${err.txt}</div><p style="font-size:0.85rem;margin-bottom:0.5rem;">Identifica <strong>dos errores</strong> y corrígelos con tus propias palabras:</p><div class="crit-q-block"><div class="crit-q-label">Error 1 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 1 y su corrección"></textarea><div class="crit-pauta">${err.g1}</div></div><div class="crit-q-block"><div class="crit-q-label">Error 2 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 2 y su corrección"></textarea><div class="crit-pauta">${err.g2}</div></div><div class="crit-selfscore"><label for="critScore1">Obtenido:</label><input type="number" id="critScore1" class="crit-score-input" data-score="1" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s2);

  const dec=_pickF(critDecisionBank,1,rngC)[0];
  const s3=document.createElement('div');
  s3.innerHTML=`<div class="eval-section-title">III. Toma de decisiones: cuidar el sistema endocrino <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${dec}</div><div class="crit-q-block"><div class="crit-q-label">¿Qué tres cambios recomendarías para cuidar mejor su sistema endocrino? Explica por qué ayudaría cada cambio.</div><textarea class="crit-textarea" rows="4" aria-label="Tres cambios recomendados y su justificación"></textarea><div class="crit-pauta">${critDecisionGuide}</div></div><div class="crit-selfscore"><label for="critScore2">Obtenido:</label><input type="number" id="critScore2" class="crit-score-input" data-score="2" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s3);

  const cmp=_pickF(critCompareBank,1,rngC)[0];
  const s4=document.createElement('div');
  s4.innerHTML=`<div class="eval-section-title">IV. Comparación razonada <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-compare-grid"><div class="crit-compare-box"><h5>Caso A</h5>${cmp.a}</div><div class="crit-compare-box"><h5>Caso B</h5>${cmp.b}</div></div><div class="crit-q-block"><div class="crit-q-label">1. ¿Qué enfermedad podría relacionarse con cada caso? 2. ¿Qué glándula u hormona parece afectada en cada uno? 3. ¿Por qué no son el mismo problema?</div><textarea class="crit-textarea" rows="4" aria-label="Comparación razonada de los casos A y B"></textarea><div class="crit-pauta">Caso A: ${cmp.ga} · Caso B: ${cmp.gb} · ${cmp.gr}</div></div><div class="crit-selfscore"><label for="critScore3">Obtenido:</label><input type="number" id="critScore3" class="crit-score-input" data-score="3" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
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
  let s1=`<div class="sec-title"><span>I. Caso de análisis: la regulación del azúcar</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.kase.txt}</p>`;
  critCaseQuestions.forEach(q=>{s1+=`<p class="crit-print-q">${q}</p>${lines(1)}`;});
  let s2=`<div class="sec-title"><span>II. Corrige el error</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.err.txt}</p><p class="crit-print-q">Identifica dos errores y corrígelos con tus propias palabras:</p><p class="crit-print-q"><strong>Error 1:</strong></p>${lines(1)}<p class="crit-print-q"><strong>Error 2:</strong></p>${lines(1)}`;
  let s3=`<div class="sec-title"><span>III. Toma de decisiones: cuidar el sistema endocrino</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.dec}</p><p class="crit-print-q">¿Qué tres cambios recomendarías para cuidar mejor su sistema endocrino? Explica por qué cada cambio ayudaría.</p>${lines(2)}`;
  let s4=`<div class="sec-title"><span>IV. Comparación razonada</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><div class="crit-compare-print-grid"><div class="crit-compare-print-box"><strong>Caso A:</strong> ${d.cmp.a}</div><div class="crit-compare-print-box"><strong>Caso B:</strong> ${d.cmp.b}</div></div><p class="crit-print-q">1. ¿Qué enfermedad podría relacionarse con cada caso? 2. ¿Qué glándula u hormona parece afectada en cada uno? 3. ¿Por qué no son el mismo problema?</p>${lines(2)}`;
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
  const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Pensamiento Crítico El Sistema Endocrino · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.1rem 0.4rem;margin:0.2rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #27ae60;background:#e8f8f5;color:#27ae60;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#27ae60;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #27ae60;height:12px;}.obt-pct{white-space:nowrap;}.crit-print-scenario{font-size:10.5pt;background:#e8f8f5;border-left:3px solid #27ae60;padding:0.2rem 0.5rem;margin:0.1rem 0 0.2rem;line-height:1.3;}.crit-print-q{font-size:10pt;font-weight:600;margin:0.15rem 0 0.08rem;line-height:1.25;}.ln{border-bottom:1px solid #111;min-height:12px;margin-bottom:2px;}.crit-compare-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin:0.15rem 0;}.crit-compare-print-box{font-size:9.5pt;background:#e8f8f5;border-radius:4px;padding:0.25rem 0.4rem;line-height:1.25;}.crit-print-tbl{width:100%;border-collapse:collapse;font-size:9.5pt;margin-top:0.15rem;}.crit-print-tbl th,.crit-print-tbl td{border:1px solid #999;padding:0.3rem 0.45rem;text-align:left;height:30px;vertical-align:middle;}.crit-print-tbl th{background:#e8f8f5;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:9.5pt;font-weight:700;}.p-sub{font-size:7pt;color:#c00;font-weight:700;margin:0.08rem 0;}.p-meta{font-size:7pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.9rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.45rem;}.p-ttl{font-size:8pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.1rem;margin-bottom:0.18rem;}.p-crit-line{font-size:7.5pt;color:#007a00;margin-bottom:0.18rem;line-height:1.35;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.2rem;padding:0.1rem 0;color:#27ae60;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #27ae60;}.forma-tag{position:fixed;bottom:5mm;right:6mm;font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;}@media print{@page{size:letter portrait;margin:12.7mm;}}</style></head><body><div class="ph"><h2>Evaluación Competencial · Pensamiento Crítico · El Sistema Endocrino · Educación Básica · Ciencias Naturales</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Institución:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 5 secciones de 20 puntos</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100</span></div><div class="pauta-wrap"><div class="p-head"><div class="p-main">✅ PAUTA — Pensamiento Crítico · El Sistema Endocrino · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 5 secciones × 20 pts c/u — respuesta abierta, usar como guía de corrección</div></div><div class="p-grid">${pR}</div></div><div class="forma-tag">Forma ${forma}</div></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(doc);win.document.close();setTimeout(()=>win.print(),400);
}

// ===================== LABORATORIO DE GLÁNDULAS =====================
const parteData={
  hipofisis:{
    nombre:'Hipófisis',icon:'👑',
    estructura:{title:'Estructura',info:'• Glándula del tamaño de un <strong>guisante</strong>, ubicada en la base del cerebro (silla turca)<br>• Conectada al <strong>hipotálamo</strong> por un fino tallo<br>• Tiene dos partes: <strong>adenohipófisis</strong> (anterior) y <strong>neurohipófisis</strong> (posterior)<br>• Recibe órdenes nerviosas y hormonales del hipotálamo<br>• Es conocida como la <strong>"glándula maestra"</strong>'},
    hormonas:{title:'Hormonas',info:'• <strong>GH (hormona del crecimiento)</strong>: regula el crecimiento del cuerpo<br>• <strong>TSH</strong>: estimula la tiroides<br>• <strong>ACTH</strong>: estimula las suprarrenales (cortisol)<br>• <strong>FSH y LH</strong>: controlan las gónadas (reproducción)<br>• <strong>Prolactina</strong>: producción de leche<br>• Guarda y libera <strong>oxitocina</strong> y <strong>ADH</strong> (antidiurética)'},
    enfermedades:{title:'Enfermedades',info:'• <strong>Gigantismo</strong>: exceso de GH durante la niñez<br>• <strong>Acromegalia</strong>: exceso de GH en la edad adulta<br>• <strong>Enanismo hipofisario</strong>: falta de GH<br>• <strong>Tumores hipofisarios</strong>: alteran la producción de varias hormonas<br>• <strong>Diabetes insípida</strong>: falta de ADH (mucha sed y orina)'},
    cuidados:{title:'Cuidados',info:'• <strong>Chequeos médicos</strong>: detectar a tiempo alteraciones del crecimiento<br>• <strong>Alimentación y sueño adecuados</strong>: la GH se libera sobre todo al dormir<br>• <strong>Evitar la automedicación hormonal</strong> sin control médico<br>• <strong>Vigilar el crecimiento</strong> en niños y adolescentes<br>• Acudir al especialista (endocrinólogo) ante señales de alarma'}
  },
  tiroides:{
    nombre:'Tiroides',icon:'🦋',
    estructura:{title:'Estructura',info:'• Glándula con forma de <strong>mariposa</strong>, ubicada en la parte delantera del <strong>cuello</strong><br>• Formada por dos lóbulos unidos por un istmo<br>• Contiene <strong>folículos</strong> que almacenan la hormona<br>• Necesita <strong>yodo</strong> para fabricar sus hormonas<br>• Junto a ella están las <strong>paratiroides</strong>, que regulan el calcio'},
    hormonas:{title:'Hormonas',info:'• <strong>Tiroxina (T4) y T3</strong>: regulan el <strong>metabolismo</strong> y la producción de energía<br>• Controlan la temperatura corporal y el ritmo del cuerpo<br>• Influyen en el crecimiento y el desarrollo del cerebro<br>• <strong>Calcitonina</strong>: ayuda a regular el calcio en la sangre<br>• Su producción es estimulada por la <strong>TSH</strong> de la hipófisis'},
    enfermedades:{title:'Enfermedades',info:'• <strong>Hipotiroidismo</strong>: poca tiroxina; cansancio, frío y aumento de peso<br>• <strong>Hipertiroidismo</strong>: exceso de tiroxina; nerviosismo y pérdida de peso<br>• <strong>Bocio</strong>: agrandamiento de la tiroides por falta de yodo<br>• <strong>Enfermedad de Graves</strong>: hipertiroidismo autoinmune<br>• <strong>Nódulos tiroideos</strong>: bultos en la glándula'},
    cuidados:{title:'Cuidados',info:'• <strong>Consumir sal yodada</strong> y alimentos con yodo (pescado, mariscos)<br>• <strong>Alimentación balanceada</strong> con suficiente selenio y hierro<br>• <strong>Chequeos médicos</strong> si hay cansancio o cambios de peso inexplicables<br>• <strong>Evitar el tabaco</strong>, que afecta la función tiroidea<br>• Palparse el cuello y consultar ante inflamación'}
  },
  pancreas:{
    nombre:'Páncreas',icon:'🍬',
    estructura:{title:'Estructura',info:'• Órgano alargado ubicado en el <strong>abdomen</strong>, detrás del estómago<br>• Es una <strong>glándula mixta</strong>: endocrina y exocrina<br>• Parte <strong>exocrina</strong>: libera jugos digestivos al intestino<br>• Parte <strong>endocrina</strong>: los <strong>islotes de Langerhans</strong><br>• Los islotes tienen células <strong>beta</strong> (insulina) y <strong>alfa</strong> (glucagón)'},
    hormonas:{title:'Hormonas',info:'• <strong>Insulina</strong> (células beta): <strong>baja</strong> el azúcar en la sangre; ordena a las células captarlo<br>• <strong>Glucagón</strong> (células alfa): <strong>sube</strong> el azúcar liberándolo de las reservas<br>• Juntas mantienen la <strong>glucemia estable</strong> (homeostasis)<br>• Actúan sobre todo tras comer (insulina) y en ayuno (glucagón)<br>• Ejemplo de <strong>retroalimentación</strong> del sistema endocrino'},
    enfermedades:{title:'Enfermedades',info:'• <strong>Diabetes tipo 1</strong>: el páncreas no produce insulina<br>• <strong>Diabetes tipo 2</strong>: el cuerpo no usa bien la insulina (resistencia)<br>• Síntomas: mucha sed, orina frecuente, cansancio y pérdida de peso<br>• <strong>Hipoglucemia</strong>: azúcar demasiado baja<br>• <strong>Pancreatitis</strong>: inflamación del páncreas'},
    cuidados:{title:'Cuidados',info:'• <strong>Alimentación baja en azúcar</strong> y rica en fibra<br>• <strong>Ejercicio regular</strong>: ayuda a las células a usar la insulina<br>• <strong>Mantener un peso saludable</strong>: reduce el riesgo de diabetes tipo 2<br>• <strong>Evitar el exceso de alcohol</strong>, que daña el páncreas<br>• <strong>Chequeos de glucemia</strong>, sobre todo si hay antecedentes familiares'}
  },
  suprarrenales:{
    nombre:'Glándulas suprarrenales',icon:'⚡',
    estructura:{title:'Estructura',info:'• Dos glándulas pequeñas, una <strong>sobre cada riñón</strong><br>• Tienen forma de sombrero o triángulo<br>• Parte externa: <strong>corteza suprarrenal</strong><br>• Parte interna: <strong>médula suprarrenal</strong><br>• Están muy conectadas con el <strong>sistema nervioso</strong> (respuesta al estrés)'},
    hormonas:{title:'Hormonas',info:'• <strong>Adrenalina</strong> (médula): prepara el cuerpo ante el peligro ("lucha o huye")<br>• <strong>Cortisol</strong> (corteza): hormona del <strong>estrés</strong>; libera energía<br>• <strong>Aldosterona</strong>: regula el agua y las sales (sodio y potasio)<br>• La adrenalina acelera el corazón, dilata pupilas y sube el azúcar<br>• Trabajan <strong>junto al sistema nervioso</strong> en situaciones de emergencia'},
    enfermedades:{title:'Enfermedades',info:'• <strong>Síndrome de Cushing</strong>: exceso de cortisol; cara redonda y grasa en el tronco<br>• <strong>Enfermedad de Addison</strong>: falta de cortisol; debilidad y fatiga<br>• <strong>Estrés crónico</strong>: cortisol alto de forma constante daña la salud<br>• <strong>Feocromocitoma</strong>: tumor que produce exceso de adrenalina<br>• Alteraciones de la presión arterial'},
    cuidados:{title:'Cuidados',info:'• <strong>Manejar el estrés</strong>: descanso, respiración, deporte y recreación<br>• <strong>Dormir 8–9 h</strong>: equilibra el cortisol<br>• <strong>Actividad física moderada</strong>, evitando el sobreentrenamiento<br>• <strong>Alimentación equilibrada</strong> y buena hidratación<br>• <strong>Evitar estimulantes en exceso</strong> (cafeína, bebidas energéticas)'}
  }
};
let labParte='hipofisis',labAspecto='estructura';
function labShowParte(parteKey){labParte=parteKey;updateLabDisplay();document.querySelectorAll('.lab-cont-btn').forEach(b=>b.classList.remove('active-pri'));const btn=document.querySelector(`[data-parte="${parteKey}"]`);if(btn)btn.classList.add('active-pri');if(typeof sfx==='function')sfx('click');}
function labShowAspecto(aspectoKey){labAspecto=aspectoKey;updateLabDisplay();document.querySelectorAll('.lab-asp-btn').forEach(b=>b.classList.remove('active-sec'));const btn=document.querySelector(`[data-aspecto="${aspectoKey}"]`);if(btn)btn.classList.add('active-sec');if(typeof sfx==='function')sfx('click');}
function updateLabDisplay(){const data=parteData[labParte];const asp=data[labAspecto];document.getElementById('lab-sentence').innerHTML=`⚗️ Explorando: <strong>${data.nombre}</strong> → <strong>${asp.title}</strong>`;document.getElementById('lab-display').innerHTML=`<div class="lab-cont-header">${data.icon} ${data.nombre}</div><div class="lab-asp-title">${asp.title}</div><div class="lab-asp-info">${asp.info}</div>`;}

// ===================== DIPLOMA =====================
function _diplPct(){return xp>=MXP?100:Math.round((xp/MXP)*100);}
function openDiploma(){sfx('fan');const pct=_diplPct();document.getElementById('diplPct').textContent=pct+'%';document.getElementById('diplBar').style.width=pct+'%';document.getElementById('diplDate').textContent='Fecha: '+new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});const msgs=['¡Sigue aprendiendo!','¡Muy buen trabajo!','¡Excelente en endocrinología!','¡Eres un experto en hormonas y glándulas!','¡Maestro del Sistema Endocrino!'];document.getElementById('diplMsg').textContent=msgs[Math.min(Math.floor(pct/25),4)];const stars=['⭐','⭐⭐','⭐⭐⭐'];document.getElementById('diplStars').textContent=stars[Math.min(Math.floor(pct/40),2)];const achTxt=unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(' · ');document.getElementById('diplAch').textContent=achTxt||'Sigue completando secciones para desbloquear logros';document.getElementById('diplomaOverlay').classList.add('open');launchConfetti();}
function closeDiploma(){document.getElementById('diplomaOverlay').classList.remove('open');}
function updateDiplomaName(v){document.getElementById('diplName').textContent=v||'Estudiante';}
function shareWA(){const name=document.getElementById('diplName').textContent||'Estudiante';const pct=_diplPct();const msg=`⚗️ ¡${name} completó la Misión "El Sistema Endocrino"! 🏅 Progreso: ${pct}% · 🔬 policastsapien.com`;_waShare(msg);}
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
  document.querySelector('[data-parte="hipofisis"]')?.classList.add('active-pri');
  document.querySelector('[data-aspecto="estructura"]')?.classList.add('active-sec');
  renderAchPanel();
});

// Formas deterministas v1: selectores de forma visibles desde la carga de la página
(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalOp==='function') _injectFormaSel('genEvalOp','evalOpFormaSel',evalOpFormNum,function(v){evalOpFormNum=v;}); }catch(e){} try{ if(typeof genEvalCrit==='function') _injectFormaSel('genEvalCrit','evalCritFormaSel',evalCritFormNum,function(v){evalCritFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();
