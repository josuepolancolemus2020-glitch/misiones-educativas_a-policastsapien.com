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
const SAVE_KEY='digestivo_v1';
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
  primer_quiz:{icon:'🔬',label:'Primera prueba del sistema digestivo superada'},
  flash_master:{icon:'🃏',label:'Todas las flashcards del sistema digestivo exploradas'},
  clasif_pro:{icon:'🗂️',label:'Clasificador de alimentos y órganos experto'},
  id_master:{icon:'🔍',label:'Identificador de órganos digestivos maestro'},
  reto_hero:{icon:'🏆',label:'Héroe del reto del sistema digestivo'},
  nivel3:{icon:'🧫',label:'¡Naturalista! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡Maestro de la Nutrición! Nivel 6'},
  widgets_master:{icon:'🧩',label:'Widgets del sistema digestivo dominados'}
};
function unlockAchievement(id){if(unlockedAch.includes(id))return;unlockedAch.push(id);sfx('ach');showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label);launchConfetti();renderAchPanel();saveProgress();}
function renderAchPanel(){const list=document.getElementById('achList');list.innerHTML='';Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{const div=document.createElement('div');div.className='ach-item'+(unlockedAch.includes(id)?'':' locked');div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`;list.appendChild(div);});}
function toggleAchPanel(){sfx('click');document.getElementById('achPanel').classList.toggle('open');}
function showToast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}t.textContent=msg;t.style.display='block';clearTimeout(t._tid);t._tid=setTimeout(()=>t.style.display='none',3200);}
function launchConfetti(){const colors=['#16a34a','#4ade80','#0d9488','#5eead4','#00b894'];for(let i=0;i<60;i++){const c=document.createElement('div');c.className='confetti-piece';c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`;document.body.appendChild(c);c.addEventListener('animationend',()=>c.remove());}}

// ===================== XP =====================
const lvls=[{t:0,n:'Aprendiz 🌱'},{t:25,n:'Explorador 🔬'},{t:55,n:'Naturalista 🧫'},{t:90,n:'Biólogo 🧬'},{t:130,n:'Investigador 🔭'},{t:165,n:'Nutriólogo 🏅'},{t:190,n:'Maestro de la Nutrición 🏆'}];
function pts(n){xp=Math.max(0,Math.min(MXP,xp+n));updateXPBar();saveProgress();}
function updateXPBar(){const pct=Math.round((xp/MXP)*100);document.getElementById('xpFill').style.width=pct+'%';const el=document.getElementById('xpPts');el.textContent='⭐ '+xp;el.style.transform='scale(1.3)';setTimeout(()=>el.style.transform='',300);let lv=0;for(let i=0;i<lvls.length;i++)if(xp>=lvls[i].t)lv=i;document.getElementById('xpLvl').textContent=lvls[lv].n;if(lv!==prevLevel){if(lv>=2)unlockAchievement('nivel3');if(lv>=5)unlockAchievement('nivel5');prevLevel=lv;}}
function resetXP(){sfx('click');xp=0;updateXPBar();showToast('🔄 XP reiniciado a 0');}
function fin(id,showFX=true){if(!done.has(id)){done.add(id);const b=document.querySelector(`[data-s="${id}"]`);if(b)b.classList.add('done');if(showFX){sfx('up');launchConfetti();}saveProgress();}}
function getProgress(){return Math.round((done.size/TOTAL_SECTIONS)*100);}

// ===================== NAV =====================
function go(id){sfx('click');document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});document.getElementById(id).classList.add('active');const btn=document.querySelector(`[data-s="${id}"]`);if(btn){btn.classList.add('active');btn.setAttribute('aria-selected','true');}window.scrollTo({top:0,behavior:'smooth'});if(id==='s-sopa'){setTimeout(buildSopa,50);}if(id==='s-widgets'){setTimeout(buildRoute,50);}}

// ===================== FLASHCARD DATA =====================
const fcData=[
  {w:'Nutrición',a:'🍎 Proceso por el que el cuerpo <strong>toma los alimentos</strong>, los transforma y aprovecha para obtener <strong>energía</strong> y materiales para crecer y repararse.'},
  {w:'Aparato digestivo',a:'🫃 Conjunto de órganos que <strong>digieren el alimento</strong>: boca, esófago, estómago, intestinos y las glándulas anexas.'},
  {w:'Nutrientes',a:'🥗 Sustancias de los alimentos que el cuerpo aprovecha: <strong>carbohidratos, proteínas, grasas, vitaminas, minerales y agua</strong>.'},
  {w:'Carbohidratos',a:'⚡ Nutrientes que dan <strong>energía rápida</strong>. Están en el maíz, el arroz, el pan y la tortilla.'},
  {w:'Proteínas',a:'🧱 Nutrientes que <strong>construyen y reparan</strong> el cuerpo. Están en el frijol, el huevo, la carne y la leche.'},
  {w:'Digestión',a:'🔄 Proceso de <strong>deshacer el alimento</strong> en partes muy pequeñas (nutrientes) que el cuerpo puede aprovechar.'},
  {w:'Bolo alimenticio',a:'👄 Masa de alimento <strong>masticado y mezclado con saliva</strong>, lista para ser tragada.'},
  {w:'Estómago',a:'🫃 Órgano en forma de bolsa que <strong>mezcla el alimento con jugos gástricos</strong> y lo convierte en una papilla (quimo).'},
  {w:'Intestino delgado',a:'🌀 El órgano más largo (unos <strong>6 metros</strong>). Ahí los <strong>nutrientes pasan a la sangre</strong> (absorción).'},
  {w:'Intestino grueso',a:'🧻 Absorbe el <strong>agua</strong> que queda y forma las <strong>heces</strong>, que se expulsan por el ano.'},
  {w:'Absorción',a:'🩸 Paso de los <strong>nutrientes a la sangre</strong> a través de las paredes del intestino delgado.'},
  {w:'Hígado',a:'🫘 Glándula anexa que fabrica la <strong>bilis</strong>, la cual ayuda a digerir las <strong>grasas</strong>.'},
  {w:'Saliva',a:'💧 Líquido de la boca que <strong>ablanda el alimento</strong> y empieza la digestión. La producen las glándulas salivales.'},
  {w:'Alimentación saludable',a:'🥦 Comer <strong>variado y equilibrado</strong>, con higiene, para nutrirse bien: muchas frutas y verduras, y pocas grasas y azúcares.'},
];
let fcIdx=0;
function upFC(){document.getElementById('fcInner').classList.remove('flipped');document.getElementById('fcW').textContent=fcData[fcIdx].w;document.getElementById('fcA').innerHTML=fcData[fcIdx].a;document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length;}
function flipCard(){sfx('flip');document.getElementById('fcInner').classList.toggle('flipped');if(!xpTracker.fc.has(fcIdx)){xpTracker.fc.add(fcIdx);pts(1);}if(xpTracker.fc.size===fcData.length){fin('s-flash');unlockAchievement('flash_master');}}
function nextFC(){sfx('click');fcIdx=(fcIdx+1)%fcData.length;upFC();}
function prevFC(){sfx('click');fcIdx=(fcIdx-1+fcData.length)%fcData.length;upFC();}

// ===================== QUIZ DATA =====================
const qzData=[
  {q:'¿Qué sistema del cuerpo se encarga de transformar los alimentos?',o:['a) El nervioso','b) El digestivo','c) El respiratorio','d) El circulatorio'],c:1},
  {q:'¿Qué nutriente da energía rápida al cuerpo?',o:['a) Las proteínas','b) Las grasas','c) Los carbohidratos','d) El agua'],c:2},
  {q:'¿En qué órgano se mezcla el alimento con los jugos gástricos?',o:['a) La boca','b) El esófago','c) El estómago','d) El hígado'],c:2},
  {q:'¿En qué órgano pasan los nutrientes a la sangre?',o:['a) El estómago','b) El intestino delgado','c) El intestino grueso','d) La boca'],c:1},
  {q:'¿Cuál es la PRIMERA etapa de la digestión?',o:['a) La absorción','b) La digestión','c) La ingestión','d) La egestión'],c:2},
  {q:'¿Qué glándula fabrica la bilis?',o:['a) El páncreas','b) El hígado','c) El estómago','d) Las salivales'],c:1},
  {q:'¿Qué nutriente sirve para construir y reparar el cuerpo?',o:['a) Los carbohidratos','b) Las proteínas','c) Las grasas','d) Las vitaminas'],c:1},
  {q:'¿Qué órgano absorbe el agua y forma las heces?',o:['a) El intestino delgado','b) El estómago','c) El intestino grueso','d) El esófago'],c:2},
  {q:'¿Qué debemos hacer antes de comer para evitar enfermedades?',o:['a) Correr','b) Lavarnos las manos','c) Dormir','d) Ver televisión'],c:1},
];
let qzIdx=0,qzSel=-1,qzDone=false;
function buildQz(){qzIdx=0;qzSel=-1;qzDone=false;showQz();}
function showQz(){if(qzIdx>=qzData.length){document.getElementById('qzQ').textContent='🎉 ¡Quiz completado!';document.getElementById('qzOpts').innerHTML='';fin('s-quiz');unlockAchievement('primer_quiz');return;}const q=qzData[qzIdx];document.getElementById('qzProg').textContent=`Pregunta ${qzIdx+1} de ${qzData.length}`;document.getElementById('qzQ').textContent=q.q;const opts=document.getElementById('qzOpts');opts.innerHTML='';q.o.forEach((o,i)=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=o;b.onclick=()=>{if(qzDone)return;document.querySelectorAll('.qz-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');qzSel=i;sfx('click');};opts.appendChild(b);});qzDone=false;}
function checkQz(){if(qzSel<0)return fb('fbQz','Selecciona una respuesta.',false);qzDone=true;const opts=document.querySelectorAll('.qz-opt');if(qzSel===qzData[qzIdx].c){opts[qzSel].classList.add('correct');fb('fbQz','¡Correcto! +5 XP',true);if(!xpTracker.qz.has(qzIdx)){xpTracker.qz.add(qzIdx);pts(5);}sfx('ok');}else{opts[qzSel].classList.add('wrong');opts[qzData[qzIdx].c].classList.add('correct');fb('fbQz','Incorrecto. Revisa la respuesta correcta.',false);sfx('no');}setTimeout(()=>{qzIdx++;qzSel=-1;showQz();},1600);}
function resetQz(){sfx('click');qzIdx=0;qzSel=-1;qzDone=false;showQz();document.getElementById('fbQz').classList.remove('show');}

// ===================== CLASIFICACIÓN =====================
const classGroups=[
  {label:['Da energía','Construye'],headA:'⚡ Da energía (carbohidratos/grasas)',headB:'🧱 Construye el cuerpo (proteínas)',colA:'ene',colB:'con',
   words:[{w:'Carbohidratos',t:'ene'},{w:'Proteínas',t:'con'},{w:'Grasas',t:'ene'},{w:'Frijol',t:'con'},{w:'Arroz',t:'ene'},{w:'Huevo',t:'con'},{w:'Tortilla',t:'ene'},{w:'Carne',t:'con'},{w:'Azúcar',t:'ene'},{w:'Leche',t:'con'}]},
  {label:['Saludable','Chatarra'],headA:'🥗 Alimento saludable',headB:'🍟 Comida chatarra',colA:'san',colB:'chat',
   words:[{w:'Fruta',t:'san'},{w:'Refresco',t:'chat'},{w:'Verdura',t:'san'},{w:'Churros',t:'chat'},{w:'Frijol',t:'san'},{w:'Dulces',t:'chat'},{w:'Agua',t:'san'},{w:'Frituras',t:'chat'},{w:'Tortilla',t:'san'},{w:'Comida frita',t:'chat'}]},
  {label:['Etapa inicial','Etapa final'],headA:'🍽️ Etapa inicial de la digestión',headB:'🩸 Etapa final de la digestión',colA:'ini',colB:'fin',
   words:[{w:'Ingestión',t:'ini'},{w:'Absorción',t:'fin'},{w:'Masticar',t:'ini'},{w:'Egestión',t:'fin'},{w:'Ensalivar',t:'ini'},{w:'Formar las heces',t:'fin'},{w:'Bolo alimenticio',t:'ini'},{w:'Heces',t:'fin'},{w:'Empieza en la boca',t:'ini'},{w:'Termina en el ano',t:'fin'}]},
  {label:['Órgano','Nutriente'],headA:'🫃 Órgano digestivo',headB:'🥗 Nutriente',colA:'org',colB:'nut',
   words:[{w:'Estómago',t:'org'},{w:'Proteína',t:'nut'},{w:'Intestino',t:'org'},{w:'Vitamina',t:'nut'},{w:'Esófago',t:'org'},{w:'Grasa',t:'nut'},{w:'Boca',t:'org'},{w:'Carbohidrato',t:'nut'},{w:'Hígado',t:'org'},{w:'Mineral',t:'nut'}]},
];
let currentClassGroupIdx=0,clsSelectedWord=null;
function buildClass(){const group=classGroups[currentClassGroupIdx];document.getElementById('col-left-head').textContent=group.headA;document.getElementById('col-right-head').textContent=group.headB;const bank=document.getElementById('clsBank');bank.innerHTML='';clsSelectedWord=null;document.getElementById('items-left').innerHTML='';document.getElementById('items-right').innerHTML='';_shuffle([...group.words]).forEach(w=>{const el=document.createElement('div');el.className='wb-item';el.textContent=w.w;el.dataset.t=w.t;el.onclick=()=>{document.querySelectorAll('.wb-item').forEach(i=>i.classList.remove('sel-word'));el.classList.add('sel-word');clsSelectedWord=el;sfx('click');};bank.appendChild(el);});['col-left','col-right'].forEach(colId=>{const col=document.getElementById(colId);col.onclick=(e)=>{if(!clsSelectedWord||e.target.classList.contains('drop-item'))return;const targetId=colId==='col-left'?'items-left':'items-right';const wordsCol=document.getElementById(targetId);const item=document.createElement('div');item.className='drop-item';item.textContent=clsSelectedWord.textContent;item.dataset.t=clsSelectedWord.dataset.t;const original=clsSelectedWord;item.onclick=(ev)=>{ev.stopPropagation();if(clsSelectedWord!==null){col.click();}else{document.getElementById('clsBank').appendChild(original);original.classList.remove('sel-word');item.remove();if(typeof sfx==='function')sfx('click');}};wordsCol.appendChild(item);clsSelectedWord.remove();clsSelectedWord=null;sfx('click');};});}
function checkClass(){const remaining=document.querySelectorAll('#clsBank .wb-item').length;if(remaining>0){fb('fbCls','Mueve todas las palabras a las columnas primero.',false);return;}const group=classGroups[currentClassGroupIdx];let allOk=true;document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{const inLeft=el.parentElement.id==='items-left';const expectedType=inLeft?group.colA:group.colB;if(el.dataset.t===expectedType){el.classList.add('cls-ok');}else{el.classList.add('cls-no');allOk=false;}});if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);}if(allOk){fb('fbCls','¡Perfecto! +5 XP',true);sfx('fan');fin('s-clasifica');unlockAchievement('clasif_pro');}else{fb('fbCls','Hay errores. Marcados en rojo.',false);sfx('no');}}
function nextClassGroup(){sfx('click');currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length;buildClass();document.getElementById('fbCls').classList.remove('show');showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]);}
function resetClass(){sfx('click');buildClass();document.getElementById('fbCls').classList.remove('show');}

// ===================== IDENTIFICAR =====================
const idData=[
  {s:['La','boca','mastica','y','ensaliva','el','alimento.'],c:1,art:'Órgano donde empieza la digestión'},
  {s:['El','hígado','fabrica','la','bilis.'],c:1,art:'Glándula que produce la bilis'},
  {s:['La','digestión','deshace','el','alimento','en','nutrientes.'],c:1,art:'Proceso que deshace el alimento'},
  {s:['Los','nutrientes','pasan','a','la','sangre','por','absorción.'],c:7,art:'Paso de los nutrientes a la sangre'},
  {s:['Las','proteínas','construyen','y','reparan','el','cuerpo.'],c:1,art:'Nutriente que construye y repara'},
  {s:['Los','carbohidratos','dan','energía','al','cuerpo.'],c:1,art:'Nutriente que da energía rápida'},
  {s:['El','páncreas','produce','el','jugo','pancreático.'],c:1,art:'Glándula que fabrica el jugo pancreático'},
  {s:['El','estómago','mezcla','el','alimento','con','jugos.'],c:1,art:'Órgano que mezcla el alimento con jugos gástricos'},
];
let idIdx=0,idDone=false;
function showId(){idDone=false;if(idIdx>=idData.length){document.getElementById('idSent').innerHTML='🎉 ¡Completado!';fin('s-identifica');unlockAchievement('id_master');return;}const d=idData[idIdx];document.getElementById('idProg').textContent=`Oración ${idIdx+1} de ${idData.length}`;document.getElementById('idInfo').textContent=`Busca: ${d.art}`;const sent=document.getElementById('idSent');sent.innerHTML='';d.s.forEach((w,i)=>{const span=document.createElement('span');span.className='id-word';span.textContent=w+' ';span.onclick=()=>checkId(i,span);sent.appendChild(span);});}
function checkId(i,span){if(idDone)return;document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected'));span.classList.add('selected');if(i===idData[idIdx].c){idDone=true;span.classList.add('id-ok');fb('fbId','¡Correcto! +5 XP',true);if(!xpTracker.id.has(idIdx)){xpTracker.id.add(idIdx);pts(5);}sfx('ok');}else{span.classList.add('id-no');fb('fbId','Ese no es el término solicitado.',false);sfx('no');}}
function nextId(){sfx('click');idIdx++;showId();document.getElementById('fbId').classList.remove('show');}
function resetId(){sfx('click');idIdx=0;showId();document.getElementById('fbId').classList.remove('show');}

// ===================== COMPLETA =====================
const cmpData=[
  {s:'El sistema ___ transforma los alimentos en nutrientes.',opts:['nervioso','digestivo','óseo'],c:1},
  {s:'Los ___ dan energía rápida al cuerpo.',opts:['carbohidratos','proteínas','minerales'],c:0},
  {s:'Las ___ construyen y reparan el cuerpo.',opts:['grasas','proteínas','vitaminas'],c:1},
  {s:'El ___ mezcla el alimento con jugos gástricos.',opts:['esófago','estómago','hígado'],c:1},
  {s:'Los nutrientes pasan a la sangre en el intestino ___.',opts:['grueso','delgado','ciego'],c:1},
  {s:'El ___ fabrica la bilis para digerir las grasas.',opts:['páncreas','hígado','estómago'],c:1},
  {s:'La primera etapa de la digestión es la ___.',opts:['absorción','ingestión','egestión'],c:1},
  {s:'Antes de comer debemos ___ las manos.',opts:['lavarnos','pintarnos','secarnos'],c:0},
];
let cmpIdx=0,cmpSel=-1,cmpDone=false;
function showCmp(){if(cmpIdx>=cmpData.length){document.getElementById('cmpSent').innerHTML='🎉 ¡Completado!';document.getElementById('cmpOpts').innerHTML='';fin('s-completa');return;}const d=cmpData[cmpIdx];document.getElementById('cmpProg').textContent=`Oración ${cmpIdx+1} de ${cmpData.length}`;document.getElementById('cmpSent').innerHTML=d.s.replace('___','<span class="blank">___</span>');const opts=document.getElementById('cmpOpts');opts.innerHTML='';cmpSel=-1;cmpDone=false;d.opts.forEach((o,i)=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=o;b.onclick=()=>{if(cmpDone)return;document.querySelectorAll('.cmp-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');cmpSel=i;sfx('click');};opts.appendChild(b);});}
function checkCmp(){if(cmpSel<0)return fb('fbCmp','Selecciona una opción.',false);cmpDone=true;const opts=document.querySelectorAll('.cmp-opt');if(cmpSel===cmpData[cmpIdx].c){opts[cmpSel].classList.add('correct');document.getElementById('cmpSent').innerHTML=cmpData[cmpIdx].s.replace('___',`<span class="blank" style="color:var(--jade);border-color:var(--jade)">${opts[cmpSel].textContent}</span>`);fb('fbCmp','¡Correcto! +5 XP',true);if(!xpTracker.cmp.has(cmpIdx)){xpTracker.cmp.add(cmpIdx);pts(5);}sfx('ok');}else{opts[cmpSel].classList.add('wrong');opts[cmpData[cmpIdx].c].classList.add('correct');fb('fbCmp','Incorrecto. Revisa bien la respuesta.',false);sfx('no');}setTimeout(()=>{cmpIdx++;document.getElementById('fbCmp').classList.remove('show');showCmp();},1600);}

// ===================== WIDGETS =====================
// Widget 1: Ordenar secuencias de clasificación
const routeSets=[
  {label:'El recorrido del alimento (en orden)',steps:['Boca','Esófago','Estómago','Intestino delgado','Intestino grueso','Ano']},
  {label:'Las cuatro etapas de la digestión',steps:['Ingestión (entra el alimento)','Digestión (se deshace)','Absorción (pasa a la sangre)','Egestión (sale lo que sobra)']},
  {label:'Del plato a la energía (¿qué pasa primero?)',steps:['Masticamos el alimento en la boca','El estómago lo mezcla con jugos','El intestino delgado absorbe los nutrientes','Los nutrientes viajan por la sangre','Las células obtienen energía']},
];
let currentRouteIdx=0,routeItems=[];
function buildRoute(){routeItems=_shuffle([...routeSets[currentRouteIdx].steps]);renderRoute();const fbEl=document.getElementById('fbRoute');if(fbEl)fbEl.classList.remove('show');}
function renderRoute(){const list=document.getElementById('routeList');if(!list)return;list.innerHTML='';routeItems.forEach((step,i)=>{const div=document.createElement('div');div.className='sort-item';div.innerHTML=`<div class="sort-arrows"><button class="sort-arrow" onclick="routeMove(${i},-1)"${i===0?' disabled':''}>▲</button><button class="sort-arrow" onclick="routeMove(${i},1)"${i===routeItems.length-1?' disabled':''}>▼</button></div><div class="sort-step-num">${i+1}.</div><div class="sort-item-txt">${step}</div>`;list.appendChild(div);});}
function routeMove(idx,dir){sfx('click');const ni=idx+dir;if(ni<0||ni>=routeItems.length)return;[routeItems[idx],routeItems[ni]]=[routeItems[ni],routeItems[idx]];renderRoute();}
function checkRoute(){const correct=routeSets[currentRouteIdx].steps;const isOk=routeItems.every((s,i)=>s===correct[i]);if(isOk){fb('fbRoute','¡Perfecto! Orden correcto. +4 XP',true);if(!xpTracker.wgt.has('route_'+currentRouteIdx)){xpTracker.wgt.add('route_'+currentRouteIdx);pts(4);}sfx('fan');fin('s-widgets');unlockAchievement('widgets_master');}else{fb('fbRoute','Hay pasos fuera de orden. Revisa el arreglo.',false);sfx('no');}}
function nextRoute(){sfx('click');currentRouteIdx=(currentRouteIdx+1)%routeSets.length;buildRoute();showToast('🔄 Secuencia: '+routeSets[currentRouteIdx].label);}

// Widget 2: Identifica el reino o concepto (IDs neuron* reutilizados)
const neuronPartes=[
  {desc:'Órgano donde EMPIEZA la digestión (mastica y ensaliva)',ans:'Boca',opts:['Boca','Estómago','Hígado','Ano']},
  {desc:'Órgano que mezcla el alimento con jugos gástricos',ans:'Estómago',opts:['Estómago','Boca','Intestino grueso','Esófago']},
  {desc:'Órgano donde los nutrientes pasan a la sangre',ans:'Intestino delgado',opts:['Intestino delgado','Estómago','Boca','Esófago']},
  {desc:'Glándula anexa que fabrica la bilis',ans:'Hígado',opts:['Hígado','Páncreas','Estómago','Boca']},
  {desc:'Nutriente que da energía rápida (maíz, arroz)',ans:'Carbohidratos',opts:['Carbohidratos','Proteínas','Vitaminas','Agua']},
  {desc:'Nutriente que construye y repara el cuerpo (frijol, huevo)',ans:'Proteínas',opts:['Proteínas','Grasas','Carbohidratos','Minerales']},
  {desc:'Paso de los nutrientes del intestino a la sangre',ans:'Absorción',opts:['Absorción','Ingestión','Digestión','Egestión']},
  {desc:'Proceso por el que el cuerpo aprovecha los alimentos',ans:'Nutrición',opts:['Nutrición','Respiración','Circulación','Excreción']},
];
let neuronIdx=0,neuronDone=false;
function showNeuron(){neuronDone=false;if(neuronIdx>=neuronPartes.length){const el=document.getElementById('neuronDesc');if(el)el.textContent='🎉 ¡Todos los órganos y conceptos identificados!';const opts=document.getElementById('neuronOpts');if(opts)opts.innerHTML='';fin('s-widgets');return;}const d=neuronPartes[neuronIdx];const prog=document.getElementById('neuronProg');if(prog)prog.textContent=`Pista ${neuronIdx+1} de ${neuronPartes.length}`;const desc=document.getElementById('neuronDesc');if(desc)desc.textContent=d.desc;const opts=document.getElementById('neuronOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=opt;b.onclick=()=>checkNeuron(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuron');if(fbEl)fbEl.classList.remove('show');}
function checkNeuron(opt,btn,d){if(neuronDone)return;neuronDone=true;document.querySelectorAll('#neuronOpts .cmp-opt').forEach(b=>{if(b.textContent===d.ans)b.classList.add('correct');else if(b===btn&&b.textContent!==d.ans)b.classList.add('wrong');});const isOk=opt===d.ans;if(isOk){fb('fbNeuron','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuron_'+neuronIdx)){xpTracker.wgt.add('neuron_'+neuronIdx);pts(3);}sfx('ok');}else{fb('fbNeuron','La respuesta correcta es: '+d.ans,false);sfx('no');}}
function nextNeuron(){sfx('click');neuronIdx++;showNeuron();}
function resetNeuron(){sfx('click');neuronIdx=0;showNeuron();}

// Widget 3: Reino → Característica (IDs neuro* reutilizados)
const neuroPairs=[
  {trans:'Boca',func:'Mastica y ensaliva el alimento',opts:['Mastica y ensaliva el alimento','Mezcla con jugos gástricos','Absorbe los nutrientes','Fabrica la bilis']},
  {trans:'Estómago',func:'Mezcla el alimento con jugos gástricos',opts:['Mezcla el alimento con jugos gástricos','Mastica el alimento','Absorbe el agua','Fabrica la bilis']},
  {trans:'Intestino delgado',func:'Absorbe los nutrientes a la sangre',opts:['Absorbe los nutrientes a la sangre','Mastica el alimento','Forma las heces','Produce la saliva']},
  {trans:'Hígado',func:'Fabrica la bilis para digerir las grasas',opts:['Fabrica la bilis para digerir las grasas','Mastica el alimento','Mezcla con jugos gástricos','Forma las heces']},
  {trans:'Intestino grueso',func:'Absorbe el agua y forma las heces',opts:['Absorbe el agua y forma las heces','Mastica el alimento','Absorbe los nutrientes','Fabrica la bilis']},
];
let neuroIdx=0,neuroDone=false;
function showNeuro(){neuroDone=false;if(neuroIdx>=neuroPairs.length){const el=document.getElementById('neuroTrans');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('neuroOpts');if(opts)opts.innerHTML='';return;}const d=neuroPairs[neuroIdx];const prog=document.getElementById('neuroProg');if(prog)prog.textContent=`${neuroIdx+1} de ${neuroPairs.length}`;const trans=document.getElementById('neuroTrans');if(trans)trans.textContent=d.trans;const opts=document.getElementById('neuroOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkNeuro(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuro');if(fbEl)fbEl.classList.remove('show');}
function checkNeuro(opt,btn,d){if(neuroDone)return;neuroDone=true;document.querySelectorAll('#neuroOpts .qz-opt').forEach(b=>{if(b.textContent===d.func)b.classList.add('correct');else if(b===btn&&b.textContent!==d.func)b.classList.add('wrong');});const isOk=opt===d.func;if(isOk){fb('fbNeuro','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuro_'+neuroIdx)){xpTracker.wgt.add('neuro_'+neuroIdx);pts(3);}sfx('ok');}else{fb('fbNeuro','Correcto: '+d.func,false);sfx('no');}setTimeout(()=>{neuroIdx++;showNeuro();},1800);}
function resetNeuro(){sfx('click');neuroIdx=0;showNeuro();}

// Widget 4: Alimento → ¿Qué nutriente aporta sobre todo? (IDs enfer* reutilizados)
const enfermedadData=[
  {disease:'La tortilla',characteristic:'Carbohidratos',opts:['Carbohidratos','Proteínas','Grasas','Vitaminas']},
  {disease:'El frijol',characteristic:'Proteínas',opts:['Proteínas','Grasas','Carbohidratos','Agua']},
  {disease:'El aguacate',characteristic:'Grasas',opts:['Grasas','Proteínas','Vitaminas','Carbohidratos']},
  {disease:'La naranja',characteristic:'Vitaminas',opts:['Vitaminas','Grasas','Proteínas','Carbohidratos']},
  {disease:'El huevo',characteristic:'Proteínas',opts:['Proteínas','Carbohidratos','Grasas','Vitaminas']},
  {disease:'El arroz',characteristic:'Carbohidratos',opts:['Carbohidratos','Proteínas','Grasas','Minerales']},
];
let enferIdx=0,enferDone=false;
function showEnfer(){enferDone=false;if(enferIdx>=enfermedadData.length){const el=document.getElementById('enferDisease');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('enferOpts');if(opts)opts.innerHTML='';return;}const d=enfermedadData[enferIdx];const prog=document.getElementById('enferProg');if(prog)prog.textContent=`${enferIdx+1} de ${enfermedadData.length}`;const dis=document.getElementById('enferDisease');if(dis)dis.textContent=d.disease;const opts=document.getElementById('enferOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkEnfer(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbEnfer');if(fbEl)fbEl.classList.remove('show');}
function checkEnfer(opt,btn,d){if(enferDone)return;enferDone=true;document.querySelectorAll('#enferOpts .qz-opt').forEach(b=>{if(b.textContent===d.characteristic)b.classList.add('correct');else if(b===btn&&b.textContent!==d.characteristic)b.classList.add('wrong');});const isOk=opt===d.characteristic;if(isOk){fb('fbEnfer','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('enfer_'+enferIdx)){xpTracker.wgt.add('enfer_'+enferIdx);pts(3);}sfx('ok');}else{fb('fbEnfer','Correcto: '+d.characteristic,false);sfx('no');}setTimeout(()=>{enferIdx++;showEnfer();},1800);}
function resetEnfer(){sfx('click');enferIdx=0;showEnfer();}

// ===================== RETO FINAL =====================
const retoPairs=[
  {label:['Da energía','Construye'],btnA:'⚡ Da energía',btnB:'🧱 Construye',colA:'ene',colB:'con',
   words:[{w:'Carbohidratos',t:'ene'},{w:'Proteínas',t:'con'},{w:'Grasas',t:'ene'},{w:'Frijol',t:'con'},{w:'Arroz',t:'ene'},{w:'Huevo',t:'con'},{w:'Tortilla',t:'ene'},{w:'Carne',t:'con'},{w:'Azúcar',t:'ene'},{w:'Leche',t:'con'}]},
  {label:['Saludable','Chatarra'],btnA:'🥗 Saludable',btnB:'🍟 Chatarra',colA:'san',colB:'chat',
   words:[{w:'Fruta',t:'san'},{w:'Refresco',t:'chat'},{w:'Verdura',t:'san'},{w:'Churros',t:'chat'},{w:'Frijol',t:'san'},{w:'Dulces',t:'chat'},{w:'Agua',t:'san'},{w:'Frituras',t:'chat'},{w:'Tortilla',t:'san'},{w:'Comida frita',t:'chat'}]},
  {label:['Órgano','Nutriente'],btnA:'🫃 Órgano',btnB:'🥗 Nutriente',colA:'org',colB:'nut',
   words:[{w:'Estómago',t:'org'},{w:'Proteína',t:'nut'},{w:'Intestino',t:'org'},{w:'Vitamina',t:'nut'},{w:'Esófago',t:'org'},{w:'Grasa',t:'nut'},{w:'Boca',t:'org'},{w:'Carbohidrato',t:'nut'},{w:'Hígado',t:'org'},{w:'Mineral',t:'nut'}]},
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
  {s:'La nutrición es el proceso por el que el cuerpo aprovecha los alimentos.',type:'Nutrición'},
  {s:'Los carbohidratos, como el maíz y el arroz, dan energía rápida.',type:'Carbohidratos'},
  {s:'Las proteínas, como el frijol y el huevo, construyen y reparan el cuerpo.',type:'Proteínas'},
  {s:'La boca mastica y ensaliva el alimento para formar el bolo alimenticio.',type:'La boca'},
  {s:'El estómago mezcla el alimento con los jugos gástricos.',type:'El estómago'},
  {s:'En el intestino delgado los nutrientes pasan a la sangre.',type:'Absorción'},
  {s:'El hígado fabrica la bilis, que ayuda a digerir las grasas.',type:'El hígado'},
  {s:'El intestino grueso absorbe el agua y forma las heces.',type:'El intestino grueso'},
  {s:'Lavarse las manos antes de comer evita parásitos y enfermedades.',type:'Higiene'},
  {s:'La digestión deshace el alimento en nutrientes muy pequeños.',type:'Digestión'},
];
const classifyTaskDB=[
  {w:'Boca',gen:'Mastica y ensaliva',n:'Saliva',g:'Cepillar los dientes',t:'Empieza la digestión'},
  {w:'Estómago',gen:'Mezcla con jugos',n:'Jugo gástrico',g:'Comer sin prisa',t:'Forma el quimo'},
  {w:'Intestino delgado',gen:'Absorbe los nutrientes',n:'Recibe bilis y jugo pancreático',g:'Comer fibra e higiene',t:'Mide 6 metros'},
  {w:'Hígado',gen:'Fabrica la bilis',n:'Bilis',g:'Evitar grasas y alcohol',t:'La glándula más grande'},
  {w:'Intestino grueso',gen:'Absorbe agua, forma heces',n:'—',g:'Comer fibra y beber agua',t:'Aloja bacterias buenas'},
];
const completeTaskDB=[
  {s:'El sistema ___ transforma los alimentos en nutrientes.',opts:['nervioso','digestivo','óseo'],ans:'digestivo'},
  {s:'Los ___ dan energía rápida al cuerpo.',opts:['carbohidratos','proteínas','minerales'],ans:'carbohidratos'},
  {s:'El ___ mezcla el alimento con jugos gástricos.',opts:['esófago','estómago','hígado'],ans:'estómago'},
  {s:'Los nutrientes se absorben en el intestino ___.',opts:['grueso','delgado','ciego'],ans:'delgado'},
  {s:'El ___ fabrica la bilis para digerir las grasas.',opts:['páncreas','hígado','estómago'],ans:'hígado'},
  {s:'La primera etapa de la digestión es la ___.',opts:['absorción','ingestión','egestión'],ans:'ingestión'},
  {s:'Antes de comer hay que ___ las manos.',opts:['lavarse','pintarse','secarse'],ans:'lavarse'},
  {s:'El intestino ___ absorbe el agua y forma las heces.',opts:['delgado','grueso','ciego'],ans:'grueso'},
];
const explainQuestions=[
  {q:'¿Qué es la nutrición y qué sistema del cuerpo se encarga de ella?',ans:'Es el proceso por el que el cuerpo toma, transforma y aprovecha los alimentos para obtener energía y materiales. Se encarga el sistema o aparato digestivo.'},
  {q:'Menciona los cinco grupos de nutrientes y para qué sirve cada uno.',ans:'Carbohidratos (energía), proteínas (construir y reparar), grasas (energía de reserva), vitaminas y minerales (regular y proteger) y agua.'},
  {q:'Describe el recorrido del alimento por el tubo digestivo, en orden.',ans:'Boca → esófago → estómago → intestino delgado → intestino grueso → ano.'},
  {q:'¿Qué son las glándulas anexas y qué hacen?',ans:'Son órganos (glándulas salivales, hígado y páncreas) que fabrican jugos digestivos y los vierten al tubo digestivo; el alimento no pasa por dentro de ellos.'},
  {q:'Explica las cuatro etapas de la digestión.',ans:'Ingestión (entra el alimento por la boca), digestión (se deshace en nutrientes), absorción (los nutrientes pasan a la sangre) y egestión (sale como heces lo que no se aprovecha).'},
];
let ansVisible=false;
function genTask(){sfx('click');const type=document.getElementById('tgType').value;const count=parseInt(document.getElementById('tgCount').value);ansVisible=false;const out=document.getElementById('tgOut');out.innerHTML='';if(type==='identify')genIdentifyTask(out,count);else if(type==='classify')genClassifyTask(out,count);else if(type==='complete')genCompleteTask(out,count);else if(type==='explain')genExplainTask(out,count);fin('s-tareas');}
function _instrBlock(out,title,lines){const ib=document.createElement('div');ib.className='tg-instruction-block';ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join('');out.appendChild(ib);}
function genIdentifyTask(out,count){_instrBlock(out,'Instrucción',['Copia en tu cuaderno; subraya, colorea o encierra el concepto indicado en cada oración. Escribe al lado a qué concepto de la nutrición o del sistema digestivo se refiere.','<strong>Ejemplo:</strong> El estómago mezcla el alimento con jugos. → <span style="color:var(--jade);font-weight:700;">El estómago</span>']);_pick(identifyTaskDB,Math.min(count,identifyTaskDB.length)).forEach((item,i)=>{const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.type}</div></div>`;out.appendChild(div);});}
function genClassifyTask(out,count){_instrBlock(out,'Instrucción',['Copia la siguiente tabla en tu cuaderno. Para cada órgano, completa su función, el jugo o sustancia, cómo cuidarlo y un dato.']);const items=_pick(classifyTaskDB,Math.min(count,classifyTaskDB.length));const wrap=document.createElement('div');wrap.style.overflowX='auto';const th=(t,extra='')=>`<th style="padding:0.3rem 0.4rem;border:1px solid var(--border);font-size:0.72rem;text-align:center;${extra}">${t}</th>`;let html=`<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:520px;"><thead><tr style="background:var(--pri-gl);">${th('Órgano','text-align:left;')}${th('Función')}${th('Jugo/sustancia')}${th('Cómo cuidarlo')}${th('Dato')}</tr></thead><tbody>`;items.forEach(it=>{html+=`<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td>`+Array(4).fill(`<td style="padding:0.4rem;border:1px solid var(--border);min-width:50px;"></td>`).join('')+'</tr>';});html+='</tbody></table>';wrap.innerHTML=html;out.appendChild(wrap);const ans=document.createElement('div');ans.className='tg-answer';ans.style.marginTop='0.8rem';ans.innerHTML='<strong>✅ Respuestas:</strong><br>'+items.map(it=>`<strong>${it.w}:</strong> Función: ${it.gen} | Jugo/sustancia: ${it.n} | Cómo cuidarlo: ${it.g} | Dato: ${it.t}`).join('<br>');out.appendChild(ans);}
function genCompleteTask(out,count){_instrBlock(out,'Instrucción',['Copia y resuelve en tu cuaderno. Cada oración tiene un espacio ___. Elige y escribe la opción correcta.']);const pool=_shuffle([...completeTaskDB]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';const sent=item.s.replace('___','<span class="tg-blank" style="min-width:90px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${sent}</strong><div style="margin-top:0.4rem;font-size:0.82rem;color:var(--gray);">📝 Opciones: <strong>${item.opts.join(' | ')}</strong></div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function genExplainTask(out,count){_instrBlock(out,'Instrucción',['Copia las siguientes preguntas en tu cuaderno y responde cada una de forma clara y completa.']);const pool=_shuffle([...explainQuestions]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.3rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function toggleAns(){ansVisible=!ansVisible;document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none');sfx('click');}

// ===================== SOPA DE LETRAS =====================
const sopaSets=[
  {size:10,grid:[
    ['P','F','I','N','O','O','W','G','D','Q'],
    ['L','H','I','G','A','D','O','P','P','V'],
    ['K','V','K','W','U','U','N','Z','A','R'],
    ['U','I','W','T','S','A','L','I','V','A'],
    ['D','I','G','E','S','T','I','O','N','O'],
    ['G','S','A','G','M','W','D','N','K','H'],
    ['S','E','D','B','O','C','A','G','D','W'],
    ['A','O','B','O','A','R','E','K','S','X'],
    ['E','S','T','O','M','A','G','O','P','D'],
    ['J','I','N','T','E','S','T','I','N','O']
  ],words:[
    {w:'DIGESTION',cells:[[4,0],[4,1],[4,2],[4,3],[4,4],[4,5],[4,6],[4,7],[4,8]]},
    {w:'ESTOMAGO',cells:[[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,6],[8,7]]},
    {w:'INTESTINO',cells:[[9,1],[9,2],[9,3],[9,4],[9,5],[9,6],[9,7],[9,8],[9,9]]},
    {w:'BOCA',cells:[[6,3],[6,4],[6,5],[6,6]]},
    {w:'HIGADO',cells:[[1,1],[1,2],[1,3],[1,4],[1,5],[1,6]]},
    {w:'SALIVA',cells:[[3,4],[3,5],[3,6],[3,7],[3,8],[3,9]]}
  ]},
  {size:10,grid:[
    ['P','N','U','T','R','I','E','N','T','E'],
    ['N','G','H','O','U','X','J','S','B','W'],
    ['H','M','A','S','T','I','C','A','R','E'],
    ['T','K','O','E','E','M','K','D','W','X'],
    ['E','B','E','S','O','F','A','G','O','C'],
    ['A','H','V','A','S','B','I','L','I','S'],
    ['O','Q','P','R','O','T','E','I','N','A'],
    ['N','E','C','F','C','E','F','Y','K','H'],
    ['A','N','W','I','B','K','F','H','L','Y'],
    ['M','E','N','E','R','G','I','A','H','Y']
  ],words:[
    {w:'NUTRIENTE',cells:[[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[0,9]]},
    {w:'PROTEINA',cells:[[6,2],[6,3],[6,4],[6,5],[6,6],[6,7],[6,8],[6,9]]},
    {w:'ENERGIA',cells:[[9,1],[9,2],[9,3],[9,4],[9,5],[9,6],[9,7]]},
    {w:'ESOFAGO',cells:[[4,2],[4,3],[4,4],[4,5],[4,6],[4,7],[4,8]]},
    {w:'BILIS',cells:[[5,5],[5,6],[5,7],[5,8],[5,9]]},
    {w:'MASTICAR',cells:[[2,1],[2,2],[2,3],[2,4],[2,5],[2,6],[2,7],[2,8]]}
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
  {q:'La nutrición es el proceso por el que el cuerpo aprovecha los alimentos.',a:true},
  {q:'Los carbohidratos sirven sobre todo para construir el cuerpo.',a:false},
  {q:'Las proteínas construyen y reparan el cuerpo.',a:true},
  {q:'La digestión empieza en la boca.',a:true},
  {q:'El estómago mezcla el alimento con jugos gástricos.',a:true},
  {q:'Los nutrientes pasan a la sangre en el intestino grueso.',a:false},
  {q:'El hígado fabrica la bilis, que ayuda a digerir las grasas.',a:true},
  {q:'El intestino grueso absorbe el agua y forma las heces.',a:true},
  {q:'La primera etapa de la digestión es la absorción.',a:false},
  {q:'Lavarse las manos antes de comer ayuda a evitar enfermedades.',a:true},
  {q:'El aparato digestivo mide alrededor de 9 metros.',a:true},
  {q:'El hígado y el páncreas son glándulas anexas del aparato digestivo.',a:true},
  {q:'Las frutas y verduras aportan sobre todo vitaminas y minerales.',a:true},
  {q:'Comer mucha comida chatarra es bueno para la salud.',a:false},
  {q:'La saliva ablanda el alimento y empieza la digestión en la boca.',a:true},
];
const evalMCBank=[
  {q:'¿Qué sistema del cuerpo transforma los alimentos?',o:['a) El nervioso','b) El digestivo','c) El respiratorio','d) El óseo'],a:1},
  {q:'¿Qué nutriente da energía rápida?',o:['a) Las proteínas','b) Las grasas','c) Los carbohidratos','d) El agua'],a:2},
  {q:'¿Qué nutriente construye y repara el cuerpo?',o:['a) Los carbohidratos','b) Las proteínas','c) Las grasas','d) Las vitaminas'],a:1},
  {q:'¿En qué órgano empieza la digestión?',o:['a) El estómago','b) La boca','c) El esófago','d) El hígado'],a:1},
  {q:'¿En qué órgano se mezcla el alimento con jugos gástricos?',o:['a) La boca','b) El esófago','c) El estómago','d) El hígado'],a:2},
  {q:'¿En qué órgano pasan los nutrientes a la sangre?',o:['a) El estómago','b) El intestino delgado','c) El intestino grueso','d) La boca'],a:1},
  {q:'¿Qué glándula fabrica la bilis?',o:['a) El páncreas','b) El hígado','c) El estómago','d) Las salivales'],a:1},
  {q:'¿Qué órgano absorbe el agua y forma las heces?',o:['a) El intestino delgado','b) El estómago','c) El intestino grueso','d) El esófago'],a:2},
  {q:'¿Cuál es la primera etapa de la digestión?',o:['a) La absorción','b) La digestión','c) La ingestión','d) La egestión'],a:2},
  {q:'¿Qué debemos hacer antes de comer?',o:['a) Correr','b) Lavarnos las manos','c) Dormir','d) Ver televisión'],a:1},
  {q:'¿Cuál de estos alimentos aporta sobre todo proteínas?',o:['a) La tortilla','b) El frijol','c) El azúcar','d) El aguacate'],a:1},
  {q:'¿Cómo se llama la masa de alimento masticado y ensalivado?',o:['a) Quimo','b) Bolo alimenticio','c) Bilis','d) Heces'],a:1},
  {q:'Las glándulas salivales, el hígado y el páncreas son…',o:['a) órganos del tubo','b) glándulas anexas','c) nutrientes','d) músculos'],a:1},
  {q:'¿Qué paso hace que los nutrientes lleguen a la sangre?',o:['a) La ingestión','b) La absorción','c) La egestión','d) La masticación'],a:1},
  {q:'Para nutrirnos bien debemos comer…',o:['a) solo dulces','b) variado y equilibrado','c) solo carne','d) mucha comida frita'],a:1},
];
const evalCPBank=[
  {q:'El sistema ___ transforma los alimentos en nutrientes.',a:'digestivo'},
  {q:'Los ___ dan energía rápida al cuerpo (maíz, arroz).',a:'carbohidratos'},
  {q:'Las ___ construyen y reparan el cuerpo (frijol, huevo).',a:'proteínas'},
  {q:'La digestión empieza en la ___.',a:'boca'},
  {q:'El ___ mezcla el alimento con jugos gástricos.',a:'estómago'},
  {q:'Los nutrientes pasan a la sangre en el intestino ___.',a:'delgado'},
  {q:'El ___ fabrica la bilis para digerir las grasas.',a:'hígado'},
  {q:'El intestino ___ absorbe el agua y forma las heces.',a:'grueso'},
  {q:'La primera etapa de la digestión es la ___.',a:'ingestión'},
  {q:'El paso de los nutrientes a la sangre se llama ___.',a:'absorción'},
  {q:'Antes de comer debemos ___ las manos.',a:'lavarnos'},
  {q:'La masa de alimento masticado y ensalivado es el ___ alimenticio.',a:'bolo'},
  {q:'El líquido de la boca que empieza la digestión es la ___.',a:'saliva'},
  {q:'El hígado y el páncreas son glándulas ___.',a:'anexas'},
  {q:'Para nutrirnos bien debemos comer variado y ___.',a:'equilibrado'},
];
const evalPRBank=[
  {term:'Nutrición',def:'Aprovechar los alimentos para obtener energía y materiales'},
  {term:'Aparato digestivo',def:'Órganos que digieren el alimento'},
  {term:'Carbohidratos',def:'Nutriente que da energía rápida (maíz, arroz)'},
  {term:'Proteínas',def:'Nutriente que construye y repara (frijol, huevo)'},
  {term:'Boca',def:'Órgano donde empieza la digestión'},
  {term:'Estómago',def:'Mezcla el alimento con jugos gástricos'},
  {term:'Intestino delgado',def:'Absorbe los nutrientes a la sangre'},
  {term:'Intestino grueso',def:'Absorbe el agua y forma las heces'},
  {term:'Hígado',def:'Glándula que fabrica la bilis'},
  {term:'Bilis',def:'Sustancia que ayuda a digerir las grasas'},
  {term:'Absorción',def:'Paso de los nutrientes a la sangre'},
  {term:'Ingestión',def:'Primera etapa: entra el alimento por la boca'},
  {term:'Saliva',def:'Líquido de la boca que empieza la digestión'},
  {term:'Bolo alimenticio',def:'Alimento masticado y mezclado con saliva'},
  {term:'Glándulas anexas',def:'Salivales, hígado y páncreas; fabrican jugos'},
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

function genEval(){sfx('click');_evalFormaSelector(); const _selF = document.getElementById('evalFormaSel'); if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10))); const cf = evalFormNum; const rng = _evalRng(cf); window._currentEvalForm=cf;evalFormNum = (evalFormNum % EVAL_FORMAS) + 1; _evalFormaSelector();saveProgress();document.getElementById('eval-screen-title').textContent=`🎓 Evaluación Final · Forma ${cf} · El Sistema Digestivo`;evalAnsVisible=false;const out=document.getElementById('evalOut');out.innerHTML='';const bar=document.createElement('div');bar.className='eval-score-bar';bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje · 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25 pts</span><span class="eval-score-pill esp-tf">V/F 25 pts</span><span class="eval-score-pill esp-mc">Selección 25 pts</span><span class="eval-score-pill esp-pr">Pareados 25 pts</span></div>`;out.appendChild(bar);const cpItems=_pickF(evalCPBank,5, rng);const s1=document.createElement('div');s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';cpItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='cp';d.dataset.evalIndex=i;const qHtml=item.q.replace('___',`<input class="eval-cp-input" type="text" data-cp="${i}" autocomplete="off">`);d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbCp${i}" aria-live="polite"></div>`;s1.appendChild(d);});out.appendChild(s1);const tfItems=_pickF(evalTFBank,5, rng);const s2=document.createElement('div');s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';tfItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='tf';d.dataset.evalIndex=i;d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="true"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="false"> Falso</label></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbTf${i}" aria-live="polite"></div>`;s2.appendChild(d);});out.appendChild(s2);const mcItems=_pickF(evalMCBank,5, rng);const s3=document.createElement('div');s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';mcItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='mc';d.dataset.evalIndex=i;const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join('');d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbMc${i}" aria-live="polite"></div>`;s3.appendChild(d);});out.appendChild(s3);const prItems=_pickF(evalPRBank,5, rng);const shuffledDefs=_shuffleF(prItems, rng);const letters=['A','B','C','D','E'];const s4=document.createElement('div');s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';const matchCard=document.createElement('div');matchCard.className='eval-item';let colLeft='<div class="eval-match-col"><h4>📌 Términos</h4>';prItems.forEach((item,i)=>{colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> <select class="eval-match-select" data-pr="${i}" aria-label="Respuesta pareada ${i+16}"><option value="">—</option>${letters.map(l=>`<option value="${l}">${l}</option>`).join('')}</select> ${item.term}</div>`;});colLeft+='</div>';let colRight='<div class="eval-match-col"><h4>🔑 Definiciones</h4>';shuffledDefs.forEach((item,i)=>{colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`;});colRight+='</div>';const ansKey=prItems.map((item,i)=>{const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)];return`${i+16}→${letter}`;}).join(' · ');matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div><div class="eval-item-feedback" id="evalFbPr" aria-live="polite"></div>`;s4.appendChild(matchCard);out.appendChild(s4);window._evalPrintData={tf:tfItems,mc:mcItems,cp:cpItems,pr:{terms:prItems,shuffledDefs,letters}};const autoPanel=document.createElement('div');autoPanel.id='evalAutoResult';autoPanel.className='eval-auto-result';autoPanel.innerHTML='<strong>🧮 Evaluación interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato original sin respuestas digitadas.';out.appendChild(autoPanel);fin('s-evaluacion');}
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación El Sistema Digestivo · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.12rem 0.4rem;margin:0.22rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #27ae60;background:#e8f8f5;color:#27ae60;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#27ae60;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #27ae60;height:12px;}.obt-pct{white-space:nowrap;}.qn{font-weight:700;min-width:22px;flex-shrink:0;}.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:40px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.18rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.14rem 0.35rem;margin-bottom:0.1rem;break-inside:avoid;page-break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.3;display:flex;gap:0.28rem;margin-bottom:0.07rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.1rem 0.5rem;}.mc-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:0.04rem 0.15rem;margin-left:0.8rem;}.mc-opt{font-size:9pt;display:flex;align-items:center;gap:0.15rem;}.mc-opt input{width:10px;height:10px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{margin-top:0.1rem;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.08rem 0.4rem;margin-top:0.08rem;}.pr-head{font-size:9pt;font-weight:700;color:#555;margin-bottom:0.1rem;}.pr-item{font-size:10.5pt;padding:0.1rem 0.28rem;background:#e8f8f5;border-radius:3px;margin-bottom:0.07rem;display:flex;align-items:center;gap:0.2rem;line-height:1.2;break-inside:avoid;page-break-inside:avoid;}.pr-num{font-weight:700;color:#27ae60;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.22rem;padding:0.15rem 0;page-break-before:avoid;break-before:avoid;color:#27ae60;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #27ae60;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#555;}.pa{color:#007a00;font-weight:600;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · El Sistema Digestivo · Educación Básica · Ciencias Naturales</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Evaluación Final · El Sistema Digestivo · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u</div></div><div class="p-grid">${pR}</div>
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
  {txt:'Un niño solo come dulces, frituras y refrescos, y casi nunca frutas ni verduras. Se cansa rápido y se enferma seguido.'},
  {txt:'Una niña come muy rápido y sin masticar bien; después casi siempre le duele el estómago.'},
  {txt:'Un joven no se lava las manos antes de comer y a menudo tiene diarrea y parásitos.'},
  {txt:'En una familia casi no comen frutas, verduras ni frijol; varios sufren de estreñimiento.'},
  {txt:'Un niño solo desayuna un refresco antes de ir a la escuela y no logra concentrarse en clase.'},
  {txt:'Una persona come muchísima grasa y comida frita todos los días, y ha subido mucho de peso.'},
];
const critCaseQuestions=[
  '1. ¿Qué error o hábito de alimentación se observa en este caso?',
  '2. ¿Cómo afecta ese hábito al cuerpo o a la digestión?',
  '3. ¿Qué consejo darías para mejorar la alimentación?',
  '4. ¿Por qué es importante nutrirse bien y con higiene?',
];
const critCaseGuides=[
  'Se observa una alimentación poco variada, con exceso de comida chatarra, azúcar o grasa, o comer muy rápido o sin lavarse las manos.',
  'El cuerpo no recibe todos los nutrientes que necesita, o se enferma: puede causar cansancio, dolor de estómago, parásitos, estreñimiento u obesidad.',
  'Comer variado y equilibrado (frutas, verduras, frijol, agua), masticar bien, comer sin prisa y lavarse las manos antes de comer.',
  'Porque la nutrición da al cuerpo la energía y los materiales para crecer, moverse y estar sano; y la higiene evita enfermedades digestivas.',
];
const critErrorBank=[
  {txt:'"El estómago es donde los nutrientes pasan a la sangre."',
   g1:'La absorción de los nutrientes ocurre sobre todo en el INTESTINO DELGADO.',
   g2:'El estómago mezcla el alimento con jugos gástricos, pero no realiza la absorción principal.'},
  {txt:'"Los carbohidratos sirven para construir y reparar el cuerpo."',
   g1:'Los carbohidratos dan ENERGÍA rápida.',
   g2:'Los que construyen y reparan el cuerpo son las PROTEÍNAS.'},
  {txt:'"El hígado forma parte del tubo por donde pasa el alimento."',
   g1:'El hígado es una GLÁNDULA ANEXA: el alimento NO pasa por dentro de él.',
   g2:'Solo vierte la bilis al intestino delgado para ayudar a digerir las grasas.'},
  {txt:'"Comer solo dulces y frituras es una alimentación saludable."',
   g1:'Una alimentación saludable es VARIADA y EQUILIBRADA.',
   g2:'El exceso de dulces y frituras causa caries, obesidad y otros problemas.'},
  {txt:'"Da igual comer con las manos sucias."',
   g1:'NO da igual: comer con las manos sucias causa parásitos y diarrea.',
   g2:'Lavarse las manos antes de comer protege el aparato digestivo.'},
];
const critDecisionBank=[
  'En el recreo, un niño puede comprar una bolsa de churros con refresco, o una fruta con agua. Duda cuál elegir.',
  'Una mamá prepara la lonchera de su hijo: puede ponerle frijoles con tortilla y una fruta, o galletas dulces y soda.',
  'Después de jugar, un joven tiene mucha sed: puede tomar agua, o un refresco azucarado grande.',
  'Una familia decide qué cenar: verduras con pollo, o comida frita como casi todos los días.',
  'Un estudiante quiere tener energía para estudiar y piensa qué desayunar antes de la escuela.',
];
const critDecisionGuide='Para nutrirnos bien conviene elegir alimentos VARIADOS y NATURALES: frutas, verduras, frijol, tortilla, huevo y agua, y evitar el exceso de azúcar, grasa y comida chatarra. Una buena alimentación, con higiene, nos da energía, nos ayuda a crecer y previene enfermedades. La mejor decisión casi siempre es la opción más natural y equilibrada.';
const critCompareBank=[
  {a:'Un órgano que mezcla el alimento con jugos gástricos hasta hacer una papilla.',b:'Un órgano largo que absorbe los nutrientes y los pasa a la sangre.',
   ga:'El estómago.',
   gb:'El intestino delgado.',
   gr:'Los dos participan en la digestión, pero el estómago mezcla y el intestino delgado absorbe; cumplen funciones distintas.'},
  {a:'Un nutriente que da energía rápida, como el de la tortilla y el arroz.',b:'Un nutriente que construye y repara el cuerpo, como el del frijol y el huevo.',
   ga:'Un carbohidrato.',
   gb:'Una proteína.',
   gr:'No son iguales: uno da energía y el otro sirve para crecer y reparar el cuerpo.'},
  {a:'Un órgano por donde pasa el alimento, como el estómago.',b:'Una glándula que fabrica jugos pero por dentro NO pasa el alimento, como el hígado.',
   ga:'Un órgano del tubo digestivo.',
   gb:'Una glándula anexa.',
   gr:'Ambos ayudan a digerir, pero por el tubo pasa el alimento y la glándula solo vierte sus jugos.'},
];
const critCauseBank=[
  {cause:'Una persona solo come comida chatarra y casi nada de frutas y verduras.',guide:'Su cuerpo no recibe todos los nutrientes: se cansa, se enferma y puede subir de peso.'},
  {cause:'Un niño no se lava las manos antes de comer.',guide:'Puede contraer parásitos y diarrea.'},
  {cause:'Alguien come muy rápido y sin masticar bien.',guide:'El estómago trabaja de más y puede doler; la digestión se dificulta.'},
  {cause:'Una persona casi no come fibra ni bebe suficiente agua.',guide:'Puede sufrir estreñimiento: le cuesta ir al baño.'},
];
const critEffectBank=[
  {effect:'Un niño se cansa rápido y se enferma seguido.',guide:'Puede deberse a una mala alimentación, sin suficientes nutrientes.'},
  {effect:'A alguien le da diarrea después de comer en la calle.',guide:'Probablemente comió con las manos o alimentos sucios (falta de higiene).'},
  {effect:'Una persona sube mucho de peso.',guide:'Come más grasa, azúcar y comida chatarra de lo que su cuerpo gasta.'},
  {effect:'A un niño le cuesta ir al baño (estreñimiento).',guide:'Le falta fibra (frutas, verduras, frijol) y agua en su alimentación.'},
];
function genEvalCrit(){
  sfx('click');
  _injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });
  const _sC = document.getElementById('evalCritFormaSel');
  if (_sC && parseInt(_sC.value, 10)) evalCritFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sC.value, 10)));
  const cf=evalCritFormNum;window._currentEvalCritForm=cf;const rngC = _evalRng(200000 + cf);evalCritFormNum=(evalCritFormNum%EVAL_FORMAS)+1;_injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });saveProgress();
  document.getElementById('evalcrit-screen-title').textContent=`🧠 Pensamiento Crítico · Forma ${cf} · El Sistema Digestivo`;
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
  s4.innerHTML=`<div class="eval-section-title">IV. Comparación razonada <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-compare-grid"><div class="crit-compare-box"><h5>Caso A</h5>${cmp.a}</div><div class="crit-compare-box"><h5>Caso B</h5>${cmp.b}</div></div><div class="crit-q-block"><div class="crit-q-label">1. ¿Qué órgano o concepto corresponde a cada caso? 2. ¿Qué función cumple cada uno? 3. ¿Por qué no son lo mismo?</div><textarea class="crit-textarea" rows="4" aria-label="Comparación razonada de los casos A y B"></textarea><div class="crit-pauta">Caso A: ${cmp.ga} · Caso B: ${cmp.gb} · ${cmp.gr}</div></div><div class="crit-selfscore"><label for="critScore3">Obtenido:</label><input type="number" id="critScore3" class="crit-score-input" data-score="3" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
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
  let s4=`<div class="sec-title"><span>IV. Comparación razonada</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><div class="crit-compare-print-grid"><div class="crit-compare-print-box"><strong>Caso A:</strong> ${d.cmp.a}</div><div class="crit-compare-print-box"><strong>Caso B:</strong> ${d.cmp.b}</div></div><p class="crit-print-q">1. ¿Qué órgano o concepto corresponde a cada caso? 2. ¿Qué función cumple cada uno? 3. ¿Por qué no son lo mismo?</p>${lines(2)}`;
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
  const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Pensamiento Crítico El Sistema Digestivo · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.1rem 0.4rem;margin:0.2rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #27ae60;background:#e8f8f5;color:#27ae60;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#27ae60;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #27ae60;height:12px;}.obt-pct{white-space:nowrap;}.crit-print-scenario{font-size:10.5pt;background:#e8f8f5;border-left:3px solid #27ae60;padding:0.2rem 0.5rem;margin:0.1rem 0 0.2rem;line-height:1.3;}.crit-print-q{font-size:10pt;font-weight:600;margin:0.15rem 0 0.08rem;line-height:1.25;}.ln{border-bottom:1px solid #111;min-height:12px;margin-bottom:2px;}.crit-compare-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin:0.15rem 0;}.crit-compare-print-box{font-size:9.5pt;background:#e8f8f5;border-radius:4px;padding:0.25rem 0.4rem;line-height:1.25;}.crit-print-tbl{width:100%;border-collapse:collapse;font-size:9.5pt;margin-top:0.15rem;}.crit-print-tbl th,.crit-print-tbl td{border:1px solid #999;padding:0.3rem 0.45rem;text-align:left;height:30px;vertical-align:middle;}.crit-print-tbl th{background:#e8f8f5;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:9.5pt;font-weight:700;}.p-sub{font-size:7pt;color:#c00;font-weight:700;margin:0.08rem 0;}.p-meta{font-size:7pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.9rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.45rem;}.p-ttl{font-size:8pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.1rem;margin-bottom:0.18rem;}.p-crit-line{font-size:7.5pt;color:#007a00;margin-bottom:0.18rem;line-height:1.35;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.2rem;padding:0.1rem 0;color:#27ae60;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #27ae60;}.forma-tag{position:fixed;bottom:5mm;right:6mm;font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;}@media print{@page{size:letter portrait;margin:12.7mm;}}</style></head><body><div class="ph"><h2>Evaluación Competencial · Pensamiento Crítico · El Sistema Digestivo · Educación Básica · Ciencias Naturales</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Institución:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 5 secciones de 20 puntos</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100</span></div><div class="pauta-wrap"><div class="p-head"><div class="p-main">✅ PAUTA — Pensamiento Crítico · El Sistema Digestivo · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 5 secciones × 20 pts c/u — respuesta abierta, usar como guía de corrección</div></div><div class="p-grid">${pR}</div></div><div class="forma-tag">Forma ${forma}</div></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(doc);win.document.close();setTimeout(()=>win.print(),400);
}

// ===================== LABORATORIO DE LA CÉLULA =====================
const parteData={
  boca:{
    nombre:'La boca',icon:'👄',
    estructura:{title:'¿Qué es?',info:'• Es la <strong>entrada</strong> del aparato digestivo<br>• Contiene los <strong>dientes</strong>, la <strong>lengua</strong> y las <strong>glándulas salivales</strong><br>• Ahí <strong>empieza</strong> la digestión'},
    funcion:{title:'¿Qué hace?',info:'• Los <strong>dientes</strong> mastican y trituran el alimento<br>• La <strong>saliva</strong> lo ablanda y empieza a digerirlo<br>• La <strong>lengua</strong> forma el <strong>bolo alimenticio</strong> y ayuda a tragar'},
    ubicacion:{title:'¿Cómo cuidarla?',info:'• <strong>Cepíllate los dientes</strong> después de comer<br>• Evita el <strong>exceso de dulces</strong> (causan caries)<br>• Visita al dentista y <strong>mastica bien</strong> los alimentos'},
    dato:{title:'Dato curioso',info:'• Producimos cerca de <strong>1.5 litros de saliva</strong> al día<br>• Un adulto tiene <strong>32 dientes</strong><br>• Masticar bien facilita toda la digestión que sigue'}
  },
  estomago:{
    nombre:'El estómago',icon:'🫃',
    estructura:{title:'¿Qué es?',info:'• Órgano en forma de <strong>bolsa</strong> con paredes musculosas<br>• Está después del <strong>esófago</strong><br>• Puede estirarse para guardar el alimento'},
    funcion:{title:'¿Qué hace?',info:'• <strong>Mezcla</strong> el alimento con los <strong>jugos gástricos</strong><br>• Sus músculos lo baten hasta hacer una papilla (<strong>quimo</strong>)<br>• El ácido del jugo gástrico <strong>mata muchos microbios</strong>'},
    ubicacion:{title:'¿Cómo cuidarlo?',info:'• Come a <strong>horas regulares</strong> y sin prisa<br>• Evita el exceso de <strong>comida muy grasosa o picante</strong><br>• No comas en exceso: sobrecarga el estómago'},
    dato:{title:'Dato curioso',info:'• El jugo gástrico es tan <strong>ácido</strong> que podría dañar la piel, ¡pero el estómago se protege con moco!<br>• Los "ruidos" del estómago son gases y líquidos moviéndose<br>• Cabe alrededor de <strong>1 litro</strong> de comida'}
  },
  intestinodelgado:{
    nombre:'El intestino delgado',icon:'🌀',
    estructura:{title:'¿Qué es?',info:'• Tubo <strong>largo y estrecho</strong> (unos <strong>6 metros</strong>) muy enrollado<br>• El órgano <strong>más largo</strong> del tubo digestivo<br>• Por dentro tiene <strong>vellosidades</strong> (pequeños "pelitos")'},
    funcion:{title:'¿Qué hace?',info:'• <strong>Termina la digestión</strong> con la ayuda de la bilis y el jugo pancreático<br>• Realiza la <strong>absorción</strong>: los nutrientes pasan a la <strong>sangre</strong><br>• Las vellosidades aumentan la superficie para absorber más'},
    ubicacion:{title:'¿Cómo cuidarlo?',info:'• Come <strong>frutas y verduras</strong> con fibra<br>• Bebe <strong>suficiente agua</strong><br>• Cuida la <strong>higiene</strong> para evitar parásitos intestinales'},
    dato:{title:'Dato curioso',info:'• Si estiráramos todas sus vellosidades, cubrirían el área de <strong>una cancha</strong><br>• Es donde se aprovecha <strong>casi todo el alimento</strong><br>• Mide más de 3 veces la altura de una persona'}
  },
  higado:{
    nombre:'El hígado',icon:'🫘',
    estructura:{title:'¿Qué es?',info:'• Es la <strong>glándula más grande</strong> del cuerpo<br>• Es un órgano <strong>anexo</strong>: el alimento NO pasa por dentro de él<br>• Está al lado derecho del estómago'},
    funcion:{title:'¿Qué hace?',info:'• Fabrica la <strong>bilis</strong>, que ayuda a digerir las <strong>grasas</strong><br>• La bilis se vierte en el <strong>intestino delgado</strong><br>• También <strong>limpia la sangre</strong> de sustancias dañinas'},
    ubicacion:{title:'¿Cómo cuidarlo?',info:'• Evita el <strong>exceso de grasas</strong> y de comida chatarra<br>• Nunca consumas <strong>alcohol</strong> (daña mucho el hígado)<br>• Mantén una alimentación equilibrada'},
    dato:{title:'Dato curioso',info:'• El hígado puede <strong>regenerarse</strong> aunque se dañe una parte<br>• Cumple <strong>más de 500 funciones</strong> en el cuerpo<br>• Guarda energía en forma de reserva'}
  },
  intestinogrueso:{
    nombre:'El intestino grueso',icon:'🧻',
    estructura:{title:'¿Qué es?',info:'• Tubo <strong>más ancho y más corto</strong> que el delgado<br>• Es la <strong>parte final</strong> del tubo digestivo<br>• Termina en el <strong>ano</strong>'},
    funcion:{title:'¿Qué hace?',info:'• <strong>Absorbe el agua</strong> que queda del alimento<br>• Forma las <strong>heces</strong> con lo que el cuerpo no aprovecha<br>• Aloja <strong>bacterias buenas</strong> que ayudan a la digestión'},
    ubicacion:{title:'¿Cómo cuidarlo?',info:'• Come <strong>fibra</strong> (frutas, verduras, frijol) para ir bien al baño<br>• Bebe <strong>agua</strong> para evitar el estreñimiento<br>• Ve al baño cuando el cuerpo lo pida'},
    dato:{title:'Dato curioso',info:'• En él viven <strong>millones de bacterias buenas</strong> (la flora intestinal)<br>• Recupera gran parte del <strong>agua</strong> para que no la perdamos<br>• Sin él, perderíamos demasiada agua'}
  }
};
let labParte='boca',labAspecto='estructura';
function labShowParte(parteKey){labParte=parteKey;updateLabDisplay();document.querySelectorAll('.lab-cont-btn').forEach(b=>b.classList.remove('active-pri'));const btn=document.querySelector(`[data-parte="${parteKey}"]`);if(btn)btn.classList.add('active-pri');if(typeof sfx==='function')sfx('click');}
function labShowAspecto(aspectoKey){labAspecto=aspectoKey;updateLabDisplay();document.querySelectorAll('.lab-asp-btn').forEach(b=>b.classList.remove('active-sec'));const btn=document.querySelector(`[data-aspecto="${aspectoKey}"]`);if(btn)btn.classList.add('active-sec');if(typeof sfx==='function')sfx('click');}
function updateLabDisplay(){const data=parteData[labParte];const asp=data[labAspecto];document.getElementById('lab-sentence').innerHTML=`🔬 Explorando: <strong>${data.nombre}</strong> → <strong>${asp.title}</strong>`;document.getElementById('lab-display').innerHTML=`<div class="lab-cont-header">${data.icon} ${data.nombre}</div><div class="lab-asp-title">${asp.title}</div><div class="lab-asp-info">${asp.info}</div>`;}

// ===================== DIPLOMA =====================
function _diplPct(){return xp>=MXP?100:Math.round((xp/MXP)*100);}
function openDiploma(){sfx('fan');const pct=_diplPct();document.getElementById('diplPct').textContent=pct+'%';document.getElementById('diplBar').style.width=pct+'%';document.getElementById('diplDate').textContent='Fecha: '+new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});const msgs=['¡Sigue aprendiendo!','¡Muy buen trabajo!','¡Vas muy bien!','¡Dominas la digestión!','¡Maestro de la Nutrición!'];document.getElementById('diplMsg').textContent=msgs[Math.min(Math.floor(pct/25),4)];const stars=['⭐','⭐⭐','⭐⭐⭐'];document.getElementById('diplStars').textContent=stars[Math.min(Math.floor(pct/40),2)];const achTxt=unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(' · ');document.getElementById('diplAch').textContent=achTxt||'Sigue completando secciones para desbloquear logros';document.getElementById('diplomaOverlay').classList.add('open');launchConfetti();}
function closeDiploma(){document.getElementById('diplomaOverlay').classList.remove('open');}
function updateDiplomaName(v){document.getElementById('diplName').textContent=v||'Estudiante';}
function shareWA(){const name=document.getElementById('diplName').textContent||'Estudiante';const pct=_diplPct();const msg=`🔬 ¡${name} completó la Misión "El Sistema Digestivo"! 🏅 Progreso: ${pct}% · 🌱 policastsapien.com`;_waShare(msg);}
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
  document.querySelector('[data-parte="boca"]')?.classList.add('active-pri');
  document.querySelector('[data-aspecto="estructura"]')?.classList.add('active-sec');
  renderAchPanel();
});

(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalCrit==='function') _injectFormaSel('genEvalCrit','evalCritFormaSel',evalCritFormNum,function(v){evalCritFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();
