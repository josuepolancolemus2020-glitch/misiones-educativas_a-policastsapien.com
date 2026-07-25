/* ============================================================
   Misión «El Pensamiento Computacional» — versión en inglés
   ------------------------------------------------------------
   Traducción de autor (no automática) para escuelas bilingües.
   Se carga junto a la misión y el motor js/metas-i18n.js la
   activa con el botón 🌐 English de la barra superior.

   Es la ETAPA 1 de 7 de la Ruta del Código: la que se da SIN
   computadora. Aquí no hay simulador ni pseudocódigo, así que —a
   diferencia de Programando un Robot o el Robot Decide— no queda
   ningún identificador en español: todo lo que el alumno lee y
   todo lo que los juegos comparan viaja traducido en el banco.

   Criterio de traducción:
   · Inglés AMERICANO estricto: color, center, catalog, analyze,
     «Student No.».
   · Vocabulario estándar de pensamiento computacional escolar:
     algorithm · step · instruction · exact vs. ambiguous ·
     sequence · decompose / break down · pattern · abstraction ·
     big problem / small part.
   · Lo cultural se explica, no se calca: baleada se conserva (es
     el nombre del platillo) y se explica la primera vez; comal →
     griddle, nance → nance (la fruta conserva su nombre), fresco
     → cool drink, guacal → gourd bowl, lunes cívico → Monday
     flag ceremony, feria escolar → school fair, huerta escolar →
     school garden, pulpería → corner store. Lempira se conserva:
     es la moneda.
   · Los bancos son traducción ÍNDICE A ÍNDICE del español: las
     30 formas deterministas sacan las mismas preguntas, la misma
     pauta y la misma clave ZipGrade en los dos idiomas.
   · La sopa de letras se rehízo con palabras en inglés y sus
     cuadrículas están verificadas (cada palabra aparece una sola
     vez en las 8 direcciones).
   ============================================================ */
(function () {
  'use strict';

  window.MISION_EN = {

    titulo: 'Mission Computational Thinking | policastsapien.com',

    /* ══════════════════════════════════════════════════════
       1. BLOQUES DE CONTENIDO (data-i18n en el HTML)
       ══════════════════════════════════════════════════════ */
    html: {

      hero:
        '<h1>Mission <span>Computational Thinking</span></h1>' +
        '<p class="sub">Learn to think like a programmer without turning on a single computer! 🧠🫓🇭🇳</p>' +
        '<div class="badge">💻 Code Path · Stage 1 of 7 · Programming</div>',

      /* ---------- APRENDE ---------- */
      a1:
        '<h2>🫓 What is an algorithm?</h2>' +
        '<p>An <strong>algorithm</strong> is the <strong>ordered steps</strong> for getting something done. The ' +
        '<strong>recipe for baleadas</strong> (the Honduran folded flour tortilla) is an algorithm: knead the flour, ' +
        'shape the tortilla, cook it on the griddle, spread the beans and fold it. If you change the order, the baleada ' +
        'comes out wrong.</p>' +
        '<div class="vs-grid">' +
        '<div class="vs-box vs-a">' +
        '<h4>🪥 You already use algorithms</h4>' +
        '<p>Brushing your teeth, <strong>raising the flag</strong> at the Monday ceremony or packing your backpack: they are all steps <strong>in order</strong> that you repeat without noticing.</p>' +
        '</div>' +
        '<div class="vs-box vs-b">' +
        '<h4>🔢 The order matters</h4>' +
        '<p>You cannot <em>fold the baleada</em> before <em>making the tortilla</em>, or put your shoes on before your socks. <strong>Changing the order changes the result.</strong></p>' +
        '</div>' +
        '</div>' +
        '<div class="tip">' +
        '<span class="ti">🫓</span>' +
        '<div><strong>Key idea:</strong> writing an algorithm is «programming» with pencil and paper: every step starts with a <b>clear verb</b> (wash, knead, fold) and goes in its place.</div>' +
        '</div>' +
        '<div class="mq-wrap">' +
        '<div class="mq-q">🎮 Mini-quiz: which one of these is an algorithm?</div>' +
        '<div class="mq-opts">' +
        '<button class="mq-opt" onclick="miniQuiz(this,true,\'mqFb1\')">The recipe for baleadas</button>' +
        '<button class="mq-opt" onclick="miniQuiz(this,false,\'mqFb1\')">A stone from the river</button>' +
        '<button class="mq-opt" onclick="miniQuiz(this,false,\'mqFb1\')">The color blue</button>' +
        '</div>' +
        '<div class="mq-fb" id="mqFb1" aria-live="polite"></div>' +
        '</div>',

      a2:
        '<h2>🌫️ Exact vs. ambiguous instructions</h2>' +
        '<p>A computer (or a human robot!) does <strong>EXACTLY</strong> what it is told: it <strong>does not guess</strong>. ' +
        'That is why instructions have to be <strong>exact</strong>.</p>' +
        '<div class="vs-grid">' +
        '<div class="vs-box vs-a">' +
        '<h4>✅ Exact instruction</h4>' +
        '<p>«Add <strong>2 spoonfuls</strong> of beans», «take <strong>3 steps</strong> forward». Anyone who reads it does <strong>the same thing</strong>.</p>' +
        '</div>' +
        '<div class="vs-box vs-b">' +
        '<h4>🌫️ Ambiguous instruction</h4>' +
        '<p>«Put in <strong>a little</strong>», «walk <strong>over there</strong>». Everyone understands something different… and the task <strong>fails</strong>!</p>' +
        '</div>' +
        '</div>' +
        '<div class="tip">' +
        '<span class="ti">💻</span>' +
        '<div><strong>Key fact:</strong> when a program fails, very often it is not the computer’s fault: it is an <b>ambiguous or out-of-order</b> instruction. The machine only obeyed.</div>' +
        '</div>' +
        '<div class="mq-wrap">' +
        '<div class="mq-q">🎮 Mini-quiz: which instruction would EVERYONE understand the same way?</div>' +
        '<div class="mq-opts">' +
        '<button class="mq-opt" onclick="miniQuiz(this,false,\'mqFb2\')">«Put in a little salt»</button>' +
        '<button class="mq-opt" onclick="miniQuiz(this,false,\'mqFb2\')">«Make it look nice»</button>' +
        '<button class="mq-opt" onclick="miniQuiz(this,true,\'mqFb2\')">«Add 2 spoonfuls of sugar»</button>' +
        '</div>' +
        '<div class="mq-fb" id="mqFb2" aria-live="polite"></div>' +
        '</div>',

      a3:
        '<h2>🧩 Decomposing, patterns and abstraction</h2>' +
        '<p>A big problem is scary… until you <strong>break it down</strong> into small parts! To ' +
        '<strong>organize the school fair</strong>: one committee prepares the food, another the games and another invites the ' +
        'families. Each part is easy; together they solve the huge problem.</p>' +
        '<div class="vs-grid">' +
        '<div class="vs-box vs-a">' +
        '<h4>🔁 Patterns</h4>' +
        '<p>What <strong>repeats</strong>? If you already know how to make ONE baleada, you know how to make fifty: you repeat the same pattern. Spotting what repeats <strong>saves work</strong>.</p>' +
        '</div>' +
        '<div class="vs-box vs-b">' +
        '<h4>🗺️ Abstraction</h4>' +
        '<p>Keeping <strong>only what matters</strong>, like a <strong>map</strong>: it does not draw every stone on the road, only what you need to get there.</p>' +
        '</div>' +
        '</div>' +
        '<div class="ex-box">' +
        '<span class="ex-tag ex-d">🧠 Complete computational thinking</span><br>' +
        '<span>Problem: <span class="hl">selling nance drinks at the fair</span> → <span class="hl2">1. I decompose</span> (buy, prepare, sell) · <span class="hl2">2. I look for the pattern</span> (every cup is made the same way) · <span class="hl2">3. I abstract</span> (all that matters: nances, sugar, ice, cups) · <span class="hl2">4. I write the algorithm</span> step by step. 🥤</span>' +
        '</div>',

      /* ---------- CONCEPTOS ---------- */
      e1:
        '<h2>📋 The 4 ideas of computational thinking</h2>' +
        '<p>This is the «language» of the programmer who thinks before programming. With only 4 ideas you can solve enormous problems!</p>' +
        '<table class="instr-tbl">' +
        '<tr><th>Idea</th><th>What is it?</th><th>Honduran example</th></tr>' +
        '<tr><td class="k">Algorithm</td><td>Ordered steps for getting something done</td><td>The recipe for baleadas 🫓</td></tr>' +
        '<tr><td class="k">Instruction</td><td>Each command; it must be exact, not ambiguous</td><td>«Add 2 spoonfuls» ✅ vs. «put in a little» 🌫️</td></tr>' +
        '<tr><td class="k">Decomposition</td><td>Splitting a big problem into small parts</td><td>The school fair: food, games, invitations 🎪</td></tr>' +
        '<tr><td class="k">Pattern</td><td>What repeats; spotting it saves work</td><td>Every tortilla is patted and cooked the same way 🔁</td></tr>' +
        '</table>' +
        '<div class="tip">' +
        '<span class="ti">🗺️</span>' +
        '<div><strong>And as a bonus, abstraction:</strong> keeping only what matters, like a map. For the nance drink the color of the gourd bowl does not matter: the nances, the sugar and the ice are what count.</div>' +
        '</div>' +
        '<div class="mq-wrap">' +
        '<div class="mq-q">🎮 Mini-quiz: splitting «organize the fair» into food, games and invitations is…</div>' +
        '<div class="mq-opts">' +
        '<button class="mq-opt" onclick="miniQuiz(this,false,\'mqFb3\')">A pattern</button>' +
        '<button class="mq-opt" onclick="miniQuiz(this,true,\'mqFb3\')">Decomposition</button>' +
        '<button class="mq-opt" onclick="miniQuiz(this,false,\'mqFb3\')">An ambiguous instruction</button>' +
        '</div>' +
        '<div class="mq-fb" id="mqFb3" aria-live="polite"></div>' +
        '</div>',

      e2:
        '<h2>⚠️ Common mistakes — do not fall for them!</h2>' +
        '<div class="vs-grid">' +
        '<div class="vs-box vs-a">' +
        '<h4>🚫 Believing the computer guesses</h4>' +
        '<p>«It knows what I meant»… NO! The computer runs <strong>exactly</strong> what is written, even if it is wrong.</p>' +
        '</div>' +
        '<div class="vs-box vs-b">' +
        '<h4>🚫 Giving ambiguous commands</h4>' +
        '<p>«Put in a little», «make it look nice»: everyone understands something else. Use instructions with <strong>clear amounts and places</strong>.</p>' +
        '</div>' +
        '</div>' +
        '<div class="vs-grid">' +
        '<div class="vs-box vs-c">' +
        '<h4>🚫 Skipping the order</h4>' +
        '<p>The steps run <strong>in order</strong>, from the first to the last. Folding the baleada before cooking the tortilla ruins the snack.</p>' +
        '</div>' +
        '<div class="vs-box vs-d">' +
        '<h4>🚫 Taking on the whole problem at once</h4>' +
        '<p>Trying to do the WHOLE fair all at once wears anyone out. First you <strong>decompose</strong>, then you divide up the parts.</p>' +
        '</div>' +
        '</div>' +
        '<div class="mq-wrap">' +
        '<div class="mq-q">🎮 Mini-quiz: you wrote «put in sugar» and the drink came out bitter. Who failed?</div>' +
        '<div class="mq-opts">' +
        '<button class="mq-opt" onclick="miniQuiz(this,true,\'mqFb4\')">The instruction: it was ambiguous</button>' +
        '<button class="mq-opt" onclick="miniQuiz(this,false,\'mqFb4\')">The computer: it should have guessed</button>' +
        '<button class="mq-opt" onclick="miniQuiz(this,false,\'mqFb4\')">The sugar</button>' +
        '</div>' +
        '<div class="mq-fb" id="mqFb4" aria-live="polite"></div>' +
        '</div>',

      e3:
        '<h2>🇭🇳 Computational thinking in your everyday life</h2>' +
        '<p>Even if you do not have a computer, you already think like a programmer every time you put steps in order, split up work or spot what repeats.</p>' +
        '<div class="type-grid">' +
        '<div class="type-chip tc-teal"><div class="t-art">🫓 The baleada</div><div class="t-info">Knead → tortilla → beans → fold. Recipe = algorithm!</div></div>' +
        '<div class="type-chip tc-gold"><div class="t-art">🇭🇳 Raising the flag</div><div class="t-info">Line up → tie it on → raise it with the anthem → salute</div></div>' +
        '<div class="type-chip tc-jade"><div class="t-art">🌱 Planting beans</div><div class="t-info">Cotton → bean → light → water it every day</div></div>' +
        '<div class="type-chip tc-amber"><div class="t-art">🎪 The school fair</div><div class="t-info">Decompose: food + games + invitations</div></div>' +
        '</div>' +
        '<div class="tip">' +
        '<span class="ti">💡</span>' +
        '<div><strong>Key fact:</strong> whoever learns to think in steps, parts and patterns already has the hardest part of programming. The computer is only the tool that runs it.</div>' +
        '</div>',

      /* ---------- LAB ---------- */
      labh2: '🔬 Lab: The robot teacher',

      labintro:
        'Play at giving instructions to a «human robot». Pick a <strong>scenario</strong> and beat its ' +
        '<strong>4 challenges</strong>: put the algorithm in order, hunt down the ambiguous instruction, find the missing step ' +
        'and decompose the problem. ⭐ +1 XP per challenge and +2 XP for a complete scenario (first time).',

      labesc:
        '<span class="lab-group-label">🎯 Scenario:</span>' +
        '<button class="lab-btn lab-cont-btn" data-parte="baleada" onclick="labShowParte(\'baleada\')">🫓 The baleada</button>' +
        '<button class="lab-btn lab-cont-btn" data-parte="bandera" onclick="labShowParte(\'bandera\')">🇭🇳 The flag</button>' +
        '<button class="lab-btn lab-cont-btn" data-parte="frijol" onclick="labShowParte(\'frijol\')">🌱 The bean</button>' +
        '<button class="lab-btn lab-cont-btn" data-parte="nance" onclick="labShowParte(\'nance\')">🥤 The drink</button>',

      labdes:
        '<span class="lab-group-label">🧩 Challenge:</span>' +
        '<button class="lab-btn lab-asp-btn" data-asp="orden" onclick="labShowAspecto(\'orden\')">🔢 Put the steps in order</button>' +
        '<button class="lab-btn lab-asp-btn" data-asp="ambigua" onclick="labShowAspecto(\'ambigua\')">🌫️ Hunt the ambiguous one</button>' +
        '<button class="lab-btn lab-asp-btn" data-asp="falta" onclick="labShowAspecto(\'falta\')">❓ The missing step</button>' +
        '<button class="lab-btn lab-asp-btn" data-asp="partes" onclick="labShowAspecto(\'partes\')">🧩 Decompose</button>',

      /* ---------- RECURSOS ---------- */
      rec:
        '<h2>📁 Topic Resources</h2>' +
        '<div style="border:1.5px solid var(--border,#e2e8f0);border-radius:12px;padding:1rem 1.2rem;margin-bottom:1.2rem;background:rgba(0,0,0,0.02);">' +
        '<p style="font-size:0.98rem;font-weight:800;margin-bottom:0.4rem;">📄 Printable study sheet</p>' +
        '<p style="font-size:0.86rem;margin-bottom:0.85rem;">A 7-page study guide (theory, unplugged activities and a test) to print out or work through before the exam.</p>' +
        '<a href="../../fichas/ficha-pensamiento-computacional.html" target="_blank" rel="noopener noreferrer" class="btn btn-pri" style="display:inline-flex;align-items:center;gap:0.5rem;text-decoration:none;font-size:1rem;padding:0.7rem 1.4rem;">📄 Open / Print the study sheet</a>' +
        '</div>' +
        '<p style="font-size:0.9rem;margin-bottom:1rem;">Here you will find support materials for this mission: slide decks, PDF documents, study guides and more. Your teacher will keep adding resources to this folder.</p>' +
        '<a href="https://drive.google.com/drive/folders/1pensamiento_computacional_recursos" target="_blank" rel="noopener noreferrer" class="btn btn-pri" style="display:inline-flex;align-items:center;gap:0.5rem;text-decoration:none;font-size:1rem;padding:0.7rem 1.4rem;">' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 87.3 78" aria-hidden="true">' +
        '<path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H.1c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>' +
        '<path d="M43.65 25L29.9 1.2C28.55 2 27.4 3.1 26.6 4.5L1.3 48.2c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>' +
        '<path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.85 11.5z" fill="#ea4335"/>' +
        '<path d="M43.65 25L57.4 1.2C56.05.4 54.5 0 52.95 0H34.35c-1.55 0-3.1.45-4.45 1.2z" fill="#00832d"/>' +
        '<path d="M59.8 52.7H27.5L13.75 76.5c1.35.8 2.9 1.25 4.45 1.25h50.8c1.55 0 3.1-.45 4.45-1.25z" fill="#2684fc"/>' +
        '<path d="M73.4 26.35l-12.65-21.9c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25l16.15 27.7H87.2c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>' +
        '</svg>' +
        'Open the folder in Google Drive</a>' +
        '<div class="tip" style="margin-top:1.2rem;">' +
        '<span class="ti">💡</span>' +
        '<div>The files open right in your browser. You can download them or view them without a Google account.</div>' +
        '</div>'
    },

    /* ══════════════════════════════════════════════════════
       2. BANCOS DE DATOS (los cambia MISION_APLICAR_IDIOMA)
       Traducción índice a índice: la Forma N saca lo mismo
       en los dos idiomas.
       ══════════════════════════════════════════════════════ */
    data: {

      ACHIEVEMENTS: {
        primer_quiz: { icon: '🧠', label: 'First thinking quiz passed' },
        flash_master: { icon: '🃏', label: 'Every thinking flashcard explored' },
        clasif_pro: { icon: '🗂️', label: 'Expert sorter of instructions and problems' },
        id_master: { icon: '🔍', label: 'Master concept spotter' },
        reto_hero: { icon: '🏆', label: 'Hero of the race against the clock' },
        lab_master: { icon: '🫓', label: 'All 4 robot teacher scenarios completed!' },
        nivel3: { icon: '🧭', label: 'Pattern Hunter! Level 3' },
        nivel5: { icon: '🥇', label: 'Computational Thinker! Level 6' },
        widgets_master: { icon: '🧩', label: 'Computational thinking widgets mastered' }
      },

      lvls: [
        { t: 0, n: 'Beginner 🌱' }, { t: 25, n: 'Step Explorer 🧭' }, { t: 55, n: 'Pattern Hunter 🔍' },
        { t: 90, n: 'Master of Order 📜' }, { t: 130, n: 'Problem Splitter 🧩' },
        { t: 165, n: 'Computational Thinker 🧠' }, { t: 190, n: 'Master of Thinking 🏆' }
      ],

      fcData: [
        { w: 'Computational thinking', a: '🧠 Thinking like a programmer: <strong>putting steps in order</strong>, <strong>splitting problems</strong> and <strong>looking for patterns</strong>, even with no computer!' },
        { w: 'Algorithm', a: '🫓 The <strong>ordered steps</strong> for getting something done, like the <strong>recipe for baleadas</strong>.' },
        { w: 'Instruction', a: '🗣️ A <strong>command</strong> that someone can carry out; it forms each step of an algorithm.' },
        { w: 'Exact instruction', a: '✅ «Add <strong>2 spoonfuls</strong>»: everyone carries it out <strong>the same way</strong>.' },
        { w: 'Ambiguous instruction', a: '🌫️ «Put in <strong>a little</strong>»: everyone understands <strong>something different</strong> and it fails.' },
        { w: 'Sequence', a: '📜 A list of steps <strong>in order</strong>: they are done from the first to the last.' },
        { w: 'Decompose', a: '🧩 <strong>Splitting</strong> a big problem into <strong>small parts</strong> that are easier.' },
        { w: 'Pattern', a: '🔁 Something that <strong>repeats</strong>; spotting it saves work.' },
        { w: 'Abstraction', a: '🗺️ Keeping <strong>only what matters</strong>, the way a <strong>map</strong> does.' },
        { w: 'Big problem', a: '🎪 A huge task (like <strong>organizing the school fair</strong>) that you beat <strong>part by part</strong>.' },
        { w: 'Small part', a: '🍰 A <strong>manageable</strong> piece of a big problem.' },
        { w: 'Step', a: '👣 Each action of an algorithm; it starts with a <strong>clear verb</strong> (wash, cut, glue).' },
        { w: 'Computer', a: '💻 A machine that does <strong>exactly</strong> what it is told: it <strong>guesses nothing</strong>.' },
        { w: 'Order', a: '🔢 The position of the steps: <strong>changing it changes the result</strong>.' }
      ],

      memoPairs: [
        { id: 'algoritmo', t: 'Algorithm', d: '🫓 The recipe for baleadas: ordered steps' },
        { id: 'exacta', t: 'Exact instruction', d: '✅ «Add 2 spoonfuls of beans»' },
        { id: 'ambigua', t: 'Ambiguous instruction', d: '🌫️ «Put in a little salt»' },
        { id: 'descomponer', t: 'Decompose', d: '🧩 The school fair split into parts' },
        { id: 'patron', t: 'Pattern', d: '🔁 What repeats over and over' },
        { id: 'abstraccion', t: 'Abstraction', d: '🗺️ The map: only what matters' }
      ],

      qzData: [
        { q: 'What is an algorithm?', o: ['a) Ordered steps for getting something done', 'b) A kind of computer', 'c) A pretty drawing', 'd) A very big number'], c: 0 },
        { q: 'Which one of these instructions is EXACT?', o: ['a) «Put in a little»', 'b) «Add 2 spoonfuls of sugar»', 'c) «Make it look nice»', 'd) «Bring several things»'], c: 1 },
        { q: 'Why does the instruction «put in a little» fail?', o: ['a) Because it is very long', 'b) Because it has numbers', 'c) Because everyone understands a different amount', 'd) Because it is in English'], c: 2 },
        { q: 'What does a computer do with instructions?', o: ['a) It guesses what we want', 'b) It picks the one it likes', 'c) It changes their order', 'd) It runs exactly what it is told'], c: 3 },
        { q: 'Decomposing a problem means…', o: ['a) Splitting it into small parts', 'b) Erasing it', 'c) Making it bigger', 'd) Hiding it'], c: 0 },
        { q: 'What is a pattern?', o: ['a) A bug in the program', 'b) Something that repeats', 'c) A map', 'd) A computer'], c: 1 },
        { q: 'Abstraction means…', o: ['a) Writing everything in great detail', 'b) Repeating the steps', 'c) Keeping only what matters', 'd) Making a realistic drawing'], c: 2 },
        { q: 'In the baleada recipe, what happens if you change the order of the steps?', o: ['a) Nothing, the order does not matter', 'b) The baleada makes itself', 'c) It tastes better', 'd) The result changes and it comes out wrong'], c: 3 },
        { q: 'To organize the school fair it is best to…', o: ['a) Split it into parts: food, games, invitations', 'b) Do everything at once with no plan', 'c) Wait for it to organize itself', 'd) Cancel it'], c: 0 }
      ],

      classGroups: [
        {
          label: ['Exact instruction', 'Ambiguous instruction'], headA: '✅ Exact instruction', headB: '🌫️ Ambiguous instruction', colA: 'ex', colB: 'am',
          words: [{ w: '«Take 3 steps forward»', t: 'ex' }, { w: '«Walk over there»', t: 'am' }, { w: '«Add 2 spoonfuls of sugar»', t: 'ex' }, { w: '«Put in a little salt»', t: 'am' }, { w: '«Read pages 12 to 15»', t: 'ex' }, { w: '«Make it look nice»', t: 'am' }, { w: '«Cut out a 10 cm square»', t: 'ex' }, { w: '«Bring several things»', t: 'am' }, { w: '«Save 5 lempiras every Monday»', t: 'ex' }, { w: '«Wait a little while»', t: 'am' }]
        },
        {
          label: ['Big problem', 'Small part'], headA: '🎪 Big problem', headB: '🍰 Small part', colA: 'pg', colB: 'pp',
          words: [{ w: 'Organizing the school fair', t: 'pg' }, { w: 'Setting up the food stalls', t: 'pp' }, { w: 'Starting the school garden', t: 'pg' }, { w: 'Getting the seeds', t: 'pp' }, { w: 'Celebrating Children’s Day', t: 'pg' }, { w: 'Buying the piñatas', t: 'pp' }, { w: 'Painting the independence mural', t: 'pg' }, { w: 'Painting one section of the mural', t: 'pp' }]
        },
        {
          label: ['Correct sequence', 'Sequence with a mistake'], headA: '✅ Correct sequence', headB: '❌ Sequence with a mistake', colA: 'ok', colB: 'err',
          words: [{ w: 'Wash → chop → cook', t: 'ok' }, { w: 'Eat → serve → cook', t: 'err' }, { w: 'Plant → water → harvest', t: 'ok' }, { w: 'Harvest → plant → water', t: 'err' }, { w: 'Knead → cook → spread → fold', t: 'ok' }, { w: 'Fold → spread → knead', t: 'err' }, { w: 'Put on socks → put on shoes', t: 'ok' }, { w: 'Put on shoes → put on socks', t: 'err' }]
        },
        {
          label: ['From computational thinking', 'From another subject'], headA: '💻 Computational thinking', headB: '📚 Another subject', colA: 'prog', colB: 'otro',
          words: [{ w: 'Algorithm', t: 'prog' }, { w: 'Photosynthesis', t: 'otro' }, { w: 'Pattern', t: 'prog' }, { w: 'Noun', t: 'otro' }, { w: 'Decompose', t: 'prog' }, { w: 'Peninsula', t: 'otro' }, { w: 'Abstraction', t: 'prog' }, { w: 'Fraction', t: 'otro' }, { w: 'Sequence', t: 'prog' }, { w: 'Mayan stela', t: 'otro' }]
        }
      ],

      idData: [
        { s: ['An', 'algorithm', 'is', 'a', 'list', 'of', 'steps', 'in', 'order.'], c: 1, art: 'The word that names the ordered steps for getting something done' },
        { s: ['«Add', '2', 'spoonfuls»', 'is', 'an', 'exact', 'instruction.'], c: 5, art: 'The word that says the instruction is clear and precise' },
        { s: ['«Put', 'in', 'a', 'little»', 'is', 'an', 'ambiguous', 'instruction.'], c: 6, art: 'The word that says the order is confusing' },
        { s: ['Decomposing', 'is', 'splitting', 'a', 'problem', 'into', 'parts.'], c: 0, art: 'The action of splitting a big problem' },
        { s: ['A', 'pattern', 'is', 'something', 'that', 'repeats.'], c: 1, art: 'The name for what repeats over and over' },
        { s: ['Abstraction', 'keeps', 'only', 'what', 'matters.'], c: 0, art: 'The word that names keeping only what matters' },
        { s: ['The', 'computer', 'does', 'not', 'guess:', 'it', 'obeys', 'its', 'program.'], c: 1, art: 'The machine that does exactly what it is told' },
        { s: ['In', 'an', 'algorithm', 'the', 'order', 'of', 'the', 'steps', 'matters', 'a', 'lot.'], c: 4, art: 'What cannot be changed without changing the result' }
      ],

      cmpData: [
        { s: 'The ordered steps for getting something done make up an ___.', opts: ['algorithm', 'pattern', 'map'], c: 0 },
        { s: '«Add 2 spoonfuls» is an ___ instruction.', opts: ['ambiguous', 'exact', 'useless'], c: 1 },
        { s: '«Put in a little» fails because it is an ___ instruction.', opts: ['exact', 'short', 'ambiguous'], c: 2 },
        { s: 'Splitting a big problem into small parts is called ___.', opts: ['decomposing', 'erasing', 'guessing'], c: 0 },
        { s: 'Something that repeats over and over is a ___.', opts: ['step', 'pattern', 'verb'], c: 1 },
        { s: 'Keeping only what matters, like a map, is called ___.', opts: ['abstraction', 'decoration', 'addition'], c: 0 },
        { s: 'The computer does ___ what it is told.', opts: ['more or less', 'exactly', 'sometimes'], c: 1 },
        { s: 'In an algorithm the ___ of the steps matters a lot.', opts: ['color', 'size', 'order'], c: 2 }
      ],

      routeSets: [
        { label: 'Brushing your teeth (in order)', steps: ['Put toothpaste on the brush', 'Brush up and down', 'Rinse your mouth', 'Wash the brush and put it away'] },
        { label: 'Making corn tortillas (in order)', steps: ['Mix the masa with water', 'Roll the little balls', 'Pat out the tortilla', 'Cook it on the griddle', 'Keep them in the cloth napkin'] },
        { label: 'Making the morning coffee (in order)', steps: ['Put the water on to boil', 'Add the coffee to the strainer', 'Strain the coffee into the cup', 'Sweeten it with 2 teaspoons of sugar'] },
        { label: 'Packing your backpack for school (in order)', steps: ['Check the class schedule', 'Pack the notebooks for the day', 'Put in the pencil and the eraser', 'Close the backpack and leave it ready'] },
        { label: 'Feeding the chickens (in order)', steps: ['Fill the gourd bowl with corn', 'Open the chicken coop', 'Scatter the corn on the ground', 'Change the water in the trough'] }
      ],

      enfermedadData: [
        { disease: '«Take 3 steps forward»', characteristic: 'Exact instruction', opts: ['Exact instruction', 'Ambiguous instruction'] },
        { disease: '«Put in a little salt»', characteristic: 'Ambiguous instruction', opts: ['Ambiguous instruction', 'Exact instruction'] },
        { disease: '«Add 2 spoonfuls of sugar»', characteristic: 'Exact instruction', opts: ['Exact instruction', 'Ambiguous instruction'] },
        { disease: '«Make it look nice»', characteristic: 'Ambiguous instruction', opts: ['Ambiguous instruction', 'Exact instruction'] },
        { disease: '«Read pages 12 to 15»', characteristic: 'Exact instruction', opts: ['Exact instruction', 'Ambiguous instruction'] },
        { disease: '«Bring several things»', characteristic: 'Ambiguous instruction', opts: ['Ambiguous instruction', 'Exact instruction'] },
        { disease: '«Cut out a 10 cm square»', characteristic: 'Exact instruction', opts: ['Exact instruction', 'Ambiguous instruction'] },
        { disease: '«Wait a little while»', characteristic: 'Ambiguous instruction', opts: ['Ambiguous instruction', 'Exact instruction'] },
        { disease: '«Save 5 lempiras every Monday»', characteristic: 'Exact instruction', opts: ['Exact instruction', 'Ambiguous instruction'] },
        { disease: '«Pour in plenty of water»', characteristic: 'Ambiguous instruction', opts: ['Ambiguous instruction', 'Exact instruction'] }
      ],

      neuronPartes: [
        { problema: 'Organizing grandma’s birthday', correctas: ['Make the guest list', 'Prepare the cake and the food', 'Decorate the house'], extra: ['Raise the flag', 'Solve a long division', 'Paint the school'] },
        { problema: 'Doing the math homework', correctas: ['Read the instructions carefully', 'Solve the exercises one by one', 'Check the answers'], extra: ['Water the garden', 'Buy nances', 'Fold the laundry'] },
        { problema: 'Cleaning the classroom on Friday', correctas: ['Put the chairs up on the desks', 'Sweep and mop the floor', 'Take the trash where it belongs'], extra: ['Sing the anthem', 'Plant a pine tree', 'Make a cool drink'] },
        { problema: 'Setting up the school food sale', correctas: ['Decide what food to sell', 'Buy the ingredients', 'Organize the selling shifts'], extra: ['Watch television', 'Count the clouds', 'Paint a map'] },
        { problema: 'Taking care of the chickens for a week', correctas: ['Give them corn every morning', 'Change their water', 'Clean the chicken coop'], extra: ['Paint a mural', 'Write a poem', 'Play soccer'] }
      ],

      retoPairs: [
        {
          label: ['Exact instruction', 'Ambiguous instruction'], btnA: '✅ Exact', btnB: '🌫️ Ambiguous', colA: 'ex', colB: 'am',
          words: [{ w: '«Take 3 steps forward»', t: 'ex' }, { w: '«Walk over there»', t: 'am' }, { w: '«Add 2 spoonfuls»', t: 'ex' }, { w: '«Put in a little»', t: 'am' }, { w: '«Read pages 12 to 15»', t: 'ex' }, { w: '«Make it look nice»', t: 'am' }, { w: '«Cut out a 10 cm square»', t: 'ex' }, { w: '«Bring several things»', t: 'am' }, { w: '«Save 5 lempiras every Monday»', t: 'ex' }, { w: '«Move a little»', t: 'am' }]
        },
        {
          label: ['Big problem', 'Small part'], btnA: '🎪 Big problem', btnB: '🍰 Small part', colA: 'pg', colB: 'pp',
          words: [{ w: 'Organizing the school fair', t: 'pg' }, { w: 'Setting up one food stall', t: 'pp' }, { w: 'Starting the school garden', t: 'pg' }, { w: 'Getting the seeds', t: 'pp' }, { w: 'Celebrating Children’s Day', t: 'pg' }, { w: 'Buying the piñatas', t: 'pp' }, { w: 'Painting the independence mural', t: 'pg' }, { w: 'Painting one section of the mural', t: 'pp' }]
        },
        {
          label: ['From computational thinking', 'From another subject'], btnA: '💻 Thinking', btnB: '📚 Another subject', colA: 'prog', colB: 'otro',
          words: [{ w: 'Algorithm', t: 'prog' }, { w: 'Photosynthesis', t: 'otro' }, { w: 'Pattern', t: 'prog' }, { w: 'Noun', t: 'otro' }, { w: 'Decompose', t: 'prog' }, { w: 'Peninsula', t: 'otro' }, { w: 'Abstraction', t: 'prog' }, { w: 'Fraction', t: 'otro' }, { w: 'Sequence', t: 'prog' }, { w: 'Mayan stela', t: 'otro' }]
        }
      ],

      algoritmoTaskDB: [
        { tarea: 'Making the bed', pasos: ['Take off whatever is on top', 'Straighten the sheet', 'Arrange the pillow', 'Fold the bedspread and smooth it out'] },
        { tarea: 'Washing the lunch dishes', pasos: ['Scrape off the leftovers', 'Soap up each dish', 'Rinse with clean water', 'Leave them to drain'] },
        { tarea: 'Sweeping the yard', pasos: ['Get the broom and the dustpan', 'Sweep from one end to the other', 'Gather the trash with the dustpan', 'Throw it in the trash can'] },
        { tarea: 'Feeding the dog', pasos: ['Wash the dog’s bowl', 'Serve 2 cups of food', 'Change the water in the dish', 'Put the food bag away'] },
        { tarea: 'Making rice for lunch', pasos: ['Wash the rice', 'Fry it lightly with a little oil', 'Add 2 cups of water and salt', 'Cook on low heat until it dries out'] },
        { tarea: 'Folding the clean laundry', pasos: ['Gather the dry laundry', 'Sort it by person', 'Fold each garment', 'Put it away where it belongs'] },
        { tarea: 'Watering the house plants', pasos: ['Fill the watering can', 'Water each plant without flooding it', 'Pull off the dry leaves', 'Put the watering can away'] },
        { tarea: 'Setting the table for lunch', pasos: ['Wipe the table', 'Put out one plate per person', 'Set the silverware and the glasses', 'Bring the food to the middle'] },
        { tarea: 'Making a nance drink', pasos: ['Wash the nances', 'Mash them in a cup of water', 'Strain the mixture', 'Add sugar and ice', 'Serve the drink'] },
        { tarea: 'Getting your uniform ready for tomorrow', pasos: ['Check that it is clean', 'Iron it carefully', 'Hang it on the hanger', 'Leave your clean shoes underneath'] }
      ],

      _exactasDB: ['Take {n} steps forward', 'Add {n} spoonfuls of sugar', 'Read pages {n} to {m}', 'Cut out a square {n} cm on each side', 'Save {n} lempiras every Monday', 'Write {n} sentences in your notebook', 'Cut {n} slices of cheese', 'Walk {n} blocks and turn right'],

      _ambiguasDB: ['Put in a little salt', 'Walk over there', 'Make it look nice', 'Bring several things', 'Move a little', 'Wait a little while', 'Draw something big', 'Pour in plenty of water', 'Go fast', 'Grab whatever'],

      descomponDB: [
        { problema: 'Organizing the school fair', partes: ['Form the working committees', 'Set up the food and game stalls', 'Invite the families'] },
        { problema: 'Celebrating Children’s Day', partes: ['Plan the games and prizes', 'Get the food and the piñatas', 'Decorate the classroom'] },
        { problema: 'Painting the independence mural', partes: ['Research the founding fathers', 'Draw the sketch', 'Paint the mural section by section'] },
        { problema: 'Starting the school garden', partes: ['Prepare the soil', 'Plant the seeds', 'Organize the watering shifts'] },
        { problema: 'Organizing the soccer championship', partes: ['Sign up the teams', 'Schedule the games', 'Get the prize'] },
        { problema: 'Preparing the end-of-year ceremony', partes: ['Rehearse the performances', 'Prepare the certificates', 'Decorate the hall'] },
        { problema: 'Keeping the school clean', partes: ['Organize the cleaning shifts', 'Get brooms and trash cans', 'Check every classroom on Friday'] },
        { problema: 'Making a wall newspaper', partes: ['Choose the topic of the month', 'Share out the stories among the team', 'Put the board together and decorate it'] }
      ],

      /* Sopa rehecha con palabras en inglés: cada palabra aparece UNA sola vez
         en las 8 direcciones (verificado por script antes de pegarla aquí). */
      sopaSets: [
        {
          size: 10, grid: [
            ['F', 'M', 'S', 'D', 'T', 'L', 'T', 'M', 'Q', 'H'],
            ['G', 'H', 'S', 'U', 'S', 'R', 'Q', 'Z', 'C', 'P'],
            ['U', 'T', 'F', 'R', 'A', 'C', 'S', 'G', 'Z', 'A'],
            ['K', 'I', 'I', 'P', 'T', 'X', 'L', 'U', 'W', 'T'],
            ['W', 'R', 'F', 'B', 'W', 'O', 'C', 'B', 'G', 'T'],
            ['A', 'O', 'N', 'S', 'T', 'E', 'P', 'V', 'O', 'E'],
            ['W', 'G', 'J', 'K', 'H', 'G', 'J', 'A', 'Z', 'R'],
            ['A', 'L', 'V', 'T', 'C', 'A', 'X', 'E', 'U', 'N'],
            ['M', 'A', 'Z', 'P', 'F', 'Z', 'H', 'H', 'I', 'L'],
            ['B', 'O', 'R', 'D', 'E', 'R', 'S', 'P', 'L', 'V']
          ], words: [
            { w: 'ALGORITHM', cells: [[8, 1], [7, 1], [6, 1], [5, 1], [4, 1], [3, 1], [2, 1], [1, 1], [0, 1]] },
            { w: 'STEP', cells: [[5, 3], [5, 4], [5, 5], [5, 6]] },
            { w: 'ORDER', cells: [[9, 1], [9, 2], [9, 3], [9, 4], [9, 5]] },
            { w: 'EXACT', cells: [[7, 7], [7, 6], [7, 5], [7, 4], [7, 3]] },
            { w: 'PATTERN', cells: [[1, 9], [2, 9], [3, 9], [4, 9], [5, 9], [6, 9], [7, 9]] },
            { w: 'PART', cells: [[3, 3], [2, 4], [1, 5], [0, 6]] }
          ]
        },
        {
          size: 10, grid: [
            ['Y', 'M', 'Q', 'E', 'K', 'H', 'N', 'R', 'D', 'S'],
            ['R', 'E', 'V', 'P', 'C', 'B', 'I', 'S', 'I', 'Q'],
            ['Q', 'L', 'S', 'I', 'J', 'B', 'R', 'E', 'V', 'Q'],
            ['L', 'B', 'N', 'C', 'Y', 'E', 'S', 'Q', 'I', 'O'],
            ['O', 'O', 'P', 'E', 'K', 'G', 'S', 'U', 'D', 'N'],
            ['G', 'R', 'E', 'R', 'O', 'X', 'F', 'E', 'E', 'A'],
            ['I', 'P', 'G', 'U', 'G', 'P', 'R', 'N', 'W', 'N'],
            ['C', 'J', 'D', 'N', 'X', 'L', 'J', 'C', 'Y', 'L'],
            ['O', 'F', 'B', 'F', 'S', 'A', 'A', 'E', 'E', 'P'],
            ['D', 'V', 'J', 'C', 'U', 'N', 'T', 'F', 'H', 'V']
          ], words: [
            { w: 'PROBLEM', cells: [[6, 1], [5, 1], [4, 1], [3, 1], [2, 1], [1, 1], [0, 1]] },
            { w: 'RECIPE', cells: [[5, 3], [4, 3], [3, 3], [2, 3], [1, 3], [0, 3]] },
            { w: 'DIVIDE', cells: [[0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8]] },
            { w: 'SEQUENCE', cells: [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7], [8, 7]] },
            { w: 'LOGIC', cells: [[3, 0], [4, 0], [5, 0], [6, 0], [7, 0]] },
            { w: 'PLAN', cells: [[6, 5], [7, 5], [8, 5], [9, 5]] }
          ]
        }
      ],

      /* ---------- Evaluación conceptual ---------- */
      evalTFBank: [
        { q: 'An algorithm is a list of ordered steps for getting something done.', a: true },
        { q: '«Put in a little salt» is an exact instruction.', a: false },
        { q: '«Add 2 spoonfuls of sugar» is an exact instruction.', a: true },
        { q: 'The computer guesses what we mean.', a: false },
        { q: 'Decomposing means splitting a big problem into small parts.', a: true },
        { q: 'A pattern is something that repeats.', a: true },
        { q: 'Abstraction is keeping only what matters, the way a map does.', a: true },
        { q: 'The order of the steps of an algorithm does not matter.', a: false },
        { q: 'The recipe for baleadas is an algorithm.', a: true },
        { q: 'Brushing your teeth cannot be written as an algorithm.', a: false },
        { q: 'A big problem is solved better by splitting it into parts.', a: true },
        { q: 'The computer does exactly what it is told.', a: true },
        { q: '«Walk over there» is an order that anyone would carry out the same way.', a: false },
        { q: 'Every step of an algorithm should start with a clear verb.', a: true },
        { q: 'Looking for patterns saves work, because what repeats is done the same way.', a: true }
      ],

      evalMCBank: [
        { q: 'What is an algorithm?', o: ['Ordered steps for getting something done', 'A kind of computer', 'A pretty drawing', 'A problem with no solution'], a: 0 },
        { q: 'Which one of these instructions is EXACT?', o: ['Walk over there', 'Take 3 steps forward', 'Move a little', 'Go fast'], a: 1 },
        { q: 'Why does the instruction «put in a little» fail?', o: ['Because it is very long', 'Because everyone understands a different amount', 'Because it is in English', 'Because it has numbers'], a: 1 },
        { q: 'What does a computer do with instructions?', o: ['It guesses what we want', 'It picks the one it likes', 'It runs exactly what it is told', 'It changes their order'], a: 2 },
        { q: 'Decomposing a problem means…', o: ['Erasing it', 'Making it bigger', 'Copying it', 'Splitting it into small parts'], a: 3 },
        { q: 'What is a pattern?', o: ['Something that repeats', 'A mistake', 'A drawing', 'A computer'], a: 0 },
        { q: 'Abstraction means…', o: ['Writing everything in detail', 'Keeping only what matters', 'Making a realistic drawing', 'Repeating the steps'], a: 1 },
        { q: 'Which one is an algorithm from your everyday life?', o: ['The color blue', 'A stone', 'Brushing your teeth step by step', 'A number'], a: 2 },
        { q: 'To organize the school fair it is best to…', o: ['Do everything at once with no plan', 'Wait for it to organize itself', 'Cancel it', 'Split it into parts: food, games, invitations'], a: 3 },
        { q: 'In the baleada recipe, what happens if you change the order of the steps?', o: ['The result changes and it comes out wrong', 'Nothing happens', 'The baleada makes itself', 'It tastes better'], a: 0 },
        { q: 'Which one of these instructions is AMBIGUOUS?', o: ['Add 2 spoonfuls of beans', 'Put in as many beans as you like', 'Cook the tortilla 1 minute per side', 'Cut 3 slices of cheese'], a: 1 },
        { q: 'A good algorithm step starts with…', o: ['A riddle', 'A greeting', 'A clear verb (wash, cut, glue)', 'A joke'], a: 2 },
        { q: 'Which small part belongs to the big problem «starting the school garden»?', o: ['Buying a television', 'Painting the flag', 'Making a cool drink', 'Preparing the soil'], a: 3 },
        { q: 'A map is an example of abstraction because…', o: ['It shows only what matters about the place', 'It shows every stone on the road', 'It is made of paper', 'It has colors'], a: 0 },
        { q: 'What is computational thinking?', o: ['Using the computer all day', 'Thinking in ordered steps, parts and patterns before acting', 'Memorizing numbers', 'Writing fast'], a: 1 }
      ],

      evalCPBank: [
        { q: 'The ordered steps for getting something done make up an ___.', a: 'algorithm' },
        { q: 'An instruction that everyone understands and carries out the same way is an ___ instruction.', a: 'exact' },
        { q: '«Put in a little» is an ___ instruction.', a: 'ambiguous' },
        { q: 'Splitting a big problem into small parts is called ___.', a: 'decomposing' },
        { q: 'Something that repeats over and over is a ___.', a: 'pattern' },
        { q: 'Keeping only what matters, the way a map does, is called ___.', a: 'abstraction' },
        { q: 'The computer does ___ what it is told.', a: 'exactly' },
        { q: 'In an algorithm the ___ of the steps matters a lot.', a: 'order' },
        { q: 'A list of steps in order is a ___.', a: 'sequence' },
        { q: 'Every step of an algorithm starts with a clear ___.', a: 'verb' },
        { q: 'A big problem is beaten by splitting it into small ___.', a: 'parts' },
        { q: 'A ___ shows only what matters about a place: it is an abstraction.', a: 'map' },
        { q: '___ thinking helps us solve problems the way programmers do.', a: 'computational' },
        { q: 'Following a cooking ___ means running an algorithm.', a: 'recipe' },
        { q: 'The machine that runs instructions without guessing anything is the ___.', a: 'computer' }
      ],

      evalPRBank: [
        { term: 'Algorithm', def: 'Ordered steps for getting a task done' },
        { term: 'Exact instruction', def: 'A command that everyone carries out the same way' },
        { term: 'Ambiguous instruction', def: 'A confusing command that everyone understands differently' },
        { term: 'Sequence', def: 'A list of steps in order' },
        { term: 'Decompose', def: 'Split a big problem into small parts' },
        { term: 'Pattern', def: 'Something that repeats over and over' },
        { term: 'Abstraction', def: 'Keeping only what matters' },
        { term: 'Step', def: 'Each action of the algorithm; it starts with a verb' },
        { term: 'Big problem', def: 'A huge task that is beaten part by part' },
        { term: 'Small part', def: 'A manageable piece of a problem' },
        { term: 'Computer', def: 'It does exactly what it is told' },
        { term: 'Order', def: 'The position of the steps; changing it changes the result' },
        { term: 'Recipe', def: 'A cooking algorithm, like the one for baleadas' },
        { term: 'Map', def: 'An abstraction of a place: only what matters' },
        { term: 'Computational thinking', def: 'Thinking in steps, parts and patterns' }
      ],

      /* ---------- Prueba operativa ---------- */
      opOrdenBank: [
        { tarea: 'Making a baleada', pasos: ['Knead the flour', 'Cook the tortilla on the griddle', 'Spread the beans', 'Fold it and serve it'] },
        { tarea: 'Brushing your teeth', pasos: ['Put toothpaste on the brush', 'Brush up and down', 'Rinse your mouth', 'Put the brush away'] },
        { tarea: 'Raising the flag at the Monday ceremony', pasos: ['Line up in the yard', 'Tie the flag to the rope', 'Raise it with the anthem', 'Give the salute'] },
        { tarea: 'Planting a bean in a cup', pasos: ['Put damp cotton in the cup', 'Place the bean on it', 'Leave it near the light', 'Water it every day'] },
        { tarea: 'Making a nance drink', pasos: ['Wash the nances', 'Mash them with water', 'Strain the mixture', 'Add sugar and ice', 'Serve the drink'] },
        { tarea: 'Getting ready to come to school', pasos: ['Get up early', 'Shower and get dressed', 'Have breakfast', 'Check the backpack', 'Leave on time'] },
        { tarea: 'Doing the homework', pasos: ['Take out the notebook', 'Read the instructions', 'Solve the exercises', 'Check the answers'] },
        { tarea: 'Feeding the chickens', pasos: ['Fill the gourd bowl with corn', 'Open the chicken coop', 'Scatter the corn on the ground', 'Change the water in the trough'] },
        { tarea: 'Sending a letter', pasos: ['Write the letter', 'Put it in the envelope', 'Write the name of the person it goes to', 'Hand it in at the post office'] },
        { tarea: 'Making corn tortillas', pasos: ['Mix the masa', 'Roll the little balls', 'Pat out the tortilla', 'Cook it on the griddle', 'Keep them in the cloth napkin'] }
      ],

      opEABank: [
        { txt: 'Take 3 steps forward', a: 'E' },
        { txt: 'Add 2 spoonfuls of sugar', a: 'E' },
        { txt: 'Read pages 12 to 15 of the book', a: 'E' },
        { txt: 'Cut out a square 10 cm on each side', a: 'E' },
        { txt: 'Save 5 lempiras every Monday', a: 'E' },
        { txt: 'Write your name in the top right corner', a: 'E' },
        { txt: 'Walk 2 blocks and turn right', a: 'E' },
        { txt: 'Fill the glass up to the marked line', a: 'E' },
        { txt: 'Cut 3 slices of cheese', a: 'E' },
        { txt: 'Put in a little salt', a: 'A' },
        { txt: 'Walk over there', a: 'A' },
        { txt: 'Make it look nice', a: 'A' },
        { txt: 'Bring several things', a: 'A' },
        { txt: 'Move a little', a: 'A' },
        { txt: 'Wait a little while', a: 'A' },
        { txt: 'Draw something big', a: 'A' },
        { txt: 'Go fast', a: 'A' },
        { txt: 'Pour in plenty of water', a: 'A' }
      ],

      opFaltaBank: [
        { tarea: 'Making a baleada', pasos: ['Knead the flour', 'Cook the tortilla', '___', 'Fold the baleada and serve it'], correcta: 'Spread the beans and the cheese', distractores: ['Wash the griddle', 'Put the flour away', 'Eat the baleada'] },
        { tarea: 'Washing your hands', pasos: ['Turn on the faucet', 'Wet your hands', '___', 'Rinse and dry them'], correcta: 'Scrub with soap', distractores: ['Close your eyes', 'Comb your hair', 'Dry the floor'] },
        { tarea: 'Planting a bean', pasos: ['Put damp cotton in the cup', '___', 'Leave the cup in the light', 'Water it every day'], correcta: 'Place the bean on the cotton', distractores: ['Eat the bean', 'Cover the cup with stones', 'Hide the cup'] },
        { tarea: 'Making a nance drink', pasos: ['Wash the nances', 'Mash them with water', '___', 'Add sugar and ice'], correcta: 'Strain the mixture', distractores: ['Freeze the whole nances', 'Throw out the water', 'Paint the glass'] },
        { tarea: 'Raising the flag', pasos: ['Line up', '___', 'Raise the flag with the anthem', 'Give the salute'], correcta: 'Tie the flag to the rope', distractores: ['Fold the flag and put it away', 'Clap really loudly', 'Climb up the flagpole'] },
        { tarea: 'Coming to school', pasos: ['Get up early', 'Shower and get dressed', '___', 'Leave the house'], correcta: 'Have breakfast and check the backpack', distractores: ['Go back to bed', 'Watch television', 'Take off your shoes'] },
        { tarea: 'Doing the homework', pasos: ['Take out the notebook', 'Read the instructions', 'Solve the exercises', '___'], correcta: 'Check the answers', distractores: ['Erase everything', 'Hide the notebook', 'Rip out the page'] },
        { tarea: 'Sending a letter', pasos: ['Write the letter', '___', 'Write the address on the envelope', 'Take it to the post office'], correcta: 'Put it in the envelope', distractores: ['Burn it', 'Soak it in water', 'Draw flowers on it'] }
      ],

      opVidaBank: [
        { tema: 'Making a baleada for the snack break', pasos: ['Knead the flour with water', 'Shape the tortilla and cook it on the griddle', 'Spread beans and cheese', 'Fold it and serve it'] },
        { tema: 'Washing your hands before the snack break', pasos: ['Turn on the faucet', 'Wet your hands', 'Scrub with soap for 20 seconds', 'Rinse well', 'Turn off the faucet and dry them'] },
        { tema: 'Raising the flag at the Monday ceremony', pasos: ['Line up in the yard', 'Tie the flag to the rope', 'Raise it slowly while the anthem plays', 'Give the salute in silence', 'Go back to the classroom in an orderly line'] },
        { tema: 'Making a nance drink', pasos: ['Wash the nances', 'Mash them with a little water', 'Strain the mixture', 'Add water, sugar and ice', 'Serve the drink'] },
        { tema: 'Feeding the chickens', pasos: ['Fill the gourd bowl with corn', 'Open the chicken coop', 'Scatter the corn on the ground', 'Change the water in the trough'] },
        { tema: 'Packing the backpack for tomorrow', pasos: ['Check the class schedule', 'Pack the notebooks for the day', 'Put in the pencil and the eraser', 'Close the backpack and leave it ready'] },
        { tema: 'Sweeping the classroom on Friday', pasos: ['Put the chairs up on the desks', 'Sweep from the back toward the door', 'Gather the trash with the dustpan', 'Throw it in the trash can'] },
        { tema: 'Planting a bean in a cup', pasos: ['Put damp cotton in the cup', 'Place the bean on the cotton', 'Leave the cup near the light', 'Water it with one spoonful of water every day'] }
      ],

      OP_VIDA_RUBRICA: 'Logical order from start to finish (4 pts) · Complete steps, with no essential one skipped (4 pts) · Every step is an exact instruction that starts with a verb (2 pts)',

      opDescompBank: [
        { problema: 'Organizing the school fair', partes: ['Form the working committees', 'Set up the food and game stalls', 'Invite the families', 'Hold the fair and clean up at the end'] },
        { problema: 'Celebrating Children’s Day', partes: ['Plan the games and prizes', 'Get the food and the piñatas', 'Decorate the classroom', 'Hold the party and tidy the classroom'] },
        { problema: 'Painting the independence mural', partes: ['Research the founding fathers', 'Draw the sketch of the mural', 'Paint the mural section by section', 'Present the mural to the school'] },
        { problema: 'Starting the school garden', partes: ['Prepare the soil', 'Plant the seeds', 'Organize the watering shifts', 'Harvest and hand out the crop'] },
        { problema: 'Organizing the soccer championship', partes: ['Sign up the teams', 'Schedule the games', 'Get the prizes', 'Play the final and hand out the prizes'] },
        { problema: 'Preparing the end-of-year ceremony', partes: ['Rehearse the performances and dances', 'Prepare the certificates', 'Decorate the hall', 'Hold the ceremony'] }
      ],

      opDetectiveBank: [
        { tarea: 'Brushing your teeth', pasos: ['Put toothpaste on the brush', 'Brush up and down', 'Rinse your mouth', 'Put the brush away'], malo: 'Do something with the water', tipo: 'A' },
        { tarea: 'Making a baleada', pasos: ['Knead the flour', 'Cook the tortilla', 'Spread the beans', 'Fold it and serve it'], malo: 'Kick a ball around', tipo: 'I' },
        { tarea: 'Raising the flag', pasos: ['Line up', 'Tie on the flag', 'Raise it with the anthem', 'Give the salute'], malo: 'Get it up there somehow', tipo: 'A' },
        { tarea: 'Planting a bean', pasos: ['Put in damp cotton', 'Place the bean', 'Leave it in the light', 'Water it every day'], malo: 'Watch television for a while', tipo: 'I' },
        { tarea: 'Making a nance drink', pasos: ['Wash the nances', 'Mash them with water', 'Strain the mixture', 'Serve it with ice'], malo: 'Add as much sugar as whoever walks by likes', tipo: 'A' },
        { tarea: 'Doing the homework', pasos: ['Take out the notebook', 'Read the instructions', 'Solve the exercises', 'Check the answers'], malo: 'Hide your classmate’s pencil', tipo: 'I' },
        { tarea: 'Sweeping the classroom', pasos: ['Put the chairs up', 'Sweep from the back toward the door', 'Gather the trash with the dustpan', 'Throw it in the trash can'], malo: 'Sweep more or less wherever it looks dirty', tipo: 'A' },
        { tarea: 'Feeding the chickens', pasos: ['Fill the gourd bowl with corn', 'Open the chicken coop', 'Scatter the corn', 'Change the water'], malo: 'Count the clouds in the sky', tipo: 'I' }
      ],

      OP_TIPO_TXT: { A: 'It is ambiguous (not exact)', I: 'It is useless (it does not help the task)' },

      /* ---------- Lab: el maestro robot ---------- */
      LAB_ASPECTOS: { orden: '🔢 Put the steps in order', ambigua: '🌫️ Hunt the ambiguous one', falta: '❓ The missing step', partes: '🧩 Decompose' },

      parteData: {
        baleada: {
          nombre: 'Making a baleada', icon: '🫓',
          algoritmo: ['Knead the flour with water', 'Roll the ball and flatten the tortilla', 'Cook the tortilla on the griddle', 'Spread 2 spoonfuls of beans and cheese', 'Fold the baleada and serve it'],
          ambigua: { lista: ['Knead the flour with water', 'Put in beans, more or less', 'Cook the tortilla on the griddle', 'Fold the baleada and serve it'], mala: 1, fix: 'Spread 2 spoonfuls of beans' },
          falta: { pasos: ['Knead the flour with water', '❓', 'Cook the tortilla on the griddle', 'Fold the baleada and serve it'], correcta: 'Roll the ball and flatten the tortilla', distractores: ['Eat the baleada', 'Wash the griddle', 'Put the flour away'] },
          partes: { problema: 'Selling baleadas at recess', correctas: ['Buy the ingredients', 'Make the baleadas', 'Take the money and give change'], extra: ['Raise the flag', 'Water the garden', 'Paint the court'] }
        },
        bandera: {
          nombre: 'Raising the flag at the Monday ceremony', icon: '🇭🇳',
          algoritmo: ['Line up in the yard', 'Tie the flag to the rope', 'Raise it slowly while the anthem plays', 'Give the salute in silence', 'Go back to the classroom in an orderly line'],
          ambigua: { lista: ['Line up in the yard', 'Tie the flag to the rope', 'Get it up there somehow, quickly', 'Give the salute in silence'], mala: 2, fix: 'Raise it slowly while the anthem plays' },
          falta: { pasos: ['Line up in the yard', 'Tie the flag to the rope', '❓', 'Give the salute in silence'], correcta: 'Raise it slowly while the anthem plays', distractores: ['Put the rope away', 'Clap really loudly', 'Run to the classroom'] },
          partes: { problema: 'Organizing Monday’s flag ceremony', correctas: ['Get the flag and the rope ready', 'Rehearse the anthem with the choir', 'Line up the grades in order'], extra: ['Make the tortillas', 'Plant the bean', 'Buy the nances'] }
        },
        frijol: {
          nombre: 'Planting a bean in a cup', icon: '🌱',
          algoritmo: ['Put damp cotton in the cup', 'Place the bean on the cotton', 'Leave the cup near the light', 'Water it with one spoonful of water every day', 'Write down every day how much it has grown'],
          ambigua: { lista: ['Put damp cotton in the cup', 'Place the bean on the cotton', 'Give it water whenever you remember', 'Write down every day how much it has grown'], mala: 2, fix: 'Water it with one spoonful of water every day' },
          falta: { pasos: ['Put damp cotton in the cup', '❓', 'Leave the cup near the light', 'Water it with one spoonful of water every day'], correcta: 'Place the bean on the cotton', distractores: ['Eat the bean', 'Cover the cup with stones', 'Hide the cup'] },
          partes: { problema: 'Starting the school garden', correctas: ['Prepare the soil of the rows', 'Get the seeds', 'Organize the watering shifts'], extra: ['Buy a robot', 'Fold a baleada', 'Sing the anthem'] }
        },
        nance: {
          nombre: 'Making a nance drink', icon: '🥤',
          algoritmo: ['Wash the nances well', 'Mash the nances in a cup of water', 'Strain the mixture', 'Add 4 cups of water and 6 spoonfuls of sugar', 'Serve the drink with ice'],
          ambigua: { lista: ['Wash the nances well', 'Strain the mixture', 'Add as much sugar as everyone likes', 'Serve the drink with ice'], mala: 2, fix: 'Add 6 spoonfuls of sugar' },
          falta: { pasos: ['Wash the nances well', 'Mash the nances in a cup of water', '❓', 'Add 4 cups of water and 6 spoonfuls of sugar'], correcta: 'Strain the mixture', distractores: ['Freeze the whole nances', 'Throw out the water', 'Paint the glass'] },
          partes: { problema: 'Selling cool drinks at the school fair', correctas: ['Buy the nances and the sugar', 'Make the drink early', 'Get cups and ice'], extra: ['Tie on the flag', 'Sweep the office', 'Loosen the soil in the yard'] }
        }
      }
    },

    /* ══════════════════════════════════════════════════════
       3. FRASES EXACTAS (pantalla y pruebas imprimibles)
       ══════════════════════════════════════════════════════ */
    frases: {
      /* Del mensaje de WhatsApp esta misión no declara nada aquí: sus cuatro
         líneas son las comunes y ya viven en js/metas-i18n.js. Lo único suyo
         es el título en la constancia, que va abajo en los fragmentos. */
      /* — pestañas propias de esta misión — */
      'Conceptos': 'Concepts',
      /* — mini-quiz de las tarjetas — */
      '¡Correcto! Así piensa un programador. 🎉': 'Correct! That is how a programmer thinks. 🎉',
      'Todavía no. Vuelve a leer la tarjeta y prueba otra vez.': 'Not yet. Read the card again and try once more.',
      /* — lab: el maestro robot — */
      '🔬 Lab: El maestro robot': '🔬 Lab: The robot teacher',
      '🫓 Cargando el escenario…': '🫓 Loading the scenario…',
      '🔢 El robot humano necesita el algoritmo EN ORDEN. Toca los pasos del primero al último:':
        '🔢 The human robot needs the algorithm IN ORDER. Tap the steps from the first to the last:',
      '🎉 ¡Algoritmo ordenado de principio a fin! El robot humano ya puede ejecutarlo.':
        '🎉 Algorithm in order from start to finish! The human robot can run it now.',
      'Ese paso todavía no va. ¿Qué se hace PRIMERO?': 'That step does not come yet. What is done FIRST?',
      '🌫️ Una instrucción de este algoritmo es AMBIGUA: el robot humano no sabría ejecutarla. ¡Tócala!':
        '🌫️ One instruction in this algorithm is AMBIGUOUS: the human robot would not know how to run it. Tap it!',
      'Esa instrucción es exacta: cualquiera la ejecuta igual. Busca la confusa.':
        'That instruction is exact: anyone would carry it out the same way. Look for the confusing one.',
      '❓ Al algoritmo le FALTA un paso (el ❓). Piensa al revés: ¿cuál completa la tarea?':
        '❓ The algorithm is MISSING a step (the ❓). Think backward: which one completes the task?',
      '🧠 ¡Exacto! Ese era el paso perdido: sin él la tarea queda incompleta.':
        '🧠 Exactly! That was the missing step: without it the task is left unfinished.',
      'Ese paso no ayuda a completar la tarea. Lee el algoritmo otra vez.':
        'That step does not help finish the task. Read the algorithm again.',
      'Solo 3 partes: quita una para cambiar tu elección.': 'Only 3 parts: remove one to change your choice.',
      '🎉 ¡Problema bien descompuesto! Ahora cada equipo puede tomar una parte.':
        '🎉 Problem nicely decomposed! Now each team can take one part.',
      'Esas no eran las 3 partes: las correctas quedaron en verde. Toca «🧩 Descompón» para reintentar.':
        'Those were not the 3 parts: the correct ones are in green. Tap «🧩 Decompose» to try again.',
      /* — flashcards y memorama — */
      '🧠 Juego: Memoria del Pensamiento': '🧠 Game: Thinking Memory',
      '⭐ +1 XP por pareja encontrada (primera vez) · +2 XP al completar todo':
        '⭐ +1 XP per pair you find (first time) · +2 XP for finishing them all',
      'Encuentra las parejas: cada concepto con su pista o ejemplo. ¡Ejercita la memoria mientras repasas!':
        'Find the pairs: each concept with its clue or example. Train your memory while you review!',
      /* — clasifica — */
      '💡 Consejo: ¡Usa el botón "Variar grupo" varias veces! Practicar con diferentes categorías te ayudará a dominar el tema.':
        '💡 Tip: use the "Change group" button several times! Practicing with different categories helps you master the topic.',
      /* — widgets — */
      '🔗 Ordena el algoritmo': '🔗 Put the algorithm in order',
      'Usa las flechas ▲ ▼ para poner los pasos en el orden correcto de principio a fin:':
        'Use the ▲ ▼ arrows to put the steps in the right order from start to finish:',
      /* el <strong>▲ ▼</strong> parte la frase en dos nodos de texto */
      'para poner los pasos en el orden correcto de principio a fin:':
        'arrows to put the steps in the right order from start to finish:',
      '🔄 Nueva secuencia': '🔄 New sequence',
      'Hay pasos fuera de orden. Revisa el arreglo.': 'Some steps are out of order. Check the arrangement.',
      '🌫️ ¿Exacta o ambigua?': '🌫️ Exact or ambiguous?',
      '⭐ +3 XP por respuesta correcta (primera vez) · ¡Cuida tu racha 🔥!':
        '⭐ +3 XP per correct answer (first time) · Watch your streak 🔥!',
      '¿Una persona-robot podría ejecutar esta orden tal como está escrita?':
        'Could a human robot carry out this instruction exactly as it is written?',
      '«Da 3 pasos hacia adelante»': '«Take 3 steps forward»',
      '🧩 Descompón el problema': '🧩 Decompose the problem',
      '⭐ +3 XP por problema bien descompuesto (primera vez)': '⭐ +3 XP per problem nicely decomposed (first time)',
      'Cada problema grande tiene 3 partes verdaderas escondidas entre partes que no le pertenecen. ¡Elígelas!':
        'Every big problem has 3 real parts hidden among parts that do not belong to it. Pick them!',
      'Solo puedes elegir 3 partes. Quita una para cambiar.': 'You can only pick 3 parts. Remove one to change your choice.',
      '¡Problema bien descompuesto! +3 XP': 'Problem nicely decomposed! +3 XP',
      'Esas no son las 3 partes. Las correctas quedaron en verde.': 'Those are not the 3 parts. The correct ones are in green.',
      '🎉 ¡Descompusiste todos los problemas!': '🎉 You decomposed every problem!',
      /* — reto — */
      '🏆 Reto Final — ¡30 segundos!': '🏆 Final Challenge — 30 seconds!',
      /* — generador de tareas — */
      '🫓 Escribir el algoritmo de una tarea de casa': '🫓 Write the algorithm for a chore at home',
      '🌫️ Marcar la instrucción ambigua': '🌫️ Spot the ambiguous instruction',
      '🧩 Descomponer un problema': '🧩 Decompose a problem',
      '🔁 Encontrar el patrón': '🔁 Find the pattern',
      'Escribe en tu cuaderno el ALGORITMO de cada tarea: de 4 a 6 pasos numerados, cada paso con un verbo claro y en el orden correcto.':
        'Write the ALGORITHM for each chore in your notebook: 4 to 6 numbered steps, each one with a clear verb and in the right order.',
      'Recuerda: instrucciones EXACTAS (cantidades y lugares claros), como si programaras a una persona-robot.':
        'Remember: EXACT instructions (clear amounts and places), as if you were programming a human robot.',
      'En cada grupo hay UNA instrucción ambigua escondida entre instrucciones exactas. Escribe la letra de la ambigua y corrígela para volverla exacta.':
        'In each group there is ONE ambiguous instruction hidden among exact ones. Write the letter of the ambiguous one and correct it to make it exact.',
      '¿Cuál es la instrucción ambigua?': 'Which one is the ambiguous instruction?',
      'Descompón cada problema GRANDE: escribe en tu cuaderno 3 partes pequeñas en las que lo dividirías para resolverlo en equipo.':
        'Decompose each BIG problem: write in your notebook 3 small parts you would split it into to solve it as a team.',
      'Observa cada serie: hay un PATRÓN (algo que se repite). Escribe los 2 elementos que siguen.':
        'Look at each series: there is a PATTERN (something that repeats). Write the 2 items that come next.',
      /* — evaluación conceptual — */
      'Evaluación Final · El Pensamiento Computacional · Educación Básica · Programación':
        'Final Test · Computational Thinking · Basic Education · Programming',
      '🎓 Evaluación Final — El Pensamiento Computacional': '🎓 Final Test — Computational Thinking',
      /* — prueba operativa — */
      'Examen de Programación — Prueba Operativa · El Pensamiento Computacional · Educación Básica':
        'Programming Exam — Practical Test · Computational Thinking · Basic Education',
      '🧠 Prueba Operativa — El Pensamiento Computacional': '🧠 Practical Test — Computational Thinking',
      '🔄 Nueva Prueba Operativa': '🔄 New Practical Test',
      'Ordena algoritmos, caza instrucciones ambiguas, completa pasos perdidos y descompón problemas. Responde en pantalla y presiona Calificar prueba para autoevaluarte. Genera una nueva prueba cuando quieras.':
        'Put algorithms in order, hunt ambiguous instructions, fill in missing steps and decompose problems. Answer on screen and press Grade the test to check yourself. Generate a new test whenever you like.',
      'Ordena algoritmos, caza instrucciones ambiguas, completa pasos perdidos y descompón problemas. Responde en pantalla y presiona': 'Put algorithms in order, hunt ambiguous instructions, fill in missing steps and decompose problems. Answer on screen and press',
      'para autoevaluarte.': 'to check yourself.',
      'I. Ordena el algoritmo': 'I. Put the algorithm in order',
      'II. ¿Exacta o ambigua?': 'II. Exact or ambiguous?',
      'III. Completa el paso que falta': 'III. Fill in the missing step',
      'IV. Problemas de la vida real': 'IV. Real-life problems',
      'V. Retos de olimpiada': 'V. Olympiad challenges',
      'III. Completa el paso': 'III. Fill in the step',
      'Nivel básico. Los pasos están numerados pero DESORDENADOS. Escribe el orden correcto con los números separados por guiones (p. ej. 2-4-1-3).':
        'Basic level. The steps are numbered but OUT OF ORDER. Write the right order with the numbers separated by hyphens (e.g., 2-4-1-3).',
      'Nivel básico. Los pasos están numerados pero DESORDENADOS. Escribe el orden correcto con los números separados por guiones (p. ej. 2-4-1-3). 4 pts c/u.':
        'Basic level. The steps are numbered but OUT OF ORDER. Write the right order with the numbers separated by hyphens (e.g., 2-4-1-3). 4 pts each.',
      'Agilidad. ¿Una persona-robot podría ejecutar la instrucción tal como está escrita?':
        'Speed round. Could a human robot carry out the instruction exactly as it is written?',
      'Agilidad. Escribe E si la instrucción es EXACTA (todos la ejecutan igual) o A si es AMBIGUA (cada quien entiende distinto). 2 pts c/u.':
        'Speed round. Write E if the instruction is EXACT (everyone carries it out the same way) or A if it is AMBIGUOUS (everyone understands it differently). 2 pts each.',
      'Nivel intermedio. Piensa al revés: al algoritmo le falta UN paso (el espacio ___). Elige cuál es.':
        'Intermediate level. Think backward: the algorithm is missing ONE step (the ___ gap). Choose which one it is.',
      'Nivel intermedio. Al algoritmo le falta UN paso (el espacio ___). Escribe la letra de la opción correcta. 4 pts c/u.':
        'Intermediate level. The algorithm is missing ONE step (the ___ gap). Write the letter of the right option. 4 pts each.',
      'Nivel avanzado. Escribe el ALGORITMO (4 a 6 pasos numerados, cada uno con un verbo claro). Compara con la pauta y anota tu puntaje de 0 a 10.':
        'Advanced level. Write the ALGORITHM (4 to 6 numbered steps, each with a clear verb). Compare with the answer key and write your score from 0 to 10.',
      'Nivel avanzado. Escribe el ALGORITMO de 4 a 6 pasos numerados; cada paso empieza con un verbo claro. 10 pts c/u.':
        'Advanced level. Write the ALGORITHM in 4 to 6 numbered steps; each step starts with a clear verb. 10 pts each.',
      'Desafío. Piensa como programador: descompón el problema grande y atrapa el paso malo.':
        'Challenge round. Think like a programmer: decompose the big problem and catch the bad step.',
      'Desafío. Reto 1: 10 pts · Reto 2: 10 pts (5 el paso + 5 el porqué).':
        'Challenge round. Challenge 1: 10 pts · Challenge 2: 10 pts (5 for the step + 5 for the reason).',
      'Orden correcto:': 'Right order:', 'Orden lógico:': 'Logical order:',
      '✅ Exacta': '✅ Exact', '🌫️ Ambigua': '🌫️ Ambiguous',
      'Compara con la pauta y anota tu puntaje:': 'Compare with the answer key and write your score:',
      'de 10 pts': 'of 10 pts', 'de 20 pts': 'of 20 pts', 'de 30 pts': 'of 30 pts',
      'Pasos clave:': 'Key steps:', 'Rúbrica (10 pts):': 'Rubric (10 pts):',
      '¿Qué tiene de malo el paso': 'What is wrong with the step',
      'Nº del paso malo (5 pts):': 'No. of the bad step (5 pts):',
      '¿Qué tiene de malo? (5 pts):': 'What is wrong with it? (5 pts):',
      'Nº del paso malo:': 'No. of the bad step:',
      'Es: (a) ambiguo   (b) inútil   →': 'It is: (a) ambiguous   (b) useless   →',
      '🧮 Prueba interactiva:': '🧮 Interactive test:',
      'responde en pantalla y presiona': 'answer on screen and press',
      '. La impresión conserva el formato para resolver en papel.': '. Printing keeps the layout for solving on paper.',
      '🧮 Prueba interactiva: responde en pantalla y presiona Calificar prueba. La impresión conserva el formato para resolver en papel.':
        '🧮 Interactive test: answer on screen and press Grade the test. Printing keeps the layout for solving on paper.',
      '⚠️ Genera una prueba operativa primero': '⚠️ Generate a practical test first',
      'Total obtenido:': 'Total score:', 'de 100 pts': 'of 100 pts',
      'I. Ordena el algoritmo (rúbrica)': 'I. Put the algorithm in order (rubric)',
      'IV. Vida real (rúbrica 10 pts c/u)': 'IV. Real life (rubric 10 pts each)',
      /* — rótulos de accesibilidad (viven en aria-label y title) — */
      'Barra de progreso XP': 'XP progress bar',
      'Regresar a misiones de Programación': 'Back to the Programming missions',
      'Compartir misión por WhatsApp': 'Share this mission on WhatsApp',
      'Tarjeta de estudio. Presiona Enter para voltear': 'Study card. Press Enter to flip',
      'Opciones': 'Options',
      'Ir a la siguiente sección': 'Go to the next section',
      'Secciones de la misión': 'Mission sections',
      'Logros desbloqueados': 'Achievements unlocked',
      'Tipo de evaluación': 'Type of test',
      /* — constancia — */
      'Misión El Pensamiento Computacional': 'Mission Computational Thinking',
      '¡Sigue aprendiendo!': 'Keep learning!', '¡Muy buen trabajo!': 'Very good work!',
      '¡Vas muy bien!': 'You are doing great!',
      '¡Dominas los algoritmos y la descomposición!': 'You have mastered algorithms and decomposition!',
      '¡Maestro del Pensamiento Computacional!': 'Master of Computational Thinking!'
    },

    /* ══════════════════════════════════════════════════════
       4. FRAGMENTOS (textos con números o nombres variables)
       ══════════════════════════════════════════════════════ */
    fragmentos: [
      /* — WhatsApp: el título de la misión en la constancia — */
      [/¡(.+?) completó la Misión "El Pensamiento Computacional"!/g, '$1 completed the mission “Computational Thinking”!'],
      /* — lab: el rótulo del escenario y su avance — */
      [/(\d+) de 4 desafíos superados en este escenario/g, '$1 of 4 challenges beaten in this scenario'],
      [/🏅 ¡Escenario «(.+?)» completado! \+2 XP extra/g, '🏅 Scenario «$1» completed! +2 XP bonus'],
      [/🎯 ¡La cazaste! «(.+?)» es ambigua\. Instrucción exacta: «(.+?)»\./g,
        '🎯 You caught it! «$1» is ambiguous. Exact instruction: «$2».'],
      [/🎪 Problema grande: /g, '🎪 Big problem: '],
      [/🧩 Problema grande: /g, '🧩 Big problem: '],
      [/Toca las 3 partes que SÍ pertenecen a este problema\./g, 'Tap the 3 parts that DO belong to this problem.'],
      [/Toca las 3 partes que SÍ le pertenecen:/g, 'Tap the 3 parts that DO belong to it:'],
      /* — widget «¿Exacta o ambigua?»: contador con racha — */
      [/^(\d+) de (\d+) · Racha: (\d+) 🔥$/g, '$1 of $2 · Streak: $3 🔥'],
      [/¡Correcto! Racha de (\d+) 🔥 \+3 XP/g, 'Correct! Streak of $1 🔥 +3 XP'],
      [/Racha perdida\. Era: /g, 'Streak lost. It was: '],
      [/🎉 ¡Completado! Mejor racha: (\d+) 🔥/g, '🎉 Completed! Best streak: $1 🔥'],
      /* — widget «Descompón»: contador — */
      [/Problema (\d+) de (\d+)/g, 'Problem $1 of $2'],
      /* — «Ordena el algoritmo»: aviso al variar de secuencia — */
      [/🔄 Secuencia: /g, '🔄 Sequence: '],
      /* — generador de tareas — */
      [/Escribe el algoritmo para: /g, 'Write the algorithm for: '],
      [/✅ Ejemplo de pauta: /g, '✅ Sample answer: '],
      [/ \(acepta otras partes lógicas\)/g, ' (other logical parts are acceptable)'],
      [/✅ La ambigua es la ([a-d])\) «(.+?)» — corrígela con cantidades o lugares claros\./g,
        '✅ The ambiguous one is $1) «$2» — correct it with clear amounts or places.'],
      [/Parte 1:/g, 'Part 1:'], [/Parte 2:/g, 'Part 2:'], [/Parte 3:/g, 'Part 3:'],
      [/¿Qué 2 elementos siguen\?/g, 'Which 2 items come next?'],
      [/¿Cuál es la unidad que se repite\?/g, 'What is the unit that repeats?'],
      [/✅ Siguen: /g, '✅ Next: '],
      [/ · La unidad que se repite es: /g, ' · The unit that repeats is: '],
      /* — evaluación conceptual y prueba operativa: títulos con la Forma — */
      [/🎓 Evaluación Final · Forma (\d+) · El Pensamiento Computacional/g, '🎓 Final Test · Form $1 · Computational Thinking'],
      [/✅ PAUTA — Evaluación Final · El Pensamiento Computacional · Forma (\d+)/g, '✅ ANSWER KEY — Final Test · Computational Thinking · Form $1'],
      [/Evaluación El Pensamiento Computacional · Forma (\d+)/g, 'Computational Thinking Test · Form $1'],
      [/🧠 Prueba Operativa — Forma (\d+) · El Pensamiento Computacional/g, '🧠 Practical Test — Form $1 · Computational Thinking'],
      [/✔ PAUTA — Prueba Operativa · El Pensamiento Computacional · Forma (\d+)/g, '✔ ANSWER KEY — Practical Test · Computational Thinking · Form $1'],
      [/Prueba Operativa El Pensamiento Computacional · Forma (\d+)/g, 'Computational Thinking Practical Test · Form $1'],
      [/Valor total: 100 pts · I: 20 pts · II: 10 pts · III: 20 pts · IV: 30 pts · V: 20 pts/g,
        'Total value: 100 pts · I: 20 pts · II: 10 pts · III: 20 pts · IV: 30 pts · V: 20 pts'],
      [/Valor total: 100 pts · I: 20 · II: 10 · III: 20 · IV: 30 · V: 20 · Forma (\d+)/g,
        'Total value: 100 pts · I: 20 · II: 10 · III: 20 · IV: 30 · V: 20 · Form $1'],
      [/100 pts · I: 5×4 · II: 5×2 · III: 5×4 · IV: 3×10 · V: 10\+10 · Programación · Educación Básica/g,
        '100 pts · I: 5×4 · II: 5×2 · III: 5×4 · IV: 3×10 · V: 10+10 · Programming · Basic Education'],
      [/Valor total: 100 pts \| 4 secciones × 5 preguntas × 5 pts c\/u · Programación · Educación Básica/g,
        'Total value: 100 pts | 4 sections × 5 questions × 5 pts each · Programming · Basic Education'],
      /* — enunciados de la prueba operativa que llevan el nombre de la tarea — */
      [/Algoritmo para: /g, 'Algorithm for: '],
      [/Escribe el algoritmo para: /g, 'Write the algorithm for: '],
      [/🧩 Descompón el problema: «(.+?)» se dividió en 4 partes, pero quedaron DESORDENADAS\. Escribe el orden lógico con los números \(p\. ej\. 2-4-1-3\)\./g,
        '🧩 Decompose the problem: «$1» was split into 4 parts, but they ended up OUT OF ORDER. Write the logical order with the numbers (e.g., 2-4-1-3).'],
      [/El problema grande «(.+?)» se dividió en 4 partes, pero quedaron desordenadas\. Escribe el orden lógico \(p\. ej\. 2-4-1-3\):/g,
        'The big problem «$1» was split into 4 parts, but they ended up out of order. Write the logical order (e.g., 2-4-1-3):'],
      [/🧩 Descompón el problema · 10 pts:/g, '🧩 Decompose the problem · 10 pts:'],
      [/🔎 Detective del paso malo · 10 pts:/g, '🔎 Bad-step detective · 10 pts:'],
      [/🔎 Detective del paso malo: en el algoritmo para (.+?) se coló UN paso que es inútil o ambiguo\. Encuéntralo\./g,
        '🔎 Bad-step detective: one step that is useless or ambiguous slipped into the algorithm for $1. Find it.'],
      [/En el algoritmo para (.+?) se coló UN paso inútil o ambiguo:/g,
        'One useless or ambiguous step slipped into the algorithm for $1:'],
      [/^Paso (\d+): /g, 'Step $1: '],
      [/Paso (\d+) \(«(.+?)»\) → /g, 'Step $1 («$2») → '],
      [/Revisar\. Paso (\d+) → /g, 'Check again. Step $1 → '],
      [/¡Paso malo atrapado! \+10 pts/g, 'Bad step caught! +10 pts'],
      [/¡Problema bien descompuesto! \+10 pts/g, 'Problem nicely decomposed! +10 pts'],
      [/Revisar\. Orden lógico: /g, 'Check again. Logical order: '],
      [/Revisar\. Orden correcto: /g, 'Check again. Right order: '],
      [/Revisar\. Faltaba: /g, 'Check again. The missing one was: '],
      [/Revisar\. Era: Exacta/g, 'Check again. It was: Exact'],
      [/Revisar\. Era: Ambigua/g, 'Check again. It was: Ambiguous'],
      [/Correcto\. \+4 pts/g, 'Correct. +4 pts'], [/Correcto\. \+2 pts/g, 'Correct. +2 pts'],
      [/Puntaje autoevaluado: (\d+)\/10 \(compara siempre con la pauta\)/g,
        'Self-assessed score: $1/10 (always compare with the answer key)'],
      [/Resultado: (\d+)\/100 pts/g, 'Result: $1/100 pts'],
      [/Ordena: (\d+)\/20 · Exacta o ambigua: (\d+)\/10 · Completa: (\d+)\/20 · Vida real: (\d+)\/30 · Retos: (\d+)\/20/g,
        'Order: $1/20 · Exact or ambiguous: $2/10 · Fill in: $3/20 · Real life: $4/30 · Challenges: $5/20'],
      [/🎯 Prueba operativa calificada: (\d+)\/100/g, '🎯 Practical test graded: $1/100'],
      [/🧮 Prueba operativa: (\d+)\/100\. Revisa los ítems marcados\./g, '🧮 Practical test: $1/100. Check the marked items.'],
      [/Rúbrica: (.+?)\. Acepte redacciones distintas si los pasos clave están en orden\./g,
        'Rubric: $1. Accept different wordings if the key steps are in order.'],
      [/Elegir número de forma exacta \(1 a (\d+)\)/g, 'Choose the exact form number (1 to $1)'],
      /* — etiquetas de accesibilidad con número — */
      [/Respuesta pareada (\d+)/g, 'Matching answer $1'],
      [/Algoritmo para (.+)/g, 'Algorithm for $1']
    ]
  };
})();
