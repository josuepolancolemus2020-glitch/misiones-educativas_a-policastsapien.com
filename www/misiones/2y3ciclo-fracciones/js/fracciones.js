// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
function compartirMision(){const url=window.location.href;const texto=`🚀 *Misión Asignada* 🚀\n\nPractica sobre este tema y sobresale en ser de los mejores alumnos. 🏆\n\nDesbloquea *todos los logros* y puedes poner *tus datos* para que tu maestro observe todos tus logros. 📋\n\n_Se te hará prueba escrita y serás excelente estudiante en Matemáticas._ ➗\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;_waShare(texto);}
function toggleLetra(){document.body.classList.toggle('letra-grande');if(typeof sfx==='function')sfx('click');localStorage.setItem('preferenciaLetra',document.body.classList.contains('letra-grande'));}
window.addEventListener('DOMContentLoaded',()=>{if(localStorage.getItem('preferenciaLetra')==='true')document.body.classList.add('letra-grande');});

// ===================== UTILIDADES =====================
const _pick=(arr,n)=>[...arr].sort(()=>Math.random()-0.5).slice(0,n);
const _shuffle=(arr)=>[...arr].sort(()=>Math.random()-0.5);
function fb(id,msg,isOk){const el=document.getElementById(id);if(el){el.textContent=msg;el.className='fb show '+(isOk?'ok':'err');}}

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY='fracciones_v1';
let xp=0,MXP=200,done=new Set(),evalAnsVisible=false;
let evalFormNum=1,unlockedAch=[],darkMode=false,prevLevel=0;
let evalOpFormNum=1,evalOpAnsVisible=false;
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
function saveProgress(){try{localStorage.setItem(SAVE_KEY,JSON.stringify({doneSections:Array.from(done),unlockedAch,evalFormNum,evalOpFormNum,xp}));}catch(e){}}
function loadProgress(){try{const s=JSON.parse(localStorage.getItem(SAVE_KEY));if(!s)return;if(s.doneSections&&Array.isArray(s.doneSections))s.doneSections.forEach(id=>{done.add(id);const b=document.querySelector(`[data-s="${id}"]`);if(b)b.classList.add('done');});if(s.unlockedAch&&Array.isArray(s.unlockedAch))unlockedAch=s.unlockedAch.filter(id=>ACHIEVEMENTS[id]!==undefined);if(s.evalFormNum)evalFormNum=s.evalFormNum;if(s.evalOpFormNum)evalOpFormNum=s.evalOpFormNum;if(s.xp!==undefined){xp=s.xp;updateXPBar();}}catch(e){}}

// ===================== ACHIEVEMENTS =====================
const ACHIEVEMENTS={
  primer_quiz:{icon:'🧠',label:'Primera prueba de fracciones superada'},
  flash_master:{icon:'🃏',label:'Todas las flashcards de fracciones exploradas'},
  clasif_pro:{icon:'🗂️',label:'Clasificador de fracciones experto'},
  id_master:{icon:'🔍',label:'Identificador de fracciones maestro'},
  reto_hero:{icon:'🏆',label:'Héroe del reto de fracciones'},
  nivel3:{icon:'🍕',label:'¡Explorador de fracciones! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡Maestro de las Fracciones! Nivel 6'},
  widgets_master:{icon:'🧩',label:'Widgets de fracciones dominados'}
};
function unlockAchievement(id){if(unlockedAch.includes(id))return;unlockedAch.push(id);sfx('ach');showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label);launchConfetti();renderAchPanel();saveProgress();}
function renderAchPanel(){const list=document.getElementById('achList');list.innerHTML='';Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{const div=document.createElement('div');div.className='ach-item'+(unlockedAch.includes(id)?'':' locked');div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`;list.appendChild(div);});}
function toggleAchPanel(){sfx('click');document.getElementById('achPanel').classList.toggle('open');}
function showToast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}t.textContent=msg;t.style.display='block';clearTimeout(t._tid);t._tid=setTimeout(()=>t.style.display='none',3200);}
function launchConfetti(){const colors=['#c2255c','#e64980','#0f9b8e','#3dd9c4','#f5c451'];for(let i=0;i<60;i++){const c=document.createElement('div');c.className='confetti-piece';c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`;document.body.appendChild(c);c.addEventListener('animationend',()=>c.remove());}}

// ===================== XP =====================
const lvls=[{t:0,n:'Aprendiz 🌱'},{t:25,n:'Explorador de Fracciones 🍕'},{t:55,n:'Medidor de Partes 📏'},{t:90,n:'Sumador de Fracciones ➕'},{t:130,n:'Simplificador Experto 🔎'},{t:165,n:'Analista de Fracciones 🧮'},{t:190,n:'Maestro de las Fracciones 🏆'}];
function pts(n){xp=Math.max(0,Math.min(MXP,xp+n));updateXPBar();saveProgress();}
function updateXPBar(){const pct=Math.round((xp/MXP)*100);document.getElementById('xpFill').style.width=pct+'%';const el=document.getElementById('xpPts');el.textContent='⭐ '+xp;el.style.transform='scale(1.3)';setTimeout(()=>el.style.transform='',300);let lv=0;for(let i=0;i<lvls.length;i++)if(xp>=lvls[i].t)lv=i;document.getElementById('xpLvl').textContent=lvls[lv].n;if(lv!==prevLevel){if(lv>=2)unlockAchievement('nivel3');if(lv>=5)unlockAchievement('nivel5');prevLevel=lv;}}
function resetXP(){sfx('click');xp=0;updateXPBar();showToast('🔄 XP reiniciado a 0');}
function fin(id,showFX=true){if(!done.has(id)){done.add(id);const b=document.querySelector(`[data-s="${id}"]`);if(b)b.classList.add('done');if(showFX){sfx('up');launchConfetti();}saveProgress();}}
function getProgress(){return Math.round((done.size/TOTAL_SECTIONS)*100);}

// ===================== NAV =====================
function go(id){sfx('click');document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});document.getElementById(id).classList.add('active');const btn=document.querySelector(`[data-s="${id}"]`);if(btn){btn.classList.add('active');btn.setAttribute('aria-selected','true');}window.scrollTo({top:0,behavior:'smooth'});if(id==='s-sopa'){setTimeout(buildSopa,50);}if(id==='s-widgets'){setTimeout(buildRoute,50);}}

// ===================== FLASHCARD DATA =====================
const fcData=[
  {w:'Fracción',a:'🍕 Una <strong>fracción</strong> representa una <strong>parte de un todo</strong> dividido en partes iguales. Se escribe como dos números separados por una línea: el <strong>numerador</strong> (arriba) y el <strong>denominador</strong> (abajo). Ejemplo: 3/4 = tres partes de cuatro.'},
  {w:'Numerador',a:'🔢 Es el número de <strong>arriba</strong> en una fracción. Indica <strong>cuántas partes se toman</strong> del entero. En 3/4, el numerador es <strong>3</strong>.'},
  {w:'Denominador',a:'🔢 Es el número de <strong>abajo</strong> en una fracción. Indica <strong>en cuántas partes iguales</strong> se divide el entero. En 3/4, el denominador es <strong>4</strong>.'},
  {w:'Fracción propia',a:'🍕 Es una fracción donde el <strong>numerador es menor</strong> que el denominador. Representa <strong>menos de un entero</strong>. Ejemplos: 1/2, 3/4, 2/5.'},
  {w:'Fracción impropia',a:'🍰 Es una fracción donde el <strong>numerador es igual o mayor</strong> que el denominador. Representa <strong>un entero o más</strong>. Ejemplos: 7/4, 5/3, 9/9.'},
  {w:'Fracción mixta',a:'🎂 Combina un <strong>número entero</strong> con una <strong>fracción propia</strong>. Ejemplo: <strong>2 1/2</strong> significa "dos enteros y un medio". Toda fracción impropia se puede escribir como mixta.'},
  {w:'Fracciones equivalentes',a:'⚖️ Son fracciones <strong>distintas en apariencia</strong> pero que representan <strong>la misma parte</strong> del entero. Ejemplo: 1/2 = 2/4 = 3/6. Se obtienen multiplicando o dividiendo numerador y denominador por el <strong>mismo número</strong>.'},
  {w:'Simplificar una fracción',a:'✂️ Es <strong>reducir</strong> una fracción a su forma más simple, dividiendo el numerador y el denominador entre el <strong>mismo número</strong>. Ejemplo: 6/9 ÷ 3 = <strong>2/3</strong>.'},
  {w:'Máximo Común Divisor (MCD)',a:'🔑 Es el número <strong>más grande</strong> entre el que se puede dividir el numerador y el denominador a la vez. Se usa para <strong>simplificar</strong> fracciones. Ejemplo: el MCD de 8 y 12 es 4.'},
  {w:'Suma con el mismo denominador',a:'➕ Cuando dos fracciones tienen <strong>igual denominador</strong>, se suman solo los <strong>numeradores</strong> y el denominador <strong>no cambia</strong>. Ejemplo: 1/4 + 2/4 = 3/4.'},
  {w:'Suma con distinto denominador',a:'➕ Cuando las fracciones tienen <strong>denominadores diferentes</strong>, primero se buscan fracciones <strong>equivalentes</strong> con un denominador común (usando el mcm) y luego se suman los numeradores. Ejemplo: 1/2 + 1/4 = 2/4 + 1/4 = 3/4.'},
  {w:'Resta de fracciones',a:'➖ Si tienen <strong>igual denominador</strong>, se restan los numeradores (ej. 3/4 − 1/4 = 2/4). Si tienen <strong>distinto denominador</strong>, primero se convierten a fracciones equivalentes con el mismo denominador (ej. 3/4 − 1/2 = 3/4 − 2/4 = 1/4).'},
  {w:'Fracción unitaria',a:'☝️ Es una fracción cuyo <strong>numerador es 1</strong>, como 1/2, 1/3 o 1/4. Representa <strong>una sola parte</strong> del total en que se dividió el entero.'},
  {w:'Fracción como parte de un todo y la recta numérica',a:'🍕📏 Una fracción puede verse como una <strong>parte de un todo</strong> (un pastel, una barra) o como un <strong>punto en la recta numérica</strong>, ubicado entre dos números enteros según el valor de la fracción.'},
];
let fcIdx=0;
function upFC(){document.getElementById('fcInner').classList.remove('flipped');document.getElementById('fcW').textContent=fcData[fcIdx].w;document.getElementById('fcA').innerHTML=fcData[fcIdx].a;document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length;}
function flipCard(){sfx('flip');document.getElementById('fcInner').classList.toggle('flipped');if(!xpTracker.fc.has(fcIdx)){xpTracker.fc.add(fcIdx);pts(1);}if(xpTracker.fc.size===fcData.length){fin('s-flash');unlockAchievement('flash_master');}}
function nextFC(){sfx('click');fcIdx=(fcIdx+1)%fcData.length;upFC();}
function prevFC(){sfx('click');fcIdx=(fcIdx-1+fcData.length)%fcData.length;upFC();}

// ===================== QUIZ DATA =====================
const qzData=[
  {q:'¿Qué indica el numerador de una fracción?',o:['a) En cuántas partes se divide el entero','b) Cuántas partes se toman del entero','c) El resultado de una suma','d) El nombre de la fracción'],c:1},
  {q:'¿Cuál de estas es una fracción impropia?',o:['a) 3/4','b) 1/2','c) 7/4','d) 2/5'],c:2},
  {q:'1/2 y 2/4 son fracciones...',o:['a) Impropias','b) Equivalentes','c) Mixtas','d) Diferentes en valor'],c:1},
  {q:'¿Cuánto es 1/4 + 2/4?',o:['a) 3/8','b) 3/4','c) 2/4','d) 1/8'],c:1},
  {q:'¿Cuánto es 3/4 − 1/4?',o:['a) 2/4','b) 2/8','c) 4/4','d) 1/4'],c:0},
  {q:'Un círculo dividido en 4 partes iguales con 3 partes sombreadas representa...',o:['a) 1/4','b) 3/4','c) 4/4','d) 3/3'],c:1},
  {q:'¿Cómo se escribe 7/4 como fracción mixta?',o:['a) 1 3/4','b) 2 1/4','c) 1 1/2','d) 3 1/4'],c:0},
  {q:'Al simplificar 4/8, ¿qué obtienes?',o:['a) 2/4','b) 1/4','c) 1/2','d) 2/2'],c:2},
  {q:'¿Cuánto es 1/2 + 1/4 (distinto denominador)?',o:['a) 2/6','b) 3/4','c) 1/4','d) 2/4'],c:1},
];
let qzIdx=0,qzSel=-1,qzDone=false;
function buildQz(){qzIdx=0;qzSel=-1;qzDone=false;showQz();}
function showQz(){if(qzIdx>=qzData.length){document.getElementById('qzQ').textContent='🎉 ¡Quiz completado!';document.getElementById('qzOpts').innerHTML='';fin('s-quiz');unlockAchievement('primer_quiz');return;}const q=qzData[qzIdx];document.getElementById('qzProg').textContent=`Pregunta ${qzIdx+1} de ${qzData.length}`;document.getElementById('qzQ').textContent=q.q;const opts=document.getElementById('qzOpts');opts.innerHTML='';q.o.forEach((o,i)=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=o;b.onclick=()=>{if(qzDone)return;document.querySelectorAll('.qz-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');qzSel=i;sfx('click');};opts.appendChild(b);});qzDone=false;}
function checkQz(){if(qzSel<0)return fb('fbQz','Selecciona una respuesta.',false);qzDone=true;const opts=document.querySelectorAll('.qz-opt');if(qzSel===qzData[qzIdx].c){opts[qzSel].classList.add('correct');fb('fbQz','¡Correcto! +5 XP',true);if(!xpTracker.qz.has(qzIdx)){xpTracker.qz.add(qzIdx);pts(5);}sfx('ok');}else{opts[qzSel].classList.add('wrong');opts[qzData[qzIdx].c].classList.add('correct');fb('fbQz','Incorrecto. Revisa la respuesta correcta.',false);sfx('no');}setTimeout(()=>{qzIdx++;qzSel=-1;showQz();},1600);}
function resetQz(){sfx('click');qzIdx=0;qzSel=-1;qzDone=false;showQz();document.getElementById('fbQz').classList.remove('show');}

// ===================== CLASIFICACIÓN =====================
const classGroups=[
  {label:['Propias','Impropias'],headA:'🍕 Fracciones propias',headB:'🍰 Fracciones impropias',colA:'prop',colB:'impr',
   words:[{w:'3/4',t:'prop'},{w:'7/4',t:'impr'},{w:'1/2',t:'prop'},{w:'9/5',t:'impr'},{w:'2/3',t:'prop'},{w:'8/3',t:'impr'},{w:'5/8',t:'prop'},{w:'11/4',t:'impr'},{w:'1/4',t:'prop'},{w:'13/6',t:'impr'}]},
  {label:['Mixtas','Simples'],headA:'🎂 Fracciones mixtas',headB:'🍕 Fracciones simples (no mixtas)',colA:'mix',colB:'simp',
   words:[{w:'1 1/2',t:'mix'},{w:'3/4',t:'simp'},{w:'2 3/4',t:'mix'},{w:'5/8',t:'simp'},{w:'3 1/5',t:'mix'},{w:'2/9',t:'simp'},{w:'1 2/3',t:'mix'},{w:'7/10',t:'simp'},{w:'4 1/4',t:'mix'},{w:'1/3',t:'simp'}]},
  {label:['Equivalentes a 1/2','No equivalentes'],headA:'⚖️ Equivalentes a 1/2',headB:'🚫 No equivalentes a 1/2',colA:'equiv',colB:'noeq',
   words:[{w:'2/4',t:'equiv'},{w:'1/3',t:'noeq'},{w:'3/6',t:'equiv'},{w:'2/5',t:'noeq'},{w:'4/8',t:'equiv'},{w:'3/4',t:'noeq'},{w:'5/10',t:'equiv'},{w:'1/4',t:'noeq'},{w:'6/12',t:'equiv'},{w:'2/3',t:'noeq'}]},
  {label:['Es fracción','No es fracción'],headA:'🍕 Es una fracción',headB:'🚫 No es una fracción',colA:'frac',colB:'no',
   words:[{w:'3/4',t:'frac'},{w:'pizza',t:'no'},{w:'1/2',t:'frac'},{w:'diez',t:'no'},{w:'5/9',t:'frac'},{w:'manzana',t:'no'},{w:'7/8',t:'frac'},{w:'rápido',t:'no'},{w:'2/3',t:'frac'},{w:'entero',t:'no'}]},
];
let currentClassGroupIdx=0,clsSelectedWord=null;
function buildClass(){const group=classGroups[currentClassGroupIdx];document.getElementById('col-left-head').textContent=group.headA;document.getElementById('col-right-head').textContent=group.headB;const bank=document.getElementById('clsBank');bank.innerHTML='';clsSelectedWord=null;document.getElementById('items-left').innerHTML='';document.getElementById('items-right').innerHTML='';_shuffle([...group.words]).forEach(w=>{const el=document.createElement('div');el.className='wb-item';el.textContent=w.w;el.dataset.t=w.t;el.onclick=()=>{document.querySelectorAll('.wb-item').forEach(i=>i.classList.remove('sel-word'));el.classList.add('sel-word');clsSelectedWord=el;sfx('click');};bank.appendChild(el);});['col-left','col-right'].forEach(colId=>{const col=document.getElementById(colId);col.onclick=(e)=>{if(!clsSelectedWord||e.target.classList.contains('drop-item'))return;const targetId=colId==='col-left'?'items-left':'items-right';const wordsCol=document.getElementById(targetId);const item=document.createElement('div');item.className='drop-item';item.textContent=clsSelectedWord.textContent;item.dataset.t=clsSelectedWord.dataset.t;const original=clsSelectedWord;item.onclick=(ev)=>{ev.stopPropagation();if(clsSelectedWord!==null){col.click();}else{document.getElementById('clsBank').appendChild(original);original.classList.remove('sel-word');item.remove();if(typeof sfx==='function')sfx('click');}};wordsCol.appendChild(item);clsSelectedWord.remove();clsSelectedWord=null;sfx('click');};});}
function checkClass(){const remaining=document.querySelectorAll('#clsBank .wb-item').length;if(remaining>0){fb('fbCls','Mueve todas las palabras a las columnas primero.',false);return;}const group=classGroups[currentClassGroupIdx];let allOk=true;document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{const inLeft=el.parentElement.id==='items-left';const expectedType=inLeft?group.colA:group.colB;if(el.dataset.t===expectedType){el.classList.add('cls-ok');}else{el.classList.add('cls-no');allOk=false;}});if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);}if(allOk){fb('fbCls','¡Perfecto! +5 XP',true);sfx('fan');fin('s-clasifica');unlockAchievement('clasif_pro');}else{fb('fbCls','Hay errores. Marcados en rojo.',false);sfx('no');}}
function nextClassGroup(){sfx('click');currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length;buildClass();document.getElementById('fbCls').classList.remove('show');showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]);}
function resetClass(){sfx('click');buildClass();document.getElementById('fbCls').classList.remove('show');}

// ===================== IDENTIFICAR =====================
const idData=[
  {s:['1/4','2/4','3/4','4/4'],c:2,art:'Un círculo (pastel) dividido en 4 partes iguales, con 3 partes sombreadas'},
  {s:['1/3','1/2','2/3','1/4'],c:1,art:'Una barra dividida en 2 partes iguales, con 1 parte sombreada'},
  {s:['5/6','3/8','5/8','5/9'],c:2,art:'Un círculo dividido en 8 partes iguales, con 5 partes sombreadas'},
  {s:['2/5','3/5','3/4','1/5'],c:1,art:'Una recta numérica del 0 al 1 dividida en 5 partes iguales; la marca está en la tercera división'},
  {s:['3/3','2/3','1/3','3/4'],c:0,art:'Una barra dividida en 3 partes iguales, con las 3 partes sombreadas (el entero completo)'},
  {s:['1/8','1/4','1/6','1/5'],c:2,art:'Un círculo dividido en 6 partes iguales, con 1 parte sombreada'},
  {s:['7/9','7/10','7/8','3/10'],c:1,art:'Una barra dividida en 10 partes iguales, con 7 partes sombreadas'},
  {s:['3/2','2/2','1/2','5/2'],c:0,art:'Un círculo completo sombreado (1 entero) más otro círculo dividido en 2 con 1 parte sombreada'},
];
let idIdx=0,idDone=false;
function showId(){idDone=false;if(idIdx>=idData.length){document.getElementById('idSent').innerHTML='🎉 ¡Completado!';fin('s-identifica');unlockAchievement('id_master');return;}const d=idData[idIdx];document.getElementById('idProg').textContent=`Representación ${idIdx+1} de ${idData.length}`;document.getElementById('idInfo').textContent=`Busca la fracción de: ${d.art}`;const sent=document.getElementById('idSent');sent.innerHTML='';d.s.forEach((w,i)=>{const span=document.createElement('span');span.className='id-word';span.textContent=w+' ';span.onclick=()=>checkId(i,span);sent.appendChild(span);});}
function checkId(i,span){if(idDone)return;document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected'));span.classList.add('selected');if(i===idData[idIdx].c){idDone=true;span.classList.add('id-ok');fb('fbId','¡Correcto! +5 XP',true);if(!xpTracker.id.has(idIdx)){xpTracker.id.add(idIdx);pts(5);}sfx('ok');}else{span.classList.add('id-no');fb('fbId','Esa no es la fracción que corresponde a la descripción.',false);sfx('no');}}
function nextId(){sfx('click');idIdx++;showId();document.getElementById('fbId').classList.remove('show');}
function resetId(){sfx('click');idIdx=0;showId();document.getElementById('fbId').classList.remove('show');}

// ===================== COMPLETA =====================
const cmpData=[
  {s:'3/4 + 1/4 = ___',opts:['4/4','3/8','2/4'],c:0},
  {s:'1/2 = ___/4',opts:['1','2','4'],c:1},
  {s:'5/6 − 2/6 = ___',opts:['3/6','3/12','7/6'],c:0},
  {s:'1/2 + 1/4 = ___',opts:['3/4','2/6','1/4'],c:0},
  {s:'3/5 − 1/5 = ___',opts:['2/5','2/10','4/5'],c:0},
  {s:'1/3 + 1/6 = ___',opts:['3/6','2/9','1/9'],c:0},
  {s:'3/4 − 1/2 = ___',opts:['1/4','2/4','1/2'],c:0},
  {s:'2/3 = ___/9',opts:['3','6','9'],c:1},
];
let cmpIdx=0,cmpSel=-1,cmpDone=false;
function showCmp(){if(cmpIdx>=cmpData.length){document.getElementById('cmpSent').innerHTML='🎉 ¡Completado!';document.getElementById('cmpOpts').innerHTML='';fin('s-completa');return;}const d=cmpData[cmpIdx];document.getElementById('cmpProg').textContent=`Ejercicio ${cmpIdx+1} de ${cmpData.length}`;document.getElementById('cmpSent').innerHTML=d.s.replace('___','<span class="blank">___</span>');const opts=document.getElementById('cmpOpts');opts.innerHTML='';cmpSel=-1;cmpDone=false;d.opts.forEach((o,i)=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=o;b.onclick=()=>{if(cmpDone)return;document.querySelectorAll('.cmp-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');cmpSel=i;sfx('click');};opts.appendChild(b);});}
function checkCmp(){if(cmpSel<0)return fb('fbCmp','Selecciona una opción.',false);cmpDone=true;const opts=document.querySelectorAll('.cmp-opt');if(cmpSel===cmpData[cmpIdx].c){opts[cmpSel].classList.add('correct');document.getElementById('cmpSent').innerHTML=cmpData[cmpIdx].s.replace('___',`<span class="blank" style="color:var(--jade);border-color:var(--jade)">${opts[cmpSel].textContent}</span>`);fb('fbCmp','¡Correcto! +5 XP',true);if(!xpTracker.cmp.has(cmpIdx)){xpTracker.cmp.add(cmpIdx);pts(5);}sfx('ok');}else{opts[cmpSel].classList.add('wrong');opts[cmpData[cmpIdx].c].classList.add('correct');fb('fbCmp','Incorrecto. Revisa bien la respuesta.',false);sfx('no');}setTimeout(()=>{cmpIdx++;document.getElementById('fbCmp').classList.remove('show');showCmp();},1600);}

// ===================== WIDGETS =====================
// Widget 1: Ordenar fracciones de menor a mayor
const routeSets=[
  {label:'Fracciones de menor a mayor (mismo denominador)',steps:['1/8','3/8','5/8','7/8']},
  {label:'Fracciones de menor a mayor (distinto denominador)',steps:['1/4','1/2','3/4','1']},
  {label:'Fracciones en la recta numérica',steps:['1/5','2/5','3/5','4/5']},
];
let currentRouteIdx=0,routeItems=[];
function buildRoute(){routeItems=_shuffle([...routeSets[currentRouteIdx].steps]);renderRoute();const fbEl=document.getElementById('fbRoute');if(fbEl)fbEl.classList.remove('show');}
function renderRoute(){const list=document.getElementById('routeList');if(!list)return;list.innerHTML='';routeItems.forEach((step,i)=>{const div=document.createElement('div');div.className='sort-item';div.innerHTML=`<div class="sort-arrows"><button class="sort-arrow" onclick="routeMove(${i},-1)"${i===0?' disabled':''}>▲</button><button class="sort-arrow" onclick="routeMove(${i},1)"${i===routeItems.length-1?' disabled':''}>▼</button></div><div class="sort-step-num">${i+1}.</div><div class="sort-item-txt">${step}</div>`;list.appendChild(div);});}
function routeMove(idx,dir){sfx('click');const ni=idx+dir;if(ni<0||ni>=routeItems.length)return;[routeItems[idx],routeItems[ni]]=[routeItems[ni],routeItems[idx]];renderRoute();}
function checkRoute(){const correct=routeSets[currentRouteIdx].steps;const isOk=routeItems.every((s,i)=>s===correct[i]);if(isOk){fb('fbRoute','¡Perfecto! Orden correcto. +4 XP',true);if(!xpTracker.wgt.has('route_'+currentRouteIdx)){xpTracker.wgt.add('route_'+currentRouteIdx);pts(4);}sfx('fan');fin('s-widgets');unlockAchievement('widgets_master');}else{fb('fbRoute','Hay fracciones fuera de orden. Revisa el arreglo.',false);sfx('no');}}
function nextRoute(){sfx('click');currentRouteIdx=(currentRouteIdx+1)%routeSets.length;buildRoute();showToast('🔄 Secuencia: '+routeSets[currentRouteIdx].label);}

// Widget 2: Identifica visual (representación gráfica descrita → fracción)
const neuronPartes=[
  {desc:'Un círculo dividido en 4 partes con 1 parte sombreada representa la fracción...',ans:'1/4',opts:['1/4','1/2','1/3','3/4']},
  {desc:'Una barra dividida en 2 partes con las 2 sombreadas representa la fracción...',ans:'2/2',opts:['2/2','1/2','2/4','1/4']},
  {desc:'Un círculo dividido en 3 partes con 2 sombreadas representa la fracción...',ans:'2/3',opts:['2/3','1/3','2/5','3/3']},
  {desc:'Una recta numérica del 0 al 1 dividida en 4 partes; la marca está en la segunda división. Representa la fracción...',ans:'2/4',opts:['2/4','1/4','3/4','2/3']},
  {desc:'Un rectángulo dividido en 5 partes con 4 sombreadas representa la fracción...',ans:'4/5',opts:['4/5','4/6','1/5','5/5']},
  {desc:'Dos pasteles completos sombreados más un tercer pastel dividido en 2 con 1 sombreada representan la fracción mixta...',ans:'2 1/2',opts:['2 1/2','1 1/2','2 1/4','3']},
  {desc:'Un círculo dividido en 6 partes con 5 sombreadas representa la fracción...',ans:'5/6',opts:['5/6','4/6','5/8','1/6']},
  {desc:'Una barra dividida en 10 partes con 3 sombreadas representa la fracción...',ans:'3/10',opts:['3/10','7/10','3/7','1/10']},
];
let neuronIdx=0,neuronDone=false;
function showNeuron(){neuronDone=false;if(neuronIdx>=neuronPartes.length){const el=document.getElementById('neuronDesc');if(el)el.textContent='🎉 ¡Todas las representaciones identificadas!';const opts=document.getElementById('neuronOpts');if(opts)opts.innerHTML='';fin('s-widgets');return;}const d=neuronPartes[neuronIdx];const prog=document.getElementById('neuronProg');if(prog)prog.textContent=`Representación ${neuronIdx+1} de ${neuronPartes.length}`;const desc=document.getElementById('neuronDesc');if(desc)desc.innerHTML=d.desc;const opts=document.getElementById('neuronOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=opt;b.onclick=()=>checkNeuron(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuron');if(fbEl)fbEl.classList.remove('show');}
function checkNeuron(opt,btn,d){if(neuronDone)return;neuronDone=true;document.querySelectorAll('#neuronOpts .cmp-opt').forEach(b=>{if(b.textContent===d.ans)b.classList.add('correct');else if(b===btn&&b.textContent!==d.ans)b.classList.add('wrong');});const isOk=opt===d.ans;if(isOk){fb('fbNeuron','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuron_'+neuronIdx)){xpTracker.wgt.add('neuron_'+neuronIdx);pts(3);}sfx('ok');}else{fb('fbNeuron','La respuesta correcta es: '+d.ans,false);sfx('no');}}
function nextNeuron(){sfx('click');neuronIdx++;showNeuron();}
function resetNeuron(){sfx('click');neuronIdx=0;showNeuron();}

// Widget 3: Empareja fracción → fracción equivalente
const neuroPairs=[
  {trans:'1/2',func:'2/4, 3/6, 4/8',opts:['2/4, 3/6, 4/8','1/3, 2/6, 3/9','3/4, 6/8, 9/12','1/5, 2/10, 3/15']},
  {trans:'1/3',func:'2/6, 3/9, 4/12',opts:['2/6, 3/9, 4/12','1/2, 2/4, 3/6','2/5, 4/10, 6/15','3/4, 6/8, 9/12']},
  {trans:'3/4',func:'6/8, 9/12, 12/16',opts:['6/8, 9/12, 12/16','1/2, 2/4, 3/6','2/3, 4/6, 6/9','1/4, 2/8, 3/12']},
  {trans:'1/4',func:'2/8, 3/12, 4/16',opts:['2/8, 3/12, 4/16','1/2, 2/4, 3/6','3/5, 6/10, 9/15','2/3, 4/6, 6/9']},
  {trans:'2/3',func:'4/6, 6/9, 8/12',opts:['4/6, 6/9, 8/12','1/3, 2/6, 3/9','3/4, 6/8, 9/12','1/2, 2/4, 3/6']},
];
let neuroIdx=0,neuroDone=false;
function showNeuro(){neuroDone=false;if(neuroIdx>=neuroPairs.length){const el=document.getElementById('neuroTrans');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('neuroOpts');if(opts)opts.innerHTML='';return;}const d=neuroPairs[neuroIdx];const prog=document.getElementById('neuroProg');if(prog)prog.textContent=`${neuroIdx+1} de ${neuroPairs.length}`;const trans=document.getElementById('neuroTrans');if(trans)trans.textContent=d.trans;const opts=document.getElementById('neuroOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkNeuro(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuro');if(fbEl)fbEl.classList.remove('show');}
function checkNeuro(opt,btn,d){if(neuroDone)return;neuroDone=true;document.querySelectorAll('#neuroOpts .qz-opt').forEach(b=>{if(b.textContent===d.func)b.classList.add('correct');else if(b===btn&&b.textContent!==d.func)b.classList.add('wrong');});const isOk=opt===d.func;if(isOk){fb('fbNeuro','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuro_'+neuroIdx)){xpTracker.wgt.add('neuro_'+neuroIdx);pts(3);}sfx('ok');}else{fb('fbNeuro','Correcto: '+d.func,false);sfx('no');}setTimeout(()=>{neuroIdx++;showNeuro();},1800);}
function resetNeuro(){sfx('click');neuroIdx=0;showNeuro();}

// Widget 4: Situación → respuesta (problema corto de suma o resta)
const enfermedadData=[
  {disease:'Ana comió 1/4 de una pizza y Luis comió 2/4 de la misma pizza. ¿Cuánto comieron en total?',characteristic:'3/4',opts:['3/4','2/4','1/4','4/4']},
  {disease:'Un chocolate se divide en 8 partes. Comiste 3/8 en la mañana y 2/8 en la tarde. ¿Cuánto comiste en total?',characteristic:'5/8',opts:['5/8','1/8','6/8','5/16']},
  {disease:'Tenías 3/4 de un pastel y regalaste 1/4. ¿Cuánto pastel te queda?',characteristic:'2/4',opts:['2/4','1/4','3/4','4/4']},
  {disease:'Caminaste 1/2 hora en la mañana y 1/4 de hora en la tarde. ¿Cuánto caminaste en total?',characteristic:'3/4',opts:['3/4','2/6','1/4','1/2']},
  {disease:'Un jarro tiene 5/6 de agua. Se derramó 2/6. ¿Cuánta agua queda?',characteristic:'3/6',opts:['3/6','2/6','7/6','1/6']},
  {disease:'Compraste 2/3 de metro de tela y luego 1/3 de metro más. ¿Cuánta tela tienes en total?',characteristic:'3/3',opts:['3/3','1/3','2/3','2/6']},
];
let enferIdx=0,enferDone=false;
function showEnfer(){enferDone=false;if(enferIdx>=enfermedadData.length){const el=document.getElementById('enferDisease');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('enferOpts');if(opts)opts.innerHTML='';return;}const d=enfermedadData[enferIdx];const prog=document.getElementById('enferProg');if(prog)prog.textContent=`${enferIdx+1} de ${enfermedadData.length}`;const dis=document.getElementById('enferDisease');if(dis)dis.textContent=d.disease;const opts=document.getElementById('enferOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkEnfer(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbEnfer');if(fbEl)fbEl.classList.remove('show');}
function checkEnfer(opt,btn,d){if(enferDone)return;enferDone=true;document.querySelectorAll('#enferOpts .qz-opt').forEach(b=>{if(b.textContent===d.characteristic)b.classList.add('correct');else if(b===btn&&b.textContent!==d.characteristic)b.classList.add('wrong');});const isOk=opt===d.characteristic;if(isOk){fb('fbEnfer','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('enfer_'+enferIdx)){xpTracker.wgt.add('enfer_'+enferIdx);pts(3);}sfx('ok');}else{fb('fbEnfer','Correcto: '+d.characteristic,false);sfx('no');}setTimeout(()=>{enferIdx++;showEnfer();},1800);}
function resetEnfer(){sfx('click');enferIdx=0;showEnfer();}

// ===================== RETO FINAL =====================
const retoPairs=[
  {label:['Propias','Impropias'],btnA:'🍕 Propias',btnB:'🍰 Impropias',colA:'prop',colB:'impr',
   words:[{w:'3/4',t:'prop'},{w:'7/4',t:'impr'},{w:'1/2',t:'prop'},{w:'9/5',t:'impr'},{w:'2/3',t:'prop'},{w:'8/3',t:'impr'},{w:'5/8',t:'prop'},{w:'11/4',t:'impr'},{w:'1/4',t:'prop'},{w:'13/6',t:'impr'}]},
  {label:['Equivalente a 1/2','No equivalente'],btnA:'⚖️ Equivalente a 1/2',btnB:'🚫 No equivalente',colA:'equiv',colB:'noeq',
   words:[{w:'2/4',t:'equiv'},{w:'1/3',t:'noeq'},{w:'3/6',t:'equiv'},{w:'2/5',t:'noeq'},{w:'4/8',t:'equiv'},{w:'3/4',t:'noeq'},{w:'5/10',t:'equiv'},{w:'1/4',t:'noeq'},{w:'6/12',t:'equiv'},{w:'2/3',t:'noeq'}]},
  {label:['Fracción','Decimal'],btnA:'🔢 Fracción',btnB:'0️⃣ Decimal',colA:'frac',colB:'dec',
   words:[{w:'1/2',t:'frac'},{w:'0.5',t:'dec'},{w:'3/4',t:'frac'},{w:'0.75',t:'dec'},{w:'1/4',t:'frac'},{w:'0.25',t:'dec'},{w:'2/5',t:'frac'},{w:'0.4',t:'dec'},{w:'3/10',t:'frac'},{w:'0.3',t:'dec'}]},
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
  {s:'La fracción 7/4 tiene el numerador mayor que el denominador.',type:'Fracción impropia'},
  {s:'La fracción 3/4 tiene el numerador menor que el denominador.',type:'Fracción propia'},
  {s:'2 1/2 combina un número entero con una fracción.',type:'Fracción mixta'},
  {s:'1/2 y 2/4 representan la misma parte del entero.',type:'Fracciones equivalentes'},
  {s:'4/8 se puede reducir a 1/2 dividiendo entre 4.',type:'Simplificación'},
  {s:'1/4 + 2/4 se resuelve sumando los numeradores porque tienen igual denominador.',type:'Suma con mismo denominador'},
  {s:'1/2 + 1/4 requiere buscar un denominador común antes de sumar.',type:'Suma con distinto denominador'},
  {s:'3/4 − 1/4 se resuelve restando los numeradores porque el denominador es igual.',type:'Resta con mismo denominador'},
  {s:'El denominador indica en cuántas partes iguales se divide el entero.',type:'Denominador'},
  {s:'El numerador indica cuántas partes se toman del entero.',type:'Numerador'},
];
const classifyTaskDB=[
  {w:'3/4',gen:'Propia',n:'Numerador menor que el denominador',g:'Representa parte de un entero',t:'3 de 4 partes de una pizza'},
  {w:'7/4',gen:'Impropia',n:'Numerador mayor o igual',g:'Representa más de un entero',t:'Un entero completo y 3/4 más'},
  {w:'1 1/2',gen:'Mixta',n:'Entero + fracción',g:'Combina cantidad entera y parcial',t:'Un pastel y medio pastel'},
  {w:'2/4',gen:'Equivalente a 1/2',n:'Misma parte, distinta forma',g:'Se obtiene multiplicando por el mismo número',t:'2/4 = 1/2'},
  {w:'4/8',gen:'Simplificable',n:'Se puede reducir',g:'Dividir numerador y denominador entre el mismo número',t:'4/8 ÷ 4 = 1/2'},
  {w:'1/4 + 2/4',gen:'Suma mismo denominador',n:'Se suman numeradores',g:'El denominador no cambia',t:'1/4+2/4=3/4'},
  {w:'1/2 + 1/4',gen:'Suma distinto denominador',n:'Buscar denominador común',g:'Convertir a fracciones equivalentes primero',t:'2/4+1/4=3/4'},
  {w:'3/4 − 1/4',gen:'Resta mismo denominador',n:'Se restan numeradores',g:'El denominador no cambia',t:'3/4-1/4=2/4'},
];
const completeTaskDB=[
  {s:'3/4 + 1/4 = ___',opts:['4/4','3/8','2/4'],ans:'4/4'},
  {s:'1/2 = ___/4',opts:['1','2','4'],ans:'2'},
  {s:'5/6 − 2/6 = ___',opts:['3/6','3/12','7/6'],ans:'3/6'},
  {s:'1/2 + 1/4 = ___',opts:['3/4','2/6','1/4'],ans:'3/4'},
  {s:'3/5 − 1/5 = ___',opts:['2/5','2/10','4/5'],ans:'2/5'},
  {s:'1/3 + 1/6 = ___',opts:['3/6','2/9','1/9'],ans:'3/6'},
  {s:'3/4 − 1/2 = ___',opts:['1/4','2/4','1/2'],ans:'1/4'},
  {s:'2/3 = ___/9',opts:['3','6','9'],ans:'6'},
];
const explainQuestions=[
  {q:'¿Qué son el numerador y el denominador de una fracción?',ans:'El numerador es el número de arriba e indica cuántas partes se toman; el denominador es el número de abajo e indica en cuántas partes iguales se divide el entero.'},
  {q:'Explica la diferencia entre una fracción propia y una impropia con ejemplos.',ans:'En la propia el numerador es menor que el denominador y representa menos de un entero (ej. 3/4). En la impropia el numerador es igual o mayor que el denominador y representa un entero o más (ej. 7/4).'},
  {q:'¿Qué son las fracciones equivalentes? Da un ejemplo.',ans:'Son fracciones distintas que representan la misma parte de un entero, como 1/2, 2/4 y 3/6. Se obtienen multiplicando o dividiendo el numerador y el denominador por el mismo número.'},
  {q:'¿Cómo se suman fracciones con distinto denominador?',ans:'Primero se buscan fracciones equivalentes con un denominador común (usando el mínimo común múltiplo), y luego se suman los numeradores manteniendo ese denominador común.'},
  {q:'Explica cómo se simplifica una fracción y da un ejemplo.',ans:'Se divide el numerador y el denominador entre su máximo común divisor (MCD) hasta que no se puedan dividir más. Ejemplo: 6/9 ÷ 3 = 2/3.'},
];
let ansVisible=false;
function genTask(){sfx('click');const type=document.getElementById('tgType').value;const count=parseInt(document.getElementById('tgCount').value);ansVisible=false;const out=document.getElementById('tgOut');out.innerHTML='';if(type==='identify')genIdentifyTask(out,count);else if(type==='classify')genClassifyTask(out,count);else if(type==='complete')genCompleteTask(out,count);else if(type==='explain')genExplainTask(out,count);fin('s-tareas');}
function _instrBlock(out,title,lines){const ib=document.createElement('div');ib.className='tg-instruction-block';ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join('');out.appendChild(ib);}
function genIdentifyTask(out,count){_instrBlock(out,'Instrucción',['Copia en tu cuaderno; escribe a qué concepto corresponde cada afirmación sobre fracciones.','<strong>Ejemplo:</strong> 3/4 tiene el numerador menor que el denominador. → <span style="color:var(--jade);font-weight:700;">Fracción propia</span>']);_pick(identifyTaskDB,Math.min(count,identifyTaskDB.length)).forEach((item,i)=>{const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.type}</div></div>`;out.appendChild(div);});}
function genClassifyTask(out,count){_instrBlock(out,'Instrucción',['Copia la siguiente tabla en tu cuaderno. Para cada fracción, completa su tipo, qué la caracteriza, la regla que aplica y un ejemplo de uso.']);const items=_pick(classifyTaskDB,Math.min(count,classifyTaskDB.length));const wrap=document.createElement('div');wrap.style.overflowX='auto';const th=(t,extra='')=>`<th style="padding:0.3rem 0.4rem;border:1px solid var(--border);font-size:0.72rem;text-align:center;${extra}">${t}</th>`;let html=`<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:520px;"><thead><tr style="background:var(--pri-gl);">${th('Fracción','text-align:left;')}${th('Tipo')}${th('¿Qué la caracteriza?')}${th('Regla')}${th('Ejemplo de uso')}</tr></thead><tbody>`;items.forEach(it=>{html+=`<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td>`+Array(4).fill(`<td style="padding:0.4rem;border:1px solid var(--border);min-width:50px;"></td>`).join('')+'</tr>';});html+='</tbody></table>';wrap.innerHTML=html;out.appendChild(wrap);const ans=document.createElement('div');ans.className='tg-answer';ans.style.marginTop='0.8rem';ans.innerHTML='<strong>✅ Respuestas:</strong><br>'+items.map(it=>`<strong>${it.w}:</strong> Tipo: ${it.gen} | ${it.n} | Regla: ${it.g} | ${it.t}`).join('<br>');out.appendChild(ans);}
function genCompleteTask(out,count){_instrBlock(out,'Instrucción',['Copia y resuelve en tu cuaderno. Cada operación tiene un espacio ___. Escribe la fracción resultado correcta.']);const pool=_shuffle([...completeTaskDB]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';const sent=item.s.replace('___','<span class="tg-blank" style="min-width:90px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${sent}</strong><div style="margin-top:0.4rem;font-size:0.82rem;color:var(--gray);">📝 Opciones: <strong>${item.opts.join(' | ')}</strong></div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function genExplainTask(out,count){_instrBlock(out,'Instrucción',['Copia las siguientes preguntas en tu cuaderno y responde cada una de forma clara y completa.']);const pool=_shuffle([...explainQuestions]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.3rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function toggleAns(){ansVisible=!ansVisible;document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none');sfx('click');}

// ===================== SOPA DE LETRAS =====================
const sopaSets=[
  {size:11,grid:[
    ['N','U','M','E','R','A','D','O','R','X','T'],
    ['D','E','N','O','M','I','N','A','D','O','R'],
    ['E','Q','U','I','V','A','L','E','N','T','E'],
    ['M','I','X','T','A','I','V','U','H','Q','Y'],
    ['P','R','O','P','I','A','S','W','E','F','D'],
    ['I','M','P','R','O','P','I','A','S','H','V'],
    ['S','I','M','P','L','I','F','I','C','A','R'],
    ['S','L','E','Y','N','S','R','A','R','J','Q'],
    ['R','H','Z','I','D','R','L','M','T','E','O'],
    ['F','E','E','D','N','D','F','Z','R','C','C'],
    ['B','V','V','C','P','P','F','N','C','S','C']
  ],words:[
    {w:'NUMERADOR',cells:[[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8]]},
    {w:'DENOMINADOR',cells:[[1,0],[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[1,7],[1,8],[1,9],[1,10]]},
    {w:'EQUIVALENTE',cells:[[2,0],[2,1],[2,2],[2,3],[2,4],[2,5],[2,6],[2,7],[2,8],[2,9],[2,10]]},
    {w:'MIXTA',cells:[[3,0],[3,1],[3,2],[3,3],[3,4]]},
    {w:'PROPIA',cells:[[4,0],[4,1],[4,2],[4,3],[4,4],[4,5]]},
    {w:'IMPROPIA',cells:[[5,0],[5,1],[5,2],[5,3],[5,4],[5,5],[5,6],[5,7]]},
    {w:'SIMPLIFICAR',cells:[[6,0],[6,1],[6,2],[6,3],[6,4],[6,5],[6,6],[6,7],[6,8],[6,9],[6,10]]}
  ]},
  {size:10,grid:[
    ['S','U','M','A','X','I','U','T','N','O'],
    ['R','E','S','T','A','Q','N','P','W','F'],
    ['F','R','A','C','C','I','O','N','V','L'],
    ['M','E','D','I','O','L','E','Y','M','H'],
    ['T','E','R','C','I','O','O','E','V','W'],
    ['C','U','A','R','T','O','Q','N','T','A'],
    ['E','N','T','E','R','O','I','L','F','V'],
    ['K','D','M','V','R','H','A','Z','H','M'],
    ['T','V','Z','I','R','E','W','F','N','J'],
    ['E','T','Z','T','C','C','A','W','W','Z']
  ],words:[
    {w:'SUMA',cells:[[0,0],[0,1],[0,2],[0,3]]},
    {w:'RESTA',cells:[[1,0],[1,1],[1,2],[1,3],[1,4]]},
    {w:'FRACCION',cells:[[2,0],[2,1],[2,2],[2,3],[2,4],[2,5],[2,6],[2,7]]},
    {w:'MEDIO',cells:[[3,0],[3,1],[3,2],[3,3],[3,4]]},
    {w:'TERCIO',cells:[[4,0],[4,1],[4,2],[4,3],[4,4],[4,5]]},
    {w:'CUARTO',cells:[[5,0],[5,1],[5,2],[5,3],[5,4],[5,5]]},
    {w:'ENTERO',cells:[[6,0],[6,1],[6,2],[6,3],[6,4],[6,5]]}
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
  {q:'El numerador es el número que está arriba en una fracción.',a:true},
  {q:'El denominador indica cuántas partes se toman del entero.',a:false},
  {q:'En una fracción propia, el numerador es menor que el denominador.',a:true},
  {q:'En una fracción impropia, el numerador es menor que el denominador.',a:false},
  {q:'2 1/2 es un ejemplo de fracción mixta.',a:true},
  {q:'1/2 y 2/4 son fracciones equivalentes.',a:true},
  {q:'Para simplificar una fracción se multiplica el numerador y el denominador por el mismo número.',a:false},
  {q:'Para sumar fracciones con el mismo denominador, se suman los numeradores y el denominador no cambia.',a:true},
  {q:'Para sumar fracciones con distinto denominador, primero se busca un denominador común.',a:true},
  {q:'3/4 − 1/4 = 2/4',a:true},
  {q:'1/2 + 1/4 = 2/6',a:false},
  {q:'Una fracción unitaria tiene numerador igual a 1.',a:true},
  {q:'El MCD (máximo común divisor) se usa para simplificar fracciones.',a:true},
  {q:'Toda fracción impropia se puede escribir como número mixto.',a:true},
  {q:'La recta numérica solo puede representar números enteros, no fracciones.',a:false},
];
const evalMCBank=[
  {q:'¿Qué indica el numerador de una fracción?',o:['a) En cuántas partes se divide el entero','b) Cuántas partes se toman del entero','c) El resultado de una suma','d) El nombre de la fracción'],a:1},
  {q:'¿Qué indica el denominador?',o:['a) Cuántas partes se toman','b) El número total de partes iguales del entero','c) La mitad del numerador','d) Un número decimal'],a:1},
  {q:'¿Cuál de estas es una fracción propia?',o:['a) 7/4','b) 5/5','c) 3/8','d) 9/2'],a:2},
  {q:'¿Cuál de estas es una fracción impropia?',o:['a) 3/4','b) 1/2','c) 2/5','d) 9/4'],a:3},
  {q:'¿Cuál es la forma mixta de 7/4?',o:['a) 1 3/4','b) 2 1/4','c) 1 1/2','d) 3 1/4'],a:0},
  {q:'¿Cuál de estas fracciones es equivalente a 1/2?',o:['a) 2/3','b) 3/6','c) 2/5','d) 1/4'],a:1},
  {q:'Al simplificar 6/9, ¿qué obtienes?',o:['a) 3/4','b) 1/3','c) 2/3','d) 3/3'],a:2},
  {q:'¿Cuánto es 1/4 + 2/4?',o:['a) 3/4','b) 3/8','c) 2/4','d) 1/8'],a:0},
  {q:'¿Cuánto es 3/5 − 1/5?',o:['a) 2/5','b) 4/5','c) 2/10','d) 3/5'],a:0},
  {q:'¿Cuánto es 1/2 + 1/4?',o:['a) 2/6','b) 3/4','c) 1/4','d) 2/4'],a:1},
  {q:'¿Qué se necesita para sumar fracciones con distinto denominador?',o:['a) Restar los numeradores','b) Multiplicar los denominadores por 2','c) Buscar un denominador común','d) Nada especial'],a:2},
  {q:'¿Qué representa una fracción unitaria?',o:['a) Numerador igual a 1','b) Denominador igual a 1','c) Una fracción impropia','d) Un número decimal'],a:0},
  {q:'Un círculo dividido en 4 partes con 3 sombreadas representa...',o:['a) 1/4','b) 3/4','c) 4/4','d) 3/3'],a:1},
  {q:'¿Qué número se usa para simplificar una fracción?',o:['a) El MCD de numerador y denominador','b) El denominador menos 1','c) Cualquier número par','d) El numerador más 1'],a:0},
  {q:'¿Cuál de estas fracciones es mayor?',o:['a) 1/4','b) 1/2','c) 1/8','d) 1/10'],a:1},
];
const evalCPBank=[
  {q:'El número de arriba en una fracción se llama ___.',a:'numerador'},
  {q:'El número de abajo en una fracción se llama ___.',a:'denominador'},
  {q:'Una fracción con el numerador menor que el denominador es una fracción ___.',a:'propia'},
  {q:'Una fracción con el numerador igual o mayor que el denominador es una fracción ___.',a:'impropia'},
  {q:'Un número como 2 1/2 se llama fracción ___.',a:'mixta'},
  {q:'Fracciones que representan la misma parte del entero se llaman fracciones ___.',a:'equivalentes'},
  {q:'Reducir una fracción a su forma más simple se llama ___.',a:'simplificar'},
  {q:'Para simplificar se divide entre el ___ (máximo común divisor).',a:'mcd'},
  {q:'1/4 + 2/4 = ___',a:'3/4'},
  {q:'3/4 − 1/4 = ___',a:'2/4'},
  {q:'1/2 + 1/4 = ___',a:'3/4'},
  {q:'3/4 − 1/2 = ___',a:'1/4'},
  {q:'Una fracción con numerador 1 se llama fracción ___.',a:'unitaria'},
  {q:'La fracción representa una parte de un ___.',a:'todo'},
  {q:'En la recta numérica, las fracciones se ubican entre los números ___.',a:'enteros'},
];
const evalPRBank=[
  {term:'Numerador',def:'Indica cuántas partes se toman del entero'},
  {term:'Denominador',def:'Indica en cuántas partes iguales se divide el entero'},
  {term:'Fracción propia',def:'Numerador menor que el denominador'},
  {term:'Fracción impropia',def:'Numerador igual o mayor que el denominador'},
  {term:'Fracción mixta',def:'Combina un entero y una fracción'},
  {term:'Fracciones equivalentes',def:'Representan la misma parte del entero'},
  {term:'Simplificar',def:'Reducir una fracción a su mínima expresión'},
  {term:'MCD',def:'Máximo común divisor, se usa para simplificar'},
  {term:'Fracción unitaria',def:'Fracción con numerador igual a 1'},
  {term:'Suma con mismo denominador',def:'Se suman los numeradores'},
  {term:'Suma con distinto denominador',def:'Se busca un denominador común primero'},
  {term:'Resta con mismo denominador',def:'Se restan los numeradores'},
  {term:'Resta con distinto denominador',def:'Se buscan fracciones equivalentes primero'},
  {term:'Parte de un todo',def:'Lo que representa una fracción'},
  {term:'Recta numérica',def:'Línea donde se ubican las fracciones entre enteros'},
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

function genEval(){sfx('click');_evalFormaSelector(); const _selF = document.getElementById('evalFormaSel'); if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10))); const cf = evalFormNum; const rng = _evalRng(cf); /* la Forma cf siembra TODO el azar de esta evaluación */window._currentEvalForm=cf;evalFormNum = (evalFormNum % EVAL_FORMAS) + 1; _evalFormaSelector();saveProgress();document.getElementById('eval-screen-title').textContent=`🎓 Evaluación Final · Forma ${cf} · Fracciones`;evalAnsVisible=false;const out=document.getElementById('evalOut');out.innerHTML='';const bar=document.createElement('div');bar.className='eval-score-bar';bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje · 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25 pts</span><span class="eval-score-pill esp-tf">V/F 25 pts</span><span class="eval-score-pill esp-mc">Selección 25 pts</span><span class="eval-score-pill esp-pr">Pareados 25 pts</span></div>`;out.appendChild(bar);const cpItems=_pickF(evalCPBank,5, rng);const s1=document.createElement('div');s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';cpItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='cp';d.dataset.evalIndex=i;const qHtml=item.q.replace('___',`<input class="eval-cp-input" type="text" data-cp="${i}" autocomplete="off">`);d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbCp${i}" aria-live="polite"></div>`;s1.appendChild(d);});out.appendChild(s1);const tfItems=_pickF(evalTFBank,5, rng);const s2=document.createElement('div');s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';tfItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='tf';d.dataset.evalIndex=i;d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="true"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="false"> Falso</label></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbTf${i}" aria-live="polite"></div>`;s2.appendChild(d);});out.appendChild(s2);const mcItems=_pickF(evalMCBank,5, rng);const s3=document.createElement('div');s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';mcItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='mc';d.dataset.evalIndex=i;const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join('');d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbMc${i}" aria-live="polite"></div>`;s3.appendChild(d);});out.appendChild(s3);const prItems=_pickF(evalPRBank,5, rng);const shuffledDefs=_shuffleF(prItems, rng);const letters=['A','B','C','D','E'];const s4=document.createElement('div');s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';const matchCard=document.createElement('div');matchCard.className='eval-item';let colLeft='<div class="eval-match-col"><h4>📌 Términos</h4>';prItems.forEach((item,i)=>{colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> <select class="eval-match-select" data-pr="${i}" aria-label="Respuesta pareada ${i+16}"><option value="">—</option>${letters.map(l=>`<option value="${l}">${l}</option>`).join('')}</select> ${item.term}</div>`;});colLeft+='</div>';let colRight='<div class="eval-match-col"><h4>🔑 Definiciones</h4>';shuffledDefs.forEach((item,i)=>{colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`;});colRight+='</div>';const ansKey=prItems.map((item,i)=>{const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)];return`${i+16}→${letter}`;}).join(' · ');matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div><div class="eval-item-feedback" id="evalFbPr" aria-live="polite"></div>`;s4.appendChild(matchCard);out.appendChild(s4);window._evalPrintData={tf:tfItems,mc:mcItems,cp:cpItems,pr:{terms:prItems,shuffledDefs,letters}};const autoPanel=document.createElement('div');autoPanel.id='evalAutoResult';autoPanel.className='eval-auto-result';autoPanel.innerHTML='<strong>🧮 Evaluación interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato original sin respuestas digitadas.';out.appendChild(autoPanel);fin('s-evaluacion');}
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación Fracciones · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.12rem 0.4rem;margin:0.22rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #1565c0;background:#e3f2fd;color:#1565c0;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#1565c0;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #1565c0;height:12px;}.obt-pct{white-space:nowrap;}.qn{font-weight:700;min-width:22px;flex-shrink:0;}.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:40px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.18rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.14rem 0.35rem;margin-bottom:0.1rem;break-inside:avoid;page-break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.3;display:flex;gap:0.28rem;margin-bottom:0.07rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.1rem 0.5rem;}.mc-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:0.04rem 0.15rem;margin-left:0.8rem;}.mc-opt{font-size:9pt;display:flex;align-items:center;gap:0.15rem;}.mc-opt input{width:10px;height:10px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{margin-top:0.1rem;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.08rem 0.4rem;margin-top:0.08rem;}.pr-head{font-size:9pt;font-weight:700;color:#555;margin-bottom:0.1rem;}.pr-item{font-size:10.5pt;padding:0.1rem 0.28rem;background:#e3f2fd;border-radius:3px;margin-bottom:0.07rem;display:flex;align-items:center;gap:0.2rem;line-height:1.2;break-inside:avoid;page-break-inside:avoid;}.pr-num{font-weight:700;color:#1565c0;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.22rem;padding:0.15rem 0;page-break-before:avoid;break-before:avoid;color:#1565c0;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #1565c0;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#555;}.pa{color:#007a00;font-weight:600;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · Fracciones · Educación Básica · Matemáticas</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Evaluación Final · Fracciones · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u</div></div><div class="p-grid">${pR}</div>
  ${zgBlock}</div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("evalPage",252,0.55,1.45);fit("pautaPage",252,0.55,1.3);})();</script></body></html>`;const win=window.open('','_blank','');if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}win.document.write(doc);win.document.close();setTimeout(()=>win.print(),400);}

// ===================== PRUEBA OPERATIVA (FRACCIONES) =====================
function evalSwitchMode(mode){
  sfx('click');
  const cWrap=document.getElementById('evalConceptWrap'),oWrap=document.getElementById('evalOpWrap');
  const cBtn=document.getElementById('evalModeBtnConcept'),oBtn=document.getElementById('evalModeBtnOp');
  if(mode==='op'){
    cWrap.style.display='none';oWrap.style.display='block';
    cBtn.classList.remove('active');cBtn.setAttribute('aria-selected','false');
    oBtn.classList.add('active');oBtn.setAttribute('aria-selected','true');
  }else{
    oWrap.style.display='none';cWrap.style.display='block';
    oBtn.classList.remove('active');oBtn.setAttribute('aria-selected','false');
    cBtn.classList.add('active');cBtn.setAttribute('aria-selected','true');
  }
}

// ---- Aritmética de fracciones exacta (sin coma flotante para valores enteros) ----
let _opRnd = Math.random; /* la Prueba Operativa lo re-siembra con _evalRng(100000+forma) */
function _rint(min,max){return Math.floor(_opRnd()*(max-min+1))+min;}
const _fracDenomPool=[2,3,4,5,6,8,10,12];
function _gcdFrac(a,b){a=Math.abs(a);b=Math.abs(b);while(b){const t=b;b=a%b;a=t;}return a||1;}
function _simplifyFrac(n,d){const g=_gcdFrac(n,d);return{n:n/g,d:d/g};}
function _fracStr(n,d){const s=_simplifyFrac(n,d);return s.d===1?String(s.n):s.n+'/'+s.d;}
function _fracVal(n,d){return n/d;}
function _randSimpleFrac(){const d=_fracDenomPool[_rint(0,_fracDenomPool.length-1)];const n=_rint(1,d-1);return{n,d};}
function _parseFrac(str){
  if(str===null||str===undefined)return null;
  str=str.toString().trim();
  if(str==='')return null;
  if(str.includes('/')){
    const parts=str.split('/');
    if(parts.length!==2)return null;
    const n=parseFloat(parts[0]),d=parseFloat(parts[1]);
    if(isNaN(n)||isNaN(d)||d===0)return null;
    return{n,d};
  }
  const v=parseFloat(str.replace(',','.'));
  if(isNaN(v))return null;
  return{n:v,d:1};
}
function isFracCorrect(student,expectedStr){
  const s=_parseFrac(student),e=_parseFrac(expectedStr);
  if(!s||!e)return false;
  return Math.abs(s.n*e.d-e.n*s.d)<1e-6;
}
function isSimplifyCorrect(student,expectedStr){
  const s=_parseFrac(student),e=_parseFrac(expectedStr);
  if(!s||!e)return false;
  const sr=_simplifyFrac(s.n,s.d),er=_simplifyFrac(e.n,e.d);
  return sr.n===s.n&&sr.d===s.d&&sr.n===er.n&&sr.d===er.d;
}
function isOpNumCorrect(student,expectedStr){
  if(student===undefined||student===null)return false;
  const s=student.toString().trim().replace(',','.');
  if(s==='')return false;
  const sn=parseFloat(s),en=parseFloat(expectedStr);
  if(isNaN(sn)||isNaN(en))return false;
  return Math.abs(sn-en)<1e-6;
}

function genFracOpItems(){
  const items=[];
  for(let i=0;i<5;i++){
    const sameDen=_opRnd()<0.5;
    let a,b;
    if(sameDen){
      const d=_fracDenomPool[_rint(0,_fracDenomPool.length-1)];
      a={n:_rint(1,d-1),d};b={n:_rint(1,d-1),d};
    }else{
      const pool=_shuffleF(_fracDenomPool,_opRnd).slice(0,2);
      a={n:_rint(1,pool[0]-1),d:pool[0]};b={n:_rint(1,pool[1]-1),d:pool[1]};
    }
    let isAdd=_opRnd()<0.6;let op=isAdd?'+':'-';
    if(!isAdd){
      if(_fracVal(a.n,a.d)<_fracVal(b.n,b.d)){const t=a;a=b;b=t;}
      if(_fracVal(a.n,a.d)===_fracVal(b.n,b.d))op='+';
    }
    const commonD=sameDen?a.d:(a.d*b.d)/_gcdFrac(a.d,b.d);
    const an=a.n*(commonD/a.d),bn=b.n*(commonD/b.d);
    const resultN=op==='+'?an+bn:an-bn;
    items.push({a:_fracStr(a.n,a.d),b:_fracStr(b.n,b.d),op,ans:_fracStr(resultN,commonD)});
  }
  return items;
}
function genSimplifyItems(){
  const items=[];
  for(let i=0;i<10;i++){
    let baseD=_fracDenomPool[_rint(0,_fracDenomPool.length-1)];
    let baseN=_rint(1,baseD-1);
    const s=_simplifyFrac(baseN,baseD);baseN=s.n;baseD=s.d;
    const factor=_rint(2,6);
    items.push({q:(baseN*factor)+'/'+(baseD*factor),ans:baseD===1?String(baseN):baseN+'/'+baseD});
  }
  return items;
}
function genFracCmpItems(){
  const items=[];
  for(let i=0;i<10;i++){
    let a=_randSimpleFrac(),b;
    const forceEq=_opRnd()<0.2;
    if(forceEq){const k=_rint(2,4);b={n:a.n*k,d:a.d*k};}
    else{b=_randSimpleFrac();if(_fracVal(a.n,a.d)===_fracVal(b.n,b.d))b={n:b.n+1,d:b.d};}
    const av=_fracVal(a.n,a.d),bv=_fracVal(b.n,b.d);
    items.push({a:_fracStr(a.n,a.d),b:_fracStr(b.n,b.d),rel:av===bv?'eq':(av>bv?'gt':'lt')});
  }
  return items;
}
function genEquivItems(){
  const items=[];
  for(let i=0;i<10;i++){
    const base=_randSimpleFrac(),k=_rint(2,6);
    const hideNum=_opRnd()<0.5;
    const N=base.n*k,D=base.d*k;
    if(hideNum)items.push({q:`${base.n}/${base.d} = ___/${D}`,ans:String(N)});
    else items.push({q:`${base.n}/${base.d} = ${N}/___`,ans:String(D)});
  }
  return items;
}
function genFracOrdItems(){
  const groups=[];
  for(let g=0;g<4;g++){
    const dir=_opRnd()<0.5?'mayor':'menor';
    const nums=[];let tries=0;
    while(nums.length<5&&tries<300){
      tries++;const cand=_randSimpleFrac();
      if(!nums.some(n=>_fracVal(n.n,n.d)===_fracVal(cand.n,cand.d)))nums.push(cand);
    }
    const sortedAsc=[...nums].sort((x,y)=>_fracVal(x.n,x.d)-_fracVal(y.n,y.d));
    const correctOrder=(dir==='mayor'?[...sortedAsc].reverse():sortedAsc).map(n=>_fracStr(n.n,n.d));
    groups.push({dir,display:_shuffleF(nums,_opRnd).map(n=>_fracStr(n.n,n.d)),correctOrder});
  }
  return groups;
}

function genEvalOp(){
  sfx('click');
  _injectFormaSel('genEvalOp', 'evalOpFormaSel', evalOpFormNum, function (v) { evalOpFormNum = v; });
  const _sO = document.getElementById('evalOpFormaSel');
  if (_sO && parseInt(_sO.value, 10)) evalOpFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sO.value, 10)));
  const cf=evalOpFormNum;window._currentEvalOpForm=cf;
  _opRnd = _evalRng(100000 + cf); /* la Forma cf siembra TODO el azar de esta prueba operativa */
  evalOpFormNum=(evalOpFormNum%EVAL_FORMAS)+1;
  _injectFormaSel('genEvalOp', 'evalOpFormaSel', evalOpFormNum, function (v) { evalOpFormNum = v; });
  saveProgress();
  document.getElementById('evalop-screen-title').textContent=`📐 Prueba Operativa · Forma ${cf} · Fracciones`;
  evalOpAnsVisible=false;
  const out=document.getElementById('evalOpOut');out.innerHTML='';

  const opItems=genFracOpItems();
  const s1=document.createElement('div');s1.innerHTML='<div class="eval-section-title">I. Operaciones (suma y resta de fracciones) <span class="eval-pts">50 pts · 10 pts c/u</span></div>';
  opItems.forEach((it,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.innerHTML=`<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.a} ${it.op} ${it.b} =</span><input class="eval-cp-input" type="text" data-opx="${i}" autocomplete="off" placeholder="ej. 3/4"></div><div class="eval-answer">${it.ans}</div><div class="eval-item-feedback" id="evalFbOpx${i}" aria-live="polite"></div>`;s1.appendChild(d);});
  out.appendChild(s1);

  const simpItems=genSimplifyItems();
  const s2=document.createElement('div');s2.innerHTML='<div class="eval-section-title">II. Simplifica a su mínima expresión <span class="eval-pts">10 pts · 1 pt c/u</span></div>';
  simpItems.forEach((it,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.innerHTML=`<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.q} =</span><input class="eval-cp-input" type="text" data-simp="${i}" autocomplete="off" placeholder="ej. 3/4"></div><div class="eval-answer">${it.ans}</div><div class="eval-item-feedback" id="evalFbSimp${i}" aria-live="polite"></div>`;s2.appendChild(d);});
  out.appendChild(s2);

  const cmpItems=genFracCmpItems();
  const s3=document.createElement('div');s3.innerHTML='<div class="eval-section-title">III. Compara: ¿mayor, menor o igual? <span class="eval-pts">10 pts · 1 pt c/u</span></div>';
  cmpItems.forEach((it,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text opx-expr">${it.a} ___ ${it.b}</span></div><div class="eval-cmp-opts"><label class="eval-cmp-opt"><input type="radio" name="fcmp${i}" value="gt"> Mayor que (&gt;)</label><label class="eval-cmp-opt"><input type="radio" name="fcmp${i}" value="lt"> Menor que (&lt;)</label><label class="eval-cmp-opt"><input type="radio" name="fcmp${i}" value="eq"> Igual (=)</label></div><div class="eval-answer">${it.rel==='gt'?'Mayor que':it.rel==='lt'?'Menor que':'Igual'}</div><div class="eval-item-feedback" id="evalFbCmp${i}" aria-live="polite"></div>`;s3.appendChild(d);});
  out.appendChild(s3);

  const equivItems=genEquivItems();
  const s4=document.createElement('div');s4.innerHTML='<div class="eval-section-title">IV. Completa la fracción equivalente <span class="eval-pts">10 pts · 1 pt c/u</span></div>';
  equivItems.forEach((it,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.innerHTML=`<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.q}</span><input class="eval-cp-input" type="text" data-equiv="${i}" autocomplete="off" style="width:70px;" placeholder="?"></div><div class="eval-answer">${it.ans}</div><div class="eval-item-feedback" id="evalFbEquiv${i}" aria-live="polite"></div>`;s4.appendChild(d);});
  out.appendChild(s4);

  const ordGroups=genFracOrdItems();
  const s5=document.createElement('div');s5.innerHTML='<div class="eval-section-title">V. Ordena cada grupo de fracciones <span class="eval-pts">20 pts · 5 pts c/u</span></div>';
  ordGroups.forEach((g,gi)=>{
    const d=document.createElement('div');d.className='eval-item eval-auto-item evord-group';
    d.innerHTML=`<div class="evord-dir">${gi+1}. Ordena de ${g.dir==='mayor'?'MAYOR a menor':'MENOR a mayor'}:</div><div class="evord-list" id="evordList${gi}"></div><div class="eval-answer">${g.correctOrder.join(' · ')}</div><div class="eval-item-feedback" id="evalFbOrd${gi}" aria-live="polite"></div>`;
    s5.appendChild(d);
  });
  out.appendChild(s5);

  window._evalOpData={ops:opItems,simp:simpItems,cmp:cmpItems,equiv:equivItems,ord:ordGroups.map(g=>({dir:g.dir,current:[...g.display],correctOrder:g.correctOrder}))};
  ordGroups.forEach((g,gi)=>_renderOrdGroup(gi));
  const autoPanel=document.createElement('div');autoPanel.id='evalOpAutoResult';autoPanel.className='eval-auto-result';autoPanel.innerHTML='<strong>🧮 Prueba interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato original para resolver en papel.';out.appendChild(autoPanel);
  fin('s-evaluacion');
}

function _renderOrdGroup(gi){
  const data=window._evalOpData.ord[gi];
  const list=document.getElementById('evordList'+gi);if(!list)return;
  list.innerHTML='';
  data.current.forEach((label,i)=>{
    const div=document.createElement('div');div.className='evord-item';
    div.innerHTML=`<div class="evord-arrows"><button class="sort-arrow" onclick="evordMove(${gi},${i},-1)"${i===0?' disabled':''}>▲</button><button class="sort-arrow" onclick="evordMove(${gi},${i},1)"${i===data.current.length-1?' disabled':''}>▼</button></div><div class="evord-num">${label}</div>`;
    list.appendChild(div);
  });
}
function evordMove(gi,idx,dir){
  sfx('click');
  const data=window._evalOpData.ord[gi];const ni=idx+dir;
  if(ni<0||ni>=data.current.length)return;
  [data.current[idx],data.current[ni]]=[data.current[ni],data.current[idx]];
  _renderOrdGroup(gi);
}

function toggleEvalOpAns(){evalOpAnsVisible=!evalOpAnsVisible;document.querySelectorAll('#evalOpOut .eval-answer').forEach(el=>el.style.display=evalOpAnsVisible?'block':'none');sfx('click');}

function gradeEvalOp(){
  if(!window._evalOpData){showToast('⚠️ Genera una prueba operativa primero');return;}
  sfx('click');
  const d=window._evalOpData;
  let total=0;const detail={ops:0,simp:0,cmp:0,equiv:0,ord:0};
  d.ops.forEach((it,i)=>{const input=document.querySelector(`[data-opx="${i}"]`);const ok=isFracCorrect(input?input.value:'',it.ans);if(input){input.classList.toggle('eval-input-ok',ok);input.classList.toggle('eval-input-no',!ok);}if(ok){detail.ops++;total+=10;}setEvalFeedback('evalFbOpx'+i,ok,ok?'Correcto. +10 pts':'Revisar. Respuesta esperada: '+it.ans);});
  d.simp.forEach((it,i)=>{const input=document.querySelector(`[data-simp="${i}"]`);const ok=isSimplifyCorrect(input?input.value:'',it.ans);if(input){input.classList.toggle('eval-input-ok',ok);input.classList.toggle('eval-input-no',!ok);}if(ok){detail.simp++;total+=1;}setEvalFeedback('evalFbSimp'+i,ok,ok?'Correcto. +1 pt':'Revisar. Respuesta esperada: '+it.ans);});
  d.cmp.forEach((it,i)=>{const selected=document.querySelector(`input[name="fcmp${i}"]:checked`);const ok=!!selected&&selected.value===it.rel;if(ok){detail.cmp++;total+=1;}setEvalFeedback('evalFbCmp'+i,ok,ok?'Correcto. +1 pt':'Revisar. Respuesta esperada: '+(it.rel==='gt'?'Mayor que':it.rel==='lt'?'Menor que':'Igual'));});
  d.equiv.forEach((it,i)=>{const input=document.querySelector(`[data-equiv="${i}"]`);const ok=isOpNumCorrect(input?input.value:'',it.ans);if(input){input.classList.toggle('eval-input-ok',ok);input.classList.toggle('eval-input-no',!ok);}if(ok){detail.equiv++;total+=1;}setEvalFeedback('evalFbEquiv'+i,ok,ok?'Correcto. +1 pt':'Revisar. Respuesta esperada: '+it.ans);});
  d.ord.forEach((g,gi)=>{const ok=g.current.every((v,i)=>v===g.correctOrder[i]);if(ok){detail.ord++;total+=5;}setEvalFeedback('evalFbOrd'+gi,ok,ok?'¡Orden correcto! +5 pts':'Orden incorrecto. Clave: '+g.correctOrder.join(' · '));});
  const result=document.getElementById('evalOpAutoResult');
  if(result){result.className='eval-auto-result '+(total>=70?'eval-auto-pass':'eval-auto-risk');result.innerHTML=`<strong>Resultado automático: ${total}/100 puntos</strong><br><span>Operaciones: ${detail.ops*10}/50 · Simplificar: ${detail.simp}/10 · Comparar: ${detail.cmp}/10 · Equivalente: ${detail.equiv}/10 · Ordenar: ${detail.ord*5}/20</span><br><em>Este resultado es solo para revisión en pantalla; la impresión conserva el formato limpio para papel.</em>`;}
  if(total>=70){pts(8);showToast('🎯 Prueba operativa calificada: '+total+'/100');}
  else showToast('🧮 Prueba operativa calificada: '+total+'/100. Revisa las respuestas marcadas.');
}

function printEvalOp(){
  if(!window._evalOpData){showToast('⚠️ Genera una prueba operativa primero');return;}
  sfx('click');
  const forma=window._currentEvalOpForm||1;const d=window._evalOpData;
  let s1=`<div class="sec-title"><span>I. Operaciones (suma y resta de fracciones)</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 50%</span></div></div><p class="opx-instr">Resuelve cada operación con lápiz (trabaja el procedimiento en el reverso de esta hoja) y coloca la respuesta final en la línea. Valor 10% c/u.</p>`;
  d.ops.forEach((it,i)=>{s1+=`<div class="opx-print-row"><span class="qn">${i+1}.</span><span class="opx-print-expr">${it.a} ${it.op} ${it.b} =</span><span class="opx-blank"></span></div>`;});
  const simpTbl=(items)=>`<table class="rnd-tbl"><tr><th>Fracción</th><th>Simplificada</th></tr>${items.map(it=>`<tr><td>${it.q}</td><td></td></tr>`).join('')}</table>`;
  const simpHalf=Math.ceil(d.simp.length/2);
  let s2=`<div class="sec-title"><span>II. Simplifica a su mínima expresión</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10%</span></div></div><div class="rnd-print-grid">${simpTbl(d.simp.slice(0,simpHalf))}${simpTbl(d.simp.slice(simpHalf))}</div>`;
  const cmpHalf=Math.ceil(d.cmp.length/2);
  const cmpRow=(it)=>`<div class="cmp-print-row"><span class="cmp-print-num">${it.a}</span><span class="cmp-box">&nbsp;</span><span class="cmp-print-num">${it.b}</span></div>`;
  let s3=`<div class="sec-title"><span>III. Compara: ¿mayor, menor o igual?</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10%</span></div></div><div class="cmp-print-grid"><div>${d.cmp.slice(0,cmpHalf).map(cmpRow).join('')}</div><div>${d.cmp.slice(cmpHalf).map(cmpRow).join('')}</div></div>`;
  const equivTbl=(items)=>`<table class="rnd-tbl"><tr><th>Completa</th><th>Respuesta</th></tr>${items.map(it=>`<tr><td>${it.q}</td><td></td></tr>`).join('')}</table>`;
  const equivHalf=Math.ceil(d.equiv.length/2);
  let s4=`<div class="sec-title"><span>IV. Completa la fracción equivalente</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10%</span></div></div><div class="rnd-print-grid">${equivTbl(d.equiv.slice(0,equivHalf))}${equivTbl(d.equiv.slice(equivHalf))}</div>`;
  let s5=`<div class="sec-title"><span>V. Ordena cada grupo de fracciones</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20%</span></div></div><div class="ord-print-grid">${d.ord.map((g,gi)=>`<div class="ord-print-box"><div class="ord-print-dir">${gi+1}. Ordene de ${g.dir==='mayor'?'Mayor a Menor':'Menor a Mayor'}.</div><table class="ord-print-tbl"><tr>${g.current.map(v=>`<td>${v}</td>`).join('')}</tr><tr>${g.current.map(()=>'<td class="ord-print-cell"></td>').join('')}</tr></table></div>`).join('')}</div>`;
  let pR='';
  pR+=`<div class="p-sec"><div class="p-ttl">I. Operaciones</div><table class="p-tbl">${d.ops.map((it,i)=>`<tr><td class="pn">${i+1}.</td><td class="pa">${it.ans}</td></tr>`).join('')}</table></div>`;
  pR+=`<div class="p-sec"><div class="p-ttl">II. Simplificar</div><table class="p-tbl">${d.simp.map((it,i)=>`<tr><td class="pn">${i+1}.</td><td class="pa">${it.ans}</td></tr>`).join('')}</table></div>`;
  pR+=`<div class="p-sec"><div class="p-ttl">III. Comparar</div><table class="p-tbl">${d.cmp.map((it,i)=>`<tr><td class="pn">${i+1}.</td><td class="pa">${it.rel==='gt'?'&gt;':it.rel==='lt'?'&lt;':'='}</td></tr>`).join('')}</table></div>`;
  pR+=`<div class="p-sec"><div class="p-ttl">IV. Equivalente</div><table class="p-tbl">${d.equiv.map((it,i)=>`<tr><td class="pn">${i+1}.</td><td class="pa">${it.ans}</td></tr>`).join('')}</table></div>`;
  pR+=`<div class="p-sec" style="grid-column:1/-1;"><div class="p-ttl">V. Ordenar</div>${d.ord.map((g,gi)=>`<div class="p-ord-line"><strong>${gi+1}.</strong> ${g.correctOrder.join(' · ')}</div>`).join('')}</div>`;
  const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Prueba Operativa Fracciones · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11.5pt;color:#111;background:#fff;padding:4mm 6mm;}.ph{margin-bottom:0.5rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:#555;margin-top:0.15rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.4rem 0 0.2rem;border-left:4px solid #1565c0;background:#e3f2fd;color:#1565c0;display:flex;justify-content:space-between;align-items:center;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:#1565c0;font-weight:700;font-style:italic;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #1565c0;height:12px;}.qn{font-weight:700;min-width:20px;display:inline-block;}.opx-instr{font-size:9pt;color:#555;margin-bottom:0.3rem;}.opx-print-row{display:flex;align-items:baseline;gap:0.4rem;font-size:11pt;padding:0.18rem 0.2rem;}.opx-print-expr{font-family:'Courier New',monospace;font-weight:700;}.opx-blank{display:inline-block;width:160px;flex:none;border-bottom:1.5px solid #111;min-height:14px;margin-left:0.4rem;}.rnd-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 1rem;margin-top:0.2rem;}.rnd-tbl{width:100%;border-collapse:collapse;font-size:9.5pt;}.rnd-tbl th,.rnd-tbl td{border:1px solid #999;padding:0.12rem 0.4rem;text-align:left;}.cmp-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 1rem;margin-top:0.2rem;}.cmp-print-row{display:flex;align-items:center;gap:0.4rem;font-size:11pt;padding:0.2rem 0;}.cmp-box{display:inline-block;width:22px;height:18px;border:1.5px solid #111;}.ord-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.8rem;margin-top:0.2rem;}.ord-print-box{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.4rem;}.ord-print-dir{font-size:9.5pt;font-weight:700;margin-bottom:0.2rem;}.ord-print-tbl{width:100%;border-collapse:collapse;font-size:9.5pt;}.ord-print-tbl td{border:1px solid #999;padding:0.15rem 0.3rem;text-align:center;}.ord-print-cell{height:16px;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.35rem;margin-bottom:0.5rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.08rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.9rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.28rem 0.45rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.1rem;margin-bottom:0.18rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.07rem 0.12rem;vertical-align:top;}.pn{font-weight:700;width:16px;color:#555;}.pa{color:#007a00;font-weight:600;}.p-ord-line{font-size:10.5pt;margin-bottom:0.2rem;color:#007a00;}.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:10mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Examen de Matemáticas — Actividades Operativas · Fracciones · Educación Básica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · Operaciones 50% · Simplificar 10% · Comparar 10% · Equivalente 10% · Ordenar 20%</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row" style="margin-top:0.4rem;font-weight:700;color:#1565c0;">Total obtenido: <span class="obt-line" style="min-width:80px;border-bottom:1.5px solid #1565c0;"></span> de 100%</div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✔ PAUTA — Prueba Operativa · Fracciones · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts</div></div><div class="p-grid">${pR}</div></div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("evalPage",250,0.55,1.2);fit("pautaPage",250,0.55,1.2);})();</script></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(doc);win.document.close();setTimeout(()=>win.print(),400);
}

// ===================== LABORATORIO DE FRACCIONES =====================
const parteData={
  propia:{
    nombre:'Fracción propia',icon:'🍕',
    definicion:{title:'¿Qué es?',info:'• El <strong>numerador es menor</strong> que el denominador<br>• Representa <strong>menos de un entero</strong> completo<br>• Es la fracción "básica" con la que se empieza a trabajar<br>• Su valor siempre está <strong>entre 0 y 1</strong><br>• Responde a "¿qué parte de un entero tengo?"'},
    ejemplo:{title:'Ejemplo numérico',info:'• <strong>3/4</strong> (tres de cuatro partes)<br>• <strong>1/2</strong> (una de dos partes)<br>• <strong>2/5</strong> (dos de cinco partes)<br>• En todos, el número de arriba es <strong>menor</strong> que el de abajo'},
    grafica:{title:'Representación gráfica',info:'<div class="frac-pie-row"><div class="frac-pie-item"><div class="frac-pie" style="background:conic-gradient(var(--pri) 0% 75%, var(--card) 75% 100%);"></div><div class="frac-pie-label">3/4</div></div></div><div class="frac-visual-caption">🍕 Un pastel dividido en 4 partes iguales, con 3 partes sombreadas.</div><div class="frac-bar-wrap"><div class="frac-bar-seg shaded"></div><div class="frac-bar-seg shaded"></div><div class="frac-bar-seg"></div></div><div class="frac-visual-caption">📊 Una barra dividida en 3 partes, con 2 sombreadas (2/3).</div>'},
    regla:{title:'Regla/uso práctico',info:'• Se usa para expresar <strong>una parte de algo entero</strong> (una porción de pizza, de tiempo, de dinero)<br>• Si dos fracciones propias tienen <strong>igual denominador</strong>, para sumarlas o restarlas solo se opera el numerador: 1/4 + 2/4 = 3/4<br>• Si tienen <strong>distinto denominador</strong>, primero se buscan equivalentes con un denominador común'}
  },
  impropia:{
    nombre:'Fracción impropia',icon:'🍰',
    definicion:{title:'¿Qué es?',info:'• El <strong>numerador es igual o mayor</strong> que el denominador<br>• Representa <strong>un entero completo o más</strong><br>• Se puede convertir siempre a una <strong>fracción mixta</strong><br>• Su valor es <strong>mayor o igual a 1</strong><br>• Responde a "¿tengo uno o más enteros completos?"'},
    ejemplo:{title:'Ejemplo numérico',info:'• <strong>7/4</strong> (equivale a 1 entero y 3/4 más)<br>• <strong>5/3</strong> (equivale a 1 entero y 2/3 más)<br>• <strong>9/9</strong> (equivale exactamente a 1 entero)<br>• El numerador es <strong>igual o mayor</strong> que el denominador'},
    grafica:{title:'Representación gráfica',info:'<div class="frac-pie-row"><div class="frac-pie-item"><div class="frac-pie" style="background:conic-gradient(var(--pri) 0% 100%);"></div><div class="frac-pie-label">1 entero</div></div><div class="frac-pie-item"><div class="frac-pie" style="background:conic-gradient(var(--pri) 0% 75%, var(--card) 75% 100%);"></div><div class="frac-pie-label">+ 3/4</div></div></div><div class="frac-visual-caption">🍕🍰 Un pastel completo sombreado más otro pastel dividido en 4 con 3 partes sombreadas: en total 7/4.</div>'},
    regla:{title:'Regla/uso práctico',info:'• Para convertir a mixta: divide el numerador entre el denominador; el <strong>cociente</strong> es la parte entera y el <strong>residuo</strong> sobre el denominador es la fracción<br>• Ejemplo: 7 ÷ 4 = 1 residuo 3 → <strong>1 3/4</strong><br>• Útil al sumar fracciones cuyo resultado supera el entero, como 3/4 + 2/4 = 5/4 = 1 1/4'}
  },
  mixta:{
    nombre:'Fracción mixta',icon:'🎂',
    definicion:{title:'¿Qué es?',info:'• Combina un <strong>número entero</strong> y una <strong>fracción propia</strong> juntos<br>• Es otra forma de escribir una fracción impropia<br>• Se lee como "el entero y la fracción", ej. "dos y un medio"<br>• Muy usada en la vida diaria (recetas, medidas, tiempo)<br>• Responde a "¿cuántos enteros completos y qué parte más?"'},
    ejemplo:{title:'Ejemplo numérico',info:'• <strong>2 1/2</strong> = dos enteros y un medio (equivale a 5/2)<br>• <strong>1 3/4</strong> = un entero y tres cuartos (equivale a 7/4)<br>• <strong>3 1/5</strong> = tres enteros y un quinto (equivale a 16/5)'},
    grafica:{title:'Representación gráfica',info:'<div class="frac-pie-row"><div class="frac-pie-item"><div class="frac-pie" style="background:conic-gradient(var(--pri) 0% 100%);"></div><div class="frac-pie-label">1</div></div><div class="frac-pie-item"><div class="frac-pie" style="background:conic-gradient(var(--pri) 0% 100%);"></div><div class="frac-pie-label">1</div></div><div class="frac-pie-item"><div class="frac-pie" style="background:conic-gradient(var(--pri) 0% 50%, var(--card) 50% 100%);"></div><div class="frac-pie-label">1/2</div></div></div><div class="frac-visual-caption">🎂 Dos pasteles completos sombreados más un tercer pastel dividido en 2 con 1 parte sombreada: en total 2 1/2.</div>'},
    regla:{title:'Regla/uso práctico',info:'• Para convertir a impropia: <strong>(entero × denominador + numerador) / denominador</strong><br>• Ejemplo: 2 1/2 → (2×2+1)/2 = <strong>5/2</strong><br>• Para sumar o restar fracciones mixtas, muchas veces conviene convertirlas primero a impropias y luego operar'}
  },
  equivalente:{
    nombre:'Fracciones equivalentes',icon:'⚖️',
    definicion:{title:'¿Qué es?',info:'• Son fracciones con <strong>números distintos</strong> que representan <strong>la misma parte</strong> de un entero<br>• Se obtienen multiplicando o dividiendo el numerador y el denominador por el <strong>mismo número</strong> (nunca 0)<br>• Toda fracción tiene <strong>infinitas</strong> fracciones equivalentes<br>• Son la base para <strong>comparar y sumar</strong> fracciones con distinto denominador'},
    ejemplo:{title:'Ejemplo numérico',info:'• <strong>1/2 = 2/4 = 3/6 = 4/8</strong><br>• <strong>1/3 = 2/6 = 3/9</strong><br>• Se comprueba dividiendo: 4/8 ÷ 4 = 1/2 (mismo valor)'},
    grafica:{title:'Representación gráfica',info:'<div class="frac-pie-row"><div class="frac-pie-item"><div class="frac-pie" style="background:conic-gradient(var(--sec) 0% 50%, var(--card) 50% 100%);"></div><div class="frac-pie-label">1/2</div></div><div class="frac-pie-item"><div class="frac-pie" style="background:conic-gradient(var(--sec) 0% 50%, var(--card) 50% 100%);"></div><div class="frac-pie-label">2/4</div></div></div><div class="frac-visual-caption">⚖️ Dos pasteles del mismo tamaño: uno dividido en 2 con 1 sombreada, el otro dividido en 4 con 2 sombreadas. La parte sombreada ocupa exactamente la misma superficie.</div>'},
    regla:{title:'Regla/uso práctico',info:'• Para sumar o restar fracciones con <strong>distinto denominador</strong>, primero se buscan fracciones equivalentes con un <strong>denominador común</strong> (usando el mínimo común múltiplo)<br>• Ejemplo: 1/2 + 1/4 → 1/2 = 2/4, entonces 2/4 + 1/4 = 3/4<br>• También sirven para <strong>simplificar</strong>: buscar la fracción equivalente más simple'}
  }
};
let labParte='propia',labAspecto='definicion';
function labShowParte(parteKey){labParte=parteKey;updateLabDisplay();document.querySelectorAll('.lab-cont-btn').forEach(b=>b.classList.remove('active-pri'));const btn=document.querySelector(`[data-parte="${parteKey}"]`);if(btn)btn.classList.add('active-pri');if(typeof sfx==='function')sfx('click');}
function labShowAspecto(aspectoKey){labAspecto=aspectoKey;updateLabDisplay();document.querySelectorAll('.lab-asp-btn').forEach(b=>b.classList.remove('active-sec'));const btn=document.querySelector(`[data-aspecto="${aspectoKey}"]`);if(btn)btn.classList.add('active-sec');if(typeof sfx==='function')sfx('click');}
function updateLabDisplay(){const data=parteData[labParte];const asp=data[labAspecto];document.getElementById('lab-sentence').innerHTML=`🍕 Explorando: <strong>${data.nombre}</strong> → <strong>${asp.title}</strong>`;document.getElementById('lab-display').innerHTML=`<div class="lab-cont-header">${data.icon} ${data.nombre}</div><div class="lab-asp-title">${asp.title}</div><div class="lab-asp-info">${asp.info}</div>`;}

// ===================== DIPLOMA =====================
function _diplPct(){return xp>=MXP?100:Math.round((xp/MXP)*100);}
function openDiploma(){sfx('fan');const pct=_diplPct();document.getElementById('diplPct').textContent=pct+'%';document.getElementById('diplBar').style.width=pct+'%';document.getElementById('diplDate').textContent='Fecha: '+new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});const msgs=['¡Sigue aprendiendo!','¡Muy buen trabajo!','¡Excelente con las fracciones!','¡Eres un experto en fracciones!','¡Maestro de las Fracciones!'];document.getElementById('diplMsg').textContent=msgs[Math.min(Math.floor(pct/25),4)];const stars=['⭐','⭐⭐','⭐⭐⭐'];document.getElementById('diplStars').textContent=stars[Math.min(Math.floor(pct/40),2)];const achTxt=unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(' · ');document.getElementById('diplAch').textContent=achTxt||'Sigue completando secciones para desbloquear logros';document.getElementById('diplomaOverlay').classList.add('open');launchConfetti();}
function closeDiploma(){document.getElementById('diplomaOverlay').classList.remove('open');}
function updateDiplomaName(v){document.getElementById('diplName').textContent=v||'Estudiante';}
function shareWA(){const name=document.getElementById('diplName').textContent||'Estudiante';const pct=_diplPct();const msg=`🍕 ¡${name} completó la Misión "Fracciones"! 🏅 Progreso: ${pct}% · ➗ policastsapien.com`;_waShare(msg);}
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
  document.querySelector('[data-parte="propia"]')?.classList.add('active-pri');
  document.querySelector('[data-aspecto="definicion"]')?.classList.add('active-sec');
  renderAchPanel();
});

// Formas deterministas v1: selectores de forma visibles desde la carga de la página
(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalOp==='function') _injectFormaSel('genEvalOp','evalOpFormaSel',evalOpFormNum,function(v){evalOpFormNum=v;}); }catch(e){} try{ if(typeof genEvalCrit==='function') _injectFormaSel('genEvalCrit','evalCritFormaSel',evalCritFormNum,function(v){evalCritFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();
