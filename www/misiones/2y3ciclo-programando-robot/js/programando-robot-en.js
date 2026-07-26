/* ============================================================
   Misión «Programando un Robot»: versión en inglés
   ------------------------------------------------------------
   Traducción de autor (no automática) para escuelas bilingües.
   Se carga junto a la misión y el motor js/metas-i18n.js la
   activa con el botón 🌐 English de la barra superior.

   Criterio de traducción:
   · Inglés AMERICANO estricto: color, center, catalog, analyze,
     practicing, «Student No.».
   · Vocabulario estándar de programación escolar: program ·
     instruction · conditional (IF…THEN…ELSE) · loop · variable ·
     counter · pseudocode · debug · bug · sensor · actuator ·
     step-by-step test.
   · Lo cultural se explica, no se calca: milpa → cornfield,
     pulpería → corner store, huerto escolar → school garden.

   EL LENGUAJE DEL SIMULADOR NO SE TRADUCE EN EL DATO, SOLO AL
   PINTARLO. AVANZA, GIRA DERECHA, C_PARED… son el identificador
   interno: el simulador compara con ellos (real===I_GD), el HTML
   llama a labAdd('AVANZA') y los bancos guardan los programas con
   ellos. Por eso los programas de parteData y de critTraceBank se
   escriben aquí con las MISMAS constantes I_AV, C_PARED… y lo que
   traduce el motor son los fragmentos de más abajo:
   AVANZA→FORWARD, GIRA DERECHA→TURN RIGHT, DETENTE→STOP y los
   tres bloques «SI … → …, SINO → …».

   · Los bancos son traducción ÍNDICE A ÍNDICE del español: las
     formas deterministas de la evaluación (1–30) sacan las mismas
     preguntas y la misma clave ZipGrade en los dos idiomas.

   Las frases comunes a las 56 misiones viven en BASE_FRASES /
   BASE_FRAGMENTOS de js/metas-i18n.js: aquí solo va lo propio.
   ============================================================ */
(function () {
  'use strict';

  /* ══════════ Sopa de letras en inglés ══════════ */
  function _rng(seed) {
    return function () {
      seed = (seed + 0x6D2B79F5) >>> 0;
      var t = seed;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function _sopa(size, palabras, semilla) {
    var rnd = _rng(semilla);
    var LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var dirs = [[0, 1], [1, 0], [1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1], [-1, 1]];
    var grid = [], r, c;
    for (r = 0; r < size; r++) { grid.push([]); for (c = 0; c < size; c++) grid[r].push(''); }
    var words = [];
    palabras.forEach(function (w) {
      var puesto = false, intentos = 0;
      while (!puesto && intentos < 600) {
        intentos++;
        var d = dirs[Math.floor(rnd() * dirs.length)];
        var r0 = Math.floor(rnd() * size), c0 = Math.floor(rnd() * size);
        var rf = r0 + d[0] * (w.length - 1), cf = c0 + d[1] * (w.length - 1);
        if (rf < 0 || rf >= size || cf < 0 || cf >= size) continue;
        var ok = true, cells = [];
        for (var i = 0; i < w.length; i++) {
          var rr = r0 + d[0] * i, cc = c0 + d[1] * i;
          if (grid[rr][cc] && grid[rr][cc] !== w[i]) { ok = false; break; }
          cells.push([rr, cc]);
        }
        if (!ok) continue;
        cells.forEach(function (p, i) { grid[p[0]][p[1]] = w[i]; });
        words.push({ w: w, cells: cells });
        puesto = true;
      }
    });
    for (r = 0; r < size; r++) for (c = 0; c < size; c++)
      if (!grid[r][c]) grid[r][c] = LETRAS[Math.floor(rnd() * 26)];
    return { size: size, grid: grid, words: words };
  }

  window.MISION_EN = {

    titulo: 'Mission Programming a Robot | policastsapien.com',

    /* ══════════════════════════════════════════════════════
       1. BLOQUES DE CONTENIDO (data-i18n en el HTML)
       ══════════════════════════════════════════════════════ */
    html: {

      hero:
        '<h1>Mission <span>Programming a Robot</span></h1>' +
        '<p class="sub">Bring the Code Path and the Robot Path together: write the program, read the sensors, repeat with loops and debug the mistakes. 📋📡🔄</p>' +
        '<div class="badge">🤖 Robot Path · Stage 5 of 6 · Robotics</div>',

      a1:
        '<h2>🔁 The robot cycle: a loop that never stops</h2>' +
        '<p>A robot that is switched on does <strong>the same thing over and over</strong>: it <strong>reads its sensors</strong>, ' +
        'it <strong>decides</strong> with its program, it <strong>moves its actuators</strong> and it <strong>starts again</strong>. ' +
        'That cycle is an <strong>infinite loop</strong> for as long as the robot has battery.</p>' +
        '<div class="type-grid">' +
        '<div class="type-chip tc-teal"><div class="t-art">📡 1. Read the sensors</div><div class="t-info">Is there a wall ahead? Can I see the black line? Is the soil dry?</div></div>' +
        '<div class="type-chip tc-gold"><div class="t-art">🧠 2. Decide</div><div class="t-info">The program chooses: IF this happens, THEN do that, ELSE do the other thing</div></div>' +
        '<div class="type-chip tc-amber"><div class="t-art">⚙️ 3. Move the actuators</div><div class="t-info">The motors go forward, turn, pick things up or open the water</div></div>' +
        '<div class="type-chip tc-jade"><div class="t-art">🔄 4. Repeat</div><div class="t-info">The cycle goes back to step 1 many times per second</div></div>' +
        '</div>' +
        '<div class="tip">' +
        '<span class="ti">💡</span>' +
        '<div><strong>The key to this mission:</strong> on the 💻 Code Path you learned instructions, conditionals, loops and variables. Here you use them <b>all together</b> to move a robot that also <b>reads sensors</b>.</div>' +
        '</div>',

      a2:
        '<h2>👣 The movement instructions</h2>' +
        '<p>A robot’s program is built out of <strong>exact instructions</strong>. In our simulator there are these five:</p>' +
        '<div class="type-grid">' +
        '<div class="type-chip tc-teal"><div class="t-art">👣 FORWARD</div><div class="t-info">It moves ONE square in the direction it is facing</div></div>' +
        '<div class="type-chip tc-gold"><div class="t-art">↪️ TURN RIGHT</div><div class="t-info">It changes direction, but it does NOT change square</div></div>' +
        '<div class="type-chip tc-amber"><div class="t-art">↩️ TURN LEFT</div><div class="t-info">It changes direction the other way, and it does not move either</div></div>' +
        '<div class="type-chip tc-purple"><div class="t-art">⏳ WAIT</div><div class="t-info">It lets time go by without doing anything else</div></div>' +
        '<div class="type-chip tc-jade"><div class="t-art">🎯 STOP</div><div class="t-info">The final instruction: the robot stays still on the goal</div></div>' +
        '</div>' +
        '<div class="tip">' +
        '<span class="ti">⚠️</span>' +
        '<div><strong>Classic mistake:</strong> believing that <b>TURN</b> also moves the robot forward. Turning four times leaves the robot <b>exactly where it was</b>, only dizzy. 😵</div>' +
        '</div>',

      a3:
        '<h2>❓ Conditionals with sensors: the robot decides on its own</h2>' +
        '<p>A <strong>conditional</strong> is an <strong>IF… THEN… ELSE</strong> block. The robot <strong>reads a sensor</strong> ' +
        'and, depending on the answer, it runs one branch or the other. That way the same program still works <b>even when things move around</b>:</p>' +
        '<div class="pseudo-box"><span class="pc"># Wall (obstacle) sensor</span>\n' +
        '<span class="pk">IF</span> there is a wall ahead <span class="pk">THEN</span> TURN RIGHT\n' +
        '<span class="pk">ELSE</span> FORWARD\n' +
        '\n' +
        '<span class="pc"># Line sensor (floor color)</span>\n' +
        '<span class="pk">IF</span> there is a black line ahead <span class="pk">THEN</span> FORWARD\n' +
        '<span class="pk">ELSE</span> TURN RIGHT</div>' +
        '<div class="vs-grid">' +
        '<div class="vs-box vs-a">' +
        '<h4>🧱 Wall / obstacle sensor</h4>' +
        '<p>It looks at the square <strong>ahead</strong>: if there is a crate or the edge of the schoolyard, it answers <strong>YES</strong>. It is used to <strong>dodge without crashing</strong>.</p>' +
        '</div>' +
        '<div class="vs-box vs-b">' +
        '<h4>⬛ Line / color sensor</h4>' +
        '<p>It tells the <strong>black</strong> of the painted line apart from the light floor. It is what lets the robot <strong>follow the path</strong> down the hallway.</p>' +
        '</div>' +
        '</div>',

      e1:
        '<h2>🔄 Loops and 📦 variables</h2>' +
        '<p>If the robot has to repeat the same thing, <strong>do not write the instruction ten times</strong>: use a <strong>loop</strong>. ' +
        'And if it has to <strong>remember a number</strong> (how many times it turned, how many bottles it picked up), use a <strong>variable</strong>.</p>' +
        '<div style="overflow-x:auto;">' +
        '<table style="width:100%;border-collapse:collapse;font-size:0.82rem;min-width:480px;">' +
        '<thead>' +
        '<tr style="background:var(--pri-gl);">' +
        '<th style="padding:0.4rem 0.5rem;border:1px solid var(--border);text-align:left;">Block</th>' +
        '<th style="padding:0.4rem 0.5rem;border:1px solid var(--border);">What is it for?</th>' +
        '<th style="padding:0.4rem 0.5rem;border:1px solid var(--border);">Example in the robot</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:700;">🔄 REPEAT N TIMES</td><td style="padding:0.4rem;border:1px solid var(--border);">Doing the same thing an exact number of times</td><td style="padding:0.4rem;border:1px solid var(--border);">REPEAT 6 TIMES: FORWARD</td></tr>' +
        '<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:700;">🔄 REPEAT UNTIL…</td><td style="padding:0.4rem;border:1px solid var(--border);">Repeating until something comes true</td><td style="padding:0.4rem;border:1px solid var(--border);">REPEAT UNTIL you reach the goal</td></tr>' +
        '<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:700;">🔄 REPEAT WHILE…</td><td style="padding:0.4rem;border:1px solid var(--border);">Repeating while the sensor keeps saying yes</td><td style="padding:0.4rem;border:1px solid var(--border);">REPEAT WHILE there is no obstacle: FORWARD</td></tr>' +
        '<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:700;">📦 VARIABLE</td><td style="padding:0.4rem;border:1px solid var(--border);">Storing a number under a name</td><td style="padding:0.4rem;border:1px solid var(--border);">objects = objects + 1</td></tr>' +
        '</tbody>' +
        '</table>' +
        '</div>' +
        '<div class="tip">' +
        '<span class="ti">🐞</span>' +
        '<div><strong>Watch out for the infinite loop!</strong> Every loop needs a <b>way to end</b>. «REPEAT FOREVER: FORWARD» sends the robot straight off the schoolyard.</div>' +
        '</div>',

      e2:
        '<h2>📝 Pseudocode: think before you load the program</h2>' +
        '<p><strong>Pseudocode</strong> is the program written in <strong>plain, numbered language</strong>, before you ' +
        '«load» it into the robot. It helps you think the route through and, afterwards, to <strong>compare</strong> what the robot did with what it should have done.</p>' +
        '<div class="pseudo-box"><span class="pc"># Watering robot for the school garden 🌱</span>\n' +
        '1. plants = 0\n' +
        '2. <span class="pk">REPEAT</span> 10 <span class="pk">TIMES</span>:\n' +
        '3.    FORWARD\n' +
        '4.    <span class="pk">IF</span> the moisture sensor says «dry soil» <span class="pk">THEN</span> open the valve\n' +
        '5.    <span class="pk">ELSE</span> keep going\n' +
        '6.    plants = plants + 1\n' +
        '7. STOP and report how many plants it watered</div>' +
        '<div class="tip">' +
        '<span class="ti">✏️</span>' +
        '<div><strong>The notebook rule:</strong> one instruction per line, numbered and with no confusing sentences. If someone else can follow it <b>without asking a single question</b>, your pseudocode is well written.</div>' +
        '</div>',

      e3:
        '<h2>⚡ Lightning mini-quiz</h2>' +
        '<p style="font-size:0.9rem;margin-bottom:0.5rem;">1) The robot has to move forward 7 equal squares. What is best to write?</p>' +
        '<div class="cmp-opts" role="group" style="margin-bottom:0.4rem;">' +
        '<button class="cmp-opt" onclick="miniQ(this,false,\'fbMq1\')">A variable</button>' +
        '<button class="cmp-opt" onclick="miniQ(this,true,\'fbMq1\')">A loop: REPEAT 7 TIMES FORWARD</button>' +
        '<button class="cmp-opt" onclick="miniQ(this,false,\'fbMq1\')">Seven line sensors</button>' +
        '</div>' +
        '<div id="fbMq1" class="fb" role="alert"></div>' +
        '<p style="font-size:0.9rem;margin:0.9rem 0 0.5rem;">2) The robot crashed into a crate. What happened?</p>' +
        '<div class="cmp-opts" role="group" style="margin-bottom:0.4rem;">' +
        '<button class="cmp-opt" onclick="miniQ(this,false,\'fbMq2\')">The robot got distracted</button>' +
        '<button class="cmp-opt" onclick="miniQ(this,false,\'fbMq2\')">The crate moved by itself</button>' +
        '<button class="cmp-opt" onclick="miniQ(this,true,\'fbMq2\')">The program has a bug: it needs debugging</button>' +
        '</div>' +
        '<div id="fbMq2" class="fb" role="alert"></div>',

      e4:
        '<h2>🐞 Debugging: the robot does what the program says</h2>' +
        '<p>The robot <strong>does not guess</strong>: it runs every instruction <strong>literally</strong>. If something goes wrong, ' +
        'the mistake is almost always in the <strong>program</strong>, not in the machine. That mistake is called a <strong>bug</strong>, ' +
        'and finding it and fixing it is called <strong>debugging</strong>.</p>' +
        '<div class="type-grid">' +
        '<div class="type-chip tc-teal"><div class="t-art">1️⃣ Test step by step</div><div class="t-info">Run one instruction at a time and write down where the robot ends up</div></div>' +
        '<div class="type-chip tc-gold"><div class="t-art">2️⃣ Compare</div><div class="t-info">Does it match your pseudocode? The first difference is the bug</div></div>' +
        '<div class="type-chip tc-amber"><div class="t-art">3️⃣ Fix one thing only</div><div class="t-info">Change a single instruction and test again</div></div>' +
        '<div class="type-chip tc-purple"><div class="t-art">4️⃣ Repeat</div><div class="t-info">Debugging is a loop too: test → fix → test</div></div>' +
        '</div>' +
        '<div class="tip">' +
        '<span class="ti">🇭🇳</span>' +
        '<div><strong>At your school:</strong> a robot that <b>follows the hallway line</b>, one that <b>picks up the trash in the schoolyard</b> and one that <b>waters the school garden</b>. All three are programmed the same way: sensors, conditionals, loops and variables.</div>' +
        '</div>',

      labh2: '🔬 Simulator: program your robot',

      labintro: 'Choose a level, build the program by tapping the buttons (include the <strong>sensor blocks</strong> 🧱⬛ so the robot DECIDES on its own!) and press <strong>▶ Run</strong>. You will see how it reads each sensor (✔ yes / ✘ no) step by step. ⭐ +5 XP for each level you solve (first time).',

      labniv:
        '<span class="lab-group-label">🗺️ Level:</span>' +
        '<button class="lab-btn lab-cont-btn" data-parte="n1" onclick="labShowParte(\'n1\')">1️⃣ Forward</button>' +
        '<button class="lab-btn lab-cont-btn" data-parte="n2" onclick="labShowParte(\'n2\')">2️⃣ Turn</button>' +
        '<button class="lab-btn lab-cont-btn" data-parte="n3" onclick="labShowParte(\'n3\')">3️⃣ Wall</button>' +
        '<button class="lab-btn lab-cont-btn" data-parte="n4" onclick="labShowParte(\'n4\')">4️⃣ Line</button>' +
        '<button class="lab-btn lab-cont-btn" data-parte="n5" onclick="labShowParte(\'n5\')">5️⃣ The curve</button>' +
        '<button class="lab-btn lab-cont-btn" data-parte="n6" onclick="labShowParte(\'n6\')">6️⃣ Challenge</button>',

      /* los onclick guardan la palabra ESPAÑOLA a propósito: es el identificador
         interno del simulador, no un texto que se le muestre al alumno */
      labcmd:
        '<button class="sim-cmd" onclick="labAdd(\'AVANZA\')">👣 FORWARD</button>' +
        '<button class="sim-cmd" onclick="labAdd(\'GIRA IZQUIERDA\')">↩️ TURN LEFT</button>' +
        '<button class="sim-cmd" onclick="labAdd(\'GIRA DERECHA\')">↪️ TURN RIGHT</button>' +
        '<button class="sim-cmd" onclick="labAdd(\'ESPERA\')">⏳ WAIT</button>' +
        '<button class="sim-cmd sim-cmd-fin" onclick="labAdd(\'DETENTE\')">🎯 STOP</button>',

      labcond:
        '<button class="sim-cmd sim-cmd-cond" onclick="labAdd(\'C_PARED\')">🧱 IF WALL → TURN RIGHT, ELSE → FORWARD</button>' +
        '<button class="sim-cmd sim-cmd-cond" onclick="labAdd(\'C_LINEA\')">⬛ IF LINE → FORWARD, ELSE → TURN RIGHT</button>' +
        '<button class="sim-cmd sim-cmd-cond" onclick="labAdd(\'C_LINEAI\')">⬛ IF LINE → FORWARD, ELSE → TURN LEFT</button>',

      labutil:
        '<button class="btn btn-g" onclick="labRun()">▶ Run</button>' +
        '<button class="btn btn-d" onclick="labDel()">⌫ Delete last</button>' +
        '<button class="btn btn-d" onclick="labClear()">🗑️ Clear</button>' +
        '<button class="btn btn-amber" onclick="labPista()">💡 Hint</button>',

      rec:
        '<h2>📁 Topic Resources</h2>' +
        '<div style="border:1.5px solid var(--border,#e2e8f0);border-radius:12px;padding:1rem 1.2rem;margin-bottom:1.2rem;background:rgba(0,0,0,0.02);">' +
        '<p style="font-size:0.98rem;font-weight:800;margin-bottom:0.4rem;">📄 Printable study sheet</p>' +
        '<p style="font-size:0.86rem;margin-bottom:0.85rem;">A 7-page study guide (theory, unplugged activities and a test) to print out or work through before the exam.</p>' +
        '<a href="../../fichas/ficha-programando-robot.html" target="_blank" rel="noopener noreferrer" class="btn btn-pri" style="display:inline-flex;align-items:center;gap:0.5rem;text-decoration:none;font-size:1rem;padding:0.7rem 1.4rem;">📄 Open / Print the study sheet</a>' +
        '</div>' +
        '<p style="font-size:0.9rem;margin-bottom:1rem;">Here you will find support materials for this mission: slideshows, PDF documents, study guides and more. Your teacher will keep adding resources to this folder.</p>' +
        '<a href="https://drive.google.com/drive/folders/1programando_robot_recursos" target="_blank" rel="noopener noreferrer" class="btn btn-pri" style="display:inline-flex;align-items:center;gap:0.5rem;text-decoration:none;font-size:1rem;padding:0.7rem 1.4rem;">' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 87.3 78" aria-hidden="true">' +
        '<path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H.1c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>' +
        '<path d="M43.65 25L29.9 1.2C28.55 2 27.4 3.1 26.6 4.5L1.3 48.2c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>' +
        '<path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.85 11.5z" fill="#ea4335"/>' +
        '<path d="M43.65 25L57.4 1.2C56.05.4 54.5 0 52.95 0H34.35c-1.55 0-3.1.45-4.45 1.2z" fill="#00832d"/>' +
        '<path d="M59.8 52.7H27.5L13.75 76.5c1.35.8 2.9 1.25 4.45 1.25h50.8c1.55 0 3.1-.45 4.45-1.25z" fill="#2684fc"/>' +
        '<path d="M73.4 26.35l-12.65-21.9c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25l16.15 27.7H87.2c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>' +
        '</svg>' +
        'Open the folder in Google Drive</a>' +
        '<div class="tip" style="margin-top:1.2rem;"><span class="ti">💡</span>' +
        '<div>Files open straight in your browser. You can download them or view them without a Google account.</div></div>'
    },

    /* ══════════════════════════════════════════════════════
       2. BANCOS DE DATOS (los cambia MISION_APLICAR_IDIOMA)
       ══════════════════════════════════════════════════════ */
    data: {

      ACHIEVEMENTS: {
        primer_quiz: { icon: '🕹️', label: 'First programming quiz completed' },
        flash_master: { icon: '🃏', label: 'All the program cards explored' },
        clasif_pro: { icon: '🗂️', label: 'Expert instruction-and-block sorter' },
        id_master: { icon: '🔍', label: 'Master instruction spotter' },
        reto_hero: { icon: '🏆', label: 'Instruction vs Sensor challenge hero' },
        nivel3: { icon: '🧭', label: 'Test Pilot! Level 3' },
        nivel5: { icon: '🥇', label: 'Control Engineer! Level 6' },
        widgets_master: { icon: '🧩', label: 'Programming widgets mastered' },
        lab_master: { icon: '🤖', label: 'All 6 simulator levels solved' }
      },

      lvls: [
        { t: 0, n: 'Beginner 🌱' }, { t: 25, n: 'Loading program 💾' }, { t: 55, n: 'Test Pilot 🧭' },
        { t: 90, n: 'Bug Debugger 🐞' }, { t: 130, n: 'Robot Programmer 🕹️' },
        { t: 165, n: 'Control Engineer 🛠️' }, { t: 190, n: 'Master Programmer 🏆' }
      ],

      fcData: [
        { w: 'Program', a: '📋 The <strong>list of exact instructions</strong> the robot runs step by step.' },
        { w: 'Robot cycle', a: '🔁 <strong>Read the sensors → decide → move the actuators → repeat</strong>, nonstop for as long as the robot is switched on.' },
        { w: 'Instruction', a: '👣 A simple order in the program: <strong>FORWARD, TURN RIGHT, TURN LEFT, WAIT, STOP</strong>.' },
        { w: 'Conditional', a: '❓ An <strong>IF… THEN… ELSE</strong> block: the robot reads a sensor and chooses its path.' },
        { w: 'Wall sensor', a: '🧱 It reports whether there is an <strong>obstacle right ahead</strong>: IF there is a wall THEN turn, ELSE go forward.' },
        { w: 'Line sensor', a: '⬛ It tells the <strong>black line</strong> apart from the light floor: it is used to follow the painted path.' },
        { w: 'Loop', a: '🔄 <strong>Repeating</strong> a block of instructions: «repeat 4 times» or «repeat until you arrive».' },
        { w: 'Variable', a: '📦 A <strong>little box with a name</strong> where the robot stores a number: how many times it turned, how many objects it picked up.' },
        { w: 'Counter', a: '🔢 A variable that <strong>adds one</strong> every time something happens: «turns = turns + 1».' },
        { w: 'Pseudocode', a: '📝 The program written in <strong>plain language</strong> before loading it into the robot.' },
        { w: 'Debug', a: '🐞 <strong>Finding and fixing</strong> the mistakes in the program by testing it step by step.' },
        { w: 'Bug (mistake)', a: '💥 A wrong instruction, or one in the wrong order: the robot <strong>does what the program says</strong>, not what you meant to say.' },
        { w: 'Actuator', a: '⚙️ What <strong>carries out</strong> the order: motors and wheels that go forward, turn or pick things up.' },
        { w: 'Step-by-step test', a: '👣 Running the program <strong>one instruction at a time</strong> to see where the robot goes wrong.' }
      ],

      memoPairs: [
        { id: 'programa', t: 'Program', d: '📋 a list of exact instructions' },
        { id: 'condicional', t: 'Conditional', d: '❓ IF the sensor detects… THEN… ELSE…' },
        { id: 'bucle', t: 'Loop', d: '🔄 repeating a block many times' },
        { id: 'variable', t: 'Variable', d: '📦 a little box where the robot stores a number' },
        { id: 'pseudocodigo', t: 'Pseudocode', d: '📝 the program written in plain English, before loading it' },
        { id: 'depurar', t: 'Debug', d: '🐞 finding and fixing the mistakes in the program' }
      ],

      qzData: [
        { q: 'What is the cycle a robot repeats while it is switched on?', o: ['a) Sleep → dream → wake up', 'b) Read the sensors → decide → move the actuators → repeat', 'c) Act → switch off → charge up', 'd) Decide → forget → repeat'], c: 1 },
        { q: 'What is a robot’s program?', o: ['a) A TV channel', 'b) The robot’s battery', 'c) The list of exact instructions it runs step by step', 'd) The name its owner gives it'], c: 2 },
        { q: 'Which instruction changes the robot’s direction without moving it off its square?', o: ['a) FORWARD', 'b) TURN RIGHT', 'c) STOP', 'd) REPEAT'], c: 1 },
        { q: '«IF the wall sensor detects an obstacle THEN turn, ELSE go forward». Which block is this?', o: ['a) A loop', 'b) A variable', 'c) A conditional', 'd) An actuator'], c: 2 },
        { q: 'The robot has to move forward 6 equal squares. Which block is best to use?', o: ['a) A loop: repeat 6 times FORWARD', 'b) A variable', 'c) A line sensor', 'd) The WAIT instruction'], c: 0 },
        { q: 'What is a variable for in a robot’s program?', o: ['a) For painting the robot', 'b) For storing a number, such as how many times it turned', 'c) For charging the battery', 'd) For switching the sensors off'], c: 1 },
        { q: 'What is pseudocode?', o: ['a) A broken-down robot', 'b) A secret language machines speak', 'c) The program written in plain language before loading it into the robot', 'd) A kind of sensor'], c: 2 },
        { q: 'The robot crashed into the wall. What does that mean?', o: ['a) That the robot got angry', 'b) That the program has a mistake and needs debugging', 'c) That the wall moved', 'd) That the robot is useless now'], c: 1 },
        { q: 'What does a robot actually do?', o: ['a) What its program says, not what you meant to say', 'b) Whatever it imagines', 'c) Whatever suits it', 'd) Whatever the other robots do'], c: 0 }
      ],

      classGroups: [
        {
          label: ['Instruction', 'Sensor'], headA: '👣 Instruction (the robot does)', headB: '📡 Sensor (the robot reads)', colA: 'ins', colB: 'sen',
          words: [{ w: 'FORWARD', t: 'ins' }, { w: 'Wall sensor', t: 'sen' }, { w: 'TURN RIGHT', t: 'ins' }, { w: 'Line sensor', t: 'sen' }, { w: 'WAIT', t: 'ins' }, { w: 'Obstacle sensor', t: 'sen' }, { w: 'TURN LEFT', t: 'ins' }, { w: 'Color sensor', t: 'sen' }, { w: 'STOP', t: 'ins' }, { w: 'Distance sensor', t: 'sen' }]
        },
        {
          label: ['Loop', 'Conditional'], headA: '🔄 Loop (repeat)', headB: '❓ Conditional (decide)', colA: 'buc', colB: 'con',
          words: [{ w: 'Repeat 4 times FORWARD', t: 'buc' }, { w: 'IF there is a wall THEN turn', t: 'con' }, { w: 'Repeat until you reach the goal', t: 'buc' }, { w: 'IF it sees a black line THEN keep going', t: 'con' }, { w: 'Repeat while there is no obstacle', t: 'buc' }, { w: 'ELSE go forward', t: 'con' }, { w: 'Repeat 10 times TURN', t: 'buc' }, { w: 'IF the soil is dry THEN water it', t: 'con' }]
        },
        {
          label: ['Correct program', 'Program with a bug'], headA: '✅ Correct program', headB: '🐞 Program with a bug', colA: 'ok', colB: 'bug',
          words: [{ w: 'FORWARD, FORWARD, TURN, FORWARD, STOP', t: 'ok' }, { w: 'TURN, TURN, TURN, TURN (it never goes forward)', t: 'bug' }, { w: 'Repeat 3 times FORWARD and then STOP', t: 'ok' }, { w: 'FORWARD without reading the wall sensor', t: 'bug' }, { w: 'IF there is a wall THEN turn ELSE go forward', t: 'ok' }, { w: 'The final STOP instruction is missing', t: 'bug' }, { w: 'It adds one to the counter every time it picks something up', t: 'ok' }, { w: 'A loop that never ends', t: 'bug' }]
        },
        {
          label: ['Sensor', 'Actuator'], headA: '📡 Sensor (information comes in)', headB: '⚙️ Actuator (action goes out)', colA: 'sen', colB: 'act',
          words: [{ w: 'Line sensor', t: 'sen' }, { w: 'Wheel motor', t: 'act' }, { w: 'Wall sensor', t: 'sen' }, { w: 'Arm that picks things up', t: 'act' }, { w: 'Color sensor', t: 'sen' }, { w: 'Horn', t: 'act' }, { w: 'Moisture sensor', t: 'sen' }, { w: 'Irrigation valve', t: 'act' }, { w: 'Distance sensor', t: 'sen' }, { w: 'LED light', t: 'act' }]
        }
      ],

      idData: [
        { s: ['The', 'program', 'is', 'the', 'robot’s', 'list', 'of', 'instructions.'], c: 1, art: 'the list of instructions the robot runs' },
        { s: ['The', 'loop', 'repeats', 'the', 'block', 'many', 'times.'], c: 1, art: 'the block that repeats instructions' },
        { s: ['The', 'conditional', 'chooses', 'between', 'two', 'paths.'], c: 1, art: 'the block that decides using the sensor' },
        { s: ['The', 'variable', 'stores', 'how', 'many', 'times', 'the', 'robot', 'turned.'], c: 1, art: 'the little box where a number is stored' },
        { s: ['The', 'pseudocode', 'is', 'written', 'before', 'loading', 'the', 'program.'], c: 1, art: 'the program written in plain language' },
        { s: ['Debugging', 'means', 'finding', 'and', 'fixing', 'the', 'mistakes.'], c: 0, art: 'the act of fixing the mistakes in the program' },
        { s: ['The', 'line', 'sensor', 'tells', 'the', 'black', 'from', 'the', 'floor.'], c: 1, art: 'the part that reads the line on the floor' },
        { s: ['The', 'instruction', 'FORWARD', 'moves', 'the', 'robot', 'one', 'square.'], c: 2, art: 'the instruction that moves the robot ahead' }
      ],

      cmpData: [
        { s: 'The robot cycle is: read the sensors → ___ → move the actuators → repeat.', opts: ['decide', 'sleep', 'paint'], c: 0 },
        { s: 'The list of instructions the robot obeys is called the ___.', opts: ['battery', 'program', 'antenna'], c: 1 },
        { s: 'To repeat the same block many times you use a ___.', opts: ['loop', 'screw', 'cable'], c: 0 },
        { s: 'The IF… THEN… ELSE block is called a ___.', opts: ['variable', 'conditional', 'actuator'], c: 1 },
        { s: 'A ___ stores how many objects the robot picked up.', opts: ['wheel', 'lamp', 'variable'], c: 2 },
        { s: 'Writing the program in plain English before loading it is called ___.', opts: ['pseudocode', 'drawing', 'a raffle'], c: 0 },
        { s: 'Finding and fixing the mistakes in the program is called ___.', opts: ['erasing', 'debugging', 'switching off'], c: 1 },
        { s: 'The robot does what the ___ says, not what you meant to say.', opts: ['teacher', 'wind', 'program'], c: 2 }
      ],

      routeSets: [
        {
          label: 'The line-following robot in the school hallway', steps: [
            'The line sensor reads the floor: is there black ahead?',
            'The controller decides: if there is a line, keep going; if not, turn',
            'The motors carry out the order and move the wheels',
            'The robot reads the sensor again: the cycle repeats']
        },
        {
          label: 'The robot that picks up the trash in the schoolyard', steps: [
            'The obstacle sensor detects the bottle lying there',
            'The program decides: if there is an object, then pick it up',
            'The arm acts and puts the bottle in the box',
            'The variable goes up by one: objects = objects + 1',
            'The loop repeats until the yard is finished']
        },
        {
          label: 'Programming the watering robot for the school garden', steps: [
            'Write the pseudocode for the watering in your notebook',
            'Load the program into the robot’s controller',
            'Test the program step by step in the garden',
            'Debug: fix the instruction that made the robot fail',
            'Test again until the watering comes out right']
        }
      ],

      neuronPartes: [
        { desc: 'The robot has to move forward 6 equal squares down the hallway', ans: 'A loop: repeat 6 times FORWARD', opts: ['A loop: repeat 6 times FORWARD', 'A counter variable', 'A color sensor', 'The WAIT instruction'] },
        { desc: 'The robot has to turn only when it finds a wall ahead', ans: 'A conditional with the wall sensor', opts: ['A conditional with the wall sensor', 'An infinite loop', 'A counter variable', 'The STOP instruction'] },
        { desc: 'The robot has to count how many bottles it picked up in the yard', ans: 'A counter variable', opts: ['A counter variable', 'A line sensor', 'The TURN RIGHT instruction', 'A wall conditional'] },
        { desc: 'The robot has to follow the black line painted on the classroom floor', ans: 'A conditional with the line sensor', opts: ['A conditional with the line sensor', 'A counter variable', 'The WAIT instruction', 'A loop of 2 times'] },
        { desc: 'The robot has to stay still for a moment before starting off', ans: 'The WAIT instruction', opts: ['The WAIT instruction', 'FORWARD', 'A counter variable', 'A wall sensor'] },
        { desc: 'The robot has to keep going forward as long as it finds no obstacles', ans: 'A loop: repeat while there is no obstacle', opts: ['A loop: repeat while there is no obstacle', 'A counter variable', 'The STOP instruction', 'A color sensor'] },
        { desc: 'The robot reached the goal and has to stay there', ans: 'The STOP instruction', opts: ['The STOP instruction', 'FORWARD', 'TURN LEFT', 'An infinite loop'] },
        { desc: 'Before loading the program you want to write it out in plain English to check it', ans: 'Writing the pseudocode', opts: ['Writing the pseudocode', 'Changing the battery', 'Painting the robot', 'Taking its sensors off'] }
      ],

      neuroPairs: [
        { trans: 'FORWARD', func: 'It moves the robot one square ahead', opts: ['It moves the robot one square ahead', 'It changes direction without moving off the square', 'It repeats a block of instructions', 'It stores a number in a little box'] },
        { trans: 'TURN RIGHT', func: 'It changes the robot’s direction without changing square', opts: ['It changes the robot’s direction without changing square', 'It moves two squares at once', 'It switches the battery on', 'It erases the program'] },
        { trans: 'Loop', func: 'It repeats a block of instructions several times', opts: ['It repeats a block of instructions several times', 'It reads the line sensor', 'It switches the motors off', 'It writes the pseudocode'] },
        { trans: 'Conditional', func: 'It reads a sensor and chooses between two paths', opts: ['It reads a sensor and chooses between two paths', 'It adds one to the counter', 'It moves the robot’s arm', 'It charges the battery'] },
        { trans: 'Variable', func: 'It stores a number, such as how many times the robot turned', opts: ['It stores a number, such as how many times the robot turned', 'It moves the wheels', 'It detects the wall ahead', 'It repeats the whole program'] }
      ],

      enfermedadData: [
        { disease: 'FORWARD · FORWARD · TURN RIGHT · FORWARD · STOP', characteristic: 'Correct program', opts: ['Correct program', 'It has a bug'] },
        { disease: 'TURN RIGHT · TURN RIGHT · TURN RIGHT · TURN RIGHT (the robot never changes square)', characteristic: 'It has a bug', opts: ['It has a bug', 'Correct program'] },
        { disease: 'REPEAT 5 TIMES: FORWARD. Then STOP', characteristic: 'Correct program', opts: ['Correct program', 'It has a bug'] },
        { disease: 'FORWARD toward the wall without ever reading the wall sensor', characteristic: 'It has a bug', opts: ['It has a bug', 'Correct program'] },
        { disease: 'IF there is a line ahead THEN FORWARD, ELSE TURN RIGHT', characteristic: 'Correct program', opts: ['Correct program', 'It has a bug'] },
        { disease: 'REPEAT FOREVER: WAIT (the robot never reaches the goal)', characteristic: 'It has a bug', opts: ['It has a bug', 'Correct program'] }
      ],

      retoPairs: [
        {
          label: ['Instruction', 'Sensor'], btnA: '👣 Instruction', btnB: '📡 Sensor', colA: 'ins', colB: 'sen',
          words: [{ w: 'FORWARD', t: 'ins' }, { w: 'Wall sensor', t: 'sen' }, { w: 'TURN RIGHT', t: 'ins' }, { w: 'Line sensor', t: 'sen' }, { w: 'WAIT', t: 'ins' }, { w: 'Color sensor', t: 'sen' }, { w: 'TURN LEFT', t: 'ins' }, { w: 'Distance sensor', t: 'sen' }, { w: 'STOP', t: 'ins' }, { w: 'Obstacle sensor', t: 'sen' }]
        },
        {
          label: ['Loop', 'Conditional'], btnA: '🔄 Loop', btnB: '❓ Conditional', colA: 'buc', colB: 'con',
          words: [{ w: 'Repeat 4 times', t: 'buc' }, { w: 'IF there is a wall…', t: 'con' }, { w: 'Repeat until you arrive', t: 'buc' }, { w: 'ELSE go forward', t: 'con' }, { w: 'Repeat while it keeps moving', t: 'buc' }, { w: 'IF it sees a black line…', t: 'con' }, { w: 'Repeat 10 times TURN', t: 'buc' }, { w: 'THEN turn', t: 'con' }, { w: 'Start the block over', t: 'buc' }, { w: 'Is there an obstacle ahead?', t: 'con' }]
        },
        {
          label: ['Correct program', 'Bug'], btnA: '✅ Correct', btnB: '🐞 Bug', colA: 'ok', colB: 'bug',
          words: [{ w: 'It goes forward and then STOPs on the goal', t: 'ok' }, { w: 'It turns nonstop and never goes forward', t: 'bug' }, { w: 'Repeat 3 times FORWARD', t: 'ok' }, { w: 'It crashes because it does not read the sensor', t: 'bug' }, { w: 'IF there is a wall THEN turn', t: 'ok' }, { w: 'The final instruction is missing', t: 'bug' }, { w: 'It adds 1 to the counter when it picks something up', t: 'ok' }, { w: 'A loop that never ends', t: 'bug' }, { w: 'It tests the program step by step', t: 'ok' }, { w: 'Instructions in the wrong order', t: 'bug' }]
        }
      ],

      identifyTaskDB: [
        { s: 'The program is the robot’s list of exact instructions.', type: 'Program' },
        { s: 'Repeat 6 times FORWARD until it crosses the hallway.', type: 'Loop' },
        { s: 'IF the wall sensor detects an obstacle THEN turn.', type: 'Conditional' },
        { s: 'The «turns» box stores how many times the robot turned.', type: 'Variable' },
        { s: 'The line sensor tells the black apart from the light floor.', type: 'Line sensor' },
        { s: 'I write the program in plain English before loading it into the robot.', type: 'Pseudocode' },
        { s: 'I test the program step by step and fix the wrong instruction.', type: 'Debugging' },
        { s: 'TURN RIGHT changes the direction without changing square.', type: 'Turning instruction' },
        { s: 'The motors move the wheels when the order arrives.', type: 'Actuators' },
        { s: 'Read the sensors, decide, move the actuators and repeat.', type: 'Robot cycle' }
      ],

      classifyTaskDB: [
        { w: 'IF there is a wall ahead THEN turn, ELSE go forward', gen: 'Conditional', n: 'The wall sensor', g: 'Turning or going forward', t: 'It turns the wheels or moves one square ahead' },
        { w: 'REPEAT 6 TIMES: FORWARD', gen: 'Loop', n: 'Nothing: it only counts the repetitions', g: 'Repeating the block 6 times', t: 'It moves forward 6 squares in a row' },
        { w: 'objects = objects + 1', gen: 'Variable (counter)', n: 'Nothing: it uses the number it already stored', g: 'Adding one to the counter', t: 'It stores the new number in the little box' },
        { w: 'IF the line sensor sees black THEN keep going, ELSE turn', gen: 'Conditional', n: 'The line sensor', g: 'Following the line or correcting the direction', t: 'It goes forward or turns the wheels' },
        { w: 'FORWARD', gen: 'Simple instruction', n: 'Nothing', g: 'Nothing: it runs straight away', t: 'It moves the robot one square ahead' },
        { w: 'REPEAT WHILE there is no obstacle: FORWARD', gen: 'Loop with a condition', n: 'The obstacle sensor', g: 'Keeping the loop going or leaving it', t: 'It goes forward until it finds something' },
        { w: 'WAIT', gen: 'Simple instruction', n: 'Nothing', g: 'Nothing', t: 'It lets time go by without moving' },
        { w: 'STOP', gen: 'Final instruction', n: 'Nothing', g: 'Nothing', t: 'The robot stays still on the goal' }
      ],

      completeTaskDB: [
        { s: 'The robot cycle is: read the sensors → ___ → move the actuators → repeat.', opts: ['decide', 'sleep', 'sing'], ans: 'decide' },
        { s: 'The robot’s list of instructions is called the ___.', opts: ['program', 'battery', 'wheel'], ans: 'program' },
        { s: 'To repeat a block several times you use a ___.', opts: ['loop', 'screw', 'magnet'], ans: 'loop' },
        { s: 'IF… THEN… ELSE is a ___.', opts: ['conditional', 'actuator', 'panel'], ans: 'conditional' },
        { s: 'The ___ stores how many times the robot turned.', opts: ['variable', 'antenna', 'propeller'], ans: 'variable' },
        { s: 'The program written in plain English is called ___.', opts: ['pseudocode', 'a drawing', 'a poem'], ans: 'pseudocode' },
        { s: 'Fixing the mistakes in the program is called ___.', opts: ['debugging', 'erasing', 'switching off'], ans: 'debugging' },
        { s: 'The robot does what the ___ says, not what you meant to say.', opts: ['program', 'teacher', 'wind'], ans: 'program' }
      ],

      explainQuestions: [
        { q: 'Explain the cycle of a programmed robot: read the sensors → decide → move the actuators → repeat. Give an example from your school.', ans: 'The robot reads its sensors (for instance the line sensor in the hallway), its program decides what to do («if there is a line, keep going; if not, turn»), the motors carry out the order and the cycle starts over. It repeats for as long as the robot is switched on.' },
        { q: 'Write in pseudocode the program of a robot that follows the black line down the school hallway.', ans: 'REPEAT UNTIL YOU REACH THE CLASSROOM: IF the line sensor sees black ahead THEN FORWARD, ELSE TURN RIGHT. On arrival: STOP. (Any clear wording with a loop and a conditional counts.)' },
        { q: 'What is debugging a program? Explain why the robot «does what the program says, not what you meant to say».', ans: 'Debugging is finding and fixing the mistakes (bugs) in the program by testing it step by step. The robot does not guess: it runs every instruction literally, which is why one instruction too many, too few or out of order makes it crash or get lost.' },
        { q: 'Design the program of a robot that picks up the trash in the schoolyard and counts how many objects it collected.', ans: 'Open answer. It must include: a loop («repeat while there are objects left»), a conditional with the obstacle sensor («if there is an object ahead then pick it up») and a counter variable («objects = objects + 1»), and it must end with STOP.' },
        { q: 'Write the program of the school garden watering robot using a loop, a conditional and a variable.', ans: 'Open answer. For example: plants = 0. REPEAT 10 TIMES: FORWARD; IF the moisture sensor says dry soil THEN open the valve, ELSE keep going; plants = plants + 1. At the end STOP and report how many plants it watered.' }
      ],

      sopaSets: [
        _sopa(10, ['PROGRAM', 'SENSOR', 'FORWARD', 'TURN', 'LOOP', 'ROBOT'], 20260727),
        _sopa(10, ['VARIABLE', 'REPEAT', 'CODE', 'COUNT', 'LINE', 'BUG'], 51920270)
      ],

      evalTFBank: [
        { q: 'The program is the list of exact instructions the robot runs step by step.', a: true },
        { q: 'The robot cycle is: read the sensors → decide → move the actuators → repeat.', a: true },
        { q: 'The robot guesses what the programmer meant to say.', a: false },
        { q: 'A loop is used to repeat a block of instructions.', a: true },
        { q: 'A conditional chooses between two paths depending on what the sensor reads.', a: true },
        { q: 'The TURN RIGHT instruction moves the robot two squares ahead.', a: false },
        { q: 'A variable is a little box with a name where the robot stores a number.', a: true },
        { q: 'Pseudocode is written after loading the program into the robot.', a: false },
        { q: 'Debugging is finding and fixing the mistakes in the program.', a: true },
        { q: 'A loop that never ends causes no problem at all.', a: false },
        { q: 'The line sensor tells the black line apart from the light floor.', a: true },
        { q: 'If the final instruction is missing, the robot still knows when to stop.', a: false },
        { q: 'The robot cycle runs only once and then the robot switches off.', a: false },
        { q: 'The actuators carry out the order the program sends.', a: true },
        { q: 'A counter subtracts one every time the robot picks up an object.', a: false }
      ],

      evalMCBank: [
        { q: 'What is a robot’s program?', o: ['a) Its battery', 'b) Its metal shell', 'c) The list of exact instructions it runs step by step', 'd) The name its owner gave it'], a: 2 },
        { q: 'What is the cycle of a programmed robot?', o: ['a) Sleep → dream → wake up', 'b) Read the sensors → decide → move the actuators → repeat', 'c) Act → switch off → charge', 'd) Turn → turn → turn'], a: 1 },
        { q: 'The robot has to move forward 8 equal squares. Which block is best to use?', o: ['a) A loop: repeat 8 times FORWARD', 'b) A variable', 'c) A color sensor', 'd) The WAIT instruction'], a: 0 },
        { q: '«IF the wall sensor detects an obstacle THEN turn, ELSE go forward» is…', o: ['a) A loop', 'b) A variable', 'c) An actuator', 'd) A conditional'], a: 3 },
        { q: 'What is a variable for in the program?', o: ['a) For moving the wheels', 'b) For storing a number, such as how many times it turned', 'c) For charging the battery', 'd) For painting the robot'], a: 1 },
        { q: 'What is pseudocode?', o: ['a) A broken-down robot', 'b) A secret language machines speak', 'c) The program written in plain language before loading it', 'd) A special sensor'], a: 2 },
        { q: 'The robot crashed into the wall. What has to be done?', o: ['a) Debug: check the program step by step and fix it', 'b) Give the robot a new name', 'c) Move the wall somewhere else', 'd) Switch the sensors off for good'], a: 0 },
        { q: 'Which instruction changes the robot’s direction without moving it off its square?', o: ['a) FORWARD', 'b) WAIT', 'c) TURN LEFT', 'd) STOP'], a: 2 },
        { q: 'Which sensor does a robot use to follow the line in the school hallway?', o: ['a) The moisture sensor', 'b) The line (color) sensor', 'c) The sound sensor', 'd) The temperature sensor'], a: 1 },
        { q: 'A loop that never ends…', o: ['a) makes the robot faster', 'b) saves battery', 'c) is the best way to program', 'd) is a mistake: the robot never reaches the goal'], a: 3 },
        { q: 'What does «the robot does what the program says, not what you meant to say» mean?', o: ['a) That it runs every instruction literally, even a wrong one', 'b) That the robot is disobedient', 'c) That the robot invents new instructions', 'd) That the robot needs no program'], a: 0 },
        { q: 'Which block does a robot need in order to count how many bottles it picked up in the yard?', o: ['a) A temperature sensor', 'b) A counter variable', 'c) The WAIT instruction', 'd) A horn'], a: 1 },
        { q: 'What does the WAIT instruction do?', o: ['a) It moves the robot one square', 'b) It repeats the whole program', 'c) It lets time go by without moving the robot', 'd) It erases the program'], a: 2 },
        { q: 'What is the first step in programming a robot properly?', o: ['a) Pressing buttons at random', 'b) Writing the pseudocode in plain language', 'c) Changing the battery', 'd) Taking its sensors off'], a: 1 },
        { q: 'In the school garden, which conditional does the watering robot use?', o: ['a) IF it is sunny THEN switch the robot off', 'b) IF there is noise THEN turn', 'c) IF there is a line THEN water', 'd) IF the soil is dry THEN open the water, ELSE keep going'], a: 3 }
      ],

      evalCPBank: [
        { q: 'The robot’s list of exact instructions is called the ___.', a: 'program' },
        { q: 'The robot cycle is: read the sensors, decide, move the actuators and ___.', a: 'repeat' },
        { q: 'To repeat a block many times you use a ___.', a: 'loop' },
        { q: 'The IF… THEN… ELSE block is called a ___.', a: 'conditional' },
        { q: 'The little box where the robot stores a number is called a ___.', a: 'variable' },
        { q: 'The program written in plain language before loading it is the ___.', a: 'pseudocode' },
        { q: 'Finding and fixing the mistakes in the program is called ___.', a: 'debugging' },
        { q: 'A mistake in the program is also called a ___.', a: 'bug' },
        { q: 'The instruction that moves the robot one square ahead is ___.', a: 'forward' },
        { q: 'The instruction that changes the robot’s direction is ___ right or left.', a: 'turn' },
        { q: 'The ___ sensor tells the black apart from the light floor.', a: 'line' },
        { q: 'The ___ sensor reports whether there is an obstacle right ahead.', a: 'wall' },
        { q: 'The variable that adds one each time is called a ___.', a: 'counter' },
        { q: 'The ___ carry out the order: motors and wheels.', a: 'actuators' },
        { q: 'When the robot reaches the goal, the program ends with the ___ instruction.', a: 'stop' }
      ],

      evalPRBank: [
        { term: 'Program', def: 'The list of exact instructions the robot runs step by step' },
        { term: 'Robot cycle', def: 'Read the sensors → decide → move the actuators → repeat' },
        { term: 'Loop', def: 'It repeats a block of instructions several times' },
        { term: 'Conditional', def: 'IF the sensor detects something, THEN…, ELSE…' },
        { term: 'Variable', def: 'A little box with a name where a number is stored' },
        { term: 'Counter', def: 'A variable that adds one every time something happens' },
        { term: 'Pseudocode', def: 'The program written in plain language before loading it' },
        { term: 'Debug', def: 'To find and fix the mistakes in the program' },
        { term: 'Bug', def: 'A wrong instruction, or one out of order, that makes the robot fail' },
        { term: 'FORWARD', def: 'It moves the robot one square ahead' },
        { term: 'TURN RIGHT', def: 'It changes the robot’s direction without changing square' },
        { term: 'WAIT', def: 'It lets time go by without moving the robot' },
        { term: 'STOP', def: 'The final instruction: the robot stays still on the goal' },
        { term: 'Line sensor', def: 'It tells the black line apart from the light floor' },
        { term: 'Wall sensor', def: 'It reports whether there is an obstacle right ahead' }
      ],

      critFaltaBank: [
        { txt: 'The robot has to go from A5 to A1 moving forward 4 squares, but the program says: FORWARD · FORWARD · FORWARD · STOP. The robot ends one square short of the goal.', ans: 'One FORWARD instruction is missing (there must be 4 in all) before STOP. It can also be written with a loop: REPEAT 4 TIMES FORWARD and then STOP.' },
        { txt: 'The line-following robot works fine, but when it reaches the goal it keeps walking and falls off the table. Program: REPEAT FOREVER: IF there is a line THEN FORWARD, ELSE TURN RIGHT.', ans: 'The STOP instruction is missing, and so is the loop’s exit condition («repeat UNTIL you reach the goal»). Without them the loop never ends.' },
        { txt: 'The robot has to turn at the corner of the hallway, but the program says: FORWARD · FORWARD · FORWARD and the robot crashes into the wall in front of it.', ans: 'A TURN (right or left) is missing before the last FORWARD; better still: use the conditional IF THERE IS A WALL AHEAD THEN TURN RIGHT, ELSE FORWARD.' },
        { txt: 'The robot picks up bottles in the yard, but in the end it always says it collected 0 objects. Program: REPEAT: IF there is an object THEN PICK IT UP.', ans: 'Raising the counter is missing: after PICK IT UP you have to write «objects = objects + 1». Without that instruction the variable never changes.' },
        { txt: 'The watering robot opens the water and never closes it again: the garden floods. Program: IF the soil is dry THEN OPEN THE VALVE.', ans: 'The ELSE branch is missing: IF the soil is dry THEN OPEN THE VALVE, ELSE CLOSE THE VALVE. Every conditional must also say what to do when the answer is NO.' },
        { txt: 'The robot has to wait for the teacher’s signal before starting off, but it shoots away the moment it is switched on. Program: FORWARD · FORWARD · STOP.', ans: 'The WAIT instruction at the start is missing (or a conditional: IF the sound sensor hears the signal THEN FORWARD, ELSE WAIT).' }
      ],

      critErrorBank: [
        {
          txt: '«My robot does not need to read the sensors: I already know where the walls are, so I just write FORWARD lots of times.»',
          g1: 'Without reading the sensors the robot senses nothing: if anything moves (a chair, a backpack) it will crash, because it repeats FORWARD blindly.',
          g2: 'The robot cycle always starts by READING THE SENSORS: without that step no decision is possible, because the conditional needs the sensor’s data in order to choose a branch.'
        },
        {
          txt: '«I wrote REPEAT FOREVER: FORWARD. That way the robot is sure to reach the goal.»',
          g1: 'A loop with no exit condition never ends: the robot will go straight past the goal and off the schoolyard.',
          g2: 'You have to write «REPEAT UNTIL you reach the goal» and close with STOP: every loop needs a way to finish.'
        },
        {
          txt: '«The robot got it wrong, so the robot is broken: it has to be replaced.»',
          g1: 'Almost always the one that got it wrong was the PROGRAM, not the machine: the robot runs literally whatever was written for it.',
          g2: 'The right thing to do is DEBUG: test the program step by step, find the wrong instruction and fix it.'
        },
        {
          txt: '«I wrote TURN RIGHT four times in a row so the robot would go faster.»',
          g1: 'TURN only changes the direction: it does not move the robot off its square, so after 4 turns the robot is exactly where it started.',
          g2: 'To move you have to use FORWARD (or a loop REPEAT 4 TIMES FORWARD): turning and going forward are different instructions.'
        },
        {
          txt: '«There is no need to write the pseudocode: I would rather try instructions at random until the robot arrives.»',
          g1: 'Pseudocode is written BEFORE, so you can think the route through in plain language; trying things at random wastes time and teaches you nothing about where the mistake is.',
          g2: 'Besides, without pseudocode you cannot debug: there is nothing to compare what the robot did against what it was supposed to do.'
        }
      ],

      critTraceQuestions: [
        '1. Write the square the robot ends up on after each instruction (use the coordinates A1…E5).',
        '2. Which square does the robot finish on, and which way is it facing?',
        '3. On which instruction did the sensor change the robot’s decision? Explain why.'
      ],

      /* Los programas usan las MISMAS constantes que el español (C_PARED, I_AV…):
         son el identificador interno del simulador, no un texto traducible. */
      critTraceBank: [
        {
          txt: 'The robot starts at A5 facing North. There is a crate 📦 on A3 blocking its way.',
          n: 5, start: { r: 4, c: 0, dir: 'N' }, obst: [[2, 0]], linea: [], deco: { '0,4': '🏫' },
          prog: [C_PARED, C_PARED, C_PARED, I_AV, I_AV]
        },
        {
          txt: 'The robot starts at C5 facing North, on the hallway with the black line painted on the floor.',
          n: 5, start: { r: 4, c: 2, dir: 'N' }, obst: [], linea: [[3, 2], [2, 2], [2, 3], [2, 4]], deco: { '0,0': '🏫' },
          prog: [C_LINEA, C_LINEA, C_LINEA, C_LINEA, C_LINEA]
        },
        {
          txt: 'The robot starts at E5 facing West. There is a crate 📦 on C5, in the middle of the yard.',
          n: 5, start: { r: 4, c: 4, dir: 'O' }, obst: [[4, 2]], linea: [], deco: { '0,0': '🏫' },
          prog: [I_AV, C_PARED, C_PARED, I_AV, I_AV]
        },
        {
          txt: 'The robot starts at B5 facing North, following a black line that bends to the left.',
          n: 5, start: { r: 4, c: 1, dir: 'N' }, obst: [], linea: [[3, 1], [2, 1], [2, 0]], deco: { '0,4': '🏫' },
          prog: [C_LINEAI, C_LINEAI, C_LINEAI, C_LINEAI, C_LINEAI]
        }
      ],

      critCompareBank: [
        {
          a: 'PROGRAM A: FORWARD · FORWARD · FORWARD · FORWARD · STOP',
          b: 'PROGRAM B: FORWARD · FORWARD · FORWARD · STOP',
          ga: 'Program A is the correct one: it covers the 4 squares and stops right on the goal.',
          gb: 'Program B «almost» works: it is one FORWARD short, so the robot stops one square before the goal.',
          gr: 'Similarity: they use the same instructions and both end with STOP. Difference: the number of repetitions. A loop REPEAT 4 TIMES FORWARD avoids this counting mistake.'
        },
        {
          a: 'PROGRAM A: REPEAT UNTIL YOU REACH THE GOAL: IF there is a line ahead THEN FORWARD, ELSE TURN RIGHT. Then STOP.',
          b: 'PROGRAM B: REPEAT FOREVER: IF there is a line ahead THEN FORWARD, ELSE TURN RIGHT.',
          ga: 'Program A is the correct one: its loop has an exit condition («until you reach the goal») and it ends with STOP.',
          gb: 'Program B «almost» works: it follows the line just as well, but its loop never ends and the robot goes straight past the goal.',
          gr: 'Similarity: both follow the line with the same conditional. Difference: only A can stop. Every loop needs a way to finish.'
        },
        {
          a: 'PROGRAM A: IF THERE IS A WALL AHEAD THEN TURN RIGHT, ELSE FORWARD.',
          b: 'PROGRAM B: FORWARD (without ever reading the wall sensor).',
          ga: 'Program A is the correct one: it reads the sensor before moving and then decides; it still works even if the obstacles move around.',
          gb: 'Program B «almost» works: it goes forward fine while the way is clear, but it crashes the moment an obstacle turns up.',
          gr: 'Similarity: both make the robot move forward. Difference: only A completes the full cycle read the sensors → decide → act; B acts blindly.'
        },
        {
          a: 'PROGRAM A: objects = 0 · REPEAT: IF there is an object THEN PICK IT UP and objects = objects + 1.',
          b: 'PROGRAM B: REPEAT: IF there is an object THEN PICK IT UP.',
          ga: 'Program A is the correct one: it uses a counter variable and raises it every time it picks something up.',
          gb: 'Program B «almost» works: it picks up the trash just the same, but in the end it does not know how many objects it collected.',
          gr: 'Similarity: both pick up the trash with the same conditional. Difference: only A saves the information in a variable; with no counter the data is lost.'
        }
      ],

      critDesignBank: [
        'At your school, the hallway from the gate to the principal’s office has a black line painted on the floor, and the attendance list has to be taken there every single day.',
        'The schoolyard is covered in bottles and bags every morning, and cleaning it up eats half an hour of class time.',
        'The school garden dries out over the weekend because nobody comes to water it.',
        'In your community’s cornfield the birds eat the corn and somebody has to spend all day scaring them off.',
        'At the corner store in the neighborhood somebody has to check at night whether the door was left open.'
      ],

      critDesignGuide: 'Rubric with 4 criteria (20 pts total): ① PSEUDOCODE (6 pts): write the program in plain language, with the instructions in order and numbered. ② CONDITIONAL WITH A SENSOR (5 pts): include at least one «IF the sensor … THEN … ELSE …» with a sensor that suits the problem. ③ LOOP (5 pts): use «repeat N times» or «repeat until …» and explain how the loop ends. ④ VARIABLE AND CLOSING (4 pts): use a counter variable and end the program with STOP. Any design counts as long as another person can run it step by step without hesitating.',

      /* Igual que arriba: sol[] guarda las constantes del simulador */
      parteData: {
        n1: {
          nombre: 'Level 1 · Movement instructions', icon: '1️⃣', n: 5, start: { r: 4, c: 2, dir: 'N' }, dest: [0, 2], destEmoji: '🎯',
          obst: [], linea: [], deco: { '0,0': '🏫', '4,4': '🏀' },
          meta: 'The simplest program of all: the robot is on C5 facing North and the goal 🎯 is on C1, in a straight line. Use FORWARD as many times as you need and close with STOP.',
          sol: [I_AV, I_AV, I_AV, I_AV, I_FIN], xpn: 5
        },
        n2: {
          nombre: 'Level 2 · Going forward and turning', icon: '2️⃣', n: 5, start: { r: 4, c: 0, dir: 'N' }, dest: [2, 2], destEmoji: '🎯',
          obst: [], linea: [], deco: { '0,0': '🏫', '0,4': '🏪' },
          meta: 'Now you have to turn: the robot starts on A5 facing North and the goal 🎯 is on C3. Combine FORWARD with TURN RIGHT. Remember: turning does NOT move the robot off its square.',
          sol: [I_AV, I_AV, I_GD, I_AV, I_AV, I_FIN], xpn: 5
        },
        n3: {
          nombre: 'Level 3 · Wall sensor', icon: '3️⃣', n: 5, start: { r: 4, c: 2, dir: 'N' }, dest: [0, 2], destEmoji: '🎯',
          obst: [[2, 2]], linea: [], deco: { '0,0': '🏫', '4,4': '🏀' },
          meta: 'A crate 📦 is blocking C3. Use the block «IF THERE IS A WALL AHEAD → TURN RIGHT, ELSE → FORWARD» so the robot DECIDES on its own, and go around it up to the goal 🎯 on C1.',
          sol: [C_PARED, C_PARED, I_AV, I_GI, I_AV, I_AV, I_GI, I_AV, I_GD, I_AV, I_FIN], xpn: 5
        },
        n4: {
          nombre: 'Level 4 · Line sensor (the hallway)', icon: '4️⃣', n: 5, start: { r: 4, c: 0, dir: 'N' }, dest: [1, 2], destEmoji: '🗑️',
          obst: [], linea: [[3, 0], [2, 0], [1, 0], [1, 1], [1, 2]], deco: { '4,4': '🏫', '0,4': '🌳' },
          meta: 'The school hallway has a black line painted on it. Repeat the block «IF THERE IS A LINE AHEAD → FORWARD, ELSE → TURN RIGHT» over and over (that is a LOOP!) all the way to the trash can 🗑️ on C2.',
          sol: [C_LINEA, C_LINEA, C_LINEA, C_LINEA, C_LINEA, C_LINEA, I_FIN], xpn: 5
        },
        n5: {
          nombre: 'Level 5 · The line bends to the left', icon: '5️⃣', n: 5, start: { r: 4, c: 2, dir: 'N' }, dest: [0, 0], destEmoji: '🌱',
          obst: [], linea: [[3, 2], [2, 2], [2, 1], [2, 0], [1, 0], [0, 0]], deco: { '4,4': '🏫', '0,4': '🏀' },
          meta: 'This line bends left first and then right. Combine the two line-sensor blocks (the one that turns right and the one that turns left) all the way to the school garden 🌱 on A1.',
          sol: [C_LINEAI, C_LINEAI, C_LINEAI, C_LINEAI, C_LINEAI, C_LINEA, C_LINEA, C_LINEA, I_FIN], xpn: 5
        },
        n6: {
          nombre: 'Level 6 · Schoolyard challenge', icon: '6️⃣', n: 5, start: { r: 4, c: 0, dir: 'N' }, dest: [0, 4], destEmoji: '🎯',
          obst: [[1, 0], [3, 1], [1, 3], [3, 3]], linea: [[2, 1], [2, 2], [1, 2], [0, 2]], deco: { '4,4': '🏫' },
          meta: 'The final challenge: crates 📦 and a black line on the same map. Use the wall sensor to dodge, the line sensor to follow the path, and reach the goal 🎯 on E1.',
          sol: [C_PARED, C_PARED, C_PARED, C_LINEA, C_LINEA, C_LINEAI, C_LINEAI, C_LINEAI, C_LINEA, I_AV, I_AV, I_FIN], xpn: 5
        }
      }
    },

    /* ══════════════════════════════════════════════════════
       3. FRASES EXACTAS (pantalla y pruebas imprimibles)
       ══════════════════════════════════════════════════════ */
    frases: {
      /* pestañas propias de esta misión */
      'Bloques': 'Blocks', 'Simulador': 'Simulator',
      /* el lenguaje del simulador, cuando cae solo en un nodo de texto */
      'AVANZA': 'FORWARD', 'GIRA DERECHA': 'TURN RIGHT', 'GIRA IZQUIERDA': 'TURN LEFT',
      'ESPERA': 'WAIT', 'DETENTE': 'STOP',
      'Norte': 'North', 'Este': 'East', 'Sur': 'South', 'Oeste': 'West',
      'Robot en': 'Robot at', 'mirando al': 'facing',
      'pared adelante': 'wall ahead', 've la línea': 'it sees the line',
      /* simulador: avisos que el JS arma al vuelo */
      'Toca los botones de arriba para armar tu programa 👆': 'Tap the buttons above to build your program 👆',
      '⚠️ Máximo 30 instrucciones': '⚠️ 30 instructions maximum',
      '🕹️ Cargando el patio de la escuela…': '🕹️ Loading the schoolyard…',
      'Primero arma tu programa con los botones (AVANZA, GIRA, ESPERA, los bloques de sensor y DETENTE).':
        'Build your program with the buttons first (FORWARD, TURN, WAIT, the sensor blocks and STOP).',
      'El programa terminó y el robot no se detuvo en la meta. Agrega la instrucción DETENTE cuando el robot esté justo sobre la meta.':
        'The program finished and the robot did not stop on the goal. Add the STOP instruction for when the robot is right on top of the goal.',
      'En este programa el sensor respondió siempre igual y el robot avanzó cada vez.':
        'In this program the sensor answered the same way every time and the robot moved forward each turn.',
      /* mini-quiz */
      '¡Correcto! Piensas como todo un programador.': 'Correct! You are thinking like a real programmer.',
      'Casi. Recuerda: el robot solo hace lo que dice el programa.': 'Almost. Remember: the robot only does what the program says.',
      /* flashcards y memorama */
      '🧠 Memorama de la Programación': '🧠 Programming Memory Game',
      /* clasifica */
      '🗂️ Clasifica los Bloques': '🗂️ Sort the Blocks',
      '💡 Consejo: ¡Usa el botón "Variar grupo" varias veces! Practicar con diferentes categorías te ayudará a dominar el tema.':
        '💡 Tip: use the "Change group" button several times! Practicing with different categories helps you master the topic.',
      /* widgets */
      '🔁 Ordena el ciclo del robot': '🔁 Put the robot cycle in order',
      'para poner los pasos del programa en el orden correcto:': 'arrows to put the program steps in the right order:',
      'Hay pasos fuera de orden. Recuerda: leer sensores → decidir → mover actuadores → repetir.':
        'Some steps are out of order. Remember: read the sensors → decide → move the actuators → repeat.',
      '🧩 ¿Qué bloque necesita el programa?': '🧩 Which block does the program need?',
      'Lee la situación y elige el bloque adecuado:': 'Read the situation and choose the right block:',
      '🎉 ¡Ya sabes elegir el bloque correcto!': '🎉 You know how to pick the right block now!',
      '🔗 Empareja: Bloque → Función': '🔗 Match: Block → Function',
      '¿Qué hace este bloque o instrucción?': 'What does this block or instruction do?',
      '🐞 ¿Programa correcto o tiene un bug?': '🐞 Correct program, or does it have a bug?',
      'Pregúntate: ¿el robot llega a la meta y el programa termina?': 'Ask yourself: does the robot reach the goal and does the program end?',
      /* generador de tareas */
      '🗂️ Clasificar bloques': '🗂️ Sort blocks', '💡 Explicar y programar': '💡 Explain and program',
      'Copia en tu cuaderno; subraya, colorea o encierra el concepto de programación indicado en cada oración. Escribe al lado qué bloque o parte del programa es.':
        'Copy this in your notebook; underline, color or circle the programming concept in each sentence. Next to it, write which block or part of the program it is.',
      'Repite 6 veces AVANZA. →': 'Repeat 6 times FORWARD. →',
      'Bucle': 'Loop',
      'Copia la siguiente tabla en tu cuaderno. Para cada línea de programa responde: ¿qué tipo de bloque es?, ¿qué sensor lee?, ¿qué decide? y ¿qué hace el robot? Explica con tus palabras.':
        'Copy the table below in your notebook. For each line of the program answer: what kind of block is it? which sensor does it read? what does it decide? and what does the robot do? Explain in your own words.',
      'Línea del programa': 'Line of the program', '¿Qué bloque es?': 'Which block is it?',
      '¿Qué lee?': 'What does it read?', '¿Qué decide?': 'What does it decide?', '¿Qué hace?': 'What does it do?',
      /* evaluación conceptual: pantalla e impresión */
      'Evaluación Final · Programando un Robot · Educación Básica · Robótica': 'Final Test · Programming a Robot · Basic Education · Robotics',
      'Evaluación Competencial · Pensamiento Crítico · Programando un Robot · Educación Básica': 'Competency Test · Critical Thinking · Programming a Robot · Basic Education',
      'Evaluación Competencial · Pensamiento Crítico · Programando un Robot · Educación Básica · Robótica': 'Competency Test · Critical Thinking · Programming a Robot · Basic Education · Robotics',
      '🎓 Evaluación Final · Programando un Robot': '🎓 Final Test · Programming a Robot',
      '🧠 Prueba de Pensamiento Crítico · Programando un Robot': '🧠 Critical Thinking Test · Programming a Robot',
      '✅ PAUTA: Evaluación Final · Programando un Robot': '✅ ANSWER KEY: Final Test · Programming a Robot',
      '✅ PAUTA: Pensamiento Crítico · Programando un Robot': '✅ ANSWER KEY: Critical Thinking · Programming a Robot',
      /* pensamiento crítico: títulos y consignas propias */
      'I. ¿Qué instrucción falta?': 'I. Which instruction is missing?',
      'II. Corrige el programa': 'II. Correct the program',
      'III. Traza el recorrido y predice dónde termina': 'III. Trace the route and predict where it ends',
      'III. Traza el recorrido': 'III. Trace the route',
      'V. Diseña el programa de tu robot': 'V. Design your robot’s program',
      'V. Diseña el programa · Rúbrica': 'V. Design the program · Rubric',
      '¿Qué instrucción falta en este programa? Escríbela y explica por qué el robot falla sin ella.':
        'Which instruction is missing from this program? Write it down and explain why the robot fails without it.',
      '. Corrígelos con argumentos, usando lo que sabes de instrucciones, condicionales y bucles:':
        '. Correct them with arguments, using what you know about instructions, conditionals and loops:',
      'Esta idea sobre programación tiene dos errores. Corrígelos con argumentos:':
        'This idea about programming contains two mistakes. Correct them with arguments:',
      'Esta idea sobre programación tiene': 'This idea about programming contains',
      '1. ¿Cuál programa es el correcto y cuál «casi» funciona? 2. ¿En qué se parecen? 3. ¿Qué error exacto tiene el que «casi» funciona y cómo lo corriges?':
        '1. Which program is the correct one and which one «almost» works? 2. How are they alike? 3. What exact mistake does the one that «almost» works have, and how do you fix it?',
      'Escribe en PSEUDOCÓDIGO el programa de un robot que resuelva este problema: numera las instrucciones, incluye un CONDICIONAL con sensor («SI el sensor … ENTONCES … SINO …»), un BUCLE («repite … hasta …»), una VARIABLE contadora y cierra con DETENTE. Puedes dibujar la ruta en tu cuaderno.':
        'Write in PSEUDOCODE the program of a robot that solves this problem: number the instructions, include a CONDITIONAL with a sensor («IF the sensor … THEN … ELSE …»), a LOOP («repeat … until …»), a counter VARIABLE, and close with STOP. You may draw the route in your notebook.',
      'Escribe en PSEUDOCÓDIGO el programa de un robot que resuelva este problema: numera las instrucciones e incluye un CONDICIONAL con sensor, un BUCLE, una VARIABLE contadora y el DETENTE final. Dibuja la ruta al reverso de la hoja.':
        'Write in PSEUDOCODE the program of a robot that solves this problem: number the instructions and include a CONDITIONAL with a sensor, a LOOP, a counter VARIABLE and the final STOP. Draw the route on the back of the sheet.',
      'Programa A': 'Program A', 'Programa B': 'Program B',
      'Programa:': 'Program:', 'Recorrido:': 'Route:', 'Termina en:': 'Ends at:',
      'El sensor decidió:': 'The sensor decided:',
      /* constancia */
      'Misión Programando un Robot': 'Mission · Programming a Robot',
      '¡Sigue aprendiendo!': 'Keep learning!',
      '¡Muy buen trabajo!': 'Great work!',
      '¡Vas muy bien!': 'You are doing very well!',
      '¡Ya programas robots con sensores!': 'You can program robots with sensors now!',
      '¡Maestro Programador de Robots!': 'Master Robot Programmer!',
      /* etiquetas de accesibilidad (aria-label y title) */
      'Barra de progreso XP': 'XP progress bar',
      'Compartir misión por WhatsApp': 'Share this mission on WhatsApp',
      'Tarjeta de estudio. Presiona Enter para voltear': 'Study card. Press Enter to flip',
      'Opciones': 'Options',
      'Ir a la siguiente sección': 'Go to the next section',
      'Secciones de la misión': 'Mission sections',
      'Logros desbloqueados': 'Achievements unlocked',
      'Tipo de evaluación': 'Type of test',
      'Cuadrícula del robot programado': 'Grid of the programmed robot',
      'Error 1 y su corrección': 'Mistake 1 and its correction',
      'Error 2 y su corrección': 'Mistake 2 and its correction',
      'Comparación razonada de los programas A y B': 'Reasoned comparison of programs A and B',
      'Pseudocódigo del programa del robot': 'Pseudocode of the robot’s program'
    },

    /* ══════════════════════════════════════════════════════
       4. FRAGMENTOS (textos con números o nombres variables)
       Los comunes a todas las misiones ya viven en el motor.
       ══════════════════════════════════════════════════════ */
    fragmentos: [
      /* WhatsApp: el título de la misión en la constancia */
      [/¡(.+?) completó la Misión "Programando un Robot"!/g, '$1 completed the mission “Programming a Robot”!'],
      /* el lenguaje del simulador dentro de frases compuestas
         primero los bloques completos, que contienen a las sueltas */
      ['SI HAY PARED ADELANTE → GIRA DERECHA, SINO → AVANZA', 'IF THERE IS A WALL AHEAD → TURN RIGHT, ELSE → FORWARD'],
      ['SI HAY LÍNEA ADELANTE → AVANZA, SINO → GIRA DERECHA', 'IF THERE IS A LINE AHEAD → FORWARD, ELSE → TURN RIGHT'],
      ['SI HAY LÍNEA ADELANTE → AVANZA, SINO → GIRA IZQUIERDA', 'IF THERE IS A LINE AHEAD → FORWARD, ELSE → TURN LEFT'],
      ['GIRA DERECHA', 'TURN RIGHT'], ['GIRA IZQUIERDA', 'TURN LEFT'],
      ['GIRA DER.', 'TURN RIGHT'], ['GIRA IZQ.', 'TURN LEFT'],
      ['AVANZA', 'FORWARD'], ['ESPERA', 'WAIT'], ['DETENTE', 'STOP'],
      /* simulador: estado del robot y de los sensores */
      /* «El robot termina en C1 mirando al Norte» va antes que el « mirando al »
         suelto, o este se lo come y el principio se queda en español */
      [/El robot termina en ([A-E]\d) mirando al /g, 'The robot ends at $1 facing '],
      [/Robot en /g, 'Robot at '],
      [/ mirando al /g, ' facing '],
      [/📡 Sensores ahora mismo: /g, '📡 Sensors right now: '],
      [/✅ camino libre/g, '✅ clear path'],
      [/⬜ no ve línea/g, '⬜ it does not see the line'],
      [/Norte/g, 'North'], [/Este/g, 'East'], [/Sur/g, 'South'], [/Oeste/g, 'West'],
      /* simulador: la traza de la rama que corrió el condicional */
      ['✔ SÍ · ', '✔ YES · '],
      ['¿el sensor de pared detecta un obstáculo adelante?', 'does the wall sensor detect an obstacle ahead?'],
      ['¿el sensor de línea ve la línea negra adelante?', 'does the line sensor see the black line ahead?'],
      [' → corre la rama ENTONCES (', ' → it runs the THEN branch ('],
      [' → corre la rama SINO (', ' → it runs the ELSE branch ('],
      /* simulador: choque, meta y pista */
      [/💥 ¡El robot chocó en la instrucción (\d+) \(/g, '💥 The robot crashed on instruction $1 ('],
      ['! Se salió del patio. Depura tu programa: revísalo paso a paso y vuelve a ejecutarlo.',
        '! It went off the schoolyard. Debug your program: check it step by step and run it again.'],
      ['! Hay un cajón 📦 en esa casilla. Depura tu programa: revísalo paso a paso y vuelve a ejecutarlo.',
        '! There is a crate 📦 on that square. Debug your program: check it step by step and run it again.'],
      [/🎯 ¡Meta alcanzada en ([A-E]\d) con (\d+) instrucciones! ¡Excelente, programador!/g,
        '🎯 Goal reached at $1 with $2 instructions! Excellent work, programmer!'],
      [/🛑 El robot se detuvo en ([A-E]\d)… pero la meta está en ([A-E]\d)\. Traza otra vez el recorrido en tu cuaderno\./g,
        '🛑 The robot stopped at $1… but the goal is at $2. Trace the route again in your notebook.'],
      /* la palabra DETENTE ya la tradujo el fragmento de arriba: aquí dice STOP */
      [/💡 Pista: la solución más corta usa (\d+|\?) instrucciones \(contando STOP\)\./g,
        '💡 Hint: the shortest solution uses $1 instructions (counting the STOP).'],
      /* pensamiento crítico: la traza paso a paso */
      [/En la instrucción (\d+) el sensor respondió «SÍ», por eso el robot ejecutó /g,
        'On instruction $1 the sensor answered «YES», so the robot ran '],
      [/En la instrucción (\d+) el sensor respondió «NO», por eso el robot ejecutó /g,
        'On instruction $1 the sensor answered «NO», so the robot ran '],
      [' en vez de avanzar.', ' instead of moving forward.'],
      /* widgets: la corrección larga va antes que la genérica */
      [/^Correcto: (.+)\. Pregúntate: ¿el robot llega a la meta y el programa termina\?/,
        'Correct: $1. Ask yourself: does the robot reach the goal and does the program end?'],
      [/^Correcto: /, 'Correct: '],
      /* generador de tareas: la fila de respuestas de la tabla */
      [/Bloque: /g, 'Block: '],
      [/ \| Lee: /g, ' | Reads: '],
      [/ \| Decide: /g, ' | Decides: '],
      [/ \| Hace: /g, ' | Does: '],
      /* títulos con número de forma: antes que la regla suelta «Forma N» */
      [/🎓 Evaluación Final · Forma (\d+) · Programando un Robot/g, '🎓 Final Test · Form $1 · Programming a Robot'],
      [/🧠 Pensamiento Crítico · Forma (\d+) · Programando un Robot/g, '🧠 Critical Thinking · Form $1 · Programming a Robot'],
      [/Evaluación Programando un Robot/g, 'Test · Programming a Robot'],
      [/Pensamiento Crítico Programando un Robot/g, 'Critical Thinking · Programming a Robot'],
      /* etiquetas de accesibilidad con número */
      [/Instrucción que falta en el caso (\d+) y su justificación/g, 'Missing instruction in case $1 and its justification'],
      [/Elegir número de forma exacta \(1 a (\d+)\)/g, 'Choose the exact form number (1 to $1)']
    ],

    /* ══════════════════════════════════════════════════════
       5. TEXTOS QUE VIVEN EN EL CSS (content: '…')
       ══════════════════════════════════════════════════════ */
    css: [
      'body[data-idioma="en"] .hero::before{content:\'PROGRAM · INSTRUCTION · LOOP · VARIABLE · CONDITIONAL · SENSOR · ACTUATOR · DEBUG · BUG · PSEUDOCODE · COUNTER · ROBOT · CYCLE · FORWARD · STOP\';}',
      'body[data-idioma="en"] .eval-answer::before{content:\'✓ Answer: \';}',
      'body[data-idioma="en"] .crit-pauta::before{content:\'📋 Answer key: \';}'
    ].join('\n')
  };
})();
