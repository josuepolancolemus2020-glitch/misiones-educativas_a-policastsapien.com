// Función para hacer la letra más grande (Accesibilidad)
 function toggleLetra() {
     document.body.classList.toggle('letra-grande');
     
     // Si tienes activados los sonidos, que suene al hacer clic
     if(typeof sfx === 'function') sfx('click'); 
     
     // Guardar la preferencia para que no se borre al cambiar de página
     const estaActivado = document.body.classList.contains('letra-grande');
     localStorage.setItem('preferenciaLetra', estaActivado);
 }
 
 // Revisar la memoria al cargar la página
 window.addEventListener('DOMContentLoaded', () => {
     if(localStorage.getItem('preferenciaLetra') === 'true') {
         document.body.classList.add('letra-grande');
     }
 });

// ===================== UTILIDADES =====================
const _pick = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
const _shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

// NUEVO: La función de mensajes que se había borrado
function fb(id, msg, isOk) {
    const el = document.getElementById(id);
    if(el) {
        el.textContent = msg;
        el.className = 'fb show ' + (isOk ? 'ok' : 'err');
    }
}

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY = 'adjetivos_v2_basica';
let xp = 0, MXP = 200, done = new Set(), evalAnsVisible = false;
let evalFormNum = 1;
let unlockedAch = [];
let darkMode = false;
let prevLevel = 0;
const TOTAL_SECTIONS = 11;

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
    
    // NUEVO: Recuperar los puntos XP guardados
    if(s.xp !== undefined) { 
        xp = s.xp; 
        updateXPBar(); 
    }
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
  
  // NUEVO: Recalcular tamaño de la Sopa de Letras al abrir la pestaña
  if (id === 's-sopa') {
      setTimeout(buildSopa, 50);
  }
}

// ===================== FLASHCARD DATA =====================
const fcData=[
  {w:'Adjetivo',a:'🎨 Palabra que acompaña al sustantivo para <strong>describirlo</strong> o <strong>determinarlo</strong>.'},
  {w:'Adjetivo Calificativo',a:'✨ Indica una <strong>cualidad</strong> o característica del sustantivo. Ej: casa <em>grande</em>, coche <em>rojo</em>.'},
  {w:'Adjetivo Demostrativo',a:'👇 Indica <strong>distancia</strong> o ubicación espacial. Ej: <em>este</em> gato, <em>esa</em> mesa, <em>aquel</em> árbol.'},
  {w:'Adjetivo Posesivo',a:'🎒 Indica <strong>pertenencia</strong> o posesión. Ej: <em>mi</em> libro, <em>tu</em> silla, <em>nuestro</em> país.'},
  {w:'Adjetivo Numeral',a:'🔢 Expresa <strong>cantidad exacta</strong> u orden. Ej: <em>dos</em> perros, el <em>primer</em> premio.'},
  {w:'Grado Positivo',a:'1️⃣ Expresa una cualidad de forma sencilla, <strong>sin compararla</strong> ni exagerarla. Ej: Juan es <em>alto</em>.'},
  {w:'Grado Comparativo',a:'2️⃣ <strong>Compara</strong> una cualidad entre dos seres. Puede ser de Superioridad, Inferioridad o Igualdad.'},
  {w:'Grado Superlativo',a:'3️⃣ Expresa la cualidad en su <strong>grado máximo</strong>. Ej: <em>altísimo</em>, <em>el más alto</em>.'},
  {w:'Concordancia',a:'⚖️ El adjetivo debe tener el mismo <strong>género</strong> (masculino/femenino) y <strong>número</strong> (singular/plural) que el sustantivo.'},
  {w:'Adjetivo Indefinido',a:'❓ Indica una cantidad <strong>imprecisa</strong> o vaga. Ej: <em>algunos</em> niños, <em>mucha</em> gente.'},
  {w:'Comparativo de Superioridad',a:'⬆️ Se forma con: <strong>más</strong> + adjetivo + <strong>que</strong>. Ej: <em>más rápido que</em>.'},
  {w:'Comparativo de Inferioridad',a:'⬇️ Se forma con: <strong>menos</strong> + adjetivo + <strong>que</strong>. Ej: <em>menos rápido que</em>.'},
  {w:'Comparativo de Igualdad',a:'🟰 Se forma con: <strong>tan</strong> + adjetivo + <strong>como</strong>. Ej: <em>tan rápido como</em>.'},
  {w:'Epíteto',a:'🌟 Adjetivo que destaca una cualidad <strong>obvia o inherente</strong> del sustantivo. Ej: la <em>blanca</em> nieve, la <em>verde</em> hierba.'},
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
  {q:'¿Para qué sirve el adjetivo calificativo?',o:['a) Para nombrar cosas','b) Para expresar una cualidad del sustantivo','c) Para indicar la acción de la oración','d) Para sustituir al nombre'],c:1},
  {q:'¿En qué grado está el adjetivo en: «Mi perro es muy rápido»?',o:['a) Positivo','b) Comparativo de superioridad','c) Superlativo','d) Demostrativo'],c:2},
  {q:'¿Qué tipo de adjetivo es «nuestro» en «nuestro colegio»?',o:['a) Calificativo','b) Demostrativo','c) Indefinido','d) Posesivo'],c:3},
  {q:'En la frase «Este libro es interesante», ¿qué es «Este»?',o:['a) Adjetivo demostrativo','b) Adjetivo numeral','c) Sustantivo propio','d) Verbo regular'],c:0},
  {q:'¿Cómo se dice «bueno» en grado superlativo absoluto?',o:['a) Más bueno','b) Buenísimo','c) Tan bueno','d) Mejor'],c:1},
  {q:'¿Qué adjetivo concuerda con «las montañas»?',o:['a) alto','b) altas','c) alta','d) altos'],c:1},
  {q:'En la frase «Tengo tres gatos», ¿qué tipo de adjetivo es «tres»?',o:['a) Posesivo','b) Indefinido','c) Numeral','d) Calificativo'],c:2},
  {q:'El grado comparativo de igualdad se forma con las palabras:',o:['a) más ... que','b) menos ... que','c) muy ... ísimo','d) tan ... como'],c:3},
  {q:'¿Cuál es un adjetivo indefinido?',o:['a) Aquel','b) Muchos','c) Azul','d) Primer'],c:1},
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
    label:['Calificativo','Posesivo'], headA:'✨ Calificativo', headB:'🎒 Posesivo', colA:'calificativo', colB:'posesivo',
    words:[{w:'grande',t:'calificativo'},{w:'mi',t:'posesivo'},{w:'rojo',t:'calificativo'},{w:'nuestro',t:'posesivo'},{w:'veloz',t:'calificativo'},{w:'su',t:'posesivo'},{w:'tu',t:'posesivo'},{w:'hermoso',t:'calificativo'},{w:'inteligente',t:'calificativo'},{w:'sus',t:'posesivo'}]
  },
  {
    label:['Positivo','Superlativo'], headA:'1️⃣ Positivo', headB:'3️⃣ Superlativo', colA:'positivo', colB:'superlativo',
    words:[{w:'alto',t:'positivo'},{w:'altísimo',t:'superlativo'},{w:'bueno',t:'positivo'},{w:'buenísimo',t:'superlativo'},{w:'feliz',t:'positivo'},{w:'muy feliz',t:'superlativo'},{w:'rápido',t:'positivo'},{w:'rapidísimo',t:'superlativo'},{w:'lindo',t:'positivo'},{w:'el más lindo',t:'superlativo'}]
  },
  {
    label:['Demostrativo','Numeral'], headA:'👇 Demostrativo', headB:'🔢 Numeral', colA:'demostrativo', colB:'numeral',
    words:[{w:'este',t:'demostrativo'},{w:'dos',t:'numeral'},{w:'esa',t:'demostrativo'},{w:'tercer',t:'numeral'},{w:'aquel',t:'demostrativo'},{w:'cinco',t:'numeral'},{w:'aquellos',t:'demostrativo'},{w:'estas',t:'demostrativo'},{w:'veinte',t:'numeral'},{w:'primer',t:'numeral'}]
  },
  {
    label:['Singular','Plural'], headA:'👤 Singular', headB:'👥 Plural', colA:'singular', colB:'plural',
    words:[{w:'rojo',t:'singular'},{w:'rápidas',t:'plural'},{w:'lindo',t:'singular'},{w:'altos',t:'plural'},{w:'enorme',t:'singular'},{w:'inteligentes',t:'plural'},{w:'pequeña',t:'singular'},{w:'pequeños',t:'plural'},{w:'nuestra',t:'singular'},{w:'nuestros',t:'plural'}]
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
         ev.stopPropagation(); // Evita que el clic se pase a la caja de atrás
         
         // El Candado Inteligente
         if (clsSelectedWord !== null) {
             // Manos llenas: En lugar de sacar la palabra, hacemos clic en la caja contenedora
             // para que la nueva palabra seleccionada caiga aquí adentro.
             col.click(); 
         } else {
             // Manos vacías: Devolvemos la palabra al banco
             document.getElementById('clsBank').appendChild(original);
             original.classList.remove('sel-word');
             item.remove();
             if(typeof sfx === 'function') sfx('click');
         }
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
  {s:['El','perro','grande','corre.'],c:2,art:'Adjetivo calificativo'},
  {s:['Quiero','este','libro','ahora.'],c:1,art:'Adjetivo demostrativo'},
  {s:['Nosotros','tenemos','dos','gatos.'],c:2,art:'Adjetivo numeral'},
  {s:['Esa','casa','es','nuestra.'],c:3,art:'Adjetivo posesivo'},
  {s:['El','cielo','es','azul','hoy.'],c:3,art:'Adjetivo calificativo'},
  {s:['Aquel','árbol','es','muy','viejo.'],c:0,art:'Adjetivo demostrativo'},
  {s:['Carlos','es','el','más','rápido.'],c:4,art:'Adjetivo en grado superlativo'},
  {s:['Asistió','mucha','gente','al','evento.'],c:1,art:'Adjetivo indefinido'},
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
  if(idDone) return; // 👈 1. SI EL CANDADO ESTÁ CERRADO, NO HACER NADA
  
  document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected'));
  span.classList.add('selected');
  
  if(i===idData[idIdx].c){
    idDone = true; // 👈 2. RESPUESTA CORRECTA: CERRAMOS EL CANDADO
    span.classList.add('id-ok'); fb('fbId','¡Correcto! +5 XP',true);
    if(!xpTracker.id.has(idIdx)){ xpTracker.id.add(idIdx); pts(5); }
    sfx('ok');
  } else {
    span.classList.add('id-no'); fb('fbId','Ese no es el adjetivo solicitado.',false); sfx('no');
  }
}
function nextId(){ sfx('click'); idIdx++; showId(); document.getElementById('fbId').classList.remove('show'); }
function resetId(){ sfx('click'); idIdx=0; showId(); document.getElementById('fbId').classList.remove('show'); }

// ===================== COMPLETA =====================
const cmpData=[
  {s:'Las manzanas de mi huerto están muy ___.',opts:['rojo','rojos','rojas'],c:2},
  {s:'Juan es ___ rápido que su hermano.',opts:['muy','más','tan'],c:1},
  {s:'Compré un coche ___ porque me gusta la velocidad.',opts:['rápido','rápidas','rápidos'],c:0},
  {s:'María y Lucía son niñas muy ___.',opts:['inteligente','inteligentes','inteligento'],c:1},
  {s:'Me duele ___ pie izquierdo después de correr.',opts:['mi','mis','míos'],c:0},
  {s:'El pastel que preparó mamá estaba ___.',opts:['buena','buenísimo','buenísimos'],c:1},
  {s:'___ casa de la esquina está a la venta.',opts:['Este','Aquella','Esos'],c:1},
  {s:'Hoy hace un clima ___ agradable como ayer.',opts:['más','menos','tan'],c:2},
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
    fb('fbCmp','Incorrecto. Fíjate en la concordancia.',false); sfx('no');
  }
  setTimeout(()=>{ cmpIdx++; document.getElementById('fbCmp').classList.remove('show'); showCmp(); }, 1600);
}

// ===================== RETO FINAL =====================
const retoPairs = [
  {
    label: ['Calificativo','Determinativo'], btnA: '✨ Calificativo', btnB: '📌 Determinativo',
    colA: 'calificativo', colB: 'determinativo',
    words: [
      {w:'rojo',t:'calificativo'},{w:'este',t:'determinativo'},{w:'enorme',t:'calificativo'},
      {w:'mi',t:'determinativo'},{w:'inteligente',t:'calificativo'},{w:'tres',t:'determinativo'},
      {w:'suave',t:'calificativo'},{w:'aquel',t:'determinativo'},{w:'veloz',t:'calificativo'},
      {w:'nuestro',t:'determinativo'},{w:'lindo',t:'calificativo'},{w:'algunos',t:'determinativo'},
    ]
  },
  {
    label: ['Positivo','Superlativo'], btnA: '1️⃣ Positivo', btnB: '3️⃣ Superlativo',
    colA: 'positivo', colB: 'superlativo',
    words: [
      {w:'alto',t:'positivo'},{w:'altísimo',t:'superlativo'},{w:'bueno',t:'positivo'},{w:'buenísimo',t:'superlativo'},
      {w:'feliz',t:'positivo'},{w:'muy feliz',t:'superlativo'},{w:'rápido',t:'positivo'},{w:'el más rápido',t:'superlativo'},
      {w:'lindo',t:'positivo'},{w:'lindísimo',t:'superlativo'},
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
  {s:'El perro es muy rápido.',type:'Adjetivo calificativo (rápido)'},
  {s:'Ese libro es mío.',type:'Demostrativo (Ese) / Posesivo (mío)'},
  {s:'La niña dibujó una casa grande.',type:'Calificativo (grande)'},
  {s:'Compré tres manzanas.',type:'Numeral (tres)'},
  {s:'El cielo azul me relaja.',type:'Calificativo (azul)'},
  {s:'Nuestra abuela nos visitó.',type:'Posesivo (Nuestra)'},
  {s:'Algunos niños juegan allí.',type:'Indefinido (Algunos)'},
  {s:'El primer lugar es para ti.',type:'Numeral (primer)'},
  {s:'Mi coche es más veloz que el tuyo.',type:'Comparativo (más veloz)'},
  {s:'Ese edificio es altísimo.',type:'Superlativo (altísimo)'},
];
const classifyTaskDB=[
  {w:'grande',gen:'f/m',n:'singular',g:'positivo',t:'calificativo'},
  {w:'nuestros',gen:'m',n:'plural',g:'-',t:'posesivo'},
  {w:'altísimas',gen:'f',n:'plural',g:'superlativo',t:'calificativo'},
  {w:'aquella',gen:'f',n:'singular',g:'-',t:'demostrativo'},
  {w:'primer',gen:'m',n:'singular',g:'-',t:'numeral'},
  {w:'rojos',gen:'m',n:'plural',g:'positivo',t:'calificativo'},
  {w:'algunas',gen:'f',n:'plural',g:'-',t:'indefinido'},
  {w:'buenísimo',gen:'m',n:'singular',g:'superlativo',t:'calificativo'},
];
const completeTaskDB=[
  {s:'Mi abuela cocinó una torta ___.',opts:['delicioso','deliciosas','deliciosa'],ans:'deliciosa'},
  {s:'En la granja hay ___ caballos.',opts:['dos','segundo','mucho'],ans:'dos'},
  {s:'Este problema de matemáticas es ___ difícil que el anterior.',opts:['tan','más','mucho'],ans:'más'},
  {s:'Me gusta el vestido ___ que está en la vitrina.',opts:['roja','rojos','rojo'],ans:'rojo'},
  {s:'Ayer conocí a unos chicos muy ___.',opts:['simpático','simpáticos','simpáticas'],ans:'simpáticos'},
  {s:'___ gatos de mi vecina maúllan mucho.',opts:['Esos','Esa','Aquel'],ans:'Esos'},
  {s:'El corredor llegó en ___ lugar.',opts:['uno','primer','muchos'],ans:'primer'},
  {s:'Mi dibujo es tan ___ como el tuyo.',opts:['bonito','bonitos','bonitas'],ans:'bonito'},
];
const explainQuestions=[
  {q:'¿Qué es un adjetivo y para qué sirve? Da un ejemplo.',ans:'Acompaña al sustantivo para describirlo o determinarlo. Ej: casa grande.'},
  {q:'¿Cuál es la diferencia entre un adjetivo calificativo y uno demostrativo?',ans:'El calificativo describe una cualidad (bonito) y el demostrativo indica distancia (este, ese, aquel).'},
  {q:'¿Qué significa que el adjetivo debe concordar con el sustantivo?',ans:'Que deben tener el mismo género (masculino/femenino) y número (singular/plural).'},
  {q:'Explica los tres grados del adjetivo calificativo.',ans:'Positivo (normal), Comparativo (compara con otro) y Superlativo (grado máximo).'},
  {q:'¿Qué es un adjetivo posesivo? Menciona dos ejemplos.',ans:'Indican a quién pertenece algo. Ej: mi, tu, su, nuestro.'},
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
  _instrBlock(out,'Instrucción',['Copia en tu cuaderno; subraya, colorea o encierra el adjetivo en las siguientes oraciones. Escribe al lado qué tipo de adjetivo es.','<strong>Ejemplo:</strong> El perro grande corre. → <span style="color:var(--jade);font-weight:700;">Adjetivo calificativo (grande)</span>']);
  _pick(identifyTaskDB, Math.min(count, identifyTaskDB.length)).forEach((item,i)=>{
    const div=document.createElement('div'); div.className='tg-task';
    div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.type}</div></div>`;
    out.appendChild(div);
  });
}

function genClassifyTask(out, count){
  _instrBlock(out,'Instrucción',['Copia la siguiente tabla en tu cuaderno. Para cada adjetivo, escribe su género, número, grado (si aplica) y tipo (calificativo o determinativo).']);
  const items=_pick(classifyTaskDB, Math.min(count, classifyTaskDB.length));
  const wrap=document.createElement('div'); wrap.style.overflowX='auto';
  const th=(t,extra='')=>`<th style="padding:0.3rem 0.4rem;border:1px solid var(--border);font-size:0.72rem;text-align:center;${extra}">${t}</th>`;
  let html=`<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:520px;"><thead><tr style="background:var(--pri-gl);">${th('Adjetivo','text-align:left;')}${th('Género')}${th('Número')}${th('Grado')}${th('Tipo')}</tr></thead><tbody>`;
  items.forEach(it=>{
    html+=`<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td>`+Array(4).fill(`<td style="padding:0.4rem;border:1px solid var(--border);min-width:50px;"></td>`).join('')+'</tr>';
  });
  html+='</tbody></table>';
  wrap.innerHTML=html; out.appendChild(wrap);
  const ans=document.createElement('div'); ans.className='tg-answer'; ans.style.marginTop='0.8rem';
  ans.innerHTML='<strong>✅ Respuestas:</strong><br>'+items.map(it=>{
    return `<strong>${it.w}:</strong> Género: ${it.gen} | Número: ${it.n} | Grado: ${it.g} | Tipo: ${it.t}`;
  }).join('<br>');
  out.appendChild(ans);
}

function genCompleteTask(out, count){
  _instrBlock(out,'Instrucción',['Copia y resuelve en tu cuaderno. Cada oración tiene un espacio ___. Elige y escribe la opción correcta que concuerde en género y número con el sustantivo.']);
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
  _instrBlock(out,'Instrucción',['Copia las siguientes preguntas en tu cuaderno y responde cada una de forma clara.']);
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
const sopaSets=[
  {
    // Horizontal: POSITIVO, MEJOR
    // Vertical: GRANDE
    // Diagonal↘: ADJETIVO, ALTO
    // Al revés (Horizontal/Vertical/Diagonal): LINDO, ESTE, MIO
    size:10,
    grid:[
      ['A','Q','W','R','O','D','N','I','L','G'],
      ['Z','D','Y','U','I','P','K','L','M','R'],
      ['M','E','J','O','R','P','S','F','H','A'],
      ['F','G','H','E','J','K','L','Z','X','N'],
      ['C','R','T','Y','T','U','I','O','P','D'],
      ['A','K','D','F','G','I','H','J','K','E'],
      ['W','L','O','W','E','R','V','T','Y','U'],
      ['B','I','T','X','C','V','B','O','N','M'],
      ['M','Q','Z','O','E','T','S','E','U','I'],
      ['V','P','O','S','I','T','I','V','O','P']
    ],
    words:[
      {w:'ADJETIVO', cells:[[0,0],[1,1],[2,2],[3,3],[4,4],[5,5],[6,6],[7,7]]},
      {w:'POSITIVO', cells:[[9,1],[9,2],[9,3],[9,4],[9,5],[9,6],[9,7],[9,8]]},
      {w:'GRANDE',   cells:[[0,9],[1,9],[2,9],[3,9],[4,9],[5,9]]},
      {w:'LINDO',    cells:[[0,8],[0,7],[0,6],[0,5],[0,4]]},
      {w:'MEJOR',    cells:[[2,0],[2,1],[2,2],[2,3],[2,4]]},
      {w:'ALTO',     cells:[[5,0],[6,1],[7,2],[8,3]]},
      {w:'MIO',      cells:[[8,0],[7,1],[6,2]]},
      {w:'ESTE',     cells:[[8,7],[8,6],[8,5],[8,4]]}
    ]
  },
  {
    // Horizontal: NUMERAL, PEOR
    // Vertical: POSESIVO
    // Diagonal↘: AQUELLA 
    // Diagonal↗: MEJOR
    // Al revés (Diagonal/Vertical/Horizontal): POCOS, ENORME, PLURAL
    size:10,
    grid:[
      ['W','Z','N','U','M','E','R','A','L','T'],
      ['P','A','Q','W','E','R','T','Y','U','I'],
      ['O','S','Q','P','E','O','R','D','F','G'],
      ['S','H','J','U','K','L','Z','X','P','E'],
      ['E','C','V','B','E','R','N','O','M','N'],
      ['S','Q','W','E','O','L','C','R','T','O'],
      ['I','Y','U','J','I','O','L','P','A','R'],
      ['V','S','E','D','S','F','G','A','H','M'],
      ['O','M','J','K','L','Z','X','C','V','E'],
      ['B','N','M','L','A','R','U','L','P','W']
    ],
    words:[
      {w:'POSESIVO', cells:[[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0]]},
      {w:'NUMERAL',  cells:[[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8]]},
      {w:'AQUELLA',  cells:[[1,1],[2,2],[3,3],[4,4],[5,5],[6,6],[7,7]]},
      {w:'PLURAL',   cells:[[9,8],[9,7],[9,6],[9,5],[9,4],[9,3]]},
      {w:'ENORME',   cells:[[8,9],[7,9],[6,9],[5,9],[4,9],[3,9]]},
      {w:'POCOS',    cells:[[3,8],[4,7],[5,6],[6,5],[7,4]]},
      {w:'PEOR',     cells:[[2,3],[2,4],[2,5],[2,6]]},
      {w:'MEJOR',    cells:[[8,1],[7,2],[6,3],[5,4],[4,5]]}
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
  {q:'El adjetivo es una palabra que acompaña al sustantivo para describirlo.',a:true},
  {q:'Los adjetivos determinativos expresan una cualidad como "bueno" o "grande".',a:false},
  {q:'El grado comparativo sirve para comparar una cualidad entre dos elementos.',a:true},
  {q:'El adjetivo "rapidísimo" está en grado superlativo.',a:true},
  {q:'Los adjetivos posesivos indican distancia (como "este" o "aquel").',a:false},
  {q:'El adjetivo siempre debe tener el mismo género y número que el sustantivo.',a:true},
  {q:'"Primer" es un adjetivo numeral.',a:true},
  {q:'Los adjetivos "rojo" y "azul" son determinativos.',a:false},
  {q:'"Mi", "tu" y "su" son ejemplos de adjetivos posesivos.',a:true},
  {q:'El grado positivo expresa la cualidad en su máxima intensidad.',a:false},
  {q:'"Menos inteligente que" es un comparativo de inferioridad.',a:true},
  {q:'El adjetivo indefinido indica una cantidad exacta.',a:false},
  {q:'"Tan alto como" es un comparativo de igualdad.',a:true},
  {q:'"Aquella" es un adjetivo demostrativo.',a:true},
  {q:'Un adjetivo calificativo limita el significado del sustantivo sin describirlo.',a:false},
];
const evalMCBank=[
  {q:'¿Cuál de las siguientes palabras es un adjetivo calificativo?',o:['a) Perro','b) Grande','c) Correr','d) Nosotros'],a:1},
  {q:'El adjetivo en «Mi casa nueva» es:',o:['a) Mi','b) casa','c) nueva','d) Mi y nueva'],a:3},
  {q:'¿A qué tipo de adjetivo pertenece «este»?',o:['a) Calificativo','b) Numeral','c) Demostrativo','d) Indefinido'],a:2},
  {q:'¿En qué grado está el adjetivo en «Es la más lista»?',o:['a) Positivo','b) Comparativo','c) Superlativo','d) Numeral'],a:2},
  {q:'«Tus zapatos» contiene un adjetivo:',o:['a) Calificativo','b) Posesivo','c) Demostrativo','d) Numeral'],a:1},
  {q:'¿Cuál es el comparativo de superioridad de «bueno»?',o:['a) Muy bueno','b) Buenísimo','c) Mejor','d) Más bueno'],a:2},
  {q:'La concordancia del adjetivo se da en:',o:['a) Género y número','b) Tiempo y persona','c) Modo y tiempo','d) Sólo en número'],a:0},
  {q:'«Algunos días» incluye un adjetivo:',o:['a) Numeral','b) Indefinido','c) Demostrativo','d) Posesivo'],a:1},
  {q:'¿Cuál es la forma superlativa de «malo»?',o:['a) Peor','b) Malísimo','c) Pésimo','d) b y c son correctas'],a:3},
  {q:'¿Qué adjetivo es numeral?',o:['a) Muchos','b) Aquel','c) Tercer','d) Verde'],a:2},
  {q:'En «El cielo azul», «azul» es un adjetivo:',o:['a) Demostrativo','b) Posesivo','c) Indefinido','d) Calificativo'],a:3},
  {q:'«Tan rápido como» es un comparativo de:',o:['a) Superioridad','b) Inferioridad','c) Igualdad','d) Superlativo'],a:2},
  {q:'El adjetivo que indica a quién pertenece algo es:',o:['a) Demostrativo','b) Posesivo','c) Indefinido','d) Calificativo'],a:1},
  {q:'¿En qué grado está «veloz»?',o:['a) Positivo','b) Comparativo','c) Superlativo','d) Posesivo'],a:0},
  {q:'«Ese carro» tiene un adjetivo que indica:',o:['a) Distancia','b) Posesión','c) Cualidad','d) Cantidad'],a:0},
];
const evalCPBank=[
  {q:'El adjetivo que expresa una cualidad en su máxima intensidad está en grado ___.',a:'superlativo'},
  {q:'Los adjetivos "este", "ese" y "aquel" son ___.',a:'demostrativos'},
  {q:'Para comparar algo indicando que es menor, usamos el comparativo de ___.',a:'inferioridad'},
  {q:'El adjetivo concuerda en ___ y número con el sustantivo.',a:'género'},
  {q:'"Mi", "tu", "su" son adjetivos ___.',a:'posesivos'},
  {q:'Los adjetivos ___ indican una cualidad o característica, como "rojo" o "alto".',a:'calificativos'},
  {q:'"Un", "dos", "primer" son adjetivos ___.',a:'numerales'},
  {q:'El adjetivo que no exagera ni compara la cualidad está en grado ___.',a:'positivo'},
  {q:'"Más rápido que" es un comparativo de ___.',a:'superioridad'},
  {q:'El adjetivo que indica una cantidad imprecisa, como "algunos", es ___.',a:'indefinido'},
  {q:'El adjetivo debe coincidir con el sustantivo en género y ___.',a:'número'},
  {q:'La terminación "-ísimo" se usa para formar el grado ___.',a:'superlativo'},
  {q:'Un adjetivo que acompaña al nombre sin expresar cualidad es un adjetivo ___.',a:'determinativo'},
  {q:'Para indicar igualdad, usamos la fórmula "tan ... ___".',a:'como'},
  {q:'"Peor" es el comparativo de superioridad del adjetivo ___.',a:'malo'},
];
const evalPRBank=[
  {term:'Adjetivo Calificativo',def:'Expresa una cualidad (ej. grande)'},
  {term:'Adjetivo Demostrativo',def:'Indica distancia (ej. este, ese)'},
  {term:'Adjetivo Posesivo',def:'Indica pertenencia (ej. mi, tu)'},
  {term:'Adjetivo Numeral',def:'Indica cantidad exacta (ej. dos)'},
  {term:'Adjetivo Indefinido',def:'Indica cantidad vaga (ej. algunos)'},
  {term:'Grado Positivo',def:'Cualidad sin alterar (ej. alto)'},
  {term:'Grado Comparativo',def:'Compara cualidades entre dos (ej. más alto que)'},
  {term:'Grado Superlativo',def:'Cualidad máxima (ej. altísimo)'},
  {term:'Concordancia',def:'Igualdad de género y número'},
  {term:'Epíteto',def:'Cualidad inherente u obvia (ej. blanca nieve)'},
  {term:'Inferioridad',def:'menos ... que'},
  {term:'Superioridad',def:'más ... que'},
  {term:'Igualdad',def:'tan ... como'},
  {term:'Género',def:'Masculino o Femenino'},
  {term:'Número',def:'Singular o Plural'},
];

function genEval(){
  sfx('click');
  const cf = evalFormNum;
  window._currentEvalForm = cf;
  evalFormNum = (evalFormNum % 10) + 1;
  saveProgress();
  document.getElementById('eval-screen-title').textContent = `📝 Evaluación Final — Forma ${cf} · Los Adjetivos`;
  evalAnsVisible = false;
  const out = document.getElementById('evalOut'); out.innerHTML='';
  const bar = document.createElement('div'); bar.className='eval-score-bar';
  bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje — 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-tf">V/F 25pts</span><span class="eval-score-pill esp-mc">Selección 25pts</span><span class="eval-score-pill esp-cp">Completar 25pts</span><span class="eval-score-pill esp-pr">Pareados 25pts</span></div>`;
  out.appendChild(bar);
  const tfItems = _pick(evalTFBank,5);
  const s1 = document.createElement('div'); s1.innerHTML='<div class="eval-section-title">I. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  tfItems.forEach((item,i)=>{
    const d=document.createElement('div'); d.className='eval-item';
    d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}"> Falso</label></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div>`;
    s1.appendChild(d);
  });
  out.appendChild(s1);
  const mcItems = _pick(evalMCBank,5);
  const s2 = document.createElement('div'); s2.innerHTML='<div class="eval-section-title">II. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  mcItems.forEach((item,i)=>{
    const d=document.createElement('div'); d.className='eval-item';
    const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join('');
    d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1+5}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div>`;
    s2.appendChild(d);
  });
  out.appendChild(s2);
  const cpItems = _pick(evalCPBank,5);
  const s3 = document.createElement('div'); s3.innerHTML='<div class="eval-section-title">III. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  cpItems.forEach((item,i)=>{
    const d=document.createElement('div'); d.className='eval-item';
    const qHtml=item.q.replace('___','<span class="eval-blank">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');
    d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1+10}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div>`;
    s3.appendChild(d);
  });
  out.appendChild(s3);
  const prItems = _pick(evalPRBank,5);
  const shuffledDefs = [...prItems].sort(()=>Math.random()-0.5);
  const letters = ['A','B','C','D','E'];
  const s4 = document.createElement('div'); s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  const matchCard = document.createElement('div'); matchCard.className='eval-item';
  let colLeft='<div class="eval-match-col"><h4>📌 Términos</h4>';
  prItems.forEach((item,i)=>{ colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> <span class="eval-match-line">&nbsp;&nbsp;&nbsp;</span> ${item.term}</div>`; });
  colLeft+='</div>';
  let colRight='<div class="eval-match-col"><h4>🔑 Definiciones</h4>';
  shuffledDefs.forEach((item,i)=>{ colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`; });
  colRight+='</div>';
  const ansKey = prItems.map((item,i)=>{ const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)]; return `${i+16}→${letter}`; }).join(' · ');
  matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div>`;
  s4.appendChild(matchCard); out.appendChild(s4);
  window._evalPrintData = {tf:tfItems, mc:mcItems, cp:cpItems, pr:{terms:prItems,shuffledDefs,letters}};
  fin('s-evaluacion');
}
function toggleEvalAns(){
  evalAnsVisible = !evalAnsVisible;
  document.querySelectorAll('#evalOut .eval-answer').forEach(el=>el.style.display=evalAnsVisible?'block':'none');
  sfx('click');
}
function printEval(){
  if(!window._evalPrintData){ showToast('⚠️ Genera una evaluación primero'); return; }
  sfx('click');
  const forma = window._currentEvalForm || 1;
  const d = window._evalPrintData;

  // ── I. Verdadero o Falso — raya antes del enunciado
  let s1=`<div class="sec-title">I. Verdadero o Falso <span style="font-weight:400;font-size:8pt;color:#555;">(Escribe V o F)</span><span class="pts-pill">25 pts</span></div>`;
  d.tf.forEach((it,i)=>{ s1+=`<div class="tf-row"><span class="qn">${i+1}.</span><span class="tf-blank"></span><span class="tf-text">${it.q}</span></div>`; });

  // ── II. Selección múltiple — 2 columnas de preguntas, 4 opciones en fila
  let s2=`<div class="sec-title">II. Selección Múltiple<span class="pts-pill">25 pts</span></div><div class="mc-grid">`;
  d.mc.forEach((it,i)=>{ const opts=it.o.map((op,oi)=>`<label class="mc-opt"><input type="radio" name="mc${i}"> ${op}</label>`).join(''); s2+=`<div class="mc-item"><div class="mc-q"><span class="qn">${i+6}.</span><span>${it.q}</span></div><div class="mc-opts">${opts}</div></div>`; });
  s2+=`</div>`;

  // ── III. Completar
  let s3=`<div class="sec-title">III. Completar el espacio<span class="pts-pill">25 pts</span></div>`;
  d.cp.forEach((it,i)=>{ const q=it.q.replace('___','<span class="cp-blank"></span>'); s3+=`<div class="cp-row"><span class="qn">${i+11}.</span><span class="cp-text">${q}</span></div>`; });

  // ── IV. Pareados
  let colL='<div class="pr-col"><div class="pr-head">📌 Términos</div>';
  d.pr.terms.forEach((it,i)=>{ colL+=`<div class="pr-item"><span class="pr-num">${i+16}.</span><span class="pr-line"></span>${it.term}</div>`; });
  colL+='</div>';
  let colR='<div class="pr-col"><div class="pr-head">🔑 Definiciones</div>';
  d.pr.shuffledDefs.forEach((it,i)=>{ colR+=`<div class="pr-item"><span class="pr-num">${d.pr.letters[i]}.</span>${it.def}</div>`; });
  colR+='</div>';
  let s4=`<div class="sec-title">IV. Términos Pareados<span class="pts-pill">25 pts</span></div><div class="pr-grid">${colL}${colR}</div>`;

  // ── Pauta
  let pR='';
  pR+=`<div class="p-sec"><div class="p-ttl">I. V o F</div><table class="p-tbl">`;
  d.tf.forEach((it,i)=>{ pR+=`<tr><td class="pn">${i+1}.</td><td class="pa">${it.a?'V':'F'}</td></tr>`; });
  pR+=`</table></div><div class="p-sec"><div class="p-ttl">II. Selección</div><table class="p-tbl">`;
  d.mc.forEach((it,i)=>{ pR+=`<tr><td class="pn">${i+6}.</td><td class="pa">${it.o[it.a]}</td></tr>`; });
  pR+=`</table></div><div class="p-sec"><div class="p-ttl">III. Completar</div><table class="p-tbl">`;
  d.cp.forEach((it,i)=>{ pR+=`<tr><td class="pn">${i+11}.</td><td class="pa">${it.a}</td></tr>`; });
  pR+=`</table></div><div class="p-sec"><div class="p-ttl">IV. Pareados</div><table class="p-tbl">`;
  d.pr.terms.forEach((it,i)=>{ const l=d.pr.letters[d.pr.shuffledDefs.findIndex(df=>df.def===it.def)]; pR+=`<tr><td class="pn">${i+16}.</td><td class="pa">${i+16}→${l}</td></tr>`; });
  pR+=`</table></div>`;

  const doc=`<!DOCTYPE html><html lang="es"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Evaluación Los Adjetivos · Forma ${forma}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:Arial,Helvetica,sans-serif;font-size:12pt;color:#111;background:#fff;padding:4mm 6mm;}
/* ENCABEZADO */
.ph{margin-bottom:0.5rem;}
.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;}
.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}
.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}
.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}
.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}
.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}
.ph-crit{font-size:11pt;text-align:center;color:#555;margin-top:0.15rem;}
/* SECCIONES */
.sec-title{font-size:9pt;font-weight:700;padding:0.2rem 0.45rem;margin:0.38rem 0 0.18rem;border-left:4px solid #419b88;background:#e5f2ef;display:flex;justify-content:space-between;align-items:center;}
.pts-pill{font-size:7.5pt;background:#419b88;color:white;padding:0.08rem 0.35rem;border-radius:8px;}
.qn{font-weight:700;min-width:20px;flex-shrink:0;}
/* V/F */
.tf-row{display:flex;align-items:baseline;gap:0.25rem;font-size:9pt;line-height:1.32;padding:0.18rem 0.2rem;border-bottom:1px solid #eee;}
.tf-blank{display:inline-block;min-width:38px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.15rem;}
.tf-text{flex:1;}
/* MC */
.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.22rem 0.4rem;margin-bottom:0.18rem;break-inside:avoid;page-break-inside:avoid;}
.mc-q{font-size:9pt;line-height:1.32;display:flex;gap:0.25rem;margin-bottom:0.12rem;}
.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.18rem 0.5rem;}
.mc-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:0.05rem 0.2rem;margin-left:1.2rem;}
.mc-opt{font-size:8.5pt;display:flex;align-items:center;gap:0.2rem;}
.mc-opt input{width:11px;height:11px;flex-shrink:0;}
/* Completar */
.cp-row{display:flex;align-items:baseline;gap:0.25rem;font-size:9pt;line-height:1.32;padding:0.18rem 0.2rem;border-bottom:1px solid #eee;}
.cp-text{flex:1;}
.cp-blank{display:inline-block;min-width:140px;border-bottom:1.5px solid #111;margin:0 0.1rem;}
/* Pareados */
.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.25rem 0.5rem;margin-top:0.15rem;}
.pr-head{font-size:8pt;font-weight:700;color:#555;margin-bottom:0.18rem;}
.pr-item{font-size:8.5pt;padding:0.28rem 0.3rem;background:#e5f2ef;border-radius:3px;margin-bottom:0.18rem;display:flex;align-items:center;gap:0.2rem;line-height:1.6;}
.pr-num{font-weight:700;color:#419b88;min-width:17px;flex-shrink:0;}
.pr-line{display:inline-block;min-width:17px;border-bottom:1.5px solid #111;margin-right:0.12rem;flex-shrink:0;}
/* Pauta */
.pauta-wrap{page-break-before:always;padding-top:0.4rem;}
.p-head{border-bottom:2px solid #333;padding-bottom:0.35rem;margin-bottom:0.5rem;text-align:center;}
.p-main{font-size:9.5pt;font-weight:700;}
.p-sub{font-size:7pt;color:#c00;font-weight:700;margin:0.08rem 0;}
.p-meta{font-size:7pt;color:#555;}
.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.9rem;}
.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.28rem 0.45rem;}
.p-ttl{font-size:8pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.1rem;margin-bottom:0.18rem;}
.p-tbl{width:100%;border-collapse:collapse;font-size:7.5pt;}
.p-tbl tr{border-bottom:1px dotted #ddd;}
.p-tbl td{padding:0.07rem 0.12rem;vertical-align:top;}
.pn{font-weight:700;width:16px;color:#555;}.pa{color:#007a00;font-weight:600;}
.forma-tag{position:fixed;bottom:5mm;right:6mm;font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;}
@media print{@page{margin:4mm 6mm;}}
</style></head><body>
<div class="ph">
  <h2>Evaluación Final de Misión Los Adjetivos - Español - Lengua</h2>
  <div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div>
  <div class="ph-line"><strong>Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div>
  <p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p>
</div>
${s1}${s2}${s3}${s4}
<div class="pauta-wrap">
  <div class="p-head">
    <div class="p-main">✅ PAUTA — Evaluación Final · Misión Los Adjetivos · Forma ${forma}</div>
    <div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div>
    <div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u</div>
  </div>
  <div class="p-grid">${pR}</div>
</div>
<div class="forma-tag">Forma ${forma}</div>
</body></html>`;

  const win=window.open('','_blank','');
  if(!win){ showToast('⚠️ Activa las ventanas emergentes para imprimir'); return; }
  win.document.write(doc);
  win.document.close();
  setTimeout(()=>win.print(), 400);
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
  const msgs=['🚀 ¡ÁNIMO! Comienza tu misión. ¡Cada paso cuenta!','🌱 ¡GRAN INICIO! Estás dando los primeros pasos.','📚 ¡BUEN TRABAJO! Vas progresando muy bien.','💪 ¡MUY BIEN! Dominas gran parte del contenido.','🌟 ¡INCREÍBLE avance! Estás cerca de la excelencia.','🏆 ¡EXTRAORDINARIO! Completaste TODA la misión. ¡Eres experto en Adjetivos!'];
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
  const txt = `${stars} CONSTANCIA DE LOGRO ${stars}\n\n📝 Misión: Los Adjetivos\n👤 Estudiante: ${name}\n📊 Progreso: ${pct}% completado\n⭐ XP obtenido: ${xp} de ${MXP}${achText?'\n\n🏅 Logros desbloqueados:\n'+achText:''}\n\n${msg}\n\n📅 ${date}\n🏠 Proyecto Educativo Familia Polanco-Castellanos\n🌐 policastsapien.com`;
  window.open('https://wa.me/?text='+encodeURIComponent(txt),'_blank');
}

// ===================== INIT =====================
document.addEventListener('DOMContentLoaded',()=>{
  initTheme();
  loadProgress();
  upFC(); buildQz(); buildClass(); showId(); showCmp(); buildSopa();  genEval();
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
  // Recuperar nombre guardado
  const savedName = localStorage.getItem('nombreEstudianteAdjetivos');
  const inputName = document.querySelector('.diploma-input');
  if(savedName&&inputName){ inputName.value=savedName; updateDiplomaName(savedName); }
  if(inputName) inputName.addEventListener('input',e=>localStorage.setItem('nombreEstudianteAdjetivos',e.target.value));
  fin('s-aprende', false);
  fin('s-tipos', false);
});
