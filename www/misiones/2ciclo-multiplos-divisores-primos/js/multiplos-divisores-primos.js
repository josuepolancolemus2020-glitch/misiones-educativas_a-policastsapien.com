// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
// Compartir misión por WhatsApp
function compartirMision() {
    const url = window.location.href;
    const texto = `🚀 *Misión Asignada: Múltiplos, Divisores y Primos* 🚀\n\nIdentifica múltiplos, divisores, números pares, impares y primos, y descompón números en factores primos. 🏆\n\nDesbloquea *todos los logros* y envía a tu maestro la *constancia de logro* cuando hayas culminado. 📋\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;
    _waShare(texto);
}

// ===================== ACCESIBILIDAD =====================
function toggleLetra() {
  document.body.classList.toggle('letra-grande');
  if(typeof sfx === 'function') sfx('click');
  localStorage.setItem('prefLetraMultiplosDivisores', document.body.classList.contains('letra-grande'));
}
window.addEventListener('DOMContentLoaded', () => {
  if(localStorage.getItem('prefLetraMultiplosDivisores') === 'true') document.body.classList.add('letra-grande');
});

// ===================== UTILIDADES =====================
const _pick = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
const _shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
function fb(id, msg, isOk) {
  const el = document.getElementById(id);
  if(el) { el.textContent = msg; el.className = 'fb show ' + (isOk ? 'ok' : 'err'); }
}
// Divisores de un número (ordenados)
function _divisoresDe(n){ const d=[]; for(let i=1;i<=n;i++) if(n%i===0) d.push(i); return d; }
function _esPrimo(n){ if(n<2) return false; for(let i=2;i*i<=n;i++) if(n%i===0) return false; return true; }
function _factoriza(n){ const f=[]; let m=n; for(let p=2;p<=m;p++){ while(m%p===0){ f.push(p); m/=p; } } return f; }

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY = 'matematica_multiplos_divisores_v1';
let xp = 0, MXP = 200, done = new Set(), evalAnsVisible = false;
let evalFormNum = 1, evalOpFormNum = 1, evalOpAnsVisible = false, unlockedAch = [], darkMode = false, prevLevel = 0;
const TOTAL_SECTIONS = 16;
const xpTracker = { fc: new Set(), qz: new Set(), cls: new Set(), id: new Set(), cmp: new Set(), reto: new Set(), sopa: new Set(), predice: new Set(), explica: new Set() };

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
  {w:'Múltiplo',a:'resultado de multiplicar un número por 1, 2, 3… los múltiplos de 4 son <strong>4, 8, 12, 16…</strong> ¡y nunca se acaban!'},
  {w:'Divisor',a:'número que divide a otro en forma <strong>exacta</strong> (residuo 0). el 3 es divisor de 12 porque 12÷3=4 exacto.'},
  {w:'Número Par',a:'termina en <strong>0, 2, 4, 6 u 8</strong>. se puede repartir en parejas sin que sobre nada.'},
  {w:'Número Impar',a:'termina en <strong>1, 3, 5, 7 o 9</strong>. al repartir en parejas siempre <strong>sobra 1</strong>.'},
  {w:'Número Primo',a:'tiene exactamente <strong>dos divisores</strong>: el 1 y él mismo. ejemplos: 2, 3, 5, 7, 11, 13…'},
  {w:'Número Compuesto',a:'tiene <strong>más de dos divisores</strong>. el 12 tiene seis: 1, 2, 3, 4, 6 y 12.'},
  {w:'El número 1',a:'<strong>no es primo ni compuesto</strong>: tiene un solo divisor (él mismo).'},
  {w:'El número 2',a:'es el <strong>único primo que es par</strong>. todos los demás pares tienen al 2 como divisor extra.'},
  {w:'Factor Primo',a:'divisor de un número que además es primo. los factores primos de 12 son <strong>2 y 3</strong>.'},
  {w:'Descomposición Factorial',a:'escribir un número como producto de factores primos: <strong>12 = 2 × 2 × 3</strong>.'},
  {w:'Criba de Eratóstenes',a:'método para descubrir primos: se <strong>tachan los múltiplos</strong> de 2, 3, 5, 7… y los que quedan sin tachar son primos.'},
  {w:'Criterio del 2',a:'un número es divisible entre 2 si su <strong>última cifra es par</strong> (0, 2, 4, 6, 8).'},
  {w:'Criterio del 5',a:'un número es divisible entre 5 si termina en <strong>0 o en 5</strong>.'},
  {w:'Criterio del 3',a:'un número es divisible entre 3 si la <strong>suma de sus cifras</strong> es múltiplo de 3. 51 → 5+1=6 ✔.'}
];
let fcIdx=0;
function upFC(){ document.getElementById('fcInner').classList.remove('flipped'); document.getElementById('fcW').textContent=fcData[fcIdx].w; document.getElementById('fcA').innerHTML=fcData[fcIdx].a; document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length; }
function flipCard(){ sfx('flip'); document.getElementById('fcInner').classList.toggle('flipped'); if(!xpTracker.fc.has(fcIdx)){ xpTracker.fc.add(fcIdx); pts(1); } if(xpTracker.fc.size===fcData.length){ fin('s-flash'); unlockAchievement('flash_master'); } }
function nextFC(){ sfx('click'); fcIdx=(fcIdx+1)%fcData.length; upFC(); }
function prevFC(){ sfx('click'); fcIdx=(fcIdx-1+fcData.length)%fcData.length; upFC(); }

// ===================== QUIZ DATA =====================
const qzData=[
  {q:'¿Cuál de estos números es múltiplo de 6?',o:['a) 32','b) 42','c) 26','d) 40'],c:1,feedback:'42 = 6 × 7. Los múltiplos de 6 son 6, 12, 18, 24, 30, 36, 42…'},
  {q:'¿Cuál es divisor de 20?',o:['a) 3','b) 6','c) 4','d) 9'],c:2,feedback:'20 ÷ 4 = 5 exacto (residuo 0), así que 4 es divisor de 20.'},
  {q:'¿Cuál de estos números es impar?',o:['a) 348','b) 570','c) 236','d) 195'],c:3,feedback:'195 termina en 5, que es cifra impar. ¡Solo la última cifra decide!'},
  {q:'¿Cuál de estos números es primo?',o:['a) 21','b) 23','c) 25','d) 27'],c:1,feedback:'23 solo tiene dos divisores: 1 y 23. En cambio 21=3×7, 25=5×5 y 27=3×9.'},
  {q:'¿Cuántos divisores tiene el número 12?',o:['a) 4','b) 5','c) 6','d) 2'],c:2,feedback:'Los divisores de 12 son: 1, 2, 3, 4, 6 y 12. ¡Seis en total!'},
  {q:'La descomposición en factores primos de 18 es:',o:['a) 2 × 9','b) 3 × 6','c) 2 × 3 × 3','d) 18 × 1'],c:2,feedback:'2 × 9 y 3 × 6 dan 18, pero 9 y 6 NO son primos. La correcta es 2 × 3 × 3.'},
  {q:'¿Por qué el 1 no es un número primo?',o:['a) porque es impar','b) porque tiene un solo divisor','c) porque es muy pequeño','d) porque es par'],c:1,feedback:'Un primo necesita exactamente DOS divisores; el 1 solo tiene uno (él mismo).'},
  {q:'¿Cuál es el único número primo que es par?',o:['a) el 4','b) el 0','c) el 2','d) no existe'],c:2,feedback:'El 2 solo tiene dos divisores (1 y 2). Los demás pares también se dividen entre 2.'},
  {q:'¿Cuál número es divisible entre 5?',o:['a) 352','b) 508','c) 731','d) 490'],c:3,feedback:'490 termina en 0. Los divisibles entre 5 terminan en 0 o en 5.'},
  {q:'¿Cuál es el número cuya factorización es 2 × 2 × 5?',o:['a) 20','b) 25','c) 45','d) 10'],c:0,feedback:'2 × 2 = 4 y 4 × 5 = 20. ¡Multiplicar los factores devuelve el número!'}
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
    label:['Pares','Impares'], headA:'2️⃣ Números PARES', headB:'1️⃣ Números IMPARES', colA:'par', colB:'impar',
    words:[{w:'348',t:'par'},{w:'205',t:'impar'},{w:'1,000',t:'par'},{w:'87',t:'impar'},{w:'56',t:'par'},{w:'999',t:'impar'},{w:'432',t:'par'},{w:'71',t:'impar'},{w:'94',t:'par'},{w:'63',t:'impar'}]
  },
  {
    label:['Primos','Compuestos'], headA:'💎 Números PRIMOS', headB:'🧱 Números COMPUESTOS', colA:'primo', colB:'comp',
    words:[{w:'7',t:'primo'},{w:'15',t:'comp'},{w:'13',t:'primo'},{w:'21',t:'comp'},{w:'29',t:'primo'},{w:'33',t:'comp'},{w:'41',t:'primo'},{w:'49',t:'comp'},{w:'2',t:'primo'},{w:'27',t:'comp'}]
  },
  {
    label:['Múltiplos de 5','No múltiplos de 5'], headA:'✋ MÚLTIPLOS de 5', headB:'🚫 NO múltiplos de 5', colA:'si', colB:'no',
    words:[{w:'40',t:'si'},{w:'85',t:'si'},{w:'72',t:'no'},{w:'110',t:'si'},{w:'34',t:'no'},{w:'95',t:'si'},{w:'58',t:'no'},{w:'200',t:'si'},{w:'66',t:'no'},{w:'81',t:'no'}]
  },
  {
    label:['Divisores de 24','No divisores de 24'], headA:'🔑 DIVISORES de 24', headB:'🚫 NO divisores de 24', colA:'div', colB:'nodiv',
    words:[{w:'6',t:'div'},{w:'8',t:'div'},{w:'5',t:'nodiv'},{w:'12',t:'div'},{w:'9',t:'nodiv'},{w:'3',t:'div'},{w:'7',t:'nodiv'},{w:'4',t:'div'},{w:'10',t:'nodiv'},{w:'1',t:'div'}]
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
  {s:['Los','múltiplos','de','4','son','4,','8,','12,','16…'],c:1,art:'Resultados de multiplicar un número por 1, 2, 3…'},
  {s:['El','3','es','divisor','de','12','porque','la','división','es','exacta.'],c:3,art:'Número que divide a otro con residuo cero'},
  {s:['Un','número','par','termina','en','0,','2,','4,','6','u','8.'],c:2,art:'Tipo de número que se reparte en parejas sin sobrar'},
  {s:['Un','primo','tiene','solo','dos','divisores:','1','y','él','mismo.'],c:1,art:'Número con exactamente dos divisores'},
  {s:['El','12','es','compuesto','porque','tiene','seis','divisores.'],c:3,art:'Número con más de dos divisores'},
  {s:['En','12=2×2×3,','los','números','2','y','3','son','factores','primos.'],c:8,art:'Nombre de los divisores primos en una descomposición'},
  {s:['La','criba','de','Eratóstenes','tacha','los','múltiplos','para','hallar','primos.'],c:1,art:'Método de la tabla para descubrir primos'},
  {s:['Si','al','repartir','en','parejas','sobra','1,','el','número','es','impar.'],c:10,art:'Tipo de número al que siempre le sobra 1 en parejas'}
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
  {s:'Los múltiplos de un número se obtienen al ___ por 1, 2, 3…',opts:['dividirlo','multiplicarlo','restarlo'],c:1},
  {s:'Un divisor divide a un número con residuo ___.',opts:['uno','dos','cero'],c:2},
  {s:'Los números pares terminan en 0, 2, 4, 6 u ___.',opts:['8','9','5'],c:0},
  {s:'Un número primo tiene exactamente ___ divisores.',opts:['tres','dos','cuatro'],c:1},
  {s:'El número 1 no es primo ni ___.',opts:['compuesto','impar','natural'],c:0},
  {s:'El único primo par es el ___.',opts:['4','0','2'],c:2},
  {s:'La descomposición factorial de 12 es 2 × 2 × ___.',opts:['3','4','6'],c:0},
  {s:'Un número es divisible entre 5 si termina en 0 o en ___.',opts:['2','5','8'],c:1}
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
    q: 'Sin dividir: ¿el número 247 es par o impar?',
    opts: ['Par', 'Impar', 'No se puede saber sin dividir'],
    correct: 1,
    feedback: '¡Correcto! Solo hay que mirar la última cifra: 7 es impar, así que 247 es impar.',
    wrongFeedback: 'La respuesta es: impar. La última cifra manda: 247 termina en 7, y 7 es impar.',
    explore: 'cifra'
  },
  {
    q: '¿Cuántos divisores tiene el número 12?',
    opts: ['2 divisores', '4 divisores', '6 divisores'],
    correct: 2,
    feedback: '¡Excelente! 1, 2, 3, 4, 6 y 12: seis divisores. Cada rectángulo descubre una pareja.',
    wrongFeedback: 'La respuesta es 6: los divisores de 12 son 1, 2, 3, 4, 6 y 12. ¡Explora los rectángulos!',
    explore: 'rect'
  },
  {
    q: 'El 51 parece primo… ¿lo es de verdad?',
    opts: ['Sí, es primo', 'No, es compuesto', 'Es primo porque es impar'],
    correct: 1,
    feedback: '¡Muy bien! 51 = 3 × 17, tiene cuatro divisores: es compuesto. ¡Era una trampa!',
    wrongFeedback: 'La respuesta es: compuesto. 5+1=6 (múltiplo de 3), así que 51 = 3 × 17. No todo impar es primo.',
    explore: 'primo51'
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
  if(type==='cifra'){
    box.innerHTML=`<p class="pd-tip">El número es <strong>2 4 7</strong>. Toca cada cifra y descubre cuál decide si es par o impar:</p><div class="pd-line" id="pd-line-${i}"></div><div class="pd-msg" id="pd-msg-${i}">👆 toca las cifras del número</div>`;
    const line=document.getElementById('pd-line-'+i);
    const cifras=[{v:'2',rol:'centenas'},{v:'4',rol:'decenas'},{v:'7',rol:'unidades'}];
    cifras.forEach((c,k)=>{
      const t=_pdTick(c.v);
      t.onclick=()=>{ sfx('click'); line.querySelectorAll('.pd-tick').forEach(x=>x.classList.remove('pd-on','pd-win'));
        const msg=document.getElementById('pd-msg-'+i);
        if(k===2){ t.classList.add('pd-win'); msg.innerHTML=`🎯 ¡La cifra de las <strong>unidades</strong> es la que manda! 247 termina en <strong>7</strong>, y el 7 es impar. Ahora responde abajo.`; sfx('ok'); }
        else{ t.classList.add('pd-on'); msg.innerHTML=`🤔 El <strong>${c.v}</strong> está en las ${c.rol}: esa cifra <strong>no decide</strong> si el número es par. ¡Busca la cifra que sí manda!`; } };
      line.appendChild(t);
    });
  } else if(type==='rect'){
    box.innerHTML=`<p class="pd-tip">12 fichas se pueden ordenar en rectángulos. Toca cada botón y mira qué pareja de divisores descubre:</p><div style="display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;margin:0.5rem 0;"><button class="btn btn-pri" onclick="predRectDemo(${i},1,12)">1 × 12</button><button class="btn btn-pri" onclick="predRectDemo(${i},2,6)">2 × 6</button><button class="btn btn-pri" onclick="predRectDemo(${i},3,4)">3 × 4</button></div><div class="pd-counter" id="pd-cnt-${i}" style="font-size:1rem;letter-spacing:2px;">&nbsp;</div><div class="pd-msg" id="pd-msg-${i}">👆 prueba los tres rectángulos</div>`;
    box.dataset.found='';
  } else if(type==='primo51'){
    box.innerHTML=`<p class="pd-tip">Ponte de detective 🕵️: prueba si algún número divide al 51 en forma exacta:</p><div style="display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;margin:0.5rem 0;"><button class="btn btn-pri" onclick="predDiv51(${i},2)">probar ÷ 2</button><button class="btn btn-pri" onclick="predDiv51(${i},3)">probar ÷ 3</button><button class="btn btn-pri" onclick="predDiv51(${i},5)">probar ÷ 5</button><button class="btn btn-pri" onclick="predDiv51(${i},7)">probar ÷ 7</button></div><div class="pd-msg" id="pd-msg-${i}">👆 toca un botón para probar una división</div>`;
  }
}
function predRectDemo(i,a,b){
  sfx('click');
  const cnt=document.getElementById('pd-cnt-'+i), msg=document.getElementById('pd-msg-'+i);
  const box=document.getElementById('pd-explore-'+i);
  let filas=''; for(let r=0;r<a;r++){ filas+='🔵'.repeat(b)+'<br>'; }
  cnt.innerHTML=filas;
  const found=new Set((box.dataset.found||'').split(',').filter(Boolean)); found.add(a); found.add(b);
  box.dataset.found=[...found].join(',');
  const lista=[...found].map(Number).sort((x,y)=>x-y).join(', ');
  if(found.size>=6){ msg.innerHTML=`🎉 ¡Descubriste los <strong>6 divisores</strong> de 12: ${lista}! Cada rectángulo regala una pareja. Ahora responde abajo.`; sfx('ok'); }
  else{ msg.innerHTML=`📐 Rectángulo de ${a} filas con ${b} fichas: la pareja <strong>${a} y ${b}</strong> divide al 12 en forma exacta. Divisores descubiertos: <strong>${lista}</strong>.`; }
}
function predDiv51(i,d){
  sfx('click');
  const msg=document.getElementById('pd-msg-'+i);
  if(d===3){ msg.innerHTML=`💥 ¡Bingo! 51 ÷ 3 = <strong>17 exacto</strong>: 51 = 3 × 17. Tiene más de dos divisores… ¡Ya sabes qué responder! Truco: 5+1=6, y 6 es múltiplo de 3.`; sfx('ok'); }
  else if(d===2){ msg.innerHTML=`❌ 51 ÷ 2 no es exacta (termina en 1, cifra impar). Prueba con otro número.`; }
  else if(d===5){ msg.innerHTML=`❌ 51 ÷ 5 no es exacta (no termina en 0 ni en 5). Prueba con otro número.`; }
  else{ msg.innerHTML=`❌ 51 ÷ 7 = 7.28…, no es exacta. Prueba con otro número.`; }
}

// ===================== RETO FINAL (con parejas variables) =====================
const retoPairs=[
  {
    name:'Cuenta divisores 🔑', hint:'Cuenta los divisores de A (¡no olvides el 1 y el mismo número!) y compara con B',
    pool:[
      {w:'A: divisores de 12 ⚖ B: 6',t:'igual'},{w:'A: divisores de 7 ⚖ B: 3',t:'menor'},{w:'A: divisores de 16 ⚖ B: 4',t:'mayor'},
      {w:'A: divisores de 9 ⚖ B: 3',t:'igual'},{w:'A: divisores de 25 ⚖ B: 5',t:'menor'},{w:'A: divisores de 20 ⚖ B: 5',t:'mayor'},
      {w:'A: divisores de 11 ⚖ B: 2',t:'igual'},{w:'A: divisores de 15 ⚖ B: 6',t:'menor'},{w:'A: divisores de 24 ⚖ B: 6',t:'mayor'},
      {w:'A: divisores de 10 ⚖ B: 4',t:'igual'},{w:'A: divisores de 13 ⚖ B: 4',t:'menor'},{w:'A: divisores de 36 ⚖ B: 8',t:'mayor'}
    ]
  },
  {
    name:'Doble, triple y mitad 🔁', hint:'Doble = ×2, triple = ×3, mitad = ÷2. Calcula A y compara con B',
    pool:[
      {w:'A: el doble de 26 ⚖ B: 50',t:'mayor'},{w:'A: la mitad de 84 ⚖ B: 42',t:'igual'},{w:'A: el triple de 15 ⚖ B: 50',t:'menor'},
      {w:'A: el doble de 45 ⚖ B: 90',t:'igual'},{w:'A: la mitad de 70 ⚖ B: 40',t:'menor'},{w:'A: el triple de 20 ⚖ B: 55',t:'mayor'},
      {w:'A: el doble de 38 ⚖ B: 80',t:'menor'},{w:'A: la mitad de 96 ⚖ B: 48',t:'igual'},{w:'A: el triple de 12 ⚖ B: 30',t:'mayor'},
      {w:'A: el doble de 55 ⚖ B: 110',t:'igual'},{w:'A: el triple de 25 ⚖ B: 80',t:'menor'},{w:'A: la mitad de 120 ⚖ B: 55',t:'mayor'}
    ]
  },
  {
    name:'Factorizaciones 🌳', hint:'Multiplica los factores primos de A y compara el resultado con B',
    pool:[
      {w:'A: 2 × 2 × 3 ⚖ B: 12',t:'igual'},{w:'A: 2 × 3 × 5 ⚖ B: 28',t:'mayor'},{w:'A: 2 × 2 × 5 ⚖ B: 24',t:'menor'},
      {w:'A: 3 × 3 × 2 ⚖ B: 18',t:'igual'},{w:'A: 2 × 2 × 2 ⚖ B: 10',t:'menor'},{w:'A: 5 × 5 ⚖ B: 20',t:'mayor'},
      {w:'A: 2 × 3 × 7 ⚖ B: 42',t:'igual'},{w:'A: 3 × 5 ⚖ B: 16',t:'menor'},{w:'A: 2 × 2 × 3 × 3 ⚖ B: 30',t:'mayor'},
      {w:'A: 2 × 5 × 5 ⚖ B: 50',t:'igual'},{w:'A: 3 × 3 × 3 ⚖ B: 30',t:'menor'},{w:'A: 2 × 2 × 2 × 5 ⚖ B: 36',t:'mayor'}
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
  {q:'Sara dice: "todos los números impares son primos". Encuentra DOS números que demuestren que se equivoca.',ans:'Ejemplos: 9 (3×3), 15 (3×5), 21, 25, 27… son impares pero compuestos.',type:'🔎 Detectar error'},
  {q:'Un número misterioso es primo, par y menor que 10. ¿Cuál es y por qué es el único?',ans:'Es el 2. Todos los demás pares se dividen entre 2, así que tienen más de dos divisores.',type:'🕵️ Número misterioso'},
  {q:'¿Puede un número terminar en 0 y NO ser múltiplo de 5? Justifica.',ans:'No. Todo número que termina en 0 es divisible entre 10, y por lo tanto también entre 5 y entre 2.',type:'🧠 Razonar'},
  {q:'Escribe un número de dos cifras que sea múltiplo de 2, de 3 y de 5 a la vez, y explica cómo lo encontraste.',ans:'30, 60 o 90. Debe terminar en 0 (mult. de 2 y 5) y la suma de cifras debe ser múltiplo de 3.',type:'⚡ Triple pista'},
  {q:'¿Cuál número tiene MÁS divisores: 13 o 12? Cuenta y explica la diferencia entre primo y compuesto.',ans:'12 tiene 6 divisores (1,2,3,4,6,12); 13 solo 2 (1 y 13). 12 es compuesto y 13 primo.',type:'🔑 Contar divisores'},
  {q:'Inventa un problema de la vida real donde se necesite repartir 24 objetos en partes iguales y resuélvelo con divisores.',ans:'Respuesta variable. Ej: "24 mangos en bolsas de 6: 24÷6=4 bolsas". Funciona con 1,2,3,4,6,8,12,24.',type:'✏️ Crear problema'}
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
function genTask(){ sfx('click'); const type=document.getElementById('tgType').value; const count=parseInt(document.getElementById('tgCount').value); ansVisible=false; const out=document.getElementById('tgOut'); out.innerHTML=''; if(type==='multiplos') genMultiplosTask(out,count); else if(type==='divisores') genDivisoresTask(out,count); else if(type==='parimpar') genParImparTask(out,count); else if(type==='primos') genPrimosTask(out,count); else if(type==='factorizar') genFactorizarTask(out,count); else if(type==='pensamiento') genPensamientoTask(out,count); fin('s-tareas'); }
function _instrBlock(out,title,lines){ const ib=document.createElement('div'); ib.className='tg-instruction-block'; ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join(''); out.appendChild(ib); }
// ✖️ Escribir múltiplos (aleatorio: nunca se repite)
function genMultiplosTask(out,count){
  _instrBlock(out,'Instrucción — Múltiplos',['Escribe los primeros 6 múltiplos de cada número (empieza multiplicando por 1) y ENCIERRA el que se indica.','<strong>Pista:</strong> los múltiplos se obtienen multiplicando por 1, 2, 3, 4…']);
  for(let i=0;i<count;i++){
    const n=_tgRint(2,12); const k=_tgRint(3,6);
    const lista=[1,2,3,4,5,6].map(j=>n*j);
    _tgTask(out,i,`<strong>Escribe los primeros 6 múltiplos de ${n} y encierra el ${k}.º</strong>${_tgLines(1)}<div class="tg-answer">✔ ${lista.join(', ')} · el ${k}.º es ${n*k}</div>`);
  }
}
// 🔑 Encontrar todos los divisores
function genDivisoresTask(out,count){
  _instrBlock(out,'Instrucción — Divisores',['Encuentra TODOS los divisores de cada número. Búscalos en parejas: si a×b da el número, tanto a como b son divisores.','<strong>Recuerda:</strong> el 1 y el mismo número SIEMPRE son divisores.']);
  const pool=[12,16,18,20,24,28,30,32,36,40,45,48,50,54,60];
  for(let i=0;i<count;i++){
    const n=pool[_tgRint(0,pool.length-1)];
    const divs=_divisoresDe(n);
    _tgTask(out,i,`<strong>Encuentra todos los divisores de ${n}</strong>${_tgLines(1)}<div class="tg-answer">✔ ${divs.join(', ')} (${divs.length} divisores)</div>`);
  }
}
// 2️⃣ Clasificar pares e impares
function genParImparTask(out,count){
  _instrBlock(out,'Instrucción — Pares e impares',['Clasifica cada lista: escribe P debajo de los pares e I debajo de los impares.','<strong>Truco:</strong> solo mira la ÚLTIMA cifra: 0,2,4,6,8 → par; 1,3,5,7,9 → impar.']);
  for(let i=0;i<count;i++){
    const nums=[]; while(nums.length<6){ const v=_tgRint(10,9999); if(!nums.includes(v)) nums.push(v); }
    const ans=nums.map(v=>v+(v%2===0?'→P':'→I')).join(' · ');
    _tgTask(out,i,`<strong style="font-family:'Fira Code',monospace;">${nums.join('  ·  ')}</strong>${_tgLines(1)}<div class="tg-answer">✔ ${ans}</div>`);
  }
}
// 💎 ¿Primo o compuesto?
function genPrimosTask(out,count){
  _instrBlock(out,'Instrucción — ¿Primo o compuesto?',['Decide si cada número es PRIMO o COMPUESTO y justifica escribiendo sus divisores.','<strong>Recuerda:</strong> primo = exactamente 2 divisores. Prueba dividir entre 2, 3, 5 y 7.']);
  for(let i=0;i<count;i++){
    const n=_tgRint(4,60);
    const divs=_divisoresDe(n);
    const tipo=_esPrimo(n)?'PRIMO':'COMPUESTO';
    _tgTask(out,i,`<strong>¿El número ${n} es primo o compuesto? Escribe sus divisores.</strong>${_tgLines(1)}<div class="tg-answer">✔ ${tipo}: divisores ${divs.join(', ')} (${divs.length})</div>`);
  }
}
// 🌳 Descomposición en factores primos
function genFactorizarTask(out,count){
  _instrBlock(out,'Instrucción — Factores primos',['Descompón cada número con el árbol de factores: divide entre el menor primo posible (2, 3, 5, 7…) hasta llegar a 1.','<strong>Comprueba:</strong> al multiplicar todos los factores primos debe salir el número original.']);
  const pool=[12,18,20,24,28,30,36,40,42,45,48,54,60,72,75,80,84,90,96,100];
  for(let i=0;i<count;i++){
    const n=pool[_tgRint(0,pool.length-1)];
    const f=_factoriza(n);
    _tgTask(out,i,`<strong>Descompón ${n} en factores primos</strong>${_tgLines(2)}<div class="tg-answer">✔ ${n} = ${f.join(' × ')}</div>`);
  }
}
function toggleAns(){ ansVisible=!ansVisible; document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none'); sfx('click'); }

// ===================== SOPA DE LETRAS (multidireccional, con inversas) =====================
const sopaSets=[
  {
    size:10,
    grid:[
      ['P','O','L','P','I','T','L','U','M','B'],
      ['R','C','B','R','L','S','C','A','E','M'],
      ['M','R','F','A','C','T','O','R','B','L'],
      ['U','G','O','I','L','C','G','O','L','P'],
      ['M','P','G','S','O','E','R','T','J','L'],
      ['E','D','R','J','I','R','E','I','E','F'],
      ['U','I','O','I','M','V','M','F','B','D'],
      ['P','A','R','B','M','N','I','S','T','A'],
      ['B','O','F','E','L','O','J','D','P','I'],
      ['D','C','I','T','S','E','F','O','L','G']
    ],
    words:[
      {w:'MULTIPLO', cells:[[0,8],[0,7],[0,6],[0,5],[0,4],[0,3],[0,2],[0,1]]},
      {w:'DIVISOR', cells:[[8,7],[7,6],[6,5],[5,4],[4,3],[3,2],[2,1]]},
      {w:'PRIMO', cells:[[4,1],[5,2],[6,3],[7,4],[8,5]]},
      {w:'FACTOR', cells:[[2,2],[2,3],[2,4],[2,5],[2,6],[2,7]]},
      {w:'CRIBA', cells:[[3,5],[4,6],[5,7],[6,8],[7,9]]},
      {w:'DOBLE', cells:[[5,1],[6,2],[7,3],[8,4],[9,5]]},
      {w:'SERIE', cells:[[9,4],[8,3],[7,2],[6,1],[5,0]]},
      {w:'PAR', cells:[[7,0],[7,1],[7,2]]}
    ]
  },
  {
    size:10,
    grid:[
      ['B','T','E','E','R','D','S','J','S','N'],
      ['C','R','D','P','E','A','A','G','O','O'],
      ['E','I','D','S','S','T','E','F','O','T'],
      ['R','P','H','T','I','I','X','I','R','S'],
      ['O','L','E','U','D','M','A','U','A','E'],
      ['O','E','F','D','U','C','C','F','P','U'],
      ['M','U','T','L','O','C','T','M','M','P'],
      ['J','I','O','R','T','R','A','M','I','M'],
      ['P','N','B','N','J','D','B','O','M','O'],
      ['U','P','L','I','O','G','J','I','O','C']
    ],
    words:[
      {w:'COMPUESTO', cells:[[9,9],[8,9],[7,9],[6,9],[5,9],[4,9],[3,9],[2,9],[1,9]]},
      {w:'RESIDUO', cells:[[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4]]},
      {w:'TRIPLE', cells:[[0,1],[1,1],[2,1],[3,1],[4,1],[5,1]]},
      {w:'EXACTA', cells:[[2,6],[3,6],[4,6],[5,6],[6,6],[7,6]]},
      {w:'MITAD', cells:[[4,5],[3,5],[2,5],[1,5],[0,5]]},
      {w:'IMPAR', cells:[[7,8],[6,8],[5,8],[4,8],[3,8]]},
      {w:'CERO', cells:[[1,0],[2,0],[3,0],[4,0]]},
      {w:'UNO', cells:[[9,0],[8,1],[7,2]]}
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
  {q:'Los múltiplos de un número nunca se acaban.',a:true},
  {q:'El 4 es divisor de 18.',a:false},
  {q:'Todo número que termina en 0 es par.',a:true},
  {q:'Todos los números impares son primos.',a:false},
  {q:'El número 2 es el único primo par.',a:true},
  {q:'El número 1 es primo porque solo se divide entre 1.',a:false},
  {q:'Un número compuesto tiene más de dos divisores.',a:true},
  {q:'La descomposición factorial de 18 es 2 × 9.',a:false},
  {q:'Si un número termina en 5, es divisible entre 5.',a:true},
  {q:'El 51 es un número primo.',a:false}
];
const evalMCBank=[
  {q:'¿Cuál de estos números es múltiplo de 7?',o:['a) 27','b) 42','c) 47','d) 37'],a:1},
  {q:'¿Cuántos divisores tiene el número 16?',o:['a) 3','b) 4','c) 5','d) 2'],a:2},
  {q:'¿Cuál de estos números es primo?',o:['a) 33','b) 39','c) 31','d) 35'],a:2},
  {q:'La descomposición en factores primos de 20 es:',o:['a) 4 × 5','b) 2 × 10','c) 2 × 2 × 5','d) 20 × 1'],a:2},
  {q:'¿Cuál número es par y múltiplo de 5 a la vez?',o:['a) 25','b) 52','c) 55','d) 70'],a:3},
  {q:'¿Cuál número NO es divisor de 36?',o:['a) 6','b) 8','c) 9','d) 12'],a:1},
  {q:'¿Qué número no es primo ni compuesto?',o:['a) el 0','b) el 1','c) el 2','d) el 3'],a:1},
  {q:'¿Cuál es el número cuya factorización es 3 × 3 × 5?',o:['a) 30','b) 45','c) 15','d) 90'],a:1}
];
const evalCPBank=[
  {q:'Los múltiplos de 6 son: 6, 12, 18, ___ …',a:'24'},
  {q:'Un número que divide a otro en forma exacta se llama ___.',a:'divisor'},
  {q:'Un número primo tiene exactamente ___ divisores.',a:'dos (2)'},
  {q:'Los números que terminan en 1, 3, 5, 7 o 9 se llaman ___.',a:'impares'},
  {q:'El único número primo que es par es el ___.',a:'2'},
  {q:'Escribir 30 = 2 × 3 × 5 se llama descomposición en factores ___.',a:'primos'},
  {q:'Un número es divisible entre 3 si la ___ de sus cifras es múltiplo de 3.',a:'suma'},
  {q:'El número 1 no es primo ni ___.',a:'compuesto'}
];
const evalPRBank=[
  {term:'Múltiplo',def:'Resultado de multiplicar un número por 1, 2, 3…'},
  {term:'Divisor',def:'Número que divide a otro con residuo cero'},
  {term:'Número primo',def:'Tiene exactamente dos divisores: 1 y él mismo'},
  {term:'Número compuesto',def:'Tiene más de dos divisores'},
  {term:'Número par',def:'Termina en 0, 2, 4, 6 u 8'},
  {term:'Factor primo',def:'Divisor primo que aparece en la descomposición'}
];
function genEval(){
  sfx('click');
  const cf=evalFormNum; window._currentEvalForm=cf; evalFormNum=(evalFormNum%10)+1; saveProgress();
  document.getElementById('eval-screen-title').textContent=`📋 Evaluación Final — Forma ${cf}`;
  evalAnsVisible=false;
  const out=document.getElementById('evalOut'); out.innerHTML='';
  const bar=document.createElement('div'); bar.className='eval-score-bar';
  bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje — 100 puntos</div><div class="esb-dist">4 secciones × 5 preguntas × 5 pts = 100 pts</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">I. Completar 25 pts</span><span class="eval-score-pill esp-tf">II. V/F 25 pts</span><span class="eval-score-pill esp-mc">III. Selección 25 pts</span><span class="eval-score-pill esp-pr">IV. Pareados 25 pts</span></div>`;
  out.appendChild(bar);
  const cpItems=_pick(evalCPBank,5);
  const s1=document.createElement('div'); s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  cpItems.forEach((item,i)=>{ const d=document.createElement('div'); d.className='eval-item'; const qHtml=item.q.replace('___','<span class="eval-blank">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>'); d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div>`; s1.appendChild(d); });
  out.appendChild(s1);
  const tfItems=_pick(evalTFBank,5);
  const s2=document.createElement('div'); s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  tfItems.forEach((item,i)=>{ const d=document.createElement('div'); d.className='eval-item'; d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}"> Falso</label></div><div style="margin-top:0.4rem;margin-left:1.7rem;font-size:0.82rem;color:var(--gray);">Justifica por qué: <span style="display:inline-block;min-width:180px;border-bottom:1px solid var(--border);">&nbsp;</span></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div>`; s2.appendChild(d); });
  out.appendChild(s2);
  const mcItems=_pick(evalMCBank,5);
  const s3=document.createElement('div'); s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  mcItems.forEach((item,i)=>{ const d=document.createElement('div'); d.className='eval-item'; const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join(''); d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div>`; s3.appendChild(d); });
  out.appendChild(s3);
  const prItems=_pick(evalPRBank,5); const shuffledDefs=[...prItems].sort(()=>Math.random()-0.5); const letters=['A','B','C','D','E'];
  const s4=document.createElement('div'); s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  const matchCard=document.createElement('div'); matchCard.className='eval-item';
  let colLeft='<div class="eval-match-col"><h4>📘 Términos</h4>';
  prItems.forEach((item,i)=>{ colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> <span class="eval-match-line">&nbsp;&nbsp;&nbsp;</span> ${item.term}</div>`; });
  colLeft+='</div>';
  let colRight='<div class="eval-match-col"><h4>📗 Definiciones</h4>';
  shuffledDefs.forEach((item,i)=>{ colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`; });
  colRight+='</div>';
  const ansKey=prItems.map((item,i)=>{ const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)]; return `${i+16}→${letter}`; }).join(' · ');
  matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div>`;
  s4.appendChild(matchCard); out.appendChild(s4);
  window._evalPrintData={tf:tfItems,mc:mcItems,cp:cpItems,pr:{terms:prItems,shuffledDefs,letters}};
  fin('s-evaluacion');
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
  const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación Múltiplos, Divisores y Primos · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:12pt;color:#111;background:#fff;padding:4mm 6mm;}.ph{margin-bottom:0.5rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;color:#1565c0;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:#1565c0;margin-top:0.15rem;font-weight:700;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.5rem 0 0.25rem;border-left:4px solid #1565c0;background:#e3f2fd;display:flex;justify-content:space-between;align-items:center;color:#1565c0;}.qn{font-weight:700;min-width:22px;flex-shrink:0;color:#1565c0;}.tf-row{display:flex;align-items:flex-start;gap:0.3rem;font-size:10.5pt;line-height:1.4;padding:0.25rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:42px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.2rem;margin-top:0.2rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.28rem 0.45rem;margin-bottom:0.22rem;break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.4;display:flex;gap:0.3rem;margin-bottom:0.18rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.22rem 0.55rem;}.mc-opts{display:grid;grid-template-columns:repeat(3,1fr);gap:0.08rem 0.25rem;margin-left:1.3rem;}.mc-opt{font-size:9.5pt;display:flex;align-items:center;gap:0.22rem;}.mc-opt input{width:12px;height:12px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.4;padding:0.22rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:130px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{break-inside:avoid;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.2rem 0.5rem;margin-top:0.15rem;}.pr-head{font-size:9pt;font-weight:700;color:#1565c0;margin-bottom:0.2rem;}.pr-item{font-size:10pt;padding:0.22rem 0.32rem;background:#e3f2fd;border-radius:3px;margin-bottom:0.12rem;display:flex;align-items:center;gap:0.22rem;line-height:1.2;}.pr-num{font-weight:700;color:#1565c0;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #1565c0;padding-bottom:0.35rem;margin-bottom:0.5rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;color:#1565c0;}.p-sub{font-size:9pt;color:#1565c0;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #cce0ff;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;color:#1565c0;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#1565c0;}.pa{color:#007a00;font-weight:700;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:#1565c0;font-weight:700;font-style:italic;}.obt-lbl{font-weight:700;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #1565c0;height:12px;}.obt-pct{font-weight:700;}.total-row{display:flex;align-items:baseline;justify-content:flex-end;gap:7px;font-size:11pt;color:#1565c0;font-weight:700;font-style:italic;margin-top:0.4rem;padding:0.2rem 0.5rem;background:#e3f2fd;border-radius:4px;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #1565c0;}.forma-tag{position:fixed;bottom:5mm;right:6mm;font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;}@media print{@page{margin:5mm 7mm;}}</style></head><body><div class="ph"><h2>Evaluación Final · Misión Múltiplos, Divisores y Primos · Matemática</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 4 secciones × 5 preguntas × 5 pts c/u · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div><div class="pauta-wrap"><div class="p-head"><div class="p-main">✔ PAUTA DOCENTE — Evaluación Final · Múltiplos, Divisores y Primos · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">100 pts | 4 secciones × 5 preguntas × 5 pts | Matemáticas II Ciclo</div></div><div class="p-grid">${pR}</div></div><div class="forma-tag">Forma ${forma}</div></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(doc); win.document.close(); setTimeout(()=>win.print(),400);
}

// ===================== EXPLICA CON TUS PALABRAS =====================
const explicaData = [
  {
    q: 'El 51 parece primo, pero no lo es. Explica cómo lo descubres sin calculadora.',
    hint: '💡 Pista: usa el criterio del 3 (suma de cifras).',
    rubric: ['✓ Suma las cifras: 5+1=6, que es múltiplo de 3', '✓ Concluye que 51 es divisible entre 3 (51=3×17)', '✓ Explica que al tener más de dos divisores es compuesto'],
    suggested: 'Sumo sus cifras: 5+1=6, y 6 es múltiplo de 3, así que 51 se divide exacto entre 3: 51=3×17. Como tiene más de dos divisores (1, 3, 17 y 51), es compuesto, no primo.'
  },
  {
    q: '¿Por qué el número 1 no es primo ni compuesto?',
    hint: '💡 Pista: cuenta sus divisores y compara con las definiciones.',
    rubric: ['✓ Indica que el 1 tiene un solo divisor (él mismo)', '✓ Recuerda que un primo necesita exactamente dos divisores', '✓ Recuerda que un compuesto necesita más de dos divisores'],
    suggested: 'El 1 solo tiene un divisor: él mismo. Un primo necesita exactamente dos divisores y un compuesto más de dos. Como el 1 no cumple ninguna de las dos condiciones, no es primo ni compuesto.'
  },
  {
    q: 'Sin hacer ninguna división, explica por qué 3,570 es divisible entre 2, entre 5 y entre 10.',
    hint: '💡 Pista: mira la última cifra.',
    rubric: ['✓ Observa que termina en 0', '✓ Aplica: termina en cifra par → divisible entre 2', '✓ Aplica: termina en 0 o 5 → divisible entre 5, y termina en 0 → divisible entre 10'],
    suggested: '3,570 termina en 0. Como 0 es cifra par, es divisible entre 2; como termina en 0, también es divisible entre 5; y todo número que termina en 0 es divisible entre 10.'
  },
  {
    q: 'Descompón el número 36 en factores primos y explica cada paso del árbol.',
    hint: '💡 Pista: divide siempre entre el menor primo posible (2, luego 3…).',
    rubric: ['✓ Divide sucesivamente: 36÷2=18, 18÷2=9, 9÷3=3, 3÷3=1', '✓ Escribe la factorización: 36 = 2 × 2 × 3 × 3', '✓ Comprueba multiplicando los factores: 2×2×3×3=36'],
    suggested: 'Divido 36 entre 2 y da 18; 18 entre 2 da 9; 9 ya no se divide entre 2, así que uso el 3: 9÷3=3 y 3÷3=1. Los factores primos son 2, 2, 3 y 3, o sea 36 = 2 × 2 × 3 × 3. Compruebo: 2×2=4, 4×9=36 ✔.'
  },
  {
    q: 'Inventa un problema de la vida real donde se repartan 24 objetos en partes iguales y resuélvelo usando los divisores de 24.',
    hint: '💡 Pista: piensa en bolsas, equipos, filas o mesas.',
    rubric: ['✓ El contexto es de la vida real y el reparto es exacto', '✓ Usa un divisor de 24 (1, 2, 3, 4, 6, 8, 12 o 24)', '✓ Resuelve correctamente la división'],
    suggested: '"La maestra tiene 24 lápices y arma paquetes de 6 para cada mesa. ¿Cuántas mesas reciben paquete?" Como 6 es divisor de 24, el reparto es exacto: 24÷6=4 mesas.'
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

// ===================== PRUEBA OPERATIVA — MÚLTIPLOS, DIVISORES Y PRIMOS =====================

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
function _opRint(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function _fmtNum(n) { return n.toLocaleString('en-US'); }
function _isIntMatch(student, expectedNum) {
  const raw = (student || '').toString().trim().replace(/[,\s]/g, '');
  if (!raw) return false;
  const n = parseInt(raw, 10);
  return !isNaN(n) && n === expectedNum;
}

// I. Múltiplos y divisores (5 × 10 = 50 pts)
const _MD_COMPUESTOS = [12, 16, 18, 20, 24, 28, 30, 36, 40, 45, 48, 50];
function genMultDivItems() {
  const items = [];
  for (let i = 0; i < 5; i++) {
    if (i % 2 === 0) {
      const n = _opRint(3, 12), k = _opRint(4, 9);
      items.push({ text: `Escribe el ${k}.º múltiplo de ${n} (el 1.º es ${n}).`, ansNum: n * k });
    } else {
      const n = _MD_COMPUESTOS[_opRint(0, _MD_COMPUESTOS.length - 1)];
      items.push({ text: `¿Cuántos divisores tiene el número ${n}? (No olvides el 1 y el ${n}.)`, ansNum: _divisoresDe(n).length });
    }
  }
  return items;
}

// II. Problemas breves (5 × 4 = 20 pts)
const OP_NAMES = ['Ana', 'Luis', 'Marta', 'José', 'Carmen', 'Pedro', 'Sofía', 'Iván'];
const OP_OBJS = ['mangos', 'libros', 'boletos', 'canicas', 'lápices', 'chocolates'];
function genProblemaItems() {
  const items = [];
  const tipos = _shuffle([0, 1, 2, 3, 4]);
  tipos.forEach(tp => {
    const n1 = OP_NAMES[_opRint(0, OP_NAMES.length - 1)];
    let n2 = OP_NAMES[_opRint(0, OP_NAMES.length - 1)];
    while (n2 === n1) n2 = OP_NAMES[_opRint(0, OP_NAMES.length - 1)];
    const obj = OP_OBJS[_opRint(0, OP_OBJS.length - 1)];
    let text, ansNum;
    if (tp === 0) { const b = _opRint(3, 9), q = _opRint(4, 12); text = `${n1} guarda ${_fmtNum(b * q)} ${obj} en bolsas de ${b}. ¿Cuántas bolsas exactas llena?`; ansNum = q; }
    else if (tp === 1) { const a = _opRint(13, 48); text = `${n1} tiene ${a} ${obj} y ${n2} tiene el doble. ¿Cuántos ${obj} tiene ${n2}?`; ansNum = a * 2; }
    else if (tp === 2) { const a = _opRint(12, 60) * 2; text = `${n1} reparte la mitad de sus ${_fmtNum(a)} ${obj}. ¿Cuántos ${obj} reparte?`; ansNum = a / 2; }
    else if (tp === 3) { const n = _opRint(4, 9), k = _opRint(5, 12); text = `Un autobús pasa cada ${n} minutos. Si acaba de pasar, ¿en cuántos minutos pasarán ${k} autobuses más?`; ansNum = n * k; }
    else { const f = _opRint(3, 8), a = _opRint(11, 30); text = `En la escuela forman ${f} filas con ${a} estudiantes cada una. ¿Cuántos estudiantes hay en total?`; ansNum = f * a; }
    items.push({ text, ansNum });
  });
  return items;
}

// III. Cadena de operaciones (5 × 2 = 10 pts)
function genCadenaItems() {
  const items = [];
  for (let i = 0; i < 5; i++) {
    const tp = i % 3;
    if (tp === 0) { const a = _opRint(12, 45), b = _opRint(10, 90); items.push({ text: `Calcula el doble de ${a} y súmale ${b}. ¿Cuánto obtienes?`, ansNum: a * 2 + b }); }
    else if (tp === 1) { const a = _opRint(11, 30), b = _opRint(5, 40); items.push({ text: `Calcula el triple de ${a} y réstale ${b}. ¿Cuánto obtienes?`, ansNum: a * 3 - b }); }
    else { const a = _opRint(20, 60) * 2, b = _opRint(10, 50); items.push({ text: `Calcula la mitad de ${_fmtNum(a)} y súmale ${b}. ¿Cuánto obtienes?`, ansNum: a / 2 + b }); }
  }
  return items;
}

// IV. ¿Qué número se esconde? (5 × 2 = 10 pts)
function genFaltanteItems() {
  const items = [];
  const forms = [0, 1, 2, 3, _opRint(0, 3)];
  forms.forEach(f => {
    let expr, ansNum;
    if (f === 0) { const x = _opRint(3, 12), a = _opRint(3, 12); expr = `▢ × ${a} = ${_fmtNum(x * a)}`; ansNum = x; }
    else if (f === 1) { const x = _opRint(3, 12), a = _opRint(3, 12); expr = `${a} × ▢ = ${_fmtNum(x * a)}`; ansNum = x; }
    else if (f === 2) { const x = _opRint(3, 12), q = _opRint(3, 12); expr = `${_fmtNum(x * q)} ÷ ▢ = ${q}`; ansNum = x; }
    else { const q = _opRint(3, 12), a = _opRint(3, 9); expr = `▢ ÷ ${a} = ${q}`; ansNum = a * q; }
    items.push({ expr, ansNum });
  });
  return items;
}

// V. Factorizaciones (2 × 5 = 10 pts)
function genFactorItems() {
  const items = [];
  const pool = [12, 18, 20, 24, 28, 30, 36, 40, 42, 45, 50, 54, 60, 75];
  const used = [];
  for (let i = 0; i < 2; i++) {
    let n = pool[_opRint(0, pool.length - 1)];
    while (used.includes(n)) n = pool[_opRint(0, pool.length - 1)];
    used.push(n);
    const f = _factoriza(n);
    if (i === 0) {
      items.push({ text: `Multiplica los factores primos: ${f.join(' × ')} = ▢`, ansNum: n, extra: `es la factorización de ${n}` });
    } else {
      const oculto = f[f.length - 1];
      const visibles = f.slice(0, -1);
      items.push({ text: `Completa la factorización: ${n} = ${visibles.join(' × ')} × ▢`, ansNum: oculto, extra: `${n} = ${f.join(' × ')}` });
    }
  }
  return items;
}

function genEvalOp() {
  sfx('click');
  const cf = evalOpFormNum; window._currentEvalOpForm = cf; evalOpFormNum = (evalOpFormNum % 10) + 1; saveProgress();
  document.getElementById('evalop-screen-title').textContent = `📐 Prueba Operativa — Forma ${cf} · Múltiplos, Divisores y Primos`;
  evalOpAnsVisible = false;
  const out = document.getElementById('evalOpOut'); out.innerHTML = '';

  const mdItems = genMultDivItems();
  const s1 = document.createElement('div');
  s1.innerHTML = '<div class="eval-section-title">I. Múltiplos y divisores <span class="eval-pts">50 pts · 10 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Los múltiplos se obtienen multiplicando por 1, 2, 3… y los divisores se buscan en parejas.</p>';
  mdItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.text}</span><input class="eval-cp-input" type="text" data-md="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${_fmtNum(it.ansNum)}</div><div class="eval-item-feedback" id="evalFbMd${i}" aria-live="polite"></div>`;
    s1.appendChild(d);
  });
  out.appendChild(s1);

  const prItems = genProblemaItems();
  const s2 = document.createElement('div');
  s2.innerHTML = '<div class="eval-section-title">II. Problemas breves <span class="eval-pts">20 pts · 4 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Piensa si el problema pide multiplicar o dividir, resuelve en tu cuaderno y escribe la respuesta.</p>';
  prItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.text}</span><input class="eval-cp-input" type="text" data-pr="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${_fmtNum(it.ansNum)}</div><div class="eval-item-feedback" id="evalFbPr${i}" aria-live="polite"></div>`;
    s2.appendChild(d);
  });
  out.appendChild(s2);

  const caItems = genCadenaItems();
  const s3 = document.createElement('div');
  s3.innerHTML = '<div class="eval-section-title">III. Cadena de operaciones <span class="eval-pts">10 pts · 2 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Doble = ×2 · triple = ×3 · mitad = ÷2. Resuelve paso a paso.</p>';
  caItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.text}</span><input class="eval-cp-input" type="text" data-ca="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${_fmtNum(it.ansNum)}</div><div class="eval-item-feedback" id="evalFbCa${i}" aria-live="polite"></div>`;
    s3.appendChild(d);
  });
  out.appendChild(s3);

  const faItems = genFaltanteItems();
  const s4 = document.createElement('div');
  s4.innerHTML = '<div class="eval-section-title">IV. ¿Qué número se esconde en ▢? <span class="eval-pts">10 pts · 2 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Usa la operación inversa: la división deshace la multiplicación y viceversa.</p>';
  faItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.expr}</span><input class="eval-cp-input" type="text" data-fa="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${_fmtNum(it.ansNum)}</div><div class="eval-item-feedback" id="evalFbFa${i}" aria-live="polite"></div>`;
    s4.appendChild(d);
  });
  out.appendChild(s4);

  const fcItems = genFactorItems();
  const s5 = document.createElement('div');
  s5.innerHTML = '<div class="eval-section-title">V. Factores primos <span class="eval-pts">10 pts · 5 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Recuerda: al multiplicar todos los factores primos se recupera el número original.</p>';
  fcItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.text}</span><input class="eval-cp-input" type="text" data-fc="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${_fmtNum(it.ansNum)} (${it.extra})</div><div class="eval-item-feedback" id="evalFbFc${i}" aria-live="polite"></div>`;
    s5.appendChild(d);
  });
  out.appendChild(s5);

  window._evalOpData = { mdItems, prItems, caItems, faItems, fcItems };
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
  let total = 0; const det = { md: 0, pr: 0, ca: 0, fa: 0, fc: 0 };
  const _mark = (sel, it, i, key, ptsEach, fbId) => {
    const el = document.querySelector(`[data-${sel}="${i}"]`);
    const ok = _isIntMatch(el ? el.value : '', it.ansNum);
    if (el) { el.classList.toggle('eval-input-ok', ok); el.classList.toggle('eval-input-no', !ok); }
    if (ok) { det[key]++; total += ptsEach; }
    setEvalFeedback(fbId + i, ok, ok ? `Correcto. +${ptsEach} pts` : 'Revisar. R/ ' + _fmtNum(it.ansNum));
  };
  d.mdItems.forEach((it, i) => _mark('md', it, i, 'md', 10, 'evalFbMd'));
  d.prItems.forEach((it, i) => _mark('pr', it, i, 'pr', 4, 'evalFbPr'));
  d.caItems.forEach((it, i) => _mark('ca', it, i, 'ca', 2, 'evalFbCa'));
  d.faItems.forEach((it, i) => _mark('fa', it, i, 'fa', 2, 'evalFbFa'));
  d.fcItems.forEach((it, i) => _mark('fc', it, i, 'fc', 5, 'evalFbFc'));
  const res = document.getElementById('evalOpAutoResult');
  if (res) { res.className = 'eval-auto-result ' + (total >= 70 ? 'eval-auto-pass' : 'eval-auto-risk'); res.innerHTML = `<strong>Resultado: ${total}/100 pts</strong><br><span>Múltiplos y divisores: ${det.md*10}/50 · Problemas: ${det.pr*4}/20 · Cadena: ${det.ca*2}/10 · Escondido: ${det.fa*2}/10 · Factores: ${det.fc*5}/10</span>`; }
  if (total >= 70) { pts(8); showToast('🎯 Prueba operativa calificada: ' + total + '/100'); }
  else showToast('🧮 Prueba operativa: ' + total + '/100. Revisa los ítems marcados.');
}

function printEvalOp() {
  if (!window._evalOpData) { showToast('⚠️ Genera una prueba operativa primero'); return; }
  sfx('click');
  const forma = window._currentEvalOpForm || 1; const d = window._evalOpData;
  let s1 = `<div class="sec-title"><span>I. Múltiplos y divisores</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 50 pts</span></div></div><p class="opx-instr">Resuelve y escribe la respuesta en la línea. 10 pts c/u.</p>`;
  d.mdItems.forEach((it, i) => { s1 += `<div class="opx-print-row"><span class="qn">${i+1}.</span><span class="prb-text">${it.text}</span><span class="opx-blank"></span></div>`; });
  let s2 = `<div class="sec-title"><span>II. Problemas breves</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Resuelve en el espacio y escribe la respuesta. 4 pts c/u.</p>`;
  d.prItems.forEach((it, i) => { s2 += `<div class="opx-print-row"><span class="qn">${i+1}.</span><span class="prb-text">${it.text}</span><span class="opx-blank"></span></div>`; });
  const caTbl = (items) => `<table class="rnd-tbl"><tr><th>#</th><th>Cadena de operaciones</th><th>Resultado</th></tr>${items.map((it, i) => `<tr><td>${i+1}</td><td>${it.text.replace(' ¿Cuánto obtienes?','')}</td><td></td></tr>`).join('')}</table>`;
  let s3 = `<div class="sec-title"><span>III. Cadena de operaciones</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10 pts</span></div></div><p class="opx-instr">Doble = ×2 · triple = ×3 · mitad = ÷2. 2 pts c/u.</p>${caTbl(d.caItems)}`;
  const faTbl = (items) => `<table class="rnd-tbl"><tr><th>#</th><th>Operación</th><th>▢ =</th></tr>${items.map((it, i) => `<tr><td>${i+1}</td><td>${it.expr}</td><td></td></tr>`).join('')}</table>`;
  let s4 = `<div class="sec-title"><span>IV. ¿Qué número se esconde en ▢?</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10 pts</span></div></div><p class="opx-instr">Usa la operación inversa. 2 pts c/u.</p>${faTbl(d.faItems)}`;
  const fcTbl = (items) => `<table class="rnd-tbl"><tr><th>#</th><th>Factorización</th><th>▢ =</th></tr>${items.map((it, i) => `<tr><td>${i+1}</td><td>${it.text.replace('Multiplica los factores primos: ','').replace('Completa la factorización: ','')}</td><td></td></tr>`).join('')}</table>`;
  let s5 = `<div class="sec-title"><span>V. Factores primos</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10 pts</span></div></div><p class="opx-instr">Multiplica los factores o completa el que falta. 5 pts c/u.</p>${fcTbl(d.fcItems)}`;
  let pR = '';
  pR += `<div class="p-sec"><div class="p-ttl">I. Múltiplos y divisores</div><table class="p-tbl">${d.mdItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${_fmtNum(it.ansNum)}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">II. Problemas breves</div><table class="p-tbl">${d.prItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${_fmtNum(it.ansNum)}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">III. Cadena de operaciones</div><table class="p-tbl">${d.caItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${_fmtNum(it.ansNum)}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">IV. Número escondido</div><table class="p-tbl">${d.faItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">▢ = ${_fmtNum(it.ansNum)}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec" style="grid-column:1/-1;"><div class="p-ttl">V. Factores primos</div><table class="p-tbl">${d.fcItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">▢ = ${_fmtNum(it.ansNum)} · ${it.extra}</td></tr>`).join('')}</table></div>`;
  const doc = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Prueba Operativa Múltiplos, Divisores y Primos · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11.5pt;color:#111;background:#fff;padding:4mm 6mm;}.ph{margin-bottom:0.5rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;color:#1565c0;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:#1565c0;margin-top:0.15rem;font-weight:700;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.45rem 0 0.2rem;border-left:4px solid #1565c0;background:#e3f2fd;display:flex;justify-content:space-between;align-items:center;color:#1565c0;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:#1565c0;font-weight:700;font-style:italic;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #1565c0;height:12px;}.qn{font-weight:700;min-width:20px;display:inline-block;color:#1565c0;flex-shrink:0;}.opx-instr{font-size:9pt;color:#555;margin-bottom:0.22rem;}.opx-blank{display:inline-block;width:80px;flex:none;border-bottom:1.5px solid #111;min-height:13px;margin-left:0.3rem;}.opx-print-row{display:flex;align-items:baseline;gap:0.4rem;font-size:10pt;padding:0.24rem 0.1rem;border-bottom:1px dotted #ddd;}.prb-text{flex:1;line-height:1.35;}.rnd-tbl{width:100%;border-collapse:collapse;font-size:9.5pt;margin-top:0.15rem;}.rnd-tbl th,.rnd-tbl td{border:1px solid #bbb;padding:0.16rem 0.35rem;text-align:left;}.rnd-tbl th{background:#e3f2fd;color:#1565c0;font-size:8.5pt;}.total-row{display:flex;align-items:baseline;justify-content:flex-end;gap:7px;font-size:11pt;color:#1565c0;font-weight:700;font-style:italic;margin-top:0.45rem;padding:0.2rem 0.5rem;background:#e3f2fd;border-radius:4px;}.total-row .obt-line{min-width:80px;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #1565c0;padding-bottom:0.3rem;margin-bottom:0.5rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;color:#1565c0;}.p-sub{font-size:9pt;color:#1565c0;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #cce0ff;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;color:#1565c0;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#1565c0;}.pa{color:#007a00;font-weight:700;font-family:'Courier New',monospace;}.forma-tag{position:fixed;bottom:5mm;right:6mm;font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;}@media print{@page{size:letter portrait;margin:8mm 10mm;}}</style></head><body><div class="ph"><h2>Examen de Matemáticas — Prueba Operativa · Múltiplos, Divisores y Primos · II Ciclo</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Institución:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 pts · I: 50 · II: 20 · III: 10 · IV: 10 · V: 10 · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div><div class="pauta-wrap"><div class="p-head"><div class="p-main">✔ PAUTA — Prueba Operativa · Múltiplos, Divisores y Primos · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">100 pts · Matemáticas II Ciclo</div></div><div class="p-grid">${pR}</div></div><div class="forma-tag">Forma ${forma}</div></body></html>`;
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
  const msgs=['💡 ¡ÁNIMO! Comienza tu misión. ¡Cada paso cuenta!','🌱 ¡GRAN INICIO! Estás dando los primeros pasos.','🔑 ¡BUEN TRABAJO! Vas progresando muy bien.','💪 ¡MUY BIEN! Dominas gran parte del contenido.','🏅 ¡INCREÍBLE avance! Estás cerca de la excelencia.','🎓 ¡EXTRAORDINARIO! Completaste TODA la misión. ¡Eres experto en Múltiplos, Divisores y Primos!'];
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
  const txt=`${stars} CONSTANCIA DE LOGRO ${stars}\n\n📚 Misión: Múltiplos, Divisores y Primos\n👤 Estudiante: ${name}\n📊 Progreso: ${pct}% completado\n⭐ XP obtenido: ${xp} de ${MXP}${achText?'\n\n🏆 Logros desbloqueados:\n'+achText:''}\n\n${msg}\n\n📅 ${date}\n🏠 Proyecto Educativo M.E.T.A.S\n🌐 policastsapien.com`;
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
