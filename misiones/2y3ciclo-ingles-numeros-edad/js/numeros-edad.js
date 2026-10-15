// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
function compartirMision(){const url=window.location.href;const texto=`🔢 *Misión Asignada: Numbers and My Age* 🔢\n\nAprende a contar del 1 al 20 y decir tu edad en inglés sin errores. 🏆\n\nDesbloquea *todos los logros* y registra tu avance para que tu maestro observe tus resultados. 📋\n\n_Aprende con pronunciación y retos interactivos en M.E.T.A.S._ 🗣️\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;_waShare(texto);}
function toggleLetra(){document.body.classList.toggle('letra-grande');if(typeof sfx==='function')sfx('click');localStorage.setItem('preferenciaLetra',document.body.classList.contains('letra-grande'));}
window.addEventListener('DOMContentLoaded',()=>{if(localStorage.getItem('preferenciaLetra')==='true')document.body.classList.add('letra-grande');});

// ===================== UTILIDADES =====================
const _pick=(arr,n)=>[...arr].sort(()=>Math.random()-0.5).slice(0,n);
const _shuffle=(arr)=>[...arr].sort(()=>Math.random()-0.5);
function fb(id,msg,isOk){const el=document.getElementById(id);if(el){el.textContent=msg;el.className='fb show '+(isOk?'ok':'err');}}

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY='ingles_numeros_edad_v1';
let xp=0,MXP=200,done=new Set(),evalAnsVisible=false;
let evalFormNum=1,unlockedAch=[],darkMode=false,prevLevel=0;
let evalCritFormNum=1,evalCritAnsVisible=false;
const TOTAL_SECTIONS=13;
const xpTracker={fc:new Set(),memo:new Set(),qz:new Set(),cls:new Set(),id:new Set(),cmp:new Set(),reto:new Set(),sopa:new Set(),wgt:new Set()};

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
  primer_quiz:{icon:'🔢',label:'Primer quiz de números superado'},
  flash_master:{icon:'🃏',label:'Todos los números del 1 al 20 explorados'},
  clasif_pro:{icon:'🗂️',label:'Experto clasificando números en inglés'},
  id_master:{icon:'🔍',label:'Identificador de números y edad maestro'},
  reto_hero:{icon:'🏆',label:'Héroe del reto Numbers & Age'},
  nivel3:{icon:'🧭',label:'¡Number Explorer! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡Confident Counter! Nivel 6'},
  widgets_master:{icon:'🧩',label:'Secuencias y edades dominadas'}
};
function unlockAchievement(id){if(unlockedAch.includes(id))return;unlockedAch.push(id);sfx('ach');showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label);launchConfetti();renderAchPanel();saveProgress();}
function renderAchPanel(){const list=document.getElementById('achList');list.innerHTML='';Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{const div=document.createElement('div');div.className='ach-item'+(unlockedAch.includes(id)?'':' locked');div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`;list.appendChild(div);});}
function toggleAchPanel(){sfx('click');document.getElementById('achPanel').classList.toggle('open');}
function showToast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}t.textContent=msg;t.style.display='block';clearTimeout(t._tid);t._tid=setTimeout(()=>t.style.display='none',3200);}
function launchConfetti(){const colors=['#be185d','#22d3ee','#c2410c','#fb923c','#06b6d4'];for(let i=0;i<60;i++){const c=document.createElement('div');c.className='confetti-piece';c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`;document.body.appendChild(c);c.addEventListener('animationend',()=>c.remove());}}

// ===================== XP =====================
const lvls=[{t:0,n:'Beginner 🌱'},{t:25,n:'First Numbers 🔢'},{t:55,n:'Number Explorer 🧭'},{t:90,n:'Good Listener 👂'},{t:130,n:'Age Expert 🎂'},{t:165,n:'Confident Counter 🗣️'},{t:190,n:'Numbers Master 🏆'}];
function pts(n){xp=Math.max(0,Math.min(MXP,xp+n));updateXPBar();saveProgress();}
function updateXPBar(){const pct=Math.round((xp/MXP)*100);document.getElementById('xpFill').style.width=pct+'%';const el=document.getElementById('xpPts');el.textContent='⭐ '+xp;el.style.transform='scale(1.3)';setTimeout(()=>el.style.transform='',300);let lv=0;for(let i=0;i<lvls.length;i++)if(xp>=lvls[i].t)lv=i;document.getElementById('xpLvl').textContent=lvls[lv].n;if(lv!==prevLevel){if(lv>=2)unlockAchievement('nivel3');if(lv>=5)unlockAchievement('nivel5');prevLevel=lv;}}
function resetXP(){sfx('click');xp=0;updateXPBar();showToast('🔄 XP reiniciado a 0');}
function fin(id,showFX=true){if(!done.has(id)){done.add(id);const b=document.querySelector(`[data-s="${id}"]`);if(b)b.classList.add('done');if(showFX){sfx('up');launchConfetti();}saveProgress();}}
function getProgress(){return Math.round((done.size/TOTAL_SECTIONS)*100);}

// ===================== NAV =====================
function go(id){sfx('click');document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});document.getElementById(id).classList.add('active');const btn=document.querySelector(`[data-s="${id}"]`);if(btn){btn.classList.add('active');btn.setAttribute('aria-selected','true');}window.scrollTo({top:0,behavior:'smooth'});if(id==='s-sopa'){setTimeout(buildSopa,50);}if(id==='s-widgets'){setTimeout(buildRoute,50);}}

// ===================== MINI-QUIZ (sección Estructura) =====================
function miniQ(btn,isOk,fbId){
  const p=btn.parentElement;
  if(p.dataset.answered)return;
  p.dataset.answered='true';
  const allBtns=p.querySelectorAll('button');
  allBtns.forEach(b=>{b.disabled=true;});
  if(isOk){
    btn.classList.add('cmp-opt-ok');
    fb(fbId,'¡Correcto! Excelente elección.',true);
    sfx('ok');
    pts(3);
  }else{
    btn.classList.add('cmp-opt-no');
    fb(fbId,'Revisa la regla: fíjate en la escritura y pronunciación.',false);
    sfx('no');
  }
}

// ===================== FLASHCARD DATA =====================
const fcData = [
  { w: 'One', pron: 'uan', t: 'Uno (1)', uso: 'Para contar una persona o cosa', cat: '1 a 10' },
  { w: 'Two', pron: 'tuu', t: 'Dos (2)', uso: 'Para contar dos cosas o personas', cat: '1 a 10' },
  { w: 'Three', pron: 'thrii', t: 'Tres (3)', uso: 'Pon la lengua entre los dientes. ¡No digas tree!', cat: '1 a 10' },
  { w: 'Four', pron: 'for', t: 'Cuatro (4)', uso: 'Número par después de tres', cat: '1 a 10' },
  { w: 'Five', pron: 'faiv', t: 'Cinco (5)', uso: 'Cinco dedos en una mano', cat: '1 a 10' },
  { w: 'Six', pron: 'siks', t: 'Seis (6)', uso: 'Número par después de cinco', cat: '1 a 10' },
  { w: 'Seven', pron: 'seven', t: 'Siete (7)', uso: 'Los siete días de la semana', cat: '1 a 10' },
  { w: 'Eight', pron: 'eit', t: 'Ocho (8)', uso: 'La g y la h son mudas', cat: '1 a 10' },
  { w: 'Nine', pron: 'nain', t: 'Nueve (9)', uso: 'Número impar antes de diez', cat: '1 a 10' },
  { w: 'Ten', pron: 'ten', t: 'Diez (10)', uso: 'Base para contar decenas', cat: '1 a 10' },
  { w: 'Eleven', pron: 'ileven', t: 'Once (11)', uso: 'Número irregular, no termina en -teen', cat: '11 y 12' },
  { w: 'Twelve', pron: 'tuelv', t: 'Doce (12)', uso: 'Una docena. Número irregular, no termina en -teen', cat: '11 y 12' },
  { w: 'Thirteen', pron: 'ther-tiin', t: 'Trece (13)', uso: 'Inicia la pandilla del -teen. Acentúa al final', cat: '13 a 20' },
  { w: 'How old are you?', pron: 'jau ould ar iu', t: '¿Cuántos años tienes?', uso: 'Para preguntar la edad. Se responde: I am ... years old', cat: 'Edad' }
];

let fcIdx=0,fcFlipped=false;
function renderFC(){
  const item=fcData[fcIdx];
  const card=document.getElementById('fcCard');
  if(!card)return;
  card.classList.remove('flipped');
  fcFlipped=false;
  document.getElementById('fcQ').textContent=item.w;
  document.getElementById('fcPron').textContent='/'+item.pron+'/';
  document.getElementById('fcTag').textContent=item.cat;
  document.getElementById('fcA').textContent=item.t;
  document.getElementById('fcExp').textContent=item.uso;
  document.getElementById('fcIdx').textContent=(fcIdx+1)+' / '+fcData.length;
}
function flipFC(){sfx('flip');const card=document.getElementById('fcCard');card.classList.toggle('flipped');fcFlipped=!fcFlipped;if(!xpTracker.fc.has(fcIdx)){xpTracker.fc.add(fcIdx);pts(1);if(xpTracker.fc.size===fcData.length){unlockAchievement('flash_master');fin('s-flash');}}}
function nextFC(){sfx('click');fcIdx=(fcIdx+1)%fcData.length;renderFC();}
function prevFC(){sfx('click');fcIdx=(fcIdx-1+fcData.length)%fcData.length;renderFC();}

// ===================== JUEGO: MEMORAMA DE NÚMEROS =====================
const memoPairs = [
  { a: '3', b: 'Three' },
  { a: '8', b: 'Eight' },
  { a: '11', b: 'Eleven' },
  { a: '12', b: 'Twelve' },
  { a: '13', b: 'Thirteen' },
  { a: '20', b: 'Twenty' }
];

let memoCards=[],memoFlippedCards=[],memoMatchedCount=0;
function buildMemo(){
  const grid=document.getElementById('memoGrid');
  if(!grid)return;
  grid.innerHTML='';
  memoFlippedCards=[];
  memoMatchedCount=0;
  memoCards=[];
  memoPairs.forEach((pair,idx)=>{
    memoCards.push({id:idx,text:pair.a,type:'num'});
    memoCards.push({id:idx,text:pair.b,type:'word'});
  });
  memoCards=_shuffle(memoCards);
  memoCards.forEach((c,idx)=>{
    const el=document.createElement('div');
    el.className='memo-card';
    el.dataset.idx=idx;
    el.dataset.pairId=c.id;
    el.dataset.type=c.type;
    el.innerHTML=`<div class="memo-inner"><div class="memo-front">?</div><div class="memo-back">${c.text}</div></div>`;
    el.onclick=()=>flipMemo(el,idx);
    grid.appendChild(el);
  });
}
function flipMemo(el,idx){
  if(el.classList.contains('flipped')||el.classList.contains('matched')||memoFlippedCards.length>=2)return;
  sfx('flip');
  el.classList.add('flipped');
  memoFlippedCards.push({el,card:memoCards[idx]});
  if(memoFlippedCards.length===2){
    const [c1,c2]=memoFlippedCards;
    if(c1.card.id===c2.card.id&&c1.card.type!==c2.card.type){
      setTimeout(()=>{
        c1.el.classList.add('matched');
        c2.el.classList.add('matched');
        memoFlippedCards=[];
        memoMatchedCount++;
        sfx('ok');
        pts(2);
        if(memoMatchedCount===memoPairs.length){
          sfx('fan');
          launchConfetti();
          showToast('🎉 ¡Memorama completado con éxito!');
        }
      },400);
    }else{
      setTimeout(()=>{
        sfx('no');
        c1.el.classList.remove('flipped');
        c2.el.classList.remove('flipped');
        memoFlippedCards=[];
      },900);
    }
  }
}
function resetMemo(){sfx('click');buildMemo();}

// ===================== QUIZ DATA =====================
const qzData = [
  { q: '¿Cómo se dice el número 3 en inglés con la pronunciación correcta?', o: ['Three', 'Tree', 'Tri', 'Free'], c: 0, exp: 'Se dice Three con sonido interdental sordo (lengua entre los dientes). Tree significa árbol.' },
  { q: '¿Cuál es la forma correcta de decir «tengo 12 años» en inglés?', o: ['I have 12 years', 'I am 12 years old', 'I has 12 years old', 'I am with 12 years'], c: 1, exp: 'En inglés la edad se expresa con el verbo to be: I am [edad] years old, nunca con have.' },
  { q: '¿Cuáles de estos números son irregulares y no terminan en -teen?', o: ['Thirteen y fourteen', 'Fifteen y sixteen', 'Eleven y twelve', 'Seventeen y eighteen'], c: 2, exp: 'Eleven (11) y twelve (12) son irregulares y tienen nombre propio sin la terminación -teen.' },
  { q: '¿Qué sufijo comparten los números del 13 al 19 en inglés?', o: ['-ty', '-th', '-ten', '-teen'], c: 3, exp: 'La pandilla del 13 al 19 termina en -teen: thirteen, fourteen, fifteen, sixteen...' },
  { q: 'Un amigo te pregunta: «How old are you?». ¿Qué te está preguntando?', o: ['¿Cuántos años tienes?', '¿Cómo te llamas?', '¿Dónde vives?', '¿Cómo estás?'], c: 0, exp: 'How old are you? significa ¿cuántos años tienes?.' },
  { q: '¿Cómo se escribe el número 15 en inglés?', o: ['Fiveteen', 'Fifteen', 'Fiveten', 'Fifty'], c: 1, exp: 'El 15 cambia la raíz de five a fif: se escribe fifteen.' },
  { q: '¿Cómo se escribe el número 20 en inglés?', o: ['Twenteen', 'Twoty', 'Twenty', 'Twelveteen'], c: 2, exp: 'El 20 se escribe twenty.' },
  { q: 'Si ves 4 cuadernos en la mesa, ¿cómo dices «hay cuatro cuadernos»?', o: ['There is four notebooks', 'There are tree notebooks', 'There have four notebooks', 'There are four notebooks'], c: 3, exp: 'Para plural se usa There are seguido del número: There are four notebooks.' },
  { q: '¿En qué sílaba se coloca la fuerza de voz en «thirteen» (13)?', o: ['En la primera sílaba (THIR-)', 'En la segunda sílaba (-TEEN)', 'Lleva acento en ambas', 'No lleva acento'], c: 1, exp: 'Los números con -teen llevan el acento al final: thir-TEEN, para diferenciarse de thirty (30).' }
];

let qzIdx=0,qzScore=0;
function renderQuiz(){
  const item=qzData[qzIdx];
  document.getElementById('qzQ').textContent=item.q;
  document.getElementById('qzProg').textContent='Pregunta '+(qzIdx+1)+' de '+qzData.length;
  const optsBox=document.getElementById('qzOpts');
  optsBox.innerHTML='';
  item.o.forEach((opt,idx)=>{
    const b=document.createElement('button');
    b.className='qz-opt';
    b.textContent=opt;
    b.onclick=()=>pickQuiz(idx);
    optsBox.appendChild(b);
  });
  document.getElementById('fbQuiz').className='fb';
  document.getElementById('fbQuiz').textContent='';
}
function pickQuiz(chosen){
  const item=qzData[qzIdx];
  const all=document.querySelectorAll('#qzOpts .qz-opt');
  all.forEach((b,idx)=>{
    b.disabled=true;
    if(idx===item.c)b.classList.add('ok');
    else if(idx===chosen)b.classList.add('no');
  });
  if(chosen===item.c){
    sfx('ok');
    fb('fbQuiz','¡Correcto! '+item.exp,true);
    if(!xpTracker.qz.has(qzIdx)){xpTracker.qz.add(qzIdx);pts(2);}
    qzScore++;
  }else{
    sfx('no');
    fb('fbQuiz','Incorrecto. '+item.exp,false);
  }
}
function nextQuiz(){
  sfx('click');
  if(qzIdx<qzData.length-1){
    qzIdx++;
    renderQuiz();
  }else{
    fin('s-quiz');
    unlockAchievement('primer_quiz');
    showToast('🏆 Quiz finalizado. Aciertos: '+qzScore+'/'+qzData.length);
  }
}
function resetQuiz(){sfx('click');qzIdx=0;qzScore=0;renderQuiz();}

// ===================== CLASIFICACIÓN =====================
const classGroups = [
  { id: 'g1', name: '1 al 5', items: ['One', 'Two', 'Three', 'Four', 'Five'] },
  { id: 'g2', name: '6 al 10', items: ['Six', 'Seven', 'Eight', 'Nine', 'Ten'] },
  { id: 'g3', name: '11 y 12 (Irregulares)', items: ['Eleven', 'Twelve'] },
  { id: 'g4', name: 'Pandilla -teen (13 al 19)', items: ['Thirteen', 'Fourteen', 'Fifteen', 'Sixteen'] }
];

let clsBankWords=[],clsSelectedWord=null;
function buildClass(){
  const bank=document.getElementById('clsBank');
  const colsBox=document.getElementById('clsCols');
  if(!bank||!colsBox)return;
  bank.innerHTML='';
  colsBox.innerHTML='';
  clsBankWords=[];
  classGroups.forEach(g=>{
    g.items.forEach(it=>{clsBankWords.push({word:it,groupId:g.id});});
  });
  clsBankWords=_shuffle(clsBankWords);
  clsBankWords.forEach(it=>{
    const sp=document.createElement('span');
    sp.className='cls-word';
    sp.textContent=it.word;
    sp.dataset.groupId=it.groupId;
    sp.onclick=()=>selectClsWord(sp);
    bank.appendChild(sp);
  });
  classGroups.forEach(g=>{
    const col=document.createElement('div');
    col.className='cls-col';
    col.dataset.groupId=g.id;
    col.innerHTML=`<div class="cls-col-t">${g.name}</div><div class="cls-drop" id="drop-${g.id}"></div>`;
    col.onclick=(e)=>{
      if(e.target.classList.contains('drop-item'))return;
      placeClsWord(col.dataset.groupId);
    };
    colsBox.appendChild(col);
  });
}
function selectClsWord(el){
  sfx('click');
  if(clsSelectedWord)clsSelectedWord.classList.remove('selected');
  clsSelectedWord=el;
  el.classList.add('selected');
}
function placeClsWord(groupId){
  if(!clsSelectedWord)return;
  sfx('click');
  const dropBox=document.getElementById('drop-'+groupId);
  const item=document.createElement('div');
  item.className='drop-item';
  item.textContent=clsSelectedWord.textContent;
  item.dataset.groupId=clsSelectedWord.dataset.groupId;
  const original=clsSelectedWord;
  item.onclick=(ev)=>{
    ev.stopPropagation();
    if(clsSelectedWord!==null){
      dropBox.parentElement.click();
    }else{
      document.getElementById('clsBank').appendChild(original);
      original.classList.remove('selected');
      item.remove();
      sfx('click');
    }
  };
  dropBox.appendChild(item);
  clsSelectedWord.remove();
  clsSelectedWord=null;
}
function checkClass(){
  let allCorrect=true,totalPlaced=0;
  classGroups.forEach(g=>{
    const dropBox=document.getElementById('drop-'+g.id);
    const items=dropBox.querySelectorAll('.drop-item');
    items.forEach(it=>{
      totalPlaced++;
      if(it.dataset.groupId===g.id){
        it.classList.add('ok');
        it.classList.remove('no');
      }else{
        it.classList.add('no');
        it.classList.remove('ok');
        allCorrect=false;
      }
    });
  });
  if(totalPlaced===clsBankWords.length&&allCorrect){
    sfx('fan');
    fb('fbClass','¡Excelente! Todos los números están en su grupo correspondiente.',true);
    pts(5);
    unlockAchievement('clasif_pro');
    fin('s-clasifica');
  }else if(allCorrect&&totalPlaced>0){
    sfx('ok');
    fb('fbClass','Vas muy bien. Sigue colocando los números pendientes.',true);
  }else{
    sfx('no');
    fb('fbClass','Hay números en el grupo equivocado. Los errados llevan ✗.',false);
  }
}
function resetClass(){sfx('click');buildClass();document.getElementById('fbClass').className='fb';document.getElementById('fbClass').textContent='';}

// ===================== IDENTIFICAR =====================
const idData = [
  { item: 'Number 3', o: ['Tree', 'Three', 'Free', 'Tri'], c: 1 },
  { item: 'Number 11', o: ['Eleven', 'Twelve', 'Oneteen', 'First'], c: 0 },
  { item: 'Number 12', o: ['Twenteen', 'Twelven', 'Twelve', 'Twoty'], c: 2 },
  { item: 'Number 13', o: ['Threeteen', 'Thirty', 'Trece', 'Thirteen'], c: 3 },
  { item: 'Decir edad: 10 años', o: ['I am 10 years old', 'I have 10 years', 'I has 10 years', 'My age have 10'], c: 0 },
  { item: 'Preguntar edad', o: ['How are you?', 'How old are you?', 'What is your age?', 'Who old are you?'], c: 1 },
  { item: 'Number 15', o: ['Fiveteen', 'Fiveten', 'Fifteen', 'Fifty'], c: 2 },
  { item: 'Number 20', o: ['Twelve', 'Twenteen', 'Ten-ten', 'Twenty'], c: 3 }
];

let idIdx=0;
function renderIdentify(){
  const cur=idData[idIdx];
  document.getElementById('idItemDisplay').textContent=cur.item;
  document.getElementById('idProg').textContent='Identifica '+(idIdx+1)+' de '+idData.length;
  const opts=document.getElementById('idOpts');
  opts.innerHTML='';
  cur.o.forEach((op,idx)=>{
    const b=document.createElement('button');
    b.className='qz-opt';
    b.textContent=op;
    b.onclick=()=>pickIdentify(idx);
    opts.appendChild(b);
  });
  document.getElementById('fbId').className='fb';
  document.getElementById('fbId').textContent='';
}
function pickIdentify(chosen){
  const cur=idData[idIdx];
  const all=document.querySelectorAll('#idOpts .qz-opt');
  all.forEach((b,idx)=>{
    b.disabled=true;
    if(idx===cur.c)b.classList.add('ok');
    else if(idx===chosen)b.classList.add('no');
  });
  if(chosen===cur.c){
    sfx('ok');
    fb('fbId','¡Identificación correcta! Buen oído y buena vista.',true);
    if(!xpTracker.id.has(idIdx)){xpTracker.id.add(idIdx);pts(2);}
  }else{
    sfx('no');
    fb('fbId','No es correcto. Recuerda la regla de escritura.',false);
  }
}
function nextIdentify(){
  sfx('click');
  if(idIdx<idData.length-1){
    idIdx++;
    renderIdentify();
  }else{
    fin('s-identifica');
    unlockAchievement('id_master');
    showToast('🎉 ¡Sección de identificación completada!');
  }
}
function resetIdentify(){sfx('click');idIdx=0;renderIdentify();}

// ===================== COMPLETA =====================
const cmpData = [
  { s: 'I ___ eleven years old.', o: ['am', 'have', 'has', 'is'], c: 0 },
  { s: 'How ___ are you?', o: ['name', 'old', 'many', 'years'], c: 1 },
  { s: 'There are ___ players in the team (13).', o: ['three', 'thirty', 'thirteen', 'tree'], c: 2 },
  { s: 'Number ___ comes after ten.', o: ['twelve', 'thirteen', 'nine', 'eleven'], c: 3 },
  { s: 'She ___ twelve years old.', o: ['is', 'has', 'am', 'are'], c: 0 },
  { s: 'Seven plus five equals ___.', o: ['eleven', 'twelve', 'thirteen', 'fourteen'], c: 1 },
  { s: 'I see ___ birds in the tree (3).', o: ['tree', 'free', 'three', 'tri'], c: 2 },
  { s: 'How ___ books do you have?', o: ['old', 'age', 'much', 'many'], c: 3 }
];

let cmpIdx=0;
function renderComplete(){
  const cur=cmpData[cmpIdx];
  document.getElementById('cmpSentence').textContent=cur.s;
  document.getElementById('cmpProg').textContent='Oración '+(cmpIdx+1)+' de '+cmpData.length;
  const opts=document.getElementById('cmpOpts');
  opts.innerHTML='';
  cur.o.forEach((op,idx)=>{
    const b=document.createElement('button');
    b.className='cmp-opt';
    b.textContent=op;
    b.onclick=()=>pickComplete(idx);
    opts.appendChild(b);
  });
  document.getElementById('fbCmp').className='fb';
  document.getElementById('fbCmp').textContent='';
}
function pickComplete(chosen){
  const cur=cmpData[cmpIdx];
  const all=document.querySelectorAll('#cmpOpts .cmp-opt');
  all.forEach((b,idx)=>{
    b.disabled=true;
    if(idx===cur.c)b.classList.add('cmp-opt-ok');
    else if(idx===chosen)b.classList.add('cmp-opt-no');
  });
  if(chosen===cur.c){
    sfx('ok');
    fb('fbCmp','¡Completado con éxito!',true);
    if(!xpTracker.cmp.has(cmpIdx)){xpTracker.cmp.add(cmpIdx);pts(2);}
  }else{
    sfx('no');
    fb('fbCmp','Incorrecto. Revisa el verbo o el número.',false);
  }
}
function nextComplete(){
  sfx('click');
  if(cmpIdx<cmpData.length-1){
    cmpIdx++;
    renderComplete();
  }else{
    fin('s-completa');
    showToast('🏆 ¡Completaste todas las oraciones!');
  }
}
function resetComplete(){sfx('click');cmpIdx=0;renderComplete();}

// ===================== WIDGETS =====================
const routeSets = [
  ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen'],
  ['one', 'two', 'three', 'four', 'five'],
  ['sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty']
];
let currentRouteIdx=0,currentRouteItems=[];
function buildRoute(){
  currentRouteItems=[...routeSets[currentRouteIdx]];
  currentRouteItems=_shuffle(currentRouteItems);
  renderRouteList();
}
function renderRouteList(){
  const list=document.getElementById('routeList');
  if(!list)return;
  list.innerHTML='';
  currentRouteItems.forEach((txt,idx)=>{
    const row=document.createElement('div');
    row.className='sort-item';
    row.innerHTML=`<span>${txt}</span><div><button class="btn btn-d" onclick="moveRoute(${idx},-1)">▲</button><button class="btn btn-d" onclick="moveRoute(${idx},1)">▼</button></div>`;
    list.appendChild(row);
  });
}
function moveRoute(idx,dir){
  const target=idx+dir;
  if(target<0||target>=currentRouteItems.length)return;
  sfx('click');
  const temp=currentRouteItems[idx];
  currentRouteItems[idx]=currentRouteItems[target];
  currentRouteItems[target]=temp;
  renderRouteList();
}
function checkRoute(){
  const expected=routeSets[currentRouteIdx];
  const isOk=currentRouteItems.every((it,idx)=>it===expected[idx]);
  if(isOk){
    sfx('ok');
    fb('fbRoute','¡Secuencia numérica ordenada a la perfección!',true);
    pts(3);
  }else{
    sfx('no');
    fb('fbRoute','Aún no están en orden. Revisa qué número va antes.',false);
  }
}
function nextRoute(){sfx('click');currentRouteIdx=(currentRouteIdx+1)%routeSets.length;buildRoute();document.getElementById('fbRoute').className='fb';document.getElementById('fbRoute').textContent='';}

// Widget 2: Situaciones
const neuronPartes = [
  { desc: 'Un compañero te pregunta: «How old are you?» y tienes 11 años. ¿Qué respondes?', o: ['I am 11 years old', 'I have 11 years', 'My age has 11', 'Eleven years have me'], c: 0 },
  { desc: 'En la mesa de control de un torneo preguntan cuántas pelotas necesitan: son 3. ¿Cómo lo dices?', o: ['We need tree balls', 'We need three balls', 'We have three years', 'Balls are tree'], c: 1 },
  { desc: 'Tu maestra pregunta cuántos días tiene una semana. ¿Qué número dices en inglés?', o: ['Six', 'Eight', 'Seven', 'Nine'], c: 2 },
  { desc: 'Ves a tu hermano menor de 5 años. ¿Cómo dices «él tiene cinco años»?', o: ['He has five years', 'He is five years old', 'He with five years', 'He have five'], c: 1 }
];
let currentNeuronIdx=0;
function renderNeuron(){
  const cur=neuronPartes[currentNeuronIdx];
  document.getElementById('neuronDesc').textContent=cur.desc;
  document.getElementById('neuronProg').textContent='Situación '+(currentNeuronIdx+1)+' de '+neuronPartes.length;
  const box=document.getElementById('neuronOpts');
  box.innerHTML='';
  cur.o.forEach((op,idx)=>{
    const b=document.createElement('button');
    b.className='cmp-opt';
    b.textContent=op;
    b.onclick=()=>pickNeuron(idx);
    box.appendChild(b);
  });
  document.getElementById('fbNeuron').className='fb';
  document.getElementById('fbNeuron').textContent='';
}
function pickNeuron(chosen){
  const cur=neuronPartes[currentNeuronIdx];
  const all=document.querySelectorAll('#neuronOpts .cmp-opt');
  all.forEach((b,idx)=>{
    b.disabled=true;
    if(idx===cur.c)b.classList.add('cmp-opt-ok');
    else if(idx===chosen)b.classList.add('cmp-opt-no');
  });
  if(chosen===cur.c){
    sfx('ok');
    fb('fbNeuron','¡Respuesta adecuada a la situación!',true);
    pts(2);
  }else{
    sfx('no');
    fb('fbNeuron','Cuidado: recuerda usar «I am» y pronunciar «three».',false);
  }
}
function nextNeuron(){sfx('click');currentNeuronIdx=(currentNeuronIdx+1)%neuronPartes.length;renderNeuron();}
function resetNeuron(){sfx('click');currentNeuronIdx=0;renderNeuron();}

// Widget 3: Empareja Cifra y Palabra
const neuroPairs = [
  { item: '12', o: ['Twelve', 'Eleven', 'Twenty', 'Thirteen'], c: 0 },
  { item: '15', o: ['Fiveteen', 'Fifteen', 'Fifty', 'Five'], c: 1 },
  { item: '8', o: ['Seven', 'Nine', 'Eight', 'Ten'], c: 2 },
  { item: '13', o: ['Three', 'Thirty', 'Tree', 'Thirteen'], c: 3 },
  { item: '20', o: ['Twenty', 'Twelve', 'Two', 'Twenteen'], c: 0 }
];
let neuroIdx=0;
function renderNeuro(){
  const cur=neuroPairs[neuroIdx];
  document.getElementById('neuroTrans').textContent='Número: '+cur.item;
  document.getElementById('neuroProg').textContent=(neuroIdx+1)+' de '+neuroPairs.length;
  const box=document.getElementById('neuroOpts');
  box.innerHTML='';
  cur.o.forEach((op,idx)=>{
    const b=document.createElement('button');
    b.className='qz-opt';
    b.textContent=op;
    b.onclick=()=>pickNeuro(idx);
    box.appendChild(b);
  });
  document.getElementById('fbNeuro').className='fb';
  document.getElementById('fbNeuro').textContent='';
}
function pickNeuro(chosen){
  const cur=neuroPairs[neuroIdx];
  const all=document.querySelectorAll('#neuroOpts .qz-opt');
  all.forEach((b,idx)=>{
    b.disabled=true;
    if(idx===cur.c)b.classList.add('ok');
    else if(idx===chosen)b.classList.add('no');
  });
  if(chosen===cur.c){
    sfx('ok');
    fb('fbNeuro','¡Emparejado con precisión!',true);
    pts(2);
  }else{
    sfx('no');
    fb('fbNeuro','Revisa cómo se escribe la cifra en inglés.',false);
  }
  setTimeout(()=>{
    if(neuroIdx<neuroPairs.length-1){
      neuroIdx++;
      renderNeuro();
    }
  },1000);
}
function resetNeuro(){sfx('click');neuroIdx=0;renderNeuro();}

// Widget 4: Detector de Errores
const detectorData = [
  { expr: 'I have 12 years old.', o: ['Correcto', 'Incorrecto: se dice I am 12 years old'], c: 1 },
  { expr: 'There are three dogs in the park.', o: ['Correcto', 'Incorrecto: debe decir tree'], c: 0 },
  { expr: 'My sister is eleven years old.', o: ['Correcto', 'Incorrecto: se usa has'], c: 0 },
  { expr: 'I see tree apples on the table.', o: ['Correcto', 'Incorrecto: tree es árbol, debe decir three'], c: 1 }
];
let detectorIdx=0;
function renderDetector(){
  const cur=detectorData[detectorIdx];
  document.getElementById('enferDisease').textContent=cur.expr;
  document.getElementById('enferProg').textContent=(detectorIdx+1)+' de '+detectorData.length;
  const box=document.getElementById('enferOpts');
  box.innerHTML='';
  cur.o.forEach((op,idx)=>{
    const b=document.createElement('button');
    b.className='qz-opt';
    b.textContent=op;
    b.onclick=()=>pickDetector(idx);
    box.appendChild(b);
  });
  document.getElementById('fbEnfer').className='fb';
  document.getElementById('fbEnfer').textContent='';
}
function pickDetector(chosen){
  const cur=detectorData[detectorIdx];
  const all=document.querySelectorAll('#enferOpts .qz-opt');
  all.forEach((b,idx)=>{
    b.disabled=true;
    if(idx===cur.c)b.classList.add('ok');
    else if(idx===chosen)b.classList.add('no');
  });
  if(chosen===cur.c){
    sfx('ok');
    fb('fbEnfer','¡Buen ojo! Detectaste la regla a la perfección.',true);
    pts(2);
  }else{
    sfx('no');
    fb('fbEnfer','Recuerda: la edad no se tiene (have), se es (am/is).',false);
  }
  setTimeout(()=>{
    if(detectorIdx<detectorData.length-1){
      detectorIdx++;
      renderDetector();
    }else{
      unlockAchievement('widgets_master');
      fin('s-widgets');
    }
  },1200);
}
function resetEnfer(){sfx('click');detectorIdx=0;renderDetector();}

// ===================== RETO FINAL =====================
const retoPairs = [
  { p1: { q: '5 + 7 = ?', a: 'Twelve', o: ['Twelve', 'Eleven', 'Thirteen', 'Twenty'] }, p2: { q: '9 + 4 = ?', a: 'Thirteen', o: ['Thirteen', 'Thirty', 'Twelve', 'Three'] } },
  { p1: { q: '20 - 9 = ?', a: 'Eleven', o: ['Eleven', 'Twelve', 'Ten', 'Nine'] }, p2: { q: '6 + 9 = ?', a: 'Fifteen', o: ['Fifteen', 'Fourteen', 'Sixteen', 'Fiveteen'] } },
  { p1: { q: '10 + 10 = ?', a: 'Twenty', o: ['Twenty', 'Twenteen', 'Twelve', 'Two'] }, p2: { q: '8 - 5 = ?', a: 'Three', o: ['Three', 'Tree', 'Thirteen', 'Free'] } }
];
let retoCur=0,retoScore=0;
function changeRetoPair(){
  sfx('click');
  retoCur=(retoCur+1)%retoPairs.length;
  document.getElementById('retoPairLbl').textContent='Reto '+(retoCur+1)+' de '+retoPairs.length;
  renderReto();
}
function renderReto(){
  const pair=retoPairs[retoCur];
  const box1=document.getElementById('retoP1');
  const box2=document.getElementById('retoP2');
  if(!box1||!box2)return;
  box1.innerHTML=`<h4>Cálculo A</h4><div style="font-size:1.4rem;font-weight:900;margin:0.5rem 0;">${pair.p1.q}</div><div class="cmp-opts">${pair.p1.o.map((o,i)=>`<button class="cmp-opt" onclick="checkRetoAnswer(1,'${o}')">${o}</button>`).join('')}</div>`;
  box2.innerHTML=`<h4>Cálculo B</h4><div style="font-size:1.4rem;font-weight:900;margin:0.5rem 0;">${pair.p2.q}</div><div class="cmp-opts">${pair.p2.o.map((o,i)=>`<button class="cmp-opt" onclick="checkRetoAnswer(2,'${o}')">${o}</button>`).join('')}</div>`;
  document.getElementById('fbReto').className='fb';
  document.getElementById('fbReto').textContent='';
}
function checkRetoAnswer(part,ans){
  const pair=retoPairs[retoCur];
  const target=part===1?pair.p1:pair.p2;
  if(ans===target.a){
    sfx('ok');
    fb('fbReto','¡Acierto en Cálculo '+(part===1?'A':'B')+'!',true);
    pts(3);
    retoScore++;
    if(retoScore>=2){
      unlockAchievement('reto_hero');
      fin('s-reto');
    }
  }else{
    sfx('no');
    fb('fbReto','Cálculo incorrecto. Intenta otra opción.',false);
  }
}

// ===================== TASK GENERATOR =====================
const taskGenerators = {
  numToWord: ()=>{
    const nums=[[1,'one'],[2,'two'],[3,'three'],[4,'four'],[5,'five'],[6,'six'],[7,'seven'],[8,'eight'],[9,'nine'],[10,'ten'],[11,'eleven'],[12,'twelve'],[13,'thirteen'],[14,'fourteen'],[15,'fifteen'],[16,'sixteen'],[17,'seventeen'],[18,'eighteen'],[19,'nineteen'],[20,'twenty']];
    const pick=nums[Math.floor(Math.random()*nums.length)];
    return { q: 'Escribe en inglés el número: '+pick[0], a: pick[1] };
  },
  ageSentence: ()=>{
    const ages=[10,11,12,13,14,15];
    const age=ages[Math.floor(Math.random()*ages.length)];
    return { q: 'Completa en inglés: «Tengo '+age+' años» → I ___ '+age+' years old.', a: 'am' };
  },
  mathInEnglish: ()=>{
    const a=Math.floor(Math.random()*9)+1;
    const b=Math.floor(Math.random()*9)+1;
    const sum=a+b;
    return { q: '¿Cuánto es '+a+' + '+b+' en inglés?', a: String(sum) };
  }
};
function genTask(tipo){
  sfx('click');
  const task=taskGenerators[tipo]();
  document.getElementById('taskQ').textContent=task.q;
  document.getElementById('taskA').textContent='Respuesta: '+task.a;
  document.getElementById('taskA').style.display='none';
  document.getElementById('taskShowBtn').style.display='inline-block';
}
function showTaskAnswer(){
  sfx('click');
  document.getElementById('taskA').style.display='block';
  document.getElementById('taskShowBtn').style.display='none';
}

// ===================== SOPA DE LETRAS =====================
const sopaSets = [
  {
    size: 10,
    grid: [
      ["E","A","Z","E","A","R","Z","T","J","C"],
      ["P","J","A","I","Q","P","B","I","P","H"],
      ["P","Z","V","G","V","T","K","Y","W","L"],
      ["Q","W","W","H","C","Y","L","V","G","F"],
      ["M","A","E","T","D","N","R","A","O","T"],
      ["Q","Y","N","W","N","P","T","U","H","R"],
      ["F","P","Z","E","E","E","R","R","L","R"],
      ["J","D","S","L","N","Y","E","T","W","U"],
      ["P","D","T","V","S","E","V","E","N","E"],
      ["E","O","B","E","R","H","Y","Z","Y","K"]
    ],
    words: [
      { w: "THREE", cells: [[4,9],[5,8],[6,7],[7,6],[8,5]] },
      { w: "TWELVE", cells: [[4,3],[5,3],[6,3],[7,3],[8,3],[9,3]] },
      { w: "SEVEN", cells: [[8,4],[8,5],[8,6],[8,7],[8,8]] },
      { w: "EIGHT", cells: [[0,3],[1,3],[2,3],[3,3],[4,3]] },
      { w: "FOUR", cells: [[3,9],[4,8],[5,7],[6,6]] },
      { w: "TEN", cells: [[5,6],[6,5],[7,4]] }
    ]
  },
  {
    size: 10,
    grid: [
      ["Z","R","A","A","C","B","R","F","B","X"],
      ["K","N","U","Z","D","Z","N","H","N","A"],
      ["X","O","J","E","U","R","J","G","E","Z"],
      ["D","I","D","E","N","D","U","R","E","C"],
      ["F","M","N","C","A","O","M","F","T","D"],
      ["K","I","Y","U","L","K","R","I","R","K"],
      ["N","S","O","J","S","F","R","V","I","Q"],
      ["T","E","L","E","V","E","N","E","H","X"],
      ["U","U","B","F","H","S","M","I","T","B"],
      ["T","W","E","N","T","Y","N","F","G","P"]
    ],
    words: [
      { w: "THIRTEEN", cells: [[8,8],[7,8],[6,8],[5,8],[4,8],[3,8],[2,8],[1,8]] },
      { w: "ELEVEN", cells: [[7,1],[7,2],[7,3],[7,4],[7,5],[7,6]] },
      { w: "TWENTY", cells: [[9,0],[9,1],[9,2],[9,3],[9,4],[9,5]] },
      { w: "NINE", cells: [[6,0],[5,1],[4,2],[3,3]] },
      { w: "FIVE", cells: [[4,7],[5,7],[6,7],[7,7]] },
      { w: "ONE", cells: [[4,5],[3,4],[2,3]] }
    ]
  }
];

let currentSopaSetIdx=0,sopaFoundWords=new Set();
let sopaFirstClickCell=null,sopaPointerStartCell=null,sopaPointerMoved=false,sopaSelectedCells=[];
function getSopaCellSize(){const avail=Math.min(window.innerWidth-40,420);const set=sopaSets[currentSopaSetIdx];return Math.max(22,Math.min(34,Math.floor(avail/set.size)));}
function buildSopa(){
  const set=sopaSets[currentSopaSetIdx];
  const grid=document.getElementById('sopaGrid');
  if(!grid)return;
  grid.innerHTML='';
  const sz=getSopaCellSize();
  grid.style.gridTemplateColumns=`repeat(${set.size},${sz}px)`;
  grid.style.gridTemplateRows=`repeat(${set.size},${sz}px)`;
  sopaFirstClickCell=null;
  sopaSelectedCells=[];
  for(let r=0;r<set.size;r++)for(let c=0;c<set.size;c++){
    const cell=document.createElement('div');
    cell.className='sopa-cell';
    cell.style.width=sz+'px';
    cell.style.height=sz+'px';
    cell.style.fontSize=Math.max(11,sz-10)+'px';
    cell.textContent=set.grid[r][c];
    cell.dataset.row=r;
    cell.dataset.col=c;
    const alreadyFound=set.words.find(w=>sopaFoundWords.has(w.w)&&w.cells.some(([wr,wc])=>wr===r&&wc===c));
    if(alreadyFound)cell.classList.add('sopa-found');
    grid.appendChild(cell);
  }
  setupSopaEvents();
  const wl=document.getElementById('sopaWords');
  wl.innerHTML='';
  set.words.forEach(wObj=>{
    const sp=document.createElement('span');
    sp.className='sopa-w'+(sopaFoundWords.has(wObj.w)?' found':'');
    sp.id='sw-'+wObj.w;
    sp.textContent=wObj.w;
    wl.appendChild(sp);
  });
}
function setupSopaEvents(){
  const grid=document.getElementById('sopaGrid');
  grid.onpointerdown=e=>{
    const cell=e.target.closest('.sopa-cell');
    if(!cell)return;
    e.preventDefault();
    grid.setPointerCapture(e.pointerId);
    sopaPointerStartCell=cell;
    sopaPointerMoved=false;
    cell.classList.add('sopa-sel');
    sopaSelectedCells=[cell];
  };
  grid.onpointermove=e=>{
    if(!sopaPointerStartCell)return;
    e.preventDefault();
    const el=document.elementFromPoint(e.clientX,e.clientY);
    const cell=el?el.closest('.sopa-cell'):null;
    if(!cell)return;
    const sr=parseInt(sopaPointerStartCell.dataset.row),sc=parseInt(sopaPointerStartCell.dataset.col);
    const er=parseInt(cell.dataset.row),ec=parseInt(cell.dataset.col);
    if(sr!==er||sc!==ec)sopaPointerMoved=true;
    document.querySelectorAll('.sopa-cell.sopa-sel').forEach(c=>c.classList.remove('sopa-sel'));
    sopaSelectedCells=[];
    getSopaPath(sr,sc,er,ec).forEach(([r,c])=>{
      const pc=document.querySelector(`#sopaGrid [data-row="${r}"][data-col="${c}"]`);
      if(pc){pc.classList.add('sopa-sel');sopaSelectedCells.push(pc);}
    });
  };
  grid.onpointerup=e=>{
    if(!sopaPointerStartCell)return;
    e.preventDefault();
    grid.releasePointerCapture(e.pointerId);
    if(sopaPointerMoved&&sopaSelectedCells.length>1){
      checkSopaSelection();
    }else{
      const cell=sopaPointerStartCell;
      document.querySelectorAll('.sopa-cell.sopa-sel').forEach(c=>c.classList.remove('sopa-sel'));
      sopaSelectedCells=[];
      if(!sopaFirstClickCell){
        sopaFirstClickCell=cell;
        cell.classList.add('sopa-start');
      }else if(sopaFirstClickCell===cell){
        cell.classList.remove('sopa-start');
        sopaFirstClickCell=null;
      }else{
        const sr=parseInt(sopaFirstClickCell.dataset.row),sc=parseInt(sopaFirstClickCell.dataset.col);
        const er=parseInt(cell.dataset.row),ec=parseInt(cell.dataset.col);
        sopaFirstClickCell.classList.remove('sopa-start');
        sopaFirstClickCell=null;
        getSopaPath(sr,sc,er,ec).forEach(([r,c])=>{
          const pc=document.querySelector(`#sopaGrid [data-row="${r}"][data-col="${c}"]`);
          if(pc){pc.classList.add('sopa-sel');sopaSelectedCells.push(pc);}
        });
        checkSopaSelection();
      }
    }
    sopaPointerStartCell=null;
    sopaPointerMoved=false;
  };
}
function getSopaPath(r1,c1,r2,c2){
  const dr=Math.sign(r2-r1),dc=Math.sign(c2-c1);
  const lr=Math.abs(r2-r1),lc=Math.abs(c2-c1);
  if(lr!==0&&lc!==0&&lr!==lc)return[[r1,c1]];
  const len=Math.max(lr,lc);
  const path=[];
  for(let i=0;i<=len;i++)path.push([r1+dr*i,c1+dc*i]);
  return path;
}
function checkSopaSelection(){
  const set=sopaSets[currentSopaSetIdx];
  const word=sopaSelectedCells.map(c=>c.textContent).join('');
  const wordRev=word.split('').reverse().join('');
  const found=set.words.find(wObj=>!sopaFoundWords.has(wObj.w)&&(wObj.w===word||wObj.w===wordRev));
  if(found){
    sopaFoundWords.add(found.w);
    found.cells.forEach(([r,c])=>{
      const cell=document.querySelector(`#sopaGrid [data-row="${r}"][data-col="${c}"]`);
      if(cell){cell.classList.remove('sopa-sel','sopa-start');cell.classList.add('sopa-found');}
    });
    const sp=document.getElementById('sw-'+found.w);
    if(sp)sp.classList.add('found');
    if(!xpTracker.sopa.has(found.w)){xpTracker.sopa.add(found.w);pts(1);}
    sfx('ok');
    if(sopaFoundWords.size===set.words.length){
      fin('s-sopa');
      sfx('fan');
      showToast('🎉 ¡Todas las palabras encontradas!');
    }else showToast('✨ ¡Encontraste: '+found.w+'!');
  }else sfx('no');
  document.querySelectorAll('.sopa-cell.sopa-sel').forEach(c=>c.classList.remove('sopa-sel'));
  sopaSelectedCells=[];
}
function nextSopaSet(){sfx('click');sopaFoundWords=new Set();currentSopaSetIdx=(currentSopaSetIdx+1)%sopaSets.length;buildSopa();showToast('🔄 Nueva sopa cargada');}
function sopaLinterna(){
  sfx('click');
  if(xp<2){showToast('⚠️ Necesitas al menos 2 XP para usar la linterna.');return;}
  const set=sopaSets[currentSopaSetIdx];
  const pend=set.words.filter(wObj=>!sopaFoundWords.has(wObj.w));
  if(pend.length===0){showToast('🎉 ¡Ya encontraste todas las palabras!');return;}
  pts(-2);
  const cells=[];
  pend.forEach(wObj=>wObj.cells.forEach(([r,c])=>{
    const el=document.querySelector(`#sopaGrid [data-row="${r}"][data-col="${c}"]`);
    if(el){el.classList.add('sopa-peek');cells.push(el);}
  }));
  setTimeout(()=>{cells.forEach(el=>el.classList.remove('sopa-peek'));},3000);
}

// ===================== BANCOS DE EVALUACIÓN DETERMINISTA =====================
const evalTFBank = [
  { q: 'En inglés la edad se dice con «I am» y no con «I have».', a: true, exp: 'Correcto: se usa el verbo to be (I am 11 years old).', k: 'edad_verbo' },
  { q: 'La palabra «tree» significa el número 3 en inglés.', a: false, exp: 'Falso: tree es árbol; el número 3 se escribe three.', k: 'three_tree' },
  { q: 'Los números eleven (11) y twelve (12) terminan en -teen.', a: false, exp: 'Falso: son irregulares y tienen nombre propio.', k: 'eleven_twelve' },
  { q: 'Los números del 13 al 19 llevan la terminación -teen.', a: true, exp: 'Correcto: thirteen, fourteen, fifteen, etc.', k: 'sufijo_teen' },
  { q: 'Al decir «three», la lengua se coloca entre los dientes para el sonido th.', a: true, exp: 'Correcto: es el sonido interdental sordo /θ/.', k: 'pron_th' },
  { q: '«How old are you?» sirve para preguntar el nombre.', a: false, exp: 'Falso: pregunta la edad; para el nombre se usa What is your name?.', k: 'how_old' },
  { q: 'El número 15 se escribe «fiveteen».', a: false, exp: 'Falso: cambia la raíz a fif-, se escribe fifteen.', k: 'fifteen_ort' },
  { q: 'El número 20 en inglés se escribe «twenty».', a: true, exp: 'Correcto: twenty es 20.', k: 'twenty_ort' },
  { q: 'En «thirteen», el acento va en la sílaba final (-teen).', a: true, exp: 'Correcto: thir-TEEN lleva el acento al final.', k: 'acento_teen' },
  { q: 'La expresión «There are» se usa para decir que hay una sola cosa.', a: false, exp: 'Falso: There are es para plural (dos o más).', k: 'there_are' },
  { q: 'Decir «I am 10 years old» significa «tengo 10 años».', a: true, exp: 'Correcto: es la fórmula estándar de la edad.', k: 'i_am_age' },
  { q: 'El número 8 se escribe «eight» con g y h mudas.', a: true, exp: 'Correcto: se escribe eight y se pronuncia /eit/.', k: 'eight_ort' },
  { q: '«One, two, three» son números pares todos.', a: false, exp: 'Falso: one y three son impares.', k: 'par_impar' },
  { q: 'La pregunta «How many?» significa «¿cuántos?».', a: true, exp: 'Correcto: se usa para preguntar cantidades contables.', k: 'how_many' },
  { q: 'A la pregunta «How old are you?» se puede responder simplemente «I am twelve».', a: true, exp: 'Correcto: ambas formas son válidas (con o sin years old).', k: 'respuesta_corta' }
];

const evalMCBank = [
  { q: '¿Cómo se dice el número 3 en inglés?', o: ['a) Three', 'b) Tree', 'c) Tri', 'd) Free'], a: 0, exp: 'Three lleva th.', k: 'num_3' },
  { q: '¿Cómo se responde a «How old are you?» si tienes 12 años?', o: ['a) I have 12 years', 'b) I am 12 years old', 'c) I has 12 years', 'd) My age is 12 years'], a: 1, exp: 'Se usa I am.', k: 'ans_age' },
  { q: '¿Cuál número es irregular y no termina en -teen?', o: ['a) Fourteen', 'b) Sixteen', 'c) Twelve', 'd) Eighteen'], a: 2, exp: 'Twelve es irregular.', k: 'irr_12' },
  { q: '¿Cómo se escribe el número 15 en inglés?', o: ['a) Fiveteen', 'b) Fiveten', 'c) Fifty', 'd) Fifteen'], a: 3, exp: 'Fifteen es la forma correcta.', k: 'num_15' },
  { q: '¿Qué significa la pregunta «How old are you?»?', o: ['a) ¿Cuántos años tienes?', 'b) ¿Cómo te llamas?', 'c) ¿Dónde vives?', 'd) ¿Qué hora es?'], a: 0, exp: 'Pregunta por la edad.', k: 'meaning_how_old' },
  { q: '¿Cómo se escribe 20 en inglés?', o: ['a) Twenteen', 'b) Twenty', 'c) Twelveteen', 'd) Two-ten'], a: 1, exp: 'Twenty es 20.', k: 'num_20' },
  { q: '¿Cuál de estas frases es gramaticalmente correcta en inglés?', o: ['a) He have ten years', 'b) She has tree cats', 'c) She is eleven years old', 'd) I has twelve years'], a: 2, exp: 'She is eleven years old es la única correcta.', k: 'gram_correct' },
  { q: '¿Cómo se pronuncia la palabra «three»?', o: ['a) Igual que tree (árbol)', 'b) Con s suave', 'c) Como la f en free', 'd) Con la lengua entre los dientes (/θ/)'], a: 3, exp: 'Sonido interdental sordo /θ/.', k: 'pron_three' },
  { q: '¿Cuántos jugadores hay en la cancha si contamos «eleven»?', o: ['a) 11 jugadores', 'b) 12 jugadores', 'c) 10 jugadores', 'd) 13 jugadores'], a: 0, exp: 'Eleven es 11.', k: 'meaning_eleven' },
  { q: '¿Cuál es la suma de «seven plus six»?', o: ['a) Twelve', 'b) Thirteen', 'c) Fourteen', 'd) Eleven'], a: 1, exp: '7 + 6 = 13 (thirteen).', k: 'math_13' },
  { q: '¿Qué palabra completa la frase: «I see ___ apples in the basket» (4)?', o: ['a) for', 'b) fourteen', 'c) four', 'd) fourth'], a: 2, exp: 'Four es cuatro.', k: 'num_4' },
  { q: '¿Por qué no se debe decir «I have 11 years» en inglés?', o: ['a) Porque falta la s', 'b) Porque falta la palabra old', 'c) Porque es una regla solo para niños', 'd) Porque en inglés la edad se es, no se tiene'], a: 3, exp: 'La edad se concibe como un estado del ser.', k: 'rule_age_be' },
  { q: '¿Cómo se escribe el número 8 en inglés?', o: ['a) Eight', 'b) Eigth', 'c) Aight', 'd) Eigt'], a: 0, exp: 'Se escribe eight.', k: 'num_8' },
  { q: '¿Qué número sigue en la serie: ten, eleven, twelve, ___?', o: ['a) Fourteen', 'b) Thirteen', 'c) Fifteen', 'd) Twenty'], a: 1, exp: 'Sigue thirteen (13).', k: 'series_13' },
  { q: 'Si una persona dice «I am fourteen», ¿cuántos años tiene?', o: ['a) 4 años', 'b) 40 años', 'c) 14 años', 'd) 24 años'], a: 2, exp: 'Fourteen es 14.', k: 'meaning_14' }
];

const evalCPBank = [
  { q: 'En inglés, la edad se expresa con el verbo «to ___» (am/is/are).', a: 'be', acc: ['be', 'to be', 'BE'], k: 'cp_verbo' },
  { q: 'El número 3 en inglés se escribe ___.', a: 'three', acc: ['three', 'THREE'], k: 'cp_three' },
  { q: 'El número 11 en inglés se escribe ___.', a: 'eleven', acc: ['eleven', 'ELEVEN'], k: 'cp_eleven' },
  { q: 'El número 12 en inglés se escribe ___.', a: 'twelve', acc: ['twelve', 'TWELVE'], k: 'cp_twelve' },
  { q: 'Los números del 13 al 19 llevan el sufijo ___.', a: '-teen', acc: ['-teen', 'teen', 'TEEN'], k: 'cp_teen' },
  { q: 'Para preguntar la edad decimos: «How ___ are you?».', a: 'old', acc: ['old', 'OLD'], k: 'cp_how_old' },
  { q: 'Para decir «tengo 10 años» escribo: «I ___ 10 years old».', a: 'am', acc: ['am', 'AM', "'m"], k: 'cp_i_am' },
  { q: 'El número 20 en inglés se escribe ___.', a: 'twenty', acc: ['twenty', 'TWENTY'], k: 'cp_twenty' },
  { q: 'El número 15 en inglés se escribe ___.', a: 'fifteen', acc: ['fifteen', 'FIFTEEN'], k: 'cp_fifteen' },
  { q: 'Para decir «hay» en plural usamos «There ___».', a: 'are', acc: ['are', 'ARE'], k: 'cp_there_are' },
  { q: 'El número 8 en inglés se escribe ___.', a: 'eight', acc: ['eight', 'EIGHT'], k: 'cp_eight' },
  { q: 'La palabra inglesa «tree» en español significa ___.', a: 'arbol', acc: ['arbol', 'árbol'], k: 'cp_tree_trans' },
  { q: 'El número 13 en inglés se escribe ___.', a: 'thirteen', acc: ['thirteen', 'THIRTEEN'], k: 'cp_thirteen' },
  { q: 'En la frase «I am twelve years old», la palabra «old» significa literalmente ___.', a: 'viejo', acc: ['viejo', 'de edad', 'edad'], k: 'cp_old_meaning' },
  { q: 'Cinco más cinco en inglés da como resultado ___.', a: 'ten', acc: ['ten', 'TEN'], k: 'cp_ten' }
];

const evalPRBank = [
  { term: 'One', def: '1 (Uno)', k: 'pr_1' },
  { term: 'Two', def: '2 (Dos)', k: 'pr_2' },
  { term: 'Three', def: '3 (Tres)', k: 'pr_3' },
  { term: 'Four', def: '4 (Cuatro)', k: 'pr_4' },
  { term: 'Five', def: '5 (Cinco)', k: 'pr_5' },
  { term: 'Six', def: '6 (Seis)', k: 'pr_6' },
  { term: 'Seven', def: '7 (Siete)', k: 'pr_7' },
  { term: 'Eight', def: '8 (Ocho)', k: 'pr_8' },
  { term: 'Nine', def: '9 (Nueve)', k: 'pr_9' },
  { term: 'Ten', def: '10 (Diez)', k: 'pr_10' },
  { term: 'Eleven', def: '11 (Once)', k: 'pr_11' },
  { term: 'Twelve', def: '12 (Doce)', k: 'pr_12' },
  { term: 'Thirteen', def: '13 (Trece)', k: 'pr_13' },
  { term: 'Fifteen', def: '15 (Quince)', k: 'pr_15' },
  { term: 'Twenty', def: '20 (Veinte)', k: 'pr_20' }
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

function genEval(){
  sfx('click');
  _evalFormaSelector();
  const _selF = document.getElementById('evalFormaSel');
  if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10)));
  const cf = evalFormNum;
  const rng = _evalRng(cf);
  window._currentEvalForm = cf;
  evalFormNum = (evalFormNum % EVAL_FORMAS) + 1;
  _evalFormaSelector();
  saveProgress();
  document.getElementById('eval-screen-title').textContent = `🎓 Evaluación Final · Forma ${cf} · Numbers and My Age`;
  evalAnsVisible = false;
  const out = document.getElementById('evalOut');
  out.innerHTML = '';
  const bar = document.createElement('div');
  bar.className = 'eval-score-bar';
  bar.innerHTML = `<div><div class="esb-title">📊 Distribución de puntaje · 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25 pts</span><span class="eval-score-pill esp-tf">V/F 25 pts</span><span class="eval-score-pill esp-mc">Selección 25 pts</span><span class="eval-score-pill esp-pr">Pareados 25 pts</span></div>`;
  out.appendChild(bar);

  const cpItems = _pickF(evalCPBank, 5, rng);
  const s1 = document.createElement('div');
  s1.innerHTML = '<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  cpItems.forEach((item, i) => {
    const d = document.createElement('div');
    d.className = 'eval-item eval-auto-item';
    d.dataset.evalType = 'cp';
    d.dataset.evalIndex = i;
    const qHtml = item.q.replace('___', `<input class="eval-cp-input" type="text" data-cp="${i}" autocomplete="off">`);
    d.innerHTML = `<div class="eval-q"><span class="eval-num">${i + 1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbCp${i}" aria-live="polite"></div>`;
    s1.appendChild(d);
  });
  out.appendChild(s1);

  const tfItems = _pickF(evalTFBank, 5, rng);
  const s2 = document.createElement('div');
  s2.innerHTML = '<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  tfItems.forEach((item, i) => {
    const d = document.createElement('div');
    d.className = 'eval-item eval-auto-item';
    d.dataset.evalType = 'tf';
    d.dataset.evalIndex = i;
    d.innerHTML = `<div class="eval-q"><span class="eval-num">${i + 6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="true"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="false"> Falso</label></div><div class="eval-answer">${item.a ? 'Verdadero' : 'Falso'}</div><div class="eval-item-feedback" id="evalFbTf${i}" aria-live="polite"></div>`;
    s2.appendChild(d);
  });
  out.appendChild(s2);

  const mcItems = _pickF(evalMCBank, 5, rng);
  const s3 = document.createElement('div');
  s3.innerHTML = '<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  mcItems.forEach((item, i) => {
    const d = document.createElement('div');
    d.className = 'eval-item eval-auto-item';
    d.dataset.evalType = 'mc';
    d.dataset.evalIndex = i;
    const optsHtml = item.o.map((op, oi) => `<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join('');
    d.innerHTML = `<div class="eval-q"><span class="eval-num">${i + 11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbMc${i}" aria-live="polite"></div>`;
    s3.appendChild(d);
  });
  out.appendChild(s3);

  const prItems = _pickF(evalPRBank, 5, rng);
  let shuffledDefs = _shuffleF(prItems, rng);
  let _prTries = 0;
  while (shuffledDefs.some((df, ix) => df.def === prItems[ix].def) && _prTries < 20) {
    shuffledDefs = _shuffleF(shuffledDefs, rng);
    _prTries++;
  }
  const letters = ['A', 'B', 'C', 'D', 'E'];
  const s4 = document.createElement('div');
  s4.innerHTML = '<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  const matchCard = document.createElement('div');
  matchCard.className = 'eval-item';
  let colLeft = '<div class="eval-match-col"><h4>📌 Términos</h4>';
  prItems.forEach((item, i) => {
    colLeft += `<div class="eval-match-item"><span class="eval-match-letter">${i + 16}.</span> <select class="eval-match-select" data-pr="${i}" aria-label="Respuesta pareada ${i + 16}"><option value="">?</option>${letters.map(l => `<option value="${l}">${l}</option>`).join('')}</select> ${item.term}</div>`;
  });
  colLeft += '</div>';
  let colRight = '<div class="eval-match-col"><h4>🔑 Definiciones</h4>';
  shuffledDefs.forEach((item, i) => {
    colRight += `<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`;
  });
  colRight += '</div>';
  const ansKey = prItems.map((item, i) => {
    const letter = letters[shuffledDefs.findIndex(d => d.def === item.def)];
    return `${i + 16}→${letter}`;
  }).join(' · ');
  matchCard.innerHTML = `<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div><div class="eval-item-feedback" id="evalFbPr" aria-live="polite"></div>`;
  s4.appendChild(matchCard);
  out.appendChild(s4);

  window._evalPrintData = { tf: tfItems, mc: mcItems, cp: cpItems, pr: { terms: prItems, shuffledDefs, letters } };
  const autoPanel = document.createElement('div');
  autoPanel.id = 'evalAutoResult';
  autoPanel.className = 'eval-auto-result';
  autoPanel.innerHTML = '<strong>🧮 Evaluación interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato original sin respuestas digitadas.';
  out.appendChild(autoPanel);
  fin('s-evaluacion');
}

function toggleEvalAns(){
  evalAnsVisible = !evalAnsVisible;
  document.querySelectorAll('#evalOut .eval-answer').forEach(el => el.style.display = evalAnsVisible ? 'block' : 'none');
  sfx('click');
}

function normalizeEvalAnswer(v){
  return (v || '').toString().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').replace(/[()]/g, '').trim();
}

function isCpCorrect(student, expected){
  const s = normalizeEvalAnswer(student);
  const e = normalizeEvalAnswer(expected);
  if (!s) return false;
  const variants = new Set([e]);
  if (e.includes(' ')) e.split(' ').forEach(x => x && variants.add(x));
  return variants.has(s) || e.replace(/[^a-z0-9]/g, '') === s.replace(/[^a-z0-9]/g, '');
}

function setEvalFeedback(id, ok, msg){
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.className = 'eval-item-feedback ' + (ok ? 'eval-ok' : 'eval-no');
}

function gradeEval(){
  if (!window._evalPrintData){ showToast('⚠️ Genera una evaluación primero'); return; }
  sfx('click');
  const d = window._evalPrintData;
  let total = 0;
  const detail = { cp: 0, tf: 0, mc: 0, pr: 0 };
  d.cp.forEach((it, i) => {
    const input = document.querySelector(`[data-cp="${i}"]`);
    const ok = isCpCorrect(input ? input.value : '', it.a);
    if (input){ input.classList.toggle('eval-input-ok', ok); input.classList.toggle('eval-input-no', !ok); }
    if (ok){ detail.cp++; total += 5; }
    setEvalFeedback('evalFbCp' + i, ok, ok ? 'Correcto. +5 pts' : 'Revisar. Respuesta esperada: ' + it.a);
  });
  d.tf.forEach((it, i) => {
    const selected = document.querySelector(`input[name="tf${i}"]:checked`);
    const ok = !!selected && (selected.value === 'true') === it.a;
    if (ok){ detail.tf++; total += 5; }
    setEvalFeedback('evalFbTf' + i, ok, ok ? 'Correcto. +5 pts' : 'Revisar. Respuesta esperada: ' + (it.a ? 'Verdadero' : 'Falso'));
  });
  d.mc.forEach((it, i) => {
    const selected = document.querySelector(`input[name="mc${i}"]:checked`);
    const ok = !!selected && Number(selected.value) === it.a;
    if (ok){ detail.mc++; total += 5; }
    setEvalFeedback('evalFbMc' + i, ok, ok ? 'Correcto. +5 pts' : 'Revisar. Respuesta esperada: ' + it.o[it.a]);
  });
  const expectedLetters = d.pr.terms.map(it => d.pr.letters[d.pr.shuffledDefs.findIndex(df => df.def === it.def)]);
  expectedLetters.forEach((letter, i) => {
    const sel = document.querySelector(`[data-pr="${i}"]`);
    const ok = !!sel && sel.value === letter;
    if (sel){ sel.classList.toggle('eval-input-ok', ok); sel.classList.toggle('eval-input-no', !ok); }
    if (ok){ detail.pr++; total += 5; }
  });
  const prMsg = `Pareados: ${detail.pr}/5 correctos. ${detail.pr === 5 ? 'Excelente. +25 pts' : 'Clave: ' + expectedLetters.map((l, i) => (i + 16) + '→' + l).join(' · ')}`;
  setEvalFeedback('evalFbPr', detail.pr === 5, prMsg);
  const result = document.getElementById('evalAutoResult');
  if (result){
    result.className = 'eval-auto-result ' + (total >= 70 ? 'eval-auto-pass' : 'eval-auto-risk');
    result.innerHTML = `<strong>Resultado automático: ${total}/100 puntos</strong><br><span>Completar: ${detail.cp * 5}/25 · V/F: ${detail.tf * 5}/25 · Selección: ${detail.mc * 5}/25 · Pareados: ${detail.pr * 5}/25</span><br><em>Este resultado es solo para revisión en pantalla; la impresión conserva el formato limpio para papel.</em>`;
  }
  if (total >= 70){
    pts(8);
    showToast('🎯 Evaluación calificada: ' + total + '/100');
  } else {
    showToast('🧮 Evaluación calificada: ' + total + '/100. Revisa las respuestas marcadas.');
  }
}

function printEval(){
  if (!window._evalPrintData){ showToast('⚠️ Genera una evaluación primero'); return; }
  sfx('click');
  const forma = window._currentEvalForm || 1;
  const d = window._evalPrintData;
  let s1 = `<div class="sec-title"><span>I. Completar el espacio</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div>`;
  d.cp.forEach((it, i) => {
    const q = it.q.replace('___', '<span class="cp-blank"></span>');
    s1 += `<div class="cp-row"><span class="qn">${i + 1}.</span><span class="cp-text">${q}</span></div>`;
  });
  let s2 = `<div class="sec-title"><span>II. Verdadero o Falso</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div>`;
  d.tf.forEach((it, i) => {
    s2 += `<div class="tf-row"><span class="qn">${i + 6}.</span><span class="tf-blank"></span><span class="tf-text">${it.q}</span></div>`;
  });
  let s3 = `<div class="sec-title"><span>III. Selección Múltiple</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div><div class="mc-grid">`;
  d.mc.forEach((it, i) => {
    const opts = it.o.map((op, oi) => `<label class="mc-opt"><input type="radio" name="mcp${i}"> ${op}</label>`).join('');
    s3 += `<div class="mc-item"><div class="mc-q"><span class="qn">${i + 11}.</span><span>${it.q}</span></div><div class="mc-opts">${opts}</div></div>`;
  });
  s3 += `</div>`;
  let colL = '<div class="pr-col"><div class="pr-head">📌 Términos</div>';
  d.pr.terms.forEach((it, i) => {
    colL += `<div class="pr-item"><span class="pr-num">${i + 16}.</span><span class="pr-line"></span>${it.term}</div>`;
  });
  colL += '</div>';
  let colR = '<div class="pr-col"><div class="pr-head">🔑 Definiciones</div>';
  d.pr.shuffledDefs.forEach((it, i) => {
    colR += `<div class="pr-item"><span class="pr-num">${d.pr.letters[i]}.</span>${it.def}</div>`;
  });
  colR += '</div>';
  let s4 = `<div class="pr-section"><div class="sec-title"><span>IV. Términos Pareados</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div><div class="pr-grid">${colL}${colR}</div></div>`;
  let pR = '';
  pR += `<div class="p-sec"><div class="p-ttl">I. Completar</div><table class="p-tbl">`;
  d.cp.forEach((it, i) => { pR += `<tr><td class="pn">${i + 1}.</td><td class="pa">${it.a}</td></tr>`; });
  pR += `</table></div><div class="p-sec"><div class="p-ttl">II. V o F</div><table class="p-tbl">`;
  d.tf.forEach((it, i) => { pR += `<tr><td class="pn">${i + 6}.</td><td class="pa">${it.a ? 'V' : 'F'}</td></tr>`; });
  pR += `</table></div><div class="p-sec"><div class="p-ttl">III. Selección</div><table class="p-tbl">`;
  d.mc.forEach((it, i) => { pR += `<tr><td class="pn">${i + 11}.</td><td class="pa">${it.o[it.a]}</td></tr>`; });
  pR += `</table></div><div class="p-sec"><div class="p-ttl">IV. Pareados</div><table class="p-tbl">`;
  d.pr.terms.forEach((it, i) => {
    const l = d.pr.letters[d.pr.shuffledDefs.findIndex(df => df.def === it.def)];
    pR += `<tr><td class="pn">${i + 16}.</td><td class="pa">${i + 16}→${l}</td></tr>`;
  });
  pR += `</table></div>`;

  const zgKey = [];
  d.cp.forEach((it, i) => zgKey.push({ n: i + 1, fill: 0, labels: ['✓', '✗', '', '', ''] }));
  d.tf.forEach((it, i) => zgKey.push({ n: i + 6, fill: it.a ? 0 : 1, labels: ['V', 'F', '', '', ''] }));
  d.mc.forEach((it, i) => zgKey.push({ n: i + 11, fill: it.a, labels: ['', '', '', '', ''] }));
  d.pr.terms.forEach((it, i) => { const l = d.pr.letters[d.pr.shuffledDefs.findIndex(df => df.def === it.def)]; zgKey.push({ n: i + 16, fill: 'ABCDE'.indexOf(l), labels: ['', '', '', '', ''] }); });
  const zgRow = r => `<div class="zg-row"><span class="zg-n">${r.n}</span>${r.labels.map((lb, ci) => ci === r.fill ? `<span class="zg-c zg-fill">${lb || '●'}</span>` : `<span class="zg-c">${lb}</span>`).join('')}</div>`;
  const zgHead = '<div class="zg-head"><span class="zg-n"></span><span>A</span><span>B</span><span>C</span><span>D</span><span>E</span></div>';
  const zgCol1 = zgHead + zgKey.slice(0, 10).map(zgRow).join('');
  const zgCol2 = zgHead + zgKey.slice(10).map(zgRow).join('');
  const zgVer = ['A', 'B', 'C', 'D'].map((v, i) => ((forma - 1) % 4) === i ? `<span class="zg-c zg-fill">${v}</span>` : `<span class="zg-c">${v}</span>`).join('');
  const zgBlock = `<div class="zg-wrap"><div class="zg-title">🎯 Clave rápida estilo ZipGrade · Forma ${forma}: respuestas correctas ya rellenadas para digitar la clave en la app</div><div class="zg-grid"><div class="zg-col">${zgCol1}</div><div class="zg-col">${zgCol2}</div></div><div class="zg-ver"><span>Test Version / Forma:</span>${zgVer}</div><div class="zg-note">1–5 (Completar): se revisan a mano → ✓ (A) equivale a respuesta correcta · 6–10: V=A, F=B · Réplica visual de referencia; para escanear alumnos usa la hoja oficial de ZipGrade.</div></div>`;

  const doc = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación Numbers and My Age · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;width:201.9mm;margin:0 auto;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.12rem 0.4rem;margin:0.22rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #be185d;background:#fff1f5;color:#be185d;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#be185d;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #be185d;height:12px;}.obt-pct{white-space:nowrap;}.qn{font-weight:700;min-width:22px;flex-shrink:0;}.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:40px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.18rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.14rem 0.35rem;margin-bottom:0.1rem;break-inside:avoid;page-break-inside:avoid;}.mc-q{font-size:10.5pt;line-height:1.3;display:flex;gap:0.28rem;margin-bottom:0.07rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.1rem 0.5rem;}.mc-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:0.04rem 0.15rem;margin-left:0.8rem;}.mc-opt{font-size:9pt;display:flex;align-items:center;gap:0.15rem;}.mc-opt input{width:10px;height:10px;flex-shrink:0;}.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.3;padding:0.13rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}.pr-section{margin-top:0.1rem;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.08rem 0.4rem;margin-top:0.08rem;}.pr-head{font-size:9pt;font-weight:700;color:#555;margin-bottom:0.1rem;}.pr-item{font-size:10.5pt;padding:0.1rem 0.28rem;background:#fff1f5;border-radius:3px;margin-bottom:0.07rem;display:flex;align-items:center;gap:0.2rem;line-height:1.2;break-inside:avoid;page-break-inside:avoid;}.pr-num{font-weight:700;color:#be185d;min-width:19px;flex-shrink:0;}.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.22rem;padding:0.15rem 0;page-break-before:avoid;break-before:avoid;color:#be185d;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #be185d;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.35rem 0.55rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}.p-tbl tr{border-bottom:1px dotted #ddd;}.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}.pn{font-weight:700;width:24px;color:#555;}.pa{color:#007a00;font-weight:600;}.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
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
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · Numbers and My Age · Educación Básica · Inglés</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>N.º Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p></div>${s1}${s2}${s3}${s4}<div class="total-row"><span>Total obtenido</span><span class="obt-line"></span><span>de 100%</span></div></div><div class="pauta-wrap" id="pautaPage"><div class="p-head"><div class="p-main">✅ PAUTA: Evaluación Final · Numbers and My Age · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u</div></div><div class="p-grid">${pR}</div>
  ${zgBlock}</div><div class="print-foot"><span class="pf-item"><strong>N.º de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("evalPage",252,0.55,1.45);fit("pautaPage",252,0.55,1.3);})();<\/script></body></html>`;
  const win = window.open('', '_blank', '');
  if (!win){ showToast('⚠️ Activa las ventanas emergentes para imprimir'); return; }
  win.document.write(typeof METAS_TR === 'function' ? METAS_TR(doc) : doc);
  win.document.close();
  setTimeout(() => win.print(), 400);
}

// ===================== PRUEBA DE PENSAMIENTO CRÍTICO =====================
function evalSwitchMode(mode){
  sfx('click');
  const cWrap = document.getElementById('evalConceptWrap'), critWrap = document.getElementById('evalCritWrap');
  const cBtn = document.getElementById('evalModeBtnConcept'), critBtn = document.getElementById('evalModeBtnCrit');
  if (mode === 'crit'){
    cWrap.style.display = 'none'; critWrap.style.display = 'block';
    cBtn.classList.remove('active'); cBtn.setAttribute('aria-selected', 'false');
    critBtn.classList.add('active'); critBtn.setAttribute('aria-selected', 'true');
    if (!window._evalCritData) genEvalCrit();
  } else {
    critWrap.style.display = 'none'; cWrap.style.display = 'block';
    critBtn.classList.remove('active'); critBtn.setAttribute('aria-selected', 'false');
    cBtn.classList.add('active'); cBtn.setAttribute('aria-selected', 'true');
  }
}

const critSensorBank = [
  { k: 'se-turista', txt: 'Un voluntario de Estados Unidos en Copán Ruinas le pregunta la edad a Denis: «How old are you?». Denis tiene 12 años.', ans: '«I am 12 years old» (o «I am 12»). Justificación: en inglés la edad se responde con el verbo to be («I am»), nunca con «I have». El número 12 es «twelve».' },
  { k: 'se-arboles', txt: 'En la escuela de Comayagua, la maestra pide 3 lápices y Kevin dice en voz alta «tree pencils».', ans: 'Debe corregir a «three pencils». «Tree» significa árbol; para el número 3 se debe pronunciar la th con la punta de la lengua entre los dientes (/θ/).' },
  { k: 'se-futbol', txt: 'En un torneo de fútbol bilingüe en SPS, el árbitro pregunta cuántos jugadores hay en la cancha y el capitán cuenta 11.', ans: '«There are eleven players». Se usa «There are» para plural y el número irregular «eleven» (no termina en -teen).' },
  { k: 'se-matricula', txt: 'En el registro escolar de Tegucigalpa, la secretaria en inglés le pregunta a Lucía: «Are you fifteen or sixteen?». Lucía tiene 15 años.', ans: '«I am fifteen years old». Debe usar fifteen (la raíz de five cambia a fif-) y acentuar en -TEEN para distinguirlo claramente de fifty.' },
  { k: 'se-pulperia', txt: 'Doña Carmen atiende a una clienta en Valle de Ángeles que compra 20 panes y pregunta la cantidad en inglés.', ans: '«There are twenty breads» (o «It is twenty»). El número 20 es «twenty», terminando en -ty y no en -teen.' },
  { k: 'se-hermano', txt: 'Un amigo extranjero te pregunta cuántos años tiene tu hermanito que acaba de cumplir 1 año.', ans: '«He is one year old». Se usa el singular «year» (sin s) porque la cantidad es exactamente uno.' }
];

const critErrorBank = [
  { k: 'er-have-tree', txt: '"I have 13 years old and I have tree brothers".', g1: 'Error 1: Usó «I have» para la edad. En inglés la edad es un estado de existencia y se usa el verbo to be: «I am 13 years old».', g2: 'Error 2: Dijo «tree» en vez de «three». Tree significa árbol; para el número 3 debe colocar la lengua entre los dientes y pronunciar «three».' },
  { k: 'er-fif-twen', txt: '"My sister is fiveteen and my cousin is twenteen".', g1: 'Error 1: Escribió «fiveteen». El número 15 cambia su raíz y se escribe «fifteen».', g2: 'Error 2: Escribió «twenteen». El número 20 no pertenece a la serie -teen; es una decena completa y se escribe «twenty».' },
  { k: 'er-there-acento', txt: '"There is eleven students in the classroom and I am thir-TY years old" (queriendo decir 13 años).', g1: 'Error 1: Dijo «There is» con un número plural (11). Para dos o más elementos se debe usar «There are eleven students».', g2: 'Error 2: Acentuó «THIR-ty» (30) en vez de «thir-TEEN» (13). En los números adolescentes del 13 al 19 el acento va en la última sílaba.' }
];

const critCicloQuestions = [
  '1. ¿Qué error o confusión de números o edad ocurrió en la situación?',
  '2. ¿Cómo se expresa correctamente en inglés cada dato con su regla gramatical?',
  '3. ¿Cómo queda la conversación completa corregida y fluida?'
];

const critCicloBank = [
  { k: 'ci-kevin', txt: 'Kevin inscribe a su hermano Marvin en un campamento deportivo en Siguatepeque. Al llenar la ficha en inglés, el coordinador le pregunta la edad de Marvin (13 años) y cuántas pelotas traen (3 pelotas). Kevin se confunde con la pronunciación y dice "tree" en ambas.', p: 'Confundió «tree» (árbol) con «three» (3) y omitió el sufijo -teen para 13.', d: 'Para 13 años debe decir «He is thirteen years old» (con acento en -teen). Para 3 pelotas: «We have three balls» (con sonido /θ/).', a: 'Coordinador: «How old is Marvin? How many balls do you have?» — Kevin: «He is thirteen years old, and we have three balls. Thank you!»' },
  { k: 'ci-lucia', txt: 'Lucía (11 años) y Denis (12 años) visitan una biblioteca bilingüe en Santa Rosa de Copán. La encargada les pide sus edades en inglés, pero Denis traduce literalmente diciendo "We have 11 and 12 years".', p: 'Usaron «have» (posesión en español) en vez del verbo «to be» para la edad en inglés.', d: 'En inglés la edad se formula con to be: Lucía es «I am eleven years old» y Denis es «I am twelve years old». Eleven y twelve son excepciones que no llevan -teen.', a: 'Encargada: «How old are you both?» — Lucía: «I am eleven years old.» — Denis: «And I am twelve years old. Nice to meet you!»' },
  { k: 'ci-carmen', txt: 'Doña Carmen vende artesanías de barro en Valle de Ángeles. Una turista le pregunta en inglés el precio de 15 jarritos y cuántos años tiene su nieta Sofía que ayuda en el puesto (14 años). Carmen no recuerda si 15 se dice fiveteen y dice que Sofía "has fourteen years".', p: 'Dudas entre fiveteen vs fifteen, y uso de has en vez de is para la edad de la niña.', d: '15 se dice fifteen (raíz fif-). La edad de Sofía se expresa con is: «She is fourteen years old». Ambas palabras llevan acento en -teen.', a: 'Turista: «How many cups are there, and how old is the girl?» — Carmen: «There are fifteen cups, and she is fourteen years old.»' },
  { k: 'ci-mateo', txt: 'El profesor de educación física pide a Mateo contar a los compañeros presentes en la cancha (20 alumnos) y confirmar si todos tienen entre 11 y 13 años.', p: 'Riesgo de confundir twenty con twenteen, y de no reconocer que 11 y 12 no llevan -teen mientras 13 sí.', d: '20 se dice twenty. Las edades son eleven (11), twelve (12) y thirteen (13). Para el grupo se usa «There are twenty students».', a: 'Profesor: «Mateo, how many students are here and how old are they?» — Mateo: «There are twenty students. They are eleven, twelve, and thirteen years old.»' },
  { k: 'ci-elena', txt: 'En una fogata con scouts de Canadá en La Tigra, cada integrante debe decir su nombre, edad (Elena tiene 15) y cuántas carpas armaron (4 carpas). Elena duda entre for y four, y si usar have o am.', p: 'Duda ortográfica entre for (para) y four (cuatro), y confusión gramatical de la edad.', d: 'El número 4 se escribe «four». La edad requiere «I am fifteen years old». Para las carpas: «We have four tents».', a: 'Scout líder: «Please introduce yourself and your patrol.» — Elena: «Hello! I am Elena. I am fifteen years old, and we have four tents. Welcome!»' }
];

const critCompareBank = [
  { k: 'cm-teen-ty', a: 'Números adolescentes del 13 al 19 (thirteen, fourteen, etc.).', b: 'Decenas exactas como 30, 40, etc. (thirty, forty, etc.).', ga: 'Sufijo -teen con acento prosódico fuerte al final (thir-TEEN).', gb: 'Sufijo -ty con acento prosódico en la primera sílaba (THIR-ty).', gr: 'Semejanza: ambos grupos se forman a partir de las raíces de los números básicos. Diferencia: el sufijo (-teen vs -ty) y la posición del acento prosódico, lo cual cambia radicalmente la cantidad expresada.' },
  { k: 'cm-edad-esp-eng', a: 'Expresar la edad en español: «Tengo 12 años».', b: 'Expresar la edad en inglés: «I am 12 years old».', ga: 'Uso del verbo poseer/tener (la edad se concibe como posesión que se acumula).', gb: 'Uso del verbo ser/estar (to be), concibiendo la edad como un estado del ser humano.', gr: 'Semejanza: ambas frases comunican la misma información cronológica sobre la persona. Diferencia: la estructura mental y gramatical; en inglés es un error grave traducir «I have 12 years».' },
  { k: 'cm-three-tree', a: 'La palabra «three» (número 3).', b: 'La palabra «tree» (árbol).', ga: 'Pronunciación con sonido fricativo interdental sordo /θ/ (lengua entre los dientes).', gb: 'Pronunciación oclusiva alveolar /t/ (la lengua toca el paladar superior).', gr: 'Semejanza: se escriben casi igual y para un hispanohablante suenan parecidas si no se entrena el oído. Diferencia: el fonema inicial /θ/ vs /t/ y el significado totalmente diferente (una cantidad vs una planta).' },
  { k: 'cm-irr-reg', a: 'Los números 11 (eleven) y 12 (twelve).', b: 'Los números del 13 al 19 (thirteen al nineteen).', ga: 'Formas irregulares de origen germánico antiguo que no usan sufijo.', gb: 'Formas regulares que combinan la raíz numérica con el sufijo -teen.', gr: 'Semejanza: todos son números intermedios entre 10 y 20 indispensables para contar y dar edades. Diferencia: eleven y twelve tienen nombres propios únicos y no se dice «oneteen» ni «twoteen».' }
];

const critDesignBank = [
  'En un campamento de verano en Valle de Ángeles llega un grupo de jóvenes de habla inglesa y te toca registrar sus nombres y edades (entre 11 y 15 años).',
  'Eres el capitán de un equipo de fútbol escolar en San Pedro Sula y presentas a tus 11 jugadores y sus edades a los organizadores del torneo.',
  'En el aeropuerto de Palmerola ayudas a una familia extranjera con dos niños (de 3 y 8 años) traduciendo sus edades y cuántas maletas llevan.',
  'Una maestra de Estados Unidos visita tu centro educativo en Tegucigalpa y te pide que le enseñes a contar objetos del aula del 1 al 20.',
  'Participas en una videollamada con un colegio de Canadá para intercambiar información sobre cuántos años tienen y cuántos miembros hay en tu familia.'
];

const critDesignGuide = 'Rúbrica de 3 criterios (total 20 pts): ① PREGUNTA Y RESPUESTA DE EDAD (7 pts): fórmula correcta con «How old are you?» y respuesta con «I am [número] years old» sin usar «have». ② PRECISIÓN NUMÉRICA (7 pts): escritura y uso correcto de números del 1 al 20, cuidando excepciones (eleven, twelve, fifteen, three vs tree). ③ FLUIDEZ Y COHERENCIA (6 pts): diálogo completo de al menos 6 líneas con saludo, intercambio de datos y despedida cortés.';

function genEvalCrit(){
  sfx('click');
  _injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });
  const _sC = document.getElementById('evalCritFormaSel');
  if (_sC && parseInt(_sC.value, 10)) evalCritFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sC.value, 10)));
  const cf = evalCritFormNum;
  window._currentEvalCritForm = cf;
  const rngC = _evalRng(200000 + cf);
  evalCritFormNum = (evalCritFormNum % EVAL_FORMAS) + 1;
  _injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });
  saveProgress();
  document.getElementById('evalcrit-screen-title').textContent = `🧠 Pensamiento Crítico · Forma ${cf} · Numbers and My Age`;
  evalCritAnsVisible = false;
  const out = document.getElementById('evalCritOut');
  out.innerHTML = '';
  const sens = _pickF(critSensorBank, 2, rngC);
  const s1 = document.createElement('div');
  s1.innerHTML = `<div class="eval-section-title">I. ¿Qué dirías en esta situación? <span class="eval-pts">20 pts</span></div><div class="eval-item">${sens.map((k, i) => `<div class="crit-scenario">Caso ${i + 1}: ${k.txt}</div><div class="crit-q-block"><div class="crit-q-label">¿Qué dirías exactamente en inglés? Justifica tu respuesta:</div><textarea class="crit-textarea" rows="2" aria-label="Sensor del caso ${i + 1} y su justificación"></textarea><div class="crit-pauta">${k.ans}</div></div>`).join('')}<div class="crit-selfscore"><label for="critScore0">Obtenido:</label><input type="number" id="critScore0" class="crit-score-input" data-score="0" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s1);

  const err = _pickF(critErrorBank, 1, rngC)[0];
  const s2 = document.createElement('div');
  s2.innerHTML = `<div class="eval-section-title">II. Corrige el error conceptual <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${err.txt}</div><p style="font-size:0.85rem;margin-bottom:0.5rem;">Este comentario tiene <strong>dos errores</strong>. Corrígelos con argumentos: explica qué se dice de verdad y por qué:</p><div class="crit-q-block"><div class="crit-q-label">Error 1 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 1 y su corrección"></textarea><div class="crit-pauta">${err.g1}</div></div><div class="crit-q-block"><div class="crit-q-label">Error 2 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 2 y su corrección"></textarea><div class="crit-pauta">${err.g2}</div></div><div class="crit-selfscore"><label for="critScore1">Obtenido:</label><input type="number" id="critScore1" class="crit-score-input" data-score="1" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s2);

  const cic = _pickF(critCicloBank, 1, rngC)[0];
  const cicloGuides = [cic.p, cic.d, cic.a];
  const s3 = document.createElement('div');
  s3.innerHTML = `<div class="eval-section-title">III. Analiza la conversación completa <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${cic.txt}</div>${critCicloQuestions.map((q, i) => `<div class="crit-q-block"><div class="crit-q-label">${q}</div><textarea class="crit-textarea" rows="2" aria-label="${q}"></textarea><div class="crit-pauta">${cicloGuides[i]}</div></div>`).join('')}<div class="crit-selfscore"><label for="critScore2">Obtenido:</label><input type="number" id="critScore2" class="crit-score-input" data-score="2" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s3);

  const cmp = _pickF(critCompareBank, 1, rngC)[0];
  const s4 = document.createElement('div');
  s4.innerHTML = `<div class="eval-section-title">IV. Comparación razonada <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-compare-grid"><div class="crit-compare-box"><h5>Caso A</h5>${cmp.a}</div><div class="crit-compare-box"><h5>Caso B</h5>${cmp.b}</div></div><div class="crit-q-block"><div class="crit-q-label">1. ¿Qué concepto corresponde a cada caso? 2. ¿En qué se parecen? 3. ¿En qué se diferencian? Da un ejemplo de cada uno.</div><textarea class="crit-textarea" rows="4" aria-label="Comparación razonada de los casos A y B"></textarea><div class="crit-pauta">Caso A: ${cmp.ga} · Caso B: ${cmp.gb} · ${cmp.gr}</div></div><div class="crit-selfscore"><label for="critScore3">Obtenido:</label><input type="number" id="critScore3" class="crit-score-input" data-score="3" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s4);

  const dis = _pickF(critDesignBank, 1, rngC)[0];
  const s5 = document.createElement('div');
  s5.innerHTML = `<div class="eval-section-title">V. Escribe y justifica tu diálogo <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${dis}</div><div class="crit-q-block"><div class="crit-q-label">Escribe el diálogo completo en inglés para esta situación: PREGUNTA Y RESPUESTA DE EDAD, PRECISIÓN NUMÉRICA y DESPEDIDA con cortesía. Al menos 6 líneas.</div><textarea class="crit-textarea" rows="5" aria-label="Diseño y justificación del diálogo"></textarea><div class="crit-pauta">${critDesignGuide}</div></div><div class="crit-selfscore"><label for="critScore4">Obtenido:</label><input type="number" id="critScore4" class="crit-score-input" data-score="4" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
  out.appendChild(s5);

  window._evalCritData = { sens, err, cic, cmp, dis };
  const totalPanel = document.createElement('div');
  totalPanel.id = 'evalCritTotalResult';
  totalPanel.className = 'crit-total-panel';
  totalPanel.innerHTML = '<strong>🧮 Autoevaluación:</strong> responde cada sección, compara con la <em>Pauta</em> y anota tu puntaje (0–20) en cada casilla. Luego presiona <em>Calcular Total</em>.';
  out.appendChild(totalPanel);
  fin('s-evaluacion');
}

function toggleEvalCritAns(){
  evalCritAnsVisible = !evalCritAnsVisible;
  document.querySelectorAll('#evalCritOut .crit-pauta').forEach(el => el.style.display = evalCritAnsVisible ? 'block' : 'none');
  sfx('click');
}

function calcCritTotal(){
  if (!window._evalCritData){ showToast('⚠️ Genera una prueba primero'); return; }
  sfx('click');
  let total = 0;
  document.querySelectorAll('#evalCritOut .crit-score-input').forEach(inp => {
    let v = parseInt(inp.value) || 0;
    v = Math.max(0, Math.min(20, v));
    inp.value = v;
    total += v;
  });
  const panel = document.getElementById('evalCritTotalResult');
  if (panel){
    panel.className = 'crit-total-panel ' + (total >= 70 ? 'eval-auto-pass' : 'eval-auto-risk');
    panel.innerHTML = `<strong>Puntaje total autoevaluado: ${total}/100</strong><br><em>Compara siempre tus respuestas con la Pauta antes de anotar el puntaje de cada sección.</em>`;
  }
  const formKey = 'crit_' + (window._currentEvalCritForm || 1);
  if (total >= 70){
    if (!xpTracker.wgt.has(formKey)){
      xpTracker.wgt.add(formKey);
      pts(8);
    }
    showToast('🎯 Pensamiento crítico: ' + total + '/100');
  } else {
    showToast('🧮 Puntaje registrado: ' + total + '/100. ¡Sigue practicando!');
  }
}

function printEvalCrit(){
  if (!window._evalCritData){ showToast('⚠️ Genera una prueba primero'); return; }
  sfx('click');
  const forma = window._currentEvalCritForm || 1;
  const d = window._evalCritData;
  const lines = (n) => Array(n).fill('<div class="ln"></div>').join('');
  let s1 = `<div class="sec-title"><span>I. ¿Qué dirías en esta situación?</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div>`;
  d.sens.forEach((k, i) => {
    s1 += `<p class="crit-print-scenario">Caso ${i + 1}: ${k.txt}</p><p class="crit-print-q">¿Qué dirías exactamente en inglés? Justifica tu elección.</p>${lines(1)}`;
  });
  let s2 = `<div class="sec-title"><span>II. Corrige el error conceptual</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.err.txt}</p><p class="crit-print-q">Este comentario tiene dos errores. Corrígelos con argumentos:</p><p class="crit-print-q"><strong>Error 1:</strong></p>${lines(1)}<p class="crit-print-q"><strong>Error 2:</strong></p>${lines(1)}`;
  let s3 = `<div class="sec-title"><span>III. Analiza la conversación completa</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.cic.txt}</p>`;
  critCicloQuestions.forEach(q => { s3 += `<p class="crit-print-q">${q}</p>${lines(1)}`; });
  let s4 = `<div class="sec-title"><span>IV. Comparación razonada</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><div class="crit-compare-print-grid"><div class="crit-compare-print-box"><strong>Caso A:</strong> ${d.cmp.a}</div><div class="crit-compare-print-box"><strong>Caso B:</strong> ${d.cmp.b}</div></div><p class="crit-print-q">1. ¿Qué concepto corresponde a cada caso? 2. ¿En qué se parecen? 3. ¿En qué se diferencian? Da un ejemplo de cada uno.</p>${lines(2)}`;
  let s5 = `<div class="sec-title"><span>V. Escribe y justifica tu diálogo</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.dis}</p><p class="crit-print-q">Escribe el diálogo completo en inglés para esta situación: PREGUNTA Y RESPUESTA DE EDAD, PRECISIÓN NUMÉRICA y DESPEDIDA con cortesía. Al menos 6 líneas.</p>${lines(4)}`;
  let pR = '';
  pR += `<div class="p-sec"><div class="p-ttl">I. ¿Qué dirías en esta situación?</div>${d.sens.map((k, i) => `<div class="p-crit-line"><strong>Caso ${i + 1}:</strong> ${k.ans}</div>`).join('')}</div>`;
  pR += `<div class="p-sec"><div class="p-ttl">II. Corrige el error</div><div class="p-crit-line"><strong>Error 1:</strong> ${d.err.g1}</div><div class="p-crit-line"><strong>Error 2:</strong> ${d.err.g2}</div></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">III. Analiza la conversación</div><div class="p-crit-line"><strong>Confusión:</strong> ${d.cic.p}</div><div class="p-crit-line"><strong>Formulación correcta:</strong> ${d.cic.d}</div><div class="p-crit-line"><strong>Diálogo fluido:</strong> ${d.cic.a}</div></div>`;
  pR += `<div class="p-sec"><div class="p-ttl">IV. Comparación</div><div class="p-crit-line"><strong>Caso A:</strong> ${d.cmp.ga}</div><div class="p-crit-line"><strong>Caso B:</strong> ${d.cmp.gb}</div><div class="p-crit-line">${d.cmp.gr}</div></div>`;
  pR += `<div class="p-sec" style="grid-column:1/-1;"><div class="p-ttl">V. Escribe tu diálogo: rúbrica</div><div class="p-crit-line">${critDesignGuide}</div></div>`;
  const doc = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Pensamiento Crítico Numbers and My Age · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.1rem 0.4rem;margin:0.2rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #be185d;background:#fff1f5;color:#be185d;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#be185d;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #be185d;height:12px;}.obt-pct{white-space:nowrap;}.crit-print-scenario{font-size:10.5pt;background:#fff1f5;border-left:3px solid #be185d;padding:0.2rem 0.5rem;margin:0.1rem 0 0.2rem;line-height:1.3;}.crit-print-q{font-size:10pt;font-weight:600;margin:0.15rem 0 0.08rem;line-height:1.25;}.ln{border-bottom:1px solid #111;min-height:12px;margin-bottom:2px;}.crit-compare-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin:0.15rem 0;}.crit-compare-print-box{font-size:9.5pt;background:#fff1f5;border-radius:4px;padding:0.25rem 0.4rem;line-height:1.25;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:13pt;font-weight:700;}.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.08rem 0;}.p-meta{font-size:9pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.9rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.45rem;}.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.1rem;margin-bottom:0.18rem;}.p-crit-line{font-size:11pt;color:#007a00;margin-bottom:0.18rem;line-height:1.35;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.2rem;padding:0.1rem 0;color:#be185d;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #be185d;}.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}
.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}
.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}
.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}@media print{@page{size:letter portrait;margin:12.7mm;}body{padding-bottom:9mm;}}</style></head><body><div id="critEvalPage"><div class="ph"><h2>Evaluación Competencial · Pensamiento Crítico · Numbers and My Age · Educación Básica · Inglés</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>N.º Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 5 secciones de 20 puntos</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total obtenido</span><span class="obt-line"></span><span>de 100</span></div></div><div class="pauta-wrap" id="critPautaPage"><div class="p-head"><div class="p-main">✅ PAUTA: Pensamiento Crítico · Numbers and My Age · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 5 secciones × 20 pts c/u · respuesta abierta, usar como guía de corrección</div></div><div class="p-grid">${pR}</div></div><div class="print-foot"><span class="pf-item"><strong>N.º de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div><script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("critEvalPage",250,0.55,1.2);fit("critPautaPage",250,0.55,1.2);})();<\/script></body></html>`;
  const win = window.open('', '_blank', '');
  if (!win){ showToast('⚠️ Activa las ventanas emergentes para imprimir'); return; }
  win.document.write(typeof METAS_TR === 'function' ? METAS_TR(doc) : doc);
  win.document.close();
  setTimeout(() => win.print(), 400);
}

// ===================== LABORATORIO INTERACTIVO =====================
const parteData = [
  { num: 1, word: 'One', pron: 'uan', age: 'I am one year old.', obj: 'There is one pencil.', err: 'Evitar decir «one years» (con 1 es singular year).' },
  { num: 2, word: 'Two', pron: 'tuu', age: 'I am two years old.', obj: 'There are two books.', err: 'Recuerda que con 2 o más se usa There are y years con s.' },
  { num: 3, word: 'Three', pron: 'thrii', age: 'I am three years old.', obj: 'There are three notebooks.', err: '¡Cuidado! Tree es árbol. Coloca la lengua entre los dientes para decir three.' },
  { num: 4, word: 'Four', pron: 'for', age: 'I am four years old.', obj: 'There are four chairs.', err: 'No confundir la escritura de four con for (para).' },
  { num: 5, word: 'Five', pron: 'faiv', age: 'I am five years old.', obj: 'There are five balls.', err: 'Recuerda que 15 cambia a fifteen (no fiveteen).' },
  { num: 6, word: 'Six', pron: 'siks', age: 'I am six years old.', obj: 'There are six apples.', err: 'Pronuncia la x final con sonido /ks/.' },
  { num: 7, word: 'Seven', pron: 'seven', age: 'I am seven years old.', obj: 'There are seven days.', err: 'No confundir con eleven (11).' },
  { num: 8, word: 'Eight', pron: 'eit', age: 'I am eight years old.', obj: 'There are eight desks.', err: 'La g y la h no se pronuncian: suena /eit/.' },
  { num: 9, word: 'Nine', pron: 'nain', age: 'I am nine years old.', obj: 'There are nine stars.', err: 'No confundir con nineteen (19).' },
  { num: 10, word: 'Ten', pron: 'ten', age: 'I am ten years old.', obj: 'There are ten pens.', err: 'Base fundamental de las decenas.' },
  { num: 11, word: 'Eleven', pron: 'ileven', age: 'I am eleven years old.', obj: 'There are eleven players.', err: '¡Excepción! Es irregular: no termina en -teen.' },
  { num: 12, word: 'Twelve', pron: 'tuelv', age: 'I am twelve years old.', obj: 'There are twelve eggs.', err: '¡Excepción! Una docena. No se dice twoteen.' },
  { num: 13, word: 'Thirteen', pron: 'ther-tiin', age: 'I am thirteen years old.', obj: 'There are thirteen shirts.', err: 'Acentúa en -teen. Comienza la pandilla adolescente.' },
  { num: 14, word: 'Fourteen', pron: 'for-tiin', age: 'I am fourteen years old.', obj: 'There are fourteen students.', err: 'Lleva four completo más el sufijo -teen.' },
  { num: 15, word: 'Fifteen', pron: 'fif-tiin', age: 'I am fifteen years old.', obj: 'There are fifteen cups.', err: 'Cambia a fif-teen (no fiveteen).' },
  { num: 16, word: 'Sixteen', pron: 'siks-tiin', age: 'I am sixteen years old.', obj: 'There are sixteen shoes.', err: 'Lleva six más -teen.' },
  { num: 17, word: 'Seventeen', pron: 'seven-tiin', age: 'I am seventeen years old.', obj: 'There are seventeen cars.', err: 'Lleva seven más -teen.' },
  { num: 18, word: 'Eighteen', pron: 'ei-tiin', age: 'I am eighteen years old.', obj: 'There are eighteen boxes.', err: 'Solo lleva una sola t: eight + een = eighteen.' },
  { num: 19, word: 'Nineteen', pron: 'nain-tiin', age: 'I am nineteen years old.', obj: 'There are nineteen trees.', err: 'Lleva nine completo más -teen.' },
  { num: 20, word: 'Twenty', pron: 'tuenti', age: 'I am twenty years old.', obj: 'There are twenty coins.', err: 'Termina en -ty, no en -teen.' }
];

let curLabNum = 12, curLabAspecto = 1;
function selectLabNum(n){
  sfx('click');
  curLabNum = n;
  document.querySelectorAll('.lab-num-btn').forEach(b=>{
    b.classList.toggle('active', parseInt(b.dataset.n) === n);
  });
  renderLabDisplay();
}
function selectLabAspecto(a){
  sfx('click');
  curLabAspecto = a;
  document.querySelectorAll('.lab-asp-btn').forEach(b=>{
    b.classList.toggle('active', parseInt(b.dataset.a) === a);
  });
  renderLabDisplay();
}
function renderLabDisplay(){
  const item = parteData.find(p=>p.num === curLabNum) || parteData[0];
  const box = document.getElementById('labDisplayContent');
  if(!box) return;
  let html = '';
  if(curLabAspecto === 1){
    html = `<div style="font-size:2rem;font-weight:900;color:var(--pri);">${item.num} &nbsp;·&nbsp; ${item.word}</div>
      <p style="font-size:1.1rem;color:var(--gray);margin-top:4px;">Pronunciación: <b>/${item.pron}/</b></p>
      <button class="btn btn-pri" style="margin-top:8px;" onclick="say('${item.word}')">🔊 Escuchar pronunciación</button>`;
  }else if(curLabAspecto === 2){
    html = `<div style="font-size:1.3rem;font-weight:700;color:var(--dark);">🎂 Expresar la edad:</div>
      <div style="font-size:1.5rem;font-weight:900;color:var(--pri);margin:8px 0;">«${item.age}»</div>
      <p style="font-size:0.95rem;">En español decimos: «Tengo ${item.num} años».</p>
      <button class="btn btn-pri" style="margin-top:8px;" onclick="say('${item.age}')">🔊 Escuchar en voz alta</button>`;
  }else if(curLabAspecto === 3){
    html = `<div style="font-size:1.3rem;font-weight:700;color:var(--dark);">📦 Contar objetos en el aula:</div>
      <div style="font-size:1.4rem;font-weight:900;color:var(--pri);margin:8px 0;">«${item.obj}»</div>
      <button class="btn btn-pri" style="margin-top:8px;" onclick="say('${item.obj}')">🔊 Escuchar frase</button>`;
  }else{
    html = `<div style="font-size:1.3rem;font-weight:700;color:var(--dark);">⚠️ Error típico del hispanohablante:</div>
      <div style="background:#fee2e2;color:#991b1b;padding:8px 12px;border-radius:8px;font-weight:700;margin:8px 0;">${item.err}</div>
      <p style="font-size:0.9rem;">Recuerda siempre: en inglés la edad se es con el verbo to be, ¡nunca se tiene con have!</p>`;
  }
  box.innerHTML = html;
}

// ===================== DIPLOMA =====================
function openDiploma(){
  sfx('click');
  document.getElementById('diplomaModal').style.display = 'flex';
}
function closeDiploma(){
  sfx('click');
  document.getElementById('diplomaModal').style.display = 'none';
}
function updateDiplomaName(val){
  const el = document.getElementById('diplomaNameDisp');
  if(el) el.textContent = val.trim() || 'Estudiante Destacado';
}
function captureDiploma(){
  sfx('click');
  if(window.html2canvas){
    html2canvas(document.getElementById('diplomaCard')).then(canvas=>{
      const a = document.createElement('a');
      a.download = 'diploma-numeros-edad-ingles.png';
      a.href = canvas.toDataURL();
      a.click();
    });
  }else{
    showToast('Descarga no disponible en este dispositivo.');
  }
}
function shareWA(){
  const nom = document.getElementById('diplomaNameDisp').textContent;
  const texto = `🎓 ¡Completé con éxito la Misión Numbers and My Age en M.E.T.A.S! 🔢\n\nEstudiante: *${nom}*\n\nAprendí a contar del 1 al 20 y decir mi edad en inglés sin errores. ¡Mira mi diploma!`;
  _waShare(texto);
}

// ===================== PRONUNCIACIÓN (SPEECH SYNTHESIS) =====================
let _vozEN = null;
function _buscarVozEN(){
  if(!('speechSynthesis' in window)) return null;
  const vs = window.speechSynthesis.getVoices() || [];
  return vs.find(v=>/^en[-_]US/i.test(v.lang)) || vs.find(v=>/^en/i.test(v.lang)) || null;
}
if('speechSynthesis' in window){
  _vozEN = _buscarVozEN();
  window.speechSynthesis.onvoiceschanged = ()=>{ _vozEN = _buscarVozEN(); };
}
function say(texto){
  if(!('speechSynthesis' in window)){
    showToast('🔇 Este equipo no tiene síntesis de voz; guíate por la pronunciación figurada.');
    return;
  }
  try{
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = 'en-US';
    if(!_vozEN) _vozEN = _buscarVozEN();
    if(_vozEN) u.voice = _vozEN;
    u.rate = 0.85;
    u.pitch = 1;
    window.speechSynthesis.speak(u);
  }catch(e){
    showToast('🔇 No se pudo reproducir la voz en este equipo.');
  }
}
function sayFC(){
  if(typeof sfx === 'function') sfx('click');
  say(fcData[fcIdx].w.replace(/[…]/g, ''));
}

// ===================== INIT =====================
window.addEventListener('DOMContentLoaded', ()=>{
  initTheme();
  loadProgress();
  renderFC();
  buildMemo();
  renderQuiz();
  buildClass();
  renderIdentify();
  renderComplete();
  buildRoute();
  renderNeuron();
  renderNeuro();
  renderDetector();
  renderReto();
  buildSopa();
  genEval();
  renderLabDisplay();
});

(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalCrit==='function') _injectFormaSel('genEvalCrit','evalCritFormaSel',evalCritFormNum,function(v){evalCritFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();
