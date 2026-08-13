// Misión Prueba de Fin de Grado: 4º Grado · Repaso General (Español y Matemáticas)
// Segunda misión de la Ruta de la Meta: repasa el temario completo de la
// Prueba de Fin de Grado de 4º (las cuatro operaciones, decimales, fracciones
// en una figura, geometría, conversiones y gráficos + comprensión lectora,
// vocabulario por contexto, tipos de texto y escritura).
// Calcada de la de 6º, que es la base de la serie.

// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
function compartirMision() {
    const url = window.location.href;
    const texto = `🎓 *Misión Asignada: Prueba de Fin de Grado 4º* 🎓\n\nRepasa Español y Matemáticas de TODO el año: sumar, restar, multiplicar, dividir, decimales, geometría, gráficos, lectura y escritura. 🏆\n\nDesbloquea *todos los logros* y puedes poner *tus datos* para que tu maestro observe todos tus logros. 📋\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;
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
  if(el) { el.innerHTML = Fr(msg); el.className = 'fb show ' + (isOk ? 'ok' : 'err'); }
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
const SAVE_KEY = 'repaso_fin_grado_4to_v1';
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
  {w:'Ángulo recto',a:'📐 mide exactamente <strong>90 grados</strong>. es la esquina de una hoja o del pizarrón. si mide <strong>menos</strong> es agudo, si mide <strong>más</strong> es obtuso y si mide 180 es llano.'},
  {w:'Tema del texto',a:'🎯 es <strong>de qué trata todo el texto</strong>, no un pedacito. pregúntate: ¿de qué habla del principio al final?'},
  {w:'Triángulo isósceles',a:'📏 tiene <strong>dos lados iguales</strong> y uno distinto. si los tres son iguales es equilátero; si los tres son distintos, escaleno.'},
  {w:'Texto instructivo',a:'🧾 enseña a <strong>hacer algo</strong>: primero la lista de <strong>materiales</strong> y después los <strong>pasos en orden</strong>, como una receta de tamales.'},
  {w:'Perímetro',a:'🚧 es lo que mide el <strong>contorno</strong>: se suman todos los lados. un solar de 20 m, 20 m, 15 m y 15 m tiene <strong>70 m</strong> de perímetro.'},
  {w:'Palabra por el contexto',a:'🔍 cuando no conoces una palabra, no te detengas: lee <strong>el resto de la oración</strong> y mira qué significado le queda bien.'},
  {w:'Fracción',a:'🍕 el <strong>denominador</strong> va abajo y dice en cuántos pedazos iguales se partió el entero; el <strong>numerador</strong> va arriba y dice cuántos se tomaron. 3 de 8 pedazos son 3/8.'},
  {w:'Comprensión literal',a:'📖 es lo que el texto dice <strong>con todas sus letras</strong>: la respuesta está a la vista, solo hay que volver a leer.'},
  {w:'Reagrupar (llevar)',a:'➕ cuando la suma de una columna pasa de 9, se escribe la unidad y <strong>se lleva</strong> la decena a la columna de al lado. en la resta se hace al revés: se <strong>presta</strong>.'},
  {w:'Inferencia',a:'🕵️ es lo que el texto <strong>deja entender sin decirlo</strong>. se descubre juntando las <strong>pistas</strong> que sí da.'},
  {w:'Prisma rectangular',a:'📦 la caja: tiene <strong>6 caras</strong>, <strong>12 aristas</strong> (las líneas donde se juntan dos caras) y <strong>8 vértices</strong> (las esquinas).'},
  {w:'Anécdota',a:'😄 es un <strong>caso corto y real</strong> que le pasó a alguien. lleva <strong>título, inicio, desarrollo y final</strong>.'},
  {w:'1 metro',a:'📏 tiene <strong>100 centímetros</strong>. entonces 3 metros son 300 centímetros: se multiplica por 100.'},
  {w:'Texto informativo',a:'📰 da <strong>datos reales</strong> para que aprendas algo, sin contar una historia y sin opinar.'}
];

// ===================== JUEGO: MEMORIA DEL REPASO =====================
let fcIdx=0;
function upFC(){ document.getElementById('fcInner').classList.remove('flipped'); document.getElementById('fcW').textContent=fcData[fcIdx].w; document.getElementById('fcA').innerHTML=Fr(fcData[fcIdx].a); document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length; }
function flipCard(){ sfx('flip'); document.getElementById('fcInner').classList.toggle('flipped'); if(!xpTracker.fc.has(fcIdx)){ xpTracker.fc.add(fcIdx); pts(1); } if(xpTracker.fc.size===fcData.length){ fin('s-flash'); unlockAchievement('flash_master'); } }
function nextFC(){ sfx('click'); fcIdx=(fcIdx+1)%fcData.length; upFC(); }
function prevFC(){ sfx('click'); fcIdx=(fcIdx-1+fcData.length)%fcData.length; upFC(); }

// ===================== JUEGO: MEMORIA DEL REPASO =====================
const memoPairs=[
  {id:'recto',t:'Ángulo recto',d:'📐 mide 90 grados, como la esquina del pizarrón'},
  {id:'tema',t:'Tema del texto',d:'🎯 de qué trata todo el texto, no un detalle'},
  {id:'perimetro',t:'Perímetro',d:'🚧 se suman todos los lados del contorno'},
  {id:'instructivo',t:'Texto instructivo',d:'🧾 materiales primero y pasos en orden'},
  {id:'metro',t:'1 metro',d:'📏 son 100 centímetros'},
  {id:'anecdota',t:'Anécdota',d:'😄 un caso real y corto: inicio, desarrollo y final'}
];

// ===================== QUIZ DATA =====================
// 9 preguntas conceptuales: 5 de Matemáticas y 4 de Español
let memoDeck=[],memoOpen=[],memoLock=false,memoMoves=0,memoFound=0;
function buildMemo(){
  const grid=document.getElementById('memoGrid'); if(!grid) return;
  memoDeck=_shuffle(memoPairs.flatMap(p=>[{id:p.id,txt:p.t,kind:'t'},{id:p.id,txt:p.d,kind:'d'}]));
  memoOpen=[]; memoLock=false; memoMoves=0; memoFound=0;
  grid.innerHTML='';
  memoDeck.forEach((c,i)=>{
    const b=document.createElement('button');
    b.className='memo-card'; b.setAttribute('aria-label','Carta de memoria '+(i+1));
    b.innerHTML=`<span class="memo-face memo-front">❓</span><span class="memo-face memo-back${c.kind==='t'?' memo-term':''}">${Fr(c.txt)}</span>`;
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
  {q:'¿Cómo se escribe con números la cantidad noventa mil?',o:['a) 900','b) 9,000','c) 90,000','d) 900,000'],c:2,feedback:'Noventa mil se escribe 90,000. El 9 está en el lugar de las decenas de millar; 9,000 se lee nueve mil y 900,000 se lee novecientos mil.'},
  {q:'Doña Rosa quedó satisfecha con la cosecha de frijoles. ¿Qué significa satisfecha en esa oración?',o:['a) complacida, contenta con lo que recogió','b) cansada de tanto trabajar','c) enojada con los vecinos','d) apurada por llegar al mercado'],c:0,feedback:'La palabra se descubre por el contexto: quedó satisfecha CON LA COSECHA, o sea complacida con lo que recogió.'},
  {q:'Un ángulo mide 120 grados. ¿Cómo se llama?',o:['a) agudo','b) recto','c) llano','d) obtuso'],c:3,feedback:'El obtuso mide más de 90 grados y menos de 180. El agudo mide menos de 90, el recto exactamente 90 y el llano 180.'},
  {q:'En la pulpería hay un papel que dice: «Se vende leña seca, buen precio. Pregunte por don Chico.» ¿Qué tipo de texto es y por qué?',o:['a) Un cuento, porque narra una historia','b) Un instructivo, porque enseña a hacer algo paso a paso','c) Una carta, porque lleva saludo y despedida','d) Un anuncio, porque ofrece algo y dice a quién buscar'],c:3,feedback:'El anuncio ofrece o avisa algo en pocas palabras y dice cómo comunicarse. No cuenta una historia ni da pasos.'},
  {q:'Marta partió una tortilla en 8 pedazos iguales y se comió 3. ¿Qué fracción de la tortilla se comió?',o:['a) 8/3','b) 3/8','c) 3/5','d) 1/3'],c:1,feedback:'Abajo va en cuántos pedazos se partió el entero (8) y arriba cuántos se tomaron (3): 3/8.'},
  {q:'Un texto cuenta cuándo se siembra el maíz, cómo se limpia la milpa y cuándo se cosecha. ¿Cuál es el tema del texto?',o:['a) La limpieza de la milpa','b) El cultivo del maíz','c) El precio del maíz en la feria','d) La cosecha de septiembre'],c:1,feedback:'El tema abarca el texto entero. Limpiar la milpa y cosechar son partes del cultivo del maíz; el precio ni siquiera aparece.'},
  {q:'La escuela recibió 5,376 libros y los reparte en partes iguales entre 8 aulas. ¿Cuántos libros le tocan a cada aula?',o:['a) 62','b) 607','c) 672','d) 680'],c:2,feedback:'5,376 entre 8 da 672. Se comprueba multiplicando: 672 × 8 = 5,376.'},
  {q:'Lees: «Josué entró al aula con el pantalón mojado y el paraguas todavía goteando.» ¿Qué se puede deducir?',o:['a) Que Josué llegó tarde a la escuela','b) Que Josué se fue a nadar al río','c) Que estaba lloviendo cuando Josué venía','d) Que a Josué se le perdió el cuaderno'],c:2,feedback:'El texto no dice «llovía», pero lo deja entender con dos pistas: el pantalón mojado y el paraguas goteando. Eso es inferir.'},
  {q:'La clase de Español empieza a las 10:40 de la mañana y dura 45 minutos. ¿A qué hora termina?',o:['a) 11:25 de la mañana','b) 10:85 de la mañana','c) 11:05 de la mañana','d) 12:25 de la tarde'],c:0,feedback:'De las 10:40 faltan 20 minutos para las 11:00 y quedan 25 minutos más: 11:25 de la mañana. Una hora nunca llega a 85 minutos.'}
];

// ===================== EL CUENTO DEL REPASO (texto largo con 4 preguntas) =====================
// Como en la prueba real: un texto extenso y varias preguntas sobre él.
let qzIdx=0, qzSel=-1, qzDone=false;
function buildQz(){ qzIdx=0; qzSel=-1; qzDone=false; showQz(); }
function showQz(){
  if(qzIdx>=qzData.length){ document.getElementById('qzQ').textContent='🎉 ¡Quiz completado!'; document.getElementById('qzOpts').innerHTML=''; fin('s-quiz'); unlockAchievement('primer_quiz'); return; }
  const q=qzData[qzIdx];
  document.getElementById('qzProg').textContent=`Pregunta ${qzIdx+1} de ${qzData.length}`;
  document.getElementById('qzQ').innerHTML=Fr(q.q);
  const opts=document.getElementById('qzOpts'); opts.innerHTML='';
  q.o.forEach((o,i)=>{ const b=document.createElement('button'); b.className='qz-opt'; b.innerHTML=Fr(o); b.onclick=()=>{ if(qzDone)return; document.querySelectorAll('.qz-opt').forEach(x=>x.classList.remove('sel')); b.classList.add('sel'); qzSel=i; sfx('click'); }; opts.appendChild(b); });
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
  titulo:'El vivero de la escuela',
  texto:'En una escuela de Intibucá, la maestra Rosa notó que la montaña de enfrente se veía cada año más pelona. Los pinos se cortaban para leña y nadie sembraba otros en su lugar.\n\nUn lunes llegó al aula con un saco de tierra negra y un puñado de semillas de pino. Entre todos llenaron ciento veinte bolsas y las pusieron bajo la sombra del corredor. Cada mañana, antes de entrar a clases, dos alumnos regaban el vivero.\n\nPasaron cinco meses. Las semillas se volvieron arbolitos del tamaño de un lápiz. Un sábado, las familias subieron a la montaña con azadones y sembraron los ciento veinte pinos junto a la quebrada.\n\nHoy esos pinos ya dan sombra. Cuando llueve fuerte, la tierra se queda en su sitio y el agua de la quebrada baja limpia. La maestra Rosa dice que la montaña se está curando sola, pero los niños saben quién le ayudó.',
  preguntas:[
    {q:'Según el texto, ¿cuántas bolsas llenaron los alumnos en el aula?',o:['a) Cincuenta.','b) Ciento veinte.','c) Doscientas.','d) Quince.'],a:1,exp:'El texto lo dice con todas sus letras: «Entre todos llenaron ciento veinte bolsas». Esa misma cantidad de pinos se sembró después.'},
    {q:'«La montaña de enfrente se veía cada año más pelona». ¿Qué significa pelona en el texto?',o:['a) Muy verde.','b) Muy alta y con neblina.','c) Sin árboles.','d) Llena de casas.'],a:2,exp:'La oración siguiente da la pista: los pinos se cortaban y nadie sembraba otros. Una montaña pelona es una montaña que se quedó sin árboles.'},
    {q:'¿Por qué ahora el agua de la quebrada baja limpia?',o:['a) Porque los pinos sostienen la tierra cuando llueve fuerte.','b) Porque los niños lavan la quebrada cada sábado.','c) Porque en esa montaña ya no llueve.','d) Porque la maestra Rosa le puso un filtro.'],a:0,exp:'El texto no lo explica con esas palabras, pero junta las pistas: sembraron pinos, y desde entonces la tierra se queda en su sitio en vez de irse con el agua.'},
    {q:'¿De qué trata principalmente el texto?',o:['a) De un sábado de paseo a la montaña.','b) De las semillas que vende la maestra Rosa.','c) De cómo se riegan las plantas del corredor.','d) De una escuela que sembró pinos y ayudó a su montaña.'],a:3,exp:'Todo el texto va de eso: la montaña pelona, el vivero, la siembra y lo que pasó después. El paseo del sábado y el riego son partes de esa historia, no el tema.'}
  ]
};

// ===================== CLASIFICACIÓN (seleccionar y colocar, sin arrastre) =====================
// 4 grupos: 2 de Matemáticas y 2 de Español
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
    label:['Agudos','Obtusos'], headA:'🔻 AGUDO: mide menos de 90°', headB:'🔺 OBTUSO: mide más de 90° y menos de 180°', colA:'agudo', colB:'obtuso',
    words:[{w:'30°',t:'agudo'},{w:'100°',t:'obtuso'},{w:'45°',t:'agudo'},{w:'120°',t:'obtuso'},{w:'89°',t:'agudo'},{w:'135°',t:'obtuso'},{w:'15°',t:'agudo'},{w:'170°',t:'obtuso'}]
  },
  {
    label:['Relata','Informa'], headA:'📚 El texto RELATA: cuenta algo que pasó', headB:'📰 El texto INFORMA: da datos reales', colA:'relata', colB:'informa',
    words:[{w:'Aquella tarde, Lucía perdió el bus a La Ceiba',t:'relata'},{w:'La guacamaya roja es el ave nacional de Honduras',t:'informa'},{w:'De pronto, el ternero se soltó y cruzó la milpa',t:'relata'},{w:'Tegucigalpa es la capital de Honduras',t:'informa'},{w:'Mi abuela contó cómo cruzó el río a caballo',t:'relata'},{w:'El Patuca es uno de los ríos más largos del país',t:'informa'},{w:'Esa mañana amaneció lloviendo y nadie llegó temprano',t:'relata'},{w:'Las ruinas de Copán están en el occidente de Honduras',t:'informa'}]
  },
  {
    label:['Sumando','Restando'], headA:'➕ Se resuelve SUMANDO', headB:'➖ Se resuelve RESTANDO', colA:'suma', colB:'resta',
    words:[{w:'Cosechó 340 mazorcas y luego 215: ¿cuántas en total?',t:'suma'},{w:'Tenía 250 lempiras y gastó 80: ¿cuánto le queda?',t:'resta'},{w:'Van 42 pasajeros y suben 13: ¿cuántos van ahora?',t:'suma'},{w:'De 500 tortillas se vendieron 375: ¿cuántas quedan?',t:'resta'},{w:'Junté 1,250 lempiras y me dieron 600: ¿cuánto tengo?',t:'suma'},{w:'El tanque tenía 90 litros y se sacaron 35: ¿cuánto queda?',t:'resta'},{w:'Hay 128 libros y llegan 76: ¿cuántos hay ahora?',t:'suma'},{w:'La finca tiene 300 matas y se secaron 45: ¿cuántas viven?',t:'resta'}]
  },
  {
    label:['Instructivo','Anuncio'], headA:'🧾 INSTRUCTIVO: enseña a hacer algo', headB:'📣 ANUNCIO: ofrece o avisa algo', colA:'instructivo', colB:'anuncio',
    words:[{w:'Primero lave los frijoles y quíteles las piedras',t:'instructivo'},{w:'Se vende leña seca, buen precio',t:'anuncio'},{w:'Corte el papel siguiendo la línea marcada',t:'instructivo'},{w:'Se busca perro perdido, atiende por Canela',t:'anuncio'},{w:'Ponga la olla al fuego por veinte minutos',t:'instructivo'},{w:'Gran feria del maíz este domingo en el parque',t:'anuncio'},{w:'Necesita: una hoja, tijeras y pegamento',t:'instructivo'},{w:'Clases de guitarra por las tardes, pregunte adentro',t:'anuncio'}]
  }
];

// ===================== IDENTIFICAR =====================
// 8 tandas: 4 de Matemáticas (número, ángulo, figura, cuerpo) y 4 de Español
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
    const el=document.createElement('div'); el.className='wb-item'; el.innerHTML=Fr(text); el.dataset.txt=text; el.dataset.t=type;
    el.setAttribute('role','button'); el.setAttribute('tabindex','0');
    el.onclick=(ev)=>{ ev.stopPropagation(); sfx('click');
      if(clsSelected===el){ el.classList.remove('wb-sel'); clsSelected=null; }
      else{ document.querySelectorAll('#clsBank .wb-item').forEach(x=>x.classList.remove('wb-sel')); clsSelected=el; el.classList.add('wb-sel'); }
      _clsUpdateReady(); };
    return el;
  }
  function _mkDropItem(text,type){
    const el=document.createElement('div'); el.className='drop-item'; el.innerHTML=Fr(text); el.dataset.txt=text; el.dataset.t=type;
    el.onclick=(ev)=>{
      ev.stopPropagation();
      if(clsSelected){ // hay un elemento del banco seleccionado: se inserta en esta caja, sin sacar el tocado
        const listEl=el.parentElement;
        const selText=clsSelected.dataset.txt, selType=clsSelected.dataset.t;
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
      const text=clsSelected.dataset.txt, type=clsSelected.dataset.t;
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
  {s:['La','escuela','recogió','4,052','lempiras','la','feria','4,520','y','la','rifa','4,205'],c:7,art:'La cantidad mayor'},
  {s:['El','abuelo','trasladó','el','maíz','en','la','carreta'],c:2,art:'La palabra que significa llevar de un lugar a otro'},
  {s:['La','rampa','mide','15°','la','escalera','95°','y','el','techo','60°'],c:6,art:'El ángulo obtuso'},
  {s:['Los','frijoles','estaban','sabrosa','esa','noche'],c:3,art:'La palabra que rompe la concordancia'},
  {s:['En','el','mosaico','del','patio','hay','un','cuadrado','un','rombo','y','un','trapecio'],c:12,art:'El cuadrilátero que tiene un solo par de lados paralelos'},
  {s:['Marta','eligió','la','sandía','más','grande','del','puesto'],c:1,art:'La palabra que significa seleccionar'},
  {s:['La','caja','de','jabón','tiene','caras','aristas','y','vértices'],c:6,art:'La parte del prisma que es la línea donde se juntan dos caras'},
  {s:['No','salimos','al','patio','porque','estaba','lloviendo'],c:4,art:'La palabra que explica la causa'}
];

// ===================== COMPLETA =====================
// 8 oraciones: 4 de Matemáticas y 4 de Español
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
  {s:'El ángulo que mide exactamente 90 grados se llama ___.',opts:['recto','agudo','llano'],c:0},
  {s:'Los alumnos de cuarto grado llegaron ___ al desfile de la escuela.',opts:['emocionada','emocionado','emocionados'],c:2},
  {s:'El triángulo que tiene sus tres lados iguales se llama ___.',opts:['escaleno','equilátero','isósceles'],c:1},
  {s:'No fuimos al río ___ la corriente venía muy crecida.',opts:['porque','además','sin embargo'],c:0},
  {s:'Un metro tiene ___ centímetros.',opts:['diez','mil','cien'],c:2},
  {s:'Cuando no conoces una palabra, su significado se descubre por ___.',opts:['el dibujo de la portada','el resto de la oración','la letra con que empieza'],c:1},
  {s:'Para hallar el perímetro de un solar hay que ___ la medida de todos sus lados.',opts:['multiplicar','dividir','sumar'],c:2},
  {s:'La receta para hacer tamales es un texto ___.',opts:['instructivo','narrativo','informativo'],c:0}
];
let cmpIdx=0, cmpSel=-1, cmpDone=false;
function showCmp(){
  if(cmpIdx>=cmpData.length){ document.getElementById('cmpSent').innerHTML='🎉 ¡Completado!'; document.getElementById('cmpOpts').innerHTML=''; fin('s-completa'); return; }
  const d=cmpData[cmpIdx];
  document.getElementById('cmpProg').textContent=`Oración ${cmpIdx+1} de ${cmpData.length}`;
  document.getElementById('cmpSent').innerHTML=Fr(d.s.replace('___','<span class="blank">___</span>'));
  const opts=document.getElementById('cmpOpts'); opts.innerHTML=''; cmpSel=-1; cmpDone=false;
  d.opts.forEach((o,i)=>{ const b=document.createElement('button'); b.className='cmp-opt'; b.innerHTML=Fr(o); b.onclick=()=>{ if(cmpDone)return; document.querySelectorAll('.cmp-opt').forEach(x=>x.classList.remove('sel')); b.classList.add('sel'); cmpSel=i; sfx('click'); }; opts.appendChild(b); });
}
function checkCmp(){
  if(cmpSel<0) return fb('fbCmp','Selecciona una opción.',false);
  cmpDone=true;
  const opts=document.querySelectorAll('.cmp-opt');
  if(cmpSel===cmpData[cmpIdx].c){ opts[cmpSel].classList.add('correct'); document.getElementById('cmpSent').innerHTML=Fr(cmpData[cmpIdx].s.replace('___',`<span class="blank" style="color:var(--jade);border-color:var(--jade)">${cmpData[cmpIdx].opts[cmpSel]}</span>`)); fb('fbCmp','¡Correcto! +5 XP',true); if(!xpTracker.cmp.has(cmpIdx)){ xpTracker.cmp.add(cmpIdx); pts(5); } sfx('ok'); }
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
  if (fbEl) { fbEl.innerHTML = (isOk ? '✔ ' : '💡 ') + Fr(msg); fbEl.className = 'mq-fb show ' + (isOk ? 'ok' : 'err'); }
  if (isOk) sfx('ok'); else sfx('no');
}

// ===================== PREDICE ANTES DE RESOLVER =====================
const prediceData = [
  {
    q: 'Antes de dibujarla: una tortilla se parte en 8 pedazos iguales y Marta se come 4. ¿Qué fracción de la tortilla se comió?',
    opts: ['4/8, que es la mitad', '8/4', '4/12'],
    correct: 0,
    feedback: '¡Correcto! Arriba van los pedazos que se comió (4) y abajo en cuántos pedazos se partió la tortilla (8). Por eso 4/8 es la mitad.',
    wrongFeedback: 'La respuesta es 4/8. Arriba van los pedazos comidos y abajo en cuántos se partió la tortilla: 8/4 pone los números al revés y en 4/12 la tortilla no se partió en 12.'
  },
  {
    q: '«El río Chamelecón pasa cerca de la escuela. En invierno crece y los niños cruzan por el puente viejo. Los papás lo cuidan porque de ese río sale el agua para el maíz.» ¿De qué trata el texto?',
    opts: ['Del puente viejo', 'De los niños que cruzan', 'De lo importante que es el río para la aldea'],
    correct: 2,
    feedback: '¡Muy bien! El puente y los niños salen en una sola línea: son detalles. Todo el texto habla del río y de lo que la aldea saca de él.',
    wrongFeedback: 'La respuesta es el río y lo que significa para la aldea. El puente y los niños aparecen en una sola línea cada uno: son detalles, no el tema.'
  },
  {
    q: 'Sin medir con la cinta: la cancha de la escuela mide 30 metros de largo y 15 metros de ancho. ¿Cuánto camina Karla si le da una vuelta completa por la orilla?',
    opts: ['45 metros', '90 metros', '450 metros'],
    correct: 1,
    feedback: '¡Excelente! Una vuelta completa es el perímetro y suma los CUATRO lados: 30 + 15 + 30 + 15 = 90 metros.',
    wrongFeedback: 'La respuesta es 90 metros. El perímetro suma los cuatro lados: 30 + 15 + 30 + 15. Los 45 son solo dos lados y los 450 salen de multiplicar, que eso ya es el área.'
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
      <div class="predice-q">${Fr(item.q)}</div>
      ${item.explore ? `<button class="pd-explore-btn" onclick="togglePredExplore(${i})" id="pd-btn-${i}">🔍 Explorar la pista</button>
      <div class="pd-explore" id="pd-explore-${i}" style="display:none;"></div>` : ''}
      <div class="predice-opts" id="predice-opts-${i}">
        ${item.opts.map((o, j) => `<button class="predice-btn" onclick="answerPredice(${i},${j})" id="pb-${i}-${j}">${Fr(o)}</button>`).join('')}
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
    fbEl.innerHTML = '✔ ' + Fr(item.feedback);
    fbEl.className = 'predice-fb show ok';
    if (!xpTracker.predice.has(qi)) { xpTracker.predice.add(qi); pts(3); }
    sfx('ok');
  } else {
    opts[ai].classList.add('predice-no');
    opts[item.correct].classList.add('predice-ok');
    fbEl.innerHTML = '💡 ' + Fr(item.wrongFeedback);
    fbEl.className = 'predice-fb show err';
    sfx('no');
  }
  prediceAnswered.add(qi);
  if (prediceAnswered.size === prediceData.length) { fin('s-predice'); sfx('fan'); showToast('🔮 ¡Predicciones completadas! Ahora a repasar.'); }
}

// ===================== RETO FINAL (dos grupos, con parejas variables) =====================
// El alumno decide a qué grupo pertenece cada elemento antes de que acabe el reloj.
const retoPairs = [
  {
    name: '¿Ángulo agudo u obtuso? 📐', hint: 'El ángulo recto mide 90°: el agudo es más chico y el obtuso es más grande', btnA: '📏 AGUDO (menos de 90°)', btnB: '📐 OBTUSO (más de 90°)',
    pool: [
      { w: '45°', t: 'A' }, { w: '120°', t: 'B' }, { w: '30°', t: 'A' }, { w: '100°', t: 'B' }, { w: '75°', t: 'A' }, { w: '135°', t: 'B' },
      { w: '15°', t: 'A' }, { w: '160°', t: 'B' }, { w: '89°', t: 'A' }, { w: '91°', t: 'B' }, { w: '60°', t: 'A' }, { w: '145°', t: 'B' }
    ]
  },
  {
    name: '¿Mayor o menor que 10,000? 🔢', hint: 'Cuenta las cifras: 10,000 tiene cinco cifras, así que con cuatro cifras o menos ya es menor', btnA: '🔼 MAYOR que 10,000', btnB: '🔽 MENOR que 10,000',
    pool: [
      { w: '12,500', t: 'A' }, { w: '9,800', t: 'B' }, { w: '45,320', t: 'A' }, { w: '7,999', t: 'B' }, { w: '10,001', t: 'A' }, { w: '8,750', t: 'B' },
      { w: '99,000', t: 'A' }, { w: '980', t: 'B' }, { w: '23,400', t: 'A' }, { w: '9,999', t: 'B' }, { w: '150,000', t: 'A' }, { w: '6,500', t: 'B' }
    ]
  },
  {
    name: '¿Narración o instructivo? 📖', hint: 'La narración CUENTA algo que pasó; el instructivo DICE cómo hacer algo, paso a paso', btnA: '📖 NARRACIÓN', btnB: '📋 INSTRUCTIVO',
    pool: [
      { w: 'Aquella mañana el río amaneció crecido', t: 'A' }, { w: 'Primero lava el frijol y quítale las piedritas', t: 'B' },
      { w: 'Mi abuela me contó lo que pasó en la feria', t: 'A' }, { w: 'Necesitas una botella, tierra y una semilla', t: 'B' },
      { w: 'Un día se nos perdió el perro en el monte', t: 'A' }, { w: 'Pon la olla al fuego durante veinte minutos', t: 'B' },
      { w: 'Al final todos regresamos contentos a la casa', t: 'A' }, { w: 'Al terminar, tapa el frasco y guárdalo a la sombra', t: 'B' },
      { w: 'Cuando llegó el bus, ya nos habíamos mojado', t: 'A' }, { w: 'Materiales: un cordel, dos palitos y goma', t: 'B' }
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
function showRetoWord(){ const pool=retoPairs[currentRetoPairIdx].pool; if(retoPool.length===0) retoPool=_shuffle([...pool,...pool]); retoCurrent=retoPool.pop(); document.getElementById('retoWord').innerHTML=Fr(retoCurrent.w); }
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
        _fb.innerHTML=Fr(`«${retoCurrent.w}» va en: ${retoCurrent.t==='A'?rp.btnA:rp.btnB}`);
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
      ['V','P','E','R','I','M','E','T','R','O'],
      ['E','N','O','I','C','C','A','R','F','P'],
      ['R','O','E','D','M','G','B','P','L','G'],
      ['T','N','I','R','A','O','P','V','F','D'],
      ['I','J','B','C','B','N','U','A','E','L'],
      ['C','M','E','M','E','A','G','C','U','N'],
      ['E','J','O','L','S','P','I','U','P','J'],
      ['F','R','N','C','P','M','A','M','L','F'],
      ['P','D','J','A','A','J','J','R','A','O'],
      ['U','P','U','L','G','D','U','R','T','D']],
      words:[
      {w:'ANGULO',cells:[[3,4],[4,5],[5,6],[6,7],[7,8],[8,9]]},
      {w:'ROMBO',cells:[[7,1],[6,2],[5,3],[4,4],[3,5]]},
      {w:'TRAPECIO',cells:[[9,8],[8,7],[7,6],[6,5],[5,4],[4,3],[3,2],[2,1]]},
      {w:'PERIMETRO',cells:[[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[0,9]]},
      {w:'VERTICE',cells:[[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0]]},
      {w:'FRACCION',cells:[[1,8],[1,7],[1,6],[1,5],[1,4],[1,3],[1,2],[1,1]]},
      {w:'DECIMAL',cells:[[3,9],[4,8],[5,7],[6,6],[7,5],[8,4],[9,3]]}] },
    { size:10,
      grid:[
      ['I','S','H','S','C','L','L','E','C','R'],
      ['B','N','V','H','H','B','C','J','G','E'],
      ['A','O','I','C','N','U','N','A','T','L'],
      ['R','T','T','C','E','O','J','N','I','L'],
      ['R','I','O','N','I','S','O','O','T','A'],
      ['L','N','T','D','I','O','R','S','U','T'],
      ['N','O','T','I','C','I','A','R','L','E'],
      ['N','V','S','S','P','E','R','E','O','D'],
      ['B','I','J','S','L','F','N','P','F','B'],
      ['J','L','H','C','F','T','I','A','P','M']],
      words:[
      {w:'CUENTO',cells:[[1,6],[2,5],[3,4],[4,3],[5,2],[6,1]]},
      {w:'ANUNCIO',cells:[[2,7],[2,6],[2,5],[2,4],[2,3],[2,2],[2,1]]},
      {w:'TITULO',cells:[[2,8],[3,8],[4,8],[5,8],[6,8],[7,8]]},
      {w:'PERSONAJE',cells:[[8,7],[7,7],[6,7],[5,7],[4,7],[3,7],[2,7],[1,7],[0,7]]},
      {w:'ANECDOTA',cells:[[9,7],[8,6],[7,5],[6,4],[5,3],[4,2],[3,1],[2,0]]},
      {w:'NOTICIA',cells:[[6,0],[6,1],[6,2],[6,3],[6,4],[6,5],[6,6]]},
      {w:'DETALLE',cells:[[7,9],[6,9],[5,9],[4,9],[3,9],[2,9],[1,9]]},
      {w:'INICIO',cells:[[0,0],[1,1],[2,2],[3,3],[4,4],[5,5]]}] }
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
/* En 4º la fracción se IDENTIFICA en una figura, no se opera: la prueba
   pregunta «qué fracción representa la parte sombreada». Por eso los
   desafíos piden sombrear, y ninguno pide convertir a decimal. */
const LAB1_RETOS=[
  {txt:'Sombrea la mitad de la pizza', n:1, d:2},
  {txt:'Sombrea 3/4 de la pizza', n:3, d:4},
  {txt:'Sombrea 2/3 de la pizza', n:2, d:3},
  {txt:'Sombrea 5/8 de la pizza', n:5, d:8},
  {txt:'Sombrea 3/6 de la pizza', n:3, d:6}
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
    <p style="text-align:center;font-family:'Fredoka',sans-serif;font-size:1.15rem;margin:0.5rem 0;">Parte sombreada: <strong>${Fr(k+'/'+n)}</strong> <span style="font-size:0.85rem;color:var(--gray);">(${k} de ${n} pedazos)</span></p>
    <div style="border:1.5px dashed var(--pri);border-radius:10px;padding:0.6rem 0.8rem;text-align:center;">
      🎯 Desafío ${lab1Reto+1} de ${LAB1_RETOS.length}: <strong>${Fr(reto.txt)}</strong>
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

// ===================== LAB 2: EL CERCO DEL TERRENO =====================
/* En 4º se mide el CONTORNO, no lo que cabe adentro: la prueba pregunta
   el perímetro de una figura. El terreno se dibuja con postes para que se
   vea de dónde sale la cuenta: se cuentan los postes de la orilla, que es
   como se cerca un solar de verdad. */
const LAB2_RETOS=[14,20,18,24,30];
let lab2L=3, lab2A=2, lab2Reto=0;
function lab2Render(){
  const box=document.getElementById('widget-perimetro-lab'); if(!box) return;
  const p=2*(lab2L+lab2A);
  let filas='';
  for(let y=0;y<lab2A;y++){
    let f='';
    for(let x=0;x<lab2L;x++){
      const orilla=(y===0||y===lab2A-1||x===0||x===lab2L-1);
      f+=`<span style="display:inline-block;width:1.15rem;text-align:center;">${orilla?'🟩':'⬜'}</span>`;
    }
    filas+=f+'<br>';
  }
  const ctl=(lbl,id,val,max)=>`<span style="display:inline-flex;align-items:center;gap:0.3rem;margin:0.2rem;"><strong>${lbl}</strong><button class="btn btn-d" data-c="${id}-">−</button><span style="font-family:'Fredoka',sans-serif;min-width:1.4rem;text-align:center;">${val}</span><button class="btn btn-d" data-c="${id}+">+</button></span>`;
  box.innerHTML=`
    <div style="text-align:center;">${ctl('Largo','L',lab2L,10)}${ctl('Ancho','A',lab2A,8)}</div>
    <div style="text-align:center;margin:0.5rem 0;line-height:1.15;font-size:0.95rem;">${filas}</div>
    <p style="text-align:center;font-family:'Fredoka',sans-serif;font-size:1.15rem;">P = (${lab2L} + ${lab2A}) × 2 = <strong>${p} m</strong></p>
    <div style="border:1.5px dashed var(--pri);border-radius:10px;padding:0.6rem 0.8rem;text-align:center;">
      🎯 Desafío ${lab2Reto+1} de ${LAB2_RETOS.length}: arma un terreno de <strong>${LAB2_RETOS[lab2Reto]} m</strong> de perímetro
      <div style="margin-top:0.5rem;"><button class="btn btn-g" id="lab2Check">✅ Comprobar</button></div>
    </div>
    <div id="fbLab2" class="fb" role="alert"></div>`;
  box.querySelectorAll('[data-c]').forEach(b=>{ b.onclick=()=>{
    const c=b.dataset.c; sfx('click');
    if(c==='L-') lab2L=Math.max(2,lab2L-1); else if(c==='L+') lab2L=Math.min(10,lab2L+1);
    else if(c==='A-') lab2A=Math.max(2,lab2A-1); else if(c==='A+') lab2A=Math.min(8,lab2A+1);
    lab2Render();
  }; });
  const chk=document.getElementById('lab2Check');
  if(chk) chk.onclick=()=>{
    if(2*(lab2L+lab2A)===LAB2_RETOS[lab2Reto]){
      sfx('ok');
      if(!xpTracker.lab2.has(lab2Reto)){ xpTracker.lab2.add(lab2Reto); pts(2); }
      fb('fbLab2',`¡Logrado! (${lab2L} + ${lab2A}) × 2 = ${LAB2_RETOS[lab2Reto]} m de cerco. +2 XP`,true);
      lab2Reto=(lab2Reto+1)%LAB2_RETOS.length;
      if(xpTracker.lab1.size===LAB1_RETOS.length&&xpTracker.lab2.size===LAB2_RETOS.length) fin('s-lab');
      setTimeout(lab2Render,1400);
    } else { sfx('no'); fb('fbLab2',`Tu terreno mide ${2*(lab2L+lab2A)} m de contorno y el desafío pide ${LAB2_RETOS[lab2Reto]} m. Ajusta el largo o el ancho.`,false); }
  };
}

// ===================== WIDGET: EL LECTOR DE GRÁFICOS =====================
/* En 4º no se saca promedio: se LEE el gráfico de barras, que es lo que
   pregunta la prueba («¿cuántos hermanos tiene Nelson?», «¿qué día hubo 6
   inasistencias?»). Las cuatro preguntas que rota son las cuatro formas en
   que la prueba interroga un gráfico: leer una barra, encontrar la mayor,
   comparar dos y sumar todas. La barra se dibuja con cuadros contables
   porque el niño responde contando, no midiendo. */
const GRAF_SETS=[
  {tit:'Cuadernos vendidos en la pulpería', quien:['Lunes','Martes','Miércoles','Jueves'], uni:'cuadernos'},
  {tit:'Hermanos que tiene cada amigo',     quien:['Alicia','Sara','Manuel','Nelson'],    uni:'hermanos'},
  {tit:'Naranjas recogidas en el huerto',   quien:['Doris','Elmer','Karla','Wilmer'],     uni:'naranjas'},
  {tit:'Faltas a clase esta semana',        quien:['Lunes','Martes','Miércoles','Jueves'],uni:'faltas'}
];
let grafDatos=[], grafSet=0, grafPreg=0, grafResp=0, grafAciertos=0;
function promNueva(){
  const box=document.getElementById('widget-grafico'); if(!box) return;
  grafSet=Math.floor(Math.random()*GRAF_SETS.length);
  const S=GRAF_SETS[grafSet];
  // valores distintos entre sí: si dos barras empatan, «¿cuál es la mayor?» no tiene una sola respuesta
  const usados=new Set();
  grafDatos=S.quien.map(()=>{ let v; do{ v=2+Math.floor(Math.random()*9); }while(usados.has(v)); usados.add(v); return v; });
  const may=Math.max(...grafDatos), iMay=grafDatos.indexOf(may);
  const men=Math.min(...grafDatos), iMen=grafDatos.indexOf(men);
  const total=grafDatos.reduce((a,b)=>a+b,0);
  grafPreg=Math.floor(Math.random()*4);
  const preguntas=[
    {q:`¿Cuántos ${S.uni} le tocan a ${S.quien[iMay]}?`, r:may},
    {q:`¿Cuántos ${S.uni} hay en total?`, r:total},
    {q:`¿Cuántos ${S.uni} más tiene ${S.quien[iMay]} que ${S.quien[iMen]}?`, r:may-men},
    {q:`¿Cuántos ${S.uni} le tocan a ${S.quien[1]}?`, r:grafDatos[1]}
  ];
  grafResp=preguntas[grafPreg].r;
  const filas=S.quien.map((n,i)=>`
    <tr>
      <td style="padding:0.15rem 0.4rem;text-align:right;white-space:nowrap;font-size:0.9rem;">${n}</td>
      <td style="padding:0.15rem 0;letter-spacing:1px;">${'🟦'.repeat(grafDatos[i])}</td>
    </tr>`).join('');
  box.innerHTML=`
    <p style="text-align:center;font-family:'Fredoka',sans-serif;margin-bottom:0.4rem;">📊 ${S.tit}</p>
    <table style="margin:0 auto 0.6rem;border-collapse:collapse;">${filas}</table>
    <p style="text-align:center;font-size:0.72rem;color:var(--gray);margin-bottom:0.6rem;">Cada 🟦 vale 1 ${S.uni.replace(/s$/,'')}</p>
    <p style="text-align:center;font-family:'Fredoka',sans-serif;font-size:1.05rem;margin-bottom:0.5rem;">${preguntas[grafPreg].q}</p>
    <div style="display:flex;gap:0.5rem;justify-content:center;align-items:center;flex-wrap:wrap;">
      <label for="promInp"><strong>Respuesta:</strong></label>
      <input id="promInp" class="eval-cp-input" type="text" inputmode="numeric" style="max-width:90px;" autocomplete="off">
      <button class="btn btn-g" id="promCheck">✅ Comprobar</button>
      <button class="btn btn-d" id="promNext">🔄 Otro gráfico</button>
    </div>
    <div id="fbProm" class="fb" role="alert"></div>`;
  document.getElementById('promCheck').onclick=()=>{
    const val=parseInt((document.getElementById('promInp').value||'').replace(/[^\d]/g,''),10);
    if(val===grafResp){
      sfx('ok'); grafAciertos++;
      if(grafAciertos<=6&&!xpTracker.prom.has(grafAciertos)){ xpTracker.prom.add(grafAciertos); pts(2); }
      fb('fbProm',`¡Correcto! La respuesta es ${grafResp}. +2 XP`,true);
      setTimeout(promNueva,1600);
    } else { sfx('no'); fb('fbProm','Todavía no. Cuenta los cuadritos de la barra que te preguntan, uno por uno.',false); }
  };
  document.getElementById('promNext').onclick=()=>{ sfx('click'); promNueva(); };
}

// ===================== WIDGET: EL DETECTIVE DE LA PALABRA =====================
const detData = [
  { s: ['El', 'maíz', 'de', 'la', 'milpa', 'estaba', 'maduro', 'en', 'octubre'], c: 6, pista: 'la palabra que significa listo para cosechar' },
  { s: ['El', 'bus', 'iba', 'repleto', 'de', 'gente', 'esa', 'mañana'], c: 3, pista: 'la palabra que significa muy lleno' },
  { s: ['Mi', 'tío', 'compró', 'un', 'terreno', 'fértil', 'cerca', 'del', 'río'], c: 5, pista: 'la palabra que significa bueno para sembrar' },
  { s: ['El', 'perro', 'flaco', 'buscaba', 'comida', 'en', 'el', 'patio'], c: 2, pista: 'la palabra que significa muy delgado' },
  { s: ['Los', 'niños', 'llegaron', 'agotados', 'del', 'partido', 'de', 'futbol'], c: 3, pista: 'la palabra que significa muy cansados' },
  { s: ['El', 'camino', 'al', 'pueblo', 'es', 'lodoso', 'cuando', 'llueve'], c: 5, pista: 'la palabra que significa lleno de lodo' }
];

// ===================== WIDGET: ¿MULTIPLICO o DIVIDO? =====================
/* Ocho situaciones, como el ¿m.c.m. o M.C.D.? de 6º, con los mismos campos
   (`s` la situación, `t` el grupo al que pertenece) y el mismo tamaño.
   Cambia la pregunta porque el m.c.m. y el M.C.D. NO son de 4º: lo que en
   4º se decide antes de resolver es si el problema se multiplica o se
   divide, que es donde se pierden los puntos de la prueba.

   ⚠️ Al montar la misión hay que relabelar las DOS puertas del widget en
   `radarRender` (los rótulos y las respuestas viven ahí, no en el banco):
   `radarMcm` → «✖️ MULTIPLICO» respondiendo 'mul', `radarMcd` → «➗ DIVIDO»
   respondiendo 'div', y sus dos mensajes: se multiplica cuando se repite
   la misma cantidad muchas veces, y se divide cuando se reparte en partes
   iguales. La mecánica no se toca. */
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

// ===================== WIDGET: ¿MULTIPLICO O DIVIDO? =====================
/* En 4º la pregunta que se atraganta no es qué fórmula usar, es qué
   OPERACIÓN pide el problema: «cuántos hay en total» multiplica y «cuánto
   le toca a cada uno» divide. Por eso el radar de 6º (m.c.m. o M.C.D.)
   aquí pregunta multiplico o divido. */
const radarData = [
  { s: 'En la escuela hay 6 secciones y en cada una hay 24 alumnos. ¿Cuántos alumnos hay en total?', t: 'mul' },
  { s: 'Se reparten 96 cuadernos en partes iguales entre 8 alumnos. ¿Cuántos le tocan a cada uno?', t: 'div' },
  { s: 'Un saco de maíz cuesta L.350. ¿Cuánto cuestan 4 sacos iguales?', t: 'mul' },
  { s: 'Doña Elena hizo 120 tortillas y las va a poner en bolsas de 12. ¿Cuántas bolsas llena?', t: 'div' },
  { s: 'Cada bus lleva 45 pasajeros. ¿Cuántos pasajeros llevan 3 buses llenos?', t: 'mul' },
  { s: 'La maestra tiene 72 lápices y quiere darle la misma cantidad a 9 niños. ¿Cuántos le da a cada uno?', t: 'div' },
  { s: 'Una gallina pone 5 huevos por semana. ¿Cuántos huevos pone en 8 semanas?', t: 'mul' },
  { s: 'Se recogieron 150 naranjas y se ponen 25 en cada canasta. ¿Cuántas canastas se necesitan?', t: 'div' }
];

// ===================== ESCRITURA: EXPLICA Y REDACTA =====================
/* Cinco consignas, como en 6º, con su pista, su pauta de tres criterios y
   su respuesta sugerida. Son las formas de escribir que pide la prueba de
   4º: la anécdota con título, inicio, desarrollo y final; el instructivo
   con materiales y pasos; la descripción de un personaje; y los dos tipos
   de texto que faltaban, el anuncio y el informativo. La pauta la revisa
   el propio alumno, así que cada criterio se puede mirar en el papel sin
   saber gramática. */
let radarPool=[], radarOk=0;
function radarRender(){
  const box=document.getElementById('widget-mcmmcd'); if(!box) return;
  if(radarPool.length===0) radarPool=_shuffle([...radarData]);
  const item=radarPool[0];
  box.innerHTML=`
    <div style="border:1.5px solid var(--border);border-radius:10px;padding:0.7rem 0.9rem;text-align:center;font-family:'Fredoka',sans-serif;margin-bottom:0.6rem;">${item.s}</div>
    <div style="display:flex;gap:0.6rem;justify-content:center;flex-wrap:wrap;">
      <button class="btn btn-pri" id="radarMcm">✖️ Multiplico</button>
      <button class="btn btn-sec" id="radarMcd">➗ Divido</button>
    </div>
    <div id="fbRadar" class="fb" role="alert"></div>`;
  const responder=(resp)=>{
    if(resp===item.t){
      sfx('ok'); radarOk++;
      if(radarOk<=6&&!xpTracker.radar.has(radarOk)){ xpTracker.radar.add(radarOk); pts(2); }
      fb('fbRadar',item.t==='mul'?'¡Correcto! Cuando se repite lo mismo varias veces, se multiplica. +2 XP':'¡Correcto! Cuando se reparte en partes iguales, se divide. +2 XP',true);
    } else {
      sfx('no');
      fb('fbRadar',item.t==='mul'?'Era multiplicar: hay VARIOS grupos con la misma cantidad y se pregunta el total.':'Era dividir: hay un total y se pregunta cuánto le toca a cada uno.',false);
    }
    radarPool.shift();
    setTimeout(radarRender,1800);
  };
  document.getElementById('radarMcm').onclick=()=>responder('mul');
  document.getElementById('radarMcd').onclick=()=>responder('div');
}

// ===================== GENERADOR DE TAREAS =====================
// Tareas autogeneradas: el estudiante se autoasigna práctica desde casa o el
// docente las copia en el pizarrón. Cada "⚡ Generar" crea ejercicios nuevos
// y las respuestas quedan ocultas hasta presionar "👁 Respuestas".
function _tgRint(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
function _tgLines(n){ let s=''; for(let i=0;i<n;i++) s+='<div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.4rem;height:1.3rem;">&nbsp;</div>'; return s; }
function _tgTask(out,i,inner){ const div=document.createElement('div'); div.className='tg-task'; div.innerHTML=Fr(`<div class="tg-task-num">${i+1}</div><div class="tg-task-content">${inner}</div>`); out.appendChild(div); }
function _instrBlock(out,title,lines){ const ib=document.createElement('div'); ib.className='tg-instruction-block'; ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join(''); out.appendChild(ib); }

// 🍕 ¿Qué fracción está sombreada? (en 4º la fracción se identifica, no se opera)
function genFraccionesTask(out,count){
  _instrBlock(out,'Instrucción: fracciones',['Escribe la fracción que representa la parte sombreada de cada figura.','<strong>Recuerda:</strong> abajo va en cuántos pedazos IGUALES está partida la figura, y arriba cuántos están sombreados.']);
  const figs=['una tortilla','una naranja','un pastel','una barra de chocolate','una sandía','un queso'];
  for(let i=0;i<count;i++){
    const d=_tgRint(2,12); const n=_tgRint(1,d-1);
    const fig=figs[_tgRint(0,figs.length-1)];
    _tgTask(out,i,`<strong>Partieron ${fig} en ${d} pedazos iguales y se comieron ${n}. ¿Qué fracción se comieron y qué fracción quedó?</strong>${_tgLines(1)}<div class="tg-answer">✔ Se comieron ${n}/${d} y quedó ${d-n}/${d}</div>`);
  }
}
// 💰 Compras con decimales (en 4º se SUMA y se RESTA con decimales, no se multiplica)
function genDecimalesTask(out,count){
  _instrBlock(out,'Instrucción: compras con decimales',['Resuelve cada compra. Escribe los números uno debajo del otro con el <strong>punto alineado</strong> y suma o resta como siempre.','<strong>Comprueba</strong> estimando: si algo cuesta como L.18 y lo otro como L.12, el total anda por L.30.']);
  const prods=['frijoles','arroz','azúcar','café','maíz','manteca','harina','jabón','sal'];
  for(let i=0;i<count;i++){
    const p1=_tgRint(500,4500)/100, p2=_tgRint(500,4500)/100;
    const a=prods[_tgRint(0,prods.length-1)]; let b=prods[_tgRint(0,prods.length-1)]; if(b===a) b=prods[(prods.indexOf(a)+1)%prods.length];
    if(_tgRint(0,1)===0){
      const total=Math.round((p1+p2)*100)/100;
      _tgTask(out,i,`<strong>Doña Rosa compró ${a} por L.${p1.toFixed(2)} y ${b} por L.${p2.toFixed(2)}. ¿Cuánto pagó en total?</strong>${_tgLines(1)}<div class="tg-answer">✔ ${p1.toFixed(2)} + ${p2.toFixed(2)} = L.${total.toFixed(2)}</div>`);
    } else {
      const paga=[50,100,200,500].find(v=>v>p1)||500;
      const vuelto=Math.round((paga-p1)*100)/100;
      _tgTask(out,i,`<strong>Un cuaderno cuesta L.${p1.toFixed(2)} y Marta paga con L.${paga}. ¿Cuánto le devuelven?</strong>${_tgLines(1)}<div class="tg-answer">✔ ${paga}.00 − ${p1.toFixed(2)} = L.${vuelto.toFixed(2)}</div>`);
    }
  }
}
// ✖️ Multiplicar y dividir (las dos cuentas largas de 4º)
function genOperacionesTask(out,count){
  _instrBlock(out,'Instrucción: multiplicar y dividir',['Resuelve cada cuenta escribiendo todo el procedimiento, no solo el resultado.','<strong>Cuidado:</strong> al multiplicar por dos cifras, el segundo renglón se corre UN lugar a la izquierda.']);
  for(let i=0;i<count;i++){
    if(_tgRint(0,1)===0){
      const a=_tgRint(120,9800), b=_tgRint(11,99);
      _tgTask(out,i,`<strong>${_fmtNum(a)} × ${b} =</strong>${_tgLines(2)}<div class="tg-answer">✔ ${_fmtNum(a*b)}</div>`);
    } else {
      const cociente=_tgRint(24,900), divisor=_tgRint(3,60);
      const dividendo=cociente*divisor;
      _tgTask(out,i,`<strong>${_fmtNum(dividendo)} ÷ ${divisor} =</strong>${_tgLines(2)}<div class="tg-answer">✔ ${_fmtNum(cociente)} (comprueba: ${_fmtNum(cociente)} × ${divisor} = ${_fmtNum(dividendo)})</div>`);
    }
  }
}
// 📏 Conversiones y la hora
function genConversionesTask(out,count){
  _instrBlock(out,'Instrucción: conversiones',['Convierte lo que se pide y escribe la unidad al lado del número.','<strong>Ten a mano:</strong> 1 metro = 100 centímetros · 3 pies = 1 yarda · 1 galón = 4 botellas · 1 hora = 60 minutos.']);
  for(let i=0;i<count;i++){
    const tipo=_tgRint(0,4);
    if(tipo===0){ const m=_tgRint(2,40); _tgTask(out,i,`<strong>Una pared mide ${m} metros. ¿Cuántos centímetros mide?</strong>${_tgLines(1)}<div class="tg-answer">✔ ${m} × 100 = ${_fmtNum(m*100)} cm</div>`); }
    else if(tipo===1){ const y=_tgRint(2,25); _tgTask(out,i,`<strong>Un rollo de cable mide ${y*3} pies. ¿Cuántas yardas tiene?</strong>${_tgLines(1)}<div class="tg-answer">✔ ${y*3} ÷ 3 = ${y} yardas</div>`); }
    else if(tipo===2){ const g=_tgRint(2,15); _tgTask(out,i,`<strong>En la hacienda sacan ${g} galones de leche al día. ¿Cuántas botellas son?</strong>${_tgLines(1)}<div class="tg-answer">✔ ${g} × 4 = ${g*4} botellas</div>`); }
    else if(tipo===3){ const h=_tgRint(7,10), min=[10,15,20,25,40,45,50][_tgRint(0,6)], dur=[20,30,40,45,50][_tgRint(0,4)];
      const t=h*60+min+dur, hf=Math.floor(t/60), mf=t%60;
      _tgTask(out,i,`<strong>La clase empieza a las ${h}:${String(min).padStart(2,'0')} am y dura ${dur} minutos. ¿A qué hora termina?</strong>${_tgLines(1)}<div class="tg-answer">✔ ${hf}:${String(mf).padStart(2,'0')} am</div>`); }
    else { const eur=_tgRint(2,60), tasa=26; _tgTask(out,i,`<strong>Si 1 euro vale L.${tasa}, ¿cuántos lempiras son ${eur} euros?</strong>${_tgLines(1)}<div class="tg-answer">✔ ${eur} × ${tasa} = L.${_fmtNum(eur*tasa)}</div>`); }
  }
}
// 📐 Perímetro, ángulos y figuras
function genGeometriaTask(out,count){
  _instrBlock(out,'Instrucción: geometría',['Contesta cada una y escribe la unidad cuando la haya.','<strong>Ten a mano:</strong> perímetro = la suma de todos los lados · ángulo agudo mide menos de 90° · el recto mide 90° · el obtuso mide más de 90° y menos de 180° · el llano mide 180°.']);
  for(let i=0;i<count;i++){
    const tipo=_tgRint(0,3);
    if(tipo===0){ const l=_tgRint(3,20), a=_tgRint(2,15); _tgTask(out,i,`<strong>Un terreno rectangular mide ${l} m de largo y ${a} m de ancho. ¿Cuánto alambre se necesita para cercarlo una vuelta?</strong>${_tgLines(1)}<div class="tg-answer">✔ (${l} + ${a}) × 2 = ${2*(l+a)} m</div>`); }
    else if(tipo===1){ const l=_tgRint(3,25); _tgTask(out,i,`<strong>¿Cuál es el perímetro de un cuadrado de ${l} cm de lado?</strong>${_tgLines(1)}<div class="tg-answer">✔ ${l} × 4 = ${l*4} cm</div>`); }
    else if(tipo===2){ const g=[25,40,55,70,90,110,135,160,180][_tgRint(0,8)];
      const clase=g<90?'agudo':g===90?'recto':g===180?'llano':'obtuso';
      _tgTask(out,i,`<strong>Un ángulo mide ${g}°. ¿Qué clase de ángulo es?</strong>${_tgLines(1)}<div class="tg-answer">✔ Es un ángulo ${clase}</div>`); }
    else { const casos=[
        ['tres lados iguales','equilátero'],['dos lados iguales y uno distinto','isósceles'],['los tres lados distintos','escaleno'],
        ['cuatro lados iguales y cuatro ángulos rectos','cuadrado'],['solo dos lados paralelos','trapecio'],['cuatro lados iguales sin ángulos rectos','rombo']];
      const c=casos[_tgRint(0,casos.length-1)];
      _tgTask(out,i,`<strong>¿Qué nombre recibe la figura que tiene ${c[0]}?</strong>${_tgLines(1)}<div class="tg-answer">✔ ${c[1].charAt(0).toUpperCase()+c[1].slice(1)}</div>`); }
  }
}
// 📊 Gráficos y comparar números
function genGraficosTask(out,count){
  _instrBlock(out,'Instrucción: gráficos y comparación',['Lee cada tabla o cada pareja de números y contesta.','<strong>Recuerda:</strong> el signo > se lee «es mayor que» y el signo < se lee «es menor que». La punta siempre apunta al número más pequeño.']);
  const nombres=['Alicia','Sara','Manuel','Nelson','Doris','Elmer','Karla','Wilmer'];
  for(let i=0;i<count;i++){
    const tipo=_tgRint(0,2);
    if(tipo===0){
      const q=_shuffle([...nombres]).slice(0,4), v=q.map(()=>_tgRint(2,12));
      const may=Math.max(...v), men=Math.min(...v);
      _tgTask(out,i,`<strong>En la venta de la escuela vendieron: ${q.map((n,k)=>n+' '+v[k]).join(', ')} bolsitas. ¿Quién vendió más, quién vendió menos y cuántas se vendieron en total?</strong>${_tgLines(2)}<div class="tg-answer">✔ Más: ${q[v.indexOf(may)]} (${may}) · Menos: ${q[v.indexOf(men)]} (${men}) · Total: ${v.reduce((a,b)=>a+b,0)}</div>`);
    } else if(tipo===1){
      const a=_tgRint(1000,99999), b=_tgRint(1000,99999);
      if(a===b){ i--; continue; }
      _tgTask(out,i,`<strong>Escribe el signo que va en medio: ${_fmtNum(a)} ____ ${_fmtNum(b)}</strong>${_tgLines(1)}<div class="tg-answer">✔ ${_fmtNum(a)} ${a>b?'>':'<'} ${_fmtNum(b)}</div>`);
    } else {
      const nums=[]; while(nums.length<4){ const v=_tgRint(1000,99999); if(!nums.includes(v)) nums.push(v); }
      _tgTask(out,i,`<strong>Ordena de menor a mayor: ${nums.map(_fmtNum).join(', ')}</strong>${_tgLines(1)}<div class="tg-answer">✔ ${[...nums].sort((x,y)=>x-y).map(_fmtNum).join(', ')}</div>`);
    }
  }
}
// 🧠 Pensamiento y escritura (banco fijo, mezcla las dos materias)
const pensamientoTaskDB=[
  {q:'Beto dice que 3.5 + 2.25 es 5.30. Explica cuál fue su error y resuelve la suma bien.',ans:'No alineó el punto: puso el 5 debajo del 2. Lo correcto: 3.50 + 2.25 = 5.75.',type:'🔎 Detectar error'},
  {q:'Escribe un problema de la vida real que se resuelva con la cuenta 48 ÷ 6, y resuélvelo.',ans:'Respuesta variable. Ej.: repartir 48 naranjas entre 6 niños, a 8 naranjas cada uno.',type:'✏️ Crear problema'},
  {q:'Un terreno cuadrado y otro rectangular pueden tener el mismo perímetro y verse distintos. Dibuja un ejemplo y explica por qué pasa.',ans:'Respuesta variable. Ej.: el cuadrado de 5 m de lado y el rectángulo de 8 m por 2 m miden los dos 20 m de contorno.',type:'🧠 Razonar'},
  {q:'Escribe una oración que diga lo que un texto DICE con todas sus letras y otra que diga lo que el texto DEJA ENTENDER, sobre esta frase: «Juana llegó empapada y sin paraguas».',ans:'Dice: llegó empapada y sin paraguas. Deja entender: estaba lloviendo y ella no llevaba con qué taparse.',type:'📖 Literal e inferencial'},
  {q:'Un texto dice: «El cusuco sale de noche. De día duerme en su cueva». Inventa una pregunta cuya respuesta esté escrita y otra cuya respuesta haya que deducir.',ans:'Escrita: ¿cuándo sale el cusuco? Deducida: ¿por qué es difícil verlo al mediodía? (porque duerme de día).',type:'📖 Tipos de pregunta'},
  {q:'Un cuaderno cuesta L.35 y llevas L.200. Averigua cuántos cuadernos puedes comprar y cuánto te sobra.',ans:'200 ÷ 35 = 5 cuadernos, y sobran L.25 (5 × 35 = 175; 200 − 175 = 25).',type:'🧮 Dos pasos'},
  {q:'Escribe los pasos para hacer una limonada, en orden y numerados. Después di por qué a un instructivo no se le puede cambiar el orden.',ans:'Respuesta variable. El orden manda: si exprimes los limones después de servir el agua con azúcar, el trabajo se hace dos veces.',type:'📝 Instructivo'},
  {q:'Mira estos números: 12,450 y 12,405. Di cuál es mayor y explica en qué cifra te diste cuenta.',ans:'12,450 es mayor. Las dos primeras cifras son iguales; se decide en las decenas: 5 es mayor que 0.',type:'🧠 Razonar'}
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
function genTask(){ sfx('click'); const type=document.getElementById('tgType').value; const count=parseInt(document.getElementById('tgCount').value); ansVisible=false; const out=document.getElementById('tgOut'); out.innerHTML=''; if(type==='fracciones') genFraccionesTask(out,count); else if(type==='decimales') genDecimalesTask(out,count); else if(type==='operaciones') genOperacionesTask(out,count); else if(type==='conversiones') genConversionesTask(out,count); else if(type==='geometria') genGeometriaTask(out,count); else if(type==='graficos') genGraficosTask(out,count); else if(type==='pensamiento') genPensamientoTask(out,count); fin('s-tareas'); }
function toggleAns(){ ansVisible=!ansVisible; document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none'); sfx('click'); }

// ===================== ESCRITURA: EXPLICA Y REDACTA =====================
// Las dos consignas de escritura de la prueba real (secuencia y opinión) más
// carta, moraleja y hecho-opinión. La pauta la revisa el propio alumno.
const explicaData = [
  {
    q: 'Escribe una anécdota: algo chistoso o curioso que te pasó de verdad. Ponle título y cuéntala en tres partes: cómo empezó, qué pasó y cómo terminó.',
    hint: '💡 Pista: la anécdota es corta y le pasó a alguien de verdad. Usa palabras de orden: un día, después, al final.',
    rubric: ['✓ Lleva título propio y cuenta algo que pasó de verdad, no un cuento inventado', '✓ Se le ven las tres partes en orden: inicio, desarrollo y final', '✓ Usa palabras de tiempo (un día, después, al final), mayúscula al empezar y punto final'],
    suggested: '«El cerdo en el aula». Un día llegamos temprano y encontramos un cerdo dormido debajo del escritorio de la maestra. Después lo sacamos al patio entre todos, con una tortilla en la mano, y no había quien lo hiciera caminar. Al final llegó el dueño por él y nos regaló elotes asados.'
  },
  {
    q: 'Escribe un instructivo para sembrar un frijol en un vaso. Primero la lista de materiales y después los pasos numerados, en orden.',
    hint: '💡 Pista: el instructivo lleva dos partes: qué se necesita y qué se hace. Cada paso empieza con un verbo: llena, pon, riega.',
    rubric: ['✓ Trae la lista de materiales completa y separada de los pasos', '✓ Los pasos van numerados y en el orden correcto (no se riega antes de sembrar)', '✓ Cada paso empieza con un verbo y se entiende con una sola leída'],
    suggested: 'Materiales: un vaso, tierra, un frijol y agua. Pasos: 1. Llena el vaso con tierra hasta la mitad. 2. Pon el frijol encima y tápalo con un poco de tierra. 3. Riégalo con un chorrito de agua. 4. Déjalo donde le dé el sol. 5. Riégalo cada mañana y anota en tu cuaderno el día que sale la primera hoja.'
  },
  {
    q: 'Describe a un personaje de tu comunidad que todos conozcan: la que vende pan, el que maneja el bus, tu maestro. Di cómo se ve, cómo es su forma de ser y da un ejemplo de algo que hace.',
    hint: '💡 Pista: primero cómo se ve y después cómo es por dentro. Usa adjetivos: bajita, callada, trabajadora.',
    rubric: ['✓ Dice cómo se ve el personaje: estatura, ropa o alguna seña propia', '✓ Dice cómo es su forma de ser con al menos dos adjetivos', '✓ Da un ejemplo de algo que el personaje hace, no solo adjetivos sueltos'],
    suggested: 'Doña Marta es bajita y siempre anda con su delantal azul y el pelo recogido. Es trabajadora y platicadora: se levanta a las cuatro de la mañana a hacer pan y le pregunta a cada quien cómo amaneció. Cuando a un niño no le alcanza el dinero, igual le da su pan y le dice que se lo pague mañana.'
  },
  {
    q: 'Escribe un anuncio para invitar a la comunidad a la feria de la lectura de tu escuela. Tiene que decir qué es, dónde, qué día y a qué hora, y llevar una frase que dé ganas de ir.',
    hint: '💡 Pista: el anuncio avisa, no cuenta una historia. Es corto y se lee de lejos.',
    rubric: ['✓ Contesta las cuatro preguntas del anuncio: qué, dónde, qué día y a qué hora', '✓ Es corto y directo, sin párrafos largos', '✓ Lleva una frase que invita y se entiende de una sola leída'],
    suggested: '¡FERIA DE LA LECTURA! Escuela Ramón Rosa, aldea El Zapote. Sábado 20 de septiembre, de 9 de la mañana a 12 del mediodía. Habrá cuentos, adivinanzas y libros prestados para llevar a la casa. ¡Traiga a toda la familia, la entrada es libre!'
  },
  {
    q: 'Escribe un texto informativo de cuatro o cinco líneas sobre el río, la montaña o el parque de tu comunidad. Informa: no cuentes una historia ni digas si te gusta.',
    hint: '💡 Pista: el texto informativo dice cómo es algo, dónde queda y para qué sirve, con datos que cualquiera puede comprobar.',
    rubric: ['✓ Informa con datos: dónde queda, cómo es y para qué sirve', '✓ No mete opiniones del tipo «es el más bonito» ni cuenta una anécdota', '✓ Tiene cuatro líneas o más, con las ideas en orden y punto final en cada oración'],
    suggested: 'El río Chiquito pasa al norte de la aldea. En verano baja poco y en invierno crece hasta la orilla del camino. De él sacan agua para los cultivos de maíz y para dar de beber a los animales. Los sábados varias familias lavan ropa en las piedras grandes.'
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
  {q:'El número noventa mil se escribe 9000.',a:false},
  {q:'El resultado de 4832 ÷ 8 es 640.',a:false},
  {q:'Un ángulo de 120 grados es un ángulo agudo.',a:false},
  {q:'Un triángulo escaleno tiene sus tres lados desiguales.',a:true},
  {q:'Un metro tiene 1000 centímetros.',a:false},
  {q:'El resultado de 3.525 + 4.986 es 8.511.',a:true},
  {q:'Un prisma rectangular tiene 12 aristas.',a:true},
  {q:'El signo > se lee mayor que.',a:true}
];
const evalTFBankEsp=[
  {q:'Un texto instructivo da los pasos en orden para hacer algo, como una receta.',a:true},
  {q:'El tema de un texto es cualquier detalle pequeño que aparece en él.',a:false},
  {q:'Un anuncio sirve para invitar a comprar algo o para avisar de un evento.',a:true},
  {q:'Un texto narrativo cuenta una historia con personajes.',a:true},
  {q:'Para saber qué significa una palabra nueva no sirve leer la oración completa.',a:false},
  {q:'Un texto informativo explica cómo es algo real, sin inventarlo.',a:true},
  {q:'Una anécdota es un cuento largo de hadas y castillos.',a:false}
];
// Banco de selección múltiple de las DOS materias (el Campeonísimo lo lee tal
// cual con «Actualizar banco»; el campo materia decide en qué prueba sale).
// Banco de selección múltiple de las DOS materias (el Campeonísimo lo lee tal
// cual con «Actualizar banco»; el campo materia decide en qué prueba sale).
const evalMCBank=[
  {materia:'mat',q:'¿Cuál es el resultado de 2345 × 36?',o:['a) 8442','b) 84420','c) 84240','d) 74420'],a:1},
  {materia:'mat',q:'¿Cuál es el resultado de 94325 - 76849?',o:['a) 17476','b) 18476','c) 17576','d) 22524'],a:0},
  {materia:'mat',q:'¿Cuál es el resultado de 903.31 - 87.862?',o:['a) 816.448','b) 825.448','c) 815.448','d) 815.552'],a:2},
  {materia:'mat',q:'Doña Elsa repartió 1944 semillas en 8 bolsas iguales. ¿Cuántas semillas puso en cada bolsa?',o:['a) 234','b) 253','c) 24','d) 243'],a:3},
  {materia:'mat',q:'Una figura está dividida en 8 partes iguales y 3 están pintadas. ¿Qué fracción representa la parte pintada?',o:['a) 8/3','b) 3/8','c) 3/5','d) 5/8'],a:1},
  {materia:'mat',q:'El recreo empieza a las 10:40 am y dura 45 minutos. ¿A qué hora termina?',o:['a) 11:25 am','b) 10:85 am','c) 11:15 am','d) 11:45 am'],a:0},
  {materia:'mat',q:'Una tabla mide 12 pies. Si una yarda tiene 3 pies, ¿cuántas yardas mide la tabla?',o:['a) 15 yardas','b) 36 yardas','c) 9 yardas','d) 4 yardas'],a:3},
  {materia:'mat',q:'¿Cuál opción ordena los números de menor a mayor?',o:['a) 45320, 45230, 45023','b) 45230, 45023, 45320','c) 45023, 45230, 45320','d) 45023, 45320, 45230'],a:2},
  {materia:'esp',q:'Marta se levantó temprano para ir a la escuela. Metió en su mochila el cuaderno de Matemáticas y una naranja para el recreo.\n\nSegún el texto, ¿qué llevó Marta para el recreo?',o:['a) Un cuaderno.','b) Una mochila.','c) Un lápiz.','d) Una naranja.'],a:3},
  {materia:'esp',q:'Don Chico miró el cielo, guardó el machete y caminó rápido hacia la casa. Cuando llegó, el patio ya estaba lleno de charcos.\n\n¿Qué pasó mientras don Chico caminaba?',o:['a) Empezó a llover.','b) Se hizo de noche.','c) Perdió el machete.','d) Llegaron visitas.'],a:0},
  {materia:'esp',q:'El camino a la aldea estaba pedregoso y el bus avanzaba despacio. A cada rato los pasajeros brincaban en sus asientos.\n\n¿Qué significa en el texto la palabra pedregoso?',o:['a) muy limpio','b) muy ancho','c) lleno de piedras','d) con mucha agua'],a:2},
  {materia:'esp',q:'La lluvia llena los ríos y las quebradas de la aldea. También hace crecer la milpa y da de beber a los animales.\n\n¿De qué trata principalmente el texto?',o:['a) De los animales de la aldea.','b) De lo que la lluvia le da a la aldea.','c) De la milpa que crece.','d) De las quebradas del monte.'],a:1},
  {materia:'esp',q:'Ana es la más alta de cuarto grado y usa el pelo trenzado. Llega de primera al aula y presta sus lápices a quien los necesita.\n\nSegún el texto, ¿cómo es Ana?',o:['a) Generosa y puntual.','b) Callada y triste.','c) Distraída y lenta.','d) Enojada y sola.'],a:0},
  {materia:'esp',q:'¡Gran venta de pan! Panadería La Espiga, frente al parque de Choluteca. Bolsa de diez panes por veinte lempiras, solo este sábado.\n\n¿Qué tipo de texto es?',o:['a) Un cuento.','b) Una carta.','c) Un anuncio.','d) Una noticia.'],a:2},
  {materia:'esp',q:'Primero lava tres tomates. Después córtalos en trozos pequeños. Al final mézclalos con la cebolla y un poco de sal.\n\n¿Qué tipo de texto es?',o:['a) Un anuncio.','b) Un poema.','c) Una noticia.','d) Un instructivo.'],a:3},
  {materia:'esp',q:'Los alumnos de Intibucá sembraron veinte arbolitos en el patio. Cada semana ellos ___ agua con baldes.\n\n¿Qué palabra completa correctamente la oración?',o:['a) llevo','b) llevan','c) llevas','d) llevaré'],a:1}
];
const evalCPBankMat=[
  {q:'El resultado de 542 + 6759 es ___.',a:'7301',acc:['7301']},
  {q:'El resultado de 571 × 90 es ___.',a:'51390',acc:['51390']},
  {q:'El resultado de 19818 ÷ 54 es ___.',a:'367',acc:['367']},
  {q:'Un ángulo llano mide ___ grados.',a:'180',acc:['180','ciento ochenta']},
  {q:'El perímetro de un cuadrado de 7 cm de lado es ___ cm.',a:'28',acc:['28','veintiocho']},
  {q:'Si 310 + ? = 810, el número que falta es ___.',a:'500',acc:['500','quinientos']},
  {q:'Tres metros son ___ centímetros.',a:'300',acc:['300','trescientos']},
  {q:'El resultado de 237 - 105 + 786 es ___.',a:'918',acc:['918']}
];
const evalCPBankEsp=[
  {q:'Ayer nosotros ___ al río y regresamos al mediodía.',a:'fuimos',acc:['fuimos']},
  {q:'Mañana los alumnos ___ el himno en el acto cívico.',a:'cantarán',acc:['cantaran','cantan']},
  {q:'El pino es el ___ nacional de Honduras.',a:'árbol',acc:['arbol']},
  {q:'La maestra escribió la fecha en la ___ con tiza blanca.',a:'pizarra',acc:['pizarra']},
  {q:'Anoche llovió tanto que hoy el ___ está lleno de charcos.',a:'patio',acc:['patio','camino','solar']},
  {q:'Los pájaros ___ en el árbol de mango del patio.',a:'cantan',acc:['cantan','cantaban']},
  {q:'Yo ___ mi nombre en la primera línea del cuaderno.',a:'escribí',acc:['escribi','escribo']}
];
const evalPRBankMat=[
  {term:'Ángulo recto',def:'El que mide exactamente 90 grados'},
  {term:'Ángulo obtuso',def:'El que mide más de 90 y menos de 180 grados'},
  {term:'Triángulo equilátero',def:'Triángulo con sus tres lados de igual medida'},
  {term:'Trapecio',def:'Cuadrilátero con un solo par de lados paralelos'},
  {term:'Perímetro',def:'La suma de todos los lados de una figura'},
  {term:'Arista',def:'La línea donde se juntan dos caras de un cuerpo'},
  {term:'Cociente',def:'El resultado de una división'},
  {term:'Producto',def:'El resultado de una multiplicación'}
];
const evalPRBankEsp=[
  {term:'Texto narrativo',def:'Cuenta una historia con personajes y sucesos'},
  {term:'Texto informativo',def:'Explica cómo es algo real, con datos verdaderos'},
  {term:'Anuncio',def:'Invita a comprar algo o avisa de un evento'},
  {term:'Instructivo',def:'Da los pasos en orden para lograr algo'},
  {term:'Tema',def:'De qué trata el texto en general, no un detalle'},
  {term:'Anécdota',def:'Relato corto de algo que de verdad le pasó a alguien'},
  {term:'Sustantivo',def:'Palabra que nombra personas, animales, cosas o lugares'}
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
  const pt=document.getElementById('eval-print-title'); if(pt) pt.textContent=`Evaluación de Repaso · Prueba de Fin de Grado 4º · ${M.nombre}`;
  evalAnsVisible=false;
  const out=document.getElementById('evalOut'); out.innerHTML='';
  const bar=document.createElement('div'); bar.className='eval-score-bar';
  bar.innerHTML=`<div><div class="esb-title">📊 Prueba de ${M.nombre}: 100 puntos</div><div class="esb-dist">4 secciones × 5 preguntas × 5 pts = 100 pts</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">I. Completar 25 pts</span><span class="eval-score-pill esp-tf">II. V/F 25 pts</span><span class="eval-score-pill esp-mc">III. Selección 25 pts</span><span class="eval-score-pill esp-pr">IV. Pareados 25 pts</span></div>`;
  out.appendChild(bar);
  const cpItems=_pickF(M.cp,5, rng);
  const s1=document.createElement('div'); s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  cpItems.forEach((item,i)=>{ const d=document.createElement('div'); d.className='eval-item eval-auto-item'; const qHtml=Fr(item.q).replace('___','<input class="eval-cp-input" type="text" data-ecp="'+i+'" autocomplete="off" style="min-width:110px;">'); d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${Fr(item.a)}</div><div class="eval-item-feedback" id="evalFbEcp${i}" aria-live="polite"></div>`; s1.appendChild(d); });
  out.appendChild(s1);
  const tfItems=_pickF(M.tf,5, rng);
  const s2=document.createElement('div'); s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  tfItems.forEach((item,i)=>{ const d=document.createElement('div'); d.className='eval-item eval-auto-item'; d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${Fr(item.q)}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="V"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="F"> Falso</label></div><div style="margin-top:0.4rem;margin-left:1.7rem;font-size:0.82rem;color:var(--gray);">Justifica por qué: <span style="display:inline-block;min-width:180px;border-bottom:1px solid var(--border);">&nbsp;</span></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbEtf${i}" aria-live="polite"></div>`; s2.appendChild(d); });
  out.appendChild(s2);
  const mcItems=_pickF(evalMCBank.filter(x=>x.materia===m),5, rng);
  const s3=document.createElement('div'); s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  mcItems.forEach((item,i)=>{ const d=document.createElement('div'); d.className='eval-item eval-auto-item'; const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${Fr(op)}</label>`).join(''); d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${Fr(item.q.replace(/\n/g,'<br>'))}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${Fr(item.o[item.a])}</div><div class="eval-item-feedback" id="evalFbEmc${i}" aria-live="polite"></div>`; s3.appendChild(d); });
  out.appendChild(s3);
  const prItems=_pickF(M.pr,5, rng); const shuffledDefs=_shuffleF(prItems, rng); const letters=['A','B','C','D','E'];
  const s4=document.createElement('div'); s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  const matchCard=document.createElement('div'); matchCard.className='eval-item eval-auto-item';
  let colLeft='<div class="eval-match-col"><h4>📘 Términos</h4>';
  prItems.forEach((item,i)=>{ const selHtml='<select class="eval-pr-sel" data-epr="'+i+'" aria-label="Letra para '+item.term+'"><option value="">·</option>'+letters.map(L=>'<option value="'+L+'">'+L+'</option>').join('')+'</select>'; colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> ${selHtml} ${Fr(item.term)}</div>`; });
  colLeft+='</div>';
  let colRight='<div class="eval-match-col"><h4>📗 Definiciones</h4>';
  shuffledDefs.forEach((item,i)=>{ colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${Fr(item.def)}</div>`; });
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
  el.innerHTML = Fr(msg); el.className = 'eval-item-feedback ' + (ok ? 'eval-ok' : 'eval-no');
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
  d.cp.forEach((it,i)=>{ const q=Fr(it.q).replace('___','<span class="cp-blank"></span>'); s1+=`<div class="cp-row"><span class="qn">${i+1}.</span><span class="cp-text">${q}</span></div>`; });
  let s2=`<div class="sec-title"><span>II. Verdadero o Falso</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25 pts</span></div></div>`;
  d.tf.forEach((it,i)=>{ s2+=`<div class="tf-row"><span class="qn">${i+6}.</span><span class="tf-blank"></span><span class="tf-text">${Fr(it.q)}</span></div>`; });
  let s3=`<div class="sec-title"><span>III. Selección Múltiple · Rellena el círculo de la respuesta correcta</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25 pts</span></div></div><div class="mc-grid${d.materia==='esp'?' mc-una-col':''}">`;
  d.mc.forEach((it,i)=>{ const opts=it.o.map((op,oi)=>`<label class="mc-opt"><span class="mc-circ"></span> ${Fr(op)}</label>`).join(''); s3+=`<div class="mc-item"><div class="mc-q"><span class="qn">${i+11}.</span><span>${Fr(it.q.replace(/\n/g,'<br>'))}</span></div><div class="mc-opts">${opts}</div></div>`; });
  s3+=`</div>`;
  let colL='<div class="pr-col"><div class="pr-head">📘 Términos</div>';
  d.pr.terms.forEach((it,i)=>{ colL+=`<div class="pr-item"><span class="pr-num">${i+16}.</span><span class="pr-line"></span>${Fr(it.term)}</div>`; });
  colL+='</div>';
  let colR='<div class="pr-col"><div class="pr-head">📗 Definiciones</div>';
  d.pr.shuffledDefs.forEach((it,i)=>{ colR+=`<div class="pr-item"><span class="pr-num">${d.pr.letters[i]}.</span>${Fr(it.def)}</div>`; });
  colR+='</div>';
  let s4=`<div class="pr-section"><div class="sec-title"><span>IV. Términos Pareados</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25 pts</span></div></div><div class="pr-grid">${colL}${colR}</div></div>`;
  let pR='';
  pR+=`<div class="p-sec"><div class="p-ttl">I. Completar</div><table class="p-tbl">`;
  d.cp.forEach((it,i)=>{ pR+=`<tr><td class="pn">${i+1}.</td><td class="pa">${Fr(it.a)}</td></tr>`; });
  pR+=`</table></div><div class="p-sec"><div class="p-ttl">II. V o F</div><table class="p-tbl">`;
  d.tf.forEach((it,i)=>{ pR+=`<tr><td class="pn">${i+6}.</td><td class="pa">${it.a?'V':'F'}</td></tr>`; });
  pR+=`</table></div><div class="p-sec"><div class="p-ttl">III. Selección</div><table class="p-tbl">`;
  d.mc.forEach((it,i)=>{ pR+=`<tr><td class="pn">${i+11}.</td><td class="pa">${Fr(it.o[it.a])}</td></tr>`; });
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
const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Prueba de ${M.nombre} · Repaso de Fin de Grado 4º · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:12pt;color:#111;background:#fff;padding:4mm 6mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.35rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;color:${M.acc};}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:${M.acc};margin-top:0.15rem;font-weight:700;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.2rem 0.5rem;margin:0.34rem 0 0.2rem;border-left:4px solid ${M.acc};background:${M.bg};display:flex;justify-content:space-between;align-items:center;color:${M.acc};break-inside:avoid;page-break-inside:avoid;}.qn{font-weight:700;min-width:22px;flex-shrink:0;color:${M.acc};}.tf-row{display:flex;align-items:flex-start;gap:0.3rem;font-size:10.5pt;line-height:1.35;padding:0.16rem 0.2rem;border-bottom:1px solid #eee;break-inside:avoid;page-break-inside:avoid;}.tf-blank{display:inline-block;min-width:42px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.2rem;margin-top:0.2rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.2rem 0.4rem;margin-bottom:0.14rem;break-inside:avoid;page-break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.35;display:flex;gap:0.3rem;margin-bottom:0.12rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.14rem 0.55rem;}.mc-grid.mc-una-col{grid-template-columns:1fr;}.mc-opts{display:grid;grid-template-columns:repeat(2,1fr);gap:0.08rem 0.25rem;margin-left:1.3rem;}.mc-opt{font-size:9.5pt;display:flex;align-items:center;gap:0.22rem;}.mc-circ{display:inline-block;width:11px;height:11px;border:1.4px solid #333;border-radius:50%;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.35;padding:0.14rem 0.2rem;border-bottom:1px solid #eee;break-inside:avoid;page-break-inside:avoid;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:130px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{break-inside:avoid;page-break-inside:avoid;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.12rem 0.5rem;margin-top:0.1rem;}.pr-head{font-size:9pt;font-weight:700;color:${M.acc};margin-bottom:0.12rem;}.pr-item{font-size:10pt;padding:0.13rem 0.32rem;background:${M.bg};border-radius:3px;margin-bottom:0.08rem;display:flex;align-items:center;gap:0.22rem;line-height:1.2;}.pr-num{font-weight:700;color:${M.acc};min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid ${M.acc};padding-bottom:0.35rem;margin-bottom:0.5rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;color:${M.acc};}.p-sub{font-size:9pt;color:${M.acc};font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid ${M.borde};border-radius:4px;padding:0.35rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}.p-ttl{font-size:11pt;font-weight:700;color:${M.acc};border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:${M.acc};}.pa{color:#007a00;font-weight:700;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:${M.acc};font-weight:700;font-style:italic;}.obt-lbl{font-weight:700;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid ${M.acc};height:12px;}.obt-pct{font-weight:700;}.total-row{display:flex;align-items:baseline;justify-content:flex-end;gap:7px;font-size:11pt;color:${M.acc};font-weight:700;font-style:italic;margin-top:0.28rem;padding:0.15rem 0.5rem;background:${M.bg};border-radius:4px;break-inside:avoid;page-break-inside:avoid;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid ${M.acc};}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}${typeof Fr!=="undefined"?Fr.css:""}.fr{font-size:0.8em;margin:0 0.06em;}.fr>b{padding:0 0.13em;}.fr>b.fd{margin-top:0.03em;padding-top:0.03em;}@media print{@page{size:letter portrait;margin:8mm 10mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación de Repaso · Prueba de Fin de Grado 4º · ${M.nombre} · Educación Básica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 4 secciones × 5 preguntas × 5 pts c/u · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✔ PAUTA DOCENTE: Prueba de ${M.nombre} · Repaso de Fin de Grado 4º · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">100 pts | 4 secciones × 5 preguntas × 5 pts | ${M.nombre} · Educación Básica</div></div><div class="p-grid">${pR}</div>
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
  /* La L. del lempira se quita ENTERA, con su punto. Se borraba solo la letra
     y quedaba «.132.37», que parseFloat lee como 0.132: el alumno que
     contestaba «L.132.37», copiando cómo se lo enseña la pauta, salía malo con
     la respuesta buena, y en la sección del dinero eso son varios puntos.
     Se unifican también las tres rayitas que puede teclear un teléfono. */
  const raw = (student || '').toString().replace(/[\u2212\u2013\u2014]/g, '-').replace(/[Ll]\s*\.?/g, '').replace(/[^\d.,\-]/g, '').replace(/,/g, '');
  if (!raw) return false;
  const n = parseFloat(raw);
  return !isNaN(n) && Math.abs(n - expected) < 0.005;
}

/* La prueba operativa de 4º repasa las CUATRO cuentas largas del grado y
   las conversiones, que es lo que la prueba oficial pregunta. No lleva
   fracciones porque en 4º la fracción se identifica en una figura y eso no
   es una cuenta que se pueda escribir en una raya. */

// I. Sumas y restas (5 × 4 = 20 pts): naturales grandes, con reagrupación
function genOpSumas(){
  const items=[];
  for(let k=0;k<5;k++){
    if(k<3){
      const a=_opRint(1200,89000), b=_opRint(900,9800);
      items.push({ text:`Calcula: ${_fmtNum(a)} + ${_fmtNum(b)} =`, ansNum:a+b, ansShow:_fmtNum(a+b) });
    } else {
      // el minuendo va siempre arriba: una resta con resultado negativo no es de 4º
      const menor=_opRint(900,48000), dif=_opRint(500,40000);
      const mayor=menor+dif;
      items.push({ text:`Calcula: ${_fmtNum(mayor)} − ${_fmtNum(menor)} =`, ansNum:dif, ansShow:_fmtNum(dif) });
    }
  }
  return items;
}
// II. Decimales (5 × 4 = 20 pts): en 4º se SUMA y se RESTA con decimales
function genOpDecimales(){
  const items=[];
  const prods=['frijoles','arroz','azúcar','café','maíz','harina'];
  { const a=_opRint(150,9800)/100, b=_opRint(150,9800)/100; const r=Math.round((a+b)*100)/100;
    items.push({ text:`Calcula: ${a.toFixed(2)} + ${b.toFixed(2)} =`, ansNum:r, ansShow:String(r.toFixed(2)) }); }
  { const menor=_opRint(150,4800)/100, dif=_opRint(120,5000)/100; const mayor=Math.round((menor+dif)*100)/100;
    items.push({ text:`Calcula: ${mayor.toFixed(2)} − ${menor.toFixed(2)} =`, ansNum:Math.round(dif*100)/100, ansShow:String(dif.toFixed(2)) }); }
  { const p1=_opRint(500,4500)/100, p2=_opRint(500,4500)/100; const total=Math.round((p1+p2)*100)/100;
    const a=prods[_opRint(0,prods.length-1)]; let b=prods[_opRint(0,prods.length-1)]; if(b===a) b=prods[(prods.indexOf(a)+1)%prods.length];
    items.push({ text:`Doña Rosa compró ${a} por L.${p1.toFixed(2)} y ${b} por L.${p2.toFixed(2)}. ¿Cuánto pagó en total?`, ansNum:total, ansShow:'L.'+total.toFixed(2) }); }
  { const precio=_opRint(1200,8800)/100; const billete=[100,200,500].find(v=>v>precio)||500;
    const vuelto=Math.round((billete-precio)*100)/100;
    items.push({ text:`Un cuaderno cuesta L.${precio.toFixed(2)} y Marta paga con L.${billete}.00. ¿Cuánto le devuelven?`, ansNum:vuelto, ansShow:'L.'+vuelto.toFixed(2) }); }
  { const largo=_opRint(150,400)/10, ancho=_opRint(60,140)/10; const dif=Math.round((largo-ancho)*10)/10;
    items.push({ text:`Un cuaderno mide ${largo.toFixed(1)} cm de largo y ${ancho.toFixed(1)} cm de ancho. ¿Cuántos cm es más grande el largo que el ancho?`, ansNum:dif, ansShow:dif.toFixed(1)+' cm' }); }
  return items;
}
// III. Multiplicar y dividir (5 × 4 = 20 pts): las dos cuentas largas de 4º
function genOpMultDiv(){
  const items=[];
  for(let k=0;k<3;k++){
    const a=_opRint(120,9600), b=k===0?_opRint(3,9):_opRint(11,99);
    items.push({ text:`Calcula: ${_fmtNum(a)} × ${b} =`, ansNum:a*b, ansShow:_fmtNum(a*b) });
  }
  for(let k=0;k<2;k++){
    // se arma desde el resultado para que la división sea exacta
    const cociente=_opRint(30,900), divisor=k===0?_opRint(3,9):_opRint(11,60);
    items.push({ text:`Calcula: ${_fmtNum(cociente*divisor)} ÷ ${divisor} =`, ansNum:cociente, ansShow:_fmtNum(cociente) });
  }
  return items;
}
// IV. Problemas de la vida real (3 × 10 = 30 pts)
function genOpProblemas(){
  const items=[];
  { const cajas=_opRint(12,90), porCaja=_opRint(3,12);
    items.push({ text:`Una caja trae ${porCaja} lápices. ¿Cuántos lápices hay en ${cajas} cajas?`, ansNum:cajas*porCaja, ansShow:`${_fmtNum(cajas*porCaja)} lápices: ${cajas} × ${porCaja}` }); }
  { const libras=_opRint(5,25), precioLibra=_opRint(6,40);
    items.push({ text:`Carlos compró ${libras} libras de frijoles y pagó L.${_fmtNum(libras*precioLibra)}. ¿Cuánto vale la libra?`, ansNum:precioLibra, ansShow:`L.${precioLibra}: ${_fmtNum(libras*precioLibra)} ÷ ${libras}` }); }
  { const tipo=_opRint(0,2);
    if(tipo===0){ const m=_opRint(3,45); items.push({ text:`El borde de una cancha mide ${m} metros. ¿Cuántos centímetros mide?`, ansNum:m*100, ansShow:`${_fmtNum(m*100)} cm: ${m} × 100` }); }
    else if(tipo===1){ const largo=_opRint(20,60), ancho=_opRint(10,40);
      items.push({ text:`Un campo mide ${largo} m de largo y ${ancho} m de ancho. ¿Cuánto mide su perímetro?`, ansNum:2*(largo+ancho), ansShow:`${2*(largo+ancho)} m: (${largo} + ${ancho}) × 2` }); }
    else { const h=_opRint(7,10), min=[10,15,20,25,40][_opRint(0,4)]; let dur=[20,30,40,45,50][_opRint(0,4)];
      /* Si la hora final cayera en punto (9:20 + 40 = 10:00) la respuesta sería
         «0 minutos»: el alumno que acertó la hora deja la raya en blanco creyendo
         que no hay nada que escribir, y la casilla vacía se califica MAL. Se le
         añaden cinco minutos a la duración —nunca vuelve a dar en punto— en vez
         de volver a sortear, para no mover el azar de las formas ya impresas. */
      if((min+dur)%60===0) dur+=5;
      const t=h*60+min+dur, hf=Math.floor(t/60), mf=t%60;
      items.push({ text:`Luis empieza a estudiar a las ${h}:${String(min).padStart(2,'0')} am y estudia ${dur} minutos. ¿A qué hora termina? Escribe solo los minutos de la hora final.`, ansNum:mf, ansShow:`${hf}:${String(mf).padStart(2,'0')} am (se escribe ${mf})` }); }
  }
  return items;
}
// V. Reto de dos pasos (1 × 10 = 10 pts): dos operaciones seguidas
function genOpMeta(){
  const precio=_opRint(12,45), lleva=_opRint(150,600);
  const cuantos=Math.floor(lleva/precio), sobra=lleva-cuantos*precio;
  if(cuantos<2||sobra===0) return genOpMeta();
  return [{ text:`Un cuaderno cuesta L.${precio} y Josué lleva L.${lleva}. ¿Cuántos cuadernos puede comprar y cuánto le sobra? Escribe cuánto le SOBRA.`, ansNum:sobra, ansShow:`L.${sobra}: compra ${cuantos} cuadernos (${cuantos} × ${precio} = ${_fmtNum(cuantos*precio)}) y le sobran ${sobra}` }];
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
  const frItems = genOpSumas();
  const s1 = document.createElement('div');
  s1.innerHTML = '<div class="eval-section-title">I. Sumas y restas <span class="eval-pts">20 pts · 4 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel básico. Escribe los números uno debajo del otro, alineados por la derecha, y no olvides lo que llevas.</p>';
  frItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${Fr(it.text)}</span><input class="eval-cp-input" type="text" data-fr="${i}" autocomplete="off"></div><div class="eval-answer">${Fr(it.ansShow)}</div><div class="eval-item-feedback" id="evalFbFr${i}" aria-live="polite"></div>`;
    s1.appendChild(d);
  });
  out.appendChild(s1);
  const deItems = genOpDecimales();
  const s2 = document.createElement('div');
  s2.innerHTML = '<div class="eval-section-title">II. Decimales <span class="eval-pts">20 pts · 4 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel básico. Alinea el PUNTO uno debajo del otro antes de sumar o restar. Si a un número le faltan cifras, complétalo con ceros.</p>';
  deItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${Fr(it.text)}</span><input class="eval-cp-input" type="text" data-de="${i}" autocomplete="off" inputmode="decimal"></div><div class="eval-answer">${Fr(it.ansShow)}</div><div class="eval-item-feedback" id="evalFbDe${i}" aria-live="polite"></div>`;
    s2.appendChild(d);
  });
  out.appendChild(s2);
  const teItems = genOpMultDiv();
  const s3 = document.createElement('div');
  s3.innerHTML = '<div class="eval-section-title">III. Multiplicar y dividir <span class="eval-pts">20 pts · 4 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel intermedio. Al multiplicar por dos cifras, el segundo renglón se corre un lugar a la izquierda. Comprueba cada división multiplicando.</p>';
  teItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${Fr(it.text)}</span><input class="eval-cp-input" type="text" data-te="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${Fr(it.ansShow)}</div><div class="eval-item-feedback" id="evalFbTe${i}" aria-live="polite"></div>`;
    s3.appendChild(d);
  });
  out.appendChild(s3);
  const prItems = genOpProblemas();
  const s4 = document.createElement('div');
  s4.innerHTML = '<div class="eval-section-title">IV. Problemas de la vida real <span class="eval-pts">30 pts · 10 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel avanzado. Resuelve en tu cuaderno con la operación que toque y escribe la respuesta numérica.</p>';
  prItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${Fr(it.text)}</span><input class="eval-cp-input" type="text" data-pr="${i}" autocomplete="off" inputmode="decimal"></div><div class="eval-answer">${Fr(it.ansShow)}</div><div class="eval-item-feedback" id="evalFbPr${i}" aria-live="polite"></div>`;
    s4.appendChild(d);
  });
  out.appendChild(s4);
  const meItems = genOpMeta();
  const s5 = document.createElement('div');
  s5.innerHTML = '<div class="eval-section-title">V. Reto de dos pasos <span class="eval-pts">10 pts</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel desafío. Este problema lleva DOS operaciones: primero una y con ese resultado la otra.</p>';
  meItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${Fr(it.text)}</span><input class="eval-cp-input" type="text" data-me="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${Fr(it.ansShow)}</div><div class="eval-item-feedback" id="evalFbMe${i}" aria-live="polite"></div>`;
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
  if (res) { res.className = 'eval-auto-result ' + (total >= 70 ? 'eval-auto-pass' : 'eval-auto-risk'); res.innerHTML = `<strong>Resultado: ${total}/100 pts</strong><br><span>Sumas y restas: ${det.fr}/20 · Decimales: ${det.de}/20 · Multiplicar y dividir: ${det.te}/20 · Problemas: ${det.pr}/30 · Reto: ${det.me}/10</span>`; }
  if (total >= 70) { pts(8); showToast('🎯 Prueba operativa calificada: ' + total + '/100'); }
  else showToast('🧮 Prueba operativa: ' + total + '/100. Revisa los ítems marcados.');
}

function printEvalOp() {
  if (!window._evalOpData) { showToast('⚠️ Genera una prueba operativa primero'); return; }
  sfx('click');
  const forma = window._currentEvalOpForm || 1; const d = window._evalOpData;
  const filaTabla = (items) => `<table class="rnd-tbl"><tr><th>#</th><th>Ejercicio</th><th>Respuesta</th></tr>${items.map((it, i) => `<tr><td>${i+1}</td><td>${Fr(it.text)}</td><td></td></tr>`).join('')}</table>`;
  let s1 = `<div class="sec-title"><span>I. Sumas y restas</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Alinea los números por la derecha y cuida lo que llevas. 4 pts c/u.</p>${filaTabla(d.frItems)}`;
  let s2 = `<div class="sec-title"><span>II. Decimales</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">El punto va debajo del punto; completa con ceros si hace falta. 4 pts c/u.</p>${filaTabla(d.deItems)}`;
  let s3 = `<div class="sec-title"><span>III. Multiplicar y dividir</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">El segundo renglón de la multiplicación se corre un lugar. 4 pts c/u.</p>${filaTabla(d.teItems)}`;
  let s4 = `<div class="sec-title"><span>IV. Problemas de la vida real</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 30 pts</span></div></div><p class="opx-instr">Resuelve mostrando tu procedimiento y escribe la respuesta. 10 pts c/u.</p>`;
  d.prItems.forEach((it, i) => { s4 += `<div class="opx-print-row"><span class="qn">${i+1}.</span><span class="prb-text">${Fr(it.text)}</span><span class="opx-blank"></span></div><div class="opx-space"></div>`; });
  let s5 = `<div class="sec-title"><span>V. Reto de dos pasos</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10 pts</span></div></div>`;
  d.meItems.forEach((it, i) => { s5 += `<div class="opx-print-row"><span class="qn">${i+1}.</span><span class="prb-text">${Fr(it.text)}</span><span class="opx-blank"></span></div><div class="opx-space"></div>`; });
  let pR = '';
  pR += `<div class="p-sec"><div class="p-ttl">I. Sumas y restas</div><table class="p-tbl">${d.frItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${Fr(it.ansShow)}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">II. Decimales</div><table class="p-tbl">${d.deItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${Fr(it.ansShow)}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">III. Multiplicar y dividir</div><table class="p-tbl">${d.teItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${Fr(it.ansShow)}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">IV. Problemas</div><table class="p-tbl">${d.prItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${Fr(it.ansShow)}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec" style="grid-column:1/-1;"><div class="p-ttl">V. Reto de dos pasos</div><table class="p-tbl">${d.meItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${Fr(it.ansShow)}</td></tr>`).join('')}</table></div>`;
  const doc = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Prueba Operativa · Repaso de Fin de Grado 4º · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11.5pt;color:#111;background:#fff;padding:4mm 6mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.35rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;color:#1565c0;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:#1565c0;margin-top:0.15rem;font-weight:700;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.45rem 0 0.2rem;border-left:4px solid #1565c0;background:#e3f2fd;display:flex;justify-content:space-between;align-items:center;color:#1565c0;break-inside:avoid;page-break-inside:avoid;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:#1565c0;font-weight:700;font-style:italic;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #1565c0;height:12px;}.qn{font-weight:700;min-width:20px;display:inline-block;color:#1565c0;flex-shrink:0;}.opx-instr{font-size:9pt;color:#555;margin-bottom:0.22rem;}.opx-blank{display:inline-block;width:80px;flex:none;border-bottom:1.5px solid #111;min-height:13px;margin-left:0.3rem;}.opx-print-row{display:flex;align-items:baseline;gap:0.4rem;font-size:10pt;padding:0.16rem 0.1rem;border-bottom:1px dotted #ddd;break-inside:avoid;page-break-inside:avoid;}.opx-space{height:22px;border-bottom:1px dotted #ccc;margin:0 0 2px 20px;}.prb-text{flex:1;line-height:1.35;}.rnd-tbl{width:100%;border-collapse:collapse;font-size:9.5pt;margin-top:0.15rem;}.rnd-tbl th,.rnd-tbl td{border:1px solid #bbb;padding:0.1rem 0.35rem;text-align:left;}.rnd-tbl th{background:#e3f2fd;color:#1565c0;font-size:8.5pt;}.rnd-tbl tr{break-inside:avoid;page-break-inside:avoid;}.total-row{display:flex;align-items:baseline;justify-content:flex-end;gap:7px;font-size:11pt;color:#1565c0;font-weight:700;font-style:italic;margin-top:0.45rem;padding:0.2rem 0.5rem;background:#e3f2fd;border-radius:4px;}.total-row .obt-line{min-width:80px;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #1565c0;padding-bottom:0.3rem;margin-bottom:0.5rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;color:#1565c0;}.p-sub{font-size:9pt;color:#1565c0;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #cce0ff;border-radius:4px;padding:0.35rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}.p-ttl{font-size:11pt;font-weight:700;color:#1565c0;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#1565c0;}.pa{color:#007a00;font-weight:700;font-family:'Courier New',monospace;}.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}${typeof Fr!=="undefined"?Fr.css:""}.fr{font-size:0.8em;margin:0 0.06em;}.fr>b{padding:0 0.13em;}.fr>b.fd{margin-top:0.03em;padding-top:0.03em;}@media print{@page{size:letter portrait;margin:8mm 10mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Examen de Matemáticas: Prueba Operativa · Repaso de Fin de Grado 4º · Educación Básica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 pts · I: 20 · II: 20 · III: 20 · IV: 30 · V: 10 · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✔ PAUTA: Prueba Operativa · Repaso de Fin de Grado 4º · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">100 pts · Matemáticas · Educación Básica</div></div><div class="p-grid">${pR}</div></div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div></body></html>`;
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
  const txt=`${stars} CONSTANCIA DE LOGRO ${stars}\n\n📚 Misión: Prueba de Fin de Grado 4º\n👤 Estudiante: ${name}\n📊 Progreso: ${pct}% completado\n⭐ XP obtenido: ${xp} de ${MXP}${achText?'\n\n🏆 Logros desbloqueados:\n'+achText:''}\n\n${msg}\n\n📅 ${date}\n🏠 Proyecto Educativo M.E.T.A.S\n🌐 policastsapien.com`;
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
