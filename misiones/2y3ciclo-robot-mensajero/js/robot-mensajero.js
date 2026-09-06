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
const SAVE_KEY='robot_mensajero_v1';
let xp=0,MXP=200,done=new Set(),evalAnsVisible=false;
let evalFormNum=1,unlockedAch=[],darkMode=false,prevLevel=0;
let evalOpFormNum=1,evalOpAnsVisible=false;
const TOTAL_SECTIONS=13;
const xpTracker={fc:new Set(),qz:new Set(),cls:new Set(),id:new Set(),cmp:new Set(),reto:new Set(),sopa:new Set(),wgt:new Set(),memo:new Set(),lab:new Set()};

// ===================== NÚCLEO DEL ROBOT (simulación compartida) =====================
const DIRS=['N','E','S','O'];
const DIR_DELTA={N:[-1,0],E:[0,1],S:[1,0],O:[0,-1]};
const DIR_NOMBRE={N:'Norte',E:'Este',S:'Sur',O:'Oeste'};
const DIR_FLECHA={N:'▲',E:'▶',S:'▼',O:'◀'};
const I_AV='AVANZA',I_GD='GIRA DERECHA',I_GI='GIRA IZQUIERDA',I_EN='ENTREGA';
function turnR(d){return DIRS[(DIRS.indexOf(d)+1)%4];}
function turnL(d){return DIRS[(DIRS.indexOf(d)+3)%4];}
function coordName(r,c){return 'ABCDE'[c]+(r+1);}
// Ejecuta UNA instrucción. map={n, obst:['r,c',...]} · devuelve el nuevo estado + evento
function simStep(st,instr,map){
  const s={r:st.r,c:st.c,dir:st.dir,entregado:st.entregado||false,evento:null};
  if(instr===I_GD){s.dir=turnR(s.dir);return s;}
  if(instr===I_GI){s.dir=turnL(s.dir);return s;}
  if(instr===I_EN){s.evento='entrega';return s;}
  if(instr===I_AV){
    const d=DIR_DELTA[s.dir];const nr=s.r+d[0],nc=s.c+d[1];
    if(nr<0||nr>=map.n||nc<0||nc>=map.n){s.evento='borde';return s;}
    if(map.obst&&map.obst.indexOf(nr+','+nc)>=0){s.evento='obstaculo';return s;}
    s.r=nr;s.c=nc;return s;
  }
  return s;
}
// Ejecuta un programa completo sin animación (para tareas y evaluaciones)
function simRun(start,prog,map){
  let st={r:start.r,c:start.c,dir:start.dir,entregado:false};
  for(let i=0;i<prog.length;i++){
    const nx=simStep(st,prog[i],map);
    if(nx.evento==='borde'||nx.evento==='obstaculo')return{ok:false,crashAt:i,st};
    if(nx.evento==='entrega'){nx.entregado=true;}
    st=nx;
  }
  return{ok:true,st};
}
// Planificador: programa mínimo para ir de (sr,sc) a (dr,dc) partiendo con dir0 (sin obstáculos)
function _rotInstr(a,b){const diff=((DIRS.indexOf(b)-DIRS.indexOf(a))%4+4)%4;if(diff===0)return[];if(diff===1)return[I_GD];if(diff===3)return[I_GI];return[I_GD,I_GD];}
function planRuta(sr,sc,dr,dc,dir0){
  const dv=dr<sr?'N':'S',dh=dc<sc?'O':'E';
  const nv=Math.abs(dr-sr),nh=Math.abs(dc-sc);
  const arma=(primero)=>{
    let prog=[],dir=dir0;
    const tramos=primero==='v'?[[dv,nv],[dh,nh]]:[[dh,nh],[dv,nv]];
    tramos.forEach(([d,n])=>{if(n===0)return;prog=prog.concat(_rotInstr(dir,d));dir=d;for(let i=0;i<n;i++)prog.push(I_AV);});
    prog.push(I_EN);
    return prog;
  };
  const p1=arma('v'),p2=arma('h');
  return p1.length<=p2.length?p1:p2;
}
// SVG de cuadrícula (pantalla e impresión). o={n,robot:{r,c,dir},dest:[r,c],obst:[[r,c]],deco:{'r,c':emoji},w,dots}
function svgGridHTML(o){
  const n=o.n,cs=44,m=26,W=m+n*cs+6,H=m+n*cs+6;
  const px=(c)=>m+c*cs,py=(r)=>m+r*cs;
  let s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"${o.w?` width="${o.w}"`:''} role="img" aria-label="Cuadrícula del robot">`;
  s+=`<rect x="${m}" y="${m}" width="${n*cs}" height="${n*cs}" fill="#ecfeff" stroke="#0e7490" stroke-width="2" rx="4"/>`;
  for(let i=1;i<n;i++){s+=`<line x1="${m+i*cs}" y1="${m}" x2="${m+i*cs}" y2="${m+n*cs}" stroke="#0e7490" stroke-width="0.8" opacity="0.5"/>`;s+=`<line x1="${m}" y1="${m+i*cs}" x2="${m+n*cs}" y2="${m+i*cs}" stroke="#0e7490" stroke-width="0.8" opacity="0.5"/>`;}
  for(let c=0;c<n;c++)s+=`<text x="${px(c)+cs/2}" y="${m-8}" text-anchor="middle" font-size="13" font-weight="bold" fill="#0e7490" font-family="Arial">${'ABCDE'[c]}</text>`;
  for(let r=0;r<n;r++)s+=`<text x="${m-10}" y="${py(r)+cs/2+5}" text-anchor="middle" font-size="13" font-weight="bold" fill="#0e7490" font-family="Arial">${r+1}</text>`;
  const ocupada={};
  (o.obst||[]).forEach(([r,c])=>{ocupada[r+','+c]=1;s+=`<text x="${px(c)+cs/2}" y="${py(r)+cs/2+8}" text-anchor="middle" font-size="24">🌳</text>`;});
  if(o.deco)Object.keys(o.deco).forEach(k=>{const[r,c]=k.split(',').map(Number);ocupada[k]=1;s+=`<text x="${px(c)+cs/2}" y="${py(r)+cs/2+8}" text-anchor="middle" font-size="24">${o.deco[k]}</text>`;});
  if(o.dest){ocupada[o.dest[0]+','+o.dest[1]]=1;s+=`<text x="${px(o.dest[1])+cs/2}" y="${py(o.dest[0])+cs/2+8}" text-anchor="middle" font-size="26">${o.destEmoji||'🏠'}</text>`;}
  if(o.robot){
    const rb=o.robot;ocupada[rb.r+','+rb.c]=1;
    s+=`<text x="${px(rb.c)+cs/2}" y="${py(rb.r)+cs/2+7}" text-anchor="middle" font-size="24">${o.robotEmoji||'🤖'}</text>`;
    const ang={N:0,E:90,S:180,O:270}[rb.dir];
    s+=`<g transform="translate(${px(rb.c)+cs/2},${py(rb.r)+cs/2}) rotate(${ang})"><polygon points="0,-${cs/2-3} -6,-${cs/2-11} 6,-${cs/2-11}" fill="#b45309"/></g>`;
  }
  if(o.dots!==false){for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(!ocupada[r+','+c])s+=`<text x="${px(c)+cs/2}" y="${py(r)+cs/2+4}" text-anchor="middle" font-size="10" fill="#0e7490" opacity="0.55">•</text>`;}
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
  primer_quiz:{icon:'🤖',label:'Primer quiz del robot superado'},
  flash_master:{icon:'🃏',label:'Todas las flashcards del código exploradas'},
  clasif_pro:{icon:'🗂️',label:'Clasificador de instrucciones experto'},
  id_master:{icon:'🔍',label:'Identificador de conceptos maestro'},
  reto_hero:{icon:'🏆',label:'Héroe del reto contra reloj'},
  lab_master:{icon:'💻',label:'¡Las 4 entregas del robot completadas!'},
  nivel3:{icon:'⌨️',label:'¡Piloto del Robot! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡Ingeniero de Secuencias! Nivel 6'},
  widgets_master:{icon:'🧩',label:'Widgets del pensamiento computacional dominados'}
};
function unlockAchievement(id){if(unlockedAch.includes(id))return;unlockedAch.push(id);sfx('ach');showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label);launchConfetti();renderAchPanel();saveProgress();}
function renderAchPanel(){const list=document.getElementById('achList');list.innerHTML='';Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{const div=document.createElement('div');div.className='ach-item'+(unlockedAch.includes(id)?'':' locked');div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`;list.appendChild(div);});}
function toggleAchPanel(){sfx('click');document.getElementById('achPanel').classList.toggle('open');}
function showToast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}t.textContent=msg;t.style.display='block';clearTimeout(t._tid);t._tid=setTimeout(()=>t.style.display='none',3200);}
function launchConfetti(){const colors=['#0e7490','#22d3ee','#b45309','#f59e0b','#06b6d4'];for(let i=0;i<60;i++){const c=document.createElement('div');c.className='confetti-piece';c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`;document.body.appendChild(c);c.addEventListener('animationend',()=>c.remove());}}

// ===================== XP =====================
const lvls=[{t:0,n:'Aprendiz 🌱'},{t:25,n:'Explorador de Código 🧭'},{t:55,n:'Piloto del Robot 🤖'},{t:90,n:'Programador Junior 💻'},{t:130,n:'Depurador 🔍'},{t:165,n:'Ingeniero de Secuencias 🏅'},{t:190,n:'Maestro del Código 🏆'}];
function pts(n){xp=Math.max(0,Math.min(MXP,xp+n));updateXPBar();saveProgress();}
function updateXPBar(){const pct=Math.round((xp/MXP)*100);document.getElementById('xpFill').style.width=pct+'%';const el=document.getElementById('xpPts');el.textContent='⭐ '+xp;el.style.transform='scale(1.3)';setTimeout(()=>el.style.transform='',300);let lv=0;for(let i=0;i<lvls.length;i++)if(xp>=lvls[i].t)lv=i;document.getElementById('xpLvl').textContent=lvls[lv].n;if(lv!==prevLevel){if(lv>=2)unlockAchievement('nivel3');if(lv>=5)unlockAchievement('nivel5');prevLevel=lv;}}
function resetXP(){sfx('click');xp=0;updateXPBar();showToast('🔄 XP reiniciado a 0');}
function fin(id,showFX=true){if(!done.has(id)){done.add(id);const b=document.querySelector(`[data-s="${id}"]`);if(b)b.classList.add('done');if(showFX){sfx('up');launchConfetti();}saveProgress();}}
function getProgress(){return Math.round((done.size/TOTAL_SECTIONS)*100);}

// ===================== NAV =====================
function go(id){sfx('click');document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});document.getElementById(id).classList.add('active');const btn=document.querySelector(`[data-s="${id}"]`);if(btn){btn.classList.add('active');btn.setAttribute('aria-selected','true');}window.scrollTo({top:0,behavior:'smooth'});if(id==='s-sopa'){setTimeout(buildSopa,50);}if(id==='s-widgets'){setTimeout(buildRoute,50);}}

// ===================== MINI-QUIZ (tarjetas Aprende / Instrucciones) =====================
function miniQuiz(btn,ok,fbId){const wrap=btn.parentElement;wrap.querySelectorAll('.mq-opt').forEach(b=>b.classList.remove('correct','wrong'));btn.classList.add(ok?'correct':'wrong');const f=document.getElementById(fbId);if(f){f.textContent=ok?'¡Correcto! Así piensa un programador. 🎉':'Todavía no. Vuelve a leer la tarjeta y prueba otra vez.';f.className='mq-fb '+(ok?'ok':'err');}sfx(ok?'ok':'no');if(ok&&!xpTracker.wgt.has('mq_'+fbId)){xpTracker.wgt.add('mq_'+fbId);pts(2);}}

// ===================== FLASHCARD DATA =====================
const fcData=[
  {w:'Instrucción',a:'🗣️ Una orden <strong>clara y exacta</strong> que el robot puede ejecutar, como <strong>AVANZA</strong>.'},
  {w:'Secuencia',a:'📜 Una <strong>lista de instrucciones en orden</strong>: se ejecutan una por una, de arriba hacia abajo.'},
  {w:'Algoritmo',a:'🫓 Los <strong>pasos ordenados</strong> para lograr una tarea, como la <strong>receta de la baleada</strong>.'},
  {w:'Programa',a:'💾 Una secuencia <strong>escrita</strong> que la máquina ejecuta <strong>tal como está</strong>, paso a paso.'},
  {w:'AVANZA',a:'👣 Mueve al robot <strong>una casilla</strong> hacia donde <strong>mira</strong>.'},
  {w:'GIRA DERECHA',a:'↪️ Gira al robot 90° <strong>según su propia derecha</strong>; cambia su orientación, no su casilla.'},
  {w:'GIRA IZQUIERDA',a:'↩️ Gira al robot 90° hacia <strong>su izquierda</strong>; sigue en la misma casilla.'},
  {w:'ENTREGA',a:'📬 El robot <strong>deja el mensaje</strong> en la casilla donde está. ¡Solo sirve en la casa correcta!'},
  {w:'Estado del robot',a:'🤖 Su <strong>posición</strong> en la cuadrícula (como B3) más su <strong>orientación</strong>.'},
  {w:'Orientación',a:'🧭 Hacia dónde mira el robot: <strong>Norte, Este, Sur u Oeste</strong>.'},
  {w:'Bug',a:'🐛 Un <strong>error escondido</strong> en el programa que hace que el robot no llegue a la meta.'},
  {w:'Depurar',a:'🔍 <strong>Encontrar y corregir</strong> los errores de un programa, línea por línea.'},
  {w:'Trazar',a:'👆 Seguir el programa <strong>con el dedo</strong> sobre el mapa para <strong>predecir</strong> dónde termina.'},
  {w:'Instrucción ambigua',a:'🌫️ Una orden <strong>confusa</strong>, como «camina un poquito»: el robot <strong>no</strong> puede ejecutarla.'},
];
let fcIdx=0;
function upFC(){document.getElementById('fcInner').classList.remove('flipped');document.getElementById('fcW').textContent=fcData[fcIdx].w;document.getElementById('fcA').innerHTML=fcData[fcIdx].a;document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length;}
function flipCard(){sfx('flip');document.getElementById('fcInner').classList.toggle('flipped');if(!xpTracker.fc.has(fcIdx)){xpTracker.fc.add(fcIdx);pts(1);}if(xpTracker.fc.size===fcData.length){fin('s-flash');unlockAchievement('flash_master');}}
function nextFC(){sfx('click');fcIdx=(fcIdx+1)%fcData.length;upFC();}
function prevFC(){sfx('click');fcIdx=(fcIdx-1+fcData.length)%fcData.length;upFC();}

// ===================== JUEGO: MEMORIA DEL CÓDIGO =====================
const memoPairs=[
  {id:'secuencia',t:'Secuencia',d:'📜 Lista de instrucciones en orden'},
  {id:'algoritmo',t:'Algoritmo',d:'🫓 La receta de la baleada: pasos ordenados'},
  {id:'instruccion',t:'Instrucción',d:'🗣️ AVANZA: una orden clara y exacta'},
  {id:'bug',t:'Bug',d:'🐛 El error escondido del programa'},
  {id:'orientacion',t:'Orientación',d:'🧭 Norte, Este, Sur u Oeste'},
  {id:'programa',t:'Programa',d:'💾 Secuencia escrita que el robot ejecuta'}
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
  {q:'¿Qué es una secuencia en programación?',o:['a) Un dibujo del robot','b) Una lista de instrucciones en orden','c) Una casilla del mapa','d) Un número de la suerte'],c:1},
  {q:'¿Qué hace la instrucción AVANZA?',o:['a) Gira al robot 90°','b) Deja el mensaje','c) Mueve al robot una casilla hacia donde mira','d) Apaga al robot'],c:2},
  {q:'¿Qué cambia la instrucción GIRA DERECHA?',o:['a) La posición del robot','b) La orientación del robot','c) El tamaño del mapa','d) El color del robot'],c:1},
  {q:'El robot mira al Norte y ejecuta GIRA DERECHA. ¿Hacia dónde mira ahora?',o:['a) Sur','b) Oeste','c) Norte','d) Este'],c:3},
  {q:'¿Cuál de estas es una instrucción EXACTA?',o:['a) «Camina un poquito»','b) «Ve por allá»','c) «AVANZA»','d) «Haz algo útil»'],c:2},
  {q:'¿Qué es un algoritmo?',o:['a) Pasos ordenados para lograr una tarea','b) Un tipo de robot','c) Un error del programa','d) Una casilla con árbol'],c:0},
  {q:'¿Qué es un bug?',o:['a) Un premio del programa','b) Un error escondido en el programa','c) Una instrucción de giro','d) El nombre del robot'],c:1},
  {q:'¿Por qué importa el ORDEN de las instrucciones?',o:['a) No importa, el robot adivina','b) Porque cambiar el orden cambia el resultado','c) Solo importa en los giros','d) Porque el robot lee de abajo hacia arriba'],c:1},
  {q:'El robot está sobre la casa del destino. ¿Qué instrucción debe ejecutar para dejar el mensaje?',o:['a) AVANZA','b) GIRA DERECHA','c) GIRA IZQUIERDA','d) ENTREGA'],c:3},
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
  {label:['Instrucción exacta','Instrucción ambigua'],headA:'✅ Instrucción exacta',headB:'🌫️ Instrucción ambigua',colA:'ex',colB:'am',
   words:[{w:'AVANZA',t:'ex'},{w:'«Camina un poquito»',t:'am'},{w:'GIRA DERECHA',t:'ex'},{w:'«Ve por allá»',t:'am'},{w:'Avanza 3 casillas',t:'ex'},{w:'«Muévete rapidito»',t:'am'},{w:'ENTREGA',t:'ex'},{w:'«Haz algo útil»',t:'am'},{w:'Gira 90° a la izquierda',t:'ex'},{w:'«Busca la casa bonita»',t:'am'}]},
  {label:['Cambia la posición','Cambia la orientación'],headA:'👣 Cambia la posición',headB:'🧭 Cambia la orientación',colA:'pos',colB:'ori',
   words:[{w:'AVANZA',t:'pos'},{w:'GIRA DERECHA',t:'ori'},{w:'Avanza 2 casillas',t:'pos'},{w:'GIRA IZQUIERDA',t:'ori'},{w:'Retrocede una casilla',t:'pos'},{w:'Media vuelta (2 giros)',t:'ori'},{w:'Sube una casilla al Norte',t:'pos'},{w:'Voltear hacia el Oeste',t:'ori'}]},
  {label:['Secuencia correcta','Secuencia con error'],headA:'✅ Secuencia correcta',headB:'🐛 Secuencia con error',colA:'ok',colB:'err',
   words:[{w:'Lavar → picar → cocinar',t:'ok'},{w:'Comer → servir → cocinar',t:'err'},{w:'Sembrar → regar → cosechar',t:'ok'},{w:'Cosechar → sembrar → regar',t:'err'},{w:'Abrir el cuaderno → escribir → cerrar',t:'ok'},{w:'Cerrar el cuaderno → escribir → abrir',t:'err'},{w:'Ponerse calcetines → ponerse zapatos',t:'ok'},{w:'Ponerse zapatos → ponerse calcetines',t:'err'}]},
  {label:['Término de programación','De otra materia'],headA:'💻 De programación',headB:'📚 De otra materia',colA:'prog',colB:'otro',
   words:[{w:'Secuencia',t:'prog'},{w:'Fotosíntesis',t:'otro'},{w:'Algoritmo',t:'prog'},{w:'Sustantivo',t:'otro'},{w:'Instrucción',t:'prog'},{w:'Península',t:'otro'},{w:'Bug',t:'prog'},{w:'Fracción',t:'otro'},{w:'Depurar',t:'prog'},{w:'Estela maya',t:'otro'}]},
];
let currentClassGroupIdx=0,clsSelectedWord=null;
function buildClass(){const group=classGroups[currentClassGroupIdx];document.getElementById('col-left-head').textContent=group.headA;document.getElementById('col-right-head').textContent=group.headB;const bank=document.getElementById('clsBank');bank.innerHTML='';clsSelectedWord=null;document.getElementById('items-left').innerHTML='';document.getElementById('items-right').innerHTML='';_shuffle([...group.words]).forEach(w=>{const el=document.createElement('div');el.className='wb-item';el.textContent=w.w;el.dataset.t=w.t;el.onclick=()=>{document.querySelectorAll('.wb-item').forEach(i=>i.classList.remove('sel-word'));el.classList.add('sel-word');clsSelectedWord=el;sfx('click');};bank.appendChild(el);});['col-left','col-right'].forEach(colId=>{const col=document.getElementById(colId);col.onclick=(e)=>{if(!clsSelectedWord||e.target.classList.contains('drop-item'))return;const targetId=colId==='col-left'?'items-left':'items-right';const wordsCol=document.getElementById(targetId);const item=document.createElement('div');item.className='drop-item';item.textContent=clsSelectedWord.textContent;item.dataset.t=clsSelectedWord.dataset.t;const original=clsSelectedWord;item.onclick=(ev)=>{ev.stopPropagation();if(clsSelectedWord!==null){col.click();}else{document.getElementById('clsBank').appendChild(original);original.classList.remove('sel-word');item.remove();if(typeof sfx==='function')sfx('click');}};wordsCol.appendChild(item);clsSelectedWord.remove();clsSelectedWord=null;sfx('click');};});}
function checkClass(){const remaining=document.querySelectorAll('#clsBank .wb-item').length;if(remaining>0){fb('fbCls','Mueve todas las palabras a las columnas primero.',false);return;}const group=classGroups[currentClassGroupIdx];let allOk=true;document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{const inLeft=el.parentElement.id==='items-left';const expectedType=inLeft?group.colA:group.colB;if(el.dataset.t===expectedType){el.classList.add('cls-ok');}else{el.classList.add('cls-no');allOk=false;}});if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);}if(allOk){fb('fbCls','¡Perfecto! +5 XP',true);sfx('fan');fin('s-clasifica');unlockAchievement('clasif_pro');}else{fb('fbCls','Hay errores. Marcados en rojo.',false);sfx('no');}}
function nextClassGroup(){sfx('click');currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length;buildClass();document.getElementById('fbCls').classList.remove('show');showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]);}
function resetClass(){sfx('click');buildClass();document.getElementById('fbCls').classList.remove('show');}

// ===================== IDENTIFICAR =====================
const idData=[
  {s:['Una','secuencia','es','una','lista','de','instrucciones','en','orden.'],c:1,art:'La palabra que nombra una lista de instrucciones en orden'},
  {s:['La','instrucción','AVANZA','mueve','al','robot','una','casilla.'],c:2,art:'La instrucción que mueve al robot hacia adelante'},
  {s:['GIRA','DERECHA','cambia','la','orientación','del','robot.'],c:4,art:'Lo que cambia un giro (no la posición)'},
  {s:['Un','algoritmo','es','como','una','receta','de','cocina.'],c:1,art:'Los pasos ordenados para lograr una tarea'},
  {s:['Un','bug','es','un','error','escondido','del','programa.'],c:1,art:'El nombre del error escondido de un programa'},
  {s:['Depurar','es','encontrar','y','corregir','los','errores.'],c:0,art:'La acción de encontrar y corregir errores'},
  {s:['El','robot','deja','el','mensaje','con','la','instrucción','ENTREGA.'],c:8,art:'La instrucción que deja el mensaje en la casa'},
  {s:['La','orientación','del','robot','puede','ser','Norte,','Este,','Sur','u','Oeste.'],c:1,art:'Hacia dónde mira el robot'},
];
let idIdx=0,idDone=false;
function showId(){idDone=false;if(idIdx>=idData.length){document.getElementById('idSent').innerHTML='🎉 ¡Completado!';fin('s-identifica');unlockAchievement('id_master');return;}const d=idData[idIdx];document.getElementById('idProg').textContent=`Oración ${idIdx+1} de ${idData.length}`;document.getElementById('idInfo').textContent=`Busca: ${d.art}`;const sent=document.getElementById('idSent');sent.innerHTML='';d.s.forEach((w,i)=>{const span=document.createElement('span');span.className='id-word';span.textContent=w+' ';span.onclick=()=>checkId(i,span);sent.appendChild(span);});}
function checkId(i,span){if(idDone)return;document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected'));span.classList.add('selected');if(i===idData[idIdx].c){idDone=true;span.classList.add('id-ok');fb('fbId','¡Correcto! +5 XP',true);if(!xpTracker.id.has(idIdx)){xpTracker.id.add(idIdx);pts(5);}sfx('ok');}else{span.classList.add('id-no');fb('fbId','Ese no es el término solicitado.',false);sfx('no');}}
function nextId(){sfx('click');idIdx++;showId();document.getElementById('fbId').classList.remove('show');}
function resetId(){sfx('click');idIdx=0;showId();document.getElementById('fbId').classList.remove('show');}

// ===================== COMPLETA =====================
const cmpData=[
  {s:'Una lista de instrucciones en orden se llama ___.',opts:['secuencia','bug','casilla'],c:0},
  {s:'La instrucción que mueve al robot una casilla hacia adelante es ___.',opts:['GIRA DERECHA','AVANZA','ENTREGA'],c:1},
  {s:'GIRA IZQUIERDA cambia la ___ del robot.',opts:['posición','velocidad','orientación'],c:2},
  {s:'Los pasos ordenados de una tarea, como una receta, forman un ___.',opts:['algoritmo','mapa','dibujo'],c:0},
  {s:'Si el robot mira al Norte y gira a la derecha, queda mirando al ___.',opts:['Oeste','Este','Sur'],c:1},
  {s:'Un error escondido en el programa se llama ___.',opts:['bug','premio','giro'],c:0},
  {s:'Encontrar y corregir errores se llama ___.',opts:['entregar','depurar','avanzar'],c:1},
  {s:'El estado del robot es su posición más su ___.',opts:['orientación','batería','tamaño'],c:0},
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
// Widget 1: Ordena el algoritmo
const routeSets=[
  {label:'El algoritmo de la baleada (en orden)',steps:['Poner la harina y el agua en un recipiente','Amasar y hacer las bolitas','Extender la tortilla y cocerla en el comal','Untar los frijoles y el queso','Doblar la baleada y servirla']},
  {label:'Izar la bandera el lunes cívico (en orden)',steps:['Formar filas en el patio','Amarrar la bandera a la cuerda','Izarla despacio mientras suena el himno','Hacer el saludo en silencio','Regresar ordenados al aula']},
  {label:'Sembrar frijoles en la huerta (en orden)',steps:['Preparar y aflojar la tierra','Abrir los agujeros en línea','Colocar las semillas y taparlas','Regar con cuidado','Esperar y quitar la maleza cada semana']},
];
let currentRouteIdx=0,routeItems=[];
function buildRoute(){routeItems=_shuffle([...routeSets[currentRouteIdx].steps]);renderRoute();const fbEl=document.getElementById('fbRoute');if(fbEl)fbEl.classList.remove('show');}
function renderRoute(){const list=document.getElementById('routeList');if(!list)return;list.innerHTML='';routeItems.forEach((step,i)=>{const div=document.createElement('div');div.className='sort-item';div.innerHTML=`<div class="sort-arrows"><button class="sort-arrow" onclick="routeMove(${i},-1)"${i===0?' disabled':''}>▲</button><button class="sort-arrow" onclick="routeMove(${i},1)"${i===routeItems.length-1?' disabled':''}>▼</button></div><div class="sort-step-num">${i+1}.</div><div class="sort-item-txt">${step}</div>`;list.appendChild(div);});}
function routeMove(idx,dir){sfx('click');const ni=idx+dir;if(ni<0||ni>=routeItems.length)return;[routeItems[idx],routeItems[ni]]=[routeItems[ni],routeItems[idx]];renderRoute();}
function checkRoute(){const correct=routeSets[currentRouteIdx].steps;const isOk=routeItems.every((s,i)=>s===correct[i]);if(isOk){fb('fbRoute','¡Perfecto! Orden correcto. +4 XP',true);if(!xpTracker.wgt.has('route_'+currentRouteIdx)){xpTracker.wgt.add('route_'+currentRouteIdx);pts(4);}sfx('fan');fin('s-widgets');unlockAchievement('widgets_master');}else{fb('fbRoute','Hay pasos fuera de orden. Revisa el arreglo.',false);sfx('no');}}
function nextRoute(){sfx('click');currentRouteIdx=(currentRouteIdx+1)%routeSets.length;buildRoute();showToast('🔄 Secuencia: '+routeSets[currentRouteIdx].label);}

// Widget 2: ¿Dónde termina? (mini-cuadrícula 3×3, IDs estándar «neuron»)
const _wgtEndDefs=[
  {r:2,c:0,dir:'N',prog:[I_AV,I_AV,I_GD,I_AV]},
  {r:2,c:1,dir:'N',prog:[I_AV,I_GD,I_AV]},
  {r:0,c:0,dir:'S',prog:[I_AV,I_GI,I_AV,I_AV]},
  {r:1,c:1,dir:'E',prog:[I_AV,I_GD,I_AV]},
  {r:2,c:2,dir:'O',prog:[I_AV,I_AV,I_GD,I_AV]},
  {r:0,c:2,dir:'S',prog:[I_AV,I_AV,I_GD,I_AV,I_AV]},
  {r:1,c:0,dir:'E',prog:[I_AV,I_GI,I_AV]},
  {r:2,c:0,dir:'E',prog:[I_AV,I_AV,I_GI,I_AV,I_AV]},
];
const neuronPartes=_wgtEndDefs.map(d=>{
  const res=simRun({r:d.r,c:d.c,dir:d.dir},d.prog,{n:3});
  const ans=coordName(res.st.r,res.st.c);
  const all=[];for(let r=0;r<3;r++)for(let c=0;c<3;c++)all.push(coordName(r,c));
  const opts=[ans,..._shuffle(all.filter(x=>x!==ans)).slice(0,3)];
  return{desc:`<div>El robot parte de <strong>${coordName(d.r,d.c)}</strong> mirando al <strong>${DIR_NOMBRE[d.dir]}</strong>.</div><div class="w-prog">${d.prog.map((p,i)=>(i+1)+'. '+p).join('<br>')}</div><div style="margin-top:0.4rem;">${svgGridHTML({n:3,robot:{r:d.r,c:d.c,dir:d.dir},w:150})}</div>`,ans,opts};
});
let neuronIdx=0,neuronDone=false;
function showNeuron(){neuronDone=false;if(neuronIdx>=neuronPartes.length){const el=document.getElementById('neuronDesc');if(el)el.innerHTML='🎉 ¡Predijiste todos los recorridos!';const opts=document.getElementById('neuronOpts');if(opts)opts.innerHTML='';fin('s-widgets');return;}const d=neuronPartes[neuronIdx];const prog=document.getElementById('neuronProg');if(prog)prog.textContent=`Recorrido ${neuronIdx+1} de ${neuronPartes.length}`;const desc=document.getElementById('neuronDesc');if(desc)desc.innerHTML=d.desc;const opts=document.getElementById('neuronOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=opt;b.onclick=()=>checkNeuron(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuron');if(fbEl)fbEl.classList.remove('show');}
function checkNeuron(opt,btn,d){if(neuronDone)return;neuronDone=true;document.querySelectorAll('#neuronOpts .cmp-opt').forEach(b=>{if(b.textContent===d.ans)b.classList.add('correct');else if(b===btn&&b.textContent!==d.ans)b.classList.add('wrong');});const isOk=opt===d.ans;if(isOk){fb('fbNeuron','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuron_'+neuronIdx)){xpTracker.wgt.add('neuron_'+neuronIdx);pts(3);}sfx('ok');}else{fb('fbNeuron','La respuesta correcta es: '+d.ans,false);sfx('no');}}
function nextNeuron(){sfx('click');neuronIdx++;showNeuron();}
function resetNeuron(){sfx('click');neuronIdx=0;showNeuron();}

// Widget 3: Detective del bug (IDs estándar «neuro»)
const _wgtBugDefs=[
  {r:2,c:0,dir:'N',dest:[0,1],bad:1},
  {r:2,c:2,dir:'N',dest:[0,0],bad:2},
  {r:0,c:0,dir:'S',dest:[2,2],bad:3},
  {r:1,c:0,dir:'E',dest:[2,2],bad:1},
  {r:2,c:1,dir:'N',dest:[0,2],bad:2},
];
const neuroPairs=_wgtBugDefs.map(d=>{
  const buena=planRuta(d.r,d.c,d.dest[0],d.dest[1],d.dir);
  let bi=Math.min(d.bad,buena.length-2);
  const mala=[...buena];
  for(let k=0;k<buena.length-1;k++){
    const idx=(bi+k)%(buena.length-1);
    const cand=[...buena];
    cand[idx]=cand[idx]===I_AV?I_GD:(cand[idx]===I_GD?I_GI:I_GD);
    const res=simRun({r:d.r,c:d.c,dir:d.dir},cand.slice(0,-1),{n:3});
    if(!res.ok||res.st.r!==d.dest[0]||res.st.c!==d.dest[1]){mala.splice(0,mala.length,...cand);bi=idx;break;}
  }
  return{
    trans:`<div>Meta: llegar a la casa 🏠 en <strong>${coordName(d.dest[0],d.dest[1])}</strong> y entregar. ¡Este programa tiene UN bug!</div><div style="display:flex;gap:0.8rem;align-items:center;justify-content:center;flex-wrap:wrap;"><div>${svgGridHTML({n:3,robot:{r:d.r,c:d.c,dir:d.dir},dest:d.dest,w:140})}</div><div class="w-prog" style="text-align:left;">${mala.map((p,i)=>'Línea '+(i+1)+': '+p).join('<br>')}</div></div>`,
    func:'Línea '+(bi+1)+' (debe decir '+buena[bi]+')',
    opts:mala.map((p,i)=>'Línea '+(i+1)+(i===bi?' (debe decir '+buena[bi]+')':' (está bien)'))
  };
});
let neuroIdx=0,neuroDone=false;
function showNeuro(){neuroDone=false;if(neuroIdx>=neuroPairs.length){const el=document.getElementById('neuroTrans');if(el)el.innerHTML='🎉 ¡Todos los bugs atrapados!';const opts=document.getElementById('neuroOpts');if(opts)opts.innerHTML='';return;}const d=neuroPairs[neuroIdx];const prog=document.getElementById('neuroProg');if(prog)prog.textContent=`${neuroIdx+1} de ${neuroPairs.length}`;const trans=document.getElementById('neuroTrans');if(trans)trans.innerHTML=d.trans;const opts=document.getElementById('neuroOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkNeuro(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuro');if(fbEl)fbEl.classList.remove('show');}
function checkNeuro(opt,btn,d){if(neuroDone)return;neuroDone=true;document.querySelectorAll('#neuroOpts .qz-opt').forEach(b=>{if(b.textContent===d.func)b.classList.add('correct');else if(b===btn&&b.textContent!==d.func)b.classList.add('wrong');});const isOk=opt===d.func;if(isOk){fb('fbNeuro','¡Bug atrapado! +3 XP',true);if(!xpTracker.wgt.has('neuro_'+neuroIdx)){xpTracker.wgt.add('neuro_'+neuroIdx);pts(3);}sfx('ok');}else{fb('fbNeuro','El bug estaba en: '+d.func,false);sfx('no');}setTimeout(()=>{neuroIdx++;showNeuro();},1800);}
function resetNeuro(){sfx('click');neuroIdx=0;showNeuro();}

// Widget 4: ¿Exacta o ambigua? (IDs estándar «enfer»)
const enfermedadData=[
  {disease:'«AVANZA»',characteristic:'Instrucción exacta',opts:['Instrucción exacta','Instrucción ambigua']},
  {disease:'«Camina un poquito»',characteristic:'Instrucción ambigua',opts:['Instrucción ambigua','Instrucción exacta']},
  {disease:'«Gira 90° a la derecha»',characteristic:'Instrucción exacta',opts:['Instrucción exacta','Instrucción ambigua']},
  {disease:'«Ve por allá y entrega esto»',characteristic:'Instrucción ambigua',opts:['Instrucción ambigua','Instrucción exacta']},
  {disease:'«Avanza 3 casillas al Norte»',characteristic:'Instrucción exacta',opts:['Instrucción exacta','Instrucción ambigua']},
  {disease:'«Busca la casa bonita»',characteristic:'Instrucción ambigua',opts:['Instrucción ambigua','Instrucción exacta']},
];
let enferIdx=0,enferDone=false;
function showEnfer(){enferDone=false;if(enferIdx>=enfermedadData.length){const el=document.getElementById('enferDisease');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('enferOpts');if(opts)opts.innerHTML='';return;}const d=enfermedadData[enferIdx];const prog=document.getElementById('enferProg');if(prog)prog.textContent=`${enferIdx+1} de ${enfermedadData.length}`;const dis=document.getElementById('enferDisease');if(dis)dis.textContent=d.disease;const opts=document.getElementById('enferOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkEnfer(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbEnfer');if(fbEl)fbEl.classList.remove('show');}
function checkEnfer(opt,btn,d){if(enferDone)return;enferDone=true;document.querySelectorAll('#enferOpts .qz-opt').forEach(b=>{if(b.textContent===d.characteristic)b.classList.add('correct');else if(b===btn&&b.textContent!==d.characteristic)b.classList.add('wrong');});const isOk=opt===d.characteristic;if(isOk){fb('fbEnfer','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('enfer_'+enferIdx)){xpTracker.wgt.add('enfer_'+enferIdx);pts(3);}sfx('ok');}else{fb('fbEnfer','Correcto: '+d.characteristic,false);sfx('no');}setTimeout(()=>{enferIdx++;showEnfer();},1800);}
function resetEnfer(){sfx('click');enferIdx=0;showEnfer();}

// ===================== RETO FINAL =====================
const retoPairs=[
  {label:['Instrucción exacta','Instrucción ambigua'],btnA:'✅ Exacta',btnB:'🌫️ Ambigua',colA:'ex',colB:'am',
   words:[{w:'AVANZA',t:'ex'},{w:'«Camina un poquito»',t:'am'},{w:'GIRA DERECHA',t:'ex'},{w:'«Ve por allá»',t:'am'},{w:'Avanza 3 casillas',t:'ex'},{w:'«Muévete rapidito»',t:'am'},{w:'ENTREGA',t:'ex'},{w:'«Haz algo útil»',t:'am'},{w:'Gira 90° a la izquierda',t:'ex'},{w:'«Busca la casa bonita»',t:'am'}]},
  {label:['De programación','De otra materia'],btnA:'💻 Programación',btnB:'📚 Otra materia',colA:'prog',colB:'otro',
   words:[{w:'Secuencia',t:'prog'},{w:'Fotosíntesis',t:'otro'},{w:'Algoritmo',t:'prog'},{w:'Sustantivo',t:'otro'},{w:'Bug',t:'prog'},{w:'Península',t:'otro'},{w:'Instrucción',t:'prog'},{w:'Fracción',t:'otro'},{w:'Depurar',t:'prog'},{w:'Estela maya',t:'otro'}]},
  {label:['Cambia la posición','Cambia la orientación'],btnA:'👣 Posición',btnB:'🧭 Orientación',colA:'pos',colB:'ori',
   words:[{w:'AVANZA',t:'pos'},{w:'GIRA DERECHA',t:'ori'},{w:'Avanza 2 casillas',t:'pos'},{w:'GIRA IZQUIERDA',t:'ori'},{w:'Retrocede un paso',t:'pos'},{w:'Media vuelta',t:'ori'},{w:'Sube al Norte una casilla',t:'pos'},{w:'Voltear al Oeste',t:'ori'}]},
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
function _rndCeldaLibre(n,evitar){let r,c;do{r=_rndInt(0,n-1);c=_rndInt(0,n-1);}while(evitar.some(([er,ec])=>er===r&&ec===c));return[r,c];}
// Genera un caso aleatorio de cuadrícula 4×4 sin obstáculos
function _rndCaso(){const n=4;const[sr,sc]=_rndCeldaLibre(n,[]);const[dr,dc]=_rndCeldaLibre(n,[[sr,sc]]);const dir=DIRS[_rndInt(0,3)];return{n,sr,sc,dr,dc,dir};}
// Programa aleatorio válido (camino sin salirse) de len instrucciones
function _rndProg(n,len){
  for(let intento=0;intento<80;intento++){
    const[sr,sc]=_rndCeldaLibre(n,[]);const dir=DIRS[_rndInt(0,3)];
    const prog=[];let st={r:sr,c:sc,dir};let okAll=true;
    for(let i=0;i<len;i++){
      const roll=Math.random();
      const instr=roll<0.55?I_AV:(roll<0.78?I_GD:I_GI);
      const nx=simStep(st,instr,{n});
      if(nx.evento){okAll=false;break;}
      prog.push(instr);st=nx;
    }
    if(okAll&&(st.r!==sr||st.c!==sc))return{sr,sc,dir,prog,fin:st};
  }
  return{sr:0,sc:0,dir:'S',prog:[I_AV,I_AV],fin:{r:2,c:0,dir:'S'}};
}
let ansVisible=false;
function genTask(){sfx('click');const type=document.getElementById('tgType').value;const count=parseInt(document.getElementById('tgCount').value);ansVisible=false;const out=document.getElementById('tgOut');out.innerHTML='';if(type==='programa')genProgramaTask(out,count);else if(type==='predice')genPrediceTask(out,count);else if(type==='bug')genBugTask(out,count);else if(type==='algoritmo')genAlgoritmoTask(out,count);fin('s-tareas');}
function _instrBlock(out,title,lines){const ib=document.createElement('div');ib.className='tg-instruction-block';ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join('');out.appendChild(ib);}
function genProgramaTask(out,count){_instrBlock(out,'Instrucción',['Copia la cuadrícula en tu cuaderno. Escribe el programa (AVANZA / GIRA DERECHA / GIRA IZQUIERDA / ENTREGA) para que el robot 🤖 llegue a la casa 🏠 y entregue el mensaje.','Puede haber varios programas correctos: gana el más corto.']);for(let i=0;i<count;i++){const k=_rndCaso();const prog=planRuta(k.sr,k.sc,k.dr,k.dc,k.dir);const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>El robot está en ${coordName(k.sr,k.sc)} mirando al ${DIR_NOMBRE[k.dir]}; la casa está en ${coordName(k.dr,k.dc)}.</strong><div style="margin-top:0.4rem;">${svgGridHTML({n:4,robot:{r:k.sr,c:k.sc,dir:k.dir},dest:[k.dr,k.dc],w:170})}</div><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ Programa más corto (${prog.length} instrucciones): ${prog.join(' → ')}</div></div>`;out.appendChild(div);}}
function genPrediceTask(out,count){_instrBlock(out,'Instrucción',['Copia cada caso en tu cuaderno, traza el recorrido con el dedo y escribe la casilla final y hacia dónde queda mirando el robot.']);for(let i=0;i<count;i++){const t=_rndProg(4,_rndInt(4,6));const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>El robot parte de ${coordName(t.sr,t.sc)} mirando al ${DIR_NOMBRE[t.dir]}.</strong><div class="tg-prog">${t.prog.map((p,j)=>(j+1)+'. '+p).join('<br>')}</div><div style="margin-top:0.4rem;font-size:0.85rem;">¿En qué casilla termina y hacia dónde mira? <span class="tg-blank">&nbsp;</span></div><div class="tg-answer">✅ Termina en ${coordName(t.fin.r,t.fin.c)} mirando al ${DIR_NOMBRE[t.fin.dir]}</div></div>`;out.appendChild(div);}}
function genBugTask(out,count){_instrBlock(out,'Instrucción',['Cada programa debería llevar al robot 🤖 hasta la casa 🏠, pero tiene UN bug (una instrucción equivocada). Escribe el número de la línea errada y la instrucción correcta.']);for(let i=0;i<count;i++){const k=_rndCaso();const buena=planRuta(k.sr,k.sc,k.dr,k.dc,k.dir);let bi=_rndInt(0,Math.max(0,buena.length-2));const mala=[...buena];for(let t=0;t<buena.length-1;t++){const idx=(bi+t)%(buena.length-1);const cand=[...buena];cand[idx]=cand[idx]===I_AV?I_GD:(cand[idx]===I_GD?I_GI:I_GD);const res=simRun({r:k.sr,c:k.sc,dir:k.dir},cand.slice(0,-1),{n:4});if(!res.ok||res.st.r!==k.dr||res.st.c!==k.dc){mala.splice(0,mala.length,...cand);bi=idx;break;}}const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>Robot en ${coordName(k.sr,k.sc)} mirando al ${DIR_NOMBRE[k.dir]} · casa en ${coordName(k.dr,k.dc)}.</strong><div class="tg-prog">${mala.map((p,j)=>'Línea '+(j+1)+': '+p).join('<br>')}</div><div style="margin-top:0.4rem;font-size:0.85rem;">Línea errada: <span class="tg-blank">&nbsp;</span> · Corrección: <span class="tg-blank">&nbsp;</span></div><div class="tg-answer">✅ Línea ${bi+1}: debe decir ${buena[bi]}</div></div>`;out.appendChild(div);}}
const algoritmoTaskDB=[
  {tarea:'Hacer una baleada',pasos:['Poner harina y agua en un recipiente','Amasar y hacer las bolitas','Cocer la tortilla en el comal','Untar frijoles y queso','Doblarla y servirla']},
  {tarea:'Lavarse las manos antes de la merienda',pasos:['Abrir el chorro','Mojarse las manos','Frotar con jabón','Enjuagar bien','Cerrar el chorro y secarse']},
  {tarea:'Izar la bandera el lunes cívico',pasos:['Formar filas en el patio','Amarrar la bandera a la cuerda','Izarla mientras suena el himno','Hacer el saludo','Volver al aula en orden']},
  {tarea:'Sembrar frijoles en la huerta escolar',pasos:['Aflojar la tierra','Abrir los agujeros','Colocar y tapar las semillas','Regar con cuidado','Quitar la maleza cada semana']},
  {tarea:'Prepararse para venir a la escuela',pasos:['Levantarse temprano','Bañarse y vestirse','Desayunar','Revisar la mochila','Salir de la casa a tiempo']},
  {tarea:'Hacer un fresco de nance',pasos:['Lavar los nances','Machacarlos con agua','Colar la mezcla','Agregar azúcar y hielo','Servir el fresco']},
];
function genAlgoritmoTask(out,count){_instrBlock(out,'Instrucción',['Copia los pasos desordenados en tu cuaderno y numéralos en el orden correcto (1º, 2º, 3º…), como si programaras a una persona-robot.']);const pool=_shuffle([...algoritmoTaskDB]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const desorden=_shuffle([...item.pasos]);const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.tarea}</strong><div class="tg-prog">${desorden.map(p=>'( &nbsp; ) '+p).join('<br>')}</div><div class="tg-answer">✅ Orden correcto: ${item.pasos.map((p,j)=>(j+1)+'º '+p).join(' · ')}</div></div>`;out.appendChild(div);}}
function toggleAns(){ansVisible=!ansVisible;document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none');sfx('click');}

// ===================== SOPA DE LETRAS =====================
const sopaSets=[
  {size:10,grid:[
    ['Z','H','D','T','J','A','O','C','T','O'],
    ['V','D','W','V','K','R','A','O','O','A'],
    ['B','V','M','N','H','I','Z','D','B','N'],
    ['T','C','Q','B','L','G','N','I','O','Q'],
    ['Z','L','M','J','B','T','A','G','R','K'],
    ['T','N','E','D','R','O','V','O','O','H'],
    ['O','J','V','E','D','Q','A','Q','S','D'],
    ['J','J','Y','W','Q','K','X','P','A','L'],
    ['I','N','A','W','H','K','D','C','P','T'],
    ['O','N','C','O','Q','W','Y','P','P','O']
  ],words:[
    {w:'ROBOT',cells:[[4,8],[3,8],[2,8],[1,8],[0,8]]},
    {w:'AVANZA',cells:[[6,6],[5,6],[4,6],[3,6],[2,6],[1,6]]},
    {w:'GIRA',cells:[[3,5],[2,5],[1,5],[0,5]]},
    {w:'ORDEN',cells:[[5,5],[5,4],[5,3],[5,2],[5,1]]},
    {w:'PASO',cells:[[8,8],[7,8],[6,8],[5,8]]},
    {w:'CODIGO',cells:[[0,7],[1,7],[2,7],[3,7],[4,7],[5,7]]}
  ]},
  {size:10,grid:[
    ['P','K','D','H','O','A','Y','D','X','M'],
    ['S','E','C','U','E','N','C','I','A','V'],
    ['I','J','P','R','O','G','R','A','M','A'],
    ['H','Q','W','O','K','K','O','H','T','J'],
    ['K','I','M','R','Q','O','M','V','N','N'],
    ['N','J','M','R','M','E','P','P','J','L'],
    ['B','D','A','E','T','A','K','I','L','G'],
    ['I','Q','P','A','B','L','V','R','O','P'],
    ['I','U','A','N','Z','B','U','C','L','E'],
    ['H','A','U','D','A','K','A','V','M','C']
  ],words:[
    {w:'SECUENCIA',cells:[[1,0],[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[1,7],[1,8]]},
    {w:'PROGRAMA',cells:[[2,2],[2,3],[2,4],[2,5],[2,6],[2,7],[2,8],[2,9]]},
    {w:'BUCLE',cells:[[8,5],[8,6],[8,7],[8,8],[8,9]]},
    {w:'ERROR',cells:[[6,3],[5,3],[4,3],[3,3],[2,3]]},
    {w:'MAPA',cells:[[5,2],[6,2],[7,2],[8,2]]},
    {w:'META',cells:[[4,6],[5,5],[6,4],[7,3]]}
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
  {q:'Una secuencia es una lista de instrucciones en orden.',a:true},
  {q:'El orden de las instrucciones de una secuencia no importa.',a:false},
  {q:'GIRA DERECHA mueve al robot una casilla hacia adelante.',a:false},
  {q:'AVANZA mueve al robot una casilla hacia donde mira.',a:true},
  {q:'GIRA DERECHA depende de hacia dónde MIRA el robot, no de la derecha del lector.',a:true},
  {q:'Un algoritmo es como una receta: pasos en orden para lograr una tarea.',a:true},
  {q:'Un bug es un premio que gana el programa.',a:false},
  {q:'«Camina un poquito» es una instrucción exacta.',a:false},
  {q:'El estado del robot es su posición más su orientación.',a:true},
  {q:'Si el robot mira al Norte y gira dos veces a la derecha, queda mirando al Sur.',a:true},
  {q:'Depurar es encontrar y corregir los errores de un programa.',a:true},
  {q:'El robot adivina lo que queremos aunque la instrucción sea ambigua.',a:false},
  {q:'Trazar el programa con el dedo ayuda a predecir dónde termina el robot.',a:true},
  {q:'ENTREGA hace girar al robot 90 grados.',a:false},
  {q:'Una computadora ejecuta las instrucciones tal como están escritas.',a:true},
];
const evalMCBank=[
  {q:'¿Qué es una secuencia en programación?',o:['a) Un dibujo del robot','b) Una lista de instrucciones en orden','c) Una casilla del mapa','d) Un número de la suerte'],a:1},
  {q:'Un robot mira hacia arriba (Norte) y ejecuta: AVANZA, GIRA DERECHA, AVANZA. ¿Hacia dónde mira al final?',o:['a) Norte','b) Sur','c) Este','d) Oeste'],a:2},
  {q:'¿Qué es una instrucción?',o:['a) Una orden clara y exacta que se puede ejecutar','b) Un consejo del maestro','c) Un adorno del programa','d) Una pregunta del robot'],a:0},
  {q:'¿Qué hace la instrucción AVANZA?',o:['a) Gira al robot 90°','b) Mueve al robot una casilla hacia donde mira','c) Deja el mensaje','d) Regresa al robot al inicio'],a:1},
  {q:'¿Qué hace la instrucción GIRA IZQUIERDA?',o:['a) Mueve al robot una casilla a la izquierda','b) Cambia la orientación del robot 90° hacia su izquierda','c) Entrega el mensaje','d) Borra el programa'],a:1},
  {q:'¿Qué es un algoritmo?',o:['a) Los pasos ordenados para lograr una tarea','b) Un tipo de robot','c) Un mapa de la aldea','d) Una casilla con árbol'],a:0},
  {q:'¿Cuál de estas es una instrucción EXACTA?',o:['a) «Camina un poquito»','b) «Ve por allá»','c) «Avanza 3 casillas»','d) «Haz algo útil»'],a:2},
  {q:'El robot mira al Este y ejecuta GIRA DERECHA. ¿Hacia dónde mira ahora?',o:['a) Norte','b) Sur','c) Este','d) Oeste'],a:1},
  {q:'¿Qué es un bug?',o:['a) Un error escondido en el programa','b) Un premio del programa','c) Una instrucción de giro','d) El motor del robot'],a:0},
  {q:'¿Qué es depurar un programa?',o:['a) Borrarlo completo','b) Encontrar y corregir sus errores','c) Escribirlo más largo','d) Ejecutarlo más rápido'],a:1},
  {q:'¿Qué forma el ESTADO del robot?',o:['a) Su color y su tamaño','b) Su posición y su orientación','c) Su nombre y su número','d) Su velocidad y su batería'],a:1},
  {q:'El robot mira al Oeste y ejecuta GIRA DERECHA, GIRA DERECHA. ¿Hacia dónde mira al final?',o:['a) Este','b) Oeste','c) Norte','d) Sur'],a:0},
  {q:'El robot llegó a la casa del destino. ¿Qué instrucción falta para dejar el mensaje?',o:['a) AVANZA','b) GIRA DERECHA','c) ENTREGA','d) GIRA IZQUIERDA'],a:2},
  {q:'¿Por qué importa el orden de las instrucciones?',o:['a) Porque cambiar el orden cambia el resultado','b) No importa: el robot adivina','c) Solo importa en programas largos','d) Porque el robot lee de abajo hacia arriba'],a:0},
  {q:'¿Qué pasa si una instrucción saca al robot del mapa?',o:['a) El robot vuela','b) El robot choca: el programa tiene un error','c) El robot entrega el mensaje','d) Aparece otro mapa'],a:1},
];
const evalCPBank=[
  {q:'Una orden clara y exacta que el robot puede ejecutar se llama ___.',a:'instrucción'},
  {q:'Una ___ es una lista de instrucciones en orden.',a:'secuencia'},
  {q:'Los pasos ordenados para lograr una tarea, como una receta, forman un ___.',a:'algoritmo'},
  {q:'La instrucción ___ mueve al robot una casilla hacia adelante.',a:'AVANZA'},
  {q:'GIRA DERECHA y GIRA IZQUIERDA son instrucciones de ___.',a:'giro'},
  {q:'Un error escondido en un programa se llama ___.',a:'bug'},
  {q:'Encontrar y corregir los errores de un programa se llama ___.',a:'depurar'},
  {q:'El punto cardinal que queda arriba en el mapa es el ___.',a:'Norte'},
  {q:'Si el robot mira al Norte y gira a la derecha, queda mirando al ___.',a:'Este'},
  {q:'La instrucción ___ hace que el robot deje el mensaje en la casa.',a:'ENTREGA'},
  {q:'El estado del robot es su posición más su ___.',a:'orientación'},
  {q:'En una secuencia, el ___ de las instrucciones importa.',a:'orden'},
  {q:'Una secuencia escrita que la máquina ejecuta paso a paso es un ___.',a:'programa'},
  {q:'Si el robot mira al Sur y gira a la izquierda, queda mirando al ___.',a:'Este'},
  {q:'Antes de ejecutar, conviene ___ el programa con el dedo sobre el mapa.',a:'trazar'},
];
const evalPRBank=[
  {term:'Instrucción',def:'Orden clara y exacta que se puede ejecutar'},
  {term:'Secuencia',def:'Lista de instrucciones en orden'},
  {term:'Algoritmo',def:'Pasos ordenados para lograr una tarea'},
  {term:'Programa',def:'Secuencia escrita que la máquina ejecuta'},
  {term:'AVANZA',def:'Mueve al robot una casilla hacia donde mira'},
  {term:'GIRA DERECHA',def:'Rota al robot 90° según su propia derecha'},
  {term:'ENTREGA',def:'Deja el mensaje en la casilla actual'},
  {term:'Orientación',def:'Hacia dónde mira el robot (N, E, S, O)'},
  {term:'Estado del robot',def:'Su posición más su orientación'},
  {term:'Bug',def:'Error escondido en el programa'},
  {term:'Depurar',def:'Encontrar y corregir los errores'},
  {term:'Norte',def:'El punto cardinal de arriba en el mapa'},
  {term:'Instrucción ambigua',def:'Orden confusa que no se puede ejecutar'},
  {term:'Trazar',def:'Seguir el programa con el dedo para predecir'},
  {term:'Pseudocódigo',def:'Instrucciones escritas en español sencillo'},
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

function genEval(){sfx('click');_evalFormaSelector(); const _selF = document.getElementById('evalFormaSel'); if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10))); const cf = evalFormNum; const rng = _evalRng(cf); window._currentEvalForm=cf;evalFormNum = (evalFormNum % EVAL_FORMAS) + 1; _evalFormaSelector();saveProgress();document.getElementById('eval-screen-title').textContent=`🎓 Evaluación Final · Forma ${cf} · Secuencias: el Robot Mensajero`;evalAnsVisible=false;const out=document.getElementById('evalOut');out.innerHTML='';const bar=document.createElement('div');bar.className='eval-score-bar';bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje · 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25 pts</span><span class="eval-score-pill esp-tf">V/F 25 pts</span><span class="eval-score-pill esp-mc">Selección 25 pts</span><span class="eval-score-pill esp-pr">Pareados 25 pts</span></div>`;out.appendChild(bar);const cpItems=_pickF(evalCPBank,5, rng);const s1=document.createElement('div');s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';cpItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='cp';d.dataset.evalIndex=i;const qHtml=item.q.replace('___',`<input class="eval-cp-input" type="text" data-cp="${i}" autocomplete="off">`);d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbCp${i}" aria-live="polite"></div>`;s1.appendChild(d);});out.appendChild(s1);const tfItems=_pickF(evalTFBank,5, rng);const s2=document.createElement('div');s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';tfItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='tf';d.dataset.evalIndex=i;d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="true"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="false"> Falso</label></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbTf${i}" aria-live="polite"></div>`;s2.appendChild(d);});out.appendChild(s2);const mcItems=_pickF(evalMCBank,5, rng);const s3=document.createElement('div');s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';mcItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='mc';d.dataset.evalIndex=i;const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join('');d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbMc${i}" aria-live="polite"></div>`;s3.appendChild(d);});out.appendChild(s3);const prItems=_pickF(evalPRBank,5, rng);const shuffledDefs=_shuffleF(prItems, rng);const letters=['A','B','C','D','E'];const s4=document.createElement('div');s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';const matchCard=document.createElement('div');matchCard.className='eval-item';let colLeft='<div class="eval-match-col"><h4>📌 Términos</h4>';prItems.forEach((item,i)=>{colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> <select class="eval-match-select" data-pr="${i}" aria-label="Respuesta pareada ${i+16}"><option value="">—</option>${letters.map(l=>`<option value="${l}">${l}</option>`).join('')}</select> ${item.term}</div>`;});colLeft+='</div>';let colRight='<div class="eval-match-col"><h4>🔑 Definiciones</h4>';shuffledDefs.forEach((item,i)=>{colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`;});colRight+='</div>';const ansKey=prItems.map((item,i)=>{const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)];return`${i+16}→${letter}`;}).join(' · ');matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div><div class="eval-item-feedback" id="evalFbPr" aria-live="polite"></div>`;s4.appendChild(matchCard);out.appendChild(s4);window._evalPrintData={tf:tfItems,mc:mcItems,cp:cpItems,pr:{terms:prItems,shuffledDefs,letters}};const autoPanel=document.createElement('div');autoPanel.id='evalAutoResult';autoPanel.className='eval-auto-result';autoPanel.innerHTML='<strong>🧮 Evaluación interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato original sin respuestas digitadas.';out.appendChild(autoPanel);fin('s-evaluacion');}
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación Secuencias: el Robot Mensajero · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.12rem 0.4rem;margin:0.22rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #0e7490;background:#ecfeff;color:#0e7490;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#0e7490;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #0e7490;height:12px;}.obt-pct{white-space:nowrap;}.qn{font-weight:700;min-width:22px;flex-shrink:0;}.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:40px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.18rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.14rem 0.35rem;margin-bottom:0.1rem;break-inside:avoid;page-break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.3;display:flex;gap:0.28rem;margin-bottom:0.07rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.1rem 0.5rem;}.mc-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:0.04rem 0.15rem;margin-left:0.8rem;}.mc-opt{font-size:9pt;display:flex;align-items:center;gap:0.15rem;}.mc-opt input{width:10px;height:10px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{margin-top:0.1rem;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.08rem 0.4rem;margin-top:0.08rem;}.pr-head{font-size:9pt;font-weight:700;color:#555;margin-bottom:0.1rem;}.pr-item{font-size:10.5pt;padding:0.1rem 0.28rem;background:#ecfeff;border-radius:3px;margin-bottom:0.07rem;display:flex;align-items:center;gap:0.2rem;line-height:1.2;break-inside:avoid;page-break-inside:avoid;}.pr-num{font-weight:700;color:#0e7490;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.22rem;padding:0.15rem 0;page-break-before:avoid;break-before:avoid;color:#0e7490;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #0e7490;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#555;}.pa{color:#007a00;font-weight:600;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · Secuencias: el Robot Mensajero · Educación Básica · Programación</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Evaluación Final · Secuencias: el Robot Mensajero · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u · Programación · Educación Básica</div></div><div class="p-grid">${pR}</div>
  ${zgBlock}</div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("evalPage",252,0.55,1.45);fit("pautaPage",252,0.55,1.3);})();<\/script></body></html>`;const win=window.open('','_blank','');if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}win.document.write(doc);win.document.close();setTimeout(()=>win.print(),400);}

// ===================== PRUEBA OPERATIVA (patrón angulos.js) =====================
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
const OP_INSTR_OPTS=[I_AV,I_GD,I_GI,I_EN];

// I. Ejecuta la secuencia (5 × 4 = 20 pts): cuadrícula 4×4 determinista + programa corto;
//    el alumno marca (en línea) o escribe (impreso) la casilla donde termina el robot.
function genEjecutaItems(){
  const items=[];
  let guard=0;
  while(items.length<5&&guard<500){
    guard++;
    const sr=_opRint(0,3),sc=_opRint(0,3);
    const dir=DIRS[_opRint(0,3)];
    const len=_opRint(3,5);
    const prog=[];let st={r:sr,c:sc,dir};let ok=true;let avz=0;
    for(let i=0;i<len;i++){
      const roll=_opRnd();
      const instr=roll<0.6?I_AV:(roll<0.8?I_GD:I_GI);
      const nx=simStep(st,instr,{n:4});
      if(nx.evento){ok=false;break;}
      if(instr===I_AV)avz++;
      prog.push(instr);st=nx;
    }
    if(!ok||avz<2||(st.r===sr&&st.c===sc))continue;
    const ans=coordName(st.r,st.c);
    const set=[ans];
    while(set.length<4){const cand=coordName(_opRint(0,3),_opRint(0,3));if(set.indexOf(cand)<0)set.push(cand);}
    const opts=_shuffleF(set,_opRnd);
    items.push({sr,sc,dir,prog,ans,opts});
  }
  return items;
}

// II. Predice la salida (5 × 2 = 10 pts): trazas rápidas de orientación y conteo.
function genPrediceItems(){
  const items=[];
  const d1=DIRS[_opRint(0,3)];
  items.push({txt:`El robot mira al ${DIR_NOMBRE[d1]} y ejecuta: GIRA DERECHA, GIRA DERECHA. ¿Hacia dónde mira al final?`,ans:DIR_NOMBRE[turnR(turnR(d1))]});
  const d2=DIRS[_opRint(0,3)];
  items.push({txt:`El robot mira al ${DIR_NOMBRE[d2]} y ejecuta: GIRA IZQUIERDA. ¿Hacia dónde mira ahora?`,ans:DIR_NOMBRE[turnL(d2)]});
  const k3=_opRint(2,4);
  const p3=[];for(let i=0;i<k3;i++){p3.push(I_AV);if(i===0)p3.push(I_GD);}
  items.push({txt:`¿Cuántas casillas se mueve el robot con el programa: ${p3.join(', ')}? (los giros no lo mueven)`,ans:String(k3)});
  const d4=DIRS[_opRint(0,3)];
  items.push({txt:`El robot mira al ${DIR_NOMBRE[d4]} y ejecuta: GIRA DERECHA y después GIRA IZQUIERDA. ¿Hacia dónde mira al final?`,ans:DIR_NOMBRE[d4]});
  const d5=DIRS[_opRint(0,3)];
  items.push({txt:`El robot mira al ${DIR_NOMBRE[d5]} y ejecuta 4 veces GIRA DERECHA (la vuelta completa). ¿Hacia dónde mira al final?`,ans:DIR_NOMBRE[d5]});
  return _shuffleF(items,_opRnd);
}
function _isPredOk(student,expected){
  let s=normalizeEvalAnswer(student).replace(/^(el|al|la)\s+/,'').replace(/\s*casillas?$/,'');
  const e=normalizeEvalAnswer(expected);
  return !!s&&(s===e);
}

// III. Completa el programa (5 × 4 = 20 pts): falta UNA instrucción (razonamiento inverso).
function genCompletaItems(){
  const t=[];
  {const sc=_opRint(0,3),n=_opRint(2,3),blank=_opRint(0,n-1);const prog=Array(n).fill(I_AV);
   t.push({txt:`El robot está en ${coordName(3,sc)} mirando al Norte y debe llegar a ${coordName(3-n,sc)}.`,prog,blank,ans:0});}
  {const sr=_opRint(0,3),k=_opRint(2,3);const prog=[I_GD].concat(Array(k).fill(I_AV));
   t.push({txt:`El robot está en ${coordName(sr,0)} mirando al Norte y la casa está en ${coordName(sr,k)}, hacia el Este.`,prog,blank:0,ans:1});}
  {const sr=_opRint(0,3),k=_opRint(2,3);const prog=[I_GI].concat(Array(k).fill(I_AV));
   t.push({txt:`El robot está en ${coordName(sr,3)} mirando al Norte y la casa está en ${coordName(sr,3-k)}, hacia el Oeste.`,prog,blank:0,ans:2});}
  {const sc=_opRint(0,3),n=_opRint(2,3);const prog=Array(n).fill(I_AV).concat([I_EN]);
   t.push({txt:`El robot está en ${coordName(3,sc)} mirando al Norte; la casa está en ${coordName(3-n,sc)} y al llegar debe DEJAR el mensaje.`,prog,blank:n,ans:3});}
  {const sr=_opRint(0,3),k=_opRint(2,3);const prog=[I_GD].concat(Array(k).fill(I_AV));
   t.push({txt:`El robot está en ${coordName(sr,3)} mirando al Sur y la casa está en ${coordName(sr,3-k)}, hacia el Oeste.`,prog,blank:0,ans:1});}
  return _shuffleF(t,_opRnd);
}
function _cmpProgTxt(it){return it.prog.map((p,i)=>i===it.blank?'___':p).join(', ');}

// IV. Problemas de la vida real (3 × 10 = 30 pts): algoritmos de tareas hondureñas.
const opVidaBank=[
  {tema:'Preparar una baleada para la merienda',pasos:['Poner harina y agua en un recipiente','Amasar y hacer las bolitas','Cocer la tortilla en el comal','Untar frijoles y queso','Doblarla y servirla']},
  {tema:'Repartir los cuadernos a la clase',pasos:['Tomar la pila de cuadernos','Leer el nombre del primer cuaderno','Caminar hasta ese pupitre y entregarlo','Volver por el siguiente cuaderno','Repetir hasta que no queden cuadernos']},
  {tema:'Regar la huerta escolar',pasos:['Llenar la regadera con agua','Caminar hasta el primer surco','Regar cada planta sin encharcar','Pasar al siguiente surco y repetir','Guardar la regadera al terminar']},
  {tema:'Izar la bandera el lunes cívico',pasos:['Formar filas en el patio','Amarrar la bandera a la cuerda','Izarla despacio mientras suena el himno','Hacer el saludo en silencio','Volver al aula en orden']},
  {tema:'Lavarse las manos antes de la merienda',pasos:['Abrir el chorro','Mojarse las manos','Frotar con jabón por 20 segundos','Enjuagar bien','Cerrar el chorro y secarse']},
  {tema:'Hacer un fresco de nance',pasos:['Lavar los nances','Machacarlos con un poco de agua','Colar la mezcla','Agregar agua, azúcar y hielo','Servir el fresco']},
];
const OP_VIDA_RUBRICA='Orden lógico de inicio a fin (4 pts) · Pasos completos, sin saltarse ninguno esencial (4 pts) · Cada paso es una instrucción clara que empieza con un verbo (2 pts)';
function genVidaItems(){return _pickF(opVidaBank,3,_opRnd);}

// V. Retos de olimpiada (10 + 10 = 20 pts)
// (a) El programa más corto para llegar a la meta
function genRetoCorto(){
  let sr,sc,dr,dc,guard=0;
  do{sr=_opRint(0,3);sc=_opRint(0,3);dr=_opRint(0,3);dc=_opRint(0,3);guard++;}while((Math.abs(dr-sr)<1||Math.abs(dc-sc)<1)&&guard<300);
  const dir=DIRS[_opRint(0,3)];
  const prog=planRuta(sr,sc,dr,dc,dir);
  return{sr,sc,dr,dc,dir,prog,ans:prog.length};
}
// (b) Detective del bug: hallar y corregir la instrucción errada
function genRetoBug(){
  let k,guard=0;
  do{k={sr:_opRint(0,3),sc:_opRint(0,3),dr:_opRint(0,3),dc:_opRint(0,3)};guard++;}while(((k.sr===k.dr&&k.sc===k.dc)||Math.abs(k.dr-k.sr)+Math.abs(k.dc-k.sc)<2)&&guard<300);
  const dir=DIRS[_opRint(0,3)];
  const buena=planRuta(k.sr,k.sc,k.dr,k.dc,dir);
  let bi=_opRint(0,buena.length-2);const mala=[...buena];
  for(let t=0;t<buena.length-1;t++){
    const idx=(bi+t)%(buena.length-1);
    const cand=[...buena];
    cand[idx]=cand[idx]===I_AV?I_GD:(cand[idx]===I_GD?I_GI:I_GD);
    const res=simRun({r:k.sr,c:k.sc,dir},cand.slice(0,-1),{n:4});
    if(!res.ok||res.st.r!==k.dr||res.st.c!==k.dc){mala.splice(0,mala.length,...cand);bi=idx;break;}
  }
  return{sr:k.sr,sc:k.sc,dr:k.dr,dc:k.dc,dir,buena,mala,linea:bi+1,correcta:buena[bi]};
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
  document.getElementById('evalop-screen-title').textContent = `🤖 Prueba Operativa — Forma ${cf} · Secuencias: el Robot Mensajero`;
  evalOpAnsVisible = false;
  const out = document.getElementById('evalOpOut'); out.innerHTML = '';

  const ejeItems = genEjecutaItems();
  const prdItems = genPrediceItems();
  const cplItems = genCompletaItems();
  const vidaItems = genVidaItems();
  const retoC = genRetoCorto();
  const retoB = genRetoBug();

  const s1 = document.createElement('div');
  s1.innerHTML = `<div class="eval-section-title">I. Ejecuta la secuencia <span class="eval-pts">20 pts · 4 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel básico. Sigue el programa con el dedo sobre la cuadrícula y marca la casilla donde TERMINA el robot.</p>`;
  ejeItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    const optsHtml = it.opts.map(op => `<label class="eval-mc-opt"><input type="radio" name="opE${i}" value="${op}"> ${op}</label>`).join('');
    d.innerHTML = `<div class="eval-q"><span class="eval-num">${i + 1}</span><span class="eval-q-text">El robot parte de <strong>${coordName(it.sr, it.sc)}</strong> mirando al <strong>${DIR_NOMBRE[it.dir]}</strong>.</span></div><div class="op-grid-wrap">${svgGridHTML({ n: 4, robot: { r: it.sr, c: it.sc, dir: it.dir }, w: 160 })}</div><div class="op-prog">${it.prog.map((p, j) => (j + 1) + '. ' + p).join('<br>')}</div><div class="eval-mc-opts" style="flex-direction:row;flex-wrap:wrap;gap:0.8rem;">${optsHtml}</div><div class="eval-answer">${it.ans}</div><div class="eval-item-feedback" id="evalFbEje${i}" aria-live="polite"></div>`;
    s1.appendChild(d);
  });
  out.appendChild(s1);

  const s2 = document.createElement('div');
  s2.innerHTML = `<div class="eval-section-title">II. Predice la salida <span class="eval-pts">10 pts · 2 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Agilidad. Responde sin cuadrícula: escribe la orientación (Norte, Este, Sur, Oeste) o el número que se pide.</p>`;
  prdItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="eval-q"><span class="eval-num">${i + 1}</span><span class="eval-q-text">${it.txt}</span></div><div class="opx-row" style="margin-left:1.7rem;"><span style="font-size:0.82rem;color:var(--gray);">R/</span><input class="eval-cp-input" type="text" data-prd="${i}" autocomplete="off" style="min-width:110px;max-width:150px;"></div><div class="eval-answer">${it.ans}</div><div class="eval-item-feedback" id="evalFbPrd${i}" aria-live="polite"></div>`;
    s2.appendChild(d);
  });
  out.appendChild(s2);

  const s3 = document.createElement('div');
  s3.innerHTML = `<div class="eval-section-title">III. Completa el programa <span class="eval-pts">20 pts · 4 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel intermedio. Piensa al revés: al programa le falta UNA instrucción (el espacio ___). Elige cuál es.</p>`;
  cplItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    const optsHtml = OP_INSTR_OPTS.map((op, oi) => `<label class="eval-mc-opt"><input type="radio" name="opC${i}" value="${oi}"> ${'abcd'[oi]}) ${op}</label>`).join('');
    d.innerHTML = `<div class="eval-q"><span class="eval-num">${i + 1}</span><span class="eval-q-text">${it.txt}</span></div><div class="op-prog">Programa: ${_cmpProgTxt(it)}</div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${'abcd'[it.ans]}) ${OP_INSTR_OPTS[it.ans]}</div><div class="eval-item-feedback" id="evalFbCpl${i}" aria-live="polite"></div>`;
    s3.appendChild(d);
  });
  out.appendChild(s3);

  const s4 = document.createElement('div');
  s4.innerHTML = `<div class="eval-section-title">IV. Problemas de la vida real <span class="eval-pts">30 pts · 10 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel avanzado. Escribe el ALGORITMO (4 a 6 pasos numerados, cada uno con un verbo claro). Compara con la pauta y anota tu puntaje de 0 a 10.</p>`;
  vidaItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="eval-q"><span class="eval-num">${i + 1}</span><span class="eval-q-text">Escribe el algoritmo para: <strong>${it.tema}</strong>.</span></div><textarea class="op-vida-ta" aria-label="Algoritmo para ${it.tema}" placeholder="1. …&#10;2. …&#10;3. …&#10;4. …"></textarea><div class="op-pauta-rub"><strong>Pasos clave:</strong> ${it.pasos.map((p, j) => (j + 1) + '. ' + p).join(' · ')}<br><strong>Rúbrica (10 pts):</strong> ${OP_VIDA_RUBRICA}</div><div class="op-vida-score"><label for="opVida${i}">Compara con la pauta y anota tu puntaje:</label><input type="number" id="opVida${i}" data-vida="${i}" min="0" max="10" value="0"> <span>de 10 pts</span></div><div class="eval-item-feedback" id="evalFbVida${i}" aria-live="polite"></div>`;
    s4.appendChild(d);
  });
  out.appendChild(s4);

  const s5 = document.createElement('div');
  s5.innerHTML = '<div class="eval-section-title">V. Retos de olimpiada <span class="eval-pts">20 pts · 10 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Desafío. Piensa como programador: encuentra el camino más corto y atrapa el bug.</p>';
  const dC = document.createElement('div'); dC.className = 'eval-item eval-auto-item';
  dC.innerHTML = `<div class="eval-q"><span class="eval-num">1</span><span class="eval-q-text">🏁 <strong>El programa más corto:</strong> el robot está en <strong>${coordName(retoC.sr, retoC.sc)}</strong> mirando al <strong>${DIR_NOMBRE[retoC.dir]}</strong> y la casa está en <strong>${coordName(retoC.dr, retoC.dc)}</strong>. ¿Cuántas instrucciones tiene el programa MÁS CORTO para llegar y entregar el mensaje? (cuenta también ENTREGA)</span></div><div class="op-grid-wrap">${svgGridHTML({ n: 4, robot: { r: retoC.sr, c: retoC.sc, dir: retoC.dir }, dest: [retoC.dr, retoC.dc], w: 160 })}</div><div class="opx-row" style="margin-left:1.7rem;"><span style="font-size:0.82rem;color:var(--gray);">Nº de instrucciones:</span><input class="eval-cp-input" type="text" data-rc="0" autocomplete="off" inputmode="numeric" style="min-width:70px;max-width:90px;"></div><div class="eval-answer">${retoC.ans} instrucciones · Ejemplo: ${retoC.prog.join(' → ')}</div><div class="eval-item-feedback" id="evalFbRc" aria-live="polite"></div>`;
  s5.appendChild(dC);
  const dB = document.createElement('div'); dB.className = 'eval-item eval-auto-item';
  const selHtml = `<select class="eval-match-select" data-bi="0" aria-label="Instrucción correcta"><option value="">—</option>${OP_INSTR_OPTS.map(op => `<option value="${op}">${op}</option>`).join('')}</select>`;
  dB.innerHTML = `<div class="eval-q"><span class="eval-num">2</span><span class="eval-q-text">🔎 <strong>Detective del bug:</strong> este programa debería llevar al robot de <strong>${coordName(retoB.sr, retoB.sc)}</strong> (mirando al <strong>${DIR_NOMBRE[retoB.dir]}</strong>) hasta la casa en <strong>${coordName(retoB.dr, retoB.dc)}</strong> y entregar, pero tiene UNA instrucción errada.</span></div><div class="op-grid-wrap">${svgGridHTML({ n: 4, robot: { r: retoB.sr, c: retoB.sc, dir: retoB.dir }, dest: [retoB.dr, retoB.dc], w: 160 })}</div><div class="op-prog">${retoB.mala.map((p, j) => 'Línea ' + (j + 1) + ': ' + p).join('<br>')}</div><div class="opx-row" style="margin-left:1.7rem;"><span style="font-size:0.82rem;color:var(--gray);">Línea errada (5 pts):</span><input class="eval-cp-input" type="text" data-bl="0" autocomplete="off" inputmode="numeric" style="min-width:56px;max-width:70px;"><span style="font-size:0.82rem;color:var(--gray);">Debe decir (5 pts):</span>${selHtml}</div><div class="eval-answer">Línea ${retoB.linea} → ${retoB.correcta}</div><div class="eval-item-feedback" id="evalFbBug" aria-live="polite"></div>`;
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
  d.ejeItems.forEach((it, i) => { const sel = document.querySelector(`input[name="opE${i}"]:checked`); const ok = !!sel && sel.value === it.ans; if (ok) { det.eje += 4; total += 4; } setEvalFeedback('evalFbEje' + i, ok, ok ? 'Correcto. +4 pts' : 'Revisar. El robot termina en ' + it.ans); });
  d.prdItems.forEach((it, i) => { const el = document.querySelector(`[data-prd="${i}"]`); const ok = _isPredOk(el ? el.value : '', it.ans) || _isOpNumOk(el ? el.value : '', it.ans); if (el) { el.classList.toggle('eval-input-ok', ok); el.classList.toggle('eval-input-no', !ok); } if (ok) { det.prd += 2; total += 2; } setEvalFeedback('evalFbPrd' + i, ok, ok ? 'Correcto. +2 pts' : 'Revisar. R/ ' + it.ans); });
  d.cplItems.forEach((it, i) => { const sel = document.querySelector(`input[name="opC${i}"]:checked`); const ok = !!sel && Number(sel.value) === it.ans; if (ok) { det.cpl += 4; total += 4; } setEvalFeedback('evalFbCpl' + i, ok, ok ? 'Correcto. +4 pts' : 'Revisar. Faltaba: ' + OP_INSTR_OPTS[it.ans]); });
  d.vidaItems.forEach((it, i) => { const inp = document.querySelector(`[data-vida="${i}"]`); let v = inp ? (parseInt(inp.value) || 0) : 0; v = Math.max(0, Math.min(10, v)); if (inp) inp.value = v; det.vida += v; autoev += v; setEvalFeedback('evalFbVida' + i, v >= 7, 'Puntaje autoevaluado: ' + v + '/10 (compara siempre con la pauta)'); });
  { const el = document.querySelector('[data-rc="0"]'); const ok = _isOpNumOk(el ? el.value : '', d.retoC.ans); if (el) { el.classList.toggle('eval-input-ok', ok); el.classList.toggle('eval-input-no', !ok); } if (ok) { det.reto += 10; total += 10; } setEvalFeedback('evalFbRc', ok, ok ? '¡Camino mínimo encontrado! +10 pts' : 'Revisar. Mínimo: ' + d.retoC.ans + ' instrucciones (' + d.retoC.prog.join(' → ') + ')'); }
  { const elL = document.querySelector('[data-bl="0"]'); const okL = _isOpNumOk(elL ? elL.value : '', d.retoB.linea); if (elL) { elL.classList.toggle('eval-input-ok', okL); elL.classList.toggle('eval-input-no', !okL); } const elI = document.querySelector('[data-bi="0"]'); const okI = !!elI && elI.value === d.retoB.correcta; if (elI) { elI.classList.toggle('eval-input-ok', okI); elI.classList.toggle('eval-input-no', !okI); } if (okL) { det.reto += 5; total += 5; } if (okI) { det.reto += 5; total += 5; } setEvalFeedback('evalFbBug', okL && okI, (okL && okI) ? '¡Bug atrapado y corregido! +10 pts' : 'Revisar. Línea ' + d.retoB.linea + ' → ' + d.retoB.correcta); }
  const res = document.getElementById('evalOpAutoResult');
  const desglose = `Ejecuta: ${det.eje}/20 · Predice: ${det.prd}/10 · Completa: ${det.cpl}/20 · Retos: ${det.reto}/20`;
  if (res) { res.className = 'eval-auto-result ' + (total >= OP_UMBRAL ? 'eval-auto-pass' : 'eval-auto-risk'); res.innerHTML = `<strong>Resultado automático: ${total}/${OP_AUTO} puntos</strong><br><span>${desglose}</span><br><em>Falta calificar: IV. Vida real (${OP_MANUAL} pts). Eso lo escribiste tú y lo revisa tu maestro con la pauta; tu autoevaluación fue ${autoev}/${OP_MANUAL} y no cuenta para esta nota.</em>`; }
  if (total >= OP_UMBRAL) { pts(8); showToast('🎯 Prueba operativa calificada: ' + total + '/' + OP_AUTO); }
  else showToast('🧮 Prueba operativa: ' + total + '/' + OP_AUTO + '. Revisa los ítems marcados.');
}

function printEvalOp() {
  if (!window._evalOpData) { showToast('⚠️ Genera una prueba operativa primero'); return; }
  sfx('click');
  const forma = window._currentEvalOpForm || 1; const d = window._evalOpData;

  // ── I. Ejecuta la secuencia (cuadrículas SVG deterministas; casillas vacías con «•»)
  let s1 = `<div class="sec-title"><span>I. Ejecuta la secuencia</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Nivel básico. Sigue el programa con el dedo y ESCRIBE la casilla donde termina el robot (tipo B3, letra de columna + número de fila). 4 pts c/u.</p><div class="ej-grid">`;
  d.ejeItems.forEach((it, i) => {
    s1 += `<div class="ej-box"><div class="ej-head">${i + 1}. Sale de ${coordName(it.sr, it.sc)} mirando al ${DIR_NOMBRE[it.dir]}</div><div class="ej-svg">${svgGridHTML({ n: 4, robot: { r: it.sr, c: it.sc, dir: it.dir }, w: 118 })}</div><div class="ej-prog">${it.prog.map((p, j) => (j + 1) + '. ' + p).join('<br>')}</div><div class="ej-resp">Termina en: <span class="opx-mini-blank">&nbsp;</span></div></div>`;
  });
  s1 += '</div>';

  // ── II. Predice la salida
  let s2 = `<div class="sec-title"><span>II. Predice la salida</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10 pts</span></div></div><p class="opx-instr">Agilidad. Escribe la orientación (Norte, Este, Sur, Oeste) o el número que se pide. 2 pts c/u.</p>`;
  d.prdItems.forEach((it, i) => { s2 += `<div class="opx-print-row" style="align-items:flex-start;"><span class="qn">${i + 1}.</span><span style="flex:1;line-height:1.35;">${it.txt} &nbsp; R/ <span class="opx-mini-blank">&nbsp;</span></span></div>`; });

  // ── III. Completa el programa
  let s3 = `<div class="sec-title"><span>III. Completa el programa</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Nivel intermedio. Al programa le falta UNA instrucción (el espacio ___). Escribe la letra: a) AVANZA · b) GIRA DERECHA · c) GIRA IZQUIERDA · d) ENTREGA. 4 pts c/u.</p>`;
  d.cplItems.forEach((it, i) => { s3 += `<div class="opx-print-row" style="align-items:flex-start;"><span class="qn">${i + 1}.</span><span style="flex:1;line-height:1.35;">${it.txt}<br><span class="mono">Programa: ${_cmpProgTxt(it)}</span> &nbsp; Letra: <span class="opx-mini-blank" style="min-width:34px;">&nbsp;</span></span></div>`; });

  // ── IV. Problemas de la vida real (rúbrica en la pauta)
  let s4 = `<div class="sec-title"><span>IV. Problemas de la vida real</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 30 pts</span></div></div><p class="opx-instr">Nivel avanzado. Escribe el ALGORITMO de 4 a 6 pasos numerados; cada paso empieza con un verbo claro. 10 pts c/u.</p>`;
  d.vidaItems.forEach((it, i) => { s4 += `<div class="opx-print-row" style="align-items:flex-start;"><span class="qn">${i + 1}.</span><span style="flex:1;line-height:1.4;">Algoritmo para: <strong>${it.tema}</strong><br><span class="ln-vida"></span><span class="ln-vida"></span><span class="ln-vida"></span></span></div>`; });

  // ── V. Retos de olimpiada
  let s5 = `<div class="sec-title"><span>V. Retos de olimpiada</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Desafío. Reto 1: 10 pts · Reto 2: 10 pts (5 la línea + 5 la corrección).</p><div class="ord-print-grid"><div class="ord-print-box"><div class="ord-print-dir">1. 🏁 El programa más corto · 10 pts:</div><div style="text-align:center;">${svgGridHTML({ n: 4, robot: { r: d.retoC.sr, c: d.retoC.sc, dir: d.retoC.dir }, dest: [d.retoC.dr, d.retoC.dc], w: 108 })}</div><div style="font-size:9pt;line-height:1.35;">El robot está en ${coordName(d.retoC.sr, d.retoC.sc)} mirando al ${DIR_NOMBRE[d.retoC.dir]}; la casa 🏠 está en ${coordName(d.retoC.dr, d.retoC.dc)}. ¿Cuántas instrucciones tiene el programa MÁS CORTO para llegar y entregar? (cuenta ENTREGA)</div><div style="margin-top:0.3rem;font-size:9pt;">Nº de instrucciones: <span class="opx-mini-blank">&nbsp;</span></div></div><div class="ord-print-box"><div class="ord-print-dir">2. 🔎 Detective del bug · 10 pts:</div><div style="text-align:center;">${svgGridHTML({ n: 4, robot: { r: d.retoB.sr, c: d.retoB.sc, dir: d.retoB.dir }, dest: [d.retoB.dr, d.retoB.dc], w: 108 })}</div><div style="font-size:9pt;line-height:1.35;">De ${coordName(d.retoB.sr, d.retoB.sc)} (mirando al ${DIR_NOMBRE[d.retoB.dir]}) a la casa en ${coordName(d.retoB.dr, d.retoB.dc)}; UNA instrucción está errada:<br><span class="mono">${d.retoB.mala.map((p, j) => 'Línea ' + (j + 1) + ': ' + p).join('<br>')}</span></div><div style="margin-top:0.3rem;font-size:9pt;">Línea errada: <span class="opx-mini-blank" style="min-width:34px;">&nbsp;</span> · Debe decir: <span class="opx-mini-blank" style="min-width:90px;">&nbsp;</span></div></div></div>`;

  // ── Pauta del docente
  let pR = '';
  pR += `<div class="p-sec"><div class="p-ttl">I. Ejecuta la secuencia</div><table class="p-tbl">${d.ejeItems.map((it, i) => `<tr><td class="pn">${i + 1}.</td><td class="pa">Termina en ${it.ans}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">II. Predice la salida</div><table class="p-tbl">${d.prdItems.map((it, i) => `<tr><td class="pn">${i + 1}.</td><td class="pa">${it.ans}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">III. Completa el programa</div><table class="p-tbl">${d.cplItems.map((it, i) => `<tr><td class="pn">${i + 1}.</td><td class="pa">${'abcd'[it.ans]}) ${OP_INSTR_OPTS[it.ans]}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">IV. Vida real (rúbrica 10 pts c/u)</div>${d.vidaItems.map((it, i) => `<div class="p-ord-line"><strong>${i + 1}. ${it.tema}:</strong> ${it.pasos.join(' → ')}</div>`).join('')}<div class="p-rub">Rúbrica: ${OP_VIDA_RUBRICA}. Acepte redacciones distintas si los pasos clave están en orden.</div></div>`;
  pR += `<div class="p-sec" style="grid-column:1/-1;"><div class="p-ttl">V. Retos de olimpiada</div><div class="p-ord-line"><strong>1.</strong> Mínimo: ${d.retoC.ans} instrucciones · Ejemplo: ${d.retoC.prog.join(' → ')}</div><div class="p-ord-line"><strong>2.</strong> Línea ${d.retoB.linea} → debe decir ${d.retoB.correcta}</div></div>`;

  const doc = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Prueba Operativa Secuencias: el Robot Mensajero · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11.5pt;color:#111;background:#fff;padding:4mm 6mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.5rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;color:#0e7490;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:#0e7490;margin-top:0.15rem;font-weight:700;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.5rem 0 0.22rem;border-left:4px solid #0e7490;background:#ecfeff;display:flex;justify-content:space-between;align-items:center;color:#0e7490;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:#0e7490;font-weight:700;font-style:italic;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #0e7490;height:12px;}.qn{font-weight:700;min-width:20px;display:inline-block;color:#0e7490;}.opx-instr{font-size:9pt;color:#555;margin-bottom:0.25rem;}.opx-print-row{display:flex;align-items:baseline;gap:0.4rem;font-size:10.5pt;padding:0.22rem 0.2rem;border-bottom:1px dotted #ddd;}.opx-mini-blank{display:inline-block;min-width:60px;border-bottom:1.5px solid #111;}.mono{font-family:'Courier New',monospace;font-weight:700;font-size:9.5pt;}.ej-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0.35rem 0.5rem;margin-top:0.2rem;}.ej-box{border:1px solid #bbb;border-radius:4px;padding:0.25rem 0.35rem;break-inside:avoid;page-break-inside:avoid;}.ej-head{font-size:8.5pt;font-weight:700;color:#0e7490;margin-bottom:0.15rem;}.ej-svg{text-align:center;}.ej-prog{font-family:'Courier New',monospace;font-size:8.5pt;font-weight:700;line-height:1.3;margin-top:0.15rem;}.ej-resp{font-size:9pt;margin-top:0.2rem;}.ln-vida{display:block;border-bottom:1px solid #111;min-height:14px;margin-top:8px;}.ord-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.8rem;margin-top:0.2rem;}.ord-print-box{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.4rem;break-inside:avoid;}.ord-print-dir{font-size:9pt;font-weight:700;color:#0e7490;margin-bottom:0.2rem;}.total-row{display:flex;align-items:baseline;justify-content:flex-end;gap:7px;font-size:11pt;color:#0e7490;font-weight:700;font-style:italic;margin-top:0.5rem;padding:0.2rem 0.5rem;background:#ecfeff;border-radius:4px;}.total-row .obt-line{min-width:80px;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #0e7490;padding-bottom:0.35rem;margin-bottom:0.5rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;color:#0e7490;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #a5f3fc;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;color:#0e7490;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#0e7490;}.pa{color:#007a00;font-weight:600;}.p-ord-line{font-size:10.5pt;margin-bottom:0.2rem;color:#007a00;}.p-rub{font-size:9.5pt;color:#555;margin-top:0.2rem;border-top:1px dotted #ddd;padding-top:0.2rem;}.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Examen de Programación — Prueba Operativa · Secuencias: el Robot Mensajero · Educación Básica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 pts · I: 20 · II: 10 · III: 20 · IV: 30 · V: 20 · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✔ PAUTA — Prueba Operativa · Secuencias: el Robot Mensajero · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">100 pts · I: 5×4 · II: 5×2 · III: 5×4 · IV: 3×10 · V: 10+10 · Programación · Educación Básica</div></div><div class="p-grid">${pR}</div></div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("evalPage",250,0.55,1.2);fit("pautaPage",250,0.55,1.2);})();<\/script></body></html>`;
  const win = window.open('', '_blank', '');
  if (!win) { showToast('⚠️ Activa las ventanas emergentes para imprimir'); return; }
  win.document.write(doc); win.document.close(); setTimeout(() => win.print(), 400);
}

// ===================== LAB: SIMULADOR DEL ROBOT MENSAJERO =====================
// 4 misiones de entrega (parteData) en una aldea 5×5: 🌳 = obstáculo (no se pisa),
// 🏫/🏪/⛪ = decoración transitable, 🏠 = casa destino. Coordenadas A–E / 1–5.
const parteData={
  n1:{nombre:'Nivel 1 · La calle recta',icon:'1️⃣',n:5,start:{r:4,c:2,dir:'N'},dest:[1,2],
      obst:[[2,0],[2,4]],deco:{'0,0':'🏫','0,4':'⛪','3,4':'🏪'},
      meta:'Lleva el mensaje a la casa 🏠 en C2. Pista: solo necesitas AVANZA y ENTREGA.',xpn:6},
  n2:{nombre:'Nivel 2 · Doblar la esquina',icon:'2️⃣',n:5,start:{r:4,c:0,dir:'N'},dest:[1,3],
      obst:[[2,1],[3,3],[2,3]],deco:{'0,0':'⛪','0,2':'🏫','4,4':'🏪'},
      meta:'La casa 🏠 está en D2. Tendrás que avanzar y GIRAR en el camino.',xpn:6},
  n3:{nombre:'Nivel 3 · Esquiva los árboles',icon:'3️⃣',n:5,start:{r:2,c:0,dir:'E'},dest:[2,4],
      obst:[[2,2],[1,3]],deco:{'0,1':'🏫','4,3':'🏪','0,4':'⛪'},
      meta:'La casa 🏠 está en E3, pero hay árboles 🌳 en el camino directo. ¡Rodéalos!',xpn:6},
  n4:{nombre:'Nivel 4 · La vuelta larga',icon:'4️⃣',n:5,start:{r:0,c:0,dir:'S'},dest:[4,4],
      obst:[[1,1],[2,2],[3,3],[1,3]],deco:{'0,2':'🏫','2,4':'⛪','0,4':'🏪'},
      meta:'Cruza la aldea completa hasta la casa 🏠 en E5. Planifica antes de ejecutar.',xpn:6}
};
let labNivel='n1',labProg=[],labRunning=false,labRobot=null;
function _labMapa(){const nv=parteData[labNivel];return{n:nv.n,obst:nv.obst.map(o=>o[0]+','+o[1])};}
function labShowParte(parteKey){if(labRunning)return;labNivel=parteKey;const nv=parteData[parteKey];labProg=[];labRobot={r:nv.start.r,c:nv.start.c,dir:nv.start.dir};document.querySelectorAll('.lab-cont-btn').forEach(b=>b.classList.remove('active-pri'));const btn=document.querySelector(`[data-parte="${parteKey}"]`);if(btn)btn.classList.add('active-pri');updateLabDisplay();if(typeof sfx==='function')sfx('click');}
function updateLabDisplay(){
  const nv=parteData[labNivel];
  const sent=document.getElementById('lab-sentence');
  if(sent)sent.innerHTML=`🤖 <strong>${nv.nombre}</strong> — ${nv.meta}`;
  const disp=document.getElementById('lab-display');
  if(!disp)return;
  disp.innerHTML=`<div id="simSvgWrap">${svgGridHTML({n:nv.n,robot:labRobot,dest:nv.dest,obst:nv.obst,deco:nv.deco,dots:false,w:300})}</div><div style="font-size:0.8rem;color:var(--gray);margin-top:0.3rem;">Robot en <strong>${coordName(labRobot.r,labRobot.c)}</strong> mirando al <strong>${DIR_NOMBRE[labRobot.dir]}</strong> ${DIR_FLECHA[labRobot.dir]}</div>`;
  renderLabProg();
}
function renderLabProg(runIdx,crashIdx){
  const list=document.getElementById('progList');
  if(!list)return;
  if(labProg.length===0){list.innerHTML='<span class="sim-empty-hint">Toca los botones de arriba para armar tu programa 👆</span>';return;}
  list.innerHTML=labProg.map((p,i)=>`<span class="sim-chip${i===runIdx?' sim-chip-run':''}${i===crashIdx?' sim-chip-crash':''}"><span class="sim-chip-n">${i+1}</span>${p}</span>`).join('');
}
function labAdd(instr){if(labRunning)return;if(labProg.length>=30){showToast('⚠️ Máximo 30 instrucciones');return;}labProg.push(instr);renderLabProg();sfx('click');}
function labDel(){if(labRunning)return;labProg.pop();renderLabProg();sfx('click');}
function labClear(){if(labRunning)return;labProg=[];const nv=parteData[labNivel];labRobot={r:nv.start.r,c:nv.start.c,dir:nv.start.dir};updateLabDisplay();sfx('click');}
function labRun(){
  if(labRunning)return;
  if(labProg.length===0){fb('fbLab','Primero arma un programa con los botones AVANZA, GIRA y ENTREGA.',false);return;}
  labRunning=true;sfx('click');
  const nv=parteData[labNivel];
  labRobot={r:nv.start.r,c:nv.start.c,dir:nv.start.dir};
  updateLabDisplay();
  const fbEl=document.getElementById('fbLab');if(fbEl)fbEl.classList.remove('show');
  let i=0;
  const paso=()=>{
    if(i>=labProg.length){
      labRunning=false;renderLabProg();
      fb('fbLab','El programa terminó sin entregar el mensaje. Agrega la instrucción ENTREGA cuando el robot esté sobre la casa 🏠.',false);sfx('no');
      return;
    }
    const instr=labProg[i];
    renderLabProg(i);
    const nx=simStep(labRobot,instr,_labMapa());
    if(nx.evento==='borde'||nx.evento==='obstaculo'){
      labRunning=false;renderLabProg(undefined,i);
      const disp=document.getElementById('lab-display');if(disp){disp.parentElement.classList.add('sim-crash');setTimeout(()=>disp.parentElement.classList.remove('sim-crash'),700);}
      fb('fbLab',`💥 ¡El robot chocó en la instrucción ${i+1} (${instr})! ${nx.evento==='borde'?'Se salió del mapa.':'Hay un árbol 🌳 en esa casilla.'} Corrige tu programa y vuelve a ejecutar.`,false);
      sfx('no');
      setTimeout(()=>{labRobot={r:nv.start.r,c:nv.start.c,dir:nv.start.dir};updateLabDisplay();renderLabProg(undefined,i);},900);
      return;
    }
    if(nx.evento==='entrega'){
      if(labRobot.r===nv.dest[0]&&labRobot.c===nv.dest[1]){
        labRunning=false;renderLabProg();
        fb('fbLab',`📬 ¡Mensaje entregado en ${coordName(nv.dest[0],nv.dest[1])} con ${labProg.length} instrucciones! ¡Excelente, programador!`,true);
        sfx('fan');launchConfetti();
        if(!xpTracker.lab.has(labNivel)){xpTracker.lab.add(labNivel);pts(nv.xpn);const btn=document.querySelector(`[data-parte="${labNivel}"]`);if(btn)btn.classList.add('lab-done');}
        if(xpTracker.lab.size===Object.keys(parteData).length){fin('s-lab');unlockAchievement('lab_master');}
        return;
      }
      labRunning=false;renderLabProg(undefined,i);
      fb('fbLab',`📭 El robot entregó el mensaje en ${coordName(labRobot.r,labRobot.c)}… ¡pero ahí no vive nadie! La casa 🏠 está en ${coordName(nv.dest[0],nv.dest[1])}.`,false);
      sfx('no');
      return;
    }
    labRobot=nx;
    updateLabDisplay();
    renderLabProg(i);
    i++;
    setTimeout(paso,450);
  };
  paso();
}

// ===================== DIPLOMA =====================
function _diplPct(){return xp>=MXP?100:Math.round((xp/MXP)*100);}
function openDiploma(){sfx('fan');const pct=_diplPct();document.getElementById('diplPct').textContent=pct+'%';document.getElementById('diplBar').style.width=pct+'%';document.getElementById('diplDate').textContent='Fecha: '+new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});const msgs=['¡Sigue aprendiendo!','¡Muy buen trabajo!','¡Vas muy bien!','¡Dominas las secuencias y al robot mensajero!','¡Maestro del Código!'];document.getElementById('diplMsg').textContent=msgs[Math.min(Math.floor(pct/25),4)];const stars=['⭐','⭐⭐','⭐⭐⭐'];document.getElementById('diplStars').textContent=stars[Math.min(Math.floor(pct/40),2)];const achTxt=unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(' · ');document.getElementById('diplAch').textContent=achTxt||'Sigue completando secciones para desbloquear logros';document.getElementById('diplomaOverlay').classList.add('open');launchConfetti();}
function closeDiploma(){document.getElementById('diplomaOverlay').classList.remove('open');}
function updateDiplomaName(v){document.getElementById('diplName').textContent=v||'Estudiante';}
function shareWA(){const name=document.getElementById('diplName').textContent||'Estudiante';const pct=_diplPct();const msg=`🤖 ¡${name} completó la Misión "Secuencias: el Robot Mensajero"! 🏅 Progreso: ${pct}% · 💻 policastsapien.com`;_waShare(msg);}
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
  buildRoute();
  showNeuron();
  showNeuro();
  showEnfer();
  labShowParte('n1');
  renderAchPanel();
});

// Formas deterministas v1: selectores de forma visibles desde la carga de la página
(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalOp==='function') _injectFormaSel('genEvalOp','evalOpFormaSel',evalOpFormNum,function(v){evalOpFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();
