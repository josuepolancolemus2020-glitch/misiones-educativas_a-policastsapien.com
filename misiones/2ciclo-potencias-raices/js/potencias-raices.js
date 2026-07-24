// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
// Compartir misión por WhatsApp
function compartirMision() {
    const url = window.location.href;
    const texto = `🚀 *Misión Asignada: Potencias y Raíces Cuadradas* 🚀\n\nPractica las potencias y la raíz cuadrada de los cuadrados perfectos menores que 200. 🏆\n\nDesbloquea *todos los logros* y puedes poner *tus datos* para que tu maestro observe todos tus logros. 📋\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;
    _waShare(texto);
}

// ===================== ACCESIBILIDAD =====================
function toggleLetra() {
  document.body.classList.toggle('letra-grande');
  if(typeof sfx === 'function') sfx('click');
  localStorage.setItem('prefLetraPotenciasRaices', document.body.classList.contains('letra-grande'));
}
window.addEventListener('DOMContentLoaded', () => {
  if(localStorage.getItem('prefLetraPotenciasRaices') === 'true') document.body.classList.add('letra-grande');
});

// ===================== UTILIDADES =====================
const _pick = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
const _shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
function fb(id, msg, isOk) {
  const el = document.getElementById(id);
  if(el) { el.textContent = msg; el.className = 'fb show ' + (isOk ? 'ok' : 'err'); }
}

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY = 'matematica_potencias_raices_v1';
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
function launchConfetti(){ const colors=['#7c3aed','#f59e0b','#00b894','#fdcb6e','#0984e3']; for(let i=0;i<60;i++){ const c=document.createElement('div'); c.className='confetti-piece'; c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`; document.body.appendChild(c); c.addEventListener('animationend',()=>c.remove()); } }

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
  {w:'Potencia',a:'Operación que representa una multiplicación repetida de un mismo número.'},
  {w:'Base',a:'El número que se multiplica por sí mismo en una potencia.'},
  {w:'Exponente',a:'Indica cuántas veces se multiplica la base por sí misma.'},
  {w:'Cuadrado de un número',a:'n² = n × n. Ejemplo: <strong>6² = 36</strong>.'},
  {w:'Raíz Cuadrada',a:'Operación inversa a elevar al cuadrado. <strong>√36 = 6</strong> porque 6² = 36.'},
  {w:'Cuadrado Perfecto',a:'Número que resulta de elevar al cuadrado un número entero. Ejemplos: 1, 4, 9, 16, 25...'},
  {w:'Radical (√)',a:'Símbolo que representa la raíz cuadrada de un número.'},
  {w:'12²',a:'= <strong>144</strong>'},
  {w:'√169',a:'= <strong>13</strong>'},
  {w:'14²',a:'= <strong>196</strong> (el mayor cuadrado perfecto menor que 200)'},
  {w:'Notación de potencia',a:'Se escribe base<sup>exponente</sup>. Ejemplo: <strong>8²</strong>.'},
  {w:'Orden de operaciones',a:'Las potencias y raíces se resuelven <strong>antes</strong> que las sumas y restas.'},
  {w:'√1',a:'= <strong>1</strong> (el cuadrado perfecto más pequeño, mayor que 0)'},
  {w:'Representación gráfica',a:'Un cuadrado perfecto se puede dibujar como una cuadrícula de <strong>n filas por n columnas</strong>.'}
];
let fcIdx=0;
function upFC(){ document.getElementById('fcInner').classList.remove('flipped'); document.getElementById('fcW').innerHTML=fcData[fcIdx].w; document.getElementById('fcA').innerHTML=fcData[fcIdx].a; document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length; }
function flipCard(){ sfx('flip'); document.getElementById('fcInner').classList.toggle('flipped'); if(!xpTracker.fc.has(fcIdx)){ xpTracker.fc.add(fcIdx); pts(1); } if(xpTracker.fc.size===fcData.length){ fin('s-flash'); unlockAchievement('flash_master'); } }
function nextFC(){ sfx('click'); fcIdx=(fcIdx+1)%fcData.length; upFC(); }
function prevFC(){ sfx('click'); fcIdx=(fcIdx-1+fcData.length)%fcData.length; upFC(); }

// ===================== QUIZ DATA =====================
const qzData=[
  {q:'¿Cuánto es 9²?',o:['a) 18','b) 81','c) 72','d) 99'],c:1},
  {q:'¿Cuál es la raíz cuadrada de 100?',o:['a) 50','b) 100','c) 10','d) 20'],c:2},
  {q:'¿Cuál de estos es un cuadrado perfecto?',o:['a) 150','b) 144','c) 130','d) 190'],c:1,feedback:'144 = 12². Los demás no son el resultado exacto de elevar un entero al cuadrado.'},
  {q:'¿Cuánto es 6²?',o:['a) 12','b) 62','c) 36','d) 66'],c:2},
  {q:'¿Cuál es la raíz cuadrada de 196?',o:['a) 13','b) 14','c) 98','d) 196'],c:1},
  {q:'En la potencia 8², ¿cuál es el exponente?',o:['a) 8','b) 2','c) 16','d) 64'],c:1},
  {q:'¿Cuánto es √25 + 3²?',o:['a) 14','b) 11','c) 28','d) 8'],c:0,feedback:'√25=5 y 3²=9. 5+9=14.'},
  {q:'¿Cuál es el cuadrado perfecto más grande menor que 200?',o:['a) 169','b) 196','c) 225','d) 144'],c:1,feedback:'14²=196 es menor que 200. 15²=225 ya lo supera.'},
  {q:'¿Cuánto es 12²?',o:['a) 24','b) 144','c) 122','d) 121'],c:1},
  {q:'¿Por qué 50 no tiene raíz cuadrada exacta?',o:['a) Porque es un número par','b) Porque está entre 7² y 8²','c) Porque es mayor que 25','d) Porque es un número primo'],c:1}
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
    label:['Es cuadrado perfecto','No es cuadrado perfecto'], headA:'✅ Es cuadrado perfecto', headB:'❌ No es cuadrado perfecto', colA:'si', colB:'no',
    words:[{w:'36',t:'si'},{w:'50',t:'no'},{w:'81',t:'si'},{w:'100',t:'si'},{w:'110',t:'no'},{w:'144',t:'si'},{w:'150',t:'no'},{w:'169',t:'si'},{w:'180',t:'no'},{w:'196',t:'si'}]
  },
  {
    label:['Raíz menor que 10','Raíz 10 o mayor'], headA:'⬇️ Raíz cuadrada menor que 10', headB:'⬆️ Raíz cuadrada 10 o mayor', colA:'menor', colB:'mayor',
    words:[{w:'16',t:'menor'},{w:'49',t:'menor'},{w:'81',t:'menor'},{w:'25',t:'menor'},{w:'64',t:'menor'},{w:'100',t:'mayor'},{w:'121',t:'mayor'},{w:'144',t:'mayor'},{w:'169',t:'mayor'},{w:'196',t:'mayor'}]
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
  {s:['La','potencia','representa','una','multiplicación','repetida.'],c:1,art:'Operación que representa multiplicación repetida de un mismo número'},
  {s:['El','exponente','indica','cuántas','veces','se','repite','la','base.'],c:1,art:'Número que indica cuántas veces se multiplica la base'},
  {s:['Treinta','y','seis','es','un','cuadrado','perfecto.'],c:5,art:'Resultado de elevar un número entero al cuadrado'},
  {s:['La','raíz','de','un','número','deshace','la','potencia.'],c:1,art:'Operación inversa a elevar al cuadrado'},
  {s:['El','símbolo','radical','representa','la','raíz','cuadrada.'],c:2,art:'Símbolo √'},
  {s:['Nueve','al','cuadrado','es','ochenta','y','uno.'],c:2,art:'Palabra que indica exponente 2'},
  {s:['Cincuenta','no','tiene','raíz','cuadrada','exacta.'],c:3,art:'Operación inversa que no da resultado exacto en 50'},
  {s:['Las','potencias','se','resuelven','antes','que','las','sumas.'],c:1,art:'Concepto que se resuelve primero según el orden de operaciones'}
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
  {s:'En la potencia 9², el 9 es la ___.',opts:['base','exponente','raíz'],c:0},
  {s:'La raíz cuadrada de 144 es ___.',opts:['12','72','24'],c:0},
  {s:'Un número que resulta de elevar un entero al cuadrado se llama ___ perfecto.',opts:['cuadrado','triángulo','círculo'],c:0},
  {s:'Según el orden de operaciones, las potencias se resuelven ___ que las sumas.',opts:['antes','después','nunca'],c:0},
  {s:'El símbolo que representa la raíz cuadrada se llama ___.',opts:['exponente','radical','base'],c:1},
  {s:'150 ___ un cuadrado perfecto.',opts:['es','no es','casi es'],c:1},
  {s:'El cuadrado perfecto más grande menor que 200 es ___.',opts:['169','196','225'],c:1},
  {s:'La raíz cuadrada de 81 es ___.',opts:['9','40.5','18'],c:0}
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
    q: '¿Cuánto es 5² (5 al cuadrado)?',
    opts: ['10', '25', '52'],
    correct: 1,
    feedback: '¡Correcto! 5² = 5×5 = 25, no 5×2.',
    wrongFeedback: 'La respuesta es 25. 5² significa 5×5 = 25, no 5×2 = 10. ¡Aprenderás por qué en la sección Aprende!'
  },
  {
    q: '¿Cuál es la raíz cuadrada de 81?',
    opts: ['8', '9', '40.5'],
    correct: 1,
    feedback: '¡Excelente! 9×9=81, así que √81=9.',
    wrongFeedback: 'La respuesta es 9. Busca qué número, multiplicado por sí mismo, da 81: 9×9=81.'
  },
  {
    q: '¿Es 50 un cuadrado perfecto?',
    opts: ['Sí', 'No', 'Solo a veces'],
    correct: 1,
    feedback: '¡Muy bien! 50 está entre 49 (7²) y 64 (8²), no es el resultado exacto de elevar un entero al cuadrado.',
    wrongFeedback: 'La respuesta es No. 50 está entre 49 (7²) y 64 (8²), así que no es un cuadrado perfecto.'
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
  {w:'√1',t:'menor'}, {w:'√4',t:'menor'}, {w:'√9',t:'menor'}, {w:'√16',t:'menor'}, {w:'√25',t:'menor'},
  {w:'√36',t:'menor'}, {w:'√49',t:'menor'}, {w:'√64',t:'menor'}, {w:'√81',t:'menor'}, {w:'√100',t:'igual'},
  {w:'√121',t:'mayor'}, {w:'√144',t:'mayor'}, {w:'√169',t:'mayor'}, {w:'√196',t:'mayor'}
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
        const labels={mayor:'MAYOR que 10',menor:'MENOR que 10',igual:'IGUAL a 10'};
        _fb.textContent=`La raíz cuadrada de ${retoCurrent.w} es ${labels[retoCurrent.t]}`;
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
  {s:'La base es el número que se multiplica por sí mismo.',type:'Concepto: Base'},
  {s:'El exponente indica cuántas veces se repite la base.',type:'Concepto: Exponente'},
  {s:'36 es un cuadrado perfecto porque 6²=36.',type:'Ejemplo de cuadrado perfecto'},
  {s:'La raíz cuadrada deshace la potencia al cuadrado.',type:'Concepto: Raíz Cuadrada'},
  {s:'Las potencias se resuelven antes que las sumas.',type:'Regla de orden de operaciones'},
  {s:'150 no tiene raíz cuadrada exacta.',type:'Propiedad de los cuadrados perfectos'}
];
const classifyTaskDB=[
  {w:'81',pos:'Cuadrado Perfecto',val:'9²=81, √81=9',equiv:'Nueve al cuadrado'},
  {w:'150',pos:'No es Cuadrado Perfecto',val:'Está entre 144 (12²) y 169 (13²)',equiv:'No tiene raíz exacta'},
  {w:'196',pos:'Cuadrado Perfecto',val:'14²=196, √196=14',equiv:'Catorce al cuadrado'},
  {w:'50',pos:'No es Cuadrado Perfecto',val:'Está entre 49 (7²) y 64 (8²)',equiv:'No tiene raíz exacta'},
  {w:'121',pos:'Cuadrado Perfecto',val:'11²=121, √121=11',equiv:'Once al cuadrado'}
];
const completeTaskDB=[
  {s:'En la potencia 9², el 9 es la ___.',opts:['base','exponente','raíz'],ans:'base'},
  {s:'La raíz cuadrada de 144 es ___.',opts:['12','72','24'],ans:'12'},
  {s:'Un número que resulta de elevar un entero al cuadrado se llama ___ perfecto.',opts:['cuadrado','triángulo','círculo'],ans:'cuadrado'},
  {s:'Según el orden de operaciones, las potencias se resuelven ___ que las sumas.',opts:['antes','después','nunca'],ans:'antes'},
  {s:'El símbolo que representa la raíz cuadrada se llama ___.',opts:['exponente','radical','base'],ans:'radical'}
];
const explainQuestions=[
  {q:'Explica cómo se calcula 8².',ans:'Se multiplica 8 por sí mismo: 8×8=64.'},
  {q:'¿Por qué √30 no es un número entero?',ans:'Porque 30 está entre 25 (5²) y 36 (6²); no es el resultado exacto de elevar un entero al cuadrado.'},
  {q:'¿Qué operación deshace elevar al cuadrado?',ans:'La raíz cuadrada. Si n²=x, entonces √x=n.'}
];
const pensamientoTaskDB=[
  {q:'Encuentra el error: "7²=7×2=14".',ans:'El error es multiplicar por 2 en vez de elevar al cuadrado. Correcto: 7²=7×7=49.',type:'🔎 Detectar error'},
  {q:'Explica por qué 100 es un cuadrado perfecto pero 105 no lo es.',ans:'100=10×10 (10²), un entero elevado al cuadrado. 105 no es el resultado de ningún entero al cuadrado (está entre 10²=100 y 11²=121).',type:'💬 Justificar'},
  {q:'Inventa un problema con un jardín, mosaico o cuadrícula que use una potencia o raíz cuadrada.',ans:'Respuesta variable. Ej: "Un mosaico cuadrado tiene 144 baldosas en total, ¿cuántas baldosas tiene cada lado?" R: √144=12 baldosas por lado.',type:'✏️ Crear problema'},
  {q:'Resuelve 4² + √49 y explica cada paso.',ans:'4²=16. √49=7. 16+7=23.',type:'🧮 Resolver y explicar'},
  {q:'Sin calcular exactamente, ordena de mayor a menor: 9², √100, 6². Justifica.',ans:'9²=81, 6²=36, √100=10. Orden: 81 > 36 > 10.',type:'🧠 Razonar sin calcular'},
  {q:'¿Qué pasaría si en 3+5² sumas primero 3+5 y luego elevas al cuadrado?',ans:'Obtendrías 8²=64, que es incorrecto. El orden correcto es resolver primero 5²=25 y luego sumar 3: 3+25=28.',type:'⚠️ Analizar error'}
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
function genIdentifyTask(out,count){ _instrBlock(out,'Instrucción',['Copia en tu cuaderno; subraya el concepto matemático indicado.','<strong>Ejemplo:</strong> El número que se multiplica por sí mismo. → <span style="color:var(--jade);font-weight:700;">Concepto: Base</span>']); _pick(identifyTaskDB,Math.min(count,identifyTaskDB.length)).forEach((item,i)=>{ const div=document.createElement('div'); div.className='tg-task'; div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✔ ${item.type}</div></div>`; out.appendChild(div); }); }
function genClassifyTask(out,count){ _instrBlock(out,'Instrucción',['Copia la tabla. Escribe si el número es Cuadrado Perfecto o no, su descomposición (potencia/raíz) y su lectura.']); const items=_pick(classifyTaskDB,Math.min(count,classifyTaskDB.length)); const wrap=document.createElement('div'); wrap.style.overflowX='auto'; const th=(t,extra='')=>`<th style="padding:0.3rem 0.4rem;border:1px solid var(--border);font-size:0.72rem;text-align:center;${extra}">${t}</th>`; let html=`<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:480px;"><thead><tr style="background:var(--pri-gl);">${th('Número','text-align:left;')}${th('¿Cuadrado Perfecto?')}${th('Potencia / Raíz')}${th('Lectura')}</tr></thead><tbody>`; items.forEach(it=>{ html+=`<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td>`+Array(3).fill(`<td style="padding:0.4rem;border:1px solid var(--border);min-width:50px;"></td>`).join('')+'</tr>'; }); html+='</tbody></table>'; wrap.innerHTML=html; out.appendChild(wrap); const ans=document.createElement('div'); ans.className='tg-answer'; ans.style.marginTop='0.8rem'; ans.innerHTML='<strong>✔ Respuestas:</strong><br>'+items.map(it=>`<strong>${it.w}:</strong> ${it.pos} | ${it.val} | Lectura: ${it.equiv}`).join('<br>'); out.appendChild(ans); }
function genCompleteTask(out,count){ _instrBlock(out,'Instrucción',['Copia y resuelve en tu cuaderno. Elige la opción correcta para el espacio ___.']); const pool=_shuffle([...completeTaskDB]); for(let i=0;i<count;i++){ const item=pool[i%pool.length]; const div=document.createElement('div'); div.className='tg-task'; const sent=item.s.replace('___','<span class="tg-blank" style="min-width:90px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>'); div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${sent}</strong><div style="margin-top:0.4rem;font-size:0.82rem;color:var(--gray);">💡 Opciones: <strong>${item.opts.join(' | ')}</strong></div><div class="tg-answer">✔ ${item.ans}</div></div>`; out.appendChild(div); } }
function genExplainTask(out,count){ _instrBlock(out,'Instrucción',['Copia las preguntas en tu cuaderno y responde de forma clara.']); const pool=_shuffle([...explainQuestions]); for(let i=0;i<count;i++){ const item=pool[i%pool.length]; const div=document.createElement('div'); div.className='tg-task'; div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.3rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✔ ${item.ans}</div></div>`; out.appendChild(div); } }
function toggleAns(){ ansVisible=!ansVisible; document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none'); sfx('click'); }

// ===================== SOPA DE LETRAS =====================
const sopaSets=[
  {
    size:10,
    grid:[
      ['E','X','P','O','N','E','N','T','E','K'],
      ['P','O','T','E','N','C','I','A','L','M'],
      ['C','U','A','D','R','A','D','O','Q','S'],
      ['P','E','R','F','E','C','T','O','W','G'],
      ['R','A','D','I','C','A','L','H','J','N'],
      ['B','A','S','E','T','Y','U','V','W','X'],
      ['R','A','I','Z','C','D','F','G','H','J'],
      ['D','I','E','Z','K','L','M','N','O','P'],
      ['A','B','C','D','E','F','G','H','I','J'],
      ['Q','R','S','T','U','V','W','X','Y','Z']
    ],
    words:[
      {w:'EXPONENTE', cells:[[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8]]},
      {w:'POTENCIA',  cells:[[1,0],[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[1,7]]},
      {w:'CUADRADO',  cells:[[2,0],[2,1],[2,2],[2,3],[2,4],[2,5],[2,6],[2,7]]},
      {w:'PERFECTO',  cells:[[3,0],[3,1],[3,2],[3,3],[3,4],[3,5],[3,6],[3,7]]},
      {w:'RADICAL',   cells:[[4,0],[4,1],[4,2],[4,3],[4,4],[4,5],[4,6]]},
      {w:'BASE',      cells:[[5,0],[5,1],[5,2],[5,3]]},
      {w:'RAIZ',      cells:[[6,0],[6,1],[6,2],[6,3]]},
      {w:'DIEZ',      cells:[[7,0],[7,1],[7,2],[7,3]]}
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
  {q:'9²=81.',a:true},
  {q:'La raíz cuadrada de 100 es 50.',a:false},
  {q:'150 es un cuadrado perfecto.',a:false},
  {q:'En 6², el número 2 es el exponente.',a:true},
  {q:'Las potencias se resuelven después que las sumas.',a:false},
  {q:'√196=14.',a:true},
  {q:'5×2 es lo mismo que 5².',a:false},
  {q:'El cuadrado perfecto más grande menor que 200 es 196.',a:true},
  {q:'La raíz cuadrada deshace la operación de elevar al cuadrado.',a:true},
  {q:'√50 es un número entero exacto.',a:false}
];
const evalMCBank=[
  {q:'¿Cuánto es 8²?',o:['a) 16','b) 64','c) 82','d) 32'],a:1},
  {q:'¿Cuál es la raíz cuadrada de 169?',o:['a) 12','b) 13','c) 84.5','d) 14'],a:1},
  {q:'¿Cuál de estos es un cuadrado perfecto?',o:['a) 130','b) 121','c) 110','d) 140'],a:1},
  {q:'En la potencia 10², ¿cuál es la base?',o:['a) 2','b) 100','c) 10','d) 20'],a:2},
  {q:'¿Cuánto es 4² + √9?',o:['a) 19','b) 22','c) 13','d) 25'],a:0}
];
const evalCPBank=[
  {q:'En 6², el número 6 es la ___.',a:'base'},
  {q:'La raíz cuadrada de 81 es ___.',a:'9'},
  {q:'El símbolo √ se llama ___.',a:'radical'},
  {q:'El cuadrado perfecto más pequeño (mayor que 0) es ___.',a:'1'},
  {q:'Las potencias se resuelven ___ que las sumas y restas.',a:'antes'}
];
const evalPRBank=[
  {term:'Potencia',def:'Multiplicación repetida de un mismo número'},
  {term:'Exponente',def:'Indica cuántas veces se repite la base'},
  {term:'Cuadrado Perfecto',def:'Resultado de elevar un número entero al cuadrado'},
  {term:'Raíz Cuadrada',def:'Operación inversa a elevar al cuadrado'},
  {term:'Radical',def:'Símbolo que representa la raíz cuadrada'}
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación Potencias y Raíces · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:12pt;color:#111;background:#fff;padding:4mm 6mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.5rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;color:#1565c0;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:#1565c0;margin-top:0.15rem;font-weight:700;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.5rem 0 0.25rem;border-left:4px solid #1565c0;background:#e3f2fd;display:flex;justify-content:space-between;align-items:center;color:#1565c0;}.qn{font-weight:700;min-width:22px;flex-shrink:0;color:#1565c0;}.tf-row{display:flex;align-items:flex-start;gap:0.3rem;font-size:10.5pt;line-height:1.4;padding:0.25rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:42px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.2rem;margin-top:0.2rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.28rem 0.45rem;margin-bottom:0.22rem;break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.4;display:flex;gap:0.3rem;margin-bottom:0.18rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.22rem 0.55rem;}.mc-opts{display:grid;grid-template-columns:repeat(3,1fr);gap:0.08rem 0.25rem;margin-left:1.3rem;}.mc-opt{font-size:9.5pt;display:flex;align-items:center;gap:0.22rem;}.mc-opt input{width:12px;height:12px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.4;padding:0.22rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:130px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{break-inside:avoid;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.2rem 0.5rem;margin-top:0.15rem;}.pr-head{font-size:9pt;font-weight:700;color:#1565c0;margin-bottom:0.2rem;}.pr-item{font-size:10pt;padding:0.22rem 0.32rem;background:#e3f2fd;border-radius:3px;margin-bottom:0.12rem;display:flex;align-items:center;gap:0.22rem;line-height:1.2;}.pr-num{font-weight:700;color:#1565c0;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #1565c0;padding-bottom:0.35rem;margin-bottom:0.5rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;color:#1565c0;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #cce0ff;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;color:#1565c0;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#1565c0;}.pa{color:#007a00;font-weight:600;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:#1565c0;font-weight:700;font-style:italic;}.obt-lbl{font-weight:700;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #1565c0;height:12px;}.obt-pct{font-weight:700;}.total-row{display:flex;align-items:baseline;justify-content:flex-end;gap:7px;font-size:11pt;color:#1565c0;font-weight:700;font-style:italic;margin-top:0.4rem;padding:0.2rem 0.5rem;background:#e3f2fd;border-radius:4px;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #1565c0;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · Misión Potencias y Raíces Cuadradas · Matemática</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 4 secciones × 5 preguntas × 5 pts c/u · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✔ PAUTA DOCENTE — Evaluación Final · Potencias y Raíces Cuadradas · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">100 pts | 4 secciones × 5 preguntas × 5 pts | Matemáticas · Educación Básica</div></div><div class="p-grid">${pR}</div>
  ${zgBlock}</div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("evalPage",252,0.55,1.45);fit("pautaPage",252,0.55,1.3);})();</script></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(doc); win.document.close(); setTimeout(()=>win.print(),400);
}

// ===================== EXPLICA CON TUS PALABRAS =====================
const explicaData = [
  {
    q: 'Explica por qué 5² no es lo mismo que 5×2.',
    hint: '💡 Pista: piensa en cuántos factores hay en cada operación.',
    rubric: ['✓ Explica que 5² significa 5×5', '✓ Explica que 5×2 es una multiplicación distinta', '✓ Da los resultados correctos de cada una (25 y 10)'],
    suggested: '5² significa 5×5=25 (dos factores iguales), mientras que 5×2=10 es una multiplicación distinta con un factor diferente (2). Son operaciones diferentes que casualmente usan los mismos números.'
  },
  {
    q: '¿Por qué 50 no tiene raíz cuadrada exacta?',
    hint: '💡 Pista: busca entre qué dos cuadrados perfectos está 50.',
    rubric: ['✓ Identifica los cuadrados perfectos más cercanos (49 y 64)', '✓ Explica que 50 no es el resultado exacto de elevar un entero al cuadrado', '✓ Concluye que no tiene raíz cuadrada exacta'],
    suggested: '50 está entre 49 (7²) y 64 (8²). Como no es el resultado exacto de elevar un número entero al cuadrado, no tiene raíz cuadrada exacta.'
  },
  {
    q: 'Explica cómo se relacionan la potencia y la raíz cuadrada usando el ejemplo 9²=81 y √81=9.',
    hint: '💡 Pista: piensa en operaciones que se deshacen entre sí.',
    rubric: ['✓ Explica que son operaciones inversas', '✓ Usa el ejemplo dado para ilustrarlo', '✓ Explica que una deshace lo que hace la otra'],
    suggested: 'Son operaciones inversas: elevar al cuadrado convierte 9 en 81, y la raíz cuadrada convierte 81 de vuelta en 9. Una deshace lo que hace la otra.'
  },
  {
    q: 'Inventa un problema de la vida real que use una potencia o raíz cuadrada.',
    hint: '💡 Pista: piensa en un jardín cuadrado, una cuadrícula de asientos, un mosaico, etc.',
    rubric: ['✓ El contexto es de la vida real', '✓ Usa correctamente una potencia o una raíz cuadrada', '✓ El resultado tiene sentido en el problema'],
    suggested: '"Un jardín cuadrado tiene lados de 8 metros. ¿Cuál es su área?" R: 8²=64 metros cuadrados.'
  },
  {
    q: 'Explica por qué en 3+2² se resuelve primero 2² y no 3+2.',
    hint: '💡 Pista: recuerda el orden de operaciones.',
    rubric: ['✓ Menciona el orden de operaciones', '✓ Explica que las potencias van antes que las sumas', '✓ Da el resultado correcto: 7'],
    suggested: 'Según el orden de operaciones, las potencias se resuelven antes que las sumas. Primero 2²=4, luego 3+4=7.'
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

// ===================== PRUEBA OPERATIVA — POTENCIAS Y RAÍCES =====================

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
let _opRnd = Math.random; /* reasignado por genEvalOp con _evalRng(100000 + forma) para formas exactas */
function _opRint(min, max) { return Math.floor(_opRnd() * (max - min + 1)) + min; }
function _isIntMatch(student, expectedNum) {
  const raw = (student || '').toString().trim().replace(/[,\s]/g, '');
  if (!raw) return false;
  const n = parseInt(raw, 10);
  return !isNaN(n) && n === expectedNum;
}
const PERFECT_SQUARE_BASES = [1,2,3,4,5,6,7,8,9,10,11,12,13,14];
const PERFECT_SQUARES = PERFECT_SQUARE_BASES.map(b => b * b);
// No-cuadrados usados en la misión (Clasifica, Quiz, Generador de Tareas): distractores reconocibles
const NON_SQUARE_POOL = [30, 50, 90, 110, 130, 150, 180, 190];
// entre qué dos cuadrados consecutivos cae un número que NO es cuadrado perfecto
function _entreCuadrados(n) {
  let lo = 1;
  while ((lo + 1) * (lo + 1) < n) lo++;
  return { lo, hi: lo + 1 };
}

// I. Calcula la potencia (5 × 4 = 20 pts) · nivel básico · Regla de Oro n²=n×n
function genPotenciaItems() {
  const items = [];
  for (let i = 0; i < 5; i++) {
    const base = _opRint(2, 14);
    items.push({ base, ansNum: base * base });
  }
  return items;
}

// II. Calcula la raíz cuadrada (10 × 2 = 20 pts) · nivel básico → intermedio · operación inversa
function genRaizItems() {
  const bases = _pickF(PERFECT_SQUARE_BASES, 10, _opRnd);
  return bases.map(b => ({ square: b * b, ansNum: b }));
}

// III. ¿Es cuadrado perfecto? Sí o No (10 × 1 = 10 pts) · nivel intermedio · reconocimiento de la tabla de cuadrados
function genEsCuadradoItems() {
  const chosenSquares = _pickF(PERFECT_SQUARES, 5, _opRnd).map(n => ({ num: n, ansBool: true }));
  const nonSquares = _pickF(NON_SQUARE_POOL, 5, _opRnd).map(n => {
    const e = _entreCuadrados(n);
    return { num: n, ansBool: false, entre: `${e.lo}² y ${e.hi}²` };
  });
  return _shuffleF([...chosenSquares, ...nonSquares], _opRnd);
}

// IV. Problemas de la vida real (3 × 10 = 30 pts) · nivel avanzado · aplicación en contexto hondureño
function genProblemaVidaRealItems() {
  const items = [];
  // 1) Mosaico cuadrado de n² baldosas → lado (raíz), como el ejemplo de pensamientoTaskDB
  const lado1 = _opRint(9, 14);
  const totalBaldosas = lado1 * lado1;
  items.push({
    tipo: 'mosaico',
    text: `Doña Marta cubrió el piso cuadrado de su cocina con ${totalBaldosas} baldosas en total, acomodadas en un cuadrado (el mismo número de filas y de columnas). ¿Cuántas baldosas hay en cada lado?`,
    ansNum: lado1,
    unidad: 'baldosas por lado',
    proc: `√${totalBaldosas} = ${lado1} (porque ${lado1}² = ${totalBaldosas})`
  });
  // 2) Cancha/jardín cuadrado de lado L → área L², como el jardín 8² del contenido
  const lado2 = _opRint(6, 14);
  items.push({
    tipo: 'area',
    text: `Una cancha cuadrada de fútbol de sala mide ${lado2} metros de lado. ¿Cuál es su área en metros cuadrados?`,
    ansNum: lado2 * lado2,
    unidad: 'm²',
    proc: `${lado2}² = ${lado2} × ${lado2} = ${lado2 * lado2} m²`
  });
  // 3) Costo en lempiras → n² baldosas × precio unitario
  const lado3 = _opRint(7, 12);
  const precio = _pickF([10, 12, 15, 20, 25], 1, _opRnd)[0];
  const nBaldosas = lado3 * lado3;
  items.push({
    tipo: 'costo',
    text: `Para embaldosar un patio se necesita un piso cuadrado de ${lado3} × ${lado3} baldosas. Si cada baldosa cuesta L ${precio}, ¿cuánto costará en total el piso?`,
    ansNum: nBaldosas * precio,
    unidad: 'lempiras',
    proc: `${lado3}² = ${nBaldosas} baldosas; ${nBaldosas} × L ${precio} = L ${nBaldosas * precio}`
  });
  return items;
}

// V-a. Ordena de MAYOR a MENOR (grupos × 5 pts) · nivel avanzado · estimación sin calcular
function genOrdenaPotItems(nGroups) {
  const n = nGroups || 2;
  const groups = [];
  for (let g = 0; g < n; g++) {
    const items = []; let tries = 0;
    while (items.length < 4 && tries < 200) {
      tries++;
      const useSquare = _opRnd() < 0.5;
      let label, val;
      if (useSquare) { const b = _opRint(2, 13); label = `${b}²`; val = b * b; }
      else { const b = _opRint(1, 14); label = `√${b * b}`; val = b; }
      if (!items.some(it => it.val === val)) items.push({ label, val });
    }
    const correctOrder = [...items].sort((x, y) => y.val - x.val).map(it => it.label);
    const display = _shuffleF([...items], _opRnd).map(it => it.label);
    groups.push({ display, correctOrder });
  }
  return groups;
}

// V-b. Detective del error (5 pts) · nivel desafío · replica Error 1 (n²=n×2) o Error 4 (orden de operaciones)
function genDetectiveErrorItem() {
  if (_opRnd() < 0.5) {
    const b = _opRint(3, 9);
    return {
      text: `Un estudiante escribió: «${b}² = ${b} × 2 = ${b * 2}». Encuentra el error y escribe el resultado correcto de ${b}².`,
      ansNum: b * b,
      proc: `Error: ${b}² NO es ${b}×2. Significa ${b}×${b} = ${b * b}. Correcto: ${b * b}.`
    };
  }
  const a = _opRint(2, 6), b = _opRint(2, 6);
  return {
    text: `Un estudiante escribió: «${a} + ${b}² = (${a} + ${b})² = ${(a + b) * (a + b)}». Encuentra el error y escribe el resultado correcto de ${a} + ${b}².`,
    ansNum: a + b * b,
    proc: `Error: primero se resuelve la potencia. ${b}² = ${b * b}; luego ${a} + ${b * b} = ${a + b * b}. Correcto: ${a + b * b}.`
  };
}

// V-c. Escalera de los Impares (5 pts) · nivel desafío · ligado al Laboratorio 2
function genEscaleraImparesItem() {
  const k = _opRint(3, 7);
  const impares = [];
  for (let i = 0; i < k; i++) impares.push(2 * i + 1);
  return {
    text: `Suma los primeros números impares: ${impares.join(' + ')} = ___ ¿Qué cuadrado perfecto forman?`,
    impares,
    ansNum: k * k,
    proc: `${impares.join(' + ')} = ${k * k} = ${k}² (los primeros ${k} impares forman ${k}²).`
  };
}

function genEvalOp() {
  sfx('click');
  _injectFormaSel('genEvalOp', 'evalOpFormaSel', evalOpFormNum, function (v) { evalOpFormNum = v; });
  const _sO = document.getElementById('evalOpFormaSel');
  if (_sO && parseInt(_sO.value, 10)) evalOpFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sO.value, 10)));
  const cf = evalOpFormNum; window._currentEvalOpForm = cf; _opRnd = _evalRng(100000 + cf); /* la Forma cf siembra TODO el azar de esta prueba operativa */ evalOpFormNum = (evalOpFormNum % EVAL_FORMAS) + 1; _injectFormaSel('genEvalOp', 'evalOpFormaSel', evalOpFormNum, function (v) { evalOpFormNum = v; }); saveProgress();
  document.getElementById('evalop-screen-title').textContent = `📐 Prueba Operativa — Forma ${cf} · Potencias y Raíces`;
  evalOpAnsVisible = false;
  const out = document.getElementById('evalOpOut'); out.innerHTML = '';

  const potItems = genPotenciaItems();
  const s1 = document.createElement('div');
  s1.innerHTML = '<div class="eval-section-title">I. Calcula la potencia <span class="eval-pts">20 pts · 4 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel básico. Recuerda la Regla de Oro: n² = n × n. Resuelve en tu cuaderno y escribe la respuesta.</p>';
  potItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.base}² =</span><input class="eval-cp-input" type="text" data-pot="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${it.ansNum}</div><div class="eval-item-feedback" id="evalFbPot${i}" aria-live="polite"></div>`;
    s1.appendChild(d);
  });
  out.appendChild(s1);

  const raizItems = genRaizItems();
  const s2 = document.createElement('div');
  s2.innerHTML = '<div class="eval-section-title">II. Calcula la raíz cuadrada <span class="eval-pts">20 pts · 2 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel intermedio. La raíz es la operación inversa: busca qué número, elevado al cuadrado, da el número de adentro.</p>';
  raizItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">√${it.square} =</span><input class="eval-cp-input" type="text" data-raiz="${i}" autocomplete="off" inputmode="numeric" style="width:70px;"></div><div class="eval-answer">${it.ansNum}</div><div class="eval-item-feedback" id="evalFbRaiz${i}" aria-live="polite"></div>`;
    s2.appendChild(d);
  });
  out.appendChild(s2);

  const cuadItems = genEsCuadradoItems();
  const s3 = document.createElement('div');
  s3.innerHTML = '<div class="eval-section-title">III. ¿Es un cuadrado perfecto? <span class="eval-pts">10 pts · 1 pt c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel intermedio. Marca Sí o No. Ojo con el Error 2: no todo número tiene raíz exacta.</p>';
  cuadItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text opx-expr">${it.num}</span></div><div class="eval-cmp-opts"><label class="eval-cmp-opt"><input type="radio" name="cuad${i}" value="si"> Sí</label><label class="eval-cmp-opt"><input type="radio" name="cuad${i}" value="no"> No</label></div><div class="eval-answer">${it.ansBool ? 'Sí' : 'No · está entre ' + it.entre}</div><div class="eval-item-feedback" id="evalFbCuad${i}" aria-live="polite"></div>`;
    s3.appendChild(d);
  });
  out.appendChild(s3);

  const probItems = genProblemaVidaRealItems();
  const s4 = document.createElement('div');
  s4.innerHTML = '<div class="eval-section-title">IV. Problemas de la vida real <span class="eval-pts">30 pts · 10 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel avanzado. Lee cada problema, resuelve el proceso en tu cuaderno y escribe el resultado (solo el número).</p>';
  probItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row" style="align-items:flex-start;flex-wrap:wrap;"><span class="eval-num">${i+1}</span><span class="eval-q-text" style="flex:1;min-width:200px;">${it.text}</span></div><div class="opx-row" style="margin-top:0.35rem;"><span class="opx-expr">Respuesta (${it.unidad}):</span><input class="eval-cp-input" type="text" data-prob="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${it.ansNum} ${it.unidad} · ${it.proc}</div><div class="eval-item-feedback" id="evalFbProb${i}" aria-live="polite"></div>`;
    s4.appendChild(d);
  });
  out.appendChild(s4);

  const ordGroups = genOrdenaPotItems(2);
  const detItem = genDetectiveErrorItem();
  const escItem = genEscaleraImparesItem();
  const s5 = document.createElement('div');
  s5.innerHTML = '<div class="eval-section-title">V. Retos de pensamiento <span class="eval-pts">20 pts</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Nivel desafío. Ordena estimando, detecta el error y descubre el cuadrado que forman los impares.</p>';
  ordGroups.forEach((g, gi) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item evord-group';
    d.innerHTML = `<div class="evord-dir">${gi+1}. Ordena de MAYOR a menor (sin calcular todo, estima): <span style="color:var(--gray);font-weight:600;">5 pts</span></div><div class="evord-list" id="evordPotList${gi}"></div><div class="eval-answer">${g.correctOrder.join(' · ')}</div><div class="eval-item-feedback" id="evalFbOrdPot${gi}" aria-live="polite"></div>`;
    s5.appendChild(d);
  });
  const dDet = document.createElement('div'); dDet.className = 'eval-item eval-auto-item';
  dDet.innerHTML = `<div class="opx-row" style="align-items:flex-start;flex-wrap:wrap;"><span class="eval-num">3</span><span class="eval-q-text" style="flex:1;min-width:200px;">Detective del error: ${detItem.text} <span style="color:var(--gray);font-weight:600;">(5 pts)</span></span></div><div class="opx-row" style="margin-top:0.35rem;"><span class="opx-expr">Resultado correcto =</span><input class="eval-cp-input" type="text" data-det="0" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${detItem.ansNum} · ${detItem.proc}</div><div class="eval-item-feedback" id="evalFbDet0" aria-live="polite"></div>`;
  s5.appendChild(dDet);
  const dEsc = document.createElement('div'); dEsc.className = 'eval-item eval-auto-item';
  dEsc.innerHTML = `<div class="opx-row" style="align-items:flex-start;flex-wrap:wrap;"><span class="eval-num">4</span><span class="eval-q-text" style="flex:1;min-width:200px;">Escalera de los impares: ${escItem.text} <span style="color:var(--gray);font-weight:600;">(5 pts)</span></span></div><div class="opx-row" style="margin-top:0.35rem;"><span class="opx-expr">Cuadrado perfecto =</span><input class="eval-cp-input" type="text" data-esc="0" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${escItem.ansNum} · ${escItem.proc}</div><div class="eval-item-feedback" id="evalFbEsc0" aria-live="polite"></div>`;
  s5.appendChild(dEsc);
  out.appendChild(s5);

  window._evalOpData = { potItems, raizItems, cuadItems, probItems, det: detItem, esc: escItem, ord: ordGroups.map(g => ({ current: [...g.display], correctOrder: g.correctOrder })) };
  ordGroups.forEach((_, gi) => _renderOrdPotGroup(gi));
  const autoPanel = document.createElement('div'); autoPanel.id = 'evalOpAutoResult'; autoPanel.className = 'eval-auto-result';
  autoPanel.innerHTML = '<strong>🧮 Prueba interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato para resolver en papel.';
  out.appendChild(autoPanel);
  fin('s-evaluacion');
}

function _renderOrdPotGroup(gi) {
  const data = window._evalOpData.ord[gi];
  const list = document.getElementById('evordPotList' + gi); if (!list) return;
  list.innerHTML = '';
  data.current.forEach((label, i) => {
    const div = document.createElement('div'); div.className = 'evord-item';
    div.innerHTML = `<div class="evord-arrows"><button class="sort-arrow" onclick="evordPotMove(${gi},${i},-1)"${i===0?' disabled':''}>▲</button><button class="sort-arrow" onclick="evordPotMove(${gi},${i},1)"${i===data.current.length-1?' disabled':''}>▼</button></div><div class="evord-num">${label}</div>`;
    list.appendChild(div);
  });
}
function evordPotMove(gi, idx, dir) {
  sfx('click');
  const data = window._evalOpData.ord[gi]; const ni = idx + dir;
  if (ni < 0 || ni >= data.current.length) return;
  [data.current[idx], data.current[ni]] = [data.current[ni], data.current[idx]];
  _renderOrdPotGroup(gi);
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
  let total = 0; const det = { pot: 0, raiz: 0, cuad: 0, prob: 0, ord: 0, retoExtra: 0 };
  d.potItems.forEach((it, i) => { const el = document.querySelector(`[data-pot="${i}"]`); const ok = _isIntMatch(el ? el.value : '', it.ansNum); if (el) { el.classList.toggle('eval-input-ok', ok); el.classList.toggle('eval-input-no', !ok); } if (ok) { det.pot++; total += 4; } setEvalFeedback('evalFbPot' + i, ok, ok ? 'Correcto. +4 pts' : 'Revisar. R/ ' + it.ansNum); });
  d.raizItems.forEach((it, i) => { const el = document.querySelector(`[data-raiz="${i}"]`); const ok = _isIntMatch(el ? el.value : '', it.ansNum); if (el) { el.classList.toggle('eval-input-ok', ok); el.classList.toggle('eval-input-no', !ok); } if (ok) { det.raiz++; total += 2; } setEvalFeedback('evalFbRaiz' + i, ok, ok ? 'Correcto. +2 pts' : 'Revisar. R/ ' + it.ansNum); });
  d.cuadItems.forEach((it, i) => { const sel = document.querySelector(`input[name="cuad${i}"]:checked`); const ok = !!sel && (sel.value === 'si') === it.ansBool; if (ok) { det.cuad++; total += 1; } setEvalFeedback('evalFbCuad' + i, ok, ok ? 'Correcto. +1 pt' : 'Revisar. R/ ' + (it.ansBool ? 'Sí' : 'No · entre ' + it.entre)); });
  d.probItems.forEach((it, i) => { const el = document.querySelector(`[data-prob="${i}"]`); const ok = _isIntMatch(el ? el.value : '', it.ansNum); if (el) { el.classList.toggle('eval-input-ok', ok); el.classList.toggle('eval-input-no', !ok); } if (ok) { det.prob++; total += 10; } setEvalFeedback('evalFbProb' + i, ok, ok ? 'Correcto. +10 pts' : 'Revisar. R/ ' + it.ansNum + ' ' + it.unidad); });
  d.ord.forEach((g, gi) => { const ok = g.current.every((v, i) => v === g.correctOrder[i]); if (ok) { det.ord++; total += 5; } setEvalFeedback('evalFbOrdPot' + gi, ok, ok ? '¡Orden correcto! +5 pts' : 'Orden incorrecto. Clave: ' + g.correctOrder.join(' · ')); });
  const elDet = document.querySelector('[data-det="0"]'); const okDet = _isIntMatch(elDet ? elDet.value : '', d.det.ansNum); if (elDet) { elDet.classList.toggle('eval-input-ok', okDet); elDet.classList.toggle('eval-input-no', !okDet); } if (okDet) { det.retoExtra += 5; total += 5; } setEvalFeedback('evalFbDet0', okDet, okDet ? 'Correcto. +5 pts' : 'Revisar. R/ ' + d.det.ansNum);
  const elEsc = document.querySelector('[data-esc="0"]'); const okEsc = _isIntMatch(elEsc ? elEsc.value : '', d.esc.ansNum); if (elEsc) { elEsc.classList.toggle('eval-input-ok', okEsc); elEsc.classList.toggle('eval-input-no', !okEsc); } if (okEsc) { det.retoExtra += 5; total += 5; } setEvalFeedback('evalFbEsc0', okEsc, okEsc ? 'Correcto. +5 pts' : 'Revisar. R/ ' + d.esc.ansNum);
  const res = document.getElementById('evalOpAutoResult');
  if (res) { res.className = 'eval-auto-result ' + (total >= 70 ? 'eval-auto-pass' : 'eval-auto-risk'); res.innerHTML = `<strong>Resultado: ${total}/100 pts</strong><br><span>Potencia: ${det.pot*4}/20 · Raíz: ${det.raiz*2}/20 · ¿Cuadrado?: ${det.cuad}/10 · Problemas: ${det.prob*10}/30 · Retos: ${det.ord*5 + det.retoExtra}/20</span>`; }
  if (total >= 70) { pts(8); showToast('🎯 Prueba operativa calificada: ' + total + '/100'); }
  else showToast('🧮 Prueba operativa: ' + total + '/100. Revisa los ítems marcados.');
}

function printEvalOp() {
  if (!window._evalOpData) { showToast('⚠️ Genera una prueba operativa primero'); return; }
  sfx('click');
  const forma = window._currentEvalOpForm || 1; const d = window._evalOpData;
  let s1 = `<div class="sec-title"><span>I. Calcula la potencia</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Nivel básico. Recuerda: n² = n × n. Resuelve el proceso en tu cuaderno y escribe la respuesta en la línea. Valor 4 pts c/u.</p>`;
  d.potItems.forEach((it, i) => { s1 += `<div class="opx-print-row"><span class="qn">${i+1}.</span><span class="opx-print-expr">${it.base}² =</span><span class="opx-blank"></span></div>`; });
  const raizH = Math.ceil(d.raizItems.length / 2);
  const raizTbl = (items, off) => `<table class="rnd-tbl"><tr><th>#</th><th>Raíz cuadrada</th><th>Resultado</th></tr>${items.map((it, i) => `<tr><td>${off+i+1}</td><td>√${it.square}</td><td></td></tr>`).join('')}</table>`;
  let s2 = `<div class="sec-title"><span>II. Calcula la raíz cuadrada</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Nivel intermedio. La raíz es la operación inversa: escribe la raíz cuadrada exacta. 2 pts c/u.</p><div class="rnd-print-grid">${raizTbl(d.raizItems.slice(0,raizH),0)}${raizTbl(d.raizItems.slice(raizH),raizH)}</div>`;
  const cuadH = Math.ceil(d.cuadItems.length / 2);
  let s3 = `<div class="sec-title"><span>III. ¿Es un cuadrado perfecto?</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10 pts</span></div></div><p class="opx-instr">Nivel intermedio. Marca con ✔: S = Sí · N = No. Si es No, escribe entre qué dos cuadrados consecutivos está. 1 pt c/u.</p><div class="cmp-print-grid"><div>${d.cuadItems.slice(0,cuadH).map((it,i)=>`<div class="cmp-print-row"><span class="cmp-print-num">${i+1}. ${it.num}</span><div class="cmp-opts-print"><span>S ☐</span><span>N ☐</span><span>entre __² y __²</span></div></div>`).join('')}</div><div>${d.cuadItems.slice(cuadH).map((it,i)=>`<div class="cmp-print-row"><span class="cmp-print-num">${cuadH+i+1}. ${it.num}</span><div class="cmp-opts-print"><span>S ☐</span><span>N ☐</span><span>entre __² y __²</span></div></div>`).join('')}</div></div>`;
  let s4 = `<div class="sec-title"><span>IV. Problemas de la vida real</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 30 pts</span></div></div><p class="opx-instr">Nivel avanzado. Lee cada problema, resuelve el proceso en tu cuaderno y escribe el resultado en la línea. 10 pts c/u.</p>${d.probItems.map((it,i)=>`<div class="prob-print-row"><span class="qn">${i+1}.</span><span class="prob-print-text">${it.text}</span></div><div class="prob-print-ans">Respuesta (${it.unidad}): <span class="opx-blank"></span></div>`).join('')}`;
  let s5 = `<div class="sec-title"><span>V. Retos de pensamiento</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Nivel desafío. Ordena estimando (5 pts c/u), detecta el error (5 pts) y descubre el cuadrado de los impares (5 pts).</p><div class="ord-print-grid">${d.ord.map((g,gi)=>`<div class="ord-print-box"><div class="ord-print-dir">${gi+1}. Ordena de Mayor a Menor:</div><table class="ord-print-tbl"><tr>${g.current.map(v=>`<td>${v}</td>`).join('')}</tr></table><div style="margin-top:0.3rem;font-size:8.5pt;color:#555;">Escribe en orden: 1. _______ &nbsp; 2. _______ &nbsp; 3. _______ &nbsp; 4. _______</div></div>`).join('')}</div><div class="prob-print-row"><span class="qn">3.</span><span class="prob-print-text">Detective del error: ${d.det.text}</span></div><div class="prob-print-ans">Resultado correcto = <span class="opx-blank"></span></div><div class="prob-print-row"><span class="qn">4.</span><span class="prob-print-text">Escalera de los impares: ${d.esc.text}</span></div><div class="prob-print-ans">Cuadrado perfecto = <span class="opx-blank"></span></div>`;
  let pR = '';
  pR += `<div class="p-sec"><div class="p-ttl">I. Potencia</div><table class="p-tbl">${d.potItems.map((it,i)=>`<tr><td class="pn">${i+1}.</td><td class="pa">${it.ansNum}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">II. Raíz cuadrada</div><table class="p-tbl">${d.raizItems.map((it,i)=>`<tr><td class="pn">${i+1}.</td><td class="pa">${it.ansNum}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">III. ¿Cuadrado perfecto?</div><table class="p-tbl">${d.cuadItems.map((it,i)=>`<tr><td class="pn">${i+1}.</td><td class="pa">${it.ansBool?'Sí':'No · entre '+it.entre}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">IV. Problemas de la vida real</div><table class="p-tbl">${d.probItems.map((it,i)=>`<tr><td class="pn">${i+1}.</td><td class="pa">${it.ansNum} ${it.unidad}<br><span style="font-size:9pt;color:#555;">${it.proc}</span></td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec" style="grid-column:1/-1;"><div class="p-ttl">V. Retos de pensamiento</div>${d.ord.map((g,gi)=>`<div class="p-ord-line"><strong>${gi+1}.</strong> ${g.correctOrder.join(' · ')}</div>`).join('')}<div class="p-ord-line"><strong>3.</strong> ${d.det.proc}</div><div class="p-ord-line"><strong>4.</strong> ${d.esc.proc}</div></div>`;
  const doc = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Prueba Operativa Potencias y Raíces · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11.5pt;color:#111;background:#fff;padding:4mm 6mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.5rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;color:#1565c0;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:#1565c0;margin-top:0.15rem;font-weight:700;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.5rem 0 0.22rem;border-left:4px solid #1565c0;background:#e3f2fd;display:flex;justify-content:space-between;align-items:center;color:#1565c0;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:#1565c0;font-weight:700;font-style:italic;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #1565c0;height:12px;}.qn{font-weight:700;min-width:20px;display:inline-block;color:#1565c0;}.opx-instr{font-size:9pt;color:#555;margin-bottom:0.25rem;}.opx-print-row{display:flex;align-items:baseline;gap:0.4rem;font-size:11pt;padding:0.22rem 0.2rem;border-bottom:1px dotted #ddd;}.opx-print-expr{font-family:'Courier New',monospace;font-weight:700;}.opx-blank{display:inline-block;width:140px;flex:none;border-bottom:1.5px solid #111;min-height:14px;margin-left:0.4rem;}.rnd-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 1rem;margin-top:0.2rem;}.rnd-tbl{width:100%;border-collapse:collapse;font-size:9pt;}.rnd-tbl th,.rnd-tbl td{border:1px solid #bbb;padding:0.15rem 0.35rem;text-align:left;}.rnd-tbl th{background:#e3f2fd;color:#1565c0;font-size:8.5pt;}.cmp-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 1rem;margin-top:0.2rem;}.cmp-print-row{display:flex;align-items:center;justify-content:space-between;font-size:10pt;padding:0.18rem 0.1rem;border-bottom:1px dotted #ddd;}.cmp-print-num{font-family:'Courier New',monospace;font-weight:600;flex:1;}.cmp-opts-print{display:flex;gap:0.6rem;font-size:9pt;white-space:nowrap;}.ord-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.8rem;margin-top:0.2rem;}.ord-print-box{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.4rem;break-inside:avoid;}.ord-print-dir{font-size:9pt;font-weight:700;color:#1565c0;margin-bottom:0.2rem;}.ord-print-tbl{width:100%;border-collapse:collapse;font-size:9.5pt;}.ord-print-tbl td{border:1px solid #bbb;padding:0.12rem 0.25rem;text-align:center;font-family:'Courier New',monospace;}.prob-print-row{display:flex;align-items:baseline;gap:0.4rem;font-size:10.5pt;padding:0.28rem 0.2rem 0.1rem;}.prob-print-text{flex:1;line-height:1.35;}.prob-print-ans{font-size:10.5pt;padding:0.05rem 0.2rem 0.28rem 1.4rem;border-bottom:1px dotted #ddd;}.prob-print-ans .opx-blank{width:120px;}.total-row{display:flex;align-items:baseline;justify-content:flex-end;gap:7px;font-size:11pt;color:#1565c0;font-weight:700;font-style:italic;margin-top:0.5rem;padding:0.2rem 0.5rem;background:#e3f2fd;border-radius:4px;}.total-row .obt-line{min-width:80px;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #1565c0;padding-bottom:0.35rem;margin-bottom:0.5rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;color:#1565c0;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #cce0ff;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;color:#1565c0;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#1565c0;}.pa{color:#007a00;font-weight:600;font-family:'Courier New',monospace;}.p-ord-line{font-size:10.5pt;margin-bottom:0.2rem;color:#007a00;}.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:8mm 10mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Examen de Matemáticas — Prueba Operativa · Potencias y Raíces Cuadradas · Educación Básica</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 pts · I: 20 · II: 20 · III: 10 · IV: 30 · V: 20 · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✔ PAUTA — Prueba Operativa · Potencias y Raíces Cuadradas · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">100 pts · Matemáticas · Educación Básica</div></div><div class="p-grid">${pR}</div></div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("evalPage",250,0.55,1.2);fit("pautaPage",250,0.55,1.2);})();</script></body></html>`;
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
  const msgs=['💡 ¡ÁNIMO! Comienza tu misión. ¡Cada paso cuenta!','🌱 ¡GRAN INICIO! Estás dando los primeros pasos.','🔲 ¡BUEN TRABAJO! Vas progresando muy bien.','💪 ¡MUY BIEN! Dominas gran parte del contenido.','🏅 ¡INCREÍBLE avance! Estás cerca de la excelencia.','🎓 ¡EXTRAORDINARIO! Completaste TODA la misión. ¡Eres experto en Potencias y Raíces!'];
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
  const txt=`${stars} CONSTANCIA DE LOGRO ${stars}\n\n📚 Misión: Potencias y Raíces Cuadradas\n👤 Estudiante: ${name}\n📊 Progreso: ${pct}% completado\n⭐ XP obtenido: ${xp} de ${MXP}${achText?'\n\n🏆 Logros desbloqueados:\n'+achText:''}\n\n${msg}\n\n📅 ${date}\n🏠 Proyecto Educativo M.E.T.A.S\n🌐 policastsapien.com`;
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
  const savedName=localStorage.getItem('nombreEstudiantePotenciasRaices');
  const inputName=document.querySelector('.diploma-input');
  if(savedName&&inputName){ inputName.value=savedName; updateDiplomaName(savedName); }
  if(inputName) inputName.addEventListener('input',e=>localStorage.setItem('nombreEstudiantePotenciasRaices',e.target.value));
  fin('s-aprende',false);
  fin('s-tipos',false);
  fin('s-errores',false);
});

// Formas deterministas v1: selectores de forma visibles desde la carga de la página
(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalOp==='function') _injectFormaSel('genEvalOp','evalOpFormaSel',evalOpFormNum,function(v){evalOpFormNum=v;}); }catch(e){} try{ if(typeof genEvalCrit==='function') _injectFormaSel('genEvalCrit','evalCritFormaSel',evalCritFormNum,function(v){evalCritFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();
