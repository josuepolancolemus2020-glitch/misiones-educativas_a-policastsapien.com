// Misión Prueba de Fin de Grado: 6º Grado · Repaso General (Español y Matemáticas)
// Primera misión de la Ruta de la Meta: repasa el temario completo de la
// Prueba de Fin de Grado (fracciones, decimales, teoría de números, geometría,
// promedio + comprensión lectora, vocabulario, tipos de texto y escritura).
// Es la base para las pruebas de fin de grado de los demás grados.

// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
function compartirMision() {
    const url = window.location.href;
    const texto = `🎓 *Misión Asignada: Prueba de Fin de Grado 6º* 🎓\n\nRepasa Español y Matemáticas de TODO el año: fracciones, decimales, m.c.m., área, promedio, lectura y escritura. 🏆\n\nDesbloquea *todos los logros* y puedes poner *tus datos* para que tu maestro observe todos tus logros. 📋\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;
    _waShare(texto);
}

// ===================== ACCESIBILIDAD =====================
function toggleLetra() {
  document.body.classList.toggle('letra-grande');
  if(typeof sfx === 'function') sfx('click');
  localStorage.setItem('prefLetraFinDeGrado6', document.body.classList.contains('letra-grande'));
}
window.addEventListener('DOMContentLoaded', () => {
  if(localStorage.getItem('prefLetraFinDeGrado6') === 'true') document.body.classList.add('letra-grande');
});

// ===================== UTILIDADES =====================
const _pick = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
const _shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
function fb(id, msg, isOk) {
  const el = document.getElementById(id);
  if(el) { el.textContent = msg; el.className = 'fb show ' + (isOk ? 'ok' : 'err'); }
}
// Aritmética que comparten la operativa y el generador de tareas
function _mcdDe(a, b){ while (b) { const t = a % b; a = b; b = t; } return a; }
function _mcmDe(a, b){ return a / _mcdDe(a, b) * b; }
function _simpFrac(n, d){ const g = _mcdDe(n, d); return [n / g, d / g]; }
// "n/d" simplificada; si es entera, solo el entero ("8/8" se escribe "1")
function _fmtFrac(n, d){ const s = _simpFrac(n, d); return s[1] === 1 ? String(s[0]) : s[0] + '/' + s[1]; }
// Formas aceptadas al calificar una fracción: la simplificada, la sin
// simplificar y (si es impropia) el número mixto: 5/4 también vale como 1 1/4
function _accFrac(n, d){
  const acc = [_fmtFrac(n, d)];
  if (_fmtFrac(n, d) !== n + '/' + d) acc.push(n + '/' + d);
  const s = _simpFrac(n, d);
  if (s[1] > 1 && s[0] > s[1]) acc.push(Math.floor(s[0] / s[1]) + ' ' + (s[0] % s[1]) + '/' + s[1]);
  return acc;
}

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY = 'repaso_fin_grado_6to_v1';
let xp = 0, MXP = 250, done = new Set(), evalAnsVisible = false;
// Dos pruebas conceptuales (una por materia) y una operativa, cada una con su forma
let evalMateria = 'mat';
let evalFormNumMat = 1, evalFormNumEsp = 1, evalOpFormNum = 1, evalOpAnsVisible = false, unlockedAch = [], darkMode = false, prevLevel = 0;
const TOTAL_SECTIONS = 17;
const xpTracker = { fc: new Set(), qz: new Set(), cls: new Set(), id: new Set(), cmp: new Set(), reto: new Set(), sopa: new Set(), predice: new Set(), explica: new Set(), memo: new Set(), texto: new Set(), lab1: new Set(), lab2: new Set(), prom: new Set(), det: new Set(), radar: new Set() };

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
  try{ localStorage.setItem(SAVE_KEY, JSON.stringify({doneSections:Array.from(done), unlockedAch, evalFormNumMat, evalFormNumEsp, evalOpFormNum, xp})); }catch(e){}
}
function loadProgress(){
  try{
    const s=JSON.parse(localStorage.getItem(SAVE_KEY));
    if(!s) return;
    if(s.doneSections&&Array.isArray(s.doneSections)) s.doneSections.forEach(id=>{ done.add(id); const b=document.querySelector(`[data-s="${id}"]`); if(b) b.classList.add('done'); });
    if(s.unlockedAch&&Array.isArray(s.unlockedAch)) unlockedAch=s.unlockedAch.filter(id=>ACHIEVEMENTS[id]!==undefined);
    if(s.evalFormNumMat) evalFormNumMat=s.evalFormNumMat;
    if(s.evalFormNumEsp) evalFormNumEsp=s.evalFormNumEsp;
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
function launchConfetti(){ const colors=['#7c3aed','#1565c0','#c49000','#00b894','#fdcb6e']; for(let i=0;i<60;i++){ const c=document.createElement('div'); c.className='confetti-piece'; c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`; document.body.appendChild(c); c.addEventListener('animationend',()=>c.remove()); } }

// ===================== XP =====================
const lvls=[{t:0,n:'Novato ✏️'},{t:30,n:'Aprendiz 📚'},{t:70,n:'Explorador 🔭'},{t:115,n:'Detective 🔍'},{t:160,n:'Experto 📊'},{t:205,n:'Campeón 🔥'},{t:240,n:'Maestro 🎓'}];
function pts(n){ xp=Math.max(0,Math.min(MXP,xp+n)); updateXPBar(); saveProgress(); }
function updateXPBar(){ const pct=Math.round((xp/MXP)*100); document.getElementById('xpFill').style.width=pct+'%'; const el=document.getElementById('xpPts'); el.textContent='⭐ '+xp; el.style.transform='scale(1.3)'; setTimeout(()=>el.style.transform='',300); let lv=0; for(let i=0;i<lvls.length;i++) if(xp>=lvls[i].t) lv=i; document.getElementById('xpLvl').textContent=lvls[lv].n; if(lv!==prevLevel){ if(lv>=2) unlockAchievement('nivel3'); if(lv>=5) unlockAchievement('nivel5'); prevLevel=lv; } }
function resetXP(){ sfx('click'); xp=0; updateXPBar(); showToast('🔄 XP reiniciado a 0'); }
function fin(id,showFX=true){ if(!done.has(id)){ done.add(id); const b=document.querySelector(`[data-s="${id}"]`); if(b) b.classList.add('done'); if(showFX){ sfx('up'); launchConfetti(); } saveProgress(); } }

// ===================== NAV =====================
function go(id){ sfx('click'); document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active')); document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{ b.classList.remove('active'); b.setAttribute('aria-selected','false'); }); document.getElementById(id).classList.add('active'); const btn=document.querySelector(`[data-s="${id}"]`); if(btn){ btn.classList.add('active'); btn.setAttribute('aria-selected','true'); } window.scrollTo({top:0,behavior:'smooth'}); if(id==='s-sopa') setTimeout(buildSopa,50); }

// ===================== FLASHCARD DATA =====================
// 14 tarjetas: 7 de Matemáticas y 7 de Español, intercaladas
const fcData=[
  {w:'Fracción',a:'🍕 parte de un entero: el <strong>numerador</strong> va arriba y el <strong>denominador</strong> abajo.'},
  {w:'Idea principal',a:'🎯 es <strong>lo más importante</strong> que el texto dice sobre su tema. pregúntate: ¿de qué trata <strong>todo</strong> el texto, no solo un pedacito?'},
  {w:'m.c.m.',a:'🔁 el <strong>menor múltiplo</strong> que dos o más números tienen en común. sirve cuando dos cosas deben <strong>coincidir</strong>.'},
  {w:'Sinónimo',a:'🔄 palabra que significa <strong>casi lo mismo</strong> que otra y puede sustituirla en la oración: contento y alegre.'},
  {w:'M.C.D.',a:'✂️ el <strong>mayor divisor</strong> común: el número más grande que cabe <strong>exacto</strong> en los dos. sirve para repartir sin sobras.'},
  {w:'Comprensión literal',a:'📖 entender lo que el texto dice <strong>tal como está escrito</strong>: la respuesta está a la vista, solo hay que releer.'},
  {w:'Promedio',a:'📊 <strong>suma</strong> todos los datos y <strong>divide</strong> entre cuántos son. con 80, 90 y 100 el promedio es 90.'},
  {w:'Inferencia',a:'🕵️ descubrir lo que el texto <strong>no dice con palabras</strong>, usando las <strong>pistas</strong> que sí da.'},
  {w:'Área del círculo',a:'⭕ se calcula con <strong>π × radio × radio</strong>, usando π = 3.14.'},
  {w:'Fábula',a:'🦊 relato breve con <strong>animales que hablan</strong> y una <strong>moraleja</strong> al final: la enseñanza.'},
  {w:'Sólido de revolución',a:'🔄 nace al <strong>girar</strong> una figura plana: el rectángulo genera el <strong>cilindro</strong> y el triángulo genera el cono.'},
  {w:'Carta',a:'✉️ escrito para una persona: lleva <strong>saludo, cuerpo y despedida</strong> con firma.'},
  {w:'Simetría reflexiva',a:'🪞 una mitad de la figura es el <strong>reflejo</strong> exacto de la otra, como frente a un espejo.'},
  {w:'Noticia',a:'📰 informa un <strong>hecho real y reciente</strong>: qué pasó, quién, cuándo y dónde.'}
];
let fcIdx=0;
function upFC(){ document.getElementById('fcInner').classList.remove('flipped'); document.getElementById('fcW').textContent=fcData[fcIdx].w; document.getElementById('fcA').innerHTML=fcData[fcIdx].a; document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length; }
function flipCard(){ sfx('flip'); document.getElementById('fcInner').classList.toggle('flipped'); if(!xpTracker.fc.has(fcIdx)){ xpTracker.fc.add(fcIdx); pts(1); } if(xpTracker.fc.size===fcData.length){ fin('s-flash'); unlockAchievement('flash_master'); } }
function nextFC(){ sfx('click'); fcIdx=(fcIdx+1)%fcData.length; upFC(); }
function prevFC(){ sfx('click'); fcIdx=(fcIdx-1+fcData.length)%fcData.length; upFC(); }

// ===================== JUEGO: MEMORIA DEL REPASO =====================
const memoPairs=[
  {id:'circulo',t:'Área del círculo',d:'⭕ A = 3.14 × r × r'},
  {id:'fabula',t:'Fábula',d:'🦊 animales que hablan y moraleja al final'},
  {id:'div3',t:'Divisible entre 3',d:'🧮 suma las cifras: 123 → 1+2+3 = 6, sí es'},
  {id:'noticia',t:'Noticia',d:'📰 un hecho real: qué, quién, cuándo y dónde'},
  {id:'viaje',t:'Tiempo de un viaje',d:'🚌 tiempo = distancia ÷ velocidad'},
  {id:'idea',t:'Idea principal',d:'🎯 de qué trata todo el texto, no un pedacito'}
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
// 9 preguntas conceptuales: 5 de Matemáticas y 4 de Español
const qzData=[
  {q:'Quieres repartir 24 naranjas y 36 mangos en canastas iguales, con la mayor cantidad posible de canastas y sin que sobre fruta. ¿Qué debes calcular?',o:['a) el m.c.m.','b) el M.C.D.','c) el promedio','d) el área'],c:1,feedback:'Repartir en partes iguales sin que sobre nada es problema de M.C.D.: M.C.D.(24, 36) = 12 canastas.'},
  {q:'¿Cómo se encuentra la idea principal de un texto?',o:['a) Copiando la primera oración, porque siempre está ahí','b) Preguntándose de qué trata TODO el texto, no solo una parte','c) Buscando la palabra que más veces se repite','d) Leyendo únicamente el título'],c:1,feedback:'La idea principal abarca el texto entero. A veces está en la primera oración y a veces no; la palabra más repetida puede ser un detalle.'},
  {q:'¿Qué fórmula usas para hallar el área de un círculo?',o:['a) π × radio × radio','b) π × diámetro','c) lado × lado','d) base × altura'],c:0,feedback:'Área del círculo = π × radio × radio. π × diámetro da la circunferencia, no el área; lado × lado es del cuadrado.'},
  {q:'¿Qué es un sinónimo?',o:['a) Una palabra que se escribe parecido a otra','b) Una palabra que significa lo contrario de otra','c) Una palabra que significa casi lo mismo que otra y puede sustituirla','d) Una palabra que rima con otra'],c:2,feedback:'Sinónimos: contento y alegre. Lo contrario es un antónimo, y escribirse parecido (casa y caza) no es significar lo mismo.'},
  {q:'De la terminal sale un bus cada 15 minutos y otro cada 20. Para saber cuándo vuelven a salir juntos, ¿qué calculas?',o:['a) el M.C.D.','b) la resta','c) el m.c.m.','d) el doble de 20'],c:2,feedback:'Cuando dos sucesos se repiten y se busca cuándo coinciden, se usa el m.c.m.: m.c.m.(15, 20) = 60 minutos.'},
  {q:'Un texto empieza así: «Tegucigalpa. Ayer fue inaugurada la nueva biblioteca municipal con más de mil libros». ¿Qué tipo de texto es y por qué?',o:['a) Una noticia, porque informa un hecho real y reciente con lugar y fecha','b) Un cuento, porque tiene personajes imaginarios','c) Una receta, porque da pasos en orden','d) Una fábula, porque deja una moraleja'],c:0,feedback:'Tiene las marcas de la noticia: arranca con el lugar, dice cuándo y cuenta un hecho real con un dato.'},
  {q:'Para hallar el volumen de un prisma rectangular, ¿qué operación haces?',o:['a) sumar sus tres medidas','b) multiplicar largo × ancho × alto','c) multiplicar solo largo × ancho','d) sumar el área de sus caras'],c:1,feedback:'Volumen del prisma rectangular = largo × ancho × alto. Largo × ancho da solo el área de la base.'},
  {q:'¿Qué distingue a una fábula de otros relatos?',o:['a) Que siempre es larga y con muchos personajes','b) Que cuenta hechos reales y recientes','c) Que sus personajes son personas famosas','d) Que suele tener animales que hablan y termina con una moraleja'],c:3,feedback:'La marca de la fábula es la moraleja final, y sus personajes suelen ser animales con defectos y virtudes humanas.'},
  {q:'Si conoces la distancia del viaje y la velocidad del bus, ¿cómo hallas el tiempo?',o:['a) distancia × velocidad','b) velocidad ÷ distancia','c) distancia + velocidad','d) distancia ÷ velocidad'],c:3,feedback:'tiempo = distancia ÷ velocidad. Por ejemplo: 360 km entre 45 km por hora son 8 horas.'}
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

// ===================== EL CUENTO DEL REPASO (texto largo con 4 preguntas) =====================
// Como en la prueba real: un texto extenso y varias preguntas sobre él.
const textoLargo={
  titulo:'La cartera de don Cosme',
  texto:'Camino a la escuela, Nino encontró una cartera tirada junto al puente. Adentro había billetes: más de los que había visto juntos en su vida. Pensó en la bicicleta que tanto quería y el corazón le dio un brinco. Pero también encontró un carné con una foto: era don Cosme, el señor que vendía verduras en el mercado de la aldea.\n\nNino conocía ese puesto. Sabía que don Cosme madrugaba todos los días y que con esas ventas mantenía a sus nietos. Apretó la cartera y, en vez de seguir a la escuela, se desvió al mercado.\n\nCuando la recibió, don Cosme se quedó mudo un momento. Después dijo con la voz quebrada: ese dinero era para la medicina de mi nieta. Le regaló a Nino una bolsa de mangos y lo acompañó a la escuela para contarle a la maestra lo que su alumno había hecho.\n\nEsa mañana, Nino llegó tarde a clases, pero llegó más grande.',
  preguntas:[
    {q:'¿De qué trata principalmente el cuento?',o:['a) De una bicicleta que Nino quería comprar.','b) De la honradez de un niño que devuelve lo que no es suyo.','c) De las verduras que se venden en el mercado.','d) De un niño que llegó tarde a clases.'],a:1,exp:'Todo el cuento gira alrededor de la decisión de Nino: encontrar el dinero, la tentación y devolverlo. La bicicleta es solo la tentación de un momento.'},
    {q:'Según el texto, ¿qué había dentro de la cartera además de los billetes?',o:['a) Una foto de la nieta de don Cosme.','b) Una receta médica.','c) Un carné con una foto.','d) Una bolsa de mangos.'],a:2,exp:'El texto lo dice tal cual: «también encontró un carné con una foto». Los mangos fueron el regalo de después.'},
    {q:'¿Por qué Nino decidió desviarse al mercado en lugar de seguir a la escuela?',o:['a) Porque quería comprar mangos.','b) Porque la maestra lo mandó.','c) Porque el mercado le quedaba de paso.','d) Porque sabía que don Cosme necesitaba ese dinero.'],a:3,exp:'Las pistas están antes de la decisión: don Cosme madrugaba y con esas ventas mantenía a sus nietos. Además, el texto dice que Nino se DESVIÓ.'},
    {q:'«Después dijo con la voz quebrada». ¿Qué significa en el texto la palabra quebrada?',o:['a) Entrecortada por la emoción.','b) Rota como un vidrio.','c) Muy fuerte y clara.','d) Enojada y golpeada.'],a:0,exp:'Don Cosme acaba de recuperar el dinero de la medicina de su nieta: la voz se le corta por la emoción, no por enojo.'}
  ]
};
function buildTextoLargo(){
  const wrap=document.getElementById('textoLargoWrap'); if(!wrap) return;
  const parrafos=textoLargo.texto.split('\n\n').map(p=>`<p style="margin-bottom:0.6rem;">${p}</p>`).join('');
  let html=`<div style="border:1.5px solid var(--border);border-radius:12px;padding:0.9rem 1rem;background:var(--pri-gl);margin-bottom:0.9rem;"><h3 style="font-family:'Fredoka',sans-serif;margin-bottom:0.5rem;">📖 ${textoLargo.titulo}</h3>${parrafos}</div>`;
  textoLargo.preguntas.forEach((p,i)=>{
    html+=`<div class="mini-quiz-wrap" id="mqTexto${i}"><p class="mq-pregunta">${i+1}. ${p.q}</p><div class="mq-opts">`+
      p.o.map((o,j)=>`<button class="mq-btn" data-ti="${i}" data-tj="${j}">${o}</button>`).join('')+
      `</div><div class="mq-fb" id="mqTexto${i}-fb"></div></div>`;
  });
  wrap.innerHTML=html;
  wrap.querySelectorAll('.mq-btn').forEach(btn=>{
    btn.onclick=()=>{
      const i=parseInt(btn.dataset.ti,10), j=parseInt(btn.dataset.tj,10);
      const p=textoLargo.preguntas[i];
      const wrapQ=document.getElementById('mqTexto'+i);
      if(wrapQ.dataset.done) return;
      wrapQ.dataset.done='1';
      const btns=wrapQ.querySelectorAll('.mq-btn'); btns.forEach(b=>b.disabled=true);
      const ok=(j===p.a);
      btn.classList.add(ok?'mq-ok':'mq-no');
      if(!ok) btns[p.a].classList.add('mq-ok');
      const fbEl=document.getElementById('mqTexto'+i+'-fb');
      if(fbEl){ fbEl.textContent=(ok?'✔ ':'💡 ')+p.exp; fbEl.className='mq-fb show '+(ok?'ok':'err'); }
      if(ok){ sfx('ok'); if(!xpTracker.texto.has(i)){ xpTracker.texto.add(i); pts(3); } } else sfx('no');
      if(document.querySelectorAll('#textoLargoWrap [data-done]').length===textoLargo.preguntas.length){ sfx('fan'); showToast('📖 ¡Cuento del repaso completado!'); }
    };
  });
}

// ===================== CLASIFICACIÓN (seleccionar y colocar, sin arrastre) =====================
// 4 grupos: 2 de Matemáticas y 2 de Español
const classGroups=[
  {
    label:['Propias','Impropias'], headA:'🟩 PROPIA: menor que 1', headB:'🟦 IMPROPIA: 1 o más', colA:'propia', colB:'impropia',
    words:[{w:'3/4',t:'propia'},{w:'9/4',t:'impropia'},{w:'2/5',t:'propia'},{w:'7/3',t:'impropia'},{w:'7/9',t:'propia'},{w:'11/8',t:'impropia'},{w:'5/8',t:'propia'},{w:'6/5',t:'impropia'}]
  },
  {
    label:['m.c.m.','M.C.D.'], headA:'🔁 Se resuelve con m.c.m.', headB:'✂️ Se resuelve con M.C.D.', colA:'mcm', colB:'mcd',
    words:[{w:'Dos campanas suenan cada 6 y 8 minutos',t:'mcm'},{w:'Cortar dos cintas en pedazos iguales máximos',t:'mcd'},{w:'¿Cuándo vuelven a coincidir dos buses?',t:'mcm'},{w:'Repartir lápices y cuadernos en partes iguales',t:'mcd'},{w:'Riego cada 3 días y podo cada 5',t:'mcm'},{w:'Formar los grupos más grandes sin sobras',t:'mcd'},{w:'Dos luces buscan parpadear juntas otra vez',t:'mcm'},{w:'Dividir dos terrenos en lotes iguales máximos',t:'mcd'}]
  },
  {
    label:['Hechos','Opiniones'], headA:'✅ HECHO: se puede comprobar', headB:'💭 OPINIÓN: depende de quién habla', colA:'hecho', colB:'opinion',
    words:[{w:'Honduras tiene 18 departamentos',t:'hecho'},{w:'El verde es el color más bonito',t:'opinion'},{w:'El pino es el árbol nacional de Honduras',t:'hecho'},{w:'La sopa de caracol es la más sabrosa',t:'opinion'},{w:'El lempira es la moneda de Honduras',t:'hecho'},{w:'Jugar futbol es mejor que nadar',t:'opinion'},{w:'Las ruinas de Copán están en Honduras',t:'hecho'},{w:'Las mañanas de lluvia son las mejores',t:'opinion'}]
  },
  {
    label:['Informa','Relata'], headA:'📰 El texto INFORMA: da datos reales', headB:'📚 El texto RELATA: cuenta una historia', colA:'informa', colB:'relata',
    words:[{w:'El colibrí esmeralda vive solo en Honduras',t:'informa'},{w:'Había una vez un zorro muy vanidoso',t:'relata'},{w:'La escuela abrirá la matrícula el lunes',t:'informa'},{w:'Aquella tarde, Toño perdió su sombrero en el río',t:'relata'},{w:'El maíz se siembra al inicio de las lluvias',t:'informa'},{w:'La abuela contó cómo conoció al abuelo',t:'relata'},{w:'La feria del pueblo será en el parque central',t:'informa'},{w:'De pronto, el caballo saltó el cerco y escapó',t:'relata'}]
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
// Español: sinónimos, conectores y concordancia, como en la prueba real
const idData=[
  {s:['Mi','abuelo','estaba','alegre','en','la','feria'],c:3,art:'El sinónimo de contento'},
  {s:['Regamos','la','milpa','porque','no','llovió'],c:3,art:'El conector que expresa causa'},
  {s:['Las','tortillas','calientes','estaban','sabroso','esa','mañana'],c:4,art:'La palabra que rompe la concordancia'},
  {s:['Volvimos','a','la','vivienda','antes','del','aguacero'],c:3,art:'El sinónimo de casa'},
  {s:['Quería','jugar','pero','tenía','mucha','tarea'],c:2,art:'El conector que opone dos ideas'},
  {s:['Los','pinos','altos','daba','sombra','al','camino'],c:3,art:'La palabra que rompe la concordancia'},
  {s:['Qué','hermoso','quedó','el','cartel','del','aula'],c:1,art:'El sinónimo de bonito'},
  {s:['Mi','hermana','es','muy','estudiosa','y','aplicado'],c:6,art:'La palabra que rompe la concordancia'}
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
  else{ span.classList.add('id-no'); fb('fbId','Esa no es la palabra solicitada.',false); sfx('no'); }
}
function nextId(){ sfx('click'); idIdx++; showId(); document.getElementById('fbId').classList.remove('show'); }
function resetId(){ sfx('click'); idIdx=0; showId(); document.getElementById('fbId').classList.remove('show'); }

// ===================== COMPLETA =====================
// 8 oraciones: 4 de Matemáticas y 4 de Español
const cmpData=[
  {s:'Para sumar fracciones heterogéneas primero busco ___.',opts:['el común denominador','el numerador mayor','el punto decimal'],c:0},
  {s:'Los niños de sexto grado están ___ por el paseo a las ruinas de Copán.',opts:['emocionadas','emocionado','emocionados'],c:2},
  {s:'Para dividir entre una fracción, la segunda fracción se ___ y luego multiplico.',opts:['suma','invierte','borra'],c:1},
  {s:'No fuimos al río ___ el agua venía muy crecida.',opts:['sin embargo','porque','además'],c:1},
  {s:'El resultado de 3.6 × 2.4 lleva ___ cifras decimales.',opts:['una','dos','tres'],c:1},
  {s:'La sopa de caracol lleva leche de coco; ___, se le pone plátano verde.',opts:['además','porque','sin embargo'],c:0},
  {s:'Un sólido con dos bases circulares iguales se llama ___.',opts:['pirámide','prisma','cilindro'],c:2},
  {s:'Practicó con su equipo todo el mes; ___, perdieron la final.',opts:['además','porque','sin embargo'],c:2}
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
    q: 'Sin hacer la división: ¿qué es mayor, la fracción 3/4 o el decimal 0.8?',
    opts: ['3/4', '0.8', 'Son iguales'],
    correct: 1,
    feedback: '¡Correcto! 3/4 = 0.75, y 0.75 es menor que 0.8. Convertir a decimal deja comparar de un vistazo.',
    wrongFeedback: 'La respuesta es 0.8: al convertir, 3/4 = 0.75, y 0.75 queda por debajo de 0.8.',
    explore: 'frac'
  },
  {
    q: '«La pulpería de doña Julia abre desde las seis. Vende pan caliente, minutas y helados. Los vecinos dicen que sin ella el barrio no sería igual.» ¿De qué trata el texto?',
    opts: ['Del pan caliente', 'De lo importante que es la pulpería para el barrio', 'De las minutas y los helados'],
    correct: 1,
    feedback: '¡Muy bien! El pan y las minutas son detalles de una sola línea; todo el texto habla de la pulpería y de lo que significa para el barrio.',
    wrongFeedback: 'La respuesta es la pulpería y su importancia: el pan y las minutas aparecen en una sola línea, son detalles.',
    explore: 'idea'
  },
  {
    q: 'Dos equipos entrenan en la cancha: uno llega cada 6 días y el otro cada 8. Hoy coincidieron. ¿En cuántos días vuelven a coincidir?',
    opts: ['En 14 días', 'En 48 días', 'En 24 días'],
    correct: 2,
    feedback: '¡Excelente! El m.c.m. de 6 y 8 es 24: es el primer día que aparece en las dos tablas.',
    wrongFeedback: 'La respuesta es 24, el m.c.m. de 6 y 8. El 14 es la suma y el 48 es un múltiplo común, pero no el MENOR.',
    explore: 'mcm'
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
  if (prediceAnswered.size === prediceData.length) { fin('s-predice'); sfx('fan'); showToast('🔮 ¡Predicciones completadas! Ahora a repasar.'); }
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
  if(type==='frac'){
    box.innerHTML=`<p class="pd-tip">Para comparar una fracción con un decimal, conviértela: divide arriba entre abajo. Toca los pasos:</p><div style="display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;margin:0.5rem 0;"><button class="btn btn-pri" onclick="predFracPaso(${i},1)">Paso 1: 3 ÷ 4</button><button class="btn btn-pri" onclick="predFracPaso(${i},2)">Paso 2: comparar</button></div><div class="pd-msg" id="pd-msg-${i}">👆 toca los pasos en orden</div>`;
  } else if(type==='idea'){
    box.innerHTML=`<p class="pd-tip">Truco del examen: si una opción solo aparece en UNA línea del texto, es un detalle. Toca cada opción para revisarla:</p><div style="display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;margin:0.5rem 0;"><button class="btn btn-pri" onclick="predIdeaPista(${i},0)">¿El pan?</button><button class="btn btn-pri" onclick="predIdeaPista(${i},1)">¿La pulpería?</button><button class="btn btn-pri" onclick="predIdeaPista(${i},2)">¿Las minutas?</button></div><div class="pd-msg" id="pd-msg-${i}">👆 revisa cada candidata</div>`;
  } else if(type==='mcm'){
    box.innerHTML=`<p class="pd-tip">Escribe las dos tablas y busca el primer número que aparezca en ambas:</p><div style="display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;margin:0.5rem 0;"><button class="btn btn-pri" onclick="predMcmLista(${i},6)">Ver múltiplos de 6</button><button class="btn btn-pri" onclick="predMcmLista(${i},8)">Ver múltiplos de 8</button></div><div class="pd-counter" id="pd-cnt-${i}" style="font-size:0.95rem;">&nbsp;</div><div class="pd-msg" id="pd-msg-${i}">👆 mira las dos listas</div>`;
    box.dataset.vistos='';
  }
}
function predFracPaso(i,paso){
  sfx('click');
  const msg=document.getElementById('pd-msg-'+i);
  if(paso===1){ msg.innerHTML='🧮 3 ÷ 4 = <strong>0.75</strong>. La fracción 3/4 vale 0.75. Ahora toca el paso 2.'; }
  else{ msg.innerHTML='⚖️ 0.75 contra 0.8: como 75 centésimas es menos que 80 centésimas, <strong>0.8 es mayor</strong>. ¡Ya puedes responder abajo!'; sfx('ok'); }
}
function predIdeaPista(i,cual){
  sfx('click');
  const msg=document.getElementById('pd-msg-'+i);
  if(cual===0){ msg.innerHTML='🥖 El pan caliente aparece en UNA sola línea: es un <strong>detalle</strong>, no la idea principal.'; }
  else if(cual===2){ msg.innerHTML='🍧 Las minutas y los helados también viven en una sola línea: <strong>detalles</strong>.'; }
  else{ msg.innerHTML='🏪 La pulpería aparece al inicio, en el medio y al final: <strong>de ella trata TODO el texto</strong>. ¡Ya puedes responder abajo!'; sfx('ok'); }
}
function predMcmLista(i,n){
  sfx('click');
  const cnt=document.getElementById('pd-cnt-'+i), msg=document.getElementById('pd-msg-'+i);
  const box=document.getElementById('pd-explore-'+i);
  const lista=[]; for(let k=1;k*n<=48;k++) lista.push(n*k);
  const marcada=lista.map(v=>v===24?`<strong style="color:var(--jade);">${v}</strong>`:v).join(', ');
  const vistos=new Set((box.dataset.vistos||'').split(',').filter(Boolean)); vistos.add(String(n));
  box.dataset.vistos=[...vistos].join(',');
  cnt.innerHTML=`Múltiplos de ${n}: ${marcada}`;
  if(vistos.size>=2){ msg.innerHTML='🎯 El <strong>24</strong> es el primer número que vive en las DOS tablas: ese es el m.c.m. ¡Ya puedes responder abajo!'; sfx('ok'); }
  else{ msg.innerHTML=`📋 Esa es la tabla del ${n}. Ahora mira la otra lista y busca el primer número repetido.`; }
}

// ===================== RETO FINAL (dos grupos, con parejas variables) =====================
// El alumno decide a qué grupo pertenece cada elemento antes de que acabe el reloj.
const retoPairs=[
  {
    name:'¿Mayor o menor que 1? 🍕', hint:'Convierte a decimal si te ayuda: 7/4 = 1.75', btnA:'🔼 MAYOR que 1', btnB:'🔽 MENOR que 1',
    pool:[
      {w:'7/4',t:'A'},{w:'0.75',t:'B'},{w:'1.25',t:'A'},{w:'5/6',t:'B'},{w:'9/8',t:'A'},{w:'0.9',t:'B'},
      {w:'2 1/3',t:'A'},{w:'3/8',t:'B'},{w:'1.05',t:'A'},{w:'0.99',t:'B'},{w:'13/10',t:'A'},{w:'7/10',t:'B'}
    ]
  },
  {
    name:'¿Divisible entre 3? 🧮', hint:'Suma las cifras: si la suma es múltiplo de 3, sí lo es', btnA:'✅ DIVISIBLE entre 3', btnB:'🚫 NO divisible',
    pool:[
      {w:'45',t:'A'},{w:'92',t:'B'},{w:'111',t:'A'},{w:'145',t:'B'},{w:'234',t:'A'},{w:'218',t:'B'},
      {w:'87',t:'A'},{w:'76',t:'B'},{w:'306',t:'A'},{w:'301',t:'B'},{w:'522',t:'A'},{w:'58',t:'B'}
    ]
  },
  {
    name:'¿Idea principal o detalle? 📖', hint:'Todas hablan del maíz: la idea abarca todo, el detalle cuenta una parte', btnA:'🎯 IDEA principal', btnB:'🔎 DETALLE',
    pool:[
      {w:'El maíz alimenta a Honduras',t:'A'},{w:'La tortilla se dora en el comal',t:'B'},
      {w:'Sin maíz no hay comida hondureña',t:'A'},{w:'El elote se come asado en la feria',t:'B'},
      {w:'El maíz es cultivo y también tradición',t:'A'},{w:'La milpa se siembra cuando empiezan las lluvias',t:'B'},
      {w:'La vida del campo gira alrededor del maíz',t:'A'},{w:'Del maíz molido sale la masa',t:'B'},
      {w:'El maíz une a la familia en la mesa',t:'A'},{w:'Los tamalitos se envuelven en tusa',t:'B'}
    ]
  }
];
let currentRetoPairIdx=0;
let retoPool=[], retoOk=0, retoErr=0, retoTimerInt=null, retoSec=30, retoRunning=false, retoCurrent=null;
function _retoPairLbl(){ const rp=retoPairs[currentRetoPairIdx]; const el=document.getElementById('retoPairLbl'); if(el) el.textContent='🎯 Pareja actual: '+rp.name+' · 💡 '+rp.hint; const ba=document.getElementById('retoBtn-a'), bb=document.getElementById('retoBtn-b'); if(ba) ba.textContent=rp.btnA; if(bb) bb.textContent=rp.btnB; }
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
        const rp=retoPairs[currentRetoPairIdx];
        _fb.textContent=`«${retoCurrent.w}» va en: ${retoCurrent.t==='A'?rp.btnA:rp.btnB}`;
        _fb.className='fb show err';
        setTimeout(()=>_fb.classList.remove('show'),2000);
      }
    }
    document.getElementById('retoScore').textContent=`✔ ${retoOk} correctas | ✗ ${retoErr} errores`; showRetoWord();
}
function endReto(){ retoRunning=false; document.getElementById('retoWord').textContent='🏁 ¡Tiempo!'; document.getElementById('retoTimer').style.color='var(--pri)'; xpTracker.reto.add(1); const total=retoOk+retoErr; const pct=total>0?Math.round((retoOk/total)*100):0; fb('fbReto',`Resultado: ${retoOk}/${total} (${pct}%) ¡Bien hecho! Prueba otra pareja con 🔀`,true); fin('s-reto'); sfx('fan'); unlockAchievement('reto_hero'); }
function resetReto(){ sfx('click'); clearInterval(retoTimerInt); retoRunning=false; retoSec=30; retoOk=0; retoErr=0; document.getElementById('retoTimer').textContent='⏱ 30'; document.getElementById('retoTimer').style.color='var(--pri)'; document.getElementById('retoWord').textContent='¡Prepárate!'; document.getElementById('retoScore').textContent='✔ 0 correctas | ✗ 0 errores'; document.getElementById('fbReto').classList.remove('show'); }

// ===================== SOPA DE LETRAS (multidireccional, con inversas) =====================
// Grids generados y verificados letra por letra con script (una sopa por materia)
const sopaSets=[
    { size:10,
      grid:[
      ['M','D','D','J','V','L','M','B','F','O'],
      ['U','C','E','E','C','A','O','R','T','I'],
      ['L','N','J','C','P','A','A','V','F','D'],
      ['T','E','N','D','I','C','E','C','P','E'],
      ['I','D','U','U','C','M','M','R','L','M'],
      ['P','R','I','I','E','I','A','P','A','O'],
      ['L','F','O','A','J','A','C','L','H','R'],
      ['O','N','R','O','S','I','V','I','D','P'],
      ['P','B','H','T','D','R','V','B','P','G'],
      ['E','G','P','V','O','L','U','M','E','N']],
      words:[
      {w:'FRACCION',cells:[[0,8],[1,7],[2,6],[3,5],[4,4],[5,3],[6,2],[7,1]]},
      {w:'DECIMAL',cells:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]},
      {w:'PROMEDIO',cells:[[7,9],[6,9],[5,9],[4,9],[3,9],[2,9],[1,9],[0,9]]},
      {w:'VOLUMEN',cells:[[9,3],[9,4],[9,5],[9,6],[9,7],[9,8],[9,9]]},
      {w:'AREA',cells:[[5,8],[4,7],[3,6],[2,5]]},
      {w:'MULTIPLO',cells:[[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]]},
      {w:'DIVISOR',cells:[[7,8],[7,7],[7,6],[7,5],[7,4],[7,3],[7,2]]}] },
    { size:10,
      grid:[
      ['E','O','S','N','E','I','T','V','T','C'],
      ['M','N','C','U','E','N','T','O','H','N'],
      ['A','O','B','A','T','E','C','E','R','O'],
      ['I','M','R','C','G','H','J','T','L','T'],
      ['T','I','S','A','B','M','A','O','F','I'],
      ['O','N','A','B','L','E','C','A','E','C'],
      ['T','O','J','T','D','E','B','V','S','I'],
      ['M','N','R','I','R','U','J','B','O','A'],
      ['J','I','C','V','L','A','S','A','F','S'],
      ['C','S','P','A','F','M','C','I','F','I']],
      words:[
      {w:'FABULA',cells:[[4,8],[5,7],[6,6],[7,5],[8,4],[9,3]]},
      {w:'NOTICIA',cells:[[1,9],[2,9],[3,9],[4,9],[5,9],[6,9],[7,9]]},
      {w:'CUENTO',cells:[[1,2],[1,3],[1,4],[1,5],[1,6],[1,7]]},
      {w:'SINONIMO',cells:[[9,1],[8,1],[7,1],[6,1],[5,1],[4,1],[3,1],[2,1]]},
      {w:'MORALEJA',cells:[[1,0],[2,1],[3,2],[4,3],[5,4],[6,5],[7,6],[8,7]]},
      {w:'CARTA',cells:[[9,6],[8,5],[7,4],[6,3],[5,2]]},
      {w:'IDEA',cells:[[7,3],[6,4],[5,5],[4,6]]},
      {w:'RECETA',cells:[[2,8],[2,7],[2,6],[2,5],[2,4],[2,3]]}] }
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

// ===================== LAB 1: LA PIZZA DE FRACCIONES =====================
// La pizza se parte en n pedazos y se sombrean k: la fracción y el decimal
// cambian juntos, que es justo la equivalencia que la prueba pregunta.
const LAB1_RETOS=[
  {txt:'Sombrea la mitad de la pizza', n:1, d:2},
  {txt:'Sombrea 3/4 de la pizza', n:3, d:4},
  {txt:'Sombrea el equivalente de 0.25', n:1, d:4},
  {txt:'Sombrea 5/8 de la pizza', n:5, d:8},
  {txt:'Sombrea el equivalente de 0.75', n:3, d:4}
];
let lab1N=4, lab1Sombra=new Set(), lab1Reto=0;
function _lab1Sector(cx,cy,r,a0,a1){
  const x0=cx+r*Math.cos(a0), y0=cy+r*Math.sin(a0), x1=cx+r*Math.cos(a1), y1=cy+r*Math.sin(a1);
  const big=(a1-a0)>Math.PI?1:0;
  return `M ${cx} ${cy} L ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${big} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`;
}
function lab1Render(){
  const box=document.getElementById('widget-fraccion-lab'); if(!box) return;
  const k=lab1Sombra.size, n=lab1N;
  const dec=(k/n).toFixed(3).replace(/0+$/,'').replace(/\.$/,'');
  let svg=`<svg viewBox="0 0 200 200" style="max-width:220px;display:block;margin:0 auto;">`;
  for(let i=0;i<n;i++){
    const a0=-Math.PI/2+i*2*Math.PI/n, a1=-Math.PI/2+(i+1)*2*Math.PI/n;
    svg+=`<path d="${_lab1Sector(100,100,90,a0,a1)}" fill="${lab1Sombra.has(i)?'var(--pri)':'var(--card)'}" stroke="var(--dark)" stroke-width="2" data-slice="${i}" style="cursor:pointer;"></path>`;
  }
  svg+='</svg>';
  const reto=LAB1_RETOS[lab1Reto];
  box.innerHTML=`
    <div style="display:flex;gap:0.4rem;flex-wrap:wrap;justify-content:center;margin-bottom:0.6rem;">
      ${[2,3,4,5,6,8,10].map(v=>`<button class="btn ${v===n?'btn-pri':'btn-d'}" data-n="${v}">${v} pedazos</button>`).join('')}
    </div>
    ${svg}
    <p style="text-align:center;font-family:'Fredoka',sans-serif;font-size:1.15rem;margin:0.5rem 0;">Sombreado: <strong>${k}/${n}</strong> = <strong>${k===0?'0':dec}</strong></p>
    <div style="border:1.5px dashed var(--pri);border-radius:10px;padding:0.6rem 0.8rem;text-align:center;">
      🎯 Desafío ${lab1Reto+1} de ${LAB1_RETOS.length}: <strong>${reto.txt}</strong>
      <div style="margin-top:0.5rem;"><button class="btn btn-g" id="lab1Check">✅ Comprobar</button></div>
    </div>
    <div id="fbLab1" class="fb" role="alert"></div>`;
  box.querySelectorAll('[data-slice]').forEach(p=>{ p.onclick=()=>{ const i=parseInt(p.dataset.slice,10); if(lab1Sombra.has(i)) lab1Sombra.delete(i); else lab1Sombra.add(i); sfx('click'); lab1Render(); }; });
  box.querySelectorAll('[data-n]').forEach(b=>{ b.onclick=()=>{ lab1N=parseInt(b.dataset.n,10); lab1Sombra=new Set(); sfx('click'); lab1Render(); }; });
  const chk=document.getElementById('lab1Check');
  if(chk) chk.onclick=()=>{
    const r=LAB1_RETOS[lab1Reto];
    // la fracción sombreada debe ser EQUIVALENTE a la pedida (k/n = r.n/r.d)
    const ok=lab1Sombra.size*r.d===r.n*lab1N && lab1Sombra.size>0;
    if(ok){
      sfx('ok');
      if(!xpTracker.lab1.has(lab1Reto)){ xpTracker.lab1.add(lab1Reto); pts(2); }
      fb('fbLab1',`¡Logrado! ${lab1Sombra.size}/${lab1N} es equivalente a ${r.n}/${r.d}. +2 XP`,true);
      lab1Reto=(lab1Reto+1)%LAB1_RETOS.length;
      if(xpTracker.lab1.size===LAB1_RETOS.length) fin('s-lab');
      setTimeout(lab1Render,1400);
    } else { sfx('no'); fb('fbLab1',`Todavía no: llevas ${lab1Sombra.size}/${lab1N}. Pista: puedes cambiar el número de pedazos.`,false); }
  };
}

// ===================== LAB 2: LA FÁBRICA DEL VOLUMEN =====================
const LAB2_RETOS=[12,24,8,30,36];
let lab2L=3, lab2A=2, lab2H=2, lab2Reto=0;
function lab2Render(){
  const box=document.getElementById('widget-volumen-lab'); if(!box) return;
  const v=lab2L*lab2A*lab2H;
  let capas='';
  for(let z=0;z<lab2H;z++){
    let filas='';
    for(let y=0;y<lab2A;y++) filas+='🧊'.repeat(lab2L)+'<br>';
    capas+=`<div style="display:inline-block;border:1.5px solid var(--border);border-radius:8px;padding:0.3rem 0.5rem;margin:0.2rem;line-height:1.1;font-size:0.9rem;">${filas}<div style="font-size:0.65rem;color:var(--gray);text-align:center;">capa ${z+1}</div></div>`;
  }
  const ctl=(lbl,id)=>`<span style="display:inline-flex;align-items:center;gap:0.3rem;margin:0.2rem;"><strong>${lbl}</strong><button class="btn btn-d" data-c="${id}-">−</button><span id="lab2${id}" style="font-family:'Fredoka',sans-serif;min-width:1.4rem;text-align:center;">${id==='L'?lab2L:id==='A'?lab2A:lab2H}</span><button class="btn btn-d" data-c="${id}+">+</button></span>`;
  box.innerHTML=`
    <div style="text-align:center;">${ctl('Largo','L')}${ctl('Ancho','A')}${ctl('Alto','H')}</div>
    <div style="text-align:center;margin:0.5rem 0;">${capas}</div>
    <p style="text-align:center;font-family:'Fredoka',sans-serif;font-size:1.15rem;">V = ${lab2L} × ${lab2A} × ${lab2H} = <strong>${v} m³</strong></p>
    <div style="border:1.5px dashed var(--pri);border-radius:10px;padding:0.6rem 0.8rem;text-align:center;">
      🎯 Desafío ${lab2Reto+1} de ${LAB2_RETOS.length}: arma una caja de <strong>${LAB2_RETOS[lab2Reto]} m³</strong>
      <div style="margin-top:0.5rem;"><button class="btn btn-g" id="lab2Check">✅ Comprobar</button></div>
    </div>
    <div id="fbLab2" class="fb" role="alert"></div>`;
  box.querySelectorAll('[data-c]').forEach(b=>{ b.onclick=()=>{
    const c=b.dataset.c; sfx('click');
    if(c==='L-') lab2L=Math.max(1,lab2L-1); else if(c==='L+') lab2L=Math.min(6,lab2L+1);
    else if(c==='A-') lab2A=Math.max(1,lab2A-1); else if(c==='A+') lab2A=Math.min(4,lab2A+1);
    else if(c==='H-') lab2H=Math.max(1,lab2H-1); else if(c==='H+') lab2H=Math.min(4,lab2H+1);
    lab2Render();
  }; });
  const chk=document.getElementById('lab2Check');
  if(chk) chk.onclick=()=>{
    if(lab2L*lab2A*lab2H===LAB2_RETOS[lab2Reto]){
      sfx('ok');
      if(!xpTracker.lab2.has(lab2Reto)){ xpTracker.lab2.add(lab2Reto); pts(2); }
      fb('fbLab2',`¡Logrado! ${lab2L} × ${lab2A} × ${lab2H} = ${LAB2_RETOS[lab2Reto]} m³. +2 XP`,true);
      lab2Reto=(lab2Reto+1)%LAB2_RETOS.length;
      if(xpTracker.lab1.size===LAB1_RETOS.length&&xpTracker.lab2.size===LAB2_RETOS.length) fin('s-lab');
      setTimeout(lab2Render,1400);
    } else { sfx('no'); fb('fbLab2',`Tu caja tiene ${lab2L*lab2A*lab2H} m³ y el desafío pide ${LAB2_RETOS[lab2Reto]} m³. Ajusta las medidas.`,false); }
  };
}

// ===================== WIDGET: LA MÁQUINA DEL PROMEDIO =====================
let promNotas=[], promAciertos=0;
function promNueva(){
  // la cuarta nota se elige para que el promedio salga entero, como en clase
  let n1,n2,n3,n4,suma;
  do{
    n1=60+Math.floor(Math.random()*41); n2=60+Math.floor(Math.random()*41); n3=60+Math.floor(Math.random()*41);
    const resto=(n1+n2+n3)%4; n4=60+Math.floor(Math.random()*41);
    n4=n4-((n1+n2+n3+n4)%4);
    suma=n1+n2+n3+n4;
  }while(n4<60||n4>100);
  promNotas=[n1,n2,n3,n4];
  const box=document.getElementById('widget-promedio'); if(!box) return;
  box.innerHTML=`
    <table style="width:100%;max-width:340px;margin:0 auto 0.6rem;border-collapse:collapse;text-align:center;font-family:'Fredoka',sans-serif;">
      <tr style="background:var(--pri-gl);">${['I','II','III','IV'].map(p=>`<th style="border:1px solid var(--border);padding:0.3rem;">Parcial ${p}</th>`).join('')}</tr>
      <tr>${promNotas.map(n=>`<td style="border:1px solid var(--border);padding:0.4rem;font-size:1.1rem;">${n}%</td>`).join('')}</tr>
    </table>
    <div style="display:flex;gap:0.5rem;justify-content:center;align-items:center;flex-wrap:wrap;">
      <label for="promInp"><strong>Promedio:</strong></label>
      <input id="promInp" class="eval-cp-input" type="text" inputmode="numeric" style="max-width:90px;" autocomplete="off">
      <button class="btn btn-g" id="promCheck">✅ Comprobar</button>
      <button class="btn btn-d" id="promNext">🔄 Otro alumno</button>
    </div>
    <div id="fbProm" class="fb" role="alert"></div>`;
  document.getElementById('promCheck').onclick=()=>{
    const val=parseInt((document.getElementById('promInp').value||'').replace(/[^\d]/g,''),10);
    const prom=(promNotas[0]+promNotas[1]+promNotas[2]+promNotas[3])/4;
    if(val===prom){
      sfx('ok'); promAciertos++;
      if(promAciertos<=6&&!xpTracker.prom.has(promAciertos)){ xpTracker.prom.add(promAciertos); pts(2); }
      fb('fbProm',`¡Correcto! (${promNotas.join(' + ')}) ÷ 4 = ${prom}. +2 XP`,true);
      setTimeout(promNueva,1600);
    } else { sfx('no'); fb('fbProm',`Revisa: suma las cuatro notas y divide entre 4. La suma da ${promNotas[0]+promNotas[1]+promNotas[2]+promNotas[3]}.`,false); }
  };
  document.getElementById('promNext').onclick=()=>{ sfx('click'); promNueva(); };
}

// ===================== WIDGET: EL DETECTIVE DE LA PALABRA =====================
const detData=[
  {s:['La','niña','iba','contenta','porque','estrenaba','cuadernos'],c:3,pista:'la palabra que significa alegre'},
  {s:['El','cielo','se','puso','oscuro','antes','del','aguacero'],c:4,pista:'la palabra que significa sin luz'},
  {s:['Don','Pedro','es','un','vecino','amable','con','todos'],c:5,pista:'la palabra que significa cortés y bueno'},
  {s:['El','camino','estaba','angosto','y','pasaba','un','solo','carro'],c:3,pista:'la palabra que significa estrecho'},
  {s:['Los','alumnos','terminaron','veloces','la','tarea','de','hoy'],c:3,pista:'la palabra que significa rápidos'},
  {s:['La','sandía','estaba','enorme','este','año'],c:3,pista:'la palabra que significa muy grande'}
];
let detIdx=0, detOk=0;
function detRender(){
  const box=document.getElementById('widget-detective'); if(!box) return;
  if(detIdx>=detData.length){ box.innerHTML='<p style="text-align:center;font-family:\'Fredoka\',sans-serif;">🎉 ¡Caso cerrado, detective! Encontraste todas las palabras.</p>'; return; }
  const d=detData[detIdx];
  box.innerHTML=`
    <p style="font-size:0.85rem;margin-bottom:0.4rem;"><strong>Caso ${detIdx+1} de ${detData.length}:</strong> busca ${d.pista}.</p>
    <div class="id-sent" id="detSent"></div>
    <div id="fbDet" class="fb" role="alert"></div>`;
  const sent=document.getElementById('detSent');
  d.s.forEach((w,i)=>{
    const span=document.createElement('span'); span.className='id-word'; span.textContent=w+' ';
    span.onclick=()=>{
      if(box.dataset.done) return;
      if(i===d.c){
        box.dataset.done='1'; span.classList.add('id-ok'); sfx('ok'); detOk++;
        if(detOk<=6&&!xpTracker.det.has(detOk)){ xpTracker.det.add(detOk); pts(2); }
        fb('fbDet',`¡Correcto! «${d.s[d.c]}» es ${d.pista}. +2 XP`,true);
        setTimeout(()=>{ delete box.dataset.done; detIdx++; detRender(); },1500);
      } else { span.classList.add('id-no'); sfx('no'); fb('fbDet','Esa no es. Vuelve a leer la oración con la pista en mente.',false); }
    };
    sent.appendChild(span);
  });
}

// ===================== WIDGET: ¿m.c.m. o M.C.D.? =====================
const radarData=[
  {s:'Dos gallos cantan cada 10 y cada 15 minutos. ¿Cuándo cantan juntos?',t:'mcm'},
  {s:'Repartir 24 lápices y 30 borradores en bolsas iguales sin sobras',t:'mcd'},
  {s:'Los buses a Tela y a La Ceiba salen cada 12 y 18 minutos. ¿Cuándo salen juntos?',t:'mcm'},
  {s:'Cortar dos varas de 40 y 60 cm en pedazos iguales lo más largos posible',t:'mcd'},
  {s:'Dos faros parpadean cada 4 y cada 6 segundos. ¿Cuándo coinciden?',t:'mcm'},
  {s:'Armar los equipos más grandes posibles con 18 niñas y 24 niños',t:'mcd'},
  {s:'Riego un huerto cada 4 días y el otro cada 10. ¿Cuándo riego los dos?',t:'mcm'},
  {s:'Dividir dos listones en las partes iguales más largas',t:'mcd'}
];
let radarPool=[], radarOk=0;
function radarRender(){
  const box=document.getElementById('widget-mcmmcd'); if(!box) return;
  if(radarPool.length===0) radarPool=_shuffle([...radarData]);
  const item=radarPool[0];
  box.innerHTML=`
    <div style="border:1.5px solid var(--border);border-radius:10px;padding:0.7rem 0.9rem;text-align:center;font-family:'Fredoka',sans-serif;margin-bottom:0.6rem;">${item.s}</div>
    <div style="display:flex;gap:0.6rem;justify-content:center;flex-wrap:wrap;">
      <button class="btn btn-pri" id="radarMcm">🔁 m.c.m.</button>
      <button class="btn btn-sec" id="radarMcd">✂️ M.C.D.</button>
    </div>
    <div id="fbRadar" class="fb" role="alert"></div>`;
  const responder=(resp)=>{
    if(resp===item.t){
      sfx('ok'); radarOk++;
      if(radarOk<=6&&!xpTracker.radar.has(radarOk)){ xpTracker.radar.add(radarOk); pts(2); }
      fb('fbRadar',item.t==='mcm'?'¡Correcto! Coincidir y repetirse es de m.c.m. +2 XP':'¡Correcto! Repartir o cortar sin sobras es de M.C.D. +2 XP',true);
    } else {
      sfx('no');
      fb('fbRadar',item.t==='mcm'?'Era m.c.m.: la situación pregunta cuándo COINCIDEN dos cosas que se repiten.':'Era M.C.D.: la situación pide REPARTIR o cortar en partes iguales sin sobras.',false);
    }
    radarPool.shift();
    setTimeout(radarRender,1800);
  };
  document.getElementById('radarMcm').onclick=()=>responder('mcm');
  document.getElementById('radarMcd').onclick=()=>responder('mcd');
}

// ===================== GENERADOR DE TAREAS =====================
// Tareas autogeneradas: el estudiante se autoasigna práctica desde casa o el
// docente las copia en el pizarrón. Cada "⚡ Generar" crea ejercicios nuevos
// y las respuestas quedan ocultas hasta presionar "👁 Respuestas".
function _tgRint(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
function _tgLines(n){ let s=''; for(let i=0;i<n;i++) s+='<div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.4rem;height:1.3rem;">&nbsp;</div>'; return s; }
function _tgTask(out,i,inner){ const div=document.createElement('div'); div.className='tg-task'; div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content">${inner}</div>`; out.appendChild(div); }
function _instrBlock(out,title,lines){ const ib=document.createElement('div'); ib.className='tg-instruction-block'; ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join(''); out.appendChild(ib); }

// 🍕 Sumas y restas de fracciones heterogéneas (con resultado positivo)
function genFraccionesTask(out,count){
  _instrBlock(out,'Instrucción: fracciones',['Resuelve cada suma o resta. Si los denominadores son distintos, busca primero el común denominador con el m.c.m. y al final SIMPLIFICA.','<strong>Pista:</strong> los denominadores nunca se suman ni se restan.']);
  for(let i=0;i<count;i++){
    const d1=_tgRint(2,10); let d2=_tgRint(2,10); if(d2===d1&&Math.random()<0.6) d2=_tgRint(2,10);
    const n1=_tgRint(1,d1-1||1), n2=_tgRint(1,d2-1||1);
    const resta=Math.random()<0.4;
    const comun=_mcmDe(d1,d2);
    let rn, signo;
    if(resta){
      // se ordena para que el resultado sea positivo
      const a=n1*(comun/d1), b=n2*(comun/d2);
      rn=Math.abs(a-b); signo='−';
      const [x,y]=a>=b?[[n1,d1],[n2,d2]]:[[n2,d2],[n1,d1]];
      if(rn===0){ i--; continue; }
      _tgTask(out,i,`<strong>${x[0]}/${x[1]} ${signo} ${y[0]}/${y[1]} =</strong>${_tgLines(1)}<div class="tg-answer">✔ ${_fmtFrac(rn,comun)} (común denominador: ${comun})</div>`);
      continue;
    }
    rn=n1*(comun/d1)+n2*(comun/d2); signo='+';
    _tgTask(out,i,`<strong>${n1}/${d1} ${signo} ${n2}/${d2} =</strong>${_tgLines(1)}<div class="tg-answer">✔ ${_fmtFrac(rn,comun)} (común denominador: ${comun})</div>`);
  }
}
// 💰 Compras con decimales
function genDecimalesTask(out,count){
  _instrBlock(out,'Instrucción: compras con decimales',['Calcula el total de cada compra. Multiplica como si no hubiera punto y al final colócalo contando las cifras decimales.','<strong>Comprueba</strong> estimando: si la libra cuesta como L.20 y llevas 3, el total anda por L.60.']);
  const prods=['frijoles','arroz','azúcar','café','maíz','manteca','harina'];
  for(let i=0;i<count;i++){
    const precio=_tgRint(800,6000)/100; const libras=_tgRint(2,9);
    const total=Math.round(precio*libras*100)/100;
    _tgTask(out,i,`<strong>La libra de ${prods[_tgRint(0,prods.length-1)]} cuesta L.${precio.toFixed(2)}. ¿Cuánto cuestan ${libras} libras?</strong>${_tgLines(1)}<div class="tg-answer">✔ L.${total.toFixed(2)}</div>`);
  }
}
// 🔁 m.c.m. y M.C.D.
function genMcmMcdTask(out,count){
  _instrBlock(out,'Instrucción: m.c.m. y M.C.D.',['Calcula lo que se pide de cada pareja de números.','<strong>Recuerda:</strong> m.c.m. = el menor múltiplo común (para coincidir) · M.C.D. = el mayor divisor común (para repartir).']);
  for(let i=0;i<count;i++){
    const a=_tgRint(4,30), b=_tgRint(4,30);
    if(_mcdDe(a,b)===1&&Math.random()<0.5){ i--; continue; }
    const esMcm=Math.random()<0.5;
    if(esMcm) _tgTask(out,i,`<strong>Calcula el m.c.m. de ${a} y ${b}</strong>${_tgLines(1)}<div class="tg-answer">✔ m.c.m.(${a}, ${b}) = ${_mcmDe(a,b)}</div>`);
    else _tgTask(out,i,`<strong>Calcula el M.C.D. de ${a} y ${b}</strong>${_tgLines(1)}<div class="tg-answer">✔ M.C.D.(${a}, ${b}) = ${_mcdDe(a,b)}</div>`);
  }
}
// 🚌 Viajes
function genViajesTask(out,count){
  _instrBlock(out,'Instrucción: viajes',['Resuelve con las fórmulas del viaje: distancia = velocidad × tiempo · tiempo = distancia ÷ velocidad · velocidad = distancia ÷ tiempo.']);
  const rutas=[['La Ceiba','Tela'],['Choluteca','Danlí'],['Santa Rosa de Copán','Gracias'],['Juticalpa','Catacamas'],['Comayagua','Siguatepeque'],['La Esperanza','Marcala']];
  for(let i=0;i<count;i++){
    const v=[40,45,50,60,70,75,80,90][_tgRint(0,7)]; const t=_tgRint(2,8); const d=v*t;
    const ruta=rutas[_tgRint(0,rutas.length-1)];
    const tipo=_tgRint(0,2);
    if(tipo===0) _tgTask(out,i,`<strong>Un bus va de ${ruta[0]} a ${ruta[1]}: recorre ${d} km a ${v} km por hora. ¿Cuántas horas tarda?</strong>${_tgLines(1)}<div class="tg-answer">✔ ${d} ÷ ${v} = ${t} horas</div>`);
    else if(tipo===1) _tgTask(out,i,`<strong>Un carro viaja a ${v} km por hora durante ${t} horas. ¿Qué distancia recorre?</strong>${_tgLines(1)}<div class="tg-answer">✔ ${v} × ${t} = ${d} km</div>`);
    else _tgTask(out,i,`<strong>Un bus recorrió ${d} km en ${t} horas. ¿A qué velocidad viajó?</strong>${_tgLines(1)}<div class="tg-answer">✔ ${d} ÷ ${t} = ${v} km por hora</div>`);
  }
}
// 📐 Área y volumen
function genGeometriaTask(out,count){
  _instrBlock(out,'Instrucción: área y volumen',['Usa la fórmula correcta y escribe la unidad: cm² o m² para áreas, cm³ o m³ para volúmenes.','Área del círculo = 3.14 × r × r · Área del cuadrado = lado × lado · Volumen del prisma = largo × ancho × alto.']);
  for(let i=0;i<count;i++){
    const tipo=_tgRint(0,2);
    if(tipo===0){ const r=_tgRint(1,10); const a=Math.round(3.14*r*r*100)/100; _tgTask(out,i,`<strong>Calcula el área de un círculo de ${r} m de radio (π = 3.14)</strong>${_tgLines(1)}<div class="tg-answer">✔ 3.14 × ${r} × ${r} = ${a} m²</div>`); }
    else if(tipo===1){ const l=_tgRint(2,15); _tgTask(out,i,`<strong>Calcula el área de un cuadrado de ${l} cm de lado</strong>${_tgLines(1)}<div class="tg-answer">✔ ${l} × ${l} = ${l*l} cm²</div>`); }
    else { const l=_tgRint(2,9),an=_tgRint(2,6),al=_tgRint(2,6); _tgTask(out,i,`<strong>Calcula el volumen de una caja de ${l} m de largo, ${an} m de ancho y ${al} m de alto</strong>${_tgLines(1)}<div class="tg-answer">✔ ${l} × ${an} × ${al} = ${l*an*al} m³</div>`); }
  }
}
// 📊 Promedios
function genPromedioTask(out,count){
  _instrBlock(out,'Instrucción: promedios',['Calcula el promedio: suma todas las calificaciones y divide entre cuántas son.']);
  const nombres=['Ana','Luis','Marta','José','Carmen','Pedro','Sofía','Iván'];
  for(let i=0;i<count;i++){
    let n1=_tgRint(60,100),n2=_tgRint(60,100),n3=_tgRint(60,100),n4=_tgRint(60,100);
    n4=n4-((n1+n2+n3+n4)%4); if(n4<60){ i--; continue; }
    const prom=(n1+n2+n3+n4)/4;
    _tgTask(out,i,`<strong>${nombres[_tgRint(0,nombres.length-1)]} sacó ${n1}%, ${n2}%, ${n3}% y ${n4}% en los cuatro parciales. ¿Cuál es su promedio?</strong>${_tgLines(1)}<div class="tg-answer">✔ (${n1} + ${n2} + ${n3} + ${n4}) ÷ 4 = ${prom}%</div>`);
  }
}
// 🧠 Pensamiento y escritura (banco fijo, mezcla las dos materias)
const pensamientoTaskDB=[
  {q:'Rita dice: «1/2 + 1/3 = 2/5». Explica cuál fue su error y resuelve la suma bien.',ans:'Sumó numeradores y denominadores. Lo correcto: común denominador 6, 3/6 + 2/6 = 5/6.',type:'🔎 Detectar error'},
  {q:'Escribe un problema de la vida real que se resuelva con el M.C.D. de 12 y 18, y resuélvelo.',ans:'Respuesta variable. Ej.: repartir 12 mangos y 18 naranjas en bolsas iguales máximas: M.C.D. = 6 bolsas.',type:'✏️ Crear problema'},
  {q:'¿Puede el promedio de cuatro notas ser mayor que la nota más alta? Justifica con un ejemplo.',ans:'No. El promedio siempre queda entre la nota más baja y la más alta, porque reparte el total entre todas.',type:'🧠 Razonar'},
  {q:'Escribe una oración que sea un HECHO sobre tu escuela y otra que sea una OPINIÓN, y di cómo las distingues.',ans:'Respuesta variable. El hecho se puede comprobar (contar, medir); la opinión depende de quién habla.',type:'📖 Hecho y opinión'},
  {q:'Un texto dice: «El cusuco sale de noche. De día duerme en su cueva». Inventa una pregunta LITERAL y una INFERENCIAL sobre él.',ans:'Literal: ¿cuándo sale el cusuco? Inferencial: ¿por qué es difícil verlo al mediodía? (porque duerme de día).',type:'📖 Tipos de pregunta'},
  {q:'La ficha de un libro dice: 240 páginas. Si lees 30 páginas por día, ¿en cuántos días lo terminas? ¿Y si lees el doble?',ans:'240 ÷ 30 = 8 días. Al doble (60 por día): 240 ÷ 60 = 4 días, la mitad del tiempo.',type:'🧮 Dos pasos'}
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
function genTask(){ sfx('click'); const type=document.getElementById('tgType').value; const count=parseInt(document.getElementById('tgCount').value); ansVisible=false; const out=document.getElementById('tgOut'); out.innerHTML=''; if(type==='fracciones') genFraccionesTask(out,count); else if(type==='decimales') genDecimalesTask(out,count); else if(type==='mcmmcd') genMcmMcdTask(out,count); else if(type==='viajes') genViajesTask(out,count); else if(type==='geometria') genGeometriaTask(out,count); else if(type==='promedio') genPromedioTask(out,count); else if(type==='pensamiento') genPensamientoTask(out,count); fin('s-tareas'); }
function toggleAns(){ ansVisible=!ansVisible; document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none'); sfx('click'); }

// ===================== ESCRITURA: EXPLICA Y REDACTA =====================
// Las dos consignas de escritura de la prueba real (secuencia y opinión) más
// carta, moraleja y hecho-opinión. La pauta la revisa el propio alumno.
const explicaData = [
  {
    q: 'Escribe una historia con su título a partir de esta secuencia: una semilla que se siembra, la lluvia que cae, la planta que crece, la mazorca que se cosecha, la tortilla que se prepara y la mesa donde se comparte.',
    hint: '💡 Pista: mira la secuencia completa antes de escribir y usa palabras de orden: primero, después, al final.',
    rubric: ['✓ Lleva título propio y narra con al menos un personaje (no es una lista de pasos)', '✓ Sigue la secuencia completa y en orden: semilla, lluvia, planta, mazorca, tortilla, mesa', '✓ Tiene inicio, desarrollo y final, con conectores de tiempo y buena ortografía'],
    suggested: '«El viaje del maíz». Don Chico sembró una semilla en su milpa. Primero la lluvia la despertó y la planta creció alta. Después, la familia cosechó las mazorcas y la abuela molió el maíz para hacer tortillas. Al final, todos las compartieron calientes en la mesa.'
  },
  {
    q: '¿Por qué conviene leer todos los días? Escribe tu opinión en al menos cuatro líneas y defiéndela con dos argumentos, cada uno con su explicación.',
    hint: '💡 Pista: empieza con «Yo creo que…» y da dos razones DISTINTAS, no la misma dicha de dos formas.',
    rubric: ['✓ Expresa la opinión con claridad desde el inicio', '✓ Da al menos dos argumentos distintos y cada uno viene explicado', '✓ Usa conectores (porque, además, por eso) y cierra retomando la opinión'],
    suggested: 'Yo creo que conviene leer todos los días. Primero, porque se aprenden palabras nuevas, y con más palabras uno entiende mejor las clases. Además, leyendo se conocen lugares y vidas que uno no puede visitar. Por eso pienso que un rato de lectura diaria hace mejores estudiantes.'
  },
  {
    q: 'Escríbele una carta corta a un primo o una prima que vive en otro municipio: cuéntale algo bueno que pasó en tu escuela e invítalo a visitarte.',
    hint: '💡 Pista: la carta lleva lugar y fecha, saludo, cuerpo y despedida con firma.',
    rubric: ['✓ Lleva sus partes completas: lugar y fecha, saludo, cuerpo y despedida con firma', '✓ Cumple los dos encargos: contar lo de la escuela e invitar a la visita', '✓ Usa un tono cercano, con las ideas en orden y ortografía cuidada'],
    suggested: 'Marcala, 12 de agosto. Querida prima Lucía: te cuento que mi escuela ganó la Feria de la Lectura y a mi cartel le dieron un diploma. Me gustaría que vinieras a conocer mi escuela y de paso jugamos en el río. ¡Te espero pronto! Con cariño, tu primo Andrés.'
  },
  {
    q: 'Lee esta fábula: una tortuga les pidió a dos patos que la llevaran a conocer la laguna grande. Los patos sujetaron un palo con el pico, la tortuga lo mordió por el centro y así volaron. Abajo, unos niños gritaron: ¡qué patos tan listos! La tortuga, ofendida, abrió la boca para gritar que la idea había sido suya, y cayó. Explica con tus palabras la moraleja y cuenta una situación de la vida real donde se aplique.',
    hint: '💡 Pista: la moraleja es la enseñanza; no vuelvas a contar la historia.',
    rubric: ['✓ Identifica la enseñanza: quien habla cuando no debe, o por presumir, sale perdiendo', '✓ La explica con palabras propias, sin copiar frases de la fábula', '✓ Da un ejemplo creíble de la vida diaria donde esa enseñanza se cumpla'],
    suggested: 'La moraleja es que hay que pensar antes de hablar: la tortuga cayó por presumir. Pasa en la vida real: si en un examen alguien se pone a presumir sus respuestas en voz alta en vez de concentrarse, termina perdiendo lo que ya tenía ganado.'
  },
  {
    q: 'Transforma esta opinión en un hecho que se pueda comprobar: «La biblioteca de la escuela es lo mejor que tenemos». Escribe una oración que cualquiera pueda verificar y explica en una línea por qué tu nueva oración ya no es una opinión.',
    hint: '💡 Pista: quita las palabras de juicio (mejor, bonita) y deja solo lo que se puede contar o medir.',
    rubric: ['✓ Escribe una oración comprobable, con datos que se pueden contar, medir o consultar', '✓ Elimina las palabras de juicio (mejor, bonita, lo máximo)', '✓ Explica que un hecho se comprueba con datos y una opinión depende de quién habla'],
    suggested: '«La biblioteca de la escuela tiene 200 libros y abre de lunes a viernes.» Ya no es opinión porque cualquiera puede contar los libros y revisar el horario: no depende de lo que alguien piense.'
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
    <div class="explica-prog">Consigna ${idx + 1} de ${explicaData.length}</div>
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
  else { fin('s-explica'); sfx('fan'); showToast('🎉 ¡Sección Escritura completada!'); }
}
function prevExplica() { sfx('click'); if (explicaIdx > 0) showExplicaItem(explicaIdx - 1); }

// ===================== EVALUACIÓN DE REPASO (CONCEPTUAL, POR MATERIA) =====================
// Como el cuadernillo real, la evaluación tiene una prueba de Matemáticas y una
// de Español. Cada una vale 100 pts (20 ítems × 5) y se imprime como documento
// propio CON EL COLOR DE SU MATERIA (azul mate, dorado español), que es lo que
// manda la normativa de colores: un solo acento por documento.
const evalTFBankMat=[
  {q:'El decimal 0.75 es igual a la fracción 3/4.',a:true},
  {q:'El resultado de 5/9 + 2/9 es 7/18.',a:false},
  {q:'El número 234 es divisible entre 3.',a:true},
  {q:'El m.c.m. de 4 y 6 es 24.',a:false},
  {q:'El M.C.D. de 12 y 18 es 6.',a:true},
  {q:'El área de un círculo de radio 3 cm es 18.84 cm².',a:false},
  {q:'Un bus que viaja a 50 km por hora recorre 200 km en 3 horas.',a:false},
  {q:'El resultado de 0.5 × 0.5 es 0.25.',a:true}
];
const evalTFBankEsp=[
  {q:'Una fábula es un relato breve, casi siempre con animales que hablan, y termina con una moraleja.',a:true},
  {q:'La idea principal de un texto es cualquier detalle que aparezca en él.',a:false},
  {q:'Una noticia informa de un hecho real y reciente, y responde a qué pasó, quién, cuándo y dónde.',a:true},
  {q:'Comprender de forma literal es entender lo que el texto dice tal como está escrito.',a:true},
  {q:'Un texto instructivo, como una receta, cuenta una historia con personajes.',a:false},
  {q:'Hacer una inferencia es adivinar al azar, sin fijarse en lo que el texto dice.',a:false},
  {q:'Una carta va dirigida a una persona y lleva saludo, cuerpo y despedida.',a:true}
];
// Banco de selección múltiple de las DOS materias (el Campeonísimo lo lee tal
// cual con «Actualizar banco»; el campo materia decide en qué prueba sale).
const evalMCBank=[
  {materia:'mat',q:'Doña Rosa compró en la pulpería 1/2 libra de queso y 3/4 de libra de mantequilla. ¿Cuántas libras compró en total?',o:['a) 4/6','b) 1 1/4','c) 3/8','d) 1 1/2'],a:1},
  {materia:'mat',q:'¿Qué fracción hace verdadera la expresión 2/3 × ___ = 6/15?',o:['a) 3/5','b) 5/3','c) 4/12','d) 12/45'],a:0},
  {materia:'mat',q:'¿Cuál es el resultado de 5/6 ÷ 10/9? Simplifica tu respuesta.',o:['a) 25/27','b) 4/3','c) 3/4','d) 2/3'],a:2},
  {materia:'mat',q:'En el mercado, la libra de frijoles cuesta L.22.40. ¿Cuánto cuestan 3.5 libras?',o:['a) L.25.90','b) L.67.20','c) L.78.40','d) L.784.00'],a:2},
  {materia:'mat',q:'Se pagaron L.94.50 por 4.5 libras de arroz. ¿Cuánto cuesta cada libra?',o:['a) L.2.10','b) L.21.00','c) L.90.00','d) L.210.00'],a:1},
  {materia:'mat',q:'Un bus sale de La Ceiba y recorre 360 km a 45 km por hora. ¿Cuánto tarda el viaje?',o:['a) 5 horas','b) 6 horas','c) 7 horas','d) 8 horas'],a:3},
  {materia:'mat',q:'¿Cuál opción muestra las fracciones 2/3, 3/8 y 5/6 en orden de menor a mayor?',o:['a) 3/8 &lt; 2/3 &lt; 5/6','b) 2/3 &lt; 3/8 &lt; 5/6','c) 5/6 &lt; 2/3 &lt; 3/8','d) 3/8 &lt; 5/6 &lt; 2/3'],a:0},
  {materia:'mat',q:'Una pila de agua mide 3 m de largo, 2 m de ancho y 1.5 m de profundidad. ¿Cuál es su volumen?',o:['a) 6 m³','b) 6.5 m³','c) 9 m³','d) 27 m³'],a:2},
  {materia:'esp',q:'El pino es el árbol nacional de Honduras y crece en casi todos los departamentos. Su madera sirve para construir casas y muebles, sus raíces sujetan la tierra de las laderas y su sombra refresca los caminos. Además, de su tronco se saca una resina que sirve para hacer pegamentos y pinturas. Por todo eso, cuidarlo es tarea de todos.\n\n¿De qué trata principalmente el texto?',o:['a) De los muebles que se hacen con madera de pino.','b) De la importancia del pino para Honduras.','c) De la sombra que dan los árboles en los caminos.','d) De las pinturas y los pegamentos.'],a:1},
  {materia:'esp',q:'El río que pasa junto a la aldea les da mucho a los vecinos: agua para regar las milpas, peces para la comida y un lugar fresco donde bañarse. Pero cuando alguien tira basura en la orilla, esa misma agua enferma a la gente. Por eso los vecinos formaron brigadas para limpiarlo y vigilarlo.\n\n¿De qué trata principalmente el texto?',o:['a) De los peces que viven en el río.','b) De las brigadas que formaron los vecinos.','c) De la basura que hay en la orilla.','d) De lo importante que es el río y de por qué hay que cuidarlo.'],a:3},
  {materia:'esp',q:'En la feria del pueblo, doña Marta madruga para armar su puesto de comida. Desde temprano el parque se pone bullicioso: los vendedores gritan sus ofertas, la banda ensaya y los niños corren entre los juegos. A doña Marta ese ruido no le molesta; al contrario, le avisa que ese día venderá todas sus baleadas.\n\n¿Qué significa en el texto la palabra bullicioso?',o:['a) ruidoso','b) vacío','c) oscuro','d) peligroso'],a:0},
  {materia:'esp',q:'El colibrí esmeralda es un ave que solo vive en Honduras, en algunos valles secos del oriente del país. Es un ave diminuta: cabe completa en la palma de la mano de un niño. Con su pico largo bebe el néctar de las flores y mueve las alas tan rápido que apenas se ven.\n\n¿Qué significa en el texto la palabra diminuta?',o:['a) brillante','b) muy pequeña','c) muy veloz','d) ruidosa'],a:1},
  {materia:'esp',q:'Hola, prima Rosa: te escribo desde La Ceiba para contarte que ya empezaron los ensayos de la banda de la escuela. Me tocó tocar el redoblante y practico todas las tardes en el patio. El desfile será en el parque central y mi mamá me está cosiendo el uniforme. Ojalá puedas venir a verme. Tu primo, Andrés.\n\nSegún el texto, ¿qué le tocó hacer a Andrés en la banda?',o:['a) Coser el uniforme.','b) Dirigir el desfile.','c) Tocar el redoblante.','d) Ensayar en el parque central.'],a:2},
  {materia:'esp',q:'Don Tulio revisó el cielo al amanecer: nubes negras venían bajando de la montaña. Sin desayunar, juntó los granos de café que estaban secándose en el patio, los metió en sacos y los acomodó bajo el techo del corredor. Apenas terminó, cayeron las primeras gotas gruesas sobre las láminas.\n\n¿Para qué guardó don Tulio los granos de café?',o:['a) Para venderlos ese mismo día.','b) Para que no se los robaran.','c) Para desayunar más tarde.','d) Para que la lluvia no los mojara.'],a:3},
  {materia:'esp',q:'Choluteca. La escuela Dionisio de Herrera celebró el viernes su primera Feria de la Lectura. Los alumnos de sexto grado presentaron carteles sobre sus libros favoritos y la directora, Reina Osorto, entregó diplomas a los tres mejores lectores del año. Al acto llegaron madres, padres y vecinos de la comunidad.\n\nPor su contenido y su forma, ¿qué tipo de texto es?',o:['a) Una noticia.','b) Un cuento.','c) Una receta.','d) Una carta.'],a:0}
];
const evalCPBankMat=[
  {q:'La fracción 3/5 escrita como decimal es ___.',a:'0.6',acc:['0.6','0.60','.6','6/10']},
  {q:'El decimal 0.08 escrito como fracción es ___.',a:'8/100',acc:['8/100','2/25']},
  {q:'El resultado de 7/10 + 2/10 es ___.',a:'9/10',acc:['9/10','0.9']},
  {q:'El m.c.m. de 6 y 8 es ___.',a:'24',acc:['24','veinticuatro']},
  {q:'El M.C.D. de 20 y 30 es ___.',a:'10',acc:['10','diez']},
  {q:'Un número es divisible entre 5 si su última cifra es 0 o ___.',a:'5',acc:['5','cinco']},
  {q:'El área de un cuadrado de 9 cm de lado es ___ cm².',a:'81',acc:['81','ochenta y uno']},
  {q:'El promedio de las calificaciones 80, 90 y 100 es ___.',a:'90',acc:['90','90%','noventa']}
];
const evalCPBankEsp=[
  {q:'No salimos al recreo ___ estaba lloviendo muy fuerte.',a:'porque',acc:['porque']},
  {q:'___ de maíz, en la milpa de don Chico se siembra frijol.',a:'Además',acc:['ademas']},
  {q:'Llovió toda la noche. ___, el partido se jugó a la hora anunciada.',a:'Sin embargo',acc:['sin embargo']},
  {q:'Compré una bolsa de naranjas y me ___ comí todas en el camino.',a:'las',acc:['las']},
  {q:'A Pedro se le perdió la mochila y todavía no ___ encuentra.',a:'la',acc:['la']},
  {q:'___ agua del pozo sale fría hasta en verano.',a:'El',acc:['el']},
  {q:'Salimos temprano ___ que el sol no nos agarrara en el camino.',a:'para',acc:['para']}
];
const evalPRBankMat=[
  {term:'Fracción equivalente',def:'Fracción que vale lo mismo escrita con otros números'},
  {term:'m.c.m.',def:'El menor múltiplo común de dos o más números'},
  {term:'M.C.D.',def:'El mayor número que divide exacto a dos números'},
  {term:'Promedio',def:'La suma de los datos dividida entre cuántos son'},
  {term:'Área',def:'La medida de la superficie de una figura plana'},
  {term:'Volumen',def:'El espacio que ocupa un cuerpo geométrico'},
  {term:'Número mixto',def:'Un entero acompañado de una fracción, como 2 1/5'},
  {term:'Decimal',def:'Número que usa punto para mostrar partes del entero'}
];
const evalPRBankEsp=[
  {term:'Cuento',def:'Narración inventada con personajes, escrita para entretener'},
  {term:'Fábula',def:'Relato breve donde hablan animales, con moraleja final'},
  {term:'Carta',def:'Escrito a una persona: saludo, cuerpo, despedida y firma'},
  {term:'Noticia',def:'Informa un hecho real y reciente: qué, quién, cuándo, dónde'},
  {term:'Instructivo',def:'Da pasos en orden para lograr un resultado, como una receta'},
  {term:'Idea principal',def:'Lo más importante que un texto dice sobre su tema'},
  {term:'Sinónimo',def:'Palabra que significa casi lo mismo que otra'}
];
const MATERIA_EVAL={
  mat:{nombre:'Matemáticas', tf:evalTFBankMat, cp:evalCPBankMat, pr:evalPRBankMat, acc:'#1565c0', bg:'#e3f2fd', borde:'#cce0ff', semilla:0},
  esp:{nombre:'Español',     tf:evalTFBankEsp, cp:evalCPBankEsp, pr:evalPRBankEsp, acc:'#c49000', bg:'#fef9e7', borde:'#ead9a8', semilla:500000}
};
// ══════════ Formas deterministas v1 (M.E.T.A.S, jul 2026) ══════════
// La Forma N genera SIEMPRE el mismo examen y la misma pauta («bucle exacto»),
// en cualquier navegador y aunque se cierre el programa. PRNG mulberry32
// (aritmética entera exacta) + barajado Fisher-Yates. ⚠️ NO usar
// sort(() => rng() - 0.5): el resultado depende del motor del navegador.
// ⚠️ Editar los bancos de preguntas CAMBIA el contenido de todas las formas.
// Esta misión usa 20 FORMAS (no 30): la prueba abarca el temario del año
// entero y con veinte variantes alcanza para toda un aula sin copiarse.
const EVAL_FORMAS = 20;
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
function _evalFormaSelector() { _injectFormaSel('genEval', 'evalFormaSel', evalMateria === 'esp' ? evalFormNumEsp : evalFormNumMat, function (v) { if (evalMateria === 'esp') evalFormNumEsp = v; else evalFormNumMat = v; }); }

function evalSwitchMode(mode) {
  sfx('click');
  const cWrap = document.getElementById('evalConceptWrap'), oWrap = document.getElementById('evalOpWrap');
  const btns = { mat: document.getElementById('evalModeBtnMat'), esp: document.getElementById('evalModeBtnEsp'), op: document.getElementById('evalModeBtnOp') };
  Object.entries(btns).forEach(([k, b]) => { if (!b) return; const on = (k === mode); b.classList.toggle('active', on); b.setAttribute('aria-selected', on ? 'true' : 'false'); });
  if (mode === 'op') { cWrap.style.display = 'none'; oWrap.style.display = 'block'; return; }
  oWrap.style.display = 'none'; cWrap.style.display = 'block';
  if (evalMateria !== mode) {
    evalMateria = mode;
    // el selector de forma cambia de materia: se reconstruye con su valor propio
    const selWrap = document.getElementById('evalFormaSel'); if (selWrap && selWrap.parentNode) selWrap.parentNode.remove();
    // acento de la tarjeta según la materia (azul mate, dorado español)
    const card = document.querySelector('#evalConceptWrap .card');
    if (card) { card.classList.toggle('ac-blue', mode === 'mat'); card.classList.toggle('ac-gold', mode === 'esp'); }
    genEval();
  }
}

function genEval(){
  sfx('click');
  _evalFormaSelector();
  const m=evalMateria, M=MATERIA_EVAL[m];
  const _selF = document.getElementById('evalFormaSel');
  if (_selF && parseInt(_selF.value, 10)) { const v=Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10))); if(m==='esp') evalFormNumEsp=v; else evalFormNumMat=v; }
  const cf = (m==='esp'?evalFormNumEsp:evalFormNumMat);
  const rng = _evalRng(M.semilla + cf); /* la Forma cf de ESTA materia siembra todo el azar */
  // Al registro de evidencia la prueba de Español viaja como forma 100+N (igual
  // que la Forma R viaja como 100+N): así el maestro distingue las dos materias
  // sin tocar la capa de registro ni el SQL.
  window._currentEvalForm = (m==='esp'?100+cf:cf);
  window._currentEvalMateria = m;
  if(m==='esp') evalFormNumEsp=(evalFormNumEsp%EVAL_FORMAS)+1; else evalFormNumMat=(evalFormNumMat%EVAL_FORMAS)+1;
  const selWrap=document.getElementById('evalFormaSel'); if(selWrap&&selWrap.parentNode) selWrap.parentNode.remove();
  _evalFormaSelector(); saveProgress();
  document.getElementById('eval-screen-title').textContent=`📝 Prueba de ${M.nombre}: Forma ${cf}`;
  const pt=document.getElementById('eval-print-title'); if(pt) pt.textContent=`Evaluación de Repaso · Prueba de Fin de Grado 6º · ${M.nombre}`;
  evalAnsVisible=false;
  const out=document.getElementById('evalOut'); out.innerHTML='';
  const bar=document.createElement('div'); bar.className='eval-score-bar';
  bar.innerHTML=`<div><div class="esb-title">📊 Prueba de ${M.nombre}: 100 puntos</div><div class="esb-dist">4 secciones × 5 preguntas × 5 pts = 100 pts</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">I. Completar 25 pts</span><span class="eval-score-pill esp-tf">II. V/F 25 pts</span><span class="eval-score-pill esp-mc">III. Selección 25 pts</span><span class="eval-score-pill esp-pr">IV. Pareados 25 pts</span></div>`;
  out.appendChild(bar);
  const cpItems=_pickF(M.cp,5, rng);
  const s1=document.createElement('div'); s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  cpItems.forEach((item,i)=>{ const d=document.createElement('div'); d.className='eval-item eval-auto-item'; const qHtml=item.q.replace('___','<input class="eval-cp-input" type="text" data-ecp="'+i+'" autocomplete="off" style="min-width:110px;">'); d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbEcp${i}" aria-live="polite"></div>`; s1.appendChild(d); });
  out.appendChild(s1);
  const tfItems=_pickF(M.tf,5, rng);
  const s2=document.createElement('div'); s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  tfItems.forEach((item,i)=>{ const d=document.createElement('div'); d.className='eval-item eval-auto-item'; d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="V"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="F"> Falso</label></div><div style="margin-top:0.4rem;margin-left:1.7rem;font-size:0.82rem;color:var(--gray);">Justifica por qué: <span style="display:inline-block;min-width:180px;border-bottom:1px solid var(--border);">&nbsp;</span></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbEtf${i}" aria-live="polite"></div>`; s2.appendChild(d); });
  out.appendChild(s2);
  const mcItems=_pickF(evalMCBank.filter(x=>x.materia===m),5, rng);
  const s3=document.createElement('div'); s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  mcItems.forEach((item,i)=>{ const d=document.createElement('div'); d.className='eval-item eval-auto-item'; const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join(''); d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q.replace(/\n/g,'<br>')}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbEmc${i}" aria-live="polite"></div>`; s3.appendChild(d); });
  out.appendChild(s3);
  const prItems=_pickF(M.pr,5, rng); const shuffledDefs=_shuffleF(prItems, rng); const letters=['A','B','C','D','E'];
  const s4=document.createElement('div'); s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  const matchCard=document.createElement('div'); matchCard.className='eval-item eval-auto-item';
  let colLeft='<div class="eval-match-col"><h4>📘 Términos</h4>';
  prItems.forEach((item,i)=>{ const selHtml='<select class="eval-pr-sel" data-epr="'+i+'" aria-label="Letra para '+item.term+'"><option value="">·</option>'+letters.map(L=>'<option value="'+L+'">'+L+'</option>').join('')+'</select>'; colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> ${selHtml} ${item.term}</div>`; });
  colLeft+='</div>';
  let colRight='<div class="eval-match-col"><h4>📗 Definiciones</h4>';
  shuffledDefs.forEach((item,i)=>{ colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`; });
  colRight+='</div>';
  const ansKey=prItems.map((item,i)=>{ const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)]; return `${i+16}→${letter}`; }).join(' · ');
  matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div><div class="eval-item-feedback" id="evalFbEpr" aria-live="polite"></div>`;
  s4.appendChild(matchCard); out.appendChild(s4);
  const autoPanel=document.createElement('div'); autoPanel.id='evalAutoResult'; autoPanel.className='eval-auto-result';
  autoPanel.innerHTML=`<strong>🧮 Prueba interactiva de ${M.nombre}:</strong> escribe, marca y selecciona tus respuestas en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato para resolver en papel.`;
  out.appendChild(autoPanel);
  window._evalPrintData={tf:tfItems,mc:mcItems,cp:cpItems,pr:{terms:prItems,shuffledDefs,letters},materia:m,forma:cf};
  window._evalGradeData={cp:cpItems,tf:tfItems,mc:mcItems,pr:{terms:prItems,shuffledDefs,letters},materia:m,forma:cf};
  fin('s-evaluacion');
}
// Normaliza texto del estudiante: minúsculas, sin tildes ni signos
function _normTxt(s){ return (s||'').toString().trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9ñ/ ]/gi,'').replace(/\s+/g,' ').trim(); }
function setEvalFeedback(id, ok, msg) {
  const el = document.getElementById(id); if (!el) return;
  el.textContent = msg; el.className = 'eval-item-feedback ' + (ok ? 'eval-ok' : 'eval-no');
}
function gradeEval(){
  if(!window._evalGradeData){ showToast('⚠️ Genera una evaluación primero'); return; }
  sfx('click');
  const d=window._evalGradeData; let total=0; const det={cp:0,tf:0,mc:0,pr:0};
  d.cp.forEach((it,i)=>{ const el=document.querySelector(`[data-ecp="${i}"]`); const val=_normTxt(el?el.value:''); const lista=(it.acc&&it.acc.length?it.acc.concat([it.a]):[it.a]); const ok=val!==''&&lista.some(a=>_normTxt(a)===val); if(el){ el.classList.toggle('eval-input-ok',ok); el.classList.toggle('eval-input-no',!ok); } if(ok){ det.cp++; total+=5; } setEvalFeedback('evalFbEcp'+i,ok,ok?'Correcto. +5 pts':'Revisar. R/ '+it.a); });
  d.tf.forEach((it,i)=>{ const sel=document.querySelector(`#evalOut input[name="tf${i}"]:checked`); const ok=!!sel&&sel.value===(it.a?'V':'F'); if(ok){ det.tf++; total+=5; } setEvalFeedback('evalFbEtf'+i,ok,ok?'Correcto. +5 pts':'Revisar. R/ '+(it.a?'Verdadero':'Falso')); });
  d.mc.forEach((it,i)=>{ const sel=document.querySelector(`#evalOut input[name="mc${i}"]:checked`); const ok=!!sel&&parseInt(sel.value,10)===it.a; if(ok){ det.mc++; total+=5; } setEvalFeedback('evalFbEmc'+i,ok,ok?'Correcto. +5 pts':'Revisar. R/ '+it.o[it.a]); });
  const okLetters=d.pr.terms.map(t=>d.pr.letters[d.pr.shuffledDefs.findIndex(df=>df.def===t.def)]);
  const prPend=[];
  d.pr.terms.forEach((t,i)=>{ const el=document.querySelector(`[data-epr="${i}"]`); const ok=!!el&&el.value===okLetters[i]; if(el){ el.classList.toggle('eval-input-ok',ok); el.classList.toggle('eval-input-no',!ok); } if(ok){ det.pr++; total+=5; } else prPend.push(`${i+16}→${okLetters[i]}`); });
  setEvalFeedback('evalFbEpr',prPend.length===0,prPend.length===0?'Pareados perfectos. +25 pts':'Revisar. R/ '+prPend.join(' · '));
  const res=document.getElementById('evalAutoResult');
  const M=MATERIA_EVAL[d.materia];
  if(res){ res.className='eval-auto-result '+(total>=70?'eval-auto-pass':'eval-auto-risk'); res.innerHTML=`<strong>Resultado: ${total}/100 pts</strong><br><span>Prueba de ${M.nombre} · Forma ${d.forma} · Completar: ${det.cp*5}/25 · V/F: ${det.tf*5}/25 · Selección: ${det.mc*5}/25 · Pareados: ${det.pr*5}/25</span>`; }
  if(total>=70){ pts(8); showToast(`🎯 Prueba de ${M.nombre} calificada: ${total}/100`); }
  else showToast(`🧮 Prueba de ${M.nombre}: ${total}/100. Revisa los ítems marcados.`);
}
function toggleEvalAns(){ evalAnsVisible=!evalAnsVisible; document.querySelectorAll('#evalOut .eval-answer').forEach(el=>el.style.display=evalAnsVisible?'block':'none'); sfx('click'); }

function printEval(){
  if(!window._evalPrintData){showToast('⚠️ Genera una evaluación primero');return;}
  sfx('click');
  const d=window._evalPrintData; const forma=d.forma||1; const M=MATERIA_EVAL[d.materia];
  let s1=`<div class="sec-title"><span>I. Completar el espacio</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25 pts</span></div></div>`;
  d.cp.forEach((it,i)=>{ const q=it.q.replace('___','<span class="cp-blank"></span>'); s1+=`<div class="cp-row"><span class="qn">${i+1}.</span><span class="cp-text">${q}</span></div>`; });
  let s2=`<div class="sec-title"><span>II. Verdadero o Falso</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25 pts</span></div></div>`;
  d.tf.forEach((it,i)=>{ s2+=`<div class="tf-row"><span class="qn">${i+6}.</span><span class="tf-blank"></span><span class="tf-text">${it.q}</span></div>`; });
  let s3=`<div class="sec-title"><span>III. Selección Múltiple · Rellena el círculo de la respuesta correcta</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25 pts</span></div></div><div class="mc-grid${d.materia==='esp'?' mc-una-col':''}">`;
  d.mc.forEach((it,i)=>{ const opts=it.o.map((op,oi)=>`<label class="mc-opt"><span class="mc-circ"></span> ${op}</label>`).join(''); s3+=`<div class="mc-item"><div class="mc-q"><span class="qn">${i+11}.</span><span>${it.q.replace(/\n/g,'<br>')}</span></div><div class="mc-opts">${opts}</div></div>`; });
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
    const zgBlock = `<div class="zg-wrap"><div class="zg-title">🎯 Clave rápida estilo ZipGrade · ${M.nombre} · Forma ${forma}: respuestas correctas ya rellenadas para digitar la clave en la app</div><div class="zg-grid"><div class="zg-col">${zgCol1}</div><div class="zg-col">${zgCol2}</div></div><div class="zg-ver"><span>Test Version / Forma:</span>${zgVer}</div><div class="zg-note">1–5 (Completar): se revisan a mano → ✓ (A) equivale a respuesta correcta · 6–10: V=A, F=B · Réplica visual de referencia; para escanear alumnos usa la hoja oficial de ZipGrade.</div></div>`;

// ⚠️ Este documento NO se encoge a una página (excepción pedida a propósito
// para las pruebas de fin de grado): la prueba abarca el temario completo y
// los mini-textos de Español necesitan su espacio. La letra queda fija en
// tamaño legible, nada se parte por dentro (break-inside) y la pauta del
// docente arranca SIEMPRE en su propia página.
const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Prueba de ${M.nombre} · Repaso de Fin de Grado 6º · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:12pt;color:#111;background:#fff;padding:4mm 6mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.5rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;color:${M.acc};}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:${M.acc};margin-top:0.15rem;font-weight:700;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.5rem 0 0.25rem;border-left:4px solid ${M.acc};background:${M.bg};display:flex;justify-content:space-between;align-items:center;color:${M.acc};break-inside:avoid;page-break-inside:avoid;}.qn{font-weight:700;min-width:22px;flex-shrink:0;color:${M.acc};}.tf-row{display:flex;align-items:flex-start;gap:0.3rem;font-size:10.5pt;line-height:1.4;padding:0.25rem 0.2rem;border-bottom:1px solid #eee;break-inside:avoid;page-break-inside:avoid;}.tf-blank{display:inline-block;min-width:42px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.2rem;margin-top:0.2rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.28rem 0.45rem;margin-bottom:0.22rem;break-inside:avoid;page-break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.4;display:flex;gap:0.3rem;margin-bottom:0.18rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.22rem 0.55rem;}.mc-grid.mc-una-col{grid-template-columns:1fr;}.mc-opts{display:grid;grid-template-columns:repeat(2,1fr);gap:0.08rem 0.25rem;margin-left:1.3rem;}.mc-opt{font-size:9.5pt;display:flex;align-items:center;gap:0.22rem;}.mc-circ{display:inline-block;width:11px;height:11px;border:1.4px solid #333;border-radius:50%;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.4;padding:0.22rem 0.2rem;border-bottom:1px solid #eee;break-inside:avoid;page-break-inside:avoid;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:130px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{break-inside:avoid;page-break-inside:avoid;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.2rem 0.5rem;margin-top:0.15rem;}.pr-head{font-size:9pt;font-weight:700;color:${M.acc};margin-bottom:0.2rem;}.pr-item{font-size:10pt;padding:0.22rem 0.32rem;background:${M.bg};border-radius:3px;margin-bottom:0.12rem;display:flex;align-items:center;gap:0.22rem;line-height:1.2;}.pr-num{font-weight:700;color:${M.acc};min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid ${M.acc};padding-bottom:0.35rem;margin-bottom:0.5rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;color:${M.acc};}.p-sub{font-size:9pt;color:${M.acc};font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid ${M.borde};border-radius:4px;padding:0.35rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}.p-ttl{font-size:11pt;font-weight:700;color:${M.acc};border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:${M.acc};}.pa{color:#007a00;font-weight:700;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:${M.acc};font-weight:700;font-style:italic;}.obt-lbl{font-weight:700;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid ${M.acc};height:12px;}.obt-pct{font-weight:700;}.total-row{display:flex;align-items:baseline;justify-content:flex-end;gap:7px;font-size:11pt;color:${M.acc};font-weight:700;font-style:italic;margin-top:0.4rem;padding:0.2rem 0.5rem;background:${M.bg};border-radius:4px;break-inside:avoid;page-break-inside:avoid;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid ${M.acc};}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:8mm 10mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación de Repaso · Prueba de Fin de Grado 6º · ${M.nombre} · Educación Básica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 4 secciones × 5 preguntas × 5 pts c/u · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✔ PAUTA DOCENTE: Prueba de ${M.nombre} · Repaso de Fin de Grado 6º · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">100 pts | 4 secciones × 5 preguntas × 5 pts | ${M.nombre} · Educación Básica</div></div><div class="p-grid">${pR}</div>
  ${zgBlock}</div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">${M.nombre} · Forma ${forma}</span></div></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(doc); win.document.close(); setTimeout(()=>win.print(),400);
}

// ===================== PRUEBA OPERATIVA (CÁLCULO, MATEMÁTICAS) =====================
let _opRnd = Math.random;
function _opRint(min, max) { return Math.floor(_opRnd() * (max - min + 1)) + min; }
function _fmtNum(n) { return n.toLocaleString('en-US'); }
function _isTxtMatch(student, accepted) { const v = _normTxt(student); return !!v && accepted.some(a => _normTxt(a) === v); }
// Acepta enteros y decimales, con o sin "L.", coma o espacios: 78.40 = 78.4
function _isNumMatch(student, expected) {
  const raw = (student || '').toString().replace(/[^\d.,\-]/g, '').replace(/,/g, '');
  if (!raw) return false;
  const n = parseFloat(raw);
  return !isNaN(n) && Math.abs(n - expected) < 0.005;
}

// I. Fracciones (5 × 4 = 20 pts): sumas y restas, homogéneas y heterogéneas
const _OP_DENS=[[2,4],[3,6],[2,6],[4,8],[5,10],[2,3],[3,4],[2,5],[4,6],[3,5],[6,8],[4,10]];
function genOpFracciones(){
  const items=[];
  for(let k=0;k<5;k++){
    const par=_OP_DENS[_opRint(0,_OP_DENS.length-1)];
    const mismo=k<1; // el primero es homogéneo, como arranca la prueba real
    const d1=mismo?par[1]:par[0], d2=par[1];
    const comun=_mcmDe(d1,d2);
    let n1=_opRint(1,d1-1), n2=_opRint(1,d2-1);
    const resta=k>=3; // los dos últimos son restas
    let texto, rn;
    if(resta){
      let a=n1*(comun/d1), b=n2*(comun/d2);
      if(a===b){ n1=Math.min(d1-1,n1+1); a=n1*(comun/d1); }
      if(a<b){ const t1=[n1,d1]; const t2=[n2,d2]; texto=`${t2[0]}/${t2[1]} − ${t1[0]}/${t1[1]}`; rn=b-a; }
      else { texto=`${n1}/${d1} − ${n2}/${d2}`; rn=a-b; }
      if(rn===0){ rn=comun; texto=`${d1}/${d1} − 0/${d2}`; } // no puede pasar, pero nunca un examen con 0/0
    } else {
      texto=`${n1}/${d1} + ${n2}/${d2}`;
      rn=n1*(comun/d1)+n2*(comun/d2);
    }
    items.push({ text:`Calcula y simplifica: ${texto} =`, ansTxt:_accFrac(rn,comun), ansShow:_fmtFrac(rn,comun) });
  }
  return items;
}
// II. Decimales (5 × 4 = 20 pts): multiplicaciones y divisiones con lempiras
function genOpDecimales(){
  const items=[];
  const prods=['frijoles','arroz','azúcar','café','maíz','harina'];
  { const precio=_opRint(500,4000)/100, libras=_opRint(2,6); const total=Math.round(precio*libras*100)/100;
    items.push({ text:`La libra de ${prods[_opRint(0,prods.length-1)]} cuesta L.${precio.toFixed(2)}. ¿Cuánto cuestan ${libras} libras?`, ansNum:total, ansShow:'L.'+total.toFixed(2) }); }
  { const a=_opRint(11,99)/10, b=_opRint(11,99)/10; const r=Math.round(a*b*100)/100;
    items.push({ text:`Calcula: ${a.toFixed(1)} × ${b.toFixed(1)} =`, ansNum:r, ansShow:String(r) }); }
  { const q=_opRint(11,95)/10, dv=_opRint(2,9); const dd=Math.round(q*dv*10)/10;
    items.push({ text:`Calcula: ${dd.toFixed(1)} ÷ ${dv} =`, ansNum:q, ansShow:String(q) }); }
  { const precioLibra=_opRint(1200,3500)/100, libras=_opRint(3,8)/2; const total=Math.round(precioLibra*libras*100)/100;
    items.push({ text:`Se pagaron L.${total.toFixed(2)} por ${libras} libras de queso. ¿Cuánto cuesta cada libra?`, ansNum:precioLibra, ansShow:'L.'+precioLibra.toFixed(2) }); }
  { const n=_opRint(20,90); const f=[0.5,0.8,0.4,0.25][_opRint(0,3)]; const r=Math.round(n*f*100)/100;
    items.push({ text:`Un ciclista recorrió ${n} km y otro recorrió ${f} veces esa distancia. ¿Cuántos km recorrió el segundo?`, ansNum:r, ansShow:String(r)+' km' }); }
  return items;
}
// III. m.c.m. y M.C.D. (5 × 4 = 20 pts)
function genOpTeoria(){
  const items=[];
  const paresMcm=[[4,6],[6,8],[10,15],[12,18],[8,12],[6,9],[4,10],[5,6]];
  const paresMcd=[[12,18],[20,30],[24,36],[16,24],[36,48],[18,27],[40,60]];
  for(let k=0;k<3;k++){ const p=paresMcm[_opRint(0,paresMcm.length-1)];
    items.push({ text:`Calcula el m.c.m. de ${p[0]} y ${p[1]}.`, ansNum:_mcmDe(p[0],p[1]), ansShow:String(_mcmDe(p[0],p[1])) }); }
  for(let k=0;k<2;k++){ const p=paresMcd[_opRint(0,paresMcd.length-1)];
    items.push({ text:`Calcula el M.C.D. de ${p[0]} y ${p[1]}.`, ansNum:_mcdDe(p[0],p[1]), ansShow:String(_mcdDe(p[0],p[1])) }); }
  return items;
}
// IV. Problemas de la vida real (3 × 10 = 30 pts)
const _OP_RUTAS=[['La Ceiba','Tela'],['Choluteca','Danlí'],['Santa Rosa de Copán','Gracias'],['Juticalpa','Catacamas'],['Comayagua','Siguatepeque']];
function genOpProblemas(){
  const items=[];
  { const v=[40,45,50,60,75,80,90][_opRint(0,6)], t=_opRint(3,8); const ruta=_OP_RUTAS[_opRint(0,_OP_RUTAS.length-1)];
    items.push({ text:`Un bus va de ${ruta[0]} a ${ruta[1]}: recorre ${_fmtNum(v*t)} km a ${v} km por hora. ¿Cuántas horas tarda el viaje?`, ansNum:t, ansShow:`${t} horas: ${_fmtNum(v*t)} ÷ ${v} = ${t}` }); }
  { const precio=_opRint(800,2400)/100, cant=_opRint(2,4); const billete=[100,200,500][_opRint(0,2)];
    const gasto=Math.round(precio*cant*100)/100; const vuelto=Math.round((billete-gasto)*100)/100;
    if(vuelto<=0){ return genOpProblemas(); }
    items.push({ text:`En la pulpería, cada refresco cuesta L.${precio.toFixed(2)}. Ana compra ${cant} y paga con un billete de L.${billete}.00. ¿Cuánto recibe de vuelto?`, ansNum:vuelto, ansShow:`L.${vuelto.toFixed(2)}: gastó L.${gasto.toFixed(2)}` }); }
  { const l=_opRint(3,8), an=_opRint(2,5), al=_opRint(2,4);
    items.push({ text:`La paila de una volqueta mide ${l} m de largo, ${an} m de ancho y ${al} m de alto. ¿Cuántos m³ de arena le caben?`, ansNum:l*an*al, ansShow:`${l*an*al} m³: ${l} × ${an} × ${al}` }); }
  return items;
}
// V. Reto del promedio (1 × 10 = 10 pts): qué nota necesita en el IV parcial
function genOpMeta(){
  let n1,n2,n3,meta,falta;
  do{
    n1=_opRint(60,95); n2=_opRint(60,95); n3=_opRint(60,95); meta=_opRint(75,90);
    falta=4*meta-(n1+n2+n3);
  }while(falta<60||falta>100);
  return [{ text:`Sara lleva ${n1}%, ${n2}% y ${n3}% en los tres primeros parciales. ¿Qué nota necesita en el IV parcial para que su promedio del año sea ${meta}%?`, ansNum:falta, ansShow:`${falta}%: necesita que la suma llegue a ${4*meta} (${meta} × 4) y lleva ${n1+n2+n3}` }];
}

function genEvalOp() {
  sfx('click');
  _injectFormaSel('genEvalOp', 'evalOpFormaSel', evalOpFormNum, function (v) { evalOpFormNum = v; });
  const _sO = document.getElementById('evalOpFormaSel');
  if (_sO && parseInt(_sO.value, 10)) evalOpFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sO.value, 10)));
  const cf = evalOpFormNum; window._currentEvalOpForm = cf; _opRnd = _evalRng(100000 + cf); /* la Forma cf siembra todo el azar de la prueba operativa */ evalOpFormNum = (evalOpFormNum % EVAL_FORMAS) + 1; _injectFormaSel('genEvalOp', 'evalOpFormaSel', evalOpFormNum, function (v) { evalOpFormNum = v; }); saveProgress();
  document.getElementById('evalop-screen-title').textContent = `📐 Prueba Operativa: Forma ${cf} · Repaso de Fin de Grado`;
  evalOpAnsVisible = false;
  const out = document.getElementById('evalOpOut'); out.innerHTML = '';
  const frItems = genOpFracciones();
  const s1 = document.createElement('div');
  s1.innerHTML = '<div class="eval-section-title">I. Fracciones <span class="eval-pts">20 pts · 4 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel básico. Con denominadores distintos, busca el común denominador y SIMPLIFICA el resultado. Escribe la fracción con barra: 3/4.</p>';
  frItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.text}</span><input class="eval-cp-input" type="text" data-fr="${i}" autocomplete="off"></div><div class="eval-answer">${it.ansShow}</div><div class="eval-item-feedback" id="evalFbFr${i}" aria-live="polite"></div>`;
    s1.appendChild(d);
  });
  out.appendChild(s1);
  const deItems = genOpDecimales();
  const s2 = document.createElement('div');
  s2.innerHTML = '<div class="eval-section-title">II. Decimales <span class="eval-pts">20 pts · 4 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel básico. Multiplica sin punto y colócalo al final contando cifras decimales; comprueba las divisiones multiplicando.</p>';
  deItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.text}</span><input class="eval-cp-input" type="text" data-de="${i}" autocomplete="off" inputmode="decimal"></div><div class="eval-answer">${it.ansShow}</div><div class="eval-item-feedback" id="evalFbDe${i}" aria-live="polite"></div>`;
    s2.appendChild(d);
  });
  out.appendChild(s2);
  const teItems = genOpTeoria();
  const s3 = document.createElement('div');
  s3.innerHTML = '<div class="eval-section-title">III. m.c.m. y M.C.D. <span class="eval-pts">20 pts · 4 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel intermedio. m.c.m.: el menor múltiplo común. M.C.D.: el mayor divisor común.</p>';
  teItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.text}</span><input class="eval-cp-input" type="text" data-te="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${it.ansShow}</div><div class="eval-item-feedback" id="evalFbTe${i}" aria-live="polite"></div>`;
    s3.appendChild(d);
  });
  out.appendChild(s3);
  const prItems = genOpProblemas();
  const s4 = document.createElement('div');
  s4.innerHTML = '<div class="eval-section-title">IV. Problemas de la vida real <span class="eval-pts">30 pts · 10 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel avanzado. Resuelve en tu cuaderno con la operación que toque y escribe la respuesta numérica.</p>';
  prItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.text}</span><input class="eval-cp-input" type="text" data-pr="${i}" autocomplete="off" inputmode="decimal"></div><div class="eval-answer">${it.ansShow}</div><div class="eval-item-feedback" id="evalFbPr${i}" aria-live="polite"></div>`;
    s4.appendChild(d);
  });
  out.appendChild(s4);
  const meItems = genOpMeta();
  const s5 = document.createElement('div');
  s5.innerHTML = '<div class="eval-section-title">V. Reto del promedio <span class="eval-pts">10 pts</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel desafío. Piensa al revés: ¿cuánto debe sumar el total para lograr ese promedio?</p>';
  meItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.text}</span><input class="eval-cp-input" type="text" data-me="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${it.ansShow}</div><div class="eval-item-feedback" id="evalFbMe${i}" aria-live="polite"></div>`;
    s5.appendChild(d);
  });
  out.appendChild(s5);
  window._evalOpData = { frItems, deItems, teItems, prItems, meItems };
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
  let total = 0; const det = { fr: 0, de: 0, te: 0, pr: 0, me: 0 };
  const _mark = (sel, it, i, key, ptsEach, fbId) => {
    const el = document.querySelector(`[data-${sel}="${i}"]`);
    const ok = it.ansTxt ? _isTxtMatch(el ? el.value : '', it.ansTxt) : _isNumMatch(el ? el.value : '', it.ansNum);
    if (el) { el.classList.toggle('eval-input-ok', ok); el.classList.toggle('eval-input-no', !ok); }
    if (ok) { det[key] += ptsEach; total += ptsEach; }
    setEvalFeedback(fbId + i, ok, ok ? `Correcto. +${ptsEach} pts` : 'Revisar. R/ ' + it.ansShow);
  };
  d.frItems.forEach((it, i) => _mark('fr', it, i, 'fr', 4, 'evalFbFr'));
  d.deItems.forEach((it, i) => _mark('de', it, i, 'de', 4, 'evalFbDe'));
  d.teItems.forEach((it, i) => _mark('te', it, i, 'te', 4, 'evalFbTe'));
  d.prItems.forEach((it, i) => _mark('pr', it, i, 'pr', 10, 'evalFbPr'));
  d.meItems.forEach((it, i) => _mark('me', it, i, 'me', 10, 'evalFbMe'));
  const res = document.getElementById('evalOpAutoResult');
  if (res) { res.className = 'eval-auto-result ' + (total >= 70 ? 'eval-auto-pass' : 'eval-auto-risk'); res.innerHTML = `<strong>Resultado: ${total}/100 pts</strong><br><span>Fracciones: ${det.fr}/20 · Decimales: ${det.de}/20 · m.c.m. y M.C.D.: ${det.te}/20 · Problemas: ${det.pr}/30 · Promedio: ${det.me}/10</span>`; }
  if (total >= 70) { pts(8); showToast('🎯 Prueba operativa calificada: ' + total + '/100'); }
  else showToast('🧮 Prueba operativa: ' + total + '/100. Revisa los ítems marcados.');
}

function printEvalOp() {
  if (!window._evalOpData) { showToast('⚠️ Genera una prueba operativa primero'); return; }
  sfx('click');
  const forma = window._currentEvalOpForm || 1; const d = window._evalOpData;
  const filaTabla = (items) => `<table class="rnd-tbl"><tr><th>#</th><th>Ejercicio</th><th>Respuesta</th></tr>${items.map((it, i) => `<tr><td>${i+1}</td><td>${it.text}</td><td></td></tr>`).join('')}</table>`;
  let s1 = `<div class="sec-title"><span>I. Fracciones</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Común denominador con el m.c.m. y resultado SIMPLIFICADO. 4 pts c/u.</p>${filaTabla(d.frItems)}`;
  let s2 = `<div class="sec-title"><span>II. Decimales</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">El punto decimal se coloca contando las cifras decimales. 4 pts c/u.</p>${filaTabla(d.deItems)}`;
  let s3 = `<div class="sec-title"><span>III. m.c.m. y M.C.D.</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">m.c.m.: menor múltiplo común · M.C.D.: mayor divisor común. 4 pts c/u.</p>${filaTabla(d.teItems)}`;
  let s4 = `<div class="sec-title"><span>IV. Problemas de la vida real</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 30 pts</span></div></div><p class="opx-instr">Resuelve mostrando tu procedimiento y escribe la respuesta. 10 pts c/u.</p>`;
  d.prItems.forEach((it, i) => { s4 += `<div class="opx-print-row"><span class="qn">${i+1}.</span><span class="prb-text">${it.text}</span><span class="opx-blank"></span></div><div class="opx-space"></div>`; });
  let s5 = `<div class="sec-title"><span>V. Reto del promedio</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10 pts</span></div></div>`;
  d.meItems.forEach((it, i) => { s5 += `<div class="opx-print-row"><span class="qn">${i+1}.</span><span class="prb-text">${it.text}</span><span class="opx-blank"></span></div><div class="opx-space"></div>`; });
  let pR = '';
  pR += `<div class="p-sec"><div class="p-ttl">I. Fracciones</div><table class="p-tbl">${d.frItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${it.ansShow}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">II. Decimales</div><table class="p-tbl">${d.deItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${it.ansShow}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">III. m.c.m. y M.C.D.</div><table class="p-tbl">${d.teItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${it.ansShow}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">IV. Problemas</div><table class="p-tbl">${d.prItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${it.ansShow}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec" style="grid-column:1/-1;"><div class="p-ttl">V. Reto del promedio</div><table class="p-tbl">${d.meItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${it.ansShow}</td></tr>`).join('')}</table></div>`;
  const doc = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Prueba Operativa · Repaso de Fin de Grado 6º · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11.5pt;color:#111;background:#fff;padding:4mm 6mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.5rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;color:#1565c0;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:#1565c0;margin-top:0.15rem;font-weight:700;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.45rem 0 0.2rem;border-left:4px solid #1565c0;background:#e3f2fd;display:flex;justify-content:space-between;align-items:center;color:#1565c0;break-inside:avoid;page-break-inside:avoid;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:#1565c0;font-weight:700;font-style:italic;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #1565c0;height:12px;}.qn{font-weight:700;min-width:20px;display:inline-block;color:#1565c0;flex-shrink:0;}.opx-instr{font-size:9pt;color:#555;margin-bottom:0.22rem;}.opx-blank{display:inline-block;width:80px;flex:none;border-bottom:1.5px solid #111;min-height:13px;margin-left:0.3rem;}.opx-print-row{display:flex;align-items:baseline;gap:0.4rem;font-size:10pt;padding:0.24rem 0.1rem;border-bottom:1px dotted #ddd;break-inside:avoid;page-break-inside:avoid;}.opx-space{height:26px;border-bottom:1px dotted #ccc;margin:0 0 2px 20px;}.prb-text{flex:1;line-height:1.35;}.rnd-tbl{width:100%;border-collapse:collapse;font-size:9.5pt;margin-top:0.15rem;}.rnd-tbl th,.rnd-tbl td{border:1px solid #bbb;padding:0.16rem 0.35rem;text-align:left;}.rnd-tbl th{background:#e3f2fd;color:#1565c0;font-size:8.5pt;}.rnd-tbl tr{break-inside:avoid;page-break-inside:avoid;}.total-row{display:flex;align-items:baseline;justify-content:flex-end;gap:7px;font-size:11pt;color:#1565c0;font-weight:700;font-style:italic;margin-top:0.45rem;padding:0.2rem 0.5rem;background:#e3f2fd;border-radius:4px;}.total-row .obt-line{min-width:80px;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #1565c0;padding-bottom:0.3rem;margin-bottom:0.5rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;color:#1565c0;}.p-sub{font-size:9pt;color:#1565c0;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #cce0ff;border-radius:4px;padding:0.35rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}.p-ttl{font-size:11pt;font-weight:700;color:#1565c0;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#1565c0;}.pa{color:#007a00;font-weight:700;font-family:'Courier New',monospace;}.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:8mm 10mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Examen de Matemáticas: Prueba Operativa · Repaso de Fin de Grado 6º · Educación Básica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 pts · I: 20 · II: 20 · III: 20 · IV: 30 · V: 10 · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✔ PAUTA: Prueba Operativa · Repaso de Fin de Grado 6º · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">100 pts · Matemáticas · Educación Básica</div></div><div class="p-grid">${pR}</div></div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div></body></html>`;
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
  const msgs=['💡 ¡ÁNIMO! Comienza tu repaso. ¡Cada paso cuenta!','🌱 ¡GRAN INICIO! Estás dando los primeros pasos.','🔑 ¡BUEN TRABAJO! Vas progresando muy bien.','💪 ¡MUY BIEN! Dominas gran parte del temario.','🏅 ¡INCREÍBLE avance! Estás cerca de la excelencia.','🎓 ¡EXTRAORDINARIO! Completaste TODO el repaso. ¡Llegas listo a tu Prueba de Fin de Grado!'];
  const mi=pct===100?5:pct>=80?4:pct>=60?3:pct>=40?2:pct>=20?1:0;
  document.getElementById('diplMsg').textContent=msgs[mi];
  document.getElementById('diplDate').textContent='Honduras, '+new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});
  const achStr=unlockedAch.length>0?'🏆 Logros: '+unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(', '):'Sin logros aún, ¡sigue completando secciones!';
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
  const txt=`${stars} CONSTANCIA DE LOGRO ${stars}\n\n📚 Misión: Prueba de Fin de Grado 6º\n👤 Estudiante: ${name}\n📊 Progreso: ${pct}% completado\n⭐ XP obtenido: ${xp} de ${MXP}${achText?'\n\n🏆 Logros desbloqueados:\n'+achText:''}\n\n${msg}\n\n📅 ${date}\n🏠 Proyecto Educativo M.E.T.A.S\n🌐 policastsapien.com`;
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
  buildTextoLargo();
  lab1Render(); lab2Render();
  promNueva(); detRender(); radarRender();
  _retoPairLbl();
  document.addEventListener('click',function(e){ const panel=document.getElementById('achPanel'); const btn=document.getElementById('achBtn'); if(panel.classList.contains('open')&&!panel.contains(e.target)&&e.target!==btn) panel.classList.remove('open'); });
  document.addEventListener('click',function(e){ if(e.target===document.getElementById('diplomaOverlay')) closeDiploma(); });
  const savedName=localStorage.getItem('nombreEstudianteFinDeGrado6');
  const inputName=document.querySelector('.diploma-input');
  if(savedName&&inputName){ inputName.value=savedName; updateDiplomaName(savedName); }
  if(inputName) inputName.addEventListener('input',e=>localStorage.setItem('nombreEstudianteFinDeGrado6',e.target.value));
  fin('s-aprende',false);
  fin('s-tipos',false);
  fin('s-errores',false);
});

// Formas deterministas v1: selectores de forma visibles desde la carga de la página
(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalOp==='function') _injectFormaSel('genEvalOp','evalOpFormaSel',evalOpFormNum,function(v){evalOpFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();
