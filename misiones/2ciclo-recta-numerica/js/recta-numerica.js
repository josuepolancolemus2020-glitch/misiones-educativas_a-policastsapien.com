// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
// Compartir misión por WhatsApp
function compartirMision() {
    const url = window.location.href;
    const texto = `🚀 *Misión Asignada: Recta Numérica, Suma y Resta* 🚀\n\nUbica puntos en la recta numérica y resuelve problemas de adición y sustracción de números cardinales. 🏆\n\nDesbloquea *todos los logros* y envía a tu maestro la *constancia de logro* cuando hayas culminado. 📋\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;
    _waShare(texto);
}

// ===================== ACCESIBILIDAD =====================
function toggleLetra() {
  document.body.classList.toggle('letra-grande');
  if(typeof sfx === 'function') sfx('click');
  localStorage.setItem('prefLetraRectaNumerica', document.body.classList.contains('letra-grande'));
}
window.addEventListener('DOMContentLoaded', () => {
  if(localStorage.getItem('prefLetraRectaNumerica') === 'true') document.body.classList.add('letra-grande');
});

// ===================== UTILIDADES =====================
const _pick = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
const _shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
function fb(id, msg, isOk) {
  const el = document.getElementById(id);
  if(el) { el.textContent = msg; el.className = 'fb show ' + (isOk ? 'ok' : 'err'); }
}

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY = 'matematica_recta_numerica_v1';
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
function launchConfetti(){ const colors=['#1565c0','#00838f','#00b894','#fdcb6e','#6c5ce7']; for(let i=0;i<60;i++){ const c=document.createElement('div'); c.className='confetti-piece'; c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`; document.body.appendChild(c); c.addEventListener('animationend',()=>c.remove()); } }

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
  {w:'Recta Numérica',a:'línea recta donde cada punto representa un número; los números se ordenan de <strong>menor a mayor</strong> hacia la derecha.'},
  {w:'Origen',a:'punto de partida de la recta numérica; casi siempre es el <strong>cero (0)</strong>.'},
  {w:'Escala',a:'valor de cada salto entre marcas: puede ser de <strong>1 en 1, de 10 en 10, de 100 en 100</strong>…'},
  {w:'Punto Medio',a:'número que está exactamente al centro de otros dos. entre 40 y 60 es <strong>50</strong>.'},
  {w:'Números Cardinales',a:'números que usamos para contar: <strong>0, 1, 2, 3…</strong> sin fin.'},
  {w:'Adición',a:'operación de juntar o agregar. en la recta numérica se <strong>avanza hacia la derecha</strong>.'},
  {w:'Sumandos',a:'números que se juntan en una adición. en 46+38=84, los sumandos son <strong>46 y 38</strong>.'},
  {w:'Suma o Total',a:'resultado de la adición. en 46+38=84, el total es <strong>84</strong>.'},
  {w:'Sustracción',a:'operación de quitar o comparar. en la recta numérica se <strong>retrocede hacia la izquierda</strong>.'},
  {w:'Minuendo',a:'número al que se le quita en una resta. en 90−35=55, el minuendo es <strong>90</strong>.'},
  {w:'Sustraendo',a:'número que se quita en una resta. en 90−35=55, el sustraendo es <strong>35</strong>.'},
  {w:'Diferencia',a:'resultado de la sustracción. en 90−35=55, la diferencia es <strong>55</strong>.'},
  {w:'Avanzar en la recta',a:'moverse hacia la derecha: el número <strong>aumenta</strong>. avanzar 3 desde 45 llega a 48.'},
  {w:'Prueba de la resta',a:'la resta está bien hecha si <strong>sustraendo + diferencia = minuendo</strong>. 35+55=90 ✔.'}
];
let fcIdx=0;
function upFC(){ document.getElementById('fcInner').classList.remove('flipped'); document.getElementById('fcW').textContent=fcData[fcIdx].w; document.getElementById('fcA').innerHTML=fcData[fcIdx].a; document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length; }
function flipCard(){ sfx('flip'); document.getElementById('fcInner').classList.toggle('flipped'); if(!xpTracker.fc.has(fcIdx)){ xpTracker.fc.add(fcIdx); pts(1); } if(xpTracker.fc.size===fcData.length){ fin('s-flash'); unlockAchievement('flash_master'); } }
function nextFC(){ sfx('click'); fcIdx=(fcIdx+1)%fcData.length; upFC(); }
function prevFC(){ sfx('click'); fcIdx=(fcIdx-1+fcData.length)%fcData.length; upFC(); }

// ===================== QUIZ DATA =====================
const qzData=[
  {q:'En una recta de 0 a 100 con marcas cada 10, ¿qué número está en la 4.ª marca después del 0?',o:['a) 4','b) 40','c) 44','d) 100'],c:1,feedback:'Cada salto vale 10: cuatro saltos desde 0 llegan a 40.'},
  {q:'¿Cuál es el punto medio entre 30 y 50?',o:['a) 35','b) 45','c) 40','d) 80'],c:2,feedback:'El punto medio está a la misma distancia de ambos: 40 está a 10 de 30 y a 10 de 50.'},
  {q:'Una recta muestra 0, 25, 50, 75… ¿qué número sigue?',o:['a) 76','b) 80','c) 95','d) 100'],c:3,feedback:'La escala es de 25 en 25: después de 75 viene 100.'},
  {q:'En 358 + 236 = 594, los números 358 y 236 se llaman:',o:['a) diferencias','b) sumandos','c) totales','d) minuendos'],c:1},
  {q:'En la resta 720 − 245, ¿cuál es el minuendo?',o:['a) 245','b) 475','c) 720','d) 965'],c:2,feedback:'El minuendo es el número al que se le quita: 720.'},
  {q:'Ana tiene 385 lempiras y recibe 150 más. ¿Cuánto tiene ahora?',o:['a) 435','b) 535','c) 235','d) 545'],c:1,feedback:'Es una adición: 385 + 150 = 535 lempiras.'},
  {q:'¿Cuánto le falta a 65 para llegar a 100?',o:['a) 45','b) 35','c) 165','d) 25'],c:1,feedback:'Se resuelve con resta: 100 − 65 = 35.'},
  {q:'En la recta numérica, sumar significa moverse hacia:',o:['a) la izquierda','b) la derecha','c) abajo','d) el origen'],c:1},
  {q:'Un punto está entre 70 y 80, más cerca del 80. ¿Cuál puede ser?',o:['a) 71','b) 78','c) 85','d) 70'],c:1,feedback:'78 está entre 70 y 80 y a solo 2 saltos del 80.'},
  {q:'¿Cuál es el resultado de 500 − 137?',o:['a) 363','b) 373','c) 463','d) 437'],c:0,feedback:'500 − 137 = 363. Prueba: 137 + 363 = 500 ✔.'}
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

// ===================== CLASIFICACIÓN (seleccionar y colocar, sin arrastre) =====================
const classGroups=[
  {
    label:['Se resuelve con suma','Se resuelve con resta'], headA:'➕ Se resuelve con SUMA', headB:'➖ Se resuelve con RESTA', colA:'suma', colB:'resta',
    words:[{w:'Tengo 46 y me regalan 38',t:'suma'},{w:'¿Cuánto le falta a 40 para 90?',t:'resta'},{w:'Junto 125 y 230',t:'suma'},{w:'Tenía 500 y gasté 175',t:'resta'},{w:'La diferencia entre 82 y 39',t:'resta'},{w:'Avanzo 25 desde el 60',t:'suma'},{w:'Retrocedo 30 desde el 75',t:'resta'},{w:'Agrego 140 a mis 260',t:'suma'},{w:'¿Cuántos más tiene 95 que 58?',t:'resta'},{w:'Reúno 340 y 150',t:'suma'}]
  },
  {
    label:['A la izquierda de 500','A la derecha de 500'], headA:'⬅️ Antes del 500 (izquierda)', headB:'➡️ Después del 500 (derecha)', colA:'izq', colB:'der',
    words:[{w:'350',t:'izq'},{w:'725',t:'der'},{w:'499',t:'izq'},{w:'501',t:'der'},{w:'89',t:'izq'},{w:'950',t:'der'},{w:'480',t:'izq'},{w:'608',t:'der'},{w:'275',t:'izq'},{w:'830',t:'der'}]
  }
];
let currentClassGroupIdx=0, clsSelected=null;
function _clsUpdateReady(){ const on=!!clsSelected; ['col-left','col-right'].forEach(id=>{ const el=document.getElementById(id); if(el) el.classList.toggle('col-ready',on); }); }
function buildClass(){
  const group=classGroups[currentClassGroupIdx];
  document.getElementById('col-left-head').textContent=group.headA;
  document.getElementById('col-right-head').textContent=group.headB;
  const bank=document.getElementById('clsBank'); bank.innerHTML='';
  clsSelected=null; _clsUpdateReady();
  document.getElementById('items-left').innerHTML='';
  document.getElementById('items-right').innerHTML='';

  function _mkBankItem(text,type){
    const el=document.createElement('div'); el.className='wb-item'; el.textContent=text; el.dataset.t=type;
    el.setAttribute('role','button'); el.setAttribute('tabindex','0');
    el.onclick=(ev)=>{ ev.stopPropagation(); sfx('click');
      if(clsSelected===el){ el.classList.remove('wb-sel'); clsSelected=null; }
      else{ document.querySelectorAll('#clsBank .wb-item').forEach(x=>x.classList.remove('wb-sel')); clsSelected=el; el.classList.add('wb-sel'); }
      _clsUpdateReady(); };
    return el;
  }
  function _mkDropItem(text,type){
    const el=document.createElement('div'); el.className='drop-item'; el.textContent=text; el.dataset.t=type;
    el.onclick=(ev)=>{
      ev.stopPropagation();
      if(clsSelected){ // hay un elemento del banco seleccionado: se inserta en esta caja, sin sacar el tocado
        const listEl=el.parentElement;
        const selText=clsSelected.textContent, selType=clsSelected.dataset.t;
        clsSelected.remove(); clsSelected=null; _clsUpdateReady();
        listEl.appendChild(_mkDropItem(selText,selType)); sfx('click'); return;
      }
      el.remove(); bank.appendChild(_mkBankItem(text,type)); sfx('click');
    };
    return el;
  }
  function _colClick(listId){
    return ()=>{
      if(!clsSelected){ fb('fbCls','Primero toca un elemento del banco para seleccionarlo.',false); return; }
      const text=clsSelected.textContent, type=clsSelected.dataset.t;
      clsSelected.remove(); clsSelected=null; _clsUpdateReady();
      document.getElementById(listId).appendChild(_mkDropItem(text,type)); sfx('click');
    };
  }
  document.getElementById('col-left').onclick=_colClick('items-left');
  document.getElementById('col-right').onclick=_colClick('items-right');
  _shuffle([...group.words]).forEach(w=>{ bank.appendChild(_mkBankItem(w.w,w.t)); });
}
function checkClass(){
  const remaining=document.querySelectorAll('#clsBank .wb-item').length;
  if(remaining>0){fb('fbCls','Coloca todos los elementos en las cajas primero.',false);return;}
  const group=classGroups[currentClassGroupIdx]; let allOk=true;
  document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{
    const inLeft=el.parentElement.id==='items-left';
    const expectedType=inLeft?group.colA:group.colB;
    if(el.dataset.t===expectedType){el.classList.add('cls-ok');}else{el.classList.add('cls-no');allOk=false;}
  });
  if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);}
  if(allOk){fb('fbCls','¡Perfecto! +5 XP',true);sfx('fan');fin('s-clasifica');unlockAchievement('clasif_pro');}
  else{fb('fbCls','Hay errores. Marcados en rojo (tócalos para devolverlos al banco).',false);sfx('no');}
}
function nextClassGroup(){ sfx('click'); currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length; buildClass(); document.getElementById('fbCls').classList.remove('show'); showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]); }
function resetClass(){ sfx('click'); buildClass(); document.getElementById('fbCls').classList.remove('show'); }

// ===================== IDENTIFICAR =====================
const idData=[
  {s:['El','origen','de','la','recta','es','el','cero.'],c:1,art:'Punto de partida de la recta numérica'},
  {s:['La','escala','indica','el','valor','de','cada','salto.'],c:1,art:'Valor de cada salto entre marcas'},
  {s:['En','90−35=55,','el','minuendo','es','90.'],c:3,art:'Número al que se le quita en la resta'},
  {s:['En','90−35=55,','el','sustraendo','es','35.'],c:3,art:'Número que se quita en la resta'},
  {s:['El','resultado','de','la','resta','se','llama','diferencia.'],c:7,art:'Resultado de la sustracción'},
  {s:['Los','sumandos','se','juntan','para','formar','el','total.'],c:1,art:'Números que se juntan en la adición'},
  {s:['Al','sumar,','en','la','recta','se','avanza','a','la','derecha.'],c:6,art:'Movimiento de la adición en la recta'},
  {s:['El','punto','medio','entre','40','y','60','es','50.'],c:2,art:'Palabra que indica el centro exacto entre dos números'}
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
  {s:'La recta numérica ordena los números de menor a ___.',opts:['igual','mayor','menor'],c:1},
  {s:'El punto de partida de la recta numérica se llama ___.',opts:['final','medio','origen'],c:2},
  {s:'Si la escala es de 10 en 10, después del 70 viene el ___.',opts:['80','71','100'],c:0},
  {s:'El resultado de la adición se llama suma o ___.',opts:['diferencia','total','resto'],c:1},
  {s:'En 720−245, el número 720 es el ___.',opts:['sustraendo','diferencia','minuendo'],c:2},
  {s:'Restar en la recta numérica es moverse hacia la ___.',opts:['izquierda','derecha','mitad'],c:0},
  {s:'El punto medio entre 20 y 40 es ___.',opts:['25','30','35'],c:1},
  {s:'Para saber cuánto le falta a 65 para llegar a 100 se usa la ___.',opts:['resta','suma','recta'],c:0}
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
    q: '¿Qué número está exactamente en medio de 40 y 60?',
    opts: ['45', '50', '55'],
    correct: 1,
    feedback: '¡Correcto! 50 está a 10 saltos de 40 y a 10 saltos de 60: es el punto medio.',
    wrongFeedback: 'La respuesta es 50: está a la misma distancia (10) de 40 y de 60. ¡Aprenderás el truco en la sección Aprende!',
    explore: 'medio'
  },
  {
    q: 'En una recta de 0 a 100 con marcas cada 10, ¿entre qué marcas queda el 75?',
    opts: ['Entre 70 y 80', 'Entre 60 y 70', 'Entre 80 y 90'],
    correct: 0,
    feedback: '¡Excelente! 75 es mayor que 70 y menor que 80, así que queda entre esas dos marcas.',
    wrongFeedback: 'La respuesta es: entre 70 y 80. El 75 es mayor que 70 pero todavía no llega a 80.',
    explore: 'entre'
  },
  {
    q: 'María tenía 350 lempiras y gastó 120. ¿Le queda más o menos que 200?',
    opts: ['Menos que 200', 'Exactamente 200', 'Más que 200'],
    correct: 2,
    feedback: '¡Muy bien! 350 − 120 = 230, y 230 es más que 200.',
    wrongFeedback: 'La respuesta es: más que 200. Al restar 350 − 120 quedan 230 lempiras.',
    explore: 'saltos'
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
      <button class="pd-explore-btn" onclick="togglePredExplore(${i})" id="pd-btn-${i}">🔍 Explorar la pista</button>
      <div class="pd-explore" id="pd-explore-${i}" style="display:none;"></div>
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

// --- Exploradores interactivos de la sección Predice ---
function togglePredExplore(i){
  sfx('click');
  const box=document.getElementById('pd-explore-'+i); if(!box) return;
  const btn=document.getElementById('pd-btn-'+i);
  if(box.style.display==='none'){
    if(!box.dataset.built){ _buildPredExplore(i,box); box.dataset.built='1'; }
    box.style.display='block'; if(btn) btn.textContent='🔽 Ocultar la pista';
  } else { box.style.display='none'; if(btn) btn.textContent='🔍 Explorar la pista'; }
}
function _pdTick(lbl){ const t=document.createElement('div'); t.className='pd-tick'; t.innerHTML=`<div class="pd-rail"></div><div class="pd-dot"></div><div class="pd-lbl">${lbl}</div>`; return t; }
function _buildPredExplore(i,box){
  const type=prediceData[i].explore;
  if(type==='medio'){
    box.innerHTML=`<p class="pd-tip">Toca cualquier marca y mide sus distancias a 40 y a 60:</p><div class="pd-line" id="pd-line-${i}"></div><div class="pd-msg" id="pd-msg-${i}">👆 prueba varias marcas hasta encontrar distancias iguales</div>`;
    const line=document.getElementById('pd-line-'+i);
    for(let v=40;v<=60;v+=5){
      const t=_pdTick(v);
      t.onclick=()=>{ sfx('click'); line.querySelectorAll('.pd-tick').forEach(x=>x.classList.remove('pd-on','pd-win'));
        const dA=v-40,dB=60-v; const msg=document.getElementById('pd-msg-'+i);
        if(dA===dB&&dA>0){ t.classList.add('pd-win'); msg.innerHTML=`⚖ <strong>${v}</strong> está a ${dA} de 40 y a ${dB} de 60. ¡Distancias iguales: ese es el punto medio! 🎯 Ahora responde abajo.`; sfx('ok'); }
        else{ t.classList.add('pd-on'); msg.innerHTML=`📏 <strong>${v}</strong> está a <strong>${dA}</strong> de 40 y a <strong>${dB}</strong> de 60. ¿Habrá una marca con distancias iguales?`; } };
      line.appendChild(t);
    }
  } else if(type==='entre'){
    box.innerHTML=`<p class="pd-tip">La estrella es el 75. Toca las marcas para descubrir cuáles la encierran:</p><div class="pd-line" id="pd-line-${i}"><span class="pd-star">⭐</span></div><div class="pd-msg" id="pd-msg-${i}">👆 toca una marca</div>`;
    const line=document.getElementById('pd-line-'+i);
    for(let k=0;k<=10;k++){
      const v=k*10; const t=_pdTick(v);
      t.onclick=()=>{ sfx('click'); const msg=document.getElementById('pd-msg-'+i);
        if(v===70||v===80){ t.classList.add('pd-win'); msg.innerHTML=`✔ ¡Sí! El 75 es mayor que <strong>70</strong> y menor que <strong>80</strong>: la estrella vive entre esas dos marcas. Ahora responde abajo.`; sfx('ok'); }
        else{ t.classList.add('pd-on'); setTimeout(()=>t.classList.remove('pd-on'),700); msg.innerHTML=`🤔 Tocaste el <strong>${v}</strong>. La estrella queda más ${v<75?'a la derecha':'a la izquierda'}. ¡Sigue buscando!`; } };
      line.appendChild(t);
    }
  } else if(type==='saltos'){
    box.innerHTML=`<p class="pd-tip">María parte del 350. Mira cómo retrocede 120 en saltos de 10:</p><div class="pd-counter" id="pd-cnt-${i}">350</div><div class="pd-msg" id="pd-msg-${i}">&nbsp;</div><div style="text-align:center;margin-top:0.4rem;"><button class="btn btn-pri" onclick="predSaltosAnim(${i})" id="pd-go-${i}">🐸 Quitar 120 en saltos</button></div>`;
  }
}
function predSaltosAnim(i){
  const btn=document.getElementById('pd-go-'+i); if(!btn||btn.disabled) return; btn.disabled=true; sfx('click');
  const cnt=document.getElementById('pd-cnt-'+i); const msg=document.getElementById('pd-msg-'+i);
  let v=350,steps=0;
  const int=setInterval(()=>{ v-=10; steps++; cnt.textContent=v; sfx('tick'); msg.innerHTML=`salto ${steps} de 12 · lleva quitados ${steps*10} lempiras`;
    if(steps>=12){ clearInterval(int); cnt.textContent='350 − 120 = '+v; msg.innerHTML='🏁 Llegó al <strong>230</strong>. Compáralo con 200 y responde abajo.'; sfx('fan'); btn.disabled=false; btn.textContent='🔄 Ver otra vez'; } },260);
}

// ===================== RETO FINAL (con parejas variables) =====================
const retoPairs=[
  {
    name:'Operaciones ⚙️', hint:'Calcula el resultado de A y compáralo con B',
    pool:[
      {w:'A: 46+38 ⚖ B: 90',t:'menor'},{w:'A: 120−45 ⚖ B: 75',t:'igual'},{w:'A: 65+35 ⚖ B: 100',t:'igual'},
      {w:'A: 200−80 ⚖ B: 110',t:'mayor'},{w:'A: 55+27 ⚖ B: 85',t:'menor'},{w:'A: 90−15 ⚖ B: 70',t:'mayor'},
      {w:'A: 34+48 ⚖ B: 82',t:'igual'},{w:'A: 150−75 ⚖ B: 80',t:'menor'},{w:'A: 72+19 ⚖ B: 89',t:'mayor'},
      {w:'A: 300−150 ⚖ B: 150',t:'igual'},{w:'A: 25+37 ⚖ B: 63',t:'menor'},{w:'A: 140−60 ⚖ B: 75',t:'mayor'}
    ]
  },
  {
    name:'Distancias en la recta 📏', hint:'La distancia entre dos puntos es la resta: mayor menos menor',
    pool:[
      {w:'A: distancia 20→65 ⚖ B: 40',t:'mayor'},{w:'A: distancia 30→80 ⚖ B: 50',t:'igual'},{w:'A: distancia 15→40 ⚖ B: 30',t:'menor'},
      {w:'A: distancia 100→250 ⚖ B: 150',t:'igual'},{w:'A: distancia 45→90 ⚖ B: 50',t:'menor'},{w:'A: distancia 10→85 ⚖ B: 70',t:'mayor'},
      {w:'A: distancia 200→340 ⚖ B: 150',t:'menor'},{w:'A: distancia 60→180 ⚖ B: 100',t:'mayor'},{w:'A: distancia 0→95 ⚖ B: 95',t:'igual'},
      {w:'A: distancia 25→100 ⚖ B: 70',t:'mayor'}
    ]
  },
  {
    name:'Números cardinales 🔢', hint:'Cuenta primero las cifras de cada número y compara de izquierda a derecha',
    pool:[
      {w:'A: 4,090 ⚖ B: 4,900',t:'menor'},{w:'A: 7,215 ⚖ B: 7,215',t:'igual'},{w:'A: 3,600 ⚖ B: 3,060',t:'mayor'},
      {w:'A: 999 ⚖ B: 1,001',t:'menor'},{w:'A: 5,480 ⚖ B: 5,480',t:'igual'},{w:'A: 8,020 ⚖ B: 8,002',t:'mayor'},
      {w:'A: 2,750 ⚖ B: 2,570',t:'mayor'},{w:'A: 6,309 ⚖ B: 6,390',t:'menor'},{w:'A: 1,111 ⚖ B: 1,111',t:'igual'},
      {w:'A: 9,050 ⚖ B: 9,500',t:'menor'}
    ]
  }
];
let currentRetoPairIdx=0;
let retoPool=[], retoOk=0, retoErr=0, retoTimerInt=null, retoSec=30, retoRunning=false, retoCurrent=null;
function _retoPairLbl(){ const rp=retoPairs[currentRetoPairIdx]; const el=document.getElementById('retoPairLbl'); if(el) el.textContent='🎯 Pareja actual: '+rp.name+' — 💡 '+rp.hint; }
function nextRetoPair(){ sfx('click'); currentRetoPairIdx=(currentRetoPairIdx+1)%retoPairs.length; resetReto(); _retoPairLbl(); showToast('🔀 Pareja: '+retoPairs[currentRetoPairIdx].name); }
function startReto(){
    if(retoRunning)return; sfx('click'); retoRunning=true; retoOk=0; retoErr=0; retoSec=30;
    const pool=retoPairs[currentRetoPairIdx].pool;
    retoPool=_shuffle([...pool,...pool]); showRetoWord();
    const _fill=document.getElementById('retoBarFill'); if(_fill){_fill.style.width='100%';_fill.style.background='var(--jade)';}
  retoTimerInt=setInterval(()=>{ retoSec--; sfx('tick'); document.getElementById('retoTimer').textContent='⏱ '+retoSec; if(retoSec<=10) document.getElementById('retoTimer').style.color='var(--red)'; const fill=document.getElementById('retoBarFill'); if(fill){fill.style.width=(retoSec/30*100)+'%';if(retoSec<=10)fill.style.background='var(--red)';} if(retoSec<=0){ clearInterval(retoTimerInt); endReto(); } },1000);
}
function showRetoWord(){ const pool=retoPairs[currentRetoPairIdx].pool; if(retoPool.length===0) retoPool=_shuffle([...pool,...pool]); retoCurrent=retoPool.pop(); document.getElementById('retoWord').textContent=retoCurrent.w; }
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
function endReto(){ retoRunning=false; document.getElementById('retoWord').textContent='🏁 ¡Tiempo!'; document.getElementById('retoTimer').style.color='var(--pri)'; xpTracker.reto.add(1); const total=retoOk+retoErr; const pct=total>0?Math.round((retoOk/total)*100):0; fb('fbReto',`Resultado: ${retoOk}/${total} (${pct}%) ¡Bien hecho! Prueba otra pareja con 🔀`,true); fin('s-reto'); sfx('fan'); unlockAchievement('reto_hero'); }
function resetReto(){ sfx('click'); clearInterval(retoTimerInt); retoRunning=false; retoSec=30; retoOk=0; retoErr=0; document.getElementById('retoTimer').textContent='⏱ 30'; document.getElementById('retoTimer').style.color='var(--pri)'; document.getElementById('retoWord').textContent='¡Prepárate!'; document.getElementById('retoScore').textContent='✔ 0 correctas | ✗ 0 errores'; document.getElementById('fbReto').classList.remove('show'); }

// ===================== GENERADOR DE TAREAS =====================
// Tareas autogeneradas: el estudiante se autoasigna práctica desde casa o el
// docente las copia en el pizarrón. Cada "⚡ Generar" crea ejercicios nuevos
// y las respuestas quedan ocultas hasta presionar "👁 Respuestas".
function _tgRint(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
function _tgLines(n){ let s=''; for(let i=0;i<n;i++) s+='<div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.4rem;height:1.3rem;">&nbsp;</div>'; return s; }
function _tgTask(out,i,inner){ const div=document.createElement('div'); div.className='tg-task'; div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content">${inner}</div>`; out.appendChild(div); }
const pensamientoTaskDB=[
  {q:'Un saltamontes parte del 14 y da 5 saltos iguales hasta llegar al 44. ¿Cuánto mide cada salto?',ans:'Del 14 al 44 hay 44−14=30. Como dio 5 saltos iguales, cada salto mide 30÷5=6.',type:'🦗 Saltos iguales'},
  {q:'Encuentra el error: "El punto medio entre 30 y 50 es 35".',ans:'El error es que 35 está a 5 de 30 pero a 15 de 50. El punto medio es 40: está a 10 de cada uno.',type:'🔎 Detectar error'},
  {q:'Calcula 99+99+99 con un truco rápido y explica el truco.',ans:'Uso 100 en vez de 99: 100×3=300, y le quito los 3 que agregué de más: 300−3=297.',type:'⚡ Cálculo ingenioso'},
  {q:'Dos números suman 100 y su diferencia es 20. ¿Cuáles son?',ans:'Son 60 y 40: 60+40=100 y 60−40=20. Pista: el punto medio de la suma es 50; uno está 10 arriba y otro 10 abajo.',type:'🧠 Razonar sin calcular de más'},
  {q:'Inventa un problema de la vida real que se resuelva con 450−175 y resuélvelo.',ans:'Respuesta variable. Ej: "Rosa tenía 450 lempiras y compró un libro de 175. ¿Cuánto le queda?" R: 450−175=275 lempiras.',type:'✏️ Crear problema'},
  {q:'¿Qué número está a la misma distancia del 20 que del 80 en la recta numérica? Justifica.',ans:'El 50: está a 30 saltos del 20 (50−20=30) y a 30 del 80 (80−50=30). Es el punto medio.',type:'📏 Distancias iguales'}
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
function genTask(){ sfx('click'); const type=document.getElementById('tgType').value; const count=parseInt(document.getElementById('tgCount').value); ansVisible=false; const out=document.getElementById('tgOut'); out.innerHTML=''; if(type==='recta') genRectaTask(out,count); else if(type==='operaciones') genOperacionesTask(out,count); else if(type==='problemas') genProblemasTask(out,count); else if(type==='escondido') genEscondidoTask(out,count); else if(type==='piramide') genPiramideTask(out,count); else if(type==='pensamiento') genPensamientoTask(out,count); fin('s-tareas'); }
function _instrBlock(out,title,lines){ const ib=document.createElement('div'); ib.className='tg-instruction-block'; ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join(''); out.appendChild(ib); }
// 📏 Dibujar rectas y ubicar números (aleatorio: nunca se repite)
function genRectaTask(out,count){
  _instrBlock(out,'Instrucción — Ubicar en la recta',['En tu cuaderno dibuja UNA recta por ejercicio: escribe el número inicial y el final, divide en 8 saltos iguales y ubica los números pedidos.','<strong>Pista:</strong> antes de ubicar, pregúntate: ¿cuánto vale cada salto?']);
  const steps=[5,10,20,25,50,100];
  for(let i=0;i<count;i++){
    const step=steps[_tgRint(0,steps.length-1)]; const start=step*_tgRint(0,6); const end=start+8*step;
    const ks=[]; while(ks.length<3){ const k=_tgRint(1,7); if(!ks.includes(k)) ks.push(k); } ks.sort((a,b)=>a-b);
    _tgTask(out,i,`<strong>Dibuja una recta de ${_fmtNum(start)} a ${_fmtNum(end)} con escala de ${step} en ${step} y ubica: ${ks.map(k=>'<strong>'+_fmtNum(start+k*step)+'</strong>').join(' · ')}</strong>${_tgLines(2)}<div class="tg-answer">✔ ${ks.map(k=>_fmtNum(start+k*step)+' → a '+k+' saltos del '+_fmtNum(start)).join(' · ')}</div>`);
  }
}
// ➕➖ Operaciones en columna
function genOperacionesTask(out,count){
  _instrBlock(out,'Instrucción — Sumas y restas en columna',['Copia cada operación EN COLUMNA (unidades bajo unidades, decenas bajo decenas) y resuelve.','<strong>Recuerda:</strong> en la suma se lleva; en la resta se pide prestado. Comprueba cada resta con: sustraendo + diferencia = minuendo.']);
  for(let i=0;i<count;i++){
    const esSuma=i%2===0; let a,b,ans,expr,prueba='';
    if(esSuma){ a=_tgRint(146,4980); b=_tgRint(138,4900); ans=a+b; expr=`${_fmtNum(a)} + ${_fmtNum(b)} =`; }
    else{ a=_tgRint(500,9800); b=_tgRint(120,a-80); ans=a-b; expr=`${_fmtNum(a)} − ${_fmtNum(b)} =`; prueba=` (prueba: ${_fmtNum(b)} + ${_fmtNum(ans)} = ${_fmtNum(a)})`; }
    _tgTask(out,i,`<strong style="font-family:'Fira Code',monospace;">${expr}</strong>${_tgLines(1)}<div class="tg-answer">✔ ${_fmtNum(ans)}${prueba}</div>`);
  }
}
// 📖 Problemas con la ruta de 4 pasos
function _tgProblema(){
  const NAMES=['Ana','Luis','Marta','José','Carmen','Pedro','Sofía','Iván'];
  const OBJS=['mangos','libros','canicas','boletos','lápices','naranjas'];
  const n1=NAMES[_tgRint(0,NAMES.length-1)]; let n2=NAMES[_tgRint(0,NAMES.length-1)]; while(n2===n1) n2=NAMES[_tgRint(0,NAMES.length-1)];
  const obj=OBJS[_tgRint(0,OBJS.length-1)]; const tp=_tgRint(0,4);
  if(tp===0){ const a=_tgRint(150,850),b=_tgRint(120,850); return {text:`${n1} tiene ${_fmtNum(a)} ${obj} y consigue ${_fmtNum(b)} más. ¿Cuántos ${obj} tiene ahora?`,op:'Suma',expr:`${_fmtNum(a)} + ${_fmtNum(b)}`,ans:a+b}; }
  if(tp===1){ const a=_tgRint(400,950),b=_tgRint(120,a-50); return {text:`${n1} tenía ${_fmtNum(a)} ${obj} y regaló ${_fmtNum(b)}. ¿Cuántos ${obj} le quedan?`,op:'Resta',expr:`${_fmtNum(a)} − ${_fmtNum(b)}`,ans:a-b}; }
  if(tp===2){ const a=_tgRint(500,980),b=_tgRint(120,a-60); return {text:`${n1} quiere reunir ${_fmtNum(a)} lempiras y ya tiene ${_fmtNum(b)}. ¿Cuántos lempiras le faltan?`,op:'Resta',expr:`${_fmtNum(a)} − ${_fmtNum(b)}`,ans:a-b}; }
  if(tp===3){ const a=_tgRint(500,950),b=_tgRint(120,a-40); return {text:`${n1} recorrió ${_fmtNum(a)} metros y ${n2} recorrió ${_fmtNum(b)}. ¿Cuántos metros más recorrió ${n1}?`,op:'Resta',expr:`${_fmtNum(a)} − ${_fmtNum(b)}`,ans:a-b}; }
  const a=_tgRint(150,480),b=_tgRint(150,480); return {text:`En la escuela hay ${_fmtNum(a)} niñas y ${_fmtNum(b)} niños. ¿Cuántos estudiantes hay en total?`,op:'Suma',expr:`${_fmtNum(a)} + ${_fmtNum(b)}`,ans:a+b};
}
function genProblemasTask(out,count){
  _instrBlock(out,'Instrucción — Problemas de la vida real',['Sigue la ruta de 4 pasos con cada problema: 1) léelo dos veces, 2) anota los datos, 3) decide si es suma o resta, 4) resuelve y responde con la unidad.']);
  for(let i=0;i<count;i++){
    const p=_tgProblema();
    _tgTask(out,i,`<strong>${p.text}</strong><div style="margin-top:0.4rem;font-size:0.82rem;color:var(--gray);">Datos: __________ · Operación: __________ · Respuesta: __________</div>${_tgLines(2)}<div class="tg-answer">✔ ${p.op}: ${p.expr} = ${_fmtNum(p.ans)}</div>`);
  }
}
// ▢ Número escondido (operación inversa)
function genEscondidoTask(out,count){
  _instrBlock(out,'Instrucción — El número escondido',['Descubre el número que se esconde en la casilla ▢ usando la operación inversa y comprueba tu respuesta.','<strong>Ejemplo:</strong> ▢ + 20 = 50 → hago 50 − 20 = 30 → compruebo: 30 + 20 = 50 ✔']);
  for(let i=0;i<count;i++){
    const f=i%4; let expr,ans,how;
    if(f===0){ const x=_tgRint(15,480),a=_tgRint(15,480); expr=`▢ + ${_fmtNum(a)} = ${_fmtNum(x+a)}`; ans=x; how=`${_fmtNum(x+a)} − ${_fmtNum(a)}`; }
    else if(f===1){ const x=_tgRint(15,480),a=_tgRint(15,480); expr=`${_fmtNum(a)} + ▢ = ${_fmtNum(x+a)}`; ans=x; how=`${_fmtNum(x+a)} − ${_fmtNum(a)}`; }
    else if(f===2){ const c=_tgRint(200,980),x=_tgRint(50,c-60); expr=`${_fmtNum(c)} − ▢ = ${_fmtNum(c-x)}`; ans=x; how=`${_fmtNum(c)} − ${_fmtNum(c-x)}`; }
    else{ const a=_tgRint(50,400),d=_tgRint(50,500); expr=`▢ − ${_fmtNum(a)} = ${_fmtNum(d)}`; ans=a+d; how=`${_fmtNum(d)} + ${_fmtNum(a)}`; }
    _tgTask(out,i,`<strong style="font-family:'Fira Code',monospace;">${expr}</strong>${_tgLines(1)}<div class="tg-answer">✔ ▢ = ${_fmtNum(ans)} (inversa: ${how})</div>`);
  }
}
// 🔺 Pirámides numéricas
function genPiramideTask(out,count){
  _instrBlock(out,'Instrucción — Pirámides numéricas',['Copia cada pirámide en tu cuaderno. Cada casilla es la SUMA de las dos casillas de abajo. Completa la fila del medio y la cúspide.']);
  for(let i=0;i<count;i++){
    const b=[_tgRint(11,49),_tgRint(11,49),_tgRint(11,49)]; const m1=b[0]+b[1],m2=b[1]+b[2];
    _tgTask(out,i,`<div class="op-pira"><div class="op-pira-row"><div class="op-pira-cell op-pira-empty">?</div></div><div class="op-pira-row"><div class="op-pira-cell op-pira-empty">&nbsp;</div><div class="op-pira-cell op-pira-empty">&nbsp;</div></div><div class="op-pira-row"><div class="op-pira-cell">${b[0]}</div><div class="op-pira-cell">${b[1]}</div><div class="op-pira-cell">${b[2]}</div></div></div><div class="tg-answer">✔ fila del medio: ${m1} y ${m2} · cúspide: ${m1+m2}</div>`);
  }
}
function toggleAns(){ ansVisible=!ansVisible; document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none'); sfx('click'); }

// ===================== SOPA DE LETRAS (multidireccional, con inversas) =====================
const sopaSets=[
  {
    size:10,
    grid:[
      ['C','D','T','P','G','A','H','P','G','F'],
      ['J','F','O','F','R','T','U','U','J','M'],
      ['A','I','R','E','F','N','N','U','P','N'],
      ['A','M','E','O','T','R','C','U','E','N'],
      ['M','L','C','O','I','J','E','G','S','I'],
      ['U','E','T','T','G','D','I','S','P','T'],
      ['S','N','A','M','A','R','E','F','T','A'],
      ['T','D','I','C','O','R','B','M','O','A'],
      ['J','L','I','O','S','S','A','L','T','O'],
      ['P','S','I','A','L','A','C','S','E','A']
    ],
    words:[
      {w:'RECTA', cells:[[2,2],[3,2],[4,2],[5,2],[6,2]]},
      {w:'PUNTO', cells:[[0,7],[1,6],[2,5],[3,4],[4,3]]},
      {w:'ORIGEN', cells:[[7,4],[6,5],[5,6],[4,7],[3,8],[2,9]]},
      {w:'ESCALA', cells:[[9,8],[9,7],[9,6],[9,5],[9,4],[9,3]]},
      {w:'SUMA', cells:[[6,0],[5,0],[4,0],[3,0]]},
      {w:'RESTA', cells:[[3,5],[4,6],[5,7],[6,8],[7,9]]},
      {w:'SALTO', cells:[[8,5],[8,6],[8,7],[8,8],[8,9]]},
      {w:'MEDIO', cells:[[7,7],[6,6],[5,5],[4,4],[3,3]]}
    ]
  },
  {
    size:10,
    grid:[
      ['O','F','B','N','T','S','L','I','L','O'],
      ['T','A','L','O','U','G','B','B','F','D'],
      ['I','H','T','A','S','M','O','U','G','N'],
      ['H','A','D','D','N','R','E','B','R','E'],
      ['L','N','H','I','E','I','S','R','C','U'],
      ['H','E','M','C','P','C','D','A','O','N'],
      ['R','N','U','I','T','G','O','R','H','I'],
      ['C','P','B','O','F','A','I','D','A','M'],
      ['A','V','A','N','Z','A','R','N','B','C'],
      ['B','O','O','O','D','N','A','M','U','S']
    ],
    words:[
      {w:'ADICION', cells:[[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3]]},
      {w:'CARDINAL', cells:[[8,9],[7,8],[6,7],[5,6],[4,5],[3,4],[2,3],[1,2]]},
      {w:'SUMANDO', cells:[[9,9],[9,8],[9,7],[9,6],[9,5],[9,4],[9,3]]},
      {w:'MINUENDO', cells:[[7,9],[6,9],[5,9],[4,9],[3,9],[2,9],[1,9],[0,9]]},
      {w:'TOTAL', cells:[[0,4],[1,3],[2,2],[3,1],[4,0]]},
      {w:'AVANZAR', cells:[[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,6]]},
      {w:'NUMERO', cells:[[0,3],[1,4],[2,5],[3,6],[4,7],[5,8]]},
      {w:'CERO', cells:[[5,3],[4,4],[3,5],[2,6]]}
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
window.addEventListener('resize',()=>{ clearTimeout(_sopaResizeTimer); _sopaResizeTimer=setTimeout(()=>{if(document.getElementById('s-sopa').classList.contains('active'))buildSopa();},200); });

// ===================== EVALUACIÓN FINAL (CONCEPTUAL) =====================
const evalTFBank=[
  {q:'El origen de la recta numérica es el cero.',a:true},
  {q:'En la recta numérica los números crecen hacia la izquierda.',a:false},
  {q:'El punto medio entre 40 y 60 es 50.',a:true},
  {q:'En 90−35=55, el sustraendo es 90.',a:false},
  {q:'Los sumandos son los números que se juntan en una adición.',a:true},
  {q:'Si la escala es de 10 en 10, después del 70 viene el 71.',a:false},
  {q:'Sumar es avanzar hacia la derecha en la recta numérica.',a:true},
  {q:'La diferencia es el resultado de la sustracción.',a:true},
  {q:'Para saber cuánto le falta a 65 para llegar a 100 se usa la suma.',a:false},
  {q:'La prueba de la resta dice: sustraendo + diferencia = minuendo.',a:true}
];
const evalMCBank=[
  {q:'¿Cuál es el punto medio entre 200 y 300?',o:['a) 205','b) 250','c) 230','d) 295'],a:1},
  {q:'En una recta de 0 a 80 con marcas cada 10, ¿qué número está en la 5.ª marca después del 0?',o:['a) 5','b) 40','c) 50','d) 55'],a:2},
  {q:'En 720−245=475, ¿cómo se llama el número 720?',o:['a) sustraendo','b) diferencia','c) minuendo','d) sumando'],a:2},
  {q:'¿Qué operación responde "cuánto le falta a 38 para llegar a 52"?',o:['a) 38+52','b) 52−38','c) 52+38','d) 38−52'],a:1},
  {q:'Ana tiene 385 lempiras y recibe 150. ¿Cuánto tiene ahora?',o:['a) 235','b) 535','c) 435','d) 545'],a:1}
];
const evalCPBank=[
  {q:'El punto de partida de la recta numérica se llama ___.',a:'origen'},
  {q:'El valor de cada salto entre marcas se llama ___.',a:'escala'},
  {q:'El resultado de la adición se llama suma o ___.',a:'total'},
  {q:'En 90−35=55, el número 35 es el ___.',a:'sustraendo'},
  {q:'El punto ___ entre 20 y 40 es 30.',a:'medio'}
];
const evalPRBank=[
  {term:'Origen',def:'Punto de partida de la recta numérica (el cero)'},
  {term:'Escala',def:'Valor de cada salto entre las marcas de la recta'},
  {term:'Minuendo',def:'Número al que se le quita en una sustracción'},
  {term:'Diferencia',def:'Resultado de la sustracción'},
  {term:'Punto medio',def:'Número que está a la misma distancia de otros dos'}
];
function genEval(){
  sfx('click');
  const cf=evalFormNum; window._currentEvalForm=cf; evalFormNum=(evalFormNum%10)+1; saveProgress();
  document.getElementById('eval-screen-title').textContent=`📋 Evaluación Final — Forma ${cf}`;
  evalAnsVisible=false;
  const out=document.getElementById('evalOut'); out.innerHTML='';
  const bar=document.createElement('div'); bar.className='eval-score-bar';
  bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje — 100 puntos</div><div class="esb-dist">4 secciones × 5 preguntas × 5 pts = 100 pts</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">I. Completar 25 pts</span><span class="eval-score-pill esp-tf">II. V/F 25 pts</span><span class="eval-score-pill esp-mc">III. Selección 25 pts</span><span class="eval-score-pill esp-pr">IV. Pareados 25 pts</span></div>`;
  out.appendChild(bar);
  const cpItems=_pick(evalCPBank,5);
  const s1=document.createElement('div'); s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  cpItems.forEach((item,i)=>{ const d=document.createElement('div'); d.className='eval-item eval-auto-item'; const qHtml=item.q.replace('___','<input class="eval-cp-input" type="text" data-ecp="'+i+'" autocomplete="off" style="min-width:110px;">'); d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbEcp${i}" aria-live="polite"></div>`; s1.appendChild(d); });
  out.appendChild(s1);
  const tfItems=_pick(evalTFBank,5);
  const s2=document.createElement('div'); s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  tfItems.forEach((item,i)=>{ const d=document.createElement('div'); d.className='eval-item eval-auto-item'; d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="V"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="F"> Falso</label></div><div style="margin-top:0.4rem;margin-left:1.7rem;font-size:0.82rem;color:var(--gray);">Justifica por qué: <span style="display:inline-block;min-width:180px;border-bottom:1px solid var(--border);">&nbsp;</span></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbEtf${i}" aria-live="polite"></div>`; s2.appendChild(d); });
  out.appendChild(s2);
  const mcItems=_pick(evalMCBank,5);
  const s3=document.createElement('div'); s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  mcItems.forEach((item,i)=>{ const d=document.createElement('div'); d.className='eval-item eval-auto-item'; const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join(''); d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbEmc${i}" aria-live="polite"></div>`; s3.appendChild(d); });
  out.appendChild(s3);
  const prItems=_pick(evalPRBank,5); const shuffledDefs=[...prItems].sort(()=>Math.random()-0.5); const letters=['A','B','C','D','E'];
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

const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación Recta Numérica · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:12pt;color:#111;background:#fff;padding:4mm 6mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.5rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;color:#1565c0;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:#1565c0;margin-top:0.15rem;font-weight:700;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.5rem 0 0.25rem;border-left:4px solid #1565c0;background:#e3f2fd;display:flex;justify-content:space-between;align-items:center;color:#1565c0;}.qn{font-weight:700;min-width:22px;flex-shrink:0;color:#1565c0;}.tf-row{display:flex;align-items:flex-start;gap:0.3rem;font-size:10.5pt;line-height:1.4;padding:0.25rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:42px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.2rem;margin-top:0.2rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.28rem 0.45rem;margin-bottom:0.22rem;break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.4;display:flex;gap:0.3rem;margin-bottom:0.18rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.22rem 0.55rem;}.mc-opts{display:grid;grid-template-columns:repeat(3,1fr);gap:0.08rem 0.25rem;margin-left:1.3rem;}.mc-opt{font-size:9.5pt;display:flex;align-items:center;gap:0.22rem;}.mc-opt input{width:12px;height:12px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.4;padding:0.22rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:130px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{break-inside:avoid;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.2rem 0.5rem;margin-top:0.15rem;}.pr-head{font-size:9pt;font-weight:700;color:#1565c0;margin-bottom:0.2rem;}.pr-item{font-size:10pt;padding:0.22rem 0.32rem;background:#e3f2fd;border-radius:3px;margin-bottom:0.12rem;display:flex;align-items:center;gap:0.22rem;line-height:1.2;}.pr-num{font-weight:700;color:#1565c0;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #1565c0;padding-bottom:0.35rem;margin-bottom:0.5rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;color:#1565c0;}.p-sub{font-size:9pt;color:#1565c0;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #cce0ff;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;color:#1565c0;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#1565c0;}.pa{color:#007a00;font-weight:700;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:#1565c0;font-weight:700;font-style:italic;}.obt-lbl{font-weight:700;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #1565c0;height:12px;}.obt-pct{font-weight:700;}.total-row{display:flex;align-items:baseline;justify-content:flex-end;gap:7px;font-size:11pt;color:#1565c0;font-weight:700;font-style:italic;margin-top:0.4rem;padding:0.2rem 0.5rem;background:#e3f2fd;border-radius:4px;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #1565c0;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · Misión Recta Numérica, Suma y Resta · Matemática</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 4 secciones × 5 preguntas × 5 pts c/u · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✔ PAUTA DOCENTE — Evaluación Final · Recta Numérica · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">100 pts | 4 secciones × 5 preguntas × 5 pts | Matemáticas II Ciclo</div></div><div class="p-grid">${pR}</div>
  ${zgBlock}</div><div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("evalPage",252,0.55,1.45);fit("pautaPage",252,0.55,1.3);})();</script></body></html>`;
  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(doc); win.document.close(); setTimeout(()=>win.print(),400);
}

// ===================== EXPLICA CON TUS PALABRAS =====================
const explicaData = [
  {
    q: 'Explica cómo ubicas el número 70 en una recta de 0 a 100 con marcas cada 10.',
    hint: '💡 Pista: piensa cuánto vale cada salto y cuántos saltos necesitas.',
    rubric: ['✓ Identifica que la escala es de 10 en 10', '✓ Cuenta los saltos desde el origen (7 saltos)', '✓ Ubica el 70 en la séptima marca después del 0'],
    suggested: 'Cada salto de la recta vale 10. Parto del 0 y cuento 7 saltos: 10, 20, 30, 40, 50, 60 y 70. El número 70 queda en la séptima marca después del origen.'
  },
  {
    q: '¿Por qué el punto medio entre 40 y 60 es 50 y no 45?',
    hint: '💡 Pista: mide la distancia del punto a cada extremo.',
    rubric: ['✓ Explica que el punto medio está a la misma distancia de ambos números', '✓ Muestra que 50 está a 10 de 40 y a 10 de 60', '✓ Muestra que 45 está a 5 de 40 pero a 15 de 60'],
    suggested: 'El punto medio debe estar a la misma distancia de los dos números. 50 está a 10 saltos de 40 y a 10 saltos de 60: distancias iguales. En cambio, 45 está a 5 de 40 pero a 15 de 60, así que no es el centro.'
  },
  {
    q: 'Explica con la recta numérica por qué 46+38=84.',
    hint: '💡 Pista: sumar es avanzar hacia la derecha.',
    rubric: ['✓ Parte del primer sumando (46)', '✓ Explica que suma avanzando hacia la derecha 38 lugares', '✓ Puede descomponer el avance: 30 y luego 8, llegando a 84'],
    suggested: 'Me paro en el 46 y avanzo 38 hacia la derecha. Primero avanzo 30 y llego al 76; luego avanzo 4 y llego al 80, y avanzo 4 más hasta el 84. Por eso 46+38=84.'
  },
  {
    q: 'Carlos dice que 500−137=463. Usa la prueba de la resta para revisar su respuesta y explica.',
    hint: '💡 Pista: sustraendo + diferencia debe dar el minuendo.',
    rubric: ['✓ Aplica la prueba: 137+463', '✓ Descubre que 137+463=600, no 500', '✓ Corrige el resultado: 500−137=363'],
    suggested: 'Aplico la prueba: sustraendo + diferencia = minuendo. 137+463=600, y 600 no es 500, así que Carlos se equivocó. La respuesta correcta es 363, porque 137+363=500 ✔.'
  },
  {
    q: 'Inventa un problema de la vida real que se resuelva con 250−80 y resuélvelo.',
    hint: '💡 Pista: piensa en dinero, frutas, kilómetros o estudiantes.',
    rubric: ['✓ El contexto es de la vida real', '✓ El problema pide quitar, comparar o hallar lo que falta', '✓ Resuelve correctamente: 250−80=170'],
    suggested: '"Doña Rosa llevó 250 tortillas al mercado y vendió 80 en la mañana. ¿Cuántas le quedan?" Resuelvo: 250−80=170 tortillas.'
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

// ===================== PRUEBA OPERATIVA — RECTA NUMÉRICA Y PROBLEMAS =====================

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
function _opRint(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function _fmtNum(n) { return n.toLocaleString('en-US'); }
function _isIntMatch(student, expectedNum) {
  const raw = (student || '').toString().trim().replace(/[,\s]/g, '');
  if (!raw) return false;
  const n = parseInt(raw, 10);
  return !isNaN(n) && n === expectedNum;
}

// I. Ubica el punto en la recta (5 × 10 = 50 pts)
const UB_STEPS = [5, 10, 20, 25, 50, 100];
function genUbicaItems() {
  const items = [];
  for (let i = 0; i < 5; i++) {
    const step = UB_STEPS[_opRint(0, UB_STEPS.length - 1)];
    const start = step * _opRint(0, 8);
    const k = _opRint(1, 7);
    items.push({ start, step, k, end: start + 8 * step, ansNum: start + k * step });
  }
  return items;
}
function _rectaHTML(it) {
  let cells = '';
  for (let t = 0; t <= 8; t++) {
    const lbl = t === 0 ? _fmtNum(it.start) : t === 8 ? _fmtNum(it.end) : '•';
    cells += `<div class="op-tick"><div class="op-arrow">${t === it.k ? '🔻' : '&nbsp;'}</div><div class="op-line"></div><div class="op-bar"></div><div class="op-lbl">${lbl}</div></div>`;
  }
  return `<div class="op-recta-wrap"><div class="op-recta">${cells}</div></div>`;
}

// II. Problemas breves (5 × 4 = 20 pts)
const OP_NAMES = ['Ana', 'Luis', 'Marta', 'José', 'Carmen', 'Pedro', 'Sofía', 'Iván'];
const OP_OBJS = ['mangos', 'libros', 'boletos', 'tapones', 'lápices', 'chocolates'];
function genProblemaItems() {
  const items = [];
  const tipos = _shuffle([0, 1, 2, 3, 4]);
  tipos.forEach(tp => {
    const n1 = OP_NAMES[_opRint(0, OP_NAMES.length - 1)];
    let n2 = OP_NAMES[_opRint(0, OP_NAMES.length - 1)];
    while (n2 === n1) n2 = OP_NAMES[_opRint(0, OP_NAMES.length - 1)];
    const obj = OP_OBJS[_opRint(0, OP_OBJS.length - 1)];
    let text, ansNum;
    if (tp === 0) { const a = _opRint(150, 850), b = _opRint(120, 850); text = `${n1} tiene ${_fmtNum(a)} ${obj} y consigue ${_fmtNum(b)} más. ¿Cuántos ${obj} tiene ahora?`; ansNum = a + b; }
    else if (tp === 1) { const a = _opRint(400, 950), b = _opRint(120, a - 50); text = `${n1} tenía ${_fmtNum(a)} ${obj} y regaló ${_fmtNum(b)}. ¿Cuántos ${obj} le quedan?`; ansNum = a - b; }
    else if (tp === 2) { const a = _opRint(500, 980), b = _opRint(120, a - 60); text = `${n1} quiere reunir ${_fmtNum(a)} lempiras para un regalo y ya tiene ${_fmtNum(b)}. ¿Cuántos lempiras le faltan?`; ansNum = a - b; }
    else if (tp === 3) { const a = _opRint(500, 950), b = _opRint(120, a - 40); text = `${n1} recorrió ${_fmtNum(a)} metros y ${n2} recorrió ${_fmtNum(b)} metros. ¿Cuántos metros más recorrió ${n1}?`; ansNum = a - b; }
    else { const a = _opRint(150, 480), b = _opRint(150, 480); text = `En la escuela hay ${_fmtNum(a)} niñas y ${_fmtNum(b)} niños. ¿Cuántos estudiantes hay en total?`; ansNum = a + b; }
    items.push({ text, ansNum });
  });
  return items;
}

// III. Cadena de saltos (5 × 2 = 10 pts)
function genCadenaItems() {
  const items = [];
  for (let i = 0; i < 5; i++) {
    const s = _opRint(100, 800), d1 = _opRint(25, 180);
    const d2 = _opRint(25, Math.min(180, s + d1 - 10));
    items.push({ text: `Parte del ${_fmtNum(s)}, avanza ${d1} y luego retrocede ${d2}. ¿A qué número llegas?`, ansNum: s + d1 - d2 });
  }
  return items;
}

// IV. ¿Qué número se esconde? (5 × 2 = 10 pts)
function genFaltanteItems() {
  const items = [];
  const forms = [0, 1, 2, 3, _opRint(0, 3)];
  forms.forEach(f => {
    let expr, ansNum;
    if (f === 0) { const x = _opRint(15, 480), a = _opRint(15, 480); expr = `▢ + ${_fmtNum(a)} = ${_fmtNum(x + a)}`; ansNum = x; }
    else if (f === 1) { const x = _opRint(15, 480), a = _opRint(15, 480); expr = `${_fmtNum(a)} + ▢ = ${_fmtNum(x + a)}`; ansNum = x; }
    else if (f === 2) { const c = _opRint(200, 980), x = _opRint(50, c - 60); expr = `${_fmtNum(c)} − ▢ = ${_fmtNum(c - x)}`; ansNum = x; }
    else { const a = _opRint(50, 400), d = _opRint(50, 500); expr = `▢ − ${_fmtNum(a)} = ${_fmtNum(d)}`; ansNum = a + d; }
    items.push({ expr, ansNum });
  });
  return items;
}

// V. Pirámides numéricas (2 × 5 = 10 pts)
function genPiramideItems() {
  const items = [];
  for (let i = 0; i < 2; i++) {
    const base = [_opRint(11, 49), _opRint(11, 49), _opRint(11, 49)];
    const m1 = base[0] + base[1], m2 = base[1] + base[2];
    items.push({ base, m1, m2, ansNum: m1 + m2 });
  }
  return items;
}
function _piraHTML(it, showMids) {
  const mid = showMids ? [it.m1, it.m2] : ['&nbsp;', '&nbsp;'];
  return `<div class="op-pira"><div class="op-pira-row"><div class="op-pira-cell op-pira-empty">?</div></div><div class="op-pira-row"><div class="op-pira-cell op-pira-empty">${mid[0]}</div><div class="op-pira-cell op-pira-empty">${mid[1]}</div></div><div class="op-pira-row"><div class="op-pira-cell">${it.base[0]}</div><div class="op-pira-cell">${it.base[1]}</div><div class="op-pira-cell">${it.base[2]}</div></div></div>`;
}

function genEvalOp() {
  sfx('click');
  const cf = evalOpFormNum; window._currentEvalOpForm = cf; evalOpFormNum = (evalOpFormNum % 10) + 1; saveProgress();
  document.getElementById('evalop-screen-title').textContent = `📐 Prueba Operativa — Forma ${cf} · Recta Numérica y Problemas`;
  evalOpAnsVisible = false;
  const out = document.getElementById('evalOpOut'); out.innerHTML = '';

  const ubItems = genUbicaItems();
  const s1 = document.createElement('div');
  s1.innerHTML = '<div class="eval-section-title">I. Ubica el punto en la recta <span class="eval-pts">50 pts · 10 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Observa cada recta y escribe el número que señala la flecha 🔻. Fíjate en la escala.</p>';
  ubItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">Escala de ${it.step} en ${it.step}:</span></div>${_rectaHTML(it)}<div class="opx-row"><span class="opx-expr">La flecha señala el número:</span><input class="eval-cp-input" type="text" data-ub="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${_fmtNum(it.ansNum)}</div><div class="eval-item-feedback" id="evalFbUb${i}" aria-live="polite"></div>`;
    s1.appendChild(d);
  });
  out.appendChild(s1);

  const prItems = genProblemaItems();
  const s2 = document.createElement('div');
  s2.innerHTML = '<div class="eval-section-title">II. Problemas breves <span class="eval-pts">20 pts · 4 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Decide si es suma o resta, resuelve en tu cuaderno y escribe la respuesta.</p>';
  prItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.text}</span><input class="eval-cp-input" type="text" data-pr="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${_fmtNum(it.ansNum)}</div><div class="eval-item-feedback" id="evalFbPr${i}" aria-live="polite"></div>`;
    s2.appendChild(d);
  });
  out.appendChild(s2);

  const caItems = genCadenaItems();
  const s3 = document.createElement('div');
  s3.innerHTML = '<div class="eval-section-title">III. Cadena de saltos en la recta <span class="eval-pts">10 pts · 2 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Avanzar es sumar; retroceder es restar.</p>';
  caItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.text}</span><input class="eval-cp-input" type="text" data-ca="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${_fmtNum(it.ansNum)}</div><div class="eval-item-feedback" id="evalFbCa${i}" aria-live="polite"></div>`;
    s3.appendChild(d);
  });
  out.appendChild(s3);

  const faItems = genFaltanteItems();
  const s4 = document.createElement('div');
  s4.innerHTML = '<div class="eval-section-title">IV. ¿Qué número se esconde en ▢? <span class="eval-pts">10 pts · 2 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Usa la operación inversa para descubrir el número escondido.</p>';
  faItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="opx-row"><span class="eval-num">${i+1}</span><span class="opx-expr">${it.expr}</span><input class="eval-cp-input" type="text" data-fa="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${_fmtNum(it.ansNum)}</div><div class="eval-item-feedback" id="evalFbFa${i}" aria-live="polite"></div>`;
    s4.appendChild(d);
  });
  out.appendChild(s4);

  const piItems = genPiramideItems();
  const s5 = document.createElement('div');
  s5.innerHTML = '<div class="eval-section-title">V. Pirámides numéricas <span class="eval-pts">10 pts · 5 pts c/u</span></div><p style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">Cada casilla es la SUMA de las dos casillas de abajo. Calcula el número de la cúspide (?).</p>';
  piItems.forEach((it, i) => {
    const d = document.createElement('div'); d.className = 'eval-item eval-auto-item';
    d.innerHTML = `<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">Pirámide ${i+1}:</span></div>${_piraHTML(it,false)}<div class="opx-row"><span class="opx-expr">La cúspide es:</span><input class="eval-cp-input" type="text" data-pi="${i}" autocomplete="off" inputmode="numeric"></div><div class="eval-answer">${_fmtNum(it.ansNum)} (fila del medio: ${it.m1} y ${it.m2})</div><div class="eval-item-feedback" id="evalFbPi${i}" aria-live="polite"></div>`;
    s5.appendChild(d);
  });
  out.appendChild(s5);

  window._evalOpData = { ubItems, prItems, caItems, faItems, piItems };
  const autoPanel = document.createElement('div'); autoPanel.id = 'evalOpAutoResult'; autoPanel.className = 'eval-auto-result';
  autoPanel.innerHTML = '<strong>🧮 Prueba interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato para resolver en papel.';
  out.appendChild(autoPanel);
  fin('s-evaluacion');
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
  let total = 0; const det = { ub: 0, pr: 0, ca: 0, fa: 0, pi: 0 };
  const _mark = (sel, it, i, key, ptsEach, fbId) => {
    const el = document.querySelector(`[data-${sel}="${i}"]`);
    const ok = _isIntMatch(el ? el.value : '', it.ansNum);
    if (el) { el.classList.toggle('eval-input-ok', ok); el.classList.toggle('eval-input-no', !ok); }
    if (ok) { det[key]++; total += ptsEach; }
    setEvalFeedback(fbId + i, ok, ok ? `Correcto. +${ptsEach} pts` : 'Revisar. R/ ' + _fmtNum(it.ansNum));
  };
  d.ubItems.forEach((it, i) => _mark('ub', it, i, 'ub', 10, 'evalFbUb'));
  d.prItems.forEach((it, i) => _mark('pr', it, i, 'pr', 4, 'evalFbPr'));
  d.caItems.forEach((it, i) => _mark('ca', it, i, 'ca', 2, 'evalFbCa'));
  d.faItems.forEach((it, i) => _mark('fa', it, i, 'fa', 2, 'evalFbFa'));
  d.piItems.forEach((it, i) => _mark('pi', it, i, 'pi', 5, 'evalFbPi'));
  const res = document.getElementById('evalOpAutoResult');
  if (res) { res.className = 'eval-auto-result ' + (total >= 70 ? 'eval-auto-pass' : 'eval-auto-risk'); res.innerHTML = `<strong>Resultado: ${total}/100 pts</strong><br><span>Ubica en la recta: ${det.ub*10}/50 · Problemas: ${det.pr*4}/20 · Cadena: ${det.ca*2}/10 · Escondido: ${det.fa*2}/10 · Pirámides: ${det.pi*5}/10</span>`; }
  if (total >= 70) { pts(8); showToast('🎯 Prueba operativa calificada: ' + total + '/100'); }
  else showToast('🧮 Prueba operativa: ' + total + '/100. Revisa los ítems marcados.');
}

function printEvalOp() {
  if (!window._evalOpData) { showToast('⚠️ Genera una prueba operativa primero'); return; }
  sfx('click');
  const forma = window._currentEvalOpForm || 1; const d = window._evalOpData;
  const _prRecta = (it) => {
    let cells = '';
    for (let t = 0; t <= 8; t++) {
      const lbl = t === 0 ? _fmtNum(it.start) : t === 8 ? _fmtNum(it.end) : '•';
      cells += `<div class="pr-tick"><div class="pr-arr">${t === it.k ? '▼' : '&nbsp;'}</div><div class="pr-lin"></div><div class="pr-tlbl">${lbl}</div></div>`;
    }
    return `<div class="pr-recta">${cells}</div>`;
  };
  let s1 = `<div class="sec-title"><span>I. Ubica el punto en la recta</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 50 pts</span></div></div><p class="opx-instr">Escribe el número que señala la flecha ▼. Fíjate en la escala. 10 pts c/u.</p>`;
  d.ubItems.forEach((it, i) => { s1 += `<div class="ub-row"><span class="qn">${i+1}.</span><span class="ub-esc">Escala de ${it.step}:</span>${_prRecta(it)}<span class="opx-blank"></span></div>`; });
  let s2 = `<div class="sec-title"><span>II. Problemas breves</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="opx-instr">Resuelve en el espacio y escribe la respuesta. 4 pts c/u.</p>`;
  d.prItems.forEach((it, i) => { s2 += `<div class="opx-print-row"><span class="qn">${i+1}.</span><span class="prb-text">${it.text}</span><span class="opx-blank"></span></div>`; });
  const caTbl = (items) => `<table class="rnd-tbl"><tr><th>#</th><th>Cadena de saltos</th><th>Llegas a</th></tr>${items.map((it, i) => `<tr><td>${i+1}</td><td>${it.text.replace(' ¿A qué número llegas?','')}</td><td></td></tr>`).join('')}</table>`;
  let s3 = `<div class="sec-title"><span>III. Cadena de saltos en la recta</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10 pts</span></div></div><p class="opx-instr">Avanzar es sumar; retroceder es restar. 2 pts c/u.</p>${caTbl(d.caItems)}`;
  const faTbl = (items) => `<table class="rnd-tbl"><tr><th>#</th><th>Operación</th><th>▢ =</th></tr>${items.map((it, i) => `<tr><td>${i+1}</td><td>${it.expr}</td><td></td></tr>`).join('')}</table>`;
  let s4 = `<div class="sec-title"><span>IV. ¿Qué número se esconde en ▢?</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10 pts</span></div></div><p class="opx-instr">Usa la operación inversa. 2 pts c/u.</p>${faTbl(d.faItems)}`;
  const piBox = (it, i) => `<div class="pp-box"><div class="pp-dir">${i+1}. Cúspide = suma de las dos de abajo:</div><div class="pp-row"><span class="pp-cell pp-empty">?</span></div><div class="pp-row"><span class="pp-cell pp-empty">&nbsp;</span><span class="pp-cell pp-empty">&nbsp;</span></div><div class="pp-row"><span class="pp-cell">${it.base[0]}</span><span class="pp-cell">${it.base[1]}</span><span class="pp-cell">${it.base[2]}</span></div></div>`;
  let s5 = `<div class="sec-title"><span>V. Pirámides numéricas</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 10 pts</span></div></div><p class="opx-instr">Cada casilla es la suma de las dos de abajo. 5 pts c/u.</p><div class="pp-grid">${d.piItems.map((it, i) => piBox(it, i)).join('')}</div>`;
  let pR = '';
  pR += `<div class="p-sec"><div class="p-ttl">I. Ubica en la recta</div><table class="p-tbl">${d.ubItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${_fmtNum(it.ansNum)}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">II. Problemas breves</div><table class="p-tbl">${d.prItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${_fmtNum(it.ansNum)}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">III. Cadena de saltos</div><table class="p-tbl">${d.caItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">${_fmtNum(it.ansNum)}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">IV. Número escondido</div><table class="p-tbl">${d.faItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">▢ = ${_fmtNum(it.ansNum)}</td></tr>`).join('')}</table></div>`;
  pR += `<div class="p-sec" style="grid-column:1/-1;"><div class="p-ttl">V. Pirámides numéricas</div><table class="p-tbl">${d.piItems.map((it, i) => `<tr><td class="pn">${i+1}.</td><td class="pa">Cúspide: ${_fmtNum(it.ansNum)} (fila del medio: ${it.m1} y ${it.m2})</td></tr>`).join('')}</table></div>`;
  const doc = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Prueba Operativa Recta Numérica · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11.5pt;color:#111;background:#fff;padding:4mm 6mm;}.ph{margin-bottom:0.5rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;color:#1565c0;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:10pt;text-align:center;color:#1565c0;margin-top:0.15rem;font-weight:700;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.45rem 0 0.2rem;border-left:4px solid #1565c0;background:#e3f2fd;display:flex;justify-content:space-between;align-items:center;color:#1565c0;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;color:#1565c0;font-weight:700;font-style:italic;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #1565c0;height:12px;}.qn{font-weight:700;min-width:20px;display:inline-block;color:#1565c0;flex-shrink:0;}.opx-instr{font-size:9pt;color:#555;margin-bottom:0.22rem;}.ub-row{display:flex;align-items:center;gap:0.5rem;padding:0.18rem 0.1rem;border-bottom:1px dotted #ddd;}.ub-esc{font-size:9pt;color:#555;white-space:nowrap;min-width:64px;}.pr-recta{display:flex;flex:1;max-width:95mm;align-items:flex-end;}.pr-tick{flex:1;text-align:center;position:relative;}.pr-arr{font-size:8pt;color:#1565c0;line-height:1;height:10px;}.pr-lin{border-bottom:2px solid #111;height:5px;position:relative;}.pr-lin::after{content:'';position:absolute;left:50%;bottom:-3px;width:1.5px;height:8px;background:#111;}.pr-tlbl{font-size:7.5pt;min-height:10px;}.opx-blank{display:inline-block;width:80px;flex:none;border-bottom:1.5px solid #111;min-height:13px;margin-left:0.3rem;}.opx-print-row{display:flex;align-items:baseline;gap:0.4rem;font-size:10pt;padding:0.24rem 0.1rem;border-bottom:1px dotted #ddd;}.prb-text{flex:1;line-height:1.35;}.rnd-tbl{width:100%;border-collapse:collapse;font-size:9.5pt;margin-top:0.15rem;}.rnd-tbl th,.rnd-tbl td{border:1px solid #bbb;padding:0.16rem 0.35rem;text-align:left;}.rnd-tbl th{background:#e3f2fd;color:#1565c0;font-size:8.5pt;}.pp-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.9rem;margin-top:0.2rem;}.pp-box{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.4rem;break-inside:avoid;text-align:center;}.pp-dir{font-size:8.5pt;font-weight:700;color:#1565c0;margin-bottom:0.2rem;text-align:left;}.pp-row{margin-bottom:2px;}.pp-cell{display:inline-block;min-width:34px;border:1.2px solid #111;border-radius:3px;padding:1px 6px;font-size:9.5pt;font-weight:700;margin:0 1px;}.pp-empty{border-style:dashed;color:#999;}.total-row{display:flex;align-items:baseline;justify-content:flex-end;gap:7px;font-size:11pt;color:#1565c0;font-weight:700;font-style:italic;margin-top:0.45rem;padding:0.2rem 0.5rem;background:#e3f2fd;border-radius:4px;}.total-row .obt-line{min-width:80px;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #1565c0;padding-bottom:0.3rem;margin-bottom:0.5rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;color:#1565c0;}.p-sub{font-size:9pt;color:#1565c0;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #cce0ff;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;color:#1565c0;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#1565c0;}.pa{color:#007a00;font-weight:700;font-family:'Courier New',monospace;}.forma-tag{position:fixed;bottom:5mm;right:6mm;font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;}@media print{@page{size:letter portrait;margin:8mm 10mm;}}</style></head><body><div class="ph"><h2>Examen de Matemáticas — Prueba Operativa · Recta Numérica, Suma y Resta · II Ciclo</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Institución:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 pts · I: 50 · II: 20 · III: 10 · IV: 10 · V: 10 · Forma ${forma}</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div><div class="pauta-wrap"><div class="p-head"><div class="p-main">✔ PAUTA — Prueba Operativa · Recta Numérica, Suma y Resta · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">100 pts · Matemáticas II Ciclo</div></div><div class="p-grid">${pR}</div></div><div class="forma-tag">Forma ${forma}</div></body></html>`;
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
  const msgs=['💡 ¡ÁNIMO! Comienza tu misión. ¡Cada paso cuenta!','🌱 ¡GRAN INICIO! Estás dando los primeros pasos.','📏 ¡BUEN TRABAJO! Vas progresando muy bien.','💪 ¡MUY BIEN! Dominas gran parte del contenido.','🏅 ¡INCREÍBLE avance! Estás cerca de la excelencia.','🎓 ¡EXTRAORDINARIO! Completaste TODA la misión. ¡Eres experto en la Recta Numérica!'];
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
  const txt=`${stars} CONSTANCIA DE LOGRO ${stars}\n\n📚 Misión: Recta Numérica, Suma y Resta\n👤 Estudiante: ${name}\n📊 Progreso: ${pct}% completado\n⭐ XP obtenido: ${xp} de ${MXP}${achText?'\n\n🏆 Logros desbloqueados:\n'+achText:''}\n\n${msg}\n\n📅 ${date}\n🏠 Proyecto Educativo M.E.T.A.S\n🌐 policastsapien.com`;
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
  _retoPairLbl();
  document.addEventListener('click',function(e){ const panel=document.getElementById('achPanel'); const btn=document.getElementById('achBtn'); if(panel.classList.contains('open')&&!panel.contains(e.target)&&e.target!==btn) panel.classList.remove('open'); });
  document.addEventListener('click',function(e){ if(e.target===document.getElementById('diplomaOverlay')) closeDiploma(); });
  const savedName=localStorage.getItem('nombreEstudianteRectaNumerica');
  const inputName=document.querySelector('.diploma-input');
  if(savedName&&inputName){ inputName.value=savedName; updateDiplomaName(savedName); }
  if(inputName) inputName.addEventListener('input',e=>localStorage.setItem('nombreEstudianteRectaNumerica',e.target.value));
  fin('s-aprende',false);
  fin('s-tipos',false);
  fin('s-errores',false);
});
