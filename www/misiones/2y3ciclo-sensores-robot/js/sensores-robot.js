// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){if(typeof METAS_TR_TEXTO==='function')texto=METAS_TR_TEXTO(texto);const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
function compartirMision(){const url=window.location.href;const texto=`📡 *Misión Asignada* 📡\n\nAprende cómo el robot VE, OYE, TOCA y MIDE el mundo con sus sensores. 🤖\n\nDesbloquea *todos los logros* y puedes poner *tus datos* para que tu maestro observe todos tus logros. 📋\n\n_Se te hará prueba escrita y serás excelente estudiante en Robótica._ 🌡️\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;_waShare(texto);}
function toggleLetra(){document.body.classList.toggle('letra-grande');if(typeof sfx==='function')sfx('click');localStorage.setItem('preferenciaLetra',document.body.classList.contains('letra-grande'));}
window.addEventListener('DOMContentLoaded',()=>{if(localStorage.getItem('preferenciaLetra')==='true')document.body.classList.add('letra-grande');});

// ===================== UTILIDADES =====================
const _pick=(arr,n)=>[...arr].sort(()=>Math.random()-0.5).slice(0,n);
const _shuffle=(arr)=>[...arr].sort(()=>Math.random()-0.5);
function fb(id,msg,isOk){const el=document.getElementById(id);if(el){el.textContent=msg;el.className='fb show '+(isOk?'ok':'err');}}

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY='sensores_robot_v1';
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
  primer_quiz:{icon:'📡',label:'Primer quiz de sensores superado'},
  flash_master:{icon:'🃏',label:'Todas las flashcards de sensores exploradas'},
  clasif_pro:{icon:'🗂️',label:'Clasificador de sensor vs actuador experto'},
  id_master:{icon:'🔍',label:'Identificador de sensores maestro'},
  reto_hero:{icon:'🏆',label:'Héroe del reto Sensor vs Actuador'},
  nivel3:{icon:'🧭',label:'¡Observador de Señales! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡Ingeniero de Sensores! Nivel 6'},
  widgets_master:{icon:'🧩',label:'Cadena sensor → controlador → actuador dominada'}
};
function unlockAchievement(id){if(unlockedAch.includes(id))return;unlockedAch.push(id);sfx('ach');showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label);launchConfetti();renderAchPanel();saveProgress();}
function renderAchPanel(){const list=document.getElementById('achList');list.innerHTML='';Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{const div=document.createElement('div');div.className='ach-item'+(unlockedAch.includes(id)?'':' locked');div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`;list.appendChild(div);});}
function toggleAchPanel(){sfx('click');document.getElementById('achPanel').classList.toggle('open');}
function showToast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}t.textContent=msg;t.style.display='block';clearTimeout(t._tid);t._tid=setTimeout(()=>t.style.display='none',3200);}
function launchConfetti(){const colors=['#0e7490','#22d3ee','#c2410c','#fb923c','#06b6d4'];for(let i=0;i<60;i++){const c=document.createElement('div');c.className='confetti-piece';c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`;document.body.appendChild(c);c.addEventListener('animationend',()=>c.remove());}}

// ===================== XP =====================
let lvls=[{t:0,n:'Aprendiz 🌱'},{t:25,n:'Curioso Tec 🔋'},{t:55,n:'Observador de Señales 🧭'},{t:90,n:'Lector de Sensores 👀'},{t:130,n:'Técnico de Sensores 📡'},{t:165,n:'Ingeniero de Sensores 🛠️'},{t:190,n:'Maestro de los Sentidos del Robot 🤖'}];
function pts(n){xp=Math.max(0,Math.min(MXP,xp+n));updateXPBar();saveProgress();}
function updateXPBar(){const pct=Math.round((xp/MXP)*100);document.getElementById('xpFill').style.width=pct+'%';const el=document.getElementById('xpPts');el.textContent='⭐ '+xp;el.style.transform='scale(1.3)';setTimeout(()=>el.style.transform='',300);let lv=0;for(let i=0;i<lvls.length;i++)if(xp>=lvls[i].t)lv=i;document.getElementById('xpLvl').textContent=lvls[lv].n;if(lv!==prevLevel){if(lv>=2)unlockAchievement('nivel3');if(lv>=5)unlockAchievement('nivel5');prevLevel=lv;}}
function resetXP(){sfx('click');xp=0;updateXPBar();showToast('🔄 XP reiniciado a 0');}
function fin(id,showFX=true){if(!done.has(id)){done.add(id);const b=document.querySelector(`[data-s="${id}"]`);if(b)b.classList.add('done');if(showFX){sfx('up');launchConfetti();}saveProgress();}}
function getProgress(){return Math.round((done.size/TOTAL_SECTIONS)*100);}

// ===================== NAV =====================
function go(id){sfx('click');document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});document.getElementById(id).classList.add('active');const btn=document.querySelector(`[data-s="${id}"]`);if(btn){btn.classList.add('active');btn.setAttribute('aria-selected','true');}window.scrollTo({top:0,behavior:'smooth'});if(id==='s-sopa'){setTimeout(buildSopa,50);}if(id==='s-widgets'){setTimeout(buildRoute,50);}}

// ===================== MINI-QUIZ (sección Tipos) =====================
function miniQ(btn,isOk,fbId){const wrap=btn.parentElement;if(wrap.dataset.done==='1')return;wrap.querySelectorAll('.cmp-opt').forEach(b=>b.classList.remove('sel'));if(isOk){wrap.dataset.done='1';btn.classList.add('correct');fb(fbId,'¡Correcto! Piensas como todo un técnico de sensores.',true);sfx('ok');}else{btn.classList.add('wrong');fb(fbId,'Casi. Pregúntate: ¿percibe algo del mundo o hace algo en el mundo?',false);sfx('no');}}

// ===================== FLASHCARD DATA =====================
let fcData=[
  {w:'Sensor',a:'📡 Parte del robot que <strong>percibe</strong>: convierte algo del mundo (luz, distancia, calor, contacto, sonido, humedad) en una <strong>señal</strong> para el controlador.'},
  {w:'Sensor de luz',a:'☀️ Mide <strong>cuánta luz hay</strong>: distingue claro de oscuro. Es la <strong>fotorresistencia</strong> del carrito sigue-líneas.'},
  {w:'Sensor de distancia',a:'📏 Mide <strong>qué tan lejos</strong> está un objeto. El <strong>ultrasónico</strong> trabaja como el murciélago: lanza sonido y espera el eco.'},
  {w:'Sensor de tacto',a:'🤲 Un <strong>pulsador</strong> que avisa cuando algo lo <strong>toca o lo presiona</strong>: sirve para detectar choques.'},
  {w:'Sensor de temperatura',a:'🌡️ Mide <strong>cuánto calor o frío</strong> hay. Es el termómetro digital del centro de salud.'},
  {w:'Sensor de sonido',a:'🔊 Un <strong>micrófono</strong>: capta ruidos, voces o aplausos y los convierte en señal.'},
  {w:'Sensor de humedad',a:'💧 Mide <strong>cuánta agua</strong> hay en la tierra o en el aire. Muy útil en el cafetal y en la huerta escolar.'},
  {w:'Señal',a:'⚡ El <strong>dato eléctrico</strong> que el sensor envía al controlador; es el «idioma» que el robot entiende.'},
  {w:'Actuador',a:'💪 Parte que <strong>actúa</strong>: motor, rueda, brazo, bocina o luz. <strong>No percibe nada</strong>: hace, no mide.'},
  {w:'Controlador',a:'🧠 El «cerebro»: recibe la señal del sensor y <strong>decide</strong> qué debe hacer el actuador.'},
  {w:'Sensor → controlador → actuador',a:'🔗 La <strong>cadena del robot</strong>. En tu cuerpo es igual: <strong>receptor → cerebro → efector</strong>.'},
  {w:'Fotorresistencia',a:'🔆 El componente del <strong>sensor de luz</strong>: cambia según la luz que recibe, como la pupila de tu ojo.'},
  {w:'Lectura equivocada',a:'⚠️ Cuando el sensor está <strong>sucio, mojado o tapado</strong> informa mal… y el controlador <strong>decide mal</strong>.'},
  {w:'Sensor de proximidad',a:'📱 El del <strong>celular</strong>: apaga la pantalla cuando acercas el teléfono a tu oreja.'},
];
let fcIdx=0;
function upFC(){document.getElementById('fcInner').classList.remove('flipped');document.getElementById('fcW').textContent=fcData[fcIdx].w;document.getElementById('fcA').innerHTML=fcData[fcIdx].a;document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length;}
function flipCard(){sfx('flip');document.getElementById('fcInner').classList.toggle('flipped');if(!xpTracker.fc.has(fcIdx)){xpTracker.fc.add(fcIdx);pts(1);}if(xpTracker.fc.size===fcData.length){fin('s-flash');unlockAchievement('flash_master');}}
function nextFC(){sfx('click');fcIdx=(fcIdx+1)%fcData.length;upFC();}
function prevFC(){sfx('click');fcIdx=(fcIdx-1+fcData.length)%fcData.length;upFC();}

// ===================== JUEGO: MEMORIA DE LOS SENSORES =====================
let memoPairs=[
  {id:'luz',t:'Sensor de luz',d:'☀️ distingue claro y oscuro (sigue-líneas)'},
  {id:'distancia',t:'Sensor de distancia',d:'📏 mide qué tan lejos está el obstáculo'},
  {id:'tacto',t:'Sensor de tacto',d:'🤲 avisa cuando algo lo toca o lo presiona'},
  {id:'temperatura',t:'Sensor de temperatura',d:'🌡️ mide el calor o el frío del ambiente'},
  {id:'sonido',t:'Sensor de sonido',d:'🔊 capta ruidos, voces y aplausos'},
  {id:'humedad',t:'Sensor de humedad',d:'💧 mide el agua de la tierra o del aire'}
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
  {q:'¿Qué hace exactamente un sensor?',o:['a) Mueve las ruedas del robot','b) Convierte algo del mundo en una señal para el controlador','c) Decide qué hacer','d) Guarda la energía del robot'],c:1},
  {q:'¿A qué parte del cuerpo se parece el sensor de luz?',o:['a) Al ojo','b) Al oído','c) Al músculo','d) Al hueso'],c:0},
  {q:'¿Qué sensor usa el robot que se detiene antes de chocar?',o:['a) De humedad','b) De temperatura','c) De distancia','d) De sonido'],c:2},
  {q:'El sensor ultrasónico trabaja como…',o:['a) Una hormiga','b) Un murciélago que lanza sonido y espera el eco','c) Un pez','d) Una planta'],c:1},
  {q:'¿Cuál de estos NO es un sensor?',o:['a) El micrófono','b) El pulsador de tacto','c) El motor','d) El termómetro'],c:2},
  {q:'¿Cuál es la cadena correcta dentro del robot?',o:['a) Actuador → sensor → controlador','b) Controlador → sensor → actuador','c) Sensor → controlador → actuador','d) Sensor → actuador → controlador'],c:2},
  {q:'¿Qué sensor sirve para saber si hay que regar el cafetal?',o:['a) De humedad','b) De luz','c) De sonido','d) De tacto'],c:0},
  {q:'La pantalla del celular se apaga al acercarlo a la oreja gracias a…',o:['a) Un actuador de calor','b) Un sensor de proximidad','c) La batería','d) La bocina'],c:1},
  {q:'Si el sensor de luz está sucio de lodo, ¿qué ocurre?',o:['a) Nada: los sensores nunca se equivocan','b) El robot lo limpia solo','c) Da una lectura equivocada y el robot decide mal','d) El robot se apaga para siempre'],c:2},
];
let qzIdx=0,qzSel=-1,qzDone=false;
function buildQz(){qzIdx=0;qzSel=-1;qzDone=false;showQz();}
function showQz(){if(qzIdx>=qzData.length){document.getElementById('qzQ').textContent='🎉 ¡Quiz completado!';document.getElementById('qzOpts').innerHTML='';fin('s-quiz');unlockAchievement('primer_quiz');return;}const q=qzData[qzIdx];document.getElementById('qzProg').textContent=`Pregunta ${qzIdx+1} de ${qzData.length}`;document.getElementById('qzQ').textContent=q.q;const opts=document.getElementById('qzOpts');opts.innerHTML='';q.o.forEach((o,i)=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=o;b.onclick=()=>{if(qzDone)return;document.querySelectorAll('.qz-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');qzSel=i;sfx('click');};opts.appendChild(b);});qzDone=false;}
function checkQz(){if(qzSel<0)return fb('fbQz','Selecciona una respuesta.',false);qzDone=true;const opts=document.querySelectorAll('.qz-opt');if(qzSel===qzData[qzIdx].c){opts[qzSel].classList.add('correct');fb('fbQz','¡Correcto! +5 XP',true);if(!xpTracker.qz.has(qzIdx)){xpTracker.qz.add(qzIdx);pts(5);}sfx('ok');}else{opts[qzSel].classList.add('wrong');opts[qzData[qzIdx].c].classList.add('correct');fb('fbQz','Incorrecto. Revisa la respuesta correcta.',false);sfx('no');}setTimeout(()=>{qzIdx++;qzSel=-1;showQz();},1600);}
function resetQz(){sfx('click');qzIdx=0;qzSel=-1;qzDone=false;showQz();document.getElementById('fbQz').classList.remove('show');}

// ===================== CLASIFICACIÓN =====================
let classGroups=[
  {label:['Sensor','Actuador'],headA:'📡 Sensor (percibe)',headB:'💪 Actuador (actúa)',colA:'sen',colB:'act',
   words:[{w:'Fotorresistencia',t:'sen'},{w:'Motor',t:'act'},{w:'Micrófono',t:'sen'},{w:'Rueda',t:'act'},{w:'Pulsador de tacto',t:'sen'},{w:'Bocina',t:'act'},{w:'Termómetro',t:'sen'},{w:'Brazo mecánico',t:'act'},{w:'Ultrasónico',t:'sen'},{w:'Luz LED',t:'act'}]},
  {label:['Sensor de luz','Sensor de distancia'],headA:'☀️ Necesita sensor de luz',headB:'📏 Necesita sensor de distancia',colA:'luz',colB:'dis',
   words:[{w:'Seguir la línea negra del piso',t:'luz'},{w:'Frenar antes de la pared',t:'dis'},{w:'Encender la lámpara al anochecer',t:'luz'},{w:'Abrir la puerta cuando llega alguien',t:'dis'},{w:'Saber si el cuarto está oscuro',t:'luz'},{w:'Esquivar los árboles del cafetal',t:'dis'},{w:'Detectar la sombra de una mano',t:'luz'},{w:'Medir cuántos centímetros faltan',t:'dis'}]},
  {label:['Con contacto','Sin contacto'],headA:'🤝 Percibe TOCANDO',headB:'📡 Percibe SIN TOCAR',colA:'con',colB:'sin',
   words:[{w:'Pulsador de choque',t:'con'},{w:'Sensor de luz',t:'sin'},{w:'Botón de encendido',t:'con'},{w:'Ultrasónico de distancia',t:'sin'},{w:'Sensor de humedad en la tierra',t:'con'},{w:'Micrófono',t:'sin'},{w:'Parachoques del robot',t:'con'},{w:'Sensor de proximidad del celular',t:'sin'}]},
  {label:['Temperatura','Humedad'],headA:'🌡️ Sensor de temperatura',headB:'💧 Sensor de humedad',colA:'tem',colB:'hum',
   words:[{w:'Medir la fiebre de un paciente',t:'tem'},{w:'Saber si la tierra está seca',t:'hum'},{w:'Cuidar la incubadora de pollitos',t:'tem'},{w:'Avisar cuándo regar el cafetal',t:'hum'},{w:'Detectar que el motor se calienta',t:'tem'},{w:'Medir el agua del aire en el vivero',t:'hum'},{w:'Controlar el horno del panadero',t:'tem'},{w:'Cerrar el riego cuando ya llovió',t:'hum'}]},
];
let currentClassGroupIdx=0,clsSelectedWord=null;
function buildClass(){const group=classGroups[currentClassGroupIdx];document.getElementById('col-left-head').textContent=group.headA;document.getElementById('col-right-head').textContent=group.headB;const bank=document.getElementById('clsBank');bank.innerHTML='';clsSelectedWord=null;document.getElementById('items-left').innerHTML='';document.getElementById('items-right').innerHTML='';_shuffle([...group.words]).forEach(w=>{const el=document.createElement('div');el.className='wb-item';el.textContent=w.w;el.dataset.t=w.t;el.onclick=()=>{document.querySelectorAll('.wb-item').forEach(i=>i.classList.remove('sel-word'));el.classList.add('sel-word');clsSelectedWord=el;sfx('click');};bank.appendChild(el);});['col-left','col-right'].forEach(colId=>{const col=document.getElementById(colId);col.onclick=(e)=>{if(!clsSelectedWord||e.target.classList.contains('drop-item'))return;const targetId=colId==='col-left'?'items-left':'items-right';const wordsCol=document.getElementById(targetId);const item=document.createElement('div');item.className='drop-item';item.textContent=clsSelectedWord.textContent;item.dataset.t=clsSelectedWord.dataset.t;const original=clsSelectedWord;item.onclick=(ev)=>{ev.stopPropagation();if(clsSelectedWord!==null){col.click();}else{document.getElementById('clsBank').appendChild(original);original.classList.remove('sel-word');item.remove();if(typeof sfx==='function')sfx('click');}};wordsCol.appendChild(item);clsSelectedWord.remove();clsSelectedWord=null;sfx('click');};});}
function checkClass(){const remaining=document.querySelectorAll('#clsBank .wb-item').length;if(remaining>0){fb('fbCls','Mueve todas las palabras a las columnas primero.',false);return;}const group=classGroups[currentClassGroupIdx];let allOk=true;document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{const inLeft=el.parentElement.id==='items-left';const expectedType=inLeft?group.colA:group.colB;if(el.dataset.t===expectedType){el.classList.add('cls-ok');}else{el.classList.add('cls-no');allOk=false;}});if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);}if(allOk){fb('fbCls','¡Perfecto! +5 XP',true);sfx('fan');fin('s-clasifica');unlockAchievement('clasif_pro');}else{fb('fbCls','Hay errores. Marcados en rojo.',false);sfx('no');}}
function nextClassGroup(){sfx('click');currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length;buildClass();document.getElementById('fbCls').classList.remove('show');showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]);}
function resetClass(){sfx('click');buildClass();document.getElementById('fbCls').classList.remove('show');}

// ===================== IDENTIFICAR =====================
let idData=[
  {s:['El','sensor','percibe','el','mundo','del','robot.'],c:1,art:'La parte del robot que percibe'},
  {s:['El','controlador','decide','con','la','señal','del','sensor.'],c:1,art:'La parte del robot que decide'},
  {s:['El','actuador','ejecuta','la','orden','recibida.'],c:1,art:'La parte del robot que actúa'},
  {s:['La','fotorresistencia','mide','cuánta','luz','hay.'],c:1,art:'El componente del sensor de luz'},
  {s:['El','sensor','ultrasónico','mide','la','distancia','con','el','eco.'],c:2,art:'El sensor que trabaja como el murciélago'},
  {s:['El','micrófono','capta','el','sonido','del','aplauso.'],c:1,art:'El sensor que capta el sonido'},
  {s:['El','sensor','de','humedad','avisa','que','la','tierra','está','seca.'],c:3,art:'Lo que mide el sensor del cafetal'},
  {s:['El','sensor','envía','una','señal','al','controlador.'],c:4,art:'El dato eléctrico que viaja del sensor al controlador'},
];
let idIdx=0,idDone=false;
function showId(){idDone=false;if(idIdx>=idData.length){document.getElementById('idSent').innerHTML='🎉 ¡Completado!';fin('s-identifica');unlockAchievement('id_master');return;}const d=idData[idIdx];document.getElementById('idProg').textContent=`Oración ${idIdx+1} de ${idData.length}`;document.getElementById('idInfo').textContent=`Busca: ${d.art}`;const sent=document.getElementById('idSent');sent.innerHTML='';d.s.forEach((w,i)=>{const span=document.createElement('span');span.className='id-word';span.textContent=w+' ';span.onclick=()=>checkId(i,span);sent.appendChild(span);});}
function checkId(i,span){if(idDone)return;document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected'));span.classList.add('selected');if(i===idData[idIdx].c){idDone=true;span.classList.add('id-ok');fb('fbId','¡Correcto! +5 XP',true);if(!xpTracker.id.has(idIdx)){xpTracker.id.add(idIdx);pts(5);}sfx('ok');}else{span.classList.add('id-no');fb('fbId','Ese no es el término solicitado.',false);sfx('no');}}
function nextId(){sfx('click');idIdx++;showId();document.getElementById('fbId').classList.remove('show');}
function resetId(){sfx('click');idIdx=0;showId();document.getElementById('fbId').classList.remove('show');}

// ===================== COMPLETA =====================
let cmpData=[
  {s:'El sensor convierte algo del mundo en una ___ para el controlador.',opts:['señal','rueda','batería'],c:0},
  {s:'El sensor de luz se parece a tu ___.',opts:['oído','ojo','codo'],c:1},
  {s:'El sensor de distancia trabaja como el ___, con el eco.',opts:['murciélago','caballo','pez'],c:0},
  {s:'El sensor de tacto avisa cuando algo lo ___.',opts:['mira','toca','escucha'],c:1},
  {s:'El sensor de ___ mide si la tierra está seca.',opts:['sonido','luz','humedad'],c:2},
  {s:'El micrófono es un sensor de ___.',opts:['sonido','calor','distancia'],c:0},
  {s:'El motor no es sensor: es un ___.',opts:['controlador','actuador','programa'],c:1},
  {s:'Si el sensor está sucio da una lectura ___.',opts:['equivocada','perfecta','doble'],c:0},
];
let cmpIdx=0,cmpSel=-1,cmpDone=false;
function showCmp(){if(cmpIdx>=cmpData.length){document.getElementById('cmpSent').innerHTML='🎉 ¡Completado!';document.getElementById('cmpOpts').innerHTML='';fin('s-completa');return;}const d=cmpData[cmpIdx];document.getElementById('cmpProg').textContent=`Oración ${cmpIdx+1} de ${cmpData.length}`;document.getElementById('cmpSent').innerHTML=d.s.replace('___','<span class="blank">___</span>');const opts=document.getElementById('cmpOpts');opts.innerHTML='';cmpSel=-1;cmpDone=false;d.opts.forEach((o,i)=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=o;b.onclick=()=>{if(cmpDone)return;document.querySelectorAll('.cmp-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');cmpSel=i;sfx('click');};opts.appendChild(b);});}
function checkCmp(){if(cmpSel<0)return fb('fbCmp','Selecciona una opción.',false);cmpDone=true;const opts=document.querySelectorAll('.cmp-opt');if(cmpSel===cmpData[cmpIdx].c){opts[cmpSel].classList.add('correct');document.getElementById('cmpSent').innerHTML=cmpData[cmpIdx].s.replace('___',`<span class="blank" style="color:var(--jade);border-color:var(--jade)">${opts[cmpSel].textContent}</span>`);fb('fbCmp','¡Correcto! +5 XP',true);if(!xpTracker.cmp.has(cmpIdx)){xpTracker.cmp.add(cmpIdx);pts(5);}sfx('ok');}else{opts[cmpSel].classList.add('wrong');opts[cmpData[cmpIdx].c].classList.add('correct');fb('fbCmp','Incorrecto. Revisa bien la respuesta.',false);sfx('no');}setTimeout(()=>{cmpIdx++;document.getElementById('fbCmp').classList.remove('show');showCmp();},1600);}

// ===================== WIDGETS =====================
// Widget 1: ordenar la cadena sensor → controlador → actuador
let routeSets=[
  {label:'La puerta automática del supermercado',steps:['El sensor de distancia detecta a una persona cerca','La señal viaja del sensor al controlador','El controlador decide: «si hay alguien, abrir»','El motor (actuador) desliza la puerta']},
  {label:'El riego del cafetal',steps:['El sensor de humedad mide que la tierra está seca','El controlador recibe el dato y decide abrir el agua','La válvula (actuador) deja pasar el agua','El sensor vuelve a medir y avisa que la tierra ya está húmeda']},
  {label:'El carrito sigue-líneas del aula',steps:['El sensor de luz ve que el piso se puso claro','El controlador compara: «me salí de la línea negra»','Decide corregir el rumbo hacia la izquierda','Los motores (actuadores) mueven las ruedas','El sensor confirma que volvió sobre la línea']},
  {label:'El robot de la incubadora de pollitos',steps:['El sensor de temperatura mide que hay mucho frío','El controlador decide encender el foco de calor','El foco (actuador) calienta la incubadora','El sensor mide otra vez y el controlador apaga el foco']},
];
let currentRouteIdx=0,routeItems=[];
function buildRoute(){routeItems=_shuffle([...routeSets[currentRouteIdx].steps]);renderRoute();const fbEl=document.getElementById('fbRoute');if(fbEl)fbEl.classList.remove('show');}
function renderRoute(){const list=document.getElementById('routeList');if(!list)return;list.innerHTML='';routeItems.forEach((step,i)=>{const div=document.createElement('div');div.className='sort-item';div.innerHTML=`<div class="sort-arrows"><button class="sort-arrow" onclick="routeMove(${i},-1)"${i===0?' disabled':''}>▲</button><button class="sort-arrow" onclick="routeMove(${i},1)"${i===routeItems.length-1?' disabled':''}>▼</button></div><div class="sort-step-num">${i+1}.</div><div class="sort-item-txt">${step}</div>`;list.appendChild(div);});}
function routeMove(idx,dir){sfx('click');const ni=idx+dir;if(ni<0||ni>=routeItems.length)return;[routeItems[idx],routeItems[ni]]=[routeItems[ni],routeItems[idx]];renderRoute();}
function checkRoute(){const correct=routeSets[currentRouteIdx].steps;const isOk=routeItems.every((s,i)=>s===correct[i]);if(isOk){fb('fbRoute','¡Perfecto! Orden correcto. +4 XP',true);if(!xpTracker.wgt.has('route_'+currentRouteIdx)){xpTracker.wgt.add('route_'+currentRouteIdx);pts(4);}sfx('fan');fin('s-widgets');unlockAchievement('widgets_master');}else{fb('fbRoute','Hay pasos fuera de orden. Recuerda: sensor → controlador → actuador.',false);sfx('no');}}
function nextRoute(){sfx('click');currentRouteIdx=(currentRouteIdx+1)%routeSets.length;buildRoute();showToast('🔄 Caso: '+routeSets[currentRouteIdx].label);}

// Widget 2: ¿Qué sensor necesita?
let neuronPartes=[
  {desc:'Un robot que se detiene antes de chocar con la pared',ans:'Sensor de distancia',opts:['Sensor de distancia','Sensor de luz','Sensor de sonido','Sensor de temperatura']},
  {desc:'Un robot que enciende la lámpara del corredor cuando oscurece',ans:'Sensor de luz',opts:['Sensor de luz','Sensor de tacto','Sensor de distancia','Sensor de humedad']},
  {desc:'Un robot de juguete que arranca cuando aplaudes',ans:'Sensor de sonido',opts:['Sensor de sonido','Sensor de luz','Sensor de temperatura','Sensor de distancia']},
  {desc:'Un robot que avisa si la incubadora de pollitos se enfría',ans:'Sensor de temperatura',opts:['Sensor de temperatura','Sensor de sonido','Sensor de tacto','Sensor de luz']},
  {desc:'Un robot que sabe cuándo alguien presiona su botón',ans:'Sensor de tacto',opts:['Sensor de tacto','Sensor de distancia','Sensor de humedad','Sensor de sonido']},
  {desc:'Un robot que riega el cafetal solo cuando la tierra está seca',ans:'Sensor de humedad',opts:['Sensor de humedad','Sensor de sonido','Sensor de tacto','Sensor de luz']},
  {desc:'Un carrito que sigue la línea negra pintada en el piso del aula',ans:'Sensor de luz',opts:['Sensor de luz','Sensor de temperatura','Sensor de sonido','Sensor de humedad']},
  {desc:'La puerta del supermercado que se abre cuando te acercas',ans:'Sensor de distancia',opts:['Sensor de distancia','Sensor de humedad','Sensor de tacto','Sensor de sonido']},
];
let neuronIdx=0,neuronDone=false;
function showNeuron(){neuronDone=false;if(neuronIdx>=neuronPartes.length){const el=document.getElementById('neuronDesc');if(el)el.textContent='🎉 ¡Eres todo un técnico de sensores!';const opts=document.getElementById('neuronOpts');if(opts)opts.innerHTML='';fin('s-widgets');return;}const d=neuronPartes[neuronIdx];const prog=document.getElementById('neuronProg');if(prog)prog.textContent=`Pista ${neuronIdx+1} de ${neuronPartes.length}`;const desc=document.getElementById('neuronDesc');if(desc)desc.textContent=d.desc;const opts=document.getElementById('neuronOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=opt;b.onclick=()=>checkNeuron(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuron');if(fbEl)fbEl.classList.remove('show');}
function checkNeuron(opt,btn,d){if(neuronDone)return;neuronDone=true;document.querySelectorAll('#neuronOpts .cmp-opt').forEach(b=>{if(b.textContent===d.ans)b.classList.add('correct');else if(b===btn&&b.textContent!==d.ans)b.classList.add('wrong');});const isOk=opt===d.ans;if(isOk){fb('fbNeuron','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuron_'+neuronIdx)){xpTracker.wgt.add('neuron_'+neuronIdx);pts(3);}sfx('ok');}else{fb('fbNeuron','La respuesta correcta es: '+d.ans,false);sfx('no');}}
function nextNeuron(){sfx('click');neuronIdx++;showNeuron();}
function resetNeuron(){sfx('click');neuronIdx=0;showNeuron();}

// Widget 3: Sensor → sentido humano
let neuroPairs=[
  {trans:'Sensor de luz',func:'El ojo: capta la luz y distingue claro de oscuro',opts:['El ojo: capta la luz y distingue claro de oscuro','El oído: capta los sonidos','El músculo: mueve el cuerpo','El hueso: sostiene el cuerpo']},
  {trans:'Sensor de sonido',func:'El oído: capta ruidos, voces y aplausos',opts:['El oído: capta ruidos, voces y aplausos','El ojo: capta la luz','La lengua: capta los sabores','El músculo: ejecuta el movimiento']},
  {trans:'Sensor de tacto',func:'La piel: siente cuando algo la toca o la presiona',opts:['La piel: siente cuando algo la toca o la presiona','El ojo: capta la luz','El corazón: bombea la sangre','El pulmón: toma el aire']},
  {trans:'Sensor de temperatura',func:'La piel: siente si algo está caliente o frío',opts:['La piel: siente si algo está caliente o frío','El oído: capta el sonido','La mano: agarra los objetos','El pie: sostiene el peso']},
  {trans:'Sensor de distancia',func:'El eco del murciélago: mide qué tan lejos está algo',opts:['El eco del murciélago: mide qué tan lejos está algo','El estómago: digiere los alimentos','El músculo: empuja y jala','La sangre: transporta oxígeno']},
];
let neuroIdx=0,neuroDone=false;
function showNeuro(){neuroDone=false;if(neuroIdx>=neuroPairs.length){const el=document.getElementById('neuroTrans');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('neuroOpts');if(opts)opts.innerHTML='';return;}const d=neuroPairs[neuroIdx];const prog=document.getElementById('neuroProg');if(prog)prog.textContent=`${neuroIdx+1} de ${neuroPairs.length}`;const trans=document.getElementById('neuroTrans');if(trans)trans.textContent=d.trans;const opts=document.getElementById('neuroOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkNeuro(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuro');if(fbEl)fbEl.classList.remove('show');}
function checkNeuro(opt,btn,d){if(neuroDone)return;neuroDone=true;document.querySelectorAll('#neuroOpts .qz-opt').forEach(b=>{if(b.textContent===d.func)b.classList.add('correct');else if(b===btn&&b.textContent!==d.func)b.classList.add('wrong');});const isOk=opt===d.func;if(isOk){fb('fbNeuro','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuro_'+neuroIdx)){xpTracker.wgt.add('neuro_'+neuroIdx);pts(3);}sfx('ok');}else{fb('fbNeuro','Correcto: '+d.func,false);sfx('no');}setTimeout(()=>{neuroIdx++;showNeuro();},1800);}
function resetNeuro(){sfx('click');neuroIdx=0;showNeuro();}

// Widget 4: ¿Sensor o actuador?
let enfermedadData=[
  {disease:'El micrófono',characteristic:'Es un sensor',opts:['Es un sensor','Es un actuador']},
  {disease:'El motor de la rueda',characteristic:'Es un actuador',opts:['Es un actuador','Es un sensor']},
  {disease:'La fotorresistencia',characteristic:'Es un sensor',opts:['Es un sensor','Es un actuador']},
  {disease:'La bocina que suena',characteristic:'Es un actuador',opts:['Es un actuador','Es un sensor']},
  {disease:'El pulsador de choque',characteristic:'Es un sensor',opts:['Es un sensor','Es un actuador']},
  {disease:'La válvula que abre el riego',characteristic:'Es un actuador',opts:['Es un actuador','Es un sensor']},
];
let enferIdx=0,enferDone=false;
function showEnfer(){enferDone=false;if(enferIdx>=enfermedadData.length){const el=document.getElementById('enferDisease');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('enferOpts');if(opts)opts.innerHTML='';return;}const d=enfermedadData[enferIdx];const prog=document.getElementById('enferProg');if(prog)prog.textContent=`${enferIdx+1} de ${enfermedadData.length}`;const dis=document.getElementById('enferDisease');if(dis)dis.textContent=d.disease;const opts=document.getElementById('enferOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkEnfer(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbEnfer');if(fbEl)fbEl.classList.remove('show');}
function checkEnfer(opt,btn,d){if(enferDone)return;enferDone=true;document.querySelectorAll('#enferOpts .qz-opt').forEach(b=>{if(b.textContent===d.characteristic)b.classList.add('correct');else if(b===btn&&b.textContent!==d.characteristic)b.classList.add('wrong');});const isOk=opt===d.characteristic;if(isOk){fb('fbEnfer','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('enfer_'+enferIdx)){xpTracker.wgt.add('enfer_'+enferIdx);pts(3);}sfx('ok');}else{fb('fbEnfer','Correcto: '+d.characteristic+'. Pregúntate: ¿informa algo o hace algo?',false);sfx('no');}setTimeout(()=>{enferIdx++;showEnfer();},1800);}
function resetEnfer(){sfx('click');enferIdx=0;showEnfer();}

// ===================== RETO FINAL =====================
let retoPairs=[
  {label:['Sensor','Actuador'],btnA:'📡 Sensor',btnB:'💪 Actuador',colA:'sen',colB:'act',
   words:[{w:'Fotorresistencia',t:'sen'},{w:'Motor',t:'act'},{w:'Micrófono',t:'sen'},{w:'Rueda',t:'act'},{w:'Pulsador',t:'sen'},{w:'Bocina',t:'act'},{w:'Termómetro',t:'sen'},{w:'Brazo mecánico',t:'act'},{w:'Ultrasónico',t:'sen'},{w:'Luz LED',t:'act'}]},
  {label:['Sensor de luz','Sensor de distancia'],btnA:'☀️ De luz',btnB:'📏 De distancia',colA:'luz',colB:'dis',
   words:[{w:'Seguir la línea negra',t:'luz'},{w:'Frenar ante la pared',t:'dis'},{w:'Encender la lámpara de noche',t:'luz'},{w:'Abrir la puerta automática',t:'dis'},{w:'Saber si está oscuro',t:'luz'},{w:'Esquivar un árbol',t:'dis'},{w:'Detectar una sombra',t:'luz'},{w:'Medir centímetros con el eco',t:'dis'}]},
  {label:['Con contacto','Sin contacto'],btnA:'🤝 Tocando',btnB:'📡 Sin tocar',colA:'con',colB:'sin',
   words:[{w:'Pulsador de choque',t:'con'},{w:'Sensor de luz',t:'sin'},{w:'Botón de encendido',t:'con'},{w:'Ultrasónico',t:'sin'},{w:'Sensor de humedad en la tierra',t:'con'},{w:'Micrófono',t:'sin'},{w:'Parachoques',t:'con'},{w:'Sensor de proximidad',t:'sin'}]},
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
  {s:'El sensor convierte la luz, el sonido o la distancia en una señal.',type:'Sensor'},
  {s:'La fotorresistencia distingue el piso claro de la línea negra.',type:'Sensor de luz'},
  {s:'El ultrasónico mide la distancia con el eco, como el murciélago.',type:'Sensor de distancia'},
  {s:'El pulsador avisa cuando el robot choca con algo.',type:'Sensor de tacto'},
  {s:'El termómetro digital mide la fiebre en el centro de salud.',type:'Sensor de temperatura'},
  {s:'El micrófono capta los aplausos y las voces.',type:'Sensor de sonido'},
  {s:'Este sensor avisa cuándo regar el cafetal.',type:'Sensor de humedad'},
  {s:'El motor gira las ruedas cuando el controlador se lo ordena.',type:'Actuador'},
  {s:'Recibe la señal del sensor y decide qué hacer.',type:'Controlador'},
  {s:'El sensor sucio informó mal y el robot se salió de la línea.',type:'Lectura equivocada'},
];
let classifyTaskDB=[
  {w:'Sensor de luz',gen:'Sensor',n:'Cuánta luz hay: claro u oscuro',g:'👁️ El ojo',t:'Carrito sigue-líneas; lámpara del corredor'},
  {w:'Sensor de distancia',gen:'Sensor',n:'Qué tan lejos está un objeto (por eco)',g:'🦇 El eco del murciélago',t:'Puerta automática del supermercado'},
  {w:'Sensor de tacto',gen:'Sensor',n:'Si algo lo toca o lo presiona',g:'🖐️ La piel',t:'Parachoques del robot; botón de encendido'},
  {w:'Sensor de temperatura',gen:'Sensor',n:'El calor o el frío',g:'🖐️ La piel',t:'Termómetro del centro de salud'},
  {w:'Sensor de sonido',gen:'Sensor',n:'Ruidos, voces y aplausos',g:'👂 El oído',t:'Micrófono del celular'},
  {w:'Sensor de humedad',gen:'Sensor',n:'El agua de la tierra o del aire',g:'🖐️ El tacto (tierra mojada)',t:'Riego del cafetal y de la huerta escolar'},
  {w:'Motor',gen:'Actuador',n:'No percibe nada: ejecuta la orden',g:'💪 El músculo',t:'Ruedas del carrito robótico'},
  {w:'Bocina',gen:'Actuador',n:'No percibe nada: produce sonido',g:'🗣️ La voz',t:'Alarma del robot al ir de reversa'},
];
let completeTaskDB=[
  {s:'El sensor convierte algo del mundo en una ___.',opts:['señal','rueda','sombra'],ans:'señal'},
  {s:'El sensor de luz se parece al ___ humano.',opts:['ojo','codo','diente'],ans:'ojo'},
  {s:'El sensor ultrasónico mide la ___ con el eco.',opts:['distancia','fiebre','humedad'],ans:'distancia'},
  {s:'El micrófono es el sensor de ___.',opts:['sonido','calor','luz'],ans:'sonido'},
  {s:'El sensor de ___ avisa cuándo regar el cafetal.',opts:['humedad','sonido','tacto'],ans:'humedad'},
  {s:'La cadena del robot es sensor → controlador → ___.',opts:['actuador','batería','antena'],ans:'actuador'},
  {s:'El motor no percibe: es un ___.',opts:['actuador','sensor','programa'],ans:'actuador'},
  {s:'Un sensor sucio da una lectura ___.',opts:['equivocada','exacta','doble'],ans:'equivocada'},
];
let explainQuestions=[
  {q:'¿Qué es un sensor? Explica con tus palabras qué capta y en qué lo convierte.',ans:'Un sensor es la parte del robot que percibe: capta algo del mundo real (luz, distancia, calor, contacto, sonido o humedad) y lo convierte en una señal eléctrica que el controlador puede entender.'},
  {q:'Explica la cadena sensor → controlador → actuador y compárala con tu cuerpo.',ans:'El sensor percibe y envía la señal (como el receptor: ojo, oído o piel), el controlador decide (como el cerebro) y el actuador ejecuta la acción (como el músculo). En el cuerpo es receptor → cerebro → efector.'},
  {q:'¿En qué se diferencia un sensor de un actuador? Da dos ejemplos de cada uno.',ans:'El sensor mete información al robot (percibe): fotorresistencia, ultrasónico, micrófono, termómetro. El actuador saca acción (hace algo): motor, rueda, bocina, luz LED, válvula. El sensor no mueve nada y el actuador no mide nada.'},
  {q:'Nombra cinco sensores que uses o veas en tu comunidad y di qué percibe cada uno.',ans:'Respuesta libre. Por ejemplo: puerta automática (distancia), luz del pasillo (luz), celular junto a la oreja (proximidad), termómetro del centro de salud (temperatura), riego del cafetal (humedad).'},
  {q:'¿Qué pasa si un sensor da una lectura equivocada? Escribe un ejemplo y cómo lo revisarías.',ans:'Si el sensor está sucio, mojado, tapado o hay poca luz, informa mal y el controlador decide mal: por ejemplo el sigue-líneas se sale de la línea. Se revisa limpiando el sensor, quitando lo que lo tapa y probándolo con buena luz antes de culpar al programa.'},
  {q:'Diseña un robot para un problema de tu comunidad: ¿qué sensores lleva y qué percibe cada uno?',ans:'Respuesta libre. Debe nombrar al menos dos sensores adecuados al problema, decir qué percibe cada uno, la decisión del controlador («si pasa X, entonces Y») y con qué actuador responde.'},
];
let ansVisible=false;
function genTask(){sfx('click');const type=document.getElementById('tgType').value;const count=parseInt(document.getElementById('tgCount').value);ansVisible=false;const out=document.getElementById('tgOut');out.innerHTML='';if(type==='identify')genIdentifyTask(out,count);else if(type==='classify')genClassifyTask(out,count);else if(type==='complete')genCompleteTask(out,count);else if(type==='explain')genExplainTask(out,count);fin('s-tareas');}
function _instrBlock(out,title,lines){const ib=document.createElement('div');ib.className='tg-instruction-block';ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join('');out.appendChild(ib);}
function genIdentifyTask(out,count){_instrBlock(out,'Instrucción',['Copia en tu cuaderno; subraya, colorea o encierra el concepto de robótica indicado en cada oración. Escribe al lado de qué sensor o parte se trata.','<strong>Ejemplo:</strong> El micrófono capta los aplausos. → <span style="color:var(--jade);font-weight:700;">Sensor de sonido</span>']);_pick(identifyTaskDB,Math.min(count,identifyTaskDB.length)).forEach((item,i)=>{const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.type}</div></div>`;out.appendChild(div);});}
function genClassifyTask(out,count){_instrBlock(out,'Instrucción',['Copia la siguiente tabla en tu cuaderno. Para cada componente responde: ¿es sensor o actuador?, ¿qué percibe?, ¿a qué sentido humano se parece? y escribe un ejemplo real.']);const items=_pick(classifyTaskDB,Math.min(count,classifyTaskDB.length));const wrap=document.createElement('div');wrap.style.overflowX='auto';const th=(t,extra='')=>`<th style="padding:0.3rem 0.4rem;border:1px solid var(--border);font-size:0.72rem;text-align:center;${extra}">${t}</th>`;let html=`<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:520px;"><thead><tr style="background:var(--pri-gl);">${th('Componente','text-align:left;')}${th('¿Sensor o actuador?')}${th('¿Qué percibe?')}${th('Sentido humano')}${th('Ejemplo')}</tr></thead><tbody>`;items.forEach(it=>{html+=`<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td>`+Array(4).fill(`<td style="padding:0.4rem;border:1px solid var(--border);min-width:50px;"></td>`).join('')+'</tr>';});html+='</tbody></table>';wrap.innerHTML=html;out.appendChild(wrap);const ans=document.createElement('div');ans.className='tg-answer';ans.style.marginTop='0.8rem';ans.innerHTML='<strong>✅ Respuestas:</strong><br>'+items.map(it=>`<strong>${it.w}:</strong> ${it.gen} | Percibe: ${it.n} | Sentido: ${it.g} | Ejemplo: ${it.t}`).join('<br>');out.appendChild(ans);}
function genCompleteTask(out,count){_instrBlock(out,'Instrucción',['Copia y resuelve en tu cuaderno. Cada oración tiene un espacio ___. Elige y escribe la opción correcta.']);const pool=_shuffle([...completeTaskDB]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';const sent=item.s.replace('___','<span class="tg-blank" style="min-width:90px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${sent}</strong><div style="margin-top:0.4rem;font-size:0.82rem;color:var(--gray);">📝 Opciones: <strong>${item.opts.join(' | ')}</strong></div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function genExplainTask(out,count){_instrBlock(out,'Instrucción',['Copia las siguientes preguntas en tu cuaderno y responde cada una de forma clara y completa. Puedes acompañarlas con dibujos.']);const pool=_shuffle([...explainQuestions]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.3rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function toggleAns(){ansVisible=!ansVisible;document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none');sfx('click');}

// ===================== SOPA DE LETRAS =====================
// Cuadrículas generadas por script y verificadas por construcción:
// cada palabra se lee exacta, colineal y contigua en las celdas indicadas.
let sopaSets=[
  {size:10,grid:[
    ['W','U','K','K','S','K','I','H','G','O'],
    ['V','L','J','V','F','E','U','I','S','W'],
    ['P','G','E','J','A','M','D','E','R','J'],
    ['X','D','J','K','E','X','O','Z','V','Z'],
    ['Z','Z','B','D','Z','J','M','A','K','O'],
    ['O','U','A','R','O','S','N','E','S','T'],
    ['I','D','L','N','K','V','I','D','U','C'],
    ['Q','M','E','U','V','W','O','Y','F','A'],
    ['A','I','C','N','A','T','S','I','D','T'],
    ['U','A','O','D','I','N','O','S','Y','F']
  ],words:[
    {w:'SENSOR',cells:[[5,8],[5,7],[5,6],[5,5],[5,4],[5,3]]},
    {w:'LUZ',cells:[[6,2],[5,1],[4,0]]},
    {w:'TACTO',cells:[[8,9],[7,9],[6,9],[5,9],[4,9]]},
    {w:'SONIDO',cells:[[9,7],[9,6],[9,5],[9,4],[9,3],[9,2]]},
    {w:'HUMEDAD',cells:[[0,7],[1,6],[2,5],[3,4],[4,3],[5,2],[6,1]]},
    {w:'DISTANCIA',cells:[[8,8],[8,7],[8,6],[8,5],[8,4],[8,3],[8,2],[8,1],[8,0]]}
  ]},
  {size:12,grid:[
    ['R','S','R','Z','P','E','R','C','I','B','I','R'],
    ['O','M','U','R','C','I','E','L','A','G','O','A'],
    ['D','I','L','A','T','E','F','A','C','R','R','A'],
    ['A','D','G','J','S','P','U','K','A','U','J','A'],
    ['L','W','O','M','T','O','L','Y','T','H','D','X'],
    ['O','O','C','I','N','O','S','A','R','T','L','U'],
    ['R','O','Q','C','J','U','R','R','T','T','G','B'],
    ['T','B','P','W','E','E','Y','T','R','I','G','P'],
    ['N','D','P','W','P','J','H','M','Q','Q','K','E'],
    ['O','P','B','M','N','J','I','M','I','X','O','T'],
    ['C','A','E','J','E','M','L','A','E','V','Q','R'],
    ['X','T','E','J','T','J','B','X','N','N','B','N']
  ],words:[
    {w:'TEMPERATURA',cells:[[11,1],[10,2],[9,3],[8,4],[7,5],[6,6],[5,7],[4,8],[3,9],[2,10],[1,11]]},
    {w:'CONTROLADOR',cells:[[10,0],[9,0],[8,0],[7,0],[6,0],[5,0],[4,0],[3,0],[2,0],[1,0],[0,0]]},
    {w:'ULTRASONICO',cells:[[5,11],[5,10],[5,9],[5,8],[5,7],[5,6],[5,5],[5,4],[5,3],[5,2],[5,1]]},
    {w:'MURCIELAGO',cells:[[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[1,7],[1,8],[1,9],[1,10]]},
    {w:'PERCIBIR',cells:[[0,4],[0,5],[0,6],[0,7],[0,8],[0,9],[0,10],[0,11]]},
    {w:'CAFETAL',cells:[[2,8],[2,7],[2,6],[2,5],[2,4],[2,3],[2,2]]}
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
  {q:'El sensor convierte algo del mundo en una señal para el controlador.',a:true},
  {q:'El sensor es el que decide qué hará el robot.',a:false},
  {q:'El sensor de luz se parece al ojo humano.',a:true},
  {q:'El motor de la rueda es un sensor.',a:false},
  {q:'El sensor ultrasónico mide la distancia con el eco, como el murciélago.',a:true},
  {q:'El micrófono es el sensor de sonido del robot.',a:true},
  {q:'El sensor de tacto necesita que algo lo toque o lo presione.',a:true},
  {q:'El sensor de humedad sirve para saber si la tierra está seca.',a:true},
  {q:'Los sensores nunca se equivocan.',a:false},
  {q:'La cadena del robot es: sensor → controlador → actuador.',a:true},
  {q:'La bocina del robot es un sensor de sonido.',a:false},
  {q:'La puerta automática del supermercado usa un sensor para detectarte.',a:true},
  {q:'Un sensor sucio o tapado puede dar una lectura equivocada.',a:true},
  {q:'El sensor de temperatura mide cuánta luz hay en el cuarto.',a:false},
  {q:'En el cuerpo humano la cadena es receptor → cerebro → efector.',a:true},
];
let evalMCBank=[
  {q:'¿Qué es un sensor?',o:['a) La parte que mueve al robot','b) La parte que percibe y convierte el mundo en una señal','c) La batería del robot','d) La lista de instrucciones'],a:1},
  {q:'¿A qué sentido humano se parece el sensor de luz?',o:['a) Al oído','b) Al gusto','c) A la vista','d) Al olfato'],a:2},
  {q:'¿Qué sensor necesita un robot para no chocar con la pared?',o:['a) De humedad','b) De distancia','c) De temperatura','d) De sonido'],a:1},
  {q:'El sensor ultrasónico trabaja como…',o:['a) El murciélago, con el eco','b) La hormiga, con las patas','c) La flor, con el sol','d) El pez, con las aletas'],a:0},
  {q:'¿Cuál de estos NO es un sensor?',o:['a) El micrófono','b) El termómetro','c) El pulsador','d) El motor'],a:3},
  {q:'¿Cuál es la cadena correcta dentro del robot?',o:['a) Sensor → controlador → actuador','b) Actuador → controlador → sensor','c) Controlador → sensor → actuador','d) Sensor → actuador → controlador'],a:0},
  {q:'¿Qué sensor avisa cuándo regar el cafetal?',o:['a) De luz','b) De sonido','c) De humedad','d) De tacto'],a:2},
  {q:'¿Qué sensor usa el carrito sigue-líneas?',o:['a) De luz','b) De temperatura','c) De humedad','d) De sonido'],a:0},
  {q:'La pantalla del celular se apaga junto a la oreja gracias a…',o:['a) La bocina','b) Un sensor de proximidad','c) La batería','d) El motor vibrador'],a:1},
  {q:'¿Qué sensor tiene el termómetro digital del centro de salud?',o:['a) De sonido','b) De humedad','c) De temperatura','d) De luz'],a:2},
  {q:'¿Qué pasa si el sensor de luz está sucio de lodo?',o:['a) Nada, los sensores nunca fallan','b) El robot se limpia solo','c) Da una lectura equivocada y el robot decide mal','d) El robot gana más velocidad'],a:2},
  {q:'¿Cuál es la diferencia entre sensor y actuador?',o:['a) El sensor percibe y el actuador ejecuta la acción','b) El sensor actúa y el actuador percibe','c) Los dos hacen lo mismo','d) El actuador decide y el sensor obedece'],a:0},
  {q:'¿Qué sensor detecta un choque del robot?',o:['a) De tacto','b) De luz','c) De humedad','d) De temperatura'],a:0},
  {q:'¿Con qué parte del cuerpo se compara el controlador?',o:['a) Con la piel','b) Con el oído','c) Con el músculo','d) Con el cerebro'],a:3},
  {q:'El componente del sensor de luz se llama…',o:['a) Válvula','b) Fotorresistencia','c) Hélice','d) Engranaje'],a:1},
];
let evalCPBank=[
  {q:'El sensor convierte algo del mundo en una ___ para el controlador.',a:'señal'},
  {q:'El sensor de luz se parece al ___ humano.',a:'ojo'},
  {q:'El sensor de sonido del robot es el ___.',a:'micrófono'},
  {q:'El sensor de distancia mide con el ___, igual que el murciélago.',a:'eco'},
  {q:'El sensor de ___ avisa si la tierra del cafetal está seca.',a:'humedad'},
  {q:'El sensor de tacto es un ___ que se presiona al chocar.',a:'pulsador'},
  {q:'La cadena del robot es sensor → controlador → ___.',a:'actuador'},
  {q:'En el cuerpo la cadena es receptor → cerebro → ___.',a:'efector'},
  {q:'El motor y la bocina no perciben: son ___.',a:'actuadores'},
  {q:'El componente del sensor de luz se llama ___.',a:'fotorresistencia'},
  {q:'Un sensor sucio o tapado da una lectura ___.',a:'equivocada'},
  {q:'El termómetro digital es un sensor de ___.',a:'temperatura'},
  {q:'La puerta ___ del supermercado se abre gracias a un sensor.',a:'automática'},
  {q:'El sensor de distancia que usa ultrasonido se llama ___.',a:'ultrasónico'},
  {q:'El sensor no decide: quien decide es el ___.',a:'controlador'},
];
let evalPRBank=[
  {term:'Sensor',def:'Percibe el mundo y lo convierte en una señal'},
  {term:'Sensor de luz',def:'Distingue claro y oscuro; sirve al sigue-líneas'},
  {term:'Sensor de distancia',def:'Mide qué tan lejos está un objeto con el eco'},
  {term:'Sensor de tacto',def:'Pulsador que avisa cuando algo lo presiona'},
  {term:'Sensor de temperatura',def:'Mide el calor o el frío: el termómetro digital'},
  {term:'Sensor de sonido',def:'Micrófono: capta ruidos, voces y aplausos'},
  {term:'Sensor de humedad',def:'Mide el agua de la tierra: avisa cuándo regar'},
  {term:'Actuador',def:'Ejecuta la acción: motor, rueda, bocina o luz'},
  {term:'Controlador',def:'Recibe la señal y decide qué se hará'},
  {term:'Señal',def:'Dato eléctrico que el sensor envía al controlador'},
  {term:'Fotorresistencia',def:'Componente que cambia según la luz que recibe'},
  {term:'Ultrasónico',def:'Sensor que lanza sonido y espera el eco'},
  {term:'Lectura equivocada',def:'Lo que informa un sensor sucio, mojado o tapado'},
  {term:'Sensor de proximidad',def:'Apaga la pantalla del celular junto a la oreja'},
  {term:'Receptor',def:'Nombre del sensor en el cuerpo humano'},
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

function genEval(){sfx('click');_evalFormaSelector(); const _selF = document.getElementById('evalFormaSel'); if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10))); const cf = evalFormNum; const rng = _evalRng(cf); window._currentEvalForm=cf;evalFormNum = (evalFormNum % EVAL_FORMAS) + 1; _evalFormaSelector();saveProgress();document.getElementById('eval-screen-title').textContent=`🎓 Evaluación Final · Forma ${cf} · Sensores: los Sentidos del Robot`;evalAnsVisible=false;const out=document.getElementById('evalOut');out.innerHTML='';const bar=document.createElement('div');bar.className='eval-score-bar';bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje · 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25 pts</span><span class="eval-score-pill esp-tf">V/F 25 pts</span><span class="eval-score-pill esp-mc">Selección 25 pts</span><span class="eval-score-pill esp-pr">Pareados 25 pts</span></div>`;out.appendChild(bar);const cpItems=_pickF(evalCPBank,5, rng);const s1=document.createElement('div');s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';cpItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='cp';d.dataset.evalIndex=i;const qHtml=item.q.replace('___',`<input class="eval-cp-input" type="text" data-cp="${i}" autocomplete="off">`);d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbCp${i}" aria-live="polite"></div>`;s1.appendChild(d);});out.appendChild(s1);const tfItems=_pickF(evalTFBank,5, rng);const s2=document.createElement('div');s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';tfItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='tf';d.dataset.evalIndex=i;d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="true"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="false"> Falso</label></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbTf${i}" aria-live="polite"></div>`;s2.appendChild(d);});out.appendChild(s2);const mcItems=_pickF(evalMCBank,5, rng);const s3=document.createElement('div');s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';mcItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='mc';d.dataset.evalIndex=i;const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join('');d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbMc${i}" aria-live="polite"></div>`;s3.appendChild(d);});out.appendChild(s3);const prItems=_pickF(evalPRBank,5, rng);let shuffledDefs=_shuffleF(prItems, rng);let _prTries=0;while(shuffledDefs.some((df,ix)=>df.def===prItems[ix].def)&&_prTries<20){shuffledDefs=_shuffleF(shuffledDefs, rng);_prTries++;}const letters=['A','B','C','D','E'];const s4=document.createElement('div');s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';const matchCard=document.createElement('div');matchCard.className='eval-item';let colLeft='<div class="eval-match-col"><h4>📌 Términos</h4>';prItems.forEach((item,i)=>{colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> <select class="eval-match-select" data-pr="${i}" aria-label="Respuesta pareada ${i+16}"><option value="">?</option>${letters.map(l=>`<option value="${l}">${l}</option>`).join('')}</select> ${item.term}</div>`;});colLeft+='</div>';let colRight='<div class="eval-match-col"><h4>🔑 Definiciones</h4>';shuffledDefs.forEach((item,i)=>{colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`;});colRight+='</div>';const ansKey=prItems.map((item,i)=>{const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)];return`${i+16}→${letter}`;}).join(' · ');matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div><div class="eval-item-feedback" id="evalFbPr" aria-live="polite"></div>`;s4.appendChild(matchCard);out.appendChild(s4);window._evalPrintData={tf:tfItems,mc:mcItems,cp:cpItems,pr:{terms:prItems,shuffledDefs,letters}};const autoPanel=document.createElement('div');autoPanel.id='evalAutoResult';autoPanel.className='eval-auto-result';autoPanel.innerHTML='<strong>🧮 Evaluación interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato original sin respuestas digitadas.';out.appendChild(autoPanel);fin('s-evaluacion');}
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
    const zgBlock = `<div class="zg-wrap"><div class="zg-title">🎯 Clave rápida estilo ZipGrade · Forma ${forma}: respuestas correctas ya rellenadas para digitar la clave en la app</div><div class="zg-grid"><div class="zg-col">${zgCol1}</div><div class="zg-col">${zgCol2}</div></div><div class="zg-ver"><span>Test Version / Forma:</span>${zgVer}</div><div class="zg-note">1–5 (Completar): se revisan a mano → ✓ (A) equivale a respuesta correcta · 6–10: V=A, F=B · Réplica visual de referencia; para escanear alumnos usa la hoja oficial de ZipGrade.</div></div>`;

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación Sensores: los Sentidos del Robot · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.12rem 0.4rem;margin:0.22rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #0e7490;background:#ecfeff;color:#0e7490;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#0e7490;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #0e7490;height:12px;}.obt-pct{white-space:nowrap;}.qn{font-weight:700;min-width:22px;flex-shrink:0;}.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:40px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.18rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.14rem 0.35rem;margin-bottom:0.1rem;break-inside:avoid;page-break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.3;display:flex;gap:0.28rem;margin-bottom:0.07rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.1rem 0.5rem;}.mc-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:0.04rem 0.15rem;margin-left:0.8rem;}.mc-opt{font-size:9pt;display:flex;align-items:center;gap:0.15rem;}.mc-opt input{width:10px;height:10px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{margin-top:0.1rem;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.08rem 0.4rem;margin-top:0.08rem;}.pr-head{font-size:9pt;font-weight:700;color:#555;margin-bottom:0.1rem;}.pr-item{font-size:10.5pt;padding:0.1rem 0.28rem;background:#ecfeff;border-radius:3px;margin-bottom:0.07rem;display:flex;align-items:center;gap:0.2rem;line-height:1.2;break-inside:avoid;page-break-inside:avoid;}.pr-num{font-weight:700;color:#0e7490;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.22rem;padding:0.15rem 0;page-break-before:avoid;break-before:avoid;color:#0e7490;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #0e7490;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#555;}.pa{color:#007a00;font-weight:600;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · Sensores: los Sentidos del Robot · Educación Básica · Robótica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✅ PAUTA: Evaluación Final · Sensores: los Sentidos del Robot · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u</div></div><div class="p-grid">${pR}</div>
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
  {txt:'Un robot riega la huerta escolar solo cuando la tierra está seca.',ans:'Sensor de humedad: mide el agua de la tierra; si está seca, el controlador decide abrir el riego. Si el sensor se moja por fuera puede informar «húmeda» y la huerta se queda sin agua.'},
  {txt:'Un robot mensajero se detiene antes de chocar con una pared o una persona.',ans:'Sensor de distancia (ultrasónico): mide con el eco qué tan cerca está el obstáculo; si está muy cerca, el controlador decide frenar. Si algo tapa el sensor, el eco no regresa y el robot choca.'},
  {txt:'Una lámpara robótica del corredor se enciende sola cuando llega la noche.',ans:'Sensor de luz: detecta que hay poca luz; el controlador decide encender la lámpara. Si el sensor está sucio, puede «ver» oscuro a mediodía y encender la lámpara de gusto.'},
  {txt:'Un robot cuida la incubadora de pollitos y avisa si se enfría.',ans:'Sensor de temperatura: mide el calor; si baja demasiado, el controlador decide encender el foco o la alarma. Si el sensor está lejos de los pollitos, la lectura no sirve.'},
  {txt:'Un robot de juguete arranca cuando el niño aplaude dos veces.',ans:'Sensor de sonido (micrófono): capta los aplausos; el controlador decide poner en marcha los motores. En un lugar con mucho ruido el sensor puede confundirse y arrancar solo.'},
  {txt:'Un carrito robótico sigue una línea negra pintada en el piso del aula.',ans:'Sensor de luz: distingue lo negro de lo claro en el piso; el controlador decide corregir el rumbo. Con el lente sucio o con poca luz da lecturas equivocadas y el carrito se sale.'},
  {txt:'La puerta del supermercado se abre cuando una persona se acerca.',ans:'Sensor de distancia o de movimiento: detecta a la persona cerca; el controlador decide abrir y el motor desliza la puerta. Si el sensor apunta mal, la puerta se abre sin que pase nadie.'},
  {txt:'El robot detecta que alguien presionó su botón de emergencia.',ans:'Sensor de tacto (pulsador): se activa por contacto; el controlador decide detener todo. Es un sensor que necesita tocar, no funciona a distancia.'},
];
let critErrorBank=[
  {txt:'"El sensor mueve al robot: por eso el carrito avanza."',
   g1:'El sensor NO mueve nada: solo percibe y envía una señal al controlador.',
   g2:'Quien mueve el carrito es el ACTUADOR (el motor), después de que el controlador decidió. La cadena es sensor → controlador → actuador.'},
  {txt:'"Los sensores son los músculos del robot y los actuadores son sus sentidos."',
   g1:'Está al revés: los SENSORES son los «sentidos» (perciben luz, sonido, distancia, calor, humedad).',
   g2:'Los ACTUADORES son los «músculos» (motores, ruedas, brazos, bocinas) que ejecutan la acción.'},
  {txt:'"Un sensor nunca se equivoca: siempre dice la verdad."',
   g1:'Un sensor SÍ puede dar una lectura equivocada si está sucio, mojado, tapado o mal colocado.',
   g2:'Y si el sensor informa mal, el controlador decide mal: por eso el sigue-líneas se sale de la línea cuando el sensor está lodoso.'},
  {txt:'"Con un solo sensor de luz el robot ya puede medir la distancia y la temperatura."',
   g1:'Cada sensor percibe UNA sola cosa: el de luz solo mide cuánta luz hay.',
   g2:'Para medir distancia se necesita un sensor de distancia (ultrasónico) y para el calor uno de temperatura. Por eso los robots llevan varios sensores.'},
  {txt:'"El sensor de tacto puede avisar del obstáculo antes de llegar a él."',
   g1:'El sensor de tacto necesita CONTACTO: avisa cuando el robot ya chocó o presionó algo.',
   g2:'Para saberlo ANTES hay que usar un sensor que percibe sin tocar, como el ultrasónico de distancia.'},
  {txt:'"Los sensores piensan y deciden qué debe hacer el robot."',
   g1:'Los sensores NO piensan ni deciden: solo miden y convierten lo medido en una señal.',
   g2:'Quien decide es el CONTROLADOR, siguiendo su programa: «si el sensor marca X, entonces hacer Y».'},
];
let critCicloQuestions=[
  '1. ¿Qué SENSOR usa y qué percibe exactamente?',
  '2. ¿Qué DECIDE el controlador con esa señal?',
  '3. ¿Con qué ACTUADOR responde el robot?',
];
let critCicloBank=[
  {txt:'La puerta automática del supermercado se abre cuando una persona se acerca y se cierra cuando ya nadie pasa.',
   p:'Un sensor de distancia o de movimiento percibe que hay alguien cerca de la puerta.',
   d:'El controlador decide abrir cuando detecta a alguien y cerrar cuando ya no hay nadie.',
   a:'Un motor (actuador) desliza la puerta hacia un lado y luego la regresa.'},
  {txt:'El robot de la huerta escolar mide la tierra cada mañana; si está seca abre el agua y, cuando ya está húmeda, la cierra.',
   p:'El sensor de humedad percibe cuánta agua tiene la tierra.',
   d:'El controlador decide abrir el riego si la tierra está seca y cerrarlo cuando ya está húmeda.',
   a:'Una válvula o bomba (actuador) deja pasar el agua y luego la corta.'},
  {txt:'La lámpara del corredor de la escuela se enciende sola al anochecer y se apaga al amanecer.',
   p:'El sensor de luz percibe cuánta luz hay en el corredor.',
   d:'El controlador decide encender cuando hay poca luz y apagar cuando vuelve la luz del día.',
   a:'La lámpara o foco (actuador) se enciende y se apaga.'},
  {txt:'El carrito sigue-líneas del aula recorre una pista negra pintada en el piso sin salirse.',
   p:'El sensor de luz percibe si debajo del carrito el piso está oscuro (la línea) o claro (fuera de la línea).',
   d:'El controlador decide corregir el rumbo hacia el lado donde vuelve a encontrar la línea.',
   a:'Los motores de las ruedas (actuadores) giran más de un lado que del otro para girar.'},
  {txt:'El robot de la incubadora de pollitos vigila el calor toda la noche.',
   p:'El sensor de temperatura percibe cuántos grados hay dentro de la incubadora.',
   d:'El controlador decide encender el foco si hace frío y apagarlo cuando ya hay suficiente calor.',
   a:'El foco de calor (actuador) se enciende; una alarma puede sonar si el problema sigue.'},
];
let critCompareBank=[
  {a:'Parte del robot que capta información del mundo: luz, sonido, distancia, calor o humedad.',b:'Parte del robot que ejecuta la acción: motores, ruedas, brazos, bocinas o luces.',
   ga:'El sensor.',
   gb:'El actuador.',
   gr:'Semejanza: los dos son partes del robot conectadas al controlador y necesitan energía. Diferencia: el sensor mete información (percibe) y el actuador saca acción (hace), como los sentidos y los músculos del cuerpo.'},
  {a:'Sensor que distingue si el piso está claro u oscuro para no salirse de la pista.',b:'Sensor que mide con el eco cuántos centímetros faltan para chocar.',
   ga:'El sensor de luz.',
   gb:'El sensor de distancia (ultrasónico).',
   gr:'Semejanza: los dos perciben SIN tocar y avisan al controlador. Diferencia: el de luz mide claridad y el de distancia mide cuán lejos está un objeto; uno sirve al sigue-líneas y el otro para esquivar obstáculos.'},
  {a:'Sensor que solo se activa cuando algo lo toca o lo presiona.',b:'Sensor que percibe a los objetos aunque estén a varios centímetros.',
   ga:'El sensor de tacto (pulsador).',
   gb:'El sensor de distancia (ultrasónico) o el de proximidad.',
   gr:'Semejanza: los dos detectan obstáculos. Diferencia: el de tacto avisa cuando el choque YA ocurrió y el de distancia avisa ANTES, por eso se usa para frenar a tiempo.'},
  {a:'Órgano del cuerpo humano que capta la luz y la envía al cerebro.',b:'Componente del robot que cambia según la luz que recibe y avisa al controlador.',
   ga:'El ojo (receptor).',
   gb:'El sensor de luz o fotorresistencia.',
   gr:'Semejanza: los dos perciben la luz y mandan la información a quien decide (cerebro o controlador). Diferencia: el ojo es un órgano vivo del cuerpo y el sensor es un componente electrónico fabricado.'},
  {a:'Sensor que mide cuánto calor o frío hay en un lugar.',b:'Sensor que mide cuánta agua hay en la tierra o en el aire.',
   ga:'El sensor de temperatura.',
   gb:'El sensor de humedad.',
   gr:'Semejanza: los dos vigilan el ambiente y son muy útiles en el agro hondureño. Diferencia: el de temperatura sirve para la incubadora o el termómetro del centro de salud y el de humedad para decidir cuándo regar el cafetal.'},
];
let critDesignBank=[
  'En la huerta escolar el agua se desperdicia: a veces riegan cuando la tierra todavía está mojada y otras veces se olvidan por días.',
  'En el pasillo de la escuela dejan la luz encendida todo el día y el recibo de energía es altísimo.',
  'En el beneficio de café los granos se secan al sol en el patio y nadie avisa a tiempo cuando empieza a llover.',
  'El portón de la escuela se queda abierto porque nadie se da cuenta cuando entra o sale alguien.',
  'En la bodega de granos básicos el maíz se echa a perder por la humedad y nadie lo nota hasta que ya está dañado.',
  'Los niños más pequeños se acercan demasiado al fogón de la cocina escolar y nadie los ve a tiempo.',
];
let critDesignGuide='Rúbrica de 3 criterios (total 20 pts): ① SENSORES (8 pts): elige al menos dos sensores adecuados al problema y explica QUÉ PERCIBE cada uno. ② CONTROLADOR (6 pts): escribe una decisión clara del tipo «si el sensor marca X, entonces el robot hace Y». ③ ACTUADOR Y FALLOS (6 pts): nombra con qué actúa el robot y menciona qué podría hacer que un sensor dé una lectura equivocada (sucio, mojado, tapado, poca luz). Cualquier diseño vale si la cadena sensor → controlador → actuador queda completa y es realista.';
function genEvalCrit(){
  sfx('click');
  _injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });
  const _sC = document.getElementById('evalCritFormaSel');
  if (_sC && parseInt(_sC.value, 10)) evalCritFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sC.value, 10)));
  const cf=evalCritFormNum;window._currentEvalCritForm=cf;const rngC = _evalRng(200000 + cf);evalCritFormNum=(evalCritFormNum%EVAL_FORMAS)+1;_injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });saveProgress();
  document.getElementById('evalcrit-screen-title').textContent=`🧠 Pensamiento Crítico · Forma ${cf} · Sensores: los Sentidos del Robot`;
  evalCritAnsVisible=false;
  const out=document.getElementById('evalCritOut');out.innerHTML='';
  const sens=_pickF(critSensorBank,2,rngC);
  const s1=document.createElement('div');
  s1.innerHTML=`<div class="eval-section-title">I. Elige el sensor y justifica <span class="eval-pts">20 pts</span></div><div class="eval-item">${sens.map((k,i)=>`<div class="crit-scenario">Caso ${i+1}: ${k.txt}</div><div class="crit-q-block"><div class="crit-q-label">¿Qué sensor necesita este robot? Justifica: ¿qué percibe y qué podría hacer que se equivoque?</div><textarea class="crit-textarea" rows="2" aria-label="Sensor del caso ${i+1} y su justificación"></textarea><div class="crit-pauta">${k.ans}</div></div>`).join('')}<div class="crit-selfscore"><label for="critScore0">Obtenido:</label><input type="number" id="critScore0" class="crit-score-input" data-score="0" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s1);
  const err=_pickF(critErrorBank,1,rngC)[0];
  const s2=document.createElement('div');
  s2.innerHTML=`<div class="eval-section-title">II. Corrige el error conceptual <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${err.txt}</div><p style="font-size:0.85rem;margin-bottom:0.5rem;">Esta afirmación tiene <strong>dos errores</strong>. Corrígelos con argumentos, usando la cadena sensor → controlador → actuador:</p><div class="crit-q-block"><div class="crit-q-label">Error 1 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 1 y su corrección"></textarea><div class="crit-pauta">${err.g1}</div></div><div class="crit-q-block"><div class="crit-q-label">Error 2 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 2 y su corrección"></textarea><div class="crit-pauta">${err.g2}</div></div><div class="crit-selfscore"><label for="critScore1">Obtenido:</label><input type="number" id="critScore1" class="crit-score-input" data-score="1" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s2);
  const cic=_pickF(critCicloBank,1,rngC)[0];
  const cicloGuides=[cic.p,cic.d,cic.a];
  const s3=document.createElement('div');
  s3.innerHTML=`<div class="eval-section-title">III. Analiza la cadena: sensor → controlador → actuador <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${cic.txt}</div>${critCicloQuestions.map((q,i)=>`<div class="crit-q-block"><div class="crit-q-label">${q}</div><textarea class="crit-textarea" rows="2" aria-label="${q}"></textarea><div class="crit-pauta">${cicloGuides[i]}</div></div>`).join('')}<div class="crit-selfscore"><label for="critScore2">Obtenido:</label><input type="number" id="critScore2" class="crit-score-input" data-score="2" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s3);
  const cmp=_pickF(critCompareBank,1,rngC)[0];
  const s4=document.createElement('div');
  s4.innerHTML=`<div class="eval-section-title">IV. Comparación razonada <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-compare-grid"><div class="crit-compare-box"><h5>Caso A</h5>${cmp.a}</div><div class="crit-compare-box"><h5>Caso B</h5>${cmp.b}</div></div><div class="crit-q-block"><div class="crit-q-label">1. ¿Qué concepto corresponde a cada caso? 2. ¿En qué se parecen? 3. ¿En qué se diferencian? Da un ejemplo de cada uno.</div><textarea class="crit-textarea" rows="4" aria-label="Comparación razonada de los casos A y B"></textarea><div class="crit-pauta">Caso A: ${cmp.ga} · Caso B: ${cmp.gb} · ${cmp.gr}</div></div><div class="crit-selfscore"><label for="critScore3">Obtenido:</label><input type="number" id="critScore3" class="crit-score-input" data-score="3" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s4);
  const dis=_pickF(critDesignBank,1,rngC)[0];
  const s5=document.createElement('div');
  s5.innerHTML=`<div class="eval-section-title">V. Diseña el sistema de sensores de tu robot <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${dis}</div><div class="crit-q-block"><div class="crit-q-label">Inventa un robot que resuelva este problema: escribe su nombre, qué SENSORES lleva y qué percibe cada uno, qué DECIDE su controlador («si el sensor marca X, entonces hace Y»), con qué ACTUADOR responde y qué podría hacer fallar a un sensor. Puedes dibujarlo en tu cuaderno.</div><textarea class="crit-textarea" rows="5" aria-label="Diseño y justificación del sistema de sensores"></textarea><div class="crit-pauta">${critDesignGuide}</div></div><div class="crit-selfscore"><label for="critScore4">Obtenido:</label><input type="number" id="critScore4" class="crit-score-input" data-score="4" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
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
  let s1=`<div class="sec-title"><span>I. Elige el sensor y justifica</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div>`;
  d.sens.forEach((k,i)=>{s1+=`<p class="crit-print-scenario">Caso ${i+1}: ${k.txt}</p><p class="crit-print-q">¿Qué sensor necesita este robot? Justifica tu elección.</p>${lines(1)}`;});
  let s2=`<div class="sec-title"><span>II. Corrige el error conceptual</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.err.txt}</p><p class="crit-print-q">Esta afirmación tiene dos errores. Corrígelos con argumentos:</p><p class="crit-print-q"><strong>Error 1:</strong></p>${lines(1)}<p class="crit-print-q"><strong>Error 2:</strong></p>${lines(1)}`;
  let s3=`<div class="sec-title"><span>III. Analiza la cadena: sensor → controlador → actuador</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.cic.txt}</p>`;
  critCicloQuestions.forEach(q=>{s3+=`<p class="crit-print-q">${q}</p>${lines(1)}`;});
  let s4=`<div class="sec-title"><span>IV. Comparación razonada</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><div class="crit-compare-print-grid"><div class="crit-compare-print-box"><strong>Caso A:</strong> ${d.cmp.a}</div><div class="crit-compare-print-box"><strong>Caso B:</strong> ${d.cmp.b}</div></div><p class="crit-print-q">1. ¿Qué concepto corresponde a cada caso? 2. ¿En qué se parecen? 3. ¿En qué se diferencian? Da un ejemplo de cada uno.</p>${lines(2)}`;
  let s5=`<div class="sec-title"><span>V. Diseña el sistema de sensores de tu robot</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.dis}</p><p class="crit-print-q">Inventa un robot que resuelva este problema: escribe su nombre, qué SENSORES lleva y qué percibe cada uno, qué DECIDE su controlador («si el sensor marca X, entonces hace Y»), con qué ACTUADOR responde y qué podría hacer fallar a un sensor. Dibújalo al reverso de la hoja.</p>${lines(4)}`;
  let pR='';
  pR+=`<div class="p-sec"><div class="p-ttl">I. Elige el sensor</div>${d.sens.map((k,i)=>`<div class="p-crit-line"><strong>Caso ${i+1}:</strong> ${k.ans}</div>`).join('')}</div>`;
  pR+=`<div class="p-sec"><div class="p-ttl">II. Corrige el error</div><div class="p-crit-line"><strong>Error 1:</strong> ${d.err.g1}</div><div class="p-crit-line"><strong>Error 2:</strong> ${d.err.g2}</div></div>`;
  pR+=`<div class="p-sec"><div class="p-ttl">III. Analiza la cadena</div><div class="p-crit-line"><strong>Sensor:</strong> ${d.cic.p}</div><div class="p-crit-line"><strong>Controlador:</strong> ${d.cic.d}</div><div class="p-crit-line"><strong>Actuador:</strong> ${d.cic.a}</div></div>`;
  pR+=`<div class="p-sec"><div class="p-ttl">IV. Comparación</div><div class="p-crit-line"><strong>Caso A:</strong> ${d.cmp.ga}</div><div class="p-crit-line"><strong>Caso B:</strong> ${d.cmp.gb}</div><div class="p-crit-line">${d.cmp.gr}</div></div>`;
  pR+=`<div class="p-sec" style="grid-column:1/-1;"><div class="p-ttl">V. Diseña tu sistema de sensores · Rúbrica</div><div class="p-crit-line">${critDesignGuide}</div></div>`;
  const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Pensamiento Crítico Sensores: los Sentidos del Robot · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.1rem 0.4rem;margin:0.2rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #0e7490;background:#ecfeff;color:#0e7490;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#0e7490;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #0e7490;height:12px;}.obt-pct{white-space:nowrap;}.crit-print-scenario{font-size:10.5pt;background:#ecfeff;border-left:3px solid #0e7490;padding:0.2rem 0.5rem;margin:0.1rem 0 0.2rem;line-height:1.3;}.crit-print-q{font-size:10pt;font-weight:600;margin:0.15rem 0 0.08rem;line-height:1.25;}.ln{border-bottom:1px solid #111;min-height:12px;margin-bottom:2px;}.crit-compare-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin:0.15rem 0;}.crit-compare-print-box{font-size:9.5pt;background:#ecfeff;border-radius:4px;padding:0.25rem 0.4rem;line-height:1.25;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.08rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.9rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.45rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.1rem;margin-bottom:0.18rem;}.p-crit-line{font-size:11pt;color:#007a00;margin-bottom:0.18rem;line-height:1.35;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.2rem;padding:0.1rem 0;color:#0e7490;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #0e7490;}.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:12.7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="critEvalPage"><div class="ph"><h2>Evaluación Competencial · Pensamiento Crítico · Sensores: los Sentidos del Robot · Educación Básica · Robótica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 5 secciones de 20 puntos</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100</span></div></div><div class="pauta-wrap" id="critPautaPage"><div class="p-head"><div class="p-main">✅ PAUTA: Pensamiento Crítico · Sensores: los Sentidos del Robot · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 5 secciones × 20 pts c/u · respuesta abierta, usar como guía de corrección</div></div><div class="p-grid">${pR}</div></div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("critEvalPage",250,0.55,1.2);fit("critPautaPage",250,0.55,1.2);})();<\/script></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(typeof METAS_TR==='function'?METAS_TR(doc):doc);win.document.close();setTimeout(()=>win.print(),400);
}

// ===================== LABORATORIO DE SENSORES =====================
let sensorData={
  luz:{
    nombre:'El sensor de luz',icon:'☀️',
    percibe:{title:'¿Qué percibe?',info:'• Mide <strong>cuánta luz</strong> hay: distingue <strong>claro y oscuro</strong><br>• Su componente se llama <strong>fotorresistencia</strong><br>• Convierte la luz en una <strong>señal</strong> para el controlador'},
    sentido:{title:'¿A qué sentido se parece?',info:'• Se parece a tu <strong>ojo</strong> 👁️: el sentido de la <strong>vista</strong><br>• Tu ojo capta la luz y avisa al cerebro; el sensor avisa al controlador<br>• Es el <strong>receptor</strong> de la cadena, igual que en tu cuerpo'},
    honduras:{title:'Ejemplo hondureño',info:'• El <strong>carrito sigue-líneas</strong> que arma la clase de Robótica<br>• La <strong>luz del corredor</strong> que se enciende sola al anochecer<br>• Los <strong>faroles solares</strong> del parque que despiertan de noche'},
    falla:{title:'¿Qué pasa si falla?',info:'• Con el <strong>lente sucio de lodo</strong> «ve» oscuro donde hay claro<br>• El carrito <strong>se sale de la línea</strong> porque el dato es falso<br>• Con muy <strong>poca luz</strong> ya no distingue el piso claro del negro'}
  },
  distancia:{
    nombre:'El sensor de distancia',icon:'📏',
    percibe:{title:'¿Qué percibe?',info:'• Mide <strong>qué tan lejos</strong> está un objeto, en centímetros<br>• El <strong>ultrasónico</strong> lanza un sonido y espera el <strong>eco</strong><br>• Percibe <strong>sin tocar</strong>: avisa antes del choque'},
    sentido:{title:'¿A qué sentido se parece?',info:'• Se parece al <strong>eco del murciélago</strong> 🦇, que «ve» con el oído<br>• También a tu <strong>vista</strong> cuando calculas si algo está cerca<br>• La señal llega al controlador como en tu cuerpo llega al cerebro'},
    honduras:{title:'Ejemplo hondureño',info:'• La <strong>puerta automática</strong> del supermercado<br>• El <strong>dron</strong> que esquiva los árboles del cafetal<br>• El <strong>sensor de reversa</strong> del carro que pita al acercarse a un muro'},
    falla:{title:'¿Qué pasa si falla?',info:'• Si algo lo <strong>tapa</strong>, el eco no regresa y el robot <strong>choca</strong><br>• Con una tela suave el eco se pierde: mide <strong>mal la distancia</strong><br>• Mal apuntado, la puerta automática se abre <strong>sin que pase nadie</strong>'}
  },
  tacto:{
    nombre:'El sensor de tacto',icon:'🤲',
    percibe:{title:'¿Qué percibe?',info:'• Detecta <strong>contacto</strong>: si algo lo toca o lo presiona<br>• Suele ser un <strong>pulsador</strong> (botón) en el parachoques<br>• Solo tiene dos respuestas: <strong>presionado o suelto</strong>'},
    sentido:{title:'¿A qué sentido se parece?',info:'• Se parece a tu <strong>piel</strong> 🖐️: el sentido del <strong>tacto</strong><br>• Tú sientes cuando tocas la pared; el robot igual<br>• Necesita <strong>contacto</strong>: no percibe nada a distancia'},
    honduras:{title:'Ejemplo hondureño',info:'• El <strong>botón de encendido</strong> de cualquier aparato de la casa<br>• El <strong>parachoques</strong> del carrito robótico del aula<br>• El <strong>timbre</strong> de la escuela cuando alguien lo presiona'},
    falla:{title:'¿Qué pasa si falla?',info:'• Si se <strong>traba</strong>, el robot cree que está chocando siempre<br>• Si no responde, el robot <strong>sigue empujando</strong> la pared<br>• Aun funcionando, avisa <strong>tarde</strong>: cuando el golpe ya ocurrió'}
  },
  temperatura:{
    nombre:'El sensor de temperatura',icon:'🌡️',
    percibe:{title:'¿Qué percibe?',info:'• Mide <strong>cuánto calor o frío</strong> hay, en grados<br>• Convierte esos grados en una <strong>señal</strong> con números<br>• Permite decisiones como <strong>«si baja de 30°, encender el foco»</strong>'},
    sentido:{title:'¿A qué sentido se parece?',info:'• Se parece a tu <strong>piel</strong> 🖐️ cuando siente frío o calor<br>• Tú retiras la mano del comal caliente; el robot apaga el motor<br>• Es un <strong>receptor</strong> que informa al «cerebro» del sistema'},
    honduras:{title:'Ejemplo hondureño',info:'• El <strong>termómetro digital</strong> del centro de salud<br>• La <strong>incubadora de pollitos</strong> que vigila el calor toda la noche<br>• El <strong>horno</strong> del panadero que avisa cuando está listo'},
    falla:{title:'¿Qué pasa si falla?',info:'• Si está <strong>lejos</strong> de lo que debe medir, la lectura no sirve<br>• Al sol directo marca <strong>más calor</strong> del que hay en la sombra<br>• Con una lectura falsa, la incubadora se <strong>enfría o se recalienta</strong>'}
  },
  humedad:{
    nombre:'El sensor de humedad',icon:'💧',
    percibe:{title:'¿Qué percibe?',info:'• Mide <strong>cuánta agua</strong> hay en la tierra o en el aire<br>• Su punta se entierra y percibe si el suelo está <strong>seco o mojado</strong><br>• Avisa al controlador para decidir <strong>cuándo regar</strong>'},
    sentido:{title:'¿A qué sentido se parece?',info:'• Se parece a tu <strong>tacto</strong> 🖐️ cuando tocas la tierra y sabes si está mojada<br>• También a la sensación de <strong>aire pesado</strong> antes de llover<br>• Como todo receptor, solo informa: <strong>no decide ni riega</strong>'},
    honduras:{title:'Ejemplo hondureño',info:'• El <strong>riego del cafetal</strong>: ahorra agua y cuida la cosecha<br>• La <strong>huerta escolar</strong> que se riega sola el fin de semana<br>• La <strong>bodega de granos</strong> que vigila la humedad del maíz'},
    falla:{title:'¿Qué pasa si falla?',info:'• Si queda <strong>mojado por fuera</strong>, marca «húmedo» y la planta no se riega<br>• Si se entierra <strong>muy poco</strong>, mide el polvo de arriba y no la raíz<br>• Con una lectura equivocada se <strong>desperdicia el agua</strong> o se pierde la siembra'}
  }
};
let labSensor='luz',labAspecto='percibe';
function labShowSensor(sensorKey){labSensor=sensorKey;updateLabDisplay();document.querySelectorAll('.lab-cont-btn').forEach(b=>b.classList.remove('active-pri'));const btn=document.querySelector(`[data-sensor="${sensorKey}"]`);if(btn)btn.classList.add('active-pri');document.querySelectorAll('.lab-svg-part').forEach(g=>g.classList.remove('svg-active'));const sg=document.getElementById('svgS-'+sensorKey);if(sg)sg.classList.add('svg-active');if(typeof sfx==='function')sfx('click');}
function labShowAspecto(aspectoKey){labAspecto=aspectoKey;updateLabDisplay();document.querySelectorAll('.lab-asp-btn').forEach(b=>b.classList.remove('active-sec'));const btn=document.querySelector(`[data-aspecto="${aspectoKey}"]`);if(btn)btn.classList.add('active-sec');if(typeof sfx==='function')sfx('click');}
function updateLabDisplay(){const data=sensorData[labSensor];const asp=data[labAspecto];document.getElementById('lab-sentence').innerHTML=`🔬 Explorando: <strong>${data.nombre}</strong> → <strong>${asp.title}</strong>`;document.getElementById('lab-display').innerHTML=`<div class="lab-cont-header">${data.icon} ${data.nombre}</div><div class="lab-asp-title">${asp.title}</div><div class="lab-asp-info">${asp.info}</div>`;}

// ===================== DIPLOMA =====================
function _diplPct(){return xp>=MXP?100:Math.round((xp/MXP)*100);}
function openDiploma(){sfx('fan');const pct=_diplPct();document.getElementById('diplPct').textContent=pct+'%';document.getElementById('diplBar').style.width=pct+'%';document.getElementById('diplDate').textContent='Fecha: '+new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});const msgs=['¡Sigue explorando los sensores!','¡Muy buen trabajo, observador!','¡Vas muy bien: ya lees las señales!','¡Dominas los sentidos del robot!','¡Maestro de los Sentidos del Robot!'];document.getElementById('diplMsg').textContent=msgs[Math.min(Math.floor(pct/25),4)];const stars=['⭐','⭐⭐','⭐⭐⭐'];document.getElementById('diplStars').textContent=stars[Math.min(Math.floor(pct/40),2)];const achTxt=unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(' · ');document.getElementById('diplAch').textContent=achTxt||'Sigue completando secciones para desbloquear logros';document.getElementById('diplomaOverlay').classList.add('open');launchConfetti();}
function closeDiploma(){document.getElementById('diplomaOverlay').classList.remove('open');}
function updateDiplomaName(v){document.getElementById('diplName').textContent=v||'Estudiante';}
function shareWA(){const name=document.getElementById('diplName').textContent||'Estudiante';const pct=_diplPct();const msg=`📡 ¡${name} completó la Misión "Sensores: los Sentidos del Robot"! 🏅 Progreso: ${pct}% · 🌱 policastsapien.com`;_waShare(msg);}
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
  document.querySelector('[data-sensor="luz"]')?.classList.add('active-pri');
  document.querySelector('[data-aspecto="percibe"]')?.classList.add('active-sec');
  const sg=document.getElementById('svgS-luz');if(sg)sg.classList.add('svg-active');
  renderAchPanel();
});

(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalCrit==='function') _injectFormaSel('genEvalCrit','evalCritFormaSel',evalCritFormNum,function(v){evalCritFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();

// ===================== IDIOMA (español ↔ inglés) =====================
// El contenido en inglés vive en sensores-robot-en.js y el botón lo maneja
// ../../js/metas-i18n.js. Aquí solo se intercambian los bancos y se repinta:
// el progreso (XP, logros, secciones hechas) no se toca al cambiar de idioma.
const _BANCOS_ES = {
  ACHIEVEMENTS, lvls, fcData, memoPairs, qzData, classGroups, idData, cmpData,
  routeSets, neuronPartes, neuroPairs, enfermedadData, retoPairs,
  identifyTaskDB, classifyTaskDB, completeTaskDB, explainQuestions, sopaSets,
  evalTFBank, evalMCBank, evalCPBank, evalPRBank,
  critSensorBank, critErrorBank, critCicloQuestions, critCicloBank,
  critCompareBank, critDesignBank, critDesignGuide, sensorData
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
  critDesignGuide = usa('critDesignGuide'); sensorData = usa('sensorData');

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
