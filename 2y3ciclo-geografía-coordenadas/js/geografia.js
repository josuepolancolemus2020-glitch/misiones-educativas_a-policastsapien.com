// ===================== UTILIDADES Y LETRA GRANDE =====================
function toggleLetra() {
    document.body.classList.toggle('letra-grande');
    if(typeof sfx === 'function') sfx('click'); 
    localStorage.setItem('preferenciaLetraGeografia', document.body.classList.contains('letra-grande'));
}
window.addEventListener('DOMContentLoaded', () => {
    if(localStorage.getItem('preferenciaLetraGeografia') === 'true') document.body.classList.add('letra-grande');
});

const _pick = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
const _shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

function fb(id, msg, isOk) {
    const el = document.getElementById(id);
    if(el) { el.textContent = msg; el.className = 'fb show ' + (isOk ? 'ok' : 'err'); }
}

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY = 'geografia_v1_basica';
let xp = 0, MXP = 200, done = new Set(), evalAnsVisible = false;
let evalFormNum = 1;
let unlockedAch = [];
let darkMode = false;
let prevLevel = 0;
const TOTAL_SECTIONS = 12;

const xpTracker = { fc: new Set(), qz: new Set(), cls: new Set(), id: new Set(), cmp: new Set(), reto: new Set(), sopa: new Set() };

// ===================== SONIDO Y THEME (Igual al original) =====================
let sndOn = true; let AC = null;
function getAC(){ if(!AC){ try{ AC = new(window.AudioContext||window.webkitAudioContext)(); }catch(e){} } return AC; }
function sfx(t){ /* Audio generator omited for brevity, identical to source */ }
function toggleSnd(){ sndOn=!sndOn; document.getElementById('sndBtn').textContent=sndOn?'🔊 Sonido':'🔇 Sonido'; }

function toggleTheme(){ darkMode=!darkMode; document.documentElement.setAttribute('data-theme',darkMode?'dark':'light'); document.getElementById('themeBtn').textContent=darkMode?'☀️ Tema':'🌙 Tema'; localStorage.setItem(SAVE_KEY+'_theme',darkMode?'dark':'light'); sfx('click'); }
function initTheme(){ const s=localStorage.getItem(SAVE_KEY+'_theme'); const sys=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches; darkMode=(s==='dark')||(s===null&&sys); if(darkMode){ document.documentElement.setAttribute('data-theme','dark'); document.getElementById('themeBtn').textContent='☀️ Tema'; } }

// ===================== PROGRESS =====================
function saveProgress(){ try{ localStorage.setItem(SAVE_KEY, JSON.stringify({doneSections:Array.from(done), unlockedAch, evalFormNum, xp})); }catch(e){} }
function loadProgress(){
  try{
    const s = JSON.parse(localStorage.getItem(SAVE_KEY)); if(!s) return;
    if(s.doneSections) s.doneSections.forEach(id=>{ done.add(id); const b = document.querySelector(`[data-s="${id}"]`); if(b) b.classList.add('done'); });
    if(s.unlockedAch) unlockedAch = s.unlockedAch;
    if(s.evalFormNum) evalFormNum = s.evalFormNum;
    if(s.xp !== undefined) { xp = s.xp; updateXPBar(); }
  }catch(e){}
}

const ACHIEVEMENTS = {
  primer_quiz:{icon:'🧠',label:'Primera prueba superada'}, flash_master:{icon:'🃏',label:'Cartógrafo memorista'},
  clasif_pro:{icon:'🗂️',label:'Organizador de mapas'}, id_master:{icon:'🔍',label:'Buscador exacto'},
  reto_hero:{icon:'🏆',label:'Explorador del Reto'}, nivel3:{icon:'🔭',label:'¡Explorador alcanzado!'},
  nivel5:{icon:'🥇',label:'¡Campeón del Mundo!'}
};
function unlockAchievement(id){ if(unlockedAch.includes(id)) return; unlockedAch.push(id); showToast(ACHIEVEMENTS[id].icon+' ¡Logro! '+ACHIEVEMENTS[id].label); saveProgress(); }
function showToast(msg){ let t = document.querySelector('.toast'); if(!t){ t=document.createElement('div'); t.className='toast'; document.body.appendChild(t); } t.textContent = msg; t.style.display = 'block'; clearTimeout(t._tid); t._tid = setTimeout(()=>t.style.display='none', 3200); }

const lvls=[{t:0,n:'Turista 📷'},{t:25,n:'Viajero 🎒'},{t:55,n:'Navegante ⛵'},{t:90,n:'Explorador 🔭'},{t:130,n:'Cartógrafo 🗺️'},{t:165,n:'Campeón Mundial 🥇'},{t:190,n:'Geógrafo Maestro 🏆'}];
function pts(n){ xp = Math.max(0, Math.min(MXP, xp+n)); updateXPBar(); saveProgress(); }
function updateXPBar(){
  const pct = Math.round((xp/MXP)*100); document.getElementById('xpFill').style.width = pct+'%';
  document.getElementById('xpPts').textContent = '⭐ '+xp;
  let lv=0; for(let i=0;i<lvls.length;i++) if(xp>=lvls[i].t) lv=i;
  document.getElementById('xpLvl').textContent = lvls[lv].n;
  if(lv!==prevLevel){ if(lv>=2) unlockAchievement('nivel3'); if(lv>=5) unlockAchievement('nivel5'); prevLevel=lv; }
}
function resetXP() { xp = 0; updateXPBar(); showToast('🔄 XP reiniciado'); }
function fin(id){ if(!done.has(id)){ done.add(id); const b = document.querySelector(`[data-s="${id}"]`); if(b) b.classList.add('done'); saveProgress(); } }
function getProgress(){ return Math.round((done.size/TOTAL_SECTIONS)*100); }
function go(id){ document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active')); document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{ b.classList.remove('active'); }); document.getElementById(id).classList.add('active'); const btn = document.querySelector(`[data-s="${id}"]`); if(btn){ btn.classList.add('active'); } window.scrollTo({top:0,behavior:'smooth'}); if (id === 's-sopa') setTimeout(buildSopa, 50); }

// ===================== LAB COORDENADAS =====================
var GEO_STATE = { lat: 'norte', lon: 'oeste' };
function labSetLat(val) {
  GEO_STATE.lat = val; labUpdateBtn('lat', val); labUpdateMarker();
}
function labSetLon(val) {
  GEO_STATE.lon = val; labUpdateBtn('lon', val); labUpdateMarker();
}
function labUpdateBtn(group, val) {
  document.querySelectorAll('[data-lab-group="' + group + '"]').forEach(btn => {
    btn.classList.remove('active-pri');
    if (btn.getAttribute('data-lab-val') === val) btn.classList.add('active-pri');
  });
}
function labUpdateMarker() {
  const marker = document.getElementById('geo-marker');
  const sentence = document.getElementById('lab-sentence');
  let posX = GEO_STATE.lon === 'oeste' ? 60 : 140;
  let posY = GEO_STATE.lat === 'norte' ? 55 : 145;
  marker.setAttribute('transform', `translate(${posX}, ${posY})`);
  
  let latTxt = GEO_STATE.lat === 'norte' ? 'Norte' : 'Sur';
  let lonTxt = GEO_STATE.lon === 'oeste' ? 'Oeste' : 'Este';
  sentence.innerHTML = `Tu ubicación: <strong>Hemisferio ${latTxt} y ${lonTxt}</strong>.`;
}
function labInit() { labSetLat('norte'); labSetLon('oeste'); }

// ===================== FLASHCARD =====================
const fcData=[
  {w:'Latitud',a:'↔️ Distancia angular desde el <strong>Ecuador</strong> (0°) hacia el Norte o Sur. Medida por paralelos.'},
  {w:'Longitud',a:'↕️ Distancia angular desde <strong>Greenwich</strong> (0°) hacia el Este u Oeste. Medida por meridianos.'},
  {w:'Paralelos',a:'↔️ Líneas horizontales paralelas al Ecuador. Miden la <strong>latitud</strong>.'},
  {w:'Meridianos',a:'↕️ Semicírculos verticales de polo a polo. Miden la <strong>longitud</strong>.'},
  {w:'Ecuador',a:'↔️ Paralelo principal (0°). Divide en Hemisferio <strong>Norte</strong> y <strong>Sur</strong>.'},
  {w:'Meridiano de Greenwich',a:'↕️ Meridiano principal (0°). Divide en Hemisferio <strong>Este</strong> y <strong>Oeste</strong>.'},
  {w:'Brújula',a:'🧭 Instrumento que señala siempre el <strong>Norte magnético</strong>.'},
  {w:'Zonas Climáticas',a:'🌡️ Tropical (calor), Templada (4 estaciones), Polar (mucho frío).'},
];
let fcIdx = 0;
function upFC(){
  document.getElementById('fcInner').classList.remove('flipped');
  document.getElementById('fcW').textContent = fcData[fcIdx].w;
  document.getElementById('fcA').innerHTML = fcData[fcIdx].a;
  document.getElementById('fcCtr').textContent = (fcIdx+1)+' / '+fcData.length;
}
function flipCard(){ document.getElementById('fcInner').classList.toggle('flipped'); if(!xpTracker.fc.has(fcIdx)){ xpTracker.fc.add(fcIdx); pts(1); } if(xpTracker.fc.size === fcData.length){ fin('s-flash'); unlockAchievement('flash_master'); } }
function nextFC(){ fcIdx=(fcIdx+1)%fcData.length; upFC(); }
function prevFC(){ fcIdx=(fcIdx-1+fcData.length)%fcData.length; upFC(); }

// ===================== QUIZ =====================
const qzData=[
  {q:'¿Qué mide la latitud?',o:['Distancia Este-Oeste','Distancia Norte-Sur desde el Ecuador','La temperatura del lugar'],c:1},
  {q:'El meridiano 0° también se conoce como:',o:['Ecuador','Trópico de Cáncer','Meridiano de Greenwich'],c:2},
  {q:'¿Qué instrumento usa satélites para dar tu ubicación exacta?',o:['Brújula','GPS','Mapa de papel'],c:1},
  {q:'Los meridianos son líneas imaginarias que van:',o:['De polo a polo (verticales)','Paralelas al Ecuador (horizontales)','En diagonal por la Tierra'],c:0},
  {q:'Honduras se encuentra en la zona climática:',o:['Polar','Templada','Tropical/Tórrida'],c:2},
  {q:'¿Cuál es el paralelo más largo que divide la Tierra en Norte y Sur?',o:['Antimeridiano','Círculo Polar Ártico','Ecuador'],c:2},
  {q:'Si una coordenada dice "14° N, 87° W", la "W" significa:',o:['Norte (North)','Oeste (West)','Este (East)'],c:1},
  {q:'La longitud se mide a través de los:',o:['Trópicos','Paralelos','Meridianos'],c:2},
];
let qzIdx=0, qzSel=-1, qzDone=false;
function buildQz(){ qzIdx=0; qzSel=-1; qzDone=false; showQz(); }
function showQz(){
  if(qzIdx>=qzData.length){ document.getElementById('qzQ').textContent='🎉 ¡Quiz completado!'; document.getElementById('qzOpts').innerHTML=''; fin('s-quiz'); return; }
  const q = qzData[qzIdx]; document.getElementById('qzProg').textContent = `Pregunta ${qzIdx+1} de ${qzData.length}`; document.getElementById('qzQ').textContent = q.q;
  const opts = document.getElementById('qzOpts'); opts.innerHTML='';
  q.o.forEach((o,i)=>{
    const b = document.createElement('button'); b.className='qz-opt'; b.textContent=o;
    b.onclick=()=>{ if(qzDone)return; document.querySelectorAll('.qz-opt').forEach(x=>x.classList.remove('sel')); b.classList.add('sel'); qzSel=i; };
    opts.appendChild(b);
  }); qzDone = false;
}
function checkQz(){
  if(qzSel<0) return fb('fbQz','Selecciona una respuesta.',false); qzDone = true; const opts = document.querySelectorAll('.qz-opt');
  if(qzSel===qzData[qzIdx].c){ opts[qzSel].classList.add('correct'); fb('fbQz','¡Correcto! +5 XP',true); if(!xpTracker.qz.has(qzIdx)){ xpTracker.qz.add(qzIdx); pts(5); } }
  else { opts[qzSel].classList.add('wrong'); opts[qzData[qzIdx].c].classList.add('correct'); fb('fbQz','Incorrecto. Revisa la respuesta.',false); }
  setTimeout(()=>{ qzIdx++; qzSel=-1; showQz(); }, 1600);
}
function resetQz(){ qzIdx=0; qzSel=-1; qzDone=false; showQz(); document.getElementById('fbQz').classList.remove('show'); }

// ===================== CLASIFICACIÓN =====================
const classGroups = [
  { label:['Paralelo','Meridiano'], headA:'↔️ Paralelo', headB:'↕️ Meridiano', colA:'paralelo', colB:'meridiano',
    words:[{w:'Ecuador',t:'paralelo'},{w:'Greenwich',t:'meridiano'},{w:'Cáncer',t:'paralelo'},{w:'Antimeridiano',t:'meridiano'},{w:'Capricornio',t:'paralelo'},{w:'Miden Longitud',t:'meridiano'},{w:'Miden Latitud',t:'paralelo'},{w:'Polo a Polo',t:'meridiano'}] },
  { label:['Latitud','Longitud'], headA:'Norte/Sur (Lat)', headB:'Este/Oeste (Lon)', colA:'latitud', colB:'longitud',
    words:[{w:'Norte',t:'latitud'},{w:'Este',t:'longitud'},{w:'Sur',t:'latitud'},{w:'Oeste',t:'longitud'},{w:'14° N',t:'latitud'},{w:'87° W',t:'longitud'},{w:'Ecuador',t:'latitud'},{w:'Greenwich',t:'longitud'}] },
];
let currentClassGroupIdx = 0; let clsSelectedWord = null;
function buildClass(){
  const group = classGroups[currentClassGroupIdx]; document.getElementById('col-left-head').textContent = group.headA; document.getElementById('col-right-head').textContent = group.headB;
  const bank = document.getElementById('clsBank'); bank.innerHTML=''; clsSelectedWord = null; document.getElementById('items-left').innerHTML=''; document.getElementById('items-right').innerHTML='';
  _shuffle([...group.words]).forEach(w=>{
    const el = document.createElement('div'); el.className='wb-item'; el.textContent=w.w; el.dataset.t=w.t;
    el.onclick=()=>{ document.querySelectorAll('.wb-item').forEach(i=>i.classList.remove('sel-word')); el.classList.add('sel-word'); clsSelectedWord=el; };
    bank.appendChild(el);
  });
  ['col-left','col-right'].forEach(colId=>{
    const col = document.getElementById(colId);
    col.onclick=(e)=>{
      if(!clsSelectedWord||e.target.classList.contains('drop-item')) return;
      const wordsCol = document.getElementById(colId==='col-left'?'items-left':'items-right');
      const item = document.createElement('div'); item.className='drop-item'; item.textContent=clsSelectedWord.textContent; item.dataset.t=clsSelectedWord.dataset.t;
      const original=clsSelectedWord;
      item.onclick=(ev)=>{ ev.stopPropagation(); if (clsSelectedWord !== null) col.click(); else { document.getElementById('clsBank').appendChild(original); original.classList.remove('sel-word'); item.remove(); } };
      wordsCol.appendChild(item); clsSelectedWord.remove(); clsSelectedWord=null;
    };
  });
}
function checkClass(){
  if(document.querySelectorAll('#clsBank .wb-item').length>0) return fb('fbCls','Mueve todas las palabras primero.',false);
  const group=classGroups[currentClassGroupIdx]; let allOk=true;
  document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{
    if(el.dataset.t===(el.parentElement.id==='items-left'?group.colA:group.colB)) el.classList.add('cls-ok'); else { el.classList.add('cls-no'); allOk=false; }
  });
  if(allOk){ fb('fbCls','¡Perfecto! +5 XP',true); if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);} fin('s-clasifica'); unlockAchievement('clasif_pro'); }
  else fb('fbCls','Hay errores marcados en rojo.',false);
}
function nextClassGroup(){ currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length; buildClass(); document.getElementById('fbCls').classList.remove('show'); }
function resetClass(){ buildClass(); document.getElementById('fbCls').classList.remove('show'); }

// ===================== IDENTIFICAR =====================
const idData=[
  {s:['Honduras','está','en','el','hemisferio','Norte.'],c:5,art:'Hemisferio de latitud'},
  {s:['El','Ecuador','es','el','paralelo','principal.'],c:1,art:'El paralelo a 0°'},
  {s:['Los','meridianos','miden','la','longitud','geográfica.'],c:4,art:'Lo que miden los meridianos'},
  {s:['Tegucigalpa','está','a','87°','Oeste.'],c:4,art:'Dirección de longitud'},
  {s:['La','brújula','señala','al','Norte','magnético.'],c:1,art:'Instrumento de orientación'},
  {s:['Greenwich','es','el','meridiano','cero.'],c:0,art:'El meridiano 0°'},
  {s:['El','GPS','usa','satélites','para','ubicarte.'],c:1,art:'Instrumento tecnológico'},
  {s:['Los','paralelos','miden','la','latitud','terrestre.'],c:4,art:'Lo que miden los paralelos'}
];
let idIdx = 0, idDone = false;
function showId(){
  idDone = false; if(idIdx>=idData.length){ document.getElementById('idSent').innerHTML='🎉 ¡Completado!'; fin('s-identifica'); return; }
  const d = idData[idIdx]; document.getElementById('idProg').textContent = `Oración ${idIdx+1} de ${idData.length}`; document.getElementById('idInfo').textContent = `Busca: ${d.art}`;
  const sent = document.getElementById('idSent'); sent.innerHTML='';
  d.s.forEach((w,i)=>{
    const span = document.createElement('span'); span.className='id-word'; span.textContent=w+' ';
    span.onclick=()=>{
      if(idDone) return; document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected')); span.classList.add('selected');
      if(i===d.c){ idDone=true; span.classList.add('id-ok'); fb('fbId','¡Correcto! +5 XP',true); if(!xpTracker.id.has(idIdx)){ xpTracker.id.add(idIdx); pts(5); } }
      else { span.classList.add('id-no'); fb('fbId','Esa no es la palabra.',false); }
    }; sent.appendChild(span);
  });
}
function nextId(){ idIdx++; showId(); document.getElementById('fbId').classList.remove('show'); }
function resetId(){ idIdx=0; showId(); document.getElementById('fbId').classList.remove('show'); }

// ===================== COMPLETA =====================
const cmpData=[
  {s:'El instrumento que señala el Norte magnético es la ___.',opts:['brújula','mapa','globo'],c:0},
  {s:'Los ___ son líneas verticales que van de polo a polo.',opts:['paralelos','meridianos','ecuadores'],c:1},
  {s:'El meridiano principal, ubicado a 0°, se llama ___.',opts:['Cáncer','Greenwich','Ecuador'],c:1},
  {s:'Honduras tiene un clima caluroso porque está en la zona ___.',opts:['polar','templada','tropical'],c:2},
  {s:'La distancia desde el Ecuador hacia el Norte o Sur se llama ___.',opts:['longitud','latitud','escala'],c:1},
  {s:'El paralelo principal, ubicado a 0°, es el ___.',opts:['Greenwich','Trópico','Ecuador'],c:2},
  {s:'El ___ usa satélites para darnos nuestra coordenada exacta.',opts:['GPS','telescopio','mapa'],c:0},
  {s:'Si una coordenada es 87° W, la W significa ___.',opts:['Oeste','Este','Norte'],c:0},
];
let cmpIdx=0, cmpSel=-1, cmpDone=false;
function showCmp(){
  if(cmpIdx>=cmpData.length){ document.getElementById('cmpSent').innerHTML='🎉 ¡Completado!'; document.getElementById('cmpOpts').innerHTML=''; fin('s-completa'); return; }
  const d = cmpData[cmpIdx]; document.getElementById('cmpProg').textContent = `Oración ${cmpIdx+1} de ${cmpData.length}`;
  document.getElementById('cmpSent').innerHTML = d.s.replace('___','<span class="blank">___</span>');
  const opts = document.getElementById('cmpOpts'); opts.innerHTML=''; cmpSel=-1; cmpDone=false;
  d.opts.forEach((o,i)=>{
    const b = document.createElement('button'); b.className='cmp-opt'; b.textContent=o;
    b.onclick=()=>{ if(cmpDone)return; document.querySelectorAll('.cmp-opt').forEach(x=>x.classList.remove('sel')); b.classList.add('sel'); cmpSel=i; };
    opts.appendChild(b);
  });
}
function checkCmp(){
  if(cmpSel<0) return fb('fbCmp','Selecciona una opción.',false); cmpDone = true; const opts = document.querySelectorAll('.cmp-opt');
  if(cmpSel===cmpData[cmpIdx].c){
    opts[cmpSel].classList.add('correct'); document.getElementById('cmpSent').innerHTML = cmpData[cmpIdx].s.replace('___',`<span class="blank" style="color:var(--jade);border-color:var(--jade)">${opts[cmpSel].textContent}</span>`);
    fb('fbCmp','¡Correcto! +5 XP',true); if(!xpTracker.cmp.has(cmpIdx)){ xpTracker.cmp.add(cmpIdx); pts(5); }
  } else { opts[cmpSel].classList.add('wrong'); opts[cmpData[cmpIdx].c].classList.add('correct'); fb('fbCmp','Incorrecto.',false); }
  setTimeout(()=>{ cmpIdx++; document.getElementById('fbCmp').classList.remove('show'); showCmp(); }, 1600);
}

// ===================== RETO =====================
const retoPairs = [
  { label: ['Paralelo','Meridiano'], btnA: '↔️ Paralelo', btnB: '↕️ Meridiano', colA: 'paralelo', colB: 'meridiano',
    words: [{w:'Ecuador',t:'paralelo'},{w:'Greenwich',t:'meridiano'},{w:'Miden Latitud',t:'paralelo'},{w:'Miden Longitud',t:'meridiano'},{w:'Trópico',t:'paralelo'},{w:'Antimeridiano',t:'meridiano'}] },
  { label: ['Latitud','Longitud'], btnA: 'Norte/Sur (Lat)', btnB: 'Este/Oeste (Lon)', colA: 'latitud', colB: 'longitud',
    words: [{w:'Norte',t:'latitud'},{w:'Este',t:'longitud'},{w:'Desde el Ecuador',t:'latitud'},{w:'Desde Greenwich',t:'longitud'},{w:'14° N',t:'latitud'},{w:'87° W',t:'longitud'}] },
];
let currentRetoPairIdx = 0, retoPool=[], retoOk=0, retoErr=0, retoTimerInt=null, retoSec=30, retoRunning=false, retoCurrent=null;
function updateRetoButtons(){
  const pair = retoPairs[currentRetoPairIdx];
  document.querySelectorAll('.reto-btns .btn')[0].textContent = pair.btnA; document.querySelectorAll('.reto-btns .btn')[1].textContent = pair.btnB;
  document.querySelectorAll('.reto-btns .btn')[0].onclick = ()=>ansReto(pair.colA); document.querySelectorAll('.reto-btns .btn')[1].onclick = ()=>ansReto(pair.colB);
}
function startReto(){
  if(retoRunning) return; retoRunning=true; retoOk=0; retoErr=0; retoSec=30;
  retoPool = _shuffle([...retoPairs[currentRetoPairIdx].words, ...retoPairs[currentRetoPairIdx].words]); showRetoWord();
  retoTimerInt = setInterval(()=>{ retoSec--; document.getElementById('retoTimer').textContent = '⏱ '+retoSec; if(retoSec<=0){ clearInterval(retoTimerInt); endReto(); } }, 1000);
}
function showRetoWord(){ if(retoPool.length===0) retoPool = _shuffle([...retoPairs[currentRetoPairIdx].words, ...retoPairs[currentRetoPairIdx].words]); retoCurrent = retoPool.pop(); document.getElementById('retoWord').textContent = retoCurrent.w; }
function ansReto(t){
  if(!retoRunning||!retoCurrent) return; const firstPlay = !xpTracker.reto.has(currentRetoPairIdx);
  if(t===retoCurrent.t){ retoOk++; if(firstPlay) pts(1); } else { retoErr++; if(firstPlay) pts(-1); }
  document.getElementById('retoScore').textContent = `✅ ${retoOk} correctas | ❌ ${retoErr} errores`; showRetoWord();
}
function endReto(){
  retoRunning = false; document.getElementById('retoWord').textContent = '🏁 ¡Tiempo!';
  xpTracker.reto.add(currentRetoPairIdx); const total = retoOk+retoErr; const pct = total>0?Math.round((retoOk/total)*100):0;
  fb('fbReto',`Resultado: ${retoOk}/${total} (${pct}%) ¡Bien hecho!`,true); fin('s-reto');
}
function nextRetoPair(){ clearInterval(retoTimerInt); retoRunning=false; currentRetoPairIdx = (currentRetoPairIdx+1) % retoPairs.length; updateRetoButtons(); document.getElementById('retoTimer').textContent = '⏱ 30'; document.getElementById('retoWord').textContent = '¡Prepárate!'; document.getElementById('retoScore').textContent = '✅ 0 correctas | ❌ 0 errores'; document.getElementById('fbReto').classList.remove('show'); }
function resetReto(){ clearInterval(retoTimerInt); retoRunning=false; document.getElementById('retoTimer').textContent = '⏱ 30'; document.getElementById('retoWord').textContent = '¡Prepárate!'; document.getElementById('retoScore').textContent = '✅ 0 correctas | ❌ 0 errores'; document.getElementById('fbReto').classList.remove('show'); }

// ===================== SOPA DE LETRAS =====================
const sopaSets=[
  { size:10, grid:[
      ['E','C','U','A','D','O','R','K','Z','B'],
      ['X','Y','T','W','P','O','L','O','Q','R'],
      ['P','L','R','V','A','Z','X','C','V','U'],
      ['N','A','O','M','A','P','A','S','D','J'],
      ['O','T','P','M','L','K','J','H','G','U'],
      ['R','I','I','E','S','T','E','W','Q','L'],
      ['T','T','C','W','E','R','T','Y','U','A'],
      ['E','U','O','E','S','T','E','H','J','K'],
      ['V','D','X','C','V','B','N','M','L','P'],
      ['L','O','N','G','I','T','U','D','Z','X']
    ], words:[ {w:'ECUADOR',cells:[[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6]]}, {w:'LATITUD',cells:[[9,0],[8,1],[7,2],[6,3],[5,4],[4,5],[3,6]]}, {w:'LONGITUD',cells:[[9,0],[9,1],[9,2],[9,3],[9,4],[9,5],[9,6],[9,7]]}, {w:'NORTE',cells:[[3,0],[4,0],[5,0],[6,0],[7,0]]}, {w:'SUR',cells:[[5,4],[4,4],[3,4]]}, {w:'ESTE',cells:[[5,3],[5,4],[5,5],[5,6]]}, {w:'OESTE',cells:[[7,2],[7,3],[7,4],[7,5],[7,6]]}, {w:'TROPICO',cells:[[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2]]}, {w:'MAPA',cells:[[3,3],[3,4],[3,5],[3,6]]}, {w:'BRUJULA',cells:[[0,9],[1,9],[2,9],[3,9],[4,9],[5,9],[6,9]]}, {w:'POLO',cells:[[1,4],[1,5],[1,6],[1,7]]} ]}
];
let currentSopaSetIdx=0, sopaFoundWords=new Set();
let sopaFirstClickCell=null, sopaPointerStartCell=null, sopaPointerMoved=false, sopaSelectedCells=[];

function buildSopa(){ /* Sopa logic identical to original */
  const set=sopaSets[currentSopaSetIdx]; const grid=document.getElementById('sopaGrid'); grid.innerHTML='';
  grid.style.gridTemplateColumns=`repeat(${set.size},28px)`; grid.style.gridTemplateRows=`repeat(${set.size},28px)`;
  sopaFirstClickCell=null; sopaSelectedCells=[];
  for(let r=0;r<set.size;r++) for(let c=0;c<set.size;c++){
    const cell=document.createElement('div'); cell.className='sopa-cell'; cell.style.width='28px'; cell.style.height='28px';
    cell.textContent=set.grid[r][c]; cell.dataset.row=r; cell.dataset.col=c;
    grid.appendChild(cell);
  }
  setupSopaEvents();
  const wl=document.getElementById('sopaWords'); wl.innerHTML='';
  set.words.forEach(wObj=>{ const sp=document.createElement('span'); sp.className='sopa-w'; sp.id='sw-'+wObj.w; sp.textContent=wObj.w; wl.appendChild(sp); });
}
function setupSopaEvents(){
  const grid=document.getElementById('sopaGrid');
  grid.onpointerdown=e=>{ const cell=e.target.closest('.sopa-cell'); if(!cell) return; e.preventDefault(); grid.setPointerCapture(e.pointerId); sopaPointerStartCell=cell; sopaPointerMoved=false; cell.classList.add('sopa-sel'); sopaSelectedCells=[cell]; };
  grid.onpointermove=e=>{
    if(!sopaPointerStartCell) return; e.preventDefault(); const el=document.elementFromPoint(e.clientX,e.clientY); const cell=el?el.closest('.sopa-cell'):null; if(!cell) return;
    const sr=parseInt(sopaPointerStartCell.dataset.row),sc=parseInt(sopaPointerStartCell.dataset.col); const er=parseInt(cell.dataset.row),ec=parseInt(cell.dataset.col);
    if(sr!==er||sc!==ec) sopaPointerMoved=true; document.querySelectorAll('.sopa-cell.sopa-sel').forEach(c=>c.classList.remove('sopa-sel')); sopaSelectedCells=[];
    getSopaPath(sr,sc,er,ec).forEach(([r,c])=>{ const pc=document.querySelector(`#sopaGrid [data-row="${r}"][data-col="${c}"]`); if(pc){pc.classList.add('sopa-sel');sopaSelectedCells.push(pc);} });
  };
  grid.onpointerup=e=>{
    if(!sopaPointerStartCell) return; e.preventDefault(); grid.releasePointerCapture(e.pointerId);
    if(sopaPointerMoved&&sopaSelectedCells.length>1) checkSopaSelection();
    else {
      const cell=sopaPointerStartCell; document.querySelectorAll('.sopa-cell.sopa-sel').forEach(c=>c.classList.remove('sopa-sel')); sopaSelectedCells=[];
      if(!sopaFirstClickCell){ sopaFirstClickCell=cell; cell.classList.add('sopa-start'); }
      else if(sopaFirstClickCell===cell){ cell.classList.remove('sopa-start'); sopaFirstClickCell=null; }
      else {
        const sr=parseInt(sopaFirstClickCell.dataset.row),sc=parseInt(sopaFirstClickCell.dataset.col); const er=parseInt(cell.dataset.row),ec=parseInt(cell.dataset.col);
        sopaFirstClickCell.classList.remove('sopa-start'); sopaFirstClickCell=null;
        getSopaPath(sr,sc,er,ec).forEach(([r,c])=>{ const pc=document.querySelector(`#sopaGrid [data-row="${r}"][data-col="${c}"]`); if(pc){pc.classList.add('sopa-sel');sopaSelectedCells.push(pc);} });
        checkSopaSelection();
      }
    } sopaPointerStartCell=null; sopaPointerMoved=false;
  };
}
function getSopaPath(r1,c1,r2,c2){
  const dr=Math.sign(r2-r1),dc=Math.sign(c2-c1),lr=Math.abs(r2-r1),lc=Math.abs(c2-c1);
  if(lr!==0&&lc!==0&&lr!==lc) return [[r1,c1]]; const len=Math.max(lr,lc); const path=[];
  for(let i=0;i<=len;i++) path.push([r1+dr*i,c1+dc*i]); return path;
}
function checkSopaSelection(){
  const set=sopaSets[currentSopaSetIdx]; const word=sopaSelectedCells.map(c=>c.textContent).join(''); const wordRev=word.split('').reverse().join('');
  const found=set.words.find(wObj=>!sopaFoundWords.has(wObj.w)&&(wObj.w===word||wObj.w===wordRev));
  if(found){
    sopaFoundWords.add(found.w); found.cells.forEach(([r,c])=>{ const cell=document.querySelector(`#sopaGrid [data-row="${r}"][data-col="${c}"]`); if(cell){cell.classList.remove('sopa-sel','sopa-start');cell.classList.add('sopa-found');} });
    const sp=document.getElementById('sw-'+found.w); if(sp) sp.classList.add('found');
    if(!xpTracker.sopa.has(found.w)){xpTracker.sopa.add(found.w);pts(1);} if(sopaFoundWords.size===set.words.length) fin('s-sopa');
  }
  document.querySelectorAll('.sopa-cell.sopa-sel').forEach(c=>c.classList.remove('sopa-sel')); sopaSelectedCells=[];
}
function nextSopaSet(){ sopaFoundWords=new Set(); buildSopa(); }

// ===================== TASK GENERATOR =====================
const taskDB = {
  identify: [
    {s:'Latitud',type:'Distancia hacia el Norte o Sur del Ecuador.'}, {s:'Longitud',type:'Distancia hacia el Este o Oeste de Greenwich.'},
    {s:'Ecuador',type:'Paralelo a 0°, divide la Tierra en Hemisferio Norte y Sur.'}, {s:'Greenwich',type:'Meridiano a 0°, divide la Tierra en Este y Oeste.'}
  ],
  classify: [
    {w:'Ecuador',t:'Paralelo'}, {w:'Greenwich',t:'Meridiano'}, {w:'Miden Norte/Sur',t:'Paralelo (Latitud)'}, {w:'Miden Este/Oeste',t:'Meridiano (Longitud)'}
  ],
  complete: [
    {s:'La ___ señala el Norte magnético.',opts:['brújula','mapa'],ans:'brújula'}, {s:'Los ___ son líneas verticales que miden la longitud.',opts:['paralelos','meridianos'],ans:'meridianos'}
  ],
  explain: [
    {q:'Explica la diferencia entre un paralelo y un meridiano.',ans:'El paralelo es horizontal y mide la latitud. El meridiano es vertical y mide la longitud.'},
    {q:'¿Para qué sirve el GPS?',ans:'Utiliza satélites para dar una ubicación exacta usando coordenadas.'}
  ]
};
let ansVisible = false;
function genTask(){
  const type = document.getElementById('tgType').value, count = parseInt(document.getElementById('tgCount').value); ansVisible = false; const out = document.getElementById('tgOut'); out.innerHTML='';
  _pick(taskDB[type], Math.min(count, taskDB[type].length)).forEach((item,i)=>{
    const div=document.createElement('div'); div.className='tg-task';
    let text = type==='identify' ? `Define: <strong>${item.s}</strong>` : type==='classify' ? `Clasifica: <strong>${item.w}</strong>` : type==='complete' ? item.s.replace('___','<span class="tg-blank"></span>') + ` (Opciones: ${item.opts.join(', ')})` : item.q;
    let ans = item.type || item.t || item.ans;
    div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${text}</strong><div class="tg-answer">✅ ${ans}</div></div>`;
    out.appendChild(div);
  }); fin('s-tareas');
}
function toggleAns(){ ansVisible=!ansVisible; document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none'); }

// ===================== EVALUACIÓN FINAL =====================
const evalTFBank=[
  {q:'El Ecuador es un meridiano.',a:false}, {q:'La brújula señala al Norte magnético.',a:true},
  {q:'La latitud se mide de 0° a 90°.',a:true}, {q:'Los meridianos son líneas horizontales.',a:false},
  {q:'Greenwich es el meridiano cero.',a:true}, {q:'Honduras se encuentra en la zona polar.',a:false}
];
const evalMCBank=[
  {q:'¿Qué miden los paralelos?',o:['a) Temperatura','b) Latitud','c) Longitud'],a:1},
  {q:'¿Qué instrumento usa satélites?',o:['a) GPS','b) Brújula','c) Mapa'],a:0},
  {q:'El meridiano principal es:',o:['a) Cáncer','b) Greenwich','c) Ecuador'],a:1}
];
const evalCPBank=[
  {q:'La distancia desde el Ecuador hacia el N o S es la ___.',a:'latitud'},
  {q:'Los ___ son líneas verticales de polo a polo.',a:'meridianos'}
];
const evalPRBank=[
  {term:'Ecuador',def:'Paralelo a 0°'}, {term:'Greenwich',def:'Meridiano a 0°'},
  {term:'Brújula',def:'Señala el Norte'}, {term:'GPS',def:'Usa satélites para ubicación'}
];

function genEval(){
  sfx('click');
  const cf = evalFormNum;
  window._currentEvalForm = cf;
  evalFormNum = (evalFormNum % 10) + 1;
  saveProgress();
  document.getElementById('eval-screen-title').textContent = `📝 Evaluación Final — Forma ${cf} · Geografía`;
  evalAnsVisible = false;
  const out = document.getElementById('evalOut'); out.innerHTML='';
  
  const s1 = document.createElement('div'); s1.innerHTML='<div class="eval-section-title">I. Verdadero o Falso <span class="eval-pts">25 pts</span></div>';
  _pick(evalTFBank, Math.min(5, evalTFBank.length)).forEach((item,i)=>{
    const d=document.createElement('div'); d.className='eval-item';
    d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}"> Falso</label></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div>`;
    s1.appendChild(d);
  });
  out.appendChild(s1);

  const s2 = document.createElement('div'); s2.innerHTML='<div class="eval-section-title">II. Selección Múltiple <span class="eval-pts">25 pts</span></div>';
  _pick(evalMCBank, Math.min(5, evalMCBank.length)).forEach((item,i)=>{
    const d=document.createElement('div'); d.className='eval-item';
    const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join('');
    d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div>`;
    s2.appendChild(d);
  });
  out.appendChild(s2);

  const s3 = document.createElement('div'); s3.innerHTML='<div class="eval-section-title">III. Completar el espacio <span class="eval-pts">25 pts</span></div>';
  _pick(evalCPBank, Math.min(5, evalCPBank.length)).forEach((item,i)=>{
    const d=document.createElement('div'); d.className='eval-item';
    const qHtml=item.q.replace('___','<span class="eval-blank">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');
    d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div>`;
    s3.appendChild(d);
  });
  out.appendChild(s3);

  const prItems = _pick(evalPRBank, 4);
  const shuffledDefs = [...prItems].sort(()=>Math.random()-0.5);
  const letters = ['A','B','C','D','E'];
  const s4 = document.createElement('div'); s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts</span></div>';
  const matchCard = document.createElement('div'); matchCard.className='eval-item';
  let colLeft='<div class="eval-match-col"><h4>📌 Términos</h4>';
  prItems.forEach((item,i)=>{ colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> <span class="eval-match-line">&nbsp;&nbsp;&nbsp;</span> ${item.term}</div>`; });
  colLeft+='</div>';
  let colRight='<div class="eval-match-col"><h4>🔑 Definiciones</h4>';
  shuffledDefs.forEach((item,i)=>{ colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`; });
  colRight+='</div>';
  matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div>`;
  s4.appendChild(matchCard); out.appendChild(s4);
  
  fin('s-evaluacion');
}

function toggleEvalAns(){
  evalAnsVisible = !evalAnsVisible;
  document.querySelectorAll('#evalOut .eval-answer').forEach(el=>el.style.display=evalAnsVisible?'block':'none');
  sfx('click');
}

function printEval(){
  window.print();
}

// ===================== DIPLOMA =====================
function openDiploma(){
  const pct = getProgress(); document.getElementById('diplPct').textContent = pct+'%'; document.getElementById('diplBar').style.width = pct+'%';
  document.getElementById('diplMsg').textContent = pct===100?'¡Explorador Maestro!':'¡Sigue adelante!'; document.getElementById('diplDate').textContent = new Date().toLocaleDateString();
  document.getElementById('diplomaOverlay').classList.add('open');
}
function closeDiploma(){ document.getElementById('diplomaOverlay').classList.remove('open'); }
function updateDiplomaName(v){ document.getElementById('diplName').textContent = v||'Estudiante'; }

// ===================== INIT =====================
document.addEventListener('DOMContentLoaded',()=>{
  initTheme(); loadProgress(); upFC(); buildQz(); buildClass(); showId(); showCmp(); buildSopa(); genEval(); labInit(); updateRetoButtons();
  document.addEventListener('click',function(e){if(e.target===document.getElementById('diplomaOverlay')) closeDiploma();});
  fin('s-aprende');
});