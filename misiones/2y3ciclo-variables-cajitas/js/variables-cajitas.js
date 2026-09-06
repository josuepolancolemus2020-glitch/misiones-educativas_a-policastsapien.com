// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
function compartirMision(){const url=window.location.href;const texto=`🚀 *Misión Asignada* 🚀\n\nPractica sobre este tema y sobresale en ser de los mejores alumnos. 🏆\n\nDesbloquea *todos los logros* y puedes poner *tus datos* para que tu maestro observe todos tus logros. 📋\n\n_Se te hará prueba escrita y serás excelente estudiante en Programación._ 💻\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;_waShare(texto);}
function toggleLetra(){document.body.classList.toggle('letra-grande');if(typeof sfx==='function')sfx('click');localStorage.setItem('preferenciaLetra',document.body.classList.contains('letra-grande'));}
window.addEventListener('DOMContentLoaded',()=>{if(localStorage.getItem('preferenciaLetra')==='true')document.body.classList.add('letra-grande');});

// ===================== UTILIDADES =====================
const _pick=(arr,n)=>[...arr].sort(()=>Math.random()-0.5).slice(0,n);
const _shuffle=(arr)=>[...arr].sort(()=>Math.random()-0.5);
function fb(id,msg,isOk){const el=document.getElementById(id);if(el){el.textContent=msg;el.className='fb show '+(isOk?'ok':'err');}}

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY='variables_cajitas_v1';
let xp=0,MXP=200,done=new Set(),evalAnsVisible=false;
let evalFormNum=1,unlockedAch=[],darkMode=false,prevLevel=0;
let evalOpFormNum=1,evalOpAnsVisible=false;
const TOTAL_SECTIONS=13;
const xpTracker={fc:new Set(),qz:new Set(),cls:new Set(),id:new Set(),cmp:new Set(),reto:new Set(),sopa:new Set(),wgt:new Set(),memo:new Set(),lab:new Set()};

// ===================== NÚCLEO DE VARIABLES (intérprete compartido) =====================
// Instrucción: {op:'GUARDA'|'SUMA'|'RESTA'|'MUESTRA', n:número, v:'nombre'}
function I(op,n,v){return{op,n,v};}
function instrTxt(it){
  if(it.op==='GUARDA')return 'GUARDA '+it.n+' EN '+it.v;
  if(it.op==='SUMA')return 'SUMA '+it.n+' A '+it.v;
  if(it.op==='RESTA')return 'RESTA '+it.n+' A '+it.v;
  return 'MUESTRA '+it.v;
}
// Ejecuta UNA instrucción: devuelve {vals, out} (out = lo mostrado por MUESTRA, o null)
function ejecutarPaso(vals,it){
  const v=Object.assign({},vals);let out=null;
  if(it.op==='GUARDA')v[it.v]=it.n;
  else if(it.op==='SUMA')v[it.v]=(v[it.v]||0)+it.n;
  else if(it.op==='RESTA')v[it.v]=(v[it.v]||0)-it.n;
  else out=(v[it.v]||0);
  return{vals:v,out};
}
// Ejecuta un programa completo y devuelve el estado final de las cajitas
function ejecutarProg(vals,prog){let v=Object.assign({},vals);prog.forEach(it=>{v=ejecutarPaso(v,it).vals;});return v;}
// Traza: valores de la variable v después de cada instrucción que la cambia
function trazaVar(prog,v,ini){let val=ini||0;const t=[];prog.forEach(it=>{if(it.v!==v)return;if(it.op==='GUARDA')val=it.n;else if(it.op==='SUMA')val+=it.n;else if(it.op==='RESTA')val-=it.n;if(it.op!=='MUESTRA')t.push(val);});return t;}
// SVG de la estantería de cajitas. varsDef=[{k,emoji}], vals={k:n}, act=cajita activa (abierta)
function svgCajitasHTML(varsDef,vals,act,w){
  const n=varsDef.length,bw=104,gap=14,m=16,W=m*2+n*bw+(n-1)*gap,H=150;
  let s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"${w?` width="${w}"`:''} role="img" aria-label="Estantería de cajitas de memoria">`;
  s+=`<rect x="4" y="${H-22}" width="${W-8}" height="12" rx="4" fill="#b45309" opacity="0.85"/>`;
  varsDef.forEach((vd,i)=>{
    const x=m+i*(bw+gap),y=38,isAct=vd.k===act;
    s+=`<g${isAct?' class="caj-act"':''}>`;
    if(isAct){s+=`<polygon points="${x-4},${y} ${x+bw*0.55},${y-20} ${x+bw+4},${y}" fill="#f59e0b" stroke="#b45309" stroke-width="2"/>`;}
    else{s+=`<rect x="${x-3}" y="${y-10}" width="${bw+6}" height="12" rx="3" fill="#d97706" stroke="#92400e" stroke-width="1.5"/>`;}
    s+=`<rect x="${x}" y="${y}" width="${bw}" height="76" rx="8" fill="${isAct?'#fef3c7':'#ecfeff'}" stroke="${isAct?'#b45309':'#0e7490'}" stroke-width="${isAct?3:2}"/>`;
    s+=`<text x="${x+bw/2}" y="${y+34}" text-anchor="middle" font-size="15">${vd.emoji}</text>`;
    s+=`<text x="${x+bw/2}" y="${y+62}" text-anchor="middle" font-size="24" font-weight="bold" fill="${isAct?'#b45309':'#0e7490'}" font-family="Arial">${vals[vd.k]===undefined?'•':vals[vd.k]}</text>`;
    s+=`<rect x="${x+8}" y="${y+82}" width="${bw-16}" height="20" rx="5" fill="#0e7490"/>`;
    s+=`<text x="${x+bw/2}" y="${y+96}" text-anchor="middle" font-size="12" font-weight="bold" fill="#ffffff" font-family="Arial">${vd.k}</text>`;
    s+='</g>';
  });
  s+='</svg>';
  return s;
}

// ===================== SONIDO =====================
let sndOn=true;let AC=null;
function getAC(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}}return AC;}
function sfx(t){if(!sndOn)return;try{const ac=getAC();if(!ac)return;const g=ac.createGain();g.connect(ac.destination);const o=ac.createOscillator();o.connect(g);if(t==='click'){o.type='sine';o.frequency.setValueAtTime(800,ac.currentTime);o.frequency.linearRampToValueAtTime(1200,ac.currentTime+0.1);g.gain.setValueAtTime(0.2,ac.currentTime);g.gain.linearRampToValueAtTime(0,ac.currentTime+0.12);o.start();o.stop(ac.currentTime+0.12);}else if(t==='ok'){[523,659,784].forEach((f,i)=>{const o2=ac.createOscillator();const g2=ac.createGain();o2.connect(g2);g2.connect(ac.destination);o2.type='triangle';o2.frequency.value=f;g2.gain.setValueAtTime(0.15,ac.currentTime+i*0.1);g2.gain.linearRampToValueAtTime(0,ac.currentTime+i*0.1+0.15);o2.start(ac.currentTime+i*0.1);o2.stop(ac.currentTime+i*0.1+0.15);});}else if(t==='no'){o.type='square';o.frequency.setValueAtTime(200,ac.currentTime);o.frequency.linearRampToValueAtTime(100,ac.currentTime+0.2);g.gain.setValueAtTime(0.15,ac.currentTime);g.gain.linearRampToValueAtTime(0,ac.currentTime+0.2);o.start();o.stop(ac.currentTime+0.2);}else if(t==='up'){[523,659,784,1047].forEach((f,i)=>{const o2=ac.createOscillator();const g2=ac.createGain();o2.connect(g2);g2.connect(ac.destination);o2.type='triangle';o2.frequency.value=f;g2.gain.setValueAtTime(0.18,ac.currentTime+i*0.12);g2.gain.linearRampToValueAtTime(0,ac.currentTime+i*0.12+0.18);o2.start(ac.currentTime+i*0.12);o2.stop(ac.currentTime+i*0.12+0.18);});}else if(t==='fan'){[523,587,659,698,784,1047].forEach((f,i)=>{const o2=ac.createOscillator();const g2=ac.createGain();o2.connect(g2);g2.connect(ac.destination);o2.type='triangle';o2.frequency.value=f;g2.gain.setValueAtTime(0.15,ac.currentTime+i*0.1);g2.gain.linearRampToValueAtTime(0,ac.currentTime+i*0.1+0.2);o2.start(ac.currentTime+i*0.1);o2.stop(ac.currentTime+i*0.1+0.2);});}else if(t==='flip'){o.type='sine';o.frequency.setValueAtTime(400,ac.currentTime);o.frequency.linearRampToValueAtTime(900,ac.currentTime+0.15);g.gain.setValueAtTime(0.12,ac.currentTime);g.gain.linearRampToValueAtTime(0,ac.currentTime+0.18);o.start();o.stop(ac.currentTime+0.18);}else if(t==='tick'){o.type='sine';o.frequency.value=1000;g.gain.setValueAtTime(0.1,ac.currentTime);g.gain.linearRampToValueAtTime(0,ac.currentTime+0.05);o.start();o.stop(ac.currentTime+0.05);}else if(t==='ach'){[880,1047,1319].forEach((f,i)=>{const o2=ac.createOscillator();const g2=ac.createGain();o2.connect(g2);g2.connect(ac.destination);o2.type='triangle';o2.frequency.value=f;g2.gain.setValueAtTime(0.2,ac.currentTime+i*0.12);g2.gain.linearRampToValueAtTime(0,ac.currentTime+i*0.12+0.22);o2.start(ac.currentTime+i*0.12);o2.stop(ac.currentTime+i*0.12+0.22);});}}catch(e){}}
function toggleSnd(){sndOn=!sndOn;document.getElementById('sndBtn').textContent=sndOn?'🔊 Sonido':'🔇 Sonido';}

// ===================== DARK MODE =====================
function toggleTheme(){darkMode=!darkMode;document.documentElement.setAttribute('data-theme',darkMode?'dark':'light');document.getElementById('themeBtn').textContent=darkMode?'☀️ Tema':'🌙 Tema';localStorage.setItem(SAVE_KEY+'_theme',darkMode?'dark':'light');sfx('click');}
function initTheme(){const s=localStorage.getItem(SAVE_KEY+'_theme');const sys=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;darkMode=(s==='dark')||(s===null&&sys);if(darkMode){document.documentElement.setAttribute('data-theme','dark');document.getElementById('themeBtn').textContent='☀️ Tema';}}

// ===================== LOCALSTORAGE =====================
function saveProgress(){try{localStorage.setItem(SAVE_KEY,JSON.stringify({doneSections:Array.from(done),unlockedAch,evalFormNum,evalOpFormNum,xp}));}catch(e){}}
function loadProgress(){try{const s=JSON.parse(localStorage.getItem(SAVE_KEY));if(!s)return;if(s.doneSections&&Array.isArray(s.doneSections))s.doneSections.forEach(id=>{done.add(id);const b=document.querySelector(`[data-s="${id}"]`);if(b)b.classList.add('done');});if(s.unlockedAch&&Array.isArray(s.unlockedAch))unlockedAch=s.unlockedAch.filter(id=>ACHIEVEMENTS[id]!==undefined);if(s.evalFormNum)evalFormNum=s.evalFormNum;if(s.evalOpFormNum)evalOpFormNum=s.evalOpFormNum;if(s.xp!==undefined){xp=s.xp;updateXPBar();}}catch(e){}}

// ===================== ACHIEVEMENTS =====================
const ACHIEVEMENTS={
  primer_quiz:{icon:'📦',label:'Primer quiz de las cajitas superado'},
  flash_master:{icon:'🃏',label:'Todas las flashcards de variables exploradas'},
  clasif_pro:{icon:'🗂️',label:'Clasificador de instrucciones experto'},
  id_master:{icon:'🔍',label:'Rastreador de valores finales maestro'},
  reto_hero:{icon:'🏆',label:'Héroe del reto contra reloj'},
  lab_master:{icon:'🗃️',label:'¡Los 4 escenarios de la Máquina de Cajitas completados!'},
  nivel3:{icon:'📦',label:'¡Guardián de Cajitas! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡Ingeniero de Variables! Nivel 6'},
  widgets_master:{icon:'🧩',label:'Widgets del rastreo de variables dominados'}
};
function unlockAchievement(id){if(unlockedAch.includes(id))return;unlockedAch.push(id);sfx('ach');showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label);launchConfetti();renderAchPanel();saveProgress();}
function renderAchPanel(){const list=document.getElementById('achList');list.innerHTML='';Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{const div=document.createElement('div');div.className='ach-item'+(unlockedAch.includes(id)?'':' locked');div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`;list.appendChild(div);});}
function toggleAchPanel(){sfx('click');document.getElementById('achPanel').classList.toggle('open');}
function showToast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}t.textContent=msg;t.style.display='block';clearTimeout(t._tid);t._tid=setTimeout(()=>t.style.display='none',3200);}
function launchConfetti(){const colors=['#0e7490','#22d3ee','#b45309','#f59e0b','#06b6d4'];for(let i=0;i<60;i++){const c=document.createElement('div');c.className='confetti-piece';c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`;document.body.appendChild(c);c.addEventListener('animationend',()=>c.remove());}}

// ===================== XP =====================
const lvls=[{t:0,n:'Aprendiz 🌱'},{t:25,n:'Explorador de Cajitas 🧭'},{t:55,n:'Guardián de Cajitas 📦'},{t:90,n:'Programador Junior 💻'},{t:130,n:'Rastreador de Tablas 🔍'},{t:165,n:'Ingeniero de Variables 🏅'},{t:190,n:'Maestro de la Memoria 🏆'}];
function pts(n){xp=Math.max(0,Math.min(MXP,xp+n));updateXPBar();saveProgress();}
function updateXPBar(){const pct=Math.round((xp/MXP)*100);document.getElementById('xpFill').style.width=pct+'%';const el=document.getElementById('xpPts');el.textContent='⭐ '+xp;el.style.transform='scale(1.3)';setTimeout(()=>el.style.transform='',300);let lv=0;for(let i=0;i<lvls.length;i++)if(xp>=lvls[i].t)lv=i;document.getElementById('xpLvl').textContent=lvls[lv].n;if(lv!==prevLevel){if(lv>=2)unlockAchievement('nivel3');if(lv>=5)unlockAchievement('nivel5');prevLevel=lv;}}
function resetXP(){sfx('click');xp=0;updateXPBar();showToast('🔄 XP reiniciado a 0');}
function fin(id,showFX=true){if(!done.has(id)){done.add(id);const b=document.querySelector(`[data-s="${id}"]`);if(b)b.classList.add('done');if(showFX){sfx('up');launchConfetti();}saveProgress();}}
function getProgress(){return Math.round((done.size/TOTAL_SECTIONS)*100);}

// ===================== NAV =====================
function go(id){sfx('click');document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});document.getElementById(id).classList.add('active');const btn=document.querySelector(`[data-s="${id}"]`);if(btn){btn.classList.add('active');btn.setAttribute('aria-selected','true');}window.scrollTo({top:0,behavior:'smooth'});if(id==='s-sopa'){setTimeout(buildSopa,50);}}

// ===================== MINI-QUIZ (tarjetas Aprende / Detalle) =====================
function miniQuiz(btn,ok,fbId){const wrap=btn.parentElement;wrap.querySelectorAll('.mq-opt').forEach(b=>b.classList.remove('correct','wrong'));btn.classList.add(ok?'correct':'wrong');const f=document.getElementById(fbId);if(f){f.textContent=ok?'¡Correcto! Así piensa un programador. 🎉':'Todavía no. Vuelve a leer la tarjeta y prueba otra vez.';f.className='mq-fb '+(ok?'ok':'err');}sfx(ok?'ok':'no');if(ok&&!xpTracker.wgt.has('mq_'+fbId)){xpTracker.wgt.add('mq_'+fbId);pts(2);}}

// ===================== FLASHCARD DATA =====================
const fcData=[
  {w:'Variable',a:'📦 Una <strong>cajita con nombre</strong> que guarda <strong>un valor</strong> que puede cambiar.'},
  {w:'Nombre',a:'🏷️ El <strong>rótulo de la cajita</strong> (como puntos, edad o frijoles): dice qué guarda.'},
  {w:'Valor',a:'🔢 Lo que la cajita <strong>guarda en este momento</strong>. ¡Solo cabe UNO a la vez!'},
  {w:'GUARDA',a:'💾 Mete un valor en la cajita y <strong>borra el anterior</strong>. GUARDA 5 EN puntos deja 5.'},
  {w:'SUMA',a:'➕ <strong>Aumenta</strong> el valor usando el que ya estaba. SUMA 2 A puntos: de 5 pasa a 7.'},
  {w:'RESTA',a:'➖ <strong>Quita cantidad</strong> al valor actual. RESTA 3 A dinero: de 10 pasa a 7.'},
  {w:'MUESTRA',a:'👀 <strong>Mira el valor sin cambiarlo</strong>. La cajita queda exactamente igual.'},
  {w:'Contador',a:'1️⃣ Variable que <strong>sube de 1 en 1</strong>, como la asistencia del aula.'},
  {w:'Acumulador',a:'🧺 Variable que <strong>suma cantidades distintas</strong>, como la venta de la pulpería.'},
  {w:'Trazar',a:'👆 Seguir el valor de la variable <strong>paso a paso en una tabla</strong> para predecir el final.'},
  {w:'Tabla de valores',a:'📋 La tabla donde anotas el valor de la cajita <strong>después de cada instrucción</strong>.'},
  {w:'Valor inicial',a:'0️⃣ El primer valor que se guarda; los contadores suelen <strong>empezar en cero</strong>.'},
  {w:'Bug de variable',a:'🐛 Un <strong>error del programa</strong> que deja la cajita con un valor equivocado al final.'},
  {w:'Marcador',a:'⚽ Los goles del partido guardados en una variable que sube <strong>gol a gol</strong>.'},
];
let fcIdx=0;
function upFC(){document.getElementById('fcInner').classList.remove('flipped');document.getElementById('fcW').textContent=fcData[fcIdx].w;document.getElementById('fcA').innerHTML=fcData[fcIdx].a;document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length;}
function flipCard(){sfx('flip');document.getElementById('fcInner').classList.toggle('flipped');if(!xpTracker.fc.has(fcIdx)){xpTracker.fc.add(fcIdx);pts(1);}if(xpTracker.fc.size===fcData.length){fin('s-flash');unlockAchievement('flash_master');}}
function nextFC(){sfx('click');fcIdx=(fcIdx+1)%fcData.length;upFC();}
function prevFC(){sfx('click');fcIdx=(fcIdx-1+fcData.length)%fcData.length;upFC();}

// ===================== JUEGO: MEMORIA DE LAS CAJITAS =====================
const memoPairs=[
  {id:'variable',t:'Variable',d:'📦 Cajita con nombre que guarda un valor'},
  {id:'guarda',t:'GUARDA',d:'💾 Mete un valor y borra el anterior'},
  {id:'suma',t:'SUMA',d:'➕ Aumenta usando el valor actual'},
  {id:'muestra',t:'MUESTRA',d:'👀 Mira el valor sin cambiarlo'},
  {id:'contador',t:'Contador',d:'1️⃣ Sube de 1 en 1, como la asistencia'},
  {id:'acumulador',t:'Acumulador',d:'🧺 Suma cantidades distintas, como la venta'}
];
let memoDeck=[],memoOpen=[],memoLock=false,memoMoves=0,memoFound=0;
function buildMemo(){
  const grid=document.getElementById('memoGrid');if(!grid)return;
  memoDeck=_shuffle(memoPairs.flatMap(p=>[{id:p.id,txt:p.t,kind:'t'},{id:p.id,txt:p.d,kind:'d'}]));
  memoOpen=[];memoLock=false;memoMoves=0;memoFound=0;
  grid.innerHTML='';
  memoDeck.forEach((c,i)=>{
    const b=document.createElement('button');
    b.className='memo-card';b.setAttribute('aria-label','Carta de memoria '+(i+1));
    b.innerHTML=`<span class="memo-face memo-front">❓</span><span class="memo-face memo-back${c.kind==='t'?' memo-term':''}">${c.txt}</span>`;
    b.onclick=()=>flipMemo(b,i);
    grid.appendChild(b);
  });
  updateMemoStats();
  const f=document.getElementById('fbMemo');if(f)f.classList.remove('show');
}
function updateMemoStats(){const s=document.getElementById('memoStats');if(s)s.textContent=`🃏 Parejas: ${memoFound} de ${memoPairs.length} · Intentos: ${memoMoves}`;}
function flipMemo(btn,i){
  if(memoLock||btn.classList.contains('revealed')||btn.classList.contains('matched'))return;
  sfx('flip');btn.classList.add('revealed');memoOpen.push({btn,i});
  if(memoOpen.length<2)return;
  memoMoves++;memoLock=true;
  const[a,b]=memoOpen;
  if(memoDeck[a.i].id===memoDeck[b.i].id){
    setTimeout(()=>{
      a.btn.classList.add('matched');b.btn.classList.add('matched');
      memoFound++;sfx('ok');
      if(!xpTracker.memo.has(memoDeck[a.i].id)){xpTracker.memo.add(memoDeck[a.i].id);pts(1);}
      memoOpen=[];memoLock=false;updateMemoStats();
      if(memoFound===memoPairs.length){pts(2);fb('fbMemo',`¡Memoria completada en ${memoMoves} intentos! +2 XP extra`,true);sfx('fan');launchConfetti();}
    },450);
  }else{
    setTimeout(()=>{a.btn.classList.remove('revealed');b.btn.classList.remove('revealed');memoOpen=[];memoLock=false;sfx('no');updateMemoStats();},900);
  }
  updateMemoStats();
}
function resetMemo(){sfx('click');buildMemo();}

// ===================== QUIZ DATA =====================
const qzData=[
  {q:'¿Qué es una variable en programación?',o:['a) Un dibujo de una caja','b) Una cajita con nombre que guarda un valor que puede cambiar','c) Un número que nunca cambia','d) Un error del programa'],c:1},
  {q:'¿Qué hace GUARDA 5 EN puntos si puntos ya tenía 8?',o:['a) Deja 13','b) Deja 8','c) Deja 5 y borra el 8','d) Da error'],c:2},
  {q:'¿Qué instrucción mira el valor sin cambiarlo?',o:['a) GUARDA','b) SUMA','c) RESTA','d) MUESTRA'],c:3},
  {q:'Ejecuta: GUARDA 4 EN goles · SUMA 1 A goles · SUMA 1 A goles. ¿Cuánto vale goles?',o:['a) 4','b) 5','c) 6','d) 7'],c:2},
  {q:'La asistencia del aula que sube de 1 en 1 es un…',o:['a) acumulador','b) contador','c) bug','d) botón'],c:1},
  {q:'La venta de la pulpería (L 12 + L 8 + L 5) es un…',o:['a) contador','b) marcador','c) acumulador','d) error'],c:2},
  {q:'¿Cuántos valores guarda una variable a la vez?',o:['a) Uno','b) Dos','c) Diez','d) Todos los que quiera'],c:0},
  {q:'Ejecuta: GUARDA 10 EN dinero · RESTA 4 A dinero. ¿Cuánto queda?',o:['a) 14','b) 10','c) 4','d) 6'],c:3},
  {q:'¿Cuál es un buen nombre de variable para el dinero de la alcancía?',o:['a) x7','b) dinero','c) GUARDA','d) MUESTRA'],c:1},
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
  {label:['GUARDA (reemplaza)','SUMA o RESTA (actualiza)'],headA:'💾 GUARDA: reemplaza',headB:'➕➖ SUMA/RESTA: actualiza',colA:'g',colB:'a',
   words:[{w:'GUARDA 5 EN puntos',t:'g'},{w:'SUMA 2 A puntos',t:'a'},{w:'GUARDA 0 EN goles',t:'g'},{w:'RESTA 3 A dinero',t:'a'},{w:'GUARDA 10 EN dinero',t:'g'},{w:'SUMA 1 A latas',t:'a'},{w:'GUARDA 7 EN vidas',t:'g'},{w:'RESTA 1 A vidas',t:'a'}]},
  {label:['Cambia la cajita','Solo lee la cajita'],headA:'✏️ Cambia la cajita',headB:'👀 Solo lee',colA:'c',colB:'l',
   words:[{w:'GUARDA 5 EN puntos',t:'c'},{w:'MUESTRA puntos',t:'l'},{w:'SUMA 10 A dinero',t:'c'},{w:'MUESTRA venta',t:'l'},{w:'RESTA 2 A vidas',t:'c'},{w:'MUESTRA edad',t:'l'},{w:'GUARDA 0 EN goles',t:'c'},{w:'MUESTRA goles',t:'l'}]},
  {label:['Contador','Acumulador'],headA:'1️⃣ Contador (de 1 en 1)',headB:'🧺 Acumulador (cantidades distintas)',colA:'cont',colB:'acu',
   words:[{w:'Asistencia: SUMA 1 por alumno',t:'cont'},{w:'Venta: SUMA 12, SUMA 8, SUMA 5',t:'acu'},{w:'Goles: SUMA 1 por gol',t:'cont'},{w:'Alcancía: SUMA 5, SUMA 10',t:'acu'},{w:'Días de clase: SUMA 1',t:'cont'},{w:'Cosecha: SUMA 3 latas, SUMA 4',t:'acu'},{w:'Vueltas a la cancha: SUMA 1',t:'cont'},{w:'Puntos: SUMA 10, SUMA 5',t:'acu'}]},
  {label:['Es una variable','No es una variable'],headA:'📦 Es una variable',headB:'🚫 No es variable',colA:'v',colB:'n',
   words:[{w:'puntos del partido',t:'v'},{w:'El número 7',t:'n'},{w:'dinero de la alcancía',t:'v'},{w:'La operación 2 + 2',t:'n'},{w:'edad de Ana',t:'v'},{w:'La letra A',t:'n'},{w:'frijoles del saco',t:'v'},{w:'El número 100',t:'n'}]},
];
let currentClassGroupIdx=0,clsSelectedWord=null;
function buildClass(){const group=classGroups[currentClassGroupIdx];document.getElementById('col-left-head').textContent=group.headA;document.getElementById('col-right-head').textContent=group.headB;const bank=document.getElementById('clsBank');bank.innerHTML='';clsSelectedWord=null;document.getElementById('items-left').innerHTML='';document.getElementById('items-right').innerHTML='';_shuffle([...group.words]).forEach(w=>{const el=document.createElement('div');el.className='wb-item';el.textContent=w.w;el.dataset.t=w.t;el.onclick=()=>{document.querySelectorAll('.wb-item').forEach(i=>i.classList.remove('sel-word'));el.classList.add('sel-word');clsSelectedWord=el;sfx('click');};bank.appendChild(el);});['col-left','col-right'].forEach(colId=>{const col=document.getElementById(colId);col.onclick=(e)=>{if(!clsSelectedWord||e.target.classList.contains('drop-item'))return;const targetId=colId==='col-left'?'items-left':'items-right';const wordsCol=document.getElementById(targetId);const item=document.createElement('div');item.className='drop-item';item.textContent=clsSelectedWord.textContent;item.dataset.t=clsSelectedWord.dataset.t;const original=clsSelectedWord;item.onclick=(ev)=>{ev.stopPropagation();if(clsSelectedWord!==null){col.click();}else{document.getElementById('clsBank').appendChild(original);original.classList.remove('sel-word');item.remove();if(typeof sfx==='function')sfx('click');}};wordsCol.appendChild(item);clsSelectedWord.remove();clsSelectedWord=null;sfx('click');};});}
function checkClass(){const remaining=document.querySelectorAll('#clsBank .wb-item').length;if(remaining>0){fb('fbCls','Mueve todas las palabras a las columnas primero.',false);return;}const group=classGroups[currentClassGroupIdx];let allOk=true;document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{const inLeft=el.parentElement.id==='items-left';const expectedType=inLeft?group.colA:group.colB;if(el.dataset.t===expectedType){el.classList.add('cls-ok');}else{el.classList.add('cls-no');allOk=false;}});if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);}if(allOk){fb('fbCls','¡Perfecto! +5 XP',true);sfx('fan');fin('s-clasifica');unlockAchievement('clasif_pro');}else{fb('fbCls','Hay errores. Marcados en rojo.',false);sfx('no');}}
function nextClassGroup(){sfx('click');currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length;buildClass();document.getElementById('fbCls').classList.remove('show');showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]);}
function resetClass(){sfx('click');buildClass();document.getElementById('fbCls').classList.remove('show');}

// ===================== IDENTIFICAR (¿qué hay en la cajita al final?) =====================
const idData=[
  {s:['GUARDA 5 EN puntos ·','SUMA 2 A puntos.','Al final puntos vale:','5','6','7','8'],c:5,art:'El valor final de la cajita puntos'},
  {s:['GUARDA 8 EN goles ·','GUARDA 3 EN goles.','Al final goles vale:','11','8','3','0'],c:5,art:'El valor final de goles (GUARDA reemplaza)'},
  {s:['GUARDA 10 EN dinero ·','RESTA 4 A dinero.','Al final dinero vale:','14','10','6','4'],c:4,art:'El valor final de dinero'},
  {s:['GUARDA 0 EN latas ·','SUMA 1 A latas ·','SUMA 1 A latas.','Al final latas vale:','0','1','2','3'],c:6,art:'El valor final del contador latas'},
  {s:['GUARDA 6 EN vidas ·','MUESTRA vidas.','Al final vidas vale:','0','6','12','7'],c:3,art:'El valor final de vidas (MUESTRA no cambia)'},
  {s:['GUARDA 0 EN venta ·','SUMA 12 A venta ·','SUMA 8 A venta.','Al final venta vale:','12','8','20','24'],c:6,art:'El valor final del acumulador venta'},
  {s:['GUARDA 9 EN frijoles ·','RESTA 2 A frijoles ·','SUMA 1 A frijoles.','Al final frijoles vale:','8','7','9','12'],c:4,art:'El valor final de frijoles'},
  {s:['GUARDA 4 EN puntos ·','SUMA 3 A puntos ·','GUARDA 2 EN puntos.','Al final puntos vale:','9','7','2','6'],c:6,art:'El valor final de puntos (el último GUARDA manda)'},
];
let idIdx=0,idDone=false;
function showId(){idDone=false;if(idIdx>=idData.length){document.getElementById('idSent').innerHTML='🎉 ¡Completado!';fin('s-identifica');unlockAchievement('id_master');return;}const d=idData[idIdx];document.getElementById('idProg').textContent=`Programa ${idIdx+1} de ${idData.length}`;document.getElementById('idInfo').textContent=`Busca: ${d.art}`;const sent=document.getElementById('idSent');sent.innerHTML='';d.s.forEach((w,i)=>{const span=document.createElement('span');span.className='id-word';span.textContent=w+' ';span.onclick=()=>checkId(i,span);sent.appendChild(span);});}
function checkId(i,span){if(idDone)return;document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected'));span.classList.add('selected');if(i===idData[idIdx].c){idDone=true;span.classList.add('id-ok');fb('fbId','¡Correcto! +5 XP',true);if(!xpTracker.id.has(idIdx)){xpTracker.id.add(idIdx);pts(5);}sfx('ok');}else{span.classList.add('id-no');fb('fbId','Ese no es el valor final. Traza la tabla con el dedo.',false);sfx('no');}}
function nextId(){sfx('click');idIdx++;showId();document.getElementById('fbId').classList.remove('show');}
function resetId(){sfx('click');idIdx=0;showId();document.getElementById('fbId').classList.remove('show');}

// ===================== COMPLETA =====================
const cmpData=[
  {s:'Una variable es una ___ con nombre que guarda un valor.',opts:['cajita','puerta','regla'],c:0},
  {s:'GUARDA mete un valor nuevo y ___ el anterior.',opts:['suma','borra','muestra'],c:1},
  {s:'SUMA y RESTA calculan usando el valor ___ de la cajita.',opts:['futuro','ajeno','actual'],c:2},
  {s:'Después de MUESTRA, el valor de la cajita queda ___.',opts:['igual','doblado','en cero'],c:0},
  {s:'El ___ sube de 1 en 1, como la asistencia del aula.',opts:['acumulador','contador','marcador'],c:1},
  {s:'El acumulador suma cantidades ___, como la venta de la pulpería.',opts:['iguales','negativas','distintas'],c:2},
  {s:'GUARDA 6 EN puntos · SUMA 3 A puntos deja puntos en ___.',opts:['6','9','3'],c:1},
  {s:'GUARDA 8 EN goles · GUARDA 2 EN goles deja goles en ___.',opts:['10','8','2'],c:2},
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
// Widget 1: Traza la tabla (IDs estándar «neuron»)
const _wgtTrazaDefs=[
  {v:'puntos',prog:[I('GUARDA',5,'puntos'),I('SUMA',2,'puntos'),I('SUMA',1,'puntos')]},
  {v:'dinero',prog:[I('GUARDA',10,'dinero'),I('RESTA',4,'dinero')]},
  {v:'goles',prog:[I('GUARDA',0,'goles'),I('SUMA',1,'goles'),I('SUMA',1,'goles'),I('SUMA',1,'goles')]},
  {v:'puntos',prog:[I('GUARDA',8,'puntos'),I('GUARDA',3,'puntos')]},
  {v:'frijoles',prog:[I('GUARDA',6,'frijoles'),I('SUMA',4,'frijoles'),I('RESTA',2,'frijoles')]},
  {v:'venta',prog:[I('GUARDA',12,'venta'),I('SUMA',8,'venta')]},
  {v:'latas',prog:[I('GUARDA',4,'latas'),I('SUMA',1,'latas'),I('SUMA',1,'latas'),I('GUARDA',2,'latas')]},
  {v:'dinero',prog:[I('GUARDA',20,'dinero'),I('RESTA',5,'dinero'),I('RESTA',5,'dinero')]},
];
function _trazaMut(prog,modo){
  // recalcula la traza con un error típico, para fabricar distractores
  let val=0;const t=[];
  prog.forEach(it=>{
    if(it.op==='GUARDA')val=(modo==='gsuma')?val+it.n:it.n;
    else if(it.op==='SUMA')val=(modo==='sremp')?it.n:val+it.n;
    else if(it.op==='RESTA')val=(modo==='rsuma')?val+it.n:val-it.n;
    t.push(val);
  });
  return t;
}
const neuronPartes=_wgtTrazaDefs.map(d=>{
  const traza=trazaVar(d.prog,d.v,0);
  const ansTxt=d.v+': '+traza.join(' → ');
  const cand=['gsuma','sremp','rsuma'].map(m=>d.v+': '+_trazaMut(d.prog,m).join(' → '));
  const distr=[];
  cand.forEach(c=>{if(c!==ansTxt&&distr.indexOf(c)<0)distr.push(c);});
  let extra=1;
  while(distr.length<3){const alt=traza.slice(0,-1).concat([traza[traza.length-1]+extra]);const altTxt=d.v+': '+alt.join(' → ');if(altTxt!==ansTxt&&distr.indexOf(altTxt)<0)distr.push(altTxt);extra++;}
  const opts=[ansTxt,...distr.slice(0,3)];
  return{desc:`<div>Traza la tabla de valores de <strong>${d.v}</strong> y elige la fila correcta:</div><div class="w-prog">${d.prog.map((p,i)=>(i+1)+'. '+instrTxt(p)).join('<br>')}</div>`,ans:ansTxt,opts};
});
let neuronIdx=0,neuronDone=false;
function showNeuron(){neuronDone=false;if(neuronIdx>=neuronPartes.length){const el=document.getElementById('neuronDesc');if(el)el.innerHTML='🎉 ¡Trazaste todas las tablas!';const opts=document.getElementById('neuronOpts');if(opts)opts.innerHTML='';fin('s-widgets');return;}const d=neuronPartes[neuronIdx];const prog=document.getElementById('neuronProg');if(prog)prog.textContent=`Programa ${neuronIdx+1} de ${neuronPartes.length}`;const desc=document.getElementById('neuronDesc');if(desc)desc.innerHTML=d.desc;const opts=document.getElementById('neuronOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=opt;b.onclick=()=>checkNeuron(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuron');if(fbEl)fbEl.classList.remove('show');}
function checkNeuron(opt,btn,d){if(neuronDone)return;neuronDone=true;document.querySelectorAll('#neuronOpts .cmp-opt').forEach(b=>{if(b.textContent===d.ans)b.classList.add('correct');else if(b===btn&&b.textContent!==d.ans)b.classList.add('wrong');});const isOk=opt===d.ans;if(isOk){fb('fbNeuron','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuron_'+neuronIdx)){xpTracker.wgt.add('neuron_'+neuronIdx);pts(3);}sfx('ok');}else{fb('fbNeuron','La traza correcta es: '+d.ans,false);sfx('no');}}
function nextNeuron(){sfx('click');neuronIdx++;showNeuron();}
function resetNeuron(){sfx('click');neuronIdx=0;showNeuron();}

// Widget 2: Detective del bug (IDs estándar «neuro»)
const _wgtBugDefs=[
  {v:'goles',meta:3,buena:[I('GUARDA',0,'goles'),I('SUMA',1,'goles'),I('SUMA',1,'goles'),I('SUMA',1,'goles')],bi:2,malInstr:I('GUARDA',1,'goles')},
  {v:'dinero',meta:12,buena:[I('GUARDA',10,'dinero'),I('SUMA',5,'dinero'),I('RESTA',3,'dinero')],bi:2,malInstr:I('SUMA',3,'dinero')},
  {v:'venta',meta:25,buena:[I('GUARDA',0,'venta'),I('SUMA',12,'venta'),I('SUMA',8,'venta'),I('SUMA',5,'venta')],bi:2,malInstr:I('GUARDA',8,'venta')},
  {v:'puntos',meta:7,buena:[I('GUARDA',5,'puntos'),I('SUMA',2,'puntos'),I('MUESTRA',null,'puntos')],bi:0,malInstr:I('GUARDA',9,'puntos')},
  {v:'latas',meta:4,buena:[I('GUARDA',0,'latas'),I('SUMA',1,'latas'),I('SUMA',1,'latas'),I('SUMA',1,'latas'),I('SUMA',1,'latas')],bi:3,malInstr:I('RESTA',1,'latas')},
];
const neuroPairs=_wgtBugDefs.map(d=>{
  const mala=d.buena.map((it,i)=>i===d.bi?d.malInstr:it);
  const finMal=ejecutarProg({},mala)[d.v]||0;
  return{
    trans:`<div>La cajita <strong>${d.v}</strong> debía terminar en <strong>${d.meta}</strong>… ¡pero terminó en <strong>${finMal}</strong>! ¿En qué línea está el bug?</div><div class="w-prog" style="text-align:left;">${mala.map((p,i)=>'Línea '+(i+1)+': '+instrTxt(p)).join('<br>')}</div>`,
    func:'Línea '+(d.bi+1)+' (debe decir '+instrTxt(d.buena[d.bi])+')',
    opts:mala.map((p,i)=>'Línea '+(i+1)+(i===d.bi?' (debe decir '+instrTxt(d.buena[d.bi])+')':' (está bien)'))
  };
});
let neuroIdx=0,neuroDone=false;
function showNeuro(){neuroDone=false;if(neuroIdx>=neuroPairs.length){const el=document.getElementById('neuroTrans');if(el)el.innerHTML='🎉 ¡Todos los bugs atrapados!';const opts=document.getElementById('neuroOpts');if(opts)opts.innerHTML='';return;}const d=neuroPairs[neuroIdx];const prog=document.getElementById('neuroProg');if(prog)prog.textContent=`${neuroIdx+1} de ${neuroPairs.length}`;const trans=document.getElementById('neuroTrans');if(trans)trans.innerHTML=d.trans;const opts=document.getElementById('neuroOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkNeuro(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuro');if(fbEl)fbEl.classList.remove('show');}
function checkNeuro(opt,btn,d){if(neuroDone)return;neuroDone=true;document.querySelectorAll('#neuroOpts .qz-opt').forEach(b=>{if(b.textContent===d.func)b.classList.add('correct');else if(b===btn&&b.textContent!==d.func)b.classList.add('wrong');});const isOk=opt===d.func;if(isOk){fb('fbNeuro','¡Bug atrapado! +3 XP',true);if(!xpTracker.wgt.has('neuro_'+neuroIdx)){xpTracker.wgt.add('neuro_'+neuroIdx);pts(3);}sfx('ok');}else{fb('fbNeuro','El bug estaba en: '+d.func,false);sfx('no');}setTimeout(()=>{neuroIdx++;showNeuro();},1800);}
function resetNeuro(){sfx('click');neuroIdx=0;showNeuro();}

// Widget 3: ¿Contador o acumulador? con racha (IDs estándar «enfer»)
const enfermedadData=[
  {disease:'La asistencia del aula: SUMA 1 cada vez que llega un alumno',characteristic:'Contador',opts:['Contador','Acumulador']},
  {disease:'La venta de la pulpería: SUMA 12, luego SUMA 8, luego SUMA 5',characteristic:'Acumulador',opts:['Acumulador','Contador']},
  {disease:'Los goles del partido: SUMA 1 por cada gol',characteristic:'Contador',opts:['Contador','Acumulador']},
  {disease:'La alcancía: SUMA 5, luego SUMA 10, luego SUMA 2',characteristic:'Acumulador',opts:['Acumulador','Contador']},
  {disease:'Los días de clase del mes: SUMA 1 cada día',characteristic:'Contador',opts:['Contador','Acumulador']},
  {disease:'La cosecha de café: SUMA 3 latas, luego SUMA 4 latas',characteristic:'Acumulador',opts:['Acumulador','Contador']},
  {disease:'Las vueltas a la cancha: SUMA 1 por vuelta',characteristic:'Contador',opts:['Contador','Acumulador']},
  {disease:'Los puntos del examen: SUMA 10, luego SUMA 5, luego SUMA 25',characteristic:'Acumulador',opts:['Acumulador','Contador']},
];
let enferIdx=0,enferDone=false,enferRacha=0;
function showEnfer(){enferDone=false;if(enferIdx>=enfermedadData.length){const el=document.getElementById('enferDisease');if(el)el.textContent='🎉 ¡Completado! Racha lograda: '+enferRacha;const opts=document.getElementById('enferOpts');if(opts)opts.innerHTML='';return;}const d=enfermedadData[enferIdx];const prog=document.getElementById('enferProg');if(prog)prog.textContent=`${enferIdx+1} de ${enfermedadData.length} · 🔥 Racha: ${enferRacha}`;const dis=document.getElementById('enferDisease');if(dis)dis.textContent=d.disease;const opts=document.getElementById('enferOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkEnfer(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbEnfer');if(fbEl)fbEl.classList.remove('show');}
function checkEnfer(opt,btn,d){if(enferDone)return;enferDone=true;document.querySelectorAll('#enferOpts .qz-opt').forEach(b=>{if(b.textContent===d.characteristic)b.classList.add('correct');else if(b===btn&&b.textContent!==d.characteristic)b.classList.add('wrong');});const isOk=opt===d.characteristic;if(isOk){enferRacha++;fb('fbEnfer','¡Correcto! 🔥 Racha de '+enferRacha+' · +3 XP',true);if(!xpTracker.wgt.has('enfer_'+enferIdx)){xpTracker.wgt.add('enfer_'+enferIdx);pts(3);}sfx('ok');}else{enferRacha=0;fb('fbEnfer','Correcto era: '+d.characteristic+'. La racha vuelve a 0.',false);sfx('no');}setTimeout(()=>{enferIdx++;showEnfer();},1800);}
function resetEnfer(){sfx('click');enferIdx=0;enferRacha=0;showEnfer();}

// ===================== RETO FINAL =====================
const retoPairs=[
  {label:['Cambia la cajita','Solo lee'],btnA:'✏️ Cambia',btnB:'👀 Solo lee',colA:'c',colB:'l',
   words:[{w:'GUARDA 5 EN puntos',t:'c'},{w:'MUESTRA puntos',t:'l'},{w:'SUMA 2 A total',t:'c'},{w:'MUESTRA edad',t:'l'},{w:'RESTA 3 A vidas',t:'c'},{w:'MUESTRA venta',t:'l'},{w:'GUARDA 0 EN goles',t:'c'},{w:'MUESTRA goles',t:'l'},{w:'SUMA 10 A dinero',t:'c'},{w:'RESTA 1 A turnos',t:'c'}]},
  {label:['Contador','Acumulador'],btnA:'1️⃣ Contador',btnB:'🧺 Acumulador',colA:'cont',colB:'acu',
   words:[{w:'Asistencia: SUMA 1 por alumno',t:'cont'},{w:'Venta: SUMA 12, SUMA 8, SUMA 5',t:'acu'},{w:'Goles: SUMA 1 por gol',t:'cont'},{w:'Alcancía: SUMA 5, SUMA 10',t:'acu'},{w:'Vueltas: SUMA 1 por vuelta',t:'cont'},{w:'Cosecha: SUMA 3, SUMA 4 latas',t:'acu'},{w:'Días de clase: SUMA 1',t:'cont'},{w:'Puntos: SUMA 10, SUMA 5',t:'acu'}]},
  {label:['Es variable','No es variable'],btnA:'📦 Variable',btnB:'🚫 No es',colA:'v',colB:'n',
   words:[{w:'puntos',t:'v'},{w:'El número 7',t:'n'},{w:'edad',t:'v'},{w:'La palabra HOLA',t:'n'},{w:'frijoles',t:'v'},{w:'La operación 2 + 2',t:'n'},{w:'goles',t:'v'},{w:'El número 100',t:'n'},{w:'dinero',t:'v'},{w:'La letra A',t:'n'}]},
];
let currentRetoPairIdx=0,retoPool=[],retoOk=0,retoErr=0,retoTimerInt=null,retoSec=30,retoRunning=false,retoCurrent=null;
function updateRetoButtons(){const pair=retoPairs[currentRetoPairIdx];document.querySelectorAll('.reto-btns .btn')[0].textContent=pair.btnA;document.querySelectorAll('.reto-btns .btn')[1].textContent=pair.btnB;document.querySelectorAll('.reto-btns .btn')[0].onclick=()=>ansReto(pair.colA);document.querySelectorAll('.reto-btns .btn')[1].onclick=()=>ansReto(pair.colB);}
function startReto(){if(retoRunning)return;sfx('click');retoRunning=true;retoOk=0;retoErr=0;retoSec=30;retoPool=_shuffle([...retoPairs[currentRetoPairIdx].words,...retoPairs[currentRetoPairIdx].words]);showRetoWord();retoTimerInt=setInterval(()=>{retoSec--;sfx('tick');document.getElementById('retoTimer').textContent='⏱ '+retoSec;if(retoSec<=10)document.getElementById('retoTimer').style.color='var(--red)';if(retoSec<=0){clearInterval(retoTimerInt);endReto();}},1000);}
function showRetoWord(){if(retoPool.length===0)retoPool=_shuffle([...retoPairs[currentRetoPairIdx].words,...retoPairs[currentRetoPairIdx].words]);retoCurrent=retoPool.pop();document.getElementById('retoWord').textContent=retoCurrent.w;}
function ansReto(t){if(!retoRunning||!retoCurrent)return;const firstPlay=!xpTracker.reto.has(currentRetoPairIdx);if(t===retoCurrent.t){sfx('ok');retoOk++;if(firstPlay)pts(1);}else{sfx('no');retoErr++;if(firstPlay)pts(-1);}document.getElementById('retoScore').textContent=`✅ ${retoOk} correctas | ❌ ${retoErr} errores`;showRetoWord();}
function endReto(){retoRunning=false;document.getElementById('retoWord').textContent='🏁 ¡Tiempo!';document.getElementById('retoTimer').style.color='var(--pri)';xpTracker.reto.add(currentRetoPairIdx);const total=retoOk+retoErr;const pct=total>0?Math.round((retoOk/total)*100):0;fb('fbReto',`Resultado: ${retoOk}/${total} (${pct}%) ¡Bien hecho!`,true);fin('s-reto');sfx('fan');unlockAchievement('reto_hero');}
function nextRetoPair(){sfx('click');clearInterval(retoTimerInt);retoRunning=false;retoSec=30;retoOk=0;retoErr=0;currentRetoPairIdx=(currentRetoPairIdx+1)%retoPairs.length;updateRetoButtons();document.getElementById('retoTimer').textContent='⏱ 30';document.getElementById('retoTimer').style.color='var(--pri)';document.getElementById('retoWord').textContent='¡Prepárate!';document.getElementById('retoScore').textContent='✅ 0 correctas | ❌ 0 errores';document.getElementById('fbReto').classList.remove('show');showToast(`🔄 Pareja: ${retoPairs[currentRetoPairIdx].label[0]} vs ${retoPairs[currentRetoPairIdx].label[1]}`);}
function resetReto(){sfx('click');clearInterval(retoTimerInt);retoRunning=false;retoSec=30;retoOk=0;retoErr=0;document.getElementById('retoTimer').textContent='⏱ 30';document.getElementById('retoTimer').style.color='var(--pri)';document.getElementById('retoWord').textContent='¡Prepárate!';document.getElementById('retoScore').textContent='✅ 0 correctas | ❌ 0 errores';document.getElementById('fbReto').classList.remove('show');}

// ===================== GENERADOR DE TAREAS (aleatorio e infinito) =====================
function _rndInt(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
const TASK_VARS=['puntos','goles','dinero','frijoles','latas','tortillas','vidas','naranjas'];
// Programa aleatorio de 1 variable: GUARDA + 2-3 SUMA/RESTA con valores enteros sencillos
function _rndProgVar(){
  const v=TASK_VARS[_rndInt(0,TASK_VARS.length-1)];
  const prog=[I('GUARDA',_rndInt(2,15),v)];
  let val=prog[0].n;
  const nOps=_rndInt(2,3);
  for(let i=0;i<nOps;i++){
    const resta=Math.random()<0.4&&val>2;
    const k=resta?_rndInt(1,Math.min(9,val)):_rndInt(1,9);
    prog.push(I(resta?'RESTA':'SUMA',k,v));
    val=resta?val-k:val+k;
  }
  return{v,prog,fin:val};
}
let ansVisible=false;
function genTask(){sfx('click');const type=document.getElementById('tgType').value;const count=parseInt(document.getElementById('tgCount').value);ansVisible=false;const out=document.getElementById('tgOut');out.innerHTML='';if(type==='traza')genTrazaTask(out,count);else if(type==='meta')genMetaTask(out,count);else if(type==='contacu')genContAcuTask(out,count);else if(type==='bug')genBugTask(out,count);fin('s-tareas');}
function _instrBlock(out,title,lines){const ib=document.createElement('div');ib.className='tg-instruction-block';ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join('');out.appendChild(ib);}
function genTrazaTask(out,count){_instrBlock(out,'Instrucción',['Copia cada programa en tu cuaderno, traza la tabla de valores (el valor de la cajita después de cada instrucción) y escribe el VALOR FINAL.']);for(let i=0;i<count;i++){const t=_rndProgVar();const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>¿Cuánto queda en la cajita ${t.v}?</strong><div class="tg-prog">${t.prog.map((p,j)=>(j+1)+'. '+instrTxt(p)).join('<br>')}</div><div style="margin-top:0.4rem;font-size:0.85rem;">Valor final de ${t.v}: <span class="tg-blank">&nbsp;</span></div><div class="tg-answer">✅ Traza: ${trazaVar(t.prog,t.v,0).join(' → ')} · Valor final: ${t.fin}</div></div>`;out.appendChild(div);}}
function genMetaTask(out,count){_instrBlock(out,'Instrucción',['Escribe en tu cuaderno un programa con GUARDA y SUMA (o RESTA) que deje la cajita EXACTAMENTE en el valor pedido. Puede haber varios programas correctos: gana el más claro.']);for(let i=0;i<count;i++){const v=TASK_VARS[_rndInt(0,TASK_VARS.length-1)];const a=_rndInt(2,15);const meta=_rndInt(5,30);const dif=meta-a;const paso2=dif>=0?('SUMA '+dif+' A '+v):('RESTA '+(-dif)+' A '+v);const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>La cajita ${v} debe terminar en ${meta}.</strong> Empieza con GUARDA ${a} EN ${v} y agrega UNA instrucción más.<div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ Ejemplo: GUARDA ${a} EN ${v} → ${dif===0?('MUESTRA '+v+' (ya está en '+meta+')'):paso2}</div></div>`;out.appendChild(div);}}
const contAcuDB=[
  {t:'La asistencia del aula (llega un alumno y se anota 1)',c:'Contador'},
  {t:'La venta de la pulpería (L #A, luego L #B, luego L #C)',c:'Acumulador'},
  {t:'Los goles del partido del recreo (gol a gol)',c:'Contador'},
  {t:'El dinero de la alcancía (ahorras L #A, luego L #B)',c:'Acumulador'},
  {t:'Los días marcados de 1 en 1 en el calendario',c:'Contador'},
  {t:'Las latas de café cosechadas (#A latas, luego #B latas)',c:'Acumulador'},
  {t:'Las vueltas que das a la cancha (una por una)',c:'Contador'},
  {t:'Los puntos ganados en la feria (#A pts, luego #B pts)',c:'Acumulador'},
];
function genContAcuTask(out,count){_instrBlock(out,'Instrucción',['Copia cada situación en tu cuaderno y escribe si la variable es un CONTADOR (sube de 1 en 1) o un ACUMULADOR (suma cantidades distintas).']);const pool=_shuffle([...contAcuDB]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const txt=item.t.replace('#A',String(_rndInt(2,15))).replace('#B',String(_rndInt(2,15))).replace('#C',String(_rndInt(2,15)));const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${txt}</strong><div style="margin-top:0.4rem;font-size:0.85rem;">¿Contador o acumulador? <span class="tg-blank">&nbsp;</span></div><div class="tg-answer">✅ ${item.c}</div></div>`;out.appendChild(div);}}
function genBugTask(out,count){_instrBlock(out,'Instrucción',['Cada programa debería dejar la cajita en el valor META, pero tiene UN bug (una instrucción equivocada). Escribe el número de la línea errada y la instrucción correcta.']);for(let i=0;i<count;i++){const t=_rndProgVar();const meta=t.fin;const bi=_rndInt(0,t.prog.length-1);const buena=t.prog[bi];let malInstr;if(buena.op==='GUARDA')malInstr=I('GUARDA',buena.n+_rndInt(3,9),t.v);else if(buena.op==='SUMA')malInstr=I('RESTA',buena.n,t.v);else malInstr=I('SUMA',buena.n,t.v);const mala=t.prog.map((p,j)=>j===bi?malInstr:p);const finMal=ejecutarProg({},mala)[t.v]||0;const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>META: ${t.v} debe terminar en ${meta}… pero este programa lo deja en ${finMal}.</strong><div class="tg-prog">${mala.map((p,j)=>'Línea '+(j+1)+': '+instrTxt(p)).join('<br>')}</div><div style="margin-top:0.4rem;font-size:0.85rem;">Línea errada: <span class="tg-blank">&nbsp;</span> · Corrección: <span class="tg-blank">&nbsp;</span></div><div class="tg-answer">✅ Línea ${bi+1}: debe decir ${instrTxt(buena)}</div></div>`;out.appendChild(div);}}
function toggleAns(){ansVisible=!ansVisible;document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none');sfx('click');}

// ===================== SOPA DE LETRAS =====================
const sopaSets=[
  {size:10,grid:[
    ['G','A','P','L','Y','F','E','S','J','F'],
    ['C','A','M','B','I','A','D','B','F','U'],
    ['V','S','L','P','X','U','Q','Q','X','U'],
    ['E','A','K','E','S','P','H','I','N','I'],
    ['R','A','R','C','N','I','Q','I','R','C'],
    ['B','K','O','I','A','L','P','F','O','X'],
    ['M','A','P','A','A','J','W','Q','L','Z'],
    ['O','B','V','M','A','B','I','M','A','A'],
    ['N','B','U','Z','B','N','L','T','V','G'],
    ['G','U','A','R','D','A','U','E','A','R']
  ],words:[
    {w:'VARIABLE',cells:[[2,0],[3,1],[4,2],[5,3],[6,4],[7,5],[8,6],[9,7]]},
    {w:'CAJITA',cells:[[4,3],[5,4],[6,5],[7,6],[8,7],[9,8]]},
    {w:'VALOR',cells:[[8,8],[7,8],[6,8],[5,8],[4,8]]},
    {w:'GUARDA',cells:[[9,0],[9,1],[9,2],[9,3],[9,4],[9,5]]},
    {w:'NOMBRE',cells:[[8,0],[7,0],[6,0],[5,0],[4,0],[3,0]]},
    {w:'CAMBIA',cells:[[1,0],[1,1],[1,2],[1,3],[1,4],[1,5]]}
  ]},
  {size:10,grid:[
    ['J','M','N','M','R','E','S','T','A','C'],
    ['R','G','P','A','W','E','A','M','Y','R'],
    ['T','O','N','R','A','D','Z','C','X','C'],
    ['S','T','D','C','A','M','H','Z','J','A'],
    ['K','K','X','A','R','E','U','A','A','I'],
    ['F','X','K','D','T','Q','E','S','V','F'],
    ['S','R','R','O','S','N','X','Z','B','G'],
    ['C','H','R','R','E','F','O','S','D','F'],
    ['Z','E','J','F','U','O','F','C','C','I'],
    ['C','J','W','J','M','A','S','D','M','K']
  ],words:[
    {w:'CONTADOR',cells:[[8,7],[7,6],[6,5],[5,4],[4,3],[3,2],[2,1],[1,0]]},
    {w:'MARCADOR',cells:[[0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3]]},
    {w:'SUMA',cells:[[5,7],[4,6],[3,5],[2,4]]},
    {w:'RESTA',cells:[[0,4],[0,5],[0,6],[0,7],[0,8]]},
    {w:'MUESTRA',cells:[[9,4],[8,4],[7,4],[6,4],[5,4],[4,4],[3,4]]},
    {w:'CERO',cells:[[9,0],[8,1],[7,2],[6,3]]}
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
function sopaLinterna(){
  sfx('click');
  if(xp<2){showToast('⚠️ Necesitas al menos 2 XP para usar la linterna.');return;}
  const set=sopaSets[currentSopaSetIdx];
  const pend=set.words.filter(wObj=>!sopaFoundWords.has(wObj.w));
  if(pend.length===0){showToast('🎉 ¡Ya encontraste todas las palabras!');return;}
  pts(-2);
  const cells=[];
  pend.forEach(wObj=>wObj.cells.forEach(([r,c])=>{const el=document.querySelector(`#sopaGrid [data-row="${r}"][data-col="${c}"]`);if(el){el.classList.add('sopa-peek');cells.push(el);}}));
  showToast('🔦 ¡Linterna encendida 3 segundos! (-2 XP)');
  setTimeout(()=>cells.forEach(el=>el.classList.remove('sopa-peek')),3000);
}
let _sopaResizeTimer=null;
window.addEventListener('resize',()=>{clearTimeout(_sopaResizeTimer);_sopaResizeTimer=setTimeout(()=>{if(document.getElementById('s-sopa').classList.contains('active'))buildSopa();},200);});

// ===================== EVALUACIÓN FINAL (CONCEPTUAL) =====================
const evalTFBank=[
  {q:'Una variable es una cajita con nombre que guarda un valor que puede cambiar.',a:true},
  {q:'GUARDA suma el valor nuevo al que ya estaba en la cajita.',a:false},
  {q:'GUARDA reemplaza (borra) el valor anterior de la cajita.',a:true},
  {q:'SUMA usa el valor actual de la cajita para calcular el nuevo.',a:true},
  {q:'MUESTRA cambia el valor de la cajita.',a:false},
  {q:'El contador sube de 1 en 1, como la asistencia del aula.',a:true},
  {q:'El acumulador siempre suma la misma cantidad.',a:false},
  {q:'Después de GUARDA 5 EN puntos y SUMA 2 A puntos, puntos vale 7.',a:true},
  {q:'Después de GUARDA 8 EN puntos y GUARDA 3 EN puntos, puntos vale 11.',a:false},
  {q:'Una variable puede guardar muchos valores al mismo tiempo.',a:false},
  {q:'El marcador de un partido puede guardarse en una variable.',a:true},
  {q:'RESTA 3 A dinero deja el dinero igual que antes.',a:false},
  {q:'Trazar una tabla de valores ayuda a seguir la variable paso a paso.',a:true},
  {q:'El nombre de la variable ayuda a saber qué guarda la cajita.',a:true},
  {q:'Leer una variable con MUESTRA es lo mismo que cambiarla.',a:false},
];
const evalMCBank=[
  {q:'Una variable en programación es como…',o:['Un dibujo del robot','Una cajita con nombre que guarda un valor que puede cambiar','Un error del programa','Un botón de apagado'],a:1},
  {q:'¿Qué hace GUARDA 5 EN puntos si puntos ya tenía 8?',o:['Deja 13','Deja 5 y borra el 8','Deja 8','Da error'],a:1},
  {q:'¿Qué instrucción mira el valor sin cambiarlo?',o:['GUARDA','SUMA','MUESTRA','RESTA'],a:2},
  {q:'Ejecuta: GUARDA 4 EN goles · SUMA 1 A goles · SUMA 1 A goles. ¿Cuánto vale goles?',o:['4','5','6','7'],a:2},
  {q:'¿Cuál es un buen nombre de variable para el dinero de la alcancía?',o:['x7','dinero','GUARDA','MUESTRA'],a:1},
  {q:'El contador…',o:['sube de 1 en 1','suma cantidades distintas','borra la cajita','nunca cambia'],a:0},
  {q:'El acumulador…',o:['sube siempre de 1 en 1','suma cantidades distintas cada vez','solo lee el valor','apaga el programa'],a:1},
  {q:'Ejecuta: GUARDA 10 EN dinero · RESTA 4 A dinero. ¿Cuánto queda?',o:['14','10','6','4'],a:2},
  {q:'GUARDA 6 EN puntos · ___ deja puntos en 9. ¿Qué instrucción falta?',o:['SUMA 3 A puntos','RESTA 3 A puntos','GUARDA 15 EN puntos','MUESTRA puntos'],a:0},
  {q:'La asistencia del aula que sube de 1 en 1 es un…',o:['acumulador','contador','bug','nombre'],a:1},
  {q:'La venta de la pulpería (L 12 + L 8 + L 5) es un…',o:['contador','acumulador','giro','dibujo'],a:1},
  {q:'¿Cuántos valores guarda una variable a la vez?',o:['Uno','Dos','Diez','Todos los que quiera'],a:0},
  {q:'Ejecuta: GUARDA 7 EN puntos · MUESTRA puntos. ¿Cuánto vale puntos al final?',o:['0','7','14','Nada'],a:1},
  {q:'¿Qué hace RESTA 2 A vidas?',o:['Aumenta 2 al valor','Quita 2 usando el valor actual','Borra la variable','Muestra el valor'],a:1},
  {q:'Al trazar la tabla de valores escribimos…',o:['el valor de la cajita después de cada instrucción','el nombre del alumno','solo el resultado final sin pasos','un dibujo de la cajita'],a:0},
];
const evalCPBank=[
  {q:'Una ___ es una cajita con nombre que guarda un valor que puede cambiar.',a:'variable'},
  {q:'La instrucción ___ mete un valor en la cajita y borra el anterior.',a:'GUARDA'},
  {q:'La instrucción ___ aumenta el valor usando el que ya estaba.',a:'SUMA'},
  {q:'La instrucción ___ quita cantidad al valor de la cajita.',a:'RESTA'},
  {q:'La instrucción ___ mira el valor sin cambiarlo.',a:'MUESTRA'},
  {q:'El ___ sube de 1 en 1, como la asistencia del aula.',a:'contador'},
  {q:'El ___ suma cantidades distintas, como la venta de la pulpería.',a:'acumulador'},
  {q:'Cada variable tiene un ___ que la identifica, como puntos o edad.',a:'nombre'},
  {q:'Ejecuta: GUARDA 5 EN puntos · SUMA 2 A puntos. Al final puntos vale ___.',a:'7'},
  {q:'Ejecuta: GUARDA 8 EN puntos · GUARDA 3 EN puntos. Al final puntos vale ___.',a:'3'},
  {q:'Seguir el valor de la variable paso a paso en una tabla se llama ___.',a:'trazar'},
  {q:'Después de MUESTRA puntos, el valor de la cajita queda ___ (igual o cambiado).',a:'igual'},
  {q:'Ejecuta: GUARDA 10 EN dinero · RESTA 4 A dinero. Al final dinero vale ___.',a:'6'},
  {q:'Dentro de un programa, las instrucciones se ejecutan en ___, una por una.',a:'orden'},
  {q:'La cajita guarda solamente ___ valor a la vez.',a:'un'},
];
const evalPRBank=[
  {term:'Variable',def:'Cajita con nombre que guarda un valor que cambia'},
  {term:'GUARDA',def:'Mete un valor y borra el anterior'},
  {term:'SUMA',def:'Aumenta el valor usando el actual'},
  {term:'RESTA',def:'Quita cantidad al valor actual'},
  {term:'MUESTRA',def:'Mira el valor sin cambiarlo'},
  {term:'Contador',def:'Variable que sube de 1 en 1'},
  {term:'Acumulador',def:'Variable que suma cantidades distintas'},
  {term:'Nombre',def:'Rótulo que identifica la cajita'},
  {term:'Valor',def:'Lo que la cajita guarda en un momento'},
  {term:'Trazar',def:'Seguir el valor paso a paso en una tabla'},
  {term:'Marcador',def:'Los goles del partido en una variable'},
  {term:'Alcancía',def:'Dinero guardado que sube y baja'},
  {term:'Cero',def:'Valor típico para empezar un contador'},
  {term:'Programa',def:'Lista de instrucciones en orden'},
  {term:'Bug',def:'Error que deja mal el valor final'},
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

function genEval(){sfx('click');_evalFormaSelector(); const _selF = document.getElementById('evalFormaSel'); if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10))); const cf = evalFormNum; const rng = _evalRng(cf); window._currentEvalForm=cf;evalFormNum = (evalFormNum % EVAL_FORMAS) + 1; _evalFormaSelector();saveProgress();document.getElementById('eval-screen-title').textContent=`🎓 Evaluación Final · Forma ${cf} · Variables: las Cajitas de Memoria`;evalAnsVisible=false;const out=document.getElementById('evalOut');out.innerHTML='';const bar=document.createElement('div');bar.className='eval-score-bar';bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje · 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25 pts</span><span class="eval-score-pill esp-tf">V/F 25 pts</span><span class="eval-score-pill esp-mc">Selección 25 pts</span><span class="eval-score-pill esp-pr">Pareados 25 pts</span></div>`;out.appendChild(bar);const cpItems=_pickF(evalCPBank,5, rng);const s1=document.createElement('div');s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';cpItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='cp';d.dataset.evalIndex=i;const qHtml=item.q.replace('___',`<input class="eval-cp-input" type="text" data-cp="${i}" autocomplete="off">`);d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbCp${i}" aria-live="polite"></div>`;s1.appendChild(d);});out.appendChild(s1);const tfItems=_pickF(evalTFBank,5, rng);const s2=document.createElement('div');s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';tfItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='tf';d.dataset.evalIndex=i;d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="true"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="false"> Falso</label></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbTf${i}" aria-live="polite"></div>`;s2.appendChild(d);});out.appendChild(s2);const mcItems=_pickF(evalMCBank,5, rng);const s3=document.createElement('div');s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';mcItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='mc';d.dataset.evalIndex=i;const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join('');d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbMc${i}" aria-live="polite"></div>`;s3.appendChild(d);});out.appendChild(s3);const prItems=_pickF(evalPRBank,5, rng);let shuffledDefs=_shuffleF(prItems, rng);let _prTries=0;while(shuffledDefs.some((df,ix)=>df.def===prItems[ix].def)&&_prTries<20){shuffledDefs=_shuffleF(shuffledDefs, rng);_prTries++;}const letters=['A','B','C','D','E'];const s4=document.createElement('div');s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';const matchCard=document.createElement('div');matchCard.className='eval-item';let colLeft='<div class="eval-match-col"><h4>📌 Términos</h4>';prItems.forEach((item,i)=>{colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> <select class="eval-match-select" data-pr="${i}" aria-label="Respuesta pareada ${i+16}"><option value="">—</option>${letters.map(l=>`<option value="${l}">${l}</option>`).join('')}</select> ${item.term}</div>`;});colLeft+='</div>';let colRight='<div class="eval-match-col"><h4>🔑 Definiciones</h4>';shuffledDefs.forEach((item,i)=>{colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`;});colRight+='</div>';const ansKey=prItems.map((item,i)=>{const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)];return`${i+16}→${letter}`;}).join(' · ');matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div><div class="eval-item-feedback" id="evalFbPr" aria-live="polite"></div>`;s4.appendChild(matchCard);out.appendChild(s4);window._evalPrintData={tf:tfItems,mc:mcItems,cp:cpItems,pr:{terms:prItems,shuffledDefs,letters}};const autoPanel=document.createElement('div');autoPanel.id='evalAutoResult';autoPanel.className='eval-auto-result';autoPanel.innerHTML='<strong>🧮 Evaluación interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato original sin respuestas digitadas.';out.appendChild(autoPanel);fin('s-evaluacion');}
function toggleEvalAns(){evalAnsVisible=!evalAnsVisible;document.querySelectorAll('#evalOut .eval-answer').forEach(el=>el.style.display=evalAnsVisible?'block':'none');sfx('click');}
function normalizeEvalAnswer(v){return(v||'').toString().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\s+/g,' ').replace(/[()«»]/g,'').trim();}
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación Variables: las Cajitas de Memoria · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.12rem 0.4rem;margin:0.22rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #0e7490;background:#ecfeff;color:#0e7490;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#0e7490;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #0e7490;height:12px;}.obt-pct{white-space:nowrap;}.qn{font-weight:700;min-width:22px;flex-shrink:0;}.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:40px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.18rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.14rem 0.35rem;margin-bottom:0.1rem;break-inside:avoid;page-break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.3;display:flex;gap:0.28rem;margin-bottom:0.07rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.1rem 0.5rem;}.mc-opts{display:grid;grid-template-columns:repeat(2,1fr);gap:0.04rem 0.15rem;margin-left:0.8rem;}.mc-opt{font-size:9pt;display:flex;align-items:center;gap:0.15rem;}.mc-opt input{width:10px;height:10px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{margin-top:0.1rem;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.08rem 0.4rem;margin-top:0.08rem;}.pr-head{font-size:9pt;font-weight:700;color:#555;margin-bottom:0.1rem;}.pr-item{font-size:10.5pt;padding:0.1rem 0.28rem;background:#ecfeff;border-radius:3px;margin-bottom:0.07rem;display:flex;align-items:center;gap:0.2rem;line-height:1.2;break-inside:avoid;page-break-inside:avoid;}.pr-num{font-weight:700;color:#0e7490;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.22rem;padding:0.15rem 0;page-break-before:avoid;break-before:avoid;color:#0e7490;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #0e7490;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#555;}.pa{color:#007a00;font-weight:600;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · Variables: las Cajitas de Memoria · Educación Básica · Programación</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Evaluación Final · Variables: las Cajitas de Memoria · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u · Programación · Educación Básica</div></div><div class="p-grid">${pR}</div>
  ${zgBlock}</div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("evalPage",252,0.55,1.45);fit("pautaPage",252,0.55,1.3);})();<\/script></body></html>`;const win=window.open('','_blank','');if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}win.document.write(doc);win.document.close();setTimeout(()=>win.print(),400);}

// ===================== PRUEBA OPERATIVA (tablas de traza deterministas) =====================
function evalSwitchMode(mode){
  sfx('click');
  const cWrap=document.getElementById('evalConceptWrap'),oWrap=document.getElementById('evalOpWrap');
  const cBtn=document.getElementById('evalModeBtnConcept'),oBtn=document.getElementById('evalModeBtnOp');
  if(mode==='op'){
    cWrap.style.display='none';oWrap.style.display='block';
    cBtn.classList.remove('active');cBtn.setAttribute('aria-selected','false');
    oBtn.classList.add('active');oBtn.setAttribute('aria-selected','true');
    if(!window._evalOpData)genEvalOp();
  }else{
    oWrap.style.display='none';cWrap.style.display='block';
    oBtn.classList.remove('active');oBtn.setAttribute('aria-selected','false');
    cBtn.classList.add('active');cBtn.setAttribute('aria-selected','true');
  }
}

// ---- Helpers deterministas (siempre sembrados con _evalRng(100000+forma)) ----
let _opRnd = Math.random;
function _opRint(min, max) { return Math.floor(_opRnd() * (max - min + 1)) + min; }
const OP_VARS=['puntos','goles','dinero','frijoles','latas','tortillas','vidas','naranjas'];

// I. Ejecuta y traza (5 × 4 = 20 pts): programa de 3-4 instrucciones sobre 1 variable;
//    el alumno escribe el valor final (en línea input numérico; impreso, tabla de traza).
function genEjecutaItems(){
  const items=[];
  const vs=_pickF(OP_VARS,5,_opRnd);
  for(let i=0;i<5;i++){
    const v=vs[i];
    const prog=[I('GUARDA',_opRint(2,12),v)];
    let val=prog[0].n;
    const nOps=_opRint(2,3);
    for(let k=0;k<nOps;k++){
      const resta=_opRnd()<0.4&&val>2;
      const n=resta?_opRint(1,Math.min(9,val)):_opRint(1,9);
      prog.push(I(resta?'RESTA':'SUMA',n,v));
      val=resta?val-n:val+n;
    }
    items.push({v,prog,ans:val});
  }
  return items;
}

// II. Predice la salida (5 × 2 = 10 pts): ¿GUARDA reemplaza o suma?, conteos, lectura…
function genPrediceItems(){
  const items=[];
  const vy=_pickF(OP_VARS,5,_opRnd);
  const k1=_opRint(2,9),p1=_opRint(2,9);
  items.push({txt:`La cajita ${vy[0]} tenía ${k1} y se ejecuta GUARDA ${p1} EN ${vy[0]}. ¿GUARDA reemplaza o suma? (escribe: reemplaza o suma)`,ans:'reemplaza'});
  const a2=_opRint(2,9),b2=_opRint(1,9);
  items.push({txt:`Programa: GUARDA ${a2} EN ${vy[1]} · SUMA ${b2} A ${vy[1]} · MUESTRA ${vy[1]} · SUMA ${b2} A ${vy[1]}. ¿Cuántas veces CAMBIÓ el valor de la cajita? (MUESTRA no la cambia)`,ans:'3'});
  items.push({txt:`Después de MUESTRA ${vy[2]}, ¿cambió el valor de la cajita? (escribe: sí o no)`,ans:'no'});
  if(_opRnd()<0.5){items.push({txt:'La asistencia del aula sube de 1 en 1 cada vez que llega un alumno. ¿Es un contador o un acumulador?',ans:'contador'});}
  else{items.push({txt:`La venta de la pulpería suma L ${_opRint(5,15)}, luego L ${_opRint(5,15)} y luego L ${_opRint(5,15)}. ¿Es un contador o un acumulador?`,ans:'acumulador'});}
  const a5=_opRint(2,9);let b5=_opRint(2,9);if(b5===a5)b5=(b5%9)+1;
  items.push({txt:`Programa: GUARDA ${a5} EN ${vy[4]} · GUARDA ${b5} EN ${vy[4]}. ¿Cuánto vale ${vy[4]} al final?`,ans:String(b5)});
  return _shuffleF(items,_opRnd);
}
function _isPredOk(student,expected){
  let s=normalizeEvalAnswer(student).replace(/^(el|la|un|una)\s+/,'').replace(/\.$/,'');
  const e=normalizeEvalAnswer(expected);
  if(!s)return false;
  return s===e||(e.length>3&&s.indexOf(e)===0);
}

// III. Completa el programa (5 × 4 = 20 pts): falta UNA instrucción, con opciones.
function genCompletaItems(){
  const t=[];const vs=_pickF(OP_VARS,5,_opRnd);
  {const a=_opRint(2,9),k=_opRint(2,9),v=vs[0];
   t.push({txt:`La cajita ${v} debe terminar en ${a+k}.`,lines:[`GUARDA ${a} EN ${v}`,'___'],opts:[`SUMA ${k} A ${v}`,`RESTA ${k} A ${v}`,`GUARDA ${k} EN ${v}`,`MUESTRA ${v}`],ans:0});}
  {const a=_opRint(6,12),k=_opRint(2,5),v=vs[1];
   t.push({txt:`La cajita ${v} debe terminar en ${a-k}.`,lines:[`GUARDA ${a} EN ${v}`,'___'],opts:[`SUMA ${k} A ${v}`,`RESTA ${k} A ${v}`,`GUARDA ${a} EN ${v}`,`MUESTRA ${v}`],ans:1});}
  {const a=_opRint(2,9),k=_opRint(2,9),v=vs[2];
   t.push({txt:`La cajita ${v} debe terminar en ${a+k}.`,lines:['___',`SUMA ${k} A ${v}`],opts:[`GUARDA ${a} EN ${v}`,`GUARDA ${a+k} EN ${v}`,`RESTA ${a} A ${v}`,`MUESTRA ${v}`],ans:0});}
  {const a=_opRint(2,9),k=_opRint(2,9),v=vs[3];
   t.push({txt:`Al final se debe VER el valor de ${v} sin cambiarlo.`,lines:[`GUARDA ${a} EN ${v}`,`SUMA ${k} A ${v}`,'___'],opts:[`SUMA ${k} A ${v}`,`GUARDA 0 EN ${v}`,`MUESTRA ${v}`,`RESTA ${k} A ${v}`],ans:2});}
  {const a=_opRint(2,9),b=_opRint(10,20),v=vs[4];
   t.push({txt:`La cajita ${v} debe terminar EXACTAMENTE en ${b}, sin importar lo que tenía.`,lines:[`GUARDA ${a} EN ${v}`,'___'],opts:[`SUMA ${b} A ${v}`,`GUARDA ${b} EN ${v}`,`RESTA ${b} A ${v}`,`MUESTRA ${v}`],ans:1});}
  return _shuffleF(t,_opRnd);
}
function _cmpProgTxt(it){return it.lines.join(' · ');}

// IV. Problemas de la vida real (3 × 10 = 30 pts): programas con GUARDA/SUMA/RESTA.
const OP_VIDA_RUBRICA='Usa GUARDA para el valor inicial (3 pts) · SUMA/RESTA correctos y en orden (4 pts) · Termina con MUESTRA y el valor final correcto (3 pts)';
function genVidaItems(){
  const bank=[];
  {const n=_opRint(2,3);
   bank.push({tema:'El marcador del partido de fútbol',
     enun:`El partido empieza 0 a 0 y la Selección anota ${n} goles, uno por uno. Escribe el programa que lleva la cuenta en la cajita goles y muestra el marcador final.`,
     pasos:['GUARDA 0 EN goles'].concat(Array(n).fill('SUMA 1 A goles')).concat(['MUESTRA goles (queda en '+n+')'])});}
  {const a=_opRint(10,20),b=_opRint(5,10),c=_opRint(2,4);
   bank.push({tema:'La alcancía de la feria',
     enun:`En la alcancía ya tenías L ${a}. En la feria ganas L ${b} y luego gastas L ${c} en un churro. Escribe el programa de la cajita dinero y muestra cuánto queda.`,
     pasos:[`GUARDA ${a} EN dinero`,`SUMA ${b} A dinero`,`RESTA ${c} A dinero`,`MUESTRA dinero (queda en ${a+b-c})`]});}
  {const x=_opRint(8,15),y=_opRint(4,10),z=_opRint(2,8);
   bank.push({tema:'La venta de tortillas',
     enun:`Doña María empieza el día sin vender nada y vende L ${x}, luego L ${y} y luego L ${z}. Escribe el programa del acumulador venta y muestra el total.`,
     pasos:['GUARDA 0 EN venta',`SUMA ${x} A venta`,`SUMA ${y} A venta`,`SUMA ${z} A venta`,`MUESTRA venta (queda en ${x+y+z})`]});}
  return _shuffleF(bank,_opRnd);
}

// V. Olimpiada (10 + 10 = 20 pts)
// (a) Traza cruzada: DOS variables a la vez
function genRetoCruzada(){
  const par=_pickF(OP_VARS,2,_opRnd);
  const v1=par[0],v2=par[1];
  const a=_opRint(3,9),b=_opRint(4,9),c=_opRint(1,6),d2=_opRint(1,3),e=_opRint(1,6);
  const prog=[I('GUARDA',a,v1),I('GUARDA',b,v2),I('SUMA',c,v1),I('RESTA',d2,v2),I('SUMA',e,v2)];
  return{v1,v2,prog,ans1:a+c,ans2:b-d2+e};
}
// (b) Detective del bug: la cajita termina mal; hallar la línea y corregirla
function genRetoBug(){
  const v=_pickF(OP_VARS,1,_opRnd)[0];
  const a=_opRint(2,9),b=_opRint(1,9),c=_opRint(1,9);
  const buena=[`GUARDA ${a} EN ${v}`,`SUMA ${b} A ${v}`,`SUMA ${c} A ${v}`];
  const meta=a+b+c;
  const bi=_opRint(0,2);
  const mala=[...buena];
  let finMal;
  if(bi===0){mala[0]=`GUARDA ${a+10} EN ${v}`;finMal=meta+10;}
  else if(bi===1){mala[1]=`RESTA ${b} A ${v}`;finMal=a-b+c;}
  else{mala[2]=`GUARDA ${c} EN ${v}`;finMal=c;}
  const correcta=buena[bi];
  const optsSet=[correcta,`SUMA ${b} A ${v}`,`RESTA ${c} A ${v}`,`GUARDA ${a} EN ${v}`,`MUESTRA ${v}`];
  const opts=[];optsSet.forEach(o=>{if(opts.indexOf(o)<0)opts.push(o);});
  return{v,meta,buena,mala,finMal,linea:bi+1,correcta,opts:_shuffleF(opts.slice(0,4).indexOf(correcta)>=0?opts.slice(0,4):[correcta].concat(opts.slice(0,3)),_opRnd)};
}

function genEvalOp() {
  sfx('click');
  _injectFormaSel('genEvalOp', 'evalOpFormaSel', evalOpFormNum, function (v) { evalOpFormNum = v; });
  const _sO = document.getElementById('evalOpFormaSel');
  if (_sO && parseInt(_sO.value, 10)) evalOpFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sO.value, 10)));
  const cf = evalOpFormNum; window._currentEvalOpForm = cf; _opRnd = _evalRng(100000 + cf); /* la Forma cf siembra TODO el azar de esta prueba */
  evalOpFormNum = (evalOpFormNum % EVAL_FORMAS) + 1;
  _injectFormaSel('genEvalOp', 'evalOpFormaSel', evalOpFormNum, function (v) { evalOpFormNum = v; });
  saveProgress();
  document.getElementById('evalop-screen-title').textContent = `📦 Prueba Operativa — Forma ${cf} · Variables: las Cajitas de Memoria`;
  evalOpAnsVisible = false;
  const out = document.getElementById('evalOpOut'); out.innerHTML = '';

  const ejeItems = genEjecutaItems();
  const prdItems = genPrediceItems();
  const cplItems = genCompletaItems();
  const vidaItems = genVidaItems();
  const retoC = genRetoCruzada();
  const retoB = genRetoBug();

  const s1 = document.createElement('div');
  s1.innerHTML = `<div class="eval-section-title">I. Ejecuta y traza <span class="eval-pts">20 pts · 4 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel básico. Traza el valor de la cajita instrucción por instrucción y escribe el VALOR FINAL.</p>`;
  ejeItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="eval-q"><span class="eval-num">${i + 1}</span><span class="eval-q-text">¿Cuánto queda al final en la cajita <strong>${it.v}</strong>?</span></div><div class="op-prog">${it.prog.map((p, j) => (j + 1) + '. ' + instrTxt(p)).join('<br>')}</div><div class="opx-row" style="margin-left:1.7rem;"><span style="font-size:0.82rem;color:var(--gray);">Valor final de ${it.v}:</span><input class="eval-cp-input" type="text" data-eje="${i}" autocomplete="off" inputmode="numeric" style="min-width:70px;max-width:90px;"></div><div class="eval-answer">${it.ans} (traza: ${trazaVar(it.prog,it.v,0).join(' → ')})</div><div class="eval-item-feedback" id="evalFbEje${i}" aria-live="polite"></div>`;
    s1.appendChild(d);
  });
  out.appendChild(s1);

  const s2 = document.createElement('div');
  s2.innerHTML = `<div class="eval-section-title">II. Predice <span class="eval-pts">10 pts · 2 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Agilidad. Responde con una palabra o un número, sin trazar tablas.</p>`;
  prdItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="eval-q"><span class="eval-num">${i + 1}</span><span class="eval-q-text">${it.txt}</span></div><div class="opx-row" style="margin-left:1.7rem;"><span style="font-size:0.82rem;color:var(--gray);">R/</span><input class="eval-cp-input" type="text" data-prd="${i}" autocomplete="off" style="min-width:110px;max-width:160px;"></div><div class="eval-answer">${it.ans}</div><div class="eval-item-feedback" id="evalFbPrd${i}" aria-live="polite"></div>`;
    s2.appendChild(d);
  });
  out.appendChild(s2);

  const s3 = document.createElement('div');
  s3.innerHTML = `<div class="eval-section-title">III. Completa el programa <span class="eval-pts">20 pts · 4 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel intermedio. Piensa al revés: al programa le falta UNA instrucción (el espacio ___). Elige cuál es.</p>`;
  cplItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    const optsHtml = it.opts.map((op, oi) => `<label class="eval-mc-opt"><input type="radio" name="opC${i}" value="${oi}"> ${'abcd'[oi]}) ${op}</label>`).join('');
    d.innerHTML = `<div class="eval-q"><span class="eval-num">${i + 1}</span><span class="eval-q-text">${it.txt}</span></div><div class="op-prog">Programa: ${_cmpProgTxt(it)}</div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${'abcd'[it.ans]}) ${it.opts[it.ans]}</div><div class="eval-item-feedback" id="evalFbCpl${i}" aria-live="polite"></div>`;
    s3.appendChild(d);
  });
  out.appendChild(s3);

  const s4 = document.createElement('div');
  s4.innerHTML = `<div class="eval-section-title">IV. Problemas de la vida real <span class="eval-pts">30 pts · 10 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel avanzado. Escribe el PROGRAMA con GUARDA / SUMA / RESTA / MUESTRA (una instrucción por línea). Compara con la pauta y anota tu puntaje de 0 a 10.</p>`;
  vidaItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="eval-q"><span class="eval-num">${i + 1}</span><span class="eval-q-text"><strong>${it.tema}:</strong> ${it.enun}</span></div><textarea class="op-vida-ta" aria-label="Programa para ${it.tema}" placeholder="1. GUARDA … EN …&#10;2. SUMA … A …&#10;3. …"></textarea><div class="op-pauta-rub"><strong>Pasos clave:</strong> ${it.pasos.join(' · ')}<br><strong>Rúbrica (10 pts):</strong> ${OP_VIDA_RUBRICA}</div><div class="op-vida-score"><label for="opVida${i}">Compara con la pauta y anota tu puntaje:</label><input type="number" id="opVida${i}" data-vida="${i}" min="0" max="10" value="0"> <span>de 10 pts</span></div><div class="eval-item-feedback" id="evalFbVida${i}" aria-live="polite"></div>`;
    s4.appendChild(d);
  });
  out.appendChild(s4);

  const s5 = document.createElement('div');
  s5.innerHTML = '<div class="eval-section-title">V. Olimpiada de cajitas <span class="eval-pts">20 pts · 10 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Desafío. Dos variables a la vez y un bug escondido.</p>';
  const dC = document.createElement('div'); dC.className = 'eval-item eval-auto-item';
  dC.innerHTML = `<div class="eval-q"><span class="eval-num">1</span><span class="eval-q-text">🧮 <strong>Traza cruzada:</strong> este programa usa DOS cajitas (<strong>${retoC.v1}</strong> y <strong>${retoC.v2}</strong>). Trázalas por separado y escribe el valor final de cada una. (5 pts c/u)</span></div><div class="op-prog">${retoC.prog.map((p, j) => (j + 1) + '. ' + instrTxt(p)).join('<br>')}</div><div class="opx-row" style="margin-left:1.7rem;"><span style="font-size:0.82rem;color:var(--gray);">${retoC.v1} =</span><input class="eval-cp-input" type="text" data-rc="0" autocomplete="off" inputmode="numeric" style="min-width:60px;max-width:80px;"><span style="font-size:0.82rem;color:var(--gray);">${retoC.v2} =</span><input class="eval-cp-input" type="text" data-rc="1" autocomplete="off" inputmode="numeric" style="min-width:60px;max-width:80px;"></div><div class="eval-answer">${retoC.v1} = ${retoC.ans1} · ${retoC.v2} = ${retoC.ans2}</div><div class="eval-item-feedback" id="evalFbRc" aria-live="polite"></div>`;
  s5.appendChild(dC);
  const dB = document.createElement('div'); dB.className = 'eval-item eval-auto-item';
  const selHtml = `<select class="eval-match-select" data-bi="0" aria-label="Instrucción correcta"><option value="">—</option>${retoB.opts.map(op => `<option value="${op}">${op}</option>`).join('')}</select>`;
  dB.innerHTML = `<div class="eval-q"><span class="eval-num">2</span><span class="eval-q-text">🐛 <strong>Detective del bug:</strong> la cajita <strong>${retoB.v}</strong> debía terminar en <strong>${retoB.meta}</strong>, pero este programa la deja en <strong>${retoB.finMal}</strong>. UNA instrucción está errada.</span></div><div class="op-prog">${retoB.mala.map((p, j) => 'Línea ' + (j + 1) + ': ' + p).join('<br>')}</div><div class="opx-row" style="margin-left:1.7rem;"><span style="font-size:0.82rem;color:var(--gray);">Línea errada (5 pts):</span><input class="eval-cp-input" type="text" data-bl="0" autocomplete="off" inputmode="numeric" style="min-width:56px;max-width:70px;"><span style="font-size:0.82rem;color:var(--gray);">Debe decir (5 pts):</span>${selHtml}</div><div class="eval-answer">Línea ${retoB.linea} → ${retoB.correcta}</div><div class="eval-item-feedback" id="evalFbBug" aria-live="polite"></div>`;
  s5.appendChild(dB);
  out.appendChild(s5);

  window._evalOpData = { ejeItems, prdItems, cplItems, vidaItems, retoC, retoB };
  const autoPanel = document.createElement('div'); autoPanel.id = 'evalOpAutoResult'; autoPanel.className = 'eval-auto-result';
  autoPanel.innerHTML = '<strong>🧮 Prueba interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato para resolver en papel.';
  out.appendChild(autoPanel);
  fin('s-evaluacion');
}

function toggleEvalOpAns() {
  evalOpAnsVisible = !evalOpAnsVisible;
  document.querySelectorAll('#evalOpOut .eval-answer').forEach(el => el.style.display = evalOpAnsVisible ? 'block' : 'none');
  document.querySelectorAll('#evalOpOut .op-pauta-rub').forEach(el => el.style.display = evalOpAnsVisible ? 'block' : 'none');
  sfx('click');
}
function _isOpNumOk(student, expected) {
  const s = (student || '').toString().trim().replace(',', '.');
  if (!s) return false;
  const sn = parseFloat(s), en = parseFloat(expected);
  return !isNaN(sn) && !isNaN(en) && Math.abs(sn - en) < 1e-6;
}

function gradeEvalOp() {
  if (!window._evalOpData) { showToast('⚠️ Genera una prueba operativa primero'); return; }
  sfx('click');
  const d = window._evalOpData;
  let total = 0; const det = { eje: 0, prd: 0, cpl: 0, vida: 0, reto: 0 };
  // El maestro recibe SOLO lo que califica la máquina (70 pts). Los otros 30 son
  // producción abierta que el alumno se puntúa contra la pauta: ese número enseña a
  // compararse, pero como nota sería inventado, así que no entra en el resultado.
  const OP_UMBRAL = 49, OP_AUTO = 70, OP_MANUAL = 30; let autoev = 0;
  d.ejeItems.forEach((it, i) => { const el = document.querySelector(`[data-eje="${i}"]`); const ok = _isOpNumOk(el ? el.value : '', it.ans); if (el) { el.classList.toggle('eval-input-ok', ok); el.classList.toggle('eval-input-no', !ok); } if (ok) { det.eje += 4; total += 4; } setEvalFeedback('evalFbEje' + i, ok, ok ? 'Correcto. +4 pts' : 'Revisar. La cajita termina en ' + it.ans); });
  d.prdItems.forEach((it, i) => { const el = document.querySelector(`[data-prd="${i}"]`); const ok = _isPredOk(el ? el.value : '', it.ans) || _isOpNumOk(el ? el.value : '', it.ans); if (el) { el.classList.toggle('eval-input-ok', ok); el.classList.toggle('eval-input-no', !ok); } if (ok) { det.prd += 2; total += 2; } setEvalFeedback('evalFbPrd' + i, ok, ok ? 'Correcto. +2 pts' : 'Revisar. R/ ' + it.ans); });
  d.cplItems.forEach((it, i) => { const sel = document.querySelector(`input[name="opC${i}"]:checked`); const ok = !!sel && Number(sel.value) === it.ans; if (ok) { det.cpl += 4; total += 4; } setEvalFeedback('evalFbCpl' + i, ok, ok ? 'Correcto. +4 pts' : 'Revisar. Faltaba: ' + it.opts[it.ans]); });
  d.vidaItems.forEach((it, i) => { const inp = document.querySelector(`[data-vida="${i}"]`); let v = inp ? (parseInt(inp.value) || 0) : 0; v = Math.max(0, Math.min(10, v)); if (inp) inp.value = v; det.vida += v; autoev += v; setEvalFeedback('evalFbVida' + i, v >= 7, 'Puntaje autoevaluado: ' + v + '/10 (compara siempre con la pauta)'); });
  { const el1 = document.querySelector('[data-rc="0"]'); const ok1 = _isOpNumOk(el1 ? el1.value : '', d.retoC.ans1); if (el1) { el1.classList.toggle('eval-input-ok', ok1); el1.classList.toggle('eval-input-no', !ok1); } const el2 = document.querySelector('[data-rc="1"]'); const ok2 = _isOpNumOk(el2 ? el2.value : '', d.retoC.ans2); if (el2) { el2.classList.toggle('eval-input-ok', ok2); el2.classList.toggle('eval-input-no', !ok2); } if (ok1) { det.reto += 5; total += 5; } if (ok2) { det.reto += 5; total += 5; } setEvalFeedback('evalFbRc', ok1 && ok2, (ok1 && ok2) ? '¡Traza cruzada perfecta! +10 pts' : 'Revisar. ' + d.retoC.v1 + ' = ' + d.retoC.ans1 + ' · ' + d.retoC.v2 + ' = ' + d.retoC.ans2); }
  { const elL = document.querySelector('[data-bl="0"]'); const okL = _isOpNumOk(elL ? elL.value : '', d.retoB.linea); if (elL) { elL.classList.toggle('eval-input-ok', okL); elL.classList.toggle('eval-input-no', !okL); } const elI = document.querySelector('[data-bi="0"]'); const okI = !!elI && elI.value === d.retoB.correcta; if (elI) { elI.classList.toggle('eval-input-ok', okI); elI.classList.toggle('eval-input-no', !okI); } if (okL) { det.reto += 5; total += 5; } if (okI) { det.reto += 5; total += 5; } setEvalFeedback('evalFbBug', okL && okI, (okL && okI) ? '¡Bug atrapado y corregido! +10 pts' : 'Revisar. Línea ' + d.retoB.linea + ' → ' + d.retoB.correcta); }
  const res = document.getElementById('evalOpAutoResult');
  const desglose = `Ejecuta: ${det.eje}/20 · Predice: ${det.prd}/10 · Completa: ${det.cpl}/20 · Olimpiada: ${det.reto}/20`;
  if (res) { res.className = 'eval-auto-result ' + (total >= OP_UMBRAL ? 'eval-auto-pass' : 'eval-auto-risk'); res.innerHTML = `<strong>Resultado automático: ${total}/${OP_AUTO} puntos</strong><br><span>${desglose}</span><br><em>Falta calificar: IV. Vida real (${OP_MANUAL} pts). Eso lo escribiste tú y lo revisa tu maestro con la pauta; tu autoevaluación fue ${autoev}/${OP_MANUAL} y no cuenta para esta nota.</em>`; }
  if (total >= OP_UMBRAL) { pts(8); showToast('🎯 Prueba operativa calificada: ' + total + '/' + OP_AUTO); }
  else showToast('🧮 Prueba operativa: ' + total + '/' + OP_AUTO + '. Revisa los ítems marcados.');
}

// Tabla de traza impresa: filas con la instrucción y celda en blanco para el valor;
// el «Antes de empezar» y las celdas sin dato llevan «•» (normativa de impresión).
function _tzTablaHTML(it){
  let rows=`<tr><td class="tz-i">Antes de empezar</td><td class="tz-v">•</td></tr>`;
  it.prog.forEach((p,j)=>{rows+=`<tr><td class="tz-i">${j+1}. ${instrTxt(p)}</td><td class="tz-v">&nbsp;</td></tr>`;});
  rows+=`<tr><td class="tz-i tz-fin">VALOR FINAL de ${it.v}</td><td class="tz-v tz-fin">&nbsp;</td></tr>`;
  return `<table class="tz-tbl"><tr><th>Instrucción</th><th>Valor de ${it.v}</th></tr>${rows}</table>`;
}
function _tzCruzadaHTML(r){
  let rows=`<tr><td class="tz-i">Antes de empezar</td><td class="tz-v">•</td><td class="tz-v">•</td></tr>`;
  r.prog.forEach((p,j)=>{
    const c1=p.v===r.v1?'&nbsp;':'•';
    const c2=p.v===r.v2?'&nbsp;':'•';
    rows+=`<tr><td class="tz-i">${j+1}. ${instrTxt(p)}</td><td class="tz-v">${c1}</td><td class="tz-v">${c2}</td></tr>`;
  });
  rows+=`<tr><td class="tz-i tz-fin">VALOR FINAL</td><td class="tz-v tz-fin">&nbsp;</td><td class="tz-v tz-fin">&nbsp;</td></tr>`;
  return `<table class="tz-tbl"><tr><th>Instrucción</th><th>${r.v1}</th><th>${r.v2}</th></tr>${rows}</table>`;
}

function printEvalOp() {
  if (!window._evalOpData) { showToast('⚠️ Genera una prueba operativa primero'); return; }
  sfx('click');
  const forma = window._currentEvalOpForm || 1; const d = window._evalOpData;

  // ── I. Ejecuta y traza (tablas de traza deterministas; espacios sin dato con «•»)
  let s1 = `<div class="sec-title"><span>I. Ejecuta y traza</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Nivel básico. Llena la tabla de traza: escribe el valor de la cajita después de cada instrucción y el VALOR FINAL. 4 pts c/u (vale el valor final).</p><div class="ej-grid">`;
  d.ejeItems.forEach((it, i) => {
    s1 += `<div class="ej-box"><div class="ej-head">${i + 1}. Cajita: ${it.v}</div>${_tzTablaHTML(it)}</div>`;
  });
  s1 += '</div>';

  // ── II. Predice
  let s2 = `<div class="sec-title"><span>II. Predice</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10 pts</span></div></div><p class="opx-instr">Agilidad. Responde con una palabra o un número. 2 pts c/u.</p>`;
  d.prdItems.forEach((it, i) => { s2 += `<div class="opx-print-row" style="align-items:flex-start;"><span class="qn">${i + 1}.</span><span style="flex:1;line-height:1.35;">${it.txt} &nbsp; R/ <span class="opx-mini-blank">&nbsp;</span></span></div>`; });

  // ── III. Completa el programa
  let s3 = `<div class="sec-title"><span>III. Completa el programa</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Nivel intermedio. Al programa le falta UNA instrucción (el espacio ___). Encierra la letra correcta o escríbela en la línea. 4 pts c/u.</p>`;
  d.cplItems.forEach((it, i) => { const ops = it.opts.map((op, oi) => 'abcd'[oi] + ') ' + op).join(' · '); s3 += `<div class="opx-print-row" style="align-items:flex-start;"><span class="qn">${i + 1}.</span><span style="flex:1;line-height:1.35;">${it.txt}<br><span class="mono">Programa: ${_cmpProgTxt(it)}</span><br><span style="font-size:8.5pt;">${ops}</span> &nbsp; Letra: <span class="opx-mini-blank" style="min-width:34px;">&nbsp;</span></span></div>`; });

  // ── IV. Problemas de la vida real
  let s4 = `<div class="sec-title"><span>IV. Problemas de la vida real</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 30 pts</span></div></div><p class="opx-instr">Nivel avanzado. Escribe el PROGRAMA completo (GUARDA / SUMA / RESTA / MUESTRA, una instrucción por línea). 10 pts c/u.</p>`;
  d.vidaItems.forEach((it, i) => { s4 += `<div class="opx-print-row" style="align-items:flex-start;"><span class="qn">${i + 1}.</span><span style="flex:1;line-height:1.4;"><strong>${it.tema}:</strong> ${it.enun}<br><span class="ln-vida"></span><span class="ln-vida"></span><span class="ln-vida"></span></span></div>`; });

  // ── V. Olimpiada de cajitas
  let s5 = `<div class="sec-title"><span>V. Olimpiada de cajitas</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Desafío. Reto 1: 10 pts (5 por cajita) · Reto 2: 10 pts (5 la línea + 5 la corrección).</p><div class="ord-print-grid"><div class="ord-print-box"><div class="ord-print-dir">1. 🧮 Traza cruzada (dos cajitas) · 10 pts:</div><div style="font-size:9pt;line-height:1.35;">Llena la tabla: en cada fila escribe el valor SOLO de la cajita que cambió (las celdas con • no cambian) y al final el valor de cada una.</div>${_tzCruzadaHTML(d.retoC)}</div><div class="ord-print-box"><div class="ord-print-dir">2. 🐛 Detective del bug · 10 pts:</div><div style="font-size:9pt;line-height:1.35;">La cajita <strong>${d.retoB.v}</strong> debía terminar en <strong>${d.retoB.meta}</strong>, pero el programa la deja en <strong>${d.retoB.finMal}</strong>. UNA instrucción está errada:<br><span class="mono">${d.retoB.mala.map((p, j) => 'Línea ' + (j + 1) + ': ' + p).join('<br>')}</span></div><div style="margin-top:0.3rem;font-size:9pt;">Línea errada: <span class="opx-mini-blank" style="min-width:34px;">&nbsp;</span> · Debe decir: <span class="opx-mini-blank" style="min-width:110px;">&nbsp;</span></div></div></div>`;

  // ── Pauta del docente
  let pR = '';
  pR += `<div class="p-sec"><div class="p-ttl">I. Ejecuta y traza</div><table class="p-tbl">${d.ejeItems.map((it, i) => `<tr><td class="pn">${i + 1}.</td><td class="pa">${it.v} = ${it.ans} (traza: ${trazaVar(it.prog,it.v,0).join(' → ')})</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">II. Predice</div><table class="p-tbl">${d.prdItems.map((it, i) => `<tr><td class="pn">${i + 1}.</td><td class="pa">${it.ans}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">III. Completa el programa</div><table class="p-tbl">${d.cplItems.map((it, i) => `<tr><td class="pn">${i + 1}.</td><td class="pa">${'abcd'[it.ans]}) ${it.opts[it.ans]}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">IV. Vida real (rúbrica 10 pts c/u)</div>${d.vidaItems.map((it, i) => `<div class="p-ord-line"><strong>${i + 1}. ${it.tema}:</strong> ${it.pasos.join(' → ')}</div>`).join('')}<div class="p-rub">Rúbrica: ${OP_VIDA_RUBRICA}. Acepte nombres de cajita distintos si el programa es coherente.</div></div>`;
  pR += `<div class="p-sec" style="grid-column:1/-1;"><div class="p-ttl">V. Olimpiada de cajitas</div><div class="p-ord-line"><strong>1.</strong> ${d.retoC.v1} = ${d.retoC.ans1} (traza: ${trazaVar(d.retoC.prog,d.retoC.v1,0).join(' → ')}) · ${d.retoC.v2} = ${d.retoC.ans2} (traza: ${trazaVar(d.retoC.prog,d.retoC.v2,0).join(' → ')})</div><div class="p-ord-line"><strong>2.</strong> Línea ${d.retoB.linea} → debe decir ${d.retoB.correcta}</div></div>`;

  const doc = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Prueba Operativa Variables: las Cajitas de Memoria · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11.5pt;color:#111;background:#fff;padding:4mm 6mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.5rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;color:#0e7490;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:#0e7490;margin-top:0.15rem;font-weight:700;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.5rem 0 0.22rem;border-left:4px solid #0e7490;background:#ecfeff;display:flex;justify-content:space-between;align-items:center;color:#0e7490;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:#0e7490;font-weight:700;font-style:italic;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #0e7490;height:12px;}.qn{font-weight:700;min-width:20px;display:inline-block;color:#0e7490;}.opx-instr{font-size:9pt;color:#555;margin-bottom:0.25rem;}.opx-print-row{display:flex;align-items:baseline;gap:0.4rem;font-size:10.5pt;padding:0.22rem 0.2rem;border-bottom:1px dotted #ddd;}.opx-mini-blank{display:inline-block;min-width:60px;border-bottom:1.5px solid #111;}.mono{font-family:'Courier New',monospace;font-weight:700;font-size:9.5pt;}.ej-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0.35rem 0.5rem;margin-top:0.2rem;}.ej-box{border:1px solid #bbb;border-radius:4px;padding:0.25rem 0.35rem;break-inside:avoid;page-break-inside:avoid;}.ej-head{font-size:8.5pt;font-weight:700;color:#0e7490;margin-bottom:0.15rem;}.tz-tbl{width:100%;border-collapse:collapse;font-size:8.5pt;margin-top:0.1rem;}.tz-tbl th{background:#ecfeff;color:#0e7490;border:1px solid #a5f3fc;padding:2px 4px;text-align:left;font-size:8pt;}.tz-tbl td{border:1px solid #ccc;padding:2px 4px;}.tz-i{font-family:'Courier New',monospace;font-weight:700;font-size:8pt;}.tz-v{width:34%;text-align:center;color:#0e7490;font-weight:700;}.tz-fin{background:#ecfeff;font-weight:700;}.ln-vida{display:block;border-bottom:1px solid #111;min-height:14px;margin-top:8px;}.ord-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.8rem;margin-top:0.2rem;}.ord-print-box{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.4rem;break-inside:avoid;}.ord-print-dir{font-size:9pt;font-weight:700;color:#0e7490;margin-bottom:0.2rem;}.total-row{display:flex;align-items:baseline;justify-content:flex-end;gap:7px;font-size:11pt;color:#0e7490;font-weight:700;font-style:italic;margin-top:0.5rem;padding:0.2rem 0.5rem;background:#ecfeff;border-radius:4px;}.total-row .obt-line{min-width:80px;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #0e7490;padding-bottom:0.35rem;margin-bottom:0.5rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;color:#0e7490;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #a5f3fc;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;color:#0e7490;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#0e7490;}.pa{color:#007a00;font-weight:600;}.p-ord-line{font-size:10.5pt;margin-bottom:0.2rem;color:#007a00;}.p-rub{font-size:9.5pt;color:#555;margin-top:0.2rem;border-top:1px dotted #ddd;padding-top:0.2rem;}.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Examen de Programación — Prueba Operativa · Variables: las Cajitas de Memoria · Educación Básica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 pts · I: 20 · II: 10 · III: 20 · IV: 30 · V: 20 · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✔ PAUTA — Prueba Operativa · Variables: las Cajitas de Memoria · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">100 pts · I: 5×4 · II: 5×2 · III: 5×4 · IV: 3×10 · V: 10+10 · Programación · Educación Básica</div></div><div class="p-grid">${pR}</div></div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("evalPage",250,0.55,1.2);fit("pautaPage",250,0.55,1.2);})();<\/script></body></html>`;
  const win = window.open('', '_blank', '');
  if (!win) { showToast('⚠️ Activa las ventanas emergentes para imprimir'); return; }
  win.document.write(doc); win.document.close(); setTimeout(() => win.print(), 400);
}

// ===================== LAB: LA MÁQUINA DE CAJITAS =====================
// 4 escenarios (parteData): el alumno ejecuta el mini-programa instrucción por
// instrucción con ▶ y VE la cajita abrirse y cambiar; preguntas intercaladas dan XP.
const parteData={
  n1:{nombre:'Escenario 1 · El marcador del partido ⚽',emoji:'⚽',
      vars:[{k:'goles',emoji:'⚽'},{k:'faltas',emoji:'🟨'}],
      intro:'¡Empieza el partido de la Selección! Lleva el marcador en las cajitas.',
      pasos:[
        {t:'i',instr:I('GUARDA',0,'goles'),nota:'El partido empieza sin goles.'},
        {t:'i',instr:I('GUARDA',0,'faltas'),nota:'Tampoco hay faltas todavía.'},
        {t:'i',instr:I('SUMA',1,'goles'),nota:'¡GOOOL de la Selección! 🎉'},
        {t:'q',q:'¿Cuánto quedó en la cajita goles?',ans:'1',opts:['0','1','2','3']},
        {t:'i',instr:I('SUMA',1,'faltas'),nota:'Falta del otro equipo.'},
        {t:'i',instr:I('SUMA',1,'goles'),nota:'¡Otro GOL! ⚽'},
        {t:'q',q:'¿Cuánto hay ahora en goles?',ans:'2',opts:['1','2','3','0']},
        {t:'i',instr:I('MUESTRA',null,'goles'),nota:'El tablero muestra los goles… sin cambiarlos.'},
        {t:'q',q:'MUESTRA acaba de leer la cajita goles. ¿Cambió su valor?',ans:'No',opts:['Sí','No']},
      ],xpn:6},
  n2:{nombre:'Escenario 2 · La alcancía 🐷',emoji:'🐷',
      vars:[{k:'dinero',emoji:'🪙'}],
      intro:'Tu alcancía guarda lempiras: a veces entran… y a veces salen.',
      pasos:[
        {t:'i',instr:I('GUARDA',10,'dinero'),nota:'Ya tenías L 10 guardados.'},
        {t:'i',instr:I('SUMA',5,'dinero'),nota:'Tu abuela te regala L 5. 🥰'},
        {t:'q',q:'¿Cuánto dinero hay en la cajita?',ans:'15',opts:['5','10','15','50']},
        {t:'i',instr:I('RESTA',3,'dinero'),nota:'Compras un churro de L 3. 😋'},
        {t:'q',q:'¿Cuánto quedó en dinero?',ans:'12',opts:['12','15','18','3']},
        {t:'i',instr:I('SUMA',10,'dinero'),nota:'Hiciste un mandado y ganaste L 10.'},
        {t:'q',q:'¿Y ahora cuánto hay?',ans:'22',opts:['20','22','12','32']},
      ],xpn:6},
  n3:{nombre:'Escenario 3 · La venta de la pulpería 🏪',emoji:'🏪',
      vars:[{k:'venta',emoji:'🧾'}],
      intro:'La pulpería suma cada venta del día en una sola cajita: ¡un acumulador!',
      pasos:[
        {t:'i',instr:I('GUARDA',0,'venta'),nota:'El día empieza sin ventas.'},
        {t:'i',instr:I('SUMA',12,'venta'),nota:'Doña Rosa compra L 12 de frijoles.'},
        {t:'i',instr:I('SUMA',8,'venta'),nota:'Un niño compra L 8 de churros.'},
        {t:'q',q:'¿Cuánto lleva la venta del día?',ans:'20',opts:['12','8','20','28']},
        {t:'i',instr:I('SUMA',5,'venta'),nota:'Don Pedro compra L 5 de tortillas.'},
        {t:'q',q:'¿Cuál es la venta total?',ans:'25',opts:['20','25','30','5']},
        {t:'i',instr:I('MUESTRA',null,'venta'),nota:'Al cerrar, la pulpería LEE el total del día.'},
        {t:'q',q:'La cajita venta sumó cantidades distintas (12, 8, 5). ¿Qué es?',ans:'Acumulador',opts:['Contador','Acumulador']},
      ],xpn:6},
  n4:{nombre:'Escenario 4 · La cosecha de café ☕',emoji:'☕',
      vars:[{k:'latas',emoji:'☕'},{k:'pago',emoji:'💵'}],
      intro:'En el cafetal se cuentan las latas cosechadas… ¡y ojo con GUARDA!',
      pasos:[
        {t:'i',instr:I('GUARDA',0,'latas'),nota:'Empieza la mañana sin latas.'},
        {t:'i',instr:I('SUMA',1,'latas'),nota:'Primera lata llena. ☕'},
        {t:'i',instr:I('SUMA',1,'latas'),nota:'¡Segunda lata!'},
        {t:'q',q:'¿Cuántas latas van?',ans:'2',opts:['1','2','3','0']},
        {t:'i',instr:I('SUMA',1,'latas'),nota:'Tercera lata antes del almuerzo.'},
        {t:'i',instr:I('GUARDA',5,'latas'),nota:'El caporal recontó: eran 5 latas. GUARDA corrige la cuenta.'},
        {t:'q',q:'GUARDA 5 borró lo anterior. ¿Cuánto hay ahora en latas?',ans:'5',opts:['3','5','8','15']},
        {t:'i',instr:I('GUARDA',50,'pago'),nota:'Se apunta el pago del día: L 50.'},
        {t:'q',q:'¿Qué cajita cambió con la última instrucción?',ans:'pago',opts:['latas','pago']},
      ],xpn:6},
};
let labNivel='n1',labIdx=0,labVals={},labEsperandoPreg=false,labUltima='',labTerminado=false;
function labShowParte(parteKey){labNivel=parteKey;const nv=parteData[parteKey];labIdx=0;labVals={};labEsperandoPreg=false;labUltima='';labTerminado=false;document.querySelectorAll('.lab-cont-btn').forEach(b=>b.classList.remove('active-pri'));const btn=document.querySelector(`[data-parte="${parteKey}"]`);if(btn)btn.classList.add('active-pri');const fbEl=document.getElementById('fbLab');if(fbEl)fbEl.classList.remove('show');const q=document.getElementById('labQ');if(q)q.innerHTML='';updateLabDisplay(null,nv.intro+' Toca ▶ para ejecutar la primera instrucción.');if(typeof sfx==='function')sfx('click');}
function updateLabDisplay(actKey,msj){
  const nv=parteData[labNivel];
  const sent=document.getElementById('lab-sentence');
  if(sent)sent.innerHTML=`${nv.emoji} <strong>${nv.nombre}</strong><br><span style="font-size:0.88rem;">${msj||''}</span>`;
  const disp=document.getElementById('lab-display');
  if(!disp)return;
  disp.innerHTML=`<div id="labSvgWrap">${svgCajitasHTML(nv.vars,labVals,actKey,Math.min(300,nv.vars.length*130+40))}</div>`;
  renderLabProg();
}
function renderLabProg(){
  const list=document.getElementById('progList');
  if(!list)return;
  const nv=parteData[labNivel];
  const instrs=nv.pasos.map((p,i)=>({p,i})).filter(x=>x.p.t==='i');
  let num=0;
  list.innerHTML=instrs.map(x=>{
    num++;
    const estado=x.i<labIdx?' sim-chip-run':'';
    return `<span class="sim-chip${estado}"><span class="sim-chip-n">${num}</span>${instrTxt(x.p.instr)}</span>`;
  }).join('');
}
function labStep(){
  const nv=parteData[labNivel];
  if(labTerminado){showToast('🎉 Escenario completado. Elige otro o reinícialo.');return;}
  if(labEsperandoPreg){showToast('🤔 Primero responde la pregunta de abajo.');sfx('no');return;}
  const p=nv.pasos[labIdx];
  if(!p){_labCompletar();return;}
  if(p.t==='q'){
    labEsperandoPreg=true;
    const q=document.getElementById('labQ');
    if(q){
      q.innerHTML=`<div class="lab-preg-txt">🤔 ${p.q}</div>`+p.opts.map(o=>`<button class="cmp-opt" onclick="labAnswer(this,'${o.replace(/'/g,"\\'")}')">${o}</button>`).join('');
    }
    updateLabDisplay(null,'Pregunta: responde para seguir ejecutando.');
    sfx('flip');
    return;
  }
  const res=ejecutarPaso(labVals,p.instr);
  labVals=res.vals;
  labIdx++;
  const leido=res.out!==null?` 👀 La cajita ${p.instr.v} muestra: <strong>${res.out}</strong>.`:'';
  updateLabDisplay(p.instr.v,`<span class="mono-instr">${instrTxt(p.instr)}</span> — ${p.nota||''}${leido}`);
  sfx('click');
  if(labIdx>=nv.pasos.length)_labCompletar();
}
function labAnswer(btn,opt){
  const nv=parteData[labNivel];
  const p=nv.pasos[labIdx];
  if(!p||p.t!=='q')return;
  if(opt===p.ans){
    btn.classList.add('correct');
    document.querySelectorAll('#labQ .cmp-opt').forEach(b=>{b.disabled=true;});
    const key=labNivel+'_q'+labIdx;
    let extra='';
    if(!xpTracker.lab.has(key)){xpTracker.lab.add(key);pts(2);extra=' +2 XP';}
    fb('fbLab','¡Correcto!'+extra+' Sigue con ▶.',true);
    sfx('ok');
    labEsperandoPreg=false;labIdx++;
    setTimeout(()=>{const q=document.getElementById('labQ');if(q)q.innerHTML='';if(labIdx>=nv.pasos.length)_labCompletar();},700);
  }else{
    btn.classList.add('wrong');
    fb('fbLab','Todavía no: mira bien el valor de la cajita en la estantería y vuelve a intentar.',false);
    sfx('no');
    setTimeout(()=>btn.classList.remove('wrong'),700);
  }
}
function _labCompletar(){
  if(labTerminado)return;
  labTerminado=true;
  const nv=parteData[labNivel];
  updateLabDisplay(null,'🎉 ¡Programa completado! Así viven las variables dentro de un programa.');
  let extra='';
  if(!xpTracker.lab.has(labNivel)){
    xpTracker.lab.add(labNivel);pts(nv.xpn);extra=' +'+nv.xpn+' XP';
    const btn=document.querySelector(`[data-parte="${labNivel}"]`);if(btn)btn.classList.add('lab-done');
  }
  fb('fbLab',`🏁 ¡Escenario completado!${extra} Prueba los demás escenarios de la Máquina de Cajitas.`,true);
  sfx('fan');launchConfetti();
  const esc=Object.keys(parteData).filter(k=>xpTracker.lab.has(k));
  if(esc.length===Object.keys(parteData).length){fin('s-lab');unlockAchievement('lab_master');}
}
function labResetEsc(){sfx('click');labShowParte(labNivel);}

// ===================== DIPLOMA =====================
function _diplPct(){return xp>=MXP?100:Math.round((xp/MXP)*100);}
function openDiploma(){sfx('fan');const pct=_diplPct();document.getElementById('diplPct').textContent=pct+'%';document.getElementById('diplBar').style.width=pct+'%';document.getElementById('diplDate').textContent='Fecha: '+new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});const msgs=['¡Sigue aprendiendo!','¡Muy buen trabajo!','¡Vas muy bien!','¡Dominas las variables y sus cajitas!','¡Maestro de la Memoria!'];document.getElementById('diplMsg').textContent=msgs[Math.min(Math.floor(pct/25),4)];const stars=['⭐','⭐⭐','⭐⭐⭐'];document.getElementById('diplStars').textContent=stars[Math.min(Math.floor(pct/40),2)];const achTxt=unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(' · ');document.getElementById('diplAch').textContent=achTxt||'Sigue completando secciones para desbloquear logros';document.getElementById('diplomaOverlay').classList.add('open');launchConfetti();}
function closeDiploma(){document.getElementById('diplomaOverlay').classList.remove('open');}
function updateDiplomaName(v){document.getElementById('diplName').textContent=v||'Estudiante';}
function shareWA(){const name=document.getElementById('diplName').textContent||'Estudiante';const pct=_diplPct();const msg=`📦 ¡${name} completó la Misión "Variables: las Cajitas de Memoria"! 🏅 Progreso: ${pct}% · 💻 policastsapien.com`;_waShare(msg);}
async function captureDiploma(){if(typeof html2canvas==='undefined'){showToast('⚠️ Cargando... intenta de nuevo');return;}sfx('click');const card=document.querySelector('.diploma-card');const btn=document.querySelector('.diploma-actions .btn-pri');const toHide=[card.querySelector('.diploma-input'),card.querySelector('.diploma-actions'),card.querySelector('hr')];if(btn){btn.disabled=true;btn.textContent='⏳ Capturando...';}toHide.forEach(el=>{if(el)el.style.display='none';});let dataUrl='';try{const canvas=await html2canvas(card,{scale:2,useCORS:true,backgroundColor:'#ffffff'});toHide.forEach(el=>{if(el)el.style.display='';});dataUrl=canvas.toDataURL('image/png');const name=(document.getElementById('diplName').textContent||'Estudiante').replace(/\s+/g,'-');const fileName='constancia-'+name+'.png';const cap=window.Capacitor;if(cap&&cap.isNativePlatform&&cap.isNativePlatform()&&cap.Plugins?.Filesystem&&cap.Plugins?.Share){const base64Data=dataUrl.split(',')[1];const result=await cap.Plugins.Filesystem.writeFile({path:fileName,data:base64Data,directory:'CACHE'});await cap.Plugins.Share.share({url:result.uri,dialogTitle:'Guardar / Compartir Constancia'});}else{const a=document.createElement('a');a.href=dataUrl;a.download=fileName;a.click();}}catch(e){toHide.forEach(el=>{if(el)el.style.display='';});if(e.name!=='AbortError')showToast('⚠️ No se pudo guardar la constancia');}finally{if(btn){btn.disabled=false;btn.textContent='📷 Guardar foto';}}}

// ===================== INIT =====================
window.addEventListener('DOMContentLoaded',()=>{
  initTheme();
  loadProgress();
  upFC();
  buildMemo();
  buildQz();
  showQz();
  buildClass();
  showId();
  showCmp();
  updateRetoButtons();
  showNeuron();
  showNeuro();
  showEnfer();
  labShowParte('n1');
  renderAchPanel();
});

// Formas deterministas v1: selectores de forma visibles desde la carga de la página
(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalOp==='function') _injectFormaSel('genEvalOp','evalOpFormaSel',evalOpFormNum,function(v){evalOpFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();
