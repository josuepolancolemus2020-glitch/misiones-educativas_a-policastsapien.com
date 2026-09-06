// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
// Compartir misión por WhatsApp
function compartirMision() {
    const url = window.location.href;
    const texto = `🚀 *Misión Asignada: Sólidos Geométricos* 🚀\n\nReconoce prismas, pirámides, cilindros, conos y esferas, cuenta sus caras, aristas y vértices, y arma sus patrones. 🏆\n\nDesbloquea *todos los logros* y puedes poner *tus datos* para que tu maestro observe todos tus logros. 📋\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;
    _waShare(texto);
}

// ===================== ACCESIBILIDAD =====================
function toggleLetra() {
  document.body.classList.toggle('letra-grande');
  if(typeof sfx === 'function') sfx('click');
  localStorage.setItem('prefLetraSolidos', document.body.classList.contains('letra-grande'));
}
window.addEventListener('DOMContentLoaded', () => {
  if(localStorage.getItem('prefLetraSolidos') === 'true') document.body.classList.add('letra-grande');
});

// ===================== UTILIDADES =====================
const _pick = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
const _shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
function fb(id, msg, isOk) {
  const el = document.getElementById(id);
  if(el) { el.textContent = msg; el.className = 'fb show ' + (isOk ? 'ok' : 'err'); }
}
// Los sólidos y sus cuentas, en un solo sitio
/* Los sólidos con sus cuentas: caras, aristas y vértices salen de aquí y
   no de una lista escrita a mano, para que la relación de Euler cuadre
   siempre (C + V = A + 2, y los cuerpos redondos quedan fuera). */
const _SOL = {
  cubo:      { n:'cubo',                 c:6,  a:12, v:8,  poliedro:true,  base:'cuadrada',   emoji:'🧊', real:'un dado' },
  prismaR:   { n:'prisma rectangular',   c:6,  a:12, v:8,  poliedro:true,  base:'rectangular',emoji:'📦', real:'una caja de zapatos' },
  prismaT:   { n:'prisma triangular',    c:5,  a:9,  v:6,  poliedro:true,  base:'triangular', emoji:'⛺', real:'una tienda de campaña' },
  piramideC: { n:'pirámide cuadrangular',c:5,  a:8,  v:5,  poliedro:true,  base:'cuadrada',   emoji:'🔺', real:'un techo de cuatro aguas' },
  piramideT: { n:'pirámide triangular',  c:4,  a:6,  v:4,  poliedro:true,  base:'triangular', emoji:'📐', real:'un tetraedro de juego' },
  prismaP:   { n:'prisma pentagonal',    c:7,  a:15, v:10, poliedro:true,  base:'pentagonal', emoji:'🏛️', real:'un lápiz de cinco caras' },
  prismaH:   { n:'prisma hexagonal',     c:8,  a:18, v:12, poliedro:true,  base:'hexagonal',  emoji:'✏️', real:'un lápiz común' },
  cilindro:  { n:'cilindro',             c:3,  a:2,  v:0,  poliedro:false, base:'circular',   emoji:'🥫', real:'una lata de leche' },
  cono:      { n:'cono',                 c:2,  a:1,  v:1,  poliedro:false, base:'circular',   emoji:'🍦', real:'un barquillo de helado' },
  esfera:    { n:'esfera',               c:1,  a:0,  v:0,  poliedro:false, base:'ninguna',    emoji:'⚽', real:'una pelota' }
};
const _SOL_K = Object.keys(_SOL);
function _solPoliedros(){ return _SOL_K.filter(k => _SOL[k].poliedro); }
function _solNom(k){ return _SOL[k].n; }

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY = 'matematica_solidos_geometricos_v1';
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
  nivel3:{icon:'🔨',label:'¡Constructor alcanzado! Nivel 3'},
  nivel5:{icon:'🔥',label:'¡Campeón alcanzado! Nivel 6'}
};
function unlockAchievement(id){ if(unlockedAch.includes(id)) return; unlockedAch.push(id); sfx('ach'); showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label); launchConfetti(); renderAchPanel(); saveProgress(); }
function renderAchPanel(){ const list=document.getElementById('achList'); list.innerHTML=''; Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{ const div=document.createElement('div'); div.className='ach-item'+(unlockedAch.includes(id)?'':' locked'); div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`; list.appendChild(div); }); }
function toggleAchPanel(){ sfx('click'); document.getElementById('achPanel').classList.toggle('open'); }
function showToast(msg){ let t=document.querySelector('.toast'); if(!t){ t=document.createElement('div'); t.className='toast'; document.body.appendChild(t); } t.textContent=msg; t.style.display='block'; clearTimeout(t._tid); t._tid=setTimeout(()=>t.style.display='none',3200); }
function launchConfetti(){ const colors=['#1565c0','#00838f','#00b894','#fdcb6e','#6c5ce7']; for(let i=0;i<60;i++){ const c=document.createElement('div'); c.className='confetti-piece'; c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`; document.body.appendChild(c); c.addEventListener('animationend',()=>c.remove()); } }

// ===================== XP =====================
const lvls=[{t:0,n:'Novato ✏️'},{t:25,n:'Aprendiz 📦'},{t:55,n:'Constructor 🔨'},{t:90,n:'Arquitecto 📐'},{t:130,n:'Experto 🏗️'},{t:165,n:'Campeón 🏅'},{t:190,n:'Maestro 🎓'}];
function pts(n){ xp=Math.max(0,Math.min(MXP,xp+n)); updateXPBar(); saveProgress(); }
function updateXPBar(){ const pct=Math.round((xp/MXP)*100); document.getElementById('xpFill').style.width=pct+'%'; const el=document.getElementById('xpPts'); el.textContent='⭐ '+xp; el.style.transform='scale(1.3)'; setTimeout(()=>el.style.transform='',300); let lv=0; for(let i=0;i<lvls.length;i++) if(xp>=lvls[i].t) lv=i; document.getElementById('xpLvl').textContent=lvls[lv].n; if(lv!==prevLevel){ if(lv>=2) unlockAchievement('nivel3'); if(lv>=5) unlockAchievement('nivel5'); prevLevel=lv; } }
function resetXP(){ sfx('click'); xp=0; updateXPBar(); showToast('🔄 XP reiniciado a 0'); }
function fin(id,showFX=true){ if(!done.has(id)){ done.add(id); const b=document.querySelector(`[data-s="${id}"]`); if(b) b.classList.add('done'); if(showFX){ sfx('up'); launchConfetti(); } saveProgress(); } }

// ===================== NAV =====================
function go(id){ sfx('click'); document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active')); document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{ b.classList.remove('active'); b.setAttribute('aria-selected','false'); }); document.getElementById(id).classList.add('active'); const btn=document.querySelector(`[data-s="${id}"]`); if(btn){ btn.classList.add('active'); btn.setAttribute('aria-selected','true'); } window.scrollTo({top:0,behavior:'smooth'}); if(id==='s-sopa') setTimeout(buildSopa,50); }

// ===================== FLASHCARD DATA =====================
const fcData=[
  {w:'Sólido geométrico',a:'📦 cuerpo que ocupa lugar en el espacio: tiene largo, ancho y <strong>alto</strong>. Una hoja de papel es plana; una caja es un sólido.'},
  {w:'Cara',a:'🟦 cada una de las superficies planas que lo cierran. El cubo tiene <strong>6 caras</strong>, todas cuadradas.'},
  {w:'Arista',a:'📏 la línea donde <strong>se juntan dos caras</strong>. El cubo tiene 12 aristas: son los filos de la caja.'},
  {w:'Vértice',a:'📍 el punto donde <strong>se juntan varias aristas</strong>, la esquina. El cubo tiene 8 vértices.'},
  {w:'Poliedro',a:'🧊 sólido con <strong>todas las caras planas</strong>: prismas, pirámides y el cubo. El cilindro y la esfera no lo son.'},
  {w:'Cuerpo redondo',a:'⚽ sólido con alguna <strong>superficie curva</strong>: cilindro, cono y esfera. Se pueden rodar.'},
  {w:'Prisma',a:'📦 tiene <strong>dos bases iguales y paralelas</strong>, unidas por caras laterales. Toma el nombre de su base: triangular, pentagonal…'},
  {w:'Pirámide',a:'🔺 tiene <strong>una sola base</strong> y todas las caras laterales se juntan arriba, en un vértice llamado <strong>cúspide</strong>.'},
  {w:'Cilindro',a:'🥫 dos bases circulares iguales y una superficie curva alrededor. Como una lata: rueda de lado, pero se para en su base.'},
  {w:'Cono',a:'🍦 una base circular y una punta. Como el barquillo del helado o el sombrero de payaso.'},
  {w:'Esfera',a:'⚽ todos sus puntos están a la misma distancia del centro. No tiene caras planas, ni aristas, ni vértices.'},
  {w:'Patrón o desarrollo',a:'✂️ el sólido <strong>desdoblado y aplanado</strong>. Se recorta, se dobla por las líneas y se arma. Del cubo hay 11 patrones distintos que funcionan.'},
  {w:'Cuerpo por revolución',a:'🔄 el que sale al <strong>girar una figura plana</strong> alrededor de un eje: el rectángulo da un cilindro, el triángulo un cono y el semicírculo una esfera.'},
  {w:'La cuenta de Euler',a:'🧮 en todo poliedro, <strong>caras + vértices = aristas + 2</strong>. En el cubo: 6 + 8 = 12 + 2 ✔. Sirve para comprobar si contaste bien.'}
];
let fcIdx=0;
function upFC(){ document.getElementById('fcInner').classList.remove('flipped'); document.getElementById('fcW').textContent=fcData[fcIdx].w; document.getElementById('fcA').innerHTML=fcData[fcIdx].a; document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length; }
function flipCard(){ sfx('flip'); document.getElementById('fcInner').classList.toggle('flipped'); if(!xpTracker.fc.has(fcIdx)){ xpTracker.fc.add(fcIdx); pts(1); } if(xpTracker.fc.size===fcData.length){ fin('s-flash'); unlockAchievement('flash_master'); } }
function nextFC(){ sfx('click'); fcIdx=(fcIdx+1)%fcData.length; upFC(); }
function prevFC(){ sfx('click'); fcIdx=(fcIdx-1+fcData.length)%fcData.length; upFC(); }


// ===================== JUEGO: MEMORIA DE LOS NÚMEROS =====================
const memoPairs=[
  {id:'prisma',t:'Prisma',d:'📦 dos bases iguales, como una caja'},
  {id:'piramide',t:'Pirámide',d:'🔺 una base y una punta arriba'},
  {id:'arista',t:'Arista',d:'📏 el filo donde se juntan dos caras'},
  {id:'vertice',t:'Vértice',d:'📍 la esquina donde se juntan las aristas'},
  {id:'redondo',t:'Cuerpo redondo',d:'⚽ tiene superficie curva y rueda'},
  {id:'euler',t:'Cuenta de Euler',d:'🧮 caras + vértices = aristas + 2'}
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
  {q:'¿Cuántas caras tiene un cubo?',o:['a) 6','b) 8','c) 12','d) 4'],c:0},
  {q:'¿En qué se diferencia un prisma de una pirámide?',o:['a) El prisma es más grande','b) El prisma tiene dos bases y la pirámide una sola','c) La pirámide no tiene caras','d) El prisma siempre es de plástico'],c:1},
  {q:'¿Cuál de estos NO es un poliedro?',o:['a) El cubo','b) La pirámide triangular','c) El cilindro','d) El prisma hexagonal'],c:2},
  {q:'¿Cuántos vértices tiene una esfera?',o:['a) Uno','b) Dos','c) Infinitos','d) Ninguno'],c:3},
  {q:'Una lata de leche tiene la forma de un…',o:['a) cilindro','b) cono','c) prisma','d) esfera'],c:0},
  {q:'¿Qué figura plana, al girar sobre su eje, forma un cono?',o:['a) Un rectángulo','b) Un triángulo','c) Un círculo','d) Un cuadrado'],c:1},
  {q:'Un prisma triangular tiene 5 caras y 6 vértices. ¿Cuántas aristas tiene?',o:['a) 6','b) 12','c) 9','d) 5'],c:2},
  {q:'El patrón o desarrollo de un sólido sirve para…',o:['a) medir su peso','b) pintarlo de colores','c) calcular su edad','d) recortarlo y armarlo'],c:3},
  {q:'¿Cómo se llama la línea donde se juntan dos caras?',o:['a) Arista','b) Vértice','c) Base','d) Cúspide'],c:0},
  {q:'La pirámide cuadrangular tiene su base…',o:['a) triangular','b) cuadrada','c) circular','d) hexagonal'],c:1}
];
let qzIdx=0, qzSel=-1, qzDone=false;
function buildQz(){ qzIdx=0; qzSel=-1; qzDone=false; showQz(); }
function showQz(){var _fbQ=document.getElementById('fbQz');if(_fbQ)_fbQ.classList.remove('show');
  if(qzIdx>=qzData.length){ document.getElementById('qzQ').textContent='🎉 ¡Quiz completado!'; document.getElementById('qzOpts').innerHTML=''; fin('s-quiz'); unlockAchievement('primer_quiz'); return; }
  const q=qzData[qzIdx];
  document.getElementById('qzProg').textContent=`Pregunta ${qzIdx+1} de ${qzData.length}`;
  document.getElementById('qzQ').textContent=q.q;
  const opts=document.getElementById('qzOpts'); opts.innerHTML='';
  q.o.forEach((o,i)=>{ const b=document.createElement('button'); b.className='qz-opt'; b.textContent=o; b.onclick=()=>{ if(qzDone)return; document.querySelectorAll('.qz-opt').forEach(x=>x.classList.remove('sel')); b.classList.add('sel'); qzSel=i; sfx('click'); }; opts.appendChild(b); });
  qzDone=false;
}
// El quiz ya NO avanza solo a los 1,6 s. Con el avance automático, el alumno que
// fallaba veía la respuesta correcta medio segundo y desaparecía antes de poder
// leerla; y el «Incorrecto» se quedaba colgado debajo de la pregunta SIGUIENTE,
// que todavía no había contestado. Ahora avanza él, cuando ya la leyó.
function nextQz(){
  if(!qzDone)return fb('fbQz','Primero toca «Verificar».',false);
  qzIdx++; qzSel=-1; qzDone=false; showQz();
}
function checkQz(){
  if(qzSel<0) return fb('fbQz','Selecciona una respuesta.',false);
  qzDone=true;
  const opts=document.querySelectorAll('.qz-opt');
  if(qzSel===qzData[qzIdx].c){ opts[qzSel].classList.add('correct'); fb('fbQz','¡Correcto! +5 XP',true); if(!xpTracker.qz.has(qzIdx)){ xpTracker.qz.add(qzIdx); pts(5); } sfx('ok');  }
  else{ opts[qzSel].classList.add('wrong'); opts[qzData[qzIdx].c].classList.add('correct'); const _fbMsg=qzData[qzIdx].feedback||'Incorrecto. Revisa la respuesta correcta.'; fb('fbQz',_fbMsg,false); sfx('no'); }
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
    label:['Poliedro','Cuerpo redondo'], headA:'🧊 Todas las caras planas', headB:'⚽ Tiene superficie curva',
    colA:'pol', colB:'red',
    words:[{w:'cubo',t:'pol'},{w:'esfera',t:'red'},{w:'prisma triangular',t:'pol'},{w:'cilindro',t:'red'},
           {w:'pirámide cuadrangular',t:'pol'},{w:'cono',t:'red'},{w:'prisma hexagonal',t:'pol'},{w:'pelota',t:'red'}]
  },
  {
    label:['Prisma','Pirámide'], headA:'📦 Dos bases iguales', headB:'🔺 Una base y una punta',
    colA:'pri', colB:'pir',
    words:[{w:'caja de zapatos',t:'pri'},{w:'techo de cuatro aguas',t:'pir'},{w:'lápiz hexagonal',t:'pri'},{w:'pirámide maya',t:'pir'},
           {w:'tienda de campaña',t:'pri'},{w:'tetraedro',t:'pir'},{w:'cubo',t:'pri'},{w:'gorro de cumpleaños con base cuadrada',t:'pir'}]
  },
  {
    label:['Rueda','No rueda'], headA:'🔄 Puede rodar', headB:'🛑 Se queda quieto',
    colA:'rueda', colB:'quieto',
    words:[{w:'esfera',t:'rueda'},{w:'cubo',t:'quieto'},{w:'cilindro',t:'rueda'},{w:'prisma rectangular',t:'quieto'},
           {w:'cono',t:'rueda'},{w:'pirámide',t:'quieto'},{w:'lata',t:'rueda'},{w:'caja',t:'quieto'}]
  },
  {
    label:['Tiene vértices','No tiene vértices'], headA:'📍 Con esquinas', headB:'🚫 Sin ninguna esquina',
    colA:'con', colB:'sin',
    words:[{w:'cubo',t:'con'},{w:'esfera',t:'sin'},{w:'pirámide triangular',t:'con'},{w:'cilindro',t:'sin'},
           {w:'prisma pentagonal',t:'con'},{w:'pelota de fútbol lisa',t:'sin'},{w:'cono',t:'con'},{w:'lata de leche',t:'sin'}]
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
  {s:['El','cubo','tiene','6','caras'],c:3,art:'Toca cuántas caras tiene'},
  {s:['La','arista','es','donde','se','juntan','dos','caras'],c:1,art:'Toca la palabra que nombra el filo'},
  {s:['El','cilindro','no','es','poliedro'],c:1,art:'Toca el cuerpo redondo'},
  {s:['La','pirámide','tiene','una','sola','base'],c:1,art:'Toca el sólido que tiene una sola base'},
  {s:['Un','triángulo','girando','forma','un','cono'],c:1,art:'Toca la figura plana que gira'},
  {s:['6','+','8','=','12','+','2'],c:4,art:'En la cuenta de Euler, toca el número de aristas'},
  {s:['La','esfera','no','tiene','aristas'],c:1,art:'Toca el sólido sin aristas'},
  {s:['El','patrón','se','recorta','y','se','dobla'],c:1,art:'Toca la palabra que nombra el sólido aplanado'}
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
  {s:'La línea donde se juntan dos caras se llama ___.',opts:['arista','vértice','base'],c:0},
  {s:'El sólido que tiene dos bases iguales y paralelas es el ___.',opts:['cono','prisma','esfera'],c:1},
  {s:'Un sólido con todas las caras planas se llama ___.',opts:['cuerpo redondo','cilindro','poliedro'],c:2},
  {s:'El cubo tiene 6 caras, 12 aristas y ___ vértices.',opts:['8','6','12'],c:0},
  {s:'Al girar un rectángulo sobre su eje se forma un ___.',opts:['cono','cilindro','cubo'],c:1},
  {s:'La esfera no tiene caras planas ni aristas ni ___.',opts:['color','tamaño','vértices'],c:2},
  {s:'El sólido desdoblado y aplanado para recortarlo se llama ___.',opts:['patrón','vértice','arista'],c:0},
  {s:'En todo poliedro, caras más vértices es igual a aristas más ___.',opts:['uno','dos','tres'],c:1}
];
let cmpIdx=0, cmpSel=-1, cmpDone=false;
function showCmp(){var _fbC=document.getElementById('fbCmp');if(_fbC)_fbC.classList.remove('show');
  if(cmpIdx>=cmpData.length){ document.getElementById('cmpSent').innerHTML='🎉 ¡Completado!'; document.getElementById('cmpOpts').innerHTML=''; fin('s-completa'); return; }
  const d=cmpData[cmpIdx];
  document.getElementById('cmpProg').textContent=`Oración ${cmpIdx+1} de ${cmpData.length}`;
  document.getElementById('cmpSent').innerHTML=d.s.replace('___','<span class="blank">___</span>');
  const opts=document.getElementById('cmpOpts'); opts.innerHTML=''; cmpSel=-1; cmpDone=false;
  d.opts.forEach((o,i)=>{ const b=document.createElement('button'); b.className='cmp-opt'; b.textContent=o; b.onclick=()=>{ if(cmpDone)return; document.querySelectorAll('.cmp-opt').forEach(x=>x.classList.remove('sel')); b.classList.add('sel'); cmpSel=i; sfx('click'); }; opts.appendChild(b); });
}
// Misma razón que en el quiz: la corrección se lee, no se persigue.
function nextCmp(){
  if(!cmpDone)return fb('fbCmp','Primero toca «Verificar».',false);
  cmpIdx++; cmpSel=-1; cmpDone=false; showCmp();
}
function checkCmp(){
  if(cmpSel<0) return fb('fbCmp','Selecciona una opción.',false);
  cmpDone=true;
  const opts=document.querySelectorAll('.cmp-opt');
  if(cmpSel===cmpData[cmpIdx].c){ opts[cmpSel].classList.add('correct'); document.getElementById('cmpSent').innerHTML=cmpData[cmpIdx].s.replace('___',`<span class="blank" style="color:var(--jade);border-color:var(--jade)">${opts[cmpSel].textContent}</span>`); fb('fbCmp','¡Correcto! +5 XP',true); if(!xpTracker.cmp.has(cmpIdx)){ xpTracker.cmp.add(cmpIdx); pts(5); } sfx('ok'); }
  else{ opts[cmpSel].classList.add('wrong'); opts[cmpData[cmpIdx].c].classList.add('correct'); fb('fbCmp','Incorrecto. Revisa bien la respuesta.',false); sfx('no'); }
  
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
    q: 'Una caja de zapatos y un dado: ¿tienen el mismo número de caras?',
    opts: ['Sí, las dos tienen 6', 'No, el dado tiene menos', 'No, la caja tiene más'],
    correct: 0,
    feedback: '¡Correcto! Las dos son prismas rectangulares: 6 caras, 12 aristas y 8 vértices. El dado además las tiene todas cuadradas.',
    wrongFeedback: 'Sí tienen las mismas: las dos son prismas rectangulares, con 6 caras, 12 aristas y 8 vértices. Lo que cambia es la forma de las caras.',
    explore: 'contar'
  },
  {
    q: '¿Qué sale si giras un triángulo rectángulo alrededor de uno de sus lados?',
    opts: ['Un cilindro', 'Un cono', 'Una esfera'],
    correct: 1,
    feedback: '¡Exacto! El triángulo girando barre un cono. Por eso el cono es un cuerpo de revolución.',
    wrongFeedback: 'Sale un cono. El rectángulo da el cilindro y el semicírculo la esfera; el triángulo da el cono.',
    explore: 'girar'
  },
  {
    q: 'Esta cruz de 6 cuadrados, ¿se puede doblar para formar un cubo?',
    opts: ['Sí, siempre que sean 6 cuadrados', 'Solo si están colocados de cierta forma', 'No, nunca'],
    correct: 1,
    feedback: '¡Muy bien! Hacen falta 6 cuadrados Y bien colocados: de las muchas formas posibles, solo 11 arman un cubo.',
    wrongFeedback: 'La respuesta es: solo si están bien colocados. Con 6 cuadrados hay muchos patrones, pero solo 11 se doblan y forman un cubo.',
    explore: 'patron'
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
  if(type==='contar'){
    box.innerHTML=`<p class="pd-tip">Toca cada parte del cubo y cuéntala:</p><div class="pd-line" id="pd-line-${i}"></div><div class="pd-msg" id="pd-msg-${i}">👆 toca caras, aristas o vértices</div>`;
    const line=document.getElementById('pd-line-'+i);
    [['🟦 caras','6','las superficies planas que lo cierran'],['📏 aristas','12','los filos donde se juntan dos caras'],['📍 vértices','8','las esquinas donde se juntan las aristas']].forEach(op=>{
      const t=_pdTick(op[0]);
      t.onclick=()=>{ sfx('click'); line.querySelectorAll('.pd-tick').forEach(x=>x.classList.remove('pd-on','pd-win'));
        t.classList.add('pd-win');
        document.getElementById('pd-msg-'+i).innerHTML=`El cubo tiene <strong>${op[1]}</strong> ${op[0].split(' ')[1]}: ${op[2]}. Una caja de zapatos tiene exactamente lo mismo.`; };
      line.appendChild(t);
    });
  } else if(type==='girar'){
    box.innerHTML=`<p class="pd-tip">Haz girar cada figura plana sobre su eje y mira qué sólido barre:</p><div style="display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;margin:0.5rem 0;"><button class="btn btn-pri" onclick="predGirar(${i},'rect')">▭ rectángulo</button><button class="btn btn-pri" onclick="predGirar(${i},'tri')">◺ triángulo</button><button class="btn btn-pri" onclick="predGirar(${i},'semi')">◗ semicírculo</button></div><div class="pd-cnt" id="pd-cnt-${i}" style="font-size:2.4rem;text-align:center;min-height:2.6rem;"></div><div class="pd-msg" id="pd-msg-${i}">👆 gira una figura</div>`;
  } else if(type==='patron'){
    box.innerHTML=`<p class="pd-tip">Prueba a doblar cada patrón de seis cuadrados:</p><div style="display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;margin:0.5rem 0;"><button class="btn btn-pri" onclick="predPatron(${i},'cruz')">✚ en cruz</button><button class="btn btn-pri" onclick="predPatron(${i},'fila')">▬ los seis en fila</button><button class="btn btn-pri" onclick="predPatron(${i},'T')">⊤ en forma de T</button></div><div class="pd-msg" id="pd-msg-${i}">👆 prueba un patrón</div>`;
  }
}
/* Girar la figura es lo que el currículo llama «obtener cuerpos por
   revolución»: sin verlo girar, el alumno se aprende la lista de memoria. */
function predGirar(i,fig){
  sfx('click');
  const cnt=document.getElementById('pd-cnt-'+i), msg=document.getElementById('pd-msg-'+i);
  const mapa={rect:['🥫','un cilindro','el rectángulo barre un tubo con dos tapas circulares'],
              tri:['🍦','un cono','el triángulo barre una punta sobre una base circular'],
              semi:['⚽','una esfera','el semicírculo barre una pelota perfecta']};
  const r=mapa[fig];
  cnt.textContent=r[0];
  msg.innerHTML=`🔄 Sale <strong>${r[1]}</strong>: ${r[2]}.`;
  if(fig==='tri') sfx('ok');
}
function predPatron(i,p){
  sfx('click');
  const msg=document.getElementById('pd-msg-'+i);
  if(p==='cruz'){ msg.innerHTML='✅ La cruz sí cierra: cuatro cuadrados dan la vuelta y los otros dos tapan arriba y abajo. Es uno de los <strong>11 patrones</strong> que arman un cubo.'; sfx('ok'); }
  else if(p==='fila'){ msg.innerHTML='❌ En fila no cierra: al doblar, los cuadrados se montan unos con otros y no quedan tapas. Con seis cuadrados no basta: hay que colocarlos bien.'; }
  else{ msg.innerHTML='✅ La T también cierra, y no se parece nada a la cruz. Por eso son <strong>11 patrones distintos</strong> y no uno solo.'; sfx('ok'); }
}

// ===================== RETO FINAL (con parejas variables) =====================
const retoPairs=[
  {
    name:'Cuenta caras 🟦', hint:'Cuenta las caras del sólido A y compara con B',
    pool:[
      {w:'A: caras del cubo vs B: 6',t:'igual'},{w:'A: caras del cono vs B: 4',t:'menor'},{w:'A: caras del prisma hexagonal vs B: 6',t:'mayor'},
      {w:'A: caras del prisma triangular vs B: 5',t:'igual'},{w:'A: caras de la esfera vs B: 3',t:'menor'},{w:'A: caras del prisma pentagonal vs B: 5',t:'mayor'},
      {w:'A: caras de la pirámide cuadrangular vs B: 5',t:'igual'},{w:'A: caras del cilindro vs B: 6',t:'menor'},{w:'A: caras del cubo vs B: 4',t:'mayor'},
      {w:'A: caras de la pirámide triangular vs B: 4',t:'igual'},{w:'A: caras del cono vs B: 5',t:'menor'},{w:'A: caras del prisma rectangular vs B: 5',t:'mayor'}
    ]
  },
  {
    name:'Cuenta aristas 📏', hint:'Cuenta las aristas del sólido A y compara con B',
    pool:[
      {w:'A: aristas del cubo vs B: 12',t:'igual'},{w:'A: aristas del cono vs B: 4',t:'menor'},{w:'A: aristas del prisma hexagonal vs B: 12',t:'mayor'},
      {w:'A: aristas del prisma triangular vs B: 9',t:'igual'},{w:'A: aristas de la esfera vs B: 2',t:'menor'},{w:'A: aristas del prisma pentagonal vs B: 12',t:'mayor'},
      {w:'A: aristas de la pirámide cuadrangular vs B: 8',t:'igual'},{w:'A: aristas del cilindro vs B: 6',t:'menor'},{w:'A: aristas del cubo vs B: 8',t:'mayor'},
      {w:'A: aristas de la pirámide triangular vs B: 6',t:'igual'},{w:'A: aristas del cono vs B: 3',t:'menor'},{w:'A: aristas del prisma rectangular vs B: 10',t:'mayor'}
    ]
  },
  {
    name:'Cuenta vértices 📍', hint:'Cuenta los vértices del sólido A y compara con B',
    pool:[
      {w:'A: vértices del cubo vs B: 8',t:'igual'},{w:'A: vértices de la esfera vs B: 2',t:'menor'},{w:'A: vértices del prisma hexagonal vs B: 8',t:'mayor'},
      {w:'A: vértices del prisma triangular vs B: 6',t:'igual'},{w:'A: vértices del cilindro vs B: 4',t:'menor'},{w:'A: vértices del prisma pentagonal vs B: 8',t:'mayor'},
      {w:'A: vértices de la pirámide cuadrangular vs B: 5',t:'igual'},{w:'A: vértices del cono vs B: 3',t:'menor'},{w:'A: vértices del cubo vs B: 6',t:'mayor'},
      {w:'A: vértices de la pirámide triangular vs B: 4',t:'igual'},{w:'A: vértices de la esfera vs B: 1',t:'menor'},{w:'A: vértices del prisma rectangular vs B: 6',t:'mayor'}
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
  {q:'¿Por qué una caja de cartón se puede desdoblar y una pelota no?',a:'La caja es un poliedro: sus caras son planas y se pueden aplanar. La esfera tiene superficie curva y no hay forma de estirarla sin romperla.'},
  {q:'Un poliedro tiene 8 caras y 18 aristas. ¿Cuántos vértices tiene? Usa la cuenta de Euler.',a:'C + V = A + 2 → 8 + V = 20 → V = 12. Es un prisma hexagonal.'},
  {q:'Nombra tres objetos de tu casa con forma de cilindro y di qué tienen en común.',a:'Lata, vaso, rollo de papel: todos tienen dos bases circulares iguales y ruedan de lado.'},
  {q:'¿Puede un prisma tener las caras laterales triangulares? Explica.',a:'No. Las caras laterales de un prisma son rectángulos; las triangulares son de la pirámide.'},
  {q:'Si duplicas el número de lados de la base de un prisma, ¿qué pasa con el número de caras?',a:'Aumentan lo mismo: un prisma de base de n lados tiene n + 2 caras, así que al duplicar n, las caras laterales se duplican.'},
  {q:'¿Cuántos patrones distintos arman un cubo? ¿Por qué no sirven todos los grupos de seis cuadrados?',a:'Son 11. No sirven todos porque al doblar, algunos cuadrados se montan y otros dejan huecos sin tapa.'},
  {q:'Explica cómo harías un cono de papel para una fiesta, partiendo de un círculo.',a:'Se recorta un círculo, se le quita un sector y se pegan los dos bordes: la parte curva se vuelve la base y el centro, la punta.'},
  {q:'¿Qué sólido tiene más aristas: el prisma pentagonal o la pirámide hexagonal? Cuenta y compara.',a:'El prisma pentagonal tiene 15 y la pirámide hexagonal 12: gana el prisma.'}
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
function genTask(){ sfx('click'); const type=document.getElementById('tgType').value; const count=parseInt(document.getElementById('tgCount').value); ansVisible=false; const out=document.getElementById('tgOut'); out.innerHTML=''; if(type==='contar') genContarTask(out,count); else if(type==='euler') genEulerTask(out,count); else if(type==='clasifica') genClasificaTask(out,count); else if(type==='objeto') genObjetoTask(out,count); else if(type==='revolucion') genRevolucionTask(out,count); else if(type==='pensamiento') genPensamientoTask(out,count); fin('s-tareas'); }
function _instrBlock(out,title,lines){ const ib=document.createElement('div'); ib.className='tg-instruction-block'; ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join(''); out.appendChild(ib); }
// 🟦 Contar caras, aristas y vértices (aleatorio: nunca se repite)
function genContarTask(out,count){
  _instrBlock(out,'🟦 Cuenta caras, aristas y vértices',['Escribe los tres números del sólido que se pide.','Comprueba con la cuenta de Euler: caras + vértices = aristas + 2.']);
  const ks=_solPoliedros();
  for(let i=0;i<count;i++){
    const k=ks[_tgRint(0,ks.length-1)], s=_SOL[k];
    _tgTask(out,i,`<div class="tg-op">${s.emoji} ${s.n}: caras ____ · aristas ____ · vértices ____</div><div class="tg-answer" style="display:${ansVisible?'block':'none'}">R/ ${s.c} caras, ${s.a} aristas, ${s.v} vértices</div>`);
  }
}
// 🧮 La cuenta de Euler: encontrar el dato que falta
function genEulerTask(out,count){
  _instrBlock(out,'🧮 La cuenta de Euler',['En todo poliedro: caras + vértices = aristas + 2.','Encuentra el dato que falta.']);
  const ks=_solPoliedros();
  for(let i=0;i<count;i++){
    const k=ks[_tgRint(0,ks.length-1)], s=_SOL[k], falta=_tgRint(0,2);
    const txt = falta===0 ? `____ caras · ${s.a} aristas · ${s.v} vértices`
              : falta===1 ? `${s.c} caras · ____ aristas · ${s.v} vértices`
                          : `${s.c} caras · ${s.a} aristas · ____ vértices`;
    const r = falta===0 ? s.c : falta===1 ? s.a : s.v;
    _tgTask(out,i,`<div class="tg-op">${txt}</div><div class="tg-answer" style="display:${ansVisible?'block':'none'}">R/ ${r} (es ${s.n})</div>`);
  }
}
// 🧊 Poliedro o cuerpo redondo
function genClasificaTask(out,count){
  _instrBlock(out,'🧊 ¿Poliedro o cuerpo redondo?',['Escribe a qué grupo pertenece cada sólido.','Recuerda: poliedro es el que tiene TODAS las caras planas.']);
  for(let i=0;i<count;i++){
    const k=_SOL_K[_tgRint(0,_SOL_K.length-1)], s=_SOL[k];
    _tgTask(out,i,`<div class="tg-op">${s.emoji} ${s.n} → ____________</div><div class="tg-answer" style="display:${ansVisible?'block':'none'}">R/ ${s.poliedro?'poliedro':'cuerpo redondo'}</div>`);
  }
}
// 🏠 Objetos de la casa y su forma
function genObjetoTask(out,count){
  _instrBlock(out,'🏠 Objetos de la casa',['Escribe qué sólido geométrico tiene la forma del objeto.','Piensa en sus bases y en si rueda o no.']);
  for(let i=0;i<count;i++){
    const k=_SOL_K[_tgRint(0,_SOL_K.length-1)], s=_SOL[k];
    _tgTask(out,i,`<div class="tg-op">${s.real} → ____________</div><div class="tg-answer" style="display:${ansVisible?'block':'none'}">R/ ${s.n}</div>`);
  }
}
// 🔄 Cuerpos por revolución
function genRevolucionTask(out,count){
  _instrBlock(out,'🔄 Cuerpos por revolución',['Escribe qué sólido sale al girar la figura plana sobre su eje.']);
  const casos=[['un rectángulo','cilindro'],['un triángulo rectángulo','cono'],['un semicírculo','esfera'],['un cuadrado','cilindro']];
  for(let i=0;i<count;i++){
    const c=casos[_tgRint(0,casos.length-1)];
    _tgTask(out,i,`<div class="tg-op">Gira ${c[0]} sobre su eje → ____________</div><div class="tg-answer" style="display:${ansVisible?'block':'none'}">R/ ${c[1]}</div>`);
  }
}
function toggleAns(){ ansVisible=!ansVisible; document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none'); sfx('click'); }

// ===================== SOPA DE LETRAS (multidireccional, con inversas) =====================
const sopaSets=[
  {
    size:10,
    grid:[
      ['N','A','G','P','Z','D','E','F','Z','O'],
      ['V','D','A','I','C','H','P','S','C','A'],
      ['O','C','O','R','D','N','I','L','I','C'],
      ['R','L','L','A','I','A','O','H','S','N'],
      ['D','U','E','M','P','S','H','N','V','C'],
      ['E','O','F','I','C','Z','T','B','O','Z'],
      ['I','R','U','D','H','R','O','A','T','C'],
      ['L','Z','D','E','L','S','Z','S','H','S'],
      ['O','E','Z','P','R','I','S','M','A','L'],
      ['P','S','R','N','P','H','V','B','D','C']
    ],
    words:[
      {w:'PIRAMIDE',cells:[[0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3]]},
      {w:'CILINDRO',cells:[[2,9],[2,8],[2,7],[2,6],[2,5],[2,4],[2,3],[2,2]]},
      {w:'POLIEDRO',cells:[[9,0],[8,0],[7,0],[6,0],[5,0],[4,0],[3,0],[2,0]]},
      {w:'ARISTA',cells:[[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]},
      {w:'PRISMA',cells:[[8,3],[8,4],[8,5],[8,6],[8,7],[8,8]]},
      {w:'CONO',cells:[[6,9],[5,8],[4,7],[3,6]]}
    ]
  },
  {
    size:10,
    grid:[
      ['C','V','E','R','T','I','C','E','B','E'],
      ['I','B','U','L','E','O','B','G','V','B'],
      ['S','N','A','T','O','B','U','C','T','M'],
      ['A','O','N','S','C','S','H','Z','M','T'],
      ['V','R','T','H','H','A','B','O','O','V'],
      ['N','T','E','G','T','A','R','E','Z','N'],
      ['N','A','E','F','S','Z','H','A','A','S'],
      ['A','P','E','E','S','D','A','V','F','M'],
      ['P','H','J','R','O','E','C','M','P','F'],
      ['N','L','E','C','T','G','E','V','I','S']
    ],
    words:[
      {w:'VERTICE',cells:[[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7]]},
      {w:'ESFERA',cells:[[8,5],[7,4],[6,3],[5,2],[4,1],[3,0]]},
      {w:'PATRON',cells:[[7,1],[6,1],[5,1],[4,1],[3,1],[2,1]]},
      {w:'CUBO',cells:[[2,7],[2,6],[2,5],[2,4]]},
      {w:'CARA',cells:[[3,4],[4,5],[5,6],[6,7]]},
      {w:'BASE',cells:[[4,6],[5,5],[6,4],[7,3]]},
      {w:'EJE',cells:[[7,2],[8,2],[9,2]]}
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
  {q:'El cubo tiene 6 caras, 12 aristas y 8 vértices.',a:true},
  {q:'El cilindro es un poliedro.',a:false},
  {q:'La arista es la línea donde se juntan dos caras.',a:true},
  {q:'La pirámide tiene dos bases iguales y paralelas.',a:false},
  {q:'La esfera no tiene caras planas, ni aristas, ni vértices.',a:true},
  {q:'Un prisma toma el nombre de la figura de su base.',a:true},
  {q:'El cono tiene una base circular y una punta.',a:true},
  {q:'Todos los cuerpos redondos pueden rodar.',a:true},
  {q:'Cualquier grupo de seis cuadrados, doblado, forma un cubo.',a:false},
  {q:'Al girar un rectángulo sobre su eje se obtiene un cilindro.',a:true},
  {q:'El prisma triangular tiene 5 caras.',a:true},
  {q:'En todo poliedro, caras más vértices es igual a aristas más dos.',a:true},
  {q:'La pirámide cuadrangular tiene 4 caras en total.',a:false},
  {q:'El vértice es el punto donde se juntan varias aristas.',a:true},
  {q:'Un cuadrado y un cubo son lo mismo.',a:false}
];
const evalMCBank=[
  {q:'¿Cuántas aristas tiene un cubo?',o:['a) 12','b) 8','c) 6','d) 4'],a:0},
  {q:'¿Cuál de estos es un cuerpo redondo?',o:['a) El prisma hexagonal','b) La esfera','c) La pirámide','d) El cubo'],a:1},
  {q:'La pirámide cuadrangular tiene…',o:['a) 4 caras y 4 vértices','b) 6 caras y 8 vértices','c) 5 caras y 5 vértices','d) 8 caras y 12 vértices'],a:2},
  {q:'¿Qué figura plana girando forma una esfera?',o:['a) Un rectángulo','b) Un triángulo','c) Un cuadrado','d) Un semicírculo'],a:3},
  {q:'Un lápiz común, sin punta, tiene forma de…',o:['a) prisma hexagonal','b) cilindro','c) cono','d) pirámide'],a:0},
  {q:'¿Cuántas caras tiene el prisma pentagonal?',o:['a) 5','b) 7','c) 10','d) 15'],a:1},
  {q:'La diferencia principal entre prisma y pirámide es…',o:['a) el color','b) el material','c) el número de bases','d) el tamaño'],a:2},
  {q:'Un poliedro tiene 6 caras y 12 aristas. Según la cuenta de Euler, ¿cuántos vértices tiene?',o:['a) 6','b) 12','c) 4','d) 8'],a:3},
  {q:'El barquillo del helado tiene forma de…',o:['a) cono','b) cilindro','c) pirámide','d) esfera'],a:0},
  {q:'¿Cuántos vértices tiene el cilindro?',o:['a) Dos','b) Ninguno','c) Cuatro','d) Uno'],a:1},
  {q:'El patrón o desarrollo de un sólido es…',o:['a) su peso en gramos','b) el color de sus caras','c) el sólido desdoblado y aplanado','d) la suma de sus aristas'],a:2},
  {q:'¿Cuál de estos sólidos NO rueda?',o:['a) La esfera','b) El cilindro','c) El cono','d) El prisma rectangular'],a:3},
  {q:'El prisma triangular tiene 5 caras y 9 aristas. ¿Cuántos vértices tiene?',o:['a) 6','b) 5','c) 9','d) 3'],a:0},
  {q:'La cúspide es…',o:['a) la base de un prisma','b) el vértice donde se juntan las caras de una pirámide','c) una cara curva','d) el filo del cubo'],a:1},
  {q:'Una tienda de campaña con dos bases triangulares tiene forma de…',o:['a) pirámide','b) cono','c) prisma triangular','d) cilindro'],a:2}
];
const evalCPBank=[
  {q:'La línea donde se juntan dos caras se llama ___.',a:'arista'},
  {q:'El punto donde se juntan varias aristas se llama ___.',a:'vértice'},
  {q:'Un sólido con todas las caras planas se llama ___.',a:'poliedro'},
  {q:'El cubo tiene ___ caras.',a:'6'},
  {q:'El cubo tiene ___ aristas.',a:'12'},
  {q:'El cubo tiene ___ vértices.',a:'8'},
  {q:'El sólido que tiene dos bases iguales y paralelas es el ___.',a:'prisma'},
  {q:'El sólido que tiene una sola base y una punta es la ___.',a:'pirámide'},
  {q:'Al girar un triángulo sobre su eje se forma un ___.',a:'cono'},
  {q:'Al girar un rectángulo sobre su eje se forma un ___.',a:'cilindro'},
  {q:'El sólido que no tiene caras planas ni aristas ni vértices es la ___.',a:'esfera'},
  {q:'El sólido desdoblado y aplanado para recortarlo se llama ___.',a:'patrón'},
  {q:'En todo poliedro, caras más vértices es igual a aristas más ___.',a:'2'},
  {q:'El prisma triangular tiene ___ caras.',a:'5'},
  {q:'Una lata de leche tiene forma de ___.',a:'cilindro'}
];
const evalPRBank=[
  {term:'Cara',def:'Cada superficie plana que cierra el sólido'},
  {term:'Arista',def:'La línea donde se juntan dos caras'},
  {term:'Vértice',def:'El punto donde se juntan varias aristas'},
  {term:'Poliedro',def:'Sólido con todas las caras planas'},
  {term:'Cuerpo redondo',def:'Sólido con alguna superficie curva'},
  {term:'Prisma',def:'Tiene dos bases iguales y paralelas'},
  {term:'Pirámide',def:'Tiene una sola base y una cúspide'},
  {term:'Cilindro',def:'Dos bases circulares y una superficie curva'},
  {term:'Cono',def:'Una base circular y una punta'},
  {term:'Esfera',def:'Todos sus puntos a la misma distancia del centro'},
  {term:'Cúspide',def:'El vértice superior de una pirámide'},
  {term:'Patrón',def:'El sólido desdoblado para recortarlo y armarlo'},
  {term:'Cuerpo de revolución',def:'El que se forma al girar una figura plana'},
  {term:'Cuenta de Euler',def:'Caras más vértices igual a aristas más dos'},
  {term:'Cubo',def:'Prisma con sus seis caras cuadradas'}
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación Sólidos Geométricos · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:12pt;color:#111;background:#fff;padding:4mm 6mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.5rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;color:#1565c0;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:#1565c0;margin-top:0.15rem;font-weight:700;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.5rem 0 0.25rem;border-left:4px solid #1565c0;background:#e3f2fd;display:flex;justify-content:space-between;align-items:center;color:#1565c0;}.qn{font-weight:700;min-width:22px;flex-shrink:0;color:#1565c0;}.tf-row{display:flex;align-items:flex-start;gap:0.3rem;font-size:10.5pt;line-height:1.4;padding:0.25rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:42px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.2rem;margin-top:0.2rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.28rem 0.45rem;margin-bottom:0.22rem;break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.4;display:flex;gap:0.3rem;margin-bottom:0.18rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.22rem 0.55rem;}.mc-opts{display:grid;grid-template-columns:repeat(3,1fr);gap:0.08rem 0.25rem;margin-left:1.3rem;}.mc-opt{font-size:9.5pt;display:flex;align-items:center;gap:0.22rem;}.mc-opt input{width:12px;height:12px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.4;padding:0.22rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:130px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{break-inside:avoid;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.2rem 0.5rem;margin-top:0.15rem;}.pr-head{font-size:9pt;font-weight:700;color:#1565c0;margin-bottom:0.2rem;}.pr-item{font-size:10pt;padding:0.22rem 0.32rem;background:#e3f2fd;border-radius:3px;margin-bottom:0.12rem;display:flex;align-items:center;gap:0.22rem;line-height:1.2;}.pr-num{font-weight:700;color:#1565c0;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #1565c0;padding-bottom:0.35rem;margin-bottom:0.5rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;color:#1565c0;}.p-sub{font-size:9pt;color:#1565c0;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #cce0ff;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;color:#1565c0;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#1565c0;}.pa{color:#007a00;font-weight:700;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:#1565c0;font-weight:700;font-style:italic;}.obt-lbl{font-weight:700;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #1565c0;height:12px;}.obt-pct{font-weight:700;}.total-row{display:flex;align-items:baseline;justify-content:flex-end;gap:7px;font-size:11pt;color:#1565c0;font-weight:700;font-style:italic;margin-top:0.4rem;padding:0.2rem 0.5rem;background:#e3f2fd;border-radius:4px;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #1565c0;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · Misión Sólidos Geométricos · Matemática</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 4 secciones × 5 preguntas × 5 pts c/u · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✔ PAUTA DOCENTE — Evaluación Final · Sólidos Geométricos · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">100 pts | 4 secciones × 5 preguntas × 5 pts | Matemáticas · Educación Básica</div></div><div class="p-grid">${pR}</div>
  ${zgBlock}</div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("evalPage",252,0.55,1.45);fit("pautaPage",252,0.55,1.3);})();</script></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(doc); win.document.close(); setTimeout(()=>win.print(),400);
}

// ===================== EXPLICA CON TUS PALABRAS =====================
const explicaData = [
  {
    q: 'Un compañero dice que el cilindro es un poliedro porque tiene dos caras planas. Explícale por qué no lo es.',
    hint: '💡 Pista: mira TODAS sus superficies, no solo las dos de los extremos.',
    rubric: ['✓ Reconoce que sí tiene dos bases planas', '✓ Señala que la superficie de alrededor es curva', '✓ Concluye que un poliedro necesita que TODAS las caras sean planas'],
    suggested: 'Es cierto que las dos bases son planas y circulares, pero la superficie de alrededor es curva. Para ser poliedro TODAS las caras tienen que ser planas, así que el cilindro es un cuerpo redondo, no un poliedro.'
  },
  {
    q: 'Explica en qué se parecen y en qué se diferencian un prisma triangular y una pirámide triangular.',
    hint: '💡 Pista: cuenta las bases de cada uno.',
    rubric: ['✓ Se parecen: los dos son poliedros y tienen base triangular', '✓ El prisma tiene dos bases iguales y paralelas', '✓ La pirámide tiene una sola base y las caras se juntan en una punta'],
    suggested: 'Se parecen en que los dos son poliedros y su base es un triángulo. Se diferencian en que el prisma tiene dos bases triangulares iguales unidas por caras rectangulares, y la pirámide tiene una sola base y sus caras laterales son triángulos que se juntan arriba en la cúspide.'
  },
  {
    q: 'Contaste las partes de un poliedro y te dio 7 caras, 10 vértices y 15 aristas. ¿Está bien la cuenta? Compruébalo.',
    hint: '💡 Pista: caras + vértices = aristas + 2.',
    rubric: ['✓ Aplica la cuenta de Euler: 7 + 10 = 17', '✓ Compara con 15 + 2 = 17', '✓ Concluye que la cuenta está bien (es un prisma pentagonal)'],
    suggested: 'Sumo caras y vértices: 7 + 10 = 17. Por el otro lado, aristas más dos: 15 + 2 = 17. Como dan lo mismo, la cuenta está bien. Ese poliedro es un prisma pentagonal.'
  },
  {
    q: 'Busca en tu casa o en tu aula tres objetos con forma de sólido geométrico distinto y explica cuál es cada uno.',
    hint: '💡 Pista: latas, cajas, pelotas, conos de tráfico, lápices.',
    rubric: ['✓ Nombra tres objetos reales', '✓ Identifica bien el sólido de cada uno', '✓ Justifica con alguna característica (bases, caras, si rueda)'],
    suggested: 'La lata de leche es un cilindro, porque tiene dos bases circulares y rueda de lado. La caja de fósforos es un prisma rectangular: 6 caras planas. La pelota es una esfera, porque no tiene ninguna cara plana ni esquinas.'
  },
  {
    q: 'Dibujaste seis cuadrados en fila para armar un cubo y no te sale. Explica por qué y cómo lo arreglarías.',
    hint: '💡 Pista: piensa qué pasa al doblar el primero y el último.',
    rubric: ['✓ Explica que en fila los cuadrados se montan al doblar', '✓ Señala que hacen falta cuadrados arriba y abajo para las tapas', '✓ Propone un patrón válido, como la cruz'],
    suggested: 'En fila, al doblar, los cuadrados dan la vuelta y se montan unos con otros, y además no quedan tapas para arriba y para abajo. Se arregla poniendo cuatro en fila y uno arriba y otro abajo, como una cruz: ese sí se dobla y cierra el cubo.'
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

// ===================== PRUEBA OPERATIVA — SÓLIDOS GEOMÉTRICOS =====================

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

// I. Cuenta las partes del sólido (5 × 4 = 20 pts) — Bloques 1, 2 y 4
const _SOL_POL = _solPoliedros();
const _SOL_TODOS = _SOL_K;
function genMultDivItems() {
  const items = [];
  { const k = _SOL_POL[_opRint(0, _SOL_POL.length - 1)], s = _SOL[k];
    items.push({ text: `¿Cuántas caras tiene el ${s.n}?`, ansNum: s.c }); }
  { const k = _SOL_POL[_opRint(0, _SOL_POL.length - 1)], s = _SOL[k];
    items.push({ text: `¿Cuántas aristas tiene el ${s.n}?`, ansNum: s.a }); }
  { const k = _SOL_POL[_opRint(0, _SOL_POL.length - 1)], s = _SOL[k];
    items.push({ text: `¿Cuántos vértices tiene el ${s.n}?`, ansNum: s.v }); }
  { const n = _opRint(3, 8);
    items.push({ text: `Un prisma tiene una base de ${n} lados. ¿Cuántas caras tiene en total, contando las dos bases?`, ansNum: n + 2 }); }
  { const n = _opRint(3, 8);
    items.push({ text: `Una pirámide tiene una base de ${n} lados. ¿Cuántas aristas tiene en total?`, ansNum: n * 2 }); }
  return items;
}

// II. Radar de los sólidos (5 × 2 = 10 pts) — Bloque 3, Bloque 5 (tabla de criterios) y widget Radar Par-Impar
function genRadarItems() {
  const items = [];
  const tipos = _shuffleF([0, 1, 2, 3, 4], _opRnd);
  tipos.forEach(tp => {
    if (tp === 0) {
      const k = _SOL_TODOS[_opRint(0, _SOL_TODOS.length - 1)], s = _SOL[k];
      items.push({ text: `¿El ${s.n} es poliedro o cuerpo redondo? Escribe <em>poliedro</em> o <em>redondo</em>.`, ansTxt: s.poliedro ? ['poliedro'] : ['redondo', 'cuerpo redondo'], ansShow: (s.poliedro ? 'poliedro' : 'cuerpo redondo') + ` — ${s.poliedro ? 'todas sus caras son planas' : 'tiene superficie curva'}` });
    } else if (tp === 1) {
      const k = ['cilindro', 'cono', 'esfera', 'cubo', 'prismaR'][_opRint(0, 4)], s = _SOL[k];
      items.push({ text: `¿El ${s.n} puede rodar? Escribe <em>sí</em> o <em>no</em>.`, ansTxt: s.poliedro ? ['no'] : ['si', 'sí'], ansShow: (s.poliedro ? 'no' : 'sí') + ` — ${s.poliedro ? 'todas sus caras son planas' : 'su superficie curva lo deja rodar'}` });
    } else if (tp === 2) {
      const casos = [['un rectángulo', 'cilindro'], ['un triángulo rectángulo', 'cono'], ['un semicírculo', 'esfera']];
      const c = casos[_opRint(0, 2)];
      items.push({ text: `¿Qué sólido sale al girar ${c[0]} sobre su eje?`, ansTxt: [c[1]], ansShow: c[1] });
    } else if (tp === 3) {
      const k = _SOL_TODOS[_opRint(0, _SOL_TODOS.length - 1)], s = _SOL[k];
      items.push({ text: `¿Cuántas bases tiene el ${s.n}? Escribe el número.`, ansNum: (k.indexOf('prisma') === 0 || k === 'cubo' || k === 'cilindro') ? 2 : (k === 'esfera' ? 0 : 1) });
    } else {
      const k = _SOL_POL[_opRint(0, _SOL_POL.length - 1)], s = _SOL[k];
      items.push({ text: `¿De qué figura es la base del ${s.n}?`, ansTxt: [s.base], ansShow: s.base });
    }
  });
  return items;
}

// III. La cuenta de Euler (5 × 4 = 20 pts): sirve para comprobar si contó bien, que es de lo que se trata
function genReglaItems() {
  const items = [];
  const forms = _shuffleF([0, 1, 2, 0, 1], _opRnd);
  forms.forEach(f => {
    const k = _SOL_POL[_opRint(0, _SOL_POL.length - 1)], s = _SOL[k];
    let expr, hint, ansNum;
    if (f === 0) { expr = `▢ caras + ${s.v} vértices = ${s.a} aristas + 2`; hint = 'la cuenta de Euler'; ansNum = s.c; }
    else if (f === 1) { expr = `${s.c} caras + ▢ vértices = ${s.a} aristas + 2`; hint = 'la cuenta de Euler'; ansNum = s.v; }
    else { expr = `${s.c} caras + ${s.v} vértices = ▢ aristas + 2`; hint = 'la cuenta de Euler'; ansNum = s.a; }
    items.push({ expr, hint, ansNum });
  });
  return items;
}

// IV. Problemas de la vida real (3 × 10 = 30 pts): forrar una caja, armar esqueletos con palitos y plastilina
const OP_NAMES = ['Ana', 'Luis', 'Marta', 'José', 'Carmen', 'Pedro', 'Sofía', 'Iván'];
const OP_OBJS = ['mangos', 'tortillas', 'rosquillas', 'naranjas', 'elotes', 'semillas de café'];
const _VI_CAJAS = [['galletas', 'prisma rectangular'], ['jugos', 'prisma rectangular'], ['fósforos', 'prisma rectangular']];
const _VI_LADOS = [3, 4, 5, 6, 8];
function genVidaItems() {
  const items = [];
  { const nom = OP_NAMES[_opRint(0, OP_NAMES.length - 1)]; const n = _VI_LADOS[_opRint(0, _VI_LADOS.length - 1)];
    items.push({ text: `${nom} va a forrar con papel una caja con forma de prisma de base de ${n} lados. ¿Cuántas caras tiene que forrar en total?`, ansNum: n + 2, just: `${n} caras laterales + 2 bases` }); }
  { const n = _VI_LADOS[_opRint(0, _VI_LADOS.length - 1)];
    items.push({ text: `Para armar el esqueleto de una pirámide de base de ${n} lados se usa un palito por arista. ¿Cuántos palitos hacen falta?`, ansNum: n * 2, just: `${n} de la base + ${n} que suben a la cúspide` }); }
  { const k = _SOL_POL[_opRint(0, _SOL_POL.length - 1)], s = _SOL[k];
    items.push({ text: `En la esquina de un ${s.n} se pone una bolita de plastilina por cada vértice y un palito por cada arista. ¿Cuántas piezas se usan en total?`, ansNum: s.v + s.a, just: `${s.v} bolitas + ${s.a} palitos` }); }
  return items;
}

// V. Retos de pensamiento crítico (5 + 5 + 10 = 20 pts): el poliedro falso, la cuenta de Euler y el objeto real
const _RT_TRAMPA = [['el cilindro', false, 'tiene una superficie curva'], ['el cono', false, 'su superficie lateral es curva'], ['la esfera', false, 'no tiene ninguna cara plana'], ['el cubo', true, 'sus seis caras son cuadradas y planas'], ['la pirámide triangular', true, 'sus cuatro caras son triángulos planos']];
const _RT_EULER = [[7, 10, 15], [6, 8, 12], [5, 6, 9], [8, 12, 18], [5, 5, 8]];
const _RT_OBJ = [['una lata de leche', 'cilindro'], ['un dado', 'cubo'], ['una pelota', 'esfera'], ['un barquillo de helado', 'cono'], ['un lápiz común', 'prisma hexagonal']];
function genRetoItems() {
  const items = [];
  { const t = _RT_TRAMPA[_opRint(0, _RT_TRAMPA.length - 1)];
    items.push({ text: `Un compañero dice que ${t[0]} es un poliedro. ¿Tiene razón? Escribe <em>sí</em> o <em>no</em>.`, ansTxt: t[1] ? ['si', 'sí'] : ['no'], ansShow: (t[1] ? 'sí' : 'no') + ` — ${t[2]}`, pts: 5 }); }
  { const e = _RT_EULER[_opRint(0, _RT_EULER.length - 1)];
    items.push({ text: `Alguien contó ${e[0]} caras, ${e[1]} vértices y ${e[2]} aristas en un poliedro. Comprueba con la cuenta de Euler y escribe <em>bien</em> o <em>mal</em>.`, ansTxt: (e[0] + e[1] === e[2] + 2) ? ['bien'] : ['mal'], ansShow: ((e[0] + e[1] === e[2] + 2) ? 'bien' : 'mal') + ` — ${e[0]} + ${e[1]} = ${e[0] + e[1]} y ${e[2]} + 2 = ${e[2] + 2}`, pts: 5 }); }
  { const o = _RT_OBJ[_opRint(0, _RT_OBJ.length - 1)];
    items.push({ text: `Describe la forma de ${o[0]}: escribe qué sólido geométrico es.`, ansTxt: [o[1]], ansShow: o[1], pts: 10 }); }
  return items;
}

function genEvalOp() {
  sfx('click');
  _injectFormaSel('genEvalOp', 'evalOpFormaSel', evalOpFormNum, function (v) { evalOpFormNum = v; });
  const _sO = document.getElementById('evalOpFormaSel');
  if (_sO && parseInt(_sO.value, 10)) evalOpFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sO.value, 10)));
  const cf = evalOpFormNum; window._currentEvalOpForm = cf; _opRnd = _evalRng(100000 + cf); /* la Forma cf siembra todo el azar de la prueba operativa */ evalOpFormNum = (evalOpFormNum % EVAL_FORMAS) + 1; _injectFormaSel('genEvalOp', 'evalOpFormaSel', evalOpFormNum, function (v) { evalOpFormNum = v; }); saveProgress();
  document.getElementById('evalop-screen-title').textContent = `📐 Prueba Operativa — Forma ${cf} · Sólidos Geométricos`;
  evalOpAnsVisible = false;
  const out = document.getElementById('evalOpOut'); out.innerHTML = '';

  const mdItems = genMultDivItems();
  const s1 = document.createElement('div');
  s1.innerHTML = '<div class="eval-section-title">I. Cuenta las partes del sólido <span class="eval-pts">20 pts · 4 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel básico. Cuenta con cuidado: las caras son las superficies, las aristas los filos y los vértices las esquinas.</p>';
  mdItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.text}</span><input class="eval-cp-input" type="text" data-md="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${it.ansShow || _fmtNum(it.ansNum)}</div><div class="eval-item-feedback" id="evalFbMd${i}" aria-live="polite"></div>`;
    s1.appendChild(d);
  });
  out.appendChild(s1);

  const rdItems = genRadarItems();
  const s2 = document.createElement('div');
  s2.innerHTML = '<div class="eval-section-title">II. Radar de los sólidos <span class="eval-pts">10 pts · 2 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel básico. Como en el Radar de los Sólidos: mira si las caras son planas o curvas y de qué es la base.</p>';
  rdItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.text}</span><input class="eval-cp-input" type="text" data-rd="${i}" autocomplete="off"></div><div class="eval-answer">${it.ansShow}</div><div class="eval-item-feedback" id="evalFbRd${i}" aria-live="polite"></div>`;
    s2.appendChild(d);
  });
  out.appendChild(s2);

  const rgItems = genReglaItems();
  const s3 = document.createElement('div');
  s3.innerHTML = '<div class="eval-section-title">III. La cuenta de Euler: ¿qué falta en ▢? <span class="eval-pts">20 pts · 4 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel intermedio. En todo poliedro, caras más vértices es igual a aristas más dos.</p>';
  rgItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.expr} <em style="font-size:0.85em;color:var(--gray);">(${it.hint})</em></span><input class="eval-cp-input" type="text" data-rg="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">▢ = ${it.ansShow || _fmtNum(it.ansNum)}</div><div class="eval-item-feedback" id="evalFbRg${i}" aria-live="polite"></div>`;
    s3.appendChild(d);
  });
  out.appendChild(s3);

  const viItems = genVidaItems();
  const s4 = document.createElement('div');
  s4.innerHTML = '<div class="eval-section-title">IV. Problemas de la vida real <span class="eval-pts">30 pts · 10 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel avanzado. Son sólidos que se arman de verdad: cuenta las piezas y escribe el número.</p>';
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
  if (res) { res.className = 'eval-auto-result ' + (total >= 70 ? 'eval-auto-pass' : 'eval-auto-risk'); res.innerHTML = `<strong>Resultado: ${total}/100 pts</strong><br><span>Contar partes: ${det.md}/20 · Radar: ${det.rd}/10 · Euler: ${det.rg}/20 · Vida real: ${det.vi}/30 · Retos: ${det.rt}/20</span>`; }
  if (total >= 70) { pts(8); showToast('🎯 Prueba operativa calificada: ' + total + '/100'); }
  else showToast('🧮 Prueba operativa: ' + total + '/100. Revisa los ítems marcados.');
}

function printEvalOp() {
  if (!window._evalOpData) { showToast('⚠️ Genera una prueba operativa primero'); return; }
  sfx('click');
  const forma = window._currentEvalOpForm || 1; const d = window._evalOpData;
  const _plano = (s) => s.replace(/<em[^>]*>/g, '').replace(/<\/em>/g, '');
  let s1 = `<div class="sec-title"><span>I. Cuenta las partes del sólido</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Nivel básico. Cuenta caras, aristas y vértices y escribe la respuesta en la línea. 4 pts c/u.</p>`;
  d.mdItems.forEach((it, i) => { s1 += `<div class="opx-print-row"><span class="qn">${i+1}.</span><span class="prb-text">${it.text}</span><span class="opx-blank"></span></div>`; });
  const rdTbl = (items) => `<table class="rnd-tbl"><tr><th>#</th><th>Radar: poliedro o redondo, bases y giros</th><th>Respuesta</th></tr>${items.map((it, i) => `<tr><td>${i+1}</td><td>${_plano(it.text)}</td><td></td></tr>`).join('')}</table>`;
  let s2 = `<div class="sec-title"><span>II. Radar de los sólidos</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10 pts</span></div></div><p class="opx-instr">Nivel básico. Recuerda: poliedro es el que tiene TODAS las caras planas · el prisma tiene dos bases y la pirámide una · suma de cifras · 5 → termina en 0 o 5 · 10 → termina en 0. 2 pts c/u.</p>${rdTbl(d.rdItems)}`;
  const rgTbl = (items) => `<table class="rnd-tbl"><tr><th>#</th><th>Operación</th><th>Pista</th><th>▢ =</th></tr>${items.map((it, i) => `<tr><td>${i+1}</td><td>${it.expr}</td><td>${it.hint}</td><td></td></tr>`).join('')}</table>`;
  let s3 = `<div class="sec-title"><span>III. La cuenta de Euler: ¿qué falta en ▢?</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Nivel intermedio. Caras más vértices es igual a aristas más dos. 4 pts c/u.</p>${rgTbl(d.rgItems)}`;
  let s4 = `<div class="sec-title"><span>IV. Problemas de la vida real</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 30 pts</span></div></div><p class="opx-instr">Nivel avanzado. Resuelve en el espacio mostrando tu procedimiento y escribe la respuesta. 10 pts c/u.</p>`;
  d.viItems.forEach((it, i) => { s4 += `<div class="opx-print-row"><span class="qn">${i+1}.</span><span class="prb-text">${it.text}</span><span class="opx-blank"></span></div><div class="opx-space"></div>`; });
  let s5 = `<div class="sec-title"><span>V. Retos de pensamiento crítico</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Nivel desafío. ¡Cuidado con los Errores Comunes! Valor: 5 + 5 + 10 pts.</p>`;
  d.rtItems.forEach((it, i) => { s5 += `<div class="opx-print-row"><span class="qn">${i+1}.</span><span class="prb-text">${_plano(it.text)} <strong>(${it.pts} pts)</strong></span><span class="opx-blank"></span></div>`; });
  let pR = '';
  pR += `<div class="p-sec"><div class="p-ttl">I. Cuenta las partes del sólido</div><table class="p-tbl">${d.mdItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${it.ansShow || _fmtNum(it.ansNum)}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">II. Radar de los sólidos</div><table class="p-tbl">${d.rdItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${it.ansShow}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">III. La cuenta de Euler</div><table class="p-tbl">${d.rgItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">▢ = ${it.ansShow || _fmtNum(it.ansNum)}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">IV. Problemas de la vida real</div><table class="p-tbl">${d.viItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${it.ansShow || _fmtNum(it.ansNum)} — ${it.just}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec" style="grid-column:1/-1;"><div class="p-ttl">V. Retos de pensamiento crítico</div><table class="p-tbl">${d.rtItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${it.ansShow} (${it.pts} pts)</td></tr>`).join('')}</table></div>`;
  const doc = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Prueba Operativa Sólidos Geométricos · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11.5pt;color:#111;background:#fff;padding:4mm 6mm;}.ph{margin-bottom:0.5rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;color:#1565c0;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:#1565c0;margin-top:0.15rem;font-weight:700;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.45rem 0 0.2rem;border-left:4px solid #1565c0;background:#e3f2fd;display:flex;justify-content:space-between;align-items:center;color:#1565c0;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:#1565c0;font-weight:700;font-style:italic;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #1565c0;height:12px;}.qn{font-weight:700;min-width:20px;display:inline-block;color:#1565c0;flex-shrink:0;}.opx-instr{font-size:9pt;color:#555;margin-bottom:0.22rem;}.opx-blank{display:inline-block;width:80px;flex:none;border-bottom:1.5px solid #111;min-height:13px;margin-left:0.3rem;}.opx-print-row{display:flex;align-items:baseline;gap:0.4rem;font-size:10pt;padding:0.24rem 0.1rem;border-bottom:1px dotted #ddd;}.opx-space{height:26px;border-bottom:1px dotted #ccc;margin:0 0 2px 20px;}.prb-text{flex:1;line-height:1.35;}.rnd-tbl{width:100%;border-collapse:collapse;font-size:9.5pt;margin-top:0.15rem;}.rnd-tbl th,.rnd-tbl td{border:1px solid #bbb;padding:0.16rem 0.35rem;text-align:left;}.rnd-tbl th{background:#e3f2fd;color:#1565c0;font-size:8.5pt;}.total-row{display:flex;align-items:baseline;justify-content:flex-end;gap:7px;font-size:11pt;color:#1565c0;font-weight:700;font-style:italic;margin-top:0.45rem;padding:0.2rem 0.5rem;background:#e3f2fd;border-radius:4px;}.total-row .obt-line{min-width:80px;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #1565c0;padding-bottom:0.3rem;margin-bottom:0.5rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;color:#1565c0;}.p-sub{font-size:9pt;color:#1565c0;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #cce0ff;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;color:#1565c0;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#1565c0;}.pa{color:#007a00;font-weight:700;font-family:'Courier New',monospace;}.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:8mm 10mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Examen de Matemáticas — Prueba Operativa · Sólidos Geométricos · Educación Básica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 pts · I: 20 · II: 10 · III: 20 · IV: 30 · V: 20 · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✔ PAUTA — Prueba Operativa · Sólidos Geométricos · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">100 pts · Matemáticas · Educación Básica</div></div><div class="p-grid">${pR}</div></div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("evalPage",250,0.55,1.2);fit("pautaPage",250,0.55,1.2);})();<\/script></body></html>`;
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
  const msgs=['💡 ¡ÁNIMO! Comienza tu misión. ¡Cada paso cuenta!','🌱 ¡GRAN INICIO! Estás dando los primeros pasos.','🔑 ¡BUEN TRABAJO! Vas progresando muy bien.','💪 ¡MUY BIEN! Dominas gran parte del contenido.','🏅 ¡INCREÍBLE avance! Estás cerca de la excelencia.','🎓 ¡EXTRAORDINARIO! Completaste TODA la misión. ¡Eres experto en Sólidos Geométricos!'];
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
  const txt=`${stars} CONSTANCIA DE LOGRO ${stars}\n\n📚 Misión: Sólidos Geométricos\n👤 Estudiante: ${name}\n📊 Progreso: ${pct}% completado\n⭐ XP obtenido: ${xp} de ${MXP}${achText?'\n\n🏆 Logros desbloqueados:\n'+achText:''}\n\n${msg}\n\n📅 ${date}\n🏠 Proyecto Educativo M.E.T.A.S\n🌐 policastsapien.com`;
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
