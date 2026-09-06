// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){if(typeof METAS_TR_TEXTO==='function')texto=METAS_TR_TEXTO(texto);const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
function compartirMision(){const url=window.location.href;const texto=`🧠 *Misión Asignada* 🧠\n\nPractica sobre este tema y sobresale en ser de los mejores alumnos. 🏆\n\nDesbloquea *todos los logros* y puedes poner *tus datos* para que tu maestro observe todos tus logros. 📋\n\n_Se te hará prueba escrita y serás excelente estudiante en Programación._ 💻\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;_waShare(texto);}
function toggleLetra(){document.body.classList.toggle('letra-grande');if(typeof sfx==='function')sfx('click');localStorage.setItem('preferenciaLetra',document.body.classList.contains('letra-grande'));}
window.addEventListener('DOMContentLoaded',()=>{if(localStorage.getItem('preferenciaLetra')==='true')document.body.classList.add('letra-grande');});

// ===================== UTILIDADES =====================
const _pick=(arr,n)=>[...arr].sort(()=>Math.random()-0.5).slice(0,n);
const _shuffle=(arr)=>[...arr].sort(()=>Math.random()-0.5);
function fb(id,msg,isOk){const el=document.getElementById(id);if(el){el.textContent=msg;el.className='fb show '+(isOk?'ok':'err');}}

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY='pensamiento_computacional_v1';
let xp=0,MXP=200,done=new Set(),evalAnsVisible=false;
let evalFormNum=1,unlockedAch=[],darkMode=false,prevLevel=0;
let evalOpFormNum=1,evalOpAnsVisible=false;
const TOTAL_SECTIONS=13;
const xpTracker={fc:new Set(),qz:new Set(),cls:new Set(),id:new Set(),cmp:new Set(),reto:new Set(),sopa:new Set(),wgt:new Set(),memo:new Set(),lab:new Set()};

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
let ACHIEVEMENTS={
  primer_quiz:{icon:'🧠',label:'Primer quiz del pensamiento superado'},
  flash_master:{icon:'🃏',label:'Todas las flashcards del pensamiento exploradas'},
  clasif_pro:{icon:'🗂️',label:'Clasificador de instrucciones y problemas experto'},
  id_master:{icon:'🔍',label:'Identificador de conceptos maestro'},
  reto_hero:{icon:'🏆',label:'Héroe del reto contra reloj'},
  lab_master:{icon:'🫓',label:'¡Los 4 escenarios del maestro robot completados!'},
  nivel3:{icon:'🧭',label:'¡Cazador de Patrones! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡Pensador Computacional! Nivel 6'},
  widgets_master:{icon:'🧩',label:'Widgets del pensamiento computacional dominados'}
};
function unlockAchievement(id){if(unlockedAch.includes(id))return;unlockedAch.push(id);sfx('ach');showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label);launchConfetti();renderAchPanel();saveProgress();}
function renderAchPanel(){const list=document.getElementById('achList');list.innerHTML='';Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{const div=document.createElement('div');div.className='ach-item'+(unlockedAch.includes(id)?'':' locked');div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`;list.appendChild(div);});}
function toggleAchPanel(){sfx('click');document.getElementById('achPanel').classList.toggle('open');}
function showToast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}t.textContent=msg;t.style.display='block';clearTimeout(t._tid);t._tid=setTimeout(()=>t.style.display='none',3200);}
function launchConfetti(){const colors=['#0e7490','#22d3ee','#b45309','#f59e0b','#06b6d4'];for(let i=0;i<60;i++){const c=document.createElement('div');c.className='confetti-piece';c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`;document.body.appendChild(c);c.addEventListener('animationend',()=>c.remove());}}

// ===================== XP =====================
let lvls=[{t:0,n:'Aprendiz 🌱'},{t:25,n:'Explorador de Pasos 🧭'},{t:55,n:'Cazador de Patrones 🔍'},{t:90,n:'Maestro del Orden 📜'},{t:130,n:'Divisor de Problemas 🧩'},{t:165,n:'Pensador Computacional 🧠'},{t:190,n:'Maestro del Pensamiento 🏆'}];
function pts(n){xp=Math.max(0,Math.min(MXP,xp+n));updateXPBar();saveProgress();}
function updateXPBar(){const pct=Math.round((xp/MXP)*100);document.getElementById('xpFill').style.width=pct+'%';const el=document.getElementById('xpPts');el.textContent='⭐ '+xp;el.style.transform='scale(1.3)';setTimeout(()=>el.style.transform='',300);let lv=0;for(let i=0;i<lvls.length;i++)if(xp>=lvls[i].t)lv=i;document.getElementById('xpLvl').textContent=lvls[lv].n;if(lv!==prevLevel){if(lv>=2)unlockAchievement('nivel3');if(lv>=5)unlockAchievement('nivel5');prevLevel=lv;}}
function resetXP(){sfx('click');xp=0;updateXPBar();showToast('🔄 XP reiniciado a 0');}
function fin(id,showFX=true){if(!done.has(id)){done.add(id);const b=document.querySelector(`[data-s="${id}"]`);if(b)b.classList.add('done');if(showFX){sfx('up');launchConfetti();}saveProgress();}}
function getProgress(){return Math.round((done.size/TOTAL_SECTIONS)*100);}

// ===================== NAV =====================
function go(id){sfx('click');document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});document.getElementById(id).classList.add('active');const btn=document.querySelector(`[data-s="${id}"]`);if(btn){btn.classList.add('active');btn.setAttribute('aria-selected','true');}window.scrollTo({top:0,behavior:'smooth'});if(id==='s-sopa'){setTimeout(buildSopa,50);}if(id==='s-widgets'){setTimeout(buildRoute,50);}}

// ===================== MINI-QUIZ (tarjetas Aprende / Conceptos) =====================
function miniQuiz(btn,ok,fbId){const wrap=btn.parentElement;wrap.querySelectorAll('.mq-opt').forEach(b=>b.classList.remove('correct','wrong'));btn.classList.add(ok?'correct':'wrong');const f=document.getElementById(fbId);if(f){f.textContent=ok?'¡Correcto! Así piensa un programador. 🎉':'Todavía no. Vuelve a leer la tarjeta y prueba otra vez.';f.className='mq-fb '+(ok?'ok':'err');}sfx(ok?'ok':'no');if(ok&&!xpTracker.wgt.has('mq_'+fbId)){xpTracker.wgt.add('mq_'+fbId);pts(2);}}

// ===================== FLASHCARD DATA =====================
let fcData=[
  {w:'Pensamiento computacional',a:'🧠 Pensar como programador: <strong>ordenar pasos</strong>, <strong>dividir problemas</strong> y <strong>buscar patrones</strong>, ¡aun sin computadora!'},
  {w:'Algoritmo',a:'🫓 Los <strong>pasos ordenados</strong> para lograr algo, como la <strong>receta de las baleadas</strong>.'},
  {w:'Instrucción',a:'🗣️ Una <strong>orden</strong> que alguien puede ejecutar; forma cada paso de un algoritmo.'},
  {w:'Instrucción exacta',a:'✅ «Agrega <strong>2 cucharadas</strong>»: todos la ejecutan <strong>igual</strong>.'},
  {w:'Instrucción ambigua',a:'🌫️ «Ponle <strong>un poco</strong>»: cada quien entiende <strong>algo distinto</strong> y falla.'},
  {w:'Secuencia',a:'📜 Lista de pasos <strong>en orden</strong>: se cumplen del primero al último.'},
  {w:'Descomponer',a:'🧩 <strong>Dividir</strong> un problema grande en <strong>partes pequeñas</strong> más fáciles.'},
  {w:'Patrón',a:'🔁 Algo que <strong>se repite</strong>; descubrirlo ahorra trabajo.'},
  {w:'Abstracción',a:'🗺️ Quedarse <strong>solo con lo importante</strong>, como hace un <strong>mapa</strong>.'},
  {w:'Problema grande',a:'🎪 Tarea enorme (como <strong>organizar la feria escolar</strong>) que se vence <strong>por partes</strong>.'},
  {w:'Parte pequeña',a:'🍰 Un pedacito <strong>manejable</strong> de un problema grande.'},
  {w:'Paso',a:'👣 Cada acción de un algoritmo; empieza con un <strong>verbo claro</strong> (lavar, cortar, pegar).'},
  {w:'Computadora',a:'💻 Máquina que hace <strong>exactamente</strong> lo que se le dice: <strong>no adivina</strong> nada.'},
  {w:'Orden',a:'🔢 La posición de los pasos: <strong>cambiarlo cambia el resultado</strong>.'},
];
let fcIdx=0;
function upFC(){document.getElementById('fcInner').classList.remove('flipped');document.getElementById('fcW').textContent=fcData[fcIdx].w;document.getElementById('fcA').innerHTML=fcData[fcIdx].a;document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length;}
function flipCard(){sfx('flip');document.getElementById('fcInner').classList.toggle('flipped');if(!xpTracker.fc.has(fcIdx)){xpTracker.fc.add(fcIdx);pts(1);}if(xpTracker.fc.size===fcData.length){fin('s-flash');unlockAchievement('flash_master');}}
function nextFC(){sfx('click');fcIdx=(fcIdx+1)%fcData.length;upFC();}
function prevFC(){sfx('click');fcIdx=(fcIdx-1+fcData.length)%fcData.length;upFC();}

// ===================== JUEGO: MEMORIA DEL PENSAMIENTO =====================
let memoPairs=[
  {id:'algoritmo',t:'Algoritmo',d:'🫓 La receta de las baleadas: pasos ordenados'},
  {id:'exacta',t:'Instrucción exacta',d:'✅ «Agrega 2 cucharadas de frijoles»'},
  {id:'ambigua',t:'Instrucción ambigua',d:'🌫️ «Ponle un poco de sal»'},
  {id:'descomponer',t:'Descomponer',d:'🧩 La feria escolar dividida en partes'},
  {id:'patron',t:'Patrón',d:'🔁 Lo que se repite una y otra vez'},
  {id:'abstraccion',t:'Abstracción',d:'🗺️ El mapa: solo lo importante'}
];
let memoDeck=[],memoOpen=[],memoLock=false,memoMoves=0,memoFound=0;
function buildMemo(){
  const grid=document.getElementById('memoGrid');if(!grid)return;
  memoDeck=_shuffle(memoPairs.flatMap(p=>[{id:p.id,txt:p.t,kind:'t'},{id:p.id,txt:p.d,kind:'d'}]));
  memoOpen=[];memoLock=false;memoMoves=0;memoFound=0;
  grid.innerHTML='';
  memoDeck.forEach((c,i)=>{
    const b=document.createElement('button');
    b.className='memo-card';b.setAttribute('aria-label','Carta de memoria '+(i+1));
    b.innerHTML=`<span class="memo-face memo-front">❓</span><span class="memo-face memo-back${c.kind==='t'?' memo-term':''}">${c.txt}</span>`;
    b.onclick=()=>flipMemo(b,i);
    grid.appendChild(b);
  });
  updateMemoStats();
  const f=document.getElementById('fbMemo');if(f)f.classList.remove('show');
}
function updateMemoStats(){const s=document.getElementById('memoStats');if(s)s.textContent=`🃏 Parejas: ${memoFound} de ${memoPairs.length} · Intentos: ${memoMoves}`;}
function flipMemo(btn,i){
  if(memoLock||btn.classList.contains('revealed')||btn.classList.contains('matched'))return;
  sfx('flip');btn.classList.add('revealed');memoOpen.push({btn,i});
  if(memoOpen.length<2)return;
  memoMoves++;memoLock=true;
  const[a,b]=memoOpen;
  if(memoDeck[a.i].id===memoDeck[b.i].id){
    setTimeout(()=>{
      a.btn.classList.add('matched');b.btn.classList.add('matched');
      memoFound++;sfx('ok');
      if(!xpTracker.memo.has(memoDeck[a.i].id)){xpTracker.memo.add(memoDeck[a.i].id);pts(1);}
      memoOpen=[];memoLock=false;updateMemoStats();
      if(memoFound===memoPairs.length){pts(2);fb('fbMemo',`¡Memoria completada en ${memoMoves} intentos! +2 XP extra`,true);sfx('fan');launchConfetti();}
    },450);
  }else{
    setTimeout(()=>{a.btn.classList.remove('revealed');b.btn.classList.remove('revealed');memoOpen=[];memoLock=false;sfx('no');updateMemoStats();},900);
  }
  updateMemoStats();
}
function resetMemo(){sfx('click');buildMemo();}

// ===================== QUIZ DATA =====================
let qzData=[
  {q:'¿Qué es un algoritmo?',o:['a) Pasos ordenados para lograr algo','b) Un tipo de computadora','c) Un dibujo bonito','d) Un número muy grande'],c:0},
  {q:'¿Cuál de estas instrucciones es EXACTA?',o:['a) «Ponle un poco»','b) «Agrega 2 cucharadas de azúcar»','c) «Hazlo bonito»','d) «Trae varias cosas»'],c:1},
  {q:'¿Por qué falla la instrucción «ponle un poco»?',o:['a) Porque es muy larga','b) Porque tiene números','c) Porque cada quien entiende una cantidad distinta','d) Porque está en español'],c:2},
  {q:'¿Qué hace una computadora con las instrucciones?',o:['a) Adivina lo que queremos','b) Elige la que le gusta','c) Las cambia de orden','d) Ejecuta exactamente lo que se le dice'],c:3},
  {q:'Descomponer un problema es…',o:['a) Dividirlo en partes pequeñas','b) Borrarlo','c) Hacerlo más grande','d) Esconderlo'],c:0},
  {q:'¿Qué es un patrón?',o:['a) Un error del programa','b) Algo que se repite','c) Un mapa','d) Una computadora'],c:1},
  {q:'La abstracción consiste en…',o:['a) Escribir todo con mucho detalle','b) Repetir los pasos','c) Quedarse solo con lo importante','d) Hacer un dibujo realista'],c:2},
  {q:'En la receta de la baleada, ¿qué pasa si cambias el orden de los pasos?',o:['a) Nada, el orden no importa','b) La baleada se hace sola','c) Sale más rica','d) El resultado cambia y sale mal'],c:3},
  {q:'Para organizar la feria escolar conviene…',o:['a) Dividirla en partes: comida, juegos, invitaciones','b) Hacer todo a la vez sin plan','c) Esperar a que se organice sola','d) Cancelarla'],c:0},
];
let qzIdx=0,qzSel=-1,qzDone=false;
function buildQz(){qzIdx=0;qzSel=-1;qzDone=false;showQz();}
function showQz(){var _fbQ=document.getElementById('fbQz');if(_fbQ)_fbQ.classList.remove('show');if(qzIdx>=qzData.length){document.getElementById('qzQ').textContent='🎉 ¡Quiz completado!';document.getElementById('qzOpts').innerHTML='';fin('s-quiz');unlockAchievement('primer_quiz');return;}const q=qzData[qzIdx];document.getElementById('qzProg').textContent=`Pregunta ${qzIdx+1} de ${qzData.length}`;document.getElementById('qzQ').textContent=q.q;const opts=document.getElementById('qzOpts');opts.innerHTML='';q.o.forEach((o,i)=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=o;b.onclick=()=>{if(qzDone)return;document.querySelectorAll('.qz-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');qzSel=i;sfx('click');};opts.appendChild(b);});qzDone=false;}
// El quiz ya NO avanza solo a los 1,6 s. Con el avance automático, el alumno que
// fallaba veía la respuesta correcta medio segundo y desaparecía antes de poder
// leerla; y el «Incorrecto» se quedaba colgado debajo de la pregunta SIGUIENTE,
// que todavía no había contestado. Ahora avanza él, cuando ya la leyó.
function nextQz(){
  if(!qzDone)return fb('fbQz','Primero toca «Verificar».',false);
  qzIdx++; qzSel=-1; qzDone=false; showQz();
}
function checkQz(){if(qzSel<0)return fb('fbQz','Selecciona una respuesta.',false);qzDone=true;const opts=document.querySelectorAll('.qz-opt');if(qzSel===qzData[qzIdx].c){opts[qzSel].classList.add('correct');fb('fbQz','¡Correcto! +5 XP',true);if(!xpTracker.qz.has(qzIdx)){xpTracker.qz.add(qzIdx);pts(5);}sfx('ok');}else{opts[qzSel].classList.add('wrong');opts[qzData[qzIdx].c].classList.add('correct');fb('fbQz','Incorrecto. Revisa la respuesta correcta.',false);sfx('no');}}
function resetQz(){sfx('click');qzIdx=0;qzSel=-1;qzDone=false;showQz();document.getElementById('fbQz').classList.remove('show');}

// ===================== CLASIFICACIÓN =====================
let classGroups=[
  {label:['Instrucción exacta','Instrucción ambigua'],headA:'✅ Instrucción exacta',headB:'🌫️ Instrucción ambigua',colA:'ex',colB:'am',
   words:[{w:'«Da 3 pasos hacia adelante»',t:'ex'},{w:'«Camina por ahí»',t:'am'},{w:'«Agrega 2 cucharadas de azúcar»',t:'ex'},{w:'«Ponle un poco de sal»',t:'am'},{w:'«Lee las páginas 12 a 15»',t:'ex'},{w:'«Hazlo bonito»',t:'am'},{w:'«Recorta un cuadrado de 10 cm»',t:'ex'},{w:'«Trae varias cosas»',t:'am'},{w:'«Guarda 5 lempiras cada lunes»',t:'ex'},{w:'«Espera un ratito»',t:'am'}]},
  {label:['Problema grande','Parte pequeña'],headA:'🎪 Problema grande',headB:'🍰 Parte pequeña',colA:'pg',colB:'pp',
   words:[{w:'Organizar la feria escolar',t:'pg'},{w:'Preparar los puestos de comida',t:'pp'},{w:'Montar la huerta escolar',t:'pg'},{w:'Conseguir las semillas',t:'pp'},{w:'Celebrar el Día del Niño',t:'pg'},{w:'Comprar las piñatas',t:'pp'},{w:'Hacer el mural de la independencia',t:'pg'},{w:'Pintar una sección del mural',t:'pp'}]},
  {label:['Secuencia correcta','Secuencia con error'],headA:'✅ Secuencia correcta',headB:'❌ Secuencia con error',colA:'ok',colB:'err',
   words:[{w:'Lavar → picar → cocinar',t:'ok'},{w:'Comer → servir → cocinar',t:'err'},{w:'Sembrar → regar → cosechar',t:'ok'},{w:'Cosechar → sembrar → regar',t:'err'},{w:'Amasar → cocer → untar → doblar',t:'ok'},{w:'Doblar → untar → amasar',t:'err'},{w:'Ponerse calcetines → ponerse zapatos',t:'ok'},{w:'Ponerse zapatos → ponerse calcetines',t:'err'}]},
  {label:['Del pensamiento computacional','De otra materia'],headA:'💻 Pensamiento computacional',headB:'📚 De otra materia',colA:'prog',colB:'otro',
   words:[{w:'Algoritmo',t:'prog'},{w:'Fotosíntesis',t:'otro'},{w:'Patrón',t:'prog'},{w:'Sustantivo',t:'otro'},{w:'Descomponer',t:'prog'},{w:'Península',t:'otro'},{w:'Abstracción',t:'prog'},{w:'Fracción',t:'otro'},{w:'Secuencia',t:'prog'},{w:'Estela maya',t:'otro'}]},
];
let currentClassGroupIdx=0,clsSelectedWord=null;
function buildClass(){const group=classGroups[currentClassGroupIdx];document.getElementById('col-left-head').textContent=group.headA;document.getElementById('col-right-head').textContent=group.headB;const bank=document.getElementById('clsBank');bank.innerHTML='';clsSelectedWord=null;document.getElementById('items-left').innerHTML='';document.getElementById('items-right').innerHTML='';_shuffle([...group.words]).forEach(w=>{const el=document.createElement('div');el.className='wb-item';el.textContent=w.w;el.dataset.t=w.t;el.onclick=()=>{document.querySelectorAll('.wb-item').forEach(i=>i.classList.remove('sel-word'));el.classList.add('sel-word');clsSelectedWord=el;sfx('click');};bank.appendChild(el);});['col-left','col-right'].forEach(colId=>{const col=document.getElementById(colId);col.onclick=(e)=>{if(!clsSelectedWord||e.target.classList.contains('drop-item'))return;const targetId=colId==='col-left'?'items-left':'items-right';const wordsCol=document.getElementById(targetId);const item=document.createElement('div');item.className='drop-item';item.textContent=clsSelectedWord.textContent;item.dataset.t=clsSelectedWord.dataset.t;const original=clsSelectedWord;item.onclick=(ev)=>{ev.stopPropagation();if(clsSelectedWord!==null){col.click();}else{document.getElementById('clsBank').appendChild(original);original.classList.remove('sel-word');item.remove();if(typeof sfx==='function')sfx('click');}};wordsCol.appendChild(item);clsSelectedWord.remove();clsSelectedWord=null;sfx('click');};});}
function checkClass(){const remaining=document.querySelectorAll('#clsBank .wb-item').length;if(remaining>0){fb('fbCls','Mueve todas las palabras a las columnas primero.',false);return;}const group=classGroups[currentClassGroupIdx];let allOk=true;document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{const inLeft=el.parentElement.id==='items-left';const expectedType=inLeft?group.colA:group.colB;if(el.dataset.t===expectedType){el.classList.add('cls-ok');}else{el.classList.add('cls-no');allOk=false;}});if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);}if(allOk){fb('fbCls','¡Perfecto! +5 XP',true);sfx('fan');fin('s-clasifica');unlockAchievement('clasif_pro');}else{fb('fbCls','Hay errores. Marcados en rojo.',false);sfx('no');}}
function nextClassGroup(){sfx('click');currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length;buildClass();document.getElementById('fbCls').classList.remove('show');showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]);}
function resetClass(){sfx('click');buildClass();document.getElementById('fbCls').classList.remove('show');}

// ===================== IDENTIFICAR =====================
let idData=[
  {s:['Un','algoritmo','es','una','lista','de','pasos','en','orden.'],c:1,art:'La palabra que nombra los pasos ordenados para lograr algo'},
  {s:['«Agrega','2','cucharadas»','es','una','instrucción','exacta.'],c:6,art:'La palabra que dice que la instrucción es clara y precisa'},
  {s:['«Ponle','un','poco»','es','una','instrucción','ambigua.'],c:6,art:'La palabra que dice que la orden es confusa'},
  {s:['Descomponer','es','dividir','un','problema','en','partes.'],c:0,art:'La acción de dividir un problema grande'},
  {s:['Un','patrón','es','algo','que','se','repite.'],c:1,art:'El nombre de lo que se repite una y otra vez'},
  {s:['La','abstracción','deja','solo','lo','importante.'],c:1,art:'La palabra que nombra quedarse solo con lo importante'},
  {s:['La','computadora','no','adivina:','obedece','su','programa.'],c:1,art:'La máquina que hace exactamente lo que se le dice'},
  {s:['En','un','algoritmo','importa','mucho','el','orden','de','los','pasos.'],c:6,art:'Lo que no se puede cambiar sin cambiar el resultado'},
];
let idIdx=0,idDone=false;
function showId(){idDone=false;if(idIdx>=idData.length){document.getElementById('idSent').innerHTML='🎉 ¡Completado!';fin('s-identifica');unlockAchievement('id_master');return;}const d=idData[idIdx];document.getElementById('idProg').textContent=`Oración ${idIdx+1} de ${idData.length}`;document.getElementById('idInfo').textContent=`Busca: ${d.art}`;const sent=document.getElementById('idSent');sent.innerHTML='';d.s.forEach((w,i)=>{const span=document.createElement('span');span.className='id-word';span.textContent=w+' ';span.onclick=()=>checkId(i,span);sent.appendChild(span);});}
function checkId(i,span){if(idDone)return;document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected'));span.classList.add('selected');if(i===idData[idIdx].c){idDone=true;span.classList.add('id-ok');fb('fbId','¡Correcto! +5 XP',true);if(!xpTracker.id.has(idIdx)){xpTracker.id.add(idIdx);pts(5);}sfx('ok');}else{span.classList.add('id-no');fb('fbId','Ese no es el término solicitado.',false);sfx('no');}}
function nextId(){sfx('click');idIdx++;showId();document.getElementById('fbId').classList.remove('show');}
function resetId(){sfx('click');idIdx=0;showId();document.getElementById('fbId').classList.remove('show');}

// ===================== COMPLETA =====================
let cmpData=[
  {s:'Los pasos ordenados para lograr algo forman un ___.',opts:['algoritmo','patrón','mapa'],c:0},
  {s:'«Agrega 2 cucharadas» es una instrucción ___.',opts:['ambigua','exacta','inútil'],c:1},
  {s:'«Ponle un poco» falla porque es una instrucción ___.',opts:['exacta','corta','ambigua'],c:2},
  {s:'Dividir un problema grande en partes pequeñas se llama ___.',opts:['descomponer','borrar','adivinar'],c:0},
  {s:'Algo que se repite una y otra vez es un ___.',opts:['paso','patrón','verbo'],c:1},
  {s:'Quedarse solo con lo importante, como un mapa, se llama ___.',opts:['abstracción','decoración','suma'],c:0},
  {s:'La computadora hace ___ lo que se le dice.',opts:['más o menos','exactamente','a veces'],c:1},
  {s:'En un algoritmo importa mucho el ___ de los pasos.',opts:['color','tamaño','orden'],c:2},
];
let cmpIdx=0,cmpSel=-1,cmpDone=false;
function showCmp(){var _fbC=document.getElementById('fbCmp');if(_fbC)_fbC.classList.remove('show');if(cmpIdx>=cmpData.length){document.getElementById('cmpSent').innerHTML='🎉 ¡Completado!';document.getElementById('cmpOpts').innerHTML='';fin('s-completa');return;}const d=cmpData[cmpIdx];document.getElementById('cmpProg').textContent=`Oración ${cmpIdx+1} de ${cmpData.length}`;document.getElementById('cmpSent').innerHTML=d.s.replace('___','<span class="blank">___</span>');const opts=document.getElementById('cmpOpts');opts.innerHTML='';cmpSel=-1;cmpDone=false;d.opts.forEach((o,i)=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=o;b.onclick=()=>{if(cmpDone)return;document.querySelectorAll('.cmp-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');cmpSel=i;sfx('click');};opts.appendChild(b);});}
// Misma razón que en el quiz: la corrección se lee, no se persigue.
function nextCmp(){
  if(!cmpDone)return fb('fbCmp','Primero toca «Verificar».',false);
  cmpIdx++; cmpSel=-1; cmpDone=false; showCmp();
}
function checkCmp(){if(cmpSel<0)return fb('fbCmp','Selecciona una opción.',false);cmpDone=true;const opts=document.querySelectorAll('.cmp-opt');if(cmpSel===cmpData[cmpIdx].c){opts[cmpSel].classList.add('correct');document.getElementById('cmpSent').innerHTML=cmpData[cmpIdx].s.replace('___',`<span class="blank" style="color:var(--jade);border-color:var(--jade)">${opts[cmpSel].textContent}</span>`);fb('fbCmp','¡Correcto! +5 XP',true);if(!xpTracker.cmp.has(cmpIdx)){xpTracker.cmp.add(cmpIdx);pts(5);}sfx('ok');}else{opts[cmpSel].classList.add('wrong');opts[cmpData[cmpIdx].c].classList.add('correct');fb('fbCmp','Incorrecto. Revisa bien la respuesta.',false);sfx('no');}}

// ===================== WIDGETS =====================
// Widget 1: Ordena el algoritmo
let routeSets=[
  {label:'Lavarse los dientes (en orden)',steps:['Poner pasta en el cepillo','Cepillar arriba y abajo','Enjuagar la boca','Lavar y guardar el cepillo']},
  {label:'Hacer tortillas de maíz (en orden)',steps:['Mezclar la masa con agua','Hacer las bolitas','Palmear la tortilla','Cocerla en el comal','Guardarlas en la servilleta']},
  {label:'Preparar el café de la mañana (en orden)',steps:['Poner el agua a hervir','Agregar el café al colador','Colar el café en la taza','Endulzar con 2 cucharaditas de azúcar']},
  {label:'Alistar la mochila para la escuela (en orden)',steps:['Revisar el horario de clases','Guardar los cuadernos del día','Meter el lápiz y el borrador','Cerrar la mochila y dejarla lista']},
  {label:'Alimentar a las gallinas (en orden)',steps:['Llenar el guacal con maíz','Abrir el gallinero','Regar el maíz en el suelo','Cambiar el agua del bebedero']},
];
let currentRouteIdx=0,routeItems=[];
function buildRoute(){routeItems=_shuffle([...routeSets[currentRouteIdx].steps]);renderRoute();const fbEl=document.getElementById('fbRoute');if(fbEl)fbEl.classList.remove('show');}
function renderRoute(){const list=document.getElementById('routeList');if(!list)return;list.innerHTML='';routeItems.forEach((step,i)=>{const div=document.createElement('div');div.className='sort-item';div.innerHTML=`<div class="sort-arrows"><button class="sort-arrow" onclick="routeMove(${i},-1)"${i===0?' disabled':''}>▲</button><button class="sort-arrow" onclick="routeMove(${i},1)"${i===routeItems.length-1?' disabled':''}>▼</button></div><div class="sort-step-num">${i+1}.</div><div class="sort-item-txt">${step}</div>`;list.appendChild(div);});}
function routeMove(idx,dir){sfx('click');const ni=idx+dir;if(ni<0||ni>=routeItems.length)return;[routeItems[idx],routeItems[ni]]=[routeItems[ni],routeItems[idx]];renderRoute();}
function checkRoute(){const correct=routeSets[currentRouteIdx].steps;const isOk=routeItems.every((s,i)=>s===correct[i]);if(isOk){fb('fbRoute','¡Perfecto! Orden correcto. +4 XP',true);if(!xpTracker.wgt.has('route_'+currentRouteIdx)){xpTracker.wgt.add('route_'+currentRouteIdx);pts(4);}sfx('fan');fin('s-widgets');unlockAchievement('widgets_master');}else{fb('fbRoute','Hay pasos fuera de orden. Revisa el arreglo.',false);sfx('no');}}
function nextRoute(){sfx('click');currentRouteIdx=(currentRouteIdx+1)%routeSets.length;buildRoute();showToast('🔄 Secuencia: '+routeSets[currentRouteIdx].label);}

// Widget 2: ¿Exacta o ambigua? (racha con feedback · IDs estándar «enfer»)
let enfermedadData=[
  {disease:'«Da 3 pasos hacia adelante»',characteristic:'Instrucción exacta',opts:['Instrucción exacta','Instrucción ambigua']},
  {disease:'«Ponle un poco de sal»',characteristic:'Instrucción ambigua',opts:['Instrucción ambigua','Instrucción exacta']},
  {disease:'«Agrega 2 cucharadas de azúcar»',characteristic:'Instrucción exacta',opts:['Instrucción exacta','Instrucción ambigua']},
  {disease:'«Hazlo bonito»',characteristic:'Instrucción ambigua',opts:['Instrucción ambigua','Instrucción exacta']},
  {disease:'«Lee las páginas 12 a 15»',characteristic:'Instrucción exacta',opts:['Instrucción exacta','Instrucción ambigua']},
  {disease:'«Trae varias cosas»',characteristic:'Instrucción ambigua',opts:['Instrucción ambigua','Instrucción exacta']},
  {disease:'«Recorta un cuadrado de 10 cm»',characteristic:'Instrucción exacta',opts:['Instrucción exacta','Instrucción ambigua']},
  {disease:'«Espera un ratito»',characteristic:'Instrucción ambigua',opts:['Instrucción ambigua','Instrucción exacta']},
  {disease:'«Guarda 5 lempiras cada lunes»',characteristic:'Instrucción exacta',opts:['Instrucción exacta','Instrucción ambigua']},
  {disease:'«Échale bastante agua»',characteristic:'Instrucción ambigua',opts:['Instrucción ambigua','Instrucción exacta']},
];
let enferIdx=0,enferDone=false,enferRacha=0,enferMejorRacha=0;
function showEnfer(){enferDone=false;if(enferIdx>=enfermedadData.length){const el=document.getElementById('enferDisease');if(el)el.textContent='🎉 ¡Completado! Mejor racha: '+enferMejorRacha+' 🔥';const opts=document.getElementById('enferOpts');if(opts)opts.innerHTML='';return;}const d=enfermedadData[enferIdx];const prog=document.getElementById('enferProg');if(prog)prog.textContent=`${enferIdx+1} de ${enfermedadData.length} · Racha: ${enferRacha} 🔥`;const dis=document.getElementById('enferDisease');if(dis)dis.textContent=d.disease;const opts=document.getElementById('enferOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkEnfer(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbEnfer');if(fbEl)fbEl.classList.remove('show');}
function checkEnfer(opt,btn,d){if(enferDone)return;enferDone=true;document.querySelectorAll('#enferOpts .qz-opt').forEach(b=>{if(b.textContent===d.characteristic)b.classList.add('correct');else if(b===btn&&b.textContent!==d.characteristic)b.classList.add('wrong');});const isOk=opt===d.characteristic;if(isOk){enferRacha++;enferMejorRacha=Math.max(enferMejorRacha,enferRacha);fb('fbEnfer',`¡Correcto! Racha de ${enferRacha} 🔥 +3 XP`,true);if(!xpTracker.wgt.has('enfer_'+enferIdx)){xpTracker.wgt.add('enfer_'+enferIdx);pts(3);}sfx('ok');}else{enferRacha=0;fb('fbEnfer','Racha perdida. Era: '+d.characteristic,false);sfx('no');}setTimeout(()=>{enferIdx++;showEnfer();},1600);}
function resetEnfer(){sfx('click');enferIdx=0;enferRacha=0;showEnfer();}

// Widget 3: Descompón el problema (elige las 3 partes correctas · IDs estándar «neuron»)
let neuronPartes=[
  {problema:'Organizar el cumpleaños de la abuela',correctas:['Hacer la lista de invitados','Preparar el pastel y la comida','Decorar la casa'],extra:['Izar la bandera','Resolver una división','Pintar la escuela']},
  {problema:'Hacer la tarea de matemáticas',correctas:['Leer bien la instrucción','Resolver los ejercicios uno por uno','Revisar las respuestas'],extra:['Regar la huerta','Comprar nances','Doblar la ropa']},
  {problema:'Limpiar el aula el viernes',correctas:['Subir las sillas a los pupitres','Barrer y trapear el piso','Botar la basura en su lugar'],extra:['Cantar el himno','Sembrar un pino','Hacer un fresco']},
  {problema:'Preparar la venta de comida de la escuela',correctas:['Decidir qué comida vender','Comprar los ingredientes','Organizar los turnos de venta'],extra:['Ver televisión','Contar las nubes','Pintar un mapa']},
  {problema:'Cuidar a las gallinas una semana',correctas:['Darles maíz cada mañana','Cambiarles el agua','Limpiar el gallinero'],extra:['Hacer un mural','Escribir un poema','Jugar fútbol']},
];
let neuronIdx=0,neuronDone=false,neuronSel=[];
function showNeuron(){neuronDone=false;neuronSel=[];if(neuronIdx>=neuronPartes.length){const el=document.getElementById('neuronDesc');if(el)el.innerHTML='🎉 ¡Descompusiste todos los problemas!';const opts=document.getElementById('neuronOpts');if(opts)opts.innerHTML='';fin('s-widgets');return;}const d=neuronPartes[neuronIdx];const prog=document.getElementById('neuronProg');if(prog)prog.textContent=`Problema ${neuronIdx+1} de ${neuronPartes.length}`;const desc=document.getElementById('neuronDesc');if(desc)desc.innerHTML=`🎪 Problema grande: <strong>${d.problema}</strong><br><span style="font-size:0.85rem;color:var(--gray);">Toca las <strong>3 partes</strong> que SÍ pertenecen a este problema.</span>`;const opts=document.getElementById('neuronOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.correctas,...d.extra]).forEach(opt=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=opt;b.onclick=()=>toggleNeuron(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuron');if(fbEl)fbEl.classList.remove('show');}
function toggleNeuron(opt,btn,d){if(neuronDone)return;sfx('click');const ix=neuronSel.indexOf(opt);if(ix>=0){neuronSel.splice(ix,1);btn.classList.remove('sel');return;}if(neuronSel.length>=3){fb('fbNeuron','Solo puedes elegir 3 partes. Quita una para cambiar.',false);return;}neuronSel.push(opt);btn.classList.add('sel');if(neuronSel.length===3)checkNeuron(d);}
function checkNeuron(d){neuronDone=true;const okAll=d.correctas.every(c=>neuronSel.includes(c));document.querySelectorAll('#neuronOpts .cmp-opt').forEach(b=>{if(d.correctas.includes(b.textContent))b.classList.add('correct');else if(neuronSel.includes(b.textContent))b.classList.add('wrong');});if(okAll){fb('fbNeuron','¡Problema bien descompuesto! +3 XP',true);if(!xpTracker.wgt.has('neuron_'+neuronIdx)){xpTracker.wgt.add('neuron_'+neuronIdx);pts(3);}sfx('ok');}else{fb('fbNeuron','Esas no son las 3 partes. Las correctas quedaron en verde.',false);sfx('no');}}
function nextNeuron(){sfx('click');neuronIdx++;showNeuron();}
function resetNeuron(){sfx('click');neuronIdx=0;showNeuron();}

// ===================== RETO FINAL =====================
let retoPairs=[
  {label:['Instrucción exacta','Instrucción ambigua'],btnA:'✅ Exacta',btnB:'🌫️ Ambigua',colA:'ex',colB:'am',
   words:[{w:'«Da 3 pasos hacia adelante»',t:'ex'},{w:'«Camina por ahí»',t:'am'},{w:'«Agrega 2 cucharadas»',t:'ex'},{w:'«Ponle un poco»',t:'am'},{w:'«Lee las páginas 12 a 15»',t:'ex'},{w:'«Hazlo bonito»',t:'am'},{w:'«Recorta un cuadrado de 10 cm»',t:'ex'},{w:'«Trae varias cosas»',t:'am'},{w:'«Guarda 5 lempiras cada lunes»',t:'ex'},{w:'«Muévete un poco»',t:'am'}]},
  {label:['Problema grande','Parte pequeña'],btnA:'🎪 Problema grande',btnB:'🍰 Parte pequeña',colA:'pg',colB:'pp',
   words:[{w:'Organizar la feria escolar',t:'pg'},{w:'Preparar un puesto de comida',t:'pp'},{w:'Montar la huerta escolar',t:'pg'},{w:'Conseguir las semillas',t:'pp'},{w:'Celebrar el Día del Niño',t:'pg'},{w:'Comprar las piñatas',t:'pp'},{w:'Hacer el mural de la independencia',t:'pg'},{w:'Pintar una sección del mural',t:'pp'}]},
  {label:['Del pensamiento computacional','De otra materia'],btnA:'💻 Pensamiento',btnB:'📚 Otra materia',colA:'prog',colB:'otro',
   words:[{w:'Algoritmo',t:'prog'},{w:'Fotosíntesis',t:'otro'},{w:'Patrón',t:'prog'},{w:'Sustantivo',t:'otro'},{w:'Descomponer',t:'prog'},{w:'Península',t:'otro'},{w:'Abstracción',t:'prog'},{w:'Fracción',t:'otro'},{w:'Secuencia',t:'prog'},{w:'Estela maya',t:'otro'}]},
];
let currentRetoPairIdx=0,retoPool=[],retoOk=0,retoErr=0,retoTimerInt=null,retoSec=30,retoRunning=false,retoCurrent=null;
function updateRetoButtons(){const pair=retoPairs[currentRetoPairIdx];document.querySelectorAll('.reto-btns .btn')[0].textContent=pair.btnA;document.querySelectorAll('.reto-btns .btn')[1].textContent=pair.btnB;document.querySelectorAll('.reto-btns .btn')[0].onclick=()=>ansReto(pair.colA);document.querySelectorAll('.reto-btns .btn')[1].onclick=()=>ansReto(pair.colB);}
function startReto(){if(retoRunning)return;sfx('click');retoRunning=true;retoOk=0;retoErr=0;retoSec=30;retoPool=_shuffle([...retoPairs[currentRetoPairIdx].words,...retoPairs[currentRetoPairIdx].words]);showRetoWord();retoTimerInt=setInterval(()=>{retoSec--;sfx('tick');document.getElementById('retoTimer').textContent='⏱ '+retoSec;if(retoSec<=10)document.getElementById('retoTimer').style.color='var(--red)';if(retoSec<=0){clearInterval(retoTimerInt);endReto();}},1000);}
function showRetoWord(){if(retoPool.length===0)retoPool=_shuffle([...retoPairs[currentRetoPairIdx].words,...retoPairs[currentRetoPairIdx].words]);retoCurrent=retoPool.pop();document.getElementById('retoWord').textContent=retoCurrent.w;}
function ansReto(t){if(!retoRunning||!retoCurrent)return;const firstPlay=!xpTracker.reto.has(currentRetoPairIdx);if(t===retoCurrent.t){sfx('ok');retoOk++;if(firstPlay)pts(1);}else{sfx('no');retoErr++;if(firstPlay)pts(-1);}document.getElementById('retoScore').textContent=`✅ ${retoOk} correctas | ❌ ${retoErr} errores`;showRetoWord();}
function endReto(){retoRunning=false;document.getElementById('retoWord').textContent='🏁 ¡Tiempo!';document.getElementById('retoTimer').style.color='var(--pri)';xpTracker.reto.add(currentRetoPairIdx);const total=retoOk+retoErr;const pct=total>0?Math.round((retoOk/total)*100):0;fb('fbReto',`Resultado: ${retoOk}/${total} (${pct}%) ¡Bien hecho!`,true);fin('s-reto');sfx('fan');unlockAchievement('reto_hero');}
function nextRetoPair(){sfx('click');clearInterval(retoTimerInt);retoRunning=false;retoSec=30;retoOk=0;retoErr=0;currentRetoPairIdx=(currentRetoPairIdx+1)%retoPairs.length;updateRetoButtons();document.getElementById('retoTimer').textContent='⏱ 30';document.getElementById('retoTimer').style.color='var(--pri)';document.getElementById('retoWord').textContent='¡Prepárate!';document.getElementById('retoScore').textContent='✅ 0 correctas | ❌ 0 errores';document.getElementById('fbReto').classList.remove('show');showToast(`🔄 Pareja: ${retoPairs[currentRetoPairIdx].label[0]} vs ${retoPairs[currentRetoPairIdx].label[1]}`);}
function resetReto(){sfx('click');clearInterval(retoTimerInt);retoRunning=false;retoSec=30;retoOk=0;retoErr=0;document.getElementById('retoTimer').textContent='⏱ 30';document.getElementById('retoTimer').style.color='var(--pri)';document.getElementById('retoWord').textContent='¡Prepárate!';document.getElementById('retoScore').textContent='✅ 0 correctas | ❌ 0 errores';document.getElementById('fbReto').classList.remove('show');}

// ===================== GENERADOR DE TAREAS (aleatorio e infinito) =====================
function _rndInt(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
let ansVisible=false;
function genTask(){sfx('click');const type=document.getElementById('tgType').value;const count=parseInt(document.getElementById('tgCount').value);ansVisible=false;const out=document.getElementById('tgOut');out.innerHTML='';if(type==='algoritmo')genAlgoritmoTask(out,count);else if(type==='ambigua')genAmbiguaTask(out,count);else if(type==='descompon')genDescomponTask(out,count);else if(type==='patron')genPatronTask(out,count);fin('s-tareas');}
function _instrBlock(out,title,lines){const ib=document.createElement('div');ib.className='tg-instruction-block';ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join('');out.appendChild(ib);}
// Tipo 1: escribir el algoritmo de una tarea de casa
let algoritmoTaskDB=[
  {tarea:'Tender la cama',pasos:['Quitar lo que estorba encima','Estirar la sábana','Acomodar la almohada','Doblar la colcha y alisarla']},
  {tarea:'Lavar los trastes del almuerzo',pasos:['Botar los restos de comida','Enjabonar cada traste','Enjuagar con agua limpia','Ponerlos a escurrir']},
  {tarea:'Barrer el patio',pasos:['Sacar la escoba y la pala','Barrer de un extremo al otro','Juntar la basura con la pala','Botarla en el basurero']},
  {tarea:'Dar de comer al perro',pasos:['Lavar el plato del perro','Servir 2 tazas de comida','Cambiar el agua del recipiente','Guardar la bolsa de comida']},
  {tarea:'Hacer arroz para el almuerzo',pasos:['Lavar el arroz','Sofreírlo con un poquito de aceite','Agregar 2 tazas de agua y sal','Cocinar a fuego lento hasta que seque']},
  {tarea:'Doblar la ropa limpia',pasos:['Recoger la ropa seca','Separarla por persona','Doblar cada prenda','Guardarla en su lugar']},
  {tarea:'Regar las plantas de la casa',pasos:['Llenar la regadera','Regar cada planta sin encharcar','Quitar las hojas secas','Guardar la regadera']},
  {tarea:'Poner la mesa para el almuerzo',pasos:['Limpiar la mesa','Colocar un plato por persona','Poner cubiertos y vasos','Llevar la comida al centro']},
  {tarea:'Preparar un fresco de nance',pasos:['Lavar los nances','Machacarlos en una taza de agua','Colar la mezcla','Agregar azúcar y hielo','Servir el fresco']},
  {tarea:'Alistar el uniforme para mañana',pasos:['Revisar que esté limpio','Plancharlo con cuidado','Colgarlo en el gancho','Dejar los zapatos limpios debajo']},
];
function genAlgoritmoTask(out,count){_instrBlock(out,'Instrucción',['Escribe en tu cuaderno el ALGORITMO de cada tarea: de 4 a 6 pasos numerados, cada paso con un verbo claro y en el orden correcto.','Recuerda: instrucciones EXACTAS (cantidades y lugares claros), como si programaras a una persona-robot.']);const pool=_shuffle([...algoritmoTaskDB]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>Escribe el algoritmo para: ${item.tarea}.</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ Ejemplo de pauta: ${item.pasos.map((p,j)=>(j+1)+'. '+p).join(' · ')}</div></div>`;out.appendChild(div);}}
// Tipo 2: marcar la instrucción ambigua
let _exactasDB=['Da {n} pasos hacia adelante','Agrega {n} cucharadas de azúcar','Lee las páginas {n} a {m}','Recorta un cuadrado de {n} cm por lado','Guarda {n} lempiras cada lunes','Escribe {n} oraciones en el cuaderno','Corta {n} rodajas de queso','Camina {n} cuadras y dobla a la derecha'];
let _ambiguasDB=['Ponle un poco de sal','Camina por ahí','Hazlo bonito','Trae varias cosas','Muévete un poco','Espera un ratito','Dibuja algo grande','Échale bastante agua','Ve rápido','Agarra lo que sea'];
function genAmbiguaTask(out,count){_instrBlock(out,'Instrucción',['En cada grupo hay UNA instrucción ambigua escondida entre instrucciones exactas. Escribe la letra de la ambigua y corrígela para volverla exacta.']);for(let i=0;i<count;i++){const exs=_pick(_exactasDB,3).map(t=>t.replace('{n}',_rndInt(2,9)).replace('{m}',_rndInt(10,20)));const amb=_ambiguasDB[_rndInt(0,_ambiguasDB.length-1)];const pos=_rndInt(0,3);const lista=[...exs];lista.splice(pos,0,amb);const letras=['a','b','c','d'];const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>¿Cuál es la instrucción ambigua?</strong><div class="tg-prog">${lista.map((t,j)=>letras[j]+') '+t).join('<br>')}</div><div style="margin-top:0.4rem;font-size:0.85rem;">Letra: <span class="tg-blank">&nbsp;</span> · Corrección exacta: <span class="tg-blank">&nbsp;</span></div><div class="tg-answer">✅ La ambigua es la ${letras[pos]}) «${amb}» — corrígela con cantidades o lugares claros.</div></div>`;out.appendChild(div);}}
// Tipo 3: descomponer un problema grande
let descomponDB=[
  {problema:'Organizar la feria escolar',partes:['Formar las comisiones','Preparar los puestos de comida y juegos','Invitar a las familias']},
  {problema:'Celebrar el Día del Niño',partes:['Planear los juegos y premios','Conseguir la comida y las piñatas','Decorar el aula']},
  {problema:'Hacer el mural de la independencia',partes:['Investigar sobre los próceres','Dibujar el boceto','Pintar el mural por secciones']},
  {problema:'Montar la huerta escolar',partes:['Preparar la tierra','Sembrar las semillas','Organizar los turnos de riego']},
  {problema:'Organizar el campeonato de fútbol',partes:['Inscribir los equipos','Programar los partidos','Conseguir el premio']},
  {problema:'Preparar la clausura del año escolar',partes:['Ensayar los actos','Preparar los diplomas','Decorar el salón']},
  {problema:'Cuidar la limpieza de la escuela',partes:['Organizar los turnos de aseo','Conseguir escobas y basureros','Revisar cada aula el viernes']},
  {problema:'Hacer un periódico mural',partes:['Elegir el tema del mes','Repartir las noticias entre el equipo','Armar y decorar el mural']},
];
function genDescomponTask(out,count){_instrBlock(out,'Instrucción',['Descompón cada problema GRANDE: escribe en tu cuaderno 3 partes pequeñas en las que lo dividirías para resolverlo en equipo.']);const pool=_shuffle([...descomponDB]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>🎪 Problema grande: ${item.problema}.</strong><div style="margin-top:0.4rem;font-size:0.85rem;">Parte 1: <span class="tg-blank">&nbsp;</span><br>Parte 2: <span class="tg-blank">&nbsp;</span><br>Parte 3: <span class="tg-blank">&nbsp;</span></div><div class="tg-answer">✅ Ejemplo de pauta: ${item.partes.map((p,j)=>(j+1)+'. '+p).join(' · ')} (acepta otras partes lógicas)</div></div>`;out.appendChild(div);}}
// Tipo 4: encontrar el patrón
const patronPools=[['🌽','🫘'],['🔵','🔴','🟡'],['🫓','🥤'],['☀️','🌧️'],['🐔','🐄','🐖'],['⭐','🌙'],['🍌','🥭','🍍']];
function genPatronTask(out,count){_instrBlock(out,'Instrucción',['Observa cada serie: hay un PATRÓN (algo que se repite). Escribe los 2 elementos que siguen.']);for(let i=0;i<count;i++){const pool=patronPools[_rndInt(0,patronPools.length-1)];const unidad=[];const len=Math.min(pool.length,_rndInt(2,3));for(let k=0;k<len;k++)unidad.push(pool[k%pool.length]);const seq=[];for(let r=0;r<3;r++)seq.push(...unidad);const next=[unidad[seq.length%unidad.length],unidad[(seq.length+1)%unidad.length]];const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong style="font-size:1.3rem;letter-spacing:0.2rem;">${seq.join(' ')} …</strong><div style="margin-top:0.4rem;font-size:0.85rem;">¿Qué 2 elementos siguen? <span class="tg-blank">&nbsp;</span> · ¿Cuál es la unidad que se repite? <span class="tg-blank">&nbsp;</span></div><div class="tg-answer">✅ Siguen: ${next.join(' ')} · La unidad que se repite es: ${unidad.join(' ')}</div></div>`;out.appendChild(div);}}
function toggleAns(){ansVisible=!ansVisible;document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none');sfx('click');}

// ===================== SOPA DE LETRAS =====================
// Grids generados y VERIFICADOS por script Node (8 direcciones, incluidas inversas)
let sopaSets=[
  {size:10,grid:[
    ['X','H','R','Q','Y','V','Q','V','G','D'],
    ['A','L','G','O','R','I','T','M','O','R'],
    ['P','P','N','D','X','R','I','C','J','J'],
    ['A','O','R','D','E','N','X','Q','I','N'],
    ['R','E','E','I','S','W','Z','I','O','V'],
    ['T','J','X','Y','S','H','O','R','M','E'],
    ['E','N','A','X','U','G','T','Q','P','I'],
    ['Z','U','C','N','N','A','Z','T','A','G'],
    ['E','G','T','G','P','F','V','N','S','J'],
    ['K','J','A','F','U','Q','V','L','O','H']
  ],words:[
    {w:'ALGORITMO',cells:[[1,0],[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[1,7],[1,8]]},
    {w:'PASO',cells:[[6,8],[7,8],[8,8],[9,8]]},
    {w:'ORDEN',cells:[[3,1],[3,2],[3,3],[3,4],[3,5]]},
    {w:'EXACTA',cells:[[4,2],[5,2],[6,2],[7,2],[8,2],[9,2]]},
    {w:'PATRON',cells:[[8,4],[7,5],[6,6],[5,7],[4,8],[3,9]]},
    {w:'PARTE',cells:[[2,0],[3,0],[4,0],[5,0],[6,0]]}
  ]},
  {size:10,grid:[
    ['J','O','Q','M','Z','P','D','A','W','H'],
    ['G','N','Q','T','S','Q','U','Z','K','C'],
    ['S','W','D','W','R','E','C','E','T','A'],
    ['P','R','O','B','L','E','M','A','R','G'],
    ['R','D','I','V','I','D','I','R','U','W'],
    ['E','H','P','I','Y','S','I','A','U','N'],
    ['L','K','L','B','R','U','K','W','T','U'],
    ['U','N','A','C','R','P','M','O','T','C'],
    ['X','X','N','S','L','O','G','I','C','A'],
    ['E','A','I','C','N','E','U','C','E','S']
  ],words:[
    {w:'PROBLEMA',cells:[[3,0],[3,1],[3,2],[3,3],[3,4],[3,5],[3,6],[3,7]]},
    {w:'RECETA',cells:[[2,4],[2,5],[2,6],[2,7],[2,8],[2,9]]},
    {w:'DIVIDIR',cells:[[4,1],[4,2],[4,3],[4,4],[4,5],[4,6],[4,7]]},
    {w:'SECUENCIA',cells:[[9,9],[9,8],[9,7],[9,6],[9,5],[9,4],[9,3],[9,2],[9,1]]},
    {w:'LOGICA',cells:[[8,4],[8,5],[8,6],[8,7],[8,8],[8,9]]},
    {w:'PLAN',cells:[[5,2],[6,2],[7,2],[8,2]]}
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
  if(xp<2){showToast('⚠️ Necesitas al menos 2 XP para usar la linterna.');return;}
  const set=sopaSets[currentSopaSetIdx];
  const pend=set.words.filter(wObj=>!sopaFoundWords.has(wObj.w));
  if(pend.length===0){showToast('🎉 ¡Ya encontraste todas las palabras!');return;}
  pts(-2);
  const cells=[];
  pend.forEach(wObj=>wObj.cells.forEach(([r,c])=>{const el=document.querySelector(`#sopaGrid [data-row="${r}"][data-col="${c}"]`);if(el){el.classList.add('sopa-peek');cells.push(el);}}));
  showToast('🔦 ¡Linterna encendida 3 segundos! (-2 XP)');
  setTimeout(()=>cells.forEach(el=>el.classList.remove('sopa-peek')),3000);
}
let _sopaResizeTimer=null;
window.addEventListener('resize',()=>{clearTimeout(_sopaResizeTimer);_sopaResizeTimer=setTimeout(()=>{if(document.getElementById('s-sopa').classList.contains('active'))buildSopa();},200);});

// ===================== EVALUACIÓN FINAL (CONCEPTUAL) =====================
let evalTFBank=[
  {q:'Un algoritmo es una lista de pasos ordenados para lograr algo.',a:true},
  {q:'«Ponle un poco de sal» es una instrucción exacta.',a:false},
  {q:'«Agrega 2 cucharadas de azúcar» es una instrucción exacta.',a:true},
  {q:'La computadora adivina lo que queremos decir.',a:false},
  {q:'Descomponer es dividir un problema grande en partes pequeñas.',a:true},
  {q:'Un patrón es algo que se repite.',a:true},
  {q:'La abstracción es quedarse solo con lo importante, como hace un mapa.',a:true},
  {q:'El orden de los pasos de un algoritmo no importa.',a:false},
  {q:'La receta de las baleadas es un algoritmo.',a:true},
  {q:'Lavarse los dientes no puede escribirse como un algoritmo.',a:false},
  {q:'Un problema grande se resuelve mejor dividiéndolo en partes.',a:true},
  {q:'La computadora hace exactamente lo que se le dice.',a:true},
  {q:'«Camina por ahí» es una orden que cualquiera ejecuta igual.',a:false},
  {q:'Cada paso de un algoritmo debe empezar con un verbo claro.',a:true},
  {q:'Buscar patrones ahorra trabajo, porque lo que se repite se hace igual.',a:true},
];
let evalMCBank=[
  {q:'¿Qué es un algoritmo?',o:['Pasos ordenados para lograr algo','Un tipo de computadora','Un dibujo bonito','Un problema sin solución'],a:0},
  {q:'¿Cuál de estas instrucciones es EXACTA?',o:['Camina por ahí','Da 3 pasos hacia adelante','Muévete un poco','Ve rápido'],a:1},
  {q:'¿Por qué falla la instrucción «ponle un poco»?',o:['Porque es muy larga','Porque cada quien entiende una cantidad distinta','Porque está en español','Porque tiene números'],a:1},
  {q:'¿Qué hace una computadora con las instrucciones?',o:['Adivina lo que queremos','Elige la que le gusta','Ejecuta exactamente lo que se le dice','Las cambia de orden'],a:2},
  {q:'Descomponer un problema es…',o:['Borrarlo','Hacerlo más grande','Copiarlo','Dividirlo en partes pequeñas'],a:3},
  {q:'¿Qué es un patrón?',o:['Algo que se repite','Un error','Un dibujo','Una computadora'],a:0},
  {q:'La abstracción consiste en…',o:['Escribir todo con detalle','Quedarse solo con lo importante','Hacer un dibujo realista','Repetir los pasos'],a:1},
  {q:'¿Cuál es un algoritmo de tu vida diaria?',o:['El color azul','Una piedra','Lavarse los dientes paso a paso','Un número'],a:2},
  {q:'Para organizar la feria escolar conviene…',o:['Hacer todo a la vez sin plan','Esperar a que se organice sola','Cancelarla','Dividirla en partes: comida, juegos, invitaciones'],a:3},
  {q:'En la receta de la baleada, ¿qué pasa si cambias el orden de los pasos?',o:['El resultado cambia y sale mal','No pasa nada','La baleada se hace sola','Sale más rica'],a:0},
  {q:'¿Cuál de estas instrucciones es AMBIGUA?',o:['Agrega 2 cucharadas de frijoles','Ponle frijoles al gusto','Cuece la tortilla 1 minuto por lado','Corta 3 rodajas de queso'],a:1},
  {q:'Un buen paso de algoritmo empieza con…',o:['Una adivinanza','Un saludo','Un verbo claro (lavar, cortar, pegar)','Un chiste'],a:2},
  {q:'¿Qué parte pequeña pertenece al problema grande «montar la huerta escolar»?',o:['Comprar un televisor','Pintar la bandera','Hacer un fresco','Preparar la tierra'],a:3},
  {q:'Un mapa es un ejemplo de abstracción porque…',o:['Muestra solo lo importante del lugar','Muestra cada piedra del camino','Es de papel','Tiene colores'],a:0},
  {q:'¿Qué es el pensamiento computacional?',o:['Usar la computadora todo el día','Pensar en pasos ordenados, partes y patrones antes de actuar','Memorizar números','Escribir rápido'],a:1},
];
let evalCPBank=[
  {q:'Los pasos ordenados para lograr algo forman un ___.',a:'algoritmo'},
  {q:'Una instrucción que todos entienden y ejecutan igual es una instrucción ___.',a:'exacta'},
  {q:'«Ponle un poco» es una instrucción ___.',a:'ambigua'},
  {q:'Dividir un problema grande en partes pequeñas se llama ___.',a:'descomponer'},
  {q:'Algo que se repite una y otra vez es un ___.',a:'patrón'},
  {q:'Quedarse solo con lo importante, como hace un mapa, se llama ___.',a:'abstracción'},
  {q:'La computadora hace ___ lo que se le dice.',a:'exactamente'},
  {q:'En un algoritmo importa mucho el ___ de los pasos.',a:'orden'},
  {q:'Una lista de pasos en orden es una ___.',a:'secuencia'},
  {q:'Cada paso de un algoritmo empieza con un ___ claro.',a:'verbo'},
  {q:'Un problema grande se vence dividiéndolo en ___ pequeñas.',a:'partes'},
  {q:'Un ___ muestra solo lo importante de un lugar: es una abstracción.',a:'mapa'},
  {q:'El pensamiento ___ nos ayuda a resolver problemas como programadores.',a:'computacional'},
  {q:'Seguir una ___ de cocina es ejecutar un algoritmo.',a:'receta'},
  {q:'La máquina que ejecuta instrucciones sin adivinar nada es la ___.',a:'computadora'},
];
let evalPRBank=[
  {term:'Algoritmo',def:'Pasos ordenados para lograr una tarea'},
  {term:'Instrucción exacta',def:'Orden que todos ejecutan igual'},
  {term:'Instrucción ambigua',def:'Orden confusa que cada quien entiende distinto'},
  {term:'Secuencia',def:'Lista de pasos en orden'},
  {term:'Descomponer',def:'Dividir un problema grande en partes pequeñas'},
  {term:'Patrón',def:'Algo que se repite una y otra vez'},
  {term:'Abstracción',def:'Quedarse solo con lo importante'},
  {term:'Paso',def:'Cada acción del algoritmo; empieza con un verbo'},
  {term:'Problema grande',def:'Tarea enorme que se vence por partes'},
  {term:'Parte pequeña',def:'Pedazo manejable de un problema'},
  {term:'Computadora',def:'Hace exactamente lo que se le dice'},
  {term:'Orden',def:'Posición de los pasos; cambiarlo cambia el resultado'},
  {term:'Receta',def:'Algoritmo de cocina, como el de las baleadas'},
  {term:'Mapa',def:'Abstracción de un lugar: solo lo importante'},
  {term:'Pensamiento computacional',def:'Pensar en pasos, partes y patrones'},
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

function genEval(){sfx('click');_evalFormaSelector(); const _selF = document.getElementById('evalFormaSel'); if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10))); const cf = evalFormNum; const rng = _evalRng(cf); window._currentEvalForm=cf;evalFormNum = (evalFormNum % EVAL_FORMAS) + 1; _evalFormaSelector();saveProgress();document.getElementById('eval-screen-title').textContent=`🎓 Evaluación Final · Forma ${cf} · El Pensamiento Computacional`;evalAnsVisible=false;const out=document.getElementById('evalOut');out.innerHTML='';const bar=document.createElement('div');bar.className='eval-score-bar';bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje · 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25 pts</span><span class="eval-score-pill esp-tf">V/F 25 pts</span><span class="eval-score-pill esp-mc">Selección 25 pts</span><span class="eval-score-pill esp-pr">Pareados 25 pts</span></div>`;out.appendChild(bar);const cpItems=_pickF(evalCPBank,5, rng);const s1=document.createElement('div');s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';cpItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='cp';d.dataset.evalIndex=i;const qHtml=item.q.replace('___',`<input class="eval-cp-input" type="text" data-cp="${i}" autocomplete="off">`);d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbCp${i}" aria-live="polite"></div>`;s1.appendChild(d);});out.appendChild(s1);const tfItems=_pickF(evalTFBank,5, rng);const s2=document.createElement('div');s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';tfItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='tf';d.dataset.evalIndex=i;d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="true"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="false"> Falso</label></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbTf${i}" aria-live="polite"></div>`;s2.appendChild(d);});out.appendChild(s2);const mcItems=_pickF(evalMCBank,5, rng);const s3=document.createElement('div');s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';mcItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='mc';d.dataset.evalIndex=i;const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${'abcd'[oi]}) ${op}</label>`).join('');d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${'abcd'[item.a]}) ${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbMc${i}" aria-live="polite"></div>`;s3.appendChild(d);});out.appendChild(s3);const prItems=_pickF(evalPRBank,5, rng);let shuffledDefs=_shuffleF(prItems, rng);let _prTries=0;while(shuffledDefs.some((df,ix)=>df.def===prItems[ix].def)&&_prTries<20){shuffledDefs=_shuffleF(shuffledDefs, rng);_prTries++;}const letters=['A','B','C','D','E'];const s4=document.createElement('div');s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';const matchCard=document.createElement('div');matchCard.className='eval-item';let colLeft='<div class="eval-match-col"><h4>📌 Términos</h4>';prItems.forEach((item,i)=>{colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> <select class="eval-match-select" data-pr="${i}" aria-label="Respuesta pareada ${i+16}"><option value="">—</option>${letters.map(l=>`<option value="${l}">${l}</option>`).join('')}</select> ${item.term}</div>`;});colLeft+='</div>';let colRight='<div class="eval-match-col"><h4>🔑 Definiciones</h4>';shuffledDefs.forEach((item,i)=>{colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`;});colRight+='</div>';const ansKey=prItems.map((item,i)=>{const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)];return`${i+16}→${letter}`;}).join(' · ');matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div><div class="eval-item-feedback" id="evalFbPr" aria-live="polite"></div>`;s4.appendChild(matchCard);out.appendChild(s4);window._evalPrintData={tf:tfItems,mc:mcItems,cp:cpItems,pr:{terms:prItems,shuffledDefs,letters}};const autoPanel=document.createElement('div');autoPanel.id='evalAutoResult';autoPanel.className='eval-auto-result';autoPanel.innerHTML='<strong>🧮 Evaluación interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato original sin respuestas digitadas.';out.appendChild(autoPanel);fin('s-evaluacion');}
function toggleEvalAns(){evalAnsVisible=!evalAnsVisible;document.querySelectorAll('#evalOut .eval-answer').forEach(el=>el.style.display=evalAnsVisible?'block':'none');sfx('click');}
function normalizeEvalAnswer(v){return(v||'').toString().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\s+/g,' ').replace(/[()«»]/g,'').trim();}
function isCpCorrect(student,expected){const s=normalizeEvalAnswer(student);const e=normalizeEvalAnswer(expected);if(!s)return false;const variants=new Set([e]);if(e.includes(' '))e.split(' ').forEach(x=>x&&variants.add(x));return variants.has(s)||e.replace(/[^a-z0-9]/g,'')===s.replace(/[^a-z0-9]/g,'');}
function setEvalFeedback(id,ok,msg){const el=document.getElementById(id);if(!el)return;el.textContent=msg;el.className='eval-item-feedback '+(ok?'eval-ok':'eval-no');}
function gradeEval(){if(!window._evalPrintData){showToast('⚠️ Genera una evaluación primero');return;}sfx('click');const d=window._evalPrintData;let total=0;const detail={cp:0,tf:0,mc:0,pr:0};d.cp.forEach((it,i)=>{const input=document.querySelector(`[data-cp="${i}"]`);const ok=isCpCorrect(input?input.value:'',it.a);if(input){input.classList.toggle('eval-input-ok',ok);input.classList.toggle('eval-input-no',!ok);}if(ok){detail.cp++;total+=5;}setEvalFeedback('evalFbCp'+i,ok,ok?'Correcto. +5 pts':'Revisar. Respuesta esperada: '+it.a);});d.tf.forEach((it,i)=>{const selected=document.querySelector(`input[name="tf${i}"]:checked`);const ok=!!selected&&(selected.value==='true')===it.a;if(ok){detail.tf++;total+=5;}setEvalFeedback('evalFbTf'+i,ok,ok?'Correcto. +5 pts':'Revisar. Respuesta esperada: '+(it.a?'Verdadero':'Falso'));});d.mc.forEach((it,i)=>{const selected=document.querySelector(`input[name="mc${i}"]:checked`);const ok=!!selected&&Number(selected.value)===it.a;if(ok){detail.mc++;total+=5;}setEvalFeedback('evalFbMc'+i,ok,ok?'Correcto. +5 pts':'Revisar. Respuesta esperada: '+it.o[it.a]);});const expectedLetters=d.pr.terms.map(it=>d.pr.letters[d.pr.shuffledDefs.findIndex(df=>df.def===it.def)]);expectedLetters.forEach((letter,i)=>{const sel=document.querySelector(`[data-pr="${i}"]`);const ok=!!sel&&sel.value===letter;if(sel){sel.classList.toggle('eval-input-ok',ok);sel.classList.toggle('eval-input-no',!ok);}if(ok){detail.pr++;total+=5;}});const prMsg=`Pareados: ${detail.pr}/5 correctos. ${detail.pr===5?'Excelente. +25 pts':'Clave: '+expectedLetters.map((l,i)=>(i+16)+'→'+l).join(' · ')}`;setEvalFeedback('evalFbPr',detail.pr===5,prMsg);const result=document.getElementById('evalAutoResult');if(result){result.className='eval-auto-result '+(total>=70?'eval-auto-pass':'eval-auto-risk');result.innerHTML=`<strong>Resultado automático: ${total}/100 puntos</strong><br><span>Completar: ${detail.cp*5}/25 · V/F: ${detail.tf*5}/25 · Selección: ${detail.mc*5}/25 · Pareados: ${detail.pr*5}/25</span><br><em>Este resultado es solo para revisión en pantalla; la impresión conserva el formato limpio para papel.</em>`;}if(total>=70){pts(8);showToast('🎯 Evaluación calificada: '+total+'/100');}else showToast('🧮 Evaluación calificada: '+total+'/100. Revisa las respuestas marcadas.');}
function printEval(){if(!window._evalPrintData){showToast('⚠️ Genera una evaluación primero');return;}sfx('click');const forma=window._currentEvalForm||1;const d=window._evalPrintData;let s1=`<div class="sec-title"><span>I. Completar el espacio</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div>`;d.cp.forEach((it,i)=>{const q=it.q.replace('___','<span class="cp-blank"></span>');s1+=`<div class="cp-row"><span class="qn">${i+1}.</span><span class="cp-text">${q}</span></div>`;});let s2=`<div class="sec-title"><span>II. Verdadero o Falso</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div>`;d.tf.forEach((it,i)=>{s2+=`<div class="tf-row"><span class="qn">${i+6}.</span><span class="tf-blank"></span><span class="tf-text">${it.q}</span></div>`;});let s3=`<div class="sec-title"><span>III. Selección Múltiple</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div><div class="mc-grid">`;d.mc.forEach((it,i)=>{const opts=it.o.map((op,oi)=>`<label class="mc-opt"><input type="radio" name="mcp${i}"> ${'abcd'[oi]}) ${op}</label>`).join('');s3+=`<div class="mc-item"><div class="mc-q"><span class="qn">${i+11}.</span><span>${it.q}</span></div><div class="mc-opts">${opts}</div></div>`;});s3+=`</div>`;let colL='<div class="pr-col"><div class="pr-head">📌 Términos</div>';d.pr.terms.forEach((it,i)=>{colL+=`<div class="pr-item"><span class="pr-num">${i+16}.</span><span class="pr-line"></span>${it.term}</div>`;});colL+='</div>';let colR='<div class="pr-col"><div class="pr-head">🔑 Definiciones</div>';d.pr.shuffledDefs.forEach((it,i)=>{colR+=`<div class="pr-item"><span class="pr-num">${d.pr.letters[i]}.</span>${it.def}</div>`;});colR+='</div>';let s4=`<div class="pr-section"><div class="sec-title"><span>IV. Términos Pareados</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div><div class="pr-grid">${colL}${colR}</div></div>`;let pR='';pR+=`<div class="p-sec"><div class="p-ttl">I. Completar</div><table class="p-tbl">`;d.cp.forEach((it,i)=>{pR+=`<tr><td class="pn">${i+1}.</td><td class="pa">${it.a}</td></tr>`;});pR+=`</table></div><div class="p-sec"><div class="p-ttl">II. V o F</div><table class="p-tbl">`;d.tf.forEach((it,i)=>{pR+=`<tr><td class="pn">${i+6}.</td><td class="pa">${it.a?'V':'F'}</td></tr>`;});pR+=`</table></div><div class="p-sec"><div class="p-ttl">III. Selección</div><table class="p-tbl">`;d.mc.forEach((it,i)=>{pR+=`<tr><td class="pn">${i+11}.</td><td class="pa">${'abcd'[it.a]}) ${it.o[it.a]}</td></tr>`;});pR+=`</table></div><div class="p-sec"><div class="p-ttl">IV. Pareados</div><table class="p-tbl">`;d.pr.terms.forEach((it,i)=>{const l=d.pr.letters[d.pr.shuffledDefs.findIndex(df=>df.def===it.def)];pR+=`<tr><td class="pn">${i+16}.</td><td class="pa">${i+16}→${l}</td></tr>`;});pR+=`</table></div>`;
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación El Pensamiento Computacional · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.12rem 0.4rem;margin:0.22rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #0e7490;background:#ecfeff;color:#0e7490;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#0e7490;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #0e7490;height:12px;}.obt-pct{white-space:nowrap;}.qn{font-weight:700;min-width:22px;flex-shrink:0;}.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:40px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.18rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.14rem 0.35rem;margin-bottom:0.1rem;break-inside:avoid;page-break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.3;display:flex;gap:0.28rem;margin-bottom:0.07rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.1rem 0.5rem;}.mc-opts{display:grid;grid-template-columns:repeat(2,1fr);gap:0.04rem 0.15rem;margin-left:0.8rem;}.mc-opt{font-size:9pt;display:flex;align-items:center;gap:0.15rem;}.mc-opt input{width:10px;height:10px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{margin-top:0.1rem;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.08rem 0.4rem;margin-top:0.08rem;}.pr-head{font-size:9pt;font-weight:700;color:#555;margin-bottom:0.1rem;}.pr-item{font-size:10.5pt;padding:0.1rem 0.28rem;background:#ecfeff;border-radius:3px;margin-bottom:0.07rem;display:flex;align-items:center;gap:0.2rem;line-height:1.2;break-inside:avoid;page-break-inside:avoid;}.pr-num{font-weight:700;color:#0e7490;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.22rem;padding:0.15rem 0;page-break-before:avoid;break-before:avoid;color:#0e7490;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #0e7490;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#555;}.pa{color:#007a00;font-weight:600;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · El Pensamiento Computacional · Educación Básica · Programación</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Evaluación Final · El Pensamiento Computacional · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u · Programación · Educación Básica</div></div><div class="p-grid">${pR}</div>
  ${zgBlock}</div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("evalPage",252,0.55,1.45);fit("pautaPage",252,0.55,1.3);})();<\/script></body></html>`;const win=window.open('','_blank','');if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}win.document.write(typeof METAS_TR==='function'?METAS_TR(doc):doc);win.document.close();setTimeout(()=>win.print(),400);}

// ===================== PRUEBA OPERATIVA (patrón robot-mensajero, sin cuadrículas) =====================
function evalSwitchMode(mode){
  sfx('click');
  const cWrap=document.getElementById('evalConceptWrap'),oWrap=document.getElementById('evalOpWrap');
  const cBtn=document.getElementById('evalModeBtnConcept'),oBtn=document.getElementById('evalModeBtnOp');
  if(mode==='op'){
    cWrap.style.display='none';oWrap.style.display='block';
    cBtn.classList.remove('active');cBtn.setAttribute('aria-selected','false');
    oBtn.classList.add('active');oBtn.setAttribute('aria-selected','true');
    if(!window._evalOpData)genEvalOp();
  }else{
    oWrap.style.display='none';cWrap.style.display='block';
    oBtn.classList.remove('active');oBtn.setAttribute('aria-selected','false');
    cBtn.classList.add('active');cBtn.setAttribute('aria-selected','true');
  }
}

// ---- Helpers deterministas (siempre sembrados con _evalRng(100000+forma)) ----
let _opRnd = Math.random;
function _opRint(min, max) { return Math.floor(_opRnd() * (max - min + 1)) + min; }
// Permutación barajada SIN quedar en el orden original (para «ordena el algoritmo»)
function _ordShuffleIdx(n, rng) { const idx = Array.from({ length: n }, (_, i) => i); let d = _shuffleF(idx, rng); let t = 0; while (d.every((v, i) => v === i) && t < 15) { d = _shuffleF(idx, rng); t++; } return d; }

// I. Ordena el algoritmo (5 × 4 = 20 pts)
let opOrdenBank=[
  {tarea:'Hacer una baleada',pasos:['Amasar la harina','Cocer la tortilla en el comal','Untar los frijoles','Doblarla y servirla']},
  {tarea:'Lavarse los dientes',pasos:['Poner pasta en el cepillo','Cepillar arriba y abajo','Enjuagar la boca','Guardar el cepillo']},
  {tarea:'Izar la bandera el lunes cívico',pasos:['Formar filas en el patio','Amarrar la bandera a la cuerda','Izarla con el himno','Hacer el saludo']},
  {tarea:'Sembrar un frijol en un vaso',pasos:['Poner algodón húmedo en el vaso','Colocar el frijol','Ponerlo cerca de la luz','Regarlo cada día']},
  {tarea:'Hacer un fresco de nance',pasos:['Lavar los nances','Machacarlos con agua','Colar la mezcla','Agregar azúcar y hielo','Servir el fresco']},
  {tarea:'Prepararse para venir a la escuela',pasos:['Levantarse temprano','Bañarse y vestirse','Desayunar','Revisar la mochila','Salir a tiempo']},
  {tarea:'Hacer la tarea',pasos:['Sacar el cuaderno','Leer la instrucción','Resolver los ejercicios','Revisar las respuestas']},
  {tarea:'Alimentar a las gallinas',pasos:['Llenar el guacal con maíz','Abrir el gallinero','Regar el maíz en el suelo','Cambiar el agua del bebedero']},
  {tarea:'Enviar una carta',pasos:['Escribir la carta','Meterla en el sobre','Escribir el nombre del destinatario','Entregarla al correo']},
  {tarea:'Hacer tortillas de maíz',pasos:['Mezclar la masa','Hacer las bolitas','Palmear la tortilla','Cocerla en el comal','Guardarlas en la servilleta']},
];
function genOrdenaItems(){
  return _pickF(opOrdenBank,5,_opRnd).map(t=>{
    const perm=_ordShuffleIdx(t.pasos.length,_opRnd);
    const display=perm.map(j=>t.pasos[j]);
    const ans=t.pasos.map((_,j)=>perm.indexOf(j)+1).join('-');
    return{tarea:t.tarea,pasos:t.pasos,display,ans,n:t.pasos.length};
  });
}
function _isOrdOk(student,ans){const s=((student||'').match(/\d/g)||[]).join('');return !!s&&s===ans.replace(/[^\d]/g,'');}

// II. ¿Exacta o ambigua? (5 × 2 = 10 pts)
let opEABank=[
  {txt:'Da 3 pasos hacia adelante',a:'E'},
  {txt:'Agrega 2 cucharadas de azúcar',a:'E'},
  {txt:'Lee las páginas 12 a 15 del libro',a:'E'},
  {txt:'Recorta un cuadrado de 10 cm por lado',a:'E'},
  {txt:'Guarda 5 lempiras cada lunes',a:'E'},
  {txt:'Escribe tu nombre en la esquina superior derecha',a:'E'},
  {txt:'Camina 2 cuadras y dobla a la derecha',a:'E'},
  {txt:'Llena el vaso hasta la línea marcada',a:'E'},
  {txt:'Corta 3 rodajas de queso',a:'E'},
  {txt:'Ponle un poco de sal',a:'A'},
  {txt:'Camina por ahí',a:'A'},
  {txt:'Hazlo bonito',a:'A'},
  {txt:'Trae varias cosas',a:'A'},
  {txt:'Muévete un poco',a:'A'},
  {txt:'Espera un ratito',a:'A'},
  {txt:'Dibuja algo grande',a:'A'},
  {txt:'Ve rápido',a:'A'},
  {txt:'Échale bastante agua',a:'A'},
];
function genEAItems(){return _pickF(opEABank,5,_opRnd);}

// III. Completa el paso que falta (5 × 4 = 20 pts, razonamiento inverso con opciones)
let opFaltaBank=[
  {tarea:'Hacer una baleada',pasos:['Amasar la harina','Cocer la tortilla','___','Doblar la baleada y servirla'],correcta:'Untar los frijoles y el queso',distractores:['Lavar el comal','Guardar la harina','Comerse la baleada']},
  {tarea:'Lavarse las manos',pasos:['Abrir el chorro','Mojarse las manos','___','Enjuagar y secarse'],correcta:'Frotar con jabón',distractores:['Cerrar los ojos','Peinarse','Secar el piso']},
  {tarea:'Sembrar un frijol',pasos:['Poner algodón húmedo en el vaso','___','Dejar el vaso con luz','Regar cada día'],correcta:'Colocar el frijol sobre el algodón',distractores:['Comerse el frijol','Tapar el vaso con piedras','Esconder el vaso']},
  {tarea:'Hacer un fresco de nance',pasos:['Lavar los nances','Machacarlos con agua','___','Agregar azúcar y hielo'],correcta:'Colar la mezcla',distractores:['Congelar los nances enteros','Botar el agua','Pintar el vaso']},
  {tarea:'Izar la bandera',pasos:['Formar filas','___','Izar la bandera con el himno','Hacer el saludo'],correcta:'Amarrar la bandera a la cuerda',distractores:['Doblar la bandera y guardarla','Aplaudir bien fuerte','Subirse al asta']},
  {tarea:'Venir a la escuela',pasos:['Levantarse temprano','Bañarse y vestirse','___','Salir de la casa'],correcta:'Desayunar y revisar la mochila',distractores:['Acostarse otra vez','Ver televisión','Quitarse los zapatos']},
  {tarea:'Hacer la tarea',pasos:['Sacar el cuaderno','Leer la instrucción','Resolver los ejercicios','___'],correcta:'Revisar las respuestas',distractores:['Borrar todo','Esconder el cuaderno','Arrancar la hoja']},
  {tarea:'Enviar una carta',pasos:['Escribir la carta','___','Escribir el destinatario en el sobre','Llevarla al correo'],correcta:'Meterla en el sobre',distractores:['Quemarla','Mojarla con agua','Dibujarle flores']},
];
function genFaltaItems(){
  return _pickF(opFaltaBank,5,_opRnd).map(t=>{
    const opts=_shuffleF([t.correcta,...t.distractores],_opRnd);
    return{tarea:t.tarea,pasos:t.pasos,opts,ans:opts.indexOf(t.correcta)};
  });
}

// IV. Problemas de la vida real (3 × 10 = 30 pts): algoritmos de tareas hondureñas.
let opVidaBank=[
  {tema:'Preparar una baleada para la merienda',pasos:['Amasar la harina con agua','Hacer la tortilla y cocerla en el comal','Untar frijoles y queso','Doblarla y servirla']},
  {tema:'Lavarse las manos antes de la merienda',pasos:['Abrir el chorro','Mojarse las manos','Frotar con jabón por 20 segundos','Enjuagar bien','Cerrar el chorro y secarse']},
  {tema:'Izar la bandera el lunes cívico',pasos:['Formar filas en el patio','Amarrar la bandera a la cuerda','Izarla despacio mientras suena el himno','Hacer el saludo en silencio','Volver al aula en orden']},
  {tema:'Hacer un fresco de nance',pasos:['Lavar los nances','Machacarlos con un poco de agua','Colar la mezcla','Agregar agua, azúcar y hielo','Servir el fresco']},
  {tema:'Alimentar a las gallinas',pasos:['Llenar el guacal con maíz','Abrir el gallinero','Regar el maíz en el suelo','Cambiar el agua del bebedero']},
  {tema:'Alistar la mochila para mañana',pasos:['Revisar el horario de clases','Guardar los cuadernos del día','Meter el lápiz y el borrador','Cerrar la mochila y dejarla lista']},
  {tema:'Barrer el aula el viernes',pasos:['Subir las sillas a los pupitres','Barrer de adentro hacia la puerta','Recoger la basura con la pala','Botarla en el basurero']},
  {tema:'Sembrar un frijol en un vaso',pasos:['Poner algodón húmedo en el vaso','Colocar el frijol sobre el algodón','Dejar el vaso cerca de la luz','Regarlo con una cucharada de agua cada día']},
];
let OP_VIDA_RUBRICA='Orden lógico de inicio a fin (4 pts) · Pasos completos, sin saltarse ninguno esencial (4 pts) · Cada paso es una instrucción exacta que empieza con un verbo (2 pts)';
function genVidaItems(){return _pickF(opVidaBank,3,_opRnd);}

// V. Retos de olimpiada (10 + 10 = 20 pts)
// (a) Descompón el problema grande en el orden correcto
let opDescompBank=[
  {problema:'Organizar la feria escolar',partes:['Formar las comisiones de trabajo','Preparar los puestos de comida y juegos','Invitar a las familias','Celebrar la feria y limpiar al final']},
  {problema:'Celebrar el Día del Niño',partes:['Planear los juegos y premios','Conseguir la comida y las piñatas','Decorar el aula','Celebrar la fiesta y ordenar el aula']},
  {problema:'Hacer el mural de la independencia',partes:['Investigar sobre los próceres','Dibujar el boceto del mural','Pintar el mural por secciones','Presentar el mural a la escuela']},
  {problema:'Montar la huerta escolar',partes:['Preparar la tierra','Sembrar las semillas','Organizar los turnos de riego','Cosechar y repartir']},
  {problema:'Organizar el campeonato de fútbol',partes:['Inscribir a los equipos','Programar los partidos','Conseguir los premios','Jugar la final y premiar']},
  {problema:'Preparar la clausura del año',partes:['Ensayar los actos y bailes','Preparar los diplomas','Decorar el salón','Celebrar la clausura']},
];
function genRetoDescomp(){
  const item=_pickF(opDescompBank,1,_opRnd)[0];
  const perm=_ordShuffleIdx(item.partes.length,_opRnd);
  const display=perm.map(j=>item.partes[j]);
  const ans=item.partes.map((_,j)=>perm.indexOf(j)+1).join('-');
  return{problema:item.problema,partes:item.partes,display,ans};
}
// (b) Detective del paso inútil o ambiguo
let opDetectiveBank=[
  {tarea:'Lavarse los dientes',pasos:['Poner pasta en el cepillo','Cepillar arriba y abajo','Enjuagar la boca','Guardar el cepillo'],malo:'Hacer algo con el agua',tipo:'A'},
  {tarea:'Hacer una baleada',pasos:['Amasar la harina','Cocer la tortilla','Untar los frijoles','Doblarla y servirla'],malo:'Patear una pelota',tipo:'I'},
  {tarea:'Izar la bandera',pasos:['Formar filas','Amarrar la bandera','Izarla con el himno','Hacer el saludo'],malo:'Súbela como sea',tipo:'A'},
  {tarea:'Sembrar un frijol',pasos:['Poner algodón húmedo','Colocar el frijol','Dejarlo con luz','Regarlo cada día'],malo:'Ver televisión un rato',tipo:'I'},
  {tarea:'Hacer un fresco de nance',pasos:['Lavar los nances','Machacarlos con agua','Colar la mezcla','Servir con hielo'],malo:'Ponle azúcar al gusto de quien pase',tipo:'A'},
  {tarea:'Hacer la tarea',pasos:['Sacar el cuaderno','Leer la instrucción','Resolver los ejercicios','Revisar las respuestas'],malo:'Esconder el lápiz del compañero',tipo:'I'},
  {tarea:'Barrer el aula',pasos:['Subir las sillas','Barrer de adentro hacia la puerta','Recoger la basura con la pala','Botarla en el basurero'],malo:'Barrer más o menos donde se vea sucio',tipo:'A'},
  {tarea:'Alimentar a las gallinas',pasos:['Llenar el guacal con maíz','Abrir el gallinero','Regar el maíz','Cambiar el agua'],malo:'Contar las nubes del cielo',tipo:'I'},
];
function genRetoDetective(){
  const item=_pickF(opDetectiveBank,1,_opRnd)[0];
  const pos=_opRint(1,item.pasos.length-1);
  const lineas=[...item.pasos];lineas.splice(pos,0,item.malo);
  return{tarea:item.tarea,lineas,linea:pos+1,tipo:item.tipo,malo:item.malo};
}
let OP_TIPO_TXT={A:'Es ambiguo (no es exacto)',I:'Es inútil (no ayuda a la tarea)'};

function genEvalOp() {
  sfx('click');
  _injectFormaSel('genEvalOp', 'evalOpFormaSel', evalOpFormNum, function (v) { evalOpFormNum = v; });
  const _sO = document.getElementById('evalOpFormaSel');
  if (_sO && parseInt(_sO.value, 10)) evalOpFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sO.value, 10)));
  const cf = evalOpFormNum; window._currentEvalOpForm = cf; _opRnd = _evalRng(100000 + cf); /* la Forma cf siembra TODO el azar de esta prueba */
  evalOpFormNum = (evalOpFormNum % EVAL_FORMAS) + 1;
  _injectFormaSel('genEvalOp', 'evalOpFormaSel', evalOpFormNum, function (v) { evalOpFormNum = v; });
  saveProgress();
  document.getElementById('evalop-screen-title').textContent = `🧠 Prueba Operativa — Forma ${cf} · El Pensamiento Computacional`;
  evalOpAnsVisible = false;
  const out = document.getElementById('evalOpOut'); out.innerHTML = '';

  const ordItems = genOrdenaItems();
  const eaItems = genEAItems();
  const cplItems = genFaltaItems();
  const vidaItems = genVidaItems();
  const retoD = genRetoDescomp();
  const retoP = genRetoDetective();

  const s1 = document.createElement('div');
  s1.innerHTML = `<div class="eval-section-title">I. Ordena el algoritmo <span class="eval-pts">20 pts · 4 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel básico. Los pasos están numerados pero DESORDENADOS. Escribe el orden correcto con los números separados por guiones (p. ej. 2-4-1-3).</p>`;
  ordItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="eval-q"><span class="eval-num">${i + 1}</span><span class="eval-q-text">Algoritmo para: <strong>${it.tarea}</strong>.</span></div><div class="op-prog">${it.display.map((p, j) => (j + 1) + '. ' + p).join('<br>')}</div><div class="opx-row" style="margin-left:1.7rem;"><span style="font-size:0.82rem;color:var(--gray);">Orden correcto:</span><input class="eval-cp-input" type="text" data-ord="${i}" autocomplete="off" placeholder="p. ej. 2-4-1-3" style="min-width:120px;max-width:160px;"></div><div class="eval-answer">${it.ans} → ${it.pasos.map((p, j) => (j + 1) + 'º ' + p).join(' · ')}</div><div class="eval-item-feedback" id="evalFbOrd${i}" aria-live="polite"></div>`;
    s1.appendChild(d);
  });
  out.appendChild(s1);

  const s2 = document.createElement('div');
  s2.innerHTML = `<div class="eval-section-title">II. ¿Exacta o ambigua? <span class="eval-pts">10 pts · 2 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Agilidad. ¿Una persona-robot podría ejecutar la instrucción tal como está escrita?</p>`;
  eaItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="eval-q"><span class="eval-num">${i + 1}</span><span class="eval-q-text">«${it.txt}»</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="opEA${i}" value="E"> ✅ Exacta</label><label class="eval-tf-opt"><input type="radio" name="opEA${i}" value="A"> 🌫️ Ambigua</label></div><div class="eval-answer">${it.a === 'E' ? 'Exacta' : 'Ambigua'}</div><div class="eval-item-feedback" id="evalFbEa${i}" aria-live="polite"></div>`;
    s2.appendChild(d);
  });
  out.appendChild(s2);

  const s3 = document.createElement('div');
  s3.innerHTML = `<div class="eval-section-title">III. Completa el paso que falta <span class="eval-pts">20 pts · 4 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel intermedio. Piensa al revés: al algoritmo le falta UN paso (el espacio ___). Elige cuál es.</p>`;
  cplItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    const optsHtml = it.opts.map((op, oi) => `<label class="eval-mc-opt"><input type="radio" name="opC${i}" value="${oi}"> ${'abcd'[oi]}) ${op}</label>`).join('');
    d.innerHTML = `<div class="eval-q"><span class="eval-num">${i + 1}</span><span class="eval-q-text">Algoritmo para: <strong>${it.tarea}</strong>.</span></div><div class="op-prog">${it.pasos.map((p, j) => (j + 1) + '. ' + p).join('<br>')}</div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${'abcd'[it.ans]}) ${it.opts[it.ans]}</div><div class="eval-item-feedback" id="evalFbCpl${i}" aria-live="polite"></div>`;
    s3.appendChild(d);
  });
  out.appendChild(s3);

  const s4 = document.createElement('div');
  s4.innerHTML = `<div class="eval-section-title">IV. Problemas de la vida real <span class="eval-pts">30 pts · 10 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel avanzado. Escribe el ALGORITMO (4 a 6 pasos numerados, cada uno con un verbo claro). Compara con la pauta y anota tu puntaje de 0 a 10.</p>`;
  vidaItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="eval-q"><span class="eval-num">${i + 1}</span><span class="eval-q-text">Escribe el algoritmo para: <strong>${it.tema}</strong>.</span></div><textarea class="op-vida-ta" aria-label="Algoritmo para ${it.tema}" placeholder="1. …&#10;2. …&#10;3. …&#10;4. …"></textarea><div class="op-pauta-rub"><strong>Pasos clave:</strong> ${it.pasos.map((p, j) => (j + 1) + '. ' + p).join(' · ')}<br><strong>Rúbrica (10 pts):</strong> ${OP_VIDA_RUBRICA}</div><div class="op-vida-score"><label for="opVida${i}">Compara con la pauta y anota tu puntaje:</label><input type="number" id="opVida${i}" data-vida="${i}" min="0" max="10" value="0"> <span>de 10 pts</span></div><div class="eval-item-feedback" id="evalFbVida${i}" aria-live="polite"></div>`;
    s4.appendChild(d);
  });
  out.appendChild(s4);

  const s5 = document.createElement('div');
  s5.innerHTML = '<div class="eval-section-title">V. Retos de olimpiada <span class="eval-pts">20 pts · 10 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Desafío. Piensa como programador: descompón el problema grande y atrapa el paso malo.</p>';
  const dD = document.createElement('div'); dD.className = 'eval-item eval-auto-item';
  dD.innerHTML = `<div class="eval-q"><span class="eval-num">1</span><span class="eval-q-text">🧩 <strong>Descompón el problema:</strong> «${retoD.problema}» se dividió en 4 partes, pero quedaron DESORDENADAS. Escribe el orden lógico con los números (p. ej. 2-4-1-3).</span></div><div class="op-prog">${retoD.display.map((p, j) => (j + 1) + '. ' + p).join('<br>')}</div><div class="opx-row" style="margin-left:1.7rem;"><span style="font-size:0.82rem;color:var(--gray);">Orden lógico:</span><input class="eval-cp-input" type="text" data-rd="0" autocomplete="off" placeholder="p. ej. 2-4-1-3" style="min-width:120px;max-width:160px;"></div><div class="eval-answer">${retoD.ans} → ${retoD.partes.map((p, j) => (j + 1) + 'º ' + p).join(' · ')}</div><div class="eval-item-feedback" id="evalFbRd" aria-live="polite"></div>`;
  s5.appendChild(dD);
  const dP = document.createElement('div'); dP.className = 'eval-item eval-auto-item';
  const selTipo = `<select class="eval-match-select" data-dt="0" aria-label="Qué tiene de malo el paso"><option value="">—</option><option value="A">${OP_TIPO_TXT.A}</option><option value="I">${OP_TIPO_TXT.I}</option></select>`;
  dP.innerHTML = `<div class="eval-q"><span class="eval-num">2</span><span class="eval-q-text">🔎 <strong>Detective del paso malo:</strong> en el algoritmo para <strong>${retoP.tarea}</strong> se coló UN paso que es inútil o ambiguo. Encuéntralo.</span></div><div class="op-prog">${retoP.lineas.map((p, j) => 'Paso ' + (j + 1) + ': ' + p).join('<br>')}</div><div class="opx-row" style="margin-left:1.7rem;"><span style="font-size:0.82rem;color:var(--gray);">Nº del paso malo (5 pts):</span><input class="eval-cp-input" type="text" data-dl="0" autocomplete="off" inputmode="numeric" style="min-width:56px;max-width:70px;"><span style="font-size:0.82rem;color:var(--gray);">¿Qué tiene de malo? (5 pts):</span>${selTipo}</div><div class="eval-answer">Paso ${retoP.linea} («${retoP.malo}») → ${OP_TIPO_TXT[retoP.tipo]}</div><div class="eval-item-feedback" id="evalFbDet" aria-live="polite"></div>`;
  s5.appendChild(dP);
  out.appendChild(s5);

  window._evalOpData = { ordItems, eaItems, cplItems, vidaItems, retoD, retoP };
  const autoPanel = document.createElement('div'); autoPanel.id = 'evalOpAutoResult'; autoPanel.className = 'eval-auto-result';
  autoPanel.innerHTML = '<strong>🧮 Prueba interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato para resolver en papel.';
  out.appendChild(autoPanel);
  fin('s-evaluacion');
}

function toggleEvalOpAns() {
  evalOpAnsVisible = !evalOpAnsVisible;
  document.querySelectorAll('#evalOpOut .eval-answer').forEach(el => el.style.display = evalOpAnsVisible ? 'block' : 'none');
  document.querySelectorAll('#evalOpOut .op-pauta-rub').forEach(el => el.style.display = evalOpAnsVisible ? 'block' : 'none');
  sfx('click');
}
function _isOpNumOk(student, expected) {
  const s = (student || '').toString().trim().replace(',', '.');
  if (!s) return false;
  const sn = parseFloat(s), en = parseFloat(expected);
  return !isNaN(sn) && !isNaN(en) && Math.abs(sn - en) < 1e-6;
}

function gradeEvalOp() {
  if (!window._evalOpData) { showToast('⚠️ Genera una prueba operativa primero'); return; }
  sfx('click');
  const d = window._evalOpData;
  let total = 0; const det = { ord: 0, ea: 0, cpl: 0, vida: 0, reto: 0 };
  // El maestro recibe SOLO lo que califica la máquina (70 pts). Los otros 30 son
  // producción abierta que el alumno se puntúa contra la pauta: ese número enseña a
  // compararse, pero como nota sería inventado, así que no entra en el resultado.
  const OP_UMBRAL = 49, OP_AUTO = 70, OP_MANUAL = 30; let autoev = 0;
  d.ordItems.forEach((it, i) => { const el = document.querySelector(`[data-ord="${i}"]`); const ok = _isOrdOk(el ? el.value : '', it.ans); if (el) { el.classList.toggle('eval-input-ok', ok); el.classList.toggle('eval-input-no', !ok); } if (ok) { det.ord += 4; total += 4; } setEvalFeedback('evalFbOrd' + i, ok, ok ? 'Correcto. +4 pts' : 'Revisar. Orden correcto: ' + it.ans); });
  d.eaItems.forEach((it, i) => { const sel = document.querySelector(`input[name="opEA${i}"]:checked`); const ok = !!sel && sel.value === it.a; if (ok) { det.ea += 2; total += 2; } setEvalFeedback('evalFbEa' + i, ok, ok ? 'Correcto. +2 pts' : 'Revisar. Era: ' + (it.a === 'E' ? 'Exacta' : 'Ambigua')); });
  d.cplItems.forEach((it, i) => { const sel = document.querySelector(`input[name="opC${i}"]:checked`); const ok = !!sel && Number(sel.value) === it.ans; if (ok) { det.cpl += 4; total += 4; } setEvalFeedback('evalFbCpl' + i, ok, ok ? 'Correcto. +4 pts' : 'Revisar. Faltaba: ' + it.opts[it.ans]); });
  d.vidaItems.forEach((it, i) => { const inp = document.querySelector(`[data-vida="${i}"]`); let v = inp ? (parseInt(inp.value) || 0) : 0; v = Math.max(0, Math.min(10, v)); if (inp) inp.value = v; det.vida += v; autoev += v; setEvalFeedback('evalFbVida' + i, v >= 7, 'Puntaje autoevaluado: ' + v + '/10 (compara siempre con la pauta)'); });
  { const el = document.querySelector('[data-rd="0"]'); const ok = _isOrdOk(el ? el.value : '', d.retoD.ans); if (el) { el.classList.toggle('eval-input-ok', ok); el.classList.toggle('eval-input-no', !ok); } if (ok) { det.reto += 10; total += 10; } setEvalFeedback('evalFbRd', ok, ok ? '¡Problema bien descompuesto! +10 pts' : 'Revisar. Orden lógico: ' + d.retoD.ans); }
  { const elL = document.querySelector('[data-dl="0"]'); const okL = _isOpNumOk(elL ? elL.value : '', d.retoP.linea); if (elL) { elL.classList.toggle('eval-input-ok', okL); elL.classList.toggle('eval-input-no', !okL); } const elT = document.querySelector('[data-dt="0"]'); const okT = !!elT && elT.value === d.retoP.tipo; if (elT) { elT.classList.toggle('eval-input-ok', okT); elT.classList.toggle('eval-input-no', !okT); } if (okL) { det.reto += 5; total += 5; } if (okT) { det.reto += 5; total += 5; } setEvalFeedback('evalFbDet', okL && okT, (okL && okT) ? '¡Paso malo atrapado! +10 pts' : 'Revisar. Paso ' + d.retoP.linea + ' → ' + OP_TIPO_TXT[d.retoP.tipo]); }
  const res = document.getElementById('evalOpAutoResult');
  const desglose = `Ordena: ${det.ord}/20 · Exacta o ambigua: ${det.ea}/10 · Completa: ${det.cpl}/20 · Retos: ${det.reto}/20`;
  if (res) { res.className = 'eval-auto-result ' + (total >= OP_UMBRAL ? 'eval-auto-pass' : 'eval-auto-risk'); res.innerHTML = `<strong>Resultado automático: ${total}/${OP_AUTO} puntos</strong><br><span>${desglose}</span><br><em>Falta calificar: IV. Vida real (${OP_MANUAL} pts). Eso lo escribiste tú y lo revisa tu maestro con la pauta; tu autoevaluación fue ${autoev}/${OP_MANUAL} y no cuenta para esta nota.</em>`; }
  if (total >= OP_UMBRAL) { pts(8); showToast('🎯 Prueba operativa calificada: ' + total + '/' + OP_AUTO); }
  else showToast('🧮 Prueba operativa: ' + total + '/' + OP_AUTO + '. Revisa los ítems marcados.');
}

function printEvalOp() {
  if (!window._evalOpData) { showToast('⚠️ Genera una prueba operativa primero'); return; }
  sfx('click');
  const forma = window._currentEvalOpForm || 1; const d = window._evalOpData;

  // ── I. Ordena el algoritmo
  let s1 = `<div class="sec-title"><span>I. Ordena el algoritmo</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Nivel básico. Los pasos están numerados pero DESORDENADOS. Escribe el orden correcto con los números separados por guiones (p. ej. 2-4-1-3). 4 pts c/u.</p><div class="ej-grid">`;
  d.ordItems.forEach((it, i) => {
    s1 += `<div class="ej-box"><div class="ej-head">${i + 1}. ${it.tarea}</div><div class="ej-prog">${it.display.map((p, j) => (j + 1) + '. ' + p).join('<br>')}</div><div class="ej-resp">Orden correcto: <span class="opx-mini-blank">&nbsp;</span></div></div>`;
  });
  s1 += '</div>';

  // ── II. ¿Exacta o ambigua?
  let s2 = `<div class="sec-title"><span>II. ¿Exacta o ambigua?</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10 pts</span></div></div><p class="opx-instr">Agilidad. Escribe E si la instrucción es EXACTA (todos la ejecutan igual) o A si es AMBIGUA (cada quien entiende distinto). 2 pts c/u.</p>`;
  d.eaItems.forEach((it, i) => { s2 += `<div class="opx-print-row" style="align-items:flex-start;"><span class="qn">${i + 1}.</span><span style="flex:1;line-height:1.35;">«${it.txt}» &nbsp; E o A: <span class="opx-mini-blank" style="min-width:34px;">&nbsp;</span></span></div>`; });

  // ── III. Completa el paso que falta
  let s3 = `<div class="sec-title"><span>III. Completa el paso que falta</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Nivel intermedio. Al algoritmo le falta UN paso (el espacio ___). Escribe la letra de la opción correcta. 4 pts c/u.</p>`;
  d.cplItems.forEach((it, i) => { s3 += `<div class="opx-print-row" style="align-items:flex-start;"><span class="qn">${i + 1}.</span><span style="flex:1;line-height:1.35;"><strong>${it.tarea}:</strong> <span class="mono">${it.pasos.join(' → ')}</span><br>${it.opts.map((op, oi) => 'abcd'[oi] + ') ' + op).join(' · ')} &nbsp; Letra: <span class="opx-mini-blank" style="min-width:34px;">&nbsp;</span></span></div>`; });

  // ── IV. Problemas de la vida real (rúbrica en la pauta)
  let s4 = `<div class="sec-title"><span>IV. Problemas de la vida real</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 30 pts</span></div></div><p class="opx-instr">Nivel avanzado. Escribe el ALGORITMO de 4 a 6 pasos numerados; cada paso empieza con un verbo claro. 10 pts c/u.</p>`;
  d.vidaItems.forEach((it, i) => { s4 += `<div class="opx-print-row" style="align-items:flex-start;"><span class="qn">${i + 1}.</span><span style="flex:1;line-height:1.4;">Algoritmo para: <strong>${it.tema}</strong><br><span class="ln-vida"></span><span class="ln-vida"></span><span class="ln-vida"></span></span></div>`; });

  // ── V. Retos de olimpiada
  let s5 = `<div class="sec-title"><span>V. Retos de olimpiada</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Desafío. Reto 1: 10 pts · Reto 2: 10 pts (5 el paso + 5 el porqué).</p><div class="ord-print-grid"><div class="ord-print-box"><div class="ord-print-dir">1. 🧩 Descompón el problema · 10 pts:</div><div style="font-size:9pt;line-height:1.35;">El problema grande <strong>«${d.retoD.problema}»</strong> se dividió en 4 partes, pero quedaron desordenadas. Escribe el orden lógico (p. ej. 2-4-1-3):<br><span class="mono">${d.retoD.display.map((p, j) => (j + 1) + '. ' + p).join('<br>')}</span></div><div style="margin-top:0.3rem;font-size:9pt;">Orden lógico: <span class="opx-mini-blank">&nbsp;</span></div></div><div class="ord-print-box"><div class="ord-print-dir">2. 🔎 Detective del paso malo · 10 pts:</div><div style="font-size:9pt;line-height:1.35;">En el algoritmo para <strong>${d.retoP.tarea}</strong> se coló UN paso inútil o ambiguo:<br><span class="mono">${d.retoP.lineas.map((p, j) => 'Paso ' + (j + 1) + ': ' + p).join('<br>')}</span></div><div style="margin-top:0.3rem;font-size:9pt;">Nº del paso malo: <span class="opx-mini-blank" style="min-width:34px;">&nbsp;</span> · Es: (a) ambiguo &nbsp; (b) inútil &nbsp; → <span class="opx-mini-blank" style="min-width:34px;">&nbsp;</span></div></div></div>`;

  // ── Pauta del docente
  let pR = '';
  pR += `<div class="p-sec"><div class="p-ttl">I. Ordena el algoritmo</div><table class="p-tbl">${d.ordItems.map((it, i) => `<tr><td class="pn">${i + 1}.</td><td class="pa">${it.ans} (${it.pasos.map((p, j) => (j + 1) + 'º ' + p).join(' · ')})</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">II. ¿Exacta o ambigua?</div><table class="p-tbl">${d.eaItems.map((it, i) => `<tr><td class="pn">${i + 1}.</td><td class="pa">${it.a} (${it.a === 'E' ? 'exacta' : 'ambigua'})</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">III. Completa el paso</div><table class="p-tbl">${d.cplItems.map((it, i) => `<tr><td class="pn">${i + 1}.</td><td class="pa">${'abcd'[it.ans]}) ${it.opts[it.ans]}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">IV. Vida real (rúbrica 10 pts c/u)</div>${d.vidaItems.map((it, i) => `<div class="p-ord-line"><strong>${i + 1}. ${it.tema}:</strong> ${it.pasos.join(' → ')}</div>`).join('')}<div class="p-rub">Rúbrica: ${OP_VIDA_RUBRICA}. Acepte redacciones distintas si los pasos clave están en orden.</div></div>`;
  pR += `<div class="p-sec" style="grid-column:1/-1;"><div class="p-ttl">V. Retos de olimpiada</div><div class="p-ord-line"><strong>1.</strong> Orden lógico: ${d.retoD.ans} (${d.retoD.partes.map((p, j) => (j + 1) + 'º ' + p).join(' · ')})</div><div class="p-ord-line"><strong>2.</strong> Paso ${d.retoP.linea} («${d.retoP.malo}») → ${OP_TIPO_TXT[d.retoP.tipo]} ${d.retoP.tipo === 'A' ? '(a)' : '(b)'}</div></div>`;

  const doc = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Prueba Operativa El Pensamiento Computacional · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11.5pt;color:#111;background:#fff;padding:4mm 6mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.5rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;color:#0e7490;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:#0e7490;margin-top:0.15rem;font-weight:700;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.5rem 0 0.22rem;border-left:4px solid #0e7490;background:#ecfeff;display:flex;justify-content:space-between;align-items:center;color:#0e7490;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:#0e7490;font-weight:700;font-style:italic;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #0e7490;height:12px;}.qn{font-weight:700;min-width:20px;display:inline-block;color:#0e7490;}.opx-instr{font-size:9pt;color:#555;margin-bottom:0.25rem;}.opx-print-row{display:flex;align-items:baseline;gap:0.4rem;font-size:10.5pt;padding:0.22rem 0.2rem;border-bottom:1px dotted #ddd;}.opx-mini-blank{display:inline-block;min-width:60px;border-bottom:1.5px solid #111;}.mono{font-family:'Courier New',monospace;font-weight:700;font-size:9.5pt;}.ej-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0.35rem 0.5rem;margin-top:0.2rem;}.ej-box{border:1px solid #bbb;border-radius:4px;padding:0.25rem 0.35rem;break-inside:avoid;page-break-inside:avoid;}.ej-head{font-size:8.5pt;font-weight:700;color:#0e7490;margin-bottom:0.15rem;}.ej-prog{font-family:'Courier New',monospace;font-size:8.5pt;font-weight:700;line-height:1.3;margin-top:0.15rem;}.ej-resp{font-size:9pt;margin-top:0.2rem;}.ln-vida{display:block;border-bottom:1px solid #111;min-height:14px;margin-top:8px;}.ord-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.8rem;margin-top:0.2rem;}.ord-print-box{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.4rem;break-inside:avoid;}.ord-print-dir{font-size:9pt;font-weight:700;color:#0e7490;margin-bottom:0.2rem;}.total-row{display:flex;align-items:baseline;justify-content:flex-end;gap:7px;font-size:11pt;color:#0e7490;font-weight:700;font-style:italic;margin-top:0.5rem;padding:0.2rem 0.5rem;background:#ecfeff;border-radius:4px;}.total-row .obt-line{min-width:80px;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #0e7490;padding-bottom:0.35rem;margin-bottom:0.5rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;color:#0e7490;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #a5f3fc;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;color:#0e7490;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#0e7490;}.pa{color:#007a00;font-weight:600;}.p-ord-line{font-size:10.5pt;margin-bottom:0.2rem;color:#007a00;}.p-rub{font-size:9.5pt;color:#555;margin-top:0.2rem;border-top:1px dotted #ddd;padding-top:0.2rem;}.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Examen de Programación — Prueba Operativa · El Pensamiento Computacional · Educación Básica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 pts · I: 20 · II: 10 · III: 20 · IV: 30 · V: 20 · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✔ PAUTA — Prueba Operativa · El Pensamiento Computacional · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">100 pts · I: 5×4 · II: 5×2 · III: 5×4 · IV: 3×10 · V: 10+10 · Programación · Educación Básica</div></div><div class="p-grid">${pR}</div></div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("evalPage",250,0.55,1.2);fit("pautaPage",250,0.55,1.2);})();<\/script></body></html>`;
  const win = window.open('', '_blank', '');
  if (!win) { showToast('⚠️ Activa las ventanas emergentes para imprimir'); return; }
  win.document.write(typeof METAS_TR==='function'?METAS_TR(doc):doc); win.document.close(); setTimeout(() => win.print(), 400);
}

// ===================== LAB: EL MAESTRO ROBOT (4 escenarios × 4 desafíos, todo desconectado) =====================
let parteData={
  baleada:{nombre:'Hacer una baleada',icon:'🫓',
    algoritmo:['Amasar la harina con agua','Hacer la bolita y aplastar la tortilla','Cocer la tortilla en el comal','Untar 2 cucharadas de frijoles y queso','Doblar la baleada y servirla'],
    ambigua:{lista:['Amasar la harina con agua','Ponle frijoles, más o menos','Cocer la tortilla en el comal','Doblar la baleada y servirla'],mala:1,fix:'Untar 2 cucharadas de frijoles'},
    falta:{pasos:['Amasar la harina con agua','❓','Cocer la tortilla en el comal','Doblar la baleada y servirla'],correcta:'Hacer la bolita y aplastar la tortilla',distractores:['Comerse la baleada','Lavar el comal','Guardar la harina']},
    partes:{problema:'Vender baleadas en el recreo',correctas:['Comprar los ingredientes','Preparar las baleadas','Cobrar y dar el cambio'],extra:['Izar la bandera','Regar la huerta','Pintar la cancha']}},
  bandera:{nombre:'Izar la bandera el lunes cívico',icon:'🇭🇳',
    algoritmo:['Formar filas en el patio','Amarrar la bandera a la cuerda','Izarla despacio mientras suena el himno','Hacer el saludo en silencio','Volver al aula en orden'],
    ambigua:{lista:['Formar filas en el patio','Amarrar la bandera a la cuerda','Súbela como sea, rapidito','Hacer el saludo en silencio'],mala:2,fix:'Izarla despacio mientras suena el himno'},
    falta:{pasos:['Formar filas en el patio','Amarrar la bandera a la cuerda','❓','Hacer el saludo en silencio'],correcta:'Izarla despacio mientras suena el himno',distractores:['Guardar la cuerda','Aplaudir bien fuerte','Correr al aula']},
    partes:{problema:'Organizar el acto cívico del lunes',correctas:['Preparar la bandera y la cuerda','Ensayar el himno con el coro','Ordenar las filas por grado'],extra:['Hacer las tortillas','Sembrar el frijol','Comprar los nances']}},
  frijol:{nombre:'Sembrar un frijol en un vaso',icon:'🌱',
    algoritmo:['Poner algodón húmedo en el vaso','Colocar el frijol sobre el algodón','Dejar el vaso cerca de la luz','Regar con una cucharada de agua cada día','Anotar cada día cuánto ha crecido'],
    ambigua:{lista:['Poner algodón húmedo en el vaso','Colocar el frijol sobre el algodón','Échale agua cuando te acordés','Anotar cada día cuánto ha crecido'],mala:2,fix:'Regar con una cucharada de agua cada día'},
    falta:{pasos:['Poner algodón húmedo en el vaso','❓','Dejar el vaso cerca de la luz','Regar con una cucharada de agua cada día'],correcta:'Colocar el frijol sobre el algodón',distractores:['Comerse el frijol','Tapar el vaso con piedras','Esconder el vaso']},
    partes:{problema:'Montar la huerta escolar',correctas:['Preparar la tierra de los surcos','Conseguir las semillas','Organizar los turnos de riego'],extra:['Comprar un robot','Doblar una baleada','Cantar el himno']}},
  nance:{nombre:'Preparar un fresco de nance',icon:'🥤',
    algoritmo:['Lavar bien los nances','Machacar los nances en una taza de agua','Colar la mezcla','Agregar 4 tazas de agua y 6 cucharadas de azúcar','Servir el fresco con hielo'],
    ambigua:{lista:['Lavar bien los nances','Colar la mezcla','Ponle azúcar al gusto de todos','Servir el fresco con hielo'],mala:2,fix:'Agregar 6 cucharadas de azúcar'},
    falta:{pasos:['Lavar bien los nances','Machacar los nances en una taza de agua','❓','Agregar 4 tazas de agua y 6 cucharadas de azúcar'],correcta:'Colar la mezcla',distractores:['Congelar los nances enteros','Botar el agua','Pintar el vaso']},
    partes:{problema:'Vender frescos en la feria escolar',correctas:['Comprar los nances y el azúcar','Preparar el fresco temprano','Conseguir vasos y hielo'],extra:['Amarrar la bandera','Barrer la dirección','Aflojar la tierra del patio']}}
};
let LAB_ASPECTOS={orden:'🔢 Ordena los pasos',ambigua:'🌫️ Caza la ambigua',falta:'❓ El paso que falta',partes:'🧩 Descompón'};
let labParte='baleada',labAspecto='orden',labOrdenNext=0,labPartesSel=[],labLock=false;
function _labAspDoneCount(parte){return Object.keys(LAB_ASPECTOS).filter(a=>xpTracker.lab.has(parte+'_'+a)).length;}
function labShowParte(parteKey){labParte=parteKey;document.querySelectorAll('.lab-cont-btn').forEach(b=>b.classList.remove('active-pri'));const btn=document.querySelector(`[data-parte="${parteKey}"]`);if(btn)btn.classList.add('active-pri');renderLab();if(typeof sfx==='function')sfx('click');}
function labShowAspecto(aspKey){labAspecto=aspKey;renderLab();if(typeof sfx==='function')sfx('click');}
function renderLab(){
  const nv=parteData[labParte];
  document.querySelectorAll('.lab-asp-btn').forEach(b=>{
    const a=b.dataset.asp;
    b.classList.toggle('active-pri',a===labAspecto);
    const done=xpTracker.lab.has(labParte+'_'+a);
    b.textContent=(done?'✅ ':'')+LAB_ASPECTOS[a];
  });
  const sent=document.getElementById('lab-sentence');
  if(sent)sent.innerHTML=`${nv.icon} <strong>${nv.nombre}</strong> — ${_labAspDoneCount(labParte)} de 4 desafíos superados en este escenario`;
  const disp=document.getElementById('lab-display');
  if(!disp)return;
  disp.innerHTML='';labLock=false;
  const fbEl=document.getElementById('fbLab');if(fbEl)fbEl.classList.remove('show');
  if(labAspecto==='orden')renderLabOrden(disp,nv);
  else if(labAspecto==='ambigua')renderLabAmbigua(disp,nv);
  else if(labAspecto==='falta')renderLabFalta(disp,nv);
  else renderLabPartes(disp,nv);
}
function _labTitle(disp,txt){const t=document.createElement('div');t.style.cssText='font-weight:700;margin-bottom:0.6rem;';t.innerHTML=txt;disp.appendChild(t);}
function _labBtns(disp){const w=document.createElement('div');w.className='cmp-opts';w.style.cssText='display:flex;flex-direction:column;gap:0.5rem;align-items:stretch;';disp.appendChild(w);return w;}
function renderLabOrden(disp,nv){
  _labTitle(disp,'🔢 El robot humano necesita el algoritmo EN ORDEN. Toca los pasos del primero al último:');
  labOrdenNext=0;
  let pool=_shuffle([...nv.algoritmo]);let t=0;
  while(pool.every((p,i)=>p===nv.algoritmo[i])&&t<10){pool=_shuffle([...nv.algoritmo]);t++;}
  const wrap=_labBtns(disp);
  pool.forEach(step=>{
    const b=document.createElement('button');b.className='cmp-opt';b.textContent=step;
    b.onclick=()=>{
      if(labLock||b.disabled)return;
      if(step===nv.algoritmo[labOrdenNext]){
        b.classList.add('correct');b.disabled=true;b.textContent=(labOrdenNext+1)+'º · '+step;sfx('ok');labOrdenNext++;
        if(labOrdenNext===nv.algoritmo.length){fb('fbLab','🎉 ¡Algoritmo ordenado de principio a fin! El robot humano ya puede ejecutarlo.',true);labMarkDone();}
      }else{
        b.classList.add('wrong');sfx('no');setTimeout(()=>b.classList.remove('wrong'),700);
        fb('fbLab','Ese paso todavía no va. ¿Qué se hace PRIMERO?',false);
      }
    };
    wrap.appendChild(b);
  });
}
function renderLabAmbigua(disp,nv){
  _labTitle(disp,'🌫️ Una instrucción de este algoritmo es AMBIGUA: el robot humano no sabría ejecutarla. ¡Tócala!');
  const wrap=_labBtns(disp);
  nv.ambigua.lista.forEach((txt,i)=>{
    const b=document.createElement('button');b.className='cmp-opt';b.textContent=(i+1)+'. '+txt;
    b.onclick=()=>{
      if(labLock)return;
      if(i===nv.ambigua.mala){
        labLock=true;b.classList.add('correct');sfx('ok');
        fb('fbLab',`🎯 ¡La cazaste! «${txt}» es ambigua. Instrucción exacta: «${nv.ambigua.fix}».`,true);
        labMarkDone();
      }else{
        b.classList.add('wrong');sfx('no');setTimeout(()=>b.classList.remove('wrong'),700);
        fb('fbLab','Esa instrucción es exacta: cualquiera la ejecuta igual. Busca la confusa.',false);
      }
    };
    wrap.appendChild(b);
  });
}
function renderLabFalta(disp,nv){
  _labTitle(disp,'❓ Al algoritmo le FALTA un paso (el ❓). Piensa al revés: ¿cuál completa la tarea?');
  const prog=document.createElement('div');prog.className='w-prog';prog.style.cssText='margin-bottom:0.7rem;text-align:left;';
  prog.innerHTML=nv.falta.pasos.map((p,i)=>(i+1)+'. '+p).join('<br>');
  disp.appendChild(prog);
  const wrap=_labBtns(disp);
  _shuffle([nv.falta.correcta,...nv.falta.distractores]).forEach(op=>{
    const b=document.createElement('button');b.className='cmp-opt';b.textContent=op;
    b.onclick=()=>{
      if(labLock)return;
      if(op===nv.falta.correcta){
        labLock=true;b.classList.add('correct');sfx('ok');
        prog.innerHTML=nv.falta.pasos.map((p,i)=>(i+1)+'. '+(p==='❓'?'<strong>'+op+'</strong> ✅':p)).join('<br>');
        fb('fbLab','🧠 ¡Exacto! Ese era el paso perdido: sin él la tarea queda incompleta.',true);
        labMarkDone();
      }else{
        b.classList.add('wrong');sfx('no');setTimeout(()=>b.classList.remove('wrong'),700);
        fb('fbLab','Ese paso no ayuda a completar la tarea. Lee el algoritmo otra vez.',false);
      }
    };
    wrap.appendChild(b);
  });
}
function renderLabPartes(disp,nv){
  _labTitle(disp,`🧩 Problema grande: <strong>${nv.partes.problema}</strong>. Toca las <strong>3 partes</strong> que SÍ le pertenecen:`);
  labPartesSel=[];
  const wrap=_labBtns(disp);
  _shuffle([...nv.partes.correctas,...nv.partes.extra]).forEach(op=>{
    const b=document.createElement('button');b.className='cmp-opt';b.textContent=op;
    b.onclick=()=>{
      if(labLock)return;sfx('click');
      const ix=labPartesSel.indexOf(op);
      if(ix>=0){labPartesSel.splice(ix,1);b.classList.remove('sel');return;}
      if(labPartesSel.length>=3){fb('fbLab','Solo 3 partes: quita una para cambiar tu elección.',false);return;}
      labPartesSel.push(op);b.classList.add('sel');
      if(labPartesSel.length===3){
        labLock=true;
        const okAll=nv.partes.correctas.every(c=>labPartesSel.includes(c));
        wrap.querySelectorAll('.cmp-opt').forEach(x=>{
          if(nv.partes.correctas.includes(x.textContent))x.classList.add('correct');
          else if(labPartesSel.includes(x.textContent))x.classList.add('wrong');
        });
        if(okAll){sfx('ok');fb('fbLab','🎉 ¡Problema bien descompuesto! Ahora cada equipo puede tomar una parte.',true);labMarkDone();}
        else{sfx('no');fb('fbLab','Esas no eran las 3 partes: las correctas quedaron en verde. Toca «🧩 Descompón» para reintentar.',false);}
      }
    };
    wrap.appendChild(b);
  });
}
function labMarkDone(){
  const key=labParte+'_'+labAspecto;
  const parteAntes=_labAspDoneCount(labParte);
  if(!xpTracker.lab.has(key)){
    xpTracker.lab.add(key);pts(1);
    if(_labAspDoneCount(labParte)===4&&parteAntes<4){
      pts(2);
      const btn=document.querySelector(`[data-parte="${labParte}"]`);if(btn)btn.classList.add('lab-done');
      showToast('🏅 ¡Escenario «'+parteData[labParte].nombre+'» completado! +2 XP extra');launchConfetti();
    }
    if(xpTracker.lab.size===Object.keys(parteData).length*4){fin('s-lab');unlockAchievement('lab_master');}
  }
  const nv=parteData[labParte];
  const sent=document.getElementById('lab-sentence');
  if(sent)sent.innerHTML=`${nv.icon} <strong>${nv.nombre}</strong> — ${_labAspDoneCount(labParte)} de 4 desafíos superados en este escenario`;
  document.querySelectorAll('.lab-asp-btn').forEach(b=>{const a=b.dataset.asp;const done=xpTracker.lab.has(labParte+'_'+a);b.textContent=(done?'✅ ':'')+LAB_ASPECTOS[a];});
}

// ===================== DIPLOMA =====================
function _diplPct(){return xp>=MXP?100:Math.round((xp/MXP)*100);}
function openDiploma(){sfx('fan');const pct=_diplPct();document.getElementById('diplPct').textContent=pct+'%';document.getElementById('diplBar').style.width=pct+'%';document.getElementById('diplDate').textContent='Fecha: '+new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});const msgs=['¡Sigue aprendiendo!','¡Muy buen trabajo!','¡Vas muy bien!','¡Dominas los algoritmos y la descomposición!','¡Maestro del Pensamiento Computacional!'];document.getElementById('diplMsg').textContent=msgs[Math.min(Math.floor(pct/25),4)];const stars=['⭐','⭐⭐','⭐⭐⭐'];document.getElementById('diplStars').textContent=stars[Math.min(Math.floor(pct/40),2)];const achTxt=unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(' · ');document.getElementById('diplAch').textContent=achTxt||'Sigue completando secciones para desbloquear logros';document.getElementById('diplomaOverlay').classList.add('open');launchConfetti();}
function closeDiploma(){document.getElementById('diplomaOverlay').classList.remove('open');}
function updateDiplomaName(v){document.getElementById('diplName').textContent=v||'Estudiante';}
function shareWA(){const name=document.getElementById('diplName').textContent||'Estudiante';const pct=_diplPct();const msg=`🧠 ¡${name} completó la Misión "El Pensamiento Computacional"! 🏅 Progreso: ${pct}% · 💻 policastsapien.com`;_waShare(msg);}
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
  showEnfer();
  labShowParte('baleada');
  renderAchPanel();
});

// ===================== IDIOMA (español ↔ inglés) =====================
// El contenido en inglés vive en pensamiento-computacional-en.js y el botón lo
// maneja ../../js/metas-i18n.js. Aquí solo se intercambian los bancos y se
// repinta: el progreso (XP, logros, secciones hechas) no se toca al cambiar.
//
// Esta misión es la única de la Ruta del Código sin simulador, así que NO
// quedan identificadores en español: los juegos que comparan textContent
// (¿Exacta o ambigua?, Descompón, el reto, los cuatro desafíos del Lab)
// comparan siempre contra el MISMO banco que pintaron, y el banco entero
// cambia de idioma de golpe. Lo único que se queda en español son las claves
// internas —'baleada', 'bandera', 'orden', 'ambigua'…— porque son los
// data-parte / data-asp del HTML, no texto que el alumno lea.
const _BANCOS_ES = {
  ACHIEVEMENTS, lvls, fcData, memoPairs, qzData, classGroups, idData, cmpData,
  routeSets, enfermedadData, neuronPartes, retoPairs,
  algoritmoTaskDB, _exactasDB, _ambiguasDB, descomponDB, sopaSets,
  evalTFBank, evalMCBank, evalCPBank, evalPRBank,
  opOrdenBank, opEABank, opFaltaBank, opVidaBank, OP_VIDA_RUBRICA,
  opDescompBank, opDetectiveBank, OP_TIPO_TXT, LAB_ASPECTOS, parteData
};
window.MISION_APLICAR_IDIOMA = function (lang) {
  const src = (lang === 'en' && window.MISION_EN && window.MISION_EN.data)
    ? window.MISION_EN.data : _BANCOS_ES;
  const usa = (k) => (src[k] !== undefined ? src[k] : _BANCOS_ES[k]);

  ACHIEVEMENTS = usa('ACHIEVEMENTS'); lvls = usa('lvls');
  fcData = usa('fcData'); memoPairs = usa('memoPairs'); qzData = usa('qzData');
  classGroups = usa('classGroups'); idData = usa('idData'); cmpData = usa('cmpData');
  routeSets = usa('routeSets'); enfermedadData = usa('enfermedadData');
  neuronPartes = usa('neuronPartes'); retoPairs = usa('retoPairs');
  algoritmoTaskDB = usa('algoritmoTaskDB'); _exactasDB = usa('_exactasDB');
  _ambiguasDB = usa('_ambiguasDB'); descomponDB = usa('descomponDB');
  sopaSets = usa('sopaSets');
  evalTFBank = usa('evalTFBank'); evalMCBank = usa('evalMCBank');
  evalCPBank = usa('evalCPBank'); evalPRBank = usa('evalPRBank');
  opOrdenBank = usa('opOrdenBank'); opEABank = usa('opEABank');
  opFaltaBank = usa('opFaltaBank'); opVidaBank = usa('opVidaBank');
  OP_VIDA_RUBRICA = usa('OP_VIDA_RUBRICA'); opDescompBank = usa('opDescompBank');
  opDetectiveBank = usa('opDetectiveBank'); OP_TIPO_TXT = usa('OP_TIPO_TXT');
  LAB_ASPECTOS = usa('LAB_ASPECTOS'); parteData = usa('parteData');

  // Repintar cada juego desde el principio con el banco nuevo
  fcIdx = 0; upFC();
  buildMemo();
  qzIdx = 0; qzSel = -1; qzDone = false; showQz();
  currentClassGroupIdx = 0; buildClass();
  idIdx = 0; showId();
  cmpIdx = 0; cmpSel = -1; showCmp();
  currentRouteIdx = 0; buildRoute();
  neuronIdx = 0; showNeuron();
  enferIdx = 0; enferRacha = 0; showEnfer();
  currentRetoPairIdx = 0; updateRetoButtons(); resetReto();
  currentSopaSetIdx = 0; sopaFoundWords = new Set(); buildSopa();
  labShowParte(labParte);
  renderAchPanel(); updateXPBar();

  // Las pruebas ya generadas se rehacen en el idioma nuevo, con su misma forma
  const out = document.getElementById('evalOut');
  if (out && out.innerHTML.trim()) { evalFormNum = window._currentEvalForm || evalFormNum; genEval(); }
  const outOp = document.getElementById('evalOpOut');
  if (outOp && outOp.innerHTML.trim()) { evalOpFormNum = window._currentEvalOpForm || evalOpFormNum; genEvalOp(); }
  const tg = document.getElementById('tgOut');
  if (tg) tg.innerHTML = '';
};

// Formas deterministas v1: selectores de forma visibles desde la carga de la página
(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalOp==='function') _injectFormaSel('genEvalOp','evalOpFormaSel',evalOpFormNum,function(v){evalOpFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();
