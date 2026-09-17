// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
function compartirMision(){const url=window.location.href;const texto=`🚀 *Misión Asignada* 🚀\n\nPractica sobre este tema y sobresale en ser de los mejores alumnos. 🏆\n\nDesbloquea *todos los logros* y puedes poner *tus datos* para que tu maestro observe todos tus logros. 📋\n\n_Se te hará prueba escrita y serás excelente estudiante en Inteligencia Artificial._ ✍️\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;_waShare(texto);}
function toggleLetra(){document.body.classList.toggle('letra-grande');if(typeof sfx==='function')sfx('click');localStorage.setItem('preferenciaLetra',document.body.classList.contains('letra-grande'));}
window.addEventListener('DOMContentLoaded',()=>{if(localStorage.getItem('preferenciaLetra')==='true')document.body.classList.add('letra-grande');});

// ===================== UTILIDADES =====================
const _pick=(arr,n)=>[...arr].sort(()=>Math.random()-0.5).slice(0,n);
const _shuffle=(arr)=>[...arr].sort(()=>Math.random()-0.5);
function fb(id,msg,isOk){const el=document.getElementById(id);if(el){el.textContent=msg;el.className='fb show '+(isOk?'ok':'err');}}

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY='escenarios_porvenir_v1';
let xp=0,MXP=200,done=new Set(),evalAnsVisible=false;
let evalFormNum=1,unlockedAch=[],darkMode=false,prevLevel=0;
let evalCritFormNum=1,evalCritAnsVisible=false;
const TOTAL_SECTIONS=14;
const xpTracker={fc:new Set(),qz:new Set(),cls:new Set(),id:new Set(),cmp:new Set(),reto:new Set(),sopa:new Set(),wgt:new Set()};

// ===================== SONIDO =====================
let sndOn=true;let AC=null;
function getAC(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}}return AC;}
function sfx(t){if(!sndOn)return;try{const ac=getAC();if(!ac)return;const g=ac.createGain();g.connect(ac.destination);const o=ac.createOscillator();o.connect(g);if(t==='click'){o.type='sine';o.frequency.setValueAtTime(800,ac.currentTime);o.frequency.linearRampToValueAtTime(1200,ac.currentTime+0.1);g.gain.setValueAtTime(0.2,ac.currentTime);g.gain.linearRampToValueAtTime(0,ac.currentTime+0.12);o.start();o.stop(ac.currentTime+0.12);}else if(t==='ok'){[523,659,784].forEach((f,i)=>{const o2=ac.createOscillator();const g2=ac.createGain();o2.connect(g2);g2.connect(ac.destination);o2.type='triangle';o2.frequency.value=f;g2.gain.setValueAtTime(0.15,ac.currentTime+i*0.1);g2.gain.linearRampToValueAtTime(0,ac.currentTime+i*0.1+0.15);o2.start(ac.currentTime+i*0.1);o2.stop(ac.currentTime+i*0.1+0.15);});}else if(t==='no'){o.type='square';o.frequency.setValueAtTime(200,ac.currentTime);o.frequency.linearRampToValueAtTime(100,ac.currentTime+0.2);g.gain.setValueAtTime(0.15,ac.currentTime);g.gain.linearRampToValueAtTime(0,ac.currentTime+0.2);o.start();o.stop(ac.currentTime+0.2);}else if(t==='up'){[523,659,784,1047].forEach((f,i)=>{const o2=ac.createOscillator();const g2=ac.createGain();o2.connect(g2);g2.connect(ac.destination);o2.type='triangle';o2.frequency.value=f;g2.gain.setValueAtTime(0.18,ac.currentTime+i*0.12);g2.gain.linearRampToValueAtTime(0,ac.currentTime+i*0.12+0.18);o2.start(ac.currentTime+i*0.12);o2.stop(ac.currentTime+i*0.12+0.18);});}else if(t==='fan'){[523,587,659,698,784,1047].forEach((f,i)=>{const o2=ac.createOscillator();const g2=ac.createGain();o2.connect(g2);g2.connect(ac.destination);o2.type='triangle';o2.frequency.value=f;g2.gain.setValueAtTime(0.15,ac.currentTime+i*0.1);g2.gain.linearRampToValueAtTime(0,ac.currentTime+i*0.1+0.2);o2.start(ac.currentTime+i*0.1);o2.stop(ac.currentTime+i*0.1+0.2);});}else if(t==='flip'){o.type='sine';o.frequency.setValueAtTime(400,ac.currentTime);o.frequency.linearRampToValueAtTime(900,ac.currentTime+0.15);g.gain.setValueAtTime(0.12,ac.currentTime);g.gain.linearRampToValueAtTime(0,ac.currentTime+0.18);o.start();o.stop(ac.currentTime+0.18);}else if(t==='tick'){o.type='sine';o.frequency.value=1000;g.gain.setValueAtTime(0.1,ac.currentTime);g.gain.linearRampToValueAtTime(0,ac.currentTime+0.05);o.start();o.stop(ac.currentTime+0.05);}else if(t==='ach'){[880,1047,1319].forEach((f,i)=>{const o2=ac.createOscillator();const g2=ac.createGain();o2.connect(g2);g2.connect(ac.destination);o2.type='triangle';o2.frequency.value=f;g2.gain.setValueAtTime(0.2,ac.currentTime+i*0.12);g2.gain.linearRampToValueAtTime(0,ac.currentTime+i*0.12+0.22);o2.start(ac.currentTime+i*0.12);o2.stop(ac.currentTime+i*0.12+0.22);});}}catch(e){}}
function toggleSnd(){sndOn=!sndOn;document.getElementById('sndBtn').textContent=sndOn?'🔊 Sonido':'🔇 Sonido';}

// ===================== DARK MODE =====================
function toggleTheme(){darkMode=!darkMode;document.documentElement.setAttribute('data-theme',darkMode?'dark':'light');document.getElementById('themeBtn').textContent=darkMode?'☀️ Tema':'🌙 Tema';localStorage.setItem(SAVE_KEY+'_theme',darkMode?'dark':'light');sfx('click');}
function initTheme(){const s=localStorage.getItem(SAVE_KEY+'_theme');const sys=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;darkMode=(s==='dark')||(s===null&&sys);if(darkMode){document.documentElement.setAttribute('data-theme','dark');document.getElementById('themeBtn').textContent='☀️ Tema';}}

// ===================== LOCALSTORAGE =====================
function saveProgress(){try{localStorage.setItem(SAVE_KEY,JSON.stringify({doneSections:Array.from(done),unlockedAch,evalFormNum,evalCritFormNum,xp}));}catch(e){}}
function loadProgress(){try{const s=JSON.parse(localStorage.getItem(SAVE_KEY));if(!s)return;if(s.doneSections&&Array.isArray(s.doneSections))s.doneSections.forEach(id=>{done.add(id);const b=document.querySelector(`[data-s="${id}"]`);if(b)b.classList.add('done');});if(s.unlockedAch&&Array.isArray(s.unlockedAch))unlockedAch=s.unlockedAch.filter(id=>ACHIEVEMENTS[id]!==undefined);if(s.evalFormNum)evalFormNum=s.evalFormNum;if(s.evalCritFormNum)evalCritFormNum=s.evalCritFormNum;if(s.xp!==undefined){xp=s.xp;updateXPBar();}}catch(e){}}

// ===================== ACHIEVEMENTS =====================
const ACHIEVEMENTS={
  primer_quiz:{icon:'🏅',label:'Primer quiz de los escenarios'},
  flash_master:{icon:'🃏',label:'Se sabe las piezas y las capacidades'},
  clasif_pro:{icon:'🗂️',label:'Separa la tarea que se lleva de la que no'},
  identificador:{icon:'🔎',label:'Encuentra la pieza que falta'},
  id_master:{icon:'🔠',label:'Encuentra la palabra en la oración'},
  completador:{icon:'✏️',label:'Completa las reglas'},
  ruta_experta:{icon:'🧭',label:'Ordena las cuatro piezas'},
  widgets_master:{icon:'🧩',label:'Resolvió los cuatro widgets'},
  neurona_pro:{icon:'⚙️',label:'Sabe de qué está hecho cada uno'},
  sistema_master:{icon:'🛡️',label:'Sabe qué tarea no se puede copiar'},
  enfermedades:{icon:'🔍',label:'Sabe qué preguntarle al que vende'},
  sopa_master:{icon:'🔤',label:'Sopa de los escenarios'},
  cronometro:{icon:'🔮',label:'Armó su propio escenario'},
  reto_hero:{icon:'⚡',label:'Héroe del Reto'},
  nivel3:{icon:'🌟',label:'Nivel 3 alcanzado'},
  nivel5:{icon:'✨',label:'¡Exige quién revisa! Nivel 6'},
  perfecto:{icon:'💯',label:'Evaluación perfecta'},
  explorador:{icon:'🗺️',label:'Miró los ocho oficios'}
};
function unlockAchievement(id){if(unlockedAch.includes(id))return;unlockedAch.push(id);sfx('ach');showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label);launchConfetti();renderAchPanel();saveProgress();}
function renderAchPanel(){const list=document.getElementById('achList');list.innerHTML='';Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{const div=document.createElement('div');div.className='ach-item'+(unlockedAch.includes(id)?'':' locked');div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`;list.appendChild(div);});}
function toggleAchPanel(){sfx('click');document.getElementById('achPanel').classList.toggle('open');}
function showToast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}t.textContent=msg;t.style.display='block';clearTimeout(t._tid);t._tid=setTimeout(()=>t.style.display='none',3200);}
function launchConfetti(){const colors=['#86198f','#c026d3','#4338ca','#0ea5e9','#e879f9'];for(let i=0;i<60;i++){const c=document.createElement('div');c.className='confetti-piece';c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`;document.body.appendChild(c);c.addEventListener('animationend',()=>c.remove());}}

// ===================== XP =====================
const lvls=[{t:0,n:'Aprendiz 🌱'},{t:25,n:'Sabe que un oficio son tareas 🧰'},{t:55,n:'Distingue las cuatro clases 📄'},{t:90,n:'Pregunta con qué se la lleva ⚙️'},{t:130,n:'Sabe qué le queda a la persona 🧑'},{t:165,n:'Reconoce una tarea con escudo 🛡️'},{t:190,n:'Mira un oficio y lo desarma 🏆'}];
function pts(n){xp=Math.max(0,Math.min(MXP,xp+n));updateXPBar();saveProgress();}
function updateXPBar(){const pct=Math.round((xp/MXP)*100);document.getElementById('xpFill').style.width=pct+'%';const el=document.getElementById('xpPts');el.textContent='⭐ '+xp;el.style.transform='scale(1.3)';setTimeout(()=>el.style.transform='',300);let lv=0;for(let i=0;i<lvls.length;i++)if(xp>=lvls[i].t)lv=i;document.getElementById('xpLvl').textContent=lvls[lv].n;if(lv!==prevLevel){if(lv>=2)unlockAchievement('nivel3');if(lv>=5)unlockAchievement('nivel5');prevLevel=lv;}}
function resetXP(){sfx('click');xp=0;updateXPBar();showToast('🔄 XP reiniciado a 0');}
function fin(id,showFX=true){if(!done.has(id)){done.add(id);const b=document.querySelector(`[data-s="${id}"]`);if(b)b.classList.add('done');if(showFX){sfx('up');launchConfetti();}saveProgress();}}
function getProgress(){return Math.round((done.size/TOTAL_SECTIONS)*100);}

// ===================== NAV =====================
function go(id){sfx('click');document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});document.getElementById(id).classList.add('active');const btn=document.querySelector(`[data-s="${id}"]`);if(btn){btn.classList.add('active');btn.setAttribute('aria-selected','true');}window.scrollTo({top:0,behavior:'smooth'});if(id==='s-sopa'){setTimeout(buildSopa,50);}if(id==='s-widgets'){setTimeout(buildRoute,50);}}

// ===================== FLASHCARD DATA =====================
const fcData = (function () {
  /* Las tarjetas salen de js/data/ia-futuros.js: los cuatro tipos de tarea,
     las seis capacidades que ya existen, la cuenta de siempre, los tres
     escudos y lo que cambia al estudiar. Ni una se escribe a mano aquí, que
     es la regla de esta ruta desde el Himno.
     ⚠️ Los porcentajes se CUENTAN con iaOfiPorTipo(), nunca se escriben aquí:
     a mano envejecerían el día que entre un oficio nuevo, y nadie lo notaría.
     ⚠️ El frente lleva HTML (un <br> y un <small>), así que upFC lo pinta con
     innerHTML: con textContent el alumno lee las etiquetas escritas, que es lo
     que estaba pasando en las etapas 5 y 6 hasta que lo cazó la sonda. */
  const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const t = [];
  const pct = {};
  iaOfiPorTipo().forEach(x => { pct[x.k] = x.pct; });
  t.push({ w:'🧰 ¿Se lleva <strong>oficios</strong> o <strong>tareas</strong>?',
           a:'Tareas. Un oficio es un montón de tareas distintas. Se lleva unas y otras no.' });
  t.push({ w:'🔑 La pregunta que sirve',
           a:'No es «¿mi oficio se salva?». Es <strong>«¿de qué tareas está hecho?»</strong>.' });
  IA_OFI_TIPOS.forEach(ti => t.push({
    w: ti.e + ' Tarea <strong>' + esc(ti.nombre) + '</strong><br><small>¿cuánto se lleva?</small>',
    a: '<strong>' + pct[ti.k] + ' %</strong> de estas tareas.<br><br>' + esc(ti.que)
  }));
  t.push({ w:'⚠️ ¿Tareas u <strong>horas</strong>?',
           a:'Se cuentan tareas, no horas. A don Chele le quedan cinco de siete, y esas cinco se llevan el día.' });
  IA_CAPACIDADES.forEach(c => t.push({
    w: c.e + ' <strong>' + esc(c.que) + '</strong><br><small>¿dónde lo produjiste?</small>',
    a: '<strong>Etapa ' + c.etapa + '.</strong> ' + esc(c.donde) + '<br><br>Falla así: ' + esc(c.falla)
  }));
  t.push({ w: IA_CUENTA.e + ' <strong>' + esc(IA_CUENTA.que) + '</strong>',
           a: esc(IA_CUENTA.donde) + '<br><br>Quien te lo venda como nuevo te vende humo viejo.' });
  IA_ESCUDOS.forEach(e => t.push({
    w: e.e + ' Escudo: <strong>' + esc(e.nombre) + '</strong>',
    a: esc(e.que) + '<br><br>' + esc(e.porque)
  }));
  IA_ESTUDIO.forEach(s => t.push({
    w: s.e + ' <strong>' + esc(s.titulo) + '</strong>',
    a: esc(s.que) + '<br><br>' + esc(s.hoy)
  }));
  t.push({ w:'🔮 ¿Y si te dicen «en dos años…»?',
           a:'Pasalo por las cuatro piezas. ¿Con qué está hecho? ¿A quién le pasa? ¿Qué cuesta? ¿Qué hay que decidir?' });
  return t;
})();
let fcIdx=0;
function upFC(){document.getElementById('fcInner').classList.remove('flipped');document.getElementById('fcW').innerHTML=fcData[fcIdx].w;document.getElementById('fcA').innerHTML=fcData[fcIdx].a;document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length;}
function flipCard(){sfx('flip');document.getElementById('fcInner').classList.toggle('flipped');if(!xpTracker.fc.has(fcIdx)){xpTracker.fc.add(fcIdx);pts(1);}if(xpTracker.fc.size===fcData.length){fin('s-flash');unlockAchievement('flash_master');}}
function nextFC(){sfx('click');fcIdx=(fcIdx+1)%fcData.length;upFC();}
function prevFC(){sfx('click');fcIdx=(fcIdx-1+fcData.length)%fcData.length;upFC();}

// ===================== QUIZ DATA =====================
const qzData=[
  {q:'¿Qué se lleva la máquina?',o:['Tareas sueltas','Oficios enteros','Ni lo uno ni lo otro','Solo los oficios nuevos'],c:0,exp:'Un oficio es un montón de tareas. Se lleva unas y otras no.'},
  {q:'¿Qué clase de tarea se lleva casi entera?',o:['La de manos','La de estar con alguien','La de papel','La de esperar'],c:2,exp:'Escribir, copiar, sumar y ordenar. Es lo primero que se va.'},
  {q:'¿Qué clase de tarea casi no se lleva?',o:['La de papel','La de mirar','La de contar','La de manos'],c:3,exp:'Levantar una pared se hace en el terreno, con las manos.'},
  {q:'Mirar la hoja y decir qué plaga es, ¿qué clase de tarea es?',o:['De papel','De mirar','De manos','De estar con alguien'],c:1,exp:'Y se la lleva: es el parecido que entrenaste en la etapa 2.'},
  {q:'De los ocho oficios, ¿cuántos desaparecen enteros?',o:['Dos','Casi todos','Ninguno','Todos'],c:2,exp:'Ninguno llega a cero y ninguno llega a cien. Todos cambian de forma.'},
  {q:'¿Cuál es la pregunta que sirve?',o:['¿Cuándo va a pasar?','¿Mi oficio se salva?','¿Quién lo inventó?','¿De qué tareas está hecho?'],c:3,exp:'Lo otro no se puede mirar. Las tareas sí se pueden escribir.'},
  {q:'Calificar exámenes de marcar, ¿con qué se lo lleva?',o:['Con una cuenta de siempre','Con una capacidad nueva','Con la voz','Con el refuerzo'],c:0,exp:'Comparar una marca con la clave ya lo hacía una computadora normal.'},
  {q:'Sumar y ordenar una lista, ¿es Inteligencia Artificial?',o:['Sí, es lo más nuevo','No: eso ya se hacía antes','Solo con internet','Solo en el mercado'],c:1,exp:'Quien te lo vende como nuevo te vende humo de hace sesenta años.'},
  {q:'A la profesora Delmy la máquina NO le puede…',o:['Sacar promedios','Calificar marcas','Ver que un niño no desayunó','Escribir preguntas'],c:2,exp:'Eso no está en ningún dato. Se ve en la cara y se pregunta.'},
  {q:'¿Por qué se cuentan tareas y no horas?',o:['Porque es más fácil','Porque las horas no importan','Porque no hay reloj','Porque las que quedan llevan el día'],c:3,exp:'A don Chele le quedan cinco tareas de siete, y son las más largas.'},
  {q:'Copiar la tarea que te hace una máquina…',o:['Te deja sin saber en el examen','Sube la nota final','Sirve igual que antes','Lo prohíbe la ley'],c:0,exp:'La nota de la tarea se la lleva ella. El examen lo hacés vos.'},
  {q:'¿Qué tarea NO puede entregar hecha una máquina?',o:['Un resumen de la Independencia','Medir tu patio y sacar su área','Un ensayo sobre la contaminación','Veinte ejercicios de fracciones'],c:1,exp:'Nadie midió tu patio. Los números los ponés vos, con la cinta.'},
  {q:'¿Cuáles son los tres escudos de una tarea?',o:['Delante, de aquí y de manos','Corta, larga y difícil','Papel, mirar y manos','Nota, examen y firma'],c:0,exp:'Son las tres cosas que a la máquina le faltan. No son castigos.'},
  {q:'¿Para qué sirve hoy saberse las cosas?',o:['Para copiar más rápido','Para comprobar lo que te dicen','Para no estudiar','Para escribir bonito'],c:1,exp:'Si no sabés que el Himno tiene siete estrofas, te cuela cinco.'},
  {q:'«En dos años nadie va a calificar.» ¿Qué le falta?',o:['Un emoji','Un color','Una persona con nombre','Un titular'],c:2,exp:'A «nadie» no le pasa nada. Sin una persona no hay quién decida.'}
];
let qzIdx=0,qzSel=-1,qzDone=false;
function buildQz(){qzIdx=0;qzSel=-1;qzDone=false;showQz();}
function showQz(){var _fbQ=document.getElementById('fbQz');if(_fbQ)_fbQ.classList.remove('show');if(qzIdx>=qzData.length){document.getElementById('qzQ').textContent='🎉 ¡Quiz completado!';document.getElementById('qzOpts').innerHTML='';fin('s-quiz');unlockAchievement('primer_quiz');return;}const q=qzData[qzIdx];document.getElementById('qzProg').textContent=`Pregunta ${qzIdx+1} de ${qzData.length}`;document.getElementById('qzQ').textContent=q.q;const opts=document.getElementById('qzOpts');opts.innerHTML='';q.o.forEach((o,i)=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=o;b.onclick=()=>{if(qzDone)return;document.querySelectorAll('.qz-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');qzSel=i;sfx('click');};opts.appendChild(b);});qzDone=false;}
// El quiz ya NO avanza solo a los 1,6 s. Con el avance automático, el alumno que
// fallaba veía la respuesta correcta medio segundo y desaparecía antes de poder
// leerla; y el «Incorrecto» se quedaba colgado debajo de la pregunta SIGUIENTE,
// que todavía no había contestado. Ahora avanza él, cuando ya la leyó.
function nextQz(){
  if(!qzDone)return fb('fbQz','Primero toca «Verificar».',false);
  qzIdx++; qzSel=-1; qzDone=false; showQz();
}
function checkQz(){if(qzSel<0)return fb('fbQz','Selecciona una respuesta.',false);qzDone=true;const opts=document.querySelectorAll('.qz-opt');if(qzSel===qzData[qzIdx].c){opts[qzSel].classList.add('correct');fb('fbQz','¡Correcto! +5 XP',true);if(!xpTracker.qz.has(qzIdx)){xpTracker.qz.add(qzIdx);pts(5);}sfx('ok');}else{opts[qzSel].classList.add('wrong');opts[qzData[qzIdx].c].classList.add('correct');fb('fbQz','Incorrecto. Revisa la respuesta correcta.',false);sfx('no');}}
function resetQz(){sfx('click');qzIdx=0;qzSel=-1;qzDone=false;showQz();document.getElementById('fbQz').classList.remove('show');}

// ===================== CLASIFICACIÓN =====================
const classGroups=[
  {label:['🤖 Se la lleva la máquina','🧑 Se queda con la persona'],headA:'🤖 Se la lleva la máquina',headB:'🧑 Se queda con la persona',colA:'🤖 Se la lleva la máquina',colB:'🧑 Se queda con la persona',words:[
    {w:'Llenar planillas y sacar promedios',t:'🤖 Se la lleva la máquina'},
    {w:'Mirar una radiografía y marcar lo raro',t:'🤖 Se la lleva la máquina'},
    {w:'Buscar un expediente en el archivo',t:'🤖 Se la lleva la máquina'},
    {w:'Decir cuál es la ruta más rápida hoy',t:'🤖 Se la lleva la máquina'},
    {w:'Ponerle la vía a un niño de tres años',t:'🧑 Se queda con la persona'},
    {w:'Levantar la pared, bloque por bloque',t:'🧑 Se queda con la persona'},
    {w:'Convencer al que está dudando',t:'🧑 Se queda con la persona'},
    {w:'Firmar el informe y dar la cara',t:'🧑 Se queda con la persona'}
  ]},
  {label:['📄 De papel o de mirar','✋ De manos o de gente'],headA:'📄 De papel o de mirar',headB:'✋ De manos o de gente',colA:'📄 De papel o de mirar',colB:'✋ De manos o de gente',words:[
    {w:'Sumar las facturas del mes',t:'📄 De papel o de mirar'},
    {w:'Ver que la pared está fuera de plomo',t:'📄 De papel o de mirar'},
    {w:'Pasar en limpio lo que se dictó',t:'📄 De papel o de mirar'},
    {w:'Mirar el tomate y ver cuál no aguanta',t:'📄 De papel o de mirar'},
    {w:'Doblar el hierro a la medida',t:'✋ De manos o de gente'},
    {w:'Cargar y acarrear los sacos',t:'✋ De manos o de gente'},
    {w:'Atender al padre que llega enojado',t:'✋ De manos o de gente'},
    {w:'Esperar a la señora que viene corriendo',t:'✋ De manos o de gente'}
  ]},
  {label:['📋 La entrega una máquina','🔒 Lleva escudo'],headA:'📋 La entrega una máquina',headB:'🔒 Lleva escudo',colA:'📋 La entrega una máquina',colB:'🔒 Lleva escudo',words:[
    {w:'Escribí un resumen de la Independencia',t:'📋 La entrega una máquina'},
    {w:'Copiá la definición de adjetivo',t:'📋 La entrega una máquina'},
    {w:'Resolvé veinte ejercicios de fracciones',t:'📋 La entrega una máquina'},
    {w:'Leé este texto y contestá cinco preguntas',t:'📋 La entrega una máquina'},
    {w:'Medí tu patio y sacá su área',t:'🔒 Lleva escudo'},
    {w:'Explicá en voz alta cómo lo resolviste',t:'🔒 Lleva escudo'},
    {w:'Contá los buses que pasan en media hora',t:'🔒 Lleva escudo'},
    {w:'Preguntale a tu vecina qué se sembraba antes',t:'🔒 Lleva escudo'}
  ]}
];
let currentClassGroupIdx=0,clsSelectedWord=null;
function buildClass(){const group=classGroups[currentClassGroupIdx];document.getElementById('col-left-head').textContent=group.headA;document.getElementById('col-right-head').textContent=group.headB;const bank=document.getElementById('clsBank');bank.innerHTML='';clsSelectedWord=null;document.getElementById('items-left').innerHTML='';document.getElementById('items-right').innerHTML='';_shuffle([...group.words]).forEach(w=>{const el=document.createElement('div');el.className='wb-item';el.textContent=w.w;el.dataset.t=w.t;el.onclick=()=>{document.querySelectorAll('.wb-item').forEach(i=>i.classList.remove('sel-word'));el.classList.add('sel-word');clsSelectedWord=el;sfx('click');};bank.appendChild(el);});['col-left','col-right'].forEach(colId=>{const col=document.getElementById(colId);col.onclick=(e)=>{if(!clsSelectedWord||e.target.classList.contains('drop-item'))return;const targetId=colId==='col-left'?'items-left':'items-right';const wordsCol=document.getElementById(targetId);const item=document.createElement('div');item.className='drop-item';item.textContent=clsSelectedWord.textContent;item.dataset.t=clsSelectedWord.dataset.t;const original=clsSelectedWord;item.onclick=(ev)=>{ev.stopPropagation();if(clsSelectedWord!==null){col.click();}else{document.getElementById('clsBank').appendChild(original);original.classList.remove('sel-word');item.remove();if(typeof sfx==='function')sfx('click');}};wordsCol.appendChild(item);clsSelectedWord.remove();clsSelectedWord=null;sfx('click');};});}
function checkClass(){const remaining=document.querySelectorAll('#clsBank .wb-item').length;if(remaining>0){fb('fbCls','Mueve todas las palabras a las columnas primero.',false);return;}const group=classGroups[currentClassGroupIdx];let allOk=true;document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{const inLeft=el.parentElement.id==='items-left';const expectedType=inLeft?group.colA:group.colB;if(el.dataset.t===expectedType){el.classList.add('cls-ok');}else{el.classList.add('cls-no');allOk=false;}});if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);}if(allOk){fb('fbCls','¡Perfecto! +5 XP',true);sfx('fan');fin('s-clasifica');unlockAchievement('clasif_pro');}else{fb('fbCls','Hay errores. Los errados llevan ✗.',false);sfx('no');}}
function nextClassGroup(){sfx('click');currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length;buildClass();document.getElementById('fbCls').classList.remove('show');showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]);}
function resetClass(){sfx('click');buildClass();document.getElementById('fbCls').classList.remove('show');}

// ===================== IDENTIFICAR =====================
const idData=[
  {s:['Un','oficio','es','un','montón','de','tareas','distintas.'],c:6,art:'Lo que de verdad se lleva la máquina'},
  {s:['La','máquina','no','se','lleva','oficios','enteros.'],c:5,art:'Lo que NO se lleva entero'},
  {s:['Las','tareas','de','papel','son','las','primeras','en','irse.'],c:3,art:'La clase de tarea que más se va'},
  {s:['Las','tareas','de','manos','casi','no','se','van.'],c:3,art:'La clase de tarea que se hace en un sitio'},
  {s:['Ningún','oficio','desaparece','entero.'],c:2,art:'Lo que NO le pasa a ningún oficio'},
  {s:['Sumar','y','ordenar','no','es','Inteligencia','Artificial.'],c:0,art:'La cuenta que una computadora ya hacía antes'},
  {s:['Una','tarea','con','escudo','no','se','puede','copiar.'],c:3,art:'Lo que hace que una tarea no se copie'},
  {s:['Se','cuentan','tareas,','no','horas','de','trabajo.'],c:4,art:'Lo que este conteo NO mide'},
  {s:['Saberse','las','cosas','sirve','para','comprobar','lo','que','leés.'],c:5,art:'Para lo que sirve hoy saberse las cosas'},
  {s:['Preguntá','de','qué','tareas','está','hecho','tu','oficio.'],c:3,art:'Aquello de lo que está hecho un oficio'}
];
let idIdx=0,idDone=false;
function showId(){idDone=false;if(idIdx>=idData.length){document.getElementById('idSent').innerHTML='🎉 ¡Completado!';fin('s-identifica');unlockAchievement('id_master');return;}const d=idData[idIdx];document.getElementById('idProg').textContent=`Oración ${idIdx+1} de ${idData.length}`;document.getElementById('idInfo').textContent=`Busca: ${d.art}`;const sent=document.getElementById('idSent');sent.innerHTML='';d.s.forEach((w,i)=>{const span=document.createElement('span');span.className='id-word';span.textContent=w+' ';span.onclick=()=>checkId(i,span);sent.appendChild(span);});}
function checkId(i,span){if(idDone)return;document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected'));span.classList.add('selected');if(i===idData[idIdx].c){idDone=true;span.classList.add('id-ok');fb('fbId','¡Correcto! +5 XP',true);if(!xpTracker.id.has(idIdx)){xpTracker.id.add(idIdx);pts(5);}sfx('ok');}else{span.classList.add('id-no');fb('fbId','Ese no es el término solicitado.',false);sfx('no');}}
function nextId(){sfx('click');idIdx++;showId();document.getElementById('fbId').classList.remove('show');}
function resetId(){sfx('click');idIdx=0;showId();document.getElementById('fbId').classList.remove('show');}

// ===================== COMPLETA =====================
const cmpData=[
  {s:'Un oficio es un montón de ___ distintas.',opts:['tareas','oficios','horas'],c:0},
  {s:'La máquina no se lleva oficios: se lleva ___.',opts:['gente','tareas','años'],c:1},
  {s:'Las tareas de ___ son las primeras en irse.',opts:['manos','gente','papel'],c:2},
  {s:'Las tareas de ___ casi no se las lleva.',opts:['manos','papel','mirar'],c:0},
  {s:'Ver qué plaga tiene la hoja es tarea de ___.',opts:['papel','manos','mirar'],c:2},
  {s:'Ningún oficio se va ___.',opts:['tarde','entero','solo'],c:1},
  {s:'Sumar y ordenar ya lo hacía una computadora ___.',opts:['normal','nueva','moderna'],c:0},
  {s:'Se cuentan tareas, no ___.',opts:['días','horas','sueldos'],c:1},
  {s:'Una tarea con ___ no se puede copiar.',opts:['nota','fecha','escudo'],c:2},
  {s:'Saberse las cosas sirve para ___ lo que te dicen.',opts:['creer','copiar','comprobar'],c:2},
  {s:'La pregunta buena es de qué ___ está hecho.',opts:['tareas','años','manos'],c:0},
  {s:'Lo que entregás lo ___ vos.',opts:['borrás','firmás','leés'],c:1}
];
let cmpIdx=0,cmpSel=-1,cmpDone=false;
function showCmp(){var _fbC=document.getElementById('fbCmp');if(_fbC)_fbC.classList.remove('show');if(cmpIdx>=cmpData.length){document.getElementById('cmpSent').innerHTML='🎉 ¡Completado!';document.getElementById('cmpOpts').innerHTML='';fin('s-completa');return;}const d=cmpData[cmpIdx];document.getElementById('cmpProg').textContent=`Oración ${cmpIdx+1} de ${cmpData.length}`;document.getElementById('cmpSent').innerHTML=d.s.replace('___','<span class="blank">___</span>');const opts=document.getElementById('cmpOpts');opts.innerHTML='';cmpSel=-1;cmpDone=false;d.opts.forEach((o,i)=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=o;b.onclick=()=>{if(cmpDone)return;document.querySelectorAll('.cmp-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');cmpSel=i;sfx('click');};opts.appendChild(b);});}
// Misma razón que en el quiz: la corrección se lee, no se persigue.
function nextCmp(){
  if(!cmpDone)return fb('fbCmp','Primero toca «Verificar».',false);
  cmpIdx++; cmpSel=-1; cmpDone=false; showCmp();
}
function checkCmp(){if(cmpSel<0)return fb('fbCmp','Selecciona una opción.',false);cmpDone=true;const opts=document.querySelectorAll('.cmp-opt');if(cmpSel===cmpData[cmpIdx].c){opts[cmpSel].classList.add('correct');document.getElementById('cmpSent').innerHTML=cmpData[cmpIdx].s.replace('___',`<span class="blank" style="color:var(--jade);border-color:var(--jade)">${opts[cmpSel].textContent}</span>`);fb('fbCmp','¡Correcto! +5 XP',true);if(!xpTracker.cmp.has(cmpIdx)){xpTracker.cmp.add(cmpIdx);pts(5);}sfx('ok');}else{opts[cmpSel].classList.add('wrong');opts[cmpData[cmpIdx].c].classList.add('correct');fb('fbCmp','Incorrecto. Revisa bien la respuesta.',false);sfx('no');}}

// ===================== WIDGETS =====================
// Widget 1: Ordenar secuencias
const routeSets = [
  { label: 'Ordena los tipos de tarea: del que más se lleva al que menos',
    steps: iaOfiPorTipo().slice().sort((a, b) => b.pct - a.pct).map((t, i) => (i + 1) + '. ' + t.e + ' ' + t.nombre) },
  { label: 'Ordena lo que hacés para mirar un oficio',
    steps: ['1. Escribí todas sus tareas, una por una.', '2. Ponele a cada una su tipo.', '3. Marcá cuáles se lleva la máquina.', '4. Mirá con qué se las lleva.', '5. Decidí qué vas a aprender a hacer vos.'] },
  { label: 'Ordena lo que hacés con un «en dos años…»',
    steps: IA_FUT_PIEZAS.map((p, i) => (i + 1) + '. ' + p.e + ' ' + p.nombre) }
];
let currentRouteIdx=0,routeItems=[];
function buildRoute(){routeItems=_shuffle([...routeSets[currentRouteIdx].steps]);renderRoute();const fbEl=document.getElementById('fbRoute');if(fbEl)fbEl.classList.remove('show');}
function renderRoute(){const list=document.getElementById('routeList');if(!list)return;list.innerHTML='';routeItems.forEach((step,i)=>{const div=document.createElement('div');div.className='sort-item';div.innerHTML=`<div class="sort-arrows"><button class="sort-arrow" onclick="routeMove(${i},-1)"${i===0?' disabled':''}>▲</button><button class="sort-arrow" onclick="routeMove(${i},1)"${i===routeItems.length-1?' disabled':''}>▼</button></div><div class="sort-step-num">${i+1}.</div><div class="sort-item-txt">${step}</div>`;list.appendChild(div);});}
function routeMove(idx,dir){sfx('click');const ni=idx+dir;if(ni<0||ni>=routeItems.length)return;[routeItems[idx],routeItems[ni]]=[routeItems[ni],routeItems[idx]];renderRoute();}
function checkRoute(){const correct=routeSets[currentRouteIdx].steps;const isOk=routeItems.every((s,i)=>s===correct[i]);if(isOk){fb('fbRoute','¡Perfecto! Orden correcto. +4 XP',true);if(!xpTracker.wgt.has('route_'+currentRouteIdx)){xpTracker.wgt.add('route_'+currentRouteIdx);pts(4);}sfx('fan');fin('s-widgets');unlockAchievement('widgets_master');}else{fb('fbRoute','Hay pasos fuera de orden. Revisa el arreglo.',false);sfx('no');}}
function nextRoute(){sfx('click');currentRouteIdx=(currentRouteIdx+1)%routeSets.length;buildRoute();showToast('🔄 Secuencia: '+routeSets[currentRouteIdx].label);}

// Widget 2: Identifica el concepto
const neuronPartes = (function () {
  /* ⚠️ Antes preguntaba por las cuatro piezas de un escenario, que en esta
     misión ya no son el tema: son la herramienta corta del final. Ahora
     pregunta por LA CLASE DE UNA TAREA, que es lo que el alumno tiene que
     saber mirar en cualquier oficio, incluido uno que todavía no existe.
     Sale de los ocho oficios: ni una tarea escrita a mano. */
  const nombres = IA_OFI_TIPOS.map(t => t.e + ' ' + t.nombre);
  const nombre = k => { const t = IA_OFI_TIPOS.find(x => x.k === k); return t.e + ' ' + t.nombre; };
  const p = [];
  IA_OFI_TIPOS.forEach(ti => {
    /* Dos por clase, de oficios distintos, para que no se acierte por el
       oficio en vez de por la tarea. */
    const tareas = [];
    IA_OFICIOS.forEach(o => o.tareas.forEach(t => { if (t.tipo === ti.k) tareas.push({ o: o, t: t }); }));
    const paso = Math.max(1, Math.floor(tareas.length / 2));
    [0, paso].forEach(i => {
      const x = tareas[i % tareas.length];
      if (x) p.push({ desc: x.t.t + ' (' + x.o.nombre.toLowerCase() + ')', ans: nombre(ti.k), opts: nombres.slice() });
    });
  });
  return p;
})();
let neuronIdx=0,neuronDone=false;
function showNeuron(){neuronDone=false;if(neuronIdx>=neuronPartes.length){const el=document.getElementById('neuronDesc');if(el)el.textContent='🎉 ¡Ya reconoces a cada uno por lo que hizo!';const opts=document.getElementById('neuronOpts');if(opts)opts.innerHTML='';fin('s-widgets');return;}const d=neuronPartes[neuronIdx];const prog=document.getElementById('neuronProg');if(prog)prog.textContent=`Pista ${neuronIdx+1} de ${neuronPartes.length}`;const desc=document.getElementById('neuronDesc');if(desc)desc.textContent=d.desc;const opts=document.getElementById('neuronOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=opt;b.onclick=()=>checkNeuron(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuron');if(fbEl)fbEl.classList.remove('show');}
function checkNeuron(opt,btn,d){if(neuronDone)return;neuronDone=true;document.querySelectorAll('#neuronOpts .cmp-opt').forEach(b=>{if(b.textContent===d.ans)b.classList.add('correct');else if(b===btn&&b.textContent!==d.ans)b.classList.add('wrong');});const isOk=opt===d.ans;if(isOk){fb('fbNeuron','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuron_'+neuronIdx)){xpTracker.wgt.add('neuron_'+neuronIdx);pts(3);}sfx('ok');}else{fb('fbNeuron','La respuesta correcta es: '+d.ans,false);sfx('no');}}
function nextNeuron(){sfx('click');neuronIdx++;showNeuron();}
function resetNeuron(){sfx('click');neuronIdx=0;showNeuron();}

// Widget 3: Concepto → Significado
const neuroPairs = (function () {
  /* ⚠️ Antes preguntaba qué PIEZA le falta a una frase. Ahora pregunta CON QUÉ
     se lleva la máquina una tarea, que es la columna que separa esta misión de
     la publicidad: o es una capacidad que el alumno produjo, o es una cuenta
     que una computadora normal ya hacía. Solo entran tareas que se lleva. */
  const ops = IA_CAPACIDADES.map(c => c.e + ' ' + c.corto).concat([IA_CUENTA.e + ' ' + IA_CUENTA.corto]);
  const comoDe = t => t.como === IA_CUENTA.k ? IA_CUENTA.e + ' ' + IA_CUENTA.corto
    : (function () { const c = IA_CAPACIDADES.find(x => x.k === t.como); return c.e + ' ' + c.corto; })();
  const vistas = {}, out = [];
  IA_OFICIOS.forEach(o => o.tareas.forEach(t => {
    if (t.maquina === 'no') return;
    /* Hasta dos por «con qué»: salen todas las formas y ninguna se repite
       cinco veces, que es lo que pasaba tomándolas todas —«sumar, ordenar y
       buscar» aparece en casi todos los oficios—. */
    if (vistas[t.como] >= 2) return;
    vistas[t.como] = (vistas[t.como] || 0) + 1;
    out.push({ trans: t.t + ' (' + o.nombre.toLowerCase() + ')', func: comoDe(t), opts: ops.slice() });
  }));
  return out;
})();
let neuroIdx=0,neuroDone=false;
function showNeuro(){neuroDone=false;if(neuroIdx>=neuroPairs.length){const el=document.getElementById('neuroTrans');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('neuroOpts');if(opts)opts.innerHTML='';return;}const d=neuroPairs[neuroIdx];const prog=document.getElementById('neuroProg');if(prog)prog.textContent=`${neuroIdx+1} de ${neuroPairs.length}`;const trans=document.getElementById('neuroTrans');if(trans)trans.textContent=d.trans;const opts=document.getElementById('neuroOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkNeuro(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuro');if(fbEl)fbEl.classList.remove('show');}
function checkNeuro(opt,btn,d){if(neuroDone)return;neuroDone=true;document.querySelectorAll('#neuroOpts .qz-opt').forEach(b=>{if(b.textContent===d.func)b.classList.add('correct');else if(b===btn&&b.textContent!==d.func)b.classList.add('wrong');});const isOk=opt===d.func;if(isOk){fb('fbNeuro','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuro_'+neuroIdx)){xpTracker.wgt.add('neuro_'+neuroIdx);pts(3);}sfx('ok');}else{fb('fbNeuro','Correcto: '+d.func,false);sfx('no');}setTimeout(()=>{neuroIdx++;showNeuro();},1800);}
function resetNeuro(){sfx('click');neuroIdx=0;showNeuro();}

// Widget 4: Fuente → ¿Renovable o no renovable?
const enfermedadData = (function () {
  /* La capacidad → EN QUÉ ETAPA la produjo el alumno con sus manos. Es la
     columna que convierte «dicen que la IA puede» en «esto lo hiciste vos», y
     por eso se pregunta. */
  const etapas = IA_CAPACIDADES.map(c => 'Etapa ' + c.etapa).filter((v, i, a) => a.indexOf(v) === i).sort();
  return IA_CAPACIDADES.map(c => ({ disease: c.que, characteristic: 'Etapa ' + c.etapa, opts: etapas.slice() }));
})();
let enferIdx=0,enferDone=false;
function showEnfer(){enferDone=false;if(enferIdx>=enfermedadData.length){const el=document.getElementById('enferDisease');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('enferOpts');if(opts)opts.innerHTML='';return;}const d=enfermedadData[enferIdx];const prog=document.getElementById('enferProg');if(prog)prog.textContent=`${enferIdx+1} de ${enfermedadData.length}`;const dis=document.getElementById('enferDisease');if(dis)dis.textContent=d.disease;const opts=document.getElementById('enferOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkEnfer(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbEnfer');if(fbEl)fbEl.classList.remove('show');}
function checkEnfer(opt,btn,d){if(enferDone)return;enferDone=true;document.querySelectorAll('#enferOpts .qz-opt').forEach(b=>{if(b.textContent===d.characteristic)b.classList.add('correct');else if(b===btn&&b.textContent!==d.characteristic)b.classList.add('wrong');});const isOk=opt===d.characteristic;if(isOk){fb('fbEnfer','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('enfer_'+enferIdx)){xpTracker.wgt.add('enfer_'+enferIdx);pts(3);}sfx('ok');}else{fb('fbEnfer','Correcto: '+d.characteristic,false);sfx('no');}setTimeout(()=>{enferIdx++;showEnfer();},1800);}
function resetEnfer(){sfx('click');enferIdx=0;showEnfer();}

// ===================== RETO FINAL =====================
const retoPairs=[
  {label:['La hace la máquina','La hace la persona'],btnA:'🤖 La máquina',btnB:'🧑 La persona',colA:'maq',colB:'per',
   words:[{w:'Sacar la cuenta del día',t:'maq'},{w:'Calificar exámenes de marcar',t:'maq'},{w:'Cuadrar una cita entre tres agendas',t:'maq'},{w:'Contestar el correo de siempre',t:'maq'},{w:'Arreglar el bus parado en el camino',t:'per'},{w:'Decirle a una madre que hay que viajar',t:'per'},{w:'Fiarle a la señora de siempre',t:'per'},{w:'Aguantar el año en que se pierde la milpa',t:'per'}]},
  {label:['Tarea de papel o de mirar','Tarea de manos o de gente'],btnA:'📄 Papel o mirar',btnB:'✋ Manos o gente',colA:'pm',colB:'mg',
   words:[{w:'Llevar el control de las vacunas',t:'pm'},{w:'Mirar el camino y ver el hueco',t:'pm'},{w:'Avisar quién lleva tres meses sin pagar',t:'pm'},{w:'Calcular los bloques y la arena',t:'pm'},{w:'Sembrar, limpiar y cosechar',t:'mg'},{w:'Ponerse de acuerdo con el dueño',t:'mg'},{w:'Responder por la nota que puso',t:'mg'},{w:'Decidir a quién atiende primero',t:'mg'}]},
  {label:['Se puede copiar','No se puede copiar'],btnA:'📋 Se copia',btnB:'🔒 No se copia',colA:'cop',colB:'no',
   words:[{w:'Hacé la línea del tiempo de los próceres',t:'cop'},{w:'Escribí un ensayo sobre la contaminación',t:'cop'},{w:'Escribí un resumen de la Independencia',t:'cop'},{w:'Copiá la definición de adjetivo',t:'cop'},{w:'Tomale la lectura un minuto a tu hermano',t:'no'},{w:'Escribí qué haría tu familia sin agua',t:'no'},{w:'Medí tu patio y sacá su perímetro',t:'no'},{w:'Preguntale a alguien mayor qué se sembraba',t:'no'}]}
];
let currentRetoPairIdx=0,retoPool=[],retoOk=0,retoErr=0,retoTimerInt=null,retoSec=30,retoRunning=false,retoCurrent=null;
function updateRetoButtons(){const pair=retoPairs[currentRetoPairIdx];document.querySelectorAll('.reto-btns .btn')[0].textContent=pair.btnA;document.querySelectorAll('.reto-btns .btn')[1].textContent=pair.btnB;document.querySelectorAll('.reto-btns .btn')[0].onclick=()=>ansReto(pair.colA);document.querySelectorAll('.reto-btns .btn')[1].onclick=()=>ansReto(pair.colB);}
function startReto(){if(retoRunning)return;sfx('click');retoRunning=true;retoOk=0;retoErr=0;retoSec=30;retoPool=_shuffle([...retoPairs[currentRetoPairIdx].words,...retoPairs[currentRetoPairIdx].words]);showRetoWord();retoTimerInt=setInterval(()=>{retoSec--;sfx('tick');document.getElementById('retoTimer').textContent='⏱ '+retoSec;if(retoSec<=10)document.getElementById('retoTimer').style.color='var(--red)';if(retoSec<=0){clearInterval(retoTimerInt);endReto();}},1000);}
function showRetoWord(){if(retoPool.length===0)retoPool=_shuffle([...retoPairs[currentRetoPairIdx].words,...retoPairs[currentRetoPairIdx].words]);retoCurrent=retoPool.pop();document.getElementById('retoWord').textContent=retoCurrent.w;}
function ansReto(t){if(!retoRunning||!retoCurrent)return;const firstPlay=!xpTracker.reto.has(currentRetoPairIdx);if(t===retoCurrent.t){sfx('ok');retoOk++;if(firstPlay)pts(1);}else{sfx('no');retoErr++;if(firstPlay)pts(-1);}document.getElementById('retoScore').textContent=`✅ ${retoOk} correctas | ❌ ${retoErr} errores`;showRetoWord();}
/* El elogio del Reto depende del resultado. Antes decía «¡Bien hecho!»
   con 0 de 8, en verde y con su logro: un elogio que no distingue
   acertar de no acertar le enseña al alumno que el elogio no significa
   nada. La escala es la misma que ya usa la Constancia. */
function _retoElogio(pct){
  if(pct>=90) return '¡Excelente!';
  if(pct>=70) return '¡Bien hecho!';
  if(pct>=40) return 'Vas bien, sigue practicando.';
  return 'Todavía no. Repasa y vuelve a intentarlo.';
}
function endReto(){retoRunning=false;document.getElementById('retoWord').textContent='🏁 ¡Tiempo!';document.getElementById('retoTimer').style.color='var(--pri)';xpTracker.reto.add(currentRetoPairIdx);const total=retoOk+retoErr;const pct=total>0?Math.round((retoOk/total)*100):0;fb('fbReto',`Resultado: ${retoOk}/${total} (${pct}%) ${_retoElogio(pct)}`,pct>=40);fin('s-reto');sfx('fan');if(pct>=70) unlockAchievement('reto_hero');}
function nextRetoPair(){sfx('click');clearInterval(retoTimerInt);retoRunning=false;retoSec=30;retoOk=0;retoErr=0;currentRetoPairIdx=(currentRetoPairIdx+1)%retoPairs.length;updateRetoButtons();document.getElementById('retoTimer').textContent='⏱ 30';document.getElementById('retoTimer').style.color='var(--pri)';document.getElementById('retoWord').textContent='¡Prepárate!';document.getElementById('retoScore').textContent='✅ 0 correctas | ❌ 0 errores';document.getElementById('fbReto').classList.remove('show');showToast(`🔄 Pareja: ${retoPairs[currentRetoPairIdx].label[0]} vs ${retoPairs[currentRetoPairIdx].label[1]}`);}
function resetReto(){sfx('click');clearInterval(retoTimerInt);retoRunning=false;retoSec=30;retoOk=0;retoErr=0;document.getElementById('retoTimer').textContent='⏱ 30';document.getElementById('retoTimer').style.color='var(--pri)';document.getElementById('retoWord').textContent='¡Prepárate!';document.getElementById('retoScore').textContent='✅ 0 correctas | ❌ 0 errores';document.getElementById('fbReto').classList.remove('show');}

// ===================== TASK GENERATOR =====================
const identifyTaskDB=[
  {s:'Llenar planillas y sacar promedios.',type:'📄 de papel · se la lleva'},
  {s:'Ponerle la vía a un niño de tres años.',type:'✋ de manos · no se la lleva'},
  {s:'Mirar el tomate y ver cuál ya no aguanta.',type:'👁️ de mirar · se la lleva'},
  {s:'Convencer al que está dudando.',type:'🧑 de estar con alguien · no se la lleva'},
  {s:'Buscar un expediente en el archivo.',type:'📄 de papel · se la lleva'},
  {s:'Arreglar el bus parado en el camino.',type:'✋ de manos · no se la lleva'},
  {s:'Decir qué se va a vender más el sábado.',type:'📄 de papel · se la lleva'},
  {s:'Responder por la nota que puso.',type:'🧑 de estar con alguien · no se la lleva'},
  {s:'Ver que la pared está fuera de plomo.',type:'👁️ de mirar · se la lleva'},
  {s:'Doblar el hierro a la medida.',type:'✋ de manos · no se la lleva'}
];
const classifyTaskDB=[
  {w:'El programa le contesta a la señorita Lesly el correo de siempre',gen:'💬 Con el texto que ya se escribe solo',n:'la señorita Lesly',g:'las horas que se le iban en el correo',t:'¿en qué va a usar esas horas?'},
  {w:'El programa le suma a don Beto las facturas del mes',gen:'⚙️ Con una cuenta de siempre',n:'don Beto',g:'las tardes de sumar facturas',t:'¿quién firma el informe si sale mal?'},
  {w:'El programa marca lo raro en las radiografías del centro',gen:'🍎 Con el parecido de la etapa 1',n:'la enfermera Sandra',g:'el rato de mirarlas una por una',t:'¿quién mira antes de mandar a alguien a viajar?'},
  {w:'Le dicen a don Chele cuándo sembrar, con el clima medido',gen:'📈 Con la predicción de la etapa 2',n:'don Chele',g:'media milpa si se equivoca',t:'¿siembra, si en su ladera no midió nadie?'},
  {w:'El colegio deja de mandar tareas escritas para la casa',gen:'💬 Con el texto que la máquina entrega hecho',n:'los alumnos de noveno',g:'la práctica de escribir, y la nota del examen',t:'¿qué tarea con escudo se manda en su lugar?'},
  {w:'A Katy le dicen que la máquina hará todo ese oficio',gen:'🧰 Se lleva tareas, nunca un oficio entero',n:'Katy',g:'tres años de estudio y la matrícula',t:'¿de qué tareas está hecho ese oficio?'}
];
const completeTaskDB=[
  {s:'Un oficio es un montón de ___ distintas.',opts:['tareas','horas','oficios'],ans:'tareas'},
  {s:'Las tareas de ___ son las primeras en irse.',opts:['manos','papel','gente'],ans:'papel'},
  {s:'Las tareas de ___ casi no se las lleva.',opts:['papel','mirar','manos'],ans:'manos'},
  {s:'Ningún oficio desaparece ___.',opts:['entero','solo','tarde'],ans:'entero'},
  {s:'Se cuentan tareas, no ___.',opts:['horas','días','sueldos'],ans:'horas'},
  {s:'Sumar y ordenar ya lo hacía una computadora ___.',opts:['nueva','normal','rara'],ans:'normal'},
  {s:'Una tarea con ___ no se puede copiar.',opts:['nota','escudo','fecha'],ans:'escudo'},
  {s:'Saberse las cosas sirve para ___ lo que te dicen.',opts:['copiar','creer','comprobar'],ans:'comprobar'},
  {s:'Ver qué plaga tiene la hoja es tarea de ___.',opts:['papel','mirar','manos'],ans:'mirar'},
  {s:'La pregunta buena es de qué ___ está hecho.',opts:['años','tareas','manos'],ans:'tareas'}
];
const explainQuestions=[
  {q:'¿Por qué la máquina no se lleva un oficio entero?',ans:'Porque un oficio es un montón de tareas y no se lleva todas.'},
  {q:'¿Qué clases de tarea se lleva casi enteras?',ans:'Las de papel y las de mirar: escribir, sumar, ordenar y reconocer.'},
  {q:'¿Por qué se cuentan tareas y no horas?',ans:'Porque las tareas que quedan pueden llevarse el día entero.'},
  {q:'Escribí las tareas de un oficio de tu pueblo, una por una.',ans:'Se valora que estén todas y que cada una lleve su tipo.'},
  {q:'¿Qué es un escudo y para qué sirve?',ans:'Lo que hace que una máquina no pueda entregar esa tarea hecha.'},
  {q:'Escribí una tarea de clase con escudo y decí cuál lleva.',ans:'Vale si pide hacerlo delante, un dato de aquí o medir algo.'},
  {q:'¿Por qué sumar una lista no es Inteligencia Artificial?',ans:'Porque una computadora normal ya lo hacía desde mucho antes.'},
  {q:'¿Qué le contestarías a Katy, que no sabe qué estudiar?',ans:'Que mire de qué tareas está hecho el oficio que le gusta.'}
];
let ansVisible=false;
function genTask(){sfx('click');const type=document.getElementById('tgType').value;const count=parseInt(document.getElementById('tgCount').value);ansVisible=false;const out=document.getElementById('tgOut');out.innerHTML='';if(type==='identify')genIdentifyTask(out,count);else if(type==='classify')genClassifyTask(out,count);else if(type==='complete')genCompleteTask(out,count);else if(type==='explain')genExplainTask(out,count);fin('s-tareas');}
function _instrBlock(out,title,lines){const ib=document.createElement('div');ib.className='tg-instruction-block';ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join('');out.appendChild(ib);}
function genIdentifyTask(out,count){_instrBlock(out,'Instrucción',['Copia cada tarea en tu cuaderno. Escribe al lado de qué clase es y si la máquina se la lleva.','<strong>Ejemplo:</strong> Sumar las facturas del mes. → <span style="color:var(--jade);font-weight:700;">📄 de papel · se la lleva</span>']);_pick(identifyTaskDB,Math.min(count,identifyTaskDB.length)).forEach((item,i)=>{const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.type}</div></div>`;out.appendChild(div);});}
function genClassifyTask(out,count){_instrBlock(out,'Instrucción',['Copia la tabla en tu cuaderno. Completa las cuatro piezas de cada caso.']);const items=_pick(classifyTaskDB,Math.min(count,classifyTaskDB.length));const wrap=document.createElement('div');wrap.style.overflowX='auto';const th=(t,extra='')=>`<th style="padding:0.3rem 0.4rem;border:1px solid var(--border);font-size:0.72rem;text-align:center;${extra}">${t}</th>`;let html=`<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:520px;"><thead><tr style="background:var(--pri-gl);">${th('El caso','text-align:left;')}${th('¿Con qué está hecho?')}${th('¿A quién le pasa?')}${th('¿Qué le cuesta?')}${th('¿Qué hay que decidir?')}</tr></thead><tbody>`;items.forEach(it=>{html+=`<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td>`+Array(4).fill(`<td style="padding:0.4rem;border:1px solid var(--border);min-width:50px;"></td>`).join('')+'</tr>';});html+='</tbody></table>';wrap.innerHTML=html;out.appendChild(wrap);const ans=document.createElement('div');ans.className='tg-answer';ans.style.marginTop='0.8rem';ans.innerHTML='<strong>✅ Respuestas:</strong><br>'+items.map(it=>`<strong>${it.w}:</strong> Con qué: ${it.gen} | A quién: ${it.n} | Qué cuesta: ${it.g} | Qué decidir: ${it.t}`).join('<br>');out.appendChild(ans);}
function genCompleteTask(out,count){_instrBlock(out,'Instrucción',['Copia y resuelve en tu cuaderno. Escribe la opción correcta en cada espacio.']);const pool=_shuffle([...completeTaskDB]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';const sent=item.s.replace('___','<span class="tg-blank" style="min-width:90px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${sent}</strong><div style="margin-top:0.4rem;font-size:0.82rem;color:var(--gray);">📝 Opciones: <strong>${item.opts.join(' | ')}</strong></div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function genExplainTask(out,count){_instrBlock(out,'Instrucción',['Copia las preguntas en tu cuaderno y responde cada una.']);const pool=_shuffle([...explainQuestions]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.3rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function toggleAns(){ansVisible=!ansVisible;document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none');sfx('click');}

// ===================== SOPA DE LETRAS =====================
const sopaSets=[
    {
        size: 12,
        grid: [
            ['C', 'C', 'Q', 'V', 'T', 'O', 'M', 'T', 'Q', 'R', 'B', 'P'],
            ['A', 'Ñ', 'M', 'Q', 'A', 'I', 'J', 'W', 'O', 'C', 'N', 'X'],
            ['Z', 'P', 'T', 'Z', 'R', 'Q', 'T', 'B', 'F', 'U', 'L', 'U'],
            ['B', 'A', 'P', 'A', 'E', 'K', 'J', 'T', 'I', 'I', 'Ñ', 'S'],
            ['W', 'P', 'R', 'D', 'A', 'X', 'V', 'H', 'C', 'O', 'Ñ', 'P'],
            ['Q', 'E', 'O', 'M', 'Z', 'E', 'B', 'M', 'I', 'X', 'C', 'Ñ'],
            ['E', 'L', 'P', 'R', 'H', 'Ñ', 'X', 'M', 'O', 'J', 'T', 'T'],
            ['U', 'C', 'R', 'S', 'Ñ', 'Z', 'T', 'T', 'M', 'K', 'W', 'M'],
            ['Y', 'B', 'U', 'O', 'D', 'U', 'C', 'S', 'E', 'A', 'S', 'M'],
            ['B', 'I', 'O', 'N', 'H', 'S', 'R', 'F', 'M', 'Z', 'I', 'U'],
            ['N', 'A', 'W', 'A', 'Ñ', 'N', 'A', 'B', 'X', 'K', 'B', 'X'],
            ['C', 'M', 'M', 'M', 'W', 'L', 'W', 'A', 'D', 'F', 'A', 'W'],
        ],
        words: [
            { w: 'TAREA', cells: [[0, 4], [1, 4], [2, 4], [3, 4], [4, 4]] },
            { w: 'OFICIO', cells: [[1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 8]] },
            { w: 'PAPEL', cells: [[2, 1], [3, 1], [4, 1], [5, 1], [6, 1]] },
            { w: 'MANOS', cells: [[11, 3], [10, 3], [9, 3], [8, 3], [7, 3]] },
            { w: 'MIRAR', cells: [[0, 6], [1, 5], [2, 4], [3, 3], [4, 2]] },
            { w: 'ESCUDO', cells: [[8, 8], [8, 7], [8, 6], [8, 5], [8, 4], [8, 3]] },
        ]
    },
    {
        size: 12,
        grid: [
            ['B', 'P', 'Z', 'G', 'C', 'J', 'P', 'S', 'U', 'Ñ', 'E', 'L'],
            ['S', 'L', 'F', 'J', 'U', 'Y', 'Q', 'M', 'Ñ', 'M', 'F', 'O'],
            ['Q', 'C', 'Y', 'D', 'E', 'P', 'I', 'Ñ', 'H', 'X', 'N', 'J'],
            ['C', 'Ñ', 'A', 'K', 'N', 'A', 'N', 'P', 'J', 'M', 'P', 'M'],
            ['P', 'U', 'S', 'P', 'T', 'R', 'R', 'Y', 'C', 'I', 'Y', 'I'],
            ['Ñ', 'V', 'Ñ', 'A', 'A', 'E', 'N', 'A', 'O', 'P', 'N', 'P'],
            ['W', 'B', 'S', 'L', 'D', 'C', 'M', 'O', 'I', 'C', 'B', 'Z'],
            ['L', 'Ñ', 'X', 'E', 'Ñ', 'I', 'I', 'K', 'Q', 'P', 'B', 'Ñ'],
            ['Y', 'B', 'C', 'U', 'Y', 'D', 'Y', 'D', 'Ñ', 'Q', 'O', 'D'],
            ['R', 'I', 'W', 'C', 'M', 'O', 'J', 'E', 'A', 'X', 'Z', 'C'],
            ['R', 'J', 'N', 'S', 'W', 'T', 'E', 'E', 'Y', 'D', 'Ñ', 'M'],
            ['Z', 'J', 'A', 'E', 'R', 'F', 'G', 'N', 'C', 'P', 'L', 'D'],
        ],
        words: [
            { w: 'CAPACIDAD', cells: [[2, 1], [3, 2], [4, 3], [5, 4], [6, 5], [7, 6], [8, 7], [9, 8], [10, 9]] },
            { w: 'PARECIDO', cells: [[2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5], [8, 5], [9, 5]] },
            { w: 'PREDECIR', cells: [[3, 7], [4, 6], [5, 5], [6, 4], [7, 3], [8, 2], [9, 1], [10, 0]] },
            { w: 'COPIAR', cells: [[9, 11], [8, 10], [7, 9], [6, 8], [5, 7], [4, 6]] },
            { w: 'CUENTA', cells: [[0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4]] },
            { w: 'ESCUELA', cells: [[11, 3], [10, 3], [9, 3], [8, 3], [7, 3], [6, 3], [5, 3]] },
        ]
    }
];
let currentSopaSetIdx=0,sopaFoundWords=new Set();
let sopaFirstClickCell=null,sopaPointerStartCell=null,sopaPointerMoved=false,sopaSelectedCells=[];
function getSopaCellSize(){const container=document.getElementById('sopaGrid');if(!container||!container.parentElement)return 28;const avail=container.parentElement.clientWidth-16;const set=sopaSets[currentSopaSetIdx];return Math.max(20,Math.min(32,Math.floor(avail/set.size)));}
function buildSopa(){const set=sopaSets[currentSopaSetIdx];const grid=document.getElementById('sopaGrid');grid.innerHTML='';const sz=getSopaCellSize();grid.style.gridTemplateColumns=`repeat(${set.size},${sz}px)`;grid.style.gridTemplateRows=`repeat(${set.size},${sz}px)`;sopaFirstClickCell=null;sopaSelectedCells=[];for(let r=0;r<set.size;r++)for(let c=0;c<set.size;c++){const cell=document.createElement('div');cell.className='sopa-cell';cell.style.width=sz+'px';cell.style.height=sz+'px';cell.style.fontSize=Math.max(11,sz-10)+'px';cell.textContent=set.grid[r][c];cell.dataset.row=r;cell.dataset.col=c;const alreadyFound=set.words.find(w=>sopaFoundWords.has(w.w)&&w.cells.some(([wr,wc])=>wr===r&&wc===c));if(alreadyFound)cell.classList.add('sopa-found');grid.appendChild(cell);}setupSopaEvents();const wl=document.getElementById('sopaWords');wl.innerHTML='';set.words.forEach(wObj=>{const sp=document.createElement('span');sp.className='sopa-w'+(sopaFoundWords.has(wObj.w)?' found':'');sp.id='sw-'+wObj.w;sp.textContent=wObj.w;wl.appendChild(sp);});}
function setupSopaEvents(){const grid=document.getElementById('sopaGrid');grid.onpointerdown=e=>{const cell=e.target.closest('.sopa-cell');if(!cell)return;e.preventDefault();grid.setPointerCapture(e.pointerId);sopaPointerStartCell=cell;sopaPointerMoved=false;cell.classList.add('sopa-sel');sopaSelectedCells=[cell];};grid.onpointermove=e=>{if(!sopaPointerStartCell)return;e.preventDefault();const el=document.elementFromPoint(e.clientX,e.clientY);const cell=el?el.closest('.sopa-cell'):null;if(!cell)return;const sr=parseInt(sopaPointerStartCell.dataset.row),sc=parseInt(sopaPointerStartCell.dataset.col);const er=parseInt(cell.dataset.row),ec=parseInt(cell.dataset.col);if(sr!==er||sc!==ec)sopaPointerMoved=true;document.querySelectorAll('.sopa-cell.sopa-sel').forEach(c=>c.classList.remove('sopa-sel'));sopaSelectedCells=[];getSopaPath(sr,sc,er,ec).forEach(([r,c])=>{const pc=document.querySelector(`#sopaGrid [data-row="${r}"][data-col="${c}"]`);if(pc){pc.classList.add('sopa-sel');sopaSelectedCells.push(pc);}});};grid.onpointerup=e=>{if(!sopaPointerStartCell)return;e.preventDefault();grid.releasePointerCapture(e.pointerId);if(sopaPointerMoved&&sopaSelectedCells.length>1){checkSopaSelection();}else{const cell=sopaPointerStartCell;document.querySelectorAll('.sopa-cell.sopa-sel').forEach(c=>c.classList.remove('sopa-sel'));sopaSelectedCells=[];if(!sopaFirstClickCell){sopaFirstClickCell=cell;cell.classList.add('sopa-start');}else if(sopaFirstClickCell===cell){cell.classList.remove('sopa-start');sopaFirstClickCell=null;}else{const sr=parseInt(sopaFirstClickCell.dataset.row),sc=parseInt(sopaFirstClickCell.dataset.col);const er=parseInt(cell.dataset.row),ec=parseInt(cell.dataset.col);sopaFirstClickCell.classList.remove('sopa-start');sopaFirstClickCell=null;getSopaPath(sr,sc,er,ec).forEach(([r,c])=>{const pc=document.querySelector(`#sopaGrid [data-row="${r}"][data-col="${c}"]`);if(pc){pc.classList.add('sopa-sel');sopaSelectedCells.push(pc);}});checkSopaSelection();}}sopaPointerStartCell=null;sopaPointerMoved=false;};}
function getSopaPath(r1,c1,r2,c2){const dr=Math.sign(r2-r1),dc=Math.sign(c2-c1);const lr=Math.abs(r2-r1),lc=Math.abs(c2-c1);if(lr!==0&&lc!==0&&lr!==lc)return[[r1,c1]];const len=Math.max(lr,lc);const path=[];for(let i=0;i<=len;i++)path.push([r1+dr*i,c1+dc*i]);return path;}
function checkSopaSelection(){const set=sopaSets[currentSopaSetIdx];const word=sopaSelectedCells.map(c=>c.textContent).join('');const wordRev=word.split('').reverse().join('');const found=set.words.find(wObj=>!sopaFoundWords.has(wObj.w)&&(wObj.w===word||wObj.w===wordRev));if(found){sopaFoundWords.add(found.w);found.cells.forEach(([r,c])=>{const cell=document.querySelector(`#sopaGrid [data-row="${r}"][data-col="${c}"]`);if(cell){cell.classList.remove('sopa-sel','sopa-start');cell.classList.add('sopa-found');}});const sp=document.getElementById('sw-'+found.w);if(sp)sp.classList.add('found');if(!xpTracker.sopa.has(found.w)){xpTracker.sopa.add(found.w);pts(1);}sfx('ok');if(sopaFoundWords.size===set.words.length){fin('s-sopa');sfx('fan');showToast('🎉 ¡Todas las palabras encontradas!');}else showToast('✅ ¡Encontraste: '+found.w+'!');}else sfx('no');document.querySelectorAll('.sopa-cell.sopa-sel').forEach(c=>c.classList.remove('sopa-sel'));sopaSelectedCells=[];}
function nextSopaSet(){sfx('click');sopaFoundWords=new Set();currentSopaSetIdx=(currentSopaSetIdx+1)%sopaSets.length;buildSopa();showToast('🔄 Nueva sopa cargada');}
let _sopaResizeTimer=null;
window.addEventListener('resize',()=>{clearTimeout(_sopaResizeTimer);_sopaResizeTimer=setTimeout(()=>{if(document.getElementById('s-sopa').classList.contains('active'))buildSopa();},200);});

// ===================== EVALUACIÓN FINAL =====================
const evalTFBank=[
  {q:'Un oficio es un montón de tareas distintas.',a:true},
  {q:'La máquina se lleva oficios enteros.',a:false},
  {q:'Las tareas de papel son las primeras en irse.',a:true},
  {q:'Las tareas de manos se las lleva casi todas.',a:false},
  {q:'Mirar algo y decir qué es también se lo lleva.',a:true},
  {q:'Ninguno de los ocho oficios desaparece entero.',a:true},
  {q:'La pregunta buena es «¿mi oficio se salva?».',a:false},
  {q:'Sumar y ordenar una lista es Inteligencia Artificial.',a:false},
  {q:'Este conteo mide horas de trabajo.',a:false},
  {q:'Se cuentan tareas, no horas.',a:true},
  {q:'A don Chele le quedan las tareas más largas del día.',a:true},
  {q:'Copiar la tarea hoy sirve igual que antes.',a:false},
  {q:'Una tarea que se hace delante de alguien no se copia.',a:true},
  {q:'Una tarea con un dato de tu barrio la entrega la máquina.',a:false},
  {q:'Saberse las cosas sirve para comprobar lo que te dicen.',a:true},
  {q:'Explicar en voz alta lo que hiciste lleva escudo.',a:true},
  {q:'La máquina puede ver que un niño no desayunó.',a:false},
  {q:'Una máquina responde ante la madre por la nota.',a:false},
  {q:'Ningún oficio de los ocho se salva entero.',a:true},
  {q:'Lo que entregás con tu nombre lo respondés vos.',a:true}
];
const evalMCBank=[
  {q:'La máquina no se lleva oficios: se lleva…',o:['tareas','años','pueblos','sueldos'],a:0},
  {q:'Una tarea de papel es…',o:['levantar una pared','sumar y ordenar','convencer a alguien','cargar sacos'],a:1},
  {q:'Una tarea de mirar es…',o:['fiarle a una señora','doblar el hierro','ver qué plaga tiene la hoja','sacar la cuenta'],a:2},
  {q:'Una tarea de manos es…',o:['buscar un expediente','contestar el correo','sacar promedios','ponerle la vía a un niño'],a:3},
  {q:'La clase de tarea que MÁS se lleva la máquina es…',o:['la de papel','la de manos','la de gente','ninguna'],a:0},
  {q:'La clase de tarea que MENOS se lleva es…',o:['la de papel','la de manos','la de mirar','la de escribir'],a:1},
  {q:'De los ocho oficios mirados, desaparecen enteros…',o:['todos','la mitad','ninguno','tres'],a:2},
  {q:'Calificar exámenes de marcar se lo lleva…',o:['la voz fabricada','el refuerzo','el parecido','una cuenta de siempre'],a:3},
  {q:'A la profesora Delmy NO se le puede quitar…',o:['responder por la nota que puso','llenar planillas','sacar promedios','calificar marcas'],a:0},
  {q:'Don Toño, el albañil, pierde sobre todo…',o:['levantar la pared','calcular los bloques y la arena','doblar el hierro','hablar con el dueño'],a:1},
  {q:'Doña Tere sigue haciendo ella…',o:['sacar la cuenta del día','ver qué tomate no aguanta','convencer al que duda','saber qué se vende el sábado'],a:2},
  {q:'Sumar, ordenar y buscar en una lista…',o:['es lo más nuevo que hay','solo funciona con internet','no lo hace ninguna máquina','ya lo hacía una computadora normal'],a:3},
  {q:'Este conteo de la misión cuenta…',o:['horas','sueldos','años','tareas'],a:3},
  {q:'A don Chele le quedan cinco tareas de siete, y esas cinco…',o:['se llevan todo el día','no cuestan nada','las hace la máquina','duran un minuto'],a:0},
  {q:'Copiar la tarea que te hace una máquina te deja…',o:['con mejor nota final','llegando al examen sin saber','sin tarea','con más tiempo libre'],a:1},
  {q:'Una tarea con escudo es…',o:['un resumen de la Independencia','un ensayo sobre la contaminación','medir tu patio y sacar su área','veinte ejercicios de fracciones'],a:2},
  {q:'Los tres escudos son…',o:['largo, corto y difícil','papel, mirar y manos','nota, firma y examen','delante, de aquí y de manos'],a:3},
  {q:'Lo que hay que saberse hoy sirve para…',o:['comprobar lo que te dicen','copiar más rápido','no estudiar','escribir bonito'],a:0},
  {q:'Lo que entregás con tu nombre…',o:['lo revisa la máquina','lo respondés vos','no lo firma nadie','no tiene dueño'],a:1},
  {q:'Antes de elegir qué estudiar, Katy tiene que preguntar…',o:['cuánto paga','quién lo dijo','de qué tareas está hecho','cuándo va a pasar'],a:2}
];
const evalCPBank=[
  {q:'Un oficio es un montón de ___.',a:'tareas'},
  {q:'Las tareas de ___ son las primeras en irse.',a:'papel'},
  {q:'Mirar algo y decir qué es es una tarea de ___.',a:'mirar'},
  {q:'Levantar una pared es una tarea de ___.',a:'manos'},
  {q:'Convencer y responder son tareas de estar con ___.',a:'alguien'},
  {q:'Ningún oficio desaparece ___.',a:'entero'},
  {q:'Se cuentan tareas, no ___.',a:'horas'},
  {q:'Sumar y ordenar ya lo hacía una computadora ___.',a:'normal'},
  {q:'Ponerle nombre a algo por su ___ con los ejemplos.',a:'parecido'},
  {q:'Con datos medidos, la máquina puede ___ lo que pasará.',a:'predecir'},
  {q:'Una tarea con ___ no se puede copiar.',a:'escudo'},
  {q:'Un escudo es hacerlo ___ de alguien.',a:'delante'},
  {q:'Otro escudo es usar un dato de ___.',a:'aquí'},
  {q:'Saberse las cosas sirve para ___.',a:'comprobar'},
  {q:'Lo que entregás lo ___ vos.',a:'firmás'},
  {q:'La pregunta buena es de qué tareas está ___.',a:'hecho'}
];
const evalPRBank=[
  {term:'Tarea de papel',def:'Escribir, copiar, sumar, ordenar y buscar'},
  {term:'Tarea de mirar',def:'Mirar algo y decir qué es o qué tiene'},
  {term:'Tarea de manos',def:'Hacerlo con el cuerpo, en un sitio'},
  {term:'Tarea de estar con alguien',def:'Convencer, darse cuenta y responder por lo hecho'},
  {term:'Oficio',def:'Un montón de tareas distintas'},
  {term:'Parecido',def:'Ponerle nombre a algo por lo que se parece'},
  {term:'Predecir',def:'Decir lo que pasará con datos que alguien midió'},
  {term:'Texto generado',def:'Un escrito que suena seguro y a veces inventa'},
  {term:'Voz fabricada',def:'Una voz hecha con unos segundos de audio'},
  {term:'Refuerzo',def:'Mejorar a fuerza de intentos, sin que le digan cómo'},
  {term:'La cuenta de siempre',def:'Lo que una computadora normal ya hacía antes'},
  {term:'Escudo',def:'Lo que hace que una tarea no se pueda copiar'},
  {term:'Delante de alguien',def:'Explicarlo en voz alta y contestar una pregunta'},
  {term:'Dato de aquí',def:'Algo de tu casa o de tu barrio que nadie escribió'},
  {term:'Conteo de tareas',def:'Cuenta tareas, nunca horas de trabajo'},
  {term:'La pregunta buena',def:'¿De qué tareas está hecho ese oficio?'}
];

// ══════════ Formas deterministas v1 (M.E.T.A.S, jul 2026) ══════════
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

function genEval(){sfx('click');_evalFormaSelector(); const _selF = document.getElementById('evalFormaSel'); if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10))); const cf = evalFormNum; const rng = _evalRng(cf); window._currentEvalForm=cf;evalFormNum = (evalFormNum % EVAL_FORMAS) + 1; _evalFormaSelector();saveProgress();document.getElementById('eval-screen-title').textContent=`🎓 Evaluación Final · Forma ${cf} · Escenarios por venir`;evalAnsVisible=false;const out=document.getElementById('evalOut');out.innerHTML='';const bar=document.createElement('div');bar.className='eval-score-bar';bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje · 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25 pts</span><span class="eval-score-pill esp-tf">V/F 25 pts</span><span class="eval-score-pill esp-mc">Selección 25 pts</span><span class="eval-score-pill esp-pr">Pareados 25 pts</span></div>`;out.appendChild(bar);const cpItems=_pickF(evalCPBank,5, rng);const s1=document.createElement('div');s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';cpItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='cp';d.dataset.evalIndex=i;const qHtml=item.q.replace('___',`<input class="eval-cp-input" type="text" data-cp="${i}" autocomplete="off">`);d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbCp${i}" aria-live="polite"></div>`;s1.appendChild(d);});out.appendChild(s1);const tfItems=_pickF(evalTFBank,5, rng);const s2=document.createElement('div');s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';tfItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='tf';d.dataset.evalIndex=i;d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="true"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="false"> Falso</label></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbTf${i}" aria-live="polite"></div>`;s2.appendChild(d);});out.appendChild(s2);const mcItems=_pickF(evalMCBank,5, rng);const s3=document.createElement('div');s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';mcItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='mc';d.dataset.evalIndex=i;const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join('');d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbMc${i}" aria-live="polite"></div>`;s3.appendChild(d);});out.appendChild(s3);const prItems=_pickF(evalPRBank,5, rng);const shuffledDefs=_shuffleF(prItems, rng);const letters=['A','B','C','D','E'];const s4=document.createElement('div');s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';const matchCard=document.createElement('div');matchCard.className='eval-item';let colLeft='<div class="eval-match-col"><h4>📌 Términos</h4>';prItems.forEach((item,i)=>{colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> <select class="eval-match-select" data-pr="${i}" aria-label="Respuesta pareada ${i+16}"><option value="">—</option>${letters.map(l=>`<option value="${l}">${l}</option>`).join('')}</select> ${item.term}</div>`;});colLeft+='</div>';let colRight='<div class="eval-match-col"><h4>🔑 Definiciones</h4>';shuffledDefs.forEach((item,i)=>{colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`;});colRight+='</div>';const ansKey=prItems.map((item,i)=>{const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)];return`${i+16}→${letter}`;}).join(' · ');matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div><div class="eval-item-feedback" id="evalFbPr" aria-live="polite"></div>`;s4.appendChild(matchCard);out.appendChild(s4);window._evalPrintData={tf:tfItems,mc:mcItems,cp:cpItems,pr:{terms:prItems,shuffledDefs,letters}};const autoPanel=document.createElement('div');autoPanel.id='evalAutoResult';autoPanel.className='eval-auto-result';autoPanel.innerHTML='<strong>🧮 Evaluación interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>.';out.appendChild(autoPanel);fin('s-evaluacion');}
function toggleEvalAns(){evalAnsVisible=!evalAnsVisible;document.querySelectorAll('#evalOut .eval-answer').forEach(el=>el.style.display=evalAnsVisible?'block':'none');sfx('click');}
function normalizeEvalAnswer(v){return(v||'').toString().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\s+/g,' ').replace(/[()]/g,'').trim();}
function isCpCorrect(student,expected){const s=normalizeEvalAnswer(student);const e=normalizeEvalAnswer(expected);if(!s)return false;const variants=new Set([e]);if(e.includes(' '))e.split(' ').forEach(x=>x&&variants.add(x));return variants.has(s)||e.replace(/[^a-z0-9]/g,'')===s.replace(/[^a-z0-9]/g,'');}
function setEvalFeedback(id,ok,msg){const el=document.getElementById(id);if(!el)return;el.textContent=msg;el.className='eval-item-feedback '+(ok?'eval-ok':'eval-no');}
function gradeEval(){if(!window._evalPrintData){showToast('⚠️ Genera una evaluación primero');return;}sfx('click');const d=window._evalPrintData;let total=0;const detail={cp:0,tf:0,mc:0,pr:0};d.cp.forEach((it,i)=>{const input=document.querySelector(`[data-cp="${i}"]`);const ok=isCpCorrect(input?input.value:'',it.a);if(input){input.classList.toggle('eval-input-ok',ok);input.classList.toggle('eval-input-no',!ok);}if(ok){detail.cp++;total+=5;}setEvalFeedback('evalFbCp'+i,ok,ok?'Correcto. +5 pts':'Revisar. Respuesta esperada: '+it.a);});d.tf.forEach((it,i)=>{const selected=document.querySelector(`input[name="tf${i}"]:checked`);const ok=!!selected&&(selected.value==='true')===it.a;if(ok){detail.tf++;total+=5;}setEvalFeedback('evalFbTf'+i,ok,ok?'Correcto. +5 pts':'Revisar. Respuesta esperada: '+(it.a?'Verdadero':'Falso'));});d.mc.forEach((it,i)=>{const selected=document.querySelector(`input[name="mc${i}"]:checked`);const ok=!!selected&&Number(selected.value)===it.a;if(ok){detail.mc++;total+=5;}setEvalFeedback('evalFbMc'+i,ok,ok?'Correcto. +5 pts':'Revisar. Respuesta esperada: '+it.o[it.a]);});const expectedLetters=d.pr.terms.map(it=>d.pr.letters[d.pr.shuffledDefs.findIndex(df=>df.def===it.def)]);expectedLetters.forEach((letter,i)=>{const sel=document.querySelector(`[data-pr="${i}"]`);const ok=!!sel&&sel.value===letter;if(sel){sel.classList.toggle('eval-input-ok',ok);sel.classList.toggle('eval-input-no',!ok);}if(ok){detail.pr++;total+=5;}});const prMsg=`Pareados: ${detail.pr}/5 correctos. ${detail.pr===5?'Excelente. +25 pts':'Clave: '+expectedLetters.map((l,i)=>(i+16)+'→'+l).join(' · ')}`;setEvalFeedback('evalFbPr',detail.pr===5,prMsg);const result=document.getElementById('evalAutoResult');if(result){result.className='eval-auto-result '+(total>=70?'eval-auto-pass':'eval-auto-risk');result.innerHTML=`<strong>Resultado automático: ${total}/100 puntos</strong><br><span>Completar: ${detail.cp*5}/25 · V/F: ${detail.tf*5}/25 · Selección: ${detail.mc*5}/25 · Pareados: ${detail.pr*5}/25</span><br><em>Este resultado es solo para la pantalla. El papel sale limpio.</em>`;}if(total>=70){pts(8);showToast('🎯 Evaluación calificada: '+total+'/100');}else showToast('🧮 Evaluación calificada: '+total+'/100. Revisa las respuestas marcadas.');}
function printEval(){if(!window._evalPrintData){showToast('⚠️ Genera una evaluación primero');return;}sfx('click');const forma=window._currentEvalForm||1;const d=window._evalPrintData;let s1=`<div class="sec-title"><span>I. Completar el espacio</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div>`;d.cp.forEach((it,i)=>{const q=it.q.replace('___','<span class="cp-blank"></span>');s1+=`<div class="cp-row"><span class="qn">${i+1}.</span><span class="cp-text">${q}</span></div>`;});let s2=`<div class="sec-title"><span>II. Verdadero o Falso</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div>`;d.tf.forEach((it,i)=>{s2+=`<div class="tf-row"><span class="qn">${i+6}.</span><span class="tf-blank"></span><span class="tf-text">${it.q}</span></div>`;});let s3=`<div class="sec-title"><span>III. Selección Múltiple</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div><div class="mc-grid">`;d.mc.forEach((it,i)=>{const opts=it.o.map((op,oi)=>`<label class="mc-opt"><input type="radio" name="mcp${i}"> ${op}</label>`).join('');s3+=`<div class="mc-item"><div class="mc-q"><span class="qn">${i+11}.</span><span>${it.q}</span></div><div class="mc-opts">${opts}</div></div>`;});s3+=`</div>`;let colL='<div class="pr-col"><div class="pr-head">📌 Términos</div>';d.pr.terms.forEach((it,i)=>{colL+=`<div class="pr-item"><span class="pr-num">${i+16}.</span><span class="pr-line"></span>${it.term}</div>`;});colL+='</div>';let colR='<div class="pr-col"><div class="pr-head">🔑 Definiciones</div>';d.pr.shuffledDefs.forEach((it,i)=>{colR+=`<div class="pr-item"><span class="pr-num">${d.pr.letters[i]}.</span>${it.def}</div>`;});colR+='</div>';let s4=`<div class="pr-section"><div class="sec-title"><span>IV. Términos Pareados</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div><div class="pr-grid">${colL}${colR}</div></div>`;let pR='';pR+=`<div class="p-sec"><div class="p-ttl">I. Completar</div><table class="p-tbl">`;d.cp.forEach((it,i)=>{pR+=`<tr><td class="pn">${i+1}.</td><td class="pa">${it.a}</td></tr>`;});pR+=`</table></div><div class="p-sec"><div class="p-ttl">II. V o F</div><table class="p-tbl">`;d.tf.forEach((it,i)=>{pR+=`<tr><td class="pn">${i+6}.</td><td class="pa">${it.a?'V':'F'}</td></tr>`;});pR+=`</table></div><div class="p-sec"><div class="p-ttl">III. Selección</div><table class="p-tbl">`;d.mc.forEach((it,i)=>{pR+=`<tr><td class="pn">${i+11}.</td><td class="pa">${it.o[it.a]}</td></tr>`;});pR+=`</table></div><div class="p-sec"><div class="p-ttl">IV. Pareados</div><table class="p-tbl">`;d.pr.terms.forEach((it,i)=>{const l=d.pr.letters[d.pr.shuffledDefs.findIndex(df=>df.def===it.def)];pR+=`<tr><td class="pn">${i+16}.</td><td class="pa">${i+16}→${l}</td></tr>`;});pR+=`</table></div>`;
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación Escenarios por venir · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.12rem 0.4rem;margin:0.22rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #86198f;background:#fdf4ff;color:#86198f;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#86198f;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #86198f;height:12px;}.obt-pct{white-space:nowrap;}.qn{font-weight:700;min-width:22px;flex-shrink:0;}.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:40px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.18rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.14rem 0.35rem;margin-bottom:0.1rem;break-inside:avoid;page-break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.3;display:flex;gap:0.28rem;margin-bottom:0.07rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.1rem 0.5rem;}.mc-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:0.04rem 0.15rem;margin-left:0.8rem;}.mc-opt{font-size:9pt;display:flex;align-items:center;gap:0.15rem;}.mc-opt input{width:10px;height:10px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{margin-top:0.1rem;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.08rem 0.4rem;margin-top:0.08rem;}.pr-head{font-size:9pt;font-weight:700;color:#555;margin-bottom:0.1rem;}.pr-item{font-size:10.5pt;padding:0.1rem 0.28rem;background:#fdf4ff;border-radius:3px;margin-bottom:0.07rem;display:flex;align-items:center;gap:0.2rem;line-height:1.2;break-inside:avoid;page-break-inside:avoid;}.pr-num{font-weight:700;color:#86198f;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.22rem;padding:0.15rem 0;page-break-before:avoid;break-before:avoid;color:#86198f;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #86198f;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#555;}.pa{color:#007a00;font-weight:600;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · Escenarios por venir · Educación Básica · III Ciclo · Inteligencia Artificial</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Evaluación Final · Escenarios por venir · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u</div></div><div class="p-grid">${pR}</div>
  ${zgBlock}</div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("evalPage",252,0.55,1.45);fit("pautaPage",252,0.55,1.3);})();<\/script></body></html>`;const win=window.open('','_blank','');if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}win.document.write(doc);win.document.close();setTimeout(()=>win.print(),400);}

// ===================== PRUEBA DE PENSAMIENTO CRÍTICO =====================
function evalSwitchMode(mode){
  sfx('click');
  const cWrap=document.getElementById('evalConceptWrap'),critWrap=document.getElementById('evalCritWrap');
  const cBtn=document.getElementById('evalModeBtnConcept'),critBtn=document.getElementById('evalModeBtnCrit');
  if(mode==='crit'){
    cWrap.style.display='none';critWrap.style.display='block';
    cBtn.classList.remove('active');cBtn.setAttribute('aria-selected','false');
    critBtn.classList.add('active');critBtn.setAttribute('aria-selected','true');
    if(!window._evalCritData)genEvalCrit();
  }else{
    critWrap.style.display='none';cWrap.style.display='block';
    critBtn.classList.remove('active');critBtn.setAttribute('aria-selected','false');
    cBtn.classList.add('active');cBtn.setAttribute('aria-selected','true');
  }
}
const critCaseBank=[
  {txt:'Katy termina noveno. Le dicen que estudie computación y también que no estudie eso. Nadie le contó de qué tareas está hecho ese trabajo.'},
  {txt:'A la señorita Lesly el programa le contesta el correo de siempre. En la dirección dicen que sobra medio puesto. Nadie miró sus otras tareas.'},
  {txt:'A don Beto le compraron un programa que suma las facturas. Ahora quieren que también decida a quién se le fía.'},
  {txt:'Un colegio deja de mandar tareas escritas porque la máquina las hace. No puso otras tareas en su lugar.'},
  {txt:'A la enfermera Sandra le ponen un programa que marca lo raro en las radiografías. Le dicen que ya no hace falta que mire.'},
  {txt:'Don Gerardo oye que los buses se van a manejar solos. Su ruta es de tierra y con lluvia. Nadie midió esa calle.'}
];
const critCaseQuestions=[
  '1. ¿De qué tareas está hecho ese oficio? Escribí tres.',
  '2. ¿De qué tipo es cada una: papel, mirar, manos o gente?',
  '3. ¿Cuáles se lleva la máquina, y con qué capacidad?',
  '4. ¿Qué le queda a la persona, y por qué no se lo pueden quitar?',
  '5. ¿Qué habría que decidir hoy? Escribí la pregunta y contestala.'
];
const critCaseGuides=[
  'Se valora que escriba tareas que se puedan mirar, no el oficio entero.',
  'Se valora que use los cuatro tipos: papel, mirar, manos y estar con alguien.',
  'Se valora que nombre la capacidad: parecido, predecir, texto, voz, refuerzo o la cuenta.',
  'Se valora que lo que queda sea de manos o de estar con alguien, y diga por qué.',
  'Se valora que la pregunta la pueda contestar otra persona. «¿Qué va a pasar?» no vale.'
];
const critErrorBank=[
  {txt:'"La máquina va a acabar con el oficio de maestra."',
   g1:'Se lleva tareas, no oficios. A Delmy le quita planillas y promedios.',
   g2:'No le quita darse cuenta de que un niño no desayunó.'},
  {txt:'"Lo de manos también se lo lleva, es cuestión de tiempo."',
   g1:'De las tareas de manos se lleva muy poca cosa.',
   g2:'Levantar la pared y doblar el hierro se hacen en el terreno.'},
  {txt:'"Ordenar una lista ya es Inteligencia Artificial."',
   g1:'Eso lo hacía una computadora normal desde mucho antes.',
   g2:'Quien lo vende como nuevo te vende humo de hace sesenta años.'},
  {txt:'"Al albañil le queda la mitad del día libre."',
   g1:'Se cuentan tareas, no horas. Perdió dos tareas cortas.',
   g2:'Las que le quedan son las que se llevan el día entero.'},
  {txt:'"Con la máquina ya no hace falta estudiar nada."',
   g1:'Si no sabés nada, no cazás el dato que te inventa.',
   g2:'Lo que hay que saberse es lo que sirve para comprobar.'},
  {txt:'"Cualquier tarea de la escuela la entrega una máquina."',
   g1:'Las que llevan escudo, no. Tu patio no lo puede medir.',
   g2:'A tu vecina tampoco la puede ir a entrevistar.'}
];
const critDecisionBank=[
  'Katy elige carrera el lunes. ¿Mirar cuál suena mejor, o partir el oficio en tareas?',
  'A tu tío le ofrecen un programa para sus cuentas. ¿Firmar, o mirar qué tareas le quita?',
  'El maestro manda un resumen para la casa. ¿Copiarlo, o pedirle una tarea con escudo?',
  'Un vecino dice que su oficio se acaba. ¿Darle la razón, o escribir sus tareas una por una?'
];
const critDecisionGuide='Las cuatro cambian una frase suelta por tareas que se pueden mirar. Un oficio se parte en tareas antes de elegirlo. Un programa se mira por lo que quita. Una tarea con escudo se pide, no se espera.';
const critCompareBank=[
  {a:'Un oficio.',b:'Una tarea.',
   ga:'Es un montón de tareas distintas.',
   gb:'Es una sola cosa que se hace.',
   gr:'La máquina se lleva tareas, nunca el oficio entero.'},
  {a:'Una tarea de papel.',b:'Una tarea de manos.',
   ga:'Escribir, copiar, sumar y ordenar. Casi toda se va.',
   gb:'Se hace con el cuerpo, en un sitio. Casi no se va.',
   gr:'Por eso hay que mirar de qué tareas está hecho el oficio.'},
  {a:'Sumar una lista.',b:'Decidir a quién se le fía.',
   ga:'Es una cuenta de siempre: la máquina no falla.',
   gb:'Hay que conocer a esa persona y responder después.',
   gr:'Una se va; la otra sigue siendo de don Beto.'},
  {a:'Un resumen para la casa.',b:'Medir tu patio.',
   ga:'La máquina lo entrega hecho y bien.',
   gb:'Nadie midió tu patio: los números los ponés vos.',
   gr:'La segunda lleva escudo; la primera, ninguno.'},
  {a:'Mirar una radiografía.',b:'Decirle a una madre que hay que viajar.',
   ga:'Marcar lo raro se lo lleva el parecido.',
   gb:'Hay que decirlo de una forma que ella pueda oír.',
   gr:'A Sandra le quitan una tarea y le queda la otra.'}
];
const critCauseBank=[
  {cause:'Casi todas sus tareas eran de papel.',guide:'Por eso su oficio es de los que más cambian de forma.'},
  {cause:'Nadie midió la lluvia en su ladera.',guide:'Por eso la predicción del valle no le sirve a don Chele.'},
  {cause:'El colegio quitó la tarea escrita y no puso otra.',guide:'Por eso llegaron al examen sin haber escrito un párrafo.'},
  {cause:'La tarea pedía un dato de su propio barrio.',guide:'Por eso la máquina no pudo entregarla hecha.'},
  {cause:'Le contaron las tareas que perdió, no las horas.',guide:'Por eso parecía que le quedaba medio día libre.'},
  {cause:'Le vendieron como nuevo lo que hace una cuenta de siempre.',guide:'Por eso pagó de más por sumar y ordenar una lista.'}
];
const critEffectBank=[
  {effect:'Tres años de estudio en un oficio que nadie miró por dentro.',guide:'Porque eligió por lo que decía el grupo, sin partirlo en tareas.'},
  {effect:'Media milpa perdida y la semilla de la siguiente siembra.',guide:'Porque sembró con una predicción que no medía su ladera.'},
  {effect:'Cuarenta y tres tareas iguales, escritas por la misma máquina.',guide:'Porque la tarea que mandaron no llevaba ningún escudo.'},
  {effect:'Un dato inventado entregado con el nombre del alumno.',guide:'Porque lo que la máquina escribe lo firma quien lo entrega.'},
  {effect:'La señorita Lesly con la mitad del correo hecho a las nueve.',guide:'Porque contestar lo de siempre es una tarea de papel.'},
  {effect:'Un padre enojado atendido por una persona, no por un programa.',guide:'Porque bajarle el enojo a alguien no es una tarea que se delegue.'}
];
function genEvalCrit(){
  sfx('click');
  _injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });
  const _sC = document.getElementById('evalCritFormaSel');
  if (_sC && parseInt(_sC.value, 10)) evalCritFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sC.value, 10)));
  const cf=evalCritFormNum;window._currentEvalCritForm=cf;const rngC = _evalRng(200000 + cf);evalCritFormNum=(evalCritFormNum%EVAL_FORMAS)+1;_injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });saveProgress();
  document.getElementById('evalcrit-screen-title').textContent=`🧠 Pensamiento Crítico · Forma ${cf} · Escenarios por venir`;
  evalCritAnsVisible=false;
  const out=document.getElementById('evalCritOut');out.innerHTML='';
  const kase=_pickF(critCaseBank,1,rngC)[0];
  const s1=document.createElement('div');
  s1.innerHTML=`<div class="eval-section-title">I. Caso de análisis <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${kase.txt}</div>${critCaseQuestions.map((q,i)=>`<div class="crit-q-block"><div class="crit-q-label">${q}</div><textarea class="crit-textarea" rows="2" aria-label="${q}"></textarea><div class="crit-pauta">${critCaseGuides[i]}</div></div>`).join('')}<div class="crit-selfscore"><label for="critScore0">Obtenido:</label><input type="number" id="critScore0" class="crit-score-input" data-score="0" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s1);
  const err=_pickF(critErrorBank,1,rngC)[0];
  const s2=document.createElement('div');
  s2.innerHTML=`<div class="eval-section-title">II. Corrige el error <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${err.txt}</div><p style="font-size:0.85rem;margin-bottom:0.5rem;">Identifica <strong>dos errores</strong> y corrígelos con tus propias palabras:</p><div class="crit-q-block"><div class="crit-q-label">Error 1 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 1 y su corrección"></textarea><div class="crit-pauta">${err.g1}</div></div><div class="crit-q-block"><div class="crit-q-label">Error 2 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 2 y su corrección"></textarea><div class="crit-pauta">${err.g2}</div></div><div class="crit-selfscore"><label for="critScore1">Obtenido:</label><input type="number" id="critScore1" class="crit-score-input" data-score="1" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s2);
  const dec=_pickF(critDecisionBank,1,rngC)[0];
  const s3=document.createElement('div');
  s3.innerHTML=`<div class="eval-section-title">III. Toma de decisiones <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${dec}</div><div class="crit-q-block"><div class="crit-q-label">¿Qué opción recomendarías? Explica por qué.</div><textarea class="crit-textarea" rows="4" aria-label="Recomendaciones y su justificación"></textarea><div class="crit-pauta">${critDecisionGuide}</div></div><div class="crit-selfscore"><label for="critScore2">Obtenido:</label><input type="number" id="critScore2" class="crit-score-input" data-score="2" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s3);
  const cmp=_pickF(critCompareBank,1,rngC)[0];
  const s4=document.createElement('div');
  s4.innerHTML=`<div class="eval-section-title">IV. Comparación razonada <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-compare-grid"><div class="crit-compare-box"><h5>Caso A</h5>${cmp.a}</div><div class="crit-compare-box"><h5>Caso B</h5>${cmp.b}</div></div><div class="crit-q-block"><div class="crit-q-label">1. ¿Qué es cada caso? 2. ¿Qué tiene cada uno? 3. ¿Por qué no son lo mismo?</div><textarea class="crit-textarea" rows="4" aria-label="Comparación razonada de los casos A y B"></textarea><div class="crit-pauta">Caso A: ${cmp.ga} · Caso B: ${cmp.gb} · ${cmp.gr}</div></div><div class="crit-selfscore"><label for="critScore3">Obtenido:</label><input type="number" id="critScore3" class="crit-score-input" data-score="3" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s4);
  const causes=_pickF(critCauseBank,2,rngC),effects=_pickF(critEffectBank,3,rngC);
  let ceRows='';
  causes.forEach((it,i)=>{ceRows+=`<div class="crit-ce-item"><div class="crit-ce-row"><div class="crit-ce-cell crit-ce-given"><span class="crit-ce-tag">Causa</span>${it.cause}</div><div class="crit-ce-cell"><span class="crit-ce-tag">Efecto</span><textarea class="crit-textarea" rows="2" aria-label="Efecto de: ${it.cause}" placeholder="Escribe el efecto..."></textarea></div></div><div class="crit-pauta">${it.guide}</div></div>`;});
  effects.forEach((it,i)=>{ceRows+=`<div class="crit-ce-item"><div class="crit-ce-row"><div class="crit-ce-cell"><span class="crit-ce-tag">Causa</span><textarea class="crit-textarea" rows="2" aria-label="Causa de: ${it.effect}" placeholder="Escribe la causa..."></textarea></div><div class="crit-ce-cell crit-ce-given"><span class="crit-ce-tag">Efecto</span>${it.effect}</div></div><div class="crit-pauta">${it.guide}</div></div>`;});
  const s5=document.createElement('div');
  s5.innerHTML=`<div class="eval-section-title">V. Análisis de causas y efectos <span class="eval-pts">20 pts</span></div><div class="eval-item">${ceRows}<div class="crit-selfscore"><label for="critScore4">Obtenido:</label><input type="number" id="critScore4" class="crit-score-input" data-score="4" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s5);
  window._evalCritData={kase,err,dec,cmp,causes,effects};
  const totalPanel=document.createElement('div');totalPanel.id='evalCritTotalResult';totalPanel.className='crit-total-panel';totalPanel.innerHTML='<strong>🧮 Autoevaluación:</strong> compara con la <em>Pauta</em> y anota tu puntaje (0–20) en cada casilla.';out.appendChild(totalPanel);
  fin('s-evaluacion');
}
function toggleEvalCritAns(){evalCritAnsVisible=!evalCritAnsVisible;document.querySelectorAll('#evalCritOut .crit-pauta').forEach(el=>el.style.display=evalCritAnsVisible?'block':'none');sfx('click');}
function calcCritTotal(){
  if(!window._evalCritData){showToast('⚠️ Genera una prueba primero');return;}
  sfx('click');
  let total=0;
  document.querySelectorAll('#evalCritOut .crit-score-input').forEach(inp=>{let v=parseInt(inp.value)||0;v=Math.max(0,Math.min(20,v));inp.value=v;total+=v;});
  const panel=document.getElementById('evalCritTotalResult');
  if(panel){panel.className='crit-total-panel '+(total>=70?'eval-auto-pass':'eval-auto-risk');panel.innerHTML=`<strong>Puntaje total autoevaluado: ${total}/100</strong><br><em>Compara con la Pauta antes de anotar cada puntaje.</em>`;}
  const formKey='crit_'+(window._currentEvalCritForm||1);
  if(total>=70){if(!xpTracker.wgt.has(formKey)){xpTracker.wgt.add(formKey);pts(8);}showToast('🎯 Pensamiento crítico: '+total+'/100');}
  else showToast('🧮 Puntaje registrado: '+total+'/100. ¡Sigue practicando!');
}
function printEvalCrit(){
  if(!window._evalCritData){showToast('⚠️ Genera una prueba primero');return;}
  sfx('click');
  const forma=window._currentEvalCritForm||1;const d=window._evalCritData;
  const lines=(n)=>Array(n).fill('<div class="ln"></div>').join('');
  let s1=`<div class="sec-title"><span>I. Caso de análisis</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.kase.txt}</p>`;
  critCaseQuestions.forEach(q=>{s1+=`<p class="crit-print-q">${q}</p>${lines(1)}`;});
  let s2=`<div class="sec-title"><span>II. Corrige el error</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.err.txt}</p><p class="crit-print-q">Identifica dos errores y corrígelos con tus propias palabras:</p><p class="crit-print-q"><strong>Error 1:</strong></p>${lines(1)}<p class="crit-print-q"><strong>Error 2:</strong></p>${lines(1)}`;
  let s3=`<div class="sec-title"><span>III. Toma de decisiones</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.dec}</p><p class="crit-print-q">¿Qué opción recomendarías? Explica por qué.</p>${lines(2)}`;
  let s4=`<div class="sec-title"><span>IV. Comparación razonada</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><div class="crit-compare-print-grid"><div class="crit-compare-print-box"><strong>Caso A:</strong> ${d.cmp.a}</div><div class="crit-compare-print-box"><strong>Caso B:</strong> ${d.cmp.b}</div></div><p class="crit-print-q">1. ¿Qué es cada caso? 2. ¿Qué tiene cada uno? 3. ¿Por qué no son lo mismo?</p>${lines(2)}`;
  let ceTbl='<table class="crit-print-tbl"><tr><th>Causa</th><th>Efecto</th></tr>';
  d.causes.forEach(it=>{ceTbl+=`<tr><td>${it.cause}</td><td></td></tr>`;});
  d.effects.forEach(it=>{ceTbl+=`<tr><td></td><td>${it.effect}</td></tr>`;});
  ceTbl+='</table>';
  let s5=`<div class="sec-title"><span>V. Análisis de causas y efectos</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div>${ceTbl}`;
  let pR='';
  pR+=`<div class="p-sec"><div class="p-ttl">I. Caso</div>${critCaseQuestions.map((q,i)=>`<div class="p-crit-line"><strong>${i+1}.</strong> ${critCaseGuides[i]}</div>`).join('')}</div>`;
  pR+=`<div class="p-sec"><div class="p-ttl">II. Corrige el error</div><div class="p-crit-line"><strong>Error 1:</strong> ${d.err.g1}</div><div class="p-crit-line"><strong>Error 2:</strong> ${d.err.g2}</div></div>`;
  pR+=`<div class="p-sec"><div class="p-ttl">III. Toma de decisiones</div><div class="p-crit-line">${critDecisionGuide}</div></div>`;
  pR+=`<div class="p-sec"><div class="p-ttl">IV. Comparación</div><div class="p-crit-line"><strong>Caso A:</strong> ${d.cmp.ga}</div><div class="p-crit-line"><strong>Caso B:</strong> ${d.cmp.gb}</div><div class="p-crit-line">${d.cmp.gr}</div></div>`;
  pR+=`<div class="p-sec" style="grid-column:1/-1;"><div class="p-ttl">V. Causas y efectos</div>${d.causes.map(it=>`<div class="p-crit-line"><strong>Causa:</strong> ${it.cause} → <strong>Efecto:</strong> ${it.guide}</div>`).join('')}${d.effects.map(it=>`<div class="p-crit-line"><strong>Efecto:</strong> ${it.effect} → <strong>Causa:</strong> ${it.guide}</div>`).join('')}</div>`;
  const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Pensamiento Crítico Escenarios por venir · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.1rem 0.4rem;margin:0.2rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #86198f;background:#fdf4ff;color:#86198f;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#86198f;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #86198f;height:12px;}.obt-pct{white-space:nowrap;}.crit-print-scenario{font-size:10.5pt;background:#fdf4ff;border-left:3px solid #86198f;padding:0.2rem 0.5rem;margin:0.1rem 0 0.2rem;line-height:1.3;}.crit-print-q{font-size:10pt;font-weight:600;margin:0.15rem 0 0.08rem;line-height:1.25;}.ln{border-bottom:1px solid #111;min-height:12px;margin-bottom:2px;}.crit-compare-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin:0.15rem 0;}.crit-compare-print-box{font-size:9.5pt;background:#fdf4ff;border-radius:4px;padding:0.25rem 0.4rem;line-height:1.25;}.crit-print-tbl{width:100%;border-collapse:collapse;font-size:9.5pt;margin-top:0.15rem;}.crit-print-tbl th,.crit-print-tbl td{border:1px solid #999;padding:0.3rem 0.45rem;text-align:left;height:30px;vertical-align:middle;}.crit-print-tbl th{background:#fdf4ff;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.08rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.9rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.45rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.1rem;margin-bottom:0.18rem;}.p-crit-line{font-size:11pt;color:#007a00;margin-bottom:0.18rem;line-height:1.35;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.2rem;padding:0.1rem 0;color:#86198f;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #86198f;}.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:12.7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="critEvalPage"><div class="ph"><h2>Evaluación Competencial · Pensamiento Crítico · Escenarios por venir · Educación Básica · III Ciclo · Inteligencia Artificial</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 5 secciones de 20 puntos</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100</span></div></div><div class="pauta-wrap" id="critPautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Pensamiento Crítico · Escenarios por venir · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 5 secciones × 20 pts c/u — respuesta abierta, usar como guía de corrección</div></div><div class="p-grid">${pR}</div></div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("critEvalPage",250,0.55,1.2);fit("critPautaPage",250,0.55,1.2);})();<\/script></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(doc);win.document.close();setTimeout(()=>win.print(),400);
}

// ===================== LABORATORIO DE LOS SÍMBOLOS =====================
const parteData = (function () {
  /* Las seis capacidades que YA existen. Sale de js/data/ia-futuros.js, igual
     que la ficha impresa, así que la pantalla y el papel no se pueden
     separar. */
  const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const out = {};
  IA_CAPACIDADES.forEach(c => {
    out[c.k] = {
      nombre: c.que, icon: c.e,
      estructura: { title: '¿Dónde lo produjiste vos?', info: '<strong>Etapa ' + c.etapa + '.</strong> ' + esc(c.donde) },
      funcion:    { title: '¿Para qué se usa?',         info: 'Se usa ' + esc(c.uso) + '.' },
      ubicacion:  { title: '¿Cómo falla?',              info: '⚠️ Cuando ' + esc(c.falla) + '.' },
      dato:       { title: '¿A quién le cae el error?', info: 'Le cae ' + esc(iaFutAl(c.contra)) + '. Y eso no lo decide la máquina: lo decide con qué ejemplos la entrenaron.' }
    };
  });
  return out;
})();
let labParte='parecido',labAspecto='estructura';
function labShowParte(parteKey){labParte=parteKey;updateLabDisplay();document.querySelectorAll('.lab-cont-btn').forEach(b=>b.classList.remove('active-pri'));const btn=document.querySelector(`[data-parte="${parteKey}"]`);if(btn)btn.classList.add('active-pri');if(typeof sfx==='function')sfx('click');}
function labShowAspecto(aspectoKey){labAspecto=aspectoKey;updateLabDisplay();document.querySelectorAll('.lab-asp-btn').forEach(b=>b.classList.remove('active-sec'));const btn=document.querySelector(`[data-aspecto="${aspectoKey}"]`);if(btn)btn.classList.add('active-sec');if(typeof sfx==='function')sfx('click');}
function updateLabDisplay(){const data=parteData[labParte];const asp=data[labAspecto];document.getElementById('lab-sentence').innerHTML=`🔬 Explorando: <strong>${data.nombre}</strong> → <strong>${asp.title}</strong>`;document.getElementById('lab-display').innerHTML=`<div class="lab-cont-header">${data.icon} ${data.nombre}</div><div class="lab-asp-title">${asp.title}</div><div class="lab-asp-info">${asp.info}</div>`;}

// ===================== DIPLOMA =====================
function _diplPct(){return xp>=MXP?100:Math.round((xp/MXP)*100);}
function openDiploma(){sfx('fan');const pct=_diplPct();document.getElementById('diplPct').textContent=pct+'%';document.getElementById('diplBar').style.width=pct+'%';document.getElementById('diplDate').textContent='Fecha: '+new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});const msgs=['¡Sigue aprendiendo!','¡Muy buen trabajo!','¡Vas muy bien!','¡Conoces a los que hicieron Honduras!','¡Guardián de la Patria!'];document.getElementById('diplMsg').textContent=msgs[Math.min(Math.floor(pct/25),4)];const stars=['⭐','⭐⭐','⭐⭐⭐'];document.getElementById('diplStars').textContent=stars[Math.min(Math.floor(pct/40),2)];const achTxt=unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(' · ');document.getElementById('diplAch').textContent=achTxt||'Sigue completando secciones para desbloquear logros';document.getElementById('diplomaOverlay').classList.add('open');launchConfetti();}
function closeDiploma(){document.getElementById('diplomaOverlay').classList.remove('open');}
function updateDiplomaName(v){document.getElementById('diplName').textContent=v||'Estudiante';}
function shareWA(){const name=document.getElementById('diplName').textContent||'Estudiante';const pct=_diplPct();const msg=`🔮 ¡${name} completó la Misión "Escenarios por venir"! 🏅 Progreso: ${pct}% · 🌱 policastsapien.com`;_waShare(msg);}
async function captureDiploma(){if(typeof html2canvas==='undefined'){showToast('⚠️ Cargando... intenta de nuevo');return;}sfx('click');const card=document.querySelector('.diploma-card');const btn=document.querySelector('.diploma-actions .btn-pri');const toHide=[card.querySelector('.diploma-input'),card.querySelector('.diploma-actions'),card.querySelector('hr')];if(btn){btn.disabled=true;btn.textContent='⏳ Capturando...';}toHide.forEach(el=>{if(el)el.style.display='none';});let dataUrl='';try{const canvas=await html2canvas(card,{scale:2,useCORS:true,backgroundColor:'#ffffff'});toHide.forEach(el=>{if(el)el.style.display='';});dataUrl=canvas.toDataURL('image/png');const name=(document.getElementById('diplName').textContent||'Estudiante').replace(/\s+/g,'-');const fileName='constancia-'+name+'.png';const cap=window.Capacitor;if(cap&&cap.isNativePlatform&&cap.isNativePlatform()&&cap.Plugins?.Filesystem&&cap.Plugins?.Share){const base64Data=dataUrl.split(',')[1];const result=await cap.Plugins.Filesystem.writeFile({path:fileName,data:base64Data,directory:'CACHE'});await cap.Plugins.Share.share({url:result.uri,dialogTitle:'Guardar / Compartir Constancia'});}else{const a=document.createElement('a');a.href=dataUrl;a.download=fileName;a.click();}}catch(e){toHide.forEach(el=>{if(el)el.style.display='';});if(e.name!=='AbortError')showToast('⚠️ No se pudo guardar la constancia');}finally{if(btn){btn.disabled=false;btn.textContent='📷 Guardar foto';}}}

// ===================== INIT =====================

// ===================== LOS ESCENARIOS, EN LA PANTALLA =====================
/* Todo sale de js/data/ia-futuros.js. En este archivo no hay un solo
   escenario escrito a mano, que es la regla de esta ruta desde el Himno: si
   la pantalla y el papel tuvieran cada uno su copia, se separarían el día que
   alguien corrija una coma en uno de los dos. */
const _fEsc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function pintarFutFecha() {
  document.querySelectorAll('.fut-fecha').forEach(e => { e.textContent = IA_FUT_FECHA; });
}

function pintarFutPiezas() {
  const c = document.getElementById('fut-piezas'); if (!c) return;
  c.innerHTML = IA_FUT_PIEZAS.map((p, i) => '<div class="fut-pieza">' +
    '<div class="fut-pieza-t"><span class="fut-pieza-n">' + (i + 1) + '</span>' + p.e + ' ' + _fEsc(p.nombre) + '</div>' +
    '<div class="fut-si">✅ ' + _fEsc(p.si) + '</div>' +
    '<div class="fut-no">🚫 ' + _fEsc(p.no) + '</div>' +
    '<div class="fut-porque">' + _fEsc(p.porque) + '</div></div>').join('');
}

function pintarFutCapacidades() {
  const c = document.getElementById('fut-capacidades'); if (!c) return;
  c.innerHTML = IA_CAPACIDADES.map(x => '<div class="fut-cap">' +
    '<div class="fut-cap-t">' + x.e + ' ' + _fEsc(x.que) + '</div>' +
    '<div class="fut-cap-donde"><strong>Etapa ' + x.etapa + ':</strong> ' + _fEsc(x.donde) + '</div>' +
    '<div class="fut-cap-falla">⚠️ Falla así: ' + _fEsc(x.falla) + '</div></div>').join('');
}

/* ── Los cuatro tipos de tarea ───────────────────────────────────────────── */
function pintarTipos() {
  const c = document.getElementById('tt-lista'); if (!c) return;
  c.innerHTML = IA_OFI_TIPOS.map(t => '<div class="tt-fila">' +
    '<span class="tt-e">' + t.e + '</span>' +
    '<div><div class="tt-n">' + _fEsc(t.nombre) + '</div>' +
    '<div class="tt-q">' + _fEsc(t.que) + '</div></div></div>').join('');
}

/* ── Los ocho oficios, tarea por tarea ───────────────────────────────────── */
const _ETIQ = { si: '🤖 Se la lleva', medias: '🤝 A medias', no: '🧑 No puede' };
/* ⚠️ Toda tarea que la máquina se lleva dice CON QUÉ, y solo hay dos
   respuestas honestas: una capacidad que el alumno produjo, o «esto ya lo
   hacía una computadora normal». Sin esa chapa, la misión sería publicidad. */
function _comoChip(t) {
  if (t.maquina === 'no') return '';
  if (t.como === 'cuenta') return '<span class="ofi-como cuenta">' + IA_CUENTA.e + ' ' + _fEsc(IA_CUENTA.corto) + '</span>';
  const x = IA_CAPACIDADES.find(y => y.k === t.como);
  return x ? '<span class="ofi-como">' + x.e + ' ' + _fEsc(x.corto) + ' · etapa ' + x.etapa + '</span>' : '';
}
let ofiSel = IA_OFICIOS[0].k;
const ofiVistos = new Set([ofiSel]);
function pintarOfiChips() {
  const c = document.getElementById('ofi-chips'); if (!c) return;
  c.innerHTML = IA_OFICIOS.map(o => '<button class="ofi-chip' + (ofiSel === o.k ? ' sel' : '') +
    '" onclick="ofiElegir(\'' + o.k + '\')">' + o.e + ' ' + _fEsc(o.nombre) + '</button>').join('');
}
function ofiElegir(k) {
  ofiSel = k; ofiVistos.add(k); pintarOfiChips(); pintarOfiDetalle(); sfx('click');
  if (ofiVistos.size === IA_OFICIOS.length) unlockAchievement('explorador');
}
function pintarOfiDetalle() {
  const c = document.getElementById('ofi-detalle'); if (!c) return;
  const o = IA_OFICIOS.find(x => x.k === ofiSel), n = iaOfiCuenta(ofiSel);
  c.innerHTML = '<p class="ofi-quien">' + o.e + ' <strong>' + _fEsc(o.nombre) + '</strong> · ' + _fEsc(o.quien) + '</p>' +
    o.tareas.map(t => {
      const ti = IA_OFI_TIPOS.find(x => x.k === t.tipo);
      return '<div class="ofi-tarea ' + t.maquina + '">' +
        '<div class="ofi-tarea-t"><span class="ofi-tipo">' + ti.e + '</span>' + _fEsc(t.t) + '</div>' +
        '<div class="ofi-veredicto">' + _ETIQ[t.maquina] + '</div>' +
        _comoChip(t) +
        '<div class="ofi-porque">' + _fEsc(t.porque) + '</div></div>';
    }).join('') +
    '<p class="ofi-cuenta">De sus <strong>' + n.total + '</strong> tareas, la máquina se lleva <strong>' + n.si +
    '</strong> enteras y <strong>' + n.medias + '</strong> a medias. Le quedan <strong>' + n.no + '</strong>.</p>';
}

/* ⚠️ La cuenta que sostiene la misión entera. Los porcentajes NO se escriben
   a mano en ninguna parte: salen de iaOfiPorTipo(), que es la misma función
   que la sonda vuelve a correr para comprobar que la pantalla dice verdad. */
function pintarTtBarras() {
  const c = document.getElementById('tt-barras'); if (!c) return;
  c.innerHTML = iaOfiPorTipo().map(t => '<div class="tt-barra">' +
    '<div class="tt-barra-r">' + t.e + ' ' + _fEsc(t.nombre) + ' <small>(' + t.total + ' tareas)</small></div>' +
    '<div class="tt-barra-f"><div class="tt-barra-v' + (t.pct >= 50 ? ' alta' : '') + '" style="width:' + t.pct + '%"></div></div>' +
    '<div class="tt-barra-p">' + t.pct + ' %</div></div>').join('');
}
function pintarOfiTabla() {
  const c = document.getElementById('ofi-tabla'); if (!c) return;
  c.innerHTML = IA_OFICIOS.map(o => { const n = iaOfiCuenta(o.k);
    return '<div class="ofi-fila"><span class="ofi-fila-n">' + o.e + ' ' + _fEsc(o.nombre) + '</span>' +
      '<span class="ofi-fila-b"><span style="width:' + n.pct + '%"></span></span>' +
      '<span class="ofi-fila-p">' + n.pct + ' %</span></div>'; }).join('');
}

/* ── La escuela ──────────────────────────────────────────────────────────── */
function pintarEstudio() {
  const c = document.getElementById('esu-estudio'); if (!c) return;
  c.innerHTML = IA_ESTUDIO.map(x => '<div class="esu-item">' +
    '<div class="esu-t">' + x.e + ' ' + _fEsc(x.titulo) + '</div>' +
    '<div class="esu-q">' + _fEsc(x.que) + '</div>' +
    '<div class="esu-h">→ ' + _fEsc(x.hoy) + '</div></div>').join('');
}
function pintarEscudos() {
  const c = document.getElementById('esu-escudos'); if (!c) return;
  c.innerHTML = IA_ESCUDOS.map(e => '<div class="esu-escudo">' +
    '<div class="esu-t">' + e.e + ' ' + _fEsc(e.nombre) + '</div>' +
    '<div class="esu-q">' + _fEsc(e.que) + '</div>' +
    '<div class="esu-h">' + _fEsc(e.porque) + '</div></div>').join('');
}

window.addEventListener('DOMContentLoaded',()=>{
  initTheme();
  loadProgress();
  pintarFutFecha();
  pintarFutPiezas();
  pintarFutCapacidades();
  pintarTipos();
  pintarOfiChips();
  pintarOfiDetalle();
  pintarTtBarras();
  pintarOfiTabla();
  pintarEstudio();
  pintarEscudos();
  upFC();
  buildQz();
  showQz();
  buildClass();
  showId();
  showCmp();
  updateRetoButtons();
  buildRoute();
  showNeuron();
  showNeuro();
  showEnfer();
  updateLabDisplay();
  document.querySelector('[data-parte="parecido"]')?.classList.add('active-pri');
  document.querySelector('[data-aspecto="estructura"]')?.classList.add('active-sec');
  try{iaDescInit();}catch(e){} // 🔮 Descubre: pinta las dos actividades; no marca ninguna sección. Si el archivo de datos no llegó, la misión sigue.
  renderAchPanel();
});

(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalCrit==='function') _injectFormaSel('genEvalCrit','evalCritFormaSel',evalCritFormNum,function(v){evalCritFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();

// ===================== 🔭 DESCUBRE · EL OFICIO Y LA TAREA =====================
/* Dos actividades. Las CUENTAS viven en js/data/ia-futuros.js —iaOfiCuenta,
   iaOfiPorTipo, iaClaseCuenta, iaFutJuzga—: es lo que la sonda
   `verifica-descubre-ia` recalcula, y por eso aquí solo se pinta, se lleva el
   XP y se guarda lo que el alumno decide. */
const DESC_KEY = SAVE_KEY + '_descubre';
function iaDescGuardar(k, v) { try { const s = JSON.parse(localStorage.getItem(DESC_KEY) || '{}'); s[k] = v; localStorage.setItem(DESC_KEY, JSON.stringify(s)); } catch (e) {} }
function iaDescLeer(k) { try { return (JSON.parse(localStorage.getItem(DESC_KEY) || '{}'))[k]; } catch (e) { return undefined; } }

/* ⚠️ La sección se gana HACIENDO las dos: un oficio entero contestado y las
   doce tareas de clase con la tarea propia escrita. Nunca se marca al abrir:
   esa es la normativa de la estrella. Y se llama desde UN solo sitio. */
function iaDescubreListo() {
  if (iaDescLeer('oficio') && iaDescLeer('tarea')) { fin('s-descubre'); unlockAchievement('cronometro'); }
}

/* ── 🧰 El oficio que te gusta ───────────────────────────────────────────── */
let jueSel = '', jueResp = {};
function juePintarChips() {
  const c = document.getElementById('jue-chips'); if (!c) return;
  c.innerHTML = IA_OFICIOS.map(o => '<button class="ofi-chip' + (jueSel === o.k ? ' sel' : '') +
    '" onclick="jueElegir(\'' + o.k + '\')">' + o.e + ' ' + _fEsc(o.nombre) + '</button>').join('');
}
function jueElegir(k) { jueSel = (jueSel === k ? '' : k); juePintarChips(); juePintarTareas(); juePintarCuenta(); sfx('click'); }
function juePintarTareas() {
  const c = document.getElementById('jue-tareas'); if (!c) return;
  if (!jueSel) { c.innerHTML = '<p class="esu-vacio">Tocá un oficio para empezar.</p>'; return; }
  const o = IA_OFICIOS.find(x => x.k === jueSel);
  c.innerHTML = o.tareas.map((t, i) => {
    const dada = jueResp[jueSel + '|' + i];
    const ti = IA_OFI_TIPOS.find(x => x.k === t.tipo);
    const bts = ['si', 'medias', 'no'].map(v => '<button class="jue-b' +
      (dada ? (v === t.maquina ? ' buena' : (v === dada ? ' mala' : '')) : '') + '"' +
      (dada ? ' disabled' : '') + ' onclick="jueResponder(' + i + ',\'' + v + '\')">' + _ETIQ[v] + '</button>').join('');
    return '<div class="jue-tarea">' +
      '<div class="ofi-tarea-t"><span class="ofi-tipo">' + ti.e + '</span>' + _fEsc(t.t) + '</div>' +
      '<div class="jue-bts">' + bts + '</div>' +
      (dada ? '<div class="jue-resp ' + (dada === t.maquina ? 'ok' : 'no') + '">' +
        (dada === t.maquina ? '✓ Sí' : '✗ No') + ': ' + _ETIQ[t.maquina] + '. ' + _fEsc(t.porque) + '</div>' +
        _comoChip(t) : '') + '</div>';
  }).join('');
}
function jueResponder(i, v) {
  const clave = jueSel + '|' + i; if (jueResp[clave]) return;
  const t = IA_OFICIOS.find(x => x.k === jueSel).tareas[i];
  jueResp[clave] = v;
  if (!xpTracker.wgt.has('jue_' + clave)) { xpTracker.wgt.add('jue_' + clave); pts(1); }
  sfx(v === t.maquina ? 'ok' : 'no');
  juePintarTareas(); juePintarCuenta();
}
function juePintarCuenta() {
  const c = document.getElementById('jue-cuenta'); if (!c) return;
  if (!jueSel) { c.innerHTML = ''; return; }
  const o = IA_OFICIOS.find(x => x.k === jueSel);
  const dadas = o.tareas.filter((t, i) => jueResp[jueSel + '|' + i]).length;
  if (dadas < o.tareas.length) { c.innerHTML = '<p class="esu-vacio">Llevás ' + dadas + ' de ' + o.tareas.length + '.</p>'; return; }
  const n = iaOfiCuenta(jueSel);
  const bien = o.tareas.filter((t, i) => jueResp[jueSel + '|' + i] === t.maquina).length;
  c.innerHTML = '<p class="esu-fin"><strong>' + o.e + ' ' + _fEsc(o.nombre) + ':</strong> acertaste ' + bien + ' de ' + o.tareas.length + '.</p>' +
    '<p class="esu-fin">La máquina se lleva <strong>' + n.si + '</strong> tareas enteras y <strong>' + n.medias +
    '</strong> a medias. Le quedan <strong>' + n.no + '</strong>. Es el <strong>' + n.pct + ' %</strong> del oficio.</p>' +
    '<p class="esu-fin">Y lo que le queda no es lo que sobra: es lo que nadie más puede hacer.</p>';
  if (!iaDescLeer('oficio')) {
    iaDescGuardar('oficio', { k: jueSel, bien: bien, de: o.tareas.length, pct: n.pct });
    pts(3); sfx('up'); iaDescubreListo();
  }
}

/* ── 📚 ¿Se puede copiar esta tarea? ─────────────────────────────────────── */
let tarResp = {}, tarEscudo = '';
function tarPintar() {
  const c = document.getElementById('tar-lista'); if (!c) return;
  c.innerHTML = IA_TAREAS_CLASE.map((t, i) => {
    const dada = tarResp[i], buena = t.copia ? 'si' : 'no';
    const bts = [['si', '🤖 La copia'], ['no', '🧑 No puede']].map(function (par) {
      const v = par[0];
      return '<button class="jue-b' + (dada ? (v === buena ? ' buena' : (v === dada ? ' mala' : '')) : '') + '"' +
        (dada ? ' disabled' : '') + ' onclick="tarResponder(' + i + ',\'' + v + '\')">' + par[1] + '</button>';
    }).join('');
    const esc = t.escudos.map(k => { const e = IA_ESCUDOS.find(x => x.k === k); return '<span class="esu-chip">' + e.e + ' ' + _fEsc(e.nombre) + '</span>'; }).join('');
    return '<div class="jue-tarea">' +
      '<div class="ofi-tarea-t">' + _fEsc(t.t) + '</div>' +
      '<div class="jue-bts">' + bts + '</div>' +
      (dada ? '<div class="jue-resp ' + (dada === buena ? 'ok' : 'no') + '">' +
        (dada === buena ? '✓ Sí' : '✗ No') + ': ' + _fEsc(t.porque) + '</div>' + esc : '') + '</div>';
  }).join('');
}
function tarResponder(i, v) {
  if (tarResp[i]) return;
  const t = IA_TAREAS_CLASE[i], buena = t.copia ? 'si' : 'no';
  tarResp[i] = v;
  if (!xpTracker.wgt.has('tar_' + i)) { xpTracker.wgt.add('tar_' + i); pts(1); }
  sfx(v === buena ? 'ok' : 'no');
  tarPintar(); tarPintarCuenta();
}
function tarPintarCuenta() {
  const c = document.getElementById('tar-cuenta'); if (!c) return;
  const dadas = Object.keys(tarResp).length;
  if (dadas < IA_TAREAS_CLASE.length) { c.innerHTML = dadas ? '<p class="esu-vacio">Llevás ' + dadas + ' de ' + IA_TAREAS_CLASE.length + '.</p>' : ''; return; }
  const n = iaClaseCuenta();
  const bien = IA_TAREAS_CLASE.filter((t, i) => tarResp[i] === (t.copia ? 'si' : 'no')).length;
  c.innerHTML = '<p class="esu-fin">Acertaste <strong>' + bien + '</strong> de ' + n.total + '.</p>' +
    '<p class="esu-fin">La máquina entrega <strong>' + n.copiables + '</strong> hechas. Las otras <strong>' +
    n.protegidas + '</strong> no puede.</p>' +
    '<p class="esu-fin"><strong>Y esas ' + n.protegidas + ' tienen algo en común:</strong> todas llevan por lo menos un escudo. Ninguna de las que copia lleva ninguno.</p>';
  unlockAchievement('sistema_master');
  tarPintarProduce();
}
function tarPintarProduce() {
  const c = document.getElementById('tar-produce'); if (!c || c.dataset.puesto) return;
  c.dataset.puesto = '1';
  c.innerHTML = '<label for="tar-mia">✍️ <strong>Escribí una tarea que la máquina NO te pueda hacer.</strong> Tiene que llevar un escudo.</label>' +
    '<input id="tar-mia" class="desc-input" type="text" maxlength="140" placeholder="Medí el aula y sacá cuántas baldosas caben">' +
    '<div class="esu-chips" id="tar-escudos"></div>' +
    '<button class="btn btn-pri" onclick="tarGuardar()">💾 Guardarla</button>';
  tarPintarEscudos();
}
function tarPintarEscudos() {
  const c = document.getElementById('tar-escudos'); if (!c) return;
  c.innerHTML = IA_ESCUDOS.map(e => '<button class="esu-chip-b' + (tarEscudo === e.k ? ' sel' : '') +
    '" onclick="tarElegirEscudo(\'' + e.k + '\')">' + e.e + ' ' + _fEsc(e.nombre) + '</button>').join('');
}
function tarElegirEscudo(k) { tarEscudo = (tarEscudo === k ? '' : k); tarPintarEscudos(); sfx('click'); }
function tarGuardar() {
  const e = document.getElementById('tar-mia'), txt = e ? e.value.trim() : '';
  if (txt.length < 10) { showToast('⚠️ Escribí la tarea primero'); return; }
  if (!tarEscudo) { showToast('⚠️ Elegí con qué escudo la protegés'); return; }
  iaDescGuardar('tarea', { txt: txt, escudo: tarEscudo });
  tarPintarGuardado({ txt: txt, escudo: tarEscudo });
  if (!xpTracker.wgt.has('tar_guardar')) { xpTracker.wgt.add('tar_guardar'); pts(6); }
  sfx('up'); iaDescubreListo();
}
function tarPintarGuardado(g) {
  const c = document.getElementById('tar-guardado'); if (!c || !g) return;
  const esc = IA_ESCUDOS.find(x => x.k === g.escudo); if (!esc) return;
  c.innerHTML = '💾 <strong>Guardada:</strong> «' + _fEsc(g.txt) + '» — ' + esc.e + ' ' + _fEsc(esc.nombre) + '.';
}

/* ── 🔮 Las cuatro piezas: la herramienta corta del final ────────────────── */
let talCap = '';
function talPintarCaps() {
  const c = document.getElementById('tal-caps'); if (!c) return;
  c.innerHTML = IA_CAPACIDADES.map(x => '<button class="tal-cap' + (talCap === x.k ? ' sel' : '') + '" onclick="talElegir(\'' + x.k + '\')">' + x.e + ' ' + _fEsc(x.que) + '</button>').join('');
}
function talElegir(k) { talCap = (talCap === k ? '' : k); talPintarCaps(); sfx('click'); }
function talLeer() {
  const v = id => { const e = document.getElementById(id); return e ? e.value : ''; };
  return { cap: talCap, quien: v('tal-quien'), precio: v('tal-precio'), decide: v('tal-decide') };
}
function talProbar() {
  const esc = talLeer(), j = iaFutJuzga(esc);
  const salida = document.getElementById('tal-veredicto'); if (!salida) return;
  const filas = IA_FUT_PIEZAS.map(p => '<div class="tal-fila ' + (j[p.k] ? 'ok' : 'no') + '">' +
    '<span class="tal-marca">' + (j[p.k] ? '✓' : '✗') + '</span>' +
    '<span class="tal-p">' + p.e + ' ' + _fEsc(p.nombre) + '</span>' +
    '<span class="tal-d">' + _fEsc(j[p.k] ? p.si : p.no) + '</span></div>').join('');
  let cabeza;
  if (iaFutEsEscenario(j)) {
    cabeza = '<div class="tal-si">🔮 <strong>Esto es un escenario.</strong> Está hecho con algo de hoy, le pasa a alguien, cuesta algo que se cuenta y termina en una decisión.</div>';
  } else {
    const falta = iaFutLeFalta(j);
    cabeza = '<div class="tal-no">📣 <strong>Todavía no: le falta ' + (falta.length === 1 ? 'una pieza' : falta.length + ' piezas') + '.</strong> ' +
      _fEsc(falta.map(p => p.nombre.toLowerCase()).join('; ')) + '. Sin eso no se decide nada. Se parece a una profecía.</div>';
  }
  salida.innerHTML = cabeza + '<div class="tal-piezas">' + filas + '</div>' +
    '<p class="tal-nota">Lo que la pantalla NO juzga es si vale la pena. Eso lo decidís vos.</p>';
  sfx(iaFutEsEscenario(j) ? 'ok' : 'no');
  if (!xpTracker.wgt.has('tal_probar')) { xpTracker.wgt.add('tal_probar'); pts(3); }
}

function iaDescInit() {
  talPintarCaps();
  juePintarChips(); juePintarTareas(); juePintarCuenta();
  tarPintar(); tarPintarCuenta();
  const g = iaDescLeer('tarea');
  if (g) { tarPintarProduce(); tarPintarGuardado(g); }
}
