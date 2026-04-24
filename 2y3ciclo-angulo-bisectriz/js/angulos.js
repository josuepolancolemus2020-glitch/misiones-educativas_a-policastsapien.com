// ===================== UTILIDADES =====================
const _pick = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
const _shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
function fb(id, msg, isOk) {
  const el = document.getElementById(id);
  if(el) { el.textContent = msg; el.className = 'fb show ' + (isOk ? 'ok' : 'err'); }
}

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY = 'angulos_bisectriz_v3';
let xp = 0, MXP = 200, done = new Set(), evalAnsVisible = false;
let evalFormNum = 1;
let unlockedAch = [];
let darkMode = false;
let prevLevel = 0;
const xpTracker = { fc: new Set(), qz: new Set(), cls: new Set(), id: new Set(), cmp: new Set(), reto: new Set() };

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

// ===================== TAMAÑO DE LETRA =====================
// Escala la raíz (rem) en 3 pasos; todos los elementos que usan rem se ajustan sin desbordar
let fsLevel = 0;
const fsLevels  = ['', 'fs-md', 'fs-lg'];
const fsLabels  = ['🔤 Letra', '🔤 Letra +', '🔤 Letra ++'];
function toggleFontSize(){
  sfx('click');
  if(fsLevels[fsLevel]) document.documentElement.classList.remove(fsLevels[fsLevel]);
  fsLevel = (fsLevel + 1) % fsLevels.length;
  if(fsLevels[fsLevel]) document.documentElement.classList.add(fsLevels[fsLevel]);
  document.getElementById('fsBtn').textContent = fsLabels[fsLevel];
  try{ localStorage.setItem(SAVE_KEY+'_fs', fsLevel); }catch(e){}
}
function initFontSize(){
  try{
    const saved = parseInt(localStorage.getItem(SAVE_KEY+'_fs')||'0');
    if(saved > 0 && saved < fsLevels.length){
      fsLevel = saved;
      document.documentElement.classList.add(fsLevels[fsLevel]);
      document.getElementById('fsBtn').textContent = fsLabels[fsLevel];
    }
  }catch(e){}
}

// ===================== DARK MODE =====================
function toggleTheme(){ darkMode=!darkMode; document.documentElement.setAttribute('data-theme',darkMode?'dark':'light'); document.getElementById('themeBtn').textContent=darkMode?'☀️ Tema':'🌙 Tema'; localStorage.setItem(SAVE_KEY+'_theme',darkMode?'dark':'light'); sfx('click'); }
function initTheme(){ const s=localStorage.getItem(SAVE_KEY+'_theme'); const sys=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches; darkMode=(s==='dark')||(s===null&&sys); if(darkMode){ document.documentElement.setAttribute('data-theme','dark'); document.getElementById('themeBtn').textContent='☀️ Tema'; } }

// ===================== LOCALSTORAGE =====================
function saveProgress(){ try{ localStorage.setItem(SAVE_KEY, JSON.stringify({doneSections:Array.from(done), unlockedAch, evalFormNum, xp})); }catch(e){} }
function loadProgress(){
  try{
    const s = JSON.parse(localStorage.getItem(SAVE_KEY));
    if(!s) return;
    if(s.doneSections && Array.isArray(s.doneSections)) s.doneSections.forEach(id=>{ done.add(id); const b=document.querySelector(`[data-s="${id}"]`); if(b) b.classList.add('done'); });
    if(s.unlockedAch && Array.isArray(s.unlockedAch)) unlockedAch = s.unlockedAch.filter(id=>ACHIEVEMENTS[id]!==undefined);
    if(s.evalFormNum) evalFormNum = s.evalFormNum;
    if(s.xp !== undefined) { xp = s.xp; updateXPBar(); }
  }catch(e){}
}

// ===================== ACHIEVEMENTS =====================
const ACHIEVEMENTS = {
  primer_quiz:{icon:'🧠',label:'Primera prueba superada'},
  flash_master:{icon:'🃏',label:'Todas las tarjetas geométricas vistas'},
  clasif_pro:{icon:'🗂️',label:'Clasificador de ángulos experto'},
  id_master:{icon:'🔍',label:'Identificador de conceptos maestro'},
  reto_hero:{icon:'🏆',label:'Héroe del reto geométrico'},
  nivel3:{icon:'🔭',label:'¡Explorador alcanzado! Nivel 3'},
  nivel6:{icon:'🥇',label:'¡Campeón alcanzado! Nivel 6'}
};
function unlockAchievement(id){ if(unlockedAch.includes(id)) return; unlockedAch.push(id); sfx('ach'); showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label); launchConfetti(); renderAchPanel(); saveProgress(); }
function renderAchPanel(){ const list=document.getElementById('achList'); list.innerHTML=''; Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{ const div=document.createElement('div'); div.className='ach-item'+(unlockedAch.includes(id)?'':' locked'); div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`; list.appendChild(div); }); }
function toggleAchPanel(){ sfx('click'); document.getElementById('achPanel').classList.toggle('open'); }
function showToast(msg){ let t=document.querySelector('.toast'); if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);} t.textContent=msg; t.style.display='block'; clearTimeout(t._tid); t._tid=setTimeout(()=>t.style.display='none',3200); }
function launchConfetti(){ const colors=['#6c5ce7','#00b894','#0984e3','#fdcb6e','#e84393']; for(let i=0;i<60;i++){const c=document.createElement('div');c.className='confetti-piece';c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`;document.body.appendChild(c);c.addEventListener('animationend',()=>c.remove());} }

// ===================== XP =====================
const lvls=[{t:0,n:'Novato ✏️'},{t:25,n:'Aprendiz 📝'},{t:55,n:'Explorador 🔭'},{t:90,n:'Detective 🔍'},{t:130,n:'Experto 🌟'},{t:165,n:'Campeón 🥇'},{t:190,n:'Maestro 🏆'}];
function pts(n){ xp=Math.max(0,Math.min(MXP,xp+n)); updateXPBar(); saveProgress(); }
function updateXPBar(){ const pct=Math.round((xp/MXP)*100); document.getElementById('xpFill').style.width=pct+'%'; const el=document.getElementById('xpPts'); el.textContent='⭐ '+xp; el.style.transform='scale(1.3)'; setTimeout(()=>el.style.transform='',300); let lv=0; for(let i=0;i<lvls.length;i++) if(xp>=lvls[i].t) lv=i; document.getElementById('xpLvl').textContent=lvls[lv].n; if(lv!==prevLevel){if(lv>=2) unlockAchievement('nivel3');if(lv>=5) unlockAchievement('nivel6');prevLevel=lv;} }
function fin(id){
  if(!done.has(id)){ done.add(id); const b=document.querySelector(`[data-s="${id}"]`); if(b) b.classList.add('done'); sfx('up'); launchConfetti(); saveProgress(); }
}
function getProgress(){ return Math.round((done.size/10)*100); }

// ===================== NAV =====================
function go(id){ sfx('click'); document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active')); document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');}); document.getElementById(id).classList.add('active'); const btn=document.querySelector(`[data-s="${id}"]`); if(btn){btn.classList.add('active');btn.setAttribute('aria-selected','true');} window.scrollTo({top:0,behavior:'smooth'}); }

// ===================== SVG INTERACTIVO (inicializado en DOMContentLoaded) =====================
function initSVGOrgans(){
  document.querySelectorAll('.svg-organ').forEach(el => {
    const pulse = () => {
      sfx('click');
      const card = el.closest('.svg-angle-card');
      if(card){
        card.classList.add('svg-active');
        setTimeout(()=>card.classList.remove('svg-active'), 700);
      }
    };
    el.addEventListener('click', pulse);
    el.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' '){ e.preventDefault(); pulse(); } });
  });
}

// ===================== FLASHCARD DATA =====================
const fcData=[
  {w:'Ángulo',a:'📐 Abertura formada por <strong>dos rayos</strong> que comparten un punto llamado <strong>vértice</strong>.'},
  {w:'Ángulo Agudo',a:'📐 Mide <strong>menos de 90°</strong>. Ejemplo: 30°, 45°, 60°. Es más cerrado que una esquina.'},
  {w:'Ángulo Recto',a:'🔲 Mide exactamente <strong>90°</strong>. Se marca con un cuadradito. Ejemplo: la esquina de una hoja.'},
  {w:'Ángulo Obtuso',a:'📏 Mide entre <strong>90° y 180°</strong>. Ejemplo: 120°, 135°, 150°. Más abierto que una esquina.'},
  {w:'Ángulo Llano',a:'➖ Mide exactamente <strong>180°</strong>. Los dos rayos forman una <strong>línea recta</strong>.'},
  {w:'Ángulo Completo',a:'🔄 Mide exactamente <strong>360°</strong>. Una vuelta completa alrededor del vértice.'},
  {w:'Bisectriz',a:'✂️ Rayo que <strong>divide un ángulo en dos partes iguales</strong>. Fórmula: ángulo ÷ 2.'},
  {w:'Vértice',a:'⚫ <strong>Punto de origen</strong> donde se unen los dos rayos que forman el ángulo.'},
  {w:'Transportador',a:'🔧 Instrumento semicircular que sirve para <strong>medir ángulos</strong> en grados (°).'},
  {w:'Complementarios',a:'🧩 Dos ángulos cuya suma es <strong>90°</strong>. Ejemplo: 35° + 55° = 90°.'},
  {w:'Suplementarios',a:'🔗 Dos ángulos cuya suma es <strong>180°</strong>. Ejemplo: 110° + 70° = 180°.'},
  {w:'Grado (°)',a:'📏 <strong>Unidad de medida</strong> de los ángulos. Un círculo completo tiene <strong>360°</strong>.'},
];
let fcIdx = 0;
function upFC(){ document.getElementById('fcInner').classList.remove('flipped'); document.getElementById('fcW').textContent=fcData[fcIdx].w; document.getElementById('fcA').innerHTML=fcData[fcIdx].a; document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length; }
function flipCard(){ sfx('flip'); document.getElementById('fcInner').classList.toggle('flipped'); if(!xpTracker.fc.has(fcIdx)){xpTracker.fc.add(fcIdx);pts(1);} if(xpTracker.fc.size===fcData.length){fin('s-flash');unlockAchievement('flash_master');} }
function nextFC(){ sfx('click'); fcIdx=(fcIdx+1)%fcData.length; upFC(); }
function prevFC(){ sfx('click'); fcIdx=(fcIdx-1+fcData.length)%fcData.length; upFC(); }

// ===================== QUIZ DATA (con pistas y explicaciones — aprendizaje significativo) =====================
const qzData=[
  {q:'¿Cuánto mide un ángulo recto?',
   o:['a) 45°','b) 90°','c) 180°','d) 360°'],c:1,
   hint:'💡 Piensa en la esquina perfecta de una hoja de papel o en las manecillas de un reloj a las 3:00.',
   exp:'Un ángulo recto mide exactamente 90°. Se identifica con un pequeño cuadrado en el vértice. Ni más ni menos — la mitad de un llano.'},
  {q:'Un ángulo de 135° es de tipo:',
   o:['a) Agudo','b) Recto','c) Obtuso','d) Llano'],c:2,
   hint:'💡 135° está entre 90° y 180°. ¿Cuál tipo de ángulo vive en ese rango?',
   exp:'Es obtuso: mide más de 90° pero menos de 180°. Agudo sería menor de 90°; llano sería exactamente 180°.'},
  {q:'¿Qué hace la bisectriz de un ángulo?',
   o:['a) Lo elimina','b) Lo duplica','c) Lo divide en dos partes iguales','d) Lo convierte en recto'],c:2,
   hint:'💡 La palabra "bisectriz" viene del latín "bi" (dos) + "secar" (cortar). ¿Qué corta en dos?',
   exp:'La bisectriz es el rayo que divide el ángulo exactamente por la mitad, creando dos ángulos iguales. Fórmula: ángulo ÷ 2.'},
  {q:'Si un ángulo mide 60°, su bisectriz crea dos ángulos de:',
   o:['a) 20°','b) 30°','c) 45°','d) 60°'],c:1,
   hint:'💡 Usa la fórmula de la bisectriz: ángulo total ÷ 2 = cada mitad.',
   exp:'60° ÷ 2 = 30°. La bisectriz siempre divide en partes iguales, así que ambas mitades miden lo mismo.'},
  {q:'¿Cuánto suman dos ángulos suplementarios?',
   o:['a) 90°','b) 180°','c) 270°','d) 360°'],c:1,
   hint:'💡 Suplementario → piensa en un ángulo llano. Un llano mide exactamente…',
   exp:'Dos ángulos suplementarios suman 180°, igual que un ángulo llano. Ejemplo: 110° + 70° = 180°.'},
  {q:'Un ángulo de 55° es de tipo:',
   o:['a) Agudo','b) Recto','c) Obtuso','d) Llano'],c:0,
   hint:'💡 55° es menor que 90°. ¿Qué tipo de ángulo mide menos de 90°?',
   exp:'Es agudo porque mide menos de 90°. Todo ángulo entre 0° y 89° es agudo — más cerrado que una esquina de cuaderno.'},
  {q:'¿Cuánto suman dos ángulos complementarios?',
   o:['a) 45°','b) 90°','c) 180°','d) 360°'],c:1,
   hint:'💡 Complementario → piensa en un ángulo recto. Un recto mide exactamente…',
   exp:'Dos ángulos complementarios suman 90°, igual que un ángulo recto. Ejemplo: 30° + 60° = 90°.'},
  {q:'El complemento de un ángulo de 40° es:',
   o:['a) 40°','b) 50°','c) 140°','d) 320°'],c:1,
   hint:'💡 Complementario = suma 90°. Entonces: 90° − 40° = ?',
   exp:'90° − 40° = 50°. Verificación: 40° + 50° = 90° ✓. Si quisieras el suplemento sería 180° − 40° = 140°.'},
  {q:'¿Cuánto mide un ángulo llano?',
   o:['a) 90°','b) 120°','c) 180°','d) 360°'],c:2,
   hint:'💡 Un ángulo llano parece una línea recta. Desde un lado al otro son la mitad de un giro completo.',
   exp:'Un ángulo llano mide 180°. Sus dos rayos forman una línea recta perfecta. El completo es 360° (vuelta entera).'},
];
let qzIdx=0, qzSel=-1, qzDone=false;
function buildQz(){ qzIdx=0; qzSel=-1; qzDone=false; showQz(); }
function showQz(){
  if(qzIdx>=qzData.length){
    document.getElementById('qzQ').textContent='🎉 ¡Quiz completado! Revisaste todas las preguntas.';
    document.getElementById('qzOpts').innerHTML='';
    document.getElementById('qzHint').classList.remove('show');
    document.getElementById('expQz').classList.remove('show');
    document.getElementById('fbQz').classList.remove('show');
    fin('s-quiz'); unlockAchievement('primer_quiz'); return;
  }
  const q=qzData[qzIdx];
  document.getElementById('qzProg').textContent=`Pregunta ${qzIdx+1} de ${qzData.length}`;
  document.getElementById('qzQ').textContent=q.q;
  document.getElementById('qzHint').classList.remove('show');
  document.getElementById('expQz').classList.remove('show');
  document.getElementById('fbQz').classList.remove('show');
  const opts=document.getElementById('qzOpts'); opts.innerHTML='';
  q.o.forEach((o,i)=>{ const b=document.createElement('button'); b.className='qz-opt'; b.textContent=o; b.onclick=()=>{if(qzDone)return;document.querySelectorAll('.qz-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');qzSel=i;sfx('click');}; opts.appendChild(b); });
  qzDone=false;
}
// BUG FIX: eliminado setTimeout que causaba avance doble al presionar "Siguiente" antes de los 1600ms
function checkQz(){
  if(qzDone)return;
  if(qzSel<0)return fb('fbQz','Selecciona una respuesta primero.',false);
  qzDone=true;
  const q=qzData[qzIdx];
  const opts=document.querySelectorAll('.qz-opt');
  const expEl=document.getElementById('expQz');
  if(qzSel===q.c){
    opts[qzSel].classList.add('correct');
    fb('fbQz','¡Correcto! +5 XP',true);
    if(!xpTracker.qz.has(qzIdx)){xpTracker.qz.add(qzIdx);pts(5);}
    sfx('ok');
    expEl.className='exp-box show ok';
  }else{
    opts[qzSel].classList.add('wrong');
    opts[q.c].classList.add('correct');
    fb('fbQz','Incorrecto — observa la explicación abajo.',false);
    sfx('no');
    expEl.className='exp-box show err';
  }
  expEl.textContent='📖 '+q.exp;
  document.getElementById('qzHint').classList.remove('show');
}
function nextQz(){
  if(!qzDone)return;
  qzIdx++; qzSel=-1; qzDone=false;
  showQz();
}
function showHint(){
  if(qzDone)return;
  const hintEl=document.getElementById('qzHint');
  const q=qzData[qzIdx];
  if(q&&q.hint){ hintEl.textContent=q.hint; hintEl.classList.add('show'); sfx('click'); }
}
function resetQz(){ sfx('click'); qzIdx=0; qzSel=-1; qzDone=false; showQz(); }

// ===================== CLASIFICACIÓN =====================
const classGroups = [
  { label:['Agudo','Obtuso'], headA:'📐 Agudo (<90°)', headB:'📏 Obtuso (>90°)', colA:'ag', colB:'ob',
    words:[{w:'30°',t:'ag'},{w:'120°',t:'ob'},{w:'45°',t:'ag'},{w:'135°',t:'ob'},{w:'60°',t:'ag'},{w:'150°',t:'ob'},{w:'15°',t:'ag'},{w:'110°',t:'ob'},{w:'75°',t:'ag'},{w:'165°',t:'ob'}] },
  { label:['Complementarios','Suplementarios'], headA:'🧩 Complementarios (=90°)', headB:'🔗 Suplementarios (=180°)', colA:'cm', colB:'sp',
    words:[{w:'30° y 60°',t:'cm'},{w:'110° y 70°',t:'sp'},{w:'45° y 45°',t:'cm'},{w:'90° y 90°',t:'sp'},{w:'25° y 65°',t:'cm'},{w:'120° y 60°',t:'sp'},{w:'50° y 40°',t:'cm'},{w:'135° y 45°',t:'sp'},{w:'10° y 80°',t:'cm'},{w:'100° y 80°',t:'sp'}] },
  { label:['<90°','≥90°'], headA:'📐 Menor que 90°', headB:'📏 Mayor o igual a 90°', colA:'me', colB:'ma',
    words:[{w:'Agudo de 20°',t:'me'},{w:'Recto de 90°',t:'ma'},{w:'Agudo de 89°',t:'me'},{w:'Obtuso de 100°',t:'ma'},{w:'Agudo de 1°',t:'me'},{w:'Llano de 180°',t:'ma'},{w:'Agudo de 55°',t:'me'},{w:'Obtuso de 170°',t:'ma'},{w:'Agudo de 44°',t:'me'},{w:'Completo de 360°',t:'ma'}] },
];
let currentClassGroupIdx = 0, clsSelectedWord = null;
function buildClass(){
  const group=classGroups[currentClassGroupIdx]; document.getElementById('col-left-head').textContent=group.headA; document.getElementById('col-right-head').textContent=group.headB;
  const bank=document.getElementById('clsBank'); bank.innerHTML=''; clsSelectedWord=null; document.getElementById('items-left').innerHTML=''; document.getElementById('items-right').innerHTML='';
  _shuffle([...group.words]).forEach(w=>{ const el=document.createElement('div'); el.className='wb-item'; el.textContent=w.w; el.dataset.t=w.t; el.onclick=()=>{document.querySelectorAll('.wb-item').forEach(i=>i.classList.remove('sel-word'));el.classList.add('sel-word');clsSelectedWord=el;sfx('click');}; bank.appendChild(el); });
  ['col-left','col-right'].forEach(colId=>{ const col=document.getElementById(colId); col.onclick=(e)=>{ if(!clsSelectedWord||e.target.classList.contains('drop-item')) return; const targetId=colId==='col-left'?'items-left':'items-right'; const wordsCol=document.getElementById(targetId); const item=document.createElement('div'); item.className='drop-item'; item.textContent=clsSelectedWord.textContent; item.dataset.t=clsSelectedWord.dataset.t; const original=clsSelectedWord; item.onclick=(ev)=>{ev.stopPropagation();if(clsSelectedWord!==null){col.click();}else{document.getElementById('clsBank').appendChild(original);original.classList.remove('sel-word');item.remove();sfx('click');}}; wordsCol.appendChild(item); clsSelectedWord.remove(); clsSelectedWord=null; sfx('click'); }; });
}
function checkClass(){ const remaining=document.querySelectorAll('#clsBank .wb-item').length; if(remaining>0){fb('fbCls','Mueve todas las palabras a las columnas primero.',false);return;} const group=classGroups[currentClassGroupIdx]; let allOk=true; document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{ const inLeft=el.parentElement.id==='items-left'; const expectedType=inLeft?group.colA:group.colB; if(el.dataset.t===expectedType){el.classList.add('cls-ok');}else{el.classList.add('cls-no');allOk=false;} }); if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);} if(allOk){fb('fbCls','¡Perfecto! +5 XP',true);sfx('fan');fin('s-clasifica');unlockAchievement('clasif_pro');}else{fb('fbCls','Hay errores. Marcados en rojo.',false);sfx('no');} }
function nextClassGroup(){ sfx('click'); currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length; buildClass(); document.getElementById('fbCls').classList.remove('show'); showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]); }
function resetClass(){ sfx('click'); buildClass(); document.getElementById('fbCls').classList.remove('show'); }

// ===================== IDENTIFICAR =====================
const idData=[
  {s:['Un','ángulo','de','45°','es','agudo.'],c:5,art:'Busca el tipo → agudo (menos de 90°)'},
  {s:['La','bisectriz','divide','el','ángulo','en','dos','partes','iguales.'],c:1,art:'Busca el concepto clave → bisectriz'},
  {s:['El','transportador','mide','los','ángulos','en','grados.'],c:1,art:'Busca el instrumento → transportador'},
  {s:['Un','ángulo','recto','mide','exactamente','90°.'],c:2,art:'Busca el tipo → recto'},
  {s:['Dos','ángulos','suplementarios','suman','180°.'],c:2,art:'Busca la relación → suplementarios'},
  {s:['El','vértice','es','el','punto','donde','se','unen','los','rayos.'],c:1,art:'Busca el punto → vértice'},
  {s:['Un','ángulo','obtuso','mide','más','de','90°.'],c:2,art:'Busca el tipo → obtuso'},
  {s:['Dos','ángulos','complementarios','suman','90°.'],c:2,art:'Busca la relación → complementarios'},
];
let idIdx=0, idDone=false;
function showId(){
  idDone=false; if(idIdx>=idData.length){document.getElementById('idSent').innerHTML='🎉 ¡Completado!';fin('s-identifica');unlockAchievement('id_master');return;}
  const d=idData[idIdx]; document.getElementById('idProg').textContent=`Oración ${idIdx+1} de ${idData.length}`; document.getElementById('idInfo').textContent=d.art;
  const sent=document.getElementById('idSent'); sent.innerHTML='';
  d.s.forEach((w,i)=>{ const span=document.createElement('span'); span.className='id-word'; span.textContent=w+' '; span.setAttribute('tabindex','0'); span.setAttribute('role','button'); span.onclick=()=>checkId(i,span); span.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();checkId(i,span);}}; sent.appendChild(span); });
}
function checkId(i, span){ if(idDone)return; document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected')); span.classList.add('selected'); if(i===idData[idIdx].c){idDone=true;span.classList.add('id-ok');fb('fbId','¡Correcto! +5 XP',true);if(!xpTracker.id.has(idIdx)){xpTracker.id.add(idIdx);pts(5);}sfx('ok');}else{span.classList.add('id-no');fb('fbId','Esa no es la palabra clave.',false);sfx('no');} }
function nextId(){ sfx('click'); idIdx++; showId(); document.getElementById('fbId').classList.remove('show'); }
function resetId(){ sfx('click'); idIdx=0; showId(); document.getElementById('fbId').classList.remove('show'); }

// ===================== COMPLETA =====================
const cmpData=[
  {s:'Un ángulo que mide menos de 90° se llama ___.',opts:['obtuso','agudo','llano'],c:1},
  {s:'La ___ divide un ángulo en dos partes iguales.',opts:['bisectriz','hipotenusa','diagonal'],c:0},
  {s:'Un ángulo de 90° se llama ___.',opts:['agudo','llano','recto'],c:2},
  {s:'Dos ángulos complementarios suman ___.',opts:['180°','90°','360°'],c:1},
  {s:'El ___ es el punto donde se unen los dos rayos.',opts:['grado','vértice','lado'],c:1},
  {s:'Un ángulo que mide entre 90° y 180° es ___.',opts:['agudo','obtuso','completo'],c:1},
  {s:'Dos ángulos suplementarios suman ___.',opts:['90°','180°','270°'],c:1},
  {s:'Un ángulo de 180° se llama ___.',opts:['recto','llano','completo'],c:1},
];
let cmpIdx=0, cmpSel=-1, cmpDone=false;
function showCmp(){
  if(cmpIdx>=cmpData.length){document.getElementById('cmpSent').innerHTML='🎉 ¡Completado!';document.getElementById('cmpOpts').innerHTML='';fin('s-completa');return;}
  const d=cmpData[cmpIdx]; document.getElementById('cmpProg').textContent=`Oración ${cmpIdx+1} de ${cmpData.length}`; document.getElementById('cmpSent').innerHTML=d.s.replace('___','<span class="blank">___</span>');
  const opts=document.getElementById('cmpOpts'); opts.innerHTML=''; cmpSel=-1; cmpDone=false;
  d.opts.forEach((o,i)=>{ const b=document.createElement('button'); b.className='cmp-opt'; b.textContent=o; b.onclick=()=>{if(cmpDone)return;document.querySelectorAll('.cmp-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');cmpSel=i;sfx('click');}; opts.appendChild(b); });
}
// BUG FIX: eliminado setTimeout que avanzaba automáticamente sin control del estudiante
function checkCmp(){
  if(cmpDone)return;
  if(cmpSel<0)return fb('fbCmp','Selecciona una opción primero.',false);
  cmpDone=true;
  const opts=document.querySelectorAll('.cmp-opt');
  if(cmpSel===cmpData[cmpIdx].c){
    opts[cmpSel].classList.add('correct');
    document.getElementById('cmpSent').innerHTML=cmpData[cmpIdx].s.replace('___',`<span class="blank" style="color:var(--jade);border-color:var(--jade)">${opts[cmpSel].textContent}</span>`);
    fb('fbCmp','¡Correcto! +5 XP — Presiona «Siguiente» para continuar.',true);
    if(!xpTracker.cmp.has(cmpIdx)){xpTracker.cmp.add(cmpIdx);pts(5);}
    sfx('ok');
  }else{
    opts[cmpSel].classList.add('wrong');
    opts[cmpData[cmpIdx].c].classList.add('correct');
    fb('fbCmp','Incorrecto. Observa la opción correcta y presiona «Siguiente».',false);
    sfx('no');
  }
}
function nextCmp(){
  if(!cmpDone)return;
  cmpIdx++; cmpSel=-1; cmpDone=false;
  document.getElementById('fbCmp').classList.remove('show');
  showCmp();
}
function resetCmp(){ sfx('click'); cmpIdx=0; cmpSel=-1; cmpDone=false; showCmp(); document.getElementById('fbCmp').classList.remove('show'); }

// ===================== RETO FINAL =====================
const retoPairs = [
  { label:['Agudo','Obtuso'], btnA:'📐 Agudo', btnB:'📏 Obtuso', colA:'ag', colB:'ob',
    words:[{w:'30°',t:'ag'},{w:'120°',t:'ob'},{w:'45°',t:'ag'},{w:'135°',t:'ob'},{w:'60°',t:'ag'},{w:'150°',t:'ob'},{w:'15°',t:'ag'},{w:'110°',t:'ob'},{w:'75°',t:'ag'},{w:'160°',t:'ob'}] },
  { label:['Recto/Agudo','Obtuso/Llano'], btnA:'🔲 ≤90°', btnB:'📏 >90°', colA:'me', colB:'ma',
    words:[{w:'90°',t:'me'},{w:'91°',t:'ma'},{w:'45°',t:'me'},{w:'180°',t:'ma'},{w:'89°',t:'me'},{w:'120°',t:'ma'},{w:'1°',t:'me'},{w:'170°',t:'ma'},{w:'60°',t:'me'},{w:'135°',t:'ma'}] },
  { label:['Complementario de','Suplementario de'], btnA:'🧩 Compl. →90°', btnB:'🔗 Supl. →180°', colA:'cm', colB:'sp',
    words:[{w:'30°+60°',t:'cm'},{w:'90°+90°',t:'sp'},{w:'45°+45°',t:'cm'},{w:'120°+60°',t:'sp'},{w:'50°+40°',t:'cm'},{w:'110°+70°',t:'sp'},{w:'25°+65°',t:'cm'},{w:'135°+45°',t:'sp'}] },
];
let currentRetoPairIdx=0, retoPool=[], retoOk=0, retoErr=0, retoTimerInt=null, retoSec=30, retoRunning=false, retoCurrent=null;
function updateRetoButtons(){ const pair=retoPairs[currentRetoPairIdx]; document.querySelectorAll('.reto-btns .btn')[0].textContent=pair.btnA; document.querySelectorAll('.reto-btns .btn')[1].textContent=pair.btnB; document.querySelectorAll('.reto-btns .btn')[0].onclick=()=>ansReto(pair.colA); document.querySelectorAll('.reto-btns .btn')[1].onclick=()=>ansReto(pair.colB); }
function startReto(){ if(retoRunning)return; sfx('click'); retoRunning=true; retoOk=0; retoErr=0; retoSec=30; retoPool=_shuffle([...retoPairs[currentRetoPairIdx].words,...retoPairs[currentRetoPairIdx].words]); showRetoWord(); retoTimerInt=setInterval(()=>{retoSec--;sfx('tick');document.getElementById('retoTimer').textContent='⏱ '+retoSec;if(retoSec<=10)document.getElementById('retoTimer').style.color='var(--red)';if(retoSec<=0){clearInterval(retoTimerInt);endReto();}},1000); }
function showRetoWord(){ if(retoPool.length===0) retoPool=_shuffle([...retoPairs[currentRetoPairIdx].words,...retoPairs[currentRetoPairIdx].words]); retoCurrent=retoPool.pop(); document.getElementById('retoWord').textContent=retoCurrent.w; }
function ansReto(t){ if(!retoRunning||!retoCurrent)return; const firstPlay=!xpTracker.reto.has(currentRetoPairIdx); if(t===retoCurrent.t){sfx('ok');retoOk++;if(firstPlay)pts(1);}else{sfx('no');retoErr++;if(firstPlay)pts(-1);} document.getElementById('retoScore').textContent=`✅ ${retoOk} correctas | ❌ ${retoErr} errores`; showRetoWord(); }
function endReto(){ retoRunning=false; document.getElementById('retoWord').textContent='🏁 ¡Tiempo!'; document.getElementById('retoTimer').style.color='var(--pri)'; xpTracker.reto.add(currentRetoPairIdx); if(retoOk>=5){fin('s-reto');unlockAchievement('reto_hero');fb('fbReto',`¡Excelente! ${retoOk} correctas de ${retoOk+retoErr}.`,true);}else{fb('fbReto',`${retoOk} correctas. ¡Intenta de nuevo para mejorar!`,false);} }
function nextRetoPair(){ sfx('click'); currentRetoPairIdx=(currentRetoPairIdx+1)%retoPairs.length; updateRetoButtons(); resetReto(); showToast('🔄 Pareja: '+retoPairs[currentRetoPairIdx].label[0]+' vs '+retoPairs[currentRetoPairIdx].label[1]); }
function resetReto(){ if(retoTimerInt) clearInterval(retoTimerInt); retoRunning=false; retoOk=0; retoErr=0; retoSec=30; document.getElementById('retoTimer').textContent='⏱ 30'; document.getElementById('retoTimer').style.color='var(--pri)'; document.getElementById('retoWord').textContent='¡Prepárate!'; document.getElementById('retoScore').textContent='✅ 0 correctas | ❌ 0 errores'; document.getElementById('fbReto').classList.remove('show'); }

// ===================== GENERADOR DE TAREAS =====================
let ansVisible = false;
const identifyTasks=[
  {q:'Determina el tipo de ángulo que mide 75°.',ans:'Es un ángulo agudo (menor de 90°).'},
  {q:'¿Qué tipo de ángulo mide 90°?',ans:'Es un ángulo recto.'},
  {q:'Clasifica un ángulo de 145°.',ans:'Es un ángulo obtuso (entre 90° y 180°).'},
  {q:'Si un ángulo mide 180°, ¿de qué tipo es?',ans:'Es un ángulo llano.'},
  {q:'¿Qué tipo de ángulo es el de 360°?',ans:'Es un ángulo completo.'},
  {q:'Identifica el tipo: un ángulo de 22°.',ans:'Es un ángulo agudo.'},
  {q:'¿Qué tipo de ángulo se marca con un cuadradito?',ans:'El ángulo recto (90°).'},
  {q:'¿Qué tipo de ángulo forma una línea recta?',ans:'El ángulo llano (180°).'},
  {q:'¿Es 89° agudo, recto u obtuso?',ans:'Es un ángulo agudo (menor de 90°).'},
  {q:'Identifica: ángulo de 91°.',ans:'Es un ángulo obtuso.'},
];
const classifyTasks=[
  {q:'30° y 60° → ¿complementarios o suplementarios?',ans:'Complementarios (suman 90°).'},
  {q:'110° y 70° → ¿complementarios o suplementarios?',ans:'Suplementarios (suman 180°).'},
  {q:'45° → ¿agudo, recto u obtuso?',ans:'Agudo (menor de 90°).'},
  {q:'120° → ¿agudo, recto u obtuso?',ans:'Obtuso (entre 90° y 180°).'},
  {q:'90° → ¿agudo, recto u obtuso?',ans:'Recto (exactamente 90°).'},
  {q:'50° y 40° → ¿complementarios o suplementarios?',ans:'Complementarios (suman 90°).'},
  {q:'135° y 45° → ¿complementarios o suplementarios?',ans:'Suplementarios (suman 180°).'},
  {q:'180° → ¿obtuso o llano?',ans:'Llano (exactamente 180°).'},
  {q:'360° → ¿llano o completo?',ans:'Completo (exactamente 360°).'},
  {q:'89° y 1° → ¿complementarios o suplementarios?',ans:'Complementarios (suman 90°).'},
];
const completeTasks=[
  {q:'Un ángulo ___ mide menos de 90°.',blank:'agudo',ans:'agudo'},
  {q:'La bisectriz divide un ángulo en ___.',blank:'dos partes iguales',ans:'dos partes iguales'},
  {q:'Dos ángulos suplementarios suman ___.',blank:'180°',ans:'180°'},
  {q:'El punto donde se unen los rayos es el ___.',blank:'vértice',ans:'vértice'},
  {q:'Un ángulo ___ mide exactamente 90°.',blank:'recto',ans:'recto'},
  {q:'El complemento de 35° es ___.',blank:'55°',ans:'55°'},
  {q:'El suplemento de 110° es ___.',blank:'70°',ans:'70°'},
  {q:'La bisectriz de un ángulo de 80° crea dos de ___.',blank:'40°',ans:'40°'},
  {q:'Un ángulo que mide entre 90° y 180° es ___.',blank:'obtuso',ans:'obtuso'},
  {q:'Los ángulos se miden con un ___.',blank:'transportador',ans:'transportador'},
];
const explainQuestions=[
  {q:'¿Cuál es la diferencia entre un ángulo agudo y un obtuso?',ans:'El agudo mide menos de 90° y el obtuso entre 90° y 180°.'},
  {q:'¿Qué es la bisectriz de un ángulo?',ans:'Es el rayo que divide el ángulo en dos partes iguales.'},
  {q:'¿Cuándo son complementarios dos ángulos?',ans:'Cuando su suma es exactamente 90°.'},
  {q:'¿Cuándo son suplementarios dos ángulos?',ans:'Cuando su suma es exactamente 180°.'},
  {q:'¿Qué instrumento se usa para medir ángulos?',ans:'El transportador.'},
  {q:'Si un ángulo mide 100°, ¿cuánto mide su bisectriz?',ans:'Cada mitad mide 50°.'},
  {q:'¿Qué es el vértice de un ángulo?',ans:'Es el punto de origen donde se unen los dos rayos.'},
  {q:'¿En qué se diferencia un ángulo llano de un completo?',ans:'El llano mide 180° (línea recta) y el completo 360° (vuelta entera).'},
  {q:'¿Cuál es el complemento de un ángulo de 60°?',ans:'30° (porque 60° + 30° = 90°).'},
  {q:'Da un ejemplo de ángulos suplementarios.',ans:'Por ejemplo, 120° y 60° (suman 180°).'},
];
function genTask(){
  sfx('click'); const type=document.getElementById('tgType').value; const count=parseInt(document.getElementById('tgCount').value); const out=document.getElementById('tgOut'); out.innerHTML=''; ansVisible=false;
  if(type==='identify') genIdentifyTask(out,count);
  else if(type==='classify') genClassifyTask(out,count);
  else if(type==='complete') genCompleteTask(out,count);
  else genExplainTask(out,count);
  fin('s-tareas');
}
function _instrBlock(out,title,lines){ const d=document.createElement('div');d.className='tg-instruction-block';d.innerHTML=`<h4>📌 ${title}</h4>${lines.map(l=>`<p>${l}</p>`).join('')}`;out.appendChild(d); }
function genIdentifyTask(out,count){ _instrBlock(out,'Instrucción',['Copia las siguientes preguntas en tu cuaderno y responde cada una.']); const pool=_shuffle([...identifyTasks]); for(let i=0;i<count;i++){const item=pool[i%pool.length]; const div=document.createElement('div');div.className='tg-task'; div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.ans}</div></div>`; out.appendChild(div);} }
function genClassifyTask(out,count){ _instrBlock(out,'Instrucción',['Clasifica cada ángulo o par según corresponda.']); const pool=_shuffle([...classifyTasks]); for(let i=0;i<count;i++){const item=pool[i%pool.length]; const div=document.createElement('div');div.className='tg-task'; div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.ans}</div></div>`; out.appendChild(div);} }
function genCompleteTask(out,count){ _instrBlock(out,'Instrucción',['Completa cada oración con la palabra correcta.']); const pool=_shuffle([...completeTasks]); for(let i=0;i<count;i++){const item=pool[i%pool.length]; const div=document.createElement('div');div.className='tg-task'; div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content">${item.q.replace(item.blank,'<span class="tg-blank"></span>')}<div class="tg-answer">✅ ${item.ans}</div></div>`; out.appendChild(div);} }
function genExplainTask(out,count){ _instrBlock(out,'Instrucción',['Copia las preguntas en tu cuaderno y responde de forma clara.']); const pool=_shuffle([...explainQuestions]); for(let i=0;i<count;i++){const item=pool[i%pool.length]; const div=document.createElement('div');div.className='tg-task'; div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.3rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.ans}</div></div>`; out.appendChild(div);} }
function toggleAns(){ ansVisible=!ansVisible; document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none'); sfx('click'); }

// ===================== EVALUACIÓN FINAL =====================
const evalTFBank=[
  {q:'Un ángulo agudo mide menos de 90°.',a:true},
  {q:'La bisectriz divide un ángulo en tres partes iguales.',a:false},
  {q:'Un ángulo recto mide exactamente 90°.',a:true},
  {q:'Dos ángulos complementarios suman 180°.',a:false},
  {q:'Un ángulo obtuso mide entre 90° y 180°.',a:true},
  {q:'El vértice es el instrumento para medir ángulos.',a:false},
  {q:'Un ángulo llano mide exactamente 180°.',a:true},
  {q:'La bisectriz de un ángulo de 60° crea dos ángulos de 30°.',a:true},
  {q:'Un ángulo de 360° se llama ángulo llano.',a:false},
  {q:'Dos ángulos suplementarios suman 180°.',a:true},
  {q:'El complemento de 45° es 45°.',a:true},
  {q:'Un ángulo de 95° es un ángulo agudo.',a:false},
  {q:'El transportador sirve para medir ángulos.',a:true},
  {q:'Un ángulo completo mide 360°.',a:true},
  {q:'La bisectriz de un ángulo de 90° crea dos de 50°.',a:false},
];
const evalMCBank=[
  {q:'¿Cuánto mide un ángulo recto?',o:['a) 45°','b) 90°','c) 180°','d) 360°'],a:1},
  {q:'¿Qué hace la bisectriz?',o:['a) Elimina el ángulo','b) Lo triplica','c) Lo divide en dos partes iguales','d) Lo mide'],a:2},
  {q:'Un ángulo de 150° es:',o:['a) Agudo','b) Recto','c) Obtuso','d) Llano'],a:2},
  {q:'¿Cuánto suman dos ángulos complementarios?',o:['a) 45°','b) 90°','c) 180°','d) 360°'],a:1},
  {q:'¿Cuánto suman dos ángulos suplementarios?',o:['a) 90°','b) 180°','c) 270°','d) 360°'],a:1},
  {q:'El complemento de 30° es:',o:['a) 30°','b) 60°','c) 150°','d) 330°'],a:1},
  {q:'El suplemento de 120° es:',o:['a) 30°','b) 60°','c) 120°','d) 240°'],a:1},
  {q:'La bisectriz de un ángulo de 100° crea ángulos de:',o:['a) 25°','b) 50°','c) 100°','d) 200°'],a:1},
  {q:'¿Qué instrumento mide ángulos?',o:['a) Regla','b) Compás','c) Transportador','d) Escuadra'],a:2},
  {q:'Un ángulo de 180° se llama:',o:['a) Recto','b) Obtuso','c) Llano','d) Completo'],a:2},
  {q:'Un ángulo de 89° es:',o:['a) Agudo','b) Recto','c) Obtuso','d) Llano'],a:0},
  {q:'El vértice de un ángulo es:',o:['a) Un lado','b) Un rayo','c) El punto donde se unen los rayos','d) Una medida'],a:2},
  {q:'¿Cuántos grados tiene un círculo completo?',o:['a) 90°','b) 180°','c) 270°','d) 360°'],a:3},
  {q:'Un ángulo de 1° es:',o:['a) Agudo','b) Recto','c) Obtuso','d) Llano'],a:0},
  {q:'¿Cuál de estos pares es complementario?',o:['a) 60° y 60°','b) 45° y 45°','c) 90° y 90°','d) 100° y 80°'],a:1},
];
const evalCPBank=[
  {q:'Un ángulo que mide menos de 90° es ___.',a:'agudo'},
  {q:'La bisectriz divide un ángulo en ___ partes iguales.',a:'dos'},
  {q:'Dos ángulos complementarios suman ___.',a:'90°'},
  {q:'Dos ángulos suplementarios suman ___.',a:'180°'},
  {q:'Un ángulo recto mide exactamente ___.',a:'90°'},
  {q:'Un ángulo llano mide ___.',a:'180°'},
  {q:'El ___ es el punto donde se unen los rayos.',a:'vértice'},
  {q:'Los ángulos se miden con un ___.',a:'transportador'},
  {q:'Un ángulo completo mide ___.',a:'360°'},
  {q:'La bisectriz de 120° crea dos ángulos de ___.',a:'60°'},
  {q:'El complemento de 55° es ___.',a:'35°'},
  {q:'El suplemento de 100° es ___.',a:'80°'},
  {q:'Un ángulo de 91° es de tipo ___.',a:'obtuso'},
  {q:'Un ángulo entre 90° y 180° se llama ___.',a:'obtuso'},
  {q:'La bisectriz de un ángulo recto crea dos de ___.',a:'45°'},
];
const evalPRBank=[
  {term:'Ángulo agudo',def:'Mide menos de 90°'},
  {term:'Ángulo recto',def:'Mide exactamente 90°'},
  {term:'Ángulo obtuso',def:'Mide entre 90° y 180°'},
  {term:'Ángulo llano',def:'Mide exactamente 180°'},
  {term:'Ángulo completo',def:'Mide exactamente 360°'},
  {term:'Bisectriz',def:'Rayo que divide un ángulo en dos partes iguales'},
  {term:'Vértice',def:'Punto donde se unen los dos rayos'},
  {term:'Transportador',def:'Instrumento para medir ángulos en grados'},
  {term:'Complementarios',def:'Dos ángulos que suman 90°'},
  {term:'Suplementarios',def:'Dos ángulos que suman 180°'},
  {term:'Grado (°)',def:'Unidad de medida de los ángulos'},
  {term:'Rayo',def:'Semirrecta que forma parte de un ángulo'},
  {term:'45° + 45°',def:'Ejemplo de ángulos complementarios'},
  {term:'110° + 70°',def:'Ejemplo de ángulos suplementarios'},
  {term:'Bisectriz de 90°',def:'Crea dos ángulos de 45° cada uno'},
];

function genEval(){
  sfx('click'); const cf=evalFormNum; window._currentEvalForm=cf; evalFormNum=(evalFormNum%10)+1; saveProgress();
  document.getElementById('eval-screen-title').textContent=`📝 Evaluación Final — Forma ${cf} · Ángulos y Bisectriz`;
  evalAnsVisible=false; const out=document.getElementById('evalOut'); out.innerHTML='';
  const bar=document.createElement('div');bar.className='eval-score-bar'; bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje — 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25 pts</span><span class="eval-score-pill esp-tf">V/F 25 pts</span><span class="eval-score-pill esp-mc">Selección 25 pts</span><span class="eval-score-pill esp-pr">Pareados 25 pts</span></div>`;
  out.appendChild(bar);
  const cpItems=_pick(evalCPBank,5);
  const s1=document.createElement('div'); s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  cpItems.forEach((item,i)=>{ const d=document.createElement('div'); d.className='eval-item eval-auto-item'; d.dataset.evalType='cp'; d.dataset.evalIndex=i; const qHtml=item.q.replace('___',`<input class="eval-cp-input" type="text" data-cp="${i}" autocomplete="off">`); d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbCp${i}" aria-live="polite"></div>`; s1.appendChild(d); });
  out.appendChild(s1);
  const tfItems=_pick(evalTFBank,5);
  const s2=document.createElement('div'); s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  tfItems.forEach((item,i)=>{ const d=document.createElement('div'); d.className='eval-item eval-auto-item'; d.dataset.evalType='tf'; d.dataset.evalIndex=i; d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="true"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="false"> Falso</label></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbTf${i}" aria-live="polite"></div>`; s2.appendChild(d); });
  out.appendChild(s2);
  const mcItems=_pick(evalMCBank,5);
  const s3=document.createElement('div'); s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  mcItems.forEach((item,i)=>{ const d=document.createElement('div'); d.className='eval-item eval-auto-item'; d.dataset.evalType='mc'; d.dataset.evalIndex=i; const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join(''); d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbMc${i}" aria-live="polite"></div>`; s3.appendChild(d); });
  out.appendChild(s3);
  const prItems=_pick(evalPRBank,5); const shuffledDefs=[...prItems].sort(()=>Math.random()-0.5); const letters=['A','B','C','D','E'];
  const s4=document.createElement('div'); s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  const matchCard=document.createElement('div'); matchCard.className='eval-item';
  let colLeft='<div class="eval-match-col"><h4>📌 Términos</h4>'; prItems.forEach((item,i)=>{colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> <select class="eval-match-select" data-pr="${i}" aria-label="Respuesta pareada ${i+16}"><option value="">—</option>${letters.map(l=>`<option value="${l}">${l}</option>`).join('')}</select> ${item.term}</div>`;}); colLeft+='</div>';
  let colRight='<div class="eval-match-col"><h4>🔑 Definiciones</h4>'; shuffledDefs.forEach((item,i)=>{colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`;}); colRight+='</div>';
  const ansKey=prItems.map((item,i)=>{const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)];return `${i+16}→${letter}`;}).join(' · ');
  matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div><div class="eval-item-feedback" id="evalFbPr" aria-live="polite"></div>`;
  s4.appendChild(matchCard); out.appendChild(s4);
  window._evalPrintData={tf:tfItems,mc:mcItems,cp:cpItems,pr:{terms:prItems,shuffledDefs,letters}};
  const autoPanel=document.createElement('div'); autoPanel.id='evalAutoResult'; autoPanel.className='eval-auto-result'; autoPanel.innerHTML='<strong>🧮 Evaluación interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato original sin respuestas digitadas.'; out.appendChild(autoPanel);
  fin('s-evaluacion');
}
function toggleEvalAns(){ evalAnsVisible=!evalAnsVisible; document.querySelectorAll('#evalOut .eval-answer').forEach(el=>el.style.display=evalAnsVisible?'block':'none'); sfx('click'); }
function normalizeEvalAnswer(v){
    return (v||'').toString().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\s+/g,' ').replace(/[()]/g,'').trim();
}
function isCpCorrect(student,expected){
    const s=normalizeEvalAnswer(student);
    const e=normalizeEvalAnswer(expected);
    if(!s) return false;
    const variants=new Set([e]);
    if(e.includes(' ')) e.split(' ').forEach(x=>x&&variants.add(x));
    return variants.has(s)||e.replace(/[^a-z0-9]/g,'')===s.replace(/[^a-z0-9]/g,'');
}
function setEvalFeedback(id,ok,msg){
    const el=document.getElementById(id);
    if(!el) return;
    el.textContent=msg;
    el.className='eval-item-feedback '+(ok?'eval-ok':'eval-no');
}
function gradeEval(){
    if(!window._evalPrintData){showToast('⚠️ Genera una evaluación primero');return;}
    sfx('click');
    const d=window._evalPrintData;
    let total=0;
    const detail={cp:0,tf:0,mc:0,pr:0};
    d.cp.forEach((it,i)=>{
        const input=document.querySelector(`[data-cp="${i}"]`);
        const ok=isCpCorrect(input?input.value:'',it.a);
        if(input){input.classList.toggle('eval-input-ok',ok);input.classList.toggle('eval-input-no',!ok);}
        if(ok){detail.cp++;total+=5;}
        setEvalFeedback('evalFbCp'+i,ok,ok?'Correcto. +5 pts':'Revisar. Respuesta esperada: '+it.a);
    });
    d.tf.forEach((it,i)=>{
        const selected=document.querySelector(`input[name="tf${i}"]:checked`);
        const ok=!!selected&&(selected.value==='true')===it.a;
        if(ok){detail.tf++;total+=5;}
        setEvalFeedback('evalFbTf'+i,ok,ok?'Correcto. +5 pts':'Revisar. Respuesta esperada: '+(it.a?'Verdadero':'Falso'));
    });
    d.mc.forEach((it,i)=>{
        const selected=document.querySelector(`input[name="mc${i}"]:checked`);
        const ok=!!selected&&Number(selected.value)===it.a;
        if(ok){detail.mc++;total+=5;}
        setEvalFeedback('evalFbMc'+i,ok,ok?'Correcto. +5 pts':'Revisar. Respuesta esperada: '+it.o[it.a]);
    });
    const expectedLetters=d.pr.terms.map(it=>d.pr.letters[d.pr.shuffledDefs.findIndex(df=>df.def===it.def)]);
    expectedLetters.forEach((letter,i)=>{
        const sel=document.querySelector(`[data-pr="${i}"]`);
        const ok=!!sel&&sel.value===letter;
        if(sel){sel.classList.toggle('eval-input-ok',ok);sel.classList.toggle('eval-input-no',!ok);}
        if(ok){detail.pr++;total+=5;}
    });
    const prMsg=`Pareados: ${detail.pr}/5 correctos. ${detail.pr===5?'Excelente. +25 pts':'Clave: '+expectedLetters.map((l,i)=>(i+16)+'→'+l).join(' · ')}`;
    setEvalFeedback('evalFbPr',detail.pr===5,prMsg);
    const result=document.getElementById('evalAutoResult');
    if(result){
        result.className='eval-auto-result '+(total>=70?'eval-auto-pass':'eval-auto-risk');
        result.innerHTML=`<strong>Resultado automático: ${total}/100 puntos</strong><br><span>Completar: ${detail.cp*5}/25 · V/F: ${detail.tf*5}/25 · Selección: ${detail.mc*5}/25 · Pareados: ${detail.pr*5}/25</span><br><em>Este resultado es solo para revisión en pantalla; la impresión conserva el formato limpio para papel.</em>`;
    }
    if(total>=70){pts(8);showToast('🎯 Evaluación calificada: '+total+'/100');}
    else showToast('🧮 Evaluación calificada: '+total+'/100. Revisa las respuestas marcadas.');
}

function printEval(){
  if(!window._evalPrintData){showToast('⚠️ Genera una evaluación primero');return;} sfx('click');
  const forma=window._currentEvalForm||1; const d=window._evalPrintData;

  // ── I. Completar el espacio (preguntas 1-5)
  let s1='<div class="sec-title"><span>I. Completar el espacio</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div>';
  d.cp.forEach((it,i)=>{const q=it.q.replace('___','<span class="cp-blank"></span>');s1+=`<div class="cp-row"><span class="qn">${i+1}.</span><span class="cp-text">${q}</span></div>`;});

  // ── II. Verdadero o Falso (preguntas 6-10)
  let s2='<div class="sec-title"><span>II. Verdadero o Falso</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div>';
  d.tf.forEach((it,i)=>{s2+=`<div class="tf-row"><span class="qn">${i+6}.</span><span class="tf-blank"></span><span class="tf-text">${it.q}</span></div>`;});

  // ── III. Selección Múltiple (preguntas 11-15)
  let s3='<div class="sec-title"><span>III. Selección Múltiple</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div><div class="mc-grid">';
  d.mc.forEach((it,i)=>{const opts=it.o.map((op,oi)=>`<label class="mc-opt"><input type="radio" name="mcp${i}"> ${op}</label>`).join('');s3+=`<div class="mc-item"><div class="mc-q"><span class="qn">${i+11}.</span><span>${it.q}</span></div><div class="mc-opts">${opts}</div></div>`;});
  s3+='</div>';

  // ── IV. Términos Pareados (preguntas 16-20)
  let colL='<div class="pr-col"><div class="pr-head">📌 Términos</div>';d.pr.terms.forEach((it,i)=>{colL+=`<div class="pr-item"><span class="pr-num">${i+16}.</span><span class="pr-line"></span>${it.term}</div>`;});colL+='</div>';
  let colR='<div class="pr-col"><div class="pr-head">🔑 Definiciones</div>';d.pr.shuffledDefs.forEach((it,i)=>{colR+=`<div class="pr-item"><span class="pr-num">${d.pr.letters[i]}.</span>${it.def}</div>`;});colR+='</div>';
  let s4=`<div class="pr-section"><div class="sec-title"><span>IV. Términos Pareados</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div><div class="pr-grid">${colL}${colR}</div></div>`;

  // ── Pauta
  let pR='';
  pR+=`<div class="p-sec"><div class="p-ttl">I. Completar</div><table class="p-tbl">`;d.cp.forEach((it,i)=>{pR+=`<tr><td class="pn">${i+1}.</td><td class="pa">${it.a}</td></tr>`;});
  pR+=`</table></div><div class="p-sec"><div class="p-ttl">II. V o F</div><table class="p-tbl">`;d.tf.forEach((it,i)=>{pR+=`<tr><td class="pn">${i+6}.</td><td class="pa">${it.a?'V':'F'}</td></tr>`;});
  pR+=`</table></div><div class="p-sec"><div class="p-ttl">III. Selección</div><table class="p-tbl">`;d.mc.forEach((it,i)=>{pR+=`<tr><td class="pn">${i+11}.</td><td class="pa">${it.o[it.a]}</td></tr>`;});
  pR+=`</table></div><div class="p-sec"><div class="p-ttl">IV. Pareados</div><table class="p-tbl">`;d.pr.terms.forEach((it,i)=>{const l=d.pr.letters[d.pr.shuffledDefs.findIndex(df=>df.def===it.def)];pR+=`<tr><td class="pn">${i+16}.</td><td class="pa">${i+16}→${l}</td></tr>`;});pR+=`</table></div>`;

  const doc=`<!DOCTYPE html><html lang="es"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Evaluación Ángulos y Bisectriz · Forma ${forma}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body {font-family:Arial,Helvetica,sans-serif;font-size:10.5pt;color:#111;background:#fff;padding:2mm 5mm;}
.ph{margin-bottom:0.4rem;}
.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.3rem;}
.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}
.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}
.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}
.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}
.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}
.ph-crit{font-size:9pt;text-align:center;color:#555;margin-top:0.1rem;}
.sec-title {font-size:10pt;font-weight:700;padding:0.15rem 0.4rem;margin:0.2rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #2980b9;background:#eaf2f8;color:#2980b9;}
.obt-row {display:flex;align-items:baseline;gap:4px;font-size:9pt;font-weight:700;font-style:italic;color:#2980b9;}
.obt-lbl{white-space:nowrap;}
.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #2980b9;height:12px;}
.obt-pct{white-space:nowrap;}
.qn{font-weight:700;min-width:20px;flex-shrink:0;}
.tf-row{display:flex;align-items:baseline;gap:0.25rem;font-size:9pt;line-height:1.32;padding:0.15rem 0.2rem;border-bottom:1px solid #eee;}
.tf-blank{display:inline-block;min-width:38px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.15rem;}
.tf-text{flex:1;}
.mc-item {border:1px solid #ddd;border-radius:4px;padding:0.15rem 0.3rem;margin-bottom:0.12rem;break-inside:avoid;page-break-inside:avoid;}
.mc-q{font-size:9pt;line-height:1.32;display:flex;gap:0.25rem;margin-bottom:0.1rem;}
.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.15rem 0.5rem;}
.mc-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:0.05rem 0.2rem;margin-left:1.2rem;}
.mc-opt{font-size:8.5pt;display:flex;align-items:center;gap:0.2rem;}
.mc-opt input{width:11px;height:11px;flex-shrink:0;}
.cp-row{display:flex;align-items:baseline;gap:0.25rem;font-size:9pt;line-height:1.32;padding:0.15rem 0.2rem;border-bottom:1px solid #eee;}
.cp-text{flex:1;}
.cp-blank{display:inline-block;min-width:140px;border-bottom:1.5px solid #111;margin:0 0.1rem;}
.pr-section{margin-top:0.2rem;}
.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.2rem 0.5rem;margin-top:0.1rem;}
.pr-head{font-size:8pt;font-weight:700;color:#555;margin-bottom:0.15rem;}
.pr-item {font-size:9.5pt;padding:0.15rem 0.25rem;background:#eaf2f8;border-radius:3px;margin-bottom:0.1rem;display:flex;align-items:center;gap:0.2rem;line-height:1.15;break-inside:avoid;page-break-inside:avoid;}
.pr-num {font-weight:700;color:#2980b9;min-width:17px;flex-shrink:0;}
.pr-line{display:inline-block;min-width:17px;border-bottom:1.5px solid #111;margin-right:0.12rem;flex-shrink:0;}
.total-row {display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.3rem;padding:0.2rem 0;page-break-before:avoid;break-before:avoid;color:#2980b9;}
.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #2980b9;}
.pauta-wrap{page-break-before:always;padding-top:0.4rem;}
.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}
.p-main{font-size:9.5pt;font-weight:700;}
.p-sub{font-size:7pt;color:#c00;font-weight:700;margin:0.08rem 0;}
.p-meta{font-size:7pt;color:#555;}
.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.9rem;}
.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.25rem 0.4rem;}
.p-ttl{font-size:8pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.1rem;margin-bottom:0.15rem;}
.p-tbl{width:100%;border-collapse:collapse;font-size:7.5pt;}
.p-tbl tr{border-bottom:1px dotted #ddd;}
.p-tbl td{padding:0.07rem 0.12rem;vertical-align:top;}
.pn{font-weight:700;width:16px;color:#555;}.pa{color:#007a00;font-weight:600;}
.forma-tag{position:fixed;bottom:5mm;right:6mm;font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;}
@media print{@page{margin:4mm 6mm;}}
</style></head><body>
<div class="ph">
  <h2>Evaluación Final · Misión Ángulos y Bisectriz · Matemáticas</h2>
  <div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div>
  <div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div>
  <p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p>
</div>
${s1}${s2}${s3}${s4}
<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div>
<div class="pauta-wrap">
  <div class="p-head">
    <div class="p-main">✅ PAUTA — Evaluación Final · Misión Ángulos y Bisectriz · Forma ${forma}</div>
    <div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div>
    <div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u</div>
  </div>
  <div class="p-grid">${pR}</div>
</div>
<div class="forma-tag">Forma ${forma}</div>
</body></html>`;
  const win=window.open('','_blank',''); if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;} win.document.write(doc); win.document.close(); setTimeout(()=>win.print(),400);
}

// ===================== DIPLOMA =====================
function openDiploma(){
  sfx('click'); const pct=getProgress(); document.getElementById('diplPct').textContent=pct+'%'; document.getElementById('diplPct').style.color=pct>=70?'var(--jade)':pct>=40?'var(--blue)':'var(--amber)'; document.getElementById('diplBar').style.width=pct+'%';
  const stars=pct===100?'⭐⭐⭐⭐⭐':pct>=80?'⭐⭐⭐⭐':pct>=60?'⭐⭐⭐':pct>=40?'⭐⭐':'⭐'; document.getElementById('diplStars').textContent=stars;
  const msgs=['🚀 ¡ÁNIMO! Comienza tu misión. ¡Cada paso cuenta!','🌱 ¡GRAN INICIO! Estás dando los primeros pasos.','📚 ¡BUEN TRABAJO! Vas progresando muy bien.','💪 ¡MUY BIEN! Dominas gran parte del contenido.','🌟 ¡INCREÍBLE avance! Estás cerca de la excelencia.','🏆 ¡EXTRAORDINARIO! Completaste TODA la misión. ¡Eres experto en Ángulos y Bisectriz!'];
  const mi=pct===100?5:pct>=80?4:pct>=60?3:pct>=40?2:pct>=20?1:0; document.getElementById('diplMsg').textContent=msgs[mi];
  document.getElementById('diplDate').textContent='Honduras, '+new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});
  const achStr=unlockedAch.length>0?'🏅 Logros: '+unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(', '):'Sin logros aún — ¡sigue completando secciones!';
  document.getElementById('diplAch').textContent=achStr; document.getElementById('diplomaOverlay').classList.add('open'); document.querySelector('.diploma-input').focus();
}
function closeDiploma(){ document.getElementById('diplomaOverlay').classList.remove('open'); }
function updateDiplomaName(v){ document.getElementById('diplName').textContent=v||'Estudiante'; }
function shareWA(){
  const pct=getProgress(); const name=document.getElementById('diplName').textContent; const stars=document.getElementById('diplStars').textContent; const msg=document.getElementById('diplMsg').textContent; const date=document.getElementById('diplDate').textContent;
  const achText=unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join('\n');
  const txt=`${stars} CONSTANCIA DE LOGRO ${stars}\n\n📝 Misión: Ángulos y Bisectriz\n👤 Estudiante: ${name}\n📊 Progreso: ${pct}% completado\n⭐ XP obtenido: ${xp} de ${MXP}${achText?'\n\n🏅 Logros desbloqueados:\n'+achText:''}\n\n${msg}\n\n📅 ${date}\n🏠 Proyecto Educativo Familia Polanco-Castellanos\n🌐 policastsapien.com`;
  window.open('https://wa.me/?text='+encodeURIComponent(txt),'_blank');
}

// ===================== METACOGNICIÓN — estrellas interactivas =====================
function initMetaStars(){
  document.querySelectorAll('.meta-stars').forEach(container=>{
    for(let i=1;i<=5;i++){
      const btn=document.createElement('button');
      btn.className='meta-star';
      btn.textContent='⭐';
      btn.setAttribute('aria-label',`${i} de 5`);
      btn.dataset.val=i;
      btn.onclick=()=>{
        sfx('click');
        const stars=container.querySelectorAll('.meta-star');
        const val=parseInt(btn.dataset.val);
        stars.forEach((s,idx)=>s.classList.toggle('lit',idx<val));
      };
      container.appendChild(btn);
    }
  });
}

// ===================== INIT =====================
document.addEventListener('DOMContentLoaded',()=>{
  initTheme(); initFontSize(); loadProgress();
  initSVGOrgans(); initMetaStars();
  upFC(); buildQz(); buildClass(); showId(); showCmp(); genTask(); genEval();
  updateRetoButtons(); renderAchPanel();
  document.addEventListener('click',function(e){ const panel=document.getElementById('achPanel'); const btn=document.getElementById('achBtn'); if(panel.classList.contains('open')&&!panel.contains(e.target)&&e.target!==btn) panel.classList.remove('open'); });
  document.addEventListener('click',function(e){ if(e.target===document.getElementById('diplomaOverlay')) closeDiploma(); });
  fin('s-aprende'); fin('s-tipos');
});
