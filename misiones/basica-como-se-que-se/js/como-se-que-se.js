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
const SAVE_KEY='filosofia_saber_v1';
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
  clasif_pro:{icon:'🗂️',label:'Separaste creer, opinar y saber'},
  id_master:{icon:'🔍',label:'Identificaste todos los términos'},
  reto_hero:{icon:'🏆',label:'Héroe del Reto'},
  sopa_master:{icon:'🤍',label:'Sopa completada'},
  widgets_master:{icon:'🧩',label:'Widgets dominados'},
  nivel3:{icon:'🔬',label:'Ya preguntás cómo lo sabés'},
  nivel5:{icon:'✅',label:'Comprobás antes de afirmar'}
};
function unlockAchievement(id){if(unlockedAch.includes(id))return;unlockedAch.push(id);sfx('ach');showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label);launchConfetti();renderAchPanel();saveProgress();}
function renderAchPanel(){const list=document.getElementById('achList');list.innerHTML='';Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{const div=document.createElement('div');div.className='ach-item'+(unlockedAch.includes(id)?'':' locked');div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`;list.appendChild(div);});}
function toggleAchPanel(){sfx('click');document.getElementById('achPanel').classList.toggle('open');}
function showToast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}t.textContent=msg;t.style.display='block';clearTimeout(t._tid);t._tid=setTimeout(()=>t.style.display='none',3200);}
function launchConfetti(){const colors=['#784a6d','#b9789f','#1d4538','#3f8a6d','#f59e0b'];for(let i=0;i<60;i++){const c=document.createElement('div');c.className='confetti-piece';c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`;document.body.appendChild(c);c.addEventListener('animationend',()=>c.remove());}}

// ===================== XP =====================
const lvls=[{t:0,n:'Aprendiz 🌱'},{t:25,n:'Preguntás cómo lo sabés 🤔'},{t:55,n:'Separás creer de saber ✅'},{t:90,n:'Respetás una opinión 💬'},{t:130,n:'Cruzás dos fuentes 🔀'},{t:165,n:'Decís qué te haría cambiar 🔄'},{t:190,n:'Comprobás antes de afirmar 🔬'}];
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
  SAB_VOCABULARIO.forEach(v => out.push({ w: v.w, a: v.a }));
  SAB_ESTADOS.forEach(e => out.push({
    w: e.emoji + ' ' + e.nombre,
    a: e.senal + ' <strong>' + e.prueba + '</strong>' }));
  SAB_FUENTES.forEach(f => out.push({
    w: f.emoji + ' ' + f.nombre,
    a: 'Sirve: ' + f.sirve + ' Falla: <em>' + f.falla + '</em> <strong>' + f.arregla + '</strong>' }));
  SAB_PASOS.forEach(p => out.push({
    w: '🪜 Paso ' + p.n,
    a: '<strong>' + p.paso + '</strong> ' + p.porque }));
  SAB_ESCUELAS.forEach(e => out.push({
    w: e.emoji + ' ' + e.nombre,
    a: e.dice + ' Acierta en esto: ' + e.acierta + ' <strong>Se queda corto:</strong> ' + e.corto }));
  SAB_PENSADORES.forEach(p => out.push({
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
  {q:'¿De qué se ocupa la epistemología?',o:['De separar creer, opinar y saber','De medir la temperatura','De escribir sin faltas','De contar dinero'],c:0},
  {q:'«Lo sé» quiere decir que es así y que además…',o:['me lo contaron','me gusta','puedo decir con qué se comprueba','lo dice la mayoría'],c:2},
  {q:'«Las baleadas son mejores que los tamales» es…',o:['un saber','una opinión','una creencia','una medida'],c:1},
  {q:'«Dicen que el puente está cerrado» es…',o:['una opinión','un saber comprobado','algo que creo','una hipótesis comprobada'],c:2},
  {q:'¿Qué se le pregunta a una afirmación para saber si la SABÉS?',o:['¿Me gusta?','¿Quién la dijo?','¿Cuántos lo creen?','¿Puedo decir con qué se comprueba?'],c:3},
  {q:'El lápiz dentro del vaso de agua se ve quebrado. ¿Qué pasa?',o:['El lápiz se quebró','El lápiz está entero: la luz se dobla al salir del agua','El vaso lo corta','El agua lo derrite'],c:1},
  {q:'La misma agua tibia se siente caliente en una mano y fría en la otra. ¿Por qué?',o:['El agua tiene dos temperaturas','Una mano está enferma','El agua se mueve','La piel compara con lo que tenía antes'],c:3},
  {q:'¿Qué NO quiere decir que los sentidos a veces se equivoquen?',o:['Que a veces hay que cruzarlos con una medida','Que no sirven para nada','Que hay que mirar dos veces','Que conviene tocar además de mirar'],c:1},
  {q:'¿Cuál es el paso que de verdad cuesta al comprobar algo?',o:['Decir quién lo dijo','Escribirlo bonito','Repetirlo más fuerte','Decir qué te haría cambiar de idea'],c:3},
  {q:'¿Qué dice el empirismo?',o:['Que todo lo que sabemos entró por los sentidos','Que la razón sola alcanza','Que no se puede saber nada','Que manda la mayoría'],c:0},
  {q:'¿Qué dice el racionalismo?',o:['Que hay que medir todo','Que la memoria no falla','Que lo más seguro lo saca la razón, pensando con orden','Que la opinión es un saber'],c:2},
  {q:'De las dos escuelas, ¿cuál se usa hoy en la ciencia?',o:['Las dos: se mide y se saca cuentas','Solo el empirismo','Solo el racionalismo','Ninguna'],c:0}
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
  const se = sabDeEstado('se'), creo = sabDeEstado('creo'), opino = sabDeEstado('opino');
  return [
    { label:['Se puede comprobar','Es una opinión: no se comprueba'], headA:'🔎 Se comprueba', headB:'💬 Es opinión', colA:'comp', colB:'op',
      words: fi(se.slice(0,2),'comp').concat(fi(creo.slice(0,2),'comp'), fi(opino.slice(0,4),'op')) },
    { label:['Lo sé: ya lo comprobé','Lo creo: todavía no'], headA:'✅ Lo sé', headB:'🤔 Lo creo', colA:'se', colB:'creo',
      words: fi(se.slice(2,6),'se').concat(fi(creo.slice(2,6),'creo')) },
    { label:['Lo sé: ya lo comprobé','Es mi opinión'], headA:'✅ Lo sé', headB:'💬 Es mi opinión', colA:'se', colB:'opino',
      words: fi(se.slice(6,10),'se').concat(fi(opino.slice(4,8),'opino')) }
  ];
})();
let currentClassGroupIdx=0,clsSelectedWord=null;
function buildClass(){const group=classGroups[currentClassGroupIdx];document.getElementById('col-left-head').textContent=group.headA;document.getElementById('col-right-head').textContent=group.headB;const bank=document.getElementById('clsBank');bank.innerHTML='';clsSelectedWord=null;document.getElementById('items-left').innerHTML='';document.getElementById('items-right').innerHTML='';_shuffle([...group.words]).forEach(w=>{const el=document.createElement('div');el.className='wb-item';el.textContent=w.w;el.dataset.t=w.t;el.onclick=()=>{document.querySelectorAll('.wb-item').forEach(i=>i.classList.remove('sel-word'));el.classList.add('sel-word');clsSelectedWord=el;sfx('click');};bank.appendChild(el);});['col-left','col-right'].forEach(colId=>{const col=document.getElementById(colId);col.onclick=(e)=>{if(!clsSelectedWord||e.target.classList.contains('drop-item'))return;const targetId=colId==='col-left'?'items-left':'items-right';const wordsCol=document.getElementById(targetId);const item=document.createElement('div');item.className='drop-item';item.textContent=clsSelectedWord.textContent;item.dataset.t=clsSelectedWord.dataset.t;const original=clsSelectedWord;item.onclick=(ev)=>{ev.stopPropagation();if(clsSelectedWord!==null){col.click();}else{document.getElementById('clsBank').appendChild(original);original.classList.remove('sel-word');item.remove();if(typeof sfx==='function')sfx('click');}};wordsCol.appendChild(item);clsSelectedWord.remove();clsSelectedWord=null;sfx('click');};});}
function checkClass(){const remaining=document.querySelectorAll('#clsBank .wb-item').length;if(remaining>0){fb('fbCls','Mueve todas las palabras a las columnas primero.',false);return;}const group=classGroups[currentClassGroupIdx];let allOk=true;document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{const inLeft=el.parentElement.id==='items-left';const expectedType=inLeft?group.colA:group.colB;if(el.dataset.t===expectedType){el.classList.add('cls-ok');}else{el.classList.add('cls-no');allOk=false;}});if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);}if(allOk){fb('fbCls','¡Perfecto! +5 XP',true);sfx('fan');fin('s-clasifica');unlockAchievement('clasif_pro');}else{fb('fbCls','Hay errores. Los errados llevan ✗.',false);sfx('no');}}
function nextClassGroup(){sfx('click');currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length;buildClass();document.getElementById('fbCls').classList.remove('show');showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]);}
function resetClass(){sfx('click');buildClass();document.getElementById('fbCls').classList.remove('show');}

// ===================== IDENTIFICAR =====================
const idData=[
  {s:['La','epistemología','pregunta','cómo','sé','que','sé.'],c:1,art:'la rama que separa creer, opinar y saber'},
  {s:['Lo','doy','por','cierto','y','no','lo','comprobé:','lo','creo.'],c:9,art:'lo que hago cuando todavía no comprobé'},
  {s:['Otro','puede','pensar','lo','contrario','sin','equivocarse:','es','una','opinión.'],c:9,art:'lo que no se comprueba porque no es verdad ni mentira'},
  {s:['De','dónde','salió','el','dato','es','su','fuente.'],c:7,art:'de dónde salió lo que decís'},
  {s:['Una','respuesta','que','se','propone','antes','de','comprobarla','es','una','hipótesis.'],c:10,art:'lo que se propone para poder comprobarlo'},
  {s:['Hacer','algo','que','daría','otro','resultado','si','fuera','falso','es','comprobar.'],c:10,art:'lo que separa el saber de la creencia'},
  {s:['René','Descartes','dudó','de','todo','para','buscar','lo','seguro.'],c:1,art:'la cara del racionalismo'},
  {s:['John','Locke','dijo','que','todo','entra','por','los','sentidos.'],c:1,art:'la cara del empirismo'}
];
let idIdx=0,idDone=false;
function showId(){idDone=false;if(idIdx>=idData.length){document.getElementById('idSent').innerHTML='🎉 ¡Completado!';fin('s-identifica');unlockAchievement('id_master');return;}const d=idData[idIdx];document.getElementById('idProg').textContent=`Oración ${idIdx+1} de ${idData.length}`;document.getElementById('idInfo').textContent=`Busca: ${d.art}`;const sent=document.getElementById('idSent');sent.innerHTML='';d.s.forEach((w,i)=>{const span=document.createElement('span');span.className='id-word';span.textContent=w+' ';span.onclick=()=>checkId(i,span);sent.appendChild(span);});}
function checkId(i,span){if(idDone)return;document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected'));span.classList.add('selected');if(i===idData[idIdx].c){idDone=true;span.classList.add('id-ok');fb('fbId','¡Correcto! +5 XP',true);if(!xpTracker.id.has(idIdx)){xpTracker.id.add(idIdx);pts(5);}sfx('ok');}else{span.classList.add('id-no');fb('fbId','Ese no es el término solicitado.',false);sfx('no');}}
function nextId(){sfx('click');idIdx++;showId();document.getElementById('fbId').classList.remove('show');}
function resetId(){sfx('click');idIdx=0;showId();document.getElementById('fbId').classList.remove('show');}

// ===================== COMPLETA =====================
const cmpData=[
  {s:'La rama que pregunta cómo sé que sé es la ___.',opts:['epistemología','metafísica','lógica'],c:0},
  {s:'Dar algo por cierto sin comprobarlo es ___.',opts:['saber','creer','medir'],c:1},
  {s:'Un juicio donde otro puede pensar lo contrario es una ___.',opts:['medida','prueba','opinión'],c:2},
  {s:'De dónde salió el dato se llama su ___.',opts:['fuente','forma','fecha'],c:0},
  {s:'Lo que se propone antes de comprobarlo es una ___.',opts:['opinión','hipótesis','orden'],c:1},
  {s:'Para decir «lo sé» hay que poder decir con qué se ___.',opts:['adorna','cuenta','comprueba'],c:2},
  {s:'El lápiz en el vaso se ve quebrado porque la luz se ___.',opts:['dobla','apaga','pierde'],c:0},
  {s:'La escuela que dice que todo entra por los sentidos es el ___.',opts:['racionalismo','empirismo','realismo'],c:1},
  {s:'La escuela que confía primero en la razón es el ___.',opts:['empirismo','idealismo','racionalismo'],c:2},
  {s:'Decir «no sé» no es perder: es poder ir a ___.',opts:['averiguarlo','discutirlo','olvidarlo'],c:0}
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
  { label: 'Ordena: cómo se comprueba una afirmación',
    steps: SAB_PASOS.map(p => p.n + '. ' + p.paso) },
  { label: 'Ordena: de un rumor a un dato que se sostiene',
    steps: ['1. Alguien te dice que el examen se pasó para el jueves.',
            '2. Preguntás cómo lo sabe: se lo contaron en el recreo.',
            '3. Buscás la fuente: el maestro, que es quien lo decide.',
            '4. El maestro dice que el examen sigue el martes.',
            '5. Ya no lo creés: lo sabés, y podés decir con qué.'] }
];
let currentRouteIdx=0,routeItems=[];
function buildRoute(){routeItems=_shuffle([...routeSets[currentRouteIdx].steps]);renderRoute();const fbEl=document.getElementById('fbRoute');if(fbEl)fbEl.classList.remove('show');}
function renderRoute(){const list=document.getElementById('routeList');if(!list)return;list.innerHTML='';routeItems.forEach((step,i)=>{const div=document.createElement('div');div.className='sort-item';div.innerHTML=`<div class="sort-arrows"><button class="sort-arrow" onclick="routeMove(${i},-1)"${i===0?' disabled':''}>▲</button><button class="sort-arrow" onclick="routeMove(${i},1)"${i===routeItems.length-1?' disabled':''}>▼</button></div><div class="sort-step-num">${i+1}.</div><div class="sort-item-txt">${step}</div>`;list.appendChild(div);});}
function routeMove(idx,dir){sfx('click');const ni=idx+dir;if(ni<0||ni>=routeItems.length)return;[routeItems[idx],routeItems[ni]]=[routeItems[ni],routeItems[idx]];renderRoute();}
function checkRoute(){const correct=routeSets[currentRouteIdx].steps;const isOk=routeItems.every((s,i)=>s===correct[i]);if(isOk){fb('fbRoute','¡Perfecto! Orden correcto. +4 XP',true);if(!xpTracker.wgt.has('route_'+currentRouteIdx)){xpTracker.wgt.add('route_'+currentRouteIdx);pts(4);}sfx('fan');fin('s-widgets');unlockAchievement('widgets_master');}else{fb('fbRoute','Hay pasos fuera de orden. Revisa el arreglo.',false);sfx('no');}}
function nextRoute(){sfx('click');currentRouteIdx=(currentRouteIdx+1)%routeSets.length;buildRoute();showToast('🔄 Secuencia: '+routeSets[currentRouteIdx].label);}

// Widget 2: Identifica el concepto
const neuronPartes = (function () {
  const opts = SAB_ESTADOS.map(e => e.emoji + ' ' + e.nombre);
  const nom = q => sabEstado(q).emoji + ' ' + sabEstado(q).nombre;
  const elegidas = [];
  ['se', 'creo', 'opino'].forEach(q => {
    sabDeEstado(q).slice(6, 9).forEach(a => elegidas.push({ a: a, q: q }));
  });
  return elegidas.map(x => ({ desc: x.a, opts: opts.slice(), ans: nom(x.q) }));
})();
let neuronIdx=0,neuronDone=false;
function showNeuron(){neuronDone=false;if(neuronIdx>=neuronPartes.length){const el=document.getElementById('neuronDesc');if(el)el.textContent='🎉 ¡Ya reconoces a cada uno por lo que hizo!';const opts=document.getElementById('neuronOpts');if(opts)opts.innerHTML='';fin('s-widgets');return;}const d=neuronPartes[neuronIdx];const prog=document.getElementById('neuronProg');if(prog)prog.textContent=`Pista ${neuronIdx+1} de ${neuronPartes.length}`;const desc=document.getElementById('neuronDesc');if(desc)desc.textContent=d.desc;const opts=document.getElementById('neuronOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=opt;b.onclick=()=>checkNeuron(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuron');if(fbEl)fbEl.classList.remove('show');}
function checkNeuron(opt,btn,d){if(neuronDone)return;neuronDone=true;document.querySelectorAll('#neuronOpts .cmp-opt').forEach(b=>{if(b.textContent===d.ans)b.classList.add('correct');else if(b===btn&&b.textContent!==d.ans)b.classList.add('wrong');});const isOk=opt===d.ans;if(isOk){fb('fbNeuron','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuron_'+neuronIdx)){xpTracker.wgt.add('neuron_'+neuronIdx);pts(3);}sfx('ok');}else{fb('fbNeuron','La respuesta correcta es: '+d.ans,false);sfx('no');}}
function nextNeuron(){sfx('click');neuronIdx++;showNeuron();}
function resetNeuron(){sfx('click');neuronIdx=0;showNeuron();}

// Widget 3: Concepto → Significado
const neuroPairs = SAB_FUENTES.map(f => ({
  trans: f.falla,
  func: f.emoji + ' ' + f.nombre,
  opts: SAB_FUENTES.map(x => x.emoji + ' ' + x.nombre)
}));
let neuroIdx=0,neuroDone=false;
function showNeuro(){neuroDone=false;if(neuroIdx>=neuroPairs.length){const el=document.getElementById('neuroTrans');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('neuroOpts');if(opts)opts.innerHTML='';return;}const d=neuroPairs[neuroIdx];const prog=document.getElementById('neuroProg');if(prog)prog.textContent=`${neuroIdx+1} de ${neuroPairs.length}`;const trans=document.getElementById('neuroTrans');if(trans)trans.textContent=d.trans;const opts=document.getElementById('neuroOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkNeuro(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuro');if(fbEl)fbEl.classList.remove('show');}
function checkNeuro(opt,btn,d){if(neuroDone)return;neuroDone=true;document.querySelectorAll('#neuroOpts .qz-opt').forEach(b=>{if(b.textContent===d.func)b.classList.add('correct');else if(b===btn&&b.textContent!==d.func)b.classList.add('wrong');});const isOk=opt===d.func;if(isOk){fb('fbNeuro','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuro_'+neuroIdx)){xpTracker.wgt.add('neuro_'+neuroIdx);pts(3);}sfx('ok');}else{fb('fbNeuro','Correcto: '+d.func,false);sfx('no');}setTimeout(()=>{neuroIdx++;showNeuro();},1800);}
function resetNeuro(){sfx('click');neuroIdx=0;showNeuro();}

// Widget 4: Fuente → ¿Renovable o no renovable?
const enfermedadData = (function () {
  const opts = ['✅ Sí, se puede comprobar', '💬 No: es una opinión'];
  const si = sabSeComprueba(), no = sabDeEstado('opino');
  const out = [];
  for (let i = 0; i < 5; i++) {
    out.push({ disease: si[i * 4], characteristic: opts[0], opts: opts.slice() });
    if (no[i]) out.push({ disease: no[i], characteristic: opts[1], opts: opts.slice() });
  }
  return out;
})();
let enferIdx=0,enferDone=false;
function showEnfer(){enferDone=false;if(enferIdx>=enfermedadData.length){const el=document.getElementById('enferDisease');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('enferOpts');if(opts)opts.innerHTML='';return;}const d=enfermedadData[enferIdx];const prog=document.getElementById('enferProg');if(prog)prog.textContent=`${enferIdx+1} de ${enfermedadData.length}`;const dis=document.getElementById('enferDisease');if(dis)dis.textContent=d.disease;const opts=document.getElementById('enferOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkEnfer(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbEnfer');if(fbEl)fbEl.classList.remove('show');}
function checkEnfer(opt,btn,d){if(enferDone)return;enferDone=true;document.querySelectorAll('#enferOpts .qz-opt').forEach(b=>{if(b.textContent===d.characteristic)b.classList.add('correct');else if(b===btn&&b.textContent!==d.characteristic)b.classList.add('wrong');});const isOk=opt===d.characteristic;if(isOk){fb('fbEnfer','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('enfer_'+enferIdx)){xpTracker.wgt.add('enfer_'+enferIdx);pts(3);}sfx('ok');}else{fb('fbEnfer','Correcto: '+d.characteristic,false);sfx('no');}setTimeout(()=>{enferIdx++;showEnfer();},1800);}
function resetEnfer(){sfx('click');enferIdx=0;showEnfer();}

// ===================== RETO FINAL =====================
const retoPairs = (function () {
  const fi = (arr, t) => arr.map(a => ({ w: a, t: t }));
  const se = sabDeEstado('se'), creo = sabDeEstado('creo'), opino = sabDeEstado('opino');
  return [
    { label:['Se puede comprobar','Es una opinión'], btnA:'🔎 Se comprueba', btnB:'💬 Es opinión', colA:'comp', colB:'op',
      words: fi(se,'comp').concat(fi(creo,'comp'), fi(opino,'op')) },
    { label:['Lo sé: ya lo comprobé','Lo creo: todavía no'], btnA:'✅ Lo sé', btnB:'🤔 Lo creo', colA:'se', colB:'creo',
      words: fi(se,'se').concat(fi(creo,'creo')) },
    { label:['Lo sé: ya lo comprobé','Es mi opinión'], btnA:'✅ Lo sé', btnB:'💬 Mi opinión', colA:'se', colB:'opino',
      words: fi(se,'se').concat(fi(opino,'opino')) }
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
  {s:'La rama que separa creer, opinar y saber es la epistemología.',type:'epistemología'},
  {s:'Dar algo por cierto sin haberlo comprobado es creer.',type:'creer'},
  {s:'Un juicio donde otro puede pensar lo contrario es una opinión.',type:'opinión'},
  {s:'Que algo sea así y poder decir con qué se comprueba es saber.',type:'saber'},
  {s:'De dónde salió el dato es su fuente.',type:'fuente'},
  {s:'Una respuesta propuesta antes de comprobarla es una hipótesis.',type:'hipótesis'},
  {s:'Hacer algo que daría otro resultado si fuera falso es comprobar.',type:'comprobar'},
  {s:'La escuela que dice que todo entra por los sentidos es el empirismo.',type:'empirismo'},
  {s:'La escuela que confía primero en la razón es el racionalismo.',type:'racionalismo'},
  {s:'René Descartes dudó de todo para buscar lo seguro.',type:'René Descartes'},
  {s:'John Locke dijo que la mente empieza vacía.',type:'John Locke'},
  {s:'Decir «no sé» deja la puerta abierta para averiguarlo.',type:'no sé'}
];
const classifyTaskDB=[
  {w:'Lo sé',gen:'Un estado de una afirmación',n:'Es así y lo puedo comprobar',g:'Puedo decir con qué se comprueba',t:'Ejemplo: en mi grado somos cuarenta y tres'},
  {w:'Lo creo',gen:'Un estado de una afirmación',n:'Lo doy por cierto',g:'Todavía no puedo decir cómo lo sé',t:'Ejemplo: dicen que el puente está cerrado'},
  {w:'Es mi opinión',gen:'Un estado de una afirmación',n:'Es un gusto o un juicio mío',g:'Otro puede pensar lo contrario sin equivocarse',t:'Ejemplo: esta canción es fea'},
  {w:'Los sentidos',gen:'Una fuente',n:'Mirar, tocar, oír, probar',g:'A veces ven lo que no es',t:'El lápiz en el agua se ve quebrado'},
  {w:'La memoria',gen:'Una fuente',n:'Guarda lo que ya viste',g:'Se acomoda sola con el tiempo',t:'Dos personas lo cuentan distinto'},
  {w:'Lo que otro cuenta',gen:'Una fuente',n:'Nadie puede ver todo solo',g:'Cambia por el camino',t:'Se arregla preguntando cómo lo sabe'},
  {w:'El razonamiento',gen:'Una fuente',n:'Saca cosas nuevas de las que ya sabés',g:'Si parte de algo falso, sale falso',t:'Es la unidad 2 de esta ruta'},
  {w:'La medida',gen:'Una fuente',n:'Deja que dos personas miren lo mismo',g:'Si el instrumento está malo, todos miden mal',t:'Se arregla midiendo con otra cinta'},
  {w:'Hipótesis',gen:'Un concepto',n:'Una respuesta propuesta',g:'Se propone ANTES de comprobarla',t:'Sin eso no hay nada que comprobar'},
  {w:'Racionalismo',gen:'Una escuela',n:'Confía primero en la razón',g:'Pensando con orden',t:'2 + 2 no se comprueba en el patio'},
  {w:'Empirismo',gen:'Una escuela',n:'Confía en la experiencia',g:'Todo entró por los sentidos',t:'El color del techo hay que mirarlo'}
];
const completeTaskDB=[
  {s:'La rama que pregunta cómo sé que sé es la ___.',ans:'epistemología'},
  {s:'Dar algo por cierto sin comprobarlo es ___.',ans:'creer'},
  {s:'Un juicio donde otro puede pensar lo contrario es una ___.',ans:'opinión'},
  {s:'De dónde salió el dato es su ___.',ans:'fuente'},
  {s:'Lo que se propone antes de comprobarlo es una ___.',ans:'hipótesis'},
  {s:'Para decir «lo sé» hay que poder decir con qué se ___.',ans:'comprueba'},
  {s:'La escuela de los sentidos es el ___.',ans:'empirismo'},
  {s:'La escuela de la razón es el ___.',ans:'racionalismo'},
  {s:'El que dudó de todo para buscar lo seguro fue ___.',ans:'Descartes'},
  {s:'El que dijo que la mente empieza vacía fue ___.',ans:'Locke'}
];
const explainQuestions=[
  {q:'¿Cuál es la diferencia entre creer, opinar y saber?',ans:'Creer es dar algo por cierto sin haberlo comprobado. Opinar es dar un juicio propio, donde otro puede pensar lo contrario sin equivocarse. Saber es que algo sea así y además poder decir con qué se comprueba.'},
  {q:'Escribe tres afirmaciones tuyas: una que sabés, una que creés y una opinión.',ans:'Respuesta abierta. Las tres tienen que ser suyas. Se valora que en la que sabe diga CON QUÉ la comprueba. Y que la opinión sea una opinión de verdad, no una creencia disfrazada.'},
  {q:'¿Por qué «me gusta el azul» no se comprueba?',ans:'Porque no es verdad ni mentira para todos. Es un juicio de quien lo dice. Pedirle pruebas a un gusto es el error contrario. Cuesta lo mismo que creer sin comprobar.'},
  {q:'Nombra las cinco fuentes de lo que sabemos y di cuándo falla cada una.',ans:'Los sentidos: a veces ven lo que no es. La memoria: se acomoda sola. Lo que otro cuenta: cambia por el camino. El razonamiento: si parte de algo falso, sale falso. La medida: si el instrumento está malo, todos miden mal.'},
  {q:'Haz uno de los cuatro engaños en tu casa y explica qué pasó.',ans:'Respuesta abierta. Se valora que lo HAYA hecho. Y que describa tres cosas: qué esperaba ver, qué vio y con qué lo desarmó. Decir «no me salió» también vale. Pide el detalle de lo que intentó.'},
  {q:'¿Por qué que el ojo se equivoque NO quiere decir que los sentidos no sirvan?',ans:'Porque en los cuatro engaños otro sentido o una medida lo arregla en un minuto. Los sentidos son la fuente principal y funcionan. Lo que hay que aprender es cuándo cruzarlos con otra cosa.'},
  {q:'¿Cuál es el quinto paso de comprobar y por qué cuesta tanto?',ans:'Decir qué te haría cambiar de idea. Cuesta porque obliga a aceptar que podrías estar equivocado. Si no hay nada que te haga cambiar, no estabas sabiendo: estabas defendiendo.'},
  {q:'Compara el racionalismo y el empirismo, y di cuál se usa hoy.',ans:'El racionalismo dice que lo más seguro lo saca la razón, pensando con orden. El empirismo dice que todo entró por los sentidos. Hoy se usan las dos. La ciencia mide con los sentidos y saca cuentas con la razón.'},
  {q:'¿Por qué decir «no sé» puede ser mejor que decir «lo sé»?',ans:'Porque el que dice «no sé» puede ir a averiguarlo. El que dice «lo sé» sin comprobarlo se queda con lo que le contaron. Y encima lo repite.'}
];
let ansVisible=false;
function genTask(){sfx('click');const type=document.getElementById('tgType').value;const count=parseInt(document.getElementById('tgCount').value);ansVisible=false;const out=document.getElementById('tgOut');out.innerHTML='';if(type==='identify')genIdentifyTask(out,count);else if(type==='classify')genClassifyTask(out,count);else if(type==='complete')genCompleteTask(out,count);else if(type==='explain')genExplainTask(out,count);fin('s-tareas');}
function _instrBlock(out,title,lines){const ib=document.createElement('div');ib.className='tg-instruction-block';ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join('');out.appendChild(ib);}
function genIdentifyTask(out,count){_instrBlock(out,'Instrucción',['Copia en tu cuaderno; subraya, colorea o encierra el concepto indicado en cada oración. Escribe al lado de qué concepto de la unidad se trata.','<strong>Ejemplo:</strong> De dónde salió el dato es su fuente. → <span style="color:var(--jade);font-weight:700;">fuente</span>']);_pick(identifyTaskDB,Math.min(count,identifyTaskDB.length)).forEach((item,i)=>{const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.type}</div></div>`;out.appendChild(div);});}
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
  {q:'La epistemología separa creer, opinar y saber.',a:true},
  {q:'«Lo creo» y «lo sé» quieren decir lo mismo.',a:false},
  {q:'Una opinión se comprueba midiéndola.',a:false},
  {q:'Para decir «lo sé» hay que poder decir con qué se comprueba.',a:true},
  {q:'Los sentidos no sirven, porque a veces se equivocan.',a:false},
  {q:'El lápiz dentro del vaso de agua se quiebra de verdad.',a:false},
  {q:'La misma agua tibia puede sentirse caliente en una mano y fría en la otra.',a:true},
  {q:'La memoria guarda los hechos exactamente igual con los años.',a:false},
  {q:'Lo que otro cuenta cambia cuanto más lejos está de quien lo vio.',a:true},
  {q:'Si un razonamiento parte de algo falso, la conclusión puede salir falsa.',a:true},
  {q:'Si el instrumento está mal, la medida sigue siendo buena.',a:false},
  {q:'Decir «no sé» deja la puerta abierta para ir a averiguarlo.',a:true},
  {q:'El empirismo dice que todo lo que sabemos entró por los sentidos.',a:true},
  {q:'La ciencia de hoy usó que ganara una sola de las dos escuelas.',a:false},
  {q:'Si nada puede hacerte cambiar de idea, no estabas sabiendo: estabas defendiendo.',a:true}
];
const evalMCBank=[
  {q:'¿De qué se ocupa la epistemología?',o:['De medir el tiempo','De escribir bien','De separar creer, opinar y saber','De contar dinero'],a:2},
  {q:'«Dicen que el puente está cerrado» es…',o:['algo que creo','una opinión','un saber comprobado','una medida'],a:0},
  {q:'«Esta canción es fea» es…',o:['un saber','una opinión','una creencia','una hipótesis'],a:1},
  {q:'«En mi grado somos cuarenta y tres» es…',o:['una opinión','una creencia','un rumor','un saber: se cuenta'],a:3},
  {q:'¿Qué se le pregunta a una creencia para pasarla a saber?',o:['¿A quién le gusta?','¿Cuántos lo dicen?','¿Cómo lo sé y con qué lo compruebo?','¿Suena bien?'],a:2},
  {q:'¿Cuál de estas NO se puede comprobar?',o:['La puerta mide más que yo','El agua está fría','El azul es el color más bonito','Somos cuarenta y tres'],a:2},
  {q:'La moneda que aparece al echar agua en la taza enseña que…',o:['la luz se dobla al salir del agua','la moneda se mueve','el agua la empuja','la taza cambia'],a:0},
  {q:'¿Qué arregla que la piel no mida grados?',o:['Esperar','Frotar las manos','Preguntar','Un termómetro'],a:3},
  {q:'La fuente que cambia cuanto más lejos está de quien lo vio es…',o:['la medida','lo que otro cuenta','el razonamiento','los sentidos'],a:1},
  {q:'¿Para qué sirve la medida, sobre todo?',o:['Para adornar el cuaderno','Para ganar la discusión','Para no preguntar','Para que dos que no se ponen de acuerdo miren lo mismo'],a:3},
  {q:'¿Qué hace el paso 1 de comprobar?',o:['Buscar quién lo dijo','Decir exactamente qué se afirma','Escribirlo bonito','Votar'],a:1},
  {q:'¿Por qué hay que buscar a quien diga lo contrario?',o:['Porque si solo buscás lo que te da la razón, siempre lo encontrás','Para discutir','Para ganar tiempo','Porque lo pide el maestro'],a:0},
  {q:'«2 + 2 son 4» no hace falta comprobarlo en el patio. Eso lo dice el…',o:['empirismo','rumor','racionalismo','método'],a:2},
  {q:'De qué color es el techo de tu escuela hay que mirarlo. Eso lo dice el…',o:['empirismo','racionalismo','azar','reglamento'],a:0},
  {q:'¿Qué hizo René Descartes?',o:['Midió la luz','Dudó de todo para buscar algo seguro','Contó los alumnos','Escribió cuentos'],a:1}
];
const evalCPBank=[
  {q:'La rama que pregunta cómo sé que sé es la ___.',a:'epistemología'},
  {q:'Dar algo por cierto sin comprobarlo es ___.',a:'creer'},
  {q:'Un juicio donde otro puede pensar lo contrario es una ___.',a:'opinión'},
  {q:'De dónde salió el dato es su ___.',a:'fuente'},
  {q:'Una respuesta propuesta antes de comprobarla es una ___.',a:'hipótesis'},
  {q:'Para decir «lo sé» hay que poder decir con qué se ___.',a:'comprueba'},
  {q:'La escuela que dice que todo entra por los sentidos es el ___.',a:'empirismo'},
  {q:'La escuela que confía primero en la razón es el ___.',a:'racionalismo'},
  {q:'El que dudó de todo para buscar lo seguro fue ___.',a:'Descartes'},
  {q:'El que dijo que la mente empieza vacía fue ___.',a:'Locke'},
  {q:'El lápiz dentro del vaso se ve quebrado porque la luz se ___.',a:'dobla'},
  {q:'La fuente que se acomoda sola con el tiempo es la ___.',a:'memoria'},
  {q:'Para que dos personas que discuten miren lo mismo se usa la ___.',a:'medida'},
  {q:'El quinto paso es decir qué te haría cambiar de ___.',a:'idea'},
  {q:'Cuando no lo comprobaste y no lo sabés, se vale decir «no ___».',a:'sé'}
];
const evalPRBank=[
  {term:'Epistemología',def:'La rama que separa creer, opinar y saber'},
  {term:'Creer',def:'Dar algo por cierto sin haberlo comprobado'},
  {term:'Opinar',def:'Dar un juicio donde otro puede pensar lo contrario'},
  {term:'Saber',def:'Que sea así y poder decir con qué se comprueba'},
  {term:'Fuente',def:'De dónde salió lo que decís'},
  {term:'Hipótesis',def:'Una respuesta que se propone antes de comprobarla'},
  {term:'Comprobar',def:'Hacer algo que daría otro resultado si fuera falso'},
  {term:'Los sentidos',def:'La fuente por la que entró casi todo lo que sabés'},
  {term:'La memoria',def:'La fuente que se acomoda sola con el tiempo'},
  {term:'Lo que otro cuenta',def:'La fuente que cambia por el camino'},
  {term:'La medida',def:'Lo que deja que dos que discuten miren lo mismo'},
  {term:'Racionalismo',def:'La escuela que confía primero en la razón'},
  {term:'Empirismo',def:'La escuela que dice que todo entró por los sentidos'},
  {term:'«No sé»',def:'La respuesta que deja la puerta abierta a averiguarlo'},
  {term:'El quinto paso',def:'Decir qué te haría cambiar de idea'}
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

function genEval(){sfx('click');_evalFormaSelector(); const _selF = document.getElementById('evalFormaSel'); if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10))); const cf = evalFormNum; const rng = _evalRng(cf); window._currentEvalForm=cf;evalFormNum = (evalFormNum % EVAL_FORMAS) + 1; _evalFormaSelector();saveProgress();document.getElementById('eval-screen-title').textContent=`🎓 Evaluación Final · Forma ${cf} · ¿Cómo sé que sé?`;evalAnsVisible=false;const out=document.getElementById('evalOut');out.innerHTML='';const bar=document.createElement('div');bar.className='eval-score-bar';bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje · 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25 pts</span><span class="eval-score-pill esp-tf">V/F 25 pts</span><span class="eval-score-pill esp-mc">Selección 25 pts</span><span class="eval-score-pill esp-pr">Pareados 25 pts</span></div>`;out.appendChild(bar);const cpItems=_pickF(evalCPBank,5, rng);const s1=document.createElement('div');s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';cpItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='cp';d.dataset.evalIndex=i;const qHtml=item.q.replace('___',`<input class="eval-cp-input" type="text" data-cp="${i}" autocomplete="off">`);d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbCp${i}" aria-live="polite"></div>`;s1.appendChild(d);});out.appendChild(s1);const tfItems=_pickF(evalTFBank,5, rng);const s2=document.createElement('div');s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';tfItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='tf';d.dataset.evalIndex=i;d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="true"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="false"> Falso</label></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbTf${i}" aria-live="polite"></div>`;s2.appendChild(d);});out.appendChild(s2);const mcItems=_pickF(evalMCBank,5, rng);const s3=document.createElement('div');s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';mcItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='mc';d.dataset.evalIndex=i;const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join('');d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbMc${i}" aria-live="polite"></div>`;s3.appendChild(d);});out.appendChild(s3);const prItems=_pickF(evalPRBank,5, rng);const shuffledDefs=_shuffleF(prItems, rng);const letters=['A','B','C','D','E'];const s4=document.createElement('div');s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';const matchCard=document.createElement('div');matchCard.className='eval-item';let colLeft='<div class="eval-match-col"><h4>📌 Términos</h4>';prItems.forEach((item,i)=>{colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> <select class="eval-match-select" data-pr="${i}" aria-label="Respuesta pareada ${i+16}"><option value="">—</option>${letters.map(l=>`<option value="${l}">${l}</option>`).join('')}</select> ${item.term}</div>`;});colLeft+='</div>';let colRight='<div class="eval-match-col"><h4>🔑 Definiciones</h4>';shuffledDefs.forEach((item,i)=>{colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`;});colRight+='</div>';const ansKey=prItems.map((item,i)=>{const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)];return`${i+16}→${letter}`;}).join(' · ');matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div><div class="eval-item-feedback" id="evalFbPr" aria-live="polite"></div>`;s4.appendChild(matchCard);out.appendChild(s4);window._evalPrintData={tf:tfItems,mc:mcItems,cp:cpItems,pr:{terms:prItems,shuffledDefs,letters}};const autoPanel=document.createElement('div');autoPanel.id='evalAutoResult';autoPanel.className='eval-auto-result';autoPanel.innerHTML='<strong>🧮 Evaluación interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato original sin respuestas digitadas.';out.appendChild(autoPanel);fin('s-evaluacion');}
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación ¿Cómo sé que sé? · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.12rem 0.4rem;margin:0.22rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #784a6d;background:#f6eef4;color:#784a6d;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#784a6d;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #784a6d;height:12px;}.obt-pct{white-space:nowrap;}.qn{font-weight:700;min-width:22px;flex-shrink:0;}.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:40px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.18rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.14rem 0.35rem;margin-bottom:0.1rem;break-inside:avoid;page-break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.3;display:flex;gap:0.28rem;margin-bottom:0.07rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.1rem 0.5rem;}.mc-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:0.04rem 0.15rem;margin-left:0.8rem;}.mc-opt{font-size:9pt;display:flex;align-items:center;gap:0.15rem;}.mc-opt input{width:10px;height:10px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{margin-top:0.1rem;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.08rem 0.4rem;margin-top:0.08rem;}.pr-head{font-size:9pt;font-weight:700;color:#555;margin-bottom:0.1rem;}.pr-item{font-size:10.5pt;padding:0.1rem 0.28rem;background:#f6eef4;border-radius:3px;margin-bottom:0.07rem;display:flex;align-items:center;gap:0.2rem;line-height:1.2;break-inside:avoid;page-break-inside:avoid;}.pr-num{font-weight:700;color:#784a6d;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.22rem;padding:0.15rem 0;page-break-before:avoid;break-before:avoid;color:#784a6d;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #784a6d;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#555;}.pa{color:#007a00;font-weight:600;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · ¿Cómo sé que sé? · Educación Básica · Filosofía</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Evaluación Final · ¿Cómo sé que sé? · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u</div></div><div class="p-grid">${pR}</div>
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
  {txt:'En el recreo alguien le dijo a Yeimy que el examen de Matemáticas se había pasado para el jueves. Ella no estudió esa noche. El martes el examen estaba ahí. Sacó 40. Con esa nota se quedó fuera del cuadro de honor.'},
  {txt:'En el grupo de la aldea circula que la semilla nueva rinde el doble. Nadie dice quién la sembró ni cuántas mazorcas contó. Tres vecinos compran, y en la cosecha rinde igual que la de siempre.'},
  {txt:'Dos hermanos discuten una hora si la puerta del cuarto es más ancha que la de la cocina. Cada uno está seguro. La cinta métrica está en el mismo cuarto, colgada de un clavo.'},
  {txt:'Un muchacho dice que no le cree a nadie. Ni a los libros, ni a los maestros, ni a lo que ve. Deja de preguntar y deja de comprobar. Y cuando el aviso del maestro es de verdad, tampoco lo lee.'},
  {txt:'Una niña dice que el agua de la pila está caliente y su hermano que está fría. Los dos acaban de venir: ella del sol, él de lavar con agua helada. Se pelean media tarde por eso.'}
];
const critCaseQuestions=[
  '1. En el caso, ¿lo que se afirma se sabe, se cree o es una opinión? Di por qué.',
  '2. ¿De qué fuente venía, y en qué falló esa fuente?',
  '3. ¿A quién le cuesta, y qué pierde esa persona?',
  '4. ¿Qué habría bastado para comprobarlo? Escríbelo en un paso.'
];
const critCaseGuides=[
  'Se valora que NOMBRE el estado y dé la señal. Si no puede decir cómo lo sabe, lo cree. Si otro puede pensar lo contrario sin equivocarse, es opinión. Si puede decir con qué se comprueba, lo sabe.',
  'Las cinco fuentes son los sentidos, la memoria, lo que otro cuenta, el razonamiento y la medida. Se califica que nombre una y diga en qué falló ESA. No que diga «se equivocaron».',
  'Se califica que le ponga nombre al daño concreto. Una nota de 40, tres compras, una hora perdida, media tarde de pelea. No la indignación.',
  'Tiene que ser algo que se pueda hacer. Preguntarle al maestro, contar las mazorcas, descolgar la cinta. O meter la mano los dos a la misma agua. «Investigar más» no vale: no dice qué hacer.'
];
const critErrorBank=[
  {txt:'"Si mucha gente lo dice, entonces se sabe."',
   g1:'Cuánta gente lo dice no es una fuente: es lo que otro cuenta, repetido. Sigue faltando quien lo vio o lo midió.',
   g2:'Y eso ya se vio en la unidad 2. «Porque todo el mundo lo compra» es una razón que no sostiene. A Wilmer le costó media siembra.'},
  {txt:'"Los sentidos engañan, así que no hay que creerle a lo que se ve."',
   g1:'Los sentidos son la fuente principal y funcionan. Casi todo lo que sabés entró por ahí.',
   g2:'Lo que enseñan los cuatro engaños es cuándo cruzarlos. En los cuatro, otro sentido o una medida lo arregla en un minuto. Desconfiar de todo cuesta lo mismo que creerlo todo.'},
  {txt:'"«Esta canción es fea» está mal dicho, porque no se puede comprobar."',
   g1:'Es una opinión. Y una opinión no se comprueba. No es verdad ni mentira para todos.',
   g2:'Pedirle pruebas a un gusto es el error contrario, y cuesta igual. Lo que sí se le puede pedir es una razón. Qué de la canción no le gusta.'},
  {txt:'"Si estoy seguro, entonces lo sé."',
   g1:'Estar seguro es un sentimiento; saber es poder decir con qué se comprueba. Los dos hermanos de la puerta estaban seguros los dos.',
   g2:'La prueba del quinto paso lo separa. Si nada puede hacerte cambiar de idea, no estabas sabiendo. Estabas defendiendo.'}
];
const critDecisionBank=[
  'Te llega un mensaje de que mañana no hay clases. ¿Lo reenviás, o preguntás primero a quien lo decide?',
  'Dos compañeros discuten quién es más alto y los dos están seguros. ¿Opinás vos también, o traés la cinta?',
  'Tu tío dice que ese árbol tiene cien años. ¿Lo repetís como dato, o preguntás cómo lo sabe?',
  'Creías que de tu casa a la escuela hay diez minutos. ¿Lo dejás así, o lo medís con el reloj una vez?',
  'Alguien te dice algo que te da la razón en una discusión. ¿Lo usás de una, o buscás también quién dice lo contrario?'
];
const critDecisionGuide='Primero se pregunta de dónde salió el dato. Lo que se puede contar o medir, se mide. Lo que solo se oyó, se lleva a quien lo vio. Y lo que te da la razón se revisa igual, o no se estaba comprobando.';
const critCompareBank=[
  {a:'«En mi grado somos cuarenta y tres».',b:'«En mi grado somos como cuarenta».',
   ga:'Se sabe: se cuenta, y cualquiera puede volver a contar.',
   gb:'Se cree: es un número de memoria, sin comprobar.',
   gr:'Las dos suenan parecidas y una se puede revisar en dos minutos. Lo que las separa no es el número: es si alguien los contó.'},
  {a:'«Esa semilla rinde más».',b:'«Esa semilla me gusta más».',
   ga:'Es una creencia: se puede comprobar contando mazorcas.',
   gb:'Es una opinión: otro puede preferir la otra sin equivocarse.',
   gr:'Es la frontera de la unidad. A la primera hay que pedirle pruebas; a la segunda, una razón. Confundirlas lleva a pedirle pruebas a un gusto o a creerle a un dato sin comprobar.'},
  {a:'El lápiz que se ve quebrado en el vaso.',b:'El lápiz que se toca con la mano dentro del vaso.',
   ga:'El ojo ve lo que la luz le entrega, y la luz se dobla.',
   gb:'El tacto no se dobla: ahí el lápiz está entero.',
   gr:'No es que un sentido mienta y el otro no. Es que cada uno falla en cosas distintas, y por eso se cruzan.'},
  {a:'«2 + 2 son 4».',b:'«El techo de mi escuela es de lámina».',
   ga:'Se saca pensando con orden: es el racionalismo.',
   gb:'Hay que ir a mirarlo: es el empirismo.',
   gr:'Las dos son cosas que se saben, y por caminos distintos. Por eso la ciencia de hoy usa las dos y no elige una.'}
];
const critCauseBank=[
  {cause:'Un dato que se oyó en el recreo no dice quién lo vio.',guide:'Por eso es una creencia y no un saber. Y por eso a Yeimy le costó una nota. No preguntó cómo lo sabía quien se lo dijo.'},
  {cause:'La piel no mide grados: compara con lo que tenía antes.',guide:'Por eso la misma agua tibia se siente caliente en una mano y fría en la otra. Ahí hace falta un termómetro.'},
  {cause:'Una opinión no es verdad ni mentira para todos.',guide:'Por eso no se comprueba. Pedirle pruebas a un gusto es el error contrario a creer sin comprobar.'},
  {cause:'Si solo buscás lo que te da la razón, siempre vas a encontrarlo.',guide:'Por eso el cuarto paso manda buscar a quien diga lo contrario. Sin eso, comprobar se vuelve juntar aplausos.'},
  {cause:'La razón sola no averigua cuántos alumnos hay hoy en tu aula.',guide:'Por eso ninguna de las dos escuelas ganó. La ciencia mide con los sentidos y saca cuentas con la razón.'}
];
const critEffectBank=[
  {effect:'Tres vecinos compran una semilla que rinde igual que la de siempre.',guide:'Porque nadie preguntó quién la había sembrado ni cuántas mazorcas contó. Era una creencia que circulaba como si fuera un saber.'},
  {effect:'Dos hermanos discuten una hora con la cinta métrica colgada al lado.',guide:'Porque los dos estaban seguros, y estar seguro no es saber. La medida habría cerrado la discusión en un minuto.'},
  {effect:'Alguien deja de creerle a todo, hasta al aviso que era de verdad.',guide:'Porque de que una fuente falle a veces no se sigue que no sirva nunca. Desconfiar de todo cuesta lo mismo que creerlo todo.'},
  {effect:'Una misma tarde la cuentan distinto dos personas que estuvieron ahí.',guide:'Porque la memoria se acomoda sola. Se arregla escribiéndolo el mismo día y preguntándole al otro que estuvo.'},
  {effect:'Alguien cambia de idea cuando le muestran una medida, y no queda mal.',guide:'Porque eso es lo que hace el quinto paso: decir antes qué te haría cambiar. Cambiar por una razón mejor no es perder.'}
];
function genEvalCrit(){
  sfx('click');
  _injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });
  const _sC = document.getElementById('evalCritFormaSel');
  if (_sC && parseInt(_sC.value, 10)) evalCritFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sC.value, 10)));
  const cf=evalCritFormNum;window._currentEvalCritForm=cf;const rngC = _evalRng(200000 + cf);evalCritFormNum=(evalCritFormNum%EVAL_FORMAS)+1;_injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });saveProgress();
  document.getElementById('evalcrit-screen-title').textContent=`🧠 Pensamiento Crítico · Forma ${cf} · ¿Cómo sé que sé?`;
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
  const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Pensamiento Crítico ¿Cómo sé que sé? · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.1rem 0.4rem;margin:0.2rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #784a6d;background:#f6eef4;color:#784a6d;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#784a6d;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #784a6d;height:12px;}.obt-pct{white-space:nowrap;}.crit-print-scenario{font-size:10.5pt;background:#f6eef4;border-left:3px solid #784a6d;padding:0.2rem 0.5rem;margin:0.1rem 0 0.2rem;line-height:1.3;}.crit-print-q{font-size:10pt;font-weight:600;margin:0.15rem 0 0.08rem;line-height:1.25;}.ln{border-bottom:1px solid #111;min-height:12px;margin-bottom:2px;}.crit-compare-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin:0.15rem 0;}.crit-compare-print-box{font-size:9.5pt;background:#f6eef4;border-radius:4px;padding:0.25rem 0.4rem;line-height:1.25;}.crit-print-tbl{width:100%;border-collapse:collapse;font-size:9.5pt;margin-top:0.15rem;}.crit-print-tbl th,.crit-print-tbl td{border:1px solid #999;padding:0.3rem 0.45rem;text-align:left;height:30px;vertical-align:middle;}.crit-print-tbl th{background:#f6eef4;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.08rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.9rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.45rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.1rem;margin-bottom:0.18rem;}.p-crit-line{font-size:11pt;color:#007a00;margin-bottom:0.18rem;line-height:1.35;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.2rem;padding:0.1rem 0;color:#784a6d;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #784a6d;}.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:12.7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="critEvalPage"><div class="ph"><h2>Evaluación Competencial · Pensamiento Crítico · ¿Cómo sé que sé? · Educación Básica · Filosofía</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 5 secciones de 20 puntos</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100</span></div></div><div class="pauta-wrap" id="critPautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Pensamiento Crítico · ¿Cómo sé que sé? · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 5 secciones × 20 pts c/u — respuesta abierta, usar como guía de corrección</div></div><div class="p-grid">${pR}</div></div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("critEvalPage",250,0.55,1.2);fit("critPautaPage",250,0.55,1.2);})();<\/script></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(doc);win.document.close();setTimeout(()=>win.print(),400);
}

// ===================== LABORATORIO DE LOS SÍMBOLOS =====================
const parteData = (function () {
  /* Se arma desde js/data/filosofia-saber.js. Las cinco fuentes de lo que
     sabemos, cada una con para qué sirve, cuándo falla y con qué se arregla.
     ⚠️ El orden importa y es contenido: primero SIRVE. */
  const esc = x => String(x).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const out = {};
  SAB_FUENTES.forEach(f => {
    out[f.clave] = {
      nombre: f.nombre, icon: f.emoji,
      estructura: { title: '¿Para qué sirve?',  info: '<strong>' + esc(f.sirve) + '</strong>' },
      funcion:    { title: '¿Cuándo falla?',    info: '⚠️ ' + esc(f.falla) },
      ubicacion:  { title: '¿Con qué se arregla?', info: '🛠️ <strong>' + esc(f.arregla) + '</strong>' },
      dato:       { title: '¿Basta sola?',      info: '🔀 No. ' + esc(SAB_FUENTES_OJO) }
    };
  });
  return out;
})();
let labParte='sentidos',labAspecto='estructura';
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
function openDiploma(){sfx('fan');const pct=_diplPct();document.getElementById('diplPct').textContent=pct+'%';document.getElementById('diplBar').style.width=pct+'%';document.getElementById('diplDate').textContent='Fecha: '+new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});const msgs=['¡Seguí preguntando!','¡Muy buen trabajo!','¡Vas muy bien!','¡Ya separás creer de saber!','¡Comprobás antes de afirmar!'];document.getElementById('diplMsg').textContent=msgs[Math.min(Math.floor(pct/25),4)];const stars=['⭐','⭐⭐','⭐⭐⭐'];document.getElementById('diplStars').textContent=stars[Math.min(Math.floor(pct/40),2)];const achTxt=unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(' · ');document.getElementById('diplAch').textContent=achTxt||'Sigue completando secciones para desbloquear logros';document.getElementById('diplomaOverlay').classList.add('open');launchConfetti();}
function closeDiploma(){document.getElementById('diplomaOverlay').classList.remove('open');}
function updateDiplomaName(v){document.getElementById('diplName').textContent=v||'Estudiante';}
function shareWA(){const name=document.getElementById('diplName').textContent||'Estudiante';const pct=_diplPct();const msg=`🧩 ¡${name} completó la Misión "¿Cómo sé que sé?"! 🏅 Progreso: ${pct}% · 🌱 policastsapien.com`;_waShare(msg);}
async function captureDiploma(){if(typeof html2canvas==='undefined'){showToast('⚠️ Cargando... intenta de nuevo');return;}sfx('click');const card=document.querySelector('.diploma-card');const btn=document.querySelector('.diploma-actions .btn-pri');const toHide=[card.querySelector('.diploma-input'),card.querySelector('.diploma-actions'),card.querySelector('hr')];if(btn){btn.disabled=true;btn.textContent='⏳ Capturando...';}toHide.forEach(el=>{if(el)el.style.display='none';});let dataUrl='';try{const canvas=await html2canvas(card,{scale:2,useCORS:true,backgroundColor:'#ffffff'});toHide.forEach(el=>{if(el)el.style.display='';});dataUrl=canvas.toDataURL('image/png');const name=(document.getElementById('diplName').textContent||'Estudiante').replace(/\s+/g,'-');const fileName='constancia-'+name+'.png';const cap=window.Capacitor;if(cap&&cap.isNativePlatform&&cap.isNativePlatform()&&cap.Plugins?.Filesystem&&cap.Plugins?.Share){const base64Data=dataUrl.split(',')[1];const result=await cap.Plugins.Filesystem.writeFile({path:fileName,data:base64Data,directory:'CACHE'});await cap.Plugins.Share.share({url:result.uri,dialogTitle:'Guardar / Compartir Constancia'});}else{const a=document.createElement('a');a.href=dataUrl;a.download=fileName;a.click();}}catch(e){toHide.forEach(el=>{if(el)el.style.display='';});if(e.name!=='AbortError')showToast('⚠️ No se pudo guardar la constancia');}finally{if(btn){btn.disabled=false;btn.textContent='📷 Guardar foto';}}}

// ===================== INIT =====================

// ================ ¿CÓMO SÉ QUE SÉ?, EN LA PANTALLA ================
/* Todo se PINTA desde js/data/filosofia-saber.js. Lo que aquí se copiaría es
   el estado de cada afirmación y lo que falla de cada fuente, y eso no puede
   decir una cosa en la pantalla y otra en la ficha que se fotocopia.
   De ahí sale `_dev/verifica-filosofia.js`. */
function _esc(x){return String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

/* Los tres estados de una afirmación: el contenido 1.2 del currículo,
   «Diferencias entre los tipos de saberes». */
function pintarSabEstados(){
  const c=document.getElementById('sb-estados');if(!c)return;
  c.innerHTML=`<h2>🔬 Creer, opinar y saber no son lo mismo</h2>
    <p>${_esc(SAB_EPISTEMOLOGIA.hace)} Se llama <strong>${_esc(SAB_EPISTEMOLOGIA.nombre)}</strong>,
       y pregunta: ${_esc(SAB_EPISTEMOLOGIA.pregunta)}</p>
    <p>Son tres estados, y cada uno tiene su prueba. La prueba es una pregunta:
       se la hacés a la afirmación y ella te contesta cuál es.</p>
    <div class="sb-estados">${SAB_ESTADOS.map(e=>
      `<div class="sb-estado e-${e.clave}">
         <h4>${e.emoji} ${_esc(e.nombre)} <span class="sb-estado-et">${_esc(e.corto)}</span></h4>
         <p class="sb-estado-s">${_esc(e.senal)}</p>
         <p class="sb-estado-p"><strong>La prueba:</strong> ${_esc(e.prueba)}</p>
       </div>`).join('')}</div>
    <div class="tip"><span class="ti">🙌</span><div>${_esc(SAB_NOSE)}</div></div>
    <div class="tip"><span class="ti">⚠️</span><div>${_esc(SAB_EPISTEMOLOGIA.ojo)}</div></div>`;
}

/* Las cinco fuentes. ⚠️ Va PRIMERO para qué sirve y después cuándo falla, y
   ese orden es contenido, no maquetación: los sentidos son la fuente principal
   y funcionan. Una unidad donde todo engaña fabrica un alumno que no le cree a
   nada, y eso cuesta lo mismo que creerlo todo. */
function pintarSabFuentes(){
  const c=document.getElementById('sb-fuentes');if(!c)return;
  c.innerHTML=SAB_FUENTES.map(f=>
    `<div class="sb-fuente">
       <h3 class="sb-fuente-tit">${f.emoji} ${_esc(f.nombre)}</h3>
       <div class="sb-fuente-l sirve">✅ <strong>Sirve para esto:</strong> ${_esc(f.sirve)}</div>
       <div class="sb-fuente-l falla">⚠️ <strong>Falla aquí:</strong> ${_esc(f.falla)}</div>
       <p class="sb-fuente-a">🛠️ ${_esc(f.arregla)}</p>
     </div>`).join('')
    +`<div class="tip"><span class="ti">🔀</span><div>${_esc(SAB_FUENTES_OJO)}</div></div>`;
}

/* ⚠️ Los cuatro engaños se HACEN, no se leen: por eso lo primero de cada
   tarjeta es lo que el alumno tiene que hacer con lo que hay en su casa. Y
   cada uno dice qué lo desarma, porque un engaño sin salida solo asusta. */
function pintarSabEnganos(){
  const c=document.getElementById('sb-enganos');if(!c)return;
  c.innerHTML=SAB_ENGANOS.map(e=>
    `<div class="sb-eng">
       <h3 class="sb-eng-tit">${e.emoji} ${_esc(e.titulo)}</h3>
       <p class="sb-eng-h"><strong>Hacelo:</strong> ${_esc(e.hace)}</p>
       <p class="sb-eng-v"><strong>Vas a ver:</strong> ${_esc(e.ves)}</p>
       <p class="sb-eng-q"><strong>Qué pasa de verdad:</strong> ${_esc(e.pasa)}</p>
       <p class="sb-eng-d">🛠️ ${_esc(e.desarma)}</p>
     </div>`).join('')
    +`<div class="tip"><span class="ti">👀</span><div>${_esc(SAB_ENGANOS_OJO)}</div></div>`;
}

function pintarSabPasos(){
  const c=document.getElementById('sb-pasos');if(!c)return;
  c.innerHTML=`<h2>🪜 Cinco pasos para comprobar algo</h2>
    <p>Sirven para cualquier cosa que alguien afirme: en la casa, en el grupo
       o en un anuncio. El quinto es el que cuesta.</p>
    <div class="sb-pasos">${SAB_PASOS.map(p=>
      `<div class="sb-paso"><div class="sb-paso-n">${p.n}</div>
         <div class="sb-paso-t"><b>${_esc(p.paso)}</b><span>${_esc(p.porque)}</span></div>
       </div>`).join('')}</div>`;
}

/* Las dos escuelas que el currículo manda COMPARAR, una al lado de la otra.
   Y con el final honesto: no hay que elegir, hoy se usan las dos. */
function pintarSabEscuelas(){
  const c=document.getElementById('sb-escuelas');if(!c)return;
  c.innerHTML=`<h2>⚖️ Dos respuestas, y las dos se usan</h2>
    <p>¿De dónde sale lo que sabemos: de la razón o de los sentidos? Hubo dos
       respuestas, y cada una acierta en algo.</p>
    <div class="sb-esc">${SAB_ESCUELAS.map(e=>
      `<div class="${e.clave}">
         <h4>${e.emoji} ${_esc(e.nombre)}</h4>
         <span class="dice">${_esc(e.dice)}</span>
         <span class="ok">✅ Acierta: ${_esc(e.acierta)}</span>
         <span class="no">⚠️ Se queda corto: ${_esc(e.corto)}</span>
       </div>`).join('')}</div>
    <div class="tip"><span class="ti">🤝</span><div>${_esc(SAB_ESCUELAS_OJO)}</div></div>`;
}

/* ⚠️ La investigación NO trae respuestas, y el aviso va en la pantalla y en el
   papel: sin él se lee como un descuido y alguien se la salta. */
function pintarSabInvestiga(){
  const c=document.getElementById('sb-investiga');if(!c)return;
  c.innerHTML=`<h2>🔎 Esto se averigua donde vivís</h2>
    <div class="tip"><span class="ti">⚠️</span><div>${_esc(SAB_INVESTIGA.aviso)}</div></div>
    <ol class="sb-inv">${SAB_INVESTIGA.preguntas.map(p=>`<li>${_esc(p)}</li>`).join('')}</ol>
    <div class="tip"><span class="ti">🤲</span><div>${_esc(SAB_INVESTIGA.cuidado)}</div></div>`;
}

function pintarSabArbol(){
  const c=document.getElementById('sb-arbol');if(!c)return;
  c.innerHTML=`<div class="sb-arbol">${SAB_ARBOL.map(a=>
    `<div><b>${a.emoji} ${_esc(a.materia)}</b>
     <span class="le">${_esc(a.le)}</span>
     <span class="hoy"><strong>Pruébalo hoy:</strong> ${_esc(a.hoy)}</span></div>`).join('')}</div>`;
}

function pintarSabPensadores(){
  const c=document.getElementById('sb-pensadores');if(!c)return;
  c.innerHTML=SAB_PENSADORES.map(p=>
    `<div class="sb-pens">
       <h3 class="sb-pens-tit">${p.emoji} ${_esc(p.nombre)}</h3>
       <p class="sb-pens-donde">${_esc(p.donde)}</p>
       <p class="sb-pens-quien">${_esc(p.quien)}</p>
       <p class="sb-pens-sub">Qué hizo</p>
       <p class="sb-pens-l">${_esc(p.hizo)}</p>
       <p class="sb-pens-sub">Por qué se le recuerda</p>
       <p class="sb-pens-l">${_esc(p.porque)}</p>
       <p class="sb-pens-dato"><strong>Dato:</strong> ${_esc(p.dato)}</p>
     </div>`).join('');
}


window.addEventListener('DOMContentLoaded',()=>{
  initTheme();
  loadProgress();
  pintarSabEstados();
  pintarSabFuentes();
  pintarSabEnganos();
  pintarSabPasos();
  pintarSabEscuelas();
  pintarSabInvestiga();
  pintarSabArbol();
  pintarSabPensadores();
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
