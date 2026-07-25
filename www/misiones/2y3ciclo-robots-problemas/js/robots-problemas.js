// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){if(typeof METAS_TR_TEXTO==='function')texto=METAS_TR_TEXTO(texto);const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
function compartirMision(){const url=window.location.href;const texto=`🏆 *Misión Asignada* 🏆\n\nCierra la *Ruta de los Robots*: aprende el ciclo de diseño de ingeniería y crea un robot que resuelva un problema de tu comunidad. 🛠️\n\nDesbloquea *todos los logros* y puedes poner *tus datos* para que tu maestro observe todos tus logros. 📋\n\n_Se te hará prueba escrita y presentarás tu proyecto en equipo._ 🤖\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;_waShare(texto);}
function toggleLetra(){document.body.classList.toggle('letra-grande');if(typeof sfx==='function')sfx('click');localStorage.setItem('preferenciaLetra',document.body.classList.contains('letra-grande'));}
window.addEventListener('DOMContentLoaded',()=>{if(localStorage.getItem('preferenciaLetra')==='true')document.body.classList.add('letra-grande');});

// ===================== UTILIDADES =====================
const _pick=(arr,n)=>[...arr].sort(()=>Math.random()-0.5).slice(0,n);
const _shuffle=(arr)=>[...arr].sort(()=>Math.random()-0.5);
function fb(id,msg,isOk){const el=document.getElementById(id);if(el){el.textContent=msg;el.className='fb show '+(isOk?'ok':'err');}}

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY='robots_problemas_v1';
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
  primer_quiz:{icon:'🏆',label:'Primer quiz del ciclo de diseño superado'},
  flash_master:{icon:'🃏',label:'Todas las flashcards del diseño exploradas'},
  clasif_pro:{icon:'🗂️',label:'Clasificador de problemas y soluciones experto'},
  id_master:{icon:'🔍',label:'Identificador de etapas del diseño maestro'},
  reto_hero:{icon:'⏱️',label:'Héroe del reto Problema vs Solución'},
  nivel3:{icon:'✏️',label:'¡Diseñador Junior! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡Ingeniero de Proyectos! Nivel 6'},
  widgets_master:{icon:'🔁',label:'Ciclo de diseño dominado de principio a fin'},
  taller_master:{icon:'🛠️',label:'Taller de diseño: proyecto hondureño resuelto'}
};
function unlockAchievement(id){if(unlockedAch.includes(id))return;unlockedAch.push(id);sfx('ach');showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label);launchConfetti();renderAchPanel();saveProgress();}
function renderAchPanel(){const list=document.getElementById('achList');list.innerHTML='';Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{const div=document.createElement('div');div.className='ach-item'+(unlockedAch.includes(id)?'':' locked');div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`;list.appendChild(div);});}
function toggleAchPanel(){sfx('click');document.getElementById('achPanel').classList.toggle('open');}
function showToast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}t.textContent=msg;t.style.display='block';clearTimeout(t._tid);t._tid=setTimeout(()=>t.style.display='none',3200);}
function launchConfetti(){const colors=['#0e7490','#22d3ee','#c2410c','#fb923c','#06b6d4'];for(let i=0;i<60;i++){const c=document.createElement('div');c.className='confetti-piece';c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`;document.body.appendChild(c);c.addEventListener('animationend',()=>c.remove());}}

// ===================== XP =====================
let lvls=[{t:0,n:'Aprendiz 🌱'},{t:25,n:'Observador de Problemas 🔍'},{t:55,n:'Diseñador Junior ✏️'},{t:90,n:'Constructor de Prototipos 🔧'},{t:130,n:'Probador Incansable 🧪'},{t:165,n:'Ingeniero de Proyectos 🛠️'},{t:190,n:'Maestro Innovador 🏆'}];
function pts(n){xp=Math.max(0,Math.min(MXP,xp+n));updateXPBar();saveProgress();}
function updateXPBar(){const pct=Math.round((xp/MXP)*100);document.getElementById('xpFill').style.width=pct+'%';const el=document.getElementById('xpPts');el.textContent='⭐ '+xp;el.style.transform='scale(1.3)';setTimeout(()=>el.style.transform='',300);let lv=0;for(let i=0;i<lvls.length;i++)if(xp>=lvls[i].t)lv=i;document.getElementById('xpLvl').textContent=lvls[lv].n;if(lv!==prevLevel){if(lv>=2)unlockAchievement('nivel3');if(lv>=5)unlockAchievement('nivel5');prevLevel=lv;}}
function resetXP(){sfx('click');xp=0;updateXPBar();showToast('🔄 XP reiniciado a 0');}
function fin(id,showFX=true){if(!done.has(id)){done.add(id);const b=document.querySelector(`[data-s="${id}"]`);if(b)b.classList.add('done');if(showFX){sfx('up');launchConfetti();}saveProgress();}}
function getProgress(){return Math.round((done.size/TOTAL_SECTIONS)*100);}

// ===================== NAV =====================
function go(id){sfx('click');document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});document.getElementById(id).classList.add('active');const btn=document.querySelector(`[data-s="${id}"]`);if(btn){btn.classList.add('active');btn.setAttribute('aria-selected','true');}window.scrollTo({top:0,behavior:'smooth'});if(id==='s-sopa'){setTimeout(buildSopa,50);}if(id==='s-widgets'){setTimeout(buildRoute,50);}}

// ===================== MINI-QUIZ (sección Criterios) =====================
function miniQ(btn,isOk,fbId){const wrap=btn.parentElement;if(wrap.dataset.done==='1')return;wrap.querySelectorAll('.cmp-opt').forEach(b=>b.classList.remove('sel'));if(isOk){wrap.dataset.done='1';btn.classList.add('correct');fb(fbId,'¡Correcto! Piensas como todo un robotista.',true);sfx('ok');}else{btn.classList.add('wrong');fb(fbId,'Casi. Pregúntate siempre: ¿a quién beneficia?, ¿a quién podría afectar?, ¿es seguro?',false);sfx('no');}}

// ===================== FLASHCARD DATA =====================
let fcData=[
  {w:'Ciclo de diseño',a:'🔁 Los <strong>7 pasos</strong> que siguen los ingenieros: identificar → idear → diseñar → construir → probar → mejorar → comunicar.'},
  {w:'Identificar el problema',a:'🔍 Primer paso: decir con claridad <strong>qué falla, a quién afecta y por qué importa</strong>.'},
  {w:'Idear',a:'💡 Anotar <strong>muchas ideas</strong> sin juzgarlas todavía; después se escoge la más realista.'},
  {w:'Diseñar',a:'✏️ Hacer el <strong>boceto</strong>: qué sensor, qué mecanismo, qué energía y qué programa llevará el robot.'},
  {w:'Prototipo',a:'🔧 La <strong>primera versión</strong> del robot, hecha con el material disponible, para poder probarla.'},
  {w:'Probar',a:'🧪 Ensayar varias veces y <strong>anotar</strong> qué funciona y qué falla, comparando con el criterio.'},
  {w:'Mejorar (iterar)',a:'🔁 Cambiar lo que falló y <strong>volver a probar</strong>. Fallar no es perder: es información para el siguiente intento.'},
  {w:'Comunicar',a:'📢 Presentar el proyecto: <strong>problema, diseño, prueba y mejora</strong>, con palabras claras y un dibujo.'},
  {w:'Criterio',a:'🎯 Lo que el robot <strong>debe lograr</strong> para considerarse un éxito (por ejemplo: avisar antes de que suba el río).'},
  {w:'Restricción',a:'⛔ El <strong>límite</strong> que no se puede pasar: costo, materiales disponibles, tiempo y seguridad.'},
  {w:'Boceto',a:'📐 Dibujo rápido del robot con sus <strong>partes rotuladas</strong>: sensores, mecanismos, fuente de energía.'},
  {w:'Roles del equipo',a:'👥 <strong>Diseñador, programador, constructor y probador</strong>: cada quien aporta y todos revisan.'},
  {w:'Ética del diseño',a:'⚖️ Preguntarse <strong>a quién beneficia</strong> el robot, a quién podría afectar y si es seguro para quien lo usa.'},
  {w:'Robot que resuelve',a:'🏆 Un robot útil no es el más bonito, sino el que <strong>resuelve un problema real</strong> de su comunidad.'}
];
let fcIdx=0;
function upFC(){document.getElementById('fcInner').classList.remove('flipped');document.getElementById('fcW').textContent=fcData[fcIdx].w;document.getElementById('fcA').innerHTML=fcData[fcIdx].a;document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length;}
function flipCard(){sfx('flip');document.getElementById('fcInner').classList.toggle('flipped');if(!xpTracker.fc.has(fcIdx)){xpTracker.fc.add(fcIdx);pts(1);}if(xpTracker.fc.size===fcData.length){fin('s-flash');unlockAchievement('flash_master');}}
function nextFC(){sfx('click');fcIdx=(fcIdx+1)%fcData.length;upFC();}
function prevFC(){sfx('click');fcIdx=(fcIdx-1+fcData.length)%fcData.length;upFC();}

// ===================== JUEGO: MEMORIA DEL CICLO DE DISEÑO =====================
let memoPairs=[
  {id:'identificar',t:'Identificar',d:'🔍 decir qué falla y a quién afecta'},
  {id:'idear',t:'Idear',d:'💡 anotar muchas soluciones posibles'},
  {id:'disenar',t:'Diseñar',d:'✏️ bocetar sensores, mecanismos y programa'},
  {id:'construir',t:'Construir',d:'🔧 armar el prototipo con lo disponible'},
  {id:'probar',t:'Probar',d:'🧪 ensayar y anotar qué falla'},
  {id:'mejorar',t:'Mejorar',d:'🔁 corregir y volver a probar'}
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
  {q:'¿Cuál es el PRIMER paso del ciclo de diseño?',o:['a) Construir el prototipo','b) Identificar el problema','c) Comunicar el resultado','d) Comprar materiales'],c:1},
  {q:'En la etapa de IDEAR, ¿qué conviene hacer?',o:['a) Escoger la primera idea que aparezca','b) Anotar muchas ideas y después escoger','c) Copiar el robot de otro equipo','d) Empezar a pegar cartón'],c:1},
  {q:'¿Qué se decide en el BOCETO del diseño?',o:['a) El color de la caja','b) Qué sensor, qué mecanismo, qué energía y qué programa','c) Quién habla en la presentación','d) La nota del equipo'],c:1},
  {q:'El prototipo del robot regador no cerró el agua a tiempo. ¿Qué sigue?',o:['a) Abandonar el proyecto','b) Mejorar el diseño y volver a probar','c) Decir que sí funcionó','d) Cambiar de tema'],c:1},
  {q:'«El robot no debe costar más de 200 lempiras» es…',o:['a) Un criterio','b) Una restricción','c) Un boceto','d) Una idea'],c:1},
  {q:'«Debe avisar antes de que el agua llegue al vado» es…',o:['a) Un criterio de éxito','b) Una restricción de costo','c) Un rol del equipo','d) Un material'],c:0},
  {q:'¿Qué sensor conviene al robot que alerta de inundaciones?',o:['a) Sensor de sonido','b) Sensor de nivel de agua','c) Sensor de color','d) Sensor de tacto'],c:1},
  {q:'¿Cuál es una pregunta ÉTICA del diseño?',o:['a) ¿De qué color lo pinto?','b) ¿A quién beneficia y a quién podría afectar?','c) ¿Cuántos tornillos lleva?','d) ¿Quién lo dibuja mejor?'],c:1},
  {q:'¿Cuál es la ÚLTIMA etapa del ciclo de diseño?',o:['a) Probar','b) Comunicar el resultado','c) Idear','d) Construir'],c:1}
];
let qzIdx=0,qzSel=-1,qzDone=false;
function buildQz(){qzIdx=0;qzSel=-1;qzDone=false;showQz();}
function showQz(){if(qzIdx>=qzData.length){document.getElementById('qzQ').textContent='🎉 ¡Quiz completado!';document.getElementById('qzOpts').innerHTML='';fin('s-quiz');unlockAchievement('primer_quiz');return;}const q=qzData[qzIdx];document.getElementById('qzProg').textContent=`Pregunta ${qzIdx+1} de ${qzData.length}`;document.getElementById('qzQ').textContent=q.q;const opts=document.getElementById('qzOpts');opts.innerHTML='';q.o.forEach((o,i)=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=o;b.onclick=()=>{if(qzDone)return;document.querySelectorAll('.qz-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');qzSel=i;sfx('click');};opts.appendChild(b);});qzDone=false;}
function checkQz(){if(qzSel<0)return fb('fbQz','Selecciona una respuesta.',false);qzDone=true;const opts=document.querySelectorAll('.qz-opt');if(qzSel===qzData[qzIdx].c){opts[qzSel].classList.add('correct');fb('fbQz','¡Correcto! +5 XP',true);if(!xpTracker.qz.has(qzIdx)){xpTracker.qz.add(qzIdx);pts(5);}sfx('ok');}else{opts[qzSel].classList.add('wrong');opts[qzData[qzIdx].c].classList.add('correct');fb('fbQz','Incorrecto. Revisa la respuesta correcta.',false);sfx('no');}setTimeout(()=>{qzIdx++;qzSel=-1;showQz();},1600);}
function resetQz(){sfx('click');qzIdx=0;qzSel=-1;qzDone=false;showQz();document.getElementById('fbQz').classList.remove('show');}

// ===================== CLASIFICACIÓN =====================
let classGroups=[
  {label:['Problema','Solución'],headA:'❓ Problema',headB:'💡 Solución',colA:'pro',colB:'sol',
   words:[{w:'La huerta se seca el fin de semana',t:'pro'},{w:'Un regador que abre el agua solo',t:'sol'},{w:'El río crece y nadie sabe si cruzar',t:'pro'},{w:'Una alarma que mide el nivel del agua',t:'sol'},{w:'La basura del centro se mezcla',t:'pro'},{w:'Una banda que separa plástico y papel',t:'sol'},{w:'El café tendido se moja con la lluvia',t:'pro'},{w:'Un techo que se cierra al llover',t:'sol'}]},
  {label:['Criterio','Restricción'],headA:'🎯 Criterio (qué debe lograr)',headB:'⛔ Restricción (límite)',colA:'cri',colB:'res',
   words:[{w:'Debe avisar antes de que suba el agua',t:'cri'},{w:'Solo hay 200 lempiras',t:'res'},{w:'Debe regar toda la huerta',t:'cri'},{w:'Solo tenemos material reciclado',t:'res'},{w:'Debe separar plástico y papel',t:'cri'},{w:'Hay tres semanas de plazo',t:'res'},{w:'Debe encender la alarma de noche',t:'cri'},{w:'Ningún cable puede quedar pelado',t:'res'}]},
  {label:['Diseñar','Probar'],headA:'✏️ Etapa de diseño',headB:'🧪 Etapa de prueba',colA:'dis',colB:'pru',
   words:[{w:'Dibujar el boceto rotulado',t:'dis'},{w:'Medir si avisa a tiempo',t:'pru'},{w:'Escoger el sensor adecuado',t:'dis'},{w:'Anotar qué falló',t:'pru'},{w:'Escribir las instrucciones del programa',t:'dis'},{w:'Repetir el ensayo tres veces',t:'pru'},{w:'Decidir la fuente de energía',t:'dis'},{w:'Comparar el resultado con el criterio',t:'pru'}]},
  {label:['Sensor','Actuador'],headA:'📡 Sensor (mide)',headB:'💪 Actuador (hace)',colA:'sen',colB:'act',
   words:[{w:'Sensor de humedad',t:'sen'},{w:'Bomba de agua',t:'act'},{w:'Sensor de nivel de agua',t:'sen'},{w:'Bocina de alarma',t:'act'},{w:'Cámara',t:'sen'},{w:'Motor con ruedas',t:'act'},{w:'Sensor de peso',t:'sen'},{w:'Brazo con banda',t:'act'}]}
];
let currentClassGroupIdx=0,clsSelectedWord=null;
function buildClass(){const group=classGroups[currentClassGroupIdx];document.getElementById('col-left-head').textContent=group.headA;document.getElementById('col-right-head').textContent=group.headB;const bank=document.getElementById('clsBank');bank.innerHTML='';clsSelectedWord=null;document.getElementById('items-left').innerHTML='';document.getElementById('items-right').innerHTML='';_shuffle([...group.words]).forEach(w=>{const el=document.createElement('div');el.className='wb-item';el.textContent=w.w;el.dataset.t=w.t;el.onclick=()=>{document.querySelectorAll('.wb-item').forEach(i=>i.classList.remove('sel-word'));el.classList.add('sel-word');clsSelectedWord=el;sfx('click');};bank.appendChild(el);});['col-left','col-right'].forEach(colId=>{const col=document.getElementById(colId);col.onclick=(e)=>{if(!clsSelectedWord||e.target.classList.contains('drop-item'))return;const targetId=colId==='col-left'?'items-left':'items-right';const wordsCol=document.getElementById(targetId);const item=document.createElement('div');item.className='drop-item';item.textContent=clsSelectedWord.textContent;item.dataset.t=clsSelectedWord.dataset.t;const original=clsSelectedWord;item.onclick=(ev)=>{ev.stopPropagation();if(clsSelectedWord!==null){col.click();}else{document.getElementById('clsBank').appendChild(original);original.classList.remove('sel-word');item.remove();if(typeof sfx==='function')sfx('click');}};wordsCol.appendChild(item);clsSelectedWord.remove();clsSelectedWord=null;sfx('click');};});}
function checkClass(){const remaining=document.querySelectorAll('#clsBank .wb-item').length;if(remaining>0){fb('fbCls','Mueve todas las palabras a las columnas primero.',false);return;}const group=classGroups[currentClassGroupIdx];let allOk=true;document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{const inLeft=el.parentElement.id==='items-left';const expectedType=inLeft?group.colA:group.colB;if(el.dataset.t===expectedType){el.classList.add('cls-ok');}else{el.classList.add('cls-no');allOk=false;}});if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);}if(allOk){fb('fbCls','¡Perfecto! +5 XP',true);sfx('fan');fin('s-clasifica');unlockAchievement('clasif_pro');}else{fb('fbCls','Hay errores. Marcados en rojo.',false);sfx('no');}}
function nextClassGroup(){sfx('click');currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length;buildClass();document.getElementById('fbCls').classList.remove('show');showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]);}
function resetClass(){sfx('click');buildClass();document.getElementById('fbCls').classList.remove('show');}

// ===================== IDENTIFICAR =====================
let idData=[
  {s:['Todo','proyecto','empieza','al','identificar','el','problema.'],c:4,art:'La primera etapa del ciclo de diseño'},
  {s:['Después','de','idear,','el','equipo','dibuja','el','boceto.'],c:6,art:'El dibujo rotulado del diseño'},
  {s:['El','prototipo','se','arma','con','material','reciclado.'],c:1,art:'La primera versión del robot'},
  {s:['En','la','prueba','anotamos','todo','lo','que','falla.'],c:2,art:'La etapa donde se ensaya el prototipo'},
  {s:['Fallar','sirve','para','mejorar','el','diseño.'],c:3,art:'La etapa de corregir y volver a probar'},
  {s:['Al','final','el','equipo','comunica','su','proyecto.'],c:4,art:'La última etapa del ciclo'},
  {s:['El','costo','es','una','restricción','del','proyecto.'],c:4,art:'El límite que no se puede pasar'},
  {s:['Avisar','a','tiempo','es','el','criterio','de','éxito.'],c:5,art:'Lo que el robot debe lograr'}
];
let idIdx=0,idDone=false;
function showId(){idDone=false;if(idIdx>=idData.length){document.getElementById('idSent').innerHTML='🎉 ¡Completado!';fin('s-identifica');unlockAchievement('id_master');return;}const d=idData[idIdx];document.getElementById('idProg').textContent=`Oración ${idIdx+1} de ${idData.length}`;document.getElementById('idInfo').textContent=`Busca: ${d.art}`;const sent=document.getElementById('idSent');sent.innerHTML='';d.s.forEach((w,i)=>{const span=document.createElement('span');span.className='id-word';span.textContent=w+' ';span.onclick=()=>checkId(i,span);sent.appendChild(span);});}
function checkId(i,span){if(idDone)return;document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected'));span.classList.add('selected');if(i===idData[idIdx].c){idDone=true;span.classList.add('id-ok');fb('fbId','¡Correcto! +5 XP',true);if(!xpTracker.id.has(idIdx)){xpTracker.id.add(idIdx);pts(5);}sfx('ok');}else{span.classList.add('id-no');fb('fbId','Ese no es el término solicitado.',false);sfx('no');}}
function nextId(){sfx('click');idIdx++;showId();document.getElementById('fbId').classList.remove('show');}
function resetId(){sfx('click');idIdx=0;showId();document.getElementById('fbId').classList.remove('show');}

// ===================== COMPLETA =====================
let cmpData=[
  {s:'El ciclo de diseño empieza al ___ el problema.',opts:['identificar','pintar','vender'],c:0},
  {s:'En la etapa de idear anotamos muchas ___.',opts:['notas de conducta','ideas','tareas'],c:1},
  {s:'El dibujo rotulado del robot se llama ___.',opts:['boceto','recibo','cartel'],c:0},
  {s:'La primera versión que se puede probar es el ___.',opts:['prototipo','diploma','manual'],c:0},
  {s:'Al probar hay que ___ lo que falla.',opts:['esconder','anotar','olvidar'],c:1},
  {s:'Si el prototipo falla, lo correcto es ___ y volver a probar.',opts:['rendirse','mejorar','copiar'],c:1},
  {s:'El dinero disponible es una ___ del proyecto.',opts:['restricción','idea','prueba'],c:0},
  {s:'La última etapa del ciclo es ___ el resultado.',opts:['comunicar','esconder','borrar'],c:0}
];
let cmpIdx=0,cmpSel=-1,cmpDone=false;
function showCmp(){if(cmpIdx>=cmpData.length){document.getElementById('cmpSent').innerHTML='🎉 ¡Completado!';document.getElementById('cmpOpts').innerHTML='';fin('s-completa');return;}const d=cmpData[cmpIdx];document.getElementById('cmpProg').textContent=`Oración ${cmpIdx+1} de ${cmpData.length}`;document.getElementById('cmpSent').innerHTML=d.s.replace('___','<span class="blank">___</span>');const opts=document.getElementById('cmpOpts');opts.innerHTML='';cmpSel=-1;cmpDone=false;d.opts.forEach((o,i)=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=o;b.onclick=()=>{if(cmpDone)return;document.querySelectorAll('.cmp-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');cmpSel=i;sfx('click');};opts.appendChild(b);});}
function checkCmp(){if(cmpSel<0)return fb('fbCmp','Selecciona una opción.',false);cmpDone=true;const opts=document.querySelectorAll('.cmp-opt');if(cmpSel===cmpData[cmpIdx].c){opts[cmpSel].classList.add('correct');document.getElementById('cmpSent').innerHTML=cmpData[cmpIdx].s.replace('___',`<span class="blank" style="color:var(--jade);border-color:var(--jade)">${opts[cmpSel].textContent}</span>`);fb('fbCmp','¡Correcto! +5 XP',true);if(!xpTracker.cmp.has(cmpIdx)){xpTracker.cmp.add(cmpIdx);pts(5);}sfx('ok');}else{opts[cmpSel].classList.add('wrong');opts[cmpData[cmpIdx].c].classList.add('correct');fb('fbCmp','Incorrecto. Revisa bien la respuesta.',false);sfx('no');}setTimeout(()=>{cmpIdx++;document.getElementById('fbCmp').classList.remove('show');showCmp();},1600);}

// ===================== WIDGETS =====================
// Widget 1: el ciclo de diseño aplicado a proyectos reales (ordenar los pasos)
let routeSets=[
  {label:'El robot regador del huerto escolar',steps:['Identificamos el problema: la huerta se seca los fines de semana','Ideamos varias soluciones y escogemos la más realista','Diseñamos el boceto: sensor de humedad, bomba y programa','Construimos el prototipo con botellas y material reciclado','Probamos tres veces y anotamos que el agua no se cierra','Mejoramos el programa y presentamos el proyecto a la clase']},
  {label:'La alarma del río en invierno',steps:['Identificamos el problema: nadie sabe si el vado es seguro','Ideamos ideas: una regla pintada, una boya, una alarma','Diseñamos el boceto: sensor de nivel, bocina y batería','Construimos el prototipo y lo colocamos junto al vado','Probamos con agua y vemos que la bocina suena muy tarde','Mejoramos la altura del sensor y avisamos a la comunidad']},
  {label:'El clasificador de basura del centro educativo',steps:['Identificamos el problema: el plástico y el papel se mezclan','Ideamos soluciones y comparamos costo y tiempo','Diseñamos el boceto: sensor de peso, banda y motor','Construimos la banda con cartón, una polea y un motor','Probamos con 20 envases y dos se van al depósito equivocado','Mejoramos la banda, repetimos la prueba y presentamos los datos']}
];
let currentRouteIdx=0,routeItems=[];
function buildRoute(){routeItems=_shuffle([...routeSets[currentRouteIdx].steps]);renderRoute();const fbEl=document.getElementById('fbRoute');if(fbEl)fbEl.classList.remove('show');}
function renderRoute(){const list=document.getElementById('routeList');if(!list)return;list.innerHTML='';routeItems.forEach((step,i)=>{const div=document.createElement('div');div.className='sort-item';div.innerHTML=`<div class="sort-arrows"><button class="sort-arrow" onclick="routeMove(${i},-1)"${i===0?' disabled':''}>▲</button><button class="sort-arrow" onclick="routeMove(${i},1)"${i===routeItems.length-1?' disabled':''}>▼</button></div><div class="sort-step-num">${i+1}.</div><div class="sort-item-txt">${step}</div>`;list.appendChild(div);});}
function routeMove(idx,dir){sfx('click');const ni=idx+dir;if(ni<0||ni>=routeItems.length)return;[routeItems[idx],routeItems[ni]]=[routeItems[ni],routeItems[idx]];renderRoute();}
function checkRoute(){const correct=routeSets[currentRouteIdx].steps;const isOk=routeItems.every((s,i)=>s===correct[i]);if(isOk){fb('fbRoute','¡Perfecto! Orden correcto. +4 XP',true);if(!xpTracker.wgt.has('route_'+currentRouteIdx)){xpTracker.wgt.add('route_'+currentRouteIdx);pts(4);}sfx('fan');fin('s-widgets');unlockAchievement('widgets_master');}else{fb('fbRoute','Hay pasos fuera de orden. Recuerda: identificar → idear → diseñar → construir → probar → mejorar → comunicar.',false);sfx('no');}}
function nextRoute(){sfx('click');currentRouteIdx=(currentRouteIdx+1)%routeSets.length;buildRoute();showToast('🔄 Caso: '+routeSets[currentRouteIdx].label);}

// Widget 2: ¿qué decisión de diseño conviene?
let neuronPartes=[
  {desc:'El robot debe avisar cuando el agua del río empiece a subir',ans:'Sensor de nivel de agua',opts:['Sensor de nivel de agua','Sensor de sonido','Sensor de color']},
  {desc:'El regador del huerto debe saber cuándo la tierra está seca',ans:'Sensor de humedad',opts:['Sensor de humedad','Sensor de peso','Sensor de sonido']},
  {desc:'El clasificador necesita mover los envases hasta el depósito',ans:'Banda con motor',opts:['Banda con motor','Bocina','Batería extra']},
  {desc:'El techo del patio de secado del café debe cerrarse al llover',ans:'Motor con polea',opts:['Motor con polea','Sensor de tacto','Foco LED']},
  {desc:'El proyecto se instala en el vado, donde no hay tomacorriente',ans:'Batería con panel solar',opts:['Batería con panel solar','Cable de la casa más cercana','Una vela']},
  {desc:'Hay que escribir la orden principal del robot regador',ans:'Si la tierra está seca, entonces abre el agua',opts:['Si la tierra está seca, entonces abre el agua','Riega siempre sin parar','Espera a que alguien lo encienda']},
  {desc:'El equipo solo tiene tres semanas y material reciclado',ans:'Un prototipo sencillo y barato',opts:['Un prototipo sencillo y barato','Un robot de metal importado','Nada, mejor no hacerlo']},
  {desc:'El robot de la alerta debe usarse cerca de los niños',ans:'Cables aislados y voltaje bajo',opts:['Cables aislados y voltaje bajo','Cables pelados a la vista','Corriente de la red eléctrica']}
];
let neuronIdx=0,neuronDone=false;
function showNeuron(){neuronDone=false;if(neuronIdx>=neuronPartes.length){const el=document.getElementById('neuronDesc');if(el)el.textContent='🎉 ¡Tomas decisiones de diseño como todo un ingeniero!';const opts=document.getElementById('neuronOpts');if(opts)opts.innerHTML='';fin('s-widgets');return;}const d=neuronPartes[neuronIdx];const prog=document.getElementById('neuronProg');if(prog)prog.textContent=`Pista ${neuronIdx+1} de ${neuronPartes.length}`;const desc=document.getElementById('neuronDesc');if(desc)desc.textContent=d.desc;const opts=document.getElementById('neuronOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=opt;b.onclick=()=>checkNeuron(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuron');if(fbEl)fbEl.classList.remove('show');}
function checkNeuron(opt,btn,d){if(neuronDone)return;neuronDone=true;document.querySelectorAll('#neuronOpts .cmp-opt').forEach(b=>{if(b.textContent===d.ans)b.classList.add('correct');else if(b===btn&&b.textContent!==d.ans)b.classList.add('wrong');});const isOk=opt===d.ans;if(isOk){fb('fbNeuron','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuron_'+neuronIdx)){xpTracker.wgt.add('neuron_'+neuronIdx);pts(3);}sfx('ok');}else{fb('fbNeuron','La respuesta correcta es: '+d.ans,false);sfx('no');}}
function nextNeuron(){sfx('click');neuronIdx++;showNeuron();}
function resetNeuron(){sfx('click');neuronIdx=0;showNeuron();}

// Widget 3: Etapa del ciclo → ¿qué se hace?
let neuroPairs=[
  {trans:'Identificar',func:'Decir qué falla, a quién afecta y por qué importa',opts:['Decir qué falla, a quién afecta y por qué importa','Armar el prototipo con cartón','Presentar el proyecto a la clase']},
  {trans:'Idear',func:'Anotar muchas soluciones posibles y escoger la mejor',opts:['Anotar muchas soluciones posibles y escoger la mejor','Medir cuántas veces falla','Repartir el diploma']},
  {trans:'Diseñar',func:'Bocetar qué sensor, qué mecanismo, qué energía y qué programa lleva',opts:['Bocetar qué sensor, qué mecanismo, qué energía y qué programa lleva','Pintar la caja de colores','Contar el dinero recaudado']},
  {trans:'Probar',func:'Ensayar varias veces y anotar qué falla y qué funciona',opts:['Ensayar varias veces y anotar qué falla y qué funciona','Guardar el robot en la caja','Dibujar el logotipo']},
  {trans:'Comunicar',func:'Presentar el problema, el diseño, la prueba y la mejora',opts:['Presentar el problema, el diseño, la prueba y la mejora','Comprar más materiales','Borrar los apuntes del equipo']}
];
let neuroIdx=0,neuroDone=false;
function showNeuro(){neuroDone=false;if(neuroIdx>=neuroPairs.length){const el=document.getElementById('neuroTrans');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('neuroOpts');if(opts)opts.innerHTML='';return;}const d=neuroPairs[neuroIdx];const prog=document.getElementById('neuroProg');if(prog)prog.textContent=`${neuroIdx+1} de ${neuroPairs.length}`;const trans=document.getElementById('neuroTrans');if(trans)trans.textContent=d.trans;const opts=document.getElementById('neuroOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkNeuro(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuro');if(fbEl)fbEl.classList.remove('show');}
function checkNeuro(opt,btn,d){if(neuroDone)return;neuroDone=true;document.querySelectorAll('#neuroOpts .qz-opt').forEach(b=>{if(b.textContent===d.func)b.classList.add('correct');else if(b===btn&&b.textContent!==d.func)b.classList.add('wrong');});const isOk=opt===d.func;if(isOk){fb('fbNeuro','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuro_'+neuroIdx)){xpTracker.wgt.add('neuro_'+neuroIdx);pts(3);}sfx('ok');}else{fb('fbNeuro','Correcto: '+d.func,false);sfx('no');}setTimeout(()=>{neuroIdx++;showNeuro();},1800);}
function resetNeuro(){sfx('click');neuroIdx=0;showNeuro();}

// Widget 4: ¿ayuda a las personas o hay que pensarlo mejor?
let enfermedadData=[
  {disease:'Un robot que avisa a la comunidad cuando el río empieza a crecer',characteristic:'Ayuda a las personas',opts:['Ayuda a las personas','Hay que pensarlo mejor']},
  {disease:'Un robot que deja sin trabajo a los recolectores y nadie les avisó',characteristic:'Hay que pensarlo mejor',opts:['Hay que pensarlo mejor','Ayuda a las personas']},
  {disease:'Un regador que ahorra agua y cuida la huerta escolar',characteristic:'Ayuda a las personas',opts:['Ayuda a las personas','Hay que pensarlo mejor']},
  {disease:'Un prototipo con cables pelados al alcance de los niños',characteristic:'Hay que pensarlo mejor',opts:['Hay que pensarlo mejor','Ayuda a las personas']},
  {disease:'Un brazo que carga los sacos de café y evita lesiones de espalda',characteristic:'Ayuda a las personas',opts:['Ayuda a las personas','Hay que pensarlo mejor']},
  {disease:'Un robot que tira la basura al río para no pagar el camión',characteristic:'Hay que pensarlo mejor',opts:['Hay que pensarlo mejor','Ayuda a las personas']}
];
let enferIdx=0,enferDone=false;
function showEnfer(){enferDone=false;if(enferIdx>=enfermedadData.length){const el=document.getElementById('enferDisease');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('enferOpts');if(opts)opts.innerHTML='';return;}const d=enfermedadData[enferIdx];const prog=document.getElementById('enferProg');if(prog)prog.textContent=`${enferIdx+1} de ${enfermedadData.length}`;const dis=document.getElementById('enferDisease');if(dis)dis.textContent=d.disease;const opts=document.getElementById('enferOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkEnfer(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbEnfer');if(fbEl)fbEl.classList.remove('show');}
function checkEnfer(opt,btn,d){if(enferDone)return;enferDone=true;document.querySelectorAll('#enferOpts .qz-opt').forEach(b=>{if(b.textContent===d.characteristic)b.classList.add('correct');else if(b===btn&&b.textContent!==d.characteristic)b.classList.add('wrong');});const isOk=opt===d.characteristic;if(isOk){fb('fbEnfer','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('enfer_'+enferIdx)){xpTracker.wgt.add('enfer_'+enferIdx);pts(3);}sfx('ok');}else{fb('fbEnfer','Correcto: '+d.characteristic+'. Pregúntate siempre: ¿a quién beneficia?, ¿a quién podría afectar?, ¿es seguro?',false);sfx('no');}setTimeout(()=>{enferIdx++;showEnfer();},1800);}
function resetEnfer(){sfx('click');enferIdx=0;showEnfer();}

// ===================== RETO FINAL =====================
let retoPairs=[
  {label:['Problema','Solución'],btnA:'❓ Problema',btnB:'💡 Solución',colA:'pro',colB:'sol',
   words:[{w:'La huerta se seca',t:'pro'},{w:'Regador automático',t:'sol'},{w:'El río crece de noche',t:'pro'},{w:'Alarma de nivel',t:'sol'},{w:'La basura se mezcla',t:'pro'},{w:'Banda clasificadora',t:'sol'},{w:'El café se moja',t:'pro'},{w:'Techo que se cierra',t:'sol'},{w:'Nadie ve el vado',t:'pro'},{w:'Luz con sensor',t:'sol'}]},
  {label:['Criterio','Restricción'],btnA:'🎯 Criterio',btnB:'⛔ Restricción',colA:'cri',colB:'res',
   words:[{w:'Debe avisar a tiempo',t:'cri'},{w:'Solo 200 lempiras',t:'res'},{w:'Debe regar toda la huerta',t:'cri'},{w:'Solo material reciclado',t:'res'},{w:'Debe separar el plástico',t:'cri'},{w:'Tres semanas de plazo',t:'res'},{w:'Debe verse de lejos',t:'cri'},{w:'Sin cables pelados',t:'res'},{w:'Debe funcionar de noche',t:'cri'},{w:'Sin tomacorriente cerca',t:'res'}]},
  {label:['Diseñar','Probar'],btnA:'✏️ Diseñar',btnB:'🧪 Probar',colA:'dis',colB:'pru',
   words:[{w:'Dibujar el boceto',t:'dis'},{w:'Anotar qué falló',t:'pru'},{w:'Escoger el sensor',t:'dis'},{w:'Repetir el ensayo',t:'pru'},{w:'Escribir el programa',t:'dis'},{w:'Medir el tiempo de aviso',t:'pru'},{w:'Elegir la energía',t:'dis'},{w:'Contar los aciertos',t:'pru'},{w:'Listar los materiales',t:'dis'},{w:'Comparar con el criterio',t:'pru'}]}
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
  {s:'El equipo escribe qué falla y a quién afecta.',type:'Identificar el problema'},
  {s:'Los alumnos anotan diez soluciones posibles sin juzgarlas.',type:'Idear'},
  {s:'Se dibuja el robot con sus sensores y motores rotulados.',type:'Diseñar (boceto)'},
  {s:'Arman la primera versión del robot con material reciclado.',type:'Construir el prototipo'},
  {s:'Ensayan tres veces y anotan cuántas veces avisó a tiempo.',type:'Probar'},
  {s:'Cambian la altura del sensor y repiten el ensayo.',type:'Mejorar'},
  {s:'Presentan el proyecto en dos minutos ante la clase.',type:'Comunicar'},
  {s:'El robot no debe costar más de doscientos lempiras.',type:'Restricción'},
  {s:'El robot debe avisar antes de que el agua llegue al vado.',type:'Criterio'},
  {s:'El equipo se pregunta a quién beneficia y a quién podría afectar.',type:'Ética del diseño'}
];
let classifyTaskDB=[
  {w:'Robot de la cosecha de café',gen:'El café tendido se moja cuando llueve de repente',n:'Sensor de lluvia o de humedad',g:'Motor con polea que cierra el techo',t:'Poco dinero y solo material reciclado'},
  {w:'Alerta del vado del río',gen:'En invierno nadie sabe si es seguro cruzar',n:'Sensor de nivel de agua',g:'Bocina y luz de alarma',t:'No hay tomacorriente: debe usar batería'},
  {w:'Regador del huerto escolar',gen:'La huerta se seca los fines de semana',n:'Sensor de humedad de la tierra',g:'Bomba o válvula de agua',t:'Debe ahorrar agua y ser seguro'},
  {w:'Alerta de inundaciones del barrio',gen:'El agua entra a las casas de noche sin aviso',n:'Sensor de nivel y sensor de lluvia',g:'Sirena y luz intermitente',t:'Debe oírse a cien metros y aguantar la lluvia'},
  {w:'Clasificador de basura del centro',gen:'El plástico y el papel se mezclan en el patio',n:'Sensor de peso o de color',g:'Banda con motor y compuerta',t:'Tres semanas de plazo y cartón reciclado'},
  {w:'Robot guía del comedor escolar',gen:'Los más pequeños no encuentran su mesa',n:'Sensor de distancia',g:'Ruedas con motor y bocina',t:'No debe estorbar el paso ni tener cables sueltos'},
  {w:'Espantapájaros robótico de la milpa',gen:'Los pájaros se comen el maíz recién sembrado',n:'Sensor de movimiento',g:'Brazo giratorio y bocina',t:'Debe funcionar todo el día con energía solar'},
  {w:'Aviso de humo en la cocina escolar',gen:'Nadie se da cuenta cuando la leña humea de más',n:'Sensor de humo',g:'Alarma sonora y luz',t:'Debe ser barato y no asustar a los niños'}
];
let completeTaskDB=[
  {s:'El ciclo de diseño empieza al ___ el problema.',opts:['identificar','pintar','guardar'],ans:'identificar'},
  {s:'En la etapa de idear anotamos muchas ___.',opts:['ideas','faltas','notas'],ans:'ideas'},
  {s:'El dibujo rotulado del robot se llama ___.',opts:['boceto','recibo','cartel'],ans:'boceto'},
  {s:'La primera versión que se puede probar es el ___.',opts:['prototipo','diploma','manual'],ans:'prototipo'},
  {s:'Al probar hay que ___ lo que falla.',opts:['anotar','esconder','olvidar'],ans:'anotar'},
  {s:'Si el prototipo falla, hay que ___ y volver a probar.',opts:['mejorar','rendirse','copiar'],ans:'mejorar'},
  {s:'El dinero disponible es una ___ del proyecto.',opts:['restricción','idea','prueba'],ans:'restricción'},
  {s:'La última etapa del ciclo es ___ el resultado.',opts:['comunicar','borrar','esconder'],ans:'comunicar'}
];
let explainQuestions=[
  {q:'Explica con tus palabras las 7 etapas del ciclo de diseño y pon un ejemplo de cada una con un robot de tu comunidad.',ans:'Identificar (decir qué falla y a quién afecta), idear (muchas soluciones), diseñar (boceto con sensores, mecanismos, energía y programa), construir el prototipo, probar y anotar los fallos, mejorar y volver a probar, y comunicar el resultado.'},
  {q:'Escoge un problema de tu aldea o barrio y escribe su ficha de proyecto: problema, idea, diseño, prueba y mejora.',ans:'Respuesta libre. Debe verse el problema con las personas afectadas, una idea escogida entre varias, un diseño con sensor y actuador justificados, una prueba con datos y una mejora concreta.'},
  {q:'¿Cuál es la diferencia entre un criterio y una restricción? Da dos ejemplos de cada uno para el robot regador del huerto.',ans:'El criterio es lo que debe lograr (regar toda la huerta, ahorrar agua); la restricción es el límite (200 lempiras, tres semanas, material reciclado, sin cables pelados).'},
  {q:'Tu prototipo falló en la prueba. Explica por qué eso NO es un fracaso y qué harías después.',ans:'Fallar da información: se anota qué falló, se cambia una sola cosa a la vez, se vuelve a probar y se compara con el criterio. Así trabajan los ingenieros.'},
  {q:'Escribe quiénes se benefician y quiénes podrían verse afectados por el robot que diseñaste, y cómo lo harías seguro.',ans:'Respuesta libre. Debe nombrar personas concretas de la comunidad, reconocer a quién podría perjudicar y proponer medidas de seguridad (voltaje bajo, cables aislados, partes sin filo, aviso a los usuarios).'}
];
let ansVisible=false;
function genTask(){sfx('click');const type=document.getElementById('tgType').value;const count=parseInt(document.getElementById('tgCount').value);ansVisible=false;const out=document.getElementById('tgOut');out.innerHTML='';if(type==='identify')genIdentifyTask(out,count);else if(type==='classify')genClassifyTask(out,count);else if(type==='complete')genCompleteTask(out,count);else if(type==='explain')genExplainTask(out,count);fin('s-tareas');}
function _instrBlock(out,title,lines){const ib=document.createElement('div');ib.className='tg-instruction-block';ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join('');out.appendChild(ib);}
function genIdentifyTask(out,count){_instrBlock(out,'Instrucción',['Copia en tu cuaderno; subraya, colorea o encierra el concepto de robótica indicado en cada oración. Escribe al lado qué parte o tipo de robot es.','<strong>Ejemplo:</strong> Los sensores captan luz y distancia. → <span style="color:var(--jade);font-weight:700;">Sensores</span>']);_pick(identifyTaskDB,Math.min(count,identifyTaskDB.length)).forEach((item,i)=>{const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.type}</div></div>`;out.appendChild(div);});}
function genClassifyTask(out,count){_instrBlock(out,'Instrucción',['Copia la siguiente tabla en tu cuaderno. Para cada proyecto responde: ¿qué problema resuelve?, ¿qué sensor lleva?, ¿qué actuador lleva? y ¿qué restricción tiene? Explica con tus palabras.']);const items=_pick(classifyTaskDB,Math.min(count,classifyTaskDB.length));const wrap=document.createElement('div');wrap.style.overflowX='auto';const th=(t,extra='')=>`<th style="padding:0.3rem 0.4rem;border:1px solid var(--border);font-size:0.72rem;text-align:center;${extra}">${t}</th>`;let html=`<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:520px;"><thead><tr style="background:var(--pri-gl);">${th('Proyecto','text-align:left;')}${th('¿Qué problema resuelve?')}${th('¿Qué sensor?')}${th('¿Qué actuador?')}${th('¿Qué restricción?')}</tr></thead><tbody>`;items.forEach(it=>{html+=`<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td>`+Array(4).fill(`<td style="padding:0.4rem;border:1px solid var(--border);min-width:50px;"></td>`).join('')+'</tr>';});html+='</tbody></table>';wrap.innerHTML=html;out.appendChild(wrap);const ans=document.createElement('div');ans.className='tg-answer';ans.style.marginTop='0.8rem';ans.innerHTML='<strong>✅ Respuestas:</strong><br>'+items.map(it=>`<strong>${it.w}:</strong> Problema: ${it.gen} | Sensor: ${it.n} | Actuador: ${it.g} | Restricción: ${it.t}`).join('<br>');out.appendChild(ans);}
function genCompleteTask(out,count){_instrBlock(out,'Instrucción',['Copia y resuelve en tu cuaderno. Cada oración tiene un espacio ___. Elige y escribe la opción correcta.']);const pool=_shuffle([...completeTaskDB]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';const sent=item.s.replace('___','<span class="tg-blank" style="min-width:90px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${sent}</strong><div style="margin-top:0.4rem;font-size:0.82rem;color:var(--gray);">📝 Opciones: <strong>${item.opts.join(' | ')}</strong></div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function genExplainTask(out,count){_instrBlock(out,'Instrucción',['Copia las siguientes preguntas en tu cuaderno y responde cada una de forma clara y completa. Puedes acompañarlas con dibujos.']);const pool=_shuffle([...explainQuestions]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.3rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function toggleAns(){ansVisible=!ansVisible;document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none');sfx('click');}

// ===================== SOPA DE LETRAS =====================
let sopaSets=[
  {size:10,grid:[
    ['X','P','R','O','T','O','T','I','P','O'],
    ['G','J','P','R','O','B','L','E','M','A'],
    ['S','G','Y','O','E','P','I','I','U','G'],
    ['Z','J','H','F','J','R','C','Q','N','J'],
    ['G','H','M','E','J','O','R','A','R','T'],
    ['I','N','F','O','Q','B','W','R','K','U'],
    ['J','F','X','A','Q','A','Z','W','P','D'],
    ['Z','U','R','T','C','R','A','E','E','D'],
    ['D','R','A','C','I','N','U','M','O','C'],
    ['H','R','A','E','D','I','W','L','L','I']
  ],words:[
    {w:'PROBLEMA',cells:[[1,2],[1,3],[1,4],[1,5],[1,6],[1,7],[1,8],[1,9]]},
    {w:'PROTOTIPO',cells:[[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[0,9]]},
    {w:'COMUNICAR',cells:[[8,9],[8,8],[8,7],[8,6],[8,5],[8,4],[8,3],[8,2],[8,1]]},
    {w:'MEJORAR',cells:[[4,2],[4,3],[4,4],[4,5],[4,6],[4,7],[4,8]]},
    {w:'PROBAR',cells:[[2,5],[3,5],[4,5],[5,5],[6,5],[7,5]]},
    {w:'IDEAR',cells:[[9,5],[9,4],[9,3],[9,2],[9,1]]}
  ]},
  {size:10,grid:[
    ['X','I','V','M','W','O','F','Z','C','G'],
    ['S','M','X','K','J','C','O','S','T','O'],
    ['O','T','E','C','O','B','B','Y','E','A'],
    ['L','D','A','G','K','Q','E','N','V','C'],
    ['U','X','B','G','V','E','W','W','K','I'],
    ['C','D','A','T','E','U','Q','A','M','T'],
    ['I','B','R','C','Z','O','H','D','Q','E'],
    ['O','O','M','J','Y','S','T','K','D','V'],
    ['N','R','O','A','S','Q','R','C','V','Q'],
    ['T','J','E','Q','U','I','P','O','I','S']
  ],words:[
    {w:'SOLUCION',cells:[[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0]]},
    {w:'MAQUETA',cells:[[5,8],[5,7],[5,6],[5,5],[5,4],[5,3],[5,2]]},
    {w:'BOCETO',cells:[[2,5],[2,4],[2,3],[2,2],[2,1],[2,0]]},
    {w:'EQUIPO',cells:[[9,2],[9,3],[9,4],[9,5],[9,6],[9,7]]},
    {w:'COSTO',cells:[[1,5],[1,6],[1,7],[1,8],[1,9]]},
    {w:'ETICA',cells:[[6,9],[5,9],[4,9],[3,9],[2,9]]}
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
  {q:'El ciclo de diseño empieza por identificar el problema.',a:true},
  {q:'Lo primero que hace un buen equipo es construir el robot.',a:false},
  {q:'En la etapa de idear conviene anotar muchas soluciones.',a:true},
  {q:'El boceto indica qué sensor, qué mecanismo y qué programa lleva el robot.',a:true},
  {q:'El prototipo es la versión final que ya no se cambia.',a:false},
  {q:'Al probar hay que anotar lo que falla.',a:true},
  {q:'Si el prototipo falla, el equipo debe abandonar el proyecto.',a:false},
  {q:'Mejorar significa corregir lo que falló y volver a probar.',a:true},
  {q:'El costo y el tiempo son restricciones del proyecto.',a:true},
  {q:'Un criterio es lo que el robot debe lograr para tener éxito.',a:true},
  {q:'La seguridad de quien usa el robot no es asunto del equipo.',a:false},
  {q:'Comunicar el resultado es la última etapa del ciclo.',a:true},
  {q:'Un buen robot es el que resuelve un problema real de su comunidad.',a:true},
  {q:'Los robots deben reemplazar a las personas sin avisarles.',a:false},
  {q:'En el equipo hay roles: diseñador, programador, constructor y probador.',a:true}
];
let evalMCBank=[
  {q:'¿Cuál es la primera etapa del ciclo de diseño?',o:['a) Construir','b) Identificar el problema','c) Comunicar','d) Probar'],a:1},
  {q:'¿Qué se hace en la etapa de idear?',o:['a) Pintar el robot','b) Anotar muchas soluciones posibles','c) Calificar al equipo','d) Guardar los materiales'],a:1},
  {q:'¿Qué contiene un buen boceto de diseño?',o:['a) Solo el nombre del robot','b) Sensores, mecanismos, energía y programa','c) La lista de asistencia','d) El precio de venta'],a:1},
  {q:'¿Qué es un prototipo?',o:['a) La primera versión que se puede probar','b) Un dibujo sin partes','c) El diploma del equipo','d) Un robot de fábrica'],a:0},
  {q:'Durante la prueba, ¿qué debe hacer el equipo?',o:['a) Esconder los fallos','b) Anotar qué falla y qué funciona','c) Cambiar de proyecto','d) Repartir premios'],a:1},
  {q:'El prototipo falló tres veces. ¿Qué corresponde hacer?',o:['a) Rendirse','b) Mejorar el diseño y volver a probar','c) Decir que funcionó','d) Copiar a otro equipo'],a:1},
  {q:'«No debe costar más de 200 lempiras» es un ejemplo de…',o:['a) Criterio','b) Restricción','c) Boceto','d) Prototipo'],a:1},
  {q:'«Debe avisar antes de que el agua llegue al vado» es un ejemplo de…',o:['a) Criterio de éxito','b) Restricción de tiempo','c) Rol del equipo','d) Material'],a:0},
  {q:'¿Qué sensor conviene al robot que alerta de inundaciones?',o:['a) De color','b) De sonido','c) De nivel de agua','d) De tacto'],a:2},
  {q:'¿Qué actuador necesita el regador del huerto escolar?',o:['a) Una cámara','b) Una bomba o válvula de agua','c) Un sensor de humedad','d) Una batería'],a:1},
  {q:'¿Qué instrucción es correcta para el robot regador?',o:['a) Riega siempre sin parar','b) Si la tierra está seca, entonces abre el agua','c) Espera a que llueva','d) Apaga la alarma'],a:1},
  {q:'El proyecto se instala en el vado y no hay tomacorriente. ¿Qué energía conviene?',o:['a) Batería con panel solar','b) Un cable de un kilómetro','c) Una vela','d) Ninguna'],a:0},
  {q:'¿Cuál es la última etapa del ciclo de diseño?',o:['a) Probar','b) Idear','c) Comunicar el resultado','d) Construir'],a:2},
  {q:'¿Cuál es una pregunta ética del diseño?',o:['a) ¿A quién beneficia y a quién podría afectar?','b) ¿De qué color lo pinto?','c) ¿Cuántos tornillos lleva?','d) ¿Quién dibuja mejor?'],a:0},
  {q:'¿Qué rol del equipo se encarga de ensayar el robot y anotar los fallos?',o:['a) El diseñador','b) El programador','c) El constructor','d) El probador'],a:3}
];
let evalCPBank=[
  {q:'El ciclo de diseño empieza al ___ el problema.',a:'identificar'},
  {q:'En la etapa de ___ se anotan muchas soluciones posibles.',a:'idear'},
  {q:'El dibujo rotulado del robot se llama ___.',a:'boceto'},
  {q:'La primera versión que se puede probar es el ___.',a:'prototipo'},
  {q:'Al ___ el prototipo se anota qué falla y qué funciona.',a:'probar'},
  {q:'Si el prototipo falla, hay que ___ el diseño y volver a probar.',a:'mejorar'},
  {q:'La última etapa del ciclo de diseño es ___ el resultado.',a:'comunicar'},
  {q:'El dinero disponible es una ___ del proyecto.',a:'restricción'},
  {q:'Lo que el robot debe lograr para tener éxito es el ___.',a:'criterio'},
  {q:'El robot regador necesita un sensor de ___ para medir la tierra.',a:'humedad'},
  {q:'El robot que alerta de inundaciones mide el ___ del agua.',a:'nivel'},
  {q:'El miembro del equipo que ensaya el robot y anota los fallos es el ___.',a:'probador'},
  {q:'Pensar a quién beneficia y a quién afecta el robot es parte de la ___.',a:'ética'},
  {q:'Una maqueta de material ___ permite construir un prototipo barato.',a:'reciclado'},
  {q:'La presentación final dura dos ___ ante la clase.',a:'minutos'}
];
let evalPRBank=[
  {term:'Ciclo de diseño',def:'Los 7 pasos que siguen los ingenieros para resolver un problema'},
  {term:'Identificar',def:'Decir qué falla, a quién afecta y por qué importa'},
  {term:'Idear',def:'Anotar muchas soluciones posibles antes de escoger'},
  {term:'Diseñar',def:'Bocetar sensores, mecanismos, energía y programa'},
  {term:'Prototipo',def:'Primera versión del robot, hecha para poder probarla'},
  {term:'Probar',def:'Ensayar varias veces y anotar los fallos'},
  {term:'Mejorar',def:'Corregir lo que falló y volver a probar'},
  {term:'Comunicar',def:'Presentar el proyecto al público con claridad'},
  {term:'Criterio',def:'Lo que el robot debe lograr para tener éxito'},
  {term:'Restricción',def:'Límite de costo, materiales, tiempo o seguridad'},
  {term:'Boceto',def:'Dibujo rápido con las partes del robot rotuladas'},
  {term:'Maqueta',def:'Modelo del robot armado con material reciclado'},
  {term:'Ética del diseño',def:'Pensar a quién beneficia y a quién podría afectar'},
  {term:'Probador',def:'Rol del equipo que ensaya y anota lo que falla'},
  {term:'Rúbrica',def:'Tabla con los criterios con que se califica el proyecto'}
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

function genEval(){sfx('click');_evalFormaSelector(); const _selF = document.getElementById('evalFormaSel'); if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10))); const cf = evalFormNum; const rng = _evalRng(100000 + cf); window._currentEvalForm=cf;evalFormNum = (evalFormNum % EVAL_FORMAS) + 1; _evalFormaSelector();saveProgress();document.getElementById('eval-screen-title').textContent=`🎓 Evaluación Final · Forma ${cf} · Robots que Resuelven Problemas`;evalAnsVisible=false;const out=document.getElementById('evalOut');out.innerHTML='';const bar=document.createElement('div');bar.className='eval-score-bar';bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje · 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25 pts</span><span class="eval-score-pill esp-tf">V/F 25 pts</span><span class="eval-score-pill esp-mc">Selección 25 pts</span><span class="eval-score-pill esp-pr">Pareados 25 pts</span></div>`;out.appendChild(bar);const cpItems=_pickF(evalCPBank,5, rng);const s1=document.createElement('div');s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';cpItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='cp';d.dataset.evalIndex=i;const qHtml=item.q.replace('___',`<input class="eval-cp-input" type="text" data-cp="${i}" autocomplete="off">`);d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbCp${i}" aria-live="polite"></div>`;s1.appendChild(d);});out.appendChild(s1);const tfItems=_pickF(evalTFBank,5, rng);const s2=document.createElement('div');s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';tfItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='tf';d.dataset.evalIndex=i;d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="true"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="false"> Falso</label></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbTf${i}" aria-live="polite"></div>`;s2.appendChild(d);});out.appendChild(s2);const mcItems=_pickF(evalMCBank,5, rng);const s3=document.createElement('div');s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';mcItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='mc';d.dataset.evalIndex=i;const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join('');d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbMc${i}" aria-live="polite"></div>`;s3.appendChild(d);});out.appendChild(s3);const prItems=_pickF(evalPRBank,5, rng);let shuffledDefs=_shuffleF(prItems, rng);let _prTries=0;while(shuffledDefs.some((df,ix)=>df.def===prItems[ix].def)&&_prTries<20){shuffledDefs=_shuffleF(shuffledDefs, rng);_prTries++;}const letters=['A','B','C','D','E'];const s4=document.createElement('div');s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';const matchCard=document.createElement('div');matchCard.className='eval-item';let colLeft='<div class="eval-match-col"><h4>📌 Términos</h4>';prItems.forEach((item,i)=>{colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> <select class="eval-match-select" data-pr="${i}" aria-label="Respuesta pareada ${i+16}"><option value="">—</option>${letters.map(l=>`<option value="${l}">${l}</option>`).join('')}</select> ${item.term}</div>`;});colLeft+='</div>';let colRight='<div class="eval-match-col"><h4>🔑 Definiciones</h4>';shuffledDefs.forEach((item,i)=>{colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`;});colRight+='</div>';const ansKey=prItems.map((item,i)=>{const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)];return`${i+16}→${letter}`;}).join(' · ');matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div><div class="eval-item-feedback" id="evalFbPr" aria-live="polite"></div>`;s4.appendChild(matchCard);out.appendChild(s4);window._evalPrintData={tf:tfItems,mc:mcItems,cp:cpItems,pr:{terms:prItems,shuffledDefs,letters}};const autoPanel=document.createElement('div');autoPanel.id='evalAutoResult';autoPanel.className='eval-auto-result';autoPanel.innerHTML='<strong>🧮 Evaluación interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato original sin respuestas digitadas.';out.appendChild(autoPanel);fin('s-evaluacion');}
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación Robots que Resuelven Problemas · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.12rem 0.4rem;margin:0.22rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #0e7490;background:#ecfeff;color:#0e7490;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#0e7490;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #0e7490;height:12px;}.obt-pct{white-space:nowrap;}.qn{font-weight:700;min-width:22px;flex-shrink:0;}.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:40px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.18rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.14rem 0.35rem;margin-bottom:0.1rem;break-inside:avoid;page-break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.3;display:flex;gap:0.28rem;margin-bottom:0.07rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.1rem 0.5rem;}.mc-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:0.04rem 0.15rem;margin-left:0.8rem;}.mc-opt{font-size:9pt;display:flex;align-items:center;gap:0.15rem;}.mc-opt input{width:10px;height:10px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{margin-top:0.1rem;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.08rem 0.4rem;margin-top:0.08rem;}.pr-head{font-size:9pt;font-weight:700;color:#555;margin-bottom:0.1rem;}.pr-item{font-size:10.5pt;padding:0.1rem 0.28rem;background:#ecfeff;border-radius:3px;margin-bottom:0.07rem;display:flex;align-items:center;gap:0.2rem;line-height:1.2;break-inside:avoid;page-break-inside:avoid;}.pr-num{font-weight:700;color:#0e7490;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.22rem;padding:0.15rem 0;page-break-before:avoid;break-before:avoid;color:#0e7490;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #0e7490;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#555;}.pa{color:#007a00;font-weight:600;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Robótica · Evaluación Conceptual · Robots que Resuelven Problemas · Educación Básica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Robótica · Robots que Resuelven Problemas · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u</div></div><div class="p-grid">${pR}</div>
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
let critCasoBank=[
  {txt:'En la aldea, el café tendido en el patio se moja cuando llueve de repente y la cosecha se pierde.',ans:'Problema: la lluvia repentina daña el café tendido y afecta a las familias cafetaleras. Sensor: de lluvia o de humedad. Actuador: motor con polea que cierra el techo corredizo. Programa: si detecta lluvia, entonces cierra el techo.'},
  {txt:'En invierno el río crece y los niños no saben si es seguro cruzar el vado para llegar a la escuela.',ans:'Problema: nadie sabe si el vado es seguro y hay riesgo de accidente. Sensor: de nivel de agua. Actuador: bocina y luz roja de alarma. Programa: si el nivel pasa la marca, entonces enciende la alarma.'},
  {txt:'La huerta escolar se seca los fines de semana porque nadie llega a regarla.',ans:'Problema: sin riego el fin de semana se pierden las plantas del huerto. Sensor: de humedad de la tierra. Actuador: bomba o válvula de agua. Programa: si la tierra está seca, entonces abre el agua hasta que se humedezca.'},
  {txt:'En el barrio el agua entra a las casas de noche y nadie alcanza a sacar sus cosas.',ans:'Problema: la inundación nocturna sorprende a las familias. Sensor: de nivel de agua y de lluvia. Actuador: sirena y luz intermitente. Programa: si el agua sube de la marca, entonces suena la sirena y enciende la luz.'},
  {txt:'En el centro educativo el plástico y el papel se mezclan en el mismo depósito.',ans:'Problema: la basura mezclada no se puede reciclar. Sensor: de peso o de color. Actuador: banda con motor y compuerta que desvía. Programa: si el envase es liviano, entonces desvía al depósito del plástico.'},
  {txt:'Los pájaros se comen el maíz recién sembrado de la milpa cuando nadie está cuidando.',ans:'Problema: se pierde la siembra por falta de vigilancia. Sensor: de movimiento. Actuador: brazo giratorio con cintas y bocina. Programa: si detecta movimiento en la milpa, entonces gira el brazo y suena.'}
];
let critErrorBank=[
  {txt:'"Lo primero que hace un buen equipo es construir el robot; el problema se busca después."',
   g1:'Está al revés: la PRIMERA etapa es IDENTIFICAR el problema, decir qué falla, a quién afecta y por qué importa.',
   g2:'Construir sin problema definido desperdicia tiempo y materiales: no habría criterio con qué comparar la prueba.'},
  {txt:'"Si el prototipo falla en la prueba, el proyecto fracasó y hay que empezar otro tema."',
   g1:'Fallar NO es fracasar: la prueba sirve justamente para descubrir qué falla y anotarlo.',
   g2:'Después de la prueba viene MEJORAR: se cambia lo que falló y se vuelve a probar (iterar) hasta cumplir el criterio.'},
  {txt:'"El criterio y la restricción son lo mismo: los dos son reglas del proyecto."',
   g1:'El CRITERIO dice lo que el robot DEBE LOGRAR (por ejemplo, avisar antes de que el agua llegue al vado).',
   g2:'La RESTRICCIÓN es el LÍMITE que no se puede pasar: costo, materiales disponibles, tiempo y seguridad.'},
  {txt:'"Un robot bonito y caro siempre es mejor que uno sencillo de material reciclado."',
   g1:'Lo que hace bueno a un robot es RESOLVER el problema cumpliendo el criterio, no su apariencia.',
   g2:'Un diseño caro puede violar la restricción de costo y quedar fuera del alcance de la comunidad.'},
  {txt:'"No importa a quién afecte el robot: si funciona, ya está bien hecho."',
   g1:'Falta la ÉTICA del diseño: hay que preguntarse a quién beneficia y a quién podría perjudicar.',
   g2:'También falta la SEGURIDAD de quien lo usa: voltaje bajo, cables aislados y partes sin filo son parte del diseño.'}
];
let critProcesoQuestions=[
  '1. ¿Qué falló en la prueba y cómo se dieron cuenta?',
  '2. ¿Qué cambio concreto harías para mejorarlo?',
  '3. ¿Cómo comunicarías el resultado a tu comunidad?',
];
let critProcesoBank=[
  {txt:'El equipo del huerto probó su regador tres veces: el agua se abrió bien, pero nunca se cerró y el terreno quedó encharcado.',
   f:'Falló el cierre: el programa abría el agua pero no tenía la orden de cerrarla cuando la tierra ya estaba húmeda. Lo notaron porque midieron el terreno después de cada ensayo.',
   m:'Agregar al programa: si la tierra ya está húmeda, entonces cierra la válvula; y volver a probar tres veces midiendo el agua usada.',
   c:'Mostrando a la comunidad la tabla de las tres pruebas antes y después de la mejora, con el boceto y una demostración corta.'},
  {txt:'La alarma del vado sonó, pero cuando sonó el agua ya cubría el camino y nadie alcanzó a devolverse.',
   f:'Falló el momento del aviso: el sensor estaba colocado demasiado bajo, así que avisaba tarde. Lo descubrieron al comparar la hora del aviso con la hora en que el agua tapó el vado.',
   m:'Subir el sensor y poner una segunda marca de aviso temprano; repetir la prueba con agua y cronómetro.',
   c:'Avisando en la escuela y en la iglesia, con un cartel que explique qué significa cada sonido de la alarma.'},
  {txt:'El clasificador de basura pasó 20 envases: 18 llegaron al depósito correcto y 2 se fueron al equivocado.',
   f:'Falló la separación de los envases más livianos: la compuerta se movía tarde. Lo supieron porque contaron los aciertos y los errores de los 20 envases.',
   m:'Adelantar el momento en que se mueve la compuerta y hacer más lenta la banda; repetir la prueba con otros 20 envases.',
   c:'Presentando en dos minutos el problema, el porcentaje de aciertos antes y después, y la maqueta funcionando.'},
  {txt:'El techo automático del patio de secado del café cerró bien, pero tardó tanto que el café ya se había mojado.',
   f:'Falló el tiempo de respuesta: el motor era muy lento para el tamaño del techo. Lo midieron con cronómetro desde la primera gota hasta el cierre completo.',
   m:'Usar una polea que dé más velocidad o dividir el techo en dos partes que cierren a la vez; volver a medir el tiempo.',
   c:'Explicando a las familias cafetaleras cuánto café se salva por cada minuto que se gana al cerrar.'},
  {txt:'El espantapájaros robótico funcionó el primer día, pero al tercer día se quedó sin batería antes del mediodía.',
   f:'Falló la fuente de energía: la batería no alcanzaba para toda la jornada. Lo notaron al anotar la hora en que dejaba de girar cada día.',
   m:'Agregar un panel solar pequeño para recargar la batería y hacer que el brazo gire solo cuando el sensor detecte movimiento.',
   c:'Compartiendo con los vecinos la tabla de horas de funcionamiento antes y después del panel solar.'}
];
let critCompareBank=[
  {a:'Enunciado que dice qué falla, a quién afecta y por qué importa (ejemplo: la huerta se seca el fin de semana).',b:'Propuesta concreta para resolverlo (ejemplo: un regador que abre el agua cuando la tierra está seca).',
   ga:'El problema.',
   gb:'La solución.',
   gr:'Semejanza: los dos se escriben en la ficha del proyecto y hablan de la misma necesidad. Diferencia: el problema describe la situación y a las personas afectadas; la solución propone el robot y sus partes.'},
  {a:'Lo que el robot DEBE LOGRAR para considerarse un éxito (ejemplo: avisar antes de que el agua llegue al vado).',b:'El LÍMITE que no se puede pasar (ejemplo: no gastar más de 200 lempiras ni más de tres semanas).',
   ga:'El criterio.',
   gb:'La restricción.',
   gr:'Semejanza: los dos se escriben antes de diseñar y guían las decisiones del equipo. Diferencia: el criterio mide el éxito; la restricción limita el costo, los materiales, el tiempo o la seguridad.'},
  {a:'Primera versión armada con material disponible para poder ensayarla y descubrir fallos.',b:'Etapa en la que se cambia lo que falló y se vuelve a ensayar hasta cumplir el criterio.',
   ga:'El prototipo.',
   gb:'La mejora (iterar).',
   gr:'Semejanza: los dos forman parte del ciclo de diseño y necesitan pruebas con datos anotados. Diferencia: el prototipo es el objeto que se construye; mejorar es la acción de corregirlo tras la prueba.'},
  {a:'Dibujo rotulado que muestra qué sensor, qué mecanismo, qué energía y qué programa llevará el robot.',b:'Presentación de dos minutos ante la clase con el problema, el diseño, la prueba y la mejora.',
   ga:'El boceto del diseño.',
   gb:'La comunicación del proyecto.',
   gr:'Semejanza: los dos explican el robot a otras personas y necesitan claridad. Diferencia: el boceto se hace antes de construir y guía al equipo; la comunicación se hace al final y muestra los resultados obtenidos.'}
];
let critDesignBank=[
  'En tu comunidad, la cosecha de café se pierde cuando llueve de repente y los granos están secándose en el patio.',
  'En invierno el río crece y los niños no saben si es seguro cruzar el vado para llegar a la escuela.',
  'La huerta escolar se seca porque nadie llega a regarla los fines de semana ni en vacaciones.',
  'El agua de la quebrada inunda las casas del barrio de noche y las familias no alcanzan a resguardar sus cosas.',
  'En el centro educativo la basura se mezcla: plástico, papel y restos de comida van al mismo depósito.',
];
let critDesignGuide='Rúbrica de 4 criterios (total 20 pts) — ① PROBLEMA BIEN DEFINIDO (5 pts): dice qué falla, a quién afecta y por qué importa, con un criterio de éxito medible. ② SENSORES Y MECANISMOS JUSTIFICADOS (5 pts): nombra qué sensor mide la señal del problema, qué mecanismo o actuador ejecuta la acción y qué fuente de energía usa, explicando POR QUÉ escogió cada uno. ③ PROGRAMA COHERENTE (5 pts): escribe la instrucción principal en la forma «si pasa X, entonces hace Y», y respeta las restricciones de costo, materiales, tiempo y seguridad. ④ MEJORA TRAS LA PRUEBA (5 pts): describe cómo probaría el prototipo (qué mediría y cuántas veces) y qué mejoraría si falla, mostrando que fallar es parte del proceso.';
function genEvalCrit(){
  sfx('click');
  _injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });
  const _sC = document.getElementById('evalCritFormaSel');
  if (_sC && parseInt(_sC.value, 10)) evalCritFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sC.value, 10)));
  const cf=evalCritFormNum;window._currentEvalCritForm=cf;const rngC = _evalRng(200000 + cf);evalCritFormNum=(evalCritFormNum%EVAL_FORMAS)+1;_injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });saveProgress();
  document.getElementById('evalcrit-screen-title').textContent=`🧠 Pensamiento Crítico · Forma ${cf} · Robots que Resuelven Problemas`;
  evalCritAnsVisible=false;
  const out=document.getElementById('evalCritOut');out.innerHTML='';
  const sens=_pickF(critCasoBank,2,rngC);
  const s1=document.createElement('div');
  s1.innerHTML=`<div class="eval-section-title">I. Del problema al diseño <span class="eval-pts">20 pts</span></div><div class="eval-item">${sens.map((k,i)=>`<div class="crit-scenario">Caso ${i+1}: ${k.txt}</div><div class="crit-q-block"><div class="crit-q-label">Escribe el PROBLEMA (qué falla y a quién afecta) y el DISEÑO: qué sensor mide la señal, qué actuador ejecuta la acción y qué instrucción sigue el programa.</div><textarea class="crit-textarea" rows="2" aria-label="Problema y diseño del caso ${i+1}"></textarea><div class="crit-pauta">${k.ans}</div></div>`).join('')}<div class="crit-selfscore"><label for="critScore0">Obtenido:</label><input type="number" id="critScore0" class="crit-score-input" data-score="0" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s1);
  const err=_pickF(critErrorBank,1,rngC)[0];
  const s2=document.createElement('div');
  s2.innerHTML=`<div class="eval-section-title">II. Corrige el error conceptual <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${err.txt}</div><p style="font-size:0.85rem;margin-bottom:0.5rem;">Esta afirmación tiene <strong>dos errores</strong>. Corrígelos con argumentos, usando el ciclo de diseño (identificar → idear → diseñar → construir → probar → mejorar → comunicar):</p><div class="crit-q-block"><div class="crit-q-label">Error 1 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 1 y su corrección"></textarea><div class="crit-pauta">${err.g1}</div></div><div class="crit-q-block"><div class="crit-q-label">Error 2 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 2 y su corrección"></textarea><div class="crit-pauta">${err.g2}</div></div><div class="crit-selfscore"><label for="critScore1">Obtenido:</label><input type="number" id="critScore1" class="crit-score-input" data-score="1" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s2);
  const cic=_pickF(critProcesoBank,1,rngC)[0];
  const cicloGuides=[cic.f,cic.m,cic.c];
  const s3=document.createElement('div');
  s3.innerHTML=`<div class="eval-section-title">III. Analiza el proceso de diseño <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${cic.txt}</div>${critProcesoQuestions.map((q,i)=>`<div class="crit-q-block"><div class="crit-q-label">${q}</div><textarea class="crit-textarea" rows="2" aria-label="${q}"></textarea><div class="crit-pauta">${cicloGuides[i]}</div></div>`).join('')}<div class="crit-selfscore"><label for="critScore2">Obtenido:</label><input type="number" id="critScore2" class="crit-score-input" data-score="2" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s3);
  const cmp=_pickF(critCompareBank,1,rngC)[0];
  const s4=document.createElement('div');
  s4.innerHTML=`<div class="eval-section-title">IV. Comparación razonada <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-compare-grid"><div class="crit-compare-box"><h5>Caso A</h5>${cmp.a}</div><div class="crit-compare-box"><h5>Caso B</h5>${cmp.b}</div></div><div class="crit-q-block"><div class="crit-q-label">1. ¿Qué concepto corresponde a cada caso? 2. ¿En qué se parecen? 3. ¿En qué se diferencian? Da un ejemplo de cada uno.</div><textarea class="crit-textarea" rows="4" aria-label="Comparación razonada de los casos A y B"></textarea><div class="crit-pauta">Caso A: ${cmp.ga} · Caso B: ${cmp.gb} · ${cmp.gr}</div></div><div class="crit-selfscore"><label for="critScore3">Obtenido:</label><input type="number" id="critScore3" class="crit-score-input" data-score="3" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s4);
  const dis=_pickF(critDesignBank,1,rngC)[0];
  const s5=document.createElement('div');
  s5.innerHTML=`<div class="eval-section-title">V. Proyecto de diseño completo <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${dis}</div><div class="crit-q-block"><div class="crit-q-label">Diseña el proyecto completo: ① define el PROBLEMA (a quién afecta) y su criterio de éxito; ② escoge SENSOR, MECANISMO y fuente de ENERGÍA justificando cada uno; ③ escribe la instrucción principal del PROGRAMA («si pasa X, entonces hace Y») respetando costo, materiales, tiempo y seguridad; ④ explica cómo lo PROBARÍAS y qué MEJORARÍAS si falla. Puedes bocetarlo en tu cuaderno.</div><textarea class="crit-textarea" rows="5" aria-label="Proyecto de diseño completo"></textarea><div class="crit-pauta">${critDesignGuide}</div></div><div class="crit-selfscore"><label for="critScore4">Obtenido:</label><input type="number" id="critScore4" class="crit-score-input" data-score="4" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
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
  let s1=`<div class="sec-title"><span>I. Del problema al diseño</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div>`;
  d.sens.forEach((k,i)=>{s1+=`<p class="crit-print-scenario">Caso ${i+1}: ${k.txt}</p><p class="crit-print-q">Escribe el problema (qué falla y a quién afecta) y el diseño: sensor, actuador y la instrucción del programa.</p>${lines(1)}`;});
  let s2=`<div class="sec-title"><span>II. Corrige el error conceptual</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.err.txt}</p><p class="crit-print-q">Esta afirmación tiene dos errores. Corrígelos con argumentos:</p><p class="crit-print-q"><strong>Error 1:</strong></p>${lines(1)}<p class="crit-print-q"><strong>Error 2:</strong></p>${lines(1)}`;
  let s3=`<div class="sec-title"><span>III. Analiza el proceso de diseño</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.cic.txt}</p>`;
  critProcesoQuestions.forEach(q=>{s3+=`<p class="crit-print-q">${q}</p>${lines(1)}`;});
  let s4=`<div class="sec-title"><span>IV. Comparación razonada</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><div class="crit-compare-print-grid"><div class="crit-compare-print-box"><strong>Caso A:</strong> ${d.cmp.a}</div><div class="crit-compare-print-box"><strong>Caso B:</strong> ${d.cmp.b}</div></div><p class="crit-print-q">1. ¿Qué concepto corresponde a cada caso? 2. ¿En qué se parecen? 3. ¿En qué se diferencian? Da un ejemplo de cada uno.</p>${lines(2)}`;
  let s5=`<div class="sec-title"><span>V. Proyecto de diseño completo</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.dis}</p><p class="crit-print-q">Diseña el proyecto completo: ① problema y criterio de éxito; ② sensor, mecanismo y energía justificados; ③ instrucción del programa («si pasa X, entonces hace Y») dentro de las restricciones; ④ cómo lo probarías y qué mejorarías. Boceta al reverso de la hoja.</p>${lines(4)}`;
  let pR='';
  pR+=`<div class="p-sec"><div class="p-ttl">I. Del problema al diseño</div>${d.sens.map((k,i)=>`<div class="p-crit-line"><strong>Caso ${i+1}:</strong> ${k.ans}</div>`).join('')}</div>`;
  pR+=`<div class="p-sec"><div class="p-ttl">II. Corrige el error</div><div class="p-crit-line"><strong>Error 1:</strong> ${d.err.g1}</div><div class="p-crit-line"><strong>Error 2:</strong> ${d.err.g2}</div></div>`;
  pR+=`<div class="p-sec"><div class="p-ttl">III. Analiza el proceso</div><div class="p-crit-line"><strong>Qué falló:</strong> ${d.cic.f}</div><div class="p-crit-line"><strong>Mejora:</strong> ${d.cic.m}</div><div class="p-crit-line"><strong>Comunicación:</strong> ${d.cic.c}</div></div>`;
  pR+=`<div class="p-sec"><div class="p-ttl">IV. Comparación</div><div class="p-crit-line"><strong>Caso A:</strong> ${d.cmp.ga}</div><div class="p-crit-line"><strong>Caso B:</strong> ${d.cmp.gb}</div><div class="p-crit-line">${d.cmp.gr}</div></div>`;
  pR+=`<div class="p-sec" style="grid-column:1/-1;"><div class="p-ttl">V. Proyecto de diseño completo — Rúbrica</div><div class="p-crit-line">${critDesignGuide}</div></div>`;
  const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Pensamiento Crítico Robots que Resuelven Problemas · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.1rem 0.4rem;margin:0.2rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #0e7490;background:#ecfeff;color:#0e7490;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#0e7490;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #0e7490;height:12px;}.obt-pct{white-space:nowrap;}.crit-print-scenario{font-size:10.5pt;background:#ecfeff;border-left:3px solid #0e7490;padding:0.2rem 0.5rem;margin:0.1rem 0 0.2rem;line-height:1.3;}.crit-print-q{font-size:10pt;font-weight:600;margin:0.15rem 0 0.08rem;line-height:1.25;}.ln{border-bottom:1px solid #111;min-height:12px;margin-bottom:2px;}.crit-compare-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin:0.15rem 0;}.crit-compare-print-box{font-size:9.5pt;background:#ecfeff;border-radius:4px;padding:0.25rem 0.4rem;line-height:1.25;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.08rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.9rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.45rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.1rem;margin-bottom:0.18rem;}.p-crit-line{font-size:11pt;color:#007a00;margin-bottom:0.18rem;line-height:1.35;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.2rem;padding:0.1rem 0;color:#0e7490;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #0e7490;}.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:12.7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="critEvalPage"><div class="ph"><h2>Robótica · Prueba de Pensamiento Crítico · Robots que Resuelven Problemas · Educación Básica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 5 secciones de 20 puntos</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100</span></div></div><div class="pauta-wrap" id="critPautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Pensamiento Crítico · Robots que Resuelven Problemas · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 5 secciones × 20 pts c/u — respuesta abierta, usar como guía de corrección</div></div><div class="p-grid">${pR}</div></div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("critEvalPage",250,0.55,1.2);fit("critPautaPage",250,0.55,1.2);})();<\/script></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(typeof METAS_TR==='function'?METAS_TR(doc):doc);win.document.close();setTimeout(()=>win.print(),400);
}

// ===================== TALLER DE DISEÑO =====================
// Recorrido por las 7 etapas del ciclo de diseño aplicado a 5 proyectos hondureños.
// Toda la retroalimentación sale de los datos: las claves nunca se escriben en el HTML.
let CICLO_ETAPAS=[
  {id:'identificar',n:'1. Identificar el problema',icon:'🔍',guia:'¿Qué falla?, ¿a quién afecta?, ¿por qué importa? Aquí se escribe también el criterio de éxito.'},
  {id:'idear',n:'2. Idear soluciones',icon:'💡',guia:'Se anotan MUCHAS ideas sin juzgarlas; después se escoge la más realista según el costo, el tiempo y los materiales.'},
  {id:'disenar',n:'3. Diseñar',icon:'✏️',guia:'Boceto rotulado: qué SENSOR mide, qué MECANISMO actúa, qué ENERGÍA lo mueve y qué INSTRUCCIÓN sigue el programa.'},
  {id:'construir',n:'4. Construir el prototipo',icon:'🔧',guia:'Se arma la primera versión con el material disponible. Debe poder probarse, no verse bonita.'},
  {id:'probar',n:'5. Probar',icon:'🧪',guia:'Se ensaya varias veces, se mide y se anota qué falla y qué funciona, comparando con el criterio.'},
  {id:'mejorar',n:'6. Mejorar',icon:'🔁',guia:'Se cambia lo que falló (una cosa a la vez) y se vuelve a probar. Fallar es parte del proceso.'},
  {id:'comunicar',n:'7. Comunicar',icon:'📢',guia:'Se presenta el proyecto en dos minutos: problema, diseño, prueba, mejora y a quién beneficia.'}
];
function cicloOrdenCorrecto(){return CICLO_ETAPAS.map(e=>e.id);}
let proyectosHN=[
  {id:'cafe',nombre:'Robot del patio de café',icon:'☕',equipo:'Diseñadora: Keyli · Programador: Denis · Constructor: Alexis · Probadora: Yensi',
   etapas:{
    identificar:'☕ En la aldea, el café tendido en el patio se moja cuando llueve de repente. Afecta a las familias cafetaleras: pierden parte de la cosecha del año. <strong>Criterio:</strong> el techo debe quedar cerrado antes de un minuto desde la primera gota.',
    idear:'Ideas del equipo: (1) un vigilante por turnos, (2) una lona que se jala con una cuerda, (3) un techo corredizo que se cierra solo al detectar lluvia.',
    disenar:'✏️ Boceto: sensor de lluvia en la orilla del patio, techo corredizo sobre rieles movido por un motor con polea, batería recargada con panel solar, y un programa con una sola orden principal.',
    construir:'🔧 Prototipo a escala con cartón, dos poleas de hilo, un motor de juguete y una bandeja con granos de maíz haciendo de café.',
    probar:'🧪 Prueba: se rocía agua sobre el sensor y se cronometra. En tres ensayos el techo cerró en 95, 88 y 91 segundos: NO cumple el criterio de un minuto.',
    mejorar:'🔁 Mejora: dividir el techo en dos hojas que cierran a la vez y usar una polea más pequeña en el motor. Nuevos ensayos: 42, 39 y 44 segundos. ✅ Cumple.',
    comunicar:'📢 Presentación de 2 minutos ante la clase y ante la cooperativa: problema, boceto, tabla de tiempos antes y después, y cuánto café se salva por cosecha.'},
   decisiones:[
    {etapa:'idear',k:'idea',q:'¿Cuál de las tres ideas conviene escoger?',opts:['Un vigilante por turnos día y noche','Un techo corredizo que se cierra solo al detectar lluvia','Guardar el café en sacos y no tenderlo'],a:1,why:'Es la única que resuelve el problema sin depender de que alguien esté presente y sin perder el secado al sol.'},
    {etapa:'disenar',k:'sensor',q:'¿Qué sensor lleva el robot?',opts:['Sensor de lluvia','Sensor de sonido','Sensor de peso'],a:0,why:'La señal del problema es la lluvia: hay que medirla justo cuando empieza.'},
    {etapa:'disenar',k:'mecanismo',q:'¿Qué mecanismo mueve el techo?',opts:['Un engranaje que gira una hélice','Un motor con polea sobre rieles','Un imán'],a:1,why:'La polea multiplica la fuerza del motor y permite deslizar un techo pesado sobre los rieles.'},
    {etapa:'disenar',k:'energia',q:'En el patio no hay tomacorriente cercano. ¿Qué energía usa?',opts:['Batería recargada con panel solar','Cable de 300 metros desde la casa','Una candela'],a:0,why:'El patio de secado está al sol todo el día: el panel recarga la batería y evita cables largos peligrosos.'},
    {etapa:'disenar',k:'programa',q:'¿Cuál es la instrucción principal del programa?',opts:['Cierra el techo cada hora','Si el sensor detecta lluvia, entonces cierra el techo','Abre el techo cuando alguien pase'],a:1,why:'La estructura «si pasa X, entonces hace Y» conecta lo que mide el sensor con lo que hace el actuador.'},
    {etapa:'mejorar',k:'mejora',q:'El techo cerró en 91 segundos y el criterio es 60. ¿Qué mejora conviene?',opts:['Bajar el criterio a 120 segundos','Dividir el techo en dos hojas y usar una polea más pequeña','Quitar el sensor'],a:1,why:'Se mejora el diseño, no el criterio: dos hojas recorren la mitad del camino y la polea da más velocidad.'}],
   orden:[4,0,6,2,5,1,3]},
  {id:'rio',nombre:'Alerta del vado del río',icon:'🌊',equipo:'Diseñador: Marlon · Programadora: Suyapa · Constructora: Dania · Probador: Elvin',
   etapas:{
    identificar:'🌊 En invierno el río crece y los niños no saben si es seguro cruzar el vado camino a la escuela. Afecta a las familias de la otra orilla y hay riesgo de accidente. <strong>Criterio:</strong> avisar cuando el agua llegue a la mitad de la marca de seguridad, no cuando ya la pase.',
    idear:'Ideas: (1) pintar una regla en la piedra, (2) mandar a un adulto a revisar, (3) una alarma con sensor de nivel que suene y encienda una luz roja.',
    disenar:'✏️ Boceto: sensor de nivel de agua sujeto a un poste, bocina y luz roja de alarma, batería con panel solar, y un programa que compara el nivel con la marca.',
    construir:'🔧 Prototipo con una botella, una boya de corcho, un timbre y una lámpara, todo montado en una tabla junto al vado.',
    probar:'🧪 Prueba: se llena poco a poco un recipiente. La alarma sonó cuando el agua ya cubría la marca completa: avisó tarde en los tres ensayos.',
    mejorar:'🔁 Mejora: subir el sensor a la mitad de la marca y añadir un segundo aviso temprano. En la nueva prueba la alarma suena con el agua a la mitad. ✅ Cumple.',
    comunicar:'📢 Se explica en la escuela y en la iglesia qué significa cada aviso, y se coloca un cartel junto al vado con el dibujo del sistema.'},
   decisiones:[
    {etapa:'idear',k:'idea',q:'¿Cuál idea conviene escoger?',opts:['Pintar una regla en la piedra','Una alarma con sensor de nivel, bocina y luz','Mandar a un adulto a revisar cada mañana'],a:1,why:'Avisa sola, de día y de noche, sin poner a nadie en riesgo ni depender de que alguien mire la regla.'},
    {etapa:'disenar',k:'sensor',q:'¿Qué sensor necesita?',opts:['Sensor de nivel de agua','Sensor de color','Sensor de temperatura'],a:0,why:'Lo que hay que medir es cuánto sube el agua: esa es la señal del problema.'},
    {etapa:'disenar',k:'mecanismo',q:'¿Qué actuador da el aviso?',opts:['Un brazo que baja una barrera de metal','Bocina y luz roja intermitente','Una banda transportadora'],a:1,why:'El aviso debe oírse y verse de lejos, de día y de noche; una barrera pesada sería cara e insegura.'},
    {etapa:'disenar',k:'energia',q:'Junto al vado no hay electricidad. ¿Qué energía usa?',opts:['Batería con panel solar','Un cable desde el poste del alumbrado','Corriente del río directamente'],a:0,why:'Es seguro, no necesita instalación eléctrica y funciona aunque se corte la luz por la tormenta.'},
    {etapa:'disenar',k:'programa',q:'¿Cuál es la instrucción principal?',opts:['Suena la alarma cada 10 minutos','Si el nivel llega a la mitad de la marca, entonces enciende alarma y luz','Apaga la luz si hay sol'],a:1,why:'Relaciona la medida del sensor con la acción del actuador y respeta el criterio de avisar a tiempo.'},
    {etapa:'mejorar',k:'mejora',q:'La alarma avisó cuando el agua ya tapaba la marca. ¿Qué mejora conviene?',opts:['Subir el sensor a la mitad de la marca y añadir un aviso temprano','Poner la bocina más fuerte','Probar solo cuando no llueva'],a:0,why:'El problema no era el volumen sino el momento del aviso: hay que medir antes, no más fuerte.'}],
   orden:[2,5,0,6,3,1,4]},
  {id:'huerto',nombre:'Regador del huerto escolar',icon:'🌱',equipo:'Diseñador: Josué · Programadora: Angelly · Constructora: Jael · Probador: Kevin',
   etapas:{
    identificar:'🌱 La huerta escolar se seca los fines de semana y en vacaciones porque nadie llega a regarla. Afecta a todo el centro educativo: se pierden las plantas y el trabajo de meses. <strong>Criterio:</strong> mantener la tierra húmeda tres días seguidos sin que nadie intervenga.',
    idear:'Ideas: (1) turnos de riego con las familias, (2) botellas con goteo lento, (3) un regador con sensor de humedad que abre y cierra el agua solo.',
    disenar:'✏️ Boceto: sensor de humedad enterrado, válvula o bomba conectada a la manguera, batería con panel solar, y un programa con dos órdenes: abrir y cerrar.',
    construir:'🔧 Prototipo con una botella grande de depósito, una manguera fina, una válvula de juguete y el sensor hecho con dos clavos separados.',
    probar:'🧪 Prueba de tres días: el agua se abrió bien cada vez, pero nunca se cerró y el terreno quedó encharcado. Se midió el nivel del depósito cada mañana.',
    mejorar:'🔁 Mejora: agregar al programa la orden de cierre cuando la tierra ya está húmeda. Nueva prueba de tres días: la tierra se mantuvo húmeda y sobró agua. ✅ Cumple.',
    comunicar:'📢 Presentación con la tabla de los tres días antes y después, el boceto y una demostración corta del regador en el patio.'},
   decisiones:[
    {etapa:'idear',k:'idea',q:'¿Cuál idea cumple el criterio de tres días sin nadie?',opts:['Turnos de riego con las familias','Un regador con sensor de humedad que abre y cierra el agua','Regar el viernes el doble'],a:1,why:'Es la única que funciona sola durante los tres días y no depende de que alguien llegue.'},
    {etapa:'disenar',k:'sensor',q:'¿Qué sensor lleva?',opts:['Sensor de humedad de la tierra','Sensor de distancia','Sensor de sonido'],a:0,why:'La señal del problema es la sequedad de la tierra: eso es lo que hay que medir.'},
    {etapa:'disenar',k:'mecanismo',q:'¿Qué actuador deja pasar el agua?',opts:['Una bocina','Una válvula o bomba de agua','Un engranaje de dientes grandes'],a:1,why:'Es el actuador que abre y cierra el paso del agua, que es la acción que resuelve el problema.'},
    {etapa:'disenar',k:'energia',q:'¿Qué fuente de energía conviene en el huerto?',opts:['Batería con panel solar','Extensión eléctrica desde el aula','Pilas cambiadas cada día'],a:0,why:'El huerto está al sol, no hay tomacorriente cerca y nadie irá a cambiar pilas el fin de semana.'},
    {etapa:'disenar',k:'programa',q:'¿Cuál es la instrucción principal del programa?',opts:['Riega siempre sin parar','Si la tierra está seca, entonces abre el agua; si ya está húmeda, entonces ciérrala','Abre el agua a las 6 de la mañana'],a:1,why:'Tiene la condición y también el cierre: sin la segunda orden el terreno se encharca.'},
    {etapa:'mejorar',k:'mejora',q:'El terreno quedó encharcado. ¿Qué mejora conviene?',opts:['Poner menos plantas','Agregar la orden de cerrar cuando la tierra ya está húmeda','Quitar el sensor y regar a mano'],a:1,why:'El fallo estaba en el programa, no en las plantas: faltaba la orden de cierre.'}],
   orden:[6,2,4,0,5,1,3]},
  {id:'inundacion',nombre:'Alerta de inundaciones del barrio',icon:'🚨',equipo:'Diseñadora: Evelyn · Programador: Bryan · Constructor: Nelson · Probadora: Rosa',
   etapas:{
    identificar:'🚨 El agua de la quebrada entra a las casas de noche y las familias no alcanzan a resguardar sus cosas ni a salir con los niños. <strong>Criterio:</strong> avisar a todo el barrio al menos 15 minutos antes de que el agua llegue a las casas.',
    idear:'Ideas: (1) que un vecino vigile la quebrada, (2) un grupo de mensajes por teléfono, (3) una sirena automática con sensor de nivel y de lluvia.',
    disenar:'✏️ Boceto: sensor de nivel en la quebrada y sensor de lluvia, sirena y luz intermitente en el poste más alto, batería con panel solar y respaldo, programa con dos niveles de aviso.',
    construir:'🔧 Prototipo con una canaleta, una boya, un timbre fuerte y una lámpara intermitente, protegidos con una caja plástica contra la lluvia.',
    probar:'🧪 Prueba con manguera: la sirena sonó, pero solo se oyó a 40 metros y el criterio pide todo el barrio. También entró agua a la caja.',
    mejorar:'🔁 Mejora: subir la sirena al poste más alto, agregar una segunda sirena en la otra cuadra y sellar la caja con silicón. Nueva prueba: se oye a 120 metros. ✅ Cumple.',
    comunicar:'📢 Reunión con el patronato: se explica qué significa cada aviso, dónde están las sirenas y qué debe hacer cada familia al oírlas.'},
   decisiones:[
    {etapa:'idear',k:'idea',q:'¿Cuál idea avisa aunque todos estén dormidos?',opts:['Que un vecino vigile la quebrada de noche','Una sirena automática con sensor de nivel y de lluvia','Un grupo de mensajes por teléfono'],a:1,why:'Funciona sola de madrugada y no depende de que alguien esté despierto o tenga saldo en el teléfono.'},
    {etapa:'disenar',k:'sensor',q:'¿Qué sensores necesita?',opts:['De nivel de agua y de lluvia','De color y de sonido','De peso y de tacto'],a:0,why:'La crecida se anticipa midiendo el agua de la quebrada y la lluvia que la alimenta.'},
    {etapa:'disenar',k:'mecanismo',q:'¿Qué actuador da la alerta al barrio?',opts:['Una banda transportadora','Sirena y luz intermitente en el poste alto','Un brazo mecánico'],a:1,why:'Debe alcanzar a todo el barrio: el sonido fuerte y la luz visible cumplen ese criterio.'},
    {etapa:'disenar',k:'energia',q:'La tormenta suele cortar la luz. ¿Qué energía conviene?',opts:['Batería con panel solar y respaldo cargado','Solo la corriente de la casa','Un generador de gasolina encendido siempre'],a:0,why:'Justo cuando más se necesita la alarma es cuando se va la luz: la batería garantiza el aviso.'},
    {etapa:'disenar',k:'programa',q:'¿Cuál es la instrucción principal?',opts:['Si el nivel sube de la primera marca, entonces avisa; si pasa la segunda, entonces suena la sirena','Suena la sirena cada media hora','Enciende la luz cuando oscurezca'],a:0,why:'Dos niveles de aviso dan tiempo a las familias: primero alerta temprana y luego evacuación.'},
    {etapa:'mejorar',k:'mejora',q:'La sirena solo se oyó a 40 metros. ¿Qué mejora conviene?',opts:['Subirla al poste más alto y agregar una segunda sirena','Avisar solo a las casas cercanas','Probar sin lluvia para que se oiga mejor'],a:0,why:'El criterio es avisar a TODO el barrio: hay que aumentar el alcance, no reducir la meta.'}],
   orden:[3,6,1,5,0,4,2]},
  {id:'basura',nombre:'Clasificador de basura del centro',icon:'♻️',equipo:'Diseñador: Ángel · Programadora: Fanny · Constructor: Óscar · Probadora: Lucía',
   etapas:{
    identificar:'♻️ En el centro educativo el plástico, el papel y los restos de comida van al mismo depósito, así que nada se puede reciclar. Afecta al aseo del patio y a la comunidad que compra el material reciclable. <strong>Criterio:</strong> clasificar bien al menos 19 de cada 20 envases.',
    idear:'Ideas: (1) rotular los depósitos y confiar, (2) un alumno de turno separando a mano, (3) una banda con sensor que desvía cada envase a su depósito.',
    disenar:'✏️ Boceto: sensor de peso al inicio de la banda, banda de cartón movida por un motor con polea, compuerta que desvía, batería recargable y programa con una condición.',
    construir:'🔧 Prototipo con una banda de cartón y cintas, un motor de juguete con polea, una compuerta de paleta y dos cajas rotuladas.',
    probar:'🧪 Prueba con 20 envases: 18 llegaron al depósito correcto y 2 livianos se fueron al equivocado. No alcanza el criterio de 19 de 20.',
    mejorar:'🔁 Mejora: adelantar el momento en que se mueve la compuerta y hacer más lenta la banda. Nueva prueba con otros 20 envases: 20 aciertos. ✅ Cumple.',
    comunicar:'📢 Presentación de 2 minutos con la maqueta funcionando y la tabla de aciertos antes y después, más la invitación a usar los depósitos rotulados.'},
   decisiones:[
    {etapa:'idear',k:'idea',q:'¿Cuál idea puede alcanzar 19 aciertos de cada 20?',opts:['Rotular los depósitos y confiar','Una banda con sensor que desvía cada envase','Un alumno de turno separando a mano todo el día'],a:1,why:'Es medible y constante; rotular no garantiza nada y un alumno de turno pierde clases y se cansa.'},
    {etapa:'disenar',k:'sensor',q:'¿Qué sensor distingue los envases?',opts:['Sensor de peso (o de color)','Sensor de humedad','Sensor de nivel de agua'],a:0,why:'El plástico y el papel se diferencian bien por su peso y su color: esa es la señal útil.'},
    {etapa:'disenar',k:'mecanismo',q:'¿Qué mecanismo mueve y separa los envases?',opts:['Una hélice','Una banda con motor y polea, más una compuerta','Una bocina'],a:1,why:'La banda transporta y la compuerta desvía: juntas ejecutan la acción que resuelve el problema.'},
    {etapa:'disenar',k:'energia',q:'La banda estará dentro del aula-taller. ¿Qué energía conviene?',opts:['Batería recargable de bajo voltaje','Corriente de 110 V con cables pelados','Un motor de gasolina'],a:0,why:'Bajo voltaje y cables aislados: la seguridad de los alumnos es una restricción del proyecto.'},
    {etapa:'disenar',k:'programa',q:'¿Cuál es la instrucción principal?',opts:['Mueve la banda sin parar','Si el envase es liviano, entonces abre la compuerta del plástico','Apaga el motor si hay ruido'],a:1,why:'Convierte la medida del sensor en la acción de la compuerta, que es lo que clasifica.'},
    {etapa:'mejorar',k:'mejora',q:'Dos envases livianos cayeron al depósito equivocado. ¿Qué mejora conviene?',opts:['Adelantar el movimiento de la compuerta y hacer más lenta la banda','Contar solo los envases pesados','Bajar el criterio a 15 de 20'],a:0,why:'Se corrige el diseño para cumplir el criterio; cambiar la meta o la cuenta sería engañarse.'}],
   orden:[1,4,6,2,0,3,5]}
];
let tallerProy='cafe',tallerEtapa='identificar',tallerOrden=[],tallerOrdenLista='cafe';
function _tallerProy(){return proyectosHN.find(p=>p.id===tallerProy)||proyectosHN[0];}
function _tallerEtapa(){return CICLO_ETAPAS.find(e=>e.id===tallerEtapa)||CICLO_ETAPAS[0];}
function tallerDecisiones(proy,etapaId){return proy.decisiones.filter(d=>d.etapa===etapaId);}
function tallerShowProyecto(id){tallerProy=id;updateLabDisplay();document.querySelectorAll('.lab-cont-btn').forEach(b=>b.classList.remove('active-pri'));const btn=document.querySelector('[data-proj="'+id+'"]');if(btn)btn.classList.add('active-pri');const f=document.getElementById('fbLab');if(f)f.classList.remove('show');tallerBuildOrden();if(typeof sfx==='function')sfx('click');}
function tallerShowEtapa(id){tallerEtapa=id;updateLabDisplay();document.querySelectorAll('.lab-asp-btn').forEach(b=>b.classList.remove('active-sec'));const btn=document.querySelector('[data-etapa="'+id+'"]');if(btn)btn.classList.add('active-sec');const f=document.getElementById('fbLab');if(f)f.classList.remove('show');if(typeof sfx==='function')sfx('click');}
function updateLabDisplay(){
  const proy=_tallerProy(),et=_tallerEtapa(),idx=CICLO_ETAPAS.findIndex(e=>e.id===et.id);
  const sent=document.getElementById('lab-sentence');
  if(sent)sent.innerHTML='🛠️ Proyecto: <strong>'+proy.icon+' '+proy.nombre+'</strong> → <strong>'+et.icon+' '+et.n+'</strong>';
  const box=document.getElementById('lab-display');if(!box)return;
  let h='<div class="lab-cont-header">'+et.icon+' '+et.n+'</div>';
  h+='<div class="taller-progress" aria-hidden="true">'+CICLO_ETAPAS.map((e,i)=>'<span class="taller-dot'+(i<=idx?' on':'')+'">'+(i+1)+'</span>').join('')+'</div>';
  h+='<div class="lab-asp-title">'+proy.icon+' '+proy.nombre+'</div>';
  h+='<div class="lab-asp-info">'+proy.etapas[et.id]+'</div>';
  h+='<div class="taller-guia">🧭 <strong>En esta etapa:</strong> '+et.guia+'</div>';
  if(et.id==='comunicar')h+='<div class="taller-guia">👥 <strong>Roles del equipo:</strong> '+proy.equipo+'</div>';
  const decs=tallerDecisiones(proy,et.id);
  decs.forEach(d=>{
    const key=proy.id+'_'+d.k;
    h+='<div class="taller-dec" data-dec="'+key+'"><div class="taller-dec-q">🤔 '+d.q+'</div><div class="cmp-opts">'
      +d.opts.map((o,i)=>'<button class="cmp-opt" onclick="tallerDecide(\''+proy.id+'\',\''+d.k+'\','+i+',this)">'+o+'</button>').join('')
      +'</div><div class="taller-dec-fb" id="tallerFb_'+key+'"></div></div>';
  });
  if(decs.length===0)h+='<div class="taller-guia">✍️ Anota esta etapa en tu ficha de proyecto: es la que llevarás al cuaderno.</div>';
  box.innerHTML=h;
}
function tallerDecide(pid,k,i,btn){
  const proy=proyectosHN.find(p=>p.id===pid);if(!proy)return;
  const d=proy.decisiones.find(x=>x.k===k);if(!d)return;
  const wrap=btn.parentElement;
  if(wrap.dataset.done==='1')return;
  wrap.dataset.done='1';
  wrap.querySelectorAll('.cmp-opt').forEach((b,ix)=>{if(ix===d.a)b.classList.add('correct');else if(ix===i)b.classList.add('wrong');});
  const fbEl=document.getElementById('tallerFb_'+pid+'_'+k);
  const okDec=(i===d.a);
  if(fbEl){fbEl.className='taller-dec-fb show '+(okDec?'ok':'bad');fbEl.innerHTML=(okDec?'✅ ¡Buena decisión! ':'❌ Conviene la otra opción. ')+d.why;}
  if(okDec){if(typeof sfx==='function')sfx('ok');const key='taller_'+pid+'_'+k;if(!xpTracker.wgt.has(key)){xpTracker.wgt.add(key);pts(2);}
    const total=proy.decisiones.length;const hechas=proy.decisiones.filter(x=>xpTracker.wgt.has('taller_'+pid+'_'+x.k)).length;
    if(hechas===total){fin('s-lab');unlockAchievement('taller_master');showToast('🛠️ ¡Proyecto '+proy.nombre+' completo!');}
  }else if(typeof sfx==='function')sfx('no');
}
function tallerBuildOrden(){
  const proy=_tallerProy();tallerOrdenLista=proy.id;
  tallerOrden=proy.orden.map(i=>CICLO_ETAPAS[i].id);
  tallerRenderOrden();
  const f=document.getElementById('fbCiclo');if(f)f.classList.remove('show');
}
function tallerRenderOrden(){
  const list=document.getElementById('cicloList');if(!list)return;list.innerHTML='';
  tallerOrden.forEach((id,i)=>{
    const et=CICLO_ETAPAS.find(e=>e.id===id);
    const div=document.createElement('div');div.className='sort-item';
    div.innerHTML='<div class="sort-arrows"><button class="sort-arrow" onclick="tallerMoveOrden('+i+',-1)"'+(i===0?' disabled':'')+'>▲</button><button class="sort-arrow" onclick="tallerMoveOrden('+i+',1)"'+(i===tallerOrden.length-1?' disabled':'')+'>▼</button></div><div class="sort-step-num">'+(i+1)+'.</div><div class="sort-item-txt">'+et.icon+' '+et.n.replace(/^\d+\.\s*/,'')+'</div>';
    list.appendChild(div);
  });
}
function tallerMoveOrden(idx,dir){if(typeof sfx==='function')sfx('click');const ni=idx+dir;if(ni<0||ni>=tallerOrden.length)return;[tallerOrden[idx],tallerOrden[ni]]=[tallerOrden[ni],tallerOrden[idx]];tallerRenderOrden();}
function tallerCheckOrden(){
  const correcto=cicloOrdenCorrecto();
  const bien=tallerOrden.every((id,i)=>id===correcto[i]);
  if(bien){fb('fbCiclo','¡Perfecto! Ese es el ciclo de diseño completo. +5 XP',true);if(typeof sfx==='function')sfx('fan');
    if(!xpTracker.wgt.has('ciclo_'+tallerOrdenLista)){xpTracker.wgt.add('ciclo_'+tallerOrdenLista);pts(5);}
    fin('s-lab');unlockAchievement('widgets_master');
  }else{
    const mal=tallerOrden.findIndex((id,i)=>id!==correcto[i]);
    fb('fbCiclo','Aún no. Revisa el paso '+(mal+1)+': recuerda identificar → idear → diseñar → construir → probar → mejorar → comunicar.',false);
    if(typeof sfx==='function')sfx('no');
  }
}
function tallerResetOrden(){if(typeof sfx==='function')sfx('click');tallerBuildOrden();}

// ===================== DIPLOMA =====================
function _diplPct(){return xp>=MXP?100:Math.round((xp/MXP)*100);}
function openDiploma(){sfx('fan');const pct=_diplPct();document.getElementById('diplPct').textContent=pct+'%';document.getElementById('diplBar').style.width=pct+'%';document.getElementById('diplDate').textContent='Fecha: '+new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});const msgs=['¡Sigue diseñando!','¡Muy buen trabajo de equipo!','¡Vas muy bien: ya sabes probar y mejorar!','¡Dominas el ciclo de diseño completo!','¡Cerraste la Ruta de los Robots: eres Maestro Innovador!'];document.getElementById('diplMsg').textContent=msgs[Math.min(Math.floor(pct/25),4)];const stars=['⭐','⭐⭐','⭐⭐⭐'];document.getElementById('diplStars').textContent=stars[Math.min(Math.floor(pct/40),2)];const achTxt=unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(' · ');document.getElementById('diplAch').textContent=achTxt||'Sigue completando secciones para desbloquear logros';document.getElementById('diplomaOverlay').classList.add('open');launchConfetti();}
function closeDiploma(){document.getElementById('diplomaOverlay').classList.remove('open');}
function updateDiplomaName(v){document.getElementById('diplName').textContent=v||'Estudiante';}
function shareWA(){const name=document.getElementById('diplName').textContent||'Estudiante';const pct=_diplPct();const msg=`🏆 ¡${name} completó la Misión "Robots que Resuelven Problemas" y cerró la Ruta de los Robots! 🏅 Progreso: ${pct}% · 🌱 policastsapien.com`;_waShare(msg);}
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
  tallerShowProyecto('cafe');
  tallerShowEtapa('identificar');
  tallerBuildOrden();
  renderAchPanel();
});

(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalCrit==='function') _injectFormaSel('genEvalCrit','evalCritFormaSel',evalCritFormNum,function(v){evalCritFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();

// ===================== IDIOMA (español ↔ inglés) =====================
// El contenido en inglés vive en robots-problemas-en.js y el botón lo maneja
// ../../js/metas-i18n.js. Aquí solo se intercambian los bancos y se repinta:
// el progreso (XP, logros, secciones hechas) no se toca al cambiar de idioma.
//
// El widget que ordena las 7 etapas compara por ID (identificar, idear…), no
// por texto, así que traducir CICLO_ETAPAS no lo rompe. Los otros tres widgets
// sí comparan contra el textContent del botón, pero ese texto sale del propio
// banco: al cambiarlo entero, los dos lados quedan en el mismo idioma.
const _BANCOS_ES = {
  ACHIEVEMENTS, lvls, fcData, memoPairs, qzData, classGroups, idData, cmpData,
  routeSets, neuronPartes, neuroPairs, enfermedadData, retoPairs,
  identifyTaskDB, classifyTaskDB, completeTaskDB, explainQuestions, sopaSets,
  evalTFBank, evalMCBank, evalCPBank, evalPRBank,
  critCasoBank, critErrorBank, critProcesoQuestions, critProcesoBank,
  critCompareBank, critDesignBank, critDesignGuide, CICLO_ETAPAS, proyectosHN
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
  critCasoBank = usa('critCasoBank'); critErrorBank = usa('critErrorBank');
  critProcesoQuestions = usa('critProcesoQuestions'); critProcesoBank = usa('critProcesoBank');
  critCompareBank = usa('critCompareBank'); critDesignBank = usa('critDesignBank');
  critDesignGuide = usa('critDesignGuide');
  CICLO_ETAPAS = usa('CICLO_ETAPAS'); proyectosHN = usa('proyectosHN');

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
  tallerShowProyecto(tallerProy); tallerShowEtapa(tallerEtapa); tallerBuildOrden();
  renderAchPanel(); updateXPBar();

  // Las pruebas ya generadas se rehacen en el idioma nuevo, con su misma forma
  const out = document.getElementById('evalOut');
  if (out && out.innerHTML.trim()) { evalFormNum = window._currentEvalForm || evalFormNum; genEval(); }
  const outCrit = document.getElementById('evalCritOut');
  if (outCrit && outCrit.innerHTML.trim()) { evalCritFormNum = window._currentEvalCritForm || evalCritFormNum; genEvalCrit(); }
  const tg = document.getElementById('tgOut');
  if (tg) tg.innerHTML = '';
};
