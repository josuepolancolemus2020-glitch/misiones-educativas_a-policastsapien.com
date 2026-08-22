// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
// Compartir misión por WhatsApp
function compartirMision() {
    const url = window.location.href;
    const texto = `🚀 *Misión Asignada: Multiplicación de Decimales* 🚀\n\nAprende a multiplicar decimales y a colocar el punto donde va, con compras de verdad en lempiras. 🏆\n\nDesbloquea *todos los logros* y puedes poner *tus datos* para que tu maestro observe todos tus logros. 📋\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;
    _waShare(texto);
}

// ===================== ACCESIBILIDAD =====================
function toggleLetra() {
  document.body.classList.toggle('letra-grande');
  if(typeof sfx === 'function') sfx('click');
  localStorage.setItem('prefLetraMultDecimales', document.body.classList.contains('letra-grande'));
}
window.addEventListener('DOMContentLoaded', () => {
  if(localStorage.getItem('prefLetraMultDecimales') === 'true') document.body.classList.add('letra-grande');
});

// ===================== UTILIDADES =====================
const _pick = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
const _shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
function fb(id, msg, isOk) {
  const el = document.getElementById(id);
  if(el) { el.textContent = msg; el.className = 'fb show ' + (isOk ? 'ok' : 'err'); }
}
// Cifras después del punto: es lo que decide dónde va en el producto
/* Las cuentas con decimales se hacen en enteros y el punto se pone al
   final: en coma flotante 0.1×0.3 da 0.030000000000000006, y ese número
   en la pantalla de un niño destruye la confianza en la regla. */
/* Un factor decimal que cae en .0 deja el ejercicio sin lo que se está
   evaluando: 2 × 4 no enseña nada sobre el punto. */
function _decNoRedondo(min,max,div,rnd){ let v; do { v=(rnd?rnd(min,max):Math.floor(Math.random()*(max-min+1))+min); } while(v%10===0); return v/div; }
function _decCifras(x){ const s=String(x); const i=s.indexOf('.'); return i<0?0:s.length-i-1; }
function _decMul(a,b){ const ca=_decCifras(a), cb=_decCifras(b);
  const ea=Math.round(a*Math.pow(10,ca)), eb=Math.round(b*Math.pow(10,cb));
  return _decFmt(ea*eb/Math.pow(10,ca+cb), ca+cb); }
function _decFmt(x,cifras){ let s=x.toFixed(Math.min(10,cifras)); if(s.indexOf('.')>-1) s=s.replace(/0+$/,'').replace(/\.$/,''); return s; }
/* Se le acepta al alumno el número con y sin ceros de adorno: 0.60 y 0.6
   valen lo mismo, y el cero de la derecha no es un error de concepto. */
function _decAcc(x){ const s=String(x); const a=[s]; if(s.indexOf('.')>-1) a.push(s.replace(/0+$/,'').replace(/\.$/,''));
  if(s.startsWith('0.')) a.push(s.slice(1)); return [...new Set(a)]; }

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY = 'matematica_multiplicacion_decimales_v1';
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
  clasif_pro:{icon:'📍',label:'Clasificador experto'},
  id_master:{icon:'🔍',label:'Identificador maestro'},
  reto_hero:{icon:'🏆',label:'Héroe del reto final'},
  nivel3:{icon:'🧾',label:'¡Cajero alcanzado! Nivel 3'},
  nivel5:{icon:'🔥',label:'¡Campeón alcanzado! Nivel 6'}
};
function unlockAchievement(id){ if(unlockedAch.includes(id)) return; unlockedAch.push(id); sfx('ach'); showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label); launchConfetti(); renderAchPanel(); saveProgress(); }
function renderAchPanel(){ const list=document.getElementById('achList'); list.innerHTML=''; Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{ const div=document.createElement('div'); div.className='ach-item'+(unlockedAch.includes(id)?'':' locked'); div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`; list.appendChild(div); }); }
function toggleAchPanel(){ sfx('click'); document.getElementById('achPanel').classList.toggle('open'); }
function showToast(msg){ let t=document.querySelector('.toast'); if(!t){ t=document.createElement('div'); t.className='toast'; document.body.appendChild(t); } t.textContent=msg; t.style.display='block'; clearTimeout(t._tid); t._tid=setTimeout(()=>t.style.display='none',3200); }
function launchConfetti(){ const colors=['#1565c0','#00838f','#00b894','#fdcb6e','#6c5ce7']; for(let i=0;i<60;i++){ const c=document.createElement('div'); c.className='confetti-piece'; c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`; document.body.appendChild(c); c.addEventListener('animationend',()=>c.remove()); } }

// ===================== XP =====================
const lvls=[{t:0,n:'Novato ✏️'},{t:25,n:'Aprendiz 🔢'},{t:55,n:'Cajero 🧾'},{t:90,n:'Contador 💵'},{t:130,n:'Experto 📊'},{t:165,n:'Campeón 🏅'},{t:190,n:'Maestro 🎓'}];
function pts(n){ xp=Math.max(0,Math.min(MXP,xp+n)); updateXPBar(); saveProgress(); }
function updateXPBar(){ const pct=Math.round((xp/MXP)*100); document.getElementById('xpFill').style.width=pct+'%'; const el=document.getElementById('xpPts'); el.textContent='⭐ '+xp; el.style.transform='scale(1.3)'; setTimeout(()=>el.style.transform='',300); let lv=0; for(let i=0;i<lvls.length;i++) if(xp>=lvls[i].t) lv=i; document.getElementById('xpLvl').textContent=lvls[lv].n; if(lv!==prevLevel){ if(lv>=2) unlockAchievement('nivel3'); if(lv>=5) unlockAchievement('nivel5'); prevLevel=lv; } }
function resetXP(){ sfx('click'); xp=0; updateXPBar(); showToast('🔄 XP reiniciado a 0'); }
function fin(id,showFX=true){ if(!done.has(id)){ done.add(id); const b=document.querySelector(`[data-s="${id}"]`); if(b) b.classList.add('done'); if(showFX){ sfx('up'); launchConfetti(); } saveProgress(); } }

// ===================== NAV =====================
function go(id){ sfx('click'); document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active')); document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{ b.classList.remove('active'); b.setAttribute('aria-selected','false'); }); document.getElementById(id).classList.add('active'); const btn=document.querySelector(`[data-s="${id}"]`); if(btn){ btn.classList.add('active'); btn.setAttribute('aria-selected','true'); } window.scrollTo({top:0,behavior:'smooth'}); if(id==='s-sopa') setTimeout(buildSopa,50); }

// ===================== FLASHCARD DATA =====================
const fcData=[
  {w:'Multiplicar decimales',a:'✖️ se multiplica <strong>como si no hubiera punto</strong>, y al final se le pone. Los puntos no se alinean: eso es de la suma.'},
  {w:'¿Dónde va el punto?',a:'📍 se cuentan las cifras decimales de los <strong>dos factores</strong> y se ponen esas mismas en el producto. 2.5 × 1.3 → dos cifras → <strong>3.25</strong>.'},
  {w:'Cifra decimal',a:'🔢 cada número que va <strong>después del punto</strong>. En 4.07 hay dos: el 0 y el 7.'},
  {w:'Cuando falta lugar',a:'0️⃣ 0.2 × 0.3 = 6, y hacen falta <strong>dos</strong> cifras decimales: se agrega un cero delante y queda <strong>0.06</strong>.'},
  {w:'Multiplicar por 10',a:'➡️ el punto salta <strong>un lugar a la derecha</strong>: 3.47 × 10 = 34.7. Por 100 saltan dos y por 1,000 saltan tres.'},
  {w:'Multiplicar por 0.1',a:'⬅️ el punto salta <strong>un lugar a la izquierda</strong> y el número encoge: 34.7 × 0.1 = 3.47.'},
  {w:'Estimar antes',a:'🎯 4.8 × 2.1 es casi 5 × 2 = 10, así que el resultado tiene que andar por 10. Si sale 100.8, el punto quedó mal puesto.'},
  {w:'Factor',a:'✖️ cada uno de los números que se multiplican. En 2.5 × 4 los factores son 2.5 y 4.'},
  {w:'Producto',a:'🟰 el resultado de la multiplicación. En 2.5 × 4 = 10, el producto es 10.'},
  {w:'Décima, centésima, milésima',a:'📏 la primera cifra después del punto son <strong>décimas</strong>, la segunda <strong>centésimas</strong> y la tercera <strong>milésimas</strong>.'},
  {w:'Multiplicar y encoger',a:'📉 al multiplicar por un decimal <strong>menor que 1</strong> el resultado es MENOR: 40 × 0.5 = 20. Es la mitad, no el doble.'},
  {w:'Decimal a fracción',a:'🍕 0.25 son 25 centésimas: <strong>25/100 = 1/4</strong>. Las cifras después del punto dicen el denominador.'},
  {w:'Precio por cantidad',a:'💵 lo que más se usa en la vida: 3 libras a L 24.50 son 3 × 24.50 = <strong>L 73.50</strong>.'},
  {w:'Comprobar con la calculadora',a:'✅ el currículo lo pide: se hace la cuenta a mano y después se comprueba. Si no coinciden, casi siempre es el punto.'}
];
let fcIdx=0;
function upFC(){ document.getElementById('fcInner').classList.remove('flipped'); document.getElementById('fcW').textContent=fcData[fcIdx].w; document.getElementById('fcA').innerHTML=fcData[fcIdx].a; document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length; }
function flipCard(){ sfx('flip'); document.getElementById('fcInner').classList.toggle('flipped'); if(!xpTracker.fc.has(fcIdx)){ xpTracker.fc.add(fcIdx); pts(1); } if(xpTracker.fc.size===fcData.length){ fin('s-flash'); unlockAchievement('flash_master'); } }
function nextFC(){ sfx('click'); fcIdx=(fcIdx+1)%fcData.length; upFC(); }
function prevFC(){ sfx('click'); fcIdx=(fcIdx-1+fcData.length)%fcData.length; upFC(); }


// ===================== JUEGO: MEMORIA DE LOS NÚMEROS =====================
const memoPairs=[
  {id:'punto',t:'¿Dónde va el punto?',d:'📍 tantas cifras como traigan los dos factores juntos'},
  {id:'cero',t:'Falta lugar',d:'0️⃣ 0.2 × 0.3 = 0.06, con cero delante'},
  {id:'diez',t:'× 10, 100, 1,000',d:'➡️ el punto salta a la derecha'},
  {id:'decimo',t:'× 0.1',d:'⬅️ el punto salta a la izquierda y encoge'},
  {id:'estima',t:'Estimar',d:'🎯 4.8 × 2.1 anda por 10'},
  {id:'lempira',t:'Precio por cantidad',d:'💵 3 × L 24.50 = L 73.50'}
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
  {q:'¿Cuánto es 2.5 × 1.3?',o:['a) 3.25','b) 32.5','c) 0.325','d) 3.8'],c:0},
  {q:'Para multiplicar decimales, ¿qué se hace primero?',o:['a) Alinear los puntos','b) Multiplicar como si no hubiera punto','c) Buscar denominador común','d) Igualar las cifras decimales'],c:1},
  {q:'¿Cuántas cifras decimales lleva el producto de 4.07 × 2.1?',o:['a) Una','b) Dos','c) Tres','d) Cuatro'],c:2},
  {q:'¿Cuánto es 0.2 × 0.3?',o:['a) 0.6','b) 6','c) 0.5','d) 0.06'],c:3},
  {q:'¿Cuánto es 3.47 × 100?',o:['a) 347','b) 34.7','c) 3,470','d) 0.0347'],c:0},
  {q:'Al multiplicar 40 × 0.5, el resultado es…',o:['a) 80','b) 20','c) 40.5','d) 400'],c:1},
  {q:'Sin calcular: 4.9 × 3.1 anda cerca de…',o:['a) 1.5','b) 150','c) 15','d) 0.15'],c:2},
  {q:'Tres libras de queso a L 42.50 la libra cuestan…',o:['a) L 45.50','b) L 12.75','c) L 1,275.00','d) L 127.50'],c:3},
  {q:'El número 0.25 escrito como fracción es…',o:['a) 1/4','b) 25/10','c) 2/5','d) 1/25'],c:0},
  {q:'¿Cuánto es 6.4 × 0.1?',o:['a) 64','b) 0.64','c) 6.5','d) 0.064'],c:1}
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
    label:['Una cifra','Dos cifras'], headA:'1️⃣ El producto lleva 1 decimal', headB:'2️⃣ El producto lleva 2 decimales',
    colA:'una', colB:'dos',
    words:[{w:'0.5 × 3',t:'una'},{w:'0.5 × 0.3',t:'dos'},{w:'1.2 × 4',t:'una'},{w:'1.2 × 0.4',t:'dos'},
           {w:'2.7 × 6',t:'una'},{w:'2.7 × 1.6',t:'dos'},{w:'0.9 × 8',t:'una'},{w:'0.9 × 0.8',t:'dos'}]
  },
  {
    label:['Crece','Encoge'], headA:'📈 El resultado CRECE', headB:'📉 El resultado ENCOGE',
    colA:'crece', colB:'encoge',
    words:[{w:'40 × 2.5',t:'crece'},{w:'40 × 0.5',t:'encoge'},{w:'8 × 1.5',t:'crece'},{w:'8 × 0.25',t:'encoge'},
           {w:'12 × 3.2',t:'crece'},{w:'12 × 0.1',t:'encoge'},{w:'6 × 10.5',t:'crece'},{w:'6 × 0.75',t:'encoge'}]
  },
  {
    label:['A la derecha','A la izquierda'], headA:'➡️ El punto salta a la derecha', headB:'⬅️ El punto salta a la izquierda',
    colA:'der', colB:'izq',
    words:[{w:'4.5 × 10',t:'der'},{w:'4.5 × 0.1',t:'izq'},{w:'0.72 × 100',t:'der'},{w:'0.72 × 0.01',t:'izq'},
           {w:'3.8 × 1,000',t:'der'},{w:'3.8 × 0.001',t:'izq'},{w:'12.6 × 10',t:'der'},{w:'12.6 × 0.1',t:'izq'}]
  },
  {
    label:['Bien puesto','Punto mal puesto'], headA:'✅ El punto está bien', headB:'❌ El punto está mal',
    colA:'bien', colB:'mal',
    words:[{w:'2 × 1.5 = 3',t:'bien'},{w:'2 × 1.5 = 30',t:'mal'},{w:'0.4 × 5 = 2',t:'bien'},{w:'0.4 × 5 = 20',t:'mal'},
           {w:'1.2 × 3 = 3.6',t:'bien'},{w:'1.2 × 3 = 36',t:'mal'},{w:'0.5 × 0.6 = 0.3',t:'bien'},{w:'0.5 × 0.6 = 3',t:'mal'}]
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
  {s:['2.5','×','1.3','=','3.25'],c:4,art:'Toca el PRODUCTO'},
  {s:['En','4.07','hay','dos','cifras','decimales'],c:1,art:'Toca el número que tiene dos cifras decimales'},
  {s:['0.2','×','0.3','=','0.06'],c:4,art:'Toca el resultado que llevó un cero de más'},
  {s:['3.47','×','10','=','34.7'],c:4,art:'Toca el número donde el punto saltó a la derecha'},
  {s:['40','×','0.5','=','20'],c:2,art:'Toca el factor que hace ENCOGER el resultado'},
  {s:['3','libras','a','L','42.50','cuestan','L','127.50'],c:7,art:'Toca lo que se paga en total'},
  {s:['4.9','×','3.1','anda','cerca','de','15'],c:6,art:'Toca la estimación'},
  {s:['0.25','=','25/100','=','1/4'],c:4,art:'Toca la fracción en su mínima expresión'}
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
  {s:'Para multiplicar decimales, primero se multiplica como si ___ punto.',opts:['no hubiera','hubiera más','solo hubiera un'],c:0},
  {s:'El producto lleva tantas cifras decimales como tengan ___ juntos.',opts:['el factor mayor','los dos factores','el resultado'],c:1},
  {s:'En 0.2 × 0.3 el resultado es 0.06 porque hay que agregar un ___.',opts:['punto','factor','cero'],c:2},
  {s:'Al multiplicar por 100, el punto salta dos lugares a la ___.',opts:['derecha','izquierda','mitad'],c:0},
  {s:'Al multiplicar por 0.1, el resultado ___ que el número original.',opts:['es mayor','es menor','es igual'],c:1},
  {s:'Antes de dar el resultado conviene ___ para ver si el punto quedó bien.',opts:['alinear','sumar','estimar'],c:2},
  {s:'La primera cifra después del punto son las ___.',opts:['décimas','centésimas','milésimas'],c:0},
  {s:'El número 0.75 escrito como fracción es ___.',opts:['75/10','3/4','7/5'],c:1}
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
    q: 'Sin calcular: 2.5 × 1.3. ¿Dónde va el punto en el resultado 325?',
    opts: ['32.5', '3.25', '0.325'],
    correct: 1,
    feedback: '¡Correcto! Cada factor trae una cifra decimal, así que el producto lleva dos: 3.25.',
    wrongFeedback: 'Es 3.25. Se cuentan las cifras decimales de los DOS factores: una y una son dos.',
    explore: 'punto'
  },
  {
    q: '¿Cuánto es 0.2 × 0.3?',
    opts: ['0.6', '0.06', '6'],
    correct: 1,
    feedback: '¡Muy bien! 2 × 3 = 6, y hacen falta dos cifras decimales: hay que ponerle un cero delante.',
    wrongFeedback: 'Es 0.06. La cuenta da 6, pero el producto necesita dos cifras decimales, así que se agrega un cero.',
    explore: 'rejilla'
  },
  {
    q: 'Una libra de café cuesta L 42.50. ¿Tres libras costarán más o menos de L 100?',
    opts: ['Menos de L 100', 'Más de L 100', 'Exactamente L 100'],
    correct: 1,
    feedback: '¡Exacto! Cada libra anda por 40, y 3 × 40 ya son 120: pasa de 100. El total es L 127.50.',
    wrongFeedback: 'Son más de L 100: cada libra anda por 40, y 3 × 40 = 120. El total exacto es L 127.50.',
    explore: 'estimar'
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
  if (prediceAnswered.size === prediceData.length) { fin('s-predice'); sfx('fan'); showToast('🔮 ¡Predicciones completadas! Ahora a aprender.'); }
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
function _pdTick(lbl){ const t=document.createElement('div'); t.className='pd-tick'; t.innerHTML=`<div class="pd-rail"></div><div class="pd-dot"></div><div class="pd-lbl">${lbl}</div>`; return t; }
function _buildPredExplore(i,box){
  const type=prediceData[i].explore;
  if(type==='punto'){
    box.innerHTML=`<p class="pd-tip">La cuenta sin punto dio <strong>325</strong>. Toca dónde crees que va el punto:</p><div class="pd-line" id="pd-line-${i}"></div><div class="pd-msg" id="pd-msg-${i}">👆 toca una posición</div>`;
    const line=document.getElementById('pd-line-'+i);
    [['32.5','una cifra decimal'],['3.25','dos cifras decimales'],['0.325','tres cifras decimales']].forEach((op,k)=>{
      const t=_pdTick(op[0]);
      t.onclick=()=>{ sfx('click'); line.querySelectorAll('.pd-tick').forEach(x=>x.classList.remove('pd-on','pd-win'));
        const msg=document.getElementById('pd-msg-'+i);
        if(k===1){ t.classList.add('pd-win'); msg.innerHTML='🎯 ¡Eso es! 2.5 trae una cifra decimal y 1.3 trae otra: <strong>dos en total</strong>, así que el producto es 3.25.'; sfx('ok'); }
        else{ t.classList.add('pd-on'); msg.innerHTML=`🤔 Eso son ${op[1]}, y entre 2.5 y 1.3 hay <strong>dos</strong> cifras decimales en total. Cuenta otra vez.`; } };
      line.appendChild(t);
    });
  } else if(type==='rejilla'){
    box.innerHTML=`<p class="pd-tip">Un cuadro partido en 100 partes. Toca para pintar 0.2 a lo ancho y 0.3 a lo alto:</p><div style="display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;margin:0.5rem 0;"><button class="btn btn-pri" onclick="predRejilla(${i},1)">pintar 0.2 (ancho)</button><button class="btn btn-pri" onclick="predRejilla(${i},2)">pintar 0.3 (alto)</button><button class="btn btn-d" onclick="predRejilla(${i},0)">↩️ borrar</button></div><div class="pd-cnt" id="pd-cnt-${i}" style="text-align:center;"></div><div class="pd-msg" id="pd-msg-${i}">👆 pinta las dos y cuenta los cuadritos morados</div>`;
    predRejilla(i,0);
  } else if(type==='estimar'){
    box.innerHTML=`<p class="pd-tip">L 42.50 la libra. Redondea y calcula de cabeza:</p><div style="display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;margin:0.5rem 0;"><button class="btn btn-pri" onclick="predEstimar(${i},40)">redondear a L 40</button><button class="btn btn-pri" onclick="predEstimar(${i},50)">redondear a L 50</button><button class="btn btn-pri" onclick="predEstimar(${i},0)">el precio exacto</button></div><div class="pd-msg" id="pd-msg-${i}">👆 prueba una estimación</div>`;
  }
}
/* La rejilla de 100 cuadritos es la forma de ver que 0.2 × 0.3 no puede dar
   0.6: lo que se cruza son 6 cuadritos de 100, no 6 de 10. */
function predRejilla(i,paso){
  const cnt=document.getElementById('pd-cnt-'+i), msg=document.getElementById('pd-msg-'+i);
  if(!cnt) return;
  const box=document.getElementById('pd-explore-'+i);
  let est=parseInt(box.dataset.paso||'0',10);
  if(paso===0) est=0; else if(paso===1) est=est|1; else est=est|2;
  box.dataset.paso=String(est);
  let html='<div style="display:inline-grid;grid-template-columns:repeat(10,14px);gap:1px;background:#cfd8dc;padding:1px;border-radius:4px;">';
  for(let f=0;f<10;f++){ for(let c=0;c<10;c++){
    const enA=(est&1)&&c<2, enB=(est&2)&&f<3;
    const col=enA&&enB?'#7e57c2':enA?'#bbdefb':enB?'#ffccbc':'#fff';
    html+=`<div style="width:14px;height:14px;background:${col};border-radius:2px;"></div>`;
  } }
  html+='</div>';
  cnt.innerHTML=html;
  if(paso) sfx('click');
  if((est&3)===3){ msg.innerHTML='🎯 Los cuadritos morados son <strong>6 de 100</strong>, o sea <strong>0.06</strong>. Por eso 0.2 × 0.3 no da 0.6: daría 60 de 100.'; sfx('ok'); }
  else if(est) msg.innerHTML='👆 Ahora pinta la otra y mira dónde se cruzan.';
  else msg.innerHTML='👆 pinta las dos y cuenta los cuadritos morados';
}
function predEstimar(i,p){
  sfx('click');
  const msg=document.getElementById('pd-msg-'+i);
  if(p===0){ msg.innerHTML='🧮 El exacto: 3 × 42.50 = <strong>L 127.50</strong>. Pasa de L 100 con bastante.'; sfx('ok'); }
  else if(p===40){ msg.innerHTML='✅ 3 × 40 = <strong>120</strong>. Ya con eso se pasa de L 100, y el precio real es un poco más alto todavía.'; sfx('ok'); }
  else{ msg.innerHTML='📈 3 × 50 = <strong>150</strong>. Redondeaste hacia arriba, así que el resultado real es algo menos, pero igual pasa de L 100.'; }
}

// ===================== RETO FINAL (con parejas variables) =====================
const retoPairs=[
  {
    name:'Producto vs número ✖️', hint:'Calcula A y compárala con B',
    pool:[
      {w:'A: 2.5 × 4 vs B: 10',t:'igual'},{w:'A: 0.5 × 8 vs B: 6',t:'menor'},{w:'A: 1.5 × 6 vs B: 8',t:'mayor'},
      {w:'A: 1.2 × 5 vs B: 6',t:'igual'},{w:'A: 0.25 × 8 vs B: 4',t:'menor'},{w:'A: 2.5 × 6 vs B: 12',t:'mayor'},
      {w:'A: 0.75 × 4 vs B: 3',t:'igual'},{w:'A: 0.1 × 40 vs B: 8',t:'menor'},{w:'A: 3.5 × 4 vs B: 12',t:'mayor'},
      {w:'A: 1.25 × 4 vs B: 5',t:'igual'},{w:'A: 0.2 × 15 vs B: 5',t:'menor'},{w:'A: 4.5 × 2 vs B: 8',t:'mayor'}
    ]
  },
  {
    name:'Saltos del punto ➡️', hint:'Multiplicar por 10, 100 o 0.1 solo mueve el punto',
    pool:[
      {w:'A: 3.4 × 10 vs B: 34',t:'igual'},{w:'A: 3.4 × 0.1 vs B: 1',t:'menor'},{w:'A: 0.56 × 100 vs B: 50',t:'mayor'},
      {w:'A: 0.75 × 100 vs B: 75',t:'igual'},{w:'A: 12.5 × 0.1 vs B: 2',t:'menor'},{w:'A: 2.8 × 10 vs B: 25',t:'mayor'},
      {w:'A: 0.09 × 100 vs B: 9',t:'igual'},{w:'A: 4.2 × 0.01 vs B: 0.1',t:'menor'},{w:'A: 1.5 × 1,000 vs B: 1,000',t:'mayor'},
      {w:'A: 6.7 × 10 vs B: 67',t:'igual'},{w:'A: 0.8 × 0.1 vs B: 0.5',t:'menor'},{w:'A: 0.35 × 1,000 vs B: 300',t:'mayor'}
    ]
  },
  {
    name:'Compras en lempiras 💵', hint:'Multiplica el precio por la cantidad y compara con B',
    pool:[
      {w:'A: 4 panes de L 2.50 vs B: L 10',t:'igual'},{w:'A: 3 jugos de L 12.50 vs B: L 40',t:'menor'},{w:'A: 5 libras de L 22.50 vs B: L 100',t:'mayor'},
      {w:'A: 2 libras de L 42.50 vs B: L 85',t:'igual'},{w:'A: 6 rosquillas de L 1.50 vs B: L 10',t:'menor'},{w:'A: 4 kilos de L 27.50 vs B: L 100',t:'mayor'},
      {w:'A: 3 cuadernos de L 15.50 vs B: L 46.50',t:'igual'},{w:'A: 2 refrescos de L 18.50 vs B: L 40',t:'menor'},{w:'A: 5 mangos de L 6.50 vs B: L 30',t:'mayor'},
      {w:'A: 8 huevos de L 4.25 vs B: L 34',t:'igual'},{w:'A: 4 bolsas de L 9.75 vs B: L 40',t:'menor'},{w:'A: 3 platos de L 45.50 vs B: L 130',t:'mayor'}
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
// Tareas autogeneradas: el estudiante se autoasigna práctica desde casa o el
// docente las copia en el pizarrón. Cada "⚡ Generar" crea ejercicios nuevos
// y las respuestas quedan ocultas hasta presionar "👁 Respuestas".
function _tgRint(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
function _tgLines(n){ let s=''; for(let i=0;i<n;i++) s+='<div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.4rem;height:1.3rem;">&nbsp;</div>'; return s; }
function _tgTask(out,i,inner){ const div=document.createElement('div'); div.className='tg-task'; div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content">${inner}</div>`; out.appendChild(div); }
const pensamientoTaskDB=[
  {q:'Sin calcular, ¿cuál da más: 8 × 0.9 o 8 × 1.1? Explica por qué.',a:'8 × 1.1, porque 1.1 es más que un entero. El otro encoge: da 7.2 contra 8.8.'},
  {q:'Un pantalón cuesta L 350 y está con 0.25 de descuento. ¿Cuánto se rebaja y cuánto se paga?',a:'350 × 0.25 = L 87.50 de rebaja; se pagan L 262.50.'},
  {q:'¿Puede el producto de dos decimales ser menor que los dos? Da un ejemplo.',a:'Sí: 0.5 × 0.4 = 0.2, que es menor que 0.5 y que 0.4. Pasa cuando los dos son menores que 1.'},
  {q:'Con 2.5 metros de tela a L 68.50 el metro, ¿alcanzan L 150?',a:'2.5 × 68.50 = L 171.25, así que no alcanzan: faltan L 21.25.'},
  {q:'Explica por qué multiplicar por 0.1 es lo mismo que dividir entre 10.',a:'0.1 es una décima parte, así que tomar 0.1 de un número es partirlo en 10 y quedarse con una parte.'},
  {q:'Marta escribió 1.5 × 4 = 60. ¿Qué le pasó y cuánto es de verdad?',a:'Multiplicó 15 × 4 = 60 y se olvidó del punto. El resultado lleva una cifra decimal: 6.0, o sea 6.'},
  {q:'Una pulpería vende 12 refrescos al día a L 15.50. ¿Cuánto recibe en una semana?',a:'12 × 15.50 = L 186 al día; por 7 días son L 1,302.'},
  {q:'¿Cuántas cifras decimales tendrá el producto de 0.125 × 0.4 antes de quitar los ceros del final?',a:'Cuatro: tres del primero y una del segundo. Da 0.0500, que se escribe 0.05.'}
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
function genTask(){ sfx('click'); const type=document.getElementById('tgType').value; const count=parseInt(document.getElementById('tgCount').value); ansVisible=false; const out=document.getElementById('tgOut'); out.innerHTML=''; if(type==='multdec') genMultiplosTask(out,count); else if(type==='pordiez') genDivisoresTask(out,count); else if(type==='punto') genParImparTask(out,count); else if(type==='compras') genPrimosTask(out,count); else if(type==='estima') genFactorizarTask(out,count); else if(type==='pensamiento') genPensamientoTask(out,count); fin('s-tareas'); }
function _instrBlock(out,title,lines){ const ib=document.createElement('div'); ib.className='tg-instruction-block'; ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join(''); out.appendChild(ib); }
// ✖️ Multiplicar dos decimales (aleatorio: nunca se repite)
function genMultDecTask(out,count){
  _instrBlock(out,'✖️ Multiplica y coloca el punto',['Multiplica como si no hubiera punto.','Cuenta las cifras decimales de los dos factores y ponlas en el resultado.']);
  for(let i=0;i<count;i++){
    const a=(_tgRint(11,99)/10), b=(_tgRint(11,99)/10);
    _tgTask(out,i,`<div class="tg-op">${a} × ${b} = ________</div><div class="tg-answer" style="display:${ansVisible?'block':'none'}">R/ ${_decMul(a,b)}</div>`);
  }
}
// ➡️ Multiplicar por 10, 100 y 1,000
function genPorDiezTask(out,count){
  _instrBlock(out,'➡️ Multiplica por 10, 100 o 1,000',['El punto salta a la derecha tantos lugares como ceros tenga el número.','Si se acaban las cifras, se agregan ceros.']);
  for(let i=0;i<count;i++){
    const a=(_tgRint(105,999)/100), k=[10,100,1000][_tgRint(0,2)];
    _tgTask(out,i,`<div class="tg-op">${a} × ${k.toLocaleString('en-US')} = ________</div><div class="tg-answer" style="display:${ansVisible?'block':'none'}">R/ ${_decMul(a,k)}</div>`);
  }
}
// 📍 Colocar el punto en un producto ya calculado
function genPuntoTask(out,count){
  _instrBlock(out,'📍 ¿Dónde va el punto?',['La cuenta ya está hecha sin el punto.','Escribe el resultado con el punto en su lugar.']);
  for(let i=0;i<count;i++){
    const a=(_tgRint(12,98)/10), b=(_tgRint(12,98)/10);
    const crudo=Math.round(a*10)*Math.round(b*10);
    _tgTask(out,i,`<div class="tg-op">${a} × ${b} · la cuenta dio ${crudo} → ________</div><div class="tg-answer" style="display:${ansVisible?'block':'none'}">R/ ${_decMul(a,b)} (dos cifras decimales)</div>`);
  }
}
// 💵 Compras en la pulpería
function genComprasTask(out,count){
  _instrBlock(out,'💵 Compras en la pulpería',['Multiplica el precio por la cantidad.','Escribe el total en lempiras, con sus dos decimales.']);
  const cosas=['libras de arroz','libras de frijoles','panes','refrescos','cuadernos','libras de azúcar','mangos'];
  for(let i=0;i<count;i++){
    const p=(_tgRint(150,4950)/100), k=_tgRint(2,9);
    const c=cosas[_tgRint(0,cosas.length-1)];
    _tgTask(out,i,`<div class="tg-op">${k} ${c} a L ${p.toFixed(2)} cada uno = L ________</div><div class="tg-answer" style="display:${ansVisible?'block':'none'}">R/ L ${(Math.round(p*100)*k/100).toFixed(2)}</div>`);
  }
}
// 🎯 Estimar con números redondos
function genEstimaTask(out,count){
  _instrBlock(out,'🎯 Estima antes de calcular',['Redondea los dos factores al entero más cercano.','Escribe cuánto anda el resultado, sin hacer la cuenta exacta.']);
  for(let i=0;i<count;i++){
    const a=(_tgRint(11,99)/10), b=(_tgRint(11,99)/10);
    _tgTask(out,i,`<div class="tg-op">${a} × ${b} anda cerca de ________</div><div class="tg-answer" style="display:${ansVisible?'block':'none'}">R/ cerca de ${Math.round(a)*Math.round(b)} (exacto: ${_decMul(a,b)})</div>`);
  }
}
function toggleAns(){ ansVisible=!ansVisible; document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none'); sfx('click'); }

// ===================== SOPA DE LETRAS (multidireccional, con inversas) =====================
const sopaSets=[
  {
    size:10,
    grid:[
      ['V','C','V','G','U','F','C','C','Z','A'],
      ['O','M','O','T','N','U','P','F','T','C'],
      ['H','T','I','C','C','D','L','A','E','R'],
      ['L','Z','C','L','N','L','I','N','I','B'],
      ['A','C','F','U','R','O','T','C','A','F'],
      ['M','E','I','P','D','E','B','T','L','A'],
      ['I','R','L','C','S','O','Z','E','M','S'],
      ['C','O','B','I','H','S','R','R','N','T'],
      ['E','B','M','L','R','M','L','P','E','N'],
      ['D','A','P','C','H','B','D','E','V','O']
    ],
    words:[
      {w:'DECIMAL',cells:[[9,0],[8,0],[7,0],[6,0],[5,0],[4,0],[3,0]]},
      {w:'PRODUCTO',cells:[[8,7],[7,6],[6,5],[5,4],[4,3],[3,2],[2,1],[1,0]]},
      {w:'CENTESIMA',cells:[[1,9],[2,8],[3,7],[4,6],[5,5],[6,4],[7,3],[8,2],[9,1]]},
      {w:'FACTOR',cells:[[4,9],[4,8],[4,7],[4,6],[4,5],[4,4]]},
      {w:'PUNTO',cells:[[1,6],[1,5],[1,4],[1,3],[1,2]]},
      {w:'CERO',cells:[[4,1],[5,1],[6,1],[7,1]]}
    ]
  },
  {
    size:10,
    grid:[
      ['L','E','H','N','H','T','O','M','C','O'],
      ['C','S','M','L','N','R','R','N','R','R'],
      ['S','T','I','V','E','V','P','E','H','B'],
      ['D','I','L','A','F','M','T','T','A','L'],
      ['U','M','E','L','C','N','P','V','N','G'],
      ['Z','A','S','O','E','G','N','I','E','D'],
      ['T','R','I','R','G','T','A','I','R','Z'],
      ['N','F','M','I','T','R','L','M','F','A'],
      ['L','V','A','E','O','Z','A','C','O','H'],
      ['S','A','H','A','M','I','C','E','D','C']
    ],
    words:[
      {w:'MILESIMA',cells:[[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2]]},
      {w:'LEMPIRA',cells:[[1,3],[2,4],[3,5],[4,6],[5,7],[6,8],[7,9]]},
      {w:'ESTIMAR',cells:[[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1]]},
      {w:'DECIMA',cells:[[9,8],[9,7],[9,6],[9,5],[9,4],[9,3]]},
      {w:'COMA',cells:[[9,9],[8,8],[7,7],[6,6]]},
      {w:'ENTERO',cells:[[5,4],[4,5],[3,6],[2,7],[1,8],[0,9]]},
      {w:'VALOR',cells:[[2,3],[3,3],[4,3],[5,3],[6,3]]}
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
  {q:'Para multiplicar decimales hay que alinear los puntos, como en la suma.',a:false},
  {q:'El producto lleva tantas cifras decimales como tengan los dos factores juntos.',a:true},
  {q:'El resultado de 2.5 × 1.3 es 3.25.',a:true},
  {q:'0.2 × 0.3 es igual a 0.6.',a:false},
  {q:'Al multiplicar por 10, el punto se corre un lugar a la derecha.',a:true},
  {q:'Al multiplicar por 0.1, el número se hace más grande.',a:false},
  {q:'40 × 0.5 da 20.',a:true},
  {q:'Estimar con números redondos sirve para saber si el punto quedó bien puesto.',a:true},
  {q:'El número 0.25 equivale a la fracción 1/4.',a:true},
  {q:'En 4.07 hay tres cifras decimales.',a:false},
  {q:'Multiplicar 3.47 por 100 da 347.',a:true},
  {q:'Cuando el producto necesita más cifras decimales de las que tiene, se agregan ceros a la izquierda.',a:true},
  {q:'Multiplicar siempre da un resultado mayor que los dos factores.',a:false},
  {q:'Tres libras a L 42.50 cuestan L 127.50.',a:true},
  {q:'El punto del producto se pone donde estaba en el factor más grande.',a:false}
];
const evalMCBank=[
  {q:'¿Cuánto es 3.2 × 1.5?',o:['a) 4.80','b) 48','c) 0.48','d) 4.7'],a:0},
  {q:'¿Cuántas cifras decimales tiene el producto de 1.25 × 0.4?',o:['a) Dos','b) Tres','c) Una','d) Cuatro'],a:1},
  {q:'¿Cuánto es 0.4 × 0.2?',o:['a) 0.8','b) 8','c) 0.08','d) 0.6'],a:2},
  {q:'¿Cuánto es 5.63 × 100?',o:['a) 56.3','b) 5,630','c) 0.0563','d) 563'],a:3},
  {q:'¿Cuánto es 24 × 0.5?',o:['a) 12','b) 48','c) 24.5','d) 2.4'],a:0},
  {q:'Sin calcular: 9.8 × 4.1 anda cerca de…',o:['a) 4','b) 40','c) 400','d) 0.4'],a:1},
  {q:'Cuatro libras de azúcar a L 16.25 cuestan…',o:['a) L 20.25','b) L 6.50','c) L 65.00','d) L 650.00'],a:2},
  {q:'El decimal 0.5 escrito como fracción es…',o:['a) 5/100','b) 1/5','c) 5/10 y no se puede reducir','d) 1/2'],a:3},
  {q:'¿Cuál de estas operaciones da un resultado MENOR que 30?',o:['a) 30 × 0.9','b) 30 × 1.1','c) 30 × 2','d) 30 × 1.5'],a:0},
  {q:'¿Cuánto es 7.5 × 0.1?',o:['a) 75','b) 0.75','c) 7.6','d) 0.075'],a:1},
  {q:'Un producto tiene que llevar tres cifras decimales y la cuenta dio 45. ¿Cómo se escribe?',o:['a) 45.000','b) 4.500','c) 0.045','d) 450'],a:2},
  {q:'¿Cuánto es 1.2 × 1.2?',o:['a) 2.4','b) 14.4','c) 1.4','d) 1.44'],a:3},
  {q:'¿Qué error hay en «0.3 × 0.4 = 1.2»?',o:['a) El punto quedó mal: son 0.12','b) La multiplicación está mal hecha','c) Faltó alinear los puntos','d) Ninguno, está bien'],a:0},
  {q:'¿Cuánto es 0.06 × 10?',o:['a) 0.006','b) 0.6','c) 6','d) 60'],a:1},
  {q:'Media libra de queso a L 45.00 la libra cuesta…',o:['a) L 90.00','b) L 45.50','c) L 22.50','d) L 4.50'],a:2}
];
const evalCPBank=[
  {q:'Para multiplicar decimales se multiplica primero como si no hubiera ___.',a:'punto'},
  {q:'El producto lleva tantas cifras decimales como tengan los dos ___ juntos.',a:'factores'},
  {q:'El resultado de 2.5 × 1.3 es ___.',a:'3.25'},
  {q:'El resultado de 0.2 × 0.3 es ___.',a:'0.06'},
  {q:'Al multiplicar por 10 el punto salta un lugar a la ___.',a:'derecha'},
  {q:'Al multiplicar por 0.1 el punto salta un lugar a la ___.',a:'izquierda'},
  {q:'El resultado de 3.47 × 100 es ___.',a:'347'},
  {q:'Cuando faltan lugares para las cifras decimales se agregan ___ a la izquierda.',a:'ceros'},
  {q:'La primera cifra después del punto son las ___.',a:'décimas'},
  {q:'El resultado de 40 × 0.5 es ___.',a:'20'},
  {q:'Comprobar con números redondos antes de dar el resultado se llama ___.',a:'estimar'},
  {q:'El decimal 0.25 escrito como fracción reducida es ___.',a:'1/4'},
  {q:'Tres libras a L 42.50 cuestan L ___.',a:'127.50'},
  {q:'Al multiplicar por un decimal menor que 1 el resultado ___ (crece o encoge).',a:'encoge'},
  {q:'El resultado de 1.2 × 1.2 es ___.',a:'1.44'}
];
const evalPRBank=[
  {term:'Multiplicar decimales',def:'Multiplicar como si no hubiera punto y ponerlo al final'},
  {term:'Cifra decimal',def:'Cada número que va después del punto'},
  {term:'Factor',def:'Cada uno de los números que se multiplican'},
  {term:'Producto',def:'El resultado de la multiplicación'},
  {term:'Décima',def:'La primera cifra después del punto'},
  {term:'Centésima',def:'La segunda cifra después del punto'},
  {term:'Milésima',def:'La tercera cifra después del punto'},
  {term:'Multiplicar por 10',def:'El punto salta un lugar a la derecha'},
  {term:'Multiplicar por 0.1',def:'El punto salta un lugar a la izquierda'},
  {term:'Estimar',def:'Calcular con números redondos para ver si el resultado es razonable'},
  {term:'Cero de relleno',def:'El que se agrega cuando faltan lugares decimales, como en 0.06'},
  {term:'Decimal menor que 1',def:'Factor que hace encoger el resultado'},
  {term:'0.25',def:'El decimal que equivale a un cuarto'},
  {term:'0.5',def:'El decimal que equivale a la mitad'},
  {term:'Precio por cantidad',def:'Multiplicación que resuelve una compra'}
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación Multiplicación de Decimales · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:12pt;color:#111;background:#fff;padding:4mm 6mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.5rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;color:#1565c0;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:#1565c0;margin-top:0.15rem;font-weight:700;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.5rem 0 0.25rem;border-left:4px solid #1565c0;background:#e3f2fd;display:flex;justify-content:space-between;align-items:center;color:#1565c0;}.qn{font-weight:700;min-width:22px;flex-shrink:0;color:#1565c0;}.tf-row{display:flex;align-items:flex-start;gap:0.3rem;font-size:10.5pt;line-height:1.4;padding:0.25rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:42px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.2rem;margin-top:0.2rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.28rem 0.45rem;margin-bottom:0.22rem;break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.4;display:flex;gap:0.3rem;margin-bottom:0.18rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.22rem 0.55rem;}.mc-opts{display:grid;grid-template-columns:repeat(3,1fr);gap:0.08rem 0.25rem;margin-left:1.3rem;}.mc-opt{font-size:9.5pt;display:flex;align-items:center;gap:0.22rem;}.mc-opt input{width:12px;height:12px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.4;padding:0.22rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:130px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{break-inside:avoid;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.2rem 0.5rem;margin-top:0.15rem;}.pr-head{font-size:9pt;font-weight:700;color:#1565c0;margin-bottom:0.2rem;}.pr-item{font-size:10pt;padding:0.22rem 0.32rem;background:#e3f2fd;border-radius:3px;margin-bottom:0.12rem;display:flex;align-items:center;gap:0.22rem;line-height:1.2;}.pr-num{font-weight:700;color:#1565c0;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #1565c0;padding-bottom:0.35rem;margin-bottom:0.5rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;color:#1565c0;}.p-sub{font-size:9pt;color:#1565c0;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #cce0ff;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;color:#1565c0;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#1565c0;}.pa{color:#007a00;font-weight:700;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:#1565c0;font-weight:700;font-style:italic;}.obt-lbl{font-weight:700;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #1565c0;height:12px;}.obt-pct{font-weight:700;}.total-row{display:flex;align-items:baseline;justify-content:flex-end;gap:7px;font-size:11pt;color:#1565c0;font-weight:700;font-style:italic;margin-top:0.4rem;padding:0.2rem 0.5rem;background:#e3f2fd;border-radius:4px;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #1565c0;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · Misión Multiplicación de Decimales · Matemática</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 4 secciones × 5 preguntas × 5 pts c/u · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✔ PAUTA DOCENTE — Evaluación Final · Multiplicación de Decimales · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">100 pts | 4 secciones × 5 preguntas × 5 pts | Matemáticas · Educación Básica</div></div><div class="p-grid">${pR}</div>
  ${zgBlock}</div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("evalPage",252,0.55,1.45);fit("pautaPage",252,0.55,1.3);})();</script></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(doc); win.document.close(); setTimeout(()=>win.print(),400);
}

// ===================== EXPLICA CON TUS PALABRAS =====================
const explicaData = [
  {
    q: 'Un compañero alineó los puntos de 2.5 y 1.3 como si fuera una suma, y le dio 3.8. Explícale qué pasó.',
    hint: '💡 Pista: alinear puntos es para sumar y restar.',
    rubric: ['✓ Aclara que sumó en vez de multiplicar', '✓ Explica que al multiplicar no se alinea nada', '✓ Da el resultado correcto: 3.25'],
    suggested: 'Lo que hizo fue sumar: 2.5 + 1.3 sí da 3.8. Alinear los puntos es para sumar y restar. Al multiplicar se hace 25 × 13 = 325 como si no hubiera punto, y como entre los dos factores hay dos cifras decimales, el resultado es 3.25.'
  },
  {
    q: 'Explica por qué 0.2 × 0.3 da 0.06 y no 0.6.',
    hint: '💡 Pista: cuenta las cifras decimales que tienen que quedar.',
    rubric: ['✓ Multiplica 2 × 3 = 6', '✓ Cuenta dos cifras decimales entre los dos factores', '✓ Explica que hay que agregar un cero delante del 6'],
    suggested: 'Primero multiplico como si no hubiera punto: 2 × 3 = 6. Después cuento las cifras decimales: 0.2 tiene una y 0.3 tiene otra, así que el resultado necesita dos. Con un solo 6 no alcanza, hay que ponerle un cero delante: 0.06.'
  },
  {
    q: 'Sin hacer la cuenta, explica cómo sabes que 4.8 × 2.1 no puede dar 100.8.',
    hint: '💡 Pista: estima con números redondos.',
    rubric: ['✓ Redondea a 5 × 2', '✓ Concluye que el resultado anda por 10', '✓ Explica que 100.8 es diez veces más: el punto quedó mal'],
    suggested: '4.8 es casi 5 y 2.1 es casi 2, así que el resultado tiene que andar por 5 × 2 = 10. Si me da 100.8 es diez veces más de lo que debería: el punto quedó un lugar corrido. El resultado correcto es 10.08.'
  },
  {
    q: 'En la pulpería, una libra de frijoles cuesta L 18.75. Inventa un problema con ese precio y resuélvelo.',
    hint: '💡 Pista: cuántas libras compra alguien de verdad.',
    rubric: ['✓ El contexto es real y usa el precio dado', '✓ Plantea la multiplicación', '✓ Resuelve bien y escribe el resultado en lempiras'],
    suggested: '"Mi mamá compró 4 libras de frijoles a L 18.75 la libra. ¿Cuánto pagó?" Multiplico 1875 × 4 = 7500 y pongo dos cifras decimales: L 75.00.'
  },
  {
    q: '¿Por qué 40 × 0.5 da 20, si multiplicar siempre debería agrandar?',
    hint: '💡 Pista: qué parte de 40 es 0.5.',
    rubric: ['✓ Reconoce que 0.5 es la mitad de un entero', '✓ Explica que multiplicar por menos de 1 encoge', '✓ Comprueba: la mitad de 40 es 20'],
    suggested: 'Multiplicar siempre agranda solo cuando se multiplica por un número mayor que 1. El 0.5 es la mitad de un entero, así que tomar 0.5 de 40 es quedarse con la mitad: 20. Con decimales menores que 1 el resultado siempre encoge.'
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

// ===================== PRUEBA OPERATIVA — MULTIPLICACIÓN DE DECIMALES =====================

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
function _fmtNum(n) { return n.toLocaleString('en-US'); }
function _isIntMatch(student, expectedNum) {
  const raw = (student || '').toString().trim().replace(/[,\s]/g, '');
  if (!raw) return false;
  const n = parseInt(raw, 10);
  return !isNaN(n) && n === expectedNum;
}
/* Se comparan sin espacios: «3 / 4» y «3/4» son la misma respuesta, y
   pelear con la barra espaciadora no es lo que se está evaluando. */
function _isTxtMatch(student, accepted) { const z = s => _normTxt(s).replace(/\s+/g, ''); const v = z(student); return !!v && accepted.some(a => z(a) === v); }
function _sumaCifras(n) { return String(n).split('').reduce((a, c) => a + parseInt(c, 10), 0); }
function _mcmDe(a, b) { let m = a; while (m % b !== 0) m += a; return m; }

// I. Multiplica y coloca el punto (5 × 4 = 20 pts) — Bloques 1, 2 y 4
const _DEC_PRECIOS = [12.50, 18.75, 22.50, 24.25, 32.50, 42.50, 15.50, 9.75];
const _DEC_POT = [10, 100, 1000];
function genMultDivItems() {
  const items = [];
  { const a = _decNoRedondo(11, 99, 10, _opRint), b = _decNoRedondo(11, 99, 10, _opRint);
    items.push({ text: `Multiplica y coloca el punto: ${a} × ${b} =`, ansTxt: _decAcc(_decMul(a, b)), ansShow: _decMul(a, b) }); }
  { const a = _decNoRedondo(101, 999, 100, _opRint), k = _opRint(2, 9);
    items.push({ text: `Multiplica por un número natural: ${a} × ${k} =`, ansTxt: _decAcc(_decMul(a, k)), ansShow: _decMul(a, k) }); }
  { const a = _opRint(1, 9) / 10, b = _opRint(1, 9) / 10;
    items.push({ text: `Cuidado con los ceros: ${a} × ${b} =`, ansTxt: _decAcc(_decMul(a, b)), ansShow: _decMul(a, b) }); }
  { const a = _decNoRedondo(105, 995, 100, _opRint), k = _DEC_POT[_opRint(0, 2)];
    items.push({ text: `El punto salta: ${a} × ${_fmtNum(k)} =`, ansTxt: _decAcc(_decMul(a, k)), ansShow: _decMul(a, k) }); }
  { const a = _decNoRedondo(11, 99, 10, _opRint), b = _decNoRedondo(101, 999, 100, _opRint);
    items.push({ text: `Tres cifras decimales: ${a} × ${b} =`, ansTxt: _decAcc(_decMul(a, b)), ansShow: _decMul(a, b) }); }
  return items;
}

// II. Radar del punto (5 × 2 = 10 pts) — Bloque 3, Bloque 5 (tabla de criterios) y widget Radar Par-Impar
function genRadarItems() {
  const items = [];
  const tipos = _shuffleF([0, 1, 2, 3, 4], _opRnd);
  tipos.forEach(tp => {
    if (tp === 0) {
      const a = _decNoRedondo(11, 99, 10, _opRint), b = _decNoRedondo(11, 99, 10, _opRint);
      const n = String(a).length - 2 + String(b).length - 2;
      items.push({ text: `¿Cuántas cifras decimales lleva el producto de ${a} × ${b}? Escribe solo el número.`, ansTxt: [String(n), n === 2 ? 'dos' : 'una'], ansShow: `${n} — una de cada factor` });
    } else if (tp === 1) {
      const a = _opRint(101, 999) / 100, k = _DEC_POT[_opRint(0, 2)];
      items.push({ text: `¿Hacia dónde salta el punto en ${a} × ${_fmtNum(k)}? Escribe <em>derecha</em> o <em>izquierda</em>.`, ansTxt: ['derecha'], ansShow: `derecha — el resultado es ${_decMul(a, k)}` });
    } else if (tp === 2) {
      const a = _decNoRedondo(11, 99, 10, _opRint), f = [0.1, 0.01][_opRint(0, 1)];
      items.push({ text: `¿El resultado de ${a} × ${f} es mayor o menor que ${a}? Escribe <em>mayor</em> o <em>menor</em>.`, ansTxt: ['menor'], ansShow: `menor — ${f} es menos que un entero: da ${_decMul(a, f)}` });
    } else if (tp === 3) {
      const a = _decNoRedondo(11, 99, 10, _opRint), b = _decNoRedondo(11, 99, 10, _opRint);
      items.push({ text: `Estima con números redondos: ¿cerca de cuánto anda ${a} × ${b}? Escribe solo el número estimado.`, ansTxt: [String(Math.round(a) * Math.round(b))], ansShow: `${Math.round(a) * Math.round(b)} — el exacto es ${_decMul(a, b)}` });
    } else {
      const a = _opRint(1, 9) / 10, b = _opRint(1, 9) / 10;
      items.push({ text: `¿Cuántos ceros hay que agregar delante en ${a} × ${b}? Escribe <em>uno</em> o <em>ninguno</em>.`, ansTxt: (Math.round(a * 10) * Math.round(b * 10) < 10) ? ['uno', '1'] : ['ninguno', '0'], ansShow: (Math.round(a * 10) * Math.round(b * 10) < 10 ? 'uno' : 'ninguno') + ` — el resultado es ${_decMul(a, b)}` });
    }
  });
  return items;
}

// III. ¿Qué se esconde en ▢? (5 × 4 = 20 pts): la operación inversa, que delata si entendió dónde va el punto
function genReglaItems() {
  const items = [];
  const forms = _shuffleF([0, 1, 2, 3, _opRint(0, 3)], _opRnd);
  forms.forEach(f => {
    let expr, hint, ansTxt, ansShow;
    if (f === 0) { const a = _decNoRedondo(11, 99, 10, _opRint), k = _opRint(2, 9);
      expr = `${a} × ▢ = ${_decMul(a, k)}`; hint = 'el punto no se movió de lugar'; ansTxt = [String(k)]; ansShow = String(k); }
    else if (f === 1) { const a = _decNoRedondo(105, 995, 100, _opRint), k = _DEC_POT[_opRint(0, 2)];
      expr = `${a} × ▢ = ${_decMul(a, k)}`; hint = 'cuenta cuántos lugares saltó el punto'; ansTxt = [String(k), _fmtNum(k)]; ansShow = _fmtNum(k); }
    else if (f === 2) { const b = _decNoRedondo(11, 99, 10, _opRint), k = _opRint(2, 9);
      expr = `▢ × ${b} = ${_decMul(b, k)}`; hint = 'es un número natural'; ansTxt = [String(k)]; ansShow = String(k); }
    else { const a = _opRint(1, 9) / 10, b = _opRint(1, 9) / 10;
      expr = `${a} × ${b} = ▢`; hint = 'ojo con el cero de relleno'; ansTxt = _decAcc(_decMul(a, b)); ansShow = _decMul(a, b); }
    items.push({ expr, hint, ansTxt, ansShow });
  });
  return items;
}

// IV. Problemas de la vida real (3 × 10 = 30 pts): compras, metros de tela y el vuelto
const OP_NAMES = ['Ana', 'Luis', 'Marta', 'José', 'Carmen', 'Pedro', 'Sofía', 'Iván'];
const OP_OBJS = ['mangos', 'tortillas', 'rosquillas', 'naranjas', 'elotes', 'semillas de café'];
const _VI_COSAS = [['libras de arroz', 'arroz'], ['libras de frijoles', 'frijoles'], ['cuadernos', 'útiles'], ['refrescos', 'la tienda'], ['libras de azúcar', 'azúcar']];
const _VI_METROS = [[2.5, 'tela'], [1.5, 'lazo'], [3.5, 'manguera'], [4.5, 'cinta']];
/* En lempiras nunca hay tres decimales: los totales se escriben con dos. */
function _lps(x){ return 'L ' + (Math.round(x * 100) / 100).toFixed(2); }
function genVidaItems() {
  const items = [];
  { const nom = OP_NAMES[_opRint(0, OP_NAMES.length - 1)];
    const p = _DEC_PRECIOS[_opRint(0, _DEC_PRECIOS.length - 1)], k = _opRint(3, 9);
    const c = _VI_COSAS[_opRint(0, _VI_COSAS.length - 1)][0];
    items.push({ text: `${nom} compró ${k} ${c} a L ${p.toFixed(2)} cada uno. ¿Cuánto pagó en total? Escribe solo el número.`, ansTxt: [..._decAcc(_decMul(p, k)), (Math.round(p * 100) * k / 100).toFixed(2)], ansShow: _lps(Math.round(p * 100) * k / 100), just: `${k} × ${p.toFixed(2)}` }); }
  { const t = _VI_METROS[_opRint(0, _VI_METROS.length - 1)];
    const p = [12.50, 22.50, 42.50, 15.50, 18.00, 25.00][_opRint(0, 5)];
    items.push({ text: `Un metro de ${t[1]} cuesta L ${p.toFixed(2)}. ¿Cuánto cuestan ${t[0]} metros?`, ansTxt: [..._decAcc(_decMul(p, t[0])), (Math.round(p * t[0] * 100) / 100).toFixed(2)], ansShow: _lps(p * t[0]), just: `${t[0]} × ${p.toFixed(2)}` }); }
  { const p = _DEC_PRECIOS[_opRint(0, _DEC_PRECIOS.length - 1)], k = _opRint(4, 8);
    const total = Number(_decMul(p, k)), paga = Math.floor(total / 50) * 50 + 50;
    items.push({ text: `Se compran ${k} unidades de L ${p.toFixed(2)} y se paga con L ${paga}. ¿Cuánto le devuelven de vuelto?`, ansTxt: [..._decAcc(_decFmt(paga - total, 2)), (paga - total).toFixed(2)], ansShow: _lps(paga - total), just: `${paga} − ${total.toFixed(2)}` }); }
  return items;
}

// V. Retos de pensamiento crítico (5 + 5 + 10 = 20 pts): el punto olvidado, el factor que encoge y una compra de dos pasos
const _RT_MALPUNTO = [[1.5, 4, '60'], [2.5, 3, '75'], [0.5, 8, '40'], [1.2, 5, '60'], [3.5, 2, '70']];
const _RT_ENCOGE = [[40, 0.5], [30, 0.1], [24, 0.25], [50, 0.2], [80, 0.75]];
const _RT_CEROS = [[0.2, 0.3], [0.1, 0.4], [0.2, 0.2], [0.3, 0.3], [0.1, 0.9]];
function genRetoItems() {
  const items = [];
  { const c = _RT_MALPUNTO[_opRint(0, _RT_MALPUNTO.length - 1)];
    items.push({ text: `Un compañero escribió ${c[0]} × ${c[1]} = ${c[2]}: multiplicó bien pero se olvidó del punto. Escribe el resultado correcto.`, ansTxt: _decAcc(_decMul(c[0], c[1])), ansShow: _decMul(c[0], c[1]), pts: 5 }); }
  { const c = _RT_ENCOGE[_opRint(0, _RT_ENCOGE.length - 1)];
    items.push({ text: `Sin calcular: ¿${c[0]} × ${c[1]} da más o menos que ${c[0]}? Escribe <em>más</em> o <em>menos</em>.`, ansTxt: ['menos'], ansShow: `menos — ${c[1]} es menor que 1, así que da ${_decMul(c[0], c[1])}`, pts: 5 }); }
  { const c = _RT_CEROS[_opRint(0, _RT_CEROS.length - 1)];
    const p = _DEC_PRECIOS[_opRint(0, _DEC_PRECIOS.length - 1)];
    items.push({ text: `Media libra de queso cuesta la mitad de L ${p.toFixed(2)} y además se compran 2 libras enteras al mismo precio. ¿Cuánto se paga en total?`, ansTxt: [..._decAcc(_decFmt(p * 2.5, 2)), (Math.round(p * 250) / 100).toFixed(2)], ansShow: _lps(p * 2.5) + ` — es 2.5 × ${p.toFixed(2)}`, pts: 10 }); }
  return items;
}

function genEvalOp() {
  sfx('click');
  _injectFormaSel('genEvalOp', 'evalOpFormaSel', evalOpFormNum, function (v) { evalOpFormNum = v; });
  const _sO = document.getElementById('evalOpFormaSel');
  if (_sO && parseInt(_sO.value, 10)) evalOpFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sO.value, 10)));
  const cf = evalOpFormNum; window._currentEvalOpForm = cf; _opRnd = _evalRng(100000 + cf); /* la Forma cf siembra todo el azar de la prueba operativa */ evalOpFormNum = (evalOpFormNum % EVAL_FORMAS) + 1; _injectFormaSel('genEvalOp', 'evalOpFormaSel', evalOpFormNum, function (v) { evalOpFormNum = v; }); saveProgress();
  document.getElementById('evalop-screen-title').textContent = `📐 Prueba Operativa — Forma ${cf} · Multiplicación de Decimales`;
  evalOpAnsVisible = false;
  const out = document.getElementById('evalOpOut'); out.innerHTML = '';

  const mdItems = genMultDivItems();
  const s1 = document.createElement('div');
  s1.innerHTML = '<div class="eval-section-title">I. Multiplica y coloca el punto <span class="eval-pts">20 pts · 4 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel básico. Multiplica como si no hubiera punto y después cuenta las cifras decimales de los dos factores.</p>';
  mdItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.text}</span><input class="eval-cp-input" type="text" data-md="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${it.ansShow || _fmtNum(it.ansNum)}</div><div class="eval-item-feedback" id="evalFbMd${i}" aria-live="polite"></div>`;
    s1.appendChild(d);
  });
  out.appendChild(s1);

  const rdItems = genRadarItems();
  const s2 = document.createElement('div');
  s2.innerHTML = '<div class="eval-section-title">II. Radar del punto <span class="eval-pts">10 pts · 2 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel básico. Como en el Radar del Punto: cuenta cifras, estima y decide hacia dónde salta el punto.</p>';
  rdItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.text}</span><input class="eval-cp-input" type="text" data-rd="${i}" autocomplete="off"></div><div class="eval-answer">${it.ansShow}</div><div class="eval-item-feedback" id="evalFbRd${i}" aria-live="polite"></div>`;
    s2.appendChild(d);
  });
  out.appendChild(s2);

  const rgItems = genReglaItems();
  const s3 = document.createElement('div');
  s3.innerHTML = '<div class="eval-section-title">III. ¿Qué se esconde en ▢? <span class="eval-pts">20 pts · 4 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel intermedio. Mira dónde quedó el punto en el resultado: eso te dice qué falta en el recuadro.</p>';
  rgItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.expr} <em style="font-size:0.85em;color:var(--gray);">(${it.hint})</em></span><input class="eval-cp-input" type="text" data-rg="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">▢ = ${it.ansShow || _fmtNum(it.ansNum)}</div><div class="eval-item-feedback" id="evalFbRg${i}" aria-live="polite"></div>`;
    s3.appendChild(d);
  });
  out.appendChild(s3);

  const viItems = genVidaItems();
  const s4 = document.createElement('div');
  s4.innerHTML = '<div class="eval-section-title">IV. Problemas de la vida real <span class="eval-pts">30 pts · 10 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel avanzado. Son compras de verdad: resuelve en tu cuaderno y escribe el total en lempiras.</p>';
  viItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.text}</span><input class="eval-cp-input" type="text" data-vi="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${it.ansShow || _fmtNum(it.ansNum)} — ${it.just}</div><div class="eval-item-feedback" id="evalFbVi${i}" aria-live="polite"></div>`;
    s4.appendChild(d);
  });
  out.appendChild(s4);

  const rtItems = genRetoItems();
  const s5 = document.createElement('div');
  s5.innerHTML = '<div class="eval-section-title">V. Retos de pensamiento crítico <span class="eval-pts">20 pts · 5 + 5 + 10</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel desafío. ¡No caigas en los Errores Comunes! Detecta, juzga y encuentra al intruso.</p>';
  rtItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.text} <em style="font-size:0.85em;color:var(--gray);">(${it.pts} pts)</em></span><input class="eval-cp-input" type="text" data-rt="${i}" autocomplete="off"${it.ansTxt ? '' : ' inputmode="numeric"'}></div><div class="eval-answer">${it.ansShow}</div><div class="eval-item-feedback" id="evalFbRt${i}" aria-live="polite"></div>`;
    s5.appendChild(d);
  });
  out.appendChild(s5);

  window._evalOpData = { mdItems, rdItems, rgItems, viItems, rtItems };
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
  let total = 0; const det = { md: 0, rd: 0, rg: 0, vi: 0, rt: 0 };
  const _mark = (sel, it, i, key, ptsEach, fbId) => {
    const el = document.querySelector(`[data-${sel}="${i}"]`);
    const p = ptsEach != null ? ptsEach : it.pts;
    const ok = it.ansTxt ? _isTxtMatch(el ? el.value : '', it.ansTxt) : _isIntMatch(el ? el.value : '', it.ansNum);
    if (el) { el.classList.toggle('eval-input-ok', ok); el.classList.toggle('eval-input-no', !ok); }
    if (ok) { det[key] += p; total += p; }
    setEvalFeedback(fbId + i, ok, ok ? `Correcto. +${p} pts` : 'Revisar. R/ ' + (it.ansShow || (it.ansTxt ? it.ansTxt[it.ansTxt.length - 1] : _fmtNum(it.ansNum))));
  };
  d.mdItems.forEach((it, i) => _mark('md', it, i, 'md', 4, 'evalFbMd'));
  d.rdItems.forEach((it, i) => _mark('rd', it, i, 'rd', 2, 'evalFbRd'));
  d.rgItems.forEach((it, i) => _mark('rg', it, i, 'rg', 4, 'evalFbRg'));
  d.viItems.forEach((it, i) => _mark('vi', it, i, 'vi', 10, 'evalFbVi'));
  d.rtItems.forEach((it, i) => _mark('rt', it, i, 'rt', null, 'evalFbRt'));
  const res = document.getElementById('evalOpAutoResult');
  if (res) { res.className = 'eval-auto-result ' + (total >= 70 ? 'eval-auto-pass' : 'eval-auto-risk'); res.innerHTML = `<strong>Resultado: ${total}/100 pts</strong><br><span>Coloca el punto: ${det.md}/20 · Radar: ${det.rd}/10 · Se esconde en ▢: ${det.rg}/20 · Vida real: ${det.vi}/30 · Retos: ${det.rt}/20</span>`; }
  if (total >= 70) { pts(8); showToast('🎯 Prueba operativa calificada: ' + total + '/100'); }
  else showToast('🧮 Prueba operativa: ' + total + '/100. Revisa los ítems marcados.');
}

function printEvalOp() {
  if (!window._evalOpData) { showToast('⚠️ Genera una prueba operativa primero'); return; }
  sfx('click');
  const forma = window._currentEvalOpForm || 1; const d = window._evalOpData;
  const _plano = (s) => s.replace(/<em[^>]*>/g, '').replace(/<\/em>/g, '');
  let s1 = `<div class="sec-title"><span>I. Multiplica y coloca el punto</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Nivel básico. Multiplica sin el punto, cuenta las cifras decimales y escribe la respuesta en la línea. 4 pts c/u.</p>`;
  d.mdItems.forEach((it, i) => { s1 += `<div class="opx-print-row"><span class="qn">${i+1}.</span><span class="prb-text">${it.text}</span><span class="opx-blank"></span></div>`; });
  const rdTbl = (items) => `<table class="rnd-tbl"><tr><th>#</th><th>Radar del punto: cuenta, estima y decide</th><th>Respuesta</th></tr>${items.map((it, i) => `<tr><td>${i+1}</td><td>${_plano(it.text)}</td><td></td></tr>`).join('')}</table>`;
  let s2 = `<div class="sec-title"><span>II. Radar del punto</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10 pts</span></div></div><p class="opx-instr">Nivel básico. Recuerda: el producto lleva las cifras decimales de los dos factores · por 10 el punto va a la derecha · por 0.1 a la izquierda · suma de cifras · 5 → termina en 0 o 5 · 10 → termina en 0. 2 pts c/u.</p>${rdTbl(d.rdItems)}`;
  const rgTbl = (items) => `<table class="rnd-tbl"><tr><th>#</th><th>Operación</th><th>Pista</th><th>▢ =</th></tr>${items.map((it, i) => `<tr><td>${i+1}</td><td>${it.expr}</td><td>${it.hint}</td><td></td></tr>`).join('')}</table>`;
  let s3 = `<div class="sec-title"><span>III. ¿Qué se esconde en ▢?</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Nivel intermedio. Mira dónde quedó el punto: eso dice qué falta en el recuadro. 4 pts c/u.</p>${rgTbl(d.rgItems)}`;
  let s4 = `<div class="sec-title"><span>IV. Problemas de la vida real</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 30 pts</span></div></div><p class="opx-instr">Nivel avanzado. Resuelve en el espacio mostrando tu procedimiento y escribe la respuesta. 10 pts c/u.</p>`;
  d.viItems.forEach((it, i) => { s4 += `<div class="opx-print-row"><span class="qn">${i+1}.</span><span class="prb-text">${it.text}</span><span class="opx-blank"></span></div><div class="opx-space"></div>`; });
  let s5 = `<div class="sec-title"><span>V. Retos de pensamiento crítico</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Nivel desafío. ¡Cuidado con los Errores Comunes! Valor: 5 + 5 + 10 pts.</p>`;
  d.rtItems.forEach((it, i) => { s5 += `<div class="opx-print-row"><span class="qn">${i+1}.</span><span class="prb-text">${_plano(it.text)} <strong>(${it.pts} pts)</strong></span><span class="opx-blank"></span></div>`; });
  let pR = '';
  pR += `<div class="p-sec"><div class="p-ttl">I. Multiplica y coloca el punto</div><table class="p-tbl">${d.mdItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${it.ansShow || _fmtNum(it.ansNum)}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">II. Radar del punto</div><table class="p-tbl">${d.rdItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${it.ansShow}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">III. ¿Qué se esconde en ▢?</div><table class="p-tbl">${d.rgItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">▢ = ${it.ansShow || _fmtNum(it.ansNum)}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">IV. Problemas de la vida real</div><table class="p-tbl">${d.viItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${it.ansShow || _fmtNum(it.ansNum)} — ${it.just}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec" style="grid-column:1/-1;"><div class="p-ttl">V. Retos de pensamiento crítico</div><table class="p-tbl">${d.rtItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${it.ansShow} (${it.pts} pts)</td></tr>`).join('')}</table></div>`;
  const doc = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Prueba Operativa Multiplicación de Decimales · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11.5pt;color:#111;background:#fff;padding:4mm 6mm;}.ph{margin-bottom:0.5rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;color:#1565c0;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:#1565c0;margin-top:0.15rem;font-weight:700;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.45rem 0 0.2rem;border-left:4px solid #1565c0;background:#e3f2fd;display:flex;justify-content:space-between;align-items:center;color:#1565c0;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:#1565c0;font-weight:700;font-style:italic;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #1565c0;height:12px;}.qn{font-weight:700;min-width:20px;display:inline-block;color:#1565c0;flex-shrink:0;}.opx-instr{font-size:9pt;color:#555;margin-bottom:0.22rem;}.opx-blank{display:inline-block;width:80px;flex:none;border-bottom:1.5px solid #111;min-height:13px;margin-left:0.3rem;}.opx-print-row{display:flex;align-items:baseline;gap:0.4rem;font-size:10pt;padding:0.24rem 0.1rem;border-bottom:1px dotted #ddd;}.opx-space{height:26px;border-bottom:1px dotted #ccc;margin:0 0 2px 20px;}.prb-text{flex:1;line-height:1.35;}.rnd-tbl{width:100%;border-collapse:collapse;font-size:9.5pt;margin-top:0.15rem;}.rnd-tbl th,.rnd-tbl td{border:1px solid #bbb;padding:0.16rem 0.35rem;text-align:left;}.rnd-tbl th{background:#e3f2fd;color:#1565c0;font-size:8.5pt;}.total-row{display:flex;align-items:baseline;justify-content:flex-end;gap:7px;font-size:11pt;color:#1565c0;font-weight:700;font-style:italic;margin-top:0.45rem;padding:0.2rem 0.5rem;background:#e3f2fd;border-radius:4px;}.total-row .obt-line{min-width:80px;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #1565c0;padding-bottom:0.3rem;margin-bottom:0.5rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;color:#1565c0;}.p-sub{font-size:9pt;color:#1565c0;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #cce0ff;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;color:#1565c0;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#1565c0;}.pa{color:#007a00;font-weight:700;font-family:'Courier New',monospace;}.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:8mm 10mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Examen de Matemáticas — Prueba Operativa · Multiplicación de Decimales · Educación Básica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 pts · I: 20 · II: 10 · III: 20 · IV: 30 · V: 20 · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✔ PAUTA — Prueba Operativa · Multiplicación de Decimales · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">100 pts · Matemáticas · Educación Básica</div></div><div class="p-grid">${pR}</div></div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("evalPage",250,0.55,1.2);fit("pautaPage",250,0.55,1.2);})();<\/script></body></html>`;
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
  const msgs=['💡 ¡ÁNIMO! Comienza tu misión. ¡Cada paso cuenta!','🌱 ¡GRAN INICIO! Estás dando los primeros pasos.','🔑 ¡BUEN TRABAJO! Vas progresando muy bien.','💪 ¡MUY BIEN! Dominas gran parte del contenido.','🏅 ¡INCREÍBLE avance! Estás cerca de la excelencia.','🎓 ¡EXTRAORDINARIO! Completaste TODA la misión. ¡Eres experto en Multiplicación de Decimales!'];
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
  const txt=`${stars} CONSTANCIA DE LOGRO ${stars}\n\n📚 Misión: Multiplicación de Decimales\n👤 Estudiante: ${name}\n📊 Progreso: ${pct}% completado\n⭐ XP obtenido: ${xp} de ${MXP}${achText?'\n\n🏆 Logros desbloqueados:\n'+achText:''}\n\n${msg}\n\n📅 ${date}\n🏠 Proyecto Educativo M.E.T.A.S\n🌐 policastsapien.com`;
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
  const savedName=localStorage.getItem('nombreEstudianteMultiplosDivisores');
  const inputName=document.querySelector('.diploma-input');
  if(savedName&&inputName){ inputName.value=savedName; updateDiplomaName(savedName); }
  if(inputName) inputName.addEventListener('input',e=>localStorage.setItem('nombreEstudianteMultiplosDivisores',e.target.value));
  fin('s-aprende',false);
  fin('s-tipos',false);
  fin('s-errores',false);
});

// Formas deterministas v1: selectores de forma visibles desde la carga de la página
(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalOp==='function') _injectFormaSel('genEvalOp','evalOpFormaSel',evalOpFormNum,function(v){evalOpFormNum=v;}); }catch(e){} try{ if(typeof genEvalCrit==='function') _injectFormaSel('genEvalCrit','evalCritFormaSel',evalCritFormNum,function(v){evalCritFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();
