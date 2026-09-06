// Misión Prueba de Fin de Grado: 7º Grado · Repaso General (Español y Matemáticas)
// Ruta de la Meta: repasa el temario completo de la Prueba de Fin de Grado de
// séptimo (números con signo, valor absoluto, decimales, potencias, ecuaciones,
// proporcionalidad, porcentaje y geometría + tema del texto, inferencia,
// significado por el contexto, tipos de texto y escritura).
// El motor es el mismo de 6º; lo que cambia es el contenido del grado.

// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
function compartirMision() {
    const url = window.location.href;
    const texto = `🎓 *Misión Asignada: Prueba de Fin de Grado 7º* 🎓\n\nRepasa Español y Matemáticas de TODO el año: números con signo, valor absoluto, decimales, ecuaciones, proporcionalidad, porcentaje, lectura y escritura. 🏆\n\nDesbloquea *todos los logros* y puedes poner *tus datos* para que tu maestro observe todos tus logros. 📋\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;
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
/* Con valor absoluto a la entrada: en 7º entran los números con signo y
   _mcdDe(−2, 6) devolvía −2, con lo que la fracción salía con el
   denominador negativo («1/−3»). El máximo común divisor no tiene signo. */
function _mcdDe(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a; }
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
  // En 7º el resultado puede ser NEGATIVO, y el alumno lo escribe con el guion
  // del teclado (-3/4) aunque la pantalla se lo enseñe con el signo menos de
  // imprenta (−3/4). Las dos formas valen: el examen mide la fracción, no la
  // tecla que alcanzó. La otra mitad la hace _normTxt, que unifica los signos.
  if (n < 0) acc.slice().forEach(a => { const alt = a.replace(/^-/, '−'); if (alt !== a) acc.push(alt); });
  return acc;
}
// Un número con signo se ESCRIBE con el menos de imprenta (−7), que es como
// viene en el cuadernillo oficial; el guion del teclado (-7) queda para lo que
// el alumno teclea. Todo lo que se le muestra pasa por aquí, así que en la
// pantalla y en el papel el signo se ve siempre igual.
function _sg(n){ return n < 0 ? '−' + Math.abs(n) : String(n); }
// La fracción con su signo delante: −3/4, no -3/4 ni 3/−4
function _fmtFracS(n, d){ return (n < 0 ? '−' : '') + _fmtFrac(Math.abs(n), d); }
// Entre paréntesis cuando el número es negativo: (−7) × 4, nunca −7 × 4
function _par(n){ return n < 0 ? '(−' + Math.abs(n) + ')' : String(n); }

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY = 'repaso_fin_grado_7mo_v1';
let xp = 0, MXP = 250, done = new Set(), evalAnsVisible = false;
// Dos pruebas conceptuales (una por materia) y una operativa, cada una con su forma
let evalMateria = 'mat';
let evalFormNumMat = 1, evalFormNumEsp = 1, evalOpFormNum = 1, evalOpAnsVisible = false, unlockedAch = [], darkMode = false, prevLevel = 0;
const TOTAL_SECTIONS = 17;
const xpTracker = { fc: new Set(), qz: new Set(), cls: new Set(), id: new Set(), cmp: new Set(), reto: new Set(), sopa: new Set(), predice: new Set(), explica: new Set(), memo: new Set(), texto: new Set(), lab1: new Set(), lab2: new Set(), regla: new Set(), det: new Set(), radar: new Set() };

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
  {w:'Número entero',a:'🔢 los <strong>positivos</strong>, el <strong>cero</strong> y los <strong>negativos</strong>, sin partes decimales. el negativo cuenta lo que falta: una deuda, un grado bajo cero.'},
  {w:'Tema del texto',a:'🎯 aquello de lo que trata <strong>todo</strong> el texto. si algo aparece en un solo renglón, es un <strong>detalle</strong>, no el tema.'},
  {w:'Valor absoluto',a:'📏 la <strong>distancia hasta el cero</strong>, y una distancia nunca es negativa: |−9| = 9 y |9| = 9.'},
  {w:'Inferencia',a:'🕵️ la respuesta que el texto <strong>no escribe</strong>, pero que se saca de las <strong>pistas</strong> que sí da.'},
  {w:'Potencia de base negativa',a:'⚡ el signo lo decide el exponente: <strong>par da positivo</strong> y <strong>impar da negativo</strong>. (−2)² = 4 y (−2)³ = −8.'},
  {w:'Significado por el contexto',a:'🔍 la misma palabra cambia según la oración. <strong>no la adivines</strong>: cámbiala por cada opción y mira cuál deja la oración con sentido.'},
  {w:'Ecuación',a:'⚖️ una igualdad con una letra escondida. lo que le hagas a <strong>un lado, hazlo al otro</strong>: así la balanza no se desnivela.'},
  {w:'Expresión',a:'💬 varias palabras que juntas significan <strong>otra cosa</strong>: «no pegar el ojo» es no dormir, no es pegarle a nadie.'},
  {w:'Proporcionalidad directa',a:'📈 si una cantidad <strong>sube</strong>, la otra sube igual. más libras, más lempiras: se resuelve con la regla de tres.'},
  {w:'Cuento dialogado',a:'🗣️ un relato donde los <strong>personajes hablan</strong>. lo que dice cada uno se marca con la <strong>raya de diálogo</strong>, una rayita larga al principio.'},
  {w:'Proporcionalidad inversa',a:'📉 si una cantidad <strong>sube</strong>, la otra <strong>baja</strong>. más obreros, menos días: aquí se multiplica, no se cruza.'},
  {w:'Texto informativo',a:'📄 da <strong>datos reales</strong> sobre un asunto y no inventa personajes. el narrativo cuenta lo que le pasó a alguien.'},
  {w:'Mediatriz',a:'📐 la recta que corta un segmento por su <strong>punto medio</strong> y formando <strong>ángulo recto</strong>: lo parte en dos mitades iguales.'},
  {w:'Mensaje',a:'💡 la <strong>enseñanza</strong> que deja un relato. casi nunca viene escrita: se saca de lo que le pasó al personaje.'}
];
let fcIdx=0;
function upFC(){ document.getElementById('fcInner').classList.remove('flipped'); document.getElementById('fcW').textContent=fcData[fcIdx].w; document.getElementById('fcA').innerHTML=Fr(fcData[fcIdx].a); document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length; }
function flipCard(){ sfx('flip'); document.getElementById('fcInner').classList.toggle('flipped'); if(!xpTracker.fc.has(fcIdx)){ xpTracker.fc.add(fcIdx); pts(1); } if(xpTracker.fc.size===fcData.length){ fin('s-flash'); unlockAchievement('flash_master'); } }
function nextFC(){ sfx('click'); fcIdx=(fcIdx+1)%fcData.length; upFC(); }
function prevFC(){ sfx('click'); fcIdx=(fcIdx-1+fcData.length)%fcData.length; upFC(); }

// ===================== JUEGO: MEMORIA DEL REPASO =====================
const memoPairs=[
  {id:'absoluto',t:'Valor absoluto',d:'📏 |−9| = 9: la distancia hasta el cero'},
  {id:'tema',t:'Tema del texto',d:'🎯 de qué trata TODO el texto, no un renglón'},
  {id:'inversa',t:'Proporcionalidad inversa',d:'📉 más obreros, menos días'},
  {id:'raya',t:'Raya de diálogo',d:'🗣️ marca lo que dice cada personaje'},
  {id:'potencia',t:'La potencia (−3)³',d:'⚡ −27: exponente impar deja el signo menos'},
  {id:'suplemento',t:'Ángulos suplementarios',d:'📐 los dos juntos suman 180°'}
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
// Las cuentas van comprobadas una por una: 14 − 19 = −5 · |−9| = 9 ·
// 12 obreros en la mitad de días que 6 · 3x + 7 = 22 da x = 5 · 30% de 60 = 18.
const qzData=[
  {q:'A las seis de la mañana el termómetro de la montaña marcaba 14 grados y al mediodía marcaba 19. ¿Qué número representa ese cambio de temperatura?',o:['a) +5','b) −5','c) +33','d) −19'],c:0,feedback:'De 14 subió a 19: subió 5 grados, y lo que SUBE se escribe con signo más. Si hubiera bajado de 19 a 14, el cambio sería −5.'},
  {q:'Un texto de cinco renglones habla del río de la aldea: dice que da agua para la milpa, que en él se bañan los niños y que la basura de la orilla lo enferma. ¿Cuál es el TEMA del texto?',o:['a) Los niños que se bañan en el río','b) La basura de la orilla','c) La importancia del río para la aldea y el cuidado que necesita','d) El agua que se usa en la milpa'],c:2,feedback:'El tema abarca los cinco renglones. Los niños, la basura y la milpa aparecen cada uno una sola vez: son detalles del mismo asunto.'},
  {q:'¿Qué es el valor absoluto de un número?',o:['a) El número sin su punto decimal','b) La distancia que hay desde ese número hasta el cero','c) El número escrito al revés','d) El número siempre con signo menos'],c:1,feedback:'|−9| = 9 y |9| = 9: los dos están a nueve pasos del cero. Una distancia nunca se cuenta en negativo.'},
  {q:'Alguien dice: «cuando vi la nota, se me fue el alma a los pies». ¿Qué significa esa expresión en la oración?',o:['a) Que sintió un gran desánimo','b) Que se cayó al suelo','c) Que le dolieron los pies','d) Que salió corriendo'],c:0,feedback:'Es una expresión: las palabras juntas significan otra cosa. Nadie pierde el alma de verdad; lo que cuenta es el desánimo de golpe.'},
  {q:'Seis albañiles levantan una pared en 20 días. Si llegan 12 albañiles a trabajar igual de rápido, ¿qué pasa con los días?',o:['a) Suben a 40, porque hay más gente','b) Se quedan en 20','c) Bajan a 10, porque el doble de gente tarda la mitad','d) Bajan a 18'],c:2,feedback:'Es proporcionalidad inversa: al doblar los trabajadores, el tiempo se parte a la mitad. 6 × 20 = 120, y 120 ÷ 12 = 10 días.'},
  {q:'Un escrito dice: «El anemómetro sirve para medir la velocidad del viento. Se coloca en un lugar alto y sus copas giran con el aire». ¿Qué tipo de texto es?',o:['a) Narrativo, porque cuenta lo que le pasó a alguien','b) Un cuento dialogado, porque alguien habla','c) Informativo, porque da datos reales sobre un asunto','d) Una carta, porque va dirigida a alguien'],c:2,feedback:'No hay personajes ni historia: hay datos sobre un aparato. Eso es un texto informativo.'},
  {q:'En la ecuación 3x + 7 = 22, ¿cuál es el valor de x?',o:['a) x = 15','b) x = 29','c) x = 9','d) x = 5'],c:3,feedback:'Primero se le quitan 7 a los dos lados: 3x = 15. Después se dividen los dos lados entre 3: x = 5.'},
  {q:'Un cuento dice: «Nilo escondió la carta bajo el colchón y no quiso cenar». El texto no explica por qué. ¿Qué tipo de pregunta es «¿por qué Nilo escondió la carta?»?',o:['a) De inferencia, porque la respuesta se saca de las pistas','b) Literal, porque está escrita tal cual','c) De vocabulario, porque pregunta el significado de una palabra','d) De ortografía'],c:0,feedback:'Lo literal se contesta releyendo. Aquí el texto no lo dice: hay que deducirlo de lo que hizo el personaje. Eso es inferir.'},
  {q:'En una sección de séptimo hay 60 alumnos y el 30% participa en la banda de la escuela. ¿Cuántos alumnos son?',o:['a) 30','b) 18','c) 20','d) 6'],c:1,feedback:'El 30% son 30 de cada 100. Se multiplica 60 × 30 y se divide entre 100: 1,800 ÷ 100 = 18 alumnos.'}
];
let qzIdx=0, qzSel=-1, qzDone=false;
function buildQz(){ qzIdx=0; qzSel=-1; qzDone=false; showQz(); }
function showQz(){var _fbQ=document.getElementById('fbQz');if(_fbQ)_fbQ.classList.remove('show');
  if(qzIdx>=qzData.length){ document.getElementById('qzQ').textContent='🎉 ¡Quiz completado!'; document.getElementById('qzOpts').innerHTML=''; fin('s-quiz'); unlockAchievement('primer_quiz'); return; }
  const q=qzData[qzIdx];
  document.getElementById('qzProg').textContent=`Pregunta ${qzIdx+1} de ${qzData.length}`;
  document.getElementById('qzQ').innerHTML=Fr(q.q);
  const opts=document.getElementById('qzOpts'); opts.innerHTML='';
  q.o.forEach((o,i)=>{ const b=document.createElement('button'); b.className='qz-opt'; b.innerHTML=Fr(o); b.onclick=()=>{ if(qzDone)return; document.querySelectorAll('.qz-opt').forEach(x=>x.classList.remove('sel')); b.classList.add('sel'); qzSel=i; sfx('click'); }; opts.appendChild(b); });
  qzDone=false;
}
// El quiz ya NO avanza solo a los 1,6 s. Con el avance automático, el alumno que
// fallaba veía la respuesta correcta medio segundo y desaparecía antes de poder
// leerla; y el «Incorrecto» se quedaba colgado debajo de la pregunta SIGUIENTE,
// que todavía no había contestado. Ahora avanza él, cuando ya la leyó.
function nextQz(){
  if(!qzDone)return fb('fbQz','Primero toca «Verificar».',false);
  qzIdx++; qzSel=-1; qzDone=false; showQz();
}
function checkQz(){
  if(qzSel<0) return fb('fbQz','Selecciona una respuesta.',false);
  qzDone=true;
  const opts=document.querySelectorAll('.qz-opt');
  if(qzSel===qzData[qzIdx].c){ opts[qzSel].classList.add('correct'); fb('fbQz','¡Correcto! +5 XP',true); if(!xpTracker.qz.has(qzIdx)){ xpTracker.qz.add(qzIdx); pts(5); } sfx('ok');  }
  else{ opts[qzSel].classList.add('wrong'); opts[qzData[qzIdx].c].classList.add('correct'); const _fbMsg=qzData[qzIdx].feedback||'Incorrecto. Revisa la respuesta correcta.'; fb('fbQz',_fbMsg,false); sfx('no'); }
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
// El diálogo va entre comillas angulares « » a propósito: en la pantalla de la
// misión no entra ni un guion largo (lo comprueba la sonda), y la raya de
// diálogo ES un guion largo. En el cuaderno el alumno la escribe; aquí se le
// nombra y se le explica en la sección de Escritura.
const textoLargo={
  titulo:'La lata de Marisol',
  texto:'Marisol guardaba en una lata las monedas que le sobraban de la merienda. Quería una calculadora, porque en séptimo grado las cuentas ya no le salían de memoria y en el examen de fin de grado no quería quedarse atrás.\n\nUna tarde su hermano menor llegó llorando al corredor: jugando en el patio había quebrado los anteojos de la abuela. La abuela no lo regañó. Solo se sentó en la puerta a mirar el camino, aunque por el camino no pasara nadie.\n\nEsa noche Marisol no pegó el ojo. Al amanecer contó las monedas, las metió en una bolsa y se fue con su mamá a la óptica del pueblo.\n\nCuando la abuela se puso los anteojos nuevos, enhebró la aguja al primer intento. «Ahora sí veo hasta las hormigas», dijo, y se rió como no se reía desde hacía meses.\n\nLa calculadora podía esperar. Marisol le pidió prestada la suya a su compañera de pupitre y con esa resolvió, número por número, todo el examen.',
  preguntas:[
    {q:'¿De qué trata principalmente el texto?',o:['a) De unos anteojos que se quebraron jugando en el patio.','b) De una muchacha que deja lo suyo para resolver el problema de su abuela.','c) De la calculadora que se necesita en séptimo grado.','d) De las monedas que sobran de la merienda.'],a:1,exp:'El tema abarca el texto entero: Marisol junta, decide y renuncia. Los anteojos, la calculadora y las monedas aparecen cada uno en una parte: son detalles.'},
    {q:'Según el texto, ¿dónde guardaba Marisol las monedas?',o:['a) En una lata.','b) En una bolsa.','c) En su pupitre.','d) En la óptica del pueblo.'],a:0,exp:'La respuesta está escrita tal cual en el primer renglón. La bolsa aparece después, y solo para llevarlas a la óptica.'},
    {q:'¿Por qué la abuela se sentó a mirar el camino, aunque por el camino no pasara nadie?',o:['a) Porque esperaba una visita.','b) Porque estaba enojada con el niño.','c) Porque quería tomar el fresco de la tarde.','d) Porque sin sus anteojos ya no distinguía lo que pasaba.'],a:3,exp:'El texto no lo dice: hay que inferirlo. Se acaban de quebrar sus anteojos, y más adelante, con los nuevos, «ve hasta las hormigas».'},
    {q:'«Esa noche Marisol no pegó el ojo». ¿Qué significa en el texto esa expresión?',o:['a) Que se golpeó un ojo en la oscuridad.','b) Que se durmió muy temprano.','c) Que pasó la noche sin poder dormir.','d) Que lloró hasta el amanecer.'],a:2,exp:'Es una expresión: no se entiende palabra por palabra. Lo confirma lo que sigue, que al amanecer ya estaba contando las monedas.'}
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
    label:['Positivo','Negativo'], headA:'➕ Se anota con signo MÁS', headB:'➖ Se anota con signo MENOS', colA:'positivo', colB:'negativo',
    words:[{w:'Ganó L.250 vendiendo elotes en la feria',t:'positivo'},{w:'Debe L.300 en la pulpería',t:'negativo'},{w:'El río creció 2 metros con el aguacero',t:'positivo'},{w:'La temperatura bajó 4 grados de noche',t:'negativo'},{w:'Recibió un abono de L.150 de su tío',t:'positivo'},{w:'Perdió 6 puntos por llegar tarde',t:'negativo'},{w:'El bus subió 200 metros de altura',t:'positivo'},{w:'El precio del frijol bajó L.15 la libra',t:'negativo'}]
  },
  {
    label:['Un paso','Dos pasos'], headA:'1️⃣ Se resuelve en UN paso', headB:'2️⃣ Necesita DOS pasos', colA:'uno', colB:'dos',
    words:[{w:'5x = 45',t:'uno'},{w:'2x + 5 = 11',t:'dos'},{w:'x + 8 = 20',t:'uno'},{w:'3y − 4 = 11',t:'dos'},{w:'4p = −24',t:'uno'},{w:'5n + 2 = 22',t:'dos'},{w:'m − 9 = 1',t:'uno'},{w:'2t − 7 = −1',t:'dos'}]
  },
  {
    label:['Literal','Inferencia'], headA:'📖 LITERAL: se contesta releyendo', headB:'🕵️ INFERENCIA: se saca de las pistas', colA:'literal', colB:'inferencia',
    words:[{w:'¿Cuántos años tenía el abuelo?',t:'literal'},{w:'Aunque no lo dice, ¿por qué calló la madre?',t:'inferencia'},{w:'¿Dónde guardó el dinero?',t:'literal'},{w:'Por las pistas, ¿en qué mes ocurre el relato?',t:'inferencia'},{w:'¿Qué día salió el bus para Trujillo?',t:'literal'},{w:'¿Qué sentía el niño al esconder la carta?',t:'inferencia'},{w:'¿Cómo se llamaba la perra?',t:'literal'},{w:'¿Qué crees que hará el personaje mañana?',t:'inferencia'}]
  },
  {
    label:['Informativo','Narrativo'], headA:'📄 INFORMATIVO: da datos reales', headB:'📚 NARRATIVO: cuenta una historia', colA:'informa', colB:'relata',
    words:[{w:'El Parque Nacional Celaque queda en el occidente de Honduras',t:'informa'},{w:'Aquella tarde, Nilo escondió la carta bajo el colchón',t:'relata'},{w:'El agua hierve a 100 grados al nivel del mar',t:'informa'},{w:'El caballo relinchó y salió disparado por el potrero',t:'relata'},{w:'El anemómetro mide la velocidad del viento',t:'informa'},{w:'Doña Ada abrió la puerta y se quedó muda',t:'relata'},{w:'Honduras limita al oeste con Guatemala',t:'informa'},{w:'Cuando el bus arrancó, Julia todavía lloraba',t:'relata'}]
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
// Español: sinónimos, conectores y concordancia, como en la prueba real
const idData=[
  {s:['La','maestra','explicó','pausadamente','la','tarea'],c:3,art:'El sinónimo de despacio'},
  {s:['El','camión','no','subió','la','cuesta','porque','iba','muy','cargado'],c:6,art:'El conector que expresa causa'},
  {s:['Los','cerros','de','Yoro','amanecieron','cubierto','de','neblina'],c:5,art:'La palabra que rompe la concordancia'},
  {s:['Don','Tulio','guardó','el','dinero','en','un','sitio','seguro'],c:7,art:'El sinónimo de lugar'},
  {s:['Estudió','toda','la','semana','aunque','estaba','enfermo'],c:4,art:'El conector que opone dos ideas'},
  {s:['Las','gallinas','del','patio','ponía','huevos','cada','día'],c:4,art:'La palabra que rompe la concordancia'},
  {s:['El','abuelo','contó','una','anécdota','muy','graciosa'],c:6,art:'El sinónimo de chistosa'},
  {s:['Mi','tío','es','carpintero','y','mi','primo','albañiles'],c:7,art:'La palabra que rompe la concordancia'}
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
  {s:'El valor absoluto de un número nunca puede ser ___.',opts:['negativo','positivo','cero'],c:0},
  {s:'Para resolver 2x + 6 = 14, a los dos lados se les resta ___.',opts:['2','6','14'],c:1},
  {s:'Si más obreros terminan la obra en menos días, la proporcionalidad es ___.',opts:['inversa','directa','igual'],c:0},
  {s:'Al multiplicar dos números negativos, el resultado es ___.',opts:['negativo','cero','positivo'],c:2},
  {s:'La raya de diálogo sirve para marcar ___.',opts:['el título del cuento','lo que dice cada personaje','el final del texto'],c:1},
  {s:'Se fue la luz; ___, terminamos la tarea con el candil.',opts:['aun así','porque','es decir'],c:0},
  {s:'El tema de un texto es ___.',opts:['la primera oración','el detalle más curioso','aquello de lo que trata todo el texto'],c:2},
  {s:'Buscamos la palabra en el diccionario ___ no entendíamos la oración.',opts:['aunque','porque','además'],c:1}
];
let cmpIdx=0, cmpSel=-1, cmpDone=false;
function showCmp(){var _fbC=document.getElementById('fbCmp');if(_fbC)_fbC.classList.remove('show');
  if(cmpIdx>=cmpData.length){ document.getElementById('cmpSent').innerHTML='🎉 ¡Completado!'; document.getElementById('cmpOpts').innerHTML=''; fin('s-completa'); return; }
  const d=cmpData[cmpIdx];
  document.getElementById('cmpProg').textContent=`Oración ${cmpIdx+1} de ${cmpData.length}`;
  document.getElementById('cmpSent').innerHTML=Fr(d.s.replace('___','<span class="blank">___</span>'));
  const opts=document.getElementById('cmpOpts'); opts.innerHTML=''; cmpSel=-1; cmpDone=false;
  d.opts.forEach((o,i)=>{ const b=document.createElement('button'); b.className='cmp-opt'; b.innerHTML=Fr(o); b.onclick=()=>{ if(cmpDone)return; document.querySelectorAll('.cmp-opt').forEach(x=>x.classList.remove('sel')); b.classList.add('sel'); cmpSel=i; sfx('click'); }; opts.appendChild(b); });
}
// Misma razón que en el quiz: la corrección se lee, no se persigue.
function nextCmp(){
  if(!cmpDone)return fb('fbCmp','Primero toca «Verificar».',false);
  cmpIdx++; cmpSel=-1; cmpDone=false; showCmp();
}
function checkCmp(){
  if(cmpSel<0) return fb('fbCmp','Selecciona una opción.',false);
  cmpDone=true;
  const opts=document.querySelectorAll('.cmp-opt');
  if(cmpSel===cmpData[cmpIdx].c){ opts[cmpSel].classList.add('correct'); document.getElementById('cmpSent').innerHTML=Fr(cmpData[cmpIdx].s.replace('___',`<span class="blank" style="color:var(--jade);border-color:var(--jade)">${cmpData[cmpIdx].opts[cmpSel]}</span>`)); fb('fbCmp','¡Correcto! +5 XP',true); if(!xpTracker.cmp.has(cmpIdx)){ xpTracker.cmp.add(cmpIdx); pts(5); } sfx('ok'); }
  else{ opts[cmpSel].classList.add('wrong'); opts[cmpData[cmpIdx].c].classList.add('correct'); fb('fbCmp','Incorrecto. Revisa bien la respuesta.',false); sfx('no'); }
  
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
    q: 'Sin sacar la cuenta completa: ¿cuál es mayor, |−9| o |6|?',
    opts: ['|−9|', '|6|', 'Son iguales'],
    correct: 0,
    feedback: '¡Correcto! El valor absoluto es la distancia hasta el cero: |−9| = 9 y |6| = 6. El signo menos no lo hace más chico.',
    wrongFeedback: 'La respuesta es |−9|: vale 9, porque está a nueve pasos del cero. |6| vale 6. La barra borra el signo, no el tamaño.',
    explore: 'abs'
  },
  {
    q: 'Cuatro pintores pintan la escuela en 12 días. Si llegan 8 pintores que pintan igual de rápido, ¿tardarán más días o menos?',
    opts: ['Más días', 'Menos días', 'Los mismos días'],
    correct: 1,
    feedback: '¡Muy bien! Es proporcionalidad inversa: al doblarse los pintores, el trabajo se reparte y el tiempo se parte a la mitad. Son 6 días.',
    wrongFeedback: 'La respuesta es menos días: más gente trabajando reparte la misma obra. 4 × 12 = 48, y 48 entre 8 pintores son 6 días.',
    explore: 'inversa'
  },
  {
    q: '«El comal de doña Fina no se enfría. Hace tortillas desde las cuatro, vende quesillo y también atol. En la aldea dicen que su cocina es el reloj del barrio.» ¿Cuál es el tema del texto?',
    opts: ['El quesillo que vende', 'Lo que la cocina de doña Fina significa para la aldea', 'El atol de la mañana'],
    correct: 1,
    feedback: '¡Excelente! El quesillo y el atol aparecen en un solo renglón: son detalles. Todo el texto habla de la cocina y de lo que representa.',
    wrongFeedback: 'El tema es la cocina de doña Fina y lo que significa para la aldea. El quesillo y el atol se nombran una sola vez: son detalles.',
    explore: 'tema'
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
      <button class="pd-explore-btn" onclick="togglePredExplore(${i})" id="pd-btn-${i}">🔍 Explorar la pista</button>
      <div class="pd-explore" id="pd-explore-${i}" style="display:none;"></div>
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
function _buildPredExplore(i,box){
  const type=prediceData[i].explore;
  if(type==='abs'){
    box.innerHTML=`<p class="pd-tip">El valor absoluto se CUENTA en la recta: cuántos pasos hay desde el número hasta el cero. Toca cada uno:</p><div style="display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;margin:0.5rem 0;"><button class="btn btn-pri" onclick="predAbsPaso(${i},-9)">Cuenta los pasos del −9</button><button class="btn btn-pri" onclick="predAbsPaso(${i},6)">Cuenta los pasos del 6</button></div><div class="pd-counter" id="pd-cnt-${i}" style="font-size:0.95rem;">&nbsp;</div><div class="pd-msg" id="pd-msg-${i}">👆 cuenta los dos y compara</div>`;
    box.dataset.vistos='';
  } else if(type==='inversa'){
    box.innerHTML=`<p class="pd-tip">En la proporcionalidad inversa el TRABAJO TOTAL no cambia: se reparte entre más manos. Toca los pasos:</p><div style="display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;margin:0.5rem 0;"><button class="btn btn-pri" onclick="predInvPaso(${i},1)">Paso 1: el trabajo total</button><button class="btn btn-pri" onclick="predInvPaso(${i},2)">Paso 2: repartirlo entre 8</button></div><div class="pd-msg" id="pd-msg-${i}">👆 toca los pasos en orden</div>`;
  } else if(type==='tema'){
    box.innerHTML=`<p class="pd-tip">Truco del examen: si una opción aparece en UN solo renglón, es un detalle. Toca cada candidata para revisarla:</p><div style="display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;margin:0.5rem 0;"><button class="btn btn-pri" onclick="predTemaPista(${i},0)">¿El quesillo?</button><button class="btn btn-pri" onclick="predTemaPista(${i},1)">¿La cocina?</button><button class="btn btn-pri" onclick="predTemaPista(${i},2)">¿El atol?</button></div><div class="pd-msg" id="pd-msg-${i}">👆 revisa cada candidata</div>`;
  }
}
function predAbsPaso(i,n){
  sfx('click');
  const cnt=document.getElementById('pd-cnt-'+i), msg=document.getElementById('pd-msg-'+i);
  const box=document.getElementById('pd-explore-'+i);
  const pasos=Math.abs(n);
  const lado=n<0?'a la izquierda':'a la derecha';
  cnt.innerHTML=`Del <strong>${_sg(n)}</strong> al 0 hay <strong style="color:var(--jade);">${pasos}</strong> pasos (${lado} del cero).`;
  const vistos=new Set((box.dataset.vistos||'').split(',').filter(Boolean)); vistos.add(String(n));
  box.dataset.vistos=[...vistos].join(',');
  if(vistos.size>=2){ msg.innerHTML='🎯 Nueve pasos contra seis: <strong>|−9| es mayor</strong>, aunque el −9 se vea con signo menos. ¡Ya puedes responder abajo!'; sfx('ok'); }
  else{ msg.innerHTML='📏 Esa es una distancia. Ahora cuenta la del otro número y compáralas.'; }
}
function predInvPaso(i,paso){
  sfx('click');
  const msg=document.getElementById('pd-msg-'+i);
  if(paso===1){ msg.innerHTML='🧱 4 pintores × 12 días = <strong>48 días de trabajo de un pintor</strong>. Eso es lo que cuesta pintar la escuela, vengan los que vengan.'; }
  else{ msg.innerHTML='👥 Esos 48 días de trabajo se reparten entre 8 pintores: 48 ÷ 8 = <strong>6 días</strong>. Menos días, no más. ¡Ya puedes responder abajo!'; sfx('ok'); }
}
function predTemaPista(i,cual){
  sfx('click');
  const msg=document.getElementById('pd-msg-'+i);
  if(cual===0){ msg.innerHTML='🧀 El quesillo se nombra UNA sola vez: es un <strong>detalle</strong>, no el tema.'; }
  else if(cual===2){ msg.innerHTML='🥣 El atol también vive en un solo renglón: <strong>detalle</strong>.'; }
  else{ msg.innerHTML='🔥 La cocina está al principio, en el medio y al final: <strong>de ella trata TODO el texto</strong>. ¡Ya puedes responder abajo!'; sfx('ok'); }
}

// ===================== RETO FINAL (dos grupos, con parejas variables) =====================
// El alumno decide a qué grupo pertenece cada elemento antes de que acabe el reloj.
const retoPairs=[
  {
    name:'¿Positivo o negativo? ➕➖', hint:'Al multiplicar y dividir: signos iguales dan más, signos distintos dan menos', btnA:'🔼 POSITIVO', btnB:'🔽 NEGATIVO',
    pool:[
      {w:'(−4)(−3)',t:'A'},{w:'(−3)³',t:'B'},{w:'|−7|',t:'A'},{w:'−6 + 1',t:'B'},
      {w:'(−2)⁴',t:'A'},{w:'(−5)(4)',t:'B'},{w:'−5 + 9',t:'A'},{w:'3 − 10',t:'B'},
      {w:'(−12) ÷ (−4)',t:'A'},{w:'(−18) ÷ 3',t:'B'},{w:'8 − (−2)',t:'A'},{w:'−2 − 7',t:'B'}
    ]
  },
  {
    name:'¿Mayor o menor que −5? 🔢', hint:'En la recta, el mayor es el que queda MÁS A LA DERECHA: −4 es mayor que −9', btnA:'🔼 MAYOR que −5', btnB:'🔽 MENOR que −5',
    pool:[
      {w:'−4',t:'A'},{w:'−6',t:'B'},{w:'0',t:'A'},{w:'−9',t:'B'},
      {w:'−1',t:'A'},{w:'−12',t:'B'},{w:'3',t:'A'},{w:'−7',t:'B'},
      {w:'−2',t:'A'},{w:'−20',t:'B'},{w:'10',t:'A'},{w:'−5.5',t:'B'}
    ]
  },
  {
    name:'¿Tema o detalle? 📖', hint:'Todas hablan del café: el tema abarca el texto entero, el detalle cuenta una parte', btnA:'🎯 TEMA', btnB:'🔎 DETALLE',
    pool:[
      {w:'El café mueve la economía de Honduras',t:'A'},{w:'El grano se seca en el patio de cemento',t:'B'},
      {w:'Sin el café, muchas familias no tendrían trabajo',t:'A'},{w:'La cosecha empieza en noviembre',t:'B'},
      {w:'El café marca el calendario del campo',t:'A'},{w:'Los sacos pesan cien libras',t:'B'},
      {w:'La vida de la aldea gira alrededor del corte',t:'A'},{w:'El beneficio queda a la orilla del río',t:'B'},
      {w:'El café junta el trabajo de toda la familia',t:'A'},{w:'Las manos se tiñen de rojo al cortar',t:'B'}
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
      ['O','U','N','A','S','R','E','V','N','I'],
      ['O','R','O','B','R','A','H','E','U','P'],
      ['V','S','I','E','L','B','E','N','S','U'],
      ['I','A','C','I','G','S','D','T','B','E'],
      ['T','T','A','T','M','O','E','E','V','S'],
      ['A','R','U','P','C','L','H','R','E','S'],
      ['G','P','C','E','C','U','B','O','N','G'],
      ['E','I','E','J','T','T','E','I','R','D'],
      ['N','N','L','V','B','O','H','T','T','O'],
      ['P','O','T','E','N','C','I','A','P','M']],
      words:[
      {w:'ENTERO',cells:[[1,7],[2,7],[3,7],[4,7],[5,7],[6,7]]},
      {w:'ABSOLUTO',cells:[[1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[7,5],[8,5]]},
      {w:'ECUACION',cells:[[7,2],[6,2],[5,2],[4,2],[3,2],[2,2],[1,2],[0,2]]},
      {w:'NEGATIVO',cells:[[8,0],[7,0],[6,0],[5,0],[4,0],[3,0],[2,0],[1,0]]},
      {w:'POTENCIA',cells:[[9,0],[9,1],[9,2],[9,3],[9,4],[9,5],[9,6],[9,7]]},
      {w:'INVERSA',cells:[[0,9],[0,8],[0,7],[0,6],[0,5],[0,4],[0,3]]},
      {w:'RECTA',cells:[[1,4],[2,3],[3,2],[4,1],[5,0]]}] },
    { size:10,
      grid:[
      ['C','I','E','T','N','G','E','M','I','A'],
      ['O','O','R','B','O','E','E','D','N','V'],
      ['V','U','N','G','I','N','A','U','F','J'],
      ['I','O','D','T','S','M','E','D','E','I'],
      ['T','L','C','A','E','G','T','T','R','J'],
      ['A','N','J','T','R','X','N','T','E','T'],
      ['R','E','E','D','P','U','T','C','N','G'],
      ['R','S','O','E','X','V','U','O','C','B'],
      ['A','O','T','N','E','U','C','T','I','N'],
      ['N','D','I','A','L','O','G','O','A','S']],
      words:[
      {w:'CUENTO',cells:[[8,6],[8,5],[8,4],[8,3],[8,2],[8,1]]},
      {w:'DIALOGO',cells:[[9,1],[9,2],[9,3],[9,4],[9,5],[9,6],[9,7]]},
      {w:'INFERENCIA',cells:[[0,8],[1,8],[2,8],[3,8],[4,8],[5,8],[6,8],[7,8],[8,8],[9,8]]},
      {w:'CONTEXTO',cells:[[0,0],[1,1],[2,2],[3,3],[4,4],[5,5],[6,6],[7,7]]},
      {w:'MENSAJE',cells:[[0,7],[1,6],[2,5],[3,4],[4,3],[5,2],[6,1]]},
      {w:'NARRATIVO',cells:[[9,0],[8,0],[7,0],[6,0],[5,0],[4,0],[3,0],[2,0],[1,0]]},
      {w:'EXPRESION',cells:[[8,4],[7,4],[6,4],[5,4],[4,4],[3,4],[2,4],[1,4],[0,4]]},
      {w:'TEMA',cells:[[5,3],[4,4],[3,5],[2,6]]}] }
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

// ===================== LAB 1: LA RECTA DE LOS ENTEROS =====================
/* En 7º la pizza de fracciones ya no enseña nada: lo que se estrena este año
   son los números con signo, y ahí el alumno se pierde por dos cosas que la
   recta resuelve de un vistazo y una definición de memoria no:
   - que −9 es MENOR que −2, aunque el nueve sea más grande que el dos;
   - que el valor absoluto no es «quitarle el signo», sino la DISTANCIA hasta
     el cero: por eso |−9| y |9| valen lo mismo, están a los mismos pasos.
   Por eso al tocar un número se le pinta encima el tramo hasta el cero y se
   le cuentan los pasos. Se ve la distancia, no se recita.
   Los cinco desafíos van en ese orden: ubicar, medir la distancia, comparar,
   encajar entre dos y, al final, sumar caminando sobre la recta. */
const LAB1_RETOS=[
  {t:'ubica', n:-6, txt:'Toca el −6 en la recta'},
  {t:'abs',   n:-7, txt:'El −7 está a 7 pasos del cero. Toca el OTRO número que también está a 7 pasos'},
  {t:'menor', n:-4, txt:'Toca cualquier número MENOR que −4'},
  {t:'entre', a:-8, b:-5, txt:'Toca un número que esté entre el −8 y el −5'},
  {t:'salto', d:-3, p:5, txt:'Párate en el −3 y avanza 5 pasos a la derecha: toca dónde caes'}
];
const LAB1_MIN=-10, LAB1_MAX=10;
let lab1Sel=null, lab1Reto=0;
function _lab1X(n){ return 20 + (n - LAB1_MIN) * 21; }
function lab1Render(){
  const box=document.getElementById('widget-recta-enteros'); if(!box) return;
  const sel=lab1Sel;
  const x0=_lab1X(0);
  let ticks='', etiquetas='', clics='';
  for(let n=LAB1_MIN;n<=LAB1_MAX;n++){
    const x=_lab1X(n), alto=(n%5===0)?9:6;
    ticks+=`<path d="M ${x} ${45-alto} L ${x} ${45+alto}" stroke="var(--dark)" stroke-width="${n===0?2.4:1.4}"></path>`;
    // Los de dos cifras van más chicos: con 21 px por hueco, «−10» a tamaño
    // 11 se monta encima del vecino y la recta deja de leerse.
    etiquetas+=`<text x="${x}" y="${70}" text-anchor="middle" font-size="${Math.abs(n)>=10?9:11}" fill="${n===sel?'var(--pri)':'var(--gray)'}" font-weight="${n===sel?'700':'400'}">${_sg(n)}</text>`;
    clics+=`<rect x="${x-10}" y="6" width="21" height="72" fill="transparent" data-n="${n}" style="cursor:pointer;"></rect>`;
  }
  // El tramo del número hasta el cero: eso es el valor absoluto, dibujado
  let distancia='';
  if(sel!==null&&sel!==0){
    const xs=_lab1X(sel);
    distancia=`<path d="M ${Math.min(xs,x0)} 30 L ${Math.max(xs,x0)} 30" stroke="var(--pri)" stroke-width="4" stroke-linecap="round" opacity="0.75"></path>`+
      `<text x="${(xs+x0)/2}" y="22" text-anchor="middle" font-size="11" fill="var(--pri)" font-weight="700">${Math.abs(sel)} pasos</text>`;
  }
  const marca=sel===null?'':`<circle cx="${_lab1X(sel)}" cy="45" r="7" fill="var(--pri)" stroke="var(--dark)" stroke-width="2"></circle>`;
  const svg=`<svg viewBox="0 0 460 84" style="width:100%;display:block;margin:0 auto;">
      <path d="M 6 45 L 454 45" stroke="var(--dark)" stroke-width="2"></path>
      <path d="M 454 45 L 446 41 L 446 49 Z" fill="var(--dark)"></path>
      <path d="M 6 45 L 14 41 L 14 49 Z" fill="var(--dark)"></path>
      ${distancia}${ticks}${marca}${etiquetas}${clics}
    </svg>`;
  const lectura=sel===null
    ? '👆 Toca un número de la recta'
    : `Elegiste <strong>${_sg(sel)}</strong> · su valor absoluto es <strong>|${_sg(sel)}| = ${Math.abs(sel)}</strong>${sel===0?'':', porque está a '+Math.abs(sel)+' pasos del cero, '+(sel<0?'a la izquierda':'a la derecha')}`;
  const reto=LAB1_RETOS[lab1Reto];
  box.innerHTML=`
    ${svg}
    <p style="text-align:center;font-family:'Fredoka',sans-serif;font-size:1.02rem;margin:0.5rem 0;">${lectura}</p>
    <div style="border:1.5px dashed var(--pri);border-radius:10px;padding:0.6rem 0.8rem;text-align:center;">
      🎯 Desafío ${lab1Reto+1} de ${LAB1_RETOS.length}: <strong>${reto.txt}</strong>
      <div style="margin-top:0.5rem;"><button class="btn btn-g" id="lab1Check">✅ Comprobar</button></div>
    </div>
    <div id="fbLab1" class="fb" role="alert"></div>`;
  box.querySelectorAll('[data-n]').forEach(r=>{ r.onclick=()=>{ lab1Sel=parseInt(r.dataset.n,10); sfx('click'); lab1Render(); }; });
  const chk=document.getElementById('lab1Check');
  if(chk) chk.onclick=()=>{
    const r=LAB1_RETOS[lab1Reto];
    if(lab1Sel===null){ sfx('no'); fb('fbLab1','Primero toca un número de la recta.',false); return; }
    let ok=false, pista='';
    if(r.t==='ubica'){ ok=(lab1Sel===r.n); pista=`Cuenta desde el cero hacia la izquierda: el ${_sg(r.n)} está a ${Math.abs(r.n)} pasos.`; }
    else if(r.t==='abs'){ ok=(Math.abs(lab1Sel)===Math.abs(r.n)&&lab1Sel!==r.n); pista=`Busca del otro lado del cero, a la misma distancia: ${Math.abs(r.n)} pasos a la derecha.`; }
    else if(r.t==='menor'){ ok=(lab1Sel<r.n); pista=`Menor es el que queda MÁS A LA IZQUIERDA que el ${_sg(r.n)}, no el que tiene el número más grande.`; }
    else if(r.t==='entre'){ ok=(lab1Sel>r.a&&lab1Sel<r.b); pista=`Tiene que caer entre los dos, sin ser ninguno de ellos.`; }
    else if(r.t==='salto'){ ok=(lab1Sel===r.d+r.p); pista=`Avanzar a la derecha es SUMAR: ${_sg(r.d)} + ${r.p}.`; }
    if(ok){
      sfx('ok');
      if(!xpTracker.lab1.has(lab1Reto)){ xpTracker.lab1.add(lab1Reto); pts(2); }
      fb('fbLab1',`¡Logrado! El ${_sg(lab1Sel)} cumple lo que pedía el desafío. +2 XP`,true);
      lab1Reto=(lab1Reto+1)%LAB1_RETOS.length; lab1Sel=null;
      if(xpTracker.lab1.size===LAB1_RETOS.length) fin('s-lab');
      setTimeout(lab1Render,1400);
    } else { sfx('no'); fb('fbLab1',`Todavía no: tocaste el ${_sg(lab1Sel)}. ${pista}`,false); }
  };
}

// ===================== LAB 2: LA BALANZA DE LA ECUACIÓN =====================
/* El álgebra de 7º se cae siempre por el mismo sitio: el alumno «pasa el 5 al
   otro lado cambiando de signo» sin saber por qué, y en cuanto la ecuación se
   le complica un poco, pasa lo que no debe. Aquí no se pasa nada: se le hace
   a la balanza LO MISMO DE LOS DOS LADOS y se ve que sigue equilibrada.
   Por eso el alumno no escribe el resultado, ELIGE la operación: lo que se
   está practicando es decidir qué hacer, que es donde se pierde el punto.
   Las cinco ecuaciones traen soluciones negativas a propósito: en 7º un
   resultado con signo menos es una respuesta legítima, no un error. */
const LAB2_RETOS=[
  {a:3, b:5, c:20},    // 3x + 5 = 20 → x = 5
  {a:5, b:-4, c:16},   // 5x − 4 = 16 → x = 4
  {a:2, b:9, c:3},     // 2x + 9 = 3  → x = −3
  {a:6, b:7, c:31},    // 6x + 7 = 31 → x = 4
  {a:4, b:-6, c:-18}   // 4x − 6 = −18 → x = −3
];
let lab2Paso=0, lab2Reto=0;
function _lab2Eq(){
  const r=LAB2_RETOS[lab2Reto];
  if(lab2Paso===0) return ['<strong>' + r.a + 'x</strong> ' + (r.b<0?'− '+Math.abs(r.b):'+ '+r.b), _sg(r.c)];
  if(lab2Paso===1) return ['<strong>' + r.a + 'x</strong>', _sg(r.c - r.b)];
  return ['<strong>x</strong>', _sg((r.c - r.b) / r.a)];
}
/* La buena NO puede caer siempre en el primer botón: el alumno aprendería a
   tocar el de arriba y a no leer. Se rota con el desafío y el paso, que es
   una cuenta y no un sorteo: al volver a pintar después de fallar, los
   botones siguen donde estaban y no se toca por equivocación. */
function _lab2Opciones(){
  const r=LAB2_RETOS[lab2Reto];
  let ops;
  if(lab2Paso===0){
    ops=[{lb:(r.b<0?'Sumar '+Math.abs(r.b):'Restar '+r.b)+' a los dos lados', ok:true},
         {lb:(r.b<0?'Restar '+Math.abs(r.b):'Sumar '+r.b)+' a los dos lados', ok:false},
         {lb:'Dividir los dos lados entre '+r.a, ok:false}];
  } else {
    ops=[{lb:'Dividir los dos lados entre '+r.a, ok:true},
         {lb:'Restar '+r.a+' a los dos lados', ok:false},
         {lb:'Multiplicar los dos lados por '+r.a, ok:false}];
  }
  const giro=(lab2Reto+lab2Paso)%3;
  return ops.slice(giro).concat(ops.slice(0,giro));
}
function lab2Render(){
  const box=document.getElementById('widget-balanza'); if(!box) return;
  const r=LAB2_RETOS[lab2Reto], sol=(r.c-r.b)/r.a;
  const [izq,der]=_lab2Eq();
  const platillo=(txt)=>`<div style="flex:1;min-width:110px;border:2px solid var(--pri);border-radius:12px;padding:0.55rem 0.4rem;text-align:center;font-family:'Fredoka',sans-serif;font-size:1.25rem;background:var(--pri-gl);">${txt}</div>`;
  const resuelta=(lab2Paso>=2);
  const botones=resuelta
    ? `<div style="text-align:center;margin-top:0.6rem;"><button class="btn btn-g" id="lab2Check">✅ Ya está: x = ${_sg(sol)}</button></div>`
    : `<div style="display:flex;flex-direction:column;gap:0.4rem;margin-top:0.6rem;">${_lab2Opciones().map((o,i)=>`<button class="btn btn-d" data-op="${i}" style="width:100%;">${o.lb}</button>`).join('')}</div>`;
  box.innerHTML=`
    <p style="text-align:center;font-size:0.8rem;color:var(--gray);margin-bottom:0.3rem;">⚖️ Lo que le hagas a un lado, hazlo al otro: así la balanza no se desnivela.</p>
    <div style="display:flex;align-items:center;gap:0.5rem;justify-content:center;">
      ${platillo(izq)}<span style="font-family:'Fredoka',sans-serif;font-size:1.5rem;">=</span>${platillo(der)}
    </div>
    <p style="text-align:center;font-size:0.8rem;color:var(--gray);margin:0.45rem 0;">Paso ${Math.min(lab2Paso+1,3)} de 3 · ${resuelta?'la letra quedó sola: eso es resolver la ecuación':'¿qué le haces a los DOS lados?'}</p>
    ${botones}
    <div style="border:1.5px dashed var(--pri);border-radius:10px;padding:0.5rem 0.8rem;text-align:center;margin-top:0.6rem;font-size:0.9rem;">
      🎯 Desafío ${lab2Reto+1} de ${LAB2_RETOS.length}: deja la <strong>x</strong> sola
      <div style="margin-top:0.35rem;"><button class="btn btn-d" id="lab2Reset">🔄 Empezar de nuevo</button></div>
    </div>
    <div id="fbLab2" class="fb" role="alert"></div>`;
  box.querySelectorAll('[data-op]').forEach(b=>{ b.onclick=()=>{
    const op=_lab2Opciones()[parseInt(b.dataset.op,10)];
    if(op.ok){
      sfx('ok'); lab2Paso++;
      fb('fbLab2', lab2Paso===1?`Bien: ${r.b<0?'sumando':'quitando'} ${Math.abs(r.b)} en los dos lados, la balanza sigue equilibrada.`:'Bien: al dividir los dos lados, la letra queda sola.', true);
      setTimeout(lab2Render,900);
    } else {
      sfx('no');
      fb('fbLab2', lab2Paso===0?'Todavía no: primero hay que quitar el número que acompaña a la x, y quitarlo de los DOS lados.':'Todavía no: la x está multiplicada, así que se deshace dividiendo, y de los dos lados.', false);
    }
  }; });
  const rst=document.getElementById('lab2Reset');
  if(rst) rst.onclick=()=>{ sfx('click'); lab2Paso=0; lab2Render(); };
  const chk=document.getElementById('lab2Check');
  if(chk) chk.onclick=()=>{
    sfx('ok');
    if(!xpTracker.lab2.has(lab2Reto)){ xpTracker.lab2.add(lab2Reto); pts(2); }
    fb('fbLab2',`¡Logrado! ${r.a} × ${_par(sol)} ${r.b<0?'− '+Math.abs(r.b):'+ '+r.b} = ${_sg(r.c)}. La comprobación siempre se hace así. +2 XP`,true);
    lab2Reto=(lab2Reto+1)%LAB2_RETOS.length; lab2Paso=0;
    if(xpTracker.lab1.size===LAB1_RETOS.length&&xpTracker.lab2.size===LAB2_RETOS.length) fin('s-lab');
    setTimeout(lab2Render,1600);
  };
}

// ===================== WIDGET: LA REGLA DE TRES =====================
/* El promedio es de 6º. Lo que estrena 7º y no tiene otro sitio donde
   practicarse es la regla de tres, y con sus DOS caras: la directa (más
   libras, más lempiras) y la inversa (más obreros, menos días). Van
   mezcladas a propósito: el alumno que solo practica la directa multiplica
   en cruz siempre, y en el examen la inversa se le lleva el punto.
   La tabla se pinta con las dos filas y el hueco, que es como el maestro la
   dibuja en el pizarrón: lo difícil no es la cuenta, es colocar los datos.
   Los casos salen de una lista comprobada: todos dan resultado ENTERO, para
   que el alumno pueda escribir la respuesta. */
const R3_CASOS=[
  {k:'directa', a:8,  b:320, c:20, u1:'libras de café', u2:'lempiras'},
  {k:'directa', a:12, b:180, c:20, u1:'cuadernos',      u2:'lempiras'},
  {k:'directa', a:3,  b:600, c:7,  u1:'cuadernos',      u2:'gramos'},
  {k:'directa', a:5,  b:20,  c:9,  u1:'sacos de cemento', u2:'metros de pared'},
  {k:'directa', a:4,  b:52,  c:11, u1:'litros de leche', u2:'lempiras'},
  {k:'inversa', a:6,  b:20,  c:12, u1:'albañiles',      u2:'días'},
  {k:'inversa', a:4,  b:30,  c:6,  u1:'personas',       u2:'días que alcanza el agua'},
  {k:'inversa', a:3,  b:8,   c:4,  u1:'tractores',      u2:'horas'},
  {k:'inversa', a:8,  b:15,  c:12, u1:'obreros',        u2:'días que alcanza la comida'},
  {k:'inversa', a:5,  b:24,  c:10, u1:'bombas',         u2:'horas'}
];
let r3Caso=null, reglaAciertos=0;
function _r3Resp(c){ return c.k==='directa' ? c.b*c.c/c.a : c.a*c.b/c.c; }
function reglaNueva(){
  const box=document.getElementById('widget-regla-tres'); if(!box) return;
  let c; do{ c=R3_CASOS[Math.floor(Math.random()*R3_CASOS.length)]; }while(r3Caso&&c===r3Caso);
  r3Caso=c;
  const resp=_r3Resp(c);
  box.innerHTML=`
    <p style="text-align:center;font-size:0.85rem;color:var(--gray);margin-bottom:0.4rem;">Coloca los datos y halla el que falta:</p>
    <table style="width:100%;max-width:340px;margin:0 auto 0.6rem;border-collapse:collapse;text-align:center;font-family:'Fredoka',sans-serif;">
      <tr style="background:var(--pri-gl);"><th style="border:1px solid var(--border);padding:0.3rem;">${c.u1}</th><th style="border:1px solid var(--border);padding:0.3rem;">${c.u2}</th></tr>
      <tr><td style="border:1px solid var(--border);padding:0.4rem;font-size:1.1rem;">${c.a}</td><td style="border:1px solid var(--border);padding:0.4rem;font-size:1.1rem;">${c.b}</td></tr>
      <tr><td style="border:1px solid var(--border);padding:0.4rem;font-size:1.1rem;">${c.c}</td><td style="border:1px solid var(--border);padding:0.4rem;font-size:1.3rem;color:var(--pri);">?</td></tr>
    </table>
    <div style="display:flex;gap:0.5rem;justify-content:center;align-items:center;flex-wrap:wrap;">
      <label for="r3Inp"><strong>Respuesta:</strong></label>
      <input id="r3Inp" class="eval-cp-input" type="text" inputmode="numeric" style="max-width:100px;" autocomplete="off">
      <button class="btn btn-g" id="r3Check">✅ Comprobar</button>
      <button class="btn btn-d" id="r3Next">🔄 Otro caso</button>
    </div>
    <p style="text-align:center;font-size:0.72rem;color:var(--gray);margin-top:0.5rem;">📈 Directa: si una sube, la otra sube · 📉 Inversa: si una sube, la otra baja</p>
    <div id="fbRegla" class="fb" role="alert"></div>`;
  document.getElementById('r3Check').onclick=()=>{
    const val=parseFloat((document.getElementById('r3Inp').value||'').replace(/[^\d.]/g,''));
    if(Math.abs(val-resp)<0.005){
      sfx('ok'); reglaAciertos++;
      if(reglaAciertos<=6&&!xpTracker.regla.has(reglaAciertos)){ xpTracker.regla.add(reglaAciertos); pts(2); }
      const cuenta=c.k==='directa'?`${c.b} × ${c.c} ÷ ${c.a} = ${resp}`:`${c.a} × ${c.b} ÷ ${c.c} = ${resp}`;
      fb('fbRegla',`¡Correcto! Es proporcionalidad <strong>${c.k}</strong>: ${cuenta}. +2 XP`,true);
      setTimeout(reglaNueva,1900);
    } else {
      sfx('no');
      fb('fbRegla', c.k==='directa'
        ? `Todavía no. Aquí si una sube la otra sube: multiplica en CRUZ (${c.b} × ${c.c}) y divide entre ${c.a}.`
        : `Todavía no. Aquí si una sube la otra baja: multiplica los de la PRIMERA fila (${c.a} × ${c.b}) y divide entre ${c.c}.`, false);
    }
  };
  document.getElementById('r3Next').onclick=()=>{ sfx('click'); reglaNueva(); };
}

// ===================== WIDGET: EL DETECTIVE DE LA PALABRA =====================
const detData=[
  {s:['La','maestra','habló','con','voz','serena','a','los','niños'],c:5,pista:'la palabra que significa tranquila'},
  {s:['El','sendero','subía','empinado','hasta','la','cumbre'],c:3,pista:'la palabra que significa muy inclinado'},
  {s:['Don','Chelo','contó','un','relato','asombroso','de','su','juventud'],c:5,pista:'la palabra que significa que causa admiración'},
  {s:['La','cosecha','fue','escasa','por','la','falta','de','lluvia'],c:3,pista:'la palabra que significa poca'},
  {s:['El','muchacho','respondió','con','un','tono','altanero'],c:6,pista:'la palabra que significa orgulloso y grosero'},
  {s:['El','agua','del','pozo','brotaba','cristalina','entre','las','piedras'],c:5,pista:'la palabra que significa transparente'}
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

// ===================== WIDGET: ¿DIRECTA O INVERSA? =====================
/* El m.c.m. y el M.C.D. son de 6º. La confusión de 7º cabe en el mismo
   widget y es esta: el alumno multiplica en cruz SIEMPRE, y con «más
   obreros, menos días» le sale un disparate. Aquí no calcula: decide de un
   toque, que es la decisión que después salva o pierde el problema entero.
   Las situaciones son las mismas familias de la prueba: comprar por libras
   (directa) y repartir un trabajo entre más manos (inversa). */
const radarData=[
  {s:'Ocho libras de café cuestan L.320. ¿Cuánto cuestan 20 libras?',t:'directa'},
  {s:'Seis albañiles levantan un muro en 20 días. ¿Cuántos días tardan 12 albañiles?',t:'inversa'},
  {s:'Un bus gasta 12 galones de combustible en 4 viajes. ¿Cuántos gasta en 10 viajes?',t:'directa'},
  {s:'El agua del tanque alcanza 30 días para 4 personas. ¿Para cuántos días alcanza si son 6?',t:'inversa'},
  {s:'Tres cuadernos pesan 600 gramos. ¿Cuánto pesan 7 cuadernos iguales?',t:'directa'},
  {s:'Tres tractores aran la finca en 8 horas. ¿En cuántas horas la aran 4 tractores?',t:'inversa'},
  {s:'Con 5 sacos de cemento se levantan 20 metros de pared. ¿Y con 9 sacos?',t:'directa'},
  {s:'La comida guardada alcanza 15 días para 8 obreros. ¿Cuántos días alcanza si llegan 12?',t:'inversa'}
];
let radarPool=[], radarOk=0;
function radarRender(){
  const box=document.getElementById('widget-directa-inversa'); if(!box) return;
  if(radarPool.length===0) radarPool=_shuffle([...radarData]);
  const item=radarPool[0];
  box.innerHTML=`
    <div style="border:1.5px solid var(--border);border-radius:10px;padding:0.7rem 0.9rem;text-align:center;font-family:'Fredoka',sans-serif;margin-bottom:0.6rem;">${item.s}</div>
    <div style="display:flex;gap:0.6rem;justify-content:center;flex-wrap:wrap;">
      <button class="btn btn-pri" id="radarDir">📈 DIRECTA</button>
      <button class="btn btn-sec" id="radarInv">📉 INVERSA</button>
    </div>
    <div id="fbRadar" class="fb" role="alert"></div>`;
  const responder=(resp)=>{
    if(resp===item.t){
      sfx('ok'); radarOk++;
      if(radarOk<=6&&!xpTracker.radar.has(radarOk)){ xpTracker.radar.add(radarOk); pts(2); }
      fb('fbRadar',item.t==='directa'?'¡Correcto! Si una cantidad sube y la otra sube con ella, es DIRECTA: se multiplica en cruz. +2 XP':'¡Correcto! Si una cantidad sube y la otra baja, es INVERSA: se multiplica la primera fila y se divide. +2 XP',true);
    } else {
      sfx('no');
      fb('fbRadar',item.t==='directa'?'Era DIRECTA: al pedir más, se paga o se gasta más. Las dos cantidades suben juntas.':'Era INVERSA: el trabajo es el mismo y se reparte entre más. Si una sube, la otra BAJA.',false);
    }
    radarPool.shift();
    setTimeout(radarRender,1900);
  };
  document.getElementById('radarDir').onclick=()=>responder('directa');
  document.getElementById('radarInv').onclick=()=>responder('inversa');
}

// ===================== GENERADOR DE TAREAS =====================
// Tareas autogeneradas: el estudiante se autoasigna práctica desde casa o el
// docente las copia en el pizarrón. Cada "⚡ Generar" crea ejercicios nuevos
// y las respuestas quedan ocultas hasta presionar "👁 Respuestas".
function _tgRint(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
function _tgLines(n){ let s=''; for(let i=0;i<n;i++) s+='<div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.4rem;height:1.3rem;">&nbsp;</div>'; return s; }
function _tgTask(out,i,inner){ const div=document.createElement('div'); div.className='tg-task'; div.innerHTML=Fr(`<div class="tg-task-num">${i+1}</div><div class="tg-task-content">${inner}</div>`); out.appendChild(div); }
function _instrBlock(out,title,lines){ const ib=document.createElement('div'); ib.className='tg-instruction-block'; ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join(''); out.appendChild(ib); }

// 🔢 Enteros y valor absoluto
function genEnterosTask(out,count){
  _instrBlock(out,'Instrucción: enteros y valor absoluto',['Resuelve cada operación. El signo es parte de la respuesta: si el resultado es negativo, escríbelo con su signo menos.','<strong>Recuerda:</strong> restar un negativo es sumar · signos iguales al multiplicar dan más, signos distintos dan menos · el valor absoluto es la distancia hasta el cero y nunca sale negativo.']);
  for(let i=0;i<count;i++){
    const tipo=_tgRint(0,3);
    if(tipo===0){
      const a=_tgRint(3,19), b=_tgRint(2,25), r=b-a;
      if(r===0){ i--; continue; }
      _tgTask(out,i,`<strong>(−${a}) + ${b} =</strong>${_tgLines(1)}<div class="tg-answer">✔ ${_sg(r)}</div>`);
    } else if(tipo===1){
      const a=_tgRint(2,18), b=_tgRint(2,18);
      if(Math.random()<0.5) _tgTask(out,i,`<strong>${a} − (−${b}) =</strong>${_tgLines(1)}<div class="tg-answer">✔ ${a+b} (restar un negativo es sumar)</div>`);
      else _tgTask(out,i,`<strong>(−${a}) − ${b} =</strong>${_tgLines(1)}<div class="tg-answer">✔ ${_sg(-a-b)}</div>`);
    } else if(tipo===2){
      const a=_tgRint(2,12), b=_tgRint(2,9);
      if(Math.random()<0.5){
        const iguales=Math.random()<0.5, r=iguales?a*b:-(a*b);
        _tgTask(out,i,`<strong>(−${a}) × ${iguales?'(−'+b+')':b} =</strong>${_tgLines(1)}<div class="tg-answer">✔ ${_sg(r)} (${iguales?'signos iguales: positivo':'signos distintos: negativo'})</div>`);
      } else {
        _tgTask(out,i,`<strong>(−${a*b}) ÷ ${b} =</strong>${_tgLines(1)}<div class="tg-answer">✔ ${_sg(-a)} (signos distintos: negativo)</div>`);
      }
    } else {
      const a=_tgRint(2,9), b=_tgRint(2,9), c=_tgRint(1,15), dentro=c-a*b;
      if(dentro===0){ i--; continue; }
      _tgTask(out,i,`<strong>|(−${a})(${b}) + ${c}| =</strong>${_tgLines(1)}<div class="tg-answer">✔ ${Math.abs(dentro)} (adentro da ${_sg(dentro)}, y del cero hay ${Math.abs(dentro)} pasos)</div>`);
    }
  }
}
// 🍕 Fracciones con signo
function genFraccionesTask(out,count){
  _instrBlock(out,'Instrucción: fracciones con signo',['Resuelve cada suma o resta. Si los denominadores son distintos, busca primero el común denominador con el m.c.m. y al final SIMPLIFICA.','<strong>Cuida el signo:</strong> si pesa más lo negativo, el resultado sale negativo, y eso también es una respuesta correcta. Los denominadores nunca se suman ni se restan.']);
  for(let i=0;i<count;i++){
    const d1=_tgRint(2,10), d2=_tgRint(2,10);
    const n1=_tgRint(1,d1-1||1), n2=_tgRint(1,d2-1||1);
    const comun=_mcmDe(d1,d2);
    const a=n1*(comun/d1), b=n2*(comun/d2);
    const negPrimero=Math.random()<0.5;
    const rn=negPrimero?(b-a):(a-b);
    if(rn===0){ i--; continue; }
    const expr=negPrimero?`(−${n1}/${d1}) + ${n2}/${d2}`:`${n1}/${d1} − ${n2}/${d2}`;
    _tgTask(out,i,`<strong>${expr} =</strong>${_tgLines(1)}<div class="tg-answer">✔ ${_fmtFracS(rn,comun)} (común denominador: ${comun})</div>`);
  }
}
// 💰 Decimales con lempiras
function genDecimalesTask(out,count){
  _instrBlock(out,'Instrucción: decimales con lempiras',['Resuelve cada cuenta. Al multiplicar, hazlo como si no hubiera punto y colócalo al final contando las cifras decimales.','<strong>Al dividir entre 10</strong> el punto se corre un lugar a la izquierda: 3.3 ÷ 10 = 0.33. Comprueba las divisiones multiplicando.']);
  const prods=['frijoles','arroz','azúcar','café','maíz','manteca','harina'];
  for(let i=0;i<count;i++){
    const tipo=_tgRint(0,2);
    if(tipo===0){
      const precio=_tgRint(800,6000)/100, libras=_tgRint(2,9), total=Math.round(precio*libras*100)/100;
      _tgTask(out,i,`<strong>La libra de ${prods[_tgRint(0,prods.length-1)]} cuesta L.${precio.toFixed(2)}. ¿Cuánto cuestan ${libras} libras?</strong>${_tgLines(1)}<div class="tg-answer">✔ L.${total.toFixed(2)}</div>`);
    } else if(tipo===1){
      const precio=_tgRint(150,900)/100, cant=[10,20,25,50,100][_tgRint(0,4)], total=Math.round(precio*cant*100)/100;
      _tgTask(out,i,`<strong>Por ${cant} bloques se pagaron L.${total.toFixed(2)}. ¿Cuánto cuesta cada bloque?</strong>${_tgLines(1)}<div class="tg-answer">✔ L.${precio.toFixed(2)}</div>`);
    } else {
      const n=_tgRint(11,999)/10, r=Math.round(n*10)/100;
      _tgTask(out,i,`<strong>${n.toFixed(1)} ÷ 10 =</strong>${_tgLines(1)}<div class="tg-answer">✔ ${r.toFixed(2)}</div>`);
    }
  }
}
// ⚡ Potencias
function genPotenciasTask(out,count){
  _instrBlock(out,'Instrucción: potencias',['Calcula cada potencia. El exponente dice cuántas veces se multiplica la base por sí misma: (−2)³ es (−2)(−2)(−2).','<strong>Con base negativa el signo lo decide el exponente:</strong> par da resultado positivo, impar lo deja negativo.']);
  for(let i=0;i<count;i++){
    const neg=Math.random()<0.7, exp=_tgRint(2,3), base=_tgRint(2, exp===3?9:12);
    const val=Math.pow(base,exp)*((neg&&exp===3)?-1:1);
    const txt=neg?`(−${base})<sup>${exp}</sup>`:`${base}<sup>${exp}</sup>`;
    const nota=neg?(exp===2?'exponente par: queda positivo':'exponente impar: queda negativo'):'base positiva';
    _tgTask(out,i,`<strong>${txt} =</strong>${_tgLines(1)}<div class="tg-answer">✔ ${_sg(val)} (${nota})</div>`);
  }
}
// ⚖️ Ecuaciones
function genEcuacionesTask(out,count){
  _instrBlock(out,'Instrucción: ecuaciones',['Halla el valor de la letra. Lo que le hagas a un lado, hazlo también al otro: así la igualdad se mantiene.','<strong>Comprueba siempre:</strong> pon tu resultado en la ecuación y mira si los dos lados dan lo mismo. El valor puede ser negativo.']);
  const letras=['x','y','p','m','n','t'];
  for(let i=0;i<count;i++){
    const L=letras[_tgRint(0,letras.length-1)], tipo=_tgRint(0,2);
    let v=_tgRint(-9,9); if(v===0) v=_tgRint(1,9);
    if(tipo===0){
      const a=_tgRint(2,9);
      _tgTask(out,i,`<strong>${a}${L} = ${_sg(a*v)}</strong>${_tgLines(1)}<div class="tg-answer">✔ ${L} = ${_sg(v)} (se dividen los dos lados entre ${a})</div>`);
    } else if(tipo===1){
      const b=_tgRint(2,20);
      _tgTask(out,i,`<strong>${L} + ${b} = ${_sg(v+b)}</strong>${_tgLines(1)}<div class="tg-answer">✔ ${L} = ${_sg(v)} (se restan ${b} a los dos lados)</div>`);
    } else {
      const a=_tgRint(2,7), b=_tgRint(2,15);
      _tgTask(out,i,`<strong>${a}${L} + ${b} = ${_sg(a*v+b)}</strong>${_tgLines(1)}<div class="tg-answer">✔ ${L} = ${_sg(v)} (primero se restan ${b} a los dos lados, después se divide entre ${a})</div>`);
    }
  }
}
// 📊 Proporcionalidad y porcentaje
function genProporcionTask(out,count){
  _instrBlock(out,'Instrucción: proporcionalidad y porcentaje',['Decide primero qué clase de proporcionalidad es: DIRECTA si una sube y la otra sube con ella, INVERSA si una sube y la otra baja.','<strong>Directa:</strong> se multiplica en cruz · <strong>inversa:</strong> se multiplica la primera pareja y se divide · <strong>porcentaje:</strong> se multiplica por el número del porcentaje y se divide entre 100.']);
  const cosas=[['libras de café','L.'],['cuadernos','L.'],['litros de leche','L.'],['libras de queso','L.']];
  for(let i=0;i<count;i++){
    const tipo=_tgRint(0,2);
    if(tipo===0){
      const u=_tgRint(2,9), precio=_tgRint(8,60), n=_tgRint(3,20), c=cosas[_tgRint(0,cosas.length-1)];
      _tgTask(out,i,`<strong>Si ${u} ${c[0]} cuestan L.${u*precio}, ¿cuánto cuestan ${n} ${c[0]}?</strong>${_tgLines(1)}<div class="tg-answer">✔ L.${n*precio} (directa: ${u*precio} × ${n} ÷ ${u})</div>`);
    } else if(tipo===1){
      const k=_tgRint(2,4), a=_tgRint(2,10), c=a*k, m=_tgRint(2,15), b=m*k;
      _tgTask(out,i,`<strong>Si ${a} obreros terminan una obra en ${b} días, ¿cuántos días tardan ${c} obreros trabajando igual de rápido?</strong>${_tgLines(1)}<div class="tg-answer">✔ ${m} días (inversa: ${a} × ${b} ÷ ${c})</div>`);
    } else {
      const N=20*_tgRint(1,10), p=[10,20,25,50][_tgRint(0,3)];
      _tgTask(out,i,`<strong>¿Cuánto es el ${p}% de ${N}?</strong>${_tgLines(1)}<div class="tg-answer">✔ ${N*p/100} (${N} × ${p} ÷ 100)</div>`);
    }
  }
}
// 📐 Ángulos y geometría
function genGeometriaTask(out,count){
  _instrBlock(out,'Instrucción: ángulos y geometría',['Resuelve cada caso y escribe la unidad: grados para los ángulos, cm para los segmentos.','<strong>Suplementarios:</strong> los dos juntos suman 180° · <strong>complementarios:</strong> suman 90° · dos rectas paralelas cortadas por una secante forman ángulos alternos externos IGUALES.']);
  for(let i=0;i<count;i++){
    const tipo=_tgRint(0,3);
    if(tipo===0){ const a=_tgRint(15,165); _tgTask(out,i,`<strong>¿Cuánto mide el ángulo suplementario de uno que mide ${a}°?</strong>${_tgLines(1)}<div class="tg-answer">✔ ${180-a}° (180 − ${a})</div>`); }
    else if(tipo===1){ const a=_tgRint(10,80); _tgTask(out,i,`<strong>¿Cuánto mide el ángulo complementario de uno que mide ${a}°?</strong>${_tgLines(1)}<div class="tg-answer">✔ ${90-a}° (90 − ${a})</div>`); }
    else if(tipo===2){ const a=_tgRint(20,160); _tgTask(out,i,`<strong>Una secante corta dos rectas paralelas y uno de los ángulos mide ${a}°. ¿Cuánto mide su alterno externo?</strong>${_tgLines(1)}<div class="tg-answer">✔ ${a}° (los alternos externos son iguales)</div>`); }
    else { const m=_tgRint(3,30); _tgTask(out,i,`<strong>C es el punto medio del segmento AB. Si AC mide ${m} cm, ¿cuánto mide AB?</strong>${_tgLines(1)}<div class="tg-answer">✔ ${2*m} cm (el punto medio parte el segmento en dos partes iguales)</div>`); }
  }
}
/* 📖 Lengua: sin esta, el generador de tareas se queda SOLO con Matemáticas.
   Es la sección que el maestro copia en el pizarrón, y esta misión repasa las
   DOS materias que se evalúan el mismo día: un generador sin Español le deja
   media asignatura sin práctica que repartir. */
const LENGUA_EXPR=[
  ['se le salía el corazón','estaba muy asustado o muy emocionado'],
  ['costar un ojo de la cara','ser carísimo'],
  ['no pegar un ojo','no poder dormir'],
  ['meter la pata','equivocarse'],
  ['echar una mano','ayudar'],
  ['estar en las nubes','estar distraído'],
  ['tomarle el pelo a alguien','burlarse de alguien'],
  ['ponerse las pilas','esforzarse más']
];
const LENGUA_PALABRAS=[
  ['insólito','La cosecha de ese año fue insólita: nadie recordaba una milpa tan cargada.'],
  ['vasto','Desde el cerro se veía un vasto llano que no acababa nunca.'],
  ['sigiloso','El gato entró sigiloso, sin que crujiera ni una tabla.'],
  ['persistente','La lluvia persistente no paró en tres días.'],
  ['nítido','Con el cielo limpio, el sonido del río se oía nítido desde la casa.'],
  ['austero','Don Chico llevaba una vida austera: lo justo y nada de sobra.']
];
const LENGUA_ESCRITURA=[
  'Escribe un cuento dialogado de al menos ocho renglones. Elige el tema: un viaje en bus que se descompone, una tarde de tormenta o un encuentro con un desconocido. Cada vez que hable un personaje, empieza el renglón con su raya.',
  'Escribe un comentario de cinco a ocho renglones sobre esta pregunta: ¿por qué son necesarios los cambios en la vida? Da al menos dos razones y cierra con tu opinión.',
  'Describe un lugar de tu comunidad para alguien que no lo conoce, sin nombrarlo. Usa lo que se ve, lo que se oye y lo que se huele.',
  'Cuenta en un párrafo algo que te pasó y termina diciendo qué mensaje o enseñanza te dejó.'
];
function genLenguaTask(out,count){
  _instrBlock(out,'Instrucción: lengua',['Contesta cada una en el espacio, con letra clara y cuidando la ortografía.','<strong>Recuerda:</strong> el significado de una palabra o de una expresión se descubre por el resto de la oración, no por cómo suena.']);
  for(let i=0;i<count;i++){
    const tipo=_tgRint(0,2);
    if(tipo===0){ const e=LENGUA_EXPR[_tgRint(0,LENGUA_EXPR.length-1)];
      _tgTask(out,i,`<strong>¿Qué significa la expresión «${e[0]}»? Escríbelo con tus palabras y úsala después en una oración tuya.</strong>${_tgLines(2)}<div class="tg-answer">✔ ${e[1]}. La oración es libre, pero la expresión tiene que quedar bien usada.</div>`); }
    else if(tipo===1){ const p=LENGUA_PALABRAS[_tgRint(0,LENGUA_PALABRAS.length-1)];
      _tgTask(out,i,`<strong>«${p[1]}» ¿Qué significa ahí la palabra <em>${p[0]}</em>? Explica en qué parte de la oración lo descubriste.</strong>${_tgLines(2)}<div class="tg-answer">✔ Se deduce por el contexto de la propia oración: lo que importa es que señale las palabras que se lo dijeron.</div>`); }
    else { const c=LENGUA_ESCRITURA[_tgRint(0,LENGUA_ESCRITURA.length-1)];
      _tgTask(out,i,`<strong>${c}</strong>${_tgLines(6)}<div class="tg-answer">✔ Respuesta libre. Se califica que la idea se entienda, que respete lo que se pide y que la ortografía esté cuidada.</div>`); }
  }
}
let ansVisible=false;
function genTask(){ sfx('click'); const type=document.getElementById('tgType').value; const count=parseInt(document.getElementById('tgCount').value); ansVisible=false; const out=document.getElementById('tgOut'); out.innerHTML=''; if(type==='enteros') genEnterosTask(out,count); else if(type==='fracciones') genFraccionesTask(out,count); else if(type==='decimales') genDecimalesTask(out,count); else if(type==='potencias') genPotenciasTask(out,count); else if(type==='ecuaciones') genEcuacionesTask(out,count); else if(type==='proporcion') genProporcionTask(out,count); else if(type==='geometria') genGeometriaTask(out,count); else if(type==='lengua') genLenguaTask(out,count); fin('s-tareas'); }
function toggleAns(){ ansVisible=!ansVisible; document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none'); sfx('click'); }

// ===================== ESCRITURA: EXPLICA Y REDACTA =====================
// Las dos consignas de escritura de la prueba real de 7º (el cuento dialogado
// eligiendo tema y el comentario de opinión) más descripción, mensaje y
// expresiones. La pauta la revisa el propio alumno.
const explicaData = [
  {
    q: 'Redacta un CUENTO DIALOGADO con su título. Elige uno de estos tres temas: 1) La noche que se fue la luz. 2) El pasajero del último bus. 3) Lo que encontramos en la quebrada. Deben hablar por lo menos dos personajes.',
    hint: '💡 Pista: lo que dice cada personaje empieza en un renglón nuevo y con la raya de diálogo, que es una rayita larga. Antes de lo que se dice va el verbo con dos puntos: «Entonces don Chepe dijo:».',
    rubric: ['✓ Lleva título y se nota qué tema eligió, con inicio, desarrollo y final', '✓ Hablan al menos dos personajes, y cada intervención lleva su raya de diálogo en renglón aparte', '✓ Usa los dos puntos antes de lo que se dice, y cuida la ortografía y los signos de interrogación'],
    suggested: 'Título: «La noche que se fue la luz». El apagón agarró a la familia en la cena. La abuela sacó el candil y lo puso en el centro de la mesa. Entonces Nilo preguntó: «¿Y ahora qué hacemos, abuela?». Ella se rió y contestó: «Lo que se hacía antes de que existiera la luz: contar historias». Esa noche nadie encendió nada y nadie se quiso ir a dormir. ✍️ En tu cuaderno, cada una de esas dos intervenciones va en renglón aparte y empieza con la raya de diálogo, en lugar de las comillas.'
  },
  {
    q: 'Lee esta idea: «Aprender algo nuevo casi siempre incomoda al principio». Escribe un COMENTARIO de al menos cuatro líneas: di si estás de acuerdo y defiéndelo con dos argumentos, cada uno con su explicación.',
    hint: '💡 Pista: empieza diciendo tu postura («Yo pienso que…») y da dos razones DISTINTAS, no la misma dicha de dos maneras. Cierra retomando tu postura.',
    rubric: ['✓ Dice su postura con claridad desde el primer renglón', '✓ Da dos argumentos distintos y cada uno viene explicado, no solo enunciado', '✓ Usa conectores (porque, además, sin embargo, por eso) y cierra retomando la postura'],
    suggested: 'Yo pienso que sí incomoda, y que aun así vale la pena. Primero, porque al principio uno se equivoca delante de los demás y eso da pena; pero justamente esos errores son los que enseñan dónde está la falla. Además, lo que ya se domina no exige esfuerzo, así que si nada incomoda es señal de que no se está aprendiendo nada nuevo. Por eso creo que la incomodidad del principio es parte de aprender.'
  },
  {
    q: 'DESCRIBE en cinco o seis líneas el lugar donde estudias en tu casa, de manera que quien lo lea pueda imaginarlo sin haberlo visto. Nombra lo que se ve, lo que se oye y lo que se siente.',
    hint: '💡 Pista: describir no es hacer una lista. Ordena: primero lo grande, después los detalles, y al final lo que ese lugar te hace sentir.',
    rubric: ['✓ Se puede imaginar el lugar: dice cómo es, no solo qué hay', '✓ Nombra por lo menos dos sentidos distintos (lo que se ve, se oye, se huele o se siente)', '✓ Va en orden, con adjetivos precisos y sin repetir siempre las mismas palabras'],
    suggested: 'Estudio en la mesa del corredor, junto a la ventana que da al patio. La madera está gastada en el borde donde apoyo el codo. A esa hora se oyen las gallinas y, más lejos, la radio del vecino. Cuando el sol baja, la luz llega anaranjada y no hace falta encender nada. Ahí me concentro mejor que en ninguna otra parte de la casa.'
  },
  {
    q: 'Lee este relato: un muchacho encontró un nido caído con un pichón vivo. En vez de llevárselo, subió al árbol y lo devolvió a la rama. Días después, pasando por ahí, oyó el escándalo de los pájaros y descubrió que el nido seguía lleno. Explica con tus palabras el MENSAJE que deja el relato y cuenta una situación de la vida real donde se cumpla.',
    hint: '💡 Pista: el mensaje casi nunca viene escrito. No vuelvas a contar la historia: di qué enseña.',
    rubric: ['✓ Dice el mensaje: ayudar es devolver a su sitio lo que se puede salvar, no quedárselo', '✓ Lo explica con palabras propias, sin copiar renglones del relato', '✓ Da un ejemplo creíble de la vida diaria donde ese mensaje se cumpla'],
    suggested: 'El mensaje es que la mejor ayuda no es quedarse con lo que uno encuentra, sino devolverlo a donde puede seguir viviendo. Pasa en la vida real: cuando alguien halla un perro perdido, lo fácil es quedárselo, y lo que de verdad ayuda es buscar a su dueño, aunque cueste más trabajo.'
  },
  {
    q: 'Escribe qué significa la EXPRESIÓN «le costó un ojo de la cara», úsala en una oración tuya y explica en un renglón por qué no se entiende palabra por palabra.',
    hint: '💡 Pista: una expresión es un grupo de palabras que juntas significan otra cosa. Si la lees literal, sale un disparate.',
    rubric: ['✓ Explica el significado: que algo salió carísimo', '✓ Escribe una oración propia donde la expresión encaje bien', '✓ Explica que las expresiones no se entienden palabra por palabra, sino por lo que significan juntas'],
    suggested: 'Significa que algo salió carísimo. Oración: «La medicina de mi abuela le costó un ojo de la cara a mi mamá.» No se entiende palabra por palabra porque nadie paga con un ojo: las cinco palabras juntas significan otra cosa, y por eso hay que leerlas como una sola idea.'
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
// Comprobado: |−12| = 12 · −8 + 3 = −5 · (−6)(−4) = 24 · −9 < −2 ·
// (−2)⁴ = 16 · 5x = −35 se resuelve dividiendo · 25% de 80 = 20.
const evalTFBankMat=[
  {q:'El valor absoluto de −12 es 12.',a:true},
  {q:'El resultado de −8 + 3 es −11.',a:false},
  {q:'Al multiplicar (−6) por (−4) el resultado es negativo.',a:false},
  {q:'El número −9 es menor que −2.',a:true},
  {q:'La potencia (−2)⁴ da un resultado positivo.',a:true},
  {q:'Para resolver 5x = −35 hay que restar 5 a los dos lados.',a:false},
  {q:'Si más obreros terminan la obra en menos días, la proporcionalidad es directa.',a:false},
  {q:'El 25% de 80 es 20.',a:true}
];
const evalTFBankEsp=[
  {q:'El tema de un texto es aquello de lo que trata todo el texto.',a:true},
  {q:'Una inferencia se saca de las pistas del texto, aunque la respuesta no esté escrita.',a:true},
  {q:'El significado de una palabra no cambia según la oración donde aparezca.',a:false},
  {q:'En un cuento dialogado, la raya de diálogo marca lo que dice cada personaje.',a:true},
  {q:'Un texto informativo cuenta una historia inventada con personajes.',a:false},
  {q:'La expresión «no pegar el ojo» significa pasar la noche sin dormir.',a:true},
  {q:'El mensaje de un relato siempre viene escrito con esas palabras en el texto.',a:false}
];
// Banco de selección múltiple de las DOS materias (el Campeonísimo lo lee tal
// cual con «Actualizar banco»; el campo materia decide en qué prueba sale).
const evalMCBank=[
  {materia:'mat',q:'En una semana el precio del quintal de frijol pasó de L.1,250 a L.1,180. ¿Qué número representa ese cambio?',o:['a) +70','b) −70','c) −1,180','d) +1,250'],a:1},
  {materia:'mat',q:'¿Cuál es el resultado de |(−7)(2) + 5|?',o:['a) 9','b) −9','c) 19','d) −19'],a:0},
  {materia:'mat',q:'Marcos debe L.240 en la pulpería. Su hermana le da L.150 y su tío L.60. Si paga lo que puede, ¿cuántos lempiras le quedan?',o:['a) −450','b) −30','c) 30','d) 450'],a:1},
  {materia:'mat',q:'Una secante corta dos rectas paralelas y uno de los ángulos mide 65°. ¿Cuánto mide su suplementario?',o:['a) 25°','b) 35°','c) 115°','d) 125°'],a:2},
  {materia:'mat',q:'En el mercado, la libra de queso cuesta L.46.50. ¿Cuánto cuestan 2.5 libras?',o:['a) L.116.25','b) L.11.625','c) L.49.00','d) L.1,162.50'],a:0},
  {materia:'mat',q:'Se pagaron L.2,430 por 900 bloques. ¿Cuál es el precio de cada bloque?',o:['a) L.2.70','b) L.27.00','c) L.3.70','d) L.0.27'],a:0},
  {materia:'mat',q:'Rosa compró 3 libras de arroz y una bolsa de sal de L.12, y gastó L.87. Si x es el precio de la libra de arroz, ¿qué ecuación lo representa?',o:['a) 12x + 3 = 87','b) 3x + 12 = 87','c) 3x − 12 = 87','d) 12x − 3 = 87'],a:1},
  {materia:'mat',q:'Cinco obreros descargan un camión en 12 horas. ¿Cuántas horas tardan 10 obreros igual de rápidos?',o:['a) 24 horas','b) 10 horas','c) 6 horas','d) 2 horas'],a:2},
  {materia:'esp',q:'El agua de la quebrada llega a la aldea por una manguera que los vecinos remendaron entre todos. Con ella se cocina, se lava y se riega el huerto de la escuela. Cuando alguien deja una llave abierta, la casa del final del camino se queda sin nada. Por eso el patronato puso un turno y lo respeta hasta el que vive más cerca.\n\n¿Cuál es el tema del texto?',o:['a) El huerto de la escuela.','b) La manguera remendada.','c) La casa del final del camino.','d) El agua de la aldea y el acuerdo para repartirla.'],a:3},
  {materia:'esp',q:'Doña Fina se levanta a las tres y media. Prende el fuego, echa el nixtamal al molino y a las cinco ya tiene el comal caliente. Los primeros clientes llegan cuando todavía está oscuro: los albañiles que salen para la obra y las muchachas que agarran el bus de las seis.\n\nSegún el texto, ¿a qué hora tiene el comal caliente doña Fina?',o:['a) A las tres y media.','b) A las cinco.','c) A las seis.','d) Cuando llegan los albañiles.'],a:1},
  {materia:'esp',q:'El anemómetro es un aparato sencillo: tres copas montadas en un eje que gira con el viento. Mientras más fuerte sopla, más rápido dan vueltas, y ese giro se convierte en un número. Con él, los que estudian el clima saben si viene una tormenta antes de que se vea una nube.\n\nPor su contenido y su forma, ¿qué tipo de texto es?',o:['a) Un cuento dialogado.','b) Una carta.','c) Un texto informativo.','d) Un texto narrativo.'],a:2},
  {materia:'esp',q:'La creciente se llevó el puente de tablas en la madrugada. Cuando amaneció, los muchachos de la aldea llegaron con mecates y con dos troncos que habían guardado del año pasado. Nadie los mandó. A las tres de la tarde el paso estaba abierto otra vez, y esa noche la maestra pudo volver a su casa.\n\n¿Por qué los muchachos tenían guardados los dos troncos?',o:['a) Porque ya les había pasado antes y se prepararon.','b) Porque el patronato se los había comprado.','c) Porque los iban a vender en el pueblo.','d) Porque la maestra se los pidió.'],a:0},
  {materia:'esp',q:'Al terminar el examen, Wilmer entregó la hoja y salió al corredor sin mirar a nadie. Se sentó en la grada de siempre, con la mochila todavía en la espalda, y se quedó viendo el patio vacío hasta que sonó el timbre. Ese día no compró nada en la venta.\n\n¿Cómo se describe a Wilmer en el texto?',o:['a) Alegre y conversador.','b) Apurado por irse a su casa.','c) Callado y preocupado.','d) Enojado con sus compañeros.'],a:2},
  {materia:'esp',q:'Cuando le dijeron que su nieta había ganado la beca, a doña Ada se le hizo un nudo en la garganta y no pudo decir ni una palabra. Se secó las manos en el delantal, se sentó en la banca del corredor y se quedó ahí, mirando el camino por donde la muchacha iba a llegar de la escuela.\n\n¿Qué significa en el texto la expresión se le hizo un nudo en la garganta?',o:['a) Que se atragantó con la comida.','b) Que la emoción no la dejó hablar.','c) Que le dolía la garganta desde antes.','d) Que se enojó y prefirió callarse.'],a:1},
  {materia:'esp',q:'Un cuento termina así: el labrador, que tanto había renegado del terreno pedregoso, descubrió que fueron esas mismas piedras las que detuvieron el agua cuando bajó la creciente, y que por eso su milpa fue la única que quedó en pie.\n\n¿Qué mensaje deja el final del cuento?',o:['a) Que hay que sembrar lejos de los ríos.','b) Que las piedras sirven para hacer cercos.','c) Que conviene renegar menos y trabajar más.','d) Que lo que parece un estorbo a veces termina siendo lo que salva.'],a:3}
];
// Los resultados negativos van con su signo: el calificador en línea los
// distingue del positivo, así que «7» NO vale por «−7».
const evalCPBankMat=[
  {q:'El valor absoluto de −15 es ___.',a:'15',acc:['15','quince']},
  {q:'El resultado de −7 + 12 es ___.',a:'5',acc:['5','+5','cinco']},
  {q:'El resultado de (−6)(−5) es ___.',a:'30',acc:['30','+30','treinta']},
  {q:'En la ecuación 4x = −28, el valor de x es ___.',a:'−7',acc:['−7','-7','menos 7']},
  {q:'El resultado de la potencia (−4)³ es ___.',a:'−64',acc:['−64','-64','menos 64']},
  {q:'Si 6 libras de azúcar cuestan L.90, una libra cuesta L. ___.',a:'15',acc:['15','15.00','quince']},
  {q:'El 20% de 150 es ___.',a:'30',acc:['30','treinta']},
  {q:'En la ecuación 2x + 3 = 11, el valor de x es ___.',a:'4',acc:['4','+4','cuatro']}
];
const evalCPBankEsp=[
  {q:'No salimos al patio ___ el sol estaba muy fuerte.',a:'porque',acc:['porque']},
  {q:'Estudió toda la semana. ___, reprobó el examen.',a:'Sin embargo',acc:['sin embargo']},
  {q:'La palabra que significa casi lo mismo que otra se llama ___.',a:'sinónimo',acc:['sinonimo','sinónimo']},
  {q:'Lo que dice cada personaje en un cuento dialogado se marca con la ___ de diálogo.',a:'raya',acc:['raya']},
  {q:'Aquello de lo que trata todo el texto se llama el ___ del texto.',a:'tema',acc:['tema']},
  {q:'Cuando la respuesta no está escrita y hay que sacarla de las pistas, se hace una ___.',a:'inferencia',acc:['inferencia']},
  {q:'Las palabras que rodean a otra y le dan su sentido se llaman el ___.',a:'contexto',acc:['contexto']}
];
const evalPRBankMat=[
  {term:'Número entero',def:'Positivo, negativo o cero, sin partes decimales'},
  {term:'Valor absoluto',def:'La distancia que hay de un número hasta el cero'},
  {term:'Ecuación',def:'Igualdad con una letra cuyo valor hay que hallar'},
  {term:'Mediatriz',def:'Recta que corta un segmento por su medio en ángulo recto'},
  {term:'Punto medio',def:'El punto que parte un segmento en dos partes iguales'},
  {term:'Proporcionalidad directa',def:'Si una cantidad sube, la otra sube con ella'},
  {term:'Proporcionalidad inversa',def:'Si una cantidad sube, la otra baja'},
  {term:'Porcentaje',def:'La parte que se toma de cada cien'}
];
const evalPRBankEsp=[
  {term:'Tema',def:'Aquello de lo que trata todo el texto'},
  {term:'Inferencia',def:'Respuesta que se saca de las pistas, sin estar escrita'},
  {term:'Contexto',def:'Las palabras que rodean a otra y le dan su sentido'},
  {term:'Expresión',def:'Palabras que juntas significan algo distinto de lo que dicen'},
  {term:'Raya de diálogo',def:'Signo que marca lo que dice cada personaje'},
  {term:'Texto informativo',def:'Da datos reales sobre un asunto, sin inventar historia'},
  {term:'Mensaje',def:'La enseñanza que deja un relato'}
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
  const pt=document.getElementById('eval-print-title'); if(pt) pt.textContent=`Evaluación de Repaso · Prueba de Fin de Grado 7º · ${M.nombre}`;
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
/* ⚠️ El signo menos SÍ se conserva, y esto es propio de 7º: aquí «−7» y «7»
   son respuestas distintas, y borrándolo el calificador daba por buena la
   mitad de las respuestas de enteros y de ecuaciones. Antes se unifican las
   tres rayitas que el alumno puede teclear (el guion del teclado, el menos de
   imprenta y la raya) para que las tres valgan igual. */
function _normTxt(s){ return (s||'').toString().trim().toLowerCase().replace(/[\u2212\u2013\u2014]/g,'-').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9ñ/ -]/gi,'').replace(/\s+/g,' ').trim(); }
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
const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Prueba de ${M.nombre} · Repaso de Fin de Grado 7º · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:12pt;color:#111;background:#fff;padding:4mm 6mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.35rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;color:${M.acc};}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:${M.acc};margin-top:0.15rem;font-weight:700;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.2rem 0.5rem;margin:0.34rem 0 0.2rem;border-left:4px solid ${M.acc};background:${M.bg};display:flex;justify-content:space-between;align-items:center;color:${M.acc};break-inside:avoid;page-break-inside:avoid;}.qn{font-weight:700;min-width:22px;flex-shrink:0;color:${M.acc};}.tf-row{display:flex;align-items:flex-start;gap:0.3rem;font-size:10.5pt;line-height:1.35;padding:0.16rem 0.2rem;border-bottom:1px solid #eee;break-inside:avoid;page-break-inside:avoid;}.tf-blank{display:inline-block;min-width:42px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.2rem;margin-top:0.2rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.2rem 0.4rem;margin-bottom:0.14rem;break-inside:avoid;page-break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.35;display:flex;gap:0.3rem;margin-bottom:0.12rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.14rem 0.55rem;}.mc-grid.mc-una-col{grid-template-columns:1fr;}.mc-opts{display:grid;grid-template-columns:repeat(2,1fr);gap:0.08rem 0.25rem;margin-left:1.3rem;}.mc-opt{font-size:9.5pt;display:flex;align-items:center;gap:0.22rem;}.mc-circ{display:inline-block;width:11px;height:11px;border:1.4px solid #333;border-radius:50%;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.35;padding:0.14rem 0.2rem;border-bottom:1px solid #eee;break-inside:avoid;page-break-inside:avoid;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:130px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{break-inside:avoid;page-break-inside:avoid;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.12rem 0.5rem;margin-top:0.1rem;}.pr-head{font-size:9pt;font-weight:700;color:${M.acc};margin-bottom:0.12rem;}.pr-item{font-size:10pt;padding:0.13rem 0.32rem;background:${M.bg};border-radius:3px;margin-bottom:0.08rem;display:flex;align-items:center;gap:0.22rem;line-height:1.2;}.pr-num{font-weight:700;color:${M.acc};min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid ${M.acc};padding-bottom:0.35rem;margin-bottom:0.5rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;color:${M.acc};}.p-sub{font-size:9pt;color:${M.acc};font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid ${M.borde};border-radius:4px;padding:0.35rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}.p-ttl{font-size:11pt;font-weight:700;color:${M.acc};border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:${M.acc};}.pa{color:#007a00;font-weight:700;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:${M.acc};font-weight:700;font-style:italic;}.obt-lbl{font-weight:700;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid ${M.acc};height:12px;}.obt-pct{font-weight:700;}.total-row{display:flex;align-items:baseline;justify-content:flex-end;gap:7px;font-size:11pt;color:${M.acc};font-weight:700;font-style:italic;margin-top:0.28rem;padding:0.15rem 0.5rem;background:${M.bg};border-radius:4px;break-inside:avoid;page-break-inside:avoid;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid ${M.acc};}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}${typeof Fr!=="undefined"?Fr.css:""}.fr{font-size:0.8em;margin:0 0.06em;}.fr>b{padding:0 0.13em;}.fr>b.fd{margin-top:0.03em;padding-top:0.03em;}@media print{@page{size:letter portrait;margin:8mm 10mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación de Repaso · Prueba de Fin de Grado 7º · ${M.nombre} · Educación Básica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 4 secciones × 5 preguntas × 5 pts c/u · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✔ PAUTA DOCENTE: Prueba de ${M.nombre} · Repaso de Fin de Grado 7º · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">100 pts | 4 secciones × 5 preguntas × 5 pts | ${M.nombre} · Educación Básica</div></div><div class="p-grid">${pR}</div>
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
/* Acepta enteros y decimales, con o sin "L.", coma o espacios: 78.40 = 78.4
   El menos de imprenta (−) se convierte antes en el guion del teclado: la
   pantalla escribe «−7» y el alumno teclea «-7», y las dos son la misma
   respuesta. Sin esto, en 7º toda respuesta negativa se leía como positiva. */
function _isNumMatch(student, expected) {
  /* La L. del lempira se quita ENTERA, con su punto. Antes se borraba solo la
     letra y quedaba «.132.37», que parseFloat lee como 0.132: el alumno que
     contestaba «L.132.37», copiando cómo se lo enseña la pauta, salía malo con
     la respuesta buena, y en la sección del dinero eso son 8 de 100 puntos. */
  const raw = (student || '').toString().replace(/[\u2212\u2013\u2014]/g, '-').replace(/[Ll]\s*\.?/g, '').replace(/[^\d.,\-]/g, '').replace(/,/g, '');
  if (!raw) return false;
  const n = parseFloat(raw);
  return !isNaN(n) && Math.abs(n - expected) < 0.005;
}

/* La prueba operativa de 7º, con la MISMA estructura de puntos de la serie:
   5 + 5 + 5 ejercicios de 4 pts, 3 problemas de 10 y 1 reto de 10, que son
   19 ejercicios y 100 puntos. Lo que cambia es el temario del grado.
   Todo se siembra con la forma, así que la Forma N sale siempre igual.
   Ninguna cuenta puede quedar sin respuesta posible: las divisiones son
   exactas y ningún resultado vale cero. Los NEGATIVOS sí entran: en 7º un
   resultado con signo menos es una respuesta legítima, no un error. */

// I. Enteros y valor absoluto (5 × 4 = 20 pts)
function genOpEnteros(){
  const items=[];
  /* Si la tirada se empeña en dar cero, se mueve el DATO, no la respuesta:
     subiendo solo r la pauta diría un número que el enunciado no da, y el
     examen impreso saldría con la clave equivocada. */
  { let a,b,r,g=0; do{ a=_opRint(5,25); b=_opRint(2,30); r=b-a; }while(r===0&&++g<20);
    if(r===0){ b++; r=1; }
    items.push({ text:`Calcula: (−${a}) + ${b} =`, ansNum:r, ansShow:_sg(r) }); }
  { const a=_opRint(3,20), b=_opRint(2,18);
    items.push({ text:`Calcula: ${a} − (−${b}) =`, ansNum:a+b, ansShow:String(a+b) }); }
  { const a=_opRint(2,12), b=_opRint(2,9), iguales=_opRint(0,1)===1, r=iguales?a*b:-(a*b);
    items.push({ text:`Calcula: (−${a}) × ${iguales?'(−'+b+')':b} =`, ansNum:r, ansShow:_sg(r) }); }
  { let a,b,c,dentro,g=0; do{ a=_opRint(2,9); b=_opRint(2,9); c=_opRint(1,20); dentro=c-a*b; }while(dentro===0&&++g<20);
    if(dentro===0){ c++; dentro=1; }   // se mueve el dato, no la respuesta (ver arriba)
    items.push({ text:`Calcula: |(−${a})(${b}) + ${c}| =`, ansNum:Math.abs(dentro), ansShow:String(Math.abs(dentro)) }); }
  { const exp=_opRint(2,3), base=_opRint(2, exp===3?8:11), val=Math.pow(base,exp)*(exp===3?-1:1);
    items.push({ text:`Calcula: (−${base})${exp===3?'³':'²'} =`, ansNum:val, ansShow:_sg(val) }); }
  return items;
}
// II. Fracciones y decimales (5 × 4 = 20 pts)
const _OP_DENS=[[2,4],[3,6],[2,6],[4,8],[5,10],[2,3],[3,4],[2,5],[4,6],[3,5],[6,8],[4,10]];
function genOpNumeros(){
  const items=[];
  { const par=_OP_DENS[_opRint(0,_OP_DENS.length-1)];
    const d1=par[0], d2=par[1], comun=_mcmDe(d1,d2);
    let n1=_opRint(1,d1-1), n2=_opRint(1,d2-1);
    const a=n1*(comun/d1), b=n2*(comun/d2);
    let rn=b-a;
    if(rn===0){ n2=Math.min(d2-1,n2+1); rn=n2*(comun/d2)-a; }
    if(rn===0){ n1=Math.max(1,n1-1); rn=n2*(comun/d2)-n1*(comun/d1); }
    items.push({ text:`Calcula y simplifica: (−${n1}/${d1}) + ${n2}/${d2} =`, ansTxt:_accFrac(rn,comun), ansShow:_fmtFracS(rn,comun) }); }
  { const prods=['frijoles','arroz','azúcar','café','maíz','harina'];
    const precio=_opRint(500,4500)/100, libras=_opRint(2,8), total=Math.round(precio*libras*100)/100;
    items.push({ text:`La libra de ${prods[_opRint(0,prods.length-1)]} cuesta L.${precio.toFixed(2)}. ¿Cuánto cuestan ${libras} libras?`, ansNum:total, ansShow:'L.'+total.toFixed(2) }); }
  { const precio=_opRint(150,900)/100, cant=[10,20,25,50,100][_opRint(0,4)], total=Math.round(precio*cant*100)/100;
    items.push({ text:`Por ${cant} bloques se pagaron L.${total.toFixed(2)}. ¿Cuánto cuesta cada bloque?`, ansNum:precio, ansShow:'L.'+precio.toFixed(2) }); }
  /* Ni el dato ni la respuesta pueden terminar en cero: «55.0 ÷ 10 = 5.50»
     enseña a escribir los decimales como no los escribe nadie y el alumno se
     queda dudando de si le sobra una cifra. En LEMPIRAS sí van los dos
     centavos —eso es dinero—, pero aquí son decimales pelados. */
  { let k,g=0; do{ k=_opRint(11,999); }while(k%10===0&&++g<20);
    if(k%10===0) k+=7;
    const n=k/10, r=k/100;
    items.push({ text:`Calcula: ${n.toFixed(1)} ÷ 10 =`, ansNum:r, ansShow:r.toFixed(2) }); }
  { let xc,yc,g=0; do{ xc=_opRint(1200,9800); yc=_opRint(50,1100); }while((xc%10===0||yc%10===0||(xc-yc)%10===0)&&++g<20);
    // Red de seguridad determinista: se fijan las unidades a dos cifras que no
    // se anulen entre sí (…7 − …4 = …3), por muy mala que salga la tirada.
    if(xc%10===0||yc%10===0||(xc-yc)%10===0){ xc=xc-(xc%10)+7; yc=yc-(yc%10)+4; }
    const x=xc/100, y=yc/100, r=(xc-yc)/100;
    items.push({ text:`Calcula: ${x.toFixed(2)} − ${y.toFixed(2)} =`, ansNum:r, ansShow:r.toFixed(2) }); }
  return items;
}
// III. Ecuaciones (5 × 4 = 20 pts)
const _OP_LETRAS=['x','y','p','m','n','t'];
function _opValor(){ const v=_opRint(-9,9); return v===0?4:v; }
function genOpEcuaciones(){
  const items=[];
  { const L=_OP_LETRAS[_opRint(0,5)], a=_opRint(2,9), v=_opValor();
    items.push({ text:`Halla el valor de ${L}:  ${a}${L} = ${_sg(a*v)}`, ansNum:v, ansShow:`${L} = ${_sg(v)}` }); }
  { const L=_OP_LETRAS[_opRint(0,5)], b=_opRint(2,20), v=_opValor();
    items.push({ text:`Halla el valor de ${L}:  ${L} + ${b} = ${_sg(v+b)}`, ansNum:v, ansShow:`${L} = ${_sg(v)}` }); }
  { const L=_OP_LETRAS[_opRint(0,5)], a=_opRint(2,7), b=_opRint(2,15), v=_opValor();
    items.push({ text:`Halla el valor de ${L}:  ${a}${L} + ${b} = ${_sg(a*v+b)}`, ansNum:v, ansShow:`${L} = ${_sg(v)}` }); }
  { const L=_OP_LETRAS[_opRint(0,5)], a=_opRint(2,7), b=_opRint(2,15), v=_opValor();
    items.push({ text:`Halla el valor de ${L}:  ${a}${L} − ${b} = ${_sg(a*v-b)}`, ansNum:v, ansShow:`${L} = ${_sg(v)}` }); }
  { let a,b,v,r,g=0; do{ a=_opRint(2,9); b=_opRint(1,12); v=_opRint(2,9); r=a*v+b; }while(r===0&&++g<20);
    items.push({ text:`Si t = ${v}, ¿cuánto vale ${a}t + ${b}?`, ansNum:r, ansShow:String(r) }); }
  return items;
}
// IV. Problemas de la vida real (3 × 10 = 30 pts)
function genOpProblemas(){
  const items=[];
  /* Las libras que se preguntan NO pueden ser las mismas que se dieron: «si 8
     libras cuestan L.432, ¿cuánto cuestan 8 libras?» trae la respuesta escrita
     en el propio enunciado y regala 10 de los 100 puntos sin medir nada. */
  { const u=_opRint(2,9), precio=_opRint(8,60); let n,g=0;
    do{ n=_opRint(3,20); }while(n===u&&++g<20);
    if(n===u) n=u+1;
    items.push({ text:`Si ${u} libras de café cuestan L.${_fmtNum(u*precio)}, ¿cuánto cuestan ${n} libras al mismo precio?`, ansNum:n*precio, ansShow:`L.${_fmtNum(n*precio)}: directa, ${_fmtNum(u*precio)} × ${n} ÷ ${u}` }); }
  { const k=_opRint(2,4), a=_opRint(2,10), c=a*k, m=_opRint(2,15), b=m*k;
    items.push({ text:`Si ${a} obreros levantan un muro en ${b} días, ¿cuántos días tardan ${c} obreros trabajando igual de rápido?`, ansNum:m, ansShow:`${m} días: inversa, ${a} × ${b} ÷ ${c}` }); }
  { const N=20*_opRint(2,10), p=[10,20,25,50][_opRint(0,3)];
    items.push({ text:`En una escuela hay ${N} alumnos y el ${p}% participa en la banda. ¿Cuántos alumnos participan?`, ansNum:N*p/100, ansShow:`${N*p/100} alumnos: ${N} × ${p} ÷ 100` }); }
  return items;
}
// V. Reto: la ecuación del enunciado (1 × 10 = 10 pts)
function genOpReto(){
  const n=_opRint(3,8), x=_opRint(12,45), s=_opRint(8,25), t=n*x+s;
  return [{ text:`Doña Ana compró ${n} libras de frijoles y una bolsa de sal de L.${s}. En total pagó L.${_fmtNum(t)}. Si x es el precio de la libra de frijoles, plantea la ecuación y halla x.`, ansNum:x, ansShow:`x = ${x}: la ecuación es ${n}x + ${s} = ${_fmtNum(t)}` }];
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
  const enItems = genOpEnteros();
  const s1 = document.createElement('div');
  s1.innerHTML = '<div class="eval-section-title">I. Enteros y valor absoluto <span class="eval-pts">20 pts · 4 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel básico. El signo es parte de la respuesta: si sale negativo, escríbelo con su signo menos. El valor absoluto nunca sale negativo.</p>';
  enItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${Fr(it.text)}</span><input class="eval-cp-input" type="text" data-en="${i}" autocomplete="off"></div><div class="eval-answer">${Fr(it.ansShow)}</div><div class="eval-item-feedback" id="evalFbEn${i}" aria-live="polite"></div>`;
    s1.appendChild(d);
  });
  out.appendChild(s1);
  const nuItems = genOpNumeros();
  const s2 = document.createElement('div');
  s2.innerHTML = '<div class="eval-section-title">II. Fracciones y decimales <span class="eval-pts">20 pts · 4 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel básico. Busca el común denominador y SIMPLIFICA; escribe la fracción con barra: 3/4. Al multiplicar decimales, coloca el punto contando las cifras.</p>';
  nuItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${Fr(it.text)}</span><input class="eval-cp-input" type="text" data-nu="${i}" autocomplete="off" inputmode="decimal"></div><div class="eval-answer">${Fr(it.ansShow)}</div><div class="eval-item-feedback" id="evalFbNu${i}" aria-live="polite"></div>`;
    s2.appendChild(d);
  });
  out.appendChild(s2);
  const ecItems = genOpEcuaciones();
  const s3 = document.createElement('div');
  s3.innerHTML = '<div class="eval-section-title">III. Ecuaciones <span class="eval-pts">20 pts · 4 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel intermedio. Lo que le hagas a un lado, hazlo al otro. Escribe solo el valor de la letra; puede ser negativo.</p>';
  ecItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${Fr(it.text)}</span><input class="eval-cp-input" type="text" data-ec="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${Fr(it.ansShow)}</div><div class="eval-item-feedback" id="evalFbEc${i}" aria-live="polite"></div>`;
    s3.appendChild(d);
  });
  out.appendChild(s3);
  const prItems = genOpProblemas();
  const s4 = document.createElement('div');
  s4.innerHTML = '<div class="eval-section-title">IV. Problemas de la vida real <span class="eval-pts">30 pts · 10 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel avanzado. Decide primero si es proporcionalidad directa o inversa, resuelve en tu cuaderno y escribe la respuesta numérica.</p>';
  prItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${Fr(it.text)}</span><input class="eval-cp-input" type="text" data-pr="${i}" autocomplete="off" inputmode="decimal"></div><div class="eval-answer">${Fr(it.ansShow)}</div><div class="eval-item-feedback" id="evalFbPr${i}" aria-live="polite"></div>`;
    s4.appendChild(d);
  });
  out.appendChild(s4);
  const reItems = genOpReto();
  const s5 = document.createElement('div');
  s5.innerHTML = '<div class="eval-section-title">V. Reto: la ecuación del enunciado <span class="eval-pts">10 pts</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel desafío. Traduce el enunciado a una ecuación con x y después resuélvela. Escribe el valor de x.</p>';
  reItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${Fr(it.text)}</span><input class="eval-cp-input" type="text" data-re="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${Fr(it.ansShow)}</div><div class="eval-item-feedback" id="evalFbRe${i}" aria-live="polite"></div>`;
    s5.appendChild(d);
  });
  out.appendChild(s5);
  window._evalOpData = { enItems, nuItems, ecItems, prItems, reItems };
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
  let total = 0; const det = { en: 0, nu: 0, ec: 0, pr: 0, re: 0 };
  const _mark = (sel, it, i, key, ptsEach, fbId) => {
    const el = document.querySelector(`[data-${sel}="${i}"]`);
    const ok = it.ansTxt ? _isTxtMatch(el ? el.value : '', it.ansTxt) : _isNumMatch(el ? el.value : '', it.ansNum);
    if (el) { el.classList.toggle('eval-input-ok', ok); el.classList.toggle('eval-input-no', !ok); }
    if (ok) { det[key] += ptsEach; total += ptsEach; }
    setEvalFeedback(fbId + i, ok, ok ? `Correcto. +${ptsEach} pts` : 'Revisar. R/ ' + it.ansShow);
  };
  d.enItems.forEach((it, i) => _mark('en', it, i, 'en', 4, 'evalFbEn'));
  d.nuItems.forEach((it, i) => _mark('nu', it, i, 'nu', 4, 'evalFbNu'));
  d.ecItems.forEach((it, i) => _mark('ec', it, i, 'ec', 4, 'evalFbEc'));
  d.prItems.forEach((it, i) => _mark('pr', it, i, 'pr', 10, 'evalFbPr'));
  d.reItems.forEach((it, i) => _mark('re', it, i, 're', 10, 'evalFbRe'));
  const res = document.getElementById('evalOpAutoResult');
  if (res) { res.className = 'eval-auto-result ' + (total >= 70 ? 'eval-auto-pass' : 'eval-auto-risk'); res.innerHTML = `<strong>Resultado: ${total}/100 pts</strong><br><span>Enteros: ${det.en}/20 · Fracciones y decimales: ${det.nu}/20 · Ecuaciones: ${det.ec}/20 · Problemas: ${det.pr}/30 · Reto: ${det.re}/10</span>`; }
  if (total >= 70) { pts(8); showToast('🎯 Prueba operativa calificada: ' + total + '/100'); }
  else showToast('🧮 Prueba operativa: ' + total + '/100. Revisa los ítems marcados.');
}

function printEvalOp() {
  if (!window._evalOpData) { showToast('⚠️ Genera una prueba operativa primero'); return; }
  sfx('click');
  const forma = window._currentEvalOpForm || 1; const d = window._evalOpData;
  const filaTabla = (items) => `<table class="rnd-tbl"><tr><th>#</th><th>Ejercicio</th><th>Respuesta</th></tr>${items.map((it, i) => `<tr><td>${i+1}</td><td>${Fr(it.text)}</td><td></td></tr>`).join('')}</table>`;
  let s1 = `<div class="sec-title"><span>I. Enteros y valor absoluto</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">El signo es parte de la respuesta. El valor absoluto es la distancia hasta el cero. 4 pts c/u.</p>${filaTabla(d.enItems)}`;
  let s2 = `<div class="sec-title"><span>II. Fracciones y decimales</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Común denominador y resultado SIMPLIFICADO · el punto decimal se coloca contando las cifras. 4 pts c/u.</p>${filaTabla(d.nuItems)}`;
  let s3 = `<div class="sec-title"><span>III. Ecuaciones</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Lo que se le hace a un lado se le hace al otro. Escribe el valor de la letra. 4 pts c/u.</p>${filaTabla(d.ecItems)}`;
  let s4 = `<div class="sec-title"><span>IV. Problemas de la vida real</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 30 pts</span></div></div><p class="opx-instr">Resuelve mostrando tu procedimiento y escribe la respuesta. 10 pts c/u.</p>`;
  d.prItems.forEach((it, i) => { s4 += `<div class="opx-print-row"><span class="qn">${i+1}.</span><span class="prb-text">${Fr(it.text)}</span><span class="opx-blank"></span></div><div class="opx-space"></div>`; });
  let s5 = `<div class="sec-title"><span>V. Reto: la ecuación del enunciado</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10 pts</span></div></div>`;
  d.reItems.forEach((it, i) => { s5 += `<div class="opx-print-row"><span class="qn">${i+1}.</span><span class="prb-text">${Fr(it.text)}</span><span class="opx-blank"></span></div><div class="opx-space"></div>`; });
  let pR = '';
  pR += `<div class="p-sec"><div class="p-ttl">I. Enteros y valor absoluto</div><table class="p-tbl">${d.enItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${Fr(it.ansShow)}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">II. Fracciones y decimales</div><table class="p-tbl">${d.nuItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${Fr(it.ansShow)}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">III. Ecuaciones</div><table class="p-tbl">${d.ecItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${Fr(it.ansShow)}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">IV. Problemas</div><table class="p-tbl">${d.prItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${Fr(it.ansShow)}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec" style="grid-column:1/-1;"><div class="p-ttl">V. Reto: la ecuación</div><table class="p-tbl">${d.reItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${Fr(it.ansShow)}</td></tr>`).join('')}</table></div>`;
  const doc = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Prueba Operativa · Repaso de Fin de Grado 7º · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11.5pt;color:#111;background:#fff;padding:4mm 6mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.35rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;color:#1565c0;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:#1565c0;margin-top:0.15rem;font-weight:700;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.45rem 0 0.2rem;border-left:4px solid #1565c0;background:#e3f2fd;display:flex;justify-content:space-between;align-items:center;color:#1565c0;break-inside:avoid;page-break-inside:avoid;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:#1565c0;font-weight:700;font-style:italic;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #1565c0;height:12px;}.qn{font-weight:700;min-width:20px;display:inline-block;color:#1565c0;flex-shrink:0;}.opx-instr{font-size:9pt;color:#555;margin-bottom:0.22rem;}.opx-blank{display:inline-block;width:80px;flex:none;border-bottom:1.5px solid #111;min-height:13px;margin-left:0.3rem;}.opx-print-row{display:flex;align-items:baseline;gap:0.4rem;font-size:10pt;padding:0.16rem 0.1rem;border-bottom:1px dotted #ddd;break-inside:avoid;page-break-inside:avoid;}.opx-space{height:22px;border-bottom:1px dotted #ccc;margin:0 0 2px 20px;}.prb-text{flex:1;line-height:1.35;}.rnd-tbl{width:100%;border-collapse:collapse;font-size:9.5pt;margin-top:0.15rem;}.rnd-tbl th,.rnd-tbl td{border:1px solid #bbb;padding:0.1rem 0.35rem;text-align:left;}.rnd-tbl th{background:#e3f2fd;color:#1565c0;font-size:8.5pt;}.rnd-tbl tr{break-inside:avoid;page-break-inside:avoid;}.total-row{display:flex;align-items:baseline;justify-content:flex-end;gap:7px;font-size:11pt;color:#1565c0;font-weight:700;font-style:italic;margin-top:0.45rem;padding:0.2rem 0.5rem;background:#e3f2fd;border-radius:4px;}.total-row .obt-line{min-width:80px;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #1565c0;padding-bottom:0.3rem;margin-bottom:0.5rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;color:#1565c0;}.p-sub{font-size:9pt;color:#1565c0;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #cce0ff;border-radius:4px;padding:0.35rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}.p-ttl{font-size:11pt;font-weight:700;color:#1565c0;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#1565c0;}.pa{color:#007a00;font-weight:700;font-family:'Courier New',monospace;}.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}${typeof Fr!=="undefined"?Fr.css:""}.fr{font-size:0.8em;margin:0 0.06em;}.fr>b{padding:0 0.13em;}.fr>b.fd{margin-top:0.03em;padding-top:0.03em;}@media print{@page{size:letter portrait;margin:8mm 10mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Examen de Matemáticas: Prueba Operativa · Repaso de Fin de Grado 7º · Educación Básica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 pts · I: 20 · II: 20 · III: 20 · IV: 30 · V: 10 · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✔ PAUTA: Prueba Operativa · Repaso de Fin de Grado 7º · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">100 pts · Matemáticas · Educación Básica</div></div><div class="p-grid">${pR}</div></div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div></body></html>`;
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
  const txt=`${stars} CONSTANCIA DE LOGRO ${stars}\n\n📚 Misión: Prueba de Fin de Grado 7º\n👤 Estudiante: ${name}\n📊 Progreso: ${pct}% completado\n⭐ XP obtenido: ${xp} de ${MXP}${achText?'\n\n🏆 Logros desbloqueados:\n'+achText:''}\n\n${msg}\n\n📅 ${date}\n🏠 Proyecto Educativo M.E.T.A.S\n🌐 policastsapien.com`;
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
  reglaNueva(); detRender(); radarRender();
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
