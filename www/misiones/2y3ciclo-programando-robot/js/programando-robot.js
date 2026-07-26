// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){if(typeof METAS_TR_TEXTO==='function')texto=METAS_TR_TEXTO(texto);const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
function compartirMision(){const url=window.location.href;const texto=`🕹️ *Misión Asignada* 🕹️\n\nPractica sobre este tema y sobresale en ser de los mejores alumnos. 🏆\n\nDesbloquea *todos los logros* y puedes poner *tus datos* para que tu maestro observe todos tus logros. 📋\n\n_Se te hará prueba escrita y serás excelente estudiante en Robótica._ 🕹️\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;_waShare(texto);}
function toggleLetra(){document.body.classList.toggle('letra-grande');if(typeof sfx==='function')sfx('click');localStorage.setItem('preferenciaLetra',document.body.classList.contains('letra-grande'));}
window.addEventListener('DOMContentLoaded',()=>{if(localStorage.getItem('preferenciaLetra')==='true')document.body.classList.add('letra-grande');});

// ===================== UTILIDADES =====================
const _pick=(arr,n)=>[...arr].sort(()=>Math.random()-0.5).slice(0,n);
const _shuffle=(arr)=>[...arr].sort(()=>Math.random()-0.5);
function fb(id,msg,isOk){const el=document.getElementById(id);if(el){el.textContent=msg;el.className='fb show '+(isOk?'ok':'err');}}

// ===================== NÚCLEO DEL SIMULADOR CON SENSORES (cuadrícula + condicionales) =====================
// Reutilizado y ampliado desde la misión 💻 Condicionales: el Robot Decide (id 47).
// Aquí el robot se guía por SENSORES: sensor de pared/obstáculo y sensor de línea (color del piso).
const DIRS=['N','E','S','O'];
const DIR_DELTA={N:[-1,0],E:[0,1],S:[1,0],O:[0,-1]};
const DIR_NOMBRE={N:'Norte',E:'Este',S:'Sur',O:'Oeste'};
const DIR_FLECHA={N:'▲',E:'▶',S:'▼',O:'◀'};
const I_AV='AVANZA',I_GD='GIRA DERECHA',I_GI='GIRA IZQUIERDA',I_ES='ESPERA',I_FIN='DETENTE';
// Bloques condicionales con sensores (SI…ENTONCES…SINO). Un condicional es {cond,then,els,txt}.
const C_PARED={cond:'PARED',then:I_GD,els:I_AV,txt:'SI HAY PARED ADELANTE → GIRA DERECHA, SINO → AVANZA'};
const C_LINEA={cond:'LINEA',then:I_AV,els:I_GD,txt:'SI HAY LÍNEA ADELANTE → AVANZA, SINO → GIRA DERECHA'};
const C_LINEAI={cond:'LINEA',then:I_AV,els:I_GI,txt:'SI HAY LÍNEA ADELANTE → AVANZA, SINO → GIRA IZQUIERDA'};
const COND_LABEL={PARED:'¿el sensor de pared detecta un obstáculo adelante?',LINEA:'¿el sensor de línea ve la línea negra adelante?'};
function turnR(d){return DIRS[(DIRS.indexOf(d)+1)%4];}
function turnL(d){return DIRS[(DIRS.indexOf(d)+3)%4];}
function coordName(r,c){return 'ABCDE'[c]+(r+1);}
function progLine(instr){return (instr&&typeof instr==='object')?instr.txt:instr;}
function _celdaAdelante(st){const d=DIR_DELTA[st.dir];return [st.r+d[0],st.c+d[1]];}
// Sensor de pared / obstáculo: el borde del mapa también cuenta como pared.
function _paredAdelante(st,map){
  const p=_celdaAdelante(st);const nr=p[0],nc=p[1];
  if(nr<0||nr>=map.n||nc<0||nc>=map.n)return true;
  if(map.obst&&map.obst.indexOf(nr+','+nc)>=0)return true;
  return false;
}
// Sensor de línea / color: ¿la casilla de adelante tiene pintada la línea negra?
function _lineaAdelante(st,map){
  const p=_celdaAdelante(st);const nr=p[0],nc=p[1];
  if(nr<0||nr>=map.n||nc<0||nc>=map.n)return false;
  return !!(map.linea&&map.linea.indexOf(nr+','+nc)>=0);
}
function _condVal(cond,st,map){return cond==='PARED'?_paredAdelante(st,map):_lineaAdelante(st,map);}
// Ejecuta UNA instrucción (simple o condicional). map={n,obst:['r,c'],linea:['r,c']}
function simStep(st,instr,map){
  const s={r:st.r,c:st.c,dir:st.dir,llego:st.llego||false,tick:st.tick||0,evento:null,cond:null,condVal:null,ejec:null};
  let real=instr;
  if(instr&&typeof instr==='object'){
    const v=_condVal(instr.cond,s,map);
    s.cond=instr.cond;s.condVal=v;real=v?instr.then:instr.els;
  }
  s.ejec=real;
  s.tick=(st.tick||0)+1; // un tic por cada instrucción ejecutada (el ciclo del robot)
  if(real===I_GD){s.dir=turnR(s.dir);return s;}
  if(real===I_GI){s.dir=turnL(s.dir);return s;}
  if(real===I_ES){return s;}          // ESPERA: solo deja pasar el tiempo
  if(real===I_FIN){s.evento='fin';return s;}
  if(real===I_AV){
    const d=DIR_DELTA[s.dir];const nr=s.r+d[0],nc=s.c+d[1];
    if(nr<0||nr>=map.n||nc<0||nc>=map.n){s.evento='borde';return s;}
    if(map.obst&&map.obst.indexOf(nr+','+nc)>=0){s.evento='obstaculo';return s;}
    s.r=nr;s.c=nc;return s;
  }
  return s;
}
// Ejecuta un programa completo sin animación (para tareas y evaluaciones)
function simRun(start,prog,map){
  let st={r:start.r,c:start.c,dir:start.dir,llego:false,tick:start.tick||0};
  for(let i=0;i<prog.length;i++){
    const nx=simStep(st,prog[i],map);
    if(nx.evento==='borde'||nx.evento==='obstaculo')return{ok:false,crashAt:i,st:nx};
    if(nx.evento==='fin'){nx.llego=true;}
    st=nx;
  }
  return{ok:true,st};
}
// Planificador simple (sin obstáculos): programa mínimo con instrucciones básicas
function _rotInstr(a,b){const diff=((DIRS.indexOf(b)-DIRS.indexOf(a))%4+4)%4;if(diff===0)return[];if(diff===1)return[I_GD];if(diff===3)return[I_GI];return[I_GD,I_GD];}
function planRuta(sr,sc,dr,dc,dir0){
  const dv=dr<sr?'N':'S',dh=dc<sc?'O':'E';
  const nv=Math.abs(dr-sr),nh=Math.abs(dc-sc);
  const arma=(primero)=>{
    let prog=[],dir=dir0;
    const tramos=primero==='v'?[[dv,nv],[dh,nh]]:[[dh,nh],[dv,nv]];
    tramos.forEach(([d,n])=>{if(n===0)return;prog=prog.concat(_rotInstr(dir,d));dir=d;for(let i=0;i<n;i++)prog.push(I_AV);});
    prog.push(I_FIN);
    return prog;
  };
  const p1=arma('v'),p2=arma('h');
  return p1.length<=p2.length?p1:p2;
}
// Solucionador BFS: programa MÁS CORTO (permitiendo los condicionales con sensores)
// desde start hasta la meta. Devuelve {prog,len} incluyendo el DETENTE final, o null.
const SOLVE_INSTR=[I_AV,I_GD,I_GI,I_ES,C_PARED,C_LINEA,C_LINEAI];
function solveSim(start,dest,map,maxLen){
  maxLen=maxLen||26;
  const key=(st)=>st.r+','+st.c+','+st.dir;
  const vis=new Set();
  let frontier=[{st:{r:start.r,c:start.c,dir:start.dir,llego:false,tick:0},prog:[]}];
  vis.add(key(frontier[0].st));
  for(let depth=0;depth<maxLen&&frontier.length;depth++){
    const next=[];
    for(const node of frontier){
      if(node.st.r===dest[0]&&node.st.c===dest[1])return{prog:node.prog.concat([I_FIN]),len:node.prog.length+1};
      for(const instr of SOLVE_INSTR){
        const nx=simStep(node.st,instr,map);
        if(nx.evento)continue; // choque, salida del mapa o DETENTE → no se explora
        const k=key(nx);
        if(vis.has(k))continue;
        vis.add(k);
        next.push({st:nx,prog:node.prog.concat([instr])});
      }
    }
    frontier=next;
  }
  return null;
}
// SVG de cuadrícula (pantalla e impresión).
// o={n,robot:{r,c,dir},dest:[r,c],destEmoji,obst:[[r,c]],obstEmoji,linea:[[r,c]],deco:{'r,c':emoji},w,dots}
function svgGridHTML(o){
  const n=o.n,cs=44,m=26,W=m+n*cs+6,H=m+n*cs+6;
  const px=(c)=>m+c*cs,py=(r)=>m+r*cs;
  let s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"${o.w?` width="${o.w}"`:''} role="img" aria-label="Cuadrícula del robot programado">`;
  s+=`<rect x="${m}" y="${m}" width="${n*cs}" height="${n*cs}" fill="#ecfeff" stroke="#0e7490" stroke-width="2" rx="4"/>`;
  for(let i=1;i<n;i++){s+=`<line x1="${m+i*cs}" y1="${m}" x2="${m+i*cs}" y2="${m+n*cs}" stroke="#0e7490" stroke-width="0.8" opacity="0.5"/>`;s+=`<line x1="${m}" y1="${m+i*cs}" x2="${m+n*cs}" y2="${m+i*cs}" stroke="#0e7490" stroke-width="0.8" opacity="0.5"/>`;}
  for(let c=0;c<n;c++)s+=`<text x="${px(c)+cs/2}" y="${m-8}" text-anchor="middle" font-size="13" font-weight="bold" fill="#0e7490" font-family="Arial">${'ABCDE'[c]}</text>`;
  for(let r=0;r<n;r++)s+=`<text x="${m-10}" y="${py(r)+cs/2+5}" text-anchor="middle" font-size="13" font-weight="bold" fill="#0e7490" font-family="Arial">${r+1}</text>`;
  const ocupada={};
  (o.linea||[]).forEach(([r,c])=>{ocupada[r+','+c]=1;s+=`<rect x="${px(c)+5}" y="${py(r)+5}" width="${cs-10}" height="${cs-10}" rx="4" fill="#1f2937" opacity="0.88"/>`;});
  (o.obst||[]).forEach(([r,c])=>{ocupada[r+','+c]=1;s+=`<text x="${px(c)+cs/2}" y="${py(r)+cs/2+8}" text-anchor="middle" font-size="24">${o.obstEmoji||'📦'}</text>`;});
  if(o.deco)Object.keys(o.deco).forEach(k=>{const[r,c]=k.split(',').map(Number);ocupada[k]=1;s+=`<text x="${px(c)+cs/2}" y="${py(r)+cs/2+8}" text-anchor="middle" font-size="24">${o.deco[k]}</text>`;});
  if(o.dest){ocupada[o.dest[0]+','+o.dest[1]]=1;s+=`<text x="${px(o.dest[1])+cs/2}" y="${py(o.dest[0])+cs/2+8}" text-anchor="middle" font-size="26">${o.destEmoji||'🎯'}</text>`;}
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

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY='programando_robot_v1';
let xp=0,MXP=200,done=new Set(),evalAnsVisible=false;
let evalFormNum=1,unlockedAch=[],darkMode=false,prevLevel=0;
let evalCritFormNum=1,evalCritAnsVisible=false;
const TOTAL_SECTIONS=13;
const xpTracker={fc:new Set(),memo:new Set(),qz:new Set(),cls:new Set(),id:new Set(),cmp:new Set(),reto:new Set(),sopa:new Set(),wgt:new Set(),lab:new Set()};

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
let ACHIEVEMENTS={
  primer_quiz:{icon:'🕹️',label:'Primer quiz de programación superado'},
  flash_master:{icon:'🃏',label:'Todas las tarjetas del programa exploradas'},
  clasif_pro:{icon:'🗂️',label:'Clasificador de instrucciones y bloques experto'},
  id_master:{icon:'🔍',label:'Identificador de instrucciones maestro'},
  reto_hero:{icon:'🏆',label:'Héroe del reto Instrucción vs Sensor'},
  nivel3:{icon:'🧭',label:'¡Piloto de Pruebas! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡Ingeniero de Control! Nivel 6'},
  widgets_master:{icon:'🧩',label:'Widgets de programación dominados'},
  lab_master:{icon:'🤖',label:'Los 6 niveles del simulador resueltos'}
};
function unlockAchievement(id){if(unlockedAch.includes(id))return;unlockedAch.push(id);sfx('ach');showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label);launchConfetti();renderAchPanel();saveProgress();}
function renderAchPanel(){const list=document.getElementById('achList');list.innerHTML='';Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{const div=document.createElement('div');div.className='ach-item'+(unlockedAch.includes(id)?'':' locked');div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`;list.appendChild(div);});}
function toggleAchPanel(){sfx('click');document.getElementById('achPanel').classList.toggle('open');}
function showToast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}t.textContent=msg;t.style.display='block';clearTimeout(t._tid);t._tid=setTimeout(()=>t.style.display='none',3200);}
function launchConfetti(){const colors=['#0e7490','#22d3ee','#c2410c','#fb923c','#06b6d4'];for(let i=0;i<60;i++){const c=document.createElement('div');c.className='confetti-piece';c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`;document.body.appendChild(c);c.addEventListener('animationend',()=>c.remove());}}

// ===================== XP =====================
let lvls=[{t:0,n:'Aprendiz 🌱'},{t:25,n:'Cargando programa 💾'},{t:55,n:'Piloto de Pruebas 🧭'},{t:90,n:'Depurador de Bugs 🐞'},{t:130,n:'Programador de Robots 🕹️'},{t:165,n:'Ingeniero de Control 🛠️'},{t:190,n:'Maestro Programador 🏆'}];
function pts(n){xp=Math.max(0,Math.min(MXP,xp+n));updateXPBar();saveProgress();}
function updateXPBar(){const pct=Math.round((xp/MXP)*100);document.getElementById('xpFill').style.width=pct+'%';const el=document.getElementById('xpPts');el.textContent='⭐ '+xp;el.style.transform='scale(1.3)';setTimeout(()=>el.style.transform='',300);let lv=0;for(let i=0;i<lvls.length;i++)if(xp>=lvls[i].t)lv=i;document.getElementById('xpLvl').textContent=lvls[lv].n;if(lv!==prevLevel){if(lv>=2)unlockAchievement('nivel3');if(lv>=5)unlockAchievement('nivel5');prevLevel=lv;}}
function resetXP(){sfx('click');xp=0;updateXPBar();showToast('🔄 XP reiniciado a 0');}
function fin(id,showFX=true){if(!done.has(id)){done.add(id);const b=document.querySelector(`[data-s="${id}"]`);if(b)b.classList.add('done');if(showFX){sfx('up');launchConfetti();}saveProgress();}}
function getProgress(){return Math.round((done.size/TOTAL_SECTIONS)*100);}

// ===================== NAV =====================
function go(id){sfx('click');document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});document.getElementById(id).classList.add('active');const btn=document.querySelector(`[data-s="${id}"]`);if(btn){btn.classList.add('active');btn.setAttribute('aria-selected','true');}window.scrollTo({top:0,behavior:'smooth'});if(id==='s-sopa'){setTimeout(buildSopa,50);}if(id==='s-widgets'){setTimeout(buildRoute,50);}}

// ===================== MINI-QUIZ (sección Partes) =====================
function miniQ(btn,isOk,fbId){const wrap=btn.parentElement;if(wrap.dataset.done==='1')return;wrap.querySelectorAll('.cmp-opt').forEach(b=>b.classList.remove('sel'));if(isOk){wrap.dataset.done='1';btn.classList.add('correct');fb(fbId,'¡Correcto! Piensas como todo un programador.',true);sfx('ok');}else{btn.classList.add('wrong');fb(fbId,'Casi. Recuerda: el robot solo hace lo que dice el programa.',false);sfx('no');}}

// ===================== FLASHCARD DATA =====================
let fcData=[
  {w:'Programa',a:'📋 La <strong>lista de instrucciones exactas</strong> que el robot ejecuta paso a paso.'},
  {w:'Ciclo del robot',a:'🔁 <strong>Leer sensores → decidir → mover actuadores → repetir</strong>, sin parar mientras el robot está encendido.'},
  {w:'Instrucción',a:'👣 Una orden simple del programa: <strong>AVANZA, GIRA DERECHA, GIRA IZQUIERDA, ESPERA, DETENTE</strong>.'},
  {w:'Condicional',a:'❓ Bloque <strong>SI… ENTONCES… SINO</strong>: el robot lee un sensor y elige el camino.'},
  {w:'Sensor de pared',a:'🧱 Avisa si hay un <strong>obstáculo justo adelante</strong>: SI hay pared ENTONCES gira, SINO avanza.'},
  {w:'Sensor de línea',a:'⬛ Distingue la <strong>línea negra</strong> del piso claro: sirve para seguir el camino pintado.'},
  {w:'Bucle',a:'🔄 <strong>Repetir</strong> un bloque de instrucciones: «repite 4 veces» o «repite hasta llegar».'},
  {w:'Variable',a:'📦 Una <strong>cajita con nombre</strong> donde el robot guarda un número: cuántas veces giró, cuántos objetos recogió.'},
  {w:'Contador',a:'🔢 Variable que <strong>suma uno</strong> cada vez que ocurre algo: «giros = giros + 1».'},
  {w:'Pseudocódigo',a:'📝 El programa escrito en <strong>lenguaje claro</strong> antes de cargarlo al robot.'},
  {w:'Depurar',a:'🐞 <strong>Buscar y corregir</strong> los errores del programa, probándolo paso a paso.'},
  {w:'Bug (error)',a:'💥 Instrucción equivocada o en mal orden: el robot <strong>hace lo que dice el programa</strong>, no lo que uno quiso decir.'},
  {w:'Actuador',a:'⚙️ Lo que <strong>ejecuta</strong> la orden: motores y ruedas que avanzan, giran o recogen.'},
  {w:'Prueba paso a paso',a:'👣 Ejecutar el programa <strong>una instrucción a la vez</strong> para ver dónde se equivoca el robot.'},
];
let fcIdx=0;
function upFC(){document.getElementById('fcInner').classList.remove('flipped');document.getElementById('fcW').textContent=fcData[fcIdx].w;document.getElementById('fcA').innerHTML=fcData[fcIdx].a;document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length;}
function flipCard(){sfx('flip');document.getElementById('fcInner').classList.toggle('flipped');if(!xpTracker.fc.has(fcIdx)){xpTracker.fc.add(fcIdx);pts(1);}if(xpTracker.fc.size===fcData.length){fin('s-flash');unlockAchievement('flash_master');}}
function nextFC(){sfx('click');fcIdx=(fcIdx+1)%fcData.length;upFC();}
function prevFC(){sfx('click');fcIdx=(fcIdx-1+fcData.length)%fcData.length;upFC();}

// ===================== JUEGO: MEMORIA DEL ROBOT =====================
let memoPairs=[
  {id:'programa',t:'Programa',d:'📋 lista de instrucciones exactas'},
  {id:'condicional',t:'Condicional',d:'❓ SI el sensor detecta… ENTONCES… SINO…'},
  {id:'bucle',t:'Bucle',d:'🔄 repetir un bloque muchas veces'},
  {id:'variable',t:'Variable',d:'📦 cajita donde el robot guarda un número'},
  {id:'pseudocodigo',t:'Pseudocódigo',d:'📝 el programa escrito en español, antes de cargarlo'},
  {id:'depurar',t:'Depurar',d:'🐞 buscar y corregir los errores del programa'}
];
let memoDeck=[],memoOpen=[],memoLock=false,memoMoves=0,memoFound=0;
function buildMemo(){
  const grid=document.getElementById('memoGrid'); if(!grid) return;
  memoDeck=_shuffle(memoPairs.flatMap(p=>[{id:p.id,txt:p.t,kind:'t'},{id:p.id,txt:p.d,kind:'d'}]));
  memoOpen=[]; memoLock=false; memoMoves=0; memoFound=0;
  grid.innerHTML='';
  memoDeck.forEach((c,i)=>{
    const b=document.createElement('button');
    b.className='memo-card'; b.setAttribute('aria-label','Carta de memoria '+(i+1));
    b.innerHTML=`<span class="memo-face memo-front">❓</span><span class="memo-face memo-back${c.kind==='t'?' memo-term':''}">${c.txt}</span>`;
    b.onclick=()=>flipMemo(b,i);
    grid.appendChild(b);
  });
  updateMemoStats();
  const f=document.getElementById('fbMemo'); if(f) f.classList.remove('show');
}
function updateMemoStats(){ const s=document.getElementById('memoStats'); if(s) s.textContent=`🃏 Parejas: ${memoFound} de ${memoPairs.length} · Intentos: ${memoMoves}`; }
function flipMemo(btn,i){
  if(memoLock||btn.classList.contains('revealed')||btn.classList.contains('matched')) return;
  sfx('flip'); btn.classList.add('revealed'); memoOpen.push({btn,i});
  if(memoOpen.length<2) return;
  memoMoves++; memoLock=true;
  const [a,b]=memoOpen;
  if(memoDeck[a.i].id===memoDeck[b.i].id){
    setTimeout(()=>{
      a.btn.classList.add('matched'); b.btn.classList.add('matched');
      memoFound++; sfx('ok');
      if(!xpTracker.memo.has(memoDeck[a.i].id)){ xpTracker.memo.add(memoDeck[a.i].id); pts(1); }
      memoOpen=[]; memoLock=false; updateMemoStats();
      if(memoFound===memoPairs.length){ pts(2); fb('fbMemo',`¡Memoria completada en ${memoMoves} intentos! +2 XP extra`,true); sfx('fan'); launchConfetti(); }
    },450);
  } else {
    setTimeout(()=>{ a.btn.classList.remove('revealed'); b.btn.classList.remove('revealed'); memoOpen=[]; memoLock=false; sfx('no'); updateMemoStats(); },900);
  }
  updateMemoStats();
}
function resetMemo(){ sfx('click'); buildMemo(); }

// ===================== QUIZ DATA =====================
let qzData=[
  {q:'¿Cuál es el ciclo que repite un robot mientras está encendido?',o:['a) Dormir → soñar → despertar','b) Leer sensores → decidir → mover actuadores → repetir','c) Actuar → apagarse → cargarse','d) Decidir → olvidar → repetir'],c:1},
  {q:'¿Qué es el programa de un robot?',o:['a) Un canal de televisión','b) La batería del robot','c) La lista de instrucciones exactas que ejecuta paso a paso','d) El nombre que le pone el dueño'],c:2},
  {q:'¿Qué instrucción cambia el rumbo del robot sin moverlo de casilla?',o:['a) AVANZA','b) GIRA DERECHA','c) DETENTE','d) REPITE'],c:1},
  {q:'«SI el sensor de pared detecta obstáculo ENTONCES gira, SINO avanza». ¿Qué bloque es?',o:['a) Un bucle','b) Una variable','c) Un condicional','d) Un actuador'],c:2},
  {q:'El robot debe avanzar 6 casillas iguales. ¿Qué bloque conviene usar?',o:['a) Un bucle: repite 6 veces AVANZA','b) Una variable','c) Un sensor de línea','d) La instrucción ESPERA'],c:0},
  {q:'¿Para qué sirve una variable en el programa del robot?',o:['a) Para pintar el robot','b) Para guardar un número, como cuántas veces giró','c) Para cargar la batería','d) Para apagar los sensores'],c:1},
  {q:'¿Qué es el pseudocódigo?',o:['a) Un robot descompuesto','b) Un idioma secreto de las máquinas','c) El programa escrito en lenguaje claro antes de cargarlo al robot','d) Un tipo de sensor'],c:2},
  {q:'El robot chocó contra la pared. ¿Qué significa?',o:['a) Que el robot se enojó','b) Que el programa tiene un error y hay que depurarlo','c) Que la pared se movió','d) Que el robot ya no sirve'],c:1},
  {q:'¿Qué hace realmente un robot?',o:['a) Lo que dice su programa, no lo que uno quiso decir','b) Lo que se imagina','c) Lo que le conviene','d) Lo que hacen los demás robots'],c:0},
];
let qzIdx=0,qzSel=-1,qzDone=false;
function buildQz(){qzIdx=0;qzSel=-1;qzDone=false;showQz();}
function showQz(){if(qzIdx>=qzData.length){document.getElementById('qzQ').textContent='🎉 ¡Quiz completado!';document.getElementById('qzOpts').innerHTML='';fin('s-quiz');unlockAchievement('primer_quiz');return;}const q=qzData[qzIdx];document.getElementById('qzProg').textContent=`Pregunta ${qzIdx+1} de ${qzData.length}`;document.getElementById('qzQ').textContent=q.q;const opts=document.getElementById('qzOpts');opts.innerHTML='';q.o.forEach((o,i)=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=o;b.onclick=()=>{if(qzDone)return;document.querySelectorAll('.qz-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');qzSel=i;sfx('click');};opts.appendChild(b);});qzDone=false;}
function checkQz(){if(qzSel<0)return fb('fbQz','Selecciona una respuesta.',false);qzDone=true;const opts=document.querySelectorAll('.qz-opt');if(qzSel===qzData[qzIdx].c){opts[qzSel].classList.add('correct');fb('fbQz','¡Correcto! +5 XP',true);if(!xpTracker.qz.has(qzIdx)){xpTracker.qz.add(qzIdx);pts(5);}sfx('ok');}else{opts[qzSel].classList.add('wrong');opts[qzData[qzIdx].c].classList.add('correct');fb('fbQz','Incorrecto. Revisa la respuesta correcta.',false);sfx('no');}setTimeout(()=>{qzIdx++;qzSel=-1;showQz();},1600);}
function resetQz(){sfx('click');qzIdx=0;qzSel=-1;qzDone=false;showQz();document.getElementById('fbQz').classList.remove('show');}

// ===================== CLASIFICACIÓN =====================
let classGroups=[
  {label:['Instrucción','Sensor'],headA:'👣 Instrucción (el robot hace)',headB:'📡 Sensor (el robot lee)',colA:'ins',colB:'sen',
   words:[{w:'AVANZA',t:'ins'},{w:'Sensor de pared',t:'sen'},{w:'GIRA DERECHA',t:'ins'},{w:'Sensor de línea',t:'sen'},{w:'ESPERA',t:'ins'},{w:'Sensor de obstáculo',t:'sen'},{w:'GIRA IZQUIERDA',t:'ins'},{w:'Sensor de color',t:'sen'},{w:'DETENTE',t:'ins'},{w:'Sensor de distancia',t:'sen'}]},
  {label:['Bucle','Condicional'],headA:'🔄 Bucle (repetir)',headB:'❓ Condicional (decidir)',colA:'buc',colB:'con',
   words:[{w:'Repite 4 veces AVANZA',t:'buc'},{w:'SI hay pared ENTONCES gira',t:'con'},{w:'Repite hasta llegar a la meta',t:'buc'},{w:'SI ve línea negra ENTONCES sigue',t:'con'},{w:'Repite mientras no haya obstáculo',t:'buc'},{w:'SINO avanza',t:'con'},{w:'Repite 10 veces GIRA',t:'buc'},{w:'SI la tierra está seca ENTONCES riega',t:'con'}]},
  {label:['Programa correcto','Programa con bug'],headA:'✅ Programa correcto',headB:'🐞 Programa con bug',colA:'ok',colB:'bug',
   words:[{w:'AVANZA, AVANZA, GIRA, AVANZA, DETENTE',t:'ok'},{w:'GIRA, GIRA, GIRA, GIRA (nunca avanza)',t:'bug'},{w:'Repite 3 veces AVANZA y luego DETENTE',t:'ok'},{w:'AVANZA sin leer el sensor de pared',t:'bug'},{w:'SI hay pared ENTONCES gira SINO avanza',t:'ok'},{w:'Le falta la instrucción DETENTE al final',t:'bug'},{w:'Sube el contador cada vez que recoge',t:'ok'},{w:'Un bucle que nunca termina',t:'bug'}]},
  {label:['Sensor','Actuador'],headA:'📡 Sensor (entra información)',headB:'⚙️ Actuador (sale acción)',colA:'sen',colB:'act',
   words:[{w:'Sensor de línea',t:'sen'},{w:'Motor de la rueda',t:'act'},{w:'Sensor de pared',t:'sen'},{w:'Brazo que recoge',t:'act'},{w:'Sensor de color',t:'sen'},{w:'Bocina',t:'act'},{w:'Sensor de humedad',t:'sen'},{w:'Válvula del riego',t:'act'},{w:'Sensor de distancia',t:'sen'},{w:'Luz LED',t:'act'}]},
];
let currentClassGroupIdx=0,clsSelectedWord=null;
function buildClass(){const group=classGroups[currentClassGroupIdx];document.getElementById('col-left-head').textContent=group.headA;document.getElementById('col-right-head').textContent=group.headB;const bank=document.getElementById('clsBank');bank.innerHTML='';clsSelectedWord=null;document.getElementById('items-left').innerHTML='';document.getElementById('items-right').innerHTML='';_shuffle([...group.words]).forEach(w=>{const el=document.createElement('div');el.className='wb-item';el.textContent=w.w;el.dataset.t=w.t;el.onclick=()=>{document.querySelectorAll('.wb-item').forEach(i=>i.classList.remove('sel-word'));el.classList.add('sel-word');clsSelectedWord=el;sfx('click');};bank.appendChild(el);});['col-left','col-right'].forEach(colId=>{const col=document.getElementById(colId);col.onclick=(e)=>{if(!clsSelectedWord||e.target.classList.contains('drop-item'))return;const targetId=colId==='col-left'?'items-left':'items-right';const wordsCol=document.getElementById(targetId);const item=document.createElement('div');item.className='drop-item';item.textContent=clsSelectedWord.textContent;item.dataset.t=clsSelectedWord.dataset.t;const original=clsSelectedWord;item.onclick=(ev)=>{ev.stopPropagation();if(clsSelectedWord!==null){col.click();}else{document.getElementById('clsBank').appendChild(original);original.classList.remove('sel-word');item.remove();if(typeof sfx==='function')sfx('click');}};wordsCol.appendChild(item);clsSelectedWord.remove();clsSelectedWord=null;sfx('click');};});}
function checkClass(){const remaining=document.querySelectorAll('#clsBank .wb-item').length;if(remaining>0){fb('fbCls','Mueve todas las palabras a las columnas primero.',false);return;}const group=classGroups[currentClassGroupIdx];let allOk=true;document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{const inLeft=el.parentElement.id==='items-left';const expectedType=inLeft?group.colA:group.colB;if(el.dataset.t===expectedType){el.classList.add('cls-ok');}else{el.classList.add('cls-no');allOk=false;}});if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);}if(allOk){fb('fbCls','¡Perfecto! +5 XP',true);sfx('fan');fin('s-clasifica');unlockAchievement('clasif_pro');}else{fb('fbCls','Hay errores. Marcados en rojo.',false);sfx('no');}}
function nextClassGroup(){sfx('click');currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length;buildClass();document.getElementById('fbCls').classList.remove('show');showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]);}
function resetClass(){sfx('click');buildClass();document.getElementById('fbCls').classList.remove('show');}

// ===================== IDENTIFICAR =====================
let idData=[
  {s:['El','programa','es','la','lista','de','instrucciones','del','robot.'],c:1,art:'La lista de instrucciones que el robot ejecuta'},
  {s:['El','bucle','repite','el','bloque','muchas','veces.'],c:1,art:'El bloque que repite instrucciones'},
  {s:['El','condicional','decide','entre','dos','caminos.'],c:1,art:'El bloque que decide con el sensor'},
  {s:['La','variable','guarda','cuántas','veces','giró','el','robot.'],c:1,art:'La cajita donde se guarda un número'},
  {s:['El','pseudocódigo','se','escribe','antes','de','cargar','el','programa.'],c:1,art:'El programa escrito en lenguaje claro'},
  {s:['Depurar','es','buscar','y','corregir','los','errores.'],c:0,art:'La acción de corregir los errores del programa'},
  {s:['El','sensor','de','línea','distingue','el','negro','del','piso.'],c:1,art:'La parte que lee la línea del piso'},
  {s:['La','instrucción','AVANZA','mueve','al','robot','una','casilla.'],c:2,art:'La instrucción que mueve al robot hacia adelante'},
];
let idIdx=0,idDone=false;
function showId(){idDone=false;if(idIdx>=idData.length){document.getElementById('idSent').innerHTML='🎉 ¡Completado!';fin('s-identifica');unlockAchievement('id_master');return;}const d=idData[idIdx];document.getElementById('idProg').textContent=`Oración ${idIdx+1} de ${idData.length}`;document.getElementById('idInfo').textContent=`Busca: ${d.art}`;const sent=document.getElementById('idSent');sent.innerHTML='';d.s.forEach((w,i)=>{const span=document.createElement('span');span.className='id-word';span.textContent=w+' ';span.onclick=()=>checkId(i,span);sent.appendChild(span);});}
function checkId(i,span){if(idDone)return;document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected'));span.classList.add('selected');if(i===idData[idIdx].c){idDone=true;span.classList.add('id-ok');fb('fbId','¡Correcto! +5 XP',true);if(!xpTracker.id.has(idIdx)){xpTracker.id.add(idIdx);pts(5);}sfx('ok');}else{span.classList.add('id-no');fb('fbId','Ese no es el término solicitado.',false);sfx('no');}}
function nextId(){sfx('click');idIdx++;showId();document.getElementById('fbId').classList.remove('show');}
function resetId(){sfx('click');idIdx=0;showId();document.getElementById('fbId').classList.remove('show');}

// ===================== COMPLETA =====================
let cmpData=[
  {s:'El ciclo del robot es: leer sensores → ___ → mover actuadores → repetir.',opts:['decidir','dormir','pintar'],c:0},
  {s:'La lista de instrucciones que el robot obedece se llama ___.',opts:['batería','programa','antena'],c:1},
  {s:'Para repetir el mismo bloque muchas veces se usa un ___.',opts:['bucle','tornillo','cable'],c:0},
  {s:'El bloque SI… ENTONCES… SINO se llama ___.',opts:['variable','condicional','actuador'],c:1},
  {s:'Una ___ guarda cuántos objetos recogió el robot.',opts:['rueda','lámpara','variable'],c:2},
  {s:'Escribir el programa en español claro antes de cargarlo se llama ___.',opts:['pseudocódigo','dibujo','sorteo'],c:0},
  {s:'Buscar y corregir los errores del programa se llama ___.',opts:['borrar','depurar','apagar'],c:1},
  {s:'El robot hace lo que dice el ___, no lo que uno quiso decir.',opts:['maestro','viento','programa'],c:2},
];
let cmpIdx=0,cmpSel=-1,cmpDone=false;
function showCmp(){if(cmpIdx>=cmpData.length){document.getElementById('cmpSent').innerHTML='🎉 ¡Completado!';document.getElementById('cmpOpts').innerHTML='';fin('s-completa');return;}const d=cmpData[cmpIdx];document.getElementById('cmpProg').textContent=`Oración ${cmpIdx+1} de ${cmpData.length}`;document.getElementById('cmpSent').innerHTML=d.s.replace('___','<span class="blank">___</span>');const opts=document.getElementById('cmpOpts');opts.innerHTML='';cmpSel=-1;cmpDone=false;d.opts.forEach((o,i)=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=o;b.onclick=()=>{if(cmpDone)return;document.querySelectorAll('.cmp-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');cmpSel=i;sfx('click');};opts.appendChild(b);});}
function checkCmp(){if(cmpSel<0)return fb('fbCmp','Selecciona una opción.',false);cmpDone=true;const opts=document.querySelectorAll('.cmp-opt');if(cmpSel===cmpData[cmpIdx].c){opts[cmpSel].classList.add('correct');document.getElementById('cmpSent').innerHTML=cmpData[cmpIdx].s.replace('___',`<span class="blank" style="color:var(--jade);border-color:var(--jade)">${opts[cmpSel].textContent}</span>`);fb('fbCmp','¡Correcto! +5 XP',true);if(!xpTracker.cmp.has(cmpIdx)){xpTracker.cmp.add(cmpIdx);pts(5);}sfx('ok');}else{opts[cmpSel].classList.add('wrong');opts[cmpData[cmpIdx].c].classList.add('correct');fb('fbCmp','Incorrecto. Revisa bien la respuesta.',false);sfx('no');}setTimeout(()=>{cmpIdx++;document.getElementById('fbCmp').classList.remove('show');showCmp();},1600);}

// ===================== WIDGETS =====================
// Widget 1: Percibe-Decide-Actúa (ordenar el ciclo en casos concretos)
let routeSets=[
  {label:'El robot seguidor de línea del pasillo de la escuela',steps:['El sensor de línea lee el piso: ¿hay negro adelante?','El controlador decide: si hay línea, seguir; si no, girar','Los motores ejecutan la orden y mueven las ruedas','El robot vuelve a leer el sensor: el ciclo se repite']},
  {label:'El robot que recoge la basura del patio',steps:['El sensor de obstáculo detecta la botella tirada','El programa decide: si hay objeto, entonces recogerlo','El brazo actúa y guarda la botella en la caja','La variable sube uno: objetos = objetos + 1','El bucle se repite hasta terminar el patio']},
  {label:'Programar el robot regador del huerto escolar',steps:['Escribir el pseudocódigo del riego en el cuaderno','Cargar el programa en el controlador del robot','Probar el programa paso a paso en el huerto','Depurar: corregir la instrucción que hizo fallar al robot','Volver a probar hasta que el riego salga bien']},
];
let currentRouteIdx=0,routeItems=[];
function buildRoute(){routeItems=_shuffle([...routeSets[currentRouteIdx].steps]);renderRoute();const fbEl=document.getElementById('fbRoute');if(fbEl)fbEl.classList.remove('show');}
function renderRoute(){const list=document.getElementById('routeList');if(!list)return;list.innerHTML='';routeItems.forEach((step,i)=>{const div=document.createElement('div');div.className='sort-item';div.innerHTML=`<div class="sort-arrows"><button class="sort-arrow" onclick="routeMove(${i},-1)"${i===0?' disabled':''}>▲</button><button class="sort-arrow" onclick="routeMove(${i},1)"${i===routeItems.length-1?' disabled':''}>▼</button></div><div class="sort-step-num">${i+1}.</div><div class="sort-item-txt">${step}</div>`;list.appendChild(div);});}
function routeMove(idx,dir){sfx('click');const ni=idx+dir;if(ni<0||ni>=routeItems.length)return;[routeItems[idx],routeItems[ni]]=[routeItems[ni],routeItems[idx]];renderRoute();}
function checkRoute(){const correct=routeSets[currentRouteIdx].steps;const isOk=routeItems.every((s,i)=>s===correct[i]);if(isOk){fb('fbRoute','¡Perfecto! Orden correcto. +4 XP',true);if(!xpTracker.wgt.has('route_'+currentRouteIdx)){xpTracker.wgt.add('route_'+currentRouteIdx);pts(4);}sfx('fan');fin('s-widgets');unlockAchievement('widgets_master');}else{fb('fbRoute','Hay pasos fuera de orden. Recuerda: leer sensores → decidir → mover actuadores → repetir.',false);sfx('no');}}
function nextRoute(){sfx('click');currentRouteIdx=(currentRouteIdx+1)%routeSets.length;buildRoute();showToast('🔄 Caso: '+routeSets[currentRouteIdx].label);}

// Widget 2: ¿Qué bloque necesita el programa?
let neuronPartes=[
  {desc:'El robot debe avanzar 6 casillas iguales por el pasillo',ans:'Un bucle: repite 6 veces AVANZA',opts:['Un bucle: repite 6 veces AVANZA','Una variable contadora','Un sensor de color','La instrucción ESPERA']},
  {desc:'El robot debe girar solo cuando encuentre una pared adelante',ans:'Un condicional con el sensor de pared',opts:['Un condicional con el sensor de pared','Un bucle infinito','Una variable contadora','La instrucción DETENTE']},
  {desc:'El robot debe contar cuántas botellas recogió en el patio',ans:'Una variable contadora',opts:['Una variable contadora','Un sensor de línea','La instrucción GIRA DERECHA','Un condicional de pared']},
  {desc:'El robot debe seguir la línea negra pintada en el piso del aula',ans:'Un condicional con el sensor de línea',opts:['Un condicional con el sensor de línea','Una variable contadora','La instrucción ESPERA','Un bucle de 2 veces']},
  {desc:'El robot debe quedarse quieto un momento antes de arrancar',ans:'La instrucción ESPERA',opts:['La instrucción ESPERA','AVANZA','Una variable contadora','Un sensor de pared']},
  {desc:'El robot debe seguir avanzando mientras no encuentre obstáculos',ans:'Un bucle: repite mientras no haya obstáculo',opts:['Un bucle: repite mientras no haya obstáculo','Una variable contadora','La instrucción DETENTE','Un sensor de color']},
  {desc:'El robot llegó a la meta y debe quedarse ahí',ans:'La instrucción DETENTE',opts:['La instrucción DETENTE','AVANZA','GIRA IZQUIERDA','Un bucle infinito']},
  {desc:'Antes de cargar el programa quieres escribirlo en español para revisarlo',ans:'Escribir el pseudocódigo',opts:['Escribir el pseudocódigo','Cambiar la batería','Pintar el robot','Quitarle los sensores']},
];
let neuronIdx=0,neuronDone=false;
function showNeuron(){neuronDone=false;if(neuronIdx>=neuronPartes.length){const el=document.getElementById('neuronDesc');if(el)el.textContent='🎉 ¡Ya sabes elegir el bloque correcto!';const opts=document.getElementById('neuronOpts');if(opts)opts.innerHTML='';fin('s-widgets');return;}const d=neuronPartes[neuronIdx];const prog=document.getElementById('neuronProg');if(prog)prog.textContent=`Pista ${neuronIdx+1} de ${neuronPartes.length}`;const desc=document.getElementById('neuronDesc');if(desc)desc.textContent=d.desc;const opts=document.getElementById('neuronOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=opt;b.onclick=()=>checkNeuron(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuron');if(fbEl)fbEl.classList.remove('show');}
function checkNeuron(opt,btn,d){if(neuronDone)return;neuronDone=true;document.querySelectorAll('#neuronOpts .cmp-opt').forEach(b=>{if(b.textContent===d.ans)b.classList.add('correct');else if(b===btn&&b.textContent!==d.ans)b.classList.add('wrong');});const isOk=opt===d.ans;if(isOk){fb('fbNeuron','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuron_'+neuronIdx)){xpTracker.wgt.add('neuron_'+neuronIdx);pts(3);}sfx('ok');}else{fb('fbNeuron','La respuesta correcta es: '+d.ans,false);sfx('no');}}
function nextNeuron(){sfx('click');neuronIdx++;showNeuron();}
function resetNeuron(){sfx('click');neuronIdx=0;showNeuron();}

// Widget 3: Parte → Función
let neuroPairs=[
  {trans:'AVANZA',func:'Mueve al robot una casilla hacia adelante',opts:['Mueve al robot una casilla hacia adelante','Cambia el rumbo sin moverse de casilla','Repite un bloque de instrucciones','Guarda un número en una cajita']},
  {trans:'GIRA DERECHA',func:'Cambia el rumbo del robot sin cambiar de casilla',opts:['Cambia el rumbo del robot sin cambiar de casilla','Avanza dos casillas de golpe','Enciende la batería','Borra el programa']},
  {trans:'Bucle',func:'Repite un bloque de instrucciones varias veces',opts:['Repite un bloque de instrucciones varias veces','Lee el sensor de línea','Apaga los motores','Escribe el pseudocódigo']},
  {trans:'Condicional',func:'Lee un sensor y elige entre dos caminos',opts:['Lee un sensor y elige entre dos caminos','Suma uno al contador','Mueve el brazo del robot','Carga la batería']},
  {trans:'Variable',func:'Guarda un número, como cuántas veces giró el robot',opts:['Guarda un número, como cuántas veces giró el robot','Mueve las ruedas','Detecta la pared de adelante','Repite el programa entero']},
];
let neuroIdx=0,neuroDone=false;
function showNeuro(){neuroDone=false;if(neuroIdx>=neuroPairs.length){const el=document.getElementById('neuroTrans');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('neuroOpts');if(opts)opts.innerHTML='';return;}const d=neuroPairs[neuroIdx];const prog=document.getElementById('neuroProg');if(prog)prog.textContent=`${neuroIdx+1} de ${neuroPairs.length}`;const trans=document.getElementById('neuroTrans');if(trans)trans.textContent=d.trans;const opts=document.getElementById('neuroOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkNeuro(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuro');if(fbEl)fbEl.classList.remove('show');}
function checkNeuro(opt,btn,d){if(neuroDone)return;neuroDone=true;document.querySelectorAll('#neuroOpts .qz-opt').forEach(b=>{if(b.textContent===d.func)b.classList.add('correct');else if(b===btn&&b.textContent!==d.func)b.classList.add('wrong');});const isOk=opt===d.func;if(isOk){fb('fbNeuro','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuro_'+neuroIdx)){xpTracker.wgt.add('neuro_'+neuroIdx);pts(3);}sfx('ok');}else{fb('fbNeuro','Correcto: '+d.func,false);sfx('no');}setTimeout(()=>{neuroIdx++;showNeuro();},1800);}
function resetNeuro(){sfx('click');neuroIdx=0;showNeuro();}

// Widget 4: ¿Robot o no es robot?
let enfermedadData=[
  {disease:'AVANZA · AVANZA · GIRA DERECHA · AVANZA · DETENTE',characteristic:'Programa correcto',opts:['Programa correcto','Tiene un bug']},
  {disease:'GIRA DERECHA · GIRA DERECHA · GIRA DERECHA · GIRA DERECHA (el robot nunca cambia de casilla)',characteristic:'Tiene un bug',opts:['Tiene un bug','Programa correcto']},
  {disease:'REPITE 5 VECES: AVANZA. Luego DETENTE',characteristic:'Programa correcto',opts:['Programa correcto','Tiene un bug']},
  {disease:'AVANZA hacia la pared sin leer nunca el sensor de pared',characteristic:'Tiene un bug',opts:['Tiene un bug','Programa correcto']},
  {disease:'SI hay línea adelante ENTONCES AVANZA, SINO GIRA DERECHA',characteristic:'Programa correcto',opts:['Programa correcto','Tiene un bug']},
  {disease:'REPITE PARA SIEMPRE: ESPERA (el robot nunca llega a la meta)',characteristic:'Tiene un bug',opts:['Tiene un bug','Programa correcto']},
];
let enferIdx=0,enferDone=false;
function showEnfer(){enferDone=false;if(enferIdx>=enfermedadData.length){const el=document.getElementById('enferDisease');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('enferOpts');if(opts)opts.innerHTML='';return;}const d=enfermedadData[enferIdx];const prog=document.getElementById('enferProg');if(prog)prog.textContent=`${enferIdx+1} de ${enfermedadData.length}`;const dis=document.getElementById('enferDisease');if(dis)dis.textContent=d.disease;const opts=document.getElementById('enferOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkEnfer(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbEnfer');if(fbEl)fbEl.classList.remove('show');}
function checkEnfer(opt,btn,d){if(enferDone)return;enferDone=true;document.querySelectorAll('#enferOpts .qz-opt').forEach(b=>{if(b.textContent===d.characteristic)b.classList.add('correct');else if(b===btn&&b.textContent!==d.characteristic)b.classList.add('wrong');});const isOk=opt===d.characteristic;if(isOk){fb('fbEnfer','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('enfer_'+enferIdx)){xpTracker.wgt.add('enfer_'+enferIdx);pts(3);}sfx('ok');}else{fb('fbEnfer','Correcto: '+d.characteristic+'. Pregúntate: ¿el robot llega a la meta y el programa termina?',false);sfx('no');}setTimeout(()=>{enferIdx++;showEnfer();},1800);}
function resetEnfer(){sfx('click');enferIdx=0;showEnfer();}

// ===================== RETO FINAL =====================
let retoPairs=[
  {label:['Instrucción','Sensor'],btnA:'👣 Instrucción',btnB:'📡 Sensor',colA:'ins',colB:'sen',
   words:[{w:'AVANZA',t:'ins'},{w:'Sensor de pared',t:'sen'},{w:'GIRA DERECHA',t:'ins'},{w:'Sensor de línea',t:'sen'},{w:'ESPERA',t:'ins'},{w:'Sensor de color',t:'sen'},{w:'GIRA IZQUIERDA',t:'ins'},{w:'Sensor de distancia',t:'sen'},{w:'DETENTE',t:'ins'},{w:'Sensor de obstáculo',t:'sen'}]},
  {label:['Bucle','Condicional'],btnA:'🔄 Bucle',btnB:'❓ Condicional',colA:'buc',colB:'con',
   words:[{w:'Repite 4 veces',t:'buc'},{w:'SI hay pared…',t:'con'},{w:'Repite hasta llegar',t:'buc'},{w:'SINO avanza',t:'con'},{w:'Repite mientras avance',t:'buc'},{w:'SI ve línea negra…',t:'con'},{w:'Repite 10 veces GIRA',t:'buc'},{w:'ENTONCES gira',t:'con'},{w:'Vuelve a empezar el bloque',t:'buc'},{w:'¿Hay obstáculo adelante?',t:'con'}]},
  {label:['Programa correcto','Bug'],btnA:'✅ Correcto',btnB:'🐞 Bug',colA:'ok',colB:'bug',
   words:[{w:'Avanza y luego DETENTE en la meta',t:'ok'},{w:'Gira sin parar y nunca avanza',t:'bug'},{w:'Repite 3 veces AVANZA',t:'ok'},{w:'Choca porque no lee el sensor',t:'bug'},{w:'SI hay pared ENTONCES gira',t:'ok'},{w:'Le falta la instrucción final',t:'bug'},{w:'Suma 1 al contador al recoger',t:'ok'},{w:'Bucle que nunca termina',t:'bug'},{w:'Prueba el programa paso a paso',t:'ok'},{w:'Instrucciones en desorden',t:'bug'}]},
];
let currentRetoPairIdx=0,retoPool=[],retoOk=0,retoErr=0,retoTimerInt=null,retoSec=30,retoRunning=false,retoCurrent=null;
function updateRetoButtons(){const pair=retoPairs[currentRetoPairIdx];document.querySelectorAll('.reto-btns .btn')[0].textContent=pair.btnA;document.querySelectorAll('.reto-btns .btn')[1].textContent=pair.btnB;document.querySelectorAll('.reto-btns .btn')[0].onclick=()=>ansReto(pair.colA);document.querySelectorAll('.reto-btns .btn')[1].onclick=()=>ansReto(pair.colB);}
function startReto(){if(retoRunning)return;sfx('click');retoRunning=true;retoOk=0;retoErr=0;retoSec=30;retoPool=_shuffle([...retoPairs[currentRetoPairIdx].words,...retoPairs[currentRetoPairIdx].words]);showRetoWord();retoTimerInt=setInterval(()=>{retoSec--;sfx('tick');document.getElementById('retoTimer').textContent='⏱ '+retoSec;if(retoSec<=10)document.getElementById('retoTimer').style.color='var(--red)';if(retoSec<=0){clearInterval(retoTimerInt);endReto();}},1000);}
function showRetoWord(){if(retoPool.length===0)retoPool=_shuffle([...retoPairs[currentRetoPairIdx].words,...retoPairs[currentRetoPairIdx].words]);retoCurrent=retoPool.pop();document.getElementById('retoWord').textContent=retoCurrent.w;}
function ansReto(t){if(!retoRunning||!retoCurrent)return;const firstPlay=!xpTracker.reto.has(currentRetoPairIdx);if(t===retoCurrent.t){sfx('ok');retoOk++;if(firstPlay)pts(1);}else{sfx('no');retoErr++;if(firstPlay)pts(-1);}document.getElementById('retoScore').textContent=`✅ ${retoOk} correctas | ❌ ${retoErr} errores`;showRetoWord();}
function endReto(){retoRunning=false;document.getElementById('retoWord').textContent='🏁 ¡Tiempo!';document.getElementById('retoTimer').style.color='var(--pri)';xpTracker.reto.add(currentRetoPairIdx);const total=retoOk+retoErr;const pct=total>0?Math.round((retoOk/total)*100):0;fb('fbReto',`Resultado: ${retoOk}/${total} (${pct}%) ¡Bien hecho!`,true);fin('s-reto');sfx('fan');unlockAchievement('reto_hero');}
function nextRetoPair(){sfx('click');clearInterval(retoTimerInt);retoRunning=false;retoSec=30;retoOk=0;retoErr=0;currentRetoPairIdx=(currentRetoPairIdx+1)%retoPairs.length;updateRetoButtons();document.getElementById('retoTimer').textContent='⏱ 30';document.getElementById('retoTimer').style.color='var(--pri)';document.getElementById('retoWord').textContent='¡Prepárate!';document.getElementById('retoScore').textContent='✅ 0 correctas | ❌ 0 errores';document.getElementById('fbReto').classList.remove('show');showToast(`🔄 Pareja: ${retoPairs[currentRetoPairIdx].label[0]} vs ${retoPairs[currentRetoPairIdx].label[1]}`);}
function resetReto(){sfx('click');clearInterval(retoTimerInt);retoRunning=false;retoSec=30;retoOk=0;retoErr=0;document.getElementById('retoTimer').textContent='⏱ 30';document.getElementById('retoTimer').style.color='var(--pri)';document.getElementById('retoWord').textContent='¡Prepárate!';document.getElementById('retoScore').textContent='✅ 0 correctas | ❌ 0 errores';document.getElementById('fbReto').classList.remove('show');}

// ===================== TASK GENERATOR =====================
let identifyTaskDB=[
  {s:'El programa es la lista de instrucciones exactas del robot.',type:'Programa'},
  {s:'Repite 6 veces AVANZA hasta cruzar el pasillo.',type:'Bucle'},
  {s:'SI el sensor de pared detecta obstáculo ENTONCES gira.',type:'Condicional'},
  {s:'La cajita «giros» guarda cuántas veces giró el robot.',type:'Variable'},
  {s:'El sensor de línea distingue el negro del piso claro.',type:'Sensor de línea'},
  {s:'Escribo el programa en español antes de cargarlo al robot.',type:'Pseudocódigo'},
  {s:'Pruebo el programa paso a paso y corrijo la instrucción equivocada.',type:'Depuración'},
  {s:'GIRA DERECHA cambia el rumbo sin cambiar de casilla.',type:'Instrucción de giro'},
  {s:'Los motores mueven las ruedas cuando llega la orden.',type:'Actuadores'},
  {s:'Leer sensores, decidir, mover actuadores y repetir.',type:'Ciclo del robot'},
];
let classifyTaskDB=[
  {w:'SI hay pared adelante ENTONCES gira, SINO avanza',gen:'Condicional',n:'El sensor de pared',g:'Girar o avanzar',t:'Gira las ruedas o avanza una casilla'},
  {w:'REPITE 6 VECES: AVANZA',gen:'Bucle',n:'Nada: solo cuenta las repeticiones',g:'Repetir el bloque 6 veces',t:'Avanza 6 casillas seguidas'},
  {w:'objetos = objetos + 1',gen:'Variable (contador)',n:'Nada: usa el número que ya guardó',g:'Sumar uno al contador',t:'Guarda el nuevo número en la cajita'},
  {w:'SI el sensor de línea ve negro ENTONCES sigue, SINO gira',gen:'Condicional',n:'El sensor de línea',g:'Seguir la línea o corregir el rumbo',t:'Avanza o gira las ruedas'},
  {w:'AVANZA',gen:'Instrucción simple',n:'Nada',g:'Nada: se ejecuta directo',t:'Mueve al robot una casilla adelante'},
  {w:'REPITE MIENTRAS no haya obstáculo: AVANZA',gen:'Bucle con condición',n:'El sensor de obstáculo',g:'Seguir repitiendo o salir del bucle',t:'Avanza hasta encontrar algo'},
  {w:'ESPERA',gen:'Instrucción simple',n:'Nada',g:'Nada',t:'Deja pasar el tiempo sin moverse'},
  {w:'DETENTE',gen:'Instrucción final',n:'Nada',g:'Nada',t:'El robot se queda quieto en la meta'},
];
let completeTaskDB=[
  {s:'El ciclo del robot es: leer sensores → ___ → mover actuadores → repetir.',opts:['decidir','dormir','cantar'],ans:'decidir'},
  {s:'La lista de instrucciones del robot se llama ___.',opts:['programa','batería','rueda'],ans:'programa'},
  {s:'Para repetir un bloque varias veces se usa un ___.',opts:['bucle','tornillo','imán'],ans:'bucle'},
  {s:'SI… ENTONCES… SINO es un ___.',opts:['condicional','actuador','panel'],ans:'condicional'},
  {s:'La ___ guarda cuántas veces giró el robot.',opts:['variable','antena','hélice'],ans:'variable'},
  {s:'El programa escrito en español claro se llama ___.',opts:['pseudocódigo','dibujo','poema'],ans:'pseudocódigo'},
  {s:'Corregir los errores del programa se llama ___.',opts:['depurar','borrar','apagar'],ans:'depurar'},
  {s:'El robot hace lo que dice el ___, no lo que uno quiso decir.',opts:['programa','maestro','viento'],ans:'programa'},
];
let explainQuestions=[
  {q:'Explica el ciclo de un robot programado: leer sensores → decidir → mover actuadores → repetir. Pon un ejemplo de tu escuela.',ans:'El robot lee sus sensores (por ejemplo el sensor de línea del pasillo), su programa decide qué hacer («si hay línea, sigue; si no, gira»), los motores ejecutan la orden y el ciclo vuelve a empezar. Se repite mientras el robot está encendido.'},
  {q:'Escribe en pseudocódigo el programa de un robot que sigue la línea negra del pasillo de la escuela.',ans:'REPITE HASTA LLEGAR AL AULA: SI el sensor de línea ve negro adelante ENTONCES AVANZA, SINO GIRA DERECHA. Al llegar: DETENTE. (Vale cualquier redacción clara con un bucle y un condicional.)'},
  {q:'¿Qué es depurar un programa? Explica por qué el robot «hace lo que dice el programa, no lo que uno quiso decir».',ans:'Depurar es buscar y corregir los errores (bugs) del programa probándolo paso a paso. El robot no adivina: ejecuta literalmente cada instrucción, por eso una instrucción de más, de menos o en mal orden lo hace chocar o perderse.'},
  {q:'Diseña el programa de un robot que recoge la basura del patio y cuenta cuántos objetos recogió.',ans:'Respuesta libre. Debe incluir: un bucle («repite mientras queden objetos»), un condicional con el sensor de obstáculo («si hay objeto adelante entonces recoge») y una variable contadora («objetos = objetos + 1»), y terminar con DETENTE.'},
  {q:'Escribe el programa del robot regador del huerto escolar usando un bucle, un condicional y una variable.',ans:'Respuesta libre. Ejemplo: plantas = 0. REPITE 10 VECES: AVANZA; SI el sensor de humedad dice tierra seca ENTONCES abre la válvula, SINO sigue; plantas = plantas + 1. Al final DETENTE y avisa cuántas plantas regó.'},
];
let ansVisible=false;
function genTask(){sfx('click');const type=document.getElementById('tgType').value;const count=parseInt(document.getElementById('tgCount').value);ansVisible=false;const out=document.getElementById('tgOut');out.innerHTML='';if(type==='identify')genIdentifyTask(out,count);else if(type==='classify')genClassifyTask(out,count);else if(type==='complete')genCompleteTask(out,count);else if(type==='explain')genExplainTask(out,count);fin('s-tareas');}
function _instrBlock(out,title,lines){const ib=document.createElement('div');ib.className='tg-instruction-block';ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join('');out.appendChild(ib);}
function genIdentifyTask(out,count){_instrBlock(out,'Instrucción',['Copia en tu cuaderno; subraya, colorea o encierra el concepto de programación indicado en cada oración. Escribe al lado qué bloque o parte del programa es.','<strong>Ejemplo:</strong> Repite 6 veces AVANZA. → <span style="color:var(--jade);font-weight:700;">Bucle</span>']);_pick(identifyTaskDB,Math.min(count,identifyTaskDB.length)).forEach((item,i)=>{const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.type}</div></div>`;out.appendChild(div);});}
function genClassifyTask(out,count){_instrBlock(out,'Instrucción',['Copia la siguiente tabla en tu cuaderno. Para cada línea de programa responde: ¿qué tipo de bloque es?, ¿qué sensor lee?, ¿qué decide? y ¿qué hace el robot? Explica con tus palabras.']);const items=_pick(classifyTaskDB,Math.min(count,classifyTaskDB.length));const wrap=document.createElement('div');wrap.style.overflowX='auto';const th=(t,extra='')=>`<th style="padding:0.3rem 0.4rem;border:1px solid var(--border);font-size:0.72rem;text-align:center;${extra}">${t}</th>`;let html=`<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:520px;"><thead><tr style="background:var(--pri-gl);">${th('Línea del programa','text-align:left;')}${th('¿Qué bloque es?')}${th('¿Qué lee?')}${th('¿Qué decide?')}${th('¿Qué hace?')}</tr></thead><tbody>`;items.forEach(it=>{html+=`<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td>`+Array(4).fill(`<td style="padding:0.4rem;border:1px solid var(--border);min-width:50px;"></td>`).join('')+'</tr>';});html+='</tbody></table>';wrap.innerHTML=html;out.appendChild(wrap);const ans=document.createElement('div');ans.className='tg-answer';ans.style.marginTop='0.8rem';ans.innerHTML='<strong>✅ Respuestas:</strong><br>'+items.map(it=>`<strong>${it.w}:</strong> Bloque: ${it.gen} | Lee: ${it.n} | Decide: ${it.g} | Hace: ${it.t}`).join('<br>');out.appendChild(ans);}
function genCompleteTask(out,count){_instrBlock(out,'Instrucción',['Copia y resuelve en tu cuaderno. Cada oración tiene un espacio ___. Elige y escribe la opción correcta.']);const pool=_shuffle([...completeTaskDB]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';const sent=item.s.replace('___','<span class="tg-blank" style="min-width:90px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${sent}</strong><div style="margin-top:0.4rem;font-size:0.82rem;color:var(--gray);">📝 Opciones: <strong>${item.opts.join(' | ')}</strong></div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function genExplainTask(out,count){_instrBlock(out,'Instrucción',['Copia las siguientes preguntas en tu cuaderno y responde cada una de forma clara y completa. Puedes acompañarlas con dibujos.']);const pool=_shuffle([...explainQuestions]);for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.3rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}}
function toggleAns(){ansVisible=!ansVisible;document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none');sfx('click');}

// ===================== SOPA DE LETRAS =====================
let sopaSets=[
  {size:10,grid:[
    ['I','I','E','I','S','T','E','F','R','Q'],
    ['U','A','M','E','Y','H','H','A','F','S'],
    ['R','M','D','R','L','M','R','P','G','E'],
    ['G','A','R','S','R','I','P','Z','B','N'],
    ['T','R','E','Q','G','C','R','G','Z','S'],
    ['I','G','H','R','O','B','O','T','S','O'],
    ['Y','O','L','T','U','U','E','A','V','R'],
    ['N','R','C','E','L','C','U','B','B','G'],
    ['A','P','N','T','O','V','I','I','G','G'],
    ['I','A','V','A','N','Z','A','R','A','Z']
  ],words:[
    {w:'PROGRAMA',cells:[[8,1],[7,1],[6,1],[5,1],[4,1],[3,1],[2,1],[1,1]]},
    {w:'SENSOR',cells:[[1,9],[2,9],[3,9],[4,9],[5,9],[6,9]]},
    {w:'AVANZAR',cells:[[9,1],[9,2],[9,3],[9,4],[9,5],[9,6],[9,7]]},
    {w:'GIRAR',cells:[[4,4],[3,5],[2,6],[1,7],[0,8]]},
    {w:'BUCLE',cells:[[7,7],[7,6],[7,5],[7,4],[7,3]]},
    {w:'ROBOT',cells:[[5,3],[5,4],[5,5],[5,6],[5,7]]}
  ]},
  {size:10,grid:[
    ['C','H','C','Z','R','A','T','N','O','C'],
    ['D','U','I','R','E','P','C','H','A','Y'],
    ['A','L','B','R','D','O','A','B','C','N'],
    ['V','A','R','I','A','B','L','E','A','H'],
    ['C','O','B','I','R','V','V','Z','S','L'],
    ['R','H','D','M','L','E','Q','O','A','V'],
    ['I','L','C','Q','C','O','D','I','G','O'],
    ['U','U','H','I','T','R','Q','A','M','A'],
    ['L','I','N','E','A','P','T','E','A','T'],
    ['M','Q','S','R','I','T','E','P','E','R']
  ],words:[
    {w:'VARIABLE',cells:[[3,0],[3,1],[3,2],[3,3],[3,4],[3,5],[3,6],[3,7]]},
    {w:'REPETIR',cells:[[9,9],[9,8],[9,7],[9,6],[9,5],[9,4],[9,3]]},
    {w:'CODIGO',cells:[[6,4],[6,5],[6,6],[6,7],[6,8],[6,9]]},
    {w:'CONTAR',cells:[[0,9],[0,8],[0,7],[0,6],[0,5],[0,4]]},
    {w:'LINEA',cells:[[8,0],[8,1],[8,2],[8,3],[8,4]]},
    {w:'ERROR',cells:[[1,4],[2,3],[3,2],[4,1],[5,0]]}
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
  if(xp<2){ showToast('⚠️ Necesitas al menos 2 XP para usar la linterna.'); return; }
  const set=sopaSets[currentSopaSetIdx];
  const pend=set.words.filter(wObj=>!sopaFoundWords.has(wObj.w));
  if(pend.length===0){ showToast('🎉 ¡Ya encontraste todas las palabras!'); return; }
  pts(-2);
  const cells=[];
  pend.forEach(wObj=>wObj.cells.forEach(([r,c])=>{ const el=document.querySelector(`#sopaGrid [data-row="${r}"][data-col="${c}"]`); if(el){ el.classList.add('sopa-peek'); cells.push(el); } }));
  showToast('🔦 ¡Linterna encendida 3 segundos! (-2 XP)');
  setTimeout(()=>cells.forEach(el=>el.classList.remove('sopa-peek')),3000);
}
let _sopaResizeTimer=null;
window.addEventListener('resize',()=>{clearTimeout(_sopaResizeTimer);_sopaResizeTimer=setTimeout(()=>{if(document.getElementById('s-sopa').classList.contains('active'))buildSopa();},200);});

// ===================== EVALUACIÓN FINAL =====================
let evalTFBank=[
  {q:'El programa es la lista de instrucciones exactas que el robot ejecuta paso a paso.',a:true},
  {q:'El ciclo del robot es: leer sensores → decidir → mover actuadores → repetir.',a:true},
  {q:'El robot adivina lo que el programador quiso decir.',a:false},
  {q:'Un bucle sirve para repetir un bloque de instrucciones.',a:true},
  {q:'Un condicional decide entre dos caminos según lo que lee el sensor.',a:true},
  {q:'La instrucción GIRA DERECHA mueve al robot dos casillas hacia adelante.',a:false},
  {q:'Una variable es una cajita con nombre donde el robot guarda un número.',a:true},
  {q:'El pseudocódigo se escribe después de cargar el programa al robot.',a:false},
  {q:'Depurar es buscar y corregir los errores del programa.',a:true},
  {q:'Un bucle que nunca termina no causa ningún problema.',a:false},
  {q:'El sensor de línea distingue la línea negra del piso claro.',a:true},
  {q:'Si al programa le falta la instrucción final, el robot igual sabe cuándo parar.',a:false},
  {q:'El ciclo del robot se ejecuta una sola vez y luego el robot se apaga.',a:false},
  {q:'Los actuadores ejecutan la orden que envía el programa.',a:true},
  {q:'Un contador resta uno cada vez que el robot recoge un objeto.',a:false},
];
let evalMCBank=[
  {q:'¿Qué es el programa de un robot?',o:['a) Su batería','b) Su carcasa de metal','c) La lista de instrucciones exactas que ejecuta paso a paso','d) El nombre que le puso el dueño'],a:2},
  {q:'¿Cuál es el ciclo de un robot programado?',o:['a) Dormir → soñar → despertar','b) Leer sensores → decidir → mover actuadores → repetir','c) Actuar → apagar → cargar','d) Girar → girar → girar'],a:1},
  {q:'El robot debe avanzar 8 casillas iguales. ¿Qué bloque conviene usar?',o:['a) Un bucle: repite 8 veces AVANZA','b) Una variable','c) Un sensor de color','d) La instrucción ESPERA'],a:0},
  {q:'«SI el sensor de pared detecta obstáculo ENTONCES gira, SINO avanza» es…',o:['a) Un bucle','b) Una variable','c) Un actuador','d) Un condicional'],a:3},
  {q:'¿Para qué sirve una variable en el programa?',o:['a) Para mover las ruedas','b) Para guardar un número, como cuántas veces giró','c) Para cargar la batería','d) Para pintar el robot'],a:1},
  {q:'¿Qué es el pseudocódigo?',o:['a) Un robot descompuesto','b) Un idioma secreto de las máquinas','c) El programa escrito en lenguaje claro antes de cargarlo','d) Un sensor especial'],a:2},
  {q:'El robot chocó con la pared. ¿Qué hay que hacer?',o:['a) Depurar: revisar el programa paso a paso y corregirlo','b) Cambiarle el nombre al robot','c) Mover la pared de lugar','d) Apagar los sensores para siempre'],a:0},
  {q:'¿Qué instrucción cambia el rumbo del robot sin moverlo de casilla?',o:['a) AVANZA','b) ESPERA','c) GIRA IZQUIERDA','d) DETENTE'],a:2},
  {q:'¿Qué sensor usa un robot que sigue la línea del pasillo de la escuela?',o:['a) El sensor de humedad','b) El sensor de línea (color)','c) El sensor de sonido','d) El sensor de temperatura'],a:1},
  {q:'Un bucle que nunca termina…',o:['a) hace al robot más rápido','b) ahorra batería','c) es la mejor forma de programar','d) es un error: el robot nunca llega a la meta'],a:3},
  {q:'¿Qué significa «el robot hace lo que dice el programa, no lo que uno quiso decir»?',o:['a) Que ejecuta literalmente cada instrucción, aunque esté equivocada','b) Que el robot es desobediente','c) Que el robot inventa instrucciones nuevas','d) Que el robot no necesita programa'],a:0},
  {q:'¿Qué bloque necesita un robot para contar cuántas botellas recogió en el patio?',o:['a) Un sensor de temperatura','b) Una variable contadora','c) La instrucción ESPERA','d) Una bocina'],a:1},
  {q:'¿Qué hace la instrucción ESPERA?',o:['a) Mueve al robot una casilla','b) Repite el programa entero','c) Deja pasar el tiempo sin mover al robot','d) Borra el programa'],a:2},
  {q:'¿Cuál es el primer paso para programar bien un robot?',o:['a) Apretar botones al azar','b) Escribir el pseudocódigo en lenguaje claro','c) Cambiar la batería','d) Quitarle los sensores'],a:1},
  {q:'En el huerto escolar, ¿qué condicional usa el robot regador?',o:['a) SI hace sol ENTONCES apaga el robot','b) SI hay ruido ENTONCES gira','c) SI hay línea ENTONCES riega','d) SI la tierra está seca ENTONCES abre el agua, SINO sigue adelante'],a:3},
];
let evalCPBank=[
  {q:'La lista de instrucciones exactas del robot se llama ___.',a:'programa'},
  {q:'El ciclo del robot es: leer sensores, decidir, mover actuadores y ___.',a:'repetir'},
  {q:'Para repetir un bloque muchas veces se usa un ___.',a:'bucle'},
  {q:'El bloque SI… ENTONCES… SINO se llama ___.',a:'condicional'},
  {q:'La cajita donde el robot guarda un número se llama ___.',a:'variable'},
  {q:'El programa escrito en lenguaje claro antes de cargarlo es el ___.',a:'pseudocódigo'},
  {q:'Buscar y corregir los errores del programa se llama ___.',a:'depurar'},
  {q:'Un error del programa también se llama ___.',a:'bug'},
  {q:'La instrucción que mueve al robot una casilla adelante es ___.',a:'avanza'},
  {q:'La instrucción que cambia el rumbo del robot es ___ a la derecha o a la izquierda.',a:'girar'},
  {q:'El sensor de ___ distingue el negro del piso claro.',a:'línea'},
  {q:'El sensor de ___ avisa si hay un obstáculo justo adelante.',a:'pared'},
  {q:'La variable que suma uno cada vez se llama ___.',a:'contador'},
  {q:'Los ___ ejecutan la orden: motores y ruedas.',a:'actuadores'},
  {q:'Cuando el robot llega a la meta, el programa termina con la instrucción ___.',a:'detente'},
];
let evalPRBank=[
  {term:'Programa',def:'Lista de instrucciones exactas que el robot ejecuta paso a paso'},
  {term:'Ciclo del robot',def:'Leer sensores → decidir → mover actuadores → repetir'},
  {term:'Bucle',def:'Repite un bloque de instrucciones varias veces'},
  {term:'Condicional',def:'SI el sensor detecta algo, ENTONCES…, SINO…'},
  {term:'Variable',def:'Cajita con nombre donde se guarda un número'},
  {term:'Contador',def:'Variable que suma uno cada vez que ocurre algo'},
  {term:'Pseudocódigo',def:'El programa escrito en lenguaje claro antes de cargarlo'},
  {term:'Depurar',def:'Buscar y corregir los errores del programa'},
  {term:'Bug',def:'Instrucción equivocada o en mal orden que hace fallar al robot'},
  {term:'AVANZA',def:'Mueve al robot una casilla hacia adelante'},
  {term:'GIRA DERECHA',def:'Cambia el rumbo del robot sin cambiar de casilla'},
  {term:'ESPERA',def:'Deja pasar el tiempo sin mover al robot'},
  {term:'DETENTE',def:'Instrucción final: el robot se queda quieto en la meta'},
  {term:'Sensor de línea',def:'Distingue la línea negra del piso claro'},
  {term:'Sensor de pared',def:'Avisa si hay un obstáculo justo adelante'},
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

function genEval(){sfx('click');_evalFormaSelector(); const _selF = document.getElementById('evalFormaSel'); if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10))); const cf = evalFormNum; const rng = _evalRng(cf); window._currentEvalForm=cf;evalFormNum = (evalFormNum % EVAL_FORMAS) + 1; _evalFormaSelector();saveProgress();document.getElementById('eval-screen-title').textContent=`🎓 Evaluación Final · Forma ${cf} · Programando un Robot`;evalAnsVisible=false;const out=document.getElementById('evalOut');out.innerHTML='';const bar=document.createElement('div');bar.className='eval-score-bar';bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje · 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25 pts</span><span class="eval-score-pill esp-tf">V/F 25 pts</span><span class="eval-score-pill esp-mc">Selección 25 pts</span><span class="eval-score-pill esp-pr">Pareados 25 pts</span></div>`;out.appendChild(bar);const cpItems=_pickF(evalCPBank,5, rng);const s1=document.createElement('div');s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';cpItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='cp';d.dataset.evalIndex=i;const qHtml=item.q.replace('___',`<input class="eval-cp-input" type="text" data-cp="${i}" autocomplete="off">`);d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbCp${i}" aria-live="polite"></div>`;s1.appendChild(d);});out.appendChild(s1);const tfItems=_pickF(evalTFBank,5, rng);const s2=document.createElement('div');s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';tfItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='tf';d.dataset.evalIndex=i;d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="true"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="false"> Falso</label></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbTf${i}" aria-live="polite"></div>`;s2.appendChild(d);});out.appendChild(s2);const mcItems=_pickF(evalMCBank,5, rng);const s3=document.createElement('div');s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';mcItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='mc';d.dataset.evalIndex=i;const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join('');d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbMc${i}" aria-live="polite"></div>`;s3.appendChild(d);});out.appendChild(s3);const prItems=_pickF(evalPRBank,5, rng);let shuffledDefs=_shuffleF(prItems, rng);let _prTries=0;while(shuffledDefs.some((df,ix)=>df.def===prItems[ix].def)&&_prTries<20){shuffledDefs=_shuffleF(shuffledDefs, rng);_prTries++;}const letters=['A','B','C','D','E'];const s4=document.createElement('div');s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';const matchCard=document.createElement('div');matchCard.className='eval-item';let colLeft='<div class="eval-match-col"><h4>📌 Términos</h4>';prItems.forEach((item,i)=>{colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> <select class="eval-match-select" data-pr="${i}" aria-label="Respuesta pareada ${i+16}"><option value="">?</option>${letters.map(l=>`<option value="${l}">${l}</option>`).join('')}</select> ${item.term}</div>`;});colLeft+='</div>';let colRight='<div class="eval-match-col"><h4>🔑 Definiciones</h4>';shuffledDefs.forEach((item,i)=>{colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`;});colRight+='</div>';const ansKey=prItems.map((item,i)=>{const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)];return`${i+16}→${letter}`;}).join(' · ');matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div><div class="eval-item-feedback" id="evalFbPr" aria-live="polite"></div>`;s4.appendChild(matchCard);out.appendChild(s4);window._evalPrintData={tf:tfItems,mc:mcItems,cp:cpItems,pr:{terms:prItems,shuffledDefs,letters}};const autoPanel=document.createElement('div');autoPanel.id='evalAutoResult';autoPanel.className='eval-auto-result';autoPanel.innerHTML='<strong>🧮 Evaluación interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato original sin respuestas digitadas.';out.appendChild(autoPanel);fin('s-evaluacion');}
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
    const zgBlock = `<div class="zg-wrap"><div class="zg-title">🎯 Clave rápida estilo ZipGrade · Forma ${forma}: respuestas correctas ya rellenadas para digitar la clave en la app</div><div class="zg-grid"><div class="zg-col">${zgCol1}</div><div class="zg-col">${zgCol2}</div></div><div class="zg-ver"><span>Test Version / Forma:</span>${zgVer}</div><div class="zg-note">1–5 (Completar): se revisan a mano → ✓ (A) equivale a respuesta correcta · 6–10: V=A, F=B · Réplica visual de referencia; para escanear alumnos usa la hoja oficial de ZipGrade.</div></div>`;

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación Programando un Robot · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.12rem 0.4rem;margin:0.22rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #0e7490;background:#ecfeff;color:#0e7490;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#0e7490;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #0e7490;height:12px;}.obt-pct{white-space:nowrap;}.qn{font-weight:700;min-width:22px;flex-shrink:0;}.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:40px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.18rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.14rem 0.35rem;margin-bottom:0.1rem;break-inside:avoid;page-break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.3;display:flex;gap:0.28rem;margin-bottom:0.07rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.1rem 0.5rem;}.mc-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:0.04rem 0.15rem;margin-left:0.8rem;}.mc-opt{font-size:9pt;display:flex;align-items:center;gap:0.15rem;}.mc-opt input{width:10px;height:10px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{margin-top:0.1rem;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.08rem 0.4rem;margin-top:0.08rem;}.pr-head{font-size:9pt;font-weight:700;color:#555;margin-bottom:0.1rem;}.pr-item{font-size:10.5pt;padding:0.1rem 0.28rem;background:#ecfeff;border-radius:3px;margin-bottom:0.07rem;display:flex;align-items:center;gap:0.2rem;line-height:1.2;break-inside:avoid;page-break-inside:avoid;}.pr-num{font-weight:700;color:#0e7490;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.22rem;padding:0.15rem 0;page-break-before:avoid;break-before:avoid;color:#0e7490;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #0e7490;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#555;}.pa{color:#007a00;font-weight:600;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · Programando un Robot · Educación Básica · Robótica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✅ PAUTA: Evaluación Final · Programando un Robot · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u</div></div><div class="p-grid">${pR}</div>
  ${zgBlock}</div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("evalPage",252,0.55,1.45);fit("pautaPage",252,0.55,1.3);})();<\/script></body></html>`;const win=window.open('','_blank','');if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}win.document.write(typeof METAS_TR==='function'?METAS_TR(doc):doc);win.document.close();setTimeout(()=>win.print(),400);}

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
let critFaltaBank=[
  {txt:'El robot debe ir de A5 a A1 avanzando 4 casillas, pero el programa dice: AVANZA · AVANZA · AVANZA · DETENTE. El robot se queda una casilla antes de la meta.',
   ans:'Falta una instrucción AVANZA (deben ser 4 en total) antes de DETENTE. También puede escribirse con un bucle: REPITE 4 VECES AVANZA y luego DETENTE.'},
  {txt:'El robot seguidor de línea funciona bien, pero al llegar a la meta sigue caminando y se cae de la mesa. Programa: REPITE PARA SIEMPRE: SI hay línea ENTONCES AVANZA, SINO GIRA DERECHA.',
   ans:'Falta la instrucción DETENTE y la condición de salida del bucle («repite HASTA llegar a la meta»). Sin ellas el bucle nunca termina.'},
  {txt:'El robot debe doblar en la esquina del pasillo, pero el programa dice: AVANZA · AVANZA · AVANZA y el robot choca con la pared de enfrente.',
   ans:'Falta un GIRA (derecha o izquierda) antes del último AVANZA; mejor todavía: usar el condicional SI HAY PARED ADELANTE ENTONCES GIRA DERECHA, SINO AVANZA.'},
  {txt:'El robot recoge botellas del patio, pero al final siempre dice que recogió 0 objetos. Programa: REPITE: SI hay objeto ENTONCES RECOGE.',
   ans:'Falta subir el contador: después de RECOGE hay que escribir «objetos = objetos + 1». Sin esa instrucción la variable nunca cambia.'},
  {txt:'El robot regador abre el agua y ya nunca la cierra: el huerto se inunda. Programa: SI la tierra está seca ENTONCES ABRE LA VÁLVULA.',
   ans:'Falta la rama SINO: SI la tierra está seca ENTONCES ABRE LA VÁLVULA, SINO CIERRA LA VÁLVULA. Todo condicional debe decir también qué hacer cuando la respuesta es NO.'},
  {txt:'El robot debe esperar la señal del maestro antes de arrancar, pero sale disparado apenas se enciende. Programa: AVANZA · AVANZA · DETENTE.',
   ans:'Falta la instrucción ESPERA al inicio (o un condicional: SI el sensor de sonido oye la señal ENTONCES AVANZA, SINO ESPERA).'},
];
let critErrorBank=[
  {txt:'«Mi robot no necesita leer los sensores: yo ya sé dónde están las paredes, así que solo escribo AVANZA muchas veces.»',
   g1:'Sin leer los sensores el robot no percibe nada: si algo cambia de lugar (una silla, una mochila) chocará, porque repite AVANZA a ciegas.',
   g2:'El ciclo del robot empieza siempre por LEER SENSORES: sin ese paso no hay decisión posible, porque el condicional necesita el dato del sensor para elegir la rama.'},
  {txt:'«Puse REPITE PARA SIEMPRE: AVANZA. Así el robot llega seguro a la meta.»',
   g1:'Un bucle sin condición de salida nunca termina: el robot pasará de largo la meta y se saldrá del patio.',
   g2:'Hay que escribir «REPITE HASTA llegar a la meta» y cerrar con DETENTE: todo bucle necesita una forma de terminar.'},
  {txt:'«El robot se equivocó, entonces el robot está descompuesto: hay que cambiarlo.»',
   g1:'Casi siempre el que se equivocó fue el PROGRAMA, no la máquina: el robot ejecuta literalmente lo que se le escribió.',
   g2:'Lo correcto es DEPURAR: probar el programa paso a paso, encontrar la instrucción equivocada y corregirla.'},
  {txt:'«Escribí GIRA DERECHA cuatro veces seguidas para que el robot avance más rápido.»',
   g1:'GIRA solo cambia el rumbo: no mueve al robot de casilla, así que después de 4 giros el robot queda exactamente donde empezó.',
   g2:'Para avanzar hay que usar AVANZA (o un bucle REPITE 4 VECES AVANZA): girar y avanzar son instrucciones distintas.'},
  {txt:'«No hace falta escribir el pseudocódigo: mejor pruebo instrucciones al azar hasta que el robot llegue.»',
   g1:'El pseudocódigo se escribe ANTES, para pensar el camino en lenguaje claro; probar al azar hace perder tiempo y no enseña dónde está el error.',
   g2:'Además, sin pseudocódigo no se puede depurar: no hay con qué comparar lo que hizo el robot contra lo que debía hacer.'},
];
let critTraceQuestions=[
  '1. Escribe la casilla donde queda el robot después de cada instrucción (usa las coordenadas A1…E5).',
  '2. ¿En qué casilla termina el robot y hacia dónde queda mirando?',
  '3. ¿En qué instrucción el sensor cambió la decisión del robot? Explica por qué.',
];
let critTraceBank=[
  {txt:'El robot arranca en A5 mirando al Norte. Hay un cajón 📦 en A3 que le bloquea el paso.',
   n:5,start:{r:4,c:0,dir:'N'},obst:[[2,0]],linea:[],deco:{'0,4':'🏫'},
   prog:[C_PARED,C_PARED,C_PARED,I_AV,I_AV]},
  {txt:'El robot arranca en C5 mirando al Norte, sobre el pasillo con la línea negra pintada en el piso.',
   n:5,start:{r:4,c:2,dir:'N'},obst:[],linea:[[3,2],[2,2],[2,3],[2,4]],deco:{'0,0':'🏫'},
   prog:[C_LINEA,C_LINEA,C_LINEA,C_LINEA,C_LINEA]},
  {txt:'El robot arranca en E5 mirando al Oeste. Hay un cajón 📦 en C5 en medio del patio.',
   n:5,start:{r:4,c:4,dir:'O'},obst:[[4,2]],linea:[],deco:{'0,0':'🏫'},
   prog:[I_AV,C_PARED,C_PARED,I_AV,I_AV]},
  {txt:'El robot arranca en B5 mirando al Norte, siguiendo una línea negra que dobla a la izquierda.',
   n:5,start:{r:4,c:1,dir:'N'},obst:[],linea:[[3,1],[2,1],[2,0]],deco:{'0,4':'🏫'},
   prog:[C_LINEAI,C_LINEAI,C_LINEAI,C_LINEAI,C_LINEAI]},
];
let critCompareBank=[
  {a:'PROGRAMA A: AVANZA · AVANZA · AVANZA · AVANZA · DETENTE',
   b:'PROGRAMA B: AVANZA · AVANZA · AVANZA · DETENTE',
   ga:'El programa A es el correcto: recorre las 4 casillas y se detiene justo en la meta.',
   gb:'El programa B «casi» funciona: le falta un AVANZA, así que el robot se detiene una casilla antes de la meta.',
   gr:'Semejanza: usan las mismas instrucciones y terminan con DETENTE. Diferencia: el número de repeticiones. Un bucle REPITE 4 VECES AVANZA evita este error de conteo.'},
  {a:'PROGRAMA A: REPITE HASTA LLEGAR A LA META: SI hay línea adelante ENTONCES AVANZA, SINO GIRA DERECHA. Luego DETENTE.',
   b:'PROGRAMA B: REPITE PARA SIEMPRE: SI hay línea adelante ENTONCES AVANZA, SINO GIRA DERECHA.',
   ga:'El programa A es el correcto: su bucle tiene condición de salida («hasta llegar a la meta») y termina con DETENTE.',
   gb:'El programa B «casi» funciona: sigue la línea igual de bien, pero su bucle nunca termina y el robot pasa de largo la meta.',
   gr:'Semejanza: los dos siguen la línea con el mismo condicional. Diferencia: solo A puede detenerse. Todo bucle necesita una forma de terminar.'},
  {a:'PROGRAMA A: SI HAY PARED ADELANTE ENTONCES GIRA DERECHA, SINO AVANZA.',
   b:'PROGRAMA B: AVANZA (sin leer nunca el sensor de pared).',
   ga:'El programa A es el correcto: lee el sensor antes de moverse y decide; sirve aunque cambien los obstáculos de lugar.',
   gb:'El programa B «casi» funciona: avanza bien mientras el camino esté libre, pero choca en cuanto aparece un obstáculo.',
   gr:'Semejanza: los dos hacen avanzar al robot. Diferencia: solo A cumple el ciclo completo leer sensores → decidir → actuar; B actúa a ciegas.'},
  {a:'PROGRAMA A: objetos = 0 · REPITE: SI hay objeto ENTONCES RECOGE y objetos = objetos + 1.',
   b:'PROGRAMA B: REPITE: SI hay objeto ENTONCES RECOGE.',
   ga:'El programa A es el correcto: usa una variable contadora y la sube cada vez que recoge algo.',
   gb:'El programa B «casi» funciona: recoge la basura igual, pero al final no sabe cuántos objetos recogió.',
   gr:'Semejanza: los dos recogen la basura con el mismo condicional. Diferencia: solo A guarda la información en una variable; sin contador el dato se pierde.'},
];
let critDesignBank=[
  'En tu escuela, el pasillo que va del portón a la dirección tiene una línea negra pintada en el piso y todos los días hay que llevar la lista de asistencia.',
  'El patio de la escuela amanece con botellas y bolsas tiradas, y el aseo se lleva media hora de clase.',
  'La huerta escolar se seca los fines de semana porque nadie llega a regarla.',
  'En la milpa de tu comunidad los pájaros se comen el maíz y alguien tiene que estar espantándolos todo el día.',
  'En la pulpería del barrio hay que revisar de noche si la puerta quedó abierta.',
];
let critDesignGuide='Rúbrica de 4 criterios (total 20 pts): ① PSEUDOCÓDIGO (6 pts): escribe el programa en lenguaje claro, con las instrucciones en orden y numeradas. ② CONDICIONAL CON SENSOR (5 pts): incluye al menos un «SI el sensor … ENTONCES … SINO …» con un sensor adecuado al problema. ③ BUCLE (5 pts): usa «repite N veces» o «repite hasta …» y explica cómo termina el bucle. ④ VARIABLE Y CIERRE (4 pts): usa una variable contadora y termina el programa con DETENTE. Cualquier diseño vale si otra persona puede ejecutarlo paso a paso sin dudar.';
function genEvalCrit(){
  sfx('click');
  _injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });
  const _sC = document.getElementById('evalCritFormaSel');
  if (_sC && parseInt(_sC.value, 10)) evalCritFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sC.value, 10)));
  const cf=evalCritFormNum;window._currentEvalCritForm=cf;const rngC = _evalRng(200000 + cf);evalCritFormNum=(evalCritFormNum%EVAL_FORMAS)+1;_injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });saveProgress();
  document.getElementById('evalcrit-screen-title').textContent=`🧠 Pensamiento Crítico · Forma ${cf} · Programando un Robot`;
  evalCritAnsVisible=false;
  const out=document.getElementById('evalCritOut');out.innerHTML='';
  const sens=_pickF(critFaltaBank,2,rngC);
  const s1=document.createElement('div');
  s1.innerHTML=`<div class="eval-section-title">I. ¿Qué instrucción falta? <span class="eval-pts">20 pts</span></div><div class="eval-item">${sens.map((k,i)=>`<div class="crit-scenario">Caso ${i+1}: ${k.txt}</div><div class="crit-q-block"><div class="crit-q-label">¿Qué instrucción falta en este programa? Escríbela y explica por qué el robot falla sin ella.</div><textarea class="crit-textarea" rows="2" aria-label="Instrucción que falta en el caso ${i+1} y su justificación"></textarea><div class="crit-pauta">${k.ans}</div></div>`).join('')}<div class="crit-selfscore"><label for="critScore0">Obtenido:</label><input type="number" id="critScore0" class="crit-score-input" data-score="0" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s1);
  const err=_pickF(critErrorBank,1,rngC)[0];
  const s2=document.createElement('div');
  s2.innerHTML=`<div class="eval-section-title">II. Corrige el programa <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${err.txt}</div><p style="font-size:0.85rem;margin-bottom:0.5rem;">Esta idea sobre programación tiene <strong>dos errores</strong>. Corrígelos con argumentos, usando lo que sabes de instrucciones, condicionales y bucles:</p><div class="crit-q-block"><div class="crit-q-label">Error 1 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 1 y su corrección"></textarea><div class="crit-pauta">${err.g1}</div></div><div class="crit-q-block"><div class="crit-q-label">Error 2 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 2 y su corrección"></textarea><div class="crit-pauta">${err.g2}</div></div><div class="crit-selfscore"><label for="critScore1">Obtenido:</label><input type="number" id="critScore1" class="crit-score-input" data-score="1" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s2);
  const cic=_pickF(critTraceBank,1,rngC)[0];
  const cicMap={n:cic.n,obst:(cic.obst||[]).map(o=>o[0]+','+o[1]),linea:(cic.linea||[]).map(o=>o[0]+','+o[1])};
  let _cst={r:cic.start.r,c:cic.start.c,dir:cic.start.dir,tick:0};const cicPasos=[];let cicGiro='';
  cic.prog.forEach((p,i)=>{const nx=simStep(_cst,p,cicMap);cicPasos.push(`${i+1}) ${progLine(p)} → ${coordName(nx.r,nx.c)} mirando al ${DIR_NOMBRE[nx.dir]}`);if(p&&typeof p==='object'&&!cicGiro&&nx.ejec!==I_AV)cicGiro=`En la instrucción ${i+1} el sensor respondió «${nx.condVal?'SÍ':'NO'}», por eso el robot ejecutó ${nx.ejec} en vez de avanzar.`;_cst=nx;});
  const cicFin=coordName(_cst.r,_cst.c),cicDir=DIR_NOMBRE[_cst.dir];
  const cicGuides=[cicPasos.join(' · '),`El robot termina en ${cicFin} mirando al ${cicDir}.`,cicGiro||'En este programa el sensor respondió siempre igual y el robot avanzó cada vez.'];
  const cicSvg=svgGridHTML({n:cic.n,robot:cic.start,obst:cic.obst,obstEmoji:'📦',linea:cic.linea,deco:cic.deco,dots:false,w:230});
  const cicProgTxt=cic.prog.map((p,i)=>(i+1)+') '+progLine(p)).join(' · ');
  const s3=document.createElement('div');
  s3.innerHTML=`<div class="eval-section-title">III. Traza el recorrido y predice dónde termina <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${cic.txt}</div><div style="text-align:center;margin:0.4rem 0;">${cicSvg}</div><div class="crit-scenario"><strong>Programa:</strong> ${cicProgTxt}</div>${critTraceQuestions.map((q,i)=>`<div class="crit-q-block"><div class="crit-q-label">${q}</div><textarea class="crit-textarea" rows="2" aria-label="${q}"></textarea><div class="crit-pauta">${cicGuides[i]}</div></div>`).join('')}<div class="crit-selfscore"><label for="critScore2">Obtenido:</label><input type="number" id="critScore2" class="crit-score-input" data-score="2" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s3);
  const cmp=_pickF(critCompareBank,1,rngC)[0];
  const s4=document.createElement('div');
  s4.innerHTML=`<div class="eval-section-title">IV. Comparación razonada <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-compare-grid"><div class="crit-compare-box"><h5>Programa A</h5>${cmp.a}</div><div class="crit-compare-box"><h5>Programa B</h5>${cmp.b}</div></div><div class="crit-q-block"><div class="crit-q-label">1. ¿Cuál programa es el correcto y cuál «casi» funciona? 2. ¿En qué se parecen? 3. ¿Qué error exacto tiene el que «casi» funciona y cómo lo corriges?</div><textarea class="crit-textarea" rows="4" aria-label="Comparación razonada de los programas A y B"></textarea><div class="crit-pauta">${cmp.ga} · ${cmp.gb} · ${cmp.gr}</div></div><div class="crit-selfscore"><label for="critScore3">Obtenido:</label><input type="number" id="critScore3" class="crit-score-input" data-score="3" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s4);
  const dis=_pickF(critDesignBank,1,rngC)[0];
  const s5=document.createElement('div');
  s5.innerHTML=`<div class="eval-section-title">V. Diseña el programa de tu robot <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${dis}</div><div class="crit-q-block"><div class="crit-q-label">Escribe en PSEUDOCÓDIGO el programa de un robot que resuelva este problema: numera las instrucciones, incluye un CONDICIONAL con sensor («SI el sensor … ENTONCES … SINO …»), un BUCLE («repite … hasta …»), una VARIABLE contadora y cierra con DETENTE. Puedes dibujar la ruta en tu cuaderno.</div><textarea class="crit-textarea" rows="5" aria-label="Pseudocódigo del programa del robot"></textarea><div class="crit-pauta">${critDesignGuide}</div></div><div class="crit-selfscore"><label for="critScore4">Obtenido:</label><input type="number" id="critScore4" class="crit-score-input" data-score="4" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s5);
  window._evalCritData={sens,err,cic,cmp,dis,cicFin,cicDir,cicGuides,cicSvg,cicProgTxt};
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
  let s1=`<div class="sec-title"><span>I. ¿Qué instrucción falta?</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div>`;
  d.sens.forEach((k,i)=>{s1+=`<p class="crit-print-scenario">Caso ${i+1}: ${k.txt}</p><p class="crit-print-q">¿Qué instrucción falta en este programa? Escríbela y explica por qué el robot falla sin ella.</p>${lines(1)}`;});
  let s2=`<div class="sec-title"><span>II. Corrige el programa</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.err.txt}</p><p class="crit-print-q">Esta idea sobre programación tiene dos errores. Corrígelos con argumentos:</p><p class="crit-print-q"><strong>Error 1:</strong></p>${lines(1)}<p class="crit-print-q"><strong>Error 2:</strong></p>${lines(1)}`;
  let s3=`<div class="sec-title"><span>III. Traza el recorrido y predice dónde termina</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.cic.txt}</p><div style="text-align:center;margin:0.1rem 0;">${d.cicSvg}</div><p class="crit-print-q"><strong>Programa:</strong> ${d.cicProgTxt}</p>`;
  critTraceQuestions.forEach(q=>{s3+=`<p class="crit-print-q">${q}</p>${lines(1)}`;});
  let s4=`<div class="sec-title"><span>IV. Comparación razonada</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><div class="crit-compare-print-grid"><div class="crit-compare-print-box">${d.cmp.a}</div><div class="crit-compare-print-box">${d.cmp.b}</div></div><p class="crit-print-q">1. ¿Cuál programa es el correcto y cuál «casi» funciona? 2. ¿En qué se parecen? 3. ¿Qué error exacto tiene el que «casi» funciona y cómo lo corriges?</p>${lines(2)}`;
  let s5=`<div class="sec-title"><span>V. Diseña el programa de tu robot</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.dis}</p><p class="crit-print-q">Escribe en PSEUDOCÓDIGO el programa de un robot que resuelva este problema: numera las instrucciones e incluye un CONDICIONAL con sensor, un BUCLE, una VARIABLE contadora y el DETENTE final. Dibuja la ruta al reverso de la hoja.</p>${lines(4)}`;
  let pR='';
  pR+=`<div class="p-sec"><div class="p-ttl">I. ¿Qué instrucción falta?</div>${d.sens.map((k,i)=>`<div class="p-crit-line"><strong>Caso ${i+1}:</strong> ${k.ans}</div>`).join('')}</div>`;
  pR+=`<div class="p-sec"><div class="p-ttl">II. Corrige el programa</div><div class="p-crit-line"><strong>Error 1:</strong> ${d.err.g1}</div><div class="p-crit-line"><strong>Error 2:</strong> ${d.err.g2}</div></div>`;
  pR+=`<div class="p-sec"><div class="p-ttl">III. Traza el recorrido</div><div class="p-crit-line"><strong>Recorrido:</strong> ${d.cicGuides[0]}</div><div class="p-crit-line"><strong>Termina en:</strong> ${d.cicGuides[1]}</div><div class="p-crit-line"><strong>El sensor decidió:</strong> ${d.cicGuides[2]}</div></div>`;
  pR+=`<div class="p-sec"><div class="p-ttl">IV. Comparación</div><div class="p-crit-line"><strong>Programa A:</strong> ${d.cmp.ga}</div><div class="p-crit-line"><strong>Programa B:</strong> ${d.cmp.gb}</div><div class="p-crit-line">${d.cmp.gr}</div></div>`;
  pR+=`<div class="p-sec" style="grid-column:1/-1;"><div class="p-ttl">V. Diseña el programa · Rúbrica</div><div class="p-crit-line">${critDesignGuide}</div></div>`;
  const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Pensamiento Crítico Programando un Robot · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.1rem 0.4rem;margin:0.2rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #0e7490;background:#ecfeff;color:#0e7490;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#0e7490;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #0e7490;height:12px;}.obt-pct{white-space:nowrap;}.crit-print-scenario{font-size:10.5pt;background:#ecfeff;border-left:3px solid #0e7490;padding:0.2rem 0.5rem;margin:0.1rem 0 0.2rem;line-height:1.3;}.crit-print-q{font-size:10pt;font-weight:600;margin:0.15rem 0 0.08rem;line-height:1.25;}.ln{border-bottom:1px solid #111;min-height:12px;margin-bottom:2px;}.crit-compare-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin:0.15rem 0;}.crit-compare-print-box{font-size:9.5pt;background:#ecfeff;border-radius:4px;padding:0.25rem 0.4rem;line-height:1.25;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.08rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.9rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.45rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.1rem;margin-bottom:0.18rem;}.p-crit-line{font-size:11pt;color:#007a00;margin-bottom:0.18rem;line-height:1.35;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.2rem;padding:0.1rem 0;color:#0e7490;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #0e7490;}.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:12.7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="critEvalPage"><div class="ph"><h2>Evaluación Competencial · Pensamiento Crítico · Programando un Robot · Educación Básica · Robótica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 5 secciones de 20 puntos</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100</span></div></div><div class="pauta-wrap" id="critPautaPage"><div class="p-head"><div class="p-main">✅ PAUTA: Pensamiento Crítico · Programando un Robot · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 5 secciones × 20 pts c/u · respuesta abierta, usar como guía de corrección</div></div><div class="p-grid">${pR}</div></div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("critEvalPage",250,0.55,1.2);fit("critPautaPage",250,0.55,1.2);})();<\/script></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(typeof METAS_TR==='function'?METAS_TR(doc):doc);win.document.close();setTimeout(()=>win.print(),400);
}

// ===================== LAB: SIMULADOR DEL ROBOT PROGRAMADO =====================
// 6 niveles en el patio de la escuela (cuadrícula 5×5). 📦 = obstáculo (no se pisa),
// las casillas oscuras son la LÍNEA negra del piso, 🎯🗑️🌱 = meta.
// Todos los niveles están verificados como resolubles por solveSim (BFS). Coordenadas A–E / 1–5.
let parteData={
  n1:{nombre:'Nivel 1 · Instrucciones de movimiento',icon:'1️⃣',n:5,start:{r:4,c:2,dir:'N'},dest:[0,2],destEmoji:'🎯',
      obst:[],linea:[],deco:{'0,0':'🏫','4,4':'🏀'},
      meta:'El programa más sencillo: el robot está en C5 mirando al Norte y la meta 🎯 está en C1, en línea recta. Usa AVANZA las veces necesarias y cierra con DETENTE.',
      sol:[I_AV,I_AV,I_AV,I_AV,I_FIN],xpn:5},
  n2:{nombre:'Nivel 2 · Avanzar y girar',icon:'2️⃣',n:5,start:{r:4,c:0,dir:'N'},dest:[2,2],destEmoji:'🎯',
      obst:[],linea:[],deco:{'0,0':'🏫','0,4':'🏪'},
      meta:'Ahora hay que doblar: el robot arranca en A5 mirando al Norte y la meta 🎯 está en C3. Combina AVANZA con GIRA DERECHA. Recuerda: girar NO mueve al robot de casilla.',
      sol:[I_AV,I_AV,I_GD,I_AV,I_AV,I_FIN],xpn:5},
  n3:{nombre:'Nivel 3 · Sensor de pared',icon:'3️⃣',n:5,start:{r:4,c:2,dir:'N'},dest:[0,2],destEmoji:'🎯',
      obst:[[2,2]],linea:[],deco:{'0,0':'🏫','4,4':'🏀'},
      meta:'Un cajón 📦 bloquea C3. Usa el bloque «SI HAY PARED ADELANTE → GIRA DERECHA, SINO → AVANZA» para que el robot DECIDA solo, y rodéalo hasta la meta 🎯 de C1.',
      sol:[C_PARED,C_PARED,I_AV,I_GI,I_AV,I_AV,I_GI,I_AV,I_GD,I_AV,I_FIN],xpn:5},
  n4:{nombre:'Nivel 4 · Sensor de línea (el pasillo)',icon:'4️⃣',n:5,start:{r:4,c:0,dir:'N'},dest:[1,2],destEmoji:'🗑️',
      obst:[],linea:[[3,0],[2,0],[1,0],[1,1],[1,2]],deco:{'4,4':'🏫','0,4':'🌳'},
      meta:'El pasillo de la escuela tiene una línea negra pintada. Repite una y otra vez el bloque «SI HAY LÍNEA ADELANTE → AVANZA, SINO → GIRA DERECHA» (¡eso es un BUCLE!) hasta el basurero 🗑️ de C2.',
      sol:[C_LINEA,C_LINEA,C_LINEA,C_LINEA,C_LINEA,C_LINEA,I_FIN],xpn:5},
  n5:{nombre:'Nivel 5 · La línea dobla a la izquierda',icon:'5️⃣',n:5,start:{r:4,c:2,dir:'N'},dest:[0,0],destEmoji:'🌱',
      obst:[],linea:[[3,2],[2,2],[2,1],[2,0],[1,0],[0,0]],deco:{'4,4':'🏫','0,4':'🏀'},
      meta:'Esta línea dobla primero a la izquierda y luego a la derecha. Combina los dos bloques del sensor de línea (el que gira a la derecha y el que gira a la izquierda) hasta el huerto escolar 🌱 de A1.',
      sol:[C_LINEAI,C_LINEAI,C_LINEAI,C_LINEAI,C_LINEAI,C_LINEA,C_LINEA,C_LINEA,I_FIN],xpn:5},
  n6:{nombre:'Nivel 6 · Desafío del patio',icon:'6️⃣',n:5,start:{r:4,c:0,dir:'N'},dest:[0,4],destEmoji:'🎯',
      obst:[[1,0],[3,1],[1,3],[3,3]],linea:[[2,1],[2,2],[1,2],[0,2]],deco:{'4,4':'🏫'},
      meta:'El desafío final: cajones 📦 y línea negra en el mismo mapa. Usa el sensor de pared para esquivar, el sensor de línea para seguir el camino y llega a la meta 🎯 de E1.',
      sol:[C_PARED,C_PARED,C_PARED,C_LINEA,C_LINEA,C_LINEAI,C_LINEAI,C_LINEAI,C_LINEA,I_AV,I_AV,I_FIN],xpn:5}
};
let labNivel='n1',labProg=[],labRunning=false,labRobot={r:4,c:2,dir:'N',tick:0};
function _labMapa(){const nv=parteData[labNivel];return{n:nv.n,obst:(nv.obst||[]).map(o=>o[0]+','+o[1]),linea:(nv.linea||[]).map(o=>o[0]+','+o[1])};}
function labShowParte(nivelKey){if(labRunning)return;labNivel=nivelKey;const nv=parteData[nivelKey];labProg=[];labRobot={r:nv.start.r,c:nv.start.c,dir:nv.start.dir,tick:0};document.querySelectorAll('.lab-cont-btn').forEach(b=>b.classList.remove('active-pri'));const btn=document.querySelector(`[data-parte="${nivelKey}"]`);if(btn)btn.classList.add('active-pri');const fbEl=document.getElementById('fbLab');if(fbEl)fbEl.classList.remove('show');updateLabDisplay();if(typeof sfx==='function')sfx('click');}
function updateLabDisplay(){
  const nv=parteData[labNivel];
  const map=_labMapa();
  const sent=document.getElementById('lab-sentence');
  if(sent)sent.innerHTML=`🕹️ <strong>${nv.nombre}</strong> · ${nv.meta}`;
  const disp=document.getElementById('lab-display');
  if(!disp)return;
  const sPared=_paredAdelante(labRobot,map)?'🧱 <strong>pared adelante</strong>':'✅ camino libre';
  const sLinea=(nv.linea&&nv.linea.length)?(_lineaAdelante(labRobot,map)?' · ⬛ <strong>ve la línea</strong>':' · ⬜ no ve línea'):'';
  disp.innerHTML=`<div id="simSvgWrap">${svgGridHTML({n:nv.n,robot:labRobot,dest:nv.dest,destEmoji:nv.destEmoji,obst:nv.obst,obstEmoji:'📦',linea:nv.linea,deco:nv.deco,dots:false,w:300})}</div><div style="font-size:0.8rem;color:var(--gray);margin-top:0.3rem;">Robot en <strong>${coordName(labRobot.r,labRobot.c)}</strong> mirando al <strong>${DIR_NOMBRE[labRobot.dir]}</strong> ${DIR_FLECHA[labRobot.dir]}</div><div style="font-size:0.8rem;color:var(--gray);margin-top:0.15rem;">📡 Sensores ahora mismo: ${sPared}${sLinea}</div>`;
  renderLabProg();
}
function renderLabProg(runIdx,crashIdx){
  const list=document.getElementById('progList');
  if(!list)return;
  if(labProg.length===0){list.innerHTML='<span class="sim-empty-hint">Toca los botones de arriba para armar tu programa 👆</span>';return;}
  list.innerHTML=labProg.map((p,i)=>`<span class="sim-chip${i===runIdx?' sim-chip-run':''}${i===crashIdx?' sim-chip-crash':''}"><span class="sim-chip-n">${i+1}</span>${progLine(p)}</span>`).join('');
}
function labAdd(instr){if(labRunning)return;if(labProg.length>=30){showToast('⚠️ Máximo 30 instrucciones');return;}const real=instr==='C_PARED'?C_PARED:(instr==='C_LINEA'?C_LINEA:(instr==='C_LINEAI'?C_LINEAI:instr));labProg.push(real);renderLabProg();sfx('click');}
function labDel(){if(labRunning)return;labProg.pop();renderLabProg();sfx('click');}
function labClear(){if(labRunning)return;labProg=[];const nv=parteData[labNivel];labRobot={r:nv.start.r,c:nv.start.c,dir:nv.start.dir,tick:0};updateLabDisplay();sfx('click');}
function labPista(){
  if(labRunning)return;
  const nv=parteData[labNivel];
  showToast('💡 Pista: la solución más corta usa '+(solveSim(nv.start,nv.dest,_labMapa(),26)||{len:'?'}).len+' instrucciones (contando DETENTE).');
  sfx('click');
}
function labRun(){
  if(labRunning)return;
  if(labProg.length===0){fb('fbLab','Primero arma tu programa con los botones (AVANZA, GIRA, ESPERA, los bloques de sensor y DETENTE).',false);return;}
  labRunning=true;sfx('click');
  const nv=parteData[labNivel];const map=_labMapa();
  labRobot={r:nv.start.r,c:nv.start.c,dir:nv.start.dir,tick:0};
  updateLabDisplay();
  const fbEl=document.getElementById('fbLab');if(fbEl)fbEl.classList.remove('show');
  let i=0;
  const paso=()=>{
    if(i>=labProg.length){
      labRunning=false;renderLabProg();
      fb('fbLab','El programa terminó y el robot no se detuvo en la meta. Agrega la instrucción DETENTE cuando el robot esté justo sobre la meta.',false);sfx('no');
      return;
    }
    const instr=labProg[i];
    renderLabProg(i);
    const nx=simStep(labRobot,instr,map);
    if(instr&&typeof instr==='object'){
      const rama=nx.condVal?'ENTONCES':'SINO';
      fb('fbLab',`${nx.condVal?'✔ SÍ':'✘ NO'} · ${COND_LABEL[instr.cond]} → corre la rama ${rama} (${nx.ejec}).`,true);
    }
    if(nx.evento==='borde'||nx.evento==='obstaculo'){
      labRunning=false;renderLabProg(undefined,i);
      const disp=document.getElementById('lab-display');if(disp&&disp.parentElement){disp.parentElement.classList.add('sim-crash');setTimeout(()=>disp.parentElement.classList.remove('sim-crash'),700);}
      const causa=nx.evento==='borde'?'Se salió del patio.':'Hay un cajón 📦 en esa casilla.';
      fb('fbLab',`💥 ¡El robot chocó en la instrucción ${i+1} (${progLine(instr)})! ${causa} Depura tu programa: revísalo paso a paso y vuelve a ejecutarlo.`,false);
      sfx('no');
      setTimeout(()=>{labRobot={r:nv.start.r,c:nv.start.c,dir:nv.start.dir,tick:0};updateLabDisplay();renderLabProg(undefined,i);},1100);
      return;
    }
    if(nx.evento==='fin'){
      if(labRobot.r===nv.dest[0]&&labRobot.c===nv.dest[1]){
        labRunning=false;renderLabProg();
        fb('fbLab',`🎯 ¡Meta alcanzada en ${coordName(nv.dest[0],nv.dest[1])} con ${labProg.length} instrucciones! ¡Excelente, programador!`,true);
        sfx('fan');launchConfetti();
        if(!xpTracker.lab.has(labNivel)){xpTracker.lab.add(labNivel);pts(nv.xpn);const btn=document.querySelector(`[data-parte="${labNivel}"]`);if(btn)btn.classList.add('lab-done');}
        if(xpTracker.lab.size===Object.keys(parteData).length){fin('s-lab');unlockAchievement('lab_master');}
        return;
      }
      labRunning=false;renderLabProg(undefined,i);
      fb('fbLab',`🛑 El robot se detuvo en ${coordName(labRobot.r,labRobot.c)}… pero la meta está en ${coordName(nv.dest[0],nv.dest[1])}. Traza otra vez el recorrido en tu cuaderno.`,false);
      sfx('no');
      return;
    }
    labRobot=nx;
    updateLabDisplay();
    renderLabProg(i);
    i++;
    setTimeout(paso,550);
  };
  paso();
}

// ===================== DIPLOMA =====================
function _diplPct(){return xp>=MXP?100:Math.round((xp/MXP)*100);}
function openDiploma(){sfx('fan');const pct=_diplPct();document.getElementById('diplPct').textContent=pct+'%';document.getElementById('diplBar').style.width=pct+'%';document.getElementById('diplDate').textContent='Fecha: '+new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});const msgs=['¡Sigue aprendiendo!','¡Muy buen trabajo!','¡Vas muy bien!','¡Ya programas robots con sensores!','¡Maestro Programador de Robots!'];document.getElementById('diplMsg').textContent=msgs[Math.min(Math.floor(pct/25),4)];const stars=['⭐','⭐⭐','⭐⭐⭐'];document.getElementById('diplStars').textContent=stars[Math.min(Math.floor(pct/40),2)];const achTxt=unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(' · ');document.getElementById('diplAch').textContent=achTxt||'Sigue completando secciones para desbloquear logros';document.getElementById('diplomaOverlay').classList.add('open');launchConfetti();}
function closeDiploma(){document.getElementById('diplomaOverlay').classList.remove('open');}
function updateDiplomaName(v){document.getElementById('diplName').textContent=v||'Estudiante';}
function shareWA(){const name=document.getElementById('diplName').textContent||'Estudiante';const pct=_diplPct();const msg=`🕹️ ¡${name} completó la Misión "Programando un Robot"! 🏅 Progreso: ${pct}% · 🤖 policastsapien.com`;_waShare(msg);}
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

(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalCrit==='function') _injectFormaSel('genEvalCrit','evalCritFormaSel',evalCritFormNum,function(v){evalCritFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();

// ===================== IDIOMA (español ↔ inglés) =====================
// El contenido en inglés vive en programando-robot-en.js y el botón lo maneja
// ../../js/metas-i18n.js. Aquí solo se intercambian los bancos y se repinta:
// el progreso (XP, logros, secciones hechas) no se toca al cambiar de idioma.
//
// OJO con el lenguaje del simulador: I_AV, I_GD, C_PARED… siguen siendo las
// palabras EN ESPAÑOL también en inglés. Son el identificador interno con el
// que el simulador compara (real===I_GD), con el que el HTML llama a
// labAdd('AVANZA') y con el que los bancos guardan los programas. Lo que se
// traduce es lo que se PINTA: el motor cambia AVANZA→FORWARD y
// «SI HAY PARED ADELANTE → …» en cuanto aparecen en pantalla.
const _BANCOS_ES = {
  ACHIEVEMENTS, lvls, fcData, memoPairs, qzData, classGroups, idData, cmpData,
  routeSets, neuronPartes, neuroPairs, enfermedadData, retoPairs,
  identifyTaskDB, classifyTaskDB, completeTaskDB, explainQuestions, sopaSets,
  evalTFBank, evalMCBank, evalCPBank, evalPRBank,
  critFaltaBank, critErrorBank, critTraceQuestions, critTraceBank,
  critCompareBank, critDesignBank, critDesignGuide, parteData
};
window.MISION_APLICAR_IDIOMA = function (lang) {
  const src = (lang === 'en' && window.MISION_EN && window.MISION_EN.data)
    ? window.MISION_EN.data : _BANCOS_ES;
  const usa = (k) => (src[k] !== undefined ? src[k] : _BANCOS_ES[k]);

  ACHIEVEMENTS = usa('ACHIEVEMENTS'); lvls = usa('lvls');
  fcData = usa('fcData'); memoPairs = usa('memoPairs'); qzData = usa('qzData');
  classGroups = usa('classGroups'); idData = usa('idData'); cmpData = usa('cmpData');
  routeSets = usa('routeSets'); neuronPartes = usa('neuronPartes');
  neuroPairs = usa('neuroPairs'); enfermedadData = usa('enfermedadData');
  retoPairs = usa('retoPairs'); identifyTaskDB = usa('identifyTaskDB');
  classifyTaskDB = usa('classifyTaskDB'); completeTaskDB = usa('completeTaskDB');
  explainQuestions = usa('explainQuestions'); sopaSets = usa('sopaSets');
  evalTFBank = usa('evalTFBank'); evalMCBank = usa('evalMCBank');
  evalCPBank = usa('evalCPBank'); evalPRBank = usa('evalPRBank');
  critFaltaBank = usa('critFaltaBank'); critErrorBank = usa('critErrorBank');
  critTraceQuestions = usa('critTraceQuestions'); critTraceBank = usa('critTraceBank');
  critCompareBank = usa('critCompareBank'); critDesignBank = usa('critDesignBank');
  critDesignGuide = usa('critDesignGuide'); parteData = usa('parteData');

  // Repintar cada juego desde el principio con el banco nuevo
  fcIdx = 0; upFC();
  buildMemo();
  qzIdx = 0; qzSel = -1; qzDone = false; showQz();
  currentClassGroupIdx = 0; buildClass();
  idIdx = 0; showId();
  cmpIdx = 0; cmpSel = -1; showCmp();
  currentRouteIdx = 0; buildRoute();
  neuronIdx = 0; showNeuron();
  neuroIdx = 0; showNeuro();
  enferIdx = 0; showEnfer();
  currentRetoPairIdx = 0; updateRetoButtons(); resetReto();
  currentSopaSetIdx = 0; sopaFoundWords = new Set(); buildSopa();
  labProg = []; labShowParte(labNivel);   // el nivel en pantalla se redibuja vacío
  renderAchPanel(); updateXPBar();

  // Las pruebas ya generadas se rehacen en el idioma nuevo, con su misma forma
  const out = document.getElementById('evalOut');
  if (out && out.innerHTML.trim()) { evalFormNum = window._currentEvalForm || evalFormNum; genEval(); }
  const outCrit = document.getElementById('evalCritOut');
  if (outCrit && outCrit.innerHTML.trim()) { evalCritFormNum = window._currentEvalCritForm || evalCritFormNum; genEvalCrit(); }
  const tg = document.getElementById('tgOut');
  if (tg) tg.innerHTML = '';
};
