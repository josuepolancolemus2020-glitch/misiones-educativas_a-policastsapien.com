// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
function compartirMision(){const url=window.location.href;const texto=`🚀 *Misión Asignada* 🚀\n\nPractica sobre este tema y sobresale en ser de los mejores alumnos. 🏆\n\nDesbloquea *todos los logros* y puedes poner *tus datos* para que tu maestro observe todos tus logros. 📋\n\n_Se te hará prueba escrita y serás excelente estudiante en Educación Cívica._ ✍️\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;_waShare(texto);}
function toggleLetra(){document.body.classList.toggle('letra-grande');if(typeof sfx==='function')sfx('click');localStorage.setItem('preferenciaLetra',document.body.classList.contains('letra-grande'));}
window.addEventListener('DOMContentLoaded',()=>{if(localStorage.getItem('preferenciaLetra')==='true')document.body.classList.add('letra-grande');});

// ===================== UTILIDADES =====================
const _pick=(arr,n)=>[...arr].sort(()=>Math.random()-0.5).slice(0,n);
const _shuffle=(arr)=>[...arr].sort(()=>Math.random()-0.5);
function fb(id,msg,isOk){const el=document.getElementById(id);if(el){el.textContent=msg;el.className='fb show '+(isOk?'ok':'err');}}

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY='constitucion_v1';
let xp=0,MXP=200,done=new Set(),evalAnsVisible=false;
let evalFormNum=1,unlockedAch=[],darkMode=false,prevLevel=0;
let evalCritFormNum=1,evalCritAnsVisible=false;
const TOTAL_SECTIONS=13;
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
  primer_quiz:{icon:'🏅',label:'Primera prueba de la Constitución superada'},
  flash_master:{icon:'🃏',label:'Conoció a los ocho, uno por uno'},
  clasif_pro:{icon:'🗂️',label:'Lee una cita de la Constitución'},
  id_master:{icon:'🔍',label:'Reconoce a cada uno por lo que hizo'},
  reto_hero:{icon:'🏆',label:'Campeón del reto de la Constitución'},
  nivel3:{icon:'🎖️',label:'¡Buena memoria! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡Sabe su historia! Nivel 6'},
  widgets_master:{icon:'🧩',label:'Widgets de la Constitución dominados'}
};
function unlockAchievement(id){if(unlockedAch.includes(id))return;unlockedAch.push(id);sfx('ach');showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label);launchConfetti();renderAchPanel();saveProgress();}
function renderAchPanel(){const list=document.getElementById('achList');list.innerHTML='';Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{const div=document.createElement('div');div.className='ach-item'+(unlockedAch.includes(id)?'':' locked');div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`;list.appendChild(div);});}
function toggleAchPanel(){sfx('click');document.getElementById('achPanel').classList.toggle('open');}
function showToast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}t.textContent=msg;t.style.display='block';clearTimeout(t._tid);t._tid=setTimeout(()=>t.style.display='none',3200);}
function launchConfetti(){const colors=['#3f6212','#2dd4bf','#b45309','#f59e0b','#14b8a6'];for(let i=0;i<60;i++){const c=document.createElement('div');c.className='confetti-piece';c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`;document.body.appendChild(c);c.addEventListener('animationend',()=>c.remove());}}

// ===================== XP =====================
const lvls=[{t:0,n:'Aprendiz 🌱'},{t:25,n:'Curioso 🔎'},{t:55,n:'Lector de historia 📖'},{t:90,n:'Conoce a los ocho 🎖️'},{t:130,n:'Sabe qué hizo cada uno 🏛️'},{t:165,n:'Guardián de la memoria 🏅'},{t:190,n:'Historiador de Honduras 🏆'}];
function pts(n){xp=Math.max(0,Math.min(MXP,xp+n));updateXPBar();saveProgress();}
function updateXPBar(){const pct=Math.round((xp/MXP)*100);document.getElementById('xpFill').style.width=pct+'%';const el=document.getElementById('xpPts');el.textContent='⭐ '+xp;el.style.transform='scale(1.3)';setTimeout(()=>el.style.transform='',300);let lv=0;for(let i=0;i<lvls.length;i++)if(xp>=lvls[i].t)lv=i;document.getElementById('xpLvl').textContent=lvls[lv].n;if(lv!==prevLevel){if(lv>=2)unlockAchievement('nivel3');if(lv>=5)unlockAchievement('nivel5');prevLevel=lv;}}
function resetXP(){sfx('click');xp=0;updateXPBar();showToast('🔄 XP reiniciado a 0');}
function fin(id,showFX=true){if(!done.has(id)){done.add(id);const b=document.querySelector(`[data-s="${id}"]`);if(b)b.classList.add('done');if(showFX){sfx('up');launchConfetti();}saveProgress();}}
function getProgress(){return Math.round((done.size/TOTAL_SECTIONS)*100);}

// ===================== NAV =====================
function go(id){sfx('click');document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});document.getElementById(id).classList.add('active');const btn=document.querySelector(`[data-s="${id}"]`);if(btn){btn.classList.add('active');btn.setAttribute('aria-selected','true');}window.scrollTo({top:0,behavior:'smooth'});if(id==='s-sopa'){setTimeout(buildSopa,50);}if(id==='s-widgets'){setTimeout(buildRoute,50);}}

// ===================== FLASHCARD DATA =====================
const fcData = (function () {
  const f = [];
  CONST_ARTICULOS.forEach(a => {
    f.push({ w: a.emoji + ' ' + a.art, a: '<strong>' + a.tema + '</strong><br>' + a.paraQue });
    f.push({ w: '¿Por qué importa ' + a.art + '?', a: a.porQueImporta });
  });
  CONST_COMO_SE_LEE.piezas.forEach(z => {
    f.push({ w: '📑 «' + z.parte + '»', a: z.que });
  });
  return f;
})();
let fcIdx=0;
function upFC(){document.getElementById('fcInner').classList.remove('flipped');document.getElementById('fcW').textContent=fcData[fcIdx].w;document.getElementById('fcA').innerHTML=fcData[fcIdx].a;document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length;}
function flipCard(){sfx('flip');document.getElementById('fcInner').classList.toggle('flipped');if(!xpTracker.fc.has(fcIdx)){xpTracker.fc.add(fcIdx);pts(1);}if(xpTracker.fc.size===fcData.length){fin('s-flash');unlockAchievement('flash_master');}}
function nextFC(){sfx('click');fcIdx=(fcIdx+1)%fcData.length;upFC();}
function prevFC(){sfx('click');fcIdx=(fcIdx-1+fcData.length)%fcData.length;upFC();}

// ===================== QUIZ DATA =====================
const qzData=[
  {q:'En «artículo 128 numeral 7 de la Constitución», ¿qué es el numeral 7?',o:['El año en que se escribió','La página donde está','El número de veces que se ha reformado','Uno de los puntos numerados DENTRO del artículo 128'],c:3,
   e:'Un artículo largo se divide en numerales. El 7 es uno de los puntos del artículo 128.'},
  {q:'¿Por qué no basta con citar «el artículo 128» a secas?',o:['Porque hay un artículo 128 en casi todas las leyes del país','Porque suena incompleto','Porque los artículos no llevan número','Porque hay que citar el año también'],c:0,
   e:'El número solo no basta nunca: hay que decir de qué norma es.'},
  {q:'El Estatuto del Docente dice que existe por «un mandato impostergable» de la Constitución. ¿Qué significa eso?',o:['Que la Constitución la prohíbe','Que la Constitución ORDENÓ que esa ley se escribiera','Que se puede cambiar cuando se quiera','Que la escribió un juez'],c:1,
   e:'Artículo 165. Una Constitución no solo prohíbe: también encarga leyes.'},
  {q:'Según el artículo 162, que el Estatuto cita palabra por palabra, ¿ante quién tiene responsabilidades el educador PRIMERO?',o:['Ante sus discípulos','Ante la Secretaría de Educación','Ante el director del centro','Ante el Congreso Nacional'],c:0,
   e:'«Frente a sus discípulos, frente a la institución en que labora y ante la sociedad»: el alumno va nombrado primero.'},
  {q:'El Código de la Niñez dice que los niños «gozan de las libertades consignadas en la Constitución». ¿Qué quiere decir?',o:['Que las tienen por la Constitución y el Código se suma','Que el Código les da esas libertades','Que solo valen hasta los 18 años','Que hay que pedirlas por escrito'],c:0,
   e:'Un derecho que viene de la Constitución no se lo puede quitar una ley menor.'},
  {q:'Antes de firmar un reglamento, ¿qué tiene que decir una Secretaría de Estado?',o:['Cuánto cuesta','Quién lo pidió','De qué artículos saca el permiso para dictarlo','Cuándo se vence'],c:2,
   e:'El Reglamento del Estatuto empieza «en uso de las facultades establecidas en los artículos 245 numeral 11, 157 y 163 de la Constitución».'},
  {q:'¿Qué hace falta, según el Código de la Niñez, para que un niño trabaje en una actividad retribuida?',o:['Solo que él quiera','Nada, si es en su casa','El permiso previo de la Secretaría de Trabajo, pedido por sus padres o representante','Un papel firmado por el patrono'],c:2,
   e:'Y además queda sujeto al artículo 128 numeral 7 de la Constitución.'},
  {q:'¿Qué significa que la Constitución, una ley y un convenio internacional digan lo mismo?',o:['Que sobra uno de los tres','Que ese derecho está sostenido por tres textos y es más difícil saltárselo','Que se contradicen','Que manda el más nuevo'],c:1,
   e:'El currículo lo dice así: «la presencia de uno fortalece al otro».'},
  {q:'¿Qué es la democracia PARTICIPATIVA?',o:['Votar cada cuatro años y esperar','Que la gente también decide, pregunta y reclama entre elección y elección','Que vota solo quien paga impuestos','Que deciden los tres poderes juntos'],c:1,
   e:'Y para reclamar hay que saber qué dice la norma: quien no sabe qué le toca, no puede pedirlo.'},
  {q:'Que un artículo esté escrito en la Constitución, ¿garantiza que se cumpla?',o:['Sí, siempre','Solo en las ciudades','Solo si lo repite otra ley','No: por eso el currículo pide analizar casos en que no se cumple'],c:3,
   e:'A la distancia entre lo escrito y lo que pasa el currículo la llama «déficit y vigencia» de un derecho.'}
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
  {label:['Está en la Constitución','Está en una ley menor'],headA:'📕 En la Constitución',headB:'📄 En una ley menor',colA:'con',colB:'ley',
   words:[{w:'El artículo 162 sobre la docencia',t:'con'},{w:'El artículo 128 numeral 7',t:'con'},{w:'El mandato de hacer el Estatuto (art. 165)',t:'con'},{w:'El permiso previo de la Secretaría de Trabajo',t:'ley'},{w:'El Decreto 136-97',t:'ley'},{w:'El Acuerdo 0760-SE-99',t:'ley'},{w:'Las facultades para reglamentar (art. 245)',t:'con'},{w:'El Código de la Niñez',t:'ley'}]},
  {label:['Lo acredita el repositorio','Hay que ir a buscarlo'],headA:'✅ Está verificado',headB:'🔍 Hay que buscarlo',colA:'si',colB:'no',
   words:[{w:'Qué artículo cita cada ley',t:'si'},{w:'El texto completo del artículo 128',t:'no'},{w:'El texto del artículo 162',t:'si'},{w:'Cuántos artículos tiene la Constitución',t:'no'},{w:'Para qué invoca cada ley su artículo',t:'si'},{w:'En qué año se aprobó la Constitución',t:'no'},{w:'Que el artículo 165 ordenó el Estatuto',t:'si'},{w:'Cómo se reforma la Constitución',t:'no'}]},
  {label:['Es un artículo','Es un numeral'],headA:'📑 Artículo',headB:'🔢 Numeral',colA:'art',colB:'num',
   words:[{w:'La unidad con un tema propio',t:'art'},{w:'Un punto numerado dentro de otro',t:'num'},{w:'El 128 en «artículo 128 numeral 7»',t:'art'},{w:'El 7 en «artículo 128 numeral 7»',t:'num'},{w:'Lo que se cita primero',t:'art'},{w:'Lo que precisa dentro del anterior',t:'num'},{w:'El 165 que ordenó el Estatuto',t:'art'},{w:'El 11 en «artículo 245 numeral 11»',t:'num'}]}
];
let currentClassGroupIdx=0,clsSelectedWord=null;
function buildClass(){const group=classGroups[currentClassGroupIdx];document.getElementById('col-left-head').textContent=group.headA;document.getElementById('col-right-head').textContent=group.headB;const bank=document.getElementById('clsBank');bank.innerHTML='';clsSelectedWord=null;document.getElementById('items-left').innerHTML='';document.getElementById('items-right').innerHTML='';_shuffle([...group.words]).forEach(w=>{const el=document.createElement('div');el.className='wb-item';el.textContent=w.w;el.dataset.t=w.t;el.onclick=()=>{document.querySelectorAll('.wb-item').forEach(i=>i.classList.remove('sel-word'));el.classList.add('sel-word');clsSelectedWord=el;sfx('click');};bank.appendChild(el);});['col-left','col-right'].forEach(colId=>{const col=document.getElementById(colId);col.onclick=(e)=>{if(!clsSelectedWord||e.target.classList.contains('drop-item'))return;const targetId=colId==='col-left'?'items-left':'items-right';const wordsCol=document.getElementById(targetId);const item=document.createElement('div');item.className='drop-item';item.textContent=clsSelectedWord.textContent;item.dataset.t=clsSelectedWord.dataset.t;const original=clsSelectedWord;item.onclick=(ev)=>{ev.stopPropagation();if(clsSelectedWord!==null){col.click();}else{document.getElementById('clsBank').appendChild(original);original.classList.remove('sel-word');item.remove();if(typeof sfx==='function')sfx('click');}};wordsCol.appendChild(item);clsSelectedWord.remove();clsSelectedWord=null;sfx('click');};});}
function checkClass(){const remaining=document.querySelectorAll('#clsBank .wb-item').length;if(remaining>0){fb('fbCls','Mueve todas las palabras a las columnas primero.',false);return;}const group=classGroups[currentClassGroupIdx];let allOk=true;document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{const inLeft=el.parentElement.id==='items-left';const expectedType=inLeft?group.colA:group.colB;if(el.dataset.t===expectedType){el.classList.add('cls-ok');}else{el.classList.add('cls-no');allOk=false;}});if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);}if(allOk){fb('fbCls','¡Perfecto! +5 XP',true);sfx('fan');fin('s-clasifica');unlockAchievement('clasif_pro');}else{fb('fbCls','Hay errores. Los errados llevan ✗.',false);sfx('no');}}
function nextClassGroup(){sfx('click');currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length;buildClass();document.getElementById('fbCls').classList.remove('show');showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]);}
function resetClass(){sfx('click');buildClass();document.getElementById('fbCls').classList.remove('show');}

// ===================== IDENTIFICAR =====================
const idData=[
  {s:['La','Constitución','es','la','ley','fundamental','de','Honduras.'],c:5,art:'La palabra que dice que está por encima de todas'},
  {s:['El','artículo','128','numeral','7','protege','el','trabajo','de','los','menores.'],c:3,art:'La palabra que nombra un punto DENTRO de un artículo'},
  {s:['El','artículo','165','ordenó','escribir','el','Estatuto','del','Docente.'],c:3,art:'El verbo que dice que la Constitución MANDA, no solo prohíbe'},
  {s:['El','artículo','162','habla','de','los','discípulos','del','educador.'],c:6,art:'A quién nombra PRIMERO la Constitución al hablar del maestro'},
  {s:['Una','Secretaría','dicta','un','reglamento','en','uso','de','facultades','constitucionales.'],c:8,art:'El permiso con el que una autoridad puede firmar'},
  {s:['Los','niños','gozan','de','las','libertades','de','la','Constitución.'],c:5,art:'Lo que un niño tiene por ser persona'},
  {s:['Un','convenio','internacional','fortalece','lo','que','dice','la','Constitución.'],c:3,art:'Lo que hace un texto cuando se suma a otro'},
  {s:['La','democracia','participativa','se','ejerce','también','entre','elecciones.'],c:2,art:'El apellido de la democracia en que la gente decide siempre'}
];
let idIdx=0,idDone=false;
function showId(){idDone=false;if(idIdx>=idData.length){document.getElementById('idSent').innerHTML='🎉 ¡Completado!';fin('s-identifica');unlockAchievement('id_master');return;}const d=idData[idIdx];document.getElementById('idProg').textContent=`Oración ${idIdx+1} de ${idData.length}`;document.getElementById('idInfo').textContent=`Busca: ${d.art}`;const sent=document.getElementById('idSent');sent.innerHTML='';d.s.forEach((w,i)=>{const span=document.createElement('span');span.className='id-word';span.textContent=w+' ';span.onclick=()=>checkId(i,span);sent.appendChild(span);});}
function checkId(i,span){if(idDone)return;document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected'));span.classList.add('selected');if(i===idData[idIdx].c){idDone=true;span.classList.add('id-ok');fb('fbId','¡Correcto! +5 XP',true);if(!xpTracker.id.has(idIdx)){xpTracker.id.add(idIdx);pts(5);}sfx('ok');}else{span.classList.add('id-no');fb('fbId','Ese no es el término solicitado.',false);sfx('no');}}
function nextId(){sfx('click');idIdx++;showId();document.getElementById('fbId').classList.remove('show');}
function resetId(){sfx('click');idIdx=0;showId();document.getElementById('fbId').classList.remove('show');}

// ===================== COMPLETA =====================
const cmpData=[
  {s:'La unidad numerada de una ley se llama ___.',opts:['artículo','capítulo','párrafo'],c:0},
  {s:'Un punto numerado dentro de un artículo se llama ___.',opts:['inciso','numeral','anexo'],c:1},
  {s:'El artículo ___ ordenó que se escribiera el Estatuto del Docente.',opts:['128','162','165'],c:2},
  {s:'El artículo 128 numeral 7 trata del trabajo de los ___.',opts:['menores','maestros','jueces'],c:0},
  {s:'Según el artículo 162, el educador responde primero ante sus ___.',opts:['jefes','discípulos','colegas'],c:1},
  {s:'Antes de firmar un reglamento hay que decir de qué artículos se sacan las ___.',opts:['copias','fechas','facultades'],c:2},
  {s:'Los niños gozan de las ___ consignadas en la Constitución.',opts:['libertades','materias','monedas'],c:0},
  {s:'La democracia en que la gente decide entre elecciones se llama ___.',opts:['indirecta','participativa','delegada'],c:1}
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
  { label: 'Ordena los pasos para analizar un caso', steps: CONST_CASOS.comoSeAnaliza.map(x => x.replace(/^\d+\.\s*/, '')) },
  { label: 'Ordena: de la Constitución al aula', steps: [
      'La Constitución de la República',
      'Una ley del Congreso (un decreto)',
      'El reglamento de esa ley (un acuerdo)',
      'La regla que pone el centro educativo'
  ] }
];
let currentRouteIdx=0,routeItems=[];
function buildRoute(){routeItems=_shuffle([...routeSets[currentRouteIdx].steps]);renderRoute();const fbEl=document.getElementById('fbRoute');if(fbEl)fbEl.classList.remove('show');}
function renderRoute(){const list=document.getElementById('routeList');if(!list)return;list.innerHTML='';routeItems.forEach((step,i)=>{const div=document.createElement('div');div.className='sort-item';div.innerHTML=`<div class="sort-arrows"><button class="sort-arrow" onclick="routeMove(${i},-1)"${i===0?' disabled':''}>▲</button><button class="sort-arrow" onclick="routeMove(${i},1)"${i===routeItems.length-1?' disabled':''}>▼</button></div><div class="sort-step-num">${i+1}.</div><div class="sort-item-txt">${step}</div>`;list.appendChild(div);});}
function routeMove(idx,dir){sfx('click');const ni=idx+dir;if(ni<0||ni>=routeItems.length)return;[routeItems[idx],routeItems[ni]]=[routeItems[ni],routeItems[idx]];renderRoute();}
function checkRoute(){const correct=routeSets[currentRouteIdx].steps;const isOk=routeItems.every((s,i)=>s===correct[i]);if(isOk){fb('fbRoute','¡Perfecto! Orden correcto. +4 XP',true);if(!xpTracker.wgt.has('route_'+currentRouteIdx)){xpTracker.wgt.add('route_'+currentRouteIdx);pts(4);}sfx('fan');fin('s-widgets');unlockAchievement('widgets_master');}else{fb('fbRoute','Hay pasos fuera de orden. Revisa el arreglo.',false);sfx('no');}}
function nextRoute(){sfx('click');currentRouteIdx=(currentRouteIdx+1)%routeSets.length;buildRoute();showToast('🔄 Secuencia: '+routeSets[currentRouteIdx].label);}

// Widget 2: Identifica el concepto
const neuronPartes = (function () {
  const nombres = CONST_ARTICULOS.map(a => a.art);
  return CONST_ARTICULOS.map(a => ({ desc: a.paraQue, ans: a.art, opts: nombres.slice() }));
})();
let neuronIdx=0,neuronDone=false;
function showNeuron(){neuronDone=false;if(neuronIdx>=neuronPartes.length){const el=document.getElementById('neuronDesc');if(el)el.textContent='🎉 ¡Ya reconoces a cada uno por lo que hizo!';const opts=document.getElementById('neuronOpts');if(opts)opts.innerHTML='';fin('s-widgets');return;}const d=neuronPartes[neuronIdx];const prog=document.getElementById('neuronProg');if(prog)prog.textContent=`Pista ${neuronIdx+1} de ${neuronPartes.length}`;const desc=document.getElementById('neuronDesc');if(desc)desc.textContent=d.desc;const opts=document.getElementById('neuronOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=opt;b.onclick=()=>checkNeuron(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuron');if(fbEl)fbEl.classList.remove('show');}
function checkNeuron(opt,btn,d){if(neuronDone)return;neuronDone=true;document.querySelectorAll('#neuronOpts .cmp-opt').forEach(b=>{if(b.textContent===d.ans)b.classList.add('correct');else if(b===btn&&b.textContent!==d.ans)b.classList.add('wrong');});const isOk=opt===d.ans;if(isOk){fb('fbNeuron','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuron_'+neuronIdx)){xpTracker.wgt.add('neuron_'+neuronIdx);pts(3);}sfx('ok');}else{fb('fbNeuron','La respuesta correcta es: '+d.ans,false);sfx('no');}}
function nextNeuron(){sfx('click');neuronIdx++;showNeuron();}
function resetNeuron(){sfx('click');neuronIdx=0;showNeuron();}

// Widget 3: Concepto → Significado
const neuroPairs = (function () {
  const nombres = CONST_ARTICULOS.map(a => a.art);
  return CONST_ARTICULOS.map(a => ({ trans: '«' + a.tema + '»', func: a.art, opts: nombres.slice() }));
})();
let neuroIdx=0,neuroDone=false;
function showNeuro(){neuroDone=false;if(neuroIdx>=neuroPairs.length){const el=document.getElementById('neuroTrans');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('neuroOpts');if(opts)opts.innerHTML='';return;}const d=neuroPairs[neuroIdx];const prog=document.getElementById('neuroProg');if(prog)prog.textContent=`${neuroIdx+1} de ${neuroPairs.length}`;const trans=document.getElementById('neuroTrans');if(trans)trans.textContent=d.trans;const opts=document.getElementById('neuroOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkNeuro(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuro');if(fbEl)fbEl.classList.remove('show');}
function checkNeuro(opt,btn,d){if(neuroDone)return;neuroDone=true;document.querySelectorAll('#neuroOpts .qz-opt').forEach(b=>{if(b.textContent===d.func)b.classList.add('correct');else if(b===btn&&b.textContent!==d.func)b.classList.add('wrong');});const isOk=opt===d.func;if(isOk){fb('fbNeuro','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuro_'+neuroIdx)){xpTracker.wgt.add('neuro_'+neuroIdx);pts(3);}sfx('ok');}else{fb('fbNeuro','Correcto: '+d.func,false);sfx('no');}setTimeout(()=>{neuroIdx++;showNeuro();},1800);}
function resetNeuro(){sfx('click');neuroIdx=0;showNeuro();}

// Widget 4: Fuente → ¿Renovable o no renovable?
const enfermedadData=[
  {disease:'Qué artículo de la Constitución cita cada ley',characteristic:'Lo acredita el repositorio',opts:['Lo acredita el repositorio','Hay que ir a buscarlo']},
  {disease:'El texto completo del artículo 128 numeral 7',characteristic:'Hay que ir a buscarlo',opts:['Lo acredita el repositorio','Hay que ir a buscarlo']},
  {disease:'El texto del artículo 162, citado por el Estatuto',characteristic:'Lo acredita el repositorio',opts:['Lo acredita el repositorio','Hay que ir a buscarlo']},
  {disease:'Cuántos artículos tiene la Constitución',characteristic:'Hay que ir a buscarlo',opts:['Lo acredita el repositorio','Hay que ir a buscarlo']},
  {disease:'Que el artículo 165 ordenó el Estatuto del Docente',characteristic:'Lo acredita el repositorio',opts:['Lo acredita el repositorio','Hay que ir a buscarlo']},
  {disease:'En qué año se aprobó la Constitución',characteristic:'Hay que ir a buscarlo',opts:['Lo acredita el repositorio','Hay que ir a buscarlo']},
  {disease:'Para qué invoca cada ley su artículo',characteristic:'Lo acredita el repositorio',opts:['Lo acredita el repositorio','Hay que ir a buscarlo']},
  {disease:'Cómo se reforma la Constitución',characteristic:'Hay que ir a buscarlo',opts:['Lo acredita el repositorio','Hay que ir a buscarlo']},
  {disease:'Que los niños gozan de las libertades de la Constitución',characteristic:'Lo acredita el repositorio',opts:['Lo acredita el repositorio','Hay que ir a buscarlo']}
];
let enferIdx=0,enferDone=false;
function showEnfer(){enferDone=false;if(enferIdx>=enfermedadData.length){const el=document.getElementById('enferDisease');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('enferOpts');if(opts)opts.innerHTML='';return;}const d=enfermedadData[enferIdx];const prog=document.getElementById('enferProg');if(prog)prog.textContent=`${enferIdx+1} de ${enfermedadData.length}`;const dis=document.getElementById('enferDisease');if(dis)dis.textContent=d.disease;const opts=document.getElementById('enferOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkEnfer(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbEnfer');if(fbEl)fbEl.classList.remove('show');}
function checkEnfer(opt,btn,d){if(enferDone)return;enferDone=true;document.querySelectorAll('#enferOpts .qz-opt').forEach(b=>{if(b.textContent===d.characteristic)b.classList.add('correct');else if(b===btn&&b.textContent!==d.characteristic)b.classList.add('wrong');});const isOk=opt===d.characteristic;if(isOk){fb('fbEnfer','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('enfer_'+enferIdx)){xpTracker.wgt.add('enfer_'+enferIdx);pts(3);}sfx('ok');}else{fb('fbEnfer','Correcto: '+d.characteristic,false);sfx('no');}setTimeout(()=>{enferIdx++;showEnfer();},1800);}
function resetEnfer(){sfx('click');enferIdx=0;showEnfer();}

// ===================== RETO FINAL =====================
const retoPairs=[
  {label:['Está en la Constitución','Está en una ley menor'],btnA:'📕 Constitución',btnB:'📄 Ley menor',colA:'con',colB:'ley',
   words:[{w:'El artículo 162 sobre la docencia',t:'con'},{w:'El artículo 128 numeral 7',t:'con'},{w:'El mandato de hacer el Estatuto (art. 165)',t:'con'},{w:'El permiso previo de la Secretaría de Trabajo',t:'ley'},{w:'El Decreto 136-97',t:'ley'},{w:'El Acuerdo 0760-SE-99',t:'ley'},{w:'Las facultades para reglamentar (art. 245)',t:'con'},{w:'El Código de la Niñez',t:'ley'},{w:'Los artículos 34 y 168',t:'con'},{w:'El Reglamento del Estatuto',t:'ley'}]},
  {label:['Lo acredita el repositorio','Hay que ir a buscarlo'],btnA:'✅ Verificado',btnB:'🔍 Búscalo',colA:'si',colB:'no',
   words:[{w:'Qué artículo cita cada ley',t:'si'},{w:'El texto completo del artículo 128',t:'no'},{w:'El texto del artículo 162',t:'si'},{w:'Cuántos artículos tiene la Constitución',t:'no'},{w:'Para qué invoca cada ley su artículo',t:'si'},{w:'En qué año se aprobó la Constitución',t:'no'},{w:'Que el artículo 165 ordenó el Estatuto',t:'si'},{w:'Cómo se reforma la Constitución',t:'no'}]},
  {label:['Es un artículo','Es un numeral'],btnA:'📑 Artículo',btnB:'🔢 Numeral',colA:'art',colB:'num',
   words:[{w:'La unidad con un tema propio',t:'art'},{w:'Un punto numerado dentro de otro',t:'num'},{w:'El 128 en «artículo 128 numeral 7»',t:'art'},{w:'El 7 en «artículo 128 numeral 7»',t:'num'},{w:'Lo que se cita primero',t:'art'},{w:'Lo que precisa dentro del anterior',t:'num'},{w:'El 165 que ordenó el Estatuto',t:'art'},{w:'El 11 en «artículo 245 numeral 11»',t:'num'}]}
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
  {s:'La Constitución de la República es la ley fundamental de Honduras.',type:'ley fundamental'},
  {s:'En «artículo 128 numeral 7», el 7 es un numeral.',type:'numeral'},
  {s:'El artículo 165 ordenó que se escribiera el Estatuto del Docente.',type:'artículo 165'},
  {s:'El artículo 162 nombra primero a los discípulos del educador.',type:'discípulos'},
  {s:'Una Secretaría dicta un reglamento en uso de facultades constitucionales.',type:'facultades'},
  {s:'Los niños gozan de las libertades consignadas en la Constitución.',type:'libertades'},
  {s:'Un convenio internacional fortalece lo que dice la Constitución.',type:'convenio internacional'},
  {s:'La democracia participativa se ejerce también entre elecciones.',type:'democracia participativa'},
  {s:'El empleo de un niño requiere permiso previo de la Secretaría de Trabajo.',type:'permiso previo'},
  {s:'A la distancia entre lo escrito y lo que pasa se le llama déficit y vigencia.',type:'déficit y vigencia'}
];
const classifyTaskDB=[
  {w:'Artículo 162',gen:'Las responsabilidades del educador',n:'Lo cita el Estatuto del Docente',g:'Nombra primero a los discípulos',t:'Es el único con texto literal en el repositorio'},
  {w:'Artículo 165',gen:'Ordenó escribir el Estatuto del Docente',n:'Un mandato impostergable',g:'La Constitución también ENCARGA',t:'No todo en ella es prohibir'},
  {w:'Artículo 128 numeral 7',gen:'El trabajo de los menores',n:'Lo cita el Código de la Niñez',g:'Exige permiso previo',t:'Es el que más cerca te toca'},
  {w:'Artículos 245, 157 y 163',gen:'Las facultades para reglamentar',n:'Los cita el Reglamento del Estatuto',g:'Nadie manda «porque sí»',t:'Sin permiso, lo firmado no vale'},
  {w:'Artículos 34 y 168',gen:'Los docentes de otra nacionalidad',n:'Los cita el Artículo 8 del Estatuto',g:'Reciprocidad entre países',t:'Una ley escribe sobre un piso ya puesto'},
  {w:'Artículo',gen:'La unidad numerada de una ley',n:'Tiene un tema propio',g:'Se cita primero',t:'Hay uno con el mismo número en casi toda ley'},
  {w:'Numeral',gen:'Un punto numerado dentro de un artículo',n:'Precisa dentro del anterior',g:'El 7 de «128 numeral 7»',t:'Sin él, la cita queda a medias'}
];
const completeTaskDB=[
  {s:'La unidad numerada de una ley se llama ___.',ans:'artículo'},
  {s:'Un punto numerado dentro de un artículo se llama ___.',ans:'numeral'},
  {s:'La ley que está por encima de todas las demás es la ___.',ans:'Constitución'},
  {s:'El artículo ___ ordenó que se escribiera el Estatuto del Docente.',ans:'165'},
  {s:'El artículo ___ habla de las responsabilidades del educador.',ans:'162'},
  {s:'El artículo 128 numeral ___ trata del trabajo de los menores.',ans:'7'},
  {s:'Los niños gozan de las ___ consignadas en la Constitución.',ans:'libertades'},
  {s:'Antes de firmar un reglamento hay que decir de dónde salen las ___.',ans:'facultades'},
  {s:'La democracia en que la gente decide entre elecciones es la ___.',ans:'participativa'}
];
const explainQuestions=[
  {q:'Explica cómo se lee la cita «artículo 128 numeral 7 de la Constitución de la República».',ans:'Son tres piezas. El ARTÍCULO 128 es la unidad de la norma, con su tema propio. El NUMERAL 7 es uno de los puntos numerados dentro de ese artículo. Y «de la Constitución de la República» dice de qué norma se habla, que es imprescindible: hay un artículo 128 en casi todas las leyes del país.'},
  {q:'¿Por qué se dice que la Constitución no solo prohíbe, sino que también manda?',ans:'Porque hay leyes que existen porque ella lo ordenó. El Estatuto del Docente es una: el Congreso lo llama «un mandato impostergable instituido en el Artículo 165 de la Constitución de la República». Mientras una ley así no se escribe, ese mandato está sin cumplir.'},
  {q:'El artículo 162 dice que el educador responde ante tres. ¿Ante quiénes, y en qué orden?',ans:'Frente a sus discípulos, frente a la institución en que labora y ante la sociedad. En ese orden, y el primero es el alumno. Lo cita palabra por palabra el Estatuto del Docente en sus considerandos.'},
  {q:'¿Por qué una autoridad tiene que decir de qué artículos saca sus facultades?',ans:'Porque nadie en el Estado manda «porque sí». El Reglamento del Estatuto empieza diciendo que se dicta «en uso de las facultades establecidas en los artículos 245 numeral 11, 157 y 163 de la Constitución». Quien no puede decir de dónde saca el permiso, no lo tiene, y lo que firmó no vale.'},
  {q:'Explica cómo la Constitución, una ley y un convenio internacional se fortalecen entre sí.',ans:'Protegen lo mismo desde alturas distintas. El trabajo de un niño está sujeto al artículo 128 numeral 7 de la Constitución, el Código de la Niñez exige además el permiso previo de la Secretaría de Trabajo, y los convenios internacionales que Honduras firmó están entre las fuentes de ese mismo Código. Quien quiera saltárselo tiene que saltarse los tres.'},
  {q:'«Los niños gozan de las libertades consignadas en la Constitución». ¿Qué cambia esa forma de decirlo?',ans:'Que no es el Código el que se las concede: el niño ya las tiene por la Constitución, y el Código se suma. Un derecho que viene de la Constitución no se lo puede quitar una ley menor, y por eso importa saber de dónde viene cada uno.'},
  {q:'Escoge un caso en que un artículo de la Constitución no se cumpla y analízalo.',ans:'Respuesta abierta, con los cinco pasos: qué artículo no se cumple (nombrado entero), quién tenía que cumplirlo, a quién le cuesta y qué pierde esa persona, a dónde se reclama, y qué podría hacer el propio alumno. Se valora el análisis, no la indignación.'},
  {q:'¿Qué es la democracia participativa y qué hace falta para ejercerla?',ans:'Que la gente no solo vote cada cuatro años, sino que también decida, pregunte y reclame entre elección y elección. Para reclamar hace falta saber qué dice la norma: quien no sabe qué le toca, no puede pedirlo. Por eso saber leer un artículo es parte de ser ciudadano.'},
  {q:'Busca un artículo de la Constitución que te parezca importante, cópialo y explica por qué lo escogiste.',ans:'Respuesta abierta y de investigación, como la pide el currículo: «Seleccionan artículos de la Constitución de la República». Se valora que copie el artículo entero y bien citado, y que el porqué sea suyo y esté argumentado.'}
];
let ansVisible=false;
function genTask(){sfx('click');const type=document.getElementById('tgType').value;const count=parseInt(document.getElementById('tgCount').value);ansVisible=false;const out=document.getElementById('tgOut');out.innerHTML='';if(type==='identify')genIdentifyTask(out,count);else if(type==='classify')genClassifyTask(out,count);else if(type==='complete')genCompleteTask(out,count);else if(type==='explain')genExplainTask(out,count);fin('s-tareas');}
function _instrBlock(out,title,lines){const ib=document.createElement('div');ib.className='tg-instruction-block';ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join('');out.appendChild(ib);}
function genIdentifyTask(out,count){_instrBlock(out,'Instrucción',['Copia en tu cuaderno; subraya, colorea o encierra el concepto indicado en cada oración. Escribe al lado a qué poder del Estado o a qué concepto se refiere.','<strong>Ejemplo:</strong> El Congreso Nacional aprueba las leyes del país. → <span style="color:var(--jade);font-weight:700;">Congreso Nacional</span>']);_pick(identifyTaskDB,Math.min(count,identifyTaskDB.length)).forEach((item,i)=>{const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.type}</div></div>`;out.appendChild(div);});}
function genClassifyTask(out,count){_instrBlock(out,'Instrucción',['Copia la siguiente tabla en tu cuaderno. Para cada persona, completa qué hizo, en qué época vivió, cómo se le llama y un dato que la distinga.']);const items=_pick(classifyTaskDB,Math.min(count,classifyTaskDB.length));const wrap=document.createElement('div');wrap.style.overflowX='auto';const th=(t,extra='')=>`<th style="padding:0.3rem 0.4rem;border:1px solid var(--border);font-size:0.72rem;text-align:center;${extra}">${t}</th>`;let html=`<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:520px;"><thead><tr style="background:var(--pri-gl);">${th('Quién','text-align:left;')}${th('Qué hizo')}${th('Cuándo')}${th('Cómo se le llama')}${th('Dato')}</tr></thead><tbody>`;items.forEach(it=>{html+=`<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td>`+Array(4).fill(`<td style="padding:0.4rem;border:1px solid var(--border);min-width:50px;"></td>`).join('')+'</tr>';});html+='</tbody></table>';wrap.innerHTML=html;out.appendChild(wrap);const ans=document.createElement('div');ans.className='tg-answer';ans.style.marginTop='0.8rem';ans.innerHTML='<strong>✅ Respuestas:</strong><br>'+items.map(it=>`<strong>${it.w}:</strong> Qué es: ${it.gen} | Clase: ${it.n} | Desde cuándo: ${it.g} | Dato: ${it.t}`).join('<br>');out.appendChild(ans);}
function genCompleteTask(out,count){_instrBlock(out,'Instrucción',['Copia y resuelve en tu cuaderno. Cada oración tiene un espacio ___. Elige y escribe la opción correcta.']);const pool=_shuffle([...completeTaskDB]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';const sent=item.s.replace('___','<span class="tg-blank" style="min-width:90px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${sent}</strong><div style="margin-top:0.4rem;font-size:0.82rem;color:var(--gray);">📝 Opciones: <strong>${item.opts.join(' | ')}</strong></div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function genExplainTask(out,count){_instrBlock(out,'Instrucción',['Copia las siguientes preguntas en tu cuaderno y responde cada una de forma clara y completa.']);const pool=_shuffle([...explainQuestions]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.3rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function toggleAns(){ansVisible=!ansVisible;document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none');sfx('click');}

// ===================== SOPA DE LETRAS =====================
const sopaSets=[
  {size:12,grid:[
    ['L','Z','O','Z','A','W','I','L','I','G','Y','N'],
    ['A','T','L','Y','U','U','R','O','J','C','B','O'],
    ['T','J','U','M','Y','L','S','X','U','U','A','I'],
    ['N','V','C','W','S','A','J','Y','T','B','I','C'],
    ['E','S','I','I','W','R','H','K','J','N','C','U'],
    ['M','K','T','J','G','E','K','X','T','P','A','T'],
    ['A','U','R','C','I','M','H','Q','O','G','R','I'],
    ['D','X','A','V','M','U','R','K','D','R','C','T'],
    ['N','J','O','Z','S','N','S','R','U','J','O','S'],
    ['U','P','R','Q','R','Y','X','N','W','I','M','N'],
    ['F','I','U','X','C','F','I','M','T','C','E','O'],
    ['A','G','R','C','H','D','N','Y','V','C','D','C']
  ],words:[
    {w:'CONSTITUCION',cells:[[11,11],[10,11],[9,11],[8,11],[7,11],[6,11],[5,11],[4,11],[3,11],[2,11],[1,11],[0,11]]},
    {w:'FUNDAMENTAL',cells:[[10,0],[9,0],[8,0],[7,0],[6,0],[5,0],[4,0],[3,0],[2,0],[1,0],[0,0]]},
    {w:'DEMOCRACIA',cells:[[11,10],[10,10],[9,10],[8,10],[7,10],[6,10],[5,10],[4,10],[3,10],[2,10]]},
    {w:'ARTICULO',cells:[[7,2],[6,2],[5,2],[4,2],[3,2],[2,2],[1,2],[0,2]]},
    {w:'NUMERAL',cells:[[8,5],[7,5],[6,5],[5,5],[4,5],[3,5],[2,5]]}
  ]},
  {size:10,grid:[
    ['D','G','O','G','U','E','Z','R','G','A'],
    ['G','L','H','H','M','Y','E','P','F','O'],
    ['B','Y','C','O','T','E','R','C','E','D'],
    ['O','A','E','A','C','U','E','R','D','O'],
    ['O','B','R','D','A','T','E','C','N','L'],
    ['M','V','E','R','I','M','C','K','O','Q'],
    ['A','B','D','I','H','O','R','N','E','E'],
    ['B','T','Z','D','E','H','C','O','V','O'],
    ['Y','F','B','M','Y','J','Y','V','N','O'],
    ['D','A','T','R','E','B','I','L','V','K']
  ],words:[
    {w:'DERECHO',cells:[[6,2],[5,2],[4,2],[3,2],[2,2],[1,2],[0,2]]},
    {w:'DECRETO',cells:[[2,9],[2,8],[2,7],[2,6],[2,5],[2,4],[2,3]]},
    {w:'ACUERDO',cells:[[3,3],[3,4],[3,5],[3,6],[3,7],[3,8],[3,9]]},
    {w:'LIBERTAD',cells:[[9,7],[9,6],[9,5],[9,4],[9,3],[9,2],[9,1],[9,0]]},
    {w:'NORMA',cells:[[8,8],[7,7],[6,6],[5,5],[4,4]]}
  ]}
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
  {q:'La Constitución de la República es la ley fundamental de Honduras.',a:true},
  {q:'En «artículo 128 numeral 7», el 7 es el año en que se escribió.',a:false},
  {q:'Citar «el artículo 128» sin decir de qué norma es, basta para identificarlo.',a:false},
  {q:'Una Constitución solo sirve para prohibir cosas.',a:false},
  {q:'El Estatuto del Docente existe por mandato del artículo 165 de la Constitución.',a:true},
  {q:'El artículo 162 dice que el educador responde ante sus discípulos, su institución y la sociedad.',a:true},
  {q:'Una Secretaría puede dictar un reglamento sin decir de dónde saca las facultades.',a:false},
  {q:'El Código de la Niñez exige permiso previo para que un niño trabaje en actividad retribuida.',a:true},
  {q:'Los niños tienen las libertades de la Constitución, no solo las que les da el Código.',a:true},
  {q:'Si un convenio internacional dice lo mismo que la Constitución, uno de los dos sobra.',a:false},
  {q:'Un derecho que viene de la Constitución se lo puede quitar una ley menor.',a:false},
  {q:'La democracia participativa se ejerce también entre una elección y otra.',a:true},
  {q:'Que un artículo esté escrito garantiza que se cumpla.',a:false},
  {q:'El Reglamento del Estatuto cita los artículos 245 numeral 11, 157 y 163 de la Constitución.',a:true},
  {q:'Los artículos 34 y 168 se citan para los docentes de otra nacionalidad.',a:true},
  {q:'Un artículo es un punto numerado dentro de un numeral.',a:false},
  {q:'Cuando la Constitución, una ley y un convenio protegen lo mismo, el derecho está mejor sostenido.',a:true},
  {q:'La distancia entre lo que dice un derecho y lo que pasa se llama «déficit y vigencia».',a:true},
  {q:'Para reclamar un derecho no hace falta saber qué dice la norma.',a:false},
  {q:'Una regla de un centro puede decir lo contrario de una ley nacional.',a:false}
];
const evalMCBank=[
  {q:'¿Qué es un numeral dentro de una cita legal?',o:['El año de la norma','Un punto numerado dentro de un artículo','La página','El número de reformas'],a:1},
  {q:'¿Por qué hay que citar de qué norma es un artículo?',o:['Porque hay un artículo con ese número en casi todas las leyes','Por cortesía','Porque lo exige el formato','Porque cambia cada año'],a:0},
  {q:'¿Qué artículo ordenó que se escribiera el Estatuto del Docente?',o:['El 128','El 162','El 165','El 245'],a:2},
  {q:'Según el artículo 162, ¿ante quién responde PRIMERO el educador?',o:['Ante la Secretaría','Ante sus discípulos','Ante el director','Ante el Congreso'],a:1},
  {q:'¿Qué exige el Código de la Niñez para que un niño trabaje en actividad retribuida?',o:['Solo su voluntad','Un contrato escrito','Permiso previo de la Secretaría de Trabajo pedido por sus padres','Nada si es medio tiempo'],a:2},
  {q:'¿Qué cita una Secretaría antes de dictar un reglamento?',o:['Su presupuesto','La fecha de vencimiento','El nombre del ministro','Los artículos de los que saca sus facultades'],a:3},
  {q:'«Los niños gozan de las libertades consignadas en la Constitución» significa que…',o:['El Código se las concede','Ya las tienen por la Constitución y el Código se suma','Valen solo en la escuela','Se piden por escrito'],a:1},
  {q:'¿Qué pasa cuando la Constitución, una ley y un convenio protegen lo mismo?',o:['Se contradicen','Sobra uno','Manda el más nuevo','El derecho queda más difícil de saltar'],a:3},
  {q:'¿Qué es la democracia participativa?',o:['Votar y esperar cuatro años','Que votan solo los adultos','Que deciden los tres poderes','Que la gente decide, pregunta y reclama también entre elecciones'],a:3},
  {q:'¿Qué muestra un caso en que un artículo no se cumple?',o:['La distancia entre lo escrito y lo que pasa','Que el artículo no sirve','Que hay que borrarlo','Que la ley es nueva'],a:0},
  {q:'¿En qué ley del repositorio se lee el artículo 162 citado palabra por palabra?',o:['En el Estatuto del Docente','En el Código de la Niñez','En el Reglamento del Estatuto','En La Gaceta'],a:0},
  {q:'¿Para qué cita el Estatuto los artículos 34 y 168?',o:['Para el salario','Para las vacaciones','Para los docentes de otra nacionalidad','Para los concursos'],a:2},
  {q:'Una regla de un centro contradice una ley nacional. ¿Cuál manda?',o:['La del centro, que es más cercana','La más nueva','La ley nacional','Ninguna'],a:2},
  {q:'¿Qué hace falta para poder reclamar un derecho?',o:['Tener dinero','Saber qué dice la norma','Ser mayor de edad','Vivir en la ciudad'],a:1},
  {q:'¿Qué NO se puede saber leyendo solo las leyes que citan a la Constitución?',o:['El texto completo de esos artículos','Qué artículo citan','Para qué lo invocan','En qué ley aparecen'],a:0}
];
const evalCPBank=[
  {q:'La unidad numerada de una ley se llama ___.',a:'artículo'},
  {q:'Un punto numerado dentro de un artículo se llama ___.',a:'numeral'},
  {q:'La ley que está por encima de todas las demás es la ___.',a:'Constitución'},
  {q:'El artículo ___ ordenó que se escribiera el Estatuto del Docente.',a:'165'},
  {q:'El artículo ___ habla de las responsabilidades del educador.',a:'162'},
  {q:'El artículo 128 numeral ___ trata del trabajo de los menores.',a:'7'},
  {q:'Antes de firmar un reglamento hay que decir de dónde salen las ___.',a:'facultades'},
  {q:'Los niños gozan de las ___ consignadas en la Constitución.',a:'libertades'},
  {q:'La democracia en que la gente decide entre elecciones se llama ___.',a:'participativa'},
  {q:'El Estatuto del Docente es el Decreto ___.',a:'136-97'},
  {q:'El Reglamento del Estatuto es el Acuerdo ___.',a:'0760-SE-99'},
  {q:'El Código de la Niñez y la Adolescencia es el Decreto ___.',a:'73-96'},
  {q:'Un niño necesita permiso previo de la Secretaría de ___ para trabajar.',a:'Trabajo'},
  {q:'Cuando tres textos protegen lo mismo, el derecho queda más ___.',a:'fuerte'},
  {q:'A la distancia entre lo escrito y lo que pasa el currículo la llama déficit y ___.',a:'vigencia'}
];
const evalPRBank=[
  {term:'Artículo',def:'La unidad numerada de una ley, con un tema propio'},
  {term:'Numeral',def:'Un punto numerado dentro de un artículo'},
  {term:'Artículo 162',def:'Habla de las responsabilidades del educador ante sus discípulos'},
  {term:'Artículo 165',def:'Ordenó que se escribiera el Estatuto del Docente'},
  {term:'Artículo 128 numeral 7',def:'Sujeta a él el trabajo de los menores'},
  {term:'Artículos 245, 157 y 163',def:'Las facultades con que el Ejecutivo dicta un reglamento'},
  {term:'Artículos 34 y 168',def:'Se citan para los docentes de otra nacionalidad'},
  {term:'Decreto 136-97',def:'El Estatuto del Docente Hondureño'},
  {term:'Acuerdo 0760-SE-99',def:'El Reglamento General del Estatuto del Docente'},
  {term:'Decreto 73-96',def:'El Código de la Niñez y la Adolescencia'},
  {term:'Democracia participativa',def:'La gente decide, pregunta y reclama también entre elecciones'},
  {term:'Convenio internacional',def:'Texto que Honduras firma y que refuerza lo que dice la Constitución'},
  {term:'Déficit y vigencia',def:'La distancia entre lo que un derecho dice y lo que de verdad pasa'},
  {term:'Facultades',def:'El permiso, sacado de la Constitución, con que una autoridad firma'},
  {term:'Ley fundamental',def:'El nombre que recibe la Constitución por estar sobre todas'}
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

function genEval(){sfx('click');_evalFormaSelector(); const _selF = document.getElementById('evalFormaSel'); if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10))); const cf = evalFormNum; const rng = _evalRng(cf); window._currentEvalForm=cf;evalFormNum = (evalFormNum % EVAL_FORMAS) + 1; _evalFormaSelector();saveProgress();document.getElementById('eval-screen-title').textContent=`🎓 Evaluación Final · Forma ${cf} · La Constitución: mi Ley Fundamental`;evalAnsVisible=false;const out=document.getElementById('evalOut');out.innerHTML='';const bar=document.createElement('div');bar.className='eval-score-bar';bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje · 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25 pts</span><span class="eval-score-pill esp-tf">V/F 25 pts</span><span class="eval-score-pill esp-mc">Selección 25 pts</span><span class="eval-score-pill esp-pr">Pareados 25 pts</span></div>`;out.appendChild(bar);const cpItems=_pickF(evalCPBank,5, rng);const s1=document.createElement('div');s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';cpItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='cp';d.dataset.evalIndex=i;const qHtml=item.q.replace('___',`<input class="eval-cp-input" type="text" data-cp="${i}" autocomplete="off">`);d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbCp${i}" aria-live="polite"></div>`;s1.appendChild(d);});out.appendChild(s1);const tfItems=_pickF(evalTFBank,5, rng);const s2=document.createElement('div');s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';tfItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='tf';d.dataset.evalIndex=i;d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="true"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="false"> Falso</label></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbTf${i}" aria-live="polite"></div>`;s2.appendChild(d);});out.appendChild(s2);const mcItems=_pickF(evalMCBank,5, rng);const s3=document.createElement('div');s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';mcItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='mc';d.dataset.evalIndex=i;const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join('');d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbMc${i}" aria-live="polite"></div>`;s3.appendChild(d);});out.appendChild(s3);const prItems=_pickF(evalPRBank,5, rng);const shuffledDefs=_shuffleF(prItems, rng);const letters=['A','B','C','D','E'];const s4=document.createElement('div');s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';const matchCard=document.createElement('div');matchCard.className='eval-item';let colLeft='<div class="eval-match-col"><h4>📌 Términos</h4>';prItems.forEach((item,i)=>{colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> <select class="eval-match-select" data-pr="${i}" aria-label="Respuesta pareada ${i+16}"><option value="">—</option>${letters.map(l=>`<option value="${l}">${l}</option>`).join('')}</select> ${item.term}</div>`;});colLeft+='</div>';let colRight='<div class="eval-match-col"><h4>🔑 Definiciones</h4>';shuffledDefs.forEach((item,i)=>{colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`;});colRight+='</div>';const ansKey=prItems.map((item,i)=>{const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)];return`${i+16}→${letter}`;}).join(' · ');matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div><div class="eval-item-feedback" id="evalFbPr" aria-live="polite"></div>`;s4.appendChild(matchCard);out.appendChild(s4);window._evalPrintData={tf:tfItems,mc:mcItems,cp:cpItems,pr:{terms:prItems,shuffledDefs,letters}};const autoPanel=document.createElement('div');autoPanel.id='evalAutoResult';autoPanel.className='eval-auto-result';autoPanel.innerHTML='<strong>🧮 Evaluación interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato original sin respuestas digitadas.';out.appendChild(autoPanel);fin('s-evaluacion');}
function toggleEvalAns(){evalAnsVisible=!evalAnsVisible;document.querySelectorAll('#evalOut .eval-answer').forEach(el=>el.style.display=evalAnsVisible?'block':'none');sfx('click');}
function normalizeEvalAnswer(v){return(v||'').toString().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\s+/g,' ').replace(/[()]/g,'').trim();}
function isCpCorrect(student,expected){const s=normalizeEvalAnswer(student);const e=normalizeEvalAnswer(expected);if(!s)return false;const variants=new Set([e]);if(e.includes(' '))e.split(' ').forEach(x=>x&&variants.add(x));return variants.has(s)||e.replace(/[^a-z0-9]/g,'')===s.replace(/[^a-z0-9]/g,'');}
function setEvalFeedback(id,ok,msg){const el=document.getElementById(id);if(!el)return;el.textContent=msg;el.className='eval-item-feedback '+(ok?'eval-ok':'eval-no');}
function gradeEval(){if(!window._evalPrintData){showToast('⚠️ Genera una evaluación primero');return;}sfx('click');const d=window._evalPrintData;let total=0;const detail={cp:0,tf:0,mc:0,pr:0};d.cp.forEach((it,i)=>{const input=document.querySelector(`[data-cp="${i}"]`);const ok=isCpCorrect(input?input.value:'',it.a);if(input){input.classList.toggle('eval-input-ok',ok);input.classList.toggle('eval-input-no',!ok);}if(ok){detail.cp++;total+=5;}setEvalFeedback('evalFbCp'+i,ok,ok?'Correcto. +5 pts':'Revisar. Respuesta esperada: '+it.a);});d.tf.forEach((it,i)=>{const selected=document.querySelector(`input[name="tf${i}"]:checked`);const ok=!!selected&&(selected.value==='true')===it.a;if(ok){detail.tf++;total+=5;}setEvalFeedback('evalFbTf'+i,ok,ok?'Correcto. +5 pts':'Revisar. Respuesta esperada: '+(it.a?'Verdadero':'Falso'));});d.mc.forEach((it,i)=>{const selected=document.querySelector(`input[name="mc${i}"]:checked`);const ok=!!selected&&Number(selected.value)===it.a;if(ok){detail.mc++;total+=5;}setEvalFeedback('evalFbMc'+i,ok,ok?'Correcto. +5 pts':'Revisar. Respuesta esperada: '+it.o[it.a]);});const expectedLetters=d.pr.terms.map(it=>d.pr.letters[d.pr.shuffledDefs.findIndex(df=>df.def===it.def)]);expectedLetters.forEach((letter,i)=>{const sel=document.querySelector(`[data-pr="${i}"]`);const ok=!!sel&&sel.value===letter;if(sel){sel.classList.toggle('eval-input-ok',ok);sel.classList.toggle('eval-input-no',!ok);}if(ok){detail.pr++;total+=5;}});const prMsg=`Pareados: ${detail.pr}/5 correctos. ${detail.pr===5?'Excelente. +25 pts':'Clave: '+expectedLetters.map((l,i)=>(i+16)+'→'+l).join(' · ')}`;setEvalFeedback('evalFbPr',detail.pr===5,prMsg);const result=document.getElementById('evalAutoResult');if(result){result.className='eval-auto-result '+(total>=70?'eval-auto-pass':'eval-auto-risk');result.innerHTML=`<strong>Resultado automático: ${total}/100 puntos</strong><br><span>Completar: ${detail.cp*5}/25 · V/F: ${detail.tf*5}/25 · Selección: ${detail.mc*5}/25 · Pareados: ${detail.pr*5}/25</span><br><em>Este resultado es solo para revisión en pantalla; la impresión conserva el formato limpio para papel.</em>`;}if(total>=70){pts(8);showToast('🎯 Evaluación calificada: '+total+'/100');}else showToast('🧮 Evaluación calificada: '+total+'/100. Revisa las respuestas marcadas.');}
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación La Constitución: mi Ley Fundamental · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.12rem 0.4rem;margin:0.22rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #3f6212;background:#f2f7e6;color:#3f6212;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#3f6212;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #3f6212;height:12px;}.obt-pct{white-space:nowrap;}.qn{font-weight:700;min-width:22px;flex-shrink:0;}.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:40px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.18rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.14rem 0.35rem;margin-bottom:0.1rem;break-inside:avoid;page-break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.3;display:flex;gap:0.28rem;margin-bottom:0.07rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.1rem 0.5rem;}.mc-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:0.04rem 0.15rem;margin-left:0.8rem;}.mc-opt{font-size:9pt;display:flex;align-items:center;gap:0.15rem;}.mc-opt input{width:10px;height:10px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{margin-top:0.1rem;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.08rem 0.4rem;margin-top:0.08rem;}.pr-head{font-size:9pt;font-weight:700;color:#555;margin-bottom:0.1rem;}.pr-item{font-size:10.5pt;padding:0.1rem 0.28rem;background:#f2f7e6;border-radius:3px;margin-bottom:0.07rem;display:flex;align-items:center;gap:0.2rem;line-height:1.2;break-inside:avoid;page-break-inside:avoid;}.pr-num{font-weight:700;color:#3f6212;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.22rem;padding:0.15rem 0;page-break-before:avoid;break-before:avoid;color:#3f6212;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #3f6212;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#555;}.pa{color:#007a00;font-weight:600;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · La Constitución: mi Ley Fundamental · Educación Básica · Educación Cívica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Evaluación Final · La Constitución: mi Ley Fundamental · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u</div></div><div class="p-grid">${pR}</div>
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
const critCaseBank=CONST_CASOS.casos.map(c => ({txt: c.caso}));
const critCaseQuestions=[
  '1. ¿Qué artículo NO se está cumpliendo? Nómbralo entero.',
  '2. ¿Quién tenía que cumplirlo?',
  '3. ¿A quién le cuesta, y qué pierde esa persona?',
  '4. ¿A dónde se reclama, y qué harías tú?'
];
const critCaseGuides=[
  'Se valora que lo NOMBRE ENTERO —«artículo 128 numeral 7 de la Constitución»— y no solo el número: el número solo no identifica nada.',
  'Puede ser una persona, una autoridad o una institución. Lo que no vale es «el sistema»: eso no se le puede reclamar a nadie.',
  'Aquí se califica que le ponga nombre al daño concreto —perder la escuela, perder el salario, quedarse sin voz—, no la indignación.',
  'Un caso concreto lo resuelve el Poder Judicial; una regla nueva, el Congreso. Y lo que haga el alumno tiene que estar a su alcance, no ser un deseo.'
];
const critErrorBank=[
  {txt:'"El artículo 128 dice que los niños no pueden trabajar."',
   g1:'La cita está a medias: es el ARTÍCULO 128 NUMERAL 7, y sin el numeral no se sabe de qué punto se habla.',
   g2:'Y no dice «no pueden»: el Código de la Niñez exige PERMISO PREVIO de la Secretaría de Trabajo, pedido por los padres o el representante.'},
  {txt:'"Como el Estatuto del Docente es una ley, está por encima de la Constitución porque es más nueva."',
   g1:'Manda la que está más ARRIBA, no la más nueva: la Constitución es la ley fundamental.',
   g2:'Además el Estatuto existe PORQUE la Constitución lo ordenó, en su artículo 165.'},
  {txt:'"Una Constitución solo sirve para prohibir cosas."',
   g1:'También ENCARGA: hay leyes que existen porque ella mandó escribirlas.',
   g2:'Y reparte facultades: el Reglamento del Estatuto se dicta «en uso de las facultades» de los artículos 245 numeral 11, 157 y 163.'},
  {txt:'"Los derechos de los niños se los da el Código de la Niñez."',
   g1:'El Código dice lo contrario: los niños GOZAN de las libertades consignadas en la Constitución.',
   g2:'El Código se suma; no concede. Por eso una ley menor no se las puede quitar.'}
];
const critDecisionBank=[
  'Vas a citar un artículo en tu tarea; conviene copiar la cita entera con el nombre de la norma, o poner solo el número porque se entiende.',
  'Un compañero dice que la Constitución no sirve porque no se cumple; conviene analizar un caso concreto con los cinco pasos, o darle la razón y no hablar del tema.',
  'Para el trabajo te piden un artículo de la Constitución; conviene buscar el texto de verdad en la biblioteca, o copiar lo que alguien recuerda.',
  'Ves un caso parecido a uno de los de esta misión en tu comunidad; conviene hablarlo en clase sin nombres, o señalar a la persona delante de todos.',
  'Hay que elegir el Gobierno Escolar; conviene participar y después analizar cómo se hizo, o dejar que decidan los de siempre.'
];
const critDecisionGuide='La mejor decisión comprueba antes de afirmar: una cita se copia entera y de la fuente, no de la memoria de alguien; un derecho que no se cumple se analiza caso por caso en vez de darlo por inútil; y un caso real se habla con respeto y sin nombres, porque el objetivo es entender qué falló, no acusar a un vecino.';
const critCompareBank=[
  {a:'Artículo 165 de la Constitución.',b:'Decreto 136-97 del Congreso Nacional.',
   ga:'La Constitución: ordenó que existiera el Estatuto.',
   gb:'El Estatuto del Docente: la ley que se escribió para cumplir ese mandato.',
   gr:'Los dos hablan de lo mismo, pero uno ENCARGA y el otro CUMPLE el encargo. Por eso el Estatuto empieza nombrando el artículo que lo mandó hacer.'},
  {a:'«Artículo 128».',b:'«Artículo 128 numeral 7 de la Constitución de la República».',
   ga:'Una cita a medias: no identifica nada.',
   gb:'Una cita completa: dice el artículo, el punto dentro de él y de qué norma.',
   gr:'Las dos parecen lo mismo y no lo son. Hay un artículo 128 en casi todas las leyes del país, así que la primera no lleva a ninguna parte.'},
  {a:'Lo que dice la Constitución sobre el trabajo de los menores.',b:'Lo que se ve en el mercado un día cualquiera.',
   ga:'El derecho escrito.',
   gb:'Lo que de verdad pasa.',
   gr:'A esa distancia el currículo la llama «déficit y vigencia» de un derecho. Notarla no es pesimismo: es el primer paso para reclamarlo, y por eso el DCNB pide analizar casos.'}
];
const critCauseBank=[
  {cause:'El artículo 165 de la Constitución ordenó que se hiciera el Estatuto del Docente.',guide:'Por eso el Decreto 136-97 empieza llamándolo «un mandato impostergable» y nombrando ese artículo.'},
  {cause:'El artículo 162 dice que el educador responde frente a sus discípulos.',guide:'Por eso el magisterio tiene una ley propia y no las reglas de cualquier otro empleo.'},
  {cause:'Una Secretaría tiene que decir de qué artículos saca sus facultades.',guide:'Por eso el Reglamento del Estatuto empieza citando los artículos 245 numeral 11, 157 y 163.'},
  {cause:'La Constitución está por encima de todas las demás normas.',guide:'Por eso una regla de un centro no puede decir lo contrario de una ley, ni una ley lo contrario de ella.'},
  {cause:'Un mismo derecho aparece en la Constitución, en una ley y en un convenio internacional.',guide:'Por eso queda más difícil de saltar: el currículo lo dice como «la presencia de uno fortalece al otro».'}
];
const critEffectBank=[
  {effect:'El Estatuto del Docente existe.',guide:'Porque el artículo 165 de la Constitución mandó que se escribiera.'},
  {effect:'Un niño no puede emplearse sin permiso previo de la Secretaría de Trabajo.',guide:'Porque el Código de la Niñez lo exige y lo sujeta al artículo 128 numeral 7 de la Constitución.'},
  {effect:'Un reglamento firmado sin decir de dónde salen sus facultades no vale.',guide:'Porque en el Estado nadie manda «porque sí»: el permiso tiene que venir de la Constitución.'},
  {effect:'Una ley menor no puede quitarle a un niño una libertad constitucional.',guide:'Porque esa libertad no se la dio la ley menor: ya la tenía por la Constitución.'},
  {effect:'Hay artículos escritos que no se cumplen.',guide:'Porque escribir un derecho no lo hace pasar: por eso el currículo pide analizar casos y no solo memorizar.'}
];
function genEvalCrit(){
  sfx('click');
  _injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });
  const _sC = document.getElementById('evalCritFormaSel');
  if (_sC && parseInt(_sC.value, 10)) evalCritFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sC.value, 10)));
  const cf=evalCritFormNum;window._currentEvalCritForm=cf;const rngC = _evalRng(200000 + cf);evalCritFormNum=(evalCritFormNum%EVAL_FORMAS)+1;_injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });saveProgress();
  document.getElementById('evalcrit-screen-title').textContent=`🧠 Pensamiento Crítico · Forma ${cf} · La Constitución: mi Ley Fundamental`;
  evalCritAnsVisible=false;
  const out=document.getElementById('evalCritOut');out.innerHTML='';
  const kase=_pickF(critCaseBank,1,rngC)[0];
  const s1=document.createElement('div');
  s1.innerHTML=`<div class="eval-section-title">I. Caso de análisis: el civismo de todos los días <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${kase.txt}</div>${critCaseQuestions.map((q,i)=>`<div class="crit-q-block"><div class="crit-q-label">${q}</div><textarea class="crit-textarea" rows="2" aria-label="${q}"></textarea><div class="crit-pauta">${critCaseGuides[i]}</div></div>`).join('')}<div class="crit-selfscore"><label for="critScore0">Obtenido:</label><input type="number" id="critScore0" class="crit-score-input" data-score="0" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s1);
  const err=_pickF(critErrorBank,1,rngC)[0];
  const s2=document.createElement('div');
  s2.innerHTML=`<div class="eval-section-title">II. Corrige el error <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${err.txt}</div><p style="font-size:0.85rem;margin-bottom:0.5rem;">Identifica <strong>dos errores</strong> y corrígelos con tus propias palabras:</p><div class="crit-q-block"><div class="crit-q-label">Error 1 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 1 y su corrección"></textarea><div class="crit-pauta">${err.g1}</div></div><div class="crit-q-block"><div class="crit-q-label">Error 2 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 2 y su corrección"></textarea><div class="crit-pauta">${err.g2}</div></div><div class="crit-selfscore"><label for="critScore1">Obtenido:</label><input type="number" id="critScore1" class="crit-score-input" data-score="1" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s2);
  const dec=_pickF(critDecisionBank,1,rngC)[0];
  const s3=document.createElement('div');
  s3.innerHTML=`<div class="eval-section-title">III. Toma de decisiones: comprobar antes de afirmar <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${dec}</div><div class="crit-q-block"><div class="crit-q-label">¿Qué opción recomendarías? Explica por qué, relacionándolo con lo que hace cada poder del Estado y con la rendición de cuentas.</div><textarea class="crit-textarea" rows="4" aria-label="Recomendaciones y su justificación"></textarea><div class="crit-pauta">${critDecisionGuide}</div></div><div class="crit-selfscore"><label for="critScore2">Obtenido:</label><input type="number" id="critScore2" class="crit-score-input" data-score="2" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s3);
  const cmp=_pickF(critCompareBank,1,rngC)[0];
  const s4=document.createElement('div');
  s4.innerHTML=`<div class="eval-section-title">IV. Comparación razonada <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-compare-grid"><div class="crit-compare-box"><h5>Caso A</h5>${cmp.a}</div><div class="crit-compare-box"><h5>Caso B</h5>${cmp.b}</div></div><div class="crit-q-block"><div class="crit-q-label">1. ¿Qué cultura, lugar o concepto corresponde a cada caso? 2. ¿Qué característica tiene cada uno? 3. ¿Por qué no son lo mismo?</div><textarea class="crit-textarea" rows="4" aria-label="Comparación razonada de los casos A y B"></textarea><div class="crit-pauta">Caso A: ${cmp.ga} · Caso B: ${cmp.gb} · ${cmp.gr}</div></div><div class="crit-selfscore"><label for="critScore3">Obtenido:</label><input type="number" id="critScore3" class="crit-score-input" data-score="3" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s4);
  const causes=_pickF(critCauseBank,2,rngC),effects=_pickF(critEffectBank,3,rngC);
  let ceRows='';
  causes.forEach((it,i)=>{ceRows+=`<div class="crit-ce-item"><div class="crit-ce-row"><div class="crit-ce-cell crit-ce-given"><span class="crit-ce-tag">Causa</span>${it.cause}</div><div class="crit-ce-cell"><span class="crit-ce-tag">Efecto</span><textarea class="crit-textarea" rows="2" aria-label="Efecto de: ${it.cause}" placeholder="Escribe el efecto..."></textarea></div></div><div class="crit-pauta">${it.guide}</div></div>`;});
  effects.forEach((it,i)=>{ceRows+=`<div class="crit-ce-item"><div class="crit-ce-row"><div class="crit-ce-cell"><span class="crit-ce-tag">Causa</span><textarea class="crit-textarea" rows="2" aria-label="Causa de: ${it.effect}" placeholder="Escribe la causa..."></textarea></div><div class="crit-ce-cell crit-ce-given"><span class="crit-ce-tag">Efecto</span>${it.effect}</div></div><div class="crit-pauta">${it.guide}</div></div>`;});
  const s5=document.createElement('div');
  s5.innerHTML=`<div class="eval-section-title">V. Análisis de causas y efectos <span class="eval-pts">20 pts</span></div><div class="eval-item">${ceRows}<div class="crit-selfscore"><label for="critScore4">Obtenido:</label><input type="number" id="critScore4" class="crit-score-input" data-score="4" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s5);
  window._evalCritData={kase,err,dec,cmp,causes,effects};
  const totalPanel=document.createElement('div');totalPanel.id='evalCritTotalResult';totalPanel.className='crit-total-panel';totalPanel.innerHTML='<strong>🧮 Autoevaluación:</strong> responde cada sección, compara con la <em>Pauta</em> y anota tu puntaje (0–20) en cada casilla. Luego presiona <em>Calcular Total</em>.';out.appendChild(totalPanel);
  fin('s-evaluacion');
}
function toggleEvalCritAns(){evalCritAnsVisible=!evalCritAnsVisible;document.querySelectorAll('#evalCritOut .crit-pauta').forEach(el=>el.style.display=evalCritAnsVisible?'block':'none');sfx('click');}
function calcCritTotal(){
  if(!window._evalCritData){showToast('⚠️ Genera una prueba primero');return;}
  sfx('click');
  let total=0;
  document.querySelectorAll('#evalCritOut .crit-score-input').forEach(inp=>{let v=parseInt(inp.value)||0;v=Math.max(0,Math.min(20,v));inp.value=v;total+=v;});
  const panel=document.getElementById('evalCritTotalResult');
  if(panel){panel.className='crit-total-panel '+(total>=70?'eval-auto-pass':'eval-auto-risk');panel.innerHTML=`<strong>Puntaje total autoevaluado: ${total}/100</strong><br><em>Compara siempre tus respuestas con la Pauta antes de anotar el puntaje de cada sección.</em>`;}
  const formKey='crit_'+(window._currentEvalCritForm||1);
  if(total>=70){if(!xpTracker.wgt.has(formKey)){xpTracker.wgt.add(formKey);pts(8);}showToast('🎯 Pensamiento crítico: '+total+'/100');}
  else showToast('🧮 Puntaje registrado: '+total+'/100. ¡Sigue practicando!');
}
function printEvalCrit(){
  if(!window._evalCritData){showToast('⚠️ Genera una prueba primero');return;}
  sfx('click');
  const forma=window._currentEvalCritForm||1;const d=window._evalCritData;
  const lines=(n)=>Array(n).fill('<div class="ln"></div>').join('');
  let s1=`<div class="sec-title"><span>I. Caso de análisis: el civismo de todos los días</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.kase.txt}</p>`;
  critCaseQuestions.forEach(q=>{s1+=`<p class="crit-print-q">${q}</p>${lines(1)}`;});
  let s2=`<div class="sec-title"><span>II. Corrige el error</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.err.txt}</p><p class="crit-print-q">Identifica dos errores y corrígelos con tus propias palabras:</p><p class="crit-print-q"><strong>Error 1:</strong></p>${lines(1)}<p class="crit-print-q"><strong>Error 2:</strong></p>${lines(1)}`;
  let s3=`<div class="sec-title"><span>III. Toma de decisiones: comprobar antes de afirmar</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.dec}</p><p class="crit-print-q">¿Qué opción recomendarías? Explica por qué, relacionándolo con lo que hace cada poder del Estado y con la rendición de cuentas.</p>${lines(2)}`;
  let s4=`<div class="sec-title"><span>IV. Comparación razonada</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><div class="crit-compare-print-grid"><div class="crit-compare-print-box"><strong>Caso A:</strong> ${d.cmp.a}</div><div class="crit-compare-print-box"><strong>Caso B:</strong> ${d.cmp.b}</div></div><p class="crit-print-q">1. ¿Qué cultura, lugar o concepto corresponde a cada caso? 2. ¿Qué característica tiene cada uno? 3. ¿Por qué no son lo mismo?</p>${lines(2)}`;
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
  const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Pensamiento Crítico La Constitución: mi Ley Fundamental · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.1rem 0.4rem;margin:0.2rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #3f6212;background:#f2f7e6;color:#3f6212;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#3f6212;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #3f6212;height:12px;}.obt-pct{white-space:nowrap;}.crit-print-scenario{font-size:10.5pt;background:#f2f7e6;border-left:3px solid #3f6212;padding:0.2rem 0.5rem;margin:0.1rem 0 0.2rem;line-height:1.3;}.crit-print-q{font-size:10pt;font-weight:600;margin:0.15rem 0 0.08rem;line-height:1.25;}.ln{border-bottom:1px solid #111;min-height:12px;margin-bottom:2px;}.crit-compare-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin:0.15rem 0;}.crit-compare-print-box{font-size:9.5pt;background:#f2f7e6;border-radius:4px;padding:0.25rem 0.4rem;line-height:1.25;}.crit-print-tbl{width:100%;border-collapse:collapse;font-size:9.5pt;margin-top:0.15rem;}.crit-print-tbl th,.crit-print-tbl td{border:1px solid #999;padding:0.3rem 0.45rem;text-align:left;height:30px;vertical-align:middle;}.crit-print-tbl th{background:#f2f7e6;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.08rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.9rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.45rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.1rem;margin-bottom:0.18rem;}.p-crit-line{font-size:11pt;color:#007a00;margin-bottom:0.18rem;line-height:1.35;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.2rem;padding:0.1rem 0;color:#3f6212;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #3f6212;}.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:12.7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="critEvalPage"><div class="ph"><h2>Evaluación Competencial · Pensamiento Crítico · La Constitución: mi Ley Fundamental · Educación Básica · Educación Cívica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 5 secciones de 20 puntos</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100</span></div></div><div class="pauta-wrap" id="critPautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Pensamiento Crítico · La Constitución: mi Ley Fundamental · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 5 secciones × 20 pts c/u — respuesta abierta, usar como guía de corrección</div></div><div class="p-grid">${pR}</div></div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("critEvalPage",250,0.55,1.2);fit("critPautaPage",250,0.55,1.2);})();<\/script></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(doc);win.document.close();setTimeout(()=>win.print(),400);
}

// ===================== LABORATORIO DE LOS SÍMBOLOS =====================
const parteData = (function () {
  /* Se arma desde js/data/constitucion-honduras.js. Escribir aquí los
     artículos otra vez sería abrir la puerta a que la pantalla y el papel
     dejen de decir el mismo NÚMERO, que es la lección del Himno. */
  const esc = x => String(x).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const out = {};
  CONST_ARTICULOS.forEach(a => {
    const cita = a.citaLiteral
      ? '<br><br><em>«' + esc(a.citaLiteral) + '»</em><br><br>Así lo cita, palabra por palabra, la ley que lo invoca.'
      : '<br><br><strong>El texto de este artículo no está en el repositorio.</strong> Lo que sí se sabe es qué artículo es y para qué lo invoca esa ley — el texto hay que buscarlo en la Constitución.';
    out[a.clave] = {
      nombre: a.art, icon: a.emoji,
      estructura: { title: '¿De qué trata?',    info: '<strong>' + esc(a.tema) + '</strong>' + cita },
      funcion:    { title: '¿Para qué se cita?', info: esc(a.paraQue) },
      ubicacion:  { title: '¿Por qué importa?',  info: esc(a.porQueImporta) },
      dato:       { title: 'Dónde se lee',       info: '📚 ' + esc(a.donde) }
    };
  });
  return out;
})();
let labParte='a162',labAspecto='estructura';
function labShowParte(parteKey){labParte=parteKey;updateLabDisplay();document.querySelectorAll('.lab-cont-btn').forEach(b=>b.classList.remove('active-pri'));const btn=document.querySelector(`[data-parte="${parteKey}"]`);if(btn)btn.classList.add('active-pri');if(typeof sfx==='function')sfx('click');}
function labShowAspecto(aspectoKey){labAspecto=aspectoKey;updateLabDisplay();document.querySelectorAll('.lab-asp-btn').forEach(b=>b.classList.remove('active-sec'));const btn=document.querySelector(`[data-aspecto="${aspectoKey}"]`);if(btn)btn.classList.add('active-sec');if(typeof sfx==='function')sfx('click');}
function updateLabDisplay(){const data=parteData[labParte];const asp=data[labAspecto];document.getElementById('lab-sentence').innerHTML=`🔬 Explorando: <strong>${data.nombre}</strong> → <strong>${asp.title}</strong>`;document.getElementById('lab-display').innerHTML=`<div class="lab-cont-header">${data.icon} ${data.nombre}</div><div class="lab-asp-title">${asp.title}</div><div class="lab-asp-info">${asp.info}</div>`;}

// ===================== DIPLOMA =====================
function _diplPct(){return xp>=MXP?100:Math.round((xp/MXP)*100);}
function openDiploma(){sfx('fan');const pct=_diplPct();document.getElementById('diplPct').textContent=pct+'%';document.getElementById('diplBar').style.width=pct+'%';document.getElementById('diplDate').textContent='Fecha: '+new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});const msgs=['¡Sigue aprendiendo!','¡Muy buen trabajo!','¡Vas muy bien!','¡Conoces a los que hicieron Honduras!','¡Guardián de la Patria!'];document.getElementById('diplMsg').textContent=msgs[Math.min(Math.floor(pct/25),4)];const stars=['⭐','⭐⭐','⭐⭐⭐'];document.getElementById('diplStars').textContent=stars[Math.min(Math.floor(pct/40),2)];const achTxt=unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(' · ');document.getElementById('diplAch').textContent=achTxt||'Sigue completando secciones para desbloquear logros';document.getElementById('diplomaOverlay').classList.add('open');launchConfetti();}
function closeDiploma(){document.getElementById('diplomaOverlay').classList.remove('open');}
function updateDiplomaName(v){document.getElementById('diplName').textContent=v||'Estudiante';}
function shareWA(){const name=document.getElementById('diplName').textContent||'Estudiante';const pct=_diplPct();const msg=`🇭🇳 ¡${name} completó la Misión "La Constitución: mi Ley Fundamental"! 🏅 Progreso: ${pct}% · 🌱 policastsapien.com`;_waShare(msg);}
async function captureDiploma(){if(typeof html2canvas==='undefined'){showToast('⚠️ Cargando... intenta de nuevo');return;}sfx('click');const card=document.querySelector('.diploma-card');const btn=document.querySelector('.diploma-actions .btn-pri');const toHide=[card.querySelector('.diploma-input'),card.querySelector('.diploma-actions'),card.querySelector('hr')];if(btn){btn.disabled=true;btn.textContent='⏳ Capturando...';}toHide.forEach(el=>{if(el)el.style.display='none';});let dataUrl='';try{const canvas=await html2canvas(card,{scale:2,useCORS:true,backgroundColor:'#ffffff'});toHide.forEach(el=>{if(el)el.style.display='';});dataUrl=canvas.toDataURL('image/png');const name=(document.getElementById('diplName').textContent||'Estudiante').replace(/\s+/g,'-');const fileName='constancia-'+name+'.png';const cap=window.Capacitor;if(cap&&cap.isNativePlatform&&cap.isNativePlatform()&&cap.Plugins?.Filesystem&&cap.Plugins?.Share){const base64Data=dataUrl.split(',')[1];const result=await cap.Plugins.Filesystem.writeFile({path:fileName,data:base64Data,directory:'CACHE'});await cap.Plugins.Share.share({url:result.uri,dialogTitle:'Guardar / Compartir Constancia'});}else{const a=document.createElement('a');a.href=dataUrl;a.download=fileName;a.click();}}catch(e){toHide.forEach(el=>{if(el)el.style.display='';});if(e.name!=='AbortError')showToast('⚠️ No se pudo guardar la constancia');}finally{if(btn){btn.disabled=false;btn.textContent='📷 Guardar foto';}}}

// ===================== INIT =====================

// ===================== LA CONSTITUCIÓN, EN LA PANTALLA =====================
/* Todo lo de esta misión se PINTA desde js/data/constitucion-honduras.js.
   Aquí lo que se copiaría es un NÚMERO DE ARTÍCULO, que es justo lo que no
   puede decir una cosa en la pantalla y otra en la ficha que se fotocopia:
   el alumno cita el que estudió y el examen le pide el otro.
   De ahí sale también `_dev/verifica-constitucion.js`. */
function _esc(x){return String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

/* Cómo se lee una cita: la destreza de la misión. Se desarma la cita de
   ejemplo en sus tres piezas, que es lo que ningún libro explica. */
function pintarConstComoSeLee(){
  const c=document.getElementById('con-comolee');if(!c)return;
  c.innerHTML=`<h2>📑 Cómo se lee una cita</h2>
    <p>Vas a ver citas así por todas partes. No es un código secreto: son tres piezas, y cada una hace falta.</p>
    <div class="ex-box"><span class="ex-tag ex-d">La cita completa</span><br><span><strong>${_esc(CONST_COMO_SE_LEE.ejemplo)}</strong></span></div>
    <div class="con-piezas">${CONST_COMO_SE_LEE.piezas.map(z=>
      `<div class="con-pieza"><h4>${_esc(z.parte)}</h4><p>${_esc(z.que)}</p></div>`).join('')}</div>
    <div class="tip"><span class="ti">⚠️</span><div>${_esc(CONST_COMO_SE_LEE.aviso)}</div></div>`;
}

function pintarConstMapa(){
  const c=document.getElementById('con-mapa');if(!c)return;
  const tonos=['tc-teal','tc-gold','tc-amber','tc-jade','tc-purple'];
  c.innerHTML=CONST_ARTICULOS.map((a,i)=>
    `<div class="type-chip ${tonos[i%tonos.length]}"><div class="t-art">${a.emoji} ${_esc(a.art)}</div><div class="t-info">${_esc(a.tema)}</div></div>`
  ).join('');
}

/* Cada artículo con su ley y su para qué. El que tiene texto literal lo
   enseña; los demás dicen en voz alta que su texto no está aquí — callarlo
   dejaría creer que el resumen ES el artículo. */
function pintarConstLista(){
  const c=document.getElementById('con-lista');if(!c)return;
  c.innerHTML=CONST_ARTICULOS.map(a=>{
    const cita=a.citaLiteral
      ? `<div class="con-cita">«${_esc(a.citaLiteral)}»<span class="con-cita-pie">Citado palabra por palabra en ${_esc(a.donde)}</span></div>`
      : `<div class="tip"><span class="ti">🔍</span><div>El TEXTO de este artículo no está en el repositorio: hay que buscarlo en la Constitución. Lo que sí se sabe es qué artículo es y para qué lo invoca esta ley.</div></div>`;
    return `<div class="pr-ficha">
      <h3 class="pr-tit">${a.emoji} ${_esc(a.art)} <span class="pr-clase pr-p">${_esc(a.tema)}</span></h3>
      ${cita}
      <p class="pr-sub">Para qué lo cita la ley</p>
      <p class="pr-papel">${_esc(a.paraQue)}</p>
      <p class="pr-porque"><strong>Por qué importa:</strong> ${_esc(a.porQueImporta)}</p>
      <div class="tip"><span class="ti">📚</span><div>${_esc(a.donde)}</div></div>
    </div>`;
  }).join('');
}

function pintarConstApoyan(){
  const c=document.getElementById('con-apoyan');if(!c)return;
  c.innerHTML=`<h2>🔗 ${_esc(CONST_SE_APOYAN.titulo)}</h2>
    <p>${_esc(CONST_SE_APOYAN.texto)}</p>
    <div class="ex-box"><span class="ex-tag ex-d">🧒 Un ejemplo</span><br><span>${_esc(CONST_SE_APOYAN.ejemplo)}</span></div>
    <div class="tip"><span class="ti">📚</span><div>${_esc(CONST_SE_APOYAN.fuente)}</div></div>`;
}

/* ⚠️ Los casos van SIN nombres y SIN acusar a nadie, y el aviso va con
   ellos: un caso que se parece a algo real se habla en clase, no se usa
   para señalar a un vecino delante de treinta compañeros. */
function pintarConstCasos(){
  const c=document.getElementById('con-casos');if(!c)return;
  c.innerHTML=`<h2>⚖️ ${_esc(CONST_CASOS.titulo)}</h2>
    <p>${_esc(CONST_CASOS.intro)}</p>
    ${CONST_CASOS.casos.map((k,i)=>
      `<div class="ex-box"><span class="ex-tag ex-d">Caso ${i+1}</span><br><span>${_esc(k.caso)}</span>
       <div class="tip"><span class="ti">💡</span><div>${_esc(k.pista)}</div></div></div>`).join('')}
    <p class="pr-sub">Los cinco pasos para analizar cualquiera de ellos</p>
    <ol class="con-pasos">${CONST_CASOS.comoSeAnaliza.map(x=>`<li>${_esc(x.replace(/^\d+\.\s*/,''))}</li>`).join('')}</ol>
    <div class="tip"><span class="ti">⚠️</span><div>${_esc(CONST_CASOS.aviso)}</div></div>`;
}

function pintarConstDemocracia(){
  const d=document.getElementById('con-democracia');
  if(d)d.innerHTML=`<h2>🗳️ ${_esc(CONST_DEMOCRACIA.titulo)}</h2>
    <p>${_esc(CONST_DEMOCRACIA.texto)}</p>
    <p>${_esc(CONST_DEMOCRACIA.porEso)}</p>
    <div class="ex-box"><span class="ex-tag ex-d">🏫 En tu escuela</span><br><span>${_esc(CONST_DEMOCRACIA.enTuEscuela)}</span></div>
    <div class="tip"><span class="ti">📚</span><div>${_esc(CONST_DEMOCRACIA.fuente)}</div></div>`;
  const i=document.getElementById('con-investiga');
  if(i)i.innerHTML=`<h2>🔍 ${_esc(CONST_INVESTIGA.titulo)}</h2>
    <p>${_esc(CONST_INVESTIGA.intro)}</p>
    ${CONST_INVESTIGA.preguntas.map(q=>
      `<div class="ex-box"><span class="ex-tag ex-d">✍️ ${_esc(q.q)}</span><br><span>${_esc(q.luego)}</span></div>`).join('')}
    <div class="tip"><span class="ti">📚</span><div>${_esc(CONST_INVESTIGA.nota)}</div></div>`;
}

window.addEventListener('DOMContentLoaded',()=>{
  initTheme();
  loadProgress();
  pintarConstComoSeLee();
  pintarConstMapa();
  pintarConstLista();
  pintarConstApoyan();
  pintarConstCasos();
  pintarConstDemocracia();
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
  document.querySelector('[data-parte="lempira"]')?.classList.add('active-pri');
  document.querySelector('[data-aspecto="estructura"]')?.classList.add('active-sec');
  renderAchPanel();
});

(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalCrit==='function') _injectFormaSel('genEvalCrit','evalCritFormaSel',evalCritFormNum,function(v){evalCritFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();
