// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
// Compartir misión por WhatsApp
function compartirMision() {
    const url = window.location.href;
    const texto = `🚀 *Misión Asignada: Teoría de Números — Divisibilidad, m.c.m. y M.C.D.* 🚀\n\nDescubre las reglas de divisibilidad (2, 3, 5, 9, 10 y 11) y domina el Mínimo Común Múltiplo y el Máximo Común Divisor con juegos. 🏆\n\nDesbloquea *todos los logros* y envía a tu maestro la *constancia de logro* cuando hayas culminado. 📋\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;
    _waShare(texto);
}

// ===================== ACCESIBILIDAD =====================
function toggleLetra() {
  document.body.classList.toggle('letra-grande');
  if(typeof sfx === 'function') sfx('click');
  localStorage.setItem('prefLetraTeoriaNumeros', document.body.classList.contains('letra-grande'));
}
window.addEventListener('DOMContentLoaded', () => {
  if(localStorage.getItem('prefLetraTeoriaNumeros') === 'true') document.body.classList.add('letra-grande');
});

// ===================== UTILIDADES =====================
const _pick = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
const _shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
function fb(id, msg, isOk) {
  const el = document.getElementById(id);
  if(el) { el.textContent = msg; el.className = 'fb show ' + (isOk ? 'ok' : 'err'); }
}
function _gcd(a, b) { while (b) { [a, b] = [b, a % b]; } return a; }
function _lcm(a, b) { return (a * b) / _gcd(a, b); }

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY = 'matematica_teoria_numeros_v1';
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
function launchConfetti(){ const colors=['#1565c0','#00897b','#00b894','#fdcb6e','#6c5ce7']; for(let i=0;i<60;i++){ const c=document.createElement('div'); c.className='confetti-piece'; c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`; document.body.appendChild(c); c.addEventListener('animationend',()=>c.remove()); } }

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
  {w:'Divisibilidad',a:'Un número es divisible entre otro cuando la división es <strong>exacta</strong> (residuo cero).'},
  {w:'Múltiplo',a:'Resultado de multiplicar un número por 1, 2, 3... Los múltiplos de 4 son: <strong>4, 8, 12, 16...</strong>'},
  {w:'Divisor',a:'Número que divide a otro de forma <strong>exacta</strong>. Los divisores de 12 son: <strong>1, 2, 3, 4, 6, 12</strong>.'},
  {w:'Regla del 2',a:'Es divisible entre 2 si termina en <strong>0, 2, 4, 6 u 8</strong> (número par).'},
  {w:'Regla del 5',a:'Es divisible entre 5 si termina en <strong>0 o 5</strong>.'},
  {w:'Regla del 10',a:'Es divisible entre 10 si termina en <strong>0</strong>.'},
  {w:'Regla del 3',a:'Es divisible entre 3 si la <strong>suma de sus cifras</strong> es múltiplo de 3.'},
  {w:'Regla del 9',a:'Es divisible entre 9 si la <strong>suma de sus cifras</strong> es múltiplo de 9. Ej: 4,518 → 4+5+1+8=18 ✔'},
  {w:'Regla del 11',a:'Es divisible entre 11 si la <strong>suma alternada</strong> de sus cifras da 0 o múltiplo de 11. Ej: 121 → (1+1)−2=0 ✔'},
  {w:'m.c.m.',a:'<strong>Mínimo Común Múltiplo:</strong> el múltiplo común más PEQUEÑO. m.c.m.(4,6)=<strong>12</strong>. Sirve para saber cuándo COINCIDEN.'},
  {w:'M.C.D.',a:'<strong>Máximo Común Divisor:</strong> el divisor común más GRANDE. M.C.D.(12,18)=<strong>6</strong>. Sirve para REPARTIR en partes iguales.'},
  {w:'Número Primo',a:'Tiene exactamente <strong>dos divisores</strong>: 1 y él mismo. Ej: 2, 3, 5, 7, 11, 13...'},
  {w:'Número Compuesto',a:'Tiene <strong>más de dos divisores</strong>. Ej: 12 tiene seis divisores.'},
  {w:'Primos entre sí',a:'Dos números cuyo único divisor común es <strong>1</strong>. Ej: 8 y 15 → M.C.D.=1.'}
];
let fcIdx=0;
function upFC(){ document.getElementById('fcInner').classList.remove('flipped'); document.getElementById('fcW').textContent=fcData[fcIdx].w; document.getElementById('fcA').innerHTML=fcData[fcIdx].a; document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length; }
function flipCard(){ sfx('flip'); document.getElementById('fcInner').classList.toggle('flipped'); if(!xpTracker.fc.has(fcIdx)){ xpTracker.fc.add(fcIdx); pts(1); } if(xpTracker.fc.size===fcData.length){ fin('s-flash'); unlockAchievement('flash_master'); } }
function nextFC(){ sfx('click'); fcIdx=(fcIdx+1)%fcData.length; upFC(); }
function prevFC(){ sfx('click'); fcIdx=(fcIdx-1+fcData.length)%fcData.length; upFC(); }

// ===================== QUIZ DATA =====================
const qzData=[
  {q:'¿Cuál de estos números es divisible entre 9?',o:['a) 4,132','b) 4,518','c) 517','d) 1,234'],c:1,feedback:'4+5+1+8 = 18, que es múltiplo de 9. Los demás no: sus sumas dan 10, 13 y 10.'},
  {q:'¿Por qué 121 es divisible entre 11?',o:['a) Porque termina en 1','b) Porque 1+2+1 = 4','c) Porque (1+1) − 2 = 0','d) Porque es impar'],c:2,feedback:'La suma alternada da 0: (1+1) − 2 = 0. Y 121 = 11 × 11.'},
  {q:'¿Cuál es el m.c.m. de 6 y 8?',o:['a) 48','b) 2','c) 24','d) 14'],c:2,feedback:'Múltiplos de 6: 6,12,18,24... · de 8: 8,16,24... El primero común es 24.'},
  {q:'¿Cuál es el M.C.D. de 12 y 18?',o:['a) 6','b) 36','c) 2','d) 3'],c:0,feedback:'Divisores comunes de 12 y 18: 1, 2, 3 y 6. El mayor es 6.'},
  {q:'Un número termina en 0. ¿Entre cuáles es SEGURO que es divisible?',o:['a) Solo entre 10','b) Entre 2, 5 y 10','c) Entre 3 y 9','d) Entre 11'],c:1,feedback:'Terminar en 0 garantiza divisibilidad entre 2 (par), entre 5 y entre 10.'},
  {q:'¿Qué regla usas para saber si un número es divisible entre 3?',o:['a) Mirar la última cifra','b) Sumar todas sus cifras','c) La suma alternada','d) Contar las cifras'],c:1,feedback:'Si la suma de las cifras es múltiplo de 3, el número es divisible entre 3.'},
  {q:'Dos buses salen de la terminal: uno cada 15 minutos y otro cada 20. ¿Cada cuánto salen juntos?',o:['a) Cada 5 min (M.C.D.)','b) Cada 60 min (m.c.m.)','c) Cada 35 min','d) Cada 300 min'],c:1,feedback:'Es un problema de coincidencia → m.c.m.(15,20) = 60 minutos.'},
  {q:'Quiero repartir 24 lápices y 36 borradores en paquetes iguales, lo más grandes posible. ¿Cuántos paquetes armo?',o:['a) 72 (m.c.m.)','b) 6','c) 12 (M.C.D.)','d) 4'],c:2,feedback:'Es un problema de reparto → M.C.D.(24,36) = 12 paquetes.'},
  {q:'¿Cuál es el M.C.D. de 8 y 15?',o:['a) 0','b) No existe','c) 1','d) 120'],c:2,feedback:'8 y 15 no comparten divisores mayores que 1: son primos entre sí, su M.C.D. es 1.'},
  {q:'¿Cuál de estos números es divisible entre 11?',o:['a) 209','b) 123','c) 456','d) 87'],c:0,feedback:'En 209: (9+2) − 0 = 11 → divisible. Comprobación: 209 ÷ 11 = 19.'}
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
    label:['Divisible entre 9','No divisible entre 9'], headA:'9️⃣ Divisible entre 9', headB:'❌ NO divisible entre 9', colA:'div9', colB:'no9',
    words:[{w:'4,518',t:'div9'},{w:'2,835',t:'div9'},{w:'423',t:'div9'},{w:'6,975',t:'div9'},{w:'738',t:'div9'},{w:'4,132',t:'no9'},{w:'517',t:'no9'},{w:'2,046',t:'no9'},{w:'88',t:'no9'},{w:'1,234',t:'no9'}]
  },
  {
    label:['Divisible entre 11','No divisible entre 11'], headA:'1️⃣1️⃣ Divisible entre 11', headB:'❌ NO divisible entre 11', colA:'div11', colB:'no11',
    words:[{w:'121',t:'div11'},{w:'209',t:'div11'},{w:'154',t:'div11'},{w:'990',t:'div11'},{w:'275',t:'div11'},{w:'123',t:'no11'},{w:'456',t:'no11'},{w:'508',t:'no11'},{w:'87',t:'no11'},{w:'310',t:'no11'}]
  }
];
let currentClassGroupIdx=0, clsSelectedWord=null;
function buildClass(){
  const group=classGroups[currentClassGroupIdx];
  document.getElementById('col-left-head').textContent=group.headA;
  document.getElementById('col-right-head').textContent=group.headB;
  const bank=document.getElementById('clsBank'); bank.innerHTML='';
  clsSelectedWord=null;
  document.getElementById('items-left').innerHTML='';
  document.getElementById('items-right').innerHTML='';

  function _mkDrag(el,text,type){
    el.draggable=true;
    el.ondragstart=(e)=>{e.dataTransfer.setData('text/plain',JSON.stringify({text,type}));e.dataTransfer.effectAllowed='move';setTimeout(()=>{el.style.opacity='0.4';},0);};
    el.ondragend=()=>{el.style.opacity='';};
    return el;
  }
  function _removeWord(text,type){
    document.querySelectorAll('#clsBank .wb-item,#items-left .drop-item,#items-right .drop-item').forEach(el=>{
      if(el.textContent===text&&el.dataset.t===type)el.remove();
    });
  }
  function _mkBankItem(text,type){
    const el=document.createElement('div');el.className='wb-item';el.textContent=text;el.dataset.t=type;
    return _mkDrag(el,text,type);
  }
  function _mkDropItem(text,type){
    const el=document.createElement('div');el.className='drop-item';el.textContent=text;el.dataset.t=type;
    _mkDrag(el,text,type);
    el.onclick=(ev)=>{ev.stopPropagation();_removeWord(text,type);bank.appendChild(_mkBankItem(text,type));sfx('click');};
    return el;
  }
  function _addDropZone(target,targetListId,isBank){
    target.ondragover=(e)=>{e.preventDefault();e.dataTransfer.dropEffect='move';target.style.borderColor='var(--pri)';};
    target.ondragleave=()=>{target.style.borderColor='';};
    target.ondrop=(e)=>{
      e.preventDefault();target.style.borderColor='';
      let data;try{data=JSON.parse(e.dataTransfer.getData('text/plain'));}catch{return;}
      _removeWord(data.text,data.type);
      if(isBank){bank.appendChild(_mkBankItem(data.text,data.type));}
      else{document.getElementById(targetListId).appendChild(_mkDropItem(data.text,data.type));}
      sfx('click');
    };
  }

  _shuffle([...group.words]).forEach(w=>{bank.appendChild(_mkBankItem(w.w,w.t));});
  _addDropZone(document.getElementById('col-left'),'items-left',false);
  _addDropZone(document.getElementById('col-right'),'items-right',false);
  _addDropZone(bank,'clsBank',true);
}
function checkClass(){
  const remaining=document.querySelectorAll('#clsBank .wb-item').length;
  if(remaining>0){fb('fbCls','Mueve todas las palabras a las columnas primero.',false);return;}
  const group=classGroups[currentClassGroupIdx]; let allOk=true;
  document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{
    const inLeft=el.parentElement.id==='items-left';
    const expectedType=inLeft?group.colA:group.colB;
    if(el.dataset.t===expectedType){el.classList.add('cls-ok');}else{el.classList.add('cls-no');allOk=false;}
  });
  if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);}
  if(allOk){fb('fbCls','¡Perfecto! +5 XP',true);sfx('fan');fin('s-clasifica');unlockAchievement('clasif_pro');}
  else{fb('fbCls','Hay errores. Marcados en rojo.',false);sfx('no');}
}
function nextClassGroup(){ sfx('click'); currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length; buildClass(); document.getElementById('fbCls').classList.remove('show'); showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]); }
function resetClass(){ sfx('click'); buildClass(); document.getElementById('fbCls').classList.remove('show'); }

// ===================== IDENTIFICAR =====================
const idData=[
  {s:['Un','múltiplo','se','obtiene','al','multiplicar','un','número','por','otro.'],c:1,art:'Resultado de multiplicar un número por 1, 2, 3...'},
  {s:['Un','divisor','divide','a','otro','número','de','forma','exacta.'],c:1,art:'Número que divide a otro con residuo cero'},
  {s:['La','división','es','exacta','cuando','el','residuo','es','cero.'],c:6,art:'Lo que sobra en una división'},
  {s:['Para','el','nueve','se','suman','todas','las','cifras.'],c:2,art:'Divisor cuya regla usa la suma de todas las cifras'},
  {s:['Para','el','once','se','usa','la','suma','alternada.'],c:2,art:'Divisor cuya regla usa la suma alternada'},
  {s:['El','m.c.m.','es','el','múltiplo','común','más','pequeño.'],c:1,art:'Sirve para saber cuándo coinciden dos eventos'},
  {s:['El','M.C.D.','es','el','divisor','común','más','grande.'],c:1,art:'Sirve para repartir en partes iguales lo más grandes posible'},
  {s:['Un','número','primo','solo','tiene','dos','divisores.'],c:2,art:'Número con exactamente dos divisores: 1 y él mismo'}
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
  {s:'Un número es divisible entre otro cuando el residuo de la división es ___.',opts:['cero','uno','par'],c:0},
  {s:'Un número es divisible entre 2 si su última cifra es ___.',opts:['par','impar','cinco'],c:0},
  {s:'Para saber si un número es divisible entre 9, se ___ todas sus cifras.',opts:['restan','suman','multiplican'],c:1},
  {s:'La regla del 11 usa la suma ___ de las cifras.',opts:['alternada','total','doble'],c:0},
  {s:'El m.c.m. es el múltiplo común más ___.',opts:['grande','pequeño','famoso'],c:1},
  {s:'El M.C.D. es el divisor común más ___.',opts:['pequeño','raro','grande'],c:2},
  {s:'Para repartir en partes iguales lo más grandes posible se usa el ___.',opts:['M.C.D.','m.c.m.','residuo'],c:0},
  {s:'Para saber cuándo dos eventos coinciden se usa el ___.',opts:['M.C.D.','m.c.m.','divisor'],c:1}
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
    q: 'Sin hacer la división: ¿432 es divisible entre 9?',
    opts: ['Sí, porque 4+3+2 = 9', 'No, porque termina en 2', 'Imposible saberlo sin dividir'],
    correct: 0,
    feedback: '¡Correcto! La suma de sus cifras es 9, así que es divisible entre 9. Comprobación: 432 ÷ 9 = 48.',
    wrongFeedback: 'La respuesta es: Sí, porque 4+3+2 = 9. ¡Las reglas de divisibilidad permiten saberlo sin dividir! Lo aprenderás en la sección Aprende.'
  },
  {
    q: 'La rana salta de 4 en 4 y el conejo de 6 en 6. ¿En qué número caen juntos por primera vez?',
    opts: ['En el 24', 'En el 12', 'En el 2'],
    correct: 1,
    feedback: '¡Excelente! Múltiplos de 4: 4,8,12... · de 6: 6,12... Coinciden por primera vez en 12: ese es el m.c.m.',
    wrongFeedback: 'La respuesta es: en el 12. Múltiplos de 4: 4,8,12 · de 6: 6,12. El primer número común es 12 (el m.c.m.), no el producto 24.'
  },
  {
    q: 'Quieres armar bolsas iguales con 12 dulces y 18 galletas sin que sobre nada. ¿Cuál es el mayor número de bolsas?',
    opts: ['6 bolsas', '36 bolsas', '2 bolsas'],
    correct: 0,
    feedback: '¡Muy bien! El M.C.D.(12,18) = 6: puedes armar 6 bolsas con 2 dulces y 3 galletas cada una.',
    wrongFeedback: 'La respuesta es: 6 bolsas. El divisor común más grande de 12 y 18 es 6 (el M.C.D.). Cada bolsa llevará 2 dulces y 3 galletas.'
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

// ===================== RETO FINAL =====================
const retoPoolWords=[
  {w:'¿270 es divisible entre 9?',t:'si'}, {w:'¿132 es divisible entre 11?',t:'si'}, {w:'¿615 es divisible entre 5?',t:'si'},
  {w:'¿234 es divisible entre 9?',t:'si'}, {w:'¿484 es divisible entre 11?',t:'si'}, {w:'¿111 es divisible entre 3?',t:'si'}, {w:'¿1,000 es divisible entre 10?',t:'si'},
  {w:'¿214 es divisible entre 9?',t:'no'}, {w:'¿56 es divisible entre 11?',t:'no'}, {w:'¿123 es divisible entre 2?',t:'no'},
  {w:'¿519 es divisible entre 11?',t:'no'}, {w:'¿85 es divisible entre 10?',t:'no'}, {w:'¿2,046 es divisible entre 9?',t:'no'}, {w:'¿100 es divisible entre 3?',t:'no'}
];
let retoPool=[], retoOk=0, retoErr=0, retoTimerInt=null, retoSec=30, retoRunning=false, retoCurrent=null;
function startReto(){
    if(retoRunning)return; sfx('click'); retoRunning=true; retoOk=0; retoErr=0; retoSec=30;
    retoPool=_shuffle([...retoPoolWords,...retoPoolWords]); showRetoWord();
    const _fill=document.getElementById('retoBarFill'); if(_fill){_fill.style.width='100%';_fill.style.background='var(--jade)';}
  retoTimerInt=setInterval(()=>{ retoSec--; sfx('tick'); document.getElementById('retoTimer').textContent='⏱ '+retoSec; if(retoSec<=10) document.getElementById('retoTimer').style.color='var(--red)'; const fill=document.getElementById('retoBarFill'); if(fill){fill.style.width=(retoSec/30*100)+'%';if(retoSec<=10)fill.style.background='var(--red)';} if(retoSec<=0){ clearInterval(retoTimerInt); endReto(); } },1000);
}
function showRetoWord(){ if(retoPool.length===0) retoPool=_shuffle([...retoPoolWords,...retoPoolWords]); retoCurrent=retoPool.pop(); document.getElementById('retoWord').textContent=retoCurrent.w; }
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
        const labels={si:'SÍ es divisible',no:'NO es divisible'};
        _fb.textContent=`${retoCurrent.w} → ${labels[retoCurrent.t]}`;
        _fb.className='fb show err';
        setTimeout(()=>_fb.classList.remove('show'),2000);
      }
    }
    document.getElementById('retoScore').textContent=`✔ ${retoOk} correctas | ✗ ${retoErr} errores`; showRetoWord();
}
function endReto(){ retoRunning=false; document.getElementById('retoWord').textContent='🏁 ¡Tiempo!'; document.getElementById('retoTimer').style.color='var(--pri)'; xpTracker.reto.add(1); const total=retoOk+retoErr; const pct=total>0?Math.round((retoOk/total)*100):0; fb('fbReto',`Resultado: ${retoOk}/${total} (${pct}%) ¡Bien hecho!`,true); fin('s-reto'); sfx('fan'); unlockAchievement('reto_hero'); }
function resetReto(){ sfx('click'); clearInterval(retoTimerInt); retoRunning=false; retoSec=30; retoOk=0; retoErr=0; document.getElementById('retoTimer').textContent='⏱ 30'; document.getElementById('retoTimer').style.color='var(--pri)'; document.getElementById('retoWord').textContent='¡Prepárate!'; document.getElementById('retoScore').textContent='✔ 0 correctas | ✗ 0 errores'; document.getElementById('fbReto').classList.remove('show'); }

// ===================== GENERADOR DE TAREAS =====================
const identifyTaskDB=[
  {s:'Un número es divisible entre 2 si termina en cifra par.',type:'Regla del 2'},
  {s:'Un número es divisible entre 9 si la suma de sus cifras es múltiplo de 9.',type:'Regla del 9'},
  {s:'Para el 11 se restan las sumas alternadas de las cifras.',type:'Regla del 11'},
  {s:'El múltiplo común más pequeño de dos números.',type:'Concepto: m.c.m.'},
  {s:'El divisor común más grande de dos números.',type:'Concepto: M.C.D.'},
  {s:'Número que solo tiene dos divisores: 1 y él mismo.',type:'Concepto: Número primo'}
];
const classifyTaskDB=[
  {w:'4,518',suma:'4+5+1+8 = 18',d9:'Sí',d11:'No'},
  {w:'121',suma:'1+2+1 = 4',d9:'No',d11:'Sí'},
  {w:'990',suma:'9+9+0 = 18',d9:'Sí',d11:'Sí'},
  {w:'517',suma:'5+1+7 = 13',d9:'No',d11:'Sí'},
  {w:'1,234',suma:'1+2+3+4 = 10',d9:'No',d11:'No'}
];
const completeTaskDB=[
  {s:'Un número es divisible entre 5 si termina en ___.',opts:['0 o 5','2 o 4','1 o 9'],ans:'0 o 5'},
  {s:'La regla del 9 consiste en ___ todas las cifras.',opts:['sumar','restar','ordenar'],ans:'sumar'},
  {s:'El m.c.m. de 4 y 6 es ___.',opts:['12','24','2'],ans:'12'},
  {s:'El M.C.D. de 12 y 18 es ___.',opts:['6','36','3'],ans:'6'},
  {s:'Cuando el único divisor común es 1, los números son primos ___.',opts:['entre sí','absolutos','gemelos'],ans:'entre sí'}
];
const explainQuestions=[
  {q:'Explica cómo compruebas que 2,835 es divisible entre 9 sin dividir.',ans:'Sumo sus cifras: 2+8+3+5 = 18. Como 18 es múltiplo de 9, el número es divisible entre 9.'},
  {q:'Explica la diferencia entre m.c.m. y M.C.D.',ans:'El m.c.m. es el múltiplo común más pequeño (sirve para saber cuándo coinciden dos eventos); el M.C.D. es el divisor común más grande (sirve para repartir en partes iguales lo más grandes posible).'},
  {q:'Explica paso a paso cómo encuentras el M.C.D. de 8 y 20.',ans:'Escribo los divisores de 8: 1,2,4,8 y los de 20: 1,2,4,5,10,20. Los comunes son 1, 2 y 4. El mayor es 4, así que M.C.D.(8,20)=4.'}
];
const pensamientoTaskDB=[
  {q:'Encuentra el error: "423 no es divisible entre 3 porque no termina en 3".',ans:'El error es usar la última cifra: esa regla es del 2, 5 y 10. Para el 3 se suman las cifras: 4+2+3 = 9, múltiplo de 3, así que SÍ es divisible.',type:'🔎 Detectar error'},
  {q:'Explica por qué todo número divisible entre 9 también es divisible entre 3.',ans:'Si la suma de las cifras es múltiplo de 9 (9, 18, 27...), también es múltiplo de 3, porque 9 = 3 × 3. Lo contrario no siempre se cumple: 6 es múltiplo de 3 pero no de 9.',type:'💬 Justificar'},
  {q:'Inventa un problema de la vida real que se resuelva con el m.c.m.',ans:'Respuesta variable. Ej: "Un doctor da una pastilla cada 6 horas y otra cada 8. ¿Cada cuántas horas se toman juntas?" R: m.c.m.(6,8) = 24 horas.',type:'✏️ Crear problema'},
  {q:'Calcula el m.c.m. y el M.C.D. de 12 y 18, y explica cada paso.',ans:'Múltiplos de 12: 12,24,36... · de 18: 18,36... → m.c.m. = 36. Divisores de 12: 1,2,3,4,6,12 · de 18: 1,2,3,6,9,18 → comunes 1,2,3,6 → M.C.D. = 6.',type:'🧮 Resolver y explicar'},
  {q:'Sin dividir, decide cuáles de estos números son divisibles entre 11: 121 / 209 / 123. Justifica.',ans:'121: (1+1)−2 = 0 → sí. 209: (9+2)−0 = 11 → sí. 123: (3+1)−2 = 2 → no.',type:'🧠 Razonar sin calcular'},
  {q:'¿Qué pasaría si usas el m.c.m. en vez del M.C.D. para repartir 12 dulces y 18 galletas en bolsas iguales?',ans:'El m.c.m.(12,18) = 36 no sirve para repartir: no puedes armar 36 bolsas con solo 12 dulces. Para repartir se necesita un DIVISOR común: M.C.D. = 6 bolsas.',type:'⚠️ Analizar error'}
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
function genTask(){ sfx('click'); const type=document.getElementById('tgType').value; const count=parseInt(document.getElementById('tgCount').value); ansVisible=false; const out=document.getElementById('tgOut'); out.innerHTML=''; if(type==='identify') genIdentifyTask(out,count); else if(type==='classify') genClassifyTask(out,count); else if(type==='complete') genCompleteTask(out,count); else if(type==='explain') genExplainTask(out,count); else if(type==='pensamiento') genPensamientoTask(out,count); fin('s-tareas'); }
function _instrBlock(out,title,lines){ const ib=document.createElement('div'); ib.className='tg-instruction-block'; ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join(''); out.appendChild(ib); }
function genIdentifyTask(out,count){ _instrBlock(out,'Instrucción',['Copia en tu cuaderno; escribe a qué regla o concepto corresponde cada enunciado.','<strong>Ejemplo:</strong> "Termina en 0 o 5" → <span style="color:var(--jade);font-weight:700;">Regla del 5</span>']); _pick(identifyTaskDB,Math.min(count,identifyTaskDB.length)).forEach((item,i)=>{ const div=document.createElement('div'); div.className='tg-task'; div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✔ ${item.type}</div></div>`; out.appendChild(div); }); }
function genClassifyTask(out,count){ _instrBlock(out,'Instrucción',['Copia la tabla. Escribe la suma de las cifras y si el número es divisible entre 9 y entre 11.']); const items=_pick(classifyTaskDB,Math.min(count,classifyTaskDB.length)); const wrap=document.createElement('div'); wrap.style.overflowX='auto'; const th=(t,extra='')=>`<th style="padding:0.3rem 0.4rem;border:1px solid var(--border);font-size:0.72rem;text-align:center;${extra}">${t}</th>`; let html=`<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:480px;"><thead><tr style="background:var(--pri-gl);">${th('Número','text-align:left;')}${th('Suma de cifras')}${th('¿Divisible entre 9?')}${th('¿Divisible entre 11?')}</tr></thead><tbody>`; items.forEach(it=>{ html+=`<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td>`+Array(3).fill(`<td style="padding:0.4rem;border:1px solid var(--border);min-width:50px;"></td>`).join('')+'</tr>'; }); html+='</tbody></table>'; wrap.innerHTML=html; out.appendChild(wrap); const ans=document.createElement('div'); ans.className='tg-answer'; ans.style.marginTop='0.8rem'; ans.innerHTML='<strong>✔ Respuestas:</strong><br>'+items.map(it=>`<strong>${it.w}:</strong> Suma: ${it.suma} | Entre 9: ${it.d9} | Entre 11: ${it.d11}`).join('<br>'); out.appendChild(ans); }
function genCompleteTask(out,count){ _instrBlock(out,'Instrucción',['Copia y resuelve en tu cuaderno. Elige la opción correcta para el espacio ___.']); const pool=_shuffle([...completeTaskDB]); for(let i=0;i<count;i++){ const item=pool[i%pool.length]; const div=document.createElement('div'); div.className='tg-task'; const sent=item.s.replace('___','<span class="tg-blank" style="min-width:90px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>'); div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${sent}</strong><div style="margin-top:0.4rem;font-size:0.82rem;color:var(--gray);">💡 Opciones: <strong>${item.opts.join(' | ')}</strong></div><div class="tg-answer">✔ ${item.ans}</div></div>`; out.appendChild(div); } }
function genExplainTask(out,count){ _instrBlock(out,'Instrucción',['Copia las preguntas en tu cuaderno y responde de forma clara.']); const pool=_shuffle([...explainQuestions]); for(let i=0;i<count;i++){ const item=pool[i%pool.length]; const div=document.createElement('div'); div.className='tg-task'; div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.3rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✔ ${item.ans}</div></div>`; out.appendChild(div); } }
function toggleAns(){ ansVisible=!ansVisible; document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none'); sfx('click'); }

// ===================== SOPA DE LETRAS =====================
const sopaSets=[
  {
    size:10,
    grid:[
      ['M','U','L','T','I','P','L','O','B','R'],
      ['D','J','K','Q','W','X','Z','Y','G','E'],
      ['I','H','B','G','T','K','L','M','N','S'],
      ['V','C','D','F','N','U','E','V','E','I'],
      ['I','K','L','M','B','D','F','G','H','D'],
      ['S','T','Z','P','R','I','M','O','J','U'],
      ['O','B','C','D','F','G','H','J','K','O'],
      ['R','D','F','G','H','O','N','C','E','T'],
      ['Q','P','A','R','S','T','V','W','X','Y'],
      ['F','A','C','T','O','R','B','D','G','H']
    ],
    words:[
      {w:'MULTIPLO',cells:[[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7]]},
      {w:'DIVISOR', cells:[[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]]},
      {w:'RESIDUO', cells:[[0,9],[1,9],[2,9],[3,9],[4,9],[5,9],[6,9]]},
      {w:'NUEVE',   cells:[[3,4],[3,5],[3,6],[3,7],[3,8]]},
      {w:'PRIMO',   cells:[[5,3],[5,4],[5,5],[5,6],[5,7]]},
      {w:'ONCE',    cells:[[7,5],[7,6],[7,7],[7,8]]},
      {w:'PAR',     cells:[[8,1],[8,2],[8,3]]},
      {w:'FACTOR',  cells:[[9,0],[9,1],[9,2],[9,3],[9,4],[9,5]]}
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
let _sopaResizeTimer=null;
window.addEventListener('resize',()=>{ clearTimeout(_sopaResizeTimer); _sopaResizeTimer=setTimeout(()=>{if(document.getElementById('s-sopa').classList.contains('active'))buildSopa();},200); });

// ===================== EVALUACIÓN FINAL (CONCEPTUAL) =====================
const evalTFBank=[
  {q:'Un número es divisible entre otro cuando el residuo de la división es cero.',a:true},
  {q:'432 es divisible entre 9 porque 4+3+2 = 9.',a:true},
  {q:'Un número es divisible entre 3 si termina en 3, 6 o 9.',a:false},
  {q:'121 es divisible entre 11 porque su suma alternada da 0.',a:true},
  {q:'El m.c.m. de dos números siempre es su producto.',a:false},
  {q:'El M.C.D. de 12 y 18 es 6.',a:true},
  {q:'El m.c.m. se usa para repartir en partes iguales.',a:false},
  {q:'Todo número divisible entre 9 también es divisible entre 3.',a:true},
  {q:'El M.C.D. de 8 y 15 es 1 porque son primos entre sí.',a:true},
  {q:'Un número que termina en 0 es divisible entre 2, 5 y 10.',a:true}
];
const evalMCBank=[
  {q:'¿Cuál de estos números es divisible entre 9?',o:['a) 517','b) 2,835','c) 1,234','d) 88'],a:1},
  {q:'¿Cuál es el m.c.m. de 4 y 10?',o:['a) 40','b) 2','c) 20','d) 14'],a:2},
  {q:'¿Cuál es el M.C.D. de 24 y 36?',o:['a) 12','b) 72','c) 6','d) 4'],a:0},
  {q:'¿Qué regla se usa para saber si un número es divisible entre 11?',o:['a) Mirar la última cifra','b) Sumar todas las cifras','c) La suma alternada de las cifras','d) Contar las cifras'],a:2},
  {q:'Dos campanas suenan cada 6 y cada 9 minutos. ¿Cada cuánto suenan juntas?',o:['a) Cada 3 min','b) Cada 54 min','c) Cada 18 min','d) Cada 15 min'],a:2}
];
const evalCPBank=[
  {q:'Un número es divisible entre 10 si termina en ___.',a:'0 (cero)'},
  {q:'Para el 9 se comprueba que la ___ de las cifras sea múltiplo de 9.',a:'suma'},
  {q:'El múltiplo común más pequeño de dos números se llama ___.',a:'m.c.m.'},
  {q:'El divisor común más grande de dos números se llama ___.',a:'M.C.D.'},
  {q:'Un número con solo dos divisores (1 y él mismo) se llama ___.',a:'primo'}
];
const evalPRBank=[
  {term:'Divisibilidad',def:'División exacta, con residuo cero'},
  {term:'Regla del 9',def:'La suma de las cifras es múltiplo de 9'},
  {term:'Regla del 11',def:'La suma alternada da 0 o múltiplo de 11'},
  {term:'m.c.m.',def:'El múltiplo común más pequeño'},
  {term:'M.C.D.',def:'El divisor común más grande'}
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
  cpItems.forEach((item,i)=>{ const d=document.createElement('div'); d.className='eval-item eval-auto-item'; const qHtml=item.q.replace('___','<input class="eval-cp-input" type="text" data-ecp="'+i+'" autocomplete="off" style="min-width:110px;">'); d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbEcp${i}" aria-live="polite"></div>`; s1.appendChild(d); });
  out.appendChild(s1);
  const tfItems=_pick(evalTFBank,5);
  const s2=document.createElement('div'); s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  tfItems.forEach((item,i)=>{ const d=document.createElement('div'); d.className='eval-item eval-auto-item'; d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="V"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="F"> Falso</label></div><div style="margin-top:0.4rem;margin-left:1.7rem;font-size:0.82rem;color:var(--gray);">Justifica por qué: <span style="display:inline-block;min-width:180px;border-bottom:1px solid var(--border);">&nbsp;</span></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbEtf${i}" aria-live="polite"></div>`; s2.appendChild(d); });
  out.appendChild(s2);
  const mcItems=_pick(evalMCBank,5);
  const s3=document.createElement('div'); s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  mcItems.forEach((item,i)=>{ const d=document.createElement('div'); d.className='eval-item eval-auto-item'; const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join(''); d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbEmc${i}" aria-live="polite"></div>`; s3.appendChild(d); });
  out.appendChild(s3);
  const prItems=_pick(evalPRBank,5); const shuffledDefs=[...prItems].sort(()=>Math.random()-0.5); const letters=['A','B','C','D','E'];
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación Teoría de Números · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:12pt;color:#111;background:#fff;padding:4mm 6mm;}.ph{margin-bottom:0.5rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;color:#1565c0;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:#1565c0;margin-top:0.15rem;font-weight:700;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.5rem 0 0.25rem;border-left:4px solid #1565c0;background:#e3f2fd;display:flex;justify-content:space-between;align-items:center;color:#1565c0;}.qn{font-weight:700;min-width:22px;flex-shrink:0;color:#1565c0;}.tf-row{display:flex;align-items:flex-start;gap:0.3rem;font-size:10.5pt;line-height:1.4;padding:0.25rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:42px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.2rem;margin-top:0.2rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.28rem 0.45rem;margin-bottom:0.22rem;break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.4;display:flex;gap:0.3rem;margin-bottom:0.18rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.22rem 0.55rem;}.mc-opts{display:grid;grid-template-columns:repeat(3,1fr);gap:0.08rem 0.25rem;margin-left:1.3rem;}.mc-opt{font-size:9.5pt;display:flex;align-items:center;gap:0.22rem;}.mc-opt input{width:12px;height:12px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.4;padding:0.22rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:130px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{break-inside:avoid;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.2rem 0.5rem;margin-top:0.15rem;}.pr-head{font-size:9pt;font-weight:700;color:#1565c0;margin-bottom:0.2rem;}.pr-item{font-size:10pt;padding:0.22rem 0.32rem;background:#e3f2fd;border-radius:3px;margin-bottom:0.12rem;display:flex;align-items:center;gap:0.22rem;line-height:1.2;}.pr-num{font-weight:700;color:#1565c0;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #1565c0;padding-bottom:0.35rem;margin-bottom:0.5rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;color:#1565c0;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #cce0ff;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;color:#1565c0;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#1565c0;}.pa{color:#007a00;font-weight:600;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:#1565c0;font-weight:700;font-style:italic;}.obt-lbl{font-weight:700;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #1565c0;height:12px;}.obt-pct{font-weight:700;}.total-row{display:flex;align-items:baseline;justify-content:flex-end;gap:7px;font-size:11pt;color:#1565c0;font-weight:700;font-style:italic;margin-top:0.4rem;padding:0.2rem 0.5rem;background:#e3f2fd;border-radius:4px;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #1565c0;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div class="ph"><h2>Evaluación Final · Misión Teoría de Números · Matemática</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 4 secciones × 5 preguntas × 5 pts c/u · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div><div class="pauta-wrap"><div class="p-head"><div class="p-main">✔ PAUTA DOCENTE — Evaluación Final · Teoría de Números · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">100 pts | 4 secciones × 5 preguntas × 5 pts | Matemáticas II Ciclo</div></div><div class="p-grid">${pR}</div>
  ${zgBlock}</div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(doc); win.document.close(); setTimeout(()=>win.print(),400);
}

// ===================== EXPLICA CON TUS PALABRAS =====================
const explicaData = [
  {
    q: 'Explica cómo sabes, sin dividir, que 6,975 es divisible entre 9.',
    hint: '💡 Pista: usa la regla de la suma de las cifras (y vuelve a sumar si hace falta).',
    rubric: ['✓ Suma las cifras: 6+9+7+5 = 27', '✓ Reconoce que 27 es múltiplo de 9 (o vuelve a sumar: 2+7 = 9)', '✓ Concluye que el número sí es divisible entre 9'],
    suggested: 'Sumo las cifras: 6+9+7+5 = 27. Como 27 es múltiplo de 9 (o sumando otra vez: 2+7 = 9), el número 6,975 es divisible entre 9 sin necesidad de dividir.'
  },
  {
    q: 'Explica con tus palabras la regla del 11 y aplícala al número 8,294.',
    hint: '💡 Pista: suma las cifras alternadas desde la derecha y resta los dos grupos.',
    rubric: ['✓ Describe la suma alternada (posiciones impares y pares desde la derecha)', '✓ Calcula: (4+2) − (9+8) = 6 − 17 = −11', '✓ Concluye que −11 es múltiplo de 11, así que 8,294 sí es divisible'],
    suggested: 'Tomo las cifras desde la derecha y las separo en dos grupos alternados: 4 y 2 en uno (suman 6), 9 y 8 en otro (suman 17). Resto: 6 − 17 = −11, que es múltiplo de 11. Por eso 8,294 es divisible entre 11.'
  },
  {
    q: '¿Cómo decides si un problema se resuelve con m.c.m. o con M.C.D.? Da un ejemplo de cada uno.',
    hint: '💡 Pista: piensa en "coincidir" versus "repartir".',
    rubric: ['✓ Asocia el m.c.m. con eventos que se repiten y COINCIDEN', '✓ Asocia el M.C.D. con REPARTIR o dividir en partes iguales', '✓ Da un ejemplo válido de cada uno'],
    suggested: 'Si el problema habla de cosas que se repiten y pregunta cuándo coinciden (buses, semáforos, campanas), uso el m.c.m. Si habla de repartir o cortar en partes iguales lo más grandes posible, uso el M.C.D. Ejemplos: "¿cada cuánto salen juntos dos buses?" → m.c.m.; "¿cuántas bolsas iguales armo con 12 dulces y 18 galletas?" → M.C.D.'
  },
  {
    q: 'Inventa un problema de la vida real que se resuelva con el M.C.D. y resuélvelo.',
    hint: '💡 Pista: piensa en repartir, cortar listones o armar paquetes iguales.',
    rubric: ['✓ El contexto es de la vida real y pide repartir en partes iguales', '✓ Usa dos cantidades adecuadas', '✓ Encuentra correctamente el M.C.D. y responde la pregunta'],
    suggested: '"Tengo dos listones de 24 cm y 36 cm y quiero cortarlos en pedazos iguales lo más largos posible, sin desperdiciar." M.C.D.(24,36) = 12, así que corto pedazos de 12 cm: 2 del primer listón y 3 del segundo.'
  },
  {
    q: '¿Por qué el m.c.m. de 4 y 6 es 12 y no 24? Explica el error de multiplicar siempre.',
    hint: '💡 Pista: escribe los múltiplos de cada número y busca el primero común.',
    rubric: ['✓ Lista los múltiplos: 4, 8, 12... y 6, 12...', '✓ Identifica que 12 es el PRIMER múltiplo común', '✓ Explica que el producto (24) solo es el m.c.m. cuando los números no comparten divisores'],
    suggested: 'Los múltiplos de 4 son 4, 8, 12... y los de 6 son 6, 12... El primero que comparten es 12, no 24. Multiplicar siempre da un múltiplo común, pero no siempre el mínimo: como 4 y 6 comparten el divisor 2, coinciden antes.'
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

// ===================== PRUEBA OPERATIVA — TEORÍA DE NÚMEROS =====================

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
function _digitSum(n) { return n.toString().split('').reduce((a, d) => a + parseInt(d, 10), 0); }

// I. ¿Es divisible? Sí o No (5 × 10 = 50 pts)
function genDivisibleItems() {
  const divisors = _shuffle([2, 3, 5, 9, 10, 11]).slice(0, 5);
  return divisors.map(dv => {
    let num;
    if (Math.random() < 0.5) { num = dv * _opRint(Math.ceil(100 / dv), Math.floor(9999 / dv)); }
    else { do { num = _opRint(100, 9999); } while (num % dv === 0); }
    return { num: _fmtNum(num), dv, ans: num % dv === 0 };
  });
}

// II. Suma de las cifras (10 × 1 = 10 pts)
function genSumaCifrasItems() {
  const items = [];
  for (let i = 0; i < 10; i++) {
    const num = _opRint(100, 99999);
    items.push({ num: _fmtNum(num), ansNum: _digitSum(num) });
  }
  return items;
}

// III. Encuentra el m.c.m. (10 × 1 = 10 pts)
function genMcmItems() {
  const items = [];
  while (items.length < 10) {
    const a = _opRint(2, 12), b = _opRint(2, 12);
    if (a === b) continue;
    items.push({ a, b, ansNum: _lcm(a, b) });
  }
  return items;
}

// IV. Encuentra el M.C.D. (10 × 1 = 10 pts)
function genMcdItems() {
  const items = [];
  while (items.length < 10) {
    const k = _opRint(2, 6);
    const a = k * _opRint(2, 8), b = k * _opRint(2, 8);
    if (a === b || a > 60 || b > 60) continue;
    items.push({ a, b, ansNum: _gcd(a, b) });
  }
  return items;
}

// V. Ordena los múltiplos de MENOR a MAYOR (4 grupos × 5 pts = 20 pts)
function genOrdenaItems() {
  const groups = [];
  for (let g = 0; g < 4; g++) {
    const base = _opRint(3, 9);
    const mults = new Set(); let tries = 0;
    while (mults.size < 4 && tries < 200) { tries++; mults.add(base * _opRint(2, 15)); }
    const nums = [...mults].map(v => ({ v, label: _fmtNum(v) }));
    const correctOrder = [...nums].sort((x, y) => x.v - y.v).map(n => n.label);
    const display = _shuffle([...nums]).map(n => n.label);
    groups.push({ base, display, correctOrder });
  }
  return groups;
}

function genEvalOp() {
  sfx('click');
  const cf = evalOpFormNum; window._currentEvalOpForm = cf; evalOpFormNum = (evalOpFormNum % 10) + 1; saveProgress();
  document.getElementById('evalop-screen-title').textContent = `📐 Prueba Operativa — Forma ${cf} · Teoría de Números`;
  evalOpAnsVisible = false;
  const out = document.getElementById('evalOpOut'); out.innerHTML = '';

  const dvItems = genDivisibleItems();
  const s1 = document.createElement('div');
  s1.innerHTML = '<div class="eval-section-title">I. ¿Es divisible? <span class="eval-pts">50 pts · 10 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Aplica la regla de divisibilidad correspondiente y marca Sí o No.</p>';
  dvItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text opx-expr">¿${it.num} es divisible entre ${it.dv}?</span></div><div class="eval-cmp-opts"><label class="eval-cmp-opt"><input type="radio" name="dv${i}" value="si"> Sí es divisible</label><label class="eval-cmp-opt"><input type="radio" name="dv${i}" value="no"> No es divisible</label></div><div class="eval-answer">${it.ans?'Sí':'No'}</div><div class="eval-item-feedback" id="evalFbDv${i}" aria-live="polite"></div>`;
    s1.appendChild(d);
  });
  out.appendChild(s1);

  const scItems = genSumaCifrasItems();
  const s2 = document.createElement('div');
  s2.innerHTML = '<div class="eval-section-title">II. Suma de las cifras <span class="eval-pts">10 pts · 1 pt c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Escribe la suma de todas las cifras del número (el primer paso de las reglas del 3 y del 9).</p>';
  scItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">Suma de cifras de ${it.num} =</span><input class="eval-cp-input" type="text" data-sc="${i}" autocomplete="off" inputmode="numeric" style="width:100px;"></div><div class="eval-answer">${it.ansNum}</div><div class="eval-item-feedback" id="evalFbSc${i}" aria-live="polite"></div>`;
    s2.appendChild(d);
  });
  out.appendChild(s2);

  const lcmItems = genMcmItems();
  const s3 = document.createElement('div');
  s3.innerHTML = '<div class="eval-section-title">III. Encuentra el m.c.m. <span class="eval-pts">10 pts · 1 pt c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Escribe el Mínimo Común Múltiplo de cada pareja.</p>';
  lcmItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">m.c.m.(${it.a}, ${it.b}) =</span><input class="eval-cp-input" type="text" data-lcm="${i}" autocomplete="off" inputmode="numeric" style="width:100px;"></div><div class="eval-answer">${it.ansNum}</div><div class="eval-item-feedback" id="evalFbLcm${i}" aria-live="polite"></div>`;
    s3.appendChild(d);
  });
  out.appendChild(s3);

  const gcdItems = genMcdItems();
  const s4 = document.createElement('div');
  s4.innerHTML = '<div class="eval-section-title">IV. Encuentra el M.C.D. <span class="eval-pts">10 pts · 1 pt c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Escribe el Máximo Común Divisor de cada pareja.</p>';
  gcdItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">M.C.D.(${it.a}, ${it.b}) =</span><input class="eval-cp-input" type="text" data-gcd="${i}" autocomplete="off" inputmode="numeric" style="width:100px;"></div><div class="eval-answer">${it.ansNum}</div><div class="eval-item-feedback" id="evalFbGcd${i}" aria-live="polite"></div>`;
    s4.appendChild(d);
  });
  out.appendChild(s4);

  const ordGroups = genOrdenaItems();
  const s5 = document.createElement('div');
  s5.innerHTML = '<div class="eval-section-title">V. Ordena los múltiplos de MENOR a MAYOR <span class="eval-pts">20 pts · 5 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Usa las flechas para ordenar cada grupo de múltiplos de menor a mayor.</p>';
  ordGroups.forEach((g, gi) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item evord-group';
    d.innerHTML = `<div class="evord-dir">${gi+1}. Múltiplos de ${g.base} — ordena de MENOR a mayor:</div><div class="evord-list" id="evordNumList${gi}"></div><div class="eval-answer">${g.correctOrder.join(' · ')}</div><div class="eval-item-feedback" id="evalFbOrdNum${gi}" aria-live="polite"></div>`;
    s5.appendChild(d);
  });
  out.appendChild(s5);

  window._evalOpData = { dvItems, scItems, lcmItems, gcdItems, ord: ordGroups.map(g => ({ base: g.base, current: [...g.display], correctOrder: g.correctOrder })) };
  ordGroups.forEach((_, gi) => _renderOrdNumGroup(gi));
  const autoPanel = document.createElement('div'); autoPanel.id = 'evalOpAutoResult'; autoPanel.className = 'eval-auto-result';
  autoPanel.innerHTML = '<strong>🧮 Prueba interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato para resolver en papel.';
  out.appendChild(autoPanel);
  fin('s-evaluacion');
}

function _renderOrdNumGroup(gi) {
  const data = window._evalOpData.ord[gi];
  const list = document.getElementById('evordNumList' + gi); if (!list) return;
  list.innerHTML = '';
  data.current.forEach((label, i) => {
    const div = document.createElement('div'); div.className = 'evord-item';
    div.innerHTML = `<div class="evord-arrows"><button class="sort-arrow" onclick="evordNumMove(${gi},${i},-1)"${i===0?' disabled':''}>▲</button><button class="sort-arrow" onclick="evordNumMove(${gi},${i},1)"${i===data.current.length-1?' disabled':''}>▼</button></div><div class="evord-num">${label}</div>`;
    list.appendChild(div);
  });
}
function evordNumMove(gi, idx, dir) {
  sfx('click');
  const data = window._evalOpData.ord[gi]; const ni = idx + dir;
  if (ni < 0 || ni >= data.current.length) return;
  [data.current[idx], data.current[ni]] = [data.current[ni], data.current[idx]];
  _renderOrdNumGroup(gi);
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
  let total = 0; const det = { dv: 0, sc: 0, lcm: 0, gcd: 0, ord: 0 };
  d.dvItems.forEach((it, i) => { const sel = document.querySelector(`input[name="dv${i}"]:checked`); const ok = !!sel && ((sel.value === 'si') === it.ans); if (ok) { det.dv++; total += 10; } setEvalFeedback('evalFbDv' + i, ok, ok ? 'Correcto. +10 pts' : 'Revisar. R/ ' + (it.ans ? 'Sí es divisible' : 'No es divisible')); });
  d.scItems.forEach((it, i) => { const el = document.querySelector(`[data-sc="${i}"]`); const ok = _isIntMatch(el ? el.value : '', it.ansNum); if (el) { el.classList.toggle('eval-input-ok', ok); el.classList.toggle('eval-input-no', !ok); } if (ok) { det.sc++; total += 1; } setEvalFeedback('evalFbSc' + i, ok, ok ? 'Correcto. +1 pt' : 'Revisar. R/ ' + it.ansNum); });
  d.lcmItems.forEach((it, i) => { const el = document.querySelector(`[data-lcm="${i}"]`); const ok = _isIntMatch(el ? el.value : '', it.ansNum); if (el) { el.classList.toggle('eval-input-ok', ok); el.classList.toggle('eval-input-no', !ok); } if (ok) { det.lcm++; total += 1; } setEvalFeedback('evalFbLcm' + i, ok, ok ? 'Correcto. +1 pt' : 'Revisar. R/ ' + it.ansNum); });
  d.gcdItems.forEach((it, i) => { const el = document.querySelector(`[data-gcd="${i}"]`); const ok = _isIntMatch(el ? el.value : '', it.ansNum); if (el) { el.classList.toggle('eval-input-ok', ok); el.classList.toggle('eval-input-no', !ok); } if (ok) { det.gcd++; total += 1; } setEvalFeedback('evalFbGcd' + i, ok, ok ? 'Correcto. +1 pt' : 'Revisar. R/ ' + it.ansNum); });
  d.ord.forEach((g, gi) => { const ok = g.current.every((v, i) => v === g.correctOrder[i]); if (ok) { det.ord++; total += 5; } setEvalFeedback('evalFbOrdNum' + gi, ok, ok ? '¡Orden correcto! +5 pts' : 'Orden incorrecto. Clave: ' + g.correctOrder.join(' · ')); });
  const res = document.getElementById('evalOpAutoResult');
  if (res) { res.className = 'eval-auto-result ' + (total >= 70 ? 'eval-auto-pass' : 'eval-auto-risk'); res.innerHTML = `<strong>Resultado: ${total}/100 pts</strong><br><span>Divisibilidad: ${det.dv*10}/50 · Suma de cifras: ${det.sc}/10 · m.c.m.: ${det.lcm}/10 · M.C.D.: ${det.gcd}/10 · Ordena: ${det.ord*5}/20</span>`; }
  if (total >= 70) { pts(8); showToast('🎯 Prueba operativa calificada: ' + total + '/100'); }
  else showToast('🧮 Prueba operativa: ' + total + '/100. Revisa los ítems marcados.');
}

function printEvalOp() {
  if (!window._evalOpData) { showToast('⚠️ Genera una prueba operativa primero'); return; }
  sfx('click');
  const forma = window._currentEvalOpForm || 1; const d = window._evalOpData;
  let s1 = `<div class="sec-title"><span>I. ¿Es divisible?</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 50 pts</span></div></div><p class="opx-instr">Aplica la regla de divisibilidad y marca Sí o No. Valor 10 pts c/u.</p>`;
  d.dvItems.forEach((it, i) => { s1 += `<div class="cmp-print-row"><span class="cmp-print-num">${i+1}. ¿${it.num} es divisible entre ${it.dv}?</span><div class="cmp-opts-print"><span>Sí ☐</span><span>No ☐</span></div></div>`; });
  const scH = Math.ceil(d.scItems.length / 2);
  const scTbl = (items, off) => `<table class="rnd-tbl"><tr><th>#</th><th>Número</th><th>Suma de cifras</th></tr>${items.map((it, i) => `<tr><td>${off+i+1}</td><td>${it.num}</td><td></td></tr>`).join('')}</table>`;
  let s2 = `<div class="sec-title"><span>II. Suma de las cifras</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10 pts</span></div></div><p class="opx-instr">Escribe la suma de todas las cifras. 1 pt c/u.</p><div class="rnd-print-grid">${scTbl(d.scItems.slice(0,scH),0)}${scTbl(d.scItems.slice(scH),scH)}</div>`;
  const lcmH = Math.ceil(d.lcmItems.length / 2);
  const lcmTbl = (items, off) => `<table class="rnd-tbl"><tr><th>#</th><th>Pareja</th><th>m.c.m.</th></tr>${items.map((it,i)=>`<tr><td>${off+i+1}</td><td>m.c.m.(${it.a}, ${it.b}) =</td><td></td></tr>`).join('')}</table>`;
  let s3 = `<div class="sec-title"><span>III. Encuentra el m.c.m.</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10 pts</span></div></div><p class="opx-instr">Escribe el Mínimo Común Múltiplo. 1 pt c/u.</p><div class="rnd-print-grid">${lcmTbl(d.lcmItems.slice(0,lcmH),0)}${lcmTbl(d.lcmItems.slice(lcmH),lcmH)}</div>`;
  const gcdH = Math.ceil(d.gcdItems.length / 2);
  const gcdTbl = (items, off) => `<table class="rnd-tbl"><tr><th>#</th><th>Pareja</th><th>M.C.D.</th></tr>${items.map((it,i)=>`<tr><td>${off+i+1}</td><td>M.C.D.(${it.a}, ${it.b}) =</td><td></td></tr>`).join('')}</table>`;
  let s4 = `<div class="sec-title"><span>IV. Encuentra el M.C.D.</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10 pts</span></div></div><p class="opx-instr">Escribe el Máximo Común Divisor. 1 pt c/u.</p><div class="rnd-print-grid">${gcdTbl(d.gcdItems.slice(0,gcdH),0)}${gcdTbl(d.gcdItems.slice(gcdH),gcdH)}</div>`;
  let s5 = `<div class="sec-title"><span>V. Ordena los múltiplos de MENOR a MAYOR</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Escribe los números en orden de menor a mayor. 5 pts c/u.</p><div class="ord-print-grid">${d.ord.map((g,gi)=>`<div class="ord-print-box"><div class="ord-print-dir">${gi+1}. Múltiplos de ${g.base} — ordena de Menor a Mayor:</div><table class="ord-print-tbl"><tr>${g.current.map(v=>`<td>${v}</td>`).join('')}</tr></table><div style="margin-top:0.3rem;font-size:8.5pt;color:#555;">Escribe en orden: 1. _______ &nbsp; 2. _______ &nbsp; 3. _______ &nbsp; 4. _______</div></div>`).join('')}</div>`;
  let pR = '';
  pR += `<div class="p-sec"><div class="p-ttl">I. ¿Es divisible?</div><table class="p-tbl">${d.dvItems.map((it,i)=>`<tr><td class="pn">${i+1}.</td><td class="pa">${it.ans?'Sí':'No'}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">II. Suma de cifras</div><table class="p-tbl">${d.scItems.map((it,i)=>`<tr><td class="pn">${i+1}.</td><td class="pa">${it.ansNum}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">III. m.c.m.</div><table class="p-tbl">${d.lcmItems.map((it,i)=>`<tr><td class="pn">${i+1}.</td><td class="pa">${it.ansNum}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">IV. M.C.D.</div><table class="p-tbl">${d.gcdItems.map((it,i)=>`<tr><td class="pn">${i+1}.</td><td class="pa">${it.ansNum}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec" style="grid-column:1/-1;"><div class="p-ttl">V. Ordenar de Menor a Mayor</div>${d.ord.map((g,gi)=>`<div class="p-ord-line"><strong>${gi+1}.</strong> ${g.correctOrder.join(' · ')}</div>`).join('')}</div>`;
  const doc = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Prueba Operativa Teoría de Números · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11.5pt;color:#111;background:#fff;padding:4mm 6mm;}.ph{margin-bottom:0.5rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;color:#1565c0;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:#1565c0;margin-top:0.15rem;font-weight:700;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.5rem 0 0.22rem;border-left:4px solid #1565c0;background:#e3f2fd;display:flex;justify-content:space-between;align-items:center;color:#1565c0;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:#1565c0;font-weight:700;font-style:italic;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #1565c0;height:12px;}.qn{font-weight:700;min-width:20px;display:inline-block;color:#1565c0;}.opx-instr{font-size:9pt;color:#555;margin-bottom:0.25rem;}.rnd-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 1rem;margin-top:0.2rem;}.rnd-tbl{width:100%;border-collapse:collapse;font-size:9pt;}.rnd-tbl th,.rnd-tbl td{border:1px solid #bbb;padding:0.15rem 0.35rem;text-align:left;}.rnd-tbl th{background:#e3f2fd;color:#1565c0;font-size:8.5pt;}.cmp-print-row{display:flex;align-items:center;justify-content:space-between;font-size:10.5pt;padding:0.22rem 0.1rem;border-bottom:1px dotted #ddd;}.cmp-print-num{font-family:'Courier New',monospace;font-weight:600;flex:1;}.cmp-opts-print{display:flex;gap:0.6rem;font-size:9.5pt;white-space:nowrap;}.ord-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.8rem;margin-top:0.2rem;}.ord-print-box{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.4rem;break-inside:avoid;}.ord-print-dir{font-size:9pt;font-weight:700;color:#1565c0;margin-bottom:0.2rem;}.ord-print-tbl{width:100%;border-collapse:collapse;font-size:9.5pt;}.ord-print-tbl td{border:1px solid #bbb;padding:0.12rem 0.25rem;text-align:center;font-family:'Courier New',monospace;}.total-row{display:flex;align-items:baseline;justify-content:flex-end;gap:7px;font-size:11pt;color:#1565c0;font-weight:700;font-style:italic;margin-top:0.5rem;padding:0.2rem 0.5rem;background:#e3f2fd;border-radius:4px;}.total-row .obt-line{min-width:80px;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #1565c0;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:9.5pt;font-weight:700;color:#1565c0;}.p-sub{font-size:7pt;color:#c00;font-weight:700;margin:0.08rem 0;}.p-meta{font-size:7pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.9rem;}.p-sec{border:1px solid #cce0ff;border-radius:4px;padding:0.28rem 0.45rem;}.p-ttl{font-size:8pt;font-weight:700;color:#1565c0;border-bottom:1px solid #ddd;padding-bottom:0.1rem;margin-bottom:0.15rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:7.5pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.07rem 0.12rem;vertical-align:top;}.pn{font-weight:700;width:16px;color:#1565c0;}.pa{color:#007a00;font-weight:600;font-family:'Courier New',monospace;}.p-ord-line{font-size:8pt;margin-bottom:0.15rem;color:#007a00;}.forma-tag{position:fixed;bottom:5mm;right:6mm;font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;}@media print{@page{size:letter portrait;margin:8mm 10mm;}}</style></head><body><div class="ph"><h2>Examen de Matemáticas — Prueba Operativa · Teoría de Números · II Ciclo</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Institución:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 pts · I: 50 · II: 10 · III: 10 · IV: 10 · V: 20 · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div><div class="pauta-wrap"><div class="p-head"><div class="p-main">✔ PAUTA — Prueba Operativa · Teoría de Números · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">100 pts · Matemáticas II Ciclo</div></div><div class="p-grid">${pR}</div></div><div class="forma-tag">Forma ${forma}</div></body></html>`;
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
  const msgs=['💡 ¡ÁNIMO! Comienza tu misión. ¡Cada paso cuenta!','🌱 ¡GRAN INICIO! Estás dando los primeros pasos.','🧮 ¡BUEN TRABAJO! Vas progresando muy bien.','💪 ¡MUY BIEN! Dominas gran parte del contenido.','🏅 ¡INCREÍBLE avance! Estás cerca de la excelencia.','🎓 ¡EXTRAORDINARIO! Completaste TODA la misión. ¡Eres experto en Teoría de Números!'];
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
  const txt=`${stars} CONSTANCIA DE LOGRO ${stars}\n\n📚 Misión: Teoría de Números — Divisibilidad, m.c.m. y M.C.D.\n👤 Estudiante: ${name}\n📊 Progreso: ${pct}% completado\n⭐ XP obtenido: ${xp} de ${MXP}${achText?'\n\n🏆 Logros desbloqueados:\n'+achText:''}\n\n${msg}\n\n📅 ${date}\n🏠 Proyecto Educativo M.E.T.A.S\n🌐 policastsapien.com`;
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
  document.addEventListener('click',function(e){ const panel=document.getElementById('achPanel'); const btn=document.getElementById('achBtn'); if(panel.classList.contains('open')&&!panel.contains(e.target)&&e.target!==btn) panel.classList.remove('open'); });
  document.addEventListener('click',function(e){ if(e.target===document.getElementById('diplomaOverlay')) closeDiploma(); });
  const savedName=localStorage.getItem('nombreEstudianteTeoriaNumeros');
  const inputName=document.querySelector('.diploma-input');
  if(savedName&&inputName){ inputName.value=savedName; updateDiplomaName(savedName); }
  if(inputName) inputName.addEventListener('input',e=>localStorage.setItem('nombreEstudianteTeoriaNumeros',e.target.value));
  fin('s-aprende',false);
  fin('s-tipos',false);
  fin('s-errores',false);
});
