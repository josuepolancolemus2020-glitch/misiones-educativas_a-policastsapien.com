function toggleLetra(){
  document.body.classList.toggle('letra-grande');
  if(typeof sfx==='function') sfx('click');
  localStorage.setItem('preferenciaLetra', document.body.classList.contains('letra-grande'));
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
const SAVE_KEY='continentes_aoa_v1';
let xp=0,MXP=200,done=new Set(),evalAnsVisible=false;
let evalFormNum=1;
let unlockedAch=[];
let darkMode=false;
let prevLevel=0;
const TOTAL_SECTIONS=12;

const xpTracker={fc:new Set(),qz:new Set(),cls:new Set(),id:new Set(),cmp:new Set(),reto:new Set(),sopa:new Set()};

// ===================== SONIDO =====================
let sndOn=true,AC=null;
function getAC(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}}return AC;}
function sfx(t){
  if(!sndOn)return;
  try{
    const ac=getAC();if(!ac)return;
    const g=ac.createGain();g.connect(ac.destination);
    const o=ac.createOscillator();o.connect(g);
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
    if(!s)return;
    if(s.doneSections&&Array.isArray(s.doneSections))s.doneSections.forEach(id=>{done.add(id);const b=document.querySelector(`[data-s="${id}"]`);if(b)b.classList.add('done');});
    if(s.unlockedAch&&Array.isArray(s.unlockedAch))unlockedAch=s.unlockedAch.filter(id=>ACHIEVEMENTS[id]!==undefined);
    if(s.evalFormNum)evalFormNum=s.evalFormNum;
    if(s.xp!==undefined){xp=s.xp;updateXPBar();}
  }catch(e){}
}

// ===================== ACHIEVEMENTS =====================
const ACHIEVEMENTS={
  primer_quiz:{icon:'🧠',label:'Primera prueba superada'},
  flash_master:{icon:'🃏',label:'Todas las flashcards exploradas'},
  clasif_pro:{icon:'🗂️',label:'Clasificador experto de continentes'},
  id_master:{icon:'🔍',label:'Identificador maestro'},
  reto_hero:{icon:'🏆',label:'Héroe del reto final'},
  nivel3:{icon:'🌎',label:'¡Explorador de las Américas! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡Campeón geográfico! Nivel 6'}
};
function unlockAchievement(id){
  if(unlockedAch.includes(id))return;
  unlockedAch.push(id);sfx('ach');
  showToast(ACHIEVEMENTS[id].icon+' ¡Logro desbloqueado! '+ACHIEVEMENTS[id].label);
  launchConfetti();renderAchPanel();saveProgress();
}
function renderAchPanel(){
  const list=document.getElementById('achList');list.innerHTML='';
  Object.entries(ACHIEVEMENTS).forEach(([id,a])=>{
    const div=document.createElement('div');div.className='ach-item'+(unlockedAch.includes(id)?'':' locked');
    div.innerHTML=`<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`;list.appendChild(div);
  });
}
function toggleAchPanel(){sfx('click');document.getElementById('achPanel').classList.toggle('open');}
function showToast(msg){
  let t=document.querySelector('.toast');
  if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}
  t.textContent=msg;t.style.display='block';clearTimeout(t._tid);t._tid=setTimeout(()=>t.style.display='none',3200);
}
function launchConfetti(){
  const colors=['#1a7fa3','#1e8449','#00b894','#fdcb6e','#6c5ce7'];
  for(let i=0;i<60;i++){
    const c=document.createElement('div');c.className='confetti-piece';
    c.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*1.5}s;animation-delay:${Math.random()*0.4}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'};`;
    document.body.appendChild(c);c.addEventListener('animationend',()=>c.remove());
  }
}

// ===================== XP =====================
const lvls=[{t:0,n:'Novato ✏️'},{t:25,n:'Aprendiz 📚'},{t:55,n:'Explorador 🌎'},{t:90,n:'Detective 🔍'},{t:130,n:'Experto 🌐'},{t:165,n:'Campeón 🥇'},{t:190,n:'Maestro 🏆'}];
function pts(n){xp=Math.max(0,Math.min(MXP,xp+n));updateXPBar();saveProgress();}
function updateXPBar(){
  const pct=Math.round((xp/MXP)*100);
  document.getElementById('xpFill').style.width=pct+'%';
  const el=document.getElementById('xpPts');el.textContent='⭐ '+xp;el.style.transform='scale(1.3)';setTimeout(()=>el.style.transform='',300);
  let lv=0;for(let i=0;i<lvls.length;i++)if(xp>=lvls[i].t)lv=i;
  document.getElementById('xpLvl').textContent=lvls[lv].n;
  if(lv!==prevLevel){if(lv>=2)unlockAchievement('nivel3');if(lv>=5)unlockAchievement('nivel5');prevLevel=lv;}
}
function resetXP(){sfx('click');xp=0;updateXPBar();showToast('🔄 XP reiniciado a 0');}
function fin(id,showFX=true){
  if(!done.has(id)){done.add(id);const b=document.querySelector(`[data-s="${id}"]`);if(b)b.classList.add('done');if(showFX){sfx('up');launchConfetti();}saveProgress();}
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
  if(id==='s-sopa')setTimeout(buildSopa,50);
}

// ===================== LABORATORIO =====================
const LAB_DATA={
  america:{
    label:'🌎 América',
    geo:'🗺️ <strong>Geografía de América</strong><br>Área: <strong>42.5 millones km²</strong> · 35 países · ~15,000 km de norte a sur.<br>⛰️ Los Andes: cordillera más larga del mundo (~7,000 km).<br>💧 Río Amazonas: el más caudaloso del mundo (7,062 km).<br>🏔️ Aconcagua: 6,961 m (cumbre más alta del continente).<br>🌡️ Climas: ártico, templado, tropical, desértico.',
    eco:'💰 <strong>Economía de América</strong><br>EE.UU.: <strong>1ª economía mundial</strong>.<br>CAFTA-DR: libre comercio entre EE.UU. y Centroamérica (incluye Honduras).<br>🌽 Mayor productor mundial de maíz y soja.<br>🛢️ Venezuela y México exportan petróleo.<br>💵 EE.UU. recibe más del 50% de las exportaciones hondureñas.',
    soc:'👥 <strong>Sociedad de América</strong><br>Población: ~<strong>1,000 millones</strong> de personas.<br>Gran diversidad étnica: indígenas, mestizos, afrodescendientes, europeos, asiáticos.<br>🏘️ La región tiene alta desigualdad económica interna.<br>✈️ Más de 1 millón de hondureños viven en EE.UU. (mayor fuente de remesas).',
    cul:'🎭 <strong>Cultura de América</strong><br>Cuna de civilizaciones precolombinas: <strong>Maya</strong> (Honduras, México, Guatemala), <strong>Azteca</strong> (México), <strong>Inca</strong> (Perú).<br>🏛️ Copán (Honduras): sitio arqueológico maya, Patrimonio UNESCO.<br>🎵 Música: marimba, salsa, cumbia, jazz, bossa nova, rock latinoamericano.',
    hn:'🇭🇳 <strong>Honduras y América</strong><br>EE.UU. recibe más del <strong>50%</strong> de las exportaciones hondureñas: café ☕, banano 🍌, textiles, mariscos.<br>💵 Remesas desde EE.UU. y Canadá representan ~<strong>25% del PIB</strong> de Honduras.<br>🤝 OEA: Honduras es miembro activo de la Organización de Estados Americanos.<br>📋 CAFTA-DR facilita el comercio con EE.UU.'
  },
  oceania:{
    label:'🌏 Oceanía',
    geo:'🗺️ <strong>Geografía de Oceanía</strong><br>El continente <strong>más pequeño</strong>: 8.5 millones km².<br>Comprende: Australia, Nueva Zelanda, Papua Nueva Guinea y miles de islas del Pacífico (Melanesia, Micronesia, Polinesia).<br>🪸 Gran Barrera de Coral (Australia): el mayor arrecife del mundo (2,300 km).<br>🗻 Monte Kosciuszko: 2,228 m (Australia).',
    eco:'💰 <strong>Economía de Oceanía</strong><br>Australia: <strong>13ª economía mundial</strong>. Exporta hierro, carbón, oro y productos agrícolas.<br>🥛 Nueva Zelanda: líder mundial en exportación de lácteos y carne.<br>🌊 Turismo en la Gran Barrera de Coral: ~6,000 millones USD/año.<br>🎰 Las naciones insulares dependen del turismo y la pesca.',
    soc:'👥 <strong>Sociedad de Oceanía</strong><br>Población: ~<strong>43 millones</strong>.<br>🪃 Aborígenes australianos: los habitantes <strong>más antiguos del mundo</strong> (60,000+ años de presencia).<br>🌺 Maoríes (Nueva Zelanda): pueblo polinesio famoso por el <em>haka</em> y su rica cultura oral.<br>🏝️ Comunidades insulares del Pacífico, vulnerables al cambio climático.',
    cul:'🎭 <strong>Cultura de Oceanía</strong><br>Arte rupestre aborigen: el más antiguo del mundo.<br>🎵 Haka maorí: danza guerrera ceremonial y deportiva de Nueva Zelanda.<br>🏛️ Ópera de Sídney: Patrimonio de la Humanidad (UNESCO).<br>🪸 Gran Barrera de Coral: Patrimonio Natural de la Humanidad.',
    hn:'🇭🇳 <strong>Honduras y Oceanía</strong><br>Relaciones principalmente a través de la <strong>ONU</strong> y foros del Pacífico.<br>🌊 Honduras puede aprender del modelo de <strong>ecoturismo marino</strong> de Australia para proteger sus arrecifes del Caribe.<br>🌡️ Comparten preocupaciones por el <strong>cambio climático</strong> y la elevación del nivel del mar que amenaza islas y costas.'
  },
  antartica:{
    label:'❄️ Antártida',
    geo:'🗺️ <strong>Geografía de la Antártida</strong><br>Área: <strong>14.2 millones km²</strong> (más grande que Europa).<br>El continente más <strong>frío, seco y ventoso</strong> del mundo.<br>🌡️ Temperatura mínima registrada: <strong>-89.2°C</strong>.<br>💧 Contiene el <strong>70% del agua dulce</strong> del planeta en forma de hielo.<br>⛰️ Monte Vinson: 4,892 m (punto más alto).',
    eco:'💰 <strong>Economía de la Antártida</strong><br>Sin economía comercial.<br>🔬 Solo investigación científica: <strong>53 estaciones</strong> de 29 países.<br>🚢 Turismo científico limitado: ~50,000 visitantes/año bajo estrictas regulaciones.<br>📜 El Tratado Antártico <strong>prohíbe la minería</strong> y el uso militar.',
    soc:'👥 <strong>Sociedad de la Antártida</strong><br>NO tiene <strong>población permanente</strong>.<br>🔬 Solo científicos e investigadores (aprox. <strong>4,000 en verano</strong> polar, ~1,000 en invierno).<br>📜 Tratado Antártico (1959): <strong>54 países firmantes</strong>. Ningún país puede reclamar soberanía territorial.<br>🌐 Es el único continente sin gobierno propio.',
    cul:'🎭 <strong>Antártida y la ciencia</strong><br>El continente de la <strong>investigación científica</strong> global.<br>🐧 Fauna: pingüinos (18 especies), focas leopardo, ballenas jorobadas, petreles.<br>🌡️ Pieza clave en el estudio del <strong>cambio climático</strong>.<br>❄️ Los núcleos de hielo revelan <strong>800,000 años</strong> de historia climática de la Tierra.',
    hn:'🇭🇳 <strong>Honduras y la Antártida</strong><br>Honduras, como país tropical costero, es uno de los más <strong>vulnerables al deshielo antártico</strong> que elevaría el nivel del mar.<br>🌡️ Honduras apoya el <strong>Acuerdo de París</strong> sobre cambio climático, vinculado a la protección del hielo antártico.<br>⚠️ El aumento del nivel del mar amenaza zonas costeras del norte de Honduras y las Islas de la Bahía.'
  }
};

let labContinent='america',labAspecto='geo';
function labShowContinent(c){
  labContinent=c;
  document.querySelectorAll('.lab-cont-btn').forEach(b=>b.classList.remove('active-pri'));
  const btn=document.querySelector(`.lab-cont-btn[data-continent="${c}"]`);if(btn)btn.classList.add('active-pri');
  renderLab();sfx('click');
}
function labShowAspecto(a){
  labAspecto=a;
  document.querySelectorAll('.lab-asp-btn').forEach(b=>b.classList.remove('active-sec'));
  const btn=document.querySelector(`.lab-asp-btn[data-aspecto="${a}"]`);if(btn)btn.classList.add('active-sec');
  renderLab();sfx('click');
}
const aspLabels={geo:'Geografía',eco:'Economía',soc:'Sociedad',cul:'Cultura',hn:'Con Honduras'};
function renderLab(){
  const d=LAB_DATA[labContinent];const info=d[labAspecto];
  document.getElementById('lab-sentence').innerHTML=`${d.label.split(' ')[0]} Explorando: <strong>${d.label}</strong> → <strong>${aspLabels[labAspecto]}</strong>`;
  document.getElementById('lab-display').innerHTML=`<div class="lab-asp-info">${info}</div>`;
}
window.addEventListener('DOMContentLoaded',()=>{
  renderLab();
  document.querySelector('.lab-cont-btn[data-continent="america"]').classList.add('active-pri');
  document.querySelector('.lab-asp-btn[data-aspecto="geo"]').classList.add('active-sec');
});

// ===================== FLASHCARD DATA =====================
const fcData=[
  {w:'América',a:'🌎 El continente donde vivimos. Se extiende <strong>~15,000 km</strong> de norte a sur. Tiene 35 países divididos en América del Norte, Central y del Sur. Comprende ecosistemas desde el Ártico hasta la Patagonia.'},
  {w:'Río Amazonas',a:'💧 El río más <strong>caudaloso</strong> del mundo (7,062 km), en América del Sur. Nace en los Andes peruanos y desemboca en el Atlántico (Brasil). Su cuenca alberga el <strong>mayor bosque tropical del planeta</strong>.'},
  {w:'Los Andes',a:'⛰️ La <strong>cordillera más larga del mundo</strong> (~7,000 km), en América del Sur. Atraviesa Venezuela, Colombia, Ecuador, Perú, Bolivia, Chile y Argentina. Cima: <strong>Aconcagua (6,961 m)</strong>.'},
  {w:'CAFTA-DR',a:'📋 Acuerdo de Libre Comercio entre <strong>EE.UU. y Centroamérica</strong> (incluyendo Honduras y Rep. Dominicana). Facilita el comercio de café ☕, banano 🍌 y textiles hondureños hacia EE.UU. sin aranceles.'},
  {w:'OEA',a:'🤝 <strong>Organización de Estados Americanos</strong>: reúne a los 35 países del hemisferio. Sede en Washington D.C. Promueve la democracia, los derechos humanos y el desarrollo en América. Honduras es miembro activo.'},
  {w:'Civilización Maya',a:'🏛️ Gran civilización precolombina que floreció en <strong>Honduras, México, Guatemala, Belice y El Salvador</strong>. Desarrollaron escritura, astronomía, matemáticas y arquitectura. <strong>Copán</strong> (Honduras) es su mayor ciudad arqueológica en el país.'},
  {w:'Oceanía',a:'🌏 El continente <strong>más pequeño</strong> del mundo (8.5 millones km²). Formado por <strong>Australia</strong>, Nueva Zelanda, Papua Nueva Guinea y miles de islas del Pacífico (Melanesia, Micronesia, Polinesia). Población: ~43 millones.'},
  {w:'Gran Barrera de Coral',a:'🪸 El <strong>mayor arrecife de coral del mundo</strong> (2,300 km), frente a la costa nordeste de Australia. Patrimonio Natural de la Humanidad (UNESCO). Hogar de más de 1,500 especies de peces y 600 tipos de coral.'},
  {w:'Aborígenes australianos',a:'🪃 Los habitantes <strong>más antiguos del mundo</strong>, con más de 60,000 años de presencia en Australia. Poseen el arte rupestre más antiguo conocido. Su cultura es oral, basada en el "Tiempo del Sueño" o <em>Dreamtime</em>.'},
  {w:'Antártida',a:'❄️ El <strong>continente más frío, seco y ventoso</strong> del mundo (14.2 millones km²). Temperatura mínima: <strong>-89.2°C</strong>. No tiene población permanente. Contiene el <strong>70% del agua dulce</strong> del planeta en forma de hielo.'},
  {w:'Tratado Antártico',a:'📜 Firmado en <strong>1959</strong> por 12 países; hoy tiene <strong>54 signatarios</strong>. Establece la Antártida como zona de paz y ciencia. Prohíbe actividades militares y minería comercial. Ningún país puede reclamar soberanía.'},
  {w:'Pingüinos',a:'🐧 Símbolo de la Antártida. En el mundo hay <strong>18 especies</strong>. En la Antártida habitan el pingüino emperador (el más grande: 1.2 m) y el pingüino de Adelia. No tienen depredadores terrestres naturales.'},
  {w:'Remesas en Honduras',a:'💵 Las <strong>remesas</strong> son dinero enviado desde el exterior por hondureños emigrantes. Representan ~<strong>25% del PIB</strong> de Honduras. La mayoría proviene de <strong>EE.UU. y Canadá</strong>. Son la principal fuente de divisas del país.'},
  {w:'Cambio climático y Antártida',a:'🌡️ El deshielo de la Antártida amenaza con elevar el nivel del mar hasta <strong>60 metros</strong> si se derritiera todo el hielo. Honduras, como país costero tropical, es <strong>altamente vulnerable</strong>. El Acuerdo de París busca limitar este riesgo.'},
  {w:'Maoríes',a:'🌺 Pueblo polinesio originario de <strong>Nueva Zelanda (Oceanía)</strong>. Llegaron ~800 años atrás. Famosos por el <strong>haka</strong> (danza guerrera). Su idioma, el <em>te reo māori</em>, es lengua oficial de Nueva Zelanda junto al inglés.'},
];
let fcIdx=0;
function upFC(){
  document.getElementById('fcInner').classList.remove('flipped');
  document.getElementById('fcW').textContent=fcData[fcIdx].w;
  document.getElementById('fcA').innerHTML=fcData[fcIdx].a;
  document.getElementById('fcCtr').textContent=(fcIdx+1)+' / '+fcData.length;
}
function flipCard(){
  sfx('flip');document.getElementById('fcInner').classList.toggle('flipped');
  if(!xpTracker.fc.has(fcIdx)){xpTracker.fc.add(fcIdx);pts(1);}
  if(xpTracker.fc.size===fcData.length){fin('s-flash');unlockAchievement('flash_master');}
}
function nextFC(){sfx('click');fcIdx=(fcIdx+1)%fcData.length;upFC();}
function prevFC(){sfx('click');fcIdx=(fcIdx-1+fcData.length)%fcData.length;upFC();}

// ===================== QUIZ DATA =====================
const qzData=[
  {q:'¿Cuál es el río más caudaloso del mundo?',o:['a) Nilo','b) Congo','c) Amazonas','d) Mississippi'],c:2},
  {q:'¿En qué región de América se ubica Honduras?',o:['a) América del Norte','b) América del Sur','c) América Central','d) El Caribe'],c:2},
  {q:'¿Cómo se llama el acuerdo de libre comercio entre Honduras y EE.UU.?',o:['a) AACUE','b) NAFTA','c) CAFTA-DR','d) MERCOSUR'],c:2},
  {q:'¿Cuál es el continente más pequeño del mundo?',o:['a) Europa','b) Antártida','c) Oceanía','d) América Central'],c:2},
  {q:'¿Qué país es a la vez el único país-continente del mundo?',o:['a) Nueva Zelanda','b) Australia','c) Papúa Nueva Guinea','d) Fiyi'],c:1},
  {q:'¿Cuál es el arrecife de coral más grande del mundo?',o:['a) Barrera de Mesoamérica','b) Barrera del Caribe','c) Gran Barrera de Coral','d) Arrecife de las Maldivas'],c:2},
  {q:'¿Cuál es el continente más frío del mundo?',o:['a) Europa','b) Asia','c) América del Norte','d) Antártida'],c:3},
  {q:'¿En qué año se firmó el Tratado Antártico?',o:['a) 1945','b) 1959','c) 1972','d) 1991'],c:1},
  {q:'¿Cuál es la cordillera más larga del mundo?',o:['a) El Himalaya','b) Los Alpes','c) Los Andes','d) Las Rocosas'],c:2},
  {q:'¿Qué organismo reúne a los 35 países del continente americano?',o:['a) ONU','b) OEA','c) CEPAL','d) ALBA'],c:1},
  {q:'¿Qué porcentaje del agua dulce del planeta está en la Antártida?',o:['a) 30%','b) 50%','c) 70%','d) 90%'],c:2},
  {q:'¿Qué pueblo originario de Nueva Zelanda es famoso por el haka?',o:['a) Aborígenes','b) Incas','c) Polinesios','d) Maoríes'],c:3},
];
let qzIdx=0,qzSel=-1,qzDone=false;
function buildQz(){qzIdx=0;qzSel=-1;qzDone=false;showQz();}
function showQz(){
  if(qzIdx>=qzData.length){document.getElementById('qzQ').textContent='🎉 ¡Quiz completado!';document.getElementById('qzOpts').innerHTML='';fin('s-quiz');unlockAchievement('primer_quiz');return;}
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
  if(qzSel<0)return fb('fbQz','Selecciona una respuesta.',false);
  qzDone=true;
  const opts=document.querySelectorAll('.qz-opt');
  if(qzSel===qzData[qzIdx].c){opts[qzSel].classList.add('correct');fb('fbQz','¡Correcto! +5 XP',true);if(!xpTracker.qz.has(qzIdx)){xpTracker.qz.add(qzIdx);pts(5);}sfx('ok');}
  else{opts[qzSel].classList.add('wrong');opts[qzData[qzIdx].c].classList.add('correct');fb('fbQz','Incorrecto. Revisa la respuesta correcta.',false);sfx('no');}
  setTimeout(()=>{qzIdx++;qzSel=-1;showQz();},1600);
}
function resetQz(){sfx('click');qzIdx=0;qzSel=-1;qzDone=false;showQz();document.getElementById('fbQz').classList.remove('show');}

// ===================== CLASIFICACIÓN =====================
const classGroups=[
  {
    label:['América','Oceanía'],headA:'🌎 América',headB:'🌏 Oceanía',colA:'america',colB:'oceania',
    words:[
      {w:'Río Amazonas',t:'america'},{w:'Gran Barrera de Coral',t:'oceania'},{w:'Los Andes',t:'america'},
      {w:'Australia',t:'oceania'},{w:'CAFTA-DR',t:'america'},{w:'Maoríes',t:'oceania'},
      {w:'Copán (Honduras)',t:'america'},{w:'Ópera de Sídney',t:'oceania'},{w:'OEA',t:'america'},{w:'Melanesia',t:'oceania'}
    ]
  },
  {
    label:['Oceanía','Antártida'],headA:'🌏 Oceanía',headB:'❄️ Antártida',colA:'oceania',colB:'antartica',
    words:[
      {w:'Australia',t:'oceania'},{w:'Tratado Antártico',t:'antartica'},{w:'Gran Barrera de Coral',t:'oceania'},
      {w:'Pingüinos',t:'antartica'},{w:'Nueva Zelanda',t:'oceania'},{w:'Sin residentes permanentes',t:'antartica'},
      {w:'Aborígenes',t:'oceania'},{w:'-89°C mínima',t:'antartica'},{w:'Micronesia',t:'oceania'},{w:'70% agua dulce',t:'antartica'}
    ]
  },
  {
    label:['Aspecto geográfico','Aspecto cultural'],headA:'🗺️ Geográfico',headB:'🎭 Cultural',colA:'geo',colB:'cul',
    words:[
      {w:'Río Amazonas',t:'geo'},{w:'Ruinas de Copán',t:'cul'},{w:'Los Andes',t:'geo'},
      {w:'Civilización Maya',t:'cul'},{w:'Gran Barrera de Coral',t:'geo'},{w:'Ópera de Sídney',t:'cul'},
      {w:'Monte Vinson',t:'geo'},{w:'Arte Aborigen',t:'cul'},{w:'Capa de hielo antártica',t:'geo'},{w:'Haka maorí',t:'cul'}
    ]
  },
  {
    label:['HN exporta','HN importa'],headA:'📦 HN Exporta',headB:'📥 HN Importa',colA:'exporta',colB:'importa',
    words:[
      {w:'Café a EE.UU.',t:'exporta'},{w:'Tecnología americana',t:'importa'},{w:'Banano a EE.UU.',t:'exporta'},
      {w:'Maíz importado',t:'importa'},{w:'Textiles a EE.UU.',t:'exporta'},{w:'Maquinaria',t:'importa'},
      {w:'Mariscos a EE.UU.',t:'exporta'},{w:'Combustibles',t:'importa'},{w:'Palma africana',t:'exporta'},{w:'Trigo importado',t:'importa'}
    ]
  },
];
let currentClassGroupIdx=0,clsSelectedWord=null;

function buildClass(){
  const group=classGroups[currentClassGroupIdx];
  document.getElementById('col-left-head').textContent=group.headA;
  document.getElementById('col-right-head').textContent=group.headB;
  const bank=document.getElementById('clsBank');bank.innerHTML='';clsSelectedWord=null;
  document.getElementById('items-left').innerHTML='';document.getElementById('items-right').innerHTML='';
  _shuffle([...group.words]).forEach(w=>{
    const el=document.createElement('div');el.className='wb-item';el.textContent=w.w;el.dataset.t=w.t;
    el.onclick=()=>{document.querySelectorAll('.wb-item').forEach(i=>i.classList.remove('sel-word'));el.classList.add('sel-word');clsSelectedWord=el;sfx('click');};
    bank.appendChild(el);
  });
  ['col-left','col-right'].forEach(colId=>{
    const col=document.getElementById(colId);
    col.onclick=(e)=>{
      if(!clsSelectedWord||e.target.classList.contains('drop-item'))return;
      const targetId=colId==='col-left'?'items-left':'items-right';
      const wordsCol=document.getElementById(targetId);
      const item=document.createElement('div');item.className='drop-item';item.textContent=clsSelectedWord.textContent;item.dataset.t=clsSelectedWord.dataset.t;
      const original=clsSelectedWord;
      item.onclick=(ev)=>{ev.stopPropagation();if(clsSelectedWord!==null){col.click();}else{document.getElementById('clsBank').appendChild(original);original.classList.remove('sel-word');item.remove();if(typeof sfx==='function')sfx('click');}};
      wordsCol.appendChild(item);clsSelectedWord.remove();clsSelectedWord=null;sfx('click');
    };
  });
}
function checkClass(){
  const remaining=document.querySelectorAll('#clsBank .wb-item').length;
  if(remaining>0){fb('fbCls','Mueve todas las palabras a las columnas primero.',false);return;}
  const group=classGroups[currentClassGroupIdx];let allOk=true;
  document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el=>{
    const inLeft=el.parentElement.id==='items-left';const expectedType=inLeft?group.colA:group.colB;
    if(el.dataset.t===expectedType){el.classList.add('cls-ok');}else{el.classList.add('cls-no');allOk=false;}
  });
  if(!xpTracker.cls.has(currentClassGroupIdx)){xpTracker.cls.add(currentClassGroupIdx);pts(5);}
  if(allOk){fb('fbCls','¡Perfecto! +5 XP',true);sfx('fan');fin('s-clasifica');unlockAchievement('clasif_pro');}
  else{fb('fbCls','Hay errores. Marcados en rojo.',false);sfx('no');}
}
function nextClassGroup(){
  sfx('click');currentClassGroupIdx=(currentClassGroupIdx+1)%classGroups.length;
  buildClass();document.getElementById('fbCls').classList.remove('show');
  showToast('🔄 Grupo: '+classGroups[currentClassGroupIdx].label[0]+' vs '+classGroups[currentClassGroupIdx].label[1]);
}
function resetClass(){sfx('click');buildClass();document.getElementById('fbCls').classList.remove('show');}

// ===================== IDENTIFICAR =====================
const idData=[
  {s:['El','Amazonas','es','el','río','más','caudaloso.'],c:1,art:'Río más caudaloso del mundo'},
  {s:['Honduras','está','en','América','Central.'],c:3,art:'Región de América donde está Honduras'},
  {s:['Los','Andes','son','la','cordillera','más','larga.'],c:1,art:'Cordillera más larga del mundo'},
  {s:['Australia','es','un','país-continente','de','Oceanía.'],c:0,art:'País que es también un continente'},
  {s:['El','CAFTA-DR','facilita','el','comercio','con','EE.UU.'],c:1,art:'Acuerdo de libre comercio con EE.UU.'},
  {s:['La','Antártida','no','tiene','población','permanente.'],c:1,art:'Continente sin habitantes permanentes'},
  {s:['Los','Maoríes','son','originarios','de','Nueva','Zelanda.'],c:1,art:'Pueblo originario de Nueva Zelanda'},
  {s:['El','Tratado','Antártico','fue','firmado','en','1959.'],c:1,art:'Acuerdo internacional sobre la Antártida'},
  {s:['Copán','es','un','sitio','arqueológico','maya','hondureño.'],c:0,art:'Sitio arqueológico maya en Honduras'},
  {s:['Las','remesas','representan','el','25%','del','PIB','hondureño.'],c:2,art:'Porcentaje del PIB que representan las remesas'},
];
let idIdx=0,idDone=false;
function showId(){
  idDone=false;
  if(idIdx>=idData.length){document.getElementById('idSent').innerHTML='🎉 ¡Completado!';fin('s-identifica');unlockAchievement('id_master');return;}
  const d=idData[idIdx];
  document.getElementById('idProg').textContent=`Oración ${idIdx+1} de ${idData.length}`;
  document.getElementById('idInfo').textContent=`Busca: ${d.art}`;
  const sent=document.getElementById('idSent');sent.innerHTML='';
  d.s.forEach((w,i)=>{const span=document.createElement('span');span.className='id-word';span.textContent=w+' ';span.onclick=()=>checkId(i,span);sent.appendChild(span);});
}
function checkId(i,span){
  if(idDone)return;
  document.querySelectorAll('.id-word').forEach(s=>s.classList.remove('selected'));span.classList.add('selected');
  if(i===idData[idIdx].c){idDone=true;span.classList.add('id-ok');fb('fbId','¡Correcto! +5 XP',true);if(!xpTracker.id.has(idIdx)){xpTracker.id.add(idIdx);pts(5);}sfx('ok');}
  else{span.classList.add('id-no');fb('fbId','Ese no es el término solicitado.',false);sfx('no');}
}
function nextId(){sfx('click');idIdx++;showId();document.getElementById('fbId').classList.remove('show');}
function resetId(){sfx('click');idIdx=0;showId();document.getElementById('fbId').classList.remove('show');}

// ===================== COMPLETA =====================
const cmpData=[
  {s:'El continente más pequeño del mundo es ___ .',opts:['América','Antártida','Oceanía'],c:2},
  {s:'El río más caudaloso del mundo es el ___ .',opts:['Nilo','Amazonas','Mississippi'],c:1},
  {s:'Honduras está en ___ Central.',opts:['Asia','Europa','América'],c:2},
  {s:'La cordillera más larga del mundo es ___ .',opts:['el Himalaya','los Andes','los Alpes'],c:1},
  {s:'El Tratado Antártico fue firmado en ___ .',opts:['1945','1972','1959'],c:2},
  {s:'El ___ facilita el comercio entre Honduras y EE.UU.',opts:['MERCOSUR','CAFTA-DR','OEA'],c:1},
  {s:'La Antártida contiene el ___ del agua dulce del planeta.',opts:['30%','50%','70%'],c:2},
  {s:'Los ___ son los pueblos originarios de Australia.',opts:['Maoríes','Incas','Aborígenes'],c:2},
];
let cmpIdx=0,cmpSel=-1,cmpDone=false;
function showCmp(){
  if(cmpIdx>=cmpData.length){document.getElementById('cmpSent').innerHTML='🎉 ¡Completado!';document.getElementById('cmpOpts').innerHTML='';fin('s-completa');return;}
  const d=cmpData[cmpIdx];
  document.getElementById('cmpProg').textContent=`Oración ${cmpIdx+1} de ${cmpData.length}`;
  document.getElementById('cmpSent').innerHTML=d.s.replace('___','<span class="blank">___</span>');
  const opts=document.getElementById('cmpOpts');opts.innerHTML='';cmpSel=-1;cmpDone=false;
  d.opts.forEach((o,i)=>{const b=document.createElement('button');b.className='cmp-opt';b.textContent=o;b.onclick=()=>{if(cmpDone)return;document.querySelectorAll('.cmp-opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');cmpSel=i;sfx('click');};opts.appendChild(b);});
}
function checkCmp(){
  if(cmpSel<0)return fb('fbCmp','Selecciona una opción.',false);
  cmpDone=true;const opts=document.querySelectorAll('.cmp-opt');
  if(cmpSel===cmpData[cmpIdx].c){opts[cmpSel].classList.add('correct');document.getElementById('cmpSent').innerHTML=cmpData[cmpIdx].s.replace('___',`<span class="blank" style="color:var(--jade);border-color:var(--jade)">${opts[cmpSel].textContent}</span>`);fb('fbCmp','¡Correcto! +5 XP',true);if(!xpTracker.cmp.has(cmpIdx)){xpTracker.cmp.add(cmpIdx);pts(5);}sfx('ok');}
  else{opts[cmpSel].classList.add('wrong');opts[cmpData[cmpIdx].c].classList.add('correct');fb('fbCmp','Incorrecto. Revisa bien la respuesta.',false);sfx('no');}
  setTimeout(()=>{cmpIdx++;document.getElementById('fbCmp').classList.remove('show');showCmp();},1600);
}

// ===================== RETO FINAL =====================
const retoPairs=[
  {
    label:['América','Oceanía'],btnA:'🌎 América',btnB:'🌏 Oceanía',colA:'america',colB:'oceania',
    words:[
      {w:'Río Amazonas',t:'america'},{w:'Gran Barrera de Coral',t:'oceania'},{w:'Los Andes',t:'america'},
      {w:'Australia',t:'oceania'},{w:'CAFTA-DR',t:'america'},{w:'Nueva Zelanda',t:'oceania'},
      {w:'Copán',t:'america'},{w:'Maoríes',t:'oceania'},{w:'OEA',t:'america'},{w:'Canberra',t:'oceania'},
      {w:'Aconcagua',t:'america'},{w:'Melanesia',t:'oceania'}
    ]
  },
  {
    label:['Antártida','América'],btnA:'❄️ Antártida',btnB:'🌎 América',colA:'antartica',colB:'america',
    words:[
      {w:'Pingüinos',t:'antartica'},{w:'Mayas',t:'america'},{w:'Tratado Antártico',t:'antartica'},
      {w:'-89°C',t:'antartica'},{w:'Río Amazonas',t:'america'},{w:'Sin residentes',t:'antartica'},
      {w:'CAFTA-DR',t:'america'},{w:'Hielo eterno',t:'antartica'},{w:'Los Andes',t:'america'},{w:'70% agua dulce',t:'antartica'}
    ]
  },
];
let currentRetoPairIdx=0,retoPool=[],retoOk=0,retoErr=0,retoTimerInt=null,retoSec=30,retoRunning=false,retoCurrent=null;

function updateRetoButtons(){
  const pair=retoPairs[currentRetoPairIdx];
  document.querySelectorAll('.reto-btns .btn')[0].textContent=pair.btnA;
  document.querySelectorAll('.reto-btns .btn')[1].textContent=pair.btnB;
  document.querySelectorAll('.reto-btns .btn')[0].onclick=()=>ansReto(pair.colA);
  document.querySelectorAll('.reto-btns .btn')[1].onclick=()=>ansReto(pair.colB);
}
function startReto(){
  if(retoRunning)return;sfx('click');retoRunning=true;retoOk=0;retoErr=0;retoSec=30;
  retoPool=_shuffle([...retoPairs[currentRetoPairIdx].words,...retoPairs[currentRetoPairIdx].words]);
  showRetoWord();
  retoTimerInt=setInterval(()=>{retoSec--;sfx('tick');document.getElementById('retoTimer').textContent='⏱ '+retoSec;if(retoSec<=10)document.getElementById('retoTimer').style.color='var(--red)';if(retoSec<=0){clearInterval(retoTimerInt);endReto();}},1000);
}
function showRetoWord(){
  if(retoPool.length===0)retoPool=_shuffle([...retoPairs[currentRetoPairIdx].words,...retoPairs[currentRetoPairIdx].words]);
  retoCurrent=retoPool.pop();document.getElementById('retoWord').textContent=retoCurrent.w;
}
function ansReto(t){
  if(!retoRunning||!retoCurrent)return;
  const firstPlay=!xpTracker.reto.has(currentRetoPairIdx);
  if(t===retoCurrent.t){sfx('ok');retoOk++;if(firstPlay)pts(1);}else{sfx('no');retoErr++;if(firstPlay)pts(-1);}
  document.getElementById('retoScore').textContent=`✅ ${retoOk} correctas | ❌ ${retoErr} errores`;showRetoWord();
}
function endReto(){
  retoRunning=false;document.getElementById('retoWord').textContent='🏁 ¡Tiempo!';document.getElementById('retoTimer').style.color='var(--pri)';
  xpTracker.reto.add(currentRetoPairIdx);const total=retoOk+retoErr;const pct=total>0?Math.round((retoOk/total)*100):0;
  fb('fbReto',`Resultado: ${retoOk}/${total} (${pct}%) ¡Bien hecho!`,true);fin('s-reto');sfx('fan');unlockAchievement('reto_hero');
}
function nextRetoPair(){
  sfx('click');clearInterval(retoTimerInt);retoRunning=false;retoSec=30;retoOk=0;retoErr=0;
  currentRetoPairIdx=(currentRetoPairIdx+1)%retoPairs.length;updateRetoButtons();
  document.getElementById('retoTimer').textContent='⏱ 30';document.getElementById('retoTimer').style.color='var(--pri)';
  document.getElementById('retoWord').textContent='¡Prepárate!';document.getElementById('retoScore').textContent='✅ 0 correctas | ❌ 0 errores';
  document.getElementById('fbReto').classList.remove('show');
  showToast(`🔄 Pareja: ${retoPairs[currentRetoPairIdx].label[0]} vs ${retoPairs[currentRetoPairIdx].label[1]}`);
}
function resetReto(){
  sfx('click');clearInterval(retoTimerInt);retoRunning=false;retoSec=30;retoOk=0;retoErr=0;
  document.getElementById('retoTimer').textContent='⏱ 30';document.getElementById('retoTimer').style.color='var(--pri)';
  document.getElementById('retoWord').textContent='¡Prepárate!';document.getElementById('retoScore').textContent='✅ 0 correctas | ❌ 0 errores';
  document.getElementById('fbReto').classList.remove('show');
}

// ===================== TASK GENERATOR =====================
const identifyTaskDB=[
  {s:'El Río Amazonas es el más caudaloso del mundo, con 7,062 km, en América del Sur.',type:'Río más caudaloso del mundo'},
  {s:'Honduras está ubicada en el corazón de América Central, miembro de la OEA.',type:'Región geográfica de Honduras'},
  {s:'Los Andes son la cordillera más larga del mundo (~7,000 km), en América del Sur.',type:'Cordillera más larga del mundo'},
  {s:'El CAFTA-DR facilita el comercio entre Honduras y Estados Unidos sin aranceles.',type:'Acuerdo comercial entre Honduras y EE.UU.'},
  {s:'Australia es el único país que ocupa un continente entero (Oceanía).',type:'País-continente de Oceanía'},
  {s:'La Gran Barrera de Coral (Australia) es el arrecife más grande del mundo (2,300 km).',type:'Arrecife más grande del mundo'},
  {s:'La Antártida no tiene población permanente; solo científicos viven allí temporalmente.',type:'Continente sin residentes permanentes'},
  {s:'El Tratado Antártico (1959) protege la Antártida como zona de paz y ciencia.',type:'Acuerdo internacional que protege la Antártida'},
  {s:'Los aborígenes australianos llevan más de 60,000 años habitando Australia.',type:'Pueblo originario más antiguo del mundo'},
  {s:'Las remesas desde EE.UU. y Canadá representan aproximadamente el 25% del PIB hondureño.',type:'Principal fuente de divisas de Honduras'},
];
const classifyTaskDB=[
  {w:'América',gen:'Continente',n:'42.5M km²',g:'Hemisferio Oeste',t:'35 países, CAFTA-DR, OEA'},
  {w:'Oceanía',gen:'Continente-región',n:'8.5M km²',g:'Hemisferio Sur/Pacífico',t:'Australia, NZ, islas del Pacífico'},
  {w:'Antártida',gen:'Continente',n:'14.2M km²',g:'Polo Sur',t:'Sin residentes permanentes, Tratado 1959'},
  {w:'Amazonas',gen:'Río',n:'7,062 km',g:'América del Sur',t:'El más caudaloso del mundo'},
  {w:'Los Andes',gen:'Cordillera',n:'~7,000 km',g:'América del Sur',t:'Más larga del mundo'},
  {w:'Gran Barrera de Coral',gen:'Arrecife',n:'2,300 km',g:'Costa NE de Australia',t:'Más grande del mundo, UNESCO'},
  {w:'Tratado Antártico',gen:'Acuerdo internacional',n:'54 signatarios',g:'Global',t:'Paz y ciencia en la Antártida'},
  {w:'CAFTA-DR',gen:'Acuerdo comercial',n:'7 países',g:'EE.UU. y Centroamérica',t:'Libre comercio, incluye Honduras'},
];
const completeTaskDB=[
  {s:'El continente más pequeño del mundo es ___ .',opts:['América','Antártida','Oceanía'],ans:'Oceanía'},
  {s:'El río más caudaloso del mundo es el ___ .',opts:['Nilo','Amazonas','Congo'],ans:'Amazonas'},
  {s:'Honduras está en ___ Central.',opts:['Asia','Europa','América'],ans:'América'},
  {s:'La cordillera más larga del mundo es ___ .',opts:['el Himalaya','los Andes','los Alpes'],ans:'los Andes'},
  {s:'El Tratado Antártico fue firmado en ___ .',opts:['1945','1972','1959'],ans:'1959'},
  {s:'Honduras exporta ___ principalmente a EE.UU.',opts:['petróleo','café y textiles','tecnología'],ans:'café y textiles'},
  {s:'La Antártida contiene el ___ del agua dulce del planeta.',opts:['30%','50%','70%'],ans:'70%'},
  {s:'Los ___ son los pueblos originarios de Australia.',opts:['Maoríes','Incas','Aborígenes'],ans:'Aborígenes'},
];
const explainQuestions=[
  {q:'¿Por qué es importante el CAFTA-DR para Honduras? Menciona al menos dos razones.',ans:'El CAFTA-DR elimina aranceles entre Honduras y EE.UU., facilitando la exportación de café, banano y textiles. También permite importar bienes más baratos y abre mercados para el sector maquilador hondureño.'},
  {q:'¿Cuáles son las principales diferencias geográficas entre América, Oceanía y Antártida?',ans:'América es el más extenso (42.5M km², 35 países, diversidad climática). Oceanía es el más pequeño (8.5M km², islas del Pacífico). Antártida (14.2M km²) es el más frío, sin residentes permanentes y cubierto de hielo.'},
  {q:'¿Por qué la Antártida es importante para Honduras y el mundo?',ans:'La Antártida contiene el 70% del agua dulce del planeta. Su deshielo elevaría el nivel del mar amenazando costas de todo el mundo, incluyendo las de Honduras. También es clave para estudiar el cambio climático.'},
  {q:'¿Qué relación existe entre las remesas y la economía de Honduras?',ans:'Las remesas enviadas por hondureños desde EE.UU. y Canadá representan ~25% del PIB de Honduras. Son la principal fuente de divisas del país, superando las exportaciones. Benefician directamente a millones de familias hondureñas.'},
  {q:'¿Qué importancia tienen los pueblos originarios de Oceanía? Menciona al menos dos grupos.',ans:'Los aborígenes australianos son los humanos con mayor antigüedad conocida (60,000+ años), guardianes del arte rupestre más antiguo. Los maoríes de Nueva Zelanda conservan una rica tradición oral, el idioma te reo māori y el haka, que hoy son lengua y símbolo nacional.'},
];
let ansVisible=false;

function genTask(){
  sfx('click');const type=document.getElementById('tgType').value;const count=parseInt(document.getElementById('tgCount').value);
  ansVisible=false;const out=document.getElementById('tgOut');out.innerHTML='';
  if(type==='identify')genIdentifyTask(out,count);
  else if(type==='classify')genClassifyTask(out,count);
  else if(type==='complete')genCompleteTask(out,count);
  else if(type==='explain')genExplainTask(out,count);
  fin('s-tareas');
}
function _instrBlock(out,title,lines){const ib=document.createElement('div');ib.className='tg-instruction-block';ib.innerHTML=`<h4>📋 ${title}</h4>`+lines.map(l=>`<p>${l}</p>`).join('');out.appendChild(ib);}
function genIdentifyTask(out,count){
  _instrBlock(out,'Instrucción',['Copia en tu cuaderno; subraya, colorea o encierra el concepto geográfico indicado en cada oración. Escribe al lado qué tipo de elemento es.','<strong>Ejemplo:</strong> El Amazonas es el río más caudaloso. → <span style="color:var(--jade);font-weight:700;">Río más caudaloso del mundo</span>']);
  _pick(identifyTaskDB,Math.min(count,identifyTaskDB.length)).forEach((item,i)=>{
    const div=document.createElement('div');div.className='tg-task';
    div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.type}</div></div>`;
    out.appendChild(div);
  });
}
function genClassifyTask(out,count){
  _instrBlock(out,'Instrucción',['Copia la siguiente tabla en tu cuaderno. Para cada término geográfico, completa su tipo, extensión, ubicación y función.']);
  const items=_pick(classifyTaskDB,Math.min(count,classifyTaskDB.length));
  const wrap=document.createElement('div');wrap.style.overflowX='auto';
  const th=(t,extra='')=>`<th style="padding:0.3rem 0.4rem;border:1px solid var(--border);font-size:0.72rem;text-align:center;${extra}">${t}</th>`;
  let html=`<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:520px;"><thead><tr style="background:var(--pri-gl);">${th('Término','text-align:left;')}${th('Tipo')}${th('Extensión')}${th('Ubicación')}${th('Función')}</tr></thead><tbody>`;
  items.forEach(it=>{html+=`<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td>`+Array(4).fill(`<td style="padding:0.4rem;border:1px solid var(--border);min-width:50px;"></td>`).join('')+'</tr>';});
  html+='</tbody></table>';wrap.innerHTML=html;out.appendChild(wrap);
  const ans=document.createElement('div');ans.className='tg-answer';ans.style.marginTop='0.8rem';
  ans.innerHTML='<strong>✅ Respuestas:</strong><br>'+items.map(it=>`<strong>${it.w}:</strong> Tipo: ${it.gen} | Extensión: ${it.n} | Ubicación: ${it.g} | Función: ${it.t}`).join('<br>');
  out.appendChild(ans);
}
function genCompleteTask(out,count){
  _instrBlock(out,'Instrucción',['Copia y resuelve en tu cuaderno. Cada oración tiene un espacio ___. Elige y escribe la opción correcta.']);
  const pool=_shuffle([...completeTaskDB]);
  for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';const sent=item.s.replace('___','<span class="tg-blank" style="min-width:90px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${sent}</strong><div style="margin-top:0.4rem;font-size:0.82rem;color:var(--gray);">📝 Opciones: <strong>${item.opts.join(' | ')}</strong></div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}
}
function genExplainTask(out,count){
  _instrBlock(out,'Instrucción',['Copia las siguientes preguntas en tu cuaderno y responde cada una de forma clara y completa.']);
  const pool=_shuffle([...explainQuestions]);
  for(let i=0;i<count;i++){const item=pool[i%pool.length];const div=document.createElement('div');div.className='tg-task';div.innerHTML=`<div class="tg-task-num">${i+1}</div><div class="tg-task-content"><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.3rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.ans}</div></div>`;out.appendChild(div);}
}
function toggleAns(){ansVisible=!ansVisible;document.querySelectorAll('.tg-answer').forEach(el=>el.style.display=ansVisible?'block':'none');sfx('click');}

// ===================== SOPA DE LETRAS =====================
const sopaSets=[
  {
    size:10,
    grid:[
      ['A','M','E','R','I','C','A','X','Y','Z'],
      ['B','X','C','D','F','G','H','I','J','K'],
      ['L','X','A','M','A','Z','O','N','A','S'],
      ['M','X','P','Q','R','S','T','U','V','W'],
      ['O','E','A','X','Y','Z','A','B','C','D'],
      ['P','X','F','G','H','I','J','K','L','M'],
      ['Q','X','N','O','M','A','Y','A','P','R'],
      ['S','X','Q','T','U','V','W','X','Y','Z'],
      ['H','O','N','D','U','R','A','S','A','B'],
      ['C','D','E','F','G','I','J','K','L','N']
    ],
    words:[
      {w:'AMERICA',cells:[[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6]]},
      {w:'AMAZONAS',cells:[[2,2],[2,3],[2,4],[2,5],[2,6],[2,7],[2,8],[2,9]]},
      {w:'OEA',cells:[[4,0],[4,1],[4,2]]},
      {w:'MAYA',cells:[[6,4],[6,5],[6,6],[6,7]]},
      {w:'HONDURAS',cells:[[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,6],[8,7]]}
    ]
  },
  {
    size:10,
    grid:[
      ['O','C','E','A','N','I','A','X','Y','Z'],
      ['P','X','B','C','D','F','G','H','I','J'],
      ['I','A','U','S','T','R','A','L','I','A'],
      ['N','X','K','L','M','N','O','Q','R','S'],
      ['G','X','C','O','R','A','L','M','T','U'],
      ['U','X','V','W','Y','Z','A','B','C','D'],
      ['I','X','E','F','G','H','I','J','K','L'],
      ['N','A','N','T','A','R','T','I','D','A'],
      ['O','X','K','L','M','N','O','P','Q','R'],
      ['S','X','T','U','V','W','X','Y','Z','A']
    ],
    words:[
      {w:'OCEANIA',cells:[[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6]]},
      {w:'AUSTRALIA',cells:[[2,1],[2,2],[2,3],[2,4],[2,5],[2,6],[2,7],[2,8],[2,9]]},
      {w:'PINGUINO',cells:[[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0]]},
      {w:'CORAL',cells:[[4,2],[4,3],[4,4],[4,5],[4,6]]},
      {w:'ANTARTIDA',cells:[[7,1],[7,2],[7,3],[7,4],[7,5],[7,6],[7,7],[7,8],[7,9]]}
    ]
  }
];
let currentSopaSetIdx=0,sopaFoundWords=new Set();
let sopaFirstClickCell=null,sopaPointerStartCell=null,sopaPointerMoved=false,sopaSelectedCells=[];

function getSopaCellSize(){const container=document.getElementById('sopaGrid');if(!container||!container.parentElement)return 28;const avail=container.parentElement.clientWidth-16;const set=sopaSets[currentSopaSetIdx];return Math.max(20,Math.min(32,Math.floor(avail/set.size)));}
function buildSopa(){
  const set=sopaSets[currentSopaSetIdx];const grid=document.getElementById('sopaGrid');grid.innerHTML='';
  const sz=getSopaCellSize();grid.style.gridTemplateColumns=`repeat(${set.size},${sz}px)`;grid.style.gridTemplateRows=`repeat(${set.size},${sz}px)`;
  sopaFirstClickCell=null;sopaSelectedCells=[];
  for(let r=0;r<set.size;r++)for(let c=0;c<set.size;c++){
    const cell=document.createElement('div');cell.className='sopa-cell';cell.style.width=sz+'px';cell.style.height=sz+'px';cell.style.fontSize=Math.max(11,sz-10)+'px';
    cell.textContent=set.grid[r][c];cell.dataset.row=r;cell.dataset.col=c;
    const alreadyFound=set.words.find(w=>sopaFoundWords.has(w.w)&&w.cells.some(([wr,wc])=>wr===r&&wc===c));
    if(alreadyFound)cell.classList.add('sopa-found');
    grid.appendChild(cell);
  }
  setupSopaEvents();
  const wl=document.getElementById('sopaWords');wl.innerHTML='';
  set.words.forEach(wObj=>{const sp=document.createElement('span');sp.className='sopa-w'+(sopaFoundWords.has(wObj.w)?' found':'');sp.id='sw-'+wObj.w;sp.textContent=wObj.w;wl.appendChild(sp);});
}
function setupSopaEvents(){
  const grid=document.getElementById('sopaGrid');
  grid.onpointerdown=e=>{const cell=e.target.closest('.sopa-cell');if(!cell)return;e.preventDefault();grid.setPointerCapture(e.pointerId);sopaPointerStartCell=cell;sopaPointerMoved=false;cell.classList.add('sopa-sel');sopaSelectedCells=[cell];};
  grid.onpointermove=e=>{
    if(!sopaPointerStartCell)return;e.preventDefault();
    const el=document.elementFromPoint(e.clientX,e.clientY);const cell=el?el.closest('.sopa-cell'):null;if(!cell)return;
    const sr=parseInt(sopaPointerStartCell.dataset.row),sc=parseInt(sopaPointerStartCell.dataset.col);
    const er=parseInt(cell.dataset.row),ec=parseInt(cell.dataset.col);
    if(sr!==er||sc!==ec)sopaPointerMoved=true;
    document.querySelectorAll('.sopa-cell.sopa-sel').forEach(c=>c.classList.remove('sopa-sel'));sopaSelectedCells=[];
    getSopaPath(sr,sc,er,ec).forEach(([r,c])=>{const pc=document.querySelector(`#sopaGrid [data-row="${r}"][data-col="${c}"]`);if(pc){pc.classList.add('sopa-sel');sopaSelectedCells.push(pc);}});
  };
  grid.onpointerup=e=>{
    if(!sopaPointerStartCell)return;e.preventDefault();grid.releasePointerCapture(e.pointerId);
    if(sopaPointerMoved&&sopaSelectedCells.length>1){checkSopaSelection();}
    else{
      const cell=sopaPointerStartCell;document.querySelectorAll('.sopa-cell.sopa-sel').forEach(c=>c.classList.remove('sopa-sel'));sopaSelectedCells=[];
      if(!sopaFirstClickCell){sopaFirstClickCell=cell;cell.classList.add('sopa-start');}
      else if(sopaFirstClickCell===cell){cell.classList.remove('sopa-start');sopaFirstClickCell=null;}
      else{
        const sr=parseInt(sopaFirstClickCell.dataset.row),sc=parseInt(sopaFirstClickCell.dataset.col);
        const er=parseInt(cell.dataset.row),ec=parseInt(cell.dataset.col);
        sopaFirstClickCell.classList.remove('sopa-start');sopaFirstClickCell=null;
        getSopaPath(sr,sc,er,ec).forEach(([r,c])=>{const pc=document.querySelector(`#sopaGrid [data-row="${r}"][data-col="${c}"]`);if(pc){pc.classList.add('sopa-sel');sopaSelectedCells.push(pc);}});
        checkSopaSelection();
      }
    }
    sopaPointerStartCell=null;sopaPointerMoved=false;
  };
}
function getSopaPath(r1,c1,r2,c2){const dr=Math.sign(r2-r1),dc=Math.sign(c2-c1);const lr=Math.abs(r2-r1),lc=Math.abs(c2-c1);if(lr!==0&&lc!==0&&lr!==lc)return[[r1,c1]];const len=Math.max(lr,lc);const path=[];for(let i=0;i<=len;i++)path.push([r1+dr*i,c1+dc*i]);return path;}
function checkSopaSelection(){
  const set=sopaSets[currentSopaSetIdx];const word=sopaSelectedCells.map(c=>c.textContent).join('');const wordRev=word.split('').reverse().join('');
  const found=set.words.find(wObj=>!sopaFoundWords.has(wObj.w)&&(wObj.w===word||wObj.w===wordRev));
  if(found){
    sopaFoundWords.add(found.w);
    found.cells.forEach(([r,c])=>{const cell=document.querySelector(`#sopaGrid [data-row="${r}"][data-col="${c}"]`);if(cell){cell.classList.remove('sopa-sel','sopa-start');cell.classList.add('sopa-found');}});
    const sp=document.getElementById('sw-'+found.w);if(sp)sp.classList.add('found');
    if(!xpTracker.sopa.has(found.w)){xpTracker.sopa.add(found.w);pts(1);}sfx('ok');
    if(sopaFoundWords.size===set.words.length){fin('s-sopa');sfx('fan');showToast('🎉 ¡Todas las palabras encontradas!');}
    else showToast('✅ ¡Encontraste: '+found.w+'!');
  }else sfx('no');
  document.querySelectorAll('.sopa-cell.sopa-sel').forEach(c=>c.classList.remove('sopa-sel'));sopaSelectedCells=[];
}
function nextSopaSet(){sfx('click');sopaFoundWords=new Set();currentSopaSetIdx=(currentSopaSetIdx+1)%sopaSets.length;buildSopa();showToast('🔄 Nueva sopa cargada');}
let _sopaResizeTimer=null;
window.addEventListener('resize',()=>{clearTimeout(_sopaResizeTimer);_sopaResizeTimer=setTimeout(()=>{if(document.getElementById('s-sopa').classList.contains('active'))buildSopa();},200);});

// ===================== EVALUACIÓN FINAL =====================
const evalTFBank=[
  {q:'El Río Amazonas es el río más caudaloso del mundo.',a:true},
  {q:'Honduras está ubicada en América del Sur.',a:false},
  {q:'El CAFTA-DR es un acuerdo de libre comercio entre Honduras y EE.UU.',a:true},
  {q:'Oceanía es el continente más pequeño del mundo.',a:true},
  {q:'Australia es a la vez un país y un continente.',a:true},
  {q:'La Antártida tiene una población permanente de más de un millón de personas.',a:false},
  {q:'El Tratado Antártico fue firmado en 1959.',a:true},
  {q:'Los Andes son la cordillera más larga del mundo.',a:true},
  {q:'La Gran Barrera de Coral está en el norte de Nueva Zelanda.',a:false},
  {q:'Las remesas de hondureños en el exterior representan ~25% del PIB de Honduras.',a:true},
  {q:'Los aborígenes australianos tienen más de 60,000 años de presencia en Australia.',a:true},
  {q:'La Antártida contiene el 70% del agua dulce del planeta.',a:true},
  {q:'Los maoríes son originarios de Australia.',a:false},
  {q:'El Aconcagua es la cumbre más alta de América con 6,961 m.',a:true},
  {q:'El Tratado Antártico permite la minería controlada en el continente.',a:false},
];
const evalMCBank=[
  {q:'¿Cuál es el río más caudaloso del mundo?',o:['a) Nilo','b) Congo','c) Amazonas','d) Mississippi'],a:2},
  {q:'¿En qué región se ubica Honduras?',o:['a) América del Norte','b) América del Sur','c) América Central','d) El Caribe'],a:2},
  {q:'¿Cuál es el continente más pequeño del mundo?',o:['a) Europa','b) Antártida','c) Oceanía','d) América del Sur'],a:2},
  {q:'¿Cómo se llama el acuerdo comercial entre Honduras y EE.UU.?',o:['a) MERCOSUR','b) NAFTA','c) AACUE','d) CAFTA-DR'],a:3},
  {q:'¿Qué contiene la Antártida equivalente al 70% del agua dulce del planeta?',o:['a) Lagos subterráneos','b) Ríos congelados','c) Capa de hielo','d) Glaciares flotantes'],a:2},
  {q:'¿Cuál es la cordillera más larga del mundo?',o:['a) El Himalaya','b) Los Alpes','c) Los Andes','d) Las Rocosas'],a:2},
  {q:'¿Cuántos países tiene el continente americano?',o:['a) 25','b) 35','c) 44','d) 54'],a:1},
  {q:'¿Qué pueblo originario de Nueva Zelanda es famoso por el haka?',o:['a) Aborígenes','b) Incas','c) Maoríes','d) Polinesios'],a:2},
  {q:'¿En qué año se firmó el Tratado Antártico?',o:['a) 1945','b) 1959','c) 1972','d) 1991'],a:1},
  {q:'¿Qué exporta Honduras principalmente a EE.UU.?',o:['a) Petróleo','b) Café y textiles','c) Tecnología','d) Minerales'],a:1},
  {q:'¿Cuál es el punto más alto de América?',o:['a) Monte Everest','b) Mont Blanc','c) Aconcagua','d) Monte Rosa'],a:2},
  {q:'¿Cuántos años de presencia tienen los aborígenes en Australia?',o:['a) 10,000','b) 30,000','c) 60,000','d) 100,000'],a:2},
  {q:'¿Qué organismo reúne los 35 países del continente americano?',o:['a) ONU','b) OEA','c) CELAC','d) ALBA'],a:1},
  {q:'¿Cuál es el arrecife de coral más grande del mundo?',o:['a) Barrera de Mesoamérica','b) Gran Barrera de Coral','c) Arrecife del Caribe','d) Barrera de Belize'],a:1},
  {q:'¿Cuál es la principal fuente de divisas de Honduras?',o:['a) Exportaciones de café','b) Turismo','c) Remesas','d) Petróleo'],a:2},
];
const evalCPBank=[
  {q:'El continente más pequeño del mundo es ___ .',a:'Oceanía'},
  {q:'El río más caudaloso del mundo es el ___ .',a:'Amazonas'},
  {q:'Honduras está en ___ Central.',a:'América'},
  {q:'La cordillera más larga del mundo es ___ .',a:'los Andes'},
  {q:'El Tratado Antártico fue firmado en ___ .',a:'1959'},
  {q:'El ___ facilita el comercio entre Honduras y EE.UU.',a:'CAFTA-DR'},
  {q:'La Antártida contiene el ___ del agua dulce del planeta.',a:'70%'},
  {q:'Los ___ son los pueblos originarios de Australia.',a:'aborígenes'},
  {q:'El punto más alto de América es el ___ (6,961 m).',a:'Aconcagua'},
  {q:'Las remesas de hondureños representan ~___ % del PIB de Honduras.',a:'25'},
  {q:'Australia es el único país que es también un ___ .',a:'continente'},
  {q:'Los maoríes son originarios de ___ .',a:'Nueva Zelanda'},
  {q:'La Gran Barrera de Coral tiene ___ km de longitud.',a:'2,300'},
  {q:'La civilización ___ construyó la ciudad arqueológica de Copán en Honduras.',a:'Maya'},
  {q:'La Antártida no tiene ___ permanente.',a:'población'},
];
const evalPRBank=[
  {term:'Amazonas',def:'Río más caudaloso del mundo (7,062 km), América del Sur'},
  {term:'Los Andes',def:'Cordillera más larga del mundo (~7,000 km), América del Sur'},
  {term:'CAFTA-DR',def:'Acuerdo de libre comercio entre Honduras y EE.UU.'},
  {term:'OEA',def:'Organización de los 35 países del continente americano'},
  {term:'Australia',def:'País que a la vez es un continente (Oceanía)'},
  {term:'Gran Barrera de Coral',def:'Arrecife más grande del mundo (2,300 km), Australia'},
  {term:'Antártida',def:'Continente más frío, sin residentes permanentes, con 70% del agua dulce'},
  {term:'Tratado Antártico',def:'Acuerdo de 1959 que protege la Antártida como zona de paz y ciencia'},
  {term:'Aborígenes',def:'Pueblos originarios más antiguos del mundo, de Australia (60,000+ años)'},
  {term:'Remesas',def:'Dinero enviado por hondureños en EE.UU., ~25% del PIB de Honduras'},
  {term:'Maoríes',def:'Pueblo originario de Nueva Zelanda, famosos por el haka'},
  {term:'Copán',def:'Sitio arqueológico maya en Honduras, Patrimonio UNESCO'},
  {term:'Aconcagua',def:'Cumbre más alta de América (6,961 m), en los Andes argentinos'},
  {term:'Pingüinos',def:'Fauna simbólica de la Antártida (18 especies en el mundo)'},
  {term:'Oceanía',def:'El continente más pequeño del mundo (8.5 millones km²)'},
];

function genEval(){
  sfx('click');const cf=evalFormNum;window._currentEvalForm=cf;evalFormNum=(evalFormNum%10)+1;saveProgress();
  document.getElementById('eval-screen-title').textContent=`🎓 Evaluación Final · Forma ${cf} · América, Oceanía y Antártida`;
  evalAnsVisible=false;const out=document.getElementById('evalOut');out.innerHTML='';
  const bar=document.createElement('div');bar.className='eval-score-bar';
  bar.innerHTML=`<div><div class="esb-title">📊 Distribución de puntaje · 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25pts</span><span class="eval-score-pill esp-tf">V/F 25pts</span><span class="eval-score-pill esp-mc">Selección 25pts</span><span class="eval-score-pill esp-pr">Pareados 25pts</span></div>`;
  out.appendChild(bar);

  const cpItems=_pick(evalCPBank,5);
  const s1=document.createElement('div');s1.innerHTML='<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  cpItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item';const qHtml=item.q.replace('___','<span class="eval-blank">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div>`;s1.appendChild(d);});
  out.appendChild(s1);

  const tfItems=_pick(evalTFBank,5);
  const s2=document.createElement('div');s2.innerHTML='<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  tfItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item';d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}"> Falso</label></div><div class="eval-answer">${item.a?'Verdadero':'Falso'}</div>`;s2.appendChild(d);});
  out.appendChild(s2);

  const mcItems=_pick(evalMCBank,5);
  const s3=document.createElement('div');s3.innerHTML='<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  mcItems.forEach((item,i)=>{const d=document.createElement('div');d.className='eval-item';const optsHtml=item.o.map((op,oi)=>`<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join('');d.innerHTML=`<div class="eval-q"><span class="eval-num">${i+11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div>`;s3.appendChild(d);});
  out.appendChild(s3);

  const prItems=_pick(evalPRBank,5);const shuffledDefs=[...prItems].sort(()=>Math.random()-0.5);const letters=['A','B','C','D','E'];
  const s4=document.createElement('div');s4.innerHTML='<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
  const matchCard=document.createElement('div');matchCard.className='eval-item';
  let colLeft='<div class="eval-match-col"><h4>📌 Términos</h4>';prItems.forEach((item,i)=>{colLeft+=`<div class="eval-match-item"><span class="eval-match-letter">${i+16}.</span> <span class="eval-match-line">&nbsp;&nbsp;&nbsp;</span> ${item.term}</div>`;});colLeft+='</div>';
  let colRight='<div class="eval-match-col"><h4>📖 Definiciones</h4>';shuffledDefs.forEach((item,i)=>{colRight+=`<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`;});colRight+='</div>';
  const ansKey=prItems.map((item,i)=>{const letter=letters[shuffledDefs.findIndex(d=>d.def===item.def)];return `${i+16}→${letter}`;}).join(' · ');
  matchCard.innerHTML=`<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div>`;
  s4.appendChild(matchCard);out.appendChild(s4);
  window._evalPrintData={tf:tfItems,mc:mcItems,cp:cpItems,pr:{terms:prItems,shuffledDefs,letters}};
  fin('s-evaluacion');
}

function toggleEvalAns(){evalAnsVisible=!evalAnsVisible;document.querySelectorAll('#evalOut .eval-answer').forEach(el=>el.style.display=evalAnsVisible?'block':'none');sfx('click');}

function printEval(){
  if(!window._evalPrintData){showToast('⚠️ Genera una evaluación primero');return;}sfx('click');
  const forma=window._currentEvalForm||1;const d=window._evalPrintData;
  let s1=`<div class="sec-title"><span>I. Completar el espacio</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div>`;
  d.cp.forEach((it,i)=>{const q=it.q.replace('___','<span class="cp-blank"></span>');s1+=`<div class="cp-row"><span class="qn">${i+1}.</span><span class="cp-text">${q}</span></div>`;});
  let s2=`<div class="sec-title"><span>II. Verdadero o Falso</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div>`;
  d.tf.forEach((it,i)=>{s2+=`<div class="tf-row"><span class="qn">${i+6}.</span><span class="tf-blank"></span><span class="tf-text">${it.q}</span></div>`;});
  let s3=`<div class="sec-title"><span>III. Selección Múltiple</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div><div class="mc-grid">`;
  d.mc.forEach((it,i)=>{const opts=it.o.map((op,oi)=>`<label class="mc-opt"><input type="radio" name="mc${i}"> ${op}</label>`).join('');s3+=`<div class="mc-item"><div class="mc-q"><span class="qn">${i+11}.</span><span>${it.q}</span></div><div class="mc-opts">${opts}</div></div>`;});s3+=`</div>`;
  let colL='<div class="pr-col"><div class="pr-head">📌 Términos</div>';d.pr.terms.forEach((it,i)=>{colL+=`<div class="pr-item"><span class="pr-num">${i+16}.</span><span class="pr-line"></span>${it.term}</div>`;});colL+='</div>';
  let colR='<div class="pr-col"><div class="pr-head">📖 Definiciones</div>';d.pr.shuffledDefs.forEach((it,i)=>{colR+=`<div class="pr-item"><span class="pr-num">${d.pr.letters[i]}.</span>${it.def}</div>`;});colR+='</div>';
  let s4=`<div class="pr-section"><div class="sec-title"><span>IV. Términos Pareados</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div><div class="pr-grid">${colL}${colR}</div></div>`;
  let pR='';pR+=`<div class="p-sec"><div class="p-ttl">I. Completar</div><table class="p-tbl">`;d.cp.forEach((it,i)=>{pR+=`<tr><td class="pn">${i+1}.</td><td class="pa">${it.a}</td></tr>`;});
  pR+=`</table></div><div class="p-sec"><div class="p-ttl">II. V o F</div><table class="p-tbl">`;d.tf.forEach((it,i)=>{pR+=`<tr><td class="pn">${i+6}.</td><td class="pa">${it.a?'V':'F'}</td></tr>`;});
  pR+=`</table></div><div class="p-sec"><div class="p-ttl">III. Selección</div><table class="p-tbl">`;d.mc.forEach((it,i)=>{pR+=`<tr><td class="pn">${i+11}.</td><td class="pa">${it.o[it.a]}</td></tr>`;});
  pR+=`</table></div><div class="p-sec"><div class="p-ttl">IV. Pareados</div><table class="p-tbl">`;d.pr.terms.forEach((it,i)=>{const l=d.pr.letters[d.pr.shuffledDefs.findIndex(df=>df.def===it.def)];pR+=`<tr><td class="pn">${i+16}.</td><td class="pa">${i+16}→${l}</td></tr>`;});pR+=`</table></div>`;
  const doc=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Evaluación América, Oceanía y Antártida · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:12pt;color:#111;background:#fff;padding:4mm 6mm;}.ph{margin-bottom:0.5rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.4rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:11pt;text-align:center;color:#555;margin-top:0.15rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.22rem 0.5rem;margin:0.4rem 0 0.2rem;border-left:4px solid #1a7fa3;background:#e8f4f8;display:flex;justify-content:space-between;align-items:center;}.qn{font-weight:700;min-width:22px;flex-shrink:0;}.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.4;padding:0.22rem 0.2rem;border-bottom:1px solid #eee;}.tf-blank{display:inline-block;min-width:42px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.2rem;}.tf-text{flex:1;}.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.28rem 0.45rem;margin-bottom:0.22rem;break-inside:avoid;}.mc-q{display:flex;gap:0.3rem;font-size:10.5pt;font-weight:700;margin-bottom:0.15rem;}.mc-opts{display:flex;flex-direction:column;gap:0.15rem;margin-left:1.4rem;}.mc-opt{font-size:10pt;display:flex;align-items:center;gap:0.3rem;}.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem;margin-bottom:0.6rem;}.cp-row{display:flex;gap:0.3rem;align-items:baseline;font-size:10.5pt;padding:0.22rem 0.2rem;border-bottom:1px solid #eee;}.cp-text{flex:1;}.cp-blank{display:inline-block;min-width:80px;border-bottom:1.5px solid #111;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9pt;font-weight:400;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:40px;border-bottom:1px solid #555;}.obt-pct{white-space:nowrap;}.pr-section{margin-bottom:0.6rem;}.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.6rem;}.pr-col{}.pr-head{font-size:9.5pt;font-weight:700;color:#1a7fa3;border-bottom:1.5px solid #1a7fa3;padding-bottom:0.15rem;margin-bottom:0.2rem;}.pr-item{display:flex;align-items:baseline;gap:0.25rem;font-size:10pt;padding:0.18rem 0;border-bottom:1px solid #eee;}.pr-num{font-weight:700;min-width:22px;flex-shrink:0;}.pr-line{display:inline-block;min-width:20px;border-bottom:1.5px solid #111;margin-right:0.2rem;}.p-sec{margin-bottom:0.5rem;}.p-ttl{font-size:9.5pt;font-weight:700;color:#1a7fa3;border-bottom:1px solid #1a7fa3;margin-bottom:0.2rem;}.p-tbl{border-collapse:collapse;width:100%;}.p-tbl td{padding:0.15rem 0.3rem;border:1px solid #ddd;font-size:10pt;}.pn{font-weight:700;width:26px;}.pa{font-weight:700;color:#1a7fa3;}@media print{body{padding:4mm;}.ph h2{font-size:10pt;}}</style></head><body>
<div class="ph"><h2>Evaluación · Los Continentes: América, Oceanía y Antártida · Forma ${forma} · II y III Ciclo · Ciencias Sociales</h2>
<div class="ph-line"><strong>Nombre:</strong><span class="ph-fill"></span><strong>Fecha:</strong><span class="ph-m"></span></div>
<div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill"></span><strong>Grado/Sección:</strong><span class="ph-s"></span><strong>Nº Lista:</strong><span class="ph-xs"></span></div>
<div class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</div></div>
${s1}${s2}${s3}${s4}
<div style="page-break-before:always;"><div style="font-size:10pt;font-weight:700;border-bottom:2px solid #1a7fa3;margin-bottom:0.5rem;padding-bottom:0.2rem;">📋 PAUTA DE RESPUESTAS · Forma ${forma}</div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0.4rem;">${pR}</div></div></body></html>`;
  const w=window.open('','_blank');w.document.write(doc);w.document.close();setTimeout(()=>w.print(),400);
}

// ===================== DIPLOMA =====================
function openDiploma(){
  sfx('fan');launchConfetti();
  const pct=getProgress();
  document.getElementById('diplPct').textContent=pct+'%';document.getElementById('diplBar').style.width=pct+'%';
  document.getElementById('diplDate').textContent=new Date().toLocaleDateString('es-HN',{year:'numeric',month:'long',day:'numeric'});
  const stars=pct>=80?'⭐⭐⭐':pct>=50?'⭐⭐':'⭐';document.getElementById('diplStars').textContent=stars;
  const msgs=['¡Sigue explorando el mundo!','¡Buen trabajo, geógrafo!','¡Excelente exploración continental!','¡Eres un maestro de los continentes! 🌎'];
  document.getElementById('diplMsg').textContent=pct>=80?msgs[3]:pct>=60?msgs[2]:pct>=40?msgs[1]:msgs[0];
  const achText=unlockedAch.length>0?'🏅 Logros: '+unlockedAch.map(id=>ACHIEVEMENTS[id].icon+' '+ACHIEVEMENTS[id].label).join(' · '):'Completa actividades para desbloquear logros.';
  document.getElementById('diplAch').textContent=achText;
  document.getElementById('diplomaOverlay').classList.add('open');
}
function closeDiploma(){document.getElementById('diplomaOverlay').classList.remove('open');}
function updateDiplomaName(v){document.getElementById('diplName').textContent=v||'Estudiante';}
function shareWA(){
  const name=document.getElementById('diplName').textContent;const pct=document.getElementById('diplPct').textContent;
  const msg=`🌎 ¡Completé la Misión Los Continentes: América, Oceanía y Antártida!\n📊 Progreso: ${pct} | 👤 ${name}\n🏠 Proyecto Educativo Familia Polanco-Castellanos\n🌐 policastsapien.com`;
  window.open('https://wa.me/?text='+encodeURIComponent(msg),'_blank');
}

// ===================== INIT =====================
window.addEventListener('DOMContentLoaded',()=>{
  initTheme();loadProgress();upFC();buildQz();buildClass();showId();showCmp();updateRetoButtons();
  renderAchPanel();genEval();
  document.getElementById('xpPts').textContent='⭐ '+xp;
  document.getElementById('xpFill').style.width=Math.round((xp/MXP)*100)+'%';
});
