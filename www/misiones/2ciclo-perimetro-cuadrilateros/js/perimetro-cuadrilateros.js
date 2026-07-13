// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
function compartirMision() {
    const url = window.location.href;
    const texto = `🚀 *Misión Asignada: Perímetro y Área de Cuadriláteros* 🚀\n\nAprende a calcular el perímetro (el contorno) y el área (la superficie) de cuadrados y rectángulos con sus fórmulas. 🔲\n\nDesbloquea *todos los logros* y puedes poner *tus datos* para que tu maestro observe todos tus logros. 📋\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;
    _waShare(texto);
}

// ===================== ACCESIBILIDAD =====================
function toggleLetra() {
  document.body.classList.toggle('letra-grande');
  if(typeof sfx === 'function') sfx('click');
  localStorage.setItem('prefLetraPerimetro', document.body.classList.contains('letra-grande'));
}
window.addEventListener('DOMContentLoaded', () => {
  if(localStorage.getItem('prefLetraPerimetro') === 'true') document.body.classList.add('letra-grande');
});

// ===================== UTILIDADES =====================
const _pick = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
const _shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
function fb(id, msg, isOk) {
  const el = document.getElementById(id);
  if(el) { el.textContent = msg; el.className = 'fb show ' + (isOk ? 'ok' : 'err'); }
}
function _rint(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
function _perimCuad(l){ return 4*l; }
function _perimRect(b,h){ return 2*(b+h); }
function _areaCuad(l){ return l*l; }
function _areaRect(b,h){ return b*h; }

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY = 'matematica_perimetro_cuadrilateros_v1';
let xp = 0, MXP = 200, done = new Set(), evalAnsVisible = false;
let evalFormNum = 1, evalOpFormNum = 1, evalOpAnsVisible = false, unlockedAch = [], darkMode = false, prevLevel = 0;
const TOTAL_SECTIONS = 16;
const xpTracker = { fc: new Set(), qz: new Set(), cls: new Set(), id: new Set(), cmp: new Set(), reto: new Set(), sopa: new Set(), predice: new Set(), explica: new Set(), memo: new Set(), labP: new Set(), labA: new Set(), wFig: new Set(), wPer: new Set(), wAre: new Set() };

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
  {w:'Perímetro',a:'medida del <strong>contorno</strong> de una figura. se obtiene <strong>sumando todos sus lados</strong>.'},
  {w:'Área',a:'medida de la <strong>superficie</strong> que cubre una figura. se expresa en <strong>unidades cuadradas</strong> (cm², m²).'},
  {w:'Cuadrilátero',a:'polígono de <strong>4 lados</strong>. el cuadrado y el rectángulo son cuadriláteros.'},
  {w:'Cuadrado',a:'cuadrilátero con sus <strong>4 lados iguales</strong> y 4 ángulos rectos.'},
  {w:'Rectángulo',a:'cuadrilátero con lados <strong>iguales dos a dos</strong> (base y altura) y 4 ángulos rectos.'},
  {w:'Lado',a:'cada uno de los <strong>segmentos</strong> que forman el contorno de la figura.'},
  {w:'Base',a:'lado <strong>horizontal</strong> de un rectángulo, sobre el que se apoya.'},
  {w:'Altura',a:'lado <strong>vertical</strong> de un rectángulo, perpendicular a la base.'},
  {w:'Perímetro del cuadrado',a:'<strong>P = 4 × lado</strong>. se suman los 4 lados iguales.'},
  {w:'Perímetro del rectángulo',a:'<strong>P = 2 × (base + altura)</strong>. se suman los 4 lados.'},
  {w:'Área del cuadrado',a:'<strong>A = lado × lado</strong> (lado al cuadrado).'},
  {w:'Área del rectángulo',a:'<strong>A = base × altura</strong>.'},
  {w:'Unidad cuadrada',a:'unidad del área: <strong>cm², m², km²</strong>. lleva el pequeño ².'},
  {w:'Contorno',a:'la <strong>línea que rodea</strong> la figura; su medida es el perímetro.'}
];
let fcIdx=0;
function upFC(){ document.getElementById('fcInner').classList.remove('flipped'); document.getElementById('fcW').textContent=fcData[fcIdx].w; document.getElementById('fcA').innerHTML=fcData[fcIdx].a; document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length; }
function flipCard(){ sfx('flip'); document.getElementById('fcInner').classList.toggle('flipped'); if(!xpTracker.fc.has(fcIdx)){ xpTracker.fc.add(fcIdx); pts(1); } if(xpTracker.fc.size===fcData.length){ fin('s-flash'); unlockAchievement('flash_master'); } }
function nextFC(){ sfx('click'); fcIdx=(fcIdx+1)%fcData.length; upFC(); }
function prevFC(){ sfx('click'); fcIdx=(fcIdx-1+fcData.length)%fcData.length; upFC(); }

// ===================== JUEGO: MEMORIA =====================
const memoPairs=[
  {id:'perimetro',t:'Perímetro',d:'📏 contorno: suma de los lados'},
  {id:'area',t:'Área',d:'🟦 superficie: base × altura'},
  {id:'cuadrado',t:'Cuadrado',d:'⬛ 4 lados iguales · A = L × L'},
  {id:'rectangulo',t:'Rectángulo',d:'▭ base × altura'},
  {id:'pcuad',t:'P = 4 × lado',d:'📐 perímetro del cuadrado'},
  {id:'unidad',t:'cm² · m²',d:'🔲 unidad del área (cuadrada)'}
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

// ===================== QUIZ DATA =====================
const qzData=[
  {q:'¿Qué mide el perímetro de una figura?',o:['a) la superficie','b) el contorno','c) el volumen','d) los ángulos'],c:1,feedback:'El perímetro mide el contorno: la suma de todos los lados.'},
  {q:'¿Cuál es el perímetro de un cuadrado de lado 6 cm?',o:['a) 36 cm','b) 24 cm','c) 12 cm','d) 18 cm'],c:1,feedback:'P = 4 × 6 = 24 cm. Se suman los 4 lados iguales.'},
  {q:'¿Cuál es el área de un cuadrado de lado 6 cm?',o:['a) 24 cm²','b) 12 cm²','c) 36 cm²','d) 30 cm²'],c:2,feedback:'A = lado × lado = 6 × 6 = 36 cm².'},
  {q:'¿Cuál es el área de un rectángulo de 8 × 3?',o:['a) 24 cm²','b) 22 cm²','c) 11 cm²','d) 16 cm²'],c:0,feedback:'A = base × altura = 8 × 3 = 24 cm².'},
  {q:'¿Cuál es el perímetro de un rectángulo de 8 × 3?',o:['a) 24 cm','b) 22 cm','c) 11 cm','d) 16 cm'],c:1,feedback:'P = 2 × (8 + 3) = 2 × 11 = 22 cm.'},
  {q:'¿En qué unidad se mide el área?',o:['a) en cm','b) en cm²','c) en litros','d) en grados'],c:1,feedback:'El área se mide en unidades cuadradas: cm², m²…'},
  {q:'Para cercar un terreno cuadrado, ¿qué calculo?',o:['a) el área','b) el perímetro','c) el volumen','d) la altura'],c:1,feedback:'La cerca rodea el terreno: es el perímetro.'},
  {q:'Un cuadrilátero tiene:',o:['a) 3 lados','b) 4 lados','c) 5 lados','d) 6 lados'],c:1,feedback:'Todo cuadrilátero tiene 4 lados. El cuadrado y el rectángulo lo son.'},
  {q:'¿Cuál fórmula es la del área del rectángulo?',o:['a) 4 × lado','b) base × altura','c) 2 × (base + altura)','d) lado + lado'],c:1,feedback:'El área del rectángulo es base × altura.'}
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
    label:['Perímetro','Área'], headA:'📏 Es PERÍMETRO (contorno)', headB:'🟦 Es ÁREA (superficie)', colA:'per', colB:'area',
    words:[{w:'suma de los lados',t:'per'},{w:'base × altura',t:'area'},{w:'la cerca de un terreno',t:'per'},{w:'pintar el piso',t:'area'},{w:'se mide en cm',t:'per'},{w:'se mide en cm²',t:'area'},{w:'4 × lado',t:'per'},{w:'lado × lado',t:'area'},{w:'el borde de la mesa',t:'per'},{w:'alfombrar el cuarto',t:'area'}]
  },
  {
    label:['Cuadrado','Rectángulo'], headA:'⬛ Propio del CUADRADO', headB:'▭ Propio del RECTÁNGULO', colA:'cuad', colB:'rect',
    words:[{w:'4 lados iguales',t:'cuad'},{w:'base y altura distintas',t:'rect'},{w:'P = 4 × lado',t:'cuad'},{w:'P = 2 × (base + altura)',t:'rect'},{w:'A = lado × lado',t:'cuad'},{w:'A = base × altura',t:'rect'},{w:'una baldosa cuadrada',t:'cuad'},{w:'una puerta',t:'rect'},{w:'un tablero de ajedrez',t:'cuad'},{w:'una cancha de fútbol',t:'rect'}]
  },
  {
    label:['Unidad lineal','Unidad cuadrada'], headA:'📏 Unidad LINEAL', headB:'🔲 Unidad CUADRADA', colA:'lin', colB:'cua',
    words:[{w:'cm',t:'lin'},{w:'cm²',t:'cua'},{w:'m',t:'lin'},{w:'m²',t:'cua'},{w:'km',t:'lin'},{w:'km²',t:'cua'},{w:'metro',t:'lin'},{w:'metro cuadrado',t:'cua'},{w:'para el perímetro',t:'lin'},{w:'para el área',t:'cua'}]
  },
  {
    label:['Perímetro = 24','Perímetro ≠ 24'], headA:'✅ Su perímetro es 24', headB:'🚫 Su perímetro NO es 24', colA:'si', colB:'no',
    words:[{w:'cuadrado de lado 6',t:'si'},{w:'cuadrado de lado 5',t:'no'},{w:'rectángulo 8 × 4',t:'si'},{w:'rectángulo 5 × 3',t:'no'},{w:'rectángulo 9 × 3',t:'si'},{w:'cuadrado de lado 7',t:'no'},{w:'rectángulo 10 × 2',t:'si'},{w:'rectángulo 6 × 6',t:'si'},{w:'cuadrado de lado 4',t:'no'},{w:'rectángulo 7 × 4',t:'no'}]
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
      if(clsSelected){
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
  {s:['El','perímetro','es','la','suma','de','todos','los','lados.'],c:1,art:'Medida del contorno de una figura'},
  {s:['El','área','se','mide','en','unidades','cuadradas.'],c:1,art:'Medida de la superficie'},
  {s:['Un','cuadrado','tiene','sus','cuatro','lados','iguales.'],c:1,art:'Cuadrilátero de 4 lados iguales'},
  {s:['El','rectángulo','tiene','base','y','altura','distintas.'],c:1,art:'Cuadrilátero con lados iguales dos a dos'},
  {s:['El','área','del','rectángulo','es','base','por','altura.'],c:5,art:'Lado horizontal que se multiplica por la altura'},
  {s:['La','altura','es','perpendicular','a','la','base.'],c:1,art:'Lado vertical del rectángulo'},
  {s:['El','contorno','de','la','figura','es','su','perímetro.'],c:1,art:'La línea que rodea la figura'},
  {s:['Un','cuadrilátero','tiene','cuatro','lados.'],c:1,art:'Polígono de cuatro lados'}
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
  {s:'La medida del contorno de una figura es el ___.',opts:['área','perímetro','volumen'],c:1},
  {s:'La superficie que cubre una figura es el ___.',opts:['perímetro','área','borde'],c:1},
  {s:'El perímetro de un cuadrado es 4 × ___.',opts:['lado','base','altura'],c:0},
  {s:'El área de un rectángulo es base × ___.',opts:['lado','altura','perímetro'],c:1},
  {s:'El área se mide en unidades ___.',opts:['lineales','cuadradas','cúbicas'],c:1},
  {s:'Un cuadrilátero tiene ___ lados.',opts:['tres','cuatro','cinco'],c:1},
  {s:'El cuadrado tiene sus cuatro lados ___.',opts:['distintos','iguales','curvos'],c:1},
  {s:'Para cercar un terreno se calcula el ___.',opts:['área','perímetro','volumen'],c:1}
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

// ===================== MINI QUIZ INLINE =====================
function answerMQ(wrapId, btn, isOk, msg) {
  const wrap = document.getElementById(wrapId);
  if (!wrap || wrap.dataset.done) return;
  wrap.dataset.done = '1';
  const allBtns = wrap.querySelectorAll('.mq-btn');
  allBtns.forEach(b => { b.disabled = true; });
  btn.classList.add(isOk ? 'mq-ok' : 'mq-no');
  if (!isOk) { allBtns.forEach(b => { if (b.onclick.toString().includes('true,')) b.classList.add('mq-ok'); }); }
  const fbEl = document.getElementById(wrapId + '-fb');
  if (fbEl) { fbEl.textContent = (isOk ? '✔ ' : '💡 ') + msg; fbEl.className = 'mq-fb show ' + (isOk ? 'ok' : 'err'); }
  if (isOk) sfx('ok'); else sfx('no');
}

// ===================== PREDICE =====================
const prediceData = [
  {
    q: 'Un cuadrado tiene lado 5 cm. ¿Cuál es su perímetro?',
    opts: ['20 cm', '25 cm', '10 cm'],
    correct: 0,
    feedback: '¡Correcto! P = 4 × 5 = 20 cm. (25 sería el área.)',
    wrongFeedback: 'Es 20 cm: P = 4 × lado = 4 × 5. El 25 es el área.',
    explore: 'perim'
  },
  {
    q: 'Un rectángulo mide 6 × 4. ¿Cuál es su área?',
    opts: ['24 cm²', '20 cm²', '10 cm²'],
    correct: 0,
    feedback: '¡Bien! A = base × altura = 6 × 4 = 24 cm².',
    wrongFeedback: 'Es 24 cm²: área = base × altura = 6 × 4. El 20 es el perímetro.',
    explore: 'area'
  },
  {
    q: 'Para poner una cerca alrededor de un patio, ¿qué debes calcular?',
    opts: ['El perímetro', 'El área', 'El volumen'],
    correct: 0,
    feedback: '¡Exacto! La cerca rodea el patio: es el perímetro.',
    wrongFeedback: 'Es el perímetro: la cerca rodea el borde del patio.',
    explore: 'cerca'
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
    fbEl.textContent = '✔ ' + item.feedback; fbEl.className = 'predice-fb show ok';
    if (!xpTracker.predice.has(qi)) { xpTracker.predice.add(qi); pts(3); }
    sfx('ok');
  } else {
    opts[ai].classList.add('predice-no'); opts[item.correct].classList.add('predice-ok');
    fbEl.textContent = '💡 ' + item.wrongFeedback; fbEl.className = 'predice-fb show err';
    sfx('no');
  }
  prediceAnswered.add(qi);
  if (prediceAnswered.size === prediceData.length) { fin('s-predice'); sfx('fan'); showToast('🔮 ¡Predicciones completadas! Ahora a aprender.'); }
}
function togglePredExplore(i){
  sfx('click');
  const box=document.getElementById('pd-explore-'+i); if(!box) return;
  const btn=document.getElementById('pd-btn-'+i);
  if(box.style.display==='none'){
    if(!box.dataset.built){ _buildPredExplore(i,box); box.dataset.built='1'; }
    box.style.display='block'; if(btn) btn.textContent='🔽 Ocultar la pista';
  } else { box.style.display='none'; if(btn) btn.textContent='🔍 Explorar la pista'; }
}
function _buildPredExplore(i,box){
  const type=prediceData[i].explore;
  if(type==='perim'){
    box.innerHTML=`<p class="pd-tip">El cuadrado tiene 4 lados iguales de 5. Toca para sumarlos:</p><div style="display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;margin:0.5rem 0;"><button class="btn btn-pri" onclick="predPerim(${i})">5 + 5 + 5 + 5</button></div><div class="pd-msg" id="pd-msg-${i}">👆 toca para sumar los lados</div>`;
  } else if(type==='area'){
    box.innerHTML=`<p class="pd-tip">El área cuenta los cuadraditos: 6 de ancho por 4 de alto. Toca para verlo:</p><div style="display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;margin:0.5rem 0;"><button class="btn btn-pri" onclick="predArea(${i})">6 × 4 cuadraditos</button></div><div class="pd-msg" id="pd-msg-${i}">👆 toca para contar</div>`;
  } else if(type==='cerca'){
    box.innerHTML=`<p class="pd-tip">¿La cerca va por el borde o cubre el piso? Toca la opción correcta:</p><div style="display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;margin:0.5rem 0;"><button class="btn btn-pri" onclick="predCerca(${i},true)">Rodea el borde</button><button class="btn btn-pri" onclick="predCerca(${i},false)">Cubre el piso</button></div><div class="pd-msg" id="pd-msg-${i}">👆 elige una opción</div>`;
  }
}
function predPerim(i){ sfx('ok'); document.getElementById('pd-msg-'+i).innerHTML='5 + 5 + 5 + 5 = <strong>20 cm</strong>. ¡Ese es el perímetro! (o 4 × 5).'; }
function predArea(i){ sfx('ok'); document.getElementById('pd-msg-'+i).innerHTML='6 × 4 = <strong>24 cuadraditos</strong> = 24 cm². ¡Esa es el área!'; }
function predCerca(i,ok){ const msg=document.getElementById('pd-msg-'+i); if(ok){ sfx('ok'); msg.innerHTML='✅ La cerca <strong>rodea el borde</strong>: eso es el <strong>perímetro</strong>.'; } else { sfx('no'); msg.innerHTML='❌ Cubrir el piso sería el ÁREA. La cerca rodea el borde (perímetro).'; } }

// ===================== LAB 1: PERÍMETROS =====================
let labPScore=0, labPCur=null;
function _figRandom(){ if(Math.random()<0.5){ const l=_rint(3,15); return {tipo:'cuadrado', l, desc:`Cuadrado de lado ${l} cm`, per:_perimCuad(l), area:_areaCuad(l)}; } const b=_rint(3,15), h=_rint(2,12); return {tipo:'rectángulo', b, h, desc:`Rectángulo de ${b} cm × ${h} cm`, per:_perimRect(b,h), area:_areaRect(b,h)}; }
function buildLabPerimetro(){ const c=document.getElementById('labPerimetro'); if(!c) return; labPScore=0; showLabPerimetro(); }
function showLabPerimetro(){ const c=document.getElementById('labPerimetro'); if(!c) return; labPCur=_figRandom(); c.innerHTML=`<div class="wv-card"><div class="wv-deg" style="font-size:1.3rem;">${labPCur.desc}</div><div class="wv-q">Calcula el <strong>perímetro</strong> (cm):</div><div style="display:flex;gap:0.5rem;justify-content:center;flex-wrap:wrap;align-items:center;"><input type="text" id="labPIn" inputmode="numeric" class="eval-cp-input" style="max-width:120px;"><button class="btn btn-g" onclick="ansLabPerimetro()">✅</button><button class="btn btn-d" onclick="showLabPerimetro()">🔄</button></div><div class="fb" id="fbLabP" role="alert"></div><div style="margin-top:0.5rem;font-size:0.82rem;color:var(--gray);">📏 Aciertos: <span id="labPScore">${labPScore}</span> de 5</div></div>`; }
function ansLabPerimetro(){ if(!labPCur) return; const ok=_isIntMatch(document.getElementById('labPIn').value,labPCur.per); if(ok){ sfx('ok'); labPScore++; if(labPScore<=5 && !xpTracker.labP.has(labPScore)){ xpTracker.labP.add(labPScore); pts(2); } fb('fbLabP',`¡Correcto! El perímetro es ${labPCur.per} cm.`,true); if(labPScore>=5) fin('s-lab'); setTimeout(showLabPerimetro,1200); } else { sfx('no'); const f=labPCur.tipo==='cuadrado'?`4 × ${labPCur.l}`:`2 × (${labPCur.b} + ${labPCur.h})`; fb('fbLabP',`Revisa: ${f} = ${labPCur.per} cm.`,false); } }

// ===================== LAB 2: ÁREAS =====================
let labAScore=0, labACur=null;
function buildLabArea(){ const c=document.getElementById('labArea'); if(!c) return; labAScore=0; showLabArea(); }
function showLabArea(){ const c=document.getElementById('labArea'); if(!c) return; labACur=_figRandom(); c.innerHTML=`<div class="wv-card"><div class="wv-deg" style="font-size:1.3rem;">${labACur.desc}</div><div class="wv-q">Calcula el <strong>área</strong> (cm²):</div><div style="display:flex;gap:0.5rem;justify-content:center;flex-wrap:wrap;align-items:center;"><input type="text" id="labAIn" inputmode="numeric" class="eval-cp-input" style="max-width:120px;"><button class="btn btn-g" onclick="ansLabArea()">✅</button><button class="btn btn-d" onclick="showLabArea()">🔄</button></div><div class="fb" id="fbLabA" role="alert"></div><div style="margin-top:0.5rem;font-size:0.82rem;color:var(--gray);">🟦 Aciertos: <span id="labAScore">${labAScore}</span> de 5</div></div>`; }
function ansLabArea(){ if(!labACur) return; const ok=_isIntMatch(document.getElementById('labAIn').value,labACur.area); if(ok){ sfx('ok'); labAScore++; if(labAScore<=5 && !xpTracker.labA.has(labAScore)){ xpTracker.labA.add(labAScore); pts(2); } fb('fbLabA',`¡Correcto! El área es ${labACur.area} cm².`,true); if(labAScore>=5) fin('s-lab'); setTimeout(showLabArea,1200); } else { sfx('no'); const f=labACur.tipo==='cuadrado'?`${labACur.l} × ${labACur.l}`:`${labACur.b} × ${labACur.h}`; fb('fbLabA',`Revisa: ${f} = ${labACur.area} cm².`,false); } }

// ===================== WIDGET: ¿PERÍMETRO O ÁREA? =====================
const _figuraData=[
  {d:'Cercar un jardín cuadrado', a:'perimetro'},{d:'Pintar el piso de un cuarto', a:'area'},
  {d:'Poner cinta alrededor de un cuadro', a:'perimetro'},{d:'Alfombrar una habitación', a:'area'},
  {d:'Colocar una valla alrededor de un terreno', a:'perimetro'},{d:'Cubrir una pared con azulejos', a:'area'},
  {d:'Medir el borde de una mesa', a:'perimetro'},{d:'Sembrar césped en todo un patio', a:'area'}
];
let wFigIdx=0, wFigScore=0;
function buildFigura(){ const c=document.getElementById('widget-figura'); if(!c) return; wFigIdx=0; wFigScore=0; showFigura(); }
function showFigura(){ const c=document.getElementById('widget-figura'); if(!c) return; const it=_figuraData[wFigIdx%_figuraData.length]; c.innerHTML=`<div class="wv-card"><div class="wr-desc">🗣️ "${it.d}"</div><div class="wv-q">¿Se calcula el perímetro o el área?</div><div class="wv-opts"><button class="btn btn-pri" onclick="ansFigura('perimetro')">📏 Perímetro</button><button class="btn btn-pri" onclick="ansFigura('area')">🟦 Área</button></div><div class="fb" id="fbFig" role="alert"></div><div style="margin-top:0.5rem;font-size:0.82rem;color:var(--gray);">⚡ Aciertos: <span id="wFigScore">${wFigScore}</span> de 6</div></div>`; }
function ansFigura(o){ const it=_figuraData[wFigIdx%_figuraData.length]; if(o===it.a){ sfx('ok'); wFigScore++; if(wFigScore<=6 && !xpTracker.wFig.has(wFigIdx)){ xpTracker.wFig.add(wFigIdx); pts(2); } fb('fbFig',`¡Correcto! Es ${it.a==='perimetro'?'perímetro (rodea el borde)':'área (cubre la superficie)'}.`,true); } else { sfx('no'); fb('fbFig',`Es ${it.a}. Piensa: ¿rodea el borde o cubre la superficie?`,false); } wFigIdx++; if(wFigScore>=6) fin('s-widgets'); setTimeout(showFigura,1200); }

// ===================== WIDGET: CALCULA PERÍMETRO =====================
let wPerScore=0, wPerCur=null;
function buildWPerimetro(){ const c=document.getElementById('widget-perimetro'); if(!c) return; wPerScore=0; showWPerimetro(); }
function showWPerimetro(){ const c=document.getElementById('widget-perimetro'); if(!c) return; wPerCur=_figRandom(); c.innerHTML=`<div class="wv-card"><div class="wv-deg" style="font-size:1.2rem;">${wPerCur.desc}</div><div class="wv-q">Perímetro (cm):</div><div style="display:flex;gap:0.5rem;justify-content:center;flex-wrap:wrap;align-items:center;"><input type="text" id="wPerIn" inputmode="numeric" class="eval-cp-input" style="max-width:110px;"><button class="btn btn-g" onclick="ansWPerimetro()">✅</button></div><div class="fb" id="fbWPer" role="alert"></div><div style="margin-top:0.5rem;font-size:0.82rem;color:var(--gray);">📏 Aciertos: <span id="wPerScore">${wPerScore}</span> de 6</div></div>`; }
function ansWPerimetro(){ if(!wPerCur) return; const ok=_isIntMatch(document.getElementById('wPerIn').value,wPerCur.per); if(ok){ sfx('ok'); wPerScore++; if(wPerScore<=6 && !xpTracker.wPer.has(wPerScore)){ xpTracker.wPer.add(wPerScore); pts(2); } fb('fbWPer',`¡Correcto! Perímetro = ${wPerCur.per} cm.`,true); if(wPerScore>=6) fin('s-widgets'); setTimeout(showWPerimetro,1100); } else { sfx('no'); fb('fbWPer',`El perímetro es ${wPerCur.per} cm.`,false); const s=document.getElementById('wPerScore'); if(s) s.textContent=wPerScore; setTimeout(showWPerimetro,1500); } }

// ===================== WIDGET: CALCULA ÁREA =====================
let wAreScore=0, wAreCur=null;
function buildWArea(){ const c=document.getElementById('widget-area'); if(!c) return; wAreScore=0; showWArea(); }
function showWArea(){ const c=document.getElementById('widget-area'); if(!c) return; wAreCur=_figRandom(); c.innerHTML=`<div class="wv-card"><div class="wv-deg" style="font-size:1.2rem;">${wAreCur.desc}</div><div class="wv-q">Área (cm²):</div><div style="display:flex;gap:0.5rem;justify-content:center;flex-wrap:wrap;align-items:center;"><input type="text" id="wAreIn" inputmode="numeric" class="eval-cp-input" style="max-width:110px;"><button class="btn btn-g" onclick="ansWArea()">✅</button></div><div class="fb" id="fbWAre" role="alert"></div><div style="margin-top:0.5rem;font-size:0.82rem;color:var(--gray);">🟦 Aciertos: <span id="wAreScore">${wAreScore}</span> de 6</div></div>`; }
function ansWArea(){ if(!wAreCur) return; const ok=_isIntMatch(document.getElementById('wAreIn').value,wAreCur.area); if(ok){ sfx('ok'); wAreScore++; if(wAreScore<=6 && !xpTracker.wAre.has(wAreScore)){ xpTracker.wAre.add(wAreScore); pts(2); } fb('fbWAre',`¡Correcto! Área = ${wAreCur.area} cm².`,true); if(wAreScore>=6) fin('s-widgets'); setTimeout(showWArea,1100); } else { sfx('no'); fb('fbWAre',`El área es ${wAreCur.area} cm².`,false); const s=document.getElementById('wAreScore'); if(s) s.textContent=wAreScore; setTimeout(showWArea,1500); } }

// ===================== RETO FINAL =====================
const retoPairs=[
  {
    name:'Compara perímetros 📏', hint:'Calcula el perímetro A y compáralo con B',
    pool:[
      {w:'A: perímetro de cuadrado lado 6 vs B: 20',t:'mayor'},{w:'A: perímetro de cuadrado lado 5 vs B: 20',t:'igual'},{w:'A: perímetro de cuadrado lado 4 vs B: 20',t:'menor'},
      {w:'A: perímetro de rectángulo 8×4 vs B: 24',t:'igual'},{w:'A: perímetro de rectángulo 10×5 vs B: 24',t:'mayor'},{w:'A: perímetro de rectángulo 5×3 vs B: 24',t:'menor'},
      {w:'A: perímetro de cuadrado lado 7 vs B: 28',t:'igual'},{w:'A: perímetro de rectángulo 9×3 vs B: 20',t:'mayor'},{w:'A: perímetro de rectángulo 4×2 vs B: 20',t:'menor'},
      {w:'A: perímetro de cuadrado lado 10 vs B: 40',t:'igual'},{w:'A: perímetro de rectángulo 12×4 vs B: 30',t:'mayor'},{w:'A: perímetro de cuadrado lado 3 vs B: 20',t:'menor'}
    ]
  },
  {
    name:'Compara áreas 🟦', hint:'Calcula el área A y compárala con B',
    pool:[
      {w:'A: área de cuadrado lado 5 vs B: 20',t:'mayor'},{w:'A: área de rectángulo 6×4 vs B: 24',t:'igual'},{w:'A: área de rectángulo 4×4 vs B: 20',t:'menor'},
      {w:'A: área de cuadrado lado 6 vs B: 36',t:'igual'},{w:'A: área de rectángulo 8×5 vs B: 30',t:'mayor'},{w:'A: área de rectángulo 3×5 vs B: 20',t:'menor'},
      {w:'A: área de cuadrado lado 4 vs B: 16',t:'igual'},{w:'A: área de rectángulo 9×4 vs B: 30',t:'mayor'},{w:'A: área de cuadrado lado 3 vs B: 12',t:'menor'},
      {w:'A: área de rectángulo 7×4 vs B: 28',t:'igual'},{w:'A: área de cuadrado lado 8 vs B: 50',t:'mayor'},{w:'A: área de rectángulo 2×6 vs B: 20',t:'menor'}
    ]
  },
  {
    name:'Perímetro vs área 🔲', hint:'Calcula lo que pide A y compáralo con B',
    pool:[
      {w:'A: perímetro de cuadrado lado 5 vs B: área de cuadrado lado 5',t:'menor'},{w:'A: perímetro de cuadrado lado 4 vs B: área de cuadrado lado 4',t:'igual'},{w:'A: perímetro de cuadrado lado 3 vs B: área de cuadrado lado 3',t:'mayor'},
      {w:'A: área de rectángulo 6×4 vs B: perímetro de rectángulo 6×4',t:'mayor'},{w:'A: perímetro de rectángulo 2×2 vs B: área de rectángulo 2×2',t:'mayor'},{w:'A: área de cuadrado lado 6 vs B: perímetro de cuadrado lado 6',t:'mayor'},
      {w:'A: perímetro de cuadrado lado 4 vs B: 16',t:'igual'},{w:'A: área de cuadrado lado 4 vs B: 16',t:'igual'},{w:'A: perímetro de rectángulo 5×3 vs B: área de rectángulo 5×3',t:'igual'},
      {w:'A: área de rectángulo 10×2 vs B: perímetro de rectángulo 10×2',t:'menor'},{w:'A: perímetro de cuadrado lado 10 vs B: área de cuadrado lado 5',t:'mayor'},{w:'A: perímetro de cuadrado lado 2 vs B: área de cuadrado lado 4',t:'menor'}
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
      if(_fb){ const labels={mayor:'A es MAYOR que B',menor:'A es MENOR que B',igual:'A es IGUAL a B'}; _fb.textContent=`En ${retoCurrent.w}: ${labels[retoCurrent.t]}`; _fb.className='fb show err'; setTimeout(()=>_fb.classList.remove('show'),2000); }
    }
    document.getElementById('retoScore').textContent=`✔ ${retoOk} correctas | ✗ ${retoErr} errores`; showRetoWord();
}
function endReto(){ retoRunning=false; document.getElementById('retoWord').textContent='🏁 ¡Tiempo!'; document.getElementById('retoTimer').style.color='var(--pri)'; xpTracker.reto.add(1); const total=retoOk+retoErr; const pct=total>0?Math.round((retoOk/total)*100):0; fb('fbReto',`Resultado: ${retoOk}/${total} (${pct}%) ¡Bien hecho! Prueba otra pareja con 🔀`,true); fin('s-reto'); sfx('fan'); unlockAchievement('reto_hero'); }
function resetReto(){ sfx('click'); clearInterval(retoTimerInt); retoRunning=false; retoSec=30; retoOk=0; retoErr=0; document.getElementById('retoTimer').textContent='⏱ 30'; document.getElementById('retoTimer').style.color='var(--pri)'; document.getElementById('retoWord').textContent='¡Prepárate!'; document.getElementById('retoScore').textContent='✔ 0 correctas | ✗ 0 errores'; document.getElementById('fbReto').classList.remove('show'); }

// ===================== GENERADOR DE TAREAS =====================
function _tgRint(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
function _tgLines(n){ let s=''; for(let i=0;i<n;i++) s+='<div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.4rem;height:1.3rem;">&nbsp;</div>'; return s; }
function _tgTask(out,i,inner){ const div=document.createElement('div'); div.className='tg-task'; div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content">${inner}</div>`; out.appendChild(div); }
function _instrBlock(out,title,lines){ const ib=document.createElement('div'); ib.className='tg-instruction-block'; ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join(''); out.appendChild(ib); }
const pensamientoTaskDB=[
  {q:'Luis dice: "el perímetro de un cuadrado de lado 5 es 25". ¿Tiene razón? Explica.',ans:'No. 25 es el ÁREA (5 × 5). El perímetro es 4 × 5 = 20.',type:'🔎 Detectar error'},
  {q:'Un cuadrado tiene perímetro 20 cm. ¿Cuánto mide cada lado? Explica.',ans:'5 cm, porque 20 ÷ 4 = 5.',type:'🕵️ Figura misteriosa'},
  {q:'¿Pueden dos figuras distintas tener el mismo perímetro pero diferente área? Da un ejemplo.',ans:'Sí. Un cuadrado 4×4 (P=16, A=16) y un rectángulo 6×2 (P=16, A=12): igual perímetro, distinta área.',type:'🧠 Razonar'},
  {q:'Dibuja un rectángulo de área 12 cm² y escribe sus posibles medidas.',ans:'Respuesta variable: 6×2, 4×3, 12×1 (todos con área 12).',type:'✏️ Crear figura'},
  {q:'Explica por qué el área lleva el pequeño ² y el perímetro no.',ans:'El área combina dos medidas (base y altura), por eso es "cuadrada" (cm²). El perímetro suma lados, es lineal (cm).',type:'🧠 Razonar'},
  {q:'¿Qué necesita más pintura: cubrir un cuadrado de lado 5 o uno de lado 6? Justifica con el área.',ans:'El de lado 6: su área es 36 cm², mayor que 25 cm² del de lado 5.',type:'🧠 Comparar'}
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
function genTask(){ sfx('click'); const type=document.getElementById('tgType').value; const count=parseInt(document.getElementById('tgCount').value); ansVisible=false; const out=document.getElementById('tgOut'); out.innerHTML=''; if(type==='perimetro') genPerimetroTask(out,count); else if(type==='area') genAreaTask(out,count); else if(type==='mixto') genMixtoTask(out,count); else if(type==='problemas') genProblemasTask(out,count); else if(type==='pensamiento') genPensamientoTask(out,count); fin('s-tareas'); }
function _tgFig(){ if(Math.random()<0.5){ const l=_tgRint(3,20); return {desc:`Cuadrado de lado ${l} cm`, per:_perimCuad(l), area:_areaCuad(l), fPer:`4 × ${l}`, fAre:`${l} × ${l}`}; } const b=_tgRint(3,20), h=_tgRint(2,15); return {desc:`Rectángulo de ${b} cm × ${h} cm`, per:_perimRect(b,h), area:_areaRect(b,h), fPer:`2 × (${b} + ${h})`, fAre:`${b} × ${h}`}; }
function genPerimetroTask(out,count){
  _instrBlock(out,'Instrucción — Perímetro',['Calcula el perímetro de cada figura y escribe las unidades (cm).','<strong>Cuadrado:</strong> P = 4 × lado · <strong>Rectángulo:</strong> P = 2 × (base + altura)']);
  for(let i=0;i<count;i++){ const f=_tgFig(); _tgTask(out,i,`<strong>Perímetro de: ${f.desc}</strong>${_tgLines(1)}<div class="tg-answer">✔ ${f.fPer} = ${f.per} cm</div>`); }
}
function genAreaTask(out,count){
  _instrBlock(out,'Instrucción — Área',['Calcula el área de cada figura y escribe las unidades cuadradas (cm²).','<strong>Cuadrado:</strong> A = lado × lado · <strong>Rectángulo:</strong> A = base × altura']);
  for(let i=0;i<count;i++){ const f=_tgFig(); _tgTask(out,i,`<strong>Área de: ${f.desc}</strong>${_tgLines(1)}<div class="tg-answer">✔ ${f.fAre} = ${f.area} cm²</div>`); }
}
function genMixtoTask(out,count){
  _instrBlock(out,'Instrucción — Perímetro y área',['Para cada figura calcula el perímetro (cm) y el área (cm²).','<strong>No olvides</strong> las unidades: el área lleva ².']);
  for(let i=0;i<count;i++){ const f=_tgFig(); _tgTask(out,i,`<strong>${f.desc}: perímetro y área</strong>${_tgLines(2)}<div class="tg-answer">✔ P = ${f.fPer} = ${f.per} cm · A = ${f.fAre} = ${f.area} cm²</div>`); }
}
function genProblemasTask(out,count){
  _instrBlock(out,'Instrucción — Problemas de figuras',['Lee cada problema, decide si pide perímetro o área y resuelve.','<strong>Pista:</strong> "cercar/rodear/borde" = perímetro; "cubrir/pintar/alfombrar" = área.']);
  const NAMES=['Ana','Luis','Marta','José','Carmen','Pedro'];
  for(let i=0;i<count;i++){
    const n=NAMES[_tgRint(0,NAMES.length-1)];
    if(i%2===0){ const l=_tgRint(4,15); _tgTask(out,i,`<strong>${n} quiere cercar un patio cuadrado de lado ${l} m. ¿Cuántos metros de cerca necesita?</strong>${_tgLines(1)}<div class="tg-answer">✔ Perímetro: 4 × ${l} = ${4*l} m</div>`); }
    else{ const b=_tgRint(4,15), h=_tgRint(3,10); _tgTask(out,i,`<strong>${n} va a alfombrar un cuarto rectangular de ${b} m × ${h} m. ¿Cuántos m² de alfombra necesita?</strong>${_tgLines(1)}<div class="tg-answer">✔ Área: ${b} × ${h} = ${b*h} m²</div>`); }
  }
}
function toggleAns(){ ansVisible=!ansVisible; document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none'); sfx('click'); }

// ===================== SOPA DE LETRAS =====================
const _SOPA_ALPHA='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function _buildSopaGrid(size, words){
  const DIRS=[[0,1],[1,0],[1,1],[1,-1],[0,-1],[-1,0],[-1,-1],[-1,1]];
  for(let attempt=0; attempt<80; attempt++){
    const grid=Array.from({length:size},()=>Array(size).fill(''));
    const placed={}; let ok=true;
    const sorted=[...words].sort((a,b)=>b.length-a.length);
    for(const w of sorted){
      let done=false;
      for(let t=0;t<400 && !done;t++){
        const d=DIRS[_rint(0,DIRS.length-1)];
        const r0=_rint(0,size-1), c0=_rint(0,size-1);
        const rEnd=r0+d[0]*(w.length-1), cEnd=c0+d[1]*(w.length-1);
        if(rEnd<0||rEnd>=size||cEnd<0||cEnd>=size) continue;
        let fits=true; const cells=[];
        for(let i=0;i<w.length;i++){ const r=r0+d[0]*i, c=c0+d[1]*i; const cur=grid[r][c]; if(cur!==''&&cur!==w[i]){ fits=false; break; } cells.push([r,c]); }
        if(!fits) continue;
        for(let i=0;i<w.length;i++){ grid[cells[i][0]][cells[i][1]]=w[i]; }
        placed[w]={w, cells}; done=true;
      }
      if(!done){ ok=false; break; }
    }
    if(!ok) continue;
    for(let r=0;r<size;r++) for(let c=0;c<size;c++) if(grid[r][c]==='') grid[r][c]=_SOPA_ALPHA[_rint(0,25)];
    return {size, grid, words: words.map(w=>placed[w])};
  }
  const grid=Array.from({length:size},()=>Array(size).fill('')); const wordsOut=[];
  words.forEach((w,idx)=>{ const r=idx%size; const cells=[]; for(let i=0;i<w.length&&i<size;i++){ grid[r][i]=w[i]; cells.push([r,i]); } wordsOut.push({w,cells}); });
  for(let r=0;r<size;r++) for(let c=0;c<size;c++) if(grid[r][c]==='') grid[r][c]=_SOPA_ALPHA[_rint(0,25)];
  return {size, grid, words: wordsOut};
}
const _sopaWordSets=[
  ['PERIMETRO','AREA','CUADRADO','RECTANGULO','LADO','BASE','ALTURA','FORMULA'],
  ['CONTORNO','SUPERFICIE','MEDIDA','LADOS','ANCHO','LARGO','CUADRADA','SUMA']
];
let sopaSets=_sopaWordSets.map(ws=>_buildSopaGrid(12,ws));
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
  {q:'El perímetro es la suma de todos los lados.',a:true},
  {q:'El área se mide en centímetros lineales (cm).',a:false},
  {q:'El perímetro de un cuadrado es 4 × lado.',a:true},
  {q:'El área de un rectángulo es base × altura.',a:true},
  {q:'Un cuadrilátero tiene cinco lados.',a:false},
  {q:'El cuadrado tiene sus cuatro lados iguales.',a:true},
  {q:'El área se expresa en unidades cuadradas (cm²).',a:true},
  {q:'Para cercar un terreno se calcula el área.',a:false},
  {q:'El perímetro de un rectángulo de 6 × 4 es 20 cm.',a:true},
  {q:'El área de un cuadrado de lado 5 es 20 cm².',a:false}
];
const evalMCBank=[
  {q:'¿Cuál es el perímetro de un cuadrado de lado 7 cm?',o:['a) 49 cm','b) 28 cm','c) 14 cm','d) 21 cm'],a:1},
  {q:'¿Cuál es el área de un cuadrado de lado 7 cm?',o:['a) 28 cm²','b) 14 cm²','c) 49 cm²','d) 42 cm²'],a:2},
  {q:'¿Cuál es el área de un rectángulo de 9 × 4?',o:['a) 36 cm²','b) 26 cm²','c) 13 cm²','d) 18 cm²'],a:0},
  {q:'¿Cuál es el perímetro de un rectángulo de 9 × 4?',o:['a) 36 cm','b) 26 cm','c) 13 cm','d) 18 cm'],a:1},
  {q:'¿En qué unidad se mide el perímetro?',o:['a) cm²','b) cm','c) litros','d) grados'],a:1},
  {q:'Para pintar el piso de un cuarto se calcula:',o:['a) el perímetro','b) el área','c) el volumen','d) la altura'],a:1},
  {q:'La fórmula del perímetro del rectángulo es:',o:['a) base × altura','b) 2 × (base + altura)','c) 4 × lado','d) lado × lado'],a:1},
  {q:'Un cuadrilátero tiene:',o:['a) 3 lados','b) 4 lados','c) 5 lados','d) 6 lados'],a:1}
];
const evalCPBank=[
  {q:'La medida del contorno de una figura es el ___.',a:'perímetro',acc:['perimetro','el perimetro']},
  {q:'La superficie de una figura es el ___.',a:'área',acc:['area','el area']},
  {q:'El perímetro de un cuadrado es 4 × ___.',a:'lado',acc:['lado','el lado']},
  {q:'El área de un rectángulo es base × ___.',a:'altura',acc:['altura','la altura']},
  {q:'El área se mide en unidades ___.',a:'cuadradas',acc:['cuadradas','cuadrada']},
  {q:'Un cuadrilátero tiene ___ lados.',a:'cuatro',acc:['cuatro','4']},
  {q:'El perímetro de un cuadrado de lado 5 es ___ cm.',a:'20',acc:['20','veinte']},
  {q:'El área de un cuadrado de lado 5 es ___ cm².',a:'25',acc:['25','veinticinco']}
];
const evalPRBank=[
  {term:'Perímetro',def:'Medida del contorno (suma de los lados)'},
  {term:'Área',def:'Medida de la superficie'},
  {term:'Cuadrado',def:'Cuadrilátero de 4 lados iguales'},
  {term:'Rectángulo',def:'Cuadrilátero con base y altura distintas'},
  {term:'P = 4 × lado',def:'Fórmula del perímetro del cuadrado'},
  {term:'A = base × altura',def:'Fórmula del área del rectángulo'}
];
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
  _evalFormaSelector(); const _selF = document.getElementById('evalFormaSel'); if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10))); const cf = evalFormNum; const rng = _evalRng(cf); window._currentEvalForm=cf; evalFormNum = (evalFormNum % EVAL_FORMAS) + 1; _evalFormaSelector(); saveProgress();
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
function _normTxt(s){ return (s||'').toString().trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9ñ ]/gi,'').replace(/\s+/g,' ').trim(); }
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
const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación Perímetro y Área de Cuadriláteros · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:12pt;color:#111;background:#fff;padding:4mm 6mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.5rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;color:#1565c0;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:#1565c0;margin-top:0.15rem;font-weight:700;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.5rem 0 0.25rem;border-left:4px solid #1565c0;background:#e3f2fd;display:flex;justify-content:space-between;align-items:center;color:#1565c0;}.qn{font-weight:700;min-width:22px;flex-shrink:0;color:#1565c0;}.tf-row{display:flex;align-items:flex-start;gap:0.3rem;font-size:10.5pt;line-height:1.4;padding:0.25rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:42px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.2rem;margin-top:0.2rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.28rem 0.45rem;margin-bottom:0.22rem;break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.4;display:flex;gap:0.3rem;margin-bottom:0.18rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.22rem 0.55rem;}.mc-opts{display:grid;grid-template-columns:repeat(3,1fr);gap:0.08rem 0.25rem;margin-left:1.3rem;}.mc-opt{font-size:9.5pt;display:flex;align-items:center;gap:0.22rem;}.mc-opt input{width:12px;height:12px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.4;padding:0.22rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:130px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{break-inside:avoid;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.2rem 0.5rem;margin-top:0.15rem;}.pr-head{font-size:9pt;font-weight:700;color:#1565c0;margin-bottom:0.2rem;}.pr-item{font-size:10pt;padding:0.22rem 0.32rem;background:#e3f2fd;border-radius:3px;margin-bottom:0.12rem;display:flex;align-items:center;gap:0.22rem;line-height:1.2;}.pr-num{font-weight:700;color:#1565c0;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #1565c0;padding-bottom:0.35rem;margin-bottom:0.5rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;color:#1565c0;}.p-sub{font-size:9pt;color:#1565c0;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #cce0ff;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;color:#1565c0;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#1565c0;}.pa{color:#007a00;font-weight:700;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:#1565c0;font-weight:700;font-style:italic;}.obt-lbl{font-weight:700;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #1565c0;height:12px;}.obt-pct{font-weight:700;}.total-row{display:flex;align-items:baseline;justify-content:flex-end;gap:7px;font-size:11pt;color:#1565c0;font-weight:700;font-style:italic;margin-top:0.4rem;padding:0.2rem 0.5rem;background:#e3f2fd;border-radius:4px;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #1565c0;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · Misión Perímetro y Área de Cuadriláteros · Matemática</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 4 secciones × 5 preguntas × 5 pts c/u · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✔ PAUTA DOCENTE — Evaluación Final · Perímetro y Área de Cuadriláteros · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">100 pts | 4 secciones × 5 preguntas × 5 pts | Matemáticas II Ciclo</div></div><div class="p-grid">${pR}</div>
  ${zgBlock}</div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("evalPage",252,0.55,1.45);fit("pautaPage",252,0.55,1.3);})();<\/script></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(doc); win.document.close(); setTimeout(()=>win.print(),400);
}

// ===================== EXPLICA =====================
const explicaData = [
  {
    q: 'Explica la diferencia entre perímetro y área con un ejemplo.',
    hint: '💡 Pista: uno mide el borde, el otro la superficie.',
    rubric: ['✓ El perímetro es el contorno (suma de lados), en cm', '✓ El área es la superficie, en cm²', '✓ Da un ejemplo con una figura concreta'],
    suggested: 'El perímetro es el contorno de la figura (se suman los lados), y se mide en cm. El área es la superficie que cubre, y se mide en cm². Por ejemplo, un cuadrado de lado 5: perímetro = 20 cm, área = 25 cm².'
  },
  {
    q: 'Explica cómo calcular el perímetro de un rectángulo de 7 cm × 3 cm.',
    hint: '💡 Pista: usa P = 2 × (base + altura).',
    rubric: ['✓ Suma base y altura: 7 + 3 = 10', '✓ Multiplica por 2: 2 × 10 = 20', '✓ El perímetro es 20 cm'],
    suggested: 'Sumo la base y la altura: 7 + 3 = 10. Luego multiplico por 2 (porque hay dos de cada uno): 2 × 10 = 20 cm.'
  },
  {
    q: 'Explica por qué el área se mide en unidades cuadradas (cm²) y el perímetro no.',
    hint: '💡 Pista: piensa cuántas medidas combina cada una.',
    rubric: ['✓ El área multiplica dos medidas (base y altura)', '✓ Por eso es "cuadrada" y lleva ²', '✓ El perímetro solo suma lados (lineal, cm)'],
    suggested: 'El área multiplica dos medidas (base × altura), por eso resulta "cuadrada" y se escribe con ² (cm²). El perímetro solo suma longitudes, así que es lineal y se mide en cm.'
  },
  {
    q: 'Un cuadrado tiene perímetro 24 cm. Explica cómo hallar su lado y su área.',
    hint: '💡 Pista: divide el perímetro entre 4.',
    rubric: ['✓ Lado = 24 ÷ 4 = 6 cm', '✓ Área = lado × lado = 6 × 6', '✓ Área = 36 cm²'],
    suggested: 'Como P = 4 × lado, el lado es 24 ÷ 4 = 6 cm. Luego el área es lado × lado = 6 × 6 = 36 cm².'
  },
  {
    q: 'Explica por qué dos figuras pueden tener el mismo perímetro pero distinta área.',
    hint: '💡 Pista: prueba un cuadrado 4×4 y un rectángulo 6×2.',
    rubric: ['✓ Da dos figuras con igual perímetro', '✓ Muestra que sus áreas son distintas', '✓ Concluye que perímetro y área son medidas independientes'],
    suggested: 'Un cuadrado 4×4 tiene P = 16 y A = 16. Un rectángulo 6×2 también tiene P = 16, pero A = 12. Igual contorno, distinta superficie: son medidas independientes.'
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

// ===================== PRUEBA OPERATIVA =====================
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
let _opRnd = Math.random;
function _opRint(min, max) { return Math.floor(_opRnd() * (max - min + 1)) + min; }
function _fmtNum(n) { return n.toLocaleString('en-US'); }
function _isIntMatch(student, expectedNum) {
  const raw = (student || '').toString().trim().replace(/[,\s]/g, '');
  if (!raw) return false;
  const n = parseInt(raw, 10);
  return !isNaN(n) && n === expectedNum;
}
function _opFig(){ if(_opRnd()<0.5){ const l=_opRint(3,15); return {tipo:'cuadrado', desc:`cuadrado de lado ${l} cm`, per:_perimCuad(l), area:_areaCuad(l)}; } const b=_opRint(3,15), h=_opRint(2,12); return {tipo:'rectángulo', desc:`rectángulo de ${b} cm × ${h} cm`, per:_perimRect(b,h), area:_areaRect(b,h)}; }
// I. Perímetro y área (5 × 10 = 50 pts)
function genPerAreaItems() {
  const items = [];
  for (let i = 0; i < 5; i++) {
    const f = _opFig();
    if (i % 2 === 0) items.push({ text: `Perímetro de un ${f.desc}`, ansNum: f.per });
    else items.push({ text: `Área de un ${f.desc}`, ansNum: f.area });
  }
  return items;
}
// II. Problemas (5 × 4 = 20 pts)
function genProblemaItems() {
  const items = [];
  const tipos = _shuffleF([0, 1, 2, 3, 4], _opRnd);
  const NAMES = ['Ana', 'Luis', 'Marta', 'José', 'Carmen', 'Pedro'];
  tipos.forEach(tp => {
    const n = NAMES[_opRint(0, NAMES.length - 1)];
    let text, ansNum;
    if (tp === 0) { const l = _opRint(4, 15); text = `${n} cerca un patio cuadrado de lado ${l} m. ¿Cuántos metros de cerca necesita?`; ansNum = _perimCuad(l); }
    else if (tp === 1) { const b = _opRint(4, 12), h = _opRint(3, 9); text = `Un cuarto rectangular mide ${b} m × ${h} m. ¿Cuántos m² de alfombra lo cubren?`; ansNum = _areaRect(b, h); }
    else if (tp === 2) { const l = _opRint(3, 12); text = `Una baldosa cuadrada tiene lado ${l} cm. ¿Cuál es su área?`; ansNum = _areaCuad(l); }
    else if (tp === 3) { const b = _opRint(5, 14), h = _opRint(3, 10); text = `Un jardín rectangular mide ${b} m × ${h} m. ¿Cuántos metros de valla lo rodean?`; ansNum = _perimRect(b, h); }
    else { const l = _opRint(4, 12); text = `Un mantel cuadrado tiene lado ${l} m. ¿Cuánto encaje se necesita para todo su borde?`; ansNum = _perimCuad(l); }
    items.push({ text, ansNum });
  });
  return items;
}
// III. Cadena (5 × 2 = 10 pts)
function genCadenaItems() {
  const items = [];
  for (let i = 0; i < 5; i++) {
    const tp = i % 3;
    if (tp === 0) { const l = _opRint(3, 9); items.push({ text: `Un cuadrado de lado ${l}: suma su perímetro y su área. ¿Cuánto obtienes?`, ansNum: _perimCuad(l) + _areaCuad(l) }); }
    else if (tp === 1) { const b = _opRint(4, 10), h = _opRint(3, 8); items.push({ text: `Un rectángulo ${b} × ${h}: al área réstale el perímetro. ¿Cuánto obtienes?`, ansNum: _areaRect(b, h) - _perimRect(b, h) }); }
    else { const l = _opRint(4, 10); items.push({ text: `Duplica el área de un cuadrado de lado ${l}. ¿Cuánto obtienes?`, ansNum: _areaCuad(l) * 2 }); }
  }
  return items;
}
// IV. Medida escondida (5 × 2 = 10 pts)
function genFaltanteItems() {
  const items = [];
  const forms = [0, 1, 2, 3, _opRint(0, 3)];
  const SQ = [4, 9, 16, 25, 36, 49, 64];
  forms.forEach(f => {
    let expr, ansNum;
    if (f === 0) { const l = _opRint(4, 12); expr = `Un cuadrado de perímetro ${_perimCuad(l)} cm tiene lado ▢`; ansNum = l; }
    else if (f === 1) { const s = SQ[_opRint(0, SQ.length - 1)]; const l = Math.sqrt(s); expr = `Un cuadrado de área ${s} cm² tiene lado ▢`; ansNum = l; }
    else if (f === 2) { const b = _opRint(4, 10), h = _opRint(3, 9); expr = `Un rectángulo de área ${_areaRect(b, h)} cm² y base ${b} tiene altura ▢`; ansNum = h; }
    else { const b = _opRint(4, 10), h = _opRint(3, 9); expr = `Un rectángulo de perímetro ${_perimRect(b, h)} cm y base ${b} tiene altura ▢`; ansNum = h; }
    items.push({ expr, ansNum });
  });
  return items;
}
// V. Perímetro y área de una figura (2 × 5 = 10 pts)
function genFiguraItems() {
  const items = [];
  const b = _opRint(4, 12), h = _opRint(3, 10);
  items.push({ text: `Un rectángulo mide ${b} cm × ${h} cm. Su perímetro es ▢ cm`, ansNum: _perimRect(b, h), extra: `2 × (${b} + ${h})` });
  items.push({ text: `El mismo rectángulo de ${b} cm × ${h} cm. Su área es ▢ cm²`, ansNum: _areaRect(b, h), extra: `${b} × ${h}` });
  return items;
}
function genEvalOp() {
  sfx('click');
  _injectFormaSel('genEvalOp', 'evalOpFormaSel', evalOpFormNum, function (v) { evalOpFormNum = v; });
  const _sO = document.getElementById('evalOpFormaSel');
  if (_sO && parseInt(_sO.value, 10)) evalOpFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sO.value, 10)));
  const cf = evalOpFormNum; window._currentEvalOpForm = cf; _opRnd = _evalRng(100000 + cf); evalOpFormNum = (evalOpFormNum % EVAL_FORMAS) + 1; _injectFormaSel('genEvalOp', 'evalOpFormaSel', evalOpFormNum, function (v) { evalOpFormNum = v; }); saveProgress();
  document.getElementById('evalop-screen-title').textContent = `📐 Prueba Operativa — Forma ${cf} · Perímetro y Área de Cuadriláteros`;
  evalOpAnsVisible = false;
  const out = document.getElementById('evalOpOut'); out.innerHTML = '';

  const paItems = genPerAreaItems();
  const s1 = document.createElement('div');
  s1.innerHTML = '<div class="eval-section-title">I. Perímetro y área <span class="eval-pts">50 pts · 10 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Cuadrado: P = 4 × lado, A = lado × lado · Rectángulo: P = 2 × (base + altura), A = base × altura.</p>';
  paItems.forEach((it, i) => { const d = document.createElement('div'); d.className = 'eval-item eval-auto-item'; d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.text}</span><input class="eval-cp-input" type="text" data-pa="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${_fmtNum(it.ansNum)}</div><div class="eval-item-feedback" id="evalFbPa${i}" aria-live="polite"></div>`; s1.appendChild(d); });
  out.appendChild(s1);

  const prItems = genProblemaItems();
  const s2 = document.createElement('div');
  s2.innerHTML = '<div class="eval-section-title">II. Problemas breves <span class="eval-pts">20 pts · 4 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Decide si el problema pide perímetro o área y resuelve.</p>';
  prItems.forEach((it, i) => { const d = document.createElement('div'); d.className = 'eval-item eval-auto-item'; d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.text}</span><input class="eval-cp-input" type="text" data-pr="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${_fmtNum(it.ansNum)}</div><div class="eval-item-feedback" id="evalFbPr${i}" aria-live="polite"></div>`; s2.appendChild(d); });
  out.appendChild(s2);

  const caItems = genCadenaItems();
  const s3 = document.createElement('div');
  s3.innerHTML = '<div class="eval-section-title">III. Cadena de operaciones <span class="eval-pts">10 pts · 2 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Calcula perímetro y área y luego la operación indicada.</p>';
  caItems.forEach((it, i) => { const d = document.createElement('div'); d.className = 'eval-item eval-auto-item'; d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.text}</span><input class="eval-cp-input" type="text" data-ca="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${_fmtNum(it.ansNum)}</div><div class="eval-item-feedback" id="evalFbCa${i}" aria-live="polite"></div>`; s3.appendChild(d); });
  out.appendChild(s3);

  const faItems = genFaltanteItems();
  const s4 = document.createElement('div');
  s4.innerHTML = '<div class="eval-section-title">IV. ¿Qué medida se esconde en ▢? <span class="eval-pts">10 pts · 2 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Usa las fórmulas al revés (divide o despeja).</p>';
  faItems.forEach((it, i) => { const d = document.createElement('div'); d.className = 'eval-item eval-auto-item'; d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.expr}</span><input class="eval-cp-input" type="text" data-fa="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${_fmtNum(it.ansNum)}</div><div class="eval-item-feedback" id="evalFbFa${i}" aria-live="polite"></div>`; s4.appendChild(d); });
  out.appendChild(s4);

  const fiItems = genFiguraItems();
  const s5 = document.createElement('div');
  s5.innerHTML = '<div class="eval-section-title">V. Perímetro y área de una figura <span class="eval-pts">10 pts · 5 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Recuerda: el perímetro en cm y el área en cm².</p>';
  fiItems.forEach((it, i) => { const d = document.createElement('div'); d.className = 'eval-item eval-auto-item'; d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.text}</span><input class="eval-cp-input" type="text" data-fi="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${_fmtNum(it.ansNum)} (${it.extra})</div><div class="eval-item-feedback" id="evalFbFi${i}" aria-live="polite"></div>`; s5.appendChild(d); });
  out.appendChild(s5);

  window._evalOpData = { paItems, prItems, caItems, faItems, fiItems };
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
  let total = 0; const det = { pa: 0, pr: 0, ca: 0, fa: 0, fi: 0 };
  const _mark = (sel, it, i, key, ptsEach, fbId) => {
    const el = document.querySelector(`[data-${sel}="${i}"]`);
    const ok = _isIntMatch(el ? el.value : '', it.ansNum);
    if (el) { el.classList.toggle('eval-input-ok', ok); el.classList.toggle('eval-input-no', !ok); }
    if (ok) { det[key]++; total += ptsEach; }
    setEvalFeedback(fbId + i, ok, ok ? `Correcto. +${ptsEach} pts` : 'Revisar. R/ ' + _fmtNum(it.ansNum));
  };
  d.paItems.forEach((it, i) => _mark('pa', it, i, 'pa', 10, 'evalFbPa'));
  d.prItems.forEach((it, i) => _mark('pr', it, i, 'pr', 4, 'evalFbPr'));
  d.caItems.forEach((it, i) => _mark('ca', it, i, 'ca', 2, 'evalFbCa'));
  d.faItems.forEach((it, i) => _mark('fa', it, i, 'fa', 2, 'evalFbFa'));
  d.fiItems.forEach((it, i) => _mark('fi', it, i, 'fi', 5, 'evalFbFi'));
  const res = document.getElementById('evalOpAutoResult');
  if (res) { res.className = 'eval-auto-result ' + (total >= 70 ? 'eval-auto-pass' : 'eval-auto-risk'); res.innerHTML = `<strong>Resultado: ${total}/100 pts</strong><br><span>Perím./Área: ${det.pa*10}/50 · Problemas: ${det.pr*4}/20 · Cadena: ${det.ca*2}/10 · Escondido: ${det.fa*2}/10 · Figura: ${det.fi*5}/10</span>`; }
  if (total >= 70) { pts(8); showToast('🎯 Prueba operativa calificada: ' + total + '/100'); }
  else showToast('🧮 Prueba operativa: ' + total + '/100. Revisa los ítems marcados.');
}
function printEvalOp() {
  if (!window._evalOpData) { showToast('⚠️ Genera una prueba operativa primero'); return; }
  sfx('click');
  const forma = window._currentEvalOpForm || 1; const d = window._evalOpData;
  let s1 = `<div class="sec-title"><span>I. Perímetro y área</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 50 pts</span></div></div><p class="opx-instr">Aplica las fórmulas. 10 pts c/u.</p>`;
  d.paItems.forEach((it, i) => { s1 += `<div class="opx-print-row"><span class="qn">${i+1}.</span><span class="prb-text">${it.text}</span><span class="opx-blank"></span></div>`; });
  let s2 = `<div class="sec-title"><span>II. Problemas breves</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Resuelve y escribe la respuesta. 4 pts c/u.</p>`;
  d.prItems.forEach((it, i) => { s2 += `<div class="opx-print-row"><span class="qn">${i+1}.</span><span class="prb-text">${it.text}</span><span class="opx-blank"></span></div>`; });
  const caTbl = (items) => `<table class="rnd-tbl"><tr><th>#</th><th>Cadena de operaciones</th><th>Resultado</th></tr>${items.map((it, i) => `<tr><td>${i+1}</td><td>${it.text.replace(' ¿Cuánto obtienes?','')}</td><td></td></tr>`).join('')}</table>`;
  let s3 = `<div class="sec-title"><span>III. Cadena de operaciones</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10 pts</span></div></div><p class="opx-instr">Resuelve paso a paso. 2 pts c/u.</p>${caTbl(d.caItems)}`;
  const faTbl = (items) => `<table class="rnd-tbl"><tr><th>#</th><th>Enunciado</th><th>▢ =</th></tr>${items.map((it, i) => `<tr><td>${i+1}</td><td>${it.expr}</td><td></td></tr>`).join('')}</table>`;
  let s4 = `<div class="sec-title"><span>IV. ¿Qué medida se esconde en ▢?</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10 pts</span></div></div><p class="opx-instr">Despeja usando las fórmulas. 2 pts c/u.</p>${faTbl(d.faItems)}`;
  const fiTbl = (items) => `<table class="rnd-tbl"><tr><th>#</th><th>Figura</th><th>Resultado</th></tr>${items.map((it, i) => `<tr><td>${i+1}</td><td>${it.text.replace(' es ▢ cm','').replace(' es ▢ cm²','')}</td><td></td></tr>`).join('')}</table>`;
  let s5 = `<div class="sec-title"><span>V. Perímetro y área de una figura</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10 pts</span></div></div><p class="opx-instr">Perímetro en cm, área en cm². 5 pts c/u.</p>${fiTbl(d.fiItems)}`;
  let pR = '';
  pR += `<div class="p-sec"><div class="p-ttl">I. Perímetro y área</div><table class="p-tbl">${d.paItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${_fmtNum(it.ansNum)}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">II. Problemas breves</div><table class="p-tbl">${d.prItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${_fmtNum(it.ansNum)}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">III. Cadena de operaciones</div><table class="p-tbl">${d.caItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${_fmtNum(it.ansNum)}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">IV. Medida escondida</div><table class="p-tbl">${d.faItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">▢ = ${_fmtNum(it.ansNum)}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec" style="grid-column:1/-1;"><div class="p-ttl">V. Perímetro y área de una figura</div><table class="p-tbl">${d.fiItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">▢ = ${_fmtNum(it.ansNum)} · ${it.extra}</td></tr>`).join('')}</table></div>`;
  const doc = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Prueba Operativa Perímetro y Área de Cuadriláteros · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11.5pt;color:#111;background:#fff;padding:4mm 6mm;}.ph{margin-bottom:0.5rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;color:#1565c0;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:#1565c0;margin-top:0.15rem;font-weight:700;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.45rem 0 0.2rem;border-left:4px solid #1565c0;background:#e3f2fd;display:flex;justify-content:space-between;align-items:center;color:#1565c0;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:#1565c0;font-weight:700;font-style:italic;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #1565c0;height:12px;}.qn{font-weight:700;min-width:20px;display:inline-block;color:#1565c0;flex-shrink:0;}.opx-instr{font-size:9pt;color:#555;margin-bottom:0.22rem;}.opx-blank{display:inline-block;width:80px;flex:none;border-bottom:1.5px solid #111;min-height:13px;margin-left:0.3rem;}.opx-print-row{display:flex;align-items:baseline;gap:0.4rem;font-size:10pt;padding:0.24rem 0.1rem;border-bottom:1px dotted #ddd;}.prb-text{flex:1;line-height:1.35;}.rnd-tbl{width:100%;border-collapse:collapse;font-size:9.5pt;margin-top:0.15rem;}.rnd-tbl th,.rnd-tbl td{border:1px solid #bbb;padding:0.16rem 0.35rem;text-align:left;}.rnd-tbl th{background:#e3f2fd;color:#1565c0;font-size:8.5pt;}.total-row{display:flex;align-items:baseline;justify-content:flex-end;gap:7px;font-size:11pt;color:#1565c0;font-weight:700;font-style:italic;margin-top:0.45rem;padding:0.2rem 0.5rem;background:#e3f2fd;border-radius:4px;}.total-row .obt-line{min-width:80px;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #1565c0;padding-bottom:0.3rem;margin-bottom:0.5rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;color:#1565c0;}.p-sub{font-size:9pt;color:#1565c0;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #cce0ff;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;color:#1565c0;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#1565c0;}.pa{color:#007a00;font-weight:700;font-family:'Courier New',monospace;}.forma-tag{position:fixed;bottom:5mm;right:6mm;font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;}@media print{@page{size:letter portrait;margin:8mm 10mm;}}</style></head><body><div class="ph"><h2>Examen de Matemáticas — Prueba Operativa · Perímetro y Área de Cuadriláteros · II Ciclo</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Institución:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 pts · I: 50 · II: 20 · III: 10 · IV: 10 · V: 10 · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div><div class="pauta-wrap"><div class="p-head"><div class="p-main">✔ PAUTA — Prueba Operativa · Perímetro y Área de Cuadriláteros · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">100 pts · Matemáticas II Ciclo</div></div><div class="p-grid">${pR}</div></div><div class="forma-tag">Forma ${forma}</div></body></html>`;
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
  const msgs=['💡 ¡ÁNIMO! Comienza tu misión. ¡Cada paso cuenta!','🌱 ¡GRAN INICIO! Estás dando los primeros pasos.','🔑 ¡BUEN TRABAJO! Vas progresando muy bien.','💪 ¡MUY BIEN! Dominas gran parte del contenido.','🏅 ¡INCREÍBLE avance! Estás cerca de la excelencia.','🎓 ¡EXTRAORDINARIO! Completaste TODA la misión. ¡Eres experto en Perímetro y Área!'];
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
  const txt=`${stars} CONSTANCIA DE LOGRO ${stars}\n\n📚 Misión: Perímetro y Área de Cuadriláteros\n👤 Estudiante: ${name}\n📊 Progreso: ${pct}% completado\n⭐ XP obtenido: ${xp} de ${MXP}${achText?'\n\n🏆 Logros desbloqueados:\n'+achText:''}\n\n${msg}\n\n📅 ${date}\n🏠 Proyecto Educativo M.E.T.A.S\n🌐 policastsapien.com`;
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
  buildMemo();
  buildExplica();
  buildLabPerimetro(); buildLabArea();
  buildFigura(); buildWPerimetro(); buildWArea();
  _retoPairLbl();
  document.addEventListener('click',function(e){ const panel=document.getElementById('achPanel'); const btn=document.getElementById('achBtn'); if(panel.classList.contains('open')&&!panel.contains(e.target)&&e.target!==btn) panel.classList.remove('open'); });
  document.addEventListener('click',function(e){ if(e.target===document.getElementById('diplomaOverlay')) closeDiploma(); });
  const savedName=localStorage.getItem('nombreEstudiantePerimetro');
  const inputName=document.querySelector('.diploma-input');
  if(savedName&&inputName){ inputName.value=savedName; updateDiplomaName(savedName); }
  if(inputName) inputName.addEventListener('input',e=>localStorage.setItem('nombreEstudiantePerimetro',e.target.value));
  fin('s-aprende',false);
  fin('s-tipos',false);
  fin('s-errores',false);
});
(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalOp==='function') _injectFormaSel('genEvalOp','evalOpFormaSel',evalOpFormNum,function(v){evalOpFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();
