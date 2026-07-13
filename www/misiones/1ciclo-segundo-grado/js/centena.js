// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
// Compartir misión por WhatsApp
function compartirMision() {
    const url = window.location.href;
    const texto = `🚀 *Misión Asignada: Números Grandes, del Cien al Millón* 🚀\n\nSube la escalera de los números: aprende a leer, escribir y comparar cifras grandes hasta el millón ¡y más allá! 🏆\n\nDesbloquea *todos los logros* y puedes poner *tus datos* para que tu maestro observe todos tus logros. 📋\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;
    _waShare(texto);
}

// ===================== ACCESIBILIDAD =====================
function toggleLetra() {
  document.body.classList.toggle('letra-grande');
  if(typeof sfx === 'function') sfx('click');
  localStorage.setItem('prefLetraNumerosGrandes', document.body.classList.contains('letra-grande'));
}
window.addEventListener('DOMContentLoaded', () => {
  if(localStorage.getItem('prefLetraNumerosGrandes') === 'true') document.body.classList.add('letra-grande');
});

// ===================== UTILIDADES =====================
const _pick = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
const _shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
function fb(id, msg, isOk) {
  const el = document.getElementById(id);
  if(el) { el.textContent = msg; el.className = 'fb show ' + (isOk ? 'ok' : 'err'); }
}
function _fmtNum(n){ return n.toLocaleString('en-US'); }
// --- Lectura en letras de 0 a 999,999,999 ---
function _w999(n){
  const U=['','uno','dos','tres','cuatro','cinco','seis','siete','ocho','nueve'];
  const T10=['diez','once','doce','trece','catorce','quince','dieciséis','diecisiete','dieciocho','diecinueve'];
  const V=['veinte','veintiuno','veintidós','veintitrés','veinticuatro','veinticinco','veintiséis','veintisiete','veintiocho','veintinueve'];
  const D=['','','veinte','treinta','cuarenta','cincuenta','sesenta','setenta','ochenta','noventa'];
  const C=['','ciento','doscientos','trescientos','cuatrocientos','quinientos','seiscientos','setecientos','ochocientos','novecientos'];
  if(n===0) return '';
  if(n===100) return 'cien';
  let s='';
  const c=Math.floor(n/100), r=n%100;
  if(c) s+=C[c];
  if(r){
    if(s) s+=' ';
    if(r<10) s+=U[r];
    else if(r<20) s+=T10[r-10];
    else if(r<30) s+=V[r-20];
    else { const d=Math.floor(r/10),u=r%10; s+=D[d]+(u?' y '+U[u]:''); }
  }
  return s;
}
// Apócope antes de "mil" y "millones": veintiuno→veintiún, uno→un
function _apoc(s){ return s.replace(/veintiuno$/,'veintiún').replace(/uno$/,'un'); }
function numToWords(n){
  n=Math.floor(Math.abs(n));
  if(n===0) return 'cero';
  const mi=Math.floor(n/1000000), ml=Math.floor((n%1000000)/1000), un=n%1000;
  const partes=[];
  if(mi) partes.push(mi===1?'un millón':_apoc(_w999(mi))+' millones');
  if(ml) partes.push(ml===1?'mil':_apoc(_w999(ml))+' mil');
  if(un) partes.push(_w999(un));
  return partes.join(' ');
}

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY = 'matematica_numeros_grandes_v2';
let xp = 0, MXP = 200, done = new Set(), evalAnsVisible = false;
let evalFormNum = 1, evalOpFormNum = 1, evalOpAnsVisible = false, unlockedAch = [], darkMode = false, prevLevel = 0;
const TOTAL_SECTIONS = 16;
const xpTracker = { fc: new Set(), qz: new Set(), cls: new Set(), id: new Set(), cmp: new Set(), reto: new Set(), sopa: new Set(), predice: new Set(), explica: new Set(), memo: new Set() };

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
  nivel3:{icon:'🔭',label:'¡Explorador de Miles alcanzado!'},
  nivel5:{icon:'🔥',label:'¡Millonario alcanzado!'}
};
function unlockAchievement(id){ if(unlockedAch.includes(id)) return; unlockedAch.push(id); sfx('ach'); showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label); launchConfetti(); renderAchPanel(); saveProgress(); }
function renderAchPanel(){ const list=document.getElementById('achList'); list.innerHTML=''; Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{ const div=document.createElement('div'); div.className='ach-item'+(unlockedAch.includes(id)?'':' locked'); div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`; list.appendChild(div); }); }
function toggleAchPanel(){ sfx('click'); document.getElementById('achPanel').classList.toggle('open'); }
function showToast(msg){ let t=document.querySelector('.toast'); if(!t){ t=document.createElement('div'); t.className='toast'; document.body.appendChild(t); } t.textContent=msg; t.style.display='block'; clearTimeout(t._tid); t._tid=setTimeout(()=>t.style.display='none',3200); }
function launchConfetti(){ const colors=['#1565c0','#00838f','#00b894','#fdcb6e','#6c5ce7']; for(let i=0;i<60;i++){ const c=document.createElement('div'); c.className='confetti-piece'; c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`; document.body.appendChild(c); c.addEventListener('animationend',()=>c.remove()); } }

// ===================== XP =====================
const lvls=[{t:0,n:'Novato ✏️'},{t:25,n:'Contador de Cientos 💯'},{t:55,n:'Explorador de Miles 🔭'},{t:90,n:'Escalador 🪜'},{t:130,n:'Casi Millonario 📊'},{t:165,n:'Millonario 🔥'},{t:190,n:'Maestro del Millón 🎓'}];
function pts(n){ xp=Math.max(0,Math.min(MXP,xp+n)); updateXPBar(); saveProgress(); }
function updateXPBar(){ const pct=Math.round((xp/MXP)*100); document.getElementById('xpFill').style.width=pct+'%'; const el=document.getElementById('xpPts'); el.textContent='⭐ '+xp; el.style.transform='scale(1.3)'; setTimeout(()=>el.style.transform='',300); let lv=0; for(let i=0;i<lvls.length;i++) if(xp>=lvls[i].t) lv=i; document.getElementById('xpLvl').textContent=lvls[lv].n; if(lv!==prevLevel){ if(lv>=2) unlockAchievement('nivel3'); if(lv>=5) unlockAchievement('nivel5'); prevLevel=lv; } }
function resetXP(){ sfx('click'); xp=0; updateXPBar(); showToast('🔄 XP reiniciado a 0'); }
function fin(id,showFX=true){ if(!done.has(id)){ done.add(id); const b=document.querySelector(`[data-s="${id}"]`); if(b) b.classList.add('done'); if(showFX){ sfx('up'); launchConfetti(); } saveProgress(); } }

// ===================== NAV =====================
function go(id){ sfx('click'); document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active')); document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{ b.classList.remove('active'); b.setAttribute('aria-selected','false'); }); document.getElementById(id).classList.add('active'); const btn=document.querySelector(`[data-s="${id}"]`); if(btn){ btn.classList.add('active'); btn.setAttribute('aria-selected','true'); } window.scrollTo({top:0,behavior:'smooth'}); if(id==='s-sopa') setTimeout(buildSopa,50); }

// ===================== FLASHCARD DATA =====================
const fcData=[
  {w:'Unidad',a:'el peldaño 1 de la escalera: vale <strong>1</strong>. con diez unidades se forma una decena.'},
  {w:'Decena',a:'grupo de <strong>10 unidades</strong>. diez decenas forman una centena.'},
  {w:'Centena',a:'grupo de <strong>100 unidades</strong>: 10 decenas. diez centenas forman un millar.'},
  {w:'Unidad de millar',a:'vale <strong>1,000</strong>: diez centenas juntas. aquí aparece la primera coma.'},
  {w:'Decena de millar',a:'vale <strong>10,000</strong>: diez millares juntos.'},
  {w:'Centena de millar',a:'vale <strong>100,000</strong>: ¡el peldaño justo antes del millón!'},
  {w:'Millón',a:'<strong>1,000,000</strong>: un 1 con seis ceros. equivale a mil miles.'},
  {w:'Período',a:'bloque de <strong>3 cifras</strong> separado por comas: unidades, miles y millones.'},
  {w:'La coma',a:'separa los períodos <strong>cada 3 cifras</strong>, contando desde la derecha.'},
  {w:'Valor posicional',a:'lo que vale una cifra <strong>según su lugar</strong>: el 5 en 50,000 vale cincuenta mil.'},
  {w:'¿Cien o ciento?',a:'100 solo se lee <strong>cien</strong>; con más cifras se usa <strong>ciento</strong>: 105 = ciento cinco.'},
  {w:'Mil',a:'1,000 se lee <strong>mil</strong>, nunca "un mil". pero sí decimos "un millón".'},
  {w:'Ceros de relleno',a:'guardan el lugar de una posición vacía: trescientos cuatro mil = <strong>304,000</strong>.'},
  {w:'El mayor de 6 cifras',a:'<strong>999,999</strong>: novecientos noventa y nueve mil novecientos noventa y nueve. su siguiente es el millón.'}
];
let fcIdx=0;
function upFC(){ document.getElementById('fcInner').classList.remove('flipped'); document.getElementById('fcW').textContent=fcData[fcIdx].w; document.getElementById('fcA').innerHTML=fcData[fcIdx].a; document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length; }
function flipCard(){ sfx('flip'); document.getElementById('fcInner').classList.toggle('flipped'); if(!xpTracker.fc.has(fcIdx)){ xpTracker.fc.add(fcIdx); pts(1); } if(xpTracker.fc.size===fcData.length){ fin('s-flash'); unlockAchievement('flash_master'); } }
function nextFC(){ sfx('click'); fcIdx=(fcIdx+1)%fcData.length; upFC(); }
function prevFC(){ sfx('click'); fcIdx=(fcIdx-1+fcData.length)%fcData.length; upFC(); }

// ===================== JUEGO: MEMORIA DE LOS NÚMEROS =====================
const memoPairs=[
  {id:'decena',t:'Decena',d:'🔟 grupo de 10 unidades'},
  {id:'centena',t:'Centena',d:'💯 10 decenas = 100'},
  {id:'millar',t:'Millar',d:'🧱 1,000 = diez centenas'},
  {id:'millon',t:'Millón',d:'💰 un 1 con 6 ceros'},
  {id:'periodo',t:'Período',d:'📦 bloque de 3 cifras entre comas'},
  {id:'valor',t:'Valor posicional',d:'📍 el 7 en 70,000 vale setenta mil'}
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
  {q:'¿Cómo se lee el número 4,500?',o:['a) Cuarenta y cinco','b) Cuatro mil quinientos','c) Cuatrocientos cincuenta','d) Cuatro millones quinientos'],c:1,feedback:'La coma marca el período de miles: 4 mil + 500 = cuatro mil quinientos.'},
  {q:'¿Cuántas cifras tiene un millón (1,000,000)?',o:['a) 6 cifras','b) 5 cifras','c) 7 cifras','d) 9 cifras'],c:2,feedback:'Un 1 y seis ceros: 7 cifras en total. ¡Cuéntalas!'},
  {q:'¿Cuál es el valor del 8 en 80,000?',o:['a) 8','b) 800','c) 8,000','d) 80,000'],c:3,feedback:'El 8 está en las decenas de millar: vale 8 × 10,000 = 80,000.'},
  {q:'"Trescientos cinco mil" se escribe:',o:['a) 3,005','b) 305,000','c) 350,000','d) 30,500'],c:1,feedback:'El cero de relleno guarda las decenas de millar: 305,000. Sin él, el 3 cambiaría de valor.'},
  {q:'¿Qué separa la coma en un número grande?',o:['a) Las decenas','b) Los períodos','c) Los sumandos','d) Las fracciones'],c:1,feedback:'La coma separa bloques de 3 cifras llamados períodos: unidades, miles y millones.'},
  {q:'¿Cuál de estos números es MAYOR?',o:['a) 99,999','b) 100,001','c) 100,000','d) 89,999'],c:1,feedback:'Primero cuenta cifras: 100,001 y 100,000 tienen 6. Comparando de izquierda a derecha, gana 100,001.'},
  {q:'¿Cuántas centenas forman una unidad de millar?',o:['a) 100','b) 1,000','c) 10','d) 5'],c:2,feedback:'10 centenas de 100 = 1,000. ¡Cada peldaño de la escalera vale 10 veces más!'},
  {q:'¿Qué número sigue después de 9,999?',o:['a) 9,100','b) 10,000','c) 99,991','d) 9,000'],c:1,feedback:'9,999 + 1 = 10,000: se estrena una cifra nueva, la decena de millar.'},
  {q:'¿Cuántos miles hay en un millón?',o:['a) 100','b) 10','c) 1,000','d) 10,000'],c:2,feedback:'1,000,000 ÷ 1,000 = 1,000. Por eso se dice que un millón es "mil miles".'},
  {q:'"Dos millones cuarenta mil" se escribe:',o:['a) 2,400,000','b) 240,000','c) 2,004,000','d) 2,040,000'],c:3,feedback:'2 millones + 040 miles + 000 unidades = 2,040,000. Los ceros de relleno son clave.'}
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

// ===================== CLASIFICACIÓN (seleccionar y colocar, sin arrastre) =====================
const classGroups=[
  {
    label:['4 cifras','6 cifras'], headA:'🔢 Tienen 4 CIFRAS (miles)', headB:'💎 Tienen 6 CIFRAS (cientos de miles)', colA:'c4', colB:'c6',
    words:[{w:'4,520',t:'c4'},{w:'125,000',t:'c6'},{w:'8,904',t:'c4'},{w:'999,999',t:'c6'},{w:'3,000',t:'c4'},{w:'450,320',t:'c6'},{w:'7,777',t:'c4'},{w:'104,000',t:'c6'},{w:'1,001',t:'c4'},{w:'670,500',t:'c6'}]
  },
  {
    label:['Se leen con MIL','Se leen con MILLONES'], headA:'🧱 Se leen con la palabra MIL', headB:'💰 Se leen con MILLONES', colA:'mil', colB:'millon',
    words:[{w:'45,000',t:'mil'},{w:'2,500,000',t:'millon'},{w:'890,000',t:'mil'},{w:'7,000,000',t:'millon'},{w:'12,340',t:'mil'},{w:'1,000,000',t:'millon'},{w:'999,999',t:'mil'},{w:'300,000,000',t:'millon'},{w:'56,780',t:'mil'},{w:'9,999,999',t:'millon'}]
  },
  {
    label:['El 7 vale 7,000','El 7 vale 700'], headA:'💎 El 7 vale 7,000 (millares)', headB:'🟠 El 7 vale 700 (centenas)', colA:'um',colB:'cen',
    words:[{w:'7,450',t:'um'},{w:'2,700',t:'cen'},{w:'17,200',t:'um'},{w:'5,704',t:'cen'},{w:'97,000',t:'um'},{w:'48,730',t:'cen'},{w:'27,890',t:'um'},{w:'1,750',t:'cen'}]
  },
  {
    label:['Mayor que medio millón','Menor que medio millón'], headA:'⬆️ MAYOR que 500,000', headB:'⬇️ MENOR que 500,000', colA:'may', colB:'men',
    words:[{w:'750,000',t:'may'},{w:'320,000',t:'men'},{w:'1,200,000',t:'may'},{w:'89,999',t:'men'},{w:'501,000',t:'may'},{w:'499,999',t:'men'},{w:'6,000,000',t:'may'},{w:'250,000',t:'men'},{w:'999,999',t:'may'},{w:'45,000',t:'men'}]
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
      if(clsSelected){ // hay un elemento del banco seleccionado: se inserta en esta caja, sin sacar el tocado
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
  {s:['La','coma','separa','los','períodos','cada','tres','cifras.'],c:4,art:'Bloques de 3 cifras que separa la coma'},
  {s:['El','número','1,000,000','se','lee','un','millón.'],c:2,art:'El número de 7 cifras escrito en cifras'},
  {s:['En','45,000','el','4','vale','cuarenta','mil.'],c:3,art:'La cifra que vale 40,000'},
  {s:['Diez','centenas','forman','una','unidad','de','millar.'],c:1,art:'Grupos de 100 unidades'},
  {s:['El','cero','guarda','el','lugar','vacío','en','304,000.'],c:1,art:'La cifra que guarda el lugar de una posición vacía'},
  {s:['100,000','es','una','centena','de','millar.'],c:0,art:'El número que vale cien mil'},
  {s:['Para','comparar,','gana','el','número','con','más','cifras.'],c:7,art:'Lo que se cuenta PRIMERO al comparar números'},
  {s:['Mil','se','escribe','1,000','y','nunca','se','dice','un','mil.'],c:3,art:'El número mil escrito en cifras'}
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
  {s:'La coma se coloca cada ___ cifras, contando desde la derecha.',opts:['dos','tres','cuatro'],c:1},
  {s:'Un millón se escribe con un 1 y ___ ceros.',opts:['cinco','seis','siete'],c:1},
  {s:'Diez centenas forman una unidad de ___.',opts:['decena','millar','millón'],c:1},
  {s:'El número 105 se lee ___ cinco.',opts:['cien','ciento','uno'],c:1},
  {s:'El número 1,000 se lee ___.',opts:['un mil','mil','diez cien'],c:1},
  {s:'En 250,000 el 2 vale ___ mil.',opts:['dos','veinte','doscientos'],c:2},
  {s:'Con igual cantidad de cifras, se compara de ___ a derecha.',opts:['izquierda','abajo','atrás'],c:0},
  {s:'"Tres millones cuarenta mil" = 3,___,000.',opts:['400','040','004'],c:1}
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
    q: 'Sin contar de uno en uno: ¿cuál número es MAYOR, 99,999 o 100,000?',
    opts: ['99,999 porque empieza con 9', '100,000', 'Son iguales'],
    correct: 1,
    feedback: '¡Correcto! 100,000 tiene 6 cifras y 99,999 solo 5: gana el que tiene más cifras, sin importar con qué empiece.',
    wrongFeedback: 'La respuesta es 100,000: tiene 6 cifras y 99,999 solo 5. Al comparar, primero se cuentan las cifras.',
    explore: 'cifras'
  },
  {
    q: '¿Cuántos CEROS tiene un millón escrito en cifras?',
    opts: ['5 ceros', '6 ceros', '7 ceros'],
    correct: 1,
    feedback: '¡Excelente! 1,000,000 es un 1 con seis ceros. Cada ×10 agrega un cero a la torre.',
    wrongFeedback: 'La respuesta es 6: un millón se escribe 1,000,000. Sube la torre ×10 y cuéntalos.',
    explore: 'torre'
  },
  {
    q: '¿Cómo se lee el número 205,000?',
    opts: ['Dos mil cincuenta', 'Veinte mil quinientos', 'Doscientos cinco mil'],
    correct: 2,
    feedback: '¡Muy bien! La coma parte el número en bloques: [205] + "mil" + [000] = doscientos cinco mil.',
    wrongFeedback: 'La respuesta es "doscientos cinco mil": el bloque antes de la coma se lee normal (205) y se le agrega el apellido "mil".',
    explore: 'bloques'
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
  if (prediceAnswered.size === prediceData.length) { fin('s-predice'); sfx('fan'); showToast('🔮 ¡Predicciones completadas! Ahora a subir la escalera.'); }
}

// --- Exploradores interactivos de la sección Predice ---
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
  if(type==='cifras'){
    box.innerHTML=`<p class="pd-tip">Toca cada número y el contador te dirá cuántas cifras tiene:</p><div style="display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;margin:0.5rem 0;"><button class="btn btn-pri" onclick="predContar(${i},99999)">contar cifras de 99,999</button><button class="btn btn-pri" onclick="predContar(${i},100000)">contar cifras de 100,000</button></div><div class="pd-counter" id="pd-cnt-${i}" style="font-family:'Fira Code',monospace;font-size:1.3rem;letter-spacing:3px;">&nbsp;</div><div class="pd-msg" id="pd-msg-${i}">👆 cuenta las cifras de los dos números</div>`;
    box.dataset.found='';
  } else if(type==='torre'){
    box.innerHTML=`<p class="pd-tip">Sube la torre: cada botón multiplica por 10 y agrega un piso. ¡Observa los ceros!</p><div style="text-align:center;margin:0.5rem 0;"><button class="btn btn-pri" onclick="predTorre(${i})" id="pd-torre-btn-${i}">🪜 Subir ×10</button></div><div class="pd-counter" id="pd-cnt-${i}" style="font-family:'Fira Code',monospace;font-size:1.4rem;">1</div><div class="pd-msg" id="pd-msg-${i}">La torre empieza en 1. Toca ×10 para subir.</div>`;
    box.dataset.torre='1';
  } else if(type==='bloques'){
    box.innerHTML=`<p class="pd-tip">El número 205,000 tiene dos bloques separados por la coma. Toca cada bloque y descubre cómo se lee:</p><div style="display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;margin:0.5rem 0;align-items:center;"><button class="btn btn-pri" style="font-family:'Fira Code',monospace;font-size:1.2rem;" onclick="predBloque(${i},1)">205</button><span style="font-family:'Fira Code',monospace;font-size:1.5rem;color:var(--red);font-weight:700;">,</span><button class="btn btn-pri" style="font-family:'Fira Code',monospace;font-size:1.2rem;" onclick="predBloque(${i},2)">000</button></div><div class="pd-msg" id="pd-msg-${i}">👆 toca los dos bloques</div>`;
    box.dataset.found='';
  }
}
function predContar(i,n){
  sfx('click');
  const cnt=document.getElementById('pd-cnt-'+i), msg=document.getElementById('pd-msg-'+i);
  const box=document.getElementById('pd-explore-'+i);
  const s=String(n);
  cnt.textContent=s.split('').join(' · ');
  const found=new Set((box.dataset.found||'').split(',').filter(Boolean)); found.add(String(n));
  box.dataset.found=[...found].join(',');
  if(found.size>=2){ msg.innerHTML=`🎯 99,999 tiene <strong>5 cifras</strong> y 100,000 tiene <strong>6 cifras</strong>. Más cifras = número más grande. ¡Ya sabes qué responder!`; sfx('ok'); }
  else{ msg.innerHTML=`🔢 El número <strong>${_fmtNum(n)}</strong> tiene <strong>${s.length} cifras</strong>. Ahora cuenta las del otro número.`; }
}
function predTorre(i){
  sfx('click');
  const box=document.getElementById('pd-explore-'+i);
  let v=parseInt(box.dataset.torre||'1',10);
  if(v>=1000000){ document.getElementById('pd-msg-'+i).innerHTML='🎉 ¡Ya llegaste al millón! Reinicia tocando de nuevo.'; box.dataset.torre='1'; document.getElementById('pd-cnt-'+i).textContent='1'; return; }
  v=v*10; box.dataset.torre=String(v);
  const ceros=String(v).length-1;
  document.getElementById('pd-cnt-'+i).textContent=_fmtNum(v);
  if(v===1000000){ document.getElementById('pd-msg-'+i).innerHTML=`🎯 ¡Llegaste! <strong>1,000,000</strong> = un millón, con <strong>${ceros} ceros</strong>. Se lee «${numToWords(v)}». ¡Responde abajo!`; sfx('ok'); }
  else{ document.getElementById('pd-msg-'+i).innerHTML=`🪜 Piso ${ceros}: <strong>${_fmtNum(v)}</strong> («${numToWords(v)}») tiene <strong>${ceros} ceros</strong>. ¡Sigue subiendo!`; }
}
function predBloque(i,b){
  sfx('click');
  const msg=document.getElementById('pd-msg-'+i);
  const box=document.getElementById('pd-explore-'+i);
  const found=new Set((box.dataset.found||'').split(',').filter(Boolean)); found.add(String(b));
  box.dataset.found=[...found].join(',');
  if(found.size>=2){ msg.innerHTML=`🎯 Bloque [205] = «doscientos cinco» + apellido «mil»; bloque [000] no agrega nada. Se lee: <strong>doscientos cinco mil</strong>. ¡Responde abajo!`; sfx('ok'); }
  else if(b===1){ msg.innerHTML=`📦 El bloque <strong>205</strong> está en el período de los MILES: se lee «doscientos cinco» y se le agrega el apellido <strong>«mil»</strong>.`; }
  else{ msg.innerHTML=`📦 El bloque <strong>000</strong> es el período de las UNIDADES: está vacío, así que <strong>no se lee nada</strong>… ¡pero guarda el lugar!`; }
}

// ===================== RETO FINAL (con parejas variables) =====================
const retoPairs=[
  {
    name:'Duelo de números 🔢', hint:'Compara A con B: cuenta las cifras primero; a igual cantidad, compara de izquierda a derecha',
    pool:[
      {w:'A: 99,999 vs B: 100,000',t:'menor'},{w:'A: 45,000 vs B: 45,000',t:'igual'},{w:'A: 250,000 vs B: 205,000',t:'mayor'},
      {w:'A: 1,000,000 vs B: 999,999',t:'mayor'},{w:'A: 89,000 vs B: 98,000',t:'menor'},{w:'A: 500,001 vs B: 500,100',t:'menor'},
      {w:'A: 7,020 vs B: 7,020',t:'igual'},{w:'A: 304,000 vs B: 340,000',t:'menor'},{w:'A: 12,000,000 vs B: 9,999,999',t:'mayor'},
      {w:'A: 600,600 vs B: 600,600',t:'igual'},{w:'A: 76,500 vs B: 76,050',t:'mayor'},{w:'A: 3,999 vs B: 4,001',t:'menor'}
    ]
  },
  {
    name:'El valor de la cifra 💎', hint:'Calcula cuánto VALE la cifra de A según su posición y compara con B',
    pool:[
      {w:'A: el 5 de 50,000 vs B: 50,000',t:'igual'},{w:'A: el 3 de 3,000 vs B: 300',t:'mayor'},{w:'A: el 7 de 700 vs B: 7,000',t:'menor'},
      {w:'A: el 2 de 2,000,000 vs B: 2,000,000',t:'igual'},{w:'A: el 9 de 90 vs B: 900',t:'menor'},{w:'A: el 4 de 40,000 vs B: 4,000',t:'mayor'},
      {w:'A: el 8 de 800,000 vs B: 800,000',t:'igual'},{w:'A: el 6 de 6,000 vs B: 60,000',t:'menor'},{w:'A: el 1 de 100,000 vs B: 10,000',t:'mayor'},
      {w:'A: el 5 de 500 vs B: 500',t:'igual'},{w:'A: el 3 de 30,000 vs B: 300,000',t:'menor'},{w:'A: el 9 de 9,000,000 vs B: 900,000',t:'mayor'}
    ]
  },
  {
    name:'Canjes de la escalera 🪜', hint:'¿Cuántas piezas pequeñas caben en la grande? Cada peldaño vale 10 veces más',
    pool:[
      {w:'A: decenas en 1,000 vs B: 100',t:'igual'},{w:'A: centenas en 1,000 vs B: 100',t:'menor'},{w:'A: unidades en 100 vs B: 10',t:'mayor'},
      {w:'A: miles en 1,000,000 vs B: 1,000',t:'igual'},{w:'A: centenas en 10,000 vs B: 1,000',t:'menor'},{w:'A: decenas en 100 vs B: 5',t:'mayor'},
      {w:'A: centenas en 100,000 vs B: 1,000',t:'igual'},{w:'A: miles en 10,000 vs B: 100',t:'menor'},{w:'A: unidades en 1,000 vs B: 999',t:'mayor'},
      {w:'A: decenas de millar en 1,000,000 vs B: 100',t:'igual'},{w:'A: miles en 100,000 vs B: 1,000',t:'menor'},{w:'A: centenas en 5,000 vs B: 40',t:'mayor'}
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
      if(_fb){
        const labels={mayor:'A es MAYOR que B',menor:'A es MENOR que B',igual:'A es IGUAL a B'};
        _fb.textContent=`En ${retoCurrent.w}: ${labels[retoCurrent.t]}`;
        _fb.className='fb show err';
        setTimeout(()=>_fb.classList.remove('show'),2000);
      }
    }
    document.getElementById('retoScore').textContent=`✔ ${retoOk} correctas | ✗ ${retoErr} errores`; showRetoWord();
}
function endReto(){ retoRunning=false; document.getElementById('retoWord').textContent='🏁 ¡Tiempo!'; document.getElementById('retoTimer').style.color='var(--pri)'; xpTracker.reto.add(1); const total=retoOk+retoErr; const pct=total>0?Math.round((retoOk/total)*100):0; fb('fbReto',`Resultado: ${retoOk}/${total} (${pct}%) ¡Bien hecho! Prueba otra pareja con 🔀`,true); fin('s-reto'); sfx('fan'); unlockAchievement('reto_hero'); }
function resetReto(){ sfx('click'); clearInterval(retoTimerInt); retoRunning=false; retoSec=30; retoOk=0; retoErr=0; document.getElementById('retoTimer').textContent='⏱ 30'; document.getElementById('retoTimer').style.color='var(--pri)'; document.getElementById('retoWord').textContent='¡Prepárate!'; document.getElementById('retoScore').textContent='✔ 0 correctas | ✗ 0 errores'; document.getElementById('fbReto').classList.remove('show'); }

// ===================== GENERADOR DE TAREAS =====================
// Tareas autogeneradas e infinitas: el estudiante se autoasigna práctica en casa
// o el docente las copia en el pizarrón. Respuestas ocultas hasta pulsar 👁.
function _tgRint(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
function _tgLines(n){ let s=''; for(let i=0;i<n;i++) s+='<div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.4rem;height:1.3rem;">&nbsp;</div>'; return s; }
function _tgTask(out,i,inner){ const div=document.createElement('div'); div.className='tg-task'; div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content">${inner}</div>`; out.appendChild(div); }
// número aleatorio con nd cifras; a veces con ceros interiores (ceros de relleno)
function _tgNum(nd){
  let n=_tgRint(Math.pow(10,nd-1),Math.pow(10,nd)-1);
  if(_tgRint(0,1)&&nd>=4){ const s=String(n).split(''); s[_tgRint(1,s.length-2)]='0'; n=parseInt(s.join(''),10); }
  return n;
}
const pensamientoTaskDB=[
  {q:'Rosa dice: "99,999 es mayor que 100,000 porque empieza con 9". Explica su error.',ans:'100,000 tiene 6 cifras y 99,999 solo 5: al comparar, gana el número con más cifras.',type:'🔎 Detectar error'},
  {q:'Un número misterioso tiene 6 cifras, todas iguales, y sus cifras suman 54. ¿Cuál es?',ans:'999,999 (9+9+9+9+9+9 = 54).',type:'🕵️ Número misterioso'},
  {q:'Escribe el número que está exactamente en medio de 400,000 y 600,000, y su lectura.',ans:'500,000: quinientos mil (medio millón).',type:'🧠 Razonar'},
  {q:'¿Cuántos números de 4 cifras existen? Explica cómo lo calculaste.',ans:'9,000: van del 1,000 al 9,999 (9,999 − 1,000 + 1 = 9,000).',type:'⚡ Contar en grande'},
  {q:'Con las cifras 5, 0, 3 y 8 (sin repetir), forma el número MÁS GRANDE y el MÁS PEQUEÑO de 4 cifras.',ans:'Mayor: 8,530 · Menor: 3,058 (un número no puede empezar con 0).',type:'🧩 Armar números'},
  {q:'Si cuentas de 10,000 en 10,000 empezando en 970,000, ¿cuántos saltos necesitas para llegar al millón?',ans:'3 saltos: 980,000 → 990,000 → 1,000,000.',type:'🪜 Saltos gigantes'}
];
function genPensamientoTask(out,count){
  _instrBlock(out,'Instrucción',['Desarrolla con argumentos. Escribe, explica o inventa según se pide.','<em>Lo importante es tu razonamiento, no solo el resultado.</em>']);
  const pool=_shuffle([...pensamientoTaskDB]);
  for(let i=0;i<count;i++){
    const item=pool[i%pool.length]; const div=document.createElement('div'); div.className='tg-task';
    div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><span class="tg-type-tag">${item.type}</span><br><strong>${item.q}</strong>${_tgLines(3)}<div class="tg-answer">✔ ${item.ans}</div></div>`;
    out.appendChild(div);
  }
}
let ansVisible=false;
function genTask(){ sfx('click'); const type=document.getElementById('tgType').value; const count=parseInt(document.getElementById('tgCount').value); ansVisible=false; const out=document.getElementById('tgOut'); out.innerHTML=''; if(type==='leer') genLeerTask(out,count); else if(type==='escribir') genEscribirTask(out,count); else if(type==='valor') genValorTask(out,count); else if(type==='descomponer') genDescomponerTask(out,count); else if(type==='ordenar') genOrdenarTask(out,count); else if(type==='pensamiento') genPensamientoTask(out,count); fin('s-tareas'); }
function _instrBlock(out,title,lines){ const ib=document.createElement('div'); ib.className='tg-instruction-block'; ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join(''); out.appendChild(ib); }
// 📖 Leer: escribir con letras
function genLeerTask(out,count){
  _instrBlock(out,'Instrucción — Lee y escribe con letras',['Escribe cada número con letras (en palabras). Lee por bloques: primero millones, luego miles y al final unidades.','<strong>Recuerda:</strong> 1,000 se lee "mil" y 1,000,000 "un millón".']);
  for(let i=0;i<count;i++){
    const n=_tgNum([4,5,6,6,7,8,9][_tgRint(0,6)]);
    _tgTask(out,i,`<strong style="font-family:'Fira Code',monospace;">${_fmtNum(n)}</strong> = ${_tgLines(1)}<div class="tg-answer">✔ ${numToWords(n)}</div>`);
  }
}
// ✍️ Escribir: de letras a cifras
function genEscribirTask(out,count){
  _instrBlock(out,'Instrucción — Escribe en cifras',['Escribe cada número en cifras, con su coma cada 3 posiciones.','<strong>Cuidado</strong> con los ceros de relleno: "trescientos cuatro mil" = 304,000.']);
  for(let i=0;i<count;i++){
    const n=_tgNum([4,5,6,6,7,9][_tgRint(0,5)]);
    _tgTask(out,i,`<strong>«${numToWords(n)}»</strong> = ${_tgLines(1)}<div class="tg-answer">✔ ${_fmtNum(n)}</div>`);
  }
}
// 💎 Valor posicional
function genValorTask(out,count){
  _instrBlock(out,'Instrucción — ¿Cuánto vale la cifra?',['Escribe cuánto VALE la cifra subrayada según su posición.','<strong>Truco:</strong> multiplica la cifra por el valor de su peldaño (1, 10, 100, 1,000…).']);
  for(let i=0;i<count;i++){
    const n=_tgNum(_tgRint(4,9)); const s=String(n);
    let p=_tgRint(0,s.length-1); let tries=0;
    while(s[p]==='0'&&tries<10){ p=_tgRint(0,s.length-1); tries++; }
    const d=parseInt(s[p],10); const valor=d*Math.pow(10,s.length-1-p);
    const marcado=s.split('').map((ch,k)=>k===p?`<u><strong>${ch}</strong></u>`:ch).join('');
    _tgTask(out,i,`En <strong style="font-family:'Fira Code',monospace;">${marcado}</strong> (${_fmtNum(n)}), ¿cuánto vale la cifra subrayada? ${_tgLines(1)}<div class="tg-answer">✔ ${_fmtNum(valor)} (${numToWords(valor)})</div>`);
  }
}
// ➕ Descomponer en forma expandida
function genDescomponerTask(out,count){
  _instrBlock(out,'Instrucción — Forma expandida',['Descompón cada número como suma de los valores de sus cifras.','Ejemplo: 45,203 = 40,000 + 5,000 + 200 + 3.']);
  for(let i=0;i<count;i++){
    const n=_tgNum(_tgRint(4,7)); const s=String(n);
    const partes=s.split('').map((ch,k)=>parseInt(ch,10)*Math.pow(10,s.length-1-k)).filter(v=>v>0);
    _tgTask(out,i,`<strong style="font-family:'Fira Code',monospace;">${_fmtNum(n)}</strong> = ${_tgLines(1)}<div class="tg-answer">✔ ${partes.map(_fmtNum).join(' + ')}</div>`);
  }
}
// ↕️ Ordenar números grandes
function genOrdenarTask(out,count){
  _instrBlock(out,'Instrucción — Ordena de MENOR a MAYOR',['Ordena cada lista de menor a mayor. Cuenta las cifras primero; a igual cantidad, compara de izquierda a derecha.']);
  for(let i=0;i<count;i++){
    const nd=_tgRint(4,6); const nums=[];
    while(nums.length<5){ const v=_tgRint(0,1)?_tgNum(nd):_tgNum(nd+_tgRint(0,2)); if(!nums.includes(v)) nums.push(v); }
    const orden=[...nums].sort((a,b)=>a-b);
    _tgTask(out,i,`<strong style="font-family:'Fira Code',monospace;">${nums.map(_fmtNum).join('  ·  ')}</strong>${_tgLines(1)}<div class="tg-answer">✔ ${orden.map(_fmtNum).join(' &lt; ')}</div>`);
  }
}
function toggleAns(){ ansVisible=!ansVisible; document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none'); sfx('click'); }

// ===================== SOPA DE LETRAS (multidireccional, con inversas) =====================
const sopaSets=[
  {
    size:10,
    grid:[
      ['N','F','O','H','S','C','V','N','H','I'],
      ['G','R','B','U','C','I','F','R','A','R'],
      ['U','G','I','L','N','I','L','D','G','B'],
      ['A','O','G','C','E','N','T','E','N','A'],
      ['M','M','D','M','C','D','N','C','I','D'],
      ['I','I','O','O','I','M','M','E','O','A'],
      ['L','M','S','C','I','L','D','N','P','D'],
      ['L','M','J','E','C','R','L','A','I','I'],
      ['A','C','F','S','U','G','E','O','N','N'],
      ['R','J','U','I','T','S','U','P','N','U']
    ],
    words:[
      {w:'PERIODO', cells:[[9,7],[8,6],[7,5],[6,4],[5,3],[4,2],[3,1]]},
      {w:'CENTENA', cells:[[3,3],[3,4],[3,5],[3,6],[3,7],[3,8],[3,9]]},
      {w:'MILLON', cells:[[4,3],[5,4],[6,5],[7,6],[8,7],[9,8]]},
      {w:'MILLAR', cells:[[4,0],[5,0],[6,0],[7,0],[8,0],[9,0]]},
      {w:'UNIDAD', cells:[[9,9],[8,9],[7,9],[6,9],[5,9],[4,9]]},
      {w:'DECENA', cells:[[2,7],[3,7],[4,7],[5,7],[6,7],[7,7]]},
      {w:'CIFRA', cells:[[1,4],[1,5],[1,6],[1,7],[1,8]]},
      {w:'COMA', cells:[[6,3],[5,2],[4,1],[3,0]]}
    ]
  },
  {
    size:10,
    grid:[
      ['F','V','I','N','N','J','V','A','R','C'],
      ['V','A','M','O','E','M','S','R','I','F'],
      ['L','L','B','I','D','I','I','E','R','T'],
      ['E','O','R','C','R','P','N','L','F','E'],
      ['M','R','A','I','O','O','P','A','H','G'],
      ['E','R','F','S','E','R','D','C','G','B'],
      ['N','L','G','O','H','G','V','S','G','G'],
      ['O','L','M','P','D','T','R','E','F','I'],
      ['R','E','L','E','C','T','U','R','A','F'],
      ['B','F','R','O','Y','A','M','N','B','J']
    ],
    words:[
      {w:'POSICION', cells:[[7,3],[6,3],[5,3],[4,3],[3,3],[2,3],[1,3],[0,3]]},
      {w:'ESCALERA', cells:[[7,7],[6,7],[5,7],[4,7],[3,7],[2,7],[1,7],[0,7]]},
      {w:'LECTURA', cells:[[8,2],[8,3],[8,4],[8,5],[8,6],[8,7],[8,8]]},
      {w:'VALOR', cells:[[0,1],[1,1],[2,1],[3,1],[4,1]]},
      {w:'ORDEN', cells:[[4,4],[3,4],[2,4],[1,4],[0,4]]},
      {w:'MAYOR', cells:[[9,6],[9,5],[9,4],[9,3],[9,2]]},
      {w:'MENOR', cells:[[4,0],[5,0],[6,0],[7,0],[8,0]]},
      {w:'MIL', cells:[[1,5],[2,6],[3,7]]}
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
  {q:'La coma se escribe cada tres cifras, contando desde la derecha.',a:true},
  {q:'Un millón tiene 5 ceros.',a:false},
  {q:'El número 1,000 se lee "un mil".',a:false},
  {q:'Diez centenas forman una unidad de millar.',a:true},
  {q:'El número 99,999 es mayor que 100,000.',a:false},
  {q:'En 304,000 el cero que sigue al 3 guarda el lugar de las decenas de millar.',a:true},
  {q:'El número 105 se lee "ciento cinco".',a:true},
  {q:'"Doscientos cinco mil" se escribe 250,000.',a:false},
  {q:'Todos los números de 7 cifras se leen con la palabra "millón" o "millones".',a:true},
  {q:'Al comparar 76,500 y 76,050, el mayor es 76,050.',a:false}
];
const evalMCBank=[
  {q:'¿Cómo se lee el número 45,000?',o:['a) Cuatro mil quinientos','b) Cuarenta y cinco mil','c) Cuatrocientos cincuenta mil','d) Cuarenta y cinco millones'],a:1},
  {q:'¿Cuántos ceros tiene un millón escrito en cifras?',o:['a) 5','b) 6','c) 7','d) 4'],a:1},
  {q:'¿Cuál es el valor del 7 en 78,500?',o:['a) 7','b) 700','c) 7,000','d) 70,000'],a:3},
  {q:'"Trescientos cinco mil" se escribe:',o:['a) 3,005','b) 350,000','c) 305,000','d) 30,500'],a:2},
  {q:'¿Cuál número es MAYOR?',o:['a) 99,999','b) 100,001','c) 100,000','d) 89,999'],a:1},
  {q:'¿Qué número sigue después de 9,999?',o:['a) 9,100','b) 10,000','c) 99,991','d) 9,000'],a:1},
  {q:'La coma separa los números en bloques de tres cifras llamados:',o:['a) cifras','b) períodos','c) decenas','d) sumandos'],a:1},
  {q:'"Dos millones cuarenta mil" se escribe:',o:['a) 2,400,000','b) 240,000','c) 2,004,000','d) 2,040,000'],a:3}
];
const evalCPBank=[
  {q:'La coma se coloca cada ___ cifras, contando desde la derecha.',a:'tres (3)',acc:['tres','3','tres 3','tres cifras','3 cifras']},
  {q:'Un millón se escribe con un 1 seguido de ___ ceros.',a:'seis (6)',acc:['seis','6','seis 6','seis ceros','6 ceros']},
  {q:'Diez centenas forman una unidad de ___.',a:'millar',acc:['millar','un millar','mil']},
  {q:'Los bloques de tres cifras separados por comas se llaman ___.',a:'períodos',acc:['periodos','periodo','los periodos']},
  {q:'El número 1,000 se lee ___.',a:'mil',acc:['mil']},
  {q:'El número 100 se lee "cien", pero 105 se lee "___ cinco".',a:'ciento',acc:['ciento']},
  {q:'Para comparar dos números, primero se cuenta cuántas ___ tiene cada uno.',a:'cifras',acc:['cifras','digitos','las cifras']},
  {q:'En 304,000, los ceros de ___ guardan el lugar de las posiciones vacías.',a:'relleno',acc:['relleno','rellenos']}
];
const evalPRBank=[
  {term:'Decena',def:'Grupo de 10 unidades'},
  {term:'Centena',def:'Grupo de 100 unidades: 10 decenas'},
  {term:'Unidad de millar',def:'Vale 1,000: diez centenas juntas'},
  {term:'Millón',def:'Se escribe con un 1 y seis ceros'},
  {term:'Período',def:'Bloque de tres cifras separado por la coma'},
  {term:'Valor posicional',def:'Lo que vale una cifra según el lugar que ocupa'}
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación Números Grandes: del Cien al Millón · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:12pt;color:#111;background:#fff;padding:4mm 6mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.5rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;color:#1565c0;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:#1565c0;margin-top:0.15rem;font-weight:700;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.5rem 0 0.25rem;border-left:4px solid #1565c0;background:#e3f2fd;display:flex;justify-content:space-between;align-items:center;color:#1565c0;}.qn{font-weight:700;min-width:22px;flex-shrink:0;color:#1565c0;}.tf-row{display:flex;align-items:flex-start;gap:0.3rem;font-size:10.5pt;line-height:1.4;padding:0.25rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:42px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.2rem;margin-top:0.2rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.28rem 0.45rem;margin-bottom:0.22rem;break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.4;display:flex;gap:0.3rem;margin-bottom:0.18rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.22rem 0.55rem;}.mc-opts{display:grid;grid-template-columns:repeat(2,1fr);gap:0.08rem 0.25rem;margin-left:1.3rem;}.mc-opt{font-size:9.5pt;display:flex;align-items:center;gap:0.22rem;}.mc-opt input{width:12px;height:12px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.4;padding:0.22rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:130px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{break-inside:avoid;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.2rem 0.5rem;margin-top:0.15rem;}.pr-head{font-size:9pt;font-weight:700;color:#1565c0;margin-bottom:0.2rem;}.pr-item{font-size:10pt;padding:0.22rem 0.32rem;background:#e3f2fd;border-radius:3px;margin-bottom:0.12rem;display:flex;align-items:center;gap:0.22rem;line-height:1.2;}.pr-num{font-weight:700;color:#1565c0;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #1565c0;padding-bottom:0.35rem;margin-bottom:0.5rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;color:#1565c0;}.p-sub{font-size:9pt;color:#1565c0;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #cce0ff;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;color:#1565c0;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#1565c0;}.pa{color:#007a00;font-weight:700;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:#1565c0;font-weight:700;font-style:italic;}.obt-lbl{font-weight:700;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #1565c0;height:12px;}.obt-pct{font-weight:700;}.total-row{display:flex;align-items:baseline;justify-content:flex-end;gap:7px;font-size:11pt;color:#1565c0;font-weight:700;font-style:italic;margin-top:0.4rem;padding:0.2rem 0.5rem;background:#e3f2fd;border-radius:4px;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #1565c0;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · Misión Números Grandes: del Cien al Millón · Matemática</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 4 secciones × 5 preguntas × 5 pts c/u · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✔ PAUTA DOCENTE — Evaluación Final · Números Grandes: del Cien al Millón · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">100 pts | 4 secciones × 5 preguntas × 5 pts | Matemáticas I y II Ciclo</div></div><div class="p-grid">${pR}</div>
  ${zgBlock}</div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("evalPage",252,0.55,1.45);fit("pautaPage",252,0.55,1.3);})();</script></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(doc); win.document.close(); setTimeout(()=>win.print(),400);
}

// ===================== EXPLICA CON TUS PALABRAS =====================
const explicaData = [
  {
    q: 'Explica por qué 100,000 es mayor que 99,999, aunque el 9 sea una cifra más grande que el 1.',
    hint: '💡 Pista: cuenta las cifras de cada número.',
    rubric: ['✓ Cuenta las cifras: 100,000 tiene 6 y 99,999 tiene 5', '✓ Aplica la regla: con más cifras, el número es mayor', '✓ Explica que el valor depende de la POSICIÓN, no del tamaño de la cifra'],
    suggested: '100,000 tiene 6 cifras y 99,999 solo 5. El número con más cifras siempre es mayor, porque su primera cifra vive en un peldaño más alto de la escalera: el 1 de 100,000 vale cien mil, mientras que el primer 9 de 99,999 solo vale noventa mil.'
  },
  {
    q: 'Explica paso a paso cómo se lee el número 245,300.',
    hint: '💡 Pista: la coma parte el número en dos bloques.',
    rubric: ['✓ Separa los períodos con la coma: [245] y [300]', '✓ Lee el bloque de miles y le agrega "mil": doscientos cuarenta y cinco mil', '✓ Lee el bloque de unidades: trescientos'],
    suggested: 'La coma parte el número en 245 y 300. Primero leo el bloque de los miles: "doscientos cuarenta y cinco" más el apellido "mil". Luego leo el bloque de unidades: "trescientos". Completo: doscientos cuarenta y cinco mil trescientos.'
  },
  {
    q: '¿Por qué "trescientos cuatro mil" se escribe 304,000 y no 34,000? Explica el papel del cero.',
    hint: '💡 Pista: ¿qué posición quedaría vacía sin el cero?',
    rubric: ['✓ Indica que el cero guarda el lugar de las decenas de millar', '✓ Explica que sin el cero, el 3 cambia de posición y de valor', '✓ Comprueba leyendo: 34,000 se lee "treinta y cuatro mil", que es otro número'],
    suggested: 'En "trescientos cuatro mil" hay 3 centenas de millar y 4 unidades de millar, pero cero decenas de millar. El cero guarda ese lugar: 304,000. Si lo quito queda 34,000, y ahí el 3 baja de peldaño: ya no vale trescientos mil sino treinta mil.'
  },
  {
    q: 'El dígito 5 aparece en 500 y en 50,000. Explica por qué no vale lo mismo en los dos números.',
    hint: '💡 Pista: multiplica la cifra por el valor de su peldaño.',
    rubric: ['✓ Identifica la posición del 5 en cada número (centenas / decenas de millar)', '✓ Calcula: 5 × 100 = 500 y 5 × 10,000 = 50,000', '✓ Concluye que la posición multiplica el valor de la cifra'],
    suggested: 'En 500 el 5 está en las centenas: vale 5 × 100 = 500. En 50,000 está en las decenas de millar: vale 5 × 10,000 = 50,000. Es la misma cifra, pero su posición la hace valer cien veces más.'
  },
  {
    q: 'Inventa un problema de la vida real donde aparezca un número mayor que 100,000, escríbelo en cifras y en letras, y resuélvelo.',
    hint: '💡 Pista: piensa en habitantes de una ciudad, lempiras o distancias.',
    rubric: ['✓ El contexto es de la vida real y usa un número mayor que 100,000', '✓ Escribe el número en cifras (con comas) y en letras correctamente', '✓ Resuelve bien la pregunta que planteó'],
    suggested: '"Una ciudad tiene 250,000 (doscientos cincuenta mil) habitantes y otra tiene 100,000 (cien mil) más. ¿Cuántos habitantes tiene la segunda?" Respuesta: 250,000 + 100,000 = 350,000, trescientos cincuenta mil habitantes.'
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

// ===================== PRUEBA OPERATIVA — NÚMEROS GRANDES =====================

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
let _opRnd = Math.random;
function _opRint(min, max) { return Math.floor(_opRnd() * (max - min + 1)) + min; }
function _isIntMatch(student, expectedNum) {
  const raw = (student || '').toString().trim().replace(/[,\s.]/g, '');
  if (!raw) return false;
  const n = parseInt(raw, 10);
  return !isNaN(n) && n === expectedNum;
}
// número con nd cifras, a veces con cero interior
function _opNum(nd) {
  let n = _opRint(Math.pow(10, nd - 1), Math.pow(10, nd) - 1);
  if (_opRint(0, 1) && nd >= 4) { const s = String(n).split(''); s[_opRint(1, s.length - 2)] = '0'; n = parseInt(s.join(''), 10); }
  return n;
}

// I. Lectura y escritura (5 × 10 = 50 pts)
function genLecturaItems() {
  const items = [];
  for (let i = 0; i < 5; i++) {
    if (i % 2 === 0) {
      const n = _opNum([4, 5, 6, 7, 9][_opRint(0, 4)]);
      items.push({ text: `Escribe en cifras: «${numToWords(n)}»`, ansNum: n });
    } else {
      const n = _opNum(_opRint(4, 7)); const s = String(n);
      let p = _opRint(0, s.length - 1), tries = 0;
      while (s[p] === '0' && tries < 10) { p = _opRint(0, s.length - 1); tries++; }
      const d = parseInt(s[p], 10); const valor = d * Math.pow(10, s.length - 1 - p);
      items.push({ text: `En ${_fmtNum(n)}, ¿cuánto VALE el dígito ${d} (el ${['primero','segundo','tercero','cuarto','quinto','sexto','séptimo'][p]} desde la izquierda)?`, ansNum: valor });
    }
  }
  return items;
}

// II. Problemas breves (5 × 4 = 20 pts)
const OP_NAMES = ['Ana', 'Luis', 'Marta', 'José', 'Carmen', 'Pedro', 'Sofía', 'Iván'];
function genProblemaItems() {
  const items = [];
  const tipos = _shuffleF([0, 1, 2, 3, 4], _opRnd);
  tipos.forEach(tp => {
    const n1 = OP_NAMES[_opRint(0, OP_NAMES.length - 1)];
    let n2 = OP_NAMES[_opRint(0, OP_NAMES.length - 1)];
    while (n2 === n1) n2 = OP_NAMES[_opRint(0, OP_NAMES.length - 1)];
    let text, ansNum;
    if (tp === 0) { const a = _opRint(15, 95) * 100; text = `${n1} ahorra ${_fmtNum(a)} lempiras cada mes. ¿Cuántos lempiras ahorra en 10 meses?`; ansNum = a * 10; }
    else if (tp === 1) { const a = _opRint(45, 900) * 1000; text = `Una ciudad tiene ${_fmtNum(a)} habitantes y otra tiene 1,000 habitantes más. ¿Cuántos habitantes tiene la segunda?`; ansNum = a + 1000; }
    else if (tp === 2) { const a = _opRint(12, 480) * 100; text = `${n1} vende ${_fmtNum(a)} boletos para la feria y ${n2} vende el doble. ¿Cuántos boletos vende ${n2}?`; ansNum = a * 2; }
    else if (tp === 3) { const a = _opRint(240, 950); text = `Un camión carga ${_fmtNum(a)} naranjas. ¿Cuántas naranjas cargan 100 camiones iguales?`; ansNum = a * 100; }
    else { const a = _opRint(12, 480) * 100, b = _opRint(12, 480) * 100; text = `A la feria llegaron ${_fmtNum(a)} personas el sábado y ${_fmtNum(b)} el domingo. ¿Cuántas personas llegaron en total?`; ansNum = a + b; }
    items.push({ text, ansNum });
  });
  return items;
}

// III. Saltos en la escalera (5 × 2 = 10 pts)
function genSaltoItems() {
  const items = [];
  for (let i = 0; i < 5; i++) {
    const tp = i % 4;
    if (tp === 0) { const a = _opRint(15, 980) * 1000; items.push({ text: `Suma 10,000 a ${_fmtNum(a)}. ¿Cuánto obtienes?`, ansNum: a + 10000 }); }
    else if (tp === 1) { const a = _opRint(12, 900) * 1000; items.push({ text: `Resta 1,000 a ${_fmtNum(a)}. ¿Cuánto obtienes?`, ansNum: a - 1000 }); }
    else if (tp === 2) { const a = _opRint(25, 950) * 10; items.push({ text: `Multiplica ${_fmtNum(a)} × 10. ¿Cuánto obtienes?`, ansNum: a * 10 }); }
    else { const a = _opRint(3, 90) * 100; items.push({ text: `Multiplica ${_fmtNum(a)} × 100. ¿Cuánto obtienes?`, ansNum: a * 100 }); }
  }
  return items;
}

// IV. ¿Qué número se esconde? (5 × 2 = 10 pts)
function genFaltanteItems() {
  const items = [];
  const forms = [0, 1, 2, 3, _opRint(0, 3)];
  forms.forEach(f => {
    let expr, ansNum;
    if (f === 0) { const x = _opRint(12, 950); expr = `▢ × 10 = ${_fmtNum(x * 10)}`; ansNum = x; }
    else if (f === 1) { const x = _opRint(12, 900); expr = `▢ × 100 = ${_fmtNum(x * 100)}`; ansNum = x; }
    else if (f === 2) { const x = _opRint(12, 980); expr = `▢ × 1,000 = ${_fmtNum(x * 1000)}`; ansNum = x; }
    else { const x = _opRint(11, 99) * 1000; expr = `${_fmtNum(x)} ÷ 1,000 = ▢`; ansNum = x / 1000; }
    items.push({ expr, ansNum });
  });
  return items;
}

// V. Canjes de la escalera (2 × 5 = 10 pts)
function genCanjeItems() {
  const LAD = [['unidades', 1], ['decenas', 10], ['centenas', 100], ['unidades de millar', 1000], ['decenas de millar', 10000], ['centenas de millar', 100000]];
  const items = [];
  const used = [];
  for (let i = 0; i < 2; i++) {
    let lo, hiV;
    do { lo = _opRint(0, LAD.length - 1); hiV = LAD[lo][1] * Math.pow(10, _opRint(1, 3)); } while (hiV > 1000000 || used.includes(lo + '_' + hiV));
    used.push(lo + '_' + hiV);
    const hiTxt = hiV === 1000000 ? 'un millón (1,000,000)' : _fmtNum(hiV);
    items.push({ text: `¿Cuántas ${LAD[lo][0]} hay en ${hiTxt}?`, ansNum: hiV / LAD[lo][1], extra: `${_fmtNum(hiV / LAD[lo][1])} × ${_fmtNum(LAD[lo][1])} = ${_fmtNum(hiV)}` });
  }
  return items;
}

function genEvalOp() {
  sfx('click');
  _injectFormaSel('genEvalOp', 'evalOpFormaSel', evalOpFormNum, function (v) { evalOpFormNum = v; });
  const _sO = document.getElementById('evalOpFormaSel');
  if (_sO && parseInt(_sO.value, 10)) evalOpFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sO.value, 10)));
  const cf = evalOpFormNum; window._currentEvalOpForm = cf; _opRnd = _evalRng(100000 + cf); evalOpFormNum = (evalOpFormNum % EVAL_FORMAS) + 1; _injectFormaSel('genEvalOp', 'evalOpFormaSel', evalOpFormNum, function (v) { evalOpFormNum = v; }); saveProgress();
  document.getElementById('evalop-screen-title').textContent = `📐 Prueba Operativa — Forma ${cf} · Números Grandes`;
  evalOpAnsVisible = false;
  const out = document.getElementById('evalOpOut'); out.innerHTML = '';

  const leItems = genLecturaItems();
  const s1 = document.createElement('div');
  s1.innerHTML = '<div class="eval-section-title">I. Lectura, escritura y valor posicional <span class="eval-pts">50 pts · 10 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Escribe la respuesta en cifras (puedes usar comas). Lee por períodos y cuida los ceros de relleno.</p>';
  leItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.text}</span><input class="eval-cp-input" type="text" data-le="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${_fmtNum(it.ansNum)}</div><div class="eval-item-feedback" id="evalFbLe${i}" aria-live="polite"></div>`;
    s1.appendChild(d);
  });
  out.appendChild(s1);

  const prItems = genProblemaItems();
  const s2 = document.createElement('div');
  s2.innerHTML = '<div class="eval-section-title">II. Problemas breves <span class="eval-pts">20 pts · 4 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Resuelve en tu cuaderno y escribe la respuesta en la casilla.</p>';
  prItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.text}</span><input class="eval-cp-input" type="text" data-pr="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${_fmtNum(it.ansNum)}</div><div class="eval-item-feedback" id="evalFbPr${i}" aria-live="polite"></div>`;
    s2.appendChild(d);
  });
  out.appendChild(s2);

  const saItems = genSaltoItems();
  const s3 = document.createElement('div');
  s3.innerHTML = '<div class="eval-section-title">III. Saltos en la escalera <span class="eval-pts">10 pts · 2 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Sumar 10,000, restar 1,000 o multiplicar ×10 y ×100 son saltos de peldaño.</p>';
  saItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.text}</span><input class="eval-cp-input" type="text" data-sa="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${_fmtNum(it.ansNum)}</div><div class="eval-item-feedback" id="evalFbSa${i}" aria-live="polite"></div>`;
    s3.appendChild(d);
  });
  out.appendChild(s3);

  const faItems = genFaltanteItems();
  const s4 = document.createElement('div');
  s4.innerHTML = '<div class="eval-section-title">IV. ¿Qué número se esconde en ▢? <span class="eval-pts">10 pts · 2 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Usa la operación inversa: la división deshace la multiplicación y viceversa.</p>';
  faItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.expr}</span><input class="eval-cp-input" type="text" data-fa="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${_fmtNum(it.ansNum)}</div><div class="eval-item-feedback" id="evalFbFa${i}" aria-live="polite"></div>`;
    s4.appendChild(d);
  });
  out.appendChild(s4);

  const cjItems = genCanjeItems();
  const s5 = document.createElement('div');
  s5.innerHTML = '<div class="eval-section-title">V. Canjes de la escalera <span class="eval-pts">10 pts · 5 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Cada peldaño vale 10 veces el anterior. Divide el grande entre el pequeño.</p>';
  cjItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.text}</span><input class="eval-cp-input" type="text" data-cj="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${_fmtNum(it.ansNum)} (${it.extra})</div><div class="eval-item-feedback" id="evalFbCj${i}" aria-live="polite"></div>`;
    s5.appendChild(d);
  });
  out.appendChild(s5);

  window._evalOpData = { leItems, prItems, saItems, faItems, cjItems };
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
  let total = 0; const det = { le: 0, pr: 0, sa: 0, fa: 0, cj: 0 };
  const _mark = (sel, it, i, key, ptsEach, fbId) => {
    const el = document.querySelector(`[data-${sel}="${i}"]`);
    const ok = _isIntMatch(el ? el.value : '', it.ansNum);
    if (el) { el.classList.toggle('eval-input-ok', ok); el.classList.toggle('eval-input-no', !ok); }
    if (ok) { det[key]++; total += ptsEach; }
    setEvalFeedback(fbId + i, ok, ok ? `Correcto. +${ptsEach} pts` : 'Revisar. R/ ' + _fmtNum(it.ansNum));
  };
  d.leItems.forEach((it, i) => _mark('le', it, i, 'le', 10, 'evalFbLe'));
  d.prItems.forEach((it, i) => _mark('pr', it, i, 'pr', 4, 'evalFbPr'));
  d.saItems.forEach((it, i) => _mark('sa', it, i, 'sa', 2, 'evalFbSa'));
  d.faItems.forEach((it, i) => _mark('fa', it, i, 'fa', 2, 'evalFbFa'));
  d.cjItems.forEach((it, i) => _mark('cj', it, i, 'cj', 5, 'evalFbCj'));
  const res = document.getElementById('evalOpAutoResult');
  if (res) { res.className = 'eval-auto-result ' + (total >= 70 ? 'eval-auto-pass' : 'eval-auto-risk'); res.innerHTML = `<strong>Resultado: ${total}/100 pts</strong><br><span>Lectura y valor: ${det.le*10}/50 · Problemas: ${det.pr*4}/20 · Saltos: ${det.sa*2}/10 · Escondido: ${det.fa*2}/10 · Canjes: ${det.cj*5}/10</span>`; }
  if (total >= 70) { pts(8); showToast('🎯 Prueba operativa calificada: ' + total + '/100'); }
  else showToast('🧮 Prueba operativa: ' + total + '/100. Revisa los ítems marcados.');
}

function printEvalOp() {
  if (!window._evalOpData) { showToast('⚠️ Genera una prueba operativa primero'); return; }
  sfx('click');
  const forma = window._currentEvalOpForm || 1; const d = window._evalOpData;
  let s1 = `<div class="sec-title"><span>I. Lectura, escritura y valor posicional</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 50 pts</span></div></div><p class="opx-instr">Escribe la respuesta en cifras en la línea. 10 pts c/u.</p>`;
  d.leItems.forEach((it, i) => { s1 += `<div class="opx-print-row"><span class="qn">${i+1}.</span><span class="prb-text">${it.text}</span><span class="opx-blank"></span></div>`; });
  let s2 = `<div class="sec-title"><span>II. Problemas breves</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Resuelve en el espacio y escribe la respuesta. 4 pts c/u.</p>`;
  d.prItems.forEach((it, i) => { s2 += `<div class="opx-print-row"><span class="qn">${i+1}.</span><span class="prb-text">${it.text}</span><span class="opx-blank"></span></div>`; });
  const saTbl = (items) => `<table class="rnd-tbl"><tr><th>#</th><th>Salto en la escalera</th><th>Resultado</th></tr>${items.map((it, i) => `<tr><td>${i+1}</td><td>${it.text.replace(' ¿Cuánto obtienes?','')}</td><td></td></tr>`).join('')}</table>`;
  let s3 = `<div class="sec-title"><span>III. Saltos en la escalera</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10 pts</span></div></div><p class="opx-instr">+10,000 · −1,000 · ×10 · ×100. 2 pts c/u.</p>${saTbl(d.saItems)}`;
  const faTbl = (items) => `<table class="rnd-tbl"><tr><th>#</th><th>Operación</th><th>▢ =</th></tr>${items.map((it, i) => `<tr><td>${i+1}</td><td>${it.expr}</td><td></td></tr>`).join('')}</table>`;
  let s4 = `<div class="sec-title"><span>IV. ¿Qué número se esconde en ▢?</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10 pts</span></div></div><p class="opx-instr">Usa la operación inversa. 2 pts c/u.</p>${faTbl(d.faItems)}`;
  const cjTbl = (items) => `<table class="rnd-tbl"><tr><th>#</th><th>Canje</th><th>Respuesta</th></tr>${items.map((it, i) => `<tr><td>${i+1}</td><td>${it.text}</td><td></td></tr>`).join('')}</table>`;
  let s5 = `<div class="sec-title"><span>V. Canjes de la escalera</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10 pts</span></div></div><p class="opx-instr">Cada peldaño vale 10 veces el anterior. 5 pts c/u.</p>${cjTbl(d.cjItems)}`;
  let pR = '';
  pR += `<div class="p-sec"><div class="p-ttl">I. Lectura y valor</div><table class="p-tbl">${d.leItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${_fmtNum(it.ansNum)}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">II. Problemas breves</div><table class="p-tbl">${d.prItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${_fmtNum(it.ansNum)}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">III. Saltos</div><table class="p-tbl">${d.saItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${_fmtNum(it.ansNum)}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">IV. Número escondido</div><table class="p-tbl">${d.faItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">▢ = ${_fmtNum(it.ansNum)}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec" style="grid-column:1/-1;"><div class="p-ttl">V. Canjes</div><table class="p-tbl">${d.cjItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${_fmtNum(it.ansNum)} · ${it.extra}</td></tr>`).join('')}</table></div>`;
  const doc = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Prueba Operativa Números Grandes · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11.5pt;color:#111;background:#fff;padding:4mm 6mm;}.ph{margin-bottom:0.5rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;color:#1565c0;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:#1565c0;margin-top:0.15rem;font-weight:700;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.45rem 0 0.2rem;border-left:4px solid #1565c0;background:#e3f2fd;display:flex;justify-content:space-between;align-items:center;color:#1565c0;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:#1565c0;font-weight:700;font-style:italic;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #1565c0;height:12px;}.qn{font-weight:700;min-width:20px;display:inline-block;color:#1565c0;flex-shrink:0;}.opx-instr{font-size:9pt;color:#555;margin-bottom:0.22rem;}.opx-blank{display:inline-block;width:90px;flex:none;border-bottom:1.5px solid #111;min-height:13px;margin-left:0.3rem;}.opx-print-row{display:flex;align-items:baseline;gap:0.4rem;font-size:10pt;padding:0.24rem 0.1rem;border-bottom:1px dotted #ddd;}.prb-text{flex:1;line-height:1.35;}.rnd-tbl{width:100%;border-collapse:collapse;font-size:9.5pt;margin-top:0.15rem;}.rnd-tbl th,.rnd-tbl td{border:1px solid #bbb;padding:0.16rem 0.35rem;text-align:left;}.rnd-tbl th{background:#e3f2fd;color:#1565c0;font-size:8.5pt;}.total-row{display:flex;align-items:baseline;justify-content:flex-end;gap:7px;font-size:11pt;color:#1565c0;font-weight:700;font-style:italic;margin-top:0.45rem;padding:0.2rem 0.5rem;background:#e3f2fd;border-radius:4px;}.total-row .obt-line{min-width:80px;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #1565c0;padding-bottom:0.3rem;margin-bottom:0.5rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;color:#1565c0;}.p-sub{font-size:9pt;color:#1565c0;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #cce0ff;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;color:#1565c0;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#1565c0;}.pa{color:#007a00;font-weight:700;font-family:'Courier New',monospace;}.forma-tag{position:fixed;bottom:5mm;right:6mm;font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;}@media print{@page{size:letter portrait;margin:8mm 10mm;}}</style></head><body><div class="ph"><h2>Examen de Matemáticas — Prueba Operativa · Números Grandes: del Cien al Millón</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Institución:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 pts · I: 50 · II: 20 · III: 10 · IV: 10 · V: 10 · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div><div class="pauta-wrap"><div class="p-head"><div class="p-main">✔ PAUTA — Prueba Operativa · Números Grandes: del Cien al Millón · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">100 pts · Matemáticas I y II Ciclo</div></div><div class="p-grid">${pR}</div></div><div class="forma-tag">Forma ${forma}</div></body></html>`;
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
  const msgs=['💡 ¡ÁNIMO! Comienza tu misión. ¡Cada paso cuenta!','🌱 ¡GRAN INICIO! Ya subiste los primeros peldaños.','🔑 ¡BUEN TRABAJO! Ya dominas los miles.','💪 ¡MUY BIEN! Los números grandes te obedecen.','🏅 ¡INCREÍBLE avance! El millón está a un paso.','🎓 ¡EXTRAORDINARIO! Completaste TODA la misión. ¡Eres Maestro del Millón!'];
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
  const txt=`${stars} CONSTANCIA DE LOGRO ${stars}\n\n📚 Misión: Números Grandes, del Cien al Millón\n👤 Estudiante: ${name}\n📊 Progreso: ${pct}% completado\n⭐ XP obtenido: ${xp} de ${MXP}${achText?'\n\n🏆 Logros desbloqueados:\n'+achText:''}\n\n${msg}\n\n📅 ${date}\n🏠 Proyecto Educativo M.E.T.A.S\n🌐 policastsapien.com`;
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
  _retoPairLbl();
  document.addEventListener('click',function(e){ const panel=document.getElementById('achPanel'); const btn=document.getElementById('achBtn'); if(panel.classList.contains('open')&&!panel.contains(e.target)&&e.target!==btn) panel.classList.remove('open'); });
  document.addEventListener('click',function(e){ if(e.target===document.getElementById('diplomaOverlay')) closeDiploma(); });
  const savedName=localStorage.getItem('nombreEstudianteNumerosGrandes');
  const inputName=document.querySelector('.diploma-input');
  if(savedName&&inputName){ inputName.value=savedName; updateDiplomaName(savedName); }
  if(inputName) inputName.addEventListener('input',e=>localStorage.setItem('nombreEstudianteNumerosGrandes',e.target.value));
  fin('s-aprende',false);
  fin('s-tipos',false);
  fin('s-errores',false);
  renderAchPanel();
});

// Formas deterministas v1: selectores de forma visibles desde la carga de la página
(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalOp==='function') _injectFormaSel('genEvalOp','evalOpFormaSel',evalOpFormNum,function(v){evalOpFormNum=v;}); }catch(e){} try{ if(typeof genEvalCrit==='function') _injectFormaSel('genEvalCrit','evalCritFormaSel',evalCritFormNum,function(v){evalCritFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();
