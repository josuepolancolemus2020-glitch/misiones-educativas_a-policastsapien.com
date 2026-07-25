// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
function compartirMision(){const url=window.location.href;const texto=`🤖 *Misión Asignada* 🤖\n\nPractica sobre este tema y sobresale en ser de los mejores alumnos. 🏆\n\nDesbloquea *todos los logros* y puedes poner *tus datos* para que tu maestro observe todos tus logros. 📋\n\n_Se te hará prueba escrita y serás excelente estudiante en Robótica._ 🤖\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;_waShare(texto);}
function toggleLetra(){document.body.classList.toggle('letra-grande');if(typeof sfx==='function')sfx('click');localStorage.setItem('preferenciaLetra',document.body.classList.contains('letra-grande'));}
window.addEventListener('DOMContentLoaded',()=>{if(localStorage.getItem('preferenciaLetra')==='true')document.body.classList.add('letra-grande');});

// ===================== UTILIDADES =====================
const _pick=(arr,n)=>[...arr].sort(()=>Math.random()-0.5).slice(0,n);
const _shuffle=(arr)=>[...arr].sort(()=>Math.random()-0.5);
function fb(id,msg,isOk){const el=document.getElementById(id);if(el){el.textContent=msg;el.className='fb show '+(isOk?'ok':'err');}}

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY='que_es_un_robot_v1';
let xp=0,MXP=200,done=new Set(),evalAnsVisible=false;
let evalFormNum=1,unlockedAch=[],darkMode=false,prevLevel=0;
let evalCritFormNum=1,evalCritAnsVisible=false;
const TOTAL_SECTIONS=13;
const xpTracker={fc:new Set(),memo:new Set(),qz:new Set(),cls:new Set(),id:new Set(),cmp:new Set(),reto:new Set(),sopa:new Set(),wgt:new Set()};

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
let ACHIEVEMENTS={
  primer_quiz:{icon:'🤖',label:'Primer quiz robótico superado'},
  flash_master:{icon:'🃏',label:'Todas las flashcards del robot exploradas'},
  clasif_pro:{icon:'🗂️',label:'Clasificador de sensores y actuadores experto'},
  id_master:{icon:'🔍',label:'Identificador de partes del robot maestro'},
  reto_hero:{icon:'🏆',label:'Héroe del reto Sensor vs Actuador'},
  nivel3:{icon:'🧭',label:'¡Explorador Robótico! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡Ingeniero de Robots! Nivel 6'},
  widgets_master:{icon:'🧩',label:'Widgets del ciclo del robot dominados'}
};
function unlockAchievement(id){if(unlockedAch.includes(id))return;unlockedAch.push(id);sfx('ach');showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label);launchConfetti();renderAchPanel();saveProgress();}
function renderAchPanel(){const list=document.getElementById('achList');list.innerHTML='';Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{const div=document.createElement('div');div.className='ach-item'+(unlockedAch.includes(id)?'':' locked');div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`;list.appendChild(div);});}
function toggleAchPanel(){sfx('click');document.getElementById('achPanel').classList.toggle('open');}
function showToast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}t.textContent=msg;t.style.display='block';clearTimeout(t._tid);t._tid=setTimeout(()=>t.style.display='none',3200);}
function launchConfetti(){const colors=['#0e7490','#22d3ee','#c2410c','#fb923c','#06b6d4'];for(let i=0;i<60;i++){const c=document.createElement('div');c.className='confetti-piece';c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`;document.body.appendChild(c);c.addEventListener('animationend',()=>c.remove());}}

// ===================== XP =====================
let lvls=[{t:0,n:'Aprendiz 🌱'},{t:25,n:'Curioso Tec 🔋'},{t:55,n:'Explorador Robótico 🧭'},{t:90,n:'Técnico de Sensores 📡'},{t:130,n:'Programador Junior 💻'},{t:165,n:'Ingeniero de Robots 🛠️'},{t:190,n:'Maestro Constructor 🤖'}];
function pts(n){xp=Math.max(0,Math.min(MXP,xp+n));updateXPBar();saveProgress();}
function updateXPBar(){const pct=Math.round((xp/MXP)*100);document.getElementById('xpFill').style.width=pct+'%';const el=document.getElementById('xpPts');el.textContent='⭐ '+xp;el.style.transform='scale(1.3)';setTimeout(()=>el.style.transform='',300);let lv=0;for(let i=0;i<lvls.length;i++)if(xp>=lvls[i].t)lv=i;document.getElementById('xpLvl').textContent=lvls[lv].n;if(lv!==prevLevel){if(lv>=2)unlockAchievement('nivel3');if(lv>=5)unlockAchievement('nivel5');prevLevel=lv;}}
function resetXP(){sfx('click');xp=0;updateXPBar();showToast('🔄 XP reiniciado a 0');}
function fin(id,showFX=true){if(!done.has(id)){done.add(id);const b=document.querySelector(`[data-s="${id}"]`);if(b)b.classList.add('done');if(showFX){sfx('up');launchConfetti();}saveProgress();}}
function getProgress(){return Math.round((done.size/TOTAL_SECTIONS)*100);}

// ===================== NAV =====================
function go(id){sfx('click');document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});document.getElementById(id).classList.add('active');const btn=document.querySelector(`[data-s="${id}"]`);if(btn){btn.classList.add('active');btn.setAttribute('aria-selected','true');}window.scrollTo({top:0,behavior:'smooth'});if(id==='s-sopa'){setTimeout(buildSopa,50);}if(id==='s-widgets'){setTimeout(buildRoute,50);}}

// ===================== MINI-QUIZ (sección Partes) =====================
function miniQ(btn,isOk,fbId){const wrap=btn.parentElement;if(wrap.dataset.done==='1')return;wrap.querySelectorAll('.cmp-opt').forEach(b=>b.classList.remove('sel'));if(isOk){wrap.dataset.done='1';btn.classList.add('correct');fb(fbId,'¡Correcto! Piensas como todo un robotista.',true);sfx('ok');}else{btn.classList.add('wrong');fb(fbId,'Casi. Pregúntate: ¿percibe?, ¿decide?, ¿actúa?',false);sfx('no');}}

// ===================== FLASHCARD DATA =====================
let fcData=[
  {w:'Robot',a:'🤖 Máquina que <strong>percibe</strong> con sensores, <strong>decide</strong> con su programa y <strong>actúa</strong> con motores.'},
  {w:'Sensor',a:'📡 La parte que <strong>percibe</strong>: capta luz, sonido, distancia, tacto o temperatura.'},
  {w:'Controlador',a:'🧠 El «cerebro» del robot: recibe la información de los sensores y <strong>decide</strong> qué hacer según su programa.'},
  {w:'Actuador',a:'💪 La parte que <strong>actúa</strong>: motores, ruedas, brazos, luces o bocinas.'},
  {w:'Programa',a:'📋 La <strong>lista de instrucciones exactas</strong> que el robot obedece paso a paso.'},
  {w:'Ciclo del robot',a:'🔁 <strong>Percibir → decidir → actuar</strong>, repetido una y otra vez.'},
  {w:'Energía',a:'🔋 La <strong>batería o electricidad</strong> que hace funcionar sensores, controlador y actuadores.'},
  {w:'Máquina simple',a:'🔨 Herramienta <strong>sin sensores ni programa</strong> (martillo, palanca): no percibe ni decide.'},
  {w:'Electrodoméstico',a:'🔌 Actúa cuando lo encendemos, pero <strong>no decide solo</strong> (licuadora, plancha).'},
  {w:'Robot industrial',a:'🏭 Brazo robótico que <strong>suelda, corta o cose</strong> en las fábricas y maquilas.'},
  {w:'Dron',a:'🚁 Robot <strong>volador</strong>; en Honduras revisa los cultivos de café desde el aire.'},
  {w:'Robot móvil',a:'🛞 Robot con <strong>ruedas</strong> que recorre lugares, como la aspiradora robot.'},
  {w:'Humanoide',a:'🦿 Robot con <strong>forma de persona</strong>: camina, mueve los brazos y la cabeza.'},
  {w:'Robótica desconectada',a:'✏️ Aprender robótica con <strong>papel, juegos y lógica</strong>, sin necesitar computadora.'},
];
let fcIdx=0;
function upFC(){document.getElementById('fcInner').classList.remove('flipped');document.getElementById('fcW').textContent=fcData[fcIdx].w;document.getElementById('fcA').innerHTML=fcData[fcIdx].a;document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length;}
function flipCard(){sfx('flip');document.getElementById('fcInner').classList.toggle('flipped');if(!xpTracker.fc.has(fcIdx)){xpTracker.fc.add(fcIdx);pts(1);}if(xpTracker.fc.size===fcData.length){fin('s-flash');unlockAchievement('flash_master');}}
function nextFC(){sfx('click');fcIdx=(fcIdx+1)%fcData.length;upFC();}
function prevFC(){sfx('click');fcIdx=(fcIdx-1+fcData.length)%fcData.length;upFC();}

// ===================== JUEGO: MEMORIA DEL ROBOT =====================
let memoPairs=[
  {id:'robot',t:'Robot',d:'🤖 percibe, decide y actúa'},
  {id:'sensor',t:'Sensor',d:'📡 los «ojos y oídos»: capta luz, tacto, distancia'},
  {id:'controlador',t:'Controlador',d:'🧠 el cerebro: decide según el programa'},
  {id:'actuador',t:'Actuador',d:'💪 los músculos: motores y ruedas que actúan'},
  {id:'programa',t:'Programa',d:'📋 instrucciones exactas paso a paso'},
  {id:'energia',t:'Energía',d:'🔋 la batería que da vida al robot'}
];
let memoDeck=[],memoOpen=[],memoLock=false,memoMoves=0,memoFound=0;
function buildMemo(){
  const grid=document.getElementById('memoGrid'); if(!grid) return;
  memoDeck=_shuffle(memoPairs.flatMap(p=>[{id:p.id,txt:p.t,kind:'t'},{id:p.id,txt:p.d,kind:'d'}]));
  memoOpen=[]; memoLock=false; memoMoves=0; memoFound=0;
  grid.innerHTML='';
  memoDeck.forEach((c,i)=>{
    const b=document.createElement('button');
    b.className='memo-card'; b.setAttribute('aria-label','Carta de memoria '+(i+1));
    b.innerHTML=`<span class="memo-face memo-front">❓</span><span class="memo-face memo-back${c.kind==='t'?' memo-term':''}">${c.txt}</span>`;
    b.onclick=()=>flipMemo(b,i);
    grid.appendChild(b);
  });
  updateMemoStats();
  const f=document.getElementById('fbMemo'); if(f) f.classList.remove('show');
}
function updateMemoStats(){ const s=document.getElementById('memoStats'); if(s) s.textContent=`🃏 Parejas: ${memoFound} de ${memoPairs.length} · Intentos: ${memoMoves}`; }
function flipMemo(btn,i){
  if(memoLock||btn.classList.contains('revealed')||btn.classList.contains('matched')) return;
  sfx('flip'); btn.classList.add('revealed'); memoOpen.push({btn,i});
  if(memoOpen.length<2) return;
  memoMoves++; memoLock=true;
  const [a,b]=memoOpen;
  if(memoDeck[a.i].id===memoDeck[b.i].id){
    setTimeout(()=>{
      a.btn.classList.add('matched'); b.btn.classList.add('matched');
      memoFound++; sfx('ok');
      if(!xpTracker.memo.has(memoDeck[a.i].id)){ xpTracker.memo.add(memoDeck[a.i].id); pts(1); }
      memoOpen=[]; memoLock=false; updateMemoStats();
      if(memoFound===memoPairs.length){ pts(2); fb('fbMemo',`¡Memoria completada en ${memoMoves} intentos! +2 XP extra`,true); sfx('fan'); launchConfetti(); }
    },450);
  } else {
    setTimeout(()=>{ a.btn.classList.remove('revealed'); b.btn.classList.remove('revealed'); memoOpen=[]; memoLock=false; sfx('no'); updateMemoStats(); },900);
  }
  updateMemoStats();
}
function resetMemo(){ sfx('click'); buildMemo(); }

// ===================== QUIZ DATA =====================
let qzData=[
  {q:'¿Qué hace un robot que NO hace una máquina simple?',o:['a) Pesar mucho','b) Percibir y decidir solo','c) Ser de metal','d) Necesitar una persona que lo empuje'],c:1},
  {q:'¿Qué parte del robot funciona como sus sentidos?',o:['a) Los actuadores','b) La batería','c) Los sensores','d) Las ruedas'],c:2},
  {q:'¿Qué parte del robot decide qué hacer?',o:['a) El controlador','b) El motor','c) La bocina','d) La carrocería'],c:0},
  {q:'¿Qué parte del robot actúa (se mueve, gira, enciende luces)?',o:['a) Los sensores','b) Los actuadores','c) El programa','d) La antena'],c:1},
  {q:'¿Cuál es el orden correcto del ciclo del robot?',o:['a) Actuar → percibir → decidir','b) Decidir → actuar → percibir','c) Percibir → decidir → actuar','d) Percibir → actuar → decidir'],c:2},
  {q:'¿Cuál de estas máquinas es un robot?',o:['a) El martillo','b) La licuadora','c) La bicicleta','d) La aspiradora que detecta obstáculos y decide su ruta sola'],c:3},
  {q:'¿Por qué la licuadora NO es un robot?',o:['a) Porque es pequeña','b) Porque actúa pero no percibe ni decide sola','c) Porque no usa electricidad','d) Porque no tiene ruedas'],c:1},
  {q:'¿Qué robot revisa los cultivos de café en Honduras?',o:['a) El humanoide','b) La aspiradora robot','c) El dron','d) El brazo de maquila'],c:2},
  {q:'¿Los robots «piensan» como las personas?',o:['a) Sí, igual que nosotros','b) No: siguen las instrucciones de su programa','c) Sí, pero solo de noche','d) No: adivinan qué hacer'],c:1},
];
let qzIdx=0,qzSel=-1,qzDone=false;
function buildQz(){qzIdx=0;qzSel=-1;qzDone=false;showQz();}
function showQz(){if(qzIdx>=qzData.length){document.getElementById('qzQ').textContent='🎉 ¡Quiz completado!';document.getElementById('qzOpts').innerHTML='';fin('s-quiz');unlockAchievement('primer_quiz');return;}const q=qzData[qzIdx];document.getElementById('qzProg').textContent=`Pregunta ${qzIdx+1} de ${qzData.length}`;document.getElementById('qzQ').textContent=q.q;const opts=document.getElementById('qzOpts');opts.innerHTML='';q.o.forEach((o,i)=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=o;b.onclick=()=>{if(qzDone)return;document.querySelectorAll('.qz-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');qzSel=i;sfx('click');};opts.appendChild(b);});qzDone=false;}
function checkQz(){if(qzSel<0)return fb('fbQz','Selecciona una respuesta.',false);qzDone=true;const opts=document.querySelectorAll('.qz-opt');if(qzSel===qzData[qzIdx].c){opts[qzSel].classList.add('correct');fb('fbQz','¡Correcto! +5 XP',true);if(!xpTracker.qz.has(qzIdx)){xpTracker.qz.add(qzIdx);pts(5);}sfx('ok');}else{opts[qzSel].classList.add('wrong');opts[qzData[qzIdx].c].classList.add('correct');fb('fbQz','Incorrecto. Revisa la respuesta correcta.',false);sfx('no');}setTimeout(()=>{qzIdx++;qzSel=-1;showQz();},1600);}
function resetQz(){sfx('click');qzIdx=0;qzSel=-1;qzDone=false;showQz();document.getElementById('fbQz').classList.remove('show');}

// ===================== CLASIFICACIÓN =====================
let classGroups=[
  {label:['Sensor','Actuador'],headA:'📡 Sensor (percibe)',headB:'💪 Actuador (actúa)',colA:'sen',colB:'act',
   words:[{w:'Cámara',t:'sen'},{w:'Motor',t:'act'},{w:'Micrófono',t:'sen'},{w:'Rueda',t:'act'},{w:'Sensor de tacto',t:'sen'},{w:'Bocina',t:'act'},{w:'Termómetro del robot',t:'sen'},{w:'Brazo mecánico',t:'act'},{w:'Sensor de distancia',t:'sen'},{w:'Luz LED',t:'act'}]},
  {label:['Es un robot','No es robot'],headA:'🤖 Es un robot',headB:'🚫 No es robot',colA:'rob',colB:'no',
   words:[{w:'Aspiradora robot',t:'rob'},{w:'Martillo',t:'no'},{w:'Dron agrícola',t:'rob'},{w:'Licuadora',t:'no'},{w:'Brazo de maquila',t:'rob'},{w:'Bicicleta',t:'no'},{w:'Carrito seguidor de línea',t:'rob'},{w:'Tijeras',t:'no'},{w:'Robot de cirugía',t:'rob'},{w:'Plancha',t:'no'}]},
  {label:['Percibir','Actuar'],headA:'👀 Percibir',headB:'⚙️ Actuar',colA:'per',colB:'act',
   words:[{w:'Ver un obstáculo',t:'per'},{w:'Girar las ruedas',t:'act'},{w:'Medir la temperatura',t:'per'},{w:'Encender la luz',t:'act'},{w:'Escuchar un aplauso',t:'per'},{w:'Mover el brazo',t:'act'},{w:'Detectar la línea negra',t:'per'},{w:'Sonar la bocina',t:'act'}]},
  {label:['Máquina simple','Electrodoméstico'],headA:'🔨 Máquina simple',headB:'🔌 Electrodoméstico',colA:'sim',colB:'ele',
   words:[{w:'Martillo',t:'sim'},{w:'Licuadora',t:'ele'},{w:'Palanca',t:'sim'},{w:'Televisor',t:'ele'},{w:'Tijeras',t:'sim'},{w:'Plancha',t:'ele'},{w:'Carretilla',t:'sim'},{w:'Ventilador',t:'ele'},{w:'Rampa',t:'sim'},{w:'Refrigeradora',t:'ele'}]},
];
let currentClassGroupIdx=0,clsSelectedWord=null;
function buildClass(){const group=classGroups[currentClassGroupIdx];document.getElementById('col-left-head').textContent=group.headA;document.getElementById('col-right-head').textContent=group.headB;const bank=document.getElementById('clsBank');bank.innerHTML='';clsSelectedWord=null;document.getElementById('items-left').innerHTML='';document.getElementById('items-right').innerHTML='';_shuffle([...group.words]).forEach(w=>{const el=document.createElement('div');el.className='wb-item';el.textContent=w.w;el.dataset.t=w.t;el.onclick=()=>{document.querySelectorAll('.wb-item').forEach(i=>i.classList.remove('sel-word'));el.classList.add('sel-word');clsSelectedWord=el;sfx('click');};bank.appendChild(el);});['col-left','col-right'].forEach(colId=>{const col=document.getElementById(colId);col.onclick=(e)=>{if(!clsSelectedWord||e.target.classList.contains('drop-item'))return;const targetId=colId==='col-left'?'items-left':'items-right';const wordsCol=document.getElementById(targetId);const item=document.createElement('div');item.className='drop-item';item.textContent=clsSelectedWord.textContent;item.dataset.t=clsSelectedWord.dataset.t;const original=clsSelectedWord;item.onclick=(ev)=>{ev.stopPropagation();if(clsSelectedWord!==null){col.click();}else{document.getElementById('clsBank').appendChild(original);original.classList.remove('sel-word');item.remove();if(typeof sfx==='function')sfx('click');}};wordsCol.appendChild(item);clsSelectedWord.remove();clsSelectedWord=null;sfx('click');};});}
function checkClass(){const remaining=document.querySelectorAll('#clsBank .wb-item').length;if(remaining>0){fb('fbCls','Mueve todas las palabras a las columnas primero.',false);return;}const group=classGroups[currentClassGroupIdx];let allOk=true;document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{const inLeft=el.parentElement.id==='items-left';const expectedType=inLeft?group.colA:group.colB;if(el.dataset.t===expectedType){el.classList.add('cls-ok');}else{el.classList.add('cls-no');allOk=false;}});if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);}if(allOk){fb('fbCls','¡Perfecto! +5 XP',true);sfx('fan');fin('s-clasifica');unlockAchievement('clasif_pro');}else{fb('fbCls','Hay errores. Marcados en rojo.',false);sfx('no');}}
function nextClassGroup(){sfx('click');currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length;buildClass();document.getElementById('fbCls').classList.remove('show');showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]);}
function resetClass(){sfx('click');buildClass();document.getElementById('fbCls').classList.remove('show');}

// ===================== IDENTIFICAR =====================
let idData=[
  {s:['El','robot','percibe,','decide','y','actúa.'],c:1,art:'La máquina que cumple el ciclo completo'},
  {s:['Los','sensores','son','los','sentidos','del','robot.'],c:1,art:'La parte del robot que percibe'},
  {s:['El','controlador','es','el','cerebro','del','robot.'],c:1,art:'La parte del robot que decide'},
  {s:['Los','actuadores','son','los','músculos','del','robot.'],c:1,art:'La parte del robot que actúa'},
  {s:['El','robot','obedece','su','programa','paso','a','paso.'],c:4,art:'La lista de instrucciones del robot'},
  {s:['El','dron','revisa','los','cultivos','de','café.'],c:1,art:'El robot volador de los cafetales'},
  {s:['La','batería','da','energía','al','robot.'],c:1,art:'La fuente que da vida al robot'},
  {s:['La','aspiradora','robot','detecta','obstáculos','con','sensores.'],c:6,art:'La parte con la que la aspiradora percibe'},
];
let idIdx=0,idDone=false;
function showId(){idDone=false;if(idIdx>=idData.length){document.getElementById('idSent').innerHTML='🎉 ¡Completado!';fin('s-identifica');unlockAchievement('id_master');return;}const d=idData[idIdx];document.getElementById('idProg').textContent=`Oración ${idIdx+1} de ${idData.length}`;document.getElementById('idInfo').textContent=`Busca: ${d.art}`;const sent=document.getElementById('idSent');sent.innerHTML='';d.s.forEach((w,i)=>{const span=document.createElement('span');span.className='id-word';span.textContent=w+' ';span.onclick=()=>checkId(i,span);sent.appendChild(span);});}
function checkId(i,span){if(idDone)return;document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected'));span.classList.add('selected');if(i===idData[idIdx].c){idDone=true;span.classList.add('id-ok');fb('fbId','¡Correcto! +5 XP',true);if(!xpTracker.id.has(idIdx)){xpTracker.id.add(idIdx);pts(5);}sfx('ok');}else{span.classList.add('id-no');fb('fbId','Ese no es el término solicitado.',false);sfx('no');}}
function nextId(){sfx('click');idIdx++;showId();document.getElementById('fbId').classList.remove('show');}
function resetId(){sfx('click');idIdx=0;showId();document.getElementById('fbId').classList.remove('show');}

// ===================== COMPLETA =====================
let cmpData=[
  {s:'Un robot es una máquina que percibe, ___ y actúa.',opts:['decide','duerme','come'],c:0},
  {s:'Los sensores del robot funcionan como los ___ del cuerpo.',opts:['huesos','sentidos','dientes'],c:1},
  {s:'El controlador del robot es como el ___ humano.',opts:['pie','corazón','cerebro'],c:2},
  {s:'Los actuadores del robot son como los ___ del cuerpo.',opts:['músculos','ojos','oídos'],c:0},
  {s:'El robot sigue las instrucciones de su ___.',opts:['cuaderno','programa','maestro'],c:1},
  {s:'La ___ no es un robot porque no decide sola.',opts:['licuadora','aspiradora robot','puerta automática'],c:0},
  {s:'El ___ es un robot volador que revisa cultivos.',opts:['martillo','televisor','dron'],c:2},
  {s:'La energía del robot viene de su ___.',opts:['batería','sombra','antena'],c:0},
];
let cmpIdx=0,cmpSel=-1,cmpDone=false;
function showCmp(){if(cmpIdx>=cmpData.length){document.getElementById('cmpSent').innerHTML='🎉 ¡Completado!';document.getElementById('cmpOpts').innerHTML='';fin('s-completa');return;}const d=cmpData[cmpIdx];document.getElementById('cmpProg').textContent=`Oración ${cmpIdx+1} de ${cmpData.length}`;document.getElementById('cmpSent').innerHTML=d.s.replace('___','<span class="blank">___</span>');const opts=document.getElementById('cmpOpts');opts.innerHTML='';cmpSel=-1;cmpDone=false;d.opts.forEach((o,i)=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=o;b.onclick=()=>{if(cmpDone)return;document.querySelectorAll('.cmp-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');cmpSel=i;sfx('click');};opts.appendChild(b);});}
function checkCmp(){if(cmpSel<0)return fb('fbCmp','Selecciona una opción.',false);cmpDone=true;const opts=document.querySelectorAll('.cmp-opt');if(cmpSel===cmpData[cmpIdx].c){opts[cmpSel].classList.add('correct');document.getElementById('cmpSent').innerHTML=cmpData[cmpIdx].s.replace('___',`<span class="blank" style="color:var(--jade);border-color:var(--jade)">${opts[cmpSel].textContent}</span>`);fb('fbCmp','¡Correcto! +5 XP',true);if(!xpTracker.cmp.has(cmpIdx)){xpTracker.cmp.add(cmpIdx);pts(5);}sfx('ok');}else{opts[cmpSel].classList.add('wrong');opts[cmpData[cmpIdx].c].classList.add('correct');fb('fbCmp','Incorrecto. Revisa bien la respuesta.',false);sfx('no');}setTimeout(()=>{cmpIdx++;document.getElementById('fbCmp').classList.remove('show');showCmp();},1600);}

// ===================== WIDGETS =====================
// Widget 1: Percibe-Decide-Actúa (ordenar el ciclo en casos concretos)
let routeSets=[
  {label:'La aspiradora robot limpia la sala',steps:['El sensor detecta un obstáculo adelante','El controlador decide girar a la derecha','Los motores giran las ruedas hacia el lado libre','La aspiradora sigue limpiando por el camino libre']},
  {label:'El robot que riega la huerta',steps:['El sensor de humedad mide que la tierra está seca','El controlador decide abrir el agua','El actuador abre la válvula y riega','El sensor detecta tierra húmeda y el controlador cierra el agua']},
  {label:'El carrito seguidor de línea',steps:['El sensor de luz ve la línea negra del piso','El controlador compara: ¿estoy sobre la línea?','Decide corregir el rumbo hacia la izquierda','Los motores mueven las ruedas','El carrito sigue avanzando sobre la línea']},
];
let currentRouteIdx=0,routeItems=[];
function buildRoute(){routeItems=_shuffle([...routeSets[currentRouteIdx].steps]);renderRoute();const fbEl=document.getElementById('fbRoute');if(fbEl)fbEl.classList.remove('show');}
function renderRoute(){const list=document.getElementById('routeList');if(!list)return;list.innerHTML='';routeItems.forEach((step,i)=>{const div=document.createElement('div');div.className='sort-item';div.innerHTML=`<div class="sort-arrows"><button class="sort-arrow" onclick="routeMove(${i},-1)"${i===0?' disabled':''}>▲</button><button class="sort-arrow" onclick="routeMove(${i},1)"${i===routeItems.length-1?' disabled':''}>▼</button></div><div class="sort-step-num">${i+1}.</div><div class="sort-item-txt">${step}</div>`;list.appendChild(div);});}
function routeMove(idx,dir){sfx('click');const ni=idx+dir;if(ni<0||ni>=routeItems.length)return;[routeItems[idx],routeItems[ni]]=[routeItems[ni],routeItems[idx]];renderRoute();}
function checkRoute(){const correct=routeSets[currentRouteIdx].steps;const isOk=routeItems.every((s,i)=>s===correct[i]);if(isOk){fb('fbRoute','¡Perfecto! Orden correcto. +4 XP',true);if(!xpTracker.wgt.has('route_'+currentRouteIdx)){xpTracker.wgt.add('route_'+currentRouteIdx);pts(4);}sfx('fan');fin('s-widgets');unlockAchievement('widgets_master');}else{fb('fbRoute','Hay pasos fuera de orden. Recuerda: percibir → decidir → actuar.',false);sfx('no');}}
function nextRoute(){sfx('click');currentRouteIdx=(currentRouteIdx+1)%routeSets.length;buildRoute();showToast('🔄 Caso: '+routeSets[currentRouteIdx].label);}

// Widget 2: ¿Qué sensor necesita?
let neuronPartes=[
  {desc:'Un robot que se detiene antes de chocar con la pared',ans:'Sensor de distancia',opts:['Sensor de distancia','Sensor de luz','Sensor de sonido','Sensor de temperatura']},
  {desc:'Un robot que enciende la lámpara cuando oscurece',ans:'Sensor de luz',opts:['Sensor de luz','Sensor de tacto','Sensor de distancia','Sensor de humedad']},
  {desc:'Un robot de juguete que arranca cuando aplaudes',ans:'Sensor de sonido',opts:['Sensor de sonido','Sensor de luz','Sensor de temperatura','Sensor de distancia']},
  {desc:'Un robot que avisa si la incubadora de pollitos se enfría',ans:'Sensor de temperatura',opts:['Sensor de temperatura','Sensor de sonido','Sensor de tacto','Sensor de luz']},
  {desc:'Un robot que sabe cuándo alguien presiona su botón',ans:'Sensor de tacto',opts:['Sensor de tacto','Sensor de distancia','Sensor de humedad','Sensor de sonido']},
  {desc:'Un robot que riega la huerta cuando la tierra está seca',ans:'Sensor de humedad',opts:['Sensor de humedad','Sensor de sonido','Sensor de tacto','Sensor de luz']},
  {desc:'Un carrito que sigue la línea negra pintada en el piso',ans:'Sensor de luz',opts:['Sensor de luz','Sensor de temperatura','Sensor de sonido','Sensor de humedad']},
  {desc:'Un dron que esquiva los árboles del cafetal',ans:'Sensor de distancia',opts:['Sensor de distancia','Sensor de humedad','Sensor de tacto','Sensor de sonido']},
];
let neuronIdx=0,neuronDone=false;
function showNeuron(){neuronDone=false;if(neuronIdx>=neuronPartes.length){const el=document.getElementById('neuronDesc');if(el)el.textContent='🎉 ¡Eres todo un técnico de sensores!';const opts=document.getElementById('neuronOpts');if(opts)opts.innerHTML='';fin('s-widgets');return;}const d=neuronPartes[neuronIdx];const prog=document.getElementById('neuronProg');if(prog)prog.textContent=`Pista ${neuronIdx+1} de ${neuronPartes.length}`;const desc=document.getElementById('neuronDesc');if(desc)desc.textContent=d.desc;const opts=document.getElementById('neuronOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=opt;b.onclick=()=>checkNeuron(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuron');if(fbEl)fbEl.classList.remove('show');}
function checkNeuron(opt,btn,d){if(neuronDone)return;neuronDone=true;document.querySelectorAll('#neuronOpts .cmp-opt').forEach(b=>{if(b.textContent===d.ans)b.classList.add('correct');else if(b===btn&&b.textContent!==d.ans)b.classList.add('wrong');});const isOk=opt===d.ans;if(isOk){fb('fbNeuron','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuron_'+neuronIdx)){xpTracker.wgt.add('neuron_'+neuronIdx);pts(3);}sfx('ok');}else{fb('fbNeuron','La respuesta correcta es: '+d.ans,false);sfx('no');}}
function nextNeuron(){sfx('click');neuronIdx++;showNeuron();}
function resetNeuron(){sfx('click');neuronIdx=0;showNeuron();}

// Widget 3: Parte → Función
let neuroPairs=[
  {trans:'Sensor',func:'Capta información: luz, sonido, distancia, tacto',opts:['Capta información: luz, sonido, distancia, tacto','Ejecuta la acción con motores','Guarda la batería del robot','Es la lista de instrucciones']},
  {trans:'Controlador',func:'Recibe la información y decide según el programa',opts:['Recibe la información y decide según el programa','Capta la luz y el sonido','Mueve las ruedas del robot','Le da color al robot']},
  {trans:'Actuador',func:'Ejecuta la acción: motores, ruedas, brazos, luces',opts:['Ejecuta la acción: motores, ruedas, brazos, luces','Decide qué hacer','Mide la temperatura','Escribe el programa']},
  {trans:'Programa',func:'Lista de instrucciones exactas paso a paso',opts:['Lista de instrucciones exactas paso a paso','La batería del robot','El brazo mecánico','El sensor de luz']},
  {trans:'Batería',func:'Da la energía que hace funcionar todo el robot',opts:['Da la energía que hace funcionar todo el robot','Percibe los obstáculos','Decide la ruta','Cose la tela en la maquila']},
];
let neuroIdx=0,neuroDone=false;
function showNeuro(){neuroDone=false;if(neuroIdx>=neuroPairs.length){const el=document.getElementById('neuroTrans');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('neuroOpts');if(opts)opts.innerHTML='';return;}const d=neuroPairs[neuroIdx];const prog=document.getElementById('neuroProg');if(prog)prog.textContent=`${neuroIdx+1} de ${neuroPairs.length}`;const trans=document.getElementById('neuroTrans');if(trans)trans.textContent=d.trans;const opts=document.getElementById('neuroOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkNeuro(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuro');if(fbEl)fbEl.classList.remove('show');}
function checkNeuro(opt,btn,d){if(neuroDone)return;neuroDone=true;document.querySelectorAll('#neuroOpts .qz-opt').forEach(b=>{if(b.textContent===d.func)b.classList.add('correct');else if(b===btn&&b.textContent!==d.func)b.classList.add('wrong');});const isOk=opt===d.func;if(isOk){fb('fbNeuro','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuro_'+neuroIdx)){xpTracker.wgt.add('neuro_'+neuroIdx);pts(3);}sfx('ok');}else{fb('fbNeuro','Correcto: '+d.func,false);sfx('no');}setTimeout(()=>{neuroIdx++;showNeuro();},1800);}
function resetNeuro(){sfx('click');neuroIdx=0;showNeuro();}

// Widget 4: ¿Robot o no es robot?
let enfermedadData=[
  {disease:'La aspiradora que detecta obstáculos y elige su ruta',characteristic:'Es un robot',opts:['Es un robot','No es robot']},
  {disease:'El martillo',characteristic:'No es robot',opts:['No es robot','Es un robot']},
  {disease:'El dron que revisa el cafetal y esquiva los árboles',characteristic:'Es un robot',opts:['Es un robot','No es robot']},
  {disease:'La licuadora',characteristic:'No es robot',opts:['No es robot','Es un robot']},
  {disease:'El brazo de la maquila que cose siguiendo su programa',characteristic:'Es un robot',opts:['Es un robot','No es robot']},
  {disease:'La plancha',characteristic:'No es robot',opts:['No es robot','Es un robot']},
];
let enferIdx=0,enferDone=false;
function showEnfer(){enferDone=false;if(enferIdx>=enfermedadData.length){const el=document.getElementById('enferDisease');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('enferOpts');if(opts)opts.innerHTML='';return;}const d=enfermedadData[enferIdx];const prog=document.getElementById('enferProg');if(prog)prog.textContent=`${enferIdx+1} de ${enfermedadData.length}`;const dis=document.getElementById('enferDisease');if(dis)dis.textContent=d.disease;const opts=document.getElementById('enferOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkEnfer(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbEnfer');if(fbEl)fbEl.classList.remove('show');}
function checkEnfer(opt,btn,d){if(enferDone)return;enferDone=true;document.querySelectorAll('#enferOpts .qz-opt').forEach(b=>{if(b.textContent===d.characteristic)b.classList.add('correct');else if(b===btn&&b.textContent!==d.characteristic)b.classList.add('wrong');});const isOk=opt===d.characteristic;if(isOk){fb('fbEnfer','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('enfer_'+enferIdx)){xpTracker.wgt.add('enfer_'+enferIdx);pts(3);}sfx('ok');}else{fb('fbEnfer','Correcto: '+d.characteristic+'. Pregúntate: ¿percibe?, ¿decide?, ¿actúa?',false);sfx('no');}setTimeout(()=>{enferIdx++;showEnfer();},1800);}
function resetEnfer(){sfx('click');enferIdx=0;showEnfer();}

// ===================== RETO FINAL =====================
let retoPairs=[
  {label:['Sensor','Actuador'],btnA:'📡 Sensor',btnB:'💪 Actuador',colA:'sen',colB:'act',
   words:[{w:'Cámara',t:'sen'},{w:'Motor',t:'act'},{w:'Micrófono',t:'sen'},{w:'Rueda',t:'act'},{w:'Sensor de tacto',t:'sen'},{w:'Bocina',t:'act'},{w:'Termómetro',t:'sen'},{w:'Brazo mecánico',t:'act'},{w:'Sensor de luz',t:'sen'},{w:'Luz LED',t:'act'}]},
  {label:['Es un robot','No es robot'],btnA:'🤖 Es un robot',btnB:'🚫 No es robot',colA:'rob',colB:'no',
   words:[{w:'Aspiradora robot',t:'rob'},{w:'Martillo',t:'no'},{w:'Dron',t:'rob'},{w:'Licuadora',t:'no'},{w:'Brazo de maquila',t:'rob'},{w:'Tijeras',t:'no'},{w:'Humanoide',t:'rob'},{w:'Bicicleta',t:'no'},{w:'Robot de cirugía',t:'rob'},{w:'Plancha',t:'no'}]},
  {label:['Percibe','Actúa'],btnA:'👀 Percibe',btnB:'⚙️ Actúa',colA:'per',colB:'act',
   words:[{w:'Ver la línea',t:'per'},{w:'Girar la rueda',t:'act'},{w:'Medir el calor',t:'per'},{w:'Encender la luz',t:'act'},{w:'Oír un aplauso',t:'per'},{w:'Mover el brazo',t:'act'},{w:'Detectar obstáculo',t:'per'},{w:'Sonar la bocina',t:'act'},{w:'Medir la humedad',t:'per'},{w:'Abrir la válvula',t:'act'}]},
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
let identifyTaskDB=[
  {s:'Un robot es una máquina que percibe, decide y actúa.',type:'Robot'},
  {s:'Los sensores captan luz, sonido, distancia o temperatura.',type:'Sensores'},
  {s:'El controlador es el cerebro que decide según el programa.',type:'Controlador'},
  {s:'Los actuadores son los motores y ruedas que ejecutan la acción.',type:'Actuadores'},
  {s:'El programa es la lista de instrucciones exactas del robot.',type:'Programa'},
  {s:'La batería da la energía que hace funcionar al robot.',type:'Energía'},
  {s:'El dron revisa los cultivos de café desde el aire.',type:'Dron'},
  {s:'La aspiradora robot detecta obstáculos y elige su ruta sola.',type:'Aspiradora robot'},
  {s:'El brazo robótico de la maquila cose siguiendo su programa.',type:'Robot industrial'},
  {s:'El martillo no percibe ni decide: es una máquina simple.',type:'Máquina simple'},
];
let classifyTaskDB=[
  {w:'Aspiradora robot',gen:'Sí, es robot',n:'Sí: detecta obstáculos y suciedad',g:'Sí: elige su ruta sola',t:'Sí: mueve ruedas y cepillos'},
  {w:'Licuadora',gen:'No es robot',n:'No: no capta nada de su entorno',g:'No: la enciende una persona',t:'Sí: gira sus cuchillas'},
  {w:'Martillo',gen:'No es robot (máquina simple)',n:'No percibe nada',g:'No decide nada',t:'No: lo mueve la mano de la persona'},
  {w:'Dron agrícola',gen:'Sí, es robot',n:'Sí: cámara y GPS',g:'Sí: sigue su plan de vuelo y esquiva obstáculos',t:'Sí: vuela con sus hélices'},
  {w:'Brazo de maquila',gen:'Sí, es robot',n:'Sí: sensores de posición',g:'Sí: sigue su programa de costura o corte',t:'Sí: mueve el brazo y la herramienta'},
  {w:'Plancha',gen:'No es robot',n:'Solo la temperatura (termostato)',g:'No: una persona la usa y la mueve',t:'Sí: calienta la ropa'},
  {w:'Televisor',gen:'No es robot',n:'Solo las órdenes del control remoto',g:'No: obedece a la persona',t:'Sí: muestra imagen y sonido'},
  {w:'Puerta automática',gen:'Sí, es un robot sencillo',n:'Sí: sensor de movimiento',g:'Sí: decide abrir cuando alguien llega',t:'Sí: su motor desliza la puerta'},
];
let completeTaskDB=[
  {s:'Un robot percibe, ___ y actúa.',opts:['decide','duerme','pinta'],ans:'decide'},
  {s:'Los sensores son los ___ del robot.',opts:['sentidos','músculos','zapatos'],ans:'sentidos'},
  {s:'El controlador funciona como el ___ del cuerpo.',opts:['cerebro','pie','codo'],ans:'cerebro'},
  {s:'Los actuadores funcionan como los ___ del cuerpo.',opts:['músculos','ojos','dientes'],ans:'músculos'},
  {s:'El robot obedece su ___ paso a paso.',opts:['programa','cuaderno','sombrero'],ans:'programa'},
  {s:'El ___ es un robot volador.',opts:['dron','martillo','ventilador'],ans:'dron'},
  {s:'La energía del robot viene de la ___.',opts:['batería','lluvia','arena'],ans:'batería'},
  {s:'La licuadora no es robot porque no ___ sola.',opts:['decide','gira','suena'],ans:'decide'},
];
let explainQuestions=[
  {q:'¿Qué es un robot? Explica el ciclo percibir → decidir → actuar con un ejemplo de tu casa o comunidad.',ans:'Un robot es una máquina que percibe con sensores, decide con su controlador (según un programa) y actúa con actuadores. Ejemplo: la aspiradora robot percibe un obstáculo, decide girar y actúa moviendo sus ruedas.'},
  {q:'Escribe la analogía cuerpo ↔ robot: ¿a qué se parecen los sensores, el controlador y los actuadores?',ans:'Los sensores son como los sentidos (ojos, oídos, piel), el controlador es como el cerebro que decide, y los actuadores son como los músculos que ejecutan el movimiento. Igual que en tu cuerpo: receptor → cerebro → efector.'},
  {q:'Inventa un robot para un problema de tu pueblo o aldea: dibújalo en tu cuaderno y nombra sus 3 partes.',ans:'Respuesta libre. Debe nombrar sensores (qué percibe), controlador (qué decide: «si pasa X, hace Y») y actuadores (cómo actúa), unidos en el ciclo percibir → decidir → actuar.'},
  {q:'¿Por qué la licuadora NO es un robot y la aspiradora robot SÍ lo es?',ans:'La licuadora solo actúa cuando una persona la enciende: no percibe su entorno ni decide nada sola. La aspiradora robot cumple el ciclo completo: percibe obstáculos con sensores, decide su ruta con su controlador y actúa con sus motores.'},
  {q:'Escoge 5 máquinas de tu casa y clasifícalas: ¿robot o no robot? Explica cada una.',ans:'Respuesta libre. Para cada máquina debe preguntarse: ¿percibe con sensores?, ¿decide sola?, ¿actúa? Solo es robot la que cumple las tres (la mayoría de electrodomésticos solo actúan).'},
];
let ansVisible=false;
function genTask(){sfx('click');const type=document.getElementById('tgType').value;const count=parseInt(document.getElementById('tgCount').value);ansVisible=false;const out=document.getElementById('tgOut');out.innerHTML='';if(type==='identify')genIdentifyTask(out,count);else if(type==='classify')genClassifyTask(out,count);else if(type==='complete')genCompleteTask(out,count);else if(type==='explain')genExplainTask(out,count);fin('s-tareas');}
function _instrBlock(out,title,lines){const ib=document.createElement('div');ib.className='tg-instruction-block';ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join('');out.appendChild(ib);}
function genIdentifyTask(out,count){_instrBlock(out,'Instrucción',['Copia en tu cuaderno; subraya, colorea o encierra el concepto de robótica indicado en cada oración. Escribe al lado qué parte o tipo de robot es.','<strong>Ejemplo:</strong> Los sensores captan luz y distancia. → <span style="color:var(--jade);font-weight:700;">Sensores</span>']);_pick(identifyTaskDB,Math.min(count,identifyTaskDB.length)).forEach((item,i)=>{const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.type}</div></div>`;out.appendChild(div);});}
function genClassifyTask(out,count){_instrBlock(out,'Instrucción',['Copia la siguiente tabla en tu cuaderno. Para cada máquina responde: ¿es robot?, ¿percibe?, ¿decide?, ¿actúa? Explica con tus palabras.']);const items=_pick(classifyTaskDB,Math.min(count,classifyTaskDB.length));const wrap=document.createElement('div');wrap.style.overflowX='auto';const th=(t,extra='')=>`<th style="padding:0.3rem 0.4rem;border:1px solid var(--border);font-size:0.72rem;text-align:center;${extra}">${t}</th>`;let html=`<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:520px;"><thead><tr style="background:var(--pri-gl);">${th('Máquina','text-align:left;')}${th('¿Es robot?')}${th('¿Percibe?')}${th('¿Decide?')}${th('¿Actúa?')}</tr></thead><tbody>`;items.forEach(it=>{html+=`<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td>`+Array(4).fill(`<td style="padding:0.4rem;border:1px solid var(--border);min-width:50px;"></td>`).join('')+'</tr>';});html+='</tbody></table>';wrap.innerHTML=html;out.appendChild(wrap);const ans=document.createElement('div');ans.className='tg-answer';ans.style.marginTop='0.8rem';ans.innerHTML='<strong>✅ Respuestas:</strong><br>'+items.map(it=>`<strong>${it.w}:</strong> ¿Es robot?: ${it.gen} | ¿Percibe?: ${it.n} | ¿Decide?: ${it.g} | ¿Actúa?: ${it.t}`).join('<br>');out.appendChild(ans);}
function genCompleteTask(out,count){_instrBlock(out,'Instrucción',['Copia y resuelve en tu cuaderno. Cada oración tiene un espacio ___. Elige y escribe la opción correcta.']);const pool=_shuffle([...completeTaskDB]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';const sent=item.s.replace('___','<span class="tg-blank" style="min-width:90px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${sent}</strong><div style="margin-top:0.4rem;font-size:0.82rem;color:var(--gray);">📝 Opciones: <strong>${item.opts.join(' | ')}</strong></div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function genExplainTask(out,count){_instrBlock(out,'Instrucción',['Copia las siguientes preguntas en tu cuaderno y responde cada una de forma clara y completa. Puedes acompañarlas con dibujos.']);const pool=_shuffle([...explainQuestions]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.3rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function toggleAns(){ansVisible=!ansVisible;document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none');sfx('click');}

// ===================== SOPA DE LETRAS =====================
let sopaSets=[
  {size:10,grid:[
    ['L','T','T','P','L','H','D','Y','U','C'],
    ['N','J','O','O','S','R','C','O','G','U'],
    ['D','R','B','Z','P','X','E','K','V','Z'],
    ['S','W','O','R','A','A','R','R','I','T'],
    ['P','E','R','T','R','R','E','L','U','L'],
    ['K','K','N','A','O','D','B','B','N','C'],
    ['U','O','N','S','U','M','R','D','R','F'],
    ['H','N','E','Z','O','P','O','M','L','F'],
    ['I','A','C','M','O','R','D','R','O','N'],
    ['S','E','H','K','E','V','M','N','L','G']
  ],words:[
    {w:'ROBOT',cells:[[4,2],[3,2],[2,2],[1,2],[0,2]]},
    {w:'SENSOR',cells:[[3,0],[4,1],[5,2],[6,3],[7,4],[8,5]]},
    {w:'MOTOR',cells:[[6,5],[5,4],[4,3],[3,2],[2,1]]},
    {w:'CEREBRO',cells:[[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6]]},
    {w:'DRON',cells:[[8,6],[8,7],[8,8],[8,9]]},
    {w:'BRAZO',cells:[[5,6],[4,5],[3,4],[2,3],[1,2]]}
  ]},
  {size:10,grid:[
    ['A','E','N','E','R','G','I','A','U','L'],
    ['C','A','J','O','C','K','A','A','J','N'],
    ['T','M','S','E','X','D','N','S','D','L'],
    ['U','A','A','B','D','T','I','H','E','Z'],
    ['A','R','A','I','K','O','U','H','C','P'],
    ['D','G','H','C','S','Q','Q','C','I','L'],
    ['O','O','U','R','B','X','A','L','D','Y'],
    ['R','R','Y','E','P','R','M','N','E','J'],
    ['Q','P','U','P','J','M','R','Z','O','Q'],
    ['A','P','S','R','R','R','T','L','O','K']
  ],words:[
    {w:'ACTUADOR',cells:[[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]]},
    {w:'PROGRAMA',cells:[[8,1],[7,1],[6,1],[5,1],[4,1],[3,1],[2,1],[1,1]]},
    {w:'PERCIBE',cells:[[8,3],[7,3],[6,3],[5,3],[4,3],[3,3],[2,3]]},
    {w:'DECIDE',cells:[[2,8],[3,8],[4,8],[5,8],[6,8],[7,8]]},
    {w:'ENERGIA',cells:[[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7]]},
    {w:'MAQUINA',cells:[[7,6],[6,6],[5,6],[4,6],[3,6],[2,6],[1,6]]}
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
function sopaLinterna(){
  sfx('click');
  if(xp<2){ showToast('⚠️ Necesitas al menos 2 XP para usar la linterna.'); return; }
  const set=sopaSets[currentSopaSetIdx];
  const pend=set.words.filter(wObj=>!sopaFoundWords.has(wObj.w));
  if(pend.length===0){ showToast('🎉 ¡Ya encontraste todas las palabras!'); return; }
  pts(-2);
  const cells=[];
  pend.forEach(wObj=>wObj.cells.forEach(([r,c])=>{ const el=document.querySelector(`#sopaGrid [data-row="${r}"][data-col="${c}"]`); if(el){ el.classList.add('sopa-peek'); cells.push(el); } }));
  showToast('🔦 ¡Linterna encendida 3 segundos! (-2 XP)');
  setTimeout(()=>cells.forEach(el=>el.classList.remove('sopa-peek')),3000);
}
let _sopaResizeTimer=null;
window.addEventListener('resize',()=>{clearTimeout(_sopaResizeTimer);_sopaResizeTimer=setTimeout(()=>{if(document.getElementById('s-sopa').classList.contains('active'))buildSopa();},200);});

// ===================== EVALUACIÓN FINAL =====================
let evalTFBank=[
  {q:'Un robot percibe, decide y actúa.',a:true},
  {q:'El martillo es un robot porque actúa.',a:false},
  {q:'Los sensores son los «sentidos» del robot.',a:true},
  {q:'El controlador del robot funciona como el cerebro.',a:true},
  {q:'Los actuadores del robot funcionan como los sentidos.',a:false},
  {q:'La licuadora es un robot porque se mueve.',a:false},
  {q:'La aspiradora robot percibe, decide y actúa.',a:true},
  {q:'Los robots piensan y sienten igual que las personas.',a:false},
  {q:'El programa es la lista de instrucciones que sigue el robot.',a:true},
  {q:'Un dron puede revisar los cultivos de café desde el aire.',a:true},
  {q:'La energía del robot puede venir de una batería.',a:true},
  {q:'Una máquina simple, como la palanca, tiene sensores.',a:false},
  {q:'En las maquilas hay brazos robóticos que cosen y cortan.',a:true},
  {q:'El ciclo del robot es: actuar → decidir → percibir.',a:false},
  {q:'Sin programa, el controlador no sabe qué decidir.',a:true},
];
let evalMCBank=[
  {q:'¿Qué es un robot?',o:['a) Cualquier máquina de metal','b) Una máquina que percibe, decide y actúa','c) Un juguete con luces','d) Una computadora con pantalla'],a:1},
  {q:'¿Qué parte del robot funciona como sus «sentidos»?',o:['a) Los actuadores','b) Los sensores','c) Las ruedas','d) La batería'],a:1},
  {q:'¿Cuál de estas máquinas es un robot?',o:['a) El martillo','b) La licuadora','c) La aspiradora que detecta obstáculos y decide su ruta sola','d) La bicicleta'],a:2},
  {q:'¿Qué parte del robot decide qué hacer?',o:['a) El controlador','b) El motor','c) La bocina','d) La rueda'],a:0},
  {q:'¿Qué parte del robot son sus «músculos»?',o:['a) Los sensores','b) El programa','c) La antena','d) Los actuadores'],a:3},
  {q:'¿Cuál es el orden del ciclo del robot?',o:['a) Actuar → percibir → decidir','b) Percibir → decidir → actuar','c) Decidir → actuar → percibir','d) Percibir → actuar → decidir'],a:1},
  {q:'¿Por qué el martillo NO es un robot?',o:['a) Porque es pequeño','b) Porque es de metal','c) Porque no percibe ni decide','d) Porque no tiene luces'],a:2},
  {q:'¿Por qué la licuadora NO es un robot?',o:['a) Porque actúa pero no decide sola','b) Porque no gira','c) Porque es de cocina','d) Porque gasta electricidad'],a:0},
  {q:'¿Qué sensor necesita un robot que se detiene ante un obstáculo?',o:['a) De temperatura','b) De humedad','c) De sonido','d) De distancia'],a:3},
  {q:'¿Qué robot revisa los cultivos de café en Honduras?',o:['a) El dron','b) El humanoide','c) La aspiradora robot','d) El robot de cirugía'],a:0},
  {q:'¿Qué hacen los brazos robóticos en la maquila?',o:['a) Piensan por los obreros','b) Cosen y cortan siguiendo un programa','c) Venden la ropa','d) Diseñan la moda'],a:1},
  {q:'¿Qué es el programa de un robot?',o:['a) Un canal de televisión','b) Su batería interna','c) La lista de instrucciones que obedece paso a paso','d) Su caja de metal'],a:2},
  {q:'¿Cómo «piensan» los robots?',o:['a) Igual que las personas','b) Siguen las instrucciones de su programa','c) Adivinan qué hacer','d) Sueñan las respuestas'],a:1},
  {q:'¿Cuál es un robot con forma de persona?',o:['a) El dron','b) El brazo industrial','c) La aspiradora robot','d) El humanoide'],a:3},
  {q:'¿De dónde obtiene su energía un robot?',o:['a) De la batería o la electricidad','b) De la comida','c) Del agua que bebe','d) Del aire'],a:0},
];
let evalCPBank=[
  {q:'Un robot percibe, ___ y actúa.',a:'decide'},
  {q:'Los sensores son los ___ del robot.',a:'sentidos'},
  {q:'El controlador funciona como el ___ del cuerpo.',a:'cerebro'},
  {q:'Los actuadores funcionan como los ___ del cuerpo.',a:'músculos'},
  {q:'El robot sigue las instrucciones de su ___.',a:'programa'},
  {q:'El ciclo del robot es percibir, decidir y ___.',a:'actuar'},
  {q:'El ___ es un robot volador que revisa cultivos.',a:'dron'},
  {q:'La energía del robot viene de la ___.',a:'batería'},
  {q:'El motor y la rueda son ejemplos de ___.',a:'actuadores'},
  {q:'La cámara del robot es un ejemplo de ___.',a:'sensor'},
  {q:'En las maquilas cosen y cortan los brazos ___.',a:'robóticos'},
  {q:'El martillo no es robot: es una máquina ___.',a:'simple'},
  {q:'Un robot con forma de persona es un ___.',a:'humanoide'},
  {q:'El sensor de ___ mide si la tierra está seca.',a:'humedad'},
  {q:'El robot que limpia el piso y evita obstáculos es la ___ robot.',a:'aspiradora'},
];
let evalPRBank=[
  {term:'Robot',def:'Máquina que percibe, decide y actúa'},
  {term:'Sensor',def:'Capta luz, sonido, distancia o temperatura'},
  {term:'Controlador',def:'El «cerebro» que decide según el programa'},
  {term:'Actuador',def:'Motor, rueda o brazo que ejecuta la acción'},
  {term:'Programa',def:'Lista de instrucciones paso a paso'},
  {term:'Energía',def:'Batería o electricidad que da vida al robot'},
  {term:'Dron',def:'Robot volador; revisa cultivos desde el aire'},
  {term:'Humanoide',def:'Robot con forma de persona'},
  {term:'Máquina simple',def:'No percibe ni decide, como el martillo'},
  {term:'Electrodoméstico',def:'Actúa al encenderlo, pero no decide solo'},
  {term:'Ciclo del robot',def:'Percibir → decidir → actuar'},
  {term:'Robot industrial',def:'Brazo que cose o corta en la maquila'},
  {term:'Sensor de distancia',def:'Evita que el robot choque con obstáculos'},
  {term:'Aspiradora robot',def:'Limpia sola: detecta y elige su ruta'},
  {term:'Robótica',def:'Ciencia que estudia y construye robots'},
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

function genEval(){sfx('click');_evalFormaSelector(); const _selF = document.getElementById('evalFormaSel'); if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10))); const cf = evalFormNum; const rng = _evalRng(cf); window._currentEvalForm=cf;evalFormNum = (evalFormNum % EVAL_FORMAS) + 1; _evalFormaSelector();saveProgress();document.getElementById('eval-screen-title').textContent=`🎓 Evaluación Final · Forma ${cf} · ¿Qué es un Robot?`;evalAnsVisible=false;const out=document.getElementById('evalOut');out.innerHTML='';const bar=document.createElement('div');bar.className='eval-score-bar';bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje · 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25 pts</span><span class="eval-score-pill esp-tf">V/F 25 pts</span><span class="eval-score-pill esp-mc">Selección 25 pts</span><span class="eval-score-pill esp-pr">Pareados 25 pts</span></div>`;out.appendChild(bar);const cpItems=_pickF(evalCPBank,5, rng);const s1=document.createElement('div');s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';cpItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='cp';d.dataset.evalIndex=i;const qHtml=item.q.replace('___',`<input class="eval-cp-input" type="text" data-cp="${i}" autocomplete="off">`);d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbCp${i}" aria-live="polite"></div>`;s1.appendChild(d);});out.appendChild(s1);const tfItems=_pickF(evalTFBank,5, rng);const s2=document.createElement('div');s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';tfItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='tf';d.dataset.evalIndex=i;d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="true"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="false"> Falso</label></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbTf${i}" aria-live="polite"></div>`;s2.appendChild(d);});out.appendChild(s2);const mcItems=_pickF(evalMCBank,5, rng);const s3=document.createElement('div');s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';mcItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='mc';d.dataset.evalIndex=i;const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join('');d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbMc${i}" aria-live="polite"></div>`;s3.appendChild(d);});out.appendChild(s3);const prItems=_pickF(evalPRBank,5, rng);let shuffledDefs=_shuffleF(prItems, rng);let _prTries=0;while(shuffledDefs.some((df,ix)=>df.def===prItems[ix].def)&&_prTries<20){shuffledDefs=_shuffleF(shuffledDefs, rng);_prTries++;}const letters=['A','B','C','D','E'];const s4=document.createElement('div');s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';const matchCard=document.createElement('div');matchCard.className='eval-item';let colLeft='<div class="eval-match-col"><h4>📌 Términos</h4>';prItems.forEach((item,i)=>{colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> <select class="eval-match-select" data-pr="${i}" aria-label="Respuesta pareada ${i+16}"><option value="">—</option>${letters.map(l=>`<option value="${l}">${l}</option>`).join('')}</select> ${item.term}</div>`;});colLeft+='</div>';let colRight='<div class="eval-match-col"><h4>🔑 Definiciones</h4>';shuffledDefs.forEach((item,i)=>{colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`;});colRight+='</div>';const ansKey=prItems.map((item,i)=>{const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)];return`${i+16}→${letter}`;}).join(' · ');matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div><div class="eval-item-feedback" id="evalFbPr" aria-live="polite"></div>`;s4.appendChild(matchCard);out.appendChild(s4);window._evalPrintData={tf:tfItems,mc:mcItems,cp:cpItems,pr:{terms:prItems,shuffledDefs,letters}};const autoPanel=document.createElement('div');autoPanel.id='evalAutoResult';autoPanel.className='eval-auto-result';autoPanel.innerHTML='<strong>🧮 Evaluación interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato original sin respuestas digitadas.';out.appendChild(autoPanel);fin('s-evaluacion');}
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación ¿Qué es un Robot? · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.12rem 0.4rem;margin:0.22rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #0e7490;background:#ecfeff;color:#0e7490;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#0e7490;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #0e7490;height:12px;}.obt-pct{white-space:nowrap;}.qn{font-weight:700;min-width:22px;flex-shrink:0;}.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:40px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.18rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.14rem 0.35rem;margin-bottom:0.1rem;break-inside:avoid;page-break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.3;display:flex;gap:0.28rem;margin-bottom:0.07rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.1rem 0.5rem;}.mc-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:0.04rem 0.15rem;margin-left:0.8rem;}.mc-opt{font-size:9pt;display:flex;align-items:center;gap:0.15rem;}.mc-opt input{width:10px;height:10px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{margin-top:0.1rem;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.08rem 0.4rem;margin-top:0.08rem;}.pr-head{font-size:9pt;font-weight:700;color:#555;margin-bottom:0.1rem;}.pr-item{font-size:10.5pt;padding:0.1rem 0.28rem;background:#ecfeff;border-radius:3px;margin-bottom:0.07rem;display:flex;align-items:center;gap:0.2rem;line-height:1.2;break-inside:avoid;page-break-inside:avoid;}.pr-num{font-weight:700;color:#0e7490;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.22rem;padding:0.15rem 0;page-break-before:avoid;break-before:avoid;color:#0e7490;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #0e7490;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#555;}.pa{color:#007a00;font-weight:600;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · ¿Qué es un Robot? · Educación Básica · Robótica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Evaluación Final · ¿Qué es un Robot? · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u</div></div><div class="p-grid">${pR}</div>
  ${zgBlock}</div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("evalPage",252,0.55,1.45);fit("pautaPage",252,0.55,1.3);})();<\/script></body></html>`;const win=window.open('','_blank','');if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}win.document.write(typeof METAS_TR==='function'?METAS_TR(doc):doc);win.document.close();setTimeout(()=>win.print(),400);}

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
let critSensorBank=[
  {txt:'Un robot riega la huerta escolar solo cuando la tierra está seca.',ans:'Sensor de humedad: mide el agua de la tierra; si está seca, el controlador decide abrir el riego.'},
  {txt:'Un robot mensajero se detiene antes de chocar con una pared o una persona.',ans:'Sensor de distancia: mide qué tan cerca está el obstáculo; si está muy cerca, el controlador decide frenar.'},
  {txt:'Una lámpara robótica se enciende sola cuando llega la noche.',ans:'Sensor de luz: detecta que oscureció; el controlador decide encender la lámpara.'},
  {txt:'Un robot cuida la incubadora de pollitos y avisa si se enfría.',ans:'Sensor de temperatura: mide el calor; si baja demasiado, el controlador decide encender la alarma o el foco.'},
  {txt:'Un robot de juguete arranca cuando el niño aplaude dos veces.',ans:'Sensor de sonido: capta los aplausos; el controlador decide poner en marcha los motores.'},
  {txt:'Un carrito robótico sigue una línea negra pintada en el piso del aula.',ans:'Sensor de luz: distingue lo negro de lo claro en el piso; el controlador decide corregir el rumbo para no salirse.'},
];
let critErrorBank=[
  {txt:'"La licuadora es un robot porque se mueve."',
   g1:'Moverse (actuar) no basta para ser robot: la licuadora NO PERCIBE su entorno con sensores.',
   g2:'Tampoco DECIDE sola: una persona la enciende y la apaga. El robot cumple el ciclo completo percibir → decidir → actuar.'},
  {txt:'"Los sensores son los músculos del robot y los actuadores son sus sentidos."',
   g1:'Está al revés: los SENSORES son los «sentidos» del robot (perciben luz, sonido, distancia, temperatura).',
   g2:'Los ACTUADORES son los «músculos» (motores, ruedas, brazos) que ejecutan la acción.'},
  {txt:'"Los robots piensan y sienten igual que las personas."',
   g1:'Los robots NO piensan como personas: siguen las instrucciones de su PROGRAMA.',
   g2:'Tampoco sienten emociones: sus sensores solo miden datos (luz, distancia, calor) y el controlador decide según lo programado.'},
  {txt:'"El martillo es un robot porque es una máquina y trabaja mucho."',
   g1:'El martillo es una MÁQUINA SIMPLE: no tiene sensores ni programa, no percibe nada.',
   g2:'No decide ni actúa solo: toda la fuerza y la decisión las pone la persona que lo usa.'},
  {txt:'"Un robot no necesita programa: él solo sabe qué hacer."',
   g1:'Sin PROGRAMA el controlador no sabe qué decidir: el programa es su lista de instrucciones exactas.',
   g2:'Lo que parece «saber» del robot es trabajo de las personas que lo programaron paso a paso.'},
];
let critCicloQuestions=[
  '1. ¿Qué PERCIBE el robot y con qué sensor?',
  '2. ¿Qué DECIDE su controlador?',
  '3. ¿Cómo ACTÚA y con qué actuador?',
];
let critCicloBank=[
  {txt:'La aspiradora robot limpia la casa: cuando encuentra una silla la esquiva, y cuando su batería está baja regresa sola a cargarse.',
   p:'Percibe los obstáculos (sensor de distancia o de tacto) y el nivel de su propia batería.',
   d:'Decide esquivar la silla y, si la batería está baja, decide regresar al cargador.',
   a:'Actúa con sus motores y ruedas: gira, cambia de ruta y viaja hasta el cargador.'},
  {txt:'La puerta automática del supermercado se abre cuando una persona se acerca y se cierra cuando ya nadie pasa.',
   p:'Percibe a la persona con un sensor de movimiento o de distancia.',
   d:'Decide abrir cuando detecta a alguien cerca y cerrar cuando ya no hay nadie.',
   a:'Actúa con un motor (actuador) que desliza la puerta.'},
  {txt:'Un dron vuela sobre el cafetal: toma fotos de las plantas y, si detecta una zona enferma, avisa al agricultor.',
   p:'Percibe el cultivo con su cámara (sensor) y su posición con el GPS.',
   d:'Decide qué zona revisar y reconoce cuándo una zona se ve enferma.',
   a:'Actúa con sus hélices (motores) para volar y envía el aviso al teléfono del agricultor.'},
  {txt:'El robot de la huerta mide la tierra cada mañana; si está seca abre el agua y, cuando ya está húmeda, la cierra.',
   p:'Percibe la humedad de la tierra con su sensor de humedad.',
   d:'Decide abrir el agua si la tierra está seca y cerrarla cuando ya está húmeda.',
   a:'Actúa con una válvula o bomba (actuador) que deja pasar el agua.'},
  {txt:'En la maquila, un brazo robótico cose bolsillos: toma la tela, la coloca en su lugar exacto y cose la costura completa.',
   p:'Percibe la posición de la tela con sus sensores.',
   d:'Decide dónde colocar la tela y cuándo empezar y terminar la costura, según su programa.',
   a:'Actúa moviendo el brazo y la aguja (actuadores) para coser.'},
];
let critCompareBank=[
  {a:'Máquina que actúa cuando la enciendes, pero no elige nada sola (ejemplo: la licuadora).',b:'Máquina que percibe con sensores, decide con su programa y actúa sola (ejemplo: la aspiradora robot).',
   ga:'El electrodoméstico.',
   gb:'El robot.',
   gr:'Semejanza: los dos usan energía eléctrica y actúan. Diferencia: solo el robot percibe y decide; al electrodoméstico lo controla una persona.'},
  {a:'Parte del robot que capta información: luz, sonido, distancia, temperatura.',b:'Parte del robot que ejecuta la acción: motores, ruedas, brazos, luces.',
   ga:'El sensor.',
   gb:'El actuador.',
   gr:'Semejanza: los dos son partes del robot conectadas al controlador. Diferencia: el sensor mete información (percibe) y el actuador saca acción (actúa), como los sentidos y los músculos del cuerpo.'},
  {a:'Herramienta sin motor ni sensores: toda la fuerza la pone la persona (ejemplo: el martillo).',b:'Máquina que cumple el ciclo percibir → decidir → actuar (ejemplo: el dron).',
   ga:'La máquina simple.',
   gb:'El robot.',
   gr:'Semejanza: los dos ayudan a hacer trabajos. Diferencia: la máquina simple no percibe ni decide nada; el robot trabaja solo siguiendo su programa.'},
  {a:'Robot volador con cámara que revisa los cultivos de café desde el aire.',b:'Robot fijo de la maquila que cose y corta tela siguiendo su programa.',
   ga:'El dron.',
   gb:'El brazo robótico (robot industrial).',
   gr:'Semejanza: los dos son robots: perciben, deciden y actúan. Diferencia: el dron es móvil y vuela por el campo; el brazo industrial trabaja fijo en la fábrica.'},
];
let critDesignBank=[
  'En tu comunidad, la cosecha de café se pierde cuando llueve de repente y los granos están secándose en el patio.',
  'En invierno el río crece y los niños no saben si es seguro cruzar el vado para llegar a la escuela.',
  'La pulpería de la esquina necesita vigilancia de noche, cuando ya no hay nadie.',
  'En verano la huerta escolar se seca porque nadie llega a regarla los fines de semana.',
  'Los pájaros se comen el maíz de la milpa cuando nadie está cuidando.',
];
let critDesignGuide='Rúbrica de 3 criterios (total 20 pts) — ① SENSORES (7 pts): elige sensores adecuados al problema y explica qué perciben. ② CONTROLADOR (6 pts): escribe una decisión clara del tipo «si pasa X, entonces el robot hace Y». ③ ACTUADORES (7 pts): nombra con qué actúa el robot y la solución es realista para el problema. Cualquier diseño vale si las tres partes trabajan juntas en el ciclo percibir → decidir → actuar.';
function genEvalCrit(){
  sfx('click');
  _injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });
  const _sC = document.getElementById('evalCritFormaSel');
  if (_sC && parseInt(_sC.value, 10)) evalCritFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sC.value, 10)));
  const cf=evalCritFormNum;window._currentEvalCritForm=cf;const rngC = _evalRng(200000 + cf);evalCritFormNum=(evalCritFormNum%EVAL_FORMAS)+1;_injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });saveProgress();
  document.getElementById('evalcrit-screen-title').textContent=`🧠 Pensamiento Crítico · Forma ${cf} · ¿Qué es un Robot?`;
  evalCritAnsVisible=false;
  const out=document.getElementById('evalCritOut');out.innerHTML='';
  const sens=_pickF(critSensorBank,2,rngC);
  const s1=document.createElement('div');
  s1.innerHTML=`<div class="eval-section-title">I. ¿Qué sensor necesita? <span class="eval-pts">20 pts</span></div><div class="eval-item">${sens.map((k,i)=>`<div class="crit-scenario">Caso ${i+1}: ${k.txt}</div><div class="crit-q-block"><div class="crit-q-label">¿Qué sensor necesita este robot? Justifica tu elección: ¿qué percibe y para qué le sirve?</div><textarea class="crit-textarea" rows="2" aria-label="Sensor del caso ${i+1} y su justificación"></textarea><div class="crit-pauta">${k.ans}</div></div>`).join('')}<div class="crit-selfscore"><label for="critScore0">Obtenido:</label><input type="number" id="critScore0" class="crit-score-input" data-score="0" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s1);
  const err=_pickF(critErrorBank,1,rngC)[0];
  const s2=document.createElement('div');
  s2.innerHTML=`<div class="eval-section-title">II. Corrige el error conceptual <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${err.txt}</div><p style="font-size:0.85rem;margin-bottom:0.5rem;">Esta afirmación tiene <strong>dos errores</strong>. Corrígelos con argumentos, usando el ciclo percibir → decidir → actuar:</p><div class="crit-q-block"><div class="crit-q-label">Error 1 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 1 y su corrección"></textarea><div class="crit-pauta">${err.g1}</div></div><div class="crit-q-block"><div class="crit-q-label">Error 2 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 2 y su corrección"></textarea><div class="crit-pauta">${err.g2}</div></div><div class="crit-selfscore"><label for="critScore1">Obtenido:</label><input type="number" id="critScore1" class="crit-score-input" data-score="1" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s2);
  const cic=_pickF(critCicloBank,1,rngC)[0];
  const cicloGuides=[cic.p,cic.d,cic.a];
  const s3=document.createElement('div');
  s3.innerHTML=`<div class="eval-section-title">III. Analiza el ciclo: percibe → decide → actúa <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${cic.txt}</div>${critCicloQuestions.map((q,i)=>`<div class="crit-q-block"><div class="crit-q-label">${q}</div><textarea class="crit-textarea" rows="2" aria-label="${q}"></textarea><div class="crit-pauta">${cicloGuides[i]}</div></div>`).join('')}<div class="crit-selfscore"><label for="critScore2">Obtenido:</label><input type="number" id="critScore2" class="crit-score-input" data-score="2" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s3);
  const cmp=_pickF(critCompareBank,1,rngC)[0];
  const s4=document.createElement('div');
  s4.innerHTML=`<div class="eval-section-title">IV. Comparación razonada <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-compare-grid"><div class="crit-compare-box"><h5>Caso A</h5>${cmp.a}</div><div class="crit-compare-box"><h5>Caso B</h5>${cmp.b}</div></div><div class="crit-q-block"><div class="crit-q-label">1. ¿Qué concepto corresponde a cada caso? 2. ¿En qué se parecen? 3. ¿En qué se diferencian? Da un ejemplo de cada uno.</div><textarea class="crit-textarea" rows="4" aria-label="Comparación razonada de los casos A y B"></textarea><div class="crit-pauta">Caso A: ${cmp.ga} · Caso B: ${cmp.gb} · ${cmp.gr}</div></div><div class="crit-selfscore"><label for="critScore3">Obtenido:</label><input type="number" id="critScore3" class="crit-score-input" data-score="3" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s4);
  const dis=_pickF(critDesignBank,1,rngC)[0];
  const s5=document.createElement('div');
  s5.innerHTML=`<div class="eval-section-title">V. Diseña y justifica tu robot <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${dis}</div><div class="crit-q-block"><div class="crit-q-label">Inventa un robot que resuelva este problema: escribe su nombre, qué SENSORES usa (¿qué percibe?), qué DECIDE su controlador («si pasa X, entonces hace Y») y con qué ACTUADORES actúa. Puedes dibujarlo en tu cuaderno.</div><textarea class="crit-textarea" rows="5" aria-label="Diseño y justificación del robot"></textarea><div class="crit-pauta">${critDesignGuide}</div></div><div class="crit-selfscore"><label for="critScore4">Obtenido:</label><input type="number" id="critScore4" class="crit-score-input" data-score="4" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s5);
  window._evalCritData={sens,err,cic,cmp,dis};
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
  let s1=`<div class="sec-title"><span>I. ¿Qué sensor necesita?</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div>`;
  d.sens.forEach((k,i)=>{s1+=`<p class="crit-print-scenario">Caso ${i+1}: ${k.txt}</p><p class="crit-print-q">¿Qué sensor necesita este robot? Justifica tu elección.</p>${lines(1)}`;});
  let s2=`<div class="sec-title"><span>II. Corrige el error conceptual</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.err.txt}</p><p class="crit-print-q">Esta afirmación tiene dos errores. Corrígelos con argumentos:</p><p class="crit-print-q"><strong>Error 1:</strong></p>${lines(1)}<p class="crit-print-q"><strong>Error 2:</strong></p>${lines(1)}`;
  let s3=`<div class="sec-title"><span>III. Analiza el ciclo: percibe → decide → actúa</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.cic.txt}</p>`;
  critCicloQuestions.forEach(q=>{s3+=`<p class="crit-print-q">${q}</p>${lines(1)}`;});
  let s4=`<div class="sec-title"><span>IV. Comparación razonada</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><div class="crit-compare-print-grid"><div class="crit-compare-print-box"><strong>Caso A:</strong> ${d.cmp.a}</div><div class="crit-compare-print-box"><strong>Caso B:</strong> ${d.cmp.b}</div></div><p class="crit-print-q">1. ¿Qué concepto corresponde a cada caso? 2. ¿En qué se parecen? 3. ¿En qué se diferencian? Da un ejemplo de cada uno.</p>${lines(2)}`;
  let s5=`<div class="sec-title"><span>V. Diseña y justifica tu robot</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.dis}</p><p class="crit-print-q">Inventa un robot que resuelva este problema: escribe su nombre, qué SENSORES usa, qué DECIDE su controlador («si pasa X, entonces hace Y») y con qué ACTUADORES actúa. Dibújalo al reverso de la hoja.</p>${lines(4)}`;
  let pR='';
  pR+=`<div class="p-sec"><div class="p-ttl">I. ¿Qué sensor necesita?</div>${d.sens.map((k,i)=>`<div class="p-crit-line"><strong>Caso ${i+1}:</strong> ${k.ans}</div>`).join('')}</div>`;
  pR+=`<div class="p-sec"><div class="p-ttl">II. Corrige el error</div><div class="p-crit-line"><strong>Error 1:</strong> ${d.err.g1}</div><div class="p-crit-line"><strong>Error 2:</strong> ${d.err.g2}</div></div>`;
  pR+=`<div class="p-sec"><div class="p-ttl">III. Analiza el ciclo</div><div class="p-crit-line"><strong>Percibe:</strong> ${d.cic.p}</div><div class="p-crit-line"><strong>Decide:</strong> ${d.cic.d}</div><div class="p-crit-line"><strong>Actúa:</strong> ${d.cic.a}</div></div>`;
  pR+=`<div class="p-sec"><div class="p-ttl">IV. Comparación</div><div class="p-crit-line"><strong>Caso A:</strong> ${d.cmp.ga}</div><div class="p-crit-line"><strong>Caso B:</strong> ${d.cmp.gb}</div><div class="p-crit-line">${d.cmp.gr}</div></div>`;
  pR+=`<div class="p-sec" style="grid-column:1/-1;"><div class="p-ttl">V. Diseña tu robot — Rúbrica</div><div class="p-crit-line">${critDesignGuide}</div></div>`;
  const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Pensamiento Crítico ¿Qué es un Robot? · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.1rem 0.4rem;margin:0.2rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #0e7490;background:#ecfeff;color:#0e7490;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#0e7490;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #0e7490;height:12px;}.obt-pct{white-space:nowrap;}.crit-print-scenario{font-size:10.5pt;background:#ecfeff;border-left:3px solid #0e7490;padding:0.2rem 0.5rem;margin:0.1rem 0 0.2rem;line-height:1.3;}.crit-print-q{font-size:10pt;font-weight:600;margin:0.15rem 0 0.08rem;line-height:1.25;}.ln{border-bottom:1px solid #111;min-height:12px;margin-bottom:2px;}.crit-compare-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin:0.15rem 0;}.crit-compare-print-box{font-size:9.5pt;background:#ecfeff;border-radius:4px;padding:0.25rem 0.4rem;line-height:1.25;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.08rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.9rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.45rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.1rem;margin-bottom:0.18rem;}.p-crit-line{font-size:11pt;color:#007a00;margin-bottom:0.18rem;line-height:1.35;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.2rem;padding:0.1rem 0;color:#0e7490;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #0e7490;}.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:12.7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="critEvalPage"><div class="ph"><h2>Evaluación Competencial · Pensamiento Crítico · ¿Qué es un Robot? · Educación Básica · Robótica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 5 secciones de 20 puntos</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100</span></div></div><div class="pauta-wrap" id="critPautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Pensamiento Crítico · ¿Qué es un Robot? · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 5 secciones × 20 pts c/u — respuesta abierta, usar como guía de corrección</div></div><div class="p-grid">${pR}</div></div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("critEvalPage",250,0.55,1.2);fit("critPautaPage",250,0.55,1.2);})();<\/script></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(typeof METAS_TR==='function'?METAS_TR(doc):doc);win.document.close();setTimeout(()=>win.print(),400);
}

// ===================== LABORATORIO DE LAS PARTES DEL ROBOT =====================
let parteData={
  sensores:{
    nombre:'Los sensores',icon:'📡',
    estructura:{title:'¿Qué es?',info:'• La parte del robot que <strong>PERCIBE</strong> el mundo<br>• Capta <strong>luz, sonido, distancia, tacto o temperatura</strong><br>• Convierte lo que capta en señales para el controlador'},
    funcion:{title:'Analogía con tu cuerpo',info:'• Son como tus <strong>sentidos</strong>: ojos, oídos y piel<br>• Tu ojo capta la luz → la cámara del robot también<br>• Igual que en tu cuerpo: <strong>receptor → cerebro → efector</strong>'},
    ubicacion:{title:'Ejemplos',info:'• <strong>Cámara</strong> (ve) y <strong>micrófono</strong> (oye)<br>• Sensor de <strong>distancia</strong>: evita choques<br>• Sensores de <strong>tacto, temperatura y humedad</strong>'},
    dato:{title:'¿Qué pasa si falla?',info:'• El robot queda <strong>«ciego y sordo»</strong><br>• La aspiradora chocaría contra las sillas<br>• El controlador decidiría <strong>sin información</strong>: puro error'}
  },
  controlador:{
    nombre:'El controlador',icon:'🧠',
    estructura:{title:'¿Qué es?',info:'• El <strong>«cerebro»</strong> del robot: un pequeño computador<br>• Recibe las señales de los sensores<br>• <strong>DECIDE</strong> qué hacer siguiendo su <strong>programa</strong>'},
    funcion:{title:'Analogía con tu cuerpo',info:'• Es como tu <strong>cerebro</strong><br>• Tu cerebro recibe lo que ven tus ojos y decide correr o parar<br>• El controlador recibe los datos y elige la acción'},
    ubicacion:{title:'Ejemplos',info:'• La <strong>tarjeta electrónica</strong> dentro de la aspiradora robot<br>• El <strong>chip</strong> del dron que sigue el plan de vuelo<br>• Decisiones tipo: <strong>«si hay obstáculo, entonces gira»</strong>'},
    dato:{title:'¿Qué pasa si falla?',info:'• El robot percibe pero <strong>no sabe qué hacer</strong><br>• Los motores no reciben ninguna orden<br>• Sin programa cargado, el controlador <strong>no decide nada</strong>'}
  },
  actuadores:{
    nombre:'Los actuadores',icon:'💪',
    estructura:{title:'¿Qué es?',info:'• La parte del robot que <strong>ACTÚA</strong><br>• <strong>Motores, ruedas, brazos, luces y bocinas</strong><br>• Ejecutan la orden que envió el controlador'},
    funcion:{title:'Analogía con tu cuerpo',info:'• Son como tus <strong>músculos</strong><br>• Tu cerebro ordena y tus piernas corren<br>• El controlador ordena y los <strong>motores giran</strong>'},
    ubicacion:{title:'Ejemplos',info:'• Las <strong>ruedas</strong> de la aspiradora robot<br>• Las <strong>hélices</strong> del dron<br>• El <strong>brazo</strong> que cose en la maquila'},
    dato:{title:'¿Qué pasa si falla?',info:'• El robot percibe y decide… pero <strong>no se mueve</strong><br>• Es como querer caminar con los músculos dormidos<br>• Sin actuadores, la decisión <strong>se queda en pura idea</strong>'}
  },
  energia:{
    nombre:'La energía',icon:'🔋',
    estructura:{title:'¿Qué es?',info:'• La <strong>fuente de poder</strong> del robot<br>• Casi siempre una <strong>batería</strong> o la corriente eléctrica<br>• Alimenta sensores, controlador y actuadores por igual'},
    funcion:{title:'Analogía con tu cuerpo',info:'• Es como tu <strong>alimento</strong>: la comida te da fuerzas<br>• Sin desayuno no rindes; sin batería el robot no arranca<br>• Algunos robots «comen» del sol con <strong>paneles solares</strong>'},
    ubicacion:{title:'Ejemplos',info:'• La <strong>batería recargable</strong> de la aspiradora robot<br>• Las <strong>pilas</strong> de un robot de juguete<br>• El <strong>panel solar</strong> de un robot explorador'},
    dato:{title:'¿Qué pasa si falla?',info:'• <strong>TODO el robot se apaga</strong>: nada percibe, nada decide, nada actúa<br>• Por eso la aspiradora robot <strong>regresa sola a su cargador</strong><br>• Un buen robot vigila su propia batería con un sensor'}
  }
};
let labParte='sensores',labAspecto='estructura';
function labShowParte(parteKey){labParte=parteKey;updateLabDisplay();document.querySelectorAll('.lab-cont-btn').forEach(b=>b.classList.remove('active-pri'));const btn=document.querySelector(`[data-parte="${parteKey}"]`);if(btn)btn.classList.add('active-pri');document.querySelectorAll('.lab-svg-part').forEach(g=>g.classList.remove('svg-active'));const sg=document.getElementById('svgP-'+parteKey);if(sg)sg.classList.add('svg-active');if(typeof sfx==='function')sfx('click');}
function labShowAspecto(aspectoKey){labAspecto=aspectoKey;updateLabDisplay();document.querySelectorAll('.lab-asp-btn').forEach(b=>b.classList.remove('active-sec'));const btn=document.querySelector(`[data-aspecto="${aspectoKey}"]`);if(btn)btn.classList.add('active-sec');if(typeof sfx==='function')sfx('click');}
function updateLabDisplay(){const data=parteData[labParte];const asp=data[labAspecto];document.getElementById('lab-sentence').innerHTML=`🔬 Explorando: <strong>${data.nombre}</strong> → <strong>${asp.title}</strong>`;document.getElementById('lab-display').innerHTML=`<div class="lab-cont-header">${data.icon} ${data.nombre}</div><div class="lab-asp-title">${asp.title}</div><div class="lab-asp-info">${asp.info}</div>`;}

// ===================== DIPLOMA =====================
function _diplPct(){return xp>=MXP?100:Math.round((xp/MXP)*100);}
function openDiploma(){sfx('fan');const pct=_diplPct();document.getElementById('diplPct').textContent=pct+'%';document.getElementById('diplBar').style.width=pct+'%';document.getElementById('diplDate').textContent='Fecha: '+new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});const msgs=['¡Sigue aprendiendo!','¡Muy buen trabajo!','¡Vas muy bien!','¡Dominas las partes del robot!','¡Maestro Constructor de Robots!'];document.getElementById('diplMsg').textContent=msgs[Math.min(Math.floor(pct/25),4)];const stars=['⭐','⭐⭐','⭐⭐⭐'];document.getElementById('diplStars').textContent=stars[Math.min(Math.floor(pct/40),2)];const achTxt=unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(' · ');document.getElementById('diplAch').textContent=achTxt||'Sigue completando secciones para desbloquear logros';document.getElementById('diplomaOverlay').classList.add('open');launchConfetti();}
function closeDiploma(){document.getElementById('diplomaOverlay').classList.remove('open');}
function updateDiplomaName(v){document.getElementById('diplName').textContent=v||'Estudiante';}
function shareWA(){const name=document.getElementById('diplName').textContent||'Estudiante';const pct=_diplPct();const msg=`🤖 ¡${name} completó la Misión "¿Qué es un Robot?"! 🏅 Progreso: ${pct}% · 🌱 policastsapien.com`;_waShare(msg);}
async function captureDiploma(){if(typeof html2canvas==='undefined'){showToast('⚠️ Cargando... intenta de nuevo');return;}sfx('click');const card=document.querySelector('.diploma-card');const btn=document.querySelector('.diploma-actions .btn-pri');const toHide=[card.querySelector('.diploma-input'),card.querySelector('.diploma-actions'),card.querySelector('hr')];if(btn){btn.disabled=true;btn.textContent='⏳ Capturando...';}toHide.forEach(el=>{if(el)el.style.display='none';});let dataUrl='';try{const canvas=await html2canvas(card,{scale:2,useCORS:true,backgroundColor:'#ffffff'});toHide.forEach(el=>{if(el)el.style.display='';});dataUrl=canvas.toDataURL('image/png');const name=(document.getElementById('diplName').textContent||'Estudiante').replace(/\s+/g,'-');const fileName='constancia-'+name+'.png';const cap=window.Capacitor;if(cap&&cap.isNativePlatform&&cap.isNativePlatform()&&cap.Plugins?.Filesystem&&cap.Plugins?.Share){const base64Data=dataUrl.split(',')[1];const result=await cap.Plugins.Filesystem.writeFile({path:fileName,data:base64Data,directory:'CACHE'});await cap.Plugins.Share.share({url:result.uri,dialogTitle:'Guardar / Compartir Constancia'});}else{const a=document.createElement('a');a.href=dataUrl;a.download=fileName;a.click();}}catch(e){toHide.forEach(el=>{if(el)el.style.display='';});if(e.name!=='AbortError')showToast('⚠️ No se pudo guardar la constancia');}finally{if(btn){btn.disabled=false;btn.textContent='📷 Guardar foto';}}}

// ===================== INIT =====================
window.addEventListener('DOMContentLoaded',()=>{
  initTheme();
  loadProgress();
  upFC();
  buildMemo();
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
  document.querySelector('[data-parte="sensores"]')?.classList.add('active-pri');
  document.querySelector('[data-aspecto="estructura"]')?.classList.add('active-sec');
  const sg=document.getElementById('svgP-sensores');if(sg)sg.classList.add('svg-active');
  renderAchPanel();
});

(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalCrit==='function') _injectFormaSel('genEvalCrit','evalCritFormaSel',evalCritFormNum,function(v){evalCritFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();

// ===================== IDIOMA (español ↔ inglés) =====================
// El contenido en inglés vive en que-es-un-robot-en.js y el botón lo maneja
// ../../js/metas-i18n.js. Aquí solo se intercambian los bancos y se repinta:
// el progreso (XP, logros, secciones hechas) no se toca al cambiar de idioma.
const _BANCOS_ES = {
  ACHIEVEMENTS, lvls, fcData, memoPairs, qzData, classGroups, idData, cmpData,
  routeSets, neuronPartes, neuroPairs, enfermedadData, retoPairs,
  identifyTaskDB, classifyTaskDB, completeTaskDB, explainQuestions, sopaSets,
  evalTFBank, evalMCBank, evalCPBank, evalPRBank,
  critSensorBank, critErrorBank, critCicloQuestions, critCicloBank,
  critCompareBank, critDesignBank, critDesignGuide, parteData
};
window.MISION_APLICAR_IDIOMA = function (lang) {
  const src = (lang === 'en' && window.MISION_EN && window.MISION_EN.data)
    ? window.MISION_EN.data : _BANCOS_ES;
  const usa = (k) => (src[k] !== undefined ? src[k] : _BANCOS_ES[k]);

  ACHIEVEMENTS = usa('ACHIEVEMENTS'); lvls = usa('lvls');
  fcData = usa('fcData'); memoPairs = usa('memoPairs'); qzData = usa('qzData');
  classGroups = usa('classGroups'); idData = usa('idData'); cmpData = usa('cmpData');
  routeSets = usa('routeSets'); neuronPartes = usa('neuronPartes');
  neuroPairs = usa('neuroPairs'); enfermedadData = usa('enfermedadData');
  retoPairs = usa('retoPairs'); identifyTaskDB = usa('identifyTaskDB');
  classifyTaskDB = usa('classifyTaskDB'); completeTaskDB = usa('completeTaskDB');
  explainQuestions = usa('explainQuestions'); sopaSets = usa('sopaSets');
  evalTFBank = usa('evalTFBank'); evalMCBank = usa('evalMCBank');
  evalCPBank = usa('evalCPBank'); evalPRBank = usa('evalPRBank');
  critSensorBank = usa('critSensorBank'); critErrorBank = usa('critErrorBank');
  critCicloQuestions = usa('critCicloQuestions'); critCicloBank = usa('critCicloBank');
  critCompareBank = usa('critCompareBank'); critDesignBank = usa('critDesignBank');
  critDesignGuide = usa('critDesignGuide'); parteData = usa('parteData');

  // Repintar cada juego desde el principio con el banco nuevo
  fcIdx = 0; upFC();
  buildMemo();
  qzIdx = 0; qzSel = -1; qzDone = false; showQz();
  currentClassGroupIdx = 0; buildClass();
  idIdx = 0; showId();
  cmpIdx = 0; cmpSel = -1; showCmp();
  currentRouteIdx = 0; buildRoute();
  neuronIdx = 0; showNeuron();
  neuroIdx = 0; showNeuro();
  enferIdx = 0; showEnfer();
  currentRetoPairIdx = 0; updateRetoButtons(); resetReto();
  currentSopaSetIdx = 0; sopaFoundWords = new Set(); buildSopa();
  updateLabDisplay();
  renderAchPanel(); updateXPBar();

  // Las pruebas ya generadas se rehacen en el idioma nuevo, con su misma forma
  const out = document.getElementById('evalOut');
  if (out && out.innerHTML.trim()) { evalFormNum = window._currentEvalForm || evalFormNum; genEval(); }
  const outCrit = document.getElementById('evalCritOut');
  if (outCrit && outCrit.innerHTML.trim()) { evalCritFormNum = window._currentEvalCritForm || evalCritFormNum; genEvalCrit(); }
  const tg = document.getElementById('tgOut');
  if (tg) tg.innerHTML = '';
};
