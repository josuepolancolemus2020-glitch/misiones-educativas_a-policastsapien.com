function toggleLetra(){
  document.body.classList.toggle('letra-grande');
  if(typeof sfx==='function') sfx('click');
  localStorage.setItem('preferenciaLetra',document.body.classList.contains('letra-grande'));
}
window.addEventListener('DOMContentLoaded',()=>{
  if(localStorage.getItem('preferenciaLetra')==='true') document.body.classList.add('letra-grande');
});

// ===================== UTILIDADES =====================
const _pick=(arr,n)=>[...arr].sort(()=>Math.random()-0.5).slice(0,n);
const _shuffle=(arr)=>[...arr].sort(()=>Math.random()-0.5);

function fb(id,msg,isOk){
  const el=document.getElementById(id);
  if(el){el.textContent=msg;el.className='fb show '+(isOk?'ok':'err');}
}

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY='bosques_areas_protegidas_v1';
let xp=0, MXP=200, done=new Set(), evalAnsVisible=false;
let evalFormNum=1;
let unlockedAch=[];
let darkMode=false;
let prevLevel=0;
const TOTAL_SECTIONS=12;

const xpTracker={
  fc:new Set(), qz:new Set(), cls:new Set(), id:new Set(),
  cmp:new Set(), reto:new Set(), sopa:new Set(),
};

// ===================== SONIDO =====================
let sndOn=true; let AC=null;
function getAC(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}}return AC;}
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
function toggleSnd(){sndOn=!sndOn;document.getElementById('sndBtn').textContent=sndOn?'🔊 Sonido':'🔇 Sonido';}

// ===================== DARK MODE =====================
function toggleTheme(){darkMode=!darkMode;document.documentElement.setAttribute('data-theme',darkMode?'dark':'light');document.getElementById('themeBtn').textContent=darkMode?'☀️ Tema':'🌙 Tema';localStorage.setItem(SAVE_KEY+'_theme',darkMode?'dark':'light');sfx('click');}
function initTheme(){const s=localStorage.getItem(SAVE_KEY+'_theme');const sys=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;darkMode=(s==='dark')||(s===null&&sys);if(darkMode){document.documentElement.setAttribute('data-theme','dark');document.getElementById('themeBtn').textContent='☀️ Tema';}}

// ===================== LOCALSTORAGE =====================
function saveProgress(){
  try{localStorage.setItem(SAVE_KEY,JSON.stringify({doneSections:Array.from(done),unlockedAch,evalFormNum,xp}));}catch(e){}
}
function loadProgress(){
  try{
    const s=JSON.parse(localStorage.getItem(SAVE_KEY));
    if(!s) return;
    if(s.doneSections&&Array.isArray(s.doneSections)) s.doneSections.forEach(id=>{
      done.add(id);
      const b=document.querySelector(`[data-s="${id}"]`);
      if(b) b.classList.add('done');
    });
    if(s.unlockedAch&&Array.isArray(s.unlockedAch)) unlockedAch=s.unlockedAch.filter(id=>ACHIEVEMENTS[id]!==undefined);
    if(s.evalFormNum) evalFormNum=s.evalFormNum;
    if(s.xp!==undefined){xp=s.xp;updateXPBar();}
  }catch(e){}
}

// ===================== ACHIEVEMENTS =====================
const ACHIEVEMENTS={
  primer_quiz:{icon:'🧠',label:'Primera prueba del bosque superada'},
  flash_master:{icon:'🃏',label:'Todas las flashcards exploradas'},
  clasif_pro:{icon:'🗂️',label:'Clasificador de bosques experto'},
  id_master:{icon:'🔍',label:'Identificador de ecosistemas maestro'},
  reto_hero:{icon:'🏆',label:'Héroe del reto del bosque'},
  nivel3:{icon:'🌿',label:'¡Guardabosques! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡Guardián de áreas protegidas! Nivel 6'}
};
function unlockAchievement(id){
  if(unlockedAch.includes(id)) return;
  unlockedAch.push(id);
  sfx('ach');
  showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label);
  launchConfetti();
  renderAchPanel();
  saveProgress();
}
function renderAchPanel(){
  const list=document.getElementById('achList'); list.innerHTML='';
  Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{
    const div=document.createElement('div');
    div.className='ach-item'+(unlockedAch.includes(id)?'':' locked');
    div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`;
    list.appendChild(div);
  });
}
function toggleAchPanel(){sfx('click');document.getElementById('achPanel').classList.toggle('open');}
function showToast(msg){
  let t=document.querySelector('.toast');
  if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}
  t.textContent=msg;t.style.display='block';
  clearTimeout(t._tid);
  t._tid=setTimeout(()=>t.style.display='none',3200);
}
function launchConfetti(){
  const colors=['#2d7a4f','#5a8f3c','#00b894','#fdcb6e','#6c5ce7'];
  for(let i=0;i<60;i++){
    const c=document.createElement('div');c.className='confetti-piece';
    c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`;
    document.body.appendChild(c);
    c.addEventListener('animationend',()=>c.remove());
  }
}

// ===================== XP =====================
const lvls=[{t:0,n:'Aprendiz 🌱'},{t:25,n:'Explorador 🌿'},{t:55,n:'Naturalista 🦜'},{t:90,n:'Guardabosques 🌲'},{t:130,n:'Conservacionista 🦁'},{t:165,n:'Guardián 🏅'},{t:190,n:'Maestro del Bosque 🏆'}];
function pts(n){
  xp=Math.max(0,Math.min(MXP,xp+n));
  updateXPBar();saveProgress();
}
function updateXPBar(){
  const pct=Math.round((xp/MXP)*100);
  document.getElementById('xpFill').style.width=pct+'%';
  const el=document.getElementById('xpPts');
  el.textContent='⭐ '+xp;
  el.style.transform='scale(1.3)';
  setTimeout(()=>el.style.transform='',300);
  let lv=0;
  for(let i=0;i<lvls.length;i++) if(xp>=lvls[i].t) lv=i;
  document.getElementById('xpLvl').textContent=lvls[lv].n;
  if(lv!==prevLevel){if(lv>=2) unlockAchievement('nivel3');if(lv>=5) unlockAchievement('nivel5');prevLevel=lv;}
}
function resetXP(){sfx('click');xp=0;updateXPBar();showToast('🔄 XP reiniciado a 0');}
function fin(id,showFX=true){
  if(!done.has(id)){
    done.add(id);
    const b=document.querySelector(`[data-s="${id}"]`);
    if(b) b.classList.add('done');
    if(showFX){sfx('up');launchConfetti();}
    saveProgress();
  }
}
function getProgress(){return Math.round((done.size/TOTAL_SECTIONS)*100);}

// ===================== NAV =====================
function go(id){
  sfx('click');
  document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav-t[role="tab"]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});
  document.getElementById(id).classList.add('active');
  const btn=document.querySelector(`[data-s="${id}"]`);
  if(btn){btn.classList.add('active');btn.setAttribute('aria-selected','true');}
  window.scrollTo({top:0,behavior:'smooth'});
  if(id==='s-sopa'){setTimeout(buildSopa,50);}
}

// ===================== FLASHCARD DATA =====================
const fcData=[
  {w:'Bosque Nublado',a:'🌫️ Bosque localizado entre <strong>2,000 y 3,000 m</strong> de altitud. Permanece cubierto de neblina. Almacena agua para los ríos y alberga orquídeas, bromelias y el <strong>quetzal</strong>. Principal ejemplo: Celaque.'},
  {w:'Bosque de Pino-Roble',a:'🌲 El <strong>bosque más extenso de Honduras</strong>. Cubre las zonas montañosas del interior. Susceptible a incendios forestales y a la <strong>plaga del gorgojo descortezador</strong>. Fuente de madera y resina.'},
  {w:'Bosque Latifoliado Tropical',a:'🌿 Bosque lluvioso del <strong>noreste de Honduras</strong>, en La Mosquitia. Dosel alto y biodiversidad enorme. Hogar de <strong>jaguares, tapires, tucanes</strong> y miles de especies. Parte de la mayor selva de Centroamérica.'},
  {w:'Manglares',a:'🌊 Ecosistema costero en las bocas de los ríos y bahías. Raíces sumergidas que sirven de <strong>criadero para peces y mariscos</strong>. Protegen las costas de huracanes. En peligro por la industria camaronera y el desarrollo costero.'},
  {w:'Reserva Biosfera Río Plátano',a:'🏞️ Declarada <strong>Patrimonio Natural de la Humanidad</strong> por la UNESCO en <strong>1982</strong>. Cubre <strong>832,000 hectáreas</strong> en La Mosquitia. Hogar de los pueblos <strong>Pech, Miskitu, Tawahka y Garífuna</strong>.'},
  {w:'Parque Nacional Celaque',a:'⛰️ Alberga el <strong>bosque nublado más grande de Honduras</strong>. El <strong>Cerro Las Minas (2,849 m)</strong> es el punto más alto del país. Nacimiento de 8 ríos importantes. Hábitat del puma y el quetzal.'},
  {w:'Parque Nacional La Tigra',a:'💧 <strong>Primera área protegida declarada de Honduras</strong> (1952). Ubicada en los alrededores de Tegucigalpa. Abastece el <strong>40% del agua potable</strong> de la capital. Bosque nublado muy bien conservado.'},
  {w:'SINAPH',a:'🗺️ <strong>Sistema Nacional de Áreas Protegidas de Honduras</strong>. Administra más de <strong>90 áreas protegidas</strong> en todo el país. Creado por la Ley General del Ambiente. Coordinado por el ICF (Instituto de Conservación Forestal).'},
  {w:'Corredor Biológico Mesoamericano',a:'🔗 Red de ecosistemas que <strong>conecta desde México hasta Colombia</strong>. Permite la migración de especies animales. Honduras aporta sus áreas protegidas y bosques como <strong>corredores de conectividad</strong>.'},
  {w:'Deforestación en Honduras',a:'🪓 Honduras pierde miles de hectáreas de bosque por año. Principales causas: <strong>ganadería extensiva, agricultura de subsistencia, tala ilegal e incendios forestales</strong>. Genera erosión, pérdida de agua y biodiversidad.'},
  {w:'Biodiversidad de Honduras',a:'🦜 Honduras es un <strong>hotspot mundial de biodiversidad</strong>. Tiene más de <strong>700 especies de aves</strong>, 200+ reptiles, 100+ anfibios y miles de plantas. Su posición en Mesoamérica la convierte en puente biológico.'},
  {w:'Quetzal',a:'🦜 Ave emblemática de los <strong>bosques nublados mesoamericanos</strong>. En Honduras habita principalmente en el Parque Nacional Celaque y La Muralla. Cola larga iridiscente verde. Símbolo cultural y espiritual ancestral.'},
  {w:'Manatí',a:'🐟 Mamífero acuático <strong>en peligro de extinción</strong> en Honduras. Vive en los ríos y costas del Atlántico. El <strong>Refugio de Vida Silvestre Cuero y Salado</strong>, en La Ceiba, es su principal santuario en el país.'},
  {w:'Jardín Botánico Lancetilla',a:'🌺 Ubicado en <strong>Tela, Atlántida</strong>. Es el <strong>jardín botánico más antiguo y grande de Centroamérica</strong>. Fundado en 1925 por la United Fruit Company. Colección de más de 1,200 especies vegetales tropicales.'},
  {w:'Bosque e Hidrología',a:'💧 Los bosques <strong>regulan el ciclo del agua</strong>. Sus raíces retienen la lluvia y alimentan los manantiales. Sin bosques, los ríos se secan en verano. El <strong>bosque nublado</strong> produce agua a partir de la neblina: es un bosque "captura-niebla".'},
];
let fcIdx=0;
function upFC(){
  document.getElementById('fcInner').classList.remove('flipped');
  document.getElementById('fcW').textContent=fcData[fcIdx].w;
  document.getElementById('fcA').innerHTML=fcData[fcIdx].a;
  document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length;
}
function flipCard(){
  sfx('flip');
  document.getElementById('fcInner').classList.toggle('flipped');
  if(!xpTracker.fc.has(fcIdx)){xpTracker.fc.add(fcIdx);pts(1);}
  if(xpTracker.fc.size===fcData.length){fin('s-flash');unlockAchievement('flash_master');}
}
function nextFC(){sfx('click');fcIdx=(fcIdx+1)%fcData.length;upFC();}
function prevFC(){sfx('click');fcIdx=(fcIdx-1+fcData.length)%fcData.length;upFC();}

// ===================== QUIZ DATA =====================
const qzData=[
  {q:'¿En qué año fue declarada la Reserva de Biosfera Río Plátano como Patrimonio de la Humanidad?',o:['a) 1975','b) 1982','c) 1990','d) 2001'],c:1},
  {q:'¿Cuál es el bosque más extenso de Honduras?',o:['a) Bosque nublado','b) Bosque de pino-roble','c) Manglar','d) Bosque seco tropical'],c:1},
  {q:'¿Qué porcentaje del agua potable de Tegucigalpa proviene del Parque Nacional La Tigra?',o:['a) 20%','b) 30%','c) 40%','d) 60%'],c:2},
  {q:'¿Cuál es el punto más alto de Honduras?',o:['a) Cerro El Picacho','b) Pico Bonito','c) Cerro Las Minas','d) Montaña El Boquerón'],c:2},
  {q:'¿Qué siglas identifican al sistema de áreas protegidas de Honduras?',o:['a) SERNA','b) SINAPH','c) COHDEFOR','d) ICF'],c:1},
  {q:'¿Cuáles son las principales causas de la deforestación en Honduras?',o:['a) Turismo y minería','b) Ganadería extensiva y tala ilegal','c) Urbanización y pesca','d) Industria textil y tecnología'],c:1},
  {q:'¿Dónde se ubica principalmente el Bosque Tropical Latifoliado de Honduras?',o:['a) Sur del país','b) Valle del Aguán','c) La Mosquitia','d) Valle de Comayagua'],c:2},
  {q:'¿Qué corredor une las áreas protegidas desde México hasta Colombia?',o:['a) Corredor Verde del Caribe','b) Corredor Andino','c) Corredor Biológico Mesoamericano','d) Reserva Maya'],c:2},
  {q:'¿Cuántas hectáreas protege aproximadamente la Reserva Río Plátano?',o:['a) 100,000 ha','b) 300,000 ha','c) 500,000 ha','d) 832,000 ha'],c:3},
  {q:'¿Qué ecosistema costero sirve de criadero para peces y protege costas de huracanes?',o:['a) Bosque nublado','b) Manglar','c) Bosque de pino','d) Páramo'],c:1},
  {q:'¿Cuál fue la primera área protegida declarada en Honduras?',o:['a) Parque Nacional Celaque','b) Reserva Río Plátano','c) Parque Nacional La Tigra','d) Lancetilla'],c:2},
  {q:'¿Qué especie emblemática de los bosques nublados mesoamericanos habita en Honduras?',o:['a) Jaguar','b) Manatí','c) Tapir','d) Quetzal'],c:3},
];
let qzIdx=0, qzSel=-1, qzDone=false;
function buildQz(){qzIdx=0;qzSel=-1;qzDone=false;showQz();}
function showQz(){
  if(qzIdx>=qzData.length){
    document.getElementById('qzQ').textContent='🎉 ¡Quiz completado!';
    document.getElementById('qzOpts').innerHTML='';
    fin('s-quiz');unlockAchievement('primer_quiz');return;
  }
  const q=qzData[qzIdx];
  document.getElementById('qzProg').textContent=`Pregunta ${qzIdx+1} de ${qzData.length}`;
  document.getElementById('qzQ').textContent=q.q;
  const opts=document.getElementById('qzOpts');opts.innerHTML='';
  q.o.forEach((o,i)=>{
    const b=document.createElement('button');b.className='qz-opt';b.textContent=o;
    b.onclick=()=>{if(qzDone)return;document.querySelectorAll('.qz-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');qzSel=i;sfx('click');};
    opts.appendChild(b);
  });
  qzDone=false;
}
function checkQz(){
  if(qzSel<0) return fb('fbQz','Selecciona una respuesta.',false);
  qzDone=true;
  const opts=document.querySelectorAll('.qz-opt');
  if(qzSel===qzData[qzIdx].c){
    opts[qzSel].classList.add('correct');
    fb('fbQz','¡Correcto! +5 XP',true);
    if(!xpTracker.qz.has(qzIdx)){xpTracker.qz.add(qzIdx);pts(5);}
    sfx('ok');
  }else{
    opts[qzSel].classList.add('wrong');opts[qzData[qzIdx].c].classList.add('correct');
    fb('fbQz','Incorrecto. Revisa la respuesta correcta.',false);sfx('no');
  }
  setTimeout(()=>{qzIdx++;qzSel=-1;showQz();},1600);
}
function resetQz(){sfx('click');qzIdx=0;qzSel=-1;qzDone=false;showQz();document.getElementById('fbQz').classList.remove('show');}

// ===================== CLASIFICACIÓN =====================
const classGroups=[
  {
    label:['Tipo de bosque','Área protegida'],headA:'🌲 Tipo de Bosque',headB:'🗺️ Área Protegida',colA:'bosque',colB:'area',
    words:[
      {w:'Bosque Nublado',t:'bosque'},{w:'Parque Celaque',t:'area'},{w:'Manglar',t:'bosque'},
      {w:'Reserva Río Plátano',t:'area'},{w:'Bosque de Pino',t:'bosque'},{w:'Parque La Tigra',t:'area'},
      {w:'Bosque Latifoliado',t:'bosque'},{w:'Lancetilla',t:'area'},{w:'Bosque Seco',t:'bosque'},{w:'Cuero y Salado',t:'area'}
    ]
  },
  {
    label:['Causa de deforestación','Consecuencia'],headA:'⚠️ Causa',headB:'💥 Consecuencia',colA:'causa',colB:'consecuencia',
    words:[
      {w:'Ganadería extensiva',t:'causa'},{w:'Erosión del suelo',t:'consecuencia'},{w:'Tala ilegal',t:'causa'},
      {w:'Pérdida de biodiversidad',t:'consecuencia'},{w:'Incendios forestales',t:'causa'},{w:'Ríos que se secan',t:'consecuencia'},
      {w:'Agricultura migratoria',t:'causa'},{w:'Inundaciones',t:'consecuencia'},{w:'Sobrepoblación de ganado',t:'causa'},{w:'Cambio climático local',t:'consecuencia'}
    ]
  },
  {
    label:['Flora del bosque','Fauna del bosque'],headA:'🌺 Flora',headB:'🦜 Fauna',colA:'flora',colB:'fauna',
    words:[
      {w:'Orquídea',t:'flora'},{w:'Quetzal',t:'fauna'},{w:'Bromelia',t:'flora'},
      {w:'Jaguar',t:'fauna'},{w:'Helecho arborescente',t:'flora'},{w:'Tapir',t:'fauna'},
      {w:'Ceiba',t:'flora'},{w:'Manatí',t:'fauna'},{w:'Caoba',t:'flora'},{w:'Puma',t:'fauna'}
    ]
  },
  {
    label:['Bosque Nublado','Bosque Latifoliado'],headA:'🌫️ Bosque Nublado',headB:'🌿 Bosque Latifoliado',colA:'nublado',colB:'latifol',
    words:[
      {w:'Celaque',t:'nublado'},{w:'La Mosquitia',t:'latifol'},{w:'Quetzal',t:'nublado'},
      {w:'Jaguar',t:'latifol'},{w:'Captura neblina',t:'nublado'},{w:'Mayor dosel',t:'latifol'},
      {w:'2,000–3,000 m',t:'nublado'},{w:'Nivel del mar',t:'latifol'},{w:'Bromelias',t:'nublado'},{w:'Tapir',t:'latifol'}
    ]
  },
];
let currentClassGroupIdx=0;
let clsSelectedWord=null;

function buildClass(){
  const group=classGroups[currentClassGroupIdx];
  document.getElementById('col-left-head').textContent=group.headA;
  document.getElementById('col-right-head').textContent=group.headB;
  const bank=document.getElementById('clsBank');bank.innerHTML='';
  clsSelectedWord=null;
  document.getElementById('items-left').innerHTML='';
  document.getElementById('items-right').innerHTML='';
  _shuffle([...group.words]).forEach(w=>{
    const el=document.createElement('div');el.className='wb-item';el.textContent=w.w;el.dataset.t=w.t;
    el.onclick=()=>{document.querySelectorAll('.wb-item').forEach(i=>i.classList.remove('sel-word'));el.classList.add('sel-word');clsSelectedWord=el;sfx('click');};
    bank.appendChild(el);
  });
  ['col-left','col-right'].forEach(colId=>{
    const col=document.getElementById(colId);
    col.onclick=(e)=>{
      if(!clsSelectedWord||e.target.classList.contains('drop-item')) return;
      const targetId=colId==='col-left'?'items-left':'items-right';
      const wordsCol=document.getElementById(targetId);
      const item=document.createElement('div');item.className='drop-item';
      item.textContent=clsSelectedWord.textContent;item.dataset.t=clsSelectedWord.dataset.t;
      const original=clsSelectedWord;
      item.onclick=(ev)=>{
        ev.stopPropagation();
        if(clsSelectedWord!==null){col.click();}
        else{document.getElementById('clsBank').appendChild(original);original.classList.remove('sel-word');item.remove();if(typeof sfx==='function')sfx('click');}
      };
      wordsCol.appendChild(item);clsSelectedWord.remove();clsSelectedWord=null;sfx('click');
    };
  });
}
function checkClass(){
  const remaining=document.querySelectorAll('#clsBank .wb-item').length;
  if(remaining>0){fb('fbCls','Mueve todas las palabras a las columnas primero.',false);return;}
  const group=classGroups[currentClassGroupIdx];let allOk=true;
  document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{
    const inLeft=el.parentElement.id==='items-left';
    const expectedType=inLeft?group.colA:group.colB;
    if(el.dataset.t===expectedType){el.classList.add('cls-ok');}else{el.classList.add('cls-no');allOk=false;}
  });
  if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);}
  if(allOk){fb('fbCls','¡Perfecto! +5 XP',true);sfx('fan');fin('s-clasifica');unlockAchievement('clasif_pro');}
  else{fb('fbCls','Hay errores. Marcados en rojo.',false);sfx('no');}
}
function nextClassGroup(){
  sfx('click');
  currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length;
  buildClass();document.getElementById('fbCls').classList.remove('show');
  showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]);
}
function resetClass(){sfx('click');buildClass();document.getElementById('fbCls').classList.remove('show');}

// ===================== IDENTIFICAR =====================
const idData=[
  {s:['El','bosque','nublado','almacena','el','agua','para','los','ríos.'],c:2,art:'Tipo de bosque que regula el agua'},
  {s:['La','Reserva','Río','Plátano','es','Patrimonio','de','la','Humanidad.'],c:5,art:'Reconocimiento internacional de la UNESCO'},
  {s:['El','Cerro','Las','Minas','es','el','punto','más','alto','de','Honduras.'],c:2,art:'Punto más alto del país'},
  {s:['El','manglar','protege','las','costas','de','los','huracanes.'],c:1,art:'Ecosistema costero protector'},
  {s:['El','SINAPH','protege','más','de','90','áreas','en','Honduras.'],c:1,art:'Sistema nacional de áreas protegidas'},
  {s:['El','quetzal','vive','en','los','bosques','nublados','de','Honduras.'],c:1,art:'Ave emblemática de los bosques nublados'},
  {s:['La','deforestación','provoca','erosión','y','pérdida','de','agua.'],c:1,art:'Principal amenaza al bosque hondureño'},
  {s:['El','Corredor','Biológico','Mesoamericano','conecta','México','con','Colombia.'],c:2,art:'Nombre del corredor de ecosistemas'},
  {s:['La','Tigra','abastece','el','40%','del','agua','de','Tegucigalpa.'],c:1,art:'Parque nacional que provee agua a la capital'},
  {s:['El','manatí','habita','en','Cuero','y','Salado','en','Honduras.'],c:1,art:'Mamífero acuático en peligro'},
];
let idIdx=0;
let idDone=false;
function showId(){
  idDone=false;
  if(idIdx>=idData.length){
    document.getElementById('idSent').innerHTML='🎉 ¡Completado!';
    fin('s-identifica');unlockAchievement('id_master');return;
  }
  const d=idData[idIdx];
  document.getElementById('idProg').textContent=`Oración ${idIdx+1} de ${idData.length}`;
  document.getElementById('idInfo').textContent=`Busca: ${d.art}`;
  const sent=document.getElementById('idSent');sent.innerHTML='';
  d.s.forEach((w,i)=>{
    const span=document.createElement('span');span.className='id-word';span.textContent=w+' ';
    span.onclick=()=>checkId(i,span);
    sent.appendChild(span);
  });
}
function checkId(i,span){
  if(idDone) return;
  document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected'));
  span.classList.add('selected');
  if(i===idData[idIdx].c){
    idDone=true;
    span.classList.add('id-ok');fb('fbId','¡Correcto! +5 XP',true);
    if(!xpTracker.id.has(idIdx)){xpTracker.id.add(idIdx);pts(5);}
    sfx('ok');
  }else{
    span.classList.add('id-no');fb('fbId','Ese no es el término solicitado.',false);sfx('no');
  }
}
function nextId(){sfx('click');idIdx++;showId();document.getElementById('fbId').classList.remove('show');}
function resetId(){sfx('click');idIdx=0;showId();document.getElementById('fbId').classList.remove('show');}

// ===================== COMPLETA =====================
const cmpData=[
  {s:'La Reserva de Biosfera Río Plátano fue declarada Patrimonio de la Humanidad en ___ .',opts:['1972','1982','2001'],c:1},
  {s:'El bosque ___ es el más extenso de Honduras.',opts:['nublado','de pino-roble','de manglar'],c:1},
  {s:'El Corredor Biológico ___ conecta ecosistemas desde México hasta Colombia.',opts:['Andino','Amazónico','Mesoamericano'],c:2},
  {s:'El Parque Nacional ___ fue la primera área protegida de Honduras.',opts:['Celaque','La Tigra','Río Plátano'],c:1},
  {s:'El ___ es el punto más alto de Honduras con 2,849 metros.',opts:['Pico Bonito','Cerro Las Minas','Monte Celaque'],c:1},
  {s:'Los manglares protegen las costas principalmente de los ___.',opts:['terremotos','huracanes','tsunamis'],c:1},
  {s:'La principal causa de deforestación en Honduras es la ___.',opts:['minería','ganadería extensiva','pesca industrial'],c:1},
  {s:'El bosque nublado tiene importancia hídrica porque ___ el agua.',opts:['contamina','almacena','drena'],c:1},
];
let cmpIdx=0, cmpSel=-1, cmpDone=false;
function showCmp(){
  if(cmpIdx>=cmpData.length){
    document.getElementById('cmpSent').innerHTML='🎉 ¡Completado!';
    document.getElementById('cmpOpts').innerHTML='';
    fin('s-completa');return;
  }
  const d=cmpData[cmpIdx];
  document.getElementById('cmpProg').textContent=`Oración ${cmpIdx+1} de ${cmpData.length}`;
  document.getElementById('cmpSent').innerHTML=d.s.replace('___','<span class="blank">___</span>');
  const opts=document.getElementById('cmpOpts');opts.innerHTML='';cmpSel=-1;cmpDone=false;
  d.opts.forEach((o,i)=>{
    const b=document.createElement('button');b.className='cmp-opt';b.textContent=o;
    b.onclick=()=>{if(cmpDone)return;document.querySelectorAll('.cmp-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');cmpSel=i;sfx('click');};
    opts.appendChild(b);
  });
}
function checkCmp(){
  if(cmpSel<0) return fb('fbCmp','Selecciona una opción.',false);
  cmpDone=true;
  const opts=document.querySelectorAll('.cmp-opt');
  if(cmpSel===cmpData[cmpIdx].c){
    opts[cmpSel].classList.add('correct');
    document.getElementById('cmpSent').innerHTML=cmpData[cmpIdx].s.replace('___',`<span class="blank" style="color:var(--jade);border-color:var(--jade)">${opts[cmpSel].textContent}</span>`);
    fb('fbCmp','¡Correcto! +5 XP',true);
    if(!xpTracker.cmp.has(cmpIdx)){xpTracker.cmp.add(cmpIdx);pts(5);}
    sfx('ok');
  }else{
    opts[cmpSel].classList.add('wrong');opts[cmpData[cmpIdx].c].classList.add('correct');
    fb('fbCmp','Incorrecto. Revisa bien la respuesta.',false);sfx('no');
  }
  setTimeout(()=>{cmpIdx++;document.getElementById('fbCmp').classList.remove('show');showCmp();},1600);
}

// ===================== RETO FINAL =====================
const retoPairs=[
  {
    label:['Tipo de Bosque','Área Protegida'],btnA:'🌲 Tipo Bosque',btnB:'🗺️ Área Protegida',colA:'bosque',colB:'area',
    words:[
      {w:'Bosque Nublado',t:'bosque'},{w:'Parque Celaque',t:'area'},{w:'Manglar',t:'bosque'},
      {w:'Reserva Río Plátano',t:'area'},{w:'Bosque de Pino',t:'bosque'},{w:'Parque La Tigra',t:'area'},
      {w:'Bosque Latifoliado',t:'bosque'},{w:'Cuero y Salado',t:'area'},{w:'Bosque Seco',t:'bosque'},{w:'Lancetilla',t:'area'},
    ]
  },
  {
    label:['Flora','Fauna'],btnA:'🌺 Flora',btnB:'🦜 Fauna',colA:'flora',colB:'fauna',
    words:[
      {w:'Orquídea',t:'flora'},{w:'Quetzal',t:'fauna'},{w:'Caoba',t:'flora'},
      {w:'Jaguar',t:'fauna'},{w:'Bromelia',t:'flora'},{w:'Tapir',t:'fauna'},
      {w:'Ceiba',t:'flora'},{w:'Manatí',t:'fauna'},{w:'Helecho',t:'flora'},{w:'Puma',t:'fauna'},
    ]
  },
];
let currentRetoPairIdx=0;
let retoPool=[], retoOk=0, retoErr=0, retoTimerInt=null, retoSec=30, retoRunning=false, retoCurrent=null;

function updateRetoButtons(){
  const pair=retoPairs[currentRetoPairIdx];
  document.querySelectorAll('.reto-btns .btn')[0].textContent=pair.btnA;
  document.querySelectorAll('.reto-btns .btn')[1].textContent=pair.btnB;
  document.querySelectorAll('.reto-btns .btn')[0].onclick=()=>ansReto(pair.colA);
  document.querySelectorAll('.reto-btns .btn')[1].onclick=()=>ansReto(pair.colB);
}
function startReto(){
  if(retoRunning) return;
  sfx('click');retoRunning=true;retoOk=0;retoErr=0;retoSec=30;
  retoPool=_shuffle([...retoPairs[currentRetoPairIdx].words,...retoPairs[currentRetoPairIdx].words]);
  showRetoWord();
  retoTimerInt=setInterval(()=>{
    retoSec--;sfx('tick');
    document.getElementById('retoTimer').textContent='⏱ '+retoSec;
    if(retoSec<=10) document.getElementById('retoTimer').style.color='var(--red)';
    if(retoSec<=0){clearInterval(retoTimerInt);endReto();}
  },1000);
}
function showRetoWord(){
  if(retoPool.length===0) retoPool=_shuffle([...retoPairs[currentRetoPairIdx].words,...retoPairs[currentRetoPairIdx].words]);
  retoCurrent=retoPool.pop();
  document.getElementById('retoWord').textContent=retoCurrent.w;
}
function ansReto(t){
  if(!retoRunning||!retoCurrent) return;
  const firstPlay=!xpTracker.reto.has(currentRetoPairIdx);
  if(t===retoCurrent.t){sfx('ok');retoOk++;if(firstPlay) pts(1);}
  else{sfx('no');retoErr++;if(firstPlay) pts(-1);}
  document.getElementById('retoScore').textContent=`✅ ${retoOk} correctas | ❌ ${retoErr} errores`;
  showRetoWord();
}
function endReto(){
  retoRunning=false;
  document.getElementById('retoWord').textContent='🏁 ¡Tiempo!';
  document.getElementById('retoTimer').style.color='var(--pri)';
  xpTracker.reto.add(currentRetoPairIdx);
  const total=retoOk+retoErr;
  const pct=total>0?Math.round((retoOk/total)*100):0;
  fb('fbReto',`Resultado: ${retoOk}/${total} (${pct}%) ¡Bien hecho!`,true);
  fin('s-reto');sfx('fan');unlockAchievement('reto_hero');
}
function nextRetoPair(){
  sfx('click');clearInterval(retoTimerInt);retoRunning=false;retoSec=30;retoOk=0;retoErr=0;
  currentRetoPairIdx=(currentRetoPairIdx+1)%retoPairs.length;
  updateRetoButtons();
  document.getElementById('retoTimer').textContent='⏱ 30';
  document.getElementById('retoTimer').style.color='var(--pri)';
  document.getElementById('retoWord').textContent='¡Prepárate!';
  document.getElementById('retoScore').textContent='✅ 0 correctas | ❌ 0 errores';
  document.getElementById('fbReto').classList.remove('show');
  showToast(`🔄 Pareja: ${retoPairs[currentRetoPairIdx].label[0]} vs ${retoPairs[currentRetoPairIdx].label[1]}`);
}
function resetReto(){
  sfx('click');clearInterval(retoTimerInt);retoRunning=false;retoSec=30;retoOk=0;retoErr=0;
  document.getElementById('retoTimer').textContent='⏱ 30';
  document.getElementById('retoTimer').style.color='var(--pri)';
  document.getElementById('retoWord').textContent='¡Prepárate!';
  document.getElementById('retoScore').textContent='✅ 0 correctas | ❌ 0 errores';
  document.getElementById('fbReto').classList.remove('show');
}

// ===================== TASK GENERATOR =====================
const identifyTaskDB=[
  {s:'El bosque nublado de Honduras almacena agua en la neblina y la libera a los ríos todo el año.',type:'Función hídrica del bosque nublado'},
  {s:'La Reserva de Biosfera Río Plátano fue declarada Patrimonio de la Humanidad por la UNESCO en 1982.',type:'Patrimonio Natural de la Humanidad (1982)'},
  {s:'El SINAPH administra más de 90 áreas protegidas en todo el territorio hondureño.',type:'Sistema Nacional de Áreas Protegidas'},
  {s:'El Cerro Las Minas, en el Parque Nacional Celaque, es el punto más alto de Honduras con 2,849 metros.',type:'Punto más alto de Honduras (2,849 m)'},
  {s:'El Corredor Biológico Mesoamericano conecta ecosistemas y permite la migración de especies desde México hasta Colombia.',type:'Red de corredores ecológicos de Mesoamérica'},
  {s:'Los manglares son ecosistemas costeros que sirven de criadero para peces y protegen las costas de los huracanes.',type:'Importancia ecológica de los manglares'},
  {s:'La deforestación en Honduras tiene como causas principales la ganadería extensiva, la tala ilegal y los incendios forestales.',type:'Causas de la deforestación hondureña'},
  {s:'El quetzal es el ave emblemática de los bosques nublados de Centroamérica y habita en Honduras.',type:'Especie emblema del bosque nublado'},
  {s:'El Parque Nacional La Tigra fue la primera área protegida declarada en Honduras y provee el 40% del agua de Tegucigalpa.',type:'Primera área protegida; fuente de agua capital'},
  {s:'Honduras es un hotspot de biodiversidad mundial con más de 700 especies de aves y miles de plantas únicas.',type:'Honduras: hotspot de biodiversidad mundial'},
];
const classifyTaskDB=[
  {w:'Bosque Nublado',gen:'Tipo de bosque',n:'2,000–3,000 m altitud',g:'Montañas de Honduras',t:'Regula agua; hábitat del quetzal'},
  {w:'Bosque de Pino-Roble',gen:'Tipo de bosque',n:'El más extenso',g:'Zonas montañosas del interior',t:'Madera, resina; susceptible al gorgojo'},
  {w:'Bosque Latifoliado',gen:'Tipo de bosque',n:'Altura: nivel del mar',g:'La Mosquitia, noreste',t:'Mayor biodiversidad; jaguar, tapir'},
  {w:'Manglar',gen:'Ecosistema costero',n:'Zona intermareal',g:'Costas del Atlántico y Pacífico',t:'Criadero de peces; protección costera'},
  {w:'Parque Nacional Celaque',gen:'Área protegida',n:'2,849 m (Cerro Las Minas)',g:'Ocotepeque y Copán',t:'Bosque nublado más alto; puma, quetzal'},
  {w:'Reserva Río Plátano',gen:'Área protegida',n:'832,000 ha',g:'La Mosquitia, Gracias a Dios',t:'Patrimonio UNESCO 1982; pueblos indígenas'},
  {w:'Parque Nacional La Tigra',gen:'Área protegida',n:'7,571 ha',g:'Tegucigalpa, Francisco Morazán',t:'Primera área protegida; 40% agua potable capital'},
  {w:'Corredor Biológico Mesoamericano',gen:'Red de ecosistemas',n:'México a Colombia',g:'Mesoamérica',t:'Conecta áreas protegidas; permite migración animal'},
];
const completeTaskDB=[
  {s:'El bosque ___ es el más extenso de Honduras.',opts:['nublado','de pino-roble','latifoliado'],ans:'de pino-roble'},
  {s:'La Reserva Río Plátano fue declarada Patrimonio de la Humanidad en ___.',opts:['1972','1982','2001'],ans:'1982'},
  {s:'El SINAPH es el ___ de Áreas Protegidas de Honduras.',opts:['Servicio','Sistema Nacional','Secretaría'],ans:'Sistema Nacional'},
  {s:'El Cerro Las Minas tiene ___ metros de altura.',opts:['2,649','2,849','3,049'],ans:'2,849'},
  {s:'Los manglares protegen las costas principalmente de los ___.',opts:['terremotos','incendios','huracanes'],ans:'huracanes'},
  {s:'La principal causa de deforestación en Honduras es la ___ extensiva.',opts:['ganadería','pesca','minería'],ans:'ganadería'},
  {s:'El bosque nublado ___ el agua de la neblina.',opts:['drena','contamina','captura'],ans:'captura'},
  {s:'El Corredor Biológico Mesoamericano conecta ecosistemas desde México hasta ___.',opts:['Honduras','Ecuador','Colombia'],ans:'Colombia'},
];
const explainQuestions=[
  {q:'¿Cuáles son los cuatro principales tipos de bosque de Honduras? Describe brevemente cada uno.',ans:'Bosque nublado (montañas, neblina, quetzal); Bosque de pino-roble (más extenso, interior); Bosque latifoliado tropical (Mosquitia, jaguar); Manglares (costas, criadero de peces).'},
  {q:'¿Por qué es importante la Reserva de Biosfera Río Plátano para Honduras y el mundo? Menciona al menos tres razones.',ans:'Es Patrimonio UNESCO (1982); protege 832,000 ha; hogar de 4 pueblos indígenas; mayor biodiversidad de Centroamérica; conecta el Corredor Biológico Mesoamericano.'},
  {q:'¿Qué es el Corredor Biológico Mesoamericano y cuál es su importancia para Honduras?',ans:'Es una red de ecosistemas que va de México a Colombia. Permite la migración de animales. Honduras aporta sus bosques y áreas protegidas como zonas de conectividad entre el norte y sur del continente.'},
  {q:'¿Cuáles son las principales causas y consecuencias de la deforestación en Honduras?',ans:'Causas: ganadería extensiva, tala ilegal, agricultura migratoria, incendios forestales. Consecuencias: erosión del suelo, ríos que se secan, pérdida de biodiversidad, cambio climático local, inundaciones.'},
  {q:'¿Por qué el bosque nublado es tan importante para el suministro de agua en Honduras?',ans:'El bosque nublado captura el agua de la neblina a través de hojas y musgo. La libera gradualmente a los ríos durante todo el año. El Parque La Tigra, por ejemplo, provee el 40% del agua potable de Tegucigalpa.'},
];
let ansVisible=false;

function genTask(){
  sfx('click');
  const type=document.getElementById('tgType').value;
  const count=parseInt(document.getElementById('tgCount').value);
  ansVisible=false;
  const out=document.getElementById('tgOut');out.innerHTML='';
  if(type==='identify') genIdentifyTask(out,count);
  else if(type==='classify') genClassifyTask(out,count);
  else if(type==='complete') genCompleteTask(out,count);
  else if(type==='explain') genExplainTask(out,count);
  fin('s-tareas');
}
function _instrBlock(out,title,lines){
  const ib=document.createElement('div');ib.className='tg-instruction-block';
  ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join('');
  out.appendChild(ib);
}
function genIdentifyTask(out,count){
  _instrBlock(out,'Instrucción',['Copia en tu cuaderno; subraya, colorea o encierra el concepto ambiental indicado en cada oración. Escribe al lado qué tipo de elemento es.','<strong>Ejemplo:</strong> El quetzal vive en el bosque nublado. → <span style="color:var(--jade);font-weight:700;">Ave del bosque nublado</span>']);
  _pick(identifyTaskDB,Math.min(count,identifyTaskDB.length)).forEach((item,i)=>{
    const div=document.createElement('div');div.className='tg-task';
    div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.type}</div></div>`;
    out.appendChild(div);
  });
}
function genClassifyTask(out,count){
  _instrBlock(out,'Instrucción',['Copia la siguiente tabla en tu cuaderno. Para cada elemento del bosque u área protegida, completa su tipo, extensión, ubicación y función.']);
  const items=_pick(classifyTaskDB,Math.min(count,classifyTaskDB.length));
  const wrap=document.createElement('div');wrap.style.overflowX='auto';
  const th=(t,extra='')=>`<th style="padding:0.3rem 0.4rem;border:1px solid var(--border);font-size:0.72rem;text-align:center;${extra}">${t}</th>`;
  let html=`<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:520px;"><thead><tr style="background:var(--pri-gl);">${th('Elemento','text-align:left;')}${th('Tipo')}${th('Extensión')}${th('Ubicación')}${th('Función')}
  </tr></thead><tbody>`;
  items.forEach(it=>{
    html+=`<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td>`+Array(4).fill(`<td style="padding:0.4rem;border:1px solid var(--border);min-width:50px;"></td>`).join('')+'</tr>';
  });
  html+='</tbody></table>';
  wrap.innerHTML=html;out.appendChild(wrap);
  const ans=document.createElement('div');ans.className='tg-answer';ans.style.marginTop='0.8rem';
  ans.innerHTML='<strong>✅ Respuestas:</strong><br>'+items.map(it=>`<strong>${it.w}:</strong> Tipo: ${it.gen} | Extensión: ${it.n} | Ubicación: ${it.g} | Función: ${it.t}`).join('<br>');
  out.appendChild(ans);
}
function genCompleteTask(out,count){
  _instrBlock(out,'Instrucción',['Copia y resuelve en tu cuaderno. Cada oración tiene un espacio ___. Elige y escribe la opción correcta.']);
  const pool=_shuffle([...completeTaskDB]);
  for(let i=0;i<count;i++){
    const item=pool[i%pool.length];
    const div=document.createElement('div');div.className='tg-task';
    const sent=item.s.replace('___','<span class="tg-blank" style="min-width:90px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');
    div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${sent}</strong><div style="margin-top:0.4rem;font-size:0.82rem;color:var(--gray);">📝 Opciones: <strong>${item.opts.join(' | ')}</strong></div><div class="tg-answer">✅ ${item.ans}</div></div>`;
    out.appendChild(div);
  }
}
function genExplainTask(out,count){
  _instrBlock(out,'Instrucción',['Copia las siguientes preguntas en tu cuaderno y responde cada una de forma clara y completa.']);
  const pool=_shuffle([...explainQuestions]);
  for(let i=0;i<count;i++){
    const item=pool[i%pool.length];
    const div=document.createElement('div');div.className='tg-task';
    div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.3rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.ans}</div></div>`;
    out.appendChild(div);
  }
}
function toggleAns(){ansVisible=!ansVisible;document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none');sfx('click');}

// ===================== SOPA DE LETRAS =====================
const sopaSets=[
  {
    size:10,
    grid:[
      ['B','O','S','Q','U','E','X','Y','Z','P'],
      ['A','B','C','D','E','F','G','H','I','I'],
      ['J','K','L','M','N','O','P','Q','R','N'],
      ['M','A','N','G','L','A','R','S','T','O'],
      ['U','V','W','X','Y','Z','A','B','C','D'],
      ['C','E','L','A','Q','U','E','F','G','H'],
      ['I','J','K','L','M','N','O','P','Q','R'],
      ['T','I','G','R','A','S','T','U','V','W'],
      ['X','Y','Z','A','B','C','D','E','F','G'],
      ['P','L','A','T','A','N','O','H','I','J']
    ],
    words:[
      {w:'BOSQUE',cells:[[0,0],[0,1],[0,2],[0,3],[0,4],[0,5]]},
      {w:'PINO',  cells:[[0,9],[1,9],[2,9],[3,9]]},
      {w:'MANGLAR',cells:[[3,0],[3,1],[3,2],[3,3],[3,4],[3,5],[3,6]]},
      {w:'CELAQUE',cells:[[5,0],[5,1],[5,2],[5,3],[5,4],[5,5],[5,6]]},
      {w:'TIGRA', cells:[[7,0],[7,1],[7,2],[7,3],[7,4]]},
      {w:'PLATANO',cells:[[9,0],[9,1],[9,2],[9,3],[9,4],[9,5],[9,6]]}
    ]
  },
  {
    size:10,
    grid:[
      ['N','U','B','L','A','D','O','X','Y','F'],
      ['A','B','C','D','E','F','G','H','I','L'],
      ['F','A','U','N','A','J','K','L','M','O'],
      ['N','O','P','Q','R','S','T','U','V','R'],
      ['S','I','N','A','P','H','W','X','Y','A'],
      ['Z','A','B','C','D','E','F','G','H','I'],
      ['C','O','R','R','E','D','O','R','J','K'],
      ['L','M','N','O','P','Q','R','S','T','U'],
      ['V','W','X','Y','Z','A','B','C','D','E'],
      ['P','I','N','O','F','G','H','I','J','K']
    ],
    words:[
      {w:'NUBLADO', cells:[[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6]]},
      {w:'FLORA',   cells:[[0,9],[1,9],[2,9],[3,9],[4,9]]},
      {w:'FAUNA',   cells:[[2,0],[2,1],[2,2],[2,3],[2,4]]},
      {w:'SINAPH',  cells:[[4,0],[4,1],[4,2],[4,3],[4,4],[4,5]]},
      {w:'CORREDOR',cells:[[6,0],[6,1],[6,2],[6,3],[6,4],[6,5],[6,6],[6,7]]},
      {w:'PINO',    cells:[[9,0],[9,1],[9,2],[9,3]]}
    ]
  }
];
let currentSopaSetIdx=0, sopaFoundWords=new Set();
let sopaFirstClickCell=null, sopaPointerStartCell=null, sopaPointerMoved=false, sopaSelectedCells=[];

function getSopaCellSize(){
  const container=document.getElementById('sopaGrid');
  if(!container||!container.parentElement) return 28;
  const avail=container.parentElement.clientWidth-16;
  const set=sopaSets[currentSopaSetIdx];
  return Math.max(20,Math.min(32,Math.floor(avail/set.size)));
}
function buildSopa(){
  const set=sopaSets[currentSopaSetIdx];
  const grid=document.getElementById('sopaGrid');grid.innerHTML='';
  const sz=getSopaCellSize();
  grid.style.gridTemplateColumns=`repeat(${set.size},${sz}px)`;
  grid.style.gridTemplateRows=`repeat(${set.size},${sz}px)`;
  sopaFirstClickCell=null;sopaSelectedCells=[];
  for(let r=0;r<set.size;r++) for(let c=0;c<set.size;c++){
    const cell=document.createElement('div');cell.className='sopa-cell';
    cell.style.width=sz+'px';cell.style.height=sz+'px';
    cell.style.fontSize=Math.max(11,sz-10)+'px';
    cell.textContent=set.grid[r][c];cell.dataset.row=r;cell.dataset.col=c;
    const alreadyFound=set.words.find(w=>sopaFoundWords.has(w.w)&&w.cells.some(([wr,wc])=>wr===r&&wc===c));
    if(alreadyFound) cell.classList.add('sopa-found');
    grid.appendChild(cell);
  }
  setupSopaEvents();
  const wl=document.getElementById('sopaWords');wl.innerHTML='';
  set.words.forEach(wObj=>{
    const sp=document.createElement('span');sp.className='sopa-w'+(sopaFoundWords.has(wObj.w)?' found':'');
    sp.id='sw-'+wObj.w;sp.textContent=wObj.w;wl.appendChild(sp);
  });
}
function setupSopaEvents(){
  const grid=document.getElementById('sopaGrid');
  grid.onpointerdown=e=>{
    const cell=e.target.closest('.sopa-cell');if(!cell) return;
    e.preventDefault();grid.setPointerCapture(e.pointerId);
    sopaPointerStartCell=cell;sopaPointerMoved=false;
    cell.classList.add('sopa-sel');sopaSelectedCells=[cell];
  };
  grid.onpointermove=e=>{
    if(!sopaPointerStartCell) return;e.preventDefault();
    const el=document.elementFromPoint(e.clientX,e.clientY);
    const cell=el?el.closest('.sopa-cell'):null;if(!cell) return;
    const sr=parseInt(sopaPointerStartCell.dataset.row),sc=parseInt(sopaPointerStartCell.dataset.col);
    const er=parseInt(cell.dataset.row),ec=parseInt(cell.dataset.col);
    if(sr!==er||sc!==ec) sopaPointerMoved=true;
    document.querySelectorAll('.sopa-cell.sopa-sel').forEach(c=>c.classList.remove('sopa-sel'));
    sopaSelectedCells=[];
    getSopaPath(sr,sc,er,ec).forEach(([r,c])=>{
      const pc=document.querySelector(`#sopaGrid [data-row="${r}"][data-col="${c}"]`);
      if(pc){pc.classList.add('sopa-sel');sopaSelectedCells.push(pc);}
    });
  };
  grid.onpointerup=e=>{
    if(!sopaPointerStartCell) return;e.preventDefault();
    grid.releasePointerCapture(e.pointerId);
    if(sopaPointerMoved&&sopaSelectedCells.length>1){
      checkSopaSelection();
    }else{
      const cell=sopaPointerStartCell;
      document.querySelectorAll('.sopa-cell.sopa-sel').forEach(c=>c.classList.remove('sopa-sel'));
      sopaSelectedCells=[];
      if(!sopaFirstClickCell){sopaFirstClickCell=cell;cell.classList.add('sopa-start');}
      else if(sopaFirstClickCell===cell){cell.classList.remove('sopa-start');sopaFirstClickCell=null;}
      else{
        const sr=parseInt(sopaFirstClickCell.dataset.row),sc=parseInt(sopaFirstClickCell.dataset.col);
        const er=parseInt(cell.dataset.row),ec=parseInt(cell.dataset.col);
        sopaFirstClickCell.classList.remove('sopa-start');sopaFirstClickCell=null;
        getSopaPath(sr,sc,er,ec).forEach(([r,c])=>{
          const pc=document.querySelector(`#sopaGrid [data-row="${r}"][data-col="${c}"]`);
          if(pc){pc.classList.add('sopa-sel');sopaSelectedCells.push(pc);}
        });
        checkSopaSelection();
      }
    }
    sopaPointerStartCell=null;sopaPointerMoved=false;
  };
}
function getSopaPath(r1,c1,r2,c2){
  const dr=Math.sign(r2-r1),dc=Math.sign(c2-c1);
  const lr=Math.abs(r2-r1),lc=Math.abs(c2-c1);
  if(lr!==0&&lc!==0&&lr!==lc) return[[r1,c1]];
  const len=Math.max(lr,lc);const path=[];
  for(let i=0;i<=len;i++) path.push([r1+dr*i,c1+dc*i]);
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
    const sp=document.getElementById('sw-'+found.w);if(sp) sp.classList.add('found');
    if(!xpTracker.sopa.has(found.w)){xpTracker.sopa.add(found.w);pts(1);}
    sfx('ok');
    if(sopaFoundWords.size===set.words.length){fin('s-sopa');sfx('fan');showToast('🎉 ¡Todas las palabras encontradas!');}
    else showToast('✅ ¡Encontraste: '+found.w+'!');
  }else sfx('no');
  document.querySelectorAll('.sopa-cell.sopa-sel').forEach(c=>c.classList.remove('sopa-sel'));
  sopaSelectedCells=[];
}
function nextSopaSet(){
  sfx('click');sopaFoundWords=new Set();
  currentSopaSetIdx=(currentSopaSetIdx+1)%sopaSets.length;
  buildSopa();showToast('🔄 Nueva sopa cargada');
}
let _sopaResizeTimer=null;
window.addEventListener('resize',()=>{
  clearTimeout(_sopaResizeTimer);_sopaResizeTimer=setTimeout(()=>{if(document.getElementById('s-sopa').classList.contains('active')) buildSopa();},200);
});

// ===================== EVALUACIÓN FINAL =====================
const evalTFBank=[
  {q:'El bosque de pino-roble es el más extenso de Honduras.',a:true},
  {q:'La Reserva de Biosfera Río Plátano fue declarada Patrimonio UNESCO en 1990.',a:false},
  {q:'El Cerro Las Minas es el punto más alto de Honduras con 2,849 metros.',a:true},
  {q:'Los manglares protegen las costas de los huracanes.',a:true},
  {q:'El SINAPH administra más de 90 áreas protegidas en Honduras.',a:true},
  {q:'El jaguar es el ave emblemática de los bosques nublados.',a:false},
  {q:'El Parque Nacional La Tigra fue la primera área protegida declarada en Honduras.',a:true},
  {q:'La ganadería extensiva es la principal causa de deforestación en Honduras.',a:true},
  {q:'El Corredor Biológico Mesoamericano conecta ecosistemas desde México hasta Brasil.',a:false},
  {q:'El quetzal habita en los bosques nublados de Honduras.',a:true},
  {q:'El manatí en Honduras vive principalmente en el Refugio de Vida Silvestre Cuero y Salado.',a:true},
  {q:'El bosque latifoliado tropical se encuentra principalmente en el sur de Honduras.',a:false},
  {q:'La deforestación provoca erosión del suelo y pérdida de biodiversidad.',a:true},
  {q:'Lancetilla es el jardín botánico más antiguo y grande de Centroamérica.',a:true},
  {q:'El bosque nublado produce agua al capturar la neblina.',a:true},
];
const evalMCBank=[
  {q:'¿Cuál es el bosque más extenso de Honduras?',o:['a) Bosque nublado','b) Manglar','c) Bosque de pino-roble','d) Bosque seco tropical'],a:2},
  {q:'¿En qué año fue declarada la Reserva Río Plátano como Patrimonio UNESCO?',o:['a) 1972','b) 1982','c) 1990','d) 2001'],a:1},
  {q:'¿Cuál es el punto más alto de Honduras?',o:['a) Pico Bonito','b) Cerro El Picacho','c) Cerro Las Minas','d) Monte Uyuca'],a:2},
  {q:'¿Cuántas hectáreas cubre aproximadamente la Reserva Río Plátano?',o:['a) 200,000 ha','b) 500,000 ha','c) 832,000 ha','d) 1,200,000 ha'],a:2},
  {q:'¿Qué porcentaje del agua de Tegucigalpa proviene del Parque La Tigra?',o:['a) 20%','b) 30%','c) 40%','d) 60%'],a:2},
  {q:'¿Cuál fue la primera área protegida declarada en Honduras?',o:['a) Parque Celaque','b) Río Plátano','c) Parque La Tigra','d) Lancetilla'],a:2},
  {q:'¿Qué es el SINAPH?',o:['a) Sistema Nacional de Parques Históricos','b) Sistema Nacional de Áreas Protegidas de Honduras','c) Secretaría de Investigación Ambiental','d) Servicio Nacional de Bosques'],a:1},
  {q:'¿Dónde se localiza principalmente el bosque latifoliado tropical de Honduras?',o:['a) Valle de Comayagua','b) El Paraíso','c) Choluteca','d) La Mosquitia'],a:3},
  {q:'¿Qué ecosistema costero sirve de criadero natural para peces y mariscos?',o:['a) Bosque nublado','b) Manglar','c) Bosque de pino','d) Páramo'],a:1},
  {q:'¿Qué ave emblemática habita en los bosques nublados de Honduras?',o:['a) Tucán','b) Garza','c) Quetzal','d) Guacamaya'],a:2},
  {q:'¿Cuál es la principal causa de deforestación en Honduras?',o:['a) Minería','b) Turismo','c) Ganadería extensiva','d) Industria textil'],a:2},
  {q:'¿El Corredor Biológico Mesoamericano conecta desde México hasta…?',o:['a) Brasil','b) Colombia','c) Perú','d) Ecuador'],a:1},
  {q:'¿Dónde se ubica el Jardín Botánico Lancetilla?',o:['a) Comayagua','b) La Ceiba','c) Tela, Atlántida','d) Copán Ruinas'],a:2},
  {q:'¿Qué mamífero acuático en peligro habita en Cuero y Salado?',o:['a) Delfín','b) Nutria','c) Manatí','d) Ballena'],a:2},
  {q:'¿A qué altitud se desarrolla principalmente el bosque nublado en Honduras?',o:['a) 0–500 m','b) 500–1,000 m','c) 2,000–3,000 m','d) 3,500–4,000 m'],a:2},
];
const evalCPBank=[
  {q:'El bosque ___ es el más extenso de Honduras.',a:'de pino-roble'},
  {q:'La Reserva Río Plátano fue declarada Patrimonio UNESCO en el año ___.',a:'1982'},
  {q:'El Cerro Las Minas tiene ___ metros y es el punto más alto del país.',a:'2,849'},
  {q:'El ___ es el sistema que administra las áreas protegidas de Honduras.',a:'SINAPH'},
  {q:'Los manglares protegen las costas principalmente de los ___.',a:'huracanes'},
  {q:'La principal causa de deforestación en Honduras es la ___ extensiva.',a:'ganadería'},
  {q:'El bosque nublado ___ el agua de la neblina y la libera a los ríos.',a:'captura'},
  {q:'El Parque Nacional La Tigra provee el ___% del agua de Tegucigalpa.',a:'40'},
  {q:'El Corredor Biológico Mesoamericano conecta ecosistemas desde México hasta ___.',a:'Colombia'},
  {q:'El ___ es el ave emblemática de los bosques nublados de Honduras.',a:'quetzal'},
  {q:'El manatí en Honduras habita en el Refugio de Vida Silvestre ___ y Salado.',a:'Cuero'},
  {q:'El bosque de ___ tiene el mayor dosel y la mayor biodiversidad de Honduras.',a:'latifoliado tropical'},
  {q:'Lancetilla es el jardín botánico más antiguo y grande de ___.',a:'Centroamérica'},
  {q:'La deforestación provoca ___ del suelo y pérdida de agua.',a:'erosión'},
  {q:'La primera área protegida declarada en Honduras fue el Parque Nacional ___.',a:'La Tigra'},
];
const evalPRBank=[
  {term:'Bosque Nublado',def:'Bosque de montaña que captura neblina y regula el agua'},
  {term:'Reserva Río Plátano',def:'Patrimonio Natural UNESCO 1982; 832,000 ha en La Mosquitia'},
  {term:'Cerro Las Minas',def:'Punto más alto de Honduras (2,849 m) en el Parque Celaque'},
  {term:'SINAPH',def:'Sistema Nacional de Áreas Protegidas de Honduras (90+ áreas)'},
  {term:'Manglar',def:'Ecosistema costero que sirve de criadero y protege de huracanes'},
  {term:'Quetzal',def:'Ave emblemática de los bosques nublados mesoamericanos'},
  {term:'Parque La Tigra',def:'Primera área protegida de Honduras; provee 40% del agua capital'},
  {term:'Corredor Biológico Mesoamericano',def:'Red de ecosistemas que va de México a Colombia'},
  {term:'Manatí',def:'Mamífero acuático en peligro; santuario en Cuero y Salado'},
  {term:'Deforestación',def:'Pérdida de bosques causada por ganadería, tala e incendios'},
  {term:'Bosque de Pino-Roble',def:'Bosque más extenso de Honduras; zonas montañosas del interior'},
  {term:'Lancetilla',def:'Jardín botánico más antiguo y grande de Centroamérica, en Tela'},
  {term:'Bosque Latifoliado',def:'Bosque lluvioso del noreste (La Mosquitia); jaguar y tapir'},
  {term:'Biodiversidad',def:'Riqueza de especies vivas; Honduras: 700+ aves, hotspot mundial'},
  {term:'ICF',def:'Instituto de Conservación Forestal; coordina el SINAPH'},
];

function genEval(){
  sfx('click');
  const cf=evalFormNum;
  window._currentEvalForm=cf;
  evalFormNum=(evalFormNum%10)+1;
  saveProgress();
  document.getElementById('eval-screen-title').textContent=`🎓 Evaluación Final · Forma ${cf} · El Bosque y las Áreas Protegidas`;
  evalAnsVisible=false;
  const out=document.getElementById('evalOut');out.innerHTML='';
  const bar=document.createElement('div');bar.className='eval-score-bar';
  bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje · 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25 pts</span><span class="eval-score-pill esp-tf">V/F 25 pts</span><span class="eval-score-pill esp-mc">Selección 25 pts</span><span class="eval-score-pill esp-pr">Pareados 25 pts</span></div>`;
  out.appendChild(bar);

  const cpItems=_pick(evalCPBank,5);
  const s1=document.createElement('div');s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  cpItems.forEach((item,i)=>{
    const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='cp';d.dataset.evalIndex=i;
    const qHtml=item.q.replace('___',`<input class="eval-cp-input" type="text" data-cp="${i}" autocomplete="off">`);
    d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbCp${i}" aria-live="polite"></div>`;
    s1.appendChild(d);
  });
  out.appendChild(s1);

  const tfItems=_pick(evalTFBank,5);
  const s2=document.createElement('div');s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  tfItems.forEach((item,i)=>{
    const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='tf';d.dataset.evalIndex=i;
    d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="true"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="false"> Falso</label></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div><div class="eval-item-feedback" id="evalFbTf${i}" aria-live="polite"></div>`;
    s2.appendChild(d);
  });
  out.appendChild(s2);

  const mcItems=_pick(evalMCBank,5);
  const s3=document.createElement('div');s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  mcItems.forEach((item,i)=>{
    const d=document.createElement('div');d.className='eval-item eval-auto-item';d.dataset.evalType='mc';d.dataset.evalIndex=i;
    const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join('');
    d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbMc${i}" aria-live="polite"></div>`;
    s3.appendChild(d);
  });
  out.appendChild(s3);

  const prItems=_pick(evalPRBank,5);
  const shuffledDefs=[...prItems].sort(()=>Math.random()-0.5);
  const letters=['A','B','C','D','E'];
  const s4=document.createElement('div');s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  const matchCard=document.createElement('div');matchCard.className='eval-item';
  let colLeft='<div class="eval-match-col"><h4>📌 Términos</h4>';
  prItems.forEach((item,i)=>{colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> <select class="eval-match-select" data-pr="${i}" aria-label="Respuesta pareada ${i+16}"><option value="">—</option>${letters.map(l=>`<option value="${l}">${l}</option>`).join('')}</select> ${item.term}</div>`;});
  colLeft+='</div>';
  let colRight='<div class="eval-match-col"><h4>🔑 Definiciones</h4>';
  shuffledDefs.forEach((item,i)=>{colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`;});
  colRight+='</div>';
  const ansKey=prItems.map((item,i)=>{const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)];return`${i+16}→${letter}`;}).join(' · ');
  matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div><div class="eval-item-feedback" id="evalFbPr" aria-live="polite"></div>`;
  s4.appendChild(matchCard);out.appendChild(s4);

  window._evalPrintData={tf:tfItems,mc:mcItems,cp:cpItems,pr:{terms:prItems,shuffledDefs,letters}};
  const autoPanel=document.createElement('div');autoPanel.id='evalAutoResult';autoPanel.className='eval-auto-result';autoPanel.innerHTML='<strong>🧮 Evaluación interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato original sin respuestas digitadas.';out.appendChild(autoPanel);
  fin('s-evaluacion');
}

function toggleEvalAns(){
  evalAnsVisible=!evalAnsVisible;
  document.querySelectorAll('#evalOut .eval-answer').forEach(el=>el.style.display=evalAnsVisible?'block':'none');
  sfx('click');
}

function normalizeEvalAnswer(v){
  return (v||'').toString().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\s+/g,' ').replace(/[()]/g,'').trim();
}
function isCpCorrect(student,expected){
  const s=normalizeEvalAnswer(student);
  const e=normalizeEvalAnswer(expected);
  if(!s) return false;
  const variants=new Set([e]);
  if(e.includes(' ')) e.split(' ').forEach(x=>x&&variants.add(x));
  return variants.has(s)||e.replace(/[^a-z0-9]/g,'')===s.replace(/[^a-z0-9]/g,'');
}
function setEvalFeedback(id,ok,msg){
  const el=document.getElementById(id);
  if(!el) return;
  el.textContent=msg;
  el.className='eval-item-feedback '+(ok?'eval-ok':'eval-no');
}
function gradeEval(){
  if(!window._evalPrintData){showToast('⚠️ Genera una evaluación primero');return;}
  sfx('click');
  const d=window._evalPrintData;
  let total=0;
  const detail={cp:0,tf:0,mc:0,pr:0};
  d.cp.forEach((it,i)=>{
    const input=document.querySelector(`[data-cp="${i}"]`);
    const ok=isCpCorrect(input?input.value:'',it.a);
    if(input){input.classList.toggle('eval-input-ok',ok);input.classList.toggle('eval-input-no',!ok);}
    if(ok){detail.cp++;total+=5;}
    setEvalFeedback('evalFbCp'+i,ok,ok?'Correcto. +5 pts':'Revisar. Respuesta esperada: '+it.a);
  });
  d.tf.forEach((it,i)=>{
    const selected=document.querySelector(`input[name="tf${i}"]:checked`);
    const ok=!!selected&&(selected.value==='true')===it.a;
    if(ok){detail.tf++;total+=5;}
    setEvalFeedback('evalFbTf'+i,ok,ok?'Correcto. +5 pts':'Revisar. Respuesta esperada: '+(it.a?'Verdadero':'Falso'));
  });
  d.mc.forEach((it,i)=>{
    const selected=document.querySelector(`input[name="mc${i}"]:checked`);
    const ok=!!selected&&Number(selected.value)===it.a;
    if(ok){detail.mc++;total+=5;}
    setEvalFeedback('evalFbMc'+i,ok,ok?'Correcto. +5 pts':'Revisar. Respuesta esperada: '+it.o[it.a]);
  });
  const expectedLetters=d.pr.terms.map(it=>d.pr.letters[d.pr.shuffledDefs.findIndex(df=>df.def===it.def)]);
  expectedLetters.forEach((letter,i)=>{
    const sel=document.querySelector(`[data-pr="${i}"]`);
    const ok=!!sel&&sel.value===letter;
    if(sel){sel.classList.toggle('eval-input-ok',ok);sel.classList.toggle('eval-input-no',!ok);}
    if(ok){detail.pr++;total+=5;}
  });
  const prMsg=`Pareados: ${detail.pr}/5 correctos. ${detail.pr===5?'Excelente. +25 pts':'Clave: '+expectedLetters.map((l,i)=>(i+16)+'→'+l).join(' · ')}`;
  setEvalFeedback('evalFbPr',detail.pr===5,prMsg);
  const result=document.getElementById('evalAutoResult');
  if(result){
    result.className='eval-auto-result '+(total>=70?'eval-auto-pass':'eval-auto-risk');
    result.innerHTML=`<strong>Resultado automático: ${total}/100 puntos</strong><br><span>Completar: ${detail.cp*5}/25 · V/F: ${detail.tf*5}/25 · Selección: ${detail.mc*5}/25 · Pareados: ${detail.pr*5}/25</span><br><em>Este resultado es solo para revisión en pantalla; la impresión conserva el formato limpio para papel.</em>`;
  }
  if(total>=70){pts(8);showToast('🎯 Evaluación calificada: '+total+'/100');}
  else showToast('🧮 Evaluación calificada: '+total+'/100. Revisa las respuestas marcadas.');
}

function printEval(){
  if(!window._evalPrintData){showToast('⚠️ Genera una evaluación primero');return;}
  sfx('click');
  const forma=window._currentEvalForm||1;
  const d=window._evalPrintData;

  // ── I. Completar el espacio (preguntas 1-5)
  let s1=`<div class="sec-title"><span>I. Completar el espacio</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div>`;
  d.cp.forEach((it,i)=>{const q=it.q.replace('___','<span class="cp-blank"></span>');s1+=`<div class="cp-row"><span class="qn">${i+1}.</span><span class="cp-text">${q}</span></div>`;});

  // ── II. Verdadero o Falso (preguntas 6-10)
  let s2=`<div class="sec-title"><span>II. Verdadero o Falso</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div>`;
  d.tf.forEach((it,i)=>{s2+=`<div class="tf-row"><span class="qn">${i+6}.</span><span class="tf-blank"></span><span class="tf-text">${it.q}</span></div>`;});

  // ── III. Selección Múltiple (preguntas 11-15)
  let s3=`<div class="sec-title"><span>III. Selección Múltiple</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div><div class="mc-grid">`;
  d.mc.forEach((it,i)=>{const opts=it.o.map((op,oi)=>`<label class="mc-opt"><input type="radio" name="mcp${i}"> ${op}</label>`).join('');s3+=`<div class="mc-item"><div class="mc-q"><span class="qn">${i+11}.</span><span>${it.q}</span></div><div class="mc-opts">${opts}</div></div>`;});
  s3+=`</div>`;

  // ── IV. Términos Pareados (preguntas 16-20)
  let colL='<div class="pr-col"><div class="pr-head">📌 Términos</div>';
  d.pr.terms.forEach((it,i)=>{colL+=`<div class="pr-item"><span class="pr-num">${i+16}.</span><span class="pr-line"></span>${it.term}</div>`;});
  colL+='</div>';
  let colR='<div class="pr-col"><div class="pr-head">🔑 Definiciones</div>';
  d.pr.shuffledDefs.forEach((it,i)=>{colR+=`<div class="pr-item"><span class="pr-num">${d.pr.letters[i]}.</span>${it.def}</div>`;});
  colR+='</div>';
  let s4=`<div class="pr-section"><div class="sec-title"><span>IV. Términos Pareados</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div><div class="pr-grid">${colL}${colR}</div></div>`;

  // ── Pauta
  let pR='';
  pR+=`<div class="p-sec"><div class="p-ttl">I. Completar</div><table class="p-tbl">`;
  d.cp.forEach((it,i)=>{pR+=`<tr><td class="pn">${i+1}.</td><td class="pa">${it.a}</td></tr>`;});
  pR+=`</table></div><div class="p-sec"><div class="p-ttl">II. V o F</div><table class="p-tbl">`;
  d.tf.forEach((it,i)=>{pR+=`<tr><td class="pn">${i+6}.</td><td class="pa">${it.a?'V':'F'}</td></tr>`;});
  pR+=`</table></div><div class="p-sec"><div class="p-ttl">III. Selección</div><table class="p-tbl">`;
  d.mc.forEach((it,i)=>{pR+=`<tr><td class="pn">${i+11}.</td><td class="pa">${it.o[it.a]}</td></tr>`;});
  pR+=`</table></div><div class="p-sec"><div class="p-ttl">IV. Pareados</div><table class="p-tbl">`;
  d.pr.terms.forEach((it,i)=>{const l=d.pr.letters[d.pr.shuffledDefs.findIndex(df=>df.def===it.def)];pR+=`<tr><td class="pn">${i+16}.</td><td class="pa">${i+16}→${l}</td></tr>`;});
  pR+=`</table></div>`;

  const doc=`<!DOCTYPE html><html lang="es"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Evaluación El Bosque y Áreas Protegidas de Honduras · Forma ${forma}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body {font-family:Arial,Helvetica,sans-serif;font-size:12pt;color:#111;background:#fff;padding:2mm 6mm;}
.ph{margin-bottom:0.55rem;}
.ph h2{font-size:12pt;font-weight:700;text-align:center;margin-bottom:0.4rem;}
.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:5px;}
.ph-fill{flex:1;border-bottom:1px solid #555;min-height:13px;display:block;}
.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}
.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}
.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}
.ph-crit{font-size:10.5pt;text-align:center;color:#555;margin-top:0.2rem;}
.sec-title {font-size:11pt;font-weight:700;padding:0.2rem 0.48rem;margin:0.38rem 0 0.17rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #c0392b;background:#fbe9e7;color:#c0392b;}
.obt-row {display:flex;align-items:baseline;gap:4px;font-size:10pt;font-weight:700;font-style:italic;color:#c0392b;}
.obt-lbl{white-space:nowrap;}
.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #c0392b;height:13px;}
.obt-pct{white-space:nowrap;}
.qn{font-weight:700;min-width:22px;flex-shrink:0;}
.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:11pt;line-height:1.4;padding:0.22rem 0.25rem;border-bottom:1px solid #eee;}
.tf-blank{display:inline-block;min-width:40px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.18rem;}
.tf-text{flex:1;}
.mc-item {border:1px solid #ddd;border-radius:4px;padding:0.22rem 0.42rem;margin-bottom:0.17rem;break-inside:avoid;page-break-inside:avoid;}
.mc-q{font-size:11pt;line-height:1.4;display:flex;gap:0.28rem;margin-bottom:0.15rem;}
.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.17rem 0.5rem;}
.mc-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:0.06rem 0.2rem;margin-left:1.2rem;}
.mc-opt{font-size:9.5pt;display:flex;align-items:center;gap:0.2rem;}
.mc-opt input{width:11px;height:11px;flex-shrink:0;}
.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:11pt;line-height:1.4;padding:0.22rem 0.25rem;border-bottom:1px solid #eee;}
.cp-text{flex:1;}
.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}
.pr-section{margin-top:0.22rem;}
.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.2rem 0.5rem;margin-top:0.15rem;}
.pr-head{font-size:9.5pt;font-weight:700;color:#555;margin-bottom:0.18rem;}
.pr-item {font-size:11pt;padding:0.2rem 0.35rem;background:#fbe9e7;border-radius:3px;margin-bottom:0.14rem;display:flex;align-items:center;gap:0.2rem;line-height:1.28;break-inside:avoid;page-break-inside:avoid;}
.pr-num {font-weight:700;color:#c0392b;min-width:19px;flex-shrink:0;}
.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}
.total-row {display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:12pt;font-weight:700;font-style:italic;margin-top:0.42rem;padding:0.28rem 0;page-break-before:avoid;break-before:avoid;color:#c0392b;}
.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #c0392b;}
.pauta-wrap{page-break-before:always;padding-top:0.4rem;}
.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}
.p-main{font-size:9.5pt;font-weight:700;}
.p-sub{font-size:7pt;color:#c00;font-weight:700;margin:0.08rem 0;}
.p-meta{font-size:7pt;color:#555;}
.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.9rem;}
.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.25rem 0.4rem;}
.p-ttl{font-size:8pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.1rem;margin-bottom:0.15rem;}
.p-tbl{width:100%;border-collapse:collapse;font-size:7.5pt;}
.p-tbl tr{border-bottom:1px dotted #ddd;}
.p-tbl td{padding:0.07rem 0.12rem;vertical-align:top;}
.pn{font-weight:700;width:16px;color:#555;}.pa{color:#007a00;font-weight:600;}
.forma-tag{position:fixed;bottom:5mm;right:6mm;font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;}
@media print{@page{size:letter portrait;margin:12.7mm;}}
</style></head><body>
<div class="ph">
  <h2>Evaluación Final · El Bosque y las Áreas Protegidas de Honduras · Forma ${forma} · II y III Ciclo · Ciencias Sociales</h2>
  <div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div>
  <div class="ph-line"><strong>Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div>
  <p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p>
</div>
${s1}${s2}${s3}${s4}
<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div>
<div class="pauta-wrap">
  <div class="p-head">
    <div class="p-main">✅ PAUTA — Evaluación Final · El Bosque y Áreas Protegidas de Honduras · Forma ${forma}</div>
    <div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div>
    <div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u</div>
  </div>
  <div class="p-grid">${pR}</div>
</div>
<div class="forma-tag">Forma ${forma}</div>
</body></html>`;

  const win=window.open('','_blank','');
  if(!win){showToast('⚠️ Activa las ventanas emergentes para imprimir');return;}
  win.document.write(doc);
  win.document.close();
  setTimeout(()=>win.print(),400);
}

// ===================== LABORATORIO DE BOSQUES =====================
const bosqueData={
  nublado:{
    nombre:'Bosque Nublado',icon:'🌫️',
    ubicacion:{title:'Ubicación',info:'• Altitud: entre <strong>2,000 y 3,000 metros</strong> sobre el nivel del mar<br>• Zonas: montañas de Celaque, La Muralla, Santa Bárbara, Pico Bonito<br>• Temperatura fresca: 10–18 °C<br>• Permanentemente cubierto por nubes y neblina<br>• El bosque nublado más extenso de Honduras está en Celaque'},
    biodiversidad:{title:'Biodiversidad',info:'• <strong>Quetzal</strong> (ave emblema de Centroamérica)<br>• Puma, ocelote y coatí<br>• Más de 200 especies de orquídeas<br>• Bromelias, helechos arborescentes y musgos<br>• Anfibios exclusivos: ranas arborícolas y salamandras<br>• Alta endemismo: especies que no se encuentran en ningún otro lugar'},
    amenazas:{title:'Amenazas',info:'• <strong>Deforestación</strong> por agricultura de subsistencia en las laderas<br>• Incendios forestales que avanzan desde zonas de pino<br>• Cambio climático: el cinturón de neblina sube de altitud<br>• Caza furtiva del quetzal y otras aves<br>• Fragmentación del hábitat que impide el movimiento de especies'},
    importancia:{title:'Importancia',info:'• <strong>Regula el agua</strong>: captura neblina y alimenta ríos todo el año<br>• Parque La Tigra provee el <strong>40% del agua de Tegucigalpa</strong><br>• Estabiliza taludes y previene deslizamientos<br>• Carbono almacenado en la biomasa húmeda<br>• Centro de biodiversidad con alto endemismo'}
  },
  pino:{
    nombre:'Bosque de Pino-Roble',icon:'🌲',
    ubicacion:{title:'Ubicación',info:'• El <strong>más extenso de Honduras</strong> (~3.5 millones de hectáreas)<br>• Cubre las zonas montañosas del centro, occidente y oriente<br>• Altitud: 400 a 2,000 metros<br>• Departamentos: Olancho, Yoro, Santa Bárbara, El Paraíso<br>• Puede mezclarse con robles (Quercus) según la altitud'},
    biodiversidad:{title:'Biodiversidad',info:'• <strong>Pino hondureño</strong> (Pinus oocarpa) como especie dominante<br>• Venado cola blanca, armadillo, zorrillo<br>• Aves rapaces: gavilanes y halcones<br>• Reptiles: lagartijas y serpientes de montaña<br>• Menor diversidad que el bosque tropical por el monocultivo de pino'},
    amenazas:{title:'Amenazas',info:'• <strong>Gorgojo descortezador</strong> (Dendroctonus frontalis): plaga que devastó millones de ha en 2000-2003<br>• Incendios forestales: cada año queman miles de hectáreas<br>• Tala selectiva e ilegal para madera<br>• Apertura de potreros para ganadería<br>• Extracción excesiva de resina'},
    importancia:{title:'Importancia',info:'• Fuente de <strong>madera, resina y carbón</strong> para la economía local<br>• Refugio y alimento para la fauna nativa<br>• Protege las cuencas hidrográficas del interior del país<br>• Captura de carbono a gran escala<br>• Base de la industria maderera y resinera de Honduras'}
  },
  latifol:{
    nombre:'Bosque Latifoliado Tropical',icon:'🌿',
    ubicacion:{title:'Ubicación',info:'• Noreste de Honduras: <strong>La Mosquitia</strong> (Gracias a Dios)<br>• También: Atlántida, Colón, norte de Olancho<br>• Altitud: nivel del mar hasta ~600 metros<br>• Precipitación: >2,000 mm anuales<br>• Conectado con el bosque tropical de Nicaragua: el más grande de Centroamérica'},
    biodiversidad:{title:'Biodiversidad',info:'• <strong>Jaguar</strong>, tapir, mono araña, mono carablanca<br>• Tucán, lapa roja, quetzal de tierras bajas<br>• Caoba (Swietenia macrophylla), cedro, palo de agua<br>• Reptiles: caimán, boa constrictor, cocodrilo<br>• Mayor riqueza de especies de todo Honduras<br>• Alberga cuatro pueblos indígenas en la Reserva Río Plátano'},
    amenazas:{title:'Amenazas',info:'• <strong>Avance de la frontera agrícola</strong> y ganadería desde el interior<br>• Narcotráfico: pistas clandestinas destruyen el bosque<br>• Tala ilegal de maderas preciosas (caoba, cedro)<br>• Colonización no planificada<br>• La Reserva Río Plátano estuvo en la Lista del Patrimonio en Peligro UNESCO (2011-2018)'},
    importancia:{title:'Importancia',info:'• Mayor <strong>banco de biodiversidad</strong> de Honduras<br>• Hogar ancestral de Pech, Miskitu, Tawahka y Garífuna<br>• Parte fundamental del <strong>Corredor Biológico Mesoamericano</strong><br>• Fuente de agua para ríos que desembocan en el Caribe<br>• Reserva de carbono forestal de importancia global'}
  },
  manglar:{
    nombre:'Manglares',icon:'🌊',
    ubicacion:{title:'Ubicación',info:'• Costas del <strong>Caribe y del Pacífico</strong> de Honduras<br>• Bocas de ríos, lagunas costeras y bahías<br>• Principales zonas: Bahía de La Unión, Laguna de Caratasca, Tela, La Ceiba<br>• Cuero y Salado (Refugio de Vida Silvestre cerca de La Ceiba)<br>• Lago de Yojoa: manglares lacustres'},
    biodiversidad:{title:'Biodiversidad',info:'• <strong>Manatí</strong> (en peligro de extinción)<br>• Cocodrilo americano, garza, ibis<br>• Cangrejos, langostinos, camarones, peces juveniles<br>• Mangle rojo (Rhizophora mangle) con raíces aéreas<br>• Mangle negro y mangle blanco<br>• Criadero natural del 80% de los peces comerciales del litoral'},
    amenazas:{title:'Amenazas',info:'• <strong>Industria camaronera</strong>: drena manglares para piscinas de camarón<br>• Urbanización costera y turismo no controlado<br>• Contaminación por agroquímicos y desechos plásticos<br>• Cambio climático: aumento del nivel del mar<br>• Honduras ha perdido más del 50% de su cobertura de manglares'},
    importancia:{title:'Importancia',info:'• <strong>Criadero natural</strong> de peces y mariscos (seguridad alimentaria)<br>• Barrera física contra <strong>huracanes, tsunamis y erosión costera</strong><br>• Filtra contaminantes del agua antes de llegar al mar<br>• Almacén de "carbono azul" (5× más eficiente que bosques terrestres)<br>• Sustento económico para comunidades pesqueras'}
  }
};

let labBosque='nublado';
let labAspecto='ubicacion';

function labShowBosque(bosqueKey){
  labBosque=bosqueKey;
  updateLabDisplay();
  document.querySelectorAll('.lab-cont-btn').forEach(b=>b.classList.remove('active-pri'));
  const btn=document.querySelector(`[data-bosque="${bosqueKey}"]`);
  if(btn) btn.classList.add('active-pri');
  if(typeof sfx==='function') sfx('click');
}

function labShowAspecto(aspectoKey){
  labAspecto=aspectoKey;
  updateLabDisplay();
  document.querySelectorAll('.lab-asp-btn').forEach(b=>b.classList.remove('active-sec'));
  const btn=document.querySelector(`[data-aspecto="${aspectoKey}"]`);
  if(btn) btn.classList.add('active-sec');
  if(typeof sfx==='function') sfx('click');
}

function updateLabDisplay(){
  const data=bosqueData[labBosque];
  const asp=data[labAspecto];
  document.getElementById('lab-sentence').innerHTML=`🌲 Explorando: <strong>${data.nombre}</strong> → <strong>${asp.title}</strong>`;
  document.getElementById('lab-display').innerHTML=`
    <div class="lab-cont-header">${data.icon} ${data.nombre}</div>
    <div class="lab-asp-title">${asp.title}</div>
    <div class="lab-asp-info">${asp.info}</div>
  `;
}

// ===================== DIPLOMA =====================
function openDiploma(){
  sfx('fan');
  const pct=getProgress();
  document.getElementById('diplPct').textContent=pct+'%';
  document.getElementById('diplBar').style.width=pct+'%';
  document.getElementById('diplDate').textContent='Fecha: '+new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});
  const msgs=['¡Sigue aprendiendo!','¡Muy buen trabajo!','¡Excelente guardabosques!','¡Eres un defensor del bosque!','¡Maestro del bosque hondureño!'];
  document.getElementById('diplMsg').textContent=msgs[Math.min(Math.floor(pct/25),4)];
  const stars=['⭐','⭐⭐','⭐⭐⭐'];
  document.getElementById('diplStars').textContent=stars[Math.min(Math.floor(pct/40),2)];
  const achTxt=unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(' · ');
  document.getElementById('diplAch').textContent=achTxt||'Sigue completando secciones para desbloquear logros';
  document.getElementById('diplomaOverlay').classList.add('open');
  launchConfetti();
}
function closeDiploma(){document.getElementById('diplomaOverlay').classList.remove('open');}
function updateDiplomaName(v){document.getElementById('diplName').textContent=v||'Estudiante';}
function shareWA(){
  const name=document.getElementById('diplName').textContent||'Estudiante';
  const pct=getProgress();
  const msg=`🌲 ¡${name} completó la Misión "El Bosque y las Áreas Protegidas de Honduras"! 🏅 Progreso: ${pct}% · 🌿 policastsapien.com`;
  window.open('https://wa.me/?text='+encodeURIComponent(msg),'_blank');
}

// ===================== INIT =====================
window.addEventListener('DOMContentLoaded',()=>{
  initTheme();
  loadProgress();
  upFC();
  buildQz();
  showQz();
  buildClass();
  showId();
  showCmp();
  updateRetoButtons();
  updateLabDisplay();
  document.querySelector('[data-bosque="nublado"]')?.classList.add('active-pri');
  document.querySelector('[data-aspecto="ubicacion"]')?.classList.add('active-sec');
  renderAchPanel();
});
