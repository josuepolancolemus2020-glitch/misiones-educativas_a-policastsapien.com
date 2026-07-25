/* ============================================================
   Misión «Condicionales: el Robot Decide» — versión en inglés
   ------------------------------------------------------------
   Traducción de autor (no automática) para escuelas bilingües.
   Se carga junto a la misión y el motor js/metas-i18n.js la
   activa con el botón 🌐 English de la barra superior.

   Criterio de traducción:
   · Inglés AMERICANO estricto: color, center, catalog, analyze,
     traffic light, «Student No.».
   · Vocabulario estándar de programación escolar: conditional ·
     condition · IF…THEN…ELSE · THEN branch · ELSE branch ·
     sensor · true/false · chained conditionals · bug · trace.
   · Lo cultural se explica, no se calca: milpa → cornfield,
     fogón de leña → wood cookfire, pulpería → corner store,
     tendedero → clothesline, río crecido → swollen river.

   EL LENGUAJE DEL SIMULADOR NO SE TRADUCE EN EL DATO, SOLO AL
   PINTARLO (igual que en Programando un Robot): AVANZA, GIRA
   DERECHA, C_PARED… son el identificador interno con el que el
   simulador compara y con el que el HTML llama a labAdd(). Lo
   traduce el motor con los fragmentos de más abajo.

   LA EXCEPCIÓN ES WGT_TXT. Los widgets «¿Qué hace el robot?» y
   «Detective del bug» comparan el textContent de sus botones
   contra el dato; si el motor tradujera esos rótulos al vuelo, la
   comparación fallaría. Por eso el pegamento («Línea N», «(el
   condicional está mal)») viaja EN EL BANCO y los dos widgets se
   reconstruyen al cambiar de idioma.

   · Los bancos son traducción ÍNDICE A ÍNDICE del español: las
     formas deterministas (1–30) sacan las mismas preguntas y la
     misma clave ZipGrade en los dos idiomas.
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

    titulo: 'Mission Conditionals: the Robot Decides | policastsapien.com',

    /* ══════════════════════════════════════════════════════
       1. BLOQUES DE CONTENIDO (data-i18n en el HTML)
       ══════════════════════════════════════════════════════ */
    html: {

      hero:
        '<h1>Mission <span>Conditionals: the Robot Decides</span></h1>' +
        '<p class="sub">Make the robot DECIDE with IF… THEN… ELSE according to what it sees! 🤖🔀🚦</p>' +
        '<div class="badge">💻 Code Path · Stage 3 of 7 · Programming</div>',

      a1:
        '<h2>🔀 Deciding according to the situation</h2>' +
        '<p>Every day we <strong>make decisions</strong> according to what is happening: <strong>IF</strong> it rains ' +
        '<strong>THEN</strong> I take an umbrella, <strong>ELSE</strong> I take a cap. That is a ' +
        '<strong>conditional</strong>: an instruction that makes you <strong>choose</strong> between two paths according to a ' +
        '<strong>condition</strong>. The condition is always a <strong>yes-or-no question</strong> («is it raining?»).</p>' +
        '<div class="vs-grid">' +
        '<div class="vs-box vs-a">' +
        '<h4>❓ The condition is a question</h4>' +
        '<p>«Is it raining?», «is there a wall ahead?». It can only be answered <strong>YES</strong> or <strong>NO</strong>: never «maybe».</p>' +
        '</div>' +
        '<div class="vs-box vs-b">' +
        '<h4>🔀 Two paths, only one runs</h4>' +
        '<p>If the answer is <strong>YES</strong>, the <strong>THEN</strong> branch runs. If it is <strong>NO</strong>, the <strong>ELSE</strong> branch runs. Never both!</p>' +
        '</div>' +
        '</div>' +
        '<div class="tip">' +
        '<span class="ti">☂️</span>' +
        '<div><strong>An everyday example:</strong> <em>IF</em> it is raining <em>THEN</em> I take an umbrella, <em>ELSE</em> I take a cap. Change the answer and what you do changes… but you only ever do ONE thing!</div>' +
        '</div>' +
        '<div class="mq-wrap">' +
        '<div class="mq-q">🎮 Mini-quiz: which one of these IS a condition (a yes/no question)?</div>' +
        '<div class="mq-opts">' +
        '<button class="mq-opt" onclick="miniQuiz(this,false,\'mqFb1\')">«FORWARD one square»</button>' +
        '<button class="mq-opt" onclick="miniQuiz(this,true,\'mqFb1\')">«Is there a wall ahead?»</button>' +
        '<button class="mq-opt" onclick="miniQuiz(this,false,\'mqFb1\')">«TURN RIGHT»</button>' +
        '</div>' +
        '<div class="mq-fb" id="mqFb1" aria-live="polite"></div>' +
        '</div>',

      a2:
        '<h2>🤖 IF-THEN and IF-THEN-ELSE in the robot</h2>' +
        '<p>The <strong>sensors</strong> are the robot’s «questions»: they tell it whether <strong>there is a wall ahead</strong> ' +
        'or whether <strong>the traffic light is green</strong>. With that answer the robot decides which branch to run and ' +
        'which one to <strong>ignore</strong>.</p>' +
        '<div class="type-grid">' +
        '<div class="type-chip tc-teal"><div class="t-art">❓ Condition</div><div class="t-info">The yes/no question the sensor reads</div></div>' +
        '<div class="type-chip tc-gold"><div class="t-art">👉 THEN branch</div><div class="t-info">What it does if the answer is YES</div></div>' +
        '<div class="type-chip tc-amber"><div class="t-art">👈 ELSE branch</div><div class="t-info">What it does if the answer is NO</div></div>' +
        '<div class="type-chip tc-jade"><div class="t-art">☝️ Only one branch</div><div class="t-info">One runs; the other one is ignored</div></div>' +
        '</div>' +
        '<div class="tip">' +
        '<span class="ti">🌳</span>' +
        '<div><strong>In the simulator:</strong> «<b>IF THERE IS A WALL AHEAD → TURN RIGHT, ELSE → FORWARD</b>». If the robot has a tree 🌳 in front of it, it turns; if the way is clear, it goes forward. Only one thing happens!</div>' +
        '</div>' +
        '<div class="mq-wrap">' +
        '<div class="mq-q">🎮 Mini-quiz: «IF there is a wall → TURN RIGHT, ELSE → FORWARD». The robot has NO wall ahead. What does it do?</div>' +
        '<div class="mq-opts">' +
        '<button class="mq-opt" onclick="miniQuiz(this,false,\'mqFb2\')">It turns right</button>' +
        '<button class="mq-opt" onclick="miniQuiz(this,true,\'mqFb2\')">It goes forward</button>' +
        '<button class="mq-opt" onclick="miniQuiz(this,false,\'mqFb2\')">It does both</button>' +
        '</div>' +
        '<div class="mq-fb" id="mqFb2" aria-live="polite"></div>' +
        '</div>',

      a3:
        '<h2>🔗 Chained conditionals and the order of the questions</h2>' +
        '<p>Sometimes the robot needs <strong>several questions in a row</strong>: first «is there a wall?», then ' +
        '«is the traffic light green?». Those are <strong>chained conditionals</strong>, and the <strong>order</strong> of ' +
        'the questions can change the decision.</p>' +
        '<div class="vs-grid">' +
        '<div class="vs-box vs-c">' +
        '<h4>🚫 Mistake 1: thinking both branches run</h4>' +
        '<p>In every conditional <strong>ONE single</strong> branch runs: the one that matches the answer. The other one is <strong>ignored</strong> completely.</p>' +
        '</div>' +
        '<div class="vs-box vs-d">' +
        '<h4>🚫 Mistake 2: mixing up condition and action</h4>' +
        '<p>The <strong>condition</strong> is a <em>question</em> («is there a wall?»); the <strong>action</strong> is an <em>order</em> («FORWARD»). They are not the same!</p>' +
        '</div>' +
        '</div>' +
        '<div class="ex-box">' +
        '<span class="ex-tag ex-d">🚦 Example with a traffic light</span><br>' +
        '<span><span class="hl2">IF THE TRAFFIC LIGHT IS GREEN</span> → <span class="hl3">FORWARD</span>, <span class="hl2">ELSE</span> → <span class="hl">WAIT</span>. On a 🟢 green light the robot crosses; on a 🔴 red one it waits until it changes. 🚦</span>' +
        '</div>',

      e1:
        '<h2>📋 The structure of a conditional</h2>' +
        '<p>A conditional has three parts: a <strong>condition</strong> (the question) and two <strong>branches</strong> ' +
        '(what to do if <strong>yes</strong> and what to do if <strong>no</strong>). Look at how it reads!</p>' +
        '<table class="instr-tbl">' +
        '<tr><th>Condition (question)</th><th>THEN branch (if YES)</th><th>ELSE branch (if NO)</th></tr>' +
        '<tr><td class="k">Is it raining?</td><td>I take an umbrella ☂️</td><td>I take a cap 🧢</td></tr>' +
        '<tr><td class="k">Is there a wall ahead?</td><td>TURN RIGHT ↪️</td><td>FORWARD 👣</td></tr>' +
        '<tr><td class="k">Is the traffic light green?</td><td>FORWARD (I cross) 🟢</td><td>WAIT ⏳🔴</td></tr>' +
        '<tr><td class="k">Did it reach the house?</td><td>DELIVER 📬</td><td>keep going forward 👣</td></tr>' +
        '</table>' +
        '<div class="tip">' +
        '<span class="ti">🔀</span>' +
        '<div><strong>It reads like this:</strong> <b>IF</b> (condition) <b>THEN</b> (the yes branch) <b>ELSE</b> (the no branch). The robot reads the answer to the condition and runs <strong>only one</strong> branch.</div>' +
        '</div>' +
        '<div class="mq-wrap">' +
        '<div class="mq-q">🎮 Mini-quiz: with «IF green → FORWARD, ELSE → WAIT», on a 🔴 red light the robot…</div>' +
        '<div class="mq-opts">' +
        '<button class="mq-opt" onclick="miniQuiz(this,false,\'mqFb3\')">Goes forward anyway</button>' +
        '<button class="mq-opt" onclick="miniQuiz(this,true,\'mqFb3\')">Waits</button>' +
        '<button class="mq-opt" onclick="miniQuiz(this,false,\'mqFb3\')">Turns</button>' +
        '</div>' +
        '<div class="mq-fb" id="mqFb3" aria-live="polite"></div>' +
        '</div>',

      e2:
        '<h2>⚠️ Common mistakes — do not fall for them!</h2>' +
        '<div class="vs-grid">' +
        '<div class="vs-box vs-a">' +
        '<h4>🚫 Thinking both branches run</h4>' +
        '<p>In a conditional <strong>ONE single</strong> branch runs. If the answer is YES, the ELSE branch <strong>is not even looked at</strong>.</p>' +
        '</div>' +
        '<div class="vs-box vs-b">' +
        '<h4>🚫 Mixing up condition and action</h4>' +
        '<p>«Is there a wall?» is a <strong>question</strong> (a condition). «FORWARD» is an <strong>order</strong> (an action). A condition never moves the robot: it only <em>decides</em>.</p>' +
        '</div>' +
        '</div>' +
        '<div class="vs-grid">' +
        '<div class="vs-box vs-c">' +
        '<h4>🚫 Swapping the branches</h4>' +
        '<p>If you write «IF there is a wall → FORWARD» the robot crashes into the tree! 🌳 When there IS a wall it has to <strong>TURN</strong>, not go forward.</p>' +
        '</div>' +
        '<div class="vs-box vs-d">' +
        '<h4>🚫 Choosing the wrong condition</h4>' +
        '<p>To avoid crashing, the right question is <strong>«is there a wall ahead?»</strong>, not «is the traffic light green?». The sensor has to measure the right thing!</p>' +
        '</div>' +
        '</div>' +
        '<div class="mq-wrap">' +
        '<div class="mq-q">🎮 Mini-quiz: «IF there is a wall → TURN RIGHT, ELSE → FORWARD». The robot DOES have a wall ahead. What does it do?</div>' +
        '<div class="mq-opts">' +
        '<button class="mq-opt" onclick="miniQuiz(this,true,\'mqFb4\')">It turns right</button>' +
        '<button class="mq-opt" onclick="miniQuiz(this,false,\'mqFb4\')">It goes forward</button>' +
        '<button class="mq-opt" onclick="miniQuiz(this,false,\'mqFb4\')">It does both</button>' +
        '</div>' +
        '<div class="mq-fb" id="mqFb4" aria-live="polite"></div>' +
        '</div>',

      e3:
        '<h2>🇭🇳 Conditionals in your everyday life</h2>' +
        '<p>Even without a computer, you already decide with conditionals all the time: you choose according to the answer to a yes-or-no question.</p>' +
        '<div class="type-grid">' +
        '<div class="type-chip tc-teal"><div class="t-art">☂️ The rain</div><div class="t-info">IF it rains → umbrella, ELSE → cap</div></div>' +
        '<div class="type-chip tc-gold"><div class="t-art">🚦 The traffic light</div><div class="t-info">IF it is green → I cross, ELSE → I wait</div></div>' +
        '<div class="type-chip tc-jade"><div class="t-art">🔥 The cookfire</div><div class="t-info">IF it is lit → I cook, ELSE → I light the firewood</div></div>' +
        '<div class="type-chip tc-amber"><div class="t-art">🌡️ The weather</div><div class="t-info">IF it is cold → sweater, ELSE → t-shirt</div></div>' +
        '</div>' +
        '<div class="tip">' +
        '<span class="ti">💡</span>' +
        '<div><strong>Key fact:</strong> the robot does not guess: its <b>sensor</b> answers the question and it runs the branch that matches. Good conditionals = good decisions. 🤖</div>' +
        '</div>',

      labh2: '🔬 Simulator: the Robot that Decides',

      labintro: 'Choose a map, build your program by tapping the buttons — include the <strong>conditionals</strong> 🌳🚦 so the robot DECIDES! — and press <strong>▶ Run</strong>. You will see how it evaluates each condition (✔ yes / ✘ no) step by step. ⭐ +6 XP for each map you solve (first time).',

      labmapa:
        '<span class="lab-group-label">🗺️ Map:</span>' +
        '<button class="lab-btn lab-cont-btn" data-parte="n1" onclick="labShowParte(\'n1\')">1️⃣ The wall</button>' +
        '<button class="lab-btn lab-cont-btn" data-parte="n2" onclick="labShowParte(\'n2\')">2️⃣ The corridor</button>' +
        '<button class="lab-btn lab-cont-btn" data-parte="n3" onclick="labShowParte(\'n3\')">3️⃣ The traffic light</button>' +
        '<button class="lab-btn lab-cont-btn" data-parte="n4" onclick="labShowParte(\'n4\')">4️⃣ The challenge</button>',

      /* los onclick guardan la palabra ESPAÑOLA a propósito: es el identificador
         interno del simulador, no un texto que se le muestre al alumno */
      labcmd:
        '<button class="sim-cmd" onclick="labAdd(\'AVANZA\')">👣 FORWARD</button>' +
        '<button class="sim-cmd" onclick="labAdd(\'GIRA IZQUIERDA\')">↩️ TURN LEFT</button>' +
        '<button class="sim-cmd" onclick="labAdd(\'GIRA DERECHA\')">↪️ TURN RIGHT</button>' +
        '<button class="sim-cmd" onclick="labAdd(\'ESPERA\')">⏳ WAIT</button>' +
        '<button class="sim-cmd sim-cmd-entrega" onclick="labAdd(\'ENTREGA\')">📬 DELIVER</button>',

      labcond:
        '<button class="sim-cmd" style="grid-column:span 2;" onclick="labAdd(\'C_PARED\')">🌳 IF WALL → TURN RIGHT, ELSE → FORWARD</button>' +
        '<button class="sim-cmd" style="grid-column:span 2;" onclick="labAdd(\'C_VERDE\')">🚦 IF GREEN → FORWARD, ELSE → WAIT</button>',

      labutil:
        '<button class="btn btn-g" onclick="labRun()">▶ Run</button>' +
        '<button class="btn btn-d" onclick="labDel()">⌫ Delete last</button>' +
        '<button class="btn btn-d" onclick="labClear()">🗑️ Clear</button>',

      rec:
        '<h2>📁 Topic Resources</h2>' +
        '<div style="border:1.5px solid var(--border,#e2e8f0);border-radius:12px;padding:1rem 1.2rem;margin-bottom:1.2rem;background:rgba(0,0,0,0.02);">' +
        '<p style="font-size:0.98rem;font-weight:800;margin-bottom:0.4rem;">📄 Printable study sheet</p>' +
        '<p style="font-size:0.86rem;margin-bottom:0.85rem;">A 7-page study guide (theory, unplugged activities and a test) to print out or work through before the exam.</p>' +
        '<a href="../../fichas/ficha-robot-decide.html" target="_blank" rel="noopener noreferrer" class="btn btn-pri" style="display:inline-flex;align-items:center;gap:0.5rem;text-decoration:none;font-size:1rem;padding:0.7rem 1.4rem;">📄 Open / Print the study sheet</a>' +
        '</div>' +
        '<p style="font-size:0.9rem;margin-bottom:1rem;">Here you will find support materials for this mission: slideshows, PDF documents, study guides and more. Your teacher will keep adding resources to this folder.</p>' +
        '<a href="https://drive.google.com/drive/folders/1robot_decide_recursos" target="_blank" rel="noopener noreferrer" class="btn btn-pri" style="display:inline-flex;align-items:center;gap:0.5rem;text-decoration:none;font-size:1rem;padding:0.7rem 1.4rem;">' +
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
        primer_quiz: { icon: '🤖', label: 'First conditionals quiz completed' },
        flash_master: { icon: '🃏', label: 'All the decision flashcards explored' },
        clasif_pro: { icon: '🗂️', label: 'Expert condition-and-branch sorter' },
        id_master: { icon: '🔍', label: 'Master condition-and-action spotter' },
        reto_hero: { icon: '🏆', label: 'Beat-the-clock challenge hero' },
        lab_master: { icon: '🚦', label: 'All 4 decision maps solved!' },
        nivel3: { icon: '⌨️', label: 'Robot that Decides! Level 3' },
        nivel5: { icon: '🥇', label: 'Master of Conditionals! Level 6' },
        widgets_master: { icon: '🧩', label: 'Decision widgets mastered' }
      },

      lvls: [
        { t: 0, n: 'Beginner 🌱' }, { t: 25, n: 'Decision Explorer 🧭' }, { t: 55, n: 'Robot that Decides 🤖' },
        { t: 90, n: 'Junior Programmer 💻' }, { t: 130, n: 'Bug Hunter 🔍' },
        { t: 165, n: 'Conditional Engineer 🏅' }, { t: 190, n: 'Master of Conditionals 🏆' }
      ],

      /* Este pegamento viaja en el banco a propósito: los widgets lo comparan */
      WGT_TXT: {
        parte: 'The robot starts from', mirando: 'facing', cuidado: 'Watch out for the condition! ❓',
        meta: '🎯 <strong>Goal:</strong>', bug: 'This program has ONE bug in its conditional!',
        linea: 'Line', mal: ' (the conditional is wrong)', bien: ' (it is fine)'
      },

      fcData: [
        { w: 'Conditional', a: '🔀 An instruction that makes the robot <strong>decide</strong>: <strong>IF</strong> something is true <strong>THEN</strong> it does one thing, <strong>ELSE</strong> it does another.' },
        { w: 'Condition', a: '❓ The <strong>yes-or-no question</strong> that decides which branch runs, such as «is there a wall ahead?».' },
        { w: 'IF…THEN', a: '✅ A conditional <strong>with no ELSE</strong>: if the condition is true it does the action; if it is false, it <strong>does nothing</strong>.' },
        { w: 'IF…THEN…ELSE', a: '🔀 A conditional <strong>with two paths</strong>: one if the answer is <strong>yes</strong> and another if it is <strong>no</strong>.' },
        { w: 'THEN branch', a: '👉 The path that runs when the answer to the condition is <strong>YES</strong> (true).' },
        { w: 'ELSE branch', a: '👈 The path that runs when the answer to the condition is <strong>NO</strong> (false).' },
        { w: 'Sensor', a: '📡 The part of the robot that <strong>answers the question</strong> of the condition: it sees the wall or the color of the traffic light.' },
        { w: 'True / False', a: '⚖️ Every condition can only be <strong>true (yes)</strong> or <strong>false (no)</strong>: never «maybe».' },
        { w: 'Only one branch', a: '☝️ In every conditional <strong>one single branch</strong> runs: the other one is <strong>ignored</strong>. Never both at once.' },
        { w: 'Chained conditionals', a: '🔗 Several conditionals <strong>one after another</strong>; the <strong>order</strong> of the questions changes the decision.' },
        { w: 'Traffic light', a: '🚦 A color sensor: the condition «is it green?» decides whether the robot goes <strong>FORWARD</strong> or <strong>WAITS</strong>.' },
        { w: 'WAIT', a: '⏳ The robot <strong>does not move</strong> and lets time go by; useful until the traffic light turns green.' },
        { w: 'Conditional bug', a: '🐛 A mistake such as <strong>swapping the branches</strong> or using the <strong>wrong condition</strong>: the robot decides badly.' },
        { w: 'Condition vs action', a: '🌫️ The <strong>condition</strong> is a <strong>question</strong> (is there a wall?); the action is an <strong>order</strong> (FORWARD). Do not mix them up!' }
      ],

      memoPairs: [
        { id: 'condicional', t: 'Conditional', d: '🔀 IF…THEN…ELSE: the robot decides' },
        { id: 'condicion', t: 'Condition', d: '❓ The yes-or-no question' },
        { id: 'entonces', t: 'THEN branch', d: '👉 The path when the answer is YES' },
        { id: 'sino', t: 'ELSE branch', d: '👈 The path when the answer is NO' },
        { id: 'sensor', t: 'Sensor', d: '📡 It answers: is there a wall? is it green?' },
        { id: 'semaforo', t: 'Traffic light', d: '🚦 Green: FORWARD · Red: WAIT' }
      ],

      qzData: [
        { q: 'What is a conditional?', o: ['a) A list of steps that are always the same', 'b) An instruction that makes the robot DECIDE according to a condition', 'c) A 90° turn', 'd) A mistake in the program'], c: 1 },
        { q: 'What is the CONDITION of a conditional?', o: ['a) An order such as FORWARD', 'b) The color of the robot', 'c) A yes-or-no question', 'd) The final square'], c: 2 },
        { q: 'In IF…THEN…ELSE, when does the ELSE branch run?', o: ['a) When the condition is true', 'b) When the condition is false', 'c) Always', 'd) Never'], c: 1 },
        { q: 'IF THERE IS A WALL AHEAD → TURN RIGHT, ELSE → FORWARD. The robot has NO wall ahead. What does it do?', o: ['a) It turns right', 'b) It goes forward', 'c) It stops', 'd) It turns left'], c: 1 },
        { q: 'How many branches run in ONE conditional?', o: ['a) Both at once', 'b) None', 'c) Only one: the other is ignored', 'd) It depends on the color'], c: 2 },
        { q: 'Which one of these is a CONDITION (a yes/no question)?', o: ['a) FORWARD', 'b) Is the traffic light green?', 'c) TURN LEFT', 'd) DELIVER'], c: 1 },
        { q: 'With «IF THE TRAFFIC LIGHT IS GREEN → FORWARD, ELSE → WAIT», if the light is RED the robot…', o: ['a) Goes forward anyway', 'b) Turns', 'c) Waits', 'd) Delivers'], c: 2 },
        { q: 'What is a robot SENSOR?', o: ['a) The part that answers the question of the condition', 'b) A square on the map', 'c) The message', 'd) A prize'], c: 0 },
        { q: 'A conditional is «backwards» (branches swapped). What happens?', o: ['a) Nothing, it works the same', 'b) The robot decides badly and may crash', 'c) The robot goes faster', 'd) It switches off'], c: 1 }
      ],

      classGroups: [
        {
          label: ['Condition (question)', 'Action (order)'], headA: '❓ Condition (question)', headB: '👣 Action (order)', colA: 'cond', colB: 'acc',
          words: [{ w: 'Is there a wall ahead?', t: 'cond' }, { w: 'FORWARD', t: 'acc' }, { w: 'Is the traffic light green?', t: 'cond' }, { w: 'TURN RIGHT', t: 'acc' }, { w: 'Is it raining?', t: 'cond' }, { w: 'WAIT', t: 'acc' }, { w: 'Did it reach the house?', t: 'cond' }, { w: 'DELIVER', t: 'acc' }, { w: 'Is the pot hot?', t: 'cond' }, { w: 'TURN LEFT', t: 'acc' }]
        },
        {
          label: ['THEN branch (yes)', 'ELSE branch (no)'], headA: '👉 THEN branch (answer YES)', headB: '👈 ELSE branch (answer NO)', colA: 'ent', colB: 'sino',
          words: [{ w: 'IF it rains → I take an umbrella', t: 'ent' }, { w: 'ELSE → I take a cap', t: 'sino' }, { w: 'IF there is a wall → I turn', t: 'ent' }, { w: 'ELSE → I go forward', t: 'sino' }, { w: 'IF it is green → I cross', t: 'ent' }, { w: 'ELSE → I wait', t: 'sino' }, { w: 'IF it is cold → I wear a sweater', t: 'ent' }, { w: 'ELSE → I wear a t-shirt', t: 'sino' }]
        },
        {
          label: ['It is a conditional', 'It is not a conditional'], headA: '🔀 It is a conditional', headB: '📜 It is not a conditional', colA: 'esc', colB: 'noc',
          words: [{ w: 'IF it rains THEN I stay home', t: 'esc' }, { w: 'FORWARD, FORWARD, TURN', t: 'noc' }, { w: 'IF it is green FORWARD ELSE WAIT', t: 'esc' }, { w: 'TURN RIGHT and DELIVER', t: 'noc' }, { w: 'IF there is a wall I turn ELSE I go forward', t: 'esc' }, { w: 'Knead the tortilla and fold it', t: 'noc' }, { w: 'IF it is night I turn the light on', t: 'esc' }, { w: 'Count from 1 to 10', t: 'noc' }]
        },
        {
          label: ['From programming', 'From another subject'], headA: '💻 From programming', headB: '📚 From another subject', colA: 'prog', colB: 'otro',
          words: [{ w: 'Condition', t: 'prog' }, { w: 'Photosynthesis', t: 'otro' }, { w: 'Conditional', t: 'prog' }, { w: 'Noun', t: 'otro' }, { w: 'Sensor', t: 'prog' }, { w: 'Peninsula', t: 'otro' }, { w: 'ELSE branch', t: 'prog' }, { w: 'Fraction', t: 'otro' }, { w: 'Traffic light (sensor)', t: 'prog' }, { w: 'Maya stela', t: 'otro' }]
        }
      ],

      idData: [
        { s: ['IF', 'there', 'is', 'a', 'wall', 'ahead', 'THEN', 'turn', 'right.'], c: 4, art: 'The key word of the CONDITION (the question): «is there a ___ ahead»' },
        { s: ['IF', 'the', 'traffic', 'light', 'is', 'green', 'FORWARD', 'ELSE', 'WAIT.'], c: 6, art: 'The ACTION of the THEN branch (when the answer is yes)' },
        { s: ['IF', 'it', 'rains', 'THEN', 'I', 'take', 'an', 'umbrella', 'ELSE', 'I', 'take', 'a', 'cap.'], c: 3, art: 'The word that opens the YES branch' },
        { s: ['IF', 'it', 'rains', 'THEN', 'I', 'take', 'an', 'umbrella', 'ELSE', 'I', 'take', 'a', 'cap.'], c: 8, art: 'The word that opens the NO branch' },
        { s: ['The', 'sensor', 'answers', 'the', 'question', 'of', 'the', 'condition.'], c: 1, art: 'The part of the robot that answers the question of the condition' },
        { s: ['The', 'condition', 'is', 'a', 'yes-or-no', 'question.'], c: 1, art: 'The yes-or-no question that decides the branch' },
        { s: ['Only', 'one', 'branch', 'of', 'the', 'conditional', 'runs.'], c: 2, art: 'What runs (only one of them) in a conditional' },
        { s: ['WAIT', 'makes', 'the', 'robot', 'stay', 'still.'], c: 0, art: 'The action that lets time go by without moving' }
      ],

      cmpData: [
        { s: 'An instruction that makes the robot decide is called a ___.', opts: ['conditional', 'turn', 'square'], c: 0 },
        { s: 'The ___ is the yes-or-no question of the conditional.', opts: ['action', 'condition', 'square'], c: 1 },
        { s: 'The branch that runs when the answer is YES is called the ___ branch.', opts: ['ELSE', 'WAIT', 'THEN'], c: 2 },
        { s: 'The branch that runs when the answer is NO is called the ___ branch.', opts: ['ELSE', 'THEN', 'FORWARD'], c: 0 },
        { s: 'In a conditional ___ one branch runs at a time.', opts: ['only', 'always', 'never'], c: 0 },
        { s: 'The part of the robot that answers the question is called the ___.', opts: ['motor', 'sensor', 'screen'], c: 1 },
        { s: 'On a red light and with «ELSE → WAIT», the robot ___.', opts: ['goes forward', 'waits', 'turns'], c: 1 },
        { s: 'A condition can only be true or ___.', opts: ['maybe', 'false', 'red'], c: 1 }
      ],

      routeSets: [
        { label: 'Build the traffic-light conditional (in order)', steps: ['IF', 'the traffic light is green', 'THEN I go forward', 'ELSE', 'I wait'] },
        { label: 'Build the wall conditional (in order)', steps: ['IF', 'there is a wall ahead', 'THEN I turn right', 'ELSE', 'I go forward'] },
        { label: 'Build the rain conditional (in order)', steps: ['IF', 'it is raining', 'THEN I take an umbrella', 'ELSE', 'I take a cap'] }
      ],

      /* solo coordenadas y programas: no hay texto que traducir */
      _wgtEndDefs: [
        { r: 0, c: 0, dir: 'E', obst: [[0, 1]], prog: [C_PARED, I_AV, I_AV] },
        { r: 0, c: 0, dir: 'E', obst: [], prog: [C_PARED, I_AV] },
        { r: 0, c: 2, dir: 'S', obst: [[1, 2]], prog: [C_PARED, I_AV, I_AV] },
        { r: 0, c: 2, dir: 'S', obst: [], prog: [C_PARED, I_AV] },
        { r: 2, c: 0, dir: 'N', obst: [[1, 0]], prog: [C_PARED, I_AV, I_AV] },
        { r: 2, c: 0, dir: 'N', obst: [], prog: [C_PARED, I_AV] },
        { r: 2, c: 2, dir: 'O', obst: [[2, 1]], prog: [C_PARED, I_AV, I_AV] },
        { r: 2, c: 2, dir: 'O', obst: [], prog: [C_PARED, I_AV] }
      ],

      _wgtBugDefs: [
        {
          goal: 'The robot has to TURN when it runs into a wall 🌳 and go FORWARD if the way is clear.',
          lines: ['IF THERE IS A WALL AHEAD → FORWARD, ELSE → TURN RIGHT', 'FORWARD', 'DELIVER'], bug: 0, fix: 'the branches are swapped: it should turn when there IS a wall'
        },
        {
          goal: 'The robot has to CROSS only on a green light 🚦 and WAIT on a red one.',
          lines: ['FORWARD', 'IF THE TRAFFIC LIGHT IS GREEN → WAIT, ELSE → FORWARD', 'DELIVER'], bug: 1, fix: 'the branches are swapped: it should go forward on green'
        },
        {
          goal: 'The robot has to turn when it runs into a wall 🌳.',
          lines: ['FORWARD', 'IF THE TRAFFIC LIGHT IS GREEN → TURN RIGHT, ELSE → FORWARD', 'FORWARD'], bug: 1, fix: 'the condition is wrong: it has to ask about the WALL, not about the traffic light'
        },
        {
          goal: 'The robot crosses the street only on a green light 🚦.',
          lines: ['IF THE TRAFFIC LIGHT IS GREEN → FORWARD, ELSE → WAIT', 'IF THERE IS A WALL AHEAD → FORWARD, ELSE → TURN RIGHT', 'DELIVER'], bug: 1, fix: 'the THEN branch goes forward into the wall: it should turn when there is a wall'
        },
        {
          goal: 'The robot has to WAIT on red and go FORWARD on green.',
          lines: ['IF THE TRAFFIC LIGHT IS GREEN → FORWARD, ELSE → TURN RIGHT', 'FORWARD', 'DELIVER'], bug: 0, fix: 'the ELSE branch should be WAIT, not TURN RIGHT'
        }
      ],

      enfermedadData: [
        { disease: 'The robot must not crash into the trees 🌳. What does it have to ask before going forward?', characteristic: 'Is there a wall ahead?', opts: ['Is there a wall ahead?', 'Is it raining?'] },
        { disease: 'The robot crosses the street only on a green light 🚦. What does it have to ask?', characteristic: 'Is the traffic light green?', opts: ['Is the traffic light green?', 'Is there a wall ahead?'] },
        { disease: 'Before leaving the house you decide whether to take an umbrella. What do you ask?', characteristic: 'Is it raining?', opts: ['Is it raining?', 'Is there a wall ahead?'] },
        { disease: 'The robot must DELIVER only when it reaches the house 🏠. What does it ask?', characteristic: 'Did it reach the house?', opts: ['Did it reach the house?', 'Is the traffic light green?'] },
        { disease: 'You decide whether to put on a sweater depending on the weather. What do you ask?', characteristic: 'Is it cold?', opts: ['Is it cold?', 'Is there a wall ahead?'] },
        { disease: 'The robot turns its lamp on at night. What does it have to ask?', characteristic: 'Is it night?', opts: ['Is it night?', 'Is the traffic light green?'] }
      ],

      retoPairs: [
        {
          label: ['Condition (question)', 'Action (order)'], btnA: '❓ Condition', btnB: '👣 Action', colA: 'cond', colB: 'acc',
          words: [{ w: 'Is there a wall ahead?', t: 'cond' }, { w: 'FORWARD', t: 'acc' }, { w: 'Is it green?', t: 'cond' }, { w: 'TURN RIGHT', t: 'acc' }, { w: 'Is it raining?', t: 'cond' }, { w: 'WAIT', t: 'acc' }, { w: 'Did it reach the house?', t: 'cond' }, { w: 'DELIVER', t: 'acc' }, { w: 'Is it cold?', t: 'cond' }, { w: 'TURN LEFT', t: 'acc' }]
        },
        {
          label: ['THEN branch (yes)', 'ELSE branch (no)'], btnA: '👉 THEN', btnB: '👈 ELSE', colA: 'ent', colB: 'sino',
          words: [{ w: 'IF it rains → umbrella', t: 'ent' }, { w: 'ELSE → cap', t: 'sino' }, { w: 'IF there is a wall → I turn', t: 'ent' }, { w: 'ELSE → I go forward', t: 'sino' }, { w: 'IF green → I cross', t: 'ent' }, { w: 'ELSE → I wait', t: 'sino' }, { w: 'IF night → light on', t: 'ent' }, { w: 'ELSE → light off', t: 'sino' }]
        },
        {
          label: ['From programming', 'From another subject'], btnA: '💻 Programming', btnB: '📚 Another subject', colA: 'prog', colB: 'otro',
          words: [{ w: 'Conditional', t: 'prog' }, { w: 'Photosynthesis', t: 'otro' }, { w: 'Sensor', t: 'prog' }, { w: 'Noun', t: 'otro' }, { w: 'Condition', t: 'prog' }, { w: 'Peninsula', t: 'otro' }, { w: 'ELSE branch', t: 'prog' }, { w: 'Fraction', t: 'otro' }, { w: 'Traffic light (sensor)', t: 'prog' }, { w: 'Maya stela', t: 'otro' }]
        }
      ],

      condSitDB: [
        { tema: 'Crossing the street at a traffic light 🚦', cond: 'is the traffic light green?', si: 'I cross the street', no: 'I wait on the sidewalk' },
        { tema: 'Leaving the house when the sky is cloudy ☁️', cond: 'is it raining?', si: 'I take an umbrella', no: 'I take a cap' },
        { tema: 'The robot moves down a corridor with trees 🌳', cond: 'is there a wall ahead?', si: 'I turn right', no: 'I go forward' },
        { tema: 'Getting dressed in the morning 🌡️', cond: 'is it cold?', si: 'I put on a sweater', no: 'I put on a t-shirt' },
        { tema: 'The robot turns its lamp on 🔦', cond: 'is it night?', si: 'I turn the lamp on', no: 'I leave it off' },
        { tema: 'Cooking on the wood cookfire 🔥', cond: 'is the cookfire lit?', si: 'I put the pot on to cook', no: 'I light the firewood first' },
        { tema: 'The robot delivers the message 🏠', cond: 'did it reach the house?', si: 'it DELIVERS the message', no: 'it keeps going forward' },
        { tema: 'Watering the cornfield 🌽', cond: 'is the soil dry?', si: 'I water the plants', no: 'I do not water today' }
      ],

      bugCondDB: [
        { goal: 'turning when it runs into a wall 🌳', mala: 'IF THERE IS A WALL AHEAD → FORWARD, ELSE → TURN RIGHT', buena: 'IF THERE IS A WALL AHEAD → TURN RIGHT, ELSE → FORWARD', err: 'the branches are swapped' },
        { goal: 'crossing only on a green light 🚦', mala: 'IF THE TRAFFIC LIGHT IS GREEN → WAIT, ELSE → FORWARD', buena: 'IF THE TRAFFIC LIGHT IS GREEN → FORWARD, ELSE → WAIT', err: 'the branches are swapped' },
        { goal: 'turning when it bumps into a tree 🌳', mala: 'IF THE TRAFFIC LIGHT IS GREEN → TURN RIGHT, ELSE → FORWARD', buena: 'IF THERE IS A WALL AHEAD → TURN RIGHT, ELSE → FORWARD', err: 'the condition is wrong (it has to ask about the wall)' },
        { goal: 'waiting on a red light 🔴', mala: 'IF THE TRAFFIC LIGHT IS GREEN → FORWARD, ELSE → TURN RIGHT', buena: 'IF THE TRAFFIC LIGHT IS GREEN → FORWARD, ELSE → WAIT', err: 'the ELSE branch should be WAIT' },
        { goal: 'taking an umbrella if it rains ☔', mala: 'IF IT IS RAINING → I leave the umbrella, ELSE → I take the umbrella', buena: 'IF IT IS RAINING → I take the umbrella, ELSE → I leave the umbrella', err: 'the branches are swapped' }
      ],

      sopaSets: [
        _sopa(10, ['CONDITION', 'DECIDE', 'SENSOR', 'WALL', 'BRANCH', 'GREEN'], 20260728),
        _sopa(10, ['THEN', 'QUESTION', 'LIGHT', 'PATH', 'ELSE', 'ROBOT'], 51920271)
      ],

      evalTFBank: [
        { q: 'A conditional makes the robot DECIDE according to a condition.', a: true },
        { q: 'The condition of a conditional is a yes-or-no question.', a: true },
        { q: 'In a conditional both branches always run at once.', a: false },
        { q: 'The THEN branch runs when the condition is true (yes).', a: true },
        { q: 'The ELSE branch runs when the condition is true.', a: false },
        { q: '«Is there a wall ahead?» is a condition (a question).', a: true },
        { q: '«FORWARD» is a condition.', a: false },
        { q: 'With «IF green → FORWARD, ELSE → WAIT», on red the robot waits.', a: true },
        { q: 'A condition can be «maybe», neither true nor false.', a: false },
        { q: 'The robot’s sensor answers the question of the condition.', a: true },
        { q: 'Swapping the branches of a conditional is a bug.', a: true },
        { q: 'An IF…THEN conditional (with no ELSE) does nothing if the condition is false.', a: true },
        { q: 'WAIT moves the robot one square ahead.', a: false },
        { q: 'The order of the questions in chained conditionals does not matter.', a: false },
        { q: 'The condition is a question and the action is an order: they are not the same.', a: true }
      ],

      evalMCBank: [
        { q: 'IF there is a wall ahead THEN turn right, ELSE go forward. The robot has NO wall ahead. What does it do?', o: ['It turns right', 'It goes forward', 'It stops', 'It turns left'], a: 1 },
        { q: 'What is a conditional?', o: ['a) A list of steps that are always the same', 'b) An instruction that makes it decide according to a condition', 'c) A 90° turn', 'd) A map'], a: 1 },
        { q: 'What is the CONDITION of a conditional?', o: ['a) An order such as FORWARD', 'b) A yes-or-no question', 'c) The color of the robot', 'd) The final square'], a: 1 },
        { q: 'When does the ELSE branch run?', o: ['a) When the condition is true', 'b) When the condition is false', 'c) Always', 'd) Never'], a: 1 },
        { q: 'How many branches run in ONE conditional?', o: ['a) Both at once', 'b) None', 'c) Only one: the other is ignored', 'd) Three'], a: 2 },
        { q: 'IF there is a wall ahead THEN turn right, ELSE go forward. The robot DOES have a wall ahead. What does it do?', o: ['a) It goes forward', 'b) It turns right', 'c) It waits', 'd) It delivers'], a: 1 },
        { q: 'Which one of these is a CONDITION?', o: ['a) FORWARD', 'b) TURN RIGHT', 'c) Is the traffic light green?', 'd) DELIVER'], a: 2 },
        { q: 'With «IF green → FORWARD, ELSE → WAIT», if the traffic light is RED the robot…', o: ['a) Goes forward', 'b) Turns', 'c) Waits', 'd) Delivers'], a: 2 },
        { q: 'What is a robot sensor?', o: ['a) The part that answers the question of the condition', 'b) A square on the map', 'c) The message', 'd) A prize'], a: 0 },
        { q: 'A condition can only be…', o: ['a) True or false', 'b) Red or blue', 'c) Long or short', 'd) Maybe'], a: 0 },
        { q: 'What is the THEN branch?', o: ['a) The path when the answer is NO', 'b) The path when the answer is YES', 'c) The question', 'd) The sensor'], a: 1 },
        { q: 'A conditional has its branches «backwards». What happens?', o: ['a) Nothing, it works the same', 'b) The robot decides badly and may crash', 'c) It goes faster', 'd) It switches off'], a: 1 },
        { q: 'Which is a well-written conditional for not crashing into a wall?', o: ['a) IF there is a wall → FORWARD, ELSE → TURN', 'b) IF there is a wall → TURN RIGHT, ELSE → FORWARD', 'c) FORWARD, FORWARD, FORWARD', 'd) TURN, TURN, TURN'], a: 1 },
        { q: 'In chained conditionals, the ORDER of the questions…', o: ['a) Does not matter', 'b) Can change the robot’s decision', 'c) Only the color matters', 'd) Never changes anything'], a: 1 },
        { q: 'The condition «is a question» and the action «is an…»', o: ['a) order the robot carries out', 'b) another question', 'c) square', 'd) certificate'], a: 0 }
      ],

      evalCPBank: [
        { q: 'An instruction that makes the robot decide is called a ___.', a: 'conditional' },
        { q: 'The yes-or-no question of a conditional is called the ___.', a: 'condition' },
        { q: 'The branch that runs when the answer is YES is called the ___ branch.', a: 'THEN' },
        { q: 'The branch that runs when the answer is NO is called the ___ branch.', a: 'ELSE' },
        { q: 'In a conditional ___ one branch runs at a time.', a: 'only' },
        { q: 'The part of the robot that answers the question of the condition is the ___.', a: 'sensor' },
        { q: 'A condition can only be true or ___.', a: 'false' },
        { q: 'The color sensor on the street is the ___.', a: 'traffic light' },
        { q: 'With the traffic light on red and «ELSE → WAIT», the robot ___.', a: 'waits' },
        { q: 'Swapping the branches of a conditional is a ___.', a: 'bug' },
        { q: 'The condition «is there a wall ahead?» is a ___.', a: 'question' },
        { q: 'FORWARD and TURN are ___ (orders), not questions.', a: 'actions' },
        { q: 'A conditional is written IF…THEN…___.', a: 'ELSE' },
        { q: 'Several conditionals one after another are ___ conditionals.', a: 'chained' },
        { q: 'The ___ instruction makes the robot stay still and let time go by.', a: 'WAIT' }
      ],

      evalPRBank: [
        { term: 'Conditional', def: 'An instruction that makes it decide according to a condition' },
        { term: 'Condition', def: 'A yes-or-no question that decides the branch' },
        { term: 'THEN branch', def: 'The path that runs when the answer is YES' },
        { term: 'ELSE branch', def: 'The path that runs when the answer is NO' },
        { term: 'Sensor', def: 'The part of the robot that answers the question' },
        { term: 'Traffic light', def: 'A color sensor: green go forward, red wait' },
        { term: 'WAIT', def: 'The robot stays still and lets time go by' },
        { term: 'True or false', def: 'The only two values a condition can have' },
        { term: 'Only one branch', def: 'What runs in every conditional' },
        { term: 'Conditional bug', def: 'Branches swapped or the wrong condition' },
        { term: 'Action', def: 'An order the robot carries out, such as FORWARD' },
        { term: 'Chained', def: 'Several conditionals, one after another' },
        { term: 'FORWARD', def: 'It moves the robot one square in the direction it faces' },
        { term: 'Wall', def: 'A tree or an edge that blocks the way' },
        { term: 'Pseudocode', def: 'Instructions written in plain language' }
      ],

      OP_COMPLETA_BANK: [
        { txt: 'The robot has to TURN when it bumps into a tree 🌳.', prog: 'IF ___ → TURN RIGHT, ELSE → FORWARD', opts: ['THERE IS A WALL AHEAD', 'THE TRAFFIC LIGHT IS GREEN', 'IT IS NIGHT', 'IT RAINS'], ans: 0 },
        { txt: 'The robot crosses the street only on a green light 🚦.', prog: 'IF THE TRAFFIC LIGHT IS GREEN → ___, ELSE → WAIT', opts: ['FORWARD', 'TURN RIGHT', 'WAIT', 'DELIVER'], ans: 0 },
        { txt: 'The robot waits when the light is red 🔴.', prog: 'IF THE TRAFFIC LIGHT IS GREEN → FORWARD, ELSE → ___', opts: ['WAIT', 'FORWARD', 'TURN LEFT', 'DELIVER'], ans: 0 },
        { txt: 'The robot goes around the wall in front of it 🌳.', prog: 'IF THERE IS A WALL AHEAD → ___, ELSE → FORWARD', opts: ['TURN RIGHT', 'FORWARD', 'WAIT', 'DELIVER'], ans: 0 },
        { txt: 'The robot goes forward when the way is clear.', prog: 'IF THERE IS A WALL AHEAD → TURN RIGHT, ELSE → ___', opts: ['FORWARD', 'TURN RIGHT', 'WAIT', 'DELIVER'], ans: 0 },
        { txt: 'The robot uses the crosswalk only on green.', prog: 'IF ___ → FORWARD, ELSE → WAIT', opts: ['THE TRAFFIC LIGHT IS GREEN', 'THERE IS A WALL AHEAD', 'IT IS HOT', 'IT IS MONDAY'], ans: 0 },
        { txt: 'You decide whether to take an umbrella before going out ☔.', prog: 'IF ___ → I take an umbrella, ELSE → I take a cap', opts: ['IT IS RAINING', 'THERE IS A WALL AHEAD', 'THE TRAFFIC LIGHT IS GREEN', 'IT IS DAYTIME'], ans: 0 },
        { txt: 'The robot delivers the message when it reaches the house 🏠.', prog: 'IF ___ → DELIVER, ELSE → FORWARD', opts: ['IT REACHED THE HOUSE', 'THERE IS A WALL AHEAD', 'THE TRAFFIC LIGHT IS GREEN', 'IT IS NIGHT'], ans: 0 }
      ],

      opVidaBank: [
        { tema: 'Cooking on the wood cookfire 🔥', cond: 'is the cookfire lit?', si: 'I put the pot on to cook', no: 'I light the firewood first' },
        { tema: 'The rain and the washing on the line 👕', cond: 'is it raining?', si: 'I take the washing off the line', no: 'I leave the washing drying in the sun' },
        { tema: 'The swollen river on the way to school 🌊', cond: 'is the river swollen?', si: 'I wait or look for another way', no: 'I cross carefully' },
        { tema: 'Crossing the street at a traffic light 🚦', cond: 'is the traffic light green?', si: 'I cross the street', no: 'I wait on the sidewalk' },
        { tema: 'Wrapping up warm in the morning 🌡️', cond: 'is it cold?', si: 'I put on a sweater', no: 'I put on a t-shirt' },
        { tema: 'Watering the cornfield 🌽', cond: 'is the soil dry?', si: 'I water the plants', no: 'I do not water today' }
      ],

      OP_VIDA_RUBRICA: 'The CONDITION is a yes/no question (4 pts) · The THEN branch is the YES action (3 pts) · The ELSE branch is the NO action (3 pts)',

      OP_BUG_BANK: [
        { goal: 'turning when it runs into a wall 🌳', lines: ['IF THERE IS A WALL AHEAD → FORWARD, ELSE → TURN RIGHT', 'FORWARD', 'DELIVER'], linea: 1, correcta: 'IF THERE IS A WALL AHEAD → TURN RIGHT, ELSE → FORWARD' },
        { goal: 'crossing only on a green light 🚦', lines: ['FORWARD', 'IF THE TRAFFIC LIGHT IS GREEN → WAIT, ELSE → FORWARD', 'DELIVER'], linea: 2, correcta: 'IF THE TRAFFIC LIGHT IS GREEN → FORWARD, ELSE → WAIT' },
        { goal: 'waiting on a red light 🔴', lines: ['IF THE TRAFFIC LIGHT IS GREEN → FORWARD, ELSE → TURN RIGHT', 'FORWARD', 'DELIVER'], linea: 1, correcta: 'IF THE TRAFFIC LIGHT IS GREEN → FORWARD, ELSE → WAIT' },
        { goal: 'turning when it bumps into a tree 🌳', lines: ['FORWARD', 'IF THE TRAFFIC LIGHT IS GREEN → TURN RIGHT, ELSE → FORWARD', 'DELIVER'], linea: 2, correcta: 'IF THERE IS A WALL AHEAD → TURN RIGHT, ELSE → FORWARD' },
        { goal: 'taking an umbrella when it rains ☔', lines: ['IF IT IS RAINING → I leave the umbrella, ELSE → I take the umbrella', 'I leave the house', 'I get to school'], linea: 1, correcta: 'IF IT IS RAINING → I take the umbrella, ELSE → I leave the umbrella' }
      ],

      parteData: {
        n1: {
          nombre: 'Level 1 · The wall that makes it decide', icon: '1️⃣', n: 5, start: { r: 4, c: 2, dir: 'N' }, dest: [0, 2],
          obst: [[2, 2]], cross: [], semFase: 0, deco: { '0,0': '🏫', '4,4': '🏪' },
          meta: 'Take the robot to the house 🏠 on C1. There is a tree 🌳 on C3 blocking the direct way up: use «IF THERE IS A WALL AHEAD → TURN RIGHT, ELSE → FORWARD» to go around it.', xpn: 6
        },
        n2: {
          nombre: 'Level 2 · The corridor with walls', icon: '2️⃣', n: 5, start: { r: 4, c: 0, dir: 'N' }, dest: [0, 4],
          obst: [[2, 1], [3, 2], [1, 3]], cross: [], semFase: 0, deco: { '0,0': '⛪', '4,4': '🏪' },
          meta: 'The house 🏠 is on E1, on the far side of a corridor with trees 🌳. Combine FORWARD, TURN and the wall conditional to get there.', xpn: 6
        },
        n3: {
          nombre: 'Level 3 · The traffic light', icon: '3️⃣', n: 5, start: { r: 4, c: 2, dir: 'N' }, dest: [0, 2],
          obst: [], cross: [[2, 2]], semFase: 1, deco: { '0,0': '🏫', '4,0': '🏪' },
          meta: 'The house 🏠 is on C1, but to get there you have to cross the traffic light 🚦 on C3, which only lets you through on 🟢 green. Use «IF THE TRAFFIC LIGHT IS GREEN → FORWARD, ELSE → WAIT» (and WAIT until it changes!).', xpn: 6
        },
        n4: {
          nombre: 'Level 4 · Walls and traffic light', icon: '4️⃣', n: 5, start: { r: 4, c: 0, dir: 'N' }, dest: [0, 4],
          obst: [[2, 1]], cross: [[2, 3]], semFase: 0, deco: { '0,0': '⛪', '4,4': '🏪' },
          meta: 'The final challenge: reach the house 🏠 on E1, dodging the tree 🌳 on B3 and crossing the traffic light 🚦 on D3 only on green. Combine the two conditionals.', xpn: 6
        }
      }
    },

    /* ══════════════════════════════════════════════════════
       3. FRASES EXACTAS (pantalla y pruebas imprimibles)
       ══════════════════════════════════════════════════════ */
    frases: {
      /* — pestañas propias de esta misión — */
      'Condicional': 'Conditional', 'Simulador': 'Simulator',
      /* — el lenguaje del simulador, cuando cae solo en un nodo de texto — */
      'AVANZA': 'FORWARD', 'GIRA DERECHA': 'TURN RIGHT', 'GIRA IZQUIERDA': 'TURN LEFT',
      'ESPERA': 'WAIT', 'ENTREGA': 'DELIVER',
      'Norte': 'North', 'Este': 'East', 'Sur': 'South', 'Oeste': 'West',
      'Robot en': 'Robot at', 'mirando al': 'facing',
      /* — simulador: avisos que el JS arma al vuelo — */
      '🤖 Cargando la aldea…': '🤖 Loading the village…',
      'Toca los botones de arriba para armar tu programa 👆': 'Tap the buttons above to build your program 👆',
      '⚠️ Máximo 30 instrucciones': '⚠️ 30 instructions maximum',
      'El programa terminó sin entregar el mensaje. Agrega la instrucción ENTREGA cuando el robot esté sobre la casa 🏠.':
        'The program finished without delivering the message. Add the DELIVER instruction for when the robot is on top of the house 🏠.',
      'El semáforo 🚦 estaba en 🔴 rojo: no se puede cruzar. Usa ESPERA o el condicional del semáforo.':
        'The traffic light 🚦 was 🔴 red: you cannot cross. Use WAIT or the traffic-light conditional.',
      'Se salió del mapa.': 'It went off the map.',
      'Hay un árbol 🌳 en esa casilla.': 'There is a tree 🌳 on that square.',
      /* — mini-quiz de las tarjetas — */
      '¡Correcto! Así piensa un programador. 🎉': 'Correct! That is how a programmer thinks. 🎉',
      'Todavía no. Vuelve a leer la tarjeta y prueba otra vez.': 'Not yet. Read the card again and give it another try.',
      /* — flashcards y memorama — */
      '🧠 Juego: Memoria del Código': '🧠 Game: Code Memory',
      'Encuentra las parejas: cada concepto con su pista o ejemplo. ¡Ejercita la memoria mientras repasas!':
        'Find the pairs: each concept with its clue or example. Train your memory while you review!',
      '⭐ +1 XP por pareja encontrada (primera vez) · +2 XP al completar todo':
        '⭐ +1 XP per pair you find (first time) · +2 XP for finishing them all',
      /* — clasifica — */
      '💡 Consejo: ¡Usa el botón "Variar grupo" varias veces! Practicar con diferentes categorías te ayudará a dominar el tema.':
        '💡 Tip: use the "Change group" button several times! Practicing with different categories helps you master the topic.',
      /* — widgets — */
      '🔀 Arma el condicional en orden': '🔀 Build the conditional in order',
      'para ordenar las partes del condicional (SI → condición → ENTONCES → SINO):':
        'arrows to put the parts of the conditional in order (IF → condition → THEN → ELSE):',
      '⭐ +4 XP por orden correcto (primera vez por condicional)': '⭐ +4 XP per correct order (first time per conditional)',
      '🔄 Nuevo condicional': '🔄 New conditional',
      'Hay pasos fuera de orden. Revisa el arreglo.': 'Some steps are out of order. Check the arrangement.',
      '⭐ +3 XP por respuesta correcta (primera vez por caso)': '⭐ +3 XP per correct answer (first time per case)',
      '⭐ +3 XP por bug atrapado (primera vez)': '⭐ +3 XP per bug caught (first time)',
      '🤖 ¿Qué hace el robot?': '🤖 What does the robot do?',
      'Evalúa el condicional (¡mira si hay pared 🌳!) y elige la casilla donde termina el robot:':
        'Evaluate the conditional (check whether there is a wall 🌳!) and choose the square the robot ends up on:',
      '🎉 ¡Predijiste todos los recorridos!': '🎉 You predicted every route!',
      '❓ Elige la condición': '❓ Choose the condition',
      '¿Qué PREGUNTA (condición) necesita el robot para decidir en esta situación?':
        'Which QUESTION (condition) does the robot need in order to decide in this situation?',
      '🐛 Detective del bug': '🐛 Bug detective',
      'Cada programa tiene UN condicional al revés o con la condición errada. ¿En qué línea está el bug?':
        'Every program has ONE conditional that is backwards or has the wrong condition. Which line is the bug on?',
      '🎉 ¡Todos los bugs atrapados!': '🎉 Every bug caught!',
      '¡Bug atrapado! +3 XP': 'Bug caught! +3 XP',
      /* — generador de tareas — */
      '🔀 Predecir la rama': '🔀 Predict the branch',
      '✍️ Escribir el condicional': '✍️ Write the conditional',
      '🔮 Trazar el recorrido': '🔮 Trace the route',
      '🐛 Encontrar el error': '🐛 Find the mistake',
      /* — evaluación conceptual y prueba operativa — */
      'Evaluación Final · Condicionales: el Robot Decide · Educación Básica · Programación': 'Final Test · Conditionals: the Robot Decides · Basic Education · Programming',
      'Examen de Programación — Prueba Operativa · Condicionales: el Robot Decide · Educación Básica': 'Programming Exam — Practical Test · Conditionals: the Robot Decides · Basic Education',
      '🎓 Evaluación Final — Condicionales: el Robot Decide': '🎓 Final Test — Conditionals: the Robot Decides',
      '🤖 Prueba Operativa — Condicionales: el Robot Decide': '🤖 Practical Test — Conditionals: the Robot Decides',
      '✅ PAUTA — Evaluación Final · Condicionales: el Robot Decide': '✅ ANSWER KEY — Final Test · Conditionals: the Robot Decides',
      '✅ PAUTA — Prueba Operativa · Condicionales: el Robot Decide': '✅ ANSWER KEY — Practical Test · Conditionals: the Robot Decides',
      '🔄 Nueva Prueba Operativa': '🔄 New Practical Test',
      /* — prueba operativa: títulos de sección y consignas — */
      'I. Ejecuta el condicional': 'I. Run the conditional',
      'II. Predice la rama': 'II. Predict the branch',
      'III. Completa el condicional': 'III. Complete the conditional',
      'IV. Problemas de la vida real': 'IV. Real-life problems',
      'V. Olimpiada': 'V. Olympiad',
      'IV. Vida real (rúbrica 10 pts c/u)': 'IV. Real life (rubric, 10 pts each)',
      'Lee la situación y el condicional. Escribe QUÉ RAMA se ejecuta (ENTONCES o SINO) y qué HACE el robot.':
        'Read the situation and the conditional. Write WHICH BRANCH runs (THEN or ELSE) and what the robot DOES.',
      'Escribe el condicional COMPLETO para cada situación, con este formato:':
        'Write the COMPLETE conditional for each situation, in this format:',
      'Cada condicional tiene UN error. Escribe cuál es el bug y cómo debería quedar corregido.':
        'Every conditional has ONE mistake. Write what the bug is and how it should be corrected.',
      'SI (pregunta) ENTONCES (acción del sí) SINO (acción del no).': 'IF (question) THEN (the yes action) ELSE (the no action).',
      '⚠️ Genera una prueba operativa primero': '⚠️ Generate a practical test first',
      'Ejecuta condicionales en la cuadrícula, predice la rama, completa condicionales y atrapa bugs. Responde en pantalla y presiona':
        'Run conditionals on the grid, predict the branch, complete conditionals and catch bugs. Answer on screen and press',
      'para autoevaluarte.': 'to check yourself.',
      /* — generador de tareas: consigna propia del trazado — */
      'Copia la cuadrícula en tu cuaderno. Traza el programa con el dedo — ¡evalúa el condicional en cada paso! — y escribe la casilla donde TERMINA el robot 🤖.':
        'Copy the grid in your notebook. Trace the program with your finger — evaluate the conditional at every step! — and write the square the robot ENDS UP on 🤖.',
      /* — constancia — */
      'Misión Condicionales: el Robot Decide': 'Mission · Conditionals: the Robot Decides',
      '¡Sigue aprendiendo!': 'Keep learning!',
      '¡Muy buen trabajo!': 'Great work!',
      '¡Vas muy bien!': 'You are doing very well!',
      '¡Dominas los condicionales y las decisiones del robot!': 'You have mastered conditionals and the robot’s decisions!',
      '¡Maestro de los Condicionales!': 'Master of Conditionals!',
      /* — etiquetas de accesibilidad (aria-label y title) — */
      'Barra de progreso XP': 'XP progress bar',
      'Regresar a misiones de Programación': 'Back to the Programming missions',
      'Compartir misión por WhatsApp': 'Share this mission on WhatsApp',
      'Tarjeta de estudio. Presiona Enter para voltear': 'Study card. Press Enter to flip',
      'Opciones': 'Options',
      'Ir a la siguiente sección': 'Go to the next section',
      'Secciones de la misión': 'Mission sections',
      'Logros desbloqueados': 'Achievements unlocked',
      'Tipo de evaluación': 'Type of test',
      'Cuadrícula del robot': 'Robot grid'
    },

    /* ══════════════════════════════════════════════════════
       4. FRAGMENTOS (textos con números o nombres variables)
       ══════════════════════════════════════════════════════ */
    fragmentos: [
      /* El rótulo del semáforo dice AVANZAR/ESPERAR (con R): va ANTES que las
         palabras sueltas del simulador, o quedaría «puedes FORWARDR» */
      [/ · Semáforo 🚦 🟢 verde \(puedes AVANZAR\)/g, ' · Traffic light 🚦 🟢 green (you may go FORWARD)'],
      [/ · Semáforo 🚦 🔴 rojo \(debes ESPERAR\)/g, ' · Traffic light 🚦 🔴 red (you must WAIT)'],
      /* — el lenguaje del simulador dentro de frases compuestas: los bloques
         completos primero, que contienen a las palabras sueltas — */
      ['SI HAY PARED ADELANTE → GIRA DERECHA, SINO → AVANZA', 'IF THERE IS A WALL AHEAD → TURN RIGHT, ELSE → FORWARD'],
      ['SI SEMÁFORO EN VERDE → AVANZA, SINO → ESPERA', 'IF THE TRAFFIC LIGHT IS GREEN → FORWARD, ELSE → WAIT'],
      ['GIRA DERECHA', 'TURN RIGHT'], ['GIRA IZQUIERDA', 'TURN LEFT'],
      ['GIRA DER.', 'TURN RIGHT'], ['GIRA IZQ.', 'TURN LEFT'],
      ['AVANZA', 'FORWARD'], ['ESPERA', 'WAIT'], ['ENTREGA', 'DELIVER'],
      /* — simulador: estado del robot y del semáforo — */
      [/Robot en /g, 'Robot at '],
      [/ mirando al /g, ' facing '],
      [/Norte/g, 'North'], [/Este/g, 'East'], [/Sur/g, 'South'], [/Oeste/g, 'West'],
      /* — simulador: la rama que corrió el condicional y el final del programa — */
      ['✔ SÍ · ', '✔ YES · '],
      ['¿hay pared adelante?', 'is there a wall ahead?'],
      ['¿el semáforo está en verde?', 'is the traffic light green?'],
      [' → corre la rama ENTONCES (', ' → it runs the THEN branch ('],
      [' → corre la rama SINO (', ' → it runs the ELSE branch ('],
      [/💥 ¡El robot se detuvo en la instrucción (\d+) \(/g, '💥 The robot stopped on instruction $1 ('],
      ['Se salió del mapa.', 'It went off the map.'],
      ['Hay un árbol 🌳 en esa casilla.', 'There is a tree 🌳 on that square.'],
      ['El semáforo 🚦 estaba en 🔴 rojo: no se puede cruzar. Usa ESPERA o el condicional del semáforo.',
        'The traffic light 🚦 was 🔴 red: you cannot cross. Use WAIT or the traffic-light conditional.'],
      [' Corrige tu programa y vuelve a ejecutar.', ' Fix your program and run it again.'],
      [/📬 ¡Mensaje entregado en ([A-E]\d) con (\d+) instrucciones! ¡Excelente, programador!/g,
        '📬 Message delivered at $1 with $2 instructions! Excellent work, programmer!'],
      [/📭 El robot entregó el mensaje en ([A-E]\d)… ¡pero ahí no vive nadie! La casa 🏠 está en ([A-E]\d)\./g,
        '📭 The robot delivered the message at $1… but nobody lives there! The house 🏠 is at $2.'],
      /* — widgets: la corrección genérica y el contador de casos — */
      [/^El bug estaba en: /, 'The bug was on: '],
      [/Recorrido (\d+) de (\d+)/g, 'Route $1 of $2'],
      [/Caso (\d+) de (\d+)/g, 'Case $1 of $2'],
      /* — prueba operativa II: las situaciones que el generador arma al vuelo.
         Van DESPUÉS de las palabras del simulador, así que aquí ya dicen
         FORWARD, TURN RIGHT y WAIT. — */
      ['El robot tiene un árbol 🌳 justo adelante', 'The robot has a tree 🌳 right ahead'],
      ['El camino del robot está libre', 'The robot’s way is clear'],
      ['Hay pared adelante', 'There is a wall ahead'],
      ['No hay pared adelante', 'There is no wall ahead'],
      [/El semáforo está en 🟢 verde/g, 'The traffic light is 🟢 green'],
      [/El semáforo está en 🔴 rojo/g, 'The traffic light is 🔴 red'],
      [/El semáforo está en verde/g, 'The traffic light is green'],
      [/El semáforo está en rojo/g, 'The traffic light is red'],
      [/, ¿qué rama se ejecuta \(ENTONCES o SINO\)\?/g, ', which branch runs (THEN or ELSE)?'],
      [/, ¿qué HACE el robot \(FORWARD o TURN RIGHT\)\?/g, ', what DOES the robot do (FORWARD or TURN RIGHT)?'],
      [/, ¿qué HACE el robot \(FORWARD o WAIT\)\?/g, ', what DOES the robot do (FORWARD or WAIT)?'],
      [/El robot mira al ([A-Za-z]+) y hay pared adelante\. Con «(.+?)» corre su rama\. ¿Hacia dónde mira después\?/g,
        'The robot is facing $1 and there is a wall ahead. With «$2» it runs its branch. Which way is it facing afterwards?'],
      [/\. Con «/g, '. With «'],
      [/Revisar\. El robot termina en /g, 'Check again. The robot ends at '],
      /* — prueba operativa: calificación y pauta — */
      [/Ejecuta: (\d+)\/20 · Predice: (\d+)\/10 · Completa: (\d+)\/20 · Vida real: (\d+)\/30 · Retos: (\d+)\/20/g,
        'Run: $1/20 · Predict: $2/10 · Complete: $3/20 · Real life: $4/30 · Challenges: $5/20'],
      [/Correcto\. \+(\d+) pts/g, 'Correct. +$1 pts'],
      [/Revisar\. R\/ /g, 'Check again. Ans/ '],
      [/Revisar\. Faltaba: /g, 'Check again. It was missing: '],
      [/Puntaje autoevaluado: (\d+)\/10 \(compara siempre con la pauta\)/g, 'Self-assessed score: $1/10 (always compare with the answer key)'],
      ['¡Camino mínimo encontrado! +10 pts', 'Shortest path found! +10 pts'],
      [/Revisar\. Mínimo: (\d+) instrucciones \(/g, 'Check again. Minimum: $1 instructions ('],
      ['¡Bug atrapado y corregido! +10 pts', 'Bug caught and corrected! +10 pts'],
      [/Revisar\. Línea (\d+) → /g, 'Check again. Line $1 → '],
      [/Rúbrica: /g, 'Rubric: '],
      ['. Acepte redacciones distintas si la condición es una pregunta y las dos ramas son correctas.',
        '. Accept different wordings as long as the condition is a question and both branches are correct.'],
      /* esta misión dice «ítems», no «respuestas»: la regla de la base no la alcanza */
      [/🧮 Evaluación calificada: (\d+)\/100\. Revisa los ítems marcados\./g, '🧮 Test graded: $1/100. Check the marked items.'],
      /* las dos ramas sueltas, al final: lo compuesto ya se tradujo más arriba */
      [/ENTONCES/g, 'THEN'], [/SINO/g, 'ELSE'],
      /* — títulos con número de forma: antes que la regla suelta «Forma N» — */
      [/🎓 Evaluación Final · Forma (\d+) · Condicionales: el Robot Decide/g, '🎓 Final Test · Form $1 · Conditionals: the Robot Decides'],
      [/🤖 Prueba Operativa — Forma (\d+) · Condicionales: el Robot Decide/g, '🤖 Practical Test — Form $1 · Conditionals: the Robot Decides'],
      [/Evaluación Condicionales: el Robot Decide/g, 'Test · Conditionals: the Robot Decides'],
      [/Prueba Operativa Condicionales: el Robot Decide/g, 'Practical Test · Conditionals: the Robot Decides'],
      /* — etiquetas de accesibilidad con número — */
      [/Elegir número de forma exacta \(1 a (\d+)\)/g, 'Choose the exact form number (1 to $1)']
    ],

    /* ══════════════════════════════════════════════════════
       5. TEXTOS QUE VIVEN EN EL CSS (content: '…')
       ══════════════════════════════════════════════════════ */
    css: [
      'body[data-idioma="en"] .hero::before{content:\'FORWARD · TURN RIGHT · TURN LEFT · DELIVER · SEQUENCE · PROGRAM · ALGORITHM · INSTRUCTION · ROBOT · STEP BY STEP · NORTH · EAST · SOUTH · WEST · BUG · DEBUG\';}',
      'body[data-idioma="en"] .eval-answer::before{content:\'✓ Answer: \';}',
      'body[data-idioma="en"] .crit-pauta::before{content:\'📋 Answer key: \';}'
    ].join('\n')
  };
})();
