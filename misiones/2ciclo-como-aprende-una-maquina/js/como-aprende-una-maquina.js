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
const SAVE_KEY='como_aprende_maquina_v1';
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
  primer_quiz:{icon:'🏅',label:'Primer quiz del entrenamiento superado'},
  flash_master:{icon:'🃏',label:'Domina el vocabulario del aprendizaje'},
  clasif_pro:{icon:'🗂️',label:'Distingue los tres tipos de aprendizaje'},
  id_master:{icon:'🔍',label:'Reconoce cada paso del entrenamiento'},
  reto_hero:{icon:'🏆',label:'Campeón del reto del entrenamiento'},
  nivel3:{icon:'🎖️',label:'¡Buen ritmo! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡Entrenador experto! Nivel 6'},
  widgets_master:{icon:'🧩',label:'Widgets del aprendizaje dominados'},
  cazasesgo:{icon:'⚖️',label:'Descubrió el sesgo entrenando con ejemplos incompletos'},
  maquina_humana:{icon:'🎯',label:'Sacó la regla de los ejemplos, como una máquina'}
};
function unlockAchievement(id){if(unlockedAch.includes(id))return;unlockedAch.push(id);sfx('ach');showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label);launchConfetti();renderAchPanel();saveProgress();}
function renderAchPanel(){const list=document.getElementById('achList');list.innerHTML='';Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{const div=document.createElement('div');div.className='ach-item'+(unlockedAch.includes(id)?'':' locked');div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`;list.appendChild(div);});}
function toggleAchPanel(){sfx('click');document.getElementById('achPanel').classList.toggle('open');}
function showToast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}t.textContent=msg;t.style.display='block';clearTimeout(t._tid);t._tid=setTimeout(()=>t.style.display='none',3200);}
function launchConfetti(){const colors=['#86198f','#e879f9','#4338ca','#f59e0b','#c026d3'];for(let i=0;i<60;i++){const c=document.createElement('div');c.className='confetti-piece';c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`;document.body.appendChild(c);c.addEventListener('animationend',()=>c.remove());}}

// ===================== XP =====================
const lvls=[{t:0,n:'Aprendiz 🌱'},{t:25,n:'Junta datos 📦'},{t:55,n:'Pone etiquetas 🏷️'},{t:90,n:'Entrena 🏋️'},{t:130,n:'Prueba y corrige 🧪'},{t:165,n:'Caza sesgos ⚖️'},{t:190,n:'Entrenador experto 🏆'}];
function pts(n){xp=Math.max(0,Math.min(MXP,xp+n));updateXPBar();saveProgress();}
function updateXPBar(){const pct=Math.round((xp/MXP)*100);document.getElementById('xpFill').style.width=pct+'%';const el=document.getElementById('xpPts');el.textContent='⭐ '+xp;el.style.transform='scale(1.3)';setTimeout(()=>el.style.transform='',300);let lv=0;for(let i=0;i<lvls.length;i++)if(xp>=lvls[i].t)lv=i;document.getElementById('xpLvl').textContent=lvls[lv].n;if(lv!==prevLevel){if(lv>=2)unlockAchievement('nivel3');if(lv>=5)unlockAchievement('nivel5');prevLevel=lv;}}
function resetXP(){sfx('click');xp=0;updateXPBar();showToast('🔄 XP reiniciado a 0');}
function fin(id,showFX=true){if(!done.has(id)){done.add(id);const b=document.querySelector(`[data-s="${id}"]`);if(b)b.classList.add('done');if(showFX){sfx('up');launchConfetti();}saveProgress();}}
function getProgress(){return Math.round((done.size/TOTAL_SECTIONS)*100);}

// ===================== NAV =====================
function go(id){sfx('click');document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});document.getElementById(id).classList.add('active');const btn=document.querySelector(`[data-s="${id}"]`);if(btn){btn.classList.add('active');btn.setAttribute('aria-selected','true');}window.scrollTo({top:0,behavior:'smooth'});if(id==='s-sopa'){setTimeout(buildSopa,50);}if(id==='s-widgets'){setTimeout(buildRoute,50);}}

// ===================== FLASHCARD DATA =====================
const fcData = (function () {
  /* Del archivo común de la ruta (js/data/ia-conceptos.js). Aquí se da la
     definición LARGA, no la corta: en II Ciclo el vocabulario ya es la materia,
     y el alumno lo va a necesitar entero en la etapa 4. */
  const f = [];
  IA_CONCEPTOS.filter(c => c.ciclo <= 2).forEach(c => {
    f.push({ w: c.emoji + ' ' + c.palabra, a: '<strong>' + c.corta + '</strong><br><br>' + c.definicion });
  });
  IA_CONCEPTOS.filter(c => c.ciclo === 2).forEach(c => {
    f.push({ w: '¿De qué palabra es este ejemplo?<br><em>' + c.ejemplo + '</em>', a: '<strong>' + c.emoji + ' ' + c.palabra + '</strong><br><br>' + c.corta });
  });
  return f;
})();
let fcIdx=0;
function upFC(){document.getElementById('fcInner').classList.remove('flipped');document.getElementById('fcW').innerHTML=fcData[fcIdx].w;document.getElementById('fcA').innerHTML=fcData[fcIdx].a;document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length;}
function flipCard(){sfx('flip');document.getElementById('fcInner').classList.toggle('flipped');if(!xpTracker.fc.has(fcIdx)){xpTracker.fc.add(fcIdx);pts(1);}if(xpTracker.fc.size===fcData.length){fin('s-flash');unlockAchievement('flash_master');}}
function nextFC(){sfx('click');fcIdx=(fcIdx+1)%fcData.length;upFC();}
function prevFC(){sfx('click');fcIdx=(fcIdx-1+fcData.length)%fcData.length;upFC();}

// ===================== QUIZ DATA =====================
const qzData=[
  {q:'¿En qué se diferencian un programa de siempre y uno que aprende?',o:['Ninguna, son lo mismo','El que aprende es más caro','Uno SIGUE reglas; el otro las SACA','El que aprende no usa computadora'],c:2,
   e:'El de reglas no mejora solo. El que aprende saca la regla de los ejemplos.'},
  {q:'¿Qué es una etiqueta?',o:['La respuesta correcta que le pone una persona','El precio de la computadora','El nombre del programa','Un adorno de la pantalla'],c:0,
   e:'Sin etiqueta ve la foto y no sabe qué es.'},
  {q:'¿Para qué se prueba con ejemplos que NUNCA vio?',o:['Para gastar menos batería','Para que se entretenga','Para hacerla más rápida','Para saber si aprendió o solo se acordó'],c:3,
   e:'Si acierta con lo nuevo, aprendió. Si no, memorizó.'},
  {q:'Se entrenó con maíz, frijol y café. Llega una hoja de plátano.',o:['La reconoce igual de bien','La ignora','Se puede equivocar: nunca vio una','Se apaga'],c:2,
   e:'Eso es el sesgo: falla con lo que faltó.'},
  {q:'La máquina se equivocó con el plátano. ¿De quién es el problema?',o:['De quien eligió los ejemplos','De la máquina, que está mala','Del plátano','De nadie, es normal'],c:0,
   e:'La pregunta de siempre: ¿quién eligió los ejemplos?'},
  {q:'¿Cómo se llama aprender con ejemplos que traen su respuesta?',o:['Por refuerzo','No supervisado','Aprendizaje supervisado','Por memoria'],c:2,
   e:'Es estudiar con el solucionario al lado.'},
  {q:'Junta fotos parecidas y nadie le dice cómo se llaman.',o:['Supervisado','No supervisado','Por refuerzo','Ninguno'],c:1,
   e:'Sabe que se parecen. No sabe cómo se llaman.'},
  {q:'Aprende a jugar con premios cuando le sale bien. ¿Qué tipo es?',o:['Supervisado','No supervisado','Por memoria','Por refuerzo'],c:3,
   e:'Prueba, cobra premio y vuelve a probar. Millones de veces.'},
  {q:'Una máquina acierta 9 de cada 10. ¿Qué es ese 1 que falla?',o:['Que no sirve para nada','Que hay que apagarla','En ese error hay una persona','Que aprendió mal a propósito'],c:2,
   e:'Ninguna acierta el 100 %. Importa a quién le toca.'},
  {q:'¿Qué es un patrón?',o:['Un error de la computadora','Lo que se repite en muchos ejemplos','El nombre de una etiqueta','El precio de los datos'],c:1,
   e:'No entiende lo que ve. Encuentra lo que se repite.'}
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
  {label:['Es un DATO','Es una ETIQUETA'],headA:'📦 Dato',headB:'🏷️ Etiqueta',colA:'dato',colB:'etiq',
   words:[{w:'La foto de una hoja',t:'dato'},{w:'La palabra «sana» que puso una persona',t:'etiq'},{w:'El peso de una naranja',t:'dato'},{w:'«Esto es un nance»',t:'etiq'},{w:'La grabación de una voz',t:'dato'},{w:'«Este audio dice hola»',t:'etiq'},{w:'La temperatura del día',t:'dato'},{w:'«Esta hoja tiene plaga»',t:'etiq'}]},
  {label:['Pasa al ENTRENAR','Pasa al PROBAR'],headA:'🏋️ Entrenar',headB:'🧪 Probar',colA:'entr',colB:'prob',
   words:[{w:'Se le muestran ejemplos con su etiqueta',t:'entr'},{w:'Se usan ejemplos que nunca vio',t:'prob'},{w:'Se repite hasta hallar el patrón',t:'entr'},{w:'Se cuenta cuántas acertó',t:'prob'},{w:'Se ajustan los números por dentro',t:'entr'},{w:'Se descubre si de verdad aprendió',t:'prob'},{w:'Cuesta tiempo y se hace una sola vez',t:'entr'},{w:'Sirve para medir el error',t:'prob'}]},
  {label:['Aprendizaje supervisado','Aprendizaje no supervisado'],headA:'🏷️ Supervisado',headB:'🗂️ No supervisado',colA:'sup',colB:'nosup',
   words:[{w:'Los ejemplos traen su etiqueta',t:'sup'},{w:'Los ejemplos van sin etiqueta',t:'nosup'},{w:'Una persona escribió la respuesta correcta',t:'sup'},{w:'La máquina agrupa sola lo que se parece',t:'nosup'},{w:'Separar hojas sanas de hojas con plaga',t:'sup'},{w:'Separar fotos de la fiesta y fotos del campo',t:'nosup'},{w:'Como estudiar con el solucionario al lado',t:'sup'},{w:'No sabe cómo se llama cada grupo',t:'nosup'}]}
];
let currentClassGroupIdx=0,clsSelectedWord=null;
function buildClass(){const group=classGroups[currentClassGroupIdx];document.getElementById('col-left-head').textContent=group.headA;document.getElementById('col-right-head').textContent=group.headB;const bank=document.getElementById('clsBank');bank.innerHTML='';clsSelectedWord=null;document.getElementById('items-left').innerHTML='';document.getElementById('items-right').innerHTML='';_shuffle([...group.words]).forEach(w=>{const el=document.createElement('div');el.className='wb-item';el.textContent=w.w;el.dataset.t=w.t;el.onclick=()=>{document.querySelectorAll('.wb-item').forEach(i=>i.classList.remove('sel-word'));el.classList.add('sel-word');clsSelectedWord=el;sfx('click');};bank.appendChild(el);});['col-left','col-right'].forEach(colId=>{const col=document.getElementById(colId);col.onclick=(e)=>{if(!clsSelectedWord||e.target.classList.contains('drop-item'))return;const targetId=colId==='col-left'?'items-left':'items-right';const wordsCol=document.getElementById(targetId);const item=document.createElement('div');item.className='drop-item';item.textContent=clsSelectedWord.textContent;item.dataset.t=clsSelectedWord.dataset.t;const original=clsSelectedWord;item.onclick=(ev)=>{ev.stopPropagation();if(clsSelectedWord!==null){col.click();}else{document.getElementById('clsBank').appendChild(original);original.classList.remove('sel-word');item.remove();if(typeof sfx==='function')sfx('click');}};wordsCol.appendChild(item);clsSelectedWord.remove();clsSelectedWord=null;sfx('click');};});}
function checkClass(){const remaining=document.querySelectorAll('#clsBank .wb-item').length;if(remaining>0){fb('fbCls','Mueve todas las palabras a las columnas primero.',false);return;}const group=classGroups[currentClassGroupIdx];let allOk=true;document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{const inLeft=el.parentElement.id==='items-left';const expectedType=inLeft?group.colA:group.colB;if(el.dataset.t===expectedType){el.classList.add('cls-ok');}else{el.classList.add('cls-no');allOk=false;}});if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);}if(allOk){fb('fbCls','¡Perfecto! +5 XP',true);sfx('fan');fin('s-clasifica');unlockAchievement('clasif_pro');}else{fb('fbCls','Hay errores. Los errados llevan ✗.',false);sfx('no');}}
function nextClassGroup(){sfx('click');currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length;buildClass();document.getElementById('fbCls').classList.remove('show');showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]);}
function resetClass(){sfx('click');buildClass();document.getElementById('fbCls').classList.remove('show');}

// ===================== IDENTIFICAR =====================
const idData=[
  {s:['Una','persona','le','puso','la','etiqueta','a','cada','foto.'],c:5,art:'La respuesta correcta que pone una persona'},
  {s:['La','máquina','busca','el','patrón','en','los','ejemplos.'],c:4,art:'Lo que se repite y sirve para reconocer'},
  {s:['Entrenar','cuesta','tiempo;','usar','lo','aprendido','es','rápido.'],c:0,art:'Lo que se hace una sola vez'},
  {s:['La','probamos','con','ejemplos','que','nunca','vio.'],c:1,art:'Sirve para saber si de verdad aprendió'},
  {s:['Nunca','vio','plátano:','ese','es','el','sesgo.'],c:6,art:'El fallo cuando faltan ejemplos'},
  {s:['Cada','dato','es','un','pedacito','de','información.'],c:1,art:'Un pedacito de información que se guarda'},
  {s:['Aprende','a','jugar','con','premios:','es','refuerzo.'],c:6,art:'El aprendizaje que usa premios'},
  {s:['Acierta','nueve','y','falla','una:','ese','es','el','error.'],c:8,art:'Las veces que la máquina contesta mal'}
];
let idIdx=0,idDone=false;
function showId(){idDone=false;if(idIdx>=idData.length){document.getElementById('idSent').innerHTML='🎉 ¡Completado!';fin('s-identifica');unlockAchievement('id_master');return;}const d=idData[idIdx];document.getElementById('idProg').textContent=`Oración ${idIdx+1} de ${idData.length}`;document.getElementById('idInfo').textContent=`Busca: ${d.art}`;const sent=document.getElementById('idSent');sent.innerHTML='';d.s.forEach((w,i)=>{const span=document.createElement('span');span.className='id-word';span.textContent=w+' ';span.onclick=()=>checkId(i,span);sent.appendChild(span);});}
function checkId(i,span){if(idDone)return;document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected'));span.classList.add('selected');if(i===idData[idIdx].c){idDone=true;span.classList.add('id-ok');fb('fbId','¡Correcto! +5 XP',true);if(!xpTracker.id.has(idIdx)){xpTracker.id.add(idIdx);pts(5);}sfx('ok');}else{span.classList.add('id-no');fb('fbId','Ese no es el término solicitado.',false);sfx('no');}}
function nextId(){sfx('click');idIdx++;showId();document.getElementById('fbId').classList.remove('show');}
function resetId(){sfx('click');idIdx=0;showId();document.getElementById('fbId').classList.remove('show');}

// ===================== COMPLETA =====================
const cmpData=[
  {s:'La respuesta correcta que pone una persona se llama ___.',opts:['dato','patrón','etiqueta'],c:2},
  {s:'Mostrarle ejemplos hasta hallar el patrón se llama ___.',opts:['entrenar','probar','borrar'],c:0},
  {s:'Examinarla con ejemplos que nunca vio se llama ___.',opts:['entrenar','probar','copiar'],c:1},
  {s:'Si los ejemplos están mal repartidos hay un ___.',opts:['premio','patrón','sesgo'],c:2},
  {s:'Aprender con ejemplos etiquetados es aprendizaje ___.',opts:['supervisado','no supervisado','por refuerzo'],c:0},
  {s:'Agrupar lo que se parece, sin etiquetas, es aprendizaje ___.',opts:['supervisado','no supervisado','por refuerzo'],c:1},
  {s:'Aprender con premios es aprendizaje ___.',opts:['por refuerzo','supervisado','no supervisado'],c:0},
  {s:'Lo que se repite en muchos ejemplos se llama ___.',opts:['error','etiqueta','patrón'],c:2}
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
  { label: 'Ordena el ciclo del aprendizaje', steps: [
    '1. Se juntan los DATOS',
    '2. Una persona les pone su ETIQUETA',
    '3. Se ENTRENA con ellos',
    '4. Se PRUEBA con ejemplos nuevos',
    '5. Se mide el ERROR',
    '6. Se corrige y se vuelve a entrenar'] },
  { label: 'Ordena cómo se caza un sesgo', steps: [
    '1. La máquina falla con un caso concreto',
    '2. Se mira QUÉ ejemplos tuvo para entrenar',
    '3. Se descubre que ese caso no estaba',
    '4. Se juntan ejemplos de lo que faltaba',
    '5. Se vuelve a entrenar y a probar'] }
];
let currentRouteIdx=0,routeItems=[];
function buildRoute(){routeItems=_shuffle([...routeSets[currentRouteIdx].steps]);renderRoute();const fbEl=document.getElementById('fbRoute');if(fbEl)fbEl.classList.remove('show');}
function renderRoute(){const list=document.getElementById('routeList');if(!list)return;list.innerHTML='';routeItems.forEach((step,i)=>{const div=document.createElement('div');div.className='sort-item';div.innerHTML=`<div class="sort-arrows"><button class="sort-arrow" onclick="routeMove(${i},-1)"${i===0?' disabled':''}>▲</button><button class="sort-arrow" onclick="routeMove(${i},1)"${i===routeItems.length-1?' disabled':''}>▼</button></div><div class="sort-step-num">${i+1}.</div><div class="sort-item-txt">${step}</div>`;list.appendChild(div);});}
function routeMove(idx,dir){sfx('click');const ni=idx+dir;if(ni<0||ni>=routeItems.length)return;[routeItems[idx],routeItems[ni]]=[routeItems[ni],routeItems[idx]];renderRoute();}
function checkRoute(){const correct=routeSets[currentRouteIdx].steps;const isOk=routeItems.every((s,i)=>s===correct[i]);if(isOk){fb('fbRoute','¡Perfecto! Orden correcto. +4 XP',true);if(!xpTracker.wgt.has('route_'+currentRouteIdx)){xpTracker.wgt.add('route_'+currentRouteIdx);pts(4);}sfx('fan');fin('s-widgets');unlockAchievement('widgets_master');}else{fb('fbRoute','Hay pasos fuera de orden. Revisa el arreglo.',false);sfx('no');}}
function nextRoute(){sfx('click');currentRouteIdx=(currentRouteIdx+1)%routeSets.length;buildRoute();showToast('🔄 Secuencia: '+routeSets[currentRouteIdx].label);}

// Widget 2: Identifica el concepto
const neuronPartes = (function () {
  const c2 = IA_CONCEPTOS.filter(c => c.ciclo === 2);
  const nombres = c2.map(c => c.palabra);
  const p = [];
  c2.forEach(c => {
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
  /* Los tres tipos de aprendizaje contra un caso real de cada uno. Es lo que
     más se confunde en el examen, así que se practica de las dos maneras: aquí
     del caso al tipo, y en Clasifica del tipo al caso. */
  const tipos = ['Aprendizaje supervisado','Aprendizaje no supervisado','Aprendizaje por refuerzo'];
  return [
    {trans:'Le damos hojas etiquetadas «sana» o «con plaga».',func:'Aprendizaje supervisado',opts:tipos.slice()},
    {trans:'Le damos fotos sin decirle nada y las junta por parecido.',func:'Aprendizaje no supervisado',opts:tipos.slice()},
    {trans:'Juega millones de partidas y gana premio cada vez.',func:'Aprendizaje por refuerzo',opts:tipos.slice()},
    {trans:'Le damos recibos ya marcados «pagado» o «pendiente».',func:'Aprendizaje supervisado',opts:tipos.slice()},
    {trans:'Agrupa sola a los clientes que compran parecido.',func:'Aprendizaje no supervisado',opts:tipos.slice()},
    {trans:'Un robot gana puntos si camina sin caerse.',func:'Aprendizaje por refuerzo',opts:tipos.slice()}
  ];
})();
let neuroIdx=0,neuroDone=false;
function showNeuro(){neuroDone=false;if(neuroIdx>=neuroPairs.length){const el=document.getElementById('neuroTrans');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('neuroOpts');if(opts)opts.innerHTML='';return;}const d=neuroPairs[neuroIdx];const prog=document.getElementById('neuroProg');if(prog)prog.textContent=`${neuroIdx+1} de ${neuroPairs.length}`;const trans=document.getElementById('neuroTrans');if(trans)trans.textContent=d.trans;const opts=document.getElementById('neuroOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkNeuro(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuro');if(fbEl)fbEl.classList.remove('show');}
function checkNeuro(opt,btn,d){if(neuroDone)return;neuroDone=true;document.querySelectorAll('#neuroOpts .qz-opt').forEach(b=>{if(b.textContent===d.func)b.classList.add('correct');else if(b===btn&&b.textContent!==d.func)b.classList.add('wrong');});const isOk=opt===d.func;if(isOk){fb('fbNeuro','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuro_'+neuroIdx)){xpTracker.wgt.add('neuro_'+neuroIdx);pts(3);}sfx('ok');}else{fb('fbNeuro','Correcto: '+d.func,false);sfx('no');}setTimeout(()=>{neuroIdx++;showNeuro();},1800);}
function resetNeuro(){sfx('click');neuroIdx=0;showNeuro();}

// Widget 4: Fuente → ¿Renovable o no renovable?
const enfermedadData=[
  {disease:'Le faltaron ejemplos de un tipo de hoja',characteristic:'Sesgo',opts:['Sesgo','Patrón','Etiqueta']},
  {disease:'Lo que se repite en muchos ejemplos',characteristic:'Patrón',opts:['Sesgo','Patrón','Etiqueta']},
  {disease:'La respuesta correcta que puso una persona',characteristic:'Etiqueta',opts:['Sesgo','Patrón','Etiqueta']},
  {disease:'Falla solo con los cultivos que nunca vio',characteristic:'Sesgo',opts:['Sesgo','Patrón','Etiqueta']},
  {disease:'Los nances casi siempre son pequeños',characteristic:'Patrón',opts:['Sesgo','Patrón','Etiqueta']},
  {disease:'«Esta hoja tiene plaga», escrito por el técnico',characteristic:'Etiqueta',opts:['Sesgo','Patrón','Etiqueta']},
  {disease:'Los ejemplos vinieron de una sola aldea',characteristic:'Sesgo',opts:['Sesgo','Patrón','Etiqueta']},
  {disease:'Las hojas enfermas tienen manchas oscuras',characteristic:'Patrón',opts:['Sesgo','Patrón','Etiqueta']},
  {disease:'Sin ella ve la foto y no sabe qué es',characteristic:'Etiqueta',opts:['Sesgo','Patrón','Etiqueta']}
];
let enferIdx=0,enferDone=false;
function showEnfer(){enferDone=false;if(enferIdx>=enfermedadData.length){const el=document.getElementById('enferDisease');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('enferOpts');if(opts)opts.innerHTML='';return;}const d=enfermedadData[enferIdx];const prog=document.getElementById('enferProg');if(prog)prog.textContent=`${enferIdx+1} de ${enfermedadData.length}`;const dis=document.getElementById('enferDisease');if(dis)dis.textContent=d.disease;const opts=document.getElementById('enferOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkEnfer(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbEnfer');if(fbEl)fbEl.classList.remove('show');}
function checkEnfer(opt,btn,d){if(enferDone)return;enferDone=true;document.querySelectorAll('#enferOpts .qz-opt').forEach(b=>{if(b.textContent===d.characteristic)b.classList.add('correct');else if(b===btn&&b.textContent!==d.characteristic)b.classList.add('wrong');});const isOk=opt===d.characteristic;if(isOk){fb('fbEnfer','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('enfer_'+enferIdx)){xpTracker.wgt.add('enfer_'+enferIdx);pts(3);}sfx('ok');}else{fb('fbEnfer','Correcto: '+d.characteristic,false);sfx('no');}setTimeout(()=>{enferIdx++;showEnfer();},1800);}
function resetEnfer(){sfx('click');enferIdx=0;showEnfer();}

// ===================== RETO FINAL =====================
const retoPairs=[
  {label:['Es un DATO','Es una ETIQUETA'],btnA:'📦 Dato',btnB:'🏷️ Etiqueta',colA:'dato',colB:'etiq',
   words:[{w:'La foto de una hoja',t:'dato'},{w:'La palabra «sana» que puso una persona',t:'etiq'},{w:'El peso de una naranja',t:'dato'},{w:'«Esto es un nance»',t:'etiq'},{w:'La grabación de una voz',t:'dato'},{w:'«Este audio dice hola»',t:'etiq'},{w:'La temperatura del día',t:'dato'},{w:'«Esta hoja tiene plaga»',t:'etiq'},{w:'El color de una fruta',t:'dato'},{w:'«Esta foto es de un perro»',t:'etiq'}]},
  {label:['Pasa al ENTRENAR','Pasa al PROBAR'],btnA:'🏋️ Entrenar',btnB:'🧪 Probar',colA:'entr',colB:'prob',
   words:[{w:'Se le muestran ejemplos con su etiqueta',t:'entr'},{w:'Se usan ejemplos que nunca vio',t:'prob'},{w:'Se repite hasta hallar el patrón',t:'entr'},{w:'Se cuenta cuántas acertó',t:'prob'},{w:'Se ajustan los números por dentro',t:'entr'},{w:'Se descubre si de verdad aprendió',t:'prob'},{w:'Cuesta tiempo y se hace una sola vez',t:'entr'},{w:'Sirve para medir el error',t:'prob'},{w:'Es lo lento del proceso',t:'entr'},{w:'Da el porcentaje de aciertos',t:'prob'}]},
  {label:['Aprendizaje supervisado','Aprendizaje no supervisado'],btnA:'🏷️ Supervisado',btnB:'🗂️ No supervisado',colA:'sup',colB:'nosup',
   words:[{w:'Los ejemplos traen su etiqueta',t:'sup'},{w:'Los ejemplos van sin etiqueta',t:'nosup'},{w:'Una persona escribió la respuesta correcta',t:'sup'},{w:'La máquina agrupa sola lo que se parece',t:'nosup'},{w:'Separar hojas sanas de hojas con plaga',t:'sup'},{w:'Separar fotos de la fiesta y fotos del campo',t:'nosup'},{w:'Como estudiar con el solucionario al lado',t:'sup'},{w:'No sabe cómo se llama cada grupo',t:'nosup'},{w:'Reconocer si un recibo está pagado',t:'sup'},{w:'Juntar clientes que compran parecido',t:'nosup'}]}
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
  {s:'Una persona le puso la etiqueta a cada foto.',type:'etiqueta'},
  {s:'La máquina busca el patrón en los ejemplos.',type:'patrón'},
  {s:'Entrenar cuesta tiempo y se hace una sola vez.',type:'entrenar'},
  {s:'La probamos con ejemplos que nunca vio.',type:'probar'},
  {s:'Nunca vio un plátano: ahí está el sesgo.',type:'sesgo'},
  {s:'Cada dato es un pedacito de información.',type:'dato'},
  {s:'Aprende jugando y recibiendo premios: eso es refuerzo.',type:'refuerzo'},
  {s:'Acierta nueve y falla una: ese es el error.',type:'error'},
  {s:'En el supervisado los ejemplos traen su respuesta.',type:'supervisado'},
  {s:'Agrupa lo que se parece, sin etiquetas: es no supervisado.',type:'no supervisado'}
];
const classifyTaskDB=[
  {w:'Dato',gen:'Un pedacito de información',n:'El color de un nance',g:'En la lista de tu maestra',t:'No hay nada que aprender'},
  {w:'Etiqueta',gen:'La respuesta correcta puesta por una persona',n:'«Esta hoja tiene plaga»',g:'Antes de entrenar',t:'Ve la foto y no sabe de qué es'},
  {w:'Entrenar',gen:'Mostrarle ejemplos hasta hallar el patrón',n:'Diez mil fotos de hojas',g:'Una sola vez, y cuesta tiempo',t:'No saca ninguna regla'},
  {w:'Probar',gen:'Examinarla con ejemplos nuevos',n:'Veinte fotos que nunca vio',g:'Después de entrenar',t:'No se sabe si aprendió'},
  {w:'Patrón',gen:'Lo que se repite en muchos ejemplos',n:'Las hojas enfermas tienen manchas',g:'Dentro del modelo',t:'No hay con qué decidir'},
  {w:'Sesgo',gen:'Fallar con lo que faltó en los ejemplos',n:'No reconoce el plátano',g:'Donde alguien eligió mal',t:'Si nadie revisa el reparto, aparece'},
  {w:'Error',gen:'Las veces que contesta mal',n:'Falla 1 de cada 10',g:'Al probarla',t:'No se sabe cuánto se equivoca'}
];
const completeTaskDB=[
  {s:'La respuesta correcta que pone una persona se llama ___.',ans:'etiqueta'},
  {s:'Mostrarle ejemplos hasta hallar el patrón se llama ___.',ans:'entrenar'},
  {s:'Examinarla con ejemplos que nunca vio se llama ___.',ans:'probar'},
  {s:'Cuando los ejemplos están mal repartidos hay un ___.',ans:'sesgo'},
  {s:'Lo que se repite en muchos ejemplos es el ___.',ans:'patrón'},
  {s:'Aprender con ejemplos etiquetados es aprendizaje ___.',ans:'supervisado'},
  {s:'Aprender con premios es aprendizaje por ___.',ans:'refuerzo'},
  {s:'Las veces que la máquina contesta mal son el ___.',ans:'error'},
  {s:'Un pedacito de información que se guarda es un ___.',ans:'dato'}
];
const explainQuestions=[
  {q:'Explica el ciclo completo: datos, patrón, prueba y error.',ans:'Se juntan datos etiquetados. Se entrena y sale el patrón. Se prueba con ejemplos nuevos y se mide el error.'},
  {q:'¿Qué diferencia hay entre un programa que sigue reglas y uno que aprende?',ans:'El de reglas obedece lo escrito. El que aprende saca su regla de ejemplos. Falla con lo que no vio.'},
  {q:'Explica qué es el sesgo con un ejemplo del campo hondureño.',ans:'Le enseñaron maíz, frijol y café. Llega plátano y falla: nunca vio uno. Lo dejó fuera quien eligió los ejemplos.'},
  {q:'¿Por qué hay que probar con ejemplos que la máquina NUNCA vio?',ans:'Con los del entrenamiento no se sabe si aprendió o memorizó. Acertar con lo nuevo sí lo prueba.'},
  {q:'Nombra los tres tipos de aprendizaje y da un ejemplo de cada uno.',ans:'Supervisado: hojas marcadas «sana» o «con plaga». No supervisado: sin etiqueta, agrupa lo parecido. Por refuerzo: prueba y cobra premio.'},
  {q:'Una máquina acierta 9 de cada 10. ¿Por qué importa ese 1 que falla?',ans:'Porque en ese 1 hay una persona: un enfermo sin detectar, un productor con la cosecha sana dada por mala.'},
  {q:'¿Qué preguntarías antes de confiar en una máquina que clasifica algo importante?',ans:'Respuesta abierta. Que pregunte con qué ejemplos la entrenaron, quién los eligió y a quién le cae el error.'},
  {q:'¿Por qué la etiqueta la tiene que poner una persona?',ans:'La etiqueta es la respuesta correcta: eso va a aprender. Si la persona se equivoca, aprende ese error.'},
  {q:'Busca en tu comunidad algo que se podría clasificar. ¿Qué datos harían falta?',ans:'Respuesta abierta. Que nombre algo real: plagas, grano, basura, el río. Y quién etiquetaría los ejemplos.'}
];
let ansVisible=false;
function genTask(){sfx('click');const type=document.getElementById('tgType').value;const count=parseInt(document.getElementById('tgCount').value);ansVisible=false;const out=document.getElementById('tgOut');out.innerHTML='';if(type==='identify')genIdentifyTask(out,count);else if(type==='classify')genClassifyTask(out,count);else if(type==='complete')genCompleteTask(out,count);else if(type==='explain')genExplainTask(out,count);fin('s-tareas');}
function _instrBlock(out,title,lines){const ib=document.createElement('div');ib.className='tg-instruction-block';ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join('');out.appendChild(ib);}
function genIdentifyTask(out,count){_instrBlock(out,'Instrucción',['Copia en tu cuaderno. Encierra el concepto que se pide y di qué significa.','<strong>Ejemplo:</strong> Una persona le puso su etiqueta a cada foto. → <span style="color:var(--jade);font-weight:700;">etiqueta</span>']);_pick(identifyTaskDB,Math.min(count,identifyTaskDB.length)).forEach((item,i)=>{const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.type}</div></div>`;out.appendChild(div);});}
function genClassifyTask(out,count){_instrBlock(out,'Instrucción',['Copia la tabla y escribe de cada concepto: qué es, un ejemplo, dónde se usa y si falta.']);const items=_pick(classifyTaskDB,Math.min(count,classifyTaskDB.length));const wrap=document.createElement('div');wrap.style.overflowX='auto';const th=(t,extra='')=>`<th style="padding:0.3rem 0.4rem;border:1px solid var(--border);font-size:0.72rem;text-align:center;${extra}">${t}</th>`;let html=`<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:520px;"><thead><tr style="background:var(--pri-gl);">${th('Concepto','text-align:left;')}${th('¿Qué es?')}${th('Un ejemplo')}${th('¿Dónde se usa?')}${th('Si falta…')}</tr></thead><tbody>`;items.forEach(it=>{html+=`<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td>`+Array(4).fill(`<td style="padding:0.4rem;border:1px solid var(--border);min-width:50px;"></td>`).join('')+'</tr>';});html+='</tbody></table>';wrap.innerHTML=html;out.appendChild(wrap);const ans=document.createElement('div');ans.className='tg-answer';ans.style.marginTop='0.8rem';ans.innerHTML='<strong>✅ Respuestas:</strong><br>'+items.map(it=>`<strong>${it.w}:</strong> Qué es: ${it.gen} | Ejemplo: ${it.n} | Dónde se usa: ${it.g} | Si falta: ${it.t}`).join('<br>');out.appendChild(ans);}
function genCompleteTask(out,count){_instrBlock(out,'Instrucción',['Copia y resuelve. Escribe la opción correcta en cada espacio ___.']);const pool=_shuffle([...completeTaskDB]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';const sent=item.s.replace('___','<span class="tg-blank" style="min-width:90px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${sent}</strong><div style="margin-top:0.4rem;font-size:0.82rem;color:var(--gray);">📝 Opciones: <strong>${item.opts.join(' | ')}</strong></div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function genExplainTask(out,count){_instrBlock(out,'Instrucción',['Copia las preguntas en tu cuaderno y contéstalas.']);const pool=_shuffle([...explainQuestions]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.3rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function toggleAns(){ansVisible=!ansVisible;document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none');sfx('click');}

// ===================== SOPA DE LETRAS =====================
const sopaSets=[
  {size:10,grid:[
    ['J','D','A','T','O','S','Y','G','R','Q'],
    ['B','W','D','G','I','X','K','K','O','M'],
    ['W','D','F','F','C','S','Ñ','L','R','N'],
    ['Ñ','B','L','L','E','Q','C','S','R','U'],
    ['Z','B','P','L','Ñ','T','Q','Y','E','U'],
    ['W','A','Ñ','M','O','G','S','E','S','N'],
    ['D','Ñ','E','T','P','Y','S','Q','E','X'],
    ['S','R','E','T','I','Q','U','E','T','A'],
    ['R','A','N','E','R','T','N','E','O','V'],
    ['J','K','N','O','R','T','A','P','Y','G']
  ],words:[
    {w:'DATOS',cells:[[0,1],[0,2],[0,3],[0,4],[0,5]]},
    {w:'ETIQUETA',cells:[[7,2],[7,3],[7,4],[7,5],[7,6],[7,7],[7,8],[7,9]]},
    {w:'ENTRENAR',cells:[[8,7],[8,6],[8,5],[8,4],[8,3],[8,2],[8,1],[8,0]]},
    {w:'PATRON',cells:[[9,7],[9,6],[9,5],[9,4],[9,3],[9,2]]},
    {w:'SESGO',cells:[[5,8],[5,7],[5,6],[5,5],[5,4]]},
    {w:'ERROR',cells:[[4,8],[3,8],[2,8],[1,8],[0,8]]}
  ]},
  {size:10,grid:[
    ['R','E','F','U','E','R','Z','O','T','X'],
    ['P','Y','U','D','T','A','V','N','A','B'],
    ['P','L','A','G','A','I','W','S','P','M'],
    ['P','K','X','U','T','C','Ñ','I','R','H'],
    ['U','Z','K','L','E','C','U','T','E','Ñ'],
    ['T','I','U','L','G','N','W','F','N','D'],
    ['Q','C','F','K','E','B','B','Z','D','F'],
    ['E','J','E','M','P','L','O','S','E','W'],
    ['P','O','D','F','K','H','F','S','R','Q'],
    ['L','G','P','R','U','E','B','A','O','I']
  ],words:[
    {w:'PRUEBA',cells:[[9,2],[9,3],[9,4],[9,5],[9,6],[9,7]]},
    {w:'EJEMPLOS',cells:[[7,0],[7,1],[7,2],[7,3],[7,4],[7,5],[7,6],[7,7]]},
    {w:'APRENDER',cells:[[1,8],[2,8],[3,8],[4,8],[5,8],[6,8],[7,8],[8,8]]},
    {w:'REFUERZO',cells:[[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7]]},
    {w:'CULTIVO',cells:[[6,1],[5,2],[4,3],[3,4],[2,5],[1,6],[0,7]]},
    {w:'PLAGA',cells:[[2,0],[2,1],[2,2],[2,3],[2,4]]}
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
  {q:'Un programa que aprende saca la regla de los ejemplos.',a:true},
  {q:'La etiqueta la pone la máquina sola.',a:false},
  {q:'Entrenar cuesta tiempo; usar lo aprendido es rápido.',a:true},
  {q:'Probar con los ejemplos del entrenamiento dice si aprendió.',a:false},
  {q:'El sesgo aparece cuando los ejemplos están mal repartidos.',a:true},
  {q:'Si la máquina falla con un caso que nunca vio, la culpa es de ella.',a:false},
  {q:'En el supervisado los ejemplos traen su etiqueta.',a:true},
  {q:'En el no supervisado sabe el nombre de cada grupo.',a:false},
  {q:'El aprendizaje por refuerzo usa premios.',a:true},
  {q:'Ninguna máquina acierta el cien por ciento.',a:true},
  {q:'Un dato es un pedacito de información que se guarda.',a:true},
  {q:'El patrón es lo que se repite en muchos ejemplos.',a:true},
  {q:'Si una persona etiqueta mal, la máquina aprende ese error.',a:true},
  {q:'Con ejemplos buenos y variados reconoce mejor lo nuevo.',a:true},
  {q:'La máquina entiende lo que ve, como una persona.',a:false},
  {q:'Un error del 10 % significa que a nadie le pasa nada.',a:false},
  {q:'Para cazar un sesgo se mira con qué se entrenó.',a:true},
  {q:'Entrenada en una sola aldea, la máquina sirve en todo el país.',a:false},
  {q:'La prueba se hace con ejemplos que la máquina nunca vio.',a:true},
  {q:'Agrupar por parecido, sin etiquetas, es no supervisado.',a:true}
];
const evalMCBank=[
  {q:'¿Qué diferencia a un programa que APRENDE de uno de siempre?',o:['Que es más caro','Que saca la regla de los ejemplos','Que no usa computadora','Que nunca se equivoca'],a:1},
  {q:'¿Qué es una etiqueta?',o:['El precio del programa','Un adorno de la pantalla','La respuesta correcta que le pone una persona','El nombre de la máquina'],a:2},
  {q:'¿Para qué sirve PROBAR con ejemplos nuevos?',o:['Para saber si aprendió o memorizó','Para gastar menos batería','Para que se entretenga','Para hacerla más rápida'],a:0},
  {q:'Se entrenó con maíz, frijol y café. Ve una hoja de plátano.',o:['La reconoce igual','Se apaga','La ignora','Se puede equivocar: nunca vio una'],a:3},
  {q:'¿Cómo se llama ese fallo?',o:['Patrón','Sesgo','Etiqueta','Refuerzo'],a:1},
  {q:'¿De quién es la culpa de un sesgo?',o:['De la máquina','De nadie','De quien eligió los ejemplos','Del que la usa'],a:2},
  {q:'Aprender con ejemplos que traen su respuesta se llama…',o:['Aprendizaje supervisado','Aprendizaje por refuerzo','Aprendizaje no supervisado','Memorización'],a:0},
  {q:'Junta fotos parecidas sin que nadie las nombre. Eso es…',o:['Supervisado','Por refuerzo','Memorización','No supervisado'],a:3},
  {q:'Un robot gana puntos cuando avanza sin caerse. Eso es…',o:['Supervisado','Aprendizaje por refuerzo','No supervisado','Un patrón'],a:1},
  {q:'¿Qué es un patrón?',o:['Un error de la máquina','El precio de los datos','Lo que se repite en muchos ejemplos','Una etiqueta mal puesta'],a:2},
  {q:'Acierta 9 de cada 10. ¿Qué hay que preguntarse?',o:['Nada, está muy bien','Si se puede apagar','Cuánto cuesta','A quién le toca ese error'],a:3},
  {q:'Falla siempre con lo mismo. ¿Qué se mira primero?',o:['Con qué ejemplos la entrenaron','La marca del teléfono','Cuánta batería tiene','El color de la pantalla'],a:0},
  {q:'¿Por qué la etiqueta la pone una persona?',o:['Porque es más rápido','Porque la máquina no sabe la respuesta','Porque las máquinas no escriben','Por costumbre'],a:1},
  {q:'¿Qué pasa si los ejemplos vienen de una sola aldea?',o:['Nada, sirve igual','Entrena más rápido','Puede fallar en el resto del país','Aprende dos patrones'],a:2},
  {q:'¿Qué es entrenar?',o:['Apagar y encender la máquina','Copiar los datos a otra parte','Borrar los ejemplos viejos','Mostrarle ejemplos hasta hallar el patrón'],a:3}
];
const evalCPBank=[
  {q:'La respuesta correcta que pone una persona se llama ___.',a:'etiqueta'},
  {q:'Mostrarle ejemplos hasta hallar el patrón se llama ___.',a:'entrenar'},
  {q:'Examinarla con ejemplos que nunca vio se llama ___.',a:'probar'},
  {q:'Con los ejemplos mal repartidos aparece el ___.',a:'sesgo'},
  {q:'Lo que se repite en muchos ejemplos es el ___.',a:'patrón'},
  {q:'Las veces que la máquina contesta mal son el ___.',a:'error'},
  {q:'Un pedacito de información que se guarda es un ___.',a:'dato'},
  {q:'Aprender con ejemplos etiquetados es aprendizaje ___.',a:'supervisado'},
  {q:'Aprender con premios es aprendizaje por ___.',a:'refuerzo'},
  {q:'Agrupar lo que se parece es aprendizaje no ___.',a:'supervisado'},
  {q:'Antes de confiar hay que preguntar quién eligió los ___.',a:'ejemplos'},
  {q:'No entiende lo que ve: encuentra lo que se ___.',a:'repite'},
  {q:'Si la persona etiqueta mal, la máquina aprende ese ___.',a:'error'},
  {q:'Lo que queda guardado después de entrenar es el ___.',a:'modelo'},
  {q:'Entrenar cuesta ___ y se hace una sola vez.',a:'tiempo'}
];
const evalPRBank=[
  {term:'Dato',def:'Un pedacito de información que se guarda'},
  {term:'Etiqueta',def:'La respuesta correcta que pone una persona'},
  {term:'Entrenar',def:'Mostrarle ejemplos hasta hallar el patrón'},
  {term:'Patrón',def:'Lo que se repite en muchos ejemplos'},
  {term:'Probar',def:'Examinarla con ejemplos que nunca vio'},
  {term:'Error',def:'Las veces que la máquina contesta mal'},
  {term:'Sesgo',def:'Fallar con lo que faltó en los ejemplos'},
  {term:'Supervisado',def:'Los ejemplos traen su etiqueta puesta'},
  {term:'No supervisado',def:'Agrupa lo que se parece, sin etiquetas'},
  {term:'Por refuerzo',def:'Aprende probando: premio si le sale bien'},
  {term:'Modelo',def:'Lo que queda guardado después de entrenar'},
  {term:'Ejemplo',def:'Cada cosa que le mostramos para que aprenda'},
  {term:'Instrucción',def:'Una orden que obedece sin aprender nada'},
  {term:'Reparto de los ejemplos',def:'Lo primero que se mira si falla siempre igual'},
  {term:'Quien elige los ejemplos',def:'De quién es la culpa de un sesgo'}
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

function genEval(){sfx('click');_evalFormaSelector(); const _selF = document.getElementById('evalFormaSel'); if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10))); const cf = evalFormNum; const rng = _evalRng(cf); window._currentEvalForm=cf;evalFormNum = (evalFormNum % EVAL_FORMAS) + 1; _evalFormaSelector();saveProgress();document.getElementById('eval-screen-title').textContent=`🎓 Evaluación Final · Forma ${cf} · Cómo Aprende una Máquina`;evalAnsVisible=false;const out=document.getElementById('evalOut');out.innerHTML='';const bar=document.createElement('div');bar.className='eval-score-bar';bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje · 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25 pts</span><span class="eval-score-pill esp-tf">V/F 25 pts</span><span class="eval-score-pill esp-mc">Selección 25 pts</span><span class="eval-score-pill esp-pr">Pareados 25 pts</span></div>`;out.appendChild(bar);const cpItems=_pickF(evalCPBank,5, rng);const s1=document.createElement('div');s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';cpItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='cp';d.dataset.evalIndex=i;const qHtml=item.q.replace('___',`<input class="eval-cp-input" type="text" data-cp="${i}" autocomplete="off">`);d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbCp${i}" aria-live="polite"></div>`;s1.appendChild(d);});out.appendChild(s1);const tfItems=_pickF(evalTFBank,5, rng);const s2=document.createElement('div');s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';tfItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='tf';d.dataset.evalIndex=i;d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="true"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="false"> Falso</label></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbTf${i}" aria-live="polite"></div>`;s2.appendChild(d);});out.appendChild(s2);const mcItems=_pickF(evalMCBank,5, rng);const s3=document.createElement('div');s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';mcItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='mc';d.dataset.evalIndex=i;const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join('');d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbMc${i}" aria-live="polite"></div>`;s3.appendChild(d);});out.appendChild(s3);const prItems=_pickF(evalPRBank,5, rng);const shuffledDefs=_shuffleF(prItems, rng);const letters=['A','B','C','D','E'];const s4=document.createElement('div');s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';const matchCard=document.createElement('div');matchCard.className='eval-item';let colLeft='<div class="eval-match-col"><h4>📌 Términos</h4>';prItems.forEach((item,i)=>{colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> <select class="eval-match-select" data-pr="${i}" aria-label="Respuesta pareada ${i+16}"><option value="">—</option>${letters.map(l=>`<option value="${l}">${l}</option>`).join('')}</select> ${item.term}</div>`;});colLeft+='</div>';let colRight='<div class="eval-match-col"><h4>🔑 Definiciones</h4>';shuffledDefs.forEach((item,i)=>{colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`;});colRight+='</div>';const ansKey=prItems.map((item,i)=>{const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)];return`${i+16}→${letter}`;}).join(' · ');matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div><div class="eval-item-feedback" id="evalFbPr" aria-live="polite"></div>`;s4.appendChild(matchCard);out.appendChild(s4);window._evalPrintData={tf:tfItems,mc:mcItems,cp:cpItems,pr:{terms:prItems,shuffledDefs,letters}};const autoPanel=document.createElement('div');autoPanel.id='evalAutoResult';autoPanel.className='eval-auto-result';autoPanel.innerHTML='<strong>🧮 Contesta en pantalla</strong> y toca <em>Calificar prueba</em>. Al imprimir sale sin tus respuestas.';out.appendChild(autoPanel);fin('s-evaluacion');}
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación Cómo Aprende una Máquina · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.12rem 0.4rem;margin:0.22rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #86198f;background:#fdf4ff;color:#86198f;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#86198f;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #86198f;height:12px;}.obt-pct{white-space:nowrap;}.qn{font-weight:700;min-width:22px;flex-shrink:0;}.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:40px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.18rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.14rem 0.35rem;margin-bottom:0.1rem;break-inside:avoid;page-break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.3;display:flex;gap:0.28rem;margin-bottom:0.07rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.1rem 0.5rem;}.mc-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:0.04rem 0.15rem;margin-left:0.8rem;}.mc-opt{font-size:9pt;display:flex;align-items:center;gap:0.15rem;}.mc-opt input{width:10px;height:10px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{margin-top:0.1rem;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.08rem 0.4rem;margin-top:0.08rem;}.pr-head{font-size:9pt;font-weight:700;color:#555;margin-bottom:0.1rem;}.pr-item{font-size:10.5pt;padding:0.1rem 0.28rem;background:#fdf4ff;border-radius:3px;margin-bottom:0.07rem;display:flex;align-items:center;gap:0.2rem;line-height:1.2;break-inside:avoid;page-break-inside:avoid;}.pr-num{font-weight:700;color:#86198f;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.22rem;padding:0.15rem 0;page-break-before:avoid;break-before:avoid;color:#86198f;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #86198f;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#555;}.pa{color:#007a00;font-weight:600;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · Cómo Aprende una Máquina · Educación Básica · II Ciclo · Inteligencia Artificial</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Evaluación Final · Cómo Aprende una Máquina · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u</div></div><div class="p-grid">${pR}</div>
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
  {txt:'Una aplicación de plagas se entrenó con fotos del occidente. Un productor del litoral dice que nunca le acierta.'},
  {txt:'Un programa corrige exámenes. Se entrenó con letra de computadora y los alumnos escriben a mano.'},
  {txt:'Una máquina clasifica recibos y acierta 95 de cada 100. El dueño ya no revisa.'},
  {txt:'Para ir rápido, alguien etiqueta doscientas fotos sin mirarlas.'},
  {txt:'Un programa agrupó solo a los clientes. El gerente pregunta el nombre de cada grupo.'},
  {txt:'Una escuela prueba su clasificador con las cien fotos del entrenamiento. Acertó las cien.'}
];
const critCaseQuestions=[
  '1. ¿Qué falló aquí: los datos, el entrenamiento, la prueba o el uso?',
  '2. ¿Por qué la máquina se comporta así?',
  '3. ¿Qué habría que hacer para arreglarlo?',
  '4. ¿A quién le cae el daño y por qué?'
];
const critCaseGuides=[
  'Que nombre la etapa: juntar datos, etiquetar, entrenar, probar o usar. Casi todos fallan ANTES.',
  'Que lo explique: saca el patrón de lo que vio. No reconoce lo que no vio, y lo mal etiquetado lo aprende mal.',
  'Cada caso tiene su arreglo: juntar lo que falta, etiquetar bien, probar con ejemplos NUEVOS.',
  'Que diga a quién le toca: el productor, el alumno, el del recibo.'
];
const critErrorBank=[
  {txt:'"La máquina se equivocó con el plátano porque está mal hecha."',
   g1:'No. Nunca vio una hoja de plátano: es sesgo.',
   g2:'No se cambia de máquina: se juntan los ejemplos que faltaban.'},
  {txt:'"La probamos con los mismos ejemplos del entrenamiento y acertó todo."',
   g1:'Acertar con lo que ya vio no prueba nada: pudo memorizarlo.',
   g2:'La prueba se hace con ejemplos que NUNCA vio.'},
  {txt:'"Acierta el 95 %, así que ya no hay que revisar nada."',
   g1:'Ese 5 % son casos reales. A cada uno le toca una persona.',
   g2:'Un porcentaje alto no dice a QUIÉN le cae el error.'},
  {txt:'"Las etiquetas se pueden poner rápido, al azar, para no perder tiempo."',
   g1:'La etiqueta es la respuesta correcta. Si está mal, aprende mal.',
   g2:'Entrenar con etiquetas malas sale más caro que ponerlas bien.'},
  {txt:'"El no supervisado también dice cómo se llama cada grupo."',
   g1:'No. Agrupa por parecido, pero no sabe ningún nombre.',
   g2:'Ponerle nombre a cada grupo le toca a una persona.'},
  {txt:'"Si la máquina aprende sola, ya no hacen falta personas."',
   g1:'Hacen falta más que antes: juntan datos, etiquetan, eligen la prueba y revisan.',
   g2:'Sola busca el patrón. Todo lo demás lo deciden personas.'}
];
const critDecisionBank=[
  'Tu clasificador falla con un cultivo. ¿Juntas ejemplos de él, o avisas que no sirve?',
  'Te falta tiempo. ¿Etiquetas menos ejemplos pero bien, o muchos y al azar?',
  'Vas a probarlo. ¿Usas ejemplos que ya vio, o nuevos aunque saque menos?',
  'Acierta 9 de cada 10 en tu aldea. ¿Dices que sirve en todo el país, o dónde se probó?',
  'Te ofrecen más datos, todos del mismo lugar. ¿Los aceptas, o buscas de otros?'
];
const critDecisionGuide='La mejor decisión cuida el DATO y dice la verdad sobre el alcance. Se juntan los ejemplos que faltan. Se etiqueta bien aunque sean menos. Se prueba con ejemplos nuevos aunque el número baje. No se promete lo que no se probó.';
const critCompareBank=[
  {a:'Entrenar.',b:'Probar.',
   ga:'Mostrarle ejemplos con su etiqueta hasta hallar el patrón.',
   gb:'Examinarla con ejemplos que nunca vio, para ver si aprendió.',
   gr:'Los dos usan ejemplos, pero no los mismos. Probar dice si entrenar sirvió.'},
  {a:'Un programa que sigue reglas escritas.',b:'Un programa que aprende de ejemplos.',
   ga:'Hace lo que una persona escribió, paso por paso.',
   gb:'Saca la regla de lo que se repite en los ejemplos.',
   gr:'El primero nunca mejora solo. El segundo reconoce lo nuevo, pero falla con lo que no vio.'},
  {a:'El error de la máquina.',b:'El sesgo de los ejemplos.',
   ga:'Las veces que contesta mal, repartidas entre todos.',
   gb:'Fallar siempre con el mismo grupo, que faltaba en los ejemplos.',
   gr:'Un 5 % repartido es una cosa. Un 5 % que cae SIEMPRE en la misma aldea es otra.'}
];
const critCauseBank=[
  {cause:'Los ejemplos de entrenar venían de una sola zona.',guide:'Por eso falla en el resto del país, aunque en su zona acierte.'},
  {cause:'Se probó con los mismos ejemplos del entrenamiento.',guide:'Por eso los números salieron perfectos y no dicen nada.'},
  {cause:'Una persona etiquetó las fotos con prisa, sin mirarlas.',guide:'Por eso aprendió los errores de esa persona y los repite.'},
  {cause:'Se juntaron ejemplos de los cuatro cultivos de la zona.',guide:'Por eso reconoce hojas de los cuatro, hasta de fincas nuevas.'},
  {cause:'Busca lo que se repite y no entiende lo que ve.',guide:'Por eso acierta con lo parecido y se pierde con lo distinto.'}
];
const critEffectBank=[
  {effect:'Le dice a un productor que su cultivo está enfermo, y está sano.',guide:'Porque nunca vio hojas de ese cultivo. Es sesgo, no enfermedad.'},
  {effect:'Un modelo con 95 % de aciertos sigue necesitando revisión.',guide:'Porque ese 5 % son casos reales y le tocan a alguien.'},
  {effect:'Entrenado con letra de computadora, falla con la letra a mano.',guide:'Porque la letra a mano no estaba en sus ejemplos.'},
  {effect:'Hay que ponerle nombre a mano a los grupos.',guide:'Porque los juntó por parecido, pero no sabe cómo se llaman.'},
  {effect:'Juntar y etiquetar datos es lo más lento.',guide:'Porque esa parte no se puede dejar sola sin errores.'}
];
function genEvalCrit(){
  sfx('click');
  _injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });
  const _sC = document.getElementById('evalCritFormaSel');
  if (_sC && parseInt(_sC.value, 10)) evalCritFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sC.value, 10)));
  const cf=evalCritFormNum;window._currentEvalCritForm=cf;const rngC = _evalRng(200000 + cf);evalCritFormNum=(evalCritFormNum%EVAL_FORMAS)+1;_injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });saveProgress();
  document.getElementById('evalcrit-screen-title').textContent=`🧠 Pensamiento Crítico · Forma ${cf} · Cómo Aprende una Máquina`;
  evalCritAnsVisible=false;
  const out=document.getElementById('evalCritOut');out.innerHTML='';
  const kase=_pickF(critCaseBank,1,rngC)[0];
  const s1=document.createElement('div');
  s1.innerHTML=`<div class="eval-section-title">I. Caso de análisis: una máquina que se equivoca <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${kase.txt}</div>${critCaseQuestions.map((q,i)=>`<div class="crit-q-block"><div class="crit-q-label">${q}</div><textarea class="crit-textarea" rows="2" aria-label="${q}"></textarea><div class="crit-pauta">${critCaseGuides[i]}</div></div>`).join('')}<div class="crit-selfscore"><label for="critScore0">Obtenido:</label><input type="number" id="critScore0" class="crit-score-input" data-score="0" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s1);
  const err=_pickF(critErrorBank,1,rngC)[0];
  const s2=document.createElement('div');
  s2.innerHTML=`<div class="eval-section-title">II. Corrige el error <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${err.txt}</div><p style="font-size:0.85rem;margin-bottom:0.5rem;">Busca <strong>dos errores</strong> y corrígelos con tus palabras:</p><div class="crit-q-block"><div class="crit-q-label">Error 1 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 1 y su corrección"></textarea><div class="crit-pauta">${err.g1}</div></div><div class="crit-q-block"><div class="crit-q-label">Error 2 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 2 y su corrección"></textarea><div class="crit-pauta">${err.g2}</div></div><div class="crit-selfscore"><label for="critScore1">Obtenido:</label><input type="number" id="critScore1" class="crit-score-input" data-score="1" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s2);
  const dec=_pickF(critDecisionBank,1,rngC)[0];
  const s3=document.createElement('div');
  s3.innerHTML=`<div class="eval-section-title">III. Toma de decisiones: qué harías tú <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${dec}</div><div class="crit-q-block"><div class="crit-q-label">¿Qué opción recomendarías? Explica por qué, con lo que sabes de los datos, la prueba y el sesgo.</div><textarea class="crit-textarea" rows="4" aria-label="Recomendaciones y su justificación"></textarea><div class="crit-pauta">${critDecisionGuide}</div></div><div class="crit-selfscore"><label for="critScore2">Obtenido:</label><input type="number" id="critScore2" class="crit-score-input" data-score="2" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
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
  const totalPanel=document.createElement('div');totalPanel.id='evalCritTotalResult';totalPanel.className='crit-total-panel';totalPanel.innerHTML='<strong>🧮 Autoevaluación:</strong> contesta, compara con la <em>Pauta</em>, anota tu puntaje (0–20) y toca <em>Calcular Total</em>.';out.appendChild(totalPanel);
  fin('s-evaluacion');
}
function toggleEvalCritAns(){evalCritAnsVisible=!evalCritAnsVisible;document.querySelectorAll('#evalCritOut .crit-pauta').forEach(el=>el.style.display=evalCritAnsVisible?'block':'none');sfx('click');}
function calcCritTotal(){
  if(!window._evalCritData){showToast('⚠️ Genera una prueba primero');return;}
  sfx('click');
  let total=0;
  document.querySelectorAll('#evalCritOut .crit-score-input').forEach(inp=>{let v=parseInt(inp.value)||0;v=Math.max(0,Math.min(20,v));inp.value=v;total+=v;});
  const panel=document.getElementById('evalCritTotalResult');
  if(panel){panel.className='crit-total-panel '+(total>=70?'eval-auto-pass':'eval-auto-risk');panel.innerHTML=`<strong>Puntaje total autoevaluado: ${total}/100</strong><br><em>Compara con la Pauta antes de anotar.</em>`;}
  const formKey='crit_'+(window._currentEvalCritForm||1);
  if(total>=70){if(!xpTracker.wgt.has(formKey)){xpTracker.wgt.add(formKey);pts(8);}showToast('🎯 Pensamiento crítico: '+total+'/100');}
  else showToast('🧮 Puntaje registrado: '+total+'/100. ¡Sigue practicando!');
}
function printEvalCrit(){
  if(!window._evalCritData){showToast('⚠️ Genera una prueba primero');return;}
  sfx('click');
  const forma=window._currentEvalCritForm||1;const d=window._evalCritData;
  const lines=(n)=>Array(n).fill('<div class="ln"></div>').join('');
  let s1=`<div class="sec-title"><span>I. Caso de análisis: una máquina que se equivoca</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.kase.txt}</p>`;
  critCaseQuestions.forEach(q=>{s1+=`<p class="crit-print-q">${q}</p>${lines(1)}`;});
  let s2=`<div class="sec-title"><span>II. Corrige el error</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.err.txt}</p><p class="crit-print-q">Busca dos errores y corrígelos con tus palabras:</p><p class="crit-print-q"><strong>Error 1:</strong></p>${lines(1)}<p class="crit-print-q"><strong>Error 2:</strong></p>${lines(1)}`;
  let s3=`<div class="sec-title"><span>III. Toma de decisiones: qué harías tú</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.dec}</p><p class="crit-print-q">¿Qué opción recomendarías? Explica por qué, con lo que sabes de los datos, la prueba y el sesgo.</p>${lines(2)}`;
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
  const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Pensamiento Crítico Cómo Aprende una Máquina · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.1rem 0.4rem;margin:0.2rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #86198f;background:#fdf4ff;color:#86198f;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#86198f;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #86198f;height:12px;}.obt-pct{white-space:nowrap;}.crit-print-scenario{font-size:10.5pt;background:#fdf4ff;border-left:3px solid #86198f;padding:0.2rem 0.5rem;margin:0.1rem 0 0.2rem;line-height:1.3;}.crit-print-q{font-size:10pt;font-weight:600;margin:0.15rem 0 0.08rem;line-height:1.25;}.ln{border-bottom:1px solid #111;min-height:12px;margin-bottom:2px;}.crit-compare-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin:0.15rem 0;}.crit-compare-print-box{font-size:9.5pt;background:#fdf4ff;border-radius:4px;padding:0.25rem 0.4rem;line-height:1.25;}.crit-print-tbl{width:100%;border-collapse:collapse;font-size:9.5pt;margin-top:0.15rem;}.crit-print-tbl th,.crit-print-tbl td{border:1px solid #999;padding:0.3rem 0.45rem;text-align:left;height:30px;vertical-align:middle;}.crit-print-tbl th{background:#fdf4ff;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.08rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.9rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.45rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.1rem;margin-bottom:0.18rem;}.p-crit-line{font-size:11pt;color:#007a00;margin-bottom:0.18rem;line-height:1.35;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.2rem;padding:0.1rem 0;color:#86198f;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #86198f;}.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:12.7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="critEvalPage"><div class="ph"><h2>Evaluación Competencial · Pensamiento Crítico · Cómo Aprende una Máquina · Educación Básica · II Ciclo · Inteligencia Artificial</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 5 secciones de 20 puntos</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100</span></div></div><div class="pauta-wrap" id="critPautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Pensamiento Crítico · Cómo Aprende una Máquina · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 5 secciones × 20 pts c/u — respuesta abierta, usar como guía de corrección</div></div><div class="p-grid">${pR}</div></div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("critEvalPage",250,0.55,1.2);fit("critPautaPage",250,0.55,1.2);})();<\/script></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(doc);win.document.close();setTimeout(()=>win.print(),400);
}

// ===================== LABORATORIO DE LOS SÍMBOLOS =====================
const parteData = (function () {
  /* Del vocabulario común de la ruta. El aspecto «¿Y si falta?» no está en el
     archivo de datos: es lo propio de esta misión, porque en II Ciclo lo que se
     enseña no es la palabra, es qué se rompe cuando esa pieza no está. */
  const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const falta = {
    dato:    'Sin datos no hay nada que aprender: son su comida.',
    etiqueta:'Sin etiquetas ve la foto y no sabe qué es.',
    entrenar:'Sin entrenar no saca ninguna regla. Solo obedece lo escrito.',
    sesgo:   'El sesgo no falta: aparece si nadie revisa el reparto.'
  };
  const donde = {
    dato:    '🌽 En la finca: cada foto de una hoja, con su cultivo.',
    etiqueta:'👩‍🌾 La pone el técnico que distingue sana de enferma.',
    entrenar:'💻 En una computadora grande, una sola vez. Tarda días.',
    sesgo:   '🍌 Se ve cuando llega un cultivo que nadie fotografió.'
  };
  const out = {};
  ['dato','etiqueta','entrenar','sesgo'].forEach(k => {
    const c = IA_CONCEPTOS.find(x => x.clave === k);
    out[k] = {
      nombre: c.palabra, icon: c.emoji,
      estructura: { title: '¿Qué es?',      info: '<strong>' + esc(c.corta) + '</strong><br><br>' + esc(c.definicion) },
      funcion:    { title: 'Un ejemplo',    info: esc(c.ejemplo) },
      ubicacion:  { title: '¿Dónde se usa?', info: esc(donde[k]) },
      dato:       { title: '¿Y si falta?',  info: '⚠️ ' + esc(falta[k]) }
    };
  });
  return out;
})();
let labParte='dato',labAspecto='estructura';
function labShowParte(parteKey){labParte=parteKey;updateLabDisplay();document.querySelectorAll('.lab-cont-btn').forEach(b=>b.classList.remove('active-pri'));const btn=document.querySelector(`[data-parte="${parteKey}"]`);if(btn)btn.classList.add('active-pri');if(typeof sfx==='function')sfx('click');}
function labShowAspecto(aspectoKey){labAspecto=aspectoKey;updateLabDisplay();document.querySelectorAll('.lab-asp-btn').forEach(b=>b.classList.remove('active-sec'));const btn=document.querySelector(`[data-aspecto="${aspectoKey}"]`);if(btn)btn.classList.add('active-sec');if(typeof sfx==='function')sfx('click');}
function updateLabDisplay(){const data=parteData[labParte];const asp=data[labAspecto];document.getElementById('lab-sentence').innerHTML=`🔬 Explorando: <strong>${data.nombre}</strong> → <strong>${asp.title}</strong>`;document.getElementById('lab-display').innerHTML=`<div class="lab-cont-header">${data.icon} ${data.nombre}</div><div class="lab-asp-title">${asp.title}</div><div class="lab-asp-info">${asp.info}</div>`;}

// ===================== DIPLOMA =====================
function _diplPct(){return xp>=MXP?100:Math.round((xp/MXP)*100);}
function openDiploma(){sfx('fan');const pct=_diplPct();document.getElementById('diplPct').textContent=pct+'%';document.getElementById('diplBar').style.width=pct+'%';document.getElementById('diplDate').textContent='Fecha: '+new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});const msgs=['¡Sigue aprendiendo!','¡Muy buen trabajo!','¡Vas muy bien!','¡Ya sabes cómo se entrena una máquina!','¡Cazador de sesgos!'];document.getElementById('diplMsg').textContent=msgs[Math.min(Math.floor(pct/25),4)];const stars=['⭐','⭐⭐','⭐⭐⭐'];document.getElementById('diplStars').textContent=stars[Math.min(Math.floor(pct/40),2)];const achTxt=unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(' · ');document.getElementById('diplAch').textContent=achTxt||'Sigue completando secciones para desbloquear logros';document.getElementById('diplomaOverlay').classList.add('open');launchConfetti();}
function closeDiploma(){document.getElementById('diplomaOverlay').classList.remove('open');}
function updateDiplomaName(v){document.getElementById('diplName').textContent=v||'Estudiante';}
function shareWA(){const name=document.getElementById('diplName').textContent||'Estudiante';const pct=_diplPct();const msg=`🧠 ¡${name} completó la Misión "Cómo Aprende una Máquina"! 🏅 Progreso: ${pct}% · 🌱 policastsapien.com`;_waShare(msg);}
async function captureDiploma(){if(typeof html2canvas==='undefined'){showToast('⚠️ Cargando... intenta de nuevo');return;}sfx('click');const card=document.querySelector('.diploma-card');const btn=document.querySelector('.diploma-actions .btn-pri');const toHide=[card.querySelector('.diploma-input'),card.querySelector('.diploma-actions'),card.querySelector('hr')];if(btn){btn.disabled=true;btn.textContent='⏳ Capturando...';}toHide.forEach(el=>{if(el)el.style.display='none';});let dataUrl='';try{const canvas=await html2canvas(card,{scale:2,useCORS:true,backgroundColor:'#ffffff'});toHide.forEach(el=>{if(el)el.style.display='';});dataUrl=canvas.toDataURL('image/png');const name=(document.getElementById('diplName').textContent||'Estudiante').replace(/\s+/g,'-');const fileName='constancia-'+name+'.png';const cap=window.Capacitor;if(cap&&cap.isNativePlatform&&cap.isNativePlatform()&&cap.Plugins?.Filesystem&&cap.Plugins?.Share){const base64Data=dataUrl.split(',')[1];const result=await cap.Plugins.Filesystem.writeFile({path:fileName,data:base64Data,directory:'CACHE'});await cap.Plugins.Share.share({url:result.uri,dialogTitle:'Guardar / Compartir Constancia'});}else{const a=document.createElement('a');a.href=dataUrl;a.download=fileName;a.click();}}catch(e){toHide.forEach(el=>{if(el)el.style.display='';});if(e.name!=='AbortError')showToast('⚠️ No se pudo guardar la constancia');}finally{if(btn){btn.disabled=false;btn.textContent='📷 Guardar foto';}}}

// ===================== INIT =====================

// ===================== EL APRENDIZAJE, EN LA PANTALLA =====================
/* El vocabulario y los tres tipos se PINTAN desde js/data/ia-conceptos.js. Es
   la misma razón de siempre: el mismo texto acaba en la pantalla y en la ficha
   que se fotocopia, y si cada uno lleva su copia, un día dejan de decir lo
   mismo. De ahí sale también `_dev/verifica-ia.js`. */
function _esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

function pintarIaCiclo(){
  const cont=document.getElementById('ia-ciclo');if(!cont)return;
  const pasos=[
    {e:'📦',t:'1. Datos',d:'Se juntan muchísimos ejemplos: fotos, textos, sonidos, medidas.'},
    {e:'🏷️',t:'2. Etiquetas',d:'Una persona escribe la respuesta correcta de cada uno.'},
    {e:'🏋️',t:'3. Entrenamiento',d:'Los mira una y otra vez, y busca el patrón que los separa.'},
    {e:'🧪',t:'4. Prueba',d:'Se la examina con ejemplos que NUNCA vio.'},
    {e:'❌',t:'5. Error',d:'Se cuenta cuántas falló. Ninguna acierta el cien por ciento.'},
    {e:'🔁',t:'6. Se corrige',d:'Se juntan los ejemplos que faltaban y se vuelve a entrenar.'}
  ];
  cont.innerHTML=pasos.map(p=>
    `<div class="ciclo-paso"><div class="ciclo-e">${p.e}</div><div><h4>${p.t}</h4><p>${_esc(p.d)}</p></div></div>`
  ).join('');
}

function pintarIaTipos(){
  const cont=document.getElementById('ia-tipos');if(!cont)return;
  const tonos=['tc-teal','tc-gold','tc-jade'];
  const tipos=IA_CONCEPTOS.filter(c=>['supervisado','nosupervisado','refuerzo'].includes(c.clave));
  cont.innerHTML=tipos.map((c,i)=>
    `<div class="type-chip ${tonos[i%tonos.length]}"><div class="t-art">${c.emoji} ${_esc(c.palabra)}</div><div class="t-info">${_esc(c.definicion)}<br><br><em>${_esc(c.ejemplo)}</em></div></div>`
  ).join('');
}

function pintarIaVocabulario(){
  const cont=document.getElementById('ia-vocabulario');if(!cont)return;
  cont.innerHTML=IA_CONCEPTOS.filter(c=>c.ciclo===2).map(c=>
    `<div class="type-chip tc-purple"><div class="t-art">${c.emoji} ${_esc(c.palabra)}</div><div class="t-info">${_esc(c.corta)}</div></div>`
  ).join('');
}

function pintarIaReglas(){
  const cont=document.getElementById('ia-reglas');if(!cont)return;
  cont.innerHTML=IA_REGLAS_ORO.map((r,i)=>
    `<div class="ia-regla"><div class="ia-regla-n">${r.emoji}</div><div><h4>${i+1}. ${_esc(r.regla)}</h4><p>${_esc(r.porque)}</p></div></div>`
  ).join('');
}

// ═════════════ 🧪 EL ENTRENADOR ═════════════
/* La interacción que sostiene esta misión. El alumno elige CON QUÉ EJEMPLOS se
   entrena la máquina y después la prueba; el sesgo no se lo cuenta un párrafo,
   lo produce él dejando un cultivo fuera.

   Cómo decide la máquina, y está escrito así para que sea verdad y no un truco:
   de cada cultivo que vio aprende CUÁNTAS MANCHAS tiene una hoja sana suya. A
   una hoja de un cultivo que nunca vio no le puede aplicar su regla, así que
   usa el promedio de los que sí conoce. Y ahí está la trampa del tema: las
   hojas de plátano se rasgan con el viento y tienen manchas de por sí, así que
   una máquina que solo vio maíz, frijol y café le dice al productor de plátano
   que su cultivo está enfermo cuando no lo está. No hay red: todo pasa dentro
   del teléfono. */
const IA_CULTIVOS=[
  {k:'maiz',   e:'🌽',n:'Maíz',   sano:1},
  {k:'frijol', e:'🫘',n:'Frijol', sano:1},
  {k:'cafe',   e:'☕',n:'Café',   sano:1},
  {k:'platano',e:'🍌',n:'Plátano',sano:3}
];
/* Ocho hojas de prueba, dos por cultivo. Las manchas de cada una salen de la
   regla de su cultivo: la sana está en su límite y la enferma lo pasa. */
const IA_HOJAS_PRUEBA=[
  {c:'maiz',   manchas:1,real:'sana'},   {c:'maiz',   manchas:3,real:'con plaga'},
  {c:'frijol', manchas:0,real:'sana'},   {c:'frijol', manchas:4,real:'con plaga'},
  {c:'cafe',   manchas:1,real:'sana'},   {c:'cafe',   manchas:3,real:'con plaga'},
  {c:'platano',manchas:3,real:'sana'},   {c:'platano',manchas:6,real:'con plaga'}
];
let iaEntSel={maiz:true,frijol:true,cafe:true,platano:false}, iaEntrenado=null;

function pintarIaEntrenador(){
  const cont=document.getElementById('ent-cultivos');if(!cont)return;
  cont.innerHTML=IA_CULTIVOS.map(c=>
    `<button class="ent-chip${iaEntSel[c.k]?' ent-on':''}" data-k="${c.k}" onclick="iaEntToggle('${c.k}')" aria-pressed="${iaEntSel[c.k]}">${c.e} ${c.n}</button>`
  ).join('');
}

function iaEntToggle(k){
  sfx('click'); iaEntSel[k]=!iaEntSel[k]; iaEntrenado=null;
  pintarIaEntrenador();
  const caja=document.getElementById('ent-caja');
  if(caja) caja.innerHTML='<p class="ent-vacio">Cambiaste los ejemplos. Toca <strong>🏋️ Entrenar</strong> otra vez.</p>';
}

function iaEntrenar(){
  sfx('click');
  const elegidos=IA_CULTIVOS.filter(c=>iaEntSel[c.k]);
  const caja=document.getElementById('ent-caja'); if(!caja) return;
  if(!elegidos.length){
    caja.innerHTML='<p class="ent-vacio">🤖 Sin ejemplos no aprende nada. Elige al menos un cultivo.</p>';
    fb('fbEnt','Sin datos no aprende nada: son lo primero.',false);
    return;
  }
  const promedio=elegidos.reduce((s,c)=>s+c.sano,0)/elegidos.length;
  iaEntrenado={reglas:{},promedio:promedio};
  elegidos.forEach(c=>{iaEntrenado.reglas[c.k]=c.sano;});
  caja.innerHTML='<p class="ent-desc">🤖 <strong>Ya entrena.</strong> Esto es lo que aprendí:</p>'+
    elegidos.map(c=>`<div class="ent-regla">${c.e} <strong>${c.n}:</strong> una hoja sana tiene hasta <strong>${c.sano}</strong> mancha${c.sano===1?'':'s'}.</div>`).join('')+
    `<div class="ent-regla ent-regla-otro">❓ <strong>Un cultivo que nunca vi:</strong> uso el promedio de los otros, <strong>${promedio.toFixed(1)}</strong> manchas.</div>`+
    '<p class="ent-desc">Ahora toca <strong>🧪 Probar</strong> con ocho hojas nuevas.</p>';
  fb('fbEnt','Entrenada con '+elegidos.length+' cultivo'+(elegidos.length===1?'':'s')+'. Pruébala.',true);
  if(!xpTracker.wgt.has('ent_entrenar')){xpTracker.wgt.add('ent_entrenar');pts(2);}
}

function iaEntProbar(){
  sfx('click');
  const caja=document.getElementById('ent-caja'); if(!caja) return;
  if(!iaEntrenado){ fb('fbEnt','Primero toca «Entrenar».',false); return; }
  let ok=0; const fallan=[];
  const filas=IA_HOJAS_PRUEBA.map(h=>{
    const cul=IA_CULTIVOS.find(c=>c.k===h.c);
    const conocido=iaEntrenado.reglas[h.c]!==undefined;
    const umbral=conocido?iaEntrenado.reglas[h.c]:iaEntrenado.promedio;
    const dice=h.manchas<=umbral?'sana':'con plaga';
    const bien=dice===h.real; if(bien) ok++; else fallan.push({cultivo:cul.n,dijo:dice});
    return `<div class="ent-fila ${bien?'ent-ok':'ent-no'}">`+
      `<span class="ent-mini">${cul.e}</span>`+
      `<span class="ent-txt"><strong>${cul.n}</strong> · ${h.manchas} mancha${h.manchas===1?'':'s'} · de verdad está <strong>${h.real}</strong>`+
      (conocido?'':' <em>(cultivo que nunca vio)</em>')+'</span>'+
      `<span class="ent-dice">dice: <strong>${dice}</strong> ${bien?'✅':'❌'}</span></div>`;
  }).join('');
  const total=IA_HOJAS_PRUEBA.length;
  /* El mensaje dice QUÉ pasó y EN QUÉ DIRECCIÓN se equivocó, porque los dos
     errores no cuestan lo mismo: decirle «sana» a una hoja enferma deja la
     plaga suelta en la milpa; decirle «enferma» a una sana le hace fumigar de
     balde. El que se equivoque siempre con el mismo cultivo es el sesgo. */
  const nombres=[...new Set(fallan.map(f=>f.cultivo))];
  const lista=nombres.length===1?nombres[0]:nombres.slice(0,-1).join(', ')+' y '+nombres[nombres.length-1];
  const falsasSanas=fallan.filter(f=>f.dijo==='sana').length;
  let msj;
  if(ok===total){
    const vistos=IA_CULTIVOS.filter(c=>iaEntSel[c.k]).length;
    msj='🎉 <strong>Acertó las ocho.</strong> '+(vistos===4
      ? 'Le enseñaste los cuatro, y a cada hoja le aplicó SU regla.'
      : 'Con estos le alcanzó. A los que no vio les aplica un promedio. Quita y pon cultivos.');
  } else {
    msj='⚖️ <strong>Falló '+(total-ok)+' de '+total+(nombres.length===1?', y es de '+lista:', y todas de '+lista)+'.</strong> '+
        'La máquina no está mala: de '+lista+' <strong>no vio ni un ejemplo</strong>, y le aplicó el promedio de los otros. '+
        (falsasSanas?'Y lo peor: le dijo <strong>«sana»</strong> a una hoja enferma. La plaga se queda en la milpa. ':'Le dijo <strong>«con plaga»</strong> a una hoja sana. Ese productor fumiga de balde. ')+
        'Eso es el <strong>sesgo</strong>: lo puso quien eligió los ejemplos. Cambia los cultivos.';
  }
  caja.innerHTML='<p class="ent-desc">🧪 Probada con <strong>ocho hojas nuevas</strong>:</p>'+filas+
    '<p class="ent-listo">'+msj+'</p>';
  if(ok===total){
    fb('fbEnt','¡Ocho de ocho! +4 XP',true); sfx('fan');
    if(!xpTracker.wgt.has('ent_todo')){xpTracker.wgt.add('ent_todo');pts(4);}
    fin('s-estructura');
  } else {
    fb('fbEnt','Acertó '+ok+' de '+total+'. Mira con qué la entrenaste.',false); sfx('no');
    if(!xpTracker.wgt.has('ent_sesgo')){xpTracker.wgt.add('ent_sesgo');pts(3);unlockAchievement('cazasesgo');}
  }
}

function iaEntReiniciar(){
  sfx('click'); iaEntSel={maiz:true,frijol:true,cafe:true,platano:false}; iaEntrenado=null;
  pintarIaEntrenador();
  const caja=document.getElementById('ent-caja');
  if(caja) caja.innerHTML='<p class="ent-vacio">Elige los cultivos de arriba y toca <strong>🏋️ Entrenar</strong>.</p>';
  const el=document.getElementById('fbEnt'); if(el) el.classList.remove('show');
}

window.addEventListener('DOMContentLoaded',()=>{
  try{iaDescInit();}catch(e){} // 🔭 Descubre: pinta las actividades; no marca ninguna sección. Si el archivo de datos no llegó, la misión sigue.
  initTheme();
  loadProgress();
  pintarIaCiclo();
  pintarIaTipos();
  pintarIaVocabulario();
  pintarIaReglas();
  pintarIaEntrenador();
  iaEntReiniciar();
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
  document.querySelector('[data-parte="dato"]')?.classList.add('active-pri');
  document.querySelector('[data-aspecto="estructura"]')?.classList.add('active-sec');
  renderAchPanel();
});

(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalCrit==='function') _injectFormaSel('genEvalCrit','evalCritFormaSel',evalCritFormNum,function(v){evalCritFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();

/* ============================================================
   El Parque de Juegos 3D de la ruta
   ============================================================ */

/* Los juegos 3D se abren en otra pestaña y su botón ← trae de vuelta
   con «#s-juegos3d» detrás. Sin esto, el alumno que sale de un juego
   cae en la primera sección de la misión y tiene que volver a buscar
   el Parque entre catorce pestañas —que en un teléfono se deslizan—
   para abrir el siguiente. */
function abrirSeccionDelEnlace(){
  const id = (location.hash || '').replace('#','');
  if(!id) return;
  const sec = document.getElementById(id);
  if(sec && sec.classList.contains('sec')) go(id);
}
window.addEventListener('hashchange', abrirSeccionDelEnlace);

/* Cada juego 3D guarda su avance en SU llave de localStorage y no
   toca la de la misión: si escribieran en la misma, una partida
   abierta en otra pestaña le borraría al alumno el XP de aquí. Aquí
   solo se LEE, para que la tarjeta diga por dónde va. */
function pintarMedallas3D(){
  const paso = (campo, total, palabra, plural) => ({
    oro: d => !!d.completado,
    texto: d => d.completado
      ? '🏆 ' + (plural || ('los ' + total + ' ' + palabra + 's'))
      : '🏅 ' + palabra + ' ' + Math.min(total, (d[campo]|0) + 1) + ' de ' + total
  });
  const marcas = {
    separador: Object.assign({llave:'j3d_separador_v1'}, paso('caso',  4, 'caso',   'los 4 casos')),
    grupos:    Object.assign({llave:'j3d_grupos_v1'},    paso('nivel', 4, 'montón', 'los 4 montones')),
    sesgo:     Object.assign({llave:'j3d_sesgo_v1'},     paso('reto',  4, 'reto',   'los 4 retos')),
    memorizo:  Object.assign({llave:'j3d_memorizo_v1'},  paso('tanda', 3, 'tanda',  'las 3 tandas')),
    refuerzo:  Object.assign({llave:'j3d_refuerzo_v1'},  paso('patio', 3, 'patio',  'los 3 patios')),
    /* El del vecino no lleva niveles: son seis rondas seguidas y se
       acaba de una sentada, así que lo único que hay que decir es si
       ya lo terminó. */
    vecino: {llave:'j3d_vecino_v1', oro: d => !!d.completado,
             texto: d => d.completado ? '🏆 las 6 rondas' : '🏅 empezado'}
  };
  document.querySelectorAll('[data-medalla]').forEach(el => {
    const m = marcas[el.dataset.medalla];
    if(!m) return;
    let d = null;
    try { d = JSON.parse(localStorage.getItem(m.llave)); } catch(e) {}
    const card = el.closest('.juego-card');
    const btn = card ? card.querySelector('.btn-juego') : null;
    el.classList.remove('con','sin','oro');
    if(!d){ el.textContent = '· sin empezar'; el.classList.add('sin'); if(btn) btn.textContent = '▶️ Jugar'; return; }
    el.textContent = m.texto(d);
    /* las estrellas del juego se enseñan aquí: es la cosecha que el
       alumno quiere ver crecer desde fuera */
    if(d.estrellas) el.textContent += ' · ⭐' + d.estrellas;
    const oro = !!(m.oro && m.oro(d));
    el.classList.add(oro ? 'oro' : 'con');
    /* el botón dice la verdad: al que ya tiene partida no se le invita
       a «jugar» como si nada, se le invita a seguir */
    if(btn) btn.textContent = oro ? '▶️ Otra vez' : '▶️ Seguir';
  });
  const res = document.getElementById('parque-resumen');
  if(res){
    let emp = 0, oros = 0, total = 0;
    Object.keys(marcas).forEach(k => {
      total++;
      let d = null;
      try { d = JSON.parse(localStorage.getItem(marcas[k].llave)); } catch(e) {}
      if(d){ emp++; if(marcas[k].oro && marcas[k].oro(d)) oros++; }
    });
    res.textContent = emp === 0 ? '' :
      ('🎮 ' + emp + ' de ' + total + ' empezados' + (oros ? ' · 🏆 ' + oros + (oros === 1 ? ' completado' : ' completados') : ''));
  }
}

/* Los juegos viven en OTRA pestaña: al volver a esta, la medalla de la
   tarjeta se quedaba vieja y el alumno no veía su avance recién
   ganado. Se repinta al recuperar el foco. */
document.addEventListener('visibilitychange', () => { if(!document.hidden) pintarMedallas3D(); });
window.addEventListener('focus', () => pintarMedallas3D());
window.addEventListener('pageshow', () => pintarMedallas3D());

document.addEventListener('DOMContentLoaded', () => {
  pintarMedallas3D();
  abrirSeccionDelEnlace();
});

// ===================== 🔭 DESCUBRE · II CICLO =====================
/* Dos actividades de descubrimiento. Las CUENTAS viven en
   js/data/ia-descubre.js (IA_REGLAS_OCULTAS, iaCurvaExactitud): es lo que la
   sonda `verifica-descubre-ia` recalcula, y por eso aquí solo se pinta y se
   lleva el XP. */
const DESC_KEY = SAVE_KEY + '_descubre';
/* La sección se gana HACIENDO las dos: una ronda terminada y tres tamaños
   probados. Nunca se marca al abrir. */
function iaDescubreListo() { if (iaReglaTerminadas.size >= 1 && Object.keys(iaCurvaProbados).length >= 3) { fin('s-descubre'); unlockAchievement('maquina_humana'); } }

/* ── 🎯 Tú eres la máquina ────────────────────────────────────────────── */
let iaReglaRonda = 0, iaReglaIdx = 0, iaReglaAciertos = 0, iaReglaMarcas = [], iaReglaPedida = false, iaReglaEscrita = '', iaReglaTerminadas = new Set();
function iaReglaPintarRondas() {
  const c = document.getElementById('regla-rondas'); if (!c) return;
  c.innerHTML = IA_REGLAS_OCULTAS.map((r, i) =>
    '<button type="button" class="desc-chip' + (i === iaReglaRonda ? ' desc-on' : '') + (iaReglaTerminadas.has(i) ? ' desc-hecho' : '') +
    '" onclick="iaReglaEmpezar(' + i + ')">Ronda ' + (i + 1) + ' · ' + _esc(r.tipo) + 's</button>').join('');
}
function iaReglaEmpezar(i) { iaReglaRonda = i; iaReglaIdx = 0; iaReglaAciertos = 0; iaReglaMarcas = []; iaReglaPedida = false; iaReglaEscrita = ''; iaReglaPintarRondas(); iaReglaPintar(); }
function iaReglaMarcasHtml() {
  return '<div class="regla-marcas" aria-label="Tus aciertos, en orden">' + iaReglaMarcas.map(m => '<span>' + (m.ok ? '✅' : '❌') + '</span>').join('') + '</div>';
}
function iaReglaPintar() {
  const caja = document.getElementById('regla-caja'); if (!caja) return;
  const r = IA_REGLAS_OCULTAS[iaReglaRonda];
  /* A mitad de ronda se le pide la regla ANTES de seguir: es el momento en
     que la sacó, o en que cree que la sacó. */
  if (iaReglaIdx === IA_REGLAS_MEDIO && !iaReglaPedida) {
    caja.innerHTML = '<p class="regla-tit">Ronda ' + (iaReglaRonda + 1) + ' · vas ' + iaReglaAciertos + ' de ' + iaReglaIdx + '</p>' + iaReglaMarcasHtml() +
      '<p class="regla-mitad">✋ A mitad. Sin verla: <strong>¿cuál crees que es la regla?</strong></p>' +
      '<input type="text" id="regla-input" class="desc-input" maxlength="100" placeholder="Los que…" aria-label="Tu regla">' +
      '<div class="ens-btns"><button class="btn btn-pri" onclick="iaReglaAnotar(false)">✍️ Esa es mi regla</button>' +
      '<button class="btn btn-d" onclick="iaReglaAnotar(true)">Todavía no sé</button></div>';
    return;
  }
  if (iaReglaIdx >= r.ejemplos.length) {
    iaReglaTerminadas.add(iaReglaRonda);
    let html = '<p class="regla-tit">Ronda ' + (iaReglaRonda + 1) + ' terminada: <strong>' + iaReglaAciertos + ' de ' + r.ejemplos.length + '</strong></p>' + iaReglaMarcasHtml() +
      '<p class="regla-rev">🔓 La regla era: <strong>' + _esc(r.nombre) + '</strong>.</p>' +
      (iaReglaEscrita ? '<p class="regla-rev">Tú escribiste: «' + _esc(iaReglaEscrita) + '».</p>'
                      : '<p class="regla-rev">No la escribiste a mitad. La próxima, atrévete.</p>') +
      '<p class="regla-pista">💡 ' + _esc(r.pista) + '</p>';
    if (r.trampa) {
      html += '<div class="regla-trampa">⚠️ <strong>Aquí estaba la trampa.</strong> Hasta el ejemplo ' + r.trampa.hasta + ', «' + _esc(r.trampa.otraNombre) + '» y «' + _esc(r.nombre) +
        '» daban <b>las mismas respuestas</b>. A la máquina le pasa igual: elige una y puede fallar con el siguiente. El <b>' +
        _esc(String(r.ejemplos[r.trampa.hasta])) + '</b> separó las dos. Hacen falta ejemplos <b>variados</b>, no solo muchos.</div>';
    }
    html += '<div class="ens-btns"><button class="btn btn-g" onclick="iaReglaEmpezar(' + iaReglaRonda + ')">🔄 Otra vez</button>' +
      (iaReglaRonda < IA_REGLAS_OCULTAS.length - 1 ? '<button class="btn btn-pri" onclick="iaReglaEmpezar(' + (iaReglaRonda + 1) + ')">Siguiente ronda ▶</button>' : '') + '</div>';
    caja.innerHTML = html;
    if (!xpTracker.wgt.has('regla_' + iaReglaRonda)) { xpTracker.wgt.add('regla_' + iaReglaRonda); pts(1); }
    iaReglaPintarRondas(); iaDescubreListo(); return;
  }
  const x = r.ejemplos[iaReglaIdx];
  caja.innerHTML = '<p class="regla-tit">Ronda ' + (iaReglaRonda + 1) + ' · ejemplo ' + (iaReglaIdx + 1) + ' de ' + r.ejemplos.length + ' · llevas ' + iaReglaAciertos + ' bien</p>' + iaReglaMarcasHtml() +
    '<div class="regla-ej">' + _esc(String(x)) + '</div><p class="regla-preg">¿Entra en el grupo?</p>' +
    '<div class="ens-btns"><button class="btn btn-pri" onclick="iaReglaDecir(true)">✅ Entra</button><button class="btn btn-sec" onclick="iaReglaDecir(false)">❌ No entra</button></div>';
}
function iaReglaDecir(v) {
  const r = IA_REGLAS_OCULTAS[iaReglaRonda]; const x = r.ejemplos[iaReglaIdx]; if (x === undefined) return;
  const verdad = !!r.regla(x); const ok = v === verdad;
  if (ok) iaReglaAciertos++;
  iaReglaMarcas.push({ ok: ok }); sfx(ok ? 'ok' : 'no');
  fb('fbRegla', (ok ? '✅ ' : '❌ ') + _esc(String(x)) + (verdad ? ' SÍ entra.' : ' NO entra.'), ok);
  iaReglaIdx++; iaReglaPintar();
}
function iaReglaAnotar(noSe) {
  iaReglaPedida = true;
  const i = document.getElementById('regla-input'); const t = noSe ? '' : (i && i.value || '').trim();
  iaReglaEscrita = t;
  if (t.length >= 3 && !xpTracker.wgt.has('regla_esc_' + iaReglaRonda)) { xpTracker.wgt.add('regla_esc_' + iaReglaRonda); pts(2); }
  iaReglaPintar();
}

/* ── 📈 ¿Cuántos ejemplos hacen falta? ────────────────────────────────── */
let iaCurvaProbados = {}, iaCurvaD = null;
function iaCurvaPintarN() {
  const c = document.getElementById('curva-n'); if (!c) return;
  c.innerHTML = IA_CURVA_N.map(n => '<button type="button" class="desc-chip' + (iaCurvaProbados[n] !== undefined ? ' desc-hecho' : '') +
    '" onclick="iaCurvaProbar(' + n + ')">' + n + ' ejemplo' + (n > 1 ? 's' : '') + '</button>').join('');
}
function iaCurvaProbar(n) {
  iaCurvaD = iaCurvaD || iaCurvaDatos();
  iaCurvaProbados[n] = iaCurvaExactitud(n, iaCurvaD);
  if (!xpTracker.wgt.has('curva_' + n)) { xpTracker.wgt.add('curva_' + n); pts(1); }
  if (Object.keys(iaCurvaProbados).length === IA_CURVA_N.length && !xpTracker.wgt.has('curva_todo')) { xpTracker.wgt.add('curva_todo'); pts(3); }
  sfx('ok'); iaCurvaPintarN(); iaCurvaPintar(n); iaDescubreListo();
}
function iaCurvaPintar(ultimo) {
  const caja = document.getElementById('curva-caja'); if (!caja) return;
  const filas = IA_CURVA_N.filter(n => iaCurvaProbados[n] !== undefined).map(n => {
    const a = iaCurvaProbados[n];
    return '<div class="curva-fila' + (n === ultimo ? ' curva-ult' : '') + '"><span class="curva-n">' + n + '</span><span class="curva-barra"><i style="width:' + (a / 20 * 100) + '%"></i></span><span class="curva-pct">' + a + ' de 20</span></div>';
  }).join('');
  const a = iaCurvaProbados[ultimo]; const ej = iaCurvaD.entrena.slice(0, ultimo);
  const rojos = ej.filter(e => e.c === 'rojo').length, negros = ej.length - rojos;
  let nota;
  if (ultimo === 1) nota = 'Con un ejemplo conoce UNA clase (' + (rojos ? 'el rojo' : 'el negro') + ') y le dice eso a las 20. Acierta ' + a + ': la mitad, como una moneda.';
  else if (ultimo === 2) nota = 'Con dos, uno de cada, ya tiene con qué comparar: ' + a + ' de 20.';
  else if (iaCurvaProbados[20] !== undefined && iaCurvaProbados[50] !== undefined)
    nota = 'Con ' + ultimo + ' ejemplos (' + rojos + ' rojos y ' + negros + ' negros): ' + a + ' de 20. De 20 a 50 solo cambió ' + Math.abs(iaCurvaProbados[50] - iaCurvaProbados[20]) + ' acierto(s). Más ejemplos parecidos ya no enseñan más.';
  else nota = 'Con ' + ultimo + ' ejemplos (' + rojos + ' rojos y ' + negros + ' negros): ' + a + ' de 20. Prueba con más y con menos: mira dónde deja de subir.';
  caja.innerHTML = '<div class="curva-barras" aria-label="Aciertos según cuántos ejemplos">' + filas + '</div><p class="curva-nota">' + _esc(nota) + '</p>' +
    (Object.keys(iaCurvaProbados).length === IA_CURVA_N.length
      ? '<p class="curva-fin">📈 Los seis probados. Al principio sube con cada ejemplo. Después deja de subir: los nuevos <b>se parecen a los de antes</b>. No es cuántos: es cuáles.</p>' : '');
}
function iaDescInit() { iaReglaPintarRondas(); iaReglaPintar(); iaCurvaPintarN(); }
