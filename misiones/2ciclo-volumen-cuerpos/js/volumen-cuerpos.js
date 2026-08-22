// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
// Compartir misión por WhatsApp
function compartirMision() {
    const url = window.location.href;
    const texto = `🚀 *Misión Asignada: Volumen de Cuerpos* 🚀\n\nCalcula el volumen de cubos, prismas y cilindros, y descubre cuántos litros caben en un tanque. 🏆\n\nDesbloquea *todos los logros* y puedes poner *tus datos* para que tu maestro observe todos tus logros. 📋\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;
    _waShare(texto);
}

// ===================== ACCESIBILIDAD =====================
function toggleLetra() {
  document.body.classList.toggle('letra-grande');
  if(typeof sfx === 'function') sfx('click');
  localStorage.setItem('prefLetraVolumen', document.body.classList.contains('letra-grande'));
}
window.addEventListener('DOMContentLoaded', () => {
  if(localStorage.getItem('prefLetraVolumen') === 'true') document.body.classList.add('letra-grande');
});

// ===================== UTILIDADES =====================
const _pick = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
const _shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
function fb(id, msg, isOk) {
  const el = document.getElementById(id);
  if(el) { el.textContent = msg; el.className = 'fb show ' + (isOk ? 'ok' : 'err'); }
}
// El π de sexto grado
/* π con dos decimales, que es el que se usa en 6.º grado y el que trae
   el libro: si la pantalla calcula con el π largo y el alumno con 3.14,
   los resultados no coinciden y él cree que se equivocó. */
const PI = 3.14;
function _volCubo(a){ return a*a*a; }
function _volPrisma(l,an,al){ return l*an*al; }
function _volCilindro(r,h){ return Math.round(PI*r*r*h*100)/100; }
function _volFmt(x){ const r=Math.round(x*100)/100; return String(r); }
/* Al alumno se le acepta el número con o sin ceros de adorno. */
function _volAcc(x){ const r=Math.round(x*100)/100; const a=[String(r)]; if(Number.isInteger(r)) a.push(r+'.0', r+'.00'); return [...new Set(a)]; }

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY = 'matematica_volumen_cuerpos_v1';
let xp = 0, MXP = 200, done = new Set(), evalAnsVisible = false;
let evalFormNum = 1, evalOpFormNum = 1, evalOpAnsVisible = false, unlockedAch = [], darkMode = false, prevLevel = 0;
const TOTAL_SECTIONS = 16;
const xpTracker = { fc: new Set(), qz: new Set(), cls: new Set(), id: new Set(), cmp: new Set(), reto: new Set(), sopa: new Set(), predice: new Set(), explica: new Set(), memo: new Set() };

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
  clasif_pro:{icon:'🧊',label:'Clasificador experto'},
  id_master:{icon:'🔍',label:'Identificador maestro'},
  reto_hero:{icon:'🏆',label:'Héroe del reto final'},
  nivel3:{icon:'📏',label:'¡Medidor alcanzado! Nivel 3'},
  nivel5:{icon:'🔥',label:'¡Campeón alcanzado! Nivel 6'}
};
function unlockAchievement(id){ if(unlockedAch.includes(id)) return; unlockedAch.push(id); sfx('ach'); showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label); launchConfetti(); renderAchPanel(); saveProgress(); }
function renderAchPanel(){ const list=document.getElementById('achList'); list.innerHTML=''; Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{ const div=document.createElement('div'); div.className='ach-item'+(unlockedAch.includes(id)?'':' locked'); div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`; list.appendChild(div); }); }
function toggleAchPanel(){ sfx('click'); document.getElementById('achPanel').classList.toggle('open'); }
function showToast(msg){ let t=document.querySelector('.toast'); if(!t){ t=document.createElement('div'); t.className='toast'; document.body.appendChild(t); } t.textContent=msg; t.style.display='block'; clearTimeout(t._tid); t._tid=setTimeout(()=>t.style.display='none',3200); }
function launchConfetti(){ const colors=['#1565c0','#00838f','#00b894','#fdcb6e','#6c5ce7']; for(let i=0;i<60;i++){ const c=document.createElement('div'); c.className='confetti-piece'; c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`; document.body.appendChild(c); c.addEventListener('animationend',()=>c.remove()); } }

// ===================== XP =====================
const lvls=[{t:0,n:'Novato ✏️'},{t:25,n:'Aprendiz 🧊'},{t:55,n:'Medidor 📏'},{t:90,n:'Bodeguero 📦'},{t:130,n:'Experto 🏗️'},{t:165,n:'Campeón 🏅'},{t:190,n:'Maestro 🎓'}];
function pts(n){ xp=Math.max(0,Math.min(MXP,xp+n)); updateXPBar(); saveProgress(); }
function updateXPBar(){ const pct=Math.round((xp/MXP)*100); document.getElementById('xpFill').style.width=pct+'%'; const el=document.getElementById('xpPts'); el.textContent='⭐ '+xp; el.style.transform='scale(1.3)'; setTimeout(()=>el.style.transform='',300); let lv=0; for(let i=0;i<lvls.length;i++) if(xp>=lvls[i].t) lv=i; document.getElementById('xpLvl').textContent=lvls[lv].n; if(lv!==prevLevel){ if(lv>=2) unlockAchievement('nivel3'); if(lv>=5) unlockAchievement('nivel5'); prevLevel=lv; } }
function resetXP(){ sfx('click'); xp=0; updateXPBar(); showToast('🔄 XP reiniciado a 0'); }
function fin(id,showFX=true){ if(!done.has(id)){ done.add(id); const b=document.querySelector(`[data-s="${id}"]`); if(b) b.classList.add('done'); if(showFX){ sfx('up'); launchConfetti(); } saveProgress(); } }

// ===================== NAV =====================
function go(id){ sfx('click'); document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active')); document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{ b.classList.remove('active'); b.setAttribute('aria-selected','false'); }); document.getElementById(id).classList.add('active'); const btn=document.querySelector(`[data-s="${id}"]`); if(btn){ btn.classList.add('active'); btn.setAttribute('aria-selected','true'); } window.scrollTo({top:0,behavior:'smooth'}); if(id==='s-sopa') setTimeout(buildSopa,50); }

// ===================== FLASHCARD DATA =====================
const fcData=[
  {w:'Volumen',a:'📦 el <strong>espacio que ocupa</strong> un cuerpo. El área se mide en la superficie; el volumen, por dentro.'},
  {w:'Unidad de volumen',a:'🧊 el <strong>centímetro cúbico</strong> (cm³) es un cubito de 1 cm por lado. El volumen se cuenta en cubitos.'},
  {w:'Volumen del cubo',a:'🧊 <strong>V = arista × arista × arista</strong> (a³). Si la arista mide 4 cm: 4 × 4 × 4 = 64 cm³.'},
  {w:'Volumen del prisma',a:'📦 <strong>V = largo × ancho × alto</strong>, o dicho de otro modo: área de la base por la altura.'},
  {w:'Volumen del cilindro',a:'🥫 <strong>V = π × radio² × altura</strong>. También es área de la base por altura, pero la base es un círculo.'},
  {w:'Área de la base × altura',a:'🔑 la <strong>misma idea</strong> sirve para el prisma y el cilindro: se calcula la base y se multiplica por lo alto que sea.'},
  {w:'El radio, no el diámetro',a:'⚠️ en la fórmula del cilindro va el <strong>radio</strong>. Si te dan el diámetro, se parte a la mitad primero.'},
  {w:'Metro cúbico (m³)',a:'📏 un cubo de 1 metro por lado. Es lo que se usa para medir arena, tierra o el agua de un tanque.'},
  {w:'De m³ a cm³',a:'🪜 cada escalón multiplica o divide entre <strong>1,000</strong>: 1 m³ = 1,000 dm³ = 1,000,000 cm³. No entre 100.'},
  {w:'Un litro es un dm³',a:'💧 <strong>1 dm³ = 1 litro</strong> exacto. Por eso un tanque de 1 m³ guarda 1,000 litros de agua.'},
  {w:'Área contra volumen',a:'📐 el área se mide en <strong>cm²</strong> (superficie, para pintar) y el volumen en <strong>cm³</strong> (espacio, para llenar).'},
  {w:'Capacidad',a:'🪣 lo que <strong>cabe dentro</strong> de un recipiente. Se mide en litros, y es el mismo espacio que el volumen.'},
  {w:'Las medidas, en la misma unidad',a:'⚠️ antes de multiplicar hay que pasar todo a la <strong>misma unidad</strong>: no se puede multiplicar metros por centímetros.'},
  {w:'Para qué sirve',a:'🏗️ para saber cuánta arena lleva una obra, cuántas cajas caben en un carro o cuántos litros aguanta un tanque.'}
];
let fcIdx=0;
function upFC(){ document.getElementById('fcInner').classList.remove('flipped'); document.getElementById('fcW').textContent=fcData[fcIdx].w; document.getElementById('fcA').innerHTML=fcData[fcIdx].a; document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length; }
function flipCard(){ sfx('flip'); document.getElementById('fcInner').classList.toggle('flipped'); if(!xpTracker.fc.has(fcIdx)){ xpTracker.fc.add(fcIdx); pts(1); } if(xpTracker.fc.size===fcData.length){ fin('s-flash'); unlockAchievement('flash_master'); } }
function nextFC(){ sfx('click'); fcIdx=(fcIdx+1)%fcData.length; upFC(); }
function prevFC(){ sfx('click'); fcIdx=(fcIdx-1+fcData.length)%fcData.length; upFC(); }


// ===================== JUEGO: MEMORIA DE LOS NÚMEROS =====================
const memoPairs=[
  {id:'cubo',t:'Volumen del cubo',d:'🧊 arista × arista × arista'},
  {id:'prisma',t:'Volumen del prisma',d:'📦 largo × ancho × alto'},
  {id:'cilindro',t:'Volumen del cilindro',d:'🥫 π × radio² × altura'},
  {id:'litro',t:'1 dm³',d:'💧 es exactamente 1 litro'},
  {id:'escalon',t:'De m³ a dm³',d:'🪜 se multiplica por 1,000'},
  {id:'unidad',t:'Unidad del volumen',d:'📐 va al cubo: cm³, m³'}
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
  {q:'¿Cuál es el volumen de un cubo de 3 cm de arista?',o:['a) 27 cm³','b) 9 cm³','c) 12 cm³','d) 6 cm³'],c:0},
  {q:'¿Cómo se calcula el volumen de un prisma rectangular?',o:['a) Sumando sus lados','b) Largo por ancho por alto','c) Lado por lado','d) Contando sus caras'],c:1},
  {q:'En la fórmula del cilindro, ¿qué medida del círculo se usa?',o:['a) El diámetro','b) El perímetro','c) El radio','d) La cuerda'],c:2},
  {q:'¿Cuántos litros caben en 1 m³?',o:['a) 10','b) 100','c) 1,000,000','d) 1,000'],c:3},
  {q:'¿En qué unidad se mide el volumen?',o:['a) cm³','b) cm²','c) cm','d) kg'],c:0},
  {q:'Un tanque de 2 m³, ¿cuántos dm³ tiene?',o:['a) 200','b) 2,000','c) 20','d) 2'],c:1},
  {q:'El volumen de un prisma de 5 × 3 × 2 cm es…',o:['a) 10 cm³','b) 15 cm³','c) 30 cm³','d) 60 cm³'],c:2},
  {q:'Si te dan un cilindro de 10 cm de diámetro, el radio es…',o:['a) 20 cm','b) 10 cm','c) 100 cm','d) 5 cm'],c:3},
  {q:'¿Qué se mide en cm² y no en cm³?',o:['a) El área de una pared','b) El agua de un tanque','c) La arena de un camión','d) El espacio de una caja'],c:0},
  {q:'Un dm³ equivale a…',o:['a) 1 mililitro','b) 1 litro','c) 100 litros','d) 1,000 litros'],c:1}
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

// ===================== CLASIFICACIÓN (seleccionar y colocar, sin arrastre) =====================
const classGroups=[
  {
    label:['Área','Volumen'], headA:'📐 Se mide en cm²', headB:'📦 Se mide en cm³',
    colA:'area', colB:'vol',
    words:[{w:'pintar una pared',t:'area'},{w:'llenar un tanque',t:'vol'},{w:'forrar una caja',t:'area'},{w:'la arena de un camión',t:'vol'},
           {w:'el piso de un cuarto',t:'area'},{w:'el aire de una habitación',t:'vol'},{w:'una lámina de zinc',t:'area'},{w:'el agua de una pila',t:'vol'}]
  },
  {
    label:['Cubo o prisma','Cilindro'], headA:'📦 Largo × ancho × alto', headB:'🥫 π × radio² × altura',
    colA:'recto', colB:'cil',
    words:[{w:'caja de zapatos',t:'recto'},{w:'lata de leche',t:'cil'},{w:'dado',t:'recto'},{w:'tarro de café',t:'cil'},
           {w:'ladrillo',t:'recto'},{w:'tubo de agua',t:'cil'},{w:'baúl',t:'recto'},{w:'vaso recto',t:'cil'}]
  },
  {
    label:['Multiplica','Divide'], headA:'⬆️ De grande a chico: × 1,000', headB:'⬇️ De chico a grande: ÷ 1,000',
    colA:'mult', colB:'div',
    words:[{w:'de m³ a dm³',t:'mult'},{w:'de cm³ a dm³',t:'div'},{w:'de dm³ a cm³',t:'mult'},{w:'de dm³ a m³',t:'div'},
           {w:'de m³ a cm³ (dos veces)',t:'mult'},{w:'de cm³ a m³ (dos veces)',t:'div'},{w:'de km³ a m³',t:'mult'},{w:'de mm³ a cm³',t:'div'}]
  },
  {
    label:['Cabe','No cabe'], headA:'✅ Cabe en 1 m³', headB:'❌ Pasa de 1 m³',
    colA:'cabe', colB:'nocabe',
    words:[{w:'500 litros de agua',t:'cabe'},{w:'1,500 litros de agua',t:'nocabe'},{w:'800 dm³',t:'cabe'},{w:'2,000 dm³',t:'nocabe'},
           {w:'un cubo de 90 cm de arista',t:'cabe'},{w:'un cubo de 1.2 m de arista',t:'nocabe'},{w:'999 litros',t:'cabe'},{w:'un prisma de 2 × 1 × 1 m',t:'nocabe'}]
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
      if(clsSelected){ // hay un elemento del banco seleccionado: se inserta en esta caja, sin sacar el tocado
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
  {s:['V','=','4','×','4','×','4','=','64','cm³'],c:8,art:'Toca el volumen del cubo'},
  {s:['El','volumen','se','mide','en','cm³'],c:5,art:'Toca la unidad del volumen'},
  {s:['V','=','π','×','r²','×','altura'],c:4,art:'Toca lo que se eleva al cuadrado en el cilindro'},
  {s:['1','dm³','=','1','litro'],c:4,art:'Toca la unidad de capacidad'},
  {s:['1','m³','=','1,000','dm³'],c:3,art:'Toca cuántos dm³ hay en un metro cúbico'},
  {s:['Pintar','la','pared','se','mide','en','m²'],c:6,art:'Toca la unidad que NO es de volumen'},
  {s:['El','diámetro','mide','10','cm','y','el','radio','5'],c:8,art:'Toca el radio'},
  {s:['Largo','×','ancho','×','alto','=','volumen'],c:6,art:'Toca lo que se obtiene con esa fórmula'}
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
  {s:'El espacio que ocupa un cuerpo se llama ___.',opts:['volumen','área','perímetro'],c:0},
  {s:'El volumen de un cubo se calcula multiplicando la arista ___ veces.',opts:['dos','tres','cuatro'],c:1},
  {s:'El volumen del prisma es largo por ancho por ___.',opts:['radio','base','alto'],c:2},
  {s:'En la fórmula del cilindro se usa el ___ y no el diámetro.',opts:['radio','perímetro','apotema'],c:0},
  {s:'Un decímetro cúbico equivale a un ___.',opts:['mililitro','litro','galón'],c:1},
  {s:'De metros cúbicos a decímetros cúbicos se multiplica por ___.',opts:['10','100','1,000'],c:2},
  {s:'El área se mide en cm² y el volumen en ___.',opts:['cm³','cm','kg'],c:0},
  {s:'Antes de multiplicar, todas las medidas tienen que estar en la misma ___.',opts:['hoja','unidad','figura'],c:1}
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

// ===================== MINI QUIZ INLINE (SECCIÓN APRENDE) =====================
function answerMQ(wrapId, btn, isOk, msg) {
  const wrap = document.getElementById(wrapId);
  if (!wrap || wrap.dataset.done) return;
  wrap.dataset.done = '1';
  const allBtns = wrap.querySelectorAll('.mq-btn');
  allBtns.forEach(b => { b.disabled = true; });
  btn.classList.add(isOk ? 'mq-ok' : 'mq-no');
  if (!isOk) {
    allBtns.forEach(b => { if (b.onclick.toString().includes('true,')) b.classList.add('mq-ok'); });
  }
  const fbEl = document.getElementById(wrapId + '-fb');
  if (fbEl) { fbEl.textContent = (isOk ? '✔ ' : '💡 ') + msg; fbEl.className = 'mq-fb show ' + (isOk ? 'ok' : 'err'); }
  if (isOk) sfx('ok'); else sfx('no');
}

// ===================== PREDICE ANTES DE RESOLVER =====================
const prediceData = [
  {
    q: 'Una caja de 4 cm de largo, 3 de ancho y 2 de alto: ¿cuántos cubitos de 1 cm³ caben dentro?',
    opts: ['9 cubitos', '24 cubitos', '12 cubitos'],
    correct: 1,
    feedback: '¡Correcto! Caben 4 × 3 = 12 en cada capa, y hay 2 capas: 24 cubitos, o sea 24 cm³.',
    wrongFeedback: 'Caben 24. En cada capa entran 4 × 3 = 12 cubitos, y la caja tiene 2 capas de alto: 12 × 2 = 24 cm³.',
    explore: 'cubitos'
  },
  {
    q: 'Un tanque de 1 m³ lleno de agua, ¿cuántos litros tiene?',
    opts: ['100 litros', '1,000 litros', '10,000 litros'],
    correct: 1,
    feedback: '¡Exacto! Un m³ son 1,000 dm³, y cada dm³ es un litro: 1,000 litros.',
    wrongFeedback: 'Son 1,000 litros. Un metro cúbico tiene 1,000 decímetros cúbicos, y cada dm³ es exactamente un litro.',
    explore: 'escalera'
  },
  {
    q: 'Si duplicas la arista de un cubo, ¿su volumen se duplica también?',
    opts: ['Sí, se hace el doble', 'No, se hace ocho veces mayor', 'No, se hace cuatro veces mayor'],
    correct: 1,
    feedback: '¡Muy bien! Al duplicar la arista se duplican las tres dimensiones: 2 × 2 × 2 = 8 veces más volumen.',
    wrongFeedback: 'Se hace ocho veces mayor: la arista entra tres veces en la cuenta, así que 2 × 2 × 2 = 8.',
    explore: 'doble'
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
    fbEl.textContent = '✔ ' + item.feedback;
    fbEl.className = 'predice-fb show ok';
    if (!xpTracker.predice.has(qi)) { xpTracker.predice.add(qi); pts(3); }
    sfx('ok');
  } else {
    opts[ai].classList.add('predice-no');
    opts[item.correct].classList.add('predice-ok');
    fbEl.textContent = '💡 ' + item.wrongFeedback;
    fbEl.className = 'predice-fb show err';
    sfx('no');
  }
  prediceAnswered.add(qi);
  if (prediceAnswered.size === prediceData.length) { fin('s-predice'); sfx('fan'); showToast('🔮 ¡Predicciones completadas! Ahora a aprender.'); }
}

// --- Exploradores interactivos de la sección Predice ---
function togglePredExplore(i){
  sfx('click');
  const box=document.getElementById('pd-explore-'+i); if(!box) return;
  const btn=document.getElementById('pd-btn-'+i);
  if(box.style.display==='none'){
    if(!box.dataset.built){ _buildPredExplore(i,box); box.dataset.built='1'; }
    box.style.display='block'; if(btn) btn.textContent='🔽 Ocultar la pista';
  } else { box.style.display='none'; if(btn) btn.textContent='🔍 Explorar la pista'; }
}
function _pdTick(lbl){ const t=document.createElement('div'); t.className='pd-tick'; t.innerHTML=`<div class="pd-rail"></div><div class="pd-dot"></div><div class="pd-lbl">${lbl}</div>`; return t; }
function _buildPredExplore(i,box){
  const type=prediceData[i].explore;
  if(type==='cubitos'){
    box.innerHTML=`<p class="pd-tip">Una caja de 4 × 3 × 2 cm. Ve poniendo capas de cubitos de 1 cm³:</p><div style="display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;margin:0.5rem 0;"><button class="btn btn-pri" onclick="predCapas(${i},1)">poner 1 capa</button><button class="btn btn-pri" onclick="predCapas(${i},2)">poner 2 capas</button><button class="btn btn-d" onclick="predCapas(${i},0)">↩️ vaciar</button></div><div class="pd-cnt" id="pd-cnt-${i}" style="text-align:center;font-size:1.1rem;line-height:1.35;"></div><div class="pd-msg" id="pd-msg-${i}">👆 llena la caja y cuenta</div>`;
    predCapas(i,0);
  } else if(type==='escalera'){
    box.innerHTML=`<p class="pd-tip">Baja la escalera de las unidades cúbicas, escalón por escalón:</p><div style="display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;margin:0.5rem 0;"><button class="btn btn-pri" onclick="predEscalera(${i},0)">1 m³</button><button class="btn btn-pri" onclick="predEscalera(${i},1)">bajar a dm³</button><button class="btn btn-pri" onclick="predEscalera(${i},2)">bajar a cm³</button></div><div class="pd-msg" id="pd-msg-${i}">👆 empieza por el metro cúbico</div>`;
  } else if(type==='doble'){
    box.innerHTML=`<p class="pd-tip">Un cubo de 2 cm de arista. Duplica su arista y compara:</p><div style="display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;margin:0.5rem 0;"><button class="btn btn-pri" onclick="predDoble(${i},2)">cubo de 2 cm</button><button class="btn btn-pri" onclick="predDoble(${i},4)">cubo de 4 cm</button></div><div class="pd-msg" id="pd-msg-${i}">👆 calcula los dos y compara</div>`;
  }
}
/* Las capas de cubitos son la razón de la fórmula: multiplicar largo por
   ancho por alto es contar cuántos cubitos caben, nada más. */
function predCapas(i,n){
  const cnt=document.getElementById('pd-cnt-'+i), msg=document.getElementById('pd-msg-'+i);
  if(!cnt) return;
  if(n) sfx('click');
  let html='';
  for(let c=0;c<n;c++) html+='<div>'+('🟦'.repeat(4)+'<br>').repeat(3)+'<span style="font-size:0.75rem;color:var(--gray)">capa '+(c+1)+': 12 cubitos</span></div>';
  cnt.innerHTML=html||'<span style="color:var(--gray);font-size:0.9rem;">caja vacía</span>';
  if(n===2){ msg.innerHTML='🎯 Dos capas de 12 cubitos son <strong>24 cubitos</strong>, o sea 24 cm³. Y eso es justo 4 × 3 × 2: la fórmula solo cuenta cubitos.'; sfx('ok'); }
  else if(n===1) msg.innerHTML='📐 En una capa caben 4 × 3 = <strong>12 cubitos</strong>. Pero la caja tiene 2 cm de alto: falta otra capa.';
  else msg.innerHTML='👆 llena la caja y cuenta';
}
function predEscalera(i,paso){
  sfx('click');
  const msg=document.getElementById('pd-msg-'+i);
  if(paso===0) msg.innerHTML='📏 <strong>1 m³</strong>: un cubo de un metro por lado. Es el tanque de agua típico.';
  else if(paso===1){ msg.innerHTML='🪜 Un metro son 10 dm, pero el volumen lleva las tres dimensiones: 10 × 10 × 10 = <strong>1,000 dm³</strong>. Y cada dm³ es un litro.'; sfx('ok'); }
  else msg.innerHTML='🪜 Otro escalón: 1 dm³ = <strong>1,000 cm³</strong>. Así que 1 m³ son 1,000,000 de cm³. Cada escalón vale 1,000, nunca 100.';
}
function predDoble(i,a){
  sfx('click');
  const msg=document.getElementById('pd-msg-'+i);
  const v=a*a*a;
  if(a===4){ msg.innerHTML=`📈 Cubo de 4 cm: 4 × 4 × 4 = <strong>64 cm³</strong>. Contra los 8 cm³ del de 2 cm, es <strong>ocho veces más</strong>, no el doble.`; sfx('ok'); }
  else msg.innerHTML=`🧊 Cubo de 2 cm: 2 × 2 × 2 = <strong>${v} cm³</strong>. Ahora prueba con el de 4 cm.`;
}

// ===================== RETO FINAL (con parejas variables) =====================
const retoPairs=[
  {
    name:'Volumen vs número 📦', hint:'Calcula el volumen de A y compáralo con B',
    pool:[
      {w:'A: cubo de arista 3 cm vs B: 27 cm³',t:'igual'},{w:'A: cubo de arista 2 cm vs B: 10 cm³',t:'menor'},{w:'A: cubo de arista 5 cm vs B: 100 cm³',t:'mayor'},
      {w:'A: prisma 4 × 3 × 2 vs B: 24 cm³',t:'igual'},{w:'A: prisma 2 × 2 × 3 vs B: 15 cm³',t:'menor'},{w:'A: prisma 5 × 4 × 3 vs B: 50 cm³',t:'mayor'},
      {w:'A: cubo de arista 4 cm vs B: 64 cm³',t:'igual'},{w:'A: prisma 3 × 3 × 2 vs B: 20 cm³',t:'menor'},{w:'A: prisma 6 × 5 × 2 vs B: 55 cm³',t:'mayor'},
      {w:'A: prisma 10 × 2 × 1 vs B: 20 cm³',t:'igual'},{w:'A: cubo de arista 2 cm vs B: 9 cm³',t:'menor'},{w:'A: cubo de arista 6 cm vs B: 200 cm³',t:'mayor'}
    ]
  },
  {
    name:'Unidades y litros 💧', hint:'Convierte A y compáralo con B. Recuerda: 1 dm³ = 1 litro',
    pool:[
      {w:'A: 1 m³ vs B: 1,000 litros',t:'igual'},{w:'A: 1 m³ vs B: 1,500 litros',t:'menor'},{w:'A: 2 m³ vs B: 1,500 litros',t:'mayor'},
      {w:'A: 5 dm³ vs B: 5 litros',t:'igual'},{w:'A: 3 dm³ vs B: 5 litros',t:'menor'},{w:'A: 8 dm³ vs B: 5 litros',t:'mayor'},
      {w:'A: 1 dm³ vs B: 1,000 cm³',t:'igual'},{w:'A: 500 cm³ vs B: 1 litro',t:'menor'},{w:'A: 1,500 cm³ vs B: 1 litro',t:'mayor'},
      {w:'A: 0.5 m³ vs B: 500 litros',t:'igual'},{w:'A: 0.2 m³ vs B: 500 litros',t:'menor'},{w:'A: 3 m³ vs B: 2,500 litros',t:'mayor'}
    ]
  },
  {
    name:'¿Área o volumen? 📐', hint:'Fíjate en la unidad: cm² es superficie y cm³ es espacio',
    pool:[
      {w:'A: superficie de un cuadrado de 4 cm vs B: 16 cm²',t:'igual'},{w:'A: volumen de un cubo de 2 cm vs B: 12 cm³',t:'menor'},{w:'A: volumen de un cubo de 4 cm vs B: 16 cm³',t:'mayor'},
      {w:'A: superficie de un cuadrado de 5 cm vs B: 25 cm²',t:'igual'},{w:'A: superficie de un cuadrado de 3 cm vs B: 12 cm²',t:'menor'},{w:'A: volumen de un cubo de 3 cm vs B: 9 cm³',t:'mayor'},
      {w:'A: volumen de un prisma 2 × 2 × 2 vs B: 8 cm³',t:'igual'},{w:'A: superficie de un cuadrado de 2 cm vs B: 8 cm²',t:'menor'},{w:'A: volumen de un cubo de 5 cm vs B: 100 cm³',t:'mayor'},
      {w:'A: volumen de un prisma 3 × 2 × 1 vs B: 6 cm³',t:'igual'},{w:'A: volumen de un prisma 1 × 2 × 2 vs B: 6 cm³',t:'menor'},{w:'A: volumen de un prisma 4 × 4 × 2 vs B: 30 cm³',t:'mayor'}
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
      if(_fb){
        const labels={mayor:'A es MAYOR que B',menor:'A es MENOR que B',igual:'A es IGUAL a B'};
        _fb.textContent=`En ${retoCurrent.w}: ${labels[retoCurrent.t]}`;
        _fb.className='fb show err';
        setTimeout(()=>_fb.classList.remove('show'),2000);
      }
    }
    document.getElementById('retoScore').textContent=`✔ ${retoOk} correctas | ✗ ${retoErr} errores`; showRetoWord();
}
function endReto(){ retoRunning=false; document.getElementById('retoWord').textContent='🏁 ¡Tiempo!'; document.getElementById('retoTimer').style.color='var(--pri)'; xpTracker.reto.add(1); const total=retoOk+retoErr; const pct=total>0?Math.round((retoOk/total)*100):0; fb('fbReto',`Resultado: ${retoOk}/${total} (${pct}%) ¡Bien hecho! Prueba otra pareja con 🔀`,true); fin('s-reto'); sfx('fan'); unlockAchievement('reto_hero'); }
function resetReto(){ sfx('click'); clearInterval(retoTimerInt); retoRunning=false; retoSec=30; retoOk=0; retoErr=0; document.getElementById('retoTimer').textContent='⏱ 30'; document.getElementById('retoTimer').style.color='var(--pri)'; document.getElementById('retoWord').textContent='¡Prepárate!'; document.getElementById('retoScore').textContent='✔ 0 correctas | ✗ 0 errores'; document.getElementById('fbReto').classList.remove('show'); }

// ===================== GENERADOR DE TAREAS =====================
// Tareas autogeneradas: el estudiante se autoasigna práctica desde casa o el
// docente las copia en el pizarrón. Cada "⚡ Generar" crea ejercicios nuevos
// y las respuestas quedan ocultas hasta presionar "👁 Respuestas".
function _tgRint(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
function _tgLines(n){ let s=''; for(let i=0;i<n;i++) s+='<div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.4rem;height:1.3rem;">&nbsp;</div>'; return s; }
function _tgTask(out,i,inner){ const div=document.createElement('div'); div.className='tg-task'; div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content">${inner}</div>`; out.appendChild(div); }
const pensamientoTaskDB=[
  {q:'Una caja mide 30 cm × 20 cm × 10 cm. ¿Cuántos litros le caben?',a:'30 × 20 × 10 = 6,000 cm³ = 6 dm³ = 6 litros.'},
  {q:'¿Por qué al duplicar la arista de un cubo el volumen se hace ocho veces mayor y no el doble?',a:'Porque la arista entra tres veces en la cuenta: 2 × 2 × 2 = 8.'},
  {q:'Un camión lleva 6 m³ de arena. ¿Cuántos viajes hacen falta para 20 m³?',a:'20 ÷ 6 = 3.33, así que hacen falta 4 viajes.'},
  {q:'Un balde tiene forma de cilindro de 15 cm de radio y 40 cm de alto. ¿Cuántos litros le caben? (π = 3.14)',a:'3.14 × 225 × 40 = 28,260 cm³ ≈ 28.26 litros.'},
  {q:'Explica cómo sabrías, sin fórmulas, cuántos cubitos de 1 cm³ caben en una caja de 5 × 4 × 3 cm.',a:'Se cuentan por capas: 5 × 4 = 20 cubitos por capa, y hay 3 capas: 60 cubitos.'},
  {q:'Un tanque de agua es un cubo de 1.2 m de arista. ¿Aguanta 2,000 litros?',a:'1.2 × 1.2 × 1.2 = 1.728 m³ = 1,728 litros. No aguanta 2,000: faltan 272.'},
  {q:'¿Qué tiene más volumen: un cubo de 10 cm de arista o un prisma de 20 × 10 × 5 cm?',a:'Los dos tienen 1,000 cm³: son iguales, aunque no se parezcan.'},
  {q:'Para pintar por fuera un tanque, ¿calculas área o volumen? ¿Y para saber cuánta agua le cabe?',a:'Para pintar, el área (superficie, en m²). Para el agua, el volumen (en m³ o litros).'}
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
function genTask(){ sfx('click'); const type=document.getElementById('tgType').value; const count=parseInt(document.getElementById('tgCount').value); ansVisible=false; const out=document.getElementById('tgOut'); out.innerHTML=''; if(type==='cubo') genVolCuboTask(out,count); else if(type==='prisma') genVolPrismaTask(out,count); else if(type==='cilindro') genVolCilindroTask(out,count); else if(type==='unidades') genUnidadesTask(out,count); else if(type==='real') genVolRealTask(out,count); else if(type==='pensamiento') genPensamientoTask(out,count); fin('s-tareas'); }
function _instrBlock(out,title,lines){ const ib=document.createElement('div'); ib.className='tg-instruction-block'; ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join(''); out.appendChild(ib); }
// 🧊 Volumen del cubo (aleatorio: nunca se repite)
function genVolCuboTask(out,count){
  _instrBlock(out,'🧊 Volumen del cubo',['Multiplica la arista por sí misma tres veces.','No olvides escribir la unidad: cm³.']);
  for(let i=0;i<count;i++){
    const a=_tgRint(2,12);
    _tgTask(out,i,`<div class="tg-op">Cubo de arista ${a} cm → V = ________</div><div class="tg-answer" style="display:${ansVisible?'block':'none'}">R/ ${a} × ${a} × ${a} = ${_volCubo(a)} cm³</div>`);
  }
}
// 📦 Volumen del prisma
function genVolPrismaTask(out,count){
  _instrBlock(out,'📦 Volumen del prisma',['Multiplica largo por ancho por alto.','Escribe el resultado en cm³.']);
  for(let i=0;i<count;i++){
    const l=_tgRint(2,12), an=_tgRint(2,9), al=_tgRint(2,9);
    _tgTask(out,i,`<div class="tg-op">Prisma de ${l} × ${an} × ${al} cm → V = ________</div><div class="tg-answer" style="display:${ansVisible?'block':'none'}">R/ ${_volPrisma(l,an,al)} cm³</div>`);
  }
}
// 🥫 Volumen del cilindro, con el radio bien tomado
function genVolCilindroTask(out,count){
  _instrBlock(out,'🥫 Volumen del cilindro',['Usa π = 3.14 y el RADIO, no el diámetro.','V = π × radio × radio × altura.']);
  for(let i=0;i<count;i++){
    const r=_tgRint(2,10), h=_tgRint(5,25), dio=_tgRint(0,1);
    const txt = dio ? `Cilindro de radio ${r} cm y altura ${h} cm` : `Cilindro de diámetro ${r*2} cm y altura ${h} cm`;
    _tgTask(out,i,`<div class="tg-op">${txt} → V = ________</div><div class="tg-answer" style="display:${ansVisible?'block':'none'}">R/ ${dio?'':'radio = '+r+' cm · '}3.14 × ${r*r} × ${h} = ${_volFmt(_volCilindro(r,h))} cm³</div>`);
  }
}
// 🪜 Cambios de unidad, de 1,000 en 1,000
function genUnidadesTask(out,count){
  _instrBlock(out,'🪜 Cambia de unidad',['Cada escalón multiplica o divide entre 1,000.','Recuerda que 1 dm³ es 1 litro.']);
  const casos=[['m³','dm³',1000],['dm³','cm³',1000],['dm³','m³',0.001],['cm³','dm³',0.001],['m³','litros',1000],['dm³','litros',1]];
  for(let i=0;i<count;i++){
    const c=casos[_tgRint(0,casos.length-1)], v=_tgRint(1,9)*(c[2]<1?1000:1);
    const r=v*c[2];
    _tgTask(out,i,`<div class="tg-op">${v.toLocaleString('en-US')} ${c[0]} = ________ ${c[1]}</div><div class="tg-answer" style="display:${ansVisible?'block':'none'}">R/ ${r.toLocaleString('en-US')} ${c[1]}</div>`);
  }
}
// 🏗️ Problemas de la vida real
function genVolRealTask(out,count){
  _instrBlock(out,'🏗️ Problemas de la vida real',['Calcula el volumen y contesta con su unidad.','Si te piden litros, recuerda que 1 dm³ = 1 litro.']);
  const casos=[
    ['una pila de agua','m',2,1],['un baúl','cm',60,40],['un tanque','m',1,1],['una caja de galletas','cm',20,15]
  ];
  for(let i=0;i<count;i++){
    const c=casos[_tgRint(0,casos.length-1)];
    const l=c[2], an=c[3], al=_tgRint(1,5)*(c[1]==='cm'?10:1)/(c[1]==='m'?2:1);
    const v=l*an*al;
    _tgTask(out,i,`<div class="tg-op">${c[0]} de ${l} × ${an} × ${al} ${c[1]} → V = ________ ${c[1]}³</div><div class="tg-answer" style="display:${ansVisible?'block':'none'}">R/ ${_volFmt(v)} ${c[1]}³${c[1]==='m'?' = '+_volFmt(v*1000)+' litros':''}</div>`);
  }
}
function toggleAns(){ ansVisible=!ansVisible; document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none'); sfx('click'); }

// ===================== SOPA DE LETRAS (multidireccional, con inversas) =====================
const sopaSets=[
  {
    size:10,
    grid:[
      ['B','H','V','C','C','S','C','U','E','E'],
      ['E','A','R','U','T','L','A','S','U','F'],
      ['I','S','T','A','Z','P','G','U','G','L'],
      ['O','N','A','R','R','T','R','C','D','H'],
      ['H','C','M','B','A','I','U','V','U','H'],
      ['V','H','A','C','B','B','S','H','C','B'],
      ['M','C','T','H','I','I','S','T','G','U'],
      ['E','V','V','C','S','H','S','P','A','G'],
      ['D','D','O','V','O','L','U','M','E','N'],
      ['P','N','P','P','R','L','I','T','R','O']
    ],
    words:[
      {w:'VOLUMEN',cells:[[8,3],[8,4],[8,5],[8,6],[8,7],[8,8],[8,9]]},
      {w:'CUBICO',cells:[[3,7],[4,6],[5,5],[6,4],[7,3],[8,2]]},
      {w:'ALTURA',cells:[[1,6],[1,5],[1,4],[1,3],[1,2],[1,1]]},
      {w:'ARISTA',cells:[[2,3],[3,4],[4,5],[5,6],[6,7],[7,8]]},
      {w:'LITRO',cells:[[9,5],[9,6],[9,7],[9,8],[9,9]]},
      {w:'BASE',cells:[[4,3],[3,2],[2,1],[1,0]]}
    ]
  },
  {
    size:10,
    grid:[
      ['Z','E','H','T','O','T','G','C','E','B'],
      ['Z','A','N','I','C','O','B','E','T','P'],
      ['E','D','C','I','L','I','N','D','R','O'],
      ['Z','O','C','T','A','E','R','I','L','R'],
      ['B','M','U','F','U','E','S','E','E','E'],
      ['C','E','B','H','B','M','M','G','R','N'],
      ['I','T','O','A','A','G','E','A','C','I'],
      ['B','R','C','C','G','H','D','E','U','M'],
      ['M','O','N','N','L','I','A','R','F','O'],
      ['I','C','S','H','O','B','M','A','F','L']
    ],
    words:[
      {w:'CILINDRO',cells:[[2,2],[2,3],[2,4],[2,5],[2,6],[2,7],[2,8],[2,9]]},
      {w:'PRISMA',cells:[[1,9],[2,8],[3,7],[4,6],[5,5],[6,4]]},
      {w:'RADIO',cells:[[5,8],[6,7],[7,6],[8,5],[9,4]]},
      {w:'METRO',cells:[[4,1],[5,1],[6,1],[7,1],[8,1]]},
      {w:'CUBO',cells:[[3,2],[4,2],[5,2],[6,2]]},
      {w:'AREA',cells:[[9,7],[8,7],[7,7],[6,7]]},
      {w:'CABER',cells:[[7,2],[6,3],[5,4],[4,5],[3,6]]}
    ]
  }
];
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
  {q:'El volumen es el espacio que ocupa un cuerpo.',a:true},
  {q:'El volumen se mide en centímetros cuadrados (cm²).',a:false},
  {q:'El volumen de un cubo de 3 cm de arista es 27 cm³.',a:true},
  {q:'Para hallar el volumen de un prisma se multiplica largo por ancho por alto.',a:true},
  {q:'En la fórmula del cilindro se usa el diámetro del círculo.',a:false},
  {q:'Un decímetro cúbico equivale a un litro.',a:true},
  {q:'Un metro cúbico tiene 100 decímetros cúbicos.',a:false},
  {q:'El volumen del cilindro también se puede pensar como área de la base por altura.',a:true},
  {q:'Un tanque de 1 m³ guarda 1,000 litros de agua.',a:true},
  {q:'Si se duplica la arista de un cubo, su volumen también se duplica.',a:false},
  {q:'Antes de multiplicar las medidas hay que pasarlas todas a la misma unidad.',a:true},
  {q:'El área sirve para saber cuánto papel se necesita para forrar una caja.',a:true},
  {q:'De centímetros cúbicos a decímetros cúbicos se divide entre 1,000.',a:true},
  {q:'La capacidad de un recipiente y su volumen miden cosas distintas.',a:false},
  {q:'El volumen de un prisma de 5 × 4 × 2 cm es 40 cm³.',a:true}
];
const evalMCBank=[
  {q:'¿Cuál es el volumen de un cubo de 4 cm de arista?',o:['a) 64 cm³','b) 16 cm³','c) 12 cm³','d) 48 cm³'],a:0},
  {q:'La fórmula del volumen del cilindro es…',o:['a) π × d × h','b) π × r² × h','c) 2 × π × r','d) r² × h'],a:1},
  {q:'¿Cuántos dm³ hay en 3 m³?',o:['a) 30','b) 300','c) 3,000','d) 3,000,000'],a:2},
  {q:'¿Qué unidad corresponde al volumen?',o:['a) m','b) m²','c) kg','d) m³'],a:3},
  {q:'El volumen de un prisma de 6 × 3 × 2 cm es…',o:['a) 36 cm³','b) 11 cm³','c) 18 cm³','d) 22 cm³'],a:0},
  {q:'Un cilindro tiene 6 cm de diámetro. Su radio es…',o:['a) 12 cm','b) 3 cm','c) 6 cm','d) 36 cm'],a:1},
  {q:'¿Cuántos litros caben en un tanque de 2 m³?',o:['a) 200','b) 20','c) 2,000','d) 2'],a:2},
  {q:'Para saber cuánto papel se necesita para forrar una caja se calcula…',o:['a) su volumen','b) su capacidad','c) su peso','d) su área'],a:3},
  {q:'Si un cubo tiene 8 cm³ de volumen, su arista mide…',o:['a) 2 cm','b) 4 cm','c) 8 cm','d) 3 cm'],a:0},
  {q:'¿Cuál de estas cantidades NO cabe en 1 m³?',o:['a) 900 litros','b) 1,200 litros','c) 500 dm³','d) 999 litros'],a:1},
  {q:'El volumen de un cilindro de radio 2 cm y altura 10 cm (con π = 3.14) es…',o:['a) 62.8 cm³','b) 40 cm³','c) 125.6 cm³','d) 12.56 cm³'],a:2},
  {q:'De decímetros cúbicos a metros cúbicos se…',o:['a) multiplica por 100','b) multiplica por 1,000','c) divide entre 100','d) divide entre 1,000'],a:3},
  {q:'Si se duplica la arista de un cubo, su volumen se hace…',o:['a) ocho veces mayor','b) el doble','c) cuatro veces mayor','d) igual'],a:0},
  {q:'Una pila de 2 × 1 × 0.5 m tiene un volumen de…',o:['a) 3.5 m³','b) 1 m³','c) 2 m³','d) 0.5 m³'],a:1},
  {q:'El volumen del prisma y el del cilindro se calculan los dos con…',o:['a) la suma de las aristas','b) el número de caras','c) el área de la base por la altura','d) el perímetro por dos'],a:2}
];
const evalCPBank=[
  {q:'El espacio que ocupa un cuerpo se llama ___.',a:'volumen'},
  {q:'El volumen se mide en unidades ___ (cm³, m³).',a:'cúbicas'},
  {q:'El volumen del cubo se halla multiplicando la ___ tres veces.',a:'arista'},
  {q:'El volumen de un cubo de 3 cm de arista es ___ cm³.',a:'27'},
  {q:'El volumen de un prisma es largo por ancho por ___.',a:'alto'},
  {q:'En la fórmula del cilindro se usa el ___ del círculo.',a:'radio'},
  {q:'Un decímetro cúbico equivale a un ___.',a:'litro'},
  {q:'Un metro cúbico tiene ___ decímetros cúbicos.',a:'1000'},
  {q:'En un tanque de 1 m³ caben ___ litros de agua.',a:'1000'},
  {q:'El volumen de un prisma de 5 × 4 × 2 cm es ___ cm³.',a:'40'},
  {q:'La superficie se mide en cm² y el volumen en ___.',a:'cm³'},
  {q:'Si el diámetro mide 10 cm, el radio mide ___ cm.',a:'5'},
  {q:'Al duplicar la arista de un cubo, el volumen se hace ___ veces mayor.',a:'8'},
  {q:'Lo que cabe dentro de un recipiente se llama ___.',a:'capacidad'},
  {q:'De cm³ a dm³ se divide entre ___.',a:'1000'}
];
const evalPRBank=[
  {term:'Volumen',def:'El espacio que ocupa un cuerpo'},
  {term:'Centímetro cúbico',def:'Un cubito de 1 cm por lado'},
  {term:'Volumen del cubo',def:'Arista por arista por arista'},
  {term:'Volumen del prisma',def:'Largo por ancho por alto'},
  {term:'Volumen del cilindro',def:'π por el radio al cuadrado por la altura'},
  {term:'Área de la base',def:'Lo que se multiplica por la altura en prismas y cilindros'},
  {term:'Radio',def:'La mitad del diámetro, y lo que va en la fórmula'},
  {term:'Decímetro cúbico',def:'Equivale exactamente a un litro'},
  {term:'Metro cúbico',def:'Un cubo de un metro por lado, o 1,000 litros'},
  {term:'Capacidad',def:'Lo que cabe dentro de un recipiente'},
  {term:'Área',def:'La superficie, que se mide en unidades cuadradas'},
  {term:'Escalón de unidades',def:'Cada paso multiplica o divide entre 1,000'},
  {term:'Altura',def:'Lo alto del cuerpo, el tercer factor de la fórmula'},
  {term:'Arista',def:'El lado del cubo que se multiplica tres veces'},
  {term:'π',def:'El número 3.14 que aparece en la fórmula del cilindro'}
];
// ══════════ Formas deterministas v1 (M.E.T.A.S, jul 2026) ══════════
// La Forma N genera SIEMPRE el mismo examen y la misma pauta («bucle exacto»),
// en cualquier navegador y aunque se cierre el programa. PRNG mulberry32
// (aritmética entera exacta) + barajado Fisher-Yates. ⚠️ NO usar
// sort(() => rng() - 0.5): el resultado depende del motor del navegador.
// ⚠️ Editar los bancos de preguntas CAMBIA el contenido de todas las formas.
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
// Selector «Forma exacta»: el docente elige qué forma generar (p.ej. para
// reimprimir la pauta de la Forma 15 que ya repartió a los alumnos).
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
  _evalFormaSelector(); const _selF = document.getElementById('evalFormaSel'); if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10))); const cf = evalFormNum; const rng = _evalRng(cf); /* la Forma cf siembra TODO el azar de esta evaluación */ window._currentEvalForm=cf; evalFormNum = (evalFormNum % EVAL_FORMAS) + 1; _evalFormaSelector(); saveProgress();
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
// Normaliza texto del estudiante: minúsculas, sin tildes ni signos
function _normTxt(s){ return (s||'').toString().trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9ñ ]/gi,'').replace(/\s+/g,' ').trim(); }
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
  
    // ── Clave rápida estilo ZipGrade (círculos rellenados automáticamente con la pauta)
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación Volumen de Cuerpos · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:12pt;color:#111;background:#fff;padding:4mm 6mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.5rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;color:#1565c0;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:#1565c0;margin-top:0.15rem;font-weight:700;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.5rem 0 0.25rem;border-left:4px solid #1565c0;background:#e3f2fd;display:flex;justify-content:space-between;align-items:center;color:#1565c0;}.qn{font-weight:700;min-width:22px;flex-shrink:0;color:#1565c0;}.tf-row{display:flex;align-items:flex-start;gap:0.3rem;font-size:10.5pt;line-height:1.4;padding:0.25rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:42px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.2rem;margin-top:0.2rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.28rem 0.45rem;margin-bottom:0.22rem;break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.4;display:flex;gap:0.3rem;margin-bottom:0.18rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.22rem 0.55rem;}.mc-opts{display:grid;grid-template-columns:repeat(3,1fr);gap:0.08rem 0.25rem;margin-left:1.3rem;}.mc-opt{font-size:9.5pt;display:flex;align-items:center;gap:0.22rem;}.mc-opt input{width:12px;height:12px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.4;padding:0.22rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:130px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{break-inside:avoid;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.2rem 0.5rem;margin-top:0.15rem;}.pr-head{font-size:9pt;font-weight:700;color:#1565c0;margin-bottom:0.2rem;}.pr-item{font-size:10pt;padding:0.22rem 0.32rem;background:#e3f2fd;border-radius:3px;margin-bottom:0.12rem;display:flex;align-items:center;gap:0.22rem;line-height:1.2;}.pr-num{font-weight:700;color:#1565c0;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #1565c0;padding-bottom:0.35rem;margin-bottom:0.5rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;color:#1565c0;}.p-sub{font-size:9pt;color:#1565c0;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #cce0ff;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;color:#1565c0;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#1565c0;}.pa{color:#007a00;font-weight:700;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:#1565c0;font-weight:700;font-style:italic;}.obt-lbl{font-weight:700;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #1565c0;height:12px;}.obt-pct{font-weight:700;}.total-row{display:flex;align-items:baseline;justify-content:flex-end;gap:7px;font-size:11pt;color:#1565c0;font-weight:700;font-style:italic;margin-top:0.4rem;padding:0.2rem 0.5rem;background:#e3f2fd;border-radius:4px;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #1565c0;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · Misión Volumen de Cuerpos · Matemática</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 4 secciones × 5 preguntas × 5 pts c/u · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✔ PAUTA DOCENTE — Evaluación Final · Volumen de Cuerpos · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">100 pts | 4 secciones × 5 preguntas × 5 pts | Matemáticas · Educación Básica</div></div><div class="p-grid">${pR}</div>
  ${zgBlock}</div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("evalPage",252,0.55,1.45);fit("pautaPage",252,0.55,1.3);})();</script></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(doc); win.document.close(); setTimeout(()=>win.print(),400);
}

// ===================== EXPLICA CON TUS PALABRAS =====================
const explicaData = [
  {
    q: 'Un compañero calculó el volumen de un cubo de 5 cm y escribió 25 cm³. Explícale qué le pasó.',
    hint: '💡 Pista: cuenta cuántas veces entra la arista en la cuenta.',
    rubric: ['✓ Señala que multiplicó solo dos veces (eso es el área de una cara)', '✓ Recuerda que el volumen lleva las tres dimensiones', '✓ Da el resultado: 125 cm³'],
    suggested: 'Multiplicó 5 × 5 y le dio 25, pero eso es el área de una cara, no el volumen. El volumen lleva las tres dimensiones: 5 × 5 × 5 = 125 cm³. Además la unidad delata el error: 25 cm² sería superficie.'
  },
  {
    q: 'Explica por qué un tanque de 1 m³ guarda 1,000 litros y no 100.',
    hint: '💡 Pista: cada escalón de las unidades cúbicas vale 1,000.',
    rubric: ['✓ Explica que 1 m³ = 1,000 dm³', '✓ Recuerda que 1 dm³ = 1 litro', '✓ Concluye que son 1,000 litros'],
    suggested: 'Un metro tiene 10 decímetros, pero como el volumen lleva las tres dimensiones son 10 × 10 × 10 = 1,000 decímetros cúbicos. Y como cada dm³ es un litro, en 1 m³ caben 1,000 litros.'
  },
  {
    q: 'Te dan un cilindro de 10 cm de diámetro y 20 cm de altura. Explica paso a paso cómo hallas su volumen.',
    hint: '💡 Pista: lo primero es mirar si te dieron el radio o el diámetro.',
    rubric: ['✓ Convierte el diámetro en radio: 10 ÷ 2 = 5 cm', '✓ Aplica V = π × r² × h', '✓ Calcula: 3.14 × 25 × 20 = 1,570 cm³'],
    suggested: 'Primero saco el radio, porque me dieron el diámetro: 10 ÷ 2 = 5 cm. Después aplico la fórmula V = π × r² × h = 3.14 × 5² × 20 = 3.14 × 25 × 20 = 1,570 cm³, que son 1.57 litros.'
  },
  {
    q: 'Tu mamá quiere saber cuánta agua le cabe a una pila de 2 m de largo, 1 m de ancho y medio metro de hondo. Resuélvelo y explícale el resultado en litros.',
    hint: '💡 Pista: primero el volumen en m³ y después pásalo a litros.',
    rubric: ['✓ Calcula 2 × 1 × 0.5 = 1 m³', '✓ Convierte: 1 m³ = 1,000 litros', '✓ Explica el resultado con palabras sencillas'],
    suggested: 'Multiplico las tres medidas: 2 × 1 × 0.5 = 1 m³. Como cada metro cúbico son 1,000 litros, la pila le aguanta 1,000 litros de agua llena hasta el borde.'
  },
  {
    q: '¿En qué se diferencia calcular el área de una caja y calcular su volumen? Pon un ejemplo de cuándo se usa cada uno.',
    hint: '💡 Pista: uno es para forrar y el otro para llenar.',
    rubric: ['✓ Área: la superficie de fuera, se mide en cm²', '✓ Volumen: el espacio de dentro, se mide en cm³', '✓ Da un ejemplo real de cada uno'],
    suggested: 'El área es la superficie de fuera y se mide en cm²: sirve para saber cuánto papel necesito para forrar la caja. El volumen es el espacio de dentro y se mide en cm³: sirve para saber cuánto arroz le cabe.'
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

// ===================== PRUEBA OPERATIVA — VOLUMEN DE CUERPOS =====================

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

// ---- Helpers ----
let _opRnd = Math.random;
function _opRint(min, max) { return Math.floor(_opRnd() * (max - min + 1)) + min; }
function _fmtNum(n) { return n.toLocaleString('en-US'); }
function _isIntMatch(student, expectedNum) {
  const raw = (student || '').toString().trim().replace(/[,\s]/g, '');
  if (!raw) return false;
  const n = parseInt(raw, 10);
  return !isNaN(n) && n === expectedNum;
}
/* Se comparan sin espacios: «3 / 4» y «3/4» son la misma respuesta, y
   pelear con la barra espaciadora no es lo que se está evaluando. */
function _isTxtMatch(student, accepted) { const z = s => _normTxt(s).replace(/\s+/g, ''); const v = z(student); return !!v && accepted.some(a => z(a) === v); }
function _sumaCifras(n) { return String(n).split('').reduce((a, c) => a + parseInt(c, 10), 0); }
function _mcmDe(a, b) { let m = a; while (m % b !== 0) m += a; return m; }

// I. Calcula el volumen (5 × 4 = 20 pts) — Bloques 1, 2 y 4
const _VOL_ARISTAS = [2, 3, 4, 5, 6, 7, 8, 10];
const _VOL_RADIOS = [2, 3, 4, 5, 6, 10];
function genMultDivItems() {
  const items = [];
  { const a = _VOL_ARISTAS[_opRint(0, _VOL_ARISTAS.length - 1)];
    items.push({ text: `Volumen de un cubo de ${a} cm de arista, en cm³:`, ansNum: _volCubo(a) }); }
  { const l = _opRint(2, 12), an = _opRint(2, 9), al = _opRint(2, 9);
    items.push({ text: `Volumen de un prisma de ${l} × ${an} × ${al} cm, en cm³:`, ansNum: _volPrisma(l, an, al) }); }
  { const r = _VOL_RADIOS[_opRint(0, _VOL_RADIOS.length - 1)], h = _opRint(5, 20);
    items.push({ text: `Volumen de un cilindro de radio ${r} cm y altura ${h} cm (π = 3.14), en cm³:`, ansTxt: _volAcc(_volCilindro(r, h)), ansShow: _volFmt(_volCilindro(r, h)) + ' cm³' }); }
  { const r = _VOL_RADIOS[_opRint(0, _VOL_RADIOS.length - 1)], h = _opRint(5, 20);
    items.push({ text: `Ojo con el dato: un cilindro de <em>diámetro</em> ${r * 2} cm y altura ${h} cm (π = 3.14), en cm³:`, ansTxt: _volAcc(_volCilindro(r, h)), ansShow: _volFmt(_volCilindro(r, h)) + ` cm³ (el radio es ${r})` }); }
  { const l = _opRint(2, 6), an = _opRint(1, 4), al = _opRint(1, 3);
    items.push({ text: `Una pila mide ${l} × ${an} × ${al} m. ¿Cuántos litros le caben?`, ansNum: l * an * al * 1000 }); }
  return items;
}

// II. Radar de unidades (5 × 2 = 10 pts) — Bloque 3, Bloque 5 (tabla de criterios) y widget Radar Par-Impar
function genRadarItems() {
  const items = [];
  const tipos = _shuffleF([0, 1, 2, 3, 4], _opRnd);
  tipos.forEach(tp => {
    if (tp === 0) {
      const v = _opRint(1, 9);
      items.push({ text: `${v} m³ ¿cuántos dm³ son?`, ansNum: v * 1000 });
    } else if (tp === 1) {
      const v = _opRint(1, 9);
      items.push({ text: `${v} dm³ ¿cuántos litros son?`, ansNum: v });
    } else if (tp === 2) {
      const casos = [['pintar una pared', 'área'], ['llenar un tanque', 'volumen'], ['forrar una caja', 'área'], ['la arena de un camión', 'volumen']];
      const c = casos[_opRint(0, 3)];
      items.push({ text: `Para ${c[0]}, ¿se calcula área o volumen? Escribe <em>área</em> o <em>volumen</em>.`, ansTxt: [c[1]], ansShow: c[1] });
    } else if (tp === 3) {
      const d = _VOL_RADIOS[_opRint(0, _VOL_RADIOS.length - 1)] * 2;
      items.push({ text: `Un cilindro tiene ${d} cm de diámetro. ¿Cuánto mide su radio?`, ansNum: d / 2 });
    } else {
      const a = _VOL_ARISTAS[_opRint(0, 4)];
      items.push({ text: `¿En qué unidad se escribe el volumen de un cubo medido en centímetros? Escribe <em>cm2</em> o <em>cm3</em>.`, ansTxt: ['cm3', 'cm³'], ansShow: 'cm³ — el volumen va al cubo' });
    }
  });
  return items;
}

// III. ¿Qué medida se esconde? (5 × 4 = 20 pts): la fórmula al revés, que es donde se ve si la entendió
function genReglaItems() {
  const items = [];
  const forms = _shuffleF([0, 1, 2, 3, _opRint(0, 3)], _opRnd);
  forms.forEach(f => {
    let expr, hint, ansNum;
    if (f === 0) { const a = _VOL_ARISTAS[_opRint(0, 5)];
      expr = `▢ × ▢ × ▢ = ${_volCubo(a)} cm³`; hint = 'es un cubo: los tres números son iguales'; ansNum = a; }
    else if (f === 1) { const l = _opRint(2, 9), an = _opRint(2, 6), al = _opRint(2, 6);
      expr = `${l} × ${an} × ▢ = ${_volPrisma(l, an, al)} cm³`; hint = 'falta la altura del prisma'; ansNum = al; }
    else if (f === 2) { const v = _opRint(1, 9);
      expr = `${v} m³ = ▢ litros`; hint = 'cada m³ son 1,000 litros'; ansNum = v * 1000; }
    else { const l = _opRint(2, 9), an = _opRint(2, 6), al = _opRint(2, 6);
      expr = `▢ × ${an} × ${al} = ${_volPrisma(l, an, al)} cm³`; hint = 'falta el largo'; ansNum = l; }
    items.push({ expr, hint, ansNum });
  });
  return items;
}

// IV. Problemas de la vida real (3 × 10 = 30 pts): litros de una pila, cajas en un baúl y un barril cilíndrico
const OP_NAMES = ['Ana', 'Luis', 'Marta', 'José', 'Carmen', 'Pedro', 'Sofía', 'Iván'];
const OP_OBJS = ['mangos', 'tortillas', 'rosquillas', 'naranjas', 'elotes', 'semillas de café'];
const _VI_DEPOS = [['una pila', 'agua'], ['un tanque', 'agua'], ['un cajón', 'arena'], ['una caja', 'maíz']];
const _VI_CAJITAS = [[20, 10, 10], [30, 20, 10], [25, 20, 10], [40, 20, 20]];
function genVidaItems() {
  const items = [];
  { const d = _VI_DEPOS[_opRint(0, _VI_DEPOS.length - 1)];
    const l = _opRint(2, 5), an = _opRint(1, 3), al = _opRint(1, 2);
    items.push({ text: `${d[0].charAt(0).toUpperCase() + d[0].slice(1)} mide ${l} m de largo, ${an} m de ancho y ${al} m de hondo. ¿Cuántos litros de ${d[1]} le caben?`, ansNum: l * an * al * 1000, just: `${l} × ${an} × ${al} = ${l * an * al} m³, y cada m³ son 1,000 litros` }); }
  { const c = _VI_CAJITAS[_opRint(0, _VI_CAJITAS.length - 1)];
    const baul = [100, 60, 40];
    const cuantas = Math.floor(baul[0] / c[0]) * Math.floor(baul[1] / c[1]) * Math.floor(baul[2] / c[2]);
    items.push({ text: `En un baúl de 100 × 60 × 40 cm se guardan cajas de ${c[0]} × ${c[1]} × ${c[2]} cm. ¿Cuántas cajas caben, acomodadas en filas?`, ansNum: cuantas, just: `${Math.floor(baul[0] / c[0])} × ${Math.floor(baul[1] / c[1])} × ${Math.floor(baul[2] / c[2])}` }); }
  { const r = [20, 25, 30][_opRint(0, 2)], h = _opRint(6, 9) * 10;
    const v = _volCilindro(r, h);
    items.push({ text: `Un barril cilíndrico tiene ${r} cm de radio y ${h} cm de alto (π = 3.14). ¿Cuántos cm³ le caben?`, ansTxt: _volAcc(v), ansShow: _volFmt(v) + ' cm³', just: `3.14 × ${r * r} × ${h}` }); }
  return items;
}

// V. Retos de pensamiento crítico (5 + 5 + 10 = 20 pts): área confundida con volumen, la arista duplicada y el agua de la casa
const _RT_CONFUSION = [['un cubo de 5 cm de arista', 25, 125], ['un cubo de 3 cm de arista', 9, 27], ['un cubo de 6 cm de arista', 36, 216], ['un cubo de 4 cm de arista', 16, 64]];
const _RT_DOBLE = [2, 3, 4, 5];
const _RT_UNI = [[1, 'm³', 1000, 'litros'], [2, 'm³', 2000, 'litros'], [5, 'dm³', 5, 'litros'], [3, 'm³', 3000, 'litros']];
function genRetoItems() {
  const items = [];
  { const c = _RT_CONFUSION[_opRint(0, _RT_CONFUSION.length - 1)];
    items.push({ text: `Un compañero calculó el volumen de ${c[0]} y escribió ${c[1]}. Se quedó en el área de una cara. Escribe el volumen correcto, en cm³.`, ansNum: c[2], pts: 5 }); }
  { const a = _RT_DOBLE[_opRint(0, _RT_DOBLE.length - 1)];
    items.push({ text: `Un cubo de ${a} cm de arista tiene ${a * a * a} cm³. Si se duplica la arista, ¿cuántas veces mayor será el volumen? Escribe solo el número.`, ansNum: 8, pts: 5 }); }
  { const u = _RT_UNI[_opRint(0, _RT_UNI.length - 1)];
    items.push({ text: `Un tanque guarda ${u[0]} ${u[1]}. Una familia gasta 250 litros al día. ¿Para cuántos días completos le alcanza?`, ansNum: Math.floor(u[2] / 250), just: `${u[2]} litros ÷ 250`, ansShow: `${Math.floor(u[2] / 250)} días — ${u[2]} litros entre 250`, pts: 10 }); }
  return items;
}

function genEvalOp() {
  sfx('click');
  _injectFormaSel('genEvalOp', 'evalOpFormaSel', evalOpFormNum, function (v) { evalOpFormNum = v; });
  const _sO = document.getElementById('evalOpFormaSel');
  if (_sO && parseInt(_sO.value, 10)) evalOpFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sO.value, 10)));
  const cf = evalOpFormNum; window._currentEvalOpForm = cf; _opRnd = _evalRng(100000 + cf); /* la Forma cf siembra todo el azar de la prueba operativa */ evalOpFormNum = (evalOpFormNum % EVAL_FORMAS) + 1; _injectFormaSel('genEvalOp', 'evalOpFormaSel', evalOpFormNum, function (v) { evalOpFormNum = v; }); saveProgress();
  document.getElementById('evalop-screen-title').textContent = `📐 Prueba Operativa — Forma ${cf} · Volumen de Cuerpos`;
  evalOpAnsVisible = false;
  const out = document.getElementById('evalOpOut'); out.innerHTML = '';

  const mdItems = genMultDivItems();
  const s1 = document.createElement('div');
  s1.innerHTML = '<div class="eval-section-title">I. Calcula el volumen <span class="eval-pts">20 pts · 4 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel básico. Cubo: arista tres veces. Prisma: largo por ancho por alto. Cilindro: π por radio al cuadrado por altura.</p>';
  mdItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.text}</span><input class="eval-cp-input" type="text" data-md="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${it.ansShow || _fmtNum(it.ansNum)}</div><div class="eval-item-feedback" id="evalFbMd${i}" aria-live="polite"></div>`;
    s1.appendChild(d);
  });
  out.appendChild(s1);

  const rdItems = genRadarItems();
  const s2 = document.createElement('div');
  s2.innerHTML = '<div class="eval-section-title">II. Radar de unidades <span class="eval-pts">10 pts · 2 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel básico. Cada escalón de unidades cúbicas vale 1,000, y cada dm³ es un litro.</p>';
  rdItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.text}</span><input class="eval-cp-input" type="text" data-rd="${i}" autocomplete="off"></div><div class="eval-answer">${it.ansShow}</div><div class="eval-item-feedback" id="evalFbRd${i}" aria-live="polite"></div>`;
    s2.appendChild(d);
  });
  out.appendChild(s2);

  const rgItems = genReglaItems();
  const s3 = document.createElement('div');
  s3.innerHTML = '<div class="eval-section-title">III. ¿Qué medida se esconde en ▢? <span class="eval-pts">20 pts · 4 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel intermedio. Si conoces el volumen y dos medidas, la tercera sale dividiendo.</p>';
  rgItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.expr} <em style="font-size:0.85em;color:var(--gray);">(${it.hint})</em></span><input class="eval-cp-input" type="text" data-rg="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">▢ = ${it.ansShow || _fmtNum(it.ansNum)}</div><div class="eval-item-feedback" id="evalFbRg${i}" aria-live="polite"></div>`;
    s3.appendChild(d);
  });
  out.appendChild(s3);

  const viItems = genVidaItems();
  const s4 = document.createElement('div');
  s4.innerHTML = '<div class="eval-section-title">IV. Problemas de la vida real <span class="eval-pts">30 pts · 10 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel avanzado. Son medidas de verdad: pilas, baúles y barriles. Escribe la respuesta numérica.</p>';
  viItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.text}</span><input class="eval-cp-input" type="text" data-vi="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${it.ansShow || _fmtNum(it.ansNum)} — ${it.just}</div><div class="eval-item-feedback" id="evalFbVi${i}" aria-live="polite"></div>`;
    s4.appendChild(d);
  });
  out.appendChild(s4);

  const rtItems = genRetoItems();
  const s5 = document.createElement('div');
  s5.innerHTML = '<div class="eval-section-title">V. Retos de pensamiento crítico <span class="eval-pts">20 pts · 5 + 5 + 10</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel desafío. ¡No caigas en los Errores Comunes! Detecta, juzga y encuentra al intruso.</p>';
  rtItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.text} <em style="font-size:0.85em;color:var(--gray);">(${it.pts} pts)</em></span><input class="eval-cp-input" type="text" data-rt="${i}" autocomplete="off"${it.ansTxt ? '' : ' inputmode="numeric"'}></div><div class="eval-answer">${it.ansShow}</div><div class="eval-item-feedback" id="evalFbRt${i}" aria-live="polite"></div>`;
    s5.appendChild(d);
  });
  out.appendChild(s5);

  window._evalOpData = { mdItems, rdItems, rgItems, viItems, rtItems };
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
  let total = 0; const det = { md: 0, rd: 0, rg: 0, vi: 0, rt: 0 };
  const _mark = (sel, it, i, key, ptsEach, fbId) => {
    const el = document.querySelector(`[data-${sel}="${i}"]`);
    const p = ptsEach != null ? ptsEach : it.pts;
    const ok = it.ansTxt ? _isTxtMatch(el ? el.value : '', it.ansTxt) : _isIntMatch(el ? el.value : '', it.ansNum);
    if (el) { el.classList.toggle('eval-input-ok', ok); el.classList.toggle('eval-input-no', !ok); }
    if (ok) { det[key] += p; total += p; }
    setEvalFeedback(fbId + i, ok, ok ? `Correcto. +${p} pts` : 'Revisar. R/ ' + (it.ansShow || (it.ansTxt ? it.ansTxt[it.ansTxt.length - 1] : _fmtNum(it.ansNum))));
  };
  d.mdItems.forEach((it, i) => _mark('md', it, i, 'md', 4, 'evalFbMd'));
  d.rdItems.forEach((it, i) => _mark('rd', it, i, 'rd', 2, 'evalFbRd'));
  d.rgItems.forEach((it, i) => _mark('rg', it, i, 'rg', 4, 'evalFbRg'));
  d.viItems.forEach((it, i) => _mark('vi', it, i, 'vi', 10, 'evalFbVi'));
  d.rtItems.forEach((it, i) => _mark('rt', it, i, 'rt', null, 'evalFbRt'));
  const res = document.getElementById('evalOpAutoResult');
  if (res) { res.className = 'eval-auto-result ' + (total >= 70 ? 'eval-auto-pass' : 'eval-auto-risk'); res.innerHTML = `<strong>Resultado: ${total}/100 pts</strong><br><span>Volumen: ${det.md}/20 · Unidades: ${det.rd}/10 · Se esconde en ▢: ${det.rg}/20 · Vida real: ${det.vi}/30 · Retos: ${det.rt}/20</span>`; }
  if (total >= 70) { pts(8); showToast('🎯 Prueba operativa calificada: ' + total + '/100'); }
  else showToast('🧮 Prueba operativa: ' + total + '/100. Revisa los ítems marcados.');
}

function printEvalOp() {
  if (!window._evalOpData) { showToast('⚠️ Genera una prueba operativa primero'); return; }
  sfx('click');
  const forma = window._currentEvalOpForm || 1; const d = window._evalOpData;
  const _plano = (s) => s.replace(/<em[^>]*>/g, '').replace(/<\/em>/g, '');
  let s1 = `<div class="sec-title"><span>I. Calcula el volumen</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Nivel básico. Aplica la fórmula que toca y escribe la respuesta en la línea. 4 pts c/u.</p>`;
  d.mdItems.forEach((it, i) => { s1 += `<div class="opx-print-row"><span class="qn">${i+1}.</span><span class="prb-text">${it.text}</span><span class="opx-blank"></span></div>`; });
  const rdTbl = (items) => `<table class="rnd-tbl"><tr><th>#</th><th>Radar: unidades, litros y radio</th><th>Respuesta</th></tr>${items.map((it, i) => `<tr><td>${i+1}</td><td>${_plano(it.text)}</td><td></td></tr>`).join('')}</table>`;
  let s2 = `<div class="sec-title"><span>II. Radar de unidades</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10 pts</span></div></div><p class="opx-instr">Nivel básico. Recuerda: 1 m³ = 1,000 dm³ = 1,000 litros · el radio es la mitad del diámetro · suma de cifras · 5 → termina en 0 o 5 · 10 → termina en 0. 2 pts c/u.</p>${rdTbl(d.rdItems)}`;
  const rgTbl = (items) => `<table class="rnd-tbl"><tr><th>#</th><th>Operación</th><th>Pista</th><th>▢ =</th></tr>${items.map((it, i) => `<tr><td>${i+1}</td><td>${it.expr}</td><td>${it.hint}</td><td></td></tr>`).join('')}</table>`;
  let s3 = `<div class="sec-title"><span>III. ¿Qué medida se esconde en ▢?</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Nivel intermedio. Con el volumen y dos medidas, la tercera sale dividiendo. 4 pts c/u.</p>${rgTbl(d.rgItems)}`;
  let s4 = `<div class="sec-title"><span>IV. Problemas de la vida real</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 30 pts</span></div></div><p class="opx-instr">Nivel avanzado. Resuelve en el espacio mostrando tu procedimiento y escribe la respuesta. 10 pts c/u.</p>`;
  d.viItems.forEach((it, i) => { s4 += `<div class="opx-print-row"><span class="qn">${i+1}.</span><span class="prb-text">${it.text}</span><span class="opx-blank"></span></div><div class="opx-space"></div>`; });
  let s5 = `<div class="sec-title"><span>V. Retos de pensamiento crítico</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Nivel desafío. ¡Cuidado con los Errores Comunes! Valor: 5 + 5 + 10 pts.</p>`;
  d.rtItems.forEach((it, i) => { s5 += `<div class="opx-print-row"><span class="qn">${i+1}.</span><span class="prb-text">${_plano(it.text)} <strong>(${it.pts} pts)</strong></span><span class="opx-blank"></span></div>`; });
  let pR = '';
  pR += `<div class="p-sec"><div class="p-ttl">I. Calcula el volumen</div><table class="p-tbl">${d.mdItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${it.ansShow || _fmtNum(it.ansNum)}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">II. Radar de unidades</div><table class="p-tbl">${d.rdItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${it.ansShow}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">III. ¿Qué medida se esconde en ▢?</div><table class="p-tbl">${d.rgItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">▢ = ${it.ansShow || _fmtNum(it.ansNum)}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">IV. Problemas de la vida real</div><table class="p-tbl">${d.viItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${it.ansShow || _fmtNum(it.ansNum)} — ${it.just}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec" style="grid-column:1/-1;"><div class="p-ttl">V. Retos de pensamiento crítico</div><table class="p-tbl">${d.rtItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${it.ansShow} (${it.pts} pts)</td></tr>`).join('')}</table></div>`;
  const doc = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Prueba Operativa Volumen de Cuerpos · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11.5pt;color:#111;background:#fff;padding:4mm 6mm;}.ph{margin-bottom:0.5rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;color:#1565c0;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:#1565c0;margin-top:0.15rem;font-weight:700;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.45rem 0 0.2rem;border-left:4px solid #1565c0;background:#e3f2fd;display:flex;justify-content:space-between;align-items:center;color:#1565c0;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:#1565c0;font-weight:700;font-style:italic;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #1565c0;height:12px;}.qn{font-weight:700;min-width:20px;display:inline-block;color:#1565c0;flex-shrink:0;}.opx-instr{font-size:9pt;color:#555;margin-bottom:0.22rem;}.opx-blank{display:inline-block;width:80px;flex:none;border-bottom:1.5px solid #111;min-height:13px;margin-left:0.3rem;}.opx-print-row{display:flex;align-items:baseline;gap:0.4rem;font-size:10pt;padding:0.24rem 0.1rem;border-bottom:1px dotted #ddd;}.opx-space{height:26px;border-bottom:1px dotted #ccc;margin:0 0 2px 20px;}.prb-text{flex:1;line-height:1.35;}.rnd-tbl{width:100%;border-collapse:collapse;font-size:9.5pt;margin-top:0.15rem;}.rnd-tbl th,.rnd-tbl td{border:1px solid #bbb;padding:0.16rem 0.35rem;text-align:left;}.rnd-tbl th{background:#e3f2fd;color:#1565c0;font-size:8.5pt;}.total-row{display:flex;align-items:baseline;justify-content:flex-end;gap:7px;font-size:11pt;color:#1565c0;font-weight:700;font-style:italic;margin-top:0.45rem;padding:0.2rem 0.5rem;background:#e3f2fd;border-radius:4px;}.total-row .obt-line{min-width:80px;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #1565c0;padding-bottom:0.3rem;margin-bottom:0.5rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;color:#1565c0;}.p-sub{font-size:9pt;color:#1565c0;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #cce0ff;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;color:#1565c0;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#1565c0;}.pa{color:#007a00;font-weight:700;font-family:'Courier New',monospace;}.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:8mm 10mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Examen de Matemáticas — Prueba Operativa · Volumen de Cuerpos · Educación Básica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 pts · I: 20 · II: 10 · III: 20 · IV: 30 · V: 20 · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✔ PAUTA — Prueba Operativa · Volumen de Cuerpos · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">100 pts · Matemáticas · Educación Básica</div></div><div class="p-grid">${pR}</div></div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("evalPage",250,0.55,1.2);fit("pautaPage",250,0.55,1.2);})();<\/script></body></html>`;
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
  const msgs=['💡 ¡ÁNIMO! Comienza tu misión. ¡Cada paso cuenta!','🌱 ¡GRAN INICIO! Estás dando los primeros pasos.','🔑 ¡BUEN TRABAJO! Vas progresando muy bien.','💪 ¡MUY BIEN! Dominas gran parte del contenido.','🏅 ¡INCREÍBLE avance! Estás cerca de la excelencia.','🎓 ¡EXTRAORDINARIO! Completaste TODA la misión. ¡Eres experto en Volumen de Cuerpos!'];
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
  const txt=`${stars} CONSTANCIA DE LOGRO ${stars}\n\n📚 Misión: Volumen de Cuerpos\n👤 Estudiante: ${name}\n📊 Progreso: ${pct}% completado\n⭐ XP obtenido: ${xp} de ${MXP}${achText?'\n\n🏆 Logros desbloqueados:\n'+achText:''}\n\n${msg}\n\n📅 ${date}\n🏠 Proyecto Educativo M.E.T.A.S\n🌐 policastsapien.com`;
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
  _retoPairLbl();
  document.addEventListener('click',function(e){ const panel=document.getElementById('achPanel'); const btn=document.getElementById('achBtn'); if(panel.classList.contains('open')&&!panel.contains(e.target)&&e.target!==btn) panel.classList.remove('open'); });
  document.addEventListener('click',function(e){ if(e.target===document.getElementById('diplomaOverlay')) closeDiploma(); });
  const savedName=localStorage.getItem('nombreEstudianteMultiplosDivisores');
  const inputName=document.querySelector('.diploma-input');
  if(savedName&&inputName){ inputName.value=savedName; updateDiplomaName(savedName); }
  if(inputName) inputName.addEventListener('input',e=>localStorage.setItem('nombreEstudianteMultiplosDivisores',e.target.value));
  fin('s-aprende',false);
  fin('s-tipos',false);
  fin('s-errores',false);
});

// Formas deterministas v1: selectores de forma visibles desde la carga de la página
(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalOp==='function') _injectFormaSel('genEvalOp','evalOpFormaSel',evalOpFormNum,function(v){evalOpFormNum=v;}); }catch(e){} try{ if(typeof genEvalCrit==='function') _injectFormaSel('genEvalCrit','evalCritFormaSel',evalCritFormNum,function(v){evalCritFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();
