// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
// Compartir misión por WhatsApp
function compartirMision() {
    const url = window.location.href;
    const texto = `🚀 *Misión Asignada: Valor Posicional hasta el Millón* 🚀\n\nPractica la lectura, escritura y el valor de cada cifra hasta un millón. 🏆\n\nDesbloquea *todos los logros* y puedes poner *tus datos* para que tu maestro observe todos tus logros. 📋\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;
    _waShare(texto);
}

// ===================== ACCESIBILIDAD =====================
function toggleLetra() {
  document.body.classList.toggle('letra-grande');
  if(typeof sfx === 'function') sfx('click');
  localStorage.setItem('prefLetraValorPosicional', document.body.classList.contains('letra-grande'));
}
window.addEventListener('DOMContentLoaded', () => {
  if(localStorage.getItem('prefLetraValorPosicional') === 'true') document.body.classList.add('letra-grande');
});

// ===================== UTILIDADES =====================
const _pick = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
const _shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
function fb(id, msg, isOk) {
  const el = document.getElementById(id);
  if(el) { el.textContent = msg; el.className = 'fb show ' + (isOk ? 'ok' : 'err'); }
}

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY = 'matematica_valor_posicional_v1';
let xp = 0, MXP = 200, done = new Set(), evalAnsVisible = false;
let evalFormNum = 1, evalOpFormNum = 1, evalOpAnsVisible = false, unlockedAch = [], darkMode = false, prevLevel = 0;
const TOTAL_SECTIONS = 16;
const xpTracker = { fc: new Set(), qz: new Set(), cls: new Set(), id: new Set(), cmp: new Set(), reto: new Set(), sopa: new Set(), predice: new Set(), explica: new Set() };

// ===================== SONIDO =====================
let sndOn = true; let AC = null;
function getAC(){ if(!AC){ try{ AC = new(window.AudioContext||window.webkitAudioContext)(); }catch(e){} } return AC; }
function sfx(t){
  if(!sndOn) return;
  try{
    const ac=getAC(); if(!ac) return;
    const g=ac.createGain(); g.connect(ac.destination);
    const o=ac.createOscillator(); o.connect(g);
    if(t==='click'){o.type='sine';o.frequency.setValueAtTime(800,ac.currentTime);o.frequency.linearRampToValueAtTime(1200,ac.currentTime+0.1);g.gain.setValueAtTime(0.2,ac.currentTime);g.gain.linearRampToValueAtTime(0,ac.currentTime+0.12);o.start();o.stop(ac.currentTime+0.12);}
    else if(t==='ok'){[523,659,784].forEach((f,i)=>{const o2=ac.createOscillator();const g2=ac.createGain();o2.connect(g2);g2.connect(ac.destination);o2.type='triangle';o2.frequency.value=f;g2.gain.setValueAtTime(0.15,ac.currentTime+i*0.1);g2.gain.linearRampToValueAtTime(0,ac.currentTime+i*0.1+0.15);o2.start(ac.currentTime+i*0.1);o2.stop(ac.currentTime+i*0.1+0.15);});}
    else if(t==='no'){o.type='square';o.frequency.setValueAtTime(200,ac.currentTime);o.frequency.linearRampToValueAtTime(100,ac.currentTime+0.2);g.gain.setValueAtTime(0.15,ac.currentTime);g.gain.linearRampToValueAtTime(0,ac.currentTime+0.2);o.start();o.stop(ac.currentTime+0.2);}
    else if(t==='up'){[523,659,784,1047].forEach((f,i)=>{const o2=ac.createOscillator();const g2=ac.createGain();o2.connect(g2);g2.connect(ac.destination);o2.type='triangle';o2.frequency.value=f;g2.gain.setValueAtTime(0.18,ac.currentTime+i*0.12);g2.gain.linearRampToValueAtTime(0,ac.currentTime+i*0.12+0.18);o2.start(ac.currentTime+i*0.12);o2.stop(ac.currentTime+i*0.12+0.18);});}
    else if(t==='fan'){[523,587,659,698,784,1047].forEach((f,i)=>{const o2=ac.createOscillator();const g2=ac.createGain();o2.connect(g2);g2.connect(ac.destination);o2.type='triangle';o2.frequency.value=f;g2.gain.setValueAtTime(0.15,ac.currentTime+i*0.1);g2.gain.linearRampToValueAtTime(0,ac.currentTime+i*0.1+0.2);o2.start(ac.currentTime+i*0.1);o2.stop(ac.currentTime+i*0.1+0.2);});}
    else if(t==='flip'){o.type='sine';o.frequency.setValueAtTime(400,ac.currentTime);o.frequency.linearRampToValueAtTime(900,ac.currentTime+0.15);g.gain.setValueAtTime(0.12,ac.currentTime);g.gain.linearRampToValueAtTime(0,ac.currentTime+0.18);o.start();o.stop(ac.currentTime+0.18);}
    else if(t==='tick'){o.type='sine';o.frequency.value=1000;g.gain.setValueAtTime(0.1,ac.currentTime);g.gain.linearRampToValueAtTime(0,ac.currentTime+0.05);o.start();o.stop(ac.currentTime+0.05);}
    else if(t==='ach'){[880,1047,1319].forEach((f,i)=>{const o2=ac.createOscillator();const g2=ac.createGain();o2.connect(g2);g2.connect(ac.destination);o2.type='triangle';o2.frequency.value=f;g2.gain.setValueAtTime(0.2,ac.currentTime+i*0.12);g2.gain.linearRampToValueAtTime(0,ac.currentTime+i*0.12+0.22);o2.start(ac.currentTime+i*0.12);o2.stop(ac.currentTime+i*0.12+0.22);});}
  }catch(e){}
}
function toggleSnd(){ sndOn=!sndOn; document.getElementById('sndBtn').textContent=sndOn?'🔊 Sonido':'🔇 Sonido'; }

// ===================== DARK MODE =====================
function toggleTheme(){ darkMode=!darkMode; document.documentElement.setAttribute('data-theme',darkMode?'dark':'light'); document.getElementById('themeBtn').textContent=darkMode?'☀️ Tema':'🌙 Tema'; localStorage.setItem(SAVE_KEY+'_theme',darkMode?'dark':'light'); sfx('click'); }
function initTheme(){ const s=localStorage.getItem(SAVE_KEY+'_theme'); const sys=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches; darkMode=(s==='dark')||(s===null&&sys); if(darkMode){ document.documentElement.setAttribute('data-theme','dark'); document.getElementById('themeBtn').textContent='☀️ Tema'; } }

// ===================== LOCALSTORAGE =====================
function saveProgress(){
  try{ localStorage.setItem(SAVE_KEY, JSON.stringify({doneSections:Array.from(done), unlockedAch, evalFormNum, evalOpFormNum, xp})); }catch(e){}
}
function loadProgress(){
  try{
    const s=JSON.parse(localStorage.getItem(SAVE_KEY));
    if(!s) return;
    if(s.doneSections&&Array.isArray(s.doneSections)) s.doneSections.forEach(id=>{ done.add(id); const b=document.querySelector(`[data-s="${id}"]`); if(b) b.classList.add('done'); });
    if(s.unlockedAch&&Array.isArray(s.unlockedAch)) unlockedAch=s.unlockedAch.filter(id=>ACHIEVEMENTS[id]!==undefined);
    if(s.evalFormNum) evalFormNum=s.evalFormNum;
    if(s.evalOpFormNum) evalOpFormNum=s.evalOpFormNum;
    if(s.xp!==undefined){ xp=s.xp; updateXPBar(); }
  }catch(e){}
}

// ===================== ACHIEVEMENTS =====================
const ACHIEVEMENTS = {
  primer_quiz:{icon:'🧠',label:'Primera prueba superada'},
  flash_master:{icon:'📚',label:'Todas las flashcards vistas'},
  clasif_pro:{icon:'🏷️',label:'Clasificador experto'},
  id_master:{icon:'🔍',label:'Identificador maestro'},
  reto_hero:{icon:'🏆',label:'Héroe del reto final'},
  nivel3:{icon:'🔭',label:'¡Explorador alcanzado! Nivel 3'},
  nivel5:{icon:'🔥',label:'¡Campeón alcanzado! Nivel 6'}
};
function unlockAchievement(id){ if(unlockedAch.includes(id)) return; unlockedAch.push(id); sfx('ach'); showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label); launchConfetti(); renderAchPanel(); saveProgress(); }
function renderAchPanel(){ const list=document.getElementById('achList'); list.innerHTML=''; Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{ const div=document.createElement('div'); div.className='ach-item'+(unlockedAch.includes(id)?'':' locked'); div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`; list.appendChild(div); }); }
function toggleAchPanel(){ sfx('click'); document.getElementById('achPanel').classList.toggle('open'); }
function showToast(msg){ let t=document.querySelector('.toast'); if(!t){ t=document.createElement('div'); t.className='toast'; document.body.appendChild(t); } t.textContent=msg; t.style.display='block'; clearTimeout(t._tid); t._tid=setTimeout(()=>t.style.display='none',3200); }
function launchConfetti(){ const colors=['#1565c0','#00897b','#00b894','#fdcb6e','#6c5ce7']; for(let i=0;i<60;i++){ const c=document.createElement('div'); c.className='confetti-piece'; c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`; document.body.appendChild(c); c.addEventListener('animationend',()=>c.remove()); } }

// ===================== XP =====================
const lvls=[{t:0,n:'Novato ✏️'},{t:25,n:'Aprendiz 📐'},{t:55,n:'Explorador 🔭'},{t:90,n:'Detective 🔍'},{t:130,n:'Experto 📊'},{t:165,n:'Campeón 🔥'},{t:190,n:'Maestro 🎓'}];
function pts(n){ xp=Math.max(0,Math.min(MXP,xp+n)); updateXPBar(); saveProgress(); }
function updateXPBar(){ const pct=Math.round((xp/MXP)*100); document.getElementById('xpFill').style.width=pct+'%'; const el=document.getElementById('xpPts'); el.textContent='⭐ '+xp; el.style.transform='scale(1.3)'; setTimeout(()=>el.style.transform='',300); let lv=0; for(let i=0;i<lvls.length;i++) if(xp>=lvls[i].t) lv=i; document.getElementById('xpLvl').textContent=lvls[lv].n; if(lv!==prevLevel){ if(lv>=2) unlockAchievement('nivel3'); if(lv>=5) unlockAchievement('nivel5'); prevLevel=lv; } }
function resetXP(){ sfx('click'); xp=0; updateXPBar(); showToast('🔄 XP reiniciado a 0'); }
function fin(id,showFX=true){ if(!done.has(id)){ done.add(id); const b=document.querySelector(`[data-s="${id}"]`); if(b) b.classList.add('done'); if(showFX){ sfx('up'); launchConfetti(); } saveProgress(); } }

// ===================== NAV =====================
function go(id){ sfx('click'); document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active')); document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{ b.classList.remove('active'); b.setAttribute('aria-selected','false'); }); document.getElementById(id).classList.add('active'); const btn=document.querySelector(`[data-s="${id}"]`); if(btn){ btn.classList.add('active'); btn.setAttribute('aria-selected','true'); } window.scrollTo({top:0,behavior:'smooth'}); if(id==='s-sopa') setTimeout(buildSopa,50); }

// ===================== FLASHCARD DATA =====================
const fcData=[
  {w:'Valor Posicional',a:'Es el valor que tiene una cifra según el <strong>lugar</strong> que ocupa en el número.'},
  {w:'Unidad',a:'Posición de valor <strong>1</strong>. La primera cifra desde la derecha.'},
  {w:'Decena',a:'Posición de valor <strong>10</strong>. Un grupo de 10 unidades.'},
  {w:'Centena',a:'Posición de valor <strong>100</strong>. Un grupo de 10 decenas.'},
  {w:'Unidad de Millar',a:'Posición de valor <strong>1,000</strong>. Empieza el segundo grupo de tres cifras.'},
  {w:'Decena de Millar',a:'Posición de valor <strong>10,000</strong>.'},
  {w:'Centena de Millar',a:'Posición de valor <strong>100,000</strong>.'},
  {w:'Millón',a:'Posición de valor <strong>1,000,000</strong>. Se escribe con 7 cifras.'},
  {w:'Forma Expandida',a:'Descomponer un número según el valor de cada cifra. Ej: 452,318 = <strong>400,000+50,000+2,000+300+10+8</strong>.'},
  {w:'Cero de Relleno',a:'Cero que ocupa una posición sin valor, para no perder el lugar. Ej: <strong>5,006</strong>.'},
  {w:'452,318',a:'Se lee: <strong>Cuatrocientos cincuenta y dos mil trescientos dieciocho</strong>.'},
  {w:'1,000,000',a:'Se lee: <strong>Un millón</strong>. Es el número más pequeño de 7 cifras.'},
  {w:'Comparar Números',a:'Primero cuenta las cifras: más cifras significa un número <strong>mayor</strong> (sin ceros a la izquierda).'},
  {w:'Acarreo (Llevar)',a:'Al sumar, si una columna da 10 o más, escribes la unidad y <strong>llevas 1</strong> a la siguiente posición.'}
];
let fcIdx=0;
function upFC(){ document.getElementById('fcInner').classList.remove('flipped'); document.getElementById('fcW').textContent=fcData[fcIdx].w; document.getElementById('fcA').innerHTML=fcData[fcIdx].a; document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length; }
function flipCard(){ sfx('flip'); document.getElementById('fcInner').classList.toggle('flipped'); if(!xpTracker.fc.has(fcIdx)){ xpTracker.fc.add(fcIdx); pts(1); } if(xpTracker.fc.size===fcData.length){ fin('s-flash'); unlockAchievement('flash_master'); } }
function nextFC(){ sfx('click'); fcIdx=(fcIdx+1)%fcData.length; upFC(); }
function prevFC(){ sfx('click'); fcIdx=(fcIdx-1+fcData.length)%fcData.length; upFC(); }

// ===================== QUIZ DATA =====================
const qzData=[
  {q:'¿Cuál es el valor del dígito 7 en el número 573,204?',o:['a) 7','b) 70,000','c) 7,000','d) 700'],c:1,feedback:'El 7 está en la posición de las decenas de millar: vale 70,000.'},
  {q:'¿Cómo se lee el número 908,050?',o:['a) Novecientos ocho mil cincuenta','b) Noventa mil ochocientos cincuenta','c) Nueve mil ochenta y cinco','d) Novecientos ochenta mil cinco'],c:0},
  {q:'¿Cuántas cifras tiene el número 1,000,000?',o:['a) 6','b) 7','c) 8','d) 5'],c:1,feedback:'Un millón se escribe con 7 cifras: 1,000,000.'},
  {q:'¿Cuál es la forma expandida de 340,502?',o:['a) 300,000+40,000+500+2','b) 300,000+4,000+500+2','c) 34,000+500+2','d) 300,000+40,000+50+2'],c:0},
  {q:'¿Cómo se escribe "doscientos quince mil setenta" en cifras?',o:['a) 21,570','b) 215,700','c) 215,070','d) 2,157,0'],c:2},
  {q:'En el número 5,006, ¿qué representan los ceros?',o:['a) Que no hay centenas ni decenas','b) Que el número es negativo','c) Que el número es decimal','d) No representan nada'],c:0,feedback:'Los ceros ocupan las posiciones de centenas y decenas para que el 6 quede en las unidades.'},
  {q:'¿Cuál número es mayor: 87,340 o 9,500?',o:['a) 9,500','b) 87,340','c) Son iguales','d) No se puede saber'],c:1,feedback:'87,340 tiene 5 cifras y 9,500 tiene 4. Más cifras significa un número mayor.'},
  {q:'Al sumar 128,500 + 64,700 y una columna da 12, ¿qué haces?',o:['a) Escribo el 2 y llevo 1 a la siguiente columna','b) Escribo el 12 completo','c) Resto 10','d) Ignoro el 1'],c:0},
  {q:'¿Cuál es el número que sigue después de 999,999?',o:['a) 999,1000','b) 1,000,000','c) 900,000','d) 9,999,999'],c:1},
  {q:'El dígito 4 en el número 452,318 está en la posición de:',o:['a) Centena de millar','b) Decena de millar','c) Unidad de millar','d) Centena'],c:0}
];
let qzIdx=0, qzSel=-1, qzDone=false;
function buildQz(){ qzIdx=0; qzSel=-1; qzDone=false; showQz(); }
function showQz(){
  if(qzIdx>=qzData.length){ document.getElementById('qzQ').textContent='🎉 ¡Quiz completado!'; document.getElementById('qzOpts').innerHTML=''; fin('s-quiz'); unlockAchievement('primer_quiz'); return; }
  const q=qzData[qzIdx];
  document.getElementById('qzProg').textContent=`Pregunta ${qzIdx+1} de ${qzData.length}`;
  document.getElementById('qzQ').textContent=q.q;
  const opts=document.getElementById('qzOpts'); opts.innerHTML='';
  q.o.forEach((o,i)=>{ const b=document.createElement('button'); b.className='qz-opt'; b.textContent=o; b.onclick=()=>{ if(qzDone)return; document.querySelectorAll('.qz-opt').forEach(x=>x.classList.remove('sel')); b.classList.add('sel'); qzSel=i; sfx('click'); }; opts.appendChild(b); });
  qzDone=false;
}
function checkQz(){
  if(qzSel<0) return fb('fbQz','Selecciona una respuesta.',false);
  qzDone=true;
  const opts=document.querySelectorAll('.qz-opt');
  if(qzSel===qzData[qzIdx].c){ opts[qzSel].classList.add('correct'); fb('fbQz','¡Correcto! +5 XP',true); if(!xpTracker.qz.has(qzIdx)){ xpTracker.qz.add(qzIdx); pts(5); } sfx('ok'); setTimeout(()=>{ qzIdx++; qzSel=-1; showQz(); },1600); }
  else{ opts[qzSel].classList.add('wrong'); opts[qzData[qzIdx].c].classList.add('correct'); const _fbMsg=qzData[qzIdx].feedback||'Incorrecto. Revisa la respuesta correcta.'; fb('fbQz',_fbMsg,false); sfx('no'); setTimeout(()=>{ qzIdx++; qzSel=-1; showQz(); },3500); }
}
function useHintQz(){
  if(qzDone) return;
  if(xp<2){ showToast('⚠️ Necesitas al menos 2 XP para usar una pista.'); return; }
  pts(-2); sfx('click'); showToast('💡 Pista aplicada: -2 XP');
  const opts=document.querySelectorAll('.qz-opt'); let hidden=0;
  for(let i=0;i<opts.length&&hidden<2;i++){ if(i!==qzData[qzIdx].c&&opts[i].style.opacity!=='0.3'){ opts[i].style.opacity='0.3'; opts[i].style.pointerEvents='none'; hidden++; } }
}
function resetQz(){ sfx('click'); qzIdx=0; qzSel=-1; qzDone=false; showQz(); document.getElementById('fbQz').classList.remove('show'); }

// ===================== CLASIFICACIÓN =====================
const classGroups=[
  {
    label:['Con cero de relleno','Sin cero de relleno'], headA:'0️⃣ Tiene cero de relleno', headB:'❌ No tiene cero de relleno', colA:'con', colB:'sin',
    words:[{w:'5,006',t:'con'},{w:'452,318',t:'sin'},{w:'300,040',t:'con'},{w:'728,145',t:'sin'},{w:'900,009',t:'con'},{w:'615,932',t:'sin'},{w:'100,001',t:'con'},{w:'347,821',t:'sin'},{w:'506,000',t:'con'},{w:'214,763',t:'sin'}]
  },
  {
    label:['Mayor a 500,000','Menor a 500,000'], headA:'⬆️ Mayor que 500,000', headB:'⬇️ Menor que 500,000', colA:'mayor', colB:'menor',
    words:[{w:'728,145',t:'mayor'},{w:'999,999',t:'mayor'},{w:'1,000,000',t:'mayor'},{w:'615,932',t:'mayor'},{w:'520,000',t:'mayor'},{w:'452,318',t:'menor'},{w:'89,340',t:'menor'},{w:'300,040',t:'menor'},{w:'214,763',t:'menor'},{w:'9,500',t:'menor'}]
  }
];
let currentClassGroupIdx=0, clsSelectedWord=null;
function buildClass(){
  const group=classGroups[currentClassGroupIdx];
  document.getElementById('col-left-head').textContent=group.headA;
  document.getElementById('col-right-head').textContent=group.headB;
  const bank=document.getElementById('clsBank'); bank.innerHTML='';
  clsSelectedWord=null;
  document.getElementById('items-left').innerHTML='';
  document.getElementById('items-right').innerHTML='';

  function _mkDrag(el,text,type){
    el.draggable=true;
    el.ondragstart=(e)=>{e.dataTransfer.setData('text/plain',JSON.stringify({text,type}));e.dataTransfer.effectAllowed='move';setTimeout(()=>{el.style.opacity='0.4';},0);};
    el.ondragend=()=>{el.style.opacity='';};
    return el;
  }
  function _removeWord(text,type){
    document.querySelectorAll('#clsBank .wb-item,#items-left .drop-item,#items-right .drop-item').forEach(el=>{
      if(el.textContent===text&&el.dataset.t===type)el.remove();
    });
  }
  function _mkBankItem(text,type){
    const el=document.createElement('div');el.className='wb-item';el.textContent=text;el.dataset.t=type;
    return _mkDrag(el,text,type);
  }
  function _mkDropItem(text,type){
    const el=document.createElement('div');el.className='drop-item';el.textContent=text;el.dataset.t=type;
    _mkDrag(el,text,type);
    el.onclick=(ev)=>{ev.stopPropagation();_removeWord(text,type);bank.appendChild(_mkBankItem(text,type));sfx('click');};
    return el;
  }
  function _addDropZone(target,targetListId,isBank){
    target.ondragover=(e)=>{e.preventDefault();e.dataTransfer.dropEffect='move';target.style.borderColor='var(--pri)';};
    target.ondragleave=()=>{target.style.borderColor='';};
    target.ondrop=(e)=>{
      e.preventDefault();target.style.borderColor='';
      let data;try{data=JSON.parse(e.dataTransfer.getData('text/plain'));}catch{return;}
      _removeWord(data.text,data.type);
      if(isBank){bank.appendChild(_mkBankItem(data.text,data.type));}
      else{document.getElementById(targetListId).appendChild(_mkDropItem(data.text,data.type));}
      sfx('click');
    };
  }

  _shuffle([...group.words]).forEach(w=>{bank.appendChild(_mkBankItem(w.w,w.t));});
  _addDropZone(document.getElementById('col-left'),'items-left',false);
  _addDropZone(document.getElementById('col-right'),'items-right',false);
  _addDropZone(bank,'clsBank',true);
}
function checkClass(){
  const remaining=document.querySelectorAll('#clsBank .wb-item').length;
  if(remaining>0){fb('fbCls','Mueve todas las palabras a las columnas primero.',false);return;}
  const group=classGroups[currentClassGroupIdx]; let allOk=true;
  document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{
    const inLeft=el.parentElement.id==='items-left';
    const expectedType=inLeft?group.colA:group.colB;
    if(el.dataset.t===expectedType){el.classList.add('cls-ok');}else{el.classList.add('cls-no');allOk=false;}
  });
  if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);}
  if(allOk){fb('fbCls','¡Perfecto! +5 XP',true);sfx('fan');fin('s-clasifica');unlockAchievement('clasif_pro');}
  else{fb('fbCls','Hay errores. Marcados en rojo.',false);sfx('no');}
}
function nextClassGroup(){ sfx('click'); currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length; buildClass(); document.getElementById('fbCls').classList.remove('show'); showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]); }
function resetClass(){ sfx('click'); buildClass(); document.getElementById('fbCls').classList.remove('show'); }

// ===================== IDENTIFICAR =====================
const idData=[
  {s:['Cada','cifra','tiene','un','valor','según','su','posición.'],c:1,art:'Cada símbolo que forma un número (0-9)'},
  {s:['La','unidad','es','la','primera','posición','desde','la','derecha.'],c:1,art:'Posición de valor 1'},
  {s:['Diez','unidades','forman','una','decena.'],c:4,art:'Posición de valor 10'},
  {s:['Cien','unidades','forman','una','centena.'],c:4,art:'Posición de valor 100'},
  {s:['Después','de','las','centenas','viene','el','millar.'],c:6,art:'Posición de valor 1,000'},
  {s:['Un','millón','tiene','siete','cifras.'],c:1,art:'Posición de valor 1,000,000'},
  {s:['El','cero','ocupa','el','lugar','cuando','no','hay','valor.'],c:1,art:'Símbolo que indica ausencia de valor en una posición'},
  {s:['Para','leer','un','número','grande','se','usa','la','coma.'],c:8,art:'Signo que separa los grupos de tres cifras'}
];
let idIdx=0, idDone=false;
function showId(){
  idDone=false;
  if(idIdx>=idData.length){ document.getElementById('idSent').innerHTML='🎉 ¡Completado!'; fin('s-identifica'); unlockAchievement('id_master'); return; }
  const d=idData[idIdx];
  document.getElementById('idProg').textContent=`Oración ${idIdx+1} de ${idData.length}`;
  document.getElementById('idInfo').textContent=`Busca: ${d.art}`;
  const sent=document.getElementById('idSent'); sent.innerHTML='';
  d.s.forEach((w,i)=>{ const span=document.createElement('span'); span.className='id-word'; span.textContent=w+' '; span.onclick=()=>checkId(i,span); sent.appendChild(span); });
}
function checkId(i,span){
  if(idDone) return;
  document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected'));
  span.classList.add('selected');
  if(i===idData[idIdx].c){ idDone=true; span.classList.add('id-ok'); fb('fbId','¡Correcto! +5 XP',true); if(!xpTracker.id.has(idIdx)){ xpTracker.id.add(idIdx); pts(5); } sfx('ok'); }
  else{ span.classList.add('id-no'); fb('fbId','Ese no es el término solicitado.',false); sfx('no'); }
}
function nextId(){ sfx('click'); idIdx++; showId(); document.getElementById('fbId').classList.remove('show'); }
function resetId(){ sfx('click'); idIdx=0; showId(); document.getElementById('fbId').classList.remove('show'); }

// ===================== COMPLETA =====================
const cmpData=[
  {s:'El sistema que da valor a cada cifra según su lugar se llama valor ___.',opts:['posicional','absoluto','decimal'],c:0},
  {s:'La posición de valor 10,000 se llama ___ de millar.',opts:['centena','decena','unidad'],c:1},
  {s:'En el número 5,006, los ceros indican que no hay ___ ni decenas.',opts:['unidades','centenas','millares'],c:1},
  {s:'Un millón se escribe con ___ cifras.',opts:['6','7','8'],c:1},
  {s:'La forma expandida de 452,318 comienza con ___.',opts:['400,000','40,000','4,000'],c:0},
  {s:'Para comparar dos números, primero cuenta la cantidad de ___.',opts:['ceros','cifras','comas'],c:1},
  {s:'Al sumar y una columna da 10 o más, se ___ 1 a la siguiente posición.',opts:['resta','lleva','borra'],c:1},
  {s:'708,040 se lee "setecientos ocho mil ___".',opts:['cuarenta','cuatrocientos','catorce'],c:0}
];
let cmpIdx=0, cmpSel=-1, cmpDone=false;
function showCmp(){
  if(cmpIdx>=cmpData.length){ document.getElementById('cmpSent').innerHTML='🎉 ¡Completado!'; document.getElementById('cmpOpts').innerHTML=''; fin('s-completa'); return; }
  const d=cmpData[cmpIdx];
  document.getElementById('cmpProg').textContent=`Oración ${cmpIdx+1} de ${cmpData.length}`;
  document.getElementById('cmpSent').innerHTML=d.s.replace('___','<span class="blank">___</span>');
  const opts=document.getElementById('cmpOpts'); opts.innerHTML=''; cmpSel=-1; cmpDone=false;
  d.opts.forEach((o,i)=>{ const b=document.createElement('button'); b.className='cmp-opt'; b.textContent=o; b.onclick=()=>{ if(cmpDone)return; document.querySelectorAll('.cmp-opt').forEach(x=>x.classList.remove('sel')); b.classList.add('sel'); cmpSel=i; sfx('click'); }; opts.appendChild(b); });
}
function checkCmp(){
  if(cmpSel<0) return fb('fbCmp','Selecciona una opción.',false);
  cmpDone=true;
  const opts=document.querySelectorAll('.cmp-opt');
  if(cmpSel===cmpData[cmpIdx].c){ opts[cmpSel].classList.add('correct'); document.getElementById('cmpSent').innerHTML=cmpData[cmpIdx].s.replace('___',`<span class="blank" style="color:var(--jade);border-color:var(--jade)">${opts[cmpSel].textContent}</span>`); fb('fbCmp','¡Correcto! +5 XP',true); if(!xpTracker.cmp.has(cmpIdx)){ xpTracker.cmp.add(cmpIdx); pts(5); } sfx('ok'); }
  else{ opts[cmpSel].classList.add('wrong'); opts[cmpData[cmpIdx].c].classList.add('correct'); fb('fbCmp','Incorrecto. Revisa bien la respuesta.',false); sfx('no'); }
  setTimeout(()=>{ cmpIdx++; document.getElementById('fbCmp').classList.remove('show'); showCmp(); },1600);
}

// ===================== MINI QUIZ INLINE (SECCIÓN APRENDE) =====================
function answerMQ(wrapId, btn, isOk, msg) {
  const wrap = document.getElementById(wrapId);
  if (!wrap || wrap.dataset.done) return;
  wrap.dataset.done = '1';
  const allBtns = wrap.querySelectorAll('.mq-btn');
  allBtns.forEach(b => { b.disabled = true; });
  btn.classList.add(isOk ? 'mq-ok' : 'mq-no');
  if (!isOk) {
    allBtns.forEach(b => { if (b.onclick.toString().includes('true,')) b.classList.add('mq-ok'); });
  }
  const fbEl = document.getElementById(wrapId + '-fb');
  if (fbEl) { fbEl.textContent = (isOk ? '✔ ' : '💡 ') + msg; fbEl.className = 'mq-fb show ' + (isOk ? 'ok' : 'err'); }
  if (isOk) sfx('ok'); else sfx('no');
}

// ===================== PREDICE ANTES DE RESOLVER =====================
const prediceData = [
  {
    q: '¿Cuál número es mayor: 999,999 o 1,000,000?',
    opts: ['999,999 es mayor', '1,000,000 es mayor', 'Son iguales'],
    correct: 1,
    feedback: '¡Correcto! 1,000,000 tiene 7 cifras y 999,999 tiene solo 6. Más cifras (sin ceros a la izquierda) significa un número mayor.',
    wrongFeedback: 'La respuesta es: 1,000,000 es mayor. Tiene 7 cifras, mientras que 999,999 tiene solo 6. ¡Aprenderás por qué en la sección Aprende!'
  },
  {
    q: 'En el número 452,318, ¿qué representa el dígito 5?',
    opts: ['5 unidades', '5 decenas de millar (50,000)', '5 centenas (500)'],
    correct: 1,
    feedback: '¡Excelente! El 5 está en la posición de las decenas de millar, así que vale 50,000.',
    wrongFeedback: 'La respuesta es: 5 decenas de millar (50,000). Cuenta las posiciones desde la derecha: unidad, decena, centena, unidad de millar, decena de millar... ¡ahí está el 5!'
  },
  {
    q: '¿Cuál número está escrito correctamente para "quinientos seis mil"?',
    opts: ['506,000', '56,000', '560,000'],
    correct: 0,
    feedback: '¡Muy bien! "Quinientos seis mil" = 506 × 1,000 = 506,000.',
    wrongFeedback: 'La respuesta es: 506,000. "Quinientos seis" (506) es el grupo de los miles, así que se agregan tres ceros: 506,000.'
  }
];
let prediceAnswered = new Set();

function buildPredice() {
  const container = document.getElementById('prediceWidget');
  if (!container) return;
  container.innerHTML = '';
  prediceData.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = 'predice-card';
    card.innerHTML = `
      <div class="predice-num">Predicción ${i + 1} de ${prediceData.length}</div>
      <div class="predice-q">${item.q}</div>
      <div class="predice-opts" id="predice-opts-${i}">
        ${item.opts.map((o, j) => `<button class="predice-btn" onclick="answerPredice(${i},${j})" id="pb-${i}-${j}">${o}</button>`).join('')}
      </div>
      <div class="predice-fb" id="predice-fb-${i}"></div>`;
    container.appendChild(card);
  });
}

function answerPredice(qi, ai) {
  const item = prediceData[qi];
  const fbEl = document.getElementById(`predice-fb-${qi}`);
  const opts = document.querySelectorAll(`#predice-opts-${qi} .predice-btn`);
  opts.forEach(b => { b.disabled = true; });
  const isOk = (ai === item.correct);
  if (isOk) {
    opts[ai].classList.add('predice-ok');
    fbEl.textContent = '✔ ' + item.feedback;
    fbEl.className = 'predice-fb show ok';
    if (!xpTracker.predice.has(qi)) { xpTracker.predice.add(qi); pts(3); }
    sfx('ok');
  } else {
    opts[ai].classList.add('predice-no');
    opts[item.correct].classList.add('predice-ok');
    fbEl.textContent = '💡 ' + item.wrongFeedback;
    fbEl.className = 'predice-fb show err';
    sfx('no');
  }
  prediceAnswered.add(qi);
  if (prediceAnswered.size === prediceData.length) { fin('s-predice'); sfx('fan'); showToast('🔮 ¡Predicciones completadas! Ahora a aprender.'); }
}

// ===================== RETO FINAL =====================
const retoPoolWords=[
  {w:'A: 452,318 ⚖ B: 89,340',t:'mayor'}, {w:'A: 34,200 ⚖ B: 340,200',t:'menor'}, {w:'A: 706,040 ⚖ B: 706,040',t:'igual'},
  {w:'A: 999,999 ⚖ B: 1,000,000',t:'menor'}, {w:'A: 615,932 ⚖ B: 89,999',t:'mayor'}, {w:'A: 5,006 ⚖ B: 5,060',t:'menor'}, {w:'A: 300,040 ⚖ B: 30,400',t:'mayor'},
  {w:'A: 214,763 ⚖ B: 214,763',t:'igual'}, {w:'A: 87,340 ⚖ B: 9,500',t:'mayor'}, {w:'A: 100,001 ⚖ B: 100,010',t:'menor'},
  {w:'A: 520,000 ⚖ B: 52,000',t:'mayor'}, {w:'A: 728,145 ⚖ B: 728,145',t:'igual'}, {w:'A: 908,050 ⚖ B: 98,050',t:'mayor'}, {w:'A: 9,999 ⚖ B: 10,000',t:'menor'}
];
let retoPool=[], retoOk=0, retoErr=0, retoTimerInt=null, retoSec=30, retoRunning=false, retoCurrent=null;
function startReto(){
    if(retoRunning)return; sfx('click'); retoRunning=true; retoOk=0; retoErr=0; retoSec=30;
    retoPool=_shuffle([...retoPoolWords,...retoPoolWords]); showRetoWord();
    const _fill=document.getElementById('retoBarFill'); if(_fill){_fill.style.width='100%';_fill.style.background='var(--jade)';}
  retoTimerInt=setInterval(()=>{ retoSec--; sfx('tick'); document.getElementById('retoTimer').textContent='⏱ '+retoSec; if(retoSec<=10) document.getElementById('retoTimer').style.color='var(--red)'; const fill=document.getElementById('retoBarFill'); if(fill){fill.style.width=(retoSec/30*100)+'%';if(retoSec<=10)fill.style.background='var(--red)';} if(retoSec<=0){ clearInterval(retoTimerInt); endReto(); } },1000);
}
function showRetoWord(){ if(retoPool.length===0) retoPool=_shuffle([...retoPoolWords,...retoPoolWords]); retoCurrent=retoPool.pop(); document.getElementById('retoWord').textContent=retoCurrent.w; }
function ansReto(t){
    if(!retoRunning||!retoCurrent)return;
    const firstPlay=!xpTracker.reto.has(1);
    const correct=(t===retoCurrent.t);
    if(correct){ sfx('ok'); retoOk++; if(firstPlay) pts(1); }
    else{
      sfx('no'); retoErr++; if(firstPlay) pts(-1);
      const _gb=document.getElementById('gameBox'); if(_gb){_gb.classList.remove('shake-error');void _gb.offsetWidth;_gb.classList.add('shake-error');}
      const _fb=document.getElementById('fbReto');
      if(_fb){
        const labels={mayor:'A es MAYOR que B',menor:'A es MENOR que B',igual:'A es IGUAL a B'};
        _fb.textContent=`En ${retoCurrent.w}: ${labels[retoCurrent.t]}`;
        _fb.className='fb show err';
        setTimeout(()=>_fb.classList.remove('show'),2000);
      }
    }
    document.getElementById('retoScore').textContent=`✔ ${retoOk} correctas | ✗ ${retoErr} errores`; showRetoWord();
}
function endReto(){ retoRunning=false; document.getElementById('retoWord').textContent='🏁 ¡Tiempo!'; document.getElementById('retoTimer').style.color='var(--pri)'; xpTracker.reto.add(1); const total=retoOk+retoErr; const pct=total>0?Math.round((retoOk/total)*100):0; fb('fbReto',`Resultado: ${retoOk}/${total} (${pct}%) ¡Bien hecho!`,true); fin('s-reto'); sfx('fan'); unlockAchievement('reto_hero'); }
function resetReto(){ sfx('click'); clearInterval(retoTimerInt); retoRunning=false; retoSec=30; retoOk=0; retoErr=0; document.getElementById('retoTimer').textContent='⏱ 30'; document.getElementById('retoTimer').style.color='var(--pri)'; document.getElementById('retoWord').textContent='¡Prepárate!'; document.getElementById('retoScore').textContent='✔ 0 correctas | ✗ 0 errores'; document.getElementById('fbReto').classList.remove('show'); }

// ===================== GENERADOR DE TAREAS =====================
const identifyTaskDB=[
  {s:'La unidad de millar es la posición que vale mil.',type:'Concepto: Unidad de Millar'},
  {s:'En 452,318 el dígito 5 vale 50,000.',type:'Valor posicional de una cifra'},
  {s:'Se agrega un cero cuando una posición no tiene valor.',type:'Regla del cero de relleno'},
  {s:'Un millón se escribe con siete cifras.',type:'Concepto: Millón'},
  {s:'Para comparar números grandes, cuenta primero las cifras.',type:'Regla de comparación'},
  {s:'Al sumar, si una columna da 10 o más, se lleva 1.',type:'Regla del acarreo'}
];
const classifyTaskDB=[
  {w:'728,145',pos:'Mayor a 500,000',val:'700,000+20,000+8,000+100+40+5',equiv:'Setecientos veintiocho mil ciento cuarenta y cinco'},
  {w:'89,340',pos:'Menor a 500,000',val:'80,000+9,000+300+40',equiv:'Ochenta y nueve mil trescientos cuarenta'},
  {w:'452,318',pos:'Menor a 500,000',val:'400,000+50,000+2,000+300+10+8',equiv:'Cuatrocientos cincuenta y dos mil trescientos dieciocho'},
  {w:'706,040',pos:'Mayor a 500,000',val:'700,000+6,000+40',equiv:'Setecientos seis mil cuarenta'},
  {w:'5,006',pos:'Menor a 500,000',val:'5,000+6',equiv:'Cinco mil seis'}
];
const completeTaskDB=[
  {s:'El sistema que da valor según la posición de cada cifra se llama valor ___.',opts:['posicional','absoluto','negativo'],ans:'posicional'},
  {s:'La posición de valor 100,000 se llama ___ de millar.',opts:['decena','centena','unidad'],ans:'centena'},
  {s:'708,040 se lee "setecientos ocho mil ___".',opts:['cuarenta','cuatro','catorce'],ans:'cuarenta'},
  {s:'Un millón se escribe con ___ cifras.',opts:['6','7','8'],ans:'7'},
  {s:'Para comparar 87,340 y 9,500 se cuenta primero la cantidad de ___.',opts:['comas','cifras','ceros'],ans:'cifras'}
];
const explainQuestions=[
  {q:'Explica cómo se lee el número 615,932.',ans:'Se separa en grupos de tres: 615 y 932. Se lee "seiscientos quince mil novecientos treinta y dos".'},
  {q:'¿Por qué 300,040 no se escribe 3,004?',ans:'Porque el 3 está en la posición de las centenas de millar (vale 300,000) y el 4 está en las decenas (vale 40). Los ceros marcan las posiciones vacías entre ellos.'},
  {q:'¿Cuándo se debe "llevar 1" al sumar números grandes?',ans:'Cuando la suma de una columna (posición) da 10 o más. Se escribe la cifra de las unidades de ese resultado y se lleva 1 a la siguiente columna a la izquierda.'}
];
const pensamientoTaskDB=[
  {q:'Encuentra el error: "300,040 se lee trescientos cuatro mil".',ans:'El error es no leer el cero de relleno. Correcto: 300,040 se lee "trescientos mil cuarenta" (el 3 vale 300,000 y el 4 vale 40).',type:'🔎 Detectar error'},
  {q:'Explica por qué 87,340 es mayor que 9,500 sin restar.',ans:'87,340 tiene 5 cifras y 9,500 tiene 4. Como tiene más cifras (sin ceros iniciales), 87,340 es el número mayor.',type:'💬 Justificar'},
  {q:'Inventa un problema con población, dinero o distancia que use un número de 6 cifras.',ans:'Respuesta variable. Ej: "Un estadio tiene capacidad para 245,000 personas. ¿Cuánto vale el 4?" R: 4 vale 40,000 (decenas de millar).',type:'✏️ Crear problema'},
  {q:'Escribe la forma expandida de 452,318 y explica cada paso.',ans:'4 vale 400,000; 5 vale 50,000; 2 vale 2,000; 3 vale 300; 1 vale 10; 8 vale 8. Forma expandida: 400,000+50,000+2,000+300+10+8.',type:'🧮 Resolver y explicar'},
  {q:'Sin calcular, ordena de mayor a menor: 452,318 / 89,340 / 706,040. Justifica.',ans:'706,040 > 452,318 > 89,340. Comparando primero la cantidad de cifras y luego cifra por cifra de izquierda a derecha.',type:'🧠 Razonar sin calcular'},
  {q:'¿Qué pasaría si al sumar 128,500 + 64,700 olvidas llevar el 1 en una columna?',ans:'El resultado sería incorrecto. La respuesta correcta es 193,200; sin el acarreo obtendrías un número equivocado.',type:'⚠️ Analizar error'}
];
function genPensamientoTask(out,count){
  _instrBlock(out,'Instrucción',['Desarrolla con argumentos. Escribe, explica o inventa según se pide.','<em>Lo importante es tu razonamiento, no solo el resultado.</em>']);
  const pool=_shuffle([...pensamientoTaskDB]);
  for(let i=0;i<count;i++){
    const item=pool[i%pool.length]; const div=document.createElement('div'); div.className='tg-task';
    div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><span class="tg-type-tag">${item.type}</span><br><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.3rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.3rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✔ ${item.ans}</div></div>`;
    out.appendChild(div);
  }
}
let ansVisible=false;
function genTask(){ sfx('click'); const type=document.getElementById('tgType').value; const count=parseInt(document.getElementById('tgCount').value); ansVisible=false; const out=document.getElementById('tgOut'); out.innerHTML=''; if(type==='identify') genIdentifyTask(out,count); else if(type==='classify') genClassifyTask(out,count); else if(type==='complete') genCompleteTask(out,count); else if(type==='explain') genExplainTask(out,count); else if(type==='pensamiento') genPensamientoTask(out,count); fin('s-tareas'); }
function _instrBlock(out,title,lines){ const ib=document.createElement('div'); ib.className='tg-instruction-block'; ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join(''); out.appendChild(ib); }
function genIdentifyTask(out,count){ _instrBlock(out,'Instrucción',['Copia en tu cuaderno; subraya el concepto matemático indicado.','<strong>Ejemplo:</strong> Se escribe con siete cifras. → <span style="color:var(--jade);font-weight:700;">Concepto: Millón</span>']); _pick(identifyTaskDB,Math.min(count,identifyTaskDB.length)).forEach((item,i)=>{ const div=document.createElement('div'); div.className='tg-task'; div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✔ ${item.type}</div></div>`; out.appendChild(div); }); }
function genClassifyTask(out,count){ _instrBlock(out,'Instrucción',['Copia la tabla. Escribe si el número es Mayor o Menor a 500,000, su forma expandida y su lectura.']); const items=_pick(classifyTaskDB,Math.min(count,classifyTaskDB.length)); const wrap=document.createElement('div'); wrap.style.overflowX='auto'; const th=(t,extra='')=>`<th style="padding:0.3rem 0.4rem;border:1px solid var(--border);font-size:0.72rem;text-align:center;${extra}">${t}</th>`; let html=`<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:480px;"><thead><tr style="background:var(--pri-gl);">${th('Número','text-align:left;')}${th('Mayor o Menor a 500,000')}${th('Forma Expandida')}${th('Lectura')}</tr></thead><tbody>`; items.forEach(it=>{ html+=`<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td>`+Array(3).fill(`<td style="padding:0.4rem;border:1px solid var(--border);min-width:50px;"></td>`).join('')+'</tr>'; }); html+='</tbody></table>'; wrap.innerHTML=html; out.appendChild(wrap); const ans=document.createElement('div'); ans.className='tg-answer'; ans.style.marginTop='0.8rem'; ans.innerHTML='<strong>✔ Respuestas:</strong><br>'+items.map(it=>`<strong>${it.w}:</strong> ${it.pos} | Expandida: ${it.val} | Lectura: ${it.equiv}`).join('<br>'); out.appendChild(ans); }
function genCompleteTask(out,count){ _instrBlock(out,'Instrucción',['Copia y resuelve en tu cuaderno. Elige la opción correcta para el espacio ___.']); const pool=_shuffle([...completeTaskDB]); for(let i=0;i<count;i++){ const item=pool[i%pool.length]; const div=document.createElement('div'); div.className='tg-task'; const sent=item.s.replace('___','<span class="tg-blank" style="min-width:90px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>'); div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${sent}</strong><div style="margin-top:0.4rem;font-size:0.82rem;color:var(--gray);">💡 Opciones: <strong>${item.opts.join(' | ')}</strong></div><div class="tg-answer">✔ ${item.ans}</div></div>`; out.appendChild(div); } }
function genExplainTask(out,count){ _instrBlock(out,'Instrucción',['Copia las preguntas en tu cuaderno y responde de forma clara.']); const pool=_shuffle([...explainQuestions]); for(let i=0;i<count;i++){ const item=pool[i%pool.length]; const div=document.createElement('div'); div.className='tg-task'; div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.3rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✔ ${item.ans}</div></div>`; out.appendChild(div); } }
function toggleAns(){ ansVisible=!ansVisible; document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none'); sfx('click'); }

// ===================== SOPA DE LETRAS =====================
const sopaSets=[
  {
    size:10,
    grid:[
      ['U','N','I','D','A','D','B','P','C','C'],
      ['M','J','K','L','Q','R','S','T','O','E'],
      ['I','W','X','Y','Z','B','D','F','M','N'],
      ['L','G','H','J','K','P','Q','S','A','T'],
      ['L','V','W','X','Y','Z','B','D','G','E'],
      ['A','H','M','I','L','L','O','N','K','N'],
      ['R','C','V','B','N','M','Q','W','E','A'],
      ['C','I','F','R','A','T','Y','U','I','O'],
      ['C','E','R','O','P','A','S','D','F','G'],
      ['D','E','C','E','N','A','H','J','K','L']
    ],
    words:[
      {w:'UNIDAD',  cells:[[0,0],[0,1],[0,2],[0,3],[0,4],[0,5]]},
      {w:'MILLAR',  cells:[[1,0],[2,0],[3,0],[4,0],[5,0],[6,0]]},
      {w:'CENTENA', cells:[[0,9],[1,9],[2,9],[3,9],[4,9],[5,9],[6,9]]},
      {w:'MILLON',  cells:[[5,2],[5,3],[5,4],[5,5],[5,6],[5,7]]},
      {w:'CIFRA',   cells:[[7,0],[7,1],[7,2],[7,3],[7,4]]},
      {w:'CERO',    cells:[[8,0],[8,1],[8,2],[8,3]]},
      {w:'COMA',    cells:[[0,8],[1,8],[2,8],[3,8]]},
      {w:'DECENA',  cells:[[9,0],[9,1],[9,2],[9,3],[9,4],[9,5]]}
    ]
  }
];
let currentSopaSetIdx=0, sopaFoundWords=new Set();
let sopaFirstClickCell=null, sopaPointerStartCell=null, sopaPointerMoved=false, sopaSelectedCells=[];
function getSopaCellSize(){ const container=document.getElementById('sopaGrid'); if(!container||!container.parentElement)return 28; const avail=container.parentElement.clientWidth-16; const set=sopaSets[currentSopaSetIdx]; return Math.max(20,Math.min(32,Math.floor(avail/set.size))); }
function buildSopa(){
  const set=sopaSets[currentSopaSetIdx]; const grid=document.getElementById('sopaGrid'); grid.innerHTML=''; const sz=getSopaCellSize(); grid.style.gridTemplateColumns=`repeat(${set.size},${sz}px)`; grid.style.gridTemplateRows=`repeat(${set.size},${sz}px)`; sopaFirstClickCell=null; sopaSelectedCells=[];
  for(let r=0;r<set.size;r++) for(let c=0;c<set.size;c++){ const cell=document.createElement('div'); cell.className='sopa-cell'; cell.style.width=sz+'px'; cell.style.height=sz+'px'; cell.style.fontSize=Math.max(11,sz-10)+'px'; cell.textContent=set.grid[r][c]; cell.dataset.row=r; cell.dataset.col=c; const alreadyFound=set.words.find(w=>sopaFoundWords.has(w.w)&&w.cells.some(([wr,wc])=>wr===r&&wc===c)); if(alreadyFound) cell.classList.add('sopa-found'); grid.appendChild(cell); }
  setupSopaEvents();
  const wl=document.getElementById('sopaWords'); wl.innerHTML=''; set.words.forEach(wObj=>{ const sp=document.createElement('span'); sp.className='sopa-w'+(sopaFoundWords.has(wObj.w)?' found':''); sp.id='sw-'+wObj.w; sp.textContent=wObj.w; wl.appendChild(sp); });
}
function setupSopaEvents(){
  const grid=document.getElementById('sopaGrid');
  grid.onpointerdown=e=>{ const cell=e.target.closest('.sopa-cell'); if(!cell)return; e.preventDefault(); grid.setPointerCapture(e.pointerId); sopaPointerStartCell=cell; sopaPointerMoved=false; cell.classList.add('sopa-sel'); sopaSelectedCells=[cell]; };
  grid.onpointermove=e=>{ if(!sopaPointerStartCell)return; e.preventDefault(); const el=document.elementFromPoint(e.clientX,e.clientY); const cell=el?el.closest('.sopa-cell'):null; if(!cell)return; const sr=parseInt(sopaPointerStartCell.dataset.row),sc=parseInt(sopaPointerStartCell.dataset.col); const er=parseInt(cell.dataset.row),ec=parseInt(cell.dataset.col); if(sr!==er||sc!==ec) sopaPointerMoved=true; document.querySelectorAll('.sopa-cell.sopa-sel').forEach(c=>c.classList.remove('sopa-sel')); sopaSelectedCells=[]; getSopaPath(sr,sc,er,ec).forEach(([r,c])=>{ const pc=document.querySelector(`#sopaGrid [data-row="${r}"][data-col="${c}"]`); if(pc){pc.classList.add('sopa-sel');sopaSelectedCells.push(pc);} }); };
  grid.onpointerup=e=>{ if(!sopaPointerStartCell)return; e.preventDefault(); grid.releasePointerCapture(e.pointerId); if(sopaPointerMoved&&sopaSelectedCells.length>1){ checkSopaSelection(); } else{ const cell=sopaPointerStartCell; document.querySelectorAll('.sopa-cell.sopa-sel').forEach(c=>c.classList.remove('sopa-sel')); sopaSelectedCells=[]; if(!sopaFirstClickCell){ sopaFirstClickCell=cell; cell.classList.add('sopa-start'); } else if(sopaFirstClickCell===cell){ cell.classList.remove('sopa-start'); sopaFirstClickCell=null; } else{ const sr=parseInt(sopaFirstClickCell.dataset.row),sc=parseInt(sopaFirstClickCell.dataset.col); const er=parseInt(cell.dataset.row),ec=parseInt(cell.dataset.col); sopaFirstClickCell.classList.remove('sopa-start'); sopaFirstClickCell=null; getSopaPath(sr,sc,er,ec).forEach(([r,c])=>{ const pc=document.querySelector(`#sopaGrid [data-row="${r}"][data-col="${c}"]`); if(pc){pc.classList.add('sopa-sel');sopaSelectedCells.push(pc);} }); checkSopaSelection(); } } sopaPointerStartCell=null; sopaPointerMoved=false; };
}
function getSopaPath(r1,c1,r2,c2){ const dr=Math.sign(r2-r1),dc=Math.sign(c2-c1); const lr=Math.abs(r2-r1),lc=Math.abs(c2-c1); if(lr!==0&&lc!==0&&lr!==lc)return[[r1,c1]]; const len=Math.max(lr,lc); const path=[]; for(let i=0;i<=len;i++) path.push([r1+dr*i,c1+dc*i]); return path; }
function checkSopaSelection(){ const set=sopaSets[currentSopaSetIdx]; const word=sopaSelectedCells.map(c=>c.textContent).join(''); const wordRev=word.split('').reverse().join(''); const found=set.words.find(wObj=>!sopaFoundWords.has(wObj.w)&&(wObj.w===word||wObj.w===wordRev)); if(found){ sopaFoundWords.add(found.w); found.cells.forEach(([r,c])=>{ const cell=document.querySelector(`#sopaGrid [data-row="${r}"][data-col="${c}"]`); if(cell){cell.classList.remove('sopa-sel','sopa-start');cell.classList.add('sopa-found');} }); const sp=document.getElementById('sw-'+found.w); if(sp) sp.classList.add('found'); if(!xpTracker.sopa.has(found.w)){xpTracker.sopa.add(found.w);pts(1);} sfx('ok'); if(sopaFoundWords.size===set.words.length){fin('s-sopa');sfx('fan');showToast('🎉 ¡Todas las palabras encontradas!');} else showToast('✔ ¡Encontraste: '+found.w+'!'); } else sfx('no'); document.querySelectorAll('.sopa-cell.sopa-sel').forEach(c=>c.classList.remove('sopa-sel')); sopaSelectedCells=[]; }
function nextSopaSet(){ sfx('click'); sopaFoundWords=new Set(); currentSopaSetIdx=(currentSopaSetIdx+1)%sopaSets.length; buildSopa(); showToast('🔄 Nueva sopa cargada'); }
let _sopaResizeTimer=null;
window.addEventListener('resize',()=>{ clearTimeout(_sopaResizeTimer); _sopaResizeTimer=setTimeout(()=>{if(document.getElementById('s-sopa').classList.contains('active'))buildSopa();},200); });

// ===================== EVALUACIÓN FINAL (CONCEPTUAL) =====================
const evalTFBank=[
  {q:'En el número 452,318, el dígito 5 vale 50,000.',a:true},
  {q:'Un millón se escribe con 6 cifras.',a:false},
  {q:'Los ceros de relleno no tienen ningún propósito en un número.',a:false},
  {q:'300,040 se lee "trescientos mil cuarenta".',a:true},
  {q:'87,340 es menor que 9,500 porque el primer dígito (8) es menor que 9.',a:false},
  {q:'Al sumar y una columna da 10 o más, se lleva 1 a la siguiente posición.',a:true},
  {q:'La forma expandida de 706,040 es 700,000+6,000+40.',a:true},
  {q:'Para leer un número grande se separa en grupos de tres cifras desde la derecha.',a:true},
  {q:'El número 5,006 es igual al número 5,600.',a:false},
  {q:'999,999 es el número más grande de 6 cifras.',a:true}
];
const evalMCBank=[
  {q:'¿Cuál es el valor del dígito 4 en 573,420?',o:['a) 4','b) 400','c) 4,000','d) 40,000'],a:1},
  {q:'¿Cómo se lee el número 908,050?',o:['a) Noventa mil ochocientos cincuenta','b) Novecientos ocho mil cincuenta','c) Nueve mil ochenta y cinco','d) Novecientos ochenta mil cinco'],a:1},
  {q:'¿Cuántas cifras tiene un millón (1,000,000)?',o:['a) 5','b) 6','c) 7','d) 8'],a:2},
  {q:'¿Cuál número es mayor: 87,340 o 9,500?',o:['a) 9,500','b) 87,340','c) Son iguales','d) No se puede saber'],a:1},
  {q:'¿Qué haces si al sumar una columna da 12?',o:['a) Escribo el 2 y llevo 1','b) Escribo el 12 completo','c) Resto 10','d) Ignoro el resultado'],a:0}
];
const evalCPBank=[
  {q:'La posición de valor 1,000 se llama unidad de ___.',a:'millar'},
  {q:'Un millón se escribe con ___ cifras.',a:'7'},
  {q:'En 452,318 el dígito 2 vale ___.',a:'2,000'},
  {q:'Los ___ de relleno ocupan una posición sin valor.',a:'ceros'},
  {q:'Para comparar números grandes, primero se cuenta la cantidad de ___.',a:'cifras'}
];
const evalPRBank=[
  {term:'Valor Posicional',def:'Sistema donde cada cifra vale según su lugar'},
  {term:'Cero de Relleno',def:'Ocupa una posición sin valor para no perder el lugar'},
  {term:'Forma Expandida',def:'Descomposición de un número según el valor de cada cifra'},
  {term:'Centena de Millar',def:'Posición de valor 100,000'},
  {term:'Acarreo',def:'Se lleva 1 a la siguiente columna al sumar 10 o más'}
];
// ══════════ Formas deterministas v1 (M.E.T.A.S, jul 2026) ══════════
// La Forma N genera SIEMPRE el mismo examen y la misma pauta («bucle exacto»),
// en cualquier navegador y aunque se cierre el programa. PRNG mulberry32
// (aritmética entera exacta) + barajado Fisher-Yates. ⚠️ NO usar
// sort(() => rng() - 0.5): el resultado depende del motor del navegador.
// ⚠️ Editar los bancos de preguntas CAMBIA el contenido de todas las formas.
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
// Selector «Forma exacta»: el docente elige qué forma generar (p.ej. para
// reimprimir la pauta de la Forma 15 que ya repartió a los alumnos).
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

function genEval(){
  sfx('click');
  _evalFormaSelector(); const _selF = document.getElementById('evalFormaSel'); if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10))); const cf = evalFormNum; const rng = _evalRng(cf); /* la Forma cf siembra TODO el azar de esta evaluación */ window._currentEvalForm=cf; evalFormNum = (evalFormNum % EVAL_FORMAS) + 1; _evalFormaSelector(); saveProgress();
  document.getElementById('eval-screen-title').textContent=`📋 Evaluación Final — Forma ${cf}`;
  evalAnsVisible=false;
  const out=document.getElementById('evalOut'); out.innerHTML='';
  const bar=document.createElement('div'); bar.className='eval-score-bar';
  bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje — 100 puntos</div><div class="esb-dist">4 secciones × 5 preguntas × 5 pts = 100 pts</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">I. Completar 25 pts</span><span class="eval-score-pill esp-tf">II. V/F 25 pts</span><span class="eval-score-pill esp-mc">III. Selección 25 pts</span><span class="eval-score-pill esp-pr">IV. Pareados 25 pts</span></div>`;
  out.appendChild(bar);
  const cpItems=_pickF(evalCPBank,5, rng);
  const s1=document.createElement('div'); s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  cpItems.forEach((item,i)=>{ const d=document.createElement('div'); d.className='eval-item eval-auto-item'; const qHtml=item.q.replace('___','<input class="eval-cp-input" type="text" data-ecp="'+i+'" autocomplete="off" style="min-width:110px;">'); d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbEcp${i}" aria-live="polite"></div>`; s1.appendChild(d); });
  out.appendChild(s1);
  const tfItems=_pickF(evalTFBank,5, rng);
  const s2=document.createElement('div'); s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  tfItems.forEach((item,i)=>{ const d=document.createElement('div'); d.className='eval-item eval-auto-item'; d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="V"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="F"> Falso</label></div><div style="margin-top:0.4rem;margin-left:1.7rem;font-size:0.82rem;color:var(--gray);">Justifica por qué: <span style="display:inline-block;min-width:180px;border-bottom:1px solid var(--border);">&nbsp;</span></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbEtf${i}" aria-live="polite"></div>`; s2.appendChild(d); });
  out.appendChild(s2);
  const mcItems=_pickF(evalMCBank,5, rng);
  const s3=document.createElement('div'); s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  mcItems.forEach((item,i)=>{ const d=document.createElement('div'); d.className='eval-item eval-auto-item'; const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join(''); d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbEmc${i}" aria-live="polite"></div>`; s3.appendChild(d); });
  out.appendChild(s3);
  const prItems=_pickF(evalPRBank,5, rng); const shuffledDefs=_shuffleF(prItems, rng); const letters=['A','B','C','D','E'];
  const s4=document.createElement('div'); s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  const matchCard=document.createElement('div'); matchCard.className='eval-item eval-auto-item';
  let colLeft='<div class="eval-match-col"><h4>📘 Términos</h4>';
  prItems.forEach((item,i)=>{ const selHtml='<select class="eval-pr-sel" data-epr="'+i+'" aria-label="Letra para '+item.term+'"><option value="">—</option>'+letters.map(L=>'<option value="'+L+'">'+L+'</option>').join('')+'</select>'; colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> ${selHtml} ${item.term}</div>`; });
  colLeft+='</div>';
  let colRight='<div class="eval-match-col"><h4>📗 Definiciones</h4>';
  shuffledDefs.forEach((item,i)=>{ colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`; });
  colRight+='</div>';
  const ansKey=prItems.map((item,i)=>{ const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)]; return `${i+16}→${letter}`; }).join(' · ');
  matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div><div class="eval-item-feedback" id="evalFbEpr" aria-live="polite"></div>`;
  s4.appendChild(matchCard); out.appendChild(s4);
  const autoPanel=document.createElement('div'); autoPanel.id='evalAutoResult'; autoPanel.className='eval-auto-result';
  autoPanel.innerHTML='<strong>🧮 Prueba interactiva:</strong> escribe, marca y selecciona tus respuestas en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato para resolver en papel.';
  out.appendChild(autoPanel);
  window._evalPrintData={tf:tfItems,mc:mcItems,cp:cpItems,pr:{terms:prItems,shuffledDefs,letters}};
  window._evalGradeData={cp:cpItems,tf:tfItems,mc:mcItems,pr:{terms:prItems,shuffledDefs,letters}};
  fin('s-evaluacion');
}
// Normaliza texto del estudiante: minúsculas, sin tildes ni signos
function _normTxt(s){ return (s||'').toString().trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9ñ ]/gi,'').replace(/\s+/g,' ').trim(); }
function gradeEval(){
  if(!window._evalGradeData){ showToast('⚠️ Genera una evaluación primero'); return; }
  sfx('click');
  const d=window._evalGradeData; let total=0; const det={cp:0,tf:0,mc:0,pr:0};
  d.cp.forEach((it,i)=>{ const el=document.querySelector(`[data-ecp="${i}"]`); const val=_normTxt(el?el.value:''); const ok=val!==''&&(it.acc||[it.a]).some(a=>_normTxt(a)===val); if(el){ el.classList.toggle('eval-input-ok',ok); el.classList.toggle('eval-input-no',!ok); } if(ok){ det.cp++; total+=5; } setEvalFeedback('evalFbEcp'+i,ok,ok?'Correcto. +5 pts':'Revisar. R/ '+it.a); });
  d.tf.forEach((it,i)=>{ const sel=document.querySelector(`#evalOut input[name="tf${i}"]:checked`); const ok=!!sel&&sel.value===(it.a?'V':'F'); if(ok){ det.tf++; total+=5; } setEvalFeedback('evalFbEtf'+i,ok,ok?'Correcto. +5 pts':'Revisar. R/ '+(it.a?'Verdadero':'Falso')); });
  d.mc.forEach((it,i)=>{ const sel=document.querySelector(`#evalOut input[name="mc${i}"]:checked`); const ok=!!sel&&parseInt(sel.value,10)===it.a; if(ok){ det.mc++; total+=5; } setEvalFeedback('evalFbEmc'+i,ok,ok?'Correcto. +5 pts':'Revisar. R/ '+it.o[it.a]); });
  const okLetters=d.pr.terms.map(t=>d.pr.letters[d.pr.shuffledDefs.findIndex(df=>df.def===t.def)]);
  const prPend=[];
  d.pr.terms.forEach((t,i)=>{ const el=document.querySelector(`[data-epr="${i}"]`); const ok=!!el&&el.value===okLetters[i]; if(el){ el.classList.toggle('eval-input-ok',ok); el.classList.toggle('eval-input-no',!ok); } if(ok){ det.pr++; total+=5; } else prPend.push(`${i+16}→${okLetters[i]}`); });
  setEvalFeedback('evalFbEpr',prPend.length===0,prPend.length===0?'Pareados perfectos. +25 pts':'Revisar. R/ '+prPend.join(' · '));
  const res=document.getElementById('evalAutoResult');
  if(res){ res.className='eval-auto-result '+(total>=70?'eval-auto-pass':'eval-auto-risk'); res.innerHTML=`<strong>Resultado: ${total}/100 pts</strong><br><span>Completar: ${det.cp*5}/25 · V/F: ${det.tf*5}/25 · Selección: ${det.mc*5}/25 · Pareados: ${det.pr*5}/25</span>`; }
  if(total>=70){ pts(8); showToast('🎯 Evaluación calificada: '+total+'/100'); }
  else showToast('🧮 Evaluación: '+total+'/100. Revisa los ítems marcados.');
}
function toggleEvalAns(){ evalAnsVisible=!evalAnsVisible; document.querySelectorAll('#evalOut .eval-answer').forEach(el=>el.style.display=evalAnsVisible?'block':'none'); sfx('click'); }

function printEval(){
  if(!window._evalPrintData){showToast('⚠️ Genera una evaluación primero');return;}
  sfx('click');
  const forma=window._currentEvalForm||1; const d=window._evalPrintData;
  let s1=`<div class="sec-title"><span>I. Completar el espacio</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25 pts</span></div></div>`;
  d.cp.forEach((it,i)=>{ const q=it.q.replace('___','<span class="cp-blank"></span>'); s1+=`<div class="cp-row"><span class="qn">${i+1}.</span><span class="cp-text">${q}</span></div>`; });
  let s2=`<div class="sec-title"><span>II. Verdadero o Falso</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25 pts</span></div></div>`;
  d.tf.forEach((it,i)=>{ s2+=`<div class="tf-row"><span class="qn">${i+6}.</span><span class="tf-blank"></span><span class="tf-text">${it.q}</span></div>`; });
  let s3=`<div class="sec-title"><span>III. Selección Múltiple</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25 pts</span></div></div><div class="mc-grid">`;
  d.mc.forEach((it,i)=>{ const opts=it.o.map((op,oi)=>`<label class="mc-opt"><input type="radio" name="mc${i}"> ${op}</label>`).join(''); s3+=`<div class="mc-item"><div class="mc-q"><span class="qn">${i+11}.</span><span>${it.q}</span></div><div class="mc-opts">${opts}</div></div>`; });
  s3+=`</div>`;
  let colL='<div class="pr-col"><div class="pr-head">📘 Términos</div>';
  d.pr.terms.forEach((it,i)=>{ colL+=`<div class="pr-item"><span class="pr-num">${i+16}.</span><span class="pr-line"></span>${it.term}</div>`; });
  colL+='</div>';
  let colR='<div class="pr-col"><div class="pr-head">📗 Definiciones</div>';
  d.pr.shuffledDefs.forEach((it,i)=>{ colR+=`<div class="pr-item"><span class="pr-num">${d.pr.letters[i]}.</span>${it.def}</div>`; });
  colR+='</div>';
  let s4=`<div class="pr-section"><div class="sec-title"><span>IV. Términos Pareados</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25 pts</span></div></div><div class="pr-grid">${colL}${colR}</div></div>`;
  let pR='';
  pR+=`<div class="p-sec"><div class="p-ttl">I. Completar</div><table class="p-tbl">`;
  d.cp.forEach((it,i)=>{ pR+=`<tr><td class="pn">${i+1}.</td><td class="pa">${it.a}</td></tr>`; });
  pR+=`</table></div><div class="p-sec"><div class="p-ttl">II. V o F</div><table class="p-tbl">`;
  d.tf.forEach((it,i)=>{ pR+=`<tr><td class="pn">${i+6}.</td><td class="pa">${it.a?'V':'F'}</td></tr>`; });
  pR+=`</table></div><div class="p-sec"><div class="p-ttl">III. Selección</div><table class="p-tbl">`;
  d.mc.forEach((it,i)=>{ pR+=`<tr><td class="pn">${i+11}.</td><td class="pa">${it.o[it.a]}</td></tr>`; });
  pR+=`</table></div><div class="p-sec"><div class="p-ttl">IV. Pareados</div><table class="p-tbl">`;
  d.pr.terms.forEach((it,i)=>{ const l=d.pr.letters[d.pr.shuffledDefs.findIndex(df=>df.def===it.def)]; pR+=`<tr><td class="pn">${i+16}.</td><td class="pa">${i+16}→${l}</td></tr>`; });
  pR+=`</table></div>`;
  
    // ── Clave rápida estilo ZipGrade (círculos rellenados automáticamente con la pauta)
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación Valor Posicional · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:12pt;color:#111;background:#fff;padding:4mm 6mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.5rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;color:#1565c0;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:#1565c0;margin-top:0.15rem;font-weight:700;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.5rem 0 0.25rem;border-left:4px solid #1565c0;background:#e3f2fd;display:flex;justify-content:space-between;align-items:center;color:#1565c0;}.qn{font-weight:700;min-width:22px;flex-shrink:0;color:#1565c0;}.tf-row{display:flex;align-items:flex-start;gap:0.3rem;font-size:10.5pt;line-height:1.4;padding:0.25rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:42px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.2rem;margin-top:0.2rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.28rem 0.45rem;margin-bottom:0.22rem;break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.4;display:flex;gap:0.3rem;margin-bottom:0.18rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.22rem 0.55rem;}.mc-opts{display:grid;grid-template-columns:repeat(3,1fr);gap:0.08rem 0.25rem;margin-left:1.3rem;}.mc-opt{font-size:9.5pt;display:flex;align-items:center;gap:0.22rem;}.mc-opt input{width:12px;height:12px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.4;padding:0.22rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:130px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{break-inside:avoid;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.2rem 0.5rem;margin-top:0.15rem;}.pr-head{font-size:9pt;font-weight:700;color:#1565c0;margin-bottom:0.2rem;}.pr-item{font-size:10pt;padding:0.22rem 0.32rem;background:#e3f2fd;border-radius:3px;margin-bottom:0.12rem;display:flex;align-items:center;gap:0.22rem;line-height:1.2;}.pr-num{font-weight:700;color:#1565c0;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #1565c0;padding-bottom:0.35rem;margin-bottom:0.5rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;color:#1565c0;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #cce0ff;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;color:#1565c0;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#1565c0;}.pa{color:#007a00;font-weight:600;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:#1565c0;font-weight:700;font-style:italic;}.obt-lbl{font-weight:700;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #1565c0;height:12px;}.obt-pct{font-weight:700;}.total-row{display:flex;align-items:baseline;justify-content:flex-end;gap:7px;font-size:11pt;color:#1565c0;font-weight:700;font-style:italic;margin-top:0.4rem;padding:0.2rem 0.5rem;background:#e3f2fd;border-radius:4px;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #1565c0;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · Misión Valor Posicional · Matemática</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 4 secciones × 5 preguntas × 5 pts c/u · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✔ PAUTA DOCENTE — Evaluación Final · Valor Posicional · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">100 pts | 4 secciones × 5 preguntas × 5 pts | Matemáticas · Educación Básica</div></div><div class="p-grid">${pR}</div>
  ${zgBlock}</div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("evalPage",252,0.55,1.45);fit("pautaPage",252,0.55,1.3);})();</script></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(doc); win.document.close(); setTimeout(()=>win.print(),400);
}

// ===================== EXPLICA CON TUS PALABRAS =====================
const explicaData = [
  {
    q: 'Explica por qué el número 452,318 se lee "cuatrocientos cincuenta y dos mil trescientos dieciocho".',
    hint: '💡 Pista: separa el número en grupos de tres cifras desde la derecha.',
    rubric: ['✓ Separa el número en el grupo de miles (452) y el grupo de unidades (318)', '✓ Lee cada grupo como si fuera independiente, agregando "mil" al primero', '✓ Junta ambas partes en el orden correcto'],
    suggested: 'Separo 452,318 en dos grupos de tres: 452 y 318. El primer grupo se lee "cuatrocientos cincuenta y dos" y se le agrega "mil". El segundo grupo se lee "trescientos dieciocho". Junto todo: "cuatrocientos cincuenta y dos mil trescientos dieciocho".'
  },
  {
    q: '¿Por qué los ceros son importantes en un número como 300,040?',
    hint: '💡 Pista: piensa qué pasaría si quitas los ceros.',
    rubric: ['✓ Explica que los ceros ocupan posiciones sin valor', '✓ Menciona que sin los ceros el número cambiaría de valor', '✓ Da un ejemplo comparando con y sin ceros'],
    suggested: 'Los ceros ocupan las posiciones de decenas de millar, unidades de millar y centenas para que el 3 quede en centenas de millar y el 4 en decenas. Si los quitara, el número sería 34 en vez de 300,040, ¡un valor totalmente distinto!'
  },
  {
    q: 'Explica cómo sabes que 87,340 es mayor que 9,500 sin hacer la resta.',
    hint: '💡 Pista: cuenta las cifras de cada número.',
    rubric: ['✓ Cuenta las cifras de ambos números', '✓ Explica que más cifras (sin ceros a la izquierda) significa mayor valor', '✓ Concluye correctamente cuál es mayor'],
    suggested: '87,340 tiene 5 cifras y 9,500 tiene 4 cifras. Como 87,340 tiene más cifras, es el número mayor, sin necesidad de restar.'
  },
  {
    q: 'Inventa un problema de la vida real que use un número de 6 cifras y explica su valor posicional.',
    hint: '💡 Pista: piensa en población, dinero ahorrado, distancia en metros, etc.',
    rubric: ['✓ El contexto es de la vida real', '✓ Usa un número de 6 cifras', '✓ Explica correctamente el valor de al menos dos de sus cifras'],
    suggested: '"Mi pueblo tiene 245,600 habitantes." El 2 vale 200,000 (centena de millar), el 4 vale 40,000 (decena de millar), el 5 vale 5,000 (unidad de millar), y los demás dígitos representan las centenas, decenas y unidades.'
  },
  {
    q: 'Explica qué debes hacer al sumar 128,500 + 64,700 cuando una columna suma más de 9.',
    hint: '💡 Pista: recuerda la regla del acarreo (llevar).',
    rubric: ['✓ Menciona que se escribe solo la cifra de las unidades de esa columna', '✓ Explica que se "lleva" 1 a la columna de la izquierda', '✓ Da el resultado correcto: 193,200'],
    suggested: 'Si una columna suma 10 o más, escribo la cifra de las unidades de ese resultado y "llevo" 1 a la siguiente columna (a la izquierda), sumándolo ahí también. 128,500 + 64,700 = 193,200.'
  }
];
let explicaIdx = 0;

function buildExplica() { showExplicaItem(0); }

function showExplicaItem(idx) {
  explicaIdx = idx;
  const container = document.getElementById('explicaContainer');
  if (!container) return;
  const item = explicaData[idx];
  container.innerHTML = `
    <div class="explica-prog">Pregunta ${idx + 1} de ${explicaData.length}</div>
    <div class="explica-q">${item.q}</div>
    <p class="explica-hint">${item.hint}</p>
    <div class="explica-lines">
      <div class="explica-line"></div><div class="explica-line"></div><div class="explica-line"></div>
    </div>
    <div class="explica-rubric" id="explicaRubric" style="display:none;">
      <h4>📋 Criterios de evaluación (pauta):</h4>
      ${item.rubric.map(r => `<label class="rubric-item"><input type="checkbox"> ${r}</label>`).join('')}
      <div class="explica-suggested"><strong>💬 Respuesta sugerida:</strong><br>${item.suggested}</div>
    </div>
    <div style="display:flex;gap:0.6rem;flex-wrap:wrap;margin-top:0.8rem;">
      <button class="btn btn-amber" onclick="toggleExplicaRubric()">📋 Ver pauta</button>
      ${idx > 0 ? `<button class="btn btn-d" onclick="prevExplica()">◀ Anterior</button>` : ''}
      <button class="btn btn-g" onclick="nextExplica()">${idx < explicaData.length - 1 ? '▶ Siguiente' : '🎓 Finalizar'}</button>
    </div>`;
}

function toggleExplicaRubric() {
  const r = document.getElementById('explicaRubric'); if (!r) return;
  const showing = r.style.display !== 'none';
  r.style.display = showing ? 'none' : 'block';
  sfx('click');
  if (!showing && !xpTracker.explica.has(explicaIdx)) { xpTracker.explica.add(explicaIdx); pts(2); }
}
function nextExplica() {
  sfx('click');
  if (explicaIdx < explicaData.length - 1) { showExplicaItem(explicaIdx + 1); }
  else { fin('s-explica'); sfx('fan'); showToast('🎉 ¡Sección Explica completada! +10 XP total'); }
}
function prevExplica() { sfx('click'); if (explicaIdx > 0) showExplicaItem(explicaIdx - 1); }

// ===================== PRUEBA OPERATIVA — VALOR POSICIONAL =====================

function setEvalFeedback(id, ok, msg) {
  const el = document.getElementById(id); if (!el) return;
  el.textContent = msg; el.className = 'eval-item-feedback ' + (ok ? 'eval-ok' : 'eval-no');
}

function evalSwitchMode(mode) {
  sfx('click');
  const cWrap = document.getElementById('evalConceptWrap'), oWrap = document.getElementById('evalOpWrap');
  const cBtn = document.getElementById('evalModeBtnConcept'), oBtn = document.getElementById('evalModeBtnOp');
  if (mode === 'op') {
    cWrap.style.display = 'none'; oWrap.style.display = 'block';
    cBtn.classList.remove('active'); cBtn.setAttribute('aria-selected', 'false');
    oBtn.classList.add('active'); oBtn.setAttribute('aria-selected', 'true');
  } else {
    oWrap.style.display = 'none'; cWrap.style.display = 'block';
    oBtn.classList.remove('active'); oBtn.setAttribute('aria-selected', 'false');
    cBtn.classList.add('active'); cBtn.setAttribute('aria-selected', 'true');
  }
}

// ---- Helpers ----
let _opRnd = Math.random; /* PRNG de la prueba operativa: genEvalOp lo siembra con _evalRng(100000 + forma) */
function _opRint(min, max) { return Math.floor(_opRnd() * (max - min + 1)) + min; }
function _fmtNum(n) { return n.toLocaleString('en-US'); }
function _isIntMatch(student, expectedNum) {
  const raw = (student || '').toString().trim().replace(/[,\s]/g, '');
  if (!raw) return false;
  const n = parseInt(raw, 10);
  return !isNaN(n) && n === expectedNum;
}

const POS_LABELS = ['centena de millar (C.M)', 'decena de millar (D.M)', 'unidad de millar (U.M)', 'centena (C)', 'decena (D)', 'unidad (U)'];
const POS_VALUES = [100000, 10000, 1000, 100, 10, 1];

// I. Escribe el valor del dígito indicado (5 × 4 = 20 pts) — tabla posicional C.M–U del Bloque 5
function genValorItems() {
  const items = [];
  for (let i = 0; i < 5; i++) {
    let num, digits, posIdx, digit;
    do {
      num = _opRint(100000, 999999);
      digits = num.toString().split('').map(Number);
      posIdx = _opRint(0, 5);
      digit = digits[posIdx];
    } while (digit === 0);
    items.push({ num: _fmtNum(num), posLabel: POS_LABELS[posIdx], digit, ansNum: digit * POS_VALUES[posIdx] });
  }
  return items;
}

// II. Completa la forma expandida (5 × 2 = 10 pts) — los 2 primeros ítems traen ceros internos tipo 706,040 (Bloque 3: cero de relleno)
function genExpandeItems() {
  const items = [];
  const zeroPats = [[100000, 1000, 10], [100000, 100, 1], [100000, 10000, 1], [100000, 10000, 100]];
  for (let i = 0; i < 5; i++) {
    let num, terms;
    if (i < 2) {
      const pat = zeroPats[_opRint(0, zeroPats.length - 1)];
      num = pat.reduce((acc, p) => acc + _opRint(1, 9) * p, 0);
      const digits = num.toString().split('').map(Number);
      terms = digits.map((dgt, idx) => dgt * POS_VALUES[idx]).filter(v => v > 0);
    } else {
      do {
        num = _opRint(100000, 999999);
        const digits = num.toString().split('').map(Number);
        terms = digits.map((dgt, idx) => dgt * POS_VALUES[idx]).filter(v => v > 0);
      } while (terms.length < 2);
    }
    const blankIdx = _opRint(0, terms.length - 1);
    const display = terms.map((v, idx) => idx === blankIdx ? '____' : _fmtNum(v)).join(' + ');
    items.push({ num: _fmtNum(num), display, ansNum: terms[blankIdx] });
  }
  return items;
}

// --- Número a palabras (0 a 999,999) — mismo conversor de los widgets Lector/Escritura ---
const _NUM_UNITS = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'];
const _NUM_TENS = ['', '', '', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
const _NUM_HUNDREDS = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
function _num3Cifras(x, apocope) {
  if (x === 0) return '';
  if (x === 100) return 'cien';
  const out = [];
  const h = Math.floor(x / 100), rest = x % 100;
  if (h) out.push(_NUM_HUNDREDS[h]);
  if (rest) {
    if (rest < 30) {
      let w = _NUM_UNITS[rest];
      if (apocope) { if (rest === 1) w = 'un'; else if (rest === 21) w = 'veintiún'; }
      out.push(w);
    } else {
      const t = Math.floor(rest / 10), u = rest % 10;
      if (u) {
        let uw = _NUM_UNITS[u];
        if (apocope && u === 1) uw = 'un';
        out.push(_NUM_TENS[t] + ' y ' + uw);
      } else out.push(_NUM_TENS[t]);
    }
  }
  return out.join(' ');
}
function _numAPalabras(n) {
  if (n === 0) return 'cero';
  const miles = Math.floor(n / 1000), resto = n % 1000;
  const parts = [];
  if (miles === 1) parts.push('mil');
  else if (miles > 1) parts.push(_num3Cifras(miles, true) + ' mil');
  if (resto) parts.push(_num3Cifras(resto, false));
  return parts.join(' ');
}

// III. Escribe el número en cifras (5 × 4 = 20 pts) — destreza central de la misión (Bloques 1-2, Errores 2-3):
// dictado en palabras con trampas de ceros; progresión declarada básico → desafío.
function genCifrasItems() {
  const nums = [
    _opRint(2, 9) * [1000, 10000, 100000][_opRint(0, 2)],   // básico: miles redondos ("setecientos mil")
    _opRint(10, 999) * 1000 + _opRint(100, 999),            // medio: número completo sin trampa
    _opRint(9, 99) * 1000 + _opRint(1, 9),                  // trampa: solo unidades ("noventa mil ocho" → 90,008)
    _opRint(100, 999) * 1000 + _opRint(10, 99),             // trampa: decenas sin centenas ("...mil setenta" → xxx,070)
    _opRint(5, 9) * 100000 + _opRint(1, 99)                 // trampa doble: "quinientos mil..." → 500,0XX
  ];
  return nums.map(n => ({ words: _numAPalabras(n), ansNum: n }));
}

// IV. Problemas de la vida real (3 × 10 = 30 pts) — contexto hondureño con suma/resta y acarreo (Bloque 4)
function _hasCarry(a, b) { while (a > 0 && b > 0) { if (a % 10 + b % 10 >= 10) return true; a = Math.floor(a / 10); b = Math.floor(b / 10); } return false; }
function _hasBorrow(a, b) { while (b > 0) { if (a % 10 < b % 10) return true; a = Math.floor(a / 10); b = Math.floor(b / 10); } return false; }
const opxProbSumas = [
  (a, b) => `El municipio de Choloma tiene ${a} habitantes y el municipio de Villanueva tiene ${b} habitantes. ¿Cuántos habitantes tienen entre los dos municipios?`,
  (a, b) => `En la Feria Juniana de San Pedro Sula se recaudaron L ${a} y en la Feria Agostina de Tegucigalpa se recaudaron L ${b}. ¿Cuántos lempiras se recaudaron entre las dos ferias?`,
  (a, b) => `Una cooperativa de Marcala exportó ${a} quintales de café y otra de Santa Rosa de Copán exportó ${b} quintales. ¿Cuántos quintales exportaron en total?`
];
const opxProbRestas = [
  (a, b) => `El Estadio Nacional de Tegucigalpa recibió ${a} aficionados este año y ${b} el año pasado. ¿Cuántos aficionados más recibió este año?`,
  (a, b) => `Una cooperativa cafetalera de Comayagua cosechó ${a} quintales de café este año y ${b} quintales el año pasado. ¿Cuántos quintales más cosechó este año?`,
  (a, b) => `Para reforestar el parque nacional La Tigra se necesitan ${a} árboles y ya se sembraron ${b}. ¿Cuántos árboles faltan por sembrar?`
];
function genProblemaItems() {
  const sumas = _pickF(opxProbSumas, 2, _opRnd);
  const restas = _pickF(opxProbRestas, 2, _opRnd);
  const defs = [{ op: '+', tpl: sumas[0] }, { op: '-', tpl: restas[0] }];
  defs.push(_opRnd() < 0.5 ? { op: '+', tpl: sumas[1] } : { op: '-', tpl: restas[1] });
  return _shuffleF(defs, _opRnd).map(def => {
    let a, b;
    if (def.op === '+') { do { a = _opRint(50000, 700000); b = _opRint(10000, 299999); } while (!_hasCarry(a, b)); }
    else { do { a = _opRint(100000, 999999); b = _opRint(10000, 99999); } while (!_hasBorrow(a, b)); }
    return { text: def.tpl(_fmtNum(a), _fmtNum(b)), op: def.op, ansNum: def.op === '+' ? a + b : a - b };
  });
}

// V. Retos de pensamiento numérico (4 × 5 = 20 pts) — ordenar, detective del error (Errores 2-3),
// máquina ×10 (widget Máquina ×10) y comparar contando cifras (Error 4).
const opxDetectiveBank = [
  { who: 'Rosa', words: 'cinco mil seis', wrong: '5,600', ansNum: 5006 },
  { who: 'Carlos', words: 'trescientos mil cuarenta', wrong: '3,004', ansNum: 300040 },
  { who: 'Ana', words: 'noventa mil ocho', wrong: '9,008', ansNum: 90008 },
  { who: 'Luis', words: 'setecientos seis mil cuarenta', wrong: '76,040', ansNum: 706040 },
  { who: 'María', words: 'quinientos seis mil', wrong: '56,000', ansNum: 506000 },
  { who: 'Pedro', words: 'ocho mil cincuenta', wrong: '8,500', ansNum: 8050 },
  { who: 'José', words: 'novecientos ocho mil cincuenta', wrong: '98,050', ansNum: 908050 }
];
function genRetosItems() {
  const nums = []; let tries = 0;
  while (nums.length < 4 && tries < 200) {
    tries++;
    const v = _opRint(1000, 999999);
    if (!nums.some(n => n.v === v)) nums.push({ v, label: _fmtNum(v) });
  }
  const ordGroup = {
    display: _shuffleF([...nums], _opRnd).map(n => n.label),
    correctOrder: [...nums].sort((x, y) => y.v - x.v).map(n => n.label)
  };
  const det = _pickF(opxDetectiveBank, 1, _opRnd)[0];
  const mq = _opRint(1000, 99999);
  const maq = { num: _fmtNum(mq), ansNum: mq * 10 };
  const big = _opRint(100000, 999999), small = _opRint(1000, 99999);
  const aFirst = _opRnd() < 0.5;
  const cmp = { a: _fmtNum(aFirst ? big : small), b: _fmtNum(aFirst ? small : big), ans: aFirst ? 'A' : 'B' };
  return { ordGroup, det, maq, cmp };
}

function genEvalOp() {
  sfx('click');
  _injectFormaSel('genEvalOp', 'evalOpFormaSel', evalOpFormNum, function (v) { evalOpFormNum = v; });
  const _sO = document.getElementById('evalOpFormaSel');
  if (_sO && parseInt(_sO.value, 10)) evalOpFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sO.value, 10)));
  const cf = evalOpFormNum; window._currentEvalOpForm = cf; _opRnd = _evalRng(100000 + cf); evalOpFormNum = (evalOpFormNum % EVAL_FORMAS) + 1; _injectFormaSel('genEvalOp', 'evalOpFormaSel', evalOpFormNum, function (v) { evalOpFormNum = v; }); saveProgress();
  document.getElementById('evalop-screen-title').textContent = `📐 Prueba Operativa — Forma ${cf} · Valor Posicional`;
  evalOpAnsVisible = false;
  const out = document.getElementById('evalOpOut'); out.innerHTML = '';

  const valItems = genValorItems();
  const s1 = document.createElement('div');
  s1.innerHTML = '<div class="eval-section-title">I. Escribe el valor del dígito indicado <span class="eval-pts">20 pts · 4 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel básico. Usa la tabla posicional (C.M – U) y escribe el valor total que representa el dígito señalado.</p>';
  valItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">En ${it.num}, ¿cuánto vale el dígito ${it.digit} en la posición ${it.posLabel}?</span><input class="eval-cp-input" type="text" data-val="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${_fmtNum(it.ansNum)}</div><div class="eval-item-feedback" id="evalFbVal${i}" aria-live="polite"></div>`;
    s1.appendChild(d);
  });
  out.appendChild(s1);

  const expItems = genExpandeItems();
  const s2 = document.createElement('div');
  s2.innerHTML = '<div class="eval-section-title">II. Completa la forma expandida <span class="eval-pts">10 pts · 2 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel básico. Escribe el sumando que falta. ¡Atención a los ceros de relleno!</p>';
  expItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.num} = ${it.display}</span><input class="eval-cp-input" type="text" data-exp="${i}" autocomplete="off" inputmode="numeric" style="width:100px;"></div><div class="eval-answer">${_fmtNum(it.ansNum)}</div><div class="eval-item-feedback" id="evalFbExp${i}" aria-live="polite"></div>`;
    s2.appendChild(d);
  });
  out.appendChild(s2);

  const cifItems = genCifrasItems();
  const s3 = document.createElement('div');
  s3.innerHTML = '<div class="eval-section-title">III. Escribe el número en cifras <span class="eval-pts">20 pts · 4 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel medio. Lee el número en palabras y escríbelo en cifras. Los últimos ítems traen trampas de ceros.</p>';
  cifItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">«${it.words}»</span><input class="eval-cp-input" type="text" data-cif="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${_fmtNum(it.ansNum)}</div><div class="eval-item-feedback" id="evalFbCif${i}" aria-live="polite"></div>`;
    s3.appendChild(d);
  });
  out.appendChild(s3);

  const probItems = genProblemaItems();
  const s4 = document.createElement('div');
  s4.innerHTML = '<div class="eval-section-title">IV. Problemas de la vida real <span class="eval-pts">30 pts · 10 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel avanzado. Resuelve en tu cuaderno alineando las cifras por su valor posicional (¡cuida el acarreo!) y escribe el resultado.</p>';
  probItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${it.text}</span></div><div class="opx-row" style="margin-left:1.7rem;"><span>R/</span><input class="eval-cp-input" type="text" data-prob="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${_fmtNum(it.ansNum)}</div><div class="eval-item-feedback" id="evalFbProb${i}" aria-live="polite"></div>`;
    s4.appendChild(d);
  });
  out.appendChild(s4);

  const retos = genRetosItems();
  const s5 = document.createElement('div');
  s5.innerHTML = '<div class="eval-section-title">V. Retos de pensamiento numérico <span class="eval-pts">20 pts · 5 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel desafío. Cuatro retos que replican los errores comunes y los widgets de la misión.</p>';
  const dOrd = document.createElement('div'); dOrd.className = 'eval-item eval-auto-item evord-group';
  dOrd.innerHTML = `<div class="evord-dir">1. Ordena de MAYOR a menor:</div><div class="evord-list" id="evordNumList0"></div><div class="eval-answer">${retos.ordGroup.correctOrder.join(' · ')}</div><div class="eval-item-feedback" id="evalFbOrdNum0" aria-live="polite"></div>`;
  s5.appendChild(dOrd);
  const dDet = document.createElement('div'); dDet.className = 'eval-item eval-auto-item';
  dDet.innerHTML = `<div class="eval-q"><span class="eval-num">2</span><span class="eval-q-text">🔎 Detective del error: ${retos.det.who} escribió «${retos.det.words}» como <strong>${retos.det.wrong}</strong>. Olvidó los ceros de relleno. Escribe el número correcto en cifras.</span></div><div class="opx-row" style="margin-left:1.7rem;"><span>R/</span><input class="eval-cp-input" type="text" data-det="0" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${_fmtNum(retos.det.ansNum)}</div><div class="eval-item-feedback" id="evalFbDet" aria-live="polite"></div>`;
  s5.appendChild(dDet);
  const dMaq = document.createElement('div'); dMaq.className = 'eval-item eval-auto-item';
  dMaq.innerHTML = `<div class="eval-q"><span class="eval-num">3</span><span class="eval-q-text">⚙️ Máquina ×10: si el número ${retos.maq.num} entra a la máquina ×10, ¿qué número sale?</span></div><div class="opx-row" style="margin-left:1.7rem;"><span>R/</span><input class="eval-cp-input" type="text" data-maq="0" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${_fmtNum(retos.maq.ansNum)}</div><div class="eval-item-feedback" id="evalFbMaq" aria-live="polite"></div>`;
  s5.appendChild(dMaq);
  const dCmp = document.createElement('div'); dCmp.className = 'eval-item eval-auto-item';
  dCmp.innerHTML = `<div class="eval-q"><span class="eval-num">4</span><span class="eval-q-text">⚖️ Sin calcular: cuenta las cifras y decide cuál número es mayor. A: ${retos.cmp.a} &nbsp;·&nbsp; B: ${retos.cmp.b}</span></div><div class="eval-cmp-opts"><label class="eval-cmp-opt"><input type="radio" name="retocmp" value="A"> A es mayor</label><label class="eval-cmp-opt"><input type="radio" name="retocmp" value="B"> B es mayor</label></div><div class="eval-answer">${retos.cmp.ans==='A'?'A es mayor':'B es mayor'}</div><div class="eval-item-feedback" id="evalFbRcmp" aria-live="polite"></div>`;
  s5.appendChild(dCmp);
  out.appendChild(s5);

  window._evalOpData = { valItems, expItems, cifItems, probItems, retos, ord: [{ current: [...retos.ordGroup.display], correctOrder: retos.ordGroup.correctOrder }] };
  _renderOrdNumGroup(0);
  const autoPanel = document.createElement('div'); autoPanel.id = 'evalOpAutoResult'; autoPanel.className = 'eval-auto-result';
  autoPanel.innerHTML = '<strong>🧮 Prueba interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato para resolver en papel.';
  out.appendChild(autoPanel);
  fin('s-evaluacion');
}

function _renderOrdNumGroup(gi) {
  const data = window._evalOpData.ord[gi];
  const list = document.getElementById('evordNumList' + gi); if (!list) return;
  list.innerHTML = '';
  data.current.forEach((label, i) => {
    const div = document.createElement('div'); div.className = 'evord-item';
    div.innerHTML = `<div class="evord-arrows"><button class="sort-arrow" onclick="evordNumMove(${gi},${i},-1)"${i===0?' disabled':''}>▲</button><button class="sort-arrow" onclick="evordNumMove(${gi},${i},1)"${i===data.current.length-1?' disabled':''}>▼</button></div><div class="evord-num">${label}</div>`;
    list.appendChild(div);
  });
}
function evordNumMove(gi, idx, dir) {
  sfx('click');
  const data = window._evalOpData.ord[gi]; const ni = idx + dir;
  if (ni < 0 || ni >= data.current.length) return;
  [data.current[idx], data.current[ni]] = [data.current[ni], data.current[idx]];
  _renderOrdNumGroup(gi);
}

function toggleEvalOpAns() {
  evalOpAnsVisible = !evalOpAnsVisible;
  document.querySelectorAll('#evalOpOut .eval-answer').forEach(el => el.style.display = evalOpAnsVisible ? 'block' : 'none');
  sfx('click');
}

function gradeEvalOp() {
  if (!window._evalOpData) { showToast('⚠️ Genera una prueba operativa primero'); return; }
  sfx('click');
  const d = window._evalOpData;
  let total = 0; const det = { val: 0, exp: 0, cif: 0, prob: 0, reto: 0 };
  d.valItems.forEach((it, i) => { const el = document.querySelector(`[data-val="${i}"]`); const ok = _isIntMatch(el ? el.value : '', it.ansNum); if (el) { el.classList.toggle('eval-input-ok', ok); el.classList.toggle('eval-input-no', !ok); } if (ok) { det.val++; total += 4; } setEvalFeedback('evalFbVal' + i, ok, ok ? 'Correcto. +4 pts' : 'Revisar. R/ ' + _fmtNum(it.ansNum)); });
  d.expItems.forEach((it, i) => { const el = document.querySelector(`[data-exp="${i}"]`); const ok = _isIntMatch(el ? el.value : '', it.ansNum); if (el) { el.classList.toggle('eval-input-ok', ok); el.classList.toggle('eval-input-no', !ok); } if (ok) { det.exp++; total += 2; } setEvalFeedback('evalFbExp' + i, ok, ok ? 'Correcto. +2 pts' : 'Revisar. R/ ' + _fmtNum(it.ansNum)); });
  d.cifItems.forEach((it, i) => { const el = document.querySelector(`[data-cif="${i}"]`); const ok = _isIntMatch(el ? el.value : '', it.ansNum); if (el) { el.classList.toggle('eval-input-ok', ok); el.classList.toggle('eval-input-no', !ok); } if (ok) { det.cif++; total += 4; } setEvalFeedback('evalFbCif' + i, ok, ok ? 'Correcto. +4 pts' : 'Revisar. R/ ' + _fmtNum(it.ansNum)); });
  d.probItems.forEach((it, i) => { const el = document.querySelector(`[data-prob="${i}"]`); const ok = _isIntMatch(el ? el.value : '', it.ansNum); if (el) { el.classList.toggle('eval-input-ok', ok); el.classList.toggle('eval-input-no', !ok); } if (ok) { det.prob++; total += 10; } setEvalFeedback('evalFbProb' + i, ok, ok ? 'Correcto. +10 pts' : 'Revisar. R/ ' + _fmtNum(it.ansNum)); });
  const g = d.ord[0];
  const okOrd = g.current.every((v, i) => v === g.correctOrder[i]);
  if (okOrd) { det.reto += 5; total += 5; }
  setEvalFeedback('evalFbOrdNum0', okOrd, okOrd ? '¡Orden correcto! +5 pts' : 'Orden incorrecto. Clave: ' + g.correctOrder.join(' · '));
  const elDet = document.querySelector('[data-det="0"]');
  const okDet = _isIntMatch(elDet ? elDet.value : '', d.retos.det.ansNum);
  if (elDet) { elDet.classList.toggle('eval-input-ok', okDet); elDet.classList.toggle('eval-input-no', !okDet); }
  if (okDet) { det.reto += 5; total += 5; }
  setEvalFeedback('evalFbDet', okDet, okDet ? '¡Error detectado! +5 pts' : 'Revisar. R/ ' + _fmtNum(d.retos.det.ansNum));
  const elMaq = document.querySelector('[data-maq="0"]');
  const okMaq = _isIntMatch(elMaq ? elMaq.value : '', d.retos.maq.ansNum);
  if (elMaq) { elMaq.classList.toggle('eval-input-ok', okMaq); elMaq.classList.toggle('eval-input-no', !okMaq); }
  if (okMaq) { det.reto += 5; total += 5; }
  setEvalFeedback('evalFbMaq', okMaq, okMaq ? 'Correcto. +5 pts' : 'Revisar. R/ ' + _fmtNum(d.retos.maq.ansNum));
  const selC = document.querySelector('input[name="retocmp"]:checked');
  const okCmp = !!selC && selC.value === d.retos.cmp.ans;
  if (okCmp) { det.reto += 5; total += 5; }
  setEvalFeedback('evalFbRcmp', okCmp, okCmp ? 'Correcto. +5 pts' : 'Revisar. R/ ' + (d.retos.cmp.ans === 'A' ? 'A es mayor' : 'B es mayor'));
  const res = document.getElementById('evalOpAutoResult');
  if (res) { res.className = 'eval-auto-result ' + (total >= 70 ? 'eval-auto-pass' : 'eval-auto-risk'); res.innerHTML = `<strong>Resultado: ${total}/100 pts</strong><br><span>Valor del dígito: ${det.val*4}/20 · Expandida: ${det.exp*2}/10 · Cifras: ${det.cif*4}/20 · Problemas: ${det.prob*10}/30 · Retos: ${det.reto}/20</span>`; }
  if (total >= 70) { pts(8); showToast('🎯 Prueba operativa calificada: ' + total + '/100'); }
  else showToast('🧮 Prueba operativa: ' + total + '/100. Revisa los ítems marcados.');
}

function printEvalOp() {
  if (!window._evalOpData) { showToast('⚠️ Genera una prueba operativa primero'); return; }
  sfx('click');
  const forma = window._currentEvalOpForm || 1; const d = window._evalOpData;
  let s1 = `<div class="sec-title"><span>I. Escribe el valor del dígito indicado</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Nivel básico. Escribe el valor total que representa el dígito señalado. 4 pts c/u.</p>`;
  d.valItems.forEach((it, i) => { s1 += `<div class="opx-print-row"><span class="qn">${i+1}.</span><span class="opx-print-expr">En ${it.num}, ¿cuánto vale el dígito ${it.digit} (${it.posLabel})?</span><span class="opx-blank"></span></div>`; });
  const expH = Math.ceil(d.expItems.length / 2);
  const expTbl = (items, off) => `<table class="rnd-tbl"><tr><th>#</th><th>Forma expandida</th><th>Sumando faltante</th></tr>${items.map((it, i) => `<tr><td>${off+i+1}</td><td>${it.num} = ${it.display}</td><td></td></tr>`).join('')}</table>`;
  let s2 = `<div class="sec-title"><span>II. Completa la forma expandida</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10 pts</span></div></div><p class="opx-instr">Nivel básico. Escribe el sumando que falta; atención a los ceros de relleno. 2 pts c/u.</p><div class="rnd-print-grid">${expTbl(d.expItems.slice(0,expH),0)}${expTbl(d.expItems.slice(expH),expH)}</div>`;
  let s3 = `<div class="sec-title"><span>III. Escribe el número en cifras</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Nivel medio. Lee el número en palabras y escríbelo en cifras. ¡Cuidado con las trampas de ceros! 4 pts c/u.</p>`;
  d.cifItems.forEach((it, i) => { s3 += `<div class="opx-print-row"><span class="qn">${i+1}.</span><span class="opx-print-words">«${it.words}»</span><span class="opx-blank"></span></div>`; });
  let s4 = `<div class="sec-title"><span>IV. Problemas de la vida real</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 30 pts</span></div></div><p class="opx-instr">Nivel avanzado. Resuelve alineando las cifras por su valor posicional; cuida el acarreo. 10 pts c/u.</p>`;
  d.probItems.forEach((it, i) => { s4 += `<div class="prob-print-box"><div class="prob-print-text"><span class="qn">${i+1}.</span> ${it.text}</div><div class="prob-op-space"></div><div class="prob-ans">R/ ______________________</div></div>`; });
  const r = d.retos;
  let s5 = `<div class="sec-title"><span>V. Retos de pensamiento numérico</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Nivel desafío. 5 pts c/u.</p>`;
  s5 += `<div class="ord-print-box"><div class="ord-print-dir">1. Ordena de Mayor a Menor:</div><table class="ord-print-tbl"><tr>${d.ord[0].current.map(v=>`<td>${v}</td>`).join('')}</tr></table><div style="margin-top:0.3rem;font-size:8.5pt;color:#555;">Escribe en orden: 1. _______ &nbsp; 2. _______ &nbsp; 3. _______ &nbsp; 4. _______</div></div>`;
  s5 += `<div class="reto-print-row"><span class="qn">2.</span> 🔎 Detective del error: ${r.det.who} escribió «${r.det.words}» como <strong>${r.det.wrong}</strong>. Olvidó los ceros de relleno. Escribe el número correcto en cifras: <span class="opx-blank"></span></div>`;
  s5 += `<div class="reto-print-row"><span class="qn">3.</span> ⚙️ Máquina ×10: si el número ${r.maq.num} entra a la máquina ×10, ¿qué número sale? <span class="opx-blank"></span></div>`;
  s5 += `<div class="reto-print-row"><span class="qn">4.</span> ⚖️ Sin calcular, cuenta las cifras y encierra el número MAYOR: &nbsp; A: ${r.cmp.a} &nbsp;·&nbsp; B: ${r.cmp.b}</div>`;
  let pR = '';
  pR += `<div class="p-sec"><div class="p-ttl">I. Valor del dígito (4 pts c/u)</div><table class="p-tbl">${d.valItems.map((it,i)=>`<tr><td class="pn">${i+1}.</td><td class="pa">${_fmtNum(it.ansNum)}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">II. Forma expandida (2 pts c/u)</div><table class="p-tbl">${d.expItems.map((it,i)=>`<tr><td class="pn">${i+1}.</td><td class="pa">${_fmtNum(it.ansNum)}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">III. Número en cifras (4 pts c/u)</div><table class="p-tbl">${d.cifItems.map((it,i)=>`<tr><td class="pn">${i+1}.</td><td class="pa">${_fmtNum(it.ansNum)}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">IV. Problemas (10 pts c/u)</div><table class="p-tbl">${d.probItems.map((it,i)=>`<tr><td class="pn">${i+1}.</td><td class="pa">${_fmtNum(it.ansNum)} (${it.op === '+' ? 'suma' : 'resta'})</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec" style="grid-column:1/-1;"><div class="p-ttl">V. Retos (5 pts c/u)</div><div class="p-ord-line"><strong>1.</strong> ${d.ord[0].correctOrder.join(' · ')}</div><div class="p-ord-line"><strong>2.</strong> ${_fmtNum(r.det.ansNum)}</div><div class="p-ord-line"><strong>3.</strong> ${_fmtNum(r.maq.ansNum)}</div><div class="p-ord-line"><strong>4.</strong> ${r.cmp.ans === 'A' ? 'A es mayor' : 'B es mayor'} (${r.cmp.ans === 'A' ? r.cmp.a : r.cmp.b})</div></div>`;
  const doc = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Prueba Operativa Valor Posicional · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11.5pt;color:#111;background:#fff;padding:4mm 6mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.5rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;color:#1565c0;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:#1565c0;margin-top:0.15rem;font-weight:700;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.5rem 0 0.22rem;border-left:4px solid #1565c0;background:#e3f2fd;display:flex;justify-content:space-between;align-items:center;color:#1565c0;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:#1565c0;font-weight:700;font-style:italic;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #1565c0;height:12px;}.qn{font-weight:700;min-width:20px;display:inline-block;color:#1565c0;}.opx-instr{font-size:9pt;color:#555;margin-bottom:0.25rem;}.opx-print-row{display:flex;align-items:baseline;gap:0.4rem;font-size:11pt;padding:0.22rem 0.2rem;border-bottom:1px dotted #ddd;}.opx-print-expr{font-family:'Courier New',monospace;font-weight:700;}.opx-blank{display:inline-block;width:140px;flex:none;border-bottom:1.5px solid #111;min-height:14px;margin-left:0.4rem;}.rnd-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 1rem;margin-top:0.2rem;}.rnd-tbl{width:100%;border-collapse:collapse;font-size:9pt;}.rnd-tbl th,.rnd-tbl td{border:1px solid #bbb;padding:0.15rem 0.35rem;text-align:left;}.rnd-tbl th{background:#e3f2fd;color:#1565c0;font-size:8.5pt;}.opx-print-words{flex:1;font-style:italic;font-weight:700;}.prob-print-box{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.45rem;margin-bottom:0.28rem;font-size:10.5pt;line-height:1.45;break-inside:avoid;}.prob-print-text{margin-bottom:0.2rem;}.prob-op-space{min-height:44px;border:1px dashed #bbb;border-radius:3px;margin:0.22rem 0;}.prob-ans{font-weight:700;color:#1565c0;}.reto-print-row{font-size:10.5pt;padding:0.24rem 0.2rem;border-bottom:1px dotted #ddd;line-height:1.5;display:flex;align-items:baseline;gap:0.35rem;flex-wrap:wrap;}.ord-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.8rem;margin-top:0.2rem;}.ord-print-box{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.4rem;break-inside:avoid;}.ord-print-dir{font-size:9pt;font-weight:700;color:#1565c0;margin-bottom:0.2rem;}.ord-print-tbl{width:100%;border-collapse:collapse;font-size:9.5pt;}.ord-print-tbl td{border:1px solid #bbb;padding:0.12rem 0.25rem;text-align:center;font-family:'Courier New',monospace;}.total-row{display:flex;align-items:baseline;justify-content:flex-end;gap:7px;font-size:11pt;color:#1565c0;font-weight:700;font-style:italic;margin-top:0.5rem;padding:0.2rem 0.5rem;background:#e3f2fd;border-radius:4px;}.total-row .obt-line{min-width:80px;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #1565c0;padding-bottom:0.35rem;margin-bottom:0.5rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;color:#1565c0;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #cce0ff;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;color:#1565c0;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#1565c0;}.pa{color:#007a00;font-weight:600;font-family:'Courier New',monospace;}.p-ord-line{font-size:10.5pt;margin-bottom:0.2rem;color:#007a00;}.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:8mm 10mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Examen de Matemáticas — Prueba Operativa · Valor Posicional hasta el Millón · Educación Básica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 pts · I: 20 · II: 10 · III: 20 · IV: 30 · V: 20 · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✔ PAUTA — Prueba Operativa · Valor Posicional · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">100 pts · Matemáticas · Educación Básica</div></div><div class="p-grid">${pR}</div></div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("evalPage",250,0.55,1.2);fit("pautaPage",250,0.55,1.2);})();</script></body></html>`;
  const win = window.open('', '_blank', '');
  if (!win) { showToast('⚠️ Activa las ventanas emergentes para imprimir'); return; }
  win.document.write(doc); win.document.close(); setTimeout(() => win.print(), 400);
}

// ===================== DIPLOMA =====================
function _diplPct() { return xp >= MXP ? 100 : Math.round((xp / MXP) * 100); }
function openDiploma(){
  sfx('click');
  const pct = _diplPct();
  document.getElementById('diplPct').textContent=pct+'%';
  document.getElementById('diplPct').style.color=pct>=70?'var(--jade)':pct>=40?'var(--blue)':'var(--amber)';
  document.getElementById('diplBar').style.width=pct+'%';
  const stars=pct===100?'⭐⭐⭐⭐⭐':pct>=80?'⭐⭐⭐⭐':pct>=60?'⭐⭐⭐':pct>=40?'⭐⭐':'⭐';
  document.getElementById('diplStars').textContent=stars;
  const msgs=['💡 ¡ÁNIMO! Comienza tu misión. ¡Cada paso cuenta!','🌱 ¡GRAN INICIO! Estás dando los primeros pasos.','🔢 ¡BUEN TRABAJO! Vas progresando muy bien.','💪 ¡MUY BIEN! Dominas gran parte del contenido.','🏅 ¡INCREÍBLE avance! Estás cerca de la excelencia.','🎓 ¡EXTRAORDINARIO! Completaste TODA la misión. ¡Eres experto en Valor Posicional!'];
  const mi=pct===100?5:pct>=80?4:pct>=60?3:pct>=40?2:pct>=20?1:0;
  document.getElementById('diplMsg').textContent=msgs[mi];
  document.getElementById('diplDate').textContent='Honduras, '+new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});
  const achStr=unlockedAch.length>0?'🏆 Logros: '+unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(', '):'Sin logros aún — ¡sigue completando secciones!';
  document.getElementById('diplAch').textContent=achStr;
  document.getElementById('diplomaOverlay').classList.add('open');
  document.querySelector('.diploma-input').focus();
}
function closeDiploma(){ document.getElementById('diplomaOverlay').classList.remove('open'); }
function updateDiplomaName(v){ document.getElementById('diplName').textContent=v||'Estudiante'; }
function shareWA(){
  const pct = _diplPct(); const name=document.getElementById('diplName').textContent;
  const stars=document.getElementById('diplStars').textContent;
  const msg=document.getElementById('diplMsg').textContent;
  const date=document.getElementById('diplDate').textContent;
  const achText=unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join('\n');
  const txt=`${stars} CONSTANCIA DE LOGRO ${stars}\n\n📚 Misión: Valor Posicional hasta el Millón\n👤 Estudiante: ${name}\n📊 Progreso: ${pct}% completado\n⭐ XP obtenido: ${xp} de ${MXP}${achText?'\n\n🏆 Logros desbloqueados:\n'+achText:''}\n\n${msg}\n\n📅 ${date}\n🏠 Proyecto Educativo M.E.T.A.S\n🌐 policastsapien.com`;
  _waShare(txt);
}

async function captureDiploma() {
    if (typeof html2canvas === 'undefined') { showToast('⚠️ Cargando... intenta de nuevo'); return; }
    sfx('click');
    const card = document.querySelector('.diploma-card');
    const btn = document.querySelector('.diploma-actions .btn-pri');
    const toHide = [card.querySelector('.diploma-input'), card.querySelector('.diploma-actions'), card.querySelector('hr')];
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Capturando...'; }
    toHide.forEach(el => { if (el) el.style.display = 'none'; });
    let dataUrl = '';
    try {
        const canvas = await html2canvas(card, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
        toHide.forEach(el => { if (el) el.style.display = ''; });
        dataUrl = canvas.toDataURL('image/png');
        const name = (document.getElementById('diplName').textContent || 'Estudiante').replace(/\s+/g, '-');
        const fileName = 'constancia-' + name + '.png';
        const cap = window.Capacitor;
        if (cap && cap.isNativePlatform && cap.isNativePlatform() && cap.Plugins?.Filesystem && cap.Plugins?.Share) {
            const base64Data = dataUrl.split(',')[1];
            const result = await cap.Plugins.Filesystem.writeFile({ path: fileName, data: base64Data, directory: 'CACHE' });
            await cap.Plugins.Share.share({ url: result.uri, dialogTitle: 'Guardar / Compartir Constancia' });
        } else {
            const a = document.createElement('a');
            a.href = dataUrl; a.download = fileName; a.click();
        }
    } catch (e) {
        toHide.forEach(el => { if (el) el.style.display = ''; });
        if (e.name !== 'AbortError') showToast('⚠️ No se pudo guardar la constancia');
    } finally {
        if (btn) { btn.disabled = false; btn.textContent = '📷 Guardar foto'; }
    }
}
// ===================== INIT =====================
document.addEventListener('DOMContentLoaded',()=>{
  initTheme();
  loadProgress();
  upFC(); buildQz(); buildClass(); showId(); showCmp(); buildSopa(); genEval(); genEvalOp();
  buildPredice();
  buildExplica();
  document.addEventListener('click',function(e){ const panel=document.getElementById('achPanel'); const btn=document.getElementById('achBtn'); if(panel.classList.contains('open')&&!panel.contains(e.target)&&e.target!==btn) panel.classList.remove('open'); });
  document.addEventListener('click',function(e){ if(e.target===document.getElementById('diplomaOverlay')) closeDiploma(); });
  const savedName=localStorage.getItem('nombreEstudianteValorPosicional');
  const inputName=document.querySelector('.diploma-input');
  if(savedName&&inputName){ inputName.value=savedName; updateDiplomaName(savedName); }
  if(inputName) inputName.addEventListener('input',e=>localStorage.setItem('nombreEstudianteValorPosicional',e.target.value));
  fin('s-aprende',false);
  fin('s-tipos',false);
  fin('s-errores',false);
});

// Formas deterministas v1: selectores de forma visibles desde la carga de la página
(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalOp==='function') _injectFormaSel('genEvalOp','evalOpFormaSel',evalOpFormNum,function(v){evalOpFormNum=v;}); }catch(e){} try{ if(typeof genEvalCrit==='function') _injectFormaSel('genEvalCrit','evalCritFormaSel',evalCritFormNum,function(v){evalCritFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();
