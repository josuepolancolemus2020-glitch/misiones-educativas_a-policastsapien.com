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
const SAVE_KEY='ia_generativa_v1';
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
  primer_quiz:{icon:'🏅',label:'Primer quiz de la IA generativa superado'},
  flash_master:{icon:'🃏',label:'Domina el vocabulario de la IA generativa'},
  clasif_pro:{icon:'🗂️',label:'Distingue lo que se verifica de lo que se juzga'},
  id_master:{icon:'🔍',label:'Encuentra el concepto dentro de la oración'},
  reto_hero:{icon:'🏆',label:'Campeón del reto de la verificación'},
  nivel3:{icon:'🎖️',label:'¡Buen criterio! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡No se deja engañar! Nivel 6'},
  widgets_master:{icon:'🧩',label:'Widgets de la IA generativa dominados'},
  cazador:{icon:'🔎',label:'Cazó todo lo que había que verificar en un texto generado'},
  peticion:{icon:'🧱',label:'Armó una petición con sus cuatro piezas'},
  decide:{icon:'🔮',label:'Decidió en escenarios que todavía no llegan'}
};
function unlockAchievement(id){if(unlockedAch.includes(id))return;unlockedAch.push(id);sfx('ach');showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label);launchConfetti();renderAchPanel();saveProgress();}
function renderAchPanel(){const list=document.getElementById('achList');list.innerHTML='';Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{const div=document.createElement('div');div.className='ach-item'+(unlockedAch.includes(id)?'':' locked');div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`;list.appendChild(div);});}
function toggleAchPanel(){sfx('click');document.getElementById('achPanel').classList.toggle('open');}
function showToast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}t.textContent=msg;t.style.display='block';clearTimeout(t._tid);t._tid=setTimeout(()=>t.style.display='none',3200);}
function launchConfetti(){const colors=['#86198f','#e879f9','#4338ca','#f59e0b','#c026d3'];for(let i=0;i<60;i++){const c=document.createElement('div');c.className='confetti-piece';c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`;document.body.appendChild(c);c.addEventListener('animationend',()=>c.remove());}}

// ===================== XP =====================
const lvls=[{t:0,n:'Aprendiz 🌱'},{t:25,n:'Sabe que predice 💬'},{t:55,n:'Reconoce una alucinación 🌀'},{t:90,n:'Verifica antes de usar 🔎'},{t:130,n:'Escribe buenas peticiones 🧱'},{t:165,n:'No se deja engañar 🛡️'},{t:190,n:'Criterio propio 🏆'}];
function pts(n){xp=Math.max(0,Math.min(MXP,xp+n));updateXPBar();saveProgress();}
function updateXPBar(){const pct=Math.round((xp/MXP)*100);document.getElementById('xpFill').style.width=pct+'%';const el=document.getElementById('xpPts');el.textContent='⭐ '+xp;el.style.transform='scale(1.3)';setTimeout(()=>el.style.transform='',300);let lv=0;for(let i=0;i<lvls.length;i++)if(xp>=lvls[i].t)lv=i;document.getElementById('xpLvl').textContent=lvls[lv].n;if(lv!==prevLevel){if(lv>=2)unlockAchievement('nivel3');if(lv>=5)unlockAchievement('nivel5');prevLevel=lv;}}
function resetXP(){sfx('click');xp=0;updateXPBar();showToast('🔄 XP reiniciado a 0');}
function fin(id,showFX=true){if(!done.has(id)){done.add(id);const b=document.querySelector(`[data-s="${id}"]`);if(b)b.classList.add('done');if(showFX){sfx('up');launchConfetti();}saveProgress();}}
function getProgress(){return Math.round((done.size/TOTAL_SECTIONS)*100);}

// ===================== NAV =====================
function go(id){sfx('click');document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});document.getElementById(id).classList.add('active');const btn=document.querySelector(`[data-s="${id}"]`);if(btn){btn.classList.add('active');btn.setAttribute('aria-selected','true');}window.scrollTo({top:0,behavior:'smooth'});if(id==='s-sopa'){setTimeout(buildSopa,50);}if(id==='s-widgets'){setTimeout(buildRoute,50);}}

// ===================== FLASHCARD DATA =====================
const fcData = (function () {
  /* Del vocabulario común de la ruta (js/data/ia-conceptos.js), con la
     definición LARGA: en III Ciclo esto ya no es vocabulario de adorno, es lo
     que le va a permitir defenderse. */
  const f = [];
  IA_CONCEPTOS.filter(c => c.ciclo === 3).forEach(c => {
    f.push({ w: c.emoji + ' ' + c.palabra, a: '<strong>' + c.corta + '</strong><br><br>' + c.definicion });
  });
  IA_VERIFICA.forEach(v => {
    f.push({ w: '🔎 Paso ' + v.n + ' de verificar<br><small>' + v.paso + '</small>', a: v.detalle });
  });
  IA_PIEZAS_PETICION.forEach(p => {
    f.push({ w: p.emoji + ' ' + p.pieza + '<br><small>una de las cuatro piezas</small>', a: '<strong>' + p.pregunta + '</strong><br><br><em>' + p.ejemplo + '</em>' });
  });
  IA_REGLAS_ORO.forEach(r => {
    f.push({ w: r.emoji + ' Una de las tres reglas de oro', a: '<strong>' + r.regla + '</strong><br><br>' + r.porque });
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
  {q:'¿Qué hace de verdad un modelo de lenguaje cuando te contesta?',o:['Busca la respuesta en una enciclopedia','Predice cuál es la palabra siguiente más probable, una por una','Le pregunta a una persona','Copia una página de internet'],c:1,
   e:'Por eso escribe con la misma seguridad cuando acierta que cuando inventa.'},
  {q:'¿Qué es una alucinación?',o:['Un error de la pantalla','Un virus','Cuando el modelo se inventa un dato y lo dice con toda seguridad','Cuando se queda sin internet'],c:2,
   e:'No está mintiendo: está haciendo lo suyo, que es completar texto.'},
  {q:'La IA te da el título de un libro que respalda tu tarea. ¿Qué haces?',o:['Lo cito, suena confiable','Le pregunto a la IA si existe','Compruebo que el libro exista de verdad','Le cambio el título por si acaso'],c:2,
   e:'Libros, artículos y leyes inventados son el error más común. Que el título suene bien no prueba nada.'},
  {q:'¿Cuáles son las cuatro piezas de una buena petición?',o:['Contexto, tarea, formato y ejemplo','Saludo, pregunta, gracias y despedida','Título, cuerpo, firma y fecha','Quién, cómo, cuándo y dónde'],c:0,
   e:'Con las cuatro puestas, el resultado cambia muchísimo.'},
  {q:'¿Qué es una falsificación profunda (deepfake)?',o:['Una foto movida','Una foto, voz o video fabricados para que parezcan de una persona real','Un error de la cámara','Un filtro de colores'],c:1,
   e:'Se usan para estafar, para humillar y para desinformar.'},
  {q:'Te llega un audio con la voz de un familiar pidiendo dinero urgente. ¿Qué haces?',o:['Se lo mando','Lo reenvío al grupo para avisar','Le contesto por audio','Lo llamo yo por otro medio antes de hacer nada'],c:3,
   e:'Imitar una voz hoy cuesta pocos segundos de grabación. Compruébalo por otro camino.'},
  {q:'¿Qué NO se le escribe nunca a un chat de IA?',o:['Una pregunta de la tarea','Datos de tu familia, claves o fotos de otras personas','Una duda de matemática','Un texto para que te lo corrija'],c:1,
   e:'Lo que se escribe puede quedar guardado en otra computadora, y ya no lo controlas tú.'},
  {q:'Usar IA para entender un tema y usarla para entregar la tarea hecha…',o:['Son lo mismo','Las dos están prohibidas','Son distintas: una te enseña y la otra te deja sin aprender','Las dos están bien'],c:2,
   e:'Y cuando se usa, se declara. Este mismo proyecto declara cuándo hay IA en su proceso.'},
  {q:'¿Por qué un modelo puede equivocarse y sonar igual de seguro?',o:['Porque no le importa la verdad: fue hecho para completar texto, no para comprobarlo','Porque tiene poca batería','Porque está enojado','Porque le falta internet'],c:0,
   e:'La seguridad del tono no es una señal de que el dato sea bueno.'},
  {q:'Compartes sin comprobar una noticia que resultó falsa. ¿Qué pasó?',o:['Nada, no la escribe yo','No es culpa mía','Ayudaste a que la desinformación llegue más lejos','La IA es la responsable'],c:2,
   e:'Compartir sin verificar es parte del daño, aunque no lo hayas escrito tú.'}
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
  {label:['Hay que VERIFICARLO','Se juzga con la cabeza'],headA:'🔎 Verificar',headB:'🧠 Juzgar',colA:'ver',colB:'juz',
   words:[{w:'«La ley 136-97»',t:'ver'},{w:'«Es un tema muy interesante»',t:'juz'},{w:'«En 1974»',t:'ver'},{w:'«Conviene estudiarlo despacio»',t:'juz'},{w:'«Según el libro de Ramírez»',t:'ver'},{w:'«Me parece bien explicado»',t:'juz'},{w:'«El 63 % de los casos»',t:'ver'},{w:'«Es más fácil de lo que parece»',t:'juz'}]},
  {label:['Sí se le escribe a un chat','NO se le escribe nunca'],headA:'✅ Sí',headB:'🚫 Nunca',colA:'si',colB:'no',
   words:[{w:'Una duda de matemática',t:'si'},{w:'La clave de la cuenta de tu mamá',t:'no'},{w:'Un texto tuyo para que lo corrija',t:'si'},{w:'La dirección de tu casa',t:'no'},{w:'Pedirle que te explique la fotosíntesis',t:'si'},{w:'Fotos de tus compañeros',t:'no'},{w:'Una lista de ideas para tu exposición',t:'si'},{w:'El número de identidad de tu papá',t:'no'}]},
  {label:['Es una pieza de la petición','No es una pieza de la petición'],headA:'🧱 Es una pieza',headB:'🚫 No lo es',colA:'pieza',colB:'no',
   words:[{w:'Contexto: quién eres y para qué',t:'pieza'},{w:'Saludar con mucha educación',t:'no'},{w:'Tarea: qué quieres exactamente',t:'pieza'},{w:'Escribirlo todo en mayúsculas',t:'no'},{w:'Formato: cómo lo quieres',t:'pieza'},{w:'Repetir la pregunta tres veces',t:'no'},{w:'Ejemplo: a qué se tiene que parecer',t:'pieza'},{w:'Decirle que es muy inteligente',t:'no'}]}
];
let currentClassGroupIdx=0,clsSelectedWord=null;
function buildClass(){const group=classGroups[currentClassGroupIdx];document.getElementById('col-left-head').textContent=group.headA;document.getElementById('col-right-head').textContent=group.headB;const bank=document.getElementById('clsBank');bank.innerHTML='';clsSelectedWord=null;document.getElementById('items-left').innerHTML='';document.getElementById('items-right').innerHTML='';_shuffle([...group.words]).forEach(w=>{const el=document.createElement('div');el.className='wb-item';el.textContent=w.w;el.dataset.t=w.t;el.onclick=()=>{document.querySelectorAll('.wb-item').forEach(i=>i.classList.remove('sel-word'));el.classList.add('sel-word');clsSelectedWord=el;sfx('click');};bank.appendChild(el);});['col-left','col-right'].forEach(colId=>{const col=document.getElementById(colId);col.onclick=(e)=>{if(!clsSelectedWord||e.target.classList.contains('drop-item'))return;const targetId=colId==='col-left'?'items-left':'items-right';const wordsCol=document.getElementById(targetId);const item=document.createElement('div');item.className='drop-item';item.textContent=clsSelectedWord.textContent;item.dataset.t=clsSelectedWord.dataset.t;const original=clsSelectedWord;item.onclick=(ev)=>{ev.stopPropagation();if(clsSelectedWord!==null){col.click();}else{document.getElementById('clsBank').appendChild(original);original.classList.remove('sel-word');item.remove();if(typeof sfx==='function')sfx('click');}};wordsCol.appendChild(item);clsSelectedWord.remove();clsSelectedWord=null;sfx('click');};});}
function checkClass(){const remaining=document.querySelectorAll('#clsBank .wb-item').length;if(remaining>0){fb('fbCls','Mueve todas las palabras a las columnas primero.',false);return;}const group=classGroups[currentClassGroupIdx];let allOk=true;document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{const inLeft=el.parentElement.id==='items-left';const expectedType=inLeft?group.colA:group.colB;if(el.dataset.t===expectedType){el.classList.add('cls-ok');}else{el.classList.add('cls-no');allOk=false;}});if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);}if(allOk){fb('fbCls','¡Perfecto! +5 XP',true);sfx('fan');fin('s-clasifica');unlockAchievement('clasif_pro');}else{fb('fbCls','Hay errores. Los errados llevan ✗.',false);sfx('no');}}
function nextClassGroup(){sfx('click');currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length;buildClass();document.getElementById('fbCls').classList.remove('show');showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]);}
function resetClass(){sfx('click');buildClass();document.getElementById('fbCls').classList.remove('show');}

// ===================== IDENTIFICAR =====================
const idData=[
  {s:['Un','modelo','de','lenguaje','predice','la','palabra','siguiente.'],c:4,art:'El verbo que dice lo que de verdad hace'},
  {s:['Cuando','se','inventa','un','dato','hay','una','alucinación.'],c:7,art:'El nombre del dato inventado con seguridad'},
  {s:['Antes','de','usar','ese','dato','hay','que','verificarlo.'],c:7,art:'Lo que hay que hacer antes de usar un dato'},
  {s:['Una','buena','petición','lleva','contexto,','tarea,','formato','y','ejemplo.'],c:2,art:'El nombre del encargo que se le escribe'},
  {s:['Un','video','fabricado','que','parece','real','engaña.'],c:2,art:'Lo que le pasó a ese video'},
  {s:['Lo','que','escribes','puede','quedar','guardado','para','siempre.'],c:5,art:'Lo que le pasa a lo que se escribe en internet'},
  {s:['Compartir','sin','comprobar','ya','es','desinformación.'],c:5,art:'El nombre de lo que se propaga sin comprobar'},
  {s:['La','fuente','original','es','la','que','responde','por','el','dato.'],c:1,art:'Lo que hay que buscar para comprobar algo'}
];
let idIdx=0,idDone=false;
function showId(){idDone=false;if(idIdx>=idData.length){document.getElementById('idSent').innerHTML='🎉 ¡Completado!';fin('s-identifica');unlockAchievement('id_master');return;}const d=idData[idIdx];document.getElementById('idProg').textContent=`Oración ${idIdx+1} de ${idData.length}`;document.getElementById('idInfo').textContent=`Busca: ${d.art}`;const sent=document.getElementById('idSent');sent.innerHTML='';d.s.forEach((w,i)=>{const span=document.createElement('span');span.className='id-word';span.textContent=w+' ';span.onclick=()=>checkId(i,span);sent.appendChild(span);});}
function checkId(i,span){if(idDone)return;document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected'));span.classList.add('selected');if(i===idData[idIdx].c){idDone=true;span.classList.add('id-ok');fb('fbId','¡Correcto! +5 XP',true);if(!xpTracker.id.has(idIdx)){xpTracker.id.add(idIdx);pts(5);}sfx('ok');}else{span.classList.add('id-no');fb('fbId','Ese no es el término solicitado.',false);sfx('no');}}
function nextId(){sfx('click');idIdx++;showId();document.getElementById('fbId').classList.remove('show');}
function resetId(){sfx('click');idIdx=0;showId();document.getElementById('fbId').classList.remove('show');}

// ===================== COMPLETA =====================
const cmpData=[
  {s:'Un modelo de lenguaje ___ la palabra siguiente más probable.',opts:['predice','consulta','recuerda'],c:0},
  {s:'Cuando se inventa un dato y lo dice con seguridad, es una ___.',opts:['broma','mentira','alucinación'],c:2},
  {s:'Antes de usar un dato de una IA hay que ___.',opts:['compartirlo','verificarlo','copiarlo'],c:1},
  {s:'Las cuatro piezas de una petición son contexto, tarea, formato y ___.',opts:['ejemplo','saludo','firma'],c:0},
  {s:'Una foto o una voz fabricadas para engañar son una falsificación ___.',opts:['barata','sencilla','profunda'],c:2},
  {s:'Lo que le escribes a un servicio en internet puede quedar ___.',opts:['borrado','guardado','perdido'],c:1},
  {s:'Compartir algo sin comprobarlo ya es ___.',opts:['ayudar','informar','desinformación'],c:2},
  {s:'Verificar es ir a la ___ que responde por el dato.',opts:['fuente','pantalla','memoria'],c:0}
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
  { label: 'Ordena los cinco pasos para verificar', steps: IA_VERIFICA.map(v => v.n + '. ' + v.paso) },
  { label: 'Ordena las cuatro piezas de una petición', steps: IA_PIEZAS_PETICION.map((p, i) => (i + 1) + '. ' + p.pieza + ': ' + p.pregunta) }
];
let currentRouteIdx=0,routeItems=[];
function buildRoute(){routeItems=_shuffle([...routeSets[currentRouteIdx].steps]);renderRoute();const fbEl=document.getElementById('fbRoute');if(fbEl)fbEl.classList.remove('show');}
function renderRoute(){const list=document.getElementById('routeList');if(!list)return;list.innerHTML='';routeItems.forEach((step,i)=>{const div=document.createElement('div');div.className='sort-item';div.innerHTML=`<div class="sort-arrows"><button class="sort-arrow" onclick="routeMove(${i},-1)"${i===0?' disabled':''}>▲</button><button class="sort-arrow" onclick="routeMove(${i},1)"${i===routeItems.length-1?' disabled':''}>▼</button></div><div class="sort-step-num">${i+1}.</div><div class="sort-item-txt">${step}</div>`;list.appendChild(div);});}
function routeMove(idx,dir){sfx('click');const ni=idx+dir;if(ni<0||ni>=routeItems.length)return;[routeItems[idx],routeItems[ni]]=[routeItems[ni],routeItems[idx]];renderRoute();}
function checkRoute(){const correct=routeSets[currentRouteIdx].steps;const isOk=routeItems.every((s,i)=>s===correct[i]);if(isOk){fb('fbRoute','¡Perfecto! Orden correcto. +4 XP',true);if(!xpTracker.wgt.has('route_'+currentRouteIdx)){xpTracker.wgt.add('route_'+currentRouteIdx);pts(4);}sfx('fan');fin('s-widgets');unlockAchievement('widgets_master');}else{fb('fbRoute','Hay pasos fuera de orden. Revisa el arreglo.',false);sfx('no');}}
function nextRoute(){sfx('click');currentRouteIdx=(currentRouteIdx+1)%routeSets.length;buildRoute();showToast('🔄 Secuencia: '+routeSets[currentRouteIdx].label);}

// Widget 2: Identifica el concepto
const neuronPartes = (function () {
  const c3 = IA_CONCEPTOS.filter(c => c.ciclo === 3);
  const nombres = c3.map(c => c.palabra);
  const p = [];
  c3.forEach(c => {
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
  /* Un caso de la vida, y qué paso de verificación le toca. Es la actividad que
     más se parece a lo que va a hacer el alumno con el teléfono en la mano. */
  const pasos = IA_VERIFICA.map(v => v.paso);
  return [
    {trans:'La IA te dio un párrafo con tres fechas y una opinión.',func:IA_VERIFICA[0].paso,opts:pasos.slice()},
    {trans:'Dice que un río de tu departamento mide 900 kilómetros, y tú sabes que no.',func:IA_VERIFICA[1].paso,opts:pasos.slice()},
    {trans:'Te da un dato sobre una ley y tú tienes la ley a mano.',func:IA_VERIFICA[2].paso,opts:pasos.slice()},
    {trans:'Cita un libro con un título perfecto para tu tema.',func:IA_VERIFICA[3].paso,opts:pasos.slice()},
    {trans:'Buscaste el dato por todos lados y no aparece en ninguna fuente.',func:IA_VERIFICA[4].paso,opts:pasos.slice()},
    {trans:'Encontraste cinco páginas que repiten lo mismo sin decir de dónde lo sacaron.',func:IA_VERIFICA[2].paso,opts:pasos.slice()}
  ];
})();
let neuroIdx=0,neuroDone=false;
function showNeuro(){neuroDone=false;if(neuroIdx>=neuroPairs.length){const el=document.getElementById('neuroTrans');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('neuroOpts');if(opts)opts.innerHTML='';return;}const d=neuroPairs[neuroIdx];const prog=document.getElementById('neuroProg');if(prog)prog.textContent=`${neuroIdx+1} de ${neuroPairs.length}`;const trans=document.getElementById('neuroTrans');if(trans)trans.textContent=d.trans;const opts=document.getElementById('neuroOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkNeuro(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuro');if(fbEl)fbEl.classList.remove('show');}
function checkNeuro(opt,btn,d){if(neuroDone)return;neuroDone=true;document.querySelectorAll('#neuroOpts .qz-opt').forEach(b=>{if(b.textContent===d.func)b.classList.add('correct');else if(b===btn&&b.textContent!==d.func)b.classList.add('wrong');});const isOk=opt===d.func;if(isOk){fb('fbNeuro','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuro_'+neuroIdx)){xpTracker.wgt.add('neuro_'+neuroIdx);pts(3);}sfx('ok');}else{fb('fbNeuro','Correcto: '+d.func,false);sfx('no');}setTimeout(()=>{neuroIdx++;showNeuro();},1800);}
function resetNeuro(){sfx('click');neuroIdx=0;showNeuro();}

// Widget 4: Fuente → ¿Renovable o no renovable?
const enfermedadData=[
  {disease:'Un chat inventa el nombre de un libro que no existe',characteristic:'Alucinación',opts:['Alucinación','Falsificación profunda','Problema de privacidad']},
  {disease:'Un audio imita la voz de tu tío para pedirte dinero',characteristic:'Falsificación profunda',opts:['Alucinación','Falsificación profunda','Problema de privacidad']},
  {disease:'Escribiste la dirección de tu casa en un chat',characteristic:'Problema de privacidad',opts:['Alucinación','Falsificación profunda','Problema de privacidad']},
  {disease:'El modelo te da una fecha con toda seguridad y está equivocada',characteristic:'Alucinación',opts:['Alucinación','Falsificación profunda','Problema de privacidad']},
  {disease:'Circula un video de alguien diciendo algo que nunca dijo',characteristic:'Falsificación profunda',opts:['Alucinación','Falsificación profunda','Problema de privacidad']},
  {disease:'Subiste una foto de tus compañeros sin preguntarles',characteristic:'Problema de privacidad',opts:['Alucinación','Falsificación profunda','Problema de privacidad']},
  {disease:'Te cita un artículo de una ley que no dice eso',characteristic:'Alucinación',opts:['Alucinación','Falsificación profunda','Problema de privacidad']},
  {disease:'Una imagen fabricada muestra un hecho que no ocurrió',characteristic:'Falsificación profunda',opts:['Alucinación','Falsificación profunda','Problema de privacidad']},
  {disease:'Pegaste en un chat la conversación privada de otra persona',characteristic:'Problema de privacidad',opts:['Alucinación','Falsificación profunda','Problema de privacidad']}
];
let enferIdx=0,enferDone=false;
function showEnfer(){enferDone=false;if(enferIdx>=enfermedadData.length){const el=document.getElementById('enferDisease');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('enferOpts');if(opts)opts.innerHTML='';return;}const d=enfermedadData[enferIdx];const prog=document.getElementById('enferProg');if(prog)prog.textContent=`${enferIdx+1} de ${enfermedadData.length}`;const dis=document.getElementById('enferDisease');if(dis)dis.textContent=d.disease;const opts=document.getElementById('enferOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkEnfer(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbEnfer');if(fbEl)fbEl.classList.remove('show');}
function checkEnfer(opt,btn,d){if(enferDone)return;enferDone=true;document.querySelectorAll('#enferOpts .qz-opt').forEach(b=>{if(b.textContent===d.characteristic)b.classList.add('correct');else if(b===btn&&b.textContent!==d.characteristic)b.classList.add('wrong');});const isOk=opt===d.characteristic;if(isOk){fb('fbEnfer','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('enfer_'+enferIdx)){xpTracker.wgt.add('enfer_'+enferIdx);pts(3);}sfx('ok');}else{fb('fbEnfer','Correcto: '+d.characteristic,false);sfx('no');}setTimeout(()=>{enferIdx++;showEnfer();},1800);}
function resetEnfer(){sfx('click');enferIdx=0;showEnfer();}

// ===================== RETO FINAL =====================
const retoPairs=[
  {label:['Hay que VERIFICARLO','Se juzga con la cabeza'],btnA:'🔎 Verificar',btnB:'🧠 Juzgar',colA:'ver',colB:'juz',
   words:[{w:'«La ley 136-97»',t:'ver'},{w:'«Es un tema muy interesante»',t:'juz'},{w:'«En 1974»',t:'ver'},{w:'«Conviene estudiarlo despacio»',t:'juz'},{w:'«Según el libro de Ramírez»',t:'ver'},{w:'«Me parece bien explicado»',t:'juz'},{w:'«El 63 % de los casos»',t:'ver'},{w:'«Es más fácil de lo que parece»',t:'juz'},{w:'«El doctor Antonio Mejía dijo»',t:'ver'},{w:'«Es una idea que vale la pena»',t:'juz'}]},
  {label:['Sí se le escribe a un chat','NO se le escribe nunca'],btnA:'✅ Sí',btnB:'🚫 Nunca',colA:'si',colB:'no',
   words:[{w:'Una duda de matemática',t:'si'},{w:'La clave de la cuenta de tu mamá',t:'no'},{w:'Un texto tuyo para que lo corrija',t:'si'},{w:'La dirección de tu casa',t:'no'},{w:'Pedirle que te explique la fotosíntesis',t:'si'},{w:'Fotos de tus compañeros',t:'no'},{w:'Una lista de ideas para tu exposición',t:'si'},{w:'El número de identidad de tu papá',t:'no'},{w:'Pedirle ejemplos de oraciones',t:'si'},{w:'El expediente médico de alguien',t:'no'}]},
  {label:['Es una pieza de la petición','No es una pieza de la petición'],btnA:'🧱 Es una pieza',btnB:'🚫 No lo es',colA:'pieza',colB:'no',
   words:[{w:'Contexto: quién eres y para qué',t:'pieza'},{w:'Saludar con mucha educación',t:'no'},{w:'Tarea: qué quieres exactamente',t:'pieza'},{w:'Escribirlo todo en mayúsculas',t:'no'},{w:'Formato: cómo lo quieres',t:'pieza'},{w:'Repetir la pregunta tres veces',t:'no'},{w:'Ejemplo: a qué se tiene que parecer',t:'pieza'},{w:'Decirle que es muy inteligente',t:'no'},{w:'Decir para qué grado es',t:'pieza'},{w:'Ponerle muchos signos de admiración',t:'no'}]}
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
  {s:'Un modelo de lenguaje predice la palabra siguiente más probable.',type:'predice'},
  {s:'Cuando se inventa un dato con seguridad, eso es una alucinación.',type:'alucinación'},
  {s:'Antes de usar un dato de una IA hay que verificarlo en su fuente.',type:'verificarlo'},
  {s:'Una buena petición lleva contexto, tarea, formato y ejemplo.',type:'petición'},
  {s:'Un video fabricado que parece real es una falsificación profunda.',type:'falsificación profunda'},
  {s:'Lo que escribes en internet puede quedar guardado en otra computadora.',type:'guardado'},
  {s:'Compartir algo sin comprobarlo ya es desinformación.',type:'desinformación'},
  {s:'La fuente original es la que responde por el dato.',type:'fuente original'},
  {s:'Usar IA para aprender no es lo mismo que usarla para entregar.',type:'aprender'},
  {s:'El tono seguro de un modelo no prueba que el dato sea bueno.',type:'tono seguro'}
];
const classifyTaskDB=[
  {w:'IA generativa',gen:'Produce texto, imagen, voz o video nuevos',n:'Un chat que escribe un párrafo',g:'Puede inventar con seguridad',t:''},
  {w:'Modelo de lenguaje',gen:'Predice la palabra siguiente más probable',n:'El teclado que adivina, pero enorme',g:'No consulta ni comprueba nada',t:''},
  {w:'Alucinación',gen:'Un dato inventado dicho con seguridad',n:'Un libro que no existe',g:'Acaba en tu tarea y en el examen',t:''},
  {w:'Petición',gen:'El encargo, con sus cuatro piezas',n:'Contexto, tarea, formato y ejemplo',g:'Mal escrita, el resultado no sirve',t:''},
  {w:'Falsificación profunda',gen:'Foto, voz o video fabricados',n:'Un audio con la voz de un familiar',g:'Estafas y desinformación',t:''},
  {w:'Verificar',gen:'Comprobar en la fuente que responde',n:'Buscar el artículo en la ley',g:'Sin esto, todo lo demás no sirve',t:''},
  {w:'Privacidad',gen:'Lo tuyo es tuyo',n:'No dar datos de tu familia',g:'Lo que subes ya no lo controlas',t:''}
];
const completeTaskDB=[
  {s:'Un modelo de lenguaje ___ la palabra siguiente más probable.',ans:'predice'},
  {s:'Un dato inventado y dicho con seguridad es una ___.',ans:'alucinación'},
  {s:'Antes de usar un dato de una IA hay que ___.',ans:'verificarlo'},
  {s:'Las cuatro piezas de una petición son contexto, tarea, formato y ___.',ans:'ejemplo'},
  {s:'Una foto o voz fabricadas para engañar son una falsificación ___.',ans:'profunda'},
  {s:'Lo que escribes en internet puede quedar ___.',ans:'guardado'},
  {s:'Compartir sin comprobar ya es ___.',ans:'desinformación'},
  {s:'Verificar es ir a la ___ original.',ans:'fuente'},
  {s:'El tono seguro de un modelo no ___ que el dato sea bueno.',ans:'prueba'}
];
const explainQuestions=[
  {q:'Explica con tus palabras qué hace un modelo de lenguaje cuando te contesta.',ans:'Predice cuál es la palabra siguiente más probable a partir de todo el texto que leyó mientras lo entrenaban, y después la siguiente, y la siguiente, hasta armar el párrafo. No busca en una enciclopedia ni comprueba nada. Por eso escribe con la misma seguridad cuando acierta que cuando se lo inventa.'},
  {q:'¿Qué es una alucinación y por qué ocurre?',ans:'Es cuando el modelo se inventa un dato, un nombre, una fecha o una fuente y lo escribe como si fuera cierto. Ocurre porque fue hecho para completar texto, no para comprobarlo: si la continuación más probable es falsa, la escribe igual. No está mintiendo, porque no sabe lo que es mentir.'},
  {q:'Describe los cinco pasos para verificar un dato que te dio una IA.',ans:'Primero separo el dato de la explicación: lo que se verifica son nombres, fechas, números y fuentes. Segundo, me pregunto si suena posible comparándolo con lo que ya sé. Tercero, busco la fuente original: el libro, la ley, la página de la institución. Cuarto, si cita algo, compruebo que exista. Y quinto: si no lo puedo verificar, no lo uso.'},
  {q:'¿Qué es una falsificación profunda y qué harías si te llega un audio sospechoso de un familiar?',ans:'Es una foto, un audio o un video hechos con IA para que parezcan de una persona real. Si me llega un audio de un familiar pidiendo dinero urgente, no hago nada de lo que pide: lo llamo yo por otro medio, o llamo a alguien más de la familia. Imitar una voz hoy cuesta pocos segundos de grabación.'},
  {q:'Escribe una petición completa, con sus cuatro piezas, para algo que necesites de verdad.',ans:'Respuesta abierta. Se valora que estén las cuatro: contexto (quién es y para qué), tarea (qué quiere exactamente), formato (cómo lo quiere) y ejemplo (a qué se tiene que parecer). Y que lo que pida sea algo real de su clase.'},
  {q:'¿Qué diferencia hay entre usar la IA para aprender y usarla para entregar la tarea?',ans:'Usarla para aprender es pedirle que me explique algo que no entendí, que me ponga ejemplos o que me corrija lo que yo escribe: al final yo sé más. Usarla para entregar es copiar lo que escribió y ponerle mi nombre: al final yo no aprendí nada y además estoy diciendo que hice algo que no hice. Cuando la uso, lo declaro.'},
  {q:'¿Por qué compartir algo sin verificar ya es parte del daño?',ans:'Porque la desinformación no vive de quien la escribe, sino de quien la reenvía. Un texto falso que nadie comparte se queda en una pantalla; compartido por cien personas llega a mil. Aunque yo no lo haya escrito, mi reenvío es el que lo puso delante de alguien más.'},
  {q:'¿Qué NO le escribirías nunca a un chat de IA, y por qué?',ans:'Datos de mi familia (dirección, teléfonos, números de identidad), claves de cualquier cuenta, fotos de otras personas y conversaciones privadas de alguien más. Porque lo que se escribe puede quedar guardado en otra computadora, ya no lo controlo yo, y esos datos no son solo míos: son de otras personas que no dieron permiso.'},
  {q:'Averigua cómo se usa la IA en algún trabajo de tu comunidad y decí qué cambia y qué no.',ans:'Respuesta abierta y de investigación. Se valora que hable con alguien que trabaje (en una pulpería, en la alcaldía, en una finca, en una radio), que distinga las tareas que una máquina puede hacer de las que necesitan una persona delante, y que no caiga ni en el catastrofismo ni en la publicidad.'}
];
let ansVisible=false;
function genTask(){sfx('click');const type=document.getElementById('tgType').value;const count=parseInt(document.getElementById('tgCount').value);ansVisible=false;const out=document.getElementById('tgOut');out.innerHTML='';if(type==='identify')genIdentifyTask(out,count);else if(type==='classify')genClassifyTask(out,count);else if(type==='complete')genCompleteTask(out,count);else if(type==='explain')genExplainTask(out,count);fin('s-tareas');}
function _instrBlock(out,title,lines){const ib=document.createElement('div');ib.className='tg-instruction-block';ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join('');out.appendChild(ib);}
function genIdentifyTask(out,count){_instrBlock(out,'Instrucción',['Copia en tu cuaderno; subraya, colorea o encierra el concepto que se pide en cada oración. Escribe al lado qué significa y por qué importa.','<strong>Ejemplo:</strong> Un modelo de lenguaje predice la palabra siguiente. → <span style="color:var(--jade);font-weight:700;">predice</span>']);_pick(identifyTaskDB,Math.min(count,identifyTaskDB.length)).forEach((item,i)=>{const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.type}</div></div>`;out.appendChild(div);});}
function genClassifyTask(out,count){_instrBlock(out,'Instrucción',['Copia la siguiente tabla en tu cuaderno. Para cada concepto, completa qué es, un ejemplo, qué riesgo trae y cómo te defiendes.']);const items=_pick(classifyTaskDB,Math.min(count,classifyTaskDB.length));const wrap=document.createElement('div');wrap.style.overflowX='auto';const th=(t,extra='')=>`<th style="padding:0.3rem 0.4rem;border:1px solid var(--border);font-size:0.72rem;text-align:center;${extra}">${t}</th>`;let html=`<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:520px;"><thead><tr style="background:var(--pri-gl);">${th('Concepto','text-align:left;')}${th('¿Qué es?')}${th('Un ejemplo')}${th('¿Qué riesgo trae?')}${th('¿Cómo te defiendes?')}</tr></thead><tbody>`;items.forEach(it=>{html+=`<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td>`+Array(4).fill(`<td style="padding:0.4rem;border:1px solid var(--border);min-width:50px;"></td>`).join('')+'</tr>';});html+='</tbody></table>';wrap.innerHTML=html;out.appendChild(wrap);const ans=document.createElement('div');ans.className='tg-answer';ans.style.marginTop='0.8rem';ans.innerHTML='<strong>✅ Respuestas:</strong><br>'+items.map(it=>`<strong>${it.w}:</strong> Qué es: ${it.gen} | Clase: ${it.n} | Desde cuándo: ${it.g} | Dato: ${it.t}`).join('<br>');out.appendChild(ans);}
function genCompleteTask(out,count){_instrBlock(out,'Instrucción',['Copia y resuelve en tu cuaderno. Cada oración tiene un espacio ___. Elige y escribe la opción correcta.']);const pool=_shuffle([...completeTaskDB]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';const sent=item.s.replace('___','<span class="tg-blank" style="min-width:90px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${sent}</strong><div style="margin-top:0.4rem;font-size:0.82rem;color:var(--gray);">📝 Opciones: <strong>${item.opts.join(' | ')}</strong></div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function genExplainTask(out,count){_instrBlock(out,'Instrucción',['Copia las siguientes preguntas en tu cuaderno y responde cada una de forma clara y completa.']);const pool=_shuffle([...explainQuestions]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.3rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function toggleAns(){ansVisible=!ansVisible;document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none');sfx('click');}

// ===================== SOPA DE LETRAS =====================
const sopaSets=[
  {size:12,grid:[
    ['Y','S','V','V','H','A','S','S','B','Y','N','Q'],
    ['O','B','R','V','E','O','G','Y','X','D','J','A'],
    ['W','P','V','E','R','I','F','I','C','A','R','Y'],
    ['M','T','N','J','D','H','R','A','Z','D','D','W'],
    ['Ñ','N','O','Y','Q','S','E','N','O','I','S','G'],
    ['K','W','I','P','R','T','N','I','E','C','E','R'],
    ['Y','W','C','V','F','M','J','C','I','A','F','J'],
    ['M','L','I','W','A','Y','I','U','Ñ','V','A','J'],
    ['H','G','T','Z','N','D','P','L','N','I','B','S'],
    ['V','U','E','D','E','M','B','A','A','R','G','E'],
    ['L','M','P','R','Y','C','C','B','L','P','G','Ñ'],
    ['U','Ñ','P','E','T','N','E','U','F','Z','A','C']
  ],words:[
    {w:'PREDICE',cells:[[11,2],[10,3],[9,4],[8,5],[7,6],[6,7],[5,8]]},
    {w:'ALUCINA',cells:[[9,7],[8,7],[7,7],[6,7],[5,7],[4,7],[3,7]]},
    {w:'VERIFICAR',cells:[[2,2],[2,3],[2,4],[2,5],[2,6],[2,7],[2,8],[2,9],[2,10]]},
    {w:'FUENTE',cells:[[11,8],[11,7],[11,6],[11,5],[11,4],[11,3]]},
    {w:'PETICION',cells:[[10,2],[9,2],[8,2],[7,2],[6,2],[5,2],[4,2],[3,2]]},
    {w:'PRIVACIDAD',cells:[[10,9],[9,9],[8,9],[7,9],[6,9],[5,9],[4,9],[3,9],[2,9],[1,9]]}
  ]},
  {size:12,grid:[
    ['E','H','Q','H','I','Ñ','W','K','V','K','E','C'],
    ['U','V','W','O','T','X','E','T','N','O','C','Z'],
    ['Ñ','L','A','Q','Y','E','W','Ñ','C','K','R','G'],
    ['J','E','J','E','M','P','L','O','A','A','M','I'],
    ['H','E','G','T','Y','R','C','L','R','M','O','D'],
    ['W','L','E','O','T','A','M','R','O','F','D','Q'],
    ['R','S','H','N','S','H','V','B','N','T','E','G'],
    ['L','M','O','A','X','Y','D','P','K','Y','L','C'],
    ['R','G','J','G','M','U','I','L','A','L','O','P'],
    ['E','R','P','N','G','M','M','T','J','Ñ','T','M'],
    ['V','Q','F','E','L','Z','Ñ','X','Y','N','I','T'],
    ['K','D','Y','I','A','E','R','A','T','N','E','L']
  ],words:[
    {w:'CONTEXTO',cells:[[1,10],[1,9],[1,8],[1,7],[1,6],[1,5],[1,4],[1,3]]},
    {w:'FORMATO',cells:[[5,9],[5,8],[5,7],[5,6],[5,5],[5,4],[5,3]]},
    {w:'EJEMPLO',cells:[[3,1],[3,2],[3,3],[3,4],[3,5],[3,6],[3,7]]},
    {w:'TAREA',cells:[[11,8],[11,7],[11,6],[11,5],[11,4]]},
    {w:'MODELO',cells:[[3,10],[4,10],[5,10],[6,10],[7,10],[8,10]]},
    {w:'ENGANO',cells:[[10,3],[9,3],[8,3],[7,3],[6,3],[5,3]]}
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
  {q:'Un modelo de lenguaje predice la palabra siguiente más probable.',a:true},
  {q:'Un modelo de lenguaje busca la respuesta en una enciclopedia antes de contestar.',a:false},
  {q:'Una alucinación es cuando el modelo se inventa un dato y lo dice con seguridad.',a:true},
  {q:'Si el modelo contesta con mucha seguridad, es señal de que el dato es correcto.',a:false},
  {q:'Verificar es buscar la fuente original que responde por el dato.',a:true},
  {q:'Preguntarle otra vez a la misma IA sirve para verificar un dato.',a:false},
  {q:'Las cuatro piezas de una petición son contexto, tarea, formato y ejemplo.',a:true},
  {q:'Una falsificación profunda puede imitar la voz de una persona real.',a:true},
  {q:'Está bien escribirle a un chat la dirección de tu casa si te lo pide.',a:false},
  {q:'Lo que se escribe en un servicio de internet puede quedar guardado.',a:true},
  {q:'Compartir sin comprobar ayuda a que la desinformación llegue más lejos.',a:true},
  {q:'Usar IA para entender un tema es lo mismo que entregar lo que ella escribió.',a:false},
  {q:'Cuando se usa IA en un trabajo, se declara.',a:true},
  {q:'Si un libro que cita la IA suena muy adecuado, seguro existe.',a:false},
  {q:'La IA generativa también produce imágenes, voz y video, no solo texto.',a:true},
  {q:'Los modelos de lenguaje descienden de una idea técnica presentada en 2017.',a:true},
  {q:'Si no puedes verificar un dato, lo mejor es usarlo igual y avisar después.',a:false},
  {q:'Una foto de tus compañeros se sube solo con permiso de ellos.',a:true},
  {q:'Un audio urgente pidiendo dinero se comprueba llamando por otro medio.',a:true},
  {q:'La IA generativa quita del medio la necesidad de pensar por uno mismo.',a:false}
];
const evalMCBank=[
  {q:'¿Qué hace un modelo de lenguaje cuando te contesta?',o:['Consulta una enciclopedia','Le pregunta a una persona','Copia una página','Predice la palabra siguiente más probable'],a:3},
  {q:'¿Qué es una alucinación?',o:['Un virus','Un dato inventado dicho con toda seguridad','Un error de la pantalla','Una falla de la conexión'],a:1},
  {q:'La IA te cita un libro perfecto para tu tema. ¿Qué haces?',o:['Compruebo que el libro exista','Lo cito, suena confiable','Le pregunto a la IA si existe','Le cambio el título'],a:0},
  {q:'¿Cuáles son las cuatro piezas de una petición?',o:['Quién, cómo, cuándo y dónde','Título, cuerpo, firma y fecha','Contexto, tarea, formato y ejemplo','Saludo, pregunta, gracias y adiós'],a:2},
  {q:'¿Qué es una falsificación profunda?',o:['Una foto movida','Un filtro de colores','Un error de la cámara','Una foto, voz o video fabricados para parecer reales'],a:3},
  {q:'Te llega un audio con la voz de un familiar pidiendo dinero urgente. ¿Qué haces?',o:['Lo llamo yo por otro medio antes de hacer nada','Le mando el dinero','Lo reenvío al grupo','Le contesto por audio'],a:0},
  {q:'¿Qué NO se le escribe nunca a un chat de IA?',o:['Una duda de matemática','La clave de una cuenta o la dirección de tu casa','Un texto tuyo para corregir','Una lista de ideas'],a:1},
  {q:'¿Por qué el tono seguro de un modelo no prueba nada?',o:['Porque escribe despacio','Porque siempre duda','Porque fue hecho para completar texto, no para comprobarlo','Porque no sabe escribir'],a:2},
  {q:'¿Cuál es el primer paso para verificar un dato?',o:['Separar el dato de la explicación','Compartirlo','Buscar en otra IA','Copiarlo al cuaderno'],a:0},
  {q:'Compartes sin comprobar algo que resultó falso. ¿Qué pasó?',o:['Nada, no lo escribiste tú','Es culpa de la IA','No tiene importancia','Ayudaste a que la desinformación llegue más lejos'],a:3},
  {q:'¿Qué diferencia hay entre usar IA para aprender y usarla para entregar?',o:['Ninguna','Las dos están prohibidas','Una te enseña y la otra te deja sin aprender','La segunda es más rápida y por eso mejor'],a:2},
  {q:'¿Qué hay que hacer cuando no se puede verificar un dato?',o:['Usarlo y avisar después','No usarlo','Usarlo solo en el examen','Cambiarle las palabras'],a:1},
  {q:'¿De dónde salen los chats de IA generativa que se usan hoy?',o:['De un invento de 2022','De los sistemas expertos de los ochenta','De ELIZA, de 1966','De una idea técnica presentada en 2017 y entrenada en grande'],a:3},
  {q:'¿Qué significa que la IA generativa sea «generativa»?',o:['Que produce texto, imagen, voz o video nuevos','Que es gratis','Que funciona sin internet','Que aprende sola de cada usuario'],a:0},
  {q:'¿Cuándo se declara que se usó IA en un trabajo?',o:['Nunca, no hace falta','Siempre que se haya usado','Solo si sale mal','Solo si lo pregunta el maestro'],a:1}
];
const evalCPBank=[
  {q:'Un modelo de lenguaje ___ la palabra siguiente más probable.',a:'predice'},
  {q:'Un dato inventado y dicho con seguridad es una ___.',a:'alucinación'},
  {q:'Antes de usar un dato de una IA hay que ___.',a:'verificarlo'},
  {q:'La primera pieza de una petición, quién eres y para qué, es el ___.',a:'contexto'},
  {q:'La pieza que dice cómo lo quieres es el ___.',a:'formato'},
  {q:'Una foto o voz fabricadas para engañar son una falsificación ___.',a:'profunda'},
  {q:'Lo que escribes en un servicio de internet puede quedar ___.',a:'guardado'},
  {q:'Compartir algo sin comprobarlo ya es ___.',a:'desinformación'},
  {q:'Verificar es ir a la ___ original que responde por el dato.',a:'fuente'},
  {q:'Si un dato no se puede verificar, lo mejor es no ___.',a:'usarlo'},
  {q:'La IA generativa produce texto, imagen, voz y ___.',a:'video'},
  {q:'Cuando se usa IA en un trabajo, se ___.',a:'declara'},
  {q:'El tono seguro de un modelo no ___ que el dato sea bueno.',a:'prueba'},
  {q:'Un audio urgente pidiendo dinero se comprueba llamando por otro ___.',a:'medio'},
  {q:'Los chats de hoy descienden de una idea técnica de ___.',a:'2017'}
];
const evalPRBank=[
  {term:'IA generativa',def:'Produce texto, imagen, voz o video que antes no existían'},
  {term:'Modelo de lenguaje',def:'Predice la palabra siguiente más probable, una por una'},
  {term:'Alucinación',def:'Un dato inventado y dicho con toda seguridad'},
  {term:'Petición',def:'El encargo que se le escribe, con sus cuatro piezas'},
  {term:'Contexto',def:'La pieza que dice quién eres y para qué lo quieres'},
  {term:'Tarea',def:'La pieza que dice qué quieres exactamente'},
  {term:'Formato',def:'La pieza que dice cómo lo quieres'},
  {term:'Ejemplo',def:'La pieza que dice a qué se tiene que parecer'},
  {term:'Falsificación profunda',def:'Foto, voz o video fabricados para parecer de alguien real'},
  {term:'Verificar',def:'Comprobar el dato en la fuente que responde por él'},
  {term:'Fuente original',def:'El libro, la ley o la institución de donde sale el dato'},
  {term:'Desinformación',def:'Lo que se propaga al compartir sin comprobar'},
  {term:'Privacidad',def:'Lo tuyo es tuyo, y lo que subes ya no lo controlas'},
  {term:'Declarar el uso',def:'Decir en el trabajo dónde se usó la IA y para qué'},
  {term:'2017',def:'El año de la idea técnica de la que salen los chats de hoy'}
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

function genEval(){sfx('click');_evalFormaSelector(); const _selF = document.getElementById('evalFormaSel'); if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10))); const cf = evalFormNum; const rng = _evalRng(cf); window._currentEvalForm=cf;evalFormNum = (evalFormNum % EVAL_FORMAS) + 1; _evalFormaSelector();saveProgress();document.getElementById('eval-screen-title').textContent=`🎓 Evaluación Final · Forma ${cf} · IA Generativa`;evalAnsVisible=false;const out=document.getElementById('evalOut');out.innerHTML='';const bar=document.createElement('div');bar.className='eval-score-bar';bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje · 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25 pts</span><span class="eval-score-pill esp-tf">V/F 25 pts</span><span class="eval-score-pill esp-mc">Selección 25 pts</span><span class="eval-score-pill esp-pr">Pareados 25 pts</span></div>`;out.appendChild(bar);const cpItems=_pickF(evalCPBank,5, rng);const s1=document.createElement('div');s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';cpItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='cp';d.dataset.evalIndex=i;const qHtml=item.q.replace('___',`<input class="eval-cp-input" type="text" data-cp="${i}" autocomplete="off">`);d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbCp${i}" aria-live="polite"></div>`;s1.appendChild(d);});out.appendChild(s1);const tfItems=_pickF(evalTFBank,5, rng);const s2=document.createElement('div');s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';tfItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='tf';d.dataset.evalIndex=i;d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="true"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="false"> Falso</label></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbTf${i}" aria-live="polite"></div>`;s2.appendChild(d);});out.appendChild(s2);const mcItems=_pickF(evalMCBank,5, rng);const s3=document.createElement('div');s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';mcItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='mc';d.dataset.evalIndex=i;const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join('');d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbMc${i}" aria-live="polite"></div>`;s3.appendChild(d);});out.appendChild(s3);const prItems=_pickF(evalPRBank,5, rng);const shuffledDefs=_shuffleF(prItems, rng);const letters=['A','B','C','D','E'];const s4=document.createElement('div');s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';const matchCard=document.createElement('div');matchCard.className='eval-item';let colLeft='<div class="eval-match-col"><h4>📌 Términos</h4>';prItems.forEach((item,i)=>{colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> <select class="eval-match-select" data-pr="${i}" aria-label="Respuesta pareada ${i+16}"><option value="">—</option>${letters.map(l=>`<option value="${l}">${l}</option>`).join('')}</select> ${item.term}</div>`;});colLeft+='</div>';let colRight='<div class="eval-match-col"><h4>🔑 Definiciones</h4>';shuffledDefs.forEach((item,i)=>{colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`;});colRight+='</div>';const ansKey=prItems.map((item,i)=>{const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)];return`${i+16}→${letter}`;}).join(' · ');matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div><div class="eval-item-feedback" id="evalFbPr" aria-live="polite"></div>`;s4.appendChild(matchCard);out.appendChild(s4);window._evalPrintData={tf:tfItems,mc:mcItems,cp:cpItems,pr:{terms:prItems,shuffledDefs,letters}};const autoPanel=document.createElement('div');autoPanel.id='evalAutoResult';autoPanel.className='eval-auto-result';autoPanel.innerHTML='<strong>🧮 Evaluación interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato original sin respuestas digitadas.';out.appendChild(autoPanel);fin('s-evaluacion');}
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación IA Generativa · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.12rem 0.4rem;margin:0.22rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #86198f;background:#fdf4ff;color:#86198f;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#86198f;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #86198f;height:12px;}.obt-pct{white-space:nowrap;}.qn{font-weight:700;min-width:22px;flex-shrink:0;}.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:40px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.18rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.14rem 0.35rem;margin-bottom:0.1rem;break-inside:avoid;page-break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.3;display:flex;gap:0.28rem;margin-bottom:0.07rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.1rem 0.5rem;}.mc-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:0.04rem 0.15rem;margin-left:0.8rem;}.mc-opt{font-size:9pt;display:flex;align-items:center;gap:0.15rem;}.mc-opt input{width:10px;height:10px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{margin-top:0.1rem;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.08rem 0.4rem;margin-top:0.08rem;}.pr-head{font-size:9pt;font-weight:700;color:#555;margin-bottom:0.1rem;}.pr-item{font-size:10.5pt;padding:0.1rem 0.28rem;background:#fdf4ff;border-radius:3px;margin-bottom:0.07rem;display:flex;align-items:center;gap:0.2rem;line-height:1.2;break-inside:avoid;page-break-inside:avoid;}.pr-num{font-weight:700;color:#86198f;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.22rem;padding:0.15rem 0;page-break-before:avoid;break-before:avoid;color:#86198f;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #86198f;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#555;}.pa{color:#007a00;font-weight:600;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · IA Generativa · Educación Básica · III Ciclo · Inteligencia Artificial</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Evaluación Final · IA Generativa · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u</div></div><div class="p-grid">${pR}</div>
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
  {txt:'Una alumna entrega un informe con tres citas de libros que la IA le dio. Ninguno de los tres existe.'},
  {txt:'En un grupo de WhatsApp circula un audio con la voz del director anunciando que no hay clases.'},
  {txt:'Un compañero le escribe a un chat el nombre completo, la escuela y la dirección de su casa para que le arme un horario.'},
  {txt:'Un estudiante entrega una tarea escrita entera por una IA y no lo dice.'},
  {txt:'Una foto de un desastre en su municipio se comparte cientos de veces. Resulta que la foto es de otro país y de hace años.'},
  {txt:'Un maestro le pide a una IA que le explique un tema y después lo comprueba en su libro antes de enseñarlo.'}
];
const critCaseQuestions=[
  '1. ¿Qué está pasando aquí y cómo se llama?',
  '2. ¿Qué daño concreto puede causar, y a quién?',
  '3. ¿Qué tendría que haber hecho esa persona, paso por paso?',
  '4. ¿Qué harías tú si te pasa mañana?'
];
const critCaseGuides=[
  'Se valora que le ponga nombre: alucinación, falsificación profunda, problema de privacidad, deshonestidad académica o desinformación. El último caso NO es ninguna de las cinco: es el uso correcto, y también hay que saber reconocerlo.',
  'Se valora que nombre a la persona perjudicada, no solo el concepto: la alumna que reprueba, la familia que no manda al niño a clases, el compañero cuyos datos quedaron guardados, el municipio del que se cree algo falso.',
  'Cada caso tiene sus pasos: verificar que la cita exista, llamar por otro medio antes de creer un audio, no dar datos de la familia, declarar el uso de la IA, y comprobar el origen de una foto antes de reenviarla.',
  'Respuesta abierta. Se valora que sea concreta y que la pueda hacer de verdad con el teléfono que tiene, no una intención general.'
];
const critErrorBank=[
  {txt:'"Si la IA lo dijo con tanta seguridad, será cierto."',
   g1:'El tono seguro no es una señal: el modelo escribe igual de seguro cuando acierta que cuando inventa.',
   g2:'Fue hecho para completar texto, no para comprobarlo.'},
  {txt:'"Para verificar un dato, le pregunto otra vez a la misma IA."',
   g1:'Eso no verifica nada: es el mismo sistema contestando otra vez.',
   g2:'Verificar es ir a la fuente que responde por el dato: el libro, la ley, la institución.'},
  {txt:'"Yo no escribe la noticia falsa, solo la comparte."',
   g1:'La desinformación vive de quien la reenvía, no de quien la escribe.',
   g2:'Compartir sin comprobar ya es parte del daño.'},
  {txt:'"Le doy mis datos porque así me contesta mejor."',
   g1:'Lo que se escribe puede quedar guardado en otra computadora, y ya no lo controlas.',
   g2:'Se le puede pedir lo mismo sin dar un solo dato de tu familia.'},
  {txt:'"Si el libro que citó suena perfecto para mi tema, existe."',
   g1:'Los títulos inventados suenan perfectos justamente porque el modelo los arma para encajar.',
   g2:'Que suene bien es la razón para desconfiar, no para creer.'},
  {txt:'"Usar IA para hacer la tarea es lo mismo que usarla para entender el tema."',
   g1:'No: en un caso aprendo yo, en el otro entrego algo que no hice.',
   g2:'Y cuando se usa, se declara: decir dónde se usó no quita mérito, lo da.'}
];
const critDecisionBank=[
  'La IA te dio un dato perfecto para tu exposición y no tienes tiempo de comprobarlo; conviene usarlo igual, o quitarlo y decir lo que sí puedes sostener.',
  'Te llega un video que te indigna y tienes el grupo abierto; conviene compartirlo ya, o comprobar antes de dónde salió.',
  'Un chat te pide tu nombre completo y tu escuela para «personalizar»; conviene dárselos, o pedirle lo mismo sin dar datos.',
  'Usaste IA para ordenar las ideas de tu ensayo; conviene decirlo en el trabajo, o callarlo porque escribiste tú el texto.',
  'Un compañero va a mandar dinero por un audio que le llegó; conviene decirle que llame primero a su familia, o no meterse.'
];
const critDecisionGuide='La mejor decisión comprueba antes de usar y antes de compartir, no entrega datos que no son suyos, y declara el uso de la IA aunque el texto lo haya escrito uno. Cuesta más tiempo y ese es justo el punto: la desinformación y las estafas funcionan porque la gente va con prisa. Y avisarle a un compañero que va a mandar dinero no es meterse: es lo que hace un amigo.';
const critCompareBank=[
  {a:'Un buscador de internet.',b:'Un modelo de lenguaje.',
   ga:'Te devuelve páginas que existen, con su dirección.',
   gb:'Te devuelve un texto que arma prediciendo palabra por palabra.',
   gr:'El buscador te enseña DÓNDE está el dato, y tú vas a mirarlo. El modelo te da el dato ya masticado y sin decir de dónde salió, y puede haberlo armado. Por eso con el modelo hace falta un paso más: buscar la fuente.'},
  {a:'Una alucinación.',b:'Una falsificación profunda.',
   ga:'El modelo inventa un dato sin que nadie se lo pida.',
   gb:'Alguien fabrica a propósito una foto, voz o video para engañar.',
   gr:'La primera es un accidente del funcionamiento; la segunda es una decisión de una persona. Las dos engañan, pero solo en una hay intención, y eso cambia quién es responsable.'},
  {a:'Usar IA para entender un tema.',b:'Usar IA para entregar la tarea.',
   ga:'Le pido que me explique, que me ponga ejemplos o que corrija lo mío.',
   gb:'Copio lo que escribió y le pongo mi nombre.',
   gr:'En la primera, al final yo sé más y puedo defender lo que escribe delante del maestro. En la segunda no aprendí nada y además afirmo que hice algo que no hice. La diferencia no es la herramienta: es qué queda en mi cabeza.'}
];
const critCauseBank=[
  {cause:'El modelo fue entrenado para predecir la palabra siguiente, no para comprobar datos.',guide:'Por eso inventa con la misma seguridad con que acierta: alucina.'},
  {cause:'Imitar una voz hoy necesita muy pocos segundos de grabación.',guide:'Por eso un audio de un familiar pidiendo dinero se comprueba llamando por otro medio.'},
  {cause:'Lo que se escribe en un servicio de internet puede quedar guardado.',guide:'Por eso no se le dan datos de la familia ni fotos de otras personas.'},
  {cause:'La desinformación se propaga por los reenvíos, no por quien la escribe.',guide:'Por eso comprobar antes de compartir es parte de la defensa, y no un detalle.'},
  {cause:'Una petición sin contexto ni formato deja al modelo adivinando qué quieres.',guide:'Por eso el resultado sale genérico, y por eso las cuatro piezas cambian tanto la respuesta.'}
];
const critEffectBank=[
  {effect:'Una alumna reprueba por citar tres libros que no existen.',guide:'Porque el modelo arma títulos que encajan con el tema, y ella no comprobó que existieran.'},
  {effect:'Una familia no manda al niño a clases por un audio falso.',guide:'Porque una voz se imita con pocos segundos de grabación y nadie llamó a comprobarlo.'},
  {effect:'Un dato inventado acaba en el examen de todo un grado.',guide:'Porque alguien lo copió sin verificar y de ahí pasó a la guía de estudio.'},
  {effect:'Declarar que usaste IA en un trabajo no te quita mérito.',guide:'Porque lo que se valora es lo que entendiste y puedes defender, y decirlo demuestra que sabes dónde está tu aporte.'},
  {effect:'Una petición con sus cuatro piezas da un resultado mucho mejor.',guide:'Porque el modelo deja de adivinar para quién es, qué se quiere y en qué forma.'}
];
function genEvalCrit(){
  sfx('click');
  _injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });
  const _sC = document.getElementById('evalCritFormaSel');
  if (_sC && parseInt(_sC.value, 10)) evalCritFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sC.value, 10)));
  const cf=evalCritFormNum;window._currentEvalCritForm=cf;const rngC = _evalRng(200000 + cf);evalCritFormNum=(evalCritFormNum%EVAL_FORMAS)+1;_injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });saveProgress();
  document.getElementById('evalcrit-screen-title').textContent=`🧠 Pensamiento Crítico · Forma ${cf} · IA Generativa`;
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
  const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Pensamiento Crítico IA Generativa · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.1rem 0.4rem;margin:0.2rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #86198f;background:#fdf4ff;color:#86198f;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#86198f;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #86198f;height:12px;}.obt-pct{white-space:nowrap;}.crit-print-scenario{font-size:10.5pt;background:#fdf4ff;border-left:3px solid #86198f;padding:0.2rem 0.5rem;margin:0.1rem 0 0.2rem;line-height:1.3;}.crit-print-q{font-size:10pt;font-weight:600;margin:0.15rem 0 0.08rem;line-height:1.25;}.ln{border-bottom:1px solid #111;min-height:12px;margin-bottom:2px;}.crit-compare-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin:0.15rem 0;}.crit-compare-print-box{font-size:9.5pt;background:#fdf4ff;border-radius:4px;padding:0.25rem 0.4rem;line-height:1.25;}.crit-print-tbl{width:100%;border-collapse:collapse;font-size:9.5pt;margin-top:0.15rem;}.crit-print-tbl th,.crit-print-tbl td{border:1px solid #999;padding:0.3rem 0.45rem;text-align:left;height:30px;vertical-align:middle;}.crit-print-tbl th{background:#fdf4ff;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.08rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.9rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.45rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.1rem;margin-bottom:0.18rem;}.p-crit-line{font-size:11pt;color:#007a00;margin-bottom:0.18rem;line-height:1.35;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.2rem;padding:0.1rem 0;color:#86198f;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #86198f;}.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:12.7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="critEvalPage"><div class="ph"><h2>Evaluación Competencial · Pensamiento Crítico · IA Generativa · Educación Básica · III Ciclo · Inteligencia Artificial</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 5 secciones de 20 puntos</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100</span></div></div><div class="pauta-wrap" id="critPautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Pensamiento Crítico · IA Generativa · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 5 secciones × 20 pts c/u — respuesta abierta, usar como guía de corrección</div></div><div class="p-grid">${pR}</div></div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("critEvalPage",250,0.55,1.2);fit("critPautaPage",250,0.55,1.2);})();<\/script></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(doc);win.document.close();setTimeout(()=>win.print(),400);
}

// ===================== LABORATORIO DE LOS SÍMBOLOS =====================
const parteData = (function () {
  /* Del vocabulario común de la ruta. Los aspectos «¿Qué riesgo trae?» y «¿Cómo
     te defiendes?» son lo propio de esta misión: en III Ciclo lo que se enseña
     ya no es la palabra, es qué hacer con ella el día que le pase. */
  const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const riesgo = {
    generativa:    'Que lo que produce parezca hecho por una persona y nadie sepa de dónde salió: textos sin autor, fotos de cosas que no pasaron.',
    modelolenguaje:'Que confundas predecir con saber. Escribe igual de seguro cuando acierta que cuando se lo inventa.',
    alucinacion:   'Que un dato inventado acabe en tu tarea, en el examen y en la guía de estudio de todo un grado.',
    privacidad:    'Que lo que escribiste quede guardado en otra computadora, y con ello datos que ni siquiera son tuyos.'
  };
  const defensa = {
    generativa:    '🔎 Pregunta siempre quién lo hizo y de dónde salió. Un texto sin autor no es una fuente.',
    modelolenguaje:'🔎 Trata cada dato como una propuesta, no como una respuesta: los cinco pasos de verificar.',
    alucinacion:   '🔎 Comprueba que lo que cita EXISTA. Un título que suena perfecto es razón para desconfiar.',
    privacidad:    '🔒 Nunca datos de tu familia, claves ni fotos de otras personas. Se le puede pedir lo mismo sin dárselos.'
  };
  const out = {};
  ['generativa','modelolenguaje','alucinacion','privacidad'].forEach(k => {
    const c = IA_CONCEPTOS.find(x => x.clave === k);
    out[k] = {
      nombre: c.palabra, icon: c.emoji,
      estructura: { title: '¿Qué es?',           info: '<strong>' + esc(c.corta) + '</strong><br><br>' + esc(c.definicion) },
      funcion:    { title: 'Un ejemplo',          info: esc(c.ejemplo) },
      ubicacion:  { title: '¿Qué riesgo trae?',   info: '⚠️ ' + esc(riesgo[k]) },
      dato:       { title: '¿Cómo te defiendes?',  info: esc(defensa[k]) }
    };
  });
  return out;
})();
let labParte='generativa',labAspecto='estructura';
function labShowParte(parteKey){labParte=parteKey;updateLabDisplay();document.querySelectorAll('.lab-cont-btn').forEach(b=>b.classList.remove('active-pri'));const btn=document.querySelector(`[data-parte="${parteKey}"]`);if(btn)btn.classList.add('active-pri');if(typeof sfx==='function')sfx('click');}
function labShowAspecto(aspectoKey){labAspecto=aspectoKey;updateLabDisplay();document.querySelectorAll('.lab-asp-btn').forEach(b=>b.classList.remove('active-sec'));const btn=document.querySelector(`[data-aspecto="${aspectoKey}"]`);if(btn)btn.classList.add('active-sec');if(typeof sfx==='function')sfx('click');}
function updateLabDisplay(){const data=parteData[labParte];const asp=data[labAspecto];document.getElementById('lab-sentence').innerHTML=`🔬 Explorando: <strong>${data.nombre}</strong> → <strong>${asp.title}</strong>`;document.getElementById('lab-display').innerHTML=`<div class="lab-cont-header">${data.icon} ${data.nombre}</div><div class="lab-asp-title">${asp.title}</div><div class="lab-asp-info">${asp.info}</div>`;}

// ===================== DIPLOMA =====================
function _diplPct(){return xp>=MXP?100:Math.round((xp/MXP)*100);}
function openDiploma(){sfx('fan');const pct=_diplPct();document.getElementById('diplPct').textContent=pct+'%';document.getElementById('diplBar').style.width=pct+'%';document.getElementById('diplDate').textContent='Fecha: '+new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});const msgs=['¡Sigue aprendiendo!','¡Muy buen trabajo!','¡Vas muy bien!','¡Ya verificas antes de creer!','¡Criterio propio ante la máquina!'];document.getElementById('diplMsg').textContent=msgs[Math.min(Math.floor(pct/25),4)];const stars=['⭐','⭐⭐','⭐⭐⭐'];document.getElementById('diplStars').textContent=stars[Math.min(Math.floor(pct/40),2)];const achTxt=unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(' · ');document.getElementById('diplAch').textContent=achTxt||'Sigue completando secciones para desbloquear logros';document.getElementById('diplomaOverlay').classList.add('open');launchConfetti();}
function closeDiploma(){document.getElementById('diplomaOverlay').classList.remove('open');}
function updateDiplomaName(v){document.getElementById('diplName').textContent=v||'Estudiante';}
function shareWA(){const name=document.getElementById('diplName').textContent||'Estudiante';const pct=_diplPct();const msg=`🧠 ¡${name} completó la Misión "IA Generativa"! 🏅 Progreso: ${pct}% · 🌱 policastsapien.com`;_waShare(msg);}
async function captureDiploma(){if(typeof html2canvas==='undefined'){showToast('⚠️ Cargando... intenta de nuevo');return;}sfx('click');const card=document.querySelector('.diploma-card');const btn=document.querySelector('.diploma-actions .btn-pri');const toHide=[card.querySelector('.diploma-input'),card.querySelector('.diploma-actions'),card.querySelector('hr')];if(btn){btn.disabled=true;btn.textContent='⏳ Capturando...';}toHide.forEach(el=>{if(el)el.style.display='none';});let dataUrl='';try{const canvas=await html2canvas(card,{scale:2,useCORS:true,backgroundColor:'#ffffff'});toHide.forEach(el=>{if(el)el.style.display='';});dataUrl=canvas.toDataURL('image/png');const name=(document.getElementById('diplName').textContent||'Estudiante').replace(/\s+/g,'-');const fileName='constancia-'+name+'.png';const cap=window.Capacitor;if(cap&&cap.isNativePlatform&&cap.isNativePlatform()&&cap.Plugins?.Filesystem&&cap.Plugins?.Share){const base64Data=dataUrl.split(',')[1];const result=await cap.Plugins.Filesystem.writeFile({path:fileName,data:base64Data,directory:'CACHE'});await cap.Plugins.Share.share({url:result.uri,dialogTitle:'Guardar / Compartir Constancia'});}else{const a=document.createElement('a');a.href=dataUrl;a.download=fileName;a.click();}}catch(e){toHide.forEach(el=>{if(el)el.style.display='';});if(e.name!=='AbortError')showToast('⚠️ No se pudo guardar la constancia');}finally{if(btn){btn.disabled=false;btn.textContent='📷 Guardar foto';}}}

// ===================== INIT =====================

// ===================== LA IA GENERATIVA, EN LA PANTALLA =====================
/* El vocabulario, los cinco pasos y las cuatro piezas se PINTAN desde
   js/data/ia-conceptos.js: la pantalla y la ficha que se fotocopia salen del
   mismo sitio, así que no pueden separarse. De ahí sale `_dev/verifica-ia.js`. */
function _esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

function pintarIaVerifica(){
  const cont=document.getElementById('ia-verifica');if(!cont)return;
  cont.innerHTML=IA_VERIFICA.map(v=>
    `<div class="ciclo-paso"><div class="ciclo-e">${v.n}️⃣</div><div><h4>${_esc(v.paso)}</h4><p>${_esc(v.detalle)}</p></div></div>`
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
  cont.innerHTML=IA_CONCEPTOS.filter(c=>c.ciclo===3).map(c=>
    `<div class="type-chip tc-purple"><div class="t-art">${c.emoji} ${_esc(c.palabra)}</div><div class="t-info">${_esc(c.corta)}</div></div>`
  ).join('');
}

// ═════════════ 💬 EL PREDICTOR DE PALABRAS ═════════════
/* La interacción que desarma el malentendido del que salen todos los demás:
   que el chat SABE. El alumno arma una frase eligiendo, paso por paso, entre
   tres continuaciones con su número de veces vistas, que es exactamente lo que
   hace un modelo de lenguaje: quedarse con la más probable.

   Y la segunda cadena lleva la trampa puesta: la palabra MÁS PROBABLE es
   FALSA. El Himno Nacional tiene siete estrofas y el alumno lo puede comprobar
   en la etapa 2 de la Ruta de la Patria, que está en esta misma plataforma. Ahí
   se ve la alucinación naciendo, en vez de que se la cuenten.

   Los números son de mentira y la pantalla lo dice: sirven para enseñar el
   mecanismo, no para afirmar con qué frecuencia aparece nada. No hay red. */
const IA_CADENAS=[
  {clave:'sana',titulo:'Una frase cualquiera',inicio:'En el recreo los niños juegan',
   pasos:[
     {ops:[{w:'al fútbol',f:52},{w:'al trompo',f:31},{w:'a la rayuela',f:9}]},
     {ops:[{w:'en el patio',f:47},{w:'en la cancha',f:25},{w:'bajo el palo de mango',f:11}]},
     {ops:[{w:'hasta que suena el timbre',f:38},{w:'toda la media hora',f:20},{w:'y después entran corriendo',f:14}]}
   ],
   moraleja:'Nada raro: armó una frase que suena bien porque cada pedazo es el que más veces vio venir detrás del anterior. <strong>No consultó nada.</strong> Y para esto, predecir alcanza.'},
  {clave:'trampa',titulo:'⚠️ La misma máquina, con un DATO',inicio:'El Himno Nacional de Honduras tiene',
   pasos:[
     {ops:[{w:'cinco estrofas',f:44,falso:true},{w:'siete estrofas',f:23,correcto:true},{w:'tres estrofas',f:8}]},
     {ops:[{w:'y un coro',f:51,correcto:true},{w:'y dos coros',f:12},{w:'sin coro',f:5}]}
   ],
   moraleja:'Aquí está la avería, y fíjate que la máquina <strong>no hizo nada distinto</strong>: eligió lo más probable, como siempre. Pero la continuación más PROBABLE no era la VERDADERA. El Himno tiene <strong>siete</strong> estrofas, y eso lo puedes comprobar tú mismo en la misión del Himno Nacional de esta plataforma. <strong>Eso es una alucinación: no es que mienta, es que no está comprobando nada.</strong>'}
];
let iaCadIdx=0, iaCadPaso=0, iaCadTexto=[], iaCadElegido=[];

function iaCadPintar(){
  const caja=document.getElementById('pred-caja'); if(!caja) return;
  const c=IA_CADENAS[iaCadIdx];
  const frase='<p class="pred-frase">'+_esc(c.inicio)+' <span class="pred-hecho">'+iaCadTexto.map(_esc).join(' ')+'</span>'+
    (iaCadPaso<c.pasos.length?' <span class="pred-hueco">___</span>':' .')+'</p>';
  if(iaCadPaso>=c.pasos.length){
    caja.innerHTML=frase+'<p class="ens-listo">'+c.moraleja+'</p>';
    return;
  }
  const ops=c.pasos[iaCadPaso].ops;
  const total=ops.reduce((s,o)=>s+o.f,0);
  caja.innerHTML=frase+
    '<p class="pred-ayuda">La máquina vio venir esto detrás. Elige una, o deja que se quede con la más probable:</p>'+
    '<div class="pred-ops">'+ops.map((o,i)=>{
      const pct=Math.round(100*o.f/total);
      return `<button class="pred-op${i===0?' pred-top':''}" onclick="iaCadElegir(${i})">
        <span class="pred-w">${_esc(o.w)}</span>
        <span class="pred-barra" aria-hidden="true"><i style="width:${pct}%"></i></span>
        <span class="pred-pct">${pct} %</span></button>`;
    }).join('')+'</div>';
}

function iaCadElegir(i){
  const c=IA_CADENAS[iaCadIdx];
  const o=c.pasos[iaCadPaso].ops[i];
  sfx('click');
  iaCadTexto.push(o.w); iaCadElegido.push(o);
  iaCadPaso++;
  iaCadPintar();
  if(o.falso){
    fb('fbPred','⚠️ Esa era la MÁS PROBABLE y es FALSA. Así nace una alucinación.',false); sfx('no');
  } else if(iaCadPaso>=c.pasos.length){
    fb('fbPred','Frase terminada. Lee abajo lo que acaba de pasar.',true);
    if(!xpTracker.wgt.has('pred_'+c.clave)){xpTracker.wgt.add('pred_'+c.clave);pts(3);}
    if(IA_CADENAS.every(x=>xpTracker.wgt.has('pred_'+x.clave))) fin('s-aprende');
  }
}

function iaCadAuto(){
  /* Lo que haría la máquina sola: quedarse siempre con la más probable. */
  sfx('click');
  const c=IA_CADENAS[iaCadIdx];
  while(iaCadPaso<c.pasos.length){
    const ops=c.pasos[iaCadPaso].ops;
    const mejor=ops.reduce((a,b)=>b.f>a.f?b:a);
    iaCadTexto.push(mejor.w); iaCadElegido.push(mejor); iaCadPaso++;
  }
  iaCadPintar();
  const falso=iaCadElegido.some(o=>o.falso);
  fb('fbPred',falso?'⚠️ Eligiendo siempre la más probable, la máquina escribió un dato FALSO. Eso es una alucinación.'
                   :'Así escribe: quedándose con la más probable en cada paso.',!falso);
  if(!xpTracker.wgt.has('pred_'+c.clave)){xpTracker.wgt.add('pred_'+c.clave);pts(3);}
  if(IA_CADENAS.every(x=>xpTracker.wgt.has('pred_'+x.clave))) fin('s-aprende');
}

function iaCadOtra(){
  sfx('click');
  iaCadIdx=(iaCadIdx+1)%IA_CADENAS.length;
  iaCadReiniciar();
  showToast('💬 '+IA_CADENAS[iaCadIdx].titulo.replace(/<[^>]*>/g,''));
}

function iaCadReiniciar(){
  iaCadPaso=0; iaCadTexto=[]; iaCadElegido=[];
  const el=document.getElementById('fbPred'); if(el) el.classList.remove('show');
  const t=document.getElementById('pred-titulo');
  if(t) t.innerHTML=IA_CADENAS[iaCadIdx].titulo;
  iaCadPintar();
}

// ═════════════ 🔎 CAZADOR DE INVENTOS ═════════════
/* Un párrafo escrito por una IA. NO se le pregunta al alumno si es verdad: se
   le pregunta QUÉ HAY QUE COMPROBAR antes de usarlo, que es la destreza de
   verdad y la única que se puede practicar sin internet.

   El texto es inventado a propósito y la pantalla lo dice con esas palabras:
   publicar aquí datos sin acreditar sería exactamente lo que esta misión enseña
   a no hacer. Lo que se marca son los TIPOS de dato que hay que verificar
   —nombres, fechas, números y citas—, no si este párrafo concreto acierta. */
const IA_TROZOS=[
  {t:'El parque municipal de la ciudad',v:false},
  {t:'fue inaugurado en 1968',v:true,por:'Una FECHA. Siempre se comprueba.'},
  {t:'y tiene una extensión de 42 manzanas.',v:true,por:'Un NÚMERO con unidad. Se comprueba en la fuente oficial.'},
  {t:'Es un lugar agradable para caminar por la tarde.',v:false},
  {t:'Según el libro «Parques de Centroamérica», de la doctora Elena Ramírez,',v:true,por:'Una CITA con autor y título. Es lo que estos programas inventan más: suena perfecto y puede no existir.'},
  {t:'alberga 37 especies de aves.',v:true,por:'Otro NÚMERO, y encima atribuido a esa cita. Si la cita no existe, el número tampoco.'},
  {t:'Conviene visitarlo temprano, cuando hay menos gente.',v:false},
  {t:'La alcaldía lo declaró patrimonio municipal el 3 de marzo de 2011.',v:true,por:'Una FECHA y un acto oficial. Se comprueba en la alcaldía o en el diario oficial.'}
];
let iaCazMarcados=new Set(), iaCazRevisado=false;

function pintarIaCazador(){
  const cont=document.getElementById('caz-texto'); if(!cont) return;
  cont.innerHTML=IA_TROZOS.map((z,i)=>
    `<button class="caz-trozo${iaCazMarcados.has(i)?' caz-marcado':''}" onclick="iaCazTocar(${i})" aria-pressed="${iaCazMarcados.has(i)}">${_esc(z.t)}</button>`
  ).join(' ');
}

function iaCazTocar(i){
  if(iaCazRevisado) return;
  sfx('click');
  if(iaCazMarcados.has(i)) iaCazMarcados.delete(i); else iaCazMarcados.add(i);
  pintarIaCazador();
}

function iaCazRevisar(){
  sfx('click'); iaCazRevisado=true;
  const cont=document.getElementById('caz-texto'); if(!cont) return;
  let bien=0, sobran=0, faltan=0;
  cont.innerHTML=IA_TROZOS.map((z,i)=>{
    const m=iaCazMarcados.has(i);
    let cls='caz-trozo';
    if(z.v&&m){cls+=' caz-ok';bien++;}
    else if(z.v&&!m){cls+=' caz-falta';faltan++;}
    else if(!z.v&&m){cls+=' caz-sobra';sobran++;}
    return `<span class="${cls}">${_esc(z.t)}${z.v&&m?' ✅':z.v?' ⬅️':' ❌'}</span>`;
  }).join(' ');
  const total=IA_TROZOS.filter(z=>z.v).length;
  const det=document.getElementById('caz-detalle');
  if(det) det.innerHTML='<h4>Por qué hay que comprobar cada uno:</h4>'+
    IA_TROZOS.filter(z=>z.v).map(z=>`<p><strong>«${_esc(z.t)}»</strong><br>${_esc(z.por)}</p>`).join('');
  if(bien===total&&sobran===0){
    fb('fbCaz','¡Los cazaste todos! +5 XP',true);
    sfx('fan'); if(!xpTracker.wgt.has('caz')){xpTracker.wgt.add('caz');pts(5);}
    fin('s-estructura'); unlockAchievement('cazador');
  } else {
    fb('fbCaz','Marcaste '+bien+' de '+total+' bien'+(sobran?', y '+sobran+' que no hacía falta comprobar (eso se juzga con la cabeza, no se verifica)':'')+'. Lee abajo.',false);
    sfx('no');
  }
}

function iaCazReiniciar(){
  sfx('click'); iaCazMarcados=new Set(); iaCazRevisado=false;
  const det=document.getElementById('caz-detalle'); if(det) det.innerHTML='';
  const el=document.getElementById('fbCaz'); if(el) el.classList.remove('show');
  pintarIaCazador();
}

// ═════════════ 🧱 ARMA LA PETICIÓN ═════════════
/* Las cuatro piezas salen de js/data/ia-conceptos.js, que es de donde las saca
   también la ficha impresa. Cada pieza tiene tres opciones: la buena, una vaga
   y una que no es una pieza (es lo que la gente escribe creyendo que ayuda:
   saludos, mayúsculas, halagos). Se arma delante del alumno para que VEA la
   diferencia entre lo que pidió y lo que va a recibir. */
const IA_OPCIONES_PETICION={
  Contexto: [
    {t:'Soy alumno de séptimo grado en Honduras y es para mi clase de Ciencias.',p:2},
    {t:'Soy estudiante.',p:1},
    {t:'Hola, buenas tardes, espero que estés muy bien.',p:0}
  ],
  Tarea: [
    {t:'Explicame qué es la fotosíntesis y para qué le sirve a la planta.',p:2},
    {t:'Hablame de las plantas.',p:1},
    {t:'HACEME LA TAREA COMPLETA.',p:0}
  ],
  Formato: [
    {t:'En cinco viñetas cortas, con palabras sencillas y sin tecnicismos.',p:2},
    {t:'Que sea cortito.',p:1},
    {t:'Como tú quieras, confío en ti.',p:0}
  ],
  Ejemplo: [
    {t:'Como se lo explicarías a alguien de quinto grado que nunca lo vio.',p:2},
    {t:'Algo parecido a lo que dice el libro.',p:1},
    {t:'Eres muy inteligente, seguro te sale bien.',p:0}
  ]
};
let iaPetSel={};

function pintarIaPeticion(){
  const cont=document.getElementById('pet-piezas'); if(!cont) return;
  cont.innerHTML=IA_PIEZAS_PETICION.map(p=>{
    const ops=IA_OPCIONES_PETICION[p.pieza]||[];
    return `<div class="pet-pieza">
      <h4>${p.emoji} ${_esc(p.pieza)} <small>${_esc(p.pregunta)}</small></h4>
      ${ops.map((o,i)=>`<button class="pet-op${iaPetSel[p.pieza]===i?' pet-on':''}" onclick="iaPetElegir('${p.pieza}',${i})" aria-pressed="${iaPetSel[p.pieza]===i}">${_esc(o.t)}</button>`).join('')}
    </div>`;
  }).join('');
  iaPetArmar();
}

function iaPetElegir(pieza,i){
  sfx('click'); iaPetSel[pieza]=i; pintarIaPeticion();
}

function iaPetArmar(){
  const salida=document.getElementById('pet-salida'); if(!salida) return;
  const partes=IA_PIEZAS_PETICION.map(p=>{
    const i=iaPetSel[p.pieza];
    return i===undefined?null:IA_OPCIONES_PETICION[p.pieza][i];
  });
  if(partes.some(x=>x===null)){
    salida.innerHTML='<p class="pet-vacio">Elige una opción de cada pieza y la petición se arma aquí.</p>';
    return;
  }
  const puntos=partes.reduce((s,o)=>s+o.p,0);
  const texto=partes.map(o=>o.t).join(' ');
  let juicio;
  if(puntos>=8) juicio='<strong>🟢 Muy buena.</strong> Tiene las cuatro piezas bien puestas: el modelo ya no tiene que adivinar nada.';
  else if(puntos>=5) juicio='<strong>🟡 A medias.</strong> Algo va vago: donde no le dices, el modelo elige por ti y sale genérico.';
  else juicio='<strong>🔴 No sirve.</strong> Casi todo lo que escribiste no le dice nada: saludar, halagarlo o gritar en mayúsculas no son piezas de una petición.';
  salida.innerHTML='<p class="pet-rot">Tu petición quedó así:</p><blockquote class="pet-texto">'+_esc(texto)+'</blockquote><p class="ens-listo">'+juicio+'</p>';
  if(puntos>=8){
    if(!xpTracker.wgt.has('pet')){xpTracker.wgt.add('pet');pts(4);sfx('fan');unlockAchievement('peticion');}
  }
}

function iaPetReiniciar(){ sfx('click'); iaPetSel={}; pintarIaPeticion(); }

window.addEventListener('DOMContentLoaded',()=>{
  try{iaDescInit();}catch(e){} // 🔭 Descubre: pinta las actividades; no marca ninguna sección. Si el archivo de datos no llegó, la misión sigue.
  initTheme();
  loadProgress();
  pintarIaVerifica();
  pintarIaReglas();
  pintarIaVocabulario();
  iaCadReiniciar();
  pintarIaCazador();
  pintarIaPeticion();
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
  document.querySelector('[data-parte="generativa"]')?.classList.add('active-pri');
  document.querySelector('[data-aspecto="estructura"]')?.classList.add('active-sec');
  renderAchPanel();
});

(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalCrit==='function') _injectFormaSel('genEvalCrit','evalCritFormaSel',evalCritFormNum,function(v){evalCritFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();

// ===================== 🔭 DESCUBRE · III CICLO =====================
/* Dos actividades de descubrimiento. Los textos y los escenarios viven en
   js/data/ia-descubre.js (IA_COMPROBAR, IA_ESCENARIOS), declarados como
   escritos para el ejercicio; la sonda `verifica-descubre-ia` comprueba que
   cada texto traiga afirmaciones de las dos clases y cada escenario su
   persona, su precio y sus consecuencias. */
const DESC_KEY = SAVE_KEY + '_descubre';
function iaDescGuardar(k, v) { try { const s = JSON.parse(localStorage.getItem(DESC_KEY) || '{}'); s[k] = v; localStorage.setItem(DESC_KEY, JSON.stringify(s)); } catch (e) {} }
function iaDescLeer(k) { try { return (JSON.parse(localStorage.getItem(DESC_KEY) || '{}'))[k]; } catch (e) { return undefined; } }
/* La sección se gana HACIENDO las dos: tres textos revisados y tres
   escenarios decididos. Nunca se marca al abrir. */
function iaDescubreListo() { if (iaCompRevisados.size >= 3 && iaEscDecididos.size >= 3) { fin('s-descubre'); unlockAchievement('decide'); } }

/* ── 🕵️ ¿Se puede comprobar? ─────────────────────────────────────────── */
let iaCompIdx = 0, iaCompMarcas = {}, iaCompRevisados = new Set(), iaCompVisto = {};
function iaCompPintarTextos() {
  const c = document.getElementById('comp-textos'); if (!c) return;
  c.innerHTML = IA_COMPROBAR.map((t, i) => '<button type="button" class="desc-chip' + (i === iaCompIdx ? ' desc-on' : '') + (iaCompRevisados.has(t.k) ? ' desc-hecho' : '') +
    '" onclick="iaCompElegir(' + i + ')">' + t.e + ' ' + _esc(t.titulo) + '</button>').join('');
}
function iaCompElegir(i) { iaCompIdx = i; iaCompPintarTextos(); iaCompPintar(!!iaCompVisto[IA_COMPROBAR[i].k]); }
function iaCompTocar(i) {
  const t = IA_COMPROBAR[iaCompIdx]; const m = iaCompMarcas[t.k] || (iaCompMarcas[t.k] = new Set());
  if (m.has(i)) m.delete(i); else m.add(i);
  iaCompPintar(false);
}
/* Mientras se marca, cada afirmación es un <button>; al revisar pasan a
   <span> con su símbolo: ✅ la que juzgaste bien, ⬅️ la que no se puede
   comprobar y no marcaste, ❌ la que marcaste y sí se podía. Igual que en el
   cazador de inventos. */
function iaCompPintar(revisado) {
  const caja = document.getElementById('comp-caja'); if (!caja) return;
  const t = IA_COMPROBAR[iaCompIdx]; const m = iaCompMarcas[t.k] || new Set();
  let html = '<p class="comp-tit">' + t.e + ' ' + _esc(t.titulo) + '</p><div class="caz-texto">';
  t.trozos.forEach((z, i) => {
    if (revisado) {
      const marcado = m.has(i);
      const cls = z.c ? (marcado ? 'caz-sobra' : 'caz-ok') : (marcado ? 'caz-ok' : 'caz-falta');
      const sim = z.c ? (marcado ? '❌ ' : '✅ ') : (marcado ? '✅ ' : '⬅️ ');
      html += '<span class="caz-trozo ' + cls + '">' + sim + _esc(z.t) + '</span>';
    } else {
      html += '<button type="button" class="caz-trozo' + (m.has(i) ? ' caz-marcado' : '') + '" aria-pressed="' + (m.has(i) ? 'true' : 'false') + '" onclick="iaCompTocar(' + i + ')">' + _esc(z.t) + '</button>';
    }
  });
  html += '</div>';
  if (revisado) html += '<div class="caz-detalle">' + t.trozos.map(z => '<p><strong>' + (z.c ? '✅ Se puede comprobar' : '🚫 No se puede comprobar') + ':</strong> «' + _esc(z.t) + '» — ' + _esc(z.por) + '</p>').join('') + '</div>';
  html += '<div class="ens-btns">' + (revisado ? '' : '<button class="btn btn-g" onclick="iaCompRevisar()">✔ Revisar</button>') +
    '<button class="btn btn-d" onclick="iaCompReiniciar()">🔄 Empezar de nuevo</button></div>';
  caja.innerHTML = html;
}
function iaCompRevisar() {
  const t = IA_COMPROBAR[iaCompIdx]; const m = iaCompMarcas[t.k] || new Set();
  let bien = 0; t.trozos.forEach((z, i) => { if ((!z.c) === m.has(i)) bien++; });
  const todo = bien === t.trozos.length; sfx(todo ? 'ok' : 'no');
  fb('fbComp', todo ? '✅ Las ' + t.trozos.length + ' bien. Sin adivinar quién lo escribió: mirando qué trae cada una.' : 'Acertaste ' + bien + ' de ' + t.trozos.length + '. Mira abajo cuál te faltó y por qué.', todo);
  if (!iaCompRevisados.has(t.k)) { iaCompRevisados.add(t.k); if (!xpTracker.wgt.has('comp_' + t.k)) { xpTracker.wgt.add('comp_' + t.k); pts(2); } }
  if (todo && !xpTracker.wgt.has('comp_ok_' + t.k)) { xpTracker.wgt.add('comp_ok_' + t.k); pts(3); }
  iaCompVisto[t.k] = true; iaCompPintarTextos(); iaCompPintar(true); iaDescubreListo();
}
function iaCompReiniciar() {
  const t = IA_COMPROBAR[iaCompIdx]; iaCompMarcas[t.k] = new Set(); iaCompVisto[t.k] = false;
  const f = document.getElementById('fbComp'); if (f) { f.textContent = ''; f.className = 'fb'; }
  iaCompPintar(false);
}

/* ── 🔮 Escenarios por venir ──────────────────────────────────────────── */
let iaEscIdx = 0, iaEscElegido = {}, iaEscDecididos = new Set();
function iaEscPintarLista() {
  const c = document.getElementById('esc-lista'); if (!c) return;
  c.innerHTML = IA_ESCENARIOS.map((e, i) => '<button type="button" class="desc-chip' + (i === iaEscIdx ? ' desc-on' : '') + (iaEscDecididos.has(e.k) ? ' desc-hecho' : '') +
    '" onclick="iaEscElegir(' + i + ')">' + e.e + ' ' + _esc(e.titulo) + '</button>').join('');
}
function iaEscElegir(i) { iaEscIdx = i; iaEscPintarLista(); iaEscPintar(); }
function iaEscPintar() {
  const caja = document.getElementById('esc-caja'); if (!caja) return;
  const e = IA_ESCENARIOS[iaEscIdx]; const el = iaEscElegido[e.k];
  let html = '<p class="esc-tit">' + e.e + ' ' + _esc(e.titulo) + '</p>' +
    '<p class="esc-quien">👤 <strong>' + _esc(e.quien) + '</strong> · lo que se juega: <strong>' + _esc(e.cuesta) + '</strong></p>' +
    '<p class="esc-sit">' + _esc(e.situacion) + '</p><div class="esc-ops">';
  e.ops.forEach((o, i) => { html += '<button type="button" class="pet-op' + (el === i ? ' pet-on' : '') + '" onclick="iaEscDecidir(' + i + ')"' + (el !== undefined ? ' disabled' : '') + '>' + _esc(o.t) + '</button>'; });
  html += '</div>';
  if (el !== undefined) {
    html += '<div class="esc-pasa"><strong>Lo que pasa:</strong> ' + _esc(e.ops[el].pasa) + '</div><div class="esc-regla">🔑 ' + _esc(e.regla) + '</div>' +
      '<div class="ens-btns"><button class="btn btn-d" onclick="iaEscOtra()">🔄 Decidir otra vez</button>' +
      (iaEscIdx < IA_ESCENARIOS.length - 1 ? '<button class="btn btn-pri" onclick="iaEscElegir(' + (iaEscIdx + 1) + ')">Siguiente ▶</button>' : '') + '</div>';
  }
  caja.innerHTML = html;
}
function iaEscDecidir(i) {
  const e = IA_ESCENARIOS[iaEscIdx]; iaEscElegido[e.k] = i; iaEscDecididos.add(e.k); sfx('ok');
  if (!xpTracker.wgt.has('esc_' + e.k)) { xpTracker.wgt.add('esc_' + e.k); pts(1); }
  iaEscPintarLista(); iaEscPintar(); iaDescubreListo();
}
function iaEscOtra() { const e = IA_ESCENARIOS[iaEscIdx]; delete iaEscElegido[e.k]; iaEscPintar(); }
function iaEscGuardar() {
  const i = document.getElementById('esc-regla'); const t = (i && i.value || '').trim();
  if (t.length < 8) { fb('fbEsc', 'Escribe la regla entera, como se la dirías a alguien de sexto.', false); return; }
  iaDescGuardar('regla', t); iaEscMostrarGuardada(t); sfx('up');
  if (!xpTracker.wgt.has('esc_regla')) { xpTracker.wgt.add('esc_regla'); pts(3); }
  fb('fbEsc', '+3 XP: una regla propia vale más que las cuatro nuestras.', true);
}
function iaEscMostrarGuardada(t) { const g = document.getElementById('esc-guardado'); if (g) g.innerHTML = '💾 Tu regla: «' + _esc(t) + '». Cópiala en la primera página de tu cuaderno.'; }
function iaDescInit() {
  iaCompPintarTextos(); iaCompPintar(false); iaEscPintarLista(); iaEscPintar();
  const r = iaDescLeer('regla'); if (r) { const i = document.getElementById('esc-regla'); if (i) i.value = r; iaEscMostrarGuardada(r); }
}
