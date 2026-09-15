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
const SAVE_KEY='que_es_la_ia_v1';
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
  primer_quiz:{icon:'🏅',label:'Primer quiz de la máquina superado'},
  flash_master:{icon:'🃏',label:'Se sabe todas las palabras nuevas'},
  clasif_pro:{icon:'🗂️',label:'Distingue lo vivo de lo que es máquina'},
  id_master:{icon:'🔍',label:'Encuentra la palabra en la oración'},
  reto_hero:{icon:'🏆',label:'Campeón del reto de la máquina'},
  nivel3:{icon:'🎖️',label:'¡Vas muy bien! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡Ya sabes un montón! Nivel 6'},
  widgets_master:{icon:'🧩',label:'Juegos de la máquina dominados'},
  entrenador:{icon:'🍎',label:'Le enseñó a la máquina con sus propios ejemplos'}
};
function unlockAchievement(id){if(unlockedAch.includes(id))return;unlockedAch.push(id);sfx('ach');showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label);launchConfetti();renderAchPanel();saveProgress();}
function renderAchPanel(){const list=document.getElementById('achList');list.innerHTML='';Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{const div=document.createElement('div');div.className='ach-item'+(unlockedAch.includes(id)?'':' locked');div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`;list.appendChild(div);});}
function toggleAchPanel(){sfx('click');document.getElementById('achPanel').classList.toggle('open');}
function showToast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}t.textContent=msg;t.style.display='block';clearTimeout(t._tid);t._tid=setTimeout(()=>t.style.display='none',3200);}
function launchConfetti(){const colors=['#86198f','#e879f9','#4338ca','#f59e0b','#c026d3'];for(let i=0;i<60;i++){const c=document.createElement('div');c.className='confetti-piece';c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`;document.body.appendChild(c);c.addEventListener('animationend',()=>c.remove());}}

// ===================== XP =====================
const lvls=[{t:0,n:'Aprendiz 🌱'},{t:25,n:'Curioso 🔎'},{t:55,n:'Ya sabe qué es 🧠'},{t:90,n:'Le enseña ejemplos 🍎'},{t:130,n:'No se deja engañar 🛡️'},{t:165,n:'Explorador de máquinas 🚀'},{t:190,n:'Experto de I Ciclo 🏆'}];
function pts(n){xp=Math.max(0,Math.min(MXP,xp+n));updateXPBar();saveProgress();}
function updateXPBar(){const pct=Math.round((xp/MXP)*100);document.getElementById('xpFill').style.width=pct+'%';const el=document.getElementById('xpPts');el.textContent='⭐ '+xp;el.style.transform='scale(1.3)';setTimeout(()=>el.style.transform='',300);let lv=0;for(let i=0;i<lvls.length;i++)if(xp>=lvls[i].t)lv=i;document.getElementById('xpLvl').textContent=lvls[lv].n;if(lv!==prevLevel){if(lv>=2)unlockAchievement('nivel3');if(lv>=5)unlockAchievement('nivel5');prevLevel=lv;}}
function resetXP(){sfx('click');xp=0;updateXPBar();showToast('🔄 XP reiniciado a 0');}
function fin(id,showFX=true){if(!done.has(id)){done.add(id);const b=document.querySelector(`[data-s="${id}"]`);if(b)b.classList.add('done');if(showFX){sfx('up');launchConfetti();}saveProgress();}}
function getProgress(){return Math.round((done.size/TOTAL_SECTIONS)*100);}

// ===================== NAV =====================
function go(id){sfx('click');document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});document.getElementById(id).classList.add('active');const btn=document.querySelector(`[data-s="${id}"]`);if(btn){btn.classList.add('active');btn.setAttribute('aria-selected','true');}window.scrollTo({top:0,behavior:'smooth'});if(id==='s-sopa'){setTimeout(buildSopa,50);}if(id==='s-widgets'){setTimeout(buildRoute,50);}}

// ===================== FLASHCARD DATA =====================
const fcData = (function () {
  /* Del archivo común de la ruta: si mañana se corrige una definición, se
     corrige aquí, en las otras tres misiones y en las cuatro fichas a la vez.
     A los de I Ciclo se les da la versión CORTA, que es para lo que está. */
  const f = [];
  IA_CONCEPTOS.filter(c => c.ciclo === 1).forEach(c => {
    f.push({ w: c.emoji + ' ' + c.palabra, a: '<strong>' + c.corta + '</strong><br><br>' + c.ejemplo });
  });
  IA_MITOS.forEach(m => {
    f.push({ w: '¿Verdad o mentira?<br>«' + m.mito + '»', a: '<strong>Mentira.</strong><br><br>' + m.verdad });
  });
  IA_REGLAS_ORO.forEach(r => {
    f.push({ w: r.emoji + ' Una de las tres reglas de oro', a: '<strong>' + r.regla + '</strong><br><br>' + r.porque });
  });
  IA_APLICACIONES.slice(0, 5).forEach(a => {
    f.push({ w: a.emoji + ' ' + a.que + '<br><small>¿cómo lo hace?</small>', a: a.como });
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
  {q:'¿Qué es la Inteligencia Artificial?',o:['Un robot que vive dentro del teléfono','Programas que hacen cosas que antes solo hacían las personas','Una persona que trabaja dentro de la computadora','Un juego de video'],c:1,
   e:'Son programas. No están vivos y no son personas: hacen cuentas muy rápido.'},
  {q:'¿Cuál de estos SÍ está vivo?',o:['Un teléfono','Una calculadora','Un robot','Una mata de maíz'],c:3,
   e:'Lo vivo nace, crece, se alimenta y muere. Una máquina se enciende y se apaga.'},
  {q:'¿Cómo aprende una máquina a reconocer una cara?',o:['Viendo muchísimas fotos de caras','Porque nació sabiendo','Porque alguien se la dibujó una vez','Porque tiene ojos de verdad'],c:0,
   e:'Con ejemplos, y muchos. Con pocos ejemplos se equivoca mucho.'},
  {q:'Si a la máquina le enseñas poquitos ejemplos, ¿qué pasa?',o:['Aprende igual de bien','Aprende más rápido','Se equivoca más','No pasa nada'],c:2,
   e:'Mientras más ejemplos buenos, mejor aprende. Es lo que probaste en Enséñale.'},
  {q:'¿La máquina siente alegría o tristeza?',o:['Sí, cuando gana','No: es un aparato y no siente nada','Solo cuando se le acaba la batería','Sí, igual que un perro'],c:1,
   e:'No siente. Ni alegría, ni sueño, ni cariño.'},
  {q:'Cuando le dictas un mensaje al teléfono y él lo escribe, ¿qué está pasando?',o:['Una máquina convirtió tu voz en letras','Hay una persona escuchándote','El teléfono te leyó la mente','Es magia'],c:0,
   e:'Oyó millones de voces antes de oír la tuya.'},
  {q:'La máquina te dice un dato y tú no estás seguro. ¿Qué haces?',o:['Le creo, porque es una computadora','Se lo cuento a todos','Le pregunto lo mismo otra vez','Lo busco en el libro o le pregunto a mi maestra'],c:3,
   e:'Verificar es buscar en algo que responde por el dato: el libro, o una persona que lo sabe.'},
  {q:'¿Cuál de estas cosas NO se le cuenta a una máquina?',o:['Mi color favorito','Una pregunta de la tarea','La dirección de mi casa','Cómo se escribe una palabra'],c:2,
   e:'Los datos de tu casa y de tu familia no se escriben en internet.'},
  {q:'Una instrucción es…',o:['Un dibujo bonito','Una orden clara que la máquina obedece','Un premio','Una foto'],c:1,
   e:'«Enciende la luz», «espera 5 segundos». Un programa es muchas instrucciones en orden.'},
  {q:'¿Es verdad que la Inteligencia Artificial es magia?',o:['Sí, por eso nadie sabe cómo funciona','No: son datos y matemática, y alguien la hizo','Sí, pero solo en los teléfonos caros','Solo los domingos'],c:1,
   e:'Alguien la programó y alguien eligió sus ejemplos. Siempre hay personas detrás.'}
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
  {label:['Es un ser vivo','Es una máquina'],headA:'🌱 Ser vivo',headB:'⚙️ Máquina',colA:'vivo',colB:'maq',
   words:[{w:'Un perro',t:'vivo'},{w:'Un teléfono',t:'maq'},{w:'Una mata de maíz',t:'vivo'},{w:'Un robot',t:'maq'},{w:'Tu maestra',t:'vivo'},{w:'Una calculadora',t:'maq'},{w:'Un zanate',t:'vivo'},{w:'Una computadora',t:'maq'}]},
  {label:['La máquina lo aprendió con ejemplos','La máquina sigue una instrucción'],headA:'🍎 Aprendió con ejemplos',headB:'📋 Sigue una instrucción',colA:'ej',colB:'ins',
   words:[{w:'Reconocer tu cara',t:'ej'},{w:'Sumar dos números',t:'ins'},{w:'Entender lo que le dictas',t:'ej'},{w:'Encender la luz a las seis',t:'ins'},{w:'Traducir un letrero',t:'ej'},{w:'Sonar la alarma',t:'ins'},{w:'Adivinar la palabra que sigue',t:'ej'},{w:'Apagarse a los diez minutos',t:'ins'}]},
  {label:['Sí se lo puedo contar a la máquina','No se lo cuento a la máquina'],headA:'✅ Sí se lo cuento',headB:'🚫 No se lo cuento',colA:'si',colB:'no',
   words:[{w:'Mi color favorito',t:'si'},{w:'La dirección de mi casa',t:'no'},{w:'Una pregunta de la tarea',t:'si'},{w:'El teléfono de mi mamá',t:'no'},{w:'Cómo se escribe una palabra',t:'si'},{w:'Una foto de mis compañeros',t:'no'},{w:'Qué es un triángulo',t:'si'},{w:'Mi nombre completo y mi escuela',t:'no'}]}
];
let currentClassGroupIdx=0,clsSelectedWord=null;
function buildClass(){const group=classGroups[currentClassGroupIdx];document.getElementById('col-left-head').textContent=group.headA;document.getElementById('col-right-head').textContent=group.headB;const bank=document.getElementById('clsBank');bank.innerHTML='';clsSelectedWord=null;document.getElementById('items-left').innerHTML='';document.getElementById('items-right').innerHTML='';_shuffle([...group.words]).forEach(w=>{const el=document.createElement('div');el.className='wb-item';el.textContent=w.w;el.dataset.t=w.t;el.onclick=()=>{document.querySelectorAll('.wb-item').forEach(i=>i.classList.remove('sel-word'));el.classList.add('sel-word');clsSelectedWord=el;sfx('click');};bank.appendChild(el);});['col-left','col-right'].forEach(colId=>{const col=document.getElementById(colId);col.onclick=(e)=>{if(!clsSelectedWord||e.target.classList.contains('drop-item'))return;const targetId=colId==='col-left'?'items-left':'items-right';const wordsCol=document.getElementById(targetId);const item=document.createElement('div');item.className='drop-item';item.textContent=clsSelectedWord.textContent;item.dataset.t=clsSelectedWord.dataset.t;const original=clsSelectedWord;item.onclick=(ev)=>{ev.stopPropagation();if(clsSelectedWord!==null){col.click();}else{document.getElementById('clsBank').appendChild(original);original.classList.remove('sel-word');item.remove();if(typeof sfx==='function')sfx('click');}};wordsCol.appendChild(item);clsSelectedWord.remove();clsSelectedWord=null;sfx('click');};});}
function checkClass(){const remaining=document.querySelectorAll('#clsBank .wb-item').length;if(remaining>0){fb('fbCls','Mueve todas las palabras a las columnas primero.',false);return;}const group=classGroups[currentClassGroupIdx];let allOk=true;document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{const inLeft=el.parentElement.id==='items-left';const expectedType=inLeft?group.colA:group.colB;if(el.dataset.t===expectedType){el.classList.add('cls-ok');}else{el.classList.add('cls-no');allOk=false;}});if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);}if(allOk){fb('fbCls','¡Perfecto! +5 XP',true);sfx('fan');fin('s-clasifica');unlockAchievement('clasif_pro');}else{fb('fbCls','Hay errores. Los errados llevan ✗.',false);sfx('no');}}
function nextClassGroup(){sfx('click');currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length;buildClass();document.getElementById('fbCls').classList.remove('show');showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]);}
function resetClass(){sfx('click');buildClass();document.getElementById('fbCls').classList.remove('show');}

// ===================== IDENTIFICAR =====================
const idData=[
  {s:['El','teléfono','aprendió','con','muchos','ejemplos.'],c:4,art:'La palabra que dice que fueron MUCHOS'},
  {s:['Una','máquina','no','está','viva.'],c:1,art:'La cosa que no está viva'},
  {s:['Una','instrucción','es','una','orden','clara.'],c:1,art:'La palabra que significa «orden que la máquina obedece»'},
  {s:['La','computadora','no','siente','nada.'],c:3,art:'Lo que la máquina NO hace'},
  {s:['Le','enseñamos','a','la','máquina','con','ejemplos.'],c:6,art:'Lo que le mostramos para que aprenda'},
  {s:['La','cámara','encontró','una','cara','en','la','foto.'],c:4,art:'Lo que la cámara encontró'},
  {s:['No','le','doy','mis','datos','a','la','máquina.'],c:4,art:'Lo que NO se le da a la máquina'},
  {s:['La','Inteligencia','Artificial','no','es','magia.'],c:5,art:'Lo que la Inteligencia Artificial NO es'}
];
let idIdx=0,idDone=false;
function showId(){idDone=false;if(idIdx>=idData.length){document.getElementById('idSent').innerHTML='🎉 ¡Completado!';fin('s-identifica');unlockAchievement('id_master');return;}const d=idData[idIdx];document.getElementById('idProg').textContent=`Oración ${idIdx+1} de ${idData.length}`;document.getElementById('idInfo').textContent=`Busca: ${d.art}`;const sent=document.getElementById('idSent');sent.innerHTML='';d.s.forEach((w,i)=>{const span=document.createElement('span');span.className='id-word';span.textContent=w+' ';span.onclick=()=>checkId(i,span);sent.appendChild(span);});}
function checkId(i,span){if(idDone)return;document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected'));span.classList.add('selected');if(i===idData[idIdx].c){idDone=true;span.classList.add('id-ok');fb('fbId','¡Correcto! +5 XP',true);if(!xpTracker.id.has(idIdx)){xpTracker.id.add(idIdx);pts(5);}sfx('ok');}else{span.classList.add('id-no');fb('fbId','Ese no es el término solicitado.',false);sfx('no');}}
function nextId(){sfx('click');idIdx++;showId();document.getElementById('fbId').classList.remove('show');}
function resetId(){sfx('click');idIdx=0;showId();document.getElementById('fbId').classList.remove('show');}

// ===================== COMPLETA =====================
const cmpData=[
  {s:'Una máquina no está ___.',opts:['rota','viva','llena'],c:1},
  {s:'Para que aprenda, hay que mostrarle muchos ___.',opts:['ejemplos','colores','gritos'],c:0},
  {s:'Una orden clara que la máquina obedece se llama ___.',opts:['adorno','canción','instrucción'],c:2},
  {s:'La máquina no siente: es un ___.',opts:['animal','aparato','amigo'],c:1},
  {s:'Si le enseñamos pocos ejemplos, la máquina se ___ más.',opts:['alegra','cansa','equivoca'],c:2},
  {s:'La dirección de mi casa ___ se le cuenta a la máquina.',opts:['no','sí','a veces'],c:0},
  {s:'La Inteligencia Artificial no es magia: son datos y ___.',opts:['suerte','matemática','misterio'],c:1},
  {s:'Si la máquina me dice algo raro, le aviso a una ___.',opts:['máquina','pantalla','persona grande'],c:2}
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
  { label: 'Ordena cómo se le enseña a una máquina', steps: [
    '1. Juntamos muchos ejemplos',
    '2. Una persona le pone su nombre a cada uno',
    '3. La máquina los mira una y otra vez',
    '4. La probamos con ejemplos nuevos',
    '5. Ya la podemos usar'] },
  { label: 'Ordena qué pasa cuando dictas un mensaje', steps: [
    '1. Hablas cerca del teléfono',
    '2. El teléfono guarda el sonido de tu voz',
    '3. La máquina busca a qué se parece ese sonido',
    '4. Escribe las letras en la pantalla',
    '5. Tú lees y corriges si salió mal'] }
];
let currentRouteIdx=0,routeItems=[];
function buildRoute(){routeItems=_shuffle([...routeSets[currentRouteIdx].steps]);renderRoute();const fbEl=document.getElementById('fbRoute');if(fbEl)fbEl.classList.remove('show');}
function renderRoute(){const list=document.getElementById('routeList');if(!list)return;list.innerHTML='';routeItems.forEach((step,i)=>{const div=document.createElement('div');div.className='sort-item';div.innerHTML=`<div class="sort-arrows"><button class="sort-arrow" onclick="routeMove(${i},-1)"${i===0?' disabled':''}>▲</button><button class="sort-arrow" onclick="routeMove(${i},1)"${i===routeItems.length-1?' disabled':''}>▼</button></div><div class="sort-step-num">${i+1}.</div><div class="sort-item-txt">${step}</div>`;list.appendChild(div);});}
function routeMove(idx,dir){sfx('click');const ni=idx+dir;if(ni<0||ni>=routeItems.length)return;[routeItems[idx],routeItems[ni]]=[routeItems[ni],routeItems[idx]];renderRoute();}
function checkRoute(){const correct=routeSets[currentRouteIdx].steps;const isOk=routeItems.every((s,i)=>s===correct[i]);if(isOk){fb('fbRoute','¡Perfecto! Orden correcto. +4 XP',true);if(!xpTracker.wgt.has('route_'+currentRouteIdx)){xpTracker.wgt.add('route_'+currentRouteIdx);pts(4);}sfx('fan');fin('s-widgets');unlockAchievement('widgets_master');}else{fb('fbRoute','Hay pasos fuera de orden. Revisa el arreglo.',false);sfx('no');}}
function nextRoute(){sfx('click');currentRouteIdx=(currentRouteIdx+1)%routeSets.length;buildRoute();showToast('🔄 Secuencia: '+routeSets[currentRouteIdx].label);}

// Widget 2: Identifica el concepto
const neuronPartes = (function () {
  const nombres = IA_CONCEPTOS.filter(c => c.ciclo === 1).map(c => c.palabra);
  const p = [];
  IA_CONCEPTOS.filter(c => c.ciclo === 1).forEach(c => {
    p.push({ desc: c.corta, ans: c.palabra, opts: nombres.slice() });
    p.push({ desc: c.ejemplo, ans: c.palabra, opts: nombres.slice() });
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
  /* El mito de un lado, la verdad del otro: es lo que hay que desarmar antes
     de enseñar nada, así que se practica como juego y no como párrafo. */
  const verdades = IA_MITOS.map(m => m.verdad);
  return IA_MITOS.map(m => ({ trans: '«' + m.mito + '»', func: m.verdad, opts: verdades.slice() }));
})();
let neuroIdx=0,neuroDone=false;
function showNeuro(){neuroDone=false;if(neuroIdx>=neuroPairs.length){const el=document.getElementById('neuroTrans');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('neuroOpts');if(opts)opts.innerHTML='';return;}const d=neuroPairs[neuroIdx];const prog=document.getElementById('neuroProg');if(prog)prog.textContent=`${neuroIdx+1} de ${neuroPairs.length}`;const trans=document.getElementById('neuroTrans');if(trans)trans.textContent=d.trans;const opts=document.getElementById('neuroOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkNeuro(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuro');if(fbEl)fbEl.classList.remove('show');}
function checkNeuro(opt,btn,d){if(neuroDone)return;neuroDone=true;document.querySelectorAll('#neuroOpts .qz-opt').forEach(b=>{if(b.textContent===d.func)b.classList.add('correct');else if(b===btn&&b.textContent!==d.func)b.classList.add('wrong');});const isOk=opt===d.func;if(isOk){fb('fbNeuro','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuro_'+neuroIdx)){xpTracker.wgt.add('neuro_'+neuroIdx);pts(3);}sfx('ok');}else{fb('fbNeuro','Correcto: '+d.func,false);sfx('no');}setTimeout(()=>{neuroIdx++;showNeuro();},1800);}
function resetNeuro(){sfx('click');neuroIdx=0;showNeuro();}

// Widget 4: Fuente → ¿Renovable o no renovable?
const enfermedadData=[
  {disease:'Un perro',characteristic:'Está vivo',opts:['Está vivo','Es una máquina']},
  {disease:'Un teléfono',characteristic:'Es una máquina',opts:['Está vivo','Es una máquina']},
  {disease:'Una mata de maíz',characteristic:'Está vivo',opts:['Está vivo','Es una máquina']},
  {disease:'Un robot',characteristic:'Es una máquina',opts:['Está vivo','Es una máquina']},
  {disease:'Tu maestra',characteristic:'Está vivo',opts:['Está vivo','Es una máquina']},
  {disease:'Una calculadora',characteristic:'Es una máquina',opts:['Está vivo','Es una máquina']},
  {disease:'Un zanate',characteristic:'Está vivo',opts:['Está vivo','Es una máquina']},
  {disease:'Una computadora',characteristic:'Es una máquina',opts:['Está vivo','Es una máquina']},
  {disease:'Un pino',characteristic:'Está vivo',opts:['Está vivo','Es una máquina']}
];
let enferIdx=0,enferDone=false;
function showEnfer(){enferDone=false;if(enferIdx>=enfermedadData.length){const el=document.getElementById('enferDisease');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('enferOpts');if(opts)opts.innerHTML='';return;}const d=enfermedadData[enferIdx];const prog=document.getElementById('enferProg');if(prog)prog.textContent=`${enferIdx+1} de ${enfermedadData.length}`;const dis=document.getElementById('enferDisease');if(dis)dis.textContent=d.disease;const opts=document.getElementById('enferOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkEnfer(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbEnfer');if(fbEl)fbEl.classList.remove('show');}
function checkEnfer(opt,btn,d){if(enferDone)return;enferDone=true;document.querySelectorAll('#enferOpts .qz-opt').forEach(b=>{if(b.textContent===d.characteristic)b.classList.add('correct');else if(b===btn&&b.textContent!==d.characteristic)b.classList.add('wrong');});const isOk=opt===d.characteristic;if(isOk){fb('fbEnfer','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('enfer_'+enferIdx)){xpTracker.wgt.add('enfer_'+enferIdx);pts(3);}sfx('ok');}else{fb('fbEnfer','Correcto: '+d.characteristic,false);sfx('no');}setTimeout(()=>{enferIdx++;showEnfer();},1800);}
function resetEnfer(){sfx('click');enferIdx=0;showEnfer();}

// ===================== RETO FINAL =====================
const retoPairs=[
  {label:['Es un ser vivo','Es una máquina'],btnA:'🌱 Ser vivo',btnB:'⚙️ Máquina',colA:'vivo',colB:'maq',
   words:[{w:'Un perro',t:'vivo'},{w:'Un teléfono',t:'maq'},{w:'Una mata de maíz',t:'vivo'},{w:'Un robot',t:'maq'},{w:'Tu maestra',t:'vivo'},{w:'Una calculadora',t:'maq'},{w:'Un zanate',t:'vivo'},{w:'Una computadora',t:'maq'},{w:'Un pino',t:'vivo'},{w:'Una cámara',t:'maq'}]},
  {label:['La máquina lo aprendió con ejemplos','La máquina sigue una instrucción'],btnA:'🍎 Con ejemplos',btnB:'📋 Instrucción',colA:'ej',colB:'ins',
   words:[{w:'Reconocer tu cara',t:'ej'},{w:'Sumar dos números',t:'ins'},{w:'Entender lo que le dictas',t:'ej'},{w:'Encender la luz a las seis',t:'ins'},{w:'Traducir un letrero',t:'ej'},{w:'Sonar la alarma',t:'ins'},{w:'Adivinar la palabra que sigue',t:'ej'},{w:'Apagarse a los diez minutos',t:'ins'},{w:'Conocer la voz de tu mamá',t:'ej'},{w:'Contar de uno en uno',t:'ins'}]},
  {label:['Sí se lo puedo contar a la máquina','No se lo cuento a la máquina'],btnA:'✅ Sí',btnB:'🚫 No',colA:'si',colB:'no',
   words:[{w:'Mi color favorito',t:'si'},{w:'La dirección de mi casa',t:'no'},{w:'Una pregunta de la tarea',t:'si'},{w:'El teléfono de mi mamá',t:'no'},{w:'Cómo se escribe una palabra',t:'si'},{w:'Una foto de mis compañeros',t:'no'},{w:'Qué es un triángulo',t:'si'},{w:'Mi nombre completo y mi escuela',t:'no'},{w:'Cuánto es 7 + 5',t:'si'},{w:'La clave del teléfono de mi papá',t:'no'}]}
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
  {s:'El teléfono aprendió a reconocer caras con muchos ejemplos.',type:'ejemplos'},
  {s:'Una máquina no está viva.',type:'máquina'},
  {s:'Una instrucción es una orden clara que la máquina obedece.',type:'instrucción'},
  {s:'La computadora no siente alegría ni tristeza.',type:'no siente'},
  {s:'La Inteligencia Artificial no es magia.',type:'no es magia'},
  {s:'La cámara encontró una cara en la foto.',type:'cara'},
  {s:'No le doy mis datos a la máquina.',type:'mis datos'},
  {s:'Si algo me asusta, le aviso a una persona grande.',type:'persona grande'},
  {s:'Con pocos ejemplos la máquina se equivoca más.',type:'se equivoca'},
  {s:'El zanate está vivo y el robot no.',type:'vivo'}
];
const classifyTaskDB=[
  {w:'Inteligencia Artificial',gen:'Máquinas que hacen cosas de personas',n:'El teléfono que escribe lo que dictas',g:'En el teléfono de tu casa',t:''},
  {w:'Máquina',gen:'Una cosa hecha por personas',n:'Un molino, un ventilador',g:'En tu casa y en la escuela',t:''},
  {w:'Instrucción',gen:'Una orden clara y en orden',n:'«Enciende la luz»',g:'En el control del televisor',t:''},
  {w:'Ejemplo',gen:'Lo que le mostramos para que aprenda',n:'Mil fotos de nances',g:'En las fotos del teléfono',t:''},
  {w:'Ser vivo',gen:'Nace, crece, se alimenta y muere',n:'Un perro, un pino',g:'En el patio de tu casa',t:''},
  {w:'Dato',gen:'Un pedacito de información',n:'El color de un nance',g:'En la lista de tu maestra',t:''},
  {w:'Regla de oro',gen:'Lo que siempre hay que hacer',n:'No dar mis datos',g:'Cada vez que usas un teléfono',t:''}
];
const completeTaskDB=[
  {s:'Una máquina no está ___.',ans:'viva'},
  {s:'Para aprender, la máquina necesita muchos ___.',ans:'ejemplos'},
  {s:'Una orden clara que la máquina obedece se llama ___.',ans:'instrucción'},
  {s:'La computadora no ___ nada: es un aparato.',ans:'siente'},
  {s:'Con pocos ejemplos, la máquina se ___ más.',ans:'equivoca'},
  {s:'La dirección de mi casa ___ se le cuenta a la máquina.',ans:'no'},
  {s:'La Inteligencia Artificial no es ___.',ans:'magia'},
  {s:'Si algo me asusta, le aviso a una ___ grande.',ans:'persona'},
  {s:'Un perro está vivo; un robot es una ___.',ans:'máquina'}
];
const explainQuestions=[
  {q:'Explica con tus palabras qué es la Inteligencia Artificial.',ans:'Son programas de computadora que hacen cosas que antes solo hacían las personas, como reconocer una cara, entender lo que dictamos o traducir. No piensan ni sienten: hacen cuentas muy rápido con lo que les enseñaron.'},
  {q:'¿En qué se diferencia un perro de un robot? Escribe tres diferencias.',ans:'El perro está vivo: nace, crece, come, siente y muere. El robot es una máquina: lo hicieron personas, se enciende y se apaga, no come y no siente. Y el perro aprende solo desde que nace; al robot hay que enseñarle.'},
  {q:'Cuenta cómo hace una máquina para aprender a reconocer un nance.',ans:'Se le muestran muchísimas fotos de nances, y alguien le dice en cada una que eso es un nance. La máquina busca qué se repite (pequeño, amarillo) y con eso reconoce los que nunca vio. Con pocas fotos se equivoca; con muchas acierta más.'},
  {q:'Nombra tres cosas de tu casa donde ya hay Inteligencia Artificial y decí qué hace cada una.',ans:'Respuesta abierta. Se valora que nombre cosas de su vida: dictar un mensaje, la cámara que encuentra caras, traducir un letrero, el teclado que adivina la palabra, la música que le recomiendan.'},
  {q:'¿Por qué NO hay que darle a una máquina la dirección de tu casa?',ans:'Porque lo que se escribe en internet puede quedar guardado en otra computadora, y ya no lo controlamos nosotros. Los datos de la casa y de la familia son privados, y no se saben quién los va a leer después.'},
  {q:'Un compañero dice que la computadora es su amiga y que le cuenta todo. ¿Qué le dirías?',ans:'Respuesta abierta. Se valora que explique con respeto que la máquina no siente ni es amiga de nadie, que no entiende lo que le cuentan, y que lo que se le escribe puede quedar guardado.'},
  {q:'La máquina te dijo un dato y no estás seguro. ¿Qué haces, paso por paso?',ans:'Primero lo comparo con lo que ya sé y con mi libro. Después lo busco en el libro o le pregunto a mi maestra o a alguien que lo sepa. Si no lo puedo comprobar, no lo uso en la tarea.'},
  {q:'¿Por qué se dice que la Inteligencia Artificial no es magia?',ans:'Porque no aparece sola: la hicieron personas, con datos y con matemática. Alguien la programó y alguien eligió los ejemplos con que aprendió. Por eso también se puede equivocar.'},
  {q:'Escribe las tres reglas de oro para usar una máquina que aprende.',ans:'No le doy mis datos ni los de mi familia. No le creo sin comprobar. Y si algo me asusta o me confunde, le aviso a una persona grande.'}
];
let ansVisible=false;
function genTask(){sfx('click');const type=document.getElementById('tgType').value;const count=parseInt(document.getElementById('tgCount').value);ansVisible=false;const out=document.getElementById('tgOut');out.innerHTML='';if(type==='identify')genIdentifyTask(out,count);else if(type==='classify')genClassifyTask(out,count);else if(type==='complete')genCompleteTask(out,count);else if(type==='explain')genExplainTask(out,count);fin('s-tareas');}
function _instrBlock(out,title,lines){const ib=document.createElement('div');ib.className='tg-instruction-block';ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join('');out.appendChild(ib);}
function genIdentifyTask(out,count){_instrBlock(out,'Instrucción',['Copia en tu cuaderno; subraya, colorea o encierra la palabra que se pide en cada oración. Escribe al lado qué significa esa palabra.','<strong>Ejemplo:</strong> El teléfono aprendió a reconocer tu cara con muchos ejemplos. → <span style="color:var(--jade);font-weight:700;">ejemplos</span>']);_pick(identifyTaskDB,Math.min(count,identifyTaskDB.length)).forEach((item,i)=>{const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.type}</div></div>`;out.appendChild(div);});}
function genClassifyTask(out,count){_instrBlock(out,'Instrucción',['Copia la siguiente tabla en tu cuaderno. Para cada palabra, escribe qué es, un ejemplo, dónde la ves en tu casa, y haz un dibujo.']);const items=_pick(classifyTaskDB,Math.min(count,classifyTaskDB.length));const wrap=document.createElement('div');wrap.style.overflowX='auto';const th=(t,extra='')=>`<th style="padding:0.3rem 0.4rem;border:1px solid var(--border);font-size:0.72rem;text-align:center;${extra}">${t}</th>`;let html=`<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:520px;"><thead><tr style="background:var(--pri-gl);">${th('Palabra','text-align:left;')}${th('¿Qué es?')}${th('Un ejemplo')}${th('¿Dónde la ves?')}${th('Mi dibujo')}</tr></thead><tbody>`;items.forEach(it=>{html+=`<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td>`+Array(4).fill(`<td style="padding:0.4rem;border:1px solid var(--border);min-width:50px;"></td>`).join('')+'</tr>';});html+='</tbody></table>';wrap.innerHTML=html;out.appendChild(wrap);const ans=document.createElement('div');ans.className='tg-answer';ans.style.marginTop='0.8rem';ans.innerHTML='<strong>✅ Respuestas:</strong><br>'+items.map(it=>`<strong>${it.w}:</strong> Qué es: ${it.gen} | Clase: ${it.n} | Desde cuándo: ${it.g} | Dato: ${it.t}`).join('<br>');out.appendChild(ans);}
function genCompleteTask(out,count){_instrBlock(out,'Instrucción',['Copia y resuelve en tu cuaderno. Cada oración tiene un espacio ___. Elige y escribe la opción correcta.']);const pool=_shuffle([...completeTaskDB]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';const sent=item.s.replace('___','<span class="tg-blank" style="min-width:90px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${sent}</strong><div style="margin-top:0.4rem;font-size:0.82rem;color:var(--gray);">📝 Opciones: <strong>${item.opts.join(' | ')}</strong></div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function genExplainTask(out,count){_instrBlock(out,'Instrucción',['Copia las siguientes preguntas en tu cuaderno y responde cada una de forma clara y completa.']);const pool=_shuffle([...explainQuestions]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.3rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function toggleAns(){ansVisible=!ansVisible;document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none');sfx('click');}

// ===================== SOPA DE LETRAS =====================
const sopaSets=[
  {size:10,grid:[
    ['O','L','P','M','E','J','E','Z','Z','Y'],
    ['G','I','O','G','T','O','A','Y','O','G'],
    ['X','K','T','D','O','R','C','N','L','M'],
    ['L','M','A','L','O','A','Z','A','A','J'],
    ['T','M','D','B','R','C','N','Q','N','E'],
    ['Ñ','A','O','A','K','O','U','S','N','H'],
    ['I','T','Q','T','C','I','M','Y','C','P'],
    ['B','Ñ','V','B','N','V','O','Z','B','O'],
    ['K','U','K','A','U','D','W','Ñ','U','R'],
    ['A','B','Ñ','N','Q','C','Z','U','N','S']
  ],words:[
    {w:'MAQUINA',cells:[[2,9],[3,8],[4,7],[5,6],[6,5],[7,4],[8,3]]},
    {w:'EJEMPLO',cells:[[0,6],[0,5],[0,4],[0,3],[0,2],[0,1],[0,0]]},
    {w:'DATO',cells:[[4,2],[3,2],[2,2],[1,2]]},
    {w:'ROBOT',cells:[[2,5],[3,4],[4,3],[5,2],[6,1]]},
    {w:'CARA',cells:[[2,6],[3,5],[4,4],[5,3]]},
    {w:'VOZ',cells:[[7,5],[7,6],[7,7]]}
  ]},
  {size:10,grid:[
    ['J','T','V','L','M','X','L','G','S','B'],
    ['E','N','E','I','O','Y','D','X','T','R'],
    ['Q','A','N','L','V','V','B','F','E','I'],
    ['G','K','U','F','E','O','T','D','E','B'],
    ['M','A','G','I','A','F','N','Z','T','N'],
    ['F','O','T','O','R','E','O','D','L','C'],
    ['M','F','E','T','R','E','X','N','K','J'],
    ['G','B','K','P','Z','T','G','K','O','Ñ'],
    ['K','X','A','A','A','Ñ','S','L','P','G'],
    ['C','F','R','S','Q','E','G','S','A','Ñ']
  ],words:[
    {w:'APRENDER',cells:[[8,2],[7,3],[6,4],[5,5],[4,6],[3,7],[2,8],[1,9]]},
    {w:'TELEFONO',cells:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8]]},
    {w:'FOTO',cells:[[5,0],[5,1],[5,2],[5,3]]},
    {w:'REGLA',cells:[[5,4],[6,5],[7,6],[8,7],[9,8]]},
    {w:'MAGIA',cells:[[4,0],[4,1],[4,2],[4,3],[4,4]]},
    {w:'VIVO',cells:[[0,2],[1,3],[2,4],[3,5]]}
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
  {q:'La Inteligencia Artificial son programas de computadora.',a:true},
  {q:'Una máquina está viva igual que un perro.',a:false},
  {q:'Para aprender, una máquina necesita muchos ejemplos.',a:true},
  {q:'La computadora siente alegría cuando gana.',a:false},
  {q:'Una instrucción es una orden clara que la máquina obedece.',a:true},
  {q:'Si le enseñamos pocos ejemplos, la máquina se equivoca más.',a:true},
  {q:'La Inteligencia Artificial es magia y nadie sabe cómo funciona.',a:false},
  {q:'Cuando dictamos un mensaje, una máquina convierte la voz en letras.',a:true},
  {q:'Está bien darle a la máquina la dirección de nuestra casa.',a:false},
  {q:'Un robot se enciende y se apaga; un ser vivo no.',a:true},
  {q:'Las máquinas que aprenden las hicieron personas.',a:true},
  {q:'Si la máquina dice algo raro, hay que avisarle a una persona grande.',a:true},
  {q:'Una máquina nunca se equivoca.',a:false},
  {q:'La cámara encuentra caras porque vio muchísimas fotos de caras.',a:true},
  {q:'Todo lo que dice una máquina es cierto.',a:false},
  {q:'Un ejemplo es cada cosa que le mostramos a la máquina para que aprenda.',a:true},
  {q:'Un pino y un zanate son máquinas.',a:false},
  {q:'La máquina puede quedarse con lo que le escribimos.',a:true},
  {q:'Una calculadora come y duerme.',a:false},
  {q:'Un dato es un pedacito de información que se puede guardar.',a:true}
];
const evalMCBank=[
  {q:'¿Qué es la Inteligencia Artificial?',o:['Programas que hacen cosas que antes solo hacían las personas','Un robot que vive en el teléfono','Una persona dentro de la computadora','Un juego de video'],a:0},
  {q:'¿Cuál de estos está VIVO?',o:['Un teléfono','Un pino','Una calculadora','Un robot'],a:1},
  {q:'¿Cómo aprende una máquina a reconocer una cara?',o:['Nació sabiendo','Alguien se la dibujó una vez','Viendo muchísimas fotos de caras','Porque tiene ojos'],a:2},
  {q:'Si a una máquina le enseñamos POCOS ejemplos…',o:['Aprende más rápido','Aprende igual de bien','No pasa nada','Se equivoca más'],a:3},
  {q:'¿La máquina siente alegría o tristeza?',o:['No: es un aparato y no siente nada','Sí, cuando gana','Solo sin batería','Sí, como un perro'],a:0},
  {q:'Una instrucción es…',o:['Un dibujo','Una orden clara que la máquina obedece','Un premio','Una foto'],a:1},
  {q:'Cuando dictas un mensaje y el teléfono lo escribe, ¿qué pasó?',o:['Te leyó la mente','Hay alguien escuchando','Una máquina convirtió tu voz en letras','Fue magia'],a:2},
  {q:'¿Qué NO se le cuenta a una máquina?',o:['Mi color favorito','Qué es un triángulo','Una pregunta de la tarea','La dirección de mi casa'],a:3},
  {q:'La máquina te dio un dato y no estás seguro. ¿Qué haces?',o:['Lo busco en el libro o le pregunto a mi maestra','Le creo, porque es computadora','Se lo cuento a todos','Le pregunto lo mismo otra vez'],a:0},
  {q:'¿Qué es un ejemplo, en Inteligencia Artificial?',o:['Un premio para la máquina','Cada cosa que le mostramos para que aprenda','Un error de la computadora','Un tipo de teléfono'],a:1},
  {q:'¿Por qué se dice que la Inteligencia Artificial NO es magia?',o:['Porque no funciona','Porque solo sirve de noche','Porque son datos y matemática, y alguien la hizo','Porque es muy cara'],a:2},
  {q:'¿Qué hace que algo sea un ser vivo?',o:['Que tenga colores','Que se encienda','Que haga ruido','Que nazca, crezca, se alimente y muera'],a:3},
  {q:'¿Quién elige los ejemplos con que aprende una máquina?',o:['Nadie, los busca sola','Personas','El sol','La batería'],a:1},
  {q:'Si algo en la pantalla te asusta o te confunde, ¿qué haces?',o:['Le aviso a una persona grande','Lo comparto con mis amigos','Apago todo y no digo nada','Le contesto a la máquina'],a:0},
  {q:'¿Cuál de estas cosas SÍ hace una máquina con Inteligencia Artificial?',o:['Sentir cariño','Tener hambre','Traducir un letrero','Crecer'],a:2}
];
const evalCPBank=[
  {q:'Los programas que hacen cosas que antes solo hacían las personas se llaman Inteligencia ___.',a:'Artificial'},
  {q:'Una máquina no está ___.',a:'viva'},
  {q:'Para aprender, la máquina necesita muchos ___.',a:'ejemplos'},
  {q:'Una orden clara que la máquina obedece se llama ___.',a:'instrucción'},
  {q:'La computadora no ___ nada: es un aparato.',a:'siente'},
  {q:'Con pocos ejemplos, la máquina se ___ más.',a:'equivoca'},
  {q:'La Inteligencia Artificial no es ___.',a:'magia'},
  {q:'Si algo me asusta, le aviso a una ___ grande.',a:'persona'},
  {q:'Un pedacito de información que se puede guardar es un ___.',a:'dato'},
  {q:'Un perro está vivo; un robot es una ___.',a:'máquina'},
  {q:'La cámara encuentra ___ porque vio muchísimas fotos de ellas.',a:'caras'},
  {q:'La dirección de mi casa ___ se le cuenta a la máquina.',a:'no'},
  {q:'Antes de creerle un dato a la máquina, hay que ___.',a:'comprobar'},
  {q:'Las máquinas que aprenden las hicieron ___.',a:'personas'},
  {q:'Un ser vivo nace, crece, se alimenta y ___.',a:'muere'}
];
const evalPRBank=[
  {term:'Inteligencia Artificial',def:'Programas que hacen cosas que antes solo hacían las personas'},
  {term:'Máquina',def:'Una cosa hecha por personas para hacer un trabajo'},
  {term:'Instrucción',def:'Una orden clara que la máquina obedece'},
  {term:'Ejemplo',def:'Cada cosa que le mostramos a la máquina para que aprenda'},
  {term:'Dato',def:'Un pedacito de información que se puede guardar'},
  {term:'Ser vivo',def:'Nace, crece, se alimenta y muere'},
  {term:'Robot',def:'Una máquina que se mueve y hace un trabajo'},
  {term:'Cámara',def:'La parte del teléfono que toma las fotos'},
  {term:'Voz',def:'Lo que la máquina convierte en letras cuando dictas'},
  {term:'Traducir',def:'Pasar un texto de un idioma a otro'},
  {term:'Equivocarse',def:'Lo que le pasa a la máquina cuando tuvo pocos ejemplos'},
  {term:'Comprobar',def:'Buscar el dato en el libro o preguntarle a quien lo sabe'},
  {term:'Privado',def:'Lo que es solo tuyo y de tu familia, y no se comparte'},
  {term:'Magia',def:'Lo que la Inteligencia Artificial NO es'},
  {term:'Persona grande',def:'A quien le avisas si algo te asusta o te confunde'}
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

function genEval(){sfx('click');_evalFormaSelector(); const _selF = document.getElementById('evalFormaSel'); if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10))); const cf = evalFormNum; const rng = _evalRng(cf); window._currentEvalForm=cf;evalFormNum = (evalFormNum % EVAL_FORMAS) + 1; _evalFormaSelector();saveProgress();document.getElementById('eval-screen-title').textContent=`🎓 Evaluación Final · Forma ${cf} · ¿Qué es la Inteligencia Artificial?`;evalAnsVisible=false;const out=document.getElementById('evalOut');out.innerHTML='';const bar=document.createElement('div');bar.className='eval-score-bar';bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje · 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25 pts</span><span class="eval-score-pill esp-tf">V/F 25 pts</span><span class="eval-score-pill esp-mc">Selección 25 pts</span><span class="eval-score-pill esp-pr">Pareados 25 pts</span></div>`;out.appendChild(bar);const cpItems=_pickF(evalCPBank,5, rng);const s1=document.createElement('div');s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';cpItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='cp';d.dataset.evalIndex=i;const qHtml=item.q.replace('___',`<input class="eval-cp-input" type="text" data-cp="${i}" autocomplete="off">`);d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbCp${i}" aria-live="polite"></div>`;s1.appendChild(d);});out.appendChild(s1);const tfItems=_pickF(evalTFBank,5, rng);const s2=document.createElement('div');s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';tfItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='tf';d.dataset.evalIndex=i;d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="true"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="false"> Falso</label></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbTf${i}" aria-live="polite"></div>`;s2.appendChild(d);});out.appendChild(s2);const mcItems=_pickF(evalMCBank,5, rng);const s3=document.createElement('div');s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';mcItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='mc';d.dataset.evalIndex=i;const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join('');d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbMc${i}" aria-live="polite"></div>`;s3.appendChild(d);});out.appendChild(s3);const prItems=_pickF(evalPRBank,5, rng);const shuffledDefs=_shuffleF(prItems, rng);const letters=['A','B','C','D','E'];const s4=document.createElement('div');s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';const matchCard=document.createElement('div');matchCard.className='eval-item';let colLeft='<div class="eval-match-col"><h4>📌 Términos</h4>';prItems.forEach((item,i)=>{colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> <select class="eval-match-select" data-pr="${i}" aria-label="Respuesta pareada ${i+16}"><option value="">—</option>${letters.map(l=>`<option value="${l}">${l}</option>`).join('')}</select> ${item.term}</div>`;});colLeft+='</div>';let colRight='<div class="eval-match-col"><h4>🔑 Definiciones</h4>';shuffledDefs.forEach((item,i)=>{colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`;});colRight+='</div>';const ansKey=prItems.map((item,i)=>{const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)];return`${i+16}→${letter}`;}).join(' · ');matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div><div class="eval-item-feedback" id="evalFbPr" aria-live="polite"></div>`;s4.appendChild(matchCard);out.appendChild(s4);window._evalPrintData={tf:tfItems,mc:mcItems,cp:cpItems,pr:{terms:prItems,shuffledDefs,letters}};const autoPanel=document.createElement('div');autoPanel.id='evalAutoResult';autoPanel.className='eval-auto-result';autoPanel.innerHTML='<strong>🧮 Evaluación interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato original sin respuestas digitadas.';out.appendChild(autoPanel);fin('s-evaluacion');}
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación ¿Qué es la Inteligencia Artificial? · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.12rem 0.4rem;margin:0.22rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #86198f;background:#fdf4ff;color:#86198f;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#86198f;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #86198f;height:12px;}.obt-pct{white-space:nowrap;}.qn{font-weight:700;min-width:22px;flex-shrink:0;}.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:40px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.18rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.14rem 0.35rem;margin-bottom:0.1rem;break-inside:avoid;page-break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.3;display:flex;gap:0.28rem;margin-bottom:0.07rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.1rem 0.5rem;}.mc-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:0.04rem 0.15rem;margin-left:0.8rem;}.mc-opt{font-size:9pt;display:flex;align-items:center;gap:0.15rem;}.mc-opt input{width:10px;height:10px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{margin-top:0.1rem;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.08rem 0.4rem;margin-top:0.08rem;}.pr-head{font-size:9pt;font-weight:700;color:#555;margin-bottom:0.1rem;}.pr-item{font-size:10.5pt;padding:0.1rem 0.28rem;background:#fdf4ff;border-radius:3px;margin-bottom:0.07rem;display:flex;align-items:center;gap:0.2rem;line-height:1.2;break-inside:avoid;page-break-inside:avoid;}.pr-num{font-weight:700;color:#86198f;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.22rem;padding:0.15rem 0;page-break-before:avoid;break-before:avoid;color:#86198f;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #86198f;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#555;}.pa{color:#007a00;font-weight:600;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · ¿Qué es la Inteligencia Artificial? · Educación Básica · I Ciclo · Inteligencia Artificial</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Evaluación Final · ¿Qué es la Inteligencia Artificial? · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u</div></div><div class="p-grid">${pR}</div>
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
  {txt:'Un compañero dice que su teléfono lo quiere, porque le contesta cuando le habla.'},
  {txt:'Una niña le escribe a un chat la dirección de su casa para que le diga cuánto falta para la escuela.'},
  {txt:'Un niño copia en su tarea un dato que le dio una máquina, sin buscarlo en el libro.'},
  {txt:'Alguien dice que la Inteligencia Artificial es magia y que por eso nadie la puede entender.'},
  {txt:'Un compañero le enseñó a un programa solo tres fotos de nances y se enoja porque se equivoca.'},
  {txt:'Un niño sube al internet una foto de todos sus compañeros sin preguntarles.'}
];
const critCaseQuestions=[
  '1. ¿Qué está pasando en este caso?',
  '2. ¿Está bien o está mal? ¿Por qué?',
  '3. ¿Qué tendría que haber hecho esa persona?',
  '4. ¿Qué le explicarías tú para que le quede claro?'
];
const critCaseGuides=[
  'Se valora que el alumno reconozca de qué trata: una máquina que parece persona, un dato privado, un dato sin comprobar, o pocos ejemplos.',
  'Se valora que distinga lo que la máquina HACE de lo que la gente CREE que hace: no siente, no sabe todo, y se equivoca con lo que no le enseñaron.',
  'Cada caso tiene su salida concreta: no darle datos de la casa, comprobar el dato en el libro, darle más ejemplos, o pedir permiso antes de subir una foto de alguien.',
  'Respuesta abierta. Se valora que lo explique con respeto y con un ejemplo de su vida, no que se burle del compañero.'
];
const critErrorBank=[
  {txt:'"Mi teléfono me quiere porque me contesta."',
   g1:'Una máquina no siente nada. Contesta porque alguien la programó y porque vio muchísimos ejemplos de conversaciones.',
   g2:'Que algo conteste como una persona no significa que entienda ni que sienta.'},
  {txt:'"Si la computadora lo dijo, es verdad."',
   g1:'Las máquinas se equivocan, sobre todo con lo que no estaba en sus ejemplos.',
   g2:'Un dato se comprueba en el libro o con alguien que lo sabe.'},
  {txt:'"La Inteligencia Artificial apareció sola, por magia."',
   g1:'La hicieron personas, con datos y con matemática.',
   g2:'Alguien la programó y alguien eligió los ejemplos con que aprendió.'},
  {txt:'"Con dos o tres ejemplos la máquina ya aprende bien."',
   g1:'Con pocos ejemplos se equivoca mucho: le falta ver de todo.',
   g2:'Mientras más ejemplos buenos y variados, mejor reconoce lo que nunca vio.'},
  {txt:'"Puedo subir la foto de mis compañeros, total no dice sus nombres."',
   g1:'Una foto de otra persona no es tuya para subirla: hay que pedir permiso.',
   g2:'Lo que se sube puede quedar guardado y ya no se controla quién lo ve.'},
  {txt:'"Un robot está vivo porque se mueve."',
   g1:'Moverse no es estar vivo: un ventilador se mueve y no está vivo.',
   g2:'Lo vivo nace, crece, se alimenta y muere. El robot se enciende y se apaga.'}
];
const critDecisionBank=[
  'Un chat te pide tu nombre completo y tu escuela para «conocerte mejor»; conviene escribirlos, o no darlos y seguir sin eso.',
  'La máquina te dio un dato para la tarea; conviene copiarlo tal cual, o buscarlo primero en tu libro.',
  'Un compañero está asustado por un mensaje raro que le llegó; conviene decirle que no haga caso, o acompañarlo a avisarle a la maestra.',
  'Le enseñaste cinco ejemplos a un programa y se equivoca; conviene enojarse y dejarlo, o darle más ejemplos y volver a probar.',
  'Quieres subir una foto donde salen tus compañeros; conviene subirla porque están contentos, o preguntarles antes a ellos.'
];
const critDecisionGuide='La mejor decisión cuida a las personas y comprueba lo que se dice: los datos de la casa y de la familia no se dan, un dato se busca en el libro antes de copiarlo, un susto se cuenta a una persona grande, una máquina que se equivoca necesita más ejemplos, y una foto donde sale otra persona se sube solo con su permiso.';
const critCompareBank=[
  {a:'Un perro.',b:'Un robot.',
   ga:'Es un ser vivo: nace, crece, come, siente y muere.',
   gb:'Es una máquina: la hicieron personas, se enciende y se apaga.',
   gr:'Los dos se mueven y los dos pueden aprender cosas, pero moverse no es estar vivo. Al perro no hay que enseñarle a tener hambre; al robot hay que enseñarle todo.'},
  {a:'Una instrucción.',b:'Un ejemplo.',
   ga:'Es una orden clara que la máquina obedece.',
   gb:'Es una cosa que le mostramos para que aprenda sola.',
   gr:'Con instrucciones le decimos QUÉ hacer paso por paso. Con ejemplos no se lo decimos: ella busca lo que se repite y lo aprende. Las dos maneras sirven, pero no son lo mismo.'},
  {a:'Mi color favorito.',b:'La dirección de mi casa.',
   ga:'Se lo puedo contar a una máquina sin problema.',
   gb:'No se lo cuento nunca a una máquina.',
   gr:'Los dos son datos míos, pero uno no le sirve a nadie para hacerme daño y el otro sí. Lo que dice dónde vivo, quién es mi familia o dónde estudio se queda en casa.'}
];
const critCauseBank=[
  {cause:'Le enseñamos a la máquina miles de fotos de caras.',guide:'Por eso ahora encuentra caras en fotos que nunca vio.'},
  {cause:'Solo le enseñamos tres ejemplos.',guide:'Por eso se equivoca tanto: le faltó ver de todo.'},
  {cause:'La máquina es un aparato y no tiene sentimientos.',guide:'Por eso no se pone triste ni te quiere, aunque te conteste bonito.'},
  {cause:'Lo que se escribe en internet puede quedar guardado.',guide:'Por eso no le damos a la máquina los datos de nuestra casa ni de nuestra familia.'},
  {cause:'Las máquinas las hicieron personas, con datos y matemática.',guide:'Por eso no es magia, y por eso también se puede equivocar.'}
];
const critEffectBank=[
  {effect:'El teléfono escribe lo que le dictas.',guide:'Porque una máquina oyó millones de voces antes de oír la tuya.'},
  {effect:'La máquina no reconoce un nance.',guide:'Porque nadie le enseñó fotos de nances: no estaba en sus ejemplos.'},
  {effect:'No hay que creerle todo a una máquina.',guide:'Porque contesta con la misma seguridad cuando sabe y cuando se equivoca.'},
  {effect:'Un robot no se cansa nunca.',guide:'Porque no está vivo: no siente sueño, ni hambre, ni dolor.'},
  {effect:'Una foto de tus compañeros no se sube sin preguntarles.',guide:'Porque esa foto también es de ellos, y ellos deciden si se comparte.'}
];
function genEvalCrit(){
  sfx('click');
  _injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });
  const _sC = document.getElementById('evalCritFormaSel');
  if (_sC && parseInt(_sC.value, 10)) evalCritFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sC.value, 10)));
  const cf=evalCritFormNum;window._currentEvalCritForm=cf;const rngC = _evalRng(200000 + cf);evalCritFormNum=(evalCritFormNum%EVAL_FORMAS)+1;_injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });saveProgress();
  document.getElementById('evalcrit-screen-title').textContent=`🧠 Pensamiento Crítico · Forma ${cf} · ¿Qué es la Inteligencia Artificial?`;
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
  s3.innerHTML=`<div class="eval-section-title">III. Toma de decisiones: la ley y la rendición de cuentas <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${dec}</div><div class="crit-q-block"><div class="crit-q-label">¿Qué opción recomendarías? Explica por qué, relacionándolo con lo que hace cada poder del Estado y con la rendición de cuentas.</div><textarea class="crit-textarea" rows="4" aria-label="Recomendaciones y su justificación"></textarea><div class="crit-pauta">${critDecisionGuide}</div></div><div class="crit-selfscore"><label for="critScore2">Obtenido:</label><input type="number" id="critScore2" class="crit-score-input" data-score="2" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
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
  let s3=`<div class="sec-title"><span>III. Toma de decisiones: la ley y la rendición de cuentas</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.dec}</p><p class="crit-print-q">¿Qué opción recomendarías? Explica por qué, relacionándolo con lo que hace cada poder del Estado y con la rendición de cuentas.</p>${lines(2)}`;
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
  const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Pensamiento Crítico ¿Qué es la Inteligencia Artificial? · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.1rem 0.4rem;margin:0.2rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #86198f;background:#fdf4ff;color:#86198f;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#86198f;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #86198f;height:12px;}.obt-pct{white-space:nowrap;}.crit-print-scenario{font-size:10.5pt;background:#fdf4ff;border-left:3px solid #86198f;padding:0.2rem 0.5rem;margin:0.1rem 0 0.2rem;line-height:1.3;}.crit-print-q{font-size:10pt;font-weight:600;margin:0.15rem 0 0.08rem;line-height:1.25;}.ln{border-bottom:1px solid #111;min-height:12px;margin-bottom:2px;}.crit-compare-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin:0.15rem 0;}.crit-compare-print-box{font-size:9.5pt;background:#fdf4ff;border-radius:4px;padding:0.25rem 0.4rem;line-height:1.25;}.crit-print-tbl{width:100%;border-collapse:collapse;font-size:9.5pt;margin-top:0.15rem;}.crit-print-tbl th,.crit-print-tbl td{border:1px solid #999;padding:0.3rem 0.45rem;text-align:left;height:30px;vertical-align:middle;}.crit-print-tbl th{background:#fdf4ff;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.08rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.9rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.45rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.1rem;margin-bottom:0.18rem;}.p-crit-line{font-size:11pt;color:#007a00;margin-bottom:0.18rem;line-height:1.35;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.2rem;padding:0.1rem 0;color:#86198f;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #86198f;}.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:12.7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="critEvalPage"><div class="ph"><h2>Evaluación Competencial · Pensamiento Crítico · ¿Qué es la Inteligencia Artificial? · Educación Básica · I Ciclo · Inteligencia Artificial</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 5 secciones de 20 puntos</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100</span></div></div><div class="pauta-wrap" id="critPautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Pensamiento Crítico · ¿Qué es la Inteligencia Artificial? · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 5 secciones × 20 pts c/u — respuesta abierta, usar como guía de corrección</div></div><div class="p-grid">${pR}</div></div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("critEvalPage",250,0.55,1.2);fit("critPautaPage",250,0.55,1.2);})();<\/script></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(doc);win.document.close();setTimeout(()=>win.print(),400);
}

// ===================== LABORATORIO DE LOS SÍMBOLOS =====================
const parteData = (function () {
  /* El Laboratorio se arma del vocabulario común de la ruta, no de un texto
     escrito aquí: así la definición que ve el alumno en el Lab es la misma que
     ve en las flashcards, en la ficha impresa y en las otras tres misiones. */
  const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const out = {};
  const claves = ['ia','maquina','ejemplo','instruccion'];
  claves.forEach(k => {
    const c = IA_CONCEPTOS.find(x => x.clave === k);
    const uso = IA_APLICACIONES[claves.indexOf(k)];
    out[k] = {
      nombre: c.palabra, icon: c.emoji,
      estructura: { title: '¿Qué es?',        info: '<strong>' + esc(c.corta) + '</strong><br><br>' + esc(c.definicion) },
      funcion:    { title: '¿Para qué sirve?', info: esc(c.ejemplo) },
      ubicacion:  { title: '¿Dónde lo ves?',   info: uso.emoji + ' <strong>' + esc(uso.que) + '</strong><br><br>' + esc(uso.como) },
      dato:       { title: 'Para acordarte',   info: '💡 ' + esc(IA_MITOS[claves.indexOf(k)].mito) + '<br><br><strong>La verdad:</strong> ' + esc(IA_MITOS[claves.indexOf(k)].verdad) }
    };
  });
  return out;
})();
let labParte='ia',labAspecto='estructura';
function labShowParte(parteKey){labParte=parteKey;updateLabDisplay();document.querySelectorAll('.lab-cont-btn').forEach(b=>b.classList.remove('active-pri'));const btn=document.querySelector(`[data-parte="${parteKey}"]`);if(btn)btn.classList.add('active-pri');if(typeof sfx==='function')sfx('click');}
function labShowAspecto(aspectoKey){labAspecto=aspectoKey;updateLabDisplay();document.querySelectorAll('.lab-asp-btn').forEach(b=>b.classList.remove('active-sec'));const btn=document.querySelector(`[data-aspecto="${aspectoKey}"]`);if(btn)btn.classList.add('active-sec');if(typeof sfx==='function')sfx('click');}
function updateLabDisplay(){const data=parteData[labParte];const asp=data[labAspecto];document.getElementById('lab-sentence').innerHTML=`🔬 Explorando: <strong>${data.nombre}</strong> → <strong>${asp.title}</strong>`;document.getElementById('lab-display').innerHTML=`<div class="lab-cont-header">${data.icon} ${data.nombre}</div><div class="lab-asp-title">${asp.title}</div><div class="lab-asp-info">${asp.info}</div>`;}

// ===================== DIPLOMA =====================
function _diplPct(){return xp>=MXP?100:Math.round((xp/MXP)*100);}
function openDiploma(){sfx('fan');const pct=_diplPct();document.getElementById('diplPct').textContent=pct+'%';document.getElementById('diplBar').style.width=pct+'%';document.getElementById('diplDate').textContent='Fecha: '+new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});const msgs=['¡Sigue aprendiendo!','¡Muy buen trabajo!','¡Vas muy bien!','¡Conoces a los que hicieron Honduras!','¡Guardián de la Patria!'];document.getElementById('diplMsg').textContent=msgs[Math.min(Math.floor(pct/25),4)];const stars=['⭐','⭐⭐','⭐⭐⭐'];document.getElementById('diplStars').textContent=stars[Math.min(Math.floor(pct/40),2)];const achTxt=unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(' · ');document.getElementById('diplAch').textContent=achTxt||'Sigue completando secciones para desbloquear logros';document.getElementById('diplomaOverlay').classList.add('open');launchConfetti();}
function closeDiploma(){document.getElementById('diplomaOverlay').classList.remove('open');}
function updateDiplomaName(v){document.getElementById('diplName').textContent=v||'Estudiante';}
function shareWA(){const name=document.getElementById('diplName').textContent||'Estudiante';const pct=_diplPct();const msg=`🧠 ¡${name} completó la Misión "¿Qué es la Inteligencia Artificial?"! 🏅 Progreso: ${pct}% · 🌱 policastsapien.com`;_waShare(msg);}
async function captureDiploma(){if(typeof html2canvas==='undefined'){showToast('⚠️ Cargando... intenta de nuevo');return;}sfx('click');const card=document.querySelector('.diploma-card');const btn=document.querySelector('.diploma-actions .btn-pri');const toHide=[card.querySelector('.diploma-input'),card.querySelector('.diploma-actions'),card.querySelector('hr')];if(btn){btn.disabled=true;btn.textContent='⏳ Capturando...';}toHide.forEach(el=>{if(el)el.style.display='none';});let dataUrl='';try{const canvas=await html2canvas(card,{scale:2,useCORS:true,backgroundColor:'#ffffff'});toHide.forEach(el=>{if(el)el.style.display='';});dataUrl=canvas.toDataURL('image/png');const name=(document.getElementById('diplName').textContent||'Estudiante').replace(/\s+/g,'-');const fileName='constancia-'+name+'.png';const cap=window.Capacitor;if(cap&&cap.isNativePlatform&&cap.isNativePlatform()&&cap.Plugins?.Filesystem&&cap.Plugins?.Share){const base64Data=dataUrl.split(',')[1];const result=await cap.Plugins.Filesystem.writeFile({path:fileName,data:base64Data,directory:'CACHE'});await cap.Plugins.Share.share({url:result.uri,dialogTitle:'Guardar / Compartir Constancia'});}else{const a=document.createElement('a');a.href=dataUrl;a.download=fileName;a.click();}}catch(e){toHide.forEach(el=>{if(el)el.style.display='';});if(e.name!=='AbortError')showToast('⚠️ No se pudo guardar la constancia');}finally{if(btn){btn.disabled=false;btn.textContent='📷 Guardar foto';}}}

// ===================== INIT =====================

// ===================== LA MÁQUINA, EN LA PANTALLA =====================
/* Las aplicaciones, los mitos, las reglas de oro y el vocabulario se PINTAN
   desde js/data/ia-conceptos.js, no se escriben en el HTML. Es la lección de
   la misión del Himno y de la de los próceres: el mismo texto acaba en la
   pantalla y en la ficha que se fotocopia, y si cada uno lleva su copia, un día
   dejan de decir lo mismo y el alumno estudia algo que el examen no acepta.
   De ahí sale también `_dev/verifica-ia.js`. */
function _esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

function pintarIaAplicaciones(){
  const cont=document.getElementById('ia-aplicaciones');if(!cont)return;
  const tonos=['tc-teal','tc-gold','tc-jade','tc-purple'];
  cont.innerHTML=IA_APLICACIONES.map((a,i)=>
    `<div class="type-chip ${tonos[i%tonos.length]}"><div class="t-art">${a.emoji} ${_esc(a.que)}</div><div class="t-info">${_esc(a.como)}</div></div>`
  ).join('');
}

function pintarIaMitos(){
  const cont=document.getElementById('ia-mitos');if(!cont)return;
  cont.innerHTML=IA_MITOS.map(m=>
    `<div class="ia-mito"><div class="ia-mito-no">❌ <span>«${_esc(m.mito)}»</span></div><div class="ia-mito-si">✅ <span>${_esc(m.verdad)}</span></div></div>`
  ).join('');
}

function pintarIaReglas(){
  const cont=document.getElementById('ia-reglas');if(!cont)return;
  cont.innerHTML=IA_REGLAS_ORO.map((r,i)=>
    `<div class="ia-regla"><div class="ia-regla-n">${r.emoji}</div><div><h4>${i+1}. ${_esc(r.regla)}</h4><p>${_esc(r.porque)}</p></div></div>`
  ).join('');
}

function pintarIaVocabulario(){
  const cont=document.getElementById('ia-vocabulario');if(!cont)return;
  cont.innerHTML=IA_CONCEPTOS.filter(c=>c.ciclo===1).map(c=>
    `<div class="type-chip tc-purple"><div class="t-art">${c.emoji} ${_esc(c.palabra)}</div><div class="t-info">${_esc(c.corta)}</div></div>`
  ).join('');
}

// ═════════════ 🍎 ENSÉÑALE A LA MÁQUINA ═════════════
/* La interacción que sostiene esta misión, y la razón de que exista: el niño
   NO lee que la máquina se equivoca con lo que no le enseñaron. Lo comprueba.

   CÓMO DECIDE LA MÁQUINA, y está escrito así para que sea verdad y no un truco:
   busca, entre TODOS los ejemplos que el niño le enseñó, al que más se parece
   (por color y por tamaño) y le pone ese mismo nombre. Se llama «el vecino más
   cercano», es de los métodos más viejos que hay, y tiene la ventaja de que se
   le puede explicar a alguien de siete años con una sola frase: «le pone el
   nombre del que más se le parece».

   ⚠️ Y AQUÍ ESTÁ LA LECCIÓN, QUE COSTÓ REHACER EL JUEGO ENTERO. La primera
   versión promitía que «con pocos ejemplos se equivoca más» y NO ERA VERDAD:
   nances y anonas son tan distintos que con uno de cada uno ya los separaba
   perfectamente. Medido en el navegador: con dos ejemplos acertaba las cuatro.
   Un juego que promete una cosa y hace otra enseña a no creerle a la pantalla,
   que es justo lo contrario de esta misión.

   Lo que SÍ es verdad, y es lo que ahora enseña: no importa CUÁNTOS ejemplos,
   importa CUÁLES. Los ocho primeros son nances chiquitos y anonas grandotas;
   los dos últimos son los raros (un nance grande y una anona mediana), y son
   justo los que el examen le va a poner. Quien para en el octavo falla los dos,
   por muchos que le haya enseñado.

   Y se guarda LO QUE EL NIÑO DIJO, no lo correcto: si le pone el nombre
   cambiado, la máquina aprende cambiado, y la pantalla se lo dice con esas
   palabras. No hay red: todo pasa dentro del teléfono. */
const IA_FRUTAS_ENSENAR=[
  {e:'🟡',n:'chiquita y bien amarilla',color:1,tam:1,clase:'nance'},
  {e:'🟢',n:'grandota y verde',color:6,tam:6,clase:'anona'},
  {e:'🟡',n:'amarilla y medianita',color:2,tam:2,clase:'nance'},
  {e:'🟢',n:'verde y grande',color:5,tam:5,clase:'anona'},
  {e:'🟡',n:'amarilla y pequeñita',color:1,tam:2,clase:'nance'},
  {e:'🫒',n:'verde oscuro y grande',color:6,tam:5,clase:'anona'},
  {e:'🟠',n:'anaranjada y chiquita',color:2,tam:1,clase:'nance'},
  {e:'🥝',n:'verdosa y grandota',color:5,tam:6,clase:'anona'},
  /* Las dos raras, y van al final a propósito: son las que enseñan la lección.
     Se describen con la pista puesta para que el niño pueda etiquetarlas bien;
     si aun así le pone el nombre cambiado, la pantalla se lo avisa y la máquina
     aprende ese error, que también hay que poder verlo. */
  {e:'🟠',n:'anaranjada y GRANDE, de las de la costa: aunque sea grande, es un nance',color:2,tam:5,clase:'nance'},
  {e:'🟢',n:'verde y MEDIANA, de las que no acabaron de crecer: es una anona',color:5,tam:3,clase:'anona'}
];
/* Cuatro frutas que nunca vio. Las dos primeras son de las comunes; las dos
   últimas son del tipo de las raras, que es lo que la máquina solo acierta si
   le enseñaron un ejemplo parecido. */
const IA_FRUTAS_PROBAR=[
  {e:'🟡',n:'amarilla y chiquita',color:1,tam:3,clase:'nance'},
  {e:'🟢',n:'verde y grandota',color:6,tam:4,clase:'anona'},
  {e:'🟠',n:'anaranjada y bien grande',color:2,tam:6,clase:'nance'},
  {e:'🟢',n:'verde y pequeñita',color:5,tam:1,clase:'anona'}
];
let iaEnsIdx=0, iaEnsenados=[], iaEnsFase='ensenar';

function iaEnsPintar(){
  const caja=document.getElementById('ens-caja'); if(!caja) return;
  const cuenta=document.getElementById('ens-cuenta');
  const nan=iaEnsenados.filter(x=>x.clase==='nance').length;
  const ano=iaEnsenados.filter(x=>x.clase==='anona').length;
  if(cuenta) cuenta.innerHTML='🍎 Le enseñaste <strong>'+iaEnsenados.length+'</strong> de '+IA_FRUTAS_ENSENAR.length+
    ' ejemplos: '+nan+' con el nombre «nance» y '+ano+' con el nombre «anona».';
  if(iaEnsFase==='probar'){ return; }
  if(iaEnsIdx>=IA_FRUTAS_ENSENAR.length){
    caja.innerHTML='<p class="ens-listo">✅ Ya le enseñaste las diez. Ahora toca <strong>🤖 Probar la máquina</strong>.</p>';
    return;
  }
  const f=IA_FRUTAS_ENSENAR[iaEnsIdx];
  caja.innerHTML=
    '<div class="ens-fruta" aria-hidden="true">'+f.e+'</div>'+
    '<p class="ens-desc">Esta fruta es <strong>'+_esc(f.n)+'</strong>. ¿Qué es?</p>'+
    '<div class="ens-btns">'+
      '<button class="btn btn-pri" onclick="iaEnsenar(\'nance\')">🟡 Es un nance</button>'+
      '<button class="btn btn-sec" onclick="iaEnsenar(\'anona\')">🟢 Es una anona</button>'+
    '</div>';
}

function iaEnsenar(clase){
  const f=IA_FRUTAS_ENSENAR[iaEnsIdx]; if(!f) return;
  sfx(clase===f.clase?'ok':'no');
  if(clase!==f.clase){
    fb('fbEns','Ojo: esa era '+(f.clase==='nance'?'un nance':'una anona')+'. La máquina va a aprender lo que tú le dijiste, aunque esté mal.',false);
  } else {
    fb('fbEns','¡Bien! La máquina ya se lo guardó.',true);
  }
  /* Se guarda la etiqueta QUE PUSO EL NIÑO y, aparte, la verdadera: la primera
     es con la que la máquina va a decidir; la segunda solo sirve para poder
     explicarle después POR QUÉ falló. */
  iaEnsenados.push({color:f.color,tam:f.tam,clase:clase,real:f.clase});
  iaEnsIdx++;
  if(!xpTracker.wgt.has('ens_'+iaEnsIdx)){xpTracker.wgt.add('ens_'+iaEnsIdx);pts(1);}
  iaEnsPintar();
}

/* El vecino más cercano: de todo lo que le enseñaron, el que más se le parece. */
function iaEnsVecino(f){
  let mejor=null, dm=Infinity;
  iaEnsenados.forEach(x=>{
    const d=Math.hypot(f.color-x.color, f.tam-x.tam);
    if(d<dm){dm=d;mejor=x;}
  });
  return mejor;
}

function iaEnsProbar(){
  const caja=document.getElementById('ens-caja'); if(!caja) return;
  sfx('click');
  const clases=[...new Set(iaEnsenados.map(x=>x.clase))];
  if(clases.length<2){
    /* Con una sola clase enseñada no hay nada que decidir, y el aviso va en la
       franja de mensajes y NO dentro de la caja: si se pintara ahí, la llamada
       siguiente lo borraría al traer la fruta que toca enseñar, y el niño
       vería parpadear un texto que no llega a leer. */
    iaEnsFase='ensenar';
    fb('fbEns','🤖 «No puedo. '+
      (clases.length?'Solo me enseñaste '+(clases[0]==='nance'?'nances':'anonas')+': de lo otro no vi ni un ejemplo, así que para mí no existe.':'No me enseñaste ni un ejemplo.')+
      '» Sigue enseñándole y prueba otra vez.',false);
    iaEnsPintar();
    return;
  }
  iaEnsFase='probar';
  let ok=0; const fallaron=[];
  const filas=IA_FRUTAS_PROBAR.map(f=>{
    const v=iaEnsVecino(f);
    const dice=v.clase;
    const bien=dice===f.clase; if(bien) ok++; else fallaron.push(f);
    return '<div class="ens-fila '+(bien?'ens-ok':'ens-no')+'">'+
      '<span class="ens-mini">'+f.e+'</span>'+
      '<span class="ens-txt">'+_esc(f.n)+'</span>'+
      '<span class="ens-dice">dice: <strong>'+dice+'</strong> '+(bien?'✅':'❌')+'</span></div>';
  }).join('');
  const total=IA_FRUTAS_PROBAR.length;
  const equivocados=iaEnsenados.filter(x=>x.clase!==x.real).length;
  let mensaje;
  if(ok===total){
    mensaje='🎉 <strong>¡Las acertó todas!</strong> A cada una le puso el nombre del ejemplo que más se le parecía, y le acertó. Eso pasa porque entre tus ejemplos había uno parecido a cada una.';
  } else if(equivocados){
    mensaje='😕 <strong>Falló '+(total-ok)+' de '+total+'.</strong> Y mira por qué: a <strong>'+equivocados+
      '</strong> de tus ejemplos les pusiste el nombre cambiado, así que la máquina aprendió eso. '+
      '<strong>Ella no se equivocó: aprendió exactamente lo que tú le enseñaste.</strong> Toca «Empezar de nuevo» y prueba con cuidado.';
  } else if(iaEnsIdx<IA_FRUTAS_ENSENAR.length){
    mensaje='🤔 <strong>Falló '+(total-ok)+' de '+total+'.</strong> Y fíjate CUÁLES: la '+
      fallaron.map(f=>'<em>'+_esc(f.n)+'</em>').join(' y la ')+'. '+
      'Todos tus ejemplos eran nances chiquitos y anonas grandotas, así que a estas dos las midió contra los que no se les parecen. '+
      '<strong>No es cuántos ejemplos le enseñes: es CUÁLES.</strong> Sigue hasta el final, que faltan los raros, y vuelve a probar.';
  } else {
    mensaje='🤔 <strong>Falló '+(total-ok)+' de '+total+'.</strong> Revisa los nombres que les pusiste: la máquina contesta lo más parecido a lo que tú le enseñaste.';
  }
  caja.innerHTML='<p class="ens-desc">🤖 La máquina probó con <strong>cuatro frutas que nunca vio</strong>. A cada una le puso el nombre de la que más se le parecía:</p>'+filas+
    '<p class="ens-listo">'+mensaje+'</p>';
  if(ok===total){ fb('fbEns','¡Aprendió! +4 XP',true); sfx('fan');
    if(!xpTracker.wgt.has('ens_fin')){xpTracker.wgt.add('ens_fin');pts(4);}
    fin('s-estructura'); unlockAchievement('entrenador');
  } else { fb('fbEns','Acertó '+ok+' de '+total+'. Lee abajo por qué.',false); sfx('no'); }
}

function iaEnsReiniciar(){
  sfx('click'); iaEnsIdx=0; iaEnsenados=[]; iaEnsFase='ensenar';
  const el=document.getElementById('fbEns'); if(el) el.classList.remove('show');
  iaEnsPintar();
}

window.addEventListener('DOMContentLoaded',()=>{
  initTheme();
  loadProgress();
  pintarIaAplicaciones();
  pintarIaMitos();
  pintarIaReglas();
  pintarIaVocabulario();
  iaEnsPintar();
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
  document.querySelector('[data-parte="ia"]')?.classList.add('active-pri');
  document.querySelector('[data-aspecto="estructura"]')?.classList.add('active-sec');
  renderAchPanel();
});

(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalCrit==='function') _injectFormaSel('genEvalCrit','evalCritFormaSel',evalCritFormNum,function(v){evalCritFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();
