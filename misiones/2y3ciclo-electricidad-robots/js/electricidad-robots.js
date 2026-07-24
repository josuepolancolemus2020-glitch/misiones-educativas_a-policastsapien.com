// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
function compartirMision(){const url=window.location.href;const texto=`⚡ *Misión Asignada* ⚡\n\nPractica sobre este tema y sobresale en ser de los mejores alumnos. 🏆\n\nDesbloquea *todos los logros* y puedes poner *tus datos* para que tu maestro observe todos tus logros. 📋\n\n_Se te hará prueba escrita y serás excelente estudiante en Robótica._ 🔌\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;_waShare(texto);}
function toggleLetra(){document.body.classList.toggle('letra-grande');if(typeof sfx==='function')sfx('click');localStorage.setItem('preferenciaLetra',document.body.classList.contains('letra-grande'));}
window.addEventListener('DOMContentLoaded',()=>{if(localStorage.getItem('preferenciaLetra')==='true')document.body.classList.add('letra-grande');});

// ===================== UTILIDADES =====================
const _pick=(arr,n)=>[...arr].sort(()=>Math.random()-0.5).slice(0,n);
const _shuffle=(arr)=>[...arr].sort(()=>Math.random()-0.5);
function fb(id,msg,isOk){const el=document.getElementById(id);if(el){el.textContent=msg;el.className='fb show '+(isOk?'ok':'err');}}

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY='electricidad_robots_v1';
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
const ACHIEVEMENTS={
  primer_quiz:{icon:'⚡',label:'Primer quiz eléctrico superado'},
  flash_master:{icon:'🃏',label:'Todas las flashcards del circuito exploradas'},
  clasif_pro:{icon:'🗂️',label:'Clasificador de conductores y aislantes experto'},
  id_master:{icon:'🔍',label:'Identificador de partes del circuito maestro'},
  reto_hero:{icon:'🏆',label:'Héroe del reto Conductor vs Aislante'},
  nivel3:{icon:'🔌',label:'¡Armador de Circuitos! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡Ingeniero Eléctrico! Nivel 6'},
  widgets_master:{icon:'🧩',label:'Widgets del circuito eléctrico dominados'},
  lab_circuito:{icon:'💡',label:'Laboratorio de circuitos: los 8 casos predichos'},
  seguridad_pro:{icon:'🦺',label:'Técnico en diagnóstico y seguridad eléctrica'}
};
function unlockAchievement(id){if(unlockedAch.includes(id))return;unlockedAch.push(id);sfx('ach');showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label);launchConfetti();renderAchPanel();saveProgress();}
function renderAchPanel(){const list=document.getElementById('achList');list.innerHTML='';Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{const div=document.createElement('div');div.className='ach-item'+(unlockedAch.includes(id)?'':' locked');div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`;list.appendChild(div);});}
function toggleAchPanel(){sfx('click');document.getElementById('achPanel').classList.toggle('open');}
function showToast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}t.textContent=msg;t.style.display='block';clearTimeout(t._tid);t._tid=setTimeout(()=>t.style.display='none',3200);}
function launchConfetti(){const colors=['#0e7490','#22d3ee','#c2410c','#fb923c','#06b6d4'];for(let i=0;i<60;i++){const c=document.createElement('div');c.className='confetti-piece';c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`;document.body.appendChild(c);c.addEventListener('animationend',()=>c.remove());}}

// ===================== XP =====================
const lvls=[{t:0,n:'Aprendiz 🌱'},{t:25,n:'Chispa Curiosa ⚡'},{t:55,n:'Armador de Circuitos 🔌'},{t:90,n:'Técnico del LED 💡'},{t:130,n:'Cazador de Fallas 🔧'},{t:165,n:'Ingeniero Eléctrico 🛠️'},{t:190,n:'Maestro del Circuito ⚡'}];
function pts(n){xp=Math.max(0,Math.min(MXP,xp+n));updateXPBar();saveProgress();}
function updateXPBar(){const pct=Math.round((xp/MXP)*100);document.getElementById('xpFill').style.width=pct+'%';const el=document.getElementById('xpPts');el.textContent='⭐ '+xp;el.style.transform='scale(1.3)';setTimeout(()=>el.style.transform='',300);let lv=0;for(let i=0;i<lvls.length;i++)if(xp>=lvls[i].t)lv=i;document.getElementById('xpLvl').textContent=lvls[lv].n;if(lv!==prevLevel){if(lv>=2)unlockAchievement('nivel3');if(lv>=5)unlockAchievement('nivel5');prevLevel=lv;}}
function resetXP(){sfx('click');xp=0;updateXPBar();showToast('🔄 XP reiniciado a 0');}
function fin(id,showFX=true){if(!done.has(id)){done.add(id);const b=document.querySelector(`[data-s="${id}"]`);if(b)b.classList.add('done');if(showFX){sfx('up');launchConfetti();}saveProgress();}}
function getProgress(){return Math.round((done.size/TOTAL_SECTIONS)*100);}

// ===================== NAV =====================
function go(id){sfx('click');document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});document.getElementById(id).classList.add('active');const btn=document.querySelector(`[data-s="${id}"]`);if(btn){btn.classList.add('active');btn.setAttribute('aria-selected','true');}window.scrollTo({top:0,behavior:'smooth'});if(id==='s-sopa'){setTimeout(buildSopa,50);}if(id==='s-widgets'){setTimeout(buildRoute,50);}}

// ===================== MINI-QUIZ (sección Partes) =====================
function miniQ(btn,isOk,fbId){const wrap=btn.parentElement;if(wrap.dataset.done==='1')return;wrap.querySelectorAll('.cmp-opt').forEach(b=>b.classList.remove('sel'));if(isOk){wrap.dataset.done='1';btn.classList.add('correct');fb(fbId,'¡Correcto! Piensas como todo un electricista.',true);sfx('ok');}else{btn.classList.add('wrong');fb(fbId,'Casi. Pregúntate: ¿el camino de la corriente está cerrado y completo?',false);sfx('no');}}

// ===================== FLASHCARD DATA =====================
const fcData=[
  {w:'Circuito eléctrico',a:'🔌 <strong>Camino cerrado</strong> por donde viaja la corriente: fuente + cables + interruptor + carga.'},
  {w:'Fuente (pila o batería)',a:'🔋 La que <strong>empuja</strong> la corriente. Tiene dos polos: <strong>+</strong> y <strong>−</strong>.'},
  {w:'Cable',a:'🧵 El <strong>camino</strong> de la corriente. Por dentro lleva <strong>cobre</strong> (conduce) y por fuera plástico (aísla).'},
  {w:'Interruptor',a:'🔘 La «puerta» del circuito: lo <strong>cierra</strong> (pasa la corriente) o lo <strong>abre</strong> (no pasa nada).'},
  {w:'Carga',a:'💡 Lo que <strong>aprovecha</strong> la electricidad: un LED, un motor o un zumbador.'},
  {w:'Circuito cerrado',a:'🟢 El camino está <strong>completo</strong>: la corriente sale de la pila, pasa por la carga y regresa. ¡Funciona!'},
  {w:'Circuito abierto',a:'🔴 El camino está <strong>cortado</strong> (interruptor abierto o cable suelto): <strong>nada funciona</strong>.'},
  {w:'Circuito en serie',a:'➖ Un <strong>solo camino</strong>: los focos se reparten el voltaje y, si uno se quema, <strong>se apagan todos</strong>.'},
  {w:'Circuito en paralelo',a:'🛣️ <strong>Cada carga tiene su camino</strong>: si una falla, las otras siguen. Así van las luces de tu casa.'},
  {w:'Conductor',a:'🟠 Material que <strong>deja pasar</strong> la corriente: cobre, aluminio, hierro, agua con sales.'},
  {w:'Aislante',a:'🚫 Material que <strong>no deja pasar</strong> la corriente: plástico, madera seca, hule, vidrio.'},
  {w:'Voltaje',a:'💪 El <strong>empuje</strong> que da la fuente, medido en <strong>voltios (V)</strong>. Una pila AA da 1.5 V.'},
  {w:'Corriente',a:'🌊 La <strong>cantidad</strong> de electricidad que pasa por el cable, medida en <strong>amperios (A)</strong>.'},
  {w:'Resistencia',a:'🪨 El <strong>estorbo</strong> que se opone al paso de la corriente, medido en <strong>ohmios (Ω)</strong>. Protege al LED.'},
  {w:'Polaridad del LED',a:'➕➖ El LED solo enciende en <strong>un sentido</strong>: su pata larga va al <strong>+</strong> y la corta al <strong>−</strong>.'},
  {w:'Cortocircuito',a:'⚠️ Atajo <strong>sin resistencia</strong> entre los dos polos: la carga no enciende, la pila <strong>se calienta</strong> y es peligroso.'},
];
let fcIdx=0;
function upFC(){document.getElementById('fcInner').classList.remove('flipped');document.getElementById('fcW').textContent=fcData[fcIdx].w;document.getElementById('fcA').innerHTML=fcData[fcIdx].a;document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length;}
function flipCard(){sfx('flip');document.getElementById('fcInner').classList.toggle('flipped');if(!xpTracker.fc.has(fcIdx)){xpTracker.fc.add(fcIdx);pts(1);}if(xpTracker.fc.size===fcData.length){fin('s-flash');unlockAchievement('flash_master');}}
function nextFC(){sfx('click');fcIdx=(fcIdx+1)%fcData.length;upFC();}
function prevFC(){sfx('click');fcIdx=(fcIdx-1+fcData.length)%fcData.length;upFC();}

// ===================== JUEGO: MEMORIA DEL ROBOT =====================
const memoPairs=[
  {id:'pila',t:'Pila',d:'🔋 la fuente que empuja la corriente'},
  {id:'cable',t:'Cable',d:'🧵 el camino de cobre por donde pasa'},
  {id:'interruptor',t:'Interruptor',d:'🔘 abre o cierra el camino'},
  {id:'led',t:'LED',d:'💡 la carga que da luz; lleva resistencia'},
  {id:'conductor',t:'Conductor',d:'🟠 deja pasar la corriente (cobre)'},
  {id:'aislante',t:'Aislante',d:'🚫 no deja pasar la corriente (plástico)'}
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
const qzData=[
  {q:'¿Qué necesita la corriente eléctrica para poder circular?',o:['a) Un camino cerrado y completo','b) Mucha luz','c) Un imán','d) Estar mojada'],c:0},
  {q:'¿Cuáles son las cuatro partes de un circuito básico?',o:['a) Sol, agua, aire y tierra','b) Fuente, cables, interruptor y carga','c) Motor, rueda, tornillo y clavo','d) Pila, foco, papel y goma'],c:1},
  {q:'¿Para qué sirve el interruptor?',o:['a) Para dar voltaje','b) Para calentar el cable','c) Para abrir o cerrar el camino de la corriente','d) Para pintar el circuito'],c:2},
  {q:'Si un cable se suelta, ¿qué pasa con el circuito?',o:['a) Queda abierto y nada funciona','b) Funciona más rápido','c) Se vuelve paralelo','d) La pila se recarga'],c:0},
  {q:'En un circuito EN SERIE se quema un foco. ¿Qué ocurre?',o:['a) Los demás alumbran más','b) Se apagan todos','c) No pasa nada','d) La pila explota'],c:1},
  {q:'¿Por qué las luces de una casa se conectan en PARALELO?',o:['a) Porque gastan menos cable','b) Porque así alumbran más débil','c) Porque si una falla, las demás siguen encendidas','d) Porque el paralelo no necesita interruptor'],c:2},
  {q:'¿Cuál de estos materiales es AISLANTE?',o:['a) El cobre','b) El aluminio','c) El hierro','d) El plástico seco'],c:3},
  {q:'¿Por qué el LED lleva una resistencia?',o:['a) Para que la corriente no lo queme','b) Para que pese más','c) Para darle color','d) Para pegarlo al cable'],c:0},
  {q:'¿Cuál de estas prácticas es SEGURA?',o:['a) Experimentar en el tomacorriente de 110 V','b) Tocar cables con las manos mojadas','c) Usar solo pilas para los experimentos del aula','d) Unir los dos polos de la pila con un alambre'],c:2},
];
let qzIdx=0,qzSel=-1,qzDone=false;
function buildQz(){qzIdx=0;qzSel=-1;qzDone=false;showQz();}
function showQz(){if(qzIdx>=qzData.length){document.getElementById('qzQ').textContent='🎉 ¡Quiz completado!';document.getElementById('qzOpts').innerHTML='';fin('s-quiz');unlockAchievement('primer_quiz');return;}const q=qzData[qzIdx];document.getElementById('qzProg').textContent=`Pregunta ${qzIdx+1} de ${qzData.length}`;document.getElementById('qzQ').textContent=q.q;const opts=document.getElementById('qzOpts');opts.innerHTML='';q.o.forEach((o,i)=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=o;b.onclick=()=>{if(qzDone)return;document.querySelectorAll('.qz-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');qzSel=i;sfx('click');};opts.appendChild(b);});qzDone=false;}
function checkQz(){if(qzSel<0)return fb('fbQz','Selecciona una respuesta.',false);qzDone=true;const opts=document.querySelectorAll('.qz-opt');if(qzSel===qzData[qzIdx].c){opts[qzSel].classList.add('correct');fb('fbQz','¡Correcto! +5 XP',true);if(!xpTracker.qz.has(qzIdx)){xpTracker.qz.add(qzIdx);pts(5);}sfx('ok');}else{opts[qzSel].classList.add('wrong');opts[qzData[qzIdx].c].classList.add('correct');fb('fbQz','Incorrecto. Revisa la respuesta correcta.',false);sfx('no');}setTimeout(()=>{qzIdx++;qzSel=-1;showQz();},1600);}
function resetQz(){sfx('click');qzIdx=0;qzSel=-1;qzDone=false;showQz();document.getElementById('fbQz').classList.remove('show');}

// ===================== CLASIFICACIÓN =====================
const classGroups=[
  {label:['Conductor','Aislante'],headA:'🟠 Conductor (deja pasar)',headB:'🚫 Aislante (no deja pasar)',colA:'con',colB:'ais',
   words:[{w:'Alambre de cobre',t:'con'},{w:'Regla de plástico',t:'ais'},{w:'Clavo de hierro',t:'con'},{w:'Palito de madera seca',t:'ais'},{w:'Papel de aluminio',t:'con'},{w:'Borrador de hule',t:'ais'},{w:'Moneda',t:'con'},{w:'Vidrio',t:'ais'},{w:'Agua con sal',t:'con'},{w:'Tela seca',t:'ais'}]},
  {label:['Serie','Paralelo'],headA:'➖ En serie',headB:'🛣️ En paralelo',colA:'ser',colB:'par',
   words:[{w:'Un solo camino para la corriente',t:'ser'},{w:'Cada carga tiene su propio camino',t:'par'},{w:'Si uno se quema, se apagan todos',t:'ser'},{w:'Si uno se quema, los otros siguen',t:'par'},{w:'Los focos se reparten el voltaje',t:'ser'},{w:'Cada foco recibe todo el voltaje',t:'par'},{w:'Las luces del arbolito viejo',t:'ser'},{w:'Las lámparas de tu casa',t:'par'}]},
  {label:['Circuito cerrado','Circuito abierto'],headA:'🟢 Cerrado (funciona)',headB:'🔴 Abierto (no funciona)',colA:'cer',colB:'abi',
   words:[{w:'Interruptor presionado hacia ON',t:'cer'},{w:'Cable suelto de la pila',t:'abi'},{w:'Camino completo de la pila a la carga',t:'cer'},{w:'Interruptor apagado',t:'abi'},{w:'El LED encendido',t:'cer'},{w:'Un cable cortado a la mitad',t:'abi'},{w:'El motor girando',t:'cer'},{w:'La pila fuera de su portapilas',t:'abi'}]},
  {label:['Seguro','Peligroso'],headA:'🦺 Práctica segura',headB:'⚠️ Práctica peligrosa',colA:'seg',colB:'pel',
   words:[{w:'Experimentar solo con pilas',t:'seg'},{w:'Meter alambres al tomacorriente',t:'pel'},{w:'Tener las manos secas',t:'seg'},{w:'Tocar un cable con las manos mojadas',t:'pel'},{w:'Llevar las pilas usadas al centro de acopio',t:'seg'},{w:'Unir los dos polos de la pila con un alambre',t:'pel'},{w:'Usar cables con su forro de plástico',t:'seg'},{w:'Halar el cargador del celular por el cable',t:'pel'}]},
];
let currentClassGroupIdx=0,clsSelectedWord=null;
function buildClass(){const group=classGroups[currentClassGroupIdx];document.getElementById('col-left-head').textContent=group.headA;document.getElementById('col-right-head').textContent=group.headB;const bank=document.getElementById('clsBank');bank.innerHTML='';clsSelectedWord=null;document.getElementById('items-left').innerHTML='';document.getElementById('items-right').innerHTML='';_shuffle([...group.words]).forEach(w=>{const el=document.createElement('div');el.className='wb-item';el.textContent=w.w;el.dataset.t=w.t;el.onclick=()=>{document.querySelectorAll('.wb-item').forEach(i=>i.classList.remove('sel-word'));el.classList.add('sel-word');clsSelectedWord=el;sfx('click');};bank.appendChild(el);});['col-left','col-right'].forEach(colId=>{const col=document.getElementById(colId);col.onclick=(e)=>{if(!clsSelectedWord||e.target.classList.contains('drop-item'))return;const targetId=colId==='col-left'?'items-left':'items-right';const wordsCol=document.getElementById(targetId);const item=document.createElement('div');item.className='drop-item';item.textContent=clsSelectedWord.textContent;item.dataset.t=clsSelectedWord.dataset.t;const original=clsSelectedWord;item.onclick=(ev)=>{ev.stopPropagation();if(clsSelectedWord!==null){col.click();}else{document.getElementById('clsBank').appendChild(original);original.classList.remove('sel-word');item.remove();if(typeof sfx==='function')sfx('click');}};wordsCol.appendChild(item);clsSelectedWord.remove();clsSelectedWord=null;sfx('click');};});}
function checkClass(){const remaining=document.querySelectorAll('#clsBank .wb-item').length;if(remaining>0){fb('fbCls','Mueve todas las palabras a las columnas primero.',false);return;}const group=classGroups[currentClassGroupIdx];let allOk=true;document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{const inLeft=el.parentElement.id==='items-left';const expectedType=inLeft?group.colA:group.colB;if(el.dataset.t===expectedType){el.classList.add('cls-ok');}else{el.classList.add('cls-no');allOk=false;}});if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);}if(allOk){fb('fbCls','¡Perfecto! +5 XP',true);sfx('fan');fin('s-clasifica');unlockAchievement('clasif_pro');}else{fb('fbCls','Hay errores. Marcados en rojo.',false);sfx('no');}}
function nextClassGroup(){sfx('click');currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length;buildClass();document.getElementById('fbCls').classList.remove('show');showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]);}
function resetClass(){sfx('click');buildClass();document.getElementById('fbCls').classList.remove('show');}

// ===================== IDENTIFICAR =====================
const idData=[
  {s:['La','pila','empuja','la','corriente','por','el','circuito.'],c:1,art:'La fuente de energía del circuito'},
  {s:['El','interruptor','abre','y','cierra','el','camino.'],c:1,art:'La pieza que abre o cierra el circuito'},
  {s:['Por','dentro','del','cable','va','el','cobre.'],c:6,art:'El metal conductor que va dentro del cable'},
  {s:['El','LED','necesita','una','resistencia','para','no','quemarse.'],c:4,art:'La pieza que protege al LED'},
  {s:['Un','circuito','abierto','no','deja','pasar','la','corriente.'],c:2,art:'El estado del circuito cuando el camino está cortado'},
  {s:['En','serie','se','apagan','todos','los','focos.'],c:1,art:'La conexión de un solo camino'},
  {s:['En','paralelo','cada','foco','tiene','su','camino.'],c:1,art:'La conexión con varios caminos'},
  {s:['El','plástico','del','cable','es','un','aislante.'],c:6,art:'El material que no deja pasar la corriente'},
];
let idIdx=0,idDone=false;
function showId(){idDone=false;if(idIdx>=idData.length){document.getElementById('idSent').innerHTML='🎉 ¡Completado!';fin('s-identifica');unlockAchievement('id_master');return;}const d=idData[idIdx];document.getElementById('idProg').textContent=`Oración ${idIdx+1} de ${idData.length}`;document.getElementById('idInfo').textContent=`Busca: ${d.art}`;const sent=document.getElementById('idSent');sent.innerHTML='';d.s.forEach((w,i)=>{const span=document.createElement('span');span.className='id-word';span.textContent=w+' ';span.onclick=()=>checkId(i,span);sent.appendChild(span);});}
function checkId(i,span){if(idDone)return;document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected'));span.classList.add('selected');if(i===idData[idIdx].c){idDone=true;span.classList.add('id-ok');fb('fbId','¡Correcto! +5 XP',true);if(!xpTracker.id.has(idIdx)){xpTracker.id.add(idIdx);pts(5);}sfx('ok');}else{span.classList.add('id-no');fb('fbId','Ese no es el término solicitado.',false);sfx('no');}}
function nextId(){sfx('click');idIdx++;showId();document.getElementById('fbId').classList.remove('show');}
function resetId(){sfx('click');idIdx=0;showId();document.getElementById('fbId').classList.remove('show');}

// ===================== COMPLETA =====================
const cmpData=[
  {s:'La corriente solo circula si el camino está ___.',opts:['cerrado','pintado','mojado'],c:0},
  {s:'La pila es la ___ de energía del circuito.',opts:['carga','fuente','resistencia'],c:1},
  {s:'El ___ abre o cierra el paso de la corriente.',opts:['cable','LED','interruptor'],c:2},
  {s:'Dentro del cable va el ___, que es buen conductor.',opts:['cobre','vidrio','hule'],c:0},
  {s:'En un circuito en ___, si un foco se quema se apagan todos.',opts:['paralelo','serie','abierto'],c:1},
  {s:'Las luces de una casa se conectan en ___.',opts:['serie','cortocircuito','paralelo'],c:2},
  {s:'El ___ es el empuje que da la pila a la corriente.',opts:['voltaje','sonido','peso'],c:0},
  {s:'Para experimentar en el aula usamos solo ___.',opts:['el tomacorriente','pilas','rayos'],c:1},
];
let cmpIdx=0,cmpSel=-1,cmpDone=false;
function showCmp(){if(cmpIdx>=cmpData.length){document.getElementById('cmpSent').innerHTML='🎉 ¡Completado!';document.getElementById('cmpOpts').innerHTML='';fin('s-completa');return;}const d=cmpData[cmpIdx];document.getElementById('cmpProg').textContent=`Oración ${cmpIdx+1} de ${cmpData.length}`;document.getElementById('cmpSent').innerHTML=d.s.replace('___','<span class="blank">___</span>');const opts=document.getElementById('cmpOpts');opts.innerHTML='';cmpSel=-1;cmpDone=false;d.opts.forEach((o,i)=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=o;b.onclick=()=>{if(cmpDone)return;document.querySelectorAll('.cmp-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');cmpSel=i;sfx('click');};opts.appendChild(b);});}
function checkCmp(){if(cmpSel<0)return fb('fbCmp','Selecciona una opción.',false);cmpDone=true;const opts=document.querySelectorAll('.cmp-opt');if(cmpSel===cmpData[cmpIdx].c){opts[cmpSel].classList.add('correct');document.getElementById('cmpSent').innerHTML=cmpData[cmpIdx].s.replace('___',`<span class="blank" style="color:var(--jade);border-color:var(--jade)">${opts[cmpSel].textContent}</span>`);fb('fbCmp','¡Correcto! +5 XP',true);if(!xpTracker.cmp.has(cmpIdx)){xpTracker.cmp.add(cmpIdx);pts(5);}sfx('ok');}else{opts[cmpSel].classList.add('wrong');opts[cmpData[cmpIdx].c].classList.add('correct');fb('fbCmp','Incorrecto. Revisa bien la respuesta.',false);sfx('no');}setTimeout(()=>{cmpIdx++;document.getElementById('fbCmp').classList.remove('show');showCmp();},1600);}

// ===================== WIDGETS =====================
// Widget 1: Percibe-Decide-Actúa (ordenar el ciclo en casos concretos)
const routeSets=[
  {label:'La linterna de pilas en un apagón',steps:['La corriente sale del polo + de la pila','Viaja por el cable hasta el interruptor','El interruptor cerrado la deja pasar','La corriente llega al foquito y lo enciende','Regresa por el otro cable al polo − de la pila']},
  {label:'El carrito con motor del aula',steps:['La batería empuja la corriente por su polo +','El cable lleva la corriente hasta el interruptor','Con el interruptor cerrado el camino queda completo','El motor recibe la corriente y hace girar la rueda','La corriente vuelve a la batería y el ciclo continúa']},
  {label:'La lámpara solar del caserío',steps:['El panel solar recibe la luz del sol y produce electricidad','La electricidad se guarda en la batería durante el día','Al oscurecer, el circuito de la lámpara se cierra','El LED enciende y alumbra el patio','Al amanecer el circuito se abre y el LED se apaga']},
];
let currentRouteIdx=0,routeItems=[];
function buildRoute(){routeItems=_shuffle([...routeSets[currentRouteIdx].steps]);renderRoute();const fbEl=document.getElementById('fbRoute');if(fbEl)fbEl.classList.remove('show');}
function renderRoute(){const list=document.getElementById('routeList');if(!list)return;list.innerHTML='';routeItems.forEach((step,i)=>{const div=document.createElement('div');div.className='sort-item';div.innerHTML=`<div class="sort-arrows"><button class="sort-arrow" onclick="routeMove(${i},-1)"${i===0?' disabled':''}>▲</button><button class="sort-arrow" onclick="routeMove(${i},1)"${i===routeItems.length-1?' disabled':''}>▼</button></div><div class="sort-step-num">${i+1}.</div><div class="sort-item-txt">${step}</div>`;list.appendChild(div);});}
function routeMove(idx,dir){sfx('click');const ni=idx+dir;if(ni<0||ni>=routeItems.length)return;[routeItems[idx],routeItems[ni]]=[routeItems[ni],routeItems[idx]];renderRoute();}
function checkRoute(){const correct=routeSets[currentRouteIdx].steps;const isOk=routeItems.every((s,i)=>s===correct[i]);if(isOk){fb('fbRoute','¡Perfecto! Orden correcto. +4 XP',true);if(!xpTracker.wgt.has('route_'+currentRouteIdx)){xpTracker.wgt.add('route_'+currentRouteIdx);pts(4);}sfx('fan');fin('s-widgets');unlockAchievement('widgets_master');}else{fb('fbRoute','Hay pasos fuera de orden. Recuerda: la corriente sale de la fuente, pasa por el interruptor y la carga, y regresa.',false);sfx('no');}}
function nextRoute(){sfx('click');currentRouteIdx=(currentRouteIdx+1)%routeSets.length;buildRoute();showToast('🔄 Caso: '+routeSets[currentRouteIdx].label);}

// Widget 2: ¿Qué sensor necesita?
const neuronPartes=[
  {desc:'Quieres que la luz se encienda y se apague sin desconectar los cables',ans:'Un interruptor',opts:['Un interruptor','Una resistencia','Un aislante','Un panel solar']},
  {desc:'Necesitas el empuje (voltaje) para que la corriente circule',ans:'Una pila',opts:['Una pila','Un cable','Un interruptor','Un zumbador']},
  {desc:'Quieres transformar la electricidad en movimiento',ans:'Un motor',opts:['Un motor','Un LED','Un cable','Una resistencia']},
  {desc:'Quieres transformar la electricidad en luz gastando muy poca energía',ans:'Un LED',opts:['Un LED','Un motor','Un interruptor','Un aislante']},
  {desc:'Quieres transformar la electricidad en sonido para hacer un timbre',ans:'Un zumbador',opts:['Un zumbador','Un LED','Un cable','Una pila']},
  {desc:'Debes proteger el LED para que la corriente no lo queme',ans:'Una resistencia',opts:['Una resistencia','Un motor','Un interruptor','Un panel solar']},
  {desc:'Necesitas unir la pila con la carga para formar el camino',ans:'Un cable de cobre',opts:['Un cable de cobre','Un palito de madera','Una regla de plástico','Un vidrio']},
  {desc:'Quieres forrar la unión de dos cables para que nadie reciba corriente',ans:'Cinta aislante',opts:['Cinta aislante','Papel de aluminio','Alambre de cobre','Agua con sal']},
];
let neuronIdx=0,neuronDone=false;
function showNeuron(){neuronDone=false;if(neuronIdx>=neuronPartes.length){const el=document.getElementById('neuronDesc');if(el)el.textContent='🎉 ¡Ya sabes elegir el componente correcto!';const opts=document.getElementById('neuronOpts');if(opts)opts.innerHTML='';fin('s-widgets');return;}const d=neuronPartes[neuronIdx];const prog=document.getElementById('neuronProg');if(prog)prog.textContent=`Pista ${neuronIdx+1} de ${neuronPartes.length}`;const desc=document.getElementById('neuronDesc');if(desc)desc.textContent=d.desc;const opts=document.getElementById('neuronOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=opt;b.onclick=()=>checkNeuron(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuron');if(fbEl)fbEl.classList.remove('show');}
function checkNeuron(opt,btn,d){if(neuronDone)return;neuronDone=true;document.querySelectorAll('#neuronOpts .cmp-opt').forEach(b=>{if(b.textContent===d.ans)b.classList.add('correct');else if(b===btn&&b.textContent!==d.ans)b.classList.add('wrong');});const isOk=opt===d.ans;if(isOk){fb('fbNeuron','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuron_'+neuronIdx)){xpTracker.wgt.add('neuron_'+neuronIdx);pts(3);}sfx('ok');}else{fb('fbNeuron','La respuesta correcta es: '+d.ans,false);sfx('no');}}
function nextNeuron(){sfx('click');neuronIdx++;showNeuron();}
function resetNeuron(){sfx('click');neuronIdx=0;showNeuron();}

// Widget 3: Parte → Función
const neuroPairs=[
  {trans:'Pila',func:'Da el voltaje que empuja la corriente',opts:['Da el voltaje que empuja la corriente','Abre y cierra el camino','Transforma la electricidad en luz','Impide el paso de la corriente']},
  {trans:'Interruptor',func:'Abre o cierra el camino de la corriente',opts:['Abre o cierra el camino de la corriente','Empuja la corriente','Gira la rueda del carrito','Cubre el cable por fuera']},
  {trans:'LED',func:'Transforma la electricidad en luz',opts:['Transforma la electricidad en luz','Transforma la electricidad en movimiento','Guarda la energía del sol','Corta el paso de la corriente']},
  {trans:'Motor',func:'Transforma la electricidad en movimiento',opts:['Transforma la electricidad en movimiento','Transforma la electricidad en sonido','Mide el voltaje de la pila','Aísla el cable']},
  {trans:'Resistencia',func:'Estorba el paso de la corriente y protege al LED',opts:['Estorba el paso de la corriente y protege al LED','Aumenta el voltaje de la pila','Cierra el circuito','Conduce mejor que el cobre']},
];
let neuroIdx=0,neuroDone=false;
function showNeuro(){neuroDone=false;if(neuroIdx>=neuroPairs.length){const el=document.getElementById('neuroTrans');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('neuroOpts');if(opts)opts.innerHTML='';return;}const d=neuroPairs[neuroIdx];const prog=document.getElementById('neuroProg');if(prog)prog.textContent=`${neuroIdx+1} de ${neuroPairs.length}`;const trans=document.getElementById('neuroTrans');if(trans)trans.textContent=d.trans;const opts=document.getElementById('neuroOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkNeuro(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuro');if(fbEl)fbEl.classList.remove('show');}
function checkNeuro(opt,btn,d){if(neuroDone)return;neuroDone=true;document.querySelectorAll('#neuroOpts .qz-opt').forEach(b=>{if(b.textContent===d.func)b.classList.add('correct');else if(b===btn&&b.textContent!==d.func)b.classList.add('wrong');});const isOk=opt===d.func;if(isOk){fb('fbNeuro','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuro_'+neuroIdx)){xpTracker.wgt.add('neuro_'+neuroIdx);pts(3);}sfx('ok');}else{fb('fbNeuro','Correcto: '+d.func,false);sfx('no');}setTimeout(()=>{neuroIdx++;showNeuro();},1800);}
function resetNeuro(){sfx('click');neuroIdx=0;showNeuro();}

// Widget 4: ¿Robot o no es robot?
const enfermedadData=[
  {disease:'Armar un circuito con una pila AA, cable y foquito',characteristic:'Seguro',opts:['Seguro','Peligroso']},
  {disease:'Meter un alambre en el tomacorriente de 110 V',characteristic:'Peligroso',opts:['Peligroso','Seguro']},
  {disease:'Tocar el cargador del celular con las manos mojadas',characteristic:'Peligroso',opts:['Peligroso','Seguro']},
  {disease:'Unir el polo + y el polo − de la pila con un alambre',characteristic:'Peligroso',opts:['Peligroso','Seguro']},
  {disease:'Llevar las pilas usadas a un centro de acopio',characteristic:'Seguro',opts:['Seguro','Peligroso']},
  {disease:'Usar cables con su forro de plástico en buen estado',characteristic:'Seguro',opts:['Seguro','Peligroso']},
];
let enferIdx=0,enferDone=false;
function showEnfer(){enferDone=false;if(enferIdx>=enfermedadData.length){const el=document.getElementById('enferDisease');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('enferOpts');if(opts)opts.innerHTML='';return;}const d=enfermedadData[enferIdx];const prog=document.getElementById('enferProg');if(prog)prog.textContent=`${enferIdx+1} de ${enfermedadData.length}`;const dis=document.getElementById('enferDisease');if(dis)dis.textContent=d.disease;const opts=document.getElementById('enferOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkEnfer(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbEnfer');if(fbEl)fbEl.classList.remove('show');}
function checkEnfer(opt,btn,d){if(enferDone)return;enferDone=true;document.querySelectorAll('#enferOpts .qz-opt').forEach(b=>{if(b.textContent===d.characteristic)b.classList.add('correct');else if(b===btn&&b.textContent!==d.characteristic)b.classList.add('wrong');});const isOk=opt===d.characteristic;if(isOk){fb('fbEnfer','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('enfer_'+enferIdx)){xpTracker.wgt.add('enfer_'+enferIdx);pts(3);}sfx('ok');}else{fb('fbEnfer','Correcto: '+d.characteristic+'. Recuerda las reglas de seguridad eléctrica.',false);sfx('no');}setTimeout(()=>{enferIdx++;showEnfer();},1800);}
function resetEnfer(){sfx('click');enferIdx=0;showEnfer();}

// ===================== RETO FINAL =====================
const retoPairs=[
  {label:['Conductor','Aislante'],btnA:'🟠 Conductor',btnB:'🚫 Aislante',colA:'con',colB:'ais',
   words:[{w:'Cobre',t:'con'},{w:'Plástico',t:'ais'},{w:'Hierro',t:'con'},{w:'Madera seca',t:'ais'},{w:'Aluminio',t:'con'},{w:'Hule',t:'ais'},{w:'Moneda',t:'con'},{w:'Vidrio',t:'ais'},{w:'Agua con sal',t:'con'},{w:'Tela seca',t:'ais'}]},
  {label:['Serie','Paralelo'],btnA:'➖ Serie',btnB:'🛣️ Paralelo',colA:'ser',colB:'par',
   words:[{w:'Un solo camino',t:'ser'},{w:'Varios caminos',t:'par'},{w:'Si uno falla, todos se apagan',t:'ser'},{w:'Si uno falla, los otros siguen',t:'par'},{w:'Se reparten el voltaje',t:'ser'},{w:'Cada uno recibe todo el voltaje',t:'par'},{w:'Alumbran más débil',t:'ser'},{w:'Las luces de la casa',t:'par'},{w:'Luces viejas del arbolito',t:'ser'},{w:'Los tomacorrientes del aula',t:'par'}]},
  {label:['Fuente','Carga'],btnA:'🔋 Fuente',btnB:'💡 Carga',colA:'fue',colB:'car',
   words:[{w:'Pila AA',t:'fue'},{w:'LED',t:'car'},{w:'Batería del celular',t:'fue'},{w:'Motor',t:'car'},{w:'Panel solar',t:'fue'},{w:'Zumbador',t:'car'},{w:'Pila de 9 V',t:'fue'},{w:'Foquito de linterna',t:'car'},{w:'Tomacorriente',t:'fue'},{w:'Ventilador',t:'car'}]},
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
  {s:'El camino cerrado por donde circula la corriente se llama circuito.',type:'Circuito'},
  {s:'La pila da el empuje o voltaje que mueve la corriente.',type:'Fuente'},
  {s:'El interruptor abre o cierra el paso de la corriente.',type:'Interruptor'},
  {s:'El cobre del cable deja pasar la corriente con facilidad.',type:'Conductor'},
  {s:'El plástico que forra el cable no deja pasar la corriente.',type:'Aislante'},
  {s:'El LED transforma la electricidad en luz y necesita resistencia.',type:'Carga (LED)'},
  {s:'El motor transforma la electricidad en movimiento.',type:'Carga (motor)'},
  {s:'Si un foco se quema y se apagan todos, están conectados así.',type:'Circuito en serie'},
  {s:'Si un foco se quema y los demás siguen encendidos, están conectados así.',type:'Circuito en paralelo'},
  {s:'Cuando la pila se calienta porque la corriente encontró un atajo sin carga.',type:'Cortocircuito'},
];
const classifyTaskDB=[
  {w:'Alambre de cobre',gen:'Sí, muy bien',n:'Metal (cobre)',g:'Conductor',t:'Forma el camino del circuito'},
  {w:'Regla de plástico',gen:'No',n:'Plástico',g:'Aislante',t:'Sirve para protegernos, no para conducir'},
  {w:'Clavo de hierro',gen:'Sí',n:'Metal (hierro)',g:'Conductor',t:'Puede unir dos puntos del circuito'},
  {w:'Palito de madera seca',gen:'No',n:'Madera seca',g:'Aislante',t:'Sirve de mango o soporte'},
  {w:'Papel de aluminio',gen:'Sí',n:'Metal (aluminio)',g:'Conductor',t:'Puede reemplazar un cable en un experimento con pila'},
  {w:'Borrador de hule',gen:'No',n:'Hule',g:'Aislante',t:'Aísla y protege las manos'},
  {w:'Agua con sal',gen:'Sí',n:'Líquido con sales',g:'Conductor',t:'Por eso NUNCA se tocan aparatos con las manos mojadas'},
  {w:'Vidrio',gen:'No',n:'Vidrio',g:'Aislante',t:'Se usa para sostener piezas sin que pase corriente'},
];
const completeTaskDB=[
  {s:'La corriente circula solo si el camino está ___.',opts:['cerrado','roto','pintado'],ans:'cerrado'},
  {s:'La pila es la ___ de energía del circuito.',opts:['fuente','carga','resistencia'],ans:'fuente'},
  {s:'El ___ abre o cierra el paso de la corriente.',opts:['interruptor','cable','LED'],ans:'interruptor'},
  {s:'El cobre es un buen ___ de la electricidad.',opts:['conductor','aislante','imán'],ans:'conductor'},
  {s:'El plástico seco es un ___.',opts:['aislante','conductor','motor'],ans:'aislante'},
  {s:'En serie, si un foco se quema se apagan ___.',opts:['todos','ninguno','dos'],ans:'todos'},
  {s:'Las luces de la casa van en ___.',opts:['paralelo','serie','cortocircuito'],ans:'paralelo'},
  {s:'El LED lleva una ___ para no quemarse.',opts:['resistencia','pila','antena'],ans:'resistencia'},
];
const explainQuestions=[
  {q:'Dibuja un circuito básico y nombra sus cuatro partes. Explica el camino que recorre la corriente.',ans:'Debe dibujar la fuente (pila), los cables, el interruptor y la carga (LED, motor o zumbador). La corriente sale del polo + de la pila, recorre el cable, pasa por el interruptor cerrado y la carga, y regresa al polo −. Si el camino se abre en cualquier punto, nada funciona.'},
  {q:'Explica con tus palabras la diferencia entre circuito en serie y circuito en paralelo. ¿Cuál usarías para las luces de tu casa y por qué?',ans:'En serie hay un solo camino: los focos se reparten el voltaje y si uno se quema se apagan todos. En paralelo cada foco tiene su propio camino y recibe todo el voltaje: si uno se quema los demás siguen. En la casa se usa paralelo, porque así una lámpara quemada no deja a oscuras toda la vivienda.'},
  {q:'Haz una lista de 5 objetos de tu casa y clasifícalos en conductores y aislantes. Explica cómo lo sabes.',ans:'Respuesta libre. Los metales (cobre, hierro, aluminio) y el agua con sales conducen; el plástico, la madera seca, el hule y el vidrio aíslan. Se reconoce por el material: los cables llevan cobre adentro (conductor) y plástico afuera (aislante).'},
  {q:'Escribe cinco reglas de seguridad eléctrica para tu casa y tu escuela.',ans:'Respuesta libre. Debe incluir: nunca con las manos mojadas; no experimentar en los 110 V del tomacorriente (solo pilas); no meter objetos en los enchufes; no unir los polos de la pila (cortocircuito: la pila se calienta); no usar cables pelados; y no botar las pilas usadas en la basura común.'},
  {q:'La electricidad es una forma de energía. Explica en qué se transforma en un LED, en un motor y en un zumbador, y relaciónalo con la misión La Energía.',ans:'En el LED la energía eléctrica se transforma en energía luminosa; en el motor, en energía de movimiento (mecánica); en el zumbador, en energía sonora. Como se estudió en la misión La Energía, la energía no se crea ni se destruye: se transforma de una forma en otra.'},
];
let ansVisible=false;
function genTask(){sfx('click');const type=document.getElementById('tgType').value;const count=parseInt(document.getElementById('tgCount').value);ansVisible=false;const out=document.getElementById('tgOut');out.innerHTML='';if(type==='identify')genIdentifyTask(out,count);else if(type==='classify')genClassifyTask(out,count);else if(type==='complete')genCompleteTask(out,count);else if(type==='explain')genExplainTask(out,count);fin('s-tareas');}
function _instrBlock(out,title,lines){const ib=document.createElement('div');ib.className='tg-instruction-block';ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join('');out.appendChild(ib);}
function genIdentifyTask(out,count){_instrBlock(out,'Instrucción',['Copia en tu cuaderno; subraya, colorea o encierra el concepto de electricidad indicado en cada oración. Escribe al lado qué parte del circuito o qué idea es.','<strong>Ejemplo:</strong> El cobre deja pasar la corriente. → <span style="color:var(--jade);font-weight:700;">Conductor</span>']);_pick(identifyTaskDB,Math.min(count,identifyTaskDB.length)).forEach((item,i)=>{const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.type}</div></div>`;out.appendChild(div);});}
function genClassifyTask(out,count){_instrBlock(out,'Instrucción',['Copia la siguiente tabla en tu cuaderno. Para cada objeto responde: ¿conduce la corriente?, ¿de qué material es?, ¿es conductor o aislante? y ¿para qué sirve en un circuito?']);const items=_pick(classifyTaskDB,Math.min(count,classifyTaskDB.length));const wrap=document.createElement('div');wrap.style.overflowX='auto';const th=(t,extra='')=>`<th style="padding:0.3rem 0.4rem;border:1px solid var(--border);font-size:0.72rem;text-align:center;${extra}">${t}</th>`;let html=`<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:520px;"><thead><tr style="background:var(--pri-gl);">${th('Objeto','text-align:left;')}${th('¿Conduce?')}${th('Material')}${th('¿Conductor o aislante?')}${th('Uso en el circuito')}</tr></thead><tbody>`;items.forEach(it=>{html+=`<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td>`+Array(4).fill(`<td style="padding:0.4rem;border:1px solid var(--border);min-width:50px;"></td>`).join('')+'</tr>';});html+='</tbody></table>';wrap.innerHTML=html;out.appendChild(wrap);const ans=document.createElement('div');ans.className='tg-answer';ans.style.marginTop='0.8rem';ans.innerHTML='<strong>✅ Respuestas:</strong><br>'+items.map(it=>`<strong>${it.w}:</strong> ¿Conduce?: ${it.gen} | Material: ${it.n} | Tipo: ${it.g} | Uso: ${it.t}`).join('<br>');out.appendChild(ans);}
function genCompleteTask(out,count){_instrBlock(out,'Instrucción',['Copia y resuelve en tu cuaderno. Cada oración tiene un espacio ___. Elige y escribe la opción correcta.']);const pool=_shuffle([...completeTaskDB]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';const sent=item.s.replace('___','<span class="tg-blank" style="min-width:90px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${sent}</strong><div style="margin-top:0.4rem;font-size:0.82rem;color:var(--gray);">📝 Opciones: <strong>${item.opts.join(' | ')}</strong></div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function genExplainTask(out,count){_instrBlock(out,'Instrucción',['Copia las siguientes preguntas en tu cuaderno y responde cada una de forma clara y completa. Puedes acompañarlas con dibujos.']);const pool=_shuffle([...explainQuestions]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.3rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function toggleAns(){ansVisible=!ansVisible;document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none');sfx('click');}

// ===================== SOPA DE LETRAS =====================
const sopaSets=[
  {size:10,grid:[
    ['T','V','T','M','O','T','O','R','T','B'],
    ['R','J','O','P','U','Q','C','E','F','N'],
    ['L','I','I','L','E','D','L','D','L','Y'],
    ['L','L','B','J','T','B','U','F','E','D'],
    ['A','Q','E','T','A','A','C','B','C','M'],
    ['O','M','L','C','Z','F','J','S','O','D'],
    ['M','T','E','D','S','S','L','E','R','O'],
    ['Y','C','E','R','R','A','D','O','N','S'],
    ['S','O','T','I','U','C','R','I','C','G'],
    ['S','A','H','U','V','O','D','L','Z','C']
  ],words:[
    {w:'CIRCUITO',cells:[[8,8],[8,7],[8,6],[8,5],[8,4],[8,3],[8,2],[8,1]]},
    {w:'VOLTAJE',cells:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]},
    {w:'PILA',cells:[[1,3],[2,2],[3,1],[4,0]]},
    {w:'CABLE',cells:[[5,3],[4,4],[3,5],[2,6],[1,7]]},
    {w:'MOTOR',cells:[[0,3],[0,4],[0,5],[0,6],[0,7]]},
    {w:'CERRADO',cells:[[7,1],[7,2],[7,3],[7,4],[7,5],[7,6],[7,7]]}
  ]},
  {size:10,grid:[
    ['S','I','H','G','V','B','H','A','F','R'],
    ['E','Y','D','I','F','S','I','Q','O','Y'],
    ['T','H','E','P','F','G','Z','T','A','C'],
    ['N','R','P','T','R','T','C','R','I','O'],
    ['E','F','A','E','N','U','B','Z','C','B'],
    ['I','T','N','H','D','A','M','O','L','R'],
    ['R','E','P','N','N','R','L','A','C','E'],
    ['R','G','O','Q','J','Y','P','S','O','Z'],
    ['O','C','V','L','T','A','D','P','I','I'],
    ['C','P','A','R','A','L','E','L','O','A']
  ],words:[
    {w:'PARALELO',cells:[[9,1],[9,2],[9,3],[9,4],[9,5],[9,6],[9,7],[9,8]]},
    {w:'CONDUCTOR',cells:[[8,1],[7,2],[6,3],[5,4],[4,5],[3,6],[2,7],[1,8],[0,9]]},
    {w:'AISLANTE',cells:[[9,9],[8,8],[7,7],[6,6],[5,5],[4,4],[3,3],[2,2]]},
    {w:'ENERGIA',cells:[[6,1],[5,2],[4,3],[3,4],[2,5],[1,6],[0,7]]},
    {w:'COBRE',cells:[[2,9],[3,9],[4,9],[5,9],[6,9]]},
    {w:'CORRIENTE',cells:[[9,0],[8,0],[7,0],[6,0],[5,0],[4,0],[3,0],[2,0],[1,0]]}
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
const evalTFBank=[
  {q:'La corriente eléctrica necesita un camino cerrado para circular.',a:true},
  {q:'El interruptor sirve para abrir o cerrar el camino de la corriente.',a:true},
  {q:'El cobre es un buen conductor de la electricidad.',a:true},
  {q:'El plástico y la madera seca son buenos conductores.',a:false},
  {q:'En un circuito en serie, si un foco se quema se apagan todos.',a:true},
  {q:'En un circuito en paralelo, cada carga tiene su propio camino.',a:true},
  {q:'Las luces de una casa se conectan en serie.',a:false},
  {q:'El LED se puede conectar en cualquier sentido porque no tiene polaridad.',a:false},
  {q:'El LED necesita una resistencia para que la corriente no lo queme.',a:true},
  {q:'El voltaje es el empuje que la fuente da a la corriente.',a:true},
  {q:'La resistencia es el estorbo que se opone al paso de la corriente.',a:true},
  {q:'Para experimentar en el aula debemos usar el tomacorriente de 110 voltios.',a:false},
  {q:'Nunca debemos tocar aparatos eléctricos con las manos mojadas.',a:true},
  {q:'Un cortocircuito calienta la pila y puede ser peligroso.',a:true},
  {q:'Las pilas usadas se pueden botar en la basura común de la casa.',a:false},
];
const evalMCBank=[
  {q:'¿Qué es un circuito eléctrico?',o:['a) Un cable enrollado','b) El camino cerrado por donde circula la corriente','c) Una pila descargada','d) Un foco pintado'],a:1},
  {q:'¿Cuáles son las partes de un circuito básico?',o:['a) Fuente, cables, interruptor y carga','b) Sol, agua, aire y tierra','c) Motor, rueda, tornillo y clavo','d) Papel, goma, tijera y regla'],a:0},
  {q:'¿Para qué sirve el interruptor?',o:['a) Para aumentar el voltaje','b) Para pintar el circuito','c) Para abrir o cerrar el camino de la corriente','d) Para enfriar la pila'],a:2},
  {q:'Si se suelta un cable, el circuito queda…',o:['a) En paralelo','b) En serie','c) Cerrado','d) Abierto y nada funciona'],a:3},
  {q:'En un circuito EN SERIE se quema un foco. ¿Qué ocurre?',o:['a) Se apagan todos','b) Los demás alumbran más','c) No pasa nada','d) La pila se recarga'],a:0},
  {q:'¿Por qué las luces de una casa van EN PARALELO?',o:['a) Porque gastan menos cable','b) Porque si una falla, las demás siguen encendidas','c) Porque alumbran más débil','d) Porque no necesitan interruptor'],a:1},
  {q:'¿Cuál de estos materiales es AISLANTE?',o:['a) El cobre','b) El hierro','c) El plástico seco','d) El agua con sal'],a:2},
  {q:'¿Cuál de estos materiales es CONDUCTOR?',o:['a) La madera seca','b) El vidrio','c) El hule','d) El alambre de cobre'],a:3},
  {q:'¿Por qué el LED lleva una resistencia?',o:['a) Para que la corriente no lo queme','b) Para darle color','c) Para que pese más','d) Para pegarlo al cable'],a:0},
  {q:'¿Qué mide el voltaje?',o:['a) El peso del cable','b) El empuje que da la fuente a la corriente','c) La luz del foco','d) El tamaño de la pila'],a:1},
  {q:'¿Qué es un cortocircuito?',o:['a) Un circuito muy corto y bonito','b) Un circuito en paralelo','c) Un atajo sin carga que calienta la pila','d) Un cable de colores'],a:2},
  {q:'¿Cuál de estas prácticas es SEGURA?',o:['a) Meter alambres al tomacorriente','b) Tocar enchufes con las manos mojadas','c) Unir los dos polos de la pila con alambre','d) Experimentar solo con pilas y cables forrados'],a:3},
  {q:'En un LED, ¿en qué se transforma la energía eléctrica?',o:['a) En luz','b) En sonido','c) En agua','d) En viento'],a:0},
  {q:'En un motor, ¿en qué se transforma la energía eléctrica?',o:['a) En luz','b) En movimiento','c) En frío','d) En papel'],a:1},
  {q:'¿Qué se hace con las pilas usadas?',o:['a) Se botan en la basura común','b) Se entierran en la huerta','c) Se llevan a un centro de acopio o recolección especial','d) Se tiran al río'],a:2},
];
const evalCPBank=[
  {q:'La corriente solo circula si el camino está ___.',a:'cerrado'},
  {q:'La pila o batería es la ___ de energía del circuito.',a:'fuente'},
  {q:'El ___ abre o cierra el paso de la corriente.',a:'interruptor'},
  {q:'Dentro del cable va el ___, que es buen conductor.',a:'cobre'},
  {q:'El material que no deja pasar la corriente se llama ___.',a:'aislante'},
  {q:'El material que deja pasar la corriente se llama ___.',a:'conductor'},
  {q:'En un circuito en ___ hay un solo camino para la corriente.',a:'serie'},
  {q:'En un circuito en ___ cada carga tiene su propio camino.',a:'paralelo'},
  {q:'El empuje que da la fuente se llama ___.',a:'voltaje'},
  {q:'El estorbo que se opone al paso de la corriente se llama ___.',a:'resistencia'},
  {q:'El LED transforma la electricidad en ___.',a:'luz'},
  {q:'El motor transforma la electricidad en ___.',a:'movimiento'},
  {q:'Cuando la corriente encuentra un atajo sin carga ocurre un ___.',a:'cortocircuito'},
  {q:'Para experimentar en el aula usamos solo ___.',a:'pilas'},
  {q:'El LED tiene ___: solo enciende conectado en un sentido.',a:'polaridad'},
];
const evalPRBank=[
  {term:'Circuito eléctrico',def:'Camino cerrado por donde circula la corriente'},
  {term:'Fuente',def:'Pila o batería que empuja la corriente'},
  {term:'Interruptor',def:'Abre o cierra el camino de la corriente'},
  {term:'Cable',def:'Camino de cobre forrado con plástico'},
  {term:'Carga',def:'LED, motor o zumbador que aprovecha la electricidad'},
  {term:'Circuito abierto',def:'El camino está cortado y nada funciona'},
  {term:'Circuito en serie',def:'Un solo camino: si uno se quema se apagan todos'},
  {term:'Circuito en paralelo',def:'Cada carga tiene su camino; así van las luces de la casa'},
  {term:'Conductor',def:'Material que deja pasar la corriente, como el cobre'},
  {term:'Aislante',def:'Material que no deja pasar la corriente, como el plástico'},
  {term:'Voltaje',def:'El empuje de la fuente, medido en voltios'},
  {term:'Corriente',def:'La cantidad de electricidad que pasa, medida en amperios'},
  {term:'Resistencia',def:'El estorbo al paso de la corriente; protege al LED'},
  {term:'Cortocircuito',def:'Atajo sin carga que calienta la pila; es peligroso'},
  {term:'Polaridad',def:'El LED solo enciende conectado en un sentido'},
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

function genEval(){sfx('click');_evalFormaSelector(); const _selF = document.getElementById('evalFormaSel'); if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10))); const cf = evalFormNum; const rng = _evalRng(cf); window._currentEvalForm=cf;evalFormNum = (evalFormNum % EVAL_FORMAS) + 1; _evalFormaSelector();saveProgress();document.getElementById('eval-screen-title').textContent=`🎓 Evaluación Final · Forma ${cf} · Electricidad para Robots`;evalAnsVisible=false;const out=document.getElementById('evalOut');out.innerHTML='';const bar=document.createElement('div');bar.className='eval-score-bar';bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje · 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25 pts</span><span class="eval-score-pill esp-tf">V/F 25 pts</span><span class="eval-score-pill esp-mc">Selección 25 pts</span><span class="eval-score-pill esp-pr">Pareados 25 pts</span></div>`;out.appendChild(bar);const cpItems=_pickF(evalCPBank,5, rng);const s1=document.createElement('div');s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';cpItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='cp';d.dataset.evalIndex=i;const qHtml=item.q.replace('___',`<input class="eval-cp-input" type="text" data-cp="${i}" autocomplete="off">`);d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbCp${i}" aria-live="polite"></div>`;s1.appendChild(d);});out.appendChild(s1);const tfItems=_pickF(evalTFBank,5, rng);const s2=document.createElement('div');s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';tfItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='tf';d.dataset.evalIndex=i;d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="true"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="false"> Falso</label></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbTf${i}" aria-live="polite"></div>`;s2.appendChild(d);});out.appendChild(s2);const mcItems=_pickF(evalMCBank,5, rng);const s3=document.createElement('div');s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';mcItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='mc';d.dataset.evalIndex=i;const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join('');d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbMc${i}" aria-live="polite"></div>`;s3.appendChild(d);});out.appendChild(s3);const prItems=_pickF(evalPRBank,5, rng);let shuffledDefs=_shuffleF(prItems, rng);let _prTries=0;while(shuffledDefs.some((df,ix)=>df.def===prItems[ix].def)&&_prTries<20){shuffledDefs=_shuffleF(shuffledDefs, rng);_prTries++;}const letters=['A','B','C','D','E'];const s4=document.createElement('div');s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';const matchCard=document.createElement('div');matchCard.className='eval-item';let colLeft='<div class="eval-match-col"><h4>📌 Términos</h4>';prItems.forEach((item,i)=>{colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> <select class="eval-match-select" data-pr="${i}" aria-label="Respuesta pareada ${i+16}"><option value="">—</option>${letters.map(l=>`<option value="${l}">${l}</option>`).join('')}</select> ${item.term}</div>`;});colLeft+='</div>';let colRight='<div class="eval-match-col"><h4>🔑 Definiciones</h4>';shuffledDefs.forEach((item,i)=>{colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`;});colRight+='</div>';const ansKey=prItems.map((item,i)=>{const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)];return`${i+16}→${letter}`;}).join(' · ');matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div><div class="eval-item-feedback" id="evalFbPr" aria-live="polite"></div>`;s4.appendChild(matchCard);out.appendChild(s4);window._evalPrintData={tf:tfItems,mc:mcItems,cp:cpItems,pr:{terms:prItems,shuffledDefs,letters}};const autoPanel=document.createElement('div');autoPanel.id='evalAutoResult';autoPanel.className='eval-auto-result';autoPanel.innerHTML='<strong>🧮 Evaluación interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato original sin respuestas digitadas.';out.appendChild(autoPanel);fin('s-evaluacion');}
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación Electricidad para Robots · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.12rem 0.4rem;margin:0.22rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #0e7490;background:#ecfeff;color:#0e7490;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#0e7490;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #0e7490;height:12px;}.obt-pct{white-space:nowrap;}.qn{font-weight:700;min-width:22px;flex-shrink:0;}.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:40px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.18rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.14rem 0.35rem;margin-bottom:0.1rem;break-inside:avoid;page-break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.3;display:flex;gap:0.28rem;margin-bottom:0.07rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.1rem 0.5rem;}.mc-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:0.04rem 0.15rem;margin-left:0.8rem;}.mc-opt{font-size:9pt;display:flex;align-items:center;gap:0.15rem;}.mc-opt input{width:10px;height:10px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{margin-top:0.1rem;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.08rem 0.4rem;margin-top:0.08rem;}.pr-head{font-size:9pt;font-weight:700;color:#555;margin-bottom:0.1rem;}.pr-item{font-size:10.5pt;padding:0.1rem 0.28rem;background:#ecfeff;border-radius:3px;margin-bottom:0.07rem;display:flex;align-items:center;gap:0.2rem;line-height:1.2;break-inside:avoid;page-break-inside:avoid;}.pr-num{font-weight:700;color:#0e7490;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.22rem;padding:0.15rem 0;page-break-before:avoid;break-before:avoid;color:#0e7490;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #0e7490;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#555;}.pa{color:#007a00;font-weight:600;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · Electricidad para Robots · Educación Básica · Robótica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Evaluación Final · Electricidad para Robots · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u</div></div><div class="p-grid">${pR}</div>
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
const critSensorBank=[
  {txt:'Armaste el circuito con pila, cables, interruptor y un LED, cierras el interruptor y el LED NO enciende.',ans:'Revisar en orden: ① que el camino esté completo (cables bien sujetos, sin puntas sueltas), ② que la pila tenga carga, ③ la polaridad del LED (pata larga al +, pata corta al −) y ④ que lleve su resistencia. Basta un punto abierto para que nada funcione.'},
  {txt:'El foquito enciende solo mientras aprietas los cables con la mano; al soltarlos se apaga.',ans:'Hay un contacto flojo: el circuito se abre al soltar. Se debe asegurar la unión (retorcer bien el alambre, usar cinta aislante o un portapilas) para que el camino quede cerrado por sí solo.'},
  {txt:'La pila se calienta muchísimo, el alambre también, y la carga sigue apagada.',ans:'Es un CORTOCIRCUITO: la corriente encontró un atajo del + al − sin pasar por la carga. Hay que desconectar de inmediato (la pila puede quemar o reventar) y rehacer el circuito para que la corriente pase por la carga.'},
  {txt:'Tienes dos foquitos conectados en serie y ninguno enciende; al revisar, uno tiene el filamento roto.',ans:'En SERIE hay un solo camino: el foco quemado abre el circuito y por eso se apagan los dos. Se cambia el foco quemado o se conectan en PARALELO para que cada uno tenga su propio camino.'},
  {txt:'De dos focos en paralelo, uno no enciende y el otro alumbra normalmente.',ans:'Como están en PARALELO, cada uno tiene su camino: la falla es solo del foco apagado (quemado o mal conectado). Se revisa ese ramal; el otro sigue funcionando porque su camino está completo.'},
  {txt:'Conectaste un LED directo a una pila de 9 V, sin resistencia, y se quemó al instante.',ans:'Sin resistencia pasa demasiada corriente por el LED y lo destruye. Siempre se coloca una resistencia en serie con el LED para limitar la corriente; también hay que respetar su polaridad.'},
];
const critErrorBank=[
  {txt:'"La corriente pasa igual aunque el interruptor esté abierto, solo que más despacio."',
   g1:'Falso: con el interruptor ABIERTO el camino queda cortado y NO pasa nada de corriente; no es cuestión de velocidad.',
   g2:'La corriente necesita un camino CERRADO y completo: sale de un polo de la pila, pasa por la carga y regresa al otro polo.'},
  {txt:'"Las luces de la casa van en serie: por eso, cuando se quema un foco, los demás siguen encendidos."',
   g1:'Se contradice: en SERIE, si un foco se quema se apagan TODOS, porque hay un solo camino.',
   g2:'Las luces de la casa van en PARALELO: cada lámpara tiene su propio camino y recibe todo el voltaje, por eso las demás siguen encendidas.'},
  {txt:'"El agua nunca conduce la electricidad, por eso da igual tener las manos mojadas."',
   g1:'El agua de la llave, del río o del sudor lleva SALES y sí conduce la electricidad.',
   g2:'Por eso jamás se tocan aparatos, enchufes ni cables con las manos mojadas: el cuerpo mojado se vuelve parte del circuito.'},
  {txt:'"Para que el LED alumbre más, hay que quitarle la resistencia y conectarlo directo a la pila de 9 V."',
   g1:'Sin resistencia pasa demasiada corriente y el LED se QUEMA en un instante: no alumbra más, se destruye.',
   g2:'Además el LED tiene POLARIDAD: si se conecta al revés no enciende. La resistencia va siempre en serie con él.'},
  {txt:'"Si uno los dos polos de la pila con un alambre, la pila se recarga sola."',
   g1:'No se recarga: se produce un CORTOCIRCUITO, la corriente pasa sin carga que la limite y la pila se CALIENTA.',
   g2:'Es peligroso: la pila puede quemar la mano, derramarse o reventar. La corriente siempre debe pasar por una carga (LED, motor o zumbador).'},
];
const critCicloQuestions=[
  '1. ¿Qué camino recorre la corriente? Descríbelo desde la pila hasta que regresa a ella.',
  '2. ¿Qué pasaría si se abre el interruptor o se suelta un cable? ¿Por qué?',
  '3. ¿En qué se transforma la energía eléctrica en este circuito?',
];
const critCicloBank=[
  {txt:'La linterna de pilas que usa tu familia durante los apagones: al mover el botón, el foquito enciende.',
   p:'La corriente sale del polo + de las pilas, pasa por el resorte y el cable metálico, llega al interruptor y de ahí al foquito, y regresa al polo −.',
   d:'El circuito quedaría ABIERTO y el foquito se apagaría, porque la corriente necesita un camino cerrado y completo.',
   a:'La energía eléctrica de las pilas se transforma en energía luminosa (y un poco de calor) en el foquito.'},
  {txt:'Un carrito de juguete con una pila, un interruptor y un motor que hace girar las ruedas.',
   p:'La corriente sale del + de la pila, recorre el cable hasta el interruptor cerrado, atraviesa el motor y vuelve al − de la pila.',
   d:'Con el interruptor abierto o un cable suelto el motor se detiene: sin camino cerrado no circula corriente.',
   a:'La energía eléctrica se transforma en energía de movimiento (mecánica) en el motor.'},
  {txt:'El timbre del aula: al presionar un botón suena un zumbador conectado a una batería.',
   p:'La corriente sale de la batería, pasa por el botón (que funciona como interruptor) y por el zumbador, y regresa a la batería.',
   d:'Al soltar el botón el circuito se abre y el sonido se corta de inmediato, porque el camino queda interrumpido.',
   a:'La energía eléctrica se transforma en energía sonora en el zumbador.'},
  {txt:'La lámpara solar del caserío: un panel solar carga una batería de día y de noche enciende un LED.',
   p:'De día la corriente va del panel solar a la batería; de noche sale de la batería, pasa por el circuito de encendido y por el LED, y regresa.',
   d:'Si un cable se suelta, el LED no enciende aunque la batería esté llena: el camino está abierto.',
   a:'La energía del sol (luminosa) se transforma en eléctrica, se guarda en la batería y vuelve a transformarse en luz en el LED.'},
  {txt:'El cargador del celular: se conecta al tomacorriente y la batería del teléfono se llena.',
   p:'La corriente entra por el tomacorriente al cargador, que la transforma en corriente de bajo voltaje, y por el cable llega a la batería del teléfono.',
   d:'Si el cable está dañado o mal conectado, el camino se abre y el teléfono no carga.',
   a:'La energía eléctrica se transforma en energía química guardada en la batería, y luego en luz, sonido y movimiento del teléfono.'},
];
const critCompareBank=[
  {a:'Conexión con un solo camino: los focos se reparten el voltaje y, si uno se quema, se apagan todos.',b:'Conexión en la que cada foco tiene su propio camino y recibe todo el voltaje; si uno se quema, los demás siguen.',
   ga:'El circuito en serie.',
   gb:'El circuito en paralelo.',
   gr:'Semejanza: en los dos hay una fuente, cables y varias cargas en un camino cerrado. Diferencia: en serie el camino es único (una falla apaga todo y la luz es más débil); en paralelo hay varios caminos (cada carga es independiente). Por eso las casas se cablean en paralelo.'},
  {a:'Material que deja pasar la corriente con facilidad, como el cobre del cable.',b:'Material que no deja pasar la corriente, como el plástico que forra el cable.',
   ga:'El conductor.',
   gb:'El aislante.',
   gr:'Semejanza: los dos están presentes en un mismo cable y son necesarios para que funcione con seguridad. Diferencia: el conductor forma el camino de la corriente; el aislante lo encierra y nos protege. Cuidado: el agua con sales conduce, por eso no se tocan aparatos con las manos mojadas.'},
  {a:'Estado del circuito en el que el camino está completo y la carga funciona.',b:'Estado del circuito en el que el camino está cortado y nada funciona.',
   ga:'El circuito cerrado.',
   gb:'El circuito abierto.',
   gr:'Semejanza: en los dos hay fuente, cables y carga; el interruptor cambia de uno a otro. Diferencia: cerrado deja circular la corriente (el LED enciende); abierto la detiene (por el interruptor, un cable suelto o un foco quemado en serie).'},
  {a:'El empuje que la pila da a la corriente; se mide en voltios (V).',b:'El estorbo que se opone al paso de la corriente; se mide en ohmios (Ω) y protege al LED.',
   ga:'El voltaje.',
   gb:'La resistencia.',
   gr:'Semejanza: los dos deciden cuánta corriente pasa por el circuito. Diferencia: el voltaje empuja (más voltaje, más corriente) y la resistencia frena (más resistencia, menos corriente). Por eso un LED con pila de 9 V necesita resistencia y con pila de 1.5 V casi no se nota.'},
];
const critDesignBank=[
  'En tu casa los apagones son frecuentes y en la noche nadie encuentra las velas ni la linterna.',
  'El corral de las gallinas queda oscuro y el zorro entra de noche sin que nadie se dé cuenta.',
  'En la escuela no hay timbre: la maestra tiene que salir al patio a gritar la hora del recreo.',
  'El caserío no tiene tendido eléctrico, pero sí mucho sol durante todo el día.',
  'En la pulpería no se dan cuenta cuando entra un cliente, porque la dueña está en la cocina.',
];
const critDesignGuide='Rúbrica de 3 criterios (total 20 pts) — ① PARTES DEL CIRCUITO (7 pts): nombra la fuente (pilas o panel solar), los cables, el interruptor y la carga (LED, motor o zumbador) y explica el camino cerrado. ② FUNCIONAMIENTO (6 pts): explica cuándo se cierra y cuándo se abre el circuito y en qué se transforma la energía eléctrica (luz, movimiento o sonido); si usa varias cargas, justifica serie o paralelo. ③ SEGURIDAD (7 pts): usa solo pilas (nunca los 110 V), cables forrados y manos secas, evita el cortocircuito y dice qué hará con las pilas usadas. Cualquier diseño vale si el camino queda cerrado y la solución es realista.';
function genEvalCrit(){
  sfx('click');
  _injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });
  const _sC = document.getElementById('evalCritFormaSel');
  if (_sC && parseInt(_sC.value, 10)) evalCritFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sC.value, 10)));
  const cf=evalCritFormNum;window._currentEvalCritForm=cf;const rngC = _evalRng(200000 + cf);evalCritFormNum=(evalCritFormNum%EVAL_FORMAS)+1;_injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });saveProgress();
  document.getElementById('evalcrit-screen-title').textContent=`🧠 Pensamiento Crítico · Forma ${cf} · Electricidad para Robots`;
  evalCritAnsVisible=false;
  const out=document.getElementById('evalCritOut');out.innerHTML='';
  const sens=_pickF(critSensorBank,2,rngC);
  const s1=document.createElement('div');
  s1.innerHTML=`<div class="eval-section-title">I. Diagnóstico de fallas <span class="eval-pts">20 pts</span></div><div class="eval-item">${sens.map((k,i)=>`<div class="crit-scenario">Caso ${i+1}: ${k.txt}</div><div class="crit-q-block"><div class="crit-q-label">¿Qué revisarías y en qué orden? Explica por qué esa falla deja el circuito sin funcionar.</div><textarea class="crit-textarea" rows="2" aria-label="Diagnóstico del caso ${i+1}"></textarea><div class="crit-pauta">${k.ans}</div></div>`).join('')}<div class="crit-selfscore"><label for="critScore0">Obtenido:</label><input type="number" id="critScore0" class="crit-score-input" data-score="0" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s1);
  const err=_pickF(critErrorBank,1,rngC)[0];
  const s2=document.createElement('div');
  s2.innerHTML=`<div class="eval-section-title">II. Corrige el error conceptual <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${err.txt}</div><p style="font-size:0.85rem;margin-bottom:0.5rem;">Esta afirmación tiene <strong>dos errores</strong>. Corrígelos con argumentos, usando lo que sabes del circuito eléctrico:</p><div class="crit-q-block"><div class="crit-q-label">Error 1 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 1 y su corrección"></textarea><div class="crit-pauta">${err.g1}</div></div><div class="crit-q-block"><div class="crit-q-label">Error 2 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 2 y su corrección"></textarea><div class="crit-pauta">${err.g2}</div></div><div class="crit-selfscore"><label for="critScore1">Obtenido:</label><input type="number" id="critScore1" class="crit-score-input" data-score="1" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s2);
  const cic=_pickF(critCicloBank,1,rngC)[0];
  const cicloGuides=[cic.p,cic.d,cic.a];
  const s3=document.createElement('div');
  s3.innerHTML=`<div class="eval-section-title">III. Analiza el circuito paso a paso <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${cic.txt}</div>${critCicloQuestions.map((q,i)=>`<div class="crit-q-block"><div class="crit-q-label">${q}</div><textarea class="crit-textarea" rows="2" aria-label="${q}"></textarea><div class="crit-pauta">${cicloGuides[i]}</div></div>`).join('')}<div class="crit-selfscore"><label for="critScore2">Obtenido:</label><input type="number" id="critScore2" class="crit-score-input" data-score="2" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s3);
  const cmp=_pickF(critCompareBank,1,rngC)[0];
  const s4=document.createElement('div');
  s4.innerHTML=`<div class="eval-section-title">IV. Comparación razonada <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-compare-grid"><div class="crit-compare-box"><h5>Caso A</h5>${cmp.a}</div><div class="crit-compare-box"><h5>Caso B</h5>${cmp.b}</div></div><div class="crit-q-block"><div class="crit-q-label">1. ¿Qué concepto corresponde a cada caso? 2. ¿En qué se parecen? 3. ¿En qué se diferencian? Da un ejemplo de cada uno.</div><textarea class="crit-textarea" rows="4" aria-label="Comparación razonada de los casos A y B"></textarea><div class="crit-pauta">Caso A: ${cmp.ga} · Caso B: ${cmp.gb} · ${cmp.gr}</div></div><div class="crit-selfscore"><label for="critScore3">Obtenido:</label><input type="number" id="critScore3" class="crit-score-input" data-score="3" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s4);
  const dis=_pickF(critDesignBank,1,rngC)[0];
  const s5=document.createElement('div');
  s5.innerHTML=`<div class="eval-section-title">V. Diseña y justifica tu circuito <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${dis}</div><div class="crit-q-block"><div class="crit-q-label">Inventa un circuito que resuelva este problema: escribe su nombre, qué FUENTE usa, cómo van los CABLES y el INTERRUPTOR, qué CARGA lleva (LED, motor o zumbador) y en qué se transforma la energía. Explica también cómo lo harás con seguridad.</div><textarea class="crit-textarea" rows="5" aria-label="Diseño y justificación del circuito"></textarea><div class="crit-pauta">${critDesignGuide}</div></div><div class="crit-selfscore"><label for="critScore4">Obtenido:</label><input type="number" id="critScore4" class="crit-score-input" data-score="4" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
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
  let s1=`<div class="sec-title"><span>I. Diagnóstico de fallas</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div>`;
  d.sens.forEach((k,i)=>{s1+=`<p class="crit-print-scenario">Caso ${i+1}: ${k.txt}</p><p class="crit-print-q">¿Qué revisarías y en qué orden? Explica por qué.</p>${lines(1)}`;});
  let s2=`<div class="sec-title"><span>II. Corrige el error conceptual</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.err.txt}</p><p class="crit-print-q">Esta afirmación tiene dos errores. Corrígelos con argumentos:</p><p class="crit-print-q"><strong>Error 1:</strong></p>${lines(1)}<p class="crit-print-q"><strong>Error 2:</strong></p>${lines(1)}`;
  let s3=`<div class="sec-title"><span>III. Analiza el circuito paso a paso</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.cic.txt}</p>`;
  critCicloQuestions.forEach(q=>{s3+=`<p class="crit-print-q">${q}</p>${lines(1)}`;});
  let s4=`<div class="sec-title"><span>IV. Comparación razonada</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><div class="crit-compare-print-grid"><div class="crit-compare-print-box"><strong>Caso A:</strong> ${d.cmp.a}</div><div class="crit-compare-print-box"><strong>Caso B:</strong> ${d.cmp.b}</div></div><p class="crit-print-q">1. ¿Qué concepto corresponde a cada caso? 2. ¿En qué se parecen? 3. ¿En qué se diferencian? Da un ejemplo de cada uno.</p>${lines(2)}`;
  let s5=`<div class="sec-title"><span>V. Diseña y justifica tu circuito</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.dis}</p><p class="crit-print-q">Inventa un circuito que resuelva este problema: escribe su nombre, qué FUENTE usa, cómo van los CABLES y el INTERRUPTOR, qué CARGA lleva y en qué se transforma la energía. Dibújalo con sus símbolos al reverso de la hoja.</p>${lines(4)}`;
  let pR='';
  pR+=`<div class="p-sec"><div class="p-ttl">I. Diagnóstico de fallas</div>${d.sens.map((k,i)=>`<div class="p-crit-line"><strong>Caso ${i+1}:</strong> ${k.ans}</div>`).join('')}</div>`;
  pR+=`<div class="p-sec"><div class="p-ttl">II. Corrige el error</div><div class="p-crit-line"><strong>Error 1:</strong> ${d.err.g1}</div><div class="p-crit-line"><strong>Error 2:</strong> ${d.err.g2}</div></div>`;
  pR+=`<div class="p-sec"><div class="p-ttl">III. Analiza el circuito</div><div class="p-crit-line"><strong>Percibe:</strong> ${d.cic.p}</div><div class="p-crit-line"><strong>Decide:</strong> ${d.cic.d}</div><div class="p-crit-line"><strong>Actúa:</strong> ${d.cic.a}</div></div>`;
  pR+=`<div class="p-sec"><div class="p-ttl">IV. Comparación</div><div class="p-crit-line"><strong>Caso A:</strong> ${d.cmp.ga}</div><div class="p-crit-line"><strong>Caso B:</strong> ${d.cmp.gb}</div><div class="p-crit-line">${d.cmp.gr}</div></div>`;
  pR+=`<div class="p-sec" style="grid-column:1/-1;"><div class="p-ttl">V. Diseña tu circuito — Rúbrica</div><div class="p-crit-line">${critDesignGuide}</div></div>`;
  const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Pensamiento Crítico Electricidad para Robots · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.1rem 0.4rem;margin:0.2rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #0e7490;background:#ecfeff;color:#0e7490;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#0e7490;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #0e7490;height:12px;}.obt-pct{white-space:nowrap;}.crit-print-scenario{font-size:10.5pt;background:#ecfeff;border-left:3px solid #0e7490;padding:0.2rem 0.5rem;margin:0.1rem 0 0.2rem;line-height:1.3;}.crit-print-q{font-size:10pt;font-weight:600;margin:0.15rem 0 0.08rem;line-height:1.25;}.ln{border-bottom:1px solid #111;min-height:12px;margin-bottom:2px;}.crit-compare-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin:0.15rem 0;}.crit-compare-print-box{font-size:9.5pt;background:#ecfeff;border-radius:4px;padding:0.25rem 0.4rem;line-height:1.25;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.08rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.9rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.45rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.1rem;margin-bottom:0.18rem;}.p-crit-line{font-size:11pt;color:#007a00;margin-bottom:0.18rem;line-height:1.35;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.2rem;padding:0.1rem 0;color:#0e7490;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #0e7490;}.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:12.7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="critEvalPage"><div class="ph"><h2>Evaluación Competencial · Pensamiento Crítico · Electricidad para Robots · Educación Básica · Robótica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 5 secciones de 20 puntos</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100</span></div></div><div class="pauta-wrap" id="critPautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Pensamiento Crítico · Electricidad para Robots · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 5 secciones × 20 pts c/u — respuesta abierta, usar como guía de corrección</div></div><div class="p-grid">${pR}</div></div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("critEvalPage",250,0.55,1.2);fit("critPautaPage",250,0.55,1.2);})();<\/script></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(doc);win.document.close();setTimeout(()=>win.print(),400);
}

// ===================== LABORATORIO DE LAS PARTES DEL ROBOT =====================
// ===================== LABORATORIO DE CIRCUITOS =====================
// Cada caso se resuelve con circuitoResuelve(): el resultado (enciende / no enciende)
// se calcula a partir de la estructura del circuito, nunca se escribe a mano.
const circuitoCasos=[
  {id:'correcto',nombre:'Circuito correcto',icon:'✅',tipo:'simple',cable:true,polaridad:true,corto:false,resistencia:true,
   cargas:[{n:'LED',emoji:'💡',quemada:false}],clave:[true],
   desc:'Pila, cables, interruptor y un LED con su resistencia. Todo está bien conectado.',
   pista:'Al cerrar el interruptor el camino queda completo: la corriente sale del +, pasa por la resistencia y el LED, y regresa al −.'},
  {id:'motor',nombre:'Circuito con motor',icon:'⚙️',tipo:'simple',cable:true,polaridad:true,corto:false,resistencia:false,
   cargas:[{n:'Motor',emoji:'⚙️',quemada:false}],clave:[true],
   desc:'La misma pila y el mismo interruptor, pero la carga ahora es un motor (el del carrito del aula).',
   pista:'El motor no necesita resistencia: transforma la energía eléctrica en movimiento. El camino cerrado sigue siendo lo esencial.'},
  {id:'suelto',nombre:'Cable suelto',icon:'✂️',tipo:'simple',cable:false,polaridad:true,corto:false,resistencia:true,
   cargas:[{n:'LED',emoji:'💡',quemada:false}],clave:[false],
   desc:'Un cable se zafó del portapilas: hay un hueco en el camino de regreso.',
   pista:'Aunque el interruptor esté cerrado, el circuito sigue ABIERTO en el punto del cable suelto: la corriente no puede completar la vuelta.'},
  {id:'reves',nombre:'Pila al revés',icon:'🔄',tipo:'simple',cable:true,polaridad:false,corto:false,resistencia:true,
   cargas:[{n:'LED',emoji:'💡',quemada:false}],clave:[false],
   desc:'La pila quedó al revés: el + donde iba el − y el − donde iba el +.',
   pista:'El LED tiene POLARIDAD: solo enciende en un sentido (pata larga al +, pata corta al −). Al revés no deja pasar la corriente.'},
  {id:'corto',nombre:'Cortocircuito',icon:'⚠️',tipo:'simple',cable:true,polaridad:true,corto:true,resistencia:true,
   cargas:[{n:'LED',emoji:'💡',quemada:false}],clave:[false],
   desc:'Un alambre pelado une los dos lados del circuito y le da un atajo a la corriente.',
   pista:'La corriente prefiere el atajo sin resistencia: el LED se queda apagado y la pila SE CALIENTA. Hay que desconectar de inmediato.'},
  {id:'serie',nombre:'Dos LED en serie',icon:'➖',tipo:'serie',cable:true,polaridad:true,corto:false,resistencia:true,
   cargas:[{n:'LED 1',emoji:'💡',quemada:false},{n:'LED 2',emoji:'💡',quemada:false}],clave:[true,true],
   desc:'Dos LED conectados uno detrás del otro: un solo camino para la corriente.',
   pista:'Los dos encienden, pero se REPARTEN el voltaje de la pila: alumbran más débil que uno solo.'},
  {id:'serie-quemado',nombre:'Serie con un LED quemado',icon:'💥',tipo:'serie',cable:true,polaridad:true,corto:false,resistencia:true,
   cargas:[{n:'LED 1',emoji:'💡',quemada:true},{n:'LED 2',emoji:'💡',quemada:false}],clave:[false,false],
   desc:'Los mismos dos LED en serie, pero el primero está quemado.',
   pista:'En SERIE hay un solo camino: el LED quemado abre el circuito y se apagan LOS DOS. Ese es el gran defecto de la conexión en serie.'},
  {id:'paralelo',nombre:'Dos LED en paralelo (uno quemado)',icon:'🛣️',tipo:'paralelo',cable:true,polaridad:true,corto:false,resistencia:true,
   cargas:[{n:'LED 1',emoji:'💡',quemada:true},{n:'LED 2',emoji:'💡',quemada:false}],clave:[false,true],
   desc:'Los dos LED tienen cada uno su propio camino; el primero está quemado.',
   pista:'En PARALELO cada carga es independiente: el quemado se queda apagado y el otro sigue alumbrando con todo el voltaje. Así van las luces de tu casa.'},
];
function circuitoResuelve(caso,cerrado){
  const apagado=caso.cargas.map(()=>false);
  if(!cerrado)return{enc:apagado,estado:'abierto',motivo:'🔴 <strong>Circuito ABIERTO:</strong> el interruptor corta el camino y la corriente no puede pasar. Nada funciona.'};
  if(!caso.cable)return{enc:apagado,estado:'roto',motivo:'🔴 <strong>Camino cortado:</strong> con un cable suelto el circuito sigue abierto aunque el interruptor esté cerrado.'};
  if(!caso.polaridad)return{enc:apagado,estado:'polaridad',motivo:'🔴 <strong>Pila al revés:</strong> el LED tiene polaridad y al revés no deja pasar la corriente.'};
  if(caso.corto)return{enc:apagado,estado:'corto',peligro:true,motivo:'⚠️ <strong>CORTOCIRCUITO:</strong> la corriente toma el atajo sin carga, el LED no enciende y la pila se calienta. ¡Desconecta ya!'};
  if(caso.tipo==='serie'){const q=caso.cargas.some(c=>c.quemada);return{enc:caso.cargas.map(()=>!q),estado:q?'serie-roto':'serie-ok',motivo:q?'🔴 <strong>En SERIE</strong> hay un solo camino: si una carga se quema, se apagan TODAS.':'🟢 <strong>En SERIE</strong> las dos encienden, pero se reparten el voltaje: alumbran más débil.'};}
  if(caso.tipo==='paralelo')return{enc:caso.cargas.map(c=>!c.quemada),estado:'paralelo',motivo:'🟢 <strong>En PARALELO</strong> cada carga tiene su camino: la quemada se apaga y la otra sigue con todo el voltaje.'};
  return{enc:caso.cargas.map(c=>!c.quemada),estado:'cerrado',motivo:'🟢 <strong>Circuito CERRADO:</strong> la corriente recorre todo el camino y la carga funciona.'};
}
function circuitoClave(caso){const e=caso.clave;if(e.every(x=>x))return 0;if(e.some(x=>x))return 1;return 2;}
const labPredOpts=['🟢 Sí, funciona todo','🟡 Funciona solo una parte','🔴 No funciona nada'];
let labCaso=circuitoCasos[0].id,labCerrado=false;
function _labCaso(){return circuitoCasos.find(c=>c.id===labCaso)||circuitoCasos[0];}
function _labCarga(x,y,carga,on,lado){
  let s='<circle cx="'+x+'" cy="'+y+'" r="17" fill="'+(on?'#fde68a':'#e5e7eb')+'" stroke="'+(on?'#f59e0b':'#9ca3af')+'" stroke-width="3"/>';
  if(on)s='<circle cx="'+x+'" cy="'+y+'" r="25" fill="#fde68a" opacity="0.45"/>'+s;
  s+='<text x="'+x+'" y="'+(y+6)+'" text-anchor="middle" font-size="16">'+carga.emoji+'</text>';
  const txt=carga.n+(carga.quemada?' ✖ quemado':'');
  s+=lado==='izq'
    ?'<text x="'+(x-28)+'" y="'+(y+5)+'" text-anchor="end" class="circ-lbl">'+txt+'</text>'
    :'<text x="'+x+'" y="'+(y+34)+'" text-anchor="middle" class="circ-lbl">'+txt+'</text>';
  return s;
}
function labSVG(caso,cerrado,res){
  const fluye=res.enc.some(x=>x),peligro=!!res.peligro;
  const wc='circ-wire'+(peligro?' circ-wire-danger':(fluye?' circ-wire-on':''));
  let s='<svg class="lab-circ-svg" viewBox="0 0 340 215" role="img" aria-label="Diagrama del circuito: '+caso.nombre+'">';
  if(caso.cable){s+='<path class="'+wc+'" d="M45 175 H295"/>';}
  else{s+='<path class="circ-wire" d="M45 175 H150"/><path class="circ-wire" d="M200 175 H295"/><text x="175" y="171" text-anchor="middle" font-size="17">✂️</text><text x="175" y="196" text-anchor="middle" class="circ-lbl-bad">cable suelto</text>';}
  s+='<path class="'+wc+'" d="M45 45 V80"/><path class="'+wc+'" d="M45 132 V175"/>';
  s+='<rect x="30" y="80" width="30" height="52" rx="6" fill="#fde68a" stroke="#b45309" stroke-width="3"/><text x="45" y="112" text-anchor="middle" font-size="16">🔋</text>';
  s+='<text x="66" y="90" font-size="15" font-weight="bold" fill="#b45309">'+(caso.polaridad?'+':'–')+'</text>';
  s+='<text x="66" y="130" font-size="15" font-weight="bold" fill="#b45309">'+(caso.polaridad?'–':'+')+'</text>';
  s+='<text x="45" y="152" text-anchor="middle" class="circ-lbl">pila'+(caso.polaridad?'':' al revés 🔄')+'</text>';
  s+='<path class="'+wc+'" d="M45 45 H128"/><path class="'+wc+'" d="M172 45 H295"/>';
  s+='<circle cx="128" cy="45" r="4" fill="#155e75"/><circle cx="172" cy="45" r="4" fill="#155e75"/>';
  s+=cerrado?'<path class="circ-lever" d="M128 45 H172"/>':'<path class="circ-lever" d="M128 45 L168 21"/>';
  s+='<text x="150" y="14" text-anchor="middle" class="circ-lbl">interruptor '+(cerrado?'cerrado 🟢':'abierto 🔴')+'</text>';
  if(caso.tipo==='paralelo'){
    const w0='circ-wire'+(res.enc[0]?' circ-wire-on':''),w1='circ-wire'+(res.enc[1]?' circ-wire-on':'');
    s+='<path class="'+w0+'" d="M225 45 V88"/><path class="'+w0+'" d="M225 126 V175"/>'+_labCarga(225,107,caso.cargas[0],res.enc[0]);
    s+='<path class="'+w1+'" d="M295 45 V88"/><path class="'+w1+'" d="M295 126 V175"/>'+_labCarga(295,107,caso.cargas[1],res.enc[1]);
    s+='<text x="170" y="207" text-anchor="middle" class="circ-lbl">dos caminos: cada carga es independiente</text>';
  }else if(caso.tipo==='serie'){
    s+='<path class="'+wc+'" d="M295 45 V63"/><path class="'+wc+'" d="M295 97 V128"/><path class="'+wc+'" d="M295 162 V175"/>';
    s+=_labCarga(295,80,caso.cargas[0],res.enc[0],'izq')+_labCarga(295,145,caso.cargas[1],res.enc[1],'izq');
    s+='<text x="170" y="207" text-anchor="middle" class="circ-lbl">un solo camino: la corriente pasa por las dos</text>';
  }else{
    // con cortocircuito la rama de la carga se queda sin corriente: se dibuja sin animación
    const wb=caso.corto?'circ-wire':wc;
    s+='<path class="'+wb+'" d="M295 45 V62"/>';
    if(caso.resistencia){s+='<rect x="284" y="62" width="22" height="14" rx="3" fill="#fff7ed" stroke="#c2410c" stroke-width="2.5"/><text x="295" y="73" text-anchor="middle" font-size="9" fill="#c2410c" font-weight="bold">Ω</text><path class="'+wb+'" d="M295 76 V88"/>';}
    else{s+='<path class="'+wb+'" d="M295 62 V88"/>';}
    s+=_labCarga(295,107,caso.cargas[0],res.enc[0]);
    s+='<path class="'+wb+'" d="M295 126 V175"/>';
    if(caso.resistencia&&!caso.corto)s+='<text x="274" y="60" text-anchor="end" class="circ-lbl">resistencia</text>';
    if(caso.corto){s+='<path class="circ-wire circ-wire-danger" d="M225 45 V175"/><text x="225" y="103" text-anchor="middle" font-size="18">🔥</text><text x="218" y="128" text-anchor="end" class="circ-lbl-bad">atajo sin carga</text><text x="170" y="207" text-anchor="middle" class="circ-lbl-bad">¡la pila se calienta: desconecta ya!</text>';}
  }
  s+='</svg>';
  return s;
}
function labShowCaso(id){labCaso=id;labCerrado=false;updateLabDisplay();document.querySelectorAll('.lab-cont-btn').forEach(b=>b.classList.remove('active-pri'));const btn=document.querySelector('[data-caso="'+id+'"]');if(btn)btn.classList.add('active-pri');const f=document.getElementById('fbLab');if(f)f.classList.remove('show');if(typeof sfx==='function')sfx('click');}
function labToggle(){labCerrado=!labCerrado;updateLabDisplay();if(typeof sfx==='function')sfx(labCerrado?'ok':'click');}
function labPredice(i){
  const caso=_labCaso(),correcta=circuitoClave(caso);
  document.querySelectorAll('#labPredOpts .cmp-opt').forEach((b,ix)=>{b.classList.remove('sel','correct','wrong');if(ix===correcta)b.classList.add('correct');else if(ix===i)b.classList.add('wrong');});
  if(i===correcta){
    if(!xpTracker.wgt.has('lab_'+caso.id)){xpTracker.wgt.add('lab_'+caso.id);pts(3);}
    fb('fbLab','¡Correcto! '+caso.pista,true);if(typeof sfx==='function')sfx('ok');
    if(circuitoCasos.every(c=>xpTracker.wgt.has('lab_'+c.id))){fin('s-lab');unlockAchievement('lab_circuito');}
  }else{fb('fbLab','Todavía no. Cierra el interruptor y observa qué pasa. '+caso.pista,false);if(typeof sfx==='function')sfx('no');}
  labCerrado=true;updateLabDisplay();
}
function updateLabDisplay(){
  const caso=_labCaso(),res=circuitoResuelve(caso,labCerrado);
  const st=document.getElementById('lab-sentence');
  if(st)st.innerHTML='🔬 Probando: <strong>'+caso.icon+' '+caso.nombre+'</strong> → <strong>interruptor '+(labCerrado?'cerrado':'abierto')+'</strong>';
  const stage=document.getElementById('labStage');
  if(stage)stage.innerHTML=labSVG(caso,labCerrado,res);
  const sw=document.getElementById('labSwitchBtn');
  if(sw)sw.textContent=labCerrado?'🔘 Abrir el interruptor':'🔘 Cerrar el interruptor';
  const disp=document.getElementById('lab-display');
  if(disp){
    const estado=caso.cargas.map((c,i)=>c.n+': '+(res.enc[i]?'🟢 funciona':'⚫ apagada')).join(' · ');
    disp.innerHTML='<div class="lab-cont-header">'+caso.icon+' '+caso.nombre+'</div><div class="lab-asp-title">'+caso.desc+'</div><div class="lab-asp-info">'+res.motivo+'<br><strong>Resultado:</strong> '+estado+'</div>';
  }
  const op=document.getElementById('labPredOpts');
  if(op&&op.children.length===0){labPredOpts.forEach((t,i)=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=t;b.onclick=()=>labPredice(i);op.appendChild(b);});}
}
// ===================== WIDGET: DIAGNÓSTICO DE FALLAS =====================
const diagData=[
  {desc:'El LED no enciende y el interruptor está cerrado. ¿Qué revisas PRIMERO?',ans:'Que el camino esté completo: cables bien sujetos y sin puntas sueltas',opts:['Que el camino esté completo: cables bien sujetos y sin puntas sueltas','El color del cable','El tamaño del LED','La marca de la pila']},
  {desc:'El LED sigue apagado, los cables están bien y la pila es nueva. ¿Qué revisas ahora?',ans:'La polaridad del LED: pata larga al + y pata corta al −',opts:['La polaridad del LED: pata larga al + y pata corta al −','Cambiar de mesa','Soplar el LED','Mojar los cables']},
  {desc:'La pila se calienta mucho y nada enciende. ¿Qué ocurre?',ans:'Hay un cortocircuito: desconecta de inmediato',opts:['Hay un cortocircuito: desconecta de inmediato','La pila está feliz','Falta voltaje','El LED es muy grande']},
  {desc:'La luz enciende solo cuando aprietas los cables con la mano. ¿Cuál es la falla?',ans:'Un contacto flojo: hay que asegurar bien la unión',opts:['Un contacto flojo: hay que asegurar bien la unión','El interruptor sobra','El cobre está cansado','Falta un aislante']},
  {desc:'Dos focos en serie: ninguno enciende y uno tiene el filamento roto. ¿Por qué se apagaron los dos?',ans:'En serie hay un solo camino: el foco quemado lo abre',opts:['En serie hay un solo camino: el foco quemado lo abre','Porque la pila es de 1.5 V','Porque están en paralelo','Porque el cable es corto']},
  {desc:'Dos focos en paralelo: uno no enciende y el otro sí. ¿Dónde está la falla?',ans:'Solo en el ramal del foco apagado; el otro camino está bien',opts:['Solo en el ramal del foco apagado; el otro camino está bien','En toda la casa','En la pila','En el interruptor general']},
  {desc:'Conectaste un LED a una pila de 9 V y se quemó al instante. ¿Qué faltó?',ans:'La resistencia que limita la corriente del LED',opts:['La resistencia que limita la corriente del LED','Un aislante','Más voltaje','Otro interruptor']},
  {desc:'Tu compañero quiere probar el circuito en el tomacorriente de 110 V. ¿Qué le dices?',ans:'Que no: en el aula se experimenta solo con pilas',opts:['Que no: en el aula se experimenta solo con pilas','Que lo haga rápido','Que use las manos mojadas','Que quite el forro de los cables']},
];
let diagIdx=0,diagDone=false;
function showDiag(){
  diagDone=false;
  if(diagIdx>=diagData.length){const el=document.getElementById('diagDesc');if(el)el.textContent='🎉 ¡Eres todo un técnico en diagnóstico eléctrico!';const o=document.getElementById('diagOpts');if(o)o.innerHTML='';fin('s-widgets');unlockAchievement('seguridad_pro');return;}
  const d=diagData[diagIdx];
  const prog=document.getElementById('diagProg');if(prog)prog.textContent='Falla '+(diagIdx+1)+' de '+diagData.length;
  const desc=document.getElementById('diagDesc');if(desc)desc.textContent=d.desc;
  const opts=document.getElementById('diagOpts');if(!opts)return;opts.innerHTML='';
  _shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=opt;b.onclick=()=>checkDiag(opt,b,d);opts.appendChild(b);});
  const f=document.getElementById('fbDiag');if(f)f.classList.remove('show');
}
function checkDiag(opt,btn,d){
  if(diagDone)return;diagDone=true;
  document.querySelectorAll('#diagOpts .cmp-opt').forEach(b=>{if(b.textContent===d.ans)b.classList.add('correct');else if(b===btn)b.classList.add('wrong');});
  if(opt===d.ans){fb('fbDiag','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('diag_'+diagIdx)){xpTracker.wgt.add('diag_'+diagIdx);pts(3);}sfx('ok');}
  else{fb('fbDiag','Lo correcto es: '+d.ans,false);sfx('no');}
}
function nextDiag(){sfx('click');diagIdx++;showDiag();}
function resetDiag(){sfx('click');diagIdx=0;showDiag();}

// ===================== DIPLOMA =====================
function _diplPct(){return xp>=MXP?100:Math.round((xp/MXP)*100);}
function openDiploma(){sfx('fan');const pct=_diplPct();document.getElementById('diplPct').textContent=pct+'%';document.getElementById('diplBar').style.width=pct+'%';document.getElementById('diplDate').textContent='Fecha: '+new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});const msgs=['¡Sigue aprendiendo!','¡Muy buen trabajo!','¡Vas muy bien!','¡Dominas el circuito eléctrico!','¡Maestro del Circuito!'];document.getElementById('diplMsg').textContent=msgs[Math.min(Math.floor(pct/25),4)];const stars=['⭐','⭐⭐','⭐⭐⭐'];document.getElementById('diplStars').textContent=stars[Math.min(Math.floor(pct/40),2)];const achTxt=unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(' · ');document.getElementById('diplAch').textContent=achTxt||'Sigue completando secciones para desbloquear logros';document.getElementById('diplomaOverlay').classList.add('open');launchConfetti();}
function closeDiploma(){document.getElementById('diplomaOverlay').classList.remove('open');}
function updateDiplomaName(v){document.getElementById('diplName').textContent=v||'Estudiante';}
function shareWA(){const name=document.getElementById('diplName').textContent||'Estudiante';const pct=_diplPct();const msg=`⚡ ¡${name} completó la Misión "Electricidad para Robots"! 🏅 Progreso: ${pct}% · 🌱 policastsapien.com`;_waShare(msg);}
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
  showDiag();
  updateLabDisplay();
  document.querySelector('[data-caso="'+circuitoCasos[0].id+'"]')?.classList.add('active-pri');
  renderAchPanel();
});

(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalCrit==='function') _injectFormaSel('genEvalCrit','evalCritFormaSel',evalCritFormNum,function(v){evalCritFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();
