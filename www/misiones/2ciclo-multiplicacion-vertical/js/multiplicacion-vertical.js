// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
function compartirMision() {
    const url = window.location.href;
    const texto = `🚀 *Misión Asignada: Multiplicación Vertical* 🚀\n\nAprende a multiplicar números cardinales con el cálculo vertical: alinea, multiplica, lleva el acarreo y suma los productos parciales. ✖️\n\nDesbloquea *todos los logros* y puedes poner *tus datos* para que tu maestro observe todos tus logros. 📋\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;
    _waShare(texto);
}

// ===================== ACCESIBILIDAD =====================
function toggleLetra() {
  document.body.classList.toggle('letra-grande');
  if(typeof sfx === 'function') sfx('click');
  localStorage.setItem('prefLetraMultiplicacion', document.body.classList.contains('letra-grande'));
}
window.addEventListener('DOMContentLoaded', () => {
  if(localStorage.getItem('prefLetraMultiplicacion') === 'true') document.body.classList.add('letra-grande');
});

// ===================== UTILIDADES =====================
const _pick = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
const _shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
function fb(id, msg, isOk) {
  const el = document.getElementById(id);
  if(el) { el.textContent = msg; el.className = 'fb show ' + (isOk ? 'ok' : 'err'); }
}
function _rint(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
function _carry(a,b){ return Math.floor((a*b)/10); } // acarreo al multiplicar dos cifras

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY = 'matematica_multiplicacion_vertical_v1';
let xp = 0, MXP = 200, done = new Set(), evalAnsVisible = false;
let evalFormNum = 1, evalOpFormNum = 1, evalOpAnsVisible = false, unlockedAch = [], darkMode = false, prevLevel = 0;
const TOTAL_SECTIONS = 16;
const xpTracker = { fc: new Set(), qz: new Set(), cls: new Set(), id: new Set(), cmp: new Set(), reto: new Set(), sopa: new Set(), predice: new Set(), explica: new Set(), memo: new Set(), labP: new Set(), labA: new Set(), wTab: new Set(), wPar: new Set(), wAca: new Set() };

// ===================== SONIDO =====================
let sndOn = true; let AC = null;
function getAC(){ if(!AC){ try{ AC = new(window.AudioContext||window.webkitAudioContext)(); }catch(e){} } return AC; }
function sfx(t){
  if(!sndOn) return;
  try{
    const ac=getAC(); if(!ac) return;
    const g=ac.createGain(); g.connect(ac.destination);
    const o=ac.createOscillator(); o.connect(g);
    if(t==='click'){o.type='sine';o.frequency.setValueAtTime(800,ac.currentTime);o.frequency.linearRampToValueAtTime(1200,ac.currentTime+0.1);g.gain.setValueAtTime(0.2,ac.currentTime);g.gain.linearRampToValueAtTime(0,ac.currentTime+0.12);o.start();o.stop(ac.currentTime+0.12);}
    else if(t==='ok'){[523,659,784].forEach((f,i)=>{const o2=ac.createOscillator();const g2=ac.createGain();o2.connect(g2);g2.connect(ac.destination);o2.type='triangle';o2.frequency.value=f;g2.gain.setValueAtTime(0.15,ac.currentTime+i*0.1);g2.gain.linearRampToValueAtTime(0,ac.currentTime+i*0.1+0.15);o2.start(ac.currentTime+i*0.1);o2.stop(ac.currentTime+i*0.1+0.15);});}
    else if(t==='no'){o.type='square';o.frequency.setValueAtTime(200,ac.currentTime);o.frequency.linearRampToValueAtTime(100,ac.currentTime+0.2);g.gain.setValueAtTime(0.15,ac.currentTime);g.gain.linearRampToValueAtTime(0,ac.currentTime+0.2);o.start();o.stop(ac.currentTime+0.2);}
    else if(t==='up'){[523,659,784,1047].forEach((f,i)=>{const o2=ac.createOscillator();const g2=ac.createGain();o2.connect(g2);g2.connect(ac.destination);o2.type='triangle';o2.frequency.value=f;g2.gain.setValueAtTime(0.18,ac.currentTime+i*0.12);g2.gain.linearRampToValueAtTime(0,ac.currentTime+i*0.12+0.18);o2.start(ac.currentTime+i*0.12);o2.stop(ac.currentTime+i*0.12+0.18);});}
    else if(t==='fan'){[523,587,659,698,784,1047].forEach((f,i)=>{const o2=ac.createOscillator();const g2=ac.createGain();o2.connect(g2);g2.connect(ac.destination);o2.type='triangle';o2.frequency.value=f;g2.gain.setValueAtTime(0.15,ac.currentTime+i*0.1);g2.gain.linearRampToValueAtTime(0,ac.currentTime+i*0.1+0.2);o2.start(ac.currentTime+i*0.1);o2.stop(ac.currentTime+i*0.1+0.2);});}
    else if(t==='flip'){o.type='sine';o.frequency.setValueAtTime(400,ac.currentTime);o.frequency.linearRampToValueAtTime(900,ac.currentTime+0.15);g.gain.setValueAtTime(0.12,ac.currentTime);g.gain.linearRampToValueAtTime(0,ac.currentTime+0.18);o.start();o.stop(ac.currentTime+0.18);}
    else if(t==='tick'){o.type='sine';o.frequency.value=1000;g.gain.setValueAtTime(0.1,ac.currentTime);g.gain.linearRampToValueAtTime(0,ac.currentTime+0.05);o.start();o.stop(ac.currentTime+0.05);}
    else if(t==='ach'){[880,1047,1319].forEach((f,i)=>{const o2=ac.createOscillator();const g2=ac.createGain();o2.connect(g2);g2.connect(ac.destination);o2.type='triangle';o2.frequency.value=f;g2.gain.setValueAtTime(0.2,ac.currentTime+i*0.12);g2.gain.linearRampToValueAtTime(0,ac.currentTime+i*0.12+0.22);o2.start(ac.currentTime+i*0.12);o2.stop(ac.currentTime+i*0.12+0.22);});}
  }catch(e){}
}
function toggleSnd(){ sndOn=!sndOn; document.getElementById('sndBtn').textContent=sndOn?'🔊 Sonido':'🔇 Sonido'; }

// ===================== DARK MODE =====================
function toggleTheme(){ darkMode=!darkMode; document.documentElement.setAttribute('data-theme',darkMode?'dark':'light'); document.getElementById('themeBtn').textContent=darkMode?'☀️ Tema':'🌙 Tema'; localStorage.setItem(SAVE_KEY+'_theme',darkMode?'dark':'light'); sfx('click'); }
function initTheme(){ const s=localStorage.getItem(SAVE_KEY+'_theme'); const sys=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches; darkMode=(s==='dark')||(s===null&&sys); if(darkMode){ document.documentElement.setAttribute('data-theme','dark'); document.getElementById('themeBtn').textContent='☀️ Tema'; } }

// ===================== LOCALSTORAGE =====================
function saveProgress(){
  try{ localStorage.setItem(SAVE_KEY, JSON.stringify({doneSections:Array.from(done), unlockedAch, evalFormNum, evalOpFormNum, xp})); }catch(e){}
}
function loadProgress(){
  try{
    const s=JSON.parse(localStorage.getItem(SAVE_KEY));
    if(!s) return;
    if(s.doneSections&&Array.isArray(s.doneSections)) s.doneSections.forEach(id=>{ done.add(id); const b=document.querySelector(`[data-s="${id}"]`); if(b) b.classList.add('done'); });
    if(s.unlockedAch&&Array.isArray(s.unlockedAch)) unlockedAch=s.unlockedAch.filter(id=>ACHIEVEMENTS[id]!==undefined);
    if(s.evalFormNum) evalFormNum=s.evalFormNum;
    if(s.evalOpFormNum) evalOpFormNum=s.evalOpFormNum;
    if(s.xp!==undefined){ xp=s.xp; updateXPBar(); }
  }catch(e){}
}

// ===================== ACHIEVEMENTS =====================
const ACHIEVEMENTS = {
  primer_quiz:{icon:'🧠',label:'Primera prueba superada'},
  flash_master:{icon:'📚',label:'Todas las flashcards vistas'},
  clasif_pro:{icon:'🏷️',label:'Clasificador experto'},
  id_master:{icon:'🔍',label:'Identificador maestro'},
  reto_hero:{icon:'🏆',label:'Héroe del reto final'},
  nivel3:{icon:'🔭',label:'¡Explorador alcanzado! Nivel 3'},
  nivel5:{icon:'🔥',label:'¡Campeón alcanzado! Nivel 6'}
};
function unlockAchievement(id){ if(unlockedAch.includes(id)) return; unlockedAch.push(id); sfx('ach'); showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label); launchConfetti(); renderAchPanel(); saveProgress(); }
function renderAchPanel(){ const list=document.getElementById('achList'); list.innerHTML=''; Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{ const div=document.createElement('div'); div.className='ach-item'+(unlockedAch.includes(id)?'':' locked'); div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`; list.appendChild(div); }); }
function toggleAchPanel(){ sfx('click'); document.getElementById('achPanel').classList.toggle('open'); }
function showToast(msg){ let t=document.querySelector('.toast'); if(!t){ t=document.createElement('div'); t.className='toast'; document.body.appendChild(t); } t.textContent=msg; t.style.display='block'; clearTimeout(t._tid); t._tid=setTimeout(()=>t.style.display='none',3200); }
function launchConfetti(){ const colors=['#1565c0','#00838f','#00b894','#fdcb6e','#6c5ce7']; for(let i=0;i<60;i++){ const c=document.createElement('div'); c.className='confetti-piece'; c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`; document.body.appendChild(c); c.addEventListener('animationend',()=>c.remove()); } }

// ===================== XP =====================
const lvls=[{t:0,n:'Novato ✏️'},{t:25,n:'Aprendiz 📐'},{t:55,n:'Explorador 🔭'},{t:90,n:'Detective 🔍'},{t:130,n:'Experto 📊'},{t:165,n:'Campeón 🔥'},{t:190,n:'Maestro 🎓'}];
function pts(n){ xp=Math.max(0,Math.min(MXP,xp+n)); updateXPBar(); saveProgress(); }
function updateXPBar(){ const pct=Math.round((xp/MXP)*100); document.getElementById('xpFill').style.width=pct+'%'; const el=document.getElementById('xpPts'); el.textContent='⭐ '+xp; el.style.transform='scale(1.3)'; setTimeout(()=>el.style.transform='',300); let lv=0; for(let i=0;i<lvls.length;i++) if(xp>=lvls[i].t) lv=i; document.getElementById('xpLvl').textContent=lvls[lv].n; if(lv!==prevLevel){ if(lv>=2) unlockAchievement('nivel3'); if(lv>=5) unlockAchievement('nivel5'); prevLevel=lv; } }
function resetXP(){ sfx('click'); xp=0; updateXPBar(); showToast('🔄 XP reiniciado a 0'); }
function fin(id,showFX=true){ if(!done.has(id)){ done.add(id); const b=document.querySelector(`[data-s="${id}"]`); if(b) b.classList.add('done'); if(showFX){ sfx('up'); launchConfetti(); } saveProgress(); } }

// ===================== NAV =====================
function go(id){ sfx('click'); document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active')); document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{ b.classList.remove('active'); b.setAttribute('aria-selected','false'); }); document.getElementById(id).classList.add('active'); const btn=document.querySelector(`[data-s="${id}"]`); if(btn){ btn.classList.add('active'); btn.setAttribute('aria-selected','true'); } window.scrollTo({top:0,behavior:'smooth'}); if(id==='s-sopa') setTimeout(buildSopa,50); }

// ===================== FLASHCARD DATA =====================
const fcData=[
  {w:'Multiplicación',a:'operación que abrevia una suma de sumandos iguales: 4 + 4 + 4 se escribe <strong>4 × 3</strong>.'},
  {w:'Factor',a:'cada uno de los números que se multiplican. en <strong>6 × 8</strong>, el 6 y el 8 son factores.'},
  {w:'Producto',a:'resultado de una multiplicación. en 6 × 8 = <strong>48</strong>, el 48 es el producto.'},
  {w:'Multiplicando',a:'número que se va a multiplicar. suele ir <strong>arriba</strong> en el cálculo vertical.'},
  {w:'Multiplicador',a:'número que indica <strong>cuántas veces</strong> se repite el multiplicando. va abajo.'},
  {w:'Acarreo',a:'cifra que <strong>se lleva</strong> a la siguiente columna cuando un producto pasa de 9. "me llevo…".'},
  {w:'Producto parcial',a:'resultado de multiplicar por <strong>cada cifra</strong> del multiplicador por separado.'},
  {w:'Cálculo vertical',a:'multiplicar en <strong>columnas</strong>, alineando por posición y de derecha a izquierda.'},
  {w:'Alinear',a:'colocar las cifras en columnas: <strong>unidades bajo unidades</strong>, decenas bajo decenas.'},
  {w:'Tabla de multiplicar',a:'lista de productos de un número. dominarlas hace el cálculo <strong>rápido y sin errores</strong>.'},
  {w:'Propiedad conmutativa',a:'el <strong>orden de los factores no cambia</strong> el producto: 6 × 8 = 8 × 6.'},
  {w:'Multiplicar por 0',a:'cualquier número por 0 da <strong>0</strong>. "cero veces algo, es nada".'},
  {w:'Multiplicar por 1',a:'cualquier número por 1 da el <strong>mismo número</strong>.'},
  {w:'Multiplicar por 10',a:'se <strong>agrega un cero</strong> a la derecha: 45 × 10 = 450.'}
];
let fcIdx=0;
function upFC(){ document.getElementById('fcInner').classList.remove('flipped'); document.getElementById('fcW').textContent=fcData[fcIdx].w; document.getElementById('fcA').innerHTML=fcData[fcIdx].a; document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length; }
function flipCard(){ sfx('flip'); document.getElementById('fcInner').classList.toggle('flipped'); if(!xpTracker.fc.has(fcIdx)){ xpTracker.fc.add(fcIdx); pts(1); } if(xpTracker.fc.size===fcData.length){ fin('s-flash'); unlockAchievement('flash_master'); } }
function nextFC(){ sfx('click'); fcIdx=(fcIdx+1)%fcData.length; upFC(); }
function prevFC(){ sfx('click'); fcIdx=(fcIdx-1+fcData.length)%fcData.length; upFC(); }

// ===================== JUEGO: MEMORIA =====================
const memoPairs=[
  {id:'factor',t:'Factor',d:'✖️ cada número que se multiplica'},
  {id:'producto',t:'Producto',d:'🎯 el resultado: 6 × 8 = 48'},
  {id:'acarreo',t:'Acarreo',d:'🔺 lo que "me llevo" a la otra columna'},
  {id:'parcial',t:'Producto parcial',d:'1️⃣ multiplicar por una cifra a la vez'},
  {id:'vertical',t:'Cálculo vertical',d:'📊 en columnas, alineado por posición'},
  {id:'tabla',t:'Tabla',d:'📖 7 × 8 = 56, hay que dominarlas'}
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
  {q:'¿Cómo se llama el resultado de una multiplicación?',o:['a) la suma','b) el producto','c) el factor','d) el cociente'],c:1,feedback:'El resultado de multiplicar dos factores se llama producto.'},
  {q:'En 24 × 3, al multiplicar 3 × 4 = 12, ¿qué haces?',o:['a) escribo 12','b) escribo 2 y llevo 1','c) escribo 1 y llevo 2','d) escribo 21'],c:1,feedback:'Solo va una cifra por columna: escribo 2 (unidades) y llevo 1 (decena).'},
  {q:'¿Cuánto es 6 × 7?',o:['a) 42','b) 48','c) 36','d) 49'],c:0,feedback:'6 × 7 = 42. ¡Repasa la tabla del 6 y del 7!'},
  {q:'¿Cuánto es 58 × 0?',o:['a) 58','b) 0','c) 580','d) 1'],c:1,feedback:'Cualquier número multiplicado por 0 da 0.'},
  {q:'¿Cuánto es 45 × 10?',o:['a) 450','b) 45','c) 405','d) 4,500'],c:0,feedback:'Multiplicar por 10 agrega un cero a la derecha: 450.'},
  {q:'En una multiplicación por 2 cifras, el segundo producto parcial se corre un lugar hacia:',o:['a) la derecha','b) la izquierda','c) arriba','d) abajo'],c:1,feedback:'El segundo parcial multiplica decenas, así que se corre a la izquierda.'},
  {q:'¿Cuánto es 23 × 4?',o:['a) 92','b) 82','c) 812','d) 96'],c:0,feedback:'4 × 3 = 12 (escribo 2, llevo 1); 4 × 2 = 8, + 1 = 9. Total: 92.'},
  {q:'Los números que se multiplican se llaman:',o:['a) sumandos','b) factores','c) términos','d) divisores'],c:1,feedback:'En una multiplicación, los números que se multiplican son los factores.'},
  {q:'En 7 × 8 = 56 (unidades), ¿qué escribes y qué llevas?',o:['a) 56 y 0','b) 6 y 5','c) 5 y 6','d) 5 y 60'],c:1,feedback:'Escribo 6 (unidades) y llevo 5 (decenas) a la siguiente columna.'}
];
let qzIdx=0, qzSel=-1, qzDone=false;
function buildQz(){ qzIdx=0; qzSel=-1; qzDone=false; showQz(); }
function showQz(){
  if(qzIdx>=qzData.length){ document.getElementById('qzQ').textContent='🎉 ¡Quiz completado!'; document.getElementById('qzOpts').innerHTML=''; fin('s-quiz'); unlockAchievement('primer_quiz'); return; }
  const q=qzData[qzIdx];
  document.getElementById('qzProg').textContent=`Pregunta ${qzIdx+1} de ${qzData.length}`;
  document.getElementById('qzQ').textContent=q.q;
  const opts=document.getElementById('qzOpts'); opts.innerHTML='';
  q.o.forEach((o,i)=>{ const b=document.createElement('button'); b.className='qz-opt'; b.textContent=o; b.onclick=()=>{ if(qzDone)return; document.querySelectorAll('.qz-opt').forEach(x=>x.classList.remove('sel')); b.classList.add('sel'); qzSel=i; sfx('click'); }; opts.appendChild(b); });
  qzDone=false;
}
function checkQz(){
  if(qzSel<0) return fb('fbQz','Selecciona una respuesta.',false);
  qzDone=true;
  const opts=document.querySelectorAll('.qz-opt');
  if(qzSel===qzData[qzIdx].c){ opts[qzSel].classList.add('correct'); fb('fbQz','¡Correcto! +5 XP',true); if(!xpTracker.qz.has(qzIdx)){ xpTracker.qz.add(qzIdx); pts(5); } sfx('ok'); setTimeout(()=>{ qzIdx++; qzSel=-1; showQz(); },1600); }
  else{ opts[qzSel].classList.add('wrong'); opts[qzData[qzIdx].c].classList.add('correct'); const _fbMsg=qzData[qzIdx].feedback||'Incorrecto. Revisa la respuesta correcta.'; fb('fbQz',_fbMsg,false); sfx('no'); setTimeout(()=>{ qzIdx++; qzSel=-1; showQz(); },3500); }
}
function useHintQz(){
  if(qzDone) return;
  if(xp<2){ showToast('⚠️ Necesitas al menos 2 XP para usar una pista.'); return; }
  pts(-2); sfx('click'); showToast('💡 Pista aplicada: -2 XP');
  const opts=document.querySelectorAll('.qz-opt'); let hidden=0;
  for(let i=0;i<opts.length&&hidden<2;i++){ if(i!==qzData[qzIdx].c&&opts[i].style.opacity!=='0.3'){ opts[i].style.opacity='0.3'; opts[i].style.pointerEvents='none'; hidden++; } }
}
function resetQz(){ sfx('click'); qzIdx=0; qzSel=-1; qzDone=false; showQz(); document.getElementById('fbQz').classList.remove('show'); }

// ===================== CLASIFICACIÓN =====================
const classGroups=[
  {
    label:['Producto par','Producto impar'], headA:'2️⃣ Producto PAR', headB:'1️⃣ Producto IMPAR', colA:'par', colB:'impar',
    words:[{w:'4 × 6',t:'par'},{w:'3 × 5',t:'impar'},{w:'7 × 2',t:'par'},{w:'5 × 5',t:'impar'},{w:'8 × 3',t:'par'},{w:'9 × 3',t:'impar'},{w:'6 × 6',t:'par'},{w:'7 × 3',t:'impar'},{w:'2 × 9',t:'par'},{w:'5 × 7',t:'impar'}]
  },
  {
    label:['Menor que 50','50 o más'], headA:'⬇ Producto MENOR que 50', headB:'⬆ Producto de 50 o MÁS', colA:'menor', colB:'mayor',
    words:[{w:'6 × 7',t:'menor'},{w:'8 × 9',t:'mayor'},{w:'5 × 8',t:'menor'},{w:'9 × 9',t:'mayor'},{w:'4 × 9',t:'menor'},{w:'7 × 8',t:'mayor'},{w:'3 × 8',t:'menor'},{w:'8 × 8',t:'mayor'},{w:'6 × 6',t:'menor'},{w:'9 × 7',t:'mayor'}]
  },
  {
    label:['Da 24','No da 24'], headA:'✅ El producto es 24', headB:'🚫 El producto NO es 24', colA:'si', colB:'no',
    words:[{w:'4 × 6',t:'si'},{w:'3 × 8',t:'si'},{w:'2 × 12',t:'si'},{w:'8 × 3',t:'si'},{w:'5 × 5',t:'no'},{w:'4 × 5',t:'no'},{w:'6 × 6',t:'no'},{w:'7 × 3',t:'no'},{w:'1 × 24',t:'si'},{w:'9 × 3',t:'no'}]
  },
  {
    label:['Da 36','No da 36'], headA:'✅ El producto es 36', headB:'🚫 El producto NO es 36', colA:'si', colB:'no',
    words:[{w:'4 × 9',t:'si'},{w:'6 × 6',t:'si'},{w:'3 × 12',t:'si'},{w:'2 × 18',t:'si'},{w:'5 × 7',t:'no'},{w:'4 × 8',t:'no'},{w:'6 × 5',t:'no'},{w:'9 × 3',t:'no'},{w:'12 × 3',t:'si'},{w:'7 × 6',t:'no'}]
  }
];
let currentClassGroupIdx=0, clsSelected=null;
function _clsUpdateReady(){ const on=!!clsSelected; ['col-left','col-right'].forEach(id=>{ const el=document.getElementById(id); if(el) el.classList.toggle('col-ready',on); }); }
function buildClass(){
  const group=classGroups[currentClassGroupIdx];
  document.getElementById('col-left-head').textContent=group.headA;
  document.getElementById('col-right-head').textContent=group.headB;
  const bank=document.getElementById('clsBank'); bank.innerHTML='';
  clsSelected=null; _clsUpdateReady();
  document.getElementById('items-left').innerHTML='';
  document.getElementById('items-right').innerHTML='';
  function _mkBankItem(text,type){
    const el=document.createElement('div'); el.className='wb-item'; el.textContent=text; el.dataset.t=type;
    el.setAttribute('role','button'); el.setAttribute('tabindex','0');
    el.onclick=(ev)=>{ ev.stopPropagation(); sfx('click');
      if(clsSelected===el){ el.classList.remove('wb-sel'); clsSelected=null; }
      else{ document.querySelectorAll('#clsBank .wb-item').forEach(x=>x.classList.remove('wb-sel')); clsSelected=el; el.classList.add('wb-sel'); }
      _clsUpdateReady(); };
    return el;
  }
  function _mkDropItem(text,type){
    const el=document.createElement('div'); el.className='drop-item'; el.textContent=text; el.dataset.t=type;
    el.onclick=(ev)=>{
      ev.stopPropagation();
      if(clsSelected){
        const listEl=el.parentElement;
        const selText=clsSelected.textContent, selType=clsSelected.dataset.t;
        clsSelected.remove(); clsSelected=null; _clsUpdateReady();
        listEl.appendChild(_mkDropItem(selText,selType)); sfx('click'); return;
      }
      el.remove(); bank.appendChild(_mkBankItem(text,type)); sfx('click');
    };
    return el;
  }
  function _colClick(listId){
    return ()=>{
      if(!clsSelected){ fb('fbCls','Primero toca un elemento del banco para seleccionarlo.',false); return; }
      const text=clsSelected.textContent, type=clsSelected.dataset.t;
      clsSelected.remove(); clsSelected=null; _clsUpdateReady();
      document.getElementById(listId).appendChild(_mkDropItem(text,type)); sfx('click');
    };
  }
  document.getElementById('col-left').onclick=_colClick('items-left');
  document.getElementById('col-right').onclick=_colClick('items-right');
  _shuffle([...group.words]).forEach(w=>{ bank.appendChild(_mkBankItem(w.w,w.t)); });
}
function checkClass(){
  const remaining=document.querySelectorAll('#clsBank .wb-item').length;
  if(remaining>0){fb('fbCls','Coloca todos los elementos en las cajas primero.',false);return;}
  const group=classGroups[currentClassGroupIdx]; let allOk=true;
  document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{
    const inLeft=el.parentElement.id==='items-left';
    const expectedType=inLeft?group.colA:group.colB;
    if(el.dataset.t===expectedType){el.classList.add('cls-ok');}else{el.classList.add('cls-no');allOk=false;}
  });
  if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);}
  if(allOk){fb('fbCls','¡Perfecto! +5 XP',true);sfx('fan');fin('s-clasifica');unlockAchievement('clasif_pro');}
  else{fb('fbCls','Hay errores. Marcados en rojo (tócalos para devolverlos al banco).',false);sfx('no');}
}
function nextClassGroup(){ sfx('click'); currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length; buildClass(); document.getElementById('fbCls').classList.remove('show'); showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]); }
function resetClass(){ sfx('click'); buildClass(); document.getElementById('fbCls').classList.remove('show'); }

// ===================== IDENTIFICAR =====================
const idData=[
  {s:['El','producto','de','6','y','8','es','48.'],c:1,art:'Resultado de una multiplicación'},
  {s:['En','6','×','8,','los','números','son','factores.'],c:7,art:'Números que se multiplican'},
  {s:['El','acarreo','se','lleva','a','la','siguiente','columna.'],c:1,art:'Cifra que se lleva cuando el producto pasa de 9'},
  {s:['El','multiplicando','va','arriba','en','el','cálculo','vertical.'],c:1,art:'Número que se va a multiplicar (arriba)'},
  {s:['El','multiplicador','indica','cuántas','veces','se','repite.'],c:1,art:'Número que indica cuántas veces se repite'},
  {s:['Multiplicar','por','cero','siempre','da','cero.'],c:2,art:'Número por el que todo producto es 0'},
  {s:['El','producto','parcial','multiplica','una','cifra','a','la','vez.'],c:2,art:'Resultado de multiplicar por una sola cifra'},
  {s:['Las','tablas','de','multiplicar','ayudan','a','calcular','rápido.'],c:1,art:'Listas que conviene memorizar para multiplicar'}
];
let idIdx=0, idDone=false;
function showId(){
  idDone=false;
  if(idIdx>=idData.length){ document.getElementById('idSent').innerHTML='🎉 ¡Completado!'; fin('s-identifica'); unlockAchievement('id_master'); return; }
  const d=idData[idIdx];
  document.getElementById('idProg').textContent=`Oración ${idIdx+1} de ${idData.length}`;
  document.getElementById('idInfo').textContent=`Busca: ${d.art}`;
  const sent=document.getElementById('idSent'); sent.innerHTML='';
  d.s.forEach((w,i)=>{ const span=document.createElement('span'); span.className='id-word'; span.textContent=w+' '; span.onclick=()=>checkId(i,span); sent.appendChild(span); });
}
function checkId(i,span){
  if(idDone) return;
  document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected'));
  span.classList.add('selected');
  if(i===idData[idIdx].c){ idDone=true; span.classList.add('id-ok'); fb('fbId','¡Correcto! +5 XP',true); if(!xpTracker.id.has(idIdx)){ xpTracker.id.add(idIdx); pts(5); } sfx('ok'); }
  else{ span.classList.add('id-no'); fb('fbId','Ese no es el término solicitado.',false); sfx('no'); }
}
function nextId(){ sfx('click'); idIdx++; showId(); document.getElementById('fbId').classList.remove('show'); }
function resetId(){ sfx('click'); idIdx=0; showId(); document.getElementById('fbId').classList.remove('show'); }

// ===================== COMPLETA =====================
const cmpData=[
  {s:'El resultado de una multiplicación se llama ___.',opts:['suma','producto','factor'],c:1},
  {s:'Los números que se multiplican se llaman ___.',opts:['factores','sumandos','restos'],c:0},
  {s:'La cifra que se lleva a la siguiente columna es el ___.',opts:['producto','acarreo','parcial'],c:1},
  {s:'En el cálculo vertical empiezo por las ___.',opts:['decenas','unidades','centenas'],c:1},
  {s:'Cualquier número multiplicado por 0 da ___.',opts:['1','el mismo','0'],c:2},
  {s:'Cualquier número multiplicado por 1 da ___.',opts:['0','el mismo número','10'],c:1},
  {s:'Para multiplicar por 10 agrego un ___ a la derecha.',opts:['uno','cero','punto'],c:1},
  {s:'El segundo producto parcial se corre un lugar a la ___.',opts:['derecha','izquierda','arriba'],c:1}
];
let cmpIdx=0, cmpSel=-1, cmpDone=false;
function showCmp(){
  if(cmpIdx>=cmpData.length){ document.getElementById('cmpSent').innerHTML='🎉 ¡Completado!'; document.getElementById('cmpOpts').innerHTML=''; fin('s-completa'); return; }
  const d=cmpData[cmpIdx];
  document.getElementById('cmpProg').textContent=`Oración ${cmpIdx+1} de ${cmpData.length}`;
  document.getElementById('cmpSent').innerHTML=d.s.replace('___','<span class="blank">___</span>');
  const opts=document.getElementById('cmpOpts'); opts.innerHTML=''; cmpSel=-1; cmpDone=false;
  d.opts.forEach((o,i)=>{ const b=document.createElement('button'); b.className='cmp-opt'; b.textContent=o; b.onclick=()=>{ if(cmpDone)return; document.querySelectorAll('.cmp-opt').forEach(x=>x.classList.remove('sel')); b.classList.add('sel'); cmpSel=i; sfx('click'); }; opts.appendChild(b); });
}
function checkCmp(){
  if(cmpSel<0) return fb('fbCmp','Selecciona una opción.',false);
  cmpDone=true;
  const opts=document.querySelectorAll('.cmp-opt');
  if(cmpSel===cmpData[cmpIdx].c){ opts[cmpSel].classList.add('correct'); document.getElementById('cmpSent').innerHTML=cmpData[cmpIdx].s.replace('___',`<span class="blank" style="color:var(--jade);border-color:var(--jade)">${opts[cmpSel].textContent}</span>`); fb('fbCmp','¡Correcto! +5 XP',true); if(!xpTracker.cmp.has(cmpIdx)){ xpTracker.cmp.add(cmpIdx); pts(5); } sfx('ok'); }
  else{ opts[cmpSel].classList.add('wrong'); opts[cmpData[cmpIdx].c].classList.add('correct'); fb('fbCmp','Incorrecto. Revisa bien la respuesta.',false); sfx('no'); }
  setTimeout(()=>{ cmpIdx++; document.getElementById('fbCmp').classList.remove('show'); showCmp(); },1600);
}

// ===================== MINI QUIZ INLINE =====================
function answerMQ(wrapId, btn, isOk, msg) {
  const wrap = document.getElementById(wrapId);
  if (!wrap || wrap.dataset.done) return;
  wrap.dataset.done = '1';
  const allBtns = wrap.querySelectorAll('.mq-btn');
  allBtns.forEach(b => { b.disabled = true; });
  btn.classList.add(isOk ? 'mq-ok' : 'mq-no');
  if (!isOk) { allBtns.forEach(b => { if (b.onclick.toString().includes('true,')) b.classList.add('mq-ok'); }); }
  const fbEl = document.getElementById(wrapId + '-fb');
  if (fbEl) { fbEl.textContent = (isOk ? '✔ ' : '💡 ') + msg; fbEl.className = 'mq-fb show ' + (isOk ? 'ok' : 'err'); }
  if (isOk) sfx('ok'); else sfx('no');
}

// ===================== PREDICE =====================
const prediceData = [
  {
    q: 'Sin calcular del todo: ¿en qué cifra termina 34 × 5?',
    opts: ['En 0', 'En 5', 'En 2'],
    correct: 0,
    feedback: '¡Correcto! 5 × 4 = 20, termina en 0, así que 34 × 5 = 170.',
    wrongFeedback: 'Termina en 0: la unidad sale de 5 × 4 = 20 → 0.',
    explore: 'unidad'
  },
  {
    q: '¿Cuánto es 45 × 10?',
    opts: ['450', '405', '45'],
    correct: 0,
    feedback: '¡Bien! Multiplicar por 10 agrega un cero a la derecha: 450.',
    wrongFeedback: 'Es 450: por 10 se agrega un cero a la derecha.',
    explore: 'porcero'
  },
  {
    q: '¿El producto 23 × 14 es mayor o menor que 300?',
    opts: ['Mayor', 'Menor', 'Igual'],
    correct: 0,
    feedback: '¡Sí! 23 × 14 = 322, mayor que 300.',
    wrongFeedback: 'Es mayor: 23 × 14 = 322 (más de 300).',
    explore: 'parciales'
  }
];
let prediceAnswered = new Set();
function buildPredice() {
  const container = document.getElementById('prediceWidget');
  if (!container) return;
  container.innerHTML = '';
  prediceData.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = 'predice-card';
    card.innerHTML = `
      <div class="predice-num">Predicción ${i + 1} de ${prediceData.length}</div>
      <div class="predice-q">${item.q}</div>
      <button class="pd-explore-btn" onclick="togglePredExplore(${i})" id="pd-btn-${i}">🔍 Explorar la pista</button>
      <div class="pd-explore" id="pd-explore-${i}" style="display:none;"></div>
      <div class="predice-opts" id="predice-opts-${i}">
        ${item.opts.map((o, j) => `<button class="predice-btn" onclick="answerPredice(${i},${j})" id="pb-${i}-${j}">${o}</button>`).join('')}
      </div>
      <div class="predice-fb" id="predice-fb-${i}"></div>`;
    container.appendChild(card);
  });
}
function answerPredice(qi, ai) {
  const item = prediceData[qi];
  const fbEl = document.getElementById(`predice-fb-${qi}`);
  const opts = document.querySelectorAll(`#predice-opts-${qi} .predice-btn`);
  opts.forEach(b => { b.disabled = true; });
  const isOk = (ai === item.correct);
  if (isOk) {
    opts[ai].classList.add('predice-ok');
    fbEl.textContent = '✔ ' + item.feedback; fbEl.className = 'predice-fb show ok';
    if (!xpTracker.predice.has(qi)) { xpTracker.predice.add(qi); pts(3); }
    sfx('ok');
  } else {
    opts[ai].classList.add('predice-no'); opts[item.correct].classList.add('predice-ok');
    fbEl.textContent = '💡 ' + item.wrongFeedback; fbEl.className = 'predice-fb show err';
    sfx('no');
  }
  prediceAnswered.add(qi);
  if (prediceAnswered.size === prediceData.length) { fin('s-predice'); sfx('fan'); showToast('🔮 ¡Predicciones completadas! Ahora a aprender.'); }
}
function togglePredExplore(i){
  sfx('click');
  const box=document.getElementById('pd-explore-'+i); if(!box) return;
  const btn=document.getElementById('pd-btn-'+i);
  if(box.style.display==='none'){
    if(!box.dataset.built){ _buildPredExplore(i,box); box.dataset.built='1'; }
    box.style.display='block'; if(btn) btn.textContent='🔽 Ocultar la pista';
  } else { box.style.display='none'; if(btn) btn.textContent='🔍 Explorar la pista'; }
}
function _buildPredExplore(i,box){
  const type=prediceData[i].explore;
  if(type==='unidad'){
    box.innerHTML=`<p class="pd-tip">Para saber en qué termina un producto, mira solo las <strong>unidades</strong>. Toca para probar:</p><div style="display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;margin:0.5rem 0;"><button class="btn btn-pri" onclick="predUnidad(${i})">5 × 4 = ?</button></div><div class="pd-msg" id="pd-msg-${i}">👆 toca para ver la unidad</div>`;
  } else if(type==='porcero'){
    box.innerHTML=`<p class="pd-tip">Multiplicar por 10 corre las cifras un lugar y pone un 0. Toca para verlo:</p><div style="display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;margin:0.5rem 0;"><button class="btn btn-pri" onclick="predPorCero(${i})">45 × 10 = ?</button></div><div class="pd-msg" id="pd-msg-${i}">👆 toca para calcular</div>`;
  } else if(type==='parciales'){
    box.innerHTML=`<p class="pd-tip">23 × 14 se resuelve con dos productos parciales. Toca para verlos:</p><div style="display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;margin:0.5rem 0;"><button class="btn btn-pri" onclick="predParcial(${i},1)">23 × 4</button><button class="btn btn-pri" onclick="predParcial(${i},2)">23 × 10</button></div><div class="pd-counter" id="pd-cnt-${i}" style="font-size:1rem;">&nbsp;</div><div class="pd-msg" id="pd-msg-${i}">👆 prueba los dos parciales</div>`;
    box.dataset.p1=''; box.dataset.p2='';
  }
}
function predUnidad(i){ sfx('ok'); document.getElementById('pd-msg-'+i).innerHTML='5 × 4 = <strong>20</strong>: la unidad es <strong>0</strong>. Por eso 34 × 5 termina en 0 (= 170).'; }
function predPorCero(i){ sfx('ok'); document.getElementById('pd-msg-'+i).innerHTML='45 × 10 = <strong>450</strong>: solo agrego un 0 a la derecha del 45.'; }
function predParcial(i,k){
  sfx('click');
  const box=document.getElementById('pd-explore-'+i), cnt=document.getElementById('pd-cnt-'+i), msg=document.getElementById('pd-msg-'+i);
  if(k===1){ box.dataset.p1='92'; msg.innerHTML='Primer parcial: 23 × 4 = <strong>92</strong>.'; }
  else{ box.dataset.p2='230'; msg.innerHTML='Segundo parcial: 23 × 10 = <strong>230</strong> (¡corrido un lugar!).'; }
  if(box.dataset.p1&&box.dataset.p2){ cnt.innerHTML='92 + 230 = <strong>322</strong>'; sfx('ok'); }
}

// ===================== LAB 1: FÁBRICA DE PRODUCTOS =====================
let labPIdx=0, labPScore=0, labPCurrent=null;
function buildLabProductos(){ const c=document.getElementById('labProductos'); if(!c) return; labPIdx=0; labPScore=0; showLabProductos(); }
function showLabProductos(){ const c=document.getElementById('labProductos'); if(!c) return; const dos=Math.random()<0.4; const a=_rint(12,49); const b=dos?_rint(11,29):_rint(2,9); labPCurrent={a,b,p:a*b}; c.innerHTML=`<div class="wv-card"><div class="wv-deg">${a} × ${b}</div><div class="wv-q">Escribe el producto:</div><div style="display:flex;gap:0.5rem;justify-content:center;flex-wrap:wrap;align-items:center;"><input type="text" id="labPIn" inputmode="numeric" class="eval-cp-input" style="max-width:120px;"><button class="btn btn-g" onclick="ansLabProductos()">✅</button><button class="btn btn-d" onclick="showLabProductos()">🔄</button></div><div class="fb" id="fbLabP" role="alert"></div><div style="margin-top:0.5rem;font-size:0.82rem;color:var(--gray);">🏭 Aciertos: <span id="labPScore">${labPScore}</span> de 5</div></div>`; }
function ansLabProductos(){ if(!labPCurrent) return; const ok=_isIntMatch(document.getElementById('labPIn').value,labPCurrent.p); if(ok){ sfx('ok'); labPScore++; if(labPScore<=5 && !xpTracker.labP.has(labPIdx)){ xpTracker.labP.add(labPIdx); pts(2); } fb('fbLabP',`¡Correcto! ${labPCurrent.a} × ${labPCurrent.b} = ${labPCurrent.p}.`,true); labPIdx++; if(labPScore>=5) fin('s-lab'); setTimeout(showLabProductos,1200); } else { sfx('no'); fb('fbLabP',`Revisa tu cálculo vertical e inténtalo de nuevo.`,false); } }

// ===================== LAB 2: DETECTIVE DEL ACARREO =====================
let labAScore=0, labACurrent=null;
function buildLabAcarreo(){ const c=document.getElementById('labAcarreo'); if(!c) return; labAScore=0; showLabAcarreo(); }
function showLabAcarreo(){ const c=document.getElementById('labAcarreo'); if(!c) return; let a=_rint(4,9), b=_rint(4,9); while(a*b<10){ a=_rint(4,9); b=_rint(4,9); } const car=_carry(a,b); labACurrent={a,b,car}; let set=new Set([car]); while(set.size<3){ set.add(_rint(0,8)); } const opts=_shuffle([...set]); c.innerHTML=`<div class="wv-card"><div class="wv-deg">${a} × ${b} = ${a*b}</div><div class="wv-q">Al escribir las unidades, ¿cuánto llevas?</div><div class="wv-opts">${opts.map(o=>`<button class="btn btn-pri" onclick="ansLabAcarreo(${o})">${o}</button>`).join('')}</div><div class="fb" id="fbLabAc" role="alert"></div><div style="margin-top:0.5rem;font-size:0.82rem;color:var(--gray);">🔍 Aciertos: <span id="labAScore">${labAScore}</span> de 5</div></div>`; }
function ansLabAcarreo(o){ if(!labACurrent) return; if(o===labACurrent.car){ sfx('ok'); labAScore++; if(labAScore<=5 && !xpTracker.labA.has(labAScore)){ xpTracker.labA.add(labAScore); pts(2); } fb('fbLabAc',`¡Correcto! ${labACurrent.a} × ${labACurrent.b} = ${labACurrent.a*labACurrent.b}: escribo ${(labACurrent.a*labACurrent.b)%10} y llevo ${labACurrent.car}.`,true); if(labAScore>=5) fin('s-lab'); } else { sfx('no'); fb('fbLabAc',`Casi: de ${labACurrent.a*labACurrent.b} escribo ${(labACurrent.a*labACurrent.b)%10} y llevo ${labACurrent.car}.`,false); } const s=document.getElementById('labAScore'); if(s) s.textContent=labAScore; setTimeout(showLabAcarreo,1300); }

// ===================== WIDGET: VELOCIDAD (TABLAS) =====================
let wTabScore=0, wTabCur=null;
function buildTablas(){ const c=document.getElementById('widget-tablas'); if(!c) return; wTabScore=0; showTablas(); }
function showTablas(){ const c=document.getElementById('widget-tablas'); if(!c) return; const a=_rint(2,10), b=_rint(2,10); wTabCur={a,b,p:a*b}; c.innerHTML=`<div class="wv-card"><div class="wv-deg">${a} × ${b}</div><div class="wv-q">¡Rápido! Escribe el producto:</div><div style="display:flex;gap:0.5rem;justify-content:center;flex-wrap:wrap;align-items:center;"><input type="text" id="wTabIn" inputmode="numeric" class="eval-cp-input" style="max-width:100px;"><button class="btn btn-g" onclick="ansTablas()">✅</button></div><div class="fb" id="fbTab" role="alert"></div><div style="margin-top:0.5rem;font-size:0.82rem;color:var(--gray);">⚡ Aciertos: <span id="wTabScore">${wTabScore}</span> de 6</div></div>`; }
function ansTablas(){ if(!wTabCur) return; const ok=_isIntMatch(document.getElementById('wTabIn').value,wTabCur.p); if(ok){ sfx('ok'); wTabScore++; if(wTabScore<=6 && !xpTracker.wTab.has(wTabScore)){ xpTracker.wTab.add(wTabScore); pts(2); } fb('fbTab',`¡Correcto! ${wTabCur.a} × ${wTabCur.b} = ${wTabCur.p}.`,true); if(wTabScore>=6) fin('s-widgets'); setTimeout(showTablas,1000); } else { sfx('no'); fb('fbTab',`Es ${wTabCur.p}. ¡Repasa la tabla!`,false); const s=document.getElementById('wTabScore'); if(s) s.textContent=wTabScore; setTimeout(showTablas,1400); } }

// ===================== WIDGET: PRODUCTO PARCIAL =====================
let wParScore=0, wParCur=null;
function buildParcial(){ const c=document.getElementById('widget-parcial'); if(!c) return; wParScore=0; showParcial(); }
function showParcial(){ const c=document.getElementById('widget-parcial'); if(!c) return; const N=_rint(12,29), M=_rint(12,29); const u=M%10; wParCur={N,M,u,p:N*u}; c.innerHTML=`<div class="wv-card"><div class="wv-deg">${N} × ${M}</div><div class="wv-q">Calcula el <strong>primer parcial</strong>: ${N} × ${u} (unidades del ${M})</div><div style="display:flex;gap:0.5rem;justify-content:center;flex-wrap:wrap;align-items:center;"><input type="text" id="wParIn" inputmode="numeric" class="eval-cp-input" style="max-width:110px;"><button class="btn btn-g" onclick="ansParcial()">✅</button></div><div class="fb" id="fbPar" role="alert"></div><div style="margin-top:0.5rem;font-size:0.82rem;color:var(--gray);">1️⃣ Aciertos: <span id="wParScore">${wParScore}</span> de 6</div></div>`; }
function ansParcial(){ if(!wParCur) return; const ok=_isIntMatch(document.getElementById('wParIn').value,wParCur.p); if(ok){ sfx('ok'); wParScore++; if(wParScore<=6 && !xpTracker.wPar.has(wParScore)){ xpTracker.wPar.add(wParScore); pts(2); } fb('fbPar',`¡Correcto! ${wParCur.N} × ${wParCur.u} = ${wParCur.p}.`,true); if(wParScore>=6) fin('s-widgets'); setTimeout(showParcial,1100); } else { sfx('no'); fb('fbPar',`El primer parcial es ${wParCur.N} × ${wParCur.u} = ${wParCur.p}.`,false); const s=document.getElementById('wParScore'); if(s) s.textContent=wParScore; setTimeout(showParcial,1500); } }

// ===================== WIDGET: ¿CUÁNTO SE LLEVA? =====================
let wAcaScore=0, wAcaCur=null;
function buildAcarreoW(){ const c=document.getElementById('widget-acarreo'); if(!c) return; wAcaScore=0; showAcarreoW(); }
function showAcarreoW(){ const c=document.getElementById('widget-acarreo'); if(!c) return; let a=_rint(3,9), b=_rint(3,9); while(a*b<10){ a=_rint(3,9); b=_rint(3,9); } const car=_carry(a,b); wAcaCur={a,b,car}; let set=new Set([car]); while(set.size<3){ set.add(_rint(0,8)); } const opts=_shuffle([...set]); c.innerHTML=`<div class="wv-card"><div class="wv-deg">${a} × ${b} = ${a*b}</div><div class="wv-q">¿Cuánto llevas a la siguiente columna?</div><div class="wv-opts">${opts.map(o=>`<button class="btn btn-pri" onclick="ansAcarreoW(${o})">${o}</button>`).join('')}</div><div class="fb" id="fbAca" role="alert"></div><div style="margin-top:0.5rem;font-size:0.82rem;color:var(--gray);">🔺 Aciertos: <span id="wAcaScore">${wAcaScore}</span> de 6</div></div>`; }
function ansAcarreoW(o){ if(!wAcaCur) return; if(o===wAcaCur.car){ sfx('ok'); wAcaScore++; if(wAcaScore<=6 && !xpTracker.wAca.has(wAcaScore)){ xpTracker.wAca.add(wAcaScore); pts(2); } fb('fbAca',`¡Correcto! De ${wAcaCur.a*wAcaCur.b} llevo ${wAcaCur.car}.`,true); if(wAcaScore>=6) fin('s-widgets'); } else { sfx('no'); fb('fbAca',`De ${wAcaCur.a*wAcaCur.b} escribo ${(wAcaCur.a*wAcaCur.b)%10} y llevo ${wAcaCur.car}.`,false); } const s=document.getElementById('wAcaScore'); if(s) s.textContent=wAcaScore; setTimeout(showAcarreoW,1300); }

// ===================== RETO FINAL =====================
const retoPairs=[
  {
    name:'Compara productos ✖️', hint:'Calcula el producto A y compáralo con B',
    pool:[
      {w:'A: 6 × 7 vs B: 40',t:'mayor'},{w:'A: 5 × 8 vs B: 40',t:'igual'},{w:'A: 4 × 9 vs B: 40',t:'menor'},
      {w:'A: 7 × 8 vs B: 56',t:'igual'},{w:'A: 9 × 9 vs B: 80',t:'mayor'},{w:'A: 6 × 6 vs B: 40',t:'menor'},
      {w:'A: 8 × 8 vs B: 64',t:'igual'},{w:'A: 7 × 9 vs B: 60',t:'mayor'},{w:'A: 3 × 9 vs B: 30',t:'menor'},
      {w:'A: 9 × 5 vs B: 45',t:'igual'},{w:'A: 8 × 7 vs B: 50',t:'mayor'},{w:'A: 4 × 7 vs B: 30',t:'menor'}
    ]
  },
  {
    name:'Producto vs producto 🔁', hint:'Calcula ambos productos y compáralos',
    pool:[
      {w:'A: 6 × 8 vs B: 7 × 7',t:'menor'},{w:'A: 9 × 4 vs B: 6 × 6',t:'igual'},{w:'A: 8 × 9 vs B: 7 × 9',t:'mayor'},
      {w:'A: 5 × 6 vs B: 3 × 10',t:'igual'},{w:'A: 7 × 6 vs B: 8 × 6',t:'menor'},{w:'A: 9 × 9 vs B: 8 × 9',t:'mayor'},
      {w:'A: 4 × 12 vs B: 6 × 8',t:'igual'},{w:'A: 5 × 9 vs B: 7 × 7',t:'menor'},{w:'A: 9 × 8 vs B: 10 × 7',t:'mayor'},
      {w:'A: 6 × 6 vs B: 4 × 9',t:'igual'},{w:'A: 7 × 5 vs B: 6 × 6',t:'menor'},{w:'A: 8 × 8 vs B: 9 × 7',t:'mayor'}
    ]
  },
  {
    name:'Por 10 y dobles 🔟', hint:'× 10 agrega un cero · el doble es × 2. Calcula A y compara con B',
    pool:[
      {w:'A: 23 × 10 vs B: 230',t:'igual'},{w:'A: 15 × 10 vs B: 200',t:'menor'},{w:'A: 32 × 10 vs B: 300',t:'mayor'},
      {w:'A: el doble de 45 vs B: 90',t:'igual'},{w:'A: el doble de 38 vs B: 80',t:'menor'},{w:'A: el doble de 55 vs B: 100',t:'mayor'},
      {w:'A: 12 × 10 vs B: 120',t:'igual'},{w:'A: 9 × 10 vs B: 100',t:'menor'},{w:'A: 14 × 10 vs B: 130',t:'mayor'},
      {w:'A: el doble de 60 vs B: 120',t:'igual'},{w:'A: el doble de 25 vs B: 60',t:'menor'},{w:'A: el doble de 70 vs B: 130',t:'mayor'}
    ]
  }
];
let currentRetoPairIdx=0;
let retoPool=[], retoOk=0, retoErr=0, retoTimerInt=null, retoSec=30, retoRunning=false, retoCurrent=null;
function _retoPairLbl(){ const rp=retoPairs[currentRetoPairIdx]; const el=document.getElementById('retoPairLbl'); if(el) el.textContent='🎯 Pareja actual: '+rp.name+' — 💡 '+rp.hint; }
function nextRetoPair(){ sfx('click'); currentRetoPairIdx=(currentRetoPairIdx+1)%retoPairs.length; resetReto(); _retoPairLbl(); showToast('🔀 Pareja: '+retoPairs[currentRetoPairIdx].name); }
function startReto(){
    if(retoRunning)return; sfx('click'); retoRunning=true; retoOk=0; retoErr=0; retoSec=30;
    const pool=retoPairs[currentRetoPairIdx].pool;
    retoPool=_shuffle([...pool,...pool]); showRetoWord();
    const _fill=document.getElementById('retoBarFill'); if(_fill){_fill.style.width='100%';_fill.style.background='var(--jade)';}
  retoTimerInt=setInterval(()=>{ retoSec--; sfx('tick'); document.getElementById('retoTimer').textContent='⏱ '+retoSec; if(retoSec<=10) document.getElementById('retoTimer').style.color='var(--red)'; const fill=document.getElementById('retoBarFill'); if(fill){fill.style.width=(retoSec/30*100)+'%';if(retoSec<=10)fill.style.background='var(--red)';} if(retoSec<=0){ clearInterval(retoTimerInt); endReto(); } },1000);
}
function showRetoWord(){ const pool=retoPairs[currentRetoPairIdx].pool; if(retoPool.length===0) retoPool=_shuffle([...pool,...pool]); retoCurrent=retoPool.pop(); document.getElementById('retoWord').textContent=retoCurrent.w; }
function ansReto(t){
    if(!retoRunning||!retoCurrent)return;
    const firstPlay=!xpTracker.reto.has(1);
    const correct=(t===retoCurrent.t);
    if(correct){ sfx('ok'); retoOk++; if(firstPlay) pts(1); }
    else{
      sfx('no'); retoErr++; if(firstPlay) pts(-1);
      const _gb=document.getElementById('gameBox'); if(_gb){_gb.classList.remove('shake-error');void _gb.offsetWidth;_gb.classList.add('shake-error');}
      const _fb=document.getElementById('fbReto');
      if(_fb){ const labels={mayor:'A es MAYOR que B',menor:'A es MENOR que B',igual:'A es IGUAL a B'}; _fb.textContent=`En ${retoCurrent.w}: ${labels[retoCurrent.t]}`; _fb.className='fb show err'; setTimeout(()=>_fb.classList.remove('show'),2000); }
    }
    document.getElementById('retoScore').textContent=`✔ ${retoOk} correctas | ✗ ${retoErr} errores`; showRetoWord();
}
function endReto(){ retoRunning=false; document.getElementById('retoWord').textContent='🏁 ¡Tiempo!'; document.getElementById('retoTimer').style.color='var(--pri)'; xpTracker.reto.add(1); const total=retoOk+retoErr; const pct=total>0?Math.round((retoOk/total)*100):0; fb('fbReto',`Resultado: ${retoOk}/${total} (${pct}%) ¡Bien hecho! Prueba otra pareja con 🔀`,true); fin('s-reto'); sfx('fan'); unlockAchievement('reto_hero'); }
function resetReto(){ sfx('click'); clearInterval(retoTimerInt); retoRunning=false; retoSec=30; retoOk=0; retoErr=0; document.getElementById('retoTimer').textContent='⏱ 30'; document.getElementById('retoTimer').style.color='var(--pri)'; document.getElementById('retoWord').textContent='¡Prepárate!'; document.getElementById('retoScore').textContent='✔ 0 correctas | ✗ 0 errores'; document.getElementById('fbReto').classList.remove('show'); }

// ===================== GENERADOR DE TAREAS =====================
function _tgRint(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
function _tgLines(n){ let s=''; for(let i=0;i<n;i++) s+='<div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.4rem;height:1.3rem;">&nbsp;</div>'; return s; }
function _tgTask(out,i,inner){ const div=document.createElement('div'); div.className='tg-task'; div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content">${inner}</div>`; out.appendChild(div); }
function _instrBlock(out,title,lines){ const ib=document.createElement('div'); ib.className='tg-instruction-block'; ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join(''); out.appendChild(ib); }
const pensamientoTaskDB=[
  {q:'Ana dice: "58 × 0 = 58 porque el número no cambia". ¿Tiene razón? Explica.',ans:'No. Multiplicar por 0 da 0. El que deja el número igual es multiplicar por 1.',type:'🔎 Detectar error'},
  {q:'Un número multiplicado por sí mismo da 49. ¿Cuál es? Explica cómo lo hallaste.',ans:'Es el 7, porque 7 × 7 = 49.',type:'🕵️ Número misterioso'},
  {q:'¿Por qué 6 × 8 da lo mismo que 8 × 6? ¿Cómo se llama esa propiedad?',ans:'Porque el orden de los factores no cambia el producto: propiedad conmutativa. Ambos dan 48.',type:'🧠 Razonar'},
  {q:'Escribe una multiplicación cuyo producto sea 72 y explica cómo la comprobarías.',ans:'Respuesta variable: 8 × 9, 9 × 8, 6 × 12… Se comprueba multiplicando o dividiendo el producto entre un factor.',type:'✏️ Crear problema'},
  {q:'Sin multiplicar del todo, ¿en qué cifra termina 47 × 5? Justifica.',ans:'En 5. Porque 5 × 7 = 35 y la unidad de 35 es 5.',type:'⚡ Truco de la unidad'},
  {q:'¿Cuál es más grande: 25 × 4 o 30 × 3? Calcula y compara.',ans:'25 × 4 = 100 y 30 × 3 = 90. Es mayor 25 × 4.',type:'🧠 Comparar'}
];
function genPensamientoTask(out,count){
  _instrBlock(out,'Instrucción',['Desarrolla con argumentos. Escribe, explica o inventa según se pide.','<em>Lo importante es tu razonamiento, no solo el resultado.</em>']);
  const pool=_shuffle([...pensamientoTaskDB]);
  for(let i=0;i<count;i++){
    const item=pool[i%pool.length]; const div=document.createElement('div'); div.className='tg-task';
    div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><span class="tg-type-tag">${item.type}</span><br><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.3rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.3rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✔ ${item.ans}</div></div>`;
    out.appendChild(div);
  }
}
let ansVisible=false;
function genTask(){ sfx('click'); const type=document.getElementById('tgType').value; const count=parseInt(document.getElementById('tgCount').value); ansVisible=false; const out=document.getElementById('tgOut'); out.innerHTML=''; if(type==='unacifra') genUnaCifraTask(out,count); else if(type==='doscifras') genDosCifrasTask(out,count); else if(type==='parciales') genParcialesTask(out,count); else if(type==='problemas') genProblemasTask(out,count); else if(type==='pensamiento') genPensamientoTask(out,count); fin('s-tareas'); }
function genUnaCifraTask(out,count){
  _instrBlock(out,'Instrucción — Multiplicar por 1 cifra',['Resuelve cada multiplicación con el método vertical: alinea, multiplica desde las unidades y lleva el acarreo.','<strong>Recuerda:</strong> solo va una cifra por columna; el resto se lleva.']);
  for(let i=0;i<count;i++){ const a=_tgRint(23,489), b=_tgRint(2,9); _tgTask(out,i,`<strong>${a} × ${b} =</strong>${_tgLines(1)}<div class="tg-answer">✔ ${a*b}</div>`); }
}
function genDosCifrasTask(out,count){
  _instrBlock(out,'Instrucción — Multiplicar por 2 cifras',['Resuelve con productos parciales: multiplica por las unidades, luego por las decenas (corrido un lugar) y suma.','<strong>No olvides</strong> desplazar el segundo parcial.']);
  for(let i=0;i<count;i++){ const a=_tgRint(13,99), b=_tgRint(11,49); _tgTask(out,i,`<strong>${a} × ${b} =</strong>${_tgLines(2)}<div class="tg-answer">✔ ${a*b}</div>`); }
}
function genParcialesTask(out,count){
  _instrBlock(out,'Instrucción — Productos parciales',['Para cada multiplicación por 2 cifras, escribe el primer parcial (por las unidades), el segundo (por las decenas, corrido) y el total.','<strong>Ejemplo:</strong> 23 × 14 → 92 · 230 · 322.']);
  for(let i=0;i<count;i++){ const a=_tgRint(13,49), b=_tgRint(12,29); const u=b%10, d=b-u; _tgTask(out,i,`<strong>${a} × ${b}: escribe los parciales y el total</strong>${_tgLines(2)}<div class="tg-answer">✔ 1º ${a}×${u}=${a*u} · 2º ${a}×${d}=${a*d} · Total ${a*b}</div>`); }
}
function genProblemasTask(out,count){
  _instrBlock(out,'Instrucción — Problemas de multiplicación',['Lee cada problema, decide que se multiplica y resuelve en tu cuaderno.','<strong>Pista:</strong> "cada", "por" y "en total" suelen indicar multiplicación.']);
  const NAMES=['Ana','Luis','Marta','José','Carmen','Pedro','Sofía','Iván'];
  const OBJS=['galletas','lápices','boletos','mangos','sillas','libros'];
  for(let i=0;i<count;i++){
    const n=NAMES[_tgRint(0,NAMES.length-1)], obj=OBJS[_tgRint(0,OBJS.length-1)];
    const a=_tgRint(4,12), b=_tgRint(6,25);
    _tgTask(out,i,`<strong>${n} tiene ${a} cajas con ${b} ${obj} cada una. ¿Cuántas ${obj} hay en total?</strong>${_tgLines(1)}<div class="tg-answer">✔ ${a} × ${b} = ${a*b} ${obj}</div>`);
  }
}
function toggleAns(){ ansVisible=!ansVisible; document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none'); sfx('click'); }

// ===================== SOPA DE LETRAS =====================
const _SOPA_ALPHA='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function _buildSopaGrid(size, words){
  const DIRS=[[0,1],[1,0],[1,1],[1,-1],[0,-1],[-1,0],[-1,-1],[-1,1]];
  for(let attempt=0; attempt<80; attempt++){
    const grid=Array.from({length:size},()=>Array(size).fill(''));
    const placed={}; let ok=true;
    const sorted=[...words].sort((a,b)=>b.length-a.length);
    for(const w of sorted){
      let done=false;
      for(let t=0;t<400 && !done;t++){
        const d=DIRS[_rint(0,DIRS.length-1)];
        const r0=_rint(0,size-1), c0=_rint(0,size-1);
        const rEnd=r0+d[0]*(w.length-1), cEnd=c0+d[1]*(w.length-1);
        if(rEnd<0||rEnd>=size||cEnd<0||cEnd>=size) continue;
        let fits=true; const cells=[];
        for(let i=0;i<w.length;i++){ const r=r0+d[0]*i, c=c0+d[1]*i; const cur=grid[r][c]; if(cur!==''&&cur!==w[i]){ fits=false; break; } cells.push([r,c]); }
        if(!fits) continue;
        for(let i=0;i<w.length;i++){ grid[cells[i][0]][cells[i][1]]=w[i]; }
        placed[w]={w, cells}; done=true;
      }
      if(!done){ ok=false; break; }
    }
    if(!ok) continue;
    for(let r=0;r<size;r++) for(let c=0;c<size;c++) if(grid[r][c]==='') grid[r][c]=_SOPA_ALPHA[_rint(0,25)];
    return {size, grid, words: words.map(w=>placed[w])};
  }
  const grid=Array.from({length:size},()=>Array(size).fill('')); const wordsOut=[];
  words.forEach((w,idx)=>{ const r=idx%size; const cells=[]; for(let i=0;i<w.length&&i<size;i++){ grid[r][i]=w[i]; cells.push([r,i]); } wordsOut.push({w,cells}); });
  for(let r=0;r<size;r++) for(let c=0;c<size;c++) if(grid[r][c]==='') grid[r][c]=_SOPA_ALPHA[_rint(0,25)];
  return {size, grid, words: wordsOut};
}
const _sopaWordSets=[
  ['FACTOR','PRODUCTO','ACARREO','TABLA','UNIDADES','DECENAS','PARCIAL','CIFRA'],
  ['MULTIPLO','VERTICAL','NUMERO','SUMA','EXACTO','TOTAL','CERO','ALINEAR']
];
let sopaSets=_sopaWordSets.map(ws=>_buildSopaGrid(12,ws));
let currentSopaSetIdx=0, sopaFoundWords=new Set();
let sopaFirstClickCell=null, sopaPointerStartCell=null, sopaPointerMoved=false, sopaSelectedCells=[];
function getSopaCellSize(){ const container=document.getElementById('sopaGrid'); if(!container||!container.parentElement)return 28; const avail=container.parentElement.clientWidth-16; const set=sopaSets[currentSopaSetIdx]; return Math.max(20,Math.min(32,Math.floor(avail/set.size))); }
function buildSopa(){
  const set=sopaSets[currentSopaSetIdx]; const grid=document.getElementById('sopaGrid'); grid.innerHTML=''; const sz=getSopaCellSize(); grid.style.gridTemplateColumns=`repeat(${set.size},${sz}px)`; grid.style.gridTemplateRows=`repeat(${set.size},${sz}px)`; sopaFirstClickCell=null; sopaSelectedCells=[];
  for(let r=0;r<set.size;r++) for(let c=0;c<set.size;c++){ const cell=document.createElement('div'); cell.className='sopa-cell'; cell.style.width=sz+'px'; cell.style.height=sz+'px'; cell.style.fontSize=Math.max(11,sz-10)+'px'; cell.textContent=set.grid[r][c]; cell.dataset.row=r; cell.dataset.col=c; const alreadyFound=set.words.find(w=>sopaFoundWords.has(w.w)&&w.cells.some(([wr,wc])=>wr===r&&wc===c)); if(alreadyFound) cell.classList.add('sopa-found'); grid.appendChild(cell); }
  setupSopaEvents();
  const wl=document.getElementById('sopaWords'); wl.innerHTML=''; set.words.forEach(wObj=>{ const sp=document.createElement('span'); sp.className='sopa-w'+(sopaFoundWords.has(wObj.w)?' found':''); sp.id='sw-'+wObj.w; sp.textContent=wObj.w; wl.appendChild(sp); });
}
function setupSopaEvents(){
  const grid=document.getElementById('sopaGrid');
  grid.onpointerdown=e=>{ const cell=e.target.closest('.sopa-cell'); if(!cell)return; e.preventDefault(); grid.setPointerCapture(e.pointerId); sopaPointerStartCell=cell; sopaPointerMoved=false; cell.classList.add('sopa-sel'); sopaSelectedCells=[cell]; };
  grid.onpointermove=e=>{ if(!sopaPointerStartCell)return; e.preventDefault(); const el=document.elementFromPoint(e.clientX,e.clientY); const cell=el?el.closest('.sopa-cell'):null; if(!cell)return; const sr=parseInt(sopaPointerStartCell.dataset.row),sc=parseInt(sopaPointerStartCell.dataset.col); const er=parseInt(cell.dataset.row),ec=parseInt(cell.dataset.col); if(sr!==er||sc!==ec) sopaPointerMoved=true; document.querySelectorAll('.sopa-cell.sopa-sel').forEach(c=>c.classList.remove('sopa-sel')); sopaSelectedCells=[]; getSopaPath(sr,sc,er,ec).forEach(([r,c])=>{ const pc=document.querySelector(`#sopaGrid [data-row="${r}"][data-col="${c}"]`); if(pc){pc.classList.add('sopa-sel');sopaSelectedCells.push(pc);} }); };
  grid.onpointerup=e=>{ if(!sopaPointerStartCell)return; e.preventDefault(); grid.releasePointerCapture(e.pointerId); if(sopaPointerMoved&&sopaSelectedCells.length>1){ checkSopaSelection(); } else{ const cell=sopaPointerStartCell; document.querySelectorAll('.sopa-cell.sopa-sel').forEach(c=>c.classList.remove('sopa-sel')); sopaSelectedCells=[]; if(!sopaFirstClickCell){ sopaFirstClickCell=cell; cell.classList.add('sopa-start'); } else if(sopaFirstClickCell===cell){ cell.classList.remove('sopa-start'); sopaFirstClickCell=null; } else{ const sr=parseInt(sopaFirstClickCell.dataset.row),sc=parseInt(sopaFirstClickCell.dataset.col); const er=parseInt(cell.dataset.row),ec=parseInt(cell.dataset.col); sopaFirstClickCell.classList.remove('sopa-start'); sopaFirstClickCell=null; getSopaPath(sr,sc,er,ec).forEach(([r,c])=>{ const pc=document.querySelector(`#sopaGrid [data-row="${r}"][data-col="${c}"]`); if(pc){pc.classList.add('sopa-sel');sopaSelectedCells.push(pc);} }); checkSopaSelection(); } } sopaPointerStartCell=null; sopaPointerMoved=false; };
}
function getSopaPath(r1,c1,r2,c2){ const dr=Math.sign(r2-r1),dc=Math.sign(c2-c1); const lr=Math.abs(r2-r1),lc=Math.abs(c2-c1); if(lr!==0&&lc!==0&&lr!==lc)return[[r1,c1]]; const len=Math.max(lr,lc); const path=[]; for(let i=0;i<=len;i++) path.push([r1+dr*i,c1+dc*i]); return path; }
function checkSopaSelection(){ const set=sopaSets[currentSopaSetIdx]; const word=sopaSelectedCells.map(c=>c.textContent).join(''); const wordRev=word.split('').reverse().join(''); const found=set.words.find(wObj=>!sopaFoundWords.has(wObj.w)&&(wObj.w===word||wObj.w===wordRev)); if(found){ sopaFoundWords.add(found.w); found.cells.forEach(([r,c])=>{ const cell=document.querySelector(`#sopaGrid [data-row="${r}"][data-col="${c}"]`); if(cell){cell.classList.remove('sopa-sel','sopa-start');cell.classList.add('sopa-found');} }); const sp=document.getElementById('sw-'+found.w); if(sp) sp.classList.add('found'); if(!xpTracker.sopa.has(found.w)){xpTracker.sopa.add(found.w);pts(1);} sfx('ok'); if(sopaFoundWords.size===set.words.length){fin('s-sopa');sfx('fan');showToast('🎉 ¡Todas las palabras encontradas!');} else showToast('✔ ¡Encontraste: '+found.w+'!'); } else sfx('no'); document.querySelectorAll('.sopa-cell.sopa-sel').forEach(c=>c.classList.remove('sopa-sel')); sopaSelectedCells=[]; }
function nextSopaSet(){ sfx('click'); sopaFoundWords=new Set(); currentSopaSetIdx=(currentSopaSetIdx+1)%sopaSets.length; buildSopa(); showToast('🔄 Nueva sopa cargada'); }
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
window.addEventListener('resize',()=>{ clearTimeout(_sopaResizeTimer); _sopaResizeTimer=setTimeout(()=>{if(document.getElementById('s-sopa').classList.contains('active'))buildSopa();},200); });

// ===================== EVALUACIÓN FINAL (CONCEPTUAL) =====================
const evalTFBank=[
  {q:'El resultado de una multiplicación se llama producto.',a:true},
  {q:'Multiplicar por cero da el mismo número.',a:false},
  {q:'En el cálculo vertical se empieza por las unidades.',a:true},
  {q:'El acarreo es la cifra que se lleva a la siguiente columna.',a:true},
  {q:'El orden de los factores cambia el producto.',a:false},
  {q:'Multiplicar por 10 agrega un cero a la derecha.',a:true},
  {q:'El segundo producto parcial se escribe sin desplazar.',a:false},
  {q:'Los números que se multiplican se llaman factores.',a:true},
  {q:'6 × 8 = 48.',a:true},
  {q:'7 × 9 = 61.',a:false}
];
const evalMCBank=[
  {q:'¿Cuánto es 8 × 7?',o:['a) 54','b) 56','c) 63','d) 49'],a:1},
  {q:'¿Cuánto es 34 × 5?',o:['a) 150','b) 170','c) 160','d) 175'],a:1},
  {q:'El resultado de multiplicar se llama:',o:['a) suma','b) producto','c) factor','d) resto'],a:1},
  {q:'¿Cuánto es 60 × 10?',o:['a) 600','b) 60','c) 6,000','d) 610'],a:0},
  {q:'¿Cuánto es 23 × 4?',o:['a) 82','b) 92','c) 96','d) 84'],a:1},
  {q:'¿Cuánto es 45 × 0?',o:['a) 45','b) 0','c) 450','d) 1'],a:1},
  {q:'En 6 × 9 = 54, en las unidades escribo 4 y llevo:',o:['a) 5','b) 4','c) 54','d) 0'],a:0},
  {q:'¿Cuánto es 12 × 12?',o:['a) 124','b) 144','c) 122','d) 132'],a:1}
];
const evalCPBank=[
  {q:'El resultado de una multiplicación es el ___.',a:'producto',acc:['producto','el producto']},
  {q:'Los números que se multiplican son los ___.',a:'factores',acc:['factores','factor']},
  {q:'La cifra que se lleva a la otra columna es el ___.',a:'acarreo',acc:['acarreo','el acarreo']},
  {q:'Multiplicar 7 × 8 = ___.',a:'56',acc:['56','cincuenta y seis']},
  {q:'Cualquier número multiplicado por 0 da ___.',a:'0',acc:['0','cero']},
  {q:'Para multiplicar por 10 se agrega un ___ a la derecha.',a:'cero',acc:['cero','0','un cero']},
  {q:'Multiplicar 6 × 6 = ___.',a:'36',acc:['36','treinta y seis']},
  {q:'El número de arriba en el cálculo vertical es el ___.',a:'multiplicando',acc:['multiplicando','el multiplicando']}
];
const evalPRBank=[
  {term:'Factor',def:'Cada número que se multiplica'},
  {term:'Producto',def:'Resultado de la multiplicación'},
  {term:'Acarreo',def:'Cifra que se lleva a la siguiente columna'},
  {term:'Multiplicando',def:'Número que se va a multiplicar (arriba)'},
  {term:'Producto parcial',def:'Resultado de multiplicar por una sola cifra'},
  {term:'Propiedad conmutativa',def:'El orden de los factores no cambia el producto'}
];
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
function genEval(){
  sfx('click');
  _evalFormaSelector(); const _selF = document.getElementById('evalFormaSel'); if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10))); const cf = evalFormNum; const rng = _evalRng(cf); window._currentEvalForm=cf; evalFormNum = (evalFormNum % EVAL_FORMAS) + 1; _evalFormaSelector(); saveProgress();
  document.getElementById('eval-screen-title').textContent=`📋 Evaluación Final — Forma ${cf}`;
  evalAnsVisible=false;
  const out=document.getElementById('evalOut'); out.innerHTML='';
  const bar=document.createElement('div'); bar.className='eval-score-bar';
  bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje — 100 puntos</div><div class="esb-dist">4 secciones × 5 preguntas × 5 pts = 100 pts</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">I. Completar 25 pts</span><span class="eval-score-pill esp-tf">II. V/F 25 pts</span><span class="eval-score-pill esp-mc">III. Selección 25 pts</span><span class="eval-score-pill esp-pr">IV. Pareados 25 pts</span></div>`;
  out.appendChild(bar);
  const cpItems=_pickF(evalCPBank,5, rng);
  const s1=document.createElement('div'); s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  cpItems.forEach((item,i)=>{ const d=document.createElement('div'); d.className='eval-item eval-auto-item'; const qHtml=item.q.replace('___','<input class="eval-cp-input" type="text" data-ecp="'+i+'" autocomplete="off" style="min-width:110px;">'); d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbEcp${i}" aria-live="polite"></div>`; s1.appendChild(d); });
  out.appendChild(s1);
  const tfItems=_pickF(evalTFBank,5, rng);
  const s2=document.createElement('div'); s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  tfItems.forEach((item,i)=>{ const d=document.createElement('div'); d.className='eval-item eval-auto-item'; d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="V"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="F"> Falso</label></div><div style="margin-top:0.4rem;margin-left:1.7rem;font-size:0.82rem;color:var(--gray);">Justifica por qué: <span style="display:inline-block;min-width:180px;border-bottom:1px solid var(--border);">&nbsp;</span></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbEtf${i}" aria-live="polite"></div>`; s2.appendChild(d); });
  out.appendChild(s2);
  const mcItems=_pickF(evalMCBank,5, rng);
  const s3=document.createElement('div'); s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  mcItems.forEach((item,i)=>{ const d=document.createElement('div'); d.className='eval-item eval-auto-item'; const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join(''); d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbEmc${i}" aria-live="polite"></div>`; s3.appendChild(d); });
  out.appendChild(s3);
  const prItems=_pickF(evalPRBank,5, rng); const shuffledDefs=_shuffleF(prItems, rng); const letters=['A','B','C','D','E'];
  const s4=document.createElement('div'); s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  const matchCard=document.createElement('div'); matchCard.className='eval-item eval-auto-item';
  let colLeft='<div class="eval-match-col"><h4>📘 Términos</h4>';
  prItems.forEach((item,i)=>{ const selHtml='<select class="eval-pr-sel" data-epr="'+i+'" aria-label="Letra para '+item.term+'"><option value="">—</option>'+letters.map(L=>'<option value="'+L+'">'+L+'</option>').join('')+'</select>'; colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> ${selHtml} ${item.term}</div>`; });
  colLeft+='</div>';
  let colRight='<div class="eval-match-col"><h4>📗 Definiciones</h4>';
  shuffledDefs.forEach((item,i)=>{ colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`; });
  colRight+='</div>';
  const ansKey=prItems.map((item,i)=>{ const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)]; return `${i+16}→${letter}`; }).join(' · ');
  matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div><div class="eval-item-feedback" id="evalFbEpr" aria-live="polite"></div>`;
  s4.appendChild(matchCard); out.appendChild(s4);
  const autoPanel=document.createElement('div'); autoPanel.id='evalAutoResult'; autoPanel.className='eval-auto-result';
  autoPanel.innerHTML='<strong>🧮 Prueba interactiva:</strong> escribe, marca y selecciona tus respuestas en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato para resolver en papel.';
  out.appendChild(autoPanel);
  window._evalPrintData={tf:tfItems,mc:mcItems,cp:cpItems,pr:{terms:prItems,shuffledDefs,letters}};
  window._evalGradeData={cp:cpItems,tf:tfItems,mc:mcItems,pr:{terms:prItems,shuffledDefs,letters}};
  fin('s-evaluacion');
}
function _normTxt(s){ return (s||'').toString().trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9ñ ]/gi,'').replace(/\s+/g,' ').trim(); }
function gradeEval(){
  if(!window._evalGradeData){ showToast('⚠️ Genera una evaluación primero'); return; }
  sfx('click');
  const d=window._evalGradeData; let total=0; const det={cp:0,tf:0,mc:0,pr:0};
  d.cp.forEach((it,i)=>{ const el=document.querySelector(`[data-ecp="${i}"]`); const val=_normTxt(el?el.value:''); const ok=val!==''&&(it.acc||[it.a]).some(a=>_normTxt(a)===val); if(el){ el.classList.toggle('eval-input-ok',ok); el.classList.toggle('eval-input-no',!ok); } if(ok){ det.cp++; total+=5; } setEvalFeedback('evalFbEcp'+i,ok,ok?'Correcto. +5 pts':'Revisar. R/ '+it.a); });
  d.tf.forEach((it,i)=>{ const sel=document.querySelector(`#evalOut input[name="tf${i}"]:checked`); const ok=!!sel&&sel.value===(it.a?'V':'F'); if(ok){ det.tf++; total+=5; } setEvalFeedback('evalFbEtf'+i,ok,ok?'Correcto. +5 pts':'Revisar. R/ '+(it.a?'Verdadero':'Falso')); });
  d.mc.forEach((it,i)=>{ const sel=document.querySelector(`#evalOut input[name="mc${i}"]:checked`); const ok=!!sel&&parseInt(sel.value,10)===it.a; if(ok){ det.mc++; total+=5; } setEvalFeedback('evalFbEmc'+i,ok,ok?'Correcto. +5 pts':'Revisar. R/ '+it.o[it.a]); });
  const okLetters=d.pr.terms.map(t=>d.pr.letters[d.pr.shuffledDefs.findIndex(df=>df.def===t.def)]);
  const prPend=[];
  d.pr.terms.forEach((t,i)=>{ const el=document.querySelector(`[data-epr="${i}"]`); const ok=!!el&&el.value===okLetters[i]; if(el){ el.classList.toggle('eval-input-ok',ok); el.classList.toggle('eval-input-no',!ok); } if(ok){ det.pr++; total+=5; } else prPend.push(`${i+16}→${okLetters[i]}`); });
  setEvalFeedback('evalFbEpr',prPend.length===0,prPend.length===0?'Pareados perfectos. +25 pts':'Revisar. R/ '+prPend.join(' · '));
  const res=document.getElementById('evalAutoResult');
  if(res){ res.className='eval-auto-result '+(total>=70?'eval-auto-pass':'eval-auto-risk'); res.innerHTML=`<strong>Resultado: ${total}/100 pts</strong><br><span>Completar: ${det.cp*5}/25 · V/F: ${det.tf*5}/25 · Selección: ${det.mc*5}/25 · Pareados: ${det.pr*5}/25</span>`; }
  if(total>=70){ pts(8); showToast('🎯 Evaluación calificada: '+total+'/100'); }
  else showToast('🧮 Evaluación: '+total+'/100. Revisa los ítems marcados.');
}
function toggleEvalAns(){ evalAnsVisible=!evalAnsVisible; document.querySelectorAll('#evalOut .eval-answer').forEach(el=>el.style.display=evalAnsVisible?'block':'none'); sfx('click'); }
function printEval(){
  if(!window._evalPrintData){showToast('⚠️ Genera una evaluación primero');return;}
  sfx('click');
  const forma=window._currentEvalForm||1; const d=window._evalPrintData;
  let s1=`<div class="sec-title"><span>I. Completar el espacio</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25 pts</span></div></div>`;
  d.cp.forEach((it,i)=>{ const q=it.q.replace('___','<span class="cp-blank"></span>'); s1+=`<div class="cp-row"><span class="qn">${i+1}.</span><span class="cp-text">${q}</span></div>`; });
  let s2=`<div class="sec-title"><span>II. Verdadero o Falso</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25 pts</span></div></div>`;
  d.tf.forEach((it,i)=>{ s2+=`<div class="tf-row"><span class="qn">${i+6}.</span><span class="tf-blank"></span><span class="tf-text">${it.q}</span></div>`; });
  let s3=`<div class="sec-title"><span>III. Selección Múltiple</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25 pts</span></div></div><div class="mc-grid">`;
  d.mc.forEach((it,i)=>{ const opts=it.o.map((op,oi)=>`<label class="mc-opt"><input type="radio" name="mc${i}"> ${op}</label>`).join(''); s3+=`<div class="mc-item"><div class="mc-q"><span class="qn">${i+11}.</span><span>${it.q}</span></div><div class="mc-opts">${opts}</div></div>`; });
  s3+=`</div>`;
  let colL='<div class="pr-col"><div class="pr-head">📘 Términos</div>';
  d.pr.terms.forEach((it,i)=>{ colL+=`<div class="pr-item"><span class="pr-num">${i+16}.</span><span class="pr-line"></span>${it.term}</div>`; });
  colL+='</div>';
  let colR='<div class="pr-col"><div class="pr-head">📗 Definiciones</div>';
  d.pr.shuffledDefs.forEach((it,i)=>{ colR+=`<div class="pr-item"><span class="pr-num">${d.pr.letters[i]}.</span>${it.def}</div>`; });
  colR+='</div>';
  let s4=`<div class="pr-section"><div class="sec-title"><span>IV. Términos Pareados</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25 pts</span></div></div><div class="pr-grid">${colL}${colR}</div></div>`;
  let pR='';
  pR+=`<div class="p-sec"><div class="p-ttl">I. Completar</div><table class="p-tbl">`;
  d.cp.forEach((it,i)=>{ pR+=`<tr><td class="pn">${i+1}.</td><td class="pa">${it.a}</td></tr>`; });
  pR+=`</table></div><div class="p-sec"><div class="p-ttl">II. V o F</div><table class="p-tbl">`;
  d.tf.forEach((it,i)=>{ pR+=`<tr><td class="pn">${i+6}.</td><td class="pa">${it.a?'V':'F'}</td></tr>`; });
  pR+=`</table></div><div class="p-sec"><div class="p-ttl">III. Selección</div><table class="p-tbl">`;
  d.mc.forEach((it,i)=>{ pR+=`<tr><td class="pn">${i+11}.</td><td class="pa">${it.o[it.a]}</td></tr>`; });
  pR+=`</table></div><div class="p-sec"><div class="p-ttl">IV. Pareados</div><table class="p-tbl">`;
  d.pr.terms.forEach((it,i)=>{ const l=d.pr.letters[d.pr.shuffledDefs.findIndex(df=>df.def===it.def)]; pR+=`<tr><td class="pn">${i+16}.</td><td class="pa">${i+16}→${l}</td></tr>`; });
  pR+=`</table></div>`;
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
const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación Multiplicación Vertical · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:12pt;color:#111;background:#fff;padding:4mm 6mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.5rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;color:#1565c0;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:#1565c0;margin-top:0.15rem;font-weight:700;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.5rem 0 0.25rem;border-left:4px solid #1565c0;background:#e3f2fd;display:flex;justify-content:space-between;align-items:center;color:#1565c0;}.qn{font-weight:700;min-width:22px;flex-shrink:0;color:#1565c0;}.tf-row{display:flex;align-items:flex-start;gap:0.3rem;font-size:10.5pt;line-height:1.4;padding:0.25rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:42px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.2rem;margin-top:0.2rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.28rem 0.45rem;margin-bottom:0.22rem;break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.4;display:flex;gap:0.3rem;margin-bottom:0.18rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.22rem 0.55rem;}.mc-opts{display:grid;grid-template-columns:repeat(3,1fr);gap:0.08rem 0.25rem;margin-left:1.3rem;}.mc-opt{font-size:9.5pt;display:flex;align-items:center;gap:0.22rem;}.mc-opt input{width:12px;height:12px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.4;padding:0.22rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:130px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{break-inside:avoid;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.2rem 0.5rem;margin-top:0.15rem;}.pr-head{font-size:9pt;font-weight:700;color:#1565c0;margin-bottom:0.2rem;}.pr-item{font-size:10pt;padding:0.22rem 0.32rem;background:#e3f2fd;border-radius:3px;margin-bottom:0.12rem;display:flex;align-items:center;gap:0.22rem;line-height:1.2;}.pr-num{font-weight:700;color:#1565c0;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #1565c0;padding-bottom:0.35rem;margin-bottom:0.5rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;color:#1565c0;}.p-sub{font-size:9pt;color:#1565c0;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #cce0ff;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;color:#1565c0;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#1565c0;}.pa{color:#007a00;font-weight:700;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:#1565c0;font-weight:700;font-style:italic;}.obt-lbl{font-weight:700;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #1565c0;height:12px;}.obt-pct{font-weight:700;}.total-row{display:flex;align-items:baseline;justify-content:flex-end;gap:7px;font-size:11pt;color:#1565c0;font-weight:700;font-style:italic;margin-top:0.4rem;padding:0.2rem 0.5rem;background:#e3f2fd;border-radius:4px;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #1565c0;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · Misión Multiplicación Vertical · Matemática</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 4 secciones × 5 preguntas × 5 pts c/u · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✔ PAUTA DOCENTE — Evaluación Final · Multiplicación Vertical · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">100 pts | 4 secciones × 5 preguntas × 5 pts | Matemáticas · Educación Básica</div></div><div class="p-grid">${pR}</div>
  ${zgBlock}</div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("evalPage",252,0.55,1.45);fit("pautaPage",252,0.55,1.3);})();<\/script></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(doc); win.document.close(); setTimeout(()=>win.print(),400);
}

// ===================== EXPLICA =====================
const explicaData = [
  {
    q: 'Explica por qué 24 × 3 = 72 usando el método vertical paso a paso.',
    hint: '💡 Pista: empieza por las unidades y cuida el acarreo.',
    rubric: ['✓ 3 × 4 = 12 → escribe 2 y lleva 1', '✓ 3 × 2 = 6, más el 1 que llevó = 7', '✓ El producto es 72'],
    suggested: 'Multiplico las unidades: 3 × 4 = 12, escribo 2 y llevo 1. Luego las decenas: 3 × 2 = 6, más el 1 que llevé = 7. El producto es 72.'
  },
  {
    q: 'Explica qué es el acarreo y da un ejemplo donde se use.',
    hint: '💡 Pista: piensa en un producto mayor que 9.',
    rubric: ['✓ El acarreo es la cifra que se lleva a la siguiente columna', '✓ Aparece cuando el producto pasa de 9', '✓ Da un ejemplo correcto (p. ej. 6 × 8 = 48 → llevo 4)'],
    suggested: 'El acarreo es la cifra que "me llevo" a la siguiente columna cuando un producto es mayor que 9. Por ejemplo, 6 × 8 = 48: escribo 8 y llevo 4, que sumo al siguiente producto.'
  },
  {
    q: '¿Por qué el segundo producto parcial se corre un lugar a la izquierda? Explícalo con 23 × 14.',
    hint: '💡 Pista: piensa en el valor de las decenas.',
    rubric: ['✓ El segundo parcial multiplica decenas (el 1 vale 10)', '✓ Por eso vale diez veces más y se corre un lugar', '✓ 92 + 230 = 322'],
    suggested: 'En 23 × 14, el 1 del 14 son decenas (vale 10). Así que 23 × 10 = 230, que se corre un lugar a la izquierda. Sumado al primer parcial 92 da 322.'
  },
  {
    q: 'Explica por qué multiplicar por 0 da 0 y por 1 da el mismo número.',
    hint: '💡 Pista: multiplicar es repetir un número varias veces.',
    rubric: ['✓ Por 0 significa "cero veces": no hay nada, da 0', '✓ Por 1 significa "una vez": queda el mismo número', '✓ Da un ejemplo de cada caso'],
    suggested: 'Multiplicar por 0 es tomar el número cero veces, así que no queda nada: 58 × 0 = 0. Multiplicar por 1 es tomarlo una sola vez, así que queda igual: 58 × 1 = 58.'
  },
  {
    q: 'Explica cómo multiplicar rápido por 10 y por 100, con ejemplos.',
    hint: '💡 Pista: cuenta cuántos ceros agregas.',
    rubric: ['✓ Por 10 se agrega un cero a la derecha', '✓ Por 100 se agregan dos ceros', '✓ Da ejemplos correctos'],
    suggested: 'Para multiplicar por 10 agrego un cero a la derecha: 45 × 10 = 450. Para multiplicar por 100 agrego dos ceros: 45 × 100 = 4,500.'
  }
];
let explicaIdx = 0;
function buildExplica() { showExplicaItem(0); }
function showExplicaItem(idx) {
  explicaIdx = idx;
  const container = document.getElementById('explicaContainer');
  if (!container) return;
  const item = explicaData[idx];
  container.innerHTML = `
    <div class="explica-prog">Pregunta ${idx + 1} de ${explicaData.length}</div>
    <div class="explica-q">${item.q}</div>
    <p class="explica-hint">${item.hint}</p>
    <div class="explica-lines">
      <div class="explica-line"></div><div class="explica-line"></div><div class="explica-line"></div>
    </div>
    <div class="explica-rubric" id="explicaRubric" style="display:none;">
      <h4>📋 Criterios de evaluación (pauta):</h4>
      ${item.rubric.map(r => `<label class="rubric-item"><input type="checkbox"> ${r}</label>`).join('')}
      <div class="explica-suggested"><strong>💬 Respuesta sugerida:</strong><br>${item.suggested}</div>
    </div>
    <div style="display:flex;gap:0.6rem;flex-wrap:wrap;margin-top:0.8rem;">
      <button class="btn btn-amber" onclick="toggleExplicaRubric()">📋 Ver pauta</button>
      ${idx > 0 ? `<button class="btn btn-d" onclick="prevExplica()">◀ Anterior</button>` : ''}
      <button class="btn btn-g" onclick="nextExplica()">${idx < explicaData.length - 1 ? '▶ Siguiente' : '🎓 Finalizar'}</button>
    </div>`;
}
function toggleExplicaRubric() {
  const r = document.getElementById('explicaRubric'); if (!r) return;
  const showing = r.style.display !== 'none';
  r.style.display = showing ? 'none' : 'block';
  sfx('click');
  if (!showing && !xpTracker.explica.has(explicaIdx)) { xpTracker.explica.add(explicaIdx); pts(2); }
}
function nextExplica() {
  sfx('click');
  if (explicaIdx < explicaData.length - 1) { showExplicaItem(explicaIdx + 1); }
  else { fin('s-explica'); sfx('fan'); showToast('🎉 ¡Sección Explica completada! +10 XP total'); }
}
function prevExplica() { sfx('click'); if (explicaIdx > 0) showExplicaItem(explicaIdx - 1); }

// ===================== PRUEBA OPERATIVA =====================
function setEvalFeedback(id, ok, msg) {
  const el = document.getElementById(id); if (!el) return;
  el.textContent = msg; el.className = 'eval-item-feedback ' + (ok ? 'eval-ok' : 'eval-no');
}
function evalSwitchMode(mode) {
  sfx('click');
  const cWrap = document.getElementById('evalConceptWrap'), oWrap = document.getElementById('evalOpWrap');
  const cBtn = document.getElementById('evalModeBtnConcept'), oBtn = document.getElementById('evalModeBtnOp');
  if (mode === 'op') {
    cWrap.style.display = 'none'; oWrap.style.display = 'block';
    cBtn.classList.remove('active'); cBtn.setAttribute('aria-selected', 'false');
    oBtn.classList.add('active'); oBtn.setAttribute('aria-selected', 'true');
  } else {
    oWrap.style.display = 'none'; cWrap.style.display = 'block';
    oBtn.classList.remove('active'); oBtn.setAttribute('aria-selected', 'false');
    cBtn.classList.add('active'); cBtn.setAttribute('aria-selected', 'true');
  }
}
let _opRnd = Math.random;
function _opRint(min, max) { return Math.floor(_opRnd() * (max - min + 1)) + min; }
function _fmtNum(n) { return n.toLocaleString('en-US'); }
function _isIntMatch(student, expectedNum) {
  const raw = (student || '').toString().trim().replace(/[,\s]/g, '');
  if (!raw) return false;
  const n = parseInt(raw, 10);
  return !isNaN(n) && n === expectedNum;
}
// I. Multiplica en vertical (5 × 8 = 40 pts) — progresión básico → desafío, siempre con acarreo (Bloques 2 y 4)
function genMultItems() {
  const items = [];
  for (let k = 0; k < 2; k++) { // básico: 2 cifras × 1 cifra CON acarreo (tipo 37 × 4)
    let a, b; do { a = _opRint(24, 89); b = _opRint(3, 9); } while ((a % 10) * b < 10);
    items.push({ text: `${a} × ${b} =`, ansNum: a * b });
  }
  { // intermedio: 3 cifras × 1 cifra CON acarreo
    let a, b; do { a = _opRint(124, 489); b = _opRint(3, 9); } while ((a % 10) * b < 10);
    items.push({ text: `${a} × ${b} =`, ansNum: a * b });
  }
  for (let k = 0; k < 2; k++) { // desafío: 2 cifras × 2 cifras con productos parciales (tipo 23 × 14)
    const a = _opRint(13, 49), b = _opRint(12, 29);
    items.push({ text: `${a} × ${b} =`, ansNum: a * b });
  }
  return items;
}
// II. ¿Qué escribo y qué llevo? (5 × 2 = 10 pts) — réplica del Lab 2 "Detective del Acarreo" y el widget "¿Cuánto se lleva?" (Bloque 3)
function genLlevaItems() {
  const items = []; const seen = {};
  while (items.length < 5) {
    const a = _opRint(3, 9), b = _opRint(4, 9); const key = a + 'x' + b;
    if (a * b < 10 || seen[key]) continue; seen[key] = 1;
    const p = a * b;
    items.push({ text: `${a} × ${b} = ${p}`, esc: p % 10, lleva: Math.floor(p / 10) });
  }
  return items;
}
// III. Casos especiales y factor escondido (5 × 2 = 10 pts) — atajos ×0/×1/×10/×100 (Bloque 5) + razonamiento inverso ▢
function genCasosItems() {
  const items = [];
  const a0 = _opRint(23, 98); items.push({ expr: `${a0} × 0 =`, ansNum: 0 });
  const a1 = _opRint(23, 98); items.push({ expr: `${a1} × 1 =`, ansNum: a1 });
  const a2 = _opRint(12, 79); const pow = _opRnd() < 0.5 ? 10 : 100; items.push({ expr: `${a2} × ${pow} =`, ansNum: a2 * pow });
  const x1 = _opRint(3, 12), f1 = _opRint(3, 9); items.push({ expr: `▢ × ${f1} = ${x1 * f1}`, ansNum: x1 });
  const x2 = _opRint(12, 40); items.push({ expr: `▢ × 10 = ${x2 * 10}`, ansNum: x2 });
  return _shuffleF(items, _opRnd);
}
// IV. Problemas de la vida real (3 × 10 = 30 pts) — contexto hondureño (lempiras, mangos, pupusas, sillas del aula)
function genProblemaItems() {
  const items = [];
  const tipos = _pickF([0, 1, 2, 3, 4], 3, _opRnd);
  const NAMES = ['Ana', 'Luis', 'Marta', 'José', 'Carmen', 'Pedro'];
  tipos.forEach(tp => {
    const n = NAMES[_opRint(0, NAMES.length - 1)];
    let text, ansNum;
    if (tp === 0) { const a = _opRint(12, 25), b = _opRint(4, 9); text = `En el mercado, cada pupusa cuesta ${a} lempiras. ¿Cuántos lempiras cuestan ${b} pupusas?`; ansNum = a * b; }
    else if (tp === 1) { const a = _opRint(14, 28), b = _opRint(4, 9); text = `${n} vende mangos en cajas de ${a} mangos cada una. ¿Cuántos mangos hay en ${b} cajas?`; ansNum = a * b; }
    else if (tp === 2) { const a = _opRint(12, 19), b = _opRint(4, 8); text = `El aula de ${n} tiene ${b} filas con ${a} sillas cada una. ¿Cuántas sillas hay en total?`; ansNum = a * b; }
    else if (tp === 3) { const a = _opRint(15, 30), b = _opRint(5, 9); text = `El pasaje del bus cuesta ${a} lempiras. ¿Cuántos lempiras pagan ${b} estudiantes en total?`; ansNum = a * b; }
    else { const a = _opRint(15, 40), b = _opRint(4, 9); text = `${n} ahorra ${a} lempiras cada semana. ¿Cuántos lempiras ahorra en ${b} semanas?`; ansNum = a * b; }
    items.push({ text, ansNum });
  });
  return items;
}
// V. Retos de pensamiento (2 × 5 = 10 pts) — detective del error (Errores 2 y 3) + predicción de la cifra final (Predice)
function genRetoItems() {
  const items = [];
  if (_opRnd() < 0.5) { // Error 2: olvidar el acarreo
    let a, b; do { a = _opRint(24, 79); b = _opRint(4, 9); } while ((a % 10) * b < 10);
    const u = (a % 10) * b, lleva = Math.floor(u / 10);
    const mal = Math.floor(a / 10) * b * 10 + (u % 10);
    items.push({ text: `🕵️ Detective del error: al resolver ${a} × ${b}, un estudiante hizo ${a % 10} × ${b} = ${u}, escribió el ${u % 10} pero OLVIDÓ llevar el ${lleva} (Error 2) y obtuvo ${_fmtNum(mal)}. Escribe el producto correcto.`, ansNum: a * b });
  } else { // Error 3: no desplazar el segundo parcial
    const a = _opRint(13, 39), b = _opRint(12, 29); const u = b % 10, dec = Math.floor(b / 10);
    const p1 = a * u, p2 = a * dec; const mal = p1 + p2;
    items.push({ text: `🕵️ Detective del error: para ${a} × ${b}, un estudiante sumó los parciales ${_fmtNum(p1)} + ${_fmtNum(p2)} SIN correr el segundo un lugar a la izquierda (Error 3) y obtuvo ${_fmtNum(mal)}. Escribe el producto correcto.`, ansNum: a * b });
  }
  const a = _opRint(23, 98), b = _opRint(3, 9);
  items.push({ text: `🔮 Sin resolver toda la operación: ¿en qué cifra termina ${a} × ${b}? (Pista: mira solo las unidades, ${a % 10} × ${b}.)`, ansNum: (a * b) % 10 });
  return items;
}
function genEvalOp() {
  sfx('click');
  _injectFormaSel('genEvalOp', 'evalOpFormaSel', evalOpFormNum, function (v) { evalOpFormNum = v; });
  const _sO = document.getElementById('evalOpFormaSel');
  if (_sO && parseInt(_sO.value, 10)) evalOpFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sO.value, 10)));
  const cf = evalOpFormNum; window._currentEvalOpForm = cf; _opRnd = _evalRng(100000 + cf); evalOpFormNum = (evalOpFormNum % EVAL_FORMAS) + 1; _injectFormaSel('genEvalOp', 'evalOpFormaSel', evalOpFormNum, function (v) { evalOpFormNum = v; }); saveProgress();
  document.getElementById('evalop-screen-title').textContent = `📐 Prueba Operativa — Forma ${cf} · Multiplicación Vertical`;
  evalOpAnsVisible = false;
  const out = document.getElementById('evalOpOut'); out.innerHTML = '';

  const mItems = genMultItems();
  const s1 = document.createElement('div');
  s1.innerHTML = '<div class="eval-section-title">I. Multiplica en vertical <span class="eval-pts">40 pts · 8 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Alinea por posición, multiplica desde las unidades y lleva el acarreo. Progresión: 1-2 básico · 3 intermedio · 4-5 desafío (× 2 cifras con productos parciales).</p>';
  mItems.forEach((it, i) => { const d = document.createElement('div'); d.className = 'eval-item eval-auto-item'; d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.text}</span><input class="eval-cp-input" type="text" data-mu="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${_fmtNum(it.ansNum)}</div><div class="eval-item-feedback" id="evalFbMu${i}" aria-live="polite"></div>`; s1.appendChild(d); });
  out.appendChild(s1);

  const llItems = genLlevaItems();
  const s2 = document.createElement('div');
  s2.innerHTML = '<div class="eval-section-title">II. ¿Qué escribo y qué llevo? <span class="eval-pts">10 pts · 2 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Como en el Detective del Acarreo: del producto de la columna, la cifra de las unidades se escribe y la de las decenas se lleva.</p>';
  llItems.forEach((it, i) => { const d = document.createElement('div'); d.className = 'eval-item eval-auto-item'; d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.text} →</span> escribo <input class="eval-cp-input" type="text" data-lle="${i}" autocomplete="off" inputmode="numeric" style="max-width:52px;"> llevo <input class="eval-cp-input" type="text" data-llc="${i}" autocomplete="off" inputmode="numeric" style="max-width:52px;"></div><div class="eval-answer">escribo ${it.esc} · llevo ${it.lleva}</div><div class="eval-item-feedback" id="evalFbLl${i}" aria-live="polite"></div>`; s2.appendChild(d); });
  out.appendChild(s2);

  const ceItems = genCasosItems();
  const s3 = document.createElement('div');
  s3.innerHTML = '<div class="eval-section-title">III. Casos especiales y factor escondido <span class="eval-pts">10 pts · 2 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Aplica los atajos del ×0, ×1 y ×10/×100, y usa la división como operación inversa para hallar ▢.</p>';
  ceItems.forEach((it, i) => { const d = document.createElement('div'); d.className = 'eval-item eval-auto-item'; d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.expr}</span><input class="eval-cp-input" type="text" data-ce="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${_fmtNum(it.ansNum)}</div><div class="eval-item-feedback" id="evalFbCe${i}" aria-live="polite"></div>`; s3.appendChild(d); });
  out.appendChild(s3);

  const prItems = genProblemaItems();
  const s4 = document.createElement('div');
  s4.innerHTML = '<div class="eval-section-title">IV. Problemas de la vida real <span class="eval-pts">30 pts · 10 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Decide qué se multiplica, resuelve en vertical en tu cuaderno y escribe la respuesta.</p>';
  prItems.forEach((it, i) => { const d = document.createElement('div'); d.className = 'eval-item eval-auto-item'; d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.text}</span><input class="eval-cp-input" type="text" data-pr="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${_fmtNum(it.ansNum)}</div><div class="eval-item-feedback" id="evalFbPr${i}" aria-live="polite"></div>`; s4.appendChild(d); });
  out.appendChild(s4);

  const reItems = genRetoItems();
  const s5 = document.createElement('div');
  s5.innerHTML = '<div class="eval-section-title">V. Retos de pensamiento <span class="eval-pts">10 pts · 5 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Encuentra el error del estudiante y corrígelo, y predice sin calcular todo.</p>';
  reItems.forEach((it, i) => { const d = document.createElement('div'); d.className = 'eval-item eval-auto-item'; d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.text}</span><input class="eval-cp-input" type="text" data-re="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${_fmtNum(it.ansNum)}</div><div class="eval-item-feedback" id="evalFbRe${i}" aria-live="polite"></div>`; s5.appendChild(d); });
  out.appendChild(s5);

  window._evalOpData = { mItems, llItems, ceItems, prItems, reItems };
  const autoPanel = document.createElement('div'); autoPanel.id = 'evalOpAutoResult'; autoPanel.className = 'eval-auto-result';
  autoPanel.innerHTML = '<strong>🧮 Prueba interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato para resolver en papel.';
  out.appendChild(autoPanel);
  fin('s-evaluacion');
}
function toggleEvalOpAns() {
  evalOpAnsVisible = !evalOpAnsVisible;
  document.querySelectorAll('#evalOpOut .eval-answer').forEach(el => el.style.display = evalOpAnsVisible ? 'block' : 'none');
  sfx('click');
}
function gradeEvalOp() {
  if (!window._evalOpData) { showToast('⚠️ Genera una prueba operativa primero'); return; }
  sfx('click');
  const d = window._evalOpData;
  let total = 0; const det = { mu: 0, ll: 0, ce: 0, pr: 0, re: 0 };
  const _mark = (sel, it, i, key, ptsEach, fbId) => {
    const el = document.querySelector(`[data-${sel}="${i}"]`);
    const ok = _isIntMatch(el ? el.value : '', it.ansNum);
    if (el) { el.classList.toggle('eval-input-ok', ok); el.classList.toggle('eval-input-no', !ok); }
    if (ok) { det[key]++; total += ptsEach; }
    setEvalFeedback(fbId + i, ok, ok ? `Correcto. +${ptsEach} pts` : 'Revisar. R/ ' + _fmtNum(it.ansNum));
  };
  d.mItems.forEach((it, i) => _mark('mu', it, i, 'mu', 8, 'evalFbMu'));
  d.llItems.forEach((it, i) => {
    const elE = document.querySelector(`[data-lle="${i}"]`), elC = document.querySelector(`[data-llc="${i}"]`);
    const okE = _isIntMatch(elE ? elE.value : '', it.esc), okC = _isIntMatch(elC ? elC.value : '', it.lleva);
    if (elE) { elE.classList.toggle('eval-input-ok', okE); elE.classList.toggle('eval-input-no', !okE); }
    if (elC) { elC.classList.toggle('eval-input-ok', okC); elC.classList.toggle('eval-input-no', !okC); }
    const ok = okE && okC;
    if (ok) { det.ll++; total += 2; }
    setEvalFeedback('evalFbLl' + i, ok, ok ? 'Correcto. +2 pts' : `Revisar. R/ escribo ${it.esc} · llevo ${it.lleva}`);
  });
  d.ceItems.forEach((it, i) => _mark('ce', it, i, 'ce', 2, 'evalFbCe'));
  d.prItems.forEach((it, i) => _mark('pr', it, i, 'pr', 10, 'evalFbPr'));
  d.reItems.forEach((it, i) => _mark('re', it, i, 're', 5, 'evalFbRe'));
  const res = document.getElementById('evalOpAutoResult');
  if (res) { res.className = 'eval-auto-result ' + (total >= 70 ? 'eval-auto-pass' : 'eval-auto-risk'); res.innerHTML = `<strong>Resultado: ${total}/100 pts</strong><br><span>Multiplica: ${det.mu*8}/40 · Acarreo: ${det.ll*2}/10 · Casos: ${det.ce*2}/10 · Problemas: ${det.pr*10}/30 · Retos: ${det.re*5}/10</span>`; }
  if (total >= 70) { pts(8); showToast('🎯 Prueba operativa calificada: ' + total + '/100'); }
  else showToast('🧮 Prueba operativa: ' + total + '/100. Revisa los ítems marcados.');
}
function printEvalOp() {
  if (!window._evalOpData) { showToast('⚠️ Genera una prueba operativa primero'); return; }
  sfx('click');
  const forma = window._currentEvalOpForm || 1; const d = window._evalOpData;
  let s1 = `<div class="sec-title"><span>I. Multiplica en vertical</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 40 pts</span></div></div><p class="opx-instr">Resuelve con el método vertical: alinea, multiplica desde las unidades y lleva el acarreo. Progresión: 1-2 básico · 3 intermedio · 4-5 desafío (× 2 cifras). 8 pts c/u.</p>`;
  d.mItems.forEach((it, i) => { s1 += `<div class="opx-print-row"><span class="qn">${i+1}.</span><span class="prb-text">${it.text}</span><span class="opx-blank"></span></div>`; });
  const llTbl = (items) => `<table class="rnd-tbl"><tr><th>#</th><th>Producto de la columna</th><th>Escribo</th><th>Llevo</th></tr>${items.map((it, i) => `<tr><td>${i+1}</td><td>${it.text}</td><td></td><td></td></tr>`).join('')}</table>`;
  let s2 = `<div class="sec-title"><span>II. ¿Qué escribo y qué llevo?</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10 pts</span></div></div><p class="opx-instr">Del producto de cada columna, la cifra de las unidades se escribe y la de las decenas se lleva. 2 pts c/u.</p>${llTbl(d.llItems)}`;
  const ceTbl = (items) => `<table class="rnd-tbl"><tr><th>#</th><th>Operación</th><th>Respuesta</th></tr>${items.map((it, i) => `<tr><td>${i+1}</td><td>${it.expr}</td><td></td></tr>`).join('')}</table>`;
  let s3 = `<div class="sec-title"><span>III. Casos especiales y factor escondido</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10 pts</span></div></div><p class="opx-instr">Aplica los atajos del ×0, ×1 y ×10/×100, y usa la división para hallar ▢. 2 pts c/u.</p>${ceTbl(d.ceItems)}`;
  let s4 = `<div class="sec-title"><span>IV. Problemas de la vida real</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 30 pts</span></div></div><p class="opx-instr">Decide qué se multiplica, resuelve en vertical y escribe la respuesta. 10 pts c/u.</p>`;
  d.prItems.forEach((it, i) => { s4 += `<div class="opx-print-row"><span class="qn">${i+1}.</span><span class="prb-text">${it.text}</span><span class="opx-blank"></span></div>`; });
  let s5 = `<div class="sec-title"><span>V. Retos de pensamiento</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10 pts</span></div></div><p class="opx-instr">Encuentra el error y corrígelo; predice sin calcular todo. 5 pts c/u.</p>`;
  d.reItems.forEach((it, i) => { s5 += `<div class="opx-print-row"><span class="qn">${i+1}.</span><span class="prb-text">${it.text}</span><span class="opx-blank"></span></div>`; });
  let pR = '';
  pR += `<div class="p-sec"><div class="p-ttl">I. Multiplica en vertical</div><table class="p-tbl">${d.mItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${_fmtNum(it.ansNum)}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">II. ¿Qué escribo y qué llevo?</div><table class="p-tbl">${d.llItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">escribo ${it.esc} · llevo ${it.lleva}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">III. Casos especiales y factor escondido</div><table class="p-tbl">${d.ceItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${_fmtNum(it.ansNum)}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">IV. Problemas de la vida real</div><table class="p-tbl">${d.prItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${_fmtNum(it.ansNum)}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec" style="grid-column:1/-1;"><div class="p-ttl">V. Retos de pensamiento</div><table class="p-tbl">${d.reItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${_fmtNum(it.ansNum)}</td></tr>`).join('')}</table></div>`;
  const doc = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Prueba Operativa Multiplicación Vertical · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11.5pt;color:#111;background:#fff;padding:4mm 6mm;}.ph{margin-bottom:0.5rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;color:#1565c0;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:#1565c0;margin-top:0.15rem;font-weight:700;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.45rem 0 0.2rem;border-left:4px solid #1565c0;background:#e3f2fd;display:flex;justify-content:space-between;align-items:center;color:#1565c0;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:#1565c0;font-weight:700;font-style:italic;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #1565c0;height:12px;}.qn{font-weight:700;min-width:20px;display:inline-block;color:#1565c0;flex-shrink:0;}.opx-instr{font-size:9pt;color:#555;margin-bottom:0.22rem;}.opx-blank{display:inline-block;width:80px;flex:none;border-bottom:1.5px solid #111;min-height:13px;margin-left:0.3rem;}.opx-print-row{display:flex;align-items:baseline;gap:0.4rem;font-size:10pt;padding:0.24rem 0.1rem;border-bottom:1px dotted #ddd;}.prb-text{flex:1;line-height:1.35;}.rnd-tbl{width:100%;border-collapse:collapse;font-size:9.5pt;margin-top:0.15rem;}.rnd-tbl th,.rnd-tbl td{border:1px solid #bbb;padding:0.16rem 0.35rem;text-align:left;}.rnd-tbl th{background:#e3f2fd;color:#1565c0;font-size:8.5pt;}.total-row{display:flex;align-items:baseline;justify-content:flex-end;gap:7px;font-size:11pt;color:#1565c0;font-weight:700;font-style:italic;margin-top:0.45rem;padding:0.2rem 0.5rem;background:#e3f2fd;border-radius:4px;}.total-row .obt-line{min-width:80px;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #1565c0;padding-bottom:0.3rem;margin-bottom:0.5rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;color:#1565c0;}.p-sub{font-size:9pt;color:#1565c0;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #cce0ff;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;color:#1565c0;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#1565c0;}.pa{color:#007a00;font-weight:700;font-family:'Courier New',monospace;}.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:8mm 10mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Examen de Matemáticas — Prueba Operativa · Multiplicación Vertical · Educación Básica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 pts · I: 40 · II: 10 · III: 10 · IV: 30 · V: 10 · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✔ PAUTA — Prueba Operativa · Multiplicación Vertical · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">100 pts · Matemáticas · Educación Básica</div></div><div class="p-grid">${pR}</div></div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("evalPage",250,0.55,1.2);fit("pautaPage",250,0.55,1.2);})();</script></body></html>`;
  const win = window.open('', '_blank', '');
  if (!win) { showToast('⚠️ Activa las ventanas emergentes para imprimir'); return; }
  win.document.write(doc); win.document.close(); setTimeout(() => win.print(), 400);
}

// ===================== DIPLOMA =====================
function _diplPct() { return xp >= MXP ? 100 : Math.round((xp / MXP) * 100); }
function openDiploma(){
  sfx('click');
  const pct = _diplPct();
  document.getElementById('diplPct').textContent=pct+'%';
  document.getElementById('diplPct').style.color=pct>=70?'var(--jade)':pct>=40?'var(--blue)':'var(--amber)';
  document.getElementById('diplBar').style.width=pct+'%';
  const stars=pct===100?'⭐⭐⭐⭐⭐':pct>=80?'⭐⭐⭐⭐':pct>=60?'⭐⭐⭐':pct>=40?'⭐⭐':'⭐';
  document.getElementById('diplStars').textContent=stars;
  const msgs=['💡 ¡ÁNIMO! Comienza tu misión. ¡Cada paso cuenta!','🌱 ¡GRAN INICIO! Estás dando los primeros pasos.','🔑 ¡BUEN TRABAJO! Vas progresando muy bien.','💪 ¡MUY BIEN! Dominas gran parte del contenido.','🏅 ¡INCREÍBLE avance! Estás cerca de la excelencia.','🎓 ¡EXTRAORDINARIO! Completaste TODA la misión. ¡Eres experto en Multiplicación Vertical!'];
  const mi=pct===100?5:pct>=80?4:pct>=60?3:pct>=40?2:pct>=20?1:0;
  document.getElementById('diplMsg').textContent=msgs[mi];
  document.getElementById('diplDate').textContent='Honduras, '+new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});
  const achStr=unlockedAch.length>0?'🏆 Logros: '+unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(', '):'Sin logros aún — ¡sigue completando secciones!';
  document.getElementById('diplAch').textContent=achStr;
  document.getElementById('diplomaOverlay').classList.add('open');
  document.querySelector('.diploma-input').focus();
}
function closeDiploma(){ document.getElementById('diplomaOverlay').classList.remove('open'); }
function updateDiplomaName(v){ document.getElementById('diplName').textContent=v||'Estudiante'; }
function shareWA(){
  const pct = _diplPct(); const name=document.getElementById('diplName').textContent;
  const stars=document.getElementById('diplStars').textContent;
  const msg=document.getElementById('diplMsg').textContent;
  const date=document.getElementById('diplDate').textContent;
  const achText=unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join('\n');
  const txt=`${stars} CONSTANCIA DE LOGRO ${stars}\n\n📚 Misión: Multiplicación Vertical\n👤 Estudiante: ${name}\n📊 Progreso: ${pct}% completado\n⭐ XP obtenido: ${xp} de ${MXP}${achText?'\n\n🏆 Logros desbloqueados:\n'+achText:''}\n\n${msg}\n\n📅 ${date}\n🏠 Proyecto Educativo M.E.T.A.S\n🌐 policastsapien.com`;
  _waShare(txt);
}
async function captureDiploma() {
    if (typeof html2canvas === 'undefined') { showToast('⚠️ Cargando... intenta de nuevo'); return; }
    sfx('click');
    const card = document.querySelector('.diploma-card');
    const btn = document.querySelector('.diploma-actions .btn-pri');
    const toHide = [card.querySelector('.diploma-input'), card.querySelector('.diploma-actions'), card.querySelector('hr')];
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Capturando...'; }
    toHide.forEach(el => { if (el) el.style.display = 'none'; });
    let dataUrl = '';
    try {
        const canvas = await html2canvas(card, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
        toHide.forEach(el => { if (el) el.style.display = ''; });
        dataUrl = canvas.toDataURL('image/png');
        const name = (document.getElementById('diplName').textContent || 'Estudiante').replace(/\s+/g, '-');
        const fileName = 'constancia-' + name + '.png';
        const cap = window.Capacitor;
        if (cap && cap.isNativePlatform && cap.isNativePlatform() && cap.Plugins?.Filesystem && cap.Plugins?.Share) {
            const base64Data = dataUrl.split(',')[1];
            const result = await cap.Plugins.Filesystem.writeFile({ path: fileName, data: base64Data, directory: 'CACHE' });
            await cap.Plugins.Share.share({ url: result.uri, dialogTitle: 'Guardar / Compartir Constancia' });
        } else {
            const a = document.createElement('a');
            a.href = dataUrl; a.download = fileName; a.click();
        }
    } catch (e) {
        toHide.forEach(el => { if (el) el.style.display = ''; });
        if (e.name !== 'AbortError') showToast('⚠️ No se pudo guardar la constancia');
    } finally {
        if (btn) { btn.disabled = false; btn.textContent = '📷 Guardar foto'; }
    }
}
// ===================== INIT =====================
document.addEventListener('DOMContentLoaded',()=>{
  initTheme();
  loadProgress();
  upFC(); buildQz(); buildClass(); showId(); showCmp(); buildSopa(); genEval(); genEvalOp();
  buildPredice();
  buildMemo();
  buildExplica();
  buildLabProductos(); buildLabAcarreo();
  buildTablas(); buildParcial(); buildAcarreoW();
  _retoPairLbl();
  document.addEventListener('click',function(e){ const panel=document.getElementById('achPanel'); const btn=document.getElementById('achBtn'); if(panel.classList.contains('open')&&!panel.contains(e.target)&&e.target!==btn) panel.classList.remove('open'); });
  document.addEventListener('click',function(e){ if(e.target===document.getElementById('diplomaOverlay')) closeDiploma(); });
  const savedName=localStorage.getItem('nombreEstudianteMultiplicacion');
  const inputName=document.querySelector('.diploma-input');
  if(savedName&&inputName){ inputName.value=savedName; updateDiplomaName(savedName); }
  if(inputName) inputName.addEventListener('input',e=>localStorage.setItem('nombreEstudianteMultiplicacion',e.target.value));
  fin('s-aprende',false);
  fin('s-tipos',false);
  fin('s-errores',false);
});
(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalOp==='function') _injectFormaSel('genEvalOp','evalOpFormaSel',evalOpFormNum,function(v){evalOpFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();
