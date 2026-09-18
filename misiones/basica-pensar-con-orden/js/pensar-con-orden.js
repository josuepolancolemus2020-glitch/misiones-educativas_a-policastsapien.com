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
const SAVE_KEY='filosofia_logica_v1';
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
  primer_quiz:{icon:'🏅',label:'Primer quiz de la lógica superado'},
  flash_master:{icon:'🃏',label:'Se sabe las piezas de un argumento'},
  clasif_pro:{icon:'🚦',label:'Sabe leer el semáforo de razones'},
  id_master:{icon:'🔍',label:'Encuentra la razón y la conclusión'},
  reto_hero:{icon:'🏆',label:'Campeón del reto de las razones'},
  nivel3:{icon:'🎖️',label:'¡Ya pide razones! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡Caza falacias! Nivel 6'},
  widgets_master:{icon:'🧩',label:'Widgets de la lógica dominados'}
};
function unlockAchievement(id){if(unlockedAch.includes(id))return;unlockedAch.push(id);sfx('ach');showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label);launchConfetti();renderAchPanel();saveProgress();}
function renderAchPanel(){const list=document.getElementById('achList');list.innerHTML='';Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{const div=document.createElement('div');div.className='ach-item'+(unlockedAch.includes(id)?'':' locked');div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`;list.appendChild(div);});}
function toggleAchPanel(){sfx('click');document.getElementById('achPanel').classList.toggle('open');}
function showToast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}t.textContent=msg;t.style.display='block';clearTimeout(t._tid);t._tid=setTimeout(()=>t.style.display='none',3200);}
function launchConfetti(){const colors=['#784a6d','#b9789f','#1d4538','#3f8a6d','#f59e0b'];for(let i=0;i<60;i++){const c=document.createElement('div');c.className='confetti-piece';c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`;document.body.appendChild(c);c.addEventListener('animationend',()=>c.remove());}}

// ===================== XP =====================
const lvls=[{t:0,n:'Aprendiz 🌱'},{t:25,n:'Da un porque 💬'},{t:55,n:'Encuentra la conclusión 🎯'},{t:90,n:'Lee el semáforo 🚦'},{t:130,n:'Usa el si… entonces 🔗'},{t:165,n:'Caza falacias 🕵️'},{t:190,n:'Piensa con orden 🏆'}];
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
  LOG_VOCABULARIO.forEach(v => out.push({ w: v.w, a: v.a }));
  LOG_PIEZAS.forEach(p => out.push({
    w: p.emoji + ' ' + p.nombre,
    a: p.que + ' ' + p.donde + ' <em>' + p.ejemplo + '</em>' }));
  LOG_SEMAFORO.forEach(s => out.push({
    w: s.emoji + ' Razón que ' + s.nombre.toLowerCase(),
    a: s.senal + ' <strong>' + s.prueba + '</strong>' }));
  LOG_FALACIAS.forEach(f => out.push({
    w: f.emoji + ' ' + f.nombre,
    a: f.mecanismo + ' Suena así: <em>' + f.suena + '</em> La desarma: <strong>' + f.desarma + '</strong>' }));
  LOG_PENSADORES.forEach(p => out.push({
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
  {q:'En «no salgas, porque el río viene crecido», ¿cuál es la razón?',o:['No salgas','Que el río viene crecido','Las dos'],c:1},
  {q:'¿Qué palabra suele ir delante de la conclusión?',o:['Así que','Porque','Mientras'],c:0},
  {q:'«Porque yo lo digo». ¿De qué color es en el semáforo?',o:['Verde: sirve','Amarillo: ayuda poco','Rojo: no es una razón'],c:2},
  {q:'«Porque conté los sacos y faltan tres». ¿De qué color es?',o:['Verde: sirve','Amarillo: ayuda poco','Rojo: no es una razón'],c:0},
  {q:'«Porque el saco es más caro». ¿De qué color es?',o:['Amarillo: ayuda poco','Verde: sirve','Rojo: no es una razón'],c:0},
  {q:'La regla es «si llueve, la cancha se moja». La cancha está mojada. ¿Se puede concluir que llovió?',o:['Sí, siempre','No: alguien pudo regarla','Solo en invierno'],c:1},
  {q:'¿Puede un argumento estar bien hecho y llegar a algo falso?',o:['No, nunca','Solo si tiene tres razones','Sí, si una de sus razones es falsa'],c:2},
  {q:'«No le creas, si ni terminó la escuela». ¿Qué falacia es?',o:['Falso dilema','Apelación a la mayoría','Contra la persona'],c:2},
  {q:'«O te vas a la ciudad o te quedás sin futuro». ¿Qué falacia es?',o:['Falso dilema','Generalización apresurada','Contra la persona'],c:0},
  {q:'«En ese pueblo son tramposos: me tocaron dos». ¿Qué falacia es?',o:['Apelación a la mayoría','Generalización apresurada','Falso dilema'],c:1},
  {q:'¿Con qué pregunta se desarma la apelación a la mayoría?',o:['¿Y quién lo dice?','Si todo el mundo se equivoca, ¿deja de ser un error?','¿Cuándo pasó?'],c:1},
  {q:'¿Qué fue lo nuevo que hizo Aristóteles?',o:['Escribió cuentos','Inventó las tablas de multiplicar','Puso en orden las formas del razonamiento'],c:2}
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
  const fi = (arr, t) => arr.map(r => ({ w: r, t: t }));
  const verde = logDeColor('verde'), amar = logDeColor('amarillo'), rojo = logDeColor('rojo');
  return [
    { label:['Sostiene lo que dice','No lo sostiene'], headA:'🟢 Sostiene', headB:'🟡🔴 No sostiene', colA:'si', colB:'no',
      words: fi(verde.slice(0,4),'si').concat(fi(amar.slice(0,2),'no'), fi(rojo.slice(0,2),'no')) },
    { label:['Ayuda poco, pero se puede examinar','No es una razón: no hay nada que examinar'], headA:'🟡 Ayuda poco', headB:'🔴 No es razón', colA:'amar', colB:'rojo',
      words: fi(amar.slice(2,6),'amar').concat(fi(rojo.slice(2,6),'rojo')) },
    { label:['Es la razón','Es la conclusión'], headA:'🧱 La razón', headB:'🎯 La conclusión', colA:'raz', colB:'con',
      words:[{w:'El río viene crecido',t:'raz'},{w:'No salgas',t:'con'},
             {w:'Faltan tres sacos',t:'raz'},{w:'Alguien se los llevó',t:'con'},
             {w:'La cancha está mojada',t:'raz'},{w:'No se puede jugar hoy',t:'con'},
             {w:'El bus ya pasó',t:'raz'},{w:'Hay que irse caminando',t:'con'}] },
    { label:['Está bien hecho','Está mal hecho'], headA:'✅ Bien hecho', headB:'❌ Mal hecho', colA:'bien', colB:'mal',
      words: LOG_VALIDEZ.map(v => ({ w: v.conclusion, t: v.bienHecho ? 'bien' : 'mal' }))
             .concat([{w:'Llovió, así que la cancha está mojada',t:'bien'},
                      {w:'La cancha está mojada, así que llovió',t:'mal'},
                      {w:'Todos los pinos son árboles, así que este pino es un árbol',t:'bien'},
                      {w:'El mango es un árbol, así que el mango es un pino',t:'mal'}]) }
  ];
})();
let currentClassGroupIdx=0,clsSelectedWord=null;
function buildClass(){const group=classGroups[currentClassGroupIdx];document.getElementById('col-left-head').textContent=group.headA;document.getElementById('col-right-head').textContent=group.headB;const bank=document.getElementById('clsBank');bank.innerHTML='';clsSelectedWord=null;document.getElementById('items-left').innerHTML='';document.getElementById('items-right').innerHTML='';_shuffle([...group.words]).forEach(w=>{const el=document.createElement('div');el.className='wb-item';el.textContent=w.w;el.dataset.t=w.t;el.onclick=()=>{document.querySelectorAll('.wb-item').forEach(i=>i.classList.remove('sel-word'));el.classList.add('sel-word');clsSelectedWord=el;sfx('click');};bank.appendChild(el);});['col-left','col-right'].forEach(colId=>{const col=document.getElementById(colId);col.onclick=(e)=>{if(!clsSelectedWord||e.target.classList.contains('drop-item'))return;const targetId=colId==='col-left'?'items-left':'items-right';const wordsCol=document.getElementById(targetId);const item=document.createElement('div');item.className='drop-item';item.textContent=clsSelectedWord.textContent;item.dataset.t=clsSelectedWord.dataset.t;const original=clsSelectedWord;item.onclick=(ev)=>{ev.stopPropagation();if(clsSelectedWord!==null){col.click();}else{document.getElementById('clsBank').appendChild(original);original.classList.remove('sel-word');item.remove();if(typeof sfx==='function')sfx('click');}};wordsCol.appendChild(item);clsSelectedWord.remove();clsSelectedWord=null;sfx('click');};});}
function checkClass(){const remaining=document.querySelectorAll('#clsBank .wb-item').length;if(remaining>0){fb('fbCls','Mueve todas las palabras a las columnas primero.',false);return;}const group=classGroups[currentClassGroupIdx];let allOk=true;document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{const inLeft=el.parentElement.id==='items-left';const expectedType=inLeft?group.colA:group.colB;if(el.dataset.t===expectedType){el.classList.add('cls-ok');}else{el.classList.add('cls-no');allOk=false;}});if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);}if(allOk){fb('fbCls','¡Perfecto! +5 XP',true);sfx('fan');fin('s-clasifica');unlockAchievement('clasif_pro');}else{fb('fbCls','Hay errores. Los errados llevan ✗.',false);sfx('no');}}
function nextClassGroup(){sfx('click');currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length;buildClass();document.getElementById('fbCls').classList.remove('show');showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]);}
function resetClass(){sfx('click');buildClass();document.getElementById('fbCls').classList.remove('show');}

// ===================== IDENTIFICAR =====================
const idData=[
  {s:['No','salgas,','porque','el','río','viene','crecido.'],c:2,art:'La palabra que anuncia la razón'},
  {s:['El','río','viene','crecido,','así','que','no','salgas.'],c:4,art:'Las palabras que anuncian la conclusión'},
  {s:['Un','argumento','es','una','razón','amarrada','a','una','conclusión.'],c:1,art:'El nombre de una razón y una conclusión juntas'},
  {s:['Una','falacia','parece','buena','y','no','sostiene','nada.'],c:1,art:'El nombre de un argumento que engaña'},
  {s:['Decir','dos','cosas','que','no','pueden','ser','verdad','a','la','vez','es','una','contradicción.'],c:13,art:'El nombre de decir dos cosas que se pelean'},
  {s:['La','validez','es','que','el','armado','esté','bien.'],c:1,art:'El nombre de que el armado esté bien'},
  {s:['Si','llueve,','entonces','la','cancha','se','moja.'],c:2,art:'La palabra que marca lo que viene después de la condición'},
  {s:['El','río','bajó;','sin','embargo,','el','puente','sigue','roto.'],c:4,art:'Las palabras que anuncian una objeción'}
];
let idIdx=0,idDone=false;
function showId(){idDone=false;if(idIdx>=idData.length){document.getElementById('idSent').innerHTML='🎉 ¡Completado!';fin('s-identifica');unlockAchievement('id_master');return;}const d=idData[idIdx];document.getElementById('idProg').textContent=`Oración ${idIdx+1} de ${idData.length}`;document.getElementById('idInfo').textContent=`Busca: ${d.art}`;const sent=document.getElementById('idSent');sent.innerHTML='';d.s.forEach((w,i)=>{const span=document.createElement('span');span.className='id-word';span.textContent=w+' ';span.onclick=()=>checkId(i,span);sent.appendChild(span);});}
function checkId(i,span){if(idDone)return;document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected'));span.classList.add('selected');if(i===idData[idIdx].c){idDone=true;span.classList.add('id-ok');fb('fbId','¡Correcto! +5 XP',true);if(!xpTracker.id.has(idIdx)){xpTracker.id.add(idIdx);pts(5);}sfx('ok');}else{span.classList.add('id-no');fb('fbId','Ese no es el término solicitado.',false);sfx('no');}}
function nextId(){sfx('click');idIdx++;showId();document.getElementById('fbId').classList.remove('show');}
function resetId(){sfx('click');idIdx=0;showId();document.getElementById('fbId').classList.remove('show');}

// ===================== COMPLETA =====================
const cmpData=[
  {s:'La palabra que anuncia la razón es ___.',opts:['porque','mientras','aunque'],c:0},
  {s:'Las palabras que anuncian la conclusión son ___.',opts:['a pesar de','así que','en cambio'],c:1},
  {s:'Una razón y una conclusión amarradas forman un ___.',opts:['cuento','poema','argumento'],c:2},
  {s:'Un argumento que parece bueno y no sostiene nada es una ___.',opts:['falacia','fábula','fórmula'],c:0},
  {s:'Que el armado de un argumento esté bien se llama ___.',opts:['bondad','validez','belleza'],c:1},
  {s:'Atacar a quien habla en vez de a lo que dice es la falacia contra la ___.',opts:['regla','ley','persona'],c:2},
  {s:'Sacar una regla de dos o tres casos es una generalización ___.',opts:['apresurada','completa','antigua'],c:0},
  {s:'Ofrecer dos salidas como si no hubiera más es un falso ___.',opts:['amigo','dilema','paso'],c:1},
  {s:'Decir dos cosas que no pueden ser verdad a la vez es una ___.',opts:['comparación','conclusión','contradicción'],c:2}
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
  { label: 'Ordena: cómo se examina un argumento',
    steps: ['1. Busca la conclusión: ¿qué quieren que crea?',
            '2. Busca la razón: ¿con qué lo sostienen?',
            '3. Mira el semáforo: ¿esa razón sirve, ayuda poco o no es razón?',
            '4. Pregúntate: si la razón fuera verdad, ¿tendría que serlo la conclusión?',
            '5. Decide: le creo, le pido otra razón, o le digo por qué no me convence.'] },
  { label: 'Ordena: de una regla a una conclusión que se sostiene',
    steps: ['1. La regla: si llueve, la cancha se moja.',
            '2. El hecho: llovió.',
            '3. La regla se aplica en su sentido, no al revés.',
            '4. La conclusión: la cancha está mojada.'] }
];
let currentRouteIdx=0,routeItems=[];
function buildRoute(){routeItems=_shuffle([...routeSets[currentRouteIdx].steps]);renderRoute();const fbEl=document.getElementById('fbRoute');if(fbEl)fbEl.classList.remove('show');}
function renderRoute(){const list=document.getElementById('routeList');if(!list)return;list.innerHTML='';routeItems.forEach((step,i)=>{const div=document.createElement('div');div.className='sort-item';div.innerHTML=`<div class="sort-arrows"><button class="sort-arrow" onclick="routeMove(${i},-1)"${i===0?' disabled':''}>▲</button><button class="sort-arrow" onclick="routeMove(${i},1)"${i===routeItems.length-1?' disabled':''}>▼</button></div><div class="sort-step-num">${i+1}.</div><div class="sort-item-txt">${step}</div>`;list.appendChild(div);});}
function routeMove(idx,dir){sfx('click');const ni=idx+dir;if(ni<0||ni>=routeItems.length)return;[routeItems[idx],routeItems[ni]]=[routeItems[ni],routeItems[idx]];renderRoute();}
function checkRoute(){const correct=routeSets[currentRouteIdx].steps;const isOk=routeItems.every((s,i)=>s===correct[i]);if(isOk){fb('fbRoute','¡Perfecto! Orden correcto. +4 XP',true);if(!xpTracker.wgt.has('route_'+currentRouteIdx)){xpTracker.wgt.add('route_'+currentRouteIdx);pts(4);}sfx('fan');fin('s-widgets');unlockAchievement('widgets_master');}else{fb('fbRoute','Hay pasos fuera de orden. Revisa el arreglo.',false);sfx('no');}}
function nextRoute(){sfx('click');currentRouteIdx=(currentRouteIdx+1)%routeSets.length;buildRoute();showToast('🔄 Secuencia: '+routeSets[currentRouteIdx].label);}

// Widget 2: Identifica el concepto
const neuronPartes = (function () {
  const opts = LOG_SEMAFORO.map(s => s.emoji + ' ' + s.nombre);
  const nom = c => logColor(c).emoji + ' ' + logColor(c).nombre;
  /* Se toman las de la mitad de la lista en adelante: las primeras ya salen
     en el Clasifica, y repetir las mismas no enseña nada nuevo. */
  const elegidas = [];
  ['verde','amarillo','rojo'].forEach(c => {
    logDeColor(c).slice(6, 9).forEach(r => elegidas.push({ r: r, c: c }));
  });
  return elegidas.map(x => ({ desc: x.r, opts: opts.slice(), ans: nom(x.c) }));
})();
let neuronIdx=0,neuronDone=false;
function showNeuron(){neuronDone=false;if(neuronIdx>=neuronPartes.length){const el=document.getElementById('neuronDesc');if(el)el.textContent='🎉 ¡Ya reconoces a cada uno por lo que hizo!';const opts=document.getElementById('neuronOpts');if(opts)opts.innerHTML='';fin('s-widgets');return;}const d=neuronPartes[neuronIdx];const prog=document.getElementById('neuronProg');if(prog)prog.textContent=`Pista ${neuronIdx+1} de ${neuronPartes.length}`;const desc=document.getElementById('neuronDesc');if(desc)desc.textContent=d.desc;const opts=document.getElementById('neuronOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=opt;b.onclick=()=>checkNeuron(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuron');if(fbEl)fbEl.classList.remove('show');}
function checkNeuron(opt,btn,d){if(neuronDone)return;neuronDone=true;document.querySelectorAll('#neuronOpts .cmp-opt').forEach(b=>{if(b.textContent===d.ans)b.classList.add('correct');else if(b===btn&&b.textContent!==d.ans)b.classList.add('wrong');});const isOk=opt===d.ans;if(isOk){fb('fbNeuron','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuron_'+neuronIdx)){xpTracker.wgt.add('neuron_'+neuronIdx);pts(3);}sfx('ok');}else{fb('fbNeuron','La respuesta correcta es: '+d.ans,false);sfx('no');}}
function nextNeuron(){sfx('click');neuronIdx++;showNeuron();}
function resetNeuron(){sfx('click');neuronIdx=0;showNeuron();}

// Widget 3: Concepto → Significado
const neuroPairs = LOG_FALACIAS.map(f => ({
  trans: f.suena,
  func: f.emoji + ' ' + f.nombre,
  opts: LOG_FALACIAS.map(x => x.emoji + ' ' + x.nombre)
}));
let neuroIdx=0,neuroDone=false;
function showNeuro(){neuroDone=false;if(neuroIdx>=neuroPairs.length){const el=document.getElementById('neuroTrans');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('neuroOpts');if(opts)opts.innerHTML='';return;}const d=neuroPairs[neuroIdx];const prog=document.getElementById('neuroProg');if(prog)prog.textContent=`${neuroIdx+1} de ${neuroPairs.length}`;const trans=document.getElementById('neuroTrans');if(trans)trans.textContent=d.trans;const opts=document.getElementById('neuroOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkNeuro(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuro');if(fbEl)fbEl.classList.remove('show');}
function checkNeuro(opt,btn,d){if(neuroDone)return;neuroDone=true;document.querySelectorAll('#neuroOpts .qz-opt').forEach(b=>{if(b.textContent===d.func)b.classList.add('correct');else if(b===btn&&b.textContent!==d.func)b.classList.add('wrong');});const isOk=opt===d.func;if(isOk){fb('fbNeuro','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuro_'+neuroIdx)){xpTracker.wgt.add('neuro_'+neuroIdx);pts(3);}sfx('ok');}else{fb('fbNeuro','Correcto: '+d.func,false);sfx('no');}setTimeout(()=>{neuroIdx++;showNeuro();},1800);}
function resetNeuro(){sfx('click');neuroIdx=0;showNeuro();}

// Widget 4: Fuente → ¿Renovable o no renovable?
const enfermedadData = (function () {
  /* La pregunta que de verdad cuesta: ¿está BIEN HECHO? No «¿es verdad?».
     Son las dos cosas que la unidad viene a separar. */
  const opts = ['✅ Está bien hecho', '❌ Está mal hecho'];
  return LOG_VALIDEZ.map(v => ({
    disease: v.razones.join(' ') + ' ' + v.conclusion,
    characteristic: v.bienHecho ? opts[0] : opts[1],
    opts: opts.slice()
  })).concat([
    { disease: 'Si llueve, la cancha se moja. Llovió. Así que la cancha está mojada.',
      characteristic: opts[0], opts: opts.slice() },
    { disease: 'Si llueve, la cancha se moja. La cancha está mojada. Así que llovió.',
      characteristic: opts[1], opts: opts.slice() },
    { disease: 'Todos los pinos son árboles. El de la entrada es un pino. Así que es un árbol.',
      characteristic: opts[0], opts: opts.slice() },
    { disease: 'Todos los pinos son árboles. El mango es un árbol. Así que el mango es un pino.',
      characteristic: opts[1], opts: opts.slice() }
  ]);
})();
let enferIdx=0,enferDone=false;
function showEnfer(){enferDone=false;if(enferIdx>=enfermedadData.length){const el=document.getElementById('enferDisease');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('enferOpts');if(opts)opts.innerHTML='';return;}const d=enfermedadData[enferIdx];const prog=document.getElementById('enferProg');if(prog)prog.textContent=`${enferIdx+1} de ${enfermedadData.length}`;const dis=document.getElementById('enferDisease');if(dis)dis.textContent=d.disease;const opts=document.getElementById('enferOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkEnfer(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbEnfer');if(fbEl)fbEl.classList.remove('show');}
function checkEnfer(opt,btn,d){if(enferDone)return;enferDone=true;document.querySelectorAll('#enferOpts .qz-opt').forEach(b=>{if(b.textContent===d.characteristic)b.classList.add('correct');else if(b===btn&&b.textContent!==d.characteristic)b.classList.add('wrong');});const isOk=opt===d.characteristic;if(isOk){fb('fbEnfer','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('enfer_'+enferIdx)){xpTracker.wgt.add('enfer_'+enferIdx);pts(3);}sfx('ok');}else{fb('fbEnfer','Correcto: '+d.characteristic,false);sfx('no');}setTimeout(()=>{enferIdx++;showEnfer();},1800);}
function resetEnfer(){sfx('click');enferIdx=0;showEnfer();}

// ===================== RETO FINAL =====================
const retoPairs = (function () {
  const fi = (arr, t) => arr.map(r => ({ w: r, t: t }));
  const verde = logDeColor('verde'), amar = logDeColor('amarillo'), rojo = logDeColor('rojo');
  return [
    { label:['Sostiene lo que dice','No lo sostiene'], btnA:'🟢 Sostiene', btnB:'🟡🔴 No sostiene', colA:'si', colB:'no',
      words: fi(verde,'si').concat(fi(amar.slice(0,5),'no'), fi(rojo.slice(0,5),'no')) },
    { label:['Ayuda poco, pero se puede examinar','No es una razón: no hay nada que examinar'], btnA:'🟡 Ayuda poco', btnB:'🔴 No es razón', colA:'amar', colB:'rojo',
      words: fi(amar,'amar').concat(fi(rojo,'rojo')) },
    { label:['Es la razón','Es la conclusión'], btnA:'🧱 Razón', btnB:'🎯 Conclusión', colA:'raz', colB:'con',
      words:[{w:'El río viene crecido',t:'raz'},{w:'No salgas',t:'con'},
             {w:'Faltan tres sacos',t:'raz'},{w:'Alguien se los llevó',t:'con'},
             {w:'La cancha está mojada',t:'raz'},{w:'No se puede jugar hoy',t:'con'},
             {w:'El bus ya pasó',t:'raz'},{w:'Hay que irse caminando',t:'con'},
             {w:'El pan está duro',t:'raz'},{w:'No lo compres',t:'con'}] }
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
  {s:'«No salgas, porque el río viene crecido»: la razón es que el río viene crecido.',type:'la razón'},
  {s:'«El río viene crecido, así que no salgas»: la conclusión es que no salgas.',type:'la conclusión'},
  {s:'Una razón amarrada a una conclusión es un argumento.',type:'argumento'},
  {s:'Un argumento que parece bueno y no sostiene nada es una falacia.',type:'falacia'},
  {s:'Que el armado esté bien se llama validez.',type:'validez'},
  {s:'Decir dos cosas que no pueden ser verdad a la vez es una contradicción.',type:'contradicción'},
  {s:'«No le creas, si ni terminó la escuela» es la falacia contra la persona.',type:'contra la persona'},
  {s:'«Me tocaron dos y por eso todos son así» es una generalización apresurada.',type:'generalización apresurada'},
  {s:'«O esto o aquello, no hay más» es un falso dilema.',type:'falso dilema'},
  {s:'«Compralo, si todo el mundo lo compra» es una apelación a la mayoría.',type:'apelación a la mayoría'},
  {s:'Aristóteles puso en orden las formas del razonamiento.',type:'Aristóteles'},
  {s:'Lewis Carroll enseñaba lógica con juegos y acertijos.',type:'Lewis Carroll'}
];
const classifyTaskDB=[
  {w:'La razón',gen:'Sostiene lo otro',n:'Va después de «porque»',g:'Se puede examinar',t:'Sin ella solo hay una afirmación'},
  {w:'La conclusión',gen:'Lo que quieren que creas',n:'Va después de «así que»',g:'Es a donde apunta todo',t:'Búscala primero, siempre'},
  {w:'Razón verde',gen:'Sirve',n:'Se puede comprobar o discutir',g:'Sostiene de verdad lo que dice',t:'Ejemplo: conté los sacos y faltan tres'},
  {w:'Razón amarilla',gen:'Ayuda poco',n:'Puede ser verdad',g:'No sostiene lo que se quiere probar',t:'Ejemplo: porque el saco es más caro'},
  {w:'Razón roja',gen:'No es una razón',n:'No hay nada que examinar',g:'Es quien manda o cuánta gente lo dice',t:'Ejemplo: porque yo lo digo'},
  {w:'Contra la persona',gen:'Falacia',n:'Ataca a quien habla',g:'Deja fuera la razón buena del que no tiene títulos',t:'Se desarma pidiendo la razón, no el título'},
  {w:'Generalización apresurada',gen:'Falacia',n:'Saca una regla de dos casos',g:'Así se arman las famas de un barrio',t:'Se desarma preguntando de cuántos'},
  {w:'Falso dilema',gen:'Falacia',n:'Ofrece dos salidas como si no hubiera más',g:'Hace decidir con miedo',t:'Se desarma nombrando una tercera'},
  {w:'Apelación a la mayoría',gen:'Falacia',n:'Ofrece como razón cuánta gente lo hace',g:'Le costó a Wilmer la mitad de la siembra',t:'Se desarma pidiendo una razón de la cosa'},
  {w:'Validez',gen:'Que el armado esté bien',n:'No es lo mismo que verdad',g:'Se puede tener y estar mintiendo',t:'Si una razón es falsa, la conclusión sale falsa'}
];
const completeTaskDB=[
  {s:'La palabra que anuncia la razón es ___.',ans:'porque'},
  {s:'Las palabras que anuncian la conclusión son ___.',ans:'así que'},
  {s:'Una razón y una conclusión amarradas forman un ___.',ans:'argumento'},
  {s:'Un argumento que parece bueno y no sostiene nada es una ___.',ans:'falacia'},
  {s:'Que el armado esté bien se llama ___.',ans:'validez'},
  {s:'Atacar a quien habla es la falacia contra la ___.',ans:'persona'},
  {s:'Sacar una regla de dos casos es una generalización ___.',ans:'apresurada'},
  {s:'Ofrecer dos salidas como si no hubiera más es un falso ___.',ans:'dilema'},
  {s:'Decir dos cosas que se pelean es una ___.',ans:'contradicción'},
  {s:'El que puso en orden las formas del razonamiento fue ___.',ans:'Aristóteles'}
];
const explainQuestions=[
  {q:'¿Cuáles son las tres piezas de un argumento y cómo se reconoce cada una?',ans:'La razón, la conclusión y el nexo. La razón sostiene, y suele ir después de «porque». La conclusión es lo que quieren que creas, y va tras «así que». El nexo las amarra, y dice cuál es cuál.'},
  {q:'Explica el semáforo de razones con un ejemplo de cada color.',ans:'Verde: sirve, se puede comprobar y sostiene («conté los sacos y faltan tres»). Amarillo: puede ser verdad pero no sostiene lo que se quiere probar («el saco es más caro»). Rojo: no hay nada que examinar («porque yo lo digo»).'},
  {q:'La cancha está mojada. ¿Se puede concluir que llovió? Explica.',ans:'No. La regla dice que si llueve, la cancha se moja. No dice que SOLO la lluvia la moje: alguien pudo regarla o se reventó un tubo. La regla va en un sentido, y leerla al revés es el error más común.'},
  {q:'¿Puede un argumento estar bien hecho y llegar a algo falso? Explica con un ejemplo.',ans:'Sí. «Todos los peces vuelan. La tilapia es un pez. Así que la tilapia vuela.» El armado es perfecto y la conclusión es falsa. La culpa no es del armado: la primera razón es mentira. Estar bien hecho y ser verdad son dos cosas.'},
  {q:'Escoge una falacia y explica cómo se desarma.',ans:'Respuesta abierta con una de las cuatro. Se valora que diga el MECANISMO y la PREGUNTA. Contra la persona: ¿y qué tiene que ver quién lo dice? Apresurada: ¿cuántos casos, de cuántos? Falso dilema: ¿solo hay dos?'},
  {q:'¿Por qué se dice que la lógica es la gramática del pensamiento?',ans:'Porque no dice QUÉ pensar: dice cómo se arman las ideas para que se sostengan. La gramática no elige las palabras y aun así decide si la oración se entiende. Aristóteles vio que hay armados que funcionan siempre, sin importar de qué se hable.'},
  {q:'Trae una razón que te hayan dado esta semana y clasifícala.',ans:'Respuesta abierta. Se valora que copie la razón tal como se la dieron, que le ponga color y que diga POR QUÉ. Si es roja, que diga qué pregunta haría para pedir una razón de verdad.'},
  {q:'¿Qué le da la lógica a las Matemáticas, al Español y a las Ciencias Naturales?',ans:'A Matemáticas, la demostración: un resultado vale porque se sigue de lo anterior. A Español, el texto argumentativo con sus conectores. A Ciencias Naturales, la inferencia: sacar una conclusión de lo observado, y saber qué NO se sigue.'},
  {q:'Le dicen a alguien que compre lo caro «porque todo el mundo lo compra». ¿Qué le responderías?',ans:'Respuesta abierta. Se valora que nombre la falacia: apelación a la mayoría. Y que pida una razón de la cosa, no del gentío: en qué es mejor, cómo se comprueba. El precio cuenta: a Wilmer le costó media siembra.'}
];
let ansVisible=false;
function genTask(){sfx('click');const type=document.getElementById('tgType').value;const count=parseInt(document.getElementById('tgCount').value);ansVisible=false;const out=document.getElementById('tgOut');out.innerHTML='';if(type==='identify')genIdentifyTask(out,count);else if(type==='classify')genClassifyTask(out,count);else if(type==='complete')genCompleteTask(out,count);else if(type==='explain')genExplainTask(out,count);fin('s-tareas');}
function _instrBlock(out,title,lines){const ib=document.createElement('div');ib.className='tg-instruction-block';ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join('');out.appendChild(ib);}
function genIdentifyTask(out,count){_instrBlock(out,'Instrucción',['Copia en tu cuaderno; subraya, colorea o encierra el concepto indicado en cada oración. Escribe al lado de qué concepto de la unidad se trata.','<strong>Ejemplo:</strong> «No salgas, porque el río viene crecido»: la razón es que el río viene crecido. → <span style="color:var(--jade);font-weight:700;">la razón</span>']);_pick(identifyTaskDB,Math.min(count,identifyTaskDB.length)).forEach((item,i)=>{const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.type}</div></div>`;out.appendChild(div);});}
function genClassifyTask(out,count){_instrBlock(out,'Instrucción',['Copia la siguiente tabla en tu cuaderno. Para cada persona, completa qué hizo, en qué época vivió, cómo se le llama y un dato que la distinga.']);const items=_pick(classifyTaskDB,Math.min(count,classifyTaskDB.length));const wrap=document.createElement('div');wrap.style.overflowX='auto';const th=(t,extra='')=>`<th style="padding:0.3rem 0.4rem;border:1px solid var(--border);font-size:0.72rem;text-align:center;${extra}">${t}</th>`;let html=`<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:520px;"><thead><tr style="background:var(--pri-gl);">${th('Quién','text-align:left;')}${th('Qué hizo')}${th('Cuándo')}${th('Cómo se le llama')}${th('Dato')}</tr></thead><tbody>`;items.forEach(it=>{html+=`<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td>`+Array(4).fill(`<td style="padding:0.4rem;border:1px solid var(--border);min-width:50px;"></td>`).join('')+'</tr>';});html+='</tbody></table>';wrap.innerHTML=html;out.appendChild(wrap);const ans=document.createElement('div');ans.className='tg-answer';ans.style.marginTop='0.8rem';ans.innerHTML='<strong>✅ Respuestas:</strong><br>'+items.map(it=>`<strong>${it.w}:</strong> Qué es: ${it.gen} | Clase: ${it.n} | Desde cuándo: ${it.g} | Dato: ${it.t}`).join('<br>');out.appendChild(ans);}
function genCompleteTask(out,count){_instrBlock(out,'Instrucción',['Copia y resuelve en tu cuaderno. Cada oración tiene un espacio ___. Elige y escribe la opción correcta.']);const pool=_shuffle([...completeTaskDB]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';const sent=item.s.replace('___','<span class="tg-blank" style="min-width:90px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${sent}</strong><div style="margin-top:0.4rem;font-size:0.82rem;color:var(--gray);">📝 Opciones: <strong>${item.opts.join(' | ')}</strong></div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function genExplainTask(out,count){_instrBlock(out,'Instrucción',['Copia las siguientes preguntas en tu cuaderno y responde cada una de forma clara y completa.']);const pool=_shuffle([...explainQuestions]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.3rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function toggleAns(){ansVisible=!ansVisible;document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none');sfx('click');}

// ===================== SOPA DE LETRAS =====================
const sopaSets=[
  {size:12,grid:[
    ['X','R','I','B','C','N','C','R','A','N','K','S'],
    ['A','R','G','U','M','E','N','T','O','V','A','M'],
    ['A','I','B','V','V','O','P','I','X','T','H','R'],
    ['A','I','C','R','Z','R','S','F','E','W','E','K'],
    ['P','D','Z','A','D','U','C','A','N','A','G','I'],
    ['E','C','R','X','L','P','L','I','A','X','N','V'],
    ['U','N','S','C','Q','A','Y','W','H','D','C','T'],
    ['C','Y','N','H','F','B','F','O','X','Y','H','V'],
    ['L','O','G','I','C','A','F','R','S','X','P','N'],
    ['C','F','R','Y','B','R','S','J','F','Z','F','O'],
    ['B','T','X','G','D','C','Z','V','Y','S','T','L'],
    ['R','Y','R','C','L','C','F','N','E','J','X','R']
  ],words:[
    {w:'CONCLUSION',cells:[[9,0],[8,1],[7,2],[6,3],[5,4],[4,5],[3,6],[2,7],[1,8],[0,9]]},
    {w:'ARGUMENTO',cells:[[1,0],[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[1,7],[1,8]]},
    {w:'FALACIA',cells:[[7,6],[6,5],[5,4],[4,3],[3,2],[2,1],[1,0]]},
    {w:'LOGICA',cells:[[8,0],[8,1],[8,2],[8,3],[8,4],[8,5]]},
    {w:'RAZON',cells:[[5,2],[4,3],[3,4],[2,5],[1,6]]},
    {w:'NEXO',cells:[[4,8],[3,8],[2,8],[1,8]]}
  ]},
  {size:11,grid:[
    ['L','H','O','L','A','E','X','P','J','Q','P'],
    ['Z','M','D','E','U','Q','R','O','P','C','G'],
    ['I','E','N','F','A','E','R','M','P','P','R'],
    ['H','K','D','W','M','D','U','Z','Q','P','L'],
    ['O','H','R','I','E','N','T','G','B','E','L'],
    ['O','S','S','N','L','V','D','R','Y','T','C'],
    ['V','A','J','I','I','A','F','G','H','J','G'],
    ['V','H','C','H','D','V','V','Q','I','B','W'],
    ['W','C','P','R','A','P','I','N','O','V','C'],
    ['S','V','E','O','R','M','J','U','S','G','P'],
    ['W','V','Z','C','J','X','X','A','Y','F','P']
  ],words:[
    {w:'VALIDEZ',cells:[[7,6],[6,5],[5,4],[4,3],[3,2],[2,1],[1,0]]},
    {w:'PREMISA',cells:[[0,7],[1,6],[2,5],[3,4],[4,3],[5,2],[6,1]]},
    {w:'DILEMA',cells:[[7,4],[6,4],[5,4],[4,4],[3,4],[2,4]]},
    {w:'PORQUE',cells:[[1,8],[1,7],[1,6],[1,5],[1,4],[1,3]]},
    {w:'VERDAD',cells:[[10,1],[9,2],[8,3],[7,4],[6,5],[5,6]]},
    {w:'ORDEN',cells:[[1,7],[2,6],[3,5],[4,4],[5,3]]}
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
  {q:'La razón suele ir después de la palabra «porque».',a:true},
  {q:'La conclusión es lo que se da para sostener lo otro.',a:false},
  {q:'«Porque yo lo digo» no es una razón: no hay nada que examinar.',a:true},
  {q:'Una razón amarilla es mentira.',a:false},
  {q:'Un argumento es una razón amarrada a una conclusión.',a:true},
  {q:'Una falacia es un argumento que parece bueno y no sostiene nada.',a:true},
  {q:'Si un argumento está bien hecho, su conclusión es siempre verdad.',a:false},
  {q:'Si una de las razones es falsa, la conclusión puede salir falsa aunque el armado esté bien.',a:true},
  {q:'La regla «si llueve, la cancha se moja» también se puede leer al revés.',a:false},
  {q:'De «la cancha está mojada» no se sigue que haya llovido.',a:true},
  {q:'Atacar a quien habla en vez de a lo que dice es la falacia contra la persona.',a:true},
  {q:'Sacar una regla de dos casos es un falso dilema.',a:false},
  {q:'Un falso dilema se desarma nombrando una tercera salida.',a:true},
  {q:'Aristóteles enseñaba lógica con juegos y acertijos.',a:false},
  {q:'La lógica no dice qué pensar: dice cómo se arman las ideas para que se sostengan.',a:true}
];
const evalMCBank=[
  {q:'En «no salgas, porque el río viene crecido», ¿cuál es la conclusión?',o:['No salgas','Que el río viene crecido','Que hay que caminar','No hay conclusión'],a:0},
  {q:'¿Qué hace el nexo de un argumento?',o:['Da la razón','Amarra la razón con la conclusión','Cierra el tema','Pone la fecha'],a:1},
  {q:'«Porque conté los sacos y faltan tres» es una razón…',o:['roja','amarilla','verde','sin color'],a:2},
  {q:'«Porque el que lo vende es amable» es una razón…',o:['verde','amarilla','roja','falsa'],a:1},
  {q:'«Porque siempre se ha hecho así» es una razón…',o:['verde','amarilla','roja','buena'],a:2},
  {q:'¿Cuál es la prueba de una razón verde?',o:['Que la diga alguien importante','Que sea bonita','Que la digan muchos','Que si fuera verdad, tendría que serlo la conclusión'],a:3},
  {q:'La regla es «si llueve, la cancha se moja». ¿Qué SÍ se puede concluir?',o:['Llovió, así que está mojada','Está mojada, así que llovió','No está mojada, así que no hay regla','Nada'],a:0},
  {q:'«Todos los peces vuelan. La tilapia es un pez. Así que la tilapia vuela.» Este argumento…',o:['está mal hecho','está bien hecho, pero parte de una mentira','no es un argumento','es verdad'],a:1},
  {q:'«Todos los pinos son árboles. El mango es un árbol. Así que el mango es un pino.» Este argumento…',o:['está bien hecho','es verdad','está mal hecho','no tiene conclusión'],a:2},
  {q:'«No le creas, si ni terminó la escuela» es…',o:['contra la persona','un falso dilema','una generalización apresurada','una razón verde'],a:0},
  {q:'«En ese pueblo son tramposos: me tocaron dos» es…',o:['contra la persona','una generalización apresurada','un falso dilema','apelación a la mayoría'],a:1},
  {q:'«O te vas a la ciudad o te quedás sin futuro» es…',o:['contra la persona','apelación a la mayoría','un falso dilema','una razón verde'],a:2},
  {q:'«Compralo, si todo el mundo lo compra» es…',o:['una razón verde','un falso dilema','contra la persona','apelación a la mayoría'],a:3},
  {q:'¿Qué fue lo nuevo que hizo Aristóteles?',o:['Puso en orden las formas del razonamiento','Escribió cuentos para niños','Midió la Tierra','Inventó el semáforo'],a:0},
  {q:'¿Para qué armaba Lewis Carroll silogismos absurdos?',o:['Para que se viera el ARMADO y no el tema','Para hacer reír y nada más','Para probar que la lógica no sirve','Para vender libros'],a:0}
];
const evalCPBank=[
  {q:'La palabra que anuncia la razón es ___.',a:'porque'},
  {q:'Las palabras que anuncian la conclusión son ___.',a:'así que'},
  {q:'Una razón y una conclusión amarradas forman un ___.',a:'argumento'},
  {q:'Un argumento que parece bueno y no sostiene nada es una ___.',a:'falacia'},
  {q:'Que el armado de un argumento esté bien se llama ___.',a:'validez'},
  {q:'Decir dos cosas que no pueden ser verdad a la vez es una ___.',a:'contradicción'},
  {q:'Atacar a quien habla es la falacia contra la ___.',a:'persona'},
  {q:'Sacar una regla de dos o tres casos es una generalización ___.',a:'apresurada'},
  {q:'Ofrecer dos salidas como si no hubiera más es un falso ___.',a:'dilema'},
  {q:'Poner como razón cuánta gente lo hace es una apelación a la ___.',a:'mayoría'},
  {q:'En el semáforo, la razón que sirve es la de color ___.',a:'verde'},
  {q:'En el semáforo, la que no se puede examinar es la de color ___.',a:'rojo'},
  {q:'La palabra que anuncia una objeción es «sin ___».',a:'embargo'},
  {q:'El que puso en orden las formas del razonamiento fue ___.',a:'Aristóteles'},
  {q:'El que enseñaba lógica con juegos y acertijos fue Lewis ___.',a:'Carroll'}
];
const evalPRBank=[
  {term:'Razón',def:'Lo que se da para sostener lo que se dice'},
  {term:'Conclusión',def:'Lo que se quiere que creas'},
  {term:'Nexo',def:'La palabra que amarra la razón con la conclusión'},
  {term:'Argumento',def:'Una razón y una conclusión amarradas'},
  {term:'Falacia',def:'Un argumento que parece bueno y no sostiene nada'},
  {term:'Contradicción',def:'Decir dos cosas que no pueden ser verdad a la vez'},
  {term:'Validez',def:'Que el armado del argumento esté bien'},
  {term:'Razón verde',def:'Se puede comprobar y de verdad sostiene lo que dice'},
  {term:'Razón amarilla',def:'Puede ser verdad, pero no sostiene lo que se quiere probar'},
  {term:'Razón roja',def:'No dice nada que se pueda examinar'},
  {term:'Contra la persona',def:'Se ataca a quien habla en vez de a lo que dice'},
  {term:'Generalización apresurada',def:'Se saca una regla de dos o tres casos'},
  {term:'Falso dilema',def:'Se ofrecen dos salidas como si no hubiera más'},
  {term:'Apelación a la mayoría',def:'Se ofrece como razón cuánta gente lo hace'},
  {term:'Aristóteles',def:'El primero que puso en orden las formas del razonamiento'}
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

function genEval(){sfx('click');_evalFormaSelector(); const _selF = document.getElementById('evalFormaSel'); if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10))); const cf = evalFormNum; const rng = _evalRng(cf); window._currentEvalForm=cf;evalFormNum = (evalFormNum % EVAL_FORMAS) + 1; _evalFormaSelector();saveProgress();document.getElementById('eval-screen-title').textContent=`🎓 Evaluación Final · Forma ${cf} · Pensar con Orden: cuándo una razón es buena`;evalAnsVisible=false;const out=document.getElementById('evalOut');out.innerHTML='';const bar=document.createElement('div');bar.className='eval-score-bar';bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje · 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25 pts</span><span class="eval-score-pill esp-tf">V/F 25 pts</span><span class="eval-score-pill esp-mc">Selección 25 pts</span><span class="eval-score-pill esp-pr">Pareados 25 pts</span></div>`;out.appendChild(bar);const cpItems=_pickF(evalCPBank,5, rng);const s1=document.createElement('div');s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';cpItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='cp';d.dataset.evalIndex=i;const qHtml=item.q.replace('___',`<input class="eval-cp-input" type="text" data-cp="${i}" autocomplete="off">`);d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbCp${i}" aria-live="polite"></div>`;s1.appendChild(d);});out.appendChild(s1);const tfItems=_pickF(evalTFBank,5, rng);const s2=document.createElement('div');s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';tfItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='tf';d.dataset.evalIndex=i;d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="true"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="false"> Falso</label></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbTf${i}" aria-live="polite"></div>`;s2.appendChild(d);});out.appendChild(s2);const mcItems=_pickF(evalMCBank,5, rng);const s3=document.createElement('div');s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';mcItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='mc';d.dataset.evalIndex=i;const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join('');d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbMc${i}" aria-live="polite"></div>`;s3.appendChild(d);});out.appendChild(s3);const prItems=_pickF(evalPRBank,5, rng);const shuffledDefs=_shuffleF(prItems, rng);const letters=['A','B','C','D','E'];const s4=document.createElement('div');s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';const matchCard=document.createElement('div');matchCard.className='eval-item';let colLeft='<div class="eval-match-col"><h4>📌 Términos</h4>';prItems.forEach((item,i)=>{colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> <select class="eval-match-select" data-pr="${i}" aria-label="Respuesta pareada ${i+16}"><option value="">—</option>${letters.map(l=>`<option value="${l}">${l}</option>`).join('')}</select> ${item.term}</div>`;});colLeft+='</div>';let colRight='<div class="eval-match-col"><h4>🔑 Definiciones</h4>';shuffledDefs.forEach((item,i)=>{colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`;});colRight+='</div>';const ansKey=prItems.map((item,i)=>{const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)];return`${i+16}→${letter}`;}).join(' · ');matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div><div class="eval-item-feedback" id="evalFbPr" aria-live="polite"></div>`;s4.appendChild(matchCard);out.appendChild(s4);window._evalPrintData={tf:tfItems,mc:mcItems,cp:cpItems,pr:{terms:prItems,shuffledDefs,letters}};const autoPanel=document.createElement('div');autoPanel.id='evalAutoResult';autoPanel.className='eval-auto-result';autoPanel.innerHTML='<strong>🧮 Evaluación interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato original sin respuestas digitadas.';out.appendChild(autoPanel);fin('s-evaluacion');}
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación Pensar con Orden: cuándo una razón es buena · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.12rem 0.4rem;margin:0.22rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #784a6d;background:#f6eef4;color:#784a6d;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#784a6d;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #784a6d;height:12px;}.obt-pct{white-space:nowrap;}.qn{font-weight:700;min-width:22px;flex-shrink:0;}.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:40px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.18rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.14rem 0.35rem;margin-bottom:0.1rem;break-inside:avoid;page-break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.3;display:flex;gap:0.28rem;margin-bottom:0.07rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.1rem 0.5rem;}.mc-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:0.04rem 0.15rem;margin-left:0.8rem;}.mc-opt{font-size:9pt;display:flex;align-items:center;gap:0.15rem;}.mc-opt input{width:10px;height:10px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{margin-top:0.1rem;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.08rem 0.4rem;margin-top:0.08rem;}.pr-head{font-size:9pt;font-weight:700;color:#555;margin-bottom:0.1rem;}.pr-item{font-size:10.5pt;padding:0.1rem 0.28rem;background:#f6eef4;border-radius:3px;margin-bottom:0.07rem;display:flex;align-items:center;gap:0.2rem;line-height:1.2;break-inside:avoid;page-break-inside:avoid;}.pr-num{font-weight:700;color:#784a6d;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.22rem;padding:0.15rem 0;page-break-before:avoid;break-before:avoid;color:#784a6d;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #784a6d;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#555;}.pa{color:#007a00;font-weight:600;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · Pensar con Orden: cuándo una razón es buena · Educación Básica · Filosofía</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Evaluación Final · Pensar con Orden: cuándo una razón es buena · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u</div></div><div class="p-grid">${pR}</div>
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
  {txt:'En la pulpería le dicen a Wilmer que el abono caro es el bueno «porque todo el mundo lo compra». Compra ocho sacos y ahí se va la mitad del dinero de la siembra. La milpa sale igual que la del vecino.'},
  {txt:'En el grupo del barrio dicen que no hay que hacerle caso a don Chele sobre el agua «porque ni terminó la escuela». Don Chele había contado los tubos y sabía dónde estaba la fuga. Tres meses después el pozo de la escuela tampoco da.'},
  {txt:'A una muchacha le dicen que o se va a la ciudad o se queda sin futuro. Se va sin plan, no le sale trabajo y vuelve a los cuatro meses debiendo el pasaje. Nadie le nombró una tercera salida.'},
  {txt:'Un muchacho dice que en la aldea de al lado son tramposos porque le tocaron dos que lo fueron. Deja de venderles y pierde la mitad de sus clientes en una temporada.'},
  {txt:'En clase alguien dice: «Todos los peces vuelan. La tilapia es un pez. Así que la tilapia vuela». Media clase se ríe y nadie sabe explicar dónde está el error.'}
];
const critCaseQuestions=[
  '1. ¿Cuál es la conclusión del caso y con qué razón la sostienen?',
  '2. ¿De qué color es esa razón: verde, amarilla o roja? Di por qué.',
  '3. ¿A quién le cuesta, y qué pierde esa persona?',
  '4. ¿Qué pregunta la desarma? Escríbela tal como la dirías.'
];
const critCaseGuides=[
  'Se valora que SEPARE las dos. La conclusión es lo que quieren que crea. La razón es con qué se lo sostienen. Buscar primero la conclusión es lo que enseña la unidad.',
  'Verde: se puede comprobar y de verdad sostiene. Amarilla: puede ser verdad, pero no sostiene lo que se quiere probar. Roja: no hay nada que examinar. Se califica la señal, no la palabra.',
  'Se califica que le ponga nombre al daño concreto: media siembra, un pozo seco, cuatro meses y el pasaje, la mitad de los clientes. No la indignación.',
  'La pregunta buena va a la COSA, no a la persona ni al gentío. ¿En qué es mejor? ¿Cuántos casos, de cuántos? ¿Solo hay dos salidas? ¿Y qué tiene que ver quién lo dice?'
];
const critErrorBank=[
  {txt:'"Si un argumento está bien armado, su conclusión es verdad."',
   g1:'No: «todos los peces vuelan, la tilapia es un pez, así que la tilapia vuela» está perfectamente armado y la conclusión es un disparate.',
   g2:'Lo que falla ahí no es el armado: es que una de las razones era mentira. Bien hecho y verdadero son dos cosas, y se combinan de cuatro maneras.'},
  {txt:'"La cancha está mojada, así que llovió."',
   g1:'La regla es «si llueve, la cancha se moja», y va en un solo sentido. No dice que SOLO la lluvia la moje.',
   g2:'La pudo mojar la pila o un tubo reventado. Leer la regla al revés es el error más común del examen, y el que hay que saberse.'},
  {txt:'"Si alguien no estudió, sus razones no valen."',
   g1:'Eso es atacar a quien habla en vez de a lo que dice: la falacia contra la persona.',
   g2:'Y deja fuera la razón buena del que no tiene títulos, que es justo lo que le pasó a don Chele con los tubos. Se desarma pidiendo la razón, no el título.'},
  {txt:'"Una razón amarilla es mentira."',
   g1:'No: una razón amarilla puede ser perfectamente verdad. El saco caro puede ser caro de verdad.',
   g2:'Lo que le pasa es que NO sostiene lo que se quiere probar. Ser verdad y sostener son dos cosas distintas, y el semáforo separa eso.'}
];
const critDecisionBank=[
  'Te dicen que compres lo caro «porque todo el mundo lo compra». ¿Lo comprás, o pedís una razón de la cosa?',
  'Alguien te asegura algo y no da ninguna razón. ¿Le das la razón para no quedar mal, o le preguntás por qué?',
  'Te ofrecen dos salidas y ninguna te sirve. ¿Elegís la menos mala, o nombrás una tercera?',
  'Un compañero te da una razón mejor que la tuya. ¿Lo decís y cambiás de idea, o sostenés lo tuyo para no perder?',
  'Alguien saca una regla de dos casos que le pasaron. ¿La repetís, o preguntás de cuántos casos, de cuántos?'
];
const critDecisionGuide='Primero se separa la conclusión de la razón. Después se mira el semáforo. Verde: se puede comprobar. Amarilla: se pide otra que sí sostenga. Roja: se pide una razón de la cosa. Y cambiar de idea con una razón mejor no es perder.';
const critCompareBank=[
  {a:'«Porque conté los sacos y faltan tres».',b:'«Porque yo lo digo».',
   ga:'Razón verde: se puede comprobar y sostiene lo que dice.',
   gb:'Razón roja: no hay nada que examinar.',
   gr:'La diferencia no está en la educación con que se dice: está en que la primera se puede examinar y la segunda no. La segunda es quien manda, no una razón.'},
  {a:'«Si llueve, la cancha se moja. Llovió. Así que está mojada».',b:'«Si llueve, la cancha se moja. Está mojada. Así que llovió».',
   ga:'Usa la regla en su sentido: la conclusión se sostiene.',
   gb:'Lee la regla al revés: la conclusión no se sigue.',
   gr:'Son casi la misma frase y por eso se confunden. La regla no dice que SOLO la lluvia moje la cancha: la pudo mojar la pila.'},
  {a:'«Todos los pinos son árboles. Este es un pino. Así que es un árbol».',b:'«Todos los peces vuelan. La tilapia es un pez. Así que vuela».',
   ga:'Bien armado y con razones verdaderas: la conclusión es verdad.',
   gb:'Bien armado y con una razón falsa: la conclusión sale falsa.',
   gr:'El armado de los dos es el mismo. Lo que cambia es de dónde parten, y eso demuestra que estar bien hecho no garantiza llegar a la verdad.'},
  {a:'«No le creas: si ni terminó la escuela».',b:'«No le creas: contó mal los tubos, y aquí está la cuenta».',
   ga:'Ataca a quien habla: la falacia contra la persona.',
   gb:'Ataca lo que dice, y se puede comprobar.',
   gr:'Las dos rechazan lo mismo, y solo una da una razón. La primera deja fuera al que sabe y no tiene títulos, que es como se pierde un pozo.'}
];
const critCauseBank=[
  {cause:'«Porque todo el mundo lo compra» no dice nada del abono.',guide:'Por eso es una razón roja: no hay nada que examinar. A Wilmer le costó la mitad del dinero de la siembra.'},
  {cause:'La regla «si llueve, la cancha se moja» va en un solo sentido.',guide:'Por eso del suelo mojado no se sigue que llovió: lo pudo mojar la pila. Leerla al revés es el error más común.'},
  {cause:'Un argumento puede estar bien armado y partir de una razón falsa.',guide:'Por eso la conclusión puede salir falsa con el armado perfecto. Estar bien hecho y ser verdad son dos cosas.'},
  {cause:'Una falacia se parece mucho a un argumento bueno.',guide:'Por eso hay que aprenderse la pregunta que la desarma y no solo su nombre: en la pulpería nadie anuncia que está usando una.'},
  {cause:'Sacar una regla de dos casos es una generalización apresurada.',guide:'Por eso así se arman las famas de un barrio entero, y por eso se desarma preguntando de cuántos casos, de cuántos.'}
];
const critEffectBank=[
  {effect:'Alguien compra ocho sacos de abono caro y la milpa sale igual que la del vecino.',guide:'Porque la razón que le dieron era roja: cuánta gente lo compra no dice nada del abono. Y él no supo pedir otra.'},
  {effect:'Nadie le hace caso al que sabe dónde está la fuga y el pozo se seca.',guide:'Porque lo rechazaron por quién es y no por lo que decía. Es la falacia contra la persona. Deja fuera la razón buena del que no tiene títulos.'},
  {effect:'Alguien elige entre dos salidas malas sin buscar una tercera.',guide:'Porque le pusieron un falso dilema: dos opciones ofrecidas como si no hubiera más. Se desarma nombrando la tercera.'},
  {effect:'Media clase se ríe de «la tilapia vuela» y nadie sabe decir dónde está el error.',guide:'Porque el armado está perfecto y lo falso es una de las razones de arriba. Lo que falta no es reírse: es saber separar armado de verdad.'},
  {effect:'Dos personas discuten una hora y las dos salen pensando distinto de como entraron.',guide:'Porque se examinaron las razones y no las personas. Cambiar de idea con una razón mejor es lo que la unidad enseña, no una derrota.'}
];
function genEvalCrit(){
  sfx('click');
  _injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });
  const _sC = document.getElementById('evalCritFormaSel');
  if (_sC && parseInt(_sC.value, 10)) evalCritFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sC.value, 10)));
  const cf=evalCritFormNum;window._currentEvalCritForm=cf;const rngC = _evalRng(200000 + cf);evalCritFormNum=(evalCritFormNum%EVAL_FORMAS)+1;_injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });saveProgress();
  document.getElementById('evalcrit-screen-title').textContent=`🧠 Pensamiento Crítico · Forma ${cf} · Pensar con Orden: cuándo una razón es buena`;
  evalCritAnsVisible=false;
  const out=document.getElementById('evalCritOut');out.innerHTML='';
  const kase=_pickF(critCaseBank,1,rngC)[0];
  const s1=document.createElement('div');
  s1.innerHTML=`<div class="eval-section-title">I. Caso de análisis: una pregunta de todos los días <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${kase.txt}</div>${critCaseQuestions.map((q,i)=>`<div class="crit-q-block"><div class="crit-q-label">${q}</div><textarea class="crit-textarea" rows="2" aria-label="${q}"></textarea><div class="crit-pauta">${critCaseGuides[i]}</div></div>`).join('')}<div class="crit-selfscore"><label for="critScore0">Obtenido:</label><input type="number" id="critScore0" class="crit-score-input" data-score="0" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s1);
  const err=_pickF(critErrorBank,1,rngC)[0];
  const s2=document.createElement('div');
  s2.innerHTML=`<div class="eval-section-title">II. Corrige el error <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${err.txt}</div><p style="font-size:0.85rem;margin-bottom:0.5rem;">Identifica <strong>dos errores</strong> y corrígelos con tus propias palabras:</p><div class="crit-q-block"><div class="crit-q-label">Error 1 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 1 y su corrección"></textarea><div class="crit-pauta">${err.g1}</div></div><div class="crit-q-block"><div class="crit-q-label">Error 2 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 2 y su corrección"></textarea><div class="crit-pauta">${err.g2}</div></div><div class="crit-selfscore"><label for="critScore1">Obtenido:</label><input type="number" id="critScore1" class="crit-score-input" data-score="1" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s2);
  const dec=_pickF(critDecisionBank,1,rngC)[0];
  const s3=document.createElement('div');
  s3.innerHTML=`<div class="eval-section-title">III. Toma de decisiones: comprobar antes de afirmar <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${dec}</div><div class="crit-q-block"><div class="crit-q-label">¿Qué opción recomendarías? Explica por qué, diciendo de qué CLASE es la pregunta y con qué se contesta.</div><textarea class="crit-textarea" rows="4" aria-label="Recomendaciones y su justificación"></textarea><div class="crit-pauta">${critDecisionGuide}</div></div><div class="crit-selfscore"><label for="critScore2">Obtenido:</label><input type="number" id="critScore2" class="crit-score-input" data-score="2" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s3);
  const cmp=_pickF(critCompareBank,1,rngC)[0];
  const s4=document.createElement('div');
  s4.innerHTML=`<div class="eval-section-title">IV. Comparación razonada <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-compare-grid"><div class="crit-compare-box"><h5>Caso A</h5>${cmp.a}</div><div class="crit-compare-box"><h5>Caso B</h5>${cmp.b}</div></div><div class="crit-q-block"><div class="crit-q-label">1. ¿Qué es cada caso? 2. ¿En qué se reconoce cada uno? 3. ¿Por qué no son lo mismo?</div><textarea class="crit-textarea" rows="4" aria-label="Comparación razonada de los casos A y B"></textarea><div class="crit-pauta">Caso A: ${cmp.ga} · Caso B: ${cmp.gb} · ${cmp.gr}</div></div><div class="crit-selfscore"><label for="critScore3">Obtenido:</label><input type="number" id="critScore3" class="crit-score-input" data-score="3" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
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
  let s1=`<div class="sec-title"><span>I. Caso de análisis: una pregunta de todos los días</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.kase.txt}</p>`;
  critCaseQuestions.forEach(q=>{s1+=`<p class="crit-print-q">${q}</p>${lines(1)}`;});
  let s2=`<div class="sec-title"><span>II. Corrige el error</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.err.txt}</p><p class="crit-print-q">Identifica dos errores y corrígelos con tus propias palabras:</p><p class="crit-print-q"><strong>Error 1:</strong></p>${lines(1)}<p class="crit-print-q"><strong>Error 2:</strong></p>${lines(1)}`;
  let s3=`<div class="sec-title"><span>III. Toma de decisiones: comprobar antes de afirmar</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.dec}</p><p class="crit-print-q">¿Qué opción recomendarías? Explica por qué, diciendo de qué CLASE es la pregunta y con qué se contesta.</p>${lines(2)}`;
  let s4=`<div class="sec-title"><span>IV. Comparación razonada</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><div class="crit-compare-print-grid"><div class="crit-compare-print-box"><strong>Caso A:</strong> ${d.cmp.a}</div><div class="crit-compare-print-box"><strong>Caso B:</strong> ${d.cmp.b}</div></div><p class="crit-print-q">1. ¿Qué es cada caso? 2. ¿En qué se reconoce cada uno? 3. ¿Por qué no son lo mismo?</p>${lines(2)}`;
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
  const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Pensamiento Crítico Pensar con Orden: cuándo una razón es buena · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.1rem 0.4rem;margin:0.2rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #784a6d;background:#f6eef4;color:#784a6d;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#784a6d;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #784a6d;height:12px;}.obt-pct{white-space:nowrap;}.crit-print-scenario{font-size:10.5pt;background:#f6eef4;border-left:3px solid #784a6d;padding:0.2rem 0.5rem;margin:0.1rem 0 0.2rem;line-height:1.3;}.crit-print-q{font-size:10pt;font-weight:600;margin:0.15rem 0 0.08rem;line-height:1.25;}.ln{border-bottom:1px solid #111;min-height:12px;margin-bottom:2px;}.crit-compare-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin:0.15rem 0;}.crit-compare-print-box{font-size:9.5pt;background:#f6eef4;border-radius:4px;padding:0.25rem 0.4rem;line-height:1.25;}.crit-print-tbl{width:100%;border-collapse:collapse;font-size:9.5pt;margin-top:0.15rem;}.crit-print-tbl th,.crit-print-tbl td{border:1px solid #999;padding:0.3rem 0.45rem;text-align:left;height:30px;vertical-align:middle;}.crit-print-tbl th{background:#f6eef4;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.08rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.9rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.45rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.1rem;margin-bottom:0.18rem;}.p-crit-line{font-size:11pt;color:#007a00;margin-bottom:0.18rem;line-height:1.35;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.2rem;padding:0.1rem 0;color:#784a6d;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #784a6d;}.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:12.7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="critEvalPage"><div class="ph"><h2>Evaluación Competencial · Pensamiento Crítico · Pensar con Orden: cuándo una razón es buena · Educación Básica · Filosofía</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 5 secciones de 20 puntos</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100</span></div></div><div class="pauta-wrap" id="critPautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Pensamiento Crítico · Pensar con Orden: cuándo una razón es buena · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 5 secciones × 20 pts c/u — respuesta abierta, usar como guía de corrección</div></div><div class="p-grid">${pR}</div></div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("critEvalPage",250,0.55,1.2);fit("critPautaPage",250,0.55,1.2);})();<\/script></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(doc);win.document.close();setTimeout(()=>win.print(),400);
}

// ===================== LABORATORIO DE LOS SÍMBOLOS =====================
const parteData = (function () {
  /* Se arma desde js/data/filosofia-logica.js. Cada falacia con su mecanismo,
     cómo suena, la pregunta que la desarma y lo que cuesta. */
  const esc = x => String(x).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const out = {};
  LOG_FALACIAS.forEach(f => {
    out[f.clave] = {
      nombre: f.nombre, icon: f.emoji,
      estructura: { title: '¿Qué hace?',          info: '<strong>' + esc(f.mecanismo) + '</strong>' },
      funcion:    { title: '¿Cómo suena?',        info: '<em>' + esc(f.suena) + '</em>' },
      ubicacion:  { title: '¿Cómo se desarma?',   info: '🛡️ <strong>' + esc(f.desarma) + '</strong>' },
      dato:       { title: '¿Qué cuesta?',        info: '💸 ' + esc(f.cuesta) }
    };
  });
  return out;
})();
let labParte='persona',labAspecto='estructura';
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
function openDiploma(){sfx('fan');const pct=_diplPct();document.getElementById('diplPct').textContent=pct+'%';document.getElementById('diplBar').style.width=pct+'%';document.getElementById('diplDate').textContent='Fecha: '+new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});const msgs=['¡Sigue pidiendo razones!','¡Muy buen trabajo!','¡Vas muy bien!','¡Ya lees el semáforo de razones!','¡Piensa con orden!'];document.getElementById('diplMsg').textContent=msgs[Math.min(Math.floor(pct/25),4)];const stars=['⭐','⭐⭐','⭐⭐⭐'];document.getElementById('diplStars').textContent=stars[Math.min(Math.floor(pct/40),2)];const achTxt=unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(' · ');document.getElementById('diplAch').textContent=achTxt||'Sigue completando secciones para desbloquear logros';document.getElementById('diplomaOverlay').classList.add('open');launchConfetti();}
function closeDiploma(){document.getElementById('diplomaOverlay').classList.remove('open');}
function updateDiplomaName(v){document.getElementById('diplName').textContent=v||'Estudiante';}
function shareWA(){const name=document.getElementById('diplName').textContent||'Estudiante';const pct=_diplPct();const msg=`🧩 ¡${name} completó la Misión "Pensar con Orden: cuándo una razón es buena"! 🏅 Progreso: ${pct}% · 🌱 policastsapien.com`;_waShare(msg);}
async function captureDiploma(){if(typeof html2canvas==='undefined'){showToast('⚠️ Cargando... intenta de nuevo');return;}sfx('click');const card=document.querySelector('.diploma-card');const btn=document.querySelector('.diploma-actions .btn-pri');const toHide=[card.querySelector('.diploma-input'),card.querySelector('.diploma-actions'),card.querySelector('hr')];if(btn){btn.disabled=true;btn.textContent='⏳ Capturando...';}toHide.forEach(el=>{if(el)el.style.display='none';});let dataUrl='';try{const canvas=await html2canvas(card,{scale:2,useCORS:true,backgroundColor:'#ffffff'});toHide.forEach(el=>{if(el)el.style.display='';});dataUrl=canvas.toDataURL('image/png');const name=(document.getElementById('diplName').textContent||'Estudiante').replace(/\s+/g,'-');const fileName='constancia-'+name+'.png';const cap=window.Capacitor;if(cap&&cap.isNativePlatform&&cap.isNativePlatform()&&cap.Plugins?.Filesystem&&cap.Plugins?.Share){const base64Data=dataUrl.split(',')[1];const result=await cap.Plugins.Filesystem.writeFile({path:fileName,data:base64Data,directory:'CACHE'});await cap.Plugins.Share.share({url:result.uri,dialogTitle:'Guardar / Compartir Constancia'});}else{const a=document.createElement('a');a.href=dataUrl;a.download=fileName;a.click();}}catch(e){toHide.forEach(el=>{if(el)el.style.display='';});if(e.name!=='AbortError')showToast('⚠️ No se pudo guardar la constancia');}finally{if(btn){btn.disabled=false;btn.textContent='📷 Guardar foto';}}}

// ===================== INIT =====================

// ===================== PENSAR CON ORDEN, EN LA PANTALLA =====================
/* Todo se PINTA desde js/data/filosofia-logica.js. Lo que aquí se copiaría es
   la clasificación de cada razón y la de cada caso de validez, y eso no puede
   decir una cosa en la pantalla y otra en la ficha que se fotocopia.
   De ahí sale `_dev/verifica-filosofia.js`. */
function _esc(x){return String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

/* Las tres piezas de un argumento: el CE2.1 del currículo. */
function pintarLogPiezas(){
  const c=document.getElementById('lg-piezas');if(!c)return;
  c.innerHTML=`<h2>🧩 Un argumento tiene tres piezas</h2>
    <p>Cuando alguien te quiere convencer de algo, dice dos cosas y las amarra.
       Saber cuál es cuál es la mitad del trabajo.</p>
    <div class="lg-piezas">${LOG_PIEZAS.map(p=>
      `<div class="lg-pieza">
         <h4>${p.emoji} ${_esc(p.nombre)}</h4>
         <p class="lg-pieza-q">${_esc(p.que)}</p>
         <p class="lg-pieza-d">${_esc(p.donde)}</p>
         <p class="lg-pieza-ej">${_esc(p.ejemplo)}</p>
       </div>`).join('')}</div>
    <div class="tip"><span class="ti">🎯</span><div>Busca siempre la CONCLUSIÓN primero:
      es lo que quieren que creas. Después mira con qué la sostienen. Al revés
      se pierde uno.</div></div>`;
}

/* El semáforo. ⚠️ Cada color lleva SU EMOJI además del color: esta tarjeta se
   fotocopia en blanco y negro, y uno de cada doce niños no distingue el rojo
   del verde. Sin el emoji, el semáforo sería justo la actividad que él no
   puede hacer, que es la avería que este proyecto ya cerró una vez. */
function pintarLogSemaforo(){
  const c=document.getElementById('lg-semaforo');if(!c)return;
  c.innerHTML=`<h2>🚦 El semáforo de razones</h2>
    <p>No todas las razones valen igual. Hay tres colores, y cada uno tiene su señal.</p>
    <div class="lg-sem">${LOG_SEMAFORO.map(s=>
      `<div class="lg-sem-f c-${s.clave}">
         <h4>${s.emoji} ${_esc(s.nombre)} <span class="lg-sem-et">${_esc(s.senalCorta)}</span></h4>
         <p class="lg-sem-s">${_esc(s.senal)}</p>
         <p class="lg-sem-p"><strong>La prueba:</strong> ${_esc(s.prueba)}</p>
       </div>`).join('')}</div>`;
}

/* Las cuatro falacias. La PREGUNTA que desarma cada una va destacada: es lo
   único de aquí que el alumno va a usar el día que le pase. */
function pintarLogFalacias(){
  const c=document.getElementById('lg-falacias');if(!c)return;
  c.innerHTML=LOG_FALACIAS.map(f=>
    `<div class="lg-fal">
       <h3 class="lg-fal-tit">${f.emoji} ${_esc(f.nombre)}</h3>
       <p class="lg-fal-m">${_esc(f.mecanismo)}</p>
       <p class="lg-fal-suena">Suena así: ${_esc(f.suena)}</p>
       <p class="lg-fal-d"><strong>La desarma:</strong> ${_esc(f.desarma)}</p>
       <p class="lg-fal-c"><strong>Qué cuesta:</strong> ${_esc(f.cuesta)}</p>
     </div>`).join('');
}

/* El «si… entonces», con su lado bueno y su error clásico, juntos: lo que
   enseña es la comparación. */
function pintarLogSiEntonces(){
  const c=document.getElementById('lg-si');if(!c)return;
  const S=LOG_SI_ENTONCES;
  c.innerHTML=`<h2>🔗 La regla va en un solo sentido</h2>
    <div class="lg-si-regla">${_esc(S.regla)}</div>
    <div class="lg-si">
      <div class="lg-si-c ok"><h4>✅ Así sí</h4>
        <p class="lg-si-p">${_esc(S.bien.paso)}</p>
        <p class="lg-si-l">${_esc(S.bien.luego)}</p>
        <p class="lg-si-por">${_esc(S.bien.porque)}</p></div>
      <div class="lg-si-c no"><h4>❌ Así no</h4>
        <p class="lg-si-p">${_esc(S.mal.paso)}</p>
        <p class="lg-si-l">${_esc(S.mal.luego)}</p>
        <p class="lg-si-por">${_esc(S.mal.porque)}</p></div>
    </div>
    <div class="tip"><span class="ti">⚠️</span><div>${_esc(S.ojo)}</div></div>`;
}

/* Bien hecho no es verdad: la idea más difícil de
   la unidad. Los cuatro casos van con sus dos etiquetas a la vista, porque lo
   que hay que ver es que las dos cosas se pueden combinar de cuatro maneras. */
function pintarLogValidez(){
  const c=document.getElementById('lg-validez');if(!c)return;
  c.innerHTML=LOG_VALIDEZ.map(v=>
    `<div class="lg-val">
       <div class="lg-val-tit">${_esc(v.titulo)}</div>
       <div class="lg-val-et">
         <span class="${v.bienHecho?'si':'no'}">${v.bienHecho?'✅ Bien hecho':'❌ Mal hecho'}</span>
         <span class="${v.verdad?'si':'no'}">${v.verdad?'✅ Conclusión verdadera':'❌ Conclusión falsa'}</span>
       </div>
       <ul class="lg-val-r">${v.razones.map(r=>`<li>${_esc(r)}</li>`).join('')}</ul>
       <p class="lg-val-c">${_esc(v.conclusion)}</p>
       <p class="lg-val-q">${_esc(v.que)}</p>
     </div>`).join('');
}

/* Los conectores: el puente con Español que pide el currículo. */
function pintarLogConectores(){
  const c=document.getElementById('lg-conectores');if(!c)return;
  c.innerHTML=`<div class="lg-con">${LOG_CONECTORES.map(x=>
    `<div><b>${_esc(x.w)}</b><span class="h">${_esc(x.hace)}</span>
     <span class="e">${_esc(x.ej)}</span></div>`).join('')}</div>`;
}

/* Qué le da la lógica a cada materia. Es el árbol de la unidad 1 visto de
   abajo hacia arriba: allí se preguntó de qué pregunta nació cada materia,
   aquí qué le da la lógica a cada una. */
function pintarLogArbol(){
  const c=document.getElementById('lg-arbol');if(!c)return;
  c.innerHTML=`<div class="lg-arbol">${LOG_ARBOL.map(a=>
    `<div><b>${a.emoji} ${_esc(a.materia)}</b>
     <span class="le">${_esc(a.le)}</span>
     <span class="hoy"><strong>Pruébalo hoy:</strong> ${_esc(a.hoy)}</span></div>`).join('')}</div>`;
}

function pintarLogPensadores(){
  const c=document.getElementById('lg-pensadores');if(!c)return;
  c.innerHTML=LOG_PENSADORES.map(p=>
    `<div class="lg-pens">
       <h3 class="lg-pens-tit">${p.emoji} ${_esc(p.nombre)}</h3>
       <p class="lg-pens-donde">${_esc(p.donde)}</p>
       <p class="lg-pens-quien">${_esc(p.quien)}</p>
       <p class="lg-pens-sub">Qué hizo</p>
       <p class="lg-pens-l">${_esc(p.hizo)}</p>
       <p class="lg-pens-sub">Por qué se le recuerda</p>
       <p class="lg-pens-l">${_esc(p.porque)}</p>
       <p class="lg-pens-dato"><strong>Dato:</strong> ${_esc(p.dato)}</p>
     </div>`).join('');
}


window.addEventListener('DOMContentLoaded',()=>{
  initTheme();
  loadProgress();
  pintarLogPiezas();
  pintarLogSemaforo();
  pintarLogSiEntonces();
  pintarLogFalacias();
  pintarLogValidez();
  pintarLogConectores();
  pintarLogArbol();
  pintarLogPensadores();
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
  document.querySelector('[data-parte="persona"]')?.classList.add('active-pri');
  document.querySelector('[data-aspecto="estructura"]')?.classList.add('active-sec');
  renderAchPanel();
});

(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalCrit==='function') _injectFormaSel('genEvalCrit','evalCritFormaSel',evalCritFormNum,function(v){evalCritFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();
