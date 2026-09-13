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
const SAVE_KEY='tres_poderes_v1';
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
  primer_quiz:{icon:'🏅',label:'Primera prueba de los poderes superada'},
  flash_master:{icon:'🃏',label:'Conoció a los ocho, uno por uno'},
  clasif_pro:{icon:'🗂️',label:'Distingue los tres poderes'},
  id_master:{icon:'🔍',label:'Reconoce a cada uno por lo que hizo'},
  reto_hero:{icon:'🏆',label:'Campeón del reto de los poderes'},
  nivel3:{icon:'🎖️',label:'¡Buena memoria! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡Sabe su historia! Nivel 6'},
  widgets_master:{icon:'🧩',label:'Widgets de los poderes dominados'}
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
  PODERES.forEach(p => {
    f.push({ w: p.emoji + ' ' + p.nombre, a: '<strong>' + p.verbo + '</strong><br>' + p.quien });
    f.push({ w: '¿Qué hace el ' + p.nombre + '?', a: p.queHace });
  });
  PODERES_CONCEPTOS.forEach(c => {
    f.push({ w: c.emoji + ' ' + c.palabra, a: c.definicion });
  });
  /* Las tres que no son ni un poder ni una palabra suelta, y que son justo lo
     que el DCNB pide entender: qué manda sobre qué, por qué están separados y
     a quién le rinden cuentas. Sin ellas la misión enseña un organigrama. */
  f.push({ w: '📕 ¿Qué norma manda cuando dos se contradicen?',
           a: 'La que está más ARRIBA, no la más nueva. El orden empieza por la Constitución: ' +
              PODERES_JERARQUIA.escalones.slice(0, 3).join(' › ') + '…' });
  f.push({ w: '⚖️ ¿Por qué los tres poderes están separados?',
           a: PODERES_SEPARACION.texto });
  f.push({ w: '🧾 ¿Qué es la rendición de cuentas?',
           a: PODERES_RENDICION.texto });
  return f;
})();
let fcIdx=0;
function upFC(){document.getElementById('fcInner').classList.remove('flipped');document.getElementById('fcW').textContent=fcData[fcIdx].w;document.getElementById('fcA').innerHTML=fcData[fcIdx].a;document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length;}
function flipCard(){sfx('flip');document.getElementById('fcInner').classList.toggle('flipped');if(!xpTracker.fc.has(fcIdx)){xpTracker.fc.add(fcIdx);pts(1);}if(xpTracker.fc.size===fcData.length){fin('s-flash');unlockAchievement('flash_master');}}
function nextFC(){sfx('click');fcIdx=(fcIdx+1)%fcData.length;upFC();}
function prevFC(){sfx('click');fcIdx=(fcIdx-1+fcData.length)%fcData.length;upFC();}

// ===================== QUIZ DATA =====================
const qzData=[
  {q:'¿Cuáles son los tres poderes del Estado?',o:['Ejecutivo, Legislativo y Judicial','Presidente, Alcalde y Juez','Nacional, Departamental y Municipal','Civil, Militar y Religioso'],c:0,
   e:'Así los nombra el DCNB: «Conformación de un Estado de Derecho: Poder Ejecutivo, Legislativo y Judicial».'},
  {q:'¿Qué poder HACE las leyes?',o:['El Judicial','El Ejecutivo','El Legislativo','Los tres a la vez'],c:2,
   e:'Lo ejerce el Congreso Nacional, y una ley suya se llama decreto.'},
  {q:'¿Quién ejerce el Poder Ejecutivo?',o:['La Corte Suprema de Justicia','El Presidente de la República','El Congreso Nacional','Los juzgados'],c:1,
   e:'Con las Secretarías de Estado: pone las leyes a funcionar.'},
  {q:'Una ley dice al final «Al Poder Ejecutivo. Por Tanto: Ejecútese». ¿Qué significa?',o:['Que la ley ya se venció','Que el Presidente manda que empiece a cumplirse','Que un juez la revisó','Que el Congreso la va a discutir'],c:1,
   e:'Es exactamente lo que se lee al pie del Estatuto del Docente, firmado en 1997.'},
  {q:'¿Por qué se dice que la Constitución es la ley FUNDAMENTAL?',o:['Porque es la más larga','Porque la escribió el primer presidente','Porque está por encima de todas las demás leyes','Porque es la más antigua'],c:2,
   e:'El Código de la Niñez ordena las normas por rango y la pone en el número 1.'},
  {q:'Dos maestros tienen un pleito por lo que dice el Estatuto del Docente. ¿A quién le toca resolverlo?',o:['Al Congreso Nacional','Al Presidente de la República','A la Secretaría de Educación','A los juzgados y tribunales'],c:3,
   e:'El Legislativo escribe la ley, el Ejecutivo la aplica a todos, y el Judicial la aplica a TU caso.'},
  {q:'¿Por qué los tres poderes están separados, si sería más rápido que mandara uno solo?',o:['Por costumbre, desde la Independencia','Para que cada uno pueda pararle la mano a los otros dos','Porque no caben en el mismo edificio','Para repartir el trabajo entre más gente'],c:1,
   e:'Si el que escribe la ley es el mismo que te juzga, no hay a quién reclamarle.'},
  {q:'¿Qué es la rendición de cuentas?',o:['Un impuesto que se paga cada año','El examen que hacen los diputados','Explicar públicamente qué se hizo con el cargo y con el dinero de todos','Contar los votos de una elección'],c:2,
   e:'Es un contenido del DCNB, y no es un favor: es parte del trabajo de quien sirve al Estado.'},
  {q:'¿Qué es un Estado de Derecho?',o:['Un país que tiene ejército propio','Un país donde manda la ley y no la voluntad de quien tiene el poder','Un país con tres poderes y un rey','Un país que cobra impuestos'],c:1,
   e:'Y la ley vale igual para el que gobierna que para cualquiera.'},
  {q:'El Estatuto del Docente mandó que se hiciera su Reglamento. ¿Quién lo dictó?',o:['La Corte Suprema de Justicia','El Congreso Nacional','Una comisión de maestros','La Secretaría de Educación, que es del Ejecutivo'],c:3,
   e:'Es el Acuerdo 0760-SE-99. Un reglamento dice CÓMO se aplica una ley, y no puede decir más que ella.'}
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
  {label:['Lo hace el Congreso Nacional','Lo hace el Presidente'],headA:'📜 El Congreso',headB:'🏛️ El Presidente',colA:'leg',colB:'eje',
   words:[{w:'Aprobar un decreto',t:'leg'},{w:'Mandar «Ejecútese»',t:'eje'},{w:'Discutir una ley nueva',t:'leg'},{w:'Dictar un reglamento',t:'eje'},{w:'Reunirse en el Salón de Sesiones',t:'leg'},{w:'Dirigir las Secretarías de Estado',t:'eje'},{w:'Ponerle número y año a una ley',t:'leg'},{w:'Poner la ley a funcionar',t:'eje'}]},
  {label:['Es del Poder Judicial','Es de otro poder'],headA:'⚖️ Del Judicial',headB:'🚫 De otro poder',colA:'jud',colB:'otro',
   words:[{w:'La Corte Suprema de Justicia',t:'jud'},{w:'Los juzgados y tribunales',t:'jud'},{w:'La jurisprudencia',t:'jud'},{w:'Decidir quién tiene razón en un pleito',t:'jud'},{w:'El Congreso Nacional',t:'otro'},{w:'Dictar un acuerdo',t:'otro'},{w:'Aprobar un decreto',t:'otro'},{w:'Las Secretarías de Estado',t:'otro'}]},
  {label:['Un decreto','Un acuerdo'],headA:'📜 Decreto',headB:'📋 Acuerdo',colA:'dec',colB:'acu',
   words:[{w:'El Estatuto del Docente, 136-97',t:'dec'},{w:'El Reglamento del Estatuto, 0760-SE-99',t:'acu'},{w:'El Código de la Niñez, 73-96',t:'dec'},{w:'Lo dicta una Secretaría de Estado',t:'acu'},{w:'Lo aprueba el Congreso Nacional',t:'dec'},{w:'Dice CÓMO se aplica una ley',t:'acu'},{w:'Nace en el Salón de Sesiones',t:'dec'},{w:'No puede decir más que la ley',t:'acu'}]}
];
let currentClassGroupIdx=0,clsSelectedWord=null;
function buildClass(){const group=classGroups[currentClassGroupIdx];document.getElementById('col-left-head').textContent=group.headA;document.getElementById('col-right-head').textContent=group.headB;const bank=document.getElementById('clsBank');bank.innerHTML='';clsSelectedWord=null;document.getElementById('items-left').innerHTML='';document.getElementById('items-right').innerHTML='';_shuffle([...group.words]).forEach(w=>{const el=document.createElement('div');el.className='wb-item';el.textContent=w.w;el.dataset.t=w.t;el.onclick=()=>{document.querySelectorAll('.wb-item').forEach(i=>i.classList.remove('sel-word'));el.classList.add('sel-word');clsSelectedWord=el;sfx('click');};bank.appendChild(el);});['col-left','col-right'].forEach(colId=>{const col=document.getElementById(colId);col.onclick=(e)=>{if(!clsSelectedWord||e.target.classList.contains('drop-item'))return;const targetId=colId==='col-left'?'items-left':'items-right';const wordsCol=document.getElementById(targetId);const item=document.createElement('div');item.className='drop-item';item.textContent=clsSelectedWord.textContent;item.dataset.t=clsSelectedWord.dataset.t;const original=clsSelectedWord;item.onclick=(ev)=>{ev.stopPropagation();if(clsSelectedWord!==null){col.click();}else{document.getElementById('clsBank').appendChild(original);original.classList.remove('sel-word');item.remove();if(typeof sfx==='function')sfx('click');}};wordsCol.appendChild(item);clsSelectedWord.remove();clsSelectedWord=null;sfx('click');};});}
function checkClass(){const remaining=document.querySelectorAll('#clsBank .wb-item').length;if(remaining>0){fb('fbCls','Mueve todas las palabras a las columnas primero.',false);return;}const group=classGroups[currentClassGroupIdx];let allOk=true;document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{const inLeft=el.parentElement.id==='items-left';const expectedType=inLeft?group.colA:group.colB;if(el.dataset.t===expectedType){el.classList.add('cls-ok');}else{el.classList.add('cls-no');allOk=false;}});if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);}if(allOk){fb('fbCls','¡Perfecto! +5 XP',true);sfx('fan');fin('s-clasifica');unlockAchievement('clasif_pro');}else{fb('fbCls','Hay errores. Marcados en rojo.',false);sfx('no');}}
function nextClassGroup(){sfx('click');currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length;buildClass();document.getElementById('fbCls').classList.remove('show');showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]);}
function resetClass(){sfx('click');buildClass();document.getElementById('fbCls').classList.remove('show');}

// ===================== IDENTIFICAR =====================
const idData=[
  {s:['El','Congreso','Nacional','HACE','las','leyes','del','país.'],c:1,art:'El nombre del órgano que ejerce el Poder Legislativo'},
  {s:['El','Poder','Ejecutivo','CUMPLE','y','hace','cumplir','las','leyes.'],c:3,art:'El verbo que dice qué hace el Poder Ejecutivo'},
  {s:['La','Corte','Suprema','de','Justicia','encabeza','el','Poder','Judicial.'],c:8,art:'El poder que aplica la ley a cada caso'},
  {s:['La','Constitución','es','la','ley','fundamental','de','Honduras.'],c:1,art:'La ley que está por encima de todas las demás'},
  {s:['Una','ley','que','aprueba','el','Congreso','se','llama','decreto.'],c:8,art:'El nombre que recibe una ley del Congreso'},
  {s:['El','reglamento','de','una','ley','se','dicta','por','acuerdo.'],c:8,art:'El nombre de la norma con que el Ejecutivo reglamenta'},
  {s:['En','un','Estado','de','Derecho','manda','la','ley.'],c:7,art:'Lo que manda cuando hay Estado de Derecho'},
  {s:['Los','servidores','públicos','deben','rendir','cuentas','a','la','ciudadanía.'],c:5,art:'Lo que un funcionario le debe a la gente'}
];
let idIdx=0,idDone=false;
function showId(){idDone=false;if(idIdx>=idData.length){document.getElementById('idSent').innerHTML='🎉 ¡Completado!';fin('s-identifica');unlockAchievement('id_master');return;}const d=idData[idIdx];document.getElementById('idProg').textContent=`Oración ${idIdx+1} de ${idData.length}`;document.getElementById('idInfo').textContent=`Busca: ${d.art}`;const sent=document.getElementById('idSent');sent.innerHTML='';d.s.forEach((w,i)=>{const span=document.createElement('span');span.className='id-word';span.textContent=w+' ';span.onclick=()=>checkId(i,span);sent.appendChild(span);});}
function checkId(i,span){if(idDone)return;document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected'));span.classList.add('selected');if(i===idData[idIdx].c){idDone=true;span.classList.add('id-ok');fb('fbId','¡Correcto! +5 XP',true);if(!xpTracker.id.has(idIdx)){xpTracker.id.add(idIdx);pts(5);}sfx('ok');}else{span.classList.add('id-no');fb('fbId','Ese no es el término solicitado.',false);sfx('no');}}
function nextId(){sfx('click');idIdx++;showId();document.getElementById('fbId').classList.remove('show');}
function resetId(){sfx('click');idIdx=0;showId();document.getElementById('fbId').classList.remove('show');}

// ===================== COMPLETA =====================
const cmpData=[
  {s:'El Poder Legislativo lo ejerce el ___ Nacional.',opts:['Consejo','Congreso','Comité'],c:1},
  {s:'El Poder Ejecutivo lo encabeza el ___ de la República.',opts:['Presidente','Diputado','Magistrado'],c:0},
  {s:'El Poder Judicial lo encabeza la ___ Suprema de Justicia.',opts:['Sala','Junta','Corte'],c:2},
  {s:'La ley que está por encima de todas las demás es la ___.',opts:['Gaceta','Constitución','Ordenanza'],c:1},
  {s:'Una ley aprobada por el Congreso se llama ___.',opts:['acuerdo','circular','decreto'],c:2},
  {s:'La norma con que una Secretaría reglamenta una ley se llama ___.',opts:['acuerdo','decreto','sentencia'],c:0},
  {s:'Cuando manda la ley y no la voluntad de quien gobierna, hay Estado de ___.',opts:['Sitio','Derecho','Cuentas'],c:1},
  {s:'Explicar en qué se gastó el dinero de todos se llama rendición de ___.',opts:['cuentas','leyes','votos'],c:0}
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
  { label: 'Ordena el recorrido de una ley', steps: PODERES_RECORRIDO.pasos.map(x => x.titulo) },
  { label: 'Ordena la jerarquía: de arriba abajo', steps: PODERES_JERARQUIA.escalones.slice(0, 5) }
];
let currentRouteIdx=0,routeItems=[];
function buildRoute(){routeItems=_shuffle([...routeSets[currentRouteIdx].steps]);renderRoute();const fbEl=document.getElementById('fbRoute');if(fbEl)fbEl.classList.remove('show');}
function renderRoute(){const list=document.getElementById('routeList');if(!list)return;list.innerHTML='';routeItems.forEach((step,i)=>{const div=document.createElement('div');div.className='sort-item';div.innerHTML=`<div class="sort-arrows"><button class="sort-arrow" onclick="routeMove(${i},-1)"${i===0?' disabled':''}>▲</button><button class="sort-arrow" onclick="routeMove(${i},1)"${i===routeItems.length-1?' disabled':''}>▼</button></div><div class="sort-step-num">${i+1}.</div><div class="sort-item-txt">${step}</div>`;list.appendChild(div);});}
function routeMove(idx,dir){sfx('click');const ni=idx+dir;if(ni<0||ni>=routeItems.length)return;[routeItems[idx],routeItems[ni]]=[routeItems[ni],routeItems[idx]];renderRoute();}
function checkRoute(){const correct=routeSets[currentRouteIdx].steps;const isOk=routeItems.every((s,i)=>s===correct[i]);if(isOk){fb('fbRoute','¡Perfecto! Orden correcto. +4 XP',true);if(!xpTracker.wgt.has('route_'+currentRouteIdx)){xpTracker.wgt.add('route_'+currentRouteIdx);pts(4);}sfx('fan');fin('s-widgets');unlockAchievement('widgets_master');}else{fb('fbRoute','Hay pasos fuera de orden. Revisa el arreglo.',false);sfx('no');}}
function nextRoute(){sfx('click');currentRouteIdx=(currentRouteIdx+1)%routeSets.length;buildRoute();showToast('🔄 Secuencia: '+routeSets[currentRouteIdx].label);}

// Widget 2: Identifica el concepto
const neuronPartes = (function () {
  const nombres = PODERES.map(p => p.nombre);
  const pistas = [];
  PODERES.forEach(p => {
    pistas.push({ desc: p.verbo + '. ' + p.quien + '.', ans: p.nombre, opts: nombres.slice() });
    pistas.push({ desc: p.pista, ans: p.nombre, opts: nombres.slice() });
  });
  return pistas;
})();
let neuronIdx=0,neuronDone=false;
function showNeuron(){neuronDone=false;if(neuronIdx>=neuronPartes.length){const el=document.getElementById('neuronDesc');if(el)el.textContent='🎉 ¡Ya reconoces a cada uno por lo que hizo!';const opts=document.getElementById('neuronOpts');if(opts)opts.innerHTML='';fin('s-widgets');return;}const d=neuronPartes[neuronIdx];const prog=document.getElementById('neuronProg');if(prog)prog.textContent=`Pista ${neuronIdx+1} de ${neuronPartes.length}`;const desc=document.getElementById('neuronDesc');if(desc)desc.textContent=d.desc;const opts=document.getElementById('neuronOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=opt;b.onclick=()=>checkNeuron(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuron');if(fbEl)fbEl.classList.remove('show');}
function checkNeuron(opt,btn,d){if(neuronDone)return;neuronDone=true;document.querySelectorAll('#neuronOpts .cmp-opt').forEach(b=>{if(b.textContent===d.ans)b.classList.add('correct');else if(b===btn&&b.textContent!==d.ans)b.classList.add('wrong');});const isOk=opt===d.ans;if(isOk){fb('fbNeuron','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuron_'+neuronIdx)){xpTracker.wgt.add('neuron_'+neuronIdx);pts(3);}sfx('ok');}else{fb('fbNeuron','La respuesta correcta es: '+d.ans,false);sfx('no');}}
function nextNeuron(){sfx('click');neuronIdx++;showNeuron();}
function resetNeuron(){sfx('click');neuronIdx=0;showNeuron();}

// Widget 3: Concepto → Significado
const neuroPairs = (function () {
  const nombres = PODERES.map(p => p.nombre);
  return PODERES.map(p => ({ trans: '«' + p.verbo + '»', func: p.nombre, opts: nombres.slice() }));
})();
let neuroIdx=0,neuroDone=false;
function showNeuro(){neuroDone=false;if(neuroIdx>=neuroPairs.length){const el=document.getElementById('neuroTrans');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('neuroOpts');if(opts)opts.innerHTML='';return;}const d=neuroPairs[neuroIdx];const prog=document.getElementById('neuroProg');if(prog)prog.textContent=`${neuroIdx+1} de ${neuroPairs.length}`;const trans=document.getElementById('neuroTrans');if(trans)trans.textContent=d.trans;const opts=document.getElementById('neuroOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkNeuro(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuro');if(fbEl)fbEl.classList.remove('show');}
function checkNeuro(opt,btn,d){if(neuroDone)return;neuroDone=true;document.querySelectorAll('#neuroOpts .qz-opt').forEach(b=>{if(b.textContent===d.func)b.classList.add('correct');else if(b===btn&&b.textContent!==d.func)b.classList.add('wrong');});const isOk=opt===d.func;if(isOk){fb('fbNeuro','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuro_'+neuroIdx)){xpTracker.wgt.add('neuro_'+neuroIdx);pts(3);}sfx('ok');}else{fb('fbNeuro','Correcto: '+d.func,false);sfx('no');}setTimeout(()=>{neuroIdx++;showNeuro();},1800);}
function resetNeuro(){sfx('click');neuroIdx=0;showNeuro();}

// Widget 4: Fuente → ¿Renovable o no renovable?
const enfermedadData=[
  {disease:'Aprobar una ley nueva',characteristic:'Poder Legislativo',opts:['Poder Legislativo','Poder Ejecutivo','Poder Judicial']},
  {disease:'Mandar que una ley empiece a cumplirse',characteristic:'Poder Ejecutivo',opts:['Poder Legislativo','Poder Ejecutivo','Poder Judicial']},
  {disease:'Resolver un pleito entre dos personas',characteristic:'Poder Judicial',opts:['Poder Legislativo','Poder Ejecutivo','Poder Judicial']},
  {disease:'Dictar el reglamento de una ley',characteristic:'Poder Ejecutivo',opts:['Poder Legislativo','Poder Ejecutivo','Poder Judicial']},
  {disease:'Decidir si alguien incumplió la ley',characteristic:'Poder Judicial',opts:['Poder Legislativo','Poder Ejecutivo','Poder Judicial']},
  {disease:'Discutir el presupuesto en el Salón de Sesiones',characteristic:'Poder Legislativo',opts:['Poder Legislativo','Poder Ejecutivo','Poder Judicial']},
  {disease:'Dirigir la Secretaría de Educación',characteristic:'Poder Ejecutivo',opts:['Poder Legislativo','Poder Ejecutivo','Poder Judicial']},
  {disease:'Establecer jurisprudencia',characteristic:'Poder Judicial',opts:['Poder Legislativo','Poder Ejecutivo','Poder Judicial']},
  {disease:'Ponerle número y año a un decreto',characteristic:'Poder Legislativo',opts:['Poder Legislativo','Poder Ejecutivo','Poder Judicial']}
];
let enferIdx=0,enferDone=false;
function showEnfer(){enferDone=false;if(enferIdx>=enfermedadData.length){const el=document.getElementById('enferDisease');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('enferOpts');if(opts)opts.innerHTML='';return;}const d=enfermedadData[enferIdx];const prog=document.getElementById('enferProg');if(prog)prog.textContent=`${enferIdx+1} de ${enfermedadData.length}`;const dis=document.getElementById('enferDisease');if(dis)dis.textContent=d.disease;const opts=document.getElementById('enferOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkEnfer(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbEnfer');if(fbEl)fbEl.classList.remove('show');}
function checkEnfer(opt,btn,d){if(enferDone)return;enferDone=true;document.querySelectorAll('#enferOpts .qz-opt').forEach(b=>{if(b.textContent===d.characteristic)b.classList.add('correct');else if(b===btn&&b.textContent!==d.characteristic)b.classList.add('wrong');});const isOk=opt===d.characteristic;if(isOk){fb('fbEnfer','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('enfer_'+enferIdx)){xpTracker.wgt.add('enfer_'+enferIdx);pts(3);}sfx('ok');}else{fb('fbEnfer','Correcto: '+d.characteristic,false);sfx('no');}setTimeout(()=>{enferIdx++;showEnfer();},1800);}
function resetEnfer(){sfx('click');enferIdx=0;showEnfer();}

// ===================== RETO FINAL =====================
const retoPairs=[
  {label:['Lo hace el Congreso Nacional','Lo hace el Presidente'],btnA:'📜 El Congreso',btnB:'🏛️ El Presidente',colA:'leg',colB:'eje',
   words:[{w:'Aprobar un decreto',t:'leg'},{w:'Mandar «Ejecútese»',t:'eje'},{w:'Discutir una ley nueva',t:'leg'},{w:'Dictar un reglamento',t:'eje'},{w:'Reunirse en el Salón de Sesiones',t:'leg'},{w:'Dirigir las Secretarías de Estado',t:'eje'},{w:'Ponerle número y año a una ley',t:'leg'},{w:'Poner la ley a funcionar',t:'eje'},{w:'Los diputados',t:'leg'},{w:'Los ministros',t:'eje'}]},
  {label:['Es del Poder Judicial','Es de otro poder'],btnA:'⚖️ Del Judicial',btnB:'🚫 De otro poder',colA:'jud',colB:'otro',
   words:[{w:'La Corte Suprema de Justicia',t:'jud'},{w:'Los juzgados y tribunales',t:'jud'},{w:'La jurisprudencia',t:'jud'},{w:'Decidir quién tiene razón en un pleito',t:'jud'},{w:'El Congreso Nacional',t:'otro'},{w:'Dictar un acuerdo',t:'otro'},{w:'Aprobar un decreto',t:'otro'},{w:'Las Secretarías de Estado',t:'otro'},{w:'Dictar una sentencia',t:'jud'},{w:'Mandar «Ejecútese»',t:'otro'}]},
  {label:['Un decreto','Un acuerdo'],btnA:'📜 Decreto',btnB:'📋 Acuerdo',colA:'dec',colB:'acu',
   words:[{w:'El Estatuto del Docente, 136-97',t:'dec'},{w:'El Reglamento del Estatuto, 0760-SE-99',t:'acu'},{w:'El Código de la Niñez, 73-96',t:'dec'},{w:'Lo dicta una Secretaría de Estado',t:'acu'},{w:'Lo aprueba el Congreso Nacional',t:'dec'},{w:'Dice CÓMO se aplica una ley',t:'acu'},{w:'Nace en el Salón de Sesiones',t:'dec'},{w:'No puede decir más que la ley',t:'acu'}]}
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
  {s:'El Congreso Nacional aprueba las leyes del país.',type:'Congreso Nacional'},
  {s:'El Presidente de la República manda que las leyes se cumplan.',type:'Presidente de la República'},
  {s:'La Corte Suprema de Justicia encabeza el Poder Judicial.',type:'Corte Suprema de Justicia'},
  {s:'La Constitución es la ley fundamental de Honduras.',type:'Constitución'},
  {s:'Una ley aprobada por el Congreso se llama decreto.',type:'decreto'},
  {s:'Una Secretaría de Estado reglamenta una ley por acuerdo.',type:'acuerdo'},
  {s:'En un Estado de Derecho manda la ley y no quien gobierna.',type:'Estado de Derecho'},
  {s:'Los funcionarios rinden cuentas a la ciudadanía.',type:'rinden cuentas'},
  {s:'Una ley entra en vigencia al publicarse en La Gaceta.',type:'La Gaceta'},
  {s:'La jurisprudencia la establece la Corte Suprema de Justicia.',type:'jurisprudencia'}
];
const classifyTaskDB=[
  {w:'Poder Legislativo',gen:'Hace las leyes',n:'El Congreso Nacional',g:'Un decreto',t:'Se reúne en su Salón de Sesiones'},
  {w:'Poder Ejecutivo',gen:'Cumple y hace cumplir las leyes',n:'El Presidente y las Secretarías',g:'Un acuerdo',t:'Firma «Por Tanto: Ejecútese»'},
  {w:'Poder Judicial',gen:'Aplica la ley a cada caso',n:'La Corte Suprema y los tribunales',g:'Una sentencia',t:'Lo que resuelve una y otra vez es jurisprudencia'},
  {w:'Constitución',gen:'Es la ley fundamental',n:'Está por encima de todas',g:'Dice cómo se organiza el Estado',t:'Ninguna ley puede contradecirla'},
  {w:'Decreto',gen:'Una ley del Congreso',n:'Lleva su número y su año',g:'Ejemplo: el 136-97',t:'Nace en el Salón de Sesiones'},
  {w:'Acuerdo',gen:'La norma con que se reglamenta una ley',n:'La dicta una Secretaría',g:'Ejemplo: el 0760-SE-99',t:'No puede decir más que la ley'},
  {w:'Estado de Derecho',gen:'Manda la ley, no la voluntad de quien gobierna',n:'La ley vale igual para todos',g:'Incluye al que gobierna',t:'Es lo que hace posible reclamar'}
];
const completeTaskDB=[
  {s:'Los tres poderes del Estado son el Ejecutivo, el Legislativo y el ___.',ans:'Judicial'},
  {s:'El Poder Legislativo lo ejerce el ___ Nacional.',ans:'Congreso'},
  {s:'El Poder Ejecutivo lo encabeza el ___ de la República.',ans:'Presidente'},
  {s:'El Poder Judicial lo encabeza la ___ Suprema de Justicia.',ans:'Corte'},
  {s:'La ley que está por encima de todas las demás es la ___.',ans:'Constitución'},
  {s:'Una ley aprobada por el Congreso se llama ___.',ans:'decreto'},
  {s:'La norma con que una Secretaría reglamenta una ley se llama ___.',ans:'acuerdo'},
  {s:'Cuando manda la ley y no quien gobierna, hay Estado de ___.',ans:'Derecho'},
  {s:'Una ley entra en vigencia al publicarse en el Diario Oficial La ___.',ans:'Gaceta'}
];
const explainQuestions=[
  {q:'¿Cuáles son los tres poderes del Estado y qué hace cada uno?',ans:'El Legislativo HACE las leyes y lo ejerce el Congreso Nacional. El Ejecutivo las CUMPLE y hace cumplir, y lo encabeza el Presidente de la República con las Secretarías de Estado. El Judicial las APLICA a cada caso, y lo encabeza la Corte Suprema de Justicia con los juzgados y tribunales.'},
  {q:'¿Por qué se dice que la Constitución es la ley fundamental?',ans:'Porque está por encima de todas las demás: cuando dos normas dicen cosas distintas, manda la que está más arriba. El Código de la Niñez ordena las normas por rango y pone la Constitución en el número 1, antes que los tratados, que el propio Código y que cualquier otra ley.'},
  {q:'Explica por qué los tres poderes están separados, si sería más rápido que mandara uno solo.',ans:'Sería más rápido, y por eso mismo no se hace. Si el que escribe la ley es el mismo que decide si la rompiste y el que te castiga, no hay a quién reclamarle. Separarlos es más lento a propósito, porque cada poder puede pararle la mano a los otros dos.'},
  {q:'Sigue el recorrido de una ley por los tres poderes, con un ejemplo de verdad.',ans:'El Estatuto del Docente: el Congreso Nacional lo aprobó como Decreto 136-97 el 11 de septiembre de 1997; el Presidente firmó «Al Poder Ejecutivo. Por Tanto: Ejecútese» el 29 de septiembre; entró en vigencia al publicarse en La Gaceta; la Secretaría de Educación dictó su Reglamento por Acuerdo 0760-SE-99; y si hay pleito, lo resuelven los tribunales.'},
  {q:'¿Qué diferencia hay entre un decreto y un acuerdo?',ans:'El decreto es una ley y lo aprueba el Congreso Nacional. El acuerdo lo dicta el Ejecutivo —una Secretaría de Estado— para decir CÓMO se aplica esa ley. Por eso un acuerdo nunca puede decir más de lo que dice su ley: si lo hiciera, el Ejecutivo estaría legislando, que no es lo suyo.'},
  {q:'¿Qué es la rendición de cuentas y por qué te toca a ti?',ans:'Es que quien trabaja para el Estado explique en qué gastó el dinero de todos y qué hizo con el cargo. Me toca porque ese dinero es de todos, incluida mi familia, y porque cualquier ciudadano puede preguntarlo. Pasa igual y en pequeño en mi centro, con la merienda escolar y los fondos del comité de padres.'},
  {q:'¿Qué es un Estado de Derecho y cómo se nota que existe?',ans:'Es cuando manda la ley y no la voluntad de quien tiene el poder, y la ley vale igual para el que gobierna que para cualquiera. Se nota en que una persona común puede reclamar ante un juez y ganarle a una autoridad, y en que nadie está por encima de la ley.'},
  {q:'Un reglamento dice algo que su ley no dice. ¿Qué pasa y por qué?',ans:'No vale. El reglamento sirve para explicar cómo se aplica la ley, no para agregarle cosas. Si el Ejecutivo pudiera añadir por reglamento lo que quisiera, estaría haciendo leyes sin pasar por el Congreso, y la separación de poderes se caería.'},
  {q:'Averigua quiénes sustentan hoy cada uno de los tres poderes y compáralo con lo que dice la Constitución.',ans:'Respuesta abierta y de investigación, tal como la pide el DCNB. Se valora que el alumno nombre el órgano de cada poder, busque el dato en la Constitución o en su libro de Ciencias Sociales, y diga en qué se parece o se diferencia de lo que ve en la realidad.'}
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
  {size:10,grid:[
    ['N','A','Y','I','R','T','Q','E','D','X'],
    ['D','I','Z','I','Y','W','L','C','E','X'],
    ['F','C','S','D','C','O','Z','L','C','C'],
    ['B','I','P','B','V','G','I','E','R','O'],
    ['D','T','O','I','X','V','C','Y','E','N'],
    ['B','S','D','S','N','W','O','E','T','G'],
    ['E','U','E','C','O','J','R','S','O','R'],
    ['X','J','R','C','G','M','T','K','Q','E'],
    ['E','Q','E','V','I','V','E','U','L','S'],
    ['B','Q','S','L','S','B','D','R','B','O']
  ],words:[
    {w:'CONGRESO',cells:[[2,9],[3,9],[4,9],[5,9],[6,9],[7,9],[8,9],[9,9]]},
    {w:'JUSTICIA',cells:[[7,1],[6,1],[5,1],[4,1],[3,1],[2,1],[1,1],[0,1]]},
    {w:'DECRETO',cells:[[0,8],[1,8],[2,8],[3,8],[4,8],[5,8],[6,8]]},
    {w:'PODERES',cells:[[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2]]},
    {w:'CORTE',cells:[[4,6],[5,6],[6,6],[7,6],[8,6]]},
    {w:'LEYES',cells:[[2,7],[3,7],[4,7],[5,7],[6,7]]}
  ]},
  {size:10,grid:[
    ['O','D','R','E','U','C','A','L','W','J'],
    ['J','O','Z','H','Q','J','O','T','K','S'],
    ['U','V','N','F','K','G','D','J','E','Y'],
    ['E','I','V','S','D','A','A','T','Q','O'],
    ['Z','T','Q','J','R','C','T','O','C','H'],
    ['N','U','E','W','M','E','S','D','P','C'],
    ['D','C','N','G','R','T','E','Q','R','E'],
    ['B','E','D','N','Z','A','N','K','D','R'],
    ['O','J','L','T','L','J','K','A','K','E'],
    ['Q','E','P','V','W','N','R','I','S','D']
  ],words:[
    {w:'EJECUTIVO',cells:[[9,1],[8,1],[7,1],[6,1],[5,1],[4,1],[3,1],[2,1],[1,1]]},
    {w:'ACUERDO',cells:[[0,6],[0,5],[0,4],[0,3],[0,2],[0,1],[0,0]]},
    {w:'DERECHO',cells:[[9,9],[8,9],[7,9],[6,9],[5,9],[4,9],[3,9]]},
    {w:'GACETA',cells:[[2,5],[3,5],[4,5],[5,5],[6,5],[7,5]]},
    {w:'ESTADO',cells:[[6,6],[5,6],[4,6],[3,6],[2,6],[1,6]]},
    {w:'JUEZ',cells:[[1,0],[2,0],[3,0],[4,0]]}
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
  {q:'Los tres poderes del Estado son el Ejecutivo, el Legislativo y el Judicial.',a:true},
  {q:'El Poder Legislativo lo ejerce la Corte Suprema de Justicia.',a:false},
  {q:'Una ley aprobada por el Congreso Nacional se llama decreto.',a:true},
  {q:'La Constitución de la República está por encima de todas las demás leyes.',a:true},
  {q:'Un reglamento puede decir más cosas que la ley que reglamenta.',a:false},
  {q:'«Al Poder Ejecutivo. Por Tanto: Ejecútese» lo firma el Presidente de la República.',a:true},
  {q:'El Poder Judicial es el que aprueba las leyes.',a:false},
  {q:'La jurisprudencia la establece la Corte Suprema de Justicia.',a:true},
  {q:'En un Estado de Derecho manda la voluntad de quien tiene el poder.',a:false},
  {q:'La rendición de cuentas es un favor que hace el funcionario, no una obligación.',a:false},
  {q:'El Estatuto del Docente es el Decreto 136-97, aprobado por el Congreso Nacional.',a:true},
  {q:'El Reglamento del Estatuto del Docente lo dictó la Secretaría de Educación.',a:true},
  {q:'Los tres poderes están separados para que el trabajo salga más rápido.',a:false},
  {q:'Una ley entra en vigencia cuando se publica en el Diario Oficial La Gaceta.',a:true},
  {q:'Si dos normas dicen cosas distintas, manda siempre la más nueva.',a:false},
  {q:'El Presidente de la República encabeza el Poder Ejecutivo.',a:true},
  {q:'Los juzgados y tribunales forman parte del Poder Judicial.',a:true},
  {q:'El Congreso Nacional se reúne en su Salón de Sesiones.',a:true},
  {q:'En un Estado de Derecho la ley no se le aplica a quien gobierna.',a:false},
  {q:'La Constitución dice cómo se organiza el Estado y qué derechos tiene cada persona.',a:true}
];
const evalMCBank=[
  {q:'¿Cuáles son los tres poderes del Estado?',o:['Civil, militar y religioso','Nacional, departamental y municipal','Ejecutivo, Legislativo y Judicial','Presidente, alcalde y juez'],a:2},
  {q:'¿Quién ejerce el Poder Legislativo?',o:['El Congreso Nacional','El Presidente de la República','La Corte Suprema','Las Secretarías de Estado'],a:0},
  {q:'¿Qué hace el Poder Judicial?',o:['Escribe las leyes','Cobra los impuestos','Nombra al Presidente','Aplica la ley a cada caso'],a:3},
  {q:'¿Cómo se llama una ley aprobada por el Congreso Nacional?',o:['Acuerdo','Decreto','Sentencia','Circular'],a:1},
  {q:'¿Por qué la Constitución es la ley fundamental?',o:['Porque es la más larga','Porque es la más antigua','Porque está por encima de las demás','Porque la firma el Presidente'],a:2},
  {q:'¿Qué significa «Por Tanto: Ejecútese» al pie de una ley?',o:['Que el Presidente manda cumplirla','Que ya se venció','Que un juez la anuló','Que falta discutirla'],a:0},
  {q:'¿Quién dicta el reglamento de una ley?',o:['La Corte Suprema','El Congreso Nacional','Los diputados','El Ejecutivo, por medio de una Secretaría'],a:3},
  {q:'¿Qué es un Estado de Derecho?',o:['Un país con ejército propio','Aquel donde manda la ley y no la voluntad del que gobierna','Un país que cobra impuestos','Un país con tres poderes y un rey'],a:1},
  {q:'¿Para qué sirve que los tres poderes estén separados?',o:['Para repartir el trabajo','Para gastar menos','Para que cada uno pueda pararle la mano a los otros','Por costumbre desde la Independencia'],a:2},
  {q:'¿Qué es la rendición de cuentas?',o:['Explicar qué se hizo con el cargo y con el dinero de todos','Un impuesto anual','El conteo de votos','Un examen para los diputados'],a:0},
  {q:'Un maestro cree que no le respetaron lo que dice el Estatuto. ¿A dónde acude?',o:['Al Congreso Nacional','A la Presidencia','A los juzgados y tribunales','Al Diario Oficial'],a:2},
  {q:'¿Cuándo entra en vigencia una ley?',o:['Cuando la firma el Presidente','Al publicarse en el Diario Oficial La Gaceta','Cuando la aprueba el Congreso','Cuando la Corte la revisa'],a:1},
  {q:'Si un reglamento dice más de lo que dice su ley, ¿qué pasa?',o:['Manda el reglamento, que es más nuevo','No puede: el reglamento no puede pasarse de la ley','Deciden los diputados','Manda el que firme primero'],a:1},
  {q:'¿Qué es la jurisprudencia?',o:['El reglamento de una ley','Un decreto del Congreso','Lo que la Corte Suprema resuelve una y otra vez','El texto de la Constitución'],a:2},
  {q:'¿Qué documento ordena las normas por rango y pone la Constitución de primera?',o:['El Estatuto del Docente','El Código de la Niñez y la Adolescencia','El Reglamento del Estatuto','El Diario Oficial'],a:1}
];
const evalCPBank=[
  {q:'Los tres poderes del Estado son el Ejecutivo, el Legislativo y el ___.',a:'Judicial'},
  {q:'El Poder Legislativo lo ejerce el ___ Nacional.',a:'Congreso'},
  {q:'El Poder Ejecutivo lo encabeza el ___ de la República.',a:'Presidente'},
  {q:'El Poder Judicial lo encabeza la ___ Suprema de Justicia.',a:'Corte'},
  {q:'La ley que está por encima de todas las demás es la ___.',a:'Constitución'},
  {q:'Una ley aprobada por el Congreso se llama ___.',a:'decreto'},
  {q:'La norma con que una Secretaría reglamenta una ley se llama ___.',a:'acuerdo'},
  {q:'Cuando manda la ley y no quien gobierna, hay Estado de ___.',a:'Derecho'},
  {q:'Explicar en qué se gastó el dinero de todos es la rendición de ___.',a:'cuentas'},
  {q:'Una ley entra en vigencia al publicarse en el Diario Oficial La ___.',a:'Gaceta'},
  {q:'Lo que la Corte Suprema resuelve una y otra vez se llama ___.',a:'jurisprudencia'},
  {q:'El Estatuto del Docente es el Decreto ___.',a:'136-97'},
  {q:'El Congreso Nacional se reúne en su ___ de Sesiones.',a:'Salón'},
  {q:'Los ___ y tribunales forman parte del Poder Judicial.',a:'juzgados'},
  {q:'El reglamento no puede decir ___ que la ley que reglamenta.',a:'más'}
];
const evalPRBank=[
  {term:'Poder Legislativo',def:'Hace las leyes. Lo ejerce el Congreso Nacional'},
  {term:'Poder Ejecutivo',def:'Cumple y hace cumplir las leyes. Lo encabeza el Presidente'},
  {term:'Poder Judicial',def:'Aplica la ley a cada caso. Lo encabeza la Corte Suprema de Justicia'},
  {term:'Constitución',def:'La ley fundamental: está por encima de todas las demás'},
  {term:'Decreto',def:'El nombre de una ley aprobada por el Congreso Nacional'},
  {term:'Acuerdo',def:'La norma con que el Ejecutivo reglamenta una ley'},
  {term:'Jurisprudencia',def:'Lo que la Corte Suprema resuelve una y otra vez'},
  {term:'Estado de Derecho',def:'Donde manda la ley y no la voluntad de quien gobierna'},
  {term:'Rendición de cuentas',def:'Explicar públicamente qué se hizo con el cargo y con el dinero de todos'},
  {term:'La Gaceta',def:'El Diario Oficial: al publicarse ahí, una ley entra en vigencia'},
  {term:'Salón de Sesiones',def:'Donde se reúne el Congreso Nacional a aprobar las leyes'},
  {term:'Ejecútese',def:'La palabra con que el Presidente manda que una ley empiece a cumplirse'},
  {term:'Reglamento',def:'Dice CÓMO se aplica una ley, y no puede decir más que ella'},
  {term:'Secretaría de Estado',def:'Parte del Ejecutivo: dicta acuerdos y aplica las leyes de su ramo'},
  {term:'Deberes',def:'Lo que a cada persona le toca cumplir para que la convivencia funcione'}
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

function genEval(){sfx('click');_evalFormaSelector(); const _selF = document.getElementById('evalFormaSel'); if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10))); const cf = evalFormNum; const rng = _evalRng(cf); window._currentEvalForm=cf;evalFormNum = (evalFormNum % EVAL_FORMAS) + 1; _evalFormaSelector();saveProgress();document.getElementById('eval-screen-title').textContent=`🎓 Evaluación Final · Forma ${cf} · Los Tres Poderes del Estado`;evalAnsVisible=false;const out=document.getElementById('evalOut');out.innerHTML='';const bar=document.createElement('div');bar.className='eval-score-bar';bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje · 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25 pts</span><span class="eval-score-pill esp-tf">V/F 25 pts</span><span class="eval-score-pill esp-mc">Selección 25 pts</span><span class="eval-score-pill esp-pr">Pareados 25 pts</span></div>`;out.appendChild(bar);const cpItems=_pickF(evalCPBank,5, rng);const s1=document.createElement('div');s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';cpItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='cp';d.dataset.evalIndex=i;const qHtml=item.q.replace('___',`<input class="eval-cp-input" type="text" data-cp="${i}" autocomplete="off">`);d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbCp${i}" aria-live="polite"></div>`;s1.appendChild(d);});out.appendChild(s1);const tfItems=_pickF(evalTFBank,5, rng);const s2=document.createElement('div');s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';tfItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='tf';d.dataset.evalIndex=i;d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="true"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="false"> Falso</label></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbTf${i}" aria-live="polite"></div>`;s2.appendChild(d);});out.appendChild(s2);const mcItems=_pickF(evalMCBank,5, rng);const s3=document.createElement('div');s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';mcItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='mc';d.dataset.evalIndex=i;const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join('');d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbMc${i}" aria-live="polite"></div>`;s3.appendChild(d);});out.appendChild(s3);const prItems=_pickF(evalPRBank,5, rng);const shuffledDefs=_shuffleF(prItems, rng);const letters=['A','B','C','D','E'];const s4=document.createElement('div');s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';const matchCard=document.createElement('div');matchCard.className='eval-item';let colLeft='<div class="eval-match-col"><h4>📌 Términos</h4>';prItems.forEach((item,i)=>{colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> <select class="eval-match-select" data-pr="${i}" aria-label="Respuesta pareada ${i+16}"><option value="">—</option>${letters.map(l=>`<option value="${l}">${l}</option>`).join('')}</select> ${item.term}</div>`;});colLeft+='</div>';let colRight='<div class="eval-match-col"><h4>🔑 Definiciones</h4>';shuffledDefs.forEach((item,i)=>{colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`;});colRight+='</div>';const ansKey=prItems.map((item,i)=>{const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)];return`${i+16}→${letter}`;}).join(' · ');matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div><div class="eval-item-feedback" id="evalFbPr" aria-live="polite"></div>`;s4.appendChild(matchCard);out.appendChild(s4);window._evalPrintData={tf:tfItems,mc:mcItems,cp:cpItems,pr:{terms:prItems,shuffledDefs,letters}};const autoPanel=document.createElement('div');autoPanel.id='evalAutoResult';autoPanel.className='eval-auto-result';autoPanel.innerHTML='<strong>🧮 Evaluación interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato original sin respuestas digitadas.';out.appendChild(autoPanel);fin('s-evaluacion');}
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación Los Tres Poderes del Estado · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.12rem 0.4rem;margin:0.22rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #3f6212;background:#f2f7e6;color:#3f6212;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#3f6212;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #3f6212;height:12px;}.obt-pct{white-space:nowrap;}.qn{font-weight:700;min-width:22px;flex-shrink:0;}.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:40px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.18rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.14rem 0.35rem;margin-bottom:0.1rem;break-inside:avoid;page-break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.3;display:flex;gap:0.28rem;margin-bottom:0.07rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.1rem 0.5rem;}.mc-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:0.04rem 0.15rem;margin-left:0.8rem;}.mc-opt{font-size:9pt;display:flex;align-items:center;gap:0.15rem;}.mc-opt input{width:10px;height:10px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{margin-top:0.1rem;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.08rem 0.4rem;margin-top:0.08rem;}.pr-head{font-size:9pt;font-weight:700;color:#555;margin-bottom:0.1rem;}.pr-item{font-size:10.5pt;padding:0.1rem 0.28rem;background:#f2f7e6;border-radius:3px;margin-bottom:0.07rem;display:flex;align-items:center;gap:0.2rem;line-height:1.2;break-inside:avoid;page-break-inside:avoid;}.pr-num{font-weight:700;color:#3f6212;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.22rem;padding:0.15rem 0;page-break-before:avoid;break-before:avoid;color:#3f6212;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #3f6212;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#555;}.pa{color:#007a00;font-weight:600;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · Los Tres Poderes del Estado · Educación Básica · Educación Cívica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Evaluación Final · Los Tres Poderes del Estado · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u</div></div><div class="p-grid">${pR}</div>
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
  {txt:'Un alumno dice que el Presidente puede cambiar una ley cuando quiera, porque es la máxima autoridad del país.'},
  {txt:'En el acto cívico, alguien afirma que la Corte Suprema de Justicia hace las leyes.'},
  {txt:'Una maestra dice que su Estatuto lo escribió la Secretaría de Educación.'},
  {txt:'Un vecino cuenta que fue a la alcaldía a reclamar un pleito con su hermano y le dijeron que ahí eso no se resuelve.'},
  {txt:'Un compañero dice que si los tres poderes se pusieran siempre de acuerdo, el país funcionaría mejor.'},
  {txt:'En la reunión de padres nadie pregunta en qué se gastó el dinero de la merienda escolar.'}
];
const critCaseQuestions=[
  '1. ¿De qué poder del Estado habla este caso?',
  '2. ¿Lo que se dice es correcto? ¿Por qué?',
  '3. ¿A quién le toca de verdad hacer eso?',
  '4. ¿Qué le explicarías tú a esa persona para que le quede claro?'
];
const critCaseGuides=[
  'Puede ser el Legislativo (el Congreso Nacional), el Ejecutivo (el Presidente y las Secretarías) o el Judicial (la Corte Suprema y los tribunales).',
  'Se valora que el alumno distinga QUÉ HACE cada poder: uno hace la ley, otro la cumple y la hace cumplir, y el tercero la aplica a cada caso. Confundirlos es el error más común.',
  'Cada cosa tiene su poder: aprobar una ley es del Congreso; reglamentarla y ejecutarla, del Ejecutivo; resolver un pleito, del Judicial. Rendir cuentas les toca a los tres.',
  'Respuesta abierta. Se valora que explique con respeto y con un dato concreto, no que se burle de la persona.'
];
const critErrorBank=[
  {txt:'"El Presidente hace las leyes y el Congreso las cumple."',
   g1:'Es al revés: el CONGRESO NACIONAL hace las leyes, y una ley suya se llama decreto.',
   g2:'El PRESIDENTE las cumple y las hace cumplir: por eso firma «Por Tanto: Ejecútese».'},
  {txt:'"La Corte Suprema de Justicia aprueba las leyes del país."',
   g1:'Las leyes las aprueba el CONGRESO NACIONAL, que es el Poder Legislativo.',
   g2:'La CORTE SUPREMA encabeza el Poder Judicial: aplica la ley a cada caso y establece jurisprudencia.'},
  {txt:'"Un reglamento puede agregarle cosas a la ley, porque es más nuevo."',
   g1:'No puede: el reglamento dice CÓMO se aplica la ley y no puede decir más que ella.',
   g2:'Si pudiera, el Ejecutivo estaría haciendo leyes sin pasar por el Congreso.'},
  {txt:'"Como la Constitución es muy antigua, las leyes nuevas mandan sobre ella."',
   g1:'Manda la que está más ARRIBA, no la más nueva: la Constitución es la ley fundamental.',
   g2:'El Código de la Niñez ordena las normas por rango y la pone en el número 1.'}
];
const critDecisionBank=[
  'Un compañero dice que el Presidente hace las leyes; conviene mostrarle el encabezado de una ley de verdad, o dejarlo así porque casi nadie lo sabe.',
  'Para la exposición sobre los poderes, conviene decir de dónde salió cada dato, o inventar lo que falte para que quede más completo.',
  'Te toca averiguar cuántos diputados hay; conviene buscarlo en la Constitución o en tu libro, o poner el primer número que alguien recuerde.',
  'En la reunión de padres nadie pregunta por el dinero de la merienda; conviene preguntar con respeto, o quedarse callado para no incomodar.',
  'Un funcionario no quiere explicar en qué gastó un fondo; conviene insistir porque es dinero de todos, o aceptar que él sabrá lo que hace.'
];
const critDecisionGuide='La mejor decisión busca la verdad y la comprueba: un poder se estudia por lo que HACE y no por quién manda más; los datos se buscan en la fuente y no en la memoria de alguien; y preguntar en qué se gastó el dinero de todos no es una falta de respeto, es exactamente lo que la rendición de cuentas espera de un ciudadano.';
const critCompareBank=[
  {a:'Aprueba las leyes y las llama decretos.',b:'Manda que las leyes se cumplan y dicta acuerdos.',
   ga:'El Poder Legislativo: el Congreso Nacional.',
   gb:'El Poder Ejecutivo: el Presidente y las Secretarías de Estado.',
   gr:'Los dos trabajan sobre la misma ley, pero uno la ESCRIBE y el otro la PONE A FUNCIONAR. Por eso el acuerdo del Ejecutivo nunca puede decir más de lo que dice el decreto del Congreso.'},
  {a:'Una ley que vale igual para todo el país.',b:'Una decisión que resuelve el caso de dos personas.',
   ga:'La hace el Poder Legislativo.',
   gb:'La dicta el Poder Judicial.',
   gr:'La ley es general y la sentencia es de un caso concreto. El Legislativo escribe la regla, el Judicial dice qué significa esa regla cuando hay pleito — y si lo repite muchas veces, eso es jurisprudencia.'},
  {a:'La Constitución de la República.',b:'El reglamento de una ley.',
   ga:'Es la ley fundamental: el escalón más alto.',
   gb:'Es de los escalones bajos: lo dicta el Ejecutivo.',
   gr:'Las dos son normas escritas, pero no mandan igual. Si el reglamento dice lo contrario de la Constitución, gana la Constitución: cuando dos normas chocan, manda la que está más arriba, no la más nueva.'}
];
const critCauseBank=[
  {cause:'El Congreso Nacional aprobó el Estatuto del Docente como Decreto 136-97.',guide:'Por eso ese documento lleva arriba «PODER LEGISLATIVO» y su número con el año en que se aprobó.'},
  {cause:'El Presidente firmó al pie «Al Poder Ejecutivo. Por Tanto: Ejecútese».',guide:'Por eso la ley dejó de ser un papel aprobado y pasó a cumplirse en todo el país.'},
  {cause:'El Artículo 93 del Estatuto mandaba que se hiciera su reglamento.',guide:'Por eso la Secretaría de Educación dictó el Acuerdo 0760-SE-99, que dice cómo se aplica.'},
  {cause:'La Constitución está en el escalón más alto de la jerarquía normativa.',guide:'Por eso ninguna ley, reglamento ni acuerdo puede decir lo contrario de lo que ella dice.'},
  {cause:'Los tres poderes están separados y cada uno puede pararle la mano a los otros.',guide:'Por eso una persona común puede reclamarle a una autoridad y ganarle: eso es un Estado de Derecho.'}
];
const critEffectBank=[
  {effect:'Una ley aprobada por el Congreso todavía no obliga a nadie.',guide:'Porque entra en vigencia al publicarse en el Diario Oficial La Gaceta, no antes.'},
  {effect:'Un maestro con un problema laboral va a los juzgados y no al Congreso.',guide:'Porque el Legislativo escribe la ley para todos, y el Judicial la aplica a cada caso.'},
  {effect:'Un reglamento no puede exigir algo que su ley no exige.',guide:'Porque si pudiera, el Ejecutivo estaría haciendo leyes sin pasar por el Congreso.'},
  {effect:'Los funcionarios tienen que explicar en qué gastaron el dinero público.',guide:'Porque ese dinero no es suyo: es de todos, y por eso cualquier ciudadano puede preguntarlo.'},
  {effect:'Separar los poderes hace que las cosas vayan más lentas.',guide:'Porque es a propósito: la lentitud es el precio de que nadie pueda decidir solo y sin control.'}
];
function genEvalCrit(){
  sfx('click');
  _injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });
  const _sC = document.getElementById('evalCritFormaSel');
  if (_sC && parseInt(_sC.value, 10)) evalCritFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sC.value, 10)));
  const cf=evalCritFormNum;window._currentEvalCritForm=cf;const rngC = _evalRng(200000 + cf);evalCritFormNum=(evalCritFormNum%EVAL_FORMAS)+1;_injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });saveProgress();
  document.getElementById('evalcrit-screen-title').textContent=`🧠 Pensamiento Crítico · Forma ${cf} · Los Tres Poderes del Estado`;
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
  const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Pensamiento Crítico Los Tres Poderes del Estado · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.1rem 0.4rem;margin:0.2rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #3f6212;background:#f2f7e6;color:#3f6212;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#3f6212;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #3f6212;height:12px;}.obt-pct{white-space:nowrap;}.crit-print-scenario{font-size:10.5pt;background:#f2f7e6;border-left:3px solid #3f6212;padding:0.2rem 0.5rem;margin:0.1rem 0 0.2rem;line-height:1.3;}.crit-print-q{font-size:10pt;font-weight:600;margin:0.15rem 0 0.08rem;line-height:1.25;}.ln{border-bottom:1px solid #111;min-height:12px;margin-bottom:2px;}.crit-compare-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin:0.15rem 0;}.crit-compare-print-box{font-size:9.5pt;background:#f2f7e6;border-radius:4px;padding:0.25rem 0.4rem;line-height:1.25;}.crit-print-tbl{width:100%;border-collapse:collapse;font-size:9.5pt;margin-top:0.15rem;}.crit-print-tbl th,.crit-print-tbl td{border:1px solid #999;padding:0.3rem 0.45rem;text-align:left;height:30px;vertical-align:middle;}.crit-print-tbl th{background:#f2f7e6;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.08rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.9rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.45rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.1rem;margin-bottom:0.18rem;}.p-crit-line{font-size:11pt;color:#007a00;margin-bottom:0.18rem;line-height:1.35;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.2rem;padding:0.1rem 0;color:#3f6212;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #3f6212;}.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:12.7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="critEvalPage"><div class="ph"><h2>Evaluación Competencial · Pensamiento Crítico · Los Tres Poderes del Estado · Educación Básica · Educación Cívica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 5 secciones de 20 puntos</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100</span></div></div><div class="pauta-wrap" id="critPautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Pensamiento Crítico · Los Tres Poderes del Estado · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 5 secciones × 20 pts c/u — respuesta abierta, usar como guía de corrección</div></div><div class="p-grid">${pR}</div></div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("critEvalPage",250,0.55,1.2);fit("critPautaPage",250,0.55,1.2);})();<\/script></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(doc);win.document.close();setTimeout(()=>win.print(),400);
}

// ===================== LABORATORIO DE LOS SÍMBOLOS =====================
const parteData = (function () {
  /* Se arma desde js/data/poderes-honduras.js. Escribir aquí a los tres otra
     vez sería abrir la puerta a que la pantalla y el papel dejen de decir lo
     mismo, que es la lección de la misión del Himno. */
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const out = {};
  PODERES.forEach(p => {
    const pasos = PODERES_RECORRIDO.pasos.filter(x => x.poder === p.clave)
                    .map(x => '• <strong>' + esc(x.titulo) + '</strong><br>&nbsp;&nbsp;' + esc(x.texto)).join('<br><br>');
    out[p.clave] = {
      nombre: p.nombre, icon: p.emoji,
      estructura: { title: '¿Qué hace?',   info: '<strong>' + esc(p.verbo) + '</strong><br><br>' + esc(p.queHace) },
      funcion:    { title: '¿Quién lo ejerce?', info: esc(p.quien) + '<br><br><em>' + esc(p.pista) + '</em>' },
      ubicacion:  { title: 'En una ley de verdad', info: esc(p.ejemplo) + (pasos ? '<br><br>' + pasos : '') },
      dato:       { title: 'De dónde sale este dato', info: '📚 ' + esc(p.fuente) }
    };
  });
  out.constitucion = {
    nombre: 'La Constitución', icon: '📕',
    estructura: { title: '¿Qué hace?', info: '<strong>Es la ley FUNDAMENTAL</strong><br><br>Dice cómo se organiza el Estado y qué derechos tiene cada persona. Ninguna otra norma puede decir lo contrario de lo que ella dice.' },
    funcion:    { title: '¿Quién lo ejerce?', info: 'No la ejerce un poder: los tres están debajo de ella.<br><br><em>Cuando dos normas chocan, manda la que está más arriba — no la más nueva.</em>' },
    ubicacion:  { title: 'En una ley de verdad', info: esc(PODERES_JERARQUIA.intro) + '<br><br>' + PODERES_JERARQUIA.escalones.map((e,i)=>(i+1)+'. '+esc(e)).join('<br>') + '<br><br>' + esc(PODERES_JERARQUIA.fijate) },
    dato:       { title: 'De dónde sale este dato', info: '📚 ' + esc(PODERES_JERARQUIA.fuente) }
  };
  return out;
})();
let labParte='legislativo',labAspecto='estructura';
function labShowParte(parteKey){labParte=parteKey;updateLabDisplay();document.querySelectorAll('.lab-cont-btn').forEach(b=>b.classList.remove('active-pri'));const btn=document.querySelector(`[data-parte="${parteKey}"]`);if(btn)btn.classList.add('active-pri');if(typeof sfx==='function')sfx('click');}
function labShowAspecto(aspectoKey){labAspecto=aspectoKey;updateLabDisplay();document.querySelectorAll('.lab-asp-btn').forEach(b=>b.classList.remove('active-sec'));const btn=document.querySelector(`[data-aspecto="${aspectoKey}"]`);if(btn)btn.classList.add('active-sec');if(typeof sfx==='function')sfx('click');}
function updateLabDisplay(){const data=parteData[labParte];const asp=data[labAspecto];document.getElementById('lab-sentence').innerHTML=`🔬 Explorando: <strong>${data.nombre}</strong> → <strong>${asp.title}</strong>`;document.getElementById('lab-display').innerHTML=`<div class="lab-cont-header">${data.icon} ${data.nombre}</div><div class="lab-asp-title">${asp.title}</div><div class="lab-asp-info">${asp.info}</div>`;}

// ===================== DIPLOMA =====================
function _diplPct(){return xp>=MXP?100:Math.round((xp/MXP)*100);}
function openDiploma(){sfx('fan');const pct=_diplPct();document.getElementById('diplPct').textContent=pct+'%';document.getElementById('diplBar').style.width=pct+'%';document.getElementById('diplDate').textContent='Fecha: '+new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});const msgs=['¡Sigue aprendiendo!','¡Muy buen trabajo!','¡Vas muy bien!','¡Conoces a los que hicieron Honduras!','¡Guardián de la Patria!'];document.getElementById('diplMsg').textContent=msgs[Math.min(Math.floor(pct/25),4)];const stars=['⭐','⭐⭐','⭐⭐⭐'];document.getElementById('diplStars').textContent=stars[Math.min(Math.floor(pct/40),2)];const achTxt=unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(' · ');document.getElementById('diplAch').textContent=achTxt||'Sigue completando secciones para desbloquear logros';document.getElementById('diplomaOverlay').classList.add('open');launchConfetti();}
function closeDiploma(){document.getElementById('diplomaOverlay').classList.remove('open');}
function updateDiplomaName(v){document.getElementById('diplName').textContent=v||'Estudiante';}
function shareWA(){const name=document.getElementById('diplName').textContent||'Estudiante';const pct=_diplPct();const msg=`🇭🇳 ¡${name} completó la Misión "Los Tres Poderes del Estado"! 🏅 Progreso: ${pct}% · 🌱 policastsapien.com`;_waShare(msg);}
async function captureDiploma(){if(typeof html2canvas==='undefined'){showToast('⚠️ Cargando... intenta de nuevo');return;}sfx('click');const card=document.querySelector('.diploma-card');const btn=document.querySelector('.diploma-actions .btn-pri');const toHide=[card.querySelector('.diploma-input'),card.querySelector('.diploma-actions'),card.querySelector('hr')];if(btn){btn.disabled=true;btn.textContent='⏳ Capturando...';}toHide.forEach(el=>{if(el)el.style.display='none';});let dataUrl='';try{const canvas=await html2canvas(card,{scale:2,useCORS:true,backgroundColor:'#ffffff'});toHide.forEach(el=>{if(el)el.style.display='';});dataUrl=canvas.toDataURL('image/png');const name=(document.getElementById('diplName').textContent||'Estudiante').replace(/\s+/g,'-');const fileName='constancia-'+name+'.png';const cap=window.Capacitor;if(cap&&cap.isNativePlatform&&cap.isNativePlatform()&&cap.Plugins?.Filesystem&&cap.Plugins?.Share){const base64Data=dataUrl.split(',')[1];const result=await cap.Plugins.Filesystem.writeFile({path:fileName,data:base64Data,directory:'CACHE'});await cap.Plugins.Share.share({url:result.uri,dialogTitle:'Guardar / Compartir Constancia'});}else{const a=document.createElement('a');a.href=dataUrl;a.download=fileName;a.click();}}catch(e){toHide.forEach(el=>{if(el)el.style.display='';});if(e.name!=='AbortError')showToast('⚠️ No se pudo guardar la constancia');}finally{if(btn){btn.disabled=false;btn.textContent='📷 Guardar foto';}}}

// ===================== INIT =====================

// ===================== LOS TRES PODERES, EN LA PANTALLA =====================
/* El mapa, las fichas, el recorrido de la ley y la jerarquía se PINTAN desde
   js/data/poderes-honduras.js, no se escriben en el HTML. Es la lección de la
   misión del Himno: el mismo texto acaba en la pantalla y en la ficha que se
   fotocopia, y si cada uno lleva su copia, un día dejan de decir lo mismo y el
   alumno estudia algo que el examen no le va a aceptar.
   De ahí sale también `_dev/verifica-poderes.js`. */
function _esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

function pintarPoderesMapa(){
  const cont=document.getElementById('pod-mapa');if(!cont)return;
  const tonos=['tc-teal','tc-gold','tc-jade'];
  cont.innerHTML=PODERES.map((p,i)=>
    `<div class="type-chip ${tonos[i%tonos.length]}"><div class="t-art">${p.emoji} ${_esc(p.nombre)}</div><div class="t-info">${_esc(p.verbo)}</div></div>`
  ).join('');
}

function pintarPoderesLista(){
  const cont=document.getElementById('pod-lista');if(!cont)return;
  cont.innerHTML=PODERES.map(p=>`<div class="pr-ficha">
      <h3 class="pr-tit">${p.emoji} ${_esc(p.nombre)} <span class="pr-clase pr-p">${_esc(p.verbo)}</span></h3>
      <p class="pr-apodo">Lo ejerce: ${_esc(p.quien)}</p>
      <p class="pr-papel">${_esc(p.queHace)}</p>
      <p class="pr-sub">Cómo se ve en una ley de verdad</p>
      <p class="pr-porque">${_esc(p.ejemplo)}</p>
      <div class="tip"><span class="ti">🔎</span><div>${_esc(p.pista)}</div></div>
      <div class="tip"><span class="ti">📚</span><div>${_esc(p.fuente)}</div></div>
    </div>`).join('');
}

/* La jerarquía se copia ENTERA, en su orden: recortarla sería enseñar una
   jerarquía que no es la que dice la ley. */
function pintarPoderesJerarquia(){
  const c=document.getElementById('pod-jerarquia');if(!c)return;
  c.innerHTML=`<h2>📕 ${_esc(PODERES_JERARQUIA.titulo)}</h2>
    <p>${_esc(PODERES_JERARQUIA.intro)}</p>
    <ol class="pod-escalones">${PODERES_JERARQUIA.escalones.map(e=>`<li>${_esc(e)}</li>`).join('')}</ol>
    <p class="pr-porque"><strong>${_esc(PODERES_JERARQUIA.remate)}</strong></p>
    <div class="tip"><span class="ti">🔎</span><div>${_esc(PODERES_JERARQUIA.fijate)}</div></div>
    <div class="tip"><span class="ti">📚</span><div>${_esc(PODERES_JERARQUIA.fuente)}</div></div>`;
}

/* El recorrido de UNA ley por los tres poderes: es el corazón de la misión,
   porque cada paso se puede señalar en un documento que existe. */
function pintarPoderesRecorrido(){
  const c=document.getElementById('pod-recorrido');if(!c)return;
  c.innerHTML=`<h2>🧭 El recorrido de una ley, paso por paso</h2>
    <p>Se sigue una ley de verdad: <strong>${_esc(PODERES_RECORRIDO.ley)}</strong>. ${_esc(PODERES_RECORRIDO.porque)}</p>
    <div class="pod-pasos">${PODERES_RECORRIDO.pasos.map(x=>{
      const poder=poderPorClave(x.poder);
      return `<div class="pod-paso"><div class="pod-paso-n">${x.n}</div><div>
        <h4>${poder?poder.emoji:''} ${_esc(x.titulo)}</h4>
        <p>${_esc(x.texto)}</p>
        <span class="pod-paso-quien">${poder?_esc(poder.nombre):''}</span></div></div>`;
    }).join('')}</div>`;
}

/* Por qué están separados, la rendición de cuentas y lo que NO se escribe.
   Lo último es una actividad y no un dato, a propósito: los números que
   faltan los acredita la Constitución, que no está en el repositorio. */
function pintarPoderesSeparacion(){
  const c=document.getElementById('pod-separacion');
  if(c)c.innerHTML=`<h2>⚖️ ${_esc(PODERES_SEPARACION.titulo)}</h2>
    <p>${_esc(PODERES_SEPARACION.texto)}</p>
    ${PODERES_SEPARACION.casos.map(k=>{
      const poder=poderPorClave(k.quien);
      return `<div class="ex-box"><span class="ex-tag ex-d">${poder?poder.emoji:''} ${_esc(k.situacion)}</span><br><span>${_esc(k.quePasa)}</span></div>`;
    }).join('')}`;
  const r=document.getElementById('pod-rendicion');
  if(r)r.innerHTML=`<h2>🧾 ${_esc(PODERES_RENDICION.titulo)}</h2>
    <p>${_esc(PODERES_RENDICION.texto)}</p>
    <div class="ex-box"><span class="ex-tag ex-d">🏫 En tu escuela</span><br><span>${_esc(PODERES_RENDICION.enTuEscuela)}</span></div>
    <div class="tip"><span class="ti">📚</span><div>${_esc(PODERES_RENDICION.fuente)}</div></div>`;
  const i=document.getElementById('pod-investiga');
  if(i)i.innerHTML=`<h2>🔍 ${_esc(PODERES_INVESTIGA.titulo)}</h2>
    <p>${_esc(PODERES_INVESTIGA.intro)}</p>
    ${PODERES_INVESTIGA.preguntas.map(q=>
      `<div class="ex-box"><span class="ex-tag ex-d">✍️ ${_esc(q.q)}</span><br><span>${_esc(q.luego)}</span></div>`).join('')}
    <div class="tip"><span class="ti">📚</span><div>${_esc(PODERES_INVESTIGA.nota)}</div></div>`;
}

/* Los conceptos que el DCNB pide aclarar, en su propio recuadro. */
function pintarPoderesConceptos(){
  const c=document.getElementById('pod-conceptos');if(!c)return;
  c.innerHTML=PODERES_CONCEPTOS.map(k=>
    `<div class="type-chip tc-purple"><div class="t-art">${k.emoji} ${_esc(k.palabra)}</div><div class="t-info">${_esc(k.definicion)}</div></div>`).join('');
}

window.addEventListener('DOMContentLoaded',()=>{
  initTheme();
  loadProgress();
  pintarPoderesMapa();
  pintarPoderesLista();
  pintarPoderesConceptos();
  pintarPoderesJerarquia();
  pintarPoderesRecorrido();
  pintarPoderesSeparacion();
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
