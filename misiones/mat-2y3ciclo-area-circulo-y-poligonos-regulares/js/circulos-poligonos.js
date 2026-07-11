// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
// Compartir misión por WhatsApp
function compartirMision() {
    const url = window.location.href;
    const texto = `🚀 *Misión Asignada: Círculos y Polígonos* 🚀\n\nPractica sobre este tema y sobresale en ser de los mejores alumnos. 🏆\n\nDesbloquea *todos los logros* y envía a tu maestro la *constancia de logro* cuando hayas culminado. 📋\n\n_Se te hará prueba escrita y serás excelente estudiante en Matemáticas._ ✍️\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;
    _waShare(texto);
}

// ===================== UTILIDADES =====================
const _pick = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
const _shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
function fb(id, msg, isOk) {
  const el = document.getElementById(id);
  if(el) { el.textContent = msg; el.className = 'fb show ' + (isOk ? 'ok' : 'err'); }
}

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY = 'circulos_poligonos_v1';
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
  clasif_pro:{icon:'🗂️',label:'Clasificador de áreas experto'},
  id_master:{icon:'🔍',label:'Identificador de fórmulas maestro'},
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

// ===================== FLASHCARD DATA =====================
const fcData=[
  {w:'Área del Círculo',a:'🛑 La medida de la superficie interior. Su fórmula es: <strong>A = π · r²</strong>'},
  {w:'Radio (r)',a:'📏 Distancia exacta desde el <strong>centro del círculo</strong> hasta cualquier punto del borde.'},
  {w:'Diámetro (d)',a:'↔️ Segmento que une dos puntos del borde pasando por el centro. <strong>Mide el doble del radio (d = 2r).</strong>'},
  {w:'Pi (π)',a:'🔢 Número irracional que representa la relación entre la circunferencia y su diámetro. <strong>Aprox. 3.1416</strong>.'},
  {w:'Sector Circular',a:'🍕 Una "rebanada" del círculo limitada por <strong>dos radios y un arco</strong>.'},
  {w:'Polígono Regular',a:'⬢ Figura geométrica plana que tiene <strong>todos sus lados y ángulos iguales</strong>.'},
  {w:'Centro (Polígono)',a:'🎯 Punto interior que está a la misma distancia (equidistante) de todos los <strong>vértices</strong> del polígono.'},
  {w:'Apotema (a)',a:'📐 Segmento que va desde el centro del polígono hasta el <strong>punto medio de cualquier lado</strong>, formando 90°.'},
  {w:'Área de Polígonos',a:'🧮 Fórmula general para polígonos regulares: <strong>A = (P · a) / 2</strong> (Perímetro por apotema entre dos).'},
  {w:'Perímetro (P)',a:'🔄 La medida del contorno de una figura. En un polígono regular se calcula: <strong>lado × número de lados</strong>.'}
];
let fcIdx = 0;
function upFC(){ document.getElementById('fcInner').classList.remove('flipped'); document.getElementById('fcW').textContent=fcData[fcIdx].w; document.getElementById('fcA').innerHTML=fcData[fcIdx].a; document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length; }
function flipCard(){ sfx('flip'); document.getElementById('fcInner').classList.toggle('flipped'); if(!xpTracker.fc.has(fcIdx)){xpTracker.fc.add(fcIdx);pts(1);} if(xpTracker.fc.size===fcData.length){fin('s-flash');unlockAchievement('flash_master');} }
function nextFC(){ sfx('click'); fcIdx=(fcIdx+1)%fcData.length; upFC(); }
function prevFC(){ sfx('click'); fcIdx=(fcIdx-1+fcData.length)%fcData.length; upFC(); }

// ===================== QUIZ DATA =====================
const qzData=[
  {q:'¿Cuál es la fórmula para calcular el área de un círculo?',
   o:['a) A = π · d','b) A = π · r²','c) A = (P · a) / 2','d) A = 2 · π · r'],c:1,
   hint:'💡 Piensa en el radio al cuadrado.',
   exp:'El área de un círculo se calcula multiplicando Pi por el cuadrado de su radio (A = π · r²). La opción d) es para la circunferencia (perímetro).'},
  {q:'Si el diámetro de un círculo es 10 cm, ¿cuál es su radio?',
   o:['a) 5 cm','b) 10 cm','c) 20 cm','d) 3.14 cm'],c:0,
   hint:'💡 Recuerda que el diámetro está formado por exactamente 2 radios.',
   exp:'El radio es la mitad del diámetro. Si el diámetro es 10 cm, el radio es 10 ÷ 2 = 5 cm.'},
  {q:'¿Qué es la apotema de un polígono regular?',
   o:['a) El lado más largo','b) La distancia de vértice a vértice','c) Distancia del centro al punto medio del lado','d) La suma de todos los lados'],c:2,
   hint:'💡 Es un segmento interno que cae formando un ángulo recto (90°) con uno de los lados.',
   exp:'La apotema es el segmento perpendicular que une el centro del polígono con el punto medio de cualquiera de sus lados.'},
  {q:'Para encontrar el área de un hexágono regular usamos:',
   o:['a) A = l · l','b) A = (b · h) / 2','c) A = π · r²','d) A = (P · a) / 2'],c:3,
   hint:'💡 Requiere conocer todo el contorno (Perímetro) y el segmento central (apotema).',
   exp:'Para cualquier polígono regular (pentágono, hexágono, etc.), el área se calcula multiplicando su Perímetro (P) por su apotema (a) y dividiendo el resultado entre 2.'},
  {q:'¿Qué elementos delimitan un "Sector Circular"?',
   o:['a) Dos radios y un arco','b) Tres lados rectos','c) Un diámetro y una cuerda','d) Dos apotemas'],c:0,
   hint:'💡 Piensa en cómo se corta una porción de pizza desde el centro.',
   exp:'Un sector circular está delimitado por dos radios que parten del centro y el arco (porción de circunferencia) que queda entre ellos.'},
  {q:'Si el radio de un círculo es 3 cm y consideramos π ≈ 3, su área aproximada es:',
   o:['a) 9 cm²','b) 18 cm²','c) 27 cm²','d) 12 cm²'],c:2,
   hint:'💡 Usa la fórmula: Área = π · r². Primero eleva el 3 al cuadrado y luego multiplica por 3.',
   exp:'Calculamos el radio al cuadrado: 3² = 9. Luego multiplicamos por pi (3): 9 · 3 = 27 cm².'},
  {q:'¿Cómo se calcula el perímetro de un pentágono regular si conoces la medida de un lado (l)?',
   o:['a) P = l + 5','b) P = 5 · l','c) P = l²','d) P = (l · 5) / 2'],c:1,
   hint:'💡 "Penta" significa cinco, y "regular" significa que todos los lados miden lo mismo.',
   exp:'Como un pentágono regular tiene 5 lados iguales, su perímetro es la suma de los 5 lados, es decir, multiplicar el lado por 5 (P = 5 · l).'},
  {q:'Al calcular áreas, ¿en qué tipo de unidades se debe expresar el resultado?',
   o:['a) Unidades cúbicas (cm³)','b) Unidades lineales (cm)','c) Grados (°)','d) Unidades cuadradas (cm²)'],c:3,
   hint:'💡 Imagina que estás cubriendo la superficie con pequeños cuadritos.',
   exp:'El área siempre se expresa en unidades cuadradas (cm², m², km²), ya que mide superficies bidimensionales, a diferencia del perímetro que es lineal.'},
];
let qzIdx=0, qzSel=-1, qzDone=false;
function buildQz(){ qzIdx=0; qzSel=-1; qzDone=false; showQz(); }
function showQz(){
  if(qzIdx>=qzData.length){
    document.getElementById('qzQ').textContent='🎉 ¡Laboratorio completado! Revisaste todas las preguntas.';
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
  { label:['Círculo','Polígono Regular'], headA:'🛑 Del Círculo', headB:'⬢ Del Polígono', colA:'cir', colB:'pol',
    words:[{w:'Radio',t:'cir'},{w:'Apotema',t:'pol'},{w:'Diámetro',t:'cir'},{w:'Lado',t:'pol'},{w:'Número Pi (π)',t:'cir'},{w:'Vértice',t:'pol'},{w:'Arco',t:'cir'},{w:'Ángulo interno',t:'pol'}] },
  { label:['Fórmulas de Área','Fórmulas Lineales'], headA:'🧮 Área (Superficie)', headB:'📏 Perímetro/Longitud', colA:'ar', colB:'lin',
    words:[{w:'A = π · r²',t:'ar'},{w:'P = lado × n',t:'lin'},{w:'A = (P · a) / 2',t:'ar'},{w:'d = 2 · r',t:'lin'},{w:'A. Sector = (π·r²·α)/360',t:'ar'},{w:'P = L_arco + 2r',t:'lin'}] },
  { label:['Unidades Lineales','Unidades Cuadradas'], headA:'📏 Unidades Lineales', headB:'🧊 Unidades Cuadradas', colA:'uni1', colB:'uni2',
    words:[{w:'Centímetros (cm)',t:'uni1'},{w:'Metros Cuadrados (m²)',t:'uni2'},{w:'Kilómetros (km)',t:'uni1'},{w:'Centímetros Cua. (cm²)',t:'uni2'},{w:'Milímetros (mm)',t:'uni1'},{w:'Hectáreas (ha)',t:'uni2'}] },
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
  {s:['El','radio','es','la','distancia','del','centro','al','borde.'],c:1,art:'Busca el segmento del círculo.'},
  {s:['La','apotema','cae','al','punto','medio','del','lado','del','polígono.'],c:1,art:'Busca el segmento exclusivo de los polígonos.'},
  {s:['El','área','de','un','círculo','se','calcula','con','Pi','y','radio.'],c:1,art:'Busca el término que indica "superficie".'},
  {s:['Un','sector','circular','parece','una','rebanada','de','pizza.'],c:1,art:'Busca la porción del círculo.'},
  {s:['El','perímetro','es','la','suma','de','los','lados','de','la','figura.'],c:1,art:'Busca la palabra que significa "contorno".'},
  {s:['El','diámetro','atraviesa','el','centro','y','toca','dos','bordes.'],c:1,art:'Busca la cuerda más larga del círculo.'},
  {s:['En','el','centro','del','polígono','equidistan','los','vértices.'],c:2,art:'Busca el punto de equilibrio central.'},
  {s:['El','número','Pi','vale','aproximadamente','3.1416.'],c:2,art:'Busca la constante irracional.'},
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
  {s:'El área de un círculo es igual a ___ por radio al cuadrado.',opts:['Perímetro','Pi','Diámetro'],c:1},
  {s:'La ___ une el centro del polígono con el punto medio de su lado.',opts:['apotema','diagonal','circunferencia'],c:0},
  {s:'El diámetro equivale exactamente a ___ radios.',opts:['tres','cuatro','dos'],c:2},
  {s:'Un ___ circular está delimitado por dos radios y un arco.',opts:['polígono','sector','perímetro'],c:1},
  {s:'El área siempre se expresa en unidades ___.',opts:['lineales','cúbicas','cuadradas'],c:2},
  {s:'Para el área de un polígono, multiplicamos ___ por apotema y dividimos por dos.',opts:['Lado','Perímetro','Centro'],c:1},
  {s:'El punto equidistante a todos los vértices es el ___.',opts:['radio','vértice','centro'],c:2},
  {s:'El perímetro de un hexágono de lado 4cm es ___ cm.',opts:['20','24','16'],c:1},
];
let cmpIdx=0, cmpSel=-1, cmpDone=false;
function showCmp(){
  if(cmpIdx>=cmpData.length){document.getElementById('cmpSent').innerHTML='🎉 ¡Completado!';document.getElementById('cmpOpts').innerHTML='';fin('s-completa');return;}
  const d=cmpData[cmpIdx]; document.getElementById('cmpProg').textContent=`Oración ${cmpIdx+1} de ${cmpData.length}`; document.getElementById('cmpSent').innerHTML=d.s.replace('___','<span class="blank">___</span>');
  const opts=document.getElementById('cmpOpts'); opts.innerHTML=''; cmpSel=-1; cmpDone=false;
  d.opts.forEach((o,i)=>{ const b=document.createElement('button'); b.className='cmp-opt'; b.textContent=o; b.onclick=()=>{if(cmpDone)return;document.querySelectorAll('.cmp-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');cmpSel=i;sfx('click');}; opts.appendChild(b); });
}
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
  { label:['Área','Perímetro'], btnA:'🧮 Área', btnB:'📏 Perímetro', colA:'ar', colB:'pe',
    words:[{w:'π · r²',t:'ar'},{w:'Suma de lados',t:'pe'},{w:'(P · a) / 2',t:'ar'},{w:'Unidades lineales',t:'pe'},{w:'Unidades cuadradas',t:'ar'},{w:'Lado × 6',t:'pe'},{w:'Superficie interna',t:'ar'},{w:'Contorno',t:'pe'}] },
  { label:['Círculo','Polígono'], btnA:'🛑 Círculo', btnB:'⬢ Polígono', colA:'ci', colB:'po',
    words:[{w:'Radio',t:'ci'},{w:'Apotema',t:'po'},{w:'Diámetro',t:'ci'},{w:'Hexágono',t:'po'},{w:'Número Pi (π)',t:'ci'},{w:'Vértices',t:'po'},{w:'Sector Circular',t:'ci'},{w:'Pentágono',t:'po'}] },
  { label:['Apotema','Radio'], btnA:'📐 Apotema', btnB:'📏 Radio', colA:'ap', colB:'ra',
    words:[{w:'Polígono',t:'ap'},{w:'Círculo',t:'ra'},{w:'Al punto medio del lado',t:'ap'},{w:'Del centro al borde',t:'ra'},{w:'Forma 90° con el lado',t:'ap'},{w:'Mitad del diámetro',t:'ra'}] },
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
  {q:'Determina la fórmula para el área del círculo.',ans:'A = π · r²'},
  {q:'¿Qué representa "a" en A = (P · a) / 2?',ans:'La Apotema.'},
  {q:'El segmento del centro al borde del círculo es...',ans:'El Radio.'},
  {q:'Porción circular delimitada por dos radios y un arco.',ans:'Sector circular.'},
  {q:'Medida del contorno de una figura plana.',ans:'Perímetro.'},
  {q:'Segmento que mide el doble del radio.',ans:'Diámetro.'},
  {q:'Valor aproximado de Pi (π).',ans:'3.1416'},
  {q:'Unidad correcta para medir una superficie (área).',ans:'Unidades Cuadradas (m², cm²...)'},
];
const classifyTasks=[
  {q:'A = π · r² → ¿Área o Perímetro?',ans:'Área.'},
  {q:'Apotema → ¿Círculo o Polígono?',ans:'Polígono.'},
  {q:'Diámetro → ¿Círculo o Polígono?',ans:'Círculo.'},
  {q:'Lado × 5 → ¿Área o Perímetro?',ans:'Perímetro (de un pentágono).'},
  {q:'Centímetros Cuadrados (cm²) → ¿Área o Perímetro?',ans:'Área.'},
  {q:'Sector Circular → ¿Círculo o Polígono?',ans:'Círculo.'},
  {q:'A = (P · a) / 2 → ¿Área o Perímetro?',ans:'Área (de polígono).'},
  {q:'Metros (m) → ¿Área o Perímetro?',ans:'Perímetro.'},
];
const completeTasks=[
  {q:'El área de un círculo es ___ por el radio al cuadrado.',blank:'Pi',ans:'Pi'},
  {q:'La ___ es la distancia del centro al punto medio del lado del polígono.',blank:'apotema',ans:'apotema'},
  {q:'El ___ equivale a dos radios.',blank:'diámetro',ans:'diámetro'},
  {q:'El ___ del sector circular incluye el arco y dos radios.',blank:'perímetro',ans:'perímetro'},
  {q:'Para el área de un polígono se necesita el Perímetro y la ___.',blank:'apotema',ans:'apotema'},
  {q:'El área se mide siempre en unidades ___.',blank:'cuadradas',ans:'cuadradas'},
  {q:'Un sector circular parece una rebanada de ___.',blank:'pizza',ans:'pizza'},
  {q:'Un hexágono regular tiene ___ lados iguales.',blank:'seis',ans:'seis'},
];
const explainQuestions=[
  {q:'¿Cuál es la diferencia entre círculo y circunferencia?',ans:'El círculo es la superficie plana interior, la circunferencia es el borde o perímetro.'},
  {q:'¿Qué es la apotema de un polígono regular?',ans:'El segmento que va del centro al punto medio de un lado (formando 90°).'},
  {q:'¿Cómo se calcula el perímetro de un octágono regular?',ans:'Multiplicando la medida de un lado por 8.'},
  {q:'¿Qué es un sector circular?',ans:'Una porción del círculo limitada por dos radios y un arco.'},
  {q:'¿Por qué el área se mide en centímetros cuadrados y no en centímetros?',ans:'Porque el área mide una superficie (2 dimensiones), mientras el centímetro mide longitud (1 dimensión).'},
  {q:'Si tienes el diámetro de un círculo, ¿cómo encuentras su área?',ans:'Se divide el diámetro entre 2 para sacar el radio, y luego se aplica A = π · r².'},
  {q:'Explica la fórmula A = (P · a) / 2',ans:'Significa Área igual a Perímetro por apotema, todo dividido entre 2. Aplica a polígonos regulares.'},
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
function genClassifyTask(out,count){ _instrBlock(out,'Instrucción',['Clasifica cada concepto geométrico según corresponda.']); const pool=_shuffle([...classifyTasks]); for(let i=0;i<count;i++){const item=pool[i%pool.length]; const div=document.createElement('div');div.className='tg-task'; div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.ans}</div></div>`; out.appendChild(div);} }
function genCompleteTask(out,count){ _instrBlock(out,'Instrucción',['Completa cada oración con la palabra geométrica correcta.']); const pool=_shuffle([...completeTasks]); for(let i=0;i<count;i++){const item=pool[i%pool.length]; const div=document.createElement('div');div.className='tg-task'; div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content">${item.q.replace(item.blank,'<span class="tg-blank"></span>')}<div class="tg-answer">✅ ${item.ans}</div></div>`; out.appendChild(div);} }
function genExplainTask(out,count){ _instrBlock(out,'Instrucción',['Copia las preguntas en tu cuaderno y responde de forma clara.']); const pool=_shuffle([...explainQuestions]); for(let i=0;i<count;i++){const item=pool[i%pool.length]; const div=document.createElement('div');div.className='tg-task'; div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.3rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.ans}</div></div>`; out.appendChild(div);} }
function toggleAns(){ ansVisible=!ansVisible; document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none'); sfx('click'); }

// ===================== EVALUACIÓN FINAL =====================
const evalTFBank=[
  {q:'El área de un círculo se calcula multiplicando Pi por su radio al cuadrado.',a:true},
  {q:'La apotema es el segmento más largo de un polígono.',a:false},
  {q:'El diámetro equivale exactamente a dos radios.',a:true},
  {q:'Un sector circular está delimitado por tres apotemas.',a:false},
  {q:'El área de un hexágono regular se calcula con A = (P · a) / 2.',a:true},
  {q:'El perímetro se expresa en unidades cuadradas (cm²).',a:false},
  {q:'Pi (π) es un valor constante aproximado a 3.1416.',a:true},
  {q:'El radio es la distancia del centro a cualquier punto del borde del círculo.',a:true},
  {q:'La fórmula del área del círculo sirve también para el área de un cuadrado.',a:false},
  {q:'La apotema de un polígono regular forma un ángulo de 90° con el lado.',a:true},
  {q:'El perímetro de un sector circular es la suma de su arco y dos radios.',a:true},
  {q:'Un octágono regular tiene 6 lados.',a:false},
  {q:'Para calcular el perímetro de un pentágono regular, se multiplica el lado por 5.',a:true},
  {q:'El centro del polígono está a la misma distancia de todos sus vértices.',a:true},
  {q:'Unidades cúbicas se utilizan para medir áreas.',a:false},
];
const evalMCBank=[
  {q:'¿Cuál es la fórmula del área del círculo?',o:['a) A = π · r','b) A = π · r²','c) A = (P·a)/2','d) A = L · L'],a:1},
  {q:'¿Qué representa la "a" en la fórmula de polígonos?',o:['a) Área','b) Altura','c) Apotema','d) Arco'],a:2},
  {q:'El segmento del centro del círculo a su borde se llama:',o:['a) Cuerda','b) Diámetro','c) Radio','d) Apotema'],a:2},
  {q:'Si el radio es 4cm, el diámetro es:',o:['a) 2cm','b) 8cm','c) 16cm','d) 12cm'],a:1},
  {q:'Un sector circular parece:',o:['a) Un cuadrado','b) Una rebanada de pizza','c) Un hexágono','d) Una línea'],a:1},
  {q:'La apotema forma un ángulo con el lado de:',o:['a) 45°','b) 90°','c) 180°','d) 360°'],a:1},
  {q:'¿En qué unidades se mide el área?',o:['a) cm³','b) Litros','c) m','d) cm²'],a:3},
  {q:'Fórmula de área para un pentágono regular:',o:['a) A = π·r²','b) A = (P·a)/2','c) A = b·h','d) A = l³'],a:1},
  {q:'El número Pi (π) equivale aproximadamente a:',o:['a) 2.14','b) 3.1416','c) 1.41','d) 9.81'],a:1},
  {q:'¿Qué necesitamos para calcular el perímetro de un hexágono regular?',o:['a) La apotema','b) Conocer su lado','c) El número Pi','d) El radio'],a:1},
];
const evalCPBank=[
  {q:'La ___ es la distancia del centro al punto medio del lado del polígono.',a:'apotema'},
  {q:'El área de un círculo se calcula con Pi y el ___ al cuadrado.',a:'radio'},
  {q:'Un ___ circular está formado por un arco y dos radios.',a:'sector'},
  {q:'El área siempre se expresa en unidades ___.',a:'cuadradas'},
  {q:'El ___ de un círculo es igual a dos radios.',a:'diámetro'},
  {q:'Para polígonos regulares, el Área es Perímetro por apotema entre ___.',a:'dos'},
  {q:'La letra "P" en la fórmula del polígono significa ___.',a:'perimetro'},
  {q:'El perímetro de un sector suma el arco y dos ___.',a:'radios'},
  {q:'El valor aproximado de Pi es ___.',a:'3.1416'},
  {q:'El punto interior a la misma distancia de los vértices es el ___.',a:'centro'},
];
const evalPRBank=[
  {term:'A = π · r²',def:'Fórmula del área del círculo'},
  {term:'A = (P · a) / 2',def:'Fórmula del área de polígonos regulares'},
  {term:'Apotema',def:'Segmento del centro al lado del polígono'},
  {term:'Radio',def:'Segmento del centro al borde del círculo'},
  {term:'Diámetro',def:'Segmento que cruza el círculo por el centro'},
  {term:'Sector Circular',def:'Porción delimitada por dos radios y un arco'},
  {term:'Perímetro',def:'Medida del contorno o borde de una figura'},
  {term:'Unidades Cuadradas',def:'Unidades utilizadas para expresar el área'},
  {term:'Pi (π)',def:'Constante matemática aproximada a 3.1416'},
  {term:'Centro',def:'Punto interior equidistante a los vértices'},
];

function genEval(){
  sfx('click'); const cf=evalFormNum; window._currentEvalForm=cf; evalFormNum=(evalFormNum%10)+1; saveProgress();
  document.getElementById('eval-screen-title').textContent=`📝 Evaluación Final — Forma ${cf} · Áreas y Polígonos`;
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
    return (v||'').toString().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\s+/g,'').replace(/[()]/g,'').trim();
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
        result.innerHTML=`<strong>Resultado automático: ${total}/100 puntos</strong><br><span>Completar: ${detail.cp*5}/25 · V/F: ${detail.tf*5}/25 · Selección: ${detail.mc*5}/25 · Pareados: ${detail.pr*5}/25</span><br><em>Este resultado es solo para revisión en pantalla.</em>`;
    }
    if(total>=70){pts(8);showToast('🎯 Evaluación calificada: '+total+'/100');}
    else showToast('🧮 Evaluación calificada: '+total+'/100. Revisa las respuestas.');
}

function printEval(){
  if(!window._evalPrintData){showToast('⚠️ Genera una evaluación primero');return;} sfx('click');
  const forma=window._currentEvalForm||1; const d=window._evalPrintData;

  let s1='<div class="sec-title"><span>I. Completar el espacio</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div>';
  d.cp.forEach((it,i)=>{const q=it.q.replace('___','<span class="cp-blank"></span>');s1+=`<div class="cp-row"><span class="qn">${i+1}.</span><span class="cp-text">${q}</span></div>`;});

  let s2='<div class="sec-title"><span>II. Verdadero o Falso</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div>';
  d.tf.forEach((it,i)=>{s2+=`<div class="tf-row"><span class="qn">${i+6}.</span><span class="tf-blank"></span><span class="tf-text">${it.q}</span></div>`;});

  let s3='<div class="sec-title"><span>III. Selección Múltiple</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div><div class="mc-grid">';
  d.mc.forEach((it,i)=>{const opts=it.o.map((op,oi)=>`<label class="mc-opt"><input type="radio" name="mcp${i}"> ${op}</label>`).join('');s3+=`<div class="mc-item"><div class="mc-q"><span class="qn">${i+11}.</span><span>${it.q}</span></div><div class="mc-opts">${opts}</div></div>`;});
  s3+='</div>';

  let colL='<div class="pr-col"><div class="pr-head">📌 Términos</div>';d.pr.terms.forEach((it,i)=>{colL+=`<div class="pr-item"><span class="pr-num">${i+16}.</span><span class="pr-line"></span>${it.term}</div>`;});colL+='</div>';
  let colR='<div class="pr-col"><div class="pr-head">🔑 Definiciones</div>';d.pr.shuffledDefs.forEach((it,i)=>{colR+=`<div class="pr-item"><span class="pr-num">${d.pr.letters[i]}.</span>${it.def}</div>`;});colR+='</div>';
  let s4=`<div class="pr-section"><div class="sec-title"><span>IV. Términos Pareados</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div><div class="pr-grid">${colL}${colR}</div></div>`;

  let pR='';
  pR+=`<div class="p-sec"><div class="p-ttl">I. Completar</div><table class="p-tbl">`;d.cp.forEach((it,i)=>{pR+=`<tr><td class="pn">${i+1}.</td><td class="pa">${it.a}</td></tr>`;});
  pR+=`</table></div><div class="p-sec"><div class="p-ttl">II. V o F</div><table class="p-tbl">`;d.tf.forEach((it,i)=>{pR+=`<tr><td class="pn">${i+6}.</td><td class="pa">${it.a?'V':'F'}</td></tr>`;});
  pR+=`</table></div><div class="p-sec"><div class="p-ttl">III. Selección</div><table class="p-tbl">`;d.mc.forEach((it,i)=>{pR+=`<tr><td class="pn">${i+11}.</td><td class="pa">${it.o[it.a]}</td></tr>`;});
  pR+=`</table></div><div class="p-sec"><div class="p-ttl">IV. Pareados</div><table class="p-tbl">`;d.pr.terms.forEach((it,i)=>{const l=d.pr.letters[d.pr.shuffledDefs.findIndex(df=>df.def===it.def)];pR+=`<tr><td class="pn">${i+16}.</td><td class="pa">${i+16}→${l}</td></tr>`;});pR+=`</table></div>`;

  
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

const doc=`<!DOCTYPE html><html lang="es"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Evaluación Áreas y Polígonos · Forma ${forma}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body {font-family:Arial,Helvetica,sans-serif;font-size:12pt;color:#111;background:#fff;padding:2mm 6mm;width:201.9mm;margin:0 auto;}
.ph{margin-bottom:0.55rem;}
.ph h2{font-size:12pt;font-weight:700;text-align:center;margin-bottom:0.4rem;}
.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:5px;}
.ph-fill{flex:1;border-bottom:1px solid #555;min-height:13px;display:block;}
.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}
.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}
.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}
.ph-crit{font-size:10.5pt;text-align:center;color:#555;margin-top:0.2rem;}
.sec-title {font-size:11pt;font-weight:700;padding:0.2rem 0.48rem;margin:0.38rem 0 0.17rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #1565c0;background:#e3f2fd;color:#1565c0;}
.obt-row {display:flex;align-items:baseline;gap:4px;font-size:10pt;font-weight:700;font-style:italic;color:#1565c0;}
.obt-lbl{white-space:nowrap;}
.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #1565c0;height:13px;}
.obt-pct{white-space:nowrap;}
.qn{font-weight:700;min-width:22px;flex-shrink:0;}
.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:11pt;line-height:1.4;padding:0.22rem 0.25rem;border-bottom:1px solid #eee;}
.tf-blank{display:inline-block;min-width:40px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.18rem;}
.tf-text{flex:1;}
.mc-item {border:1px solid #ddd;border-radius:4px;padding:0.22rem 0.42rem;margin-bottom:0.17rem;break-inside:avoid;page-break-inside:avoid;}
.mc-q{font-size:11pt;line-height:1.4;display:flex;gap:0.28rem;margin-bottom:0.15rem;}
.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.17rem 0.5rem;}
.mc-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:0.06rem 0.2rem;margin-left:1.2rem;}
.mc-opt{font-size:9.5pt;display:flex;align-items:center;gap:0.2rem;}
.mc-opt input{width:11px;height:11px;flex-shrink:0;}
.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:11pt;line-height:1.4;padding:0.22rem 0.25rem;border-bottom:1px solid #eee;}
.cp-text{flex:1;}
.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}
.pr-section{margin-top:0.22rem;}
.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.2rem 0.5rem;margin-top:0.15rem;}
.pr-head{font-size:9.5pt;font-weight:700;color:#555;margin-bottom:0.18rem;}
.pr-item {font-size:11pt;padding:0.2rem 0.35rem;background:#e3f2fd;border-radius:3px;margin-bottom:0.14rem;display:flex;align-items:center;gap:0.2rem;line-height:1.28;break-inside:avoid;page-break-inside:avoid;}
.pr-num {font-weight:700;color:#1565c0;min-width:19px;flex-shrink:0;}
.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}
.total-row {display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:12pt;font-weight:700;font-style:italic;margin-top:0.42rem;padding:0.28rem 0;page-break-before:avoid;break-before:avoid;color:#1565c0;}
.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #1565c0;}
.pauta-wrap{page-break-before:always;padding-top:0.4rem;}
.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}
.p-main{font-size:13pt;font-weight:700;}
.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}
.p-meta{font-size:9pt;color:#555;}
.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}
.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.35rem 0.55rem;}
.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}
.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}
.p-tbl tr{border-bottom:1px dotted #ddd;}
.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}
.pn{font-weight:700;width:24px;color:#555;}.pa{color:#007a00;font-weight:600;}
.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}
@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}
</style></head><body><div id="evalPage">
<div class="ph">
  <h2>Evaluación Final · Misión Áreas y Polígonos · Matemáticas</h2>
  <div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div>
  <div class="ph-line"><strong>Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div>
  <p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p>
</div>
${s1}${s2}${s3}${s4}
<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div>
</div><div class="pauta-wrap" id="pautaPage">
  <div class="p-head">
    <div class="p-main">✅ PAUTA — Evaluación Final · Áreas y Polígonos · Forma ${forma}</div>
    <div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div>
    <div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u</div>
  </div>
  <div class="p-grid">${pR}</div>
  ${zgBlock}
</div>
<div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div>
<script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("evalPage",252,0.55,1.45);fit("pautaPage",252,0.55,1.3);})();</script></body></html>`;
  const win=window.open('','_blank',''); if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;} win.document.write(doc); win.document.close(); setTimeout(()=>win.print(),400);
}

// ===================== DIPLOMA =====================
function _diplPct() { return xp >= MXP ? 100 : Math.round((xp / MXP) * 100); }
function openDiploma(){
  sfx('click'); const pct = _diplPct(); document.getElementById('diplPct').textContent=pct+'%'; document.getElementById('diplPct').style.color=pct>=70?'var(--jade)':pct>=40?'var(--blue)':'var(--amber)'; document.getElementById('diplBar').style.width=pct+'%';
  const stars=pct===100?'⭐⭐⭐⭐⭐':pct>=80?'⭐⭐⭐⭐':pct>=60?'⭐⭐⭐':pct>=40?'⭐⭐':'⭐'; document.getElementById('diplStars').textContent=stars;
  const msgs=['🚀 ¡ÁNIMO! Comienza tu misión. ¡Cada paso cuenta!','🌱 ¡GRAN INICIO! Estás dando los primeros pasos.','📚 ¡BUEN TRABAJO! Vas progresando muy bien.','💪 ¡MUY BIEN! Dominas gran parte del contenido.','🌟 ¡INCREÍBLE avance! Estás cerca de la excelencia.','🏆 ¡EXTRAORDINARIO! Completaste TODA la misión. ¡Eres experto en Áreas y Polígonos!'];
  const mi=pct===100?5:pct>=80?4:pct>=60?3:pct>=40?2:pct>=20?1:0; document.getElementById('diplMsg').textContent=msgs[mi];
  document.getElementById('diplDate').textContent='Honduras, '+new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});
  const achStr=unlockedAch.length>0?'🏅 Logros: '+unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(', '):'Sin logros aún — ¡sigue completando secciones!';
  document.getElementById('diplAch').textContent=achStr; document.getElementById('diplomaOverlay').classList.add('open'); document.querySelector('.diploma-input').focus();
}
function closeDiploma(){ document.getElementById('diplomaOverlay').classList.remove('open'); }
function updateDiplomaName(v){ document.getElementById('diplName').textContent=v||'Estudiante'; }
function shareWA(){
  const pct = _diplPct(); const name=document.getElementById('diplName').textContent; const stars=document.getElementById('diplStars').textContent; const msg=document.getElementById('diplMsg').textContent; const date=document.getElementById('diplDate').textContent;
  const achText=unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join('\n');
  const txt=`${stars} CONSTANCIA DE LOGRO ${stars}\n\n📝 Misión: Círculos y Polígonos\n👤 Estudiante: ${name}\n📊 Progreso: ${pct}% completado\n⭐ XP obtenido: ${xp} de ${MXP}${achText?'\n\n🏅 Logros desbloqueados:\n'+achText:''}\n\n${msg}\n\n📅 ${date}\n🏠 Proyecto Educativo M.E.T.A.S\n🌐 policastsapien.com`;
  _waShare(txt);
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
  initTheme(); initFontSize(); loadProgress();
  initMetaStars();
  upFC(); buildQz(); buildClass(); showId(); showCmp(); genTask(); genEval();
  updateRetoButtons(); renderAchPanel();
  document.addEventListener('click',function(e){ const panel=document.getElementById('achPanel'); const btn=document.getElementById('achBtn'); if(panel.classList.contains('open')&&!panel.contains(e.target)&&e.target!==btn) panel.classList.remove('open'); });
  document.addEventListener('click',function(e){ if(e.target===document.getElementById('diplomaOverlay')) closeDiploma(); });
  fin('s-aprende'); fin('s-tipos');
});