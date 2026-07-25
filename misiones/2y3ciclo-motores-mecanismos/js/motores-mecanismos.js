// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
function compartirMision(){const url=window.location.href;const texto=`⚙️ *Misión Asignada* ⚙️\n\nPractica sobre este tema y sobresale en ser de los mejores alumnos. 🏆\n\nDesbloquea *todos los logros* y puedes poner *tus datos* para que tu maestro observe todos tus logros. 📋\n\n_Se te hará prueba escrita y serás excelente estudiante en Robótica: motores, engranajes, poleas y palancas._ ⚙️\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;_waShare(texto);}
function toggleLetra(){document.body.classList.toggle('letra-grande');if(typeof sfx==='function')sfx('click');localStorage.setItem('preferenciaLetra',document.body.classList.contains('letra-grande'));}
window.addEventListener('DOMContentLoaded',()=>{if(localStorage.getItem('preferenciaLetra')==='true')document.body.classList.add('letra-grande');});

// ===================== UTILIDADES =====================
const _pick=(arr,n)=>[...arr].sort(()=>Math.random()-0.5).slice(0,n);
const _shuffle=(arr)=>[...arr].sort(()=>Math.random()-0.5);
function fb(id,msg,isOk){const el=document.getElementById(id);if(el){el.textContent=msg;el.className='fb show '+(isOk?'ok':'err');}}

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY='motores_mecanismos_v1';
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
  primer_quiz:{icon:'⚙️',label:'Primer quiz de mecanismos superado'},
  flash_master:{icon:'🃏',label:'Todas las flashcards de mecanismos exploradas'},
  clasif_pro:{icon:'🗂️',label:'Clasificador de fuerza y velocidad experto'},
  id_master:{icon:'🔍',label:'Identificador de mecanismos maestro'},
  reto_hero:{icon:'🏆',label:'Héroe del reto Fuerza vs Velocidad'},
  nivel3:{icon:'🧭',label:'¡Aprendiz de Engranajes! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡Ingeniero Mecánico! Nivel 6'},
  widgets_master:{icon:'🧩',label:'Widgets de transmisión dominados'},
  gear_lab:{icon:'🦷',label:'Laboratorio del tren de engranajes completado'}
};
function unlockAchievement(id){if(unlockedAch.includes(id))return;unlockedAch.push(id);sfx('ach');showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label);launchConfetti();renderAchPanel();saveProgress();}
function renderAchPanel(){const list=document.getElementById('achList');list.innerHTML='';Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{const div=document.createElement('div');div.className='ach-item'+(unlockedAch.includes(id)?'':' locked');div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`;list.appendChild(div);});}
function toggleAchPanel(){sfx('click');document.getElementById('achPanel').classList.toggle('open');}
function showToast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}t.textContent=msg;t.style.display='block';clearTimeout(t._tid);t._tid=setTimeout(()=>t.style.display='none',3200);}
function launchConfetti(){const colors=['#0e7490','#22d3ee','#c2410c','#fb923c','#06b6d4'];for(let i=0;i<60;i++){const c=document.createElement('div');c.className='confetti-piece';c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`;document.body.appendChild(c);c.addEventListener('animationend',()=>c.remove());}}

// ===================== XP =====================
let lvls=[{t:0,n:'Aprendiz 🌱'},{t:25,n:'Curioso Tec 🔩'},{t:55,n:'Aprendiz de Engranajes ⚙️'},{t:90,n:'Técnico de Poleas 🎡'},{t:130,n:'Armador de Palancas 🪝'},{t:165,n:'Ingeniero Mecánico 🛠️'},{t:190,n:'Maestro del Movimiento 🤖'}];
function pts(n){xp=Math.max(0,Math.min(MXP,xp+n));updateXPBar();saveProgress();}
function updateXPBar(){const pct=Math.round((xp/MXP)*100);document.getElementById('xpFill').style.width=pct+'%';const el=document.getElementById('xpPts');el.textContent='⭐ '+xp;el.style.transform='scale(1.3)';setTimeout(()=>el.style.transform='',300);let lv=0;for(let i=0;i<lvls.length;i++)if(xp>=lvls[i].t)lv=i;document.getElementById('xpLvl').textContent=lvls[lv].n;if(lv!==prevLevel){if(lv>=2)unlockAchievement('nivel3');if(lv>=5)unlockAchievement('nivel5');prevLevel=lv;}}
function resetXP(){sfx('click');xp=0;updateXPBar();showToast('🔄 XP reiniciado a 0');}
function fin(id,showFX=true){if(!done.has(id)){done.add(id);const b=document.querySelector(`[data-s="${id}"]`);if(b)b.classList.add('done');if(showFX){sfx('up');launchConfetti();}saveProgress();}}
function getProgress(){return Math.round((done.size/TOTAL_SECTIONS)*100);}

// ===================== NAV =====================
function go(id){sfx('click');document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});document.getElementById(id).classList.add('active');const btn=document.querySelector(`[data-s="${id}"]`);if(btn){btn.classList.add('active');btn.setAttribute('aria-selected','true');}window.scrollTo({top:0,behavior:'smooth'});if(id==='s-sopa'){setTimeout(buildSopa,50);}if(id==='s-widgets'){setTimeout(buildRoute,50);}if(id==='s-lab'){setTimeout(()=>gearShowCase(gearIdx),50);}}

// ===================== MINI-QUIZ (sección Mecanismos) =====================
function miniQ(btn,isOk,fbId){const wrap=btn.parentElement;if(wrap.dataset.done==='1')return;wrap.querySelectorAll('.cmp-opt').forEach(b=>b.classList.remove('sel'));if(isOk){wrap.dataset.done='1';btn.classList.add('correct');fb(fbId,'¡Correcto! Piensas como todo un ingeniero de mecanismos.',true);sfx('ok');}else{btn.classList.add('wrong');fb(fbId,'Casi. Pregúntate siempre: ¿gana fuerza o gana velocidad?, ¿en qué sentido gira?',false);sfx('no');}}

// ===================== FLASHCARD DATA =====================
let fcData=[
  {w:'Motor',a:'⚙️ El <strong>actuador</strong> que convierte la <strong>energía eléctrica</strong> de la batería en <strong>movimiento de giro</strong>.'},
  {w:'Servomotor',a:'📐 Motor que gira hasta un <strong>ángulo exacto</strong> (por ejemplo 90°) y se queda ahí: sirve para brazos y pinzas.'},
  {w:'Motorreductor',a:'🧰 Motor + caja de <strong>engranajes</strong>: gira <strong>más lento</strong> pero con <strong>mucha más fuerza</strong>.'},
  {w:'Engranaje',a:'🦷 Rueda con <strong>dientes</strong> que encajan en otra. Dos en contacto giran en <strong>sentidos contrarios</strong>.'},
  {w:'Relación de transmisión',a:'⚖️ Comparación entre los <strong>dientes</strong> del primer engranaje y los del último: decide si se gana fuerza o velocidad.'},
  {w:'Engranaje loco',a:'🎯 El engranaje del <strong>medio</strong> en un tren de tres: solo <strong>cambia el sentido</strong>, no cambia la velocidad.'},
  {w:'Polea',a:'🎡 Rueda con un <strong>canal</strong> por donde pasa una cuerda o una correa. La <strong>polea fija</strong> cambia la dirección de la fuerza; la <strong>móvil</strong> ayuda a levantar peso.'},
  {w:'Correa',a:'🪢 Cinta que une dos poleas y lleva el giro <strong>a distancia</strong>. Si va <strong>cruzada</strong>, el giro se invierte.'},
  {w:'Palanca',a:'🪝 Barra rígida que gira sobre un <strong>punto de apoyo</strong>: <strong>multiplica la fuerza</strong>, pero recorre menos distancia.'},
  {w:'Punto de apoyo',a:'🔺 El punto fijo sobre el que gira la barra de la palanca. Sin él, <strong>no hay palanca</strong>.'},
  {w:'Rueda y eje',a:'🛞 La rueda gira junto con el <strong>eje</strong> y lo arrastra: mueve cargas con poco esfuerzo (carretilla, carreta).'},
  {w:'Tornillo sin fin',a:'🌀 Un «gusano» roscado que mueve una rueda dentada: <strong>muchísima fuerza</strong> y muy poca velocidad (molino de maíz).'},
  {w:'Biela-manivela',a:'🔁 Transforma el movimiento de <strong>giro</strong> en movimiento de <strong>vaivén</strong> (ida y vuelta), como la máquina de coser.'},
  {w:'Cadena y piñones',a:'🚲 Transmiten el giro a distancia sin resbalar: el <strong>plato</strong> de la bicicleta mueve el <strong>piñón</strong> de la rueda trasera.'},
];
let fcIdx=0;
function upFC(){document.getElementById('fcInner').classList.remove('flipped');document.getElementById('fcW').textContent=fcData[fcIdx].w;document.getElementById('fcA').innerHTML=fcData[fcIdx].a;document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length;}
function flipCard(){sfx('flip');document.getElementById('fcInner').classList.toggle('flipped');if(!xpTracker.fc.has(fcIdx)){xpTracker.fc.add(fcIdx);pts(1);}if(xpTracker.fc.size===fcData.length){fin('s-flash');unlockAchievement('flash_master');}}
function nextFC(){sfx('click');fcIdx=(fcIdx+1)%fcData.length;upFC();}
function prevFC(){sfx('click');fcIdx=(fcIdx-1+fcData.length)%fcData.length;upFC();}

// ===================== JUEGO: MEMORIA DE LOS MECANISMOS =====================
let memoPairs=[
  {id:'motor',t:'Motor',d:'⚙️ convierte la electricidad en giro'},
  {id:'engranaje',t:'Engranaje',d:'🦷 rueda dentada: dos en contacto giran al revés'},
  {id:'polea',t:'Polea y correa',d:'🎡 llevan el giro a distancia'},
  {id:'palanca',t:'Palanca',d:'🪝 barra con punto de apoyo: multiplica la fuerza'},
  {id:'tornillo',t:'Tornillo sin fin',d:'🌀 mucha fuerza y muy poca velocidad'},
  {id:'biela',t:'Biela-manivela',d:'🔁 convierte el giro en vaivén'}
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
  {q:'¿Qué hace el motor de un robot?',o:['a) Guarda la información','b) Convierte la energía eléctrica en movimiento de giro','c) Percibe la luz','d) Enfría la batería'],c:1},
  {q:'Dos engranajes con los dientes encajados, ¿cómo giran?',o:['a) En el mismo sentido','b) Uno gira y el otro no','c) En sentidos contrarios','d) Depende del color'],c:2},
  {q:'Un engranaje de 10 dientes mueve a uno de 30. ¿Qué le pasa al de 30?',o:['a) Gira más lento y con más fuerza','b) Gira más rápido y con más fuerza','c) Gira más rápido y con menos fuerza','d) Se queda quieto'],c:0},
  {q:'En un tren de TRES engranajes, el primero y el tercero…',o:['a) Giran en sentidos contrarios','b) Giran en el mismo sentido','c) Nunca giran','d) Giran al doble de velocidad'],c:1},
  {q:'¿Qué motor gira hasta un ángulo exacto y se detiene ahí?',o:['a) El motor DC','b) El motorreductor','c) El servomotor','d) El tornillo sin fin'],c:2},
  {q:'¿Qué pasa si la correa entre dos poleas se coloca cruzada?',o:['a) La correa se rompe','b) El segundo eje gira al revés','c) No pasa nada','d) La polea grande desaparece'],c:1},
  {q:'¿Qué necesita una palanca para funcionar?',o:['a) Un motor eléctrico','b) Una batería','c) Un punto de apoyo','d) Una correa'],c:2},
  {q:'¿Qué mecanismo transforma el giro en movimiento de vaivén?',o:['a) La polea fija','b) La biela-manivela','c) La rueda y el eje','d) El engranaje loco'],c:1},
  {q:'¿Cuál es el intercambio de todo mecanismo?',o:['a) Se gana fuerza y velocidad a la vez','b) Se pierde todo','c) Lo que se gana en fuerza se pierde en velocidad','d) El mecanismo crea energía nueva'],c:2},
];
let qzIdx=0,qzSel=-1,qzDone=false;
function buildQz(){qzIdx=0;qzSel=-1;qzDone=false;showQz();}
function showQz(){if(qzIdx>=qzData.length){document.getElementById('qzQ').textContent='🎉 ¡Quiz completado!';document.getElementById('qzOpts').innerHTML='';fin('s-quiz');unlockAchievement('primer_quiz');return;}const q=qzData[qzIdx];document.getElementById('qzProg').textContent=`Pregunta ${qzIdx+1} de ${qzData.length}`;document.getElementById('qzQ').textContent=q.q;const opts=document.getElementById('qzOpts');opts.innerHTML='';q.o.forEach((o,i)=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=o;b.onclick=()=>{if(qzDone)return;document.querySelectorAll('.qz-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');qzSel=i;sfx('click');};opts.appendChild(b);});qzDone=false;}
function checkQz(){if(qzSel<0)return fb('fbQz','Selecciona una respuesta.',false);qzDone=true;const opts=document.querySelectorAll('.qz-opt');if(qzSel===qzData[qzIdx].c){opts[qzSel].classList.add('correct');fb('fbQz','¡Correcto! +5 XP',true);if(!xpTracker.qz.has(qzIdx)){xpTracker.qz.add(qzIdx);pts(5);}sfx('ok');}else{opts[qzSel].classList.add('wrong');opts[qzData[qzIdx].c].classList.add('correct');fb('fbQz','Incorrecto. Revisa la respuesta correcta.',false);sfx('no');}setTimeout(()=>{qzIdx++;qzSel=-1;showQz();},1600);}
function resetQz(){sfx('click');qzIdx=0;qzSel=-1;qzDone=false;showQz();document.getElementById('fbQz').classList.remove('show');}

// ===================== CLASIFICACIÓN =====================
let classGroups=[
  {label:['Gana fuerza','Gana velocidad'],headA:'💪 Gana fuerza',headB:'⚡ Gana velocidad',colA:'fue',colB:'vel',
   words:[{w:'Piñón pequeño mueve rueda grande',t:'fue'},{w:'Rueda grande mueve piñón pequeño',t:'vel'},{w:'Tornillo sin fin',t:'fue'},{w:'Motor DC sin reducción',t:'vel'},{w:'Motorreductor',t:'fue'},{w:'Piñón chico de la bicicleta',t:'vel'},{w:'Piñón grande para la cuesta',t:'fue'},{w:'Polea grande mueve polea pequeña',t:'vel'},{w:'Polea pequeña mueve polea grande',t:'fue'},{w:'Palanca larga sobre el apoyo',t:'fue'}]},
  {label:['Mismo sentido','Sentido contrario'],headA:'🔄 Giran igual',headB:'↩️ Giran al revés',colA:'igu',colB:'con',
   words:[{w:'Dos engranajes en contacto',t:'con'},{w:'Tres engranajes: 1º y 3º',t:'igu'},{w:'Dos poleas con correa abierta',t:'igu'},{w:'Dos poleas con correa cruzada',t:'con'},{w:'Plato y piñón con cadena',t:'igu'},{w:'Piñón pequeño con rueda dentada',t:'con'},{w:'Rueda dentada con rueda dentada',t:'con'},{w:'Faja abierta del molino',t:'igu'}]},
  {label:['Palanca','Polea'],headA:'🪝 Es una palanca',headB:'🎡 Es una polea',colA:'pal',colB:'pol',
   words:[{w:'El balancín del parque',t:'pal'},{w:'El balde del pozo',t:'pol'},{w:'La carretilla del albañil',t:'pal'},{w:'Izar la bandera en el asta',t:'pol'},{w:'Las tijeras',t:'pal'},{w:'La grúa que sube bloques',t:'pol'},{w:'La pinza para el asado',t:'pal'},{w:'El tendedero de ropa con roldana',t:'pol'}]},
  {label:['Movimiento de giro','Movimiento de vaivén'],headA:'🔄 Giro (circular)',headB:'↔️ Vaivén (ida y vuelta)',colA:'gir',colB:'vai',
   words:[{w:'La rueda del carrito',t:'gir'},{w:'La aguja de la máquina de coser',t:'vai'},{w:'El engranaje del reloj',t:'gir'},{w:'El pistón del motor',t:'vai'},{w:'La polea del pozo',t:'gir'},{w:'La sierra que va y viene',t:'vai'},{w:'La cadena de la bicicleta',t:'gir'},{w:'El limpiaparabrisas',t:'vai'}]},
];
let currentClassGroupIdx=0,clsSelectedWord=null;
function buildClass(){const group=classGroups[currentClassGroupIdx];document.getElementById('col-left-head').textContent=group.headA;document.getElementById('col-right-head').textContent=group.headB;const bank=document.getElementById('clsBank');bank.innerHTML='';clsSelectedWord=null;document.getElementById('items-left').innerHTML='';document.getElementById('items-right').innerHTML='';_shuffle([...group.words]).forEach(w=>{const el=document.createElement('div');el.className='wb-item';el.textContent=w.w;el.dataset.t=w.t;el.onclick=()=>{document.querySelectorAll('.wb-item').forEach(i=>i.classList.remove('sel-word'));el.classList.add('sel-word');clsSelectedWord=el;sfx('click');};bank.appendChild(el);});['col-left','col-right'].forEach(colId=>{const col=document.getElementById(colId);col.onclick=(e)=>{if(!clsSelectedWord||e.target.classList.contains('drop-item'))return;const targetId=colId==='col-left'?'items-left':'items-right';const wordsCol=document.getElementById(targetId);const item=document.createElement('div');item.className='drop-item';item.textContent=clsSelectedWord.textContent;item.dataset.t=clsSelectedWord.dataset.t;const original=clsSelectedWord;item.onclick=(ev)=>{ev.stopPropagation();if(clsSelectedWord!==null){col.click();}else{document.getElementById('clsBank').appendChild(original);original.classList.remove('sel-word');item.remove();if(typeof sfx==='function')sfx('click');}};wordsCol.appendChild(item);clsSelectedWord.remove();clsSelectedWord=null;sfx('click');};});}
function checkClass(){const remaining=document.querySelectorAll('#clsBank .wb-item').length;if(remaining>0){fb('fbCls','Mueve todas las palabras a las columnas primero.',false);return;}const group=classGroups[currentClassGroupIdx];let allOk=true;document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{const inLeft=el.parentElement.id==='items-left';const expectedType=inLeft?group.colA:group.colB;if(el.dataset.t===expectedType){el.classList.add('cls-ok');}else{el.classList.add('cls-no');allOk=false;}});if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);}if(allOk){fb('fbCls','¡Perfecto! +5 XP',true);sfx('fan');fin('s-clasifica');unlockAchievement('clasif_pro');}else{fb('fbCls','Hay errores. Marcados en rojo.',false);sfx('no');}}
function nextClassGroup(){sfx('click');currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length;buildClass();document.getElementById('fbCls').classList.remove('show');showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]);}
function resetClass(){sfx('click');buildClass();document.getElementById('fbCls').classList.remove('show');}

// ===================== IDENTIFICAR =====================
let idData=[
  {s:['El','motor','convierte','la','electricidad','en','giro.'],c:1,art:'El actuador que produce el movimiento'},
  {s:['El','engranaje','tiene','dientes','que','encajan','sin','resbalar.'],c:1,art:'La rueda dentada que transmite el giro'},
  {s:['La','palanca','gira','sobre','su','punto','de','apoyo.'],c:1,art:'La barra rígida que multiplica la fuerza'},
  {s:['La','correa','une','las','dos','poleas','del','molino.'],c:1,art:'La cinta que transmite el giro a distancia'},
  {s:['El','servomotor','se','detiene','en','el','ángulo','exacto.'],c:1,art:'El motor que controla la posición exacta'},
  {s:['El','tornillo','sin','fin','da','mucha','fuerza','al','portón.'],c:1,art:'El mecanismo de máxima reducción'},
  {s:['La','biela-manivela','convierte','el','giro','en','vaivén.'],c:1,art:'El mecanismo que transforma el movimiento'},
  {s:['La','cadena','lleva','el','giro','del','plato','al','piñón.'],c:1,art:'La pieza que une el plato con el piñón de la bicicleta'},
];
let idIdx=0,idDone=false;
function showId(){idDone=false;if(idIdx>=idData.length){document.getElementById('idSent').innerHTML='🎉 ¡Completado!';fin('s-identifica');unlockAchievement('id_master');return;}const d=idData[idIdx];document.getElementById('idProg').textContent=`Oración ${idIdx+1} de ${idData.length}`;document.getElementById('idInfo').textContent=`Busca: ${d.art}`;const sent=document.getElementById('idSent');sent.innerHTML='';d.s.forEach((w,i)=>{const span=document.createElement('span');span.className='id-word';span.textContent=w+' ';span.onclick=()=>checkId(i,span);sent.appendChild(span);});}
function checkId(i,span){if(idDone)return;document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected'));span.classList.add('selected');if(i===idData[idIdx].c){idDone=true;span.classList.add('id-ok');fb('fbId','¡Correcto! +5 XP',true);if(!xpTracker.id.has(idIdx)){xpTracker.id.add(idIdx);pts(5);}sfx('ok');}else{span.classList.add('id-no');fb('fbId','Ese no es el término solicitado.',false);sfx('no');}}
function nextId(){sfx('click');idIdx++;showId();document.getElementById('fbId').classList.remove('show');}
function resetId(){sfx('click');idIdx=0;showId();document.getElementById('fbId').classList.remove('show');}

// ===================== COMPLETA =====================
let cmpData=[
  {s:'El motor convierte la energía eléctrica en movimiento de ___.',opts:['giro','color','sonido'],c:0},
  {s:'Dos engranajes en contacto giran en sentidos ___.',opts:['iguales','contrarios','lentos'],c:1},
  {s:'Un engranaje pequeño que mueve a uno grande da más ___.',opts:['fuerza','velocidad','ruido'],c:0},
  {s:'Un engranaje grande que mueve a uno pequeño da más ___.',opts:['peso','fuerza','velocidad'],c:2},
  {s:'La palanca necesita un punto de ___ para funcionar.',opts:['apoyo','pintura','agua'],c:0},
  {s:'Si la correa se coloca cruzada, el giro se ___.',opts:['detiene','invierte','acelera'],c:1},
  {s:'El ___ sin fin da mucha fuerza y muy poca velocidad.',opts:['motor','tornillo','cable'],c:1},
  {s:'La biela-manivela transforma el giro en movimiento de ___.',opts:['vaivén','luz','calor'],c:0},
];
let cmpIdx=0,cmpSel=-1,cmpDone=false;
function showCmp(){if(cmpIdx>=cmpData.length){document.getElementById('cmpSent').innerHTML='🎉 ¡Completado!';document.getElementById('cmpOpts').innerHTML='';fin('s-completa');return;}const d=cmpData[cmpIdx];document.getElementById('cmpProg').textContent=`Oración ${cmpIdx+1} de ${cmpData.length}`;document.getElementById('cmpSent').innerHTML=d.s.replace('___','<span class="blank">___</span>');const opts=document.getElementById('cmpOpts');opts.innerHTML='';cmpSel=-1;cmpDone=false;d.opts.forEach((o,i)=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=o;b.onclick=()=>{if(cmpDone)return;document.querySelectorAll('.cmp-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');cmpSel=i;sfx('click');};opts.appendChild(b);});}
function checkCmp(){if(cmpSel<0)return fb('fbCmp','Selecciona una opción.',false);cmpDone=true;const opts=document.querySelectorAll('.cmp-opt');if(cmpSel===cmpData[cmpIdx].c){opts[cmpSel].classList.add('correct');document.getElementById('cmpSent').innerHTML=cmpData[cmpIdx].s.replace('___',`<span class="blank" style="color:var(--jade);border-color:var(--jade)">${opts[cmpSel].textContent}</span>`);fb('fbCmp','¡Correcto! +5 XP',true);if(!xpTracker.cmp.has(cmpIdx)){xpTracker.cmp.add(cmpIdx);pts(5);}sfx('ok');}else{opts[cmpSel].classList.add('wrong');opts[cmpData[cmpIdx].c].classList.add('correct');fb('fbCmp','Incorrecto. Revisa bien la respuesta.',false);sfx('no');}setTimeout(()=>{cmpIdx++;document.getElementById('fbCmp').classList.remove('show');showCmp();},1600);}

// ===================== WIDGETS =====================
// Widget 1: Cadena de transmisión (ordenar el camino del movimiento)
let routeSets=[
  {label:'El molino de maíz de la casa',steps:['La mano hace girar la manivela','El eje transmite el giro al tornillo sin fin','El tornillo sin fin gira despacio y con muchísima fuerza','La piedra de moler aplasta el grano de maíz']},
  {label:'La bicicleta que sube la cuesta',steps:['El pie empuja el pedal hacia abajo','El plato grande gira junto con el pedal','La cadena lleva el giro hasta el piñón','El piñón hace girar la rueda trasera','La bicicleta avanza por la calle']},
  {label:'El carrito robot con motorreductor',steps:['La batería envía corriente al motor','El motor gira muy rápido pero con poca fuerza','La caja de engranajes reduce la velocidad','El eje de salida gira despacio y con mucha fuerza','La rueda empuja el carrito con su carga']},
];
let currentRouteIdx=0,routeItems=[];
function buildRoute(){routeItems=_shuffle([...routeSets[currentRouteIdx].steps]);renderRoute();const fbEl=document.getElementById('fbRoute');if(fbEl)fbEl.classList.remove('show');}
function renderRoute(){const list=document.getElementById('routeList');if(!list)return;list.innerHTML='';routeItems.forEach((step,i)=>{const div=document.createElement('div');div.className='sort-item';div.innerHTML=`<div class="sort-arrows"><button class="sort-arrow" onclick="routeMove(${i},-1)"${i===0?' disabled':''}>▲</button><button class="sort-arrow" onclick="routeMove(${i},1)"${i===routeItems.length-1?' disabled':''}>▼</button></div><div class="sort-step-num">${i+1}.</div><div class="sort-item-txt">${step}</div>`;list.appendChild(div);});}
function routeMove(idx,dir){sfx('click');const ni=idx+dir;if(ni<0||ni>=routeItems.length)return;[routeItems[idx],routeItems[ni]]=[routeItems[ni],routeItems[idx]];renderRoute();}
function checkRoute(){const correct=routeSets[currentRouteIdx].steps;const isOk=routeItems.every((s,i)=>s===correct[i]);if(isOk){fb('fbRoute','¡Perfecto! Orden correcto. +4 XP',true);if(!xpTracker.wgt.has('route_'+currentRouteIdx)){xpTracker.wgt.add('route_'+currentRouteIdx);pts(4);}sfx('fan');fin('s-widgets');unlockAchievement('widgets_master');}else{fb('fbRoute','Hay pasos fuera de orden. Recuerda: energía → motor → mecanismo → trabajo final.',false);sfx('no');}}
function nextRoute(){sfx('click');currentRouteIdx=(currentRouteIdx+1)%routeSets.length;buildRoute();showToast('🔄 Caso: '+routeSets[currentRouteIdx].label);}

// Widget 2: ¿Qué mecanismo necesita?
let neuronPartes=[
  {desc:'Levantar una piedra pesada del patio usando una barra de hierro',ans:'Palanca',opts:['Palanca','Correa y poleas','Biela-manivela','Rueda y eje']},
  {desc:'Subir el balde de agua desde el fondo del pozo jalando hacia abajo',ans:'Polea',opts:['Polea','Engranajes','Tornillo sin fin','Palanca']},
  {desc:'Llevar el giro del motor a un eje que está lejos, sin que se toquen',ans:'Correa y poleas',opts:['Correa y poleas','Palanca','Tornillo sin fin','Punto de apoyo']},
  {desc:'Que la rueda del robot gire despacio pero con mucha más fuerza',ans:'Engranajes de reducción',opts:['Engranajes de reducción','Polea fija','Biela-manivela','Rueda y eje']},
  {desc:'Convertir el giro del motor en un movimiento de ida y vuelta, como una sierra',ans:'Biela-manivela',opts:['Biela-manivela','Engranajes de reducción','Correa y poleas','Polea']},
  {desc:'Abrir un portón muy pesado con un motor pequeño, y que no se devuelva solo',ans:'Tornillo sin fin',opts:['Tornillo sin fin','Palanca','Correa y poleas','Biela-manivela']},
  {desc:'Mover un carretón lleno de arena con el menor esfuerzo posible',ans:'Rueda y eje',opts:['Rueda y eje','Tornillo sin fin','Biela-manivela','Correa y poleas']},
  {desc:'Llevar el giro del pedal hasta la rueda trasera de la bicicleta sin resbalar',ans:'Cadena y piñones',opts:['Cadena y piñones','Polea','Palanca','Biela-manivela']},
];
let neuronIdx=0,neuronDone=false;
function showNeuron(){neuronDone=false;if(neuronIdx>=neuronPartes.length){const el=document.getElementById('neuronDesc');if(el)el.textContent='🎉 ¡Eres todo un técnico de mecanismos!';const opts=document.getElementById('neuronOpts');if(opts)opts.innerHTML='';fin('s-widgets');return;}const d=neuronPartes[neuronIdx];const prog=document.getElementById('neuronProg');if(prog)prog.textContent=`Pista ${neuronIdx+1} de ${neuronPartes.length}`;const desc=document.getElementById('neuronDesc');if(desc)desc.textContent=d.desc;const opts=document.getElementById('neuronOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=opt;b.onclick=()=>checkNeuron(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuron');if(fbEl)fbEl.classList.remove('show');}
function checkNeuron(opt,btn,d){if(neuronDone)return;neuronDone=true;document.querySelectorAll('#neuronOpts .cmp-opt').forEach(b=>{if(b.textContent===d.ans)b.classList.add('correct');else if(b===btn&&b.textContent!==d.ans)b.classList.add('wrong');});const isOk=opt===d.ans;if(isOk){fb('fbNeuron','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuron_'+neuronIdx)){xpTracker.wgt.add('neuron_'+neuronIdx);pts(3);}sfx('ok');}else{fb('fbNeuron','La respuesta correcta es: '+d.ans,false);sfx('no');}}
function nextNeuron(){sfx('click');neuronIdx++;showNeuron();}
function resetNeuron(){sfx('click');neuronIdx=0;showNeuron();}

// Widget 3: Mecanismo → Función
let neuroPairs=[
  {trans:'Engranaje',func:'Transmite el giro con sus dientes; el que sigue gira al revés',opts:['Transmite el giro con sus dientes; el que sigue gira al revés','Guarda la energía de la batería','Convierte el giro en vaivén','Sostiene el punto de apoyo']},
  {trans:'Polea y correa',func:'Llevan el giro a distancia de un eje a otro',opts:['Llevan el giro a distancia de un eje a otro','Cortan la corriente eléctrica','Multiplican la fuerza con una barra','Marcan el ángulo exacto']},
  {trans:'Palanca',func:'Multiplica la fuerza girando sobre un punto de apoyo',opts:['Multiplica la fuerza girando sobre un punto de apoyo','Transforma el giro en vaivén','Aumenta la velocidad del motor','Transmite el giro a distancia']},
  {trans:'Tornillo sin fin',func:'Da muchísima fuerza y muy poca velocidad',opts:['Da muchísima fuerza y muy poca velocidad','Da muchísima velocidad y poca fuerza','Cambia el color del movimiento','Sirve de punto de apoyo']},
  {trans:'Biela-manivela',func:'Convierte el movimiento de giro en movimiento de vaivén',opts:['Convierte el movimiento de giro en movimiento de vaivén','Convierte el vaivén en electricidad','Transmite el giro sin cambiarlo','Levanta el balde del pozo']},
];
let neuroIdx=0,neuroDone=false;
function showNeuro(){neuroDone=false;if(neuroIdx>=neuroPairs.length){const el=document.getElementById('neuroTrans');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('neuroOpts');if(opts)opts.innerHTML='';return;}const d=neuroPairs[neuroIdx];const prog=document.getElementById('neuroProg');if(prog)prog.textContent=`${neuroIdx+1} de ${neuroPairs.length}`;const trans=document.getElementById('neuroTrans');if(trans)trans.textContent=d.trans;const opts=document.getElementById('neuroOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkNeuro(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuro');if(fbEl)fbEl.classList.remove('show');}
function checkNeuro(opt,btn,d){if(neuroDone)return;neuroDone=true;document.querySelectorAll('#neuroOpts .qz-opt').forEach(b=>{if(b.textContent===d.func)b.classList.add('correct');else if(b===btn&&b.textContent!==d.func)b.classList.add('wrong');});const isOk=opt===d.func;if(isOk){fb('fbNeuro','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuro_'+neuroIdx)){xpTracker.wgt.add('neuro_'+neuroIdx);pts(3);}sfx('ok');}else{fb('fbNeuro','Correcto: '+d.func,false);sfx('no');}setTimeout(()=>{neuroIdx++;showNeuro();},1800);}
function resetNeuro(){sfx('click');neuroIdx=0;showNeuro();}

// Widget 4: ¿Gana fuerza o gana velocidad?
let enfermedadData=[
  {disease:'Un piñón de 10 dientes mueve una rueda dentada de 40',characteristic:'Gana fuerza (gira más lento)',opts:['Gana fuerza (gira más lento)','Gana velocidad (con menos fuerza)']},
  {disease:'Una rueda dentada de 40 dientes mueve un piñón de 10',characteristic:'Gana velocidad (con menos fuerza)',opts:['Gana velocidad (con menos fuerza)','Gana fuerza (gira más lento)']},
  {disease:'El plato grande de la bicicleta mueve el piñón más pequeño',characteristic:'Gana velocidad (con menos fuerza)',opts:['Gana velocidad (con menos fuerza)','Gana fuerza (gira más lento)']},
  {disease:'El motor pequeño mueve el tornillo sin fin del portón',characteristic:'Gana fuerza (gira más lento)',opts:['Gana fuerza (gira más lento)','Gana velocidad (con menos fuerza)']},
  {disease:'Una polea pequeña mueve, con la correa, una polea grande',characteristic:'Gana fuerza (gira más lento)',opts:['Gana fuerza (gira más lento)','Gana velocidad (con menos fuerza)']},
  {disease:'Una polea grande mueve, con la correa, una polea pequeña',characteristic:'Gana velocidad (con menos fuerza)',opts:['Gana velocidad (con menos fuerza)','Gana fuerza (gira más lento)']},
];
let enferIdx=0,enferDone=false;
function showEnfer(){enferDone=false;if(enferIdx>=enfermedadData.length){const el=document.getElementById('enferDisease');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('enferOpts');if(opts)opts.innerHTML='';return;}const d=enfermedadData[enferIdx];const prog=document.getElementById('enferProg');if(prog)prog.textContent=`${enferIdx+1} de ${enfermedadData.length}`;const dis=document.getElementById('enferDisease');if(dis)dis.textContent=d.disease;const opts=document.getElementById('enferOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkEnfer(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbEnfer');if(fbEl)fbEl.classList.remove('show');}
function checkEnfer(opt,btn,d){if(enferDone)return;enferDone=true;document.querySelectorAll('#enferOpts .qz-opt').forEach(b=>{if(b.textContent===d.characteristic)b.classList.add('correct');else if(b===btn&&b.textContent!==d.characteristic)b.classList.add('wrong');});const isOk=opt===d.characteristic;if(isOk){fb('fbEnfer','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('enfer_'+enferIdx)){xpTracker.wgt.add('enfer_'+enferIdx);pts(3);}sfx('ok');}else{fb('fbEnfer','Correcto: '+d.characteristic+'. Recuerda: la rueda GRANDE siempre gira más lento y con más fuerza.',false);sfx('no');}setTimeout(()=>{enferIdx++;showEnfer();},1800);}
function resetEnfer(){sfx('click');enferIdx=0;showEnfer();}

// ===================== RETO FINAL =====================
let retoPairs=[
  {label:['Más fuerza','Más velocidad'],btnA:'💪 Más fuerza',btnB:'⚡ Más velocidad',colA:'fue',colB:'vel',
   words:[{w:'Piñón mueve rueda grande',t:'fue'},{w:'Rueda grande mueve piñón',t:'vel'},{w:'Tornillo sin fin',t:'fue'},{w:'Motor DC sin reducción',t:'vel'},{w:'Motorreductor',t:'fue'},{w:'Polea pequeña a polea grande',t:'fue'},{w:'Polea grande a polea pequeña',t:'vel'},{w:'Piñón chico de la bici',t:'vel'},{w:'Piñón grande para la cuesta',t:'fue'},{w:'Palanca larga',t:'fue'}]},
  {label:['Giro','Vaivén'],btnA:'🔄 Giro',btnB:'↔️ Vaivén',colA:'gir',colB:'vai',
   words:[{w:'Rueda',t:'gir'},{w:'Engranaje',t:'gir'},{w:'Polea',t:'gir'},{w:'Biela-manivela',t:'vai'},{w:'Pistón',t:'vai'},{w:'Aguja de máquina de coser',t:'vai'},{w:'Cadena de bicicleta',t:'gir'},{w:'Sierra que va y viene',t:'vai'},{w:'Eje del motor',t:'gir'},{w:'Limpiaparabrisas',t:'vai'}]},
  {label:['Por contacto','A distancia'],btnA:'🦷 Por contacto',btnB:'🪢 A distancia',colA:'con',colB:'dis',
   words:[{w:'Engranajes',t:'con'},{w:'Correa y poleas',t:'dis'},{w:'Tornillo sin fin',t:'con'},{w:'Cadena y piñones',t:'dis'},{w:'Piñón con cremallera',t:'con'},{w:'Faja del molino',t:'dis'},{w:'Piñón con piñón',t:'con'},{w:'Correa cruzada',t:'dis'}]},
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
  {s:'El motor convierte la energía eléctrica en movimiento de giro.',type:'Motor (actuador)'},
  {s:'El servomotor gira hasta un ángulo exacto y se detiene ahí.',type:'Servomotor'},
  {s:'Dos ruedas dentadas encajan sus dientes y giran al revés una de la otra.',type:'Engranajes'},
  {s:'Una cinta une dos ruedas con canal y lleva el giro a distancia.',type:'Polea y correa'},
  {s:'Una barra apoyada en un punto fijo levanta una piedra pesada.',type:'Palanca'},
  {s:'Un gusano roscado mueve una rueda dentada con muchísima fuerza.',type:'Tornillo sin fin'},
  {s:'El giro del motor se convierte en un movimiento de ida y vuelta.',type:'Biela-manivela'},
  {s:'La rueda gira junto con su eje y arrastra la carreta.',type:'Rueda y eje'},
  {s:'El plato de la bicicleta mueve el piñón de la rueda trasera.',type:'Cadena y piñones'},
  {s:'Al engranaje del medio solo le toca cambiar el sentido del giro.',type:'Engranaje loco'},
];
let classifyTaskDB=[
  {w:'Engranaje pequeño moviendo a uno grande',gen:'Reducción: menos velocidad, más fuerza',n:'Sentidos contrarios',g:'Fuerza',t:'La despulpadora de café'},
  {w:'Engranaje grande moviendo a uno pequeño',gen:'Multiplicación: más velocidad, menos fuerza',n:'Sentidos contrarios',g:'Velocidad',t:'El ventilador de mesa'},
  {w:'Tren de tres engranajes iguales',gen:'Solo cambia el sentido del giro',n:'El 1º y el 3º giran igual',g:'Ni fuerza ni velocidad: quedan iguales',t:'El molinete del portón'},
  {w:'Poleas unidas por una correa abierta',gen:'Transmite el giro a distancia',n:'Mismo sentido',g:'Depende del tamaño de las poleas',t:'La faja del molino'},
  {w:'Poleas unidas por una correa cruzada',gen:'Transmite el giro e invierte el sentido',n:'Sentidos contrarios',g:'Depende del tamaño de las poleas',t:'Talleres y máquinas antiguas'},
  {w:'Palanca con el apoyo cerca de la carga',gen:'Multiplica la fuerza de la persona',n:'La barra sube y baja (vaivén)',g:'Fuerza',t:'La carretilla del albañil'},
  {w:'Tornillo sin fin con rueda dentada',gen:'Reducción muy grande; no se devuelve solo',n:'Cambia el eje del giro 90°',g:'Fuerza',t:'El molino de maíz'},
  {w:'Biela-manivela',gen:'Transforma el giro en vaivén',n:'La manivela gira, la biela va y viene',g:'Ni fuerza ni velocidad: cambia el tipo de movimiento',t:'La máquina de coser de pedal'},
];
let completeTaskDB=[
  {s:'El motor convierte la electricidad en movimiento de ___.',opts:['giro','olor','sonido'],ans:'giro'},
  {s:'Dos engranajes en contacto giran en sentidos ___.',opts:['contrarios','iguales','lentos'],ans:'contrarios'},
  {s:'Un piñón pequeño que mueve una rueda grande da más ___.',opts:['fuerza','velocidad','luz'],ans:'fuerza'},
  {s:'Una rueda grande que mueve un piñón pequeño da más ___.',opts:['velocidad','fuerza','peso'],ans:'velocidad'},
  {s:'La palanca gira sobre su punto de ___.',opts:['apoyo','madera','color'],ans:'apoyo'},
  {s:'Si la correa va cruzada, el giro se ___.',opts:['invierte','detiene','apaga'],ans:'invierte'},
  {s:'El tornillo ___ da mucha fuerza y poca velocidad.',opts:['sin fin','de banco','de madera'],ans:'sin fin'},
  {s:'La biela-manivela convierte el giro en ___.',opts:['vaivén','calor','sonido'],ans:'vaivén'},
];
let explainQuestions=[
  {q:'Explica con tus palabras qué hace un motor y por qué casi siempre necesita un mecanismo.',ans:'El motor convierte la energía eléctrica en movimiento de giro, pero gira muy rápido y con poca fuerza. Los mecanismos (engranajes, poleas, palancas) transmiten ese giro y lo cambian: sirven para conseguir la fuerza o la velocidad que el trabajo necesita.'},
  {q:'Dibuja tres engranajes en fila y marca con flechas hacia dónde gira cada uno. Explica la regla.',ans:'Cada par en contacto gira en sentidos contrarios, así que las flechas se alternan. Por eso el primero y el tercero giran en el mismo sentido; el del medio es el engranaje loco y no cambia la velocidad.'},
  {q:'¿Qué cambia en la bicicleta al usar un piñón grande en vez de uno pequeño? ¿Cuándo conviene cada uno?',ans:'Con el piñón grande la rueda gira más lento pero con más fuerza: conviene para subir cuestas. Con el piñón pequeño la rueda gira más rápido pero con menos fuerza: conviene en plano. Es el intercambio fuerza-velocidad.'},
  {q:'Inventa un mecanismo para resolver un problema de tu casa o tu comunidad y explica por qué lo elegiste.',ans:'Respuesta libre. Debe nombrar el mecanismo (palanca, polea, engranajes, correa, tornillo sin fin o biela-manivela), decir si necesita fuerza o velocidad y explicar el intercambio: lo que gana en fuerza lo pierde en velocidad.'},
  {q:'Escoge 5 máquinas de tu casa o tu comunidad y di qué mecanismo usa cada una.',ans:'Respuesta libre. Por ejemplo: molino de maíz (tornillo sin fin), bicicleta (cadena y piñones), carretilla (palanca + rueda y eje), pozo (polea), máquina de coser (biela-manivela), despulpadora de café (engranajes).'},
];
let ansVisible=false;
function genTask(){sfx('click');const type=document.getElementById('tgType').value;const count=parseInt(document.getElementById('tgCount').value);ansVisible=false;const out=document.getElementById('tgOut');out.innerHTML='';if(type==='identify')genIdentifyTask(out,count);else if(type==='classify')genClassifyTask(out,count);else if(type==='complete')genCompleteTask(out,count);else if(type==='explain')genExplainTask(out,count);fin('s-tareas');}
function _instrBlock(out,title,lines){const ib=document.createElement('div');ib.className='tg-instruction-block';ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join('');out.appendChild(ib);}
function genIdentifyTask(out,count){_instrBlock(out,'Instrucción',['Copia en tu cuaderno; subraya, colorea o encierra el mecanismo indicado en cada oración. Escribe al lado cómo se llama.','<strong>Ejemplo:</strong> Una barra apoyada en un punto fijo levanta una piedra. → <span style="color:var(--jade);font-weight:700;">Palanca</span>']);_pick(identifyTaskDB,Math.min(count,identifyTaskDB.length)).forEach((item,i)=>{const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.type}</div></div>`;out.appendChild(div);});}
function genClassifyTask(out,count){_instrBlock(out,'Instrucción',['Copia la siguiente tabla en tu cuaderno. Para cada montaje responde: ¿qué hace?, ¿en qué sentido gira?, ¿gana fuerza o velocidad? y escribe un ejemplo real.']);const items=_pick(classifyTaskDB,Math.min(count,classifyTaskDB.length));const wrap=document.createElement('div');wrap.style.overflowX='auto';const th=(t,extra='')=>`<th style="padding:0.3rem 0.4rem;border:1px solid var(--border);font-size:0.72rem;text-align:center;${extra}">${t}</th>`;let html=`<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:520px;"><thead><tr style="background:var(--pri-gl);">${th('Montaje o mecanismo','text-align:left;')}${th('¿Qué hace?')}${th('¿Sentido del giro?')}${th('¿Fuerza o velocidad?')}${th('Ejemplo real')}</tr></thead><tbody>`;items.forEach(it=>{html+=`<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td>`+Array(4).fill(`<td style="padding:0.4rem;border:1px solid var(--border);min-width:50px;"></td>`).join('')+'</tr>';});html+='</tbody></table>';wrap.innerHTML=html;out.appendChild(wrap);const ans=document.createElement('div');ans.className='tg-answer';ans.style.marginTop='0.8rem';ans.innerHTML='<strong>✅ Respuestas:</strong><br>'+items.map(it=>`<strong>${it.w}:</strong> ¿Qué hace?: ${it.gen} | ¿Sentido?: ${it.n} | ¿Fuerza o velocidad?: ${it.g} | Ejemplo: ${it.t}`).join('<br>');out.appendChild(ans);}
function genCompleteTask(out,count){_instrBlock(out,'Instrucción',['Copia y resuelve en tu cuaderno. Cada oración tiene un espacio ___. Elige y escribe la opción correcta.']);const pool=_shuffle([...completeTaskDB]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';const sent=item.s.replace('___','<span class="tg-blank" style="min-width:90px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${sent}</strong><div style="margin-top:0.4rem;font-size:0.82rem;color:var(--gray);">📝 Opciones: <strong>${item.opts.join(' | ')}</strong></div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function genExplainTask(out,count){_instrBlock(out,'Instrucción',['Copia las siguientes preguntas en tu cuaderno y responde cada una de forma clara y completa. Puedes acompañarlas con dibujos.']);const pool=_shuffle([...explainQuestions]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.3rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function toggleAns(){ansVisible=!ansVisible;document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none');sfx('click');}

// ===================== SOPA DE LETRAS =====================
let sopaSets=[
  {size:10,grid:[
    ['T','R','K','H','S','C','M','H','A','S'],
    ['J','M','C','E','A','A','E','L','O','P'],
    ['F','X','C','R','G','T','B','E','M','A'],
    ['A','W','B','C','M','I','V','O','B','N'],
    ['J','C','D','I','E','N','T','E','Y','E'],
    ['T','D','N','X','P','O','E','T','I','D'],
    ['Y','H','C','A','R','V','L','W','V','A'],
    ['U','M','E','P','L','V','Q','Q','T','C'],
    ['P','E','N','G','R','A','N','A','J','E'],
    ['L','V','K','T','F','T','P','R','U','B']
  ],words:[
    {w:'MOTOR',cells:[[2,8],[3,7],[4,6],[5,5],[6,4]]},
    {w:'ENGRANAJE',cells:[[8,1],[8,2],[8,3],[8,4],[8,5],[8,6],[8,7],[8,8],[8,9]]},
    {w:'POLEA',cells:[[1,9],[1,8],[1,7],[1,6],[1,5]]},
    {w:'PALANCA',cells:[[9,6],[8,5],[7,4],[6,3],[5,2],[4,1],[3,0]]},
    {w:'DIENTE',cells:[[4,2],[4,3],[4,4],[4,5],[4,6],[4,7]]},
    {w:'CADENA',cells:[[7,9],[6,9],[5,9],[4,9],[3,9],[2,9]]}
  ]},
  {size:10,grid:[
    ['S','H','T','R','A','H','P','N','R','N'],
    ['J','J','U','L','S','T','H','K','Q','O'],
    ['Y','I','A','S','N','T','R','Z','D','L'],
    ['N','H','L','U','M','N','I','G','A','L'],
    ['A','L','E','V','I','N','A','M','Z','I'],
    ['S','T','I','G','T','X','F','S','R','N'],
    ['W','P','B','F','X','Q','J','Y','E','R'],
    ['V','X','R','U','E','D','A','N','U','O'],
    ['C','O','R','R','E','A','K','P','F','T'],
    ['Y','J','L','K','C','A','K','P','I','K']
  ],words:[
    {w:'CORREA',cells:[[8,0],[8,1],[8,2],[8,3],[8,4],[8,5]]},
    {w:'MANIVELA',cells:[[4,7],[4,6],[4,5],[4,4],[4,3],[4,2],[4,1],[4,0]]},
    {w:'BIELA',cells:[[6,2],[5,2],[4,2],[3,2],[2,2]]},
    {w:'TORNILLO',cells:[[8,9],[7,9],[6,9],[5,9],[4,9],[3,9],[2,9],[1,9]]},
    {w:'FUERZA',cells:[[8,8],[7,8],[6,8],[5,8],[4,8],[3,8]]},
    {w:'RUEDA',cells:[[7,2],[7,3],[7,4],[7,5],[7,6]]}
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
  {q:'El motor convierte la energía eléctrica en movimiento de giro.',a:true},
  {q:'Dos engranajes que encajan sus dientes giran en el mismo sentido.',a:false},
  {q:'Un engranaje pequeño que mueve a uno grande le da más fuerza.',a:true},
  {q:'Un engranaje grande que mueve a uno pequeño le da más velocidad.',a:true},
  {q:'Con los mecanismos se gana fuerza y velocidad al mismo tiempo.',a:false},
  {q:'En un tren de tres engranajes, el primero y el tercero giran igual.',a:true},
  {q:'Si la correa entre dos poleas va cruzada, el giro se invierte.',a:true},
  {q:'El servomotor gira sin parar y nunca se detiene en un ángulo exacto.',a:false},
  {q:'La palanca necesita un punto de apoyo para funcionar.',a:true},
  {q:'El tornillo sin fin sirve para ganar muchísima velocidad.',a:false},
  {q:'La biela-manivela transforma el giro en movimiento de vaivén.',a:true},
  {q:'En la bicicleta, un piñón pequeño hace que la rueda gire más rápido.',a:true},
  {q:'El molino de maíz aprovecha un mecanismo que da mucha fuerza.',a:true},
  {q:'Las poleas con correa sirven para transmitir el giro a distancia.',a:true},
  {q:'La palanca multiplica la fuerza sin ninguna desventaja.',a:false},
];
let evalMCBank=[
  {q:'¿Qué hace el motor de un robot?',o:['a) Guarda la información del programa','b) Convierte la energía eléctrica en movimiento de giro','c) Percibe la luz del ambiente','d) Enfría la batería'],a:1},
  {q:'Dos engranajes con los dientes encajados, ¿cómo giran?',o:['a) En el mismo sentido','b) Uno gira y el otro se queda quieto','c) En sentidos contrarios','d) Los dos hacia arriba'],a:2},
  {q:'Un engranaje de 10 dientes mueve a uno de 30. ¿Qué le pasa al de 30?',o:['a) Gira más lento y con más fuerza','b) Gira más rápido y con más fuerza','c) Gira más rápido y con menos fuerza','d) No gira'],a:0},
  {q:'Una rueda dentada de 40 dientes mueve un piñón de 10. ¿Qué le pasa al piñón?',o:['a) Gira más lento','b) Gira más rápido y con menos fuerza','c) Gira con más fuerza','d) Gira igual que la rueda'],a:1},
  {q:'En un tren de TRES engranajes, el primero y el tercero…',o:['a) Giran en sentidos contrarios','b) Giran en el mismo sentido','c) No giran nunca','d) Giran al doble de velocidad'],a:1},
  {q:'¿Qué motor gira hasta un ángulo exacto y se queda ahí?',o:['a) El motor DC','b) El motorreductor','c) El servomotor','d) El tornillo sin fin'],a:2},
  {q:'¿Para qué sirve la correa entre dos poleas?',o:['a) Para llevar el giro a distancia','b) Para guardar energía','c) Para frenar el motor','d) Para pintar la rueda'],a:0},
  {q:'¿Qué ocurre si la correa se coloca cruzada?',o:['a) La correa se rompe','b) El segundo eje gira al revés','c) No pasa nada','d) La polea se hace más grande'],a:1},
  {q:'¿Qué necesita una palanca para funcionar?',o:['a) Un motor eléctrico','b) Una batería','c) Una correa','d) Un punto de apoyo'],a:3},
  {q:'La palanca multiplica la fuerza, pero a cambio…',o:['a) Recorre menos distancia el lado de la carga','b) Se rompe siempre','c) Necesita electricidad','d) Gira sin parar'],a:0},
  {q:'¿Qué mecanismo transforma el giro en movimiento de vaivén?',o:['a) La polea fija','b) La rueda y el eje','c) La biela-manivela','d) El engranaje loco'],a:2},
  {q:'¿Qué mecanismo da muchísima fuerza y muy poca velocidad?',o:['a) El tornillo sin fin','b) El motor DC solo','c) La polea fija','d) El engranaje loco'],a:0},
  {q:'En la bicicleta, ¿qué conviene usar para subir una cuesta empinada?',o:['a) El piñón más pequeño','b) El piñón más grande','c) Quitar la cadena','d) Un plato más grande'],a:1},
  {q:'¿Cuál es el intercambio de todo mecanismo?',o:['a) Lo que se gana en fuerza se pierde en velocidad','b) Se gana fuerza y velocidad a la vez','c) Se pierde todo','d) El mecanismo crea energía nueva'],a:0},
  {q:'¿Qué máquina hondureña usa manivela y engranajes para quitarle la cáscara al café?',o:['a) El molino de maíz','b) La despulpadora de café','c) La carretilla','d) El molinete del portón'],a:1},
];
let evalCPBank=[
  {q:'El motor convierte la energía eléctrica en movimiento de ___.',a:'giro'},
  {q:'El motor es el ___ del robot: la parte que ejecuta el movimiento.',a:'actuador'},
  {q:'El ___ gira hasta un ángulo exacto y se queda ahí.',a:'servomotor'},
  {q:'Dos engranajes en contacto giran en sentidos ___.',a:'contrarios'},
  {q:'Cada saliente de un engranaje se llama ___.',a:'diente'},
  {q:'Si un engranaje pequeño mueve a uno grande, se gana ___.',a:'fuerza'},
  {q:'Si un engranaje grande mueve a uno pequeño, se gana ___.',a:'velocidad'},
  {q:'La correa une dos ___ y transmite el giro a distancia.',a:'poleas'},
  {q:'Si la correa se coloca ___, el giro se invierte.',a:'cruzada'},
  {q:'La palanca es una barra que gira sobre su punto de ___.',a:'apoyo'},
  {q:'El ___ sin fin da mucha fuerza y muy poca velocidad.',a:'tornillo'},
  {q:'El mecanismo biela-manivela transforma el giro en ___.',a:'vaivén'},
  {q:'En la bicicleta, la ___ lleva el giro del plato hasta el piñón.',a:'cadena'},
  {q:'De tres engranajes en fila, el primero y el tercero giran en el mismo ___.',a:'sentido'},
  {q:'La palanca multiplica la fuerza, pero recorre menos ___.',a:'distancia'},
];
let evalPRBank=[
  {term:'Motor',def:'Convierte la energía eléctrica en movimiento de giro'},
  {term:'Servomotor',def:'Motor que gira hasta un ángulo exacto y se detiene ahí'},
  {term:'Motorreductor',def:'Motor con caja de engranajes: menos velocidad, más fuerza'},
  {term:'Engranaje',def:'Rueda dentada; dos en contacto giran al revés'},
  {term:'Diente',def:'Cada saliente del engranaje que encaja en el otro'},
  {term:'Engranaje loco',def:'El del medio: solo cambia el sentido del giro'},
  {term:'Polea',def:'Rueda con canal por donde pasa la cuerda o la correa'},
  {term:'Correa',def:'Cinta que une dos poleas y lleva el giro a distancia'},
  {term:'Correa cruzada',def:'Montaje que invierte el sentido del giro'},
  {term:'Palanca',def:'Barra rígida que multiplica la fuerza'},
  {term:'Punto de apoyo',def:'Punto fijo sobre el que gira la palanca'},
  {term:'Rueda y eje',def:'La rueda gira junto al eje y arrastra la carga'},
  {term:'Tornillo sin fin',def:'Gusano roscado: muchísima fuerza, poca velocidad'},
  {term:'Biela-manivela',def:'Convierte el giro en movimiento de vaivén'},
  {term:'Cadena y piñones',def:'Llevan el giro del plato al piñón de la bicicleta'},
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

function genEval(){sfx('click');_evalFormaSelector(); const _selF = document.getElementById('evalFormaSel'); if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10))); const cf = evalFormNum; const rng = _evalRng(100000 + cf); window._currentEvalForm=cf;evalFormNum = (evalFormNum % EVAL_FORMAS) + 1; _evalFormaSelector();saveProgress();document.getElementById('eval-screen-title').textContent=`🎓 Evaluación Final · Forma ${cf} · Motores y Mecanismos`;evalAnsVisible=false;const out=document.getElementById('evalOut');out.innerHTML='';const bar=document.createElement('div');bar.className='eval-score-bar';bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje · 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25 pts</span><span class="eval-score-pill esp-tf">V/F 25 pts</span><span class="eval-score-pill esp-mc">Selección 25 pts</span><span class="eval-score-pill esp-pr">Pareados 25 pts</span></div>`;out.appendChild(bar);const cpItems=_pickF(evalCPBank,5, rng);const s1=document.createElement('div');s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';cpItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='cp';d.dataset.evalIndex=i;const qHtml=item.q.replace('___',`<input class="eval-cp-input" type="text" data-cp="${i}" autocomplete="off">`);d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbCp${i}" aria-live="polite"></div>`;s1.appendChild(d);});out.appendChild(s1);const tfItems=_pickF(evalTFBank,5, rng);const s2=document.createElement('div');s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';tfItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='tf';d.dataset.evalIndex=i;d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="true"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="false"> Falso</label></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbTf${i}" aria-live="polite"></div>`;s2.appendChild(d);});out.appendChild(s2);const mcItems=_pickF(evalMCBank,5, rng);const s3=document.createElement('div');s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';mcItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='mc';d.dataset.evalIndex=i;const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join('');d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbMc${i}" aria-live="polite"></div>`;s3.appendChild(d);});out.appendChild(s3);const prItems=_pickF(evalPRBank,5, rng);let shuffledDefs=_shuffleF(prItems, rng);let _prTries=0;while(shuffledDefs.some((df,ix)=>df.def===prItems[ix].def)&&_prTries<20){shuffledDefs=_shuffleF(shuffledDefs, rng);_prTries++;}const letters=['A','B','C','D','E'];const s4=document.createElement('div');s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';const matchCard=document.createElement('div');matchCard.className='eval-item';let colLeft='<div class="eval-match-col"><h4>📌 Términos</h4>';prItems.forEach((item,i)=>{colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> <select class="eval-match-select" data-pr="${i}" aria-label="Respuesta pareada ${i+16}"><option value="">—</option>${letters.map(l=>`<option value="${l}">${l}</option>`).join('')}</select> ${item.term}</div>`;});colLeft+='</div>';let colRight='<div class="eval-match-col"><h4>🔑 Definiciones</h4>';shuffledDefs.forEach((item,i)=>{colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`;});colRight+='</div>';const ansKey=prItems.map((item,i)=>{const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)];return`${i+16}→${letter}`;}).join(' · ');matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div><div class="eval-item-feedback" id="evalFbPr" aria-live="polite"></div>`;s4.appendChild(matchCard);out.appendChild(s4);window._evalPrintData={tf:tfItems,mc:mcItems,cp:cpItems,pr:{terms:prItems,shuffledDefs,letters}};const autoPanel=document.createElement('div');autoPanel.id='evalAutoResult';autoPanel.className='eval-auto-result';autoPanel.innerHTML='<strong>🧮 Evaluación interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato original sin respuestas digitadas.';out.appendChild(autoPanel);fin('s-evaluacion');}
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación Motores y Mecanismos · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.12rem 0.4rem;margin:0.22rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #0e7490;background:#ecfeff;color:#0e7490;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#0e7490;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #0e7490;height:12px;}.obt-pct{white-space:nowrap;}.qn{font-weight:700;min-width:22px;flex-shrink:0;}.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:40px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.18rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.14rem 0.35rem;margin-bottom:0.1rem;break-inside:avoid;page-break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.3;display:flex;gap:0.28rem;margin-bottom:0.07rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.1rem 0.5rem;}.mc-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:0.04rem 0.15rem;margin-left:0.8rem;}.mc-opt{font-size:9pt;display:flex;align-items:center;gap:0.15rem;}.mc-opt input{width:10px;height:10px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{margin-top:0.1rem;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.08rem 0.4rem;margin-top:0.08rem;}.pr-head{font-size:9pt;font-weight:700;color:#555;margin-bottom:0.1rem;}.pr-item{font-size:10.5pt;padding:0.1rem 0.28rem;background:#ecfeff;border-radius:3px;margin-bottom:0.07rem;display:flex;align-items:center;gap:0.2rem;line-height:1.2;break-inside:avoid;page-break-inside:avoid;}.pr-num{font-weight:700;color:#0e7490;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.22rem;padding:0.15rem 0;page-break-before:avoid;break-before:avoid;color:#0e7490;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #0e7490;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#555;}.pa{color:#007a00;font-weight:600;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · Motores y Mecanismos · Educación Básica · Robótica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Evaluación Final · Motores y Mecanismos · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u</div></div><div class="p-grid">${pR}</div>
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
let critMecBank=[
  {txt:'En la escuela hay que subir un balde de agua desde el pozo, pero los niños no logran jalar la cuerda hacia arriba.',ans:'Una POLEA fija en el brocal: cambia la dirección de la fuerza y permite jalar hacia abajo, que es más cómodo; con una polea móvil, además, hace falta menos fuerza.'},
  {txt:'Un motor pequeño tiene que abrir un portón muy pesado, y el portón no debe devolverse solo.',ans:'Un TORNILLO SIN FIN (o una caja reductora de engranajes): baja mucho la velocidad y multiplica la fuerza; además el tornillo sin fin no deja que la carga lo haga girar al revés.'},
  {txt:'Hay que llevar el giro del motor hasta un eje que está a medio metro de distancia, sin que las piezas se toquen.',ans:'POLEAS Y CORREA (o cadena y piñones): transmiten el giro a distancia. Si la correa se coloca cruzada, el segundo eje además gira al revés.'},
  {txt:'Un robot debe mover un letrero de un lado a otro, una y otra vez, con el motor girando siempre en el mismo sentido.',ans:'Una BIELA-MANIVELA: transforma el movimiento de giro del motor en movimiento de vaivén (ida y vuelta), como la aguja de la máquina de coser.'},
  {txt:'En el patio hay que levantar una piedra grande y solo se cuenta con una barra de hierro y un bloque.',ans:'Una PALANCA: la barra apoyada en el bloque (punto de apoyo) cerca de la piedra multiplica la fuerza; a cambio, el extremo donde se empuja recorre más distancia.'},
  {txt:'El carrito robot avanza rapidísimo, pero se queda pegado cuando sube una rampa con un libro encima.',ans:'ENGRANAJES DE REDUCCIÓN (un piñón pequeño moviendo una rueda dentada grande) o un motorreductor: pierde velocidad, pero gana la fuerza que necesita para subir.'},
];
let critErrorBank=[
  {txt:'"Con los engranajes se gana fuerza y velocidad al mismo tiempo."',
   g1:'Falso: el mecanismo no crea energía, solo la reparte. Lo que se gana en fuerza se pierde en velocidad.',
   g2:'Si la rueda grande gira más lento es justamente porque está entregando más fuerza: nunca se gana todo.'},
  {txt:'"Dos engranajes que encajan giran siempre hacia el mismo lado."',
   g1:'Al revés: dos engranajes en contacto giran en SENTIDOS CONTRARIOS, porque los dientes se empujan.',
   g2:'Para que el primero y el último giren igual hay que poner TRES engranajes; el del medio es el engranaje loco.'},
  {txt:'"El motor solo, sin ningún mecanismo, sirve para levantar cosas pesadas."',
   g1:'El motor DC gira muy rápido pero con muy poca fuerza: por sí solo casi no levanta nada.',
   g2:'Necesita una reducción (engranajes o tornillo sin fin) que cambie velocidad por fuerza: eso es un motorreductor.'},
  {txt:'"En la bicicleta, el piñón más grande sirve para ir más rápido."',
   g1:'Es al contrario: con el piñón grande la rueda gira más lento, pero con más fuerza (sirve para subir cuestas).',
   g2:'Para ir más rápido en terreno plano se usa el piñón pequeño: más velocidad, menos fuerza.'},
  {txt:'"La palanca hace que la fuerza aparezca de la nada."',
   g1:'La palanca multiplica la fuerza, pero a cambio el extremo donde empujas recorre MÁS distancia que la carga.',
   g2:'Y sin punto de apoyo no hay palanca: la barra necesita un punto fijo sobre el cual girar.'},
];
let critTrenQuestions=[
  '1. ¿En qué sentido gira el último engranaje? Explica por qué.',
  '2. ¿Gira más rápido o con más fuerza que el primero? Explica el porqué con los dientes.',
  '3. ¿Qué cambiarías en el montaje para conseguir el efecto contrario?',
];
let critTrenBank=[
  {txt:'Un motor mueve un piñón de 10 dientes y ese piñón mueve una rueda dentada de 30 dientes. El primero gira a la DERECHA (horario).',
   p:'La rueda de 30 gira a la IZQUIERDA (antihorario): dos engranajes en contacto siempre giran en sentidos contrarios.',
   d:'Gira 3 veces más lento, pero con 3 veces más fuerza (30 ÷ 10 = 3): el pequeño moviendo al grande da fuerza.',
   a:'Para ganar velocidad habría que invertirlo: que la rueda de 30 fuera la que mueve al piñón de 10.'},
  {txt:'Una rueda dentada de 40 dientes mueve un piñón de 10 dientes. La rueda grande gira a la IZQUIERDA.',
   p:'El piñón gira a la DERECHA: en cada contacto el sentido se invierte.',
   d:'Gira 4 veces más rápido, pero con 4 veces menos fuerza (40 ÷ 10 = 4): el grande moviendo al pequeño da velocidad.',
   a:'Si hiciera falta fuerza (por ejemplo, para levantar peso), pondría el piñón pequeño moviendo a la rueda grande.'},
  {txt:'Tres engranajes en fila: 20, 12 y 20 dientes. El primero gira a la DERECHA.',
   p:'El tercero también gira a la DERECHA: con tres engranajes, el primero y el tercero giran en el mismo sentido.',
   d:'Gira a la MISMA velocidad y con la misma fuerza: el del medio es un engranaje loco y no cambia la relación, porque el primero y el último tienen los mismos dientes.',
   a:'Para ganar fuerza habría que cambiar el último por uno con más dientes que el primero (o quitar el loco para invertir el sentido).'},
  {txt:'El motor mueve un piñón de 10 dientes, ese mueve uno de 20 y ese último mueve otro de 40. El motor gira a la IZQUIERDA.',
   p:'El último gira también a la IZQUIERDA: al ser tres engranajes, el primero y el tercero giran igual.',
   d:'Gira 4 veces más lento y con 4 veces más fuerza (40 ÷ 10 = 4): solo cuentan el primero y el último; el del medio no cambia la relación.',
   a:'Para ganar velocidad habría que terminar en un engranaje con menos dientes que el primero.'},
  {txt:'Una polea pequeña montada en el motor mueve, con una correa abierta (sin cruzar), una polea grande.',
   p:'La polea grande gira en el MISMO sentido: la correa abierta no invierte el giro; solo lo invierte si se cruza.',
   d:'Gira más lento pero con más fuerza: la polea grande da menos vueltas que la pequeña en el mismo tiempo.',
   a:'Para invertir el sentido bastaría con cruzar la correa; para ganar velocidad, poner la polea grande como motriz.'},
];
let critCompareBank=[
  {a:'Dos ruedas dentadas cuyos dientes encajan y se empujan directamente.',b:'Dos ruedas con canal unidas por una cinta que da la vuelta alrededor de las dos.',
   ga:'Los engranajes.',
   gb:'Las poleas con correa.',
   gr:'Semejanza: los dos transmiten el giro de un eje a otro y pueden cambiar velocidad por fuerza. Diferencia: los engranajes trabajan pegados, invierten el sentido y no resbalan; las poleas con correa transmiten a distancia, mantienen el sentido (salvo que la correa vaya cruzada) y pueden patinar.'},
  {a:'Un piñón de 10 dientes mueve una rueda dentada de 40.',b:'Una rueda dentada de 40 dientes mueve un piñón de 10.',
   ga:'Una reducción: se gana fuerza.',
   gb:'Una multiplicación: se gana velocidad.',
   gr:'Semejanza: en los dos casos las ruedas giran en sentidos contrarios y la relación es de 1 a 4. Diferencia: el primer montaje da 4 veces más fuerza y 4 veces menos velocidad; el segundo, exactamente al revés.'},
  {a:'Motor que gira sin parar mientras le llegue corriente.',b:'Motor que gira hasta un ángulo exacto y se queda ahí.',
   ga:'El motor DC.',
   gb:'El servomotor.',
   gr:'Semejanza: los dos son actuadores y convierten electricidad en movimiento. Diferencia: el motor DC sirve para ruedas y hélices (giro continuo); el servomotor sirve para brazos, pinzas y timones, porque controla la posición exacta.'},
  {a:'Barra rígida apoyada en un punto fijo que multiplica la fuerza de la persona.',b:'Mecanismo que convierte el giro del motor en un movimiento de ida y vuelta.',
   ga:'La palanca.',
   gb:'La biela-manivela.',
   gr:'Semejanza: los dos son mecanismos que cambian la forma del movimiento y se pueden construir con cartón y materiales del entorno. Diferencia: la palanca multiplica la fuerza en un balanceo corto; la biela-manivela transforma el giro continuo en vaivén, como la máquina de coser de pedal.'},
];
let critDesignBank=[
  'En tu comunidad hay que subir sacos de café a la carreta y las personas se lastiman la espalda.',
  'El portón de la escuela es tan pesado que los niños no pueden abrirlo solos.',
  'El molino de maíz de la casa cuesta muchísimo girar: hay que hacer demasiada fuerza con la manivela.',
  'Un robot de la feria escolar debe mover un letrero de un lado a otro, sin parar, con un solo motor.',
  'El carrito robot de la clase avanza rapidísimo, pero se queda pegado cuando lleva un libro encima.',
];
let critDesignGuide='Rúbrica de 3 criterios (total 20 pts) — ① MECANISMO (7 pts): elige y nombra un mecanismo adecuado (palanca, polea, engranajes, correa, tornillo sin fin, rueda y eje o biela-manivela). ② RELACIÓN (6 pts): explica si necesita FUERZA o VELOCIDAD y cómo la consigue (cuál rueda o barra es la grande y cuál la pequeña, dónde va el punto de apoyo). ③ JUSTIFICACIÓN (7 pts): reconoce el intercambio (lo que se gana en fuerza se pierde en velocidad) y propone una solución realista con materiales del entorno. Cualquier diseño vale si el mecanismo resuelve el problema y el estudiante explica el porqué.';
function genEvalCrit(){
  sfx('click');
  _injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });
  const _sC = document.getElementById('evalCritFormaSel');
  if (_sC && parseInt(_sC.value, 10)) evalCritFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sC.value, 10)));
  const cf=evalCritFormNum;window._currentEvalCritForm=cf;const rngC = _evalRng(200000 + cf);evalCritFormNum=(evalCritFormNum%EVAL_FORMAS)+1;_injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });saveProgress();
  document.getElementById('evalcrit-screen-title').textContent=`🧠 Pensamiento Crítico · Forma ${cf} · Motores y Mecanismos`;
  evalCritAnsVisible=false;
  const out=document.getElementById('evalCritOut');out.innerHTML='';
  const sens=_pickF(critMecBank,2,rngC);
  const s1=document.createElement('div');
  s1.innerHTML=`<div class="eval-section-title">I. ¿Qué mecanismo necesita? <span class="eval-pts">20 pts</span></div><div class="eval-item">${sens.map((k,i)=>`<div class="crit-scenario">Caso ${i+1}: ${k.txt}</div><div class="crit-q-block"><div class="crit-q-label">¿Qué mecanismo necesita esta situación? Justifica tu elección: ¿hace falta FUERZA o VELOCIDAD, y por qué?</div><textarea class="crit-textarea" rows="2" aria-label="Mecanismo del caso ${i+1} y su justificación"></textarea><div class="crit-pauta">${k.ans}</div></div>`).join('')}<div class="crit-selfscore"><label for="critScore0">Obtenido:</label><input type="number" id="critScore0" class="crit-score-input" data-score="0" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s1);
  const err=_pickF(critErrorBank,1,rngC)[0];
  const s2=document.createElement('div');
  s2.innerHTML=`<div class="eval-section-title">II. Corrige el error conceptual <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${err.txt}</div><p style="font-size:0.85rem;margin-bottom:0.5rem;">Esta afirmación tiene <strong>dos errores</strong>. Corrígelos con argumentos, usando lo que sabes del sentido de giro y del intercambio fuerza-velocidad:</p><div class="crit-q-block"><div class="crit-q-label">Error 1 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 1 y su corrección"></textarea><div class="crit-pauta">${err.g1}</div></div><div class="crit-q-block"><div class="crit-q-label">Error 2 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 2 y su corrección"></textarea><div class="crit-pauta">${err.g2}</div></div><div class="crit-selfscore"><label for="critScore1">Obtenido:</label><input type="number" id="critScore1" class="crit-score-input" data-score="1" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s2);
  const cic=_pickF(critTrenBank,1,rngC)[0];
  const cicloGuides=[cic.p,cic.d,cic.a];
  const s3=document.createElement('div');
  s3.innerHTML=`<div class="eval-section-title">III. Analiza el mecanismo <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${cic.txt}</div>${critTrenQuestions.map((q,i)=>`<div class="crit-q-block"><div class="crit-q-label">${q}</div><textarea class="crit-textarea" rows="2" aria-label="${q}"></textarea><div class="crit-pauta">${cicloGuides[i]}</div></div>`).join('')}<div class="crit-selfscore"><label for="critScore2">Obtenido:</label><input type="number" id="critScore2" class="crit-score-input" data-score="2" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s3);
  const cmp=_pickF(critCompareBank,1,rngC)[0];
  const s4=document.createElement('div');
  s4.innerHTML=`<div class="eval-section-title">IV. Comparación razonada <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-compare-grid"><div class="crit-compare-box"><h5>Caso A</h5>${cmp.a}</div><div class="crit-compare-box"><h5>Caso B</h5>${cmp.b}</div></div><div class="crit-q-block"><div class="crit-q-label">1. ¿Qué concepto corresponde a cada caso? 2. ¿En qué se parecen? 3. ¿En qué se diferencian? Da un ejemplo de cada uno.</div><textarea class="crit-textarea" rows="4" aria-label="Comparación razonada de los casos A y B"></textarea><div class="crit-pauta">Caso A: ${cmp.ga} · Caso B: ${cmp.gb} · ${cmp.gr}</div></div><div class="crit-selfscore"><label for="critScore3">Obtenido:</label><input type="number" id="critScore3" class="crit-score-input" data-score="3" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s4);
  const dis=_pickF(critDesignBank,1,rngC)[0];
  const s5=document.createElement('div');
  s5.innerHTML=`<div class="eval-section-title">V. Diseña y justifica tu mecanismo <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${dis}</div><div class="crit-q-block"><div class="crit-q-label">Inventa un mecanismo que resuelva este problema: dibújalo, nómbralo (palanca, polea, engranajes, correa, tornillo sin fin o biela-manivela), di si necesitas FUERZA o VELOCIDAD y explica cómo la consigues. Señala el punto de apoyo o cuál rueda es la grande.</div><textarea class="crit-textarea" rows="5" aria-label="Diseño y justificación del mecanismo"></textarea><div class="crit-pauta">${critDesignGuide}</div></div><div class="crit-selfscore"><label for="critScore4">Obtenido:</label><input type="number" id="critScore4" class="crit-score-input" data-score="4" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
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
  let s1=`<div class="sec-title"><span>I. ¿Qué mecanismo necesita?</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div>`;
  d.sens.forEach((k,i)=>{s1+=`<p class="crit-print-scenario">Caso ${i+1}: ${k.txt}</p><p class="crit-print-q">¿Qué mecanismo necesita esta situación? Justifica tu elección.</p>${lines(1)}`;});
  let s2=`<div class="sec-title"><span>II. Corrige el error conceptual</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.err.txt}</p><p class="crit-print-q">Esta afirmación tiene dos errores. Corrígelos con argumentos, usando el sentido de giro y la relación fuerza-velocidad:</p><p class="crit-print-q"><strong>Error 1:</strong></p>${lines(1)}<p class="crit-print-q"><strong>Error 2:</strong></p>${lines(1)}`;
  let s3=`<div class="sec-title"><span>III. Analiza el mecanismo</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.cic.txt}</p>`;
  critTrenQuestions.forEach(q=>{s3+=`<p class="crit-print-q">${q}</p>${lines(1)}`;});
  let s4=`<div class="sec-title"><span>IV. Comparación razonada</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><div class="crit-compare-print-grid"><div class="crit-compare-print-box"><strong>Caso A:</strong> ${d.cmp.a}</div><div class="crit-compare-print-box"><strong>Caso B:</strong> ${d.cmp.b}</div></div><p class="crit-print-q">1. ¿Qué concepto corresponde a cada caso? 2. ¿En qué se parecen? 3. ¿En qué se diferencian? Da un ejemplo de cada uno.</p>${lines(2)}`;
  let s5=`<div class="sec-title"><span>V. Diseña y justifica tu mecanismo</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.dis}</p><p class="crit-print-q">Inventa un mecanismo que resuelva este problema: nómbralo, di si necesitas FUERZA o VELOCIDAD y explica cómo la consigues (cuál rueda es la grande, dónde va el punto de apoyo). Dibújalo al reverso de la hoja.</p>${lines(4)}`;
  let pR='';
  pR+=`<div class="p-sec"><div class="p-ttl">I. ¿Qué mecanismo necesita?</div>${d.sens.map((k,i)=>`<div class="p-crit-line"><strong>Caso ${i+1}:</strong> ${k.ans}</div>`).join('')}</div>`;
  pR+=`<div class="p-sec"><div class="p-ttl">II. Corrige el error</div><div class="p-crit-line"><strong>Error 1:</strong> ${d.err.g1}</div><div class="p-crit-line"><strong>Error 2:</strong> ${d.err.g2}</div></div>`;
  pR+=`<div class="p-sec"><div class="p-ttl">III. Analiza el mecanismo</div><div class="p-crit-line"><strong>1. Sentido de giro:</strong> ${d.cic.p}</div><div class="p-crit-line"><strong>2. Velocidad y fuerza:</strong> ${d.cic.d}</div><div class="p-crit-line"><strong>3. Qué cambiar:</strong> ${d.cic.a}</div></div>`;
  pR+=`<div class="p-sec"><div class="p-ttl">IV. Comparación</div><div class="p-crit-line"><strong>Caso A:</strong> ${d.cmp.ga}</div><div class="p-crit-line"><strong>Caso B:</strong> ${d.cmp.gb}</div><div class="p-crit-line">${d.cmp.gr}</div></div>`;
  pR+=`<div class="p-sec" style="grid-column:1/-1;"><div class="p-ttl">V. Diseña tu mecanismo — Rúbrica</div><div class="p-crit-line">${critDesignGuide}</div></div>`;
  const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Pensamiento Crítico Motores y Mecanismos · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.1rem 0.4rem;margin:0.2rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #0e7490;background:#ecfeff;color:#0e7490;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#0e7490;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #0e7490;height:12px;}.obt-pct{white-space:nowrap;}.crit-print-scenario{font-size:10.5pt;background:#ecfeff;border-left:3px solid #0e7490;padding:0.2rem 0.5rem;margin:0.1rem 0 0.2rem;line-height:1.3;}.crit-print-q{font-size:10pt;font-weight:600;margin:0.15rem 0 0.08rem;line-height:1.25;}.ln{border-bottom:1px solid #111;min-height:12px;margin-bottom:2px;}.crit-compare-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin:0.15rem 0;}.crit-compare-print-box{font-size:9.5pt;background:#ecfeff;border-radius:4px;padding:0.25rem 0.4rem;line-height:1.25;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.08rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.9rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.45rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.1rem;margin-bottom:0.18rem;}.p-crit-line{font-size:11pt;color:#007a00;margin-bottom:0.18rem;line-height:1.35;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.2rem;padding:0.1rem 0;color:#0e7490;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #0e7490;}.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:12.7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="critEvalPage"><div class="ph"><h2>Evaluación Competencial · Pensamiento Crítico · Motores y Mecanismos · Educación Básica · Robótica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 5 secciones de 20 puntos</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100</span></div></div><div class="pauta-wrap" id="critPautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Pensamiento Crítico · Motores y Mecanismos · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 5 secciones × 20 pts c/u — respuesta abierta, usar como guía de corrección</div></div><div class="p-grid">${pR}</div></div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("critEvalPage",250,0.55,1.2);fit("critPautaPage",250,0.55,1.2);})();<\/script></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(typeof METAS_TR==='function'?METAS_TR(doc):doc);win.document.close();setTimeout(()=>win.print(),400);
}

// ===================== LABORATORIO DEL TREN DE ENGRANAJES =====================
// Cada caso es determinista y autocalificable: el sentido de giro y la relación
// velocidad/fuerza se CALCULAN con gearDirOf() y gearRelOf() a partir del número
// de dientes; keyDir/keyRel son la clave declarada que el arnés compara.
let gearCases=[
  {ctx:'El motor del robot mueve un piñón de 10 dientes que arrastra una rueda dentada de 30.',gears:[10,30],dirFirst:1,keyDir:-1,keyRel:'fuerza',uso:'Así se arma un motorreductor: el robot pierde velocidad, pero gana la fuerza que necesita para subir la rampa.'},
  {ctx:'En la despulpadora de café, la rueda dentada grande de 40 dientes mueve un piñón de 10.',gears:[40,10],dirFirst:1,keyDir:-1,keyRel:'velocidad',uso:'Se usa cuando hace falta que algo gire rápido, aunque sea con menos fuerza.'},
  {ctx:'Tres engranajes iguales de 20 dientes en fila: el del medio es un engranaje loco.',gears:[20,20,20],dirFirst:-1,keyDir:-1,keyRel:'igual',uso:'El engranaje loco solo sirve para que el primero y el último giren en el mismo sentido.'},
  {ctx:'El motor mueve un piñón de 10 dientes, ese mueve uno de 20 y el último tiene 40 dientes.',gears:[10,20,40],dirFirst:1,keyDir:1,keyRel:'fuerza',uso:'Solo cuentan el primero y el último: el del medio cambia el sentido, no la relación.'},
  {ctx:'El molinete del portón lleva dos engranajes del mismo tamaño, de 24 dientes cada uno.',gears:[24,24],dirFirst:-1,keyDir:1,keyRel:'igual',uso:'Cuando los dos son iguales solo cambia el sentido del giro: ni fuerza ni velocidad.'},
  {ctx:'El plato de la bicicleta (36 dientes) mueve un engranaje loco de 12 y este al piñón de 12.',gears:[36,12,12],dirFirst:1,keyDir:1,keyRel:'velocidad',uso:'La rueda gira mucho más rápido que el pedal: ideal para el camino plano.'},
];
let GEAR_DIR_OPTS=[{v:1,txt:'↻ A la derecha (horario)'},{v:-1,txt:'↺ A la izquierda (antihorario)'}];
let GEAR_REL_OPTS=[{v:'velocidad',txt:'⚡ Más rápido, con menos fuerza'},{v:'fuerza',txt:'💪 Más lento, con más fuerza'},{v:'igual',txt:'➡️ Igual velocidad y misma fuerza'}];
const GEAR_COLORS=[{f:'#a5f3fc',s:'#0e7490'},{f:'#fed7aa',s:'#c2410c'},{f:'#bbf7d0',s:'#15803d'}];
let gearIdx=0,gearSelDir=null,gearSelRel=null,gearAnimOn=true;
const gearSolved=new Set();
function gearDirOf(c){return c.dirFirst*(c.gears.length%2===1?1:-1);}
function gearRelOf(c){const a=c.gears[0],b=c.gears[c.gears.length-1];return b>a?'fuerza':(b<a?'velocidad':'igual');}
function gearFactorOf(c){const a=c.gears[0],b=c.gears[c.gears.length-1];return b>=a?b/a:a/b;}
function _gearNum(x){return (Math.round(x*100)/100).toString().replace('.',',');}
function gearDirText(d){return d===1?'↻ a la derecha (horario)':'↺ a la izquierda (antihorario)';}
function gearRelText(c){const r=gearRelOf(c),f=_gearNum(gearFactorOf(c));if(r==='fuerza')return '💪 '+f+' veces más lento, pero con '+f+' veces más fuerza';if(r==='velocidad')return '⚡ '+f+' veces más rápido, pero con '+f+' veces menos fuerza';return '➡️ a la misma velocidad y con la misma fuerza';}
function _gearColor(i,total){return i===0?GEAR_COLORS[0]:(i===total-1?GEAR_COLORS[2]:GEAR_COLORS[1]);}
function _gearPath(cx,cy,r,teeth){
  const ro=r+Math.max(3,r*0.16),ri=Math.max(4,r-Math.max(2,r*0.09));
  const step=Math.PI*2/teeth;let d='';
  const P=(ang,rad)=>(cx+Math.cos(ang)*rad).toFixed(2)+','+(cy+Math.sin(ang)*rad).toFixed(2);
  for(let i=0;i<teeth;i++){const a0=i*step,a1=a0+step*0.28,a2=a0+step*0.5,a3=a0+step*0.78;
    d+=(i===0?'M':'L')+P(a0,ri)+'L'+P(a1,ro)+'L'+P(a2,ro)+'L'+P(a3,ri);}
  return d+'Z';
}
function gearRenderSVG(c){
  const K=1.5,pad=28,base=2.4;
  const radios=c.gears.map(t=>Math.max(15,t*K));
  const xs=[];let x=pad+radios[0];
  for(let i=0;i<radios.length;i++){if(i===0){xs.push(x);}else{x=x+radios[i-1]+radios[i];xs.push(x);}}
  const maxR=Math.max.apply(null,radios);
  const w=Math.round(xs[xs.length-1]+radios[radios.length-1]+pad);
  const cy=Math.round(maxR+pad);
  const h=Math.round(2*maxR+2*pad+16);
  let g='';
  c.gears.forEach((t,i)=>{
    const r=radios[i],cx=Math.round(xs[i]),col=_gearColor(i,c.gears.length);
    const dir=c.dirFirst*(i%2===0?1:-1);
    const dur=(base*t/c.gears[0]).toFixed(2);
    const rol=i===0?'MOTOR':(i===c.gears.length-1?'SALIDA':'LOCO');
    g+='<g class="gear-spin" style="transform-origin:'+cx+'px '+cy+'px;animation-duration:'+dur+'s;animation-direction:'+(dir===1?'normal':'reverse')+';">'
      +'<path d="'+_gearPath(cx,cy,r,t)+'" fill="'+col.f+'" stroke="'+col.s+'" stroke-width="2.5" stroke-linejoin="round"/>'
      +'<circle cx="'+cx+'" cy="'+cy+'" r="'+Math.max(4,Math.round(r*0.18))+'" fill="'+col.s+'"/>'
      +'<line x1="'+cx+'" y1="'+cy+'" x2="'+cx+'" y2="'+(cy-r+4).toFixed(1)+'" stroke="'+col.s+'" stroke-width="3" stroke-linecap="round"/>'
      +'</g>';
    g+='<text x="'+cx+'" y="'+(cy-maxR-8)+'" text-anchor="middle" font-size="11" font-weight="bold" fill="'+col.s+'">'+rol+'</text>';
    g+='<text x="'+cx+'" y="'+(cy+maxR+16)+'" text-anchor="middle" font-size="12" font-weight="bold" fill="'+col.s+'">'+t+' dientes</text>';
  });
  return '<svg class="gear-svg" viewBox="0 0 '+w+' '+h+'" role="img" aria-label="Tren de '+c.gears.length+' engranajes de '+c.gears.join(', ')+' dientes">'+g+'</svg>';
}
function gearOptsHTML(){
  const dirH=GEAR_DIR_OPTS.map((o,i)=>'<button class="cmp-opt gear-opt" data-gd="'+o.v+'" onclick="gearPick(\'dir\','+o.v+',this)">'+o.txt+'</button>').join('');
  const relH=GEAR_REL_OPTS.map(o=>'<button class="cmp-opt gear-opt" data-gr="'+o.v+'" onclick="gearPick(\'rel\',\''+o.v+'\',this)">'+o.txt+'</button>').join('');
  const d=document.getElementById('gearDirOpts'),r=document.getElementById('gearRelOpts');
  if(d)d.innerHTML=dirH; if(r)r.innerHTML=relH;
}
function gearShowCase(i){
  gearIdx=((i%gearCases.length)+gearCases.length)%gearCases.length;
  gearSelDir=null;gearSelRel=null;
  const c=gearCases[gearIdx];
  const s=document.getElementById('gear-sentence');
  if(s)s.innerHTML='⚙️ <strong>Caso '+(gearIdx+1)+' de '+gearCases.length+':</strong> '+c.ctx;
  const st=document.getElementById('gearStage');
  if(st)st.innerHTML=gearRenderSVG(c);
  const dt=document.getElementById('gearData');
  if(dt)dt.innerHTML='<span class="gear-chip">🦷 Dientes: '+c.gears.join(' → ')+'</span>'
    +'<span class="gear-chip">🎬 El primero gira '+gearDirText(c.dirFirst)+'</span>'
    +'<span class="gear-chip">⚖️ Relación '+c.gears[0]+' : '+c.gears[c.gears.length-1]+'</span>';
  gearOptsHTML();
  document.querySelectorAll('.lab-cont-btn').forEach(b=>b.classList.remove('active-pri'));
  const btn=document.querySelector('[data-caso="'+gearIdx+'"]');
  if(btn)btn.classList.add('active-pri');
  const f=document.getElementById('fbGear'); if(f)f.classList.remove('show');
  if(typeof sfx==='function')sfx('click');
}
function gearNextCase(){gearShowCase(gearIdx+1);}
function gearToggleAnim(){
  gearAnimOn=!gearAnimOn;
  const st=document.getElementById('gearStage');
  if(st)st.classList.toggle('gear-paused',!gearAnimOn);
  const b=document.getElementById('gearAnimBtn');
  if(b)b.textContent=gearAnimOn?'⏸️ Pausar el giro':'▶️ Reanudar el giro';
  if(typeof sfx==='function')sfx('click');
}
function gearPick(kind,val,btn){
  if(typeof sfx==='function')sfx('click');
  if(kind==='dir'){gearSelDir=val;document.querySelectorAll('#gearDirOpts .gear-opt').forEach(b=>b.classList.remove('sel'));}
  else{gearSelRel=val;document.querySelectorAll('#gearRelOpts .gear-opt').forEach(b=>b.classList.remove('sel'));}
  if(btn)btn.classList.add('sel');
  if(gearSelDir!==null&&gearSelRel!==null)gearCheck();
}
function gearCheck(){
  const c=gearCases[gearIdx];
  const goodDir=gearDirOf(c),goodRel=gearRelOf(c);
  const okDir=gearSelDir===goodDir,okRel=gearSelRel===goodRel;
  document.querySelectorAll('#gearDirOpts .gear-opt').forEach(b=>{const v=parseInt(b.dataset.gd,10);
    if(v===goodDir)b.classList.add('correct');else if(v===gearSelDir)b.classList.add('wrong');});
  document.querySelectorAll('#gearRelOpts .gear-opt').forEach(b=>{const v=b.dataset.gr;
    if(v===goodRel)b.classList.add('correct');else if(v===gearSelRel)b.classList.add('wrong');});
  if(okDir&&okRel){
    fb('fbGear','¡Correcto! El último engranaje gira '+gearDirText(goodDir)+' y '+gearRelText(c)+'. '+c.uso,true);
    if(typeof sfx==='function')sfx('ok');
    if(!gearSolved.has(gearIdx)){gearSolved.add(gearIdx);if(!xpTracker.wgt.has('gear_'+gearIdx)){xpTracker.wgt.add('gear_'+gearIdx);pts(4);}}
    if(gearSolved.size===gearCases.length){fin('s-lab');unlockAchievement('gear_lab');}
  }else{
    fb('fbGear','Revisa: el último gira '+gearDirText(goodDir)+' y '+gearRelText(c)+'. Recuerda las dos reglas: cada contacto invierte el sentido y solo cuentan los dientes del primero y del último.',false);
    if(typeof sfx==='function')sfx('no');
    setTimeout(()=>{gearSelDir=null;gearSelRel=null;document.querySelectorAll('.gear-opt').forEach(b=>b.classList.remove('sel','correct','wrong'));},2600);
  }
}
function updateLabDisplay(){/* el laboratorio de esta misión se dibuja en gearShowCase() */}

// ===================== DIPLOMA =====================
function _diplPct(){return xp>=MXP?100:Math.round((xp/MXP)*100);}
function openDiploma(){sfx('fan');const pct=_diplPct();document.getElementById('diplPct').textContent=pct+'%';document.getElementById('diplBar').style.width=pct+'%';document.getElementById('diplDate').textContent='Fecha: '+new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});const msgs=['¡Sigue aprendiendo!','¡Muy buen trabajo!','¡Vas muy bien!','¡Dominas los mecanismos!','¡Maestro del Movimiento!'];document.getElementById('diplMsg').textContent=msgs[Math.min(Math.floor(pct/25),4)];const stars=['⭐','⭐⭐','⭐⭐⭐'];document.getElementById('diplStars').textContent=stars[Math.min(Math.floor(pct/40),2)];const achTxt=unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(' · ');document.getElementById('diplAch').textContent=achTxt||'Sigue completando secciones para desbloquear logros';document.getElementById('diplomaOverlay').classList.add('open');launchConfetti();}
function closeDiploma(){document.getElementById('diplomaOverlay').classList.remove('open');}
function updateDiplomaName(v){document.getElementById('diplName').textContent=v||'Estudiante';}
function shareWA(){const name=document.getElementById('diplName').textContent||'Estudiante';const pct=_diplPct();const msg=`⚙️ ¡${name} completó la Misión "Motores y Mecanismos"! 🏅 Progreso: ${pct}% · 🌱 policastsapien.com`;_waShare(msg);}
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
  gearShowCase(0);
  renderAchPanel();
});

(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalCrit==='function') _injectFormaSel('genEvalCrit','evalCritFormaSel',evalCritFormNum,function(v){evalCritFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();

// ===================== IDIOMA (español ↔ inglés) =====================
// El contenido en inglés vive en motores-mecanismos-en.js y el botón lo maneja
// ../../js/metas-i18n.js. Aquí solo se intercambian los bancos y se repinta:
// el progreso (XP, logros, secciones hechas) no se toca al cambiar de idioma.
const _BANCOS_ES = {
  ACHIEVEMENTS, lvls, fcData, memoPairs, qzData, classGroups, idData, cmpData,
  routeSets, neuronPartes, neuroPairs, enfermedadData, retoPairs,
  identifyTaskDB, classifyTaskDB, completeTaskDB, explainQuestions, sopaSets,
  evalTFBank, evalMCBank, evalCPBank, evalPRBank,
  critMecBank, critErrorBank, critTrenQuestions, critTrenBank,
  critCompareBank, critDesignBank, critDesignGuide,
  gearCases, GEAR_DIR_OPTS, GEAR_REL_OPTS
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
  critMecBank = usa('critMecBank'); critErrorBank = usa('critErrorBank');
  critTrenQuestions = usa('critTrenQuestions'); critTrenBank = usa('critTrenBank');
  critCompareBank = usa('critCompareBank'); critDesignBank = usa('critDesignBank');
  critDesignGuide = usa('critDesignGuide'); gearCases = usa('gearCases');
  GEAR_DIR_OPTS = usa('GEAR_DIR_OPTS'); GEAR_REL_OPTS = usa('GEAR_REL_OPTS');

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
  gearShowCase(gearIdx);          // el laboratorio se redibuja con el caso en pantalla
  renderAchPanel(); updateXPBar();

  // Las pruebas ya generadas se rehacen en el idioma nuevo, con su misma forma
  const out = document.getElementById('evalOut');
  if (out && out.innerHTML.trim()) { evalFormNum = window._currentEvalForm || evalFormNum; genEval(); }
  const outCrit = document.getElementById('evalCritOut');
  if (outCrit && outCrit.innerHTML.trim()) { evalCritFormNum = window._currentEvalCritForm || evalCritFormNum; genEvalCrit(); }
  const tg = document.getElementById('tgOut');
  if (tg) tg.innerHTML = '';
};
