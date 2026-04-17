// Función para hacer la letra más grande (Accesibilidad)
 function toggleLetra() {
     document.body.classList.toggle('letra-grande');
     if(typeof sfx === 'function') sfx('click');
     const estaActivado = document.body.classList.contains('letra-grande');
     localStorage.setItem('preferenciaLetra', estaActivado);
 }

 window.addEventListener('DOMContentLoaded', () => {
     if(localStorage.getItem('preferenciaLetra') === 'true') {
         document.body.classList.add('letra-grande');
     }
 });

// ===================== UTILIDADES =====================
const _pick = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
const _shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

function fb(id, msg, isOk) {
    const el = document.getElementById(id);
    if(el) {
        el.textContent = msg;
        el.className = 'fb show ' + (isOk ? 'ok' : 'err');
    }
}

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY = 'geografia_coordenadas_v1';
let xp = 0, MXP = 200, done = new Set(), evalAnsVisible = false;
let evalFormNum = 1;
let unlockedAch = [];
let darkMode = false;
let prevLevel = 0;
const TOTAL_SECTIONS = 12;

// XP TRACKER
const xpTracker = {
  fc: new Set(), qz: new Set(), cls: new Set(), id: new Set(),
  cmp: new Set(), reto: new Set(), sopa: new Set(),
};

// ===================== SONIDO =====================
let sndOn = true; let AC = null;
function getAC(){ if(!AC){ try{ AC = new(window.AudioContext||window.webkitAudioContext)(); }catch(e){} } return AC; }
function sfx(t){
  if(!sndOn) return;
  try{
    const ac = getAC(); if(!ac) return;
    const g = ac.createGain(); g.connect(ac.destination);
    const o = ac.createOscillator(); o.connect(g);
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
    const s = JSON.parse(localStorage.getItem(SAVE_KEY));
    if(!s) return;
    if(s.doneSections && Array.isArray(s.doneSections)) s.doneSections.forEach(id=>{
      done.add(id);
      const b = document.querySelector(`[data-s="${id}"]`);
      if(b) b.classList.add('done');
    });
    if(s.unlockedAch && Array.isArray(s.unlockedAch)) unlockedAch = s.unlockedAch.filter(id=>ACHIEVEMENTS[id]!==undefined);
    if(s.evalFormNum) evalFormNum = s.evalFormNum;
    if(s.xp !== undefined) { xp = s.xp; updateXPBar(); }
  }catch(e){}
}

// ===================== ACHIEVEMENTS =====================
const ACHIEVEMENTS = {
  primer_quiz:{icon:'🧠',label:'Primera prueba superada'},
  flash_master:{icon:'🃏',label:'Todas las flashcards vistas'},
  clasif_pro:{icon:'🗂️',label:'Clasificador experto'},
  id_master:{icon:'🔍',label:'Identificador maestro'},
  reto_hero:{icon:'🏆',label:'Héroe del reto final'},
  nivel3:{icon:'🔭',label:'¡Explorador alcanzado! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡Campeón alcanzado! Nivel 6'}
};
function unlockAchievement(id){
  if(unlockedAch.includes(id)) return;
  unlockedAch.push(id);
  sfx('ach');
  showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label);
  launchConfetti();
  renderAchPanel();
  saveProgress();
}
function renderAchPanel(){
  const list = document.getElementById('achList'); list.innerHTML='';
  Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{
    const div = document.createElement('div');
    div.className = 'ach-item'+(unlockedAch.includes(id)?'':' locked');
    div.innerHTML = `<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`;
    list.appendChild(div);
  });
}
function toggleAchPanel(){ sfx('click'); document.getElementById('achPanel').classList.toggle('open'); }
function showToast(msg){
  let t = document.querySelector('.toast');
  if(!t){ t=document.createElement('div'); t.className='toast'; document.body.appendChild(t); }
  t.textContent = msg; t.style.display = 'block';
  clearTimeout(t._tid);
  t._tid = setTimeout(()=>t.style.display='none', 3200);
}
function launchConfetti(){
  const colors=['#419b88','#c49000','#00b894','#fdcb6e','#6c5ce7'];
  for(let i=0;i<60;i++){
    const c=document.createElement('div'); c.className='confetti-piece';
    c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`;
    document.body.appendChild(c);
    c.addEventListener('animationend',()=>c.remove());
  }
}

// ===================== XP =====================
const lvls=[{t:0,n:'Novato ✏️'},{t:25,n:'Aprendiz 📝'},{t:55,n:'Explorador 🔭'},{t:90,n:'Detective 🔍'},{t:130,n:'Experto 🌟'},{t:165,n:'Campeón 🥇'},{t:190,n:'Maestro 🏆'}];
function pts(n){
  xp = Math.max(0, Math.min(MXP, xp+n));
  updateXPBar();
  saveProgress();
}
function updateXPBar(){
  const pct = Math.round((xp/MXP)*100);
  document.getElementById('xpFill').style.width = pct+'%';
  const el = document.getElementById('xpPts');
  el.textContent = '⭐ '+xp;
  el.style.transform = 'scale(1.3)';
  setTimeout(()=>el.style.transform='', 300);
  let lv=0;
  for(let i=0;i<lvls.length;i++) if(xp>=lvls[i].t) lv=i;
  document.getElementById('xpLvl').textContent = lvls[lv].n;
  if(lv!==prevLevel){ if(lv>=2) unlockAchievement('nivel3'); if(lv>=5) unlockAchievement('nivel5'); prevLevel=lv; }
}
function resetXP() {
  sfx('click'); xp = 0; updateXPBar();
  showToast('🔄 XP reiniciado a 0');
}
function fin(id, showFX=true){
  if(!done.has(id)){
    done.add(id);
    const b = document.querySelector(`[data-s="${id}"]`);
    if(b) b.classList.add('done');
    if(showFX){ sfx('up'); launchConfetti(); }
    saveProgress();
  }
}
function getProgress(){ return Math.round((done.size/TOTAL_SECTIONS)*100); }

// ===================== NAV =====================
function go(id){
  sfx('click');
  document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{ b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
  document.getElementById(id).classList.add('active');
  const btn = document.querySelector(`[data-s="${id}"]`);
  if(btn){ btn.classList.add('active'); btn.setAttribute('aria-selected','true'); }
  window.scrollTo({top:0,behavior:'smooth'});
  if (id === 's-sopa') { setTimeout(buildSopa, 50); }
}

// ===================== FLASHCARD DATA =====================
const fcData=[
  {w:'Latitud',a:'📐 Distancia angular medida desde el <strong>Ecuador</strong> hacia los polos. Se expresa en grados (°) Norte o Sur. Va de 0° (Ecuador) a 90° (Polos).'},
  {w:'Longitud',a:'🧭 Distancia angular medida desde el <strong>Meridiano de Greenwich</strong> hacia el Este u Oeste. Va de 0° a 180°.'},
  {w:'Paralelo',a:'🌐 Línea imaginaria que rodea la Tierra de forma <strong>horizontal</strong>, paralela al Ecuador. Indica la latitud de un lugar.'},
  {w:'Meridiano',a:'🗺️ Línea imaginaria que va de <strong>polo a polo</strong> en sentido vertical. Indica la longitud de un lugar.'},
  {w:'Ecuador',a:'🌍 Paralelo principal ubicado a <strong>0° de latitud</strong>. Divide la Tierra en Hemisferio Norte y Hemisferio Sur.'},
  {w:'Meridiano de Greenwich',a:'🏴 Meridiano principal ubicado a <strong>0° de longitud</strong>. Divide la Tierra en Hemisferio Oriental y Occidental. Pasa por el Reino Unido.'},
  {w:'Coordenadas Geográficas',a:'📍 Sistema formado por <strong>latitud y longitud</strong> que permite ubicar cualquier punto exacto sobre la superficie terrestre.'},
  {w:'Trópico de Cáncer',a:'☀️ Paralelo ubicado a <strong>23° 26\' Norte</strong>. Es el límite norte de la zona tropical. El Sol cae perpendicularmente aquí en el solsticio de junio.'},
  {w:'Trópico de Capricornio',a:'🌞 Paralelo ubicado a <strong>23° 26\' Sur</strong>. Es el límite sur de la zona tropical. El Sol cae perpendicularmente aquí en el solsticio de diciembre.'},
  {w:'Círculo Polar Ártico',a:'🧊 Paralelo ubicado a <strong>66° 34\' Norte</strong>. Marca el límite de la zona polar norte, donde ocurre el sol de medianoche.'},
  {w:'Círculo Polar Antártico',a:'🐧 Paralelo ubicado a <strong>66° 34\' Sur</strong>. Marca el límite de la zona polar sur y la región antártica.'},
  {w:'Hemisferio',a:'🌏 Cada una de las <strong>dos mitades</strong> en que se divide la Tierra. Puede ser Norte/Sur (según el Ecuador) u Oriental/Occidental (según Greenwich).'},
  {w:'Zona Tórrida',a:'🔥 Zona climática comprendida entre los <strong>Trópicos de Cáncer y Capricornio</strong>. Es la más cálida de la Tierra. Honduras está en esta zona.'},
  {w:'Huso Horario',a:'🕐 Cada una de las <strong>24 franjas verticales</strong> en que se divide la Tierra para organizar la hora. Cada huso equivale a 15° de longitud.'},
  {w:'Antípoda',a:'🌐 Punto de la Tierra <strong>diametralmente opuesto</strong> a otro. Sus coordenadas son la misma latitud pero con signo contrario, y la longitud ± 180°.'},
];
let fcIdx = 0;
function upFC(){
  document.getElementById('fcInner').classList.remove('flipped');
  document.getElementById('fcW').textContent = fcData[fcIdx].w;
  document.getElementById('fcA').innerHTML = fcData[fcIdx].a;
  document.getElementById('fcCtr').textContent = (fcIdx+1)+' / '+fcData.length;
}
function flipCard(){
  sfx('flip');
  document.getElementById('fcInner').classList.toggle('flipped');
  if(!xpTracker.fc.has(fcIdx)){ xpTracker.fc.add(fcIdx); pts(1); }
  if(xpTracker.fc.size === fcData.length){ fin('s-flash'); unlockAchievement('flash_master'); }
}
function nextFC(){ sfx('click'); fcIdx=(fcIdx+1)%fcData.length; upFC(); }
function prevFC(){ sfx('click'); fcIdx=(fcIdx-1+fcData.length)%fcData.length; upFC(); }

// ===================== QUIZ DATA =====================
const qzData=[
  {q:'¿Qué mide la latitud?',o:['a) La distancia de este a oeste','b) La distancia angular desde el Ecuador hacia los polos','c) El tiempo en cada zona horaria','d) La altura sobre el nivel del mar'],c:1},
  {q:'¿A cuántos grados de latitud se encuentra el Ecuador?',o:['a) 90°','b) 45°','c) 23°','d) 0°'],c:3},
  {q:'¿Qué línea imaginaria divide la Tierra en Hemisferio Norte y Hemisferio Sur?',o:['a) Meridiano de Greenwich','b) Trópico de Cáncer','c) El Ecuador','d) Círculo Polar Ártico'],c:2},
  {q:'¿Cuál es la latitud del Trópico de Capricornio?',o:['a) 23° 26\' Norte','b) 66° 34\' Sur','c) 0° Sur','d) 23° 26\' Sur'],c:3},
  {q:'¿Qué es el Meridiano de Greenwich?',o:['a) El paralelo de 0° latitud','b) El meridiano de 0° longitud que pasa por el Reino Unido','c) La línea que separa el Ártico','d) Un paralelo de 90°'],c:1},
  {q:'¿Para qué sirven las coordenadas geográficas?',o:['a) Para medir la temperatura','b) Para calcular la altitud','c) Para ubicar cualquier punto exacto en la Tierra','d) Para predecir el clima'],c:2},
  {q:'¿En cuántas franjas (husos horarios) se divide la Tierra?',o:['a) 12','b) 36','c) 24','d) 48'],c:2},
  {q:'Honduras se encuentra en la zona climática llamada:',o:['a) Zona Polar','b) Zona Templada Norte','c) Zona Templada Sur','d) Zona Tórrida'],c:3},
  {q:'¿Cuál de estos es un paralelo importante de la Tierra?',o:['a) Meridiano de Greenwich','b) Trópico de Cáncer','c) Primer Meridiano','d) Meridiano 90°'],c:1},
  {q:'La longitud se mide desde:',o:['a) El Ecuador','b) El Polo Norte','c) El Meridiano de Greenwich','d) El Trópico de Capricornio'],c:2},
  {q:'¿Qué ocurre en el Círculo Polar Ártico durante el solsticio de verano?',o:['a) El Sol nunca sale','b) Hay 24 horas de noche','c) El Sol no se pone (sol de medianoche)','d) El Sol cae perpendicularmente'],c:2},
  {q:'Un punto con coordenadas 15°N, 87°W se encuentra al:',o:['a) Sur del Ecuador y al este de Greenwich','b) Norte del Ecuador y al oeste de Greenwich','c) Sur del Ecuador y al oeste de Greenwich','d) Norte del Ecuador y al este de Greenwich'],c:1},
];
let qzIdx=0, qzSel=-1, qzDone=false;
function buildQz(){ qzIdx=0; qzSel=-1; qzDone=false; showQz(); }
function showQz(){
  if(qzIdx>=qzData.length){
    document.getElementById('qzQ').textContent='🎉 ¡Quiz completado!';
    document.getElementById('qzOpts').innerHTML='';
    fin('s-quiz'); unlockAchievement('primer_quiz'); return;
  }
  const q = qzData[qzIdx];
  document.getElementById('qzProg').textContent = `Pregunta ${qzIdx+1} de ${qzData.length}`;
  document.getElementById('qzQ').textContent = q.q;
  const opts = document.getElementById('qzOpts'); opts.innerHTML='';
  q.o.forEach((o,i)=>{
    const b = document.createElement('button'); b.className='qz-opt'; b.textContent=o;
    b.onclick=()=>{ if(qzDone)return; document.querySelectorAll('.qz-opt').forEach(x=>x.classList.remove('sel')); b.classList.add('sel'); qzSel=i; sfx('click'); };
    opts.appendChild(b);
  });
  qzDone = false;
}
function checkQz(){
  if(qzSel<0) return fb('fbQz','Selecciona una respuesta.',false);
  qzDone = true;
  const opts = document.querySelectorAll('.qz-opt');
  if(qzSel===qzData[qzIdx].c){
    opts[qzSel].classList.add('correct');
    fb('fbQz','¡Correcto! +5 XP',true);
    if(!xpTracker.qz.has(qzIdx)){ xpTracker.qz.add(qzIdx); pts(5); }
    sfx('ok');
  } else {
    opts[qzSel].classList.add('wrong'); opts[qzData[qzIdx].c].classList.add('correct');
    fb('fbQz','Incorrecto. Revisa la respuesta correcta.',false); sfx('no');
  }
  setTimeout(()=>{ qzIdx++; qzSel=-1; showQz(); }, 1600);
}
function resetQz(){
  sfx('click');
  qzIdx=0; qzSel=-1; qzDone=false;
  showQz();
  document.getElementById('fbQz').classList.remove('show');
}

// ===================== CLASIFICACIÓN =====================
const classGroups = [
  {
    label:['Paralelo','Meridiano'], headA:'🌐 Paralelo', headB:'🗺️ Meridiano', colA:'paralelo', colB:'meridiano',
    words:[
      {w:'Ecuador',t:'paralelo'},{w:'Greenwich',t:'meridiano'},{w:'Trópico de Cáncer',t:'paralelo'},
      {w:'Longitud 0°',t:'meridiano'},{w:'Latitud 0°',t:'paralelo'},{w:'Dirección E-O',t:'paralelo'},
      {w:'Dirección N-S',t:'meridiano'},{w:'Círculo Polar',t:'paralelo'},{w:'Polo a polo',t:'meridiano'},
      {w:'Trópico Capricornio',t:'paralelo'}
    ]
  },
  {
    label:['Hemisferio Norte','Hemisferio Sur'], headA:'🌍 H. Norte', headB:'🌎 H. Sur', colA:'norte', colB:'sur',
    words:[
      {w:'Europa',t:'norte'},{w:'Antártida',t:'sur'},{w:'Trópico de Cáncer',t:'norte'},
      {w:'Trópico de Capricornio',t:'sur'},{w:'Círculo Polar Ártico',t:'norte'},{w:'Círculo Polar Antártico',t:'sur'},
      {w:'Honduras',t:'norte'},{w:'Argentina',t:'sur'},{w:'Canadá',t:'norte'},{w:'Australia',t:'sur'}
    ]
  },
  {
    label:['Zona Tórrida','Zona Polar'], headA:'🔥 Tórrida', headB:'🧊 Polar', colA:'torrida', colB:'polar',
    words:[
      {w:'Ecuador',t:'torrida'},{w:'Polo Norte',t:'polar'},{w:'Honduras',t:'torrida'},
      {w:'Antártida',t:'polar'},{w:'Entre los trópicos',t:'torrida'},{w:'Más calurosa',t:'torrida'},
      {w:'Hielos perpetuos',t:'polar'},{w:'Selva amazónica',t:'torrida'},{w:'Ártico',t:'polar'},
      {w:'México',t:'torrida'}
    ]
  },
  {
    label:['Latitud','Longitud'], headA:'📐 Latitud', headB:'🧭 Longitud', colA:'latitud', colB:'longitud',
    words:[
      {w:'Norte / Sur',t:'latitud'},{w:'Este / Oeste',t:'longitud'},{w:'Referencia: Ecuador',t:'latitud'},
      {w:'Referencia: Greenwich',t:'longitud'},{w:'0° a 90°',t:'latitud'},{w:'0° a 180°',t:'longitud'},
      {w:'Trópicos y Polares',t:'latitud'},{w:'Husos horarios',t:'longitud'},{w:'Paralelos',t:'latitud'},
      {w:'Meridianos',t:'longitud'}
    ]
  },
];
let currentClassGroupIdx = 0;
let clsSelectedWord = null;

function buildClass(){
  const group = classGroups[currentClassGroupIdx];
  document.getElementById('col-left-head').textContent = group.headA;
  document.getElementById('col-right-head').textContent = group.headB;
  const bank = document.getElementById('clsBank'); bank.innerHTML='';
  clsSelectedWord = null;
  document.getElementById('items-left').innerHTML='';
  document.getElementById('items-right').innerHTML='';
  _shuffle([...group.words]).forEach(w=>{
    const el = document.createElement('div'); el.className='wb-item'; el.textContent=w.w; el.dataset.t=w.t;
    el.onclick=()=>{ document.querySelectorAll('.wb-item').forEach(i=>i.classList.remove('sel-word')); el.classList.add('sel-word'); clsSelectedWord=el; sfx('click'); };
    bank.appendChild(el);
  });
  ['col-left','col-right'].forEach(colId=>{
    const col = document.getElementById(colId);
    col.onclick=(e)=>{
      if(!clsSelectedWord||e.target.classList.contains('drop-item')) return;
      const targetId = colId==='col-left'?'items-left':'items-right';
      const wordsCol = document.getElementById(targetId);
      const item = document.createElement('div'); item.className='drop-item';
      item.textContent=clsSelectedWord.textContent; item.dataset.t=clsSelectedWord.dataset.t;
      const original=clsSelectedWord;
      item.onclick = (ev) => {
         ev.stopPropagation();
         if (clsSelectedWord !== null) { col.click(); }
         else { document.getElementById('clsBank').appendChild(original); original.classList.remove('sel-word'); item.remove(); if(typeof sfx === 'function') sfx('click'); }
     };
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
function nextClassGroup(){
  sfx('click');
  currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length;
  buildClass(); document.getElementById('fbCls').classList.remove('show');
  showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]);
}
function resetClass(){sfx('click');buildClass();document.getElementById('fbCls').classList.remove('show');}

// ===================== IDENTIFICAR =====================
const idData=[
  {s:['El','Ecuador','divide','la','Tierra.'],c:1,art:'Paralelo de referencia (0° latitud)'},
  {s:['La','latitud','se','mide','en','grados.'],c:1,art:'Coordenada de posición N-S'},
  {s:['Honduras','tiene','coordenadas','de','15°N.'],c:3,art:'Dato de latitud'},
  {s:['Greenwich','es','el','meridiano','principal.'],c:0,art:'Meridiano de referencia (0° longitud)'},
  {s:['La','zona','tórrida','es','muy','cálida.'],c:2,art:'Zona climática entre los trópicos'},
  {s:['Los','husos','horarios','dependen','de','la','longitud.'],c:2,art:'Franjas de tiempo (24 zonas)'},
  {s:['El','Trópico','de','Cáncer','está','al','Norte.'],c:1,art:'Paralelo a 23° 26\' N'},
  {s:['Los','meridianos','van','de','polo','a','polo.'],c:1,art:'Líneas verticales de longitud'},
  {s:['El','Círculo','Polar','Ártico','delimita','la','zona','fría.'],c:1,art:'Paralelo a 66° 34\' N'},
  {s:['La','longitud','se','mide','hacia','el','Este','u','Oeste.'],c:1,art:'Coordenada de posición E-O'},
];
let idIdx = 0;
let idDone = false;
function showId(){
  idDone = false;
  if(idIdx>=idData.length){
    document.getElementById('idSent').innerHTML='🎉 ¡Completado!';
    fin('s-identifica'); unlockAchievement('id_master'); return;
  }
  const d = idData[idIdx];
  document.getElementById('idProg').textContent = `Oración ${idIdx+1} de ${idData.length}`;
  document.getElementById('idInfo').textContent = `Busca: ${d.art}`;
  const sent = document.getElementById('idSent'); sent.innerHTML='';
  d.s.forEach((w,i)=>{
    const span = document.createElement('span'); span.className='id-word'; span.textContent=w+' ';
    span.onclick=()=>checkId(i,span);
    sent.appendChild(span);
  });
}
function checkId(i, span){
  if(idDone) return;
  document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected'));
  span.classList.add('selected');
  if(i===idData[idIdx].c){
    idDone = true;
    span.classList.add('id-ok'); fb('fbId','¡Correcto! +5 XP',true);
    if(!xpTracker.id.has(idIdx)){ xpTracker.id.add(idIdx); pts(5); }
    sfx('ok');
  } else {
    span.classList.add('id-no'); fb('fbId','Ese no es el término solicitado.',false); sfx('no');
  }
}
function nextId(){ sfx('click'); idIdx++; showId(); document.getElementById('fbId').classList.remove('show'); }
function resetId(){ sfx('click'); idIdx=0; showId(); document.getElementById('fbId').classList.remove('show'); }

// ===================== COMPLETA =====================
const cmpData=[
  {s:'El ___ divide la Tierra en Hemisferio Norte y Hemisferio Sur.',opts:['Ecuador','Greenwich','Ártico'],c:0},
  {s:'La latitud se mide desde el Ecuador hacia los ___ .',opts:['meridianos','polos','trópicos'],c:1},
  {s:'El Meridiano de Greenwich tiene ___ grados de longitud.',opts:['90°','45°','0°'],c:2},
  {s:'Honduras está ubicada en el Hemisferio ___ .',opts:['Sur','Norte','Oriental'],c:1},
  {s:'La zona entre los trópicos se llama zona ___ .',opts:['polar','templada','tórrida'],c:2},
  {s:'Los husos horarios se organizan según la ___ .',opts:['latitud','altitud','longitud'],c:2},
  {s:'El Trópico de Cáncer está a 23° 26\' al ___ del Ecuador.',opts:['Sur','Norte','Este'],c:1},
  {s:'Para localizar un punto exacto necesitas la latitud y la ___ .',opts:['altitud','longitud','temperatura'],c:1},
];
let cmpIdx=0, cmpSel=-1, cmpDone=false;
function showCmp(){
  if(cmpIdx>=cmpData.length){
    document.getElementById('cmpSent').innerHTML='🎉 ¡Completado!';
    document.getElementById('cmpOpts').innerHTML='';
    fin('s-completa'); return;
  }
  const d = cmpData[cmpIdx];
  document.getElementById('cmpProg').textContent = `Oración ${cmpIdx+1} de ${cmpData.length}`;
  document.getElementById('cmpSent').innerHTML = d.s.replace('___','<span class="blank">___</span>');
  const opts = document.getElementById('cmpOpts'); opts.innerHTML=''; cmpSel=-1; cmpDone=false;
  d.opts.forEach((o,i)=>{
    const b = document.createElement('button'); b.className='cmp-opt'; b.textContent=o;
    b.onclick=()=>{ if(cmpDone)return; document.querySelectorAll('.cmp-opt').forEach(x=>x.classList.remove('sel')); b.classList.add('sel'); cmpSel=i; sfx('click'); };
    opts.appendChild(b);
  });
}
function checkCmp(){
  if(cmpSel<0) return fb('fbCmp','Selecciona una opción.',false);
  cmpDone = true;
  const opts = document.querySelectorAll('.cmp-opt');
  if(cmpSel===cmpData[cmpIdx].c){
    opts[cmpSel].classList.add('correct');
    document.getElementById('cmpSent').innerHTML = cmpData[cmpIdx].s.replace('___',`<span class="blank" style="color:var(--jade);border-color:var(--jade)">${opts[cmpSel].textContent}</span>`);
    fb('fbCmp','¡Correcto! +5 XP',true);
    if(!xpTracker.cmp.has(cmpIdx)){ xpTracker.cmp.add(cmpIdx); pts(5); }
    sfx('ok');
  } else {
    opts[cmpSel].classList.add('wrong'); opts[cmpData[cmpIdx].c].classList.add('correct');
    fb('fbCmp','Incorrecto. Revisa bien la respuesta.',false); sfx('no');
  }
  setTimeout(()=>{ cmpIdx++; document.getElementById('fbCmp').classList.remove('show'); showCmp(); }, 1600);
}

// ===================== RETO FINAL =====================
const retoPairs = [
  {
    label: ['Paralelo','Meridiano'], btnA: '🌐 Paralelo', btnB: '🗺️ Meridiano',
    colA: 'paralelo', colB: 'meridiano',
    words: [
      {w:'Ecuador',t:'paralelo'},{w:'Greenwich',t:'meridiano'},{w:'Trópico de Cáncer',t:'paralelo'},
      {w:'Longitud 0°',t:'meridiano'},{w:'Latitud 0°',t:'paralelo'},{w:'Va de E a O',t:'paralelo'},
      {w:'Va de N a S',t:'meridiano'},{w:'Círculo Polar',t:'paralelo'},{w:'Huso horario',t:'meridiano'},
      {w:'Capricornio',t:'paralelo'},{w:'90° longitud',t:'meridiano'},{w:'45° latitud',t:'paralelo'},
    ]
  },
  {
    label: ['Latitud','Longitud'], btnA: '📐 Latitud', btnB: '🧭 Longitud',
    colA: 'latitud', colB: 'longitud',
    words: [
      {w:'Norte / Sur',t:'latitud'},{w:'Este / Oeste',t:'longitud'},{w:'0° a 90°',t:'latitud'},
      {w:'0° a 180°',t:'longitud'},{w:'Paralelos',t:'latitud'},{w:'Meridianos',t:'longitud'},
      {w:'Ecuador',t:'latitud'},{w:'Greenwich',t:'longitud'},{w:'Zona tórrida',t:'latitud'},
      {w:'Husos horarios',t:'longitud'},
    ]
  },
];
let currentRetoPairIdx = 0;
let retoPool=[], retoOk=0, retoErr=0, retoTimerInt=null, retoSec=30, retoRunning=false, retoCurrent=null;

function updateRetoButtons(){
  const pair = retoPairs[currentRetoPairIdx];
  document.querySelectorAll('.reto-btns .btn')[0].textContent = pair.btnA;
  document.querySelectorAll('.reto-btns .btn')[1].textContent = pair.btnB;
  document.querySelectorAll('.reto-btns .btn')[0].onclick = ()=>ansReto(pair.colA);
  document.querySelectorAll('.reto-btns .btn')[1].onclick = ()=>ansReto(pair.colB);
}
function startReto(){
  if(retoRunning) return;
  sfx('click'); retoRunning=true; retoOk=0; retoErr=0; retoSec=30;
  retoPool = _shuffle([...retoPairs[currentRetoPairIdx].words, ...retoPairs[currentRetoPairIdx].words]);
  showRetoWord();
  retoTimerInt = setInterval(()=>{
    retoSec--; sfx('tick');
    document.getElementById('retoTimer').textContent = '⏱ '+retoSec;
    if(retoSec<=10) document.getElementById('retoTimer').style.color = 'var(--red)';
    if(retoSec<=0){ clearInterval(retoTimerInt); endReto(); }
  }, 1000);
}
function showRetoWord(){
  if(retoPool.length===0) retoPool = _shuffle([...retoPairs[currentRetoPairIdx].words, ...retoPairs[currentRetoPairIdx].words]);
  retoCurrent = retoPool.pop();
  document.getElementById('retoWord').textContent = retoCurrent.w;
}
function ansReto(t){
  if(!retoRunning||!retoCurrent) return;
  const firstPlay = !xpTracker.reto.has(currentRetoPairIdx);
  if(t===retoCurrent.t){ sfx('ok'); retoOk++; if(firstPlay) pts(1); }
  else { sfx('no'); retoErr++; if(firstPlay) pts(-1); }
  document.getElementById('retoScore').textContent = `✅ ${retoOk} correctas | ❌ ${retoErr} errores`;
  showRetoWord();
}
function endReto(){
  retoRunning = false;
  document.getElementById('retoWord').textContent = '🏁 ¡Tiempo!';
  document.getElementById('retoTimer').style.color = 'var(--pri)';
  xpTracker.reto.add(currentRetoPairIdx);
  const total = retoOk+retoErr;
  const pct = total>0?Math.round((retoOk/total)*100):0;
  fb('fbReto',`Resultado: ${retoOk}/${total} (${pct}%) ¡Bien hecho!`,true);
  fin('s-reto'); sfx('fan'); unlockAchievement('reto_hero');
}
function nextRetoPair(){
  sfx('click'); clearInterval(retoTimerInt); retoRunning=false; retoSec=30; retoOk=0; retoErr=0;
  currentRetoPairIdx = (currentRetoPairIdx+1) % retoPairs.length;
  updateRetoButtons();
  document.getElementById('retoTimer').textContent = '⏱ 30';
  document.getElementById('retoTimer').style.color = 'var(--pri)';
  document.getElementById('retoWord').textContent = '¡Prepárate!';
  document.getElementById('retoScore').textContent = '✅ 0 correctas | ❌ 0 errores';
  document.getElementById('fbReto').classList.remove('show');
  showToast(`🔀 Pareja: ${retoPairs[currentRetoPairIdx].label[0]} vs ${retoPairs[currentRetoPairIdx].label[1]}`);
}
function resetReto(){
  sfx('click'); clearInterval(retoTimerInt); retoRunning=false; retoSec=30; retoOk=0; retoErr=0;
  document.getElementById('retoTimer').textContent = '⏱ 30';
  document.getElementById('retoTimer').style.color = 'var(--pri)';
  document.getElementById('retoWord').textContent = '¡Prepárate!';
  document.getElementById('retoScore').textContent = '✅ 0 correctas | ❌ 0 errores';
  document.getElementById('fbReto').classList.remove('show');
}

// ===================== TASK GENERATOR =====================
const identifyTaskDB=[
  {s:'El Ecuador divide la Tierra en dos hemisferios.',type:'Paralelo de referencia (Ecuador)'},
  {s:'La latitud de Tegucigalpa es aproximadamente 14° Norte.',type:'Coordenada de latitud (14° N)'},
  {s:'El Meridiano de Greenwich fue establecido en 1884.',type:'Meridiano de referencia (0° longitud)'},
  {s:'Los Trópicos delimitan la zona tórrida de la Tierra.',type:'Paralelos tropicales (Cáncer y Capricornio)'},
  {s:'Honduras tiene una longitud de aproximadamente 87° Oeste.',type:'Coordenada de longitud (87° O)'},
  {s:'Los husos horarios se calculan cada 15 grados de longitud.',type:'Sistema de husos horarios'},
  {s:'El Círculo Polar Ártico marca el límite de la zona fría norte.',type:'Paralelo polar (66° 34\' N)'},
  {s:'La zona tórrida es la región más cálida del planeta.',type:'Zona climática tórrida'},
  {s:'Las coordenadas de un punto se expresan con latitud y longitud.',type:'Sistema de coordenadas geográficas'},
  {s:'Los meridianos van de polo a polo dividiendo la longitud.',type:'Líneas de longitud (meridianos)'},
];
const classifyTaskDB=[
  {w:'Ecuador',gen:'Paralelo',n:'0°',g:'Latitud',t:'Referencia N-S'},
  {w:'Greenwich',gen:'Meridiano',n:'0°',g:'Longitud',t:'Referencia E-O'},
  {w:'Trópico Cáncer',gen:'Paralelo',n:'23° 26\'',g:'Latitud Norte',t:'Límite zona tórrida'},
  {w:'Trópico Capricornio',gen:'Paralelo',n:'23° 26\'',g:'Latitud Sur',t:'Límite zona tórrida'},
  {w:'Círculo Polar Ártico',gen:'Paralelo',n:'66° 34\'',g:'Latitud Norte',t:'Límite zona polar'},
  {w:'Meridiano 90°O',gen:'Meridiano',n:'90°',g:'Longitud Oeste',t:'Referencia horaria'},
  {w:'Latitud 15° N',gen:'Coordenada',n:'15°',g:'Norte Ecuador',t:'Honduras aprox.'},
  {w:'Antípoda',gen:'Punto',n:'±180°',g:'Longitud opuesta',t:'Punto opuesto'},
];
const completeTaskDB=[
  {s:'La ___ se mide desde el Ecuador hacia los polos.',opts:['longitud','latitud','altitud'],ans:'latitud'},
  {s:'El Meridiano de Greenwich tiene ___ grados de longitud.',opts:['90°','180°','0°'],ans:'0°'},
  {s:'Entre los Trópicos se encuentra la zona ___ .',opts:['polar','templada','tórrida'],ans:'tórrida'},
  {s:'Honduras está en el Hemisferio ___ del Ecuador.',opts:['Sur','Norte','Oriental'],ans:'Norte'},
  {s:'Las coordenadas geográficas combinan latitud y ___ .',opts:['altitud','temperatura','longitud'],ans:'longitud'},
  {s:'Cada huso horario equivale a ___ grados de longitud.',opts:['10°','15°','30°'],ans:'15°'},
  {s:'El Trópico de Cáncer está en el Hemisferio ___ .',opts:['Sur','Este','Norte'],ans:'Norte'},
  {s:'Los meridianos van de ___ a polo.',opts:['mar','ecuador','polo'],ans:'polo'},
];
const explainQuestions=[
  {q:'¿Qué son las coordenadas geográficas y para qué sirven? Da un ejemplo.',ans:'Son el sistema de latitud y longitud que permiten ubicar cualquier punto en la Tierra. Ej: Tegucigalpa ≈ 14°N, 87°O.'},
  {q:'¿Cuál es la diferencia entre un paralelo y un meridiano?',ans:'Los paralelos son líneas horizontales que miden latitud (Norte/Sur). Los meridianos son líneas verticales que miden longitud (Este/Oeste).'},
  {q:'¿Por qué es importante el Meridiano de Greenwich?',ans:'Porque es el punto de referencia (0° longitud) desde el cual se mide la longitud de todos los lugares del mundo y se organizan los husos horarios.'},
  {q:'Explica las tres zonas climáticas según los paralelos.',ans:'Zona tórrida (entre trópicos, la más caliente), zonas templadas (entre trópicos y círculos polares) y zonas polares (más allá de los círculos polares, las más frías).'},
  {q:'¿Qué son los husos horarios y cómo se calculan?',ans:'Son 24 franjas verticales en que se divide la Tierra para organizar la hora. Cada una corresponde a 15° de longitud (360° ÷ 24 horas = 15°).'},
];
let ansVisible = false;

function genTask(){
  sfx('click');
  const type = document.getElementById('tgType').value;
  const count = parseInt(document.getElementById('tgCount').value);
  ansVisible = false;
  const out = document.getElementById('tgOut'); out.innerHTML='';
  if(type==='identify') genIdentifyTask(out, count);
  else if(type==='classify') genClassifyTask(out, count);
  else if(type==='complete') genCompleteTask(out, count);
  else if(type==='explain') genExplainTask(out, count);
  fin('s-tareas');
}

function _instrBlock(out, title, lines){
  const ib=document.createElement('div'); ib.className='tg-instruction-block';
  ib.innerHTML=`<h4>📌 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join('');
  out.appendChild(ib);
}

function genIdentifyTask(out, count){
  _instrBlock(out,'Instrucción',['Copia en tu cuaderno; subraya, colorea o encierra el concepto geográfico indicado en cada oración. Escribe al lado qué tipo de elemento es.','<strong>Ejemplo:</strong> El Ecuador divide la Tierra. → <span style="color:var(--jade);font-weight:700;">Paralelo de referencia (Ecuador)</span>']);
  _pick(identifyTaskDB, Math.min(count, identifyTaskDB.length)).forEach((item,i)=>{
    const div=document.createElement('div'); div.className='tg-task';
    div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.type}</div></div>`;
    out.appendChild(div);
  });
}

function genClassifyTask(out, count){
  _instrBlock(out,'Instrucción',['Copia la siguiente tabla en tu cuaderno. Para cada término geográfico, escribe su tipo de línea, grados, coordenada y función de referencia.']);
  const items=_pick(classifyTaskDB, Math.min(count, classifyTaskDB.length));
  const wrap=document.createElement('div'); wrap.style.overflowX='auto';
  const th=(t,extra='')=>`<th style="padding:0.3rem 0.4rem;border:1px solid var(--border);font-size:0.72rem;text-align:center;${extra}">${t}</th>`;
  let html=`<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:520px;"><thead><tr style="background:var(--pri-gl);">${th('Término','text-align:left;')}${th('Tipo de línea')}${th('Grados')}${th('Coordenada')}${th('Función')}</tr></thead><tbody>`;
  items.forEach(it=>{
    html+=`<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td>`+Array(4).fill(`<td style="padding:0.4rem;border:1px solid var(--border);min-width:50px;"></td>`).join('')+'</tr>';
  });
  html+='</tbody></table>';
  wrap.innerHTML=html; out.appendChild(wrap);
  const ans=document.createElement('div'); ans.className='tg-answer'; ans.style.marginTop='0.8rem';
  ans.innerHTML='<strong>✅ Respuestas:</strong><br>'+items.map(it=>{
    return `<strong>${it.w}:</strong> Tipo: ${it.gen} | Grados: ${it.n} | Coordenada: ${it.g} | Función: ${it.t}`;
  }).join('<br>');
  out.appendChild(ans);
}

function genCompleteTask(out, count){
  _instrBlock(out,'Instrucción',['Copia y resuelve en tu cuaderno. Cada oración tiene un espacio ___. Elige y escribe la opción correcta.']);
  const pool=_shuffle([...completeTaskDB]);
  for(let i=0;i<count;i++){
    const item=pool[i%pool.length];
    const div=document.createElement('div'); div.className='tg-task';
    const sent=item.s.replace('___','<span class="tg-blank" style="min-width:90px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');
    div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${sent}</strong><div style="margin-top:0.4rem;font-size:0.82rem;color:var(--gray);">📋 Opciones: <strong>${item.opts.join(' | ')}</strong></div><div class="tg-answer">✅ ${item.ans}</div></div>`;
    out.appendChild(div);
  }
}

function genExplainTask(out, count){
  _instrBlock(out,'Instrucción',['Copia las siguientes preguntas en tu cuaderno y responde cada una de forma clara y completa.']);
  const pool=_shuffle([...explainQuestions]);
  for(let i=0;i<count;i++){
    const item=pool[i%pool.length];
    const div=document.createElement('div'); div.className='tg-task';
    div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.3rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.ans}</div></div>`;
    out.appendChild(div);
  }
}

function toggleAns(){ ansVisible=!ansVisible; document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none'); sfx('click'); }

// ===================== SOPA DE LETRAS =====================
// SOPA 1 — Palabras: LATITUD(H), ECUADOR(V), NORTE(H), SUR(H-rev), POLO(D↘), MAPA(V-rev)
// Verificación letra a letra incluida en comentarios
const sopaSets=[
  {
    // LATITUD  → fila 0, cols 1-7: L-A-T-I-T-U-D  ✓
    // ECUADOR  → col 0, filas 2-8: E-C-U-A-D-O-R  ✓
    // NORTE    → fila 4, cols 5-9: N-O-R-T-E       ✓
    // SUR      → fila 7, cols 4-2 (reverso): R-U-S → leer de izq a der: S-U-R  ✓
    // POLO     → diagonal ↘ inicio [5,6]: P[5,6]-O[6,7]-L[7,8]-O[8,9] ✓
    // MAPA     → col 9, filas 3-0 (reverso bottom-top): A[3,9]-P[2,9]-A[1,9]-M[0,9] → leer top-down: M-A-P-A ✓
    // GREENWICH → fila 9, cols 0-8: G-R-E-E-N-W-I-C-H ✓
    size:10,
    grid:[
      ['X','L','A','T','I','T','U','D','Z','M'],
      ['F','B','C','D','E','F','G','H','I','A'],
      ['E','J','K','L','M','N','O','P','Q','P'],
      ['C','R','S','T','U','V','W','X','Y','A'],
      ['U','Z','A','B','C','N','O','R','T','E'],
      ['A','Q','P','E','R','T','P','Y','U','I'],
      ['D','O','O','A','S','D','O','F','G','H'],
      ['O','J','L','L','S','U','R','L','O','J'],
      ['R','M','O','O','P','Q','R','S','L','O'],
      ['G','R','E','E','N','W','I','C','H','X']
    ],
    words:[
      {w:'LATITUD',  cells:[[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7]]},
      {w:'ECUADOR',  cells:[[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0]]},
      {w:'NORTE',    cells:[[4,5],[4,6],[4,7],[4,8],[4,9]]},
      {w:'SUR',      cells:[[7,6],[7,5],[7,4]]},
      {w:'POLO',     cells:[[5,2],[6,2],[7,2],[8,2]]},
      {w:'MAPA',     cells:[[0,9],[1,9],[2,9],[3,9]]},
      {w:'GREENWICH',cells:[[9,0],[9,1],[9,2],[9,3],[9,4],[9,5],[9,6],[9,7],[9,8]]}
    ]
  },
  {
    // MERIDIANO → fila 0, cols 0-8: M-E-R-I-D-I-A-N-O ✓
    // LONGITUD  → col 9, filas 0-7: L-O-N-G-I-T-U-D ✓
    // TROPICO   → fila 5, cols 1-7: T-R-O-P-I-C-O ✓
    // HEMISFERIO→ demasiado largo, usar HEMISFER fila 8 cols 0-7: H-E-M-I-S-F-E-R ✓
    // ZONA      → fila 2, cols 3-6: Z-O-N-A ✓
    // CANCER    → col 3, filas 3-8: C-A-N-C-E-R ✓
    // HUSO      → fila 7, cols 0-3: H-U-S-O ✓
    size:10,
    grid:[
      ['M','E','R','I','D','I','A','N','O','L'],
      ['X','Y','Z','A','B','C','D','E','F','O'],
      ['P','Q','R','Z','O','N','A','S','T','N'],
      ['U','V','W','C','X','Y','Z','A','B','G'],
      ['K','L','M','A','N','O','P','Q','R','I'],
      ['J','T','R','O','P','I','C','O','S','T'],
      ['I','H','G','N','F','E','D','C','B','U'],
      ['H','U','S','O','Z','Y','X','W','V','D'],
      ['H','E','M','I','S','F','E','R','A','B'],
      ['C','A','N','C','E','R','J','K','L','M']
    ],
    words:[
      {w:'MERIDIANO', cells:[[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8]]},
      {w:'LONGITUD',  cells:[[0,9],[1,9],[2,9],[3,9],[4,9],[5,9],[6,9],[7,9]]},
      {w:'TROPICO',   cells:[[5,1],[5,2],[5,3],[5,4],[5,5],[5,6],[5,7]]},
      {w:'ZONA',      cells:[[2,3],[2,4],[2,5],[2,6]]},
      {w:'CANCER',    cells:[[9,0],[9,1],[9,2],[9,3],[9,4],[9,5]]},
      {w:'HUSO',      cells:[[7,0],[7,1],[7,2],[7,3]]},
      {w:'HEMISFER',  cells:[[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,6],[8,7]]}
    ]
  }
];
let currentSopaSetIdx=0, sopaFoundWords=new Set();
let sopaFirstClickCell=null, sopaPointerStartCell=null, sopaPointerMoved=false, sopaSelectedCells=[];

function getSopaCellSize(){
  const container=document.getElementById('sopaGrid');
  if(!container||!container.parentElement) return 28;
  const avail=container.parentElement.clientWidth-16;
  const set=sopaSets[currentSopaSetIdx];
  return Math.max(20,Math.min(32,Math.floor(avail/set.size)));
}
function buildSopa(){
  const set=sopaSets[currentSopaSetIdx];
  const grid=document.getElementById('sopaGrid'); grid.innerHTML='';
  const sz=getSopaCellSize();
  grid.style.gridTemplateColumns=`repeat(${set.size},${sz}px)`;
  grid.style.gridTemplateRows=`repeat(${set.size},${sz}px)`;
  sopaFirstClickCell=null; sopaSelectedCells=[];
  for(let r=0;r<set.size;r++) for(let c=0;c<set.size;c++){
    const cell=document.createElement('div'); cell.className='sopa-cell';
    cell.style.width=sz+'px'; cell.style.height=sz+'px';
    cell.style.fontSize=Math.max(11,sz-10)+'px';
    cell.textContent=set.grid[r][c]; cell.dataset.row=r; cell.dataset.col=c;
    const alreadyFound=set.words.find(w=>sopaFoundWords.has(w.w)&&w.cells.some(([wr,wc])=>wr===r&&wc===c));
    if(alreadyFound) cell.classList.add('sopa-found');
    grid.appendChild(cell);
  }
  setupSopaEvents();
  const wl=document.getElementById('sopaWords'); wl.innerHTML='';
  set.words.forEach(wObj=>{
    const sp=document.createElement('span'); sp.className='sopa-w'+(sopaFoundWords.has(wObj.w)?' found':'');
    sp.id='sw-'+wObj.w; sp.textContent=wObj.w; wl.appendChild(sp);
  });
}
function setupSopaEvents(){
  const grid=document.getElementById('sopaGrid');
  grid.onpointerdown=e=>{
    const cell=e.target.closest('.sopa-cell'); if(!cell) return;
    e.preventDefault(); grid.setPointerCapture(e.pointerId);
    sopaPointerStartCell=cell; sopaPointerMoved=false;
    cell.classList.add('sopa-sel'); sopaSelectedCells=[cell];
  };
  grid.onpointermove=e=>{
    if(!sopaPointerStartCell) return; e.preventDefault();
    const el=document.elementFromPoint(e.clientX,e.clientY);
    const cell=el?el.closest('.sopa-cell'):null; if(!cell) return;
    const sr=parseInt(sopaPointerStartCell.dataset.row),sc=parseInt(sopaPointerStartCell.dataset.col);
    const er=parseInt(cell.dataset.row),ec=parseInt(cell.dataset.col);
    if(sr!==er||sc!==ec) sopaPointerMoved=true;
    document.querySelectorAll('.sopa-cell.sopa-sel').forEach(c=>c.classList.remove('sopa-sel'));
    sopaSelectedCells=[];
    getSopaPath(sr,sc,er,ec).forEach(([r,c])=>{
      const pc=document.querySelector(`#sopaGrid [data-row="${r}"][data-col="${c}"]`);
      if(pc){pc.classList.add('sopa-sel');sopaSelectedCells.push(pc);}
    });
  };
  grid.onpointerup=e=>{
    if(!sopaPointerStartCell) return; e.preventDefault();
    grid.releasePointerCapture(e.pointerId);
    if(sopaPointerMoved&&sopaSelectedCells.length>1){
      checkSopaSelection();
    } else {
      const cell=sopaPointerStartCell;
      document.querySelectorAll('.sopa-cell.sopa-sel').forEach(c=>c.classList.remove('sopa-sel'));
      sopaSelectedCells=[];
      if(!sopaFirstClickCell){ sopaFirstClickCell=cell; cell.classList.add('sopa-start'); }
      else if(sopaFirstClickCell===cell){ cell.classList.remove('sopa-start'); sopaFirstClickCell=null; }
      else {
        const sr=parseInt(sopaFirstClickCell.dataset.row),sc=parseInt(sopaFirstClickCell.dataset.col);
        const er=parseInt(cell.dataset.row),ec=parseInt(cell.dataset.col);
        sopaFirstClickCell.classList.remove('sopa-start'); sopaFirstClickCell=null;
        getSopaPath(sr,sc,er,ec).forEach(([r,c])=>{
          const pc=document.querySelector(`#sopaGrid [data-row="${r}"][data-col="${c}"]`);
          if(pc){pc.classList.add('sopa-sel');sopaSelectedCells.push(pc);}
        });
        checkSopaSelection();
      }
    }
    sopaPointerStartCell=null; sopaPointerMoved=false;
  };
}
function getSopaPath(r1,c1,r2,c2){
  const dr=Math.sign(r2-r1),dc=Math.sign(c2-c1);
  const lr=Math.abs(r2-r1),lc=Math.abs(c2-c1);
  if(lr!==0&&lc!==0&&lr!==lc) return [[r1,c1]];
  const len=Math.max(lr,lc); const path=[];
  for(let i=0;i<=len;i++) path.push([r1+dr*i,c1+dc*i]);
  return path;
}
function checkSopaSelection(){
  const set=sopaSets[currentSopaSetIdx];
  const word=sopaSelectedCells.map(c=>c.textContent).join('');
  const wordRev=word.split('').reverse().join('');
  const found=set.words.find(wObj=>!sopaFoundWords.has(wObj.w)&&(wObj.w===word||wObj.w===wordRev));
  if(found){
    sopaFoundWords.add(found.w);
    found.cells.forEach(([r,c])=>{
      const cell=document.querySelector(`#sopaGrid [data-row="${r}"][data-col="${c}"]`);
      if(cell){cell.classList.remove('sopa-sel','sopa-start');cell.classList.add('sopa-found');}
    });
    const sp=document.getElementById('sw-'+found.w); if(sp) sp.classList.add('found');
    if(!xpTracker.sopa.has(found.w)){xpTracker.sopa.add(found.w);pts(1);}
    sfx('ok');
    if(sopaFoundWords.size===set.words.length){fin('s-sopa');sfx('fan');showToast('🎉 ¡Todas las palabras encontradas!');}
    else showToast('✅ ¡Encontraste: '+found.w+'!');
  } else sfx('no');
  document.querySelectorAll('.sopa-cell.sopa-sel').forEach(c=>c.classList.remove('sopa-sel'));
  sopaSelectedCells=[];
}
function nextSopaSet(){
  sfx('click'); sopaFoundWords=new Set();
  currentSopaSetIdx=(currentSopaSetIdx+1)%sopaSets.length;
  buildSopa(); showToast('🔄 Nueva sopa cargada');
}

let _sopaResizeTimer=null;
window.addEventListener('resize',()=>{
  clearTimeout(_sopaResizeTimer); _sopaResizeTimer=setTimeout(()=>{if(document.getElementById('s-sopa').classList.contains('active')) buildSopa();},200);
});

// ===================== EVALUACIÓN FINAL =====================
const evalTFBank=[
  {q:'La latitud mide la distancia angular desde el Ecuador hacia los polos.',a:true},
  {q:'El Meridiano de Greenwich se encuentra a 90° de longitud.',a:false},
  {q:'El Ecuador está ubicado a 0° de latitud.',a:true},
  {q:'La zona tórrida se encuentra entre los dos Trópicos.',a:true},
  {q:'Los paralelos van de polo a polo dividiendo la longitud.',a:false},
  {q:'Honduras se encuentra en el Hemisferio Norte del Ecuador.',a:true},
  {q:'Los husos horarios se organizan cada 15° de longitud.',a:true},
  {q:'El Trópico de Cáncer está al Sur del Ecuador.',a:false},
  {q:'Las coordenadas geográficas combinan latitud y longitud.',a:true},
  {q:'El Círculo Polar Ártico está a 23° de latitud Norte.',a:false},
  {q:'El Meridiano de Greenwich divide la Tierra en Hemisferio Oriental y Occidental.',a:true},
  {q:'La longitud máxima que puede tener un punto es 180°.',a:true},
  {q:'La zona polar es la región más cálida de la Tierra.',a:false},
  {q:'Hay 24 husos horarios en el planeta.',a:true},
  {q:'El Trópico de Capricornio está a 23° 26\' Sur.',a:true},
];
const evalMCBank=[
  {q:'¿Cuál es la latitud del Ecuador?',o:['a) 90°','b) 45°','c) 0°','d) 23°'],a:2},
  {q:'¿Qué línea divide la Tierra en Hemisferio Oriental y Occidental?',o:['a) El Ecuador','b) El Trópico de Cáncer','c) El Círculo Polar','d) El Meridiano de Greenwich'],a:3},
  {q:'¿Cómo se llama la zona climática entre los dos Trópicos?',o:['a) Zona polar','b) Zona tórrida','c) Zona templada','d) Zona boreal'],a:1},
  {q:'¿Cuántos grados de longitud corresponden a cada huso horario?',o:['a) 10°','b) 24°','c) 15°','d) 30°'],a:2},
  {q:'¿En qué hemisferio se encuentra Honduras?',o:['a) Hemisferio Sur','b) Hemisferio Oriental','c) Hemisferio Norte','d) Hemisferio Polar'],a:2},
  {q:'¿Cuál es la latitud del Trópico de Capricornio?',o:['a) 23° 26\' Norte','b) 66° 34\' Norte','c) 0° Sur','d) 23° 26\' Sur'],a:3},
  {q:'Un punto con coordenadas 0°, 0° se encuentra en:',o:['a) El Polo Norte','b) El cruce del Ecuador y el Meridiano de Greenwich','c) El centro de África del Sur','d) El Trópico de Cáncer'],a:1},
  {q:'¿Cuántos meridianos puede tener la Tierra en total?',o:['a) 90','b) 180','c) 360','d) 24'],a:2},
  {q:'¿Qué tipo de línea es el Trópico de Capricornio?',o:['a) Meridiano','b) Huso horario','c) Paralelo','d) Coordenada'],a:2},
  {q:'La longitud se mide desde:',o:['a) El Ecuador','b) El Trópico de Cáncer','c) El Polo Norte','d) El Meridiano de Greenwich'],a:3},
  {q:'¿Cuántos husos horarios tiene la Tierra?',o:['a) 12','b) 36','c) 24','d) 48'],a:2},
  {q:'¿Qué ocurre en el Círculo Polar Ártico durante el solsticio de verano?',o:['a) El Sol no sale','b) El sol de medianoche (no se pone)','c) El Sol cae perpendicularmente','d) Se forman tormentas tropicales'],a:1},
  {q:'¿Cuál de estos es un paralelo?',o:['a) Meridiano de Greenwich','b) Ecuador','c) Primer Meridiano','d) Longitud 90°'],a:1},
  {q:'Las coordenadas 14°N, 87°O corresponden aproximadamente a:',o:['a) Madrid, España','b) Buenos Aires, Argentina','c) Tegucigalpa, Honduras','d) Ciudad de México'],a:2},
  {q:'¿Cuál es la zona climática de la Antártida?',o:['a) Zona tórrida','b) Zona templada','c) Zona polar','d) Zona árida'],a:2},
];
const evalCPBank=[
  {q:'La línea imaginaria que divide la Tierra en Norte y Sur se llama ___.',a:'Ecuador'},
  {q:'La distancia angular medida desde el Ecuador hacia los polos se llama ___.',a:'latitud'},
  {q:'El Meridiano de referencia universal, ubicado a 0°, se llama Meridiano de ___.',a:'Greenwich'},
  {q:'La zona climática entre los Trópicos de Cáncer y Capricornio es la zona ___.',a:'tórrida'},
  {q:'El sistema que combina latitud y longitud para ubicar puntos se llama coordenadas ___.',a:'geográficas'},
  {q:'El Trópico de Cáncer está a 23° 26\' al ___ del Ecuador.',a:'Norte'},
  {q:'Cada huso horario equivale a ___ grados de longitud.',a:'15'},
  {q:'Los meridianos van de ___ a polo.',a:'polo'},
  {q:'El Círculo Polar Ártico está a 66° 34\' de latitud ___.',a:'Norte'},
  {q:'La longitud se mide hacia el Este u ___ desde Greenwich.',a:'Oeste'},
  {q:'Honduras está en el Hemisferio ___ respecto al Ecuador.',a:'Norte'},
  {q:'El Trópico de ___ está a 23° 26\' al Sur del Ecuador.',a:'Capricornio'},
  {q:'Las líneas horizontales que miden latitud se llaman ___.',a:'paralelos'},
  {q:'Las líneas verticales que miden longitud se llaman ___.',a:'meridianos'},
  {q:'La Tierra tiene ___ husos horarios en total.',a:'24'},
];
const evalPRBank=[
  {term:'Latitud',def:'Distancia angular desde el Ecuador (N o S)'},
  {term:'Longitud',def:'Distancia angular desde Greenwich (E u O)'},
  {term:'Ecuador',def:'Paralelo de 0° que divide N y S'},
  {term:'Meridiano de Greenwich',def:'Meridiano de 0° que divide E y O'},
  {term:'Paralelo',def:'Línea horizontal que mide latitud'},
  {term:'Meridiano',def:'Línea vertical que mide longitud'},
  {term:'Coordenadas Geográficas',def:'Sistema de latitud + longitud'},
  {term:'Zona Tórrida',def:'Zona entre los dos Trópicos, la más caliente'},
  {term:'Huso Horario',def:'Franja de 15° de longitud para organizar la hora'},
  {term:'Trópico de Cáncer',def:'Paralelo a 23° 26\' Norte'},
  {term:'Trópico de Capricornio',def:'Paralelo a 23° 26\' Sur'},
  {term:'Círculo Polar Ártico',def:'Paralelo a 66° 34\' Norte'},
  {term:'Hemisferio Norte',def:'Mitad de la Tierra al norte del Ecuador'},
  {term:'Hemisferio Sur',def:'Mitad de la Tierra al sur del Ecuador'},
  {term:'Antípoda',def:'Punto opuesto en la Tierra (±180° longitud)'},
];

function genEval(){
  sfx('click');
  const cf = evalFormNum;
  window._currentEvalForm = cf;
  evalAnsVisible = false;
  const out = document.getElementById('evalOut'); out.innerHTML='';
  const pauta = document.getElementById('eval-pauta-sheet'); pauta.innerHTML='';

  const tfItems = _pick(evalTFBank,5);
  const mcItems = _pick(evalMCBank,5);
  const cpItems = _pick(evalCPBank,5);
  const prItems = _pick(evalPRBank,5);

  // ===== Sección I: V/F =====
  const s1 = document.createElement('div'); s1.className='eval-section';
  s1.innerHTML=`<h3 class="eval-sec-title">I. Verdadero o Falso (Escribe V o F) <span class="eval-pts-sec">25 pts</span></h3>`;
  tfItems.forEach((item,i)=>{
    const row=document.createElement('div'); row.className='eval-row eval-row-tf';
    row.innerHTML=`<span class="eval-num">${i+1}.</span><span class="eval-q">${item.q}</span><span class="eval-ans-box">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>`;
    s1.appendChild(row);
  });
  out.appendChild(s1);

  // ===== Sección II: Opción Múltiple =====
  const s2 = document.createElement('div'); s2.className='eval-section';
  s2.innerHTML=`<h3 class="eval-sec-title">II. Selección Múltiple <span class="eval-pts-sec">25 pts</span></h3>`;
  mcItems.forEach((item,i)=>{
    const qNum = i+6;
    const row=document.createElement('div'); row.className='eval-row eval-row-mc';
    const optsHTML = item.o.map(o=>`<span class="eval-mc-opt">${o}</span>`).join('');
    row.innerHTML=`<div class="eval-mc-wrap"><div class="eval-mc-q"><span class="eval-num">${qNum}.</span> ${item.q}</div><div class="eval-opts-grid">${optsHTML}</div></div>`;
    s2.appendChild(row);
  });
  out.appendChild(s2);

  // ===== Sección III: Completar =====
  const s3 = document.createElement('div'); s3.className='eval-section';
  s3.innerHTML=`<h3 class="eval-sec-title">III. Completar el espacio <span class="eval-pts-sec">25 pts</span></h3>`;
  cpItems.forEach((item,i)=>{
    const qNum = i+11;
    const row=document.createElement('div'); row.className='eval-row eval-row-cp';
    const qText = item.q.replace('___','<span class="eval-blank">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');
    row.innerHTML=`<span class="eval-num">${qNum}.</span><span class="eval-q">${qText}</span>`;
    s3.appendChild(row);
  });
  out.appendChild(s3);

  // ===== Sección IV: Términos Pareados =====
  const s4 = document.createElement('div'); s4.className='eval-section';
  s4.innerHTML=`<h3 class="eval-sec-title">IV. Términos Pareados <span class="eval-pts-sec">25 pts</span></h3>`;
  const shuffled=_shuffle([...prItems]);
  const headerRow = `<div class="eval-pair-header"><div class="eval-pair-h-l">📌 Términos</div><div class="eval-pair-h-r">🔑 Definiciones</div></div>`;
  const leftCol=prItems.map((it,i)=>`<div class="eval-pair-l"><span class="eval-pair-line">&nbsp;&nbsp;</span><span class="eval-num">${i+16}.</span> ${it.term}</div>`).join('');
  const rightCol=shuffled.map((it,i)=>`<div class="eval-pair-r"><span class="eval-num-r">${String.fromCharCode(65+i)}.</span> ${it.def}</div>`).join('');
  s4.innerHTML+=`${headerRow}<div class="eval-pairs-wrap"><div class="eval-col-l">${leftCol}</div><div class="eval-col-r">${rightCol}</div></div>`;
  out.appendChild(s4);

  // ===== PAUTA (página separada, solo docente) =====
  const pautaHTML = `
    <div class="eval-pauta-header">
      <h2>✅ PAUTA — Evaluación Final · Misión Coordenadas Geográficas · Forma ${cf}</h2>
      <p class="eval-pauta-warn">Documento exclusivo del docente · No distribuir al estudiante</p>
      <p class="eval-pauta-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u</p>
    </div>
    <div class="eval-pauta-grid">
      <div class="eval-pauta-col">
        <h4>I. V o F</h4>
        ${tfItems.map((it,i)=>`<div class="eval-pauta-item"><strong>${i+1}.</strong> ${it.a?'V':'F'}</div>`).join('')}
      </div>
      <div class="eval-pauta-col">
        <h4>II. Selección</h4>
        ${mcItems.map((it,i)=>`<div class="eval-pauta-item"><strong>${i+6}.</strong> ${it.o[it.a]}</div>`).join('')}
      </div>
      <div class="eval-pauta-col">
        <h4>III. Completar</h4>
        ${cpItems.map((it,i)=>`<div class="eval-pauta-item"><strong>${i+11}.</strong> ${it.a}</div>`).join('')}
      </div>
      <div class="eval-pauta-col">
        <h4>IV. Pareados</h4>
        ${prItems.map((it,i)=>{const idx=shuffled.findIndex(s=>s.term===it.term);return `<div class="eval-pauta-item"><strong>${i+16}.</strong> ${i+16}→${String.fromCharCode(65+idx)}</div>`;}).join('')}
      </div>
    </div>
  `;
  pauta.innerHTML = pautaHTML;

  // Marca de formulario (esquina)
  const formMarkOut = document.createElement('div');
  formMarkOut.className = 'eval-form-mark';
  formMarkOut.textContent = `Forma ${cf}`;
  out.appendChild(formMarkOut);

  evalFormNum++;
  saveProgress();
}

function toggleEvalAns(){
  sfx('click');
  evalAnsVisible=!evalAnsVisible;
  // Alternar visibilidad de la pauta en pantalla para revisión
  const pauta = document.getElementById('eval-pauta-sheet');
  if(pauta){
    if(evalAnsVisible){
      pauta.style.display = 'block';
      pauta.style.marginTop = '1.5rem';
      pauta.style.padding = '1rem';
      pauta.style.border = '2px dashed var(--purple)';
      pauta.style.borderRadius = '10px';
      pauta.style.background = 'var(--purple-gl, #f3f0ff)';
      showToast('👁 Pauta mostrada en pantalla');
    } else {
      pauta.style.display = 'none';
      showToast('🙈 Pauta oculta');
    }
  }
}

function printEval(){
  sfx('click');
  // Asegurar que la evaluación esté generada
  const out = document.getElementById('evalOut');
  if(!out || !out.children.length){
    genEval();
  }
  // Cerrar overlays que puedan interferir con la impresión
  document.getElementById('diplomaOverlay')?.classList.remove('open');
  document.getElementById('achPanel')?.classList.remove('open');
  // Pequeño delay para que el DOM se asiente antes de abrir el diálogo de impresión
  setTimeout(()=>{ window.print(); }, 250);
}

// ===================== LABORATORIO PLANISFERIO =====================
var LAB_STATE = { ecuador: true, tropicos: false, polares: false, meridianos: false };

function labToggleEcuador(){
  LAB_STATE.ecuador = !LAB_STATE.ecuador;
  const el = document.getElementById('lab-ecuador');
  const lbl = document.getElementById('lab-lbl-ecuador');
  if(el){ el.style.opacity = LAB_STATE.ecuador ? '1' : '0.15'; }
  if(lbl){ lbl.style.opacity = LAB_STATE.ecuador ? '1' : '0'; }
  labUpdateBtn('ecuador', LAB_STATE.ecuador ? 'on' : 'off');
  labUpdateSentence();
  if(typeof sfx === 'function') sfx('click');
}

function labToggleTropicos(){
  LAB_STATE.tropicos = !LAB_STATE.tropicos;
  ['lab-tropico-n','lab-tropico-s'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.style.opacity = LAB_STATE.tropicos ? '1' : '0.1';
  });
  ['lab-lbl-tropico-n','lab-lbl-tropico-s'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.style.opacity = LAB_STATE.tropicos ? '1' : '0';
  });
  labUpdateBtn('tropicos', LAB_STATE.tropicos ? 'on' : 'off');
  labUpdateSentence();
  if(typeof sfx === 'function') sfx('click');
}

function labTogglePolares(){
  LAB_STATE.polares = !LAB_STATE.polares;
  ['lab-polar-n','lab-polar-s'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.style.opacity = LAB_STATE.polares ? '1' : '0.1';
  });
  ['lab-lbl-polar-n','lab-lbl-polar-s'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.style.opacity = LAB_STATE.polares ? '1' : '0';
  });
  labUpdateBtn('polares', LAB_STATE.polares ? 'on' : 'off');
  labUpdateSentence();
  if(typeof sfx === 'function') sfx('click');
}

function labToggleMeridianos(){
  LAB_STATE.meridianos = !LAB_STATE.meridianos;
  document.querySelectorAll('.lab-meridiano').forEach(el=>{
    el.style.opacity = LAB_STATE.meridianos ? '0.6' : '0.1';
  });
  document.querySelectorAll('.lab-lbl-meridiano').forEach(el=>{
    el.style.opacity = LAB_STATE.meridianos ? '1' : '0';
  });
  labUpdateBtn('meridianos', LAB_STATE.meridianos ? 'on' : 'off');
  labUpdateSentence();
  if(typeof sfx === 'function') sfx('click');
}

function labUpdateBtn(group, val){
  document.querySelectorAll(`[data-lab-group="${group}"]`).forEach(btn=>{
    btn.classList.remove('active-pri','active-sec');
    if(val === 'on') btn.classList.add('active-pri');
  });
}

function labUpdateSentence(){
  const el = document.getElementById('lab-sentence');
  if(!el) return;
  const parts = [];
  if(LAB_STATE.ecuador) parts.push('el <strong>Ecuador</strong> (0° lat.)');
  if(LAB_STATE.tropicos) parts.push('los <strong>Trópicos</strong> (±23° 26\')');
  if(LAB_STATE.polares) parts.push('los <strong>Círculos Polares</strong> (±66° 34\')');
  if(LAB_STATE.meridianos) parts.push('los <strong>meridianos</strong> de longitud');
  if(parts.length === 0){
    el.innerHTML = '🌍 Activa las líneas para ver el planisferio.';
  } else {
    el.innerHTML = '🌐 Estás viendo: ' + parts.join(', ') + '.';
  }
}

function labInit(){
  // Estado inicial: Ecuador visible, resto oculto
  LAB_STATE = { ecuador: true, tropicos: false, polares: false, meridianos: false };
  // Aplicar visibilidades iniciales
  const ecEl = document.getElementById('lab-ecuador');
  const ecLbl = document.getElementById('lab-lbl-ecuador');
  if(ecEl) ecEl.style.opacity = '1';
  if(ecLbl) ecLbl.style.opacity = '1';
  ['lab-tropico-n','lab-tropico-s','lab-polar-n','lab-polar-s'].forEach(id=>{
    const el = document.getElementById(id); if(el) el.style.opacity = '0.1';
  });
  ['lab-lbl-tropico-n','lab-lbl-tropico-s','lab-lbl-polar-n','lab-lbl-polar-s'].forEach(id=>{
    const el = document.getElementById(id); if(el) el.style.opacity = '0';
  });
  document.querySelectorAll('.lab-meridiano').forEach(el=>{ el.style.opacity = '0.1'; });
  document.querySelectorAll('.lab-lbl-meridiano').forEach(el=>{ el.style.opacity = '0'; });
  labUpdateBtn('ecuador','on');
  labUpdateSentence();
}

// ===================== DIPLOMA =====================
function openDiploma(){
  sfx('click');
  const pct = getProgress();
  document.getElementById('diplPct').textContent = pct+'%';
  document.getElementById('diplPct').style.color = pct>=70?'var(--jade)':pct>=40?'var(--blue)':'var(--amber)';
  document.getElementById('diplBar').style.width = pct+'%';
  const stars = pct===100?'⭐⭐⭐⭐⭐':pct>=80?'⭐⭐⭐⭐':pct>=60?'⭐⭐⭐':pct>=40?'⭐⭐':'⭐';
  document.getElementById('diplStars').textContent = stars;
  const msgs=['🚀 ¡ÁNIMO! Comienza tu misión. ¡Cada paso cuenta!','🌱 ¡GRAN INICIO! Estás dando los primeros pasos.','📚 ¡BUEN TRABAJO! Vas progresando muy bien.','💪 ¡MUY BIEN! Dominas gran parte del contenido.','🌟 ¡INCREÍBLE avance! Estás cerca de la excelencia.','🏆 ¡EXTRAORDINARIO! Completaste TODA la misión. ¡Eres experto en Coordenadas Geográficas!'];
  const mi = pct===100?5:pct>=80?4:pct>=60?3:pct>=40?2:pct>=20?1:0;
  document.getElementById('diplMsg').textContent = msgs[mi];
  document.getElementById('diplDate').textContent = 'Honduras, '+new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});
  const achStr = unlockedAch.length>0?'🏅 Logros: '+unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(', '):'Sin logros aún — ¡sigue completando secciones!';
  document.getElementById('diplAch').textContent = achStr;
  document.getElementById('diplomaOverlay').classList.add('open');
  document.querySelector('.diploma-input').focus();
}
function closeDiploma(){ document.getElementById('diplomaOverlay').classList.remove('open'); }
function updateDiplomaName(v){ document.getElementById('diplName').textContent = v||'Estudiante'; }
function shareWA(){
  const pct = getProgress(); const name = document.getElementById('diplName').textContent;
  const stars = document.getElementById('diplStars').textContent;
  const msg = document.getElementById('diplMsg').textContent;
  const date = document.getElementById('diplDate').textContent;
  const achText = unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join('\n');
  const txt = `${stars} CONSTANCIA DE LOGRO ${stars}\n\n📝 Misión: Coordenadas Geográficas\n👤 Estudiante: ${name}\n📊 Progreso: ${pct}% completado\n⭐ XP obtenido: ${xp} de ${MXP}${achText?'\n\n🏅 Logros desbloqueados:\n'+achText:''}\n\n${msg}\n\n📅 ${date}\n🏠 Proyecto Educativo Familia Polanco-Castellanos\n🌐 policastsapien.com`;
  window.open('https://wa.me/?text='+encodeURIComponent(txt),'_blank');
}

// ===================== INIT =====================
document.addEventListener('DOMContentLoaded',()=>{
  initTheme();
  loadProgress();
  upFC(); buildQz(); buildClass(); showId(); showCmp(); buildSopa(); genEval(); labInit();
  updateRetoButtons();
  renderAchPanel();
  document.addEventListener('click',function(e){
    const panel = document.getElementById('achPanel');
    const btn = document.getElementById('achBtn');
    if(panel.classList.contains('open')&&!panel.contains(e.target)&&e.target!==btn) panel.classList.remove('open');
  });
  document.addEventListener('click',function(e){
    if(e.target===document.getElementById('diplomaOverlay')) closeDiploma();
  });
  const savedName = localStorage.getItem('nombreEstudianteCoordenadas');
  const inputName = document.querySelector('.diploma-input');
  if(savedName&&inputName){ inputName.value=savedName; updateDiplomaName(savedName); }
  if(inputName) inputName.addEventListener('input',e=>localStorage.setItem('nombreEstudianteCoordenadas',e.target.value));
  fin('s-aprende', false);
  fin('s-tipos', false);
});
