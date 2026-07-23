// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
// Compartir misión por WhatsApp
function compartirMision() {
    const url = window.location.href;
    const texto = `🚀 *Misión Asignada: División de Decimales* 🚀\n\nPractica el movimiento del punto decimal, el agregado de ceros y conviértete en un experto dividiendo. 🏆\n\nDesbloquea *todos los logros* y puedes poner *tus datos* para que tu maestro observe todos tus logros. 📋\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;
    _waShare(texto);
}

// ===================== ACCESIBILIDAD =====================
function toggleLetra() {
  document.body.classList.toggle('letra-grande');
  if(typeof sfx === 'function') sfx('click');
  localStorage.setItem('prefLetraDivDecimales', document.body.classList.contains('letra-grande'));
}
window.addEventListener('DOMContentLoaded', () => {
  if(localStorage.getItem('prefLetraDivDecimales') === 'true') document.body.classList.add('letra-grande');
});

// ===================== UTILIDADES =====================
const _pick = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
const _shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
function fb(id, msg, isOk) {
  const el = document.getElementById(id);
  if(el) { el.textContent = msg; el.className = 'fb show ' + (isOk ? 'ok' : 'err'); }
}

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY = 'matematica_div_decimales_v1';
let xp = 0, MXP = 200, done = new Set(), evalAnsVisible = false;
let evalFormNum = 1, evalOpFormNum = 1, evalOpAnsVisible = false, unlockedAch = [], darkMode = false, prevLevel = 0;
const TOTAL_SECTIONS = 16;
const xpTracker = { fc: new Set(), qz: new Set(), cls: new Set(), id: new Set(), cmp: new Set(), reto: new Set(), sopa: new Set(), equiv: new Set(), predice: new Set(), explica: new Set(), partes: new Set(), casita: new Set(), memo: new Set() };

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
  radar_pro:{icon:'🎯',label:'Radar de partes perfecto'},
  casita_pro:{icon:'🏗️',label:'Arquitecto de la casita'},
  nivel3:{icon:'🔭',label:'¡Explorador alcanzado! Nivel 3'},
  nivel5:{icon:'🔥',label:'¡Campeón alcanzado! Nivel 6'}
};
function unlockAchievement(id){ if(unlockedAch.includes(id)) return; unlockedAch.push(id); sfx('ach'); showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label); launchConfetti(); renderAchPanel(); saveProgress(); }
function renderAchPanel(){ const list=document.getElementById('achList'); list.innerHTML=''; Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{ const div=document.createElement('div'); div.className='ach-item'+(unlockedAch.includes(id)?'':' locked'); div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`; list.appendChild(div); }); }
function toggleAchPanel(){ sfx('click'); document.getElementById('achPanel').classList.toggle('open'); }
function showToast(msg){ let t=document.querySelector('.toast'); if(!t){ t=document.createElement('div'); t.className='toast'; document.body.appendChild(t); } t.textContent=msg; t.style.display='block'; clearTimeout(t._tid); t._tid=setTimeout(()=>t.style.display='none',3200); }
function launchConfetti(){ const colors=['#1976d2','#f57c00','#00b894','#fdcb6e','#6c5ce7']; for(let i=0;i<60;i++){ const c=document.createElement('div'); c.className='confetti-piece'; c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`; document.body.appendChild(c); c.addEventListener('animationend',()=>c.remove()); } }

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
  {w:'Divisor decimal',a:'Para dividir, se debe convertir en <strong>entero</strong> moviendo el punto a la derecha.'},
  {w:'Regla del movimiento',a:'Los espacios que muevas el punto en el divisor, <strong>debes moverlos</strong> en el dividendo.'},
  {w:'Agregar ceros',a:'Si en el dividendo ya no hay cifras para mover el punto, <strong>se agregan ceros</strong> a la derecha.'},
  {w:'Cero al cociente',a:'Se usa cuando bajas una cifra y el número formado es <strong>menor</strong> que el divisor.'},
  {w:'Divisor > 1',a:'Si divides entre un número mayor que 1, el cociente será <strong>menor</strong> que el dividendo. Ej: 10 ÷ 2 = 5.'},
  {w:'Divisor < 1',a:'Si divides entre un número menor que 1 (como 0.5), el cociente será <strong>mayor</strong>. Ej: 10 ÷ 0.5 = 20.'},
  {w:'Dividendo',a:'Es el número que <strong>se va a repartir</strong> (adentro de la casita de división).'},
  {w:'Divisor',a:'Es el número que indica <strong>en cuántas partes</strong> se reparte (afuera de la casita).'},
  {w:'Cociente',a:'Es el <strong>resultado</strong> final de la división.'},
  {w:'1.5 ÷ 0.3',a:'Se mueve un espacio en ambos: equivale a <strong>15 ÷ 3 = 5</strong>.'},
  {w:'0.25 ÷ 0.05',a:'Se mueven dos espacios en ambos: equivale a <strong>25 ÷ 5 = 5</strong>.'},
  {w:'2 ÷ 0.5',a:'Mueves un espacio el divisor (5) y agregas un cero al 2 (20). Equivale a <strong>20 ÷ 5 = 4</strong>.'}
];
let fcIdx=0;
function upFC(){ document.getElementById('fcInner').classList.remove('flipped'); document.getElementById('fcW').textContent=fcData[fcIdx].w; document.getElementById('fcA').innerHTML=fcData[fcIdx].a; document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length; }
function flipCard(){ sfx('flip'); document.getElementById('fcInner').classList.toggle('flipped'); if(!xpTracker.fc.has(fcIdx)){ xpTracker.fc.add(fcIdx); pts(1); } if(xpTracker.fc.size===fcData.length){ fin('s-flash'); unlockAchievement('flash_master'); } }
function nextFC(){ sfx('click'); fcIdx=(fcIdx+1)%fcData.length; upFC(); }
function prevFC(){ sfx('click'); fcIdx=(fcIdx-1+fcData.length)%fcData.length; upFC(); }

// ===================== QUIZ DATA =====================
const qzData=[
  {q:'¿Qué debes hacer primero si el divisor tiene decimales?',o:['a) Dividir normalmente','b) Convertirlo a número entero moviendo el punto','c) Agregar ceros al cociente','d) Borrar el punto'],c:1,feedback:'Debemos convertir el divisor a un entero moviendo el punto hacia la derecha.'},
  {q:'Para calcular 3.5 ÷ 0.5, ¿cuál es la división equivalente?',o:['a) 350 ÷ 5','b) 35 ÷ 50','c) 35 ÷ 5','d) 3 ÷ 5'],c:2,feedback:'Al mover el punto 1 espacio en ambos números obtenemos 35 ÷ 5.'},
  {q:'Si mueves el punto 2 veces en el divisor, ¿cuántas veces debes moverlo en el dividendo?',o:['a) 1 vez','b) 2 veces','c) 3 veces','d) Ninguna'],c:1},
  {q:'¿Qué haces si debes mover el punto en el dividendo pero ya no hay más cifras?',o:['a) Pongo un punto en el cociente','b) Agrego ceros a la derecha','c) Dejo la división así','d) Resto los decimales'],c:1},
  {q:'Si divides 10 ÷ 0.5, ¿qué pasará con el resultado (cociente)?',o:['a) Será MAYOR que 10','b) Será MENOR que 10','c) Será IGUAL a 10','d) Será negativo'],c:0,feedback:'Al dividir entre un número menor a 1, el cociente siempre será mayor que el dividendo.'},
  {q:'Si divides 10 ÷ 2.5, ¿qué pasará con el resultado?',o:['a) Será MAYOR que 10','b) Será MENOR que 10','c) Será IGUAL a 10','d) Será cero'],c:1,feedback:'Al dividir entre un número mayor a 1, el cociente siempre será menor que el dividendo.'},
  {q:'Calcula: 1.2 ÷ 0.4',o:['a) 0.3','b) 30','c) 3','d) 12'],c:2},
  {q:'¿Cuál es el resultado de 5 ÷ 0.1?',o:['a) 0.5','b) 5','c) 50','d) 500'],c:2,feedback:'Mueves un espacio en 0.1 (queda 1) y agregas un cero a 5 (queda 50). 50 ÷ 1 = 50.'},
  {q:'En una división, si bajas una cifra y el número formado es MENOR que el divisor, ¿qué debes hacer?',o:['a) Poner cero al cociente','b) Sumar uno','c) Subir el punto','d) Terminar la división'],c:0},
  {q:'La división 0.45 ÷ 0.09 es igual a:',o:['a) 4.5 ÷ 9','b) 45 ÷ 90','c) 450 ÷ 9','d) 45 ÷ 9'],c:3}
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
    label:['Cociente Mayor','Cociente Menor'], headA:'⬆️ Cociente > Dividendo (Divisor < 1)', headB:'⬇️ Cociente < Dividendo (Divisor > 1)', colA:'mayor', colB:'menor',
    words:[{w:'12 ÷ 0.5',t:'mayor'},{w:'12 ÷ 2',t:'menor'},{w:'8 ÷ 0.2',t:'mayor'},{w:'8 ÷ 4',t:'menor'},{w:'4 ÷ 0.1',t:'mayor'},{w:'15 ÷ 3',t:'menor'},{w:'10 ÷ 0.8',t:'mayor'},{w:'20 ÷ 5',t:'menor'},{w:'5 ÷ 0.5',t:'mayor'},{w:'10 ÷ 2.5',t:'menor'}]
  },
  {
    label:['Necesita Ceros','No necesita Ceros'], headA:'0️⃣ Dividendo necesita ceros', headB:'❌ Dividendo no necesita', colA:'conceros', colB:'sinceros',
    words:[{w:'5 ÷ 0.2',t:'conceros'},{w:'1.5 ÷ 0.3',t:'sinceros'},{w:'10 ÷ 0.05',t:'conceros'},{w:'0.25 ÷ 0.05',t:'sinceros'},{w:'3 ÷ 0.4',t:'conceros'},{w:'4.8 ÷ 1.2',t:'sinceros'},{w:'1 ÷ 0.1',t:'conceros'},{w:'0.9 ÷ 0.3',t:'sinceros'},{w:'2 ÷ 0.02',t:'conceros'},{w:'5.5 ÷ 0.5',t:'sinceros'}]
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
  {s:['El','divisor','debe','convertirse','a','número','entero.'],c:1,art:'El número que indica en cuántas partes repartir'},
  {s:['Se','agrega','cero','al','cociente','si','la','cifra','es','menor.'],c:4,art:'El resultado de la división'},
  {s:['Si','el','divisor','es','menor','que','1','el','cociente','es','mayor.'],c:4,art:'Lo que genera un cociente más grande'},
  {s:['Mueve','el','punto','hacia','la','derecha','en','el','dividendo.'],c:8,art:'La cantidad que será repartida'},
  {s:['Para','2.5','entre','0.5','se','mueve','el','punto','una','vez.'],c:7,art:'Símbolo separador decimal'},
  {s:['Faltan','cifras','entonces','se','agregan','ceros','al','dividendo.'],c:5,art:'Dígitos que se añaden cuando faltan espacios'},
  {s:['Al','dividir','entre','0.1','el','resultado','es','10','veces','mayor.'],c:3,art:'Divisor que aumenta el valor 10 veces'},
  {s:['Lo','que','le','haces','al','divisor','se','lo','haces','al','dividendo.'],c:10,art:'Número adentro de la casita'},
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
  {s:'Para dividir con decimales, el divisor se debe convertir en un número ___.',opts:['entero','fraccionario','negativo'],c:0},
  {s:'Al mover el punto a la derecha en el divisor, se debe mover la misma cantidad en el ___.',opts:['cociente','residuo','dividendo'],c:2},
  {s:'Si debes mover el punto en el dividendo pero faltan cifras, agregas ___.',opts:['puntos','ceros','unos'],c:1},
  {s:'Si el divisor es menor que 1, el cociente será ___ que el dividendo original.',opts:['menor','igual','mayor'],c:2},
  {s:'La división 1.5 ÷ 0.3 es equivalente a la división entera ___.',opts:['150 ÷ 3','15 ÷ 3','15 ÷ 30'],c:1},
  {s:'Si al bajar una cifra, la cantidad a dividir es menor que el divisor, ponemos ___ al cociente.',opts:['uno','punto','cero'],c:2},
  {s:'Si el divisor es mayor que 1, el cociente será ___ que el dividendo original.',opts:['mayor','menor','igual'],c:1},
  {s:'Dividir un número entre 0.1 equivale a ___ por 10.',opts:['restar','dividir','multiplicar'],c:2}
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

// ===================== LAB (LABORATORIO) =====================
function labMovePoint(state) {
    const divd = document.getElementById('lab-dividendo');
    const divr = document.getElementById('lab-divisor');
    const res = document.getElementById('lab-resultado');
    const exp = document.getElementById('lab-explicacion');
    
    if(state === 0) {
        divd.textContent = '4.5'; divr.textContent = '0.5';
        res.style.opacity = '0';
        exp.textContent = "Estado inicial. Tenemos decimales en ambos lados.";
    } else if(state === 1) {
        divd.textContent = '45'; divr.textContent = '5';
        res.style.opacity = '1';
        exp.innerHTML = "<strong>¡Excelente!</strong> Mover 1 espacio a la derecha quita los decimales. <strong>45 ÷ 5 = 9</strong>";
        pts(2); // Mini premio
    } else if(state === 2) {
        divd.textContent = '450'; divr.textContent = '50';
        res.style.opacity = '1';
        exp.innerHTML = "Si mueves 2 espacios, agregas un cero. La división crece, pero la proporción sigue igual: <strong>450 ÷ 50 = 9</strong>";
    }
    sfx('click');
    fin('s-lab', false);
}

// ===================== WIDGET: EQUIVALENCIAS =====================
const equivData = [
  { q: '1.2 ÷ 0.4', opts: ['120 ÷ 4', '12 ÷ 4', '1.2 ÷ 4'], c: '12 ÷ 4' },
  { q: '0.25 ÷ 0.05', opts: ['2.5 ÷ 5', '250 ÷ 50', '25 ÷ 5'], c: '25 ÷ 5' },
  { q: '3 ÷ 0.5', opts: ['30 ÷ 5', '3 ÷ 5', '300 ÷ 5'], c: '30 ÷ 5' },
  { q: '4.2 ÷ 0.02', opts: ['42 ÷ 2', '420 ÷ 2', '4.2 ÷ 2'], c: '420 ÷ 2' },
  { q: '0.8 ÷ 0.2', opts: ['8 ÷ 20', '80 ÷ 2', '8 ÷ 2'], c: '8 ÷ 2' }
];
let equivIdx = 0, equivDone = false;

function buildEquiv() {
  equivDone = false;
  const item = equivData[equivIdx];
  const qEl = document.getElementById('widgEquivOri');
  const btnsWrap = document.querySelector('.cmp-vis-btns');
  if(qEl) qEl.textContent = item.q;
  if(btnsWrap) {
    btnsWrap.innerHTML = '';
    item.opts.forEach(opt => {
      const b = document.createElement('button');
      b.className = 'cmp-sym-btn';
      b.textContent = opt;
      b.onclick = () => ansEquiv(opt, b);
      btnsWrap.appendChild(b);
    });
  }
  const fbEl = document.getElementById('fbEquiv');
  if(fbEl) fbEl.classList.remove('show');
}

function ansEquiv(ans, btnEl) {
  if (equivDone) return;
  equivDone = true;
  const item = equivData[equivIdx];
  
  if (ans === item.c) {
    btnEl.classList.add('cmp-ok');
    fb('fbEquiv', `¡Correcto! Mover el punto conserva el cociente. +4 XP`, true);
    if (!xpTracker.equiv.has(equivIdx)) { xpTracker.equiv.add(equivIdx); pts(4); }
    sfx('ok');
    fin('s-widgets', false);
  } else {
    btnEl.classList.add('cmp-no');
    // Resaltar la correcta
    const btns = document.querySelectorAll('.cmp-vis-btns .cmp-sym-btn');
    btns.forEach(b => { if(b.textContent === item.c) b.classList.add('cmp-ok'); });
    fb('fbEquiv', `Incorrecto. La respuesta era ${item.c}`, false);
    sfx('no');
  }
}

function nextEquiv() {
  sfx('click');
  equivIdx = (equivIdx + 1) % equivData.length;
  buildEquiv();
}


// ===================== RETO FINAL =====================
const retoPoolWords=[
  {w:'10 ÷ 0.5',t:'mayor'}, {w:'15 ÷ 2.5',t:'menor'}, {w:'8 ÷ 0.1',t:'mayor'},
  {w:'12 ÷ 0.4',t:'mayor'}, {w:'20 ÷ 4',t:'menor'}, {w:'6 ÷ 0.2',t:'mayor'}, {w:'18 ÷ 6',t:'menor'},
  {w:'2 ÷ 0.05',t:'mayor'}, {w:'9 ÷ 3',t:'menor'}, {w:'4 ÷ 0.25',t:'mayor'}, {w:'15 ÷ 3',t:'menor'},
  {w:'5 ÷ 1',t:'igual'}, {w:'8 ÷ 1',t:'igual'}, {w:'12 ÷ 1',t:'igual'}
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
        const labels={mayor:'MAYOR que el dividendo',menor:'MENOR que el dividendo',igual:'IGUAL al dividendo'};
        _fb.textContent=`El resultado de ${retoCurrent.w} es ${labels[retoCurrent.t]}`;
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
  {s:'El dividendo es la cantidad que vamos a repartir.',type:'Concepto: Dividendo'},
  {s:'En la división 3.5 ÷ 0.5, el divisor es 0.5.',type:'Elemento de la división'},
  {s:'Agregamos ceros al dividendo si ya no podemos mover el punto.',type:'Regla del movimiento'},
  {s:'Si bajas una cifra y no ajusta, pon un cero al cociente.',type:'Regla del cociente'},
  {s:'Un divisor menor que 1 hace que el resultado crezca.',type:'Propiedad de la división'},
  {s:'Mover el punto es como multiplicar por 10.',type:'Equivalencia matemática'}
];
const classifyTaskDB=[
  {w:'10 ÷ 0.5',pos:'Cociente Mayor',val:'20',equiv:'100 ÷ 5'},
  {w:'12 ÷ 3',pos:'Cociente Menor',val:'4',equiv:'No necesita mover'},
  {w:'0.45 ÷ 0.09',pos:'Cociente Mayor',val:'5',equiv:'45 ÷ 9'},
  {w:'8 ÷ 0.2',pos:'Cociente Mayor',val:'40',equiv:'80 ÷ 2'},
  {w:'15 ÷ 2.5',pos:'Cociente Menor',val:'6',equiv:'150 ÷ 25'},
];
const completeTaskDB=[
  {s:'El número que indica en cuántas partes se reparte se llama ___.',opts:['dividendo','divisor','cociente'],ans:'divisor'},
  {s:'La división 1.2 ÷ 0.3 equivale a ___.',opts:['120 ÷ 3','12 ÷ 3','12 ÷ 30'],ans:'12 ÷ 3'},
  {s:'Dividir entre 0.1 hace que el número sea ___.',opts:['mayor','menor','igual'],ans:'mayor'},
  {s:'Mover el punto 2 veces equivale a multiplicar por ___.',opts:['10','100','1000'],ans:'100'},
  {s:'Si te faltan cifras en el dividendo, agregas ___.',opts:['puntos','ceros','unos'],ans:'ceros'}
];
const explainQuestions=[
  {q:'Explica con tus palabras cómo resuelves 2.5 ÷ 0.5',ans:'Muevo el punto 1 vez a la derecha en ambos números, convirtiéndolo en 25 ÷ 5. El resultado es 5.'},
  {q:'¿Por qué 10 ÷ 0.5 da un resultado mayor a 10?',ans:'Porque estamos repartiendo 10 en porciones menores a la unidad (mitades), así que obtenemos más porciones (20).'},
  {q:'¿Cuándo se debe agregar un cero al cociente?',ans:'Cuando al bajar una cifra del dividendo, la cantidad formada es menor que el divisor y no se puede repartir.'}
];
const pensamientoTaskDB=[
  {q:'Encuentra el error: "Para resolver 3 ÷ 0.5, convierto solo 0.5 en 5 y hago 3 ÷ 5 = 0.6."',ans:'El error es mover el punto solo en el divisor. Si 0.5 → 5 (×10), también hay que convertir 3 → 30 (×10). Lo correcto: 30 ÷ 5 = 6, no 0.6.',type:'🔎 Detectar error'},
  {q:'Explica por qué 8 ÷ 0.2 es mayor que 8.',ans:'Porque el divisor (0.2) es menor que 1. Al dividir entre un número menor que 1, el cociente siempre será MAYOR que el dividendo. 8 ÷ 0.2 = 40.',type:'💬 Justificar'},
  {q:'Inventa un problema con lempiras, litros, libras, metros o alimentos que se resuelva con una división decimal.',ans:'Respuesta variable. Ej: "Tengo 4.5 litros de jugo y sirvo vasos de 0.5 litros. ¿Cuántos vasos lleno?" R: 4.5 ÷ 0.5 = 9 vasos.',type:'✏️ Crear problema'},
  {q:'Resuelve 4.5 ÷ 0.5 y explica cada movimiento del punto.',ans:'Paso 1: El divisor (0.5) tiene 1 decimal → muevo 1 espacio en ambos. Paso 2: 45 ÷ 5. Paso 3: 45 ÷ 5 = 9. El cociente es 9.',type:'🧮 Resolver y explicar'},
  {q:'Sin calcular, ordena de mayor a menor los cocientes: 10÷0.5, 10÷1, 10÷2. Justifica.',ans:'10÷0.5=20 > 10÷1=10 > 10÷2=5. Cuanto menor el divisor, mayor el cociente. El dividendo es siempre 10.',type:'🧠 Razonar sin calcular'},
  {q:'¿Qué pasaría si al resolver 6 ÷ 0.3 solo mueves el punto en el divisor y no en el dividendo?',ans:'Obtendrías 6 ÷ 3 = 2, que es incorrecto. La respuesta correcta es 60 ÷ 3 = 20. Mover solo uno cambia la proporción.',type:'⚠️ Analizar error'},
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
function genIdentifyTask(out,count){ _instrBlock(out,'Instrucción',['Copia en tu cuaderno; subraya el concepto matemático indicado.','<strong>Ejemplo:</strong> Mover a la derecha. → <span style="color:var(--jade);font-weight:700;">Regla del punto</span>']); _pick(identifyTaskDB,Math.min(count,identifyTaskDB.length)).forEach((item,i)=>{ const div=document.createElement('div'); div.className='tg-task'; div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✔ ${item.type}</div></div>`; out.appendChild(div); }); }
function genClassifyTask(out,count){ _instrBlock(out,'Instrucción',['Copia la tabla. Escribe si el cociente será Mayor o Menor que el dividendo, el resultado exacto y la equivalencia entera.']); const items=_pick(classifyTaskDB,Math.min(count,classifyTaskDB.length)); const wrap=document.createElement('div'); wrap.style.overflowX='auto'; const th=(t,extra='')=>`<th style="padding:0.3rem 0.4rem;border:1px solid var(--border);font-size:0.72rem;text-align:center;${extra}">${t}</th>`; let html=`<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:480px;"><thead><tr style="background:var(--pri-gl);">${th('Operación','text-align:left;')}${th('Cociente > o <')}${th('Resultado')}${th('Equivalencia')}</tr></thead><tbody>`; items.forEach(it=>{ html+=`<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td>`+Array(3).fill(`<td style="padding:0.4rem;border:1px solid var(--border);min-width:50px;"></td>`).join('')+'</tr>'; }); html+='</tbody></table>'; wrap.innerHTML=html; out.appendChild(wrap); const ans=document.createElement('div'); ans.className='tg-answer'; ans.style.marginTop='0.8rem'; ans.innerHTML='<strong>✔ Respuestas:</strong><br>'+items.map(it=>`<strong>${it.w}:</strong> ${it.pos} | R: ${it.val} | Eq: ${it.equiv}`).join('<br>'); out.appendChild(ans); }
function genCompleteTask(out,count){ _instrBlock(out,'Instrucción',['Copia y resuelve en tu cuaderno. Elige la opción correcta para el espacio ___.']); const pool=_shuffle([...completeTaskDB]); for(let i=0;i<count;i++){ const item=pool[i%pool.length]; const div=document.createElement('div'); div.className='tg-task'; const sent=item.s.replace('___','<span class="tg-blank" style="min-width:90px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>'); div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${sent}</strong><div style="margin-top:0.4rem;font-size:0.82rem;color:var(--gray);">💡 Opciones: <strong>${item.opts.join(' | ')}</strong></div><div class="tg-answer">✔ ${item.ans}</div></div>`; out.appendChild(div); } }
function genExplainTask(out,count){ _instrBlock(out,'Instrucción',['Copia las preguntas en tu cuaderno y responde de forma clara.']); const pool=_shuffle([...explainQuestions]); for(let i=0;i<count;i++){ const item=pool[i%pool.length]; const div=document.createElement('div'); div.className='tg-task'; div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.3rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✔ ${item.ans}</div></div>`; out.appendChild(div); } }
function toggleAns(){ ansVisible=!ansVisible; document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none'); sfx('click'); }

// ===================== SOPA DE LETRAS =====================
const sopaSets=[
  {
    size:10,
    grid:[
      ['D','I','V','I','D','E','N','D','O','P'],
      ['I','B','J','K','N','O','P','Q','R','U'],
      ['V','W','D','E','R','E','C','H','A','N'],
      ['I','B','C','D','E','F','G','H','I','T'],
      ['S','J','M','A','Y','O','R','Q','R','O'],
      ['O','S','T','U','C','W','X','Y','Z','M'],
      ['R','A','B','C','E','E','F','G','H','E'],
      ['A','S','U','C','R','R','J','K','L','N'],
      ['O','N','O','P','O','R','O','T','U','O'],
      ['W','C','O','C','I','E','N','T','E','R']
    ],
    words:[
      {w:'DIVIDENDO', cells:[[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8]]},
      {w:'DIVISOR',   cells:[[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0]]},
      {w:'DERECHA',   cells:[[2,2],[2,3],[2,4],[2,5],[2,6],[2,7],[2,8]]},
      {w:'MAYOR',     cells:[[4,2],[4,3],[4,4],[4,5],[4,6]]},
      {w:'CERO',      cells:[[5,4],[6,4],[7,4],[8,4]]},
      {w:'COCIENTE',  cells:[[9,1],[9,2],[9,3],[9,4],[9,5],[9,6],[9,7],[9,8]]},
      {w:'PUNTO',     cells:[[0,9],[1,9],[2,9],[3,9],[4,9]]},
      {w:'MENOR',     cells:[[5,9],[6,9],[7,9],[8,9],[9,9]]}
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

// ===================== EVALUACIÓN FINAL =====================
const evalTFBank=[
  {q:'Para dividir con decimales, el divisor se debe convertir a un número entero.',a:true},
  {q:'Al mover el punto 1 espacio en el divisor, se debe mover 2 espacios en el dividendo.',a:false},
  {q:'Si te faltan cifras en el dividendo al mover el punto, agregas ceros.',a:true},
  {q:'La división 2.5 ÷ 0.5 es equivalente a 25 ÷ 5.',a:true},
  {q:'Si el divisor es 0.2 (menor que 1), el resultado será menor que el dividendo.',a:false},
  {q:'Se coloca un cero en el cociente si la cifra bajada forma un número menor al divisor.',a:true},
  {q:'Al multiplicar dividendo y divisor por 10, el resultado de la división cambia.',a:false},
  {q:'10 ÷ 2.5 es lo mismo que 100 ÷ 25.',a:true},
  {q:'Si el divisor es mayor que 1, el cociente es menor que el dividendo.',a:true},
  {q:'Al dividir entre 0.1, el número se hace 10 veces mayor.',a:true},
];
const evalMCBank=[
  {q:'¿Cuál es el primer paso al dividir 4.2 ÷ 0.2?',o:['a) Dividir directo','b) Mover el punto 1 vez a la derecha en ambos','c) Quitar el punto solo en el divisor'],a:1},
  {q:'¿A qué división entera equivale 1.5 ÷ 0.3?',o:['a) 150 ÷ 3','b) 15 ÷ 30','c) 15 ÷ 3'],a:2},
  {q:'Si divido 8 ÷ 0.5, el resultado será:',o:['a) 16','b) 4','c) 0.4'],a:0},
  {q:'¿Por qué agregas ceros en el dividendo?',o:['a) Para hacerlo más grande','b) Cuando ya no hay cifras para mover el punto','c) Para terminar la división'],a:1},
  {q:'Al bajar un número y ver que no alcanza para dividir, ¿qué haces?',o:['a) Pongo un cero en el cociente y bajo el siguiente','b) Sumo el divisor','c) Subo el punto'],a:0},
];
const evalCPBank=[
  {q:'El ___ es el número que está afuera e indica en cuántas partes se reparte.',a:'divisor'},
  {q:'Mover el punto un espacio equivale a multiplicar por ___.',a:'10'},
  {q:'Si el divisor es menor a 1, el cociente será ___ que el dividendo.',a:'mayor'},
  {q:'La respuesta de una división se llama ___.',a:'cociente'},
  {q:'12 ÷ 0.4 es equivalente a ___ ÷ 4.',a:'120'},
];
const evalPRBank=[
  {term:'Divisor Decimal',def:'Se debe convertir en entero moviendo el punto'},
  {term:'Cero al Cociente',def:'Se usa cuando lo que bajamos es menor que el divisor'},
  {term:'Agregar Ceros',def:'Se hace en el dividendo si faltan cifras al mover el punto'},
  {term:'Divisor Menor a 1',def:'Provoca que el cociente sea mayor que el dividendo'},
  {term:'Equivalencia',def:'Multiplicar dividendo y divisor por la misma cantidad'},
];

const evalExplainBank=[
  {q:'Resuelve 4.5 ÷ 0.5 paso a paso y explica qué haces con el punto decimal.',rubric:['Mueve el punto 1 espacio en ambos → 45 ÷ 5','Resultado correcto: 9','Explica que multiplicar ambos por 10 mantiene el cociente igual']},
  {q:'Sin resolver exactamente, indica si 8 ÷ 0.2 será mayor o menor que 8. Justifica tu respuesta.',rubric:['Responde: mayor','Explica que el divisor (0.2) es menor que 1','Menciona que dividir entre un decimal pequeño aumenta el resultado']},
  {q:'Inventa un problema de la vida real que se resuelva con 6 ÷ 0.3.',rubric:['Usa un contexto cotidiano (lempiras, metros, etc.)','La operación a resolver es 6 ÷ 0.3','El resultado (20) tiene sentido en el problema']},
  {q:'Encuentra el error: "Para resolver 5 ÷ 0.5, escribo 5 ÷ 5 = 1."',rubric:['Identifica el error: no se mueve el punto en el dividendo','Lo correcto sería 50 ÷ 5 = 10','Explica la regla: ambos números deben multiplicarse por 10']},
  {q:'Explica por qué agregar ceros al dividendo no significa inventar números.',rubric:['Menciona equivalencia (multiplicar por 10)','Explica que la proporción se mantiene','Usa un ejemplo: 3 ÷ 0.5 = 30 ÷ 5 = 6']},
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación División de Decimales · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:12pt;color:#111;background:#fff;padding:4mm 6mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.5rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;color:#1565c0;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:#1565c0;margin-top:0.15rem;font-weight:700;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.5rem 0 0.25rem;border-left:4px solid #1565c0;background:#e3f2fd;display:flex;justify-content:space-between;align-items:center;color:#1565c0;}.qn{font-weight:700;min-width:22px;flex-shrink:0;color:#1565c0;}.tf-row{display:flex;align-items:flex-start;gap:0.3rem;font-size:10.5pt;line-height:1.4;padding:0.25rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:42px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.2rem;margin-top:0.2rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.28rem 0.45rem;margin-bottom:0.22rem;break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.4;display:flex;gap:0.3rem;margin-bottom:0.18rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.22rem 0.55rem;}.mc-opts{display:grid;grid-template-columns:repeat(3,1fr);gap:0.08rem 0.25rem;margin-left:1.3rem;}.mc-opt{font-size:9.5pt;display:flex;align-items:center;gap:0.22rem;}.mc-opt input{width:12px;height:12px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.4;padding:0.22rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:130px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{break-inside:avoid;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.2rem 0.5rem;margin-top:0.15rem;}.pr-head{font-size:9pt;font-weight:700;color:#1565c0;margin-bottom:0.2rem;}.pr-item{font-size:10pt;padding:0.22rem 0.32rem;background:#e3f2fd;border-radius:3px;margin-bottom:0.12rem;display:flex;align-items:center;gap:0.22rem;line-height:1.2;}.pr-num{font-weight:700;color:#1565c0;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #1565c0;padding-bottom:0.35rem;margin-bottom:0.5rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;color:#1565c0;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #cce0ff;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;color:#1565c0;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#1565c0;}.pa{color:#007a00;font-weight:600;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:#1565c0;font-weight:700;font-style:italic;}.obt-lbl{font-weight:700;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #1565c0;height:12px;}.obt-pct{font-weight:700;}.total-row{display:flex;align-items:baseline;justify-content:flex-end;gap:7px;font-size:11pt;color:#1565c0;font-weight:700;font-style:italic;margin-top:0.4rem;padding:0.2rem 0.5rem;background:#e3f2fd;border-radius:4px;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #1565c0;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · Misión División de Decimales · Matemática</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 4 secciones × 5 preguntas × 5 pts c/u · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✔ PAUTA DOCENTE — Evaluación Final · División de Decimales · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">100 pts | 4 secciones × 5 preguntas × 5 pts | Matemáticas · Educación Básica</div></div><div class="p-grid">${pR}</div>
  ${zgBlock}</div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("evalPage",252,0.55,1.45);fit("pautaPage",252,0.55,1.3);})();</script></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(doc); win.document.close(); setTimeout(()=>win.print(),400);
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
    q: 'Si tienes 10 lempiras y los divides en grupos de 0.50, ¿saldrán más o menos de 10 grupos?',
    opts: ['Más de 10 grupos', 'Menos de 10 grupos', 'Exactamente 10 grupos'],
    correct: 0,
    feedback: '¡Correcto! 10 ÷ 0.50 = 20 grupos. Al dividir entre un número MENOR que 1, siempre obtienes MÁS partes que el número original.',
    wrongFeedback: 'La respuesta es: más de 10 grupos. 10 ÷ 0.50 = 20. Como 0.50 es menor que 1 (una mitad), caben 20 mitades en 10. ¡Aprenderás por qué en la sección Aprende!'
  },
  {
    q: 'Antes de resolver 8 ÷ 0.2, ¿crees que el resultado será mayor o menor que 8?',
    opts: ['Mayor que 8', 'Menor que 8', 'Igual a 8'],
    correct: 0,
    feedback: '¡Excelente intuición! 8 ÷ 0.2 = 40. El divisor (0.2) es menor que 1, por eso el resultado CRECE. ¿Puedes imaginar cuántas porciones de 0.2 caben en 8?',
    wrongFeedback: 'La respuesta es: mayor que 8. 8 ÷ 0.2 = 40. Como 0.2 < 1, al dividir en porciones pequeñas, obtienes MÁS porciones que el número original.'
  },
  {
    q: 'Antes de resolver 15 ÷ 2.5, ¿crees que el resultado será mayor o menor que 15?',
    opts: ['Mayor que 15', 'Menor que 15', 'Igual a 15'],
    correct: 1,
    feedback: '¡Muy bien! 15 ÷ 2.5 = 6. El divisor (2.5) es mayor que 1, por eso el resultado DISMINUYE. Cada porción es grande, entonces caben pocas.',
    wrongFeedback: 'La respuesta es: menor que 15. 15 ÷ 2.5 = 6. Como 2.5 > 1, cada porción es grande, ¡así que caben menos porciones!'
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

// ===================== EXPLICA CON TUS PALABRAS =====================
const explicaData = [
  {
    q: 'Explica por qué 10 ÷ 0.5 da 20.',
    hint: '💡 Pista: ¿Cuántas mitades (0.5) caben en 10?',
    rubric: ['✓ Menciona dividendo y divisor correctamente', '✓ Explica que el divisor es menor que 1', '✓ Da un razonamiento o ejemplo coherente'],
    suggested: 'Tengo 10 y divido en grupos de 0.5 (medios). En 10 caben 20 medios. El divisor (0.5) es menor que 1, por eso el resultado (20) es mayor que el dividendo (10). Equivale a multiplicar ambos por 10: 100 ÷ 5 = 20.'
  },
  {
    q: '¿Por qué dividir entre un número menor que 1 puede hacer crecer el resultado?',
    hint: '💡 Pista: Imagina cortar una tira de papel en piezas muy pequeñas.',
    rubric: ['✓ Usa un ejemplo o analogía concreta', '✓ Explica que piezas pequeñas generan más porciones', '✓ Menciona que el cociente supera al dividendo'],
    suggested: 'Si corto 6 metros de tela en pedazos de 0.5 metros, ¿cuántos pedazos obtengo? 6 ÷ 0.5 = 12 pedazos. Cuanto más pequeñas las porciones (divisor menor), más porciones obtienes (cociente mayor).'
  },
  {
    q: '¿Qué pasaría si solo movieras el punto en el divisor y no en el dividendo?',
    hint: '💡 Pista: Recuerda la Regla de Oro: lo que le haces al divisor, debes hacérselo al dividendo.',
    rubric: ['✓ Identifica que el resultado cambiaría y sería incorrecto', '✓ Menciona que ambos deben multiplicarse por lo mismo', '✓ Da un ejemplo del error'],
    suggested: 'La división cambiaría y daría un resultado incorrecto. Ejemplo: 1.2 ÷ 0.4. Si solo conviertes el divisor → 1.2 ÷ 4 = 0.3 (¡ERROR!). Lo correcto es mover en ambos: 12 ÷ 4 = 3.'
  },
  {
    q: 'Inventa un problema de la vida diaria que se resuelva con 12 ÷ 0.4.',
    hint: '💡 Pista: Piensa en lempiras, metros de tela, litros de refresco o libras de fruta.',
    rubric: ['✓ El contexto es de la vida real', '✓ La operación a usar es 12 ÷ 0.4', '✓ El resultado (30) tiene sentido en el problema'],
    suggested: '"Tengo 12 metros de tela y quiero hacer lazos de 0.4 metros cada uno. ¿Cuántos lazos puedo hacer?" 12 ÷ 0.4 = 30 lazos.'
  },
  {
    q: 'Explica por qué agregar ceros no significa inventar números.',
    hint: '💡 Pista: Piensa en fracciones equivalentes: ½ = 2/4 = 5/10.',
    rubric: ['✓ Menciona que es multiplicar dividendo y divisor por la misma cantidad', '✓ Explica que la proporción no cambia', '✓ Usa un ejemplo con divisiones'],
    suggested: 'Agregar un cero equivale a multiplicar por 10. Por ejemplo: 3 ÷ 0.5 → (×10) → 30 ÷ 5. El resultado (6) es el mismo. No inventamos nada, solo cambiamos la forma manteniendo la misma proporción.'
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

// ===================== PRUEBA OPERATIVA — DIVISIÓN DE DECIMALES =====================

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

// ---- Arithmetic helpers (evita errores de coma flotante) ----
let _opRnd = Math.random;
function _opRint(min, max) { return Math.floor(_opRnd() * (max - min + 1)) + min; }
function _opFmt(n) { return parseFloat(n.toFixed(6)).toString(); }

// I. División: decimal ÷ entero (5 × 10 = 50 pts)
function genDivEnteroItems() {
  const items = [];
  for (let i = 0; i < 5; i++) {
    const divisor = _opRint(2, 9);
    let k, dividend;
    do { k = _opRint(1, 19); dividend = (k * divisor) / 10; } while (!_opFmt(dividend).includes('.'));
    items.push({ a: _opFmt(dividend), b: divisor.toString(), ans: _opFmt(k / 10) });
  }
  return items;
}

// II. Transforma el divisor decimal (10 × 1 = 10 pts)
function genTransformItems() {
  const items = [];
  for (let i = 0; i < 10; i++) {
    const divisorInt = _opRint(2, 9), quotient = _opRint(2, 9);
    const dividendFull = (quotient * divisorInt) / 10, divisorFull = divisorInt / 10;
    items.push({ orig: `${_opFmt(dividendFull)} ÷ ${_opFmt(divisorFull)}`, tDivd: (quotient * divisorInt).toString(), tDivr: divisorInt.toString(), ans: quotient.toString() });
  }
  return items;
}

// III. Encuentra el número que falta (10 × 1 = 10 pts)
// Pensamiento inverso: verifica que dominan la relación dividendo-divisor-cociente
// y la equivalencia ×10 de la prueba conceptual, no solo el algoritmo.
function genMissingItems() {
  const items = [];
  for (let i = 0; i < 10; i++) {
    const dInt = _opRint(2, 9), q = _opRint(2, 9);
    const divisor = _opFmt(dInt / 10), dividend = _opFmt((q * dInt) / 10);
    const type = i % 3;
    if (type === 0) items.push({ expr: `___ ÷ ${divisor} = ${q}`, ans: dividend });
    else if (type === 1) items.push({ expr: `${dividend} ÷ ___ = ${q}`, ans: divisor });
    else items.push({ expr: `${dividend} ÷ ${divisor} = ${q * dInt} ÷ ___`, ans: dInt.toString() });
  }
  return items;
}

// IV. Problemas de la vida real (5 × 2 = 10 pts)
// División "de medida": ¿cuántos grupos de b caben en A? Deriva de los
// problemas inventados de la prueba conceptual, con respuesta verificable.
const _opProblemCtx = [
  { t: (A, b) => `Doña Rosa tiene ${A} litros de jugo de naranja y lo sirve en vasos de ${b} litros. ¿Cuántos vasos llena?`, u: 'vasos', bs: [0.2, 0.25, 0.5] },
  { t: (A, b) => `Una cinta de ${A} metros se corta en trozos de ${b} metros para hacer lazos. ¿Cuántos trozos salen?`, u: 'trozos', bs: [0.3, 0.4, 0.5, 0.6] },
  { t: (A, b) => `Don Julio empaca ${A} libras de frijoles en bolsas de ${b} libras. ¿Cuántas bolsas llena?`, u: 'bolsas', bs: [0.5, 1.5, 2.5] },
  { t: (A, b) => `Un caramelo cuesta ${b} lempiras. ¿Cuántos caramelos se pueden comprar con ${A} lempiras?`, u: 'caramelos', bs: [0.5, 1.5, 2.5] },
  { t: (A, b) => `Una sastre corta ${A} metros de tela en piezas de ${b} metros. ¿Cuántas piezas obtiene?`, u: 'piezas', bs: [0.4, 0.8, 1.2] },
  { t: (A, b) => `Una jarra con ${A} litros de fresco se reparte en tazas de ${b} litros. ¿Cuántas tazas se llenan?`, u: 'tazas', bs: [0.2, 0.25, 0.4] },
  { t: (A, b) => `Un camión reparte ${A} quintales de maíz en sacos de ${b} quintales. ¿Cuántos sacos usa?`, u: 'sacos', bs: [0.5, 1.5, 2.5] }
];
function genProblemaItems() {
  return _shuffleF(_opProblemCtx, _opRnd).slice(0, 5).map(ctx => {
    const b = ctx.bs[_opRint(0, ctx.bs.length - 1)], q = _opRint(6, 24);
    const A = _opFmt(q * b);
    return { text: ctx.t(A, _opFmt(b)), op: `${A} ÷ ${_opFmt(b)}`, ans: q.toString(), u: ctx.u };
  });
}

// V. Retos de olimpiada (4 × 5 = 20 pts): 2 ordena + detective del error + punto mágico
function genRetoErr() {
  const dInt = _opRint(3, 9), q = _opRint(3, 9);
  const dividend = _opFmt((q * dInt) / 10), divisor = _opFmt(dInt / 10), wrong = _opFmt(q / 10);
  return {
    text: `Un estudiante resolvió ${dividend} ÷ ${divisor} moviendo el punto SOLO en el divisor: hizo ${dividend} ÷ ${dInt} y obtuvo ${wrong}. Aplica la Regla de Oro y escribe el cociente correcto.`,
    ans: q.toString()
  };
}
function genRetoMagia() {
  const dInt = _opRint(2, 9), q = _opRint(2, 9), places = _opRint(1, 2);
  const a = q * dInt, small = _opFmt(dInt / Math.pow(10, places));
  return {
    text: `Se sabe que ${a} ÷ ${dInt} = ${q}. SIN resolver la división, usa el movimiento del punto para hallar: ${a} ÷ ${small} = ?`,
    ans: (q * Math.pow(10, places)).toString()
  };
}
function genOrdDivItems() {
  const groups = [];
  for (let g = 0; g < 2; g++) {
    const opts = [0.5, 1, 2, 4, 5];
    const nums = []; let tries = 0;
    while (nums.length < 4 && tries < 200) {
      tries++;
      const b = opts[_opRint(0, opts.length - 1)], a = _opRint(2, 15), q = a / b, label = `${a} ÷ ${_opFmt(b)}`;
      if (!nums.some(n => Math.abs(n.q - q) < 0.01)) nums.push({ label, q });
    }
    const correctOrder = [...nums].sort((x, y) => y.q - x.q).map(n => n.label);
    const display = _shuffleF(nums, _opRnd).map(n => n.label);
    groups.push({ display, correctOrder });
  }
  return groups;
}

function genEvalOp() {
  sfx('click');
  _injectFormaSel('genEvalOp', 'evalOpFormaSel', evalOpFormNum, function (v) { evalOpFormNum = v; });
  const _sO = document.getElementById('evalOpFormaSel');
  if (_sO && parseInt(_sO.value, 10)) evalOpFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sO.value, 10)));
  const cf = evalOpFormNum; window._currentEvalOpForm = cf; _opRnd = _evalRng(100000 + cf); evalOpFormNum = (evalOpFormNum % EVAL_FORMAS) + 1; _injectFormaSel('genEvalOp', 'evalOpFormaSel', evalOpFormNum, function (v) { evalOpFormNum = v; }); saveProgress();
  document.getElementById('evalop-screen-title').textContent = `📐 Prueba Operativa — Forma ${cf} · División de Decimales`;
  evalOpAnsVisible = false;
  const out = document.getElementById('evalOpOut'); out.innerHTML = '';

  const denItems = genDivEnteroItems();
  const s1 = document.createElement('div');
  s1.innerHTML = '<div class="eval-section-title">I. División: decimal entre entero <span class="eval-pts">50 pts · 10 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Resuelve el proceso en tu cuaderno y escribe la respuesta en la casilla.</p>';
  denItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.a} ÷ ${it.b} =</span><input class="eval-cp-input" type="text" data-den="${i}" autocomplete="off" inputmode="decimal"></div><div class="eval-answer">${it.ans}</div><div class="eval-item-feedback" id="evalFbDen${i}" aria-live="polite"></div>`;
    s1.appendChild(d);
  });
  out.appendChild(s1);

  const trItems = genTransformItems();
  const s2 = document.createElement('div');
  s2.innerHTML = '<div class="eval-section-title">II. Transforma el divisor decimal <span class="eval-pts">10 pts · 1 pt c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Escribe el cociente. (Pista: multiplica dividendo y divisor por 10.)</p>';
  trItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.orig} =</span><input class="eval-cp-input" type="text" data-trn="${i}" autocomplete="off" inputmode="decimal" style="width:60px;"></div><div class="eval-answer">${it.ans}</div><div class="eval-item-feedback" id="evalFbTrn${i}" aria-live="polite"></div>`;
    s2.appendChild(d);
  });
  out.appendChild(s2);

  const mssItems = genMissingItems();
  const s3 = document.createElement('div');
  s3.innerHTML = '<div class="eval-section-title">III. Encuentra el número que falta <span class="eval-pts">10 pts · 1 pt c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Escribe el número que hace verdadera cada división. Piensa al revés: ¿qué número falta para que funcione?</p>';
  mssItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.expr}</span><span style="font-size:0.82rem;color:var(--gray);">Falta:</span><input class="eval-cp-input" type="text" data-mss="${i}" autocomplete="off" inputmode="decimal" style="width:70px;"></div><div class="eval-answer">${it.ans}</div><div class="eval-item-feedback" id="evalFbMss${i}" aria-live="polite"></div>`;
    s3.appendChild(d);
  });
  out.appendChild(s3);

  const prbItems = genProblemaItems();
  const s4 = document.createElement('div');
  s4.innerHTML = '<div class="eval-section-title">IV. Problemas de la vida real <span class="eval-pts">10 pts · 2 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Plantea la división en tu cuaderno, resuélvela y escribe la respuesta.</p>';
  prbItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${it.text}</span></div><div class="opx-row" style="margin-left:1.7rem;"><span style="font-size:0.82rem;color:var(--gray);">R/</span><input class="eval-cp-input" type="text" data-prb="${i}" autocomplete="off" inputmode="decimal" style="width:70px;"><span style="font-size:0.82rem;color:var(--gray);">${it.u}</span></div><div class="eval-answer">${it.op} = ${it.ans} ${it.u}</div><div class="eval-item-feedback" id="evalFbPrb${i}" aria-live="polite"></div>`;
    s4.appendChild(d);
  });
  out.appendChild(s4);

  const ordGroups = genOrdDivItems();
  const retoErr = genRetoErr(), retoMag = genRetoMagia();
  const s5 = document.createElement('div');
  s5.innerHTML = '<div class="eval-section-title">V. Retos de olimpiada <span class="eval-pts">20 pts · 5 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Piensa como matemático: estima, compara y detecta errores sin hacer toda la cuenta.</p>';
  ordGroups.forEach((g, gi) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item evord-group';
    d.innerHTML = `<div class="evord-dir">${gi+1}. Ordena de MAYOR a menor cociente (estima, no resuelvas todo):</div><div class="evord-list" id="evordDivList${gi}"></div><div class="eval-answer">${g.correctOrder.join(' · ')}</div><div class="eval-item-feedback" id="evalFbOrdDiv${gi}" aria-live="polite"></div>`;
    s5.appendChild(d);
  });
  const dErr = document.createElement('div'); dErr.className = 'eval-item eval-auto-item';
  dErr.innerHTML = `<div class="eval-q"><span class="eval-num">3</span><span class="eval-q-text">🔎 <strong>Detective del error:</strong> ${retoErr.text}</span></div><div class="opx-row" style="margin-left:1.7rem;"><span style="font-size:0.82rem;color:var(--gray);">Cociente correcto:</span><input class="eval-cp-input" type="text" data-rerr="0" autocomplete="off" inputmode="decimal" style="width:70px;"></div><div class="eval-answer">${retoErr.ans}</div><div class="eval-item-feedback" id="evalFbRerr" aria-live="polite"></div>`;
  s5.appendChild(dErr);
  const dMag = document.createElement('div'); dMag.className = 'eval-item eval-auto-item';
  dMag.innerHTML = `<div class="eval-q"><span class="eval-num">4</span><span class="eval-q-text">✨ <strong>El punto mágico:</strong> ${retoMag.text}</span></div><div class="opx-row" style="margin-left:1.7rem;"><span style="font-size:0.82rem;color:var(--gray);">Resultado:</span><input class="eval-cp-input" type="text" data-rmag="0" autocomplete="off" inputmode="decimal" style="width:70px;"></div><div class="eval-answer">${retoMag.ans}</div><div class="eval-item-feedback" id="evalFbRmag" aria-live="polite"></div>`;
  s5.appendChild(dMag);
  out.appendChild(s5);

  window._evalOpData = { denItems, trItems, mssItems, prbItems, retoErr, retoMag, ord: ordGroups.map(g => ({ current: [...g.display], correctOrder: g.correctOrder })) };
  ordGroups.forEach((_, gi) => _renderOrdDivGroup(gi));
  const autoPanel = document.createElement('div'); autoPanel.id = 'evalOpAutoResult'; autoPanel.className = 'eval-auto-result';
  autoPanel.innerHTML = '<strong>🧮 Prueba interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato para resolver en papel.';
  out.appendChild(autoPanel);
  fin('s-evaluacion');
}

function _renderOrdDivGroup(gi) {
  const data = window._evalOpData.ord[gi];
  const list = document.getElementById('evordDivList' + gi); if (!list) return;
  list.innerHTML = '';
  data.current.forEach((label, i) => {
    const div = document.createElement('div'); div.className = 'evord-item';
    div.innerHTML = `<div class="evord-arrows"><button class="sort-arrow" onclick="evordDivMove(${gi},${i},-1)"${i===0?' disabled':''}>▲</button><button class="sort-arrow" onclick="evordDivMove(${gi},${i},1)"${i===data.current.length-1?' disabled':''}>▼</button></div><div class="evord-num">${label}</div>`;
    list.appendChild(div);
  });
}
function evordDivMove(gi, idx, dir) {
  sfx('click');
  const data = window._evalOpData.ord[gi]; const ni = idx + dir;
  if (ni < 0 || ni >= data.current.length) return;
  [data.current[idx], data.current[ni]] = [data.current[ni], data.current[idx]];
  _renderOrdDivGroup(gi);
}

function toggleEvalOpAns() {
  evalOpAnsVisible = !evalOpAnsVisible;
  document.querySelectorAll('#evalOpOut .eval-answer').forEach(el => el.style.display = evalOpAnsVisible ? 'block' : 'none');
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
  let total = 0; const det = { den: 0, trn: 0, mss: 0, prb: 0, reto: 0 };
  d.denItems.forEach((it, i) => { const el = document.querySelector(`[data-den="${i}"]`); const ok = _isOpNumOk(el ? el.value : '', it.ans); if (el) { el.classList.toggle('eval-input-ok', ok); el.classList.toggle('eval-input-no', !ok); } if (ok) { det.den++; total += 10; } setEvalFeedback('evalFbDen' + i, ok, ok ? 'Correcto. +10 pts' : 'Revisar. R/ ' + it.ans); });
  d.trItems.forEach((it, i) => { const el = document.querySelector(`[data-trn="${i}"]`); const ok = _isOpNumOk(el ? el.value : '', it.ans); if (el) { el.classList.toggle('eval-input-ok', ok); el.classList.toggle('eval-input-no', !ok); } if (ok) { det.trn++; total += 1; } setEvalFeedback('evalFbTrn' + i, ok, ok ? 'Correcto. +1 pt' : 'Revisar. R/ ' + it.ans); });
  d.mssItems.forEach((it, i) => { const el = document.querySelector(`[data-mss="${i}"]`); const ok = _isOpNumOk(el ? el.value : '', it.ans); if (el) { el.classList.toggle('eval-input-ok', ok); el.classList.toggle('eval-input-no', !ok); } if (ok) { det.mss++; total += 1; } setEvalFeedback('evalFbMss' + i, ok, ok ? 'Correcto. +1 pt' : 'Revisar. R/ ' + it.ans); });
  d.prbItems.forEach((it, i) => { const el = document.querySelector(`[data-prb="${i}"]`); const ok = _isOpNumOk(el ? el.value : '', it.ans); if (el) { el.classList.toggle('eval-input-ok', ok); el.classList.toggle('eval-input-no', !ok); } if (ok) { det.prb++; total += 2; } setEvalFeedback('evalFbPrb' + i, ok, ok ? 'Correcto. +2 pts' : 'Revisar. R/ ' + it.op + ' = ' + it.ans + ' ' + it.u); });
  d.ord.forEach((g, gi) => { const ok = g.current.every((v, i) => v === g.correctOrder[i]); if (ok) { det.reto++; total += 5; } setEvalFeedback('evalFbOrdDiv' + gi, ok, ok ? '¡Orden correcto! +5 pts' : 'Orden incorrecto. Clave: ' + g.correctOrder.join(' · ')); });
  { const el = document.querySelector('[data-rerr="0"]'); const ok = _isOpNumOk(el ? el.value : '', d.retoErr.ans); if (el) { el.classList.toggle('eval-input-ok', ok); el.classList.toggle('eval-input-no', !ok); } if (ok) { det.reto++; total += 5; } setEvalFeedback('evalFbRerr', ok, ok ? '¡Error detectado! +5 pts' : 'Revisar. R/ ' + d.retoErr.ans); }
  { const el = document.querySelector('[data-rmag="0"]'); const ok = _isOpNumOk(el ? el.value : '', d.retoMag.ans); if (el) { el.classList.toggle('eval-input-ok', ok); el.classList.toggle('eval-input-no', !ok); } if (ok) { det.reto++; total += 5; } setEvalFeedback('evalFbRmag', ok, ok ? '¡Magia del punto dominada! +5 pts' : 'Revisar. R/ ' + d.retoMag.ans); }
  const res = document.getElementById('evalOpAutoResult');
  if (res) { res.className = 'eval-auto-result ' + (total >= 70 ? 'eval-auto-pass' : 'eval-auto-risk'); res.innerHTML = `<strong>Resultado: ${total}/100 pts</strong><br><span>÷ Entero: ${det.den*10}/50 · Transforma: ${det.trn}/10 · Número que falta: ${det.mss}/10 · Problemas: ${det.prb*2}/10 · Retos: ${det.reto*5}/20</span>`; }
  if (total >= 70) { pts(8); showToast('🎯 Prueba operativa calificada: ' + total + '/100'); }
  else showToast('🧮 Prueba operativa: ' + total + '/100. Revisa los ítems marcados.');
}

function printEvalOp() {
  if (!window._evalOpData) { showToast('⚠️ Genera una prueba operativa primero'); return; }
  sfx('click');
  const forma = window._currentEvalOpForm || 1; const d = window._evalOpData;
  let s1 = `<div class="sec-title"><span>I. División: decimal entre entero</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 50 pts</span></div></div><p class="opx-instr">Resuelve el proceso en el reverso de la hoja y escribe la respuesta en la línea. Valor 10 pts c/u.</p>`;
  d.denItems.forEach((it, i) => { s1 += `<div class="opx-print-row"><span class="qn">${i+1}.</span><span class="opx-print-expr">${it.a} ÷ ${it.b} =</span><span class="opx-blank"></span></div>`; });
  const trH = Math.ceil(d.trItems.length / 2);
  const trTbl = (items, off) => `<table class="rnd-tbl"><tr><th>#</th><th>División original</th><th>Forma equivalente (×10)</th><th>Cociente</th></tr>${items.map((it, i) => `<tr><td>${off+i+1}</td><td>${it.orig}</td><td class="tr-blank-cell">____ ÷ ____</td><td></td></tr>`).join('')}</table>`;
  let s2 = `<div class="sec-title"><span>II. Transforma el divisor decimal</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10 pts</span></div></div><p class="opx-instr">Escribe la forma equivalente con divisor entero (×10) y el cociente. 1 pt c/u.</p><div class="rnd-print-grid">${trTbl(d.trItems.slice(0,trH),0)}${trTbl(d.trItems.slice(trH),trH)}</div>`;
  const mssH = Math.ceil(d.mssItems.length / 2);
  const mssTbl = (items, off) => `<table class="rnd-tbl"><tr><th>#</th><th>División incompleta</th><th>Número que falta</th></tr>${items.map((it, i) => `<tr><td>${off+i+1}</td><td>${it.expr}</td><td></td></tr>`).join('')}</table>`;
  let s3 = `<div class="sec-title"><span>III. Encuentra el número que falta</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10 pts</span></div></div><p class="opx-instr">Escribe el número que hace verdadera cada división. Piensa al revés. 1 pt c/u.</p><div class="rnd-print-grid">${mssTbl(d.mssItems.slice(0,mssH),0)}${mssTbl(d.mssItems.slice(mssH),mssH)}</div>`;
  let s4 = `<div class="sec-title"><span>IV. Problemas de la vida real</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10 pts</span></div></div><p class="opx-instr">Plantea la división, resuelve el proceso en el reverso de la hoja y escribe la respuesta con su unidad. 2 pts c/u.</p>`;
  d.prbItems.forEach((it, i) => { s4 += `<div class="opx-print-row" style="align-items:flex-start;"><span class="qn">${i+1}.</span><span style="flex:1;line-height:1.35;">${it.text}<br><span style="font-size:9pt;color:#555;">Planteo: <span style="display:inline-block;min-width:70px;border-bottom:1px solid #555;">&nbsp;</span> ÷ <span style="display:inline-block;min-width:70px;border-bottom:1px solid #555;">&nbsp;</span> &nbsp; R/ <span style="display:inline-block;min-width:60px;border-bottom:1.5px solid #111;">&nbsp;</span> ${it.u}</span></span></div>`; });
  let s5 = `<div class="sec-title"><span>V. Retos de olimpiada</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Piensa como matemático: estima, compara y detecta errores sin hacer toda la cuenta. 5 pts c/u.</p><div class="ord-print-grid">${d.ord.map((g,gi)=>`<div class="ord-print-box"><div class="ord-print-dir">${gi+1}. Ordena de Mayor a Menor cociente (estima, no resuelvas todo):</div><table class="ord-print-tbl"><tr>${g.current.map(v=>`<td>${v}</td>`).join('')}</tr></table><div style="margin-top:0.3rem;font-size:8.5pt;color:#555;">Escribe en orden: 1. _______ &nbsp; 2. _______ &nbsp; 3. _______ &nbsp; 4. _______</div></div>`).join('')}<div class="ord-print-box"><div class="ord-print-dir">3. 🔎 Detective del error:</div><div style="font-size:9pt;line-height:1.35;">${d.retoErr.text}</div><div style="margin-top:0.3rem;font-size:9pt;">Cociente correcto: <span style="display:inline-block;min-width:70px;border-bottom:1.5px solid #111;">&nbsp;</span></div></div><div class="ord-print-box"><div class="ord-print-dir">4. ✨ El punto mágico:</div><div style="font-size:9pt;line-height:1.35;">${d.retoMag.text}</div><div style="margin-top:0.3rem;font-size:9pt;">Resultado: <span style="display:inline-block;min-width:70px;border-bottom:1.5px solid #111;">&nbsp;</span></div></div></div>`;
  let pR = '';
  pR += `<div class="p-sec"><div class="p-ttl">I. ÷ decimal ÷ entero</div><table class="p-tbl">${d.denItems.map((it,i)=>`<tr><td class="pn">${i+1}.</td><td class="pa">${it.ans}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">II. Transforma el divisor</div><table class="p-tbl">${d.trItems.map((it,i)=>`<tr><td class="pn">${i+1}.</td><td class="pa">${it.tDivd}÷${it.tDivr}=${it.ans}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">III. Número que falta</div><table class="p-tbl">${d.mssItems.map((it,i)=>`<tr><td class="pn">${i+1}.</td><td class="pa">${it.ans}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">IV. Problemas</div><table class="p-tbl">${d.prbItems.map((it,i)=>`<tr><td class="pn">${i+1}.</td><td class="pa">${it.op} = ${it.ans} ${it.u}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec" style="grid-column:1/-1;"><div class="p-ttl">V. Retos de olimpiada</div>${d.ord.map((g,gi)=>`<div class="p-ord-line"><strong>${gi+1}.</strong> ${g.correctOrder.join(' · ')}</div>`).join('')}<div class="p-ord-line"><strong>3.</strong> Detective del error: ${d.retoErr.ans}</div><div class="p-ord-line"><strong>4.</strong> El punto mágico: ${d.retoMag.ans}</div></div>`;
  const doc = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Prueba Operativa División de Decimales · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11.5pt;color:#111;background:#fff;padding:4mm 6mm;}.ph{margin-bottom:0.5rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;color:#1565c0;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:#1565c0;margin-top:0.15rem;font-weight:700;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.5rem 0 0.22rem;border-left:4px solid #1565c0;background:#e3f2fd;display:flex;justify-content:space-between;align-items:center;color:#1565c0;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:#1565c0;font-weight:700;font-style:italic;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #1565c0;height:12px;}.qn{font-weight:700;min-width:20px;display:inline-block;color:#1565c0;}.opx-instr{font-size:9pt;color:#555;margin-bottom:0.25rem;}.opx-print-row{display:flex;align-items:baseline;gap:0.4rem;font-size:11pt;padding:0.22rem 0.2rem;border-bottom:1px dotted #ddd;}.opx-print-expr{font-family:'Courier New',monospace;font-weight:700;}.opx-blank{display:inline-block;width:140px;flex:none;border-bottom:1.5px solid #111;min-height:14px;margin-left:0.4rem;}.rnd-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 1rem;margin-top:0.2rem;}.rnd-tbl{width:100%;border-collapse:collapse;font-size:9pt;}.rnd-tbl th,.rnd-tbl td{border:1px solid #bbb;padding:0.15rem 0.35rem;text-align:left;}.rnd-tbl th{background:#e3f2fd;color:#1565c0;font-size:8.5pt;}.tr-blank-cell{color:#888;font-style:italic;}.cmp-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 1rem;margin-top:0.2rem;}.cmp-print-row{display:flex;align-items:center;justify-content:space-between;font-size:10pt;padding:0.18rem 0.1rem;border-bottom:1px dotted #ddd;}.cmp-print-num{font-family:'Courier New',monospace;font-weight:600;flex:1;}.cmp-opts-print{display:flex;gap:0.6rem;font-size:9pt;white-space:nowrap;}.ord-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.8rem;margin-top:0.2rem;}.ord-print-box{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.4rem;break-inside:avoid;}.ord-print-dir{font-size:9pt;font-weight:700;color:#1565c0;margin-bottom:0.2rem;}.ord-print-tbl{width:100%;border-collapse:collapse;font-size:9.5pt;}.ord-print-tbl td{border:1px solid #bbb;padding:0.12rem 0.25rem;text-align:center;font-family:'Courier New',monospace;}.total-row{display:flex;align-items:baseline;justify-content:flex-end;gap:7px;font-size:11pt;color:#1565c0;font-weight:700;font-style:italic;margin-top:0.5rem;padding:0.2rem 0.5rem;background:#e3f2fd;border-radius:4px;}.total-row .obt-line{min-width:80px;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #1565c0;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:9.5pt;font-weight:700;color:#1565c0;}.p-sub{font-size:7pt;color:#c00;font-weight:700;margin:0.08rem 0;}.p-meta{font-size:7pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.9rem;}.p-sec{border:1px solid #cce0ff;border-radius:4px;padding:0.28rem 0.45rem;}.p-ttl{font-size:8pt;font-weight:700;color:#1565c0;border-bottom:1px solid #ddd;padding-bottom:0.1rem;margin-bottom:0.15rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:7.5pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.07rem 0.12rem;vertical-align:top;}.pn{font-weight:700;width:16px;color:#1565c0;}.pa{color:#007a00;font-weight:600;font-family:'Courier New',monospace;}.p-ord-line{font-size:8pt;margin-bottom:0.15rem;color:#007a00;}.forma-tag{position:fixed;bottom:5mm;right:6mm;font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;}@media print{@page{size:letter portrait;margin:8mm 10mm;}}</style></head><body><div class="ph"><h2>Examen de Matemáticas — Prueba Operativa · División de Decimales · Educación Básica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Institución:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 pts · I: 50 · II: 10 · III: 10 · IV: 10 · V: 20 · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div><div class="pauta-wrap"><div class="p-head"><div class="p-main">✔ PAUTA — Prueba Operativa · División de Decimales · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">100 pts · Matemáticas · Educación Básica</div></div><div class="p-grid">${pR}</div></div><div class="forma-tag">Forma ${forma}</div></body></html>`;
  const win = window.open('', '_blank', '');
  if (!win) { showToast('⚠️ Activa las ventanas emergentes para imprimir'); return; }
  win.document.write(doc); win.document.close(); setTimeout(() => win.print(), 400);
}

// ===================== JUEGO: RADAR DE LAS PARTES =====================
const radarPool=[
  {d:'4.5',r:'0.5',c:'9'},{d:'12',r:'4',c:'3'},{d:'1.2',r:'0.4',c:'3'},{d:'15',r:'0.5',c:'30'},
  {d:'0.25',r:'0.05',c:'5'},{d:'7.2',r:'2',c:'3.6'},{d:'30',r:'2.5',c:'12'},{d:'0.8',r:'0.2',c:'4'},
  {d:'5.5',r:'1.1',c:'5'},{d:'2',r:'0.5',c:'4'}
];
const RADAR_ROUNDS=10, radarPartes=['dividendo','divisor','cociente'];
let radarIdx=0,radarHits=0,radarFirstTry=true,radarLocked=false,radarOrder=[],radarTarget='dividendo';

function _casitaHTML(ex,cls){
  return `<div class="casita ${cls||''}">
    <div class="cs-coc"><button class="parte-btn" data-p="cociente" aria-label="número escrito arriba de la casita">${ex.c}</button></div>
    <div class="cs-divisor"><button class="parte-btn" data-p="divisor" aria-label="número escrito afuera de la casita">${ex.r}</button></div>
    <div class="cs-dividendo"><button class="parte-btn" data-p="dividendo" aria-label="número escrito adentro de la casita">${ex.d}</button></div>
  </div>`;
}
function _horizHTML(ex){
  return `<div class="horiz-div">
    <button class="parte-btn" data-p="dividendo">${ex.d}</button><span class="hz-op">÷</span>
    <button class="parte-btn" data-p="divisor">${ex.r}</button><span class="hz-op">=</span>
    <button class="parte-btn" data-p="cociente">${ex.c}</button>
  </div>`;
}
function buildRadar(){
  const stage=document.getElementById('radarStage'); if(!stage) return;
  radarIdx=0; radarHits=0; radarOrder=_shuffle(radarPool.map((_,i)=>i));
  const f=document.getElementById('fbRadar'); if(f) f.classList.remove('show');
  showRadar();
}
function showRadar(){
  const stage=document.getElementById('radarStage'), prompt=document.getElementById('radarPrompt'), score=document.getElementById('radarScore');
  if(!stage) return;
  radarLocked=false; radarFirstTry=true;
  if(radarIdx>=RADAR_ROUNDS){
    prompt.innerHTML='🏁 ¡Juego terminado!';
    stage.innerHTML='<div class="radar-fin">🎯</div>';
    score.textContent=`✅ ${radarHits} de ${RADAR_ROUNDS} al primer toque`;
    fb('fbRadar',`Aciertos al primer toque: ${radarHits} de ${RADAR_ROUNDS}. ${radarHits===RADAR_ROUNDS?'¡Radar perfecto! 🏆':'Toca Reiniciar juego para mejorar tu marca.'}`,radarHits>=6);
    if(radarHits===RADAR_ROUNDS) unlockAchievement('radar_pro');
    sfx('fan'); return;
  }
  const ex=radarPool[radarOrder[radarIdx]];
  const usa=radarIdx%2===1;
  radarTarget=radarPartes[radarIdx%3];
  prompt.innerHTML=`Ronda ${radarIdx+1} de ${RADAR_ROUNDS}: toca el <b class="c-${radarTarget}">${radarTarget.toUpperCase()}</b> en el formato <strong>${usa?'casita (modo USA) 🏠':'horizontal ➡️'}</strong>`;
  stage.innerHTML=usa?_casitaHTML(ex,'casita-play'):_horizHTML(ex);
  stage.querySelectorAll('.parte-btn').forEach(b=>{ b.onclick=()=>ansRadar(b); });
  score.textContent=`✅ ${radarHits} aciertos al primer toque`;
}
function ansRadar(btn){
  if(radarLocked) return;
  if(btn.dataset.p===radarTarget){
    radarLocked=true; btn.classList.add('rd-ok'); sfx('ok');
    let msg='¡Correcto!';
    if(radarFirstTry){ radarHits++; if(!xpTracker.partes.has(radarIdx)){ xpTracker.partes.add(radarIdx); pts(2); msg='¡Correcto al primer toque! +2 XP'; } }
    fb('fbRadar',msg,true);
    setTimeout(()=>{ radarIdx++; const f=document.getElementById('fbRadar'); if(f) f.classList.remove('show'); showRadar(); },1100);
  } else {
    radarFirstTry=false; btn.classList.add('rd-no'); sfx('no');
    fb('fbRadar',`Ese es el ${btn.dataset.p}. Busca el ${radarTarget}.`,false);
    setTimeout(()=>btn.classList.remove('rd-no'),700);
  }
}
function resetRadar(){ sfx('click'); buildRadar(); }

// ===================== JUEGO: CONSTRUYE LA CASITA =====================
const buildPool=[
  {d:'45',r:'5',c:'9'},{d:'1.2',r:'0.4',c:'3'},{d:'30',r:'5',c:'6'},{d:'0.25',r:'0.05',c:'5'},{d:'18',r:'0.6',c:'30'}
];
let buildIdx=0, buildSel=null, buildPlaced={cociente:null,divisor:null,dividendo:null}, buildChecked=false, buildBankOrder=[];
function showBuild(){
  const prog=document.getElementById('buildProg'); if(!prog) return;
  const ex=buildPool[buildIdx];
  buildSel=null; buildChecked=false; buildPlaced={cociente:null,divisor:null,dividendo:null};
  buildBankOrder=_shuffle([ex.d,ex.r,ex.c]);
  prog.textContent=`Casita ${buildIdx+1} de ${buildPool.length}`;
  document.getElementById('buildHoriz').innerHTML=`División horizontal: <span class="build-horiz-op">${ex.d} ÷ ${ex.r} = ${ex.c}</span>`;
  document.getElementById('fbBuild').classList.remove('show');
  renderBuild();
}
function renderBuild(){
  const bank=document.getElementById('buildBank'), stage=document.getElementById('buildStage');
  if(!bank||!stage) return;
  const placed=Object.values(buildPlaced);
  bank.innerHTML='';
  buildBankOrder.forEach(v=>{
    if(placed.includes(v)) return;
    const b=document.createElement('button');
    b.className='build-chip'+(buildSel===v?' sel':''); b.textContent=v;
    b.onclick=()=>{ if(buildChecked) return; buildSel=(buildSel===v?null:v); sfx('click'); renderBuild(); };
    bank.appendChild(b);
  });
  if(!bank.children.length) bank.innerHTML='<span class="build-bank-empty">✔ Números colocados. ¡Presiona Verificar!</span>';
  const slot=(key,hint)=>`<button class="build-slot${buildPlaced[key]!==null?' filled':''}" data-slot="${key}" aria-label="${hint}">${buildPlaced[key]!==null?buildPlaced[key]:'?'}</button>`;
  stage.innerHTML=`<div class="casita casita-build">
    <div class="cs-coc">${slot('cociente','casilla de arriba de la casita')}</div>
    <div class="cs-divisor">${slot('divisor','casilla de afuera de la casita')}</div>
    <div class="cs-dividendo">${slot('dividendo','casilla de adentro de la casita')}</div>
  </div>`;
  stage.querySelectorAll('.build-slot').forEach(s=>{
    s.onclick=()=>{
      if(buildChecked) return;
      const key=s.dataset.slot;
      if(buildSel!==null){ buildPlaced[key]=buildSel; buildSel=null; sfx('click'); }
      else if(buildPlaced[key]!==null){ buildPlaced[key]=null; sfx('click'); }
      renderBuild();
    };
  });
}
function checkBuild(){
  const ex=buildPool[buildIdx];
  if(Object.values(buildPlaced).some(v=>v===null)){ fb('fbBuild','Coloca los tres números en la casita primero.',false); return; }
  const okMap={cociente:ex.c,divisor:ex.r,dividendo:ex.d};
  let all=true;
  document.querySelectorAll('#buildStage .build-slot').forEach(s=>{
    const ok=buildPlaced[s.dataset.slot]===okMap[s.dataset.slot];
    s.classList.add(ok?'slot-ok':'slot-no'); if(!ok) all=false;
  });
  if(all){
    buildChecked=true;
    if(!xpTracker.casita.has(buildIdx)){ xpTracker.casita.add(buildIdx); pts(3); }
    fb('fbBuild','¡Casita perfecta! Dividendo adentro, divisor afuera y cociente arriba. +3 XP',true); sfx('fan');
    if(xpTracker.casita.size===buildPool.length){ fin('s-widgets'); unlockAchievement('casita_pro'); }
  } else {
    fb('fbBuild','Hay números mal ubicados (en rojo). Tócalos para devolverlos e intenta de nuevo.',false); sfx('no');
    setTimeout(()=>document.querySelectorAll('#buildStage .slot-no').forEach(s=>s.classList.remove('slot-no')),1200);
  }
}
function nextBuild(){ sfx('click'); buildIdx=(buildIdx+1)%buildPool.length; showBuild(); }
function resetBuild(){ sfx('click'); showBuild(); }

// ===================== JUEGO: MEMORIA DE LA DIVISIÓN =====================
const memoPairs=[
  {id:'dividendo',t:'Dividendo',d:'📦 Lo que se reparte · va adentro de la casita'},
  {id:'divisor',t:'Divisor',d:'✂️ En cuántas partes · va afuera de la casita'},
  {id:'cociente',t:'Cociente',d:'🏆 El resultado · va arriba de la casita'},
  {id:'punto',t:'Punto decimal',d:'➡️ Se mueve igual en dividendo y divisor'}
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
  const msgs=['💡 ¡ÁNIMO! Comienza tu misión. ¡Cada paso cuenta!','🌱 ¡GRAN INICIO! Estás dando los primeros pasos.','📐 ¡BUEN TRABAJO! Vas progresando muy bien.','💪 ¡MUY BIEN! Dominas gran parte del contenido.','🏅 ¡INCREÍBLE avance! Estás cerca de la excelencia.','🎓 ¡EXTRAORDINARIO! Completaste TODA la misión. ¡Eres experto en División de Decimales!'];
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
  const txt=`${stars} CONSTANCIA DE LOGRO ${stars}\n\n📚 Misión: División de Decimales\n👤 Estudiante: ${name}\n📊 Progreso: ${pct}% completado\n⭐ XP obtenido: ${xp} de ${MXP}${achText?'\n\n🏆 Logros desbloqueados:\n'+achText:''}\n\n${msg}\n\n📅 ${date}\n🏠 Proyecto Educativo M.E.T.A.S\n🌐 policastsapien.com`;
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
  buildEquiv();
  buildPredice();
  buildExplica();
  buildRadar();
  showBuild();
  buildMemo();
  document.addEventListener('click',function(e){ const panel=document.getElementById('achPanel'); const btn=document.getElementById('achBtn'); if(panel.classList.contains('open')&&!panel.contains(e.target)&&e.target!==btn) panel.classList.remove('open'); });
  document.addEventListener('click',function(e){ if(e.target===document.getElementById('diplomaOverlay')) closeDiploma(); });
  const savedName=localStorage.getItem('nombreEstudianteDivDecimales');
  const inputName=document.querySelector('.diploma-input');
  if(savedName&&inputName){ inputName.value=savedName; updateDiplomaName(savedName); }
  if(inputName) inputName.addEventListener('input',e=>localStorage.setItem('nombreEstudianteDivDecimales',e.target.value));
  fin('s-aprende',false);
  fin('s-tipos',false);
  fin('s-errores',false);
});
// Formas deterministas v1: selectores de forma visibles desde la carga de la página
(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalOp==='function') _injectFormaSel('genEvalOp','evalOpFormaSel',evalOpFormNum,function(v){evalOpFormNum=v;}); }catch(e){} try{ if(typeof genEvalCrit==='function') _injectFormaSel('genEvalCrit','evalCritFormaSel',evalCritFormNum,function(v){evalCritFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();
