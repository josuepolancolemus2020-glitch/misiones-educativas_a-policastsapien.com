// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
function compartirMision(){const url=window.location.href;const texto=`🚀 *Misión Asignada* 🚀\n\nArma tu *PRIMER PROGRAMA COMPLETO*: evento, pseudocódigo, bucle, condicional y variable, ¡todo junto! 🤖\n\nEs la *misión final* de la 💻 Ruta del Código. Desbloquea *todos los logros* y puedes poner *tus datos* para que tu maestro observe todos tus logros. 📋\n\n_Se te hará prueba escrita y serás excelente estudiante en Programación._ 💻\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;_waShare(texto);}
function toggleLetra(){document.body.classList.toggle('letra-grande');if(typeof sfx==='function')sfx('click');localStorage.setItem('preferenciaLetra',document.body.classList.contains('letra-grande'));}
window.addEventListener('DOMContentLoaded',()=>{if(localStorage.getItem('preferenciaLetra')==='true')document.body.classList.add('letra-grande');});

// ===================== UTILIDADES =====================
const _pick=(arr,n)=>[...arr].sort(()=>Math.random()-0.5).slice(0,n);
const _shuffle=(arr)=>[...arr].sort(()=>Math.random()-0.5);
function fb(id,msg,isOk){const el=document.getElementById(id);if(el){el.textContent=msg;el.className='fb show '+(isOk?'ok':'err');}}

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY='mi_primer_programa_v1';
let xp=0,MXP=200,done=new Set(),evalAnsVisible=false;
let evalFormNum=1,unlockedAch=[],darkMode=false,prevLevel=0;
let evalOpFormNum=1,evalOpAnsVisible=false;
const TOTAL_SECTIONS=13;
const xpTracker={fc:new Set(),qz:new Set(),cls:new Set(),id:new Set(),cmp:new Set(),reto:new Set(),sopa:new Set(),wgt:new Set(),memo:new Set(),lab:new Set()};

// ═════════ NÚCLEO DEL PROYECTO INTEGRADOR ═════════
// Un PROGRAMA COMPLETO junta: evento (arranque) · secuencia · bucle 🔁 · condicional 🔀 · variable 🔢.
// El robot recorre el patio (cuadrícula), esquiva paredes 🌳, RECOGE objetos 🍎 y su
// contador CUENTA suma 1 por cada objeto recogido. TERMINA cierra el programa.
const DIRS=['N','E','S','O'];
const DIR_DELTA={N:[-1,0],E:[0,1],S:[1,0],O:[0,-1]};
const DIR_NOMBRE={N:'Norte',E:'Este',S:'Sur',O:'Oeste'};
const DIR_FLECHA={N:'▲',E:'▶',S:'▼',O:'◀'};
const I_AV='AVANZA',I_GD='GIRA DERECHA',I_GI='GIRA IZQUIERDA',I_RC='RECOGE',I_TM='TERMINA';
const EVENTO_TXT='CUANDO EMPIECE EL PROGRAMA';
// Bloques condicionales (SI…ENTONCES…SINO): objetos {cond,then,els,txt}
const C_PARED={cond:'PARED',then:I_GD,els:I_AV,txt:'SI HAY PARED ADELANTE → GIRA DERECHA, SINO → AVANZA'};
const C_OBJ={cond:'OBJETO',then:I_RC,els:I_AV,txt:'SI HAY OBJETO AQUÍ → RECOGE, SINO → AVANZA'};
const COND_LABEL={PARED:'¿hay pared adelante?',OBJETO:'¿hay un objeto 🍎 en esta casilla?'};
function turnR(d){return DIRS[(DIRS.indexOf(d)+1)%4];}
function turnL(d){return DIRS[(DIRS.indexOf(d)+3)%4];}
function coordName(r,c){return 'ABCDE'[c]+(r+1);}
function progLine(instr){return (instr&&typeof instr==='object'&&instr.txt)?instr.txt:instr;}
function esBucle(tk){return !!(tk&&typeof tk==='object'&&tk.rep);}
function esCond(tk){return !!(tk&&typeof tk==='object'&&tk.cond);}
// Un programa es una lista de: instrucciones (cadenas), condicionales {cond,…} y bucles {rep,body}
function progLineas(prog){return prog.map(tk=>esBucle(tk)?`REPETIR ${tk.rep} VECES [ ${tk.body.map(progLine).join(' · ')} ]`:progLine(tk));}
function progTexto(prog){return progLineas(prog).join(' · ');}
// Expande los bucles a la lista plana que realmente ejecuta el robot
function expandProg(prog){const flat=[];prog.forEach(tk=>{if(esBucle(tk)){for(let v=1;v<=tk.rep;v++)tk.body.forEach(b=>flat.push({i:b,v,de:tk.rep}));}else flat.push({i:tk,v:0,de:0});});return flat;}
function countEscritas(prog){return prog.reduce((a,tk)=>a+(esBucle(tk)?1+tk.body.length:1),0);}
function countEjecutadas(prog){return expandProg(prog).length;}
function usaBucle(prog){return prog.some(esBucle);}
function usaCondicional(prog){return prog.some(tk=>esCond(tk)||(esBucle(tk)&&tk.body.some(esCond)));}
function usaVariable(prog){const hay=tk=>tk===I_RC||(esCond(tk)&&(tk.then===I_RC||tk.els===I_RC));return prog.some(tk=>esBucle(tk)?tk.body.some(hay):hay(tk));}
// ── Sensores del robot ──
function _paredAdelante(st,map){
  const d=DIR_DELTA[st.dir];const nr=st.r+d[0],nc=st.c+d[1];
  if(nr<0||nr>=map.n||nc<0||nc>=map.n)return true;
  if(map.obst&&map.obst.indexOf(nr+','+nc)>=0)return true;
  return false;
}
// Índice del objeto que hay bajo el robot (o -1). Los recogidos se marcan en el bitmask st.mask
function _objIdx(st,map){if(!map.objs||!map.objs.length)return -1;const i=map.objs.indexOf(st.r+','+st.c);if(i<0)return -1;return (((st.mask||0)>>i)&1)?-1:i;}
function _hayObjeto(st,map){return _objIdx(st,map)>=0;}
function _condVal(cond,st,map){return cond==='PARED'?_paredAdelante(st,map):_hayObjeto(st,map);}
// Ejecuta UNA instrucción (simple o condicional). map={n,obst:['r,c'],objs:['r,c']}
function simStep(st,instr,map){
  const s={r:st.r,c:st.c,dir:st.dir,cuenta:st.cuenta||0,mask:st.mask||0,evento:null,cond:null,condVal:null,ejec:null,recogio:false};
  let real=instr;
  if(esCond(instr)){
    const v=_condVal(instr.cond,s,map);
    s.cond=instr.cond;s.condVal=v;real=v?instr.then:instr.els;
  }
  s.ejec=real;
  if(real===I_GD){s.dir=turnR(s.dir);return s;}
  if(real===I_GI){s.dir=turnL(s.dir);return s;}
  if(real===I_TM){s.evento='fin';return s;}
  if(real===I_RC){const i=_objIdx(s,map);if(i>=0){s.mask=s.mask|(1<<i);s.cuenta=s.cuenta+1;s.recogio=true;}return s;}
  if(real===I_AV){
    const d=DIR_DELTA[s.dir];const nr=s.r+d[0],nc=s.c+d[1];
    if(nr<0||nr>=map.n||nc<0||nc>=map.n){s.evento='borde';return s;}
    if(map.obst&&map.obst.indexOf(nr+','+nc)>=0){s.evento='obstaculo';return s;}
    s.r=nr;s.c=nc;return s;
  }
  return s;
}
function _esChoque(e){return e==='borde'||e==='obstaculo';}
// Ejecuta un programa completo (con bucles) sin animación: tareas, widgets y evaluaciones
function simRun(start,prog,map){
  let st={r:start.r,c:start.c,dir:start.dir,cuenta:start.cuenta||0,mask:start.mask||0};
  const flat=expandProg(prog);
  for(let i=0;i<flat.length;i++){
    const nx=simStep(st,flat[i].i,map);
    if(_esChoque(nx.evento))return{ok:false,crashAt:i,st,evento:nx.evento};
    st=nx;
    if(nx.evento==='fin')return{ok:true,st,fin:true,pasos:i+1};
  }
  return{ok:true,st};
}
// Tabla de traza de la variable CUENTA: una fila por instrucción realmente ejecutada
function trazaCuenta(start,prog,map){
  let st={r:start.r,c:start.c,dir:start.dir,cuenta:start.cuenta||0,mask:start.mask||0};
  const filas=[];const flat=expandProg(prog);
  for(let i=0;i<flat.length;i++){
    const nx=simStep(st,flat[i].i,map);
    if(_esChoque(nx.evento))break;
    st=nx;
    filas.push({txt:progLine(flat[i].i),v:flat[i].v,de:flat[i].de,val:st.cuenta,celda:coordName(st.r,st.c)});
    if(nx.evento==='fin')break;
  }
  return filas;
}
// Solucionador BFS del proyecto: programa MÁS CORTO que recoge TODOS los objetos y llega a la meta.
// Devuelve {prog,len} incluyendo el TERMINA final, o null si el nivel no tiene solución.
const SOLVE_INSTR=[I_AV,I_GD,I_GI,I_RC,C_PARED,C_OBJ];
function solveSim(start,dest,map,maxLen){
  maxLen=maxLen||22;
  const nObj=(map.objs||[]).length;
  const allMask=nObj?((1<<nObj)-1):0;
  const key=st=>st.r+','+st.c+','+st.dir+','+(st.mask||0);
  const vis=new Set();
  let frontier=[{st:{r:start.r,c:start.c,dir:start.dir,cuenta:0,mask:0},prog:[]}];
  vis.add(key(frontier[0].st));
  for(let depth=0;depth<=maxLen&&frontier.length;depth++){
    const next=[];
    for(const node of frontier){
      if(node.st.r===dest[0]&&node.st.c===dest[1]&&(node.st.mask||0)===allMask)
        return{prog:node.prog.concat([I_TM]),len:node.prog.length+1};
      for(const instr of SOLVE_INSTR){
        const nx=simStep(node.st,instr,map);
        if(_esChoque(nx.evento))continue;
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
// Planificador simple sin obstáculos (rutas rectas para las tareas)
function _rotInstr(a,b){const diff=((DIRS.indexOf(b)-DIRS.indexOf(a))%4+4)%4;if(diff===0)return[];if(diff===1)return[I_GD];if(diff===3)return[I_GI];return[I_GD,I_GD];}
function planRuta(sr,sc,dr,dc,dir0){
  const dv=dr<sr?'N':'S',dh=dc<sc?'O':'E';
  const nv=Math.abs(dr-sr),nh=Math.abs(dc-sc);
  const arma=(primero)=>{
    let prog=[],dir=dir0;
    const tramos=primero==='v'?[[dv,nv],[dh,nh]]:[[dh,nh],[dv,nv]];
    tramos.forEach(([d,n])=>{if(n===0)return;prog=prog.concat(_rotInstr(dir,d));dir=d;for(let i=0;i<n;i++)prog.push(I_AV);});
    prog.push(I_TM);
    return prog;
  };
  const p1=arma('v'),p2=arma('h');
  return p1.length<=p2.length?p1:p2;
}
// SVG de cuadrícula. o={n,robot:{r,c,dir},dest:[r,c],obst:[[r,c]],objs:[[r,c]],taken:['r,c'],deco:{'r,c':emoji},w,dots}
function svgGridHTML(o){
  const n=o.n,cs=44,m=26,W=m+n*cs+6,H=m+n*cs+6;
  const px=(c)=>m+c*cs,py=(r)=>m+r*cs;
  let s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"${o.w?` width="${o.w}"`:''} role="img" aria-label="Cuadrícula del proyecto">`;
  s+=`<rect x="${m}" y="${m}" width="${n*cs}" height="${n*cs}" fill="#ecfeff" stroke="#0e7490" stroke-width="2" rx="4"/>`;
  for(let i=1;i<n;i++){s+=`<line x1="${m+i*cs}" y1="${m}" x2="${m+i*cs}" y2="${m+n*cs}" stroke="#0e7490" stroke-width="0.8" opacity="0.5"/>`;s+=`<line x1="${m}" y1="${m+i*cs}" x2="${m+n*cs}" y2="${m+i*cs}" stroke="#0e7490" stroke-width="0.8" opacity="0.5"/>`;}
  for(let c=0;c<n;c++)s+=`<text x="${px(c)+cs/2}" y="${m-8}" text-anchor="middle" font-size="13" font-weight="bold" fill="#0e7490" font-family="Arial">${'ABCDE'[c]}</text>`;
  for(let r=0;r<n;r++)s+=`<text x="${m-10}" y="${py(r)+cs/2+5}" text-anchor="middle" font-size="13" font-weight="bold" fill="#0e7490" font-family="Arial">${r+1}</text>`;
  const ocupada={};
  (o.obst||[]).forEach(([r,c])=>{ocupada[r+','+c]=1;s+=`<text x="${px(c)+cs/2}" y="${py(r)+cs/2+8}" text-anchor="middle" font-size="24">🌳</text>`;});
  if(o.dest){ocupada[o.dest[0]+','+o.dest[1]]=1;s+=`<rect x="${px(o.dest[1])+2}" y="${py(o.dest[0])+2}" width="${cs-4}" height="${cs-4}" rx="5" fill="#bbf7d0" stroke="#16a34a" stroke-width="2"/>`;s+=`<text x="${px(o.dest[1])+cs/2}" y="${py(o.dest[0])+cs/2+8}" text-anchor="middle" font-size="24">${o.destEmoji||'🏁'}</text>`;}
  (o.objs||[]).forEach(([r,c])=>{const k=r+','+c;const yaTomado=(o.taken||[]).indexOf(k)>=0;ocupada[k]=1;s+=`<text x="${px(c)+cs/2}" y="${py(r)+cs/2+8}" text-anchor="middle" font-size="${yaTomado?18:24}" opacity="${yaTomado?0.28:1}">${o.objEmoji||'🍎'}</text>`;});
  if(o.deco)Object.keys(o.deco).forEach(k=>{const[r,c]=k.split(',').map(Number);if(ocupada[k])return;ocupada[k]=1;s+=`<text x="${px(c)+cs/2}" y="${py(r)+cs/2+8}" text-anchor="middle" font-size="24">${o.deco[k]}</text>`;});
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
  primer_quiz:{icon:'🚀',label:'Primer quiz del proyecto superado'},
  flash_master:{icon:'🃏',label:'Todas las flashcards del proyecto exploradas'},
  clasif_pro:{icon:'🗂️',label:'Clasificador de las partes del programa experto'},
  id_master:{icon:'🔍',label:'Identificador de eventos y pseudocódigo maestro'},
  reto_hero:{icon:'🏆',label:'Héroe del reto contra reloj'},
  lab_master:{icon:'🛠️',label:'¡Los 6 niveles del proyecto terminados!'},
  nivel3:{icon:'⌨️',label:'¡Constructor de Programas! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡Programador Completo! Nivel 7'},
  widgets_master:{icon:'🧩',label:'Widgets del proyecto dominados'}
};
function unlockAchievement(id){if(unlockedAch.includes(id))return;unlockedAch.push(id);sfx('ach');showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label);launchConfetti();renderAchPanel();saveProgress();}
function renderAchPanel(){const list=document.getElementById('achList');list.innerHTML='';Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{const div=document.createElement('div');div.className='ach-item'+(unlockedAch.includes(id)?'':' locked');div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`;list.appendChild(div);});}
function toggleAchPanel(){sfx('click');document.getElementById('achPanel').classList.toggle('open');}
function showToast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}t.textContent=msg;t.style.display='block';clearTimeout(t._tid);t._tid=setTimeout(()=>t.style.display='none',3200);}
function launchConfetti(){const colors=['#0e7490','#22d3ee','#b45309','#f59e0b','#6c5ce7'];for(let i=0;i<60;i++){const c=document.createElement('div');c.className='confetti-piece';c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`;document.body.appendChild(c);c.addEventListener('animationend',()=>c.remove());}}

// ===================== XP =====================
const lvls=[{t:0,n:'Aprendiz 🌱'},{t:25,n:'Planificador de Proyectos 📝'},{t:55,n:'Constructor de Programas 🔧'},{t:90,n:'Programador Junior 💻'},{t:130,n:'Probador y Mejorador 🔁'},{t:165,n:'Ingeniero de Proyectos 🏅'},{t:190,n:'Programador Completo 🚀'}];
function pts(n){xp=Math.max(0,Math.min(MXP,xp+n));updateXPBar();saveProgress();}
function updateXPBar(){const pct=Math.round((xp/MXP)*100);document.getElementById('xpFill').style.width=pct+'%';const el=document.getElementById('xpPts');el.textContent='⭐ '+xp;el.style.transform='scale(1.3)';setTimeout(()=>el.style.transform='',300);let lv=0;for(let i=0;i<lvls.length;i++)if(xp>=lvls[i].t)lv=i;document.getElementById('xpLvl').textContent=lvls[lv].n;if(lv!==prevLevel){if(lv>=2)unlockAchievement('nivel3');if(lv>=5)unlockAchievement('nivel5');prevLevel=lv;}}
function resetXP(){sfx('click');xp=0;updateXPBar();showToast('🔄 XP reiniciado a 0');}
function fin(id,showFX=true){if(!done.has(id)){done.add(id);const b=document.querySelector(`[data-s="${id}"]`);if(b)b.classList.add('done');if(showFX){sfx('up');launchConfetti();}saveProgress();}}
function getProgress(){return Math.round((done.size/TOTAL_SECTIONS)*100);}

// ===================== NAV =====================
function go(id){sfx('click');document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});document.getElementById(id).classList.add('active');const btn=document.querySelector(`[data-s="${id}"]`);if(btn){btn.classList.add('active');btn.setAttribute('aria-selected','true');}window.scrollTo({top:0,behavior:'smooth'});if(id==='s-sopa'){setTimeout(buildSopa,50);}if(id==='s-widgets'){setTimeout(buildRoute,50);}}

// ===================== MINI-QUIZ (tarjetas Aprende / Instrucciones) =====================
function miniQuiz(btn,ok,fbId){const wrap=btn.parentElement;wrap.querySelectorAll('.mq-opt').forEach(b=>b.classList.remove('correct','wrong'));btn.classList.add(ok?'correct':'wrong');const f=document.getElementById(fbId);if(f){f.textContent=ok?'¡Correcto! Así planifica un programador. 🎉':'Todavía no. Vuelve a leer la tarjeta y prueba otra vez.';f.className='mq-fb '+(ok?'ok':'err');}sfx(ok?'ok':'no');if(ok&&!xpTracker.wgt.has('mq_'+fbId)){xpTracker.wgt.add('mq_'+fbId);pts(2);}}

// ===================== FLASHCARD DATA =====================
const fcData=[
  {w:'Programa completo',a:'🚀 Un <strong>proyecto terminado</strong>: junta evento, secuencia, bucle, condicional y variable para resolver una tarea de principio a fin.'},
  {w:'Evento',a:'⚡ Lo que <strong>dispara</strong> el programa: «cuando empiece el programa» o «cuando se presione el botón». Sin evento nada arranca.'},
  {w:'Pseudocódigo',a:'📝 El programa escrito en <strong>español sencillo</strong>, paso a paso, <strong>antes</strong> de armarlo en la computadora.'},
  {w:'Descomponer',a:'🧩 Partir un proyecto grande en <strong>partes pequeñas</strong> y resolverlas una por una.'},
  {w:'Secuencia',a:'👣 El <strong>orden</strong> exacto de las instrucciones. Si cambia el orden, cambia el resultado.'},
  {w:'Condicional',a:'🔀 <strong>SI…ENTONCES…SINO</strong>: el programa decide entre dos caminos según una pregunta de sí o no.'},
  {w:'Bucle',a:'🔁 <strong>REPETIR N VECES [ … ]</strong>: repite un grupo de instrucciones sin escribirlas muchas veces.'},
  {w:'Variable',a:'🔢 Una <strong>cajita con nombre</strong> que guarda un dato que puede cambiar, como CUENTA.'},
  {w:'Contador',a:'➕ Una variable que <strong>suma 1</strong> cada vez que pasa algo: cuántos objetos 🍎 lleva el robot.'},
  {w:'Depurar',a:'🐛 <strong>Buscar y corregir</strong> los errores del programa: probar, encontrar el bug, cambiar UNA cosa y volver a probar.'},
  {w:'Probar y mejorar',a:'🔁 Ejecutar → ver qué falla → corregir → <strong>volver a probar</strong>. Ningún programa sale perfecto la primera vez.'},
  {w:'Versión',a:'📈 Cada <strong>mejora</strong> del programa: la versión 2 hace lo mismo que la 1, pero mejor o más corta.'},
  {w:'Algoritmo',a:'🗺️ El <strong>plan</strong> de la solución: los pasos ordenados que resuelven el problema, aunque no haya computadora.'},
  {w:'Programador',a:'💻 Quien <strong>piensa el plan</strong>, lo escribe en pseudocódigo, lo prueba y lo mejora hasta que funciona.'},
];
let fcIdx=0;
function upFC(){document.getElementById('fcInner').classList.remove('flipped');document.getElementById('fcW').textContent=fcData[fcIdx].w;document.getElementById('fcA').innerHTML=fcData[fcIdx].a;document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length;}
function flipCard(){sfx('flip');document.getElementById('fcInner').classList.toggle('flipped');if(!xpTracker.fc.has(fcIdx)){xpTracker.fc.add(fcIdx);pts(1);}if(xpTracker.fc.size===fcData.length){fin('s-flash');unlockAchievement('flash_master');}}
function nextFC(){sfx('click');fcIdx=(fcIdx+1)%fcData.length;upFC();}
function prevFC(){sfx('click');fcIdx=(fcIdx-1+fcData.length)%fcData.length;upFC();}

// ===================== JUEGO: MEMORIA DEL CÓDIGO =====================
const memoPairs=[
  {id:'evento',t:'Evento',d:'⚡ Cuando empiece el programa'},
  {id:'pseudo',t:'Pseudocódigo',d:'📝 El plan escrito en español sencillo'},
  {id:'bucle',t:'Bucle',d:'🔁 REPETIR N VECES [ … ]'},
  {id:'condicional',t:'Condicional',d:'🔀 SI…ENTONCES…SINO'},
  {id:'variable',t:'Variable',d:'🔢 La cajita CUENTA que va sumando'},
  {id:'depurar',t:'Depurar',d:'🐛 Probar, hallar el bug y corregir'}
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
  {q:'¿Qué es un programa completo?',o:['a) Una sola instrucción suelta','b) Un proyecto que junta evento, secuencia, bucle, condicional y variable','c) Un dibujo del robot','d) Un error del código'],c:1},
  {q:'¿Para qué sirve el EVENTO «cuando empiece el programa»?',o:['a) Para que el programa arranque','b) Para borrar el código','c) Para girar el robot','d) Para contar objetos'],c:0},
  {q:'¿Qué es el pseudocódigo?',o:['a) Un idioma secreto de las computadoras','b) El plan escrito en español sencillo antes de programar','c) Un error del programa','d) El nombre del robot'],c:1},
  {q:'¿Qué significa DESCOMPONER un proyecto?',o:['a) Romperlo para que no funcione','b) Partirlo en partes pequeñas y armarlo por pasos','c) Borrarlo y empezar de cero','d) Copiarlo de un compañero'],c:1},
  {q:'¿Qué pieza usas para repetir instrucciones sin escribirlas muchas veces?',o:['a) La variable','b) El evento','c) El bucle','d) El comentario'],c:2},
  {q:'¿Qué pieza usas para que el robot DECIDA según lo que ve?',o:['a) El condicional','b) El bucle','c) La variable','d) La secuencia'],c:0},
  {q:'¿Para qué sirve la variable CUENTA en el proyecto?',o:['a) Para girar','b) Para guardar cuántos objetos lleva el robot','c) Para borrar el mapa','d) Para apagar el programa'],c:1},
  {q:'Tu programa falla. ¿Qué hace un buen programador?',o:['a) Borra todo y se enoja','b) Prueba, encuentra el error, corrige UNA cosa y vuelve a probar','c) Le echa la culpa al robot','d) Deja el proyecto sin terminar'],c:1},
  {q:'¿En qué momento se escribe el pseudocódigo?',o:['a) Antes de armar el programa','b) Nunca','c) Solo después de terminarlo','d) Cuando ya funciona perfecto'],c:0},
];
let qzIdx=0,qzSel=-1,qzDone=false;
function buildQz(){qzIdx=0;qzSel=-1;qzDone=false;showQz();}
function showQz(){if(qzIdx>=qzData.length){document.getElementById('qzQ').textContent='🎉 ¡Quiz completado!';document.getElementById('qzOpts').innerHTML='';fin('s-quiz');unlockAchievement('primer_quiz');return;}const q=qzData[qzIdx];document.getElementById('qzProg').textContent=`Pregunta ${qzIdx+1} de ${qzData.length}`;document.getElementById('qzQ').textContent=q.q;const opts=document.getElementById('qzOpts');opts.innerHTML='';q.o.forEach((o,i)=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=o;b.onclick=()=>{if(qzDone)return;document.querySelectorAll('.qz-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');qzSel=i;sfx('click');};opts.appendChild(b);});qzDone=false;}
function checkQz(){if(qzSel<0)return fb('fbQz','Selecciona una respuesta.',false);qzDone=true;const opts=document.querySelectorAll('.qz-opt');if(qzSel===qzData[qzIdx].c){opts[qzSel].classList.add('correct');fb('fbQz','¡Correcto! +5 XP',true);if(!xpTracker.qz.has(qzIdx)){xpTracker.qz.add(qzIdx);pts(5);}sfx('ok');}else{opts[qzSel].classList.add('wrong');opts[qzData[qzIdx].c].classList.add('correct');fb('fbQz','Incorrecto. Revisa la respuesta correcta.',false);sfx('no');}setTimeout(()=>{qzIdx++;qzSel=-1;showQz();},1600);}
function resetQz(){sfx('click');qzIdx=0;qzSel=-1;qzDone=false;showQz();document.getElementById('fbQz').classList.remove('show');}

// ===================== CLASIFICACIÓN =====================
const classGroups=[
  {label:['Plan (antes de programar)','Código (el programa ya armado)'],headA:'📝 Plan (antes de programar)',headB:'💻 Código (programa armado)',colA:'plan',colB:'cod',
   words:[{w:'Escribir el pseudocódigo',t:'plan'},{w:'REPETIR 4 VECES [AVANZA]',t:'cod'},{w:'Descomponer el proyecto en partes',t:'plan'},{w:'SI HAY OBJETO AQUÍ → RECOGE',t:'cod'},{w:'Dibujar el mapa del patio',t:'plan'},{w:'GUARDA 0 EN CUENTA',t:'cod'},{w:'Listar qué debe hacer el programa',t:'plan'},{w:'AVANZA, AVANZA, GIRA DERECHA',t:'cod'},{w:'Pensar el orden de los pasos',t:'plan'},{w:'SUMA 1 A CUENTA',t:'cod'}]},
  {label:['Bucle 🔁','Condicional 🔀'],headA:'🔁 Bucle (repetir)',headB:'🔀 Condicional (decidir)',colA:'buc',colB:'con',
   words:[{w:'REPETIR 5 VECES [AVANZA]',t:'buc'},{w:'SI HAY PARED → GIRA, SINO → AVANZA',t:'con'},{w:'Dar 4 vueltas iguales',t:'buc'},{w:'¿Hay un objeto aquí?',t:'con'},{w:'REPETIR 3 VECES [AVANZA, RECOGE]',t:'buc'},{w:'SI llueve → paraguas, SINO → gorra',t:'con'},{w:'Repetir el patrón sin cansarse',t:'buc'},{w:'Elegir entre dos caminos',t:'con'}]},
  {label:['Evento ⚡','Instrucción 👣'],headA:'⚡ Evento (dispara)',headB:'👣 Instrucción (acción)',colA:'evt',colB:'ins',
   words:[{w:'Cuando empiece el programa',t:'evt'},{w:'AVANZA',t:'ins'},{w:'Cuando se presione el botón',t:'evt'},{w:'RECOGE',t:'ins'},{w:'Cuando toque la bandera verde',t:'evt'},{w:'GIRA DERECHA',t:'ins'},{w:'Cuando el maestro diga «ya»',t:'evt'},{w:'TERMINA',t:'ins'}]},
  {label:['De programación','De otra materia'],headA:'💻 De programación',headB:'📚 De otra materia',colA:'prog',colB:'otro',
   words:[{w:'Pseudocódigo',t:'prog'},{w:'Fotosíntesis',t:'otro'},{w:'Depurar',t:'prog'},{w:'Sustantivo',t:'otro'},{w:'Contador',t:'prog'},{w:'Península',t:'otro'},{w:'Evento',t:'prog'},{w:'Fracción',t:'otro'},{w:'Bucle',t:'prog'},{w:'Estela maya',t:'otro'}]},
];
let currentClassGroupIdx=0,clsSelectedWord=null;
function buildClass(){const group=classGroups[currentClassGroupIdx];document.getElementById('col-left-head').textContent=group.headA;document.getElementById('col-right-head').textContent=group.headB;const bank=document.getElementById('clsBank');bank.innerHTML='';clsSelectedWord=null;document.getElementById('items-left').innerHTML='';document.getElementById('items-right').innerHTML='';_shuffle([...group.words]).forEach(w=>{const el=document.createElement('div');el.className='wb-item';el.textContent=w.w;el.dataset.t=w.t;el.onclick=()=>{document.querySelectorAll('.wb-item').forEach(i=>i.classList.remove('sel-word'));el.classList.add('sel-word');clsSelectedWord=el;sfx('click');};bank.appendChild(el);});['col-left','col-right'].forEach(colId=>{const col=document.getElementById(colId);col.onclick=(e)=>{if(!clsSelectedWord||e.target.classList.contains('drop-item'))return;const targetId=colId==='col-left'?'items-left':'items-right';const wordsCol=document.getElementById(targetId);const item=document.createElement('div');item.className='drop-item';item.textContent=clsSelectedWord.textContent;item.dataset.t=clsSelectedWord.dataset.t;const original=clsSelectedWord;item.onclick=(ev)=>{ev.stopPropagation();if(clsSelectedWord!==null){col.click();}else{document.getElementById('clsBank').appendChild(original);original.classList.remove('sel-word');item.remove();if(typeof sfx==='function')sfx('click');}};wordsCol.appendChild(item);clsSelectedWord.remove();clsSelectedWord=null;sfx('click');};});}
function checkClass(){const remaining=document.querySelectorAll('#clsBank .wb-item').length;if(remaining>0){fb('fbCls','Mueve todas las palabras a las columnas primero.',false);return;}const group=classGroups[currentClassGroupIdx];let allOk=true;document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{const inLeft=el.parentElement.id==='items-left';const expectedType=inLeft?group.colA:group.colB;if(el.dataset.t===expectedType){el.classList.add('cls-ok');}else{el.classList.add('cls-no');allOk=false;}});if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);}if(allOk){fb('fbCls','¡Perfecto! +5 XP',true);sfx('fan');fin('s-clasifica');unlockAchievement('clasif_pro');}else{fb('fbCls','Hay errores. Marcados en rojo.',false);sfx('no');}}
function nextClassGroup(){sfx('click');currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length;buildClass();document.getElementById('fbCls').classList.remove('show');showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]);}
function resetClass(){sfx('click');buildClass();document.getElementById('fbCls').classList.remove('show');}

// ===================== IDENTIFICAR =====================
const idData=[
  {s:['CUANDO','EMPIECE','EL','PROGRAMA','GUARDA','0','EN','CUENTA.'],c:1,art:'La palabra del EVENTO que dispara el programa'},
  {s:['REPETIR','6','VECES','[','AVANZA',',','RECOGE',']'],c:0,art:'La palabra que abre el BUCLE'},
  {s:['SI','HAY','OBJETO','AQUÍ','RECOGE','SINO','AVANZA.'],c:0,art:'La palabra que abre el CONDICIONAL'},
  {s:['La','variable','CUENTA','guarda','cuántos','objetos','lleva.'],c:2,art:'El nombre de la VARIABLE contadora del proyecto'},
  {s:['El','pseudocódigo','se','escribe','antes','de','programar.'],c:1,art:'El plan escrito en español sencillo'},
  {s:['Descomponer','es','partir','el','proyecto','en','partes.'],c:0,art:'Partir un proyecto grande en partes pequeñas'},
  {s:['Probar','el','programa','ayuda','a','encontrar','el','bug.'],c:7,art:'El error que hay que encontrar y corregir'},
  {s:['Depurar','es','corregir','y','volver','a','probar.'],c:0,art:'Buscar y corregir los errores del programa'},
];
let idIdx=0,idDone=false;
function showId(){idDone=false;if(idIdx>=idData.length){document.getElementById('idSent').innerHTML='🎉 ¡Completado!';fin('s-identifica');unlockAchievement('id_master');return;}const d=idData[idIdx];document.getElementById('idProg').textContent=`Oración ${idIdx+1} de ${idData.length}`;document.getElementById('idInfo').textContent=`Busca: ${d.art}`;const sent=document.getElementById('idSent');sent.innerHTML='';d.s.forEach((w,i)=>{const span=document.createElement('span');span.className='id-word';span.textContent=w+' ';span.onclick=()=>checkId(i,span);sent.appendChild(span);});}
function checkId(i,span){if(idDone)return;document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected'));span.classList.add('selected');if(i===idData[idIdx].c){idDone=true;span.classList.add('id-ok');fb('fbId','¡Correcto! +5 XP',true);if(!xpTracker.id.has(idIdx)){xpTracker.id.add(idIdx);pts(5);}sfx('ok');}else{span.classList.add('id-no');fb('fbId','Ese no es el término solicitado.',false);sfx('no');}}
function nextId(){sfx('click');idIdx++;showId();document.getElementById('fbId').classList.remove('show');}
function resetId(){sfx('click');idIdx=0;showId();document.getElementById('fbId').classList.remove('show');}

// ===================== COMPLETA =====================
const cmpData=[
  {s:'Lo que hace arrancar un programa se llama ___.',opts:['evento','bucle','variable'],c:0},
  {s:'El plan escrito en español sencillo antes de programar es el ___.',opts:['bucle','pseudocódigo','contador'],c:1},
  {s:'Partir un proyecto grande en partes pequeñas es ___.',opts:['descomponer','depurar','repetir'],c:0},
  {s:'Para repetir instrucciones sin escribirlas muchas veces se usa un ___.',opts:['evento','bucle','sensor'],c:1},
  {s:'Para que el programa DECIDA entre dos caminos se usa un ___.',opts:['condicional','contador','rastro'],c:0},
  {s:'La cajita CUENTA que va sumando es un ___.',opts:['bug','contador','evento'],c:1},
  {s:'Buscar y corregir los errores del programa es ___.',opts:['depurar','descomponer','avanzar'],c:0},
  {s:'Después de corregir un error hay que volver a ___.',opts:['borrar','probar','girar'],c:1},
];
let cmpIdx=0,cmpSel=-1,cmpDone=false;
function showCmp(){if(cmpIdx>=cmpData.length){document.getElementById('cmpSent').innerHTML='🎉 ¡Completado!';document.getElementById('cmpOpts').innerHTML='';fin('s-completa');return;}const d=cmpData[cmpIdx];document.getElementById('cmpProg').textContent=`Oración ${cmpIdx+1} de ${cmpData.length}`;document.getElementById('cmpSent').innerHTML=d.s.replace('___','<span class="blank">___</span>');const opts=document.getElementById('cmpOpts');opts.innerHTML='';cmpSel=-1;cmpDone=false;d.opts.forEach((o,i)=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=o;b.onclick=()=>{if(cmpDone)return;document.querySelectorAll('.cmp-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');cmpSel=i;sfx('click');};opts.appendChild(b);});}
function checkCmp(){if(cmpSel<0)return fb('fbCmp','Selecciona una opción.',false);cmpDone=true;const opts=document.querySelectorAll('.cmp-opt');if(cmpSel===cmpData[cmpIdx].c){opts[cmpSel].classList.add('correct');document.getElementById('cmpSent').innerHTML=cmpData[cmpIdx].s.replace('___',`<span class="blank" style="color:var(--jade);border-color:var(--jade)">${opts[cmpSel].textContent}</span>`);fb('fbCmp','¡Correcto! +5 XP',true);if(!xpTracker.cmp.has(cmpIdx)){xpTracker.cmp.add(cmpIdx);pts(5);}sfx('ok');}else{opts[cmpSel].classList.add('wrong');opts[cmpData[cmpIdx].c].classList.add('correct');fb('fbCmp','Incorrecto. Revisa bien la respuesta.',false);sfx('no');}setTimeout(()=>{cmpIdx++;document.getElementById('fbCmp').classList.remove('show');showCmp();},1600);}

// ===================== WIDGETS =====================
// Widget 1: Ordena los pasos del proyecto
const routeSets=[
  {label:'Ordena los pasos para armar un proyecto',steps:['1. Entiendo el problema','2. Descompongo el proyecto en partes','3. Escribo el pseudocódigo','4. Armo el programa','5. Pruebo, corrijo y vuelvo a probar']},
  {label:'Ordena el pseudocódigo del recolector',steps:['CUANDO EMPIECE EL PROGRAMA','GUARDA 0 EN CUENTA','REPETIR 6 VECES [ SI HAY OBJETO AQUÍ → RECOGE, SINO → AVANZA ]','MUESTRA CUENTA','TERMINA']},
  {label:'Ordena el método de probar y mejorar',steps:['Ejecuto el programa','Observo dónde falla','Busco la línea culpable','Corrijo UNA sola cosa','Vuelvo a ejecutar para comprobar']},
];
let currentRouteIdx=0,routeItems=[];
function buildRoute(){routeItems=_shuffle([...routeSets[currentRouteIdx].steps]);renderRoute();const fbEl=document.getElementById('fbRoute');if(fbEl)fbEl.classList.remove('show');}
function renderRoute(){const list=document.getElementById('routeList');if(!list)return;list.innerHTML='';routeItems.forEach((step,i)=>{const div=document.createElement('div');div.className='sort-item';div.innerHTML=`<div class="sort-arrows"><button class="sort-arrow" onclick="routeMove(${i},-1)"${i===0?' disabled':''}>▲</button><button class="sort-arrow" onclick="routeMove(${i},1)"${i===routeItems.length-1?' disabled':''}>▼</button></div><div class="sort-step-num">${i+1}.</div><div class="sort-item-txt">${step}</div>`;list.appendChild(div);});}
function routeMove(idx,dir){sfx('click');const ni=idx+dir;if(ni<0||ni>=routeItems.length)return;[routeItems[idx],routeItems[ni]]=[routeItems[ni],routeItems[idx]];renderRoute();}
function checkRoute(){const correct=routeSets[currentRouteIdx].steps;const isOk=routeItems.every((s,i)=>s===correct[i]);if(isOk){fb('fbRoute','¡Perfecto! Ese es el plan del proyecto. +4 XP',true);if(!xpTracker.wgt.has('route_'+currentRouteIdx)){xpTracker.wgt.add('route_'+currentRouteIdx);pts(4);}sfx('fan');fin('s-widgets');unlockAchievement('widgets_master');}else{fb('fbRoute','Hay pasos fuera de orden. Revisa el plan.',false);sfx('no');}}
function nextRoute(){sfx('click');currentRouteIdx=(currentRouteIdx+1)%routeSets.length;buildRoute();showToast('🔄 Secuencia: '+routeSets[currentRouteIdx].label);}

// Widget 2: ¿Dónde termina el programa? (cuadrícula 4×4 con bucle + condicional, IDs estándar «neuron»)
const _wgtEndDefs=[
  {r:3,c:0,dir:'N',obst:[],objs:[[2,0]],prog:[{rep:3,body:[C_OBJ]}]},
  {r:3,c:0,dir:'E',obst:[],objs:[],prog:[{rep:3,body:[I_AV]}]},
  {r:3,c:1,dir:'N',obst:[[1,1]],objs:[],prog:[I_AV,C_PARED,I_AV]},
  {r:0,c:0,dir:'S',obst:[],objs:[[1,0],[2,0]],prog:[{rep:4,body:[C_OBJ]}]},
  {r:3,c:3,dir:'N',obst:[],objs:[],prog:[{rep:2,body:[I_AV,I_GI]}]},
  {r:0,c:3,dir:'S',obst:[[2,3]],objs:[],prog:[I_AV,C_PARED,I_AV]},
  {r:3,c:2,dir:'N',obst:[],objs:[[2,2],[1,2]],prog:[{rep:5,body:[C_OBJ]}]},
  {r:2,c:0,dir:'E',obst:[],objs:[],prog:[{rep:2,body:[I_AV]},I_GI,I_AV]},
];
const neuronPartes=_wgtEndDefs.map(d=>{
  const map={n:4,obst:(d.obst||[]).map(o=>o[0]+','+o[1]),objs:(d.objs||[]).map(o=>o[0]+','+o[1])};
  const res=simRun({r:d.r,c:d.c,dir:d.dir},d.prog,map);
  const ans=coordName(res.st.r,res.st.c);
  const all=[];for(let r=0;r<4;r++)for(let c=0;c<4;c++)all.push(coordName(r,c));
  const opts=[ans,..._shuffle(all.filter(x=>x!==ans)).slice(0,3)];
  return{desc:`<div>El robot parte de <strong>${coordName(d.r,d.c)}</strong> mirando al <strong>${DIR_NOMBRE[d.dir]}</strong>. ¡Ejecuta el bucle vuelta por vuelta! 🔁</div><div class="w-prog">${progLineas(d.prog).map((p,i)=>(i+1)+'. '+p).join('<br>')}</div><div style="margin-top:0.4rem;">${svgGridHTML({n:4,robot:{r:d.r,c:d.c,dir:d.dir},obst:d.obst,objs:d.objs,w:150})}</div>`,ans,opts};
});
let neuronIdx=0,neuronDone=false;
function showNeuron(){neuronDone=false;if(neuronIdx>=neuronPartes.length){const el=document.getElementById('neuronDesc');if(el)el.innerHTML='🎉 ¡Predijiste todos los recorridos!';const opts=document.getElementById('neuronOpts');if(opts)opts.innerHTML='';fin('s-widgets');return;}const d=neuronPartes[neuronIdx];const prog=document.getElementById('neuronProg');if(prog)prog.textContent=`Recorrido ${neuronIdx+1} de ${neuronPartes.length}`;const desc=document.getElementById('neuronDesc');if(desc)desc.innerHTML=d.desc;const opts=document.getElementById('neuronOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=opt;b.onclick=()=>checkNeuron(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuron');if(fbEl)fbEl.classList.remove('show');}
function checkNeuron(opt,btn,d){if(neuronDone)return;neuronDone=true;document.querySelectorAll('#neuronOpts .cmp-opt').forEach(b=>{if(b.textContent===d.ans)b.classList.add('correct');else if(b===btn&&b.textContent!==d.ans)b.classList.add('wrong');});const isOk=opt===d.ans;if(isOk){fb('fbNeuron','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('neuron_'+neuronIdx)){xpTracker.wgt.add('neuron_'+neuronIdx);pts(3);}sfx('ok');}else{fb('fbNeuron','La respuesta correcta es: '+d.ans,false);sfx('no');}}
function nextNeuron(){sfx('click');neuronIdx++;showNeuron();}
function resetNeuron(){sfx('click');neuronIdx=0;showNeuron();}

// Widget 3: Detective del bug del proyecto (IDs estándar «neuro»)
const _wgtBugDefs=[
  {goal:'El programa debe contar los objetos 🍎 que recoge el robot.',
   lines:['CUANDO EMPIECE EL PROGRAMA','REPETIR 4 VECES [ AVANZA, RECOGE ]','TERMINA'],bug:0,fix:'falta GUARDA 0 EN CUENTA: sin inicializar la variable el contador no sirve'},
  {goal:'El programa debe repetir 5 veces el patrón AVANZA, RECOGE.',
   lines:['CUANDO EMPIECE EL PROGRAMA','REPETIR 5 VECES AVANZA, RECOGE','TERMINA'],bug:1,fix:'al bucle le faltan los corchetes [ ] que marcan su cuerpo'},
  {goal:'El robot debe girar cuando encuentra una pared 🌳.',
   lines:['CUANDO EMPIECE EL PROGRAMA','REPETIR 4 VECES [ SI HAY PARED ADELANTE → AVANZA, SINO → GIRA DERECHA ]','TERMINA'],bug:1,fix:'las ramas están al revés: cuando SÍ hay pared debe GIRAR, no avanzar'},
  {goal:'El programa debe arrancar solo cuando se dispare el evento.',
   lines:['GUARDA 0 EN CUENTA','REPETIR 3 VECES [ AVANZA, RECOGE ]','TERMINA'],bug:0,fix:'falta el EVENTO «CUANDO EMPIECE EL PROGRAMA»: sin disparador nada arranca'},
  {goal:'El programa debe cerrar el proyecto al llegar a la meta 🏁.',
   lines:['CUANDO EMPIECE EL PROGRAMA','GUARDA 0 EN CUENTA','REPETIR 6 VECES [ SI HAY OBJETO AQUÍ → RECOGE, SINO → AVANZA ]'],bug:2,fix:'falta la instrucción TERMINA al final: el programa nunca cierra el proyecto'},
];
const neuroPairs=_wgtBugDefs.map(d=>{
  const bi=d.bug;
  return{
    trans:`<div>🎯 <strong>Meta:</strong> ${d.goal} ¡Este programa tiene UN bug!</div><div class="w-prog" style="text-align:left;margin-top:0.5rem;">${d.lines.map((p,i)=>'Línea '+(i+1)+': '+p).join('<br>')}</div>`,
    func:'Línea '+(bi+1)+' (aquí está el bug)',
    opts:d.lines.map((p,i)=>'Línea '+(i+1)+(i===bi?' (aquí está el bug)':' (está bien)'))
  };
});
let neuroIdx=0,neuroDone=false;
function showNeuro(){neuroDone=false;if(neuroIdx>=neuroPairs.length){const el=document.getElementById('neuroTrans');if(el)el.innerHTML='🎉 ¡Todos los bugs atrapados!';const opts=document.getElementById('neuroOpts');if(opts)opts.innerHTML='';return;}const d=neuroPairs[neuroIdx];const prog=document.getElementById('neuroProg');if(prog)prog.textContent=`${neuroIdx+1} de ${neuroPairs.length}`;const trans=document.getElementById('neuroTrans');if(trans)trans.innerHTML=d.trans;const opts=document.getElementById('neuroOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkNeuro(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbNeuro');if(fbEl)fbEl.classList.remove('show');}
function checkNeuro(opt,btn,d){if(neuroDone)return;neuroDone=true;document.querySelectorAll('#neuroOpts .qz-opt').forEach(b=>{if(b.textContent===d.func)b.classList.add('correct');else if(b===btn&&b.textContent!==d.func)b.classList.add('wrong');});const isOk=opt===d.func;if(isOk){fb('fbNeuro','¡Bug atrapado! +3 XP',true);if(!xpTracker.wgt.has('neuro_'+neuroIdx)){xpTracker.wgt.add('neuro_'+neuroIdx);pts(3);}sfx('ok');}else{fb('fbNeuro','El bug estaba en: '+d.func,false);sfx('no');}setTimeout(()=>{neuroIdx++;showNeuro();},1800);}
function resetNeuro(){sfx('click');neuroIdx=0;showNeuro();}

// Widget 4: ¿Qué pieza necesita tu proyecto? (IDs estándar «enfer»)
const enfermedadData=[
  {disease:'El robot debe recorrer 6 casillas iguales sin escribir 6 veces AVANZA. ¿Qué pieza usas?',characteristic:'Un bucle 🔁',opts:['Un bucle 🔁','Una variable 🔢']},
  {disease:'El robot debe decidir si girar o avanzar según lo que ve. ¿Qué pieza usas?',characteristic:'Un condicional 🔀',opts:['Un condicional 🔀','Un evento ⚡']},
  {disease:'Necesitas saber cuántos objetos 🍎 lleva el robot. ¿Qué pieza usas?',characteristic:'Una variable contadora 🔢',opts:['Una variable contadora 🔢','Un bucle 🔁']},
  {disease:'Quieres que el programa arranque al presionar el botón. ¿Qué pieza usas?',characteristic:'Un evento ⚡',opts:['Un evento ⚡','Un condicional 🔀']},
  {disease:'Antes de armar el programa quieres pensar el plan en español. ¿Qué haces?',characteristic:'Escribo el pseudocódigo 📝',opts:['Escribo el pseudocódigo 📝','Borro el proyecto 🗑️']},
  {disease:'El programa se ejecuta pero el robot choca. ¿Qué haces?',characteristic:'Depuro: busco el bug y corrijo 🐛',opts:['Depuro: busco el bug y corrijo 🐛','Dejo el proyecto así 😴']},
];
let enferIdx=0,enferDone=false;
function showEnfer(){enferDone=false;if(enferIdx>=enfermedadData.length){const el=document.getElementById('enferDisease');if(el)el.textContent='🎉 ¡Completado!';const opts=document.getElementById('enferOpts');if(opts)opts.innerHTML='';return;}const d=enfermedadData[enferIdx];const prog=document.getElementById('enferProg');if(prog)prog.textContent=`${enferIdx+1} de ${enfermedadData.length}`;const dis=document.getElementById('enferDisease');if(dis)dis.textContent=d.disease;const opts=document.getElementById('enferOpts');if(!opts)return;opts.innerHTML='';_shuffle([...d.opts]).forEach(opt=>{const b=document.createElement('button');b.className='qz-opt';b.textContent=opt;b.onclick=()=>checkEnfer(opt,b,d);opts.appendChild(b);});const fbEl=document.getElementById('fbEnfer');if(fbEl)fbEl.classList.remove('show');}
function checkEnfer(opt,btn,d){if(enferDone)return;enferDone=true;document.querySelectorAll('#enferOpts .qz-opt').forEach(b=>{if(b.textContent===d.characteristic)b.classList.add('correct');else if(b===btn&&b.textContent!==d.characteristic)b.classList.add('wrong');});const isOk=opt===d.characteristic;if(isOk){fb('fbEnfer','¡Correcto! +3 XP',true);if(!xpTracker.wgt.has('enfer_'+enferIdx)){xpTracker.wgt.add('enfer_'+enferIdx);pts(3);}sfx('ok');}else{fb('fbEnfer','Correcto: '+d.characteristic,false);sfx('no');}setTimeout(()=>{enferIdx++;showEnfer();},1800);}
function resetEnfer(){sfx('click');enferIdx=0;showEnfer();}

// ===================== RETO FINAL =====================
const retoPairs=[
  {label:['Bucle 🔁','Condicional 🔀'],btnA:'🔁 Bucle',btnB:'🔀 Condicional',colA:'buc',colB:'con',
   words:[{w:'REPETIR 5 VECES',t:'buc'},{w:'SI HAY PARED → GIRA',t:'con'},{w:'Dar 4 vueltas iguales',t:'buc'},{w:'¿Hay un objeto aquí?',t:'con'},{w:'Repetir el patrón',t:'buc'},{w:'SINO → AVANZA',t:'con'},{w:'Cuerpo entre corchetes [ ]',t:'buc'},{w:'Elegir entre dos caminos',t:'con'},{w:'Número de vueltas',t:'buc'},{w:'Pregunta de sí o no',t:'con'}]},
  {label:['Plan 📝','Código 💻'],btnA:'📝 Plan',btnB:'💻 Código',colA:'plan',colB:'cod',
   words:[{w:'Escribir el pseudocódigo',t:'plan'},{w:'REPETIR 4 VECES [AVANZA]',t:'cod'},{w:'Descomponer el proyecto',t:'plan'},{w:'GUARDA 0 EN CUENTA',t:'cod'},{w:'Dibujar el mapa',t:'plan'},{w:'AVANZA, GIRA DERECHA',t:'cod'},{w:'Listar las partes',t:'plan'},{w:'SUMA 1 A CUENTA',t:'cod'}]},
  {label:['De programación','De otra materia'],btnA:'💻 Programación',btnB:'📚 Otra materia',colA:'prog',colB:'otro',
   words:[{w:'Pseudocódigo',t:'prog'},{w:'Fotosíntesis',t:'otro'},{w:'Evento',t:'prog'},{w:'Sustantivo',t:'otro'},{w:'Contador',t:'prog'},{w:'Península',t:'otro'},{w:'Depurar',t:'prog'},{w:'Fracción',t:'otro'},{w:'Algoritmo',t:'prog'},{w:'Estela maya',t:'otro'}]},
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
// Caso 4×4 con bucle + condicional que no choca (para trazar el recorrido y la variable)
function _rndCasoProy(rnd){
  const R=rnd||Math.random;
  const ri=(a,b)=>Math.floor(R()*(b-a+1))+a;
  for(let intento=0;intento<400;intento++){
    const n=4;
    const obst=[];const nOb=ri(0,2);
    while(obst.length<nOb){const r=ri(0,n-1),c=ri(0,n-1);if(!obst.some(([or,oc])=>or===r&&oc===c))obst.push([r,c]);}
    const objs=[];const nObj=ri(1,2);
    let g=0;
    while(objs.length<nObj&&g<80){g++;const r=ri(0,n-1),c=ri(0,n-1);if(obst.some(([or,oc])=>or===r&&oc===c))continue;if(objs.some(([or,oc])=>or===r&&oc===c))continue;objs.push([r,c]);}
    let sr=0,sc=0,g2=0;do{sr=ri(0,n-1);sc=ri(0,n-1);g2++;}while(g2<80&&obst.some(([or,oc])=>or===sr&&oc===sc));
    if(obst.some(([or,oc])=>or===sr&&oc===sc))continue;
    const dir=DIRS[ri(0,3)];
    const map={n,obst:obst.map(o=>o[0]+','+o[1]),objs:objs.map(o=>o[0]+','+o[1])};
    const prog=[];
    if(R()<0.45)prog.push(R()<0.6?I_AV:(R()<0.5?I_GD:I_GI));
    const rep=ri(2,4);
    const body=[];
    const bodyLen=ri(1,2);
    for(let k=0;k<bodyLen;k++){
      const roll=R();
      body.push(roll<0.45?C_OBJ:(roll<0.7?C_PARED:(roll<0.88?I_AV:I_GD)));
    }
    if(!body.some(esCond))body[0]=C_OBJ;
    prog.push({rep,body});
    const res=simRun({r:sr,c:sc,dir},prog,map);
    if(!res.ok)continue;
    if(res.st.r===sr&&res.st.c===sc&&res.st.cuenta===0)continue;
    return{n,sr,sc,dir,obst,objs,map,prog,fin:res.st};
  }
  const map={n:4,obst:[],objs:['2,0']};
  const prog=[{rep:3,body:[C_OBJ]}];
  const res=simRun({r:3,c:0,dir:'N'},prog,map);
  return{n:4,sr:3,sc:0,dir:'N',obst:[],objs:[[2,0]],map,prog,fin:res.st};
}
const pseudoProyDB=[
  {tema:'Recoger las 3 manzanas 🍎 del patio y volver a la meta 🏁',
   plan:['CUANDO EMPIECE EL PROGRAMA','GUARDA 0 EN CUENTA','REPETIR 8 VECES [ SI HAY OBJETO AQUÍ → RECOGE (SUMA 1 A CUENTA), SINO → AVANZA ]','MUESTRA CUENTA','TERMINA']},
  {tema:'Barrer el aula avanzando y girando cuando topa con la pared 🌳',
   plan:['CUANDO EMPIECE EL PROGRAMA','GUARDA 0 EN VUELTAS','REPETIR 10 VECES [ SI HAY PARED ADELANTE → GIRA DERECHA (SUMA 1 A VUELTAS), SINO → AVANZA ]','MUESTRA VUELTAS','TERMINA']},
  {tema:'Contar cuántos alumnos llegaron temprano ⏰',
   plan:['CUANDO EMPIECE EL PROGRAMA','GUARDA 0 EN TEMPRANO','REPETIR 30 VECES [ SI EL ALUMNO LLEGÓ ANTES DE LAS 7 → SUMA 1 A TEMPRANO, SINO → NO HAGO NADA ]','MUESTRA TEMPRANO','TERMINA']},
  {tema:'Regar 5 surcos de la milpa 🌽 solo si la tierra está seca',
   plan:['CUANDO EMPIECE EL PROGRAMA','GUARDA 0 EN REGADOS','REPETIR 5 VECES [ SI LA TIERRA ESTÁ SECA → RIEGO (SUMA 1 A REGADOS), SINO → PASO AL SIGUIENTE SURCO ]','MUESTRA REGADOS','TERMINA']},
  {tema:'Repartir 20 refrigerios y avisar cuando se acaben 🍞',
   plan:['CUANDO EMPIECE EL PROGRAMA','GUARDA 20 EN QUEDAN','REPETIR 20 VECES [ SI QUEDAN ES MAYOR QUE 0 → ENTREGO UNO (RESTA 1 A QUEDAN), SINO → AVISO QUE SE ACABARON ]','MUESTRA QUEDAN','TERMINA']},
  {tema:'Marcar la asistencia del aula y contar los presentes 📋',
   plan:['CUANDO EMPIECE EL PROGRAMA','GUARDA 0 EN PRESENTES','REPETIR 25 VECES [ SI EL ALUMNO RESPONDIÓ → SUMA 1 A PRESENTES, SINO → LO MARCO AUSENTE ]','MUESTRA PRESENTES','TERMINA']},
];
const bugProyDB=[
  {goal:'contar los objetos 🍎 que recoge el robot',mala:'REPETIR 4 VECES [ AVANZA, RECOGE ]',buena:'GUARDA 0 EN CUENTA · REPETIR 4 VECES [ AVANZA, RECOGE ]',err:'falta inicializar la variable con GUARDA 0 EN CUENTA'},
  {goal:'repetir el patrón AVANZA, RECOGE cinco veces',mala:'REPETIR 5 VECES AVANZA, RECOGE',buena:'REPETIR 5 VECES [ AVANZA, RECOGE ]',err:'al bucle le faltan los corchetes [ ] que marcan el cuerpo'},
  {goal:'girar cuando hay una pared 🌳 adelante',mala:'SI HAY PARED ADELANTE → AVANZA, SINO → GIRA DERECHA',buena:'SI HAY PARED ADELANTE → GIRA DERECHA, SINO → AVANZA',err:'las ramas del condicional están al revés'},
  {goal:'que el proyecto arranque solo',mala:'GUARDA 0 EN CUENTA · REPETIR 3 VECES [ AVANZA ]',buena:'CUANDO EMPIECE EL PROGRAMA · GUARDA 0 EN CUENTA · REPETIR 3 VECES [ AVANZA ]',err:'falta el EVENTO que dispara el programa'},
  {goal:'cerrar el proyecto al llegar a la meta 🏁',mala:'REPETIR 6 VECES [ SI HAY OBJETO AQUÍ → RECOGE, SINO → AVANZA ]',buena:'REPETIR 6 VECES [ SI HAY OBJETO AQUÍ → RECOGE, SINO → AVANZA ] · TERMINA',err:'falta la instrucción TERMINA al final'},
  {goal:'recoger las 4 manzanas del pasillo',mala:'REPETIR 2 VECES [ AVANZA, RECOGE ]',buena:'REPETIR 4 VECES [ AVANZA, RECOGE ]',err:'el número de vueltas del bucle es muy bajo'},
];
let ansVisible=false;
function genTask(){sfx('click');const type=document.getElementById('tgType').value;const count=parseInt(document.getElementById('tgCount').value);ansVisible=false;const out=document.getElementById('tgOut');out.innerHTML='';if(type==='ejecutar')genEjecutarTask(out,count);else if(type==='traza')genTrazaTask(out,count);else if(type==='pseudo')genPseudoTask(out,count);else if(type==='bug')genBugProyTask(out,count);fin('s-tareas');}
function _instrBlock(out,title,lines){const ib=document.createElement('div');ib.className='tg-instruction-block';ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join('');out.appendChild(ib);}
function genEjecutarTask(out,count){_instrBlock(out,'Instrucción',['Copia la cuadrícula en tu cuaderno. Ejecuta el programa vuelta por vuelta — ¡evalúa el condicional en cada paso! — y escribe la casilla donde TERMINA el robot 🤖.']);for(let i=0;i<count;i++){const t=_rndCasoProy();const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>El robot parte de ${coordName(t.sr,t.sc)} mirando al ${DIR_NOMBRE[t.dir]}.</strong><div style="margin-top:0.4rem;">${svgGridHTML({n:4,robot:{r:t.sr,c:t.sc,dir:t.dir},obst:t.obst,objs:t.objs,w:170})}</div><div class="tg-prog">${progLineas(t.prog).map((p,j)=>(j+1)+'. '+p).join('<br>')}</div><div style="margin-top:0.4rem;font-size:0.85rem;">¿En qué casilla termina? <span class="tg-blank">&nbsp;</span></div><div class="tg-answer">✅ Termina en ${coordName(t.fin.r,t.fin.c)} mirando al ${DIR_NOMBRE[t.fin.dir]} · CUENTA = ${t.fin.cuenta}</div></div>`;out.appendChild(div);}}
function genTrazaTask(out,count){_instrBlock(out,'Instrucción',['Copia cada programa en tu cuaderno y llena la TABLA DE TRAZA: escribe el valor de la variable CUENTA después de cada instrucción ejecutada. Al final escribe el VALOR FINAL de CUENTA.']);for(let i=0;i<count;i++){const t=_rndCasoProy();const filas=trazaCuenta({r:t.sr,c:t.sc,dir:t.dir},t.prog,t.map);const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>El robot parte de ${coordName(t.sr,t.sc)} mirando al ${DIR_NOMBRE[t.dir]} con CUENTA = 0.</strong><div style="margin-top:0.4rem;">${svgGridHTML({n:4,robot:{r:t.sr,c:t.sc,dir:t.dir},obst:t.obst,objs:t.objs,w:150})}</div><div class="tg-prog">${progLineas(t.prog).map((p,j)=>(j+1)+'. '+p).join('<br>')}</div><div style="margin-top:0.4rem;font-size:0.85rem;">Valor final de CUENTA: <span class="tg-blank">&nbsp;</span></div><div class="tg-answer">✅ Traza de CUENTA: ${filas.map(f=>f.val).join(' → ')} · Valor final: ${t.fin.cuenta}</div></div>`;out.appendChild(div);}}
function genPseudoTask(out,count){_instrBlock(out,'Instrucción',['Escribe el PSEUDOCÓDIGO del proyecto en tu cuaderno. Debe llevar: el evento que lo dispara, la variable en 0, el bucle con su condicional dentro y el TERMINA final.']);const pool=_shuffle([...pseudoProyDB]);for(let i=0;i<count;i++){const it=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>Proyecto: ${it.tema}.</strong><div style="margin-top:0.4rem;font-size:0.9rem;">Escribe el pseudocódigo completo: <span class="tg-blank" style="min-width:230px;">&nbsp;</span></div><div class="tg-answer">✅ ${it.plan.join('<br>✅ ')}</div></div>`;out.appendChild(div);}}
function genBugProyTask(out,count){_instrBlock(out,'Instrucción',['Cada programa tiene UN error. Escribe cuál es el bug y cómo debería quedar corregido.']);const pool=_shuffle([...bugProyDB]);for(let i=0;i<count;i++){const it=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>Meta: el programa debe ${it.goal}.</strong><div class="tg-prog">${it.mala}</div><div style="margin-top:0.4rem;font-size:0.85rem;">¿Cuál es el bug? <span class="tg-blank">&nbsp;</span></div><div class="tg-answer">✅ Bug: ${it.err}. Correcto: ${it.buena}</div></div>`;out.appendChild(div);}}
function toggleAns(){ansVisible=!ansVisible;document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none');sfx('click');}

// ===================== SOPA DE LETRAS =====================
// Generadas por script y verificadas por construcción: colineales, contiguas,
// MAYÚSCULAS sin tildes y coincidentes con su cuadrícula (ver arnés _dev).
const sopaSets=[
  {size:10,grid:[
    ['A','V','Y','E','V','E','N','T','O','Q'],
    ['P','O','A','L','B','J','C','U','E','U'],
    ['R','U','T','R','E','U','C','S','L','W'],
    ['O','R','C','C','I','L','G','N','L','J'],
    ['B','F','D','D','E','A','C','L','Y','L'],
    ['A','B','K','W','G','Y','B','U','E','D'],
    ['R','R','E','V','C','B','O','L','B','C'],
    ['M','P','M','M','Z','G','T','R','E','P'],
    ['E','A','M','A','R','G','O','R','P','M'],
    ['V','E','D','T','T','M','S','P','Y','O']
  ],words:[
    {w:'PROGRAMA',cells:[[8,8],[8,7],[8,6],[8,5],[8,4],[8,3],[8,2],[8,1]]},
    {w:'VARIABLE',cells:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8]]},
    {w:'PROYECTO',cells:[[8,8],[7,7],[6,6],[5,5],[4,4],[3,3],[2,2],[1,1]]},
    {w:'EVENTO',cells:[[0,3],[0,4],[0,5],[0,6],[0,7],[0,8]]},
    {w:'PROBAR',cells:[[1,0],[2,0],[3,0],[4,0],[5,0],[6,0]]},
    {w:'BUCLE',cells:[[6,8],[5,7],[4,6],[3,5],[2,4]]}
  ]},
  {size:10,grid:[
    ['G','X','R','G','C','O','D','I','G','O'],
    ['S','E','C','U','E','N','C','I','A','Z'],
    ['J','A','R','A','R','U','P','E','D','X'],
    ['U','Y','G','L','T','D','Q','I','G','Q'],
    ['T','K','U','R','J','Y','G','F','K','B'],
    ['G','A','L','G','O','R','I','T','M','O'],
    ['P','P','X','O','L','R','H','P','N','Q'],
    ['B','R','O','D','A','T','N','O','C','C'],
    ['Y','W','H','K','P','Y','F','E','R','A'],
    ['J','C','O','N','D','I','C','I','O','N']
  ],words:[
    {w:'ALGORITMO',cells:[[5,1],[5,2],[5,3],[5,4],[5,5],[5,6],[5,7],[5,8],[5,9]]},
    {w:'CONDICION',cells:[[9,1],[9,2],[9,3],[9,4],[9,5],[9,6],[9,7],[9,8],[9,9]]},
    {w:'SECUENCIA',cells:[[1,0],[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[1,7],[1,8]]},
    {w:'CONTADOR',cells:[[7,8],[7,7],[7,6],[7,5],[7,4],[7,3],[7,2],[7,1]]},
    {w:'DEPURAR',cells:[[2,8],[2,7],[2,6],[2,5],[2,4],[2,3],[2,2]]},
    {w:'CODIGO',cells:[[0,4],[0,5],[0,6],[0,7],[0,8],[0,9]]}
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
  {q:'Un programa completo junta secuencia, condicional, bucle y variable.',a:true},
  {q:'El evento «cuando empiece el programa» es lo que dispara el proyecto.',a:true},
  {q:'El pseudocódigo se escribe en español sencillo antes de programar.',a:true},
  {q:'Descomponer es partir un proyecto grande en partes pequeñas.',a:true},
  {q:'Un bucle sirve para repetir instrucciones sin escribirlas muchas veces.',a:true},
  {q:'El condicional hace que el programa decida entre dos caminos.',a:true},
  {q:'Una variable es una cajita con nombre que guarda un dato que puede cambiar.',a:true},
  {q:'Un contador es una variable que va sumando.',a:true},
  {q:'Depurar es buscar y corregir los errores del programa.',a:true},
  {q:'Probar el programa una sola vez siempre es suficiente.',a:false},
  {q:'Si el programa falla hay que borrar todo y empezar de cero.',a:false},
  {q:'El pseudocódigo se escribe después de terminar el programa.',a:false},
  {q:'Un evento es una orden que mueve al robot una casilla.',a:false},
  {q:'Un proyecto puede usar bucle, condicional y variable a la vez.',a:true},
  {q:'Presentar el proyecto ayuda a explicar cómo funciona y a recibir mejoras.',a:true},
];
const evalMCBank=[
  {q:'¿Qué es un programa completo?',o:['a) Una sola instrucción suelta','b) Un proyecto que junta evento, secuencia, bucle, condicional y variable','c) Un dibujo del robot','d) Un error del código'],a:1},
  {q:'¿Para qué sirve el EVENTO «cuando empiece el programa»?',o:['a) Para que el programa arranque','b) Para borrar el código','c) Para girar el robot','d) Para contar objetos'],a:0},
  {q:'¿Qué es el pseudocódigo?',o:['a) Un idioma secreto de las computadoras','b) El plan escrito en español sencillo antes de programar','c) Un error del programa','d) El nombre del robot'],a:1},
  {q:'¿Qué significa DESCOMPONER un proyecto?',o:['a) Romperlo para que no funcione','b) Partirlo en partes pequeñas y armarlo por pasos','c) Borrarlo y empezar de cero','d) Copiarlo de un compañero'],a:1},
  {q:'¿Qué pieza usas para repetir instrucciones sin escribirlas muchas veces?',o:['a) La variable','b) El evento','c) El bucle','d) El comentario'],a:2},
  {q:'¿Qué pieza usas para que el programa DECIDA según lo que ve?',o:['a) El condicional','b) El bucle','c) La variable','d) La secuencia'],a:0},
  {q:'¿Para qué sirve la variable CUENTA en el proyecto del recolector?',o:['a) Para girar','b) Para guardar cuántos objetos lleva el robot','c) Para borrar el mapa','d) Para apagar el programa'],a:1},
  {q:'Tu programa falla. ¿Qué hace un buen programador?',o:['a) Borra todo y se enoja','b) Prueba, encuentra el error, corrige UNA cosa y vuelve a probar','c) Le echa la culpa al robot','d) Deja el proyecto sin terminar'],a:1},
  {q:'¿En qué momento se escribe el pseudocódigo?',o:['a) Antes de armar el programa','b) Nunca','c) Solo cuando ya funciona perfecto','d) Después de presentarlo'],a:0},
  {q:'¿Qué es DEPURAR un programa?',o:['a) Buscar y corregir sus errores','b) Pintarlo de colores','c) Copiarlo dos veces','d) Apagar la computadora'],a:0},
  {q:'En «REPETIR 6 VECES [ SI HAY OBJETO AQUÍ → RECOGE, SINO → AVANZA ]» ¿qué piezas se usan?',o:['a) Solo un bucle','b) Solo un condicional','c) Un bucle y un condicional juntos','d) Ninguna de las dos'],a:2},
  {q:'¿Qué instrucción cierra el proyecto cuando el robot llega a la meta 🏁?',o:['a) AVANZA','b) TERMINA','c) RECOGE','d) GIRA DERECHA'],a:1},
  {q:'Un contador que empieza en 0 y suma 1 por cada objeto recogido es…',o:['a) Una variable contadora','b) Un evento','c) Un bucle','d) Una pared'],a:0},
  {q:'¿Cuál es el orden correcto para hacer un proyecto?',o:['a) Programar, después pensar','b) Entender, descomponer, escribir el pseudocódigo, programar y probar','c) Probar, borrar y rendirse','d) Copiar y no revisar'],a:1},
  {q:'Al presentar tu proyecto ante la clase conviene explicar…',o:['a) Qué hace, qué piezas usaste y cómo lo mejoraste','b) Solo el color del robot','c) Nada, se explica solo','d) Únicamente los errores de los demás'],a:0},
];
const evalCPBank=[
  {q:'Lo que hace arrancar un programa se llama ___.',a:'evento'},
  {q:'El plan del programa escrito en español sencillo se llama ___.',a:'pseudocódigo'},
  {q:'Partir un proyecto grande en partes pequeñas es ___.',a:'descomponer'},
  {q:'Para repetir instrucciones sin escribirlas muchas veces se usa un ___.',a:'bucle'},
  {q:'Para que el programa decida entre dos caminos se usa un ___.',a:'condicional'},
  {q:'La cajita con nombre que guarda un dato que cambia es una ___.',a:'variable'},
  {q:'La variable que va sumando de uno en uno es un ___.',a:'contador'},
  {q:'Buscar y corregir los errores del programa es ___.',a:'depurar'},
  {q:'Después de corregir un error siempre hay que volver a ___.',a:'probar'},
  {q:'El orden exacto en que se ejecutan las instrucciones es la ___.',a:'secuencia'},
  {q:'El plan ordenado de pasos que resuelve un problema es un ___.',a:'algoritmo'},
  {q:'La instrucción que cierra el proyecto al llegar a la meta es ___.',a:'TERMINA'},
  {q:'En el proyecto del recolector la variable CUENTA empieza valiendo ___.',a:'0'},
  {q:'Cada mejora del programa se llama una nueva ___.',a:'versión'},
  {q:'Quien piensa el plan, lo escribe, lo prueba y lo mejora es un ___.',a:'programador'},
];
const evalPRBank=[
  {term:'Programa completo',def:'Proyecto que junta todas las piezas y funciona de principio a fin'},
  {term:'Evento',def:'Lo que dispara el programa: cuando empiece o al presionar el botón'},
  {term:'Pseudocódigo',def:'El plan escrito en español sencillo antes de programar'},
  {term:'Descomponer',def:'Partir el proyecto en partes pequeñas y armarlo por pasos'},
  {term:'Secuencia',def:'El orden exacto en que se ejecutan las instrucciones'},
  {term:'Bucle',def:'REPETIR N VECES un grupo de instrucciones'},
  {term:'Condicional',def:'SI…ENTONCES…SINO: decidir entre dos caminos'},
  {term:'Variable',def:'Cajita con nombre que guarda un dato que puede cambiar'},
  {term:'Contador',def:'Variable que suma 1 cada vez que ocurre algo'},
  {term:'Depurar',def:'Buscar y corregir los errores del programa'},
  {term:'Probar y mejorar',def:'Ejecutar, ver qué falla, corregir y volver a ejecutar'},
  {term:'Algoritmo',def:'Plan ordenado de pasos que resuelve un problema'},
  {term:'TERMINA',def:'Instrucción que cierra el proyecto al llegar a la meta'},
  {term:'Versión',def:'Cada mejora del programa respecto de la anterior'},
  {term:'Programador',def:'Quien planifica, escribe, prueba y mejora el programa'},
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

function genEval(){sfx('click');_evalFormaSelector(); const _selF = document.getElementById('evalFormaSel'); if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10))); const cf = evalFormNum; const rng = _evalRng(cf); window._currentEvalForm=cf;evalFormNum = (evalFormNum % EVAL_FORMAS) + 1; _evalFormaSelector();saveProgress();document.getElementById('eval-screen-title').textContent=`🎓 Evaluación Final · Forma ${cf} · Mi Primer Programa Completo`;evalAnsVisible=false;const out=document.getElementById('evalOut');out.innerHTML='';const bar=document.createElement('div');bar.className='eval-score-bar';bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje · 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25 pts</span><span class="eval-score-pill esp-tf">V/F 25 pts</span><span class="eval-score-pill esp-mc">Selección 25 pts</span><span class="eval-score-pill esp-pr">Pareados 25 pts</span></div>`;out.appendChild(bar);const cpItems=_pickF(evalCPBank,5, rng);const s1=document.createElement('div');s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';cpItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='cp';d.dataset.evalIndex=i;const qHtml=item.q.replace('___',`<input class="eval-cp-input" type="text" data-cp="${i}" autocomplete="off">`);d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbCp${i}" aria-live="polite"></div>`;s1.appendChild(d);});out.appendChild(s1);const tfItems=_pickF(evalTFBank,5, rng);const s2=document.createElement('div');s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';tfItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='tf';d.dataset.evalIndex=i;d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="true"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="false"> Falso</label></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbTf${i}" aria-live="polite"></div>`;s2.appendChild(d);});out.appendChild(s2);const mcItems=_pickF(evalMCBank,5, rng);const s3=document.createElement('div');s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';mcItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='mc';d.dataset.evalIndex=i;const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join('');d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbMc${i}" aria-live="polite"></div>`;s3.appendChild(d);});out.appendChild(s3);const prItems=_pickF(evalPRBank,5, rng);let shuffledDefs=_shuffleF(prItems, rng);let _prTries=0;while(shuffledDefs.some((df,ix)=>df.def===prItems[ix].def)&&_prTries<40){shuffledDefs=_shuffleF(shuffledDefs, rng);_prTries++;}const letters=['A','B','C','D','E'];const s4=document.createElement('div');s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';const matchCard=document.createElement('div');matchCard.className='eval-item';let colLeft='<div class="eval-match-col"><h4>📌 Términos</h4>';prItems.forEach((item,i)=>{colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> <select class="eval-match-select" data-pr="${i}" aria-label="Respuesta pareada ${i+16}"><option value="">—</option>${letters.map(l=>`<option value="${l}">${l}</option>`).join('')}</select> ${item.term}</div>`;});colLeft+='</div>';let colRight='<div class="eval-match-col"><h4>🔑 Definiciones</h4>';shuffledDefs.forEach((item,i)=>{colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`;});colRight+='</div>';const ansKey=prItems.map((item,i)=>{const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)];return`${i+16}→${letter}`;}).join(' · ');matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div><div class="eval-item-feedback" id="evalFbPr" aria-live="polite"></div>`;s4.appendChild(matchCard);out.appendChild(s4);window._evalPrintData={tf:tfItems,mc:mcItems,cp:cpItems,pr:{terms:prItems,shuffledDefs,letters}};const autoPanel=document.createElement('div');autoPanel.id='evalAutoResult';autoPanel.className='eval-auto-result';autoPanel.innerHTML='<strong>🧮 Evaluación interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato original sin respuestas digitadas.';out.appendChild(autoPanel);fin('s-evaluacion');}
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación Mi Primer Programa Completo · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.12rem 0.4rem;margin:0.22rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #0e7490;background:#ecfeff;color:#0e7490;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#0e7490;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #0e7490;height:12px;}.obt-pct{white-space:nowrap;}.qn{font-weight:700;min-width:22px;flex-shrink:0;}.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:40px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.18rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.14rem 0.35rem;margin-bottom:0.1rem;break-inside:avoid;page-break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.3;display:flex;gap:0.28rem;margin-bottom:0.07rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.1rem 0.5rem;}.mc-opts{display:grid;grid-template-columns:repeat(2,1fr);gap:0.04rem 0.15rem;margin-left:0.8rem;}.mc-opt{font-size:9pt;display:flex;align-items:center;gap:0.15rem;}.mc-opt input{width:10px;height:10px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{margin-top:0.1rem;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.08rem 0.4rem;margin-top:0.08rem;}.pr-head{font-size:9pt;font-weight:700;color:#555;margin-bottom:0.1rem;}.pr-item{font-size:10.5pt;padding:0.1rem 0.28rem;background:#ecfeff;border-radius:3px;margin-bottom:0.07rem;display:flex;align-items:center;gap:0.2rem;line-height:1.2;break-inside:avoid;page-break-inside:avoid;}.pr-num{font-weight:700;color:#0e7490;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.22rem;padding:0.15rem 0;page-break-before:avoid;break-before:avoid;color:#0e7490;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #0e7490;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#555;}.pa{color:#007a00;font-weight:600;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Examen de Programación — Evaluación Conceptual · Mi Primer Programa Completo · Educación Básica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✅ PAUTA — Evaluación Conceptual · Mi Primer Programa Completo · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u · Programación · Educación Básica</div></div><div class="p-grid">${pR}</div>
  ${zgBlock}</div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("evalPage",252,0.55,1.45);fit("pautaPage",252,0.55,1.3);})();<\/script></body></html>`;const win=window.open('','_blank','');if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}win.document.write(doc);win.document.close();setTimeout(()=>win.print(),400);}

// ===================== PRUEBA OPERATIVA (proyecto integrador) =====================
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

// Caso determinista 4×4 con bucle 🔁 + condicional 🔀 + variable 🔢 que NO choca
function _opFallbackCaso(){
  const map={n:4,obst:[],objs:['2,0']};
  const prog=[{rep:3,body:[C_OBJ]}];
  const res=simRun({r:3,c:0,dir:'N'},prog,map);
  return{sr:3,sc:0,dir:'N',obst:[],objs:[[2,0]],obstStr:[],objsStr:['2,0'],prog,fin:res.st};
}
function _opCasoProy(o){
  o=o||{};const maxFlat=o.maxFlat||8;
  for(let intento=0;intento<1500;intento++){
    const n=4;
    const obst=[];const nOb=_opRint(0,2);
    let g0=0;
    while(obst.length<nOb&&g0<60){g0++;const r=_opRint(0,n-1),c=_opRint(0,n-1);if(!obst.some(([or,oc])=>or===r&&oc===c))obst.push([r,c]);}
    const objs=[];const nObj=_opRint(1,2);
    let g=0;
    while(objs.length<nObj&&g<80){g++;const r=_opRint(0,n-1),c=_opRint(0,n-1);if(obst.some(([or,oc])=>or===r&&oc===c))continue;if(objs.some(([or,oc])=>or===r&&oc===c))continue;objs.push([r,c]);}
    if(!objs.length)continue;
    const sr=_opRint(0,n-1),sc=_opRint(0,n-1);
    if(obst.some(([or,oc])=>or===sr&&oc===sc))continue;
    const dir=DIRS[_opRint(0,3)];
    const obstStr=obst.map(x=>x[0]+','+x[1]);
    const objsStr=objs.map(x=>x[0]+','+x[1]);
    const map={n,obst:obstStr,objs:objsStr};
    const prog=[];
    if(_opRnd()<0.4)prog.push(_opRnd()<0.6?I_AV:(_opRnd()<0.5?I_GD:I_GI));
    const rep=_opRint(2,3);
    const bodyLen=_opRint(1,2);
    const body=[];
    for(let k=0;k<bodyLen;k++){const roll=_opRnd();body.push(roll<0.5?C_OBJ:(roll<0.72?C_PARED:(roll<0.9?I_AV:I_GD)));}
    if(!body.some(esCond))body[0]=C_OBJ;
    prog.push({rep,body});
    if(countEjecutadas(prog)>maxFlat)continue;
    const res=simRun({r:sr,c:sc,dir},prog,map);
    if(!res.ok)continue;
    if(o.needCuenta&&res.st.cuenta<1)continue;
    if(!o.needCuenta&&res.st.r===sr&&res.st.c===sc)continue;
    return{sr,sc,dir,obst,objs,obstStr,objsStr,prog,fin:res.st};
  }
  return _opFallbackCaso();
}

// I. Ejecuta el programa (5 × 4 = 20 pts): ¿en qué casilla TERMINA el robot?
function genEjecutaItems(){
  const items=[];
  for(let i=0;i<5;i++){
    const t=_opCasoProy({maxFlat:8});
    const ans=coordName(t.fin.r,t.fin.c);
    const set=[ans];
    let guard=0;
    while(set.length<4&&guard<200){guard++;const cand=coordName(_opRint(0,3),_opRint(0,3));if(set.indexOf(cand)<0)set.push(cand);}
    const opts=_shuffleF(set,_opRnd);
    items.push({sr:t.sr,sc:t.sc,dir:t.dir,obst:t.obst,objs:t.objs,obstStr:t.obstStr,objsStr:t.objsStr,prog:t.prog,ans,opts,cuenta:t.fin.cuenta});
  }
  return items;
}

// II. Completa la instrucción que falta (5 × 4 = 20 pts)
const OP_COMPLETA_BANK=[
  {txt:'Al proyecto le falta el disparador que lo hace arrancar.',prog:'___ · GUARDA 0 EN CUENTA · REPETIR 6 VECES [ … ] · TERMINA',opts:['CUANDO EMPIECE EL PROGRAMA','GIRA DERECHA','AVANZA','RECOGE'],ans:0},
  {txt:'El contador debe empezar en cero antes del bucle.',prog:'CUANDO EMPIECE EL PROGRAMA · ___ · REPETIR 6 VECES [ … ] · TERMINA',opts:['GUARDA 0 EN CUENTA','AVANZA','TERMINA','GIRA IZQUIERDA'],ans:0},
  {txt:'El robot debe repetir 6 veces el mismo bloque sin escribirlo 6 veces.',prog:'___ [ SI HAY OBJETO AQUÍ → RECOGE, SINO → AVANZA ]',opts:['REPETIR 6 VECES','GIRA DERECHA','TERMINA','MUESTRA CUENTA'],ans:0},
  {txt:'Dentro del bucle el robot debe DECIDIR si recoge o si avanza.',prog:'REPETIR 6 VECES [ ___ ]',opts:['SI HAY OBJETO AQUÍ → RECOGE, SINO → AVANZA','AVANZA, AVANZA, AVANZA','TERMINA','GUARDA 0 EN CUENTA'],ans:0},
  {txt:'El robot debe girar cuando el sensor detecta una pared 🌳.',prog:'REPETIR 8 VECES [ SI HAY PARED ADELANTE → ___, SINO → AVANZA ]',opts:['GIRA DERECHA','AVANZA','RECOGE','TERMINA'],ans:0},
  {txt:'Falta cerrar el proyecto cuando el robot llega a la meta 🏁.',prog:'REPETIR 6 VECES [ SI HAY OBJETO AQUÍ → RECOGE, SINO → AVANZA ] · ___',opts:['TERMINA','REPETIR 2 VECES','GUARDA 0 EN CUENTA','GIRA IZQUIERDA'],ans:0},
  {txt:'Cada vez que el robot recoge un objeto, el contador debe crecer.',prog:'SI HAY OBJETO AQUÍ → RECOGE y ___, SINO → AVANZA',opts:['SUMA 1 A CUENTA','RESTA 5 A CUENTA','GUARDA 0 EN CUENTA','TERMINA'],ans:0},
  {txt:'Al final el proyecto debe mostrar cuántos objetos recogió.',prog:'REPETIR 6 VECES [ … ] · ___ · TERMINA',opts:['MUESTRA CUENTA','GIRA DERECHA','AVANZA','REPETIR 3 VECES'],ans:0},
];
function genCompletaItems(){
  return _pickF(OP_COMPLETA_BANK,5,_opRnd).map(t=>{
    const correct=t.opts[t.ans];
    const shuffled=_shuffleF(t.opts,_opRnd);
    return {txt:t.txt,prog:t.prog,opts:shuffled,ans:shuffled.indexOf(correct)};
  });
}

// III. Tabla de traza de la variable (5 × 2 = 10 pts): valor final de CUENTA
function genTrazaItems(){
  const items=[];
  for(let i=0;i<5;i++){
    const t=_opCasoProy({maxFlat:7,needCuenta:true});
    const filas=trazaCuenta({r:t.sr,c:t.sc,dir:t.dir},t.prog,{n:4,obst:t.obstStr,objs:t.objsStr});
    items.push({sr:t.sr,sc:t.sc,dir:t.dir,obst:t.obst,objs:t.objs,obstStr:t.obstStr,objsStr:t.objsStr,prog:t.prog,filas,ans:t.fin.cuenta});
  }
  return items;
}

// IV. Encuentra y corrige el error (2 × 10 = 20 pts)
const OP_BUG_BANK=[
  {goal:'contar los objetos 🍎 que recoge el robot',lines:['CUANDO EMPIECE EL PROGRAMA','REPETIR 4 VECES [ AVANZA, RECOGE ]','MUESTRA CUENTA','TERMINA'],linea:2,correcta:'GUARDA 0 EN CUENTA antes del bucle'},
  {goal:'repetir cinco veces el patrón AVANZA, RECOGE',lines:['CUANDO EMPIECE EL PROGRAMA','REPETIR 5 VECES AVANZA, RECOGE','TERMINA'],linea:2,correcta:'REPETIR 5 VECES [ AVANZA, RECOGE ]'},
  {goal:'girar cuando el sensor detecta una pared 🌳',lines:['CUANDO EMPIECE EL PROGRAMA','REPETIR 8 VECES [ SI HAY PARED ADELANTE → AVANZA, SINO → GIRA DERECHA ]','TERMINA'],linea:2,correcta:'REPETIR 8 VECES [ SI HAY PARED ADELANTE → GIRA DERECHA, SINO → AVANZA ]'},
  {goal:'arrancar solo cuando se dispare el evento',lines:['GUARDA 0 EN CUENTA','REPETIR 3 VECES [ AVANZA, RECOGE ]','TERMINA'],linea:1,correcta:'CUANDO EMPIECE EL PROGRAMA antes de todo'},
  {goal:'cerrar el proyecto al llegar a la meta 🏁',lines:['CUANDO EMPIECE EL PROGRAMA','GUARDA 0 EN CUENTA','REPETIR 6 VECES [ SI HAY OBJETO AQUÍ → RECOGE, SINO → AVANZA ]'],linea:3,correcta:'agregar TERMINA como última línea'},
  {goal:'recoger las 4 manzanas del pasillo',lines:['CUANDO EMPIECE EL PROGRAMA','GUARDA 0 EN CUENTA','REPETIR 2 VECES [ AVANZA, RECOGE ]','TERMINA'],linea:3,correcta:'REPETIR 4 VECES [ AVANZA, RECOGE ]'},
];
function genBugItems(){
  return _pickF(OP_BUG_BANK,2,_opRnd).map(b=>{
    const fixOpts=_shuffleF([b.correcta,b.lines[b.linea-1],'AVANZA, AVANZA, AVANZA'],_opRnd);
    return{goal:b.goal,lines:b.lines,linea:b.linea,correcta:b.correcta,fixOpts};
  });
}

// V. Escribe el pseudocódigo del proyecto (2 × 15 = 30 pts)
const OP_PSEUDO_BANK=[
  {tema:'El recolector del patio: recoger todas las manzanas 🍎 y contarlas',
   plan:['CUANDO EMPIECE EL PROGRAMA','GUARDA 0 EN CUENTA','REPETIR 8 VECES [ SI HAY OBJETO AQUÍ → RECOGE (SUMA 1 A CUENTA), SINO → AVANZA ]','MUESTRA CUENTA','TERMINA']},
  {tema:'El barredor del aula: avanzar y girar cuando topa con la pared 🌳',
   plan:['CUANDO EMPIECE EL PROGRAMA','GUARDA 0 EN VUELTAS','REPETIR 10 VECES [ SI HAY PARED ADELANTE → GIRA DERECHA (SUMA 1 A VUELTAS), SINO → AVANZA ]','MUESTRA VUELTAS','TERMINA']},
  {tema:'El contador de asistencia: contar los alumnos presentes 📋',
   plan:['CUANDO EMPIECE EL PROGRAMA','GUARDA 0 EN PRESENTES','REPETIR 25 VECES [ SI EL ALUMNO RESPONDIÓ → SUMA 1 A PRESENTES, SINO → LO MARCO AUSENTE ]','MUESTRA PRESENTES','TERMINA']},
  {tema:'El regador de la milpa 🌽: regar solo los surcos secos',
   plan:['CUANDO EMPIECE EL PROGRAMA','GUARDA 0 EN REGADOS','REPETIR 5 VECES [ SI LA TIERRA ESTÁ SECA → RIEGO (SUMA 1 A REGADOS), SINO → PASO AL SIGUIENTE SURCO ]','MUESTRA REGADOS','TERMINA']},
  {tema:'El repartidor de refrigerios 🍞: entregar 20 y avisar cuando se acaben',
   plan:['CUANDO EMPIECE EL PROGRAMA','GUARDA 20 EN QUEDAN','REPETIR 20 VECES [ SI QUEDAN ES MAYOR QUE 0 → ENTREGO UNO (RESTA 1 A QUEDAN), SINO → AVISO QUE SE ACABARON ]','MUESTRA QUEDAN','TERMINA']},
  {tema:'El vigilante del portón: abrir solo si alguien toca el timbre 🔔',
   plan:['CUANDO SE PRESIONE EL BOTÓN','GUARDA 0 EN VISITAS','REPETIR 12 VECES [ SI SUENA EL TIMBRE → ABRO EL PORTÓN (SUMA 1 A VISITAS), SINO → ESPERO ]','MUESTRA VISITAS','TERMINA']},
];
const OP_PSEUDO_RUBRICA='Evento inicial que dispara el programa (3 pts) · Variable puesta en 0 antes de empezar (4 pts) · Bucle REPETIR con su cuerpo entre [ ] (4 pts) · Condicional SI…ENTONCES…SINO dentro del bucle (4 pts)';
function genPseudoItems(){return _pickF(OP_PSEUDO_BANK,2,_opRnd);}

function genEvalOp() {
  sfx('click');
  _injectFormaSel('genEvalOp', 'evalOpFormaSel', evalOpFormNum, function (v) { evalOpFormNum = v; });
  const _sO = document.getElementById('evalOpFormaSel');
  if (_sO && parseInt(_sO.value, 10)) evalOpFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sO.value, 10)));
  const cf = evalOpFormNum; window._currentEvalOpForm = cf; _opRnd = _evalRng(100000 + cf); /* la Forma cf siembra TODO el azar de esta prueba */
  evalOpFormNum = (evalOpFormNum % EVAL_FORMAS) + 1;
  _injectFormaSel('genEvalOp', 'evalOpFormaSel', evalOpFormNum, function (v) { evalOpFormNum = v; });
  saveProgress();
  document.getElementById('evalop-screen-title').textContent = `🚀 Prueba Operativa — Forma ${cf} · Mi Primer Programa Completo`;
  evalOpAnsVisible = false;
  const out = document.getElementById('evalOpOut'); out.innerHTML = '';

  const ejeItems = genEjecutaItems();
  const cplItems = genCompletaItems();
  const tzItems = genTrazaItems();
  const bugItems = genBugItems();
  const psItems = genPseudoItems();

  const s1 = document.createElement('div');
  s1.innerHTML = `<div class="eval-section-title">I. Ejecuta el programa <span class="eval-pts">20 pts · 4 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel básico. Ejecuta el programa vuelta por vuelta — ¡evalúa el condicional en cada paso! — y marca la casilla donde TERMINA el robot 🤖.</p>`;
  ejeItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    const optsHtml = it.opts.map(op => `<label class="eval-mc-opt"><input type="radio" name="opE${i}" value="${op}"> ${op}</label>`).join('');
    d.innerHTML = `<div class="eval-q"><span class="eval-num">${i + 1}</span><span class="eval-q-text">El robot parte de <strong>${coordName(it.sr, it.sc)}</strong> mirando al <strong>${DIR_NOMBRE[it.dir]}</strong> con <strong>CUENTA = 0</strong>.</span></div><div class="op-grid-wrap">${svgGridHTML({ n: 4, robot: { r: it.sr, c: it.sc, dir: it.dir }, obst: it.obst, objs: it.objs, w: 160 })}</div><div class="evt-header">⚡ ${EVENTO_TXT}</div><div class="op-prog">${progLineas(it.prog).map((p, j) => (j + 1) + '. ' + p).join('<br>')}</div><div class="eval-mc-opts" style="flex-direction:row;flex-wrap:wrap;gap:0.8rem;">${optsHtml}</div><div class="eval-answer">${it.ans} (CUENTA = ${it.cuenta})</div><div class="eval-item-feedback" id="evalFbEje${i}" aria-live="polite"></div>`;
    s1.appendChild(d);
  });
  out.appendChild(s1);

  const s2 = document.createElement('div');
  s2.innerHTML = `<div class="eval-section-title">II. Completa la instrucción que falta <span class="eval-pts">20 pts · 4 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel intermedio. Al programa le falta UNA pieza (el espacio ___). Elige la opción correcta.</p>`;
  cplItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    const optsHtml = it.opts.map((op, oi) => `<label class="eval-mc-opt"><input type="radio" name="opC${i}" value="${oi}"> ${'abcd'[oi]}) ${op}</label>`).join('');
    d.innerHTML = `<div class="eval-q"><span class="eval-num">${i + 1}</span><span class="eval-q-text">${it.txt}</span></div><div class="op-prog">${it.prog}</div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${'abcd'[it.ans]}) ${it.opts[it.ans]}</div><div class="eval-item-feedback" id="evalFbCpl${i}" aria-live="polite"></div>`;
    s2.appendChild(d);
  });
  out.appendChild(s2);

  const s3 = document.createElement('div');
  s3.innerHTML = `<div class="eval-section-title">III. Tabla de traza de la variable <span class="eval-pts">10 pts · 2 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Traza la variable <strong>CUENTA</strong> instrucción por instrucción y escribe su VALOR FINAL.</p>`;
  tzItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    const filasHtml = it.filas.map((f, j) => `<tr><td>${j + 1}. ${f.txt}${f.de ? ' <span class="w-prog-loop">(vuelta ' + f.v + ' de ' + f.de + ')</span>' : ''}</td><td class="tzv">&nbsp;</td></tr>`).join('');
    d.innerHTML = `<div class="eval-q"><span class="eval-num">${i + 1}</span><span class="eval-q-text">El robot sale de <strong>${coordName(it.sr, it.sc)}</strong> mirando al <strong>${DIR_NOMBRE[it.dir]}</strong> con <strong>CUENTA = 0</strong>.</span></div><div class="op-grid-wrap">${svgGridHTML({ n: 4, robot: { r: it.sr, c: it.sc, dir: it.dir }, obst: it.obst, objs: it.objs, w: 140 })}</div><div class="op-prog">${progLineas(it.prog).map((p, j) => (j + 1) + '. ' + p).join('<br>')}</div><table class="tz-screen"><tr><th>Instrucción ejecutada</th><th>CUENTA</th></tr><tr><td>Antes de empezar</td><td class="tzv">0</td></tr>${filasHtml}</table><div class="opx-row" style="margin-left:1.7rem;"><span style="font-size:0.82rem;color:var(--gray);">Valor final de CUENTA:</span><input class="eval-cp-input" type="text" data-tz="${i}" autocomplete="off" inputmode="numeric" style="min-width:70px;max-width:90px;"></div><div class="eval-answer">CUENTA = ${it.ans} (traza: 0 → ${it.filas.map(f => f.val).join(' → ')})</div><div class="eval-item-feedback" id="evalFbTz${i}" aria-live="polite"></div>`;
    s3.appendChild(d);
  });
  out.appendChild(s3);

  const s4 = document.createElement('div');
  s4.innerHTML = `<div class="eval-section-title">IV. Encuentra y corrige el error <span class="eval-pts">20 pts · 10 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Depuración. Escribe el número de la línea errada (5 pts) y elige la corrección (5 pts).</p>`;
  bugItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    const selHtml = `<select class="eval-match-select" data-bi="${i}" aria-label="Corrección del programa ${i + 1}"><option value="">—</option>${it.fixOpts.map(op => `<option value="${op}">${op}</option>`).join('')}</select>`;
    d.innerHTML = `<div class="eval-q"><span class="eval-num">${i + 1}</span><span class="eval-q-text">🔎 Este programa debería <strong>${it.goal}</strong>, pero tiene UN bug.</span></div><div class="op-prog">${it.lines.map((p, j) => 'Línea ' + (j + 1) + ': ' + p).join('<br>')}</div><div class="opx-row" style="margin-left:1.7rem;flex-wrap:wrap;"><span style="font-size:0.82rem;color:var(--gray);">Línea errada (5 pts):</span><input class="eval-cp-input" type="text" data-bl="${i}" autocomplete="off" inputmode="numeric" style="min-width:56px;max-width:70px;"><span style="font-size:0.82rem;color:var(--gray);">Debe decir (5 pts):</span>${selHtml}</div><div class="eval-answer">Línea ${it.linea} → ${it.correcta}</div><div class="eval-item-feedback" id="evalFbBug${i}" aria-live="polite"></div>`;
    s4.appendChild(d);
  });
  out.appendChild(s4);

  const s5 = document.createElement('div');
  s5.innerHTML = `<div class="eval-section-title">V. Escribe el pseudocódigo del proyecto <span class="eval-pts">30 pts · 15 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel avanzado. Escribe el pseudocódigo COMPLETO: <strong>evento</strong> ⚡, <strong>variable en 0</strong> 🔢, <strong>bucle</strong> 🔁 con su <strong>condicional</strong> 🔀 dentro y <strong>TERMINA</strong>. Compara con la pauta y anota tu puntaje de 0 a 15.</p>`;
  psItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="eval-q"><span class="eval-num">${i + 1}</span><span class="eval-q-text">Escribe el pseudocódigo de: <strong>${it.tema}</strong>.</span></div><textarea class="op-vida-ta" aria-label="Pseudocódigo de ${it.tema}" placeholder="CUANDO EMPIECE EL PROGRAMA&#10;GUARDA 0 EN …&#10;REPETIR … VECES [ SI … → …, SINO → … ]&#10;MUESTRA …&#10;TERMINA"></textarea><div class="op-pauta-rub"><strong>Pauta:</strong> ${it.plan.join(' · ')}<br><strong>Rúbrica (15 pts):</strong> ${OP_PSEUDO_RUBRICA}</div><div class="op-vida-score"><label for="opPseudo${i}">Compara con la pauta y anota tu puntaje:</label><input type="number" id="opPseudo${i}" data-ps="${i}" min="0" max="15" value="0"> <span>de 15 pts</span></div><div class="eval-item-feedback" id="evalFbPs${i}" aria-live="polite"></div>`;
    s5.appendChild(d);
  });
  out.appendChild(s5);

  window._evalOpData = { ejeItems, cplItems, tzItems, bugItems, psItems };
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
  let total = 0; const det = { eje: 0, cpl: 0, tz: 0, bug: 0, ps: 0 };
  d.ejeItems.forEach((it, i) => { const sel = document.querySelector(`input[name="opE${i}"]:checked`); const ok = !!sel && sel.value === it.ans; if (ok) { det.eje += 4; total += 4; } setEvalFeedback('evalFbEje' + i, ok, ok ? 'Correcto. +4 pts' : 'Revisar. El robot termina en ' + it.ans); });
  d.cplItems.forEach((it, i) => { const sel = document.querySelector(`input[name="opC${i}"]:checked`); const ok = !!sel && Number(sel.value) === it.ans; if (ok) { det.cpl += 4; total += 4; } setEvalFeedback('evalFbCpl' + i, ok, ok ? 'Correcto. +4 pts' : 'Revisar. Faltaba: ' + it.opts[it.ans]); });
  d.tzItems.forEach((it, i) => { const el = document.querySelector(`[data-tz="${i}"]`); const ok = _isOpNumOk(el ? el.value : '', it.ans); if (el) { el.classList.toggle('eval-input-ok', ok); el.classList.toggle('eval-input-no', !ok); } if (ok) { det.tz += 2; total += 2; } setEvalFeedback('evalFbTz' + i, ok, ok ? 'Correcto. +2 pts' : 'Revisar. CUENTA termina en ' + it.ans); });
  d.bugItems.forEach((it, i) => {
    const elL = document.querySelector(`[data-bl="${i}"]`); const okL = _isOpNumOk(elL ? elL.value : '', it.linea);
    if (elL) { elL.classList.toggle('eval-input-ok', okL); elL.classList.toggle('eval-input-no', !okL); }
    const elI = document.querySelector(`[data-bi="${i}"]`); const okI = !!elI && elI.value === it.correcta;
    if (elI) { elI.classList.toggle('eval-input-ok', okI); elI.classList.toggle('eval-input-no', !okI); }
    if (okL) { det.bug += 5; total += 5; } if (okI) { det.bug += 5; total += 5; }
    setEvalFeedback('evalFbBug' + i, okL && okI, (okL && okI) ? '¡Bug atrapado y corregido! +10 pts' : 'Revisar. Línea ' + it.linea + ' → ' + it.correcta);
  });
  d.psItems.forEach((it, i) => { const inp = document.querySelector(`[data-ps="${i}"]`); let v = inp ? (parseInt(inp.value) || 0) : 0; v = Math.max(0, Math.min(15, v)); if (inp) inp.value = v; det.ps += v; total += v; setEvalFeedback('evalFbPs' + i, v >= 11, 'Puntaje autoevaluado: ' + v + '/15 (compara siempre con la pauta)'); });
  const res = document.getElementById('evalOpAutoResult');
  const desglose = `Ejecuta: ${det.eje}/20 · Completa: ${det.cpl}/20 · Traza: ${det.tz}/10 · Depuración: ${det.bug}/20 · Pseudocódigo: ${det.ps}/30`;
  if (res) { res.className = 'eval-auto-result ' + (total >= 70 ? 'eval-auto-pass' : 'eval-auto-risk'); res.innerHTML = `<strong>Resultado: ${total}/100 pts</strong><br><span>${desglose}</span>`; }
  if (total >= 70) { pts(8); showToast('🎯 Prueba operativa calificada: ' + total + '/100'); }
  else showToast('🧮 Prueba operativa: ' + total + '/100. Revisa los ítems marcados.');
}

// Tabla de traza impresa: una fila por instrucción ejecutada y celda en blanco para el valor;
// el «Antes de empezar» lleva el 0 y las filas sin dato usan «•» (normativa de impresión).
function _tzTablaHTML(it){
  let rows=`<tr><td class="tz-i">Antes de empezar</td><td class="tz-v">0</td></tr>`;
  it.filas.forEach((f,j)=>{rows+=`<tr><td class="tz-i">${j+1}. ${f.txt}${f.de?' (vuelta '+f.v+'/'+f.de+')':''}</td><td class="tz-v">&nbsp;</td></tr>`;});
  rows+=`<tr><td class="tz-i tz-fin">VALOR FINAL de CUENTA</td><td class="tz-v tz-fin">&nbsp;</td></tr>`;
  return `<table class="tz-tbl"><tr><th>Instrucción ejecutada</th><th>CUENTA</th></tr>${rows}</table>`;
}

function printEvalOp() {
  if (!window._evalOpData) { showToast('⚠️ Genera una prueba operativa primero'); return; }
  sfx('click');
  const forma = window._currentEvalOpForm || 1; const d = window._evalOpData;

  // ── I. Ejecuta el programa (cuadrículas SVG deterministas; casillas vacías con «•»)
  let s1 = `<div class="sec-title"><span>I. Ejecuta el programa</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Nivel básico. Ejecuta el programa vuelta por vuelta evaluando el condicional en cada paso y ESCRIBE la casilla donde termina el robot (tipo B3, letra de columna + número de fila). 4 pts c/u.</p><div class="ej-grid">`;
  d.ejeItems.forEach((it, i) => {
    s1 += `<div class="ej-box"><div class="ej-head">${i + 1}. Sale de ${coordName(it.sr, it.sc)} mirando al ${DIR_NOMBRE[it.dir]} · CUENTA = 0</div><div class="ej-svg">${svgGridHTML({ n: 4, robot: { r: it.sr, c: it.sc, dir: it.dir }, obst: it.obst, objs: it.objs, w: 118 })}</div><div class="ej-evt">⚡ ${EVENTO_TXT}</div><div class="ej-prog">${progLineas(it.prog).map((p, j) => (j + 1) + '. ' + p).join('<br>')}</div><div class="ej-resp">Termina en: <span class="opx-mini-blank">&nbsp;</span></div></div>`;
  });
  s1 += '</div>';

  // ── II. Completa la instrucción que falta
  let s2 = `<div class="sec-title"><span>II. Completa la instrucción que falta</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Nivel intermedio. Al programa le falta UNA pieza (el espacio ___). Escribe la letra de la opción correcta. 4 pts c/u.</p>`;
  d.cplItems.forEach((it, i) => { const opsTxt = it.opts.map((op, oi) => `${'abcd'[oi]}) ${op}`).join(' · '); s2 += `<div class="opx-print-row" style="align-items:flex-start;"><span class="qn">${i + 1}.</span><span style="flex:1;line-height:1.35;">${it.txt}<br><span class="mono">${it.prog}</span><br>${opsTxt} &nbsp; Letra: <span class="opx-mini-blank" style="min-width:34px;">&nbsp;</span></span></div>`; });

  // ── III. Tabla de traza de la variable
  let s3 = `<div class="sec-title"><span>III. Tabla de traza de la variable</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10 pts</span></div></div><p class="opx-instr">Llena la tabla: escribe el valor de CUENTA después de cada instrucción ejecutada y el VALOR FINAL. 2 pts c/u (vale el valor final).</p><div class="tz-grid">`;
  d.tzItems.forEach((it, i) => {
    s3 += `<div class="ej-box"><div class="ej-head">${i + 1}. Sale de ${coordName(it.sr, it.sc)} al ${DIR_NOMBRE[it.dir]}</div><div class="ej-svg">${svgGridHTML({ n: 4, robot: { r: it.sr, c: it.sc, dir: it.dir }, obst: it.obst, objs: it.objs, w: 96 })}</div>${_tzTablaHTML(it)}</div>`;
  });
  s3 += '</div>';

  // ── IV. Encuentra y corrige el error
  let s4 = `<div class="sec-title"><span>IV. Encuentra y corrige el error</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Depuración. Escribe el número de la línea errada (5 pts) y cómo debe decir (5 pts).</p><div class="ord-print-grid">`;
  d.bugItems.forEach((it, i) => {
    s4 += `<div class="ord-print-box"><div class="ord-print-dir">${i + 1}. 🐛 El programa debería ${it.goal} · 10 pts:</div><div style="font-size:9pt;line-height:1.35;"><span class="mono">${it.lines.map((p, j) => 'Línea ' + (j + 1) + ': ' + p).join('<br>')}</span></div><div style="margin-top:0.3rem;font-size:9pt;">Línea errada: <span class="opx-mini-blank" style="min-width:34px;">&nbsp;</span> · Debe decir: <span class="opx-mini-blank" style="min-width:150px;">&nbsp;</span></div></div>`;
  });
  s4 += '</div>';

  // ── V. Escribe el pseudocódigo del proyecto
  let s5 = `<div class="sec-title"><span>V. Escribe el pseudocódigo del proyecto</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 30 pts</span></div></div><p class="opx-instr">Nivel avanzado. Escribe el pseudocódigo COMPLETO: evento ⚡, variable en 0 🔢, bucle 🔁 con su condicional 🔀 dentro y TERMINA. 15 pts c/u.</p>`;
  d.psItems.forEach((it, i) => { s5 += `<div class="opx-print-row" style="align-items:flex-start;"><span class="qn">${i + 1}.</span><span style="flex:1;line-height:1.4;">Proyecto: <strong>${it.tema}</strong><br><span class="ln-vida"></span><span class="ln-vida"></span><span class="ln-vida"></span><span class="ln-vida"></span><span class="ln-vida"></span></span></div>`; });

  // ── Pauta del docente
  let pR = '';
  pR += `<div class="p-sec"><div class="p-ttl">I. Ejecuta el programa</div><table class="p-tbl">${d.ejeItems.map((it, i) => `<tr><td class="pn">${i + 1}.</td><td class="pa">Termina en ${it.ans} (CUENTA = ${it.cuenta})</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">II. Completa la instrucción</div><table class="p-tbl">${d.cplItems.map((it, i) => `<tr><td class="pn">${i + 1}.</td><td class="pa">${'abcd'[it.ans]}) ${it.opts[it.ans]}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">III. Traza de CUENTA</div><table class="p-tbl">${d.tzItems.map((it, i) => `<tr><td class="pn">${i + 1}.</td><td class="pa">CUENTA = ${it.ans} (0 → ${it.filas.map(f => f.val).join(' → ')})</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">IV. Encuentra y corrige</div><table class="p-tbl">${d.bugItems.map((it, i) => `<tr><td class="pn">${i + 1}.</td><td class="pa">Línea ${it.linea} → ${it.correcta}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec" style="grid-column:1/-1;"><div class="p-ttl">V. Pseudocódigo (rúbrica 15 pts c/u)</div>${d.psItems.map((it, i) => `<div class="p-ord-line"><strong>${i + 1}. ${it.tema}:</strong> ${it.plan.join(' · ')}</div>`).join('')}<div class="p-rub">Rúbrica: ${OP_PSEUDO_RUBRICA}. Acepte redacciones distintas si el pseudocódigo lleva evento, variable inicializada, bucle con cuerpo y condicional con sus dos ramas.</div></div>`;

  const doc = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Prueba Operativa Mi Primer Programa Completo · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11.5pt;color:#111;background:#fff;padding:4mm 6mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.5rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;color:#0e7490;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:#0e7490;margin-top:0.15rem;font-weight:700;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.5rem 0 0.22rem;border-left:4px solid #0e7490;background:#ecfeff;display:flex;justify-content:space-between;align-items:center;color:#0e7490;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:#0e7490;font-weight:700;font-style:italic;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #0e7490;height:12px;}.qn{font-weight:700;min-width:20px;display:inline-block;color:#0e7490;}.opx-instr{font-size:9pt;color:#555;margin-bottom:0.25rem;}.opx-print-row{display:flex;align-items:baseline;gap:0.4rem;font-size:10.5pt;padding:0.22rem 0.2rem;border-bottom:1px dotted #ddd;}.opx-mini-blank{display:inline-block;min-width:60px;border-bottom:1.5px solid #111;}.mono{font-family:'Courier New',monospace;font-weight:700;font-size:9.5pt;}.ej-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0.35rem 0.5rem;margin-top:0.2rem;}.tz-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0.35rem 0.5rem;margin-top:0.2rem;}.ej-box{border:1px solid #bbb;border-radius:4px;padding:0.25rem 0.35rem;break-inside:avoid;page-break-inside:avoid;}.ej-head{font-size:8.5pt;font-weight:700;color:#0e7490;margin-bottom:0.15rem;}.ej-svg{text-align:center;}.ej-evt{font-size:7.5pt;font-weight:700;color:#b45309;background:#fef3c7;border-radius:3px;padding:1px 4px;margin-top:0.15rem;display:inline-block;-webkit-print-color-adjust:exact;print-color-adjust:exact;}.ej-prog{font-family:'Courier New',monospace;font-size:8pt;font-weight:700;line-height:1.3;margin-top:0.15rem;}.ej-resp{font-size:9pt;margin-top:0.2rem;}.tz-tbl{width:100%;border-collapse:collapse;font-size:8.5pt;margin-top:0.1rem;}.tz-tbl th{background:#ecfeff;color:#0e7490;border:1px solid #a5f3fc;padding:2px 4px;text-align:left;font-size:8pt;-webkit-print-color-adjust:exact;print-color-adjust:exact;}.tz-tbl td{border:1px solid #ccc;padding:2px 4px;}.tz-i{font-family:'Courier New',monospace;font-weight:700;font-size:7.5pt;}.tz-v{width:30%;text-align:center;color:#0e7490;font-weight:700;}.tz-fin{background:#ecfeff;font-weight:700;-webkit-print-color-adjust:exact;print-color-adjust:exact;}.ln-vida{display:block;border-bottom:1px solid #111;min-height:13px;margin-top:7px;}.ord-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.8rem;margin-top:0.2rem;}.ord-print-box{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.4rem;break-inside:avoid;}.ord-print-dir{font-size:9pt;font-weight:700;color:#0e7490;margin-bottom:0.2rem;}.total-row{display:flex;align-items:baseline;justify-content:flex-end;gap:7px;font-size:11pt;color:#0e7490;font-weight:700;font-style:italic;margin-top:0.5rem;padding:0.2rem 0.5rem;background:#ecfeff;border-radius:4px;}.total-row .obt-line{min-width:80px;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #0e7490;padding-bottom:0.35rem;margin-bottom:0.5rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;color:#0e7490;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #a5f3fc;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;color:#0e7490;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#0e7490;}.pa{color:#007a00;font-weight:600;}.p-ord-line{font-size:10.5pt;margin-bottom:0.2rem;color:#007a00;}.p-rub{font-size:9.5pt;color:#555;margin-top:0.2rem;border-top:1px dotted #ddd;padding-top:0.2rem;}.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Examen de Programación — Prueba Operativa · Mi Primer Programa Completo · Educación Básica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 pts · I: 20 · II: 20 · III: 10 · IV: 20 · V: 30 · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✔ PAUTA — Prueba Operativa · Mi Primer Programa Completo · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">100 pts · I: 5×4 · II: 5×4 · III: 5×2 · IV: 2×10 · V: 2×15 · Programación · Educación Básica</div></div><div class="p-grid">${pR}</div></div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("evalPage",250,0.5,1.2);fit("pautaPage",250,0.55,1.2);})();<\/script></body></html>`;
  const win = window.open('', '_blank', '');
  if (!win) { showToast('⚠️ Activa las ventanas emergentes para imprimir'); return; }
  win.document.write(doc); win.document.close(); setTimeout(() => win.print(), 400);
}

// ===================== LAB: EL SIMULADOR DEL PROYECTO =====================
// 6 niveles progresivos en un patio 5×5. 🌳 = pared (no se pisa) · 🍎 = objeto que se RECOGE
// (suma 1 a la variable CUENTA) · 🏁 = meta. Se gana cuando el programa ejecuta TERMINA
// estando sobre la meta y con TODOS los objetos recogidos.
// Cada nivel trae una solución de referencia (sol) y todos son resolubles por solveSim (arnés _dev).
const parteData={
  n1:{nombre:'Nivel 1 · El evento y la secuencia',icon:'1️⃣',n:5,start:{r:4,c:0,dir:'N'},dest:[0,0],
      obst:[],objs:[],deco:{'0,4':'🏫','4,4':'🏪'},
      meta:'Repaso de la etapa 2: la SECUENCIA. Lleva al robot desde A5 hasta la meta 🏁 de A1 y cierra el programa con TERMINA. Recuerda: todo arranca con el evento ⚡ «cuando empiece el programa».',
      sol:[I_AV,I_AV,I_AV,I_AV,I_TM],xpn:5},
  n2:{nombre:'Nivel 2 · El bucle 🔁',icon:'2️⃣',n:5,start:{r:4,c:0,dir:'E'},dest:[4,4],
      obst:[],objs:[],deco:{'0,0':'⛪','0,4':'🏫'},
      meta:'Repaso de la etapa 4: el BUCLE. Llega desde A5 hasta la meta 🏁 de E5… pero escribiendo MENOS instrucciones: abre 🔁 REPETIR, mete AVANZA en el cuerpo y ciérralo con ].',
      sol:[{rep:4,body:[I_AV]},I_TM],xpn:5},
  n3:{nombre:'Nivel 3 · El condicional 🔀',icon:'3️⃣',n:5,start:{r:4,c:2,dir:'N'},dest:[0,2],
      obst:[[2,2]],objs:[],deco:{'0,0':'🏫','4,4':'🏪'},
      meta:'Repaso de la etapa 3: el CONDICIONAL. Un árbol 🌳 en C3 bloquea la subida directa hacia la meta 🏁 de C1. Usa «SI HAY PARED ADELANTE → GIRA DERECHA, SINO → AVANZA» para rodearlo.',
      sol:null,xpn:6},
  n4:{nombre:'Nivel 4 · La variable 🔢',icon:'4️⃣',n:5,start:{r:4,c:0,dir:'N'},dest:[0,0],
      obst:[],objs:[[3,0],[1,0]],deco:{'0,4':'🏫','4,4':'🏪'},
      meta:'Repaso de la etapa 5: la VARIABLE. Recoge las 2 manzanas 🍎 de la columna A (¡el contador CUENTA sube solo!) y termina sobre la meta 🏁 de A1.',
      sol:[I_AV,I_RC,I_AV,I_AV,I_RC,I_AV,I_TM],xpn:6},
  n5:{nombre:'Nivel 5 · Bucle + variable',icon:'5️⃣',n:5,start:{r:4,c:0,dir:'N'},dest:[0,0],
      obst:[],objs:[[3,0],[2,0],[1,0],[0,0]],deco:{'0,4':'🏫','4,4':'🏪'},
      meta:'Ahora junta dos piezas: hay 4 manzanas 🍎 seguidas en la columna A. El patrón «AVANZA, RECOGE» se repite… ¡mételo en un bucle 🔁 y no lo escribas 8 veces!',
      sol:[{rep:4,body:[I_AV,I_RC]},I_TM],xpn:7},
  n6:{nombre:'Nivel 6 · ¡El proyecto completo! 🚀',icon:'6️⃣',n:5,start:{r:4,c:0,dir:'N'},dest:[0,1],
      obst:[],objs:[[3,0],[1,0]],deco:{'0,4':'🏫','4,4':'🏪'},
      meta:'El proyecto integrador: BUCLE 🔁 + CONDICIONAL 🔀 + VARIABLE 🔢 a la vez. Recorre la columna A recogiendo las 2 manzanas 🍎 con «SI HAY OBJETO AQUÍ → RECOGE, SINO → AVANZA» dentro de un bucle, y al toparte con la pared del patio usa el condicional del muro para girar y llegar a la meta 🏁 de B1.',
      sol:[{rep:6,body:[C_OBJ]},C_PARED,I_AV,I_TM],xpn:9}
};
let labNivel='n1',labProg=[],labLoopOpen=null,labRunning=false,labRobot=null;
function _labMapa(){const nv=parteData[labNivel];return{n:nv.n,obst:(nv.obst||[]).map(o=>o[0]+','+o[1]),objs:(nv.objs||[]).map(o=>o[0]+','+o[1])};}
function _labTaken(){const nv=parteData[labNivel];const objs=(nv.objs||[]).map(o=>o[0]+','+o[1]);const out=[];objs.forEach((k,i)=>{if(((labRobot&&labRobot.mask)||0)>>i&1)out.push(k);});return out;}
function labShowParte(parteKey){if(labRunning)return;labNivel=parteKey;const nv=parteData[parteKey];labProg=[];labLoopOpen=null;labRobot={r:nv.start.r,c:nv.start.c,dir:nv.start.dir,cuenta:0,mask:0};document.querySelectorAll('.lab-cont-btn').forEach(b=>b.classList.remove('active-pri'));const btn=document.querySelector(`[data-parte="${parteKey}"]`);if(btn)btn.classList.add('active-pri');updateLabDisplay();if(typeof sfx==='function')sfx('click');}
function updateLabDisplay(vueltaTxt,pulse){
  const nv=parteData[labNivel];
  const sent=document.getElementById('lab-sentence');
  if(sent)sent.innerHTML=`🚀 <strong>${nv.nombre}</strong> — ${nv.meta}`;
  const disp=document.getElementById('lab-display');
  if(!disp)return;
  const totalObj=(nv.objs||[]).length;
  const varPanel=`<div class="lab-var-panel"><span class="lab-var-box${pulse?' lvb-pulse':''}"><span class="lvb-k">🔢 CUENTA</span><span class="lvb-v">${labRobot.cuenta||0}</span></span>${totalObj?`<span class="lab-var-box"><span class="lvb-k">🍎 objetos</span><span class="lvb-v">${labRobot.cuenta||0}/${totalObj}</span></span>`:''}</div>`;
  disp.innerHTML=`<div id="simSvgWrap">${svgGridHTML({n:nv.n,robot:labRobot,dest:nv.dest,obst:nv.obst,objs:nv.objs,taken:_labTaken(),deco:nv.deco,dots:false,w:300})}</div>${varPanel}<div class="lab-vuelta" id="labVuelta" aria-live="polite">${vueltaTxt||''}</div><div style="font-size:0.8rem;color:var(--gray);margin-top:0.15rem;">Robot en <strong>${coordName(labRobot.r,labRobot.c)}</strong> mirando al <strong>${DIR_NOMBRE[labRobot.dir]}</strong> ${DIR_FLECHA[labRobot.dir]}</div>`;
  renderLabProg();
}
function renderLabProg(runFlatIdx,crashFlatIdx){
  const list=document.getElementById('progList');
  if(!list)return;
  const chips=[];
  let flatCount=0;
  labProg.forEach((tk,i)=>{
    if(esBucle(tk)){
      const span=tk.rep*tk.body.length;
      const run=runFlatIdx!==undefined&&runFlatIdx>=flatCount&&runFlatIdx<flatCount+span;
      const crash=crashFlatIdx!==undefined&&crashFlatIdx>=flatCount&&crashFlatIdx<flatCount+span;
      chips.push(`<span class="sim-chip sim-chip-loop${run?' sim-chip-run':''}${crash?' sim-chip-crash':''}"><span class="sim-chip-n">${i+1}</span>🔁 REPETIR ${tk.rep} VECES [ ${tk.body.map(progLine).join(' · ')} ]</span>`);
      flatCount+=span;
    }else{
      const run=runFlatIdx!==undefined&&runFlatIdx===flatCount;
      const crash=crashFlatIdx!==undefined&&crashFlatIdx===flatCount;
      chips.push(`<span class="sim-chip${esCond(tk)?' sim-chip-cond':''}${run?' sim-chip-run':''}${crash?' sim-chip-crash':''}"><span class="sim-chip-n">${i+1}</span>${progLine(tk)}</span>`);
      flatCount+=1;
    }
  });
  if(labLoopOpen)chips.push(`<span class="sim-chip sim-chip-loop sim-chip-open"><span class="sim-chip-n">${labProg.length+1}</span>🔁 REPETIR ${labLoopOpen.rep} VECES [ ${labLoopOpen.body.map(progLine).join(' · ')||'…'} ← agrega el cuerpo y cierra con ]</span>`);
  list.innerHTML=chips.length?chips.join(''):'<span class="sim-empty-hint">⚡ CUANDO EMPIECE EL PROGRAMA… toca los botones de arriba para armar tu programa 👆</span>';
}
function _labInstr(code){return code==='C_PARED'?C_PARED:(code==='C_OBJ'?C_OBJ:code);}
function labAdd(code){if(labRunning)return;const real=_labInstr(code);if(labLoopOpen){if(labLoopOpen.body.length>=6){showToast('⚠️ Máximo 6 instrucciones dentro del bucle');return;}labLoopOpen.body.push(real);}else{if(labProg.length>=20){showToast('⚠️ Máximo 20 elementos en el programa');return;}labProg.push(real);}renderLabProg();sfx('click');}
function labOpenLoop(){if(labRunning)return;if(labLoopOpen){showToast('⚠️ Ya hay un bucle abierto: agrégale cuerpo y ciérralo con ]');return;}if(labProg.length>=20){showToast('⚠️ Máximo 20 elementos en el programa');return;}const sel=document.getElementById('labRepN');const n=Math.min(8,Math.max(2,parseInt(sel&&sel.value,10)||2));labLoopOpen={rep:n,body:[]};renderLabProg();sfx('click');}
function labCloseLoop(){if(labRunning)return;if(!labLoopOpen){showToast('⚠️ No hay ningún bucle abierto: ábrelo con 🔁 REPETIR');return;}if(labLoopOpen.body.length===0){showToast('⚠️ El cuerpo del bucle está vacío: agrégale al menos una instrucción');return;}labProg.push(labLoopOpen);labLoopOpen=null;renderLabProg();sfx('ok');}
function labDel(){if(labRunning)return;if(labLoopOpen){if(labLoopOpen.body.length>0)labLoopOpen.body.pop();else labLoopOpen=null;}else labProg.pop();renderLabProg();sfx('click');}
function labClear(){if(labRunning)return;labProg=[];labLoopOpen=null;const nv=parteData[labNivel];labRobot={r:nv.start.r,c:nv.start.c,dir:nv.start.dir,cuenta:0,mask:0};updateLabDisplay();sfx('click');}
function labRun(){
  if(labRunning)return;
  if(labLoopOpen){fb('fbLab','Tienes un bucle abierto: ciérralo con el botón «] Cerrar bucle» antes de ejecutar.',false);return;}
  if(labProg.length===0){fb('fbLab','Primero arma tu programa con los botones (AVANZA, GIRA, RECOGE, los condicionales, el bucle 🔁 y TERMINA).',false);return;}
  const flat=expandProg(labProg);
  if(flat.length>60){fb('fbLab','Tu programa ejecuta más de 60 instrucciones. Usa bucles más pequeños.',false);return;}
  labRunning=true;sfx('click');
  const nv=parteData[labNivel];const map=_labMapa();
  const totalObj=(nv.objs||[]).length;const allMask=totalObj?((1<<totalObj)-1):0;
  labRobot={r:nv.start.r,c:nv.start.c,dir:nv.start.dir,cuenta:0,mask:0};
  updateLabDisplay();
  const fbEl=document.getElementById('fbLab');if(fbEl)fbEl.classList.remove('show');
  let i=0;
  const paso=()=>{
    if(i>=flat.length){
      labRunning=false;renderLabProg();
      fb('fbLab','El programa terminó sin cerrar el proyecto. Agrega la instrucción TERMINA cuando el robot esté sobre la meta 🏁 con todos los objetos recogidos.',false);sfx('no');
      return;
    }
    const f=flat[i];
    renderLabProg(i);
    const nx=simStep(labRobot,f.i,map);
    const vueltaTxt=f.de?`🔁 Vuelta ${f.v} de ${f.de} · ${progLine(f.i)}`:`▶ ${progLine(f.i)}`;
    if(esCond(f.i)){
      const rama=nx.condVal?'ENTONCES':'SINO';
      fb('fbLab',`${nx.condVal?'✔ SÍ':'✘ NO'} · ${COND_LABEL[f.i.cond]} → corre la rama ${rama} (${nx.ejec}).`,true);
    }
    if(_esChoque(nx.evento)){
      labRunning=false;renderLabProg(undefined,i);
      const disp=document.getElementById('lab-display');if(disp){disp.parentElement.classList.add('sim-crash');setTimeout(()=>disp.parentElement.classList.remove('sim-crash'),700);}
      const causa=nx.evento==='borde'?'Se salió del patio.':'Hay un árbol 🌳 en esa casilla.';
      fb('fbLab',`💥 ¡El robot se detuvo en la instrucción ${i+1} (${progLine(f.i)}${f.de?', vuelta '+f.v+' de '+f.de:''})! ${causa} Corrige tu programa y vuelve a probar. 🔁`,false);
      sfx('no');
      setTimeout(()=>{labRobot={r:nv.start.r,c:nv.start.c,dir:nv.start.dir,cuenta:0,mask:0};updateLabDisplay();renderLabProg(undefined,i);},1100);
      return;
    }
    if(nx.evento==='fin'){
      labRunning=false;renderLabProg();
      const enMeta=labRobot.r===nv.dest[0]&&labRobot.c===nv.dest[1];
      const todos=(labRobot.mask||0)===allMask;
      if(enMeta&&todos){
        const piezas=[];
        if(usaBucle(labProg))piezas.push('bucle 🔁');
        if(usaCondicional(labProg))piezas.push('condicional 🔀');
        if(usaVariable(labProg))piezas.push('variable 🔢');
        fb('fbLab',`🚀 ¡Proyecto terminado en ${coordName(nv.dest[0],nv.dest[1])} con ${countEscritas(labProg)} instrucciones escritas${totalObj?' y CUENTA = '+labRobot.cuenta:''}!${piezas.length?' Usaste: '+piezas.join(' + ')+'.':''} ¡Excelente, programador!`,true);
        sfx('fan');launchConfetti();
        if(!xpTracker.lab.has(labNivel)){xpTracker.lab.add(labNivel);pts(nv.xpn);const btn=document.querySelector(`[data-parte="${labNivel}"]`);if(btn)btn.classList.add('lab-done');}
        if(xpTracker.lab.size===Object.keys(parteData).length){fin('s-lab');unlockAchievement('lab_master');}
        return;
      }
      if(!enMeta)fb('fbLab',`🏁 El robot cerró el programa en ${coordName(labRobot.r,labRobot.c)}… ¡pero la meta 🏁 está en ${coordName(nv.dest[0],nv.dest[1])}! Ajusta tu programa y vuelve a probar.`,false);
      else fb('fbLab',`🍎 Llegaste a la meta, ¡pero CUENTA = ${labRobot.cuenta} de ${totalObj}! Faltan objetos por RECOGER. Revisa las vueltas de tu bucle.`,false);
      sfx('no');
      return;
    }
    const subio=nx.recogio;
    labRobot=nx;
    updateLabDisplay(vueltaTxt,subio);
    if(subio)sfx('ok');
    renderLabProg(i);
    i++;
    setTimeout(paso,520);
  };
  paso();
}
function labPista(){
  sfx('click');
  const nv=parteData[labNivel];
  if(nv.sol){showToast('💡 Solución de referencia: '+progLineas(nv.sol).join(' · '));return;}
  const sol=solveSim(nv.start,nv.dest,_labMapa(),22);
  showToast(sol?('💡 Un camino posible ('+sol.len+' instrucciones): '+progLineas(sol.prog).join(' · ')):'💡 Prueba con el condicional de la pared.');
}

// ===================== DIPLOMA =====================
function _diplPct(){return xp>=MXP?100:Math.round((xp/MXP)*100);}
function openDiploma(){sfx('fan');const pct=_diplPct();document.getElementById('diplPct').textContent=pct+'%';document.getElementById('diplBar').style.width=pct+'%';document.getElementById('diplDate').textContent='Fecha: '+new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});const msgs=['¡Sigue armando tu proyecto!','¡Muy buen trabajo, programador!','¡Tu primer programa completo ya camina!','¡Juntaste evento, bucle, condicional y variable!','¡Cerraste la 💻 Ruta del Código: eres Programador Completo! 🚀'];document.getElementById('diplMsg').textContent=msgs[Math.min(Math.floor(pct/25),4)];const stars=['⭐','⭐⭐','⭐⭐⭐'];document.getElementById('diplStars').textContent=stars[Math.min(Math.floor(pct/40),2)];const achTxt=unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(' · ');document.getElementById('diplAch').textContent=achTxt||'Sigue completando secciones para desbloquear logros';document.getElementById('diplomaOverlay').classList.add('open');launchConfetti();}
function closeDiploma(){document.getElementById('diplomaOverlay').classList.remove('open');}
function updateDiplomaName(v){document.getElementById('diplName').textContent=v||'Estudiante';}
function shareWA(){const name=document.getElementById('diplName').textContent||'Estudiante';const pct=_diplPct();const msg=`🚀 ¡${name} completó la Misión "Mi Primer Programa Completo" y cerró la 💻 Ruta del Código! 🏅 Progreso: ${pct}% · 💻 policastsapien.com`;_waShare(msg);}
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
