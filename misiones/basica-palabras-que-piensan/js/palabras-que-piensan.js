// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
function compartirMision(){const url=window.location.href;const texto=`🚀 *Misión Asignada* 🚀\n\nPractica sobre este tema y sobresale en ser de los mejores alumnos. 🏆\n\nDesbloquea *todos los logros* y puedes poner *tus datos* para que tu maestro observe todos tus logros. 📋\n\n_Se te hará prueba escrita y serás excelente estudiante en Filosofía._ ✍️\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;_waShare(texto);}
function toggleLetra(){document.body.classList.toggle('letra-grande');if(typeof sfx==='function')sfx('click');localStorage.setItem('preferenciaLetra',document.body.classList.contains('letra-grande'));}
window.addEventListener('DOMContentLoaded',()=>{if(localStorage.getItem('preferenciaLetra')==='true')document.body.classList.add('letra-grande');});

// ===================== UTILIDADES =====================
const _pick=(arr,n)=>[...arr].sort(()=>Math.random()-0.5).slice(0,n);
const _shuffle=(arr)=>[...arr].sort(()=>Math.random()-0.5);
function fb(id,msg,isOk){const el=document.getElementById(id);if(el){el.textContent=msg;el.className='fb show '+(isOk?'ok':'err');}}

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY='filosofia_lenguaje_v1';
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
  primer_quiz:{icon:'🧠',label:'Primer Quiz completado'},
  flash_master:{icon:'🃏',label:'Todas las tarjetas volteadas'},
  clasif_pro:{icon:'🗂️',label:'Separaste lo que hace cada frase'},
  id_master:{icon:'🔍',label:'Identificaste todos los términos'},
  reto_hero:{icon:'🏆',label:'Héroe del Reto'},
  sopa_master:{icon:'🤍',label:'Sopa completada'},
  widgets_master:{icon:'🧩',label:'Widgets dominados'},
  nivel3:{icon:'🔍',label:'Ya preguntás qué hace la frase'},
  nivel5:{icon:'✅',label:'La forma ya no te engaña'}
};
function unlockAchievement(id){if(unlockedAch.includes(id))return;unlockedAch.push(id);sfx('ach');showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label);launchConfetti();renderAchPanel();saveProgress();}
function renderAchPanel(){const list=document.getElementById('achList');list.innerHTML='';Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{const div=document.createElement('div');div.className='ach-item'+(unlockedAch.includes(id)?'':' locked');div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`;list.appendChild(div);});}
function toggleAchPanel(){sfx('click');document.getElementById('achPanel').classList.toggle('open');}
function showToast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}t.textContent=msg;t.style.display='block';clearTimeout(t._tid);t._tid=setTimeout(()=>t.style.display='none',3200);}
function launchConfetti(){const colors=['#784a6d','#b9789f','#1d4538','#3f8a6d','#f59e0b'];for(let i=0;i<60;i++){const c=document.createElement('div');c.className='confetti-piece';c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`;document.body.appendChild(c);c.addEventListener('animationend',()=>c.remove());}}

// ===================== XP =====================
const lvls=[{t:0,n:'Aprendiz 🌱'},{t:25,n:'Preguntás qué hace la frase 🤔'},{t:55,n:'Separás las cuatro clases ✅'},{t:90,n:'Encontrás el doble sentido 🔀'},{t:130,n:'Probás una definición 🎯'},{t:165,n:'Pedís el número 📏'},{t:190,n:'La forma ya no te engaña 💬'}];
function pts(n){xp=Math.max(0,Math.min(MXP,xp+n));updateXPBar();saveProgress();}
function updateXPBar(){const pct=Math.round((xp/MXP)*100);document.getElementById('xpFill').style.width=pct+'%';const el=document.getElementById('xpPts');el.textContent='⭐ '+xp;el.style.transform='scale(1.3)';setTimeout(()=>el.style.transform='',300);let lv=0;for(let i=0;i<lvls.length;i++)if(xp>=lvls[i].t)lv=i;document.getElementById('xpLvl').textContent=lvls[lv].n;if(lv!==prevLevel){if(lv>=2)unlockAchievement('nivel3');if(lv>=5)unlockAchievement('nivel5');prevLevel=lv;}}
function resetXP(){sfx('click');xp=0;updateXPBar();showToast('🔄 XP reiniciado a 0');}
function fin(id,showFX=true){if(!done.has(id)){done.add(id);const b=document.querySelector(`[data-s="${id}"]`);if(b)b.classList.add('done');if(showFX){sfx('up');launchConfetti();}saveProgress();}}
function getProgress(){return Math.round((done.size/TOTAL_SECTIONS)*100);}

// ===================== NAV =====================
function go(id){sfx('click');document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});document.getElementById(id).classList.add('active');const btn=document.querySelector(`[data-s="${id}"]`);if(btn){btn.classList.add('active');btn.setAttribute('aria-selected','true');}window.scrollTo({top:0,behavior:'smooth'});if(id==='s-sopa'){setTimeout(buildSopa,50);}if(id==='s-widgets'){setTimeout(buildRoute,50);}}

// ===================== FLASHCARD DATA =====================
const fcData = (function () {
  const out = [];
  LEN_VOCABULARIO.forEach(v => out.push({ w: v.w, a: v.a }));
  LEN_ACTOS.forEach(e => out.push({
    w: e.emoji + ' ' + e.nombre,
    a: e.senal + ' <strong>' + e.prueba + '</strong>' }));
  LEN_AMBIG.forEach(a => out.push({
    w: a.emoji + ' «' + a.frase + '»',
    a: 'Puede ser: ' + a.una + ' O: <em>' + a.otra + '</em> <strong>' + a.arregla + '</strong>' }));
  LEN_DEFINIR.forEach(d => out.push({
    w: d.emoji + ' Definición ' + d.nombre.toLowerCase(),
    a: d.que + ' ' + d.ej + ' <strong>' + d.prueba + '</strong>' }));
  LEN_CARGA.forEach(x => out.push({
    w: '⚖️ ' + x.suave + ' / ' + x.fuerte,
    a: 'Las dos nombran ' + x.cosa + '. <strong>' + x.igual + '</strong>' }));
  LEN_TRUCOS.forEach(t => out.push({
    w: t.emoji + ' ' + t.nombre,
    a: t.hace + ' Suena: <em>' + t.suena + '</em> <strong>' + t.desarma + '</strong>' }));
  LEN_PENSADORES.forEach(p => out.push({
    w: p.emoji + ' ' + p.nombre,
    a: p.quien + ' <strong>' + p.porque + '</strong>' }));
  return out;
})();
let fcIdx=0;
function upFC(){document.getElementById('fcInner').classList.remove('flipped');document.getElementById('fcW').textContent=fcData[fcIdx].w;document.getElementById('fcA').innerHTML=fcData[fcIdx].a;document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length;}
function flipCard(){sfx('flip');document.getElementById('fcInner').classList.toggle('flipped');if(!xpTracker.fc.has(fcIdx)){xpTracker.fc.add(fcIdx);pts(1);}if(xpTracker.fc.size===fcData.length){fin('s-flash');unlockAchievement('flash_master');}}
function nextFC(){sfx('click');fcIdx=(fcIdx+1)%fcData.length;upFC();}
function prevFC(){sfx('click');fcIdx=(fcIdx-1+fcData.length)%fcData.length;upFC();}

// ===================== QUIZ DATA =====================
const qzData=[
  {q:'¿De qué se ocupa la filosofía del lenguaje?',o:['De qué hacen las palabras con las ideas','De medir el tiempo','De contar dinero','De escribir sin faltas'],c:0},
  {q:'«¿Me pasás la sal?» tiene forma de pregunta. ¿Qué HACE?',o:['Afirma algo','Pide algo','Exclama','Nada'],c:1},
  {q:'«Te espero en el banco» puede querer decir dos cosas. ¿Qué la arregla?',o:['Una pregunta: ¿en cuál de los dos?','Decirlo más fuerte','Escribirlo bonito','Repetirla'],c:0},
  {q:'«Un ave es un animal que vuela» deja fuera a la gallina. Esa definición es…',o:['muy angosta','muy ancha','justa','correcta'],c:0},
  {q:'«Una silla es algo donde uno se sienta» deja entrar una piedra. Es…',o:['muy angosta','muy ancha','justa','imposible'],c:1},
  {q:'«De segunda mano» y «usada» nombran lo mismo. ¿Qué cambia?',o:['La cosa','Hacia dónde apunta la palabra','El precio','Nada'],c:1},
  {q:'«¿Por qué el abono caro rinde más?» es una pregunta…',o:['imposible de contestar','sin verbo','con la respuesta ya metida dentro','de opinión'],c:2},
  {q:'¿Cómo se desarma esa pregunta?',o:['Contestando rápido','Cambiando de tema','Preguntando el precio','Contestando la de atrás: ¿rinde más?'],c:3},
  {q:'«Es de mejor calidad» es una palabra que…',o:['se puede medir','está mal escrita','no se puede comprobar así','es una orden'],c:2},
  {q:'¿Toda palabra fuerte es una trampa?',o:['Sí, siempre','Solo en la radio','Solo por escrito','No: si la cosa es fuerte, decirlo flojo sería el error'],c:3},
  {q:'«¡Qué frío!» ¿qué hace la frase?',o:['Afirma un dato','Pide algo','Pregunta','Suelta lo que siente'],c:3},
  {q:'¿Qué enseña Bertrand Russell, según esta misión?',o:['A medir la luz','A contar votos','A pedir que la frase se aclare antes de discutirla','A escribir versos'],c:2}
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
const classGroups = (function () {
  const fi = (arr, t) => arr.map(a => ({ w: a, t: t }));
  const af = lenDeClase('afirma'), pr = lenDeClase('pregunta'),
        pi = lenDeClase('pide'),   ex = lenDeClase('exclama');
  return [
    { label:['Pide algo del otro','Solo cuenta o suelta'], headA:'🙋 Pide algo del otro', headB:'📌 Solo cuenta', colA:'pide', colB:'no',
      words: fi(pr.slice(0,2),'pide').concat(fi(pi.slice(0,2),'pide'), fi(af.slice(0,2),'no'), fi(ex.slice(0,2),'no')) },
    { label:['Afirma: dice que algo es así','Pregunta: pide un dato'], headA:'📌 Afirma', headB:'❓ Pregunta', colA:'afirma', colB:'pregunta',
      words: fi(af.slice(2,6),'afirma').concat(fi(pr.slice(2,6),'pregunta')) },
    { label:['Pide o manda: quiere que hagas algo','Exclama: suelta lo que siente'], headA:'✋ Pide o manda', headB:'❗ Exclama', colA:'pide', colB:'exclama',
      words: fi(pi.slice(2,6),'pide').concat(fi(ex.slice(2,6),'exclama')) }
  ];
})();
let currentClassGroupIdx=0,clsSelectedWord=null;
function buildClass(){const group=classGroups[currentClassGroupIdx];document.getElementById('col-left-head').textContent=group.headA;document.getElementById('col-right-head').textContent=group.headB;const bank=document.getElementById('clsBank');bank.innerHTML='';clsSelectedWord=null;document.getElementById('items-left').innerHTML='';document.getElementById('items-right').innerHTML='';_shuffle([...group.words]).forEach(w=>{const el=document.createElement('div');el.className='wb-item';el.textContent=w.w;el.dataset.t=w.t;el.onclick=()=>{document.querySelectorAll('.wb-item').forEach(i=>i.classList.remove('sel-word'));el.classList.add('sel-word');clsSelectedWord=el;sfx('click');};bank.appendChild(el);});['col-left','col-right'].forEach(colId=>{const col=document.getElementById(colId);col.onclick=(e)=>{if(!clsSelectedWord||e.target.classList.contains('drop-item'))return;const targetId=colId==='col-left'?'items-left':'items-right';const wordsCol=document.getElementById(targetId);const item=document.createElement('div');item.className='drop-item';item.textContent=clsSelectedWord.textContent;item.dataset.t=clsSelectedWord.dataset.t;const original=clsSelectedWord;item.onclick=(ev)=>{ev.stopPropagation();if(clsSelectedWord!==null){col.click();}else{document.getElementById('clsBank').appendChild(original);original.classList.remove('sel-word');item.remove();if(typeof sfx==='function')sfx('click');}};wordsCol.appendChild(item);clsSelectedWord.remove();clsSelectedWord=null;sfx('click');};});}
function checkClass(){const remaining=document.querySelectorAll('#clsBank .wb-item').length;if(remaining>0){fb('fbCls','Mueve todas las palabras a las columnas primero.',false);return;}const group=classGroups[currentClassGroupIdx];let allOk=true;document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{const inLeft=el.parentElement.id==='items-left';const expectedType=inLeft?group.colA:group.colB;if(el.dataset.t===expectedType){el.classList.add('cls-ok');}else{el.classList.add('cls-no');allOk=false;}});if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);}if(allOk){fb('fbCls','¡Perfecto! +5 XP',true);sfx('fan');fin('s-clasifica');unlockAchievement('clasif_pro');}else{fb('fbCls','Hay errores. Los errados llevan ✗.',false);sfx('no');}}
function nextClassGroup(){sfx('click');currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length;buildClass();document.getElementById('fbCls').classList.remove('show');showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]);}
function resetClass(){sfx('click');buildClass();document.getElementById('fbCls').classList.remove('show');}

// ===================== IDENTIFICAR =====================
const idData=[
  {s:['Una','frase','que','pide','un','dato','es','una','pregunta.'],c:8,art:'la clase de frase que pide un dato'},
  {s:['«¡Qué','frío!»','suelta','lo','que','siente:','exclama.'],c:6,art:'lo que hace esa frase'},
  {s:['«Pasame','el','lápiz»','no','pide','un','dato:','pide','una','acción.'],c:9,art:'lo que esa frase pide'},
  {s:['Cuando','una','frase','dice','dos','cosas','a','la','vez','es','ambigua.'],c:10,art:'la palabra para una frase de doble sentido'},
  {s:['Definir','es','decir','qué','entra','y','qué','no','entra.'],c:0,art:'el verbo de decir qué entra y qué no'},
  {s:['Una','definición','muy','ancha','deja','entrar','lo','que','no','es.'],c:3,art:'cómo se llama esa falla'},
  {s:['Una','definición','muy','angosta','deja','fuera','lo','que','sí','es.'],c:3,art:'cómo se llama la falla contraria'},
  {s:['«De','segunda','mano»','y','«usada»','nombran','la','misma','bolsa.'],c:8,art:'la cosa que las dos palabras nombran'},
  {s:['Lo','que','el','que','habla','quiere','lograr','es','su','intención.'],c:9,art:'el nombre de lo que el hablante busca'},
  {s:['«Es','de','mejor','calidad»','no','se','puede','comprobar.'],c:7,art:'lo que le falta a esa frase'},
  {s:['El','arte','de','decir','para','convencer','es','la','retórica.'],c:8,art:'el nombre de ese arte'},
  {s:['Lo','que','la','frase','dice','sin','lo','que','insinúa','es','lo','literal.'],c:11,art:'cómo se llama ese sentido'}
];
let idIdx=0,idDone=false;
function showId(){idDone=false;if(idIdx>=idData.length){document.getElementById('idSent').innerHTML='🎉 ¡Completado!';fin('s-identifica');unlockAchievement('id_master');return;}const d=idData[idIdx];document.getElementById('idProg').textContent=`Oración ${idIdx+1} de ${idData.length}`;document.getElementById('idInfo').textContent=`Busca: ${d.art}`;const sent=document.getElementById('idSent');sent.innerHTML='';d.s.forEach((w,i)=>{const span=document.createElement('span');span.className='id-word';span.textContent=w+' ';span.onclick=()=>checkId(i,span);sent.appendChild(span);});}
function checkId(i,span){if(idDone)return;document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected'));span.classList.add('selected');if(i===idData[idIdx].c){idDone=true;span.classList.add('id-ok');fb('fbId','¡Correcto! +5 XP',true);if(!xpTracker.id.has(idIdx)){xpTracker.id.add(idIdx);pts(5);}sfx('ok');}else{span.classList.add('id-no');fb('fbId','Ese no es el término solicitado.',false);sfx('no');}}
function nextId(){sfx('click');idIdx++;showId();document.getElementById('fbId').classList.remove('show');}
function resetId(){sfx('click');idIdx=0;showId();document.getElementById('fbId').classList.remove('show');}

// ===================== COMPLETA =====================
const cmpData=[
  {s:'La rama que mira qué hacen las palabras es la filosofía del ___.',opts:['dinero','lenguaje','tiempo'],c:1},
  {s:'Una frase que pide un dato es una ___.',opts:['orden','exclamación','pregunta'],c:2},
  {s:'Una frase que quiere que hagas algo ___ o manda.',opts:['pide','canta','mide'],c:0},
  {s:'Una frase que dice dos cosas a la vez es ___.',opts:['larga','ambigua','falsa'],c:1},
  {s:'Una definición que deja entrar lo que no es, es muy ___.',opts:['corta','bonita','ancha'],c:2},
  {s:'Una definición que deja fuera lo que sí es, es muy ___.',opts:['angosta','ancha','vieja'],c:0},
  {s:'Lo que el que habla quiere lograr al decirlo es su ___.',opts:['error','intención','tono'],c:1},
  {s:'El arte de decir las cosas para que convenzan es la ___.',opts:['gramática','ortografía','retórica'],c:2},
  {s:'A una palabra que no se puede comprobar se le pide un ___ o un ejemplo.',opts:['número','favor','aplauso'],c:0},
  {s:'Lo que la frase dice, sin lo que insinúa, es su sentido ___.',opts:['doble','literal','oculto'],c:1}
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
/* Las dos secuencias que esta unidad enseña de verdad: cómo se aclara una
   frase que dice dos cosas, y cómo se prueba una definición. Las dos acaban
   en algo que el alumno HACE, no en una moraleja. */
const routeSets = [
  { label: 'Ordena: cómo se aclara una frase de doble sentido',
    steps: ['1. Te llega la frase: «Te espero en el banco».',
            '2. Te das cuenta de que dice dos cosas.',
            '3. Preguntás cuál de las dos es.',
            '4. Te contestan: en la banca del parque.',
            '5. Ya sabés a dónde ir.'] },
  { label: 'Ordena: cómo se prueba una definición',
    steps: ['1. Escribís tu definición.',
            '2. Buscás algo que entre y no debería.',
            '3. Buscás algo que quede fuera y sí debería entrar.',
            '4. La arreglás con lo que encontraste.',
            '5. La probás otra vez con las dos preguntas.'] }
];
let currentRouteIdx=0,routeItems=[];
function buildRoute(){routeItems=_shuffle([...routeSets[currentRouteIdx].steps]);renderRoute();const fbEl=document.getElementById('fbRoute');if(fbEl)fbEl.classList.remove('show');}
function renderRoute(){const list=document.getElementById('routeList');if(!list)return;list.innerHTML='';routeItems.forEach((step,i)=>{const div=document.createElement('div');div.className='sort-item';div.innerHTML=`<div class="sort-arrows"><button class="sort-arrow" onclick="routeMove(${i},-1)"${i===0?' disabled':''}>▲</button><button class="sort-arrow" onclick="routeMove(${i},1)"${i===routeItems.length-1?' disabled':''}>▼</button></div><div class="sort-step-num">${i+1}.</div><div class="sort-item-txt">${step}</div>`;list.appendChild(div);});}
function routeMove(idx,dir){sfx('click');const ni=idx+dir;if(ni<0||ni>=routeItems.length)return;[routeItems[idx],routeItems[ni]]=[routeItems[ni],routeItems[idx]];renderRoute();}
function checkRoute(){const correct=routeSets[currentRouteIdx].steps;const isOk=routeItems.every((s,i)=>s===correct[i]);if(isOk){fb('fbRoute','¡Perfecto! Orden correcto. +4 XP',true);if(!xpTracker.wgt.has('route_'+currentRouteIdx)){xpTracker.wgt.add('route_'+currentRouteIdx);pts(4);}sfx('fan');fin('s-widgets');unlockAchievement('widgets_master');}else{fb('fbRoute','Hay pasos fuera de orden. Revisa el arreglo.',false);sfx('no');}}
function nextRoute(){sfx('click');currentRouteIdx=(currentRouteIdx+1)%routeSets.length;buildRoute();showToast('🔄 Secuencia: '+routeSets[currentRouteIdx].label);}

// Widget 2: Identifica el concepto
/* ¿Qué hace esta frase? Las cuatro clases del DCNB, con dos frases de cada
   una sacadas de las mismas treinta y dos del Clasifica: si mañana entra una
   frase nueva, este widget la reparte solo. */
const neuronPartes = (function () {
  const opts = LEN_ACTOS.map(e => e.emoji + ' ' + e.nombre);
  const nom = q => lenActo(q).emoji + ' ' + lenActo(q).nombre;
  const elegidas = [];
  LEN_ACTOS.forEach(a => {
    lenDeClase(a.clave).slice(6, 8).forEach(f => elegidas.push({ f: f, q: a.clave }));
  });
  return elegidas.map(x => ({ desc: x.f, opts: opts.slice(), ans: nom(x.q) }));
})();
let neuronIdx=0,neuronDone=false;
function showNeuron(){neuronDone=false;if(neuronIdx>=neuronPartes.length){const el=document.getElementById('neuronDesc');if(el)el.textContent='🎉 ¡Ya reconoces a cada uno por lo que hizo!';const opts=document.getElementById('neuronOpts');if(opts)opts.innerHTML='';fin('s-widgets');return;}const d=neuronPartes[neuronIdx];const prog=document.getElementById('neuronProg');if(prog)prog.textContent=`Pista ${neuronIdx+1} de ${neuronPartes.length}`;const desc=document.getElementById('neuronDesc');if(desc)desc.textContent=d.desc;const opts=document.getElementById('neuronOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=opt;b.onclick=()=>checkNeuron(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuron');if(fbEl)fbEl.classList.remove('show');}
function checkNeuron(opt,btn,d){if(neuronDone)return;neuronDone=true;document.querySelectorAll('#neuronOpts .cmp-opt').forEach(b=>{if(b.textContent===d.ans)b.classList.add('correct');else if(b===btn&&b.textContent!==d.ans)b.classList.add('wrong');});const isOk=opt===d.ans;if(isOk){fb('fbNeuron','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuron_'+neuronIdx)){xpTracker.wgt.add('neuron_'+neuronIdx);pts(3);}sfx('ok');}else{fb('fbNeuron','La respuesta correcta es: '+d.ans,false);sfx('no');}}
function nextNeuron(){sfx('click');neuronIdx++;showNeuron();}
function resetNeuron(){sfx('click');neuronIdx=0;showNeuron();}

// Widget 3: Concepto → Significado
/* Cómo suena → qué es. Son los cuatro de `LEN_TRUCOS`, y el cuarto NO es
   trampa: quien los empareje bien se lleva de aquí que una palabra fuerte
   puede estar diciendo la verdad. */
const neuroPairs = LEN_TRUCOS.map(t => ({
  trans: t.suena,
  func: t.emoji + ' ' + t.nombre,
  opts: LEN_TRUCOS.map(x => x.emoji + ' ' + x.nombre)
}));
let neuroIdx=0,neuroDone=false;
function showNeuro(){neuroDone=false;if(neuroIdx>=neuroPairs.length){const el=document.getElementById('neuroTrans');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('neuroOpts');if(opts)opts.innerHTML='';return;}const d=neuroPairs[neuroIdx];const prog=document.getElementById('neuroProg');if(prog)prog.textContent=`${neuroIdx+1} de ${neuroPairs.length}`;const trans=document.getElementById('neuroTrans');if(trans)trans.textContent=d.trans;const opts=document.getElementById('neuroOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkNeuro(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuro');if(fbEl)fbEl.classList.remove('show');}
function checkNeuro(opt,btn,d){if(neuroDone)return;neuroDone=true;document.querySelectorAll('#neuroOpts .qz-opt').forEach(b=>{if(b.textContent===d.func)b.classList.add('correct');else if(b===btn&&b.textContent!==d.func)b.classList.add('wrong');});const isOk=opt===d.func;if(isOk){fb('fbNeuro','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuro_'+neuroIdx)){xpTracker.wgt.add('neuro_'+neuroIdx);pts(3);}sfx('ok');}else{fb('fbNeuro','Correcto: '+d.func,false);sfx('no');}setTimeout(()=>{neuroIdx++;showNeuro();},1800);}
function resetNeuro(){sfx('click');neuroIdx=0;showNeuro();}

/* ⚠️ Widget 4: el corazón de la unidad. Se mezclan las ocho disfrazadas con
   cuatro que hacen justo lo que parecen, una por clase. Sin esas cuatro el
   alumno saca la regla falsa de que toda frase esconde algo, y eso cuesta lo
   mismo que creerlas todas: es la regla del cuarto truco que no es truco. */
const enfermedadData = (function () {
  const opts = ['📌 Hace lo que parece', '🎭 Hace otra cosa'];
  const der = lenDerechas(4);
  const out = [];
  LEN_DISFRAZ.forEach((d, k) => {
    out.push({ disease: '«' + d.f + '» — ' + d.donde, characteristic: opts[1], opts: opts.slice() });
    if (der[k]) out.push({ disease: '«' + der[k].f + '»', characteristic: opts[0], opts: opts.slice() });
  });
  return out;
})();
let enferIdx=0,enferDone=false;
function showEnfer(){enferDone=false;if(enferIdx>=enfermedadData.length){const el=document.getElementById('enferDisease');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('enferOpts');if(opts)opts.innerHTML='';return;}const d=enfermedadData[enferIdx];const prog=document.getElementById('enferProg');if(prog)prog.textContent=`${enferIdx+1} de ${enfermedadData.length}`;const dis=document.getElementById('enferDisease');if(dis)dis.textContent=d.disease;const opts=document.getElementById('enferOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkEnfer(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbEnfer');if(fbEl)fbEl.classList.remove('show');}
function checkEnfer(opt,btn,d){if(enferDone)return;enferDone=true;document.querySelectorAll('#enferOpts .qz-opt').forEach(b=>{if(b.textContent===d.characteristic)b.classList.add('correct');else if(b===btn&&b.textContent!==d.characteristic)b.classList.add('wrong');});const isOk=opt===d.characteristic;if(isOk){fb('fbEnfer','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('enfer_'+enferIdx)){xpTracker.wgt.add('enfer_'+enferIdx);pts(3);}sfx('ok');}else{fb('fbEnfer','Correcto: '+d.characteristic,false);sfx('no');}setTimeout(()=>{enferIdx++;showEnfer();},1800);}
function resetEnfer(){sfx('click');enferIdx=0;showEnfer();}

// ===================== RETO FINAL =====================
const retoPairs = (function () {
  const fi = (arr, t) => arr.map(a => ({ w: a, t: t }));
  const af = lenDeClase('afirma'), pr = lenDeClase('pregunta'),
        pi = lenDeClase('pide'),   ex = lenDeClase('exclama');
  return [
    { label:['Pide algo del otro','Solo cuenta o suelta'], btnA:'🙋 Pide algo', btnB:'📌 Solo cuenta', colA:'pide', colB:'no',
      words: fi(pr,'pide').concat(fi(pi,'pide'), fi(af,'no'), fi(ex,'no')) },
    { label:['Afirma','Pregunta'], btnA:'📌 Afirma', btnB:'❓ Pregunta', colA:'afirma', colB:'pregunta',
      words: fi(af,'afirma').concat(fi(pr,'pregunta')) },
    { label:['Pide o manda','Exclama'], btnA:'✋ Pide o manda', btnB:'❗ Exclama', colA:'pide', colB:'exclama',
      words: fi(pi,'pide').concat(fi(ex,'exclama')) }
  ];
})();
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
  {s:'La rama que mira qué hacen las palabras es la filosofía del lenguaje.',type:'lenguaje'},
  {s:'Una frase que pide un dato es una pregunta.',type:'pregunta'},
  {s:'Una frase que quiere que hagas algo pide o manda.',type:'pide'},
  {s:'Una frase que suelta lo que siente exclama.',type:'exclama'},
  {s:'Una frase que dice dos cosas a la vez es ambigua.',type:'ambigua'},
  {s:'Decir qué entra y qué no entra en una palabra es definir.',type:'definir'},
  {s:'Una definición que deja entrar lo que no es, es muy ancha.',type:'ancha'},
  {s:'Una definición que deja fuera lo que sí es, es muy angosta.',type:'angosta'},
  {s:'Lo que el que habla quiere lograr es su intención.',type:'intención'},
  {s:'El arte de decir las cosas para que convenzan es la retórica.',type:'retórica'}
];
/* La tabla que el alumno copia en el cuaderno. ⚠️ Estaba escrita con las
   fuentes y las escuelas de la unidad 4: se calcó y no se cambió, así que al
   alumno se le mandaba de tarea el temario del mes pasado. No daba ningún
   error. Es la lección de siempre. */
const classifyTaskDB=[
  {w:'Afirma',gen:'Lo que hace una frase',n:'Cuenta algo',g:'Se le puede contestar «es verdad» o «es mentira»',t:'Ejemplo: el bus pasa cada media hora'},
  {w:'Pregunta',gen:'Lo que hace una frase',n:'Deja un hueco y espera',g:'Espera una respuesta con un dato',t:'Ejemplo: ¿a qué hora empieza el partido?'},
  {w:'Pide o manda',gen:'Lo que hace una frase',n:'Quiere que hagas algo',g:'No pide un dato: pide una acción',t:'Ejemplo: cerrá el portón, por favor'},
  {w:'Exclama',gen:'Lo que hace una frase',n:'Suelta lo que siente',g:'Dice más de quien habla que de la cosa',t:'Ejemplo: ¡qué frío!'},
  {w:'Ambigua',gen:'Una frase',n:'Dice dos cosas a la vez',g:'Está bien escrita y aun así no se sabe cuál',t:'Ejemplo: te espero en el banco'},
  {w:'Definición muy ancha',gen:'Una falla al definir',n:'Deja entrar lo que no es',g:'Se caza buscando algo que entre y no debería',t:'Una silla es algo donde uno se sienta'},
  {w:'Definición muy angosta',gen:'Una falla al definir',n:'Deja fuera lo que sí es',g:'Se caza buscando algo que quede fuera y sí debería',t:'Un ave es un animal que vuela'},
  {w:'Pregunta cargada',gen:'Un truco de la palabra',n:'Trae la respuesta metida dentro',g:'Contestarla ya es aceptar lo que dice',t:'¿Por qué el abono caro rinde más?'},
  {w:'Nombre que juzga',gen:'Un truco de la palabra',n:'Decide antes de mirar la cosa',g:'Se desarma cambiándole el nombre',t:'Llamarle regalo a un préstamo'},
  {w:'Palabra vaga',gen:'Un truco de la palabra',n:'Suena a dato y no se puede medir',g:'Se desarma pidiendo el número',t:'Es de mejor calidad'},
  {w:'Palabra fuerte que sí vale',gen:'Un caso que NO es truco',n:'Nombra con fuerza algo que sí es fuerte',g:'Decirlo flojo sería el error',t:'Se cayó el puente, cuando se cayó'}
];
/* ⚠️ Cada fila lleva sus `opts`, y no es adorno: `genCompleteTask` pinta
   «📝 Opciones: ${item.opts.join(' | ')}», así que una fila sin ese campo
   **revienta la sección entera** del Generador de Tareas —el maestro toca
   «Completa la oración» y no sale nada, sin un solo aviso en la pantalla—.
   Estaba así en las cuatro unidades anteriores de esta ruta y en nueve
   misiones más; se arregló en todas y ahora lo vigila
   `_dev/verifica-bancos-tareas.js`. */
const completeTaskDB=[
  {s:'La rama que mira qué hacen las palabras es la filosofía del ___.',opts:['cuerpo','lenguaje','número'],ans:'lenguaje'},
  {s:'Una frase que cuenta algo y se puede contestar «es verdad» ___.',opts:['pide','exclama','afirma'],ans:'afirma'},
  {s:'Una frase que espera un dato ___.',opts:['pregunta','manda','afirma'],ans:'pregunta'},
  {s:'Una frase que quiere que hagas algo ___.',opts:['exclama','pide','pregunta'],ans:'pide'},
  {s:'Una frase que dice dos cosas a la vez es ___.',opts:['literal','vaga','ambigua'],ans:'ambigua'},
  {s:'Decir qué entra y qué no entra en una palabra es ___.',opts:['definir','opinar','adornar'],ans:'definir'},
  {s:'Una definición que deja entrar lo que no es, es muy ___.',opts:['justa','ancha','angosta'],ans:'ancha'},
  {s:'Una definición que deja fuera lo que sí es, es muy ___.',opts:['ancha','justa','angosta'],ans:'angosta'},
  {s:'Lo que el que habla quiere lograr al decirlo es su ___.',opts:['intención','acento','apellido'],ans:'intención'},
  {s:'El arte de decir las cosas para que convenzan es la ___.',opts:['ortografía','retórica','gramática'],ans:'retórica'}
];
/* ⚠️ Las nueve preguntas de desarrollo. Estaban las de la unidad 4 —creer,
   opinar, saber, las cinco fuentes, el racionalismo—: el alumno que abría la
   tarea se examinaba del mes pasado. Es la misma avería que la prueba de
   Pensamiento Crítico de la unidad 2, que examinaba de la 1. */
const explainQuestions=[
  {q:'¿Qué quiere decir que una frase no solo dice, sino que HACE?',ans:'Que además de contar algo, la frase logra algo: cuenta, pide un dato, pide una acción o suelta lo que siente. Eso es su intención, y es lo que se le pregunta antes de contestarla.'},
  {q:'Escribe una frase de cada clase: que afirme, que pregunte, que pida y que exclame.',ans:'Respuesta abierta. Las cuatro tienen que ser suyas. Se valora que al lado diga la prueba con que lo supo, no solo la clase.'},
  {q:'¿Por qué «¿me pasás la sal?» no es una pregunta de verdad?',ans:'Porque tiene forma de pregunta y hace un pedido. Nadie contesta «sí» y se queda sentado. Lo que lo decide no es la frase: es dónde se dice.'},
  {q:'Escribe una frase que diga dos cosas y la pregunta que la arregla.',ans:'Respuesta abierta. Se valora que las dos lecturas se puedan defender de verdad. Y que la pregunta pida el dato que falta, no que repita la frase.'},
  {q:'¿Cuáles son las dos pruebas de una definición?',ans:'Buscar algo que entre y no debería, que caza la muy ancha. Y buscar algo que quede fuera y sí debería entrar, que caza la muy angosta. Si aguanta las dos, sirve.'},
  {q:'¿Por qué elegir una palabra suave en vez de una fuerte NO es mentir?',ans:'Porque las dos nombran la misma cosa. «De segunda mano» y «usada» son la misma bolsa. Lo que hace la palabra es apuntar. El trabajo es darse cuenta hacia dónde apunta y decidir uno mismo.'},
  {q:'¿Cómo se desarma una pregunta que ya trae la respuesta dentro?',ans:'Contestando la de atrás primero. A «¿por qué el abono caro rinde más?» se le pregunta antes si rinde más. Si no, contestarla ya es aceptar lo que no se discutió.'},
  {q:'¿Por qué no toda palabra fuerte es una trampa?',ans:'Porque hay cosas que de verdad son fuertes, y decirlas flojo sería el error. «Se cayó el puente», cuando el puente se cayó. Desconfiar de todas las palabras cuesta lo mismo que creerlas todas.'},
  {q:'Copia un anuncio de la radio o de la pulpería y marca una palabra que no se pueda comprobar.',ans:'Respuesta abierta. Se valora que la palabra marcada suene a dato y no se pueda medir. Y que escriba QUÉ le pediría a quien lo dijo: un número o un ejemplo.'}
];
let ansVisible=false;
function genTask(){sfx('click');const type=document.getElementById('tgType').value;const count=parseInt(document.getElementById('tgCount').value);ansVisible=false;const out=document.getElementById('tgOut');out.innerHTML='';if(type==='identify')genIdentifyTask(out,count);else if(type==='classify')genClassifyTask(out,count);else if(type==='complete')genCompleteTask(out,count);else if(type==='explain')genExplainTask(out,count);fin('s-tareas');}
function _instrBlock(out,title,lines){const ib=document.createElement('div');ib.className='tg-instruction-block';ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join('');out.appendChild(ib);}
function genIdentifyTask(out,count){_instrBlock(out,'Instrucción',['Copia en tu cuaderno; subraya, colorea o encierra el concepto indicado en cada oración. Escribe al lado de qué concepto de la unidad se trata.','<strong>Ejemplo:</strong> Lo que el que habla quiere lograr es su intención. → <span style="color:var(--jade);font-weight:700;">intención</span>']);_pick(identifyTaskDB,Math.min(count,identifyTaskDB.length)).forEach((item,i)=>{const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.type}</div></div>`;out.appendChild(div);});}
function genClassifyTask(out,count){_instrBlock(out,'Instrucción',['Copia la siguiente tabla en tu cuaderno. Para cada uno, completa qué es y en qué se reconoce. Después, qué lo distingue y un ejemplo.']);const items=_pick(classifyTaskDB,Math.min(count,classifyTaskDB.length));const wrap=document.createElement('div');wrap.style.overflowX='auto';const th=(t,extra='')=>`<th style="padding:0.3rem 0.4rem;border:1px solid var(--border);font-size:0.72rem;text-align:center;${extra}">${t}</th>`;let html=`<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:520px;"><thead><tr style="background:var(--pri-gl);">${th('Qué','text-align:left;')}${th('Qué es')}${th('En qué se reconoce')}${th('Qué lo distingue')}${th('Ejemplo')}</tr></thead><tbody>`;items.forEach(it=>{html+=`<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td>`+Array(4).fill(`<td style="padding:0.4rem;border:1px solid var(--border);min-width:50px;"></td>`).join('')+'</tr>';});html+='</tbody></table>';wrap.innerHTML=html;out.appendChild(wrap);const ans=document.createElement('div');ans.className='tg-answer';ans.style.marginTop='0.8rem';ans.innerHTML='<strong>✅ Respuestas:</strong><br>'+items.map(it=>`<strong>${it.w}:</strong> Qué es: ${it.gen} | Se reconoce: ${it.n} | Lo distingue: ${it.g} | Ejemplo: ${it.t}`).join('<br>');out.appendChild(ans);}
function genCompleteTask(out,count){_instrBlock(out,'Instrucción',['Copia y resuelve en tu cuaderno. Cada oración tiene un espacio ___. Elige y escribe la opción correcta.']);const pool=_shuffle([...completeTaskDB]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';const sent=item.s.replace('___','<span class="tg-blank" style="min-width:90px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${sent}</strong><div style="margin-top:0.4rem;font-size:0.82rem;color:var(--gray);">📝 Opciones: <strong>${item.opts.join(' | ')}</strong></div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function genExplainTask(out,count){_instrBlock(out,'Instrucción',['Copia las siguientes preguntas en tu cuaderno y responde cada una de forma clara y completa.']);const pool=_shuffle([...explainQuestions]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.3rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function toggleAns(){ansVisible=!ansVisible;document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none');sfx('click');}

// ===================== SOPA DE LETRAS =====================
/* ⚠️ Las celdas las coloca `node _dev/verifica-sopas.js --repara`, no se
   escriben a mano: una palabra que no esté de verdad en la rejilla deja la
   sección IMPOSIBLE de completar, y eso no da ningún error. */
/* ⚠️ Las celdas las coloca `node _dev/verifica-sopas.js --repara`, no se
   escriben a mano: una palabra que no esté de verdad en la rejilla deja la
   sección IMPOSIBLE de completar, y eso no da ningún error.
   ⚠️ Y la tercera rejilla es de 13: RACIONALISMO son doce letras y en una de
   12 solo cabría empezando en la primera casilla. Crece la rejilla, nunca se
   recorta la palabra. */
const sopaSets=[
    {
        size: 12,
        grid: [
            ['J', 'E', 'T', 'P', 'T', 'N', 'S', 'Z', 'U', 'K', 'V', 'F'],
            ['L', 'X', 'D', 'R', 'R', 'L', 'D', 'A', 'F', 'G', 'B', 'K'],
            ['F', 'V', 'O', 'J', 'H', 'U', 'U', 'U', 'B', 'V', 'I', 'R'],
            ['H', 'V', 'R', 'P', 'Q', 'C', 'E', 'F', 'D', 'E', 'H', 'C'],
            ['T', 'F', 'D', 'M', 'I', 'N', 'I', 'B', 'I', 'A', 'R', 'H'],
            ['F', 'I', 'B', 'R', 'T', 'N', 'F', 'Y', 'A', 'E', 'B', 'A'],
            ['F', 'Y', 'Q', 'E', 'B', 'A', 'A', 'D', 'E', 'Z', 'K', 'U'],
            ['J', 'O', 'H', 'D', 'W', 'N', 'Z', 'R', 'W', 'O', 'B', 'H'],
            ['N', 'O', 'Y', 'M', 'Z', 'U', 'B', 'G', 'L', 'G', 'A', 'N'],
            ['L', 'X', 'U', 'W', 'L', 'L', 'Q', 'Q', 'T', 'U', 'P', 'D'],
            ['C', 'A', 'L', 'O', 'O', 'Q', 'K', 'G', 'O', 'N', 'G', 'Y'],
            ['M', 'S', 'H', 'T', 'J', 'S', 'Z', 'I', 'E', 'G', 'O', 'Z'],
        ],
        words: [
            { w: 'SABER', cells: [[0, 6], [1, 7], [2, 8], [3, 9], [4, 10]] },
            { w: 'CREER', cells: [[3, 11], [4, 10], [5, 9], [6, 8], [7, 7]] },
            { w: 'OPINAR', cells: [[2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7]] },
            { w: 'FUENTE', cells: [[1, 8], [2, 7], [3, 6], [4, 5], [5, 4], [6, 3]] },
            { w: 'PRUEBA', cells: [[0, 3], [1, 4], [2, 5], [3, 6], [4, 7], [5, 8]] },
            { w: 'DUDA', cells: [[1, 6], [2, 7], [3, 8], [4, 9]] },
        ]
    },
    {
        size: 12,
        grid: [
            ['L', 'S', 'C', 'W', 'F', 'U', 'X', 'Z', 'K', 'K', 'L', 'L'],
            ['A', 'I', 'R', 'O', 'M', 'E', 'M', 'I', 'L', 'H', 'D', 'C'],
            ['M', 'S', 'O', 'C', 'M', 'T', 'C', 'A', 'B', 'Z', 'I', 'R'],
            ['B', 'E', 'Q', 'O', 'H', 'P', 'H', 'B', 'S', 'L', 'Y', 'G'],
            ['X', 'T', 'V', 'R', 'G', 'Z', 'R', 'O', 'E', 'H', 'C', 'B'],
            ['O', 'O', 'A', 'K', 'J', 'Q', 'D', 'O', 'Q', 'S', 'J', 'K'],
            ['T', 'P', 'D', 'K', 'N', 'I', 'Q', 'G', 'B', 'C', 'H', 'O'],
            ['D', 'I', 'I', 'D', 'T', 'F', 'I', 'V', 'U', 'A', 'U', 'N'],
            ['F', 'H', 'D', 'N', 'H', 'A', 'Q', 'B', 'U', 'H', 'R', 'I'],
            ['B', 'I', 'E', 'U', 'T', 'X', 'V', 'Q', 'R', 'H', 'W', 'B'],
            ['E', 'S', 'M', 'S', 'V', 'Q', 'T', 'H', 'P', 'E', 'Q', 'L'],
            ['Z', 'D', 'F', 'F', 'Z', 'L', 'L', 'T', 'D', 'H', 'R', 'V'],
        ],
        words: [
            { w: 'HIPOTESIS', cells: [[8, 1], [7, 1], [6, 1], [5, 1], [4, 1], [3, 1], [2, 1], [1, 1], [0, 1]] },
            { w: 'COMPROBAR', cells: [[0, 2], [1, 3], [2, 4], [3, 5], [4, 6], [5, 7], [6, 8], [7, 9], [8, 10]] },
            { w: 'SENTIDOS', cells: [[10, 1], [9, 2], [8, 3], [7, 4], [6, 5], [5, 6], [4, 7], [3, 8]] },
            { w: 'MEMORIA', cells: [[1, 6], [1, 5], [1, 4], [1, 3], [1, 2], [1, 1], [1, 0]] },
            { w: 'MEDIDA', cells: [[10, 2], [9, 2], [8, 2], [7, 2], [6, 2], [5, 2]] },
        ]
    },
    {
        size: 13,
        grid: [
            ['U', 'O', 'O', 'F', 'C', 'W', 'U', 'F', 'N', 'L', 'Y', 'L', 'D'],
            ['Y', 'Q', 'H', 'Z', 'T', 'O', 'L', 'O', 'C', 'K', 'E', 'Y', 'E'],
            ['L', 'J', 'E', 'I', 'U', 'M', 'S', 'Q', 'P', 'V', 'X', 'O', 'S'],
            ['Y', 'E', 'M', 'V', 'Q', 'S', 'S', 'J', 'E', 'L', 'J', 'Q', 'C'],
            ['E', 'O', 'P', 'E', 'M', 'I', 'O', 'W', 'H', 'L', 'V', 'D', 'A'],
            ['W', 'T', 'I', 'G', 'Q', 'L', 'S', 'P', 'Z', 'Y', 'W', 'V', 'R'],
            ['S', 'Q', 'R', 'O', 'M', 'A', 'C', 'F', 'S', 'U', 'V', 'K', 'T'],
            ['P', 'V', 'I', 'I', 'L', 'N', 'O', 'A', 'T', 'L', 'R', 'W', 'E'],
            ['I', 'W', 'S', 'G', 'Q', 'O', 'Y', 'N', 'A', 'R', 'A', 'E', 'S'],
            ['U', 'K', 'M', 'X', 'N', 'I', 'G', 'H', 'G', 'V', 'Z', 'T', 'R'],
            ['V', 'M', 'O', 'A', 'C', 'C', 'G', 'G', 'X', 'N', 'O', 'U', 'D'],
            ['Y', 'I', 'Y', 'Z', 'N', 'A', 'H', 'O', 'C', 'F', 'N', 'P', 'U'],
            ['X', 'M', 'Y', 'Z', 'C', 'R', 'H', 'C', 'X', 'W', 'J', 'I', 'C'],
        ],
        words: [
            { w: 'RACIONALISMO', cells: [[12, 5], [11, 5], [10, 5], [9, 5], [8, 5], [7, 5], [6, 5], [5, 5], [4, 5], [3, 5], [2, 5], [1, 5]] },
            { w: 'EMPIRISMO', cells: [[2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2], [9, 2], [10, 2]] },
            { w: 'DESCARTES', cells: [[0, 12], [1, 12], [2, 12], [3, 12], [4, 12], [5, 12], [6, 12], [7, 12], [8, 12]] },
            { w: 'LOCKE', cells: [[1, 6], [1, 7], [1, 8], [1, 9], [1, 10]] },
            { w: 'RAZON', cells: [[7, 10], [8, 10], [9, 10], [10, 10], [11, 10]] },
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
  {q:'Una frase se juzga solo por su forma, no por lo que hace.',a:false},
  {q:'«¿Me pasás la sal?» es un pedido aunque tenga forma de pregunta.',a:true},
  {q:'«Te espero en el banco» puede querer decir dos cosas.',a:true},
  {q:'Una frase ambigua está mal escrita.',a:false},
  {q:'Preguntar es lo que arregla una frase ambigua.',a:true},
  {q:'«Un ave es un animal que vuela» es una definición muy angosta.',a:true},
  {q:'«Una silla es algo donde uno se sienta» es una definición muy ancha.',a:true},
  {q:'Una definición justa aguanta las dos pruebas.',a:true},
  {q:'«De segunda mano» y «usada» nombran cosas distintas.',a:false},
  {q:'Elegir una palabra en vez de otra es siempre mentir.',a:false},
  {q:'«¿Por qué el abono caro rinde más?» ya da por hecho que rinde más.',a:true},
  {q:'A una palabra que no se puede comprobar se le pide un número o un ejemplo.',a:true},
  {q:'Toda palabra fuerte es una trampa.',a:false},
  {q:'La retórica es el arte de decir las cosas para que convenzan.',a:true},
  {q:'De un pensador, esta misión escribe la fecha en que nació.',a:false}
];
const evalMCBank=[
  {q:'¿De qué se ocupa la filosofía del lenguaje?',o:['De medir el tiempo','De contar dinero','De qué hacen las palabras con las ideas','De la letra bonita'],a:2},
  {q:'«Cerrá el portón, por favor». ¿Qué hace la frase?',o:['Afirma','Pide','Pregunta','Exclama'],a:1},
  {q:'«¡Ay, me quemé!». ¿Qué hace la frase?',o:['Pide un dato','Afirma un número','Manda','Suelta lo que siente'],a:3},
  {q:'¿Cuál es la prueba de una frase que afirma?',o:['Que sea larga','Que se pueda contestar «es verdad» o «es mentira»','Que lleve signos','Que la diga un adulto'],a:1},
  {q:'«Vendí la vaca de mi tío» es ambigua porque…',o:['tiene una falta','es muy corta','no se sabe de quién era ni a quién','no lleva tilde'],a:2},
  {q:'¿Qué arregla una frase ambigua?',o:['Gritarla','Preguntar cuál de las dos','Escribirla de nuevo igual','Cambiar de tema'],a:1},
  {q:'Una definición que deja entrar lo que no es, es…',o:['muy angosta','muy ancha','justa','imposible'],a:1},
  {q:'Una definición que deja fuera lo que sí es, es…',o:['muy ancha','justa','muy angosta','bonita'],a:2},
  {q:'«Lo invirtió» y «lo gastó» hablan del mismo dinero. La diferencia es…',o:['hacia dónde apunta la palabra','la cantidad','el dueño','la fecha'],a:0},
  {q:'¿Qué hace la pregunta «¿por qué el abono caro rinde más?»',o:['Da por hecho lo que no se discutió','Pide un dato limpio','Manda comprar','Exclama'],a:0},
  {q:'¿Cómo se desarma el nombre que ya juzga?',o:['Repitiéndolo','Aceptándolo','Cambiándole el nombre y volviendo a mirar','Escribiéndolo grande'],a:2},
  {q:'«Es más natural» es una palabra que…',o:['se mide con balanza','está prohibida','es un número','no se puede comprobar así'],a:3},
  {q:'De los cuatro casos de la unidad, ¿cuántos NO son trampa?',o:['ninguno','tres','todos','uno'],a:3},
  {q:'¿Qué enseña Bertrand Russell, según esta misión?',o:['A pedir que la frase se aclare antes de discutirla','A medir la luz','A contar votos','A cantar'],a:0},
  {q:'¿Qué enseña Ortega y Gasset, según esta misión?',o:['A preguntar qué quiere decir el otro','A hablar más rápido','A escribir sin tildes','A no preguntar'],a:0}
];
const evalCPBank=[
  {q:'La rama que mira qué hacen las palabras es la filosofía del ___.',a:'lenguaje'},
  {q:'Una frase que pide un dato es una ___.',a:'pregunta'},
  {q:'Una frase que quiere que hagas algo ___ o manda.',a:'pide'},
  {q:'Una frase que suelta lo que siente ___.',a:'exclama'},
  {q:'Una frase que dice dos cosas a la vez es ___.',a:'ambigua'},
  {q:'Decir qué entra y qué no entra en una palabra es ___.',a:'definir'},
  {q:'Una definición que deja entrar lo que no es, es muy ___.',a:'ancha'},
  {q:'Una definición que deja fuera lo que sí es, es muy ___.',a:'angosta'},
  {q:'Lo que el que habla quiere lograr al decirlo es su ___.',a:'intención'},
  {q:'El arte de decir las cosas para que convenzan es la ___.',a:'retórica'},
  {q:'Lo que la frase dice, sin lo que insinúa, es su sentido ___.',a:'literal'},
  {q:'A la palabra que no se puede comprobar se le pide un ___.',a:'número'},
  {q:'Lo que una palabra le hace entender al que la oye es su ___.',a:'significado'},
  {q:'De la filosofía analítica viene el trabajo de ___ las frases.',a:'aclarar'},
  {q:'El arte de interpretar lo que el otro quiso decir es la ___.',a:'hermenéutica'}
];
const evalPRBank=[
  {term:'Afirma',def:'Dice que algo es así; se contesta «es verdad» o «es mentira».'},
  {term:'Pregunta',def:'Deja un hueco y espera que alguien lo llene con un dato.'},
  {term:'Pide o manda',def:'No quiere un dato: quiere que el otro haga algo.'},
  {term:'Exclama',def:'Sale de golpe y dice cómo se siente el que habla.'},
  {term:'Ambiguo',def:'Que quiere decir dos cosas, y no se sabe cuál.'},
  {term:'Definición muy ancha',def:'Deja entrar cosas que no son.'},
  {term:'Definición muy angosta',def:'Deja fuera cosas que sí son.'},
  {term:'Intención',def:'Lo que el que habla quiere lograr al decirlo.'},
  {term:'Retórica',def:'El arte de decir las cosas para que convenzan.'},
  {term:'Literal',def:'Lo que la frase dice, sin lo que insinúa.'},
  {term:'Pregunta cargada',def:'Da por hecho lo que todavía no se discutió.'},
  {term:'Palabra vaga',def:'Suena a dato y no dice nada que se pueda medir.'},
  {term:'Bertrand Russell',def:'Mostró que una frase puede estar bien escrita y no decir nada claro.'},
  {term:'Ortega y Gasset',def:'Dijo que cada palabra arrastra la vida de quien la usa.'},
  {term:'Hermenéutica',def:'El arte de interpretar lo que el otro quiso decir.'}
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

function genEval(){sfx('click');_evalFormaSelector(); const _selF = document.getElementById('evalFormaSel'); if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10))); const cf = evalFormNum; const rng = _evalRng(cf); window._currentEvalForm=cf;evalFormNum = (evalFormNum % EVAL_FORMAS) + 1; _evalFormaSelector();saveProgress();document.getElementById('eval-screen-title').textContent=`🎓 Evaluación Final · Forma ${cf} · Palabras que piensan`;evalAnsVisible=false;const out=document.getElementById('evalOut');out.innerHTML='';const bar=document.createElement('div');bar.className='eval-score-bar';bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje · 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25 pts</span><span class="eval-score-pill esp-tf">V/F 25 pts</span><span class="eval-score-pill esp-mc">Selección 25 pts</span><span class="eval-score-pill esp-pr">Pareados 25 pts</span></div>`;out.appendChild(bar);const cpItems=_pickF(evalCPBank,5, rng);const s1=document.createElement('div');s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';cpItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='cp';d.dataset.evalIndex=i;const qHtml=item.q.replace('___',`<input class="eval-cp-input" type="text" data-cp="${i}" autocomplete="off">`);d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbCp${i}" aria-live="polite"></div>`;s1.appendChild(d);});out.appendChild(s1);const tfItems=_pickF(evalTFBank,5, rng);const s2=document.createElement('div');s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';tfItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='tf';d.dataset.evalIndex=i;d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="true"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="false"> Falso</label></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbTf${i}" aria-live="polite"></div>`;s2.appendChild(d);});out.appendChild(s2);const mcItems=_pickF(evalMCBank,5, rng);const s3=document.createElement('div');s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';mcItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='mc';d.dataset.evalIndex=i;const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join('');d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbMc${i}" aria-live="polite"></div>`;s3.appendChild(d);});out.appendChild(s3);const prItems=_pickF(evalPRBank,5, rng);const shuffledDefs=_shuffleF(prItems, rng);const letters=['A','B','C','D','E'];const s4=document.createElement('div');s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';const matchCard=document.createElement('div');matchCard.className='eval-item';let colLeft='<div class="eval-match-col"><h4>📌 Términos</h4>';prItems.forEach((item,i)=>{colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> <select class="eval-match-select" data-pr="${i}" aria-label="Respuesta pareada ${i+16}"><option value="">—</option>${letters.map(l=>`<option value="${l}">${l}</option>`).join('')}</select> ${item.term}</div>`;});colLeft+='</div>';let colRight='<div class="eval-match-col"><h4>🔑 Definiciones</h4>';shuffledDefs.forEach((item,i)=>{colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`;});colRight+='</div>';const ansKey=prItems.map((item,i)=>{const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)];return`${i+16}→${letter}`;}).join(' · ');matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div><div class="eval-item-feedback" id="evalFbPr" aria-live="polite"></div>`;s4.appendChild(matchCard);out.appendChild(s4);window._evalPrintData={tf:tfItems,mc:mcItems,cp:cpItems,pr:{terms:prItems,shuffledDefs,letters}};const autoPanel=document.createElement('div');autoPanel.id='evalAutoResult';autoPanel.className='eval-auto-result';autoPanel.innerHTML='<strong>🧮 Evaluación interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato original sin respuestas digitadas.';out.appendChild(autoPanel);fin('s-evaluacion');}
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación Palabras que piensan · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.12rem 0.4rem;margin:0.22rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #784a6d;background:#f6eef4;color:#784a6d;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#784a6d;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #784a6d;height:12px;}.obt-pct{white-space:nowrap;}.qn{font-weight:700;min-width:22px;flex-shrink:0;}.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:40px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.18rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.14rem 0.35rem;margin-bottom:0.1rem;break-inside:avoid;page-break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.3;display:flex;gap:0.28rem;margin-bottom:0.07rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.1rem 0.5rem;}.mc-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:0.04rem 0.15rem;margin-left:0.8rem;}.mc-opt{font-size:9pt;display:flex;align-items:center;gap:0.15rem;}.mc-opt input{width:10px;height:10px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{margin-top:0.1rem;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.08rem 0.4rem;margin-top:0.08rem;}.pr-head{font-size:9pt;font-weight:700;color:#555;margin-bottom:0.1rem;}.pr-item{font-size:10.5pt;padding:0.1rem 0.28rem;background:#f6eef4;border-radius:3px;margin-bottom:0.07rem;display:flex;align-items:center;gap:0.2rem;line-height:1.2;break-inside:avoid;page-break-inside:avoid;}.pr-num{font-weight:700;color:#784a6d;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.22rem;padding:0.15rem 0;page-break-before:avoid;break-before:avoid;color:#784a6d;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #784a6d;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#555;}.pa{color:#007a00;font-weight:600;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · Palabras que piensan · Educación Básica · Filosofía</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Evaluación Final · Palabras que piensan · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u</div></div><div class="p-grid">${pR}</div>
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
  {txt:'A Marlon le mandaron un mensaje: «Te espero en el banco a las tres». Él fue al banco de la plaza. El otro lo esperó en la banca del parque.<br>\nLos dos se fueron a las cuatro sin verse. El trámite se pasó para otro día.'},
  {txt:'En la pulpería le dijeron a doña Chepa que ese jabón «es de mejor calidad». Pagó el doble. Lava igual que el otro. Nadie le mintió: nadie le dijo mejor en qué.'},
  {txt:'A Wilmer le preguntaron: «¿Por qué el abono caro rinde más?». Él contestó que por los minerales. Compró ocho sacos. La milpa salió igual que la del vecino, que usó el de siempre.'},
  {txt:'En el papel decía «regalo de la cooperativa». La mamá de Selvin firmó tranquila. A los seis meses le pidieron el dinero: era un préstamo, y el nombre no lo decía.'},
  {txt:'El maestro puso en el pizarrón: «Un ave es un animal que vuela». Kenia levantó la mano y preguntó por la gallina. La clase se detuvo diez minutos, y la definición se arregló.'}
];
const critCaseQuestions=[
  '1. En el caso, ¿qué HACE la frase: afirma, pregunta, pide o exclama?',
  '2. ¿Dónde estuvo el problema: en la palabra, en el doble sentido o en la definición?',
  '3. ¿A quién le cuesta, y qué pierde esa persona?',
  '4. Escribí la pregunta que lo habría parado, en una línea.'
];
const critCaseGuides=[
  'Se valora que NOMBRE lo que hace la frase y dé la señal. Si espera un dato, pregunta. Si quiere una acción, pide. Si se contesta «es verdad» o «es mentira», afirma.',
  'Las tres averías de esta unidad son el doble sentido, la palabra que no se puede comprobar y la definición mal hecha. Se califica que nombre UNA y diga por qué esa.',
  'Se califica que le ponga nombre al daño concreto. Una tarde perdida, el doble del precio, ocho sacos, un préstamo firmado como regalo. No la indignación.',
  'Tiene que ser una pregunta que se pueda hacer en voz alta. «¿En cuál de los dos bancos?», «¿mejor en qué, y cuánto?», «¿rinde más?», «¿esto se devuelve?». «Investigar más» no vale: no dice qué hacer.'
];
const critErrorBank=[
  {txt:'"Si la frase está bien escrita, quiere decir una sola cosa."',
   g1:'Las cuatro frases de la unidad están bien escritas y dicen dos cosas cada una.',
   g2:'Lo que arregla el doble sentido no es la ortografía: es preguntar cuál de las dos.'},
  {txt:'"Elegir una palabra suave en vez de una fuerte es mentir."',
   g1:'No: las dos nombran la misma cosa. «De segunda mano» y «usada» son la misma bolsa.',
   g2:'Lo que hace es apuntar. El trabajo es darse cuenta hacia dónde, y decidir uno mismo.'},
  {txt:'"Toda palabra fuerte es una trampa, así que hay que desconfiar de todas."',
   g1:'De las cuatro de la unidad, una NO es trampa: «se cayó el puente» cuando el puente se cayó.',
   g2:'Desconfiar de todas las palabras cuesta lo mismo que creerlas todas. Es la misma lección que el mensaje sin señales.'},
  {txt:'"Una definición larga es mejor que una corta."',
   g1:'El largo no dice nada. Lo que se mide es qué entra y qué queda fuera.',
   g2:'Se le pasan las dos pruebas: buscar lo que entra y no debería, y lo que queda fuera y sí debería.'},
  {txt:'"Contestar una pregunta siempre es lo correcto."',
   g1:'No si la pregunta ya trae la respuesta metida dentro.',
   g2:'«¿Por qué el abono caro rinde más?» se contesta al revés: primero, ¿rinde más?'},
  {txt:'"La intención del que habla no se puede saber, así que no vale preguntarla."',
   g1:'No se adivina: se pregunta. Y muchas veces la frase misma la muestra.',
   g2:'Una frase que pide una acción tiene una intención distinta de una que pide un dato, y eso sí se ve.'}
];
const critDecisionBank=[
  {txt:'Te llega «Te espero en el banco a las tres». ¿Vas y ves, o preguntás en cuál de los dos?'},
  {txt:'En la pulpería te dicen que un producto «es de mejor calidad». ¿Lo pagás, o preguntás mejor en qué y cuánto?'},
  {txt:'Alguien te pregunta por qué algo es mejor, y vos no sabés si lo es. ¿Contestás, o contestás la de atrás primero?'},
  {txt:'Un papel dice «regalo» y hay que firmarlo. ¿Firmás, o preguntás si eso se devuelve?'},
  {txt:'En clase te dan una definición y se te ocurre un caso que no encaja. ¿Te lo callás, o levantás la mano?'}
];
const critDecisionGuide='Primero se pregunta qué HACE la frase. Si dice dos cosas, se pide la que es. Si trae una palabra que no se puede comprobar, se pide el número. Y si la pregunta ya trae la respuesta dentro, se contesta la de atrás primero.';
const critCompareBank=[
  {a:'«¿Me pasás la sal?»',b:'«¿Cuánto cuesta la sal?»',
   ga:'Pide una acción: quiere que le pasen la sal.',
   gb:'Pide un dato: quiere un número.',
   gr:'Las dos tienen forma de pregunta y no hacen lo mismo. La forma no dice lo que la frase hace.'},
  {a:'«La bolsa es de segunda mano».',b:'«La bolsa es usada».',
   ga:'Nombra la bolsa y suaviza.',
   gb:'Nombra la misma bolsa y no suaviza.',
   gr:'La bolsa es la misma. Lo que cambia es hacia dónde apunta la palabra, y eso no es mentir: es elegir.'},
  {a:'«Un ave es un animal que vuela».',b:'«Una silla es algo donde uno se sienta».',
   ga:'Es muy angosta: deja fuera a la gallina.',
   gb:'Es muy ancha: deja entrar una piedra.',
   gr:'Las dos están mal y por razones contrarias. Por eso se le pasan las dos pruebas a toda definición.'},
  {a:'«¿Por qué el abono caro rinde más?»',b:'«¿El abono caro rinde más?»',
   ga:'Da por hecho que rinde más y solo deja discutir el porqué.',
   gb:'Deja la pregunta abierta: se puede contestar que no.',
   gr:'Una sola palabra de diferencia. La primera ya ganó la discusión antes de empezarla.'}
];
const critCauseBank=[
  {cause:'La forma de la frase no dice lo que la frase hace.',guide:'Por eso «¿me pasás la sal?» es un pedido. Nadie contesta «sí» y se queda sentado.'},
  {cause:'La palabra «banco» nombra dos cosas distintas.',guide:'Por eso Marlon y el otro se esperaron en dos sitios. Lo arreglaba una pregunta de cuatro palabras.'},
  {cause:'«De mejor calidad» no dice mejor en qué ni cuánto.',guide:'Por eso doña Chepa pagó el doble por un jabón que lava igual. A una palabra vaga se le pide el número.'},
  {cause:'Una pregunta puede traer la respuesta metida dentro.',guide:'Por eso a Wilmer le quedó aceptado que el abono caro rinde más, y compró ocho sacos.'},
  {cause:'Quien pone el nombre decide antes de que se mire la cosa.',guide:'Por eso «regalo» se firmó tranquilo y a los seis meses había que devolverlo.'}
];
const critEffectBank=[
  {effect:'Dos personas se esperan una hora en dos sitios distintos.',guide:'Porque la frase decía dos cosas y cada uno eligió una sin darse cuenta.'},
  {effect:'Alguien paga el doble por algo que funciona igual.',guide:'Porque la palabra que lo convenció no se podía comprobar, y nadie pidió el número.'},
  {effect:'Una mamá firma un préstamo creyendo que no debe nada.',guide:'Porque el papel le puso el nombre «regalo», y el nombre decidió antes de leer.'},
  {effect:'La clase se detiene diez minutos y la definición mejora.',guide:'Porque alguien buscó lo que quedaba fuera y sí debería entrar: la gallina.'},
  {effect:'Un muchacho deja de creerle a toda palabra fuerte.',guide:'Porque dio por trampa las cuatro, y una no lo era. Desconfiar de todo cuesta lo mismo que creerlo todo.'}
];
function genEvalCrit(){
  sfx('click');
  _injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });
  const _sC = document.getElementById('evalCritFormaSel');
  if (_sC && parseInt(_sC.value, 10)) evalCritFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sC.value, 10)));
  const cf=evalCritFormNum;window._currentEvalCritForm=cf;const rngC = _evalRng(200000 + cf);evalCritFormNum=(evalCritFormNum%EVAL_FORMAS)+1;_injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });saveProgress();
  document.getElementById('evalcrit-screen-title').textContent=`🧠 Pensamiento Crítico · Forma ${cf} · Palabras que piensan`;
  evalCritAnsVisible=false;
  const out=document.getElementById('evalCritOut');out.innerHTML='';
  const kase=_pickF(critCaseBank,1,rngC)[0];
  const s1=document.createElement('div');
  s1.innerHTML=`<div class="eval-section-title">I. Caso de análisis: un dato de todos los días <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${kase.txt}</div>${critCaseQuestions.map((q,i)=>`<div class="crit-q-block"><div class="crit-q-label">${q}</div><textarea class="crit-textarea" rows="2" aria-label="${q}"></textarea><div class="crit-pauta">${critCaseGuides[i]}</div></div>`).join('')}<div class="crit-selfscore"><label for="critScore0">Obtenido:</label><input type="number" id="critScore0" class="crit-score-input" data-score="0" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s1);
  const err=_pickF(critErrorBank,1,rngC)[0];
  const s2=document.createElement('div');
  s2.innerHTML=`<div class="eval-section-title">II. Corrige el error <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${err.txt}</div><p style="font-size:0.85rem;margin-bottom:0.5rem;">Identifica <strong>dos errores</strong> y corrígelos con tus propias palabras:</p><div class="crit-q-block"><div class="crit-q-label">Error 1 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 1 y su corrección"></textarea><div class="crit-pauta">${err.g1}</div></div><div class="crit-q-block"><div class="crit-q-label">Error 2 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 2 y su corrección"></textarea><div class="crit-pauta">${err.g2}</div></div><div class="crit-selfscore"><label for="critScore1">Obtenido:</label><input type="number" id="critScore1" class="crit-score-input" data-score="1" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s2);
  const dec=_pickF(critDecisionBank,1,rngC)[0];
  const s3=document.createElement('div');
  s3.innerHTML=`<div class="eval-section-title">III. Toma de decisiones: preguntar de dónde salió <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${dec}</div><div class="crit-q-block"><div class="crit-q-label">¿Qué harías? Explica por qué, diciendo de qué fuente venía el dato y con qué lo comprobarías.</div><textarea class="crit-textarea" rows="4" aria-label="Recomendaciones y su justificación"></textarea><div class="crit-pauta">${critDecisionGuide}</div></div><div class="crit-selfscore"><label for="critScore2">Obtenido:</label><input type="number" id="critScore2" class="crit-score-input" data-score="2" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s3);
  const cmp=_pickF(critCompareBank,1,rngC)[0];
  const s4=document.createElement('div');
  s4.innerHTML=`<div class="eval-section-title">IV. Comparación razonada <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-compare-grid"><div class="crit-compare-box"><h5>Caso A</h5>${cmp.a}</div><div class="crit-compare-box"><h5>Caso B</h5>${cmp.b}</div></div><div class="crit-q-block"><div class="crit-q-label">1. ¿Qué es cada caso: un saber, una creencia o una opinión? 2. ¿En qué se reconoce cada uno? 3. ¿Por qué no son lo mismo?</div><textarea class="crit-textarea" rows="4" aria-label="Comparación razonada de los casos A y B"></textarea><div class="crit-pauta">Caso A: ${cmp.ga} · Caso B: ${cmp.gb} · ${cmp.gr}</div></div><div class="crit-selfscore"><label for="critScore3">Obtenido:</label><input type="number" id="critScore3" class="crit-score-input" data-score="3" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
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
  let s1=`<div class="sec-title"><span>I. Caso de análisis: un dato de todos los días</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.kase.txt}</p>`;
  critCaseQuestions.forEach(q=>{s1+=`<p class="crit-print-q">${q}</p>${lines(1)}`;});
  let s2=`<div class="sec-title"><span>II. Corrige el error</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.err.txt}</p><p class="crit-print-q">Identifica dos errores y corrígelos con tus propias palabras:</p><p class="crit-print-q"><strong>Error 1:</strong></p>${lines(1)}<p class="crit-print-q"><strong>Error 2:</strong></p>${lines(1)}`;
  let s3=`<div class="sec-title"><span>III. Toma de decisiones: preguntar de dónde salió</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.dec}</p><p class="crit-print-q">¿Qué harías? Explica por qué, diciendo de qué fuente venía el dato y con qué lo comprobarías.</p>${lines(2)}`;
  let s4=`<div class="sec-title"><span>IV. Comparación razonada</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><div class="crit-compare-print-grid"><div class="crit-compare-print-box"><strong>Caso A:</strong> ${d.cmp.a}</div><div class="crit-compare-print-box"><strong>Caso B:</strong> ${d.cmp.b}</div></div><p class="crit-print-q">1. ¿Qué es cada caso: un saber, una creencia o una opinión? 2. ¿En qué se reconoce cada uno? 3. ¿Por qué no son lo mismo?</p>${lines(2)}`;
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
  const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Pensamiento Crítico Palabras que piensan · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.1rem 0.4rem;margin:0.2rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #784a6d;background:#f6eef4;color:#784a6d;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#784a6d;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #784a6d;height:12px;}.obt-pct{white-space:nowrap;}.crit-print-scenario{font-size:10.5pt;background:#f6eef4;border-left:3px solid #784a6d;padding:0.2rem 0.5rem;margin:0.1rem 0 0.2rem;line-height:1.3;}.crit-print-q{font-size:10pt;font-weight:600;margin:0.15rem 0 0.08rem;line-height:1.25;}.ln{border-bottom:1px solid #111;min-height:12px;margin-bottom:2px;}.crit-compare-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin:0.15rem 0;}.crit-compare-print-box{font-size:9.5pt;background:#f6eef4;border-radius:4px;padding:0.25rem 0.4rem;line-height:1.25;}.crit-print-tbl{width:100%;border-collapse:collapse;font-size:9.5pt;margin-top:0.15rem;}.crit-print-tbl th,.crit-print-tbl td{border:1px solid #999;padding:0.3rem 0.45rem;text-align:left;height:30px;vertical-align:middle;}.crit-print-tbl th{background:#f6eef4;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.08rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.9rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.45rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.1rem;margin-bottom:0.18rem;}.p-crit-line{font-size:11pt;color:#007a00;margin-bottom:0.18rem;line-height:1.35;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.2rem;padding:0.1rem 0;color:#784a6d;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #784a6d;}.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:12.7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="critEvalPage"><div class="ph"><h2>Evaluación Competencial · Pensamiento Crítico · Palabras que piensan · Educación Básica · Filosofía</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 5 secciones de 20 puntos</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100</span></div></div><div class="pauta-wrap" id="critPautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Pensamiento Crítico · Palabras que piensan · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 5 secciones × 20 pts c/u — respuesta abierta, usar como guía de corrección</div></div><div class="p-grid">${pR}</div></div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("critEvalPage",250,0.55,1.2);fit("critPautaPage",250,0.55,1.2);})();<\/script></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(doc);win.document.close();setTimeout(()=>win.print(),400);
}

// ===================== LABORATORIO DE FRASES =====================
const parteData = (function () {
  /* Se arma desde js/data/filosofia-lenguaje.js: las cuatro cosas que HACE
     una frase, con los nombres del DCNB de II Ciclo. Cada una lleva su PRUEBA
     —la pregunta que se le hace a la frase— en vez de su definición, que es
     lo que el alumno puede usar fuera de la escuela.
     ⚠️ Y el ejemplo NO se escribe aquí: sale de `lenDeClase`, o sea de las
     mismas treinta y dos frases del Clasifica. Escrito a mano podría acabar
     contradiciendo al ejercicio, que es la avería del Escudo en rojo. */
  const esc = x => String(x).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const out = {};
  LEN_ACTOS.forEach(a => {
    const ej = lenDeClase(a.clave)[0] || '';
    out[a.clave] = {
      nombre: a.nombre, icon: a.emoji,
      estructura: { title: '¿Qué hace?',       info: '<strong>' + esc(a.corto) + '</strong>' },
      funcion:    { title: '¿Cómo se nota?',   info: '👂 ' + esc(a.senal) },
      ubicacion:  { title: '¿Qué le pregunto?', info: '🔍 <strong>' + esc(a.prueba) + '</strong>' },
      dato:       { title: 'Una frase así',    info: '📝 «' + esc(ej) + '»' }
    };
  });
  return out;
})();
let labParte='afirma',labAspecto='estructura';
function labShowParte(parteKey){labParte=parteKey;updateLabDisplay();document.querySelectorAll('.lab-cont-btn').forEach(b=>b.classList.remove('active-pri'));const btn=document.querySelector(`[data-parte="${parteKey}"]`);if(btn)btn.classList.add('active-pri');if(typeof sfx==='function')sfx('click');}
function labShowAspecto(aspectoKey){labAspecto=aspectoKey;updateLabDisplay();document.querySelectorAll('.lab-asp-btn').forEach(b=>b.classList.remove('active-sec'));const btn=document.querySelector(`[data-aspecto="${aspectoKey}"]`);if(btn)btn.classList.add('active-sec');if(typeof sfx==='function')sfx('click');}
/* ⚠️ El texto de «Explorando» va en UN SOLO hijo de bloque, y no es estética.
   `.lab-sentence` es `display:flex`, así que el navegador hace un ítem de la
   fila de CADA pedazo: el texto suelto, cada <strong> y la flecha. Con los
   títulos cortos de la misión de la que se copió esto —«¿Qué hace?»— cabía
   todo en una fila y no se notaba; con los de aquí —«¿Con qué pregunta
   nació?»— «Explorando:» se salía del recuadro por la izquierda y el resto
   quedaba apilado a la derecha. HTML válido, CSS válido, consola callada: es
   la misma avería que las cinco cajas `.tip` de la misión 78, y se encontró
   igual, MIRANDO la captura a 360 px con todas las sondas en verde. */
function updateLabDisplay(){const data=parteData[labParte];const asp=data[labAspecto];document.getElementById('lab-sentence').innerHTML=`<div>🔬 Explorando: <strong>${data.nombre}</strong> → <strong>${asp.title}</strong></div>`;document.getElementById('lab-display').innerHTML=`<div class="lab-cont-header">${data.icon} ${data.nombre}</div><div class="lab-asp-title">${asp.title}</div><div class="lab-asp-info">${asp.info}</div>`;}

// ===================== DIPLOMA =====================
function _diplPct(){return xp>=MXP?100:Math.round((xp/MXP)*100);}
function openDiploma(){sfx('fan');const pct=_diplPct();document.getElementById('diplPct').textContent=pct+'%';document.getElementById('diplBar').style.width=pct+'%';document.getElementById('diplDate').textContent='Fecha: '+new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});const msgs=['¡Seguí escuchando!','¡Muy buen trabajo!','¡Vas muy bien!','¡Ya sabés qué hace una frase!','¡La forma ya no te engaña!'];document.getElementById('diplMsg').textContent=msgs[Math.min(Math.floor(pct/25),4)];const stars=['⭐','⭐⭐','⭐⭐⭐'];document.getElementById('diplStars').textContent=stars[Math.min(Math.floor(pct/40),2)];const achTxt=unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(' · ');document.getElementById('diplAch').textContent=achTxt||'Sigue completando secciones para desbloquear logros';document.getElementById('diplomaOverlay').classList.add('open');launchConfetti();}
function closeDiploma(){document.getElementById('diplomaOverlay').classList.remove('open');}
function updateDiplomaName(v){document.getElementById('diplName').textContent=v||'Estudiante';}
function shareWA(){const name=document.getElementById('diplName').textContent||'Estudiante';const pct=_diplPct();const msg=`🧩 ¡${name} completó la Misión "Palabras que piensan"! 🏅 Progreso: ${pct}% · 🌱 policastsapien.com`;_waShare(msg);}
async function captureDiploma(){if(typeof html2canvas==='undefined'){showToast('⚠️ Cargando... intenta de nuevo');return;}sfx('click');const card=document.querySelector('.diploma-card');const btn=document.querySelector('.diploma-actions .btn-pri');const toHide=[card.querySelector('.diploma-input'),card.querySelector('.diploma-actions'),card.querySelector('hr')];if(btn){btn.disabled=true;btn.textContent='⏳ Capturando...';}toHide.forEach(el=>{if(el)el.style.display='none';});let dataUrl='';try{const canvas=await html2canvas(card,{scale:2,useCORS:true,backgroundColor:'#ffffff'});toHide.forEach(el=>{if(el)el.style.display='';});dataUrl=canvas.toDataURL('image/png');const name=(document.getElementById('diplName').textContent||'Estudiante').replace(/\s+/g,'-');const fileName='constancia-'+name+'.png';const cap=window.Capacitor;if(cap&&cap.isNativePlatform&&cap.isNativePlatform()&&cap.Plugins?.Filesystem&&cap.Plugins?.Share){const base64Data=dataUrl.split(',')[1];const result=await cap.Plugins.Filesystem.writeFile({path:fileName,data:base64Data,directory:'CACHE'});await cap.Plugins.Share.share({url:result.uri,dialogTitle:'Guardar / Compartir Constancia'});}else{const a=document.createElement('a');a.href=dataUrl;a.download=fileName;a.click();}}catch(e){toHide.forEach(el=>{if(el)el.style.display='';});if(e.name!=='AbortError')showToast('⚠️ No se pudo guardar la constancia');}finally{if(btn){btn.disabled=false;btn.textContent='📷 Guardar foto';}}}

// ===================== INIT =====================

// ================ PALABRAS QUE PIENSAN, EN LA PANTALLA ================
/* Todo se PINTA desde js/data/filosofia-lenguaje.js. Lo que aquí se copiaría
   es la clase de cada frase y las dos lecturas de cada ambigüedad, y eso no
   puede decir una cosa en la pantalla y otra en la ficha que se fotocopia.
   De ahí sale `_dev/verifica-filosofia.js`. */
function _esc(x){return String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

/* Las cuatro cosas que HACE una frase. Los nombres son los del DCNB de II
   Ciclo: «oraciones definidas por la intención con que se dicen o escriben». */
function pintarLenActos(){
  const c=document.getElementById('ln-actos');if(!c)return;
  c.innerHTML=`<h2>💬 Una frase no solo dice: HACE</h2>
    <p>${_esc(LEN_LENGUAJE.hace)} Se llama <strong>${_esc(LEN_LENGUAJE.nombre)}</strong>,
       y pregunta: ${_esc(LEN_LENGUAJE.pregunta)}</p>
    <p>Son cuatro cosas. Cada una tiene su prueba. La prueba es una pregunta:
       se la hacés a la frase y ella te contesta cuál es.</p>
    <div class="ln-actos">${LEN_ACTOS.map(e=>
      `<div class="ln-acto e-${e.clave}">
         <h4>${e.emoji} ${_esc(e.nombre)} <span class="ln-acto-et">${_esc(e.corto)}</span></h4>
         <p class="ln-acto-s">${_esc(e.senal)}</p>
         <p class="ln-acto-p"><strong>La prueba:</strong> ${_esc(e.prueba)}</p>
       </div>`).join('')}</div>
    <div class="tip"><span class="ti">🧂</span><div>${_esc(LEN_ACTOS_OJO)}</div></div>`;
}

/* Las cuatro frases que dicen dos cosas. Es la ironía y el doble sentido que
   pide el DCNB de III Ciclo, con lo único que las arregla: preguntar. */
function pintarLenAmbig(){
  const c=document.getElementById('ln-ambig');if(!c)return;
  c.innerHTML=`<h2>🔀 La misma frase, dos cosas</h2>
    <p>Estas cuatro frases están bien escritas. Y dicen dos cosas cada una.
       Buscá las dos antes de leer la respuesta.</p>
    ${LEN_AMBIG.map(a=>
      `<div class="ln-amb">
         <div class="ln-amb-f">${a.emoji} «${_esc(a.frase)}»</div>
         <ul class="ln-amb-dos">
           <li><strong>Puede ser:</strong> ${_esc(a.una)}</li>
           <li><strong>O puede ser:</strong> ${_esc(a.otra)}</li>
         </ul>
         <p class="ln-amb-a">🔧 ${_esc(a.arregla)}</p>
       </div>`).join('')}
    <div class="tip"><span class="ti">👂</span><div>${_esc(LEN_AMBIG_OJO)}</div></div>`;
}

/* Definir: la destreza de la filosofía analítica que el currículo nombra.
   Una definición falla de dos maneras OPUESTAS, y por eso van las dos
   pruebas: buscar lo que entra y no debería, y lo que queda fuera y sí. */
function pintarLenDefinir(){
  const c=document.getElementById('ln-definir');if(!c)return;
  c.innerHTML=`<h2>🎯 Cuándo una definición sirve</h2>
    <p>Definir es decir qué entra y qué no. Se falla de dos maneras
       contrarias, y las dos se comprueban.</p>
    ${LEN_DEFINIR.map(d=>
      `<div class="ln-def d-${d.clave}">
         <div class="ln-def-tit">${d.emoji} ${_esc(d.nombre)}</div>
         <p class="ln-def-h">${_esc(d.que)}</p>
         <p class="ln-def-v">${_esc(d.ej)}</p>
         <p class="ln-def-d"><strong>La prueba:</strong> ${_esc(d.prueba)}</p>
       </div>`).join('')}
    <div class="tip"><span class="ti">📏</span><div>${_esc(LEN_DEFINIR_OJO)}</div></div>`;
}

/* Lo que la palabra ARRASTRA. El DCNB de III Ciclo nombra el lenguaje
   denotativo; aquí se ve al lado del otro, que es como se nota. */
function pintarLenCarga(){
  const c=document.getElementById('ln-carga');if(!c)return;
  c.innerHTML=`<h2>⚖️ La misma cosa, otra palabra</h2>
    <p>Las dos palabras de cada fila nombran lo mismo. Y no llegan igual.
       Leelas en voz alta y fijate cuál te cae mejor.</p>
    <div class="ln-cars">${LEN_CARGA.map(x=>
      `<div class="ln-car">
         <p class="ln-car-c">${_esc(x.cosa)}</p>
         <div class="ln-car-par">
           <span class="ln-car-s">${_esc(x.suave)}</span>
           <span class="ln-car-vs">↔</span>
           <span class="ln-car-f">${_esc(x.fuerte)}</span>
         </div>
         <p class="ln-car-i">${_esc(x.igual)}</p>
       </div>`).join('')}</div>
    <div class="tip"><span class="ti">🎯</span><div>${_esc(LEN_CARGA_OJO)}</div></div>`;
}

/* Cómo persuade la PALABRA, no la razón: la razón es la unidad 2.
   ⚠️ El cuarto NO es truco, y va marcado con su clase: una unidad donde toda
   palabra fuerte es trampa fabrica un alumno que no le cree a nadie. */
function pintarLenTrucos(){
  const c=document.getElementById('ln-trucos');if(!c)return;
  c.innerHTML=`<h2>🪤 Cuando la palabra convence sola</h2>
    <p>Aquí no se examina la razón: eso fue la unidad anterior. Se examina la
       frase. Tres de estas cuatro traen trampa.</p>
    ${LEN_TRUCOS.map(t=>
      `<div class="ln-tru ${t.truco?'t-si':'t-no'}">
         <div class="ln-tru-tit">${t.emoji} ${_esc(t.nombre)}</div>
         <p class="ln-tru-h">${_esc(t.hace)}</p>
         <p class="ln-tru-s"><strong>Suena así:</strong> ${_esc(t.suena)}</p>
         <p class="ln-tru-c"><strong>Cuesta:</strong> ${_esc(t.cuesta)}</p>
         <p class="ln-tru-d"><strong>Se desarma:</strong> ${_esc(t.desarma)}</p>
       </div>`).join('')}
    <div class="tip"><span class="ti">✅</span><div>${_esc(LEN_TRUCOS_OJO)}</div></div>`;
}

/* Lo que no se contesta copiando de aquí: se averigua hablando con la gente
   de la casa y de la comunidad, que es lo que el currículo pide de verdad. */
function pintarLenInvestiga(){
  const c=document.getElementById('ln-investiga');if(!c)return;
  c.innerHTML=`<h2>🔎 Esto se averigua hablando</h2>
    <div class="tip"><span class="ti">⚠️</span><div>${_esc(LEN_INVESTIGA.aviso)}</div></div>
    <ol class="ln-inv">${LEN_INVESTIGA.preguntas.map(p=>`<li>${_esc(p)}</li>`).join('')}</ol>
    <div class="tip"><span class="ti">🤲</span><div>${_esc(LEN_INVESTIGA.cuidado)}</div></div>`;
}

/* Qué le deja esta pregunta a cada materia: el CE1.4 de la unidad 1 visto
   desde aquí. */
function pintarLenArbol(){
  const c=document.getElementById('ln-arbol');if(!c)return;
  c.innerHTML='<h2>🌳 Qué le deja esto a cada materia</h2>'+
    LEN_ARBOL.map(a=>
      `<div class="ln-arb">
         <div class="ln-arb-m">${a.emoji} ${_esc(a.materia)}</div>
         <p class="ln-arb-l">${_esc(a.le)}</p>
         <p class="ln-arb-h"><strong>Pruébalo hoy:</strong> ${_esc(a.hoy)}</p>
       </div>`).join('');
}

/* Los dos pensadores, sin una sola fecha: el propio CNB los nombra. */
function pintarLenPensadores(){
  const c=document.getElementById('ln-pensadores');if(!c)return;
  c.innerHTML='<h2>🧠 Dos que miraron las palabras con lupa</h2>'+
    '<p>De cada uno se dice qué hizo y por qué se le recuerda. <strong>No hay ni una fecha</strong>: una fecha que no se puede acreditar no se escribe.</p>'+
    LEN_PENSADORES.map(p=>
      `<div class="ln-pens">
         <div class="ln-pens-n">${p.emoji} ${_esc(p.nombre)}</div>
         <p class="ln-pens-w">${_esc(p.donde)}</p>
         <p class="ln-pens-q">${_esc(p.quien)}</p>
         <p class="ln-pens-l"><strong>Qué hizo:</strong> ${_esc(p.hizo)}</p>
         <p class="ln-pens-l"><strong>Por qué se le recuerda:</strong> ${_esc(p.porque)}</p>
         <p class="ln-pens-dato"><strong>Dato:</strong> ${_esc(p.dato)}</p>
       </div>`).join('');
}

window.addEventListener('DOMContentLoaded',()=>{
  initTheme();
  loadProgress();
  pintarLenActos();
  pintarLenAmbig();
  pintarLenDefinir();
  pintarLenCarga();
  pintarLenTrucos();
  pintarLenInvestiga();
  pintarLenArbol();
  pintarLenPensadores();
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
  document.querySelector('[data-parte="sentidos"]')?.classList.add('active-pri');
  document.querySelector('[data-aspecto="estructura"]')?.classList.add('active-sec');
  renderAchPanel();
});

(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalCrit==='function') _injectFormaSel('genEvalCrit','evalCritFormaSel',evalCritFormNum,function(v){evalCritFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();
