// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
// Compartir misión por WhatsApp
function compartirMision() {
    const url = window.location.href;
    const texto = `🚀 *Misión Asignada: Multiplicación y División de Fracciones* 🚀\n\nAprende a multiplicar y dividir fracciones: en línea recta para multiplicar y volteando la segunda para dividir. 🏆\n\nDesbloquea *todos los logros* y puedes poner *tus datos* para que tu maestro observe todos tus logros. 📋\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;
    _waShare(texto);
}

// ===================== ACCESIBILIDAD =====================
function toggleLetra() {
  document.body.classList.toggle('letra-grande');
  if(typeof sfx === 'function') sfx('click');
  localStorage.setItem('prefLetraFraccionesMultDiv', document.body.classList.contains('letra-grande'));
}
window.addEventListener('DOMContentLoaded', () => {
  if(localStorage.getItem('prefLetraFraccionesMultDiv') === 'true') document.body.classList.add('letra-grande');
});

// ===================== UTILIDADES =====================
const _pick = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
const _shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
function fb(id, msg, isOk) {
  const el = document.getElementById(id);
  if(el) { el.textContent = msg; el.className = 'fb show ' + (isOk ? 'ok' : 'err'); }
}
// Máximo común divisor: es lo que simplifica cualquier fracción
function _mcdDe(a,b){ a=Math.abs(a); b=Math.abs(b); while(b){ const t=b; b=a%b; a=t; } return a||1; }
/* Toda fracción se muestra en su mínima expresión: es lo que el DCNB pide
   al terminar cualquier operación con fracciones. */
function _simpl(n,d){ const g=_mcdDe(n,d); return [n/g,d/g]; }
function _fmtFr(n,d){ const s=_simpl(n,d); return s[1]===1 ? String(s[0]) : s[0]+'/'+s[1]; }
/* Formas que se le aceptan al alumno: la simplificada, la sin simplificar y,
   si da entero, el entero. Escribir 6/8 cuando la respuesta es 3/4 no es un
   error de concepto: es no haber simplificado, y eso se avisa en la pauta. */
function _fracAcc(n,d){ const s=_simpl(n,d); const a=[s[0]+'/'+s[1], n+'/'+d]; if(s[1]===1) a.push(String(s[0])); return [...new Set(a)]; }

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY = 'matematica_fracciones_mult_div_v1';
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
  clasif_pro:{icon:'🍕',label:'Clasificador experto'},
  id_master:{icon:'🔍',label:'Identificador maestro'},
  reto_hero:{icon:'🏆',label:'Héroe del reto final'},
  nivel3:{icon:'🔪',label:'¡Repartidor alcanzado! Nivel 3'},
  nivel5:{icon:'🔥',label:'¡Campeón alcanzado! Nivel 6'}
};
function unlockAchievement(id){ if(unlockedAch.includes(id)) return; unlockedAch.push(id); sfx('ach'); showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label); launchConfetti(); renderAchPanel(); saveProgress(); }
function renderAchPanel(){ const list=document.getElementById('achList'); list.innerHTML=''; Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{ const div=document.createElement('div'); div.className='ach-item'+(unlockedAch.includes(id)?'':' locked'); div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`; list.appendChild(div); }); }
function toggleAchPanel(){ sfx('click'); document.getElementById('achPanel').classList.toggle('open'); }
function showToast(msg){ let t=document.querySelector('.toast'); if(!t){ t=document.createElement('div'); t.className='toast'; document.body.appendChild(t); } t.textContent=msg; t.style.display='block'; clearTimeout(t._tid); t._tid=setTimeout(()=>t.style.display='none',3200); }
function launchConfetti(){ const colors=['#1565c0','#00838f','#00b894','#fdcb6e','#6c5ce7']; for(let i=0;i<60;i++){ const c=document.createElement('div'); c.className='confetti-piece'; c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`; document.body.appendChild(c); c.addEventListener('animationend',()=>c.remove()); } }

// ===================== XP =====================
const lvls=[{t:0,n:'Novato ✏️'},{t:25,n:'Aprendiz 🍕'},{t:55,n:'Repartidor 🔪'},{t:90,n:'Cocinero 🧑‍🍳'},{t:130,n:'Experto 📊'},{t:165,n:'Campeón 🏅'},{t:190,n:'Maestro 🎓'}];
function pts(n){ xp=Math.max(0,Math.min(MXP,xp+n)); updateXPBar(); saveProgress(); }
function updateXPBar(){ const pct=Math.round((xp/MXP)*100); document.getElementById('xpFill').style.width=pct+'%'; const el=document.getElementById('xpPts'); el.textContent='⭐ '+xp; el.style.transform='scale(1.3)'; setTimeout(()=>el.style.transform='',300); let lv=0; for(let i=0;i<lvls.length;i++) if(xp>=lvls[i].t) lv=i; document.getElementById('xpLvl').textContent=lvls[lv].n; if(lv!==prevLevel){ if(lv>=2) unlockAchievement('nivel3'); if(lv>=5) unlockAchievement('nivel5'); prevLevel=lv; } }
function resetXP(){ sfx('click'); xp=0; updateXPBar(); showToast('🔄 XP reiniciado a 0'); }
function fin(id,showFX=true){ if(!done.has(id)){ done.add(id); const b=document.querySelector(`[data-s="${id}"]`); if(b) b.classList.add('done'); if(showFX){ sfx('up'); launchConfetti(); } saveProgress(); } }

// ===================== NAV =====================
function go(id){ sfx('click'); document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active')); document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{ b.classList.remove('active'); b.setAttribute('aria-selected','false'); }); document.getElementById(id).classList.add('active'); const btn=document.querySelector(`[data-s="${id}"]`); if(btn){ btn.classList.add('active'); btn.setAttribute('aria-selected','true'); } window.scrollTo({top:0,behavior:'smooth'}); if(id==='s-sopa') setTimeout(buildSopa,50); }

// ===================== FLASHCARD DATA =====================
const fcData=[
  {w:'Multiplicar fracciones',a:'🍕 se multiplica <strong>en línea recta</strong>: numerador por numerador y denominador por denominador. 2/3 × 4/5 = <strong>8/15</strong>. aquí NO se busca denominador común.'},
  {w:'Fracción por un natural',a:'✖️ el número entero se escribe con denominador 1. 3 × 2/5 = 3/1 × 2/5 = <strong>6/5</strong>.'},
  {w:'Recíproco (inverso)',a:'🔄 la misma fracción volteada. el recíproco de 3/4 es <strong>4/3</strong>, y el de 5 es <strong>1/5</strong>. multiplicados dan siempre 1.'},
  {w:'Dividir fracciones',a:'➗ se cambia el signo a por y se <strong>voltea la SEGUNDA</strong>: 2/3 ÷ 4/5 = 2/3 × 5/4 = <strong>10/12 = 5/6</strong>.'},
  {w:'Fracción mixta',a:'🔢 lleva entero y fracción, como 2 1/4. antes de multiplicar o dividir se vuelve <strong>impropia</strong>: 2 1/4 = 9/4.'},
  {w:'De mixta a impropia',a:'🧮 entero por denominador, más el numerador, sobre el mismo denominador: 3 2/5 = (3×5+2)/5 = <strong>17/5</strong>.'},
  {w:'Simplificar antes',a:'✂️ se puede cancelar en cruz antes de multiplicar: 3/8 × 4/9 → el 4 con el 8 (queda 1 y 2) y el 3 con el 9 (queda 1 y 3) = <strong>1/6</strong>. salen números chicos.'},
  {w:'Mínima expresión',a:'🎯 el resultado se divide entre el máximo común divisor: 8/12 ÷ 4 = <strong>2/3</strong>. la respuesta no está terminada hasta simplificarla.'},
  {w:'La palabra «de»',a:'🔑 en un problema, «<strong>de</strong>» casi siempre significa multiplicar. 2/3 <em>de</em> 15 lempiras = 2/3 × 15 = <strong>10</strong> lempiras.'},
  {w:'Multiplicar y encoger',a:'📉 al multiplicar por una fracción <strong>menor que 1</strong> el resultado es MENOR: 12 × 3/4 = 9. multiplicar no siempre agranda.'},
  {w:'Dividir y crecer',a:'📈 al dividir entre una fracción <strong>menor que 1</strong> el resultado es MAYOR: 6 ÷ 1/2 = 12. ¿cuántos medios caben en 6? doce.'},
  {w:'Propiedad conmutativa',a:'🔁 el orden de los factores no cambia el producto: 2/3 × 5/7 es lo mismo que 5/7 × 2/3.'},
  {w:'Propiedad asociativa',a:'🧩 al multiplicar tres fracciones se pueden agrupar como convenga: (1/2 × 2/3) × 3/5 = 1/2 × (2/3 × 3/5).'},
  {w:'Multiplicar por 1',a:'1️⃣ toda fracción multiplicada por 1 queda igual, y 1 se puede escribir como 4/4, 7/7… por eso sirve para hacer fracciones equivalentes.'}
];
let fcIdx=0;
function upFC(){ document.getElementById('fcInner').classList.remove('flipped'); document.getElementById('fcW').textContent=fcData[fcIdx].w; document.getElementById('fcA').innerHTML=fcData[fcIdx].a; document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length; }
function flipCard(){ sfx('flip'); document.getElementById('fcInner').classList.toggle('flipped'); if(!xpTracker.fc.has(fcIdx)){ xpTracker.fc.add(fcIdx); pts(1); } if(xpTracker.fc.size===fcData.length){ fin('s-flash'); unlockAchievement('flash_master'); } }
function nextFC(){ sfx('click'); fcIdx=(fcIdx+1)%fcData.length; upFC(); }
function prevFC(){ sfx('click'); fcIdx=(fcIdx-1+fcData.length)%fcData.length; upFC(); }


// ===================== JUEGO: MEMORIA DE LOS NÚMEROS =====================
const memoPairs=[
  {id:'multiplicar',t:'Multiplicar',d:'✖️ en línea recta: arriba con arriba, abajo con abajo'},
  {id:'reciproco',t:'Recíproco',d:'🔄 la fracción volteada: 3/4 → 4/3'},
  {id:'dividir',t:'Dividir',d:'➗ voltear la segunda y multiplicar'},
  {id:'mixta',t:'Mixta a impropia',d:'🔢 2 1/4 = (2×4+1)/4 = 9/4'},
  {id:'de',t:'La palabra «de»',d:'🔑 2/3 de 15 significa 2/3 × 15'},
  {id:'simplificar',t:'Mínima expresión',d:'✂️ 8/12 se reduce a 2/3'}
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
  {q:'¿Cuánto es 2/3 × 4/5?',o:['a) 8/15','b) 6/8','c) 8/8','d) 2/15'],c:0},
  {q:'Para dividir 3/4 ÷ 2/5, ¿qué se hace primero?',o:['a) Buscar denominador común','b) Voltear la primera fracción','c) Voltear la segunda y multiplicar','d) Restar los denominadores'],c:2},
  {q:'¿Cuál es el recíproco de 5/8?',o:['a) 5/8','b) 8/5','c) 1/5','d) 8/8'],c:1},
  {q:'¿Cómo se escribe 3 1/2 como fracción impropia?',o:['a) 7/2','b) 4/2','c) 31/2','d) 6/2'],c:0},
  {q:'Al multiplicar 12 × 3/4, el resultado es…',o:['a) mayor que 12','b) igual a 12','c) 48','d) menor que 12'],c:3},
  {q:'¿Cuánto es 6 ÷ 1/2?',o:['a) 3','b) 12','c) 6/2','d) 1/12'],c:1},
  {q:'En «Mario se comió 2/3 de una sandía de 9 tajadas», ¿qué operación resuelve el problema?',o:['a) 2/3 + 9','b) 9 ÷ 2/3','c) 2/3 × 9','d) 9 − 2/3'],c:2},
  {q:'El resultado 10/12, ¿cómo queda en su mínima expresión?',o:['a) 5/6','b) 10/12 ya está','c) 2/3','d) 5/12'],c:0},
  {q:'¿Cuánto es 2/5 × 3 (un natural)?',o:['a) 2/15','b) 5/3','c) 6/5','d) 6/15'],c:2},
  {q:'¿Qué dice la propiedad conmutativa de la multiplicación?',o:['a) Que hay que simplificar siempre','b) Que el orden de los factores no cambia el producto','c) Que se voltea la segunda fracción','d) Que se suman los denominadores'],c:1}
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
    label:['Multiplicación','División'], headA:'✖️ Se multiplica directo', headB:'➗ Hay que voltear',
    colA:'mult', colB:'div',
    words:[{w:'2/3 × 4/5',t:'mult'},{w:'1/2 ÷ 3/4',t:'div'},{w:'5 × 2/7',t:'mult'},{w:'3/8 ÷ 2',t:'div'},
           {w:'1/4 × 1/4',t:'mult'},{w:'6 ÷ 1/3',t:'div'},{w:'2/9 × 3',t:'mult'},{w:'4/5 ÷ 2/5',t:'div'}]
  },
  {
    label:['Crece','Encoge'], headA:'📈 El resultado CRECE', headB:'📉 El resultado ENCOGE',
    colA:'crece', colB:'encoge',
    words:[{w:'8 × 3/4',t:'encoge'},{w:'8 ÷ 1/2',t:'crece'},{w:'10 × 1/5',t:'encoge'},{w:'10 ÷ 2/3',t:'crece'},
           {w:'6 × 2/3',t:'encoge'},{w:'6 ÷ 3/4',t:'crece'},{w:'12 × 1/4',t:'encoge'},{w:'12 ÷ 1/3',t:'crece'}]
  },
  {
    label:['Ya simplificada','Falta simplificar'], headA:'✅ Mínima expresión', headB:'✂️ Se puede reducir',
    colA:'lista', colB:'reduce',
    words:[{w:'3/4',t:'lista'},{w:'8/12',t:'reduce'},{w:'5/9',t:'lista'},{w:'10/15',t:'reduce'},
           {w:'7/8',t:'lista'},{w:'6/9',t:'reduce'},{w:'2/5',t:'lista'},{w:'12/16',t:'reduce'}]
  },
  {
    label:['Fracción mixta','Fracción impropia'], headA:'🔢 Mixta', headB:'⬆️ Impropia',
    colA:'mixta', colB:'impropia',
    words:[{w:'2 1/4',t:'mixta'},{w:'9/4',t:'impropia'},{w:'1 3/5',t:'mixta'},{w:'8/5',t:'impropia'},
           {w:'3 1/2',t:'mixta'},{w:'7/2',t:'impropia'},{w:'4 2/3',t:'mixta'},{w:'14/3',t:'impropia'}]
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
  {s:['3/4','×','2/5','=','6/20'],c:4,art:'Toca el PRODUCTO de la multiplicación'},
  {s:['2/3','÷','4/7','=','2/3','×','7/4'],c:6,art:'Toca la fracción que se VOLTEÓ para dividir'},
  {s:['El','recíproco','de','5/6','es','6/5'],c:5,art:'Toca el recíproco'},
  {s:['2','1/4','=','9/4'],c:3,art:'Toca la fracción IMPROPIA'},
  {s:['12','×','3/4','=','9'],c:4,art:'Toca el resultado, y fíjate: es MENOR que 12'},
  {s:['Ana','comió','2/3','de','la','naranja'],c:3,art:'Toca la palabra que significa multiplicar'},
  {s:['8/12','se','reduce','a','2/3'],c:4,art:'Toca la fracción en su mínima expresión'},
  {s:['6','÷','1/2','=','12'],c:4,art:'Toca el resultado, y fíjate: es MAYOR que 6'}
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
  {s:'Para multiplicar dos fracciones se multiplica numerador por numerador y ___ por denominador.',opts:['denominador','entero','recíproco'],c:0},
  {s:'Para dividir dos fracciones se voltea la ___ y se multiplica.',opts:['primera','segunda','mayor'],c:1},
  {s:'El recíproco de 4/9 es ___.',opts:['4/9','1/4','9/4'],c:2},
  {s:'La fracción mixta 2 3/5 escrita como impropia es ___.',opts:['13/5','23/5','6/5'],c:0},
  {s:'Al multiplicar 20 por 1/4 el resultado ___ que 20.',opts:['es mayor','es menor','es igual'],c:1},
  {s:'Al dividir 10 entre 1/2 el resultado ___ que 10.',opts:['es mayor','es menor','es igual'],c:0},
  {s:'En «la mitad de 3/5», la palabra «de» indica que hay que ___.',opts:['restar','multiplicar','dividir'],c:1},
  {s:'Un resultado de 9/12 no está terminado: falta escribirlo en su ___.',opts:['fracción mixta','recíproco','mínima expresión'],c:2}
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
    q: 'Sin calcular: al multiplicar 12 × 3/4, ¿el resultado será mayor o menor que 12?',
    opts: ['Mayor que 12', 'Menor que 12', 'Igual a 12'],
    correct: 1,
    feedback: '¡Correcto! 3/4 es menos que un entero, así que se toma solo una parte de 12: son 9.',
    wrongFeedback: 'La respuesta es: menor. Multiplicar por 3/4 es quedarse con tres cuartas partes de 12, o sea 9.',
    explore: 'encoge'
  },
  {
    q: '¿Cuántos medios (1/2) caben en 6 tortillas enteras?',
    opts: ['3 medios', '6 medios', '12 medios'],
    correct: 2,
    feedback: '¡Exacto! Cada tortilla da 2 mitades, así que 6 ÷ 1/2 = 12. Dividir entre una fracción menor que 1 agranda.',
    wrongFeedback: 'La respuesta es 12: cada tortilla se parte en 2, y 6 tortillas dan 12 mitades. Por eso 6 ÷ 1/2 = 12.',
    explore: 'caben'
  },
  {
    q: 'Para resolver 2/3 × 4/5, ¿hace falta buscar denominador común?',
    opts: ['Sí, igual que en la suma', 'No, se multiplica en línea recta', 'Solo si los denominadores son distintos'],
    correct: 1,
    feedback: '¡Muy bien! El denominador común es cosa de la suma y la resta. Aquí se multiplica directo: 8/15.',
    wrongFeedback: 'La respuesta es: no. Buscar denominador común es para sumar y restar. Al multiplicar va directo: 2×4=8 arriba y 3×5=15 abajo.',
    explore: 'lineas'
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
  if(type==='encoge'){
    box.innerHTML=`<p class="pd-tip">Aquí hay <strong>12 fichas</strong>. Toca una fracción y mira con cuántas te quedas:</p><div style="display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;margin:0.5rem 0;"><button class="btn btn-pri" onclick="predFracDe(${i},1,4)">1/4 de 12</button><button class="btn btn-pri" onclick="predFracDe(${i},1,2)">1/2 de 12</button><button class="btn btn-pri" onclick="predFracDe(${i},3,4)">3/4 de 12</button></div><div class="pd-cnt" id="pd-cnt-${i}" style="font-size:1.5rem;line-height:1.5;text-align:center;">🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵</div><div class="pd-msg" id="pd-msg-${i}">👆 toca una fracción</div>`;
  } else if(type==='caben'){
    box.innerHTML=`<p class="pd-tip">Seis tortillas enteras. Toca el cuchillo y cuenta los pedazos:</p><div style="display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;margin:0.5rem 0;"><button class="btn btn-pri" onclick="predCaben(${i},2)">🔪 partir en mitades</button><button class="btn btn-pri" onclick="predCaben(${i},3)">🔪 partir en tercios</button><button class="btn btn-d" onclick="predCaben(${i},1)">↩️ dejarlas enteras</button></div><div class="pd-cnt" id="pd-cnt-${i}" style="font-size:1.5rem;line-height:1.5;text-align:center;">🫓🫓🫓🫓🫓🫓</div><div class="pd-msg" id="pd-msg-${i}">👆 parte las tortillas y cuenta</div>`;
  } else if(type==='lineas'){
    box.innerHTML=`<p class="pd-tip">Tienes <strong>2/3 × 4/5</strong>. Prueba los dos caminos y mira cuál funciona:</p><div style="display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;margin:0.5rem 0;"><button class="btn btn-pri" onclick="predLinea(${i},'comun')">🔍 buscar denominador común</button><button class="btn btn-pri" onclick="predLinea(${i},'recta')">➡️ multiplicar en línea recta</button></div><div class="pd-msg" id="pd-msg-${i}">👆 prueba un camino</div>`;
  }
}
/* Enseña con fichas lo que la cuenta esconde: tomar 3/4 de 12 deja MENOS
   de 12. Es el error que más se repite: creer que multiplicar agranda. */
function predFracDe(i,n,d){
  sfx('click');
  const cnt=document.getElementById('pd-cnt-'+i), msg=document.getElementById('pd-msg-'+i);
  const toca=12*n/d;
  cnt.innerHTML='🔵'.repeat(toca)+'<span style="opacity:0.25">'+'⚪'.repeat(12-toca)+'</span>';
  msg.innerHTML=`✋ ${n}/${d} de 12 son <strong>${toca} fichas</strong>: ${n}/${d} × 12 = ${toca}. Te quedas con <strong>menos</strong> de las 12 que había. Ahora responde abajo.`;
  if(n===3&&d===4) sfx('ok');
}
function predCaben(i,p){
  sfx('click');
  const cnt=document.getElementById('pd-cnt-'+i), msg=document.getElementById('pd-msg-'+i);
  if(p===1){ cnt.innerHTML='🫓🫓🫓🫓🫓🫓'; msg.innerHTML='🫓 Seis tortillas enteras. Ahora pártelas y cuenta los pedazos.'; return; }
  const trozo=p===2?'🌗':'🌓';
  cnt.innerHTML=trozo.repeat(6*p);
  msg.innerHTML=`🔪 Cada tortilla dio ${p} pedazos, así que hay <strong>${6*p}</strong>. En números: 6 ÷ 1/${p} = 6 × ${p} = <strong>${6*p}</strong>. Dividir entre una fracción menor que 1 <strong>agranda</strong>.`;
  if(p===2) sfx('ok');
}
function predLinea(i,camino){
  sfx('click');
  const msg=document.getElementById('pd-msg-'+i);
  if(camino==='recta'){ msg.innerHTML='✅ En línea recta: 2 × 4 = <strong>8</strong> arriba y 3 × 5 = <strong>15</strong> abajo. El producto es <strong>8/15</strong>, sin buscar nada más.'; sfx('ok'); }
  else{ msg.innerHTML='❌ El denominador común sirve para <strong>sumar y restar</strong>, porque no se pueden juntar partes de distinto tamaño. Al multiplicar no hace falta: prueba el otro camino.'; }
}

// ===================== RETO FINAL (con parejas variables) =====================
const retoPairs=[
  {
    name:'Producto vs entero ✖️', hint:'Calcula A (una multiplicación) y compárala con B',
    pool:[
      {w:'A: 12 × 3/4 vs B: 9',t:'igual'},{w:'A: 10 × 1/2 vs B: 8',t:'menor'},{w:'A: 8 × 3/2 vs B: 10',t:'mayor'},
      {w:'A: 20 × 1/4 vs B: 5',t:'igual'},{w:'A: 9 × 2/3 vs B: 8',t:'menor'},{w:'A: 6 × 5/3 vs B: 8',t:'mayor'},
      {w:'A: 15 × 2/5 vs B: 6',t:'igual'},{w:'A: 14 × 1/2 vs B: 9',t:'menor'},{w:'A: 4 × 7/2 vs B: 12',t:'mayor'},
      {w:'A: 18 × 1/3 vs B: 6',t:'igual'},{w:'A: 10 × 2/5 vs B: 5',t:'menor'},{w:'A: 9 × 4/3 vs B: 10',t:'mayor'}
    ]
  },
  {
    name:'Cociente vs entero ➗', hint:'Recuerda: dividir entre una fracción menor que 1 AGRANDA',
    pool:[
      {w:'A: 6 ÷ 1/2 vs B: 12',t:'igual'},{w:'A: 8 ÷ 2 vs B: 6',t:'menor'},{w:'A: 5 ÷ 1/3 vs B: 12',t:'mayor'},
      {w:'A: 9 ÷ 1/3 vs B: 27',t:'igual'},{w:'A: 10 ÷ 5 vs B: 4',t:'menor'},{w:'A: 4 ÷ 1/4 vs B: 12',t:'mayor'},
      {w:'A: 3 ÷ 1/2 vs B: 6',t:'igual'},{w:'A: 12 ÷ 4 vs B: 5',t:'menor'},{w:'A: 7 ÷ 1/2 vs B: 12',t:'mayor'},
      {w:'A: 10 ÷ 1/2 vs B: 20',t:'igual'},{w:'A: 6 ÷ 3 vs B: 4',t:'menor'},{w:'A: 2 ÷ 1/5 vs B: 8',t:'mayor'}
    ]
  },
  {
    name:'Mixtas e impropias 🔢', hint:'Convierte A en impropia y compara con B',
    pool:[
      {w:'A: 2 1/4 vs B: 9/4',t:'igual'},{w:'A: 1 1/2 vs B: 5/2',t:'menor'},{w:'A: 3 1/3 vs B: 9/3',t:'mayor'},
      {w:'A: 1 3/5 vs B: 8/5',t:'igual'},{w:'A: 2 1/3 vs B: 8/3',t:'menor'},{w:'A: 4 1/2 vs B: 8/2',t:'mayor'},
      {w:'A: 3 2/5 vs B: 17/5',t:'igual'},{w:'A: 1 1/4 vs B: 7/4',t:'menor'},{w:'A: 2 3/4 vs B: 10/4',t:'mayor'},
      {w:'A: 5 1/2 vs B: 11/2',t:'igual'},{w:'A: 2 2/3 vs B: 9/3',t:'menor'},{w:'A: 3 3/4 vs B: 14/4',t:'mayor'}
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
  {q:'Sin calcular, ¿cuál da más: 24 × 2/3 o 24 ÷ 2/3? Explica por qué.',a:'24 ÷ 2/3. Multiplicar por una fracción menor que 1 encoge (da 16) y dividir entre ella agranda (da 36).'},
  {q:'Una receta pide 3/4 de taza de azúcar y quieres hacer media receta. ¿Cuánta azúcar usas?',a:'1/2 × 3/4 = 3/8 de taza.'},
  {q:'¿Puede el producto de dos fracciones ser mayor que las dos? Da un ejemplo o explica por qué no.',a:'Sí, si las dos son mayores que 1: 3/2 × 5/2 = 15/4, que es mayor que las dos.'},
  {q:'Un lazo de 6 metros se corta en pedazos de 3/4 de metro. ¿Cuántos pedazos salen?',a:'6 ÷ 3/4 = 6 × 4/3 = 24/3 = 8 pedazos.'},
  {q:'Explica por qué toda fracción multiplicada por su recíproco da 1.',a:'Porque arriba y abajo quedan los mismos factores: 3/4 × 4/3 = 12/12 = 1.'},
  {q:'Marta dice que 1/2 ÷ 1/4 = 1/8. ¿Qué hizo mal y cuánto es de verdad?',a:'Multiplicó en vez de dividir. Lo correcto: 1/2 × 4/1 = 4/2 = 2.'},
  {q:'De un galón de leche se usaron 2/5 el lunes y la mitad de lo que quedó el martes. ¿Cuánto queda?',a:'Quedaban 3/5; la mitad es 3/10, así que queda 3/5 − 3/10 = 3/10 del galón.'},
  {q:'¿Cuántos tercios hay en 4 enteros? Escribe la división que lo resuelve.',a:'4 ÷ 1/3 = 4 × 3 = 12 tercios.'}
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
function genTask(){ sfx('click'); const type=document.getElementById('tgType').value; const count=parseInt(document.getElementById('tgCount').value); ansVisible=false; const out=document.getElementById('tgOut'); out.innerHTML=''; if(type==='multfrac') genMultFracTask(out,count); else if(type==='divfrac') genDivFracTask(out,count); else if(type==='mixtas') genMixtaTask(out,count); else if(type==='decantidad') genDeCantidadTask(out,count); else if(type==='simplifica') genSimplificarTask(out,count); else if(type==='pensamiento') genPensamientoTask(out,count); fin('s-tareas'); }
function _instrBlock(out,title,lines){ const ib=document.createElement('div'); ib.className='tg-instruction-block'; ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join(''); out.appendChild(ib); }
// ✖️ Multiplicar dos fracciones (aleatorio: nunca se repite)
function genMultFracTask(out,count){
  _instrBlock(out,'✖️ Multiplica y simplifica',['Multiplica en línea recta: numerador por numerador y denominador por denominador.','Escribe el resultado en su mínima expresión.']);
  for(let i=0;i<count;i++){
    const a=_tgRint(1,7), b=_tgRint(2,9), c=_tgRint(1,7), d=_tgRint(2,9);
    _tgTask(out,i,`<div class="tg-op">${a}/${b} × ${c}/${d} = ________</div><div class="tg-answer" style="display:${ansVisible?'block':'none'}">R/ ${_fmtFr(a*c,b*d)}</div>`);
  }
}
// ➗ Dividir volteando la segunda
function genDivFracTask(out,count){
  _instrBlock(out,'➗ Divide volteando la segunda',['Cambia el signo de dividir por el de multiplicar y voltea la SEGUNDA fracción.','Escribe el resultado en su mínima expresión.']);
  for(let i=0;i<count;i++){
    const a=_tgRint(1,7), b=_tgRint(2,9), c=_tgRint(1,7), d=_tgRint(2,9);
    _tgTask(out,i,`<div class="tg-op">${a}/${b} ÷ ${c}/${d} = ________</div><div class="tg-answer" style="display:${ansVisible?'block':'none'}">R/ ${a}/${b} × ${d}/${c} = ${_fmtFr(a*d,b*c)}</div>`);
  }
}
// 🔢 De fracción mixta a impropia
function genMixtaTask(out,count){
  _instrBlock(out,'🔢 Convierte la mixta en impropia',['Multiplica el entero por el denominador y súmale el numerador.','El denominador no cambia.']);
  for(let i=0;i<count;i++){
    const e=_tgRint(1,6), n=_tgRint(1,7), d=Math.max(n+1,_tgRint(2,9));
    _tgTask(out,i,`<div class="tg-op">${e} ${n}/${d} = ________</div><div class="tg-answer" style="display:${ansVisible?'block':'none'}">R/ (${e}×${d}+${n})/${d} = ${e*d+n}/${d}</div>`);
  }
}
// 🍕 La fracción de una cantidad («de» significa multiplicar)
function genDeCantidadTask(out,count){
  _instrBlock(out,'🍕 La fracción de una cantidad',['Recuerda: «de» significa multiplicar.','Escribe la operación y el resultado.']);
  const objs=['lempiras','mangos','tortillas','páginas','metros de lazo','alumnos'];
  for(let i=0;i<count;i++){
    const b=[2,3,4,5,6,8][_tgRint(0,5)], a=_tgRint(1,b-1), k=_tgRint(2,9), tot=b*k;
    const o=objs[_tgRint(0,objs.length-1)];
    _tgTask(out,i,`<div class="tg-op">${a}/${b} de ${tot} ${o} = ________</div><div class="tg-answer" style="display:${ansVisible?'block':'none'}">R/ ${a}/${b} × ${tot} = ${a*tot/b} ${o}</div>`);
  }
}
// ✂️ Simplificar hasta la mínima expresión
function genSimplificarTask(out,count){
  _instrBlock(out,'✂️ Simplifica hasta la mínima expresión',['Divide arriba y abajo entre el mismo número, todas las veces que se pueda.','Si ya no se puede reducir, escríbela igual y anota «ya está».']);
  for(let i=0;i<count;i++){
    const g=[2,3,4,5,6][_tgRint(0,4)], a=_tgRint(1,9), b=Math.max(a+1,_tgRint(2,10));
    _tgTask(out,i,`<div class="tg-op">${a*g}/${b*g} = ________</div><div class="tg-answer" style="display:${ansVisible?'block':'none'}">R/ ${_fmtFr(a*g,b*g)}</div>`);
  }
}
function toggleAns(){ ansVisible=!ansVisible; document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none'); sfx('click'); }

// ===================== SOPA DE LETRAS (multidireccional, con inversas) =====================
const sopaSets=[
  {
    size:10,
    grid:[
      ['R','R','E','C','I','P','R','O','C','O'],
      ['N','B','O','S','C','U','R','O','L','I'],
      ['Z','U','D','T','V','E','S','C','M','M'],
      ['B','E','M','V','C','R','G','P','L','P'],
      ['C','A','D','E','E','U','R','O','B','S'],
      ['T','P','T','V','R','O','D','P','I','V'],
      ['H','V','N','X','P','A','T','O','O','Z'],
      ['E','I','H','I','I','M','D','H','R','M'],
      ['S','M','A','G','Z','M','D','O','G','P'],
      ['T','R','G','R','P','N','P','Z','R','B']
    ],
    words:[
      {w:'NUMERADOR',cells:[[1,0],[2,1],[3,2],[4,3],[5,4],[6,5],[7,6],[8,7],[9,8]]},
      {w:'RECIPROCO',cells:[[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[0,9]]},
      {w:'PRODUCTO',cells:[[8,9],[7,8],[6,7],[5,6],[4,5],[3,4],[2,3],[1,2]]},
      {w:'INVERSO',cells:[[7,1],[6,2],[5,3],[4,4],[3,5],[2,6],[1,7]]},
      {w:'MIXTA',cells:[[8,5],[7,4],[6,3],[5,2],[4,1]]},
      {w:'IMPROPIA',cells:[[1,9],[2,8],[3,7],[4,6],[5,5],[6,4],[7,3],[8,2]]}
    ]
  },
  {
    size:10,
    grid:[
      ['E','Z','T','A','D','A','T','I','M','R'],
      ['N','O','V','V','S','V','T','T','P','C'],
      ['E','F','R','E','T','I','M','E','O','C'],
      ['N','R','D','L','G','M','O','R','O','V'],
      ['T','A','C','P','S','P','L','C','A','R'],
      ['E','C','O','M','P','S','I','I','V','B'],
      ['R','C','C','I','I','E','G','O','A','E'],
      ['O','I','U','S','N','M','L','T','G','P'],
      ['U','O','L','T','F','A','C','T','O','R'],
      ['A','N','E','G','C','D','E','C','U','O']
    ],
    words:[
      {w:'FRACCION',cells:[[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1]]},
      {w:'COCIENTE',cells:[[2,9],[3,8],[4,7],[5,6],[6,5],[7,4],[8,3],[9,2]]},
      {w:'SIMPLE',cells:[[7,3],[6,3],[5,3],[4,3],[3,3],[2,3]]},
      {w:'ENTERO',cells:[[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]]},
      {w:'TERCIO',cells:[[1,7],[2,7],[3,7],[4,7],[5,7],[6,7]]},
      {w:'FACTOR',cells:[[8,4],[8,5],[8,6],[8,7],[8,8],[8,9]]},
      {w:'MITAD',cells:[[0,8],[0,7],[0,6],[0,5],[0,4]]}
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
  {q:'Para multiplicar dos fracciones hay que buscar primero el denominador común.',a:false},
  {q:'El producto de 2/3 × 4/5 es 8/15.',a:true},
  {q:'Al dividir dos fracciones se voltea la segunda y se multiplica.',a:true},
  {q:'El recíproco de 3/7 es 7/3.',a:true},
  {q:'Multiplicar siempre da un resultado mayor que los factores.',a:false},
  {q:'La fracción mixta 2 1/4 equivale a la impropia 9/4.',a:true},
  {q:'Para multiplicar una fracción por un número natural, el natural se escribe con denominador 1.',a:true},
  {q:'Al dividir 6 entre 1/2 el resultado es 3.',a:false},
  {q:'En un problema, la palabra «de» suele indicar una multiplicación.',a:true},
  {q:'El resultado 10/12 ya está en su mínima expresión.',a:false},
  {q:'Se pueden cancelar factores en cruz antes de multiplicar dos fracciones.',a:true},
  {q:'Para multiplicar una fracción mixta se multiplica primero el entero y después la fracción, por separado.',a:false},
  {q:'El orden de los factores no cambia el producto, también con fracciones.',a:true},
  {q:'Toda fracción multiplicada por 1 cambia de valor.',a:false},
  {q:'Dividir entre una fracción menor que 1 da un resultado mayor que el número original.',a:true}
];
const evalMCBank=[
  {q:'¿Cuánto es 3/5 × 2/7?',o:['a) 6/35','b) 5/12','c) 6/12','d) 3/35'],a:0},
  {q:'¿Cuál es el recíproco de 9/4?',o:['a) 9/4','b) 4/9','c) 1/9','d) 4/4'],a:1},
  {q:'Para resolver 5/6 ÷ 2/3 se escribe…',o:['a) 6/5 × 2/3','b) 5/6 + 3/2','c) 5/6 × 3/2','d) 5/6 × 2/3'],a:2},
  {q:'La fracción mixta 4 2/3 escrita como impropia es…',o:['a) 42/3','b) 8/3','c) 6/3','d) 14/3'],a:3},
  {q:'¿Cuánto es 4 × 3/8, simplificado?',o:['a) 3/2','b) 12/32','c) 4/8','d) 7/8'],a:0},
  {q:'¿Cuánto es 8 ÷ 2/3?',o:['a) 16/3','b) 12','c) 8/3','d) 4/3'],a:1},
  {q:'En su mínima expresión, 18/24 es…',o:['a) 9/12','b) 6/8','c) 3/4','d) 2/3'],a:2},
  {q:'«Se vendieron 3/4 de las 20 rosquillas». ¿Cuántas se vendieron?',o:['a) 5','b) 12','c) 60','d) 15'],a:3},
  {q:'¿Cuánto es 2/3 × 3/2?',o:['a) 1','b) 6/6 sin simplificar es la única respuesta','c) 5/5','d) 4/9'],a:0},
  {q:'Al multiplicar 30 por 1/6 el resultado es…',o:['a) 180','b) 5','c) 36','d) 30/1'],a:1},
  {q:'¿Cuál de estas operaciones da un resultado MAYOR que 10?',o:['a) 10 × 1/2','b) 10 × 3/4','c) 10 ÷ 1/2','d) 10 × 2/5'],a:2},
  {q:'¿Cuánto es 1/2 × 2/3 × 3/4?',o:['a) 6/9','b) 3/4','c) 1/2','d) 1/4'],a:3},
  {q:'¿Cuánto es 2 1/2 × 2?',o:['a) 5','b) 4 1/2','c) 2 2/2','d) 4 1/4'],a:0},
  {q:'¿Cuánto es 3/4 ÷ 3?',o:['a) 9/4','b) 1/4','c) 3/12 y no se simplifica','d) 4/3'],a:1},
  {q:'¿Qué error hay en «2/5 ÷ 1/3 = 5/2 × 1/3»?',o:['a) Ninguno, está bien','b) Faltó buscar denominador común','c) Volteó la primera en vez de la segunda','d) Sumó en vez de multiplicar'],a:2}
];
const evalCPBank=[
  {q:'Para multiplicar fracciones se multiplica numerador por numerador y denominador por ___.',a:'denominador'},
  {q:'Para dividir fracciones se voltea la ___ fracción y se multiplica.',a:'segunda'},
  {q:'La fracción volteada se llama ___ o inverso.',a:'recíproco'},
  {q:'Antes de multiplicar una fracción mixta hay que convertirla en ___.',a:'impropia'},
  {q:'El resultado de 2/3 × 4/5 es ___.',a:'8/15'},
  {q:'El recíproco de 7/2 es ___.',a:'2/7'},
  {q:'Un número natural se escribe como fracción poniéndole denominador ___.',a:'1'},
  {q:'El resultado de 6 ÷ 1/2 es ___.',a:'12'},
  {q:'En «2/3 de 15», la palabra «de» significa ___.',a:'multiplicar'},
  {q:'La fracción 12/16 en su mínima expresión es ___.',a:'3/4'},
  {q:'La mixta 3 1/2 escrita como impropia es ___.',a:'7/2'},
  {q:'Al multiplicar una cantidad por una fracción menor que 1, el resultado ___ (crece o encoge).',a:'encoge'},
  {q:'Toda fracción multiplicada por su recíproco da ___.',a:'1'},
  {q:'El resultado de 20 × 3/4 es ___.',a:'15'},
  {q:'La propiedad que dice que el orden de los factores no cambia el producto se llama ___.',a:'conmutativa'}
];
const evalPRBank=[
  {term:'Multiplicar fracciones',def:'Numerador por numerador y denominador por denominador'},
  {term:'Recíproco',def:'La misma fracción volteada, como 3/4 y 4/3'},
  {term:'Dividir fracciones',def:'Voltear la segunda fracción y multiplicar'},
  {term:'Fracción mixta',def:'Un entero acompañado de una fracción, como 2 1/4'},
  {term:'Fracción impropia',def:'Aquella cuyo numerador es mayor o igual que el denominador'},
  {term:'Mínima expresión',def:'La fracción reducida hasta que ya no se puede dividir más'},
  {term:'La palabra «de»',def:'Señal de que el problema se resuelve multiplicando'},
  {term:'Cancelar en cruz',def:'Simplificar antes de multiplicar para trabajar con números chicos'},
  {term:'Propiedad conmutativa',def:'El orden de los factores no cambia el producto'},
  {term:'Propiedad asociativa',def:'Al multiplicar tres fracciones se pueden agrupar como convenga'},
  {term:'Multiplicar por 1',def:'Deja la fracción igual y sirve para hallar equivalentes'},
  {term:'Producto',def:'El resultado de una multiplicación'},
  {term:'Cociente',def:'El resultado de una división'},
  {term:'Máximo común divisor',def:'El número entre el que se divide arriba y abajo para simplificar'},
  {term:'Numerador',def:'El número de arriba de la fracción'}
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación Multiplicación y División de Fracciones · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:12pt;color:#111;background:#fff;padding:4mm 6mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.5rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;color:#1565c0;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:#1565c0;margin-top:0.15rem;font-weight:700;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.5rem 0 0.25rem;border-left:4px solid #1565c0;background:#e3f2fd;display:flex;justify-content:space-between;align-items:center;color:#1565c0;}.qn{font-weight:700;min-width:22px;flex-shrink:0;color:#1565c0;}.tf-row{display:flex;align-items:flex-start;gap:0.3rem;font-size:10.5pt;line-height:1.4;padding:0.25rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:42px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.2rem;margin-top:0.2rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.28rem 0.45rem;margin-bottom:0.22rem;break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.4;display:flex;gap:0.3rem;margin-bottom:0.18rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.22rem 0.55rem;}.mc-opts{display:grid;grid-template-columns:repeat(3,1fr);gap:0.08rem 0.25rem;margin-left:1.3rem;}.mc-opt{font-size:9.5pt;display:flex;align-items:center;gap:0.22rem;}.mc-opt input{width:12px;height:12px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.4;padding:0.22rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:130px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{break-inside:avoid;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.2rem 0.5rem;margin-top:0.15rem;}.pr-head{font-size:9pt;font-weight:700;color:#1565c0;margin-bottom:0.2rem;}.pr-item{font-size:10pt;padding:0.22rem 0.32rem;background:#e3f2fd;border-radius:3px;margin-bottom:0.12rem;display:flex;align-items:center;gap:0.22rem;line-height:1.2;}.pr-num{font-weight:700;color:#1565c0;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #1565c0;padding-bottom:0.35rem;margin-bottom:0.5rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;color:#1565c0;}.p-sub{font-size:9pt;color:#1565c0;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #cce0ff;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;color:#1565c0;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#1565c0;}.pa{color:#007a00;font-weight:700;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:#1565c0;font-weight:700;font-style:italic;}.obt-lbl{font-weight:700;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #1565c0;height:12px;}.obt-pct{font-weight:700;}.total-row{display:flex;align-items:baseline;justify-content:flex-end;gap:7px;font-size:11pt;color:#1565c0;font-weight:700;font-style:italic;margin-top:0.4rem;padding:0.2rem 0.5rem;background:#e3f2fd;border-radius:4px;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #1565c0;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · Misión Multiplicación y División de Fracciones · Matemática</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 4 secciones × 5 preguntas × 5 pts c/u · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✔ PAUTA DOCENTE — Evaluación Final · Multiplicación y División de Fracciones · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">100 pts | 4 secciones × 5 preguntas × 5 pts | Matemáticas · Educación Básica</div></div><div class="p-grid">${pR}</div>
  ${zgBlock}</div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("evalPage",252,0.55,1.45);fit("pautaPage",252,0.55,1.3);})();</script></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(doc); win.document.close(); setTimeout(()=>win.print(),400);
}

// ===================== EXPLICA CON TUS PALABRAS =====================
const explicaData = [
  {
    q: 'Una compañera dice que para multiplicar 2/3 × 4/5 hay que buscar primero el denominador común. Explícale por qué no.',
    hint: '💡 Pista: piensa en qué operación sí necesita el denominador común.',
    rubric: ['✓ Aclara que el denominador común es para sumar y restar', '✓ Explica que al multiplicar se va en línea recta: arriba con arriba y abajo con abajo', '✓ Da el resultado: 8/15'],
    suggested: 'El denominador común hace falta para sumar y restar, porque no se pueden juntar partes de distinto tamaño. Al multiplicar no: se multiplica numerador por numerador y denominador por denominador, o sea 2×4=8 arriba y 3×5=15 abajo. El resultado es 8/15.'
  },
  {
    q: 'Explica con un dibujo o con tus palabras por qué 6 ÷ 1/2 da 12 y no 3.',
    hint: '💡 Pista: la pregunta real es cuántos medios caben en 6.',
    rubric: ['✓ Traduce la división a «cuántos medios caben en 6»', '✓ Muestra que cada entero da 2 mitades', '✓ Concluye 6 × 2 = 12'],
    suggested: 'Dividir 6 entre 1/2 es preguntar cuántas mitades caben en 6 enteros. Si parto cada tortilla en dos, cada una da 2 pedazos, así que 6 tortillas dan 12 pedazos. Por eso el resultado es 12, mayor que 6, y no 3 (eso sería 6 ÷ 2).'
  },
  {
    q: '¿Por qué antes de multiplicar 2 1/4 × 3 hay que convertir la mixta en impropia? ¿Qué pasa si no se hace?',
    hint: '💡 Pista: prueba a multiplicar solo el entero y solo la fracción, y compara.',
    rubric: ['✓ Convierte: 2 1/4 = 9/4', '✓ Multiplica: 9/4 × 3 = 27/4 = 6 3/4', '✓ Explica que multiplicar por separado el entero y la fracción da un resultado equivocado'],
    suggested: 'Una mixta son dos partes juntas (2 y 1/4), y si multiplico solo una parte pierdo la otra. Primero la vuelvo impropia: 2 1/4 = (2×4+1)/4 = 9/4. Después 9/4 × 3 = 27/4, que es 6 3/4. Si hubiera multiplicado solo el entero me habría dado 6 1/4, que está mal.'
  },
  {
    q: 'Escribe un problema de tu casa o de tu escuela que se resuelva con 3/4 × 8 y resuélvelo.',
    hint: '💡 Pista: la palabra «de» te ayuda a plantearlo.',
    rubric: ['✓ El contexto es real y usa la palabra «de» o un reparto', '✓ Plantea 3/4 × 8', '✓ Resuelve: 24/4 = 6'],
    suggested: '"En el aula hay 8 pupitres y 3/4 de ellos están ocupados. ¿Cuántos alumnos hay sentados?" Se resuelve con 3/4 × 8 = 24/4 = 6 alumnos.'
  },
  {
    q: 'Un compañero resolvió 3/8 ÷ 2/5 y escribió 8/3 × 2/5. Encuentra el error, explícalo y resuelve bien.',
    hint: '💡 Pista: fíjate en cuál de las dos fracciones se voltea.',
    rubric: ['✓ Señala que volteó la primera en vez de la segunda', '✓ Escribe la operación correcta: 3/8 × 5/2', '✓ Resuelve: 15/16'],
    suggested: 'El error es que volteó la primera fracción. La regla dice que se voltea la SEGUNDA, la que divide. Lo correcto es 3/8 ÷ 2/5 = 3/8 × 5/2 = 15/16.'
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

// ===================== PRUEBA OPERATIVA — MULTIPLICACIÓN Y DIVISIÓN DE FRACCIONES =====================

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

// I. Multiplicar y dividir fracciones (5 × 4 = 20 pts) — Bloques 1, 2 y 4
const _FR_DENOM = [2, 3, 4, 5, 6, 8, 9, 10, 12];
const _FR_UNIT = [2, 3, 4, 5, 6, 8];
function genMultDivItems() {
  const items = [];
  { const a=_opRint(1,7), b=_FR_DENOM[_opRint(0,_FR_DENOM.length-1)], c=_opRint(1,7), d=_FR_DENOM[_opRint(0,_FR_DENOM.length-1)];
    items.push({ text: `Multiplica y simplifica: ${a}/${b} × ${c}/${d} =`, ansTxt: _fracAcc(a*c,b*d), ansShow: _fmtFr(a*c,b*d) }); }
  { const a=_opRint(1,7), b=_FR_DENOM[_opRint(0,_FR_DENOM.length-1)], k=_opRint(2,9);
    items.push({ text: `Multiplica la fracción por el número natural: ${k} × ${a}/${b} =`, ansTxt: _fracAcc(a*k,b), ansShow: _fmtFr(a*k,b) }); }
  { const a=_opRint(1,7), b=_FR_DENOM[_opRint(0,_FR_DENOM.length-1)], c=_opRint(1,7), d=_FR_DENOM[_opRint(0,_FR_DENOM.length-1)];
    items.push({ text: `Divide volteando la segunda: ${a}/${b} ÷ ${c}/${d} =`, ansTxt: _fracAcc(a*d,b*c), ansShow: _fmtFr(a*d,b*c) }); }
  { const a=_opRint(1,7), b=_FR_DENOM[_opRint(0,_FR_DENOM.length-1)], k=_opRint(2,6);
    items.push({ text: `Divide la fracción entre el número natural: ${a}/${b} ÷ ${k} =`, ansTxt: _fracAcc(a,b*k), ansShow: _fmtFr(a,b*k) }); }
  { const a=_opRint(1,4), b=_FR_UNIT[_opRint(0,_FR_UNIT.length-1)], c=_opRint(1,4), d=_FR_UNIT[_opRint(0,_FR_UNIT.length-1)], e=_opRint(1,3), f=_FR_UNIT[_opRint(0,_FR_UNIT.length-1)];
    items.push({ text: `Multiplica las tres: ${a}/${b} × ${c}/${d} × ${e}/${f} =`, ansTxt: _fracAcc(a*c*e,b*d*f), ansShow: _fmtFr(a*c*e,b*d*f) }); }
  return items;
}

// II. Radar del recíproco (5 × 2 = 10 pts) — Bloque 3, Bloque 5 (tabla de criterios) y widget Radar Par-Impar
function genRadarItems() {
  const items = [];
  const tipos = _shuffleF([0, 1, 2, 3, 4], _opRnd);
  tipos.forEach(tp => {
    if (tp === 0) {
      const a=_opRint(2,9), b=Math.max(a+1,_opRint(3,11));
      items.push({ text: `Radar del recíproco: escribe el recíproco de ${a}/${b}.`, ansTxt: [b+'/'+a], ansShow: `${b}/${a} — la fracción se voltea` });
    } else if (tp === 1) {
      const k=_opRint(2,9);
      items.push({ text: `Radar del recíproco: escribe el recíproco del número natural ${k}.`, ansTxt: ['1/'+k], ansShow: `1/${k} — todo natural es ${k}/1, y volteado da 1/${k}` });
    } else if (tp === 2) {
      const n=[6,8,9,10,12][_opRint(0,4)], f=_FR_UNIT[_opRint(0,_FR_UNIT.length-1)];
      items.push({ text: `¿El resultado de ${n} × 1/${f} es mayor o menor que ${n}? Escribe <em>mayor</em> o <em>menor</em>.`, ansTxt: ['menor'], ansShow: `menor — 1/${f} es menos que un entero, así que ${n} encoge` });
    } else if (tp === 3) {
      const n=[4,6,8,9,10][_opRint(0,4)], f=_FR_UNIT[_opRint(0,_FR_UNIT.length-1)];
      items.push({ text: `¿El resultado de ${n} ÷ 1/${f} es mayor o menor que ${n}? Escribe <em>mayor</em> o <em>menor</em>.`, ansTxt: ['mayor'], ansShow: `mayor — caben ${f} pedazos en cada entero: el resultado es ${n*f}` });
    } else {
      const e=_opRint(1,5), n=_opRint(1,5), d=Math.max(n+1,_opRint(2,8));
      items.push({ text: `Escribe la mixta ${e} ${n}/${d} como fracción impropia.`, ansTxt: [(e*d+n)+'/'+d], ansShow: `${e*d+n}/${d} — (${e}×${d}+${n})/${d}` });
    }
  });
  return items;
}

// III. ¿Qué se esconde en ▢? (5 × 4 = 20 pts): la operación inversa, que es donde se ve si entendió el recíproco
function genReglaItems() {
  const items = [];
  const forms = _shuffleF([0, 1, 2, 3, _opRint(0, 3)], _opRnd);
  forms.forEach(f => {
    let expr, hint, ansTxt, ansShow;
    if (f === 0) { const a=_opRint(1,5), b=_opRint(2,9), c=_opRint(1,5), d=_opRint(2,9);
      expr = `${a}/${b} × ▢ = ${a*c}/${b*d}`; hint = 'mira qué le pasó al numerador y al denominador'; ansTxt=[c+'/'+d]; ansShow=`${c}/${d}`; }
    else if (f === 1) { const a=_opRint(2,9), b=Math.max(a+1,_opRint(3,10));
      expr = `${a}/${b} × ▢ = 1`; hint = 'toda fracción por su recíproco da 1'; ansTxt=[b+'/'+a]; ansShow=`${b}/${a}`; }
    else if (f === 2) { const k=_opRint(2,9), b=_opRint(2,9);
      expr = `▢ ÷ 1/${b} = ${k*b}`; hint = `dividir entre 1/${b} multiplica por ${b}`; ansTxt=[String(k), k+'/1']; ansShow=`${k}`; }
    else { const a=_opRint(1,6), b=_opRint(2,9), k=_opRint(2,6);
      expr = `${a}/${b} ÷ ▢ = ${a}/${b*k}`; hint = 'dividir entre un natural agranda el denominador'; ansTxt=[String(k), k+'/1']; ansShow=`${k}`; }
    items.push({ expr, hint, ansTxt, ansShow });
  });
  return items;
}

// IV. Problemas de la vida real (3 × 10 = 30 pts): la fracción de una cantidad, cortar un lazo y una receta
const OP_NAMES = ['Ana', 'Luis', 'Marta', 'José', 'Carmen', 'Pedro', 'Sofía', 'Iván'];
const OP_OBJS = ['mangos', 'tortillas', 'rosquillas', 'naranjas', 'elotes', 'semillas de café'];
const _VI_RECETAS = [['azúcar', 'taza'], ['harina', 'libra'], ['leche', 'litro'], ['manteca', 'taza']];
const _VI_TROZOS = [[6, 3, 4], [8, 2, 3], [9, 3, 4], [10, 1, 2], [12, 2, 3], [6, 1, 2]];
function genVidaItems() {
  const items = [];
  { const nom = OP_NAMES[_opRint(0, OP_NAMES.length - 1)];
    const b = [2,3,4,5,6][_opRint(0,4)], a = _opRint(1, b-1), k = _opRint(3, 9), tot = b*k;
    const obj = OP_OBJS[_opRint(0, OP_OBJS.length - 1)];
    items.push({ text: `${nom} llevó ${tot} ${obj} al mercado y vendió ${a}/${b} de ellos. ¿Cuántos vendió?`, ansNum: a*tot/b, just: `${a}/${b} × ${tot} = ${a*tot/b}` }); }
  { const t = _VI_TROZOS[_opRint(0, _VI_TROZOS.length - 1)]; const total = t[0], n = t[1], d = t[2];
    const pedazos = Math.round(total * d / n);
    items.push({ text: `Un lazo de ${total} metros se corta en pedazos de ${n}/${d} de metro. ¿Cuántos pedazos salen?`, ansNum: pedazos, just: `${total} ÷ ${n}/${d} = ${total} × ${d}/${n} = ${pedazos}` }); }
  { const r = _VI_RECETAS[_opRint(0, _VI_RECETAS.length - 1)]; const d = [2,4,8][_opRint(0,2)]; const a = _opRint(1, d-1); const veces = _opRint(2, 5);
    const num = a*veces;
    items.push({ text: `Una receta lleva ${a}/${d} de ${r[1]} de ${r[0]}. Para ${veces} recetas iguales, ¿cuántos ${d}avos de ${r[1]} se necesitan en total? Escribe solo el numerador del resultado sin simplificar.`, ansNum: num, just: `${a}/${d} × ${veces} = ${num}/${d}` }); }
  return items;
}

// V. Retos de pensamiento crítico (5 + 5 + 10 = 20 pts): los Errores Comunes 1 y 3 y un problema de dos pasos
const _RT_PARES = [[2,3],[3,4],[4,5],[5,6],[2,5],[3,8]];
const _RT_ENTEROS = [4, 6, 8, 9, 10, 12];
const _RT_UNIT = [2, 3, 4, 5];
function genRetoItems() {
  const items = [];
  { const p = _RT_PARES[_opRint(0, _RT_PARES.length - 1)];
    items.push({ text: `Un compañero escribió: ${p[0]}/${p[1]} ÷ 1/2 = ${p[1]}/${p[0]} × 1/2. Encontró el error de voltear la fracción equivocada. Escribe la operación correcta (usa el signo ×).`, ansTxt: [`${p[0]}/${p[1]} x 2/1`, `${p[0]}/${p[1]} x 2`, `${p[0]}/${p[1]}x2/1`, `${p[0]}/${p[1]}x2`], ansShow: `${p[0]}/${p[1]} × 2/1`, pts: 5 }); }
  { const n = _RT_ENTEROS[_opRint(0, _RT_ENTEROS.length - 1)]; const u = _RT_UNIT[_opRint(0, _RT_UNIT.length - 1)];
    items.push({ text: `Sin calcular: ¿cuál da MÁS, ${n} × 1/${u} o ${n} ÷ 1/${u}? Escribe <em>multiplicación</em> o <em>división</em>.`, ansTxt: ['division', 'división', 'la division', 'la división'], ansShow: `división — da ${n*u}, mientras la multiplicación da ${n/u === Math.floor(n/u) ? n/u : n + '/' + u}`, pts: 5 }); }
  { const b = [2,3,4][_opRint(0,2)]; const a = _opRint(1, b-1); const total = b * _opRint(3, 8);
    const primero = a*total/b; const resto = total - primero; const mitad = resto / 2;
    items.push({ text: `De ${total} tortillas se vendieron ${a}/${b} por la mañana y la mitad de las que quedaban por la tarde. ¿Cuántas tortillas sobraron al final?`, ansNum: resto - mitad, just: 'primero el resto, después su mitad', ansShow: `${resto - mitad} — quedaban ${resto}, se vendió la mitad (${mitad}) y sobraron ${resto - mitad}`, pts: 10 }); }
  return items;
}

function genEvalOp() {
  sfx('click');
  _injectFormaSel('genEvalOp', 'evalOpFormaSel', evalOpFormNum, function (v) { evalOpFormNum = v; });
  const _sO = document.getElementById('evalOpFormaSel');
  if (_sO && parseInt(_sO.value, 10)) evalOpFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sO.value, 10)));
  const cf = evalOpFormNum; window._currentEvalOpForm = cf; _opRnd = _evalRng(100000 + cf); /* la Forma cf siembra todo el azar de la prueba operativa */ evalOpFormNum = (evalOpFormNum % EVAL_FORMAS) + 1; _injectFormaSel('genEvalOp', 'evalOpFormaSel', evalOpFormNum, function (v) { evalOpFormNum = v; }); saveProgress();
  document.getElementById('evalop-screen-title').textContent = `📐 Prueba Operativa — Forma ${cf} · Multiplicación y División de Fracciones`;
  evalOpAnsVisible = false;
  const out = document.getElementById('evalOpOut'); out.innerHTML = '';

  const mdItems = genMultDivItems();
  const s1 = document.createElement('div');
  s1.innerHTML = '<div class="eval-section-title">I. Multiplicar y dividir fracciones <span class="eval-pts">20 pts · 4 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel básico. Para multiplicar, en línea recta; para dividir, voltea la segunda. Simplifica siempre el resultado.</p>';
  mdItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.text}</span><input class="eval-cp-input" type="text" data-md="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${it.ansShow || _fmtNum(it.ansNum)}</div><div class="eval-item-feedback" id="evalFbMd${i}" aria-live="polite"></div>`;
    s1.appendChild(d);
  });
  out.appendChild(s1);

  const rdItems = genRadarItems();
  const s2 = document.createElement('div');
  s2.innerHTML = '<div class="eval-section-title">II. Radar del recíproco <span class="eval-pts">10 pts · 2 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel básico. Como en el Radar del Recíproco: voltea, convierte y decide si el resultado crece o encoge.</p>';
  rdItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.text}</span><input class="eval-cp-input" type="text" data-rd="${i}" autocomplete="off"></div><div class="eval-answer">${it.ansShow}</div><div class="eval-item-feedback" id="evalFbRd${i}" aria-live="polite"></div>`;
    s2.appendChild(d);
  });
  out.appendChild(s2);

  const rgItems = genReglaItems();
  const s3 = document.createElement('div');
  s3.innerHTML = '<div class="eval-section-title">III. ¿Qué se esconde en ▢? <span class="eval-pts">20 pts · 4 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel intermedio. La división deshace la multiplicación: piensa qué fracción falta para llegar al resultado.</p>';
  rgItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.expr} <em style="font-size:0.85em;color:var(--gray);">(${it.hint})</em></span><input class="eval-cp-input" type="text" data-rg="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">▢ = ${it.ansShow || _fmtNum(it.ansNum)}</div><div class="eval-item-feedback" id="evalFbRg${i}" aria-live="polite"></div>`;
    s3.appendChild(d);
  });
  out.appendChild(s3);

  const viItems = genVidaItems();
  const s4 = document.createElement('div');
  s4.innerHTML = '<div class="eval-section-title">IV. Problemas de la vida real <span class="eval-pts">30 pts · 10 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel avanzado. Resuelve en tu cuaderno y escribe la respuesta numérica. Recuerda que «de» significa multiplicar.</p>';
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
  if (res) { res.className = 'eval-auto-result ' + (total >= 70 ? 'eval-auto-pass' : 'eval-auto-risk'); res.innerHTML = `<strong>Resultado: ${total}/100 pts</strong><br><span>Multiplicar y dividir: ${det.md}/20 · Recíproco: ${det.rd}/10 · Se esconde en ▢: ${det.rg}/20 · Vida real: ${det.vi}/30 · Retos: ${det.rt}/20</span>`; }
  if (total >= 70) { pts(8); showToast('🎯 Prueba operativa calificada: ' + total + '/100'); }
  else showToast('🧮 Prueba operativa: ' + total + '/100. Revisa los ítems marcados.');
}

function printEvalOp() {
  if (!window._evalOpData) { showToast('⚠️ Genera una prueba operativa primero'); return; }
  sfx('click');
  const forma = window._currentEvalOpForm || 1; const d = window._evalOpData;
  const _plano = (s) => s.replace(/<em[^>]*>/g, '').replace(/<\/em>/g, '');
  let s1 = `<div class="sec-title"><span>I. Multiplicar y dividir fracciones</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Nivel básico. Multiplica en línea recta, divide volteando la segunda y escribe la respuesta en la línea. 4 pts c/u.</p>`;
  d.mdItems.forEach((it, i) => { s1 += `<div class="opx-print-row"><span class="qn">${i+1}.</span><span class="prb-text">${it.text}</span><span class="opx-blank"></span></div>`; });
  const rdTbl = (items) => `<table class="rnd-tbl"><tr><th>#</th><th>Radar del recíproco: voltea, convierte y decide</th><th>Respuesta</th></tr>${items.map((it, i) => `<tr><td>${i+1}</td><td>${_plano(it.text)}</td><td></td></tr>`).join('')}</table>`;
  let s2 = `<div class="sec-title"><span>II. Radar del recíproco</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10 pts</span></div></div><p class="opx-instr">Nivel básico. Recuerda: el recíproco se voltea · multiplicar por menos de 1 encoge · dividir entre menos de 1 agranda · la mixta se vuelve impropia antes de operar. 2 pts c/u.</p>${rdTbl(d.rdItems)}`;
  const rgTbl = (items) => `<table class="rnd-tbl"><tr><th>#</th><th>Operación</th><th>Pista</th><th>▢ =</th></tr>${items.map((it, i) => `<tr><td>${i+1}</td><td>${it.expr}</td><td>${it.hint}</td><td></td></tr>`).join('')}</table>`;
  let s3 = `<div class="sec-title"><span>III. ¿Qué se esconde en ▢?</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Nivel intermedio. La división deshace la multiplicación: piensa qué fracción falta. 4 pts c/u.</p>${rgTbl(d.rgItems)}`;
  let s4 = `<div class="sec-title"><span>IV. Problemas de la vida real</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 30 pts</span></div></div><p class="opx-instr">Nivel avanzado. Resuelve en el espacio mostrando tu procedimiento y escribe la respuesta. 10 pts c/u.</p>`;
  d.viItems.forEach((it, i) => { s4 += `<div class="opx-print-row"><span class="qn">${i+1}.</span><span class="prb-text">${it.text}</span><span class="opx-blank"></span></div><div class="opx-space"></div>`; });
  let s5 = `<div class="sec-title"><span>V. Retos de pensamiento crítico</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Nivel desafío. ¡Cuidado con los Errores Comunes! Valor: 5 + 5 + 10 pts.</p>`;
  d.rtItems.forEach((it, i) => { s5 += `<div class="opx-print-row"><span class="qn">${i+1}.</span><span class="prb-text">${_plano(it.text)} <strong>(${it.pts} pts)</strong></span><span class="opx-blank"></span></div>`; });
  let pR = '';
  pR += `<div class="p-sec"><div class="p-ttl">I. Multiplicar y dividir fracciones</div><table class="p-tbl">${d.mdItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${it.ansShow || _fmtNum(it.ansNum)}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">II. Radar del recíproco</div><table class="p-tbl">${d.rdItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${it.ansShow}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">III. ¿Qué se esconde en ▢?</div><table class="p-tbl">${d.rgItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">▢ = ${it.ansShow || _fmtNum(it.ansNum)}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">IV. Problemas de la vida real</div><table class="p-tbl">${d.viItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${it.ansShow || _fmtNum(it.ansNum)} — ${it.just}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec" style="grid-column:1/-1;"><div class="p-ttl">V. Retos de pensamiento crítico</div><table class="p-tbl">${d.rtItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${it.ansShow} (${it.pts} pts)</td></tr>`).join('')}</table></div>`;
  const doc = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Prueba Operativa Multiplicación y División de Fracciones · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11.5pt;color:#111;background:#fff;padding:4mm 6mm;}.ph{margin-bottom:0.5rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;color:#1565c0;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:#1565c0;margin-top:0.15rem;font-weight:700;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.45rem 0 0.2rem;border-left:4px solid #1565c0;background:#e3f2fd;display:flex;justify-content:space-between;align-items:center;color:#1565c0;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:#1565c0;font-weight:700;font-style:italic;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #1565c0;height:12px;}.qn{font-weight:700;min-width:20px;display:inline-block;color:#1565c0;flex-shrink:0;}.opx-instr{font-size:9pt;color:#555;margin-bottom:0.22rem;}.opx-blank{display:inline-block;width:80px;flex:none;border-bottom:1.5px solid #111;min-height:13px;margin-left:0.3rem;}.opx-print-row{display:flex;align-items:baseline;gap:0.4rem;font-size:10pt;padding:0.24rem 0.1rem;border-bottom:1px dotted #ddd;}.opx-space{height:26px;border-bottom:1px dotted #ccc;margin:0 0 2px 20px;}.prb-text{flex:1;line-height:1.35;}.rnd-tbl{width:100%;border-collapse:collapse;font-size:9.5pt;margin-top:0.15rem;}.rnd-tbl th,.rnd-tbl td{border:1px solid #bbb;padding:0.16rem 0.35rem;text-align:left;}.rnd-tbl th{background:#e3f2fd;color:#1565c0;font-size:8.5pt;}.total-row{display:flex;align-items:baseline;justify-content:flex-end;gap:7px;font-size:11pt;color:#1565c0;font-weight:700;font-style:italic;margin-top:0.45rem;padding:0.2rem 0.5rem;background:#e3f2fd;border-radius:4px;}.total-row .obt-line{min-width:80px;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #1565c0;padding-bottom:0.3rem;margin-bottom:0.5rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;color:#1565c0;}.p-sub{font-size:9pt;color:#1565c0;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #cce0ff;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;color:#1565c0;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#1565c0;}.pa{color:#007a00;font-weight:700;font-family:'Courier New',monospace;}.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:8mm 10mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Examen de Matemáticas — Prueba Operativa · Multiplicación y División de Fracciones · Educación Básica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 pts · I: 20 · II: 10 · III: 20 · IV: 30 · V: 20 · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✔ PAUTA — Prueba Operativa · Multiplicación y División de Fracciones · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">100 pts · Matemáticas · Educación Básica</div></div><div class="p-grid">${pR}</div></div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("evalPage",250,0.55,1.2);fit("pautaPage",250,0.55,1.2);})();<\/script></body></html>`;
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
  const msgs=['💡 ¡ÁNIMO! Comienza tu misión. ¡Cada paso cuenta!','🌱 ¡GRAN INICIO! Estás dando los primeros pasos.','🔑 ¡BUEN TRABAJO! Vas progresando muy bien.','💪 ¡MUY BIEN! Dominas gran parte del contenido.','🏅 ¡INCREÍBLE avance! Estás cerca de la excelencia.','🎓 ¡EXTRAORDINARIO! Completaste TODA la misión. ¡Eres experto en Multiplicación y División de Fracciones!'];
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
  const txt=`${stars} CONSTANCIA DE LOGRO ${stars}\n\n📚 Misión: Multiplicación y División de Fracciones\n👤 Estudiante: ${name}\n📊 Progreso: ${pct}% completado\n⭐ XP obtenido: ${xp} de ${MXP}${achText?'\n\n🏆 Logros desbloqueados:\n'+achText:''}\n\n${msg}\n\n📅 ${date}\n🏠 Proyecto Educativo M.E.T.A.S\n🌐 policastsapien.com`;
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
