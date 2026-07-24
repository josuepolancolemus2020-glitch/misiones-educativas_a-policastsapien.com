// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
function compartirMision(){const url=window.location.href;const texto=`🚀 *Misión Asignada* 🚀\n\nConviértete en *Detective de Bugs*: caza los errores de los programas y sobresale en ser de los mejores alumnos. 🏆\n\nDesbloquea *todos los logros* y puedes poner *tus datos* para que tu maestro observe todos tus logros. 📋\n\n_Se te hará prueba escrita y serás excelente estudiante en Programación._ 💻\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;_waShare(texto);}
function toggleLetra(){document.body.classList.toggle('letra-grande');if(typeof sfx==='function')sfx('click');localStorage.setItem('preferenciaLetra',document.body.classList.contains('letra-grande'));}
window.addEventListener('DOMContentLoaded',()=>{if(localStorage.getItem('preferenciaLetra')==='true')document.body.classList.add('letra-grande');});

// ===================== UTILIDADES =====================
const _pick=(arr,n)=>[...arr].sort(()=>Math.random()-0.5).slice(0,n);
const _shuffle=(arr)=>[...arr].sort(()=>Math.random()-0.5);
function fb(id,msg,isOk){const el=document.getElementById(id);if(el){el.textContent=msg;el.className='fb show '+(isOk?'ok':'err');}}

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY='detective_bugs_v1';
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
// ── Extensión Detective de Bugs: bucles sencillos «REPITE k: AVANZA» ──
// expandProg convierte cada línea (incluidos los REPITE) en instrucciones simples
// conservando el número de línea original (para animar y señalar culpables).
function expandProg(prog){
  const out=[];
  prog.forEach((p,li)=>{
    const m=/^REPITE (\d+): (.+)$/.exec(p);
    if(m){const k=parseInt(m[1],10);for(let i=0;i<k;i++)out.push({instr:m[2],line:li});}
    else out.push({instr:p,line:li});
  });
  return out;
}
// simRunX: ejecuta un programa (con posibles REPITE) y reporta TODO lo que un
// detective necesita: choque (y en qué línea), casilla final, casillas visitadas
// y dónde se hizo la (primera) ENTREGA.
function simRunX(start,prog,map){
  let st={r:start.r,c:start.c,dir:start.dir,entregado:false};
  const ex=expandProg(prog);const visitas=[[st.r,st.c]];let entregaEn=null;
  for(let i=0;i<ex.length;i++){
    const nx=simStep(st,ex[i].instr,map);
    if(nx.evento==='borde'||nx.evento==='obstaculo')return{ok:false,evento:nx.evento,crashLine:ex[i].line,st,visitas,entregaEn};
    if(nx.evento==='entrega'&&entregaEn===null)entregaEn=[st.r,st.c];
    st=nx;
    if(ex[i].instr===I_AV)visitas.push([st.r,st.c]);
  }
  return{ok:true,st,visitas,entregaEn};
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
  primer_quiz:{icon:'🐛',label:'Primer quiz del detective superado'},
  flash_master:{icon:'🃏',label:'Todas las flashcards de la depuración exploradas'},
  clasif_pro:{icon:'🗂️',label:'Clasificador de tipos de bug experto'},
  id_master:{icon:'🔍',label:'Identificador de conceptos maestro'},
  reto_hero:{icon:'🏆',label:'Héroe del reto contra reloj'},
  lab_master:{icon:'🕵️',label:'¡Los 4 casos de la escena del crimen resueltos!'},
  nivel3:{icon:'🔎',label:'¡Detective Junior! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡Inspector de Código! Nivel 6'},
  widgets_master:{icon:'🧩',label:'Widgets de la depuración dominados'}
};
function unlockAchievement(id){if(unlockedAch.includes(id))return;unlockedAch.push(id);sfx('ach');showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label);launchConfetti();renderAchPanel();saveProgress();}
function renderAchPanel(){const list=document.getElementById('achList');list.innerHTML='';Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{const div=document.createElement('div');div.className='ach-item'+(unlockedAch.includes(id)?'':' locked');div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`;list.appendChild(div);});}
function toggleAchPanel(){sfx('click');document.getElementById('achPanel').classList.toggle('open');}
function showToast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}t.textContent=msg;t.style.display='block';clearTimeout(t._tid);t._tid=setTimeout(()=>t.style.display='none',3200);}
function launchConfetti(){const colors=['#0e7490','#22d3ee','#b45309','#f59e0b','#06b6d4'];for(let i=0;i<60;i++){const c=document.createElement('div');c.className='confetti-piece';c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`;document.body.appendChild(c);c.addEventListener('animationend',()=>c.remove());}}

// ===================== XP =====================
const lvls=[{t:0,n:'Aprendiz 🌱'},{t:25,n:'Ayudante del Detective 🔎'},{t:55,n:'Detective Junior 🕵️'},{t:90,n:'Cazador de Bugs 🐛'},{t:130,n:'Depurador Experto 🔍'},{t:165,n:'Inspector de Código 🏅'},{t:190,n:'Maestro Detective 🏆'}];
function pts(n){xp=Math.max(0,Math.min(MXP,xp+n));updateXPBar();saveProgress();}
function updateXPBar(){const pct=Math.round((xp/MXP)*100);document.getElementById('xpFill').style.width=pct+'%';const el=document.getElementById('xpPts');el.textContent='⭐ '+xp;el.style.transform='scale(1.3)';setTimeout(()=>el.style.transform='',300);let lv=0;for(let i=0;i<lvls.length;i++)if(xp>=lvls[i].t)lv=i;document.getElementById('xpLvl').textContent=lvls[lv].n;if(lv!==prevLevel){if(lv>=2)unlockAchievement('nivel3');if(lv>=5)unlockAchievement('nivel5');prevLevel=lv;}}
function resetXP(){sfx('click');xp=0;updateXPBar();showToast('🔄 XP reiniciado a 0');}
function fin(id,showFX=true){if(!done.has(id)){done.add(id);const b=document.querySelector(`[data-s="${id}"]`);if(b)b.classList.add('done');if(showFX){sfx('up');launchConfetti();}saveProgress();}}
function getProgress(){return Math.round((done.size/TOTAL_SECTIONS)*100);}

// ===================== NAV =====================
function go(id){sfx('click');document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});document.getElementById(id).classList.add('active');const btn=document.querySelector(`[data-s="${id}"]`);if(btn){btn.classList.add('active');btn.setAttribute('aria-selected','true');}window.scrollTo({top:0,behavior:'smooth'});if(id==='s-sopa'){setTimeout(buildSopa,50);}if(id==='s-widgets'){setTimeout(buildRoute,50);}}

// ===================== MINI-QUIZ (tarjetas Aprende / Instrucciones) =====================
function miniQuiz(btn,ok,fbId){const wrap=btn.parentElement;wrap.querySelectorAll('.mq-opt').forEach(b=>b.classList.remove('correct','wrong'));btn.classList.add(ok?'correct':'wrong');const f=document.getElementById(fbId);if(f){f.textContent=ok?'¡Correcto! Así piensa un detective de bugs. 🎉':'Todavía no. Vuelve a leer la tarjeta y prueba otra vez.';f.className='mq-fb '+(ok?'ok':'err');}sfx(ok?'ok':'no');if(ok&&!xpTracker.wgt.has('mq_'+fbId)){xpTracker.wgt.add('mq_'+fbId);pts(2);}}

// ===================== FLASHCARD DATA =====================
const fcData=[
  {w:'Bug',a:'🐛 Un <strong>error del programa</strong>, ¡no un insecto de verdad! Hace que el robot no logre su misión.'},
  {w:'Depurar',a:'🔍 <strong>Encontrar y corregir</strong> los bugs de un programa, línea por línea.'},
  {w:'Grace Hopper',a:'👩‍💻 La <strong>programadora</strong> que en 1947 encontró una <strong>polilla de verdad</strong> dentro de la computadora.'},
  {w:'Método del detective',a:'🕵️ <strong>Observar</strong> → leer con <strong>lupa</strong> → <strong>señalar</strong> al sospechoso → <strong>corregir y volver a probar</strong>.'},
  {w:'Observar',a:'👀 El primer paso: ver <strong>qué hace mal</strong> el programa (dónde choca o se desvía el robot).'},
  {w:'Línea sospechosa',a:'🚨 La línea del programa que <strong>parece culpable</strong> del error. ¡Se señala antes de corregir!'},
  {w:'Volver a probar',a:'▶️ El último paso: <strong>ejecutar de nuevo</strong> para comprobar que el bug quedó corregido.'},
  {w:'Instrucción equivocada',a:'↔️ El programa dice <strong>GIRA IZQUIERDA</strong> donde debía decir <strong>GIRA DERECHA</strong>.'},
  {w:'Instrucción de más o de menos',a:'➕ Sobra un paso o <strong>falta uno</strong>, como olvidar la <strong>ENTREGA</strong> final.'},
  {w:'Orden cambiado',a:'🔀 Dos instrucciones <strong>intercambiadas</strong>: doblar la baleada <strong>antes</strong> de untar los frijoles.'},
  {w:'N del bucle errada',a:'🔁 El REPITE dice <strong>4</strong> cuando debía decir <strong>3</strong>: el robot da un paso de más.'},
  {w:'Condición al revés',a:'🔃 El SI está <strong>volteado</strong>: «SI HAY PARED: AVANZA» en vez de «SI NO HAY pared: AVANZA».'},
  {w:'Bug de lógica',a:'🎭 El programa corre <strong>sin chocar</strong>… pero hace <strong>otra cosa</strong>, como llegar por el camino prohibido.'},
  {w:'Pista',a:'🧩 Lo que el choque o el desvío del robot <strong>nos cuenta</strong> para encontrar el bug.'},
];
let fcIdx=0;
function upFC(){document.getElementById('fcInner').classList.remove('flipped');document.getElementById('fcW').textContent=fcData[fcIdx].w;document.getElementById('fcA').innerHTML=fcData[fcIdx].a;document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length;}
function flipCard(){sfx('flip');document.getElementById('fcInner').classList.toggle('flipped');if(!xpTracker.fc.has(fcIdx)){xpTracker.fc.add(fcIdx);pts(1);}if(xpTracker.fc.size===fcData.length){fin('s-flash');unlockAchievement('flash_master');}}
function nextFC(){sfx('click');fcIdx=(fcIdx+1)%fcData.length;upFC();}
function prevFC(){sfx('click');fcIdx=(fcIdx-1+fcData.length)%fcData.length;upFC();}

// ===================== JUEGO: MEMORIA DEL CÓDIGO =====================
const memoPairs=[
  {id:'bug',t:'Bug',d:'🐛 El error del programa'},
  {id:'depurar',t:'Depurar',d:'🔍 Cazar y corregir los errores'},
  {id:'polilla',t:'Polilla de 1947',d:'👩‍💻 La encontró la programadora Grace Hopper'},
  {id:'metodo',t:'Método del detective',d:'🕵️ Observar, leer, señalar, corregir y probar'},
  {id:'logica',t:'Bug de lógica',d:'🎭 Corre sin chocar, pero hace otra cosa'},
  {id:'reprobar',t:'Volver a probar',d:'▶️ Comprobar el programa tras corregirlo'}
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
  {q:'¿Qué es un bug en programación?',o:['a) Un insecto que se come los cables','b) Un error en el programa','c) Un premio por programar bien','d) Un tipo de robot'],c:1},
  {q:'¿Quién encontró una polilla de verdad dentro de una computadora en 1947?',o:['a) Un robot mensajero','b) El inventor del teléfono','c) La programadora Grace Hopper','d) Un estudiante de Honduras'],c:2},
  {q:'¿Cuál es el PRIMER paso del método del detective?',o:['a) Borrar todo el programa','b) Observar QUÉ hace mal el programa','c) Cambiar todas las líneas','d) Pedir un robot nuevo'],c:1},
  {q:'El programa dice REPITE 5: AVANZA, pero debía repetir 3 veces. ¿Qué tipo de bug es?',o:['a) Orden cambiado','b) Instrucción de menos','c) Condición al revés','d) N del bucle errada'],c:3},
  {q:'Dos pasos de la receta están intercambiados. ¿Qué tipo de bug es?',o:['a) Orden cambiado','b) Bug de lógica','c) N del bucle errada','d) Instrucción de más'],c:0},
  {q:'Después de corregir la línea sospechosa, ¿qué debe hacer el detective?',o:['a) Guardar el programa y no tocarlo','b) Volver a probar el programa','c) Cambiar otras cinco líneas','d) Celebrar sin comprobar'],c:1},
  {q:'El programa corre sin chocar, pero el robot llega por el camino prohibido. ¿Qué tiene?',o:['a) Nada: si corre, está perfecto','b) Un bug de choque','c) Un bug de lógica','d) Una instrucción ambigua'],c:2},
  {q:'¿Cuántas cosas corrige a la vez un buen detective de bugs?',o:['a) UNA sola, y vuelve a probar','b) Todas al mismo tiempo','c) Ninguna: espera que se arreglen solas','d) Las que diga la suerte'],c:0},
  {q:'Al programa le falta la instrucción ENTREGA al final. ¿Qué tipo de bug es?',o:['a) Condición al revés','b) Instrucción de menos (falta una)','c) N del bucle errada','d) Bug de giro'],c:1},
];
let qzIdx=0,qzSel=-1,qzDone=false;
function buildQz(){qzIdx=0;qzSel=-1;qzDone=false;showQz();}
function showQz(){if(qzIdx>=qzData.length){document.getElementById('qzQ').textContent='🎉 ¡Quiz completado!';document.getElementById('qzOpts').innerHTML='';fin('s-quiz');unlockAchievement('primer_quiz');return;}const q=qzData[qzIdx];document.getElementById('qzProg').textContent=`Pregunta ${qzIdx+1} de ${qzData.length}`;document.getElementById('qzQ').textContent=q.q;const opts=document.getElementById('qzOpts');opts.innerHTML='';q.o.forEach((o,i)=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=o;b.onclick=()=>{if(qzDone)return;document.querySelectorAll('.qz-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');qzSel=i;sfx('click');};opts.appendChild(b);});qzDone=false;}
function checkQz(){if(qzSel<0)return fb('fbQz','Selecciona una respuesta.',false);qzDone=true;const opts=document.querySelectorAll('.qz-opt');if(qzSel===qzData[qzIdx].c){opts[qzSel].classList.add('correct');fb('fbQz','¡Correcto! +5 XP',true);if(!xpTracker.qz.has(qzIdx)){xpTracker.qz.add(qzIdx);pts(5);}sfx('ok');}else{opts[qzSel].classList.add('wrong');opts[qzData[qzIdx].c].classList.add('correct');fb('fbQz','Incorrecto. Revisa la respuesta correcta.',false);sfx('no');}setTimeout(()=>{qzIdx++;qzSel=-1;showQz();},1600);}
function resetQz(){sfx('click');qzIdx=0;qzSel=-1;qzDone=false;showQz();document.getElementById('fbQz').classList.remove('show');}

// ===================== CLASIFICACIÓN =====================
const classGroups=[
  {label:['Instrucción errada','Sobra o falta'],headA:'↔️ Instrucción errada',headB:'➕ Sobra o falta',colA:'err',colB:'sf',
   words:[{w:'Dice GIRA IZQUIERDA, debía DERECHA',t:'err'},{w:'Falta la ENTREGA final',t:'sf'},{w:'Dice AVANZA donde iba un giro',t:'err'},{w:'Hay un AVANZA de más',t:'sf'},{w:'Dice Sur donde debía decir Norte',t:'err'},{w:'Se saltó el paso de amasar',t:'sf'},{w:'Riega con lodo en vez de agua',t:'err'},{w:'Sobra un giro al inicio',t:'sf'},{w:'ENTREGA donde iba AVANZA',t:'err'},{w:'Falta regar la última planta',t:'sf'}]},
  {label:['Orden cambiado','N o condición errada'],headA:'🔀 Orden cambiado',headB:'🔁 N o condición errada',colA:'ord',colB:'nc',
   words:[{w:'Dobla la baleada antes de untar frijoles',t:'ord'},{w:'REPITE 4 en vez de REPITE 3',t:'nc'},{w:'El giro va después, no antes',t:'ord'},{w:'SI HAY PARED: AVANZA (al revés)',t:'nc'},{w:'Zapatos antes que calcetines',t:'ord'},{w:'Da 5 vueltas en vez de 2',t:'nc'},{w:'Primero cosecha y después siembra',t:'ord'},{w:'SI NO llegó: ENTREGA (volteado)',t:'nc'}]},
  {label:['Instrucción errada','Orden cambiado'],headA:'↔️ Instrucción errada',headB:'🔀 Orden cambiado',colA:'err',colB:'ord',
   words:[{w:'Dice GIRA DERECHA, debía IZQUIERDA',t:'err'},{w:'Dos líneas intercambiadas',t:'ord'},{w:'Escribió AVANZA en vez de ENTREGA',t:'err'},{w:'Sirve el fresco antes de colarlo',t:'ord'},{w:'Puso Oeste donde iba Este',t:'err'},{w:'Iza la bandera antes de amarrarla',t:'ord'},{w:'Echa sal donde iba azúcar',t:'err'},{w:'Enjuaga antes de frotar el jabón',t:'ord'}]},
  {label:['Sobra o falta','N o condición errada'],headA:'➕ Sobra o falta',headB:'🔁 N o condición errada',colA:'sf',colB:'nc',
   words:[{w:'Falta el paso de enjuagar',t:'sf'},{w:'REPITE 2 cuando debía ser 4',t:'nc'},{w:'Sobra un AVANZA al final',t:'sf'},{w:'La condición SI está volteada',t:'nc'},{w:'Se olvidó de la ENTREGA',t:'sf'},{w:'Reparte 9 cuadernos y son 10 (una vuelta de menos)',t:'nc'},{w:'Copió dos veces la misma línea',t:'sf'},{w:'SI HAY sol: abre el paraguas (al revés)',t:'nc'}]},
];
let currentClassGroupIdx=0,clsSelectedWord=null;
function buildClass(){const group=classGroups[currentClassGroupIdx];document.getElementById('col-left-head').textContent=group.headA;document.getElementById('col-right-head').textContent=group.headB;const bank=document.getElementById('clsBank');bank.innerHTML='';clsSelectedWord=null;document.getElementById('items-left').innerHTML='';document.getElementById('items-right').innerHTML='';_shuffle([...group.words]).forEach(w=>{const el=document.createElement('div');el.className='wb-item';el.textContent=w.w;el.dataset.t=w.t;el.onclick=()=>{document.querySelectorAll('.wb-item').forEach(i=>i.classList.remove('sel-word'));el.classList.add('sel-word');clsSelectedWord=el;sfx('click');};bank.appendChild(el);});['col-left','col-right'].forEach(colId=>{const col=document.getElementById(colId);col.onclick=(e)=>{if(!clsSelectedWord||e.target.classList.contains('drop-item'))return;const targetId=colId==='col-left'?'items-left':'items-right';const wordsCol=document.getElementById(targetId);const item=document.createElement('div');item.className='drop-item';item.textContent=clsSelectedWord.textContent;item.dataset.t=clsSelectedWord.dataset.t;const original=clsSelectedWord;item.onclick=(ev)=>{ev.stopPropagation();if(clsSelectedWord!==null){col.click();}else{document.getElementById('clsBank').appendChild(original);original.classList.remove('sel-word');item.remove();if(typeof sfx==='function')sfx('click');}};wordsCol.appendChild(item);clsSelectedWord.remove();clsSelectedWord=null;sfx('click');};});}
function checkClass(){const remaining=document.querySelectorAll('#clsBank .wb-item').length;if(remaining>0){fb('fbCls','Mueve todas las palabras a las columnas primero.',false);return;}const group=classGroups[currentClassGroupIdx];let allOk=true;document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{const inLeft=el.parentElement.id==='items-left';const expectedType=inLeft?group.colA:group.colB;if(el.dataset.t===expectedType){el.classList.add('cls-ok');}else{el.classList.add('cls-no');allOk=false;}});if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);}if(allOk){fb('fbCls','¡Perfecto! +5 XP',true);sfx('fan');fin('s-clasifica');unlockAchievement('clasif_pro');}else{fb('fbCls','Hay errores. Marcados en rojo.',false);sfx('no');}}
function nextClassGroup(){sfx('click');currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length;buildClass();document.getElementById('fbCls').classList.remove('show');showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]);}
function resetClass(){sfx('click');buildClass();document.getElementById('fbCls').classList.remove('show');}

// ===================== IDENTIFICAR =====================
const idData=[
  {s:['Un','bug','es','un','error','del','programa,','no','un','insecto','de','verdad.'],c:1,art:'El nombre del error del programa'},
  {s:['Depurar','es','encontrar','y','corregir','los','errores','del','programa.'],c:0,art:'La acción del detective de bugs'},
  {s:['La','programadora','Grace','Hopper','encontró','una','polilla','en','1947.'],c:6,art:'Lo que apareció dentro de la computadora'},
  {s:['El','detective','corrige','una','sola','cosa','y','vuelve','a','probar.'],c:9,art:'Lo que se hace de nuevo después de corregir'},
  {s:['El','bug','de','lógica','corre','sin','chocar,','pero','hace','otra','cosa.'],c:3,art:'El apellido del bug que corre pero engaña'},
  {s:['Si','el','bucle','dice','REPITE','4','en','vez','de','3,','su','N','está','errada.'],c:2,art:'La estructura que repite instrucciones'},
  {s:['El','primer','paso','del','método','es','observar','qué','hace','mal','el','programa.'],c:6,art:'El primer paso del método del detective'},
  {s:['La','línea','sospechosa','se','lee','despacio,','con','lupa.'],c:2,art:'Cómo se llama la línea que parece culpable'},
];
let idIdx=0,idDone=false;
function showId(){idDone=false;if(idIdx>=idData.length){document.getElementById('idSent').innerHTML='🎉 ¡Completado!';fin('s-identifica');unlockAchievement('id_master');return;}const d=idData[idIdx];document.getElementById('idProg').textContent=`Oración ${idIdx+1} de ${idData.length}`;document.getElementById('idInfo').textContent=`Busca: ${d.art}`;const sent=document.getElementById('idSent');sent.innerHTML='';d.s.forEach((w,i)=>{const span=document.createElement('span');span.className='id-word';span.textContent=w+' ';span.onclick=()=>checkId(i,span);sent.appendChild(span);});}
function checkId(i,span){if(idDone)return;document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected'));span.classList.add('selected');if(i===idData[idIdx].c){idDone=true;span.classList.add('id-ok');fb('fbId','¡Correcto! +5 XP',true);if(!xpTracker.id.has(idIdx)){xpTracker.id.add(idIdx);pts(5);}sfx('ok');}else{span.classList.add('id-no');fb('fbId','Ese no es el término solicitado.',false);sfx('no');}}
function nextId(){sfx('click');idIdx++;showId();document.getElementById('fbId').classList.remove('show');}
function resetId(){sfx('click');idIdx=0;showId();document.getElementById('fbId').classList.remove('show');}

// ===================== COMPLETA =====================
const cmpData=[
  {s:'Un error en el programa se llama ___.',opts:['bug','premio','mapa'],c:0},
  {s:'Encontrar y corregir los errores se llama ___.',opts:['ejecutar','depurar','dibujar'],c:1},
  {s:'En 1947, la programadora Grace Hopper encontró una ___ dentro de la computadora.',opts:['polilla','araña','moneda'],c:0},
  {s:'Después de corregir el bug, siempre hay que volver a ___.',opts:['borrar','dormir','probar'],c:2},
  {s:'El buen detective corrige ___ cosa a la vez.',opts:['una','toda','ninguna'],c:0},
  {s:'Si el bucle repite 4 veces en vez de 3, su ___ está errada.',opts:['casa','N','lupa'],c:1},
  {s:'El bug de ___ corre sin chocar, pero hace otra cosa.',opts:['choque','giro','lógica'],c:2},
  {s:'Leer el programa línea por línea es usar la ___ del detective.',opts:['lupa','gorra','mochila'],c:0},
];
let cmpIdx=0,cmpSel=-1,cmpDone=false;
function showCmp(){if(cmpIdx>=cmpData.length){document.getElementById('cmpSent').innerHTML='🎉 ¡Completado!';document.getElementById('cmpOpts').innerHTML='';fin('s-completa');return;}const d=cmpData[cmpIdx];document.getElementById('cmpProg').textContent=`Oración ${cmpIdx+1} de ${cmpData.length}`;document.getElementById('cmpSent').innerHTML=d.s.replace('___','<span class="blank">___</span>');const opts=document.getElementById('cmpOpts');opts.innerHTML='';cmpSel=-1;cmpDone=false;d.opts.forEach((o,i)=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=o;b.onclick=()=>{if(cmpDone)return;document.querySelectorAll('.cmp-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');cmpSel=i;sfx('click');};opts.appendChild(b);});}
function checkCmp(){if(cmpSel<0)return fb('fbCmp','Selecciona una opción.',false);cmpDone=true;const opts=document.querySelectorAll('.cmp-opt');if(cmpSel===cmpData[cmpIdx].c){opts[cmpSel].classList.add('correct');document.getElementById('cmpSent').innerHTML=cmpData[cmpIdx].s.replace('___',`<span class="blank" style="color:var(--jade);border-color:var(--jade)">${opts[cmpSel].textContent}</span>`);fb('fbCmp','¡Correcto! +5 XP',true);if(!xpTracker.cmp.has(cmpIdx)){xpTracker.cmp.add(cmpIdx);pts(5);}sfx('ok');}else{opts[cmpSel].classList.add('wrong');opts[cmpData[cmpIdx].c].classList.add('correct');fb('fbCmp','Incorrecto. Revisa bien la respuesta.',false);sfx('no');}setTimeout(()=>{cmpIdx++;document.getElementById('fbCmp').classList.remove('show');showCmp();},1600);}

// ===================== WIDGETS =====================
// Widget 1: Ordena el algoritmo
const routeSets=[
  {label:'El método del detective de bugs (en orden)',steps:['Observar QUÉ hace mal el programa','Leer el programa con lupa, línea por línea','Señalar la línea sospechosa','Corregir UNA sola cosa','Volver a probar el programa']},
  {label:'Depurar la receta de la baleada (en orden)',steps:['Probar la baleada y notar que sabe rara','Leer los pasos de la receta uno por uno','Descubrir el paso equivocado','Corregir solo ese paso','Preparar la baleada otra vez para comprobar']},
  {label:'Cazar el bug del robot (en orden)',steps:['Ejecutar el programa y ver al robot chocar','Trazar el programa con el dedo sobre el mapa','Encontrar la línea donde el robot se desvía','Cambiar solo esa línea','Ejecutar de nuevo hasta verlo llegar']},
];
let currentRouteIdx=0,routeItems=[];
function buildRoute(){routeItems=_shuffle([...routeSets[currentRouteIdx].steps]);renderRoute();const fbEl=document.getElementById('fbRoute');if(fbEl)fbEl.classList.remove('show');}
function renderRoute(){const list=document.getElementById('routeList');if(!list)return;list.innerHTML='';routeItems.forEach((step,i)=>{const div=document.createElement('div');div.className='sort-item';div.innerHTML=`<div class="sort-arrows"><button class="sort-arrow" onclick="routeMove(${i},-1)"${i===0?' disabled':''}>▲</button><button class="sort-arrow" onclick="routeMove(${i},1)"${i===routeItems.length-1?' disabled':''}>▼</button></div><div class="sort-step-num">${i+1}.</div><div class="sort-item-txt">${step}</div>`;list.appendChild(div);});}
function routeMove(idx,dir){sfx('click');const ni=idx+dir;if(ni<0||ni>=routeItems.length)return;[routeItems[idx],routeItems[ni]]=[routeItems[ni],routeItems[idx]];renderRoute();}
function checkRoute(){const correct=routeSets[currentRouteIdx].steps;const isOk=routeItems.every((s,i)=>s===correct[i]);if(isOk){fb('fbRoute','¡Perfecto! Orden correcto. +4 XP',true);if(!xpTracker.wgt.has('route_'+currentRouteIdx)){xpTracker.wgt.add('route_'+currentRouteIdx);pts(4);}sfx('fan');fin('s-widgets');unlockAchievement('widgets_master');}else{fb('fbRoute','Hay pasos fuera de orden. Revisa el arreglo.',false);sfx('no');}}
function nextRoute(){sfx('click');currentRouteIdx=(currentRouteIdx+1)%routeSets.length;buildRoute();showToast('🔄 Secuencia: '+routeSets[currentRouteIdx].label);}

// Widget 2: Antes de probar (predice qué hará el programa con bug, IDs estándar «neuron»)
// Cada resultado se calcula con simRunX: la respuesta SIEMPRE coincide con el simulador.
function _resultadoTxt(d){
  const res=simRunX({r:d.r,c:d.c,dir:d.dir},d.prog,{n:d.n,obst:(d.obst||[]).map(o=>o[0]+','+o[1])});
  if(!res.ok)return res.evento==='borde'?'💥 Choca contra el borde del mapa':'💥 Choca contra un árbol 🌳';
  if(res.entregaEn){
    if(res.entregaEn[0]===d.dest[0]&&res.entregaEn[1]===d.dest[1])return '✅ Llega a la meta y entrega';
    return '📭 Entrega en '+coordName(res.entregaEn[0],res.entregaEn[1])+', la casilla equivocada';
  }
  return '🚶 Termina en '+coordName(res.st.r,res.st.c)+' sin entregar';
}
const _wgtPredDefs=[
  {n:3,r:2,c:0,dir:'N',dest:[0,0],prog:['REPITE 3: AVANZA','ENTREGA']},
  {n:3,r:2,c:1,dir:'N',dest:[0,1],obst:[[1,1]],prog:['AVANZA','AVANZA','ENTREGA']},
  {n:3,r:2,c:0,dir:'N',dest:[0,0],prog:['AVANZA','AVANZA','ENTREGA']},
  {n:3,r:2,c:2,dir:'N',dest:[0,2],prog:['AVANZA','ENTREGA']},
  {n:3,r:2,c:0,dir:'E',dest:[2,2],prog:['REPITE 2: AVANZA']},
  {n:3,r:2,c:0,dir:'N',dest:[0,2],prog:['AVANZA','AVANZA','GIRA IZQUIERDA','AVANZA','ENTREGA']},
];
const neuronPartes=_wgtPredDefs.map(d=>{
  const ans=_resultadoTxt(d);
  const otras=[];
  for(let r=0;r<d.n;r++)for(let c=0;c<d.n;c++){if(!(r===d.dest[0]&&c===d.dest[1]))otras.push(coordName(r,c));}
  const pool=['💥 Choca contra el borde del mapa','💥 Choca contra un árbol 🌳','✅ Llega a la meta y entrega','📭 Entrega en '+otras[0]+', la casilla equivocada','🚶 Termina en '+otras[otras.length-1]+' sin entregar'].filter(t=>t!==ans);
  const opts=[ans,..._shuffle(pool).slice(0,3)];
  return{desc:`<div>La misión era llegar a <strong>${coordName(d.dest[0],d.dest[1])}</strong> 🏠 y entregar. El robot parte de <strong>${coordName(d.r,d.c)}</strong> mirando al <strong>${DIR_NOMBRE[d.dir]}</strong>. ¿Qué hará este programa?</div><div class="w-prog">${d.prog.map((p,i)=>'Línea '+(i+1)+': '+p).join('<br>')}</div><div style="margin-top:0.4rem;">${svgGridHTML({n:d.n,robot:{r:d.r,c:d.c,dir:d.dir},dest:d.dest,obst:d.obst||[],w:150})}</div>`,ans,opts};
});
let neuronIdx=0,neuronDone=false;
function showNeuron(){neuronDone=false;if(neuronIdx>=neuronPartes.length){const el=document.getElementById('neuronDesc');if(el)el.innerHTML='🎉 ¡Predijiste todos los recorridos!';const opts=document.getElementById('neuronOpts');if(opts)opts.innerHTML='';fin('s-widgets');return;}const d=neuronPartes[neuronIdx];const prog=document.getElementById('neuronProg');if(prog)prog.textContent=`Recorrido ${neuronIdx+1} de ${neuronPartes.length}`;const desc=document.getElementById('neuronDesc');if(desc)desc.innerHTML=d.desc;const opts=document.getElementById('neuronOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=opt;b.onclick=()=>checkNeuron(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuron');if(fbEl)fbEl.classList.remove('show');}
function checkNeuron(opt,btn,d){if(neuronDone)return;neuronDone=true;document.querySelectorAll('#neuronOpts .cmp-opt').forEach(b=>{if(b.textContent===d.ans)b.classList.add('correct');else if(b===btn&&b.textContent!==d.ans)b.classList.add('wrong');});const isOk=opt===d.ans;if(isOk){fb('fbNeuron','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuron_'+neuronIdx)){xpTracker.wgt.add('neuron_'+neuronIdx);pts(3);}sfx('ok');}else{fb('fbNeuron','La respuesta correcta es: '+d.ans,false);sfx('no');}}
function nextNeuron(){sfx('click');neuronIdx++;showNeuron();}
function resetNeuron(){sfx('click');neuronIdx=0;showNeuron();}

// Widget 3: ¿Línea culpable? (tocar la línea del bug, IDs estándar «neuro»)
// Casos armados a mano y VERIFICADOS al construirse: el buggeado falla, el bueno llega.
const _wgtCulpDefs=[
  {n:3,r:2,c:0,dir:'N',dest:[0,1],buena:['AVANZA','AVANZA','GIRA DERECHA','AVANZA','ENTREGA'],bi:2,malaInstr:'GIRA IZQUIERDA'},
  {n:3,r:2,c:0,dir:'N',dest:[0,2],buena:['REPITE 2: AVANZA','GIRA DERECHA','REPITE 2: AVANZA','ENTREGA'],bi:0,malaInstr:'REPITE 3: AVANZA'},
  {n:3,r:2,c:2,dir:'N',dest:[1,0],buena:['AVANZA','GIRA IZQUIERDA','AVANZA','AVANZA','ENTREGA'],bi:2,malaInstr:'GIRA IZQUIERDA'},
  {n:4,r:3,c:0,dir:'N',dest:[0,1],buena:['REPITE 3: AVANZA','GIRA DERECHA','AVANZA','ENTREGA'],bi:1,malaInstr:'GIRA IZQUIERDA'},
  {n:3,r:2,c:1,dir:'N',dest:[0,1],buena:['AVANZA','AVANZA','ENTREGA'],bi:1,malaInstr:'ENTREGA'},
];
function _casoLlega(def,prog){
  const res=simRunX({r:def.r,c:def.c,dir:def.dir},prog,{n:def.n,obst:(def.obst||[]).map(o=>o[0]+','+o[1])});
  return res.ok&&!!res.entregaEn&&res.entregaEn[0]===def.dest[0]&&res.entregaEn[1]===def.dest[1];
}
const neuroPairs=_wgtCulpDefs.map(d=>{
  const mala=[...d.buena];mala[d.bi]=d.malaInstr;
  if(_casoLlega(d,mala)||!_casoLlega(d,d.buena))console.warn('⚠️ Caso mal plantado en ¿Línea culpable?',d);
  return{
    trans:`<div>Meta: llegar a la casa 🏠 en <strong>${coordName(d.dest[0],d.dest[1])}</strong> y entregar. ¡Este programa tiene UN bug!</div><div style="display:flex;gap:0.8rem;align-items:center;justify-content:center;flex-wrap:wrap;"><div>${svgGridHTML({n:d.n,robot:{r:d.r,c:d.c,dir:d.dir},dest:d.dest,w:140})}</div><div class="w-prog" style="text-align:left;">${mala.map((p,i)=>'Línea '+(i+1)+': '+p).join('<br>')}</div></div>`,
    func:'Línea '+(d.bi+1)+' (debe decir '+d.buena[d.bi]+')',
    opts:mala.map((p,i)=>'Línea '+(i+1)+(i===d.bi?' (debe decir '+d.buena[d.bi]+')':' (está bien)'))
  };
});
let neuroIdx=0,neuroDone=false;
function showNeuro(){neuroDone=false;if(neuroIdx>=neuroPairs.length){const el=document.getElementById('neuroTrans');if(el)el.innerHTML='🎉 ¡Todos los bugs atrapados!';const opts=document.getElementById('neuroOpts');if(opts)opts.innerHTML='';return;}const d=neuroPairs[neuroIdx];const prog=document.getElementById('neuroProg');if(prog)prog.textContent=`${neuroIdx+1} de ${neuroPairs.length}`;const trans=document.getElementById('neuroTrans');if(trans)trans.innerHTML=d.trans;const opts=document.getElementById('neuroOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkNeuro(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuro');if(fbEl)fbEl.classList.remove('show');}
function checkNeuro(opt,btn,d){if(neuroDone)return;neuroDone=true;document.querySelectorAll('#neuroOpts .qz-opt').forEach(b=>{if(b.textContent===d.func)b.classList.add('correct');else if(b===btn&&b.textContent!==d.func)b.classList.add('wrong');});const isOk=opt===d.func;if(isOk){fb('fbNeuro','¡Bug atrapado! +3 XP',true);if(!xpTracker.wgt.has('neuro_'+neuroIdx)){xpTracker.wgt.add('neuro_'+neuroIdx);pts(3);}sfx('ok');}else{fb('fbNeuro','El bug estaba en: '+d.func,false);sfx('no');}setTimeout(()=>{neuroIdx++;showNeuro();},1800);}
function resetNeuro(){sfx('click');neuroIdx=0;showNeuro();}

// Widget 4: Corrige y gana (elegir la corrección correcta entre 3, IDs estándar «enfer»)
// Verificado al construirse: con la corrección elegida el robot LLEGA; con el bug, NO.
const _wgtFixDefs=[
  {n:3,r:2,c:0,dir:'N',dest:[0,0],buena:['AVANZA','AVANZA','ENTREGA'],bi:1,malaInstr:'GIRA DERECHA',opts:['AVANZA','GIRA IZQUIERDA','ENTREGA']},
  {n:3,r:2,c:1,dir:'N',dest:[0,1],buena:['REPITE 2: AVANZA','ENTREGA'],bi:0,malaInstr:'REPITE 1: AVANZA',opts:['REPITE 2: AVANZA','REPITE 3: AVANZA','GIRA DERECHA']},
  {n:3,r:0,c:0,dir:'S',dest:[0,2],buena:['GIRA IZQUIERDA','AVANZA','AVANZA','ENTREGA'],bi:0,malaInstr:'GIRA DERECHA',opts:['GIRA IZQUIERDA','AVANZA','ENTREGA']},
  {n:3,r:2,c:2,dir:'N',dest:[0,1],buena:['AVANZA','AVANZA','GIRA IZQUIERDA','AVANZA','ENTREGA'],bi:3,malaInstr:'GIRA IZQUIERDA',opts:['AVANZA','GIRA DERECHA','REPITE 2: AVANZA']},
  {n:4,r:3,c:2,dir:'N',dest:[0,2],buena:['REPITE 3: AVANZA','ENTREGA'],bi:0,malaInstr:'REPITE 4: AVANZA',opts:['REPITE 3: AVANZA','REPITE 2: AVANZA','GIRA IZQUIERDA']},
  {n:3,r:1,c:0,dir:'N',dest:[0,1],buena:['AVANZA','GIRA DERECHA','AVANZA','ENTREGA'],bi:3,malaInstr:'AVANZA',opts:['ENTREGA','GIRA IZQUIERDA','AVANZA']},
];
const enfermedadData=_wgtFixDefs.map(d=>{
  const mala=[...d.buena];mala[d.bi]=d.malaInstr;
  if(_casoLlega(d,mala)||!_casoLlega(d,d.buena))console.warn('⚠️ Caso mal plantado en Corrige y gana',d);
  return{
    disease:`<div style="font-size:0.9rem;">La línea culpable ya está señalada 🚨: la <strong>Línea ${d.bi+1}</strong>. Meta: casa 🏠 en <strong>${coordName(d.dest[0],d.dest[1])}</strong>.</div><div style="display:flex;gap:0.8rem;align-items:center;justify-content:center;flex-wrap:wrap;margin-top:0.3rem;"><div>${svgGridHTML({n:d.n,robot:{r:d.r,c:d.c,dir:d.dir},dest:d.dest,w:130})}</div><div class="w-prog" style="text-align:left;">${mala.map((p,i)=>(i===d.bi?'<strong>🚨 Línea '+(i+1)+': '+p+'</strong>':'Línea '+(i+1)+': '+p)).join('<br>')}</div></div><div style="font-size:0.9rem;margin-top:0.3rem;">¿Qué debe decir la Línea ${d.bi+1}?</div>`,
    characteristic:d.buena[d.bi],
    opts:d.opts
  };
});
let enferIdx=0,enferDone=false;
function showEnfer(){enferDone=false;if(enferIdx>=enfermedadData.length){const el=document.getElementById('enferDisease');if(el)el.innerHTML='🎉 ¡Completado! Corregiste todos los programas.';const opts=document.getElementById('enferOpts');if(opts)opts.innerHTML='';return;}const d=enfermedadData[enferIdx];const prog=document.getElementById('enferProg');if(prog)prog.textContent=`${enferIdx+1} de ${enfermedadData.length}`;const dis=document.getElementById('enferDisease');if(dis)dis.innerHTML=d.disease;const opts=document.getElementById('enferOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkEnfer(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbEnfer');if(fbEl)fbEl.classList.remove('show');}
function checkEnfer(opt,btn,d){if(enferDone)return;enferDone=true;document.querySelectorAll('#enferOpts .qz-opt').forEach(b=>{if(b.textContent===d.characteristic)b.classList.add('correct');else if(b===btn&&b.textContent!==d.characteristic)b.classList.add('wrong');});const isOk=opt===d.characteristic;if(isOk){fb('fbEnfer','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('enfer_'+enferIdx)){xpTracker.wgt.add('enfer_'+enferIdx);pts(3);}sfx('ok');}else{fb('fbEnfer','Correcto: '+d.characteristic,false);sfx('no');}setTimeout(()=>{enferIdx++;showEnfer();},1800);}
function resetEnfer(){sfx('click');enferIdx=0;showEnfer();}

// ===================== RETO FINAL =====================
const retoPairs=[
  {label:['Es un bug','No es un bug'],btnA:'🐛 Es un bug',btnB:'✅ No es un bug',colA:'bug',colB:'nobug',
   words:[{w:'Dice GIRA IZQUIERDA, debía DERECHA',t:'bug'},{w:'El robot llegó y entregó',t:'nobug'},{w:'REPITE 4 en vez de REPITE 3',t:'bug'},{w:'El programa está en orden',t:'nobug'},{w:'Falta la ENTREGA final',t:'bug'},{w:'El robot esquivó el árbol',t:'nobug'},{w:'Dos pasos intercambiados',t:'bug'},{w:'La baleada salió deliciosa',t:'nobug'},{w:'La condición SI está al revés',t:'bug'},{w:'Termina justo en la meta',t:'nobug'}]},
  {label:['Buen detective','Mal detective'],btnA:'🕵️ Buen detective',btnB:'🙈 Mal detective',colA:'buen',colB:'mal',
   words:[{w:'Corrige UNA cosa a la vez',t:'buen'},{w:'Cambia todo el programa de golpe',t:'mal'},{w:'Vuelve a probar tras corregir',t:'buen'},{w:'Nunca vuelve a probar',t:'mal'},{w:'Lee línea por línea con lupa',t:'buen'},{w:'Adivina sin leer el programa',t:'mal'},{w:'Traza el programa con el dedo',t:'buen'},{w:'Borra todo y se enoja',t:'mal'},{w:'Busca pistas en el choque',t:'buen'},{w:'Le echa la culpa al robot',t:'mal'}]},
  {label:['Bug de choque','Bug de lógica'],btnA:'💥 De choque',btnB:'🎭 De lógica',colA:'choque',colB:'logica',
   words:[{w:'El robot se sale del mapa',t:'choque'},{w:'Llega por el camino prohibido',t:'logica'},{w:'Choca contra el árbol 🌳',t:'choque'},{w:'Entrega en la casa equivocada',t:'logica'},{w:'Se estrella contra la pared',t:'choque'},{w:'El fresco quedó sin azúcar',t:'logica'},{w:'El programa truena a media ruta',t:'choque'},{w:'Corre bien, pero da lo incorrecto',t:'logica'}]},
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
function genTask(){sfx('click');const type=document.getElementById('tgType').value;const count=parseInt(document.getElementById('tgCount').value);ansVisible=false;const out=document.getElementById('tgOut');out.innerHTML='';if(type==='caza')genCazaTask(out,count);else if(type==='tipo')genTipoTask(out,count);else if(type==='predice')genPrediceTask(out,count);else if(type==='corrige')genCorrigeTask(out,count);fin('s-tareas');}
function _instrBlock(out,title,lines){const ib=document.createElement('div');ib.className='tg-instruction-block';ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join('');out.appendChild(ib);}
// Genera un caso con UN bug plantado: {k, buena, mala, bi} (el corrupto NO llega)
function _rndCasoBug(){
  for(let intento=0;intento<60;intento++){
    const k=_rndCaso();
    const buena=planRuta(k.sr,k.sc,k.dr,k.dc,k.dir);
    let bi=_rndInt(0,Math.max(0,buena.length-2));
    for(let t=0;t<buena.length-1;t++){
      const idx=(bi+t)%(buena.length-1);
      const cand=[...buena];
      cand[idx]=cand[idx]===I_AV?I_GD:(cand[idx]===I_GD?I_GI:I_GD);
      const res=simRun({r:k.sr,c:k.sc,dir:k.dir},cand.slice(0,-1),{n:4});
      if(!res.ok||res.st.r!==k.dr||res.st.c!==k.dc)return{k,buena,mala:cand,bi:idx};
    }
  }
  return null;
}
function genCazaTask(out,count){_instrBlock(out,'Instrucción',['Cada programa debería llevar al robot 🤖 hasta la casa 🏠 y entregar, pero tiene UN bug. Usa el método del detective: traza con el dedo, escribe el número de la línea culpable y la instrucción correcta.']);for(let i=0;i<count;i++){const c=_rndCasoBug();if(!c)continue;const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>Robot en ${coordName(c.k.sr,c.k.sc)} mirando al ${DIR_NOMBRE[c.k.dir]} · casa en ${coordName(c.k.dr,c.k.dc)}.</strong><div style="margin-top:0.4rem;">${svgGridHTML({n:4,robot:{r:c.k.sr,c:c.k.sc,dir:c.k.dir},dest:[c.k.dr,c.k.dc],w:150})}</div><div class="tg-prog">${c.mala.map((p,j)=>'Línea '+(j+1)+': '+p).join('<br>')}</div><div style="margin-top:0.4rem;font-size:0.85rem;">Línea culpable: <span class="tg-blank">&nbsp;</span> · Corrección: <span class="tg-blank">&nbsp;</span></div><div class="tg-answer">✅ Línea ${c.bi+1}: debe decir ${c.buena[c.bi]}</div></div>`;out.appendChild(div);}}
const _tipoBugGens=[
  ()=>{const a=_rndInt(0,1)?['GIRA DERECHA','GIRA IZQUIERDA']:['GIRA IZQUIERDA','GIRA DERECHA'];return{txt:`El programa dice «${a[0]}» donde debía decir «${a[1]}». El robot voltea hacia el lado contrario.`,ans:'Instrucción equivocada'};},
  ()=>{const k=_rndInt(2,5);return{txt:`El bucle dice «REPITE ${k+1}: AVANZA», pero la casa está a solo ${k} casillas. El robot se pasa.`,ans:'N del bucle errada'};},
  ()=>{const t=[['untar los frijoles','doblar la baleada'],['amarrar la bandera','izarla'],['ponerse las calcetas','ponerse los zapatos'],['colar el fresco','servirlo']][_rndInt(0,3)];return{txt:`El algoritmo manda «${t[1]}» ANTES de «${t[0]}».`,ans:'Orden cambiado'};},
  ()=>{const f=['la ENTREGA final','un AVANZA del camino','el paso de enjuagar el jabón'][_rndInt(0,2)];return{txt:`Al programa le falta ${f}: se saltó un paso.`,ans:'Instrucción de menos'};},
  ()=>{const s=['un giro que nadie pidió','un AVANZA repetido dos veces','una ENTREGA a media ruta'][_rndInt(0,2)];return{txt:`Al programa le sobra ${s}: tiene un paso de más.`,ans:'Instrucción de más'};},
  ()=>({txt:'El programa dice «SI HAY PARED: AVANZA» cuando debía decir «SI NO HAY pared: AVANZA».',ans:'Condición al revés'}),
  ()=>{const c=coordName(_rndInt(0,3),_rndInt(0,3));return{txt:`El robot llega a la meta y entrega… pero cruzó la casilla prohibida ${c}. El programa corre sin chocar.`,ans:'Bug de lógica'};},
];
function genTipoTask(out,count){_instrBlock(out,'Instrucción',['Lee cada caso y escribe QUÉ TIPO de bug es: instrucción equivocada · instrucción de más · instrucción de menos · orden cambiado · N del bucle errada · condición al revés · bug de lógica.']);for(let i=0;i<count;i++){const g=_tipoBugGens[_rndInt(0,_tipoBugGens.length-1)]();const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${g.txt}</strong><div style="margin-top:0.4rem;font-size:0.85rem;">Tipo de bug: <span class="tg-blank">&nbsp;</span></div><div class="tg-answer">✅ ${g.ans}</div></div>`;out.appendChild(div);}}
function genPrediceTask(out,count){_instrBlock(out,'Instrucción',['Cada programa tiene un bug. ANTES de imaginar la ejecución, traza el recorrido con el dedo y escribe qué pasará: ¿choca contra el borde, choca con un árbol, entrega donde no es o se queda sin entregar?']);for(let i=0;i<count;i++){const c=_rndCasoBug();if(!c)continue;const d={n:4,r:c.k.sr,c:c.k.sc,dir:c.k.dir,dest:[c.k.dr,c.k.dc],prog:c.mala};const ans=_resultadoTxt(d);const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>Robot en ${coordName(c.k.sr,c.k.sc)} mirando al ${DIR_NOMBRE[c.k.dir]} · debía llegar a ${coordName(c.k.dr,c.k.dc)} 🏠.</strong><div class="tg-prog">${c.mala.map((p,j)=>'Línea '+(j+1)+': '+p).join('<br>')}</div><div style="margin-top:0.4rem;font-size:0.85rem;">¿Qué hará el programa? <span class="tg-blank">&nbsp;</span></div><div class="tg-answer">✅ ${ans}</div></div>`;out.appendChild(div);}}
function genCorrigeTask(out,count){_instrBlock(out,'Instrucción',['La línea culpable ya está señalada 🚨. Escribe la CORRECCIÓN (qué debe decir esa línea) y POR QUÉ, y recuerda el último paso del detective: volver a probar.']);for(let i=0;i<count;i++){const c=_rndCasoBug();if(!c)continue;const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>Robot en ${coordName(c.k.sr,c.k.sc)} mirando al ${DIR_NOMBRE[c.k.dir]} · casa en ${coordName(c.k.dr,c.k.dc)} 🏠.</strong><div class="tg-prog">${c.mala.map((p,j)=>(j===c.bi?'🚨 <strong>Línea '+(j+1)+': '+p+'</strong>':'Línea '+(j+1)+': '+p)).join('<br>')}</div><div style="margin-top:0.4rem;font-size:0.85rem;">La Línea ${c.bi+1} debe decir: <span class="tg-blank">&nbsp;</span><br>Porque: <span class="tg-blank" style="min-width:200px;">&nbsp;</span></div><div class="tg-answer">✅ Debe decir ${c.buena[c.bi]}: con ${c.mala[c.bi]} el robot no llega a ${coordName(c.k.dr,c.k.dc)} y con la corrección sí llega y entrega.</div></div>`;out.appendChild(div);}}
function toggleAns(){ansVisible=!ansVisible;document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none');sfx('click');}

// ===================== SOPA DE LETRAS =====================
// Sopas generadas y verificadas por script (palabras en 8 direcciones, sin tildes)
const sopaSets=[
  {size:10,grid:[
    ['M','P','K','U','H','D','U','P','M','D'],
    ['T','I','U','V','N','Y','F','T','A','Y'],
    ['F','S','N','M','D','Y','E','V','A','D'],
    ['X','T','T','G','R','M','I','B','K','X'],
    ['L','A','H','U','O','A','E','K','I','K'],
    ['U','E','X','B','R','U','E','J','A','V'],
    ['P','T','X','K','R','M','M','N','N','M'],
    ['A','H','O','P','E','P','P','K','I','O'],
    ['L','Q','G','A','A','I','Q','H','F','L'],
    ['O','I','Y','R','B','B','G','I','V','D']
  ],words:[
    {w:'PRUEBA',cells:[[7,3],[6,4],[5,5],[4,6],[3,7],[2,8]]},
    {w:'ERROR',cells:[[7,4],[6,4],[5,4],[4,4],[3,4]]},
    {w:'PISTA',cells:[[0,1],[1,1],[2,1],[3,1],[4,1]]},
    {w:'LINEA',cells:[[8,9],[7,8],[6,7],[5,6],[4,5]]},
    {w:'LUPA',cells:[[4,0],[5,0],[6,0],[7,0]]},
    {w:'BUG',cells:[[5,3],[4,3],[3,3]]}
  ]},
  {size:10,grid:[
    ['L','J','O','B','O','D','O','T','E','M'],
    ['Q','R','E','O','R','P','R','H','P','U'],
    ['K','A','V','M','I','R','L','Z','H','E'],
    ['V','R','I','H','G','O','I','T','B','X'],
    ['L','U','T','L','E','B','U','I','M','Y'],
    ['F','P','C','H','R','A','N','C','S','A'],
    ['R','E','E','R','R','R','C','I','H','V'],
    ['O','D','T','E','O','F','A','G','H','E'],
    ['R','M','E','C','C','E','S','G','M','J'],
    ['F','T','D','N','F','K','O','H','V','V']
  ],words:[
    {w:'DETECTIVE',cells:[[9,2],[8,2],[7,2],[6,2],[5,2],[4,2],[3,2],[2,2],[1,2]]},
    {w:'CORREGIR',cells:[[8,4],[7,4],[6,4],[5,4],[4,4],[3,4],[2,4],[1,4]]},
    {w:'DEPURAR',cells:[[7,1],[6,1],[5,1],[4,1],[3,1],[2,1],[1,1]]},
    {w:'PROBAR',cells:[[1,5],[2,5],[3,5],[4,5],[5,5],[6,5]]},
    {w:'METODO',cells:[[0,9],[0,8],[0,7],[0,6],[0,5],[0,4]]},
    {w:'CASO',cells:[[6,6],[7,6],[8,6],[9,6]]}
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
  {q:'Un bug es un error en el programa, no un insecto de verdad.',a:true},
  {q:'Equivocarse al programar significa que no sirves para programar.',a:false},
  {q:'Todos los programadores, hasta los expertos, depuran sus programas.',a:true},
  {q:'Depurar es encontrar y corregir los errores de un programa.',a:true},
  {q:'El primer paso del detective es cambiar todo el programa de una vez.',a:false},
  {q:'Después de corregir un bug hay que volver a probar el programa.',a:true},
  {q:'En 1947, la programadora Grace Hopper encontró una polilla de verdad dentro de una computadora.',a:true},
  {q:'El bug de lógica siempre hace que el programa choque y se detenga.',a:false},
  {q:'Cambiar el orden de dos instrucciones puede cambiar todo el resultado.',a:true},
  {q:'Si el bucle dice REPITE 4 en lugar de REPITE 3, el robot da un paso de más.',a:true},
  {q:'Trazar el programa con el dedo ayuda a encontrar el bug antes de ejecutar.',a:true},
  {q:'Un buen detective de bugs corrige UNA sola cosa a la vez.',a:true},
  {q:'Si el programa corre sin chocar, seguro no tiene ningún bug.',a:false},
  {q:'Señalar la línea sospechosa es un paso del método del detective.',a:true},
  {q:'Una instrucción de más o de menos también es un tipo de bug.',a:true},
];
const evalMCBank=[
  {q:'¿Qué es un “bug” en programación?',o:['Un insecto que daña la computadora','Un error en el programa','Un tipo de robot','Un premio por programar bien'],a:1},
  {q:'¿Qué encontró la programadora Grace Hopper en 1947 dentro de una computadora?',o:['Una polilla de verdad','Un ratón de campo','Un tornillo suelto','Un mensaje secreto'],a:0},
  {q:'¿Qué es depurar un programa?',o:['Borrarlo completo','Encontrar y corregir sus errores','Escribirlo más largo','Ejecutarlo más rápido'],a:1},
  {q:'¿Cuál es el PRIMER paso del método del detective?',o:['Observar qué hace mal el programa','Borrar el programa','Cambiar todas las líneas a la vez','Pedir otro robot'],a:0},
  {q:'Después de corregir la línea sospechosa, ¿qué sigue?',o:['Guardar y no tocar nada','Volver a probar el programa','Cambiar otras cinco líneas','Celebrar sin comprobar'],a:1},
  {q:'El programa dice GIRA IZQUIERDA donde debía decir GIRA DERECHA. ¿Qué tipo de bug es?',o:['Instrucción equivocada','Orden cambiado','N del bucle errada','Bug de lógica'],a:0},
  {q:'El programa dice REPITE 5 pero debía repetir solo 3 veces. ¿Qué tipo de bug es?',o:['Instrucción de menos','Orden cambiado','N del bucle errada','Condición al revés'],a:2},
  {q:'Dos pasos de la receta están intercambiados. ¿Qué tipo de bug es?',o:['Instrucción equivocada','Orden cambiado','N del bucle errada','Bug de lógica'],a:1},
  {q:'El robot llega a la meta, pero pasando por la casilla prohibida. ¿Qué tipo de bug es?',o:['Instrucción de más','Orden cambiado','Condición al revés','Bug de lógica'],a:3},
  {q:'Al programa le falta la instrucción ENTREGA al final. ¿Qué tipo de bug es?',o:['Instrucción de menos (falta una)','Instrucción de más (sobra una)','Orden cambiado','Condición al revés'],a:0},
  {q:'¿Qué hace un buen detective de bugs al corregir?',o:['Cambia UNA sola cosa y vuelve a probar','Cambia todo el programa de golpe','Borra el programa completo','Adivina sin leer las líneas'],a:0},
  {q:'¿Qué significa probar el programa «paso a paso» con el dedo?',o:['Seguirlo línea por línea sobre el mapa','Tocar la pantalla muy fuerte','Leer solo la última línea','Cerrar los ojos y ejecutar'],a:0},
  {q:'El programa dice «SI HAY PARED: AVANZA» en vez de «SI NO HAY pared: AVANZA». ¿Qué tipo de bug es?',o:['N del bucle errada','Condición al revés','Instrucción de más','Orden cambiado'],a:1},
  {q:'¿Por qué equivocarse es parte de programar?',o:['Porque todos los programadores encuentran y corrigen errores','Porque los robots se equivocan solos','Porque los programas nunca funcionan','Porque así lo manda la computadora'],a:0},
  {q:'El programa corre sin chocar, pero el resultado está malo. ¿Qué tiene?',o:['Nada: si corre, está perfecto','Un bug de choque','Un bug de lógica','Una instrucción ambigua'],a:2},
];
const evalCPBank=[
  {q:'Un error en el programa se llama ___.',a:'bug'},
  {q:'Encontrar y corregir los errores de un programa se llama ___.',a:'depurar'},
  {q:'En 1947, la programadora Grace Hopper encontró una ___ de verdad dentro de la computadora.',a:'polilla'},
  {q:'El primer paso del detective es ___ qué hace mal el programa.',a:'observar'},
  {q:'Después de corregir, siempre hay que volver a ___ el programa.',a:'probar'},
  {q:'El detective lee el programa con lupa, línea por ___.',a:'línea'},
  {q:'Antes de ejecutar, conviene ___ el programa con el dedo sobre el mapa.',a:'trazar'},
  {q:'Si el programa dice GIRA IZQUIERDA en vez de GIRA DERECHA, la instrucción está ___.',a:'equivocada'},
  {q:'Si el bucle dice REPITE 4 en vez de REPITE 3, el robot da un paso de ___.',a:'más'},
  {q:'Cuando dos instrucciones están intercambiadas, el bug es de ___ cambiado.',a:'orden'},
  {q:'El bug de ___ deja correr el programa, pero hace otra cosa.',a:'lógica'},
  {q:'El buen detective corrige ___ sola cosa a la vez.',a:'una'},
  {q:'El detective señala a la línea ___ del programa antes de corregirla.',a:'sospechosa'},
  {q:'Todos los ___ depuran sus programas, hasta los más expertos.',a:'programadores'},
  {q:'Ver al robot fallar en la cuadrícula nos da una ___ para cazar el bug.',a:'pista'},
];
const evalPRBank=[
  {term:'Bug',def:'Error en el programa'},
  {term:'Depurar',def:'Encontrar y corregir los errores'},
  {term:'Grace Hopper',def:'Programadora que halló la polilla en 1947'},
  {term:'Observar',def:'Primer paso: ver qué hace mal el programa'},
  {term:'Volver a probar',def:'Último paso, después de corregir'},
  {term:'Instrucción equivocada',def:'Dice GIRA IZQUIERDA en vez de GIRA DERECHA'},
  {term:'Orden cambiado',def:'Dos instrucciones intercambiadas'},
  {term:'N del bucle errada',def:'REPITE 4 cuando debía ser REPITE 3'},
  {term:'Condición al revés',def:'El SI del programa está volteado'},
  {term:'Bug de lógica',def:'Corre sin chocar, pero hace otra cosa'},
  {term:'Línea sospechosa',def:'La línea señalada como posible culpable'},
  {term:'Trazar',def:'Seguir el programa con el dedo para predecir'},
  {term:'Pista',def:'Dato que ayuda a encontrar el bug'},
  {term:'Lupa del detective',def:'Leer el programa despacio, línea por línea'},
  {term:'Instrucción de menos',def:'Falta un paso, como la ENTREGA final'},
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

function genEval(){sfx('click');_evalFormaSelector(); const _selF = document.getElementById('evalFormaSel'); if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10))); const cf = evalFormNum; const rng = _evalRng(cf); window._currentEvalForm=cf;evalFormNum = (evalFormNum % EVAL_FORMAS) + 1; _evalFormaSelector();saveProgress();document.getElementById('eval-screen-title').textContent=`🎓 Evaluación Final · Forma ${cf} · Detective de Bugs: la Depuración`;evalAnsVisible=false;const out=document.getElementById('evalOut');out.innerHTML='';const bar=document.createElement('div');bar.className='eval-score-bar';bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje · 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25 pts</span><span class="eval-score-pill esp-tf">V/F 25 pts</span><span class="eval-score-pill esp-mc">Selección 25 pts</span><span class="eval-score-pill esp-pr">Pareados 25 pts</span></div>`;out.appendChild(bar);const cpItems=_pickF(evalCPBank,5, rng);const s1=document.createElement('div');s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';cpItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='cp';d.dataset.evalIndex=i;const qHtml=item.q.replace('___',`<input class="eval-cp-input" type="text" data-cp="${i}" autocomplete="off">`);d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbCp${i}" aria-live="polite"></div>`;s1.appendChild(d);});out.appendChild(s1);const tfItems=_pickF(evalTFBank,5, rng);const s2=document.createElement('div');s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';tfItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='tf';d.dataset.evalIndex=i;d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="true"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="false"> Falso</label></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbTf${i}" aria-live="polite"></div>`;s2.appendChild(d);});out.appendChild(s2);const mcItems=_pickF(evalMCBank,5, rng);const s3=document.createElement('div');s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';mcItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='mc';d.dataset.evalIndex=i;const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join('');d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbMc${i}" aria-live="polite"></div>`;s3.appendChild(d);});out.appendChild(s3);const prItems=_pickF(evalPRBank,5, rng);let shuffledDefs=_shuffleF(prItems, rng);let _prTries=0;while(shuffledDefs.some((df,ix)=>df.def===prItems[ix].def)&&_prTries<20){shuffledDefs=_shuffleF(shuffledDefs, rng);_prTries++;}if(shuffledDefs.some((df,ix)=>df.def===prItems[ix].def)){for(let ix=0;ix<shuffledDefs.length;ix++){if(shuffledDefs[ix].def===prItems[ix].def){const j=(ix+1)%shuffledDefs.length;const tmp=shuffledDefs[ix];shuffledDefs[ix]=shuffledDefs[j];shuffledDefs[j]=tmp;}}}const letters=['A','B','C','D','E'];const s4=document.createElement('div');s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';const matchCard=document.createElement('div');matchCard.className='eval-item';let colLeft='<div class="eval-match-col"><h4>📌 Términos</h4>';prItems.forEach((item,i)=>{colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> <select class="eval-match-select" data-pr="${i}" aria-label="Respuesta pareada ${i+16}"><option value="">—</option>${letters.map(l=>`<option value="${l}">${l}</option>`).join('')}</select> ${item.term}</div>`;});colLeft+='</div>';let colRight='<div class="eval-match-col"><h4>🔑 Definiciones</h4>';shuffledDefs.forEach((item,i)=>{colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`;});colRight+='</div>';const ansKey=prItems.map((item,i)=>{const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)];return`${i+16}→${letter}`;}).join(' · ');matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div><div class="eval-item-feedback" id="evalFbPr" aria-live="polite"></div>`;s4.appendChild(matchCard);out.appendChild(s4);window._evalPrintData={tf:tfItems,mc:mcItems,cp:cpItems,pr:{terms:prItems,shuffledDefs,letters}};const autoPanel=document.createElement('div');autoPanel.id='evalAutoResult';autoPanel.className='eval-auto-result';autoPanel.innerHTML='<strong>🧮 Evaluación interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato original sin respuestas digitadas.';out.appendChild(autoPanel);fin('s-evaluacion');}
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación Detective de Bugs: la Depuración · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.12rem 0.4rem;margin:0.22rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #0e7490;background:#ecfeff;color:#0e7490;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#0e7490;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #0e7490;height:12px;}.obt-pct{white-space:nowrap;}.qn{font-weight:700;min-width:22px;flex-shrink:0;}.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:40px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.18rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.14rem 0.35rem;margin-bottom:0.1rem;break-inside:avoid;page-break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.3;display:flex;gap:0.28rem;margin-bottom:0.07rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.1rem 0.5rem;}.mc-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:0.04rem 0.15rem;margin-left:0.8rem;}.mc-opt{font-size:9pt;display:flex;align-items:center;gap:0.15rem;}.mc-opt input{width:10px;height:10px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{margin-top:0.1rem;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.08rem 0.4rem;margin-top:0.08rem;}.pr-head{font-size:9pt;font-weight:700;color:#555;margin-bottom:0.1rem;}.pr-item{font-size:10.5pt;padding:0.1rem 0.28rem;background:#ecfeff;border-radius:3px;margin-bottom:0.07rem;display:flex;align-items:center;gap:0.2rem;line-height:1.2;break-inside:avoid;page-break-inside:avoid;}.pr-num{font-weight:700;color:#0e7490;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.22rem;padding:0.15rem 0;page-break-before:avoid;break-before:avoid;color:#0e7490;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #0e7490;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#555;}.pa{color:#007a00;font-weight:600;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · Detective de Bugs: la Depuración · Educación Básica · Programación</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Evaluación Final · Detective de Bugs: la Depuración · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u · Programación · Educación Básica</div></div><div class="p-grid">${pR}</div>
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

// Las tres formas en que un programa buggeado puede fallar (opciones de la Sección II).
const OP_FALLO_OPTS=[
  'Choca (se sale del mapa o pega con un árbol) 💥',
  'No choca, pero termina en la casilla equivocada 🚶',
  'Gira mal y se aleja de la casa 🔀'
];
// Clasifica el resultado de un programa buggeado en una de las tres formas de fallar.
// -1 = el bug no afectó (llegó igual): se descarta como caso de examen.
function _opClaseFallo(sr,sc,dr,dc,res){
  if(!res.ok)return 0;                          // chocó contra el borde o un árbol
  if(res.st.r===dr&&res.st.c===dc)return -1;    // llegó igual: no sirve como caso
  const dDest=Math.abs(dr-sr)+Math.abs(dc-sc);
  const dFin=Math.abs(res.st.r-sr)+Math.abs(res.st.c-sc);
  return dFin>dDest?1:2;                         // se pasó de largo (1) · giró mal / se quedó corto (2)
}
// Escáner determinista de casos con UN bug: parte de una ruta mínima (planRuta) y muta UNA
// instrucción de movimiento. Devuelve el PRIMER caso que cumple pred(caso); si ninguno cumple,
// el primer caso válido hallado (fallback). Todo el azar sale de _opRnd → 100 % determinista.
function _opBugScan(pred){
  let g=0,fallback=null;
  while(g++<600){
    const sr=_opRint(0,3),sc=_opRint(0,3),dr=_opRint(0,3),dc=_opRint(0,3);
    if(Math.abs(dr-sr)+Math.abs(dc-sc)<2)continue;
    const dir=DIRS[_opRint(0,3)];
    const buena=planRuta(sr,sc,dr,dc,dir);const movLen=buena.length-1;
    if(movLen<2)continue;
    for(let idx=0;idx<movLen;idx++){
      const cur=buena[idx];
      for(let vi=0;vi<3;vi++){
        const v=[I_AV,I_GD,I_GI][vi];
        if(v===cur)continue;
        const mala=[...buena];mala[idx]=v;
        const res=simRunX({r:sr,c:sc,dir},mala,{n:4});
        const cls=_opClaseFallo(sr,sc,dr,dc,res);
        if(cls<0)continue;
        const caso={sr,sc,dir,dr,dc,buena,mala,linea:idx+1,correcta:cur,kind:cls,
                    ans:OP_FALLO_OPTS[cls],finCell:res.ok?coordName(res.st.r,res.st.c):null};
        if(!fallback)fallback=caso;
        if(pred(caso))return caso;
      }
    }
  }
  return fallback;
}

// I. El robot falló (5 × 4 = 20 pts): programa con UN bug que NO choca; el alumno ESCRIBE la
//    casilla donde el robot TERMINA de verdad (la pauta = simular el buggeado por código).
function genFallItems(){
  const items=[];let guard=0;
  while(items.length<5&&guard++<40){
    const c=_opBugScan(x=>x.kind!==0&&x.finCell);
    if(!c||!c.finCell)break;
    items.push({sr:c.sr,sc:c.sc,dir:c.dir,dr:c.dr,dc:c.dc,mala:c.mala,ans:c.finCell});
  }
  return items;
}

// II. Predice el fallo (5 × 2 = 10 pts): ¿choca, se pasa o gira mal? (opción múltiple).
function genPredItems(){
  const orden=[0,1,2,0,2];
  return orden.map(k=>{const c=_opBugScan(x=>x.kind===k);return{sr:c.sr,sc:c.sc,dir:c.dir,dr:c.dr,dc:c.dc,mala:c.mala,kind:c.kind,ans:c.ans};});
}

// III. Señala al culpable (5 × 4 = 20 pts): marcar el número de línea del bug (opción múltiple).
function genCulpItems(){
  const items=[];let guard=0;
  while(items.length<5&&guard++<40){
    const c=_opBugScan(x=>x.kind!==0);
    if(!c)break;
    items.push({sr:c.sr,sc:c.sc,dir:c.dir,dr:c.dr,dc:c.dc,mala:c.mala,buena:c.buena,linea:c.linea,correcta:c.correcta});
  }
  return items;
}

// IV. Corrige y explica (3 × 10 = 30 pts): algoritmos hondureños con UN bug plantado.
const opCorrigeBank=[
  {tema:'Preparar una baleada para la merienda',
   buggy:['Amasar la harina y hacer la tortilla','Doblar la tortilla','Cocerla en el comal','Untar los frijoles y el queso','Servirla'],
   error:'Se dobló la tortilla ANTES de cocerla y de untarle los frijoles: un paso fuera de lugar (orden cambiado).',
   correccion:'Cocer la tortilla, luego untar los frijoles y el queso, y AL FINAL doblarla.',
   correcto:['Amasar la harina y hacer la tortilla','Cocerla en el comal','Untar los frijoles y el queso','Doblar la tortilla','Servirla']},
  {tema:'Regar la huerta escolar',
   buggy:['Llenar la regadera con agua','Guardar la regadera','Caminar hasta el primer surco','Regar cada planta sin encharcar','Pasar al siguiente surco y repetir'],
   error:'Se guardó la regadera al principio, cuando ese paso va al final (orden errado).',
   correccion:'Guardar la regadera debe ser el ÚLTIMO paso, después de regar todos los surcos.',
   correcto:['Llenar la regadera con agua','Caminar hasta el primer surco','Regar cada planta sin encharcar','Pasar al siguiente surco y repetir','Guardar la regadera']},
  {tema:'Repartir los 10 cuadernos a la clase',
   buggy:['Tomar la pila de cuadernos','Entregar el primer cuaderno en su pupitre','Repetir la entrega 8 veces más','Sentarse'],
   error:'Con el primero y 8 más solo se reparten 9 cuadernos: falta una vuelta (una repetición de menos).',
   correccion:'Repetir la entrega hasta que NO queden cuadernos (9 veces más del primero = 10 en total).',
   correcto:['Tomar la pila de cuadernos','Entregar el primer cuaderno en su pupitre','Repetir la entrega hasta que no queden cuadernos (10 en total)','Sentarse']},
  {tema:'Hacer un fresco de nance',
   buggy:['Lavar los nances','Colar la mezcla','Machacar los nances con agua','Agregar agua, azúcar y hielo','Servir el fresco'],
   error:'Se coló la mezcla ANTES de machacar los nances: dos pasos intercambiados (orden cambiado).',
   correccion:'Primero machacar los nances con agua y DESPUÉS colar la mezcla.',
   correcto:['Lavar los nances','Machacar los nances con agua','Colar la mezcla','Agregar agua, azúcar y hielo','Servir el fresco']},
  {tema:'Lavarse las manos antes de la merienda',
   buggy:['Abrir el chorro','Mojarse las manos','Enjuagar bien','Cerrar el chorro y secarse'],
   error:'Falta el paso de frotarse con jabón: se saltó un paso (instrucción de menos).',
   correccion:'Agregar «Frotar con jabón 20 segundos» ANTES de enjuagar.',
   correcto:['Abrir el chorro','Mojarse las manos','Frotar con jabón 20 segundos','Enjuagar bien','Cerrar el chorro y secarse']},
  {tema:'Izar la bandera el lunes cívico',
   buggy:['Formar filas en el patio','Izar la bandera con el himno','Amarrar la bandera a la cuerda','Hacer el saludo en silencio'],
   error:'Se izó la bandera ANTES de amarrarla a la cuerda: orden imposible (orden cambiado).',
   correccion:'Amarrar la bandera a la cuerda ANTES de izarla con el himno.',
   correcto:['Formar filas en el patio','Amarrar la bandera a la cuerda','Izar la bandera con el himno','Hacer el saludo en silencio']}
];
const OP_CORRIGE_RUBRICA='Encuentra la línea del bug (3 pts) · Escribe la corrección correcta (4 pts) · Explica POR QUÉ estaba mal y recuerda volver a probar (3 pts)';
function genCorrigeItems(){return _pickF(opCorrigeBank,3,_opRnd);}

// V. Retos de olimpiada (10 + 10 = 20 pts)
// (a) Programa con DOS bugs: hay que hallar las dos líneas erradas.
function genRetoDos(){
  let g=0,fb=null;
  const mut=(cur)=>cur===I_AV?I_GD:(cur===I_GD?I_GI:I_AV);
  while(g++<400){
    const sr=_opRint(0,3),sc=_opRint(0,3),dr=_opRint(0,3),dc=_opRint(0,3);
    if(Math.abs(dr-sr)+Math.abs(dc-sc)<3)continue;
    const dir=DIRS[_opRint(0,3)];
    const buena=planRuta(sr,sc,dr,dc,dir);const movLen=buena.length-1;
    if(movLen<3)continue;
    const a=_opRint(0,movLen-1);let b=_opRint(0,movLen-1),gg=0;
    while(b===a&&gg++<12)b=_opRint(0,movLen-1);
    if(b===a)continue;
    const mala=[...buena];mala[a]=mut(buena[a]);mala[b]=mut(buena[b]);
    const res=simRunX({r:sr,c:sc,dir},mala,{n:4});
    const caso={sr,sc,dir,dr,dc,buena,mala,lineas:[a+1,b+1].sort((x,y)=>x-y)};
    caso.correcciones=caso.lineas.map(l=>buena[l-1]);
    if(!fb)fb=caso;
    if(!(res.ok&&res.st.r===dr&&res.st.c===dc))return caso;   // el programa con 2 bugs NO llega
  }
  return fb;
}
// (b) Bug de lógica escondido: el programa corre SIN chocar, pero ENTREGA una casilla antes.
function genRetoLogica(){
  let g=0,fb=null;
  while(g++<400){
    const sr=_opRint(0,3),sc=_opRint(0,3),dr=_opRint(0,3),dc=_opRint(0,3);
    if(Math.abs(dr-sr)+Math.abs(dc-sc)<2)continue;
    const dir=DIRS[_opRint(0,3)];
    const buena=planRuta(sr,sc,dr,dc,dir);const L=buena.length;
    if(buena[L-2]!==I_AV)continue;                       // la penúltima debe ser AVANZA
    const mala=[...buena];mala[L-2]=I_EN;mala[L-1]=I_AV;  // ENTREGA una casilla ANTES de llegar
    const res=simRunX({r:sr,c:sc,dir},mala,{n:4});
    if(!res.ok)continue;                                 // debe correr sin chocar
    const caso={sr,sc,dir,dr,dc,buena,mala,lineaEntrega:L-1,
                entregaEn:res.entregaEn?coordName(res.entregaEn[0],res.entregaEn[1]):null,
                destCell:coordName(dr,dc)};
    if(!fb)fb=caso;
    if(res.entregaEn&&!(res.entregaEn[0]===dr&&res.entregaEn[1]===dc))return caso;  // entregó mal, sin chocar
  }
  return fb;
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
  document.getElementById('evalop-screen-title').textContent = `🤖 Prueba Operativa — Forma ${cf} · Detective de Bugs: la Depuración`;
  evalOpAnsVisible = false;
  const out = document.getElementById('evalOpOut'); out.innerHTML = '';

  const fallItems = genFallItems();
  const predItems = genPredItems();
  const culpItems = genCulpItems();
  const corrigeItems = genCorrigeItems();
  const retoDos = genRetoDos();
  const retoLogica = genRetoLogica();

  // I. El robot falló
  const s1 = document.createElement('div');
  s1.innerHTML = `<div class="eval-section-title">I. El robot falló <span class="eval-pts">20 pts · 4 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Cada programa tiene UN bug. Sigue el programa con el dedo sobre la cuadrícula y ESCRIBE la casilla donde el robot TERMINA de verdad (tipo B3).</p>`;
  fallItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="eval-q"><span class="eval-num">${i + 1}</span><span class="eval-q-text">Sale de <strong>${coordName(it.sr, it.sc)}</strong> mirando al <strong>${DIR_NOMBRE[it.dir]}</strong>; debía llegar a la casa 🏠 en <strong>${coordName(it.dr, it.dc)}</strong>.</span></div><div class="op-grid-wrap">${svgGridHTML({ n: 4, robot: { r: it.sr, c: it.sc, dir: it.dir }, dest: [it.dr, it.dc], w: 160 })}</div><div class="op-prog">${it.mala.map((p, j) => (j + 1) + '. ' + p).join('<br>')}</div><div class="opx-row" style="margin-left:1.7rem;"><span style="font-size:0.82rem;color:var(--gray);">Termina en (ej. B3):</span> <input class="eval-cp-input" type="text" data-fall="${i}" autocomplete="off" style="min-width:70px;max-width:90px;"></div><div class="eval-answer">${it.ans}</div><div class="eval-item-feedback" id="evalFbFall${i}" aria-live="polite"></div>`;
    s1.appendChild(d);
  });
  out.appendChild(s1);

  // II. Predice el fallo
  const s2 = document.createElement('div');
  s2.innerHTML = `<div class="eval-section-title">II. Predice el fallo <span class="eval-pts">10 pts · 2 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Sin ejecutar del todo: ¿el bug hace que el robot CHOQUE, se PASE de largo o GIRE mal? Marca una opción.</p>`;
  predItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    const optsHtml = OP_FALLO_OPTS.map(op => `<label class="eval-mc-opt"><input type="radio" name="opP${i}" value="${op}"> ${op}</label>`).join('');
    d.innerHTML = `<div class="eval-q"><span class="eval-num">${i + 1}</span><span class="eval-q-text">Sale de <strong>${coordName(it.sr, it.sc)}</strong> mirando al <strong>${DIR_NOMBRE[it.dir]}</strong> hacia la casa 🏠 en <strong>${coordName(it.dr, it.dc)}</strong>.</span></div><div class="op-grid-wrap">${svgGridHTML({ n: 4, robot: { r: it.sr, c: it.sc, dir: it.dir }, dest: [it.dr, it.dc], w: 150 })}</div><div class="op-prog">${it.mala.map((p, j) => (j + 1) + '. ' + p).join('<br>')}</div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${it.ans}</div><div class="eval-item-feedback" id="evalFbPred${i}" aria-live="polite"></div>`;
    s2.appendChild(d);
  });
  out.appendChild(s2);

  // III. Señala al culpable
  const s3 = document.createElement('div');
  s3.innerHTML = `<div class="eval-section-title">III. Señala al culpable <span class="eval-pts">20 pts · 4 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">El programa NO llega a la casa. ¡Tiene UN bug! Marca el número de línea donde está el culpable.</p>`;
  culpItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    const optsHtml = it.mala.map((p, j) => `<label class="eval-mc-opt"><input type="radio" name="opC${i}" value="${j + 1}"> Línea ${j + 1}</label>`).join('');
    d.innerHTML = `<div class="eval-q"><span class="eval-num">${i + 1}</span><span class="eval-q-text">Sale de <strong>${coordName(it.sr, it.sc)}</strong> mirando al <strong>${DIR_NOMBRE[it.dir]}</strong>; la casa 🏠 está en <strong>${coordName(it.dr, it.dc)}</strong>.</span></div><div class="op-grid-wrap">${svgGridHTML({ n: 4, robot: { r: it.sr, c: it.sc, dir: it.dir }, dest: [it.dr, it.dc], w: 150 })}</div><div class="op-prog">${it.mala.map((p, j) => 'Línea ' + (j + 1) + ': ' + p).join('<br>')}</div><div class="eval-mc-opts" style="flex-direction:row;flex-wrap:wrap;gap:0.6rem;">${optsHtml}</div><div class="eval-answer">Línea ${it.linea} (debe decir ${it.correcta})</div><div class="eval-item-feedback" id="evalFbCulp${i}" aria-live="polite"></div>`;
    s3.appendChild(d);
  });
  out.appendChild(s3);

  // IV. Corrige y explica
  const s4 = document.createElement('div');
  s4.innerHTML = `<div class="eval-section-title">IV. Corrige y explica <span class="eval-pts">30 pts · 10 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Cada algoritmo hondureño tiene UN error. Escribe la CORRECCIÓN y POR QUÉ estaba mal; luego compara con la pauta y anota tu puntaje de 0 a 10.</p>`;
  corrigeItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="eval-q"><span class="eval-num">${i + 1}</span><span class="eval-q-text"><strong>${it.tema}</strong> — el algoritmo tiene un bug:</span></div><div class="op-prog">${it.buggy.map((p, j) => (j + 1) + '. ' + p).join('<br>')}</div><textarea class="op-vida-ta" aria-label="Corrección de ${it.tema}" placeholder="La línea con el bug es la Nº…&#10;Debe decir: …&#10;Porque: …"></textarea><div class="op-pauta-rub"><strong>Bug:</strong> ${it.error}<br><strong>Corrección:</strong> ${it.correccion}<br><strong>Algoritmo corregido:</strong> ${it.correcto.map((p, j) => (j + 1) + '. ' + p).join(' · ')}<br><strong>Rúbrica (10 pts):</strong> ${OP_CORRIGE_RUBRICA}</div><div class="op-vida-score"><label for="opCorr${i}">Compara con la pauta y anota tu puntaje:</label><input type="number" id="opCorr${i}" data-corr="${i}" min="0" max="10" value="0"> <span>de 10 pts</span></div><div class="eval-item-feedback" id="evalFbCorr${i}" aria-live="polite"></div>`;
    s4.appendChild(d);
  });
  out.appendChild(s4);

  // V. Retos de olimpiada
  const s5 = document.createElement('div');
  s5.innerHTML = '<div class="eval-section-title">V. Retos de olimpiada <span class="eval-pts">20 pts · 10 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Desafío del detective experto: un programa con DOS bugs y un bug de lógica escondido.</p>';
  const dA = document.createElement('div'); dA.className = 'eval-item eval-auto-item';
  dA.innerHTML = `<div class="eval-q"><span class="eval-num">1</span><span class="eval-q-text">🐛🐛 <strong>Dos bugs:</strong> este programa debería llevar al robot de <strong>${coordName(retoDos.sr, retoDos.sc)}</strong> (mirando al <strong>${DIR_NOMBRE[retoDos.dir]}</strong>) a la casa 🏠 en <strong>${coordName(retoDos.dr, retoDos.dc)}</strong>, pero tiene DOS instrucciones erradas. Escribe las dos líneas.</span></div><div class="op-grid-wrap">${svgGridHTML({ n: 4, robot: { r: retoDos.sr, c: retoDos.sc, dir: retoDos.dir }, dest: [retoDos.dr, retoDos.dc], w: 160 })}</div><div class="op-prog">${retoDos.mala.map((p, j) => 'Línea ' + (j + 1) + ': ' + p).join('<br>')}</div><div class="opx-row" style="margin-left:1.7rem;"><span style="font-size:0.82rem;color:var(--gray);">Línea con bug (5 pts):</span> <input class="eval-cp-input" type="text" data-v2a="0" autocomplete="off" inputmode="numeric" style="min-width:56px;max-width:70px;"><span style="font-size:0.82rem;color:var(--gray);">y línea (5 pts):</span> <input class="eval-cp-input" type="text" data-v2b="0" autocomplete="off" inputmode="numeric" style="min-width:56px;max-width:70px;"></div><div class="eval-answer">Líneas ${retoDos.lineas.join(' y ')} → deben decir ${retoDos.correcciones.join(' y ')}</div><div class="eval-item-feedback" id="evalFbV2" aria-live="polite"></div>`;
  s5.appendChild(dA);
  const dB = document.createElement('div'); dB.className = 'eval-item eval-auto-item';
  dB.innerHTML = `<div class="eval-q"><span class="eval-num">2</span><span class="eval-q-text">🎭 <strong>Bug de lógica escondido:</strong> este programa corre SIN chocar, pero NO entrega en la casa 🏠 (<strong>${retoLogica.destCell}</strong>). Explica cuál es el bug de lógica y cómo se corrige; luego anota tu puntaje de 0 a 10.</span></div><div class="op-grid-wrap">${svgGridHTML({ n: 4, robot: { r: retoLogica.sr, c: retoLogica.sc, dir: retoLogica.dir }, dest: [retoLogica.dr, retoLogica.dc], w: 160 })}</div><div class="op-prog">${retoLogica.mala.map((p, j) => 'Línea ' + (j + 1) + ': ' + p).join('<br>')}</div><textarea class="op-vida-ta" aria-label="Explica el bug de lógica" placeholder="El bug de lógica es…&#10;Se corrige…"></textarea><div class="op-pauta-rub"><strong>Bug de lógica:</strong> la ENTREGA (Línea ${retoLogica.lineaEntrega}) ocurre una casilla ANTES de llegar: el robot entrega en ${retoLogica.entregaEn} y no en la casa ${retoLogica.destCell}, aunque el programa corre sin chocar.<br><strong>Corrección:</strong> mover la ENTREGA al FINAL, cuando el robot ya está sobre la casa ${retoLogica.destCell}.</div><div class="op-vida-score"><label for="opLog0">Anota tu puntaje:</label><input type="number" id="opLog0" data-vlog="0" min="0" max="10" value="0"> <span>de 10 pts</span></div><div class="eval-item-feedback" id="evalFbVlog" aria-live="polite"></div>`;
  s5.appendChild(dB);
  out.appendChild(s5);

  window._evalOpData = { fallItems, predItems, culpItems, corrigeItems, retoDos, retoLogica };
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
function _isCasillaOk(student, expected) {
  const norm = s => (s || '').toString().trim().toUpperCase().replace(/\s+/g, '');
  return !!norm(student) && norm(student) === norm(expected);
}

function gradeEvalOp() {
  if (!window._evalOpData) { showToast('⚠️ Genera una prueba operativa primero'); return; }
  sfx('click');
  const d = window._evalOpData;
  let total = 0; const det = { fall: 0, pred: 0, culp: 0, corr: 0, reto: 0 };
  // I. El robot falló (escribe la casilla donde termina de verdad)
  d.fallItems.forEach((it, i) => { const el = document.querySelector(`[data-fall="${i}"]`); const ok = _isCasillaOk(el ? el.value : '', it.ans); if (el) { el.classList.toggle('eval-input-ok', ok); el.classList.toggle('eval-input-no', !ok); } if (ok) { det.fall += 4; total += 4; } setEvalFeedback('evalFbFall' + i, ok, ok ? 'Correcto. +4 pts' : 'Revisar. Termina en ' + it.ans); });
  // II. Predice el fallo (opción múltiple)
  d.predItems.forEach((it, i) => { const sel = document.querySelector(`input[name="opP${i}"]:checked`); const ok = !!sel && sel.value === it.ans; if (ok) { det.pred += 2; total += 2; } setEvalFeedback('evalFbPred' + i, ok, ok ? 'Correcto. +2 pts' : 'Revisar. ' + it.ans); });
  // III. Señala al culpable (marca el número de línea)
  d.culpItems.forEach((it, i) => { const sel = document.querySelector(`input[name="opC${i}"]:checked`); const ok = !!sel && Number(sel.value) === it.linea; if (ok) { det.culp += 4; total += 4; } setEvalFeedback('evalFbCulp' + i, ok, ok ? 'Correcto. +4 pts' : 'Revisar. El bug está en la Línea ' + it.linea); });
  // IV. Corrige y explica (autoevaluado 0-10)
  d.corrigeItems.forEach((it, i) => { const inp = document.querySelector(`[data-corr="${i}"]`); let v = inp ? (parseInt(inp.value) || 0) : 0; v = Math.max(0, Math.min(10, v)); if (inp) inp.value = v; det.corr += v; total += v; setEvalFeedback('evalFbCorr' + i, v >= 7, 'Puntaje autoevaluado: ' + v + '/10 (compara siempre con la pauta)'); });
  // V(a). Dos bugs (dos líneas, sin importar el orden)
  { const ea = document.querySelector('[data-v2a="0"]'); const eb = document.querySelector('[data-v2b="0"]'); const va = ea ? parseInt(ea.value) : NaN; const vb = eb ? parseInt(eb.value) : NaN; const objetivo = d.retoDos.lineas.slice(); let ganado = 0; const usados = []; [va, vb].forEach(n => { if (isNaN(n)) return; const idx = objetivo.findIndex((L, k) => L === n && usados.indexOf(k) < 0); if (idx >= 0) { usados.push(idx); ganado += 5; } }); const okA = ea && !isNaN(va) && objetivo.indexOf(va) >= 0; const okB = eb && !isNaN(vb) && objetivo.indexOf(vb) >= 0; if (ea) { ea.classList.toggle('eval-input-ok', okA); ea.classList.toggle('eval-input-no', !okA); } if (eb) { eb.classList.toggle('eval-input-ok', okB); eb.classList.toggle('eval-input-no', !okB); } det.reto += ganado; total += ganado; setEvalFeedback('evalFbV2', ganado === 10, ganado === 10 ? '¡Los dos bugs atrapados! +10 pts' : 'Revisar. Los bugs están en las Líneas ' + d.retoDos.lineas.join(' y ')); }
  // V(b). Bug de lógica (autoevaluado 0-10)
  { const inp = document.querySelector('[data-vlog="0"]'); let v = inp ? (parseInt(inp.value) || 0) : 0; v = Math.max(0, Math.min(10, v)); if (inp) inp.value = v; det.reto += v; total += v; setEvalFeedback('evalFbVlog', v >= 7, 'Puntaje autoevaluado: ' + v + '/10 (compara con la pauta)'); }
  const res = document.getElementById('evalOpAutoResult');
  const desglose = `El robot falló: ${det.fall}/20 · Predice: ${det.pred}/10 · Culpable: ${det.culp}/20 · Corrige: ${det.corr}/30 · Olimpiada: ${det.reto}/20`;
  if (res) { res.className = 'eval-auto-result ' + (total >= 70 ? 'eval-auto-pass' : 'eval-auto-risk'); res.innerHTML = `<strong>Resultado: ${total}/100 pts</strong><br><span>${desglose}</span>`; }
  if (total >= 70) { pts(8); showToast('🎯 Prueba operativa calificada: ' + total + '/100'); }
  else showToast('🧮 Prueba operativa: ' + total + '/100. Revisa los ítems marcados.');
}

function printEvalOp() {
  if (!window._evalOpData) { showToast('⚠️ Genera una prueba operativa primero'); return; }
  sfx('click');
  const forma = window._currentEvalOpForm || 1; const d = window._evalOpData;

  // ── I. El robot falló (cuadrículas SVG deterministas; casillas vacías con «•»)
  let s1 = `<div class="sec-title"><span>I. El robot falló</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Cada programa tiene UN bug. Sigue el programa con el dedo y ESCRIBE la casilla donde el robot TERMINA de verdad (tipo B3). 4 pts c/u.</p><div class="ej-grid">`;
  d.fallItems.forEach((it, i) => {
    s1 += `<div class="ej-box"><div class="ej-head">${i + 1}. De ${coordName(it.sr, it.sc)} (${DIR_NOMBRE[it.dir]}) → casa ${coordName(it.dr, it.dc)}</div><div class="ej-svg">${svgGridHTML({ n: 4, robot: { r: it.sr, c: it.sc, dir: it.dir }, dest: [it.dr, it.dc], w: 118 })}</div><div class="ej-prog">${it.mala.map((p, j) => (j + 1) + '. ' + p).join('<br>')}</div><div class="ej-resp">Termina en: <span class="opx-mini-blank">&nbsp;</span></div></div>`;
  });
  s1 += '</div>';

  // ── II. Predice el fallo (opción múltiple)
  let s2 = `<div class="sec-title"><span>II. Predice el fallo</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10 pts</span></div></div><p class="opx-instr">¿El bug hace que el robot choque, se pase o gire mal? Marca ☐ una opción por caso. 2 pts c/u.</p><div class="ej-grid">`;
  d.predItems.forEach((it, i) => {
    s2 += `<div class="ej-box"><div class="ej-head">${i + 1}. De ${coordName(it.sr, it.sc)} (${DIR_NOMBRE[it.dir]}) → casa ${coordName(it.dr, it.dc)}</div><div class="ej-svg">${svgGridHTML({ n: 4, robot: { r: it.sr, c: it.sc, dir: it.dir }, dest: [it.dr, it.dc], w: 110 })}</div><div class="ej-prog">${it.mala.map((p, j) => (j + 1) + '. ' + p).join('<br>')}</div><div class="op-choices">${OP_FALLO_OPTS.map(op => `<span class="op-choice"><span class="op-box"></span> ${op}</span>`).join('')}</div></div>`;
  });
  s2 += '</div>';

  // ── III. Señala al culpable
  let s3 = `<div class="sec-title"><span>III. Señala al culpable</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">El programa NO llega a la casa. Escribe el número de la línea donde está el bug. 4 pts c/u.</p><div class="ej-grid">`;
  d.culpItems.forEach((it, i) => {
    s3 += `<div class="ej-box"><div class="ej-head">${i + 1}. De ${coordName(it.sr, it.sc)} (${DIR_NOMBRE[it.dir]}) → casa ${coordName(it.dr, it.dc)}</div><div class="ej-svg">${svgGridHTML({ n: 4, robot: { r: it.sr, c: it.sc, dir: it.dir }, dest: [it.dr, it.dc], w: 110 })}</div><div class="ej-prog">${it.mala.map((p, j) => 'L' + (j + 1) + ': ' + p).join('<br>')}</div><div class="ej-resp">Línea del bug: <span class="opx-mini-blank" style="min-width:34px;">&nbsp;</span></div></div>`;
  });
  s3 += '</div>';

  // ── IV. Corrige y explica (algoritmos hondureños; rúbrica en la pauta)
  let s4 = `<div class="sec-title"><span>IV. Corrige y explica</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 30 pts</span></div></div><p class="opx-instr">Cada algoritmo tiene UN error. Escribe qué línea tiene el bug, la corrección y POR QUÉ estaba mal. 10 pts c/u.</p>`;
  d.corrigeItems.forEach((it, i) => { s4 += `<div class="opx-print-row" style="align-items:flex-start;"><span class="qn">${i + 1}.</span><span style="flex:1;line-height:1.4;"><strong>${it.tema}</strong><br><span class="mono">${it.buggy.map((p, j) => (j + 1) + '. ' + p).join(' · ')}</span><br><span class="ln-vida"></span><span class="ln-vida"></span></span></div>`; });

  // ── V. Retos de olimpiada
  let s5 = `<div class="sec-title"><span>V. Retos de olimpiada</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Reto 1: dos bugs · 10 pts (5 cada línea). Reto 2: bug de lógica escondido · 10 pts.</p><div class="ord-print-grid"><div class="ord-print-box"><div class="ord-print-dir">1. 🐛🐛 Dos bugs · 10 pts:</div><div style="text-align:center;">${svgGridHTML({ n: 4, robot: { r: d.retoDos.sr, c: d.retoDos.sc, dir: d.retoDos.dir }, dest: [d.retoDos.dr, d.retoDos.dc], w: 108 })}</div><div style="font-size:9pt;line-height:1.35;">De ${coordName(d.retoDos.sr, d.retoDos.sc)} (mirando al ${DIR_NOMBRE[d.retoDos.dir]}) a la casa ${coordName(d.retoDos.dr, d.retoDos.dc)}; DOS instrucciones están erradas:<br><span class="mono">${d.retoDos.mala.map((p, j) => 'L' + (j + 1) + ': ' + p).join('<br>')}</span></div><div style="margin-top:0.3rem;font-size:9pt;">Líneas con bug: <span class="opx-mini-blank" style="min-width:34px;">&nbsp;</span> y <span class="opx-mini-blank" style="min-width:34px;">&nbsp;</span></div></div><div class="ord-print-box"><div class="ord-print-dir">2. 🎭 Bug de lógica · 10 pts:</div><div style="text-align:center;">${svgGridHTML({ n: 4, robot: { r: d.retoLogica.sr, c: d.retoLogica.sc, dir: d.retoLogica.dir }, dest: [d.retoLogica.dr, d.retoLogica.dc], w: 108 })}</div><div style="font-size:9pt;line-height:1.35;">Corre SIN chocar, pero NO entrega en la casa ${d.retoLogica.destCell}:<br><span class="mono">${d.retoLogica.mala.map((p, j) => 'L' + (j + 1) + ': ' + p).join('<br>')}</span></div><div style="margin-top:0.3rem;font-size:9pt;">¿Cuál es el bug de lógica y cómo se corrige?<br><span class="ln-vida"></span><span class="ln-vida"></span></div></div></div>`;

  // ── Pauta del docente
  let pR = '';
  pR += `<div class="p-sec"><div class="p-ttl">I. El robot falló</div><table class="p-tbl">${d.fallItems.map((it, i) => `<tr><td class="pn">${i + 1}.</td><td class="pa">Termina en ${it.ans}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">II. Predice el fallo</div><table class="p-tbl">${d.predItems.map((it, i) => `<tr><td class="pn">${i + 1}.</td><td class="pa">${it.ans}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">III. Señala al culpable</div><table class="p-tbl">${d.culpItems.map((it, i) => `<tr><td class="pn">${i + 1}.</td><td class="pa">Línea ${it.linea} → ${it.correcta}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">IV. Corrige y explica (10 pts c/u)</div>${d.corrigeItems.map((it, i) => `<div class="p-ord-line"><strong>${i + 1}. ${it.tema}:</strong> ${it.correccion} · Correcto: ${it.correcto.join(' → ')}</div>`).join('')}<div class="p-rub">Rúbrica: ${OP_CORRIGE_RUBRICA}. Acepte redacciones distintas si identifican el bug y lo corrigen.</div></div>`;
  pR += `<div class="p-sec" style="grid-column:1/-1;"><div class="p-ttl">V. Retos de olimpiada</div><div class="p-ord-line"><strong>1. Dos bugs:</strong> Líneas ${d.retoDos.lineas.join(' y ')} → deben decir ${d.retoDos.correcciones.join(' y ')}</div><div class="p-ord-line"><strong>2. Bug de lógica:</strong> la ENTREGA (Línea ${d.retoLogica.lineaEntrega}) va una casilla antes; el robot entrega en ${d.retoLogica.entregaEn} y no en ${d.retoLogica.destCell}. Corrección: mover la ENTREGA al final, sobre la casa.</div></div>`;

  const doc = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Prueba Operativa Detective de Bugs: la Depuración · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11.5pt;color:#111;background:#fff;padding:4mm 6mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.5rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;color:#0e7490;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:#0e7490;margin-top:0.15rem;font-weight:700;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.5rem 0 0.22rem;border-left:4px solid #0e7490;background:#ecfeff;display:flex;justify-content:space-between;align-items:center;color:#0e7490;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:#0e7490;font-weight:700;font-style:italic;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #0e7490;height:12px;}.qn{font-weight:700;min-width:20px;display:inline-block;color:#0e7490;}.opx-instr{font-size:9pt;color:#555;margin-bottom:0.25rem;}.opx-print-row{display:flex;align-items:baseline;gap:0.4rem;font-size:10.5pt;padding:0.22rem 0.2rem;border-bottom:1px dotted #ddd;}.opx-mini-blank{display:inline-block;min-width:60px;border-bottom:1.5px solid #111;}.mono{font-family:'Courier New',monospace;font-weight:700;font-size:9.5pt;}.ej-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0.35rem 0.5rem;margin-top:0.2rem;}.ej-box{border:1px solid #bbb;border-radius:4px;padding:0.25rem 0.35rem;break-inside:avoid;page-break-inside:avoid;}.ej-head{font-size:8.5pt;font-weight:700;color:#0e7490;margin-bottom:0.15rem;}.ej-svg{text-align:center;}.ej-prog{font-family:'Courier New',monospace;font-size:8.5pt;font-weight:700;line-height:1.3;margin-top:0.15rem;}.ej-resp{font-size:9pt;margin-top:0.2rem;}.op-choices{margin-top:0.25rem;font-size:8pt;line-height:1.3;}.op-choice{display:block;margin-bottom:2px;}.op-box{display:inline-block;width:9px;height:9px;border:1.2px solid #111;border-radius:2px;vertical-align:middle;flex-shrink:0;}.ln-vida{display:block;border-bottom:1px solid #111;min-height:14px;margin-top:8px;}.ord-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.8rem;margin-top:0.2rem;}.ord-print-box{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.4rem;break-inside:avoid;}.ord-print-dir{font-size:9pt;font-weight:700;color:#0e7490;margin-bottom:0.2rem;}.total-row{display:flex;align-items:baseline;justify-content:flex-end;gap:7px;font-size:11pt;color:#0e7490;font-weight:700;font-style:italic;margin-top:0.5rem;padding:0.2rem 0.5rem;background:#ecfeff;border-radius:4px;}.total-row .obt-line{min-width:80px;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #0e7490;padding-bottom:0.35rem;margin-bottom:0.5rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;color:#0e7490;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #a5f3fc;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;color:#0e7490;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#0e7490;}.pa{color:#007a00;font-weight:600;}.p-ord-line{font-size:10.5pt;margin-bottom:0.2rem;color:#007a00;}.p-rub{font-size:9.5pt;color:#555;margin-top:0.2rem;border-top:1px dotted #ddd;padding-top:0.2rem;}.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Examen de Programación — Prueba Operativa · Detective de Bugs: la Depuración · Educación Básica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 pts · I: 20 · II: 10 · III: 20 · IV: 30 · V: 20 · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✔ PAUTA — Prueba Operativa · Detective de Bugs: la Depuración · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">100 pts · I: 5×4 · II: 5×2 · III: 5×4 · IV: 3×10 · V: 10+10 · Programación · Educación Básica</div></div><div class="p-grid">${pR}</div></div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("evalPage",250,0.55,1.2);fit("pautaPage",250,0.55,1.2);})();<\/script></body></html>`;
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
function openDiploma(){sfx('fan');const pct=_diplPct();document.getElementById('diplPct').textContent=pct+'%';document.getElementById('diplBar').style.width=pct+'%';document.getElementById('diplDate').textContent='Fecha: '+new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});const msgs=['¡Sigue aprendiendo!','¡Muy buen trabajo!','¡Vas muy bien!','¡Cazas bugs como un detective!','¡Maestro del Código!'];document.getElementById('diplMsg').textContent=msgs[Math.min(Math.floor(pct/25),4)];const stars=['⭐','⭐⭐','⭐⭐⭐'];document.getElementById('diplStars').textContent=stars[Math.min(Math.floor(pct/40),2)];const achTxt=unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(' · ');document.getElementById('diplAch').textContent=achTxt||'Sigue completando secciones para desbloquear logros';document.getElementById('diplomaOverlay').classList.add('open');launchConfetti();}
function closeDiploma(){document.getElementById('diplomaOverlay').classList.remove('open');}
function updateDiplomaName(v){document.getElementById('diplName').textContent=v||'Estudiante';}
function shareWA(){const name=document.getElementById('diplName').textContent||'Estudiante';const pct=_diplPct();const msg=`🤖 ¡${name} completó la Misión "Detective de Bugs: la Depuración"! 🏅 Progreso: ${pct}% · 💻 policastsapien.com`;_waShare(msg);}
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
