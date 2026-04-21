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
  if(el) { el.textContent = msg; el.className = 'fb show ' + (isOk ? 'ok' : 'err'); }
}

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY = 'geografia_continentes_eas_v1';
let xp = 0, MXP = 200, done = new Set(), evalAnsVisible = false;
let evalFormNum = 1;
let unlockedAch = [];
let darkMode = false;
let prevLevel = 0;
const TOTAL_SECTIONS = 12;

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
  flash_master:{icon:'🃏',label:'Todas las flashcards exploradas'},
  clasif_pro:{icon:'🗂️',label:'Clasificador de continentes experto'},
  id_master:{icon:'🔍',label:'Identificador maestro'},
  reto_hero:{icon:'🏆',label:'Héroe del reto final'},
  nivel3:{icon:'🌍',label:'¡Explorador de continentes! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡Campeón geográfico! Nivel 6'}
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
const lvls=[{t:0,n:'Novato ✏️'},{t:25,n:'Aprendiz 📚'},{t:55,n:'Explorador 🌍'},{t:90,n:'Detective 🔍'},{t:130,n:'Experto 🌐'},{t:165,n:'Campeón 🥇'},{t:190,n:'Maestro 🏆'}];
function pts(n){
  xp = Math.max(0, Math.min(MXP, xp+n));
  updateXPBar(); saveProgress();
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
function resetXP(){
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
  if(id === 's-sopa') { setTimeout(buildSopa, 50); }
}

// ===================== FLASHCARD DATA =====================
const fcData = [
  {w:'Europa',a:'🌍 Sexto continente en tamaño. Comprende <strong>44 países</strong>. Cuna del Renacimiento, la Ilustración y la Revolución Industrial. Es el principal socio comercial de Honduras gracias a la <strong>Unión Europea</strong>.'},
  {w:'Asia',a:'🌏 El continente <strong>más grande y más poblado</strong> del mundo (60% de la población mundial). Alberga a China, India y Japón. Tiene economías muy poderosas y la cordillera más alta: el <strong>Himalaya</strong>.'},
  {w:'África',a:'🌍 El <strong>segundo continente más grande</strong>, con <strong>54 países</strong> y más de 1,400 millones de personas. Cuna de la humanidad. Posee una enorme riqueza cultural con más de <strong>2,000 idiomas</strong>.'},
  {w:'Unión Europea (UE)',a:'🇪🇺 Bloque político y económico de <strong>27 países</strong> europeos con mercado único y libre circulación. Muchos usan el <strong>euro (€)</strong>. Es el mayor socio de cooperación y comercio de Honduras en Europa.'},
  {w:'Mar Mediterráneo',a:'🌊 Mar interior que separa <strong>Europa de África</strong>. Ha sido la principal ruta comercial e histórica entre civilizaciones: Grecia, Roma, Egipto, Fenicia. Cuna de la cultura occidental.'},
  {w:'Monte Everest',a:'🏔️ La cumbre <strong>más alta del mundo</strong> con <strong>8,849 m</strong>, en los <strong>Himalayas</strong>, frontera Nepal–China. Escalado por primera vez en 1953. Símbolo del poder geográfico de Asia.'},
  {w:'Desierto del Sahara',a:'🏜️ El desierto caluroso <strong>más grande del mundo</strong>, en el norte de África. Cubre <strong>9.2 millones de km²</strong>. Separa el norte árabe del sur subsahariano. Su nombre significa "desierto" en árabe.'},
  {w:'Río Nilo',a:'🌊 El río <strong>más largo del mundo</strong> con <strong>6,650 km</strong>, en el noreste de África. Fundamento de la <strong>civilización egipcia</strong>. Atraviesa 11 países africanos y desemboca en el Mediterráneo.'},
  {w:'Monzón asiático',a:'💨 Sistema de <strong>vientos estacionales</strong> que domina el sur y sureste de Asia. Trae lluvias abundantes en verano y tiempo seco en invierno. Es fundamental para la agricultura del arroz en India, China y Bangladés.'},
  {w:'Cooperación HN–Europa',a:'🤝 Europa apoya a Honduras en proyectos de <strong>salud, educación y desarrollo rural</strong>. Honduras exporta a la UE: <strong>café, banano, textiles y palma africana</strong>. El AACUE facilita el comercio.'},
  {w:'Diversidad cultural africana',a:'🎭 África tiene más de <strong>2,000 idiomas</strong> y 54 naciones. Conserva ricas tradiciones en <strong>música, arte, gastronomía y literatura</strong>. Raíces de ritmos globales: jazz, blues, reggae y afrobeat.'},
  {w:'Economías asiáticas',a:'📈 China es la <strong>2.ª economía mundial</strong>, Japón la 3.ª, India la 5.ª. Exportan tecnología, autos y manufacturas. Los "<strong>Tigres asiáticos</strong>" (Corea del Sur, Taiwán, Singapur, Hong Kong) son ejemplos de desarrollo acelerado.'},
  {w:'Colonialismo',a:'📜 Proceso (ss. XV–XX) donde Europa <strong>dominó y colonizó</strong> África, Asia y América. Dejó herencias lingüísticas (inglés, francés, español en África) y fronteras artificiales. Tuvo impactos económicos y sociales profundos.'},
  {w:'Relaciones HN–Asia',a:'🏭 Honduras <strong>importa</strong> de China: ropa, tecnología, maquinaria. Exporta <strong>mariscos, café</strong> a Japón y Corea del Sur. <strong>KOICA</strong> (Corea del Sur) ofrece becas y apoyo en formación técnica en Honduras.'},
  {w:'Relaciones HN–África',a:'🌍 Las relaciones son indirectas, principalmente por la <strong>ONU y la Unión Africana</strong>. Comparten desafíos de desarrollo, cambio climático y cooperación Sur–Sur. Honduras aprende de modelos africanos de integración regional.'},
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
const qzData = [
  {q:'¿Cuál es el continente más grande y más poblado del mundo?',o:['a) África','b) Europa','c) América','d) Asia'],c:3},
  {q:'¿Qué río es el más largo del mundo y se encuentra en África?',o:['a) Congo','b) Níger','c) Zambeze','d) Nilo'],c:3},
  {q:'¿Qué bloque político-económico agrupa 27 países de Europa?',o:['a) OTAN','b) G20','c) Unión Europea','d) ONU'],c:2},
  {q:'¿En qué continente se encuentra el Monte Everest?',o:['a) Europa','b) África','c) Asia','d) América'],c:2},
  {q:'¿Cuál es el desierto caluroso más grande del mundo?',o:['a) Gobi','b) Kalahari','c) Atacama','d) Sahara'],c:3},
  {q:'¿Cuántos países tiene el continente africano?',o:['a) 35','b) 44','c) 54','d) 62'],c:2},
  {q:'¿Qué exporta Honduras principalmente hacia la Unión Europea?',o:['a) Petróleo y minerales','b) Café, banano y textiles','c) Tecnología y autos','d) Medicamentos'],c:1},
  {q:'¿Qué fenómeno climático de Asia trae lluvias estacionales esenciales para la agricultura?',o:['a) Tifón','b) Huracán','c) Monzón','d) Tsunami'],c:2},
  {q:'¿Qué mar separa Europa de África?',o:['a) Mar Rojo','b) Mar Negro','c) Mar Mediterráneo','d) Mar Caspio'],c:2},
  {q:'¿Qué agencia surcoreana apoya la formación técnica en Honduras?',o:['a) JICA','b) USAID','c) KOICA','d) GIZ'],c:2},
  {q:'¿Cuántos idiomas distintos se hablan aproximadamente en África?',o:['a) 500','b) 1,000','c) 2,000','d) 5,000'],c:2},
  {q:'¿Qué proceso histórico explica la fuerte influencia europea en África y Asia?',o:['a) Renacimiento','b) Colonialismo','c) Industrialización','d) Globalización'],c:1},
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
  sfx('click'); qzIdx=0; qzSel=-1; qzDone=false;
  showQz(); document.getElementById('fbQz').classList.remove('show');
}

// ===================== CLASIFICACIÓN =====================
const classGroups = [
  {
    label:['Europa','Asia'], headA:'🌍 Europa', headB:'🌏 Asia', colA:'europa', colB:'asia',
    words:[
      {w:'Unión Europea',t:'europa'},{w:'Monte Everest',t:'asia'},{w:'Río Rin',t:'europa'},
      {w:'Río Ganges',t:'asia'},{w:'Torre Eiffel',t:'europa'},{w:'Gran Muralla China',t:'asia'},
      {w:'Alpes suizos',t:'europa'},{w:'Himalaya',t:'asia'},{w:'Moneda Euro',t:'europa'},{w:'Monzón',t:'asia'}
    ]
  },
  {
    label:['África','Europa'], headA:'🌍 África', headB:'🌍 Europa', colA:'africa', colB:'europa',
    words:[
      {w:'Río Nilo',t:'africa'},{w:'Río Danubio',t:'europa'},{w:'Desierto Sahara',t:'africa'},
      {w:'Alpes suizos',t:'europa'},{w:'Pirámides de Egipto',t:'africa'},{w:'Torre de Pisa',t:'europa'},
      {w:'+2,000 idiomas',t:'africa'},{w:'54 países (UA)',t:'africa'},{w:'Euro (€)',t:'europa'},{w:'Selva del Congo',t:'africa'}
    ]
  },
  {
    label:['Aspecto geográfico','Aspecto económico'], headA:'🗺️ Geográfico', headB:'💰 Económico', colA:'geo', colB:'eco',
    words:[
      {w:'Monte Everest',t:'geo'},{w:'PIB y riqueza',t:'eco'},{w:'Desierto Sahara',t:'geo'},
      {w:'Exportaciones',t:'eco'},{w:'Río Nilo',t:'geo'},{w:'Unión Europea',t:'eco'},
      {w:'Mar Mediterráneo',t:'geo'},{w:'Turismo europeo',t:'eco'},{w:'Alpes europeos',t:'geo'},{w:'Cooperación KOICA',t:'eco'}
    ]
  },
  {
    label:['HN exporta','HN importa'], headA:'📦 HN Exporta', headB:'📥 HN Importa', colA:'exporta', colB:'importa',
    words:[
      {w:'Café a Europa',t:'exporta'},{w:'Tecnología de Asia',t:'importa'},{w:'Banano a la UE',t:'exporta'},
      {w:'Ropa de China',t:'importa'},{w:'Textiles a Europa',t:'exporta'},{w:'Autos japoneses',t:'importa'},
      {w:'Mariscos a Japón',t:'exporta'},{w:'Maquinaria china',t:'importa'},{w:'Palma africana',t:'exporta'},{w:'Celulares asiáticos',t:'importa'}
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
        if(clsSelectedWord !== null){ col.click(); }
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
function resetClass(){ sfx('click'); buildClass(); document.getElementById('fbCls').classList.remove('show'); }

// ===================== IDENTIFICAR =====================
const idData = [
  {s:['El','Nilo','es','el','río','más','largo.'],c:1,art:'Río más largo del mundo (África)'},
  {s:['Europa','tiene','44','países','distintos.'],c:0,art:'Continente con 44 países'},
  {s:['El','Sahara','es','el','mayor','desierto.'],c:1,art:'Desierto más grande del mundo'},
  {s:['El','Everest','mide','8,849','metros.'],c:1,art:'Cumbre más alta del planeta'},
  {s:['La','Unión','Europea','tiene','27','países.'],c:1,art:'Bloque político europeo'},
  {s:['África','tiene','2,000','idiomas','distintos.'],c:2,art:'Número aproximado de idiomas africanos'},
  {s:['El','monzón','domina','el','clima','asiático.'],c:1,art:'Fenómeno climático de Asia'},
  {s:['Honduras','exporta','café','a','Europa.'],c:2,art:'Producto de exportación hondureño'},
  {s:['El','Mediterráneo','separa','Europa','de','África.'],c:1,art:'Mar que divide dos continentes'},
  {s:['KOICA','apoya','la','formación','en','Honduras.'],c:0,art:'Agencia de cooperación surcoreana'},
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
const cmpData = [
  {s:'El continente más grande y más poblado del mundo es ___ .',opts:['Europa','África','Asia'],c:2},
  {s:'El río más largo del mundo es el ___ en África.',opts:['Congo','Nilo','Níger'],c:1},
  {s:'La Unión Europea está formada por ___ países.',opts:['44','27','54'],c:1},
  {s:'El desierto del Sahara está en el ___ de África.',opts:['sur','este','norte'],c:2},
  {s:'Honduras exporta principalmente ___ a la Unión Europea.',opts:['petróleo','tecnología','café y banano'],c:2},
  {s:'El Monte Everest está en la cordillera del ___ .',opts:['Atlas','Himalaya','Alpes'],c:1},
  {s:'El ___ es el fenómeno climático que trae lluvias estacionales a Asia.',opts:['huracán','tifón','monzón'],c:2},
  {s:'El Mar ___ separa Europa de África.',opts:['Rojo','Mediterráneo','Negro'],c:1},
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
    label:['Europa','Asia'], btnA:'🌍 Europa', btnB:'🌏 Asia', colA:'europa', colB:'asia',
    words:[
      {w:'Unión Europea',t:'europa'},{w:'Monte Everest',t:'asia'},{w:'París',t:'europa'},
      {w:'Himalaya',t:'asia'},{w:'Monzón',t:'asia'},{w:'Río Rin',t:'europa'},
      {w:'Gran Muralla',t:'asia'},{w:'Euro (€)',t:'europa'},{w:'Tokio',t:'asia'},
      {w:'Roma',t:'europa'},{w:'Gandhi',t:'asia'},{w:'Torre Eiffel',t:'europa'},
    ]
  },
  {
    label:['HN Exporta','HN Importa'], btnA:'📦 HN Exporta', btnB:'📥 HN Importa', colA:'exporta', colB:'importa',
    words:[
      {w:'Café',t:'exporta'},{w:'Celulares asiáticos',t:'importa'},{w:'Banano',t:'exporta'},
      {w:'Ropa de China',t:'importa'},{w:'Mariscos',t:'exporta'},{w:'Autos japoneses',t:'importa'},
      {w:'Textiles',t:'exporta'},{w:'Electrónicos',t:'importa'},{w:'Palma africana',t:'exporta'},{w:'Maquinaria china',t:'importa'},
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
  showToast(`🔄 Pareja: ${retoPairs[currentRetoPairIdx].label[0]} vs ${retoPairs[currentRetoPairIdx].label[1]}`);
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
const identifyTaskDB = [
  {s:'Europa está formada por 44 países con una gran diversidad cultural e histórica.',type:'Continente europeo (44 países)'},
  {s:'El Nilo es el río más largo del mundo, con 6,650 km, en el noreste de África.',type:'Río africano más largo (6,650 km)'},
  {s:'La Unión Europea es un bloque político y económico de 27 países con mercado común.',type:'Bloque político europeo (27 países)'},
  {s:'El Himalaya alberga las cumbres más altas del planeta, incluyendo el Monte Everest.',type:'Sistema montañoso asiático'},
  {s:'El Sahara es el desierto caluroso más grande del mundo, ubicado al norte de África.',type:'Desierto africano (9.2 millones km²)'},
  {s:'Honduras exporta café, banano y textiles principalmente a la Unión Europea.',type:'Relación comercial HN–Europa'},
  {s:'El monzón determina las temporadas de lluvia en el sur y sureste asiático.',type:'Fenómeno climático de Asia'},
  {s:'África tiene más de 2,000 idiomas y 54 países independientes reconocidos.',type:'Diversidad cultural africana'},
  {s:'El Mar Mediterráneo ha sido la ruta comercial más importante entre Europa y África.',type:'Mar que une los continentes'},
  {s:'KOICA, la agencia surcoreana, apoya proyectos de formación técnica en Honduras.',type:'Cooperación HN–Asia (Corea del Sur)'},
];
const classifyTaskDB = [
  {w:'Europa',gen:'Continente',n:'6.º más grande',g:'Hemisferio Norte',t:'44 países, sede de la UE'},
  {w:'Asia',gen:'Continente',n:'El más grande',g:'Hemisferios N y S',t:'60% de la población mundial'},
  {w:'África',gen:'Continente',n:'2.º más grande',g:'Hemisferios N y S',t:'54 países, +2,000 idiomas'},
  {w:'Nilo',gen:'Río',n:'6,650 km',g:'Noreste de África',t:'El más largo del mundo'},
  {w:'Himalaya',gen:'Cordillera',n:'8,849 m (Everest)',g:'Asia Central',t:'Más alta del mundo'},
  {w:'Sahara',gen:'Desierto',n:'9.2 millones km²',g:'Norte de África',t:'Mayor desierto caluroso'},
  {w:'Unión Europea',gen:'Bloque político',n:'27 países',g:'Europa',t:'Socio comercial de HN'},
  {w:'Monzón',gen:'Fenómeno climático',n:'Estacional',g:'Sur y Sureste de Asia',t:'Lluvias agrícolas en verano'},
];
const completeTaskDB = [
  {s:'El continente más grande es ___ .',opts:['Europa','África','Asia'],ans:'Asia'},
  {s:'El río más largo del mundo es el ___ .',opts:['Congo','Nilo','Amazonas'],ans:'Nilo'},
  {s:'La Unión Europea agrupa ___ países.',opts:['44','27','54'],ans:'27'},
  {s:'El desierto Sahara está en el norte de ___ .',opts:['Asia','Europa','África'],ans:'África'},
  {s:'El Monte Everest está en el ___ .',opts:['Atlas','Himalaya','Alpes'],ans:'Himalaya'},
  {s:'Honduras exporta ___ a la Unión Europea.',opts:['petróleo','café y banano','tecnología'],ans:'café y banano'},
  {s:'El ___ trae lluvias estacionales a Asia.',opts:['tifón','huracán','monzón'],ans:'monzón'},
  {s:'El Mar ___ separa Europa de África.',opts:['Rojo','Mediterráneo','Negro'],ans:'Mediterráneo'},
];
const explainQuestions = [
  {q:'¿Cuáles son las principales diferencias geográficas entre Europa, Asia y África?',ans:'Europa es el 6.º más grande (44 países); Asia es el más grande y poblado (48 países, Himalaya, Everest); África es el 2.º más grande (54 países, Sahara, Nilo).'},
  {q:'¿Por qué es importante la Unión Europea para Honduras? Menciona al menos dos razones.',ans:'La UE es el principal destino de exportaciones hondureñas (café, banano, textiles) y también el mayor donante de cooperación y desarrollo para Honduras.'},
  {q:'¿Qué es el monzón asiático y por qué es vital para la región?',ans:'Es un sistema de vientos estacionales que trae lluvias intensas en verano a India, China y el Sudeste Asiático. Es fundamental para la agricultura del arroz que alimenta a miles de millones de personas.'},
  {q:'¿Cómo afectó el colonialismo europeo a África y Asia? Menciona dos consecuencias.',ans:'El colonialismo (ss. XV–XX) dejó fronteras artificiales, explotó recursos naturales, impuso idiomas europeos y generó desigualdad económica que todavía se siente hoy.'},
  {q:'¿Qué relaciones comerciales y de cooperación tiene Honduras con Asia?',ans:'Honduras importa de China: ropa, tecnología y maquinaria. Exporta mariscos y café a Japón y Corea del Sur. KOICA (Corea del Sur) apoya becas y formación técnica.'},
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
  ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join('');
  out.appendChild(ib);
}
function genIdentifyTask(out, count){
  _instrBlock(out,'Instrucción',['Copia en tu cuaderno; subraya, colorea o encierra el concepto geográfico indicado en cada oración. Escribe al lado qué tipo de elemento es.','<strong>Ejemplo:</strong> El Nilo es el río más largo. → <span style="color:var(--jade);font-weight:700;">Río africano más largo</span>']);
  _pick(identifyTaskDB, Math.min(count, identifyTaskDB.length)).forEach((item,i)=>{
    const div=document.createElement('div'); div.className='tg-task';
    div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.type}</div></div>`;
    out.appendChild(div);
  });
}
function genClassifyTask(out, count){
  _instrBlock(out,'Instrucción',['Copia la siguiente tabla en tu cuaderno. Para cada término geográfico, completa su tipo, extensión, ubicación y función.']);
  const items=_pick(classifyTaskDB, Math.min(count, classifyTaskDB.length));
  const wrap=document.createElement('div'); wrap.style.overflowX='auto';
  const th=(t,extra='')=>`<th style="padding:0.3rem 0.4rem;border:1px solid var(--border);font-size:0.72rem;text-align:center;${extra}">${t}</th>`;
  let html=`<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:520px;"><thead><tr style="background:var(--pri-gl);">${th('Término','text-align:left;')}${th('Tipo')}${th('Extensión')}${th('Ubicación')}${th('Función')}</tr></thead><tbody>`;
  items.forEach(it=>{
    html+=`<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td>`+Array(4).fill(`<td style="padding:0.4rem;border:1px solid var(--border);min-width:50px;"></td>`).join('')+'</tr>';
  });
  html+='</tbody></table>';
  wrap.innerHTML=html; out.appendChild(wrap);
  const ans=document.createElement('div'); ans.className='tg-answer'; ans.style.marginTop='0.8rem';
  ans.innerHTML='<strong>✅ Respuestas:</strong><br>'+items.map(it=>`<strong>${it.w}:</strong> Tipo: ${it.gen} | Extensión: ${it.n} | Ubicación: ${it.g} | Función: ${it.t}`).join('<br>');
  out.appendChild(ans);
}
function genCompleteTask(out, count){
  _instrBlock(out,'Instrucción',['Copia y resuelve en tu cuaderno. Cada oración tiene un espacio ___. Elige y escribe la opción correcta.']);
  const pool=_shuffle([...completeTaskDB]);
  for(let i=0;i<count;i++){
    const item=pool[i%pool.length];
    const div=document.createElement('div'); div.className='tg-task';
    const sent=item.s.replace('___','<span class="tg-blank" style="min-width:90px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');
    div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${sent}</strong><div style="margin-top:0.4rem;font-size:0.82rem;color:var(--gray);">📝 Opciones: <strong>${item.opts.join(' | ')}</strong></div><div class="tg-answer">✅ ${item.ans}</div></div>`;
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
const sopaSets = [
  {
    // EUROPA: fila 0, cols 0-5
    // NILO:   col 9, filas 0-3
    // AFRICA: fila 3, cols 0-5
    // SAHARA: fila 5, cols 2-7
    // ASIA:   fila 6, cols 5-8
    // UNION:  fila 8, cols 1-5
    size:10,
    grid:[
      ['E','U','R','O','P','A','X','Y','Z','N'],
      ['B','C','D','E','F','G','H','I','J','I'],
      ['K','L','M','N','O','P','Q','R','S','L'],
      ['A','F','R','I','C','A','T','U','V','O'],
      ['W','X','Y','Z','A','B','C','D','E','F'],
      ['G','H','S','A','H','A','R','A','I','J'],
      ['K','L','M','N','O','A','S','I','A','P'],
      ['Q','R','S','T','U','V','W','X','Y','Z'],
      ['A','U','N','I','O','N','B','C','D','E'],
      ['F','G','H','I','J','K','L','M','N','O']
    ],
    words:[
      {w:'EUROPA', cells:[[0,0],[0,1],[0,2],[0,3],[0,4],[0,5]]},
      {w:'NILO',   cells:[[0,9],[1,9],[2,9],[3,9]]},
      {w:'AFRICA', cells:[[3,0],[3,1],[3,2],[3,3],[3,4],[3,5]]},
      {w:'SAHARA', cells:[[5,2],[5,3],[5,4],[5,5],[5,6],[5,7]]},
      {w:'ASIA',   cells:[[6,5],[6,6],[6,7],[6,8]]},
      {w:'UNION',  cells:[[8,1],[8,2],[8,3],[8,4],[8,5]]}
    ]
  },
  {
    // HIMALAYA: fila 0, cols 0-7
    // CAFE:     col 9, filas 0-3
    // EVEREST:  fila 2, cols 1-7
    // CULTURA:  col 0, filas 3-9
    // MONZON:   fila 5, cols 2-7
    size:10,
    grid:[
      ['H','I','M','A','L','A','Y','A','X','C'],
      ['B','C','D','E','F','G','H','I','J','A'],
      ['K','E','V','E','R','E','S','T','L','F'],
      ['C','L','M','N','O','P','Q','R','S','E'],
      ['U','T','U','V','W','X','Y','Z','A','B'],
      ['L','C','M','O','N','Z','O','N','D','E'],
      ['T','F','G','H','I','J','K','L','M','N'],
      ['U','G','H','I','J','K','L','M','N','O'],
      ['R','H','I','J','K','L','M','N','O','P'],
      ['A','I','J','K','L','M','N','O','P','Q']
    ],
    words:[
      {w:'HIMALAYA', cells:[[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7]]},
      {w:'CAFE',     cells:[[0,9],[1,9],[2,9],[3,9]]},
      {w:'EVEREST',  cells:[[2,1],[2,2],[2,3],[2,4],[2,5],[2,6],[2,7]]},
      {w:'CULTURA',  cells:[[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0]]},
      {w:'MONZON',   cells:[[5,2],[5,3],[5,4],[5,5],[5,6],[5,7]]}
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
const evalTFBank = [
  {q:'Asia es el continente más grande y más poblado del mundo.',a:true},
  {q:'El Río Nilo es el más largo del mundo y está en Asia.',a:false},
  {q:'La Unión Europea está formada por 27 países.',a:true},
  {q:'El Desierto del Sahara está en el norte de África.',a:true},
  {q:'El Monte Everest mide 8,849 metros y es la cumbre más alta.',a:true},
  {q:'Europa tiene más de 2,000 idiomas distintos.',a:false},
  {q:'Honduras exporta café y banano a la Unión Europea.',a:true},
  {q:'El Monzón es un fenómeno climático típico de Europa.',a:false},
  {q:'El Mar Mediterráneo separa Europa de África.',a:true},
  {q:'África es el continente más pequeño del mundo.',a:false},
  {q:'KOICA es la agencia de cooperación de Corea del Sur en Honduras.',a:true},
  {q:'Europa colonizó gran parte de África y Asia entre los siglos XV y XX.',a:true},
  {q:'China es la segunda economía más grande del mundo.',a:true},
  {q:'El Himalaya está en el continente africano.',a:false},
  {q:'Honduras importa tecnología y productos manufacturados de Asia.',a:true},
];
const evalMCBank = [
  {q:'¿Cuál es el continente más grande del mundo?',o:['a) Europa','b) África','c) Asia','d) América'],a:2},
  {q:'¿Qué río es el más largo del mundo?',o:['a) Amazonas','b) Congo','c) Ganges','d) Nilo'],a:3},
  {q:'¿Cuántos países forman la Unión Europea?',o:['a) 44','b) 27','c) 15','d) 54'],a:1},
  {q:'¿En qué continente se encuentra el Desierto del Sahara?',o:['a) Asia','b) América','c) Europa','d) África'],a:3},
  {q:'¿Cuál es la cumbre más alta del mundo?',o:['a) Mont Blanc','b) Kilimanjaro','c) Monte Everest','d) Aconcagua'],a:2},
  {q:'¿Cuántos países tiene el continente africano?',o:['a) 35','b) 44','c) 54','d) 65'],a:2},
  {q:'¿Qué fenómeno climático caracteriza al sur de Asia?',o:['a) Tifón','b) Huracán','c) Blizzard','d) Monzón'],a:3},
  {q:'¿Qué exporta principalmente Honduras a la UE?',o:['a) Petróleo','b) Café y banano','c) Tecnología','d) Autos'],a:1},
  {q:'¿Qué mar separa Europa de África?',o:['a) Mar Caribe','b) Mar Rojo','c) Mar Mediterráneo','d) Mar del Norte'],a:2},
  {q:'¿Qué agencia surcoreana apoya a Honduras?',o:['a) JICA','b) USAID','c) KOICA','d) GIZ'],a:2},
  {q:'¿Cuántos idiomas se hablan en África aproximadamente?',o:['a) 500','b) 1,000','c) 2,000','d) 5,000'],a:2},
  {q:'¿Qué proceso histórico explica la influencia europea en África?',o:['a) Renacimiento','b) Colonialismo','c) Revolución Industrial','d) Globalización'],a:1},
  {q:'¿Cuál es la segunda economía más grande del mundo?',o:['a) EE.UU.','b) China','c) Japón','d) Alemania'],a:1},
  {q:'¿En qué cordillera está el Monte Everest?',o:['a) Alpes','b) Andes','c) Himalaya','d) Ural'],a:2},
  {q:'¿Qué importa Honduras principalmente de Asia?',o:['a) Café','b) Banano','c) Productos manufacturados y tecnología','d) Petróleo'],a:2},
];
const evalCPBank = [
  {q:'El continente más grande y más poblado del mundo es ___ .',a:'Asia'},
  {q:'El río más largo del mundo es el ___, en África.',a:'Nilo'},
  {q:'La Unión Europea está formada por ___ países.',a:'27'},
  {q:'El desierto del Sahara está en el ___ de África.',a:'norte'},
  {q:'El Monte Everest tiene una altura de ___ metros.',a:'8,849'},
  {q:'Honduras exporta ___ principalmente a la Unión Europea.',a:'café y banano'},
  {q:'El ___ es el fenómeno climático de lluvias estacionales en Asia.',a:'monzón'},
  {q:'El Mar ___ separa Europa de África.',a:'Mediterráneo'},
  {q:'África tiene aproximadamente ___ idiomas distintos.',a:'2,000'},
  {q:'KOICA es la agencia de cooperación de ___ del Sur en Honduras.',a:'Corea'},
  {q:'El Monte Everest está en la cordillera del ___ .',a:'Himalaya'},
  {q:'Europa colonizó gran parte de ___ y Asia entre los siglos XV y XX.',a:'África'},
  {q:'China es la ___ economía más grande del mundo.',a:'segunda'},
  {q:'Honduras importa ___ y tecnología principalmente de Asia.',a:'productos manufacturados'},
  {q:'El continente africano tiene ___ países.',a:'54'},
];
const evalPRBank = [
  {term:'Asia',def:'Continente más grande y más poblado del mundo'},
  {term:'Nilo',def:'Río más largo del mundo (6,650 km), en África'},
  {term:'Sahara',def:'Desierto caluroso más grande del mundo, norte de África'},
  {term:'Unión Europea',def:'Bloque político de 27 países europeos'},
  {term:'Everest',def:'Cumbre más alta del mundo (8,849 m), en los Himalayas'},
  {term:'Monzón',def:'Vientos estacionales que traen lluvias en Asia del sur'},
  {term:'Mediterráneo',def:'Mar que separa Europa de África'},
  {term:'Colonialismo',def:'Dominio europeo sobre África y Asia (ss. XV–XX)'},
  {term:'KOICA',def:'Agencia de cooperación de Corea del Sur en Honduras'},
  {term:'Himalaya',def:'Cordillera más alta del mundo, en Asia Central'},
  {term:'Cooperación',def:'Relación de apoyo entre países (HN–Europa y HN–Asia)'},
  {term:'África',def:'Segundo continente más grande; 54 países y 2,000 idiomas'},
  {term:'Europa',def:'Continente de 44 países; sede de la Unión Europea'},
  {term:'Café y banano',def:'Principales exportaciones de Honduras a Europa'},
  {term:'Tecnología',def:'Principal importación de Honduras desde Asia'},
];

function genEval(){
  sfx('click');
  const cf = evalFormNum;
  window._currentEvalForm = cf;
  evalFormNum = (evalFormNum % 10) + 1;
  saveProgress();
  document.getElementById('eval-screen-title').textContent = `🎓 Evaluación Final · Forma ${cf} · Europa, Asia y África`;
  evalAnsVisible = false;
  const out = document.getElementById('evalOut'); out.innerHTML = '';
  const bar = document.createElement('div'); bar.className = 'eval-score-bar';
  bar.innerHTML = `<div><div class="esb-title">📊 Distribución de puntaje · 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25pts</span><span class="eval-score-pill esp-tf">V/F 25pts</span><span class="eval-score-pill esp-mc">Selección 25pts</span><span class="eval-score-pill esp-pr">Pareados 25pts</span></div>`;
  out.appendChild(bar);

  const cpItems = _pick(evalCPBank, 5);
  const s1 = document.createElement('div'); s1.innerHTML = '<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  cpItems.forEach((item, i) => {
    const d = document.createElement('div'); d.className = 'eval-item';
    const qHtml = item.q.replace('___','<span class="eval-blank">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');
    d.innerHTML = `<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div>`;
    s1.appendChild(d);
  });
  out.appendChild(s1);

  const tfItems = _pick(evalTFBank, 5);
  const s2 = document.createElement('div'); s2.innerHTML = '<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  tfItems.forEach((item, i) => {
    const d = document.createElement('div'); d.className = 'eval-item';
    d.innerHTML = `<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}"> Falso</label></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div>`;
    s2.appendChild(d);
  });
  out.appendChild(s2);

  const mcItems = _pick(evalMCBank, 5);
  const s3 = document.createElement('div'); s3.innerHTML = '<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  mcItems.forEach((item, i) => {
    const d = document.createElement('div'); d.className = 'eval-item';
    const optsHtml = item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join('');
    d.innerHTML = `<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div>`;
    s3.appendChild(d);
  });
  out.appendChild(s3);

  const prItems = _pick(evalPRBank, 5);
  const shuffledDefs = [...prItems].sort(() => Math.random() - 0.5);
  const letters = ['A','B','C','D','E'];
  const s4 = document.createElement('div'); s4.innerHTML = '<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  const matchCard = document.createElement('div'); matchCard.className = 'eval-item';
  let colLeft = '<div class="eval-match-col"><h4>📌 Términos</h4>';
  prItems.forEach((item,i)=>{ colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> <span class="eval-match-line">&nbsp;&nbsp;&nbsp;</span> ${item.term}</div>`; });
  colLeft += '</div>';
  let colRight = '<div class="eval-match-col"><h4>📖 Definiciones</h4>';
  shuffledDefs.forEach((item,i)=>{ colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`; });
  colRight += '</div>';
  const ansKey = prItems.map((item,i)=>{ const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)]; return `${i+16}→${letter}`; }).join(' · ');
  matchCard.innerHTML = `<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div>`;
  s4.appendChild(matchCard); out.appendChild(s4);

  window._evalPrintData = { tf:tfItems, mc:mcItems, cp:cpItems, pr:{terms:prItems,shuffledDefs,letters} };
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

  let s1 = `<div class="sec-title"><span>I. Completar el espacio</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div>`;
  d.cp.forEach((it,i)=>{ const q=it.q.replace('___','<span class="cp-blank"></span>'); s1+=`<div class="cp-row"><span class="qn">${i+1}.</span><span class="cp-text">${q}</span></div>`; });

  let s2 = `<div class="sec-title"><span>II. Verdadero o Falso</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div>`;
  d.tf.forEach((it,i)=>{ s2+=`<div class="tf-row"><span class="qn">${i+6}.</span><span class="tf-blank"></span><span class="tf-text">${it.q}</span></div>`; });

  let s3 = `<div class="sec-title"><span>III. Selección Múltiple</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div><div class="mc-grid">`;
  d.mc.forEach((it,i)=>{ const opts=it.o.map((op,oi)=>`<label class="mc-opt"><input type="radio" name="mc${i}"> ${op}</label>`).join(''); s3+=`<div class="mc-item"><div class="mc-q"><span class="qn">${i+11}.</span><span>${it.q}</span></div><div class="mc-opts">${opts}</div></div>`; });
  s3 += `</div>`;

  let colL = '<div class="pr-col"><div class="pr-head">📌 Términos</div>';
  d.pr.terms.forEach((it,i)=>{ colL+=`<div class="pr-item"><span class="pr-num">${i+16}.</span><span class="pr-line"></span>${it.term}</div>`; });
  colL += '</div>';
  let colR = '<div class="pr-col"><div class="pr-head">📖 Definiciones</div>';
  d.pr.shuffledDefs.forEach((it,i)=>{ colR+=`<div class="pr-item"><span class="pr-num">${d.pr.letters[i]}.</span>${it.def}</div>`; });
  colR += '</div>';
  let s4 = `<div class="pr-section"><div class="sec-title"><span>IV. Términos Pareados</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div><div class="pr-grid">${colL}${colR}</div></div>`;

  let pR = '';
  pR += `<div class="p-sec"><div class="p-ttl">I. Completar</div><table class="p-tbl">`;
  d.cp.forEach((it,i)=>{ pR+=`<tr><td class="pn">${i+1}.</td><td class="pa">${it.a}</td></tr>`; });
  pR += `</table></div><div class="p-sec"><div class="p-ttl">II. V o F</div><table class="p-tbl">`;
  d.tf.forEach((it,i)=>{ pR+=`<tr><td class="pn">${i+6}.</td><td class="pa">${it.a?'V':'F'}</td></tr>`; });
  pR += `</table></div><div class="p-sec"><div class="p-ttl">III. Selección</div><table class="p-tbl">`;
  d.mc.forEach((it,i)=>{ pR+=`<tr><td class="pn">${i+11}.</td><td class="pa">${it.o[it.a]}</td></tr>`; });
  pR += `</table></div><div class="p-sec"><div class="p-ttl">IV. Pareados</div><table class="p-tbl">`;
  d.pr.terms.forEach((it,i)=>{ const l=d.pr.letters[d.pr.shuffledDefs.findIndex(df=>df.def===it.def)]; pR+=`<tr><td class="pn">${i+16}.</td><td class="pa">${i+16}→${l}</td></tr>`; });
  pR += `</table></div>`;

  const doc = `<!DOCTYPE html><html lang="es"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Evaluación Europa, Asia y África · Forma ${forma}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:Arial,Helvetica,sans-serif;font-size:12pt;color:#111;background:#fff;padding:4mm 6mm;}
.ph{margin-bottom:0.5rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;}
.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}
.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}
.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}
.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}
.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}
.ph-crit{font-size:11pt;text-align:center;color:#555;margin-top:0.15rem;}
.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.4rem 0 0.2rem;border-left:4px solid #c0392b;background:#fbe9e7;display:flex;justify-content:space-between;align-items:center;}
.qn{font-weight:700;min-width:22px;flex-shrink:0;}
.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.4;padding:0.22rem 0.2rem;border-bottom:1px solid #eee;}
.tf-blank{display:inline-block;min-width:42px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.2rem;}
.tf-text{flex:1;}
.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.28rem 0.45rem;margin-bottom:0.22rem;break-inside:avoid;}
.mc-q{font-size:10.5pt;line-height:1.4;display:flex;gap:0.3rem;margin-bottom:0.18rem;}
.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.22rem 0.55rem;}
.mc-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:0.08rem 0.25rem;margin-left:1.3rem;}
.mc-opt{font-size:9.5pt;display:flex;align-items:center;gap:0.22rem;}
.mc-opt input{width:12px;height:12px;flex-shrink:0;}
.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.4;padding:0.22rem 0.2rem;border-bottom:1px solid #eee;}
.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}
.pr-section{break-inside:avoid;}
.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.2rem 0.5rem;margin-top:0.15rem;break-inside:avoid;}
.pr-head{font-size:9pt;font-weight:700;color:#555;margin-bottom:0.2rem;}
.pr-item{font-size:10pt;padding:0.22rem 0.32rem;background:#fbe9e7;border-radius:3px;margin-bottom:0.12rem;display:flex;align-items:center;gap:0.22rem;line-height:1.2;break-inside:avoid;}
.pr-num{font-weight:700;color:#c0392b;min-width:19px;flex-shrink:0;}
.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}
.pauta-wrap{page-break-before:always;padding-top:0.4rem;}
.p-head{border-bottom:2px solid #333;padding-bottom:0.35rem;margin-bottom:0.5rem;text-align:center;}
.p-main{font-size:9.5pt;font-weight:700;}.p-sub{font-size:7pt;color:#c00;font-weight:700;margin:0.08rem 0;}.p-meta{font-size:7pt;color:#555;}
.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.9rem;}
.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.28rem 0.45rem;}
.p-ttl{font-size:8pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.1rem;margin-bottom:0.18rem;}
.p-tbl{width:100%;border-collapse:collapse;font-size:7.5pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.07rem 0.12rem;vertical-align:top;}
.pn{font-weight:700;width:16px;color:#555;}.pa{color:#007a00;font-weight:600;}
.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:#c0392b;font-weight:700;font-style:italic;}
.obt-lbl{font-weight:700;}.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #c0392b;height:12px;}.obt-pct{font-weight:700;}
.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;color:#c0392b;font-weight:700;font-style:italic;margin-top:0.3rem;padding:0.2rem 0;}
.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #c0392b;}
.forma-tag{position:fixed;bottom:5mm;right:6mm;font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;}
@media print{@page{margin:4mm 6mm;}}
</style></head><body>
<div class="ph">
  <h2>Evaluación Final · Los Continentes: Europa, Asia y África · Geografía · Ciencias Sociales</h2>
  <div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div>
  <div class="ph-line"><strong>Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div>
  <p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p>
</div>
${s1}${s2}${s3}${s4}
<div class="total-row"><span>Total obtenido</span><span class="obt-line"></span><span>de 100%</span></div>
<div class="pauta-wrap">
  <div class="p-head">
    <div class="p-main">✅ PAUTA · Evaluación Europa, Asia y África · Forma ${forma}</div>
    <div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div>
    <div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u</div>
  </div>
  <div class="p-grid">${pR}</div>
</div>
<div class="forma-tag">Forma ${forma}</div>
</body></html>`;

  const win = window.open('','_blank','');
  if(!win){ showToast('⚠️ Activa las ventanas emergentes para imprimir'); return; }
  win.document.write(doc);
  win.document.close();
  setTimeout(()=>win.print(), 400);
}

// ===================== LABORATORIO DE CONTINENTES =====================
const continentData = {
  europa: {
    nombre:'Europa', icon:'🌍',
    geo:{title:'Geografía',info:'• Área: 10.5 millones km² · 44 países<br>• Cordilleras: Alpes (Mont Blanc 4,808 m), Pirineos, Urales, Cárpatos<br>• Ríos: Danubio, Rin, Volga, Ebro<br>• Mares: Mediterráneo, Báltico, del Norte, Adriático<br>• Países más grandes: Rusia, Ucrania, Francia'},
    eco:{title:'Economía',info:'• PIB entre los más altos del mundo<br>• Moneda: Euro (€) en 20 países de la UE<br>• Industrias clave: automóvil, farmacéutica, aeronáutica, turismo<br>• Mayor economía: Alemania (4.ª mundial)<br>• Turismo: recibe el 50% del turismo global'},
    soc:{title:'Sociedad',info:'• Población: ~748 millones de personas<br>• Alta esperanza de vida: 80+ años<br>• Tasa de alfabetización: 99%<br>• Libre circulación de personas en la UE (Schengen)<br>• Idiomas: inglés, francés, alemán, español, italiano, ruso…'},
    cul:{title:'Cultura',info:'• Cuna del Renacimiento, la Ilustración y la Revolución Industrial<br>• Arte: Leonardo, Miguel Ángel, Picasso, Van Gogh<br>• Religión predominante: Cristianismo<br>• Patrimonio UNESCO: Coliseo (Roma), Torre Eiffel (París), Alhambra (España)<br>• Gastronomía: pizza, paella, croissant, sushi europeo'},
    hn:{title:'Honduras y Europa',info:'• Honduras exporta: café ☕, banano 🍌, textiles, palma africana<br>• UE da cooperación en salud, educación y medio ambiente<br>• Turistas europeos visitan: Copán, Roatán, La Ceiba<br>• AACUE (Acuerdo UE–Centroamérica): facilita el comercio<br>• Cooperación alemana GIZ y española AECID activas en HN'}
  },
  asia: {
    nombre:'Asia', icon:'🌏',
    geo:{title:'Geografía',info:'• Área: 44.6 millones km² — el continente más grande del mundo<br>• 48 países<br>• Himalaya: Monte Everest 8,849 m (cumbre más alta del mundo)<br>• Ríos: Yangtze, Ganges, Indo, Mekong, Amarillo<br>• Desiertos: Gobi (Mongolia/China), Arábigo<br>• Mares: del Sur de China, Arábigo, Mar Rojo'},
    eco:{title:'Economía',info:'• China: 2.ª economía mundial (industria, manufactura, tecnología)<br>• Japón: 3.ª economía (autos Toyota, Sony, Nintendo)<br>• India: 5.ª y en rápido crecimiento (TI, servicios)<br>• "Tigres asiáticos": Corea del Sur, Taiwán, Singapur, Hong Kong<br>• Arabia Saudita: petróleo (el mayor exportador del mundo)'},
    soc:{title:'Sociedad',info:'• Población: ~4,700 millones (60% de la humanidad)<br>• China e India: más de 1,400 millones c/u<br>• Monzón: organiza la vida agrícola de miles de millones<br>• Brecha enorme entre países desarrollados y en desarrollo<br>• Religiones: Hinduismo, Budismo, Islam, Confucionismo, Sintoísmo'},
    cul:{title:'Cultura',info:'• Cuna de las primeras civilizaciones: Mesopotamia, India, China<br>• Artes marciales, meditación, yoga, origami, caligrafía<br>• Gastronomía: sushi, curry, dim sum, pho, kebab<br>• Patrimonio: Gran Muralla China, Taj Mahal, Angkor Wat, Templos de Kioto<br>• Religiones con más seguidores: Hinduismo, Islam, Budismo'},
    hn:{title:'Honduras y Asia',info:'• Honduras importa de China: ropa 👕, tecnología 📱, maquinaria<br>• Japón: autos Toyota, Mitsubishi, motocicletas Honda<br>• KOICA (Corea del Sur): becas, formación técnica y voluntarios<br>• HN exporta: mariscos 🦐, café ☕ a Japón y Corea del Sur<br>• Creciente presencia de empresas chinas en infraestructura de HN'}
  },
  africa: {
    nombre:'África', icon:'🌍',
    geo:{title:'Geografía',info:'• Área: 30.4 millones km² — 2.º continente más grande<br>• 54 países (la mayor cantidad de cualquier continente)<br>• Desierto Sahara: 9.2 millones km² (norte de África)<br>• Río Nilo: 6,650 km (el más largo del mundo)<br>• Selva del Congo (2.ª más grande del mundo)<br>• Kilimanjaro: 5,895 m (cumbre más alta de África)'},
    eco:{title:'Economía',info:'• Gran variedad: Nigeria (mayor PIB africano), Sudáfrica, Egipto, Marruecos<br>• Recursos naturales: petróleo, diamantes, oro, cobre, coltán<br>• Agricultura: 60% de la fuerza laboral en zonas rurales<br>• En desarrollo: baja industrialización relativa<br>• Potencial enorme: juventud, recursos y tierras fértiles'},
    soc:{title:'Sociedad',info:'• Población: ~1,400 millones y creciendo rápido<br>• Más de 2,000 idiomas nativos<br>• El continente más joven del mundo (edad media: 19 años)<br>• Desafíos: pobreza, acceso a salud y educación<br>• Organización: Unión Africana (UA) — 55 estados miembro'},
    cul:{title:'Cultura',info:'• Cuna de la humanidad: los fósiles más antiguos del Homo sapiens<br>• Pirámides de Egipto, Gran Zimbabwe, Timbuktu<br>• Raíces de la música global: jazz, blues, reggae, afrobeat, salsa<br>• Arte, danza y tejidos cargados de simbolismo espiritual<br>• Colonialismo dejó herencias lingüísticas: francés, inglés, portugués'},
    hn:{title:'Honduras y África',info:'• Relaciones diplomáticas a través de la ONU y organismos internacionales<br>• Cooperación Sur-Sur: experiencias compartidas en desarrollo<br>• Participación conjunta en foros G77 y Clima COP<br>• Honduras y África comparten desafíos: cambio climático, deuda externa<br>• Creciente interés en intercambio educativo y cultural'}
  }
};

let labContinent = 'europa';
let labAspecto = 'geo';

function labShowContinent(continentKey){
  labContinent = continentKey;
  updateLabDisplay();
  document.querySelectorAll('.lab-cont-btn').forEach(b=>b.classList.remove('active-pri'));
  const btn = document.querySelector(`[data-continent="${continentKey}"]`);
  if(btn) btn.classList.add('active-pri');
  if(typeof sfx === 'function') sfx('click');
}

function labShowAspecto(aspectoKey){
  labAspecto = aspectoKey;
  updateLabDisplay();
  document.querySelectorAll('.lab-asp-btn').forEach(b=>b.classList.remove('active-sec'));
  const btn = document.querySelector(`[data-aspecto="${aspectoKey}"]`);
  if(btn) btn.classList.add('active-sec');
  if(typeof sfx === 'function') sfx('click');
}

function updateLabDisplay(){
  const cont = continentData[labContinent];
  const asp = cont[labAspecto];
  const display = document.getElementById('lab-display');
  if(display){
    display.innerHTML = `<div class="lab-cont-header">${cont.icon} <strong>${cont.nombre}</strong></div><div class="lab-asp-title">📌 ${asp.title}</div><div class="lab-asp-info">${asp.info}</div>`;
    display.style.animation = 'none';
    display.offsetHeight;
    display.style.animation = 'pop 0.35s ease';
  }
  const sentence = document.getElementById('lab-sentence');
  if(sentence){
    sentence.innerHTML = `${cont.icon} Explorando: <strong>${cont.nombre}</strong> → <strong>${asp.title}</strong>`;
  }
}

function labInit(){
  labContinent = 'europa';
  labAspecto = 'geo';
  document.querySelectorAll('.lab-cont-btn').forEach(b=>b.classList.remove('active-pri'));
  const firstCont = document.querySelector('[data-continent="europa"]');
  if(firstCont) firstCont.classList.add('active-pri');
  document.querySelectorAll('.lab-asp-btn').forEach(b=>b.classList.remove('active-sec'));
  const firstAsp = document.querySelector('[data-aspecto="geo"]');
  if(firstAsp) firstAsp.classList.add('active-sec');
  updateLabDisplay();
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
  const msgs=['🌍 ¡ÁNIMO! Comienza tu misión. ¡Cada continente te espera!','🌱 ¡GRAN INICIO! Estás dando los primeros pasos en la exploración.','🗺️ ¡BUEN TRABAJO! Vas progresando muy bien por los continentes.','💪 ¡MUY BIEN! Dominas gran parte del contenido sobre los continentes.','🌐 ¡INCREÍBLE avance! Estás cerca de la excelencia geográfica.','🏆 ¡EXTRAORDINARIO! Completaste TODA la misión. ¡Eres experto en Europa, Asia y África!'];
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
  const txt = `${stars} CONSTANCIA DE LOGRO ${stars}\n\n🌍 Misión: Los Continentes — Europa, Asia y África\n🤗 Estudiante: ${name}\n📊 Progreso: ${pct}% completado\n⭐ XP obtenido: ${xp} de ${MXP}${achText?'\n\n🏅 Logros desbloqueados:\n'+achText:''}\n\n${msg}\n\n📅 ${date}\n🏠 Proyecto Educativo Familia Polanco-Castellanos\n🌐 policastsapien.com`;
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
  const savedName = localStorage.getItem('nombreEstudianteContinentesEAS');
  const inputName = document.querySelector('.diploma-input');
  if(savedName&&inputName){ inputName.value=savedName; updateDiplomaName(savedName); }
  if(inputName) inputName.addEventListener('input',e=>localStorage.setItem('nombreEstudianteContinentesEAS',e.target.value));
  fin('s-aprende', false);
  fin('s-tipos', false);
});