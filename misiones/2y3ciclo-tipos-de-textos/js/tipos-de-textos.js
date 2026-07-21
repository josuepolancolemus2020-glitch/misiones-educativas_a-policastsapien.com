// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
function compartirMision(){const url=window.location.href;const texto=`🚀 *Misión Asignada* 🚀\n\nPractica sobre este tema y sobresale en ser de los mejores alumnos. 🏆\n\nDesbloquea *todos los logros* y puedes poner *tus datos* para que tu maestro observe todos tus logros. 📋\n\n_Se te hará prueba escrita y serás excelente estudiante en Español._ ✍️\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;_waShare(texto);}
function toggleLetra(){document.body.classList.toggle('letra-grande');if(typeof sfx==='function')sfx('click');localStorage.setItem('preferenciaLetra',document.body.classList.contains('letra-grande'));}
window.addEventListener('DOMContentLoaded',()=>{if(localStorage.getItem('preferenciaLetra')==='true')document.body.classList.add('letra-grande');});

// ===================== UTILIDADES =====================
const _pick=(arr,n)=>[...arr].sort(()=>Math.random()-0.5).slice(0,n);
const _shuffle=(arr)=>[...arr].sort(()=>Math.random()-0.5);
function fb(id,msg,isOk){const el=document.getElementById(id);if(el){el.textContent=msg;el.className='fb show '+(isOk?'ok':'err');}}

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY='tipos_de_textos_v1';
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
  primer_quiz:{icon:'🧠',label:'Primera prueba de tipos de texto superada'},
  flash_master:{icon:'🃏',label:'Todas las flashcards de textos exploradas'},
  clasif_pro:{icon:'🗂️',label:'Clasificador de tipos de texto experto'},
  id_master:{icon:'🔍',label:'Identificador de conceptos textuales maestro'},
  reto_hero:{icon:'🏆',label:'Héroe del reto de tipos de texto'},
  nivel3:{icon:'✏️',label:'¡Escritor junior! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡Maestro de los Textos! Nivel 6'},
  widgets_master:{icon:'🧩',label:'Widgets de tipos de texto dominados'}
};
function unlockAchievement(id){if(unlockedAch.includes(id))return;unlockedAch.push(id);sfx('ach');showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label);launchConfetti();renderAchPanel();saveProgress();}
function renderAchPanel(){const list=document.getElementById('achList');list.innerHTML='';Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{const div=document.createElement('div');div.className='ach-item'+(unlockedAch.includes(id)?'':' locked');div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`;list.appendChild(div);});}
function toggleAchPanel(){sfx('click');document.getElementById('achPanel').classList.toggle('open');}
function showToast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}t.textContent=msg;t.style.display='block';clearTimeout(t._tid);t._tid=setTimeout(()=>t.style.display='none',3200);}
function launchConfetti(){const colors=['#6d28d9','#9d7fd4','#db2777','#f06292','#00b894'];for(let i=0;i<60;i++){const c=document.createElement('div');c.className='confetti-piece';c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`;document.body.appendChild(c);c.addEventListener('animationend',()=>c.remove());}}

// ===================== XP =====================
const lvls=[{t:0,n:'Aprendiz 🌱'},{t:25,n:'Lector 📖'},{t:55,n:'Escritor Jr. ✏️'},{t:90,n:'Redactor ✒️'},{t:130,n:'Analista de textos 🔎'},{t:165,n:'Editor 📝'},{t:190,n:'Maestro de los Textos 🏆'}];
function pts(n){xp=Math.max(0,Math.min(MXP,xp+n));updateXPBar();saveProgress();}
function updateXPBar(){const pct=Math.round((xp/MXP)*100);document.getElementById('xpFill').style.width=pct+'%';const el=document.getElementById('xpPts');el.textContent='⭐ '+xp;el.style.transform='scale(1.3)';setTimeout(()=>el.style.transform='',300);let lv=0;for(let i=0;i<lvls.length;i++)if(xp>=lvls[i].t)lv=i;document.getElementById('xpLvl').textContent=lvls[lv].n;if(lv!==prevLevel){if(lv>=2)unlockAchievement('nivel3');if(lv>=5)unlockAchievement('nivel5');prevLevel=lv;}}
function resetXP(){sfx('click');xp=0;updateXPBar();showToast('🔄 XP reiniciado a 0');}
function fin(id,showFX=true){if(!done.has(id)){done.add(id);const b=document.querySelector(`[data-s="${id}"]`);if(b)b.classList.add('done');if(showFX){sfx('up');launchConfetti();}saveProgress();}}
function getProgress(){return Math.round((done.size/TOTAL_SECTIONS)*100);}

// ===================== NAV =====================
function go(id){sfx('click');document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});document.getElementById(id).classList.add('active');const btn=document.querySelector(`[data-s="${id}"]`);if(btn){btn.classList.add('active');btn.setAttribute('aria-selected','true');}window.scrollTo({top:0,behavior:'smooth'});if(id==='s-sopa'){setTimeout(buildSopa,50);}if(id==='s-widgets'){setTimeout(buildRoute,50);}}

// ===================== FLASHCARD DATA =====================
const fcData=[
  {w:'Tipos de texto',a:'📚 Son las <strong>distintas clases de textos</strong> que existen según su <strong>propósito comunicativo</strong> (para qué se escriben). Los principales son: <strong>narrativo, descriptivo, expositivo, argumentativo, instructivo y dialogado</strong>.'},
  {w:'Texto narrativo',a:'📖 <strong>Cuenta hechos o historias</strong> que les suceden a unos personajes en un tiempo y un lugar. Tiene <strong>inicio, nudo y desenlace</strong>. Ejemplos: cuento, novela, fábula, leyenda y noticia.'},
  {w:'Texto descriptivo',a:'🖼️ <strong>Describe cómo son</strong> personas, animales, lugares u objetos. Usa muchos <strong>adjetivos</strong> y responde a "¿cómo es?". Ejemplos: un retrato, un paisaje, la descripción de un objeto.'},
  {w:'Texto expositivo',a:'📊 <strong>Informa y explica</strong> un tema de forma clara y objetiva, sin dar opiniones. Ejemplos: un artículo de enciclopedia, un texto de ciencias o un informe. También se llama <strong>informativo</strong>.'},
  {w:'Texto argumentativo',a:'⚖️ <strong>Defiende una opinión (tesis)</strong> con razones o argumentos para <strong>convencer</strong> al lector. Ejemplos: un ensayo, un artículo de opinión o una reseña.'},
  {w:'Texto instructivo',a:'📋 <strong>Indica los pasos</strong> para hacer algo. Usa verbos en <strong>imperativo o infinitivo</strong> y suele numerar las acciones. Ejemplos: una receta, un manual o las reglas de un juego.'},
  {w:'Texto dialogado',a:'💬 Reproduce una <strong>conversación</strong> entre dos o más personas. Usa <strong>guiones o rayas de diálogo</strong>. Ejemplos: una obra de teatro, una entrevista o un guion.'},
  {w:'Texto poético (lírico)',a:'🎭 Expresa <strong>sentimientos y emociones</strong> con un lenguaje bello y cuidado. Suele escribirse en <strong>verso</strong>. Ejemplo: un poema.'},
  {w:'Estructura narrativa',a:'🧩 Es el orden de un texto narrativo: <strong>Inicio</strong> (se presentan los personajes y el lugar), <strong>Nudo</strong> (surge el conflicto o problema) y <strong>Desenlace</strong> (se resuelve la historia).'},
  {w:'Narrador',a:'🗣️ Es la <strong>voz que cuenta</strong> la historia en un texto narrativo. Puede ser <strong>protagonista</strong> (cuenta en 1.ª persona: "yo") u <strong>omnisciente</strong> (lo sabe todo y cuenta en 3.ª persona).'},
  {w:'Propósito comunicativo',a:'🎯 Es la <strong>intención</strong> con la que se escribe un texto: contar, describir, informar, convencer o indicar cómo hacer algo. El propósito determina el <strong>tipo de texto</strong>.'},
  {w:'Marcas lingüísticas',a:'🔎 Son las <strong>pistas del lenguaje</strong> que ayudan a reconocer un tipo de texto: adjetivos (descriptivo), verbos en pasado (narrativo), imperativos (instructivo), conectores lógicos (argumentativo).'},
  {w:'Textos literarios y no literarios',a:'📕 Los <strong>literarios</strong> buscan crear belleza y emocionar (cuento, poema, novela). Los <strong>no literarios</strong> tienen una función práctica (noticia, receta, afiche, informe).'},
  {w:'Conectores',a:'🔗 Palabras que <strong>unen las ideas</strong> de un texto. De <strong>tiempo</strong> (después, luego), de <strong>orden</strong> (primero, finalmente) o de <strong>causa</strong> (porque, por lo tanto). Guían al lector.'},
];
let fcIdx=0;
function upFC(){document.getElementById('fcInner').classList.remove('flipped');document.getElementById('fcW').textContent=fcData[fcIdx].w;document.getElementById('fcA').innerHTML=fcData[fcIdx].a;document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length;}
function flipCard(){sfx('flip');document.getElementById('fcInner').classList.toggle('flipped');if(!xpTracker.fc.has(fcIdx)){xpTracker.fc.add(fcIdx);pts(1);}if(xpTracker.fc.size===fcData.length){fin('s-flash');unlockAchievement('flash_master');}}
function nextFC(){sfx('click');fcIdx=(fcIdx+1)%fcData.length;upFC();}
function prevFC(){sfx('click');fcIdx=(fcIdx-1+fcData.length)%fcData.length;upFC();}

// ===================== QUIZ DATA =====================
const qzData=[
  {q:'¿Qué determina el tipo de un texto?',o:['a) Su longitud','b) Su propósito comunicativo','c) El color del papel','d) El autor'],c:1},
  {q:'¿Qué tipo de texto CUENTA hechos que les pasan a unos personajes?',o:['a) Descriptivo','b) Instructivo','c) Narrativo','d) Expositivo'],c:2},
  {q:'Una receta de cocina es un texto...',o:['a) Poético','b) Instructivo','c) Argumentativo','d) Descriptivo'],c:1},
  {q:'¿Cuál es el propósito de un texto argumentativo?',o:['a) Informar sin opinar','b) Convencer con razones','c) Describir un objeto','d) Contar una historia'],c:1},
  {q:'¿Qué texto usa muchos adjetivos para decir cómo es algo?',o:['a) Narrativo','b) Instructivo','c) Descriptivo','d) Dialogado'],c:2},
  {q:'¿Cuáles son las partes de la estructura narrativa?',o:['a) Tesis, argumentos y conclusión','b) Inicio, nudo y desenlace','c) Ingredientes y pasos','d) Introducción y despedida'],c:1},
  {q:'Un artículo de enciclopedia que explica un tema es un texto...',o:['a) Expositivo','b) Poético','c) Instructivo','d) Argumentativo'],c:0},
  {q:'¿Qué texto se reconoce por los guiones o rayas de diálogo?',o:['a) Expositivo','b) Descriptivo','c) Dialogado','d) Instructivo'],c:2},
  {q:'¿Cuál de estos es un texto LITERARIO?',o:['a) La noticia','b) La receta','c) El poema','d) El manual'],c:2},
];
let qzIdx=0,qzSel=-1,qzDone=false;
function buildQz(){qzIdx=0;qzSel=-1;qzDone=false;showQz();}
function showQz(){if(qzIdx>=qzData.length){document.getElementById('qzQ').textContent='🎉 ¡Quiz completado!';document.getElementById('qzOpts').innerHTML='';fin('s-quiz');unlockAchievement('primer_quiz');return;}const q=qzData[qzIdx];document.getElementById('qzProg').textContent=`Pregunta ${qzIdx+1} de ${qzData.length}`;document.getElementById('qzQ').textContent=q.q;const opts=document.getElementById('qzOpts');opts.innerHTML='';q.o.forEach((o,i)=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=o;b.onclick=()=>{if(qzDone)return;document.querySelectorAll('.qz-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');qzSel=i;sfx('click');};opts.appendChild(b);});qzDone=false;}
function checkQz(){if(qzSel<0)return fb('fbQz','Selecciona una respuesta.',false);qzDone=true;const opts=document.querySelectorAll('.qz-opt');if(qzSel===qzData[qzIdx].c){opts[qzSel].classList.add('correct');fb('fbQz','¡Correcto! +5 XP',true);if(!xpTracker.qz.has(qzIdx)){xpTracker.qz.add(qzIdx);pts(5);}sfx('ok');}else{opts[qzSel].classList.add('wrong');opts[qzData[qzIdx].c].classList.add('correct');fb('fbQz','Incorrecto. Revisa la respuesta correcta.',false);sfx('no');}setTimeout(()=>{qzIdx++;qzSel=-1;showQz();},1600);}
function resetQz(){sfx('click');qzIdx=0;qzSel=-1;qzDone=false;showQz();document.getElementById('fbQz').classList.remove('show');}

// ===================== CLASIFICACIÓN =====================
const classGroups=[
  {label:['Literario','No literario'],headA:'📕 Texto Literario',headB:'📰 Texto No literario',colA:'lit',colB:'nolit',
   words:[{w:'Cuento',t:'lit'},{w:'Noticia',t:'nolit'},{w:'Poema',t:'lit'},{w:'Receta',t:'nolit'},{w:'Novela',t:'lit'},{w:'Manual de uso',t:'nolit'},{w:'Fábula',t:'lit'},{w:'Afiche publicitario',t:'nolit'},{w:'Leyenda',t:'lit'},{w:'Informe',t:'nolit'}]},
  {label:['Narrativo','Descriptivo'],headA:'📖 Narrativo (cuenta)',headB:'🖼️ Descriptivo (describe)',colA:'narr',colB:'desc',
   words:[{w:'Cuenta qué pasó',t:'narr'},{w:'Dice cómo es',t:'desc'},{w:'Tiene inicio, nudo y desenlace',t:'narr'},{w:'Usa muchos adjetivos',t:'desc'},{w:'Hay personajes y acciones',t:'narr'},{w:'Retrata a una persona',t:'desc'},{w:'Verbos de acción en pasado',t:'narr'},{w:'Pinta un paisaje con palabras',t:'desc'},{w:'La fábula',t:'narr'},{w:'El retrato',t:'desc'}]},
  {label:['Expositivo','Argumentativo'],headA:'📊 Expositivo (informa)',headB:'⚖️ Argumentativo (convence)',colA:'expo',colB:'argu',
   words:[{w:'Informa con objetividad',t:'expo'},{w:'Defiende una opinión',t:'argu'},{w:'No da opiniones',t:'expo'},{w:'Presenta una tesis',t:'argu'},{w:'Artículo de enciclopedia',t:'expo'},{w:'Artículo de opinión',t:'argu'},{w:'Explica un tema',t:'expo'},{w:'Usa argumentos y razones',t:'argu'},{w:'Texto de ciencias',t:'expo'},{w:'Busca convencer',t:'argu'}]},
  {label:['Instructivo','Dialogado'],headA:'📋 Instructivo (indica pasos)',headB:'💬 Dialogado (conversa)',colA:'inst',colB:'dial',
   words:[{w:'La receta de cocina',t:'inst'},{w:'La obra de teatro',t:'dial'},{w:'Verbos en imperativo',t:'inst'},{w:'Usa rayas de diálogo',t:'dial'},{w:'Pasos numerados',t:'inst'},{w:'La entrevista',t:'dial'},{w:'Reglas de un juego',t:'inst'},{w:'Turnos para hablar',t:'dial'},{w:'El manual de instrucciones',t:'inst'},{w:'El guion de cine',t:'dial'}]},
];
let currentClassGroupIdx=0,clsSelectedWord=null;
function buildClass(){const group=classGroups[currentClassGroupIdx];document.getElementById('col-left-head').textContent=group.headA;document.getElementById('col-right-head').textContent=group.headB;const bank=document.getElementById('clsBank');bank.innerHTML='';clsSelectedWord=null;document.getElementById('items-left').innerHTML='';document.getElementById('items-right').innerHTML='';_shuffle([...group.words]).forEach(w=>{const el=document.createElement('div');el.className='wb-item';el.textContent=w.w;el.dataset.t=w.t;el.onclick=()=>{document.querySelectorAll('.wb-item').forEach(i=>i.classList.remove('sel-word'));el.classList.add('sel-word');clsSelectedWord=el;sfx('click');};bank.appendChild(el);});['col-left','col-right'].forEach(colId=>{const col=document.getElementById(colId);col.onclick=(e)=>{if(!clsSelectedWord||e.target.classList.contains('drop-item'))return;const targetId=colId==='col-left'?'items-left':'items-right';const wordsCol=document.getElementById(targetId);const item=document.createElement('div');item.className='drop-item';item.textContent=clsSelectedWord.textContent;item.dataset.t=clsSelectedWord.dataset.t;const original=clsSelectedWord;item.onclick=(ev)=>{ev.stopPropagation();if(clsSelectedWord!==null){col.click();}else{document.getElementById('clsBank').appendChild(original);original.classList.remove('sel-word');item.remove();if(typeof sfx==='function')sfx('click');}};wordsCol.appendChild(item);clsSelectedWord.remove();clsSelectedWord=null;sfx('click');};});}
function checkClass(){const remaining=document.querySelectorAll('#clsBank .wb-item').length;if(remaining>0){fb('fbCls','Mueve todas las palabras a las columnas primero.',false);return;}const group=classGroups[currentClassGroupIdx];let allOk=true;document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{const inLeft=el.parentElement.id==='items-left';const expectedType=inLeft?group.colA:group.colB;if(el.dataset.t===expectedType){el.classList.add('cls-ok');}else{el.classList.add('cls-no');allOk=false;}});if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);}if(allOk){fb('fbCls','¡Perfecto! +5 XP',true);sfx('fan');fin('s-clasifica');unlockAchievement('clasif_pro');}else{fb('fbCls','Hay errores. Marcados en rojo.',false);sfx('no');}}
function nextClassGroup(){sfx('click');currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length;buildClass();document.getElementById('fbCls').classList.remove('show');showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]);}
function resetClass(){sfx('click');buildClass();document.getElementById('fbCls').classList.remove('show');}

// ===================== IDENTIFICAR =====================
const idData=[
  {s:['El','texto','narrativo','cuenta','una','historia.'],c:2,art:'El tipo de texto que cuenta hechos'},
  {s:['La','receta','es','un','texto','instructivo.'],c:4,art:'El tipo de texto que indica pasos'},
  {s:['El','narrador','es','la','voz','que','cuenta','la','historia.'],c:1,art:'La voz que cuenta el relato'},
  {s:['El','texto','descriptivo','usa','muchos','adjetivos.'],c:2,art:'El tipo de texto que dice cómo es algo'},
  {s:['El','ensayo','defiende','una','opinión','o','tesis.'],c:1,art:'Ejemplo de texto argumentativo'},
  {s:['El','desenlace','resuelve','el','conflicto','del','cuento.'],c:1,art:'Parte final de la estructura narrativa'},
  {s:['El','texto','expositivo','informa','sobre','un','tema.'],c:2,art:'El tipo de texto que informa'},
  {s:['El','poema','expresa','sentimientos','en','verso.'],c:1,art:'Ejemplo de texto poético'},
];
let idIdx=0,idDone=false;
function showId(){idDone=false;if(idIdx>=idData.length){document.getElementById('idSent').innerHTML='🎉 ¡Completado!';fin('s-identifica');unlockAchievement('id_master');return;}const d=idData[idIdx];document.getElementById('idProg').textContent=`Oración ${idIdx+1} de ${idData.length}`;document.getElementById('idInfo').textContent=`Busca: ${d.art}`;const sent=document.getElementById('idSent');sent.innerHTML='';d.s.forEach((w,i)=>{const span=document.createElement('span');span.className='id-word';span.textContent=w+' ';span.onclick=()=>checkId(i,span);sent.appendChild(span);});}
function checkId(i,span){if(idDone)return;document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected'));span.classList.add('selected');if(i===idData[idIdx].c){idDone=true;span.classList.add('id-ok');fb('fbId','¡Correcto! +5 XP',true);if(!xpTracker.id.has(idIdx)){xpTracker.id.add(idIdx);pts(5);}sfx('ok');}else{span.classList.add('id-no');fb('fbId','Ese no es el término solicitado.',false);sfx('no');}}
function nextId(){sfx('click');idIdx++;showId();document.getElementById('fbId').classList.remove('show');}
function resetId(){sfx('click');idIdx=0;showId();document.getElementById('fbId').classList.remove('show');}

// ===================== COMPLETA =====================
const cmpData=[
  {s:'El texto que cuenta una historia con personajes es el ___.',opts:['descriptivo','narrativo','instructivo'],c:1},
  {s:'Una receta de cocina es un texto ___.',opts:['instructivo','poético','argumentativo'],c:0},
  {s:'El texto que describe cómo es algo usando adjetivos es el ___.',opts:['expositivo','descriptivo','dialogado'],c:1},
  {s:'El texto que informa sobre un tema sin opinar es el ___.',opts:['argumentativo','expositivo','narrativo'],c:1},
  {s:'El texto que defiende una opinión para convencer es el ___.',opts:['argumentativo','instructivo','descriptivo'],c:0},
  {s:'La estructura del texto narrativo es inicio, nudo y ___.',opts:['tesis','desenlace','párrafo'],c:1},
  {s:'La voz que cuenta la historia se llama ___.',opts:['personaje','narrador','autor'],c:1},
  {s:'Un poema es un ejemplo de texto ___.',opts:['poético','instructivo','expositivo'],c:0},
];
let cmpIdx=0,cmpSel=-1,cmpDone=false;
function showCmp(){if(cmpIdx>=cmpData.length){document.getElementById('cmpSent').innerHTML='🎉 ¡Completado!';document.getElementById('cmpOpts').innerHTML='';fin('s-completa');return;}const d=cmpData[cmpIdx];document.getElementById('cmpProg').textContent=`Oración ${cmpIdx+1} de ${cmpData.length}`;document.getElementById('cmpSent').innerHTML=d.s.replace('___','<span class="blank">___</span>');const opts=document.getElementById('cmpOpts');opts.innerHTML='';cmpSel=-1;cmpDone=false;d.opts.forEach((o,i)=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=o;b.onclick=()=>{if(cmpDone)return;document.querySelectorAll('.cmp-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');cmpSel=i;sfx('click');};opts.appendChild(b);});}
function checkCmp(){if(cmpSel<0)return fb('fbCmp','Selecciona una opción.',false);cmpDone=true;const opts=document.querySelectorAll('.cmp-opt');if(cmpSel===cmpData[cmpIdx].c){opts[cmpSel].classList.add('correct');document.getElementById('cmpSent').innerHTML=cmpData[cmpIdx].s.replace('___',`<span class="blank" style="color:var(--jade);border-color:var(--jade)">${opts[cmpSel].textContent}</span>`);fb('fbCmp','¡Correcto! +5 XP',true);if(!xpTracker.cmp.has(cmpIdx)){xpTracker.cmp.add(cmpIdx);pts(5);}sfx('ok');}else{opts[cmpSel].classList.add('wrong');opts[cmpData[cmpIdx].c].classList.add('correct');fb('fbCmp','Incorrecto. Revisa bien la respuesta.',false);sfx('no');}setTimeout(()=>{cmpIdx++;document.getElementById('fbCmp').classList.remove('show');showCmp();},1600);}

// ===================== WIDGETS =====================
// Widget 1: Ordenar secuencias
const routeSets=[
  {label:'Estructura de un texto narrativo',steps:['Inicio: se presentan los personajes y el lugar','Nudo: aparece el conflicto o problema','Clímax: el momento de mayor tensión','Desenlace: se resuelve la historia','Final: la situación queda cerrada']},
  {label:'Estructura de un texto argumentativo',steps:['Introducción: se presenta el tema','Tesis: la opinión que se va a defender','Argumentos: las razones que la apoyan','Contraargumento: se responde a otra idea','Conclusión: se cierra reafirmando la tesis']},
  {label:'Partes de un texto instructivo (receta)',steps:['Título de lo que se va a preparar','Lista de ingredientes o materiales','Pasos numerados en orden','Tiempo o consejos finales','Resultado: el plato terminado']},
];
let currentRouteIdx=0,routeItems=[];
function buildRoute(){routeItems=_shuffle([...routeSets[currentRouteIdx].steps]);renderRoute();const fbEl=document.getElementById('fbRoute');if(fbEl)fbEl.classList.remove('show');}
function renderRoute(){const list=document.getElementById('routeList');if(!list)return;list.innerHTML='';routeItems.forEach((step,i)=>{const div=document.createElement('div');div.className='sort-item';div.innerHTML=`<div class="sort-arrows"><button class="sort-arrow" onclick="routeMove(${i},-1)"${i===0?' disabled':''}>▲</button><button class="sort-arrow" onclick="routeMove(${i},1)"${i===routeItems.length-1?' disabled':''}>▼</button></div><div class="sort-step-num">${i+1}.</div><div class="sort-item-txt">${step}</div>`;list.appendChild(div);});}
function routeMove(idx,dir){sfx('click');const ni=idx+dir;if(ni<0||ni>=routeItems.length)return;[routeItems[idx],routeItems[ni]]=[routeItems[ni],routeItems[idx]];renderRoute();}
function checkRoute(){const correct=routeSets[currentRouteIdx].steps;const isOk=routeItems.every((s,i)=>s===correct[i]);if(isOk){fb('fbRoute','¡Perfecto! Orden correcto. +4 XP',true);if(!xpTracker.wgt.has('route_'+currentRouteIdx)){xpTracker.wgt.add('route_'+currentRouteIdx);pts(4);}sfx('fan');fin('s-widgets');unlockAchievement('widgets_master');}else{fb('fbRoute','Hay pasos fuera de orden. Revisa el arreglo.',false);sfx('no');}}
function nextRoute(){sfx('click');currentRouteIdx=(currentRouteIdx+1)%routeSets.length;buildRoute();showToast('🔄 Secuencia: '+routeSets[currentRouteIdx].label);}

// Widget 2: Identifica el tipo de texto
const neuronPartes=[
  {desc:'Cuenta hechos que les suceden a unos personajes en el tiempo',ans:'Narrativo',opts:['Narrativo','Descriptivo','Instructivo','Expositivo']},
  {desc:'Describe cómo es una persona, lugar u objeto usando adjetivos',ans:'Descriptivo',opts:['Descriptivo','Argumentativo','Dialogado','Narrativo']},
  {desc:'Informa y explica un tema de forma clara y objetiva',ans:'Expositivo',opts:['Expositivo','Poético','Instructivo','Narrativo']},
  {desc:'Defiende una opinión con razones para convencer al lector',ans:'Argumentativo',opts:['Argumentativo','Expositivo','Descriptivo','Dialogado']},
  {desc:'Indica los pasos para hacer algo, como una receta',ans:'Instructivo',opts:['Instructivo','Narrativo','Poético','Expositivo']},
  {desc:'Reproduce una conversación usando rayas de diálogo',ans:'Dialogado',opts:['Dialogado','Descriptivo','Argumentativo','Instructivo']},
  {desc:'Expresa sentimientos con lenguaje bello, casi siempre en verso',ans:'Poético',opts:['Poético','Expositivo','Instructivo','Narrativo']},
  {desc:'Parte de la estructura narrativa donde surge el conflicto',ans:'Nudo',opts:['Nudo','Inicio','Desenlace','Tesis']},
];
let neuronIdx=0,neuronDone=false;
function showNeuron(){neuronDone=false;if(neuronIdx>=neuronPartes.length){const el=document.getElementById('neuronDesc');if(el)el.textContent='🎉 ¡Todos los tipos identificados!';const opts=document.getElementById('neuronOpts');if(opts)opts.innerHTML='';fin('s-widgets');return;}const d=neuronPartes[neuronIdx];const prog=document.getElementById('neuronProg');if(prog)prog.textContent=`Texto ${neuronIdx+1} de ${neuronPartes.length}`;const desc=document.getElementById('neuronDesc');if(desc)desc.textContent=d.desc;const opts=document.getElementById('neuronOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=opt;b.onclick=()=>checkNeuron(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuron');if(fbEl)fbEl.classList.remove('show');}
function checkNeuron(opt,btn,d){if(neuronDone)return;neuronDone=true;document.querySelectorAll('#neuronOpts .cmp-opt').forEach(b=>{if(b.textContent===d.ans)b.classList.add('correct');else if(b===btn&&b.textContent!==d.ans)b.classList.add('wrong');});const isOk=opt===d.ans;if(isOk){fb('fbNeuron','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuron_'+neuronIdx)){xpTracker.wgt.add('neuron_'+neuronIdx);pts(3);}sfx('ok');}else{fb('fbNeuron','La respuesta correcta es: '+d.ans,false);sfx('no');}}
function nextNeuron(){sfx('click');neuronIdx++;showNeuron();}
function resetNeuron(){sfx('click');neuronIdx=0;showNeuron();}

// Widget 3: Tipo de texto → Propósito
const neuroPairs=[
  {trans:'Narrativo',func:'Contar hechos o historias',opts:['Contar hechos o historias','Describir cómo es algo','Convencer con razones','Indicar pasos para hacer algo']},
  {trans:'Descriptivo',func:'Describir cómo son personas, lugares u objetos',opts:['Describir cómo son personas, lugares u objetos','Contar una historia','Informar sobre un tema','Reproducir una conversación']},
  {trans:'Expositivo',func:'Informar y explicar de forma objetiva',opts:['Informar y explicar de forma objetiva','Expresar sentimientos en verso','Convencer al lector','Indicar los pasos de una receta']},
  {trans:'Argumentativo',func:'Convencer defendiendo una opinión',opts:['Convencer defendiendo una opinión','Describir un paisaje','Contar hechos','Dar instrucciones']},
  {trans:'Instructivo',func:'Indicar los pasos para hacer algo',opts:['Indicar los pasos para hacer algo','Contar una historia','Convencer con argumentos','Expresar emociones']},
];
let neuroIdx=0,neuroDone=false;
function showNeuro(){neuroDone=false;if(neuroIdx>=neuroPairs.length){const el=document.getElementById('neuroTrans');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('neuroOpts');if(opts)opts.innerHTML='';return;}const d=neuroPairs[neuroIdx];const prog=document.getElementById('neuroProg');if(prog)prog.textContent=`${neuroIdx+1} de ${neuroPairs.length}`;const trans=document.getElementById('neuroTrans');if(trans)trans.textContent=d.trans;const opts=document.getElementById('neuroOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkNeuro(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuro');if(fbEl)fbEl.classList.remove('show');}
function checkNeuro(opt,btn,d){if(neuroDone)return;neuroDone=true;document.querySelectorAll('#neuroOpts .qz-opt').forEach(b=>{if(b.textContent===d.func)b.classList.add('correct');else if(b===btn&&b.textContent!==d.func)b.classList.add('wrong');});const isOk=opt===d.func;if(isOk){fb('fbNeuro','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuro_'+neuroIdx)){xpTracker.wgt.add('neuro_'+neuroIdx);pts(3);}sfx('ok');}else{fb('fbNeuro','Correcto: '+d.func,false);sfx('no');}setTimeout(()=>{neuroIdx++;showNeuro();},1800);}
function resetNeuro(){sfx('click');neuroIdx=0;showNeuro();}

// Widget 4: Situación comunicativa → Tipo de texto adecuado
const enfermedadData=[
  {disease:'Quieres explicar los pasos para armar un cometa',characteristic:'Un texto instructivo',opts:['Un texto instructivo','Un poema','Una noticia','Una descripción']},
  {disease:'Quieres contarle a un amigo una aventura que viviste',characteristic:'Un texto narrativo',opts:['Un texto narrativo','Un texto instructivo','Un texto expositivo','Un afiche']},
  {disease:'Quieres convencer a tu clase de reciclar la basura',characteristic:'Un texto argumentativo',opts:['Un texto argumentativo','Una receta','Un cuento','Una descripción']},
  {disease:'Quieres informar en la enciclopedia qué es el agua',characteristic:'Un texto expositivo',opts:['Un texto expositivo','Un poema','Una obra de teatro','Un manual']},
  {disease:'Quieres decir cómo es tu mascota con muchos detalles',characteristic:'Un texto descriptivo',opts:['Un texto descriptivo','Un texto argumentativo','Una receta','Una noticia']},
  {disease:'Quieres expresar tus sentimientos hacia tu madre en verso',characteristic:'Un texto poético',opts:['Un texto poético','Un texto instructivo','Un informe','Una entrevista']},
];
let enferIdx=0,enferDone=false;
function showEnfer(){enferDone=false;if(enferIdx>=enfermedadData.length){const el=document.getElementById('enferDisease');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('enferOpts');if(opts)opts.innerHTML='';return;}const d=enfermedadData[enferIdx];const prog=document.getElementById('enferProg');if(prog)prog.textContent=`${enferIdx+1} de ${enfermedadData.length}`;const dis=document.getElementById('enferDisease');if(dis)dis.textContent=d.disease;const opts=document.getElementById('enferOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkEnfer(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbEnfer');if(fbEl)fbEl.classList.remove('show');}
function checkEnfer(opt,btn,d){if(enferDone)return;enferDone=true;document.querySelectorAll('#enferOpts .qz-opt').forEach(b=>{if(b.textContent===d.characteristic)b.classList.add('correct');else if(b===btn&&b.textContent!==d.characteristic)b.classList.add('wrong');});const isOk=opt===d.characteristic;if(isOk){fb('fbEnfer','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('enfer_'+enferIdx)){xpTracker.wgt.add('enfer_'+enferIdx);pts(3);}sfx('ok');}else{fb('fbEnfer','Correcto: '+d.characteristic,false);sfx('no');}setTimeout(()=>{enferIdx++;showEnfer();},1800);}
function resetEnfer(){sfx('click');enferIdx=0;showEnfer();}

// ===================== RETO FINAL =====================
const retoPairs=[
  {label:['Literario','No literario'],btnA:'📕 Literario',btnB:'📰 No literario',colA:'lit',colB:'nolit',
   words:[{w:'Cuento',t:'lit'},{w:'Noticia',t:'nolit'},{w:'Poema',t:'lit'},{w:'Receta',t:'nolit'},{w:'Novela',t:'lit'},{w:'Manual',t:'nolit'},{w:'Fábula',t:'lit'},{w:'Afiche',t:'nolit'},{w:'Leyenda',t:'lit'},{w:'Informe',t:'nolit'}]},
  {label:['Narrativo','Expositivo'],btnA:'📖 Narrativo',btnB:'📊 Expositivo',colA:'narr',colB:'expo',
   words:[{w:'Cuenta una historia',t:'narr'},{w:'Informa un tema',t:'expo'},{w:'Cuento',t:'narr'},{w:'Enciclopedia',t:'expo'},{w:'Personajes',t:'narr'},{w:'Datos objetivos',t:'expo'},{w:'Inicio, nudo, desenlace',t:'narr'},{w:'Introducción y desarrollo',t:'expo'},{w:'La leyenda',t:'narr'},{w:'El informe',t:'expo'}]},
  {label:['Informar','Convencer'],btnA:'📊 Informar',btnB:'⚖️ Convencer',colA:'expo',colB:'argu',
   words:[{w:'Artículo de ciencias',t:'expo'},{w:'Artículo de opinión',t:'argu'},{w:'Explica objetivo',t:'expo'},{w:'Defiende una tesis',t:'argu'},{w:'Sin opiniones',t:'expo'},{w:'Da argumentos',t:'argu'},{w:'Definición',t:'expo'},{w:'Ensayo',t:'argu'},{w:'Informe',t:'expo'},{w:'Reseña crítica',t:'argu'}]},
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
  {s:'El texto narrativo cuenta hechos que les suceden a unos personajes; tiene inicio, nudo y desenlace.',type:'Texto narrativo'},
  {s:'El texto descriptivo dice cómo son las personas, los lugares o los objetos, usando muchos adjetivos.',type:'Texto descriptivo'},
  {s:'El texto expositivo informa y explica un tema de manera clara y objetiva, sin dar opiniones.',type:'Texto expositivo'},
  {s:'El texto argumentativo defiende una tesis con argumentos para convencer al lector.',type:'Texto argumentativo'},
  {s:'El texto instructivo indica los pasos para hacer algo, como una receta o un manual.',type:'Texto instructivo'},
  {s:'El texto dialogado reproduce una conversación entre personajes usando rayas de diálogo.',type:'Texto dialogado'},
  {s:'El narrador es la voz que cuenta la historia; puede ser protagonista u omnisciente.',type:'El narrador'},
  {s:'El propósito comunicativo es la intención con la que se escribe y determina el tipo de texto.',type:'Propósito comunicativo'},
  {s:'Los textos literarios buscan crear belleza; los no literarios tienen una función práctica.',type:'Literario vs no literario'},
  {s:'Los conectores unen las ideas de un texto: de tiempo, de orden o de causa.',type:'Los conectores'},
];
const classifyTaskDB=[
  {w:'Cuento',gen:'Narrativo',n:'Literario',g:'Contar',t:'Relata una historia con personajes'},
  {w:'Receta',gen:'Instructivo',n:'No literario',g:'Indicar pasos',t:'Explica cómo preparar un plato'},
  {w:'Poema',gen:'Poético',n:'Literario',g:'Emocionar',t:'Expresa sentimientos en verso'},
  {w:'Noticia',gen:'Expositivo/Narrativo',n:'No literario',g:'Informar',t:'Informa sobre un hecho real'},
  {w:'Ensayo',gen:'Argumentativo',n:'No literario',g:'Convencer',t:'Defiende una opinión con razones'},
  {w:'Retrato',gen:'Descriptivo',n:'Puede ser literario',g:'Describir',t:'Dice cómo es una persona'},
  {w:'Obra de teatro',gen:'Dialogado',n:'Literario',g:'Representar',t:'Historia contada con diálogos'},
  {w:'Manual',gen:'Instructivo',n:'No literario',g:'Indicar pasos',t:'Explica cómo usar un aparato'},
];
const completeTaskDB=[
  {s:'El texto que cuenta una historia es el ___.',opts:['descriptivo','narrativo','instructivo'],ans:'narrativo'},
  {s:'La receta y el manual son textos ___.',opts:['narrativos','instructivos','poéticos'],ans:'instructivos'},
  {s:'El texto que describe con adjetivos es el ___.',opts:['expositivo','descriptivo','argumentativo'],ans:'descriptivo'},
  {s:'El texto que informa sin opinar es el ___.',opts:['argumentativo','expositivo','poético'],ans:'expositivo'},
  {s:'El texto que busca convencer es el ___.',opts:['argumentativo','descriptivo','dialogado'],ans:'argumentativo'},
  {s:'La estructura narrativa es inicio, nudo y ___.',opts:['tesis','desenlace','materiales'],ans:'desenlace'},
  {s:'La voz que cuenta la historia es el ___.',opts:['autor','narrador','lector'],ans:'narrador'},
  {s:'El poema es un texto ___.',opts:['poético','instructivo','expositivo'],ans:'poético'},
];
const explainQuestions=[
  {q:'¿Qué son los tipos de texto y qué los diferencia?',ans:'Son las clases de textos que existen según su propósito comunicativo (para qué se escriben). Se diferencian por su intención: contar (narrativo), describir (descriptivo), informar (expositivo), convencer (argumentativo), indicar pasos (instructivo) o conversar (dialogado).'},
  {q:'Explica la estructura del texto narrativo y menciona un ejemplo.',ans:'Tiene tres partes: inicio (se presentan personajes y lugar), nudo (surge el conflicto) y desenlace (se resuelve la historia). Ejemplos: el cuento, la fábula, la novela o la leyenda.'},
  {q:'¿En qué se diferencia un texto expositivo de uno argumentativo?',ans:'El expositivo informa y explica un tema de forma objetiva, sin opinar (una enciclopedia). El argumentativo defiende una opinión o tesis con argumentos para convencer al lector (un ensayo o artículo de opinión).'},
  {q:'¿Qué marcas lingüísticas ayudan a reconocer un texto instructivo?',ans:'Usa verbos en imperativo o infinitivo (mezcla, cortar), acciones numeradas y ordenadas en el tiempo, y a veces una lista de materiales o ingredientes al inicio. Ejemplos: receta, manual, reglas de un juego.'},
  {q:'¿Cuál es la diferencia entre un texto literario y uno no literario? Da ejemplos.',ans:'El literario busca crear belleza y emocionar (cuento, poema, novela). El no literario tiene una función práctica de informar o servir (noticia, receta, afiche, informe).'},
];
let ansVisible=false;
function genTask(){sfx('click');const type=document.getElementById('tgType').value;const count=parseInt(document.getElementById('tgCount').value);ansVisible=false;const out=document.getElementById('tgOut');out.innerHTML='';if(type==='identify')genIdentifyTask(out,count);else if(type==='classify')genClassifyTask(out,count);else if(type==='complete')genCompleteTask(out,count);else if(type==='explain')genExplainTask(out,count);fin('s-tareas');}
function _instrBlock(out,title,lines){const ib=document.createElement('div');ib.className='tg-instruction-block';ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join('');out.appendChild(ib);}
function genIdentifyTask(out,count){_instrBlock(out,'Instrucción',['Copia en tu cuaderno; subraya, colorea o encierra el concepto sobre tipos de texto indicado en cada oración. Escribe al lado qué tipo de elemento es.','<strong>Ejemplo:</strong> La receta indica los pasos. → <span style="color:var(--jade);font-weight:700;">Texto instructivo</span>']);_pick(identifyTaskDB,Math.min(count,identifyTaskDB.length)).forEach((item,i)=>{const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.type}</div></div>`;out.appendChild(div);});}
function genClassifyTask(out,count){_instrBlock(out,'Instrucción',['Copia la siguiente tabla en tu cuaderno. Para cada texto, completa su tipo, si es literario o no, su propósito y una breve descripción.']);const items=_pick(classifyTaskDB,Math.min(count,classifyTaskDB.length));const wrap=document.createElement('div');wrap.style.overflowX='auto';const th=(t,extra='')=>`<th style="padding:0.3rem 0.4rem;border:1px solid var(--border);font-size:0.72rem;text-align:center;${extra}">${t}</th>`;let html=`<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:520px;"><thead><tr style="background:var(--pri-gl);">${th('Texto','text-align:left;')}${th('Tipo')}${th('¿Literario?')}${th('Propósito')}${th('Descripción')}</tr></thead><tbody>`;items.forEach(it=>{html+=`<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td>`+Array(4).fill(`<td style="padding:0.4rem;border:1px solid var(--border);min-width:50px;"></td>`).join('')+'</tr>';});html+='</tbody></table>';wrap.innerHTML=html;out.appendChild(wrap);const ans=document.createElement('div');ans.className='tg-answer';ans.style.marginTop='0.8rem';ans.innerHTML='<strong>✅ Respuestas:</strong><br>'+items.map(it=>`<strong>${it.w}:</strong> Tipo: ${it.gen} | ${it.n} | Propósito: ${it.g} | ${it.t}`).join('<br>');out.appendChild(ans);}
function genCompleteTask(out,count){_instrBlock(out,'Instrucción',['Copia y resuelve en tu cuaderno. Cada oración tiene un espacio ___. Elige y escribe la opción correcta.']);const pool=_shuffle([...completeTaskDB]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';const sent=item.s.replace('___','<span class="tg-blank" style="min-width:90px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${sent}</strong><div style="margin-top:0.4rem;font-size:0.82rem;color:var(--gray);">📝 Opciones: <strong>${item.opts.join(' | ')}</strong></div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function genExplainTask(out,count){_instrBlock(out,'Instrucción',['Copia las siguientes preguntas en tu cuaderno y responde cada una de forma clara y completa.']);const pool=_shuffle([...explainQuestions]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.3rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function toggleAns(){ansVisible=!ansVisible;document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none');sfx('click');}

// ===================== SOPA DE LETRAS =====================
const sopaSets=[
  {size:10,grid:[
    ['N','A','R','R','A','T','I','V','O','K'],
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['P','O','E','M','A','B','C','D','F','G'],
    ['Z','X','C','V','B','N','M','K','L','J'],
    ['C','U','E','N','T','O','H','J','K','L'],
    ['P','L','M','O','K','N','J','I','B','H'],
    ['N','O','T','I','C','I','A','S','T','U'],
    ['G','Y','H','N','U','J','M','I','K','O'],
    ['D','I','A','L','O','G','O','W','X','Y'],
    ['R','E','C','E','T','A','M','N','B','V']
  ],words:[
    {w:'NARRATIVO',cells:[[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8]]},
    {w:'POEMA',cells:[[2,0],[2,1],[2,2],[2,3],[2,4]]},
    {w:'CUENTO',cells:[[4,0],[4,1],[4,2],[4,3],[4,4],[4,5]]},
    {w:'NOTICIA',cells:[[6,0],[6,1],[6,2],[6,3],[6,4],[6,5],[6,6]]},
    {w:'DIALOGO',cells:[[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,6]]},
    {w:'RECETA',cells:[[9,0],[9,1],[9,2],[9,3],[9,4],[9,5]]}
  ]},
  {size:10,grid:[
    ['E','X','P','O','S','I','T','I','V','O'],
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['N','A','R','R','A','D','O','R','K','L'],
    ['Z','X','C','V','B','N','M','K','L','J'],
    ['P','A','R','R','A','F','O','X','Y','Z'],
    ['P','O','I','U','Y','T','R','E','W','Q'],
    ['F','A','B','U','L','A','M','N','B','V'],
    ['M','N','B','V','C','X','Z','A','S','D'],
    ['M','A','N','U','A','L','K','L','P','R'],
    ['T','E','S','I','S','C','O','D','E','F']
  ],words:[
    {w:'EXPOSITIVO',cells:[[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[0,9]]},
    {w:'NARRADOR',cells:[[2,0],[2,1],[2,2],[2,3],[2,4],[2,5],[2,6],[2,7]]},
    {w:'PARRAFO',cells:[[4,0],[4,1],[4,2],[4,3],[4,4],[4,5],[4,6]]},
    {w:'FABULA',cells:[[6,0],[6,1],[6,2],[6,3],[6,4],[6,5]]},
    {w:'MANUAL',cells:[[8,0],[8,1],[8,2],[8,3],[8,4],[8,5]]},
    {w:'TESIS',cells:[[9,0],[9,1],[9,2],[9,3],[9,4]]}
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
  {q:'El tipo de un texto depende de su propósito comunicativo.',a:true},
  {q:'El texto narrativo sirve para dar instrucciones paso a paso.',a:false},
  {q:'La estructura del texto narrativo es inicio, nudo y desenlace.',a:true},
  {q:'El texto descriptivo usa muchos adjetivos para decir cómo es algo.',a:true},
  {q:'El texto expositivo defiende una opinión para convencer.',a:false},
  {q:'El texto argumentativo presenta una tesis y argumentos.',a:true},
  {q:'Una receta de cocina es un texto instructivo.',a:true},
  {q:'El texto dialogado se reconoce por las rayas de diálogo.',a:true},
  {q:'El poema es un texto no literario.',a:false},
  {q:'El narrador es la voz que cuenta la historia.',a:true},
  {q:'La noticia y el informe son textos literarios.',a:false},
  {q:'El texto expositivo informa de forma clara y objetiva.',a:true},
  {q:'Los conectores unen las ideas de un texto.',a:true},
  {q:'El texto instructivo suele usar verbos en imperativo o infinitivo.',a:true},
  {q:'Contar una historia es el propósito del texto descriptivo.',a:false},
];
const evalMCBank=[
  {q:'¿Qué determina el tipo de un texto?',o:['a) Su tamaño','b) Su propósito comunicativo','c) El autor','d) El título'],a:1},
  {q:'¿Qué texto cuenta hechos con personajes?',o:['a) Descriptivo','b) Narrativo','c) Instructivo','d) Expositivo'],a:1},
  {q:'Una receta es un texto...',o:['a) Poético','b) Narrativo','c) Instructivo','d) Argumentativo'],a:2},
  {q:'¿Cuál es el propósito del texto argumentativo?',o:['a) Informar','b) Convencer','c) Describir','d) Contar'],a:1},
  {q:'¿Qué texto usa muchos adjetivos?',o:['a) Descriptivo','b) Instructivo','c) Expositivo','d) Dialogado'],a:0},
  {q:'¿Cuáles son las partes de la estructura narrativa?',o:['a) Tesis y argumentos','b) Inicio, nudo y desenlace','c) Materiales y pasos','d) Saludo y despedida'],a:1},
  {q:'Un artículo de enciclopedia es un texto...',o:['a) Expositivo','b) Poético','c) Instructivo','d) Argumentativo'],a:0},
  {q:'¿Qué texto se reconoce por las rayas de diálogo?',o:['a) Expositivo','b) Dialogado','c) Descriptivo','d) Instructivo'],a:1},
  {q:'¿Cuál es un texto literario?',o:['a) La noticia','b) La receta','c) El poema','d) El informe'],a:2},
  {q:'La voz que cuenta la historia se llama...',o:['a) Autor','b) Narrador','c) Lector','d) Personaje'],a:1},
  {q:'¿Qué texto informa sin dar opiniones?',o:['a) Argumentativo','b) Expositivo','c) Poético','d) Narrativo'],a:1},
  {q:'El ensayo es un ejemplo de texto...',o:['a) Instructivo','b) Descriptivo','c) Argumentativo','d) Dialogado'],a:2},
  {q:'¿Qué texto expresa sentimientos en verso?',o:['a) Poético','b) Expositivo','c) Instructivo','d) Narrativo'],a:0},
  {q:'La obra de teatro es un texto...',o:['a) Expositivo','b) Dialogado','c) Instructivo','d) Descriptivo'],a:1},
  {q:'¿Qué palabras unen las ideas de un texto?',o:['a) Los adjetivos','b) Los conectores','c) Los verbos','d) Los sustantivos'],a:1},
];
const evalCPBank=[
  {q:'El texto que cuenta una historia es el ___.',a:'narrativo'},
  {q:'El texto que describe cómo es algo es el ___.',a:'descriptivo'},
  {q:'El texto que informa un tema sin opinar es el ___.',a:'expositivo'},
  {q:'El texto que defiende una opinión es el ___.',a:'argumentativo'},
  {q:'El texto que indica los pasos para hacer algo es el ___.',a:'instructivo'},
  {q:'El texto que reproduce una conversación es el ___.',a:'dialogado'},
  {q:'El texto que expresa sentimientos en verso es el ___.',a:'poético'},
  {q:'La voz que cuenta la historia es el ___.',a:'narrador'},
  {q:'La parte final de la estructura narrativa es el ___.',a:'desenlace'},
  {q:'La opinión que defiende un texto argumentativo es la ___.',a:'tesis'},
  {q:'El propósito ___ es la intención con que se escribe un texto.',a:'comunicativo'},
  {q:'La receta y el manual son ejemplos de texto ___.',a:'instructivo'},
  {q:'El cuento, la novela y el poema son textos ___.',a:'literarios'},
  {q:'Las palabras que unen las ideas del texto son los ___.',a:'conectores'},
  {q:'La parte donde surge el conflicto en la narración es el ___.',a:'nudo'},
];
const evalPRBank=[
  {term:'Texto narrativo',def:'Cuenta hechos o historias'},
  {term:'Texto descriptivo',def:'Dice cómo son personas u objetos'},
  {term:'Texto expositivo',def:'Informa y explica de forma objetiva'},
  {term:'Texto argumentativo',def:'Defiende una opinión con razones'},
  {term:'Texto instructivo',def:'Indica los pasos para hacer algo'},
  {term:'Texto dialogado',def:'Reproduce una conversación'},
  {term:'Texto poético',def:'Expresa sentimientos en verso'},
  {term:'Narrador',def:'Voz que cuenta la historia'},
  {term:'Desenlace',def:'Parte final donde se resuelve el conflicto'},
  {term:'Tesis',def:'Opinión que se defiende'},
  {term:'Receta',def:'Ejemplo de texto instructivo'},
  {term:'Noticia',def:'Texto no literario que informa un hecho'},
  {term:'Conectores',def:'Palabras que unen las ideas'},
  {term:'Nudo',def:'Parte donde surge el conflicto'},
  {term:'Propósito comunicativo',def:'Intención con la que se escribe'},
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

function genEval(){sfx('click');_evalFormaSelector(); const _selF = document.getElementById('evalFormaSel'); if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10))); const cf = evalFormNum; const rng = _evalRng(cf); /* la Forma cf siembra TODO el azar de esta evaluación */window._currentEvalForm=cf;evalFormNum = (evalFormNum % EVAL_FORMAS) + 1; _evalFormaSelector();saveProgress();document.getElementById('eval-screen-title').textContent=`🎓 Evaluación Final · Forma ${cf} · Los Tipos de Textos`;evalAnsVisible=false;const out=document.getElementById('evalOut');out.innerHTML='';const bar=document.createElement('div');bar.className='eval-score-bar';bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje · 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25 pts</span><span class="eval-score-pill esp-tf">V/F 25 pts</span><span class="eval-score-pill esp-mc">Selección 25 pts</span><span class="eval-score-pill esp-pr">Pareados 25 pts</span></div>`;out.appendChild(bar);const cpItems=_pickF(evalCPBank,5, rng);const s1=document.createElement('div');s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';cpItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='cp';d.dataset.evalIndex=i;const qHtml=item.q.replace('___',`<input class="eval-cp-input" type="text" data-cp="${i}" autocomplete="off">`);d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbCp${i}" aria-live="polite"></div>`;s1.appendChild(d);});out.appendChild(s1);const tfItems=_pickF(evalTFBank,5, rng);const s2=document.createElement('div');s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';tfItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='tf';d.dataset.evalIndex=i;d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="true"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="false"> Falso</label></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbTf${i}" aria-live="polite"></div>`;s2.appendChild(d);});out.appendChild(s2);const mcItems=_pickF(evalMCBank,5, rng);const s3=document.createElement('div');s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';mcItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='mc';d.dataset.evalIndex=i;const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join('');d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbMc${i}" aria-live="polite"></div>`;s3.appendChild(d);});out.appendChild(s3);const prItems=_pickF(evalPRBank,5, rng);const shuffledDefs=_shuffleF(prItems, rng);const letters=['A','B','C','D','E'];const s4=document.createElement('div');s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';const matchCard=document.createElement('div');matchCard.className='eval-item';let colLeft='<div class="eval-match-col"><h4>📌 Términos</h4>';prItems.forEach((item,i)=>{colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> <select class="eval-match-select" data-pr="${i}" aria-label="Respuesta pareada ${i+16}"><option value="">—</option>${letters.map(l=>`<option value="${l}">${l}</option>`).join('')}</select> ${item.term}</div>`;});colLeft+='</div>';let colRight='<div class="eval-match-col"><h4>🔑 Definiciones</h4>';shuffledDefs.forEach((item,i)=>{colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`;});colRight+='</div>';const ansKey=prItems.map((item,i)=>{const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)];return`${i+16}→${letter}`;}).join(' · ');matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div><div class="eval-item-feedback" id="evalFbPr" aria-live="polite"></div>`;s4.appendChild(matchCard);out.appendChild(s4);window._evalPrintData={tf:tfItems,mc:mcItems,cp:cpItems,pr:{terms:prItems,shuffledDefs,letters}};const autoPanel=document.createElement('div');autoPanel.id='evalAutoResult';autoPanel.className='eval-auto-result';autoPanel.innerHTML='<strong>🧮 Evaluación interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato original sin respuestas digitadas.';out.appendChild(autoPanel);fin('s-evaluacion');}
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación Los Tipos de Textos · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.12rem 0.4rem;margin:0.22rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #c49000;background:#fef9e7;color:#c49000;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#c49000;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #c49000;height:12px;}.obt-pct{white-space:nowrap;}.qn{font-weight:700;min-width:22px;flex-shrink:0;}.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:40px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.18rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.14rem 0.35rem;margin-bottom:0.1rem;break-inside:avoid;page-break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.3;display:flex;gap:0.28rem;margin-bottom:0.07rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.1rem 0.5rem;}.mc-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:0.04rem 0.15rem;margin-left:0.8rem;}.mc-opt{font-size:9pt;display:flex;align-items:center;gap:0.15rem;}.mc-opt input{width:10px;height:10px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{margin-top:0.1rem;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.08rem 0.4rem;margin-top:0.08rem;}.pr-head{font-size:9pt;font-weight:700;color:#555;margin-bottom:0.1rem;}.pr-item{font-size:10.5pt;padding:0.1rem 0.28rem;background:#fef9e7;border-radius:3px;margin-bottom:0.07rem;display:flex;align-items:center;gap:0.2rem;line-height:1.2;break-inside:avoid;page-break-inside:avoid;}.pr-num{font-weight:700;color:#c49000;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.22rem;padding:0.15rem 0;page-break-before:avoid;break-before:avoid;color:#c49000;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #c49000;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#555;}.pa{color:#007a00;font-weight:600;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · Los Tipos de Textos · Educación Básica · Español</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Evaluación Final · Los Tipos de Textos · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u</div></div><div class="p-grid">${pR}</div>
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
  {txt:'"Primero, lava las manzanas. Luego, córtalas en trozos pequeños. Después, mézclalas con el yogur y añade la miel. Finalmente, sirve la ensalada bien fría."'},
  {txt:'"Había una vez un zorro muy astuto que vivía en el bosque. Un día encontró un racimo de uvas muy altas. Saltó y saltó, pero no las alcanzó. Al final se marchó diciendo que estaban verdes."'},
  {txt:'"El agua es un líquido incoloro, inodoro e insípido. Está formada por hidrógeno y oxígeno. Es fundamental para la vida de los seres vivos y cubre gran parte del planeta."'},
  {txt:'"Considero que debemos reciclar la basura en la escuela. En primer lugar, cuidamos el ambiente. Además, damos ejemplo a los más pequeños. Por lo tanto, todos deberíamos separar los residuos."'},
  {txt:'"Mi abuela tenía el cabello blanco como la nieve y unos ojos pequeños y brillantes. Sus manos eran arrugadas y suaves, y siempre olían a canela y a pan recién horneado."'},
  {txt:'"—¿A dónde vas tan temprano? —preguntó María. —Voy al mercado a comprar frutas —respondió Juan—. ¿Quieres acompañarme? —¡Claro! Espera un momento."'},
];
const critCaseQuestions=[
  '1. ¿Qué tipo de texto es? Justifica tu respuesta.',
  '2. ¿Cuál es su propósito comunicativo (para qué se escribió)?',
  '3. ¿Qué marcas o pistas del lenguaje te ayudaron a reconocerlo?',
  '4. Menciona otro ejemplo del mismo tipo de texto.',
];
const critCaseGuides=[
  'Es un texto instructivo: indica los pasos para hacer algo. Propósito: enseñar a preparar una ensalada. Marcas: verbos en imperativo (lava, corta, mezcla) y conectores de orden (primero, luego, después, finalmente). Otro ejemplo: un manual o las reglas de un juego.',
  'Es un texto narrativo (una fábula): cuenta una historia con un personaje. Propósito: contar/entretener y dejar una enseñanza. Marcas: verbos de acción en pasado, estructura de inicio, nudo y desenlace. Otro ejemplo: un cuento o una leyenda.',
  'Es un texto expositivo: informa sobre un tema de forma objetiva, sin opinar. Propósito: explicar qué es el agua. Marcas: lenguaje claro, tercera persona, datos objetivos. Otro ejemplo: un artículo de enciclopedia.',
  'Es un texto argumentativo: defiende una opinión. Propósito: convencer de reciclar. Marcas: verbo de opinión (considero), tesis y conectores lógicos (en primer lugar, además, por lo tanto). Otro ejemplo: un artículo de opinión.',
  'Es un texto descriptivo: dice cómo es una persona. Propósito: describir a la abuela. Marcas: abundancia de adjetivos (blanco, pequeños, brillantes, arrugadas) y comparaciones. Otro ejemplo: un retrato o la descripción de un paisaje.',
  'Es un texto dialogado: reproduce una conversación. Propósito: mostrar lo que dicen los personajes. Marcas: rayas de diálogo, signos de interrogación y turnos de habla. Otro ejemplo: una obra de teatro o una entrevista.',
];

const critErrorBank=[
  {txt:'"El texto narrativo sirve para dar instrucciones paso a paso, y por eso una receta de cocina es un buen ejemplo de texto narrativo."',
   g1:'El texto narrativo cuenta hechos o historias, no da instrucciones paso a paso.',
   g2:'La receta es un texto instructivo, no narrativo.'},
  {txt:'"El texto expositivo defiende una opinión para convencer al lector, igual que hace un artículo de opinión."',
   g1:'El texto expositivo informa de forma objetiva, no defiende opiniones.',
   g2:'El que defiende una opinión para convencer es el argumentativo; el artículo de opinión es argumentativo.'},
  {txt:'"La estructura del texto narrativo es introducción, tesis y conclusión, y siempre se escribe en verso."',
   g1:'La estructura narrativa es inicio, nudo y desenlace, no introducción-tesis-conclusión.',
   g2:'No se escribe en verso; el que suele ir en verso es el texto poético.'},
  {txt:'"El poema es un texto no literario y su propósito es informar datos exactos sobre un tema."',
   g1:'El poema es un texto literario, no no literario.',
   g2:'Su propósito es expresar sentimientos con belleza, no informar datos exactos.'},
  {txt:'"El texto descriptivo cuenta una historia con inicio, nudo y desenlace usando verbos de acción."',
   g1:'El texto descriptivo describe cómo es algo; el que cuenta una historia es el narrativo.',
   g2:'Lo propio del descriptivo son los adjetivos, no la estructura de inicio, nudo y desenlace.'},
  {txt:'"El narrador es el autor real que escribió el libro, y siempre cuenta la historia en tercera persona."',
   g1:'El narrador es la voz interna que cuenta la historia, no necesariamente el autor real.',
   g2:'No siempre es en tercera persona: puede ser narrador protagonista, que cuenta en primera persona.'},
];

const critDecisionBank=[
  'Tu maestra te pide que expliques a tus compañeros, paso a paso, cómo elaborar un títere con una media.',
  'Quieres escribir en el periódico escolar para convencer a todos de cuidar los árboles del patio.',
  'Debes redactar para la enciclopedia de la clase una explicación objetiva sobre el ciclo del agua.',
  'Quieres contarle a tu familia, como una historia, la aventura que viviste durante un paseo.',
  'Tu profesora te pide describir con muchos detalles cómo es tu lugar favorito de la escuela.',
];
const critDecisionGuide='Debe identificar el tipo de texto adecuado según el propósito (instructivo para explicar pasos, argumentativo para convencer, expositivo para informar, narrativo para contar, descriptivo para describir), explicar por qué ese tipo es el correcto y mencionar sus marcas o su estructura (por ejemplo, verbos en imperativo y pasos numerados en el instructivo; tesis y argumentos en el argumentativo).';

const critCompareBank=[
  {a:'"El agua hierve a 100 grados centígrados al nivel del mar. Está formada por hidrógeno y oxígeno."',b:'"Creo que todos deberíamos ahorrar agua, porque es un recurso escaso y sin ella no hay vida."',
   ga:'Texto expositivo: informa un dato objetivo, sin opinión.',
   gb:'Texto argumentativo: defiende una opinión (ahorrar agua) con razones.',
   gr:'No son el mismo tipo: uno solo informa de forma objetiva y el otro busca convencer dando argumentos.'},
  {a:'"Había una vez una niña que vivía en un bosque y un día se perdió camino a casa de su abuela."',b:'"Corta el papel en cuadros, dóblalo por la mitad y pégalo sobre la cartulina."',
   ga:'Texto narrativo: cuenta una historia con personajes y acontecimientos.',
   gb:'Texto instructivo: indica los pasos para hacer algo con verbos en imperativo.',
   gr:'No son el mismo tipo: uno cuenta hechos en el tiempo y el otro ordena acciones para lograr un resultado.'},
  {a:'"La casa era grande, de paredes blancas y un techo rojo rodeado de flores de muchos colores."',b:'"Ayer llegué tarde a casa, dejé la mochila y salí corriendo a jugar con mis amigos."',
   ga:'Texto descriptivo: dice cómo es la casa usando adjetivos.',
   gb:'Texto narrativo: cuenta acciones que ocurrieron en el tiempo.',
   gr:'No son el mismo tipo: uno describe cómo es algo y el otro relata qué sucedió.'},
  {a:'"—¿Terminaste la tarea? —preguntó mamá. —Todavía no —contesté yo."',b:'"El delfín es un mamífero marino muy inteligente que se comunica con sonidos."',
   ga:'Texto dialogado: reproduce una conversación con rayas de diálogo.',
   gb:'Texto expositivo: informa sobre un tema de forma objetiva.',
   gr:'No son el mismo tipo: uno muestra un diálogo entre personajes y el otro explica un tema.'},
];

const critCauseBank=[
  {cause:'Un texto usa verbos en imperativo (mezcla, corta) y numera las acciones en orden.',guide:'Es un texto instructivo, porque indica los pasos para hacer algo.'},
  {cause:'Un texto presenta una tesis y la defiende con argumentos y conectores como "por lo tanto".',guide:'Es un texto argumentativo, cuyo propósito es convencer al lector.'},
  {cause:'Un texto está lleno de adjetivos y responde a la pregunta "¿cómo es?".',guide:'Es un texto descriptivo, porque describe cómo son las personas o las cosas.'},
  {cause:'Un texto cuenta hechos con personajes y tiene inicio, nudo y desenlace.',guide:'Es un texto narrativo, porque relata una historia en el tiempo.'},
];
const critEffectBank=[
  {effect:'El lector aprende, paso a paso, cómo preparar un plato de comida.',guide:'Se usó un texto instructivo, como una receta.'},
  {effect:'El lector queda convencido de una opinión gracias a las razones dadas.',guide:'Se usó un texto argumentativo, como un ensayo o artículo de opinión.'},
  {effect:'El lector se informa de forma objetiva sobre qué es un volcán.',guide:'Se usó un texto expositivo, como un artículo de enciclopedia.'},
  {effect:'El lector se emociona con una historia de personajes y aventuras.',guide:'Se usó un texto narrativo, como un cuento o una novela.'},
];

function genEvalCrit(){
  sfx('click');
  _injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });
  const _sC = document.getElementById('evalCritFormaSel');
  if (_sC && parseInt(_sC.value, 10)) evalCritFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sC.value, 10)));
  const cf=evalCritFormNum;window._currentEvalCritForm=cf;
  const rngC = _evalRng(200000 + cf);
  evalCritFormNum=(evalCritFormNum%EVAL_FORMAS)+1;
  _injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });
  saveProgress();
  document.getElementById('evalcrit-screen-title').textContent=`🧠 Pensamiento Crítico · Forma ${cf} · Los Tipos de Textos`;
  evalCritAnsVisible=false;
  const out=document.getElementById('evalCritOut');out.innerHTML='';

  const kase=_pickF(critCaseBank,1,rngC)[0];
  const s1=document.createElement('div');
  s1.innerHTML=`<div class="eval-section-title">I. Caso de análisis: ¿qué tipo de texto es? <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${kase.txt}</div>${critCaseQuestions.map((q,i)=>`<div class="crit-q-block"><div class="crit-q-label">${q}</div><textarea class="crit-textarea" rows="2" aria-label="${q}"></textarea><div class="crit-pauta">${critCaseGuides[i]}</div></div>`).join('')}<div class="crit-selfscore"><label for="critScore0">Obtenido:</label><input type="number" id="critScore0" class="crit-score-input" data-score="0" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s1);

  const err=_pickF(critErrorBank,1,rngC)[0];
  const s2=document.createElement('div');
  s2.innerHTML=`<div class="eval-section-title">II. Corrige el error <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${err.txt}</div><p style="font-size:0.85rem;margin-bottom:0.5rem;">Identifica <strong>dos errores</strong> y corrígelos con tus propias palabras:</p><div class="crit-q-block"><div class="crit-q-label">Error 1 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 1 y su corrección"></textarea><div class="crit-pauta">${err.g1}</div></div><div class="crit-q-block"><div class="crit-q-label">Error 2 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 2 y su corrección"></textarea><div class="crit-pauta">${err.g2}</div></div><div class="crit-selfscore"><label for="critScore1">Obtenido:</label><input type="number" id="critScore1" class="crit-score-input" data-score="1" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s2);

  const dec=_pickF(critDecisionBank,1,rngC)[0];
  const s3=document.createElement('div');
  s3.innerHTML=`<div class="eval-section-title">III. Toma de decisiones: elige el texto adecuado <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${dec}</div><div class="crit-q-block"><div class="crit-q-label">¿Qué tipo de texto usarías? Explica por qué y menciona sus marcas o su estructura.</div><textarea class="crit-textarea" rows="4" aria-label="Tipo de texto elegido y justificación"></textarea><div class="crit-pauta">${critDecisionGuide}</div></div><div class="crit-selfscore"><label for="critScore2">Obtenido:</label><input type="number" id="critScore2" class="crit-score-input" data-score="2" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s3);

  const cmp=_pickF(critCompareBank,1,rngC)[0];
  const s4=document.createElement('div');
  s4.innerHTML=`<div class="eval-section-title">IV. Comparación razonada <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-compare-grid"><div class="crit-compare-box"><h5>Texto A</h5>${cmp.a}</div><div class="crit-compare-box"><h5>Texto B</h5>${cmp.b}</div></div><div class="crit-q-block"><div class="crit-q-label">1. ¿Qué tipo de texto es cada uno? 2. ¿Qué pistas lo indican? 3. ¿Por qué no son el mismo tipo?</div><textarea class="crit-textarea" rows="4" aria-label="Comparación razonada de los textos A y B"></textarea><div class="crit-pauta">Texto A: ${cmp.ga} · Texto B: ${cmp.gb} · ${cmp.gr}</div></div><div class="crit-selfscore"><label for="critScore3">Obtenido:</label><input type="number" id="critScore3" class="crit-score-input" data-score="3" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s4);

  const causes=_pickF(critCauseBank,2,rngC),effects=_pickF(critEffectBank,3,rngC);
  let ceRows='';
  causes.forEach((it,i)=>{ceRows+=`<div class="crit-ce-item"><div class="crit-ce-row"><div class="crit-ce-cell crit-ce-given"><span class="crit-ce-tag">Pista del texto</span>${it.cause}</div><div class="crit-ce-cell"><span class="crit-ce-tag">¿Qué tipo es?</span><textarea class="crit-textarea" rows="2" aria-label="Tipo de texto de: ${it.cause}" placeholder="Escribe el tipo de texto..."></textarea></div></div><div class="crit-pauta">${it.guide}</div></div>`;});
  effects.forEach((it,i)=>{ceRows+=`<div class="crit-ce-item"><div class="crit-ce-row"><div class="crit-ce-cell"><span class="crit-ce-tag">¿Qué texto se usó?</span><textarea class="crit-textarea" rows="2" aria-label="Texto que produjo: ${it.effect}" placeholder="Escribe el tipo de texto..."></textarea></div><div class="crit-ce-cell crit-ce-given"><span class="crit-ce-tag">Efecto en el lector</span>${it.effect}</div></div><div class="crit-pauta">${it.guide}</div></div>`;});
  const s5=document.createElement('div');
  s5.innerHTML=`<div class="eval-section-title">V. Relaciona pista y tipo de texto <span class="eval-pts">20 pts</span></div><div class="eval-item">${ceRows}<div class="crit-selfscore"><label for="critScore4">Obtenido:</label><input type="number" id="critScore4" class="crit-score-input" data-score="4" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
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
  let s1=`<div class="sec-title"><span>I. Caso de análisis: ¿qué tipo de texto es?</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.kase.txt}</p>`;
  critCaseQuestions.forEach(q=>{s1+=`<p class="crit-print-q">${q}</p>${lines(1)}`;});
  let s2=`<div class="sec-title"><span>II. Corrige el error</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.err.txt}</p><p class="crit-print-q">Identifica dos errores y corrígelos con tus propias palabras:</p><p class="crit-print-q"><strong>Error 1:</strong></p>${lines(1)}<p class="crit-print-q"><strong>Error 2:</strong></p>${lines(1)}`;
  let s3=`<div class="sec-title"><span>III. Toma de decisiones: elige el texto adecuado</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.dec}</p><p class="crit-print-q">¿Qué tipo de texto usarías? Explica por qué y menciona sus marcas o su estructura.</p>${lines(2)}`;
  let s4=`<div class="sec-title"><span>IV. Comparación razonada</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><div class="crit-compare-print-grid"><div class="crit-compare-print-box"><strong>Texto A:</strong> ${d.cmp.a}</div><div class="crit-compare-print-box"><strong>Texto B:</strong> ${d.cmp.b}</div></div><p class="crit-print-q">1. ¿Qué tipo de texto es cada uno? 2. ¿Qué pistas lo indican? 3. ¿Por qué no son el mismo tipo?</p>${lines(2)}`;
  let ceTbl='<table class="crit-print-tbl"><tr><th>Pista / Efecto</th><th>Tipo de texto</th></tr>';
  d.causes.forEach(it=>{ceTbl+=`<tr><td>${it.cause}</td><td></td></tr>`;});
  d.effects.forEach(it=>{ceTbl+=`<tr><td>${it.effect}</td><td></td></tr>`;});
  ceTbl+='</table>';
  let s5=`<div class="sec-title"><span>V. Relaciona pista y tipo de texto</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div>${ceTbl}`;
  let pR='';
  pR+=`<div class="p-sec"><div class="p-ttl">I. Caso</div>${critCaseQuestions.map((q,i)=>`<div class="p-crit-line"><strong>${i+1}.</strong> ${critCaseGuides[i]}</div>`).join('')}</div>`;
  pR+=`<div class="p-sec"><div class="p-ttl">II. Corrige el error</div><div class="p-crit-line"><strong>Error 1:</strong> ${d.err.g1}</div><div class="p-crit-line"><strong>Error 2:</strong> ${d.err.g2}</div></div>`;
  pR+=`<div class="p-sec"><div class="p-ttl">III. Toma de decisiones</div><div class="p-crit-line">${critDecisionGuide}</div></div>`;
  pR+=`<div class="p-sec"><div class="p-ttl">IV. Comparación</div><div class="p-crit-line"><strong>Texto A:</strong> ${d.cmp.ga}</div><div class="p-crit-line"><strong>Texto B:</strong> ${d.cmp.gb}</div><div class="p-crit-line">${d.cmp.gr}</div></div>`;
  pR+=`<div class="p-sec" style="grid-column:1/-1;"><div class="p-ttl">V. Pista y tipo</div>${d.causes.map(it=>`<div class="p-crit-line"><strong>Pista:</strong> ${it.cause} → ${it.guide}</div>`).join('')}${d.effects.map(it=>`<div class="p-crit-line"><strong>Efecto:</strong> ${it.effect} → ${it.guide}</div>`).join('')}</div>`;
  const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Pensamiento Crítico Los Tipos de Textos · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.1rem 0.4rem;margin:0.2rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #c49000;background:#fef9e7;color:#c49000;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#c49000;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #c49000;height:12px;}.obt-pct{white-space:nowrap;}.crit-print-scenario{font-size:10.5pt;background:#fef9e7;border-left:3px solid #c49000;padding:0.2rem 0.5rem;margin:0.1rem 0 0.2rem;line-height:1.3;}.crit-print-q{font-size:10pt;font-weight:600;margin:0.15rem 0 0.08rem;line-height:1.25;}.ln{border-bottom:1px solid #111;min-height:12px;margin-bottom:2px;}.crit-compare-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin:0.15rem 0;}.crit-compare-print-box{font-size:9.5pt;background:#fef9e7;border-radius:4px;padding:0.25rem 0.4rem;line-height:1.25;}.crit-print-tbl{width:100%;border-collapse:collapse;font-size:9.5pt;margin-top:0.15rem;}.crit-print-tbl th,.crit-print-tbl td{border:1px solid #999;padding:0.3rem 0.45rem;text-align:left;height:30px;vertical-align:middle;}.crit-print-tbl th{background:#fef9e7;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:9.5pt;font-weight:700;}.p-sub{font-size:7pt;color:#c00;font-weight:700;margin:0.08rem 0;}.p-meta{font-size:7pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.9rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.45rem;}.p-ttl{font-size:8pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.1rem;margin-bottom:0.18rem;}.p-crit-line{font-size:7.5pt;color:#c49000;margin-bottom:0.18rem;line-height:1.35;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.2rem;padding:0.1rem 0;color:#c49000;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #c49000;}.forma-tag{position:fixed;bottom:5mm;right:6mm;font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;}@media print{@page{size:letter portrait;margin:12.7mm;}}</style></head><body><div class="ph"><h2>Evaluación Competencial · Pensamiento Crítico · Los Tipos de Textos · Educación Básica · Español</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Institución:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 5 secciones de 20 puntos</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100</span></div><div class="pauta-wrap"><div class="p-head"><div class="p-main">✅ PAUTA — Pensamiento Crítico · Los Tipos de Textos · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 5 secciones × 20 pts c/u — respuesta abierta, usar como guía de corrección</div></div><div class="p-grid">${pR}</div></div><div class="forma-tag">Forma ${forma}</div></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(doc);win.document.close();setTimeout(()=>win.print(),400);
}

// ===================== LABORATORIO DE TEXTOS =====================
const parteData={
  narrativo:{
    nombre:'Texto narrativo',icon:'📖',
    queEs:{title:'¿Qué es?',info:'• <strong>Cuenta hechos o historias</strong> que les suceden a unos personajes<br>• Los hechos ocurren en un <strong>tiempo</strong> y un <strong>lugar</strong><br>• Su propósito es <strong>contar y entretener</strong><br>• Puede ser real (una anécdota) o imaginario (un cuento)<br>• Es un tipo de texto muy común en la literatura'},
    estructura:{title:'Estructura',info:'• <strong>Inicio</strong>: se presentan los personajes y el lugar<br>• <strong>Nudo</strong>: aparece el conflicto o problema<br>• <strong>Desenlace</strong>: se resuelve la historia<br>• Interviene un <strong>narrador</strong>, que es la voz que cuenta<br>• Hay <strong>personajes</strong> principales y secundarios'},
    marcas:{title:'Cómo reconocerlo',info:'• <strong>Verbos de acción</strong>, casi siempre en <strong>pasado</strong><br>• <strong>Conectores de tiempo</strong>: después, luego, entonces, al final<br>• Presencia de un <strong>narrador</strong> y personajes<br>• Los hechos se ordenan en el <strong>tiempo</strong><br>• Responde a: "¿qué pasó?"'},
    ejemplos:{title:'Ejemplos',info:'• El <strong>cuento</strong><br>• La <strong>novela</strong><br>• La <strong>fábula</strong> (deja una enseñanza)<br>• La <strong>leyenda</strong> y el <strong>mito</strong><br>• La <strong>noticia</strong> y la <strong>anécdota</strong>'}
  },
  descriptivo:{
    nombre:'Texto descriptivo',icon:'🖼️',
    queEs:{title:'¿Qué es?',info:'• <strong>Describe cómo son</strong> personas, animales, lugares u objetos<br>• Es como "pintar con palabras"<br>• Su propósito es que el lector <strong>imagine</strong> lo descrito<br>• Suele acompañar a otros tipos de texto<br>• Responde a la pregunta "¿cómo es?"'},
    estructura:{title:'Estructura',info:'• Se suele ir de lo <strong>general a lo particular</strong><br>• Puede seguir un <strong>orden en el espacio</strong> (de arriba a abajo, de fuera a dentro)<br>• Primero se nombra el objeto y luego sus <strong>cualidades</strong><br>• No tiene una acción que avance en el tiempo<br>• Se organiza por detalles'},
    marcas:{title:'Cómo reconocerlo',info:'• Abundancia de <strong>adjetivos</strong> (alto, brillante, suave)<br>• Verbos en <strong>presente</strong> o copulativos (ser, estar, parecer)<br>• Uso de <strong>comparaciones</strong> ("blanco como la nieve")<br>• No cuenta hechos, solo cualidades<br>• Responde a: "¿cómo es?"'},
    ejemplos:{title:'Ejemplos',info:'• El <strong>retrato</strong> de una persona<br>• La descripción de un <strong>paisaje</strong><br>• La descripción de un <strong>objeto</strong> o animal<br>• Los <strong>catálogos</strong> y anuncios<br>• Partes descriptivas dentro de un cuento'}
  },
  expositivo:{
    nombre:'Texto expositivo',icon:'📊',
    queEs:{title:'¿Qué es?',info:'• <strong>Informa y explica</strong> un tema de forma clara<br>• Es <strong>objetivo</strong>: no da opiniones personales<br>• Su propósito es que el lector <strong>aprenda o comprenda</strong><br>• También se le llama <strong>informativo</strong><br>• Usa datos y ejemplos'},
    estructura:{title:'Estructura',info:'• <strong>Introducción</strong>: presenta el tema<br>• <strong>Desarrollo</strong>: explica con datos y ejemplos<br>• <strong>Conclusión</strong>: resume las ideas principales<br>• Se organiza en <strong>párrafos</strong> ordenados<br>• Puede usar títulos y subtítulos'},
    marcas:{title:'Cómo reconocerlo',info:'• Lenguaje <strong>claro y objetivo</strong>, en tercera persona<br>• Uso de <strong>tecnicismos</strong> y datos precisos<br>• Conectores de <strong>orden y causa</strong> (por ejemplo, porque)<br>• No aparecen opiniones ni sentimientos<br>• Responde a: "¿qué es?" o "¿por qué?"'},
    ejemplos:{title:'Ejemplos',info:'• El <strong>artículo de enciclopedia</strong><br>• El <strong>texto de ciencias</strong> o de estudio<br>• El <strong>informe</strong><br>• La <strong>definición</strong> de un concepto<br>• La <strong>noticia</strong> (parte informativa)'}
  },
  instructivo:{
    nombre:'Texto instructivo',icon:'📋',
    queEs:{title:'¿Qué es?',info:'• <strong>Indica los pasos</strong> para hacer algo<br>• Su propósito es <strong>guiar una acción</strong><br>• El orden de los pasos es <strong>muy importante</strong><br>• Suele dirigirse directamente al lector<br>• Debe ser claro y preciso'},
    estructura:{title:'Estructura',info:'• Un <strong>título</strong> de lo que se hará<br>• Una lista de <strong>materiales o ingredientes</strong><br>• Los <strong>pasos numerados</strong> en orden<br>• A veces, consejos o advertencias<br>• El <strong>resultado</strong> final'},
    marcas:{title:'Cómo reconocerlo',info:'• Verbos en <strong>imperativo</strong> (mezcla, corta) o infinitivo (mezclar)<br>• Acciones <strong>numeradas y ordenadas</strong><br>• Conectores de orden (primero, luego, finalmente)<br>• Lenguaje directo y breve<br>• Responde a: "¿cómo se hace?"'},
    ejemplos:{title:'Ejemplos',info:'• La <strong>receta</strong> de cocina<br>• El <strong>manual</strong> de instrucciones<br>• Las <strong>reglas de un juego</strong><br>• Una <strong>guía</strong> de armado<br>• Las instrucciones de un experimento'}
  }
};
let labParte='narrativo',labAspecto='queEs';
function labShowParte(parteKey){labParte=parteKey;updateLabDisplay();document.querySelectorAll('.lab-cont-btn').forEach(b=>b.classList.remove('active-pri'));const btn=document.querySelector(`[data-parte="${parteKey}"]`);if(btn)btn.classList.add('active-pri');if(typeof sfx==='function')sfx('click');}
function labShowAspecto(aspectoKey){labAspecto=aspectoKey;updateLabDisplay();document.querySelectorAll('.lab-asp-btn').forEach(b=>b.classList.remove('active-sec'));const btn=document.querySelector(`[data-aspecto="${aspectoKey}"]`);if(btn)btn.classList.add('active-sec');if(typeof sfx==='function')sfx('click');}
function updateLabDisplay(){const data=parteData[labParte];const asp=data[labAspecto];document.getElementById('lab-sentence').innerHTML=`📚 Explorando: <strong>${data.nombre}</strong> → <strong>${asp.title}</strong>`;document.getElementById('lab-display').innerHTML=`<div class="lab-cont-header">${data.icon} ${data.nombre}</div><div class="lab-asp-title">${asp.title}</div><div class="lab-asp-info">${asp.info}</div>`;}

// ===================== DIPLOMA =====================
function _diplPct(){return xp>=MXP?100:Math.round((xp/MXP)*100);}
function openDiploma(){sfx('fan');const pct=_diplPct();document.getElementById('diplPct').textContent=pct+'%';document.getElementById('diplBar').style.width=pct+'%';document.getElementById('diplDate').textContent='Fecha: '+new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});const msgs=['¡Sigue aprendiendo!','¡Muy buen trabajo!','¡Excelente con los textos!','¡Eres un experto en tipos de texto!','¡Maestro de los Textos!'];document.getElementById('diplMsg').textContent=msgs[Math.min(Math.floor(pct/25),4)];const stars=['⭐','⭐⭐','⭐⭐⭐'];document.getElementById('diplStars').textContent=stars[Math.min(Math.floor(pct/40),2)];const achTxt=unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(' · ');document.getElementById('diplAch').textContent=achTxt||'Sigue completando secciones para desbloquear logros';document.getElementById('diplomaOverlay').classList.add('open');launchConfetti();}
function closeDiploma(){document.getElementById('diplomaOverlay').classList.remove('open');}
function updateDiplomaName(v){document.getElementById('diplName').textContent=v||'Estudiante';}
function shareWA(){const name=document.getElementById('diplName').textContent||'Estudiante';const pct=_diplPct();const msg=`📚 ¡${name} completó la Misión "Los Tipos de Textos"! 🏅 Progreso: ${pct}% · ✍️ policastsapien.com`;_waShare(msg);}
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
  document.querySelector('[data-parte="narrativo"]')?.classList.add('active-pri');
  document.querySelector('[data-aspecto="queEs"]')?.classList.add('active-sec');
  renderAchPanel();
});

// Formas deterministas v1: selectores de forma visibles desde la carga de la página
(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalOp==='function') _injectFormaSel('genEvalOp','evalOpFormaSel',evalOpFormNum,function(v){evalOpFormNum=v;}); }catch(e){} try{ if(typeof genEvalCrit==='function') _injectFormaSel('genEvalCrit','evalCritFormaSel',evalCritFormNum,function(v){evalCritFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();
