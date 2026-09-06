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
const SAVE_KEY='bucles_repetir_v1';
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
// SVG de cuadrícula (pantalla e impresión). o={n,robot:{r,c,dir},dest:[r,c],obst:[[r,c]],deco:{'r,c':emoji},paint:['r,c'],paintColor,w,dots}
function svgGridHTML(o){
  const n=o.n,cs=44,m=26,W=m+n*cs+6,H=m+n*cs+6;
  const px=(c)=>m+c*cs,py=(r)=>m+r*cs;
  let s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"${o.w?` width="${o.w}"`:''} role="img" aria-label="Cuadrícula del robot">`;
  s+=`<rect x="${m}" y="${m}" width="${n*cs}" height="${n*cs}" fill="#ecfeff" stroke="#0e7490" stroke-width="2" rx="4"/>`;
  const pintada={};
  (o.paint||[]).forEach(k=>{const parts=String(k).split(',');const r=Number(parts[0]),c=Number(parts[1]);pintada[r+','+c]=1;s+=`<rect x="${px(c)+2}" y="${py(r)+2}" width="${cs-4}" height="${cs-4}" fill="${o.paintColor||'#67e8f9'}" opacity="0.9" rx="5"/>`;});
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
  if(o.dots!==false){for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(!ocupada[r+','+c]&&!pintada[r+','+c])s+=`<text x="${px(c)+cs/2}" y="${py(r)+cs/2+4}" text-anchor="middle" font-size="10" fill="#0e7490" opacity="0.55">•</text>`;}
  s+='</svg>';
  return s;
}

// ── BUCLES: un programa es una lista de instrucciones (cadenas) y bucles {rep:N, body:[instr,...]} ──
// Expande un programa con bucles a la lista plana que ejecuta el robot.
// Cada elemento plano lleva {i:instrucción, v:vuelta actual, de:total de vueltas} (v=0 si va fuera de bucle).
function expandProg(prog){const flat=[];prog.forEach(tk=>{if(typeof tk==='string')flat.push({i:tk,v:0,de:0});else{for(let v=1;v<=tk.rep;v++)tk.body.forEach(b=>flat.push({i:b,v,de:tk.rep}));}});return flat;}
function progLineas(prog){return prog.map(tk=>typeof tk==='string'?tk:`REPETIR ${tk.rep} VECES [${tk.body.join(', ')}]`);}
function progTexto(prog){return progLineas(prog).join(' · ');}
// Instrucciones ESCRITAS: la línea REPETIR cuenta 1 y cada instrucción del cuerpo cuenta 1.
function countEscritas(prog){return prog.reduce((a,tk)=>a+(typeof tk==='string'?1:1+tk.body.length),0);}
function countEjecutadas(prog){return expandProg(prog).length;}
// Ejecuta un programa CON bucles y devuelve el rastro pintado (celdas por donde pasa, incluida la salida).
function simTrail(start,prog,n){
  let st={r:start.r,c:start.c,dir:start.dir};
  const trail=new Set([st.r+','+st.c]);
  const flat=expandProg(prog);
  for(let i=0;i<flat.length;i++){
    const nx=simStep(st,flat[i].i,{n});
    if(nx.evento==='borde'||nx.evento==='obstaculo')return{ok:false,crashAt:i,st,trail};
    st={r:nx.r,c:nx.c,dir:nx.dir};trail.add(st.r+','+st.c);
  }
  return{ok:true,st,trail};
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
  primer_quiz:{icon:'🔁',label:'Primer quiz de bucles superado'},
  flash_master:{icon:'🃏',label:'Todas las flashcards de bucles exploradas'},
  clasif_pro:{icon:'🗂️',label:'Clasificador de patrones y bucles experto'},
  id_master:{icon:'🔍',label:'Contador de vueltas maestro'},
  reto_hero:{icon:'🏆',label:'Héroe del reto contra reloj'},
  lab_master:{icon:'🎨',label:'¡Las 4 figuras dibujadas con bucles!'},
  nivel3:{icon:'⌨️',label:'¡Domador de Bucles! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡Ingeniero de Bucles! Nivel 6'},
  widgets_master:{icon:'🧩',label:'Widgets del pensamiento computacional dominados'}
};
function unlockAchievement(id){if(unlockedAch.includes(id))return;unlockedAch.push(id);sfx('ach');showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label);launchConfetti();renderAchPanel();saveProgress();}
function renderAchPanel(){const list=document.getElementById('achList');list.innerHTML='';Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{const div=document.createElement('div');div.className='ach-item'+(unlockedAch.includes(id)?'':' locked');div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`;list.appendChild(div);});}
function toggleAchPanel(){sfx('click');document.getElementById('achPanel').classList.toggle('open');}
function showToast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}t.textContent=msg;t.style.display='block';clearTimeout(t._tid);t._tid=setTimeout(()=>t.style.display='none',3200);}
function launchConfetti(){const colors=['#0e7490','#22d3ee','#b45309','#f59e0b','#06b6d4'];for(let i=0;i<60;i++){const c=document.createElement('div');c.className='confetti-piece';c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`;document.body.appendChild(c);c.addEventListener('animationend',()=>c.remove());}}

// ===================== XP =====================
const lvls=[{t:0,n:'Aprendiz 🌱'},{t:25,n:'Explorador de Patrones 🧭'},{t:55,n:'Domador de Bucles 🔁'},{t:90,n:'Programador Junior 💻'},{t:130,n:'Dibujante de Código 🎨'},{t:165,n:'Ingeniero de Bucles 🏅'},{t:190,n:'Maestro del Código 🏆'}];
function pts(n){xp=Math.max(0,Math.min(MXP,xp+n));updateXPBar();saveProgress();}
function updateXPBar(){const pct=Math.round((xp/MXP)*100);document.getElementById('xpFill').style.width=pct+'%';const el=document.getElementById('xpPts');el.textContent='⭐ '+xp;el.style.transform='scale(1.3)';setTimeout(()=>el.style.transform='',300);let lv=0;for(let i=0;i<lvls.length;i++)if(xp>=lvls[i].t)lv=i;document.getElementById('xpLvl').textContent=lvls[lv].n;if(lv!==prevLevel){if(lv>=2)unlockAchievement('nivel3');if(lv>=5)unlockAchievement('nivel5');prevLevel=lv;}}
function resetXP(){sfx('click');xp=0;updateXPBar();showToast('🔄 XP reiniciado a 0');}
function fin(id,showFX=true){if(!done.has(id)){done.add(id);const b=document.querySelector(`[data-s="${id}"]`);if(b)b.classList.add('done');if(showFX){sfx('up');launchConfetti();}saveProgress();}}
function getProgress(){return Math.round((done.size/TOTAL_SECTIONS)*100);}

// ===================== NAV =====================
function go(id){sfx('click');document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});document.getElementById(id).classList.add('active');const btn=document.querySelector(`[data-s="${id}"]`);if(btn){btn.classList.add('active');btn.setAttribute('aria-selected','true');}window.scrollTo({top:0,behavior:'smooth'});if(id==='s-sopa'){setTimeout(buildSopa,50);}}

// ===================== MINI-QUIZ (tarjetas Aprende / Instrucciones) =====================
function miniQuiz(btn,ok,fbId){const wrap=btn.parentElement;wrap.querySelectorAll('.mq-opt').forEach(b=>b.classList.remove('correct','wrong'));btn.classList.add(ok?'correct':'wrong');const f=document.getElementById(fbId);if(f){f.textContent=ok?'¡Correcto! Así piensa un programador. 🎉':'Todavía no. Vuelve a leer la tarjeta y prueba otra vez.';f.className='mq-fb '+(ok?'ok':'err');}sfx(ok?'ok':'no');if(ok&&!xpTracker.wgt.has('mq_'+fbId)){xpTracker.wgt.add('mq_'+fbId);pts(2);}}

// ===================== FLASHCARD DATA =====================
const fcData=[
  {w:'Bucle',a:'🔁 Repite un <strong>grupo de instrucciones</strong> varias veces sin escribirlas de nuevo.'},
  {w:'REPETIR N VECES',a:'🗣️ La instrucción que <strong>abre el bucle</strong>: dice cuántas <strong>vueltas</strong> dará el cuerpo.'},
  {w:'Cuerpo del bucle',a:'📦 Las instrucciones que van <strong>dentro de los corchetes [ ]</strong> y se repiten en cada vuelta.'},
  {w:'Número de vueltas',a:'#️⃣ La <strong>N</strong> de REPETIR N VECES: cuántas veces se ejecuta el cuerpo completo.'},
  {w:'Vuelta',a:'🌀 Cada <strong>repetición completa</strong> del cuerpo del bucle. ¡Cuéntalas con los dedos!'},
  {w:'Patrón',a:'🧩 Algo que <strong>se repite siguiendo una regla</strong>, como aplaudir 3 veces o los peldaños de una escalera.'},
  {w:'Equivalencia',a:'🔄 AVANZA, AVANZA, AVANZA hace <strong>lo mismo</strong> que REPETIR 3 VECES [AVANZA].'},
  {w:'Rastro',a:'✏️ Las <strong>casillas pintadas</strong> por donde pasa el robot, contando la casilla de salida.'},
  {w:'Cuadrado',a:'🟦 Se dibuja con <strong>REPETIR 4 VECES [AVANZA, GIRA DERECHA]</strong>: lado y esquina, lado y esquina…'},
  {w:'Línea recta',a:'📏 Se dibuja con <strong>REPETIR N VECES [AVANZA]</strong>: el rastro pinta N más 1 casillas.'},
  {w:'Compactar',a:'🗜️ Convertir un <strong>programa largo</strong> en un bucle corto que hace exactamente lo mismo.'},
  {w:'Expandir',a:'📜 Escribir la <strong>lista completa</strong> de instrucciones que el bucle ejecuta, vuelta por vuelta.'},
  {w:'Ahorro',a:'💰 Las instrucciones que <strong>dejas de escribir</strong> gracias al bucle: escribes 2 y el robot ejecuta 10.'},
  {w:'Bucle anidado',a:'🎁 Un <strong>bucle dentro de otro bucle</strong>: repite un patrón que ya se repite (nivel avanzado).'},
];
let fcIdx=0;
function upFC(){document.getElementById('fcInner').classList.remove('flipped');document.getElementById('fcW').textContent=fcData[fcIdx].w;document.getElementById('fcA').innerHTML=fcData[fcIdx].a;document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length;}
function flipCard(){sfx('flip');document.getElementById('fcInner').classList.toggle('flipped');if(!xpTracker.fc.has(fcIdx)){xpTracker.fc.add(fcIdx);pts(1);}if(xpTracker.fc.size===fcData.length){fin('s-flash');unlockAchievement('flash_master');}}
function nextFC(){sfx('click');fcIdx=(fcIdx+1)%fcData.length;upFC();}
function prevFC(){sfx('click');fcIdx=(fcIdx-1+fcData.length)%fcData.length;upFC();}

// ===================== JUEGO: MEMORIA DEL CÓDIGO =====================
const memoPairs=[
  {id:'bucle',t:'Bucle',d:'🔁 Repite un grupo de instrucciones varias veces'},
  {id:'cuerpo',t:'Cuerpo del bucle',d:'📦 Lo que va dentro de los corchetes [ ]'},
  {id:'vueltas',t:'Número de vueltas',d:'#️⃣ La N de REPETIR N VECES'},
  {id:'patron',t:'Patrón',d:'🧩 Algo que se repite siguiendo una regla'},
  {id:'cuadrado',t:'Cuadrado',d:'🟦 REPETIR 4 VECES [AVANZA, GIRA DERECHA]'},
  {id:'rastro',t:'Rastro',d:'✏️ Las casillas pintadas por donde pasa el robot'}
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
  {q:'¿Qué es un bucle en programación?',o:['a) Un dibujo del robot','b) Repetir un grupo de instrucciones varias veces','c) Una casilla pintada','d) Un error del programa'],c:1},
  {q:'En REPETIR 4 VECES [AVANZA], ¿qué indica el número 4?',o:['a) Las casillas del mapa','b) Los giros del robot','c) El número de vueltas que da el bucle','d) La velocidad del robot'],c:2},
  {q:'¿Cómo se llama lo que va dentro de los corchetes [ ] del bucle?',o:['a) El cuerpo del bucle','b) La cabeza del bucle','c) El rastro','d) La vuelta'],c:0},
  {q:'¿Qué programa hace LO MISMO que AVANZA, AVANZA, AVANZA?',o:['a) REPETIR 2 VECES [AVANZA]','b) REPETIR 3 VECES [AVANZA]','c) REPETIR 3 VECES [GIRA DERECHA]','d) AVANZA'],c:1},
  {q:'¿Para qué sirve un bucle?',o:['a) Para que el robot camine más rápido','b) Para borrar el programa','c) Para pintar la cuadrícula de colores','d) Para ahorrar instrucciones escritas'],c:3},
  {q:'¿Qué figura dibuja REPETIR 4 VECES [AVANZA, GIRA DERECHA]?',o:['a) Una línea recta','b) Una escalera','c) Un cuadrado','d) Un círculo'],c:2},
  {q:'¿Cuántas instrucciones EJECUTA en total el robot con REPETIR 3 VECES [AVANZA, GIRA DERECHA]?',o:['a) 2','b) 3','c) 5','d) 6'],c:3},
  {q:'El robot ejecuta REPETIR 2 VECES [GIRA DERECHA]. ¿Qué le pasa?',o:['a) Da la media vuelta: queda mirando al lado contrario','b) Avanza dos casillas','c) Se sale del mapa','d) No le pasa nada'],c:0},
  {q:'¿Qué es un patrón?',o:['a) Un tipo de robot','b) Algo que se repite siguiendo una regla','c) Una casilla con árbol','d) El nombre del programa'],c:1},
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
  {label:['Se repite (patrón)','No se repite'],headA:'🔁 Se repite (patrón)',headB:'1️⃣ No se repite',colA:'rep',colB:'no',
   words:[{w:'Aplaudir 3 veces',t:'rep'},{w:'Dar 20 pasos',t:'rep'},{w:'Remar y remar hasta la orilla',t:'rep'},{w:'El estribillo de una canción',t:'rep'},{w:'Palmear las tortillas una por una',t:'rep'},{w:'Firmar el diploma una vez',t:'no'},{w:'Cortar el listón de inauguración',t:'no'},{w:'Apagar la luz al salir',t:'no'},{w:'Encender el comal',t:'no'},{w:'Abrir la puerta de la escuela',t:'no'}]},
  {label:['Cuerpo del bucle','Número de vueltas'],headA:'📦 Cuerpo del bucle',headB:'#️⃣ Número de vueltas',colA:'cuerpo',colB:'n',
   words:[{w:'AVANZA',t:'cuerpo'},{w:'4',t:'n'},{w:'GIRA DERECHA',t:'cuerpo'},{w:'6 veces',t:'n'},{w:'AVANZA, GIRA DERECHA',t:'cuerpo'},{w:'2',t:'n'},{w:'GIRA IZQUIERDA',t:'cuerpo'},{w:'5 veces',t:'n'}]},
  {label:['Programa con bucle','Programa sin bucle'],headA:'🔁 Programa con bucle',headB:'📜 Programa sin bucle',colA:'con',colB:'sin',
   words:[{w:'REPETIR 5 VECES [AVANZA]',t:'con'},{w:'AVANZA, AVANZA',t:'sin'},{w:'REPETIR 2 VECES [GIRA DERECHA]',t:'con'},{w:'AVANZA, GIRA DERECHA, AVANZA',t:'sin'},{w:'REPETIR 4 VECES [AVANZA, GIRA DERECHA]',t:'con'},{w:'GIRA IZQUIERDA, AVANZA',t:'sin'},{w:'REPETIR 3 VECES [AVANZA, AVANZA]',t:'con'},{w:'GIRA DERECHA, GIRA DERECHA',t:'sin'}]},
  {label:['Bucle bien escrito','Bucle con error'],headA:'✅ Bucle bien escrito',headB:'🐛 Bucle con error',colA:'ok',colB:'err',
   words:[{w:'REPETIR 4 VECES [AVANZA, GIRA DERECHA] para un cuadrado',t:'ok'},{w:'REPETIR 3 VECES [AVANZA, GIRA DERECHA] para un cuadrado',t:'err'},{w:'REPETIR 4 VECES [AVANZA] para una línea de 5 casillas',t:'ok'},{w:'REPETIR 4 VECES [GIRA DERECHA] para una línea recta',t:'err'},{w:'REPETIR 2 VECES [GIRA DERECHA] para la media vuelta',t:'ok'},{w:'REPETIR 3 VECES [GIRA DERECHA] para la media vuelta',t:'err'},{w:'REPETIR 4 VECES [GIRA DERECHA] para la vuelta completa',t:'ok'},{w:'REPETIR 0 VECES [AVANZA] para avanzar',t:'err'}]},
];
let currentClassGroupIdx=0,clsSelectedWord=null;
function buildClass(){const group=classGroups[currentClassGroupIdx];document.getElementById('col-left-head').textContent=group.headA;document.getElementById('col-right-head').textContent=group.headB;const bank=document.getElementById('clsBank');bank.innerHTML='';clsSelectedWord=null;document.getElementById('items-left').innerHTML='';document.getElementById('items-right').innerHTML='';_shuffle([...group.words]).forEach(w=>{const el=document.createElement('div');el.className='wb-item';el.textContent=w.w;el.dataset.t=w.t;el.onclick=()=>{document.querySelectorAll('.wb-item').forEach(i=>i.classList.remove('sel-word'));el.classList.add('sel-word');clsSelectedWord=el;sfx('click');};bank.appendChild(el);});['col-left','col-right'].forEach(colId=>{const col=document.getElementById(colId);col.onclick=(e)=>{if(!clsSelectedWord||e.target.classList.contains('drop-item'))return;const targetId=colId==='col-left'?'items-left':'items-right';const wordsCol=document.getElementById(targetId);const item=document.createElement('div');item.className='drop-item';item.textContent=clsSelectedWord.textContent;item.dataset.t=clsSelectedWord.dataset.t;const original=clsSelectedWord;item.onclick=(ev)=>{ev.stopPropagation();if(clsSelectedWord!==null){col.click();}else{document.getElementById('clsBank').appendChild(original);original.classList.remove('sel-word');item.remove();if(typeof sfx==='function')sfx('click');}};wordsCol.appendChild(item);clsSelectedWord.remove();clsSelectedWord=null;sfx('click');};});}
function checkClass(){const remaining=document.querySelectorAll('#clsBank .wb-item').length;if(remaining>0){fb('fbCls','Mueve todas las palabras a las columnas primero.',false);return;}const group=classGroups[currentClassGroupIdx];let allOk=true;document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{const inLeft=el.parentElement.id==='items-left';const expectedType=inLeft?group.colA:group.colB;if(el.dataset.t===expectedType){el.classList.add('cls-ok');}else{el.classList.add('cls-no');allOk=false;}});if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);}if(allOk){fb('fbCls','¡Perfecto! +5 XP',true);sfx('fan');fin('s-clasifica');unlockAchievement('clasif_pro');}else{fb('fbCls','Hay errores. Marcados en rojo.',false);sfx('no');}}
function nextClassGroup(){sfx('click');currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length;buildClass();document.getElementById('fbCls').classList.remove('show');showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]);}
function resetClass(){sfx('click');buildClass();document.getElementById('fbCls').classList.remove('show');}

// ===================== IDENTIFICAR (¿cuántas vueltas da?) =====================
const idData=[
  {s:['REPETIR','4','VECES','[','AVANZA',']'],c:1,art:'El número de vueltas que da este bucle'},
  {s:['REPETIR','6','VECES','[','GIRA','DERECHA',']'],c:1,art:'Cuántas vueltas da el bucle'},
  {s:['Para','compactar','AVANZA,','AVANZA,','AVANZA','se','usa','REPETIR','3','VECES','[','AVANZA',']'],c:8,art:'El número de vueltas del bucle equivalente'},
  {s:['El','cuadrado','se','dibuja','con','REPETIR','4','VECES','[','AVANZA,','GIRA','DERECHA',']'],c:6,art:'Cuántas vueltas necesita el cuadrado'},
  {s:['La','media','vuelta','es','REPETIR','2','VECES','[','GIRA','DERECHA',']'],c:5,art:'El número de vueltas de la media vuelta'},
  {s:['REPETIR','5','VECES','[','AVANZA',']','pinta','6','casillas','contando','la','salida'],c:1,art:'Cuántas vueltas da el bucle (no cuántas casillas pinta)'},
  {s:['El','robot','muestra','vuelta','2','de','3','al','repetir','el','cuerpo'],c:6,art:'El TOTAL de vueltas que dará el bucle'},
  {s:['REPETIR','2','VECES','[','AVANZA,','AVANZA',']','ejecuta','4','instrucciones'],c:1,art:'Cuántas vueltas da el bucle (no cuántas instrucciones ejecuta)'},
];
let idIdx=0,idDone=false;
function showId(){idDone=false;if(idIdx>=idData.length){document.getElementById('idSent').innerHTML='🎉 ¡Completado!';fin('s-identifica');unlockAchievement('id_master');return;}const d=idData[idIdx];document.getElementById('idProg').textContent=`Oración ${idIdx+1} de ${idData.length}`;document.getElementById('idInfo').textContent=`Busca: ${d.art}`;const sent=document.getElementById('idSent');sent.innerHTML='';d.s.forEach((w,i)=>{const span=document.createElement('span');span.className='id-word';span.textContent=w+' ';span.onclick=()=>checkId(i,span);sent.appendChild(span);});}
function checkId(i,span){if(idDone)return;document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected'));span.classList.add('selected');if(i===idData[idIdx].c){idDone=true;span.classList.add('id-ok');fb('fbId','¡Correcto! +5 XP',true);if(!xpTracker.id.has(idIdx)){xpTracker.id.add(idIdx);pts(5);}sfx('ok');}else{span.classList.add('id-no');fb('fbId','Ese no es el término solicitado.',false);sfx('no');}}
function nextId(){sfx('click');idIdx++;showId();document.getElementById('fbId').classList.remove('show');}
function resetId(){sfx('click');idIdx=0;showId();document.getElementById('fbId').classList.remove('show');}

// ===================== COMPLETA =====================
const cmpData=[
  {s:'Repetir un grupo de instrucciones varias veces se logra con un ___.',opts:['bucle','rastro','giro'],c:0},
  {s:'Las instrucciones que van dentro de los corchetes [ ] forman el ___ del bucle.',opts:['número','cuerpo','borde'],c:1},
  {s:'En REPETIR N VECES, la N indica el número de ___.',opts:['casillas','robots','vueltas'],c:2},
  {s:'AVANZA, AVANZA, AVANZA equivale a REPETIR ___ VECES [AVANZA].',opts:['3','2','4'],c:0},
  {s:'Para dibujar un cuadrado: REPETIR 4 VECES [AVANZA, GIRA ___].',opts:['IZQUIERDA y AVANZA','DERECHA','ARRIBA'],c:1},
  {s:'Algo que se repite siguiendo una regla es un ___.',opts:['bug','rastro','patrón'],c:2},
  {s:'Las casillas pintadas por donde pasa el robot forman su ___.',opts:['rastro','cuerpo','vuelta'],c:0},
  {s:'Gracias al bucle, el programa queda más ___ de escribir.',opts:['largo','corto','difícil'],c:1},
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
// Widget 1: Compacta el programa (programa largo → elegir el bucle equivalente; IDs estándar «neuron»)
function _loopTxt(rep,body){return `REPETIR ${rep} VECES [${body.join(', ')}]`;}
const _cmpctDefs=[
  {largo:[I_AV,I_AV,I_AV,I_AV],rep:4,body:[I_AV]},
  {largo:[I_GD,I_GD,I_GD],rep:3,body:[I_GD]},
  {largo:[I_AV,I_GD,I_AV,I_GD,I_AV,I_GD],rep:3,body:[I_AV,I_GD]},
  {largo:[I_AV,I_AV,I_AV,I_AV,I_AV,I_AV],rep:6,body:[I_AV]},
  {largo:[I_AV,I_AV,I_GI,I_AV,I_AV,I_GI],rep:2,body:[I_AV,I_AV,I_GI]},
  {largo:[I_GD,I_AV,I_GD,I_AV],rep:2,body:[I_GD,I_AV]},
  {largo:[I_AV,I_AV,I_AV,I_GD,I_AV,I_AV,I_AV,I_GD],rep:2,body:[I_AV,I_AV,I_AV,I_GD]},
  {largo:[I_AV,I_AV,I_AV,I_AV,I_AV],rep:5,body:[I_AV]},
];
const neuronPartes=_cmpctDefs.map(d=>{
  const ans=_loopTxt(d.rep,d.body);
  const cambio=d.body[0]===I_AV?I_GD:I_AV;
  const malos=[_loopTxt(d.rep+1,d.body),_loopTxt(d.rep-1<2?d.rep+2:d.rep-1,d.body),_loopTxt(d.rep,[cambio].concat(d.body.slice(1)))];
  return{desc:`<div>Programa largo (${d.largo.length} instrucciones escritas):</div><div class="w-prog">${d.largo.map((p,i)=>(i+1)+'. '+p).join('<br>')}</div><div style="margin-top:0.4rem;">¿Qué bucle hace <strong>exactamente lo mismo</strong>?</div>`,ans,opts:[ans,...malos]};
});
let neuronIdx=0,neuronDone=false;
function showNeuron(){neuronDone=false;if(neuronIdx>=neuronPartes.length){const el=document.getElementById('neuronDesc');if(el)el.innerHTML='🎉 ¡Compactaste todos los programas!';const opts=document.getElementById('neuronOpts');if(opts)opts.innerHTML='';fin('s-widgets');unlockAchievement('widgets_master');return;}const d=neuronPartes[neuronIdx];const prog=document.getElementById('neuronProg');if(prog)prog.textContent=`Programa ${neuronIdx+1} de ${neuronPartes.length}`;const desc=document.getElementById('neuronDesc');if(desc)desc.innerHTML=d.desc;const opts=document.getElementById('neuronOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=opt;b.onclick=()=>checkNeuron(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuron');if(fbEl)fbEl.classList.remove('show');}
function checkNeuron(opt,btn,d){if(neuronDone)return;neuronDone=true;document.querySelectorAll('#neuronOpts .cmp-opt').forEach(b=>{if(b.textContent===d.ans)b.classList.add('correct');else if(b===btn&&b.textContent!==d.ans)b.classList.add('wrong');});const isOk=opt===d.ans;if(isOk){fb('fbNeuron','¡Programa compactado! +3 XP',true);if(!xpTracker.wgt.has('neuron_'+neuronIdx)){xpTracker.wgt.add('neuron_'+neuronIdx);pts(3);}sfx('ok');}else{fb('fbNeuron','El bucle equivalente es: '+d.ans,false);sfx('no');}}
function nextNeuron(){sfx('click');neuronIdx++;showNeuron();}
function resetNeuron(){sfx('click');neuronIdx=0;showNeuron();}

// Widget 2: ¿Qué dibuja? (mini-cuadrícula 3×3 estática + bucle corto → elegir la figura; IDs estándar «neuro»)
const _dibujaDefs=[
  {start:{r:2,c:0,dir:'N'},prog:[{rep:2,body:[I_AV]}],ans:'Una línea vertical de 3 casillas'},
  {start:{r:2,c:0,dir:'N'},prog:[{rep:4,body:[I_AV,I_GD]}],ans:'Un cuadrado de 4 casillas (2×2)'},
  {start:{r:2,c:0,dir:'E'},prog:[{rep:2,body:[I_AV]}],ans:'Una línea horizontal de 3 casillas'},
  {start:{r:2,c:0,dir:'N'},prog:[{rep:2,body:[I_AV,I_GD,I_AV,I_GI]}],ans:'Una escalera de 5 casillas'},
  {start:{r:0,c:2,dir:'O'},prog:[{rep:2,body:[I_AV]}],ans:'Una línea horizontal de 3 casillas'},
];
const _dibujaOpts=['Una línea vertical de 3 casillas','Una línea horizontal de 3 casillas','Un cuadrado de 4 casillas (2×2)','Una escalera de 5 casillas'];
const neuroPairs=_dibujaDefs.map(d=>({
  trans:`<div>El robot parte de <strong>${coordName(d.start.r,d.start.c)}</strong> mirando al <strong>${DIR_NOMBRE[d.start.dir]}</strong> y ejecuta:</div><div class="w-prog">${progLineas(d.prog).map((p,i)=>(i+1)+'. '+p).join('<br>')}</div><div style="display:flex;justify-content:center;margin-top:0.4rem;">${svgGridHTML({n:3,robot:d.start,w:130,dots:false})}</div>`,
  func:d.ans,
  opts:[..._dibujaOpts]
}));
let neuroIdx=0,neuroDone=false;
function showNeuro(){neuroDone=false;if(neuroIdx>=neuroPairs.length){const el=document.getElementById('neuroTrans');if(el)el.innerHTML='🎉 ¡Adivinaste todos los dibujos!';const opts=document.getElementById('neuroOpts');if(opts)opts.innerHTML='';fin('s-widgets');return;}const d=neuroPairs[neuroIdx];const prog=document.getElementById('neuroProg');if(prog)prog.textContent=`${neuroIdx+1} de ${neuroPairs.length}`;const trans=document.getElementById('neuroTrans');if(trans)trans.innerHTML=d.trans;const opts=document.getElementById('neuroOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkNeuro(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuro');if(fbEl)fbEl.classList.remove('show');}
function checkNeuro(opt,btn,d){if(neuroDone)return;neuroDone=true;document.querySelectorAll('#neuroOpts .qz-opt').forEach(b=>{if(b.textContent===d.func)b.classList.add('correct');else if(b===btn&&b.textContent!==d.func)b.classList.add('wrong');});const isOk=opt===d.func;if(isOk){fb('fbNeuro','¡Correcto! Trazaste el rastro con la mente. +3 XP',true);if(!xpTracker.wgt.has('neuro_'+neuroIdx)){xpTracker.wgt.add('neuro_'+neuroIdx);pts(3);}sfx('ok');}else{fb('fbNeuro','El bucle dibuja: '+d.func,false);sfx('no');}setTimeout(()=>{neuroIdx++;showNeuro();},1800);}
function resetNeuro(){sfx('click');neuroIdx=0;showNeuro();}

// Widget 3: Detective del bug (bucle con N errado o cuerpo errado; IDs estándar «enfer»)
const enfermedadData=[
  {meta:'Pintar una línea recta de 5 casillas (contando la de salida)',prog:'REPETIR 3 VECES [AVANZA]',
   characteristic:'El número de vueltas (N) está errado',pista:'Con 3 vueltas pinta solo 4 casillas: deben ser 4 vueltas.'},
  {meta:'Dibujar un cuadrado girando en cada esquina',prog:'REPETIR 4 VECES [AVANZA, AVANZA]',
   characteristic:'El cuerpo del bucle está errado',pista:'Sin GIRA DERECHA nunca dobla: falta el giro en el cuerpo.'},
  {meta:'Pintar una línea recta de 4 casillas (contando la de salida)',prog:'REPETIR 3 VECES [AVANZA]',
   characteristic:'No tiene ningún error',pista:'3 vueltas + la casilla de salida = 4 casillas pintadas. ¡Perfecto!'},
  {meta:'Dibujar un cuadrado completo',prog:'REPETIR 3 VECES [AVANZA, GIRA DERECHA]',
   characteristic:'El número de vueltas (N) está errado',pista:'El cuadrado tiene 4 lados: deben ser 4 vueltas.'},
  {meta:'Dibujar una escalera que sube en diagonal',prog:'REPETIR 2 VECES [AVANZA, GIRA DERECHA, AVANZA, GIRA DERECHA]',
   characteristic:'El cuerpo del bucle está errado',pista:'El segundo giro debe ser GIRA IZQUIERDA para volver a subir.'},
  {meta:'Dar la media vuelta (quedar mirando al lado contrario)',prog:'REPETIR 2 VECES [GIRA DERECHA]',
   characteristic:'No tiene ningún error',pista:'Dos giros a la derecha son exactamente la media vuelta.'},
];
const _bugOpts=['El número de vueltas (N) está errado','El cuerpo del bucle está errado','No tiene ningún error'];
let enferIdx=0,enferDone=false;
function showEnfer(){enferDone=false;if(enferIdx>=enfermedadData.length){const el=document.getElementById('enferDisease');if(el)el.textContent='🎉 ¡Todos los bugs atrapados!';const opts=document.getElementById('enferOpts');if(opts)opts.innerHTML='';return;}const d=enfermedadData[enferIdx];const prog=document.getElementById('enferProg');if(prog)prog.textContent=`${enferIdx+1} de ${enfermedadData.length}`;const dis=document.getElementById('enferDisease');if(dis)dis.innerHTML=`<div style="font-size:0.85rem;">🎯 Meta: <strong>${d.meta}</strong></div><div class="w-prog" style="margin-top:0.4rem;">${d.prog}</div>`;const opts=document.getElementById('enferOpts');if(!opts)return;opts.innerHTML='';_shuffle([..._bugOpts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkEnfer(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbEnfer');if(fbEl)fbEl.classList.remove('show');}
function checkEnfer(opt,btn,d){if(enferDone)return;enferDone=true;document.querySelectorAll('#enferOpts .qz-opt').forEach(b=>{if(b.textContent===d.characteristic)b.classList.add('correct');else if(b===btn&&b.textContent!==d.characteristic)b.classList.add('wrong');});const isOk=opt===d.characteristic;if(isOk){fb('fbEnfer','¡Bug atrapado! '+d.pista+' +3 XP',true);if(!xpTracker.wgt.has('enfer_'+enferIdx)){xpTracker.wgt.add('enfer_'+enferIdx);pts(3);}sfx('ok');}else{fb('fbEnfer',d.characteristic+'. '+d.pista,false);sfx('no');}setTimeout(()=>{enferIdx++;showEnfer();},2200);}
function resetEnfer(){sfx('click');enferIdx=0;showEnfer();}

// ===================== RETO FINAL =====================
const retoPairs=[
  {label:['Se repite (patrón)','No se repite'],btnA:'🔁 Se repite',btnB:'1️⃣ No se repite',colA:'rep',colB:'no',
   words:[{w:'Aplaudir 3 veces',t:'rep'},{w:'Dar 20 pasos',t:'rep'},{w:'Remar y remar',t:'rep'},{w:'El estribillo de la canción',t:'rep'},{w:'Palmear tortilla por tortilla',t:'rep'},{w:'Firmar el diploma una vez',t:'no'},{w:'Cortar el listón',t:'no'},{w:'Apagar la luz al salir',t:'no'},{w:'Encender el comal',t:'no'},{w:'Abrir la puerta',t:'no'}]},
  {label:['Programa con bucle','Programa sin bucle'],btnA:'🔁 Con bucle',btnB:'📜 Sin bucle',colA:'con',colB:'sin',
   words:[{w:'REPETIR 5 VECES [AVANZA]',t:'con'},{w:'AVANZA, AVANZA',t:'sin'},{w:'REPETIR 2 VECES [GIRA DERECHA]',t:'con'},{w:'AVANZA, GIRA DERECHA, AVANZA',t:'sin'},{w:'REPETIR 4 VECES [AVANZA, GIRA DERECHA]',t:'con'},{w:'GIRA IZQUIERDA, AVANZA',t:'sin'},{w:'REPETIR 3 VECES [AVANZA, AVANZA]',t:'con'},{w:'AVANZA',t:'sin'},{w:'REPETIR 6 VECES [GIRA IZQUIERDA]',t:'con'},{w:'GIRA DERECHA, GIRA DERECHA',t:'sin'}]},
  {label:['Cuerpo del bucle','Número de vueltas'],btnA:'📦 Cuerpo',btnB:'#️⃣ Vueltas',colA:'cuerpo',colB:'n',
   words:[{w:'AVANZA',t:'cuerpo'},{w:'4',t:'n'},{w:'GIRA DERECHA',t:'cuerpo'},{w:'6 veces',t:'n'},{w:'AVANZA, GIRA DERECHA',t:'cuerpo'},{w:'2',t:'n'},{w:'GIRA IZQUIERDA',t:'cuerpo'},{w:'5 veces',t:'n'},{w:'AVANZA, AVANZA',t:'cuerpo'},{w:'3',t:'n'}]},
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
const _tareaBodies=[[I_AV],[I_GD],[I_GI],[I_AV,I_GD],[I_AV,I_GI],[I_GD,I_AV],[I_AV,I_AV,I_GD]];
let ansVisible=false;
function genTask(){sfx('click');const type=document.getElementById('tgType').value;const count=parseInt(document.getElementById('tgCount').value);ansVisible=false;const out=document.getElementById('tgOut');out.innerHTML='';if(type==='compacta')genCompactaTask(out,count);else if(type==='expande')genExpandeTask(out,count);else if(type==='dibujo')genDibujoTask(out,count);else if(type==='ahorro')genAhorroTask(out,count);fin('s-tareas');}
function _instrBlock(out,title,lines){const ib=document.createElement('div');ib.className='tg-instruction-block';ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join('');out.appendChild(ib);}
function genCompactaTask(out,count){_instrBlock(out,'Instrucción',['Copia el programa largo en tu cuaderno y escríbelo COMPACTO con un bucle: REPETIR N VECES [cuerpo]. Busca primero el patrón que se repite y cuenta cuántas veces aparece.']);for(let i=0;i<count;i++){const body=_tareaBodies[_rndInt(0,_tareaBodies.length-1)];const n=_rndInt(2,6);const largo=[];for(let v=0;v<n;v++)body.forEach(b=>largo.push(b));const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><div class="tg-prog">${largo.map((p,j)=>(j+1)+'. '+p).join('<br>')}</div><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ REPETIR ${n} VECES [${body.join(', ')}]</div></div>`;out.appendChild(div);}}
function genExpandeTask(out,count){_instrBlock(out,'Instrucción',['Copia el bucle en tu cuaderno y escríbelo EXPANDIDO: la lista completa de instrucciones que el robot ejecuta, en orden y numeradas. Cuenta las vueltas con los dedos.']);for(let i=0;i<count;i++){const body=_tareaBodies[_rndInt(0,_tareaBodies.length-1)];const n=_rndInt(2,5);const flat=[];for(let v=0;v<n;v++)body.forEach(b=>flat.push(b));const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><div class="tg-prog">REPETIR ${n} VECES [${body.join(', ')}]</div><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${flat.map((p,j)=>(j+1)+'. '+p).join(' · ')} (${flat.length} instrucciones ejecutadas)</div></div>`;out.appendChild(div);}}
function genDibujoTask(out,count){_instrBlock(out,'Instrucción',['Dibuja una cuadrícula de 5×5 en tu cuaderno cuadriculado (columnas A–E, filas 1–5), marca la casilla de salida y PINTA todas las casillas por donde pasa el robot al ejecutar el bucle (contando la de salida). Escribe también el nombre de la figura que quedó dibujada.']);for(let i=0;i<count;i++){const tipo=_rndInt(0,2);let start,prog,figura;if(tipo===0){const k=_rndInt(3,4);const c=_rndInt(0,4);start={r:4,c,dir:'N'};prog=[{rep:k,body:[I_AV]}];figura=`una línea vertical de ${k+1} casillas`;}else if(tipo===1){const k=_rndInt(3,4);const r=_rndInt(0,4);start={r,c:0,dir:'E'};prog=[{rep:k,body:[I_AV]}];figura=`una línea horizontal de ${k+1} casillas`;}else{const lado=_rndInt(1,2);start={r:3,c:1,dir:'N'};prog=[{rep:4,body:Array(lado).fill(I_AV).concat([I_GD])}];figura=lado===1?'un cuadrado de 4 casillas (2×2)':'un cuadrado de 8 casillas (3×3)';}const res=simTrail(start,prog,5);const cells=Array.from(res.trail).map(k=>{const p=k.split(',');return coordName(Number(p[0]),Number(p[1]));}).join(', ');const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>El robot sale de ${coordName(start.r,start.c)} mirando al ${DIR_NOMBRE[start.dir]}.</strong><div class="tg-prog">${progLineas(prog).join('<br>')}</div><div style="margin-top:0.4rem;font-size:0.85rem;">¿Qué casillas quedan pintadas y qué figura es? <span class="tg-blank">&nbsp;</span></div><div class="tg-answer">✅ Pinta ${res.trail.size} casillas (${cells}): ${figura}</div></div>`;out.appendChild(div);}}
function genAhorroTask(out,count){_instrBlock(out,'Instrucción',['Para cada bucle escribe tres números: (a) cuántas instrucciones ESCRIBES (la línea REPETIR cuenta 1 y cada instrucción del cuerpo cuenta 1), (b) cuántas instrucciones EJECUTA el robot en total y (c) cuántas instrucciones te AHORRAS frente al programa largo (b menos a).']);for(let i=0;i<count;i++){const body=_tareaBodies[_rndInt(0,_tareaBodies.length-1)];const n=_rndInt(3,6);const escritas=1+body.length;const ejecutadas=n*body.length;const ahorro=ejecutadas-escritas;const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><div class="tg-prog">REPETIR ${n} VECES [${body.join(', ')}]</div><div style="margin-top:0.4rem;font-size:0.85rem;">a) Escritas: <span class="tg-blank">&nbsp;</span> · b) Ejecutadas: <span class="tg-blank">&nbsp;</span> · c) Ahorradas: <span class="tg-blank">&nbsp;</span></div><div class="tg-answer">✅ a) ${escritas} escritas · b) ${ejecutadas} ejecutadas · c) ${ahorro} ahorradas</div></div>`;out.appendChild(div);}}
function toggleAns(){ansVisible=!ansVisible;document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none');sfx('click');}

// ===================== SOPA DE LETRAS =====================
const sopaSets=[
  {size:10,grid:[
    ['M','E','U','B','B','C','R','P','Z','P'],
    ['S','V','X','U','Z','B','I','A','E','P'],
    ['K','K','C','N','B','B','T','T','M','H'],
    ['K','L','S','K','I','P','E','R','O','F'],
    ['E','J','Z','H','L','G','P','O','P','I'],
    ['A','T','L','E','U','V','E','N','R','G'],
    ['R','I','O','Q','A','D','R','E','E','U'],
    ['V','D','V','F','Q','V','T','V','U','R'],
    ['C','C','T','F','C','I','C','W','C','A'],
    ['Q','S','P','T','S','J','T','F','F','D']
  ],words:[
    {w:'BUCLE',cells:[[0,4],[1,3],[2,2],[3,1],[4,0]]},
    {w:'REPETIR',cells:[[6,6],[5,6],[4,6],[3,6],[2,6],[1,6],[0,6]]},
    {w:'VUELTA',cells:[[5,5],[5,4],[5,3],[5,2],[5,1],[5,0]]},
    {w:'CUERPO',cells:[[8,8],[7,8],[6,8],[5,8],[4,8],[3,8]]},
    {w:'PATRON',cells:[[0,7],[1,7],[2,7],[3,7],[4,7],[5,7]]},
    {w:'FIGURA',cells:[[3,9],[4,9],[5,9],[6,9],[7,9],[8,9]]}
  ]},
  {size:10,grid:[
    ['O','X','I','S','V','E','C','E','S','K'],
    ['O','A','H','O','R','R','A','O','G','X'],
    ['L','Z','C','N','J','R','C','R','O','B'],
    ['P','G','M','U','O','U','M','T','M','F'],
    ['A','L','G','P','A','L','X','S','Q','T'],
    ['Q','Z','L','L','U','D','C','A','I','M'],
    ['N','S','S','R','I','S','R','R','L','M'],
    ['H','K','M','T','S','N','I','A','Q','M'],
    ['V','S','V','X','I','T','E','H','D','Q'],
    ['O','R','I','G','B','X','C','A','D','O']
  ],words:[
    {w:'CUADRADO',cells:[[2,2],[3,3],[4,4],[5,5],[6,6],[7,7],[8,8],[9,9]]},
    {w:'VECES',cells:[[0,4],[0,5],[0,6],[0,7],[0,8]]},
    {w:'RASTRO',cells:[[6,7],[5,7],[4,7],[3,7],[2,7],[1,7]]},
    {w:'AHORRA',cells:[[1,1],[1,2],[1,3],[1,4],[1,5],[1,6]]},
    {w:'LINEA',cells:[[5,3],[6,4],[7,5],[8,6],[9,7]]},
    {w:'GIRO',cells:[[9,3],[9,2],[9,1],[9,0]]}
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
  {q:'Un bucle repite un grupo de instrucciones varias veces.',a:true},
  {q:'REPETIR 3 VECES [AVANZA] mueve al robot una sola casilla.',a:false},
  {q:'Las instrucciones que van dentro de los corchetes [ ] forman el cuerpo del bucle.',a:true},
  {q:'La N de REPETIR N VECES indica cuántas vueltas da el bucle.',a:true},
  {q:'Un bucle hace que el programa sea más largo de escribir.',a:false},
  {q:'AVANZA, AVANZA, AVANZA hace lo mismo que REPETIR 3 VECES [AVANZA].',a:true},
  {q:'Para dibujar un cuadrado se usa REPETIR 4 VECES [AVANZA, GIRA DERECHA].',a:true},
  {q:'REPETIR 4 VECES [GIRA DERECHA] deja al robot mirando hacia donde empezó.',a:true},
  {q:'El cuerpo del bucle se ejecuta una sola vez sin importar la N.',a:false},
  {q:'Un patrón es algo que se repite siguiendo una regla.',a:true},
  {q:'REPETIR 2 VECES [AVANZA, GIRA DERECHA] ejecuta 4 instrucciones en total.',a:true},
  {q:'Se puede poner un bucle dentro de otro bucle.',a:true},
  {q:'Con REPETIR 10 VECES [AVANZA] escribes 10 instrucciones.',a:false},
  {q:'Si la N del bucle está errada, la figura dibujada sale mal.',a:true},
  {q:'El rastro del robot son las casillas por donde pasa, contando la de salida.',a:true},
];
const evalMCBank=[
  {q:'¿Qué es un bucle en programación?',o:['a) Repetir un grupo de instrucciones varias veces','b) Un dibujo del robot','c) Un error escondido','d) Una casilla pintada'],a:0},
  {q:'¿Qué significa la N en REPETIR N VECES?',o:['a) El número de robots','b) El número de vueltas que da el bucle','c) El número de casillas del mapa','d) El nombre del programa'],a:1},
  {q:'¿Cómo se llama lo que va dentro de los corchetes [ ] del bucle?',o:['a) La cabeza del bucle','b) El rastro','c) El cuerpo del bucle','d) La vuelta'],a:2},
  {q:'¿Qué programa hace LO MISMO que AVANZA, AVANZA, AVANZA?',o:['a) REPETIR 2 VECES [AVANZA]','b) REPETIR 3 VECES [AVANZA]','c) REPETIR 3 VECES [GIRA DERECHA]','d) AVANZA'],a:1},
  {q:'Para dibujar un cuadrado, el robot ejecuta REPETIR ___ VECES [AVANZA, GIRA DERECHA]. ¿Qué número falta?',o:['2','3','4','8'],a:2},
  {q:'¿Cuántas instrucciones EJECUTA en total el robot con REPETIR 3 VECES [AVANZA, GIRA DERECHA]?',o:['a) 2','b) 3','c) 5','d) 6'],a:3},
  {q:'¿Para qué sirve un bucle?',o:['a) Para ahorrar instrucciones escritas','b) Para que el robot camine más rápido','c) Para borrar el programa','d) Para agrandar la cuadrícula'],a:0},
  {q:'El robot ejecuta REPETIR 2 VECES [GIRA DERECHA]. ¿Qué le pasa?',o:['a) Avanza dos casillas','b) Da la media vuelta: queda mirando al lado contrario','c) Se sale del mapa','d) Dibuja un cuadrado'],a:1},
  {q:'¿Cuántas vueltas da el bucle REPETIR 5 VECES [AVANZA]?',o:['a) 1','b) 4','c) 5','d) 6'],a:2},
  {q:'¿Qué es un patrón?',o:['a) Algo que se repite siguiendo una regla','b) Un tipo de robot','c) El final del programa','d) Una casilla con árbol'],a:0},
  {q:'¿Cuántas instrucciones ESCRIBES con REPETIR 8 VECES [AVANZA]? (la línea REPETIR cuenta 1 y el cuerpo cuenta 1)',o:['a) 8','b) 2','c) 9','d) 1'],a:1},
  {q:'¿Qué figura dibuja el rastro de REPETIR 4 VECES [AVANZA, GIRA DERECHA]?',o:['a) Una línea recta','b) Una escalera','c) Un triángulo','d) Un cuadrado'],a:3},
  {q:'¿Qué pasa si la N del bucle está errada?',o:['a) El robot da vueltas de más o de menos y la figura sale mal','b) No pasa nada','c) El robot escribe más instrucciones','d) El programa se vuelve exacto'],a:0},
  {q:'¿Para qué sirve un bucle dentro de otro bucle (bucle anidado)?',o:['a) Para detener el programa','b) Para repetir un patrón que ya se repite, como las filas de un dibujo','c) Para girar más rápido','d) Para borrar el rastro'],a:1},
  {q:'¿Cuál de estas tareas de la vida diaria se parece más a un bucle?',o:['a) Nacer','b) Cortar el listón de inauguración','c) Aplaudir 3 veces','d) Encender el comal una vez'],a:2},
];
const evalCPBank=[
  {q:'Repetir un grupo de instrucciones varias veces se logra con un ___.',a:'bucle'},
  {q:'Las instrucciones que van dentro de los corchetes [ ] forman el ___ del bucle.',a:'cuerpo'},
  {q:'En REPETIR N VECES, la N indica el número de ___.',a:'vueltas'},
  {q:'AVANZA, AVANZA, AVANZA equivale a REPETIR ___ VECES [AVANZA].',a:'3'},
  {q:'Para dibujar un cuadrado: REPETIR 4 VECES [AVANZA, GIRA ___].',a:'derecha'},
  {q:'Algo que se repite siguiendo una regla es un ___.',a:'patrón'},
  {q:'Las casillas pintadas por donde pasa el robot forman su ___.',a:'rastro'},
  {q:'El bucle nos ayuda a ___ instrucciones al escribir el programa.',a:'ahorrar'},
  {q:'Cada repetición completa del cuerpo del bucle se llama ___.',a:'vuelta'},
  {q:'REPETIR 4 VECES [GIRA DERECHA] hace que el robot dé una vuelta ___.',a:'completa'},
  {q:'REPETIR 2 VECES [AVANZA, GIRA DERECHA] ejecuta ___ instrucciones en total.',a:'4'},
  {q:'Un bucle dentro de otro bucle se llama bucle ___.',a:'anidado'},
  {q:'REPETIR 5 VECES [AVANZA] da ___ vueltas.',a:'5'},
  {q:'Gracias al bucle, el programa queda más ___ de escribir.',a:'corto'},
  {q:'El robot va en la vuelta 2 de 4: todavía le faltan ___ vueltas.',a:'2'},
];
const evalPRBank=[
  {term:'Bucle',def:'Repite un grupo de instrucciones varias veces'},
  {term:'REPETIR N VECES',def:'La instrucción que abre el bucle e indica las vueltas'},
  {term:'Cuerpo del bucle',def:'Las instrucciones que van dentro de los corchetes'},
  {term:'Número de vueltas',def:'La N: cuántas veces se repite el cuerpo'},
  {term:'Vuelta',def:'Cada repetición completa del cuerpo'},
  {term:'Patrón',def:'Algo que se repite siguiendo una regla'},
  {term:'Rastro',def:'Las casillas pintadas por donde pasa el robot'},
  {term:'Cuadrado',def:'Se dibuja con REPETIR 4 VECES [AVANZA, GIRA DERECHA]'},
  {term:'Línea recta',def:'Se dibuja con REPETIR N VECES [AVANZA]'},
  {term:'Bucle anidado',def:'Un bucle dentro de otro bucle'},
  {term:'Ahorro',def:'Instrucciones que dejas de escribir gracias al bucle'},
  {term:'Expandir',def:'Escribir la lista completa que el bucle ejecuta'},
  {term:'Compactar',def:'Convertir un programa largo en un bucle corto'},
  {term:'Equivalencia',def:'Programa largo y bucle que hacen exactamente lo mismo'},
  {term:'Vuelta completa',def:'REPETIR 4 VECES [GIRA DERECHA]'},
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

function genEval(){sfx('click');_evalFormaSelector(); const _selF = document.getElementById('evalFormaSel'); if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10))); const cf = evalFormNum; const rng = _evalRng(cf); window._currentEvalForm=cf;evalFormNum = (evalFormNum % EVAL_FORMAS) + 1; _evalFormaSelector();saveProgress();document.getElementById('eval-screen-title').textContent=`🎓 Evaluación Final · Forma ${cf} · Bucles: Repetir sin Cansarse`;evalAnsVisible=false;const out=document.getElementById('evalOut');out.innerHTML='';const bar=document.createElement('div');bar.className='eval-score-bar';bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje · 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25 pts</span><span class="eval-score-pill esp-tf">V/F 25 pts</span><span class="eval-score-pill esp-mc">Selección 25 pts</span><span class="eval-score-pill esp-pr">Pareados 25 pts</span></div>`;out.appendChild(bar);const cpItems=_pickF(evalCPBank,5, rng);const s1=document.createElement('div');s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';cpItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='cp';d.dataset.evalIndex=i;const qHtml=item.q.replace('___',`<input class="eval-cp-input" type="text" data-cp="${i}" autocomplete="off">`);d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbCp${i}" aria-live="polite"></div>`;s1.appendChild(d);});out.appendChild(s1);const tfItems=_pickF(evalTFBank,5, rng);const s2=document.createElement('div');s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';tfItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='tf';d.dataset.evalIndex=i;d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="true"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="false"> Falso</label></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbTf${i}" aria-live="polite"></div>`;s2.appendChild(d);});out.appendChild(s2);const mcItems=_pickF(evalMCBank,5, rng);const s3=document.createElement('div');s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';mcItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='mc';d.dataset.evalIndex=i;const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join('');d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbMc${i}" aria-live="polite"></div>`;s3.appendChild(d);});out.appendChild(s3);const prItems=_pickF(evalPRBank,5, rng);let shuffledDefs=_shuffleF(prItems, rng);let _prTries=0;while(shuffledDefs.some((df,ix)=>df.def===prItems[ix].def)&&_prTries<20){shuffledDefs=_shuffleF(shuffledDefs, rng);_prTries++;}const letters=['A','B','C','D','E'];const s4=document.createElement('div');s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';const matchCard=document.createElement('div');matchCard.className='eval-item';let colLeft='<div class="eval-match-col"><h4>📌 Términos</h4>';prItems.forEach((item,i)=>{colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> <select class="eval-match-select" data-pr="${i}" aria-label="Respuesta pareada ${i+16}"><option value="">—</option>${letters.map(l=>`<option value="${l}">${l}</option>`).join('')}</select> ${item.term}</div>`;});colLeft+='</div>';let colRight='<div class="eval-match-col"><h4>🔑 Definiciones</h4>';shuffledDefs.forEach((item,i)=>{colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`;});colRight+='</div>';const ansKey=prItems.map((item,i)=>{const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)];return`${i+16}→${letter}`;}).join(' · ');matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div><div class="eval-item-feedback" id="evalFbPr" aria-live="polite"></div>`;s4.appendChild(matchCard);out.appendChild(s4);window._evalPrintData={tf:tfItems,mc:mcItems,cp:cpItems,pr:{terms:prItems,shuffledDefs,letters}};const autoPanel=document.createElement('div');autoPanel.id='evalAutoResult';autoPanel.className='eval-auto-result';autoPanel.innerHTML='<strong>🧮 Evaluación interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato original sin respuestas digitadas.';out.appendChild(autoPanel);fin('s-evaluacion');}
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación Bucles: Repetir sin Cansarse · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.12rem 0.4rem;margin:0.22rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #0e7490;background:#ecfeff;color:#0e7490;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#0e7490;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #0e7490;height:12px;}.obt-pct{white-space:nowrap;}.qn{font-weight:700;min-width:22px;flex-shrink:0;}.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:40px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.18rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.14rem 0.35rem;margin-bottom:0.1rem;break-inside:avoid;page-break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.3;display:flex;gap:0.28rem;margin-bottom:0.07rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.1rem 0.5rem;}.mc-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:0.04rem 0.15rem;margin-left:0.8rem;}.mc-opt{font-size:9pt;display:flex;align-items:center;gap:0.15rem;}.mc-opt input{width:10px;height:10px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{margin-top:0.1rem;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.08rem 0.4rem;margin-top:0.08rem;}.pr-head{font-size:9pt;font-weight:700;color:#555;margin-bottom:0.1rem;}.pr-item{font-size:10.5pt;padding:0.1rem 0.28rem;background:#ecfeff;border-radius:3px;margin-bottom:0.07rem;display:flex;align-items:center;gap:0.2rem;line-height:1.2;break-inside:avoid;page-break-inside:avoid;}.pr-num{font-weight:700;color:#0e7490;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.22rem;padding:0.15rem 0;page-break-before:avoid;break-before:avoid;color:#0e7490;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #0e7490;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#555;}.pa{color:#007a00;font-weight:600;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · Bucles: Repetir sin Cansarse · Educación Básica · Programación</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Evaluación Final · Bucles: Repetir sin Cansarse · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u · Programación · Educación Básica</div></div><div class="p-grid">${pR}</div>
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
const OP_BODIES=[[I_AV],[I_AV,I_GD],[I_AV,I_GI],[I_GD,I_AV],[I_AV,I_AV,I_GD]];

// I. Ejecuta el bucle (5 × 4 = 20 pts): cuadrícula 4×4 determinista + programa con REPETIR;
//    el alumno marca (en línea) o escribe (impreso) la casilla donde TERMINA el robot.
function genEjecutaItems(){
  const items=[];
  let guard=0;
  while(items.length<5&&guard<900){
    guard++;
    const sr=_opRint(0,3),sc=_opRint(0,3);
    const dir=DIRS[_opRint(0,3)];
    const body=OP_BODIES[_opRint(0,OP_BODIES.length-1)];
    const rep=_opRint(2,4);
    const prog=[];
    if(_opRnd()<0.4)prog.push([I_AV,I_GD,I_GI][_opRint(0,2)]);
    prog.push({rep,body:[...body]});
    const flat=expandProg(prog);
    if(flat.length<3||flat.length>10)continue;
    const res=simTrail({r:sr,c:sc,dir},prog,4);
    if(!res.ok)continue;
    if(res.st.r===sr&&res.st.c===sc)continue;
    const ans=coordName(res.st.r,res.st.c);
    const set=[ans];
    while(set.length<4){const cand=coordName(_opRint(0,3),_opRint(0,3));if(set.indexOf(cand)<0)set.push(cand);}
    const opts=_shuffleF(set,_opRnd);
    items.push({sr,sc,dir,prog,lineas:progLineas(prog),ans,opts});
  }
  return items;
}

// II. Predice la salida (5 × 2 = 10 pts): casillas pintadas, instrucciones ejecutadas, vueltas…
function genPrediceItems(){
  const items=[];
  {const k=_opRint(3,6);items.push({txt:`El robot ejecuta REPETIR ${k} VECES [AVANZA]. ¿Cuántas casillas quedan pintadas, contando la de salida?`,ans:String(k+1)});}
  {const body=OP_BODIES[_opRint(1,OP_BODIES.length-1)];const k=_opRint(2,5);items.push({txt:`¿Cuántas instrucciones EJECUTA en total el robot con REPETIR ${k} VECES [${body.join(', ')}]?`,ans:String(k*body.length)});}
  {const k=_opRint(2,6);items.push({txt:`¿Cuántas vueltas da el bucle REPETIR ${k} VECES [AVANZA, GIRA DERECHA]?`,ans:String(k)});}
  {const d=DIRS[_opRint(0,3)];items.push({txt:`El robot mira al ${DIR_NOMBRE[d]} y ejecuta REPETIR 4 VECES [GIRA DERECHA] (la vuelta completa). ¿Hacia dónde mira al final?`,ans:DIR_NOMBRE[d]});}
  {const k=_opRint(5,9);items.push({txt:`Escribir AVANZA ${k} veces seguidas son ${k} instrucciones escritas. Con el bucle REPETIR ${k} VECES [AVANZA], ¿cuántas instrucciones ESCRIBES? (la línea REPETIR cuenta 1 y el cuerpo cuenta 1)`,ans:'2'});}
  return _shuffleF(items,_opRnd);
}
function _isPredOk(student,expected){
  let s=normalizeEvalAnswer(student).replace(/^(el|al|la)\s+/,'').replace(/\s*(casillas?|vueltas?|instrucciones?|veces)$/,'');
  const e=normalizeEvalAnswer(expected);
  return !!s&&(s===e);
}

// III. Completa el bucle (5 × 4 = 20 pts): falta la N o falta una instrucción del cuerpo.
function _numOpts(correct){const set=[correct];const cands=[correct+1,correct-1,correct+2,correct+3,correct-2];for(const c of cands){if(set.length>=4)break;if(c>=2&&set.indexOf(c)<0)set.push(c);}return _shuffleF(set.map(String),_opRnd);}
function genCompletaItems(){
  const t=[];
  {const k=_opRint(3,5);const opts=_numOpts(k);t.push({txt:`Para pintar una LÍNEA recta de ${k+1} casillas (contando la de salida): REPETIR ___ VECES [AVANZA].`,opts,ans:opts.indexOf(String(k))});}
  {const opts=_shuffleF([I_GD,I_GI,I_AV,'REPETIR'],_opRnd);t.push({txt:'Para dibujar un CUADRADO girando siempre hacia SU derecha en las esquinas: REPETIR 4 VECES [AVANZA, ___].',opts,ans:opts.indexOf(I_GD)});}
  {const k=_opRint(2,3);const opts=_numOpts(k);t.push({txt:`La ESCALERA de ${k*2+1} casillas pintadas (contando la de salida) se dibuja con: REPETIR ___ VECES [AVANZA, GIRA DERECHA, AVANZA, GIRA IZQUIERDA].`,opts,ans:opts.indexOf(String(k))});}
  {const opts=_shuffleF([I_AV,I_GD,I_GI,'REPETIR'],_opRnd);t.push({txt:'Para pintar una LÍNEA recta, el cuerpo del bucle debe ser: REPETIR 5 VECES [___].',opts,ans:opts.indexOf(I_AV)});}
  {const m=_opRint(2,3);const body=m===2?[I_AV,I_GD]:[I_AV,I_AV,I_GD];const k=_opRint(3,6);const total=m*k;const opts=_numOpts(k);t.push({txt:`Un programa debe ejecutar ${total} instrucciones en total con este bucle: REPETIR ___ VECES [${body.join(', ')}].`,opts,ans:opts.indexOf(String(k))});}
  return _shuffleF(t,_opRnd);
}

// IV. Problemas de la vida real (3 × 10 = 30 pts): tareas repetitivas hondureñas escritas con REPETIR.
const opVidaBank=[
  {tema:'Repartir los 6 cuadernos de la fila, uno por pupitre',n:6,modelo:'REPETIR 6 VECES [Tomar un cuaderno de la pila, caminar al siguiente pupitre, entregarlo]'},
  {tema:'Sembrar 5 frijoles en una fila de la huerta escolar',n:5,modelo:'REPETIR 5 VECES [Abrir un agujero, poner el frijol, taparlo con tierra]'},
  {tema:'Poner las 4 sillas de la fila en su lugar',n:4,modelo:'REPETIR 4 VECES [Levantar una silla, llevarla a la fila, acomodarla]'},
  {tema:'Llenar los 5 vasos de fresco para la merienda',n:5,modelo:'REPETIR 5 VECES [Tomar un vaso, servir el fresco, ponerlo en la mesa]'},
  {tema:'Hacer las 6 tortillas de la cena',n:6,modelo:'REPETIR 6 VECES [Tomar una bolita de masa, palmearla, ponerla en el comal]'},
  {tema:'Aplaudir 3 veces en el saludo de la mañana',n:3,modelo:'REPETIR 3 VECES [Aplaudir]'},
];
const OP_VIDA_RUBRICA='Usa REPETIR N VECES con la N correcta (4 pts) · El cuerpo del bucle tiene las acciones necesarias y en orden (4 pts) · No repite escrito a mano lo que el bucle ya repite (2 pts)';
function genVidaItems(){return _pickF(opVidaBank,3,_opRnd);}

// V. Olimpiada (10 + 10 = 20 pts)
// (a) El programa MÁS CORTO con bucle que dibuja el patrón (N del bucle + instrucciones escritas)
function genRetoCorto(){
  const tipo=_opRint(0,3);
  if(tipo===0){
    const L=_opRint(3,4);const c=_opRint(0,3);
    const paint=[];for(let i=0;i<L;i++)paint.push((3-i)+','+c);
    return{desc:`una LÍNEA vertical de ${L} casillas en la columna ${'ABCD'[c]}`,start:`sale de ${coordName(3,c)} mirando al Norte`,paint,ansN:L-1,ansEsc:2,modelo:`REPETIR ${L-1} VECES [AVANZA]`};
  }
  if(tipo===1){
    const L=_opRint(3,4);const r=_opRint(0,3);
    const paint=[];for(let i=0;i<L;i++)paint.push(r+','+i);
    return{desc:`una LÍNEA horizontal de ${L} casillas en la fila ${r+1}`,start:`sale de ${coordName(r,0)} mirando al Este`,paint,ansN:L-1,ansEsc:2,modelo:`REPETIR ${L-1} VECES [AVANZA]`};
  }
  if(tipo===2){
    return{desc:'un CUADRADO de 4 casillas (2×2)',start:`sale de ${coordName(2,1)} mirando al Norte`,paint:['2,1','1,1','1,2','2,2'],ansN:4,ansEsc:3,modelo:'REPETIR 4 VECES [AVANZA, GIRA DERECHA]'};
  }
  return{desc:'un CUADRADO de 8 casillas (3×3)',start:`sale de ${coordName(3,0)} mirando al Norte`,paint:['3,0','2,0','1,0','1,1','1,2','2,2','3,2','3,1'],ansN:4,ansEsc:4,modelo:'REPETIR 4 VECES [AVANZA, AVANZA, GIRA DERECHA]'};
}
// (b) Detective del bug: ¿la N está errada o el cuerpo está errado? + la corrección
function genRetoBug(){
  const casos=[];
  {const L=_opRint(4,5);casos.push({goal:`pintar una línea recta de ${L} casillas (contando la de salida)`,malo:`REPETIR ${L-2} VECES [AVANZA]`,errado:'El número de vueltas (N)',correccion:`N = ${L-1}`,opcCorr:[`N = ${L-1}`,`N = ${L}`,'GIRA DERECHA','AVANZA']});}
  casos.push({goal:'dibujar un cuadrado girando en cada esquina hacia su derecha',malo:'REPETIR 4 VECES [AVANZA, AVANZA]',errado:'El cuerpo del bucle',correccion:'La segunda instrucción debe ser GIRA DERECHA',opcCorr:['La segunda instrucción debe ser GIRA DERECHA','La segunda instrucción debe ser AVANZA','N = 8','N = 2']});
  casos.push({goal:'dar la media vuelta (quedar mirando al lado contrario)',malo:'REPETIR 3 VECES [GIRA DERECHA]',errado:'El número de vueltas (N)',correccion:'N = 2',opcCorr:['N = 2','N = 4','AVANZA','GIRA IZQUIERDA']});
  casos.push({goal:'pintar una línea recta de 5 casillas (contando la de salida)',malo:'REPETIR 4 VECES [GIRA DERECHA]',errado:'El cuerpo del bucle',correccion:'El cuerpo debe ser AVANZA',opcCorr:['El cuerpo debe ser AVANZA','El cuerpo debe ser GIRA IZQUIERDA','N = 5','N = 3']});
  const caso=casos[_opRint(0,casos.length-1)];
  caso.opcCorr=_shuffleF(caso.opcCorr,_opRnd);
  return caso;
}
const OP_BUG_QUE=['El número de vueltas (N)','El cuerpo del bucle'];

function genEvalOp() {
  sfx('click');
  _injectFormaSel('genEvalOp', 'evalOpFormaSel', evalOpFormNum, function (v) { evalOpFormNum = v; });
  const _sO = document.getElementById('evalOpFormaSel');
  if (_sO && parseInt(_sO.value, 10)) evalOpFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sO.value, 10)));
  const cf = evalOpFormNum; window._currentEvalOpForm = cf; _opRnd = _evalRng(100000 + cf); /* la Forma cf siembra TODO el azar de esta prueba */
  evalOpFormNum = (evalOpFormNum % EVAL_FORMAS) + 1;
  _injectFormaSel('genEvalOp', 'evalOpFormaSel', evalOpFormNum, function (v) { evalOpFormNum = v; });
  saveProgress();
  document.getElementById('evalop-screen-title').textContent = `🔁 Prueba Operativa — Forma ${cf} · Bucles: Repetir sin Cansarse`;
  evalOpAnsVisible = false;
  const out = document.getElementById('evalOpOut'); out.innerHTML = '';

  const ejeItems = genEjecutaItems();
  const prdItems = genPrediceItems();
  const cplItems = genCompletaItems();
  const vidaItems = genVidaItems();
  const retoC = genRetoCorto();
  const retoB = genRetoBug();

  const s1 = document.createElement('div');
  s1.innerHTML = `<div class="eval-section-title">I. Ejecuta el bucle <span class="eval-pts">20 pts · 4 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel básico. Sigue el programa con el dedo sobre la cuadrícula, cuenta las vueltas del bucle y marca la casilla donde TERMINA el robot.</p>`;
  ejeItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    const optsHtml = it.opts.map(op => `<label class="eval-mc-opt"><input type="radio" name="opE${i}" value="${op}"> ${op}</label>`).join('');
    d.innerHTML = `<div class="eval-q"><span class="eval-num">${i + 1}</span><span class="eval-q-text">El robot parte de <strong>${coordName(it.sr, it.sc)}</strong> mirando al <strong>${DIR_NOMBRE[it.dir]}</strong>.</span></div><div class="op-grid-wrap">${svgGridHTML({ n: 4, robot: { r: it.sr, c: it.sc, dir: it.dir }, w: 160 })}</div><div class="op-prog">${it.lineas.map((p, j) => (j + 1) + '. ' + p).join('<br>')}</div><div class="eval-mc-opts" style="flex-direction:row;flex-wrap:wrap;gap:0.8rem;">${optsHtml}</div><div class="eval-answer">${it.ans}</div><div class="eval-item-feedback" id="evalFbEje${i}" aria-live="polite"></div>`;
    s1.appendChild(d);
  });
  out.appendChild(s1);

  const s2 = document.createElement('div');
  s2.innerHTML = `<div class="eval-section-title">II. Predice <span class="eval-pts">10 pts · 2 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Agilidad. Responde sin cuadrícula: escribe el número o la orientación (Norte, Este, Sur, Oeste) que se pide.</p>`;
  prdItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="eval-q"><span class="eval-num">${i + 1}</span><span class="eval-q-text">${it.txt}</span></div><div class="opx-row" style="margin-left:1.7rem;"><span style="font-size:0.82rem;color:var(--gray);">R/</span><input class="eval-cp-input" type="text" data-prd="${i}" autocomplete="off" style="min-width:110px;max-width:150px;"></div><div class="eval-answer">${it.ans}</div><div class="eval-item-feedback" id="evalFbPrd${i}" aria-live="polite"></div>`;
    s2.appendChild(d);
  });
  out.appendChild(s2);

  const s3 = document.createElement('div');
  s3.innerHTML = `<div class="eval-section-title">III. Completa el bucle <span class="eval-pts">20 pts · 4 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel intermedio. A cada bucle le falta la N o una instrucción del cuerpo (el espacio ___). Elige la opción que logra la figura.</p>`;
  cplItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    const optsHtml = it.opts.map((op, oi) => `<label class="eval-mc-opt"><input type="radio" name="opC${i}" value="${oi}"> ${'abcd'[oi]}) ${op}</label>`).join('');
    d.innerHTML = `<div class="eval-q"><span class="eval-num">${i + 1}</span><span class="eval-q-text">${it.txt}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${'abcd'[it.ans]}) ${it.opts[it.ans]}</div><div class="eval-item-feedback" id="evalFbCpl${i}" aria-live="polite"></div>`;
    s3.appendChild(d);
  });
  out.appendChild(s3);

  const s4 = document.createElement('div');
  s4.innerHTML = `<div class="eval-section-title">IV. Problemas de la vida real <span class="eval-pts">30 pts · 10 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel avanzado. Escribe cada tarea repetitiva como un programa con REPETIR N VECES [cuerpo]. Compara con la pauta y anota tu puntaje de 0 a 10.</p>`;
  vidaItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="eval-q"><span class="eval-num">${i + 1}</span><span class="eval-q-text">Escribe con un bucle el programa para: <strong>${it.tema}</strong>.</span></div><textarea class="op-vida-ta" aria-label="Programa con REPETIR para ${it.tema}" placeholder="REPETIR ___ VECES [ … ]"></textarea><div class="op-pauta-rub"><strong>Modelo:</strong> ${it.modelo}<br><strong>Rúbrica (10 pts):</strong> ${OP_VIDA_RUBRICA}</div><div class="op-vida-score"><label for="opVida${i}">Compara con la pauta y anota tu puntaje:</label><input type="number" id="opVida${i}" data-vida="${i}" min="0" max="10" value="0"> <span>de 10 pts</span></div><div class="eval-item-feedback" id="evalFbVida${i}" aria-live="polite"></div>`;
    s4.appendChild(d);
  });
  out.appendChild(s4);

  const s5 = document.createElement('div');
  s5.innerHTML = '<div class="eval-section-title">V. Olimpiada del código <span class="eval-pts">20 pts · 10 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Desafío. Piensa como programador: encuentra el programa más corto con bucle y atrapa el bug.</p>';
  const dC = document.createElement('div'); dC.className = 'eval-item eval-auto-item';
  dC.innerHTML = `<div class="eval-q"><span class="eval-num">1</span><span class="eval-q-text">🏁 <strong>El programa más corto con bucle:</strong> el robot debe dibujar ${retoC.desc} (casillas pintadas de la figura); ${retoC.start}. Escribe la N del bucle y cuántas instrucciones ESCRITAS tiene el programa más corto (la línea REPETIR cuenta 1 y cada instrucción del cuerpo cuenta 1).</span></div><div class="op-grid-wrap">${svgGridHTML({ n: 4, paint: retoC.paint, w: 160 })}</div><div class="opx-row" style="margin-left:1.7rem;flex-wrap:wrap;gap:0.5rem;"><span style="font-size:0.82rem;color:var(--gray);">N del bucle (5 pts):</span><input class="eval-cp-input" type="text" data-rc1="0" autocomplete="off" inputmode="numeric" style="min-width:56px;max-width:70px;"><span style="font-size:0.82rem;color:var(--gray);">Instrucciones escritas (5 pts):</span><input class="eval-cp-input" type="text" data-rc2="0" autocomplete="off" inputmode="numeric" style="min-width:56px;max-width:70px;"></div><div class="eval-answer">N = ${retoC.ansN} · ${retoC.ansEsc} instrucciones escritas · Modelo: ${retoC.modelo}</div><div class="eval-item-feedback" id="evalFbRc" aria-live="polite"></div>`;
  s5.appendChild(dC);
  const dB = document.createElement('div'); dB.className = 'eval-item eval-auto-item';
  const selQue = `<select class="eval-match-select" data-bl="0" aria-label="Qué está errado"><option value="">—</option>${OP_BUG_QUE.map(op => `<option value="${op}">${op}</option>`).join('')}</select>`;
  const selCorr = `<select class="eval-match-select" data-bi="0" aria-label="Corrección"><option value="">—</option>${retoB.opcCorr.map(op => `<option value="${op}">${op}</option>`).join('')}</select>`;
  dB.innerHTML = `<div class="eval-q"><span class="eval-num">2</span><span class="eval-q-text">🔎 <strong>Detective del bug:</strong> este bucle debería ${retoB.goal}, pero tiene UN error.</span></div><div class="op-prog">${retoB.malo}</div><div class="opx-row" style="margin-left:1.7rem;flex-wrap:wrap;gap:0.5rem;"><span style="font-size:0.82rem;color:var(--gray);">¿Qué está errado? (5 pts):</span>${selQue}<span style="font-size:0.82rem;color:var(--gray);">Corrección (5 pts):</span>${selCorr}</div><div class="eval-answer">${retoB.errado} · ${retoB.correccion}</div><div class="eval-item-feedback" id="evalFbBug" aria-live="polite"></div>`;
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
  d.cplItems.forEach((it, i) => { const sel = document.querySelector(`input[name="opC${i}"]:checked`); const ok = !!sel && Number(sel.value) === it.ans; if (ok) { det.cpl += 4; total += 4; } setEvalFeedback('evalFbCpl' + i, ok, ok ? 'Correcto. +4 pts' : 'Revisar. Faltaba: ' + it.opts[it.ans]); });
  d.vidaItems.forEach((it, i) => { const inp = document.querySelector(`[data-vida="${i}"]`); let v = inp ? (parseInt(inp.value) || 0) : 0; v = Math.max(0, Math.min(10, v)); if (inp) inp.value = v; det.vida += v; autoev += v; setEvalFeedback('evalFbVida' + i, v >= 7, 'Puntaje autoevaluado: ' + v + '/10 (compara siempre con la pauta)'); });
  { const e1 = document.querySelector('[data-rc1="0"]'); const ok1 = _isOpNumOk(e1 ? e1.value : '', d.retoC.ansN); if (e1) { e1.classList.toggle('eval-input-ok', ok1); e1.classList.toggle('eval-input-no', !ok1); } const e2 = document.querySelector('[data-rc2="0"]'); const ok2 = _isOpNumOk(e2 ? e2.value : '', d.retoC.ansEsc); if (e2) { e2.classList.toggle('eval-input-ok', ok2); e2.classList.toggle('eval-input-no', !ok2); } if (ok1) { det.reto += 5; total += 5; } if (ok2) { det.reto += 5; total += 5; } setEvalFeedback('evalFbRc', ok1 && ok2, (ok1 && ok2) ? '¡Programa mínimo encontrado! +10 pts' : 'Revisar. N = ' + d.retoC.ansN + ' · ' + d.retoC.ansEsc + ' escritas (' + d.retoC.modelo + ')'); }
  { const elQ = document.querySelector('[data-bl="0"]'); const okQ = !!elQ && elQ.value === d.retoB.errado; if (elQ) { elQ.classList.toggle('eval-input-ok', okQ); elQ.classList.toggle('eval-input-no', !okQ); } const elC = document.querySelector('[data-bi="0"]'); const okC = !!elC && elC.value === d.retoB.correccion; if (elC) { elC.classList.toggle('eval-input-ok', okC); elC.classList.toggle('eval-input-no', !okC); } if (okQ) { det.reto += 5; total += 5; } if (okC) { det.reto += 5; total += 5; } setEvalFeedback('evalFbBug', okQ && okC, (okQ && okC) ? '¡Bug atrapado y corregido! +10 pts' : 'Revisar. ' + d.retoB.errado + ' · ' + d.retoB.correccion); }
  const res = document.getElementById('evalOpAutoResult');
  const desglose = `Ejecuta: ${det.eje}/20 · Predice: ${det.prd}/10 · Completa: ${det.cpl}/20 · Olimpiada: ${det.reto}/20`;
  if (res) { res.className = 'eval-auto-result ' + (total >= OP_UMBRAL ? 'eval-auto-pass' : 'eval-auto-risk'); res.innerHTML = `<strong>Resultado automático: ${total}/${OP_AUTO} puntos</strong><br><span>${desglose}</span><br><em>Falta calificar: IV. Vida real (${OP_MANUAL} pts). Eso lo escribiste tú y lo revisa tu maestro con la pauta; tu autoevaluación fue ${autoev}/${OP_MANUAL} y no cuenta para esta nota.</em>`; }
  if (total >= OP_UMBRAL) { pts(8); showToast('🎯 Prueba operativa calificada: ' + total + '/' + OP_AUTO); }
  else showToast('🧮 Prueba operativa: ' + total + '/' + OP_AUTO + '. Revisa los ítems marcados.');
}

function printEvalOp() {
  if (!window._evalOpData) { showToast('⚠️ Genera una prueba operativa primero'); return; }
  sfx('click');
  const forma = window._currentEvalOpForm || 1; const d = window._evalOpData;

  // ── I. Ejecuta el bucle (cuadrículas SVG deterministas; casillas vacías con «•»)
  let s1 = `<div class="sec-title"><span>I. Ejecuta el bucle</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Nivel básico. Sigue el programa con el dedo, cuenta las vueltas del bucle y ESCRIBE la casilla donde termina el robot (tipo B3, letra de columna + número de fila). 4 pts c/u.</p><div class="ej-grid">`;
  d.ejeItems.forEach((it, i) => {
    s1 += `<div class="ej-box"><div class="ej-head">${i + 1}. Sale de ${coordName(it.sr, it.sc)} mirando al ${DIR_NOMBRE[it.dir]}</div><div class="ej-svg">${svgGridHTML({ n: 4, robot: { r: it.sr, c: it.sc, dir: it.dir }, w: 118 })}</div><div class="ej-prog">${it.lineas.map((p, j) => (j + 1) + '. ' + p).join('<br>')}</div><div class="ej-resp">Termina en: <span class="opx-mini-blank">&nbsp;</span></div></div>`;
  });
  s1 += '</div>';

  // ── II. Predice
  let s2 = `<div class="sec-title"><span>II. Predice</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10 pts</span></div></div><p class="opx-instr">Agilidad. Escribe el número o la orientación (Norte, Este, Sur, Oeste) que se pide. 2 pts c/u.</p>`;
  d.prdItems.forEach((it, i) => { s2 += `<div class="opx-print-row" style="align-items:flex-start;"><span class="qn">${i + 1}.</span><span style="flex:1;line-height:1.35;">${it.txt} &nbsp; R/ <span class="opx-mini-blank">&nbsp;</span></span></div>`; });

  // ── III. Completa el bucle
  let s3 = `<div class="sec-title"><span>III. Completa el bucle</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Nivel intermedio. A cada bucle le falta la N o una instrucción del cuerpo (el espacio ___). Encierra o escribe la letra de la opción que logra la figura. 4 pts c/u.</p>`;
  d.cplItems.forEach((it, i) => { s3 += `<div class="opx-print-row" style="align-items:flex-start;"><span class="qn">${i + 1}.</span><span style="flex:1;line-height:1.35;">${it.txt}<br><span class="mono">Opciones: ${it.opts.map((op, oi) => 'abcd'[oi] + ') ' + op).join(' · ')}</span> &nbsp; Letra: <span class="opx-mini-blank" style="min-width:34px;">&nbsp;</span></span></div>`; });

  // ── IV. Problemas de la vida real (modelo en la pauta)
  let s4 = `<div class="sec-title"><span>IV. Problemas de la vida real</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 30 pts</span></div></div><p class="opx-instr">Nivel avanzado. Escribe cada tarea repetitiva como un programa con REPETIR N VECES [cuerpo]. 10 pts c/u.</p>`;
  d.vidaItems.forEach((it, i) => { s4 += `<div class="opx-print-row" style="align-items:flex-start;"><span class="qn">${i + 1}.</span><span style="flex:1;line-height:1.4;">Programa con bucle para: <strong>${it.tema}</strong><br><span class="ln-vida"></span><span class="ln-vida"></span></span></div>`; });

  // ── V. Olimpiada del código
  let s5 = `<div class="sec-title"><span>V. Olimpiada del código</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Desafío. Reto 1: 10 pts (5 la N + 5 las escritas) · Reto 2: 10 pts (5 el diagnóstico + 5 la corrección).</p><div class="ord-print-grid"><div class="ord-print-box"><div class="ord-print-dir">1. 🏁 El programa más corto con bucle · 10 pts:</div><div style="text-align:center;">${svgGridHTML({ n: 4, paint: d.retoC.paint, w: 108 })}</div><div style="font-size:9pt;line-height:1.35;">El robot debe dibujar ${d.retoC.desc} (casillas pintadas); ${d.retoC.start}. La línea REPETIR cuenta 1 instrucción escrita y cada instrucción del cuerpo cuenta 1.</div><div style="margin-top:0.3rem;font-size:9pt;">N del bucle: <span class="opx-mini-blank" style="min-width:34px;">&nbsp;</span> · Instrucciones escritas: <span class="opx-mini-blank" style="min-width:34px;">&nbsp;</span></div></div><div class="ord-print-box"><div class="ord-print-dir">2. 🔎 Detective del bug · 10 pts:</div><div style="font-size:9pt;line-height:1.35;">Este bucle debería ${d.retoB.goal}, pero tiene UN error:<br><span class="mono">${d.retoB.malo}</span></div><div style="margin-top:0.3rem;font-size:9pt;">¿Qué está errado? (la N o el cuerpo): <span class="opx-mini-blank" style="min-width:70px;">&nbsp;</span><br>Corrección: <span class="opx-mini-blank" style="min-width:120px;">&nbsp;</span></div></div></div>`;

  // ── Pauta del docente
  let pR = '';
  pR += `<div class="p-sec"><div class="p-ttl">I. Ejecuta el bucle</div><table class="p-tbl">${d.ejeItems.map((it, i) => `<tr><td class="pn">${i + 1}.</td><td class="pa">Termina en ${it.ans}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">II. Predice</div><table class="p-tbl">${d.prdItems.map((it, i) => `<tr><td class="pn">${i + 1}.</td><td class="pa">${it.ans}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">III. Completa el bucle</div><table class="p-tbl">${d.cplItems.map((it, i) => `<tr><td class="pn">${i + 1}.</td><td class="pa">${'abcd'[it.ans]}) ${it.opts[it.ans]}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">IV. Vida real (rúbrica 10 pts c/u)</div>${d.vidaItems.map((it, i) => `<div class="p-ord-line"><strong>${i + 1}. ${it.tema}:</strong> ${it.modelo}</div>`).join('')}<div class="p-rub">Rúbrica: ${OP_VIDA_RUBRICA}. Acepte redacciones distintas si la N y el cuerpo son correctos.</div></div>`;
  pR += `<div class="p-sec" style="grid-column:1/-1;"><div class="p-ttl">V. Olimpiada del código</div><div class="p-ord-line"><strong>1.</strong> N = ${d.retoC.ansN} · ${d.retoC.ansEsc} instrucciones escritas · Modelo: ${d.retoC.modelo}</div><div class="p-ord-line"><strong>2.</strong> ${d.retoB.errado} · ${d.retoB.correccion}</div></div>`;

  const doc = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Prueba Operativa Bucles: Repetir sin Cansarse · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11.5pt;color:#111;background:#fff;padding:4mm 6mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.5rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;color:#0e7490;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:#0e7490;margin-top:0.15rem;font-weight:700;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.5rem 0 0.22rem;border-left:4px solid #0e7490;background:#ecfeff;display:flex;justify-content:space-between;align-items:center;color:#0e7490;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:#0e7490;font-weight:700;font-style:italic;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #0e7490;height:12px;}.qn{font-weight:700;min-width:20px;display:inline-block;color:#0e7490;}.opx-instr{font-size:9pt;color:#555;margin-bottom:0.25rem;}.opx-print-row{display:flex;align-items:baseline;gap:0.4rem;font-size:10.5pt;padding:0.22rem 0.2rem;border-bottom:1px dotted #ddd;}.opx-mini-blank{display:inline-block;min-width:60px;border-bottom:1.5px solid #111;}.mono{font-family:'Courier New',monospace;font-weight:700;font-size:9.5pt;}.ej-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0.35rem 0.5rem;margin-top:0.2rem;}.ej-box{border:1px solid #bbb;border-radius:4px;padding:0.25rem 0.35rem;break-inside:avoid;page-break-inside:avoid;}.ej-head{font-size:8.5pt;font-weight:700;color:#0e7490;margin-bottom:0.15rem;}.ej-svg{text-align:center;}.ej-prog{font-family:'Courier New',monospace;font-size:8.5pt;font-weight:700;line-height:1.3;margin-top:0.15rem;}.ej-resp{font-size:9pt;margin-top:0.2rem;}.ln-vida{display:block;border-bottom:1px solid #111;min-height:14px;margin-top:8px;}.ord-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.8rem;margin-top:0.2rem;}.ord-print-box{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.4rem;break-inside:avoid;}.ord-print-dir{font-size:9pt;font-weight:700;color:#0e7490;margin-bottom:0.2rem;}.total-row{display:flex;align-items:baseline;justify-content:flex-end;gap:7px;font-size:11pt;color:#0e7490;font-weight:700;font-style:italic;margin-top:0.5rem;padding:0.2rem 0.5rem;background:#ecfeff;border-radius:4px;}.total-row .obt-line{min-width:80px;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #0e7490;padding-bottom:0.35rem;margin-bottom:0.5rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;color:#0e7490;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #a5f3fc;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;color:#0e7490;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#0e7490;}.pa{color:#007a00;font-weight:600;}.p-ord-line{font-size:10.5pt;margin-bottom:0.2rem;color:#007a00;}.p-rub{font-size:9.5pt;color:#555;margin-top:0.2rem;border-top:1px dotted #ddd;padding-top:0.2rem;}.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Examen de Programación — Prueba Operativa · Bucles: Repetir sin Cansarse · Educación Básica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 pts · I: 20 · II: 10 · III: 20 · IV: 30 · V: 20 · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✔ PAUTA — Prueba Operativa · Bucles: Repetir sin Cansarse · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">100 pts · I: 5×4 · II: 5×2 · III: 5×4 · IV: 3×10 · V: 10+10 · Programación · Educación Básica</div></div><div class="p-grid">${pR}</div></div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("evalPage",250,0.55,1.2);fit("pautaPage",250,0.55,1.2);})();<\/script></body></html>`;
  const win = window.open('', '_blank', '');
  if (!win) { showToast('⚠️ Activa las ventanas emergentes para imprimir'); return; }
  win.document.write(doc); win.document.close(); setTimeout(() => win.print(), 400);
}

// ===================== LAB: EL SIMULADOR QUE DIBUJA =====================
// 4 niveles en una cuadrícula 5×5 sin obstáculos: el robot deja RASTRO ✏️ en las
// celdas por donde pasa (incluida la de salida) y gana cuando su rastro COINCIDE
// exactamente con la figura objetivo. Cada nivel trae una solución de ejemplo
// (sol, con bucle REPETIR) verificada por el arnés _dev al construirse.
const parteData={
  n1:{nombre:'Nivel 1 · La línea',icon:'1️⃣',n:5,start:{r:4,c:0,dir:'N'},
      target:['4,0','3,0','2,0','1,0','0,0'],
      meta:'Pinta una LÍNEA recta de 5 casillas en la columna A (de A5 a A1). Pista: con un bucle solo escribes 2 instrucciones.',
      sol:[{rep:4,body:[I_AV]}],xpn:6},
  n2:{nombre:'Nivel 2 · La escalera',icon:'2️⃣',n:5,start:{r:4,c:0,dir:'N'},
      target:['4,0','3,0','3,1','2,1','2,2'],
      meta:'Dibuja una ESCALERA de 5 casillas: sube y dobla, sube y dobla. Pista: el patrón que se repite es AVANZA, GIRA DERECHA, AVANZA, GIRA IZQUIERDA.',
      sol:[{rep:2,body:[I_AV,I_GD,I_AV,I_GI]}],xpn:6},
  n3:{nombre:'Nivel 3 · El cuadrado',icon:'3️⃣',n:5,start:{r:3,c:1,dir:'N'},
      target:['3,1','2,1','1,1','1,2','1,3','2,3','3,3','3,2'],
      meta:'Dibuja un CUADRADO de 8 casillas empezando en B4. Pista: cada lado son dos AVANZA y cada esquina un GIRA DERECHA… ¿cuántas vueltas?',
      sol:[{rep:4,body:[I_AV,I_AV,I_GD]}],xpn:6},
  n4:{nombre:'Nivel 4 · El rectángulo',icon:'4️⃣',n:5,start:{r:4,c:0,dir:'N'},
      target:['4,0','3,0','2,0','1,0','1,1','2,1','3,1','4,1'],
      meta:'Dibuja un RECTÁNGULO parado de 8 casillas (columnas A y B, filas 2 a 5). Pista: el patrón «lado largo, esquina, lado corto, esquina» se repite 2 veces.',
      sol:[{rep:2,body:[I_AV,I_AV,I_AV,I_GD,I_AV,I_GD]}],xpn:6}
};
let labNivel='n1',labProg=[],labLoopOpen=null,labRunning=false,labRobot=null,labTrail=new Set();
function labShowParte(parteKey){if(labRunning)return;labNivel=parteKey;const nv=parteData[parteKey];labProg=[];labLoopOpen=null;labRobot={r:nv.start.r,c:nv.start.c,dir:nv.start.dir};labTrail=new Set([labRobot.r+','+labRobot.c]);document.querySelectorAll('.lab-cont-btn').forEach(b=>b.classList.remove('active-pri'));const btn=document.querySelector(`[data-parte="${parteKey}"]`);if(btn)btn.classList.add('active-pri');updateLabDisplay();if(typeof sfx==='function')sfx('click');}
function updateLabDisplay(vueltaTxt){
  const nv=parteData[labNivel];
  const sent=document.getElementById('lab-sentence');
  if(sent)sent.innerHTML=`✏️ <strong>${nv.nombre}</strong> — ${nv.meta}`;
  const disp=document.getElementById('lab-display');
  if(!disp)return;
  disp.innerHTML=`<div class="lab-grids"><div class="lab-grid-box"><div class="lab-grid-t">🎯 Figura objetivo</div>${svgGridHTML({n:nv.n,paint:nv.target,paintColor:'#fcd34d',dots:false,w:150})}</div><div class="lab-grid-box"><div class="lab-grid-t">✏️ Tu dibujo</div>${svgGridHTML({n:nv.n,robot:labRobot,paint:Array.from(labTrail),dots:false,w:210})}</div></div><div class="lab-vuelta" id="labVuelta" aria-live="polite">${vueltaTxt||''}</div><div style="font-size:0.8rem;color:var(--gray);margin-top:0.15rem;">Robot en <strong>${coordName(labRobot.r,labRobot.c)}</strong> mirando al <strong>${DIR_NOMBRE[labRobot.dir]}</strong> ${DIR_FLECHA[labRobot.dir]} · Pintadas: ${labTrail.size} de ${nv.target.length}</div>`;
  renderLabProg();
}
function renderLabProg(runFlatIdx){
  const list=document.getElementById('progList');
  if(!list)return;
  const chips=[];
  let flatCount=0;
  labProg.forEach((tk,i)=>{
    if(typeof tk==='string'){const run=runFlatIdx!==undefined&&runFlatIdx===flatCount;chips.push(`<span class="sim-chip${run?' sim-chip-run':''}"><span class="sim-chip-n">${i+1}</span>${tk}</span>`);flatCount+=1;}
    else{const span=tk.rep*tk.body.length;const run=runFlatIdx!==undefined&&runFlatIdx>=flatCount&&runFlatIdx<flatCount+span;chips.push(`<span class="sim-chip sim-chip-loop${run?' sim-chip-run':''}"><span class="sim-chip-n">${i+1}</span>🔁 REPETIR ${tk.rep} VECES [ ${tk.body.join(' · ')} ]</span>`);flatCount+=span;}
  });
  if(labLoopOpen)chips.push(`<span class="sim-chip sim-chip-loop sim-chip-open"><span class="sim-chip-n">${labProg.length+1}</span>🔁 REPETIR ${labLoopOpen.rep} VECES [ ${labLoopOpen.body.join(' · ')||'…'} ← agrega el cuerpo y cierra con ]</span>`);
  list.innerHTML=chips.length?chips.join(''):'<span class="sim-empty-hint">Toca los botones de arriba para armar tu programa (usa 🔁 REPETIR para dibujar sin cansarte) 👆</span>';
}
function labAdd(instr){if(labRunning)return;if(labLoopOpen){if(labLoopOpen.body.length>=8){showToast('⚠️ Máximo 8 instrucciones dentro del bucle');return;}labLoopOpen.body.push(instr);}else{if(labProg.length>=20){showToast('⚠️ Máximo 20 elementos en el programa');return;}labProg.push(instr);}renderLabProg();sfx('click');}
function labOpenLoop(){if(labRunning)return;if(labLoopOpen){showToast('⚠️ Ya hay un bucle abierto: agrégale cuerpo y ciérralo con ]');return;}if(labProg.length>=20){showToast('⚠️ Máximo 20 elementos en el programa');return;}const sel=document.getElementById('labRepN');const n=Math.min(6,Math.max(2,parseInt(sel&&sel.value,10)||2));labLoopOpen={rep:n,body:[]};renderLabProg();sfx('click');}
function labCloseLoop(){if(labRunning)return;if(!labLoopOpen){showToast('⚠️ No hay ningún bucle abierto: ábrelo con 🔁 REPETIR');return;}if(labLoopOpen.body.length===0){showToast('⚠️ El cuerpo del bucle está vacío: agrégale al menos una instrucción');return;}labProg.push(labLoopOpen);labLoopOpen=null;renderLabProg();sfx('ok');}
function labDel(){if(labRunning)return;if(labLoopOpen){if(labLoopOpen.body.length>0)labLoopOpen.body.pop();else labLoopOpen=null;}else labProg.pop();renderLabProg();sfx('click');}
function labClear(){if(labRunning)return;labProg=[];labLoopOpen=null;const nv=parteData[labNivel];labRobot={r:nv.start.r,c:nv.start.c,dir:nv.start.dir};labTrail=new Set([labRobot.r+','+labRobot.c]);updateLabDisplay();sfx('click');}
function _setsIguales(setA,arrB){if(setA.size!==arrB.length)return false;for(const k of arrB)if(!setA.has(k))return false;return true;}
function labRun(){
  if(labRunning)return;
  if(labLoopOpen){fb('fbLab','Tienes un bucle abierto: ciérralo con el botón «] Cerrar bucle» antes de ejecutar.',false);return;}
  if(labProg.length===0){fb('fbLab','Primero arma un programa: abre un bucle con 🔁 REPETIR y agrégale AVANZA o GIRA.',false);return;}
  const flat=expandProg(labProg);
  if(flat.length>60){fb('fbLab','Tu programa ejecuta más de 60 instrucciones. Usa bucles más pequeños.',false);return;}
  labRunning=true;sfx('click');
  const nv=parteData[labNivel];
  labRobot={r:nv.start.r,c:nv.start.c,dir:nv.start.dir};
  labTrail=new Set([labRobot.r+','+labRobot.c]);
  updateLabDisplay();
  const fbEl=document.getElementById('fbLab');if(fbEl)fbEl.classList.remove('show');
  let i=0;
  const paso=()=>{
    if(i>=flat.length){
      labRunning=false;renderLabProg();
      if(_setsIguales(labTrail,nv.target)){
        const usaBucle=labProg.some(tk=>typeof tk!=='string');
        fb('fbLab',`🎨 ¡Figura dibujada con ${countEscritas(labProg)} instrucciones escritas${usaBucle?' gracias al bucle':''}! ${usaBucle?'¡Así se repite sin cansarse! 🔁':'Lo lograste… ahora inténtalo escribiendo MENOS con 🔁 REPETIR.'}`,true);
        sfx('fan');launchConfetti();
        if(!xpTracker.lab.has(labNivel)){xpTracker.lab.add(labNivel);pts(nv.xpn);const btn=document.querySelector(`[data-parte="${labNivel}"]`);if(btn)btn.classList.add('lab-done');}
        if(xpTracker.lab.size===Object.keys(parteData).length){fin('s-lab');unlockAchievement('lab_master');}
      }else{
        fb('fbLab',`El programa terminó, pero tu rastro (${labTrail.size} casillas) no coincide con la figura objetivo (${nv.target.length} casillas). Compara los dos dibujos y ajusta el número de vueltas o el cuerpo del bucle.`,false);sfx('no');
      }
      return;
    }
    const f=flat[i];
    renderLabProg(i);
    const vueltaTxt=f.de?`🔁 Vuelta ${f.v} de ${f.de} · ${f.i}`:`▶ ${f.i}`;
    const nx=simStep(labRobot,f.i,{n:nv.n});
    if(nx.evento==='borde'){
      labRunning=false;
      const disp=document.getElementById('lab-display');if(disp){disp.parentElement.classList.add('sim-crash');setTimeout(()=>disp.parentElement.classList.remove('sim-crash'),700);}
      fb('fbLab',`💥 ¡El robot se salió del papel en la instrucción ${i+1} (${f.i}${f.de?', vuelta '+f.v+' de '+f.de:''})! Revisa cuántas vueltas da tu bucle y vuelve a ejecutar.`,false);
      sfx('no');
      setTimeout(()=>{labRobot={r:nv.start.r,c:nv.start.c,dir:nv.start.dir};labTrail=new Set([labRobot.r+','+labRobot.c]);updateLabDisplay();},900);
      return;
    }
    labRobot={r:nx.r,c:nx.c,dir:nx.dir};
    labTrail.add(labRobot.r+','+labRobot.c);
    updateLabDisplay(vueltaTxt);
    renderLabProg(i);
    i++;
    setTimeout(paso,420);
  };
  paso();
}

// ===================== DIPLOMA =====================
function _diplPct(){return xp>=MXP?100:Math.round((xp/MXP)*100);}
function openDiploma(){sfx('fan');const pct=_diplPct();document.getElementById('diplPct').textContent=pct+'%';document.getElementById('diplBar').style.width=pct+'%';document.getElementById('diplDate').textContent='Fecha: '+new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});const msgs=['¡Sigue aprendiendo!','¡Muy buen trabajo!','¡Vas muy bien!','¡Dominas los bucles y el arte de repetir sin cansarte!','¡Maestro del Código!'];document.getElementById('diplMsg').textContent=msgs[Math.min(Math.floor(pct/25),4)];const stars=['⭐','⭐⭐','⭐⭐⭐'];document.getElementById('diplStars').textContent=stars[Math.min(Math.floor(pct/40),2)];const achTxt=unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(' · ');document.getElementById('diplAch').textContent=achTxt||'Sigue completando secciones para desbloquear logros';document.getElementById('diplomaOverlay').classList.add('open');launchConfetti();}
function closeDiploma(){document.getElementById('diplomaOverlay').classList.remove('open');}
function updateDiplomaName(v){document.getElementById('diplName').textContent=v||'Estudiante';}
function shareWA(){const name=document.getElementById('diplName').textContent||'Estudiante';const pct=_diplPct();const msg=`🔁 ¡${name} completó la Misión "Bucles: Repetir sin Cansarse"! 🏅 Progreso: ${pct}% · 💻 policastsapien.com`;_waShare(msg);}
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
