// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
// Compartir misión por WhatsApp
function compartirMision() {
    const url = window.location.href;
    const texto = `🚀 *Misión Asignada: Ángulos — Tipos y Transportador* 🚀\n\nAprende a identificar ángulos agudos, rectos, obtusos, llanos y completos, y domina el uso del transportador. 📐\n\nDesbloquea *todos los logros* y puedes poner *tus datos* para que tu maestro observe todos tus logros. 📋\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;
    _waShare(texto);
}

// ===================== ACCESIBILIDAD =====================
function toggleLetra() {
  document.body.classList.toggle('letra-grande');
  if(typeof sfx === 'function') sfx('click');
  localStorage.setItem('prefLetraAngulos', document.body.classList.contains('letra-grande'));
}
window.addEventListener('DOMContentLoaded', () => {
  if(localStorage.getItem('prefLetraAngulos') === 'true') document.body.classList.add('letra-grande');
});

// ===================== UTILIDADES =====================
const _pick = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
const _shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
function fb(id, msg, isOk) {
  const el = document.getElementById(id);
  if(el) { el.textContent = msg; el.className = 'fb show ' + (isOk ? 'ok' : 'err'); }
}
function _rint(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
// Clasificación de un ángulo por su medida en grados
function _tipoAngulo(g){ if(g<90) return 'agudo'; if(g===90) return 'recto'; if(g<180) return 'obtuso'; if(g===180) return 'llano'; if(g<360) return 'reflejo'; return 'completo'; }
// Dibujo SVG de un ángulo (lado horizontal + lado a "deg" grados)
function _svgAngle(deg){
  const cx=100, cy=115, r=85; const rad=deg*Math.PI/180;
  const x2=(cx+r*Math.cos(-rad)).toFixed(1), y2=(cy+r*Math.sin(-rad)).toFixed(1);
  const ax=(cx+34*Math.cos(-rad)).toFixed(1), ay=(cy+34*Math.sin(-rad)).toFixed(1);
  const large=deg>180?1:0;
  return `<svg viewBox="0 0 200 135" width="100%" style="max-width:280px;display:block;margin:0 auto;" aria-hidden="true">
    <line x1="${cx}" y1="${cy}" x2="${cx+r}" y2="${cy}" stroke="#1565c0" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="#00838f" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M ${cx+34} ${cy} A 34 34 0 ${large} 0 ${ax} ${ay}" fill="none" stroke="#e17055" stroke-width="2.5"/>
    <circle cx="${cx}" cy="${cy}" r="4.5" fill="#d63031"/>
  </svg>`;
}

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY = 'matematica_angulos_basicos_v1';
let xp = 0, MXP = 200, done = new Set(), evalAnsVisible = false;
let evalFormNum = 1, evalOpFormNum = 1, evalOpAnsVisible = false, unlockedAch = [], darkMode = false, prevLevel = 0;
const TOTAL_SECTIONS = 16;
const xpTracker = { fc: new Set(), qz: new Set(), cls: new Set(), id: new Set(), cmp: new Set(), reto: new Set(), sopa: new Set(), predice: new Set(), explica: new Set(), memo: new Set(), labA: new Set(), labT: new Set(), wVel: new Set(), wCS: new Set(), wReg: new Set() };

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
  {w:'Ángulo',a:'figura formada por <strong>dos rayos</strong> (lados) que parten de un mismo punto. su abertura se mide en grados.'},
  {w:'Vértice',a:'<strong>punto</strong> donde se unen los dos lados del ángulo. es el centro desde donde se abre.'},
  {w:'Lado del ángulo',a:'cada uno de los <strong>dos rayos</strong> que forman el ángulo y salen del vértice.'},
  {w:'Grado (°)',a:'unidad para <strong>medir</strong> la abertura de un ángulo. una vuelta completa tiene 360°.'},
  {w:'Ángulo Agudo',a:'mide <strong>menos de 90°</strong>. es cerradito, como la punta de una pizza. ej: 45°.'},
  {w:'Ángulo Recto',a:'mide <strong>exactamente 90°</strong>. como la esquina de una hoja o de una pared.'},
  {w:'Ángulo Obtuso',a:'mide <strong>más de 90° y menos de 180°</strong>. está bien abierto. ej: 130°.'},
  {w:'Ángulo Llano',a:'mide <strong>exactamente 180°</strong>. sus lados forman una <strong>línea recta</strong>.'},
  {w:'Ángulo Completo',a:'mide <strong>360°</strong>. es una <strong>vuelta entera</strong>: los dos lados coinciden.'},
  {w:'Ángulo Reflejo',a:'mide <strong>más de 180° y menos de 360°</strong>. es el ángulo "grande" que sobra.'},
  {w:'Transportador',a:'instrumento en forma de <strong>semicírculo</strong> con escala de 0° a 180° para <strong>medir y trazar</strong> ángulos.'},
  {w:'Complementarios',a:'dos ángulos que <strong>suman 90°</strong>. ej: 30° y 60° son complementarios.'},
  {w:'Suplementarios',a:'dos ángulos que <strong>suman 180°</strong>. ej: 120° y 60° son suplementarios.'},
  {w:'Bisectriz',a:'recta que <strong>divide un ángulo</strong> en dos ángulos <strong>iguales</strong>.'}
];
let fcIdx=0;
function upFC(){ document.getElementById('fcInner').classList.remove('flipped'); document.getElementById('fcW').textContent=fcData[fcIdx].w; document.getElementById('fcA').innerHTML=fcData[fcIdx].a; document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length; }
function flipCard(){ sfx('flip'); document.getElementById('fcInner').classList.toggle('flipped'); if(!xpTracker.fc.has(fcIdx)){ xpTracker.fc.add(fcIdx); pts(1); } if(xpTracker.fc.size===fcData.length){ fin('s-flash'); unlockAchievement('flash_master'); } }
function nextFC(){ sfx('click'); fcIdx=(fcIdx+1)%fcData.length; upFC(); }
function prevFC(){ sfx('click'); fcIdx=(fcIdx-1+fcData.length)%fcData.length; upFC(); }

// ===================== JUEGO: MEMORIA DE LOS ÁNGULOS =====================
const memoPairs=[
  {id:'agudo',t:'Agudo',d:'🔺 mide menos de 90° · ej: 45°'},
  {id:'recto',t:'Recto',d:'📐 mide exactamente 90°'},
  {id:'obtuso',t:'Obtuso',d:'🔻 más de 90° y menos de 180°'},
  {id:'llano',t:'Llano',d:'📏 mide 180° · línea recta'},
  {id:'transportador',t:'Transportador',d:'🎯 mide ángulos en grados'},
  {id:'bisectriz',t:'Bisectriz',d:'✂️ parte el ángulo en 2 iguales'}
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
  {q:'¿Cuánto mide un ángulo recto?',o:['a) 45°','b) 90°','c) 180°','d) 360°'],c:1,feedback:'El ángulo recto mide exactamente 90°, como la esquina de una hoja.'},
  {q:'¿Cómo se llama un ángulo que mide 130°?',o:['a) agudo','b) recto','c) obtuso','d) llano'],c:2,feedback:'130° es mayor que 90° y menor que 180°: es un ángulo obtuso.'},
  {q:'¿Cuánto mide un ángulo llano?',o:['a) 90°','b) 120°','c) 180°','d) 200°'],c:2,feedback:'El ángulo llano mide 180° y sus lados forman una línea recta.'},
  {q:'¿Cómo se llama un ángulo de 45°?',o:['a) agudo','b) obtuso','c) recto','d) completo'],c:0,feedback:'45° es menor que 90°, así que es un ángulo agudo.'},
  {q:'¿Qué instrumento se usa para medir ángulos?',o:['a) la regla','b) el compás','c) el transportador','d) la balanza'],c:2,feedback:'El transportador tiene una escala de 0° a 180° para medir ángulos.'},
  {q:'¿Cuál es el complemento de un ángulo de 60°?',o:['a) 120°','b) 30°','c) 40°','d) 60°'],c:1,feedback:'Los complementarios suman 90°: 90° − 60° = 30°.'},
  {q:'¿Cuál es el suplemento de un ángulo de 110°?',o:['a) 70°','b) 90°','c) 80°','d) 250°'],c:0,feedback:'Los suplementarios suman 180°: 180° − 110° = 70°.'},
  {q:'El punto donde se unen los dos lados de un ángulo se llama:',o:['a) grado','b) vértice','c) lado','d) arco'],c:1,feedback:'El vértice es el punto de unión de los dos lados del ángulo.'},
  {q:'Un ángulo que mide más de 180° y menos de 360° se llama:',o:['a) llano','b) completo','c) reflejo','d) obtuso'],c:2,feedback:'El ángulo reflejo mide más de 180° pero no llega a los 360°.'}
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
    label:['Agudos','Obtusos'], headA:'🔺 Ángulos AGUDOS (< 90°)', headB:'🔻 Ángulos OBTUSOS (> 90°)', colA:'agudo', colB:'obtuso',
    words:[{w:'30°',t:'agudo'},{w:'120°',t:'obtuso'},{w:'45°',t:'agudo'},{w:'100°',t:'obtuso'},{w:'75°',t:'agudo'},{w:'150°',t:'obtuso'},{w:'15°',t:'agudo'},{w:'135°',t:'obtuso'},{w:'89°',t:'agudo'},{w:'170°',t:'obtuso'}]
  },
  {
    label:['Complementarios','Suplementarios'], headA:'➕ COMPLEMENTARIOS (suman 90°)', headB:'↔️ SUPLEMENTARIOS (suman 180°)', colA:'comp', colB:'supl',
    words:[{w:'30° y 60°',t:'comp'},{w:'120° y 60°',t:'supl'},{w:'45° y 45°',t:'comp'},{w:'100° y 80°',t:'supl'},{w:'20° y 70°',t:'comp'},{w:'150° y 30°',t:'supl'},{w:'10° y 80°',t:'comp'},{w:'110° y 70°',t:'supl'},{w:'25° y 65°',t:'comp'},{w:'140° y 40°',t:'supl'}]
  },
  {
    label:['Recto','Llano'], headA:'📐 RECTO (90°)', headB:'📏 LLANO (180°)', colA:'recto', colB:'llano',
    words:[{w:'esquina de una hoja',t:'recto'},{w:'línea recta',t:'llano'},{w:'cuarto de vuelta',t:'recto'},{w:'media vuelta',t:'llano'},{w:'dos lados perpendiculares',t:'recto'},{w:'90° + 90°',t:'llano'},{w:'ángulo de una pared',t:'recto'},{w:'horizonte plano',t:'llano'},{w:'el transportador marca 90',t:'recto'},{w:'un solo giro de 180°',t:'llano'}]
  },
  {
    label:['Hasta 180°','Reflejo'], headA:'↔️ Hasta 180° (llano o menos)', headB:'🔄 REFLEJO (más de 180°)', colA:'hasta', colB:'reflejo',
    words:[{w:'45°',t:'hasta'},{w:'200°',t:'reflejo'},{w:'90°',t:'hasta'},{w:'270°',t:'reflejo'},{w:'160°',t:'hasta'},{w:'300°',t:'reflejo'},{w:'120°',t:'hasta'},{w:'350°',t:'reflejo'},{w:'179°',t:'hasta'},{w:'190°',t:'reflejo'}]
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
  {s:['Un','ángulo','se','forma','con','dos','rayos','y','un','vértice.'],c:9,art:'Punto donde se unen los dos lados del ángulo'},
  {s:['El','ángulo','agudo','mide','menos','de','90','grados.'],c:2,art:'Ángulo que mide menos de 90°'},
  {s:['El','ángulo','recto','mide','exactamente','90','grados.'],c:2,art:'Ángulo que mide exactamente 90°'},
  {s:['El','ángulo','obtuso','mide','más','de','90','grados.'],c:2,art:'Ángulo mayor que 90° y menor que 180°'},
  {s:['El','ángulo','llano','forma','una','línea','recta','de','180°.'],c:2,art:'Ángulo que mide 180° (línea recta)'},
  {s:['El','transportador','sirve','para','medir','ángulos','en','grados.'],c:1,art:'Instrumento para medir ángulos'},
  {s:['Dos','ángulos','son','complementarios','si','suman','90','grados.'],c:3,art:'Par de ángulos que suman 90°'},
  {s:['La','bisectriz','divide','un','ángulo','en','dos','partes','iguales.'],c:1,art:'Recta que divide un ángulo en dos partes iguales'}
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
  {s:'El punto donde se unen los dos lados de un ángulo se llama ___.',opts:['lado','vértice','grado'],c:1},
  {s:'Un ángulo agudo mide ___ de 90°.',opts:['más','menos','igual'],c:1},
  {s:'Un ángulo recto mide exactamente ___ grados.',opts:['45','90','180'],c:1},
  {s:'Un ángulo obtuso mide más de 90° y menos de ___ grados.',opts:['180','90','360'],c:0},
  {s:'El ángulo llano mide ___ grados y forma una línea recta.',opts:['90','180','360'],c:1},
  {s:'El instrumento para medir ángulos es el ___.',opts:['regla','compás','transportador'],c:2},
  {s:'Dos ángulos que suman 90° se llaman ___.',opts:['suplementarios','complementarios','opuestos'],c:1},
  {s:'La ___ divide un ángulo en dos partes iguales.',opts:['bisectriz','mediatriz','diagonal'],c:0}
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
    q: 'Sin medir: ¿un ángulo de 130° es agudo, recto u obtuso?',
    opts: ['Agudo', 'Recto', 'Obtuso'],
    correct: 2,
    feedback: '¡Correcto! 130° es mayor que 90° y menor que 180°: es obtuso.',
    wrongFeedback: 'La respuesta es: obtuso. 130° pasa de 90° pero no llega a 180°.',
    explore: 'clasif'
  },
  {
    q: '¿Cuál es el complemento de un ángulo de 25°?',
    opts: ['65°', '75°', '155°'],
    correct: 0,
    feedback: '¡Excelente! 90° − 25° = 65°. Los complementarios suman 90°.',
    wrongFeedback: 'La respuesta es 65°: el complemento suma 90°, así que 90 − 25 = 65.',
    explore: 'comp'
  },
  {
    q: 'Dos ángulos de un triángulo miden 50° y 60°. ¿Cuánto mide el tercero?',
    opts: ['70°', '80°', '90°'],
    correct: 0,
    feedback: '¡Muy bien! Los ángulos de un triángulo suman 180°: 180 − 50 − 60 = 70°.',
    wrongFeedback: 'La respuesta es 70°: 180 − (50 + 60) = 70. Los ángulos de un triángulo suman 180°.',
    explore: 'triangulo'
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
  if(type==='clasif'){
    box.innerHTML=`<p class="pd-tip">El ángulo mide <strong>130°</strong>. Toca cada referencia y compárala:</p><div class="pd-line" id="pd-line-${i}"></div><div class="pd-msg" id="pd-msg-${i}">👆 toca 90° y luego 180°</div>`;
    const line=document.getElementById('pd-line-'+i);
    [{v:'90°',rol:'recto'},{v:'180°',rol:'llano'}].forEach(c=>{
      const t=_pdTick(c.v);
      t.onclick=()=>{ sfx('click'); line.querySelectorAll('.pd-tick').forEach(x=>x.classList.remove('pd-on','pd-win'));
        const msg=document.getElementById('pd-msg-'+i);
        if(c.rol==='recto'){ t.classList.add('pd-on'); msg.innerHTML='130° es <strong>mayor que 90°</strong>: ya no es agudo ni recto.'; }
        else{ t.classList.add('pd-win'); msg.innerHTML='🎯 130° es <strong>menor que 180°</strong>. Entre 90° y 180° = <strong>obtuso</strong>. ¡Responde abajo!'; sfx('ok'); } };
      line.appendChild(t);
    });
  } else if(type==='comp'){
    box.innerHTML=`<p class="pd-tip">El complemento suma 90°. Toca para ver el reparto:</p><div style="display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;margin:0.5rem 0;"><button class="btn btn-pri" onclick="predComp(${i})">25° + ▢ = 90°</button></div><div class="pd-msg" id="pd-msg-${i}">👆 toca para calcular</div>`;
  } else if(type==='triangulo'){
    box.innerHTML=`<p class="pd-tip">Los tres ángulos de un triángulo suman 180°. Descúbrelo:</p><div style="display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;margin:0.5rem 0;"><button class="btn btn-pri" onclick="predTri(${i})">50° + 60° + ▢ = 180°</button></div><div class="pd-msg" id="pd-msg-${i}">👆 toca para calcular</div>`;
  }
}
function predComp(i){ sfx('ok'); document.getElementById('pd-msg-'+i).innerHTML='90° − 25° = <strong>65°</strong>. ¡Ese es el complemento!'; }
function predTri(i){ sfx('ok'); document.getElementById('pd-msg-'+i).innerHTML='50° + 60° = 110°, y 180° − 110° = <strong>70°</strong>.'; }

// ===================== LAB 1: CAZADOR DE ÁNGULOS =====================
const _cazaAngles=[35,60,90,120,150,180,45,100,15,200,75,135];
let cazaIdx=0, cazaScore=0;
function buildLabAngulos(){ const c=document.getElementById('labAngulos'); if(!c) return; cazaIdx=0; cazaScore=0; showLabAngulos(); }
function showLabAngulos(){ const c=document.getElementById('labAngulos'); if(!c) return; const g=_cazaAngles[cazaIdx%_cazaAngles.length]; const opts=['agudo','recto','obtuso','llano','reflejo','completo']; c.innerHTML=`<div class="wv-card"><div class="wv-deg">${g}°</div><div class="wv-q">¿Qué tipo de ángulo es?</div><div class="wv-opts">${opts.map(o=>`<button class="btn btn-pri" onclick="ansLabAngulos('${o}')">${o}</button>`).join('')}</div><div class="fb" id="fbLabA" role="alert"></div><div style="margin-top:0.5rem;font-size:0.82rem;color:var(--gray);">🎯 Cazados: <span id="cazaScore">${cazaScore}</span> de 5</div></div>`; }
function ansLabAngulos(o){ const g=_cazaAngles[cazaIdx%_cazaAngles.length]; const tipo=_tipoAngulo(g); if(o===tipo){ sfx('ok'); cazaScore++; if(cazaScore<=5 && !xpTracker.labA.has(cazaIdx)){ xpTracker.labA.add(cazaIdx); pts(2); } fb('fbLabA',`¡Cazado! ${g}° es un ángulo ${tipo}.`,true); } else { sfx('no'); fb('fbLabA',`Casi: ${g}° es un ángulo ${tipo}.`,false); } const s=document.getElementById('cazaScore'); if(s) s.textContent=cazaScore; cazaIdx++; if(cazaScore>=5) fin('s-lab'); setTimeout(showLabAngulos,1200); }

// ===================== LAB 2: SIMULADOR DE TRANSPORTADOR =====================
const _transDegs=[30,45,60,90,120,135,150];
let transScore=0;
function buildLabTransportador(){ const c=document.getElementById('labTransportador'); if(!c) return; transScore=0; showLabTransportador(); }
function showLabTransportador(){ const c=document.getElementById('labTransportador'); if(!c) return; const g=_transDegs[_rint(0,_transDegs.length-1)]; let set=new Set([g]); while(set.size<3){ set.add(_transDegs[_rint(0,_transDegs.length-1)]); } const opts=_shuffle([...set]); c.innerHTML=`<div class="wv-card">${_svgAngle(g)}<div class="wv-q">¿Cuántos grados mide este ángulo?</div><div class="wv-opts">${opts.map(o=>`<button class="btn btn-pri" onclick="ansLabTrans(${o},${g})">${o}°</button>`).join('')}</div><div class="fb" id="fbLabT" role="alert"></div><div style="margin-top:0.5rem;font-size:0.82rem;color:var(--gray);">📐 Aciertos: <span id="transScore">${transScore}</span> de 5</div></div>`; }
function ansLabTrans(o,g){ if(o===g){ sfx('ok'); transScore++; if(transScore<=5 && !xpTracker.labT.has(transScore)){ xpTracker.labT.add(transScore); pts(2); } fb('fbLabT',`¡Correcto! El ángulo mide ${g}°.`,true); if(transScore>=5) fin('s-lab'); } else { sfx('no'); fb('fbLabT',`Observa mejor la abertura: mide ${g}°.`,false); } const s=document.getElementById('transScore'); if(s) s.textContent=transScore; setTimeout(showLabTransportador,1300); }

// ===================== WIDGET: JUICIO DE VELOCIDAD =====================
const _velAngles=[30,45,60,15,75,89,120,135,150,170,100,25,90,180,200,270];
let velIdx=0, velScore=0;
function buildVelocidad(){ const c=document.getElementById('widget-velocidad'); if(!c) return; velIdx=0; velScore=0; showVelocidad(); }
function showVelocidad(){ const c=document.getElementById('widget-velocidad'); if(!c) return; const g=_velAngles[velIdx%_velAngles.length]; const opts=['agudo','recto','obtuso','llano','reflejo','completo']; c.innerHTML=`<div class="wv-card"><div class="wv-deg">${g}°</div><div class="wv-q">¡Rápido! ¿Qué tipo de ángulo es?</div><div class="wv-opts">${opts.map(o=>`<button class="btn btn-pri" onclick="ansVelocidad('${o}')">${o}</button>`).join('')}</div><div class="fb" id="fbVel" role="alert"></div><div style="margin-top:0.5rem;font-size:0.82rem;color:var(--gray);">⚡ Aciertos: <span id="velScore">${velScore}</span> de 6</div></div>`; }
function ansVelocidad(o){ const g=_velAngles[velIdx%_velAngles.length]; const tipo=_tipoAngulo(g); if(o===tipo){ sfx('ok'); velScore++; if(velScore<=6 && !xpTracker.wVel.has(velIdx)){ xpTracker.wVel.add(velIdx); pts(2); } fb('fbVel',`¡Correcto! ${g}° es ${tipo}.`,true); } else { sfx('no'); fb('fbVel',`${g}° es ${tipo}, no ${o}.`,false); } velIdx++; if(velScore>=6) fin('s-widgets'); setTimeout(showVelocidad,1100); }

// ===================== WIDGET: COMPLEMENTO O SUPLEMENTO =====================
let csRounds=0;
function buildCompSupl(){ const c=document.getElementById('widget-compsupl'); if(!c) return; csRounds=0; showCompSupl(); }
function showCompSupl(){ const c=document.getElementById('widget-compsupl'); if(!c) return; const a=_rint(10,80); c.innerHTML=`<div class="wv-card"><div class="wv-deg">${a}°</div><div class="wcs-inputs" style="display:flex;flex-direction:column;gap:0.5rem;margin:0.6rem 0;"><label>Complemento (90° − ${a}°): <input type="text" id="csComp" inputmode="numeric" class="eval-cp-input" style="max-width:90px;"></label><label>Suplemento (180° − ${a}°): <input type="text" id="csSupl" inputmode="numeric" class="eval-cp-input" style="max-width:90px;"></label></div><div style="display:flex;gap:0.5rem;flex-wrap:wrap;"><button class="btn btn-g" onclick="checkCompSupl(${a})">✅ Verificar</button><button class="btn btn-d" onclick="showCompSupl()">🔄 Otro ángulo</button></div><div class="fb" id="fbCS" role="alert"></div><div style="margin-top:0.5rem;font-size:0.82rem;color:var(--gray);">🔗 Aciertos: <span id="csScore">${csRounds}</span> de 6</div></div>`; }
function checkCompSupl(a){ const comp=_isIntMatch(document.getElementById('csComp').value,90-a); const supl=_isIntMatch(document.getElementById('csSupl').value,180-a); if(comp&&supl){ sfx('ok'); if(csRounds<6 && !xpTracker.wCS.has(csRounds)){ xpTracker.wCS.add(csRounds); pts(2); } csRounds++; fb('fbCS',`¡Perfecto! Complemento ${90-a}° y suplemento ${180-a}°.`,true); if(csRounds>=6) fin('s-widgets'); setTimeout(showCompSupl,1300); } else { sfx('no'); fb('fbCS',`Revisa: complemento = ${90-a}°, suplemento = ${180-a}°.`,false); } }

// ===================== WIDGET: REGLA DEL ÁNGULO =====================
const _reglaData=[
  {d:'Mido exactamente 90°, como la esquina de una hoja.', a:'recto'},
  {d:'Mido menos de 90°, soy pequeño y cerrado.', a:'agudo'},
  {d:'Mido más de 90° pero menos de 180°.', a:'obtuso'},
  {d:'Mis lados forman una línea recta: mido 180°.', a:'llano'},
  {d:'Doy una vuelta entera: mido 360°.', a:'completo'},
  {d:'Mido más de 180° y menos de 360°.', a:'reflejo'}
];
let reglaIdx=0;
function buildRegla(){ const c=document.getElementById('widget-regla'); if(!c) return; reglaIdx=0; showRegla(); }
function showRegla(){ const c=document.getElementById('widget-regla'); if(!c) return; const it=_reglaData[reglaIdx%_reglaData.length]; const opts=_shuffle(['agudo','recto','obtuso','llano','reflejo','completo']); c.innerHTML=`<div class="wv-card"><div class="wr-desc" style="font-size:1.05rem;font-weight:700;margin-bottom:0.5rem;">🗣️ "${it.d}"</div><div class="wv-q">¿Qué ángulo soy?</div><div class="wv-opts">${opts.map(o=>`<button class="btn btn-pri" onclick="ansRegla('${o}')">${o}</button>`).join('')}</div><div class="fb" id="fbReg" role="alert"></div><div style="margin-top:0.5rem;font-size:0.82rem;color:var(--gray);">📏 Aciertos: <span id="regScore">${reglaIdx}</span> de 6</div></div>`; }
function ansRegla(o){ const it=_reglaData[reglaIdx%_reglaData.length]; if(o===it.a){ sfx('ok'); if(reglaIdx<6 && !xpTracker.wReg.has(reglaIdx)){ xpTracker.wReg.add(reglaIdx); pts(2); } fb('fbReg',`¡Correcto! Soy el ángulo ${it.a}.`,true); reglaIdx++; if(reglaIdx>=6) fin('s-widgets'); setTimeout(showRegla,1150); } else { sfx('no'); fb('fbReg',`No, soy el ángulo ${it.a}.`,false); } }

// ===================== RETO FINAL =====================
const retoPairs=[
  {
    name:'Compara medidas 📐', hint:'Recuerda: recto=90°, llano=180°, completo=360°. Compara A con B',
    pool:[
      {w:'A: un ángulo recto vs B: 90°',t:'igual'},{w:'A: un ángulo agudo de 40° vs B: 90°',t:'menor'},{w:'A: un ángulo llano vs B: 90°',t:'mayor'},
      {w:'A: un ángulo obtuso de 120° vs B: 180°',t:'menor'},{w:'A: un ángulo completo vs B: 180°',t:'mayor'},{w:'A: un ángulo llano vs B: 180°',t:'igual'},
      {w:'A: un ángulo agudo de 89° vs B: un ángulo recto',t:'menor'},{w:'A: un ángulo obtuso de 100° vs B: un ángulo recto',t:'mayor'},{w:'A: dos ángulos rectos vs B: un ángulo llano',t:'igual'},
      {w:'A: un ángulo de 45° vs B: 45°',t:'igual'},{w:'A: un ángulo reflejo de 200° vs B: 180°',t:'mayor'},{w:'A: un ángulo de 30° vs B: 60°',t:'menor'}
    ]
  },
  {
    name:'Complemento vs B 🔗', hint:'El complemento de A = 90° − A. Calcula y compáralo con B',
    pool:[
      {w:'A: complemento de 30° vs B: 60°',t:'igual'},{w:'A: complemento de 40° vs B: 60°',t:'menor'},{w:'A: complemento de 20° vs B: 60°',t:'mayor'},
      {w:'A: complemento de 45° vs B: 45°',t:'igual'},{w:'A: complemento de 10° vs B: 90°',t:'menor'},{w:'A: complemento de 25° vs B: 50°',t:'mayor'},
      {w:'A: complemento de 60° vs B: 30°',t:'igual'},{w:'A: complemento de 70° vs B: 30°',t:'menor'},{w:'A: complemento de 15° vs B: 70°',t:'mayor'},
      {w:'A: complemento de 50° vs B: 40°',t:'igual'},{w:'A: complemento de 80° vs B: 20°',t:'menor'},{w:'A: complemento de 35° vs B: 50°',t:'mayor'}
    ]
  },
  {
    name:'Suplemento vs B ↔️', hint:'El suplemento de A = 180° − A. Calcula y compáralo con B',
    pool:[
      {w:'A: suplemento de 120° vs B: 60°',t:'igual'},{w:'A: suplemento de 100° vs B: 60°',t:'mayor'},{w:'A: suplemento de 150° vs B: 60°',t:'menor'},
      {w:'A: suplemento de 90° vs B: 90°',t:'igual'},{w:'A: suplemento de 130° vs B: 40°',t:'mayor'},{w:'A: suplemento de 160° vs B: 30°',t:'menor'},
      {w:'A: suplemento de 45° vs B: 135°',t:'igual'},{w:'A: suplemento de 70° vs B: 100°',t:'mayor'},{w:'A: suplemento de 140° vs B: 50°',t:'menor'},
      {w:'A: suplemento de 80° vs B: 100°',t:'igual'},{w:'A: suplemento de 110° vs B: 60°',t:'mayor'},{w:'A: suplemento de 170° vs B: 20°',t:'menor'}
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
function _tgRint(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
function _tgLines(n){ let s=''; for(let i=0;i<n;i++) s+='<div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.4rem;height:1.3rem;">&nbsp;</div>'; return s; }
function _tgTask(out,i,inner){ const div=document.createElement('div'); div.className='tg-task'; div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content">${inner}</div>`; out.appendChild(div); }
function _instrBlock(out,title,lines){ const ib=document.createElement('div'); ib.className='tg-instruction-block'; ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join(''); out.appendChild(ib); }
const pensamientoTaskDB=[
  {q:'Pedro dice: "un ángulo de 90° es agudo porque es pequeño". ¿Tiene razón? Explica.',ans:'No. 90° es exactamente un ángulo RECTO. Los agudos miden MENOS de 90°.',type:'🔎 Detectar error'},
  {q:'Un ángulo y su complemento son iguales. ¿Cuánto mide cada uno? Explica.',ans:'45° cada uno, porque 45° + 45° = 90° (complementarios).',type:'🕵️ Ángulo misterioso'},
  {q:'¿Puede un triángulo tener dos ángulos rectos? Justifica tu respuesta.',ans:'No. 90° + 90° = 180° y no quedarían grados para el tercer ángulo (los tres suman 180°).',type:'🧠 Razonar'},
  {q:'Explica los pasos para dibujar con el transportador un ángulo de 120°.',ans:'Respuesta variable: centro del transportador en el vértice, 0° sobre un lado, marcar 120° y trazar el segundo lado.',type:'📐 Con transportador'},
  {q:'Inventa una situación de la vida real donde se use un ángulo recto y explícala.',ans:'Respuesta variable. Ej: la esquina de una ventana, el cruce de dos calles perpendiculares.',type:'✏️ Crear problema'},
  {q:'Un ángulo mide 200°. ¿Es posible? ¿Cómo se llama? Explica.',ans:'Sí es posible: es un ángulo REFLEJO (mide más de 180° y menos de 360°).',type:'🧠 Razonar'}
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
function genTask(){ sfx('click'); const type=document.getElementById('tgType').value; const count=parseInt(document.getElementById('tgCount').value); ansVisible=false; const out=document.getElementById('tgOut'); out.innerHTML=''; if(type==='tipos') genTiposTask(out,count); else if(type==='complemento') genComplementoTask(out,count); else if(type==='suplemento') genSuplementoTask(out,count); else if(type==='suma') genSumaTask(out,count); else if(type==='pensamiento') genPensamientoTask(out,count); fin('s-tareas'); }
function genTiposTask(out,count){
  _instrBlock(out,'Instrucción — Clasificar ángulos',['Escribe si cada ángulo es agudo, recto, obtuso, llano, reflejo o completo.','<strong>Recuerda:</strong> agudo &lt;90° · recto =90° · obtuso 90°–180° · llano =180° · reflejo 180°–360° · completo =360°']);
  const pool=[15,30,45,60,75,89,90,100,120,135,150,170,180,200,270,360];
  for(let i=0;i<count;i++){ const g=pool[_tgRint(0,pool.length-1)]; _tgTask(out,i,`<strong>¿Qué tipo de ángulo mide ${g}°?</strong>${_tgLines(1)}<div class="tg-answer">✔ ángulo ${_tipoAngulo(g)}</div>`); }
}
function genComplementoTask(out,count){
  _instrBlock(out,'Instrucción — Complemento',['Calcula el complemento de cada ángulo: lo que le falta para llegar a 90°.','<strong>Fórmula:</strong> complemento = 90° − ángulo']);
  for(let i=0;i<count;i++){ const a=_tgRint(5,85); _tgTask(out,i,`<strong>Complemento de ${a}°</strong>${_tgLines(1)}<div class="tg-answer">✔ 90° − ${a}° = ${90-a}°</div>`); }
}
function genSuplementoTask(out,count){
  _instrBlock(out,'Instrucción — Suplemento',['Calcula el suplemento de cada ángulo: lo que le falta para llegar a 180°.','<strong>Fórmula:</strong> suplemento = 180° − ángulo']);
  for(let i=0;i<count;i++){ const a=_tgRint(10,170); _tgTask(out,i,`<strong>Suplemento de ${a}°</strong>${_tgLines(1)}<div class="tg-answer">✔ 180° − ${a}° = ${180-a}°</div>`); }
}
function genSumaTask(out,count){
  _instrBlock(out,'Instrucción — Suma de ángulos',['Halla el ángulo que falta. En un triángulo los tres ángulos suman 180°; sobre una línea recta también suman 180°.','<strong>Pista:</strong> resta los ángulos conocidos del total.']);
  for(let i=0;i<count;i++){
    if(i%2===0){ let a=_tgRint(30,80), b=_tgRint(30,80); while(a+b>=175) b=_tgRint(30,80); _tgTask(out,i,`<strong>Un triángulo tiene ángulos de ${a}° y ${b}°. ¿Cuánto mide el tercero?</strong>${_tgLines(1)}<div class="tg-answer">✔ 180° − ${a}° − ${b}° = ${180-a-b}°</div>`); }
    else{ const a=_tgRint(20,150); _tgTask(out,i,`<strong>Dos ángulos sobre una recta: uno mide ${a}°. ¿Cuánto mide el otro?</strong>${_tgLines(1)}<div class="tg-answer">✔ 180° − ${a}° = ${180-a}°</div>`); }
  }
}
function toggleAns(){ ansVisible=!ansVisible; document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none'); sfx('click'); }

// ===================== SOPA DE LETRAS (generador con validación) =====================
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
  ['AGUDO','OBTUSO','RECTO','LLANO','VERTICE','GRADO','LADO','ANGULO'],
  ['MEDIR','COMPAS','REGLA','BISECTRIZ','COMPLETO','REFLEJO','ABERTURA','RAYO']
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
  {q:'Un ángulo recto mide exactamente 90°.',a:true},
  {q:'Un ángulo agudo mide más de 90°.',a:false},
  {q:'El ángulo llano mide 180° y forma una línea recta.',a:true},
  {q:'El transportador sirve para medir longitudes.',a:false},
  {q:'Dos ángulos complementarios suman 90°.',a:true},
  {q:'Un ángulo obtuso mide menos de 90°.',a:false},
  {q:'El vértice es el punto donde se unen los lados de un ángulo.',a:true},
  {q:'Un ángulo completo mide 180°.',a:false},
  {q:'Dos ángulos suplementarios suman 180°.',a:true},
  {q:'La bisectriz divide un ángulo en dos partes iguales.',a:true}
];
const evalMCBank=[
  {q:'¿Cuánto mide un ángulo recto?',o:['a) 45°','b) 90°','c) 180°','d) 360°'],a:1},
  {q:'Un ángulo de 150° es:',o:['a) agudo','b) recto','c) obtuso','d) llano'],a:2},
  {q:'¿Qué instrumento mide ángulos?',o:['a) la regla','b) el compás','c) el transportador','d) la balanza'],a:2},
  {q:'El complemento de 70° es:',o:['a) 110°','b) 20°','c) 30°','d) 90°'],a:1},
  {q:'El suplemento de 80° es:',o:['a) 100°','b) 20°','c) 10°','d) 120°'],a:0},
  {q:'Un ángulo llano mide:',o:['a) 90°','b) 180°','c) 270°','d) 360°'],a:1},
  {q:'El punto de unión de los dos lados se llama:',o:['a) grado','b) lado','c) vértice','d) arco'],a:2},
  {q:'Un ángulo que mide 250° es:',o:['a) obtuso','b) llano','c) reflejo','d) completo'],a:2}
];
const evalCPBank=[
  {q:'Un ángulo recto mide ___ grados.',a:'90',acc:['90','noventa']},
  {q:'El instrumento que mide ángulos es el ___.',a:'transportador',acc:['transportador','el transportador']},
  {q:'Un ángulo agudo mide menos de ___ grados.',a:'90',acc:['90','noventa']},
  {q:'Dos ángulos que suman 90° se llaman ___.',a:'complementarios',acc:['complementarios','complementario']},
  {q:'El ángulo ___ mide 180° y forma una línea recta.',a:'llano',acc:['llano']},
  {q:'El punto donde se unen los lados de un ángulo es el ___.',a:'vértice',acc:['vertice','el vertice']},
  {q:'Dos ángulos que suman 180° se llaman ___.',a:'suplementarios',acc:['suplementarios','suplementario']},
  {q:'La ___ divide un ángulo en dos partes iguales.',a:'bisectriz',acc:['bisectriz','la bisectriz']}
];
const evalPRBank=[
  {term:'Ángulo agudo',def:'Mide menos de 90°'},
  {term:'Ángulo recto',def:'Mide exactamente 90°'},
  {term:'Ángulo obtuso',def:'Mide más de 90° y menos de 180°'},
  {term:'Ángulo llano',def:'Mide 180° (línea recta)'},
  {term:'Transportador',def:'Instrumento para medir ángulos'},
  {term:'Bisectriz',def:'Recta que divide el ángulo en dos partes iguales'}
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación Ángulos: Tipos y Transportador · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:12pt;color:#111;background:#fff;padding:4mm 6mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.5rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;color:#1565c0;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:#1565c0;margin-top:0.15rem;font-weight:700;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.5rem 0 0.25rem;border-left:4px solid #1565c0;background:#e3f2fd;display:flex;justify-content:space-between;align-items:center;color:#1565c0;}.qn{font-weight:700;min-width:22px;flex-shrink:0;color:#1565c0;}.tf-row{display:flex;align-items:flex-start;gap:0.3rem;font-size:10.5pt;line-height:1.4;padding:0.25rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:42px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.2rem;margin-top:0.2rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.28rem 0.45rem;margin-bottom:0.22rem;break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.4;display:flex;gap:0.3rem;margin-bottom:0.18rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.22rem 0.55rem;}.mc-opts{display:grid;grid-template-columns:repeat(3,1fr);gap:0.08rem 0.25rem;margin-left:1.3rem;}.mc-opt{font-size:9.5pt;display:flex;align-items:center;gap:0.22rem;}.mc-opt input{width:12px;height:12px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.4;padding:0.22rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:130px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{break-inside:avoid;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.2rem 0.5rem;margin-top:0.15rem;}.pr-head{font-size:9pt;font-weight:700;color:#1565c0;margin-bottom:0.2rem;}.pr-item{font-size:10pt;padding:0.22rem 0.32rem;background:#e3f2fd;border-radius:3px;margin-bottom:0.12rem;display:flex;align-items:center;gap:0.22rem;line-height:1.2;}.pr-num{font-weight:700;color:#1565c0;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #1565c0;padding-bottom:0.35rem;margin-bottom:0.5rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;color:#1565c0;}.p-sub{font-size:9pt;color:#1565c0;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #cce0ff;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;color:#1565c0;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#1565c0;}.pa{color:#007a00;font-weight:700;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:#1565c0;font-weight:700;font-style:italic;}.obt-lbl{font-weight:700;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #1565c0;height:12px;}.obt-pct{font-weight:700;}.total-row{display:flex;align-items:baseline;justify-content:flex-end;gap:7px;font-size:11pt;color:#1565c0;font-weight:700;font-style:italic;margin-top:0.4rem;padding:0.2rem 0.5rem;background:#e3f2fd;border-radius:4px;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #1565c0;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · Misión Ángulos: Tipos y Transportador · Matemática</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 4 secciones × 5 preguntas × 5 pts c/u · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✔ PAUTA DOCENTE — Evaluación Final · Ángulos: Tipos y Transportador · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">100 pts | 4 secciones × 5 preguntas × 5 pts | Matemáticas · Educación Básica</div></div><div class="p-grid">${pR}</div>
  ${zgBlock}</div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("evalPage",252,0.55,1.45);fit("pautaPage",252,0.55,1.3);})();<\/script></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(doc); win.document.close(); setTimeout(()=>win.print(),400);
}

// ===================== EXPLICA CON TUS PALABRAS =====================
const explicaData = [
  {
    q: '¿Por qué un ángulo de 90° se llama recto y no agudo ni obtuso?',
    hint: '💡 Pista: compara 90° con los límites de agudo y obtuso.',
    rubric: ['✓ Indica que agudo es MENOS de 90° y obtuso es MÁS de 90°', '✓ Observa que 90° es el valor exacto que separa a ambos', '✓ Concluye que ese valor exacto se llama ángulo recto'],
    suggested: 'Un ángulo agudo mide menos de 90° y uno obtuso más de 90°. Como 90° es el valor exacto que está justo en medio, no cabe en ninguno de los dos: por eso tiene su propio nombre, ángulo recto.'
  },
  {
    q: 'Explica los pasos para medir correctamente un ángulo con el transportador.',
    hint: '💡 Pista: piensa dónde va el centro y desde dónde se cuenta.',
    rubric: ['✓ Coloca el centro del transportador en el vértice', '✓ Alinea el 0° con uno de los lados', '✓ Lee el número por donde pasa el otro lado'],
    suggested: 'Primero pongo el centro del transportador exactamente en el vértice del ángulo. Luego alineo la línea del 0° con uno de los lados. Por último leo el número de grados por donde pasa el otro lado.'
  },
  {
    q: 'Un ángulo mide 40°. Explica cómo hallar su complemento y su suplemento.',
    hint: '💡 Pista: el complemento llega a 90° y el suplemento a 180°.',
    rubric: ['✓ Complemento = 90° − 40° = 50°', '✓ Suplemento = 180° − 40° = 140°', '✓ Explica que complementarios suman 90° y suplementarios 180°'],
    suggested: 'El complemento es lo que falta para 90°: 90 − 40 = 50°. El suplemento es lo que falta para 180°: 180 − 40 = 140°. Dos ángulos son complementarios si suman 90° y suplementarios si suman 180°.'
  },
  {
    q: '¿Por qué la suma de los tres ángulos de un triángulo siempre es 180°? Da un ejemplo.',
    hint: '💡 Pista: usa un triángulo con dos ángulos conocidos.',
    rubric: ['✓ Afirma que los tres ángulos internos suman 180°', '✓ Da un ejemplo con valores que sumen 180°', '✓ Muestra cómo hallar el tercero restando de 180°'],
    suggested: 'En todo triángulo los tres ángulos internos suman 180°. Por ejemplo, si dos miden 60° y 70°, el tercero es 180 − 60 − 70 = 50°. Así siempre completan 180°.'
  },
  {
    q: 'Explica la diferencia entre un ángulo llano (180°) y un ángulo completo (360°).',
    hint: '💡 Pista: piensa en una línea recta y en una vuelta entera.',
    rubric: ['✓ El llano mide 180° y forma una línea recta', '✓ El completo mide 360° y es una vuelta entera', '✓ El completo es el doble del llano'],
    suggested: 'El ángulo llano mide 180° y sus lados forman una línea recta (media vuelta). El ángulo completo mide 360°, que es una vuelta entera donde los dos lados vuelven a coincidir. El completo es el doble del llano.'
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

// ===================== PRUEBA OPERATIVA — ÁNGULOS =====================
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
  const raw = (student || '').toString().trim().replace(/[,\s°]/g, '');
  if (!raw) return false;
  const n = parseInt(raw, 10);
  return !isNaN(n) && n === expectedNum;
}
// I. Complemento y suplemento (5 × 10 = 50 pts)
function genCompSuplItems() {
  const items = [];
  for (let i = 0; i < 5; i++) {
    if (i % 2 === 0) { const a = _opRint(10, 80); items.push({ text: `El complemento de ${a}° es ▢`, ansNum: 90 - a }); }
    else { const a = _opRint(20, 170); items.push({ text: `El suplemento de ${a}° es ▢`, ansNum: 180 - a }); }
  }
  return items;
}
// II. Problemas breves (5 × 4 = 20 pts)
function genProblemaItems() {
  const items = [];
  const tipos = _shuffleF([0, 1, 2, 3, 4], _opRnd);
  const DIV90 = [2, 3, 5, 6, 9, 10], DIV180 = [2, 3, 4, 5, 6];
  tipos.forEach(tp => {
    let text, ansNum;
    if (tp === 0) { const a = _opRint(20, 70); text = `Un ángulo mide ${a}°. ¿Cuánto le falta para ser un ángulo recto (90°)?`; ansNum = 90 - a; }
    else if (tp === 1) { const a = _opRint(20, 150); text = `Un ángulo mide ${a}°. ¿Cuánto le falta para ser un ángulo llano (180°)?`; ansNum = 180 - a; }
    else if (tp === 2) { let a = _opRint(30, 80), b = _opRint(30, 80); while (a + b >= 175) b = _opRint(30, 80); text = `Dos ángulos de un triángulo miden ${a}° y ${b}°. ¿Cuánto mide el tercero?`; ansNum = 180 - a - b; }
    else if (tp === 3) { const n = DIV90[_opRint(0, DIV90.length - 1)]; text = `Un ángulo recto (90°) se divide en ${n} ángulos iguales. ¿Cuánto mide cada uno?`; ansNum = 90 / n; }
    else { const n = DIV180[_opRint(0, DIV180.length - 1)]; text = `Un ángulo llano (180°) se divide en ${n} ángulos iguales. ¿Cuánto mide cada uno?`; ansNum = 180 / n; }
    items.push({ text, ansNum });
  });
  return items;
}
// III. Cadena de operaciones (5 × 2 = 10 pts)
function genCadenaItems() {
  const items = [];
  for (let i = 0; i < 5; i++) {
    const tp = i % 3;
    if (tp === 0) { const a = _opRint(20, 60); items.push({ text: `Suma el complemento de ${a}° más 20°. ¿Cuánto obtienes?`, ansNum: (90 - a) + 20 }); }
    else if (tp === 1) { const a = _opRint(100, 160); items.push({ text: `Al ángulo de 100° réstale el suplemento de ${a}°. ¿Cuánto obtienes?`, ansNum: 100 - (180 - a) }); }
    else { const a = _opRint(20, 40); items.push({ text: `El doble de un ángulo de ${a}°, ¿cuánto mide?`, ansNum: a * 2 }); }
  }
  return items;
}
// IV. ¿Qué ángulo se esconde? (5 × 2 = 10 pts)
function genFaltanteItems() {
  const items = [];
  const DIV90 = [2, 3, 5, 6], DIV180 = [2, 3, 4, 5, 6];
  const forms = [0, 1, 2, 3, _opRint(0, 3)];
  forms.forEach(f => {
    let expr, ansNum;
    if (f === 0) { const a = _opRint(20, 70); expr = `${a}° + ▢ = 90°`; ansNum = 90 - a; }
    else if (f === 1) { const a = _opRint(30, 150); expr = `${a}° + ▢ = 180°`; ansNum = 180 - a; }
    else if (f === 2) { const n = DIV90[_opRint(0, DIV90.length - 1)]; expr = `${n} ángulos iguales forman 90°; cada uno mide ▢`; ansNum = 90 / n; }
    else { const n = DIV180[_opRint(0, DIV180.length - 1)]; expr = `${n} ángulos iguales forman 180°; cada uno mide ▢`; ansNum = 180 / n; }
    items.push({ expr, ansNum });
  });
  return items;
}
// V. Triángulos (2 × 5 = 10 pts)
function genTrianguloItems() {
  const items = [];
  for (let i = 0; i < 2; i++) {
    let a = _opRint(30, 80), b = _opRint(30, 80); while (a + b >= 175) b = _opRint(30, 80);
    items.push({ text: `Un triángulo tiene ángulos de ${a}° y ${b}°. El tercero mide ▢`, ansNum: 180 - a - b, extra: `${a}° + ${b}° + ${180 - a - b}° = 180°` });
  }
  return items;
}
function genEvalOp() {
  sfx('click');
  _injectFormaSel('genEvalOp', 'evalOpFormaSel', evalOpFormNum, function (v) { evalOpFormNum = v; });
  const _sO = document.getElementById('evalOpFormaSel');
  if (_sO && parseInt(_sO.value, 10)) evalOpFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sO.value, 10)));
  const cf = evalOpFormNum; window._currentEvalOpForm = cf; _opRnd = _evalRng(100000 + cf); evalOpFormNum = (evalOpFormNum % EVAL_FORMAS) + 1; _injectFormaSel('genEvalOp', 'evalOpFormaSel', evalOpFormNum, function (v) { evalOpFormNum = v; }); saveProgress();
  document.getElementById('evalop-screen-title').textContent = `📐 Prueba Operativa — Forma ${cf} · Ángulos: Tipos y Transportador`;
  evalOpAnsVisible = false;
  const out = document.getElementById('evalOpOut'); out.innerHTML = '';

  const csItems = genCompSuplItems();
  const s1 = document.createElement('div');
  s1.innerHTML = '<div class="eval-section-title">I. Complemento y suplemento <span class="eval-pts">50 pts · 10 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Complemento = 90° − ángulo · Suplemento = 180° − ángulo.</p>';
  csItems.forEach((it, i) => { const d = document.createElement('div'); d.className = 'eval-item eval-auto-item'; d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.text}</span><input class="eval-cp-input" type="text" data-cs="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${it.ansNum}°</div><div class="eval-item-feedback" id="evalFbCs${i}" aria-live="polite"></div>`; s1.appendChild(d); });
  out.appendChild(s1);

  const prItems = genProblemaItems();
  const s2 = document.createElement('div');
  s2.innerHTML = '<div class="eval-section-title">II. Problemas breves <span class="eval-pts">20 pts · 4 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Piensa si debes restar de 90°, de 180° o repartir en partes iguales.</p>';
  prItems.forEach((it, i) => { const d = document.createElement('div'); d.className = 'eval-item eval-auto-item'; d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.text}</span><input class="eval-cp-input" type="text" data-pr="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${it.ansNum}°</div><div class="eval-item-feedback" id="evalFbPr${i}" aria-live="polite"></div>`; s2.appendChild(d); });
  out.appendChild(s2);

  const caItems = genCadenaItems();
  const s3 = document.createElement('div');
  s3.innerHTML = '<div class="eval-section-title">III. Cadena de operaciones <span class="eval-pts">10 pts · 2 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Resuelve paso a paso: primero el complemento o suplemento, luego la operación indicada.</p>';
  caItems.forEach((it, i) => { const d = document.createElement('div'); d.className = 'eval-item eval-auto-item'; d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.text}</span><input class="eval-cp-input" type="text" data-ca="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${it.ansNum}°</div><div class="eval-item-feedback" id="evalFbCa${i}" aria-live="polite"></div>`; s3.appendChild(d); });
  out.appendChild(s3);

  const faItems = genFaltanteItems();
  const s4 = document.createElement('div');
  s4.innerHTML = '<div class="eval-section-title">IV. ¿Qué ángulo se esconde en ▢? <span class="eval-pts">10 pts · 2 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Usa la operación inversa: resta o divide según corresponda.</p>';
  faItems.forEach((it, i) => { const d = document.createElement('div'); d.className = 'eval-item eval-auto-item'; d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.expr}</span><input class="eval-cp-input" type="text" data-fa="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${it.ansNum}°</div><div class="eval-item-feedback" id="evalFbFa${i}" aria-live="polite"></div>`; s4.appendChild(d); });
  out.appendChild(s4);

  const trItems = genTrianguloItems();
  const s5 = document.createElement('div');
  s5.innerHTML = '<div class="eval-section-title">V. Ángulos de un triángulo <span class="eval-pts">10 pts · 5 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Los tres ángulos internos de un triángulo siempre suman 180°.</p>';
  trItems.forEach((it, i) => { const d = document.createElement('div'); d.className = 'eval-item eval-auto-item'; d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.text}</span><input class="eval-cp-input" type="text" data-tr="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${it.ansNum}° (${it.extra})</div><div class="eval-item-feedback" id="evalFbTr${i}" aria-live="polite"></div>`; s5.appendChild(d); });
  out.appendChild(s5);

  window._evalOpData = { csItems, prItems, caItems, faItems, trItems };
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
  let total = 0; const det = { cs: 0, pr: 0, ca: 0, fa: 0, tr: 0 };
  const _mark = (sel, it, i, key, ptsEach, fbId) => {
    const el = document.querySelector(`[data-${sel}="${i}"]`);
    const ok = _isIntMatch(el ? el.value : '', it.ansNum);
    if (el) { el.classList.toggle('eval-input-ok', ok); el.classList.toggle('eval-input-no', !ok); }
    if (ok) { det[key]++; total += ptsEach; }
    setEvalFeedback(fbId + i, ok, ok ? `Correcto. +${ptsEach} pts` : 'Revisar. R/ ' + it.ansNum + '°');
  };
  d.csItems.forEach((it, i) => _mark('cs', it, i, 'cs', 10, 'evalFbCs'));
  d.prItems.forEach((it, i) => _mark('pr', it, i, 'pr', 4, 'evalFbPr'));
  d.caItems.forEach((it, i) => _mark('ca', it, i, 'ca', 2, 'evalFbCa'));
  d.faItems.forEach((it, i) => _mark('fa', it, i, 'fa', 2, 'evalFbFa'));
  d.trItems.forEach((it, i) => _mark('tr', it, i, 'tr', 5, 'evalFbTr'));
  const res = document.getElementById('evalOpAutoResult');
  if (res) { res.className = 'eval-auto-result ' + (total >= 70 ? 'eval-auto-pass' : 'eval-auto-risk'); res.innerHTML = `<strong>Resultado: ${total}/100 pts</strong><br><span>Comp./Supl.: ${det.cs*10}/50 · Problemas: ${det.pr*4}/20 · Cadena: ${det.ca*2}/10 · Escondido: ${det.fa*2}/10 · Triángulos: ${det.tr*5}/10</span>`; }
  if (total >= 70) { pts(8); showToast('🎯 Prueba operativa calificada: ' + total + '/100'); }
  else showToast('🧮 Prueba operativa: ' + total + '/100. Revisa los ítems marcados.');
}
function printEvalOp() {
  if (!window._evalOpData) { showToast('⚠️ Genera una prueba operativa primero'); return; }
  sfx('click');
  const forma = window._currentEvalOpForm || 1; const d = window._evalOpData;
  let s1 = `<div class="sec-title"><span>I. Complemento y suplemento</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 50 pts</span></div></div><p class="opx-instr">Complemento = 90° − ángulo · Suplemento = 180° − ángulo. 10 pts c/u.</p>`;
  d.csItems.forEach((it, i) => { s1 += `<div class="opx-print-row"><span class="qn">${i+1}.</span><span class="prb-text">${it.text}</span><span class="opx-blank"></span></div>`; });
  let s2 = `<div class="sec-title"><span>II. Problemas breves</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Resuelve y escribe la respuesta. 4 pts c/u.</p>`;
  d.prItems.forEach((it, i) => { s2 += `<div class="opx-print-row"><span class="qn">${i+1}.</span><span class="prb-text">${it.text}</span><span class="opx-blank"></span></div>`; });
  const caTbl = (items) => `<table class="rnd-tbl"><tr><th>#</th><th>Cadena de operaciones</th><th>Resultado</th></tr>${items.map((it, i) => `<tr><td>${i+1}</td><td>${it.text.replace(' ¿Cuánto obtienes?','').replace(', ¿cuánto mide?','')}</td><td></td></tr>`).join('')}</table>`;
  let s3 = `<div class="sec-title"><span>III. Cadena de operaciones</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10 pts</span></div></div><p class="opx-instr">Resuelve paso a paso. 2 pts c/u.</p>${caTbl(d.caItems)}`;
  const faTbl = (items) => `<table class="rnd-tbl"><tr><th>#</th><th>Operación</th><th>▢ =</th></tr>${items.map((it, i) => `<tr><td>${i+1}</td><td>${it.expr}</td><td></td></tr>`).join('')}</table>`;
  let s4 = `<div class="sec-title"><span>IV. ¿Qué ángulo se esconde en ▢?</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10 pts</span></div></div><p class="opx-instr">Usa la operación inversa. 2 pts c/u.</p>${faTbl(d.faItems)}`;
  const trTbl = (items) => `<table class="rnd-tbl"><tr><th>#</th><th>Triángulo</th><th>Tercer ángulo</th></tr>${items.map((it, i) => `<tr><td>${i+1}</td><td>${it.text.replace(' El tercero mide ▢','')}</td><td></td></tr>`).join('')}</table>`;
  let s5 = `<div class="sec-title"><span>V. Ángulos de un triángulo</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10 pts</span></div></div><p class="opx-instr">Los tres ángulos suman 180°. 5 pts c/u.</p>${trTbl(d.trItems)}`;
  let pR = '';
  pR += `<div class="p-sec"><div class="p-ttl">I. Complemento y suplemento</div><table class="p-tbl">${d.csItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${it.ansNum}°</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">II. Problemas breves</div><table class="p-tbl">${d.prItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${it.ansNum}°</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">III. Cadena de operaciones</div><table class="p-tbl">${d.caItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${it.ansNum}°</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">IV. Ángulo escondido</div><table class="p-tbl">${d.faItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">▢ = ${it.ansNum}°</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec" style="grid-column:1/-1;"><div class="p-ttl">V. Triángulos</div><table class="p-tbl">${d.trItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">▢ = ${it.ansNum}° · ${it.extra}</td></tr>`).join('')}</table></div>`;
  const doc = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Prueba Operativa Ángulos: Tipos y Transportador · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11.5pt;color:#111;background:#fff;padding:4mm 6mm;}.ph{margin-bottom:0.5rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;color:#1565c0;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:#1565c0;margin-top:0.15rem;font-weight:700;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.45rem 0 0.2rem;border-left:4px solid #1565c0;background:#e3f2fd;display:flex;justify-content:space-between;align-items:center;color:#1565c0;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:#1565c0;font-weight:700;font-style:italic;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #1565c0;height:12px;}.qn{font-weight:700;min-width:20px;display:inline-block;color:#1565c0;flex-shrink:0;}.opx-instr{font-size:9pt;color:#555;margin-bottom:0.22rem;}.opx-blank{display:inline-block;width:80px;flex:none;border-bottom:1.5px solid #111;min-height:13px;margin-left:0.3rem;}.opx-print-row{display:flex;align-items:baseline;gap:0.4rem;font-size:10pt;padding:0.24rem 0.1rem;border-bottom:1px dotted #ddd;}.prb-text{flex:1;line-height:1.35;}.rnd-tbl{width:100%;border-collapse:collapse;font-size:9.5pt;margin-top:0.15rem;}.rnd-tbl th,.rnd-tbl td{border:1px solid #bbb;padding:0.16rem 0.35rem;text-align:left;}.rnd-tbl th{background:#e3f2fd;color:#1565c0;font-size:8.5pt;}.total-row{display:flex;align-items:baseline;justify-content:flex-end;gap:7px;font-size:11pt;color:#1565c0;font-weight:700;font-style:italic;margin-top:0.45rem;padding:0.2rem 0.5rem;background:#e3f2fd;border-radius:4px;}.total-row .obt-line{min-width:80px;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #1565c0;padding-bottom:0.3rem;margin-bottom:0.5rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;color:#1565c0;}.p-sub{font-size:9pt;color:#1565c0;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #cce0ff;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;color:#1565c0;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#1565c0;}.pa{color:#007a00;font-weight:700;font-family:'Courier New',monospace;}.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:8mm 10mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Examen de Matemáticas — Prueba Operativa · Ángulos: Tipos y Transportador · Educación Básica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 pts · I: 50 · II: 20 · III: 10 · IV: 10 · V: 10 · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✔ PAUTA — Prueba Operativa · Ángulos: Tipos y Transportador · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">100 pts · Matemáticas · Educación Básica</div></div><div class="p-grid">${pR}</div></div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("evalPage",250,0.55,1.2);fit("pautaPage",250,0.55,1.2);})();<\/script></body></html>`;
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
  const msgs=['💡 ¡ÁNIMO! Comienza tu misión. ¡Cada paso cuenta!','🌱 ¡GRAN INICIO! Estás dando los primeros pasos.','🔑 ¡BUEN TRABAJO! Vas progresando muy bien.','💪 ¡MUY BIEN! Dominas gran parte del contenido.','🏅 ¡INCREÍBLE avance! Estás cerca de la excelencia.','🎓 ¡EXTRAORDINARIO! Completaste TODA la misión. ¡Eres experto en Ángulos y el Transportador!'];
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
  const txt=`${stars} CONSTANCIA DE LOGRO ${stars}\n\n📚 Misión: Ángulos — Tipos y Transportador\n👤 Estudiante: ${name}\n📊 Progreso: ${pct}% completado\n⭐ XP obtenido: ${xp} de ${MXP}${achText?'\n\n🏆 Logros desbloqueados:\n'+achText:''}\n\n${msg}\n\n📅 ${date}\n🏠 Proyecto Educativo M.E.T.A.S\n🌐 policastsapien.com`;
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
  buildLabAngulos(); buildLabTransportador();
  buildVelocidad(); buildCompSupl(); buildRegla();
  _retoPairLbl();
  document.addEventListener('click',function(e){ const panel=document.getElementById('achPanel'); const btn=document.getElementById('achBtn'); if(panel.classList.contains('open')&&!panel.contains(e.target)&&e.target!==btn) panel.classList.remove('open'); });
  document.addEventListener('click',function(e){ if(e.target===document.getElementById('diplomaOverlay')) closeDiploma(); });
  const savedName=localStorage.getItem('nombreEstudianteAngulos');
  const inputName=document.querySelector('.diploma-input');
  if(savedName&&inputName){ inputName.value=savedName; updateDiplomaName(savedName); }
  if(inputName) inputName.addEventListener('input',e=>localStorage.setItem('nombreEstudianteAngulos',e.target.value));
  fin('s-aprende',false);
  fin('s-tipos',false);
  fin('s-errores',false);
});
(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalOp==='function') _injectFormaSel('genEvalOp','evalOpFormaSel',evalOpFormNum,function(v){evalOpFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();
