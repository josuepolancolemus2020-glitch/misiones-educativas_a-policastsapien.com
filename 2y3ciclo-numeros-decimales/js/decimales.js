// ===================== ACCESIBILIDAD =====================
function toggleLetra() {
  document.body.classList.toggle('letra-grande');
  if(typeof sfx === 'function') sfx('click');
  localStorage.setItem('preferenciaLetraDecimales', document.body.classList.contains('letra-grande'));
}
window.addEventListener('DOMContentLoaded', () => {
  if(localStorage.getItem('preferenciaLetraDecimales') === 'true') document.body.classList.add('letra-grande');
});

// ===================== UTILIDADES =====================
const _pick = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
const _shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
function fb(id, msg, isOk) {
  const el = document.getElementById(id);
  if(el) { el.textContent = msg; el.className = 'fb show ' + (isOk ? 'ok' : 'err'); }
}

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY = 'matematica_decimales_v1';
let xp = 0, MXP = 200, done = new Set(), evalAnsVisible = false;
let evalFormNum = 1, unlockedAch = [], darkMode = false, prevLevel = 0;
const TOTAL_SECTIONS = 12;
const xpTracker = { fc: new Set(), qz: new Set(), cls: new Set(), id: new Set(), cmp: new Set(), reto: new Set(), sopa: new Set() };

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
  try{ localStorage.setItem(SAVE_KEY, JSON.stringify({doneSections:Array.from(done), unlockedAch, evalFormNum, xp})); }catch(e){}
}
function loadProgress(){
  try{
    const s=JSON.parse(localStorage.getItem(SAVE_KEY));
    if(!s) return;
    if(s.doneSections&&Array.isArray(s.doneSections)) s.doneSections.forEach(id=>{ done.add(id); const b=document.querySelector(`[data-s="${id}"]`); if(b) b.classList.add('done'); });
    if(s.unlockedAch&&Array.isArray(s.unlockedAch)) unlockedAch=s.unlockedAch.filter(id=>ACHIEVEMENTS[id]!==undefined);
    if(s.evalFormNum) evalFormNum=s.evalFormNum;
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
function launchConfetti(){ const colors=['#1976d2','#f57c00','#00b894','#fdcb6e','#6c5ce7']; for(let i=0;i<60;i++){ const c=document.createElement('div'); c.className='confetti-piece'; c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`; document.body.appendChild(c); c.addEventListener('animationend',()=>c.remove()); } }

// ===================== XP =====================
const lvls=[{t:0,n:'Novato ✏️'},{t:25,n:'Aprendiz 📐'},{t:55,n:'Explorador 🔭'},{t:90,n:'Detective 🔍'},{t:130,n:'Experto 📊'},{t:165,n:'Campeón 🔥'},{t:190,n:'Maestro 🎓'}];
function pts(n){ xp=Math.max(0,Math.min(MXP,xp+n)); updateXPBar(); saveProgress(); }
function updateXPBar(){ const pct=Math.round((xp/MXP)*100); document.getElementById('xpFill').style.width=pct+'%'; const el=document.getElementById('xpPts'); el.textContent='⭐ '+xp; el.style.transform='scale(1.3)'; setTimeout(()=>el.style.transform='',300); let lv=0; for(let i=0;i<lvls.length;i++) if(xp>=lvls[i].t) lv=i; document.getElementById('xpLvl').textContent=lvls[lv].n; if(lv!==prevLevel){ if(lv>=2) unlockAchievement('nivel3'); if(lv>=5) unlockAchievement('nivel5'); prevLevel=lv; } }
function resetXP(){ sfx('click'); xp=0; updateXPBar(); showToast('🔄 XP reiniciado a 0'); }
function fin(id,showFX=true){ if(!done.has(id)){ done.add(id); const b=document.querySelector(`[data-s="${id}"]`); if(b) b.classList.add('done'); if(showFX){ sfx('up'); launchConfetti(); } saveProgress(); } }
function getProgress(){ return Math.round((done.size/TOTAL_SECTIONS)*100); }

// ===================== NAV =====================
function go(id){ sfx('click'); document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active')); document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{ b.classList.remove('active'); b.setAttribute('aria-selected','false'); }); document.getElementById(id).classList.add('active'); const btn=document.querySelector(`[data-s="${id}"]`); if(btn){ btn.classList.add('active'); btn.setAttribute('aria-selected','true'); } window.scrollTo({top:0,behavior:'smooth'}); if(id==='s-sopa') setTimeout(buildSopa,50); }

// ===================== FLASHCARD DATA =====================
const fcData=[
  {w:'Número Decimal',a:'Número con <strong>parte entera</strong> y <strong>parte decimal</strong> separadas por un punto (.). Ejemplo: 3.75, 0.5, 12.008'},
  {w:'Punto Decimal (.)',a:'Símbolo que en Honduras separa la parte entera de la decimal. Ejemplo: 4<strong>.</strong>5 — el punto está entre el 4 y el 5.'},
  {w:'Décimas',a:'<strong>1.er lugar</strong> después del punto decimal. Vale <strong>1/10</strong>. En 2.7, el 7 está en las décimas (= 7/10).'},
  {w:'Centésimas',a:'<strong>2.o lugar</strong> después del punto decimal. Vale <strong>1/100</strong>. En 3.48, el 8 está en las centésimas (= 8/100).'},
  {w:'Milésimas',a:'<strong>3.er lugar</strong> después del punto decimal. Vale <strong>1/1,000</strong>. En 5.237, el 7 está en las milésimas.'},
  {w:'Diezmilésimas',a:'<strong>4.o lugar</strong> después del punto decimal. Vale <strong>1/10,000</strong>. En 0.4561, el 1 está en las diezmilésimas.'},
  {w:'Valor Posicional',a:'El valor de un dígito según su posición. En 4.35: 4 = enteros, 3 = décimas, 5 = centésimas.'},
  {w:'Redondear',a:'Aproximar a un lugar específico. Si el dígito siguiente es <strong>≥ 5</strong>, se suma 1; si es < 5, queda igual. Ej: 3.67 → 3.7'},
  {w:'Comparar Decimales',a:'Se compara dígito a dígito desde la izquierda. Ejemplo: 0.8 > 0.75 porque en las décimas 8 > 7.'},
  {w:'Suma de Decimales',a:'Se <strong>alinean los puntos</strong> decimales en columna y se opera como enteros. Ejemplo: 2.5 + 1.35 = 3.85'},
  {w:'Resta de Decimales',a:'Se <strong>alinean los puntos</strong> decimales y se restan. Se pueden agregar ceros. Ejemplo: 5.0 − 2.35 = 2.65'},
  {w:'Multiplicación Decimal',a:'Se multiplica sin punto; luego se cuenta la cantidad total de decimales de ambos factores. Ej: 0.3 × 0.2 = 0.06'},
  {w:'División Decimal',a:'Al dividir por 10, 100, 1,000..., el punto se mueve a la <strong>izquierda</strong>. Al multiplicar, se mueve a la <strong>derecha</strong>.'},
  {w:'Fracción Decimal',a:'Fracción con denominador 10, 100, 1,000... Equivalencias: <strong>1/2=0.5 · 1/4=0.25 · 3/4=0.75 · 1/10=0.1</strong>'},
  {w:'Truncar',a:'Eliminar dígitos sin redondear. Ejemplo: 3.789 truncado a centésimas = <strong>3.78</strong> (no se redondea el 8).'},
];
let fcIdx=0;
function upFC(){ document.getElementById('fcInner').classList.remove('flipped'); document.getElementById('fcW').textContent=fcData[fcIdx].w; document.getElementById('fcA').innerHTML=fcData[fcIdx].a; document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length; }
function flipCard(){ sfx('flip'); document.getElementById('fcInner').classList.toggle('flipped'); if(!xpTracker.fc.has(fcIdx)){ xpTracker.fc.add(fcIdx); pts(1); } if(xpTracker.fc.size===fcData.length){ fin('s-flash'); unlockAchievement('flash_master'); } }
function nextFC(){ sfx('click'); fcIdx=(fcIdx+1)%fcData.length; upFC(); }
function prevFC(){ sfx('click'); fcIdx=(fcIdx-1+fcData.length)%fcData.length; upFC(); }

// ===================== QUIZ DATA =====================
const qzData=[
  {q:'¿Qué símbolo se usa en Honduras para separar la parte entera de la decimal?',o:['a) La coma (,)','b) El punto (.)','c) El guion (-)','d) La barra (/)'],c:1},
  {q:'¿Cuál es el valor posicional del dígito 5 en 0.05?',o:['a) Décimas','b) Unidades','c) Centésimas','d) Milésimas'],c:2},
  {q:'¿Cómo se lee correctamente el número 3.7?',o:['a) Treinta y siete','b) Tres coma siete','c) Tres enteros siete décimas','d) Tres punto siete centésimas'],c:2},
  {q:'¿Cuál de estos números es el mayor?',o:['a) 0.75','b) 0.8','c) 0.079','d) 0.7'],c:1},
  {q:'Al redondear 4.56 a la décima más cercana, ¿cuál es el resultado?',o:['a) 4.5','b) 5.0','c) 4.6','d) 4.55'],c:2},
  {q:'¿Cuánto es 1.5 + 2.35?',o:['a) 3.80','b) 3.85','c) 3.90','d) 4.85'],c:1},
  {q:'En el número 7.843, ¿qué dígito está en las milésimas?',o:['a) 7','b) 8','c) 4','d) 3'],c:3},
  {q:'¿Cuál es la fracción equivalente a 0.25?',o:['a) 2/5','b) 1/4','c) 1/2','d) 25/10'],c:1},
  {q:'¿Cuánto es 5.0 − 2.35?',o:['a) 3.65','b) 2.75','c) 2.65','d) 3.75'],c:2},
  {q:'¿Cómo se expresa la fracción 7/10 como número decimal?',o:['a) 7.0','b) 0.07','c) 0.70','d) 70.0'],c:2},
  {q:'Al multiplicar 0.3 × 0.2, ¿cuál es el resultado?',o:['a) 0.6','b) 0.06','c) 6.0','d) 0.006'],c:1},
  {q:'¿Cuánto es 4.5 × 10?',o:['a) 4.50','b) 45.0','c) 0.45','d) 450'],c:1},
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
  if(qzSel===qzData[qzIdx].c){ opts[qzSel].classList.add('correct'); fb('fbQz','¡Correcto! +5 XP',true); if(!xpTracker.qz.has(qzIdx)){ xpTracker.qz.add(qzIdx); pts(5); } sfx('ok'); }
  else{ opts[qzSel].classList.add('wrong'); opts[qzData[qzIdx].c].classList.add('correct'); fb('fbQz','Incorrecto. Revisa la respuesta correcta.',false); sfx('no'); }
  setTimeout(()=>{ qzIdx++; qzSel=-1; showQz(); },1600);
}
function resetQz(){ sfx('click'); qzIdx=0; qzSel=-1; qzDone=false; showQz(); document.getElementById('fbQz').classList.remove('show'); }

// ===================== CLASIFICACIÓN =====================
const classGroups=[
  {
    label:['Décimas','Centésimas'], headA:'🔵 Décimas (1/10)', headB:'🟠 Centésimas (1/100)', colA:'decimas', colB:'centesimas',
    words:[{w:'0.3',t:'decimas'},{w:'0.07',t:'centesimas'},{w:'0.1',t:'decimas'},{w:'0.04',t:'centesimas'},{w:'0.9',t:'decimas'},{w:'0.02',t:'centesimas'},{w:'1/10',t:'decimas'},{w:'7/100',t:'centesimas'},{w:'0.5',t:'decimas'},{w:'0.08',t:'centesimas'}]
  },
  {
    label:['Mayor que 1','Menor que 1'], headA:'⬆️ Mayor que 1', headB:'⬇️ Menor que 1', colA:'mayor', colB:'menor',
    words:[{w:'1.5',t:'mayor'},{w:'0.9',t:'menor'},{w:'3.14',t:'mayor'},{w:'0.5',t:'menor'},{w:'10.2',t:'mayor'},{w:'0.01',t:'menor'},{w:'1.001',t:'mayor'},{w:'0.999',t:'menor'},{w:'2.0',t:'mayor'},{w:'0.75',t:'menor'}]
  },
  {
    label:['Suma','Resta'], headA:'➕ Suma', headB:'➖ Resta', colA:'suma', colB:'resta',
    words:[{w:'1.2 + 0.8',t:'suma'},{w:'5.0 − 2.3',t:'resta'},{w:'3.5 + 1.5',t:'suma'},{w:'4.7 − 0.2',t:'resta'},{w:'0.6 + 0.4',t:'suma'},{w:'9.9 − 1.1',t:'resta'},{w:'2.1 + 3.9',t:'suma'},{w:'7.5 − 3.25',t:'resta'},{w:'0.5 + 0.5',t:'suma'},{w:'6.0 − 4.5',t:'resta'}]
  },
  {
    label:['Frac. → Decimal','Decimal → Frac.'], headA:'🔢 Frac. a Decimal', headB:'🔣 Decimal a Frac.', colA:'ftod', colB:'dtof',
    words:[{w:'1/2 = 0.5',t:'ftod'},{w:'0.25 = 1/4',t:'dtof'},{w:'3/4 = 0.75',t:'ftod'},{w:'0.1 = 1/10',t:'dtof'},{w:'1/5 = 0.2',t:'ftod'},{w:'0.5 = 1/2',t:'dtof'},{w:'2/5 = 0.4',t:'ftod'},{w:'0.75 = 3/4',t:'dtof'},{w:'1/10 = 0.1',t:'ftod'},{w:'0.2 = 1/5',t:'dtof'}]
  },
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
  _shuffle([...group.words]).forEach(w=>{
    const el=document.createElement('div'); el.className='wb-item'; el.textContent=w.w; el.dataset.t=w.t;
    el.onclick=()=>{ document.querySelectorAll('.wb-item').forEach(i=>i.classList.remove('sel-word')); el.classList.add('sel-word'); clsSelectedWord=el; sfx('click'); };
    bank.appendChild(el);
  });
  ['col-left','col-right'].forEach(colId=>{
    const col=document.getElementById(colId);
    col.onclick=(e)=>{
      if(!clsSelectedWord||e.target.classList.contains('drop-item')) return;
      const targetId=colId==='col-left'?'items-left':'items-right';
      const wordsCol=document.getElementById(targetId);
      const item=document.createElement('div'); item.className='drop-item';
      item.textContent=clsSelectedWord.textContent; item.dataset.t=clsSelectedWord.dataset.t;
      const original=clsSelectedWord;
      item.onclick=(ev)=>{ ev.stopPropagation(); if(clsSelectedWord!==null){ col.click(); } else{ document.getElementById('clsBank').appendChild(original); original.classList.remove('sel-word'); item.remove(); sfx('click'); } };
      wordsCol.appendChild(item); clsSelectedWord.remove(); clsSelectedWord=null; sfx('click');
    };
  });
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
  {s:['El','punto','separa','la','parte','entera','del','decimal.'],c:1,art:'Símbolo separador decimal (.)'},
  {s:['Las','décimas','están','en','el','primer','lugar','decimal.'],c:1,art:'Primer lugar decimal (1/10)'},
  {s:['En','0.05','el','5','está','en','centésimas.'],c:3,art:'Posición centésimas (2.o lugar)'},
  {s:['El','número','3.7','tiene','7','décimas.'],c:4,art:'Cifra en décimas'},
  {s:['Para','redondear','necesitas','el','dígito','siguiente.'],c:1,art:'Proceso de redondeo'},
  {s:['Las','milésimas','están','en','el','tercer','lugar','decimal.'],c:1,art:'Tercer lugar decimal (1/1,000)'},
  {s:['La','fracción','0.25','equivale','a','un','cuarto.'],c:2,art:'Decimal equivalente a 1/4'},
  {s:['Alinea','el','punto','para','sumar','decimales.'],c:2,art:'Regla clave para suma decimal'},
  {s:['0.5','es','mayor','que','0.49.'],c:0,art:'Comparación: 0.5 > 0.49'},
  {s:['Las','centésimas','valen','menos','que','las','décimas.'],c:1,art:'Valor comparativo de posiciones'},
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
  {s:'En Honduras, el ___ separa los enteros de los decimales.',opts:['coma','punto','guion'],c:1},
  {s:'El primer lugar después del punto decimal son las ___.',opts:['centésimas','milésimas','décimas'],c:2},
  {s:'Para sumar decimales, se alinean los ___ decimales.',opts:['ceros','puntos','enteros'],c:1},
  {s:'Al redondear 2.75 a la décima más cercana, el resultado es ___.',opts:['2.7','2.8','2.9'],c:1},
  {s:'El número 0.06 tiene 6 en las ___.',opts:['décimas','milésimas','centésimas'],c:2},
  {s:'La fracción 3/4 como decimal es ___.',opts:['0.34','0.75','0.43'],c:1},
  {s:'Al multiplicar por 10, el punto decimal se mueve a la ___.',opts:['izquierda','arriba','derecha'],c:2},
  {s:'El número 0.5 equivale a la fracción ___.',opts:['1/4','1/5','1/2'],c:2},
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

// ===================== RETO FINAL =====================
const retoPairs=[
  {
    label:['Décimas','Centésimas'], btnA:'🔵 Décimas', btnB:'🟠 Centésimas', colA:'decimas', colB:'centesimas',
    words:[{w:'0.3',t:'decimas'},{w:'0.07',t:'centesimas'},{w:'0.1',t:'decimas'},{w:'0.04',t:'centesimas'},{w:'0.9',t:'decimas'},{w:'0.02',t:'centesimas'},{w:'7/10',t:'decimas'},{w:'5/100',t:'centesimas'},{w:'0.6',t:'decimas'},{w:'0.09',t:'centesimas'},{w:'0.8',t:'decimas'},{w:'0.03',t:'centesimas'}]
  },
  {
    label:['Mayor que 1','Menor que 1'], btnA:'⬆️ Mayor 1', btnB:'⬇️ Menor 1', colA:'mayor', colB:'menor',
    words:[{w:'1.5',t:'mayor'},{w:'0.9',t:'menor'},{w:'3.14',t:'mayor'},{w:'0.001',t:'menor'},{w:'2.7',t:'mayor'},{w:'0.5',t:'menor'},{w:'10.01',t:'mayor'},{w:'0.999',t:'menor'},{w:'1.001',t:'mayor'},{w:'0.1',t:'menor'}]
  },
];
let currentRetoPairIdx=0, retoPool=[], retoOk=0, retoErr=0, retoTimerInt=null, retoSec=30, retoRunning=false, retoCurrent=null;
function updateRetoButtons(){ const pair=retoPairs[currentRetoPairIdx]; document.querySelectorAll('.reto-btns .btn')[0].textContent=pair.btnA; document.querySelectorAll('.reto-btns .btn')[1].textContent=pair.btnB; document.querySelectorAll('.reto-btns .btn')[0].onclick=()=>ansReto(pair.colA); document.querySelectorAll('.reto-btns .btn')[1].onclick=()=>ansReto(pair.colB); }
function startReto(){ if(retoRunning)return; sfx('click'); retoRunning=true; retoOk=0; retoErr=0; retoSec=30; retoPool=_shuffle([...retoPairs[currentRetoPairIdx].words,...retoPairs[currentRetoPairIdx].words]); showRetoWord(); retoTimerInt=setInterval(()=>{ retoSec--; sfx('tick'); document.getElementById('retoTimer').textContent='⏱ '+retoSec; if(retoSec<=10) document.getElementById('retoTimer').style.color='var(--red)'; if(retoSec<=0){ clearInterval(retoTimerInt); endReto(); } },1000); }
function showRetoWord(){ if(retoPool.length===0) retoPool=_shuffle([...retoPairs[currentRetoPairIdx].words,...retoPairs[currentRetoPairIdx].words]); retoCurrent=retoPool.pop(); document.getElementById('retoWord').textContent=retoCurrent.w; }
function ansReto(t){ if(!retoRunning||!retoCurrent)return; const firstPlay=!xpTracker.reto.has(currentRetoPairIdx); if(t===retoCurrent.t){ sfx('ok'); retoOk++; if(firstPlay) pts(1); } else{ sfx('no'); retoErr++; if(firstPlay) pts(-1); } document.getElementById('retoScore').textContent=`✔ ${retoOk} correctas | ✗ ${retoErr} errores`; showRetoWord(); }
function endReto(){ retoRunning=false; document.getElementById('retoWord').textContent='🏁 ¡Tiempo!'; document.getElementById('retoTimer').style.color='var(--pri)'; xpTracker.reto.add(currentRetoPairIdx); const total=retoOk+retoErr; const pct=total>0?Math.round((retoOk/total)*100):0; fb('fbReto',`Resultado: ${retoOk}/${total} (${pct}%) ¡Bien hecho!`,true); fin('s-reto'); sfx('fan'); unlockAchievement('reto_hero'); }
function nextRetoPair(){ sfx('click'); clearInterval(retoTimerInt); retoRunning=false; retoSec=30; retoOk=0; retoErr=0; currentRetoPairIdx=(currentRetoPairIdx+1)%retoPairs.length; updateRetoButtons(); document.getElementById('retoTimer').textContent='⏱ 30'; document.getElementById('retoTimer').style.color='var(--pri)'; document.getElementById('retoWord').textContent='¡Prepárate!'; document.getElementById('retoScore').textContent='✔ 0 correctas | ✗ 0 errores'; document.getElementById('fbReto').classList.remove('show'); showToast(`🔄 Pareja: ${retoPairs[currentRetoPairIdx].label[0]} vs ${retoPairs[currentRetoPairIdx].label[1]}`); }
function resetReto(){ sfx('click'); clearInterval(retoTimerInt); retoRunning=false; retoSec=30; retoOk=0; retoErr=0; document.getElementById('retoTimer').textContent='⏱ 30'; document.getElementById('retoTimer').style.color='var(--pri)'; document.getElementById('retoWord').textContent='¡Prepárate!'; document.getElementById('retoScore').textContent='✔ 0 correctas | ✗ 0 errores'; document.getElementById('fbReto').classList.remove('show'); }

// ===================== GENERADOR DE TAREAS =====================
const identifyTaskDB=[
  {s:'El número 4.25 tiene una parte entera y una parte decimal.',type:'Número decimal (entero: 4, decimal: .25)'},
  {s:'En 0.375, el dígito 5 está en el lugar de las milésimas.',type:'Valor posicional: milésimas (3.er lugar)'},
  {s:'Alineamos los puntos decimales antes de sumar 1.5 + 2.35.',type:'Regla de suma de decimales'},
  {s:'0.50 y 0.5 representan exactamente el mismo valor.',type:'Equivalencia de decimales'},
  {s:'Al redondear 3.76 a la décima, el resultado es 3.8.',type:'Redondeo a la décima'},
  {s:'La fracción 1/4 equivale al decimal 0.25.',type:'Fracción-decimal equivalente'},
  {s:'El dígito 6 en 0.068 está en las centésimas.',type:'Valor posicional: centésimas'},
  {s:'Para multiplicar 0.4 × 0.3, el resultado tiene 2 decimales.',type:'Regla de multiplicación decimal'},
  {s:'En Honduras se usa el punto (.) como separador decimal.',type:'Convención decimal en Honduras'},
  {s:'0.9 es mayor que 0.89 aunque tenga menos dígitos.',type:'Comparación de decimales'},
];
const classifyTaskDB=[
  {w:'0.3',pos:'Décimas',val:'3 décimas = 3/10',equiv:'1 lugar decimal'},
  {w:'0.07',pos:'Centésimas',val:'7 centésimas = 7/100',equiv:'2 lugares decimales'},
  {w:'0.005',pos:'Milésimas',val:'5 milésimas = 5/1,000',equiv:'3 lugares decimales'},
  {w:'1.25',pos:'Parte entera: 1; decimal: 25 centésimas',val:'1 + 25/100',equiv:'2 decimales'},
  {w:'3.750',pos:'Parte entera: 3; decimal: 75 centésimas',val:'3 + 75/100',equiv:'equivale a 3.75'},
  {w:'4.039',pos:'Milésimas: 9',val:'4 + 3/100 + 9/1,000',equiv:'3 decimales'},
  {w:'0.100',pos:'1 décima',val:'= 0.1',equiv:'todos equivalen'},
  {w:'2.50',pos:'Centésimas: 0',val:'= 2.5',equiv:'equivalente'},
];
const completeTaskDB=[
  {s:'El segundo lugar después del punto decimal son las ___ .',opts:['décimas','centésimas','milésimas'],ans:'centésimas'},
  {s:'0.75 en fracción es ___.',opts:['7/5','3/4','75/10'],ans:'3/4'},
  {s:'Al redondear 5.45 a la décima: ___.',opts:['5.4','5.5','6.0'],ans:'5.5'},
  {s:'El resultado de 3.2 + 1.8 es ___.',opts:['4.0','5.0','4.10'],ans:'5.0'},
  {s:'0.5 × 10 = ___.',opts:['0.05','5.0','50'],ans:'5.0'},
  {s:'El número 0.030 es igual a ___.',opts:['0.3','0.03','3.0'],ans:'0.03'},
  {s:'Las décimas valen ___ que las centésimas.',opts:['menos','igual','más'],ans:'más'},
  {s:'La fracción 1/2 como decimal es ___.',opts:['0.2','0.5','5.0'],ans:'0.5'},
];
const explainQuestions=[
  {q:'¿Qué es un número decimal y cómo se escribe en Honduras? Da dos ejemplos.',ans:'Es un número con parte entera y parte decimal separadas por punto (.). Ejemplo: 3.75, 0.5'},
  {q:'Explica la diferencia entre décimas, centésimas y milésimas con ejemplos.',ans:'Décimas=1/10 (0.1), Centésimas=1/100 (0.07), Milésimas=1/1,000 (0.003).'},
  {q:'¿Cómo se redondea un decimal? Explica el proceso y da un ejemplo.',ans:'Se mira el dígito siguiente al lugar deseado: si ≥5 se suma 1; si <5 queda igual. Ej: 3.76 → 3.8'},
  {q:'¿Cómo se suman y restan números decimales? ¿Por qué es importante alinear el punto?',ans:'Se alinean los puntos decimales en columna para que los valores posicionales queden correctos, luego se opera normalmente.'},
  {q:'¿Por qué 0.5 es mayor que 0.49? Explica usando el valor posicional.',ans:'Comparamos décima por décima: 0.5 tiene 5 décimas y 0.49 tiene 4 décimas. Como 5 > 4, entonces 0.5 > 0.49.'},
];
let ansVisible=false;
function genTask(){ sfx('click'); const type=document.getElementById('tgType').value; const count=parseInt(document.getElementById('tgCount').value); ansVisible=false; const out=document.getElementById('tgOut'); out.innerHTML=''; if(type==='identify') genIdentifyTask(out,count); else if(type==='classify') genClassifyTask(out,count); else if(type==='complete') genCompleteTask(out,count); else if(type==='explain') genExplainTask(out,count); fin('s-tareas'); }
function _instrBlock(out,title,lines){ const ib=document.createElement('div'); ib.className='tg-instruction-block'; ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join(''); out.appendChild(ib); }
function genIdentifyTask(out,count){ _instrBlock(out,'Instrucción',['Copia en tu cuaderno; subraya, colorea o encierra el concepto matemático indicado en cada oración. Escribe al lado qué tipo de elemento es.','<strong>Ejemplo:</strong> El punto separa los enteros. → <span style="color:var(--jade);font-weight:700;">Símbolo separador decimal</span>']); _pick(identifyTaskDB,Math.min(count,identifyTaskDB.length)).forEach((item,i)=>{ const div=document.createElement('div'); div.className='tg-task'; div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✔ ${item.type}</div></div>`; out.appendChild(div); }); }
function genClassifyTask(out,count){ _instrBlock(out,'Instrucción',['Copia la tabla en tu cuaderno. Para cada número decimal, escribe su posición, valor, equivalencia y cantidad de lugares decimales.']); const items=_pick(classifyTaskDB,Math.min(count,classifyTaskDB.length)); const wrap=document.createElement('div'); wrap.style.overflowX='auto'; const th=(t,extra='')=>`<th style="padding:0.3rem 0.4rem;border:1px solid var(--border);font-size:0.72rem;text-align:center;${extra}">${t}</th>`; let html=`<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:480px;"><thead><tr style="background:var(--pri-gl);">${th('Número','text-align:left;')}${th('Posición')}${th('Valor')}${th('Equiv.')}${th('Lugares')}</tr></thead><tbody>`; items.forEach(it=>{ html+=`<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td>`+Array(4).fill(`<td style="padding:0.4rem;border:1px solid var(--border);min-width:50px;"></td>`).join('')+'</tr>'; }); html+='</tbody></table>'; wrap.innerHTML=html; out.appendChild(wrap); const ans=document.createElement('div'); ans.className='tg-answer'; ans.style.marginTop='0.8rem'; ans.innerHTML='<strong>✔ Respuestas:</strong><br>'+items.map(it=>`<strong>${it.w}:</strong> Posición: ${it.pos} | Valor: ${it.val} | Equiv.: ${it.equiv}`).join('<br>'); out.appendChild(ans); }
function genCompleteTask(out,count){ _instrBlock(out,'Instrucción',['Copia y resuelve en tu cuaderno. Cada oración tiene un espacio ___. Elige y escribe la opción correcta.']); const pool=_shuffle([...completeTaskDB]); for(let i=0;i<count;i++){ const item=pool[i%pool.length]; const div=document.createElement('div'); div.className='tg-task'; const sent=item.s.replace('___','<span class="tg-blank" style="min-width:90px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>'); div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${sent}</strong><div style="margin-top:0.4rem;font-size:0.82rem;color:var(--gray);">💡 Opciones: <strong>${item.opts.join(' | ')}</strong></div><div class="tg-answer">✔ ${item.ans}</div></div>`; out.appendChild(div); } }
function genExplainTask(out,count){ _instrBlock(out,'Instrucción',['Copia las siguientes preguntas en tu cuaderno y responde cada una de forma clara y completa.']); const pool=_shuffle([...explainQuestions]); for(let i=0;i<count;i++){ const item=pool[i%pool.length]; const div=document.createElement('div'); div.className='tg-task'; div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.3rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✔ ${item.ans}</div></div>`; out.appendChild(div); } }
function toggleAns(){ ansVisible=!ansVisible; document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none'); sfx('click'); }

// ===================== SOPA DE LETRAS =====================
const sopaSets=[
  {
    size:10,
    grid:[
      ['D','E','C','I','M','A','L','F','G','D'],
      ['B','H','J','K','N','O','P','Q','R','E'],
      ['S','W','P','U','N','T','O','Y','Z','C'],
      ['E','B','C','D','E','F','G','H','I','I'],
      ['N','J','K','L','M','N','P','Q','R','M'],
      ['T','S','T','U','V','W','X','Y','Z','A'],
      ['E','A','B','C','D','E','F','G','H','S'],
      ['R','S','U','M','A','I','J','K','L','M'],
      ['O','N','O','P','Q','R','S','T','U','V'],
      ['W','X','Y','Z','A','V','A','L','O','R']
    ],
    words:[
      {w:'DECIMAL', cells:[[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6]]},
      {w:'ENTERO',  cells:[[3,0],[4,0],[5,0],[6,0],[7,0],[8,0]]},
      {w:'PUNTO',   cells:[[2,2],[2,3],[2,4],[2,5],[2,6]]},
      {w:'DECIMAS', cells:[[0,9],[1,9],[2,9],[3,9],[4,9],[5,9],[6,9]]},
      {w:'SUMA',    cells:[[7,1],[7,2],[7,3],[7,4]]},
      {w:'VALOR',   cells:[[9,5],[9,6],[9,7],[9,8],[9,9]]}
    ]
  },
  {
    size:10,
    grid:[
      ['C','E','N','T','E','S','I','M','A','S'],
      ['B','J','K','L','M','N','O','P','Q','R'],
      ['O','U','V','W','X','Y','Z','A','B','C'],
      ['R','D','E','F','P','A','R','T','E','G'],
      ['D','H','I','J','K','L','M','N','O','M'],
      ['E','P','Q','R','S','T','U','V','W','I'],
      ['N','X','Y','Z','A','B','C','D','E','T'],
      ['R','E','D','O','N','D','E','A','R','A'],
      ['F','R','A','C','C','I','O','N','G','D'],
      ['H','I','J','K','L','M','N','O','P','Q']
    ],
    words:[
      {w:'CENTESIMAS', cells:[[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[0,9]]},
      {w:'ORDEN',      cells:[[2,0],[3,0],[4,0],[5,0],[6,0]]},
      {w:'PARTE',      cells:[[3,4],[3,5],[3,6],[3,7],[3,8]]},
      {w:'MITAD',      cells:[[4,9],[5,9],[6,9],[7,9],[8,9]]},
      {w:'REDONDEAR',  cells:[[7,0],[7,1],[7,2],[7,3],[7,4],[7,5],[7,6],[7,7],[7,8]]},
      {w:'FRACCION',   cells:[[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,6],[8,7]]}
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

// ===================== LABORATORIO VALOR POSICIONAL =====================
var LAB_STATE={ entero:true, decimas:false, centesimas:false, milesimas:false };
function _labSetOpacity(id,val){ const el=document.getElementById(id); if(el) el.style.opacity=val; }
function _labSetClass(id,on){ const el=document.getElementById(id); if(el){ el.style.opacity=on?'1':'0.12'; el.style.filter=on?'none':'grayscale(1)'; } }
function decLabToggleEntero(){ LAB_STATE.entero=!LAB_STATE.entero; _labSetOpacity('lab-bg-entero',LAB_STATE.entero?'1':'0.08'); _labSetOpacity('lab-lbl-entero',LAB_STATE.entero?'1':'0'); labUpdateBtn('entero',LAB_STATE.entero?'on':'off'); decLabUpdateSentence(); sfx('click'); }
function decLabToggleDecimas(){ LAB_STATE.decimas=!LAB_STATE.decimas; _labSetOpacity('lab-bg-decimas',LAB_STATE.decimas?'1':'0.08'); _labSetOpacity('lab-lbl-decimas',LAB_STATE.decimas?'1':'0'); labUpdateBtn('decimas',LAB_STATE.decimas?'on':'off'); decLabUpdateSentence(); sfx('click'); }
function decLabToggleCentesimas(){ LAB_STATE.centesimas=!LAB_STATE.centesimas; _labSetOpacity('lab-bg-centesimas',LAB_STATE.centesimas?'1':'0.08'); _labSetOpacity('lab-lbl-centesimas',LAB_STATE.centesimas?'1':'0'); labUpdateBtn('centesimas',LAB_STATE.centesimas?'on':'off'); decLabUpdateSentence(); sfx('click'); }
function decLabToggleMilesimas(){ LAB_STATE.milesimas=!LAB_STATE.milesimas; _labSetOpacity('lab-bg-milesimas',LAB_STATE.milesimas?'1':'0.08'); _labSetOpacity('lab-lbl-milesimas',LAB_STATE.milesimas?'1':'0'); labUpdateBtn('milesimas',LAB_STATE.milesimas?'on':'off'); decLabUpdateSentence(); sfx('click'); }
function labUpdateBtn(group,val){ document.querySelectorAll(`[data-lab-group="${group}"]`).forEach(btn=>{ btn.classList.remove('active-pri','active-sec'); if(val==='on') btn.classList.add('active-pri'); }); }
function decLabUpdateSentence(){
  const el=document.getElementById('lab-sentence'); if(!el)return;
  const parts=[];
  if(LAB_STATE.entero) parts.push('la <strong>Parte Entera</strong> (47)');
  if(LAB_STATE.decimas) parts.push('las <strong>Décimas</strong> — el 3 vale 3 × 1/10 = 0.3');
  if(LAB_STATE.centesimas) parts.push('las <strong>Centésimas</strong> — el 6 vale 6 × 1/100 = 0.06');
  if(LAB_STATE.milesimas) parts.push('las <strong>Milésimas</strong> — el 8 vale 8 × 1/1,000 = 0.008');
  el.innerHTML=parts.length===0?'💡 Activa las secciones para explorar el número <strong>47.368</strong>.':'🔍 Observas: '+parts.join(', ')+'.';
}
function decLabInit(){
  LAB_STATE={entero:true,decimas:false,centesimas:false,milesimas:false};
  _labSetOpacity('lab-bg-entero','1'); _labSetOpacity('lab-lbl-entero','1');
  _labSetOpacity('lab-bg-decimas','0.08'); _labSetOpacity('lab-lbl-decimas','0');
  _labSetOpacity('lab-bg-centesimas','0.08'); _labSetOpacity('lab-lbl-centesimas','0');
  _labSetOpacity('lab-bg-milesimas','0.08'); _labSetOpacity('lab-lbl-milesimas','0');
  labUpdateBtn('entero','on');
  decLabUpdateSentence();
}

// ===================== EVALUACIÓN FINAL =====================
const evalTFBank=[
  {q:'El punto decimal (.) separa la parte entera de la parte decimal en Honduras.',a:true},
  {q:'0.9 es menor que 0.89.',a:false},
  {q:'Las décimas representan 1/10 del entero.',a:true},
  {q:'0.5 es igual a 1/2.',a:true},
  {q:'Para sumar decimales no importa la posición del punto decimal.',a:false},
  {q:'3.14 tiene 2 cifras decimales.',a:true},
  {q:'0.100 es igual a 0.1.',a:true},
  {q:'Al redondear 2.75 a la décima, el resultado es 2.7.',a:false},
  {q:'El dígito en las milésimas de 5.637 es el 7.',a:true},
  {q:'La fracción 1/4 equivale al decimal 0.25.',a:true},
  {q:'Al multiplicar un número por 10, el punto decimal se mueve a la derecha.',a:true},
  {q:'0.60 es menor que 0.6.',a:false},
  {q:'Las centésimas tienen menor valor que las décimas.',a:true},
  {q:'En Honduras, la coma (,) se usa para separar unidades de millar.',a:true},
  {q:'0.3 × 0.3 = 0.9.',a:false},
];
const evalMCBank=[
  {q:'¿Cuál es el valor posicional del 4 en 1.435?',o:['a) Centésimas','b) Décimas','c) Milésimas','d) Unidades'],a:1},
  {q:'¿Cuánto es 2.5 + 1.75?',o:['a) 3.25','b) 4.35','c) 4.25','d) 3.75'],a:2},
  {q:'¿Cuál fracción es equivalente a 0.75?',o:['a) 7/5','b) 1/4','c) 7/10','d) 3/4'],a:3},
  {q:'¿Qué dígito está en las milésimas de 8.2347?',o:['a) 2','b) 3','c) 4','d) 7'],a:2},
  {q:'¿Cuál de estos números es el mayor?',o:['a) 0.39','b) 0.4','c) 0.399','d) 0.41'],a:3},
  {q:'Al redondear 6.48 a la décima más cercana:',o:['a) 6.4','b) 6.5','c) 6.0','d) 7.0'],a:1},
  {q:'¿Cuánto es 5.0 − 2.75?',o:['a) 3.25','b) 2.35','c) 2.25','d) 3.75'],a:2},
  {q:'¿Qué fracción representa 0.3?',o:['a) 3/1','b) 1/3','c) 30/1','d) 3/10'],a:3},
  {q:'¿Cuánto es 0.4 × 0.5?',o:['a) 2.0','b) 0.20','c) 20.0','d) 0.009'],a:1},
  {q:'3.5 × 10 = ?',o:['a) 3.50','b) 0.35','c) 35.0','d) 350'],a:2},
  {q:'¿Cuántas cifras decimales tiene 12.345?',o:['a) 1','b) 2','c) 3','d) 5'],a:2},
  {q:'¿Cuánto es 1.2 + 0.08?',o:['a) 1.10','b) 1.28','c) 2.0','d) 1.208'],a:1},
  {q:'¿Cómo se lee "cuatro enteros y dos décimas"?',o:['a) 40.2','b) 4.02','c) 4.20','d) 4.2'],a:3},
  {q:'0.050 es igual a:',o:['a) 0.5','b) 0.50','c) 0.05','d) 5.0'],a:2},
  {q:'¿Cuál es el resultado de 0.6 ÷ 10?',o:['a) 6.0','b) 0.6','c) 0.06','d) 60'],a:2},
];
const evalCPBank=[
  {q:'El símbolo ___ separa la parte entera de la parte decimal en Honduras.',a:'punto (.)'},
  {q:'El primer lugar después del punto decimal se llama ___.',a:'décimas'},
  {q:'El segundo lugar después del punto decimal se llama ___.',a:'centésimas'},
  {q:'0.7 en forma de fracción es ___.',a:'7/10'},
  {q:'Al redondear 3.85 a la décima más cercana obtenemos ___.',a:'3.9'},
  {q:'2.5 + 1.3 = ___.',a:'3.8'},
  {q:'El dígito en las centésimas de 4.279 es ___.',a:'7'},
  {q:'1/4 escrito como decimal es ___.',a:'0.25'},
  {q:'Para sumar decimales, se alinean los ___ decimales.',a:'puntos'},
  {q:'Al multiplicar por 10, el punto se mueve ___ posición(es) a la derecha.',a:'1 (una)'},
  {q:'6.9 − 2.4 = ___.',a:'4.5'},
  {q:'0.3 × 0.3 = ___.',a:'0.09'},
  {q:'Las ___ valen más que las centésimas.',a:'décimas'},
  {q:'En 7.654, el dígito 5 está en las ___.',a:'centésimas'},
  {q:'0.50 simplificado es ___.',a:'0.5'},
];
const evalPRBank=[
  {term:'Número Decimal',def:'Tiene parte entera y parte decimal separadas por punto'},
  {term:'Décimas',def:'Primer lugar decimal; vale 1/10'},
  {term:'Centésimas',def:'Segundo lugar decimal; vale 1/100'},
  {term:'Milésimas',def:'Tercer lugar decimal; vale 1/1,000'},
  {term:'Punto Decimal',def:'Símbolo (.) separador decimal en Honduras'},
  {term:'Redondear',def:'Aproximar a un valor según el dígito siguiente'},
  {term:'0.5',def:'Equivale a 1/2'},
  {term:'0.25',def:'Equivale a 1/4'},
  {term:'0.75',def:'Equivale a 3/4'},
  {term:'0.1',def:'Equivale a 1/10'},
  {term:'Parte Entera',def:'Dígitos a la izquierda del punto decimal'},
  {term:'Parte Decimal',def:'Dígitos a la derecha del punto decimal'},
  {term:'Fracción Decimal',def:'Fracción con denominador 10, 100, 1,000...'},
  {term:'Valor Posicional',def:'Valor de un dígito según su posición'},
  {term:'Truncar',def:'Eliminar dígitos sin redondear'},
];

function genEval(){
  sfx('click');
  const cf=evalFormNum; window._currentEvalForm=cf; evalFormNum=(evalFormNum%10)+1; saveProgress();
  document.getElementById('eval-screen-title').textContent=`📋 Evaluación Final — Forma ${cf} · Números Decimales`;
  evalAnsVisible=false;
  const out=document.getElementById('evalOut'); out.innerHTML='';
  const bar=document.createElement('div'); bar.className='eval-score-bar';
  bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje — 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25 pts</span><span class="eval-score-pill esp-tf">V/F 25 pts</span><span class="eval-score-pill esp-mc">Selección 25 pts</span><span class="eval-score-pill esp-pr">Pareados 25 pts</span></div>`;
  out.appendChild(bar);
  const cpItems=_pick(evalCPBank,5);
  const s1=document.createElement('div'); s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  cpItems.forEach((item,i)=>{ const d=document.createElement('div'); d.className='eval-item'; const qHtml=item.q.replace('___','<span class="eval-blank">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>'); d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div>`; s1.appendChild(d); });
  out.appendChild(s1);
  const tfItems=_pick(evalTFBank,5);
  const s2=document.createElement('div'); s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  tfItems.forEach((item,i)=>{ const d=document.createElement('div'); d.className='eval-item'; d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}"> Falso</label></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div>`; s2.appendChild(d); });
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
  let s1=`<div class="sec-title"><span>I. Completar el espacio</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div>`;
  d.cp.forEach((it,i)=>{ const q=it.q.replace('___','<span class="cp-blank"></span>'); s1+=`<div class="cp-row"><span class="qn">${i+1}.</span><span class="cp-text">${q}</span></div>`; });
  let s2=`<div class="sec-title"><span>II. Verdadero o Falso</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div>`;
  d.tf.forEach((it,i)=>{ s2+=`<div class="tf-row"><span class="qn">${i+6}.</span><span class="tf-blank"></span><span class="tf-text">${it.q}</span></div>`; });
  let s3=`<div class="sec-title"><span>III. Selección Múltiple</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div><div class="mc-grid">`;
  d.mc.forEach((it,i)=>{ const opts=it.o.map((op,oi)=>`<label class="mc-opt"><input type="radio" name="mc${i}"> ${op}</label>`).join(''); s3+=`<div class="mc-item"><div class="mc-q"><span class="qn">${i+11}.</span><span>${it.q}</span></div><div class="mc-opts">${opts}</div></div>`; });
  s3+=`</div>`;
  let colL='<div class="pr-col"><div class="pr-head">📘 Términos</div>';
  d.pr.terms.forEach((it,i)=>{ colL+=`<div class="pr-item"><span class="pr-num">${i+16}.</span><span class="pr-line"></span>${it.term}</div>`; });
  colL+='</div>';
  let colR='<div class="pr-col"><div class="pr-head">📗 Definiciones</div>';
  d.pr.shuffledDefs.forEach((it,i)=>{ colR+=`<div class="pr-item"><span class="pr-num">${d.pr.letters[i]}.</span>${it.def}</div>`; });
  colR+='</div>';
  let s4=`<div class="pr-section"><div class="sec-title"><span>IV. Términos Pareados</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div><div class="pr-grid">${colL}${colR}</div></div>`;
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
  const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación Números Decimales · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:12pt;color:#111;background:#fff;padding:4mm 6mm;}.ph{margin-bottom:0.5rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:11pt;text-align:center;color:#555;margin-top:0.15rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.4rem 0 0.2rem;border-left:4px solid #1565c0;background:#e3f2fd;display:flex;justify-content:space-between;align-items:center;}.qn{font-weight:700;min-width:22px;flex-shrink:0;}.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.4;padding:0.22rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:42px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.2rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.28rem 0.45rem;margin-bottom:0.22rem;break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.4;display:flex;gap:0.3rem;margin-bottom:0.18rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.22rem 0.55rem;}.mc-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:0.08rem 0.25rem;margin-left:1.3rem;}.mc-opt{font-size:9.5pt;display:flex;align-items:center;gap:0.22rem;}.mc-opt input{width:12px;height:12px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.4;padding:0.22rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{break-inside:avoid;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.2rem 0.5rem;margin-top:0.15rem;}.pr-head{font-size:9pt;font-weight:700;color:#555;margin-bottom:0.2rem;}.pr-item{font-size:10pt;padding:0.22rem 0.32rem;background:#e3f2fd;border-radius:3px;margin-bottom:0.12rem;display:flex;align-items:center;gap:0.22rem;line-height:1.2;}.pr-num{font-weight:700;color:#1565c0;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.35rem;margin-bottom:0.5rem;text-align:center;}.p-main{font-size:9.5pt;font-weight:700;}.p-sub{font-size:7pt;color:#c00;font-weight:700;margin:0.08rem 0;}.p-meta{font-size:7pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.9rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.28rem 0.45rem;}.p-ttl{font-size:8pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.1rem;margin-bottom:0.18rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:7.5pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.07rem 0.12rem;vertical-align:top;}.pn{font-weight:700;width:16px;color:#555;}.pa{color:#007a00;font-weight:600;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:#1565c0;font-weight:700;font-style:italic;}.obt-lbl{font-weight:700;}.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #1565c0;height:12px;}.obt-pct{font-weight:700;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;color:#1565c0;font-weight:700;font-style:italic;margin-top:0.3rem;padding:0.2rem 0;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #1565c0;}.forma-tag{position:fixed;bottom:5mm;right:6mm;font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;}@media print{@page{margin:4mm 6mm;}}</style></head><body><div class="ph"><h2>Evaluación Final de Misión Números Decimales — Matemática — II y III Ciclo</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total obtenido</span><span class="obt-line"></span><span>de 100%</span></div><div class="pauta-wrap"><div class="p-head"><div class="p-main">✔ PAUTA — Evaluación Final · Misión Números Decimales · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u</div></div><div class="p-grid">${pR}</div></div><div class="forma-tag">Forma ${forma}</div></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(doc); win.document.close(); setTimeout(()=>win.print(),400);
}

// ===================== DIPLOMA =====================
function openDiploma(){
  sfx('click');
  const pct=getProgress();
  document.getElementById('diplPct').textContent=pct+'%';
  document.getElementById('diplPct').style.color=pct>=70?'var(--jade)':pct>=40?'var(--blue)':'var(--amber)';
  document.getElementById('diplBar').style.width=pct+'%';
  const stars=pct===100?'⭐⭐⭐⭐⭐':pct>=80?'⭐⭐⭐⭐':pct>=60?'⭐⭐⭐':pct>=40?'⭐⭐':'⭐';
  document.getElementById('diplStars').textContent=stars;
  const msgs=['💡 ¡ÁNIMO! Comienza tu misión. ¡Cada paso cuenta!','🌱 ¡GRAN INICIO! Estás dando los primeros pasos.','📐 ¡BUEN TRABAJO! Vas progresando muy bien.','💪 ¡MUY BIEN! Dominas gran parte del contenido.','🏅 ¡INCREÍBLE avance! Estás cerca de la excelencia.','🎓 ¡EXTRAORDINARIO! Completaste TODA la misión. ¡Eres experto en Números Decimales!'];
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
  const pct=getProgress(); const name=document.getElementById('diplName').textContent;
  const stars=document.getElementById('diplStars').textContent;
  const msg=document.getElementById('diplMsg').textContent;
  const date=document.getElementById('diplDate').textContent;
  const achText=unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join('\n');
  const txt=`${stars} CONSTANCIA DE LOGRO ${stars}\n\n📚 Misión: Números Decimales\n👤 Estudiante: ${name}\n📊 Progreso: ${pct}% completado\n⭐ XP obtenido: ${xp} de ${MXP}${achText?'\n\n🏆 Logros desbloqueados:\n'+achText:''}\n\n${msg}\n\n📅 ${date}\n🏠 Proyecto Educativo Familia Polanco-Castellanos\n🌐 policastsapien.com`;
  window.open('https://wa.me/?text='+encodeURIComponent(txt),'_blank');
}

// ===================== INIT =====================
document.addEventListener('DOMContentLoaded',()=>{
  initTheme();
  loadProgress();
  upFC(); buildQz(); buildClass(); showId(); showCmp(); buildSopa(); genEval();
  updateRetoButtons(); decLabInit(); renderAchPanel();
  document.addEventListener('click',function(e){ const panel=document.getElementById('achPanel'); const btn=document.getElementById('achBtn'); if(panel.classList.contains('open')&&!panel.contains(e.target)&&e.target!==btn) panel.classList.remove('open'); });
  document.addEventListener('click',function(e){ if(e.target===document.getElementById('diplomaOverlay')) closeDiploma(); });
  const savedName=localStorage.getItem('nombreEstudianteDecimales');
  const inputName=document.querySelector('.diploma-input');
  if(savedName&&inputName){ inputName.value=savedName; updateDiplomaName(savedName); }
  if(inputName) inputName.addEventListener('input',e=>localStorage.setItem('nombreEstudianteDecimales',e.target.value));
  fin('s-aprende',false);
  fin('s-tipos',false);
});
