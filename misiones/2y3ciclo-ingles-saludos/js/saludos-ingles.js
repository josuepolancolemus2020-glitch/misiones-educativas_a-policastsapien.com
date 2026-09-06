// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
function compartirMision(){const url=window.location.href;const texto=`🗣️ *Misión Asignada* 🗣️\n\nPractica sobre este tema y sobresale en ser de los mejores alumnos. 🏆\n\nDesbloquea *todos los logros* y puedes poner *tus datos* para que tu maestro observe todos tus logros. 📋\n\n_Se te hará prueba escrita y serás excelente estudiante en Inglés._ 🗣️\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;_waShare(texto);}
function toggleLetra(){document.body.classList.toggle('letra-grande');if(typeof sfx==='function')sfx('click');localStorage.setItem('preferenciaLetra',document.body.classList.contains('letra-grande'));}
window.addEventListener('DOMContentLoaded',()=>{if(localStorage.getItem('preferenciaLetra')==='true')document.body.classList.add('letra-grande');});

// ===================== UTILIDADES =====================
const _pick=(arr,n)=>[...arr].sort(()=>Math.random()-0.5).slice(0,n);
const _shuffle=(arr)=>[...arr].sort(()=>Math.random()-0.5);
function fb(id,msg,isOk){const el=document.getElementById(id);if(el){el.textContent=msg;el.className='fb show '+(isOk?'ok':'err');}}

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY='ingles_saludos_v1';
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
  primer_quiz:{icon:'🗣️',label:'Primer quiz de inglés superado'},
  flash_master:{icon:'🃏',label:'Todas las expresiones exploradas'},
  clasif_pro:{icon:'🗂️',label:'Experto en saludos y despedidas'},
  id_master:{icon:'🔍',label:'Identificador de expresiones maestro'},
  reto_hero:{icon:'🏆',label:'Héroe del reto Greeting vs Farewell'},
  nivel3:{icon:'🧭',label:'¡English Explorer! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡Confident Speaker! Nivel 6'},
  widgets_master:{icon:'🧩',label:'Conversaciones ordenadas y dominadas'}
};
function unlockAchievement(id){if(unlockedAch.includes(id))return;unlockedAch.push(id);sfx('ach');showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label);launchConfetti();renderAchPanel();saveProgress();}
function renderAchPanel(){const list=document.getElementById('achList');list.innerHTML='';Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{const div=document.createElement('div');div.className='ach-item'+(unlockedAch.includes(id)?'':' locked');div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`;list.appendChild(div);});}
function toggleAchPanel(){sfx('click');document.getElementById('achPanel').classList.toggle('open');}
function showToast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}t.textContent=msg;t.style.display='block';clearTimeout(t._tid);t._tid=setTimeout(()=>t.style.display='none',3200);}
function launchConfetti(){const colors=['#be185d','#22d3ee','#c2410c','#fb923c','#06b6d4'];for(let i=0;i<60;i++){const c=document.createElement('div');c.className='confetti-piece';c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`;document.body.appendChild(c);c.addEventListener('animationend',()=>c.remove());}}

// ===================== XP =====================
let lvls=[{t:0,n:'Beginner 🌱'},{t:25,n:'First Words 🔤'},{t:55,n:'English Explorer 🧭'},{t:90,n:'Good Listener 👂'},{t:130,n:'Nice to Meet You 🤝'},{t:165,n:'Confident Speaker 🗣️'},{t:190,n:'Hello Master 🏆'}];
function pts(n){xp=Math.max(0,Math.min(MXP,xp+n));updateXPBar();saveProgress();}
function updateXPBar(){const pct=Math.round((xp/MXP)*100);document.getElementById('xpFill').style.width=pct+'%';const el=document.getElementById('xpPts');el.textContent='⭐ '+xp;el.style.transform='scale(1.3)';setTimeout(()=>el.style.transform='',300);let lv=0;for(let i=0;i<lvls.length;i++)if(xp>=lvls[i].t)lv=i;document.getElementById('xpLvl').textContent=lvls[lv].n;if(lv!==prevLevel){if(lv>=2)unlockAchievement('nivel3');if(lv>=5)unlockAchievement('nivel5');prevLevel=lv;}}
function resetXP(){sfx('click');xp=0;updateXPBar();showToast('🔄 XP reiniciado a 0');}
function fin(id,showFX=true){if(!done.has(id)){done.add(id);const b=document.querySelector(`[data-s="${id}"]`);if(b)b.classList.add('done');if(showFX){sfx('up');launchConfetti();}saveProgress();}}
function getProgress(){return Math.round((done.size/TOTAL_SECTIONS)*100);}

// ===================== NAV =====================
function go(id){sfx('click');document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});document.getElementById(id).classList.add('active');const btn=document.querySelector(`[data-s="${id}"]`);if(btn){btn.classList.add('active');btn.setAttribute('aria-selected','true');}window.scrollTo({top:0,behavior:'smooth'});if(id==='s-sopa'){setTimeout(buildSopa,50);}if(id==='s-widgets'){setTimeout(buildRoute,50);}}

// ===================== MINI-QUIZ (sección Partes) =====================
function miniQ(btn,isOk,fbId){const wrap=btn.parentElement;if(wrap.dataset.done==='1')return;wrap.querySelectorAll('.cmp-opt').forEach(b=>b.classList.remove('sel'));if(isOk){wrap.dataset.done='1';btn.classList.add('correct');fb(fbId,'¡Correcto! Ya piensas en inglés.',true);sfx('ok');}else{btn.classList.add('wrong');fb(fbId,'Casi. Pregúntate: ¿qué hora es y con quién hablo?',false);sfx('no');}}

// ===================== FLASHCARD DATA =====================
let fcData=[
  {w:'Hello',a:'Hola. Sirve a <strong>cualquier hora</strong> y con cualquier persona. Se dice «je-LOU»: la <strong>h</strong> sopla.'},
  {w:'Hi',a:'Hola, informal. Con <strong>amigos y compañeros</strong>. Se dice «jai», no «i».'},
  {w:'Good morning',a:'Buenos días. Desde que amanece <strong>hasta las 12 del mediodía</strong>. Se dice «gud MOR-ning».'},
  {w:'Good afternoon',a:'Buenas tardes. <strong>De 12 a 6</strong> de la tarde. Se dice «gud af-ter-NUN».'},
  {w:'Good evening',a:'Buenas noches, pero <strong>al llegar</strong>. Se usa desde las 6 de la tarde. Se dice «gud IV-ning».'},
  {w:'Good night',a:'Buenas noches <strong>al despedirse</strong> o al ir a dormir. ⚠️ <strong>Nunca</strong> para saludar.'},
  {w:'What is your name?',a:'¿Cómo te llamas? Se escribe <strong>What’s your name?</strong> y se dice «guats yor NEIM».'},
  {w:'My name is…',a:'Me llamo… También puedes decir <strong>I’m…</strong>, que es más corto y natural.'},
  {w:'Nice to meet you',a:'Mucho gusto. Se dice al <strong>conocer a alguien por primera vez</strong>. Se dice «nais tu MIT yu».'},
  {w:'How are you?',a:'¿Cómo estás? Se responde <strong>I’m fine, thank you. And you?</strong> Se dice «jau ar YU».'},
  {w:'I am fine, thank you',a:'Estoy bien, gracias. La respuesta más común y educada. Se dice «aim FAIN, zenk yu».'},
  {w:'Goodbye',a:'Adiós, formal. Entre amigos basta <strong>Bye</strong>. Se dice «gud-BAI».'},
  {w:'See you tomorrow',a:'Nos vemos mañana. También <strong>See you later</strong> (hasta luego). Se dice «si yu tu-MO-rou».'},
  {w:'Thank you',a:'Gracias. La <strong>th</strong> va con la lengua entre los dientes: «ZENK yu», no «tenk».'},
];
let fcIdx=0;
function upFC(){document.getElementById('fcInner').classList.remove('flipped');document.getElementById('fcW').textContent=fcData[fcIdx].w;document.getElementById('fcA').innerHTML=fcData[fcIdx].a;document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length;}
function flipCard(){sfx('flip');document.getElementById('fcInner').classList.toggle('flipped');if(!xpTracker.fc.has(fcIdx)){xpTracker.fc.add(fcIdx);pts(1);}if(xpTracker.fc.size===fcData.length){fin('s-flash');unlockAchievement('flash_master');}}
function nextFC(){sfx('click');fcIdx=(fcIdx+1)%fcData.length;upFC();}
function prevFC(){sfx('click');fcIdx=(fcIdx-1+fcData.length)%fcData.length;upFC();}

// ===================== JUEGO: MEMORIA DEL ROBOT =====================
let memoPairs=[
  {id:'hello',t:'Hello',d:'👋 Hola · a cualquier hora'},
  {id:'morning',t:'Good morning',d:'🌅 Buenos días · hasta las 12'},
  {id:'evening',t:'Good evening',d:'🌇 Buenas noches · al llegar'},
  {id:'night',t:'Good night',d:'🌙 Buenas noches · al irse'},
  {id:'name',t:'What’s your name?',d:'🙋 ¿Cómo te llamas?'},
  {id:'thanks',t:'Thank you',d:'🙏 Gracias · lengua entre los dientes'}
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
  {q:'Son las 8:00 de la mañana. ¿Cómo saludas?',o:['a) Good night','b) Good morning','c) Good evening','d) Goodbye'],c:1},
  {q:'¿Qué significa «Good evening»?',o:['a) Buenas noches, al llegar','b) Buenas noches, al irse','c) Buenas tardes','d) Buenos días'],c:0},
  {q:'Llegas a una fiesta a las 8 de la noche. ¿Qué dices?',o:['a) Good night','b) Good morning','c) Good evening','d) See you'],c:2},
  {q:'¿Cómo preguntas el nombre de alguien?',o:['a) How are you?','b) What’s your name?','c) Nice to meet you','d) How old are you?'],c:1},
  {q:'Alguien te dice «Nice to meet you». ¿Qué significa?',o:['a) ¿Cómo estás?','b) Hasta mañana','c) Mucho gusto','d) ¿De dónde eres?'],c:2},
  {q:'¿Cuál es la respuesta más común a «How are you?»?',o:['a) My name is Ana','b) I’m fine, thank you. And you?','c) Good night','d) You’re welcome'],c:1},
  {q:'¿Cuál de estos saludos es INFORMAL?',o:['a) Good afternoon','b) Good morning','c) Hi','d) Nice to meet you'],c:2},
  {q:'Te vas de la casa de un amigo y lo verás mañana. ¿Qué dices?',o:['a) Good morning','b) See you tomorrow','c) Nice to meet you','d) What’s your name?'],c:1},
  {q:'En «Hello» y «How», la letra h…',o:['a) es muda como en español','b) suena como una j suave','c) suena como una s','d) no se escribe'],c:1},
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
  {label:['Saludo','Despedida'],headA:'👋 Greeting (saludo)',headB:'🚪 Farewell (despedida)',colA:'sen',colB:'act',
   words:[{w:'Hello',t:'sen'},{w:'Goodbye',t:'act'},{w:'Good morning',t:'sen'},{w:'See you later',t:'act'},{w:'Hi',t:'sen'},{w:'Good night',t:'act'},{w:'Good afternoon',t:'sen'},{w:'Bye',t:'act'},{w:'Good evening',t:'sen'},{w:'See you tomorrow',t:'act'}]},
  {label:['Formal','Informal'],headA:'🎩 Formal',headB:'🙌 Informal',colA:'rob',colB:'no',
   words:[{w:'Good morning',t:'rob'},{w:'Hi',t:'no'},{w:'Good afternoon',t:'rob'},{w:'Hey',t:'no'},{w:'Nice to meet you',t:'rob'},{w:'Bye',t:'no'},{w:'Goodbye',t:'rob'},{w:'See you',t:'no'},{w:'Good evening',t:'rob'},{w:'What’s up?',t:'no'}]},
  {label:['Pregunta','Respuesta'],headA:'❓ Question (pregunta)',headB:'💬 Answer (respuesta)',colA:'per',colB:'act',
   words:[{w:'What’s your name?',t:'per'},{w:'My name is Ana',t:'act'},{w:'How are you?',t:'per'},{w:'I’m fine, thank you',t:'act'},{w:'And you?',t:'per'},{w:'Nice to meet you, too',t:'act'},{w:'How old are you?',t:'per'},{w:'I’m twelve',t:'act'}]},
  {label:['Antes de las 12','Después de las 6'],headA:'🌅 Antes de las 12',headB:'🌇 Después de las 6',colA:'sim',colB:'ele',
   words:[{w:'Good morning',t:'sim'},{w:'Good evening',t:'ele'},{w:'Rise and shine',t:'sim'},{w:'Good night',t:'ele'},{w:'Breakfast time',t:'sim'},{w:'Dinner time',t:'ele'},{w:'Wake up',t:'sim'},{w:'Sleep well',t:'ele'}]},
];
let currentClassGroupIdx=0,clsSelectedWord=null;
function buildClass(){const group=classGroups[currentClassGroupIdx];document.getElementById('col-left-head').textContent=group.headA;document.getElementById('col-right-head').textContent=group.headB;const bank=document.getElementById('clsBank');bank.innerHTML='';clsSelectedWord=null;document.getElementById('items-left').innerHTML='';document.getElementById('items-right').innerHTML='';_shuffle([...group.words]).forEach(w=>{const el=document.createElement('div');el.className='wb-item';el.textContent=w.w;el.dataset.t=w.t;el.onclick=()=>{document.querySelectorAll('.wb-item').forEach(i=>i.classList.remove('sel-word'));el.classList.add('sel-word');clsSelectedWord=el;sfx('click');};bank.appendChild(el);});['col-left','col-right'].forEach(colId=>{const col=document.getElementById(colId);col.onclick=(e)=>{if(!clsSelectedWord||e.target.classList.contains('drop-item'))return;const targetId=colId==='col-left'?'items-left':'items-right';const wordsCol=document.getElementById(targetId);const item=document.createElement('div');item.className='drop-item';item.textContent=clsSelectedWord.textContent;item.dataset.t=clsSelectedWord.dataset.t;const original=clsSelectedWord;item.onclick=(ev)=>{ev.stopPropagation();if(clsSelectedWord!==null){col.click();}else{document.getElementById('clsBank').appendChild(original);original.classList.remove('sel-word');item.remove();if(typeof sfx==='function')sfx('click');}};wordsCol.appendChild(item);clsSelectedWord.remove();clsSelectedWord=null;sfx('click');};});}
function checkClass(){const remaining=document.querySelectorAll('#clsBank .wb-item').length;if(remaining>0){fb('fbCls','Mueve todas las palabras a las columnas primero.',false);return;}const group=classGroups[currentClassGroupIdx];let allOk=true;document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{const inLeft=el.parentElement.id==='items-left';const expectedType=inLeft?group.colA:group.colB;if(el.dataset.t===expectedType){el.classList.add('cls-ok');}else{el.classList.add('cls-no');allOk=false;}});if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);}if(allOk){fb('fbCls','¡Perfecto! +5 XP',true);sfx('fan');fin('s-clasifica');unlockAchievement('clasif_pro');}else{fb('fbCls','Hay errores. Marcados en rojo.',false);sfx('no');}}
function nextClassGroup(){sfx('click');currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length;buildClass();document.getElementById('fbCls').classList.remove('show');showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]);}
function resetClass(){sfx('click');buildClass();document.getElementById('fbCls').classList.remove('show');}

// ===================== IDENTIFICAR =====================
let idData=[
  {s:['Good','morning,','teacher.'],c:1,art:'la palabra que indica que es de mañana'},
  {s:['What’s','your','name?'],c:2,art:'la palabra que significa «nombre»'},
  {s:['My','name','is','Ana.'],c:1,art:'la palabra que significa «nombre»'},
  {s:['Nice','to','meet','you.'],c:2,art:'la palabra que significa «conocer»'},
  {s:['How','are','you','today?'],c:0,art:'la palabra que significa «cómo»'},
  {s:['I’m','fine,','thank','you.'],c:1,art:'la palabra que significa «bien»'},
  {s:['See','you','tomorrow!'],c:2,art:'la palabra que significa «mañana» (el día siguiente)'},
  {s:['Good','night,','sleep','well.'],c:1,art:'la palabra que indica que es una despedida de noche'},
];
let idIdx=0,idDone=false;
function showId(){idDone=false;if(idIdx>=idData.length){document.getElementById('idSent').innerHTML='🎉 ¡Completado!';fin('s-identifica');unlockAchievement('id_master');return;}const d=idData[idIdx];document.getElementById('idProg').textContent=`Oración ${idIdx+1} de ${idData.length}`;document.getElementById('idInfo').textContent=`Busca: ${d.art}`;const sent=document.getElementById('idSent');sent.innerHTML='';d.s.forEach((w,i)=>{const span=document.createElement('span');span.className='id-word';span.textContent=w+' ';span.onclick=()=>checkId(i,span);sent.appendChild(span);});}
function checkId(i,span){if(idDone)return;document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected'));span.classList.add('selected');if(i===idData[idIdx].c){idDone=true;span.classList.add('id-ok');fb('fbId','¡Correcto! +5 XP',true);if(!xpTracker.id.has(idIdx)){xpTracker.id.add(idIdx);pts(5);}sfx('ok');}else{span.classList.add('id-no');fb('fbId','Ese no es el término solicitado.',false);sfx('no');}}
function nextId(){sfx('click');idIdx++;showId();document.getElementById('fbId').classList.remove('show');}
function resetId(){sfx('click');idIdx=0;showId();document.getElementById('fbId').classList.remove('show');}

// ===================== COMPLETA =====================
let cmpData=[
  {s:'— Good morning! — Good ___!',opts:['morning','night','bye'],c:0},
  {s:'— What’s your ___? — My name is Ana.',opts:['age','name','school'],c:1},
  {s:'— My name is Luis. — ___ to meet you!',opts:['Nice','Good','See'],c:0},
  {s:'— How ___ you? — I’m fine, thank you.',opts:['is','are','am'],c:1},
  {s:'— I’m fine, thank you. And ___? — I’m fine too.',opts:['me','you','he'],c:1},
  {s:'Llegas a las 7 de la noche: Good ___.',opts:['evening','morning','afternoon'],c:0},
  {s:'Te vas a dormir: Good ___.',opts:['night','evening','morning'],c:0},
  {s:'— Thank you! — You’re ___.',opts:['welcome','fine','name'],c:0},
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
// Widget 1: Percibe-Decide-Actúa (ordenar el ciclo en casos concretos)
let routeSets=[
  {label:'Dos compañeros se conocen en el aula',steps:['Hi! I’m Carlos. What’s your name?','My name is Ana.','Nice to meet you, Ana.','Nice to meet you, too.']},
  {label:'Un alumno saluda a su maestra en la mañana',steps:['Good morning, teacher.','Good morning! How are you?','I’m fine, thank you. And you?','I’m fine, too. Have a nice day!']},
  {label:'Despedida al final de la clase',steps:['It’s time to go. Goodbye, teacher.','Goodbye, Ana. See you tomorrow.','See you tomorrow!','Good night!']},
];
let currentRouteIdx=0,routeItems=[];
function buildRoute(){routeItems=_shuffle([...routeSets[currentRouteIdx].steps]);renderRoute();const fbEl=document.getElementById('fbRoute');if(fbEl)fbEl.classList.remove('show');}
function renderRoute(){const list=document.getElementById('routeList');if(!list)return;list.innerHTML='';routeItems.forEach((step,i)=>{const div=document.createElement('div');div.className='sort-item';div.innerHTML=`<div class="sort-arrows"><button class="sort-arrow" onclick="routeMove(${i},-1)"${i===0?' disabled':''}>▲</button><button class="sort-arrow" onclick="routeMove(${i},1)"${i===routeItems.length-1?' disabled':''}>▼</button></div><div class="sort-step-num">${i+1}.</div><div class="sort-item-txt">${step}</div>`;list.appendChild(div);});}
function routeMove(idx,dir){sfx('click');const ni=idx+dir;if(ni<0||ni>=routeItems.length)return;[routeItems[idx],routeItems[ni]]=[routeItems[ni],routeItems[idx]];renderRoute();}
function checkRoute(){const correct=routeSets[currentRouteIdx].steps;const isOk=routeItems.every((s,i)=>s===correct[i]);if(isOk){fb('fbRoute','¡Perfecto! Orden correcto. +4 XP',true);if(!xpTracker.wgt.has('route_'+currentRouteIdx)){xpTracker.wgt.add('route_'+currentRouteIdx);pts(4);}sfx('fan');fin('s-widgets');unlockAchievement('widgets_master');}else{fb('fbRoute','El diálogo está fuera de orden. Recuerda: saludo → presentación → cortesía → despedida.',false);sfx('no');}}
function nextRoute(){sfx('click');currentRouteIdx=(currentRouteIdx+1)%routeSets.length;buildRoute();showToast('🔄 Caso: '+routeSets[currentRouteIdx].label);}

// Widget 2: ¿Qué dirías en esta situación?
let neuronPartes=[
  {desc:'Entras al aula a las 7:00 de la mañana y saludas a tu maestra',ans:'Good morning',opts:['Good morning','Good night','Good evening','Goodbye']},
  {desc:'Llegas a una reunión familiar a las 8:00 de la noche',ans:'Good evening',opts:['Good evening','Good night','Good morning','See you']},
  {desc:'Te vas a dormir y te despides de tu mamá',ans:'Good night',opts:['Good night','Good evening','Hello','Nice to meet you']},
  {desc:'Conoces por primera vez al director de la escuela',ans:'Nice to meet you',opts:['Nice to meet you','See you later','What’s up?','Good night']},
  {desc:'Quieres saber cómo se llama tu nuevo compañero',ans:'What’s your name?',opts:['What’s your name?','How are you?','Where are you?','How old are you?']},
  {desc:'Un amigo te pregunta «How are you?» y estás bien',ans:'I’m fine, thank you',opts:['I’m fine, thank you','My name is Ana','Good night','You’re welcome']},
  {desc:'Sales de clase y verás a tu compañera al día siguiente',ans:'See you tomorrow',opts:['See you tomorrow','Good morning','Nice to meet you','Please']},
  {desc:'Alguien te presta un lápiz y quieres agradecer',ans:'Thank you',opts:['Thank you','You’re welcome','Good night','And you?']},
];
let neuronIdx=0,neuronDone=false;
function showNeuron(){neuronDone=false;if(neuronIdx>=neuronPartes.length){const el=document.getElementById('neuronDesc');if(el)el.textContent='🎉 ¡Ya sabes qué decir en cada situación!';const opts=document.getElementById('neuronOpts');if(opts)opts.innerHTML='';fin('s-widgets');return;}const d=neuronPartes[neuronIdx];const prog=document.getElementById('neuronProg');if(prog)prog.textContent=`Pista ${neuronIdx+1} de ${neuronPartes.length}`;const desc=document.getElementById('neuronDesc');if(desc)desc.textContent=d.desc;const opts=document.getElementById('neuronOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=opt;b.onclick=()=>checkNeuron(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuron');if(fbEl)fbEl.classList.remove('show');}
function checkNeuron(opt,btn,d){if(neuronDone)return;neuronDone=true;document.querySelectorAll('#neuronOpts .cmp-opt').forEach(b=>{if(b.textContent===d.ans)b.classList.add('correct');else if(b===btn&&b.textContent!==d.ans)b.classList.add('wrong');});const isOk=opt===d.ans;if(isOk){fb('fbNeuron','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuron_'+neuronIdx)){xpTracker.wgt.add('neuron_'+neuronIdx);pts(3);}sfx('ok');}else{fb('fbNeuron','La respuesta correcta es: '+d.ans,false);sfx('no');}}
function nextNeuron(){sfx('click');neuronIdx++;showNeuron();}
function resetNeuron(){sfx('click');neuronIdx=0;showNeuron();}

// Widget 3: Parte → Función
let neuroPairs=[
  {trans:'Good evening',func:'Buenas noches, al llegar a un lugar',opts:['Buenas noches, al llegar a un lugar','Buenas noches, al irse a dormir','Buenas tardes','Buenos días']},
  {trans:'Nice to meet you',func:'Mucho gusto, al conocer a alguien',opts:['Mucho gusto, al conocer a alguien','¿Cómo estás?','Hasta mañana','De nada']},
  {trans:'How are you?',func:'¿Cómo estás?',opts:['¿Cómo estás?','¿Cómo te llamas?','¿Cuántos años tienes?','¿De dónde eres?']},
  {trans:'See you tomorrow',func:'Nos vemos mañana',opts:['Nos vemos mañana','Mucho gusto','Buenos días','Por favor']},
  {trans:'You’re welcome',func:'De nada, respuesta a Thank you',opts:['De nada, respuesta a Thank you','Bienvenido a mi casa','Estoy bien','¿Y tú?']},
];
let neuroIdx=0,neuroDone=false;
function showNeuro(){neuroDone=false;if(neuroIdx>=neuroPairs.length){const el=document.getElementById('neuroTrans');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('neuroOpts');if(opts)opts.innerHTML='';return;}const d=neuroPairs[neuroIdx];const prog=document.getElementById('neuroProg');if(prog)prog.textContent=`${neuroIdx+1} de ${neuroPairs.length}`;const trans=document.getElementById('neuroTrans');if(trans)trans.textContent=d.trans;const opts=document.getElementById('neuroOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkNeuro(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuro');if(fbEl)fbEl.classList.remove('show');}
function checkNeuro(opt,btn,d){if(neuroDone)return;neuroDone=true;document.querySelectorAll('#neuroOpts .qz-opt').forEach(b=>{if(b.textContent===d.func)b.classList.add('correct');else if(b===btn&&b.textContent!==d.func)b.classList.add('wrong');});const isOk=opt===d.func;if(isOk){fb('fbNeuro','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuro_'+neuroIdx)){xpTracker.wgt.add('neuro_'+neuroIdx);pts(3);}sfx('ok');}else{fb('fbNeuro','Correcto: '+d.func,false);sfx('no');}setTimeout(()=>{neuroIdx++;showNeuro();},1800);}
function resetNeuro(){sfx('click');neuroIdx=0;showNeuro();}

// Widget 4: ¿Formal o informal?
let enfermedadData=[
  {disease:'Good afternoon, Mrs. López.',characteristic:'Formal',opts:['Formal','Informal']},
  {disease:'Hey! What’s up?',characteristic:'Informal',opts:['Informal','Formal']},
  {disease:'Nice to meet you, sir.',characteristic:'Formal',opts:['Formal','Informal']},
  {disease:'Bye! See you!',characteristic:'Informal',opts:['Informal','Formal']},
  {disease:'Good morning, Principal.',characteristic:'Formal',opts:['Formal','Informal']},
  {disease:'Hi, Carlos!',characteristic:'Informal',opts:['Informal','Formal']},
];
let enferIdx=0,enferDone=false;
function showEnfer(){enferDone=false;if(enferIdx>=enfermedadData.length){const el=document.getElementById('enferDisease');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('enferOpts');if(opts)opts.innerHTML='';return;}const d=enfermedadData[enferIdx];const prog=document.getElementById('enferProg');if(prog)prog.textContent=`${enferIdx+1} de ${enfermedadData.length}`;const dis=document.getElementById('enferDisease');if(dis)dis.textContent=d.disease;const opts=document.getElementById('enferOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkEnfer(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbEnfer');if(fbEl)fbEl.classList.remove('show');}
function checkEnfer(opt,btn,d){if(enferDone)return;enferDone=true;document.querySelectorAll('#enferOpts .qz-opt').forEach(b=>{if(b.textContent===d.characteristic)b.classList.add('correct');else if(b===btn&&b.textContent!==d.characteristic)b.classList.add('wrong');});const isOk=opt===d.characteristic;if(isOk){fb('fbEnfer','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('enfer_'+enferIdx)){xpTracker.wgt.add('enfer_'+enferIdx);pts(3);}sfx('ok');}else{fb('fbEnfer','Correcto: '+d.characteristic+'. Pregúntate: ¿a quién se lo dirías?',false);sfx('no');}setTimeout(()=>{enferIdx++;showEnfer();},1800);}
function resetEnfer(){sfx('click');enferIdx=0;showEnfer();}

// ===================== RETO FINAL =====================
let retoPairs=[
  {label:['Saludo','Despedida'],btnA:'👋 Saludo',btnB:'🚪 Despedida',colA:'sen',colB:'act',
   words:[{w:'Hello',t:'sen'},{w:'Goodbye',t:'act'},{w:'Good morning',t:'sen'},{w:'Bye',t:'act'},{w:'Hi',t:'sen'},{w:'See you later',t:'act'},{w:'Good afternoon',t:'sen'},{w:'Good night',t:'act'},{w:'Good evening',t:'sen'},{w:'See you tomorrow',t:'act'}]},
  {label:['Formal','Informal'],btnA:'🎩 Formal',btnB:'🙌 Informal',colA:'rob',colB:'no',
   words:[{w:'Good morning',t:'rob'},{w:'Hi',t:'no'},{w:'Nice to meet you',t:'rob'},{w:'Hey',t:'no'},{w:'Good evening',t:'rob'},{w:'Bye',t:'no'},{w:'Goodbye',t:'rob'},{w:'See you',t:'no'},{w:'Good afternoon',t:'rob'},{w:'What’s up?',t:'no'}]},
  {label:['Pregunta','Respuesta'],btnA:'❓ Pregunta',btnB:'💬 Respuesta',colA:'per',colB:'act',
   words:[{w:'What’s your name?',t:'per'},{w:'My name is Ana',t:'act'},{w:'How are you?',t:'per'},{w:'I’m fine, thanks',t:'act'},{w:'And you?',t:'per'},{w:'Nice to meet you, too',t:'act'},{w:'How old are you?',t:'per'},{w:'I’m twelve',t:'act'},{w:'Where are you from?',t:'per'},{w:'I’m from Honduras',t:'act'}]},
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
  {s:'Good morning, teacher!',type:'Saludo de la mañana'},
  {s:'Good afternoon, class.',type:'Saludo de la tarde'},
  {s:'Good evening, everyone.',type:'Saludo de la noche (al llegar)'},
  {s:'Good night, sleep well.',type:'Despedida de la noche'},
  {s:'What’s your name?',type:'Pregunta por el nombre'},
  {s:'My name is Ana.',type:'Respuesta con el nombre'},
  {s:'Nice to meet you.',type:'Cortesía al conocer a alguien'},
  {s:'How are you?',type:'Pregunta por el estado'},
  {s:'I’m fine, thank you.',type:'Respuesta al How are you?'},
  {s:'See you tomorrow!',type:'Despedida hasta el día siguiente'},
];
let classifyTaskDB=[
  {w:'Good morning',gen:'Saludo',n:'De 6:00 a 11:59',g:'Formal y también con amigos',t:'Buenos días'},
  {w:'Hi',gen:'Saludo',n:'A cualquier hora',g:'Informal: amigos y compañeros',t:'Hola'},
  {w:'Good evening',gen:'Saludo',n:'Desde las 6:00 de la tarde',g:'Formal, al llegar',t:'Buenas noches (al llegar)'},
  {w:'Good night',gen:'Despedida',n:'Al irse o al dormir',g:'Formal e informal',t:'Buenas noches (al irse)'},
  {w:'Goodbye',gen:'Despedida',n:'A cualquier hora',g:'Formal',t:'Adiós'},
  {w:'See you later',gen:'Despedida',n:'A cualquier hora',g:'Informal',t:'Hasta luego'},
  {w:'Nice to meet you',gen:'Cortesía',n:'Al conocer a alguien',g:'Formal',t:'Mucho gusto'},
  {w:'Thank you',gen:'Cortesía',n:'A cualquier hora',g:'Siempre correcto',t:'Gracias'},
];
let completeTaskDB=[
  {s:'Good ___ (de 6 a 12 del día).',opts:['morning','night','evening'],ans:'morning'},
  {s:'What’s your ___?',opts:['name','age','house'],ans:'name'},
  {s:'___ to meet you.',opts:['Nice','Good','See'],ans:'Nice'},
  {s:'How ___ you?',opts:['are','is','am'],ans:'are'},
  {s:'I’m ___, thank you.',opts:['fine','name','night'],ans:'fine'},
  {s:'See you ___ (el día siguiente).',opts:['tomorrow','yesterday','today'],ans:'tomorrow'},
  {s:'Good ___ (al irse a dormir).',opts:['night','morning','afternoon'],ans:'night'},
  {s:'Thank you! — You’re ___.',opts:['welcome','fine','name'],ans:'welcome'},
];
let explainQuestions=[
  {q:'Escribe un diálogo de 4 líneas donde dos compañeros se conocen: saludo, nombres y cortesía.',ans:'Ejemplo: —Hi! I’m Ana. What’s your name? —My name is Luis. —Nice to meet you, Luis. —Nice to meet you, too.'},
  {q:'Explica con tus palabras la diferencia entre «Good evening» y «Good night». Da un ejemplo de cada uno.',ans:'Good evening es un SALUDO al llegar de noche (llegas a la iglesia a las 7 pm). Good night es una DESPEDIDA, al irse o al dormir (te despides de tu mamá antes de acostarte).'},
  {q:'Escribe cómo saludarías a tu maestra a las 8:00 a.m. y cómo saludarías a tu mejor amigo a la misma hora. ¿Por qué cambia?',ans:'A la maestra: Good morning, teacher. Al amigo: Hi! / Hey! Cambia por el REGISTRO: con adultos y personas de respeto se usa el saludo formal; con amigos, el informal.'},
  {q:'Un turista llega a tu comunidad a las 4 de la tarde y quieres ayudarlo. Escribe las 3 primeras frases que le dirías en inglés.',ans:'Respuesta libre. Debe incluir saludo adecuado a la hora (Good afternoon), presentación (My name is… / I’m…) y cortesía (Nice to meet you / Can I help you?).'},
  {q:'Escribe la respuesta correcta a cada una: 1) How are you? 2) What’s your name? 3) Thank you.',ans:'1) I’m fine, thank you. And you? 2) My name is… / I’m… 3) You’re welcome.'},
];
let ansVisible=false;
function genTask(){sfx('click');const type=document.getElementById('tgType').value;const count=parseInt(document.getElementById('tgCount').value);ansVisible=false;const out=document.getElementById('tgOut');out.innerHTML='';if(type==='identify')genIdentifyTask(out,count);else if(type==='classify')genClassifyTask(out,count);else if(type==='complete')genCompleteTask(out,count);else if(type==='explain')genExplainTask(out,count);fin('s-tareas');}
function _instrBlock(out,title,lines){const ib=document.createElement('div');ib.className='tg-instruction-block';ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join('');out.appendChild(ib);}
function genIdentifyTask(out,count){_instrBlock(out,'Instrucción',['Copia en tu cuaderno cada expresión en inglés y escribe al lado qué es y cuándo se usa (saludo de la mañana, despedida, cortesía…).','<strong>Ejemplo:</strong> Good morning, teacher! → <span style="color:var(--jade);font-weight:700;">Saludo de la mañana</span>']);_pick(identifyTaskDB,Math.min(count,identifyTaskDB.length)).forEach((item,i)=>{const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.type}</div></div>`;out.appendChild(div);});}
function genClassifyTask(out,count){_instrBlock(out,'Instrucción',['Copia la siguiente tabla en tu cuaderno. Para cada expresión responde: ¿qué es?, ¿cuándo se usa?, ¿formal o informal? y su significado.']);const items=_pick(classifyTaskDB,Math.min(count,classifyTaskDB.length));const wrap=document.createElement('div');wrap.style.overflowX='auto';const th=(t,extra='')=>`<th style="padding:0.3rem 0.4rem;border:1px solid var(--border);font-size:0.72rem;text-align:center;${extra}">${t}</th>`;let html=`<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:520px;"><thead><tr style="background:var(--pri-gl);">${th('Expresión','text-align:left;')}${th('¿Qué es?')}${th('¿Cuándo se usa?')}${th('¿Formal o informal?')}${th('Significado')}</tr></thead><tbody>`;items.forEach(it=>{html+=`<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td>`+Array(4).fill(`<td style="padding:0.4rem;border:1px solid var(--border);min-width:50px;"></td>`).join('')+'</tr>';});html+='</tbody></table>';wrap.innerHTML=html;out.appendChild(wrap);const ans=document.createElement('div');ans.className='tg-answer';ans.style.marginTop='0.8rem';ans.innerHTML='<strong>✅ Respuestas:</strong><br>'+items.map(it=>`<strong>${it.w}:</strong> ¿Qué es?: ${it.gen} | ¿Cuándo?: ${it.n} | Registro: ${it.g} | Significado: ${it.t}`).join('<br>');out.appendChild(ans);}
function genCompleteTask(out,count){_instrBlock(out,'Instrucción',['Copia y resuelve en tu cuaderno. Cada frase en inglés tiene un espacio ___. Elige y escribe la opción correcta.']);const pool=_shuffle([...completeTaskDB]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';const sent=item.s.replace('___','<span class="tg-blank" style="min-width:90px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${sent}</strong><div style="margin-top:0.4rem;font-size:0.82rem;color:var(--gray);">📝 Opciones: <strong>${item.opts.join(' | ')}</strong></div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function genExplainTask(out,count){_instrBlock(out,'Instrucción',['Copia estas tareas en tu cuaderno y resuélvelas por escrito. Después practícalas en voz alta con un compañero.']);const pool=_shuffle([...explainQuestions]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.3rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function toggleAns(){ansVisible=!ansVisible;document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none');sfx('click');}

// ===================== SOPA DE LETRAS =====================
// La cuadrícula se arma al cargar con las palabras en inglés de la misión.
function _sopaRng(seed){return function(){seed=(seed+0x6D2B79F5)>>>0;let t=seed;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
function _sopaBuild(size,palabras,semilla){
  const rnd=_sopaRng(semilla),LET='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const dirs=[[0,1],[1,0],[1,1],[0,-1],[-1,0],[-1,-1],[1,-1],[-1,1]];
  const grid=[];for(let r=0;r<size;r++){grid.push([]);for(let c=0;c<size;c++)grid[r].push('');}
  const words=[];
  palabras.forEach(w=>{
    let puesto=false,intentos=0;
    while(!puesto&&intentos<800){
      intentos++;
      const d=dirs[Math.floor(rnd()*dirs.length)],r0=Math.floor(rnd()*size),c0=Math.floor(rnd()*size);
      const rf=r0+d[0]*(w.length-1),cf=c0+d[1]*(w.length-1);
      if(rf<0||rf>=size||cf<0||cf>=size)continue;
      let ok=true;const cells=[];
      for(let i=0;i<w.length;i++){const rr=r0+d[0]*i,cc=c0+d[1]*i;if(grid[rr][cc]&&grid[rr][cc]!==w[i]){ok=false;break;}cells.push([rr,cc]);}
      if(!ok)continue;
      cells.forEach((p,i)=>{grid[p[0]][p[1]]=w[i];});
      words.push({w:w,cells:cells});puesto=true;
    }
  });
  for(let r=0;r<size;r++)for(let c=0;c<size;c++)if(!grid[r][c])grid[r][c]=LET[Math.floor(rnd()*26)];
  return {size:size,grid:grid,words:words};
}
let sopaSets=[
  _sopaBuild(10,['HELLO','MORNING','NIGHT','NAME','FINE','BYE'],20260724),
  _sopaBuild(10,['GOODBYE','EVENING','PLEASE','THANKS','MEET','HOW'],76543210)
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
  {q:'«Good morning» se usa desde que amanece hasta las 12 del mediodía.',a:true},
  {q:'«Good night» se usa para saludar cuando llegas de noche.',a:false},
  {q:'«Good evening» se dice al llegar a un lugar después de las 6 de la tarde.',a:true},
  {q:'«Hi» es un saludo informal.',a:true},
  {q:'«What’s your name?» sirve para preguntar la edad.',a:false},
  {q:'«Nice to meet you» se dice cuando conoces a alguien por primera vez.',a:true},
  {q:'La respuesta más común a «How are you?» es «I’m fine, thank you».',a:true},
  {q:'En inglés la letra h de «hello» es muda, como en español.',a:false},
  {q:'«See you tomorrow» significa «nos vemos mañana».',a:true},
  {q:'«Goodbye» es más formal que «Bye».',a:true},
  {q:'«Thank you» se responde con «You’re welcome».',a:true},
  {q:'A la directora de la escuela se le saluda con «Hey! What’s up?».',a:false},
  {q:'«Good afternoon» se usa entre las 12 del día y las 6 de la tarde.',a:true},
  {q:'«My name is…» y «I’m…» sirven para lo mismo: decir tu nombre.',a:true},
  {q:'En inglés «please» se usa menos que «por favor» en español.',a:false},
];
let evalMCBank=[
  {q:'Son las 9:00 a.m. ¿Cómo saludas a tu maestra?',o:['a) Good night','b) Good morning','c) Good evening','d) See you'],a:1},
  {q:'¿Qué significa «Good evening»?',o:['a) Buenas noches, al despedirse','b) Buenos días','c) Buenas noches, al llegar','d) Buenas tardes'],a:2},
  {q:'¿Cuál se usa SOLO para despedirse?',o:['a) Hello','b) Good night','c) Good afternoon','d) Hi'],a:1},
  {q:'¿Cómo preguntas el nombre de una persona?',o:['a) How are you?','b) How old are you?','c) What’s your name?','d) Where are you from?'],a:2},
  {q:'¿Cuál es la respuesta correcta a «What’s your name?»?',o:['a) I’m fine','b) My name is Ana','c) Nice to meet you','d) Good morning'],a:1},
  {q:'¿Qué significa «Nice to meet you»?',o:['a) Mucho gusto','b) Hasta luego','c) ¿Cómo estás?','d) De nada'],a:0},
  {q:'¿Cuál de estos saludos es FORMAL?',o:['a) Hey','b) What’s up?','c) Hi','d) Good afternoon'],a:3},
  {q:'Son las 3:00 p.m. ¿Qué saludo corresponde?',o:['a) Good morning','b) Good afternoon','c) Good evening','d) Good night'],a:1},
  {q:'Tu amigo te dice «Thank you». ¿Qué respondes?',o:['a) You’re welcome','b) And you?','c) My name is','d) Good night'],a:0},
  {q:'¿Cómo se pronuncia la h de «hello»?',o:['a) Es muda','b) Suena como una j suave','c) Suena como una s','d) Suena como una g'],a:1},
  {q:'Sales de clase y verás a tu maestra hasta el otro día. ¿Qué dices?',o:['a) Good morning','b) See you tomorrow','c) Nice to meet you','d) What’s your name?'],a:1},
  {q:'¿Cuál completa el diálogo? — How are you? — ___',o:['a) My name is Luis','b) I’m fine, thank you. And you?','c) Good night','d) You’re welcome'],a:1},
  {q:'Llegas de noche a una reunión. ¿Cómo saludas?',o:['a) Good night','b) Good evening','c) Good morning','d) Goodbye'],a:1},
  {q:'¿Cuál es informal?',o:['a) Good morning','b) Nice to meet you','c) Bye','d) Goodbye'],a:2},
  {q:'En «thank you», la th se pronuncia…',o:['a) como t','b) como s','c) con la lengua entre los dientes','d) no se pronuncia'],a:2},
];
let evalCPBank=[
  {q:'De 6:00 a 11:59 se saluda con Good ___.',a:'morning'},
  {q:'De 12:00 a 5:59 de la tarde se saluda con Good ___.',a:'afternoon'},
  {q:'Al llegar después de las 6 de la tarde se saluda con Good ___.',a:'evening'},
  {q:'Al irse a dormir se dice Good ___.',a:'night'},
  {q:'Para preguntar el nombre se dice: What’s your ___?',a:'name'},
  {q:'Para decir tu nombre: My ___ is Ana.',a:'name'},
  {q:'Al conocer a alguien se dice: ___ to meet you.',a:'nice'},
  {q:'Para preguntar cómo está alguien: ___ are you?',a:'how'},
  {q:'Se responde: I’m ___, thank you.',a:'fine'},
  {q:'Para agradecer se dice ___ you.',a:'thank'},
  {q:'La respuesta a «Thank you» es: You’re ___.',a:'welcome'},
  {q:'Despedida hasta el día siguiente: See you ___.',a:'tomorrow'},
  {q:'Saludo informal de tres letras: ___.',a:'hi'},
  {q:'Despedida formal: ___.',a:'goodbye'},
  {q:'Para pedir algo con cortesía se agrega ___ al final.',a:'please'},
];
let evalPRBank=[
  {term:'Hello',def:'Hola · sirve a cualquier hora'},
  {term:'Good morning',def:'Buenos días · hasta las 12'},
  {term:'Good afternoon',def:'Buenas tardes · de 12 a 6'},
  {term:'Good evening',def:'Buenas noches · al llegar'},
  {term:'Good night',def:'Buenas noches · al irse o dormir'},
  {term:'What’s your name?',def:'¿Cómo te llamas?'},
  {term:'My name is…',def:'Me llamo…'},
  {term:'Nice to meet you',def:'Mucho gusto'},
  {term:'How are you?',def:'¿Cómo estás?'},
  {term:'I’m fine, thank you',def:'Estoy bien, gracias'},
  {term:'Goodbye',def:'Adiós · formal'},
  {term:'Bye',def:'Chao · informal'},
  {term:'See you tomorrow',def:'Nos vemos mañana'},
  {term:'Thank you',def:'Gracias'},
  {term:'You’re welcome',def:'De nada'},
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

function genEval(){sfx('click');_evalFormaSelector(); const _selF = document.getElementById('evalFormaSel'); if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10))); const cf = evalFormNum; const rng = _evalRng(cf); window._currentEvalForm=cf;evalFormNum = (evalFormNum % EVAL_FORMAS) + 1; _evalFormaSelector();saveProgress();document.getElementById('eval-screen-title').textContent=`🎓 Evaluación Final · Forma ${cf} · Hello! Saludos y Presentarme`;evalAnsVisible=false;const out=document.getElementById('evalOut');out.innerHTML='';const bar=document.createElement('div');bar.className='eval-score-bar';bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje · 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25 pts</span><span class="eval-score-pill esp-tf">V/F 25 pts</span><span class="eval-score-pill esp-mc">Selección 25 pts</span><span class="eval-score-pill esp-pr">Pareados 25 pts</span></div>`;out.appendChild(bar);const cpItems=_pickF(evalCPBank,5, rng);const s1=document.createElement('div');s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';cpItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='cp';d.dataset.evalIndex=i;const qHtml=item.q.replace('___',`<input class="eval-cp-input" type="text" data-cp="${i}" autocomplete="off">`);d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbCp${i}" aria-live="polite"></div>`;s1.appendChild(d);});out.appendChild(s1);const tfItems=_pickF(evalTFBank,5, rng);const s2=document.createElement('div');s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';tfItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='tf';d.dataset.evalIndex=i;d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="true"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="false"> Falso</label></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbTf${i}" aria-live="polite"></div>`;s2.appendChild(d);});out.appendChild(s2);const mcItems=_pickF(evalMCBank,5, rng);const s3=document.createElement('div');s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';mcItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='mc';d.dataset.evalIndex=i;const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join('');d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbMc${i}" aria-live="polite"></div>`;s3.appendChild(d);});out.appendChild(s3);const prItems=_pickF(evalPRBank,5, rng);let shuffledDefs=_shuffleF(prItems, rng);let _prTries=0;while(shuffledDefs.some((df,ix)=>df.def===prItems[ix].def)&&_prTries<20){shuffledDefs=_shuffleF(shuffledDefs, rng);_prTries++;}const letters=['A','B','C','D','E'];const s4=document.createElement('div');s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';const matchCard=document.createElement('div');matchCard.className='eval-item';let colLeft='<div class="eval-match-col"><h4>📌 Términos</h4>';prItems.forEach((item,i)=>{colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> <select class="eval-match-select" data-pr="${i}" aria-label="Respuesta pareada ${i+16}"><option value="">—</option>${letters.map(l=>`<option value="${l}">${l}</option>`).join('')}</select> ${item.term}</div>`;});colLeft+='</div>';let colRight='<div class="eval-match-col"><h4>🔑 Definiciones</h4>';shuffledDefs.forEach((item,i)=>{colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`;});colRight+='</div>';const ansKey=prItems.map((item,i)=>{const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)];return`${i+16}→${letter}`;}).join(' · ');matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div><div class="eval-item-feedback" id="evalFbPr" aria-live="polite"></div>`;s4.appendChild(matchCard);out.appendChild(s4);window._evalPrintData={tf:tfItems,mc:mcItems,cp:cpItems,pr:{terms:prItems,shuffledDefs,letters}};const autoPanel=document.createElement('div');autoPanel.id='evalAutoResult';autoPanel.className='eval-auto-result';autoPanel.innerHTML='<strong>🧮 Evaluación interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato original sin respuestas digitadas.';out.appendChild(autoPanel);fin('s-evaluacion');}
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación Hello! Saludos y Presentarme · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.12rem 0.4rem;margin:0.22rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #be185d;background:#fff1f5;color:#be185d;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#be185d;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #be185d;height:12px;}.obt-pct{white-space:nowrap;}.qn{font-weight:700;min-width:22px;flex-shrink:0;}.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:40px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.18rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.14rem 0.35rem;margin-bottom:0.1rem;break-inside:avoid;page-break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.3;display:flex;gap:0.28rem;margin-bottom:0.07rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.1rem 0.5rem;}.mc-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:0.04rem 0.15rem;margin-left:0.8rem;}.mc-opt{font-size:9pt;display:flex;align-items:center;gap:0.15rem;}.mc-opt input{width:10px;height:10px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{margin-top:0.1rem;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.08rem 0.4rem;margin-top:0.08rem;}.pr-head{font-size:9pt;font-weight:700;color:#555;margin-bottom:0.1rem;}.pr-item{font-size:10.5pt;padding:0.1rem 0.28rem;background:#fff1f5;border-radius:3px;margin-bottom:0.07rem;display:flex;align-items:center;gap:0.2rem;line-height:1.2;break-inside:avoid;page-break-inside:avoid;}.pr-num{font-weight:700;color:#be185d;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.22rem;padding:0.15rem 0;page-break-before:avoid;break-before:avoid;color:#be185d;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #be185d;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#555;}.pa{color:#007a00;font-weight:600;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · Hello! Saludos y Presentarme · Educación Básica · Inglés</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Evaluación Final · Hello! Saludos y Presentarme · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u</div></div><div class="p-grid">${pR}</div>
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
  {txt:'Son las 7:00 de la mañana y entras al aula donde está tu maestra.',ans:'Good morning, teacher. Es antes de las 12 y con una persona de respeto: saludo formal de la mañana.'},
  {txt:'Llegas a las 8:00 de la noche a una reunión en casa de un vecino.',ans:'Good evening. Es un saludo (estás llegando) y ya pasaron las 6 de la tarde. «Good night» sería un error: eso es despedida.'},
  {txt:'Te despides de tu mamá antes de irte a dormir.',ans:'Good night. Aquí sí corresponde, porque es una despedida y vas a dormir.'},
  {txt:'Un turista llega a las 2:00 de la tarde a tu comunidad y quieres presentarte.',ans:'Good afternoon. My name is… / I’m… Nice to meet you. Saludo de la tarde + presentación + cortesía.'},
  {txt:'Tu mejor amigo entra al aula y lo saludas rápido.',ans:'Hi! o Hello! Es informal y con un compañero: no hace falta el saludo formal.'},
  {txt:'Terminó la clase y verás a tu maestra hasta el día siguiente.',ans:'Goodbye. See you tomorrow. Despedida formal + hasta mañana.'},
];
let critErrorBank=[
  {txt:'"Llegué a la reunión de noche y saludé diciendo: Good night."',
   g1:'Good night NO es un saludo: es una DESPEDIDA, se dice al irse o al ir a dormir.',
   g2:'Al LLEGAR de noche se dice Good evening. Misma hora, distinto momento de la conversación.'},
  {txt:'"Para preguntar el nombre dije: How are you?"',
   g1:'How are you? pregunta por el ESTADO (¿cómo estás?), no por el nombre.',
   g2:'Para el nombre se dice What’s your name?, y se responde My name is… o I’m…'},
  {txt:'"Saludé al director de la escuela diciendo: Hey! What’s up?"',
   g1:'El registro está mal: Hey y What’s up? son informales, para amigos.',
   g2:'Con una autoridad se usa el saludo formal: Good morning / Good afternoon, y Nice to meet you si es la primera vez.'},
  {txt:'"Dije hello pronunciando «elou», sin la h."',
   g1:'En inglés la h de hello, hi y how SÍ suena: es un soplo, como una j suave.',
   g2:'Sin ese soplo cambian las palabras: hi suena como eye («ojo»). La pronunciación es parte del significado.'},
  {txt:'"Me dijeron Thank you y respondí: I’m fine."',
   g1:'I’m fine responde a How are you?, no a un agradecimiento.',
   g2:'A Thank you se responde You’re welcome (de nada).'},
];
let critCicloQuestions=[
  '1. ¿Qué SALUDO corresponde y por qué (hora y persona)?',
  '2. ¿Cómo se PRESENTA cada uno?',
  '3. ¿Cómo se DESPIDEN correctamente?',
];
let critCicloBank=[
  {txt:'Ana llega al aula a las 7:15 de la mañana. Saluda a su maestra, se presenta con un compañero nuevo y al terminar la clase se despide de los dos.',
   p:'Con la maestra: Good morning, teacher (antes de las 12 y con respeto). Con el compañero basta Hi o Hello.',
   d:'Con el compañero: Hi! I’m Ana. What’s your name? — y responde Nice to meet you al escuchar el nombre.',
   a:'Con la maestra: Goodbye, teacher. Con el compañero: Bye! See you tomorrow!'},
  {txt:'Don Luis llega a las 6:30 de la tarde a una reunión de padres, saluda a la directora que no conocía y se retira cuando ya es de noche.',
   p:'Good evening: ya pasaron las 6 de la tarde y está LLEGANDO, así que no corresponde Good night.',
   d:'Good evening. My name is Luis Pérez. Nice to meet you. Presentación formal con nombre completo.',
   a:'Al irse: Good night o Goodbye. Aquí sí cabe Good night, porque se está despidiendo de noche.'},
  {txt:'Dos turistas llegan a las 11:00 de la mañana a la pulpería de María y le preguntan su nombre.',
   p:'Good morning: son las 11, todavía es antes del mediodía.',
   d:'María responde: Good morning! My name is María. Nice to meet you.',
   a:'Al salir los turistas: Goodbye! Thank you! y María responde You’re welcome. Bye!'},
  {txt:'Carlos se encuentra a su mejor amigo en la cancha a las 4 de la tarde y quedan de verse al día siguiente.',
   p:'Con un amigo y a esa hora: Hi! o Hey! (informal). También sirve Good afternoon, pero suena muy formal entre amigos.',
   d:'No hace falta presentarse: ya se conocen. Basta How are you? y la respuesta I’m fine, thanks.',
   a:'See you tomorrow! o Bye! — despedida informal.'},
  {txt:'Una alumna nueva llega al aula a media mañana; la maestra la presenta al grupo y al final del día se despide de todos.',
   p:'Good morning, everyone: sigue siendo antes del mediodía y saluda a todo el grupo.',
   d:'Hello! My name is Sofía. Nice to meet you. El grupo responde Nice to meet you, too.',
   a:'Goodbye, everyone! See you tomorrow!'},
];
let critCompareBank=[
  {a:'Se dice al LLEGAR a un lugar después de las 6 de la tarde (ejemplo: entras a una reunión a las 7 pm).',b:'Se dice al IRSE o al acostarse (ejemplo: te despides de tu mamá antes de dormir).',
   ga:'Good evening.',
   gb:'Good night.',
   gr:'Semejanza: las dos se traducen «buenas noches» y se usan de noche. Diferencia: Good evening SALUDA y Good night DESPIDE. Es el error más común del hispanohablante.'},
  {a:'Saludo que se usa con la directora, un maestro o un visitante.',b:'Saludo que se usa con un compañero de clase o un amigo.',
   ga:'Formal (Good morning / Good afternoon).',
   gb:'Informal (Hi / Hey).',
   gr:'Semejanza: las dos son maneras correctas de saludar. Diferencia: el REGISTRO. Usar el informal con una autoridad suena irrespetuoso; usar el formal con un amigo suena distante.'},
  {a:'Pregunta por el nombre de la persona.',b:'Pregunta por el estado de la persona.',
   ga:'What’s your name?',
   gb:'How are you?',
   gr:'Semejanza: las dos son preguntas de una presentación. Diferencia: la primera se responde con My name is… y la segunda con I’m fine, thank you.'},
  {a:'Expresión de agradecimiento.',b:'Respuesta a un agradecimiento.',
   ga:'Thank you.',
   gb:'You’re welcome.',
   gr:'Semejanza: las dos son cortesía y van juntas en la misma conversación. Diferencia: una la dice quien recibe el favor y la otra quien lo hizo.'},
];
let critDesignBank=[
  'En tu escuela llega una maestra nueva de Estados Unidos y te toca darle la bienvenida en la mañana.',
  'Un grupo de turistas llega a las 5 de la tarde a tu comunidad y tú eres el guía.',
  'Tu prima vive en Estados Unidos y hablarán por videollamada a las 8 de la noche por primera vez.',
  'En la feria de tu pueblo atiendes un puesto y llega un cliente que solo habla inglés.',
  'Un compañero nuevo entra al aula a media mañana y nadie lo ha saludado.',
];
let critDesignGuide='Rúbrica de 3 criterios (total 20 pts) — ① SALUDO ADECUADO (7 pts): el saludo corresponde a la hora y al registro (formal/informal) de la situación. ② PRESENTACIÓN (6 pts): usa correctamente My name is… / I’m… y una pregunta al otro (What’s your name? / How are you?). ③ DESPEDIDA Y CORTESÍA (7 pts): cierra con una despedida adecuada y usa please / thank you / you’re welcome donde corresponde. Cualquier diálogo vale si las tres partes son coherentes con la situación planteada.';
function genEvalCrit(){
  sfx('click');
  _injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });
  const _sC = document.getElementById('evalCritFormaSel');
  if (_sC && parseInt(_sC.value, 10)) evalCritFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sC.value, 10)));
  const cf=evalCritFormNum;window._currentEvalCritForm=cf;const rngC = _evalRng(200000 + cf);evalCritFormNum=(evalCritFormNum%EVAL_FORMAS)+1;_injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });saveProgress();
  document.getElementById('evalcrit-screen-title').textContent=`🧠 Pensamiento Crítico · Forma ${cf} · Hello! Saludos y Presentarme`;
  evalCritAnsVisible=false;
  const out=document.getElementById('evalCritOut');out.innerHTML='';
  const sens=_pickF(critSensorBank,2,rngC);
  const s1=document.createElement('div');
  s1.innerHTML=`<div class="eval-section-title">I. ¿Qué dirías en esta situación? <span class="eval-pts">20 pts</span></div><div class="eval-item">${sens.map((k,i)=>`<div class="crit-scenario">Caso ${i+1}: ${k.txt}</div><div class="crit-q-block"><div class="crit-q-label">¿Qué dirías exactamente en inglés? Justifica: ¿por la hora o por la persona?</div><textarea class="crit-textarea" rows="2" aria-label="Sensor del caso ${i+1} y su justificación"></textarea><div class="crit-pauta">${k.ans}</div></div>`).join('')}<div class="crit-selfscore"><label for="critScore0">Obtenido:</label><input type="number" id="critScore0" class="crit-score-input" data-score="0" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s1);
  const err=_pickF(critErrorBank,1,rngC)[0];
  const s2=document.createElement('div');
  s2.innerHTML=`<div class="eval-section-title">II. Corrige el error conceptual <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${err.txt}</div><p style="font-size:0.85rem;margin-bottom:0.5rem;">Este comentario tiene <strong>dos errores</strong>. Corrígelos con argumentos: explica qué se dice de verdad y por qué:</p><div class="crit-q-block"><div class="crit-q-label">Error 1 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 1 y su corrección"></textarea><div class="crit-pauta">${err.g1}</div></div><div class="crit-q-block"><div class="crit-q-label">Error 2 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 2 y su corrección"></textarea><div class="crit-pauta">${err.g2}</div></div><div class="crit-selfscore"><label for="critScore1">Obtenido:</label><input type="number" id="critScore1" class="crit-score-input" data-score="1" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s2);
  const cic=_pickF(critCicloBank,1,rngC)[0];
  const cicloGuides=[cic.p,cic.d,cic.a];
  const s3=document.createElement('div');
  s3.innerHTML=`<div class="eval-section-title">III. Analiza la conversación completa <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${cic.txt}</div>${critCicloQuestions.map((q,i)=>`<div class="crit-q-block"><div class="crit-q-label">${q}</div><textarea class="crit-textarea" rows="2" aria-label="${q}"></textarea><div class="crit-pauta">${cicloGuides[i]}</div></div>`).join('')}<div class="crit-selfscore"><label for="critScore2">Obtenido:</label><input type="number" id="critScore2" class="crit-score-input" data-score="2" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s3);
  const cmp=_pickF(critCompareBank,1,rngC)[0];
  const s4=document.createElement('div');
  s4.innerHTML=`<div class="eval-section-title">IV. Comparación razonada <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-compare-grid"><div class="crit-compare-box"><h5>Caso A</h5>${cmp.a}</div><div class="crit-compare-box"><h5>Caso B</h5>${cmp.b}</div></div><div class="crit-q-block"><div class="crit-q-label">1. ¿Qué concepto corresponde a cada caso? 2. ¿En qué se parecen? 3. ¿En qué se diferencian? Da un ejemplo de cada uno.</div><textarea class="crit-textarea" rows="4" aria-label="Comparación razonada de los casos A y B"></textarea><div class="crit-pauta">Caso A: ${cmp.ga} · Caso B: ${cmp.gb} · ${cmp.gr}</div></div><div class="crit-selfscore"><label for="critScore3">Obtenido:</label><input type="number" id="critScore3" class="crit-score-input" data-score="3" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s4);
  const dis=_pickF(critDesignBank,1,rngC)[0];
  const s5=document.createElement('div');
  s5.innerHTML=`<div class="eval-section-title">V. Escribe y justifica tu diálogo <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${dis}</div><div class="crit-q-block"><div class="crit-q-label">Escribe el diálogo completo en inglés para esta situación: SALUDO adecuado a la hora y a la persona, PRESENTACIÓN (tu nombre y una pregunta al otro) y DESPEDIDA con cortesía. Al menos 6 líneas.</div><textarea class="crit-textarea" rows="5" aria-label="Diseño y justificación del robot"></textarea><div class="crit-pauta">${critDesignGuide}</div></div><div class="crit-selfscore"><label for="critScore4">Obtenido:</label><input type="number" id="critScore4" class="crit-score-input" data-score="4" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
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
  let s1=`<div class="sec-title"><span>I. ¿Qué dirías en esta situación?</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div>`;
  d.sens.forEach((k,i)=>{s1+=`<p class="crit-print-scenario">Caso ${i+1}: ${k.txt}</p><p class="crit-print-q">¿Qué dirías exactamente en inglés? Justifica tu elección.</p>${lines(1)}`;});
  let s2=`<div class="sec-title"><span>II. Corrige el error conceptual</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.err.txt}</p><p class="crit-print-q">Este comentario tiene dos errores. Corrígelos con argumentos:</p><p class="crit-print-q"><strong>Error 1:</strong></p>${lines(1)}<p class="crit-print-q"><strong>Error 2:</strong></p>${lines(1)}`;
  let s3=`<div class="sec-title"><span>III. Analiza la conversación completa</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.cic.txt}</p>`;
  critCicloQuestions.forEach(q=>{s3+=`<p class="crit-print-q">${q}</p>${lines(1)}`;});
  let s4=`<div class="sec-title"><span>IV. Comparación razonada</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><div class="crit-compare-print-grid"><div class="crit-compare-print-box"><strong>Caso A:</strong> ${d.cmp.a}</div><div class="crit-compare-print-box"><strong>Caso B:</strong> ${d.cmp.b}</div></div><p class="crit-print-q">1. ¿Qué concepto corresponde a cada caso? 2. ¿En qué se parecen? 3. ¿En qué se diferencian? Da un ejemplo de cada uno.</p>${lines(2)}`;
  let s5=`<div class="sec-title"><span>V. Escribe y justifica tu diálogo</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.dis}</p><p class="crit-print-q">Escribe el diálogo completo en inglés para esta situación: SALUDO, PRESENTACIÓN y DESPEDIDA con cortesía. Al menos 6 líneas.</p>${lines(4)}`;
  let pR='';
  pR+=`<div class="p-sec"><div class="p-ttl">I. ¿Qué dirías en esta situación?</div>${d.sens.map((k,i)=>`<div class="p-crit-line"><strong>Caso ${i+1}:</strong> ${k.ans}</div>`).join('')}</div>`;
  pR+=`<div class="p-sec"><div class="p-ttl">II. Corrige el error</div><div class="p-crit-line"><strong>Error 1:</strong> ${d.err.g1}</div><div class="p-crit-line"><strong>Error 2:</strong> ${d.err.g2}</div></div>`;
  pR+=`<div class="p-sec"><div class="p-ttl">III. Analiza la conversación</div><div class="p-crit-line"><strong>Saludo:</strong> ${d.cic.p}</div><div class="p-crit-line"><strong>Presentación:</strong> ${d.cic.d}</div><div class="p-crit-line"><strong>Despedida:</strong> ${d.cic.a}</div></div>`;
  pR+=`<div class="p-sec"><div class="p-ttl">IV. Comparación</div><div class="p-crit-line"><strong>Caso A:</strong> ${d.cmp.ga}</div><div class="p-crit-line"><strong>Caso B:</strong> ${d.cmp.gb}</div><div class="p-crit-line">${d.cmp.gr}</div></div>`;
  pR+=`<div class="p-sec" style="grid-column:1/-1;"><div class="p-ttl">V. Escribe tu diálogo — Rúbrica</div><div class="p-crit-line">${critDesignGuide}</div></div>`;
  const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Pensamiento Crítico Hello! Saludos y Presentarme · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.1rem 0.4rem;margin:0.2rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #be185d;background:#fff1f5;color:#be185d;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#be185d;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #be185d;height:12px;}.obt-pct{white-space:nowrap;}.crit-print-scenario{font-size:10.5pt;background:#fff1f5;border-left:3px solid #be185d;padding:0.2rem 0.5rem;margin:0.1rem 0 0.2rem;line-height:1.3;}.crit-print-q{font-size:10pt;font-weight:600;margin:0.15rem 0 0.08rem;line-height:1.25;}.ln{border-bottom:1px solid #111;min-height:12px;margin-bottom:2px;}.crit-compare-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin:0.15rem 0;}.crit-compare-print-box{font-size:9.5pt;background:#fff1f5;border-radius:4px;padding:0.25rem 0.4rem;line-height:1.25;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.08rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.9rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.45rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.1rem;margin-bottom:0.18rem;}.p-crit-line{font-size:11pt;color:#007a00;margin-bottom:0.18rem;line-height:1.35;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.2rem;padding:0.1rem 0;color:#be185d;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #be185d;}.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:12.7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="critEvalPage"><div class="ph"><h2>Evaluación Competencial · Pensamiento Crítico · Hello! Saludos y Presentarme · Educación Básica · Inglés</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 5 secciones de 20 puntos</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100</span></div></div><div class="pauta-wrap" id="critPautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Pensamiento Crítico · Hello! Saludos y Presentarme · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 5 secciones × 20 pts c/u — respuesta abierta, usar como guía de corrección</div></div><div class="p-grid">${pR}</div></div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("critEvalPage",250,0.55,1.2);fit("critPautaPage",250,0.55,1.2);})();<\/script></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(typeof METAS_TR==='function'?METAS_TR(doc):doc);win.document.close();setTimeout(()=>win.print(),400);
}

// ===================== LABORATORIO DE LAS PARTES DEL ROBOT =====================
let parteData={
  saludo:{
    nombre:'El saludo',icon:'👋',
    estructura:{title:'¿Qué es?',info:'• La <strong>puerta de entrada</strong> de toda conversación<br>• Cambia según la <strong>hora del día</strong>: morning · afternoon · evening<br>• <strong>Hello</strong> y <strong>Hi</strong> sirven a cualquier hora'},
    funcion:{title:'¿Cómo se pronuncia?',info:'• <strong>Hello</strong> → «je-LOU» · la <b>h</b> sopla, no es muda<br>• <strong>Good morning</strong> → «gud MOR-ning»<br>• <strong>Good evening</strong> → «gud IV-ning»'},
    ubicacion:{title:'Ejemplos',info:'• <strong>Good morning, teacher.</strong> (7:00 a.m.)<br>• <strong>Good afternoon, Mrs. López.</strong> (2:00 p.m.)<br>• <strong>Hi, Carlos!</strong> (con un amigo)'},
    dato:{title:'Error típico',info:'• Saludar de noche con <strong>Good night</strong>: eso es despedida<br>• Comerse la <b>h</b>: «elou» en vez de «je-lou»<br>• Decir <strong>Hey</strong> a una autoridad: suena irrespetuoso'}
  },
  presentacion:{
    nombre:'La presentación',icon:'🙋',
    estructura:{title:'¿Qué es?',info:'• Decir <strong>quién eres</strong> y preguntar por el otro<br>• <strong>My name is…</strong> o <strong>I’m…</strong> (más natural)<br>• Se cierra con <strong>Nice to meet you</strong>'},
    funcion:{title:'¿Cómo se pronuncia?',info:'• <strong>What’s your name?</strong> → «guats yor NEIM»<br>• <strong>My name is…</strong> → «mai NEIM is»<br>• <strong>Nice to meet you</strong> → «nais tu MIT yu»'},
    ubicacion:{title:'Ejemplos',info:'• <strong>Hi! I’m Ana. What’s your name?</strong><br>• <strong>My name is Luis. Nice to meet you.</strong><br>• <strong>Nice to meet you, too.</strong> (respuesta)'},
    dato:{title:'Error típico',info:'• Confundir <strong>What’s your name?</strong> con <strong>How are you?</strong><br>• Responder «I am Ana» separado: lo natural es <strong>I’m Ana</strong><br>• Olvidar el <strong>too</strong> al devolver el saludo: <em>Nice to meet you, too</em>'}
  },
  pregunta:{
    nombre:'La cortesía',icon:'💬',
    estructura:{title:'¿Qué es?',info:'• Preguntar <strong>cómo está</strong> la otra persona<br>• <strong>How are you?</strong> y su respuesta<br>• Incluye <strong>please</strong>, <strong>thank you</strong> y <strong>you’re welcome</strong>'},
    funcion:{title:'¿Cómo se pronuncia?',info:'• <strong>How are you?</strong> → «jau ar YU»<br>• <strong>I’m fine, thank you</strong> → «aim FAIN, zenk yu»<br>• La <b>th</b> va con la <strong>lengua entre los dientes</strong>'},
    ubicacion:{title:'Ejemplos',info:'• <strong>How are you? — I’m fine, thank you. And you?</strong><br>• <strong>Water, please.</strong> (pedir con cortesía)<br>• <strong>Thank you! — You’re welcome.</strong>'},
    dato:{title:'Error típico',info:'• Responder <strong>I’m fine</strong> a un <em>Thank you</em>: se responde <strong>You’re welcome</strong><br>• Pedir sin <strong>please</strong>: suena a orden<br>• Decir «tenk yu» o «senk yu» en vez de la <b>th</b>'}
  },
  despedida:{
    nombre:'La despedida',icon:'🚪',
    estructura:{title:'¿Qué es?',info:'• El <strong>cierre</strong> de la conversación<br>• <strong>Goodbye</strong> (formal) · <strong>Bye</strong> (informal)<br>• <strong>See you later / tomorrow</strong> según cuándo se vuelvan a ver'},
    funcion:{title:'¿Cómo se pronuncia?',info:'• <strong>Goodbye</strong> → «gud-BAI»<br>• <strong>See you tomorrow</strong> → «si yu tu-MO-rou»<br>• <strong>Good night</strong> → «gud NAIT»'},
    ubicacion:{title:'Ejemplos',info:'• <strong>Goodbye, teacher. See you tomorrow.</strong><br>• <strong>Bye! See you later!</strong> (con un amigo)<br>• <strong>Good night, mom.</strong> (antes de dormir)'},
    dato:{title:'Error típico',info:'• Usar <strong>Good night</strong> para saludar<br>• Despedirse de una autoridad solo con <strong>Bye</strong><br>• Decir <em>See you tomorrow</em> cuando no se verán mañana'}
  }
};
let labParte='saludo',labAspecto='estructura';
function labShowParte(parteKey){labParte=parteKey;updateLabDisplay();document.querySelectorAll('.lab-cont-btn').forEach(b=>b.classList.remove('active-pri'));const btn=document.querySelector(`[data-parte="${parteKey}"]`);if(btn)btn.classList.add('active-pri');document.querySelectorAll('.lab-svg-part').forEach(g=>g.classList.remove('svg-active'));const sg=document.getElementById('svgP-'+parteKey);if(sg)sg.classList.add('svg-active');if(typeof sfx==='function')sfx('click');}
function labShowAspecto(aspectoKey){labAspecto=aspectoKey;updateLabDisplay();document.querySelectorAll('.lab-asp-btn').forEach(b=>b.classList.remove('active-sec'));const btn=document.querySelector(`[data-aspecto="${aspectoKey}"]`);if(btn)btn.classList.add('active-sec');if(typeof sfx==='function')sfx('click');}
function updateLabDisplay(){const data=parteData[labParte];const asp=data[labAspecto];document.getElementById('lab-sentence').innerHTML=`🔬 Explorando: <strong>${data.nombre}</strong> → <strong>${asp.title}</strong>`;document.getElementById('lab-display').innerHTML=`<div class="lab-cont-header">${data.icon} ${data.nombre}</div><div class="lab-asp-title">${asp.title}</div><div class="lab-asp-info">${asp.info}</div>`;}

// ===================== DIPLOMA =====================
function _diplPct(){return xp>=MXP?100:Math.round((xp/MXP)*100);}
function openDiploma(){sfx('fan');const pct=_diplPct();document.getElementById('diplPct').textContent=pct+'%';document.getElementById('diplBar').style.width=pct+'%';document.getElementById('diplDate').textContent='Fecha: '+new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});const msgs=['¡Sigue aprendiendo!','¡Muy buen trabajo!','¡Vas muy bien!','¡Ya te presentas en inglés!','¡Hello Master! Dominas los saludos'];document.getElementById('diplMsg').textContent=msgs[Math.min(Math.floor(pct/25),4)];const stars=['⭐','⭐⭐','⭐⭐⭐'];document.getElementById('diplStars').textContent=stars[Math.min(Math.floor(pct/40),2)];const achTxt=unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(' · ');document.getElementById('diplAch').textContent=achTxt||'Sigue completando secciones para desbloquear logros';document.getElementById('diplomaOverlay').classList.add('open');launchConfetti();}
function closeDiploma(){document.getElementById('diplomaOverlay').classList.remove('open');}
function updateDiplomaName(v){document.getElementById('diplName').textContent=v||'Estudiante';}
function shareWA(){const name=document.getElementById('diplName').textContent||'Estudiante';const pct=_diplPct();const msg=`🗣️ ¡${name} completó la Misión "Hello! Saludos y Presentarme"! 🏅 Progreso: ${pct}% · 🌱 policastsapien.com`;_waShare(msg);}
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
  document.querySelector('[data-parte="saludo"]')?.classList.add('active-pri');
  document.querySelector('[data-aspecto="estructura"]')?.classList.add('active-sec');
  const sg=document.getElementById('svgP-saludo');if(sg)sg.classList.add('svg-active');
  renderAchPanel();
});

(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalCrit==='function') _injectFormaSel('genEvalCrit','evalCritFormaSel',evalCritFormNum,function(v){evalCritFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();

// ===================== IDIOMA (español ↔ inglés) =====================
// Modo inmersión: cuando exista saludos-ingles-en.js, el botón 🌐 de
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

// ===================== PRONUNCIACIÓN (voz del propio dispositivo) =====================
// Usa la síntesis de voz que ya trae el teléfono: no descarga nada, funciona
// sin internet y no pesa en el APK. Si el equipo no tiene voz en inglés, la
// misión sigue igual: cada expresión trae su pronunciación figurada escrita.
let _vozEN=null;
function _buscarVozEN(){
  if(!('speechSynthesis' in window))return null;
  const vs=window.speechSynthesis.getVoices()||[];
  return vs.find(v=>/^en[-_]US/i.test(v.lang))||vs.find(v=>/^en/i.test(v.lang))||null;
}
if('speechSynthesis' in window){
  _vozEN=_buscarVozEN();
  window.speechSynthesis.onvoiceschanged=()=>{_vozEN=_buscarVozEN();};
}
function say(texto){
  if(!('speechSynthesis' in window)){showToast('🔇 Este equipo no puede pronunciar; guíate por la pronunciación escrita.');return;}
  try{
    window.speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(texto);
    u.lang='en-US';
    if(!_vozEN)_vozEN=_buscarVozEN();
    if(_vozEN)u.voice=_vozEN;
    u.rate=0.85;   // más lento que lo normal: es un principiante escuchando
    u.pitch=1;
    window.speechSynthesis.speak(u);
  }catch(e){showToast('🔇 No se pudo reproducir la voz en este equipo.');}
}
// Lee la expresión de la flashcard que está en pantalla
function sayFC(){ if(typeof sfx==='function')sfx('click'); say(fcData[fcIdx].w.replace(/[…]/g,'')); }
