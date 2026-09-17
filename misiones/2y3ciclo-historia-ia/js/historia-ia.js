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
const SAVE_KEY='historia_ia_v1';
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
  primer_quiz:{icon:'🏅',label:'Primer quiz de la historia superado'},
  flash_master:{icon:'🃏',label:'Se sabe los quince hitos'},
  clasif_pro:{icon:'🗂️',label:'Distingue las cuatro edades de la IA'},
  id_master:{icon:'🔍',label:'Reconoce el dato dentro de la oración'},
  reto_hero:{icon:'🏆',label:'Campeón del reto de la línea del tiempo'},
  nivel3:{icon:'🎖️',label:'¡Buena memoria! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡Sabe la historia! Nivel 6'},
  widgets_master:{icon:'🧩',label:'Widgets de la historia dominados'},
  cronista:{icon:'📜',label:'Ordenó la línea del tiempo completa, de 1936 a hoy'},
  cronista_hoy:{icon:'✍️',label:'Escribió el hito de su propio año, con su fuente'}
};
function unlockAchievement(id){if(unlockedAch.includes(id))return;unlockedAch.push(id);sfx('ach');showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label);launchConfetti();renderAchPanel();saveProgress();}
function renderAchPanel(){const list=document.getElementById('achList');list.innerHTML='';Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{const div=document.createElement('div');div.className='ach-item'+(unlockedAch.includes(id)?'':' locked');div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`;list.appendChild(div);});}
function toggleAchPanel(){sfx('click');document.getElementById('achPanel').classList.toggle('open');}
function showToast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}t.textContent=msg;t.style.display='block';clearTimeout(t._tid);t._tid=setTimeout(()=>t.style.display='none',3200);}
function launchConfetti(){const colors=['#86198f','#e879f9','#4338ca','#f59e0b','#c026d3'];for(let i=0;i<60;i++){const c=document.createElement('div');c.className='confetti-piece';c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`;document.body.appendChild(c);c.addEventListener('animationend',()=>c.remove());}}

// ===================== XP =====================
const lvls=[{t:0,n:'Aprendiz 🌱'},{t:25,n:'Curioso 🔎'},{t:55,n:'Conoce a Turing 📐'},{t:90,n:'Sabe qué fue Dartmouth 🏷️'},{t:130,n:'Entiende los inviernos ❄️'},{t:165,n:'Sigue la línea del tiempo 📜'},{t:190,n:'Cronista de la IA 🏆'}];
function pts(n){xp=Math.max(0,Math.min(MXP,xp+n));updateXPBar();saveProgress();}
function updateXPBar(){const pct=Math.round((xp/MXP)*100);document.getElementById('xpFill').style.width=pct+'%';const el=document.getElementById('xpPts');el.textContent='⭐ '+xp;el.style.transform='scale(1.3)';setTimeout(()=>el.style.transform='',300);let lv=0;for(let i=0;i<lvls.length;i++)if(xp>=lvls[i].t)lv=i;document.getElementById('xpLvl').textContent=lvls[lv].n;if(lv!==prevLevel){if(lv>=2)unlockAchievement('nivel3');if(lv>=5)unlockAchievement('nivel5');prevLevel=lv;}}
function resetXP(){sfx('click');xp=0;updateXPBar();showToast('🔄 XP reiniciado a 0');}
function fin(id,showFX=true){if(!done.has(id)){done.add(id);const b=document.querySelector(`[data-s="${id}"]`);if(b)b.classList.add('done');if(showFX){sfx('up');launchConfetti();}saveProgress();}}
function getProgress(){return Math.round((done.size/TOTAL_SECTIONS)*100);}

// ===================== NAV =====================
function go(id){sfx('click');document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});document.getElementById(id).classList.add('active');const btn=document.querySelector(`[data-s="${id}"]`);if(btn){btn.classList.add('active');btn.setAttribute('aria-selected','true');}window.scrollTo({top:0,behavior:'smooth'});if(id==='s-sopa'){setTimeout(buildSopa,50);}if(id==='s-widgets'){setTimeout(buildRoute,50);}}

// ===================== FLASHCARD DATA =====================
const fcData = (function () {
  /* De js/data/ia-historia.js, que es el ÚNICO sitio donde viven las fechas.
     Aquí se copian fechas, y una fecha equivocada no se nota: se pinta igual de
     bien y el alumno la escribe en el examen. Por eso la misión no las escribe:
     las pinta, y la sonda compara este archivo contra la ficha impresa. */
  const f = [];
  IA_HITOS.forEach(h => {
    f.push({ w: h.emoji + ' ' + h.anio + '<br><small>' + h.titulo + '</small>', a: '<strong>' + h.quien + '</strong><br><br>' + h.que });
  });
  IA_EPOCAS.forEach(e => {
    f.push({ w: e.emoji + ' ' + e.nombre + '<br><small>(' + e.rango + ')</small>', a: e.resumen });
  });
  IA_TRES_PATAS.forEach(p => {
    f.push({ w: p.emoji + ' ' + p.pata + '<br><small>una de las tres patas</small>', a: '<strong>' + p.que + '</strong><br><br>' + p.antes });
  });
  f.push({ w: '❄️ ¿Qué enseñan los dos inviernos?', a: IA_LECCION_INVIERNOS.texto });
  return f;
})();
let fcIdx=0;
function upFC(){document.getElementById('fcInner').classList.remove('flipped');document.getElementById('fcW').innerHTML=fcData[fcIdx].w;document.getElementById('fcA').innerHTML=fcData[fcIdx].a;document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length;}
function flipCard(){sfx('flip');document.getElementById('fcInner').classList.toggle('flipped');if(!xpTracker.fc.has(fcIdx)){xpTracker.fc.add(fcIdx);pts(1);}if(xpTracker.fc.size===fcData.length){fin('s-flash');unlockAchievement('flash_master');}}
function nextFC(){sfx('click');fcIdx=(fcIdx+1)%fcData.length;upFC();}
function prevFC(){sfx('click');fcIdx=(fcIdx-1+fcData.length)%fcData.length;upFC();}

// ===================== QUIZ DATA =====================
const qzData=[
  {q:'¿Quién preguntó en 1950 si las máquinas podían pensar?',o:['John McCarthy','Joseph Weizenbaum','Arthur Samuel','Alan Turing'],c:3,
   e:'En el artículo «Computing Machinery and Intelligence», revista Mind.'},
  {q:'¿En qué año y dónde nació el nombre «Inteligencia Artificial»?',o:['En 1950, en Londres','En 1956, en el taller de Dartmouth','En 1997, en Nueva York','En 2022, en internet'],c:1,
   e:'Aparece escrito por primera vez en la propuesta de ese taller.'},
  {q:'ELIZA, de 1966, conversaba con la gente. ¿Qué enseñó?',o:['Que las máquinas ya entendían en 1966','Que algo puede contestar como una persona sin entender nada','Que los chats son un invento reciente','Que las máquinas sienten'],c:1,
   e:'Su autor se asustó: la gente le contaba cosas íntimas.'},
  {q:'¿Por qué hubo dos «inviernos» de la IA?',o:['Se prometió de más y se cortó el dinero','Se acabó la electricidad','Se prohibió investigar','Se perdieron los programas'],c:0,
   e:'No falló la técnica: falló la promesa, y con ella la confianza.'},
  {q:'¿Qué pasó en 1997 con Deep Blue y Garri Kaspárov?',o:['Kaspárov le ganó a la máquina','Empataron todas las partidas','Una máquina ganó al campeón mundial de ajedrez','La partida se suspendió'],c:2,
   e:'No aprendía: calculaba muchísimas jugadas por segundo.'},
  {q:'2012: las máquinas «aprendieron a ver». ¿Qué pasó?',o:['Se inventó la cámara digital','Se abrió el primer chat','Se conectó el primer teléfono','Una red profunda ganó el concurso de imágenes'],c:3,
   e:'Con tarjetas gráficas y un millón de fotos etiquetadas.'},
  {q:'¿Qué hace distinto a AlphaGo, de 2016?',o:['Calculaba todas las jugadas posibles','Aprendió jugando millones de partidas contra sí mismo','Copiaba las partidas de los campeones','Le preguntaba a un experto'],c:1,
   e:'El Go tiene demasiadas jugadas para calcularlas: es aprendizaje por refuerzo.'},
  {q:'¿De qué año es la pieza técnica de los chats de hoy?',o:['De 1956','De 1997','De 2017','De 2022'],c:2,
   e:'Se llama transformador. El público lo vio cinco años después.'},
  {q:'¿Qué tres cosas tuvieron que juntarse?',o:['Datos, cómputo y algoritmos','Dinero, publicidad y suerte','Robots, sensores y motores','Internet, teléfonos y satélites'],c:0,
   e:'Faltando una, no pasa: por eso tardó setenta años.'},
  {q:'¿Qué cambió en noviembre de 2022?',o:['Se inventó la Inteligencia Artificial','Se construyó la primera computadora','Se ganó el primer campeonato de ajedrez','Un chat de IA generativa se abrió al público'],c:3,
   e:'La idea era de 2017. Lo nuevo fue que llegó a cualquiera.'}
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
  {label:['Pasó ANTES del nombre','Pasó DESPUÉS de 1956'],headA:'🌱 Antes de 1956',headB:'🎉 De 1956 en adelante',colA:'antes',colB:'desp',
   words:[{w:'Turing describe la máquina universal',t:'antes'},{w:'Nace el nombre en Dartmouth',t:'desp'},{w:'La primera neurona de papel',t:'antes'},{w:'ELIZA conversa con la gente',t:'desp'},{w:'«¿Pueden pensar las máquinas?»',t:'antes'},{w:'El perceptrón de Rosenblatt',t:'desp'},{w:'Un programa de damas gana a su autor',t:'desp'},{w:'Deep Blue gana al campeón de ajedrez',t:'desp'}]},
  {label:['Fue un ÉXITO','Fue un FRACASO'],headA:'🚀 Éxito',headB:'❄️ Fracaso',colA:'exito',colB:'fracaso',
   words:[{w:'Deep Blue gana al ajedrez en 1997',t:'exito'},{w:'El primer invierno de los años setenta',t:'fracaso'},{w:'Una red gana el concurso de imágenes',t:'exito'},{w:'La caída de los sistemas expertos',t:'fracaso'},{w:'AlphaGo gana al Go en 2016',t:'exito'},{w:'Se prometió traducción automática y no llegó',t:'fracaso'},{w:'El artículo del transformador en 2017',t:'exito'},{w:'Se cortó el dinero y cerraron laboratorios',t:'fracaso'}]},
  {label:['Es una de las tres patas','No es una de las tres patas'],headA:'🏗️ Una de las tres',headB:'🚫 No es una',colA:'pata',colB:'no',
   words:[{w:'Datos',t:'pata'},{w:'Cómputo',t:'pata'},{w:'Algoritmos',t:'pata'},{w:'Publicidad',t:'no'},{w:'Millones de fotos etiquetadas',t:'pata'},{w:'Las tarjetas gráficas',t:'pata'},{w:'La suerte',t:'no'},{w:'El precio de los teléfonos',t:'no'}]}
];
let currentClassGroupIdx=0,clsSelectedWord=null;
function buildClass(){const group=classGroups[currentClassGroupIdx];document.getElementById('col-left-head').textContent=group.headA;document.getElementById('col-right-head').textContent=group.headB;const bank=document.getElementById('clsBank');bank.innerHTML='';clsSelectedWord=null;document.getElementById('items-left').innerHTML='';document.getElementById('items-right').innerHTML='';_shuffle([...group.words]).forEach(w=>{const el=document.createElement('div');el.className='wb-item';el.textContent=w.w;el.dataset.t=w.t;el.onclick=()=>{document.querySelectorAll('.wb-item').forEach(i=>i.classList.remove('sel-word'));el.classList.add('sel-word');clsSelectedWord=el;sfx('click');};bank.appendChild(el);});['col-left','col-right'].forEach(colId=>{const col=document.getElementById(colId);col.onclick=(e)=>{if(!clsSelectedWord||e.target.classList.contains('drop-item'))return;const targetId=colId==='col-left'?'items-left':'items-right';const wordsCol=document.getElementById(targetId);const item=document.createElement('div');item.className='drop-item';item.textContent=clsSelectedWord.textContent;item.dataset.t=clsSelectedWord.dataset.t;const original=clsSelectedWord;item.onclick=(ev)=>{ev.stopPropagation();if(clsSelectedWord!==null){col.click();}else{document.getElementById('clsBank').appendChild(original);original.classList.remove('sel-word');item.remove();if(typeof sfx==='function')sfx('click');}};wordsCol.appendChild(item);clsSelectedWord.remove();clsSelectedWord=null;sfx('click');};});}
function checkClass(){const remaining=document.querySelectorAll('#clsBank .wb-item').length;if(remaining>0){fb('fbCls','Mueve todas las palabras a las columnas primero.',false);return;}const group=classGroups[currentClassGroupIdx];let allOk=true;document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{const inLeft=el.parentElement.id==='items-left';const expectedType=inLeft?group.colA:group.colB;if(el.dataset.t===expectedType){el.classList.add('cls-ok');}else{el.classList.add('cls-no');allOk=false;}});if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);}if(allOk){fb('fbCls','¡Perfecto! +5 XP',true);sfx('fan');fin('s-clasifica');unlockAchievement('clasif_pro');}else{fb('fbCls','Hay errores. Los errados llevan ✗.',false);sfx('no');}}
function nextClassGroup(){sfx('click');currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length;buildClass();document.getElementById('fbCls').classList.remove('show');showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]);}
function resetClass(){sfx('click');buildClass();document.getElementById('fbCls').classList.remove('show');}

// ===================== IDENTIFICAR =====================
const idData=[
  {s:['En','1956','el','campo','estrenó','su','nombre.'],c:1,art:'El año en que nació el nombre del campo'},
  {s:['Alan','Turing','preguntó','si','las','máquinas','podían','pensar.'],c:1,art:'El apellido de quien preguntó en 1950'},
  {s:['ELIZA','contestaba','sin','entender','absolutamente','nada.'],c:0,art:'El programa que conversaba en 1966'},
  {s:['Los','dos','inviernos','llegaron','por','prometer','de','más.'],c:2,art:'Los dos períodos en que el campo casi se para'},
  {s:['Deep','Blue','ganó','al','campeón','mundial','de','ajedrez.'],c:7,art:'El juego que ganó una máquina en 1997'},
  {s:['En','2012','una','red','aprendió','a','ver','imágenes.'],c:7,art:'Lo que aprendieron a reconocer ese año'},
  {s:['AlphaGo','aprendió','jugando','contra','sí','mismo.'],c:0,art:'El programa que ganó al Go'},
  {s:['Hicieron','falta','datos,','cómputo','y','algoritmos.'],c:3,art:'La pata de las tarjetas gráficas'}
];
let idIdx=0,idDone=false;
function showId(){idDone=false;if(idIdx>=idData.length){document.getElementById('idSent').innerHTML='🎉 ¡Completado!';fin('s-identifica');unlockAchievement('id_master');return;}const d=idData[idIdx];document.getElementById('idProg').textContent=`Oración ${idIdx+1} de ${idData.length}`;document.getElementById('idInfo').textContent=`Busca: ${d.art}`;const sent=document.getElementById('idSent');sent.innerHTML='';d.s.forEach((w,i)=>{const span=document.createElement('span');span.className='id-word';span.textContent=w+' ';span.onclick=()=>checkId(i,span);sent.appendChild(span);});}
function checkId(i,span){if(idDone)return;document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected'));span.classList.add('selected');if(i===idData[idIdx].c){idDone=true;span.classList.add('id-ok');fb('fbId','¡Correcto! +5 XP',true);if(!xpTracker.id.has(idIdx)){xpTracker.id.add(idIdx);pts(5);}sfx('ok');}else{span.classList.add('id-no');fb('fbId','Ese no es el término solicitado.',false);sfx('no');}}
function nextId(){sfx('click');idIdx++;showId();document.getElementById('fbId').classList.remove('show');}
function resetId(){sfx('click');idIdx=0;showId();document.getElementById('fbId').classList.remove('show');}

// ===================== COMPLETA =====================
const cmpData=[
  {s:'En 1950 Alan Turing preguntó si las máquinas podían ___.',opts:['correr','contar','pensar'],c:2},
  {s:'El nombre del campo nació en el taller de ___.',opts:['Londres','Dartmouth','Praga'],c:1},
  {s:'El programa de 1966 que conversaba se llamaba ___.',opts:['ELIZA','ALICIA','SOFÍA'],c:0},
  {s:'Los dos períodos en que el campo casi se para se llaman los dos ___.',opts:['veranos','otoños','inviernos'],c:2},
  {s:'En 1997 Deep Blue ganó al campeón mundial de ___.',opts:['damas','ajedrez','Go'],c:1},
  {s:'En 2012 las máquinas aprendieron a reconocer ___.',opts:['imágenes','olores','sabores'],c:0},
  {s:'Las tres patas son datos, algoritmos y ___.',opts:['dinero','suerte','cómputo'],c:2},
  {s:'La pieza técnica de 2017 se llama ___.',opts:['perceptrón','transformador','buscador'],c:1}
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
  { label: 'Ordena: lo más antiguo arriba',
    steps: IA_HITOS.slice(0, 6).map(h => h.anio + ' · ' + h.titulo) },
  { label: 'Ordena la explosión: de 1997 hasta hoy',
    steps: IA_HITOS.slice(9).map(h => h.anio + ' · ' + h.titulo) }
];
let currentRouteIdx=0,routeItems=[];
function buildRoute(){routeItems=_shuffle([...routeSets[currentRouteIdx].steps]);renderRoute();const fbEl=document.getElementById('fbRoute');if(fbEl)fbEl.classList.remove('show');}
function renderRoute(){const list=document.getElementById('routeList');if(!list)return;list.innerHTML='';routeItems.forEach((step,i)=>{const div=document.createElement('div');div.className='sort-item';div.innerHTML=`<div class="sort-arrows"><button class="sort-arrow" onclick="routeMove(${i},-1)"${i===0?' disabled':''}>▲</button><button class="sort-arrow" onclick="routeMove(${i},1)"${i===routeItems.length-1?' disabled':''}>▼</button></div><div class="sort-step-num">${i+1}.</div><div class="sort-item-txt">${step}</div>`;list.appendChild(div);});}
function routeMove(idx,dir){sfx('click');const ni=idx+dir;if(ni<0||ni>=routeItems.length)return;[routeItems[idx],routeItems[ni]]=[routeItems[ni],routeItems[idx]];renderRoute();}
function checkRoute(){const correct=routeSets[currentRouteIdx].steps;const isOk=routeItems.every((s,i)=>s===correct[i]);if(isOk){fb('fbRoute','¡Perfecto! Orden correcto. +4 XP',true);if(!xpTracker.wgt.has('route_'+currentRouteIdx)){xpTracker.wgt.add('route_'+currentRouteIdx);pts(4);}sfx('fan');fin('s-widgets');unlockAchievement('widgets_master');}else{fb('fbRoute','Hay pasos fuera de orden. Revisa el arreglo.',false);sfx('no');}}
function nextRoute(){sfx('click');currentRouteIdx=(currentRouteIdx+1)%routeSets.length;buildRoute();showToast('🔄 Secuencia: '+routeSets[currentRouteIdx].label);}

// Widget 2: Identifica el concepto
const neuronPartes = (function () {
  /* Del hito a su año, y del año a su hito. Son los dos sentidos en que el
     examen lo pregunta, y salen los dos del mismo archivo de datos. */
  const anios = [...new Set(IA_HITOS.map(h => h.anio))];
  return IA_HITOS.filter(h => /^\d{4}$/.test(h.anio)).map(h => ({
    desc: h.titulo + '. ' + h.que.split('.')[0] + '.',
    ans: h.anio,
    opts: anios.slice()
  }));
})();
let neuronIdx=0,neuronDone=false;
function showNeuron(){neuronDone=false;if(neuronIdx>=neuronPartes.length){const el=document.getElementById('neuronDesc');if(el)el.textContent='🎉 ¡Ya reconoces a cada uno por lo que hizo!';const opts=document.getElementById('neuronOpts');if(opts)opts.innerHTML='';fin('s-widgets');return;}const d=neuronPartes[neuronIdx];const prog=document.getElementById('neuronProg');if(prog)prog.textContent=`Pista ${neuronIdx+1} de ${neuronPartes.length}`;const desc=document.getElementById('neuronDesc');if(desc)desc.textContent=d.desc;const opts=document.getElementById('neuronOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=opt;b.onclick=()=>checkNeuron(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuron');if(fbEl)fbEl.classList.remove('show');}
function checkNeuron(opt,btn,d){if(neuronDone)return;neuronDone=true;document.querySelectorAll('#neuronOpts .cmp-opt').forEach(b=>{if(b.textContent===d.ans)b.classList.add('correct');else if(b===btn&&b.textContent!==d.ans)b.classList.add('wrong');});const isOk=opt===d.ans;if(isOk){fb('fbNeuron','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuron_'+neuronIdx)){xpTracker.wgt.add('neuron_'+neuronIdx);pts(3);}sfx('ok');}else{fb('fbNeuron','La respuesta correcta es: '+d.ans,false);sfx('no');}}
function nextNeuron(){sfx('click');neuronIdx++;showNeuron();}
function resetNeuron(){sfx('click');neuronIdx=0;showNeuron();}

// Widget 3: Concepto → Significado
const neuroPairs = (function () {
  const epocas = IA_EPOCAS.map(e => e.nombre);
  return IA_HITOS.filter((h, i) => i % 2 === 0).map(h => ({
    trans: h.emoji + ' ' + h.anio + ' · ' + h.titulo,
    func: IA_EPOCAS.find(e => e.clave === h.epoca).nombre,
    opts: epocas.slice()
  }));
})();
let neuroIdx=0,neuroDone=false;
function showNeuro(){neuroDone=false;if(neuroIdx>=neuroPairs.length){const el=document.getElementById('neuroTrans');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('neuroOpts');if(opts)opts.innerHTML='';return;}const d=neuroPairs[neuroIdx];const prog=document.getElementById('neuroProg');if(prog)prog.textContent=`${neuroIdx+1} de ${neuroPairs.length}`;const trans=document.getElementById('neuroTrans');if(trans)trans.textContent=d.trans;const opts=document.getElementById('neuroOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkNeuro(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuro');if(fbEl)fbEl.classList.remove('show');}
function checkNeuro(opt,btn,d){if(neuroDone)return;neuroDone=true;document.querySelectorAll('#neuroOpts .qz-opt').forEach(b=>{if(b.textContent===d.func)b.classList.add('correct');else if(b===btn&&b.textContent!==d.func)b.classList.add('wrong');});const isOk=opt===d.func;if(isOk){fb('fbNeuro','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuro_'+neuroIdx)){xpTracker.wgt.add('neuro_'+neuroIdx);pts(3);}sfx('ok');}else{fb('fbNeuro','Correcto: '+d.func,false);sfx('no');}setTimeout(()=>{neuroIdx++;showNeuro();},1800);}
function resetNeuro(){sfx('click');neuroIdx=0;showNeuro();}

// Widget 4: Fuente → ¿Renovable o no renovable?
const enfermedadData = (function () {
  /* Quién hizo qué. Se arma del archivo de datos, así que el día que entre un
     hito nuevo esta actividad lo trae sola y no hay que acordarse de nada. */
  const conNombre = IA_HITOS.filter(h => !/^(Todo el campo|La industria|El público|La industria entera)$/.test(h.quien));
  const quienes = [...new Set(conNombre.map(h => h.quien))];
  return conNombre.map(h => ({
    disease: h.titulo,
    characteristic: h.quien,
    opts: [h.quien].concat(quienes.filter(q => q !== h.quien).slice(0, 2))
  }));
})();
let enferIdx=0,enferDone=false;
function showEnfer(){enferDone=false;if(enferIdx>=enfermedadData.length){const el=document.getElementById('enferDisease');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('enferOpts');if(opts)opts.innerHTML='';return;}const d=enfermedadData[enferIdx];const prog=document.getElementById('enferProg');if(prog)prog.textContent=`${enferIdx+1} de ${enfermedadData.length}`;const dis=document.getElementById('enferDisease');if(dis)dis.textContent=d.disease;const opts=document.getElementById('enferOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkEnfer(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbEnfer');if(fbEl)fbEl.classList.remove('show');}
function checkEnfer(opt,btn,d){if(enferDone)return;enferDone=true;document.querySelectorAll('#enferOpts .qz-opt').forEach(b=>{if(b.textContent===d.characteristic)b.classList.add('correct');else if(b===btn&&b.textContent!==d.characteristic)b.classList.add('wrong');});const isOk=opt===d.characteristic;if(isOk){fb('fbEnfer','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('enfer_'+enferIdx)){xpTracker.wgt.add('enfer_'+enferIdx);pts(3);}sfx('ok');}else{fb('fbEnfer','Correcto: '+d.characteristic,false);sfx('no');}setTimeout(()=>{enferIdx++;showEnfer();},1800);}
function resetEnfer(){sfx('click');enferIdx=0;showEnfer();}

// ===================== RETO FINAL =====================
const retoPairs=[
  {label:['Pasó ANTES del nombre','Pasó DESPUÉS de 1956'],btnA:'🌱 Antes de 1956',btnB:'🎉 De 1956 en adelante',colA:'antes',colB:'desp',
   words:[{w:'Turing describe la máquina universal',t:'antes'},{w:'Nace el nombre en Dartmouth',t:'desp'},{w:'La primera neurona de papel',t:'antes'},{w:'ELIZA conversa con la gente',t:'desp'},{w:'«¿Pueden pensar las máquinas?»',t:'antes'},{w:'El perceptrón de Rosenblatt',t:'desp'},{w:'Un programa de damas gana a su autor',t:'desp'},{w:'Deep Blue gana al campeón de ajedrez',t:'desp'},{w:'AlphaGo gana al Go',t:'desp'},{w:'El artículo del transformador',t:'desp'}]},
  {label:['Fue un ÉXITO','Fue un FRACASO'],btnA:'🚀 Éxito',btnB:'❄️ Fracaso',colA:'exito',colB:'fracaso',
   words:[{w:'Deep Blue gana al ajedrez en 1997',t:'exito'},{w:'El primer invierno de los años setenta',t:'fracaso'},{w:'Una red gana el concurso de imágenes',t:'exito'},{w:'La caída de los sistemas expertos',t:'fracaso'},{w:'AlphaGo gana al Go en 2016',t:'exito'},{w:'Se prometió traducción automática y no llegó',t:'fracaso'},{w:'El artículo del transformador en 2017',t:'exito'},{w:'Se cortó el dinero y cerraron laboratorios',t:'fracaso'},{w:'Los chats llegan al público en 2022',t:'exito'},{w:'Mantener miles de reglas salía carísimo',t:'fracaso'}]},
  {label:['Es una de las tres patas','No es una de las tres patas'],btnA:'🏗️ Una de las tres',btnB:'🚫 No es una',colA:'pata',colB:'no',
   words:[{w:'Datos',t:'pata'},{w:'Cómputo',t:'pata'},{w:'Algoritmos',t:'pata'},{w:'Publicidad',t:'no'},{w:'Millones de fotos etiquetadas',t:'pata'},{w:'Las tarjetas gráficas',t:'pata'},{w:'La suerte',t:'no'},{w:'El precio de los teléfonos',t:'no'},{w:'Maneras nuevas de entrenar redes',t:'pata'},{w:'El nombre de la empresa',t:'no'}]}
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
  {s:'En 1956 el campo estrenó el nombre que lleva hoy.',type:'1956'},
  {s:'Alan Turing preguntó en 1950 si las máquinas podían pensar.',type:'Alan Turing'},
  {s:'ELIZA conversaba en 1966 sin entender nada.',type:'ELIZA'},
  {s:'Los dos inviernos llegaron por prometer de más.',type:'inviernos'},
  {s:'Deep Blue ganó el enfrentamiento de ajedrez en 1997.',type:'Deep Blue'},
  {s:'En 2012 una red profunda aprendió a reconocer imágenes.',type:'2012'},
  {s:'AlphaGo aprendió jugando millones de partidas contra sí mismo.',type:'AlphaGo'},
  {s:'Hicieron falta datos, cómputo y algoritmos, las tres a la vez.',type:'tres a la vez'},
  {s:'El transformador es la pieza de 2017 de los chats de hoy.',type:'transformador'},
  {s:'El perceptrón de 1958 fue la primera máquina que aprendió sola.',type:'perceptrón'}
];
const classifyTaskDB=[
  {w:'1950 · La pregunta de Turing',gen:'¿Pueden pensar las máquinas?',n:'Propone el juego de imitación',g:'Es el acta de nacimiento de la idea',t:''},
  {w:'1956 · Dartmouth',gen:'Nace el nombre del campo',n:'Un taller de verano',g:'Un campo sin nombre no existe',t:''},
  {w:'1966 · ELIZA',gen:'Un programa que conversaba',n:'Devuelve en pregunta lo que le dicen',g:'Contestar no es entender',t:''},
  {w:'Los inviernos',gen:'Dos períodos en que el campo casi se para',n:'Años setenta y finales de los ochenta',g:'Prometer de más cuesta la confianza',t:''},
  {w:'1997 · Deep Blue',gen:'Una máquina gana al campeón de ajedrez',n:'Calculaba, no aprendía',g:'Se puede ganar sin entender nada',t:''},
  {w:'2012 · Las imágenes',gen:'Las máquinas aprenden a ver',n:'Un millón de fotos y tarjetas gráficas',g:'Arranca el aprendizaje profundo',t:''},
  {w:'2017 · El transformador',gen:'La pieza técnica de los chats de hoy',n:'Un artículo de investigación',g:'Separa el antes del después',t:''}
];
const completeTaskDB=[
  {s:'En 1950 Alan Turing preguntó si las máquinas podían ___.',ans:'pensar'},
  {s:'El nombre del campo nació en el taller de ___ en 1956.',ans:'Dartmouth'},
  {s:'El programa que conversaba en 1966 se llamaba ___.',ans:'ELIZA'},
  {s:'Los dos períodos en que el campo casi se para son los dos ___.',ans:'inviernos'},
  {s:'En 1997 una máquina ganó al campeón mundial de ___.',ans:'ajedrez'},
  {s:'En 2012 las máquinas aprendieron a reconocer ___.',ans:'imágenes'},
  {s:'En 2016 AlphaGo ganó al juego del ___.',ans:'Go'},
  {s:'La pieza técnica de 2017 se llama ___.',ans:'transformador'},
  {s:'Las tres patas son datos, cómputo y ___.',ans:'algoritmos'}
];
const explainQuestions=[
  {q:'¿Por qué se dice que la Inteligencia Artificial no nació en 2022?',ans:'Empezó mucho antes. En 1950 Turing preguntó si una máquina podía pensar. En 1956 el campo estrenó nombre. En 2022 solo llegó a todos.'},
  {q:'Explica qué fueron los dos inviernos de la IA y qué enseñan.',ans:'Dos períodos en que el campo casi se para: los setenta y el final de los ochenta. Se prometió de más y se cortó el dinero.'},
  {q:'¿Qué tres cosas tuvieron que juntarse para que la IA se acelerara?',ans:'Datos: millones de fotos etiquetadas por personas. Cómputo: las tarjetas gráficas de los videojuegos. Algoritmos: maneras nuevas de entrenar. Faltando una, no pasa.'},
  {q:'¿Qué enseñó ELIZA en 1966 que sigue valiendo hoy?',ans:'Que algo puede contestar como una persona sin entender nada. Y la gente le contaba cosas íntimas.'},
  {q:'¿En qué se diferencian Deep Blue (1997) y AlphaGo (2016)?',ans:'Deep Blue calculaba, pero no aprendía. En el Go hay demasiadas jugadas: AlphaGo aprendió jugando contra sí mismo, premiándose al ganar.'},
  {q:'¿Por qué 2012 se llama «el año en que las máquinas aprendieron a ver»?',ans:'Ese año una red profunda ganó el concurso de imágenes. Ahí se vio la receta: fotos etiquetadas, tarjetas gráficas y buen algoritmo.'},
  {q:'¿Qué relación hay entre el artículo de 2017 y el chat de hoy?',ans:'Todos los chats de hoy salen de esa pieza: el transformador. El público lo vio cinco años después.'},
  {q:'La historia se cuenta con nombres. ¿Por qué mirar quién NO aparece?',ans:'Respuesta abierta. La lista es de unos pocos países. Quien no está en los datos no está en los resultados.'},
  {q:'Hoy se promete mucho otra vez. Sabiendo lo de los inviernos, ¿cómo lo escuchas?',ans:'Respuesta abierta. Que no crea todo ni se burle de todo. Que pregunte qué se promete, para cuándo, quién lo dice y qué gana.'}
];
let ansVisible=false;
function genTask(){sfx('click');const type=document.getElementById('tgType').value;const count=parseInt(document.getElementById('tgCount').value);ansVisible=false;const out=document.getElementById('tgOut');out.innerHTML='';if(type==='identify')genIdentifyTask(out,count);else if(type==='classify')genClassifyTask(out,count);else if(type==='complete')genCompleteTask(out,count);else if(type==='explain')genExplainTask(out,count);fin('s-tareas');}
function _instrBlock(out,title,lines){const ib=document.createElement('div');ib.className='tg-instruction-block';ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join('');out.appendChild(ib);}
function genIdentifyTask(out,count){_instrBlock(out,'Instrucción',['Copia en tu cuaderno. Subraya el dato que se pide. Anota a qué hito pertenece.','<strong>Ejemplo:</strong> En 1956 el campo estrenó el nombre que lleva hoy. → <span style="color:var(--jade);font-weight:700;">1956</span>']);_pick(identifyTaskDB,Math.min(count,identifyTaskDB.length)).forEach((item,i)=>{const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.type}</div></div>`;out.appendChild(div);});}
function genClassifyTask(out,count){_instrBlock(out,'Instrucción',['Copia la tabla. De cada hito: el año, qué pasó, por qué importa y qué lo acredita.']);const items=_pick(classifyTaskDB,Math.min(count,classifyTaskDB.length));const wrap=document.createElement('div');wrap.style.overflowX='auto';const th=(t,extra='')=>`<th style="padding:0.3rem 0.4rem;border:1px solid var(--border);font-size:0.72rem;text-align:center;${extra}">${t}</th>`;let html=`<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:520px;"><thead><tr style="background:var(--pri-gl);">${th('Hito','text-align:left;')}${th('Año')}${th('¿Qué pasó?')}${th('¿Por qué importa?')}${th('¿Qué lo acredita?')}</tr></thead><tbody>`;items.forEach(it=>{html+=`<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td>`+Array(4).fill(`<td style="padding:0.4rem;border:1px solid var(--border);min-width:50px;"></td>`).join('')+'</tr>';});html+='</tbody></table>';wrap.innerHTML=html;out.appendChild(wrap);const ans=document.createElement('div');ans.className='tg-answer';ans.style.marginTop='0.8rem';ans.innerHTML='<strong>✅ Respuestas:</strong><br>'+items.map(it=>`<strong>${it.w}:</strong> Qué es: ${it.gen} | Clase: ${it.n} | Desde cuándo: ${it.g} | Dato: ${it.t}`).join('<br>');out.appendChild(ans);}
function genCompleteTask(out,count){_instrBlock(out,'Instrucción',['Copia y resuelve en tu cuaderno. Elige la opción correcta.']);const pool=_shuffle([...completeTaskDB]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';const sent=item.s.replace('___','<span class="tg-blank" style="min-width:90px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${sent}</strong><div style="margin-top:0.4rem;font-size:0.82rem;color:var(--gray);">📝 Opciones: <strong>${item.opts.join(' | ')}</strong></div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function genExplainTask(out,count){_instrBlock(out,'Instrucción',['Copia las preguntas en tu cuaderno y responde cada una.']);const pool=_shuffle([...explainQuestions]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.3rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function toggleAns(){ansVisible=!ansVisible;document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none');sfx('click');}

// ===================== SOPA DE LETRAS =====================
const sopaSets=[
  {size:11,grid:[
    ['P','I','D','F','E','H','V','C','F','G','O'],
    ['S','B','R','L','I','T','N','O','P','N','D'],
    ['G','F','I','G','U','M','Ñ','O','R','A','C'],
    ['Ñ','Z','M','R','N','Q','T','E','R','F','M'],
    ['A','R','I','B','C','U','I','T','Ñ','T','N'],
    ['U','N','H','J','P','V','M','T','T','H','V'],
    ['G','S','W','M','N','O','S','O','T','A','D'],
    ['Z','A','O','I','U','K','H','R','Q','M','F'],
    ['I','C','A','T','H','R','W','Ñ','D','C','N'],
    ['W','N','H','Q','Z','H','Ñ','B','F','Y','C'],
    ['R','C','C','B','J','Y','D','L','E','W','Q']
  ],words:[
    {w:'TURING',cells:[[1,5],[2,4],[3,3],[4,2],[5,1],[6,0]]},
    {w:'DARTMOUTH',cells:[[1,10],[2,9],[3,8],[4,7],[5,6],[6,5],[7,4],[8,3],[9,2]]},
    {w:'ELIZA',cells:[[0,4],[1,3],[2,2],[3,1],[4,0]]},
    {w:'INVIERNO',cells:[[7,3],[6,4],[5,5],[4,6],[3,7],[2,8],[1,9],[0,10]]},
    {w:'DATOS',cells:[[6,10],[6,9],[6,8],[6,7],[6,6]]},
    {w:'COMPUTO',cells:[[8,1],[7,2],[6,3],[5,4],[4,5],[3,6],[2,7]]}
  ]},
  {size:11,grid:[
    ['D','A','Ñ','J','K','P','E','U','Z','U','Z'],
    ['H','N','X','O','P','A','R','T','Ñ','P','Z'],
    ['I','O','V','M','Y','T','K','Ñ','V','V','Ñ'],
    ['S','R','Ñ','T','J','R','W','N','D','Ñ','N'],
    ['T','U','M','I','I','O','N','E','G','B','Z'],
    ['O','E','A','R','J','N','Q','D','I','O','I'],
    ['R','N','Q','O','G','E','H','U','E','L','H'],
    ['I','V','U','G','Q','S','K','Ñ','U','N','I'],
    ['A','E','I','L','P','R','E','M','I','O','A'],
    ['N','H','N','A','F','Z','X','S','F','L','M'],
    ['V','A','A','I','N','D','F','X','I','I','N']
  ],words:[
    {w:'ALGORITMO',cells:[[9,3],[8,3],[7,3],[6,3],[5,3],[4,3],[3,3],[2,3],[1,3]]},
    {w:'NEURONA',cells:[[6,1],[5,1],[4,1],[3,1],[2,1],[1,1],[0,1]]},
    {w:'PATRONES',cells:[[0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[7,5]]},
    {w:'HISTORIA',cells:[[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0]]},
    {w:'MAQUINA',cells:[[4,2],[5,2],[6,2],[7,2],[8,2],[9,2],[10,2]]},
    {w:'PREMIO',cells:[[8,4],[8,5],[8,6],[8,7],[8,8],[8,9]]}
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
  {q:'Turing preguntó en 1950 si las máquinas podían pensar.',a:true},
  {q:'El nombre «Inteligencia Artificial» nació en 2022.',a:false},
  {q:'El nombre nació en el Dartmouth College, en 1956.',a:true},
  {q:'ELIZA entendía de verdad lo que le decían.',a:false},
  {q:'Hubo dos inviernos en que el campo casi se para.',a:true},
  {q:'Los inviernos llegaron porque se acabó la luz.',a:false},
  {q:'En 1997 Deep Blue ganó al ajedrez a Garri Kaspárov.',a:true},
  {q:'Deep Blue aprendía de sus partidas.',a:false},
  {q:'En 2012 una red profunda ganó el concurso de imágenes.',a:true},
  {q:'AlphaGo ganó al Go calculando todas las jugadas.',a:false},
  {q:'AlphaGo aprendió jugando contra sí mismo.',a:true},
  {q:'La pieza técnica de los chats de hoy es de 2017.',a:true},
  {q:'Las tres patas son datos, cómputo y algoritmos.',a:true},
  {q:'Con una sola de las tres patas habría bastado.',a:false},
  {q:'La primera neurona de papel se publicó en 1943.',a:true},
  {q:'El perceptrón de 1958 aprendía solo, ajustando números.',a:true},
  {q:'El programa de damas de Arthur Samuel le ganó a él.',a:true},
  {q:'Los sistemas expertos aprendían solos de los ejemplos.',a:false},
  {q:'Las tarjetas gráficas se hicieron para los videojuegos.',a:true},
  {q:'La historia de la IA empezó en 2022.',a:false}
];
const evalMCBank=[
  {q:'¿Quién preguntó en 1950 si las máquinas pueden pensar?',o:['John McCarthy','Arthur Samuel','Alan Turing','Joseph Weizenbaum'],a:2},
  {q:'¿Dónde y cuándo nació el nombre «Inteligencia Artificial»?',o:['En el taller de Dartmouth, en 1956','En Londres, en 1950','En Nueva York, en 1997','En internet, en 2022'],a:0},
  {q:'¿Qué enseñó ELIZA en 1966?',o:['Que las máquinas ya entendían','Que los chats son recientes','Que las máquinas sienten','Que algo puede contestar como persona sin entender nada'],a:3},
  {q:'¿Por qué hubo dos inviernos de la IA?',o:['Se prohibió investigar','Se prometió de más y se cortó el dinero','Se perdieron los programas','Se acabó la luz'],a:1},
  {q:'¿Qué pasó en 1997?',o:['Nació el nombre del campo','Se abrió el primer chat','Una máquina ganó al campeón de ajedrez','Se inventó la red neuronal'],a:2},
  {q:'¿Cómo ganaba Deep Blue?',o:['Aprendiendo de sus partidas','Preguntándole a un experto','Copiando a los campeones','Calculando muchísimas jugadas por segundo'],a:3},
  {q:'¿Qué pasó en 2012?',o:['Una red profunda ganó el concurso de imágenes','Se inventó la cámara digital','Nació el primer robot','Se cerró un laboratorio'],a:0},
  {q:'¿Cómo aprendió AlphaGo?',o:['Con un libro de aperturas','Jugando millones de partidas contra sí mismo','Con fotos etiquetadas','Calculando todas las jugadas'],a:1},
  {q:'¿De qué año es el artículo del transformador?',o:['De 1956','De 1997','De 2022','De 2017'],a:3},
  {q:'¿Cuáles son las tres patas?',o:['Robots, sensores y motores','Dinero, publicidad y suerte','Datos, cómputo y algoritmos','Internet, teléfonos y satélites'],a:2},
  {q:'¿Qué aportaron las tarjetas gráficas?',o:['Los datos','El cómputo','Los algoritmos','Las etiquetas'],a:1},
  {q:'¿Qué fue el perceptrón, de 1958?',o:['La máquina que aprendió sola, ajustando números','El primer robot que caminó','El primer chat','Un tipo de computadora personal'],a:0},
  {q:'¿Qué hicieron McCulloch y Pitts en 1943?',o:['Ganaron un campeonato de ajedrez','Fundaron un laboratorio','Publicaron un modelo matemático de una neurona','Escribieron el primer chat'],a:2},
  {q:'¿Por qué cayeron los sistemas expertos?',o:['Porque nadie los usaba','Porque eran ilegales','Porque no había computadoras','Porque mantener miles de reglas a mano salía carísimo'],a:3},
  {q:'¿Qué cambió en noviembre de 2022?',o:['Un chat de IA generativa se abrió al público','Se inventó la Inteligencia Artificial','Se construyó la primera computadora','Se publicó el artículo del transformador'],a:0}
];
const evalCPBank=[
  {q:'En 1950 Alan Turing preguntó si las máquinas podían ___.',a:'pensar'},
  {q:'El nombre nació en 1956, en el taller de ___.',a:'Dartmouth'},
  {q:'El programa que conversaba en 1966 se llamaba ___.',a:'ELIZA'},
  {q:'Los dos períodos en que el campo casi se para se llaman los dos ___.',a:'inviernos'},
  {q:'En 1997 Deep Blue ganó al campeón mundial de ___.',a:'ajedrez'},
  {q:'En 2012 las máquinas aprendieron a reconocer ___.',a:'imágenes'},
  {q:'En 2016 AlphaGo ganó al juego del ___.',a:'Go'},
  {q:'La pieza técnica de 2017 se llama ___.',a:'transformador'},
  {q:'Las tres patas son datos, algoritmos y ___.',a:'cómputo'},
  {q:'Las tarjetas gráficas se habían hecho para los ___.',a:'videojuegos'},
  {q:'La máquina que aprendió sola en 1958 fue el ___.',a:'perceptrón'},
  {q:'El programa de damas de 1959 lo escribió Arthur ___.',a:'Samuel'},
  {q:'Los programas con las reglas de un experto eran sistemas ___.',a:'expertos'},
  {q:'AlphaGo aprendió jugando contra sí ___.',a:'mismo'},
  {q:'En 2022 un chat de IA generativa se abrió al ___.',a:'público'}
];
const evalPRBank=[
  {term:'1936',def:'Turing describe la máquina que calcula todo'},
  {term:'1943',def:'El primer modelo matemático de una neurona'},
  {term:'1950',def:'«¿Pueden pensar las máquinas?», en la revista Mind'},
  {term:'1956',def:'Nace el nombre, en Dartmouth'},
  {term:'1958',def:'El perceptrón: la máquina que aprendió sola'},
  {term:'1959',def:'Un programa de damas que le gana a su autor'},
  {term:'1966',def:'ELIZA conversaba sin entender nada'},
  {term:'Los años setenta',def:'El primer invierno: se cortó el dinero'},
  {term:'Los años ochenta',def:'Los sistemas expertos y el segundo invierno'},
  {term:'1997',def:'Deep Blue gana el ajedrez al campeón mundial'},
  {term:'2012',def:'El año en que las máquinas aprendieron a ver'},
  {term:'2016',def:'AlphaGo gana al Go, que se creía imposible'},
  {term:'2017',def:'El transformador: el motor de los chats de hoy'},
  {term:'2022',def:'La IA generativa llega al teléfono de todos'},
  {term:'Datos, cómputo y algoritmos',def:'Las tres cosas que tuvieron que juntarse'}
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

function genEval(){sfx('click');_evalFormaSelector(); const _selF = document.getElementById('evalFormaSel'); if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10))); const cf = evalFormNum; const rng = _evalRng(cf); window._currentEvalForm=cf;evalFormNum = (evalFormNum % EVAL_FORMAS) + 1; _evalFormaSelector();saveProgress();document.getElementById('eval-screen-title').textContent=`🎓 Evaluación Final · Forma ${cf} · La Historia de la Inteligencia Artificial`;evalAnsVisible=false;const out=document.getElementById('evalOut');out.innerHTML='';const bar=document.createElement('div');bar.className='eval-score-bar';bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje · 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25 pts</span><span class="eval-score-pill esp-tf">V/F 25 pts</span><span class="eval-score-pill esp-mc">Selección 25 pts</span><span class="eval-score-pill esp-pr">Pareados 25 pts</span></div>`;out.appendChild(bar);const cpItems=_pickF(evalCPBank,5, rng);const s1=document.createElement('div');s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';cpItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='cp';d.dataset.evalIndex=i;const qHtml=item.q.replace('___',`<input class="eval-cp-input" type="text" data-cp="${i}" autocomplete="off">`);d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbCp${i}" aria-live="polite"></div>`;s1.appendChild(d);});out.appendChild(s1);const tfItems=_pickF(evalTFBank,5, rng);const s2=document.createElement('div');s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';tfItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='tf';d.dataset.evalIndex=i;d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="true"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="false"> Falso</label></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbTf${i}" aria-live="polite"></div>`;s2.appendChild(d);});out.appendChild(s2);const mcItems=_pickF(evalMCBank,5, rng);const s3=document.createElement('div');s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';mcItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='mc';d.dataset.evalIndex=i;const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join('');d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbMc${i}" aria-live="polite"></div>`;s3.appendChild(d);});out.appendChild(s3);const prItems=_pickF(evalPRBank,5, rng);const shuffledDefs=_shuffleF(prItems, rng);const letters=['A','B','C','D','E'];const s4=document.createElement('div');s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';const matchCard=document.createElement('div');matchCard.className='eval-item';let colLeft='<div class="eval-match-col"><h4>📌 Términos</h4>';prItems.forEach((item,i)=>{colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> <select class="eval-match-select" data-pr="${i}" aria-label="Respuesta pareada ${i+16}"><option value="">—</option>${letters.map(l=>`<option value="${l}">${l}</option>`).join('')}</select> ${item.term}</div>`;});colLeft+='</div>';let colRight='<div class="eval-match-col"><h4>🔑 Definiciones</h4>';shuffledDefs.forEach((item,i)=>{colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`;});colRight+='</div>';const ansKey=prItems.map((item,i)=>{const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)];return`${i+16}→${letter}`;}).join(' · ');matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div><div class="eval-item-feedback" id="evalFbPr" aria-live="polite"></div>`;s4.appendChild(matchCard);out.appendChild(s4);window._evalPrintData={tf:tfItems,mc:mcItems,cp:cpItems,pr:{terms:prItems,shuffledDefs,letters}};const autoPanel=document.createElement('div');autoPanel.id='evalAutoResult';autoPanel.className='eval-auto-result';autoPanel.innerHTML='<strong>🧮 Evaluación interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión sale sin tus respuestas.';out.appendChild(autoPanel);fin('s-evaluacion');}
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación La Historia de la Inteligencia Artificial · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.12rem 0.4rem;margin:0.22rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #86198f;background:#fdf4ff;color:#86198f;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#86198f;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #86198f;height:12px;}.obt-pct{white-space:nowrap;}.qn{font-weight:700;min-width:22px;flex-shrink:0;}.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:40px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.18rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.14rem 0.35rem;margin-bottom:0.1rem;break-inside:avoid;page-break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.3;display:flex;gap:0.28rem;margin-bottom:0.07rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.1rem 0.5rem;}.mc-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:0.04rem 0.15rem;margin-left:0.8rem;}.mc-opt{font-size:9pt;display:flex;align-items:center;gap:0.15rem;}.mc-opt input{width:10px;height:10px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{margin-top:0.1rem;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.08rem 0.4rem;margin-top:0.08rem;}.pr-head{font-size:9pt;font-weight:700;color:#555;margin-bottom:0.1rem;}.pr-item{font-size:10.5pt;padding:0.1rem 0.28rem;background:#fdf4ff;border-radius:3px;margin-bottom:0.07rem;display:flex;align-items:center;gap:0.2rem;line-height:1.2;break-inside:avoid;page-break-inside:avoid;}.pr-num{font-weight:700;color:#86198f;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.22rem;padding:0.15rem 0;page-break-before:avoid;break-before:avoid;color:#86198f;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #86198f;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#555;}.pa{color:#007a00;font-weight:600;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · La Historia de la Inteligencia Artificial · Educación Básica · II y III Ciclo · Inteligencia Artificial</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Evaluación Final · La Historia de la Inteligencia Artificial · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u</div></div><div class="p-grid">${pR}</div>
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
  {txt:'Un compañero dice que la Inteligencia Artificial se inventó en 2022, con el chat.'},
  {txt:'Una noticia promete que en dos años las máquinas harán todo el trabajo.'},
  {txt:'Alguien dice que ELIZA, en 1966, entendía porque contestaba bien.'},
  {txt:'Un texto dice que en 1997 Deep Blue «pensó» mejor que Kaspárov.'},
  {txt:'Un estudiante escribe que el transformador se inventó en 2022.'},
  {txt:'Un adulto dice que no hay que estudiar esto porque «ya se murió otras veces».'}
];
const critCaseQuestions=[
  '1. ¿Qué afirma este caso y en qué año lo sitúa?',
  '2. ¿Es correcto? Corregilo con el dato de la línea del tiempo.',
  '3. ¿De dónde sale la confusión?',
  '4. ¿Qué le explicarías a esa persona, y con qué ejemplo?'
];
const critCaseGuides=[
  'Se valora que ubique la afirmación en la línea del tiempo: 1936, 1950, 1956, 1966, los inviernos, 1997, 2012, 2016, 2017, 2022.',
  'Se corrige con la fecha correcta y con lo que pasó ese año.',
  'Casi toda confusión es la misma: se confunde CUÁNDO fue la idea con CUÁNDO llegó al público.',
  'Respuesta abierta. Se valora que explique con respeto y con un hito concreto. Ni la IA nació ayer, ni los inviernos prueban que no sirve.'
];
const critErrorBank=[
  {txt:'"La Inteligencia Artificial se inventó en 2022."',
   g1:'La pregunta es de 1950 y el nombre, de 1956. En 2022 llegó al público.',
   g2:'Confundir la idea con la fama es el error más común.'},
  {txt:'"ELIZA entendía a la gente porque le contestaba bien."',
   g1:'ELIZA devolvía en pregunta lo que le decían. No entendía nada.',
   g2:'Contestar como una persona no es entender. Vale igual hoy.'},
  {txt:'"Deep Blue pensó mejor que el campeón mundial."',
   g1:'Deep Blue no pensaba: calculaba muchísimas jugadas por segundo.',
   g2:'Se puede ganar sin entender nada. Eso enseñó ese partido.'},
  {txt:'"Los inviernos pasaron porque la tecnología no servía."',
   g1:'La tecnología avanzaba. Lo que falló fueron las promesas.',
   g2:'Al cortarse el dinero, lo perdieron también los que iban bien.'},
  {txt:'"AlphaGo ganó al Go calculando todas las jugadas posibles."',
   g1:'En el Go no se pueden calcular todas: son demasiadas.',
   g2:'Aprendió jugando millones de partidas contra sí mismo.'},
  {txt:'"Bastaba con tener mejores algoritmos para que la IA despegara."',
   g1:'Hicieron falta las tres patas: datos, cómputo y algoritmos.',
   g2:'Sin datos ni tarjetas gráficas no habría pasado nada.'}
];
const critDecisionBank=[
  'Vas a citar una fecha; conviene decir de dónde la sacaste, o darla por sabida.',
  'Una noticia promete que la IA curará todo; conviene compartirla ya, o preguntar quién lo dice.',
  'Tu libro no trae nada; conviene copiar lo primero de internet, o buscar la fuente.',
  'Un compañero se burla porque «ya fracasó»; conviene darle la razón, o contarle qué pasó.',
  'No estás seguro entre dos años; conviene poner el que suene mejor, o escribir la década.'
];
const critDecisionGuide='La mejor decisión dice de dónde sale el dato. La promesa se pregunta antes. El año que no se confirma va como década.';
const critCompareBank=[
  {a:'Deep Blue, en 1997.',b:'AlphaGo, en 2016.',
   ga:'Ganaba calculando muchísimas jugadas por segundo.',
   gb:'Ganaba con lo que aprendió jugando contra sí mismo.',
   gr:'Los dos ganaron a campeones humanos, por caminos contrarios. En el ajedrez se calcula a lo bruto. En el Go hubo que aprender.'},
  {a:'Un sistema experto de los años ochenta.',b:'Una red entrenada con ejemplos.',
   ga:'Guarda las reglas que una persona escribió.',
   gb:'Saca la regla ella misma, de los ejemplos.',
   gr:'El sistema experto no mejoraba solo, y mantener miles de reglas a mano era carísimo. La red saca la regla de los datos: por eso esperó a ellos.'},
  {a:'El artículo de 2017.',b:'El chat que se abrió en 2022.',
   ga:'La pieza técnica: una manera nueva de armar redes de texto.',
   gb:'Es el producto: esa idea entrenada en grande, al alcance de cualquiera.',
   gr:'Cinco años separan la idea de su llegada al público. La IA generativa no se inventó en 2022: en 2022 se hizo famosa.'}
];
const critCauseBank=[
  {cause:'En 1956 un grupo se reunió en Dartmouth y le puso nombre.',guide:'Por eso ese año se pregunta en los exámenes.'},
  {cause:'Se prometió traducción automática y máquinas que razonan en pocos años.',guide:'Por eso, al no llegar, se cortó el dinero: el primer invierno.'},
  {cause:'Las tarjetas gráficas de los videojuegos servían para entrenar redes.',guide:'Por eso en 2012 se entrenó con un millón de fotos.'},
  {cause:'El Go tiene demasiadas jugadas para calcularlas todas.',guide:'Por eso AlphaGo aprendió jugando contra sí mismo.'},
  {cause:'En 2017 se presentó una manera de entrenar redes de texto más rápido.',guide:'Por eso, cinco años después, el chat llegó a cualquiera.'}
];
const critEffectBank=[
  {effect:'Mucha gente cree que la IA se inventó en 2022.',guide:'Porque ese año llegó a su teléfono. La idea es de 1950.'},
  {effect:'Hoy hay que desconfiar de las promesas muy grandes.',guide:'Porque ya pasó dos veces y las dos acabó en invierno.'},
  {effect:'ELIZA asustó a su propio autor.',guide:'Porque la gente le contaba cosas íntimas a un programa que no entendía nada.'},
  {effect:'Los sistemas expertos de los ochenta no escalaron.',guide:'Porque las reglas las escribía y mantenía una persona, y eran miles.'},
  {effect:'Hicieron falta setenta años para que esto despegara.',guide:'Porque las tres patas no estuvieron listas a la vez hasta hace poco.'}
];
function genEvalCrit(){
  sfx('click');
  _injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });
  const _sC = document.getElementById('evalCritFormaSel');
  if (_sC && parseInt(_sC.value, 10)) evalCritFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sC.value, 10)));
  const cf=evalCritFormNum;window._currentEvalCritForm=cf;const rngC = _evalRng(200000 + cf);evalCritFormNum=(evalCritFormNum%EVAL_FORMAS)+1;_injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });saveProgress();
  document.getElementById('evalcrit-screen-title').textContent=`🧠 Pensamiento Crítico · Forma ${cf} · La Historia de la Inteligencia Artificial`;
  evalCritAnsVisible=false;
  const out=document.getElementById('evalCritOut');out.innerHTML='';
  const kase=_pickF(critCaseBank,1,rngC)[0];
  const s1=document.createElement('div');
  s1.innerHTML=`<div class="eval-section-title">I. Caso de análisis: un dato que alguien afirma <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${kase.txt}</div>${critCaseQuestions.map((q,i)=>`<div class="crit-q-block"><div class="crit-q-label">${q}</div><textarea class="crit-textarea" rows="2" aria-label="${q}"></textarea><div class="crit-pauta">${critCaseGuides[i]}</div></div>`).join('')}<div class="crit-selfscore"><label for="critScore0">Obtenido:</label><input type="number" id="critScore0" class="crit-score-input" data-score="0" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s1);
  const err=_pickF(critErrorBank,1,rngC)[0];
  const s2=document.createElement('div');
  s2.innerHTML=`<div class="eval-section-title">II. Corrige el error <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${err.txt}</div><p style="font-size:0.85rem;margin-bottom:0.5rem;">Identifica <strong>dos errores</strong> y corrígelos con tus propias palabras:</p><div class="crit-q-block"><div class="crit-q-label">Error 1 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 1 y su corrección"></textarea><div class="crit-pauta">${err.g1}</div></div><div class="crit-q-block"><div class="crit-q-label">Error 2 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 2 y su corrección"></textarea><div class="crit-pauta">${err.g2}</div></div><div class="crit-selfscore"><label for="critScore1">Obtenido:</label><input type="number" id="critScore1" class="crit-score-input" data-score="1" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s2);
  const dec=_pickF(critDecisionBank,1,rngC)[0];
  const s3=document.createElement('div');
  s3.innerHTML=`<div class="eval-section-title">III. Toma de decisiones: qué harías <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${dec}</div><div class="crit-q-block"><div class="crit-q-label">¿Qué opción recomendarías? Explica por qué, con un hito de la línea del tiempo.</div><textarea class="crit-textarea" rows="4" aria-label="Recomendaciones y su justificación"></textarea><div class="crit-pauta">${critDecisionGuide}</div></div><div class="crit-selfscore"><label for="critScore2">Obtenido:</label><input type="number" id="critScore2" class="crit-score-input" data-score="2" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s3);
  const cmp=_pickF(critCompareBank,1,rngC)[0];
  const s4=document.createElement('div');
  s4.innerHTML=`<div class="eval-section-title">IV. Comparación razonada <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-compare-grid"><div class="crit-compare-box"><h5>Caso A</h5>${cmp.a}</div><div class="crit-compare-box"><h5>Caso B</h5>${cmp.b}</div></div><div class="crit-q-block"><div class="crit-q-label">1. ¿Qué es cada caso? 2. ¿Cómo funciona cada uno? 3. ¿Por qué no son lo mismo?</div><textarea class="crit-textarea" rows="4" aria-label="Comparación razonada de los casos A y B"></textarea><div class="crit-pauta">Caso A: ${cmp.ga} · Caso B: ${cmp.gb} · ${cmp.gr}</div></div><div class="crit-selfscore"><label for="critScore3">Obtenido:</label><input type="number" id="critScore3" class="crit-score-input" data-score="3" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s4);
  const causes=_pickF(critCauseBank,2,rngC),effects=_pickF(critEffectBank,3,rngC);
  let ceRows='';
  causes.forEach((it,i)=>{ceRows+=`<div class="crit-ce-item"><div class="crit-ce-row"><div class="crit-ce-cell crit-ce-given"><span class="crit-ce-tag">Causa</span>${it.cause}</div><div class="crit-ce-cell"><span class="crit-ce-tag">Efecto</span><textarea class="crit-textarea" rows="2" aria-label="Efecto de: ${it.cause}" placeholder="Escribe el efecto..."></textarea></div></div><div class="crit-pauta">${it.guide}</div></div>`;});
  effects.forEach((it,i)=>{ceRows+=`<div class="crit-ce-item"><div class="crit-ce-row"><div class="crit-ce-cell"><span class="crit-ce-tag">Causa</span><textarea class="crit-textarea" rows="2" aria-label="Causa de: ${it.effect}" placeholder="Escribe la causa..."></textarea></div><div class="crit-ce-cell crit-ce-given"><span class="crit-ce-tag">Efecto</span>${it.effect}</div></div><div class="crit-pauta">${it.guide}</div></div>`;});
  const s5=document.createElement('div');
  s5.innerHTML=`<div class="eval-section-title">V. Análisis de causas y efectos <span class="eval-pts">20 pts</span></div><div class="eval-item">${ceRows}<div class="crit-selfscore"><label for="critScore4">Obtenido:</label><input type="number" id="critScore4" class="crit-score-input" data-score="4" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s5);
  window._evalCritData={kase,err,dec,cmp,causes,effects};
  const totalPanel=document.createElement('div');totalPanel.id='evalCritTotalResult';totalPanel.className='crit-total-panel';totalPanel.innerHTML='<strong>🧮 Autoevaluación:</strong> responde cada sección y compara con la <em>Pauta</em>. Anota tu puntaje (0–20) y presiona <em>Calcular Total</em>.';out.appendChild(totalPanel);
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
  let s1=`<div class="sec-title"><span>I. Caso de análisis: un dato que alguien afirma</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.kase.txt}</p>`;
  critCaseQuestions.forEach(q=>{s1+=`<p class="crit-print-q">${q}</p>${lines(1)}`;});
  let s2=`<div class="sec-title"><span>II. Corrige el error</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.err.txt}</p><p class="crit-print-q">Identifica dos errores y corrígelos con tus propias palabras:</p><p class="crit-print-q"><strong>Error 1:</strong></p>${lines(1)}<p class="crit-print-q"><strong>Error 2:</strong></p>${lines(1)}`;
  let s3=`<div class="sec-title"><span>III. Toma de decisiones: qué harías</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.dec}</p><p class="crit-print-q">¿Qué opción recomendarías? Explica por qué, con un hito de la línea del tiempo.</p>${lines(2)}`;
  let s4=`<div class="sec-title"><span>IV. Comparación razonada</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><div class="crit-compare-print-grid"><div class="crit-compare-print-box"><strong>Caso A:</strong> ${d.cmp.a}</div><div class="crit-compare-print-box"><strong>Caso B:</strong> ${d.cmp.b}</div></div><p class="crit-print-q">1. ¿Qué es cada caso? 2. ¿Cómo funciona cada uno? 3. ¿Por qué no son lo mismo?</p>${lines(2)}`;
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
  const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Pensamiento Crítico La Historia de la Inteligencia Artificial · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.1rem 0.4rem;margin:0.2rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #86198f;background:#fdf4ff;color:#86198f;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#86198f;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #86198f;height:12px;}.obt-pct{white-space:nowrap;}.crit-print-scenario{font-size:10.5pt;background:#fdf4ff;border-left:3px solid #86198f;padding:0.2rem 0.5rem;margin:0.1rem 0 0.2rem;line-height:1.3;}.crit-print-q{font-size:10pt;font-weight:600;margin:0.15rem 0 0.08rem;line-height:1.25;}.ln{border-bottom:1px solid #111;min-height:12px;margin-bottom:2px;}.crit-compare-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin:0.15rem 0;}.crit-compare-print-box{font-size:9.5pt;background:#fdf4ff;border-radius:4px;padding:0.25rem 0.4rem;line-height:1.25;}.crit-print-tbl{width:100%;border-collapse:collapse;font-size:9.5pt;margin-top:0.15rem;}.crit-print-tbl th,.crit-print-tbl td{border:1px solid #999;padding:0.3rem 0.45rem;text-align:left;height:30px;vertical-align:middle;}.crit-print-tbl th{background:#fdf4ff;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.08rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.9rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.45rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.1rem;margin-bottom:0.18rem;}.p-crit-line{font-size:11pt;color:#007a00;margin-bottom:0.18rem;line-height:1.35;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.2rem;padding:0.1rem 0;color:#86198f;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #86198f;}.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:12.7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="critEvalPage"><div class="ph"><h2>Evaluación Competencial · Pensamiento Crítico · La Historia de la Inteligencia Artificial · Educación Básica · II y III Ciclo · Inteligencia Artificial</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 5 secciones de 20 puntos</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100</span></div></div><div class="pauta-wrap" id="critPautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Pensamiento Crítico · La Historia de la Inteligencia Artificial · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 5 secciones × 20 pts c/u — respuesta abierta, usar como guía de corrección</div></div><div class="p-grid">${pR}</div></div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("critEvalPage",250,0.55,1.2);fit("critPautaPage",250,0.55,1.2);})();<\/script></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(doc);win.document.close();setTimeout(()=>win.print(),400);
}

// ===================== LABORATORIO DE LOS SÍMBOLOS =====================
const parteData = (function () {
  /* Una parte por época, armada de js/data/ia-historia.js. Así la misión no
     escribe ni una fecha: las pinta. El aspecto «¿Qué lo acredita?» es lo que
     hace distinta a esta misión: de cada hito se dice el documento o el hecho
     público que lo sostiene, porque aquí lo que se copia son fechas y una fecha
     inventada se estudia igual de bien que una verdadera. */
  const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const out = {};
  IA_EPOCAS.forEach(e => {
    const hitos = IA_HITOS.filter(h => h.epoca === e.clave);
    out[e.clave] = {
      nombre: e.nombre, icon: e.emoji,
      estructura: { title: '¿Qué edad es?',
        info: '<strong>' + esc(e.nombre) + '</strong> (' + esc(e.rango) + ')<br><br>' + esc(e.resumen) },
      funcion:    { title: '¿Qué pasó?',
        info: hitos.map(h => h.emoji + ' <strong>' + esc(h.anio) + '</strong> · ' + esc(h.titulo) + '<br>' + esc(h.que)).join('<br><br>') },
      ubicacion:  { title: '¿Por qué importa?',
        info: hitos.map(h => '<strong>' + esc(h.anio) + ':</strong> ' + esc(h.porque)).join('<br><br>') },
      dato:       { title: '¿Qué lo acredita?',
        info: hitos.map(h => '📚 <strong>' + esc(h.anio) + ':</strong> ' + esc(h.acredita)).join('<br><br>') }
    };
  });
  return out;
})();
let labParte='antes',labAspecto='estructura';
function labShowParte(parteKey){labParte=parteKey;updateLabDisplay();document.querySelectorAll('.lab-cont-btn').forEach(b=>b.classList.remove('active-pri'));const btn=document.querySelector(`[data-parte="${parteKey}"]`);if(btn)btn.classList.add('active-pri');if(typeof sfx==='function')sfx('click');}
function labShowAspecto(aspectoKey){labAspecto=aspectoKey;updateLabDisplay();document.querySelectorAll('.lab-asp-btn').forEach(b=>b.classList.remove('active-sec'));const btn=document.querySelector(`[data-aspecto="${aspectoKey}"]`);if(btn)btn.classList.add('active-sec');if(typeof sfx==='function')sfx('click');}
function updateLabDisplay(){const data=parteData[labParte];const asp=data[labAspecto];document.getElementById('lab-sentence').innerHTML=`🔬 Explorando: <strong>${data.nombre}</strong> → <strong>${asp.title}</strong>`;document.getElementById('lab-display').innerHTML=`<div class="lab-cont-header">${data.icon} ${data.nombre}</div><div class="lab-asp-title">${asp.title}</div><div class="lab-asp-info">${asp.info}</div>`;}

// ===================== DIPLOMA =====================
function _diplPct(){return xp>=MXP?100:Math.round((xp/MXP)*100);}
function openDiploma(){sfx('fan');const pct=_diplPct();document.getElementById('diplPct').textContent=pct+'%';document.getElementById('diplBar').style.width=pct+'%';document.getElementById('diplDate').textContent='Fecha: '+new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});const msgs=['¡Sigue aprendiendo!','¡Muy buen trabajo!','¡Vas muy bien!','¡Conoces la historia de la Inteligencia Artificial!','¡Cronista de la máquina que aprende!'];document.getElementById('diplMsg').textContent=msgs[Math.min(Math.floor(pct/25),4)];const stars=['⭐','⭐⭐','⭐⭐⭐'];document.getElementById('diplStars').textContent=stars[Math.min(Math.floor(pct/40),2)];const achTxt=unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(' · ');document.getElementById('diplAch').textContent=achTxt||'Sigue completando secciones para desbloquear logros';document.getElementById('diplomaOverlay').classList.add('open');launchConfetti();}
function closeDiploma(){document.getElementById('diplomaOverlay').classList.remove('open');}
function updateDiplomaName(v){document.getElementById('diplName').textContent=v||'Estudiante';}
function shareWA(){const name=document.getElementById('diplName').textContent||'Estudiante';const pct=_diplPct();const msg=`🧠 ¡${name} completó la Misión "La Historia de la Inteligencia Artificial"! 🏅 Progreso: ${pct}% · 🌱 policastsapien.com`;_waShare(msg);}
async function captureDiploma(){if(typeof html2canvas==='undefined'){showToast('⚠️ Cargando... intenta de nuevo');return;}sfx('click');const card=document.querySelector('.diploma-card');const btn=document.querySelector('.diploma-actions .btn-pri');const toHide=[card.querySelector('.diploma-input'),card.querySelector('.diploma-actions'),card.querySelector('hr')];if(btn){btn.disabled=true;btn.textContent='⏳ Capturando...';}toHide.forEach(el=>{if(el)el.style.display='none';});let dataUrl='';try{const canvas=await html2canvas(card,{scale:2,useCORS:true,backgroundColor:'#ffffff'});toHide.forEach(el=>{if(el)el.style.display='';});dataUrl=canvas.toDataURL('image/png');const name=(document.getElementById('diplName').textContent||'Estudiante').replace(/\s+/g,'-');const fileName='constancia-'+name+'.png';const cap=window.Capacitor;if(cap&&cap.isNativePlatform&&cap.isNativePlatform()&&cap.Plugins?.Filesystem&&cap.Plugins?.Share){const base64Data=dataUrl.split(',')[1];const result=await cap.Plugins.Filesystem.writeFile({path:fileName,data:base64Data,directory:'CACHE'});await cap.Plugins.Share.share({url:result.uri,dialogTitle:'Guardar / Compartir Constancia'});}else{const a=document.createElement('a');a.href=dataUrl;a.download=fileName;a.click();}}catch(e){toHide.forEach(el=>{if(el)el.style.display='';});if(e.name!=='AbortError')showToast('⚠️ No se pudo guardar la constancia');}finally{if(btn){btn.disabled=false;btn.textContent='📷 Guardar foto';}}}

// ===================== INIT =====================

// ===================== LA HISTORIA, EN LA PANTALLA =====================
/* Todo lo que tenga una fecha dentro se PINTA desde js/data/ia-historia.js.
   Aquí no se escribe ni un año a mano, y es la regla que más caro cuesta
   saltarse: una fecha equivocada se pinta igual de bien que una verdadera, el
   alumno la estudia y la escribe en el examen, y nadie se entera. De ahí sale
   `_dev/verifica-ia.js`, que compara esto contra la ficha impresa, hito por
   hito. Es la misma lección de la misión del Himno. */
function _esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

function pintarIaEpocas(){
  const cont=document.getElementById('ia-epocas');if(!cont)return;
  const tonos=['tc-teal','tc-gold','tc-jade','tc-purple'];
  cont.innerHTML=IA_EPOCAS.map((e,i)=>
    `<div class="type-chip ${tonos[i%tonos.length]}"><div class="t-art">${e.emoji} ${_esc(e.nombre)}</div><div class="t-info"><strong>${_esc(e.rango)}</strong><br>${_esc(e.resumen)}</div></div>`
  ).join('');
}

function pintarIaPatas(){
  const cont=document.getElementById('ia-patas');if(!cont)return;
  cont.innerHTML=IA_TRES_PATAS.map(p=>
    `<div class="pata"><div class="pata-e">${p.emoji}</div><div><h4>${_esc(p.pata)}</h4><p>${_esc(p.que)}</p><p class="pata-antes">⏳ ${_esc(p.antes)}</p></div></div>`
  ).join('');
}

function pintarIaInviernos(){
  const cont=document.getElementById('ia-inviernos');if(!cont)return;
  cont.innerHTML=`<h2>❄️ ${_esc(IA_LECCION_INVIERNOS.titulo)}</h2>`+
    `<p>${_esc(IA_LECCION_INVIERNOS.texto)}</p>`+
    `<div class="tip"><span class="ti">⚠️</span><div>${_esc(IA_LECCION_INVIERNOS.hoy)}</div></div>`;
}

// ═════════════ 📜 LA LÍNEA DEL TIEMPO ═════════════
/* La interacción que sostiene esta misión. Cada hito se abre y se cierra con el
   dedo, y los chips de arriba filtran por edad. Tres cosas que no son de
   adorno:

   1. Los chips son <button> de verdad, no <div> con role: un <div> con
      tabindex se enfoca y NO responde a Enter. Es la lección de centena.js que
      ya está escrita en la normativa del teclado.
   2. Al filtrar NO se repinta la página entera ni se mueve el desplazamiento:
      el alumno está a mitad de la lista y un salto al principio en cada toque
      es lo que hace que cierre la aplicación. Misma regla que la barra de
      grupos del maestro.
   3. Cada hito abierto enseña QUÉ LO ACREDITA. Es lo propio de esta misión:
      una fecha sin fuente es exactamente lo que esta plataforma no publica. */
let iaEpocaSel='todas';

function pintarIaLinea(){
  const cont=document.getElementById('ia-linea');if(!cont)return;
  const visibles=IA_HITOS.filter(h=>iaEpocaSel==='todas'||h.epoca===iaEpocaSel);
  cont.innerHTML=visibles.map(h=>{
    const ep=IA_EPOCAS.find(e=>e.clave===h.epoca);
    return `<div class="hito hito-${h.epoca}">
      <button class="hito-cab" onclick="iaHitoAbrir(${h.orden})" aria-expanded="false" aria-controls="hito-${h.orden}">
        <span class="hito-e">${h.emoji}</span>
        <span class="hito-anio">${_esc(h.anio)}</span>
        <span class="hito-tit">${_esc(h.titulo)}</span>
        <span class="hito-mas" aria-hidden="true">＋</span>
      </button>
      <div class="hito-cuerpo" id="hito-${h.orden}" hidden>
        <p class="hito-quien">👤 ${_esc(h.quien)} · ${ep.emoji} ${_esc(ep.nombre)}</p>
        <p><strong>¿Qué pasó?</strong> ${_esc(h.que)}</p>
        <p><strong>¿Por qué importa?</strong> ${_esc(h.porque)}</p>
        <p class="hito-fuente"><strong>📚 Qué lo acredita:</strong> ${_esc(h.acredita)}</p>
      </div>
    </div>`;
  }).join('');
}

function pintarIaFiltros(){
  const cont=document.getElementById('ia-filtros');if(!cont)return;
  const chips=[{clave:'todas',emoji:'📜',nombre:'Todas'}].concat(IA_EPOCAS);
  cont.innerHTML=chips.map(c=>
    `<button class="ent-chip${iaEpocaSel===c.clave?' ent-on':''}" onclick="iaFiltrarEpoca('${c.clave}')" aria-pressed="${iaEpocaSel===c.clave}">${c.emoji} ${_esc(c.nombre)}</button>`
  ).join('');
}

function iaFiltrarEpoca(clave){
  sfx('click'); iaEpocaSel=clave;
  pintarIaFiltros(); pintarIaLinea();
  const n=IA_HITOS.filter(h=>iaEpocaSel==='todas'||h.epoca===iaEpocaSel).length;
  fb('fbLinea',n+' hito'+(n===1?'':'s')+' en esta edad.',true);
  if(!xpTracker.wgt.has('linea_'+clave)){xpTracker.wgt.add('linea_'+clave);pts(1);}
}

function iaHitoAbrir(orden){
  sfx('flip');
  const cuerpo=document.getElementById('hito-'+orden); if(!cuerpo) return;
  const cab=cuerpo.previousElementSibling;
  const abierto=!cuerpo.hidden;
  cuerpo.hidden=abierto;
  cab.setAttribute('aria-expanded',String(!abierto));
  cab.querySelector('.hito-mas').textContent=abierto?'＋':'－';
  if(!abierto&&!xpTracker.wgt.has('hito_'+orden)){
    xpTracker.wgt.add('hito_'+orden); pts(1);
    if(IA_HITOS.every(h=>xpTracker.wgt.has('hito_'+h.orden))){
      fin('s-estructura'); unlockAchievement('cronista'); sfx('fan'); launchConfetti();
      fb('fbLinea','¡Abriste los '+IA_HITOS.length+' hitos! Ya conoces la historia entera.',true);
    }
  }
}

window.addEventListener('DOMContentLoaded',()=>{
  try{iaDescInit();}catch(e){} // 🔭 Descubre: pinta las actividades; no marca ninguna sección. Si el archivo de datos no llegó, la misión sigue.
  initTheme();
  loadProgress();
  pintarIaEpocas();
  pintarIaPatas();
  pintarIaInviernos();
  pintarIaFiltros();
  pintarIaLinea();
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
  document.querySelector('[data-parte="antes"]')?.classList.add('active-pri');
  document.querySelector('[data-aspecto="estructura"]')?.classList.add('active-sec');
  renderAchPanel();
});

(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalCrit==='function') _injectFormaSel('genEvalCrit','evalCritFormaSel',evalCritFormNum,function(v){evalCritFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();

// ===================== 🔭 DESCUBRE · HISTORIA =====================
/* Dos actividades de descubrimiento. Los AÑOS no están aquí ni en
   js/data/ia-descubre.js: salen de IA_HITOS (ia-historia.js), que es el
   único sitio donde vive una fecha; el archivo de descubre solo dice qué dos
   hitos se emparejan. La sonda `verifica-descubre-ia` recalcula las cuentas. */
const DESC_KEY = SAVE_KEY + '_descubre';
function iaDescGuardar(k, v) { try { const s = JSON.parse(localStorage.getItem(DESC_KEY) || '{}'); s[k] = v; localStorage.setItem(DESC_KEY, JSON.stringify(s)); } catch (e) {} }
function iaDescLeer(k) { try { return (JSON.parse(localStorage.getItem(DESC_KEY) || '{}'))[k]; } catch (e) { return undefined; } }
/* La sección se gana HACIENDO las dos: tres pares y un hito con su fuente. */
function iaDescubreListo() { if (iaTiempoHechos >= 3 && iaDescLeer('hito')) { fin('s-descubre'); unlockAchievement('cronista_hoy'); } }

/* ── 🗓️ ¿Cuánto tardó? ───────────────────────────────────────────────── */
let iaTiempoIdx = 0, iaTiempoEst = 40, iaTiempoHechos = 0, iaTiempoVisto = false;
function iaTiempoHito(anio) { return IA_HITOS.find(h => String(h.anio) === String(anio)); }
function iaTiempoPintar() {
  const caja = document.getElementById('tiempo-caja'); if (!caja) return;
  if (iaTiempoIdx >= IA_TIEMPO_PARES.length) {
    caja.innerHTML = '<p class="tiempo-fin">🗓️ Los cinco pares. Lo que faltó no fue ingenio: fueron las tres patas.</p>' +
      '<div class="ens-btns"><button class="btn btn-g" onclick="iaTiempoReiniciar()">🔄 Otra vez</button></div>';
    return;
  }
  const p = IA_TIEMPO_PARES[iaTiempoIdx], A = iaTiempoHito(p.a), B = iaTiempoHito(p.b);
  if (!A || !B) { caja.innerHTML = ''; return; }
  const real = parseInt(p.b, 10) - parseInt(p.a, 10);
  const hito = h => '<div class="tiempo-hito"><span class="tiempo-e" aria-hidden="true">' + h.emoji + '</span><strong>' + _esc(h.titulo) + '</strong><small>' + _esc(h.quien) + '</small></div>';
  let html = '<p class="tiempo-tit">Par ' + (iaTiempoIdx + 1) + ' de ' + IA_TIEMPO_PARES.length + '</p>' +
    '<div class="tiempo-hitos">' + hito(A) + '<div class="tiempo-flecha">→ ¿cuántos años pasaron? →</div>' + hito(B) + '</div>';
  if (!iaTiempoVisto) {
    html += '<div class="tiempo-mando">' +
      '<button class="btn btn-d" onclick="iaTiempoAjustar(-5)" aria-label="Cinco años menos">−5</button>' +
      '<button class="btn btn-d" onclick="iaTiempoAjustar(-1)" aria-label="Un año menos">−1</button>' +
      '<span class="tiempo-val" id="tiempo-val" aria-live="polite">' + iaTiempoEst + ' años</span>' +
      '<button class="btn btn-d" onclick="iaTiempoAjustar(1)" aria-label="Un año más">+1</button>' +
      '<button class="btn btn-d" onclick="iaTiempoAjustar(5)" aria-label="Cinco años más">+5</button></div>' +
      '<input type="range" id="tiempo-rango" class="tiempo-rango" min="0" max="80" step="1" value="' + iaTiempoEst + '" oninput="iaTiempoRango(this.value)" aria-label="Tu estimación, en años">' +
      '<div class="ens-btns"><button class="btn btn-pri" onclick="iaTiempoVer()">👀 Ver la cuenta</button></div>';
  } else {
    const err = Math.abs(iaTiempoEst - real);
    html += '<p class="tiempo-real">' + _esc(p.a) + ' → ' + _esc(p.b) + ': <strong>' + real + ' años</strong>. Tú dijiste ' + iaTiempoEst + ': ' +
      (err <= 5 ? '¡a ' + err + ' de la cuenta! ✅' : 'te fuiste por ' + err + '.') + '</p>' +
      '<p class="tiempo-por">' + _esc(p.por) + '</p>' +
      '<div class="ens-btns"><button class="btn btn-pri" onclick="iaTiempoSiguiente()">Siguiente par ▶</button></div>';
  }
  caja.innerHTML = html;
}
function iaTiempoAjustar(d) {
  iaTiempoEst = Math.max(0, Math.min(80, iaTiempoEst + d));
  const v = document.getElementById('tiempo-val'); if (v) v.textContent = iaTiempoEst + ' años';
  const r = document.getElementById('tiempo-rango'); if (r) r.value = iaTiempoEst;
}
function iaTiempoRango(v) { iaTiempoEst = parseInt(v, 10) || 0; const e = document.getElementById('tiempo-val'); if (e) e.textContent = iaTiempoEst + ' años'; }
function iaTiempoVer() {
  const p = IA_TIEMPO_PARES[iaTiempoIdx]; if (!p) return;
  const real = parseInt(p.b, 10) - parseInt(p.a, 10); const err = Math.abs(iaTiempoEst - real);
  iaTiempoVisto = true; iaTiempoHechos++; sfx(err <= 5 ? 'ok' : 'no');
  if (!xpTracker.wgt.has('tiempo_' + iaTiempoIdx)) { xpTracker.wgt.add('tiempo_' + iaTiempoIdx); pts(err <= 5 ? 3 : 1); }
  iaTiempoPintar(); iaDescubreListo();
}
function iaTiempoSiguiente() { iaTiempoIdx++; iaTiempoVisto = false; iaTiempoEst = 40; iaTiempoPintar(); }
function iaTiempoReiniciar() { iaTiempoIdx = 0; iaTiempoVisto = false; iaTiempoEst = 40; iaTiempoPintar(); }

/* ── ✍️ El hito de este año ───────────────────────────────────────────── */
function iaHitoGuardar() {
  const v = id => ((document.getElementById(id) || {}).value || '').trim();
  const que = v('mh-que'), quien = v('mh-quien'), cuando = v('mh-cuando'), fuente = v('mh-fuente');
  if (que.length < 10) { fb('fbHito', 'Cuenta qué pasó con una oración entera.', false); return; }
  if (quien.length < 2) { fb('fbHito', 'Falta quién lo dice. Sin eso no se puede preguntar qué gana.', false); return; }
  if (fuente.length < 3) { fb('fbHito', 'Falta la fuente. Un hito sin fuente es un rumor.', false); return; }
  const h = { anio: new Date().getFullYear(), que: que, quien: quien, cuando: cuando, fuente: fuente, fecha: new Date().toISOString().slice(0, 10) };
  iaDescGuardar('hito', h); iaHitoPintar(h); sfx('up');
  if (!xpTracker.wgt.has('hito_mio')) { xpTracker.wgt.add('hito_mio'); pts(4); }
  fb('fbHito', '+4 XP: tu hito ya está en la línea, con su fuente. En un año, mira si se cumplió.', true);
  iaDescubreListo();
}
/* Se pinta con las mismas clases que los hitos de arriba, y marcado como
   escrito por el alumno y SIN VERIFICAR: es la única fecha de esta misión que
   no sale del archivo de datos, y tiene que verse que es distinta. */
function iaHitoPintar(h) {
  const c = document.getElementById('mi-hito'); if (!c || !h) return;
  c.innerHTML = '<div class="hito hito-mio"><div class="hito-cab"><span class="hito-e">🧑‍🎓</span><span class="hito-anio">' + _esc(h.anio) + '</span><span class="hito-tit">' + _esc(h.que) + '</span></div>' +
    '<div class="hito-cuerpo"><p><span class="hito-quien">' + _esc(h.quien) + '</span>' + (h.cuando ? ' · para: ' + _esc(h.cuando) : '') + '</p>' +
    '<p class="hito-fuente">📎 Fuente: ' + _esc(h.fuente) + ' · escrito por ti el ' + _esc(h.fecha) + ' · <b>sin verificar</b>: comprobarlo es tu tarea</p></div></div>';
}
function iaDescInit() {
  iaTiempoPintar();
  const h = iaDescLeer('hito');
  if (h) { iaHitoPintar(h); ['que', 'quien', 'cuando', 'fuente'].forEach(k => { const i = document.getElementById('mh-' + k); if (i) i.value = h[k] || ''; }); }
}
