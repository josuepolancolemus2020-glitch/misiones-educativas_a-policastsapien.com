// Misión Prueba de Fin de Grado: 5º Grado · Repaso General (Español y Matemáticas)
// Etapa 2 de la Ruta de la Meta: repasa el temario completo de la Prueba de
// Fin de Grado de 5º (fracciones y números mixtos, decimales, divisores,
// factores primos, m.c.m. y M.C.D., números romanos, área y circunferencia
// + comprensión lectora, vocabulario, tipos de texto, la carta y el anuncio).
// Sale de la misión de 6º: se cambia el CONTENIDO, nunca el motor. Lo que se
// cambia son los VEINTE bancos que ve el alumno, y las dos pruebas que se
// imprimen son parte de ellos: un banco heredado de 6º no se nota en pantalla,
// se nota en las 43 fotocopias que el maestro ya repartió.
// Lo que NO es de 5º y por eso no está EN NINGÚN banco: el volumen, el
// promedio, los viajes con velocidad y multiplicar o dividir fracciones, que
// son de 6º; en su sitio entraron los números romanos, los divisores y los
// factores primos, el círculo y sus partes, los polígonos por su número de
// lados, el área, la circunferencia y la recta numérica, que son lo que la
// prueba de 5º pregunta. Al tocar un banco se vuelve a comprobar esta lista.

// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
function compartirMision() {
    const url = window.location.href;
    const texto = `🎓 *Misión Asignada: Prueba de Fin de Grado 5º* 🎓\n\nRepasa Español y Matemáticas de TODO el año: fracciones y números mixtos, decimales, m.c.m., números romanos, área y circunferencia, lectura y escritura. 🏆\n\nDesbloquea *todos los logros* y puedes poner *tus datos* para que tu maestro observe todos tus logros. 📋\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;
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
// Los divisores y los factores primos de un número: los pide la prueba de 5º
// y los usan tanto el generador de tareas como la prueba operativa.
function _divisoresDe(n){ const d=[]; for(let i=1;i<=n;i++) if(n%i===0) d.push(i); return d; }
function _factoresPrimos(n){ const f=[]; let p=2; while(n>1){ while(n%p===0){ f.push(p); n/=p; } p++; } return f; }
/* Un decimal escrito a partir de ENTEROS, nunca de un cálculo con comas.
   5.123 × 85 en coma flotante da 435.45500000000004: el examen impreso
   enseñaría ese número y el alumno que hizo bien la cuenta lo daría por malo.
   Aquí se multiplica 5123 × 85 y el punto se coloca contando cifras, que es
   además lo que se le pide a él. */
function _decStr(entero, dec){
  const neg=entero<0, s=String(Math.abs(entero)).padStart(dec+1,'0');
  return (neg?'-':'')+s.slice(0,s.length-dec)+'.'+s.slice(s.length-dec);
}
// Quita los ceros que sobran a la derecha: 62.80 se escribe 62.8, 100.00 es 100
function _decTrim(s){ return s.indexOf('.')<0 ? s : s.replace(/0+$/,'').replace(/\.$/,''); }
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
const SAVE_KEY = 'repaso_fin_grado_5to_v1';
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
  {w:'Fracciones equivalentes',a:'🍕 son las que valen <strong>lo mismo</strong> aunque se escriban distinto: 2/3 y 8/12. se consiguen multiplicando <strong>arriba y abajo</strong> por el mismo número.'},
  {w:'Tema y detalle',a:'🎯 el <strong>tema</strong> es de qué trata <strong>todo</strong> el texto; el <strong>detalle</strong> es un dato que sale una vez. si la respuesta solo sirve para un renglón, es detalle.'},
  /* La prueba pide la conversión en LOS DOS SENTIDOS (mixto a impropia y
     al revés), y el camino de vuelta es el que se olvida: en la tarjeta
     van juntos para que el alumno vea que es la misma cuenta al revés. */
  {w:'Número mixto',a:'🔢 lleva un <strong>entero</strong> y una fracción: 3 1/2. para volverlo impropia: 3 × 2 + 1 = 7, o sea 7/2. al revés se divide: 22/7 son 3 enteros y sobra 1, o sea 3 1/7.'},
  {w:'Frase hecha',a:'🗣️ un grupo de palabras que <strong>junto</strong> significa otra cosa: «se le fue el alma a los pies» es <strong>se asustó mucho</strong>. no se entiende palabra por palabra.'},
  {w:'Divisores de un número',a:'✂️ los que caben en él <strong>exacto</strong>, sin que sobre nada. los divisores de 36 son 1, 2, 3, 4, 6, 9, 12, 18 y 36.'},
  {w:'Descripción',a:'🖼️ dice <strong>cómo es</strong> algo o alguien: su tamaño, su color, lo que tiene. describir el aula es contar de qué color son las paredes y cuántas ventanas tiene.'},
  {w:'Factores primos',a:'🧱 todo número se arma multiplicando <strong>primos</strong>: 42 = 2 × 3 × 7. se va dividiendo entre 2, 3, 5, 7… hasta llegar a 1.'},
  {w:'Anuncio',a:'📣 avisa u ofrece algo en <strong>pocas palabras</strong>: qué, cuándo, dónde y a quién buscar. lo primero que tiene que lograr es <strong>llamar la atención</strong>.'},
  {w:'Área del triángulo',a:'📐 <strong>base × altura ÷ 2</strong>. si la base mide 6 m y la altura 5 m: 6 × 5 = 30, y 30 entre 2 son 15 m².'},
  {w:'Partes de la carta',a:'✉️ lugar y fecha, <strong>saludo</strong>, cuerpo, <strong>despedida</strong> y firma. sin la firma, quien la recibe no sabe quién le escribió.'},
  {w:'Longitud de la circunferencia',a:'⭕ es lo que mide el contorno del círculo: <strong>3.14 × diámetro</strong>. con 30 cm de diámetro mide 94.2 cm. si te dan el radio, dóblalo primero.'},
  {w:'La causa',a:'❓ es el <strong>porqué</strong> de lo que pasó. se busca preguntando «¿por qué?», y muchas veces la anuncia la palabra <strong>porque</strong>.'},
  /* El reverso de las flashcards va forzado a minúscula por el CSS de la
     misión (`#fcA{text-transform:lowercase !important}`), y esta es la
     única tarjeta cuyo contenido MUERE en minúscula: «xi es 11» le enseña
     al alumno un numeral romano que no existe. El span lleva su propia
     declaración, y una declaración propia gana sobre lo que se hereda,
     aunque lo heredado venga con !important. Los numerales van separados
     con «·» a propósito: dentro del span, una «y» también saldría en
     mayúscula. */
  {w:'Números romanos',a:'🏛️ <span class="rom" style="text-transform:uppercase !important">I · V · X</span> valen 1, 5 y 10. la letra menor <strong>detrás</strong> suma y <strong>delante</strong> resta: <span class="rom" style="text-transform:uppercase !important">XIV</span> es 14 y <span class="rom" style="text-transform:uppercase !important">XL</span> es 40.'},
  {w:'Instructivo',a:'🧾 dice <strong>qué hay que hacer</strong> y en qué orden. los pasos no se cambian de sitio: primero se lava, después se pica y al final se cocina.'}
];
let fcIdx=0;
function upFC(){ document.getElementById('fcInner').classList.remove('flipped'); document.getElementById('fcW').textContent=fcData[fcIdx].w; document.getElementById('fcA').innerHTML=Fr(fcData[fcIdx].a); document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length; }
function flipCard(){ sfx('flip'); document.getElementById('fcInner').classList.toggle('flipped'); if(!xpTracker.fc.has(fcIdx)){ xpTracker.fc.add(fcIdx); pts(1); } if(xpTracker.fc.size===fcData.length){ fin('s-flash'); unlockAchievement('flash_master'); } }
function nextFC(){ sfx('click'); fcIdx=(fcIdx+1)%fcData.length; upFC(); }
function prevFC(){ sfx('click'); fcIdx=(fcIdx-1+fcData.length)%fcData.length; upFC(); }

// ===================== JUEGO: MEMORIA DEL REPASO =====================
const memoPairs=[
  {id:'romano',t:'XXIV en números romanos',d:'🏛️ vale 24: las dos X son 20 y IV son 4'},
  {id:'anuncio',t:'Anuncio',d:'📣 avisa u ofrece algo: qué, cuándo, dónde y a quién buscar'},
  {id:'mcd',t:'M.C.D. de 24 y 60',d:'✂️ es 12: el número más grande que cabe exacto en los dos'},
  {id:'frase',t:'Frase hecha',d:'🗣️ juntas dicen otra cosa: costar un ojo de la cara es ser carísimo'},
  {id:'circunferencia',t:'Longitud de la circunferencia',d:'⭕ C = 3.14 × diámetro'},
  {id:'carta',t:'Partes de la carta',d:'✉️ lugar y fecha, saludo, cuerpo, despedida y firma'}
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
  /* Sumar y restar fracciones es el bloque más pesado de la prueba de 5º
     (cinco de los treinta y tres ítems) y es lo que menos se practica:
     por eso la suma abre el quiz y la resta está en «Completa». Las dos
     son de distinto denominador, que es donde se pierde el punto. */
  {q:'Doña Berta llenó 1/4 de la canasta con naranjas y 1/3 con mandarinas. ¿Qué parte de la canasta llenó?',o:['a) 2/7','b) 2/12','c) 7/12','d) 12/7'],c:2,feedback:'Los cuartos y los tercios no se juntan como están: primero se busca el denominador común, que aquí es 12. Entonces 1/4 son 3/12 y 1/3 son 4/12, y 3 + 4 dan 7/12. El 2/7 sale de sumar arriba y abajo, que no se hace.'},
  {q:'Un texto explica que los huesos sostienen el cuerpo, que protegen el corazón y los pulmones, y que se unen unos con otros en las coyunturas. ¿Cuál es el tema del texto?',o:['a) Las coyunturas del codo','b) El corazón y los pulmones','c) La leche y el calcio','d) Los huesos del cuerpo humano'],c:3,feedback:'El tema abarca el texto entero. Las coyunturas y los pulmones sí aparecen, pero solo en un pedacito; la leche ni se menciona.'},
  {q:'Doña Rita cortó un rollo de 46.8 metros de manguera en 6 pedazos iguales. ¿Cuánto mide cada pedazo?',o:['a) 78 metros','b) 7.8 metros','c) 0.78 metros','d) 8.7 metros'],c:1,feedback:'46.8 entre 6 da 7.8 metros. Se comprueba multiplicando: 7.8 × 6 = 46.8.'},
  {q:'En el texto se lee: «Rosita no pegó el ojo en toda la noche pensando en el examen». ¿Qué significa esa frase?',o:['a) Que se le cerró un ojo','b) Que no durmió nada','c) Que se golpeó al levantarse','d) Que estudió con un solo ojo'],c:1,feedback:'Es una frase hecha: junta significa otra cosa. Leída palabra por palabra no se entiende; la pista está en «en toda la noche».'},
  /* «Por primera vez» no es adorno: sin esa palabra, cualquier múltiplo
     común (24, 36, 54…) también sería una respuesta buena y la pregunta
     tendría dos claves. Y ninguna de las opciones falsas es múltiplo de
     los dos números, para que no se cuele una segunda respuesta correcta. */
  {q:'Doña Petrona hace pan cada 6 días y su vecina hace rosquillas cada 9. Si hoy hicieron las dos, ¿dentro de cuántos días les vuelve a tocar el mismo día por primera vez?',o:['a) 18 días','b) 15 días','c) 3 días','d) 12 días'],c:0,feedback:'Cuando dos cosas se repiten y se busca cuándo caen juntas, se usa el m.c.m. Los múltiplos de 6 son 6, 12, 18… y los de 9 son 9, 18… El primero que comparten es 18. Los 15 salen de sumar 6 + 9, y el 3 es el M.C.D., que sirve para repartir, no para coincidir.'},
  {q:'Lee: «El león macho tiene una melena espesa que le tapa el cuello, y su rugido se oye a kilómetros de distancia». ¿Qué hace principalmente ese texto?',o:['a) Cuenta una historia con principio y final','b) Da los pasos para hacer algo','c) Invita a comprar algo','d) Dice cómo es el león'],c:3,feedback:'Describir es decir cómo es algo: su melena, su rugido. Ese texto no cuenta qué pasó, no da pasos y no ofrece nada.'},
  {q:'Un solar con forma de triángulo mide 9 metros de base y 4 metros de altura. ¿Cuál es su área?',o:['a) 13 m²','b) 18 m²','c) 36 m²','d) 26 m²'],c:1,feedback:'Área del triángulo = base × altura ÷ 2. Aquí 9 × 4 = 36, y 36 entre 2 son 18 m². Los 36 m² serían el área de un rectángulo de esas medidas.'},
  {q:'Lee: «Los gansos vuelan en fila y van cambiando de puesto: el que va adelante rompe el viento y se cansa primero». ¿Por qué van cambiando de puesto?',o:['a) Para no perderse en el camino','b) Porque les gusta jugar en el aire','c) Para que el que iba adelante descanse','d) Para verse más grandes'],c:2,feedback:'El texto no lo dice con esas palabras, pero deja la pista: el de adelante se cansa primero. Si cambian de puesto, el cansado pasa atrás a descansar.'},
  {q:'El contorno de un jardín con forma de hexágono regular mide 96 centímetros. ¿Cuánto mide cada lado?',o:['a) 16 cm','b) 12 cm','c) 576 cm','d) 90 cm'],c:0,feedback:'El hexágono regular tiene 6 lados iguales, así que el contorno se divide entre 6: 96 entre 6 son 16 cm. Se comprueba: 16 × 6 = 96.'}
];
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
  titulo:'El elefante de la escuela',
  texto:'En una aldea de Comayagua había un bus viejo tirado junto a la cancha. Le faltaban las llantas, el motor estaba comido por el óxido y adentro crecía el monte. Los niños lo llamaban el elefante, porque era grande, azul y no se movía de ahí.\n\nUn día el director pidió permiso para llevárselo. Entre padres y maestros lo empujaron hasta el patio de la escuela. Le sacaron el monte, le lavaron los vidrios y le pintaron por fuera un mapa de Honduras. Adentro, en lugar de asientos, clavaron tablas y las llenaron de libros: unos los mandó la Secretaría de Educación y otros los trajeron las familias de sus casas.\n\nDesde entonces, a la hora del recreo el elefante se llena. Hay niños leyendo en el pasillo, en el asiento del chofer y hasta en las gradas de la puerta. Cuando suena la campana, la maestra tiene que asomarse dos veces para que salgan.\n\nEl bus nunca volvió a caminar, pero ahora lleva a los niños más lejos que antes.',
  preguntas:[
    {q:'Según el texto, ¿qué le pintaron al bus por fuera?',o:['a) El nombre de la escuela.','b) Un mapa de Honduras.','c) Una cancha de futbol.','d) Un elefante azul.'],a:1,exp:'El texto lo dice tal cual: «le pintaron por fuera un mapa de Honduras». Lo del elefante es el apodo que le pusieron los niños, no un dibujo.'},
    {q:'«Adentro crecía el monte». ¿Qué es el monte en esa oración?',o:['a) Un cerro alto y con neblina.','b) Un montón de libros amontonados.','c) La pintura vieja del bus.','d) La hierba y la maleza que nacen solas.'],a:3,exp:'La misma palabra sirve para dos cosas y el texto decide cuál: si crece adentro de un bus abandonado y después lo sacan, es maleza, no un cerro.'},
    {q:'¿Por qué la maestra tiene que asomarse dos veces cuando suena la campana?',o:['a) Porque a los niños les cuesta dejar la lectura.','b) Porque desde el bus no se oye la campana.','c) Porque tiene que guardar los libros bajo llave.','d) Porque el bus queda muy lejos del aula.'],a:0,exp:'El texto no lo explica, pero junta las pistas: en el recreo el bus se llena de niños leyendo, y a la primera llamada no salen.'},
    {q:'¿De qué trata principalmente el texto?',o:['a) De los recreos de una escuela de Comayagua.','b) De cómo se le arregla el motor a un bus viejo.','c) De un bus viejo convertido en la biblioteca de la escuela.','d) De un mapa de Honduras pintado en la cancha.'],a:2,exp:'Todo el texto va de eso: el bus tirado, el traslado, los libros adentro y lo que pasó después. El recreo es una parte de esa historia, no el tema.'}
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
    label:['Primos','Compuestos'], headA:'🔒 PRIMO: solo se divide entre 1 y él mismo', headB:'🧱 COMPUESTO: se divide entre más números', colA:'primo', colB:'compuesto',
    words:[{w:'7',t:'primo'},{w:'15',t:'compuesto'},{w:'13',t:'primo'},{w:'21',t:'compuesto'},{w:'11',t:'primo'},{w:'22',t:'compuesto'},{w:'23',t:'primo'},{w:'35',t:'compuesto'}]
  },
  {
    label:['Área','Perímetro'], headA:'🟦 ÁREA: lo que cubre por dentro', headB:'🚧 PERÍMETRO: lo que mide el contorno', colA:'area', colB:'perimetro',
    words:[{w:'Cuánta pintura cubre el piso del aula',t:'area'},{w:'Cuánto alambre se necesita para cercar el solar',t:'perimetro'},{w:'Cuánto zacate cubre la cancha',t:'area'},{w:'Cuánta cinta rodea el marco de la foto',t:'perimetro'},{w:'Cuántas baldosas caben en el patio',t:'area'},{w:'Cuántos metros de malla dan la vuelta al corral',t:'perimetro'},{w:'Cuánto plástico tapa la mesa entera',t:'area'},{w:'Cuánto listón bordea el mantel',t:'perimetro'}]
  },
  {
    label:['Carta','Anuncio'], headA:'✉️ CARTA: se le escribe a una persona', headB:'📣 ANUNCIO: se escribe para muchos', colA:'carta', colB:'anuncio',
    words:[{w:'Querida tía Marta, le escribo desde La Ceiba',t:'carta'},{w:'Se rifa un saco de frijoles, boletos en la pulpería',t:'anuncio'},{w:'Espero que al recibir esta se encuentre bien',t:'carta'},{w:'Torneo de futbol el sábado, inscriba su equipo',t:'anuncio'},{w:'Reciba un abrazo de su sobrino Elmer',t:'carta'},{w:'Vacunación gratis de perros el jueves en la escuela',t:'anuncio'},{w:'Comayagua, 12 de agosto. Estimada maestra:',t:'carta'},{w:'Se reparan zapatos y mochilas frente al mercado',t:'anuncio'}]
  },
  /* La prueba de 5º contrasta la DESCRIPCIÓN con el INSTRUCTIVO («¿cómo
     era la montaña?», «¿qué se debe hacer al…?»); la narración es de
     otro grado y ocupaba aquí cuatro huecos que no se evalúan. */
  {
    label:['Describe','Instruye'], headA:'🖼️ DESCRIBE: dice cómo es algo', headB:'🧾 INSTRUYE: dice qué hacer y en qué orden', colA:'describe', colB:'instruye',
    words:[{w:'La montaña es alta, verde y casi siempre con neblina',t:'describe'},{w:'Enjuaga el pincel antes de cambiar de color',t:'instruye'},{w:'El río es ancho, hondo y de agua bien fría',t:'describe'},{w:'Dobla la hoja por la mitad y marca bien el filo',t:'instruye'},{w:'Las ruinas son de piedra gris y están llenas de figuras',t:'describe'},{w:'Amarra la cuerda al balde antes de bajarlo al pozo',t:'instruye'},{w:'El gallo tiene la cresta roja y la cola larga',t:'describe'},{w:'Espera una hora a que seque la pintura',t:'instruye'}]
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
/* Cuatro de Matemáticas y cuatro de Español, alternadas. Aquí NO entran
   fracciones: la oración se pinta palabra por palabra con textContent, así
   que un «7/5» saldría plano donde el resto de la misión lo apila. */
const idData=[
  {s:['Doña','Tere','reparó','el','techo','de','la','cocina'],c:2,art:'El sinónimo de arregló'},
  {s:['En','el','cartel','del','aula','hay','un','pentágono','un','eneágono','y','un','decágono'],c:12,art:'El polígono de diez lados'},
  {s:['Llegamos','al','río','aunque','venía','crecido'],c:3,art:'El conector que expresa oposición'},
  {s:['En','la','iglesia','están','grabados','XL','XXX','XIV','y','VII'],c:7,art:'El número romano que vale 14'},
  {s:['Las','montañas','de','Ocotepeque','amanecen','cubierto','de','neblina'],c:5,art:'La palabra que rompe la concordancia'},
  {s:['Los','precios','son','4.5','4.05','y','4.55','lempiras'],c:6,art:'El precio más alto'},
  {s:['Todos','los','días','mi','tío','madruga','para','ordeñar'],c:5,art:'La palabra que significa levantarse muy temprano'},
  {s:['Los','números','del','cartel','son','7','9','12','y','15'],c:7,art:'El único que se divide exacto entre 4'}
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
  {s:'Para pasar un número mixto a fracción impropia, multiplico el entero por el denominador y le ___ el numerador.',opts:['sumo','resto','divido'],c:0},
  {s:'Si a 3/4 de litro le quito 1/2 litro, me quedan ___.',opts:['2/2','1/4','1/2'],c:1},
  {s:'Al multiplicar 4.6 por 10, el punto se corre un lugar y el resultado es ___.',opts:['0.46','460','46'],c:2},
  {s:'La cancha quedó llena de lodo; ___, el partido se jugó igual.',opts:['sin embargo','por eso','además'],c:0},
  {s:'Para hallar el área de un triángulo multiplico la base por la altura y luego ___.',opts:['multiplico por dos','divido entre dos','sumo dos'],c:1},
  {s:'Una carta termina con la despedida y la ___ de quien escribe.',opts:['moraleja','portada','firma'],c:2},
  {s:'La longitud de la circunferencia se halla multiplicando 3.14 por el ___.',opts:['diámetro','radio','área'],c:0},
  {s:'Un anuncio tiene que decir qué se ofrece, cuándo y ___.',opts:['la moraleja','dónde','el final del cuento'],c:1}
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
/* Tres predicciones: dos de Matemáticas y una de Español, como en 6º. Cada
   una trae su explorador (`explore`), y los tres están escritos para ESTAS
   preguntas: un explorador que enseñe otros números que los de la pregunta
   que el alumno está mirando es peor que no tener pista. */
const prediceData = [
  {
    q: 'Sin dibujar nada en el cuaderno: ¿qué fracción impropia vale lo mismo que el número mixto 4 3/8?',
    opts: ['7/8', '35/8', '43/8'],
    correct: 1,
    feedback: '¡Correcto! Cada entero son 8 octavos, así que los 4 enteros son 4 × 8 = 32 octavos. Con los 3 octavos que ya venían suman 35: queda 35/8.',
    wrongFeedback: 'La respuesta es 35/8: los 4 enteros valen 32 octavos, con los 3 sueltos dan 35, y abajo sigue el 8. El 7/8 sale de sumar 4 + 3 y el 43/8 de pegar las dos cifras una al lado de la otra.',
    explore: 'mixto'
  },
  {
    q: '«La escuela de la aldea tiene un huerto. En él los alumnos siembran rábanos, cilantro y tomate. Con lo que da el huerto, la cocinera prepara la merienda, y lo que sobra se vende para comprar más semillas.» ¿De qué trata el texto?',
    opts: ['De los rábanos y el cilantro', 'De la merienda que prepara la cocinera', 'Del huerto de la escuela y de todo lo que sale de él'],
    correct: 2,
    feedback: '¡Muy bien! Todo lo que se cuenta nace del huerto: lo que siembran, lo que se comen y lo que venden. Quítalo y ya no queda texto.',
    wrongFeedback: 'La respuesta es el huerto y todo lo que sale de él. Los rábanos son una parte de lo sembrado y la merienda es una de las cosas que se hacen con la cosecha: las dos dependen del huerto, así que ninguna puede ser el tema.',
    explore: 'tema'
  },
  {
    q: 'Antes de sacar la cuenta en el cuaderno: el tanque de agua de la escuela es redondo y mide 4 metros de diámetro. ¿Cuánto mide su orilla, es decir, la circunferencia? Usa 3.14',
    opts: ['12.56 metros', '6.28 metros', '8 metros'],
    correct: 0,
    feedback: '¡Excelente! La orilla del círculo se saca así: 3.14 por el diámetro. Entonces 3.14 × 4 = 12.56 metros.',
    wrongFeedback: 'La respuesta es 12.56 metros, que es 3.14 × 4. Los 6.28 salen de multiplicar 3.14 por 2 y los 8 metros de multiplicar el diámetro por 2, que eso no es la circunferencia.',
    explore: 'circ'
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
/* Cada explorador está escrito para SU pregunta y enseña esos mismos
   números. Uno que explicara otra cuenta que la que el alumno tiene
   delante sería peor que no tener pista: le da la respuesta de otra
   cosa y encima le hace dudar de la que estaba resolviendo bien. */
function _buildPredExplore(i,box){
  const type=prediceData[i].explore;
  if(type==='mixto'){
    box.innerHTML=`<p class="pd-tip">El entero hay que volverlo octavos antes de juntarlo con lo que ya había. Toca los pasos:</p><div style="display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;margin:0.5rem 0;"><button class="btn btn-pri" onclick="predMixtoPaso(${i},1)">Paso 1: los 4 enteros</button><button class="btn btn-pri" onclick="predMixtoPaso(${i},2)">Paso 2: junto todo</button></div><div class="pd-msg" id="pd-msg-${i}">👆 toca los pasos en orden</div>`;
  } else if(type==='tema'){
    box.innerHTML=`<p class="pd-tip">Truco del examen: si una opción solo sirve para UNA parte del texto, es un detalle. Toca cada candidata para revisarla:</p><div style="display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;margin:0.5rem 0;"><button class="btn btn-pri" onclick="predTemaPista(${i},0)">¿Los rábanos?</button><button class="btn btn-pri" onclick="predTemaPista(${i},1)">¿La merienda?</button><button class="btn btn-pri" onclick="predTemaPista(${i},2)">¿El huerto?</button></div><div class="pd-msg" id="pd-msg-${i}">👆 revisa cada candidata</div>`;
  } else if(type==='circ'){
    box.innerHTML=`<p class="pd-tip">Aquí se pierde el punto: la fórmula corta trabaja con el DIÁMETRO, no con el radio. Toca los pasos:</p><div style="display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;margin:0.5rem 0;"><button class="btn btn-pri" onclick="predCircPaso(${i},1)">Paso 1: ¿qué me dieron?</button><button class="btn btn-pri" onclick="predCircPaso(${i},2)">Paso 2: la cuenta</button></div><div class="pd-msg" id="pd-msg-${i}">👆 toca los pasos en orden</div>`;
  }
}
function predMixtoPaso(i,paso){
  sfx('click');
  const msg=document.getElementById('pd-msg-'+i);
  if(paso===1){ msg.innerHTML=Fr('🍕 Una pizza partida en 8 son 8/8. Cuatro pizzas enteras son 4 × 8 = <strong>32 octavos</strong>. Ahora toca el paso 2.'); }
  else{ msg.innerHTML=Fr('🧮 A los 32 octavos les agrego los 3 que ya venían sueltos: 32 + 3 = <strong>35</strong>. Abajo sigue el 8, así que queda <strong>35/8</strong>. ¡Ya puedes responder abajo!'); sfx('ok'); }
}
function predTemaPista(i,cual){
  sfx('click');
  const msg=document.getElementById('pd-msg-'+i);
  if(cual===0){ msg.innerHTML='🥬 Los rábanos son una de las tres cosas que siembran: eso es un <strong>detalle</strong>, no el tema.'; }
  else if(cual===1){ msg.innerHTML='🍲 La merienda es una de las cosas que se hacen con la cosecha: también es un <strong>detalle</strong>.'; }
  else{ msg.innerHTML='🌱 El huerto está en todas las líneas: lo que se siembra, lo que se come y lo que se vende. <strong>De él trata TODO el texto.</strong> ¡Ya puedes responder abajo!'; sfx('ok'); }
}
function predCircPaso(i,paso){
  sfx('click');
  const msg=document.getElementById('pd-msg-'+i);
  if(paso===1){ msg.innerHTML='📏 El problema dice <strong>4 metros de diámetro</strong>, que es la medida que cruza el tanque entero por el centro. Como ya me dieron el diámetro, no hay que doblar nada. Ahora toca el paso 2.'; }
  else{ msg.innerHTML='⭕ La orilla del círculo es 3.14 × diámetro: 3.14 × 4 = <strong>12.56 metros</strong>. ¡Ya puedes responder abajo!'; sfx('ok'); }
}

// ===================== RETO FINAL (dos grupos, con parejas variables) =====================
/* Las tres parejas son de 5º y de lo que se pierde en la prueba: el
   número primo (que es donde arranca la descomposición en factores),
   la confusión entre área y perímetro (la orilla contra lo de
   adentro) y las dos formas de escribir que evalúa el examen de
   Español de este grado, la carta y el anuncio. */
const retoPairs=[
  {
    name:'¿Primo o compuesto? 🔢', hint:'El primo solo se divide entre 1 y entre él mismo; el compuesto sale de multiplicar dos números más chicos', btnA:'🔒 PRIMO', btnB:'🧩 COMPUESTO',
    pool:[
      {w:'7',t:'A'},{w:'9',t:'B'},{w:'13',t:'A'},{w:'21',t:'B'},{w:'17',t:'A'},{w:'25',t:'B'},
      {w:'23',t:'A'},{w:'27',t:'B'},{w:'11',t:'A'},{w:'33',t:'B'},{w:'19',t:'A'},{w:'49',t:'B'}
    ]
  },
  {
    name:'¿Área o perímetro? 📐', hint:'El área es lo que CUBRE la figura por dentro; el perímetro es la orilla, lo que le da la vuelta', btnA:'🟩 ÁREA (lo de adentro)', btnB:'📏 PERÍMETRO (la orilla)',
    pool:[
      {w:'La pintura que cubre la pared del aula',t:'A'},{w:'El alambre que rodea el corral',t:'B'},
      {w:'El zacate que cubre la cancha',t:'A'},{w:'La cinta que bordea el mantel',t:'B'},
      {w:'Las baldosas del piso del aula',t:'A'},{w:'La cerca que encierra el huerto',t:'B'},
      {w:'El plástico que tapa el semillero',t:'A'},{w:'El listón que le da la vuelta a la corona',t:'B'},
      {w:'La tela para forrar la mesa entera',t:'A'},{w:'Los pasos al caminar la orilla del solar',t:'B'},
      {w:'La lámina que cubre todo el techo',t:'A'},{w:'Los ladrillos puestos en fila alrededor del jardín',t:'B'}
    ]
  },
  {
    name:'¿Carta o anuncio? ✉️', hint:'La carta le habla a UNA persona y va firmada; el anuncio le habla a todos y tiene que llamar la atención', btnA:'✉️ CARTA', btnB:'📢 ANUNCIO',
    pool:[
      {w:'Querida abuela Rosario:',t:'A'},{w:'¡Gran feria de ciencias este viernes!',t:'B'},
      {w:'Te escribo para contarte cómo me fue en la escuela',t:'A'},{w:'Los ganadores recibirán libros y diplomas',t:'B'},
      {w:'Espero que estés bien de salud',t:'A'},{w:'Inscríbete en la dirección hasta el jueves',t:'B'},
      {w:'Salúdame a mi tía Elena y a los primos',t:'A'},{w:'¡No te lo pierdas! Te esperamos en el patio',t:'B'},
      {w:'Se despide con cariño, tu nieto Elmer',t:'A'},{w:'Cupos limitados: solo treinta lugares',t:'B'}
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
/* Las dos sopas de 5º: la primera de Matemáticas (siete palabras) y la
   segunda de Español (ocho). Van en mayúscula, sin tildes y sin Ñ, porque
   la cuadrícula se arma letra a letra y una tilde no se puede tocar en la
   pantalla. De 4 a 9 letras: con menos de 4 la palabra aparece por
   casualidad dentro de otra y con más de 9 no cabe en la cuadrícula de 10.

   ⚠️ La lista de palabras SOLA no sirve: el motor lee `set.grid[r][c]` para
   pintar la cuadrícula y `w.cells` para pintar de verde lo que el alumno
   encuentra. Cada palabra viaja con sus coordenadas, comprobadas letra a
   letra contra el grid, y aparece UNA sola vez en las ocho direcciones. Si
   se cambia una palabra hay que rehacer la cuadrícula entera y volver a
   comprobarla: una celda corrida deja una palabra imposible de encontrar y
   la sopa no se cierra nunca. */
const sopaSets=[
    { size:10,
      grid:[
      ['A','I','P','O','R','P','M','I','J','R'],
      ['M','S','P','R','O','R','A','D','I','O'],
      ['S','S','U','T','N','C','E','T','T','M'],
      ['O','C','B','E','O','F','R','X','T','A'],
      ['J','J','S','M','G','E','I','I','V','N'],
      ['S','D','O','A','A','M','S','V','I','O'],
      ['U','V','M','I','T','B','B','R','L','S'],
      ['S','J','I','D','N','T','N','U','L','B'],
      ['V','J','R','T','E','B','C','O','J','F'],
      ['J','M','P','A','P','I','H','N','H','O']],
      words:[
      {w:'MIXTO',cells:[[5,5],[4,6],[3,7],[2,8],[1,9]]},
      {w:'IMPROPIA',cells:[[0,7],[0,6],[0,5],[0,4],[0,3],[0,2],[0,1],[0,0]]},
      {w:'ROMANOS',cells:[[0,9],[1,9],[2,9],[3,9],[4,9],[5,9],[6,9]]},
      {w:'RADIO',cells:[[1,5],[1,6],[1,7],[1,8],[1,9]]},
      {w:'DIAMETRO',cells:[[7,3],[6,3],[5,3],[4,3],[3,3],[2,3],[1,3],[0,3]]},
      {w:'PRIMOS',cells:[[9,2],[8,2],[7,2],[6,2],[5,2],[4,2]]},
      {w:'PENTAGONO',cells:[[9,4],[8,4],[7,4],[6,4],[5,4],[4,4],[3,4],[2,4],[1,4]]}] },
    { size:10,
      grid:[
      ['I','N','S','H','C','A','U','S','A','H'],
      ['B','R','B','A','C','H','M','U','A','R'],
      ['B','R','D','O','O','H','T','D','F','D'],
      ['U','D','E','M','N','H','I','A','T','O'],
      ['A','T','B','T','T','D','U','D','S','F'],
      ['V','M','C','V','E','P','P','A','A','A'],
      ['U','H','E','P','X','J','D','M','L','R'],
      ['P','H','S','T','T','N','O','R','U','R'],
      ['U','E','H','E','O','P','T','I','D','A'],
      ['D','O','S','I','V','A','E','F','O','P']],
      words:[
      {w:'TEMA',cells:[[7,3],[6,2],[5,1],[4,0]]},
      {w:'CONTEXTO',cells:[[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[8,4]]},
      {w:'CAUSA',cells:[[0,4],[0,5],[0,6],[0,7],[0,8]]},
      {w:'SALUDO',cells:[[4,8],[5,8],[6,8],[7,8],[8,8],[9,8]]},
      {w:'DESPEDIDA',cells:[[9,0],[8,1],[7,2],[6,3],[5,4],[4,5],[3,6],[2,7],[1,8]]},
      {w:'FIRMA',cells:[[9,7],[8,7],[7,7],[6,7],[5,7]]},
      {w:'PARRAFO',cells:[[9,9],[8,9],[7,9],[6,9],[5,9],[4,9],[3,9]]},
      {w:'AVISO',cells:[[9,5],[9,4],[9,3],[9,2],[9,1]]}] }
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
/* En 5º la fracción ya no solo se identifica: se COMPARA, se opera y se
   convierte a número mixto en los dos sentidos. Por eso la mesa lleva hasta
   DOS pizzas: con una sola no hay manera de sombrear 5/4, y sin pasar del
   entero el número mixto no se puede ver, que es la mitad de lo que la
   prueba pregunta. El letrero enseña siempre las tres caras del mismo
   número: la fracción, el número mixto y el decimal.
   Cada desafío dice qué se le pide a la comparación (`cmp`): '=' pide una
   fracción equivalente, '<' una menor y '>' una mayor. Se compara
   multiplicando en cruz con enteros, nunca con decimales: 1/3 no cabe en un
   decimal exacto y una comparación con redondeos le diría al alumno que
   falló cuando acertó. */
const LAB1_RETOS=[
  {txt:'Sombrea 3/4 de una pizza', cmp:'=', n:3, d:4},
  {txt:'Sombrea una fracción equivalente a 2/3', cmp:'=', n:2, d:3},
  {txt:'Sombrea 5/4: una pizza entera y un pedazo más', cmp:'=', n:5, d:4},
  {txt:'Sombrea el número mixto 1 1/2', cmp:'=', n:3, d:2},
  {txt:'Sombrea una fracción MENOR que 1/2', cmp:'<', n:1, d:2}
];
let lab1N=4, lab1Pizzas=1, lab1Sombra=new Set(), lab1Reto=0;
// El mismo valor escrito como número mixto: 5/4 se lee «1 1/4» y 8/4 se lee «2»
function _lab1Mixto(k,n){
  if(k<n) return '';
  const e=Math.floor(k/n), r=k%n;
  return r===0? String(e) : e+' '+r+'/'+n;
}
function _lab1Sector(cx,cy,r,a0,a1){
  const x0=cx+r*Math.cos(a0), y0=cy+r*Math.sin(a0), x1=cx+r*Math.cos(a1), y1=cy+r*Math.sin(a1);
  const big=(a1-a0)>Math.PI?1:0;
  return `M ${cx} ${cy} L ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${big} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`;
}
function lab1Render(){
  const box=document.getElementById('widget-fraccion-lab'); if(!box) return;
  const k=lab1Sombra.size, n=lab1N;
  const dec=(k/n).toFixed(3).replace(/0+$/,'').replace(/\.$/,'');
  /* 1/3 no cabe en un decimal: se escribe con «≈» porque poner «2/3 = 0.667»
     le enseña al alumno una igualdad que es falsa, y esa la arrastra al
     examen. Es exacto solo si el denominador simplificado se queda en 2 y 5. */
  const _resto=(function(d){ while(d%2===0) d/=2; while(d%5===0) d/=5; return d; })(n/_mcdDe(k||n,n));
  const signo=_resto===1?'=':'≈';
  const mix=_lab1Mixto(k,n);
  let pizzas='';
  for(let p=0;p<lab1Pizzas;p++){
    let svg=`<svg viewBox="0 0 200 200" style="width:150px;max-width:44vw;">`;
    for(let i=0;i<n;i++){
      const idx=p*n+i;
      const a0=-Math.PI/2+i*2*Math.PI/n, a1=-Math.PI/2+(i+1)*2*Math.PI/n;
      svg+=`<path d="${_lab1Sector(100,100,90,a0,a1)}" fill="${lab1Sombra.has(idx)?'var(--pri)':'var(--card)'}" stroke="var(--dark)" stroke-width="2" data-slice="${idx}" style="cursor:pointer;"></path>`;
    }
    pizzas+=svg+'</svg>';
  }
  const reto=LAB1_RETOS[lab1Reto];
  box.innerHTML=`
    <div style="display:flex;gap:0.4rem;flex-wrap:wrap;justify-content:center;margin-bottom:0.4rem;">
      ${[2,3,4,5,6,8,10].map(v=>`<button class="btn ${v===n?'btn-pri':'btn-d'}" data-n="${v}">${v} pedazos</button>`).join('')}
    </div>
    <div style="display:flex;gap:0.4rem;flex-wrap:wrap;justify-content:center;margin-bottom:0.6rem;">
      ${[1,2].map(v=>`<button class="btn ${v===lab1Pizzas?'btn-pri':'btn-d'}" data-p="${v}">${v===1?'1 pizza':'2 pizzas'}</button>`).join('')}
    </div>
    <div style="display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;align-items:center;">${pizzas}</div>
    <p style="text-align:center;font-family:'Fredoka',sans-serif;font-size:1.15rem;margin:0.5rem 0;">Sombreado: <strong>${Fr(k+'/'+n)}</strong>${mix.indexOf('/')>0?` = <strong>${Fr(mix)}</strong>`:''} ${signo} <strong>${k===0?'0':dec}</strong></p>
    <div style="border:1.5px dashed var(--pri);border-radius:10px;padding:0.6rem 0.8rem;text-align:center;">
      🎯 Desafío ${lab1Reto+1} de ${LAB1_RETOS.length}: <strong>${Fr(reto.txt)}</strong>
      <div style="margin-top:0.5rem;"><button class="btn btn-g" id="lab1Check">✅ Comprobar</button></div>
    </div>
    <div id="fbLab1" class="fb" role="alert"></div>`;
  box.querySelectorAll('[data-slice]').forEach(p=>{ p.onclick=()=>{ const i=parseInt(p.dataset.slice,10); if(lab1Sombra.has(i)) lab1Sombra.delete(i); else lab1Sombra.add(i); sfx('click'); lab1Render(); }; });
  box.querySelectorAll('[data-n]').forEach(b=>{ b.onclick=()=>{ lab1N=parseInt(b.dataset.n,10); lab1Sombra=new Set(); sfx('click'); lab1Render(); }; });
  box.querySelectorAll('[data-p]').forEach(b=>{ b.onclick=()=>{ lab1Pizzas=parseInt(b.dataset.p,10); lab1Sombra=new Set(); sfx('click'); lab1Render(); }; });
  const chk=document.getElementById('lab1Check');
  if(chk) chk.onclick=()=>{
    const r=LAB1_RETOS[lab1Reto];
    // se compara en cruz: k/n contra r.n/r.d, con enteros y sin decimales
    const izq=lab1Sombra.size*r.d, der=r.n*lab1N;
    const ok=lab1Sombra.size>0 && (r.cmp==='<'? izq<der : r.cmp==='>'? izq>der : izq===der);
    const mio=lab1Sombra.size+'/'+lab1N, suyo=r.n+'/'+r.d;
    if(ok){
      sfx('ok');
      if(!xpTracker.lab1.has(lab1Reto)){ xpTracker.lab1.add(lab1Reto); pts(2); }
      const rel=r.cmp==='<'?'es menor que':r.cmp==='>'?'es mayor que':'es equivalente a';
      fb('fbLab1',`¡Logrado! ${mio} ${rel} ${suyo}. +2 XP`,true);
      lab1Reto=(lab1Reto+1)%LAB1_RETOS.length;
      if(xpTracker.lab1.size===LAB1_RETOS.length) fin('s-lab');
      setTimeout(lab1Render,1400);
    } else { sfx('no'); fb('fbLab1',`Todavía no: llevas ${mio}${mix?' ('+mix+')':''}. Pista: puedes cambiar el número de pedazos y poner la segunda pizza.`,false); }
  };
}

// ===================== LAB 2: EL TALLER DEL ÁREA =====================
/* El volumen NO es de 5º: es de 6º. En 5º se mide lo que cabe DENTRO de una
   figura plana (área del rectángulo y del triángulo) y lo que mide el
   contorno de un círculo, que es lo que la prueba pregunta.
   Tres cosas del dibujo no son adorno:
   - la CUADRÍCULA está pintada porque uno de los ítems de la prueba se
     contesta contando cuadros de 1 cm², no aplicando una fórmula;
   - el triángulo se pinta ENCIMA del rectángulo entero, con el rectángulo
     en línea de puntos: así se ve de dónde sale el «entre dos» y deja de
     ser una fórmula que se memoriza;
   - el círculo enseña su radio marcado, porque la prueba da unas veces el
     diámetro y otras el radio, y ahí es donde se pierde el punto. */
const LAB2_RETOS=[
  {f:'rect', v:12,   txt:'un rectángulo de 12 cm² de área'},
  {f:'tri',  v:6,    txt:'un triángulo de 6 cm² de área'},
  {f:'rect', v:24,   txt:'un rectángulo de 24 cm² de área'},
  {f:'tri',  v:15,   txt:'un triángulo de 15 cm² de área'},
  {f:'circ', v:31.4, txt:'un círculo de 31.4 cm de circunferencia'}
];
let lab2B=4, lab2H=3, lab2R=4, lab2Forma='rect', lab2Reto=0;
function _lab2Valor(){
  if(lab2Forma==='circ') return Math.round(2*3.14*lab2R*100)/100;
  return lab2Forma==='tri' ? lab2B*lab2H/2 : lab2B*lab2H;
}
function _lab2Uni(){ return lab2Forma==='circ' ? ' cm' : ' cm²'; }
function _lab2Nombre(){ return lab2Forma==='circ' ? 'un círculo' : lab2Forma==='tri' ? 'un triángulo' : 'un rectángulo'; }
/* El marco del dibujo es SIEMPRE del mismo tamaño (lo que ocupa la figura más
   grande que se puede armar) y la figura crece dentro de él. Si el marco se
   ajustara a cada figura, un rectángulo de 1 cm² se vería igual de grande que
   uno de 80 y el laboratorio dejaría de enseñar nada. */
function _lab2Svg(){
  const U=10, P=8;       // 10 unidades de dibujo = 1 cm, más un margen para que el trazo no se corte
  const MAXB=10, MAXH=8, MAXR=10;
  if(lab2Forma==='circ'){
    const S=2*MAXR*U+2*P, C=S/2, R=lab2R*U;
    return `<svg viewBox="0 0 ${S} ${S}" style="width:100%;max-width:250px;display:block;margin:0 auto;">
      <circle cx="${C}" cy="${C}" r="${R}" fill="var(--pri)" fill-opacity="0.25" stroke="var(--pri)" stroke-width="3"></circle>
      <line x1="${C}" y1="${C}" x2="${C+R}" y2="${C}" stroke="var(--dark)" stroke-width="2" stroke-dasharray="5 3"></line>
      <circle cx="${C}" cy="${C}" r="3" fill="var(--dark)"></circle>
    </svg>`;
  }
  const W=lab2B*U, H=lab2H*U, Y0=P+(MAXH-lab2H)*U;   // la figura se apoya abajo, como un terreno
  let rejilla='';
  for(let x=1;x<lab2B;x++) rejilla+=`<line x1="${P+x*U}" y1="${Y0}" x2="${P+x*U}" y2="${Y0+H}" stroke="var(--border)" stroke-width="1"></line>`;
  for(let y=1;y<lab2H;y++) rejilla+=`<line x1="${P}" y1="${Y0+y*U}" x2="${P+W}" y2="${Y0+y*U}" stroke="var(--border)" stroke-width="1"></line>`;
  const relleno=lab2Forma==='tri'
    ? `<polygon points="${P},${Y0+H} ${P+W},${Y0+H} ${P},${Y0}" fill="var(--pri)" fill-opacity="0.55"></polygon>`
    : `<rect x="${P}" y="${Y0}" width="${W}" height="${H}" fill="var(--pri)" fill-opacity="0.55"></rect>`;
  return `<svg viewBox="0 0 ${MAXB*U+2*P} ${MAXH*U+2*P}" style="width:100%;max-width:290px;display:block;margin:0 auto;">
      ${relleno}${rejilla}
      <rect x="${P}" y="${Y0}" width="${W}" height="${H}" fill="none" stroke="var(--dark)" stroke-width="2"${lab2Forma==='tri'?' stroke-dasharray="6 4"':''}></rect>
    </svg>`;
}
function lab2Render(){
  const box=document.getElementById('widget-area-lab'); if(!box) return;
  const v=_lab2Valor(), reto=LAB2_RETOS[lab2Reto];
  const ctl=(lbl,id,val)=>`<span style="display:inline-flex;align-items:center;gap:0.3rem;margin:0.2rem;"><strong>${lbl}</strong><button class="btn btn-d" data-c="${id}-">−</button><span style="font-family:'Fredoka',sans-serif;min-width:2.6rem;text-align:center;">${val} cm</span><button class="btn btn-d" data-c="${id}+">+</button></span>`;
  const mandos=lab2Forma==='circ' ? ctl('Radio','R',lab2R) : ctl('Base','B',lab2B)+ctl('Altura','H',lab2H);
  const cuenta=lab2Forma==='circ'
    ? `C = 2 × 3.14 × ${lab2R} = <strong>${v} cm</strong> <span style="font-size:0.8rem;color:var(--gray);">(diámetro: ${2*lab2R} cm)</span>`
    : lab2Forma==='tri'
      ? `A = (${lab2B} × ${lab2H}) ÷ 2 = <strong>${v} cm²</strong>`
      : `A = ${lab2B} × ${lab2H} = <strong>${v} cm²</strong>`;
  const figs=[['rect','▭ Rectángulo'],['tri','📐 Triángulo'],['circ','⭕ Círculo']];
  box.innerHTML=`
    <div style="display:flex;gap:0.4rem;flex-wrap:wrap;justify-content:center;margin-bottom:0.5rem;">
      ${figs.map(f=>`<button class="btn ${f[0]===lab2Forma?'btn-pri':'btn-d'}" data-f="${f[0]}">${f[1]}</button>`).join('')}
    </div>
    <div style="text-align:center;">${mandos}</div>
    <div style="margin:0.5rem 0;">${_lab2Svg()}</div>
    <p style="text-align:center;font-family:'Fredoka',sans-serif;font-size:1.15rem;">${cuenta}</p>
    <div style="border:1.5px dashed var(--pri);border-radius:10px;padding:0.6rem 0.8rem;text-align:center;">
      🎯 Desafío ${lab2Reto+1} de ${LAB2_RETOS.length}: arma <strong>${reto.txt}</strong>
      <div style="margin-top:0.5rem;"><button class="btn btn-g" id="lab2Check">✅ Comprobar</button></div>
    </div>
    <div id="fbLab2" class="fb" role="alert"></div>`;
  box.querySelectorAll('[data-f]').forEach(b=>{ b.onclick=()=>{ lab2Forma=b.dataset.f; sfx('click'); lab2Render(); }; });
  box.querySelectorAll('[data-c]').forEach(b=>{ b.onclick=()=>{
    const c=b.dataset.c; sfx('click');
    if(c==='B-') lab2B=Math.max(1,lab2B-1); else if(c==='B+') lab2B=Math.min(10,lab2B+1);
    else if(c==='H-') lab2H=Math.max(1,lab2H-1); else if(c==='H+') lab2H=Math.min(8,lab2H+1);
    else if(c==='R-') lab2R=Math.max(1,lab2R-1); else if(c==='R+') lab2R=Math.min(10,lab2R+1);
    lab2Render();
  }; });
  const chk=document.getElementById('lab2Check');
  if(chk) chk.onclick=()=>{
    const r=LAB2_RETOS[lab2Reto];
    if(lab2Forma!==r.f){ sfx('no'); fb('fbLab2',`El desafío pide ${r.txt} y tú tienes ${_lab2Nombre()}. Cambia de figura con los botones de arriba.`,false); return; }
    if(Math.abs(_lab2Valor()-r.v)<0.005){
      sfx('ok');
      if(!xpTracker.lab2.has(lab2Reto)){ xpTracker.lab2.add(lab2Reto); pts(2); }
      const como=lab2Forma==='circ'?`2 × 3.14 × ${lab2R}`:lab2Forma==='tri'?`(${lab2B} × ${lab2H}) ÷ 2`:`${lab2B} × ${lab2H}`;
      fb('fbLab2',`¡Logrado! ${como} = ${r.v}${_lab2Uni()}. +2 XP`,true);
      lab2Reto=(lab2Reto+1)%LAB2_RETOS.length;
      if(xpTracker.lab1.size===LAB1_RETOS.length&&xpTracker.lab2.size===LAB2_RETOS.length) fin('s-lab');
      setTimeout(lab2Render,1400);
    } else { sfx('no'); fb('fbLab2',`Tu figura da ${_lab2Valor()}${_lab2Uni()} y el desafío pide ${r.v}${_lab2Uni()}. Ajusta las medidas.`,false); }
  };
}

// ===================== WIDGET: LA MÁQUINA DE LOS NÚMEROS ROMANOS =====================
/* El promedio es de 6º, no de 5º. Lo que sí cae en la prueba de 5º y no tiene
   otro sitio donde practicarse son los números romanos, así que este widget
   los toma. Va en los DOS sentidos a propósito: el alumno que solo practica
   «escribe 40 en romanos» se queda mirando un XL sin saber leerlo, y en la
   prueba viene de las dos formas. La tablita de las siete letras se queda a
   la vista: lo que se está practicando es armar el número, no recordar
   cuánto vale la D.
   Los números salen de una lista y no de un sorteo entre 1 y 2000: el azar
   suelto saca casi siempre números de cuatro letras repetidas (MMM…, XXX…)
   y no volvería a pasar nunca por los restados (IV, IX, XL, CM), que son
   justo donde se equivocan. */
const ROM_TABLA=[[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
function _aRomano(n){ let r=''; ROM_TABLA.forEach(par=>{ while(n>=par[0]){ r+=par[1]; n-=par[0]; } }); return r; }
const ROM_NUMS=[4,6,7,9,11,12,14,15,19,21,24,29,32,38,40,44,45,49,50,58,60,66,74,79,80,89,90,94,99,100,120,150,200,300,400,500,600,900,1000,1200,1500,1900,2000];
let romNum=0, romHaciaRomano=true, promAciertos=0;
function promNueva(){
  const box=document.getElementById('widget-romanos'); if(!box) return;
  let n; do{ n=ROM_NUMS[Math.floor(Math.random()*ROM_NUMS.length)]; }while(n===romNum);
  romNum=n; romHaciaRomano=Math.random()<0.5;
  const rom=_aRomano(n);
  box.innerHTML=`
    <p style="text-align:center;font-size:0.85rem;color:var(--gray);margin-bottom:0.3rem;">${romHaciaRomano?'Escríbelo en números romanos:':'Escribe cuánto vale este número romano:'}</p>
    <p style="text-align:center;font-family:'Fredoka',sans-serif;font-size:2rem;letter-spacing:0.06em;margin-bottom:0.6rem;">${romHaciaRomano?n:rom}</p>
    <div style="display:flex;gap:0.5rem;justify-content:center;align-items:center;flex-wrap:wrap;">
      <label for="promInp"><strong>Respuesta:</strong></label>
      <input id="promInp" class="eval-cp-input" type="text" inputmode="${romHaciaRomano?'text':'numeric'}" style="max-width:130px;text-transform:uppercase;" autocomplete="off">
      <button class="btn btn-g" id="promCheck">✅ Comprobar</button>
      <button class="btn btn-d" id="promNext">🔄 Otro número</button>
    </div>
    <p style="text-align:center;font-size:0.72rem;color:var(--gray);margin-top:0.6rem;">I = 1 · V = 5 · X = 10 · L = 50 · C = 100 · D = 500 · M = 1000</p>
    <div id="fbProm" class="fb" role="alert"></div>`;
  document.getElementById('promCheck').onclick=()=>{
    const escrito=(document.getElementById('promInp').value||'').trim();
    const ok=romHaciaRomano
      ? escrito.toUpperCase().replace(/[^IVXLCDM]/g,'')===rom
      : parseInt(escrito.replace(/[^\d]/g,''),10)===n;
    if(ok){
      sfx('ok'); promAciertos++;
      if(promAciertos<=6&&!xpTracker.prom.has(promAciertos)){ xpTracker.prom.add(promAciertos); pts(2); }
      fb('fbProm',`¡Correcto! ${n} se escribe ${rom}. +2 XP`,true);
      setTimeout(promNueva,1600);
    } else if(romHaciaRomano){
      sfx('no'); fb('fbProm','Todavía no. Parte el número: primero los millares, después las centenas, las decenas y las unidades, y escribe cada parte con sus letras.',false);
    } else {
      sfx('no'); fb('fbProm','Todavía no. Suma las letras de izquierda a derecha, y RESTA la que esté antes de una mayor: XL vale 50 menos 10.',false);
    }
  };
  document.getElementById('promNext').onclick=()=>{ sfx('click'); promNueva(); };
}

// ===================== WIDGET: EL DETECTIVE DE LA PALABRA =====================
/* Seis casos, como en 6º. El examen de 5º pregunta el significado de una
   palabra POR EL CONTEXTO, así que la pista nunca nombra la palabra: la
   oración es la que tiene que dejarla ver. Todas son palabras de una
   escuela rural, no de diccionario. */
const detData=[
  {s:['El','agua','del','río','bajaba','turbia','después','del','aguacero'],c:5,pista:'la palabra que significa revuelta y sucia'},
  {s:['Doña','Elena','preparó','una','comida','abundante','para','los','trabajadores'],c:5,pista:'la palabra que significa en gran cantidad'},
  {s:['La','carreta','subía','despacio','por','el','camino','empinado'],c:7,pista:'la palabra que significa con mucha subida'},
  {s:['Los','alumnos','escucharon','atentos','la','explicación','del','maestro'],c:3,pista:'la palabra que significa muy concentrados'},
  {s:['La','cosecha','de','café','fue','escasa','este','año'],c:5,pista:'la palabra que significa muy poca'},
  {s:['El','viento','derribó','el','palo','de','mangos','del','patio'],c:2,pista:'la palabra que significa tumbó'}
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
/* En 5º esta pregunta SE QUEDA: el m.c.m. y el M.C.D. son de este grado (el
   agua que llega cada tantos días, el reparto sin sobras). Lo que cambia
   son las situaciones, que ahora son las de un niño de 10 u 11 años en su
   casa y en su escuela. El campo `t` sigue siendo 'mcm' o 'mcd' porque los
   rótulos y los mensajes viven en `radarRender`, no aquí.

   Ninguna situación se repite en el quiz de esta misma misión: al alumno
   que se topa dos veces con el mismo camión y los mismos días no le queda
   más que reconocer la respuesta.

   Comprobadas: m.c.m.(9,12)=36 · m.c.m.(3,5)=15 · m.c.m.(6,10)=30 ·
   m.c.m.(8,12)=24 · M.C.D.(36,48)=12 · M.C.D.(24,36)=12 ·
   M.C.D.(45,60)=15 · M.C.D.(30,42)=6 */
const radarData=[
  {s:'A la escuela llega la merienda escolar cada 9 días y la visita del supervisor cada 12. ¿Cuándo caen el mismo día?',t:'mcm'},
  {s:'Repartir 36 naranjas y 48 mandarinas en bolsas iguales, sin que sobre ninguna',t:'mcd'},
  {s:'Karla riega las matas cada 3 días y su hermano barre el patio cada 5. ¿Cuándo les toca el mismo día?',t:'mcm'},
  {s:'Partir un mecate de 24 metros y otro de 36 en tramos del mismo tamaño, los más grandes que se pueda',t:'mcd'},
  {s:'Marta va a la biblioteca cada 6 días y Luis cada 10. Hoy coincidieron allí. ¿Cuándo se vuelven a encontrar?',t:'mcm'},
  {s:'Guardar 45 lápices y 60 cuadernos en cajas iguales, sin que sobre nada',t:'mcd'},
  {s:'Don Chepe va al mercado de Comayagua cada 8 días y a la milpa cada 12. ¿Cuándo hace las dos cosas el mismo día?',t:'mcm'},
  {s:'Formar filas iguales lo más largas posible con 30 niñas y 42 niños',t:'mcd'}
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
function _tgTask(out,i,inner){ const div=document.createElement('div'); div.className='tg-task'; div.innerHTML=Fr(`<div class="tg-task-num">${i+1}</div><div class="tg-task-content">${inner}</div>`); out.appendChild(div); }
function _instrBlock(out,title,lines){ const ib=document.createElement('div'); ib.className='tg-instruction-block'; ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join(''); out.appendChild(ib); }

// 🍕 Fracciones y números mixtos: operar, convertir en los dos sentidos y comparar
function genFraccionesTask(out,count){
  _instrBlock(out,'Instrucción: fracciones y números mixtos',['Resuelve cada ejercicio. Si los denominadores son distintos, busca primero el común denominador con el m.c.m. y al final SIMPLIFICA.','<strong>Pista:</strong> los denominadores nunca se suman ni se restan. Un número mixto se vuelve fracción así: 2 1/4 = (2 × 4 + 1)/4 = 9/4.']);
  for(let i=0;i<count;i++){
    const tipo=_tgRint(0,3);
    if(tipo===0){ // suma o resta, con el minuendo arriba para que nunca salga negativo
      const d1=_tgRint(2,10); let d2=_tgRint(2,10); if(d2===d1&&Math.random()<0.6) d2=_tgRint(2,10);
      const n1=_tgRint(1,d1-1||1), n2=_tgRint(1,d2-1||1);
      const comun=_mcmDe(d1,d2), a=n1*(comun/d1), b=n2*(comun/d2);
      if(Math.random()<0.4){
        if(a===b){ i--; continue; }
        const x=a>b?[n1,d1]:[n2,d2], y=a>b?[n2,d2]:[n1,d1];
        _tgTask(out,i,`<strong>${x[0]}/${x[1]} − ${y[0]}/${y[1]} =</strong>${_tgLines(1)}<div class="tg-answer">✔ ${_fmtFrac(Math.abs(a-b),comun)} (común denominador: ${comun})</div>`);
      } else {
        _tgTask(out,i,`<strong>${n1}/${d1} + ${n2}/${d2} =</strong>${_tgLines(1)}<div class="tg-answer">✔ ${_fmtFrac(a+b,comun)} (común denominador: ${comun})</div>`);
      }
    } else if(tipo===1){ // número mixto a fracción impropia
      const d=_tgRint(3,9), e=_tgRint(1,5); const n=_tgRint(1,d-1);
      if(_mcdDe(n,d)!==1){ i--; continue; } // si se puede simplificar, el mixto ya estaba mal escrito
      _tgTask(out,i,`<strong>Escribe ${e} ${n}/${d} como fracción impropia</strong>${_tgLines(1)}<div class="tg-answer">✔ (${e} × ${d} + ${n})/${d} = ${e*d+n}/${d}</div>`);
    } else if(tipo===2){ // fracción impropia a número mixto
      const d=_tgRint(3,9), e=_tgRint(1,5); const n=_tgRint(1,d-1);
      if(_mcdDe(n,d)!==1){ i--; continue; }
      _tgTask(out,i,`<strong>Escribe ${e*d+n}/${d} como número mixto</strong>${_tgLines(1)}<div class="tg-answer">✔ ${e*d+n} ÷ ${d} = ${e} y sobran ${n}: ${e} ${n}/${d}</div>`);
    } else { // comparar dos fracciones
      const d1=_tgRint(2,10), d2=_tgRint(2,10), n1=_tgRint(1,d1-1||1), n2=_tgRint(1,d2-1||1);
      if(n1*d2===n2*d1){ i--; continue; } // si valen lo mismo no hay «cuál es mayor»
      const may=n1*d2>n2*d1?`${n1}/${d1}`:`${n2}/${d2}`, c=_mcmDe(d1,d2);
      // con el mismo denominador no hay nada que igualar: manda el numerador
      const como=d1===d2?'el denominador es el mismo, así que manda el numerador mayor':`con denominador ${c}: ${n1*(c/d1)}/${c} y ${n2*(c/d2)}/${c}`;
      _tgTask(out,i,`<strong>¿Cuál es mayor, ${n1}/${d1} o ${n2}/${d2}?</strong>${_tgLines(1)}<div class="tg-answer">✔ ${may} (${como})</div>`);
    }
  }
}
// 💰 Multiplicar y dividir decimales, con lempiras
function genDecimalesTask(out,count){
  _instrBlock(out,'Instrucción: multiplicar y dividir decimales',['Multiplica como si no hubiera punto y al final colócalo contando TODAS las cifras decimales que había.','Para dividir un decimal entre un entero se divide igual que siempre y el punto del cociente se pone encima del punto del dividendo.','<strong>Comprueba</strong> estimando: si la libra cuesta como L.20 y llevas 3, el total anda por L.60.']);
  const prods=['frijoles','arroz','azúcar','café','maíz','manteca','harina'];
  for(let i=0;i<count;i++){
    const tipo=_tgRint(0,3);
    /* Dos cosas distintas, y las dos hacen falta: el FACTOR no puede acabar
       en cero («1.010 × 85» se lee como si sobrara una cifra), y el
       RESULTADO tampoco se escribe con el cero de la derecha. El filtro
       solo vigila el factor: 7.855 × 44 da 345.620 y nadie escribe así un
       resultado, así que la pauta lo recorta con _decTrim. */
    if(tipo===0){ const ai=_tgRint(1005,9995), b=_tgRint(11,99);
      if(ai%10===0){ i--; continue; }
      _tgTask(out,i,`<strong>${_decStr(ai,3)} × ${b} =</strong>${_tgLines(2)}<div class="tg-answer">✔ ${_decTrim(_decStr(ai*b,3))}</div>`); }
    else if(tipo===1){ const ai=_tgRint(105,9995);
      if(ai%10===0){ i--; continue; }
      _tgTask(out,i,`<strong>${_decStr(ai,2)} × 10 =</strong>${_tgLines(1)}<div class="tg-answer">✔ ${_decStr(ai,1)} (el punto se corre un lugar a la derecha)</div>`); }
    else if(tipo===2){ const ci=_tgRint(15,95), dv=_tgRint(2,12);
      if((ci*dv)%10===0){ i--; continue; }
      _tgTask(out,i,`<strong>${_decStr(ci*dv,1)} ÷ ${dv} =</strong>${_tgLines(2)}<div class="tg-answer">✔ ${_decStr(ci,1)} (comprueba: ${_decStr(ci,1)} × ${dv} = ${_decStr(ci*dv,1)})</div>`); }
    else { const pi=_tgRint(550,6000), libras=_tgRint(2,9);
      _tgTask(out,i,`<strong>La libra de ${prods[_tgRint(0,prods.length-1)]} cuesta L.${_decStr(pi,2)}. ¿Cuánto cuestan ${libras} libras?</strong>${_tgLines(1)}<div class="tg-answer">✔ L.${_decStr(pi*libras,2)}</div>`); }
  }
}
// 🔁 Divisores, factores primos, m.c.m. y M.C.D.
const TG_DIVISORES=[12,18,20,24,28,30,32,40,42,45,50,54,63,66,70];
const TG_FACTORES=[12,18,20,24,28,30,36,40,42,44,45,50,63,75,84,90];
function genMcmMcdTask(out,count){
  _instrBlock(out,'Instrucción: divisores, factores primos, m.c.m. y M.C.D.',['Contesta cada uno con todo el procedimiento.','<strong>Recuerda:</strong> divisor es el que cabe EXACTO, sin sobras · m.c.m. = el menor múltiplo común (para coincidir) · M.C.D. = el mayor divisor común (para repartir).']);
  for(let i=0;i<count;i++){
    const tipo=_tgRint(0,3);
    if(tipo===0){ const n=TG_DIVISORES[_tgRint(0,TG_DIVISORES.length-1)];
      _tgTask(out,i,`<strong>Escribe todos los divisores de ${n}, de menor a mayor</strong>${_tgLines(1)}<div class="tg-answer">✔ ${_divisoresDe(n).join(', ')} (son ${_divisoresDe(n).length})</div>`); }
    else if(tipo===1){ const n=TG_FACTORES[_tgRint(0,TG_FACTORES.length-1)];
      _tgTask(out,i,`<strong>Descompón ${n} en factores primos</strong>${_tgLines(1)}<div class="tg-answer">✔ ${n} = ${_factoresPrimos(n).join(' × ')}</div>`); }
    else { const a=_tgRint(4,30), b=_tgRint(4,30);
      if(_mcdDe(a,b)===1&&Math.random()<0.5){ i--; continue; }
      if(tipo===2) _tgTask(out,i,`<strong>Calcula el m.c.m. de ${a} y ${b}</strong>${_tgLines(1)}<div class="tg-answer">✔ m.c.m.(${a}, ${b}) = ${_mcmDe(a,b)}</div>`);
      else _tgTask(out,i,`<strong>Calcula el M.C.D. de ${a} y ${b}</strong>${_tgLines(1)}<div class="tg-answer">✔ M.C.D.(${a}, ${b}) = ${_mcdDe(a,b)}</div>`);
    }
  }
}
// 🏛️ Números romanos, en los dos sentidos
function genRomanosTask(out,count){
  _instrBlock(out,'Instrucción: números romanos',['Escribe el número que se pide. Las siete letras: I = 1 · V = 5 · X = 10 · L = 50 · C = 100 · D = 500 · M = 1000.','<strong>Recuerda:</strong> una letra menor delante de una mayor se RESTA (IV = 4, XL = 40, CM = 900); nunca se repite una letra más de tres veces seguidas.']);
  for(let i=0;i<count;i++){
    const tipo=_tgRint(0,2);
    const n=ROM_NUMS[_tgRint(0,ROM_NUMS.length-1)];
    if(tipo===0) _tgTask(out,i,`<strong>Escribe ${n} en números romanos</strong>${_tgLines(1)}<div class="tg-answer">✔ ${_aRomano(n)}</div>`);
    else if(tipo===1) _tgTask(out,i,`<strong>¿Qué número es ${_aRomano(n)}?</strong>${_tgLines(1)}<div class="tg-answer">✔ ${n}</div>`);
    else { const m=ROM_NUMS[_tgRint(0,ROM_NUMS.length-1)];
      if(m===n){ i--; continue; }
      _tgTask(out,i,`<strong>¿Cuál es mayor, ${_aRomano(n)} o ${_aRomano(m)}?</strong>${_tgLines(1)}<div class="tg-answer">✔ ${_aRomano(Math.max(n,m))}, que vale ${Math.max(n,m)} (el otro vale ${Math.min(n,m)})</div>`); }
  }
}
// 📐 Área, perímetro y circunferencia
/* El de 4 lados es el CUADRILÁTERO, no el cuadrado: el rectángulo, el rombo
   y el trapecio también tienen 4 lados y 4 ángulos y no son cuadrados. Es
   el nombre que usa el DCNB («triángulos, cuadriláteros, circunferencias y
   círculos»), y el ejercicio de nombrar pregunta por el número de lados,
   que es lo único que se le da al alumno. */
const TG_POLIGONOS=[[3,'triángulo'],[4,'cuadrilátero'],[5,'pentágono'],[6,'hexágono'],[7,'heptágono'],[8,'octágono'],[9,'eneágono'],[10,'decágono']];
// Para los ejercicios que dicen «regular», de cinco lados en adelante: «un
// triángulo regular» no lo dice nadie en un aula, aunque sea correcto.
const TG_REGULARES=TG_POLIGONOS.slice(2);
function genGeometriaTask(out,count){
  _instrBlock(out,'Instrucción: área, perímetro y circunferencia',['Usa la fórmula que toca y escribe la unidad: cm² o m² para las áreas, cm o m para los contornos.','Área del rectángulo = base × altura · Área del triángulo = (base × altura) ÷ 2 · Perímetro de un polígono regular = lado × número de lados · Circunferencia = 3.14 × diámetro.']);
  for(let i=0;i<count;i++){
    const tipo=_tgRint(0,5);
    if(tipo===0){ const b=_tgRint(3,20), h=_tgRint(2,15);
      _tgTask(out,i,`<strong>Calcula el área de un rectángulo de ${b} cm de base y ${h} cm de altura</strong>${_tgLines(1)}<div class="tg-answer">✔ ${b} × ${h} = ${b*h} cm²</div>`); }
    else if(tipo===1){ const b=_tgRint(3,16), h=2*_tgRint(1,8); // la altura va par para que la mitad salga exacta
      _tgTask(out,i,`<strong>Calcula el área de un triángulo de ${b} m de base y ${h} m de altura</strong>${_tgLines(1)}<div class="tg-answer">✔ (${b} × ${h}) ÷ 2 = ${b*h/2} m²</div>`); }
    else if(tipo===2){ const p=TG_REGULARES[_tgRint(0,TG_REGULARES.length-1)], l=_tgRint(4,40);
      _tgTask(out,i,`<strong>Un ${p[1]} regular tiene ${p[0]} lados de ${l} cm cada uno. ¿Cuánto mide su perímetro?</strong>${_tgLines(1)}<div class="tg-answer">✔ ${l} × ${p[0]} = ${l*p[0]} cm</div>`); }
    else if(tipo===3){ const p=TG_REGULARES[_tgRint(0,TG_REGULARES.length-1)], l=_tgRint(4,40);
      _tgTask(out,i,`<strong>El perímetro de un ${p[1]} regular mide ${l*p[0]} cm. ¿Cuánto mide cada lado?</strong>${_tgLines(1)}<div class="tg-answer">✔ ${l*p[0]} ÷ ${p[0]} = ${l} cm</div>`); }
    else if(tipo===4){ const d=5*_tgRint(2,12);
      _tgTask(out,i,`<strong>¿Cuánto mide la circunferencia de un círculo de ${d} cm de diámetro? (π = 3.14)</strong>${_tgLines(1)}<div class="tg-answer">✔ 3.14 × ${d} = ${_decTrim(_decStr(314*d,2))} cm</div>`); }
    else { const p=TG_POLIGONOS[_tgRint(0,TG_POLIGONOS.length-1)];
      _tgTask(out,i,`<strong>¿Cómo se llama el polígono de ${p[0]} lados y ${p[0]} ángulos?</strong>${_tgLines(1)}<div class="tg-answer">✔ El ${p[1]}</div>`); }
  }
}
// 📊 Recta numérica y lectura de gráficos
const TG_CIUDADES=[['Tegucigalpa','La Ceiba'],['Comayagua','Choluteca'],['Copán Ruinas','Juticalpa'],['La Esperanza','Trujillo']];
const TG_DIAS=['lunes','martes','miércoles','jueves','viernes'];
function genGraficosTask(out,count){
  _instrBlock(out,'Instrucción: recta numérica y gráficos',['Lee con cuidado la recta o la tabla antes de contestar.','<strong>Recuerda:</strong> entre dos números enteros de una recta caben décimas: del 2 al 3 hay 10 rayitas y cada una vale 0.1.']);
  for(let i=0;i<count;i++){
    const tipo=_tgRint(0,2);
    if(tipo===0){ const ent=_tgRint(1,9), k=_tgRint(1,9);
      _tgTask(out,i,`<strong>Una recta numérica va del ${ent} al ${ent+1} y está partida en 10 partes iguales. La flecha está ${k} rayitas después del ${ent}. ¿Qué número señala?</strong>${_tgLines(1)}<div class="tg-answer">✔ ${_decStr(ent*10+k,1)}</div>`); }
    else if(tipo===1){ // dos ciudades, y un solo día en que coinciden
      const par=TG_CIUDADES[_tgRint(0,TG_CIUDADES.length-1)], igual=_tgRint(0,4);
      const a=[], b=[];
      for(let k=0;k<5;k++){ a.push(_tgRint(20,32)); b.push(k===igual?a[k]:a[k]+(Math.random()<0.5?-1:1)*_tgRint(2,6)); }
      if(b.some((v,k)=>k!==igual&&v===a[k])){ i--; continue; }
      _tgTask(out,i,`<strong>Temperaturas del mediodía, en grados: ${par[0]}: ${a.join(', ')} · ${par[1]}: ${b.join(', ')} (de ${TG_DIAS[0]} a ${TG_DIAS[4]}). ¿Qué día tuvieron las dos ciudades la misma temperatura?</strong>${_tgLines(1)}<div class="tg-answer">✔ El ${TG_DIAS[igual]}: las dos marcaron ${a[igual]} grados</div>`); }
    else { const s1=_tgRint(5,15), paso=_tgRint(3,9), sem=_tgRint(1,3); // la semana 1 es alturas[0]: sem nunca puede pasar de 3
      const alturas=[s1,s1+paso,s1+2*paso,s1+3*paso];
      _tgTask(out,i,`<strong>El maíz de la milpa midió ${alturas.join(' cm, ')} cm en las semanas 1, 2, 3 y 4. ¿Cuánto creció entre la semana 1 y la semana ${sem+1}?</strong>${_tgLines(1)}<div class="tg-answer">✔ ${alturas[sem]} − ${alturas[0]} = ${alturas[sem]-alturas[0]} cm</div>`); }
  }
}
// 🧠 Pensamiento y escritura (banco fijo, mezcla las dos materias)
const pensamientoTaskDB=[
  {q:'Nery dice: «3/5 + 1/4 = 4/9». Explica cuál fue su error y resuelve la suma bien.',ans:'Sumó por separado los de arriba y los de abajo. Lo correcto: común denominador 20, 12/20 + 5/20 = 17/20.',type:'🔎 Detectar error'},
  {q:'Beto escribió que 2 3/4 es lo mismo que 5/4. Explica en qué se equivocó y escribe bien la fracción impropia.',ans:'Sumó el entero al numerador. Se multiplica: (2 × 4 + 3)/4 = 11/4.',type:'🔎 Detectar error'},
  {q:'Escribe un problema de tu escuela que se resuelva con el M.C.D. de 20 y 30, y resuélvelo.',ans:'Respuesta variable. Ej.: repartir 20 lápices y 30 cuadernos en paquetes iguales lo más grandes posible: M.C.D. = 10 paquetes, con 2 lápices y 3 cuadernos cada uno.',type:'✏️ Crear problema'},
  {q:'Escribe un problema de tu comunidad que se resuelva con el m.c.m. de 4 y 6, y resuélvelo.',ans:'Respuesta variable. Ej.: el agua llega cada 4 días y el camión de la basura pasa cada 6: coinciden cada 12 días.',type:'✏️ Crear problema'},
  {q:'Un terreno mide 10 m de largo y 6 m de ancho. Otro mide 12 m de largo y 5 m de ancho. ¿Cuál necesita más alambre para cercarlo y cuál da más espacio para sembrar? Explica la diferencia.',ans:'Alambre es perímetro: 32 m el primero y 34 m el segundo, gana el segundo. Espacio es área: 60 m² el primero y 60 m² el segundo, dan lo mismo. Contorno y área no miden lo mismo.',type:'🧠 Razonar'},
  {q:'Escribe una CARTA corta a tu maestro o maestra pidiéndole permiso para algo. Que lleve todas sus partes: lugar y fecha, saludo, cuerpo, despedida y firma.',ans:'Respuesta variable. Se revisa que estén las cinco partes y que el cuerpo diga de verdad qué se pide y por qué.',type:'✉️ Carta'},
  {q:'Escribe un ANUNCIO para vender algo de tu casa o para invitar a una actividad de tu escuela. Que llame la atención y diga qué, cuándo, dónde y con quién hablar.',ans:'Respuesta variable. Se revisa el título llamativo y los cuatro datos: qué, cuándo, dónde y a quién buscar.',type:'📣 Anuncio'},
  {q:'Un texto dice: «El tacuacín carga a sus crías en la espalda. Cuando se asusta se queda tieso y parece muerto». Inventa una pregunta cuya respuesta esté escrita y otra cuya respuesta haya que deducir.',ans:'Escrita: ¿dónde carga a sus crías? Deducida: ¿por qué muchos animales lo dejan en paz cuando se asusta? (porque lo creen muerto).',type:'📖 Tipos de pregunta'},
  {q:'«A doña Elvira se le fue el santo al cielo y dejó los frijoles quemándose.» ¿Qué quiere decir esa frase? ¿Se entiende palabra por palabra?',ans:'Quiere decir que se distrajo y se le olvidó. Palabra por palabra no se entiende: es una frase hecha y se descubre por lo que pasa alrededor.',type:'📖 Frase hecha'},
  {q:'La libra de café cuesta L.42.50 y llevas L.200. ¿Cuántas libras completas puedes comprar y cuánto te sobra?',ans:'4 libras: 42.50 × 4 = L.170.00, y sobran L.30.00. Con 5 libras serían L.212.50 y no alcanza.',type:'🧮 Dos pasos'}
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
function genTask(){ sfx('click'); const type=document.getElementById('tgType').value; const count=parseInt(document.getElementById('tgCount').value); ansVisible=false; const out=document.getElementById('tgOut'); out.innerHTML=''; if(type==='fracciones') genFraccionesTask(out,count); else if(type==='decimales') genDecimalesTask(out,count); else if(type==='mcmmcd') genMcmMcdTask(out,count); else if(type==='romanos') genRomanosTask(out,count); else if(type==='geometria') genGeometriaTask(out,count); else if(type==='graficos') genGraficosTask(out,count); else if(type==='pensamiento') genPensamientoTask(out,count); fin('s-tareas'); }
function toggleAns(){ ansVisible=!ansVisible; document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none'); sfx('click'); }

// ===================== ESCRITURA: EXPLICA Y REDACTA =====================
/* Las dos formas de escribir que evalúa la prueba de 5º son la CARTA y el
   ANUNCIO (en 4º eran la anécdota y el instructivo: no se confunden).
   Cinco consignas, como en 6º: tres cartas con encargos distintos (contar,
   pedir y agradecer) y dos anuncios, porque una carta a un amigo y una
   carta a la directora no se escriben igual y ahí es donde el alumno se
   atora.

   La pauta la revisa el propio alumno, así que cada criterio se mira en el
   papel sin saber gramática: o está el lugar y la fecha, o no está. */
const explicaData = [
  {
    q: 'Un compañero de tu grado lleva dos semanas en su casa, enfermo de dengue. Escríbele una carta: cuéntale dos cosas que han hecho en clase mientras no estaba y anímalo a reponerse.',
    hint: '💡 Pista: arriba dónde estás y qué día es; luego a quién le hablas; después lo que le quieres decir; al final, cómo te despides y tu nombre.',
    rubric: ['✓ Están las cinco partes: dónde y cuándo, saludo, lo que le cuenta, despedida y su nombre', '✓ Cuenta dos cosas de la clase, no una sola, y le dice algo que lo anime', '✓ Se entiende de corrido, con sus puntos y las mayúsculas en su sitio'],
    suggested: 'Comayagua, 12 de agosto de 2026. Querido Elmer: te escribo porque en el grado te estamos echando de menos. Esta semana sembramos el huerto y la maestra nos enseñó a sacar el área del triángulo. Te aparté mis apuntes para que te pongas al día. Que te alivies pronto. Tu amigo, Josué.'
  },
  {
    q: 'El bebedero del patio lleva dos semanas quebrado y los alumnos salen a tomar agua hasta la casa de enfrente. Escríbele una carta a la directora de tu escuela para pedirle que lo manden a reparar.',
    hint: '💡 Pista: a la directora se le habla de usted. Primero se cuenta qué está pasando, después se pide, y siempre con una razón.',
    rubric: ['✓ Lleva lugar y fecha, un saludo respetuoso, el cuerpo y la despedida con la firma', '✓ Dice claramente qué está pasando y qué se pide, sin dar vueltas', '✓ Habla de usted de principio a fin y da al menos una razón de por qué hace falta'],
    suggested: 'La Esperanza, 12 de agosto de 2026. Señora directora: le escribo de parte de quinto grado. El bebedero del patio está quebrado desde hace dos semanas y varios compañeros pasan el recreo sin tomar agua. Le pedimos con respeto que lo manden a reparar. Gracias por su atención. Atentamente, Nery Amador, quinto grado.'
  },
  {
    q: 'Don Ramón, un vecino de la comunidad, prestó su carreta y su tiempo para acarrear la arena con la que se emparejó el piso del aula. Escríbele una carta de agradecimiento de parte de todo el grado.',
    hint: '💡 Pista: agradecer no es solo decir gracias. Cuenta QUÉ hizo y en qué les ayudó a ustedes.',
    rubric: ['✓ No le falta ninguna parte: dónde y cuándo se escribe, a quién va dirigida, el mensaje, la despedida y quién la firma', '✓ Dice exactamente qué hizo don Ramón y en qué benefició al grado', '✓ Habla de usted, con un tono amable, y firma de parte de todo el grado'],
    suggested: 'Intibucá, 12 de agosto de 2026. Estimado don Ramón: los alumnos de quinto grado le damos las gracias por prestar su carreta y por acarrear la arena. Gracias a usted el piso del aula quedó parejo y ya podemos escribir sin que se mueva el pupitre. Le estamos muy agradecidos. Con respeto, los alumnos de quinto grado.'
  },
  {
    q: 'En tu escuela van a sembrar el huerto el sábado y hacen falta manos. Escribe un anuncio bien llamativo para invitar a los alumnos y a las familias: qué se va a hacer, qué día, a qué hora, dónde y qué debe llevar cada quien.',
    hint: '💡 Pista: el anuncio se lee de un vistazo, de lejos y caminando. Título corto arriba y abajo los datos en pocas palabras.',
    rubric: ['✓ Tiene un título corto que llama la atención', '✓ No deja dudas: qué se va a hacer, qué día, a qué hora y en qué lugar', '✓ Va en pocas palabras, sin párrafos largos, y dice qué debe llevar cada quien'],
    suggested: '¡MANOS A LA TIERRA! Sembramos el huerto de la escuela. Sábado 15 de agosto, a las 8:00 de la mañana, en el solar de atrás. Traigan cuma, un balde y muchas ganas. Los esperamos: la escuela es de todos.'
  },
  {
    q: 'Tu grado va a vender pan con café el viernes en el recreo para juntar dinero para la excursión de fin de año. Escribe el anuncio que van a pegar en el portón de la escuela.',
    hint: '💡 Pista: pon el precio y para qué es la venta. Un anuncio sin precio deja a la gente preguntando y no compra.',
    rubric: ['✓ Se entiende de un vistazo: título llamativo y letra grande', '✓ Dice qué se vende, qué día, dónde y cuánto cuesta', '✓ Explica para qué es el dinero, que es lo que anima a comprar'],
    suggested: '¡PAN CON CAFÉ, CALIENTITO! Este viernes en el recreo, en el corredor de quinto grado. Pan L.5 y café L.5. Todo lo que juntemos es para la excursión de fin de año. ¡Ayúdanos comprando!'
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
  {q:'El número mixto 3 1/2 es igual a la fracción impropia 7/2.',a:true},
  {q:'El resultado de 2/7 + 3/7 es 5/14.',a:false},
  {q:'El radio de un círculo mide la mitad del diámetro.',a:true},
  {q:'El área de un rectángulo de 3 cm de ancho y 5 cm de largo es 8 cm².',a:false},
  {q:'Un decágono tiene diez lados y diez ángulos.',a:true},
  {q:'El M.C.D. de 18 y 24 es 12.',a:false},
  {q:'Al descomponer 20 en factores primos se obtiene 4 × 5.',a:false},
  {q:'La longitud de una circunferencia de 10 cm de diámetro es 31.4 cm.',a:true}
];
const evalTFBankEsp=[
  {q:'El tema de un texto es de lo que trata en general, no un detalle suelto.',a:true},
  {q:'Un aviso anuncia algo que va a pasar y dice dónde y cuándo será.',a:true},
  {q:'Cuando aparece una palabra desconocida, las palabras que la rodean ayudan a descubrir qué significa.',a:true},
  {q:'En una carta el saludo va al principio y la firma va al final.',a:true},
  {q:'Un texto informativo inventa personajes y aventuras para entretener.',a:false},
  {q:'Una frase hecha como «meter la pata» significa lo mismo que sus palabras por separado.',a:false},
  {q:'En un instructivo los pasos se pueden hacer en cualquier orden.',a:false}
];
// Banco de selección múltiple de las DOS materias (el Campeonísimo lo lee tal
// cual con «Actualizar banco»; el campo materia decide en qué prueba sale).
/* Los ítems de Matemáticas van CORTOS a propósito: la prueba impresa tiene
   que caber en una hoja carta y esta sección se pinta a dos columnas. Los
   de Español pueden ser largos, que ahí el mini-texto es la pregunta. */
const evalMCBank=[
  {materia:'mat',q:'¿Qué fracción es equivalente a 2/3?',o:['a) 3/2','b) 6/8','c) 4/9','d) 8/12'],a:3},
  {materia:'mat',q:'¿Cómo se escribe el número 14 en números romanos?',o:['a) IVX','b) XVI','c) XIV','d) VIX'],a:2},
  {materia:'mat',q:'¿Cuál es el resultado de 1/9 + 2/9 + 4/9?',o:['a) 7/9','b) 7/27','c) 6/9','d) 8/9'],a:0},
  {materia:'mat',q:'Un barril tenía 5/6 de agua y se sacó 1/3 del barril. ¿Qué parte quedó?',o:['a) 4/3','b) 1/2','c) 2/6','d) 4/9'],a:1},
  {materia:'mat',q:'En la pulpería la libra de azúcar cuesta L.14.50. ¿Cuánto se paga por 6 libras?',o:['a) L.20.50','b) L.78.00','c) L.8.70','d) L.87.00'],a:3},
  {materia:'mat',q:'¿Cuál es el resultado de 84.6 ÷ 6?',o:['a) 14.1','b) 1.41','c) 14.6','d) 141'],a:0},
  {materia:'mat',q:'La banda ensaya cada 4 días y el equipo entrena cada 6. Si hoy coincidieron, ¿en cuántos días vuelven a coincidir?',o:['a) 10 días','b) 24 días','c) 12 días','d) 2 días'],a:2},
  {materia:'mat',q:'El terreno de don Justo es un triángulo de 8 m de base y 5 m de altura. ¿Cuál es su área?',o:['a) 13 m²','b) 20 m²','c) 26 m²','d) 40 m²'],a:1},
  {materia:'mat',q:'Ana caminó 1 1/2 km en la mañana y 2 1/4 km en la tarde. ¿Cuánto caminó en todo el día?',o:['a) 3 2/6 km','b) 3 1/4 km','c) 3 3/4 km','d) 4 1/4 km'],a:2},
  {materia:'mat',q:'¿Cuáles son todos los divisores de 28?',o:['a) 1, 2, 7, 28','b) 1, 4, 7, 28','c) 1, 2, 4, 6, 14, 28','d) 1, 2, 4, 7, 14, 28'],a:3},
  {materia:'esp',q:'Las ruinas de Copán están en el occidente de Honduras. Allí quedaron templos de piedra, escalinatas anchas y figuras talladas por los mayas hace más de mil años. Cada año llegan a esas ruinas visitantes de todo el mundo, y del turismo viven muchas familias del pueblo.\n\n¿De qué trata principalmente el texto?',o:['a) De las escalinatas de piedra.','b) De los visitantes que llegan cada año.','c) De las familias que viven del turismo.','d) De las ruinas de Copán y de lo que significan.'],a:3},
  {materia:'esp',q:'Los gansos avisan. Apenas oyen un ruido extraño estiran el cuello y empiezan a graznar todos juntos, y no se callan hasta que alguien sale a ver. Por eso en muchas fincas los tienen sueltos en el patio.\n\nSegún el texto, ¿para qué tienen gansos sueltos en las fincas?',o:['a) Para que avisen cuando algo se acerca.','b) Para que se coman la hierba del patio.','c) Para que cuiden a las gallinas.','d) Para venderlos en el mercado.'],a:0},
  {materia:'esp',q:'En una manada de leones casi siempre cazan las hembras, y el león macho se queda cuidando el territorio. Ellas salen al caer la tarde: a esa hora baja el calor y su color pardo se pierde entre el pasto seco.\n\n¿Por qué les conviene cazar al caer la tarde?',o:['a) Porque a esa hora duermen todos los venados.','b) Porque hace menos calor y cuesta más verlas.','c) Porque de noche corren mucho más rápido.','d) Porque el macho sale a cazar con ellas.'],a:1},
  {materia:'esp',q:'Desde el patio de la escuela se ve la montaña. Es tan alta que la punta se pierde entre las nubes, y está vestida de pinos de abajo arriba. Por sus laderas bajan dos quebradas de agua clara y en las mañanas la cubre una neblina blanca.\n\nSegún el texto, ¿cómo es la montaña?',o:['a) Pelada y seca.','b) Baja y rocosa.','c) Alta, boscosa y con agua.','d) Caliente y arenosa.'],a:2},
  {materia:'esp',q:'Los huesos del cuerpo son duros, pero no son macizos: por dentro tienen una parte esponjosa, llena de huecos. Gracias a eso el esqueleto sostiene el cuerpo entero sin pesar demasiado.\n\n¿Qué significa en el texto la palabra macizos?',o:['a) llenos por dentro','b) muy pesados','c) blandos','d) quebradizos'],a:0},
  {materia:'esp',q:'La maestra le preguntó tres veces y Óscar no contestó nada. Estaba en la luna: miraba por la ventana las nubes que iban pasando.\n\n¿Qué significa en el texto la frase «estaba en la luna»?',o:['a) Que se había dormido en el pupitre.','b) Que estaba distraído, pensando en otra cosa.','c) Que se había salido del aula.','d) Que estaba enojado con la maestra.'],a:1},
  {materia:'esp',q:'¡GRAN FERIA DEL LIBRO! Sábado 23 de agosto, de 9 de la mañana a 4 de la tarde, en el parque central de Comayagua. Habrá cuentacuentos, venta de libros usados y concurso de lectura. Entrada libre.\n\n¿Qué se va a realizar en el parque central?',o:['a) Una feria del libro.','b) Un partido de futbol.','c) Una venta de comida.','d) Una reunión de padres.'],a:0},
  {materia:'esp',q:'Para sembrar frijol, afloje primero la tierra con el azadón. Después haga hoyos de dos dedos de hondo y ponga tres granos en cada uno. Al final tápelos con tierra suelta y riegue despacio.\n\nSegún el texto, ¿qué se debe hacer antes de poner los granos?',o:['a) Regar despacio.','b) Tapar los hoyos con tierra suelta.','c) Contar los granos uno por uno.','d) Aflojar la tierra y hacer los hoyos.'],a:3}
];
const evalCPBankMat=[
  /* El espacio del número mixto no es adorno: «4 2/5» y «42/5» son dos
     números distintos, y dar por bueno el pegado premia justo el error que
     enseña a evitar la sección de Errores Comunes. */
  {q:'La fracción impropia 22/5 escrita como número mixto es ___.',a:'4 2/5',acc:['4 2/5']},
  {q:'Entre las fracciones 3/8 y 3/5, la menor es ___.',a:'3/8',acc:['3/8']},
  {q:'Un pentágono regular tiene 40 cm de perímetro. Cada lado mide ___ cm.',a:'8',acc:['8','ocho']},
  {q:'El resultado de 2.5 × 10 es ___.',a:'25',acc:['25','25.0','veinticinco']},
  {q:'Al descomponer 18 en factores primos se obtiene 2 × 3 × ___.',a:'3',acc:['3','tres']},
  {q:'La longitud de una circunferencia de 6 cm de diámetro es ___ cm.',a:'18.84',acc:['18.84','18,84']},
  {q:'En la recta numérica, el punto que está a la mitad entre 3 y 4 se lee ___.',a:'3.5',acc:['3.5','3,5','35/10']},
  {q:'Una figura cubre 12 cuadritos de 1 cm² cada uno. Su área es ___ cm².',a:'12',acc:['12','doce']}
];
const evalCPBankEsp=[
  {q:'La lluvia dejó el camino lleno de lodo y por eso el bus avanzaba muy ___.',a:'despacio',acc:['despacio','lento','lentamente']},
  {q:'El maíz se muele en el molino para sacar la ___ de las tortillas.',a:'masa',acc:['masa']},
  {q:'Antes de comer, los niños se ___ las manos con agua y jabón.',a:'lavan',acc:['lavan','lavaron','lavaban']},
  {q:'En una carta, después del saludo va el ___ del mensaje.',a:'cuerpo',acc:['cuerpo']},
  {q:'El texto que da los pasos en orden para hacer algo se llama ___.',a:'instructivo',acc:['instructivo','texto instructivo']},
  {q:'Aquello de lo que trata un texto en general es su ___.',a:'tema',acc:['tema']},
  {q:'El anuncio de la feria dice el día, la hora y el ___ donde será.',a:'lugar',acc:['lugar','sitio']}
];
const evalPRBankMat=[
  {term:'Fracción impropia',def:'Aquella cuyo numerador es mayor que el denominador'},
  {term:'Número mixto',def:'Se escribe con un entero y una fracción juntos'},
  {term:'Radio',def:'Va del centro del círculo hasta la orilla'},
  {term:'Diámetro',def:'Cruza el círculo por el centro, de orilla a orilla'},
  {term:'Divisor',def:'Número que cabe exacto en otro, sin dejar residuo'},
  {term:'Número primo',def:'Solo se divide entre uno y entre sí mismo'},
  {term:'Perímetro',def:'Lo que mide el contorno de una figura'},
  {term:'Eneágono',def:'Polígono de nueve lados y nueve ángulos'}
];
const evalPRBankEsp=[
  {term:'Tema',def:'De qué habla el texto entero, no una sola parte'},
  {term:'Carta',def:'Mensaje escrito que se le envía a una persona'},
  {term:'Anuncio',def:'Avisa de algo que va a pasar y llama la atención'},
  {term:'Inferencia',def:'Lo que se entiende aunque el texto no lo diga'},
  {term:'Descripción',def:'Cuenta cómo es una persona, un animal o un lugar'},
  {term:'Texto informativo',def:'Da a conocer hechos verdaderos sobre un tema'},
  {term:'Frase hecha',def:'Dicho cuyo significado no es el de sus palabras sueltas'}
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
  const pt=document.getElementById('eval-print-title'); if(pt) pt.textContent=`Evaluación de Repaso · Prueba de Fin de Grado 5º · ${M.nombre}`;
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
const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Prueba de ${M.nombre} · Repaso de Fin de Grado 5º · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:12pt;color:#111;background:#fff;padding:4mm 6mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.35rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;color:${M.acc};}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:${M.acc};margin-top:0.15rem;font-weight:700;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.2rem 0.5rem;margin:0.34rem 0 0.2rem;border-left:4px solid ${M.acc};background:${M.bg};display:flex;justify-content:space-between;align-items:center;color:${M.acc};break-inside:avoid;page-break-inside:avoid;}.qn{font-weight:700;min-width:22px;flex-shrink:0;color:${M.acc};}.tf-row{display:flex;align-items:flex-start;gap:0.3rem;font-size:10.5pt;line-height:1.35;padding:0.16rem 0.2rem;border-bottom:1px solid #eee;break-inside:avoid;page-break-inside:avoid;}.tf-blank{display:inline-block;min-width:42px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.2rem;margin-top:0.2rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.2rem 0.4rem;margin-bottom:0.14rem;break-inside:avoid;page-break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.35;display:flex;gap:0.3rem;margin-bottom:0.12rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.14rem 0.55rem;}.mc-grid.mc-una-col{grid-template-columns:1fr;}.mc-opts{display:grid;grid-template-columns:repeat(2,1fr);gap:0.08rem 0.25rem;margin-left:1.3rem;}.mc-opt{font-size:9.5pt;display:flex;align-items:center;gap:0.22rem;}.mc-circ{display:inline-block;width:11px;height:11px;border:1.4px solid #333;border-radius:50%;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.35;padding:0.14rem 0.2rem;border-bottom:1px solid #eee;break-inside:avoid;page-break-inside:avoid;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:130px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{break-inside:avoid;page-break-inside:avoid;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.12rem 0.5rem;margin-top:0.1rem;}.pr-head{font-size:9pt;font-weight:700;color:${M.acc};margin-bottom:0.12rem;}.pr-item{font-size:10pt;padding:0.13rem 0.32rem;background:${M.bg};border-radius:3px;margin-bottom:0.08rem;display:flex;align-items:center;gap:0.22rem;line-height:1.2;}.pr-num{font-weight:700;color:${M.acc};min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid ${M.acc};padding-bottom:0.35rem;margin-bottom:0.5rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;color:${M.acc};}.p-sub{font-size:9pt;color:${M.acc};font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid ${M.borde};border-radius:4px;padding:0.35rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}.p-ttl{font-size:11pt;font-weight:700;color:${M.acc};border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:${M.acc};}.pa{color:#007a00;font-weight:700;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:${M.acc};font-weight:700;font-style:italic;}.obt-lbl{font-weight:700;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid ${M.acc};height:12px;}.obt-pct{font-weight:700;}.total-row{display:flex;align-items:baseline;justify-content:flex-end;gap:7px;font-size:11pt;color:${M.acc};font-weight:700;font-style:italic;margin-top:0.28rem;padding:0.15rem 0.5rem;background:${M.bg};border-radius:4px;break-inside:avoid;page-break-inside:avoid;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid ${M.acc};}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}${typeof Fr!=="undefined"?Fr.css:""}.fr{font-size:0.8em;margin:0 0.06em;}.fr>b{padding:0 0.13em;}.fr>b.fd{margin-top:0.03em;padding-top:0.03em;}@media print{@page{size:letter portrait;margin:8mm 10mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación de Repaso · Prueba de Fin de Grado 5º · ${M.nombre} · Educación Básica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 4 secciones × 5 preguntas × 5 pts c/u · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✔ PAUTA DOCENTE: Prueba de ${M.nombre} · Repaso de Fin de Grado 5º · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">100 pts | 4 secciones × 5 preguntas × 5 pts | ${M.nombre} · Educación Básica</div></div><div class="p-grid">${pR}</div>
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

/* La prueba operativa de 5º repasa lo que en 5º se ESCRIBE con la mano:
   fracciones (con números mixtos en los dos sentidos), decimales que se
   multiplican y se dividen, la teoría de números (divisores, factores
   primos, m.c.m. y M.C.D.), tres problemas y un reto de dos pasos con la
   circunferencia. Fuera quedaron el volumen, el promedio y los viajes con
   velocidad: son de 6º. */

// I. Fracciones (5 × 4 = 20 pts): sumar, restar y convertir a número mixto
const _OP_DENS=[[2,4],[3,6],[2,6],[4,8],[5,10],[2,3],[3,4],[2,5],[4,6],[3,5],[6,8],[4,10]];
function genOpFracciones(){
  const items=[];
  // 1: suma homogénea, que es como arranca la prueba real
  { const d=[4,5,6,8,10][_opRint(0,4)], n1=_opRint(1,d-1), n2=_opRint(1,d-1);
    items.push({ text:`Calcula y simplifica: ${n1}/${d} + ${n2}/${d} =`, ansTxt:_accFrac(n1+n2,d), ansShow:_fmtFrac(n1+n2,d) }); }
  // 2: suma heterogénea
  { const par=_OP_DENS[_opRint(0,_OP_DENS.length-1)], d1=par[0], d2=par[1], comun=_mcmDe(d1,d2);
    const n1=_opRint(1,d1-1), n2=_opRint(1,d2-1);
    const rn=n1*(comun/d1)+n2*(comun/d2);
    items.push({ text:`Calcula y simplifica: ${n1}/${d1} + ${n2}/${d2} =`, ansTxt:_accFrac(rn,comun), ansShow:_fmtFrac(rn,comun) }); }
  // 3: resta heterogénea. El minuendo se pone SIEMPRE arriba y nunca se
  //    repite el mismo valor: una resta que da 0 o negativa no es de 5º.
  { const par=_OP_DENS[_opRint(0,_OP_DENS.length-1)], d1=par[0], d2=par[1], comun=_mcmDe(d1,d2);
    const n1=_opRint(1,d1-1); let n2=_opRint(1,d2-1);
    const a=n1*(comun/d1); let b=n2*(comun/d2);
    /* Si las dos valen lo mismo se mueve el SEGUNDO numerador, nunca el
       primero: con d1 = 2 el primero solo puede ser 1, y bajarlo dejaría un
       «0/2» impreso en el examen. El segundo denominador nunca baja de 3,
       así que siempre hay hueco para moverlo sin salirse. */
    if(a===b){ n2=n2>1?n2-1:n2+1; b=n2*(comun/d2); }
    const arriba=a>b?[n1,d1]:[n2,d2], abajo=a>b?[n2,d2]:[n1,d1];
    items.push({ text:`Calcula y simplifica: ${arriba[0]}/${arriba[1]} − ${abajo[0]}/${abajo[1]} =`, ansTxt:_accFrac(Math.abs(a-b),comun), ansShow:_fmtFrac(Math.abs(a-b),comun) }); }
  // 4: número mixto a fracción impropia
  { let d,e,n; do{ d=_opRint(3,9); e=_opRint(1,5); n=_opRint(1,d-1); }while(_mcdDe(n,d)!==1);
    items.push({ text:`Escribe ${e} ${n}/${d} como fracción impropia:`, ansTxt:[`${e*d+n}/${d}`], ansShow:`${e*d+n}/${d}` }); }
  // 5: fracción impropia a número mixto
  /* El espacio entre el entero y la fracción NO es un detalle de estilo:
     «4 1/5» y «41/5» son dos números distintos (4.2 y 8.2). Pegarlos es
     justo el error que enseña a evitar la sección de Errores Comunes
     («2 3/5 = 23/5»), así que aquí se acepta UNA sola forma: con espacio.
     Darlo por bueno le pondría 4 puntos al error que se está corrigiendo. */
  { let d,e,n; do{ d=_opRint(3,9); e=_opRint(1,5); n=_opRint(1,d-1); }while(_mcdDe(n,d)!==1);
    items.push({ text:`Escribe ${e*d+n}/${d} como número mixto:`, ansTxt:[`${e} ${n}/${d}`], ansShow:`${e} ${n}/${d}` }); }
  return items;
}
// II. Decimales (5 × 4 = 20 pts): multiplicar y dividir, con lempiras
function genOpDecimales(){
  const items=[];
  const prods=['frijoles','arroz','azúcar','café','maíz','harina'];
  // Todas las cuentas se arman con ENTEROS y el punto se coloca contando
  // cifras: 5.123 × 85 en coma flotante da 435.45500000000004, y ese número
  // acabaría impreso en 43 exámenes.
  /* Los que acabarían en cero se vuelven a sortear: «1.010 × 85» y
     «114.0 ÷ 12» son cuentas correctas, pero enseñan un decimal escrito
     como no lo escribe nadie y el alumno se queda dudando de si sobra o
     falta una cifra.
     El sorteo cuida el FACTOR; el RESULTADO lo cuida _decTrim, porque
     7.855 × 44 da 345.620 y la pauta impresa diría «345.620» donde el
     alumno que hizo bien la cuenta escribió 345.62. */
  { let ai; do{ ai=_opRint(1005,9995); }while(ai%10===0);
    const b=_opRint(11,99);
    items.push({ text:`Calcula: ${_decStr(ai,3)} × ${b} =`, ansNum:ai*b/1000, ansShow:_decTrim(_decStr(ai*b,3)) }); }
  { let ai; do{ ai=_opRint(105,9995); }while(ai%10===0);
    items.push({ text:`Calcula: ${_decStr(ai,2)} × 10 =`, ansNum:ai/10, ansShow:_decStr(ai,1) }); }
  { let ci,dv; do{ ci=_opRint(15,95); dv=_opRint(2,12); }while((ci*dv)%10===0);
    items.push({ text:`Calcula: ${_decStr(ci*dv,1)} ÷ ${dv} =`, ansNum:ci/10, ansShow:_decStr(ci,1) }); }
  { const pi=_opRint(550,6000), libras=_opRint(2,9);
    items.push({ text:`La libra de ${prods[_opRint(0,prods.length-1)]} cuesta L.${_decStr(pi,2)}. ¿Cuánto cuestan ${libras} libras?`, ansNum:pi*libras/100, ansShow:'L.'+_decStr(pi*libras,2) }); }
  { const pi=_opRint(1200,4500), libras=_opRint(2,8);
    items.push({ text:`Se pagaron L.${_decStr(pi*libras,2)} por ${libras} libras de queso. ¿Cuánto cuesta cada libra?`, ansNum:pi/100, ansShow:'L.'+_decStr(pi,2) }); }
  return items;
}
// III. Divisores, factores primos, m.c.m. y M.C.D. (5 × 4 = 20 pts)
const _OP_DIVISORES=[12,18,20,24,28,30,32,40,42,45,50,54,63,66,70];
const _OP_FACTORES=[12,18,20,24,28,30,36,40,42,44,45,50,63,75,84,90];
function genOpTeoria(){
  const items=[];
  const paresMcm=[[4,6],[6,8],[10,15],[12,18],[8,12],[6,9],[4,10],[5,6]];
  const paresMcd=[[12,18],[20,30],[24,36],[16,24],[36,48],[18,27],[40,60]];
  { const n=_OP_DIVISORES[_opRint(0,_OP_DIVISORES.length-1)], ds=_divisoresDe(n);
    /* Se aceptan las dos formas de escribirlos: con comas y sin ellas. El
       calificador quita los signos, así que «1, 2, 3» y «1,2,3» no llegan
       iguales y el alumno que los separó bien se quedaría sin su punto. */
    items.push({ text:`Escribe todos los divisores de ${n}, de menor a mayor:`, ansTxt:[ds.join(', '),ds.join('')], ansShow:ds.join(', ') }); }
  { const n=_OP_FACTORES[_opRint(0,_OP_FACTORES.length-1)], f=_factoresPrimos(n);
    // En el teléfono no hay tecla «×»: se acepta la x, el punto y el espacio
    items.push({ text:`Descompón ${n} en factores primos:`, ansTxt:[f.join(' x '),f.join('x'),f.join(' '),f.join('')], ansShow:f.join(' × ') }); }
  /* El segundo par se sortea EXCLUYENDO el primero. Sin eso, una de cada
     ocho formas imprimía dos veces «Calcula el m.c.m. de 12 y 18»: ocho
     de los veinte puntos de la sección en una sola cuenta, y el alumno
     que la sabe se lleva el doble por saber lo mismo. */
  { let p1,p2;
    p1=paresMcm[_opRint(0,paresMcm.length-1)];
    do{ p2=paresMcm[_opRint(0,paresMcm.length-1)]; }while(p2===p1);
    [p1,p2].forEach(p=>items.push({ text:`Calcula el m.c.m. de ${p[0]} y ${p[1]}.`, ansNum:_mcmDe(p[0],p[1]), ansShow:String(_mcmDe(p[0],p[1])) })); }
  { const p=paresMcd[_opRint(0,paresMcd.length-1)];
    items.push({ text:`Calcula el M.C.D. de ${p[0]} y ${p[1]}.`, ansNum:_mcdDe(p[0],p[1]), ansShow:String(_mcdDe(p[0],p[1])) }); }
  return items;
}
// IV. Problemas de la vida real (3 × 10 = 30 pts)
const _OP_TAREAS=[[4,6],[6,9],[8,12],[10,15],[6,8],[9,12],[4,10],[5,6],[6,10]];
// De cinco lados en adelante: «un triángulo regular» y «un cuadrado regular»
// no los dice nadie en un aula, aunque sean correctos.
const _OP_FIGURAS=[[5,'pentágono'],[6,'hexágono'],[8,'octágono'],[9,'eneágono'],[10,'decágono']];
function genOpProblemas(){
  const items=[];
  { // compra y vuelto: el billete se elige DESPUÉS del gasto, así nunca sale negativo
    const pi=_opRint(2500,6500), cant=_opRint(2,5); const gasto=pi*cant;
    const billete=[100,200,500].find(v=>v*100>gasto);
    const vuelto=billete*100-gasto;
    items.push({ text:`En la pulpería, el litro de aceite cuesta L.${_decStr(pi,2)}. Doña Marta compra ${cant} litros y paga con un billete de L.${billete}.00. ¿Cuánto recibe de vuelto?`, ansNum:vuelto/100, ansShow:`L.${_decStr(vuelto,2)}: gastó L.${_decStr(gasto,2)}` }); }
  { const p=_OP_TAREAS[_opRint(0,_OP_TAREAS.length-1)];
    items.push({ text:`Don Chepe riega el vivero cada ${p[0]} días y le echa abono cada ${p[1]} días. Hoy hizo las dos cosas. ¿Dentro de cuántos días vuelve a hacer las dos el mismo día?`, ansNum:_mcmDe(p[0],p[1]), ansShow:`${_mcmDe(p[0],p[1])} días: es el m.c.m. de ${p[0]} y ${p[1]}` }); }
  { const tipo=_opRint(0,3);
    if(tipo===0){ const b=_opRint(6,25), h=_opRint(4,18);
      items.push({ text:`Un solar rectangular mide ${b} m de largo y ${h} m de ancho. ¿Cuántos metros cuadrados tiene?`, ansNum:b*h, ansShow:`${b*h} m²: ${b} × ${h}` }); }
    else if(tipo===1){ const b=_opRint(6,24), h=2*_opRint(2,9); // la altura va par para que la mitad salga exacta
      items.push({ text:`Un rótulo con forma de triángulo mide ${b} cm de base y ${h} cm de altura. ¿Cuál es su área?`, ansNum:b*h/2, ansShow:`${b*h/2} cm²: (${b} × ${h}) ÷ 2` }); }
    else if(tipo===2){ const fig=_OP_FIGURAS[_opRint(0,_OP_FIGURAS.length-1)], lado=_opRint(8,70);
      items.push({ text:`El contorno de un ${fig[1]} regular mide ${fig[0]*lado} cm. ¿Cuánto mide cada uno de sus ${fig[0]} lados?`, ansNum:lado, ansShow:`${lado} cm: ${fig[0]*lado} ÷ ${fig[0]}` }); }
    else { const d=5*_opRint(2,12);
      items.push({ text:`Una tapadera redonda tiene ${d} cm de diámetro. ¿Cuánto mide su circunferencia? (π = 3.14)`, ansNum:314*d/100, ansShow:`${_decTrim(_decStr(314*d,2))} cm: 3.14 × ${d}` }); }
  }
  return items;
}
// V. Reto de la circunferencia (1 × 10 = 10 pts): dos pasos, la vuelta y las vueltas
function genOpMeta(){
  const d=[20,30,40,50,60,80,100][_opRint(0,6)], vueltas=_opRint(2,6);
  const porVuelta=314*(d/10);      // valor × 10: con el diámetro en decenas, la cuenta cabe en un entero
  const total=porVuelta*vueltas;
  return [{ text:`La llanta de la carreta de don Tulio tiene ${d} cm de diámetro. ¿Cuántos centímetros avanza la carreta en ${vueltas} vueltas completas de la llanta? (π = 3.14)`, ansNum:total/10, ansShow:`${_decTrim(_decStr(total,1))} cm: cada vuelta avanza 3.14 × ${d} = ${_decTrim(_decStr(porVuelta,1))} cm, y son ${vueltas} vueltas` }];
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
  s1.innerHTML = '<div class="eval-section-title">I. Fracciones y números mixtos <span class="eval-pts">20 pts · 4 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel básico. Con denominadores distintos, busca el común denominador y SIMPLIFICA el resultado. Escribe la fracción con barra: 3/4, y el número mixto con un espacio: 1 1/4.</p>';
  frItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${Fr(it.text)}</span><input class="eval-cp-input" type="text" data-fr="${i}" autocomplete="off"></div><div class="eval-answer">${Fr(it.ansShow)}</div><div class="eval-item-feedback" id="evalFbFr${i}" aria-live="polite"></div>`;
    s1.appendChild(d);
  });
  out.appendChild(s1);
  const deItems = genOpDecimales();
  const s2 = document.createElement('div');
  s2.innerHTML = '<div class="eval-section-title">II. Decimales <span class="eval-pts">20 pts · 4 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel básico. Multiplica sin punto y colócalo al final contando TODAS las cifras decimales; al dividir, el punto del cociente va encima del punto del dividendo. Comprueba cada división multiplicando.</p>';
  deItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${Fr(it.text)}</span><input class="eval-cp-input" type="text" data-de="${i}" autocomplete="off" inputmode="decimal"></div><div class="eval-answer">${Fr(it.ansShow)}</div><div class="eval-item-feedback" id="evalFbDe${i}" aria-live="polite"></div>`;
    s2.appendChild(d);
  });
  out.appendChild(s2);
  const teItems = genOpTeoria();
  const s3 = document.createElement('div');
  s3.innerHTML = '<div class="eval-section-title">III. Divisores, m.c.m. y M.C.D. <span class="eval-pts">20 pts · 4 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel intermedio. Divisor: el que cabe exacto, sin sobras. Factor primo: el que solo se divide entre 1 y entre él mismo. m.c.m.: el menor múltiplo común. M.C.D.: el mayor divisor común.</p>';
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
  s5.innerHTML = '<div class="eval-section-title">V. Reto de la circunferencia <span class="eval-pts">10 pts</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel desafío. Este problema lleva DOS pasos: primero cuánto avanza en una vuelta y con ese resultado, cuánto en todas.</p>';
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
  if (res) { res.className = 'eval-auto-result ' + (total >= 70 ? 'eval-auto-pass' : 'eval-auto-risk'); res.innerHTML = `<strong>Resultado: ${total}/100 pts</strong><br><span>Fracciones: ${det.fr}/20 · Decimales: ${det.de}/20 · Divisores, m.c.m. y M.C.D.: ${det.te}/20 · Problemas: ${det.pr}/30 · Reto: ${det.me}/10</span>`; }
  if (total >= 70) { pts(8); showToast('🎯 Prueba operativa calificada: ' + total + '/100'); }
  else showToast('🧮 Prueba operativa: ' + total + '/100. Revisa los ítems marcados.');
}

function printEvalOp() {
  if (!window._evalOpData) { showToast('⚠️ Genera una prueba operativa primero'); return; }
  sfx('click');
  const forma = window._currentEvalOpForm || 1; const d = window._evalOpData;
  const filaTabla = (items) => `<table class="rnd-tbl"><tr><th>#</th><th>Ejercicio</th><th>Respuesta</th></tr>${items.map((it, i) => `<tr><td>${i+1}</td><td>${Fr(it.text)}</td><td></td></tr>`).join('')}</table>`;
  let s1 = `<div class="sec-title"><span>I. Fracciones y números mixtos</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Común denominador con el m.c.m. y resultado SIMPLIFICADO. El número mixto se escribe con un espacio: 1 1/4. 4 pts c/u.</p>${filaTabla(d.frItems)}`;
  let s2 = `<div class="sec-title"><span>II. Decimales</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Al multiplicar, el punto se coloca contando todas las cifras decimales; al dividir, va encima del punto del dividendo. 4 pts c/u.</p>${filaTabla(d.deItems)}`;
  let s3 = `<div class="sec-title"><span>III. Divisores, m.c.m. y M.C.D.</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Divisor: el que cabe exacto · m.c.m.: menor múltiplo común · M.C.D.: mayor divisor común. 4 pts c/u.</p>${filaTabla(d.teItems)}`;
  let s4 = `<div class="sec-title"><span>IV. Problemas de la vida real</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 30 pts</span></div></div><p class="opx-instr">Resuelve mostrando tu procedimiento y escribe la respuesta. 10 pts c/u.</p>`;
  d.prItems.forEach((it, i) => { s4 += `<div class="opx-print-row"><span class="qn">${i+1}.</span><span class="prb-text">${Fr(it.text)}</span><span class="opx-blank"></span></div><div class="opx-space"></div>`; });
  let s5 = `<div class="sec-title"><span>V. Reto de la circunferencia</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10 pts</span></div></div><p class="opx-instr">Dos pasos: primero una vuelta y después todas. 10 pts.</p>`;
  d.meItems.forEach((it, i) => { s5 += `<div class="opx-print-row"><span class="qn">${i+1}.</span><span class="prb-text">${Fr(it.text)}</span><span class="opx-blank"></span></div><div class="opx-space"></div>`; });
  let pR = '';
  pR += `<div class="p-sec"><div class="p-ttl">I. Fracciones y números mixtos</div><table class="p-tbl">${d.frItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${Fr(it.ansShow)}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">II. Decimales</div><table class="p-tbl">${d.deItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${Fr(it.ansShow)}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">III. Divisores, m.c.m. y M.C.D.</div><table class="p-tbl">${d.teItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${Fr(it.ansShow)}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">IV. Problemas</div><table class="p-tbl">${d.prItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${Fr(it.ansShow)}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec" style="grid-column:1/-1;"><div class="p-ttl">V. Reto de la circunferencia</div><table class="p-tbl">${d.meItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${Fr(it.ansShow)}</td></tr>`).join('')}</table></div>`;
  const doc = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Prueba Operativa · Repaso de Fin de Grado 5º · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11.5pt;color:#111;background:#fff;padding:4mm 6mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.35rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;color:#1565c0;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:#1565c0;margin-top:0.15rem;font-weight:700;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.45rem 0 0.2rem;border-left:4px solid #1565c0;background:#e3f2fd;display:flex;justify-content:space-between;align-items:center;color:#1565c0;break-inside:avoid;page-break-inside:avoid;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:#1565c0;font-weight:700;font-style:italic;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #1565c0;height:12px;}.qn{font-weight:700;min-width:20px;display:inline-block;color:#1565c0;flex-shrink:0;}.opx-instr{font-size:9pt;color:#555;margin-bottom:0.22rem;}.opx-blank{display:inline-block;width:80px;flex:none;border-bottom:1.5px solid #111;min-height:13px;margin-left:0.3rem;}.opx-print-row{display:flex;align-items:baseline;gap:0.4rem;font-size:10pt;padding:0.16rem 0.1rem;border-bottom:1px dotted #ddd;break-inside:avoid;page-break-inside:avoid;}.opx-space{height:22px;border-bottom:1px dotted #ccc;margin:0 0 2px 20px;}.prb-text{flex:1;line-height:1.35;}.rnd-tbl{width:100%;border-collapse:collapse;font-size:9.5pt;margin-top:0.15rem;}.rnd-tbl th,.rnd-tbl td{border:1px solid #bbb;padding:0.1rem 0.35rem;text-align:left;}.rnd-tbl th{background:#e3f2fd;color:#1565c0;font-size:8.5pt;}.rnd-tbl tr{break-inside:avoid;page-break-inside:avoid;}.total-row{display:flex;align-items:baseline;justify-content:flex-end;gap:7px;font-size:11pt;color:#1565c0;font-weight:700;font-style:italic;margin-top:0.45rem;padding:0.2rem 0.5rem;background:#e3f2fd;border-radius:4px;}.total-row .obt-line{min-width:80px;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #1565c0;padding-bottom:0.3rem;margin-bottom:0.5rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;color:#1565c0;}.p-sub{font-size:9pt;color:#1565c0;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #cce0ff;border-radius:4px;padding:0.35rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}.p-ttl{font-size:11pt;font-weight:700;color:#1565c0;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#1565c0;}.pa{color:#007a00;font-weight:700;font-family:'Courier New',monospace;}.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}${typeof Fr!=="undefined"?Fr.css:""}.fr{font-size:0.8em;margin:0 0.06em;}.fr>b{padding:0 0.13em;}.fr>b.fd{margin-top:0.03em;padding-top:0.03em;}@media print{@page{size:letter portrait;margin:8mm 10mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Examen de Matemáticas: Prueba Operativa · Repaso de Fin de Grado 5º · Educación Básica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 pts · I: 20 · II: 20 · III: 20 · IV: 30 · V: 10 · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✔ PAUTA: Prueba Operativa · Repaso de Fin de Grado 5º · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">100 pts · Matemáticas · Educación Básica</div></div><div class="p-grid">${pR}</div></div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div></body></html>`;
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
  const txt=`${stars} CONSTANCIA DE LOGRO ${stars}\n\n📚 Misión: Prueba de Fin de Grado 5º\n👤 Estudiante: ${name}\n📊 Progreso: ${pct}% completado\n⭐ XP obtenido: ${xp} de ${MXP}${achText?'\n\n🏆 Logros desbloqueados:\n'+achText:''}\n\n${msg}\n\n📅 ${date}\n🏠 Proyecto Educativo M.E.T.A.S\n🌐 policastsapien.com`;
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
