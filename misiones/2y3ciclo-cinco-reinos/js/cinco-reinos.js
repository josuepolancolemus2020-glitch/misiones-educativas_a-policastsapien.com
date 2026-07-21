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
const SAVE_KEY='cinco_reinos_v1';
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
  primer_quiz:{icon:'🔬',label:'Primera prueba de los reinos superada'},
  flash_master:{icon:'🃏',label:'Todas las flashcards de los reinos exploradas'},
  clasif_pro:{icon:'🗂️',label:'Clasificador de seres vivos experto'},
  id_master:{icon:'🔍',label:'Identificador de reinos maestro'},
  reto_hero:{icon:'🏆',label:'Héroe del reto de los cinco reinos'},
  nivel3:{icon:'🧫',label:'¡Naturalista! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡Maestro de los Reinos! Nivel 6'},
  widgets_master:{icon:'🧩',label:'Widgets de los reinos dominados'}
};
function unlockAchievement(id){if(unlockedAch.includes(id))return;unlockedAch.push(id);sfx('ach');showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label);launchConfetti();renderAchPanel();saveProgress();}
function renderAchPanel(){const list=document.getElementById('achList');list.innerHTML='';Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{const div=document.createElement('div');div.className='ach-item'+(unlockedAch.includes(id)?'':' locked');div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`;list.appendChild(div);});}
function toggleAchPanel(){sfx('click');document.getElementById('achPanel').classList.toggle('open');}
function showToast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}t.textContent=msg;t.style.display='block';clearTimeout(t._tid);t._tid=setTimeout(()=>t.style.display='none',3200);}
function launchConfetti(){const colors=['#16a34a','#4ade80','#0d9488','#5eead4','#00b894'];for(let i=0;i<60;i++){const c=document.createElement('div');c.className='confetti-piece';c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`;document.body.appendChild(c);c.addEventListener('animationend',()=>c.remove());}}

// ===================== XP =====================
const lvls=[{t:0,n:'Aprendiz 🌱'},{t:25,n:'Explorador 🔬'},{t:55,n:'Naturalista 🧫'},{t:90,n:'Biólogo 🧬'},{t:130,n:'Investigador 🔭'},{t:165,n:'Taxónomo 🏅'},{t:190,n:'Maestro de los Reinos 🏆'}];
function pts(n){xp=Math.max(0,Math.min(MXP,xp+n));updateXPBar();saveProgress();}
function updateXPBar(){const pct=Math.round((xp/MXP)*100);document.getElementById('xpFill').style.width=pct+'%';const el=document.getElementById('xpPts');el.textContent='⭐ '+xp;el.style.transform='scale(1.3)';setTimeout(()=>el.style.transform='',300);let lv=0;for(let i=0;i<lvls.length;i++)if(xp>=lvls[i].t)lv=i;document.getElementById('xpLvl').textContent=lvls[lv].n;if(lv!==prevLevel){if(lv>=2)unlockAchievement('nivel3');if(lv>=5)unlockAchievement('nivel5');prevLevel=lv;}}
function resetXP(){sfx('click');xp=0;updateXPBar();showToast('🔄 XP reiniciado a 0');}
function fin(id,showFX=true){if(!done.has(id)){done.add(id);const b=document.querySelector(`[data-s="${id}"]`);if(b)b.classList.add('done');if(showFX){sfx('up');launchConfetti();}saveProgress();}}
function getProgress(){return Math.round((done.size/TOTAL_SECTIONS)*100);}

// ===================== NAV =====================
function go(id){sfx('click');document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});document.getElementById(id).classList.add('active');const btn=document.querySelector(`[data-s="${id}"]`);if(btn){btn.classList.add('active');btn.setAttribute('aria-selected','true');}window.scrollTo({top:0,behavior:'smooth'});if(id==='s-sopa'){setTimeout(buildSopa,50);}if(id==='s-widgets'){setTimeout(buildRoute,50);}}

// ===================== FLASHCARD DATA =====================
const fcData=[
  {w:'Taxonomía',a:'🌳 Ciencia que <strong>identifica, nombra y clasifica</strong> a los seres vivos, ordenándolos en grupos según las características que comparten.'},
  {w:'Reino',a:'👑 El grupo <strong>más grande y general</strong> de la clasificación. Reúne a todos los seres vivos con características básicas comunes. Existen <strong>cinco reinos</strong>: Monera, Protista, Fungi, Plantae y Animalia.'},
  {w:'Especie',a:'🐾 El grupo <strong>más pequeño</strong> de la clasificación. Reúne a seres tan parecidos que pueden <strong>reproducirse entre sí</strong> y tener descendencia fértil.'},
  {w:'Nombre científico',a:'🏷️ Nombre en <strong>latín</strong> con dos palabras: el <strong>género</strong> y la <strong>especie</strong>. Es igual en todo el mundo. Ejemplo: el ser humano es <em>Homo sapiens</em>.'},
  {w:'Autótrofo',a:'🌞 Ser vivo que <strong>fabrica su propio alimento</strong>, casi siempre por <strong>fotosíntesis</strong> con la luz del Sol. Ejemplos: las plantas y las algas.'},
  {w:'Heterótrofo',a:'🍖 Ser vivo que <strong>no fabrica su alimento</strong>: lo obtiene de otros seres vivos. Ejemplos: los animales y los hongos.'},
  {w:'Procariota / Eucariota',a:'🧬 <strong>Procariota</strong>: célula sin núcleo definido (bacterias). <strong>Eucariota</strong>: célula con núcleo definido (protistas, hongos, plantas y animales).'},
  {w:'Reino Monera',a:'🦠 Las <strong>bacterias</strong> y cianobacterias. Seres <strong>unicelulares</strong> y <strong>procariotas</strong>. Fueron los primeros seres vivos de la Tierra. Nutrición autótrofa o heterótrofa.'},
  {w:'Reino Protista',a:'🔬 El reino más <strong>variado</strong>. Seres <strong>eucariotas</strong>, casi todos <strong>unicelulares</strong>, que viven en el agua o en lugares húmedos. Ejemplos: la ameba, el paramecio y las algas.'},
  {w:'Reino Fungi',a:'🍄 Los <strong>hongos</strong>. Eucariotas, <strong>heterótrofos</strong> (absorben su alimento). Su pared es de <strong>quitina</strong>. Muchos son <strong>descomponedores</strong>. Ejemplos: setas, mohos y levaduras.'},
  {w:'Reino Plantae',a:'🌿 Las <strong>plantas</strong>. Seres <strong>pluricelulares</strong>, <strong>eucariotas</strong> y <strong>autótrofos</strong> (hacen fotosíntesis con clorofila). Producen el oxígeno del planeta. Ejemplos: musgos, helechos y árboles.'},
  {w:'Reino Animalia',a:'🐾 Los <strong>animales</strong>, incluido el ser humano. Seres <strong>pluricelulares</strong>, <strong>eucariotas</strong> y <strong>heterótrofos</strong>. La mayoría se desplazan. No tienen pared celular.'},
  {w:'Vertebrados / Invertebrados',a:'🦴 Los animales <strong>vertebrados</strong> tienen columna vertebral (peces, anfibios, reptiles, aves, mamíferos). Los <strong>invertebrados</strong> no la tienen (insectos, moluscos, gusanos).'},
  {w:'Descomponedor',a:'♻️ Ser vivo (sobre todo <strong>hongos y bacterias</strong>) que se alimenta de restos de plantas y animales muertos, devolviendo los <strong>nutrientes al suelo</strong>.'},
];
let fcIdx=0;
function upFC(){document.getElementById('fcInner').classList.remove('flipped');document.getElementById('fcW').textContent=fcData[fcIdx].w;document.getElementById('fcA').innerHTML=fcData[fcIdx].a;document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length;}
function flipCard(){sfx('flip');document.getElementById('fcInner').classList.toggle('flipped');if(!xpTracker.fc.has(fcIdx)){xpTracker.fc.add(fcIdx);pts(1);}if(xpTracker.fc.size===fcData.length){fin('s-flash');unlockAchievement('flash_master');}}
function nextFC(){sfx('click');fcIdx=(fcIdx+1)%fcData.length;upFC();}
function prevFC(){sfx('click');fcIdx=(fcIdx-1+fcData.length)%fcData.length;upFC();}

// ===================== QUIZ DATA =====================
const qzData=[
  {q:'¿Cómo se llama la ciencia que clasifica y nombra a los seres vivos?',o:['a) Biología','b) Taxonomía','c) Ecología','d) Geología'],c:1},
  {q:'¿Cuántos reinos propuso Robert Whittaker en 1969?',o:['a) Tres','b) Cuatro','c) Cinco','d) Seis'],c:2},
  {q:'¿A qué reino pertenecen las bacterias?',o:['a) Protista','b) Monera','c) Fungi','d) Animalia'],c:1},
  {q:'¿Qué reino reúne a los hongos, como las setas y los mohos?',o:['a) Plantae','b) Monera','c) Fungi','d) Protista'],c:2},
  {q:'¿Cuál es el grupo MÁS PEQUEÑO de la clasificación?',o:['a) El reino','b) La familia','c) El género','d) La especie'],c:3},
  {q:'¿Qué reino está formado por seres pluricelulares y autótrofos que hacen fotosíntesis?',o:['a) Plantae','b) Animalia','c) Fungi','d) Monera'],c:0},
  {q:'La ameba y el paramecio pertenecen al reino…',o:['a) Monera','b) Protista','c) Plantae','d) Fungi'],c:1},
  {q:'¿Qué significa que un ser vivo sea "autótrofo"?',o:['a) Que se mueve','b) Que fabrica su propio alimento','c) Que come otros seres','d) Que es unicelular'],c:1},
  {q:'¿A qué reino pertenece el ser humano?',o:['a) Plantae','b) Protista','c) Animalia','d) Fungi'],c:2},
];
let qzIdx=0,qzSel=-1,qzDone=false;
function buildQz(){qzIdx=0;qzSel=-1;qzDone=false;showQz();}
function showQz(){if(qzIdx>=qzData.length){document.getElementById('qzQ').textContent='🎉 ¡Quiz completado!';document.getElementById('qzOpts').innerHTML='';fin('s-quiz');unlockAchievement('primer_quiz');return;}const q=qzData[qzIdx];document.getElementById('qzProg').textContent=`Pregunta ${qzIdx+1} de ${qzData.length}`;document.getElementById('qzQ').textContent=q.q;const opts=document.getElementById('qzOpts');opts.innerHTML='';q.o.forEach((o,i)=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=o;b.onclick=()=>{if(qzDone)return;document.querySelectorAll('.qz-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');qzSel=i;sfx('click');};opts.appendChild(b);});qzDone=false;}
function checkQz(){if(qzSel<0)return fb('fbQz','Selecciona una respuesta.',false);qzDone=true;const opts=document.querySelectorAll('.qz-opt');if(qzSel===qzData[qzIdx].c){opts[qzSel].classList.add('correct');fb('fbQz','¡Correcto! +5 XP',true);if(!xpTracker.qz.has(qzIdx)){xpTracker.qz.add(qzIdx);pts(5);}sfx('ok');}else{opts[qzSel].classList.add('wrong');opts[qzData[qzIdx].c].classList.add('correct');fb('fbQz','Incorrecto. Revisa la respuesta correcta.',false);sfx('no');}setTimeout(()=>{qzIdx++;qzSel=-1;showQz();},1600);}
function resetQz(){sfx('click');qzIdx=0;qzSel=-1;qzDone=false;showQz();document.getElementById('fbQz').classList.remove('show');}

// ===================== CLASIFICACIÓN =====================
const classGroups=[
  {label:['Autótrofo','Heterótrofo'],headA:'🌞 Autótrofo (fabrica su alimento)',headB:'🍖 Heterótrofo (come otros)',colA:'aut',colB:'het',
   words:[{w:'Planta',t:'aut'},{w:'Animal',t:'het'},{w:'Alga',t:'aut'},{w:'Hongo',t:'het'},{w:'Hace fotosíntesis',t:'aut'},{w:'Absorbe su alimento',t:'het'},{w:'Fabrica su alimento',t:'aut'},{w:'Come otros seres vivos',t:'het'},{w:'Cianobacteria',t:'aut'},{w:'Descomponedor',t:'het'}]},
  {label:['Unicelular','Pluricelular'],headA:'🔵 Unicelular (una célula)',headB:'🔶 Pluricelular (muchas células)',colA:'uni',colB:'plu',
   words:[{w:'Bacteria',t:'uni'},{w:'Árbol',t:'plu'},{w:'Ameba',t:'uni'},{w:'Ser humano',t:'plu'},{w:'Paramecio',t:'uni'},{w:'Perro',t:'plu'},{w:'Una sola célula',t:'uni'},{w:'Muchas células',t:'plu'},{w:'Levadura',t:'uni'},{w:'Helecho',t:'plu'}]},
  {label:['Procariota','Eucariota'],headA:'🦠 Procariota (sin núcleo)',headB:'🧬 Eucariota (con núcleo)',colA:'pro',colB:'euc',
   words:[{w:'Bacteria',t:'pro'},{w:'Planta',t:'euc'},{w:'Sin núcleo definido',t:'pro'},{w:'Con núcleo definido',t:'euc'},{w:'Reino Monera',t:'pro'},{w:'Reino Animalia',t:'euc'},{w:'ADN libre',t:'pro'},{w:'ADN en el núcleo',t:'euc'},{w:'Cianobacteria',t:'pro'},{w:'Hongo',t:'euc'}]},
  {label:['Vertebrado','Invertebrado'],headA:'🦴 Vertebrado (con columna)',headB:'🐛 Invertebrado (sin columna)',colA:'ver',colB:'inv',
   words:[{w:'Pez',t:'ver'},{w:'Insecto',t:'inv'},{w:'Águila',t:'ver'},{w:'Caracol',t:'inv'},{w:'Rana',t:'ver'},{w:'Lombriz',t:'inv'},{w:'Perro',t:'ver'},{w:'Araña',t:'inv'},{w:'Serpiente',t:'ver'},{w:'Medusa',t:'inv'}]},
];
let currentClassGroupIdx=0,clsSelectedWord=null;
function buildClass(){const group=classGroups[currentClassGroupIdx];document.getElementById('col-left-head').textContent=group.headA;document.getElementById('col-right-head').textContent=group.headB;const bank=document.getElementById('clsBank');bank.innerHTML='';clsSelectedWord=null;document.getElementById('items-left').innerHTML='';document.getElementById('items-right').innerHTML='';_shuffle([...group.words]).forEach(w=>{const el=document.createElement('div');el.className='wb-item';el.textContent=w.w;el.dataset.t=w.t;el.onclick=()=>{document.querySelectorAll('.wb-item').forEach(i=>i.classList.remove('sel-word'));el.classList.add('sel-word');clsSelectedWord=el;sfx('click');};bank.appendChild(el);});['col-left','col-right'].forEach(colId=>{const col=document.getElementById(colId);col.onclick=(e)=>{if(!clsSelectedWord||e.target.classList.contains('drop-item'))return;const targetId=colId==='col-left'?'items-left':'items-right';const wordsCol=document.getElementById(targetId);const item=document.createElement('div');item.className='drop-item';item.textContent=clsSelectedWord.textContent;item.dataset.t=clsSelectedWord.dataset.t;const original=clsSelectedWord;item.onclick=(ev)=>{ev.stopPropagation();if(clsSelectedWord!==null){col.click();}else{document.getElementById('clsBank').appendChild(original);original.classList.remove('sel-word');item.remove();if(typeof sfx==='function')sfx('click');}};wordsCol.appendChild(item);clsSelectedWord.remove();clsSelectedWord=null;sfx('click');};});}
function checkClass(){const remaining=document.querySelectorAll('#clsBank .wb-item').length;if(remaining>0){fb('fbCls','Mueve todas las palabras a las columnas primero.',false);return;}const group=classGroups[currentClassGroupIdx];let allOk=true;document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{const inLeft=el.parentElement.id==='items-left';const expectedType=inLeft?group.colA:group.colB;if(el.dataset.t===expectedType){el.classList.add('cls-ok');}else{el.classList.add('cls-no');allOk=false;}});if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);}if(allOk){fb('fbCls','¡Perfecto! +5 XP',true);sfx('fan');fin('s-clasifica');unlockAchievement('clasif_pro');}else{fb('fbCls','Hay errores. Marcados en rojo.',false);sfx('no');}}
function nextClassGroup(){sfx('click');currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length;buildClass();document.getElementById('fbCls').classList.remove('show');showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]);}
function resetClass(){sfx('click');buildClass();document.getElementById('fbCls').classList.remove('show');}

// ===================== IDENTIFICAR =====================
const idData=[
  {s:['El','reino','Monera','está','formado','por','bacterias.'],c:2,art:'Reino de las bacterias'},
  {s:['La','taxonomía','clasifica','a','los','seres','vivos.'],c:1,art:'Ciencia que clasifica a los seres vivos'},
  {s:['Las','plantas','son','autótrofas','y','hacen','fotosíntesis.'],c:3,art:'Tipo de nutrición que fabrica su propio alimento'},
  {s:['Los','hongos','pertenecen','al','reino','Fungi.'],c:5,art:'Reino de los hongos'},
  {s:['La','especie','es','el','grupo','más','pequeño.'],c:1,art:'Nivel de clasificación más pequeño'},
  {s:['La','ameba','es','un','protista','unicelular.'],c:4,art:'Reino de la ameba y el paramecio'},
  {s:['El','ser','humano','pertenece','al','reino','Animalia.'],c:6,art:'Reino de los animales'},
  {s:['Una','bacteria','es','un','ser','unicelular.'],c:5,art:'Ser formado por una sola célula'},
];
let idIdx=0,idDone=false;
function showId(){idDone=false;if(idIdx>=idData.length){document.getElementById('idSent').innerHTML='🎉 ¡Completado!';fin('s-identifica');unlockAchievement('id_master');return;}const d=idData[idIdx];document.getElementById('idProg').textContent=`Oración ${idIdx+1} de ${idData.length}`;document.getElementById('idInfo').textContent=`Busca: ${d.art}`;const sent=document.getElementById('idSent');sent.innerHTML='';d.s.forEach((w,i)=>{const span=document.createElement('span');span.className='id-word';span.textContent=w+' ';span.onclick=()=>checkId(i,span);sent.appendChild(span);});}
function checkId(i,span){if(idDone)return;document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected'));span.classList.add('selected');if(i===idData[idIdx].c){idDone=true;span.classList.add('id-ok');fb('fbId','¡Correcto! +5 XP',true);if(!xpTracker.id.has(idIdx)){xpTracker.id.add(idIdx);pts(5);}sfx('ok');}else{span.classList.add('id-no');fb('fbId','Ese no es el término solicitado.',false);sfx('no');}}
function nextId(){sfx('click');idIdx++;showId();document.getElementById('fbId').classList.remove('show');}
function resetId(){sfx('click');idIdx=0;showId();document.getElementById('fbId').classList.remove('show');}

// ===================== COMPLETA =====================
const cmpData=[
  {s:'La ciencia que clasifica y nombra a los seres vivos es la ___.',opts:['taxonomía','geología','astronomía'],c:0},
  {s:'El reino de las bacterias se llama reino ___.',opts:['Plantae','Monera','Fungi'],c:1},
  {s:'Un ser vivo ___ fabrica su propio alimento por fotosíntesis.',opts:['heterótrofo','descomponedor','autótrofo'],c:2},
  {s:'Los hongos pertenecen al reino ___.',opts:['Fungi','Animalia','Protista'],c:0},
  {s:'El grupo más pequeño de la clasificación es la ___.',opts:['familia','especie','clase'],c:1},
  {s:'La ameba y el paramecio pertenecen al reino ___.',opts:['Monera','Plantae','Protista'],c:2},
  {s:'Los animales son seres ___ porque comen otros seres vivos.',opts:['heterótrofos','autótrofos','unicelulares'],c:0},
  {s:'El ser humano pertenece al reino ___.',opts:['Plantae','Animalia','Fungi'],c:1},
];
let cmpIdx=0,cmpSel=-1,cmpDone=false;
function showCmp(){if(cmpIdx>=cmpData.length){document.getElementById('cmpSent').innerHTML='🎉 ¡Completado!';document.getElementById('cmpOpts').innerHTML='';fin('s-completa');return;}const d=cmpData[cmpIdx];document.getElementById('cmpProg').textContent=`Oración ${cmpIdx+1} de ${cmpData.length}`;document.getElementById('cmpSent').innerHTML=d.s.replace('___','<span class="blank">___</span>');const opts=document.getElementById('cmpOpts');opts.innerHTML='';cmpSel=-1;cmpDone=false;d.opts.forEach((o,i)=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=o;b.onclick=()=>{if(cmpDone)return;document.querySelectorAll('.cmp-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');cmpSel=i;sfx('click');};opts.appendChild(b);});}
function checkCmp(){if(cmpSel<0)return fb('fbCmp','Selecciona una opción.',false);cmpDone=true;const opts=document.querySelectorAll('.cmp-opt');if(cmpSel===cmpData[cmpIdx].c){opts[cmpSel].classList.add('correct');document.getElementById('cmpSent').innerHTML=cmpData[cmpIdx].s.replace('___',`<span class="blank" style="color:var(--jade);border-color:var(--jade)">${opts[cmpSel].textContent}</span>`);fb('fbCmp','¡Correcto! +5 XP',true);if(!xpTracker.cmp.has(cmpIdx)){xpTracker.cmp.add(cmpIdx);pts(5);}sfx('ok');}else{opts[cmpSel].classList.add('wrong');opts[cmpData[cmpIdx].c].classList.add('correct');fb('fbCmp','Incorrecto. Revisa bien la respuesta.',false);sfx('no');}setTimeout(()=>{cmpIdx++;document.getElementById('fbCmp').classList.remove('show');showCmp();},1600);}

// ===================== WIDGETS =====================
// Widget 1: Ordenar procesos celulares
const routeSets=[
  {label:'Niveles de organización de la vida',steps:['Célula','Tejido','Órgano','Sistema de órganos','Organismo']},
  {label:'La fotosíntesis paso a paso',steps:['La clorofila capta la luz solar','La planta absorbe agua y CO₂','La energía se procesa en el cloroplasto','Se produce glucosa (alimento)','Se libera oxígeno al ambiente']},
  {label:'Ciclo celular (mitosis)',steps:['Interfase: la célula crece y duplica su ADN','Profase: se condensan los cromosomas','Metafase: los cromosomas se alinean al centro','Anafase: los cromosomas se separan','Telofase: se forman dos células hijas']},
];
let currentRouteIdx=0,routeItems=[];
function buildRoute(){routeItems=_shuffle([...routeSets[currentRouteIdx].steps]);renderRoute();const fbEl=document.getElementById('fbRoute');if(fbEl)fbEl.classList.remove('show');}
function renderRoute(){const list=document.getElementById('routeList');if(!list)return;list.innerHTML='';routeItems.forEach((step,i)=>{const div=document.createElement('div');div.className='sort-item';div.innerHTML=`<div class="sort-arrows"><button class="sort-arrow" onclick="routeMove(${i},-1)"${i===0?' disabled':''}>▲</button><button class="sort-arrow" onclick="routeMove(${i},1)"${i===routeItems.length-1?' disabled':''}>▼</button></div><div class="sort-step-num">${i+1}.</div><div class="sort-item-txt">${step}</div>`;list.appendChild(div);});}
function routeMove(idx,dir){sfx('click');const ni=idx+dir;if(ni<0||ni>=routeItems.length)return;[routeItems[idx],routeItems[ni]]=[routeItems[ni],routeItems[idx]];renderRoute();}
function checkRoute(){const correct=routeSets[currentRouteIdx].steps;const isOk=routeItems.every((s,i)=>s===correct[i]);if(isOk){fb('fbRoute','¡Perfecto! Orden correcto. +4 XP',true);if(!xpTracker.wgt.has('route_'+currentRouteIdx)){xpTracker.wgt.add('route_'+currentRouteIdx);pts(4);}sfx('fan');fin('s-widgets');unlockAchievement('widgets_master');}else{fb('fbRoute','Hay pasos fuera de orden. Revisa el arreglo.',false);sfx('no');}}
function nextRoute(){sfx('click');currentRouteIdx=(currentRouteIdx+1)%routeSets.length;buildRoute();showToast('🔄 Secuencia: '+routeSets[currentRouteIdx].label);}

// Widget 2: Identifica el organelo (IDs neuron* reutilizados)
const neuronPartes=[
  {desc:'Guarda el ADN y dirige todas las funciones de la célula',ans:'Núcleo',opts:['Núcleo','Mitocondria','Ribosoma','Vacuola']},
  {desc:'Produce la energía (ATP) mediante la respiración celular',ans:'Mitocondria',opts:['Núcleo','Mitocondria','Cloroplasto','Membrana']},
  {desc:'Realiza la fotosíntesis; solo está en la célula vegetal',ans:'Cloroplasto',opts:['Mitocondria','Cloroplasto','Vacuola','Ribosoma']},
  {desc:'Fabrica las proteínas de la célula',ans:'Ribosoma',opts:['Ribosoma','Cloroplasto','Núcleo','Vacuola']},
  {desc:'Rodea la célula y controla lo que entra y sale',ans:'Membrana celular',opts:['Pared celular','Membrana celular','Núcleo','Citoplasma']},
  {desc:'Cubierta rígida de celulosa; da forma a la célula vegetal',ans:'Pared celular',opts:['Membrana celular','Pared celular','Vacuola','Ribosoma']},
  {desc:'Bolsa que almacena agua, alimentos o desechos',ans:'Vacuola',opts:['Vacuola','Mitocondria','Núcleo','Ribosoma']},
  {desc:'Medio gelatinoso donde flotan los organelos',ans:'Citoplasma',opts:['Citoplasma','Membrana','Núcleo','Cloroplasto']},
];
let neuronIdx=0,neuronDone=false;
function showNeuron(){neuronDone=false;if(neuronIdx>=neuronPartes.length){const el=document.getElementById('neuronDesc');if(el)el.textContent='🎉 ¡Todos los organelos identificados!';const opts=document.getElementById('neuronOpts');if(opts)opts.innerHTML='';fin('s-widgets');return;}const d=neuronPartes[neuronIdx];const prog=document.getElementById('neuronProg');if(prog)prog.textContent=`Organelo ${neuronIdx+1} de ${neuronPartes.length}`;const desc=document.getElementById('neuronDesc');if(desc)desc.textContent=d.desc;const opts=document.getElementById('neuronOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=opt;b.onclick=()=>checkNeuron(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuron');if(fbEl)fbEl.classList.remove('show');}
function checkNeuron(opt,btn,d){if(neuronDone)return;neuronDone=true;document.querySelectorAll('#neuronOpts .cmp-opt').forEach(b=>{if(b.textContent===d.ans)b.classList.add('correct');else if(b===btn&&b.textContent!==d.ans)b.classList.add('wrong');});const isOk=opt===d.ans;if(isOk){fb('fbNeuron','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuron_'+neuronIdx)){xpTracker.wgt.add('neuron_'+neuronIdx);pts(3);}sfx('ok');}else{fb('fbNeuron','La respuesta correcta es: '+d.ans,false);sfx('no');}}
function nextNeuron(){sfx('click');neuronIdx++;showNeuron();}
function resetNeuron(){sfx('click');neuronIdx=0;showNeuron();}

// Widget 3: Organelo → Función (IDs neuro* reutilizados)
const neuroPairs=[
  {trans:'Núcleo',func:'Guarda el ADN y dirige la célula',opts:['Guarda el ADN y dirige la célula','Produce energía (ATP)','Fabrica proteínas','Realiza la fotosíntesis']},
  {trans:'Mitocondria',func:'Produce energía (ATP)',opts:['Guarda el ADN y dirige la célula','Produce energía (ATP)','Almacena agua y desechos','Da rigidez a la célula']},
  {trans:'Cloroplasto',func:'Realiza la fotosíntesis',opts:['Realiza la fotosíntesis','Produce energía (ATP)','Guarda el ADN y dirige la célula','Fabrica proteínas']},
  {trans:'Ribosoma',func:'Fabrica proteínas',opts:['Fabrica proteínas','Realiza la fotosíntesis','Almacena agua y desechos','Guarda el ADN y dirige la célula']},
  {trans:'Vacuola',func:'Almacena agua, alimentos o desechos',opts:['Almacena agua, alimentos o desechos','Produce energía (ATP)','Realiza la fotosíntesis','Fabrica proteínas']},
];
let neuroIdx=0,neuroDone=false;
function showNeuro(){neuroDone=false;if(neuroIdx>=neuroPairs.length){const el=document.getElementById('neuroTrans');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('neuroOpts');if(opts)opts.innerHTML='';return;}const d=neuroPairs[neuroIdx];const prog=document.getElementById('neuroProg');if(prog)prog.textContent=`${neuroIdx+1} de ${neuroPairs.length}`;const trans=document.getElementById('neuroTrans');if(trans)trans.textContent=d.trans;const opts=document.getElementById('neuroOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkNeuro(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuro');if(fbEl)fbEl.classList.remove('show');}
function checkNeuro(opt,btn,d){if(neuroDone)return;neuroDone=true;document.querySelectorAll('#neuroOpts .qz-opt').forEach(b=>{if(b.textContent===d.func)b.classList.add('correct');else if(b===btn&&b.textContent!==d.func)b.classList.add('wrong');});const isOk=opt===d.func;if(isOk){fb('fbNeuro','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuro_'+neuroIdx)){xpTracker.wgt.add('neuro_'+neuroIdx);pts(3);}sfx('ok');}else{fb('fbNeuro','Correcto: '+d.func,false);sfx('no');}setTimeout(()=>{neuroIdx++;showNeuro();},1800);}
function resetNeuro(){sfx('click');neuroIdx=0;showNeuro();}

// Widget 4: Estructura → ¿En qué célula se encuentra? (IDs enfer* reutilizados)
const enfermedadData=[
  {disease:'Cloroplasto',characteristic:'Solo en la célula vegetal',opts:['Solo en la célula vegetal','Solo en la célula animal','En ambas células','En ninguna célula']},
  {disease:'Pared celular',characteristic:'En vegetales, hongos y bacterias (no en animales)',opts:['En vegetales, hongos y bacterias (no en animales)','Solo en la célula animal','Solo en células procariotas','En ninguna célula']},
  {disease:'Mitocondria',characteristic:'En ambas células (animal y vegetal)',opts:['Solo en la célula vegetal','Solo en la célula animal','En ambas células (animal y vegetal)','Solo en bacterias']},
  {disease:'Centriolos',characteristic:'Principalmente en la célula animal',opts:['Principalmente en la célula animal','Solo en la célula vegetal','Solo en bacterias','En ninguna célula']},
  {disease:'Núcleo definido',characteristic:'En células eucariotas (no en bacterias)',opts:['En células eucariotas (no en bacterias)','Solo en procariotas','En todas las células','En ninguna célula']},
  {disease:'Vacuola central grande',characteristic:'Característica de la célula vegetal',opts:['Característica de la célula vegetal','Característica de la célula animal','Solo en bacterias','En ninguna célula']},
];
let enferIdx=0,enferDone=false;
function showEnfer(){enferDone=false;if(enferIdx>=enfermedadData.length){const el=document.getElementById('enferDisease');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('enferOpts');if(opts)opts.innerHTML='';return;}const d=enfermedadData[enferIdx];const prog=document.getElementById('enferProg');if(prog)prog.textContent=`${enferIdx+1} de ${enfermedadData.length}`;const dis=document.getElementById('enferDisease');if(dis)dis.textContent=d.disease;const opts=document.getElementById('enferOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkEnfer(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbEnfer');if(fbEl)fbEl.classList.remove('show');}
function checkEnfer(opt,btn,d){if(enferDone)return;enferDone=true;document.querySelectorAll('#enferOpts .qz-opt').forEach(b=>{if(b.textContent===d.characteristic)b.classList.add('correct');else if(b===btn&&b.textContent!==d.characteristic)b.classList.add('wrong');});const isOk=opt===d.characteristic;if(isOk){fb('fbEnfer','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('enfer_'+enferIdx)){xpTracker.wgt.add('enfer_'+enferIdx);pts(3);}sfx('ok');}else{fb('fbEnfer','Correcto: '+d.characteristic,false);sfx('no');}setTimeout(()=>{enferIdx++;showEnfer();},1800);}
function resetEnfer(){sfx('click');enferIdx=0;showEnfer();}

// ===================== RETO FINAL =====================
const retoPairs=[
  {label:['Animal','Vegetal'],btnA:'🐾 Animal',btnB:'🌿 Vegetal',colA:'ani',colB:'veg',
   words:[{w:'Cloroplastos',t:'veg'},{w:'Centriolos',t:'ani'},{w:'Pared celular',t:'veg'},{w:'Sin pared celular',t:'ani'},{w:'Vacuola central grande',t:'veg'},{w:'Muchas vacuolas pequeñas',t:'ani'},{w:'Clorofila',t:'veg'},{w:'Forma irregular',t:'ani'},{w:'Celulosa',t:'veg'},{w:'Lisosomas abundantes',t:'ani'}]},
  {label:['Procariota','Eucariota'],btnA:'🦠 Procariota',btnB:'🧬 Eucariota',colA:'pro',colB:'euc',
   words:[{w:'Bacteria',t:'pro'},{w:'Planta',t:'euc'},{w:'Sin núcleo',t:'pro'},{w:'Con núcleo',t:'euc'},{w:'ADN libre',t:'pro'},{w:'ADN en el núcleo',t:'euc'},{w:'Animal',t:'euc'},{w:'Nucleoide',t:'pro'},{w:'Con mitocondrias',t:'euc'},{w:'Muy pequeña',t:'pro'}]},
  {label:['Cubierta','Organelo'],btnA:'🧴 Cubierta',btnB:'⚙️ Organelo',colA:'cub',colB:'org',
   words:[{w:'Membrana celular',t:'cub'},{w:'Núcleo',t:'org'},{w:'Pared celular',t:'cub'},{w:'Mitocondria',t:'org'},{w:'Cápsula bacteriana',t:'cub'},{w:'Ribosoma',t:'org'},{w:'Bicapa de lípidos',t:'cub'},{w:'Vacuola',t:'org'},{w:'Envoltura nuclear',t:'cub'},{w:'Cloroplasto',t:'org'}]},
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
  {s:'La célula es la unidad estructural y funcional de todos los seres vivos: la porción más pequeña con vida propia.',type:'Unidad estructural y funcional de la vida'},
  {s:'El núcleo guarda el ADN y dirige todas las actividades de la célula eucariota.',type:'Núcleo: dirección y ADN'},
  {s:'La mitocondria produce la energía (ATP) mediante la respiración celular; es la "central energética".',type:'Mitocondria: producción de energía'},
  {s:'El cloroplasto, con su clorofila, realiza la fotosíntesis; solo existe en la célula vegetal.',type:'Cloroplasto: fotosíntesis'},
  {s:'La membrana celular rodea la célula y controla, de forma selectiva, lo que entra y sale.',type:'Membrana celular: permeabilidad selectiva'},
  {s:'La pared celular es una cubierta rígida de celulosa que da forma y protección a la célula vegetal.',type:'Pared celular: rigidez vegetal'},
  {s:'Los ribosomas son organelos diminutos que fabrican las proteínas siguiendo las instrucciones del ADN.',type:'Ribosoma: síntesis de proteínas'},
  {s:'La célula procariota no tiene núcleo definido; su ADN está libre en el citoplasma. Ejemplo: las bacterias.',type:'Célula procariota (sin núcleo)'},
  {s:'La célula eucariota tiene núcleo definido y organelos con membrana. Forma a protistas, hongos, plantas y animales.',type:'Célula eucariota (con núcleo)'},
  {s:'La teoría celular afirma que toda célula proviene de otra célula preexistente.',type:'Teoría celular (postulado de Virchow)'},
];
const classifyTaskDB=[
  {w:'Núcleo',gen:'Organelo de control',n:'Contiene el ADN',g:'Solo eucariotas',t:'Dirige la célula y guarda la información genética'},
  {w:'Mitocondria',gen:'Organelo energético',n:'Membrana doble',g:'Animal y vegetal',t:'Produce energía (ATP) por respiración celular'},
  {w:'Cloroplasto',gen:'Organelo energético',n:'Contiene clorofila',g:'Solo vegetal',t:'Realiza la fotosíntesis'},
  {w:'Membrana celular',gen:'Cubierta',n:'Bicapa de lípidos',g:'Todas las células',t:'Controla lo que entra y sale (permeabilidad selectiva)'},
  {w:'Pared celular',gen:'Cubierta rígida',n:'De celulosa',g:'Vegetal, hongos, bacterias',t:'Da forma y protección'},
  {w:'Ribosoma',gen:'Organelo fabricante',n:'Muy pequeño',g:'Todas las células',t:'Fabrica las proteínas'},
  {w:'Vacuola',gen:'Organelo de almacén',n:'Grande y central en plantas',g:'Animal y vegetal',t:'Almacena agua, alimentos o desechos'},
  {w:'Citoplasma',gen:'Medio interno',n:'Gelatinoso (citosol)',g:'Todas las células',t:'Contiene los organelos; allí ocurren reacciones químicas'},
];
const completeTaskDB=[
  {s:'La ___ es la unidad estructural y funcional de los seres vivos.',opts:['pared','célula','molécula'],ans:'célula'},
  {s:'La ___ produce la energía (ATP) de la célula.',opts:['vacuola','mitocondria','membrana'],ans:'mitocondria'},
  {s:'El ___ guarda el ADN y dirige la célula.',opts:['núcleo','ribosoma','citoplasma'],ans:'núcleo'},
  {s:'El ___ realiza la fotosíntesis en la célula vegetal.',opts:['cloroplasto','lisosoma','centriolo'],ans:'cloroplasto'},
  {s:'La célula ___ no tiene núcleo definido.',opts:['eucariota','procariota','animal'],ans:'procariota'},
  {s:'La ___ celular controla lo que entra y sale.',opts:['pared','membrana','vacuola'],ans:'membrana'},
  {s:'Los ___ fabrican las proteínas de la célula.',opts:['ribosomas','cloroplastos','lisosomas'],ans:'ribosomas'},
  {s:'La pared celular vegetal está hecha de ___.',opts:['quitina','celulosa','proteína'],ans:'celulosa'},
];
const explainQuestions=[
  {q:'¿Qué es la célula y por qué se dice que es la unidad de la vida?',ans:'La célula es la porción más pequeña de un ser vivo con vida propia: se nutre, respira, crece, se reproduce y muere. Todos los organismos están formados por una o muchas células.'},
  {q:'Menciona y explica los tres postulados de la teoría celular.',ans:'1) Todos los seres vivos están formados por células; 2) la célula es la unidad estructural y funcional de la vida; 3) toda célula proviene de otra célula preexistente.'},
  {q:'¿Cuáles son las principales diferencias entre la célula animal y la vegetal?',ans:'La vegetal tiene pared celular (celulosa), cloroplastos y una vacuola central grande. La animal no tiene pared ni cloroplastos, tiene vacuolas pequeñas y centriolos, y forma irregular.'},
  {q:'¿Qué diferencia hay entre una célula procariota y una eucariota?',ans:'La procariota no tiene núcleo definido (ADN libre en el citoplasma) ni organelos con membrana; ej. bacterias. La eucariota tiene núcleo definido y organelos con membrana; ej. plantas y animales.'},
  {q:'Explica la función de la mitocondria y del cloroplasto. ¿En qué se parecen y en qué se diferencian?',ans:'Ambos manejan energía. La mitocondria libera energía (ATP) de los nutrientes (respiración) y está en células animales y vegetales. El cloroplasto fabrica alimento con luz (fotosíntesis) y solo está en la vegetal.'},
];
let ansVisible=false;
function genTask(){sfx('click');const type=document.getElementById('tgType').value;const count=parseInt(document.getElementById('tgCount').value);ansVisible=false;const out=document.getElementById('tgOut');out.innerHTML='';if(type==='identify')genIdentifyTask(out,count);else if(type==='classify')genClassifyTask(out,count);else if(type==='complete')genCompleteTask(out,count);else if(type==='explain')genExplainTask(out,count);fin('s-tareas');}
function _instrBlock(out,title,lines){const ib=document.createElement('div');ib.className='tg-instruction-block';ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join('');out.appendChild(ib);}
function genIdentifyTask(out,count){_instrBlock(out,'Instrucción',['Copia en tu cuaderno; subraya, colorea o encierra el concepto de la célula indicado en cada oración. Escribe al lado qué tipo de elemento es.','<strong>Ejemplo:</strong> La mitocondria produce energía. → <span style="color:var(--jade);font-weight:700;">Organelo energético</span>']);_pick(identifyTaskDB,Math.min(count,identifyTaskDB.length)).forEach((item,i)=>{const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.type}</div></div>`;out.appendChild(div);});}
function genClassifyTask(out,count){_instrBlock(out,'Instrucción',['Copia la siguiente tabla en tu cuaderno. Para cada estructura de la célula, completa su tipo, características, ubicación y función.']);const items=_pick(classifyTaskDB,Math.min(count,classifyTaskDB.length));const wrap=document.createElement('div');wrap.style.overflowX='auto';const th=(t,extra='')=>`<th style="padding:0.3rem 0.4rem;border:1px solid var(--border);font-size:0.72rem;text-align:center;${extra}">${t}</th>`;let html=`<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:520px;"><thead><tr style="background:var(--pri-gl);">${th('Estructura','text-align:left;')}${th('Tipo')}${th('Características')}${th('Ubicación')}${th('Función')}</tr></thead><tbody>`;items.forEach(it=>{html+=`<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td>`+Array(4).fill(`<td style="padding:0.4rem;border:1px solid var(--border);min-width:50px;"></td>`).join('')+'</tr>';});html+='</tbody></table>';wrap.innerHTML=html;out.appendChild(wrap);const ans=document.createElement('div');ans.className='tg-answer';ans.style.marginTop='0.8rem';ans.innerHTML='<strong>✅ Respuestas:</strong><br>'+items.map(it=>`<strong>${it.w}:</strong> Tipo: ${it.gen} | Características: ${it.n} | Ubicación: ${it.g} | Función: ${it.t}`).join('<br>');out.appendChild(ans);}
function genCompleteTask(out,count){_instrBlock(out,'Instrucción',['Copia y resuelve en tu cuaderno. Cada oración tiene un espacio ___. Elige y escribe la opción correcta.']);const pool=_shuffle([...completeTaskDB]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';const sent=item.s.replace('___','<span class="tg-blank" style="min-width:90px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${sent}</strong><div style="margin-top:0.4rem;font-size:0.82rem;color:var(--gray);">📝 Opciones: <strong>${item.opts.join(' | ')}</strong></div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function genExplainTask(out,count){_instrBlock(out,'Instrucción',['Copia las siguientes preguntas en tu cuaderno y responde cada una de forma clara y completa.']);const pool=_shuffle([...explainQuestions]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.3rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function toggleAns(){ansVisible=!ansVisible;document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none');sfx('click');}

// ===================== SOPA DE LETRAS =====================
const sopaSets=[
  {size:10,grid:[
    ['C','E','L','U','L','A','X','Y','Z','A'],
    ['P','Q','R','S','T','U','V','W','Z','D'],
    ['N','U','C','L','E','O','H','I','J','N'],
    ['B','C','D','E','F','G','H','I','J','K'],
    ['M','E','M','B','R','A','N','A','U','V'],
    ['M','N','O','P','Q','R','S','T','U','V'],
    ['R','I','B','O','S','O','M','A','G','H'],
    ['K','L','M','N','O','P','Q','R','S','T'],
    ['V','A','C','U','O','L','A','U','V','W'],
    ['A','B','C','D','E','F','G','H','I','J']
  ],words:[
    {w:'CELULA',cells:[[0,0],[0,1],[0,2],[0,3],[0,4],[0,5]]},
    {w:'ADN',cells:[[0,9],[1,9],[2,9]]},
    {w:'NUCLEO',cells:[[2,0],[2,1],[2,2],[2,3],[2,4],[2,5]]},
    {w:'MEMBRANA',cells:[[4,0],[4,1],[4,2],[4,3],[4,4],[4,5],[4,6],[4,7]]},
    {w:'RIBOSOMA',cells:[[6,0],[6,1],[6,2],[6,3],[6,4],[6,5],[6,6],[6,7]]},
    {w:'VACUOLA',cells:[[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,6]]}
  ]},
  {size:10,grid:[
    ['C','I','T','O','P','L','A','S','M','A'],
    ['B','C','D','E','F','G','H','I','J','K'],
    ['P','A','R','E','D','L','M','N','O','P'],
    ['Q','R','S','T','U','V','W','X','Y','Z'],
    ['M','I','T','O','S','I','S','A','B','C'],
    ['D','E','F','G','H','I','J','K','L','M'],
    ['E','N','Z','I','M','A','N','O','P','Q'],
    ['R','S','T','U','V','W','X','Y','Z','A'],
    ['C','E','L','U','L','A','B','C','D','E'],
    ['G','E','N','F','H','I','J','K','L','M']
  ],words:[
    {w:'CITOPLASMA',cells:[[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[0,9]]},
    {w:'PARED',cells:[[2,0],[2,1],[2,2],[2,3],[2,4]]},
    {w:'MITOSIS',cells:[[4,0],[4,1],[4,2],[4,3],[4,4],[4,5],[4,6]]},
    {w:'ENZIMA',cells:[[6,0],[6,1],[6,2],[6,3],[6,4],[6,5]]},
    {w:'CELULA',cells:[[8,0],[8,1],[8,2],[8,3],[8,4],[8,5]]},
    {w:'GEN',cells:[[9,0],[9,1],[9,2]]}
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
  {q:'La célula es la unidad estructural y funcional de todos los seres vivos.',a:true},
  {q:'La mitocondria produce la energía (ATP) de la célula.',a:true},
  {q:'La célula animal tiene pared celular y cloroplastos.',a:false},
  {q:'El cloroplasto realiza la fotosíntesis y solo está en la célula vegetal.',a:true},
  {q:'Las bacterias son células eucariotas con núcleo definido.',a:false},
  {q:'La membrana celular controla lo que entra y sale de la célula.',a:true},
  {q:'El núcleo guarda el ADN en las células eucariotas.',a:true},
  {q:'Los ribosomas se encargan de fabricar las proteínas.',a:true},
  {q:'La pared celular de las plantas está hecha de celulosa.',a:true},
  {q:'La célula procariota tiene su ADN encerrado en un núcleo definido.',a:false},
  {q:'Según la teoría celular, toda célula proviene de otra célula preexistente.',a:true},
  {q:'La vacuola de la célula vegetal es grande y central.',a:true},
  {q:'La fotosíntesis produce glucosa y oxígeno a partir de luz, agua y CO₂.',a:true},
  {q:'El citoplasma es una cubierta rígida que rodea la célula por fuera.',a:false},
  {q:'La mitocondria solo se encuentra en la célula vegetal.',a:false},
];
const evalMCBank=[
  {q:'¿Cuál es la unidad estructural y funcional de los seres vivos?',o:['a) El átomo','b) El tejido','c) La célula','d) El órgano'],a:2},
  {q:'¿Qué organelo produce la energía (ATP) de la célula?',o:['a) Ribosoma','b) Mitocondria','c) Vacuola','d) Núcleo'],a:1},
  {q:'¿Qué organelo realiza la fotosíntesis?',o:['a) Mitocondria','b) Ribosoma','c) Cloroplasto','d) Lisosoma'],a:2},
  {q:'¿Qué tipo de célula NO tiene núcleo definido?',o:['a) Eucariota','b) Vegetal','c) Animal','d) Procariota'],a:3},
  {q:'¿Qué estructura rígida rodea a la célula vegetal?',o:['a) Membrana','b) Citoplasma','c) Pared celular','d) Vacuola'],a:2},
  {q:'¿Dónde se guarda el ADN en una célula eucariota?',o:['a) En la mitocondria','b) En el núcleo','c) En la membrana','d) En el citoplasma libre'],a:1},
  {q:'¿Qué organelo fabrica las proteínas?',o:['a) Ribosoma','b) Vacuola','c) Cloroplasto','d) Núcleo'],a:0},
  {q:'¿Qué estructura tiene la célula vegetal pero NO la animal?',o:['a) Núcleo','b) Cloroplasto','c) Membrana','d) Mitocondria'],a:1},
  {q:'Según la teoría celular, ¿de dónde proviene toda célula?',o:['a) Del aire','b) De materia sin vida','c) De otra célula preexistente','d) Del agua'],a:2},
  {q:'¿Qué controla la membrana celular?',o:['a) La reproducción','b) Lo que entra y sale de la célula','c) La fotosíntesis','d) El color de la célula'],a:1},
  {q:'¿Qué organelo almacena agua, alimentos o desechos?',o:['a) Ribosoma','b) Mitocondria','c) Vacuola','d) Núcleo'],a:2},
  {q:'¿Qué ejemplo corresponde a una célula procariota?',o:['a) Célula de una hoja','b) Neurona','c) Bacteria','d) Glóbulo rojo'],a:2},
  {q:'¿De qué material está hecha la pared celular de las plantas?',o:['a) Quitina','b) Celulosa','c) Proteína','d) Grasa'],a:1},
  {q:'¿Qué produce la fotosíntesis?',o:['a) Solo agua','b) Glucosa y oxígeno','c) Solo dióxido de carbono','d) Proteínas'],a:1},
  {q:'¿Cómo se llama el medio gelatinoso donde flotan los organelos?',o:['a) Núcleo','b) Membrana','c) Citoplasma','d) Pared'],a:2},
];
const evalCPBank=[
  {q:'La ___ es la unidad estructural y funcional de los seres vivos.',a:'célula'},
  {q:'La ___ produce la energía (ATP) de la célula.',a:'mitocondria'},
  {q:'El ___ guarda el ADN y dirige la célula eucariota.',a:'núcleo'},
  {q:'El ___ realiza la fotosíntesis en la célula vegetal.',a:'cloroplasto'},
  {q:'La célula ___ no tiene núcleo definido, como las bacterias.',a:'procariota'},
  {q:'La ___ celular controla lo que entra y sale de la célula.',a:'membrana'},
  {q:'Los ___ se encargan de fabricar las proteínas.',a:'ribosomas'},
  {q:'La pared celular de las plantas está hecha de ___.',a:'celulosa'},
  {q:'La célula ___ tiene núcleo definido y organelos con membrana.',a:'eucariota'},
  {q:'La ___ almacena agua, alimentos o desechos en la célula.',a:'vacuola'},
  {q:'El pigmento verde del cloroplasto se llama ___.',a:'clorofila'},
  {q:'La fotosíntesis libera ___ al ambiente.',a:'oxígeno'},
  {q:'El medio gelatinoso donde flotan los organelos es el ___.',a:'citoplasma'},
  {q:'La molécula que guarda la información genética es el ___.',a:'ADN'},
  {q:'Toda célula proviene de otra célula ___.',a:'preexistente'},
];
const evalPRBank=[
  {term:'Célula',def:'Unidad estructural y funcional de los seres vivos'},
  {term:'Núcleo',def:'Guarda el ADN y dirige la célula'},
  {term:'Mitocondria',def:'Produce la energía (ATP) por respiración celular'},
  {term:'Cloroplasto',def:'Realiza la fotosíntesis; exclusivo de la célula vegetal'},
  {term:'Membrana celular',def:'Controla lo que entra y sale de la célula'},
  {term:'Pared celular',def:'Cubierta rígida de celulosa en la célula vegetal'},
  {term:'Ribosoma',def:'Fabrica las proteínas'},
  {term:'Vacuola',def:'Almacena agua, alimentos o desechos'},
  {term:'Citoplasma',def:'Medio gelatinoso donde flotan los organelos'},
  {term:'ADN',def:'Molécula que guarda la información genética'},
  {term:'Procariota',def:'Célula sin núcleo definido, como las bacterias'},
  {term:'Eucariota',def:'Célula con núcleo definido y organelos con membrana'},
  {term:'Fotosíntesis',def:'Fabricación de alimento con luz, agua y CO₂'},
  {term:'Teoría celular',def:'Toda célula proviene de otra célula preexistente'},
  {term:'Clorofila',def:'Pigmento verde que capta la luz en el cloroplasto'},
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

function genEval(){sfx('click');_evalFormaSelector(); const _selF = document.getElementById('evalFormaSel'); if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10))); const cf = evalFormNum; const rng = _evalRng(cf); window._currentEvalForm=cf;evalFormNum = (evalFormNum % EVAL_FORMAS) + 1; _evalFormaSelector();saveProgress();document.getElementById('eval-screen-title').textContent=`🎓 Evaluación Final · Forma ${cf} · Los Cinco Reinos`;evalAnsVisible=false;const out=document.getElementById('evalOut');out.innerHTML='';const bar=document.createElement('div');bar.className='eval-score-bar';bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje · 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25 pts</span><span class="eval-score-pill esp-tf">V/F 25 pts</span><span class="eval-score-pill esp-mc">Selección 25 pts</span><span class="eval-score-pill esp-pr">Pareados 25 pts</span></div>`;out.appendChild(bar);const cpItems=_pickF(evalCPBank,5, rng);const s1=document.createElement('div');s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';cpItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='cp';d.dataset.evalIndex=i;const qHtml=item.q.replace('___',`<input class="eval-cp-input" type="text" data-cp="${i}" autocomplete="off">`);d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbCp${i}" aria-live="polite"></div>`;s1.appendChild(d);});out.appendChild(s1);const tfItems=_pickF(evalTFBank,5, rng);const s2=document.createElement('div');s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';tfItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='tf';d.dataset.evalIndex=i;d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="true"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="false"> Falso</label></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbTf${i}" aria-live="polite"></div>`;s2.appendChild(d);});out.appendChild(s2);const mcItems=_pickF(evalMCBank,5, rng);const s3=document.createElement('div');s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';mcItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='mc';d.dataset.evalIndex=i;const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join('');d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbMc${i}" aria-live="polite"></div>`;s3.appendChild(d);});out.appendChild(s3);const prItems=_pickF(evalPRBank,5, rng);const shuffledDefs=_shuffleF(prItems, rng);const letters=['A','B','C','D','E'];const s4=document.createElement('div');s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';const matchCard=document.createElement('div');matchCard.className='eval-item';let colLeft='<div class="eval-match-col"><h4>📌 Términos</h4>';prItems.forEach((item,i)=>{colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> <select class="eval-match-select" data-pr="${i}" aria-label="Respuesta pareada ${i+16}"><option value="">—</option>${letters.map(l=>`<option value="${l}">${l}</option>`).join('')}</select> ${item.term}</div>`;});colLeft+='</div>';let colRight='<div class="eval-match-col"><h4>🔑 Definiciones</h4>';shuffledDefs.forEach((item,i)=>{colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`;});colRight+='</div>';const ansKey=prItems.map((item,i)=>{const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)];return`${i+16}→${letter}`;}).join(' · ');matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div><div class="eval-item-feedback" id="evalFbPr" aria-live="polite"></div>`;s4.appendChild(matchCard);out.appendChild(s4);window._evalPrintData={tf:tfItems,mc:mcItems,cp:cpItems,pr:{terms:prItems,shuffledDefs,letters}};const autoPanel=document.createElement('div');autoPanel.id='evalAutoResult';autoPanel.className='eval-auto-result';autoPanel.innerHTML='<strong>🧮 Evaluación interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato original sin respuestas digitadas.';out.appendChild(autoPanel);fin('s-evaluacion');}
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación Los Cinco Reinos · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.12rem 0.4rem;margin:0.22rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #27ae60;background:#e8f8f5;color:#27ae60;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#27ae60;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #27ae60;height:12px;}.obt-pct{white-space:nowrap;}.qn{font-weight:700;min-width:22px;flex-shrink:0;}.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:40px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.18rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.14rem 0.35rem;margin-bottom:0.1rem;break-inside:avoid;page-break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.3;display:flex;gap:0.28rem;margin-bottom:0.07rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.1rem 0.5rem;}.mc-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:0.04rem 0.15rem;margin-left:0.8rem;}.mc-opt{font-size:9pt;display:flex;align-items:center;gap:0.15rem;}.mc-opt input{width:10px;height:10px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{margin-top:0.1rem;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.08rem 0.4rem;margin-top:0.08rem;}.pr-head{font-size:9pt;font-weight:700;color:#555;margin-bottom:0.1rem;}.pr-item{font-size:10.5pt;padding:0.1rem 0.28rem;background:#e8f8f5;border-radius:3px;margin-bottom:0.07rem;display:flex;align-items:center;gap:0.2rem;line-height:1.2;break-inside:avoid;page-break-inside:avoid;}.pr-num{font-weight:700;color:#27ae60;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.22rem;padding:0.15rem 0;page-break-before:avoid;break-before:avoid;color:#27ae60;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #27ae60;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#555;}.pa{color:#007a00;font-weight:600;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · Los Cinco Reinos · Educación Básica · Ciencias Naturales</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Evaluación Final · Los Cinco Reinos · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u</div></div><div class="p-grid">${pR}</div>
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
  {txt:'Ana observa al microscopio una célula que tiene pared celular, varios cloroplastos verdes y una gran vacuola central que ocupa casi todo su interior.'},
  {txt:'Un estudiante dibuja una célula que presenta una cubierta rígida por fuera, cloroplastos con clorofila y una vacuola central muy grande.'},
  {txt:'En una muestra de una hoja se ve, al microscopio, una célula con forma rectangular fija, pared celular y muchos cloroplastos.'},
  {txt:'Bajo el microscopio aparece una célula verde, con pared de celulosa y una vacuola central enorme que empuja al núcleo hacia un lado.'},
  {txt:'María examina una célula de una planta y anota que tiene pared celular, cloroplastos y una vacuola central que ocupa gran parte del espacio.'},
  {txt:'Se observa una célula con forma fija, cubierta rígida externa, pigmentos verdes en su interior y una sola vacuola grande y central.'},
];
const critCaseQuestions=[
  '1. ¿Es una célula animal o vegetal? Justifica con dos estructuras observadas.',
  '2. ¿A qué reino podría pertenecer el organismo? ¿Por qué?',
  '3. ¿Cómo obtiene su alimento esta célula?',
  '4. ¿Qué le pasaría a la célula si le quitáramos los cloroplastos?',
];
const critCaseGuides=[
  'Es una célula VEGETAL: tiene pared celular y cloroplastos, estructuras ausentes en la célula animal, además de una vacuola central grande.',
  'Pertenece al reino Plantae (o a un alga del reino Protista): son organismos eucariotas con cloroplastos y pared de celulosa.',
  'Fabrica su propio alimento mediante la fotosíntesis, usando la luz solar captada por la clorofila de los cloroplastos.',
  'Sin cloroplastos no podría hacer fotosíntesis: dejaría de producir su propio alimento y se debilitaría por falta de energía.',
];
const critErrorBank=[
  {txt:'"La célula animal tiene pared celular y cloroplastos, por eso puede hacer fotosíntesis igual que la vegetal."',
   g1:'La célula animal NO tiene pared celular ni cloroplastos: esas estructuras son exclusivas (o casi) de la célula vegetal.',
   g2:'La célula animal no hace fotosíntesis; obtiene su energía de los alimentos mediante la respiración celular.'},
  {txt:'"El núcleo produce la energía de la célula, mientras que la mitocondria guarda el ADN y dirige todas sus funciones."',
   g1:'La mitocondria es la que produce la energía (ATP) por respiración celular, no el núcleo.',
   g2:'El núcleo es el que guarda el ADN y dirige la célula, no la mitocondria.'},
  {txt:'"Las bacterias son células eucariotas porque tienen un núcleo bien definido que encierra su ADN."',
   g1:'Las bacterias son PROcariotas, no eucariotas.',
   g2:'Su ADN está libre en el citoplasma (nucleoide), sin un núcleo definido que lo encierre.'},
  {txt:'"La membrana celular es rígida y da forma a la célula, mientras que la pared celular controla lo que entra y sale."',
   g1:'La membrana celular es flexible y es la que controla lo que entra y sale (permeabilidad selectiva).',
   g2:'La pared celular (en plantas, hongos y bacterias) es la cubierta rígida que da forma y protección.'},
  {txt:'"Los ribosomas realizan la fotosíntesis, y los cloroplastos se encargan de fabricar las proteínas de la célula."',
   g1:'La fotosíntesis la realizan los cloroplastos, no los ribosomas.',
   g2:'Las proteínas las fabrican los ribosomas, no los cloroplastos.'},
];
const critDecisionBank=[
  'Un agricultor coloca sus plantas en un cuarto oscuro y nota que se ponen amarillas, débiles y dejan de crecer.',
  'Una estudiante deja una planta dentro de un clóset sin ventanas durante dos semanas y observa que sus hojas pierden el color verde.',
  'Un jardinero riega mucho una planta, pero la mantiene siempre alejada de toda luz; la planta se marchita poco a poco.',
  'En una casa colocan una maceta en un rincón sin luz; con los días, las hojas se ponen pálidas y la planta se debilita.',
  'Una familia guarda sus plantas en un sótano oscuro para protegerlas del frío, pero estas empiezan a perder su color verde.',
];
const critDecisionGuide='Las plantas necesitan LUZ para la fotosíntesis: sin luz, los cloroplastos no producen alimento ni clorofila, por eso las hojas pierden el color verde y la planta se debilita. Se recomienda ubicarlas donde reciban luz solar, no excederse en el riego y asegurar buen suelo; así la célula vegetal puede fabricar su energía y mantenerse sana.';
const critCompareBank=[
  {a:'Una célula sin núcleo definido, con su ADN suelto en el citoplasma, muy pequeña y sencilla.',b:'Una célula con núcleo definido y organelos rodeados de membrana, más grande y compleja.',
   ga:'Célula procariota (ejemplo: una bacteria).',
   gb:'Célula eucariota (ejemplo: una planta o un animal).',
   gr:'No son el mismo tipo: la diferencia clave es la presencia de un núcleo definido y de organelos con membrana.'},
  {a:'Una célula con pared celular, cloroplastos y una vacuola central grande.',b:'Una célula sin pared, sin cloroplastos, con varias vacuolas pequeñas y centriolos.',
   ga:'Célula vegetal.',
   gb:'Célula animal.',
   gr:'No son iguales: la vegetal fabrica su alimento y tiene cubierta rígida; la animal no.'},
  {a:'Un organelo lleno de clorofila que capta la luz del sol.',b:'Un organelo que "quema" nutrientes para liberar energía.',
   ga:'Cloroplasto — realiza la fotosíntesis.',
   gb:'Mitocondria — realiza la respiración celular.',
   gr:'No son el mismo organelo: uno produce alimento con luz y el otro libera energía de los alimentos.'},
];
const critCauseBank=[
  {cause:'A una célula vegetal se le retiran todos los cloroplastos.',guide:'Deja de hacer fotosíntesis: no produce su propio alimento y se debilita por falta de energía.'},
  {cause:'La membrana celular de una célula se rompe.',guide:'La célula pierde el control de lo que entra y sale; se descontrola y puede morir.'},
  {cause:'Una célula pierde su núcleo.',guide:'Pierde la información genética y la dirección de sus funciones; no puede reproducirse ni funcionar bien.'},
  {cause:'Las mitocondrias de una célula dejan de funcionar.',guide:'La célula se queda sin energía (ATP) para realizar sus procesos vitales.'},
];
const critEffectBank=[
  {effect:'Una planta pierde el color verde de sus hojas.',guide:'Falta de luz o daño en los cloroplastos y la clorofila (no puede hacer fotosíntesis).'},
  {effect:'Una célula se hincha y estalla al colocarla en agua pura.',guide:'Entró demasiada agua por la membrana (ósmosis) y, sin pared celular, no resistió la presión.'},
  {effect:'Una célula deja de producir proteínas.',guide:'Fallo o ausencia de ribosomas, que son los encargados de fabricarlas.'},
  {effect:'Un organismo microscópico sobrevive sin tener un núcleo definido.',guide:'Es una célula procariota: su ADN libre y su estructura simple le permiten vivir así.'},
];
function genEvalCrit(){
  sfx('click');
  _injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });
  const _sC = document.getElementById('evalCritFormaSel');
  if (_sC && parseInt(_sC.value, 10)) evalCritFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sC.value, 10)));
  const cf=evalCritFormNum;window._currentEvalCritForm=cf;const rngC = _evalRng(200000 + cf);evalCritFormNum=(evalCritFormNum%EVAL_FORMAS)+1;_injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });saveProgress();
  document.getElementById('evalcrit-screen-title').textContent=`🧠 Pensamiento Crítico · Forma ${cf} · Los Cinco Reinos`;
  evalCritAnsVisible=false;
  const out=document.getElementById('evalCritOut');out.innerHTML='';
  const kase=_pickF(critCaseBank,1,rngC)[0];
  const s1=document.createElement('div');
  s1.innerHTML=`<div class="eval-section-title">I. Caso de análisis: observando una célula <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${kase.txt}</div>${critCaseQuestions.map((q,i)=>`<div class="crit-q-block"><div class="crit-q-label">${q}</div><textarea class="crit-textarea" rows="2" aria-label="${q}"></textarea><div class="crit-pauta">${critCaseGuides[i]}</div></div>`).join('')}<div class="crit-selfscore"><label for="critScore0">Obtenido:</label><input type="number" id="critScore0" class="crit-score-input" data-score="0" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s1);
  const err=_pickF(critErrorBank,1,rngC)[0];
  const s2=document.createElement('div');
  s2.innerHTML=`<div class="eval-section-title">II. Corrige el error <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${err.txt}</div><p style="font-size:0.85rem;margin-bottom:0.5rem;">Identifica <strong>dos errores</strong> y corrígelos con tus propias palabras:</p><div class="crit-q-block"><div class="crit-q-label">Error 1 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 1 y su corrección"></textarea><div class="crit-pauta">${err.g1}</div></div><div class="crit-q-block"><div class="crit-q-label">Error 2 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 2 y su corrección"></textarea><div class="crit-pauta">${err.g2}</div></div><div class="crit-selfscore"><label for="critScore1">Obtenido:</label><input type="number" id="critScore1" class="crit-score-input" data-score="1" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s2);
  const dec=_pickF(critDecisionBank,1,rngC)[0];
  const s3=document.createElement('div');
  s3.innerHTML=`<div class="eval-section-title">III. Toma de decisiones: la fotosíntesis <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${dec}</div><div class="crit-q-block"><div class="crit-q-label">¿Qué recomendarías para que la planta recupere su salud? Explica por qué, relacionándolo con la fotosíntesis y los cloroplastos.</div><textarea class="crit-textarea" rows="4" aria-label="Recomendaciones y su justificación"></textarea><div class="crit-pauta">${critDecisionGuide}</div></div><div class="crit-selfscore"><label for="critScore2">Obtenido:</label><input type="number" id="critScore2" class="crit-score-input" data-score="2" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s3);
  const cmp=_pickF(critCompareBank,1,rngC)[0];
  const s4=document.createElement('div');
  s4.innerHTML=`<div class="eval-section-title">IV. Comparación razonada <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-compare-grid"><div class="crit-compare-box"><h5>Caso A</h5>${cmp.a}</div><div class="crit-compare-box"><h5>Caso B</h5>${cmp.b}</div></div><div class="crit-q-block"><div class="crit-q-label">1. ¿Qué tipo de célula u organelo corresponde a cada caso? 2. ¿Qué función cumple cada uno? 3. ¿Por qué no son lo mismo?</div><textarea class="crit-textarea" rows="4" aria-label="Comparación razonada de los casos A y B"></textarea><div class="crit-pauta">Caso A: ${cmp.ga} · Caso B: ${cmp.gb} · ${cmp.gr}</div></div><div class="crit-selfscore"><label for="critScore3">Obtenido:</label><input type="number" id="critScore3" class="crit-score-input" data-score="3" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
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
  let s1=`<div class="sec-title"><span>I. Caso de análisis: observando una célula</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.kase.txt}</p>`;
  critCaseQuestions.forEach(q=>{s1+=`<p class="crit-print-q">${q}</p>${lines(1)}`;});
  let s2=`<div class="sec-title"><span>II. Corrige el error</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.err.txt}</p><p class="crit-print-q">Identifica dos errores y corrígelos con tus propias palabras:</p><p class="crit-print-q"><strong>Error 1:</strong></p>${lines(1)}<p class="crit-print-q"><strong>Error 2:</strong></p>${lines(1)}`;
  let s3=`<div class="sec-title"><span>III. Toma de decisiones: la fotosíntesis</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.dec}</p><p class="crit-print-q">¿Qué recomendarías para que la planta recupere su salud? Explica por qué, relacionándolo con la fotosíntesis.</p>${lines(2)}`;
  let s4=`<div class="sec-title"><span>IV. Comparación razonada</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><div class="crit-compare-print-grid"><div class="crit-compare-print-box"><strong>Caso A:</strong> ${d.cmp.a}</div><div class="crit-compare-print-box"><strong>Caso B:</strong> ${d.cmp.b}</div></div><p class="crit-print-q">1. ¿Qué tipo de célula u organelo corresponde a cada caso? 2. ¿Qué función cumple cada uno? 3. ¿Por qué no son lo mismo?</p>${lines(2)}`;
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
  const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Pensamiento Crítico Los Cinco Reinos · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.1rem 0.4rem;margin:0.2rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #27ae60;background:#e8f8f5;color:#27ae60;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#27ae60;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #27ae60;height:12px;}.obt-pct{white-space:nowrap;}.crit-print-scenario{font-size:10.5pt;background:#e8f8f5;border-left:3px solid #27ae60;padding:0.2rem 0.5rem;margin:0.1rem 0 0.2rem;line-height:1.3;}.crit-print-q{font-size:10pt;font-weight:600;margin:0.15rem 0 0.08rem;line-height:1.25;}.ln{border-bottom:1px solid #111;min-height:12px;margin-bottom:2px;}.crit-compare-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin:0.15rem 0;}.crit-compare-print-box{font-size:9.5pt;background:#e8f8f5;border-radius:4px;padding:0.25rem 0.4rem;line-height:1.25;}.crit-print-tbl{width:100%;border-collapse:collapse;font-size:9.5pt;margin-top:0.15rem;}.crit-print-tbl th,.crit-print-tbl td{border:1px solid #999;padding:0.3rem 0.45rem;text-align:left;height:30px;vertical-align:middle;}.crit-print-tbl th{background:#e8f8f5;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:9.5pt;font-weight:700;}.p-sub{font-size:7pt;color:#c00;font-weight:700;margin:0.08rem 0;}.p-meta{font-size:7pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.9rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.45rem;}.p-ttl{font-size:8pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.1rem;margin-bottom:0.18rem;}.p-crit-line{font-size:7.5pt;color:#007a00;margin-bottom:0.18rem;line-height:1.35;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.2rem;padding:0.1rem 0;color:#27ae60;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #27ae60;}.forma-tag{position:fixed;bottom:5mm;right:6mm;font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;}@media print{@page{size:letter portrait;margin:12.7mm;}}</style></head><body><div class="ph"><h2>Evaluación Competencial · Pensamiento Crítico · Los Cinco Reinos · Educación Básica · Ciencias Naturales</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Institución:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 5 secciones de 20 puntos</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100</span></div><div class="pauta-wrap"><div class="p-head"><div class="p-main">✅ PAUTA — Pensamiento Crítico · Los Cinco Reinos · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 5 secciones × 20 pts c/u — respuesta abierta, usar como guía de corrección</div></div><div class="p-grid">${pR}</div></div><div class="forma-tag">Forma ${forma}</div></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(doc);win.document.close();setTimeout(()=>win.print(),400);
}

// ===================== LABORATORIO DE LA CÉLULA =====================
const parteData={
  monera:{
    nombre:'Reino Monera',icon:'🦠',
    estructura:{title:'Características',info:'• Seres <strong>unicelulares</strong> (una sola célula)<br>• Célula <strong>procariota</strong>: sin núcleo definido, su ADN está libre<br>• Los seres vivos <strong>más pequeños y sencillos</strong><br>• Muchos viven en <strong>colonias</strong><br>• Fueron los <strong>primeros seres vivos</strong> de la Tierra'},
    funcion:{title:'Nutrición',info:'• Puede ser <strong>autótrofa o heterótrofa</strong><br>• Algunas hacen <strong>fotosíntesis</strong> (cianobacterias)<br>• Otras <strong>descomponen</strong> restos o viven dentro de otros seres<br>• Se reproducen muy rápido por <strong>bipartición</strong> (se parten en dos)'},
    ubicacion:{title:'Ejemplos',info:'• Las <strong>bacterias</strong> (como <em>Lactobacillus</em>, del yogur)<br>• Las <strong>cianobacterias</strong>, que hacen fotosíntesis<br>• Bacterias que ayudan a la <strong>digestión</strong><br>• Algunas bacterias que causan <strong>enfermedades</strong>'},
    dato:{title:'Dato curioso',info:'• En tu cuerpo hay <strong>más bacterias que células propias</strong>, ¡y la mayoría te ayudan!<br>• Sin bacterias no habría yogur, queso ni pan<br>• Viven hasta en los lugares más extremos: hielos, volcanes y el fondo del mar'}
  },
  protista:{
    nombre:'Reino Protista',icon:'🔬',
    estructura:{title:'Características',info:'• Seres <strong>eucariotas</strong> (con núcleo definido)<br>• Casi todos <strong>unicelulares</strong>; algunos forman colonias<br>• El reino <strong>más variado</strong> de todos<br>• Viven en el <strong>agua o en lugares húmedos</strong>'},
    funcion:{title:'Nutrición',info:'• Puede ser <strong>autótrofa o heterótrofa</strong><br>• Las <strong>algas</strong> hacen fotosíntesis (autótrofas)<br>• Los <strong>protozoos</strong> capturan su alimento (heterótrofos)<br>• Muchos se mueven con <strong>cilios o flagelos</strong>'},
    ubicacion:{title:'Ejemplos',info:'• La <strong>ameba</strong>, que se mueve con seudópodos<br>• El <strong>paramecio</strong>, cubierto de cilios<br>• Las <strong>algas</strong> unicelulares del mar<br>• El <em>Plasmodium</em>, que causa el paludismo'},
    dato:{title:'Dato curioso',info:'• Las <strong>algas del mar producen más oxígeno</strong> que todos los bosques juntos<br>• La ameba cambia de forma constantemente para moverse y comer<br>• A este reino se le llama a veces el "cajón de sastre" porque reúne lo que no encaja en los demás'}
  },
  fungi:{
    nombre:'Reino Fungi',icon:'🍄',
    estructura:{title:'Características',info:'• Seres <strong>eucariotas</strong>, uni o pluricelulares<br>• Su pared celular es de <strong>quitina</strong> (no de celulosa)<br>• <strong>No</strong> tienen clorofila ni hacen fotosíntesis<br>• Muchos forman <strong>hifas</strong> (filamentos) que crecen en el suelo'},
    funcion:{title:'Nutrición',info:'• Siempre <strong>heterótrofa por absorción</strong><br>• Muchos son <strong>descomponedores</strong>: reciclan restos muertos<br>• Otros son <strong>parásitos</strong> (viven sobre otros seres)<br>• Algunos viven en <strong>asociación</strong> con plantas o algas (líquenes)'},
    ubicacion:{title:'Ejemplos',info:'• Las <strong>setas</strong> y champiñones<br>• Los <strong>mohos</strong> del pan y las frutas<br>• Las <strong>levaduras</strong> del pan, la cerveza y el queso<br>• El hongo del <strong>pie de atleta</strong>'},
    dato:{title:'Dato curioso',info:'• Del hongo <em>Penicillium</em> se obtiene la <strong>penicilina</strong>, el primer antibiótico<br>• El organismo vivo más grande del mundo es un <strong>hongo</strong> bajo tierra en EE. UU.<br>• Sin los hongos descomponedores, el planeta estaría cubierto de restos muertos'}
  },
  plantae:{
    nombre:'Reino Plantae',icon:'🌿',
    estructura:{title:'Características',info:'• Seres <strong>pluricelulares</strong> y <strong>eucariotas</strong><br>• Tienen <strong>cloroplastos</strong> con clorofila (color verde)<br>• Pared celular de <strong>celulosa</strong><br>• No se desplazan: viven <strong>fijas</strong> al suelo'},
    funcion:{title:'Nutrición',info:'• Siempre <strong>autótrofa</strong><br>• Fabrican su alimento por <strong>fotosíntesis</strong>: luz + agua + CO₂ → glucosa y oxígeno<br>• Toman agua y sales minerales por la <strong>raíz</strong><br>• Producen el <strong>oxígeno</strong> del planeta'},
    ubicacion:{title:'Ejemplos',info:'• Los <strong>musgos</strong> y <strong>helechos</strong> (sin flores)<br>• Los árboles como el <strong>pino</strong> y el <strong>roble</strong><br>• Las plantas con flor: <strong>maíz</strong>, <strong>rosal</strong>, frutales<br>• Todas las hortalizas y cultivos'},
    dato:{title:'Dato curioso',info:'• Las plantas son la <strong>base de casi todas las cadenas alimenticias</strong><br>• El árbol más alto del mundo (una secuoya) mide más de <strong>115 metros</strong><br>• Sin plantas no existirían el oxígeno ni el alimento de los animales'}
  },
  animalia:{
    nombre:'Reino Animalia',icon:'🐾',
    estructura:{title:'Características',info:'• Seres <strong>pluricelulares</strong> y <strong>eucariotas</strong><br>• <strong>No</strong> tienen pared celular ni clorofila<br>• La mayoría se <strong>desplazan</strong> para buscar alimento<br>• Tienen <strong>órganos y sistemas</strong> especializados'},
    funcion:{title:'Nutrición',info:'• Siempre <strong>heterótrofa</strong>: comen otros seres vivos<br>• <strong>Herbívoros</strong> (comen plantas), <strong>carnívoros</strong> (comen animales) y <strong>omnívoros</strong> (ambos)<br>• Digieren el alimento dentro de su cuerpo'},
    ubicacion:{title:'Ejemplos',info:'• <strong>Invertebrados</strong> (sin columna): insectos, arañas, moluscos, gusanos<br>• <strong>Vertebrados</strong> (con columna): peces, anfibios, reptiles, aves y mamíferos<br>• El <strong>ser humano</strong> es un mamífero de este reino'},
    dato:{title:'Dato curioso',info:'• Cerca del <strong>95% de los animales son invertebrados</strong> (¡sobre todo insectos!)<br>• El animal más grande de la historia es la <strong>ballena azul</strong><br>• Los animales existen gracias a las plantas: dependen de su oxígeno y su alimento'}
  }
};
let labParte='monera',labAspecto='estructura';
function labShowParte(parteKey){labParte=parteKey;updateLabDisplay();document.querySelectorAll('.lab-cont-btn').forEach(b=>b.classList.remove('active-pri'));const btn=document.querySelector(`[data-parte="${parteKey}"]`);if(btn)btn.classList.add('active-pri');if(typeof sfx==='function')sfx('click');}
function labShowAspecto(aspectoKey){labAspecto=aspectoKey;updateLabDisplay();document.querySelectorAll('.lab-asp-btn').forEach(b=>b.classList.remove('active-sec'));const btn=document.querySelector(`[data-aspecto="${aspectoKey}"]`);if(btn)btn.classList.add('active-sec');if(typeof sfx==='function')sfx('click');}
function updateLabDisplay(){const data=parteData[labParte];const asp=data[labAspecto];document.getElementById('lab-sentence').innerHTML=`🔬 Explorando: <strong>${data.nombre}</strong> → <strong>${asp.title}</strong>`;document.getElementById('lab-display').innerHTML=`<div class="lab-cont-header">${data.icon} ${data.nombre}</div><div class="lab-asp-title">${asp.title}</div><div class="lab-asp-info">${asp.info}</div>`;}

// ===================== DIPLOMA =====================
function _diplPct(){return xp>=MXP?100:Math.round((xp/MXP)*100);}
function openDiploma(){sfx('fan');const pct=_diplPct();document.getElementById('diplPct').textContent=pct+'%';document.getElementById('diplBar').style.width=pct+'%';document.getElementById('diplDate').textContent='Fecha: '+new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});const msgs=['¡Sigue aprendiendo!','¡Muy buen trabajo!','¡Excelente naturalista!','¡Dominas los cinco reinos!','¡Maestro de los Reinos!'];document.getElementById('diplMsg').textContent=msgs[Math.min(Math.floor(pct/25),4)];const stars=['⭐','⭐⭐','⭐⭐⭐'];document.getElementById('diplStars').textContent=stars[Math.min(Math.floor(pct/40),2)];const achTxt=unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(' · ');document.getElementById('diplAch').textContent=achTxt||'Sigue completando secciones para desbloquear logros';document.getElementById('diplomaOverlay').classList.add('open');launchConfetti();}
function closeDiploma(){document.getElementById('diplomaOverlay').classList.remove('open');}
function updateDiplomaName(v){document.getElementById('diplName').textContent=v||'Estudiante';}
function shareWA(){const name=document.getElementById('diplName').textContent||'Estudiante';const pct=_diplPct();const msg=`🔬 ¡${name} completó la Misión "Los Cinco Reinos"! 🏅 Progreso: ${pct}% · 🌱 policastsapien.com`;_waShare(msg);}
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
  document.querySelector('[data-parte="monera"]')?.classList.add('active-pri');
  document.querySelector('[data-aspecto="estructura"]')?.classList.add('active-sec');
  renderAchPanel();
});

(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalCrit==='function') _injectFormaSel('genEvalCrit','evalCritFormaSel',evalCritFormNum,function(v){evalCritFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();
