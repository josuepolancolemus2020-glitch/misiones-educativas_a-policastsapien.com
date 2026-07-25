/* ============================================================
   Misión «Motores y Mecanismos» — versión en inglés
   ------------------------------------------------------------
   Traducción de autor (no automática) para escuelas bilingües.
   Se carga junto a la misión y el motor js/metas-i18n.js la
   activa con el botón 🌐 English de la barra superior.

   Criterio de traducción:
   · Inglés AMERICANO estricto: color, center, catalog, analyze,
     practicing, «Student No.».
   · Vocabulario técnico estándar de mecanismos escolares:
     motor · actuator · gear · pinion · tooth/teeth · idler gear
     · gear ratio · pulley · belt · lever · fulcrum · wheel and
     axle · worm gear · crank and rod · chain and sprockets ·
     force vs speed.
   · Lo cultural se explica, no se calca: molino de maíz → corn
     mill, despulpadora de café → coffee pulper, carretilla →
     wheelbarrow, molinete del portón → gate winch, faja del
     molino → mill belt, pulpería → corner store.
   · Los bancos son traducción ÍNDICE A ÍNDICE del español: las
     formas deterministas de la evaluación (1–30) sacan las mismas
     preguntas y la misma clave ZipGrade en los dos idiomas.

   Las frases comunes a las 56 misiones (juegos, generador de
   tareas, las dos evaluaciones, constancia y pie) viven en
   BASE_FRASES/BASE_FRAGMENTOS de js/metas-i18n.js: aquí solo va
   lo propio de Motores y Mecanismos.
   ============================================================ */
(function () {
  'use strict';

  /* ══════════ Sopa de letras en inglés ══════════
     El tablero se arma aquí mismo con las palabras traducidas
     (una traducción no puede reusar la cuadrícula española). */
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

    titulo: 'Mission Motors and Mechanisms | policastsapien.com',

    /* ══════════════════════════════════════════════════════
       1. BLOQUES DE CONTENIDO (data-i18n en el HTML)
       ══════════════════════════════════════════════════════ */
    html: {

      hero:
        '<h1>Mission <span>Motors and Mechanisms</span></h1>' +
        '<p class="sub">Find out how a robot moves: motors, gears, pulleys and levers. Do you need force or speed? ⚙️💪⚡</p>' +
        '<div class="badge">🤖 Robot Path · Stage 3 of 6 · Robotics</div>',

      a1:
        '<h2>⚙️ The motor: the actuator that provides movement</h2>' +
        '<p>The <strong>motor</strong> is the most important <strong>actuator</strong> in a robot: it turns the ' +
        '<strong>electrical energy</strong> of the battery into <strong>rotation</strong>. But the motor’s turning is almost ' +
        'never useful just as it comes out: it is <strong>very fast and has little force</strong>. That is why we connect ' +
        '<strong>mechanisms</strong> to it (gears, pulleys, levers) that <strong>transmit</strong> and ' +
        '<strong>transform</strong> that movement.</p>' +
        '<div class="type-grid">' +
        '<div class="type-chip tc-teal"><div class="t-art">🔌 DC motor</div><div class="t-info">It turns nonstop as long as there is current: lots of speed, little force</div></div>' +
        '<div class="type-chip tc-gold"><div class="t-art">📐 Servomotor</div><div class="t-info">It turns to an <b>exact angle</b> (90°, for example) and stays there</div></div>' +
        '<div class="type-chip tc-amber"><div class="t-art">🧰 Gearmotor</div><div class="t-info">Motor + gearbox: it turns slower, but with <b>far more force</b></div></div>' +
        '<div class="type-chip tc-jade"><div class="t-art">⚙️ Mechanism</div><div class="t-info">Parts that carry the motor’s movement to wherever it is needed</div></div>' +
        '</div>' +
        '<div class="tip">' +
        '<span class="ti">💡</span>' +
        '<div><strong>Think of it this way:</strong> the <b>motor</b> is the muscle and the <b>mechanisms</b> are the bones and ' +
        'the joints. A muscle on its own lifts nothing: it needs something to push against.</div>' +
        '</div>',

      a2:
        '<h2>🦷 Gears: teeth that shake hands</h2>' +
        '<p>A <strong>gear</strong> (or pinion) is a wheel with <strong>teeth</strong>. When the teeth of two gears ' +
        '<strong>mesh</strong>, one drags the other along without slipping. Two golden rules that never fail:</p>' +
        '<div class="vs-grid">' +
        '<div class="vs-box vs-a">' +
        '<h4>🔄 Direction of rotation</h4>' +
        '<p>Two gears in contact turn in <strong>opposite directions</strong>. If you put in <strong>three</strong>, the ' +
        'first and the <strong>third turn the same way</strong> (the middle one is called an <em>idler gear</em>: it only changes ' +
        'the direction, not the speed).</p>' +
        '</div>' +
        '<div class="vs-box vs-b">' +
        '<h4>⚖️ Ratio: force or speed</h4>' +
        '<p><strong>Small drives big</strong> → the big one turns <strong>slower but with more force</strong>. ' +
        '<strong>Big drives small</strong> → the small one turns <strong>faster but with less force</strong>.</p>' +
        '</div>' +
        '</div>' +
        '<div class="tip">' +
        '<span class="ti">⚠️</span>' +
        '<div><strong>You never win everything:</strong> mechanisms make a <b>trade</b>. Whatever you gain in force you ' +
        'lose in speed, and whatever you gain in speed you lose in force. That is why you have to choose carefully!</div>' +
        '</div>',

      a3:
        '<h2>🇭🇳 Mechanisms in real life in Honduras</h2>' +
        '<p>You do not need a laboratory: mechanisms are in your house, in your yard and in your community.</p>' +
        '<div class="vs-grid">' +
        '<div class="vs-box vs-a">' +
        '<h4>🌽 Farm and kitchen</h4>' +
        '<p>The <strong>corn mill</strong> uses a crank and a <strong>worm gear</strong> to give a lot of ' +
        'force. The <strong>coffee pulper</strong> drives its <strong>gears</strong> with a crank. The ' +
        '<strong>wheelbarrow</strong> the bricklayer uses is a <strong>lever</strong> with a wheel and axle.</p>' +
        '</div>' +
        '<div class="vs-box vs-b">' +
        '<h4>🚲 Street and workshop</h4>' +
        '<p>The <strong>bicycle</strong> carries the turning of the <strong>chainring</strong> to the <strong>sprocket</strong> with a ' +
        'chain: a small sprocket = more speed; a big sprocket = more force to climb the hill. The ' +
        '<strong>gate winch</strong> turns gears to open a heavy gate.</p>' +
        '</div>' +
        '</div>' +
        '<div class="tip">' +
        '<span class="ti">🎯</span>' +
        '<div><strong>The key question of this mission:</strong> before you choose a mechanism, always ask yourself ' +
        '<b>do I need force or do I need speed?</b> The answer decides which gear, pulley or lever to use.</div>' +
        '</div>',

      e1:
        '<h2>⚖️ Force or speed? The table that decides</h2>' +
        '<p>Every mechanism makes the same deal: <strong>force in exchange for distance or speed</strong>.</p>' +
        '<div style="overflow-x:auto;">' +
        '<table style="width:100%;border-collapse:collapse;font-size:0.82rem;min-width:480px;">' +
        '<thead>' +
        '<tr style="background:var(--pri-gl);">' +
        '<th style="padding:0.4rem 0.5rem;border:1px solid var(--border);text-align:left;">Setup</th>' +
        '<th style="padding:0.4rem 0.5rem;border:1px solid var(--border);">🔄 Direction</th>' +
        '<th style="padding:0.4rem 0.5rem;border:1px solid var(--border);">⚡ Speed</th>' +
        '<th style="padding:0.4rem 0.5rem;border:1px solid var(--border);">💪 Force</th>' +
        '<th style="padding:0.4rem 0.5rem;border:1px solid var(--border);">What is it good for?</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:700;">⚙️ Small → big</td><td style="padding:0.4rem;border:1px solid var(--border);text-align:center;">Opposite</td><td style="padding:0.4rem;border:1px solid var(--border);text-align:center;">Down ⬇️</td><td style="padding:0.4rem;border:1px solid var(--border);text-align:center;">Up ⬆️</td><td style="padding:0.4rem;border:1px solid var(--border);font-weight:600;">Lifting and dragging weight</td></tr>' +
        '<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:700;">⚙️ Big → small</td><td style="padding:0.4rem;border:1px solid var(--border);text-align:center;">Opposite</td><td style="padding:0.4rem;border:1px solid var(--border);text-align:center;">Up ⬆️</td><td style="padding:0.4rem;border:1px solid var(--border);text-align:center;">Down ⬇️</td><td style="padding:0.4rem;border:1px solid var(--border);font-weight:600;">Running fast, fans</td></tr>' +
        '<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:700;">⚙️⚙️⚙️ Three equal gears</td><td style="padding:0.4rem;border:1px solid var(--border);text-align:center;">1st and 3rd alike</td><td style="padding:0.4rem;border:1px solid var(--border);text-align:center;">Same ➡️</td><td style="padding:0.4rem;border:1px solid var(--border);text-align:center;">Same ➡️</td><td style="padding:0.4rem;border:1px solid var(--border);font-weight:600;">Only changing the direction</td></tr>' +
        '<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:700;">🌀 Worm gear</td><td style="padding:0.4rem;border:1px solid var(--border);text-align:center;">The axis changes</td><td style="padding:0.4rem;border:1px solid var(--border);text-align:center;">Very low ⬇️⬇️</td><td style="padding:0.4rem;border:1px solid var(--border);text-align:center;">Very high ⬆️⬆️</td><td style="padding:0.4rem;border:1px solid var(--border);font-weight:600;">Corn mill, gates</td></tr>' +
        '</tbody>' +
        '</table>' +
        '</div>' +
        '<div class="tip">' +
        '<span class="ti">🎯</span>' +
        '<div><strong>Golden rule:</strong> a mechanism <b>does not create energy</b>: it only shares it out. More force always ' +
        'costs speed; more speed always costs force.</div>' +
        '</div>',

      e2:
        '<h2>⚡ Lightning mini-quiz</h2>' +
        '<p style="font-size:0.9rem;margin-bottom:0.5rem;">1) A gear with <strong>10 teeth</strong> drives one with <strong>40 teeth</strong>. What happens to the big one?</p>' +
        '<div class="cmp-opts" role="group" style="margin-bottom:0.4rem;">' +
        '<button class="cmp-opt" onclick="miniQ(this,false,\'fbMq1\')">It turns faster and with more force</button>' +
        '<button class="cmp-opt" onclick="miniQ(this,true,\'fbMq1\')">It turns slower but with more force</button>' +
        '<button class="cmp-opt" onclick="miniQ(this,false,\'fbMq1\')">It turns just like the small one</button>' +
        '</div>' +
        '<div id="fbMq1" class="fb" role="alert"></div>' +
        '<p style="font-size:0.9rem;margin:0.9rem 0 0.5rem;">2) Two gears <strong>in contact</strong>: if the first one turns to the right, which way does the second one turn?</p>' +
        '<div class="cmp-opts" role="group" style="margin-bottom:0.4rem;">' +
        '<button class="cmp-opt" onclick="miniQ(this,true,\'fbMq2\')">To the left: in the opposite direction</button>' +
        '<button class="cmp-opt" onclick="miniQ(this,false,\'fbMq2\')">To the right as well</button>' +
        '<button class="cmp-opt" onclick="miniQ(this,false,\'fbMq2\')">It does not turn: it stays still</button>' +
        '</div>' +
        '<div id="fbMq2" class="fb" role="alert"></div>',

      e3:
        '<h2>🗺️ The mechanism family</h2>' +
        '<p>Each mechanism solves a different problem. These are the ones you should know:</p>' +
        '<div class="type-grid">' +
        '<div class="type-chip tc-teal"><div class="t-art">⚙️ Gears</div><div class="t-info">Teeth that mesh: they transmit the turning with force and without slipping</div></div>' +
        '<div class="type-chip tc-gold"><div class="t-art">🎡 Pulleys and belt</div><div class="t-info">They carry the turning <b>over a distance</b>; if the belt is crossed, the turning is reversed</div></div>' +
        '<div class="type-chip tc-amber"><div class="t-art">🪝 Lever</div><div class="t-info">Bar + fulcrum: it multiplies the force and travels a shorter distance</div></div>' +
        '<div class="type-chip tc-purple"><div class="t-art">🛞 Wheel and axle</div><div class="t-info">The wheel turns together with the axle: moving loads with little friction</div></div>' +
        '<div class="type-chip tc-jade"><div class="t-art">🌀 Worm gear</div><div class="t-info">A threaded «worm»: a huge amount of force and very little speed</div></div>' +
        '<div class="type-chip tc-teal"><div class="t-art">🔁 Crank and rod</div><div class="t-info">It turns <b>rotation</b> into <b>back-and-forth</b> motion, like the sewing machine</div></div>' +
        '</div>' +
        '<div class="tip">' +
        '<span class="ti">✏️</span>' +
        '<div><strong>Unplugged robotics:</strong> you can build every one of these mechanisms with <b>cardboard, bottle caps, ' +
        'thread spools, rulers and pencils</b>. You do not need a computer to understand how a robot moves!</div>' +
        '</div>',

      labh2: '⚙️ Gear Train Laboratory',

      labintro: 'Choose a case, watch how the gears turn and answer the two questions. ⭐ +4 XP per case solved (first time).',

      labq1: '1️⃣ Which way does the <strong>last</strong> gear turn (the green one)?',

      labq2: '2️⃣ Compared with the first one, how does the last one turn?',

      labctl:
        '<div class="lab-group">' +
        '<span class="lab-group-label">⚙️ Case:</span>' +
        '<button class="lab-btn lab-cont-btn" data-caso="0" onclick="gearShowCase(0)">1</button>' +
        '<button class="lab-btn lab-cont-btn" data-caso="1" onclick="gearShowCase(1)">2</button>' +
        '<button class="lab-btn lab-cont-btn" data-caso="2" onclick="gearShowCase(2)">3</button>' +
        '<button class="lab-btn lab-cont-btn" data-caso="3" onclick="gearShowCase(3)">4</button>' +
        '<button class="lab-btn lab-cont-btn" data-caso="4" onclick="gearShowCase(4)">5</button>' +
        '<button class="lab-btn lab-cont-btn" data-caso="5" onclick="gearShowCase(5)">6</button>' +
        '</div>' +
        '<div class="lab-group">' +
        '<span class="lab-group-label">🎬 Spin:</span>' +
        '<button class="lab-btn lab-asp-btn" id="gearAnimBtn" onclick="gearToggleAnim()">⏸️ Pause the spin</button>' +
        '<button class="lab-btn lab-asp-btn" onclick="gearNextCase()">▶ Next case</button>' +
        '</div>',

      rec:
        '<h2>📁 Topic Resources</h2>' +
        '<div style="border:1.5px solid var(--border,#e2e8f0);border-radius:12px;padding:1rem 1.2rem;margin-bottom:1.2rem;background:rgba(0,0,0,0.02);">' +
        '<p style="font-size:0.98rem;font-weight:800;margin-bottom:0.4rem;">📄 Printable study sheet</p>' +
        '<p style="font-size:0.86rem;margin-bottom:0.85rem;">A 7-page study guide (theory, unplugged activities and a test) to print out or work through before the exam.</p>' +
        '<a href="../../fichas/ficha-motores-mecanismos.html" target="_blank" rel="noopener noreferrer" class="btn btn-pri" style="display:inline-flex;align-items:center;gap:0.5rem;text-decoration:none;font-size:1rem;padding:0.7rem 1.4rem;">📄 Open / Print the study sheet</a>' +
        '</div>' +
        '<p style="font-size:0.9rem;margin-bottom:1rem;">Here you will find support materials for this mission: slideshows, PDF documents, study guides and more. Your teacher will keep adding resources to this folder.</p>' +
        '<a href="https://drive.google.com/drive/folders/1motores_mecanismos_recursos" target="_blank" rel="noopener noreferrer" class="btn btn-pri" style="display:inline-flex;align-items:center;gap:0.5rem;text-decoration:none;font-size:1rem;padding:0.7rem 1.4rem;">' +
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
        primer_quiz: { icon: '⚙️', label: 'First mechanism quiz completed' },
        flash_master: { icon: '🃏', label: 'All mechanism flashcards explored' },
        clasif_pro: { icon: '🗂️', label: 'Expert force-and-speed sorter' },
        id_master: { icon: '🔍', label: 'Master mechanism spotter' },
        reto_hero: { icon: '🏆', label: 'Force vs Speed challenge hero' },
        nivel3: { icon: '🧭', label: 'Gear Apprentice! Level 3' },
        nivel5: { icon: '🥇', label: 'Mechanical Engineer! Level 6' },
        widgets_master: { icon: '🧩', label: 'Transmission widgets mastered' },
        gear_lab: { icon: '🦷', label: 'Gear train laboratory completed' }
      },

      lvls: [
        { t: 0, n: 'Beginner 🌱' }, { t: 25, n: 'Tech Explorer 🔩' }, { t: 55, n: 'Gear Apprentice ⚙️' },
        { t: 90, n: 'Pulley Technician 🎡' }, { t: 130, n: 'Lever Builder 🪝' },
        { t: 165, n: 'Mechanical Engineer 🛠️' }, { t: 190, n: 'Master of Movement 🤖' }
      ],

      fcData: [
        { w: 'Motor', a: '⚙️ The <strong>actuator</strong> that turns the battery’s <strong>electrical energy</strong> into <strong>rotation</strong>.' },
        { w: 'Servomotor', a: '📐 A motor that turns to an <strong>exact angle</strong> (90°, for example) and stays there: it is used for arms and grippers.' },
        { w: 'Gearmotor', a: '🧰 Motor + <strong>gearbox</strong>: it turns <strong>slower</strong> but with <strong>far more force</strong>.' },
        { w: 'Gear', a: '🦷 A wheel with <strong>teeth</strong> that mesh into another one. Two in contact turn in <strong>opposite directions</strong>.' },
        { w: 'Gear ratio', a: '⚖️ The comparison between the <strong>teeth</strong> of the first gear and those of the last one: it decides whether you gain force or speed.' },
        { w: 'Idler gear', a: '🎯 The gear in the <strong>middle</strong> of a train of three: it only <strong>changes the direction</strong>, it does not change the speed.' },
        { w: 'Pulley', a: '🎡 A wheel with a <strong>groove</strong> for a rope or a belt to run through. A <strong>fixed pulley</strong> changes the direction of the force; a <strong>movable</strong> one helps you lift weight.' },
        { w: 'Belt', a: '🪢 A strip that joins two pulleys and carries the turning <strong>over a distance</strong>. If it is <strong>crossed</strong>, the turning is reversed.' },
        { w: 'Lever', a: '🪝 A rigid bar that turns on a <strong>fulcrum</strong>: it <strong>multiplies the force</strong>, but it travels a shorter distance.' },
        { w: 'Fulcrum', a: '🔺 The fixed point the lever bar turns on. Without it, <strong>there is no lever</strong>.' },
        { w: 'Wheel and axle', a: '🛞 The wheel turns together with the <strong>axle</strong> and drags it along: it moves loads with little effort (wheelbarrow, cart).' },
        { w: 'Worm gear', a: '🌀 A threaded «worm» that drives a toothed wheel: <strong>a huge amount of force</strong> and very little speed (the corn mill).' },
        { w: 'Crank and rod', a: '🔁 It turns <strong>rotation</strong> into <strong>back-and-forth</strong> motion, like the sewing machine.' },
        { w: 'Chain and sprockets', a: '🚲 They carry the turning over a distance without slipping: the bicycle’s <strong>chainring</strong> drives the <strong>sprocket</strong> of the rear wheel.' }
      ],

      memoPairs: [
        { id: 'motor', t: 'Motor', d: '⚙️ it turns electricity into rotation' },
        { id: 'engranaje', t: 'Gear', d: '🦷 a toothed wheel: two in contact turn opposite ways' },
        { id: 'polea', t: 'Pulley and belt', d: '🎡 they carry the turning over a distance' },
        { id: 'palanca', t: 'Lever', d: '🪝 a bar with a fulcrum: it multiplies the force' },
        { id: 'tornillo', t: 'Worm gear', d: '🌀 lots of force and very little speed' },
        { id: 'biela', t: 'Crank and rod', d: '🔁 it turns rotation into back-and-forth motion' }
      ],

      qzData: [
        { q: 'What does a robot’s motor do?', o: ['a) It stores the information', 'b) It turns electrical energy into rotation', 'c) It senses light', 'd) It cools the battery down'], c: 1 },
        { q: 'Two gears with their teeth meshed: how do they turn?', o: ['a) In the same direction', 'b) One turns and the other does not', 'c) In opposite directions', 'd) It depends on the color'], c: 2 },
        { q: 'A 10-tooth gear drives a 30-tooth one. What happens to the 30-tooth one?', o: ['a) It turns slower and with more force', 'b) It turns faster and with more force', 'c) It turns faster and with less force', 'd) It stays still'], c: 0 },
        { q: 'In a train of THREE gears, the first and the third one…', o: ['a) Turn in opposite directions', 'b) Turn in the same direction', 'c) Never turn', 'd) Turn twice as fast'], c: 1 },
        { q: 'Which motor turns to an exact angle and stops there?', o: ['a) The DC motor', 'b) The gearmotor', 'c) The servomotor', 'd) The worm gear'], c: 2 },
        { q: 'What happens if the belt between two pulleys is crossed?', o: ['a) The belt snaps', 'b) The second shaft turns the other way', 'c) Nothing happens', 'd) The big pulley disappears'], c: 1 },
        { q: 'What does a lever need in order to work?', o: ['a) An electric motor', 'b) A battery', 'c) A fulcrum', 'd) A belt'], c: 2 },
        { q: 'Which mechanism turns rotation into back-and-forth motion?', o: ['a) The fixed pulley', 'b) The crank and rod', 'c) The wheel and axle', 'd) The idler gear'], c: 1 },
        { q: 'What is the trade every mechanism makes?', o: ['a) You gain force and speed at the same time', 'b) You lose everything', 'c) Whatever you gain in force you lose in speed', 'd) The mechanism creates brand-new energy'], c: 2 }
      ],

      classGroups: [
        {
          label: ['Gains force', 'Gains speed'], headA: '💪 Gains force', headB: '⚡ Gains speed', colA: 'fue', colB: 'vel',
          words: [{ w: 'A small pinion drives a big wheel', t: 'fue' }, { w: 'A big wheel drives a small pinion', t: 'vel' }, { w: 'Worm gear', t: 'fue' }, { w: 'DC motor with no reduction', t: 'vel' }, { w: 'Gearmotor', t: 'fue' }, { w: 'The small sprocket of the bicycle', t: 'vel' }, { w: 'The big sprocket for the hill', t: 'fue' }, { w: 'A big pulley drives a small pulley', t: 'vel' }, { w: 'A small pulley drives a big pulley', t: 'fue' }, { w: 'A long lever over the fulcrum', t: 'fue' }]
        },
        {
          label: ['Same direction', 'Opposite direction'], headA: '🔄 They turn alike', headB: '↩️ They turn opposite ways', colA: 'igu', colB: 'con',
          words: [{ w: 'Two gears in contact', t: 'con' }, { w: 'Three gears: the 1st and the 3rd', t: 'igu' }, { w: 'Two pulleys with an open belt', t: 'igu' }, { w: 'Two pulleys with a crossed belt', t: 'con' }, { w: 'Chainring and sprocket with a chain', t: 'igu' }, { w: 'A small pinion with a toothed wheel', t: 'con' }, { w: 'A toothed wheel with a toothed wheel', t: 'con' }, { w: 'The open belt of the mill', t: 'igu' }]
        },
        {
          label: ['Lever', 'Pulley'], headA: '🪝 It is a lever', headB: '🎡 It is a pulley', colA: 'pal', colB: 'pol',
          words: [{ w: 'The seesaw in the park', t: 'pal' }, { w: 'The bucket in the well', t: 'pol' }, { w: 'The bricklayer’s wheelbarrow', t: 'pal' }, { w: 'Raising the flag up the pole', t: 'pol' }, { w: 'Scissors', t: 'pal' }, { w: 'The crane that lifts blocks', t: 'pol' }, { w: 'The tongs for the barbecue', t: 'pal' }, { w: 'The clothesline with a pulley wheel', t: 'pol' }]
        },
        {
          label: ['Turning motion', 'Back-and-forth motion'], headA: '🔄 Turning (circular)', headB: '↔️ Back and forth', colA: 'gir', colB: 'vai',
          words: [{ w: 'The wheel of the cart', t: 'gir' }, { w: 'The needle of the sewing machine', t: 'vai' }, { w: 'The gear inside the clock', t: 'gir' }, { w: 'The piston of the engine', t: 'vai' }, { w: 'The pulley of the well', t: 'gir' }, { w: 'The saw that goes back and forth', t: 'vai' }, { w: 'The bicycle chain', t: 'gir' }, { w: 'The windshield wiper', t: 'vai' }]
        }
      ],

      idData: [
        { s: ['The', 'motor', 'turns', 'electricity', 'into', 'rotation.'], c: 1, art: 'the actuator that produces the movement' },
        { s: ['The', 'gear', 'has', 'teeth', 'that', 'mesh', 'without', 'slipping.'], c: 1, art: 'the toothed wheel that transmits the turning' },
        { s: ['The', 'lever', 'turns', 'on', 'its', 'fulcrum.'], c: 1, art: 'the rigid bar that multiplies the force' },
        { s: ['The', 'belt', 'joins', 'the', 'two', 'pulleys', 'of', 'the', 'mill.'], c: 1, art: 'the strip that transmits the turning over a distance' },
        { s: ['The', 'servomotor', 'stops', 'at', 'the', 'exact', 'angle.'], c: 1, art: 'the motor that controls the exact position' },
        { s: ['The', 'worm', 'gear', 'gives', 'the', 'gate', 'a', 'lot', 'of', 'force.'], c: 1, art: 'the mechanism with the greatest reduction' },
        { s: ['The', 'crank-and-rod', 'turns', 'rotation', 'into', 'back-and-forth', 'motion.'], c: 1, art: 'the mechanism that transforms the movement' },
        { s: ['The', 'chain', 'carries', 'the', 'turning', 'from', 'the', 'chainring', 'to', 'the', 'sprocket.'], c: 1, art: 'the part that joins the bicycle chainring with the sprocket' }
      ],

      cmpData: [
        { s: 'The motor turns electrical energy into ___ movement.', opts: ['turning', 'color', 'sound'], c: 0 },
        { s: 'Two gears in contact turn in ___ directions.', opts: ['identical', 'opposite', 'slow'], c: 1 },
        { s: 'A small gear that drives a big one gives more ___.', opts: ['force', 'speed', 'noise'], c: 0 },
        { s: 'A big gear that drives a small one gives more ___.', opts: ['weight', 'force', 'speed'], c: 2 },
        { s: 'The lever needs a ___ in order to work.', opts: ['fulcrum', 'coat of paint', 'bucket of water'], c: 0 },
        { s: 'If the belt is put on crossed, the turning is ___.', opts: ['stopped', 'reversed', 'sped up'], c: 1 },
        { s: 'The ___ gear gives a lot of force and very little speed.', opts: ['motor', 'worm', 'cable'], c: 1 },
        { s: 'The crank and rod turns rotation into ___ motion.', opts: ['back-and-forth', 'light', 'heat'], c: 0 }
      ],

      routeSets: [
        {
          label: 'The corn mill at home', steps: [
            'The hand turns the crank',
            'The shaft passes the turning on to the worm gear',
            'The worm gear turns slowly and with a huge amount of force',
            'The grinding stone crushes the grain of corn']
        },
        {
          label: 'The bicycle climbing the hill', steps: [
            'The foot pushes the pedal down',
            'The big chainring turns together with the pedal',
            'The chain carries the turning to the sprocket',
            'The sprocket makes the rear wheel turn',
            'The bicycle moves along the street']
        },
        {
          label: 'The robot car with a gearmotor', steps: [
            'The battery sends current to the motor',
            'The motor turns very fast but with little force',
            'The gearbox brings the speed down',
            'The output shaft turns slowly and with a lot of force',
            'The wheel pushes the car along with its load']
        }
      ],

      neuronPartes: [
        { desc: 'Lifting a heavy stone in the yard using an iron bar', ans: 'Lever', opts: ['Lever', 'Belt and pulleys', 'Crank and rod', 'Wheel and axle'] },
        { desc: 'Bringing the bucket of water up from the bottom of the well by pulling downward', ans: 'Pulley', opts: ['Pulley', 'Gears', 'Worm gear', 'Lever'] },
        { desc: 'Carrying the motor’s turning to a shaft that is far away, without them touching', ans: 'Belt and pulleys', opts: ['Belt and pulleys', 'Lever', 'Worm gear', 'Fulcrum'] },
        { desc: 'Making the robot’s wheel turn slowly but with far more force', ans: 'Reduction gears', opts: ['Reduction gears', 'Fixed pulley', 'Crank and rod', 'Wheel and axle'] },
        { desc: 'Turning the motor’s rotation into a back-and-forth movement, like a saw', ans: 'Crank and rod', opts: ['Crank and rod', 'Reduction gears', 'Belt and pulleys', 'Pulley'] },
        { desc: 'Opening a very heavy gate with a small motor, so that it does not slide back on its own', ans: 'Worm gear', opts: ['Worm gear', 'Lever', 'Belt and pulleys', 'Crank and rod'] },
        { desc: 'Moving a cart full of sand with the least effort possible', ans: 'Wheel and axle', opts: ['Wheel and axle', 'Worm gear', 'Crank and rod', 'Belt and pulleys'] },
        { desc: 'Carrying the turning of the pedal to the rear wheel of the bicycle without slipping', ans: 'Chain and sprockets', opts: ['Chain and sprockets', 'Pulley', 'Lever', 'Crank and rod'] }
      ],

      neuroPairs: [
        { trans: 'Gear', func: 'It transmits the turning with its teeth; the next one turns the other way', opts: ['It transmits the turning with its teeth; the next one turns the other way', 'It stores the battery’s energy', 'It turns rotation into back-and-forth motion', 'It holds up the fulcrum'] },
        { trans: 'Pulley and belt', func: 'They carry the turning from one shaft to another over a distance', opts: ['They carry the turning from one shaft to another over a distance', 'They cut off the electric current', 'They multiply the force with a bar', 'They mark the exact angle'] },
        { trans: 'Lever', func: 'It multiplies the force by turning on a fulcrum', opts: ['It multiplies the force by turning on a fulcrum', 'It turns rotation into back-and-forth motion', 'It increases the speed of the motor', 'It transmits the turning over a distance'] },
        { trans: 'Worm gear', func: 'It gives a huge amount of force and very little speed', opts: ['It gives a huge amount of force and very little speed', 'It gives a huge amount of speed and little force', 'It changes the color of the movement', 'It works as a fulcrum'] },
        { trans: 'Crank and rod', func: 'It turns rotation into back-and-forth motion', opts: ['It turns rotation into back-and-forth motion', 'It turns back-and-forth motion into electricity', 'It transmits the turning without changing it', 'It lifts the bucket out of the well'] }
      ],

      enfermedadData: [
        { disease: 'A 10-tooth pinion drives a 40-tooth wheel', characteristic: 'It gains force (it turns slower)', opts: ['It gains force (it turns slower)', 'It gains speed (with less force)'] },
        { disease: 'A 40-tooth wheel drives a 10-tooth pinion', characteristic: 'It gains speed (with less force)', opts: ['It gains speed (with less force)', 'It gains force (it turns slower)'] },
        { disease: 'The big chainring of the bicycle drives the smallest sprocket', characteristic: 'It gains speed (with less force)', opts: ['It gains speed (with less force)', 'It gains force (it turns slower)'] },
        { disease: 'The small motor drives the worm gear of the gate', characteristic: 'It gains force (it turns slower)', opts: ['It gains force (it turns slower)', 'It gains speed (with less force)'] },
        { disease: 'A small pulley drives a big pulley through the belt', characteristic: 'It gains force (it turns slower)', opts: ['It gains force (it turns slower)', 'It gains speed (with less force)'] },
        { disease: 'A big pulley drives a small pulley through the belt', characteristic: 'It gains speed (with less force)', opts: ['It gains speed (with less force)', 'It gains force (it turns slower)'] }
      ],

      retoPairs: [
        {
          label: ['More force', 'More speed'], btnA: '💪 More force', btnB: '⚡ More speed', colA: 'fue', colB: 'vel',
          words: [{ w: 'A pinion drives a big wheel', t: 'fue' }, { w: 'A big wheel drives a pinion', t: 'vel' }, { w: 'Worm gear', t: 'fue' }, { w: 'DC motor with no reduction', t: 'vel' }, { w: 'Gearmotor', t: 'fue' }, { w: 'Small pulley to big pulley', t: 'fue' }, { w: 'Big pulley to small pulley', t: 'vel' }, { w: 'The small sprocket of the bike', t: 'vel' }, { w: 'The big sprocket for the hill', t: 'fue' }, { w: 'A long lever', t: 'fue' }]
        },
        {
          label: ['Turning', 'Back and forth'], btnA: '🔄 Turning', btnB: '↔️ Back and forth', colA: 'gir', colB: 'vai',
          words: [{ w: 'Wheel', t: 'gir' }, { w: 'Gear', t: 'gir' }, { w: 'Pulley', t: 'gir' }, { w: 'Crank and rod', t: 'vai' }, { w: 'Piston', t: 'vai' }, { w: 'Sewing machine needle', t: 'vai' }, { w: 'Bicycle chain', t: 'gir' }, { w: 'Saw that goes back and forth', t: 'vai' }, { w: 'Motor shaft', t: 'gir' }, { w: 'Windshield wiper', t: 'vai' }]
        },
        {
          label: ['By contact', 'Over a distance'], btnA: '🦷 By contact', btnB: '🪢 Over a distance', colA: 'con', colB: 'dis',
          words: [{ w: 'Gears', t: 'con' }, { w: 'Belt and pulleys', t: 'dis' }, { w: 'Worm gear', t: 'con' }, { w: 'Chain and sprockets', t: 'dis' }, { w: 'Pinion with a rack', t: 'con' }, { w: 'The belt of the mill', t: 'dis' }, { w: 'Pinion with pinion', t: 'con' }, { w: 'Crossed belt', t: 'dis' }]
        }
      ],

      identifyTaskDB: [
        { s: 'The motor turns electrical energy into rotation.', type: 'Motor (actuator)' },
        { s: 'The servomotor turns to an exact angle and stops there.', type: 'Servomotor' },
        { s: 'Two toothed wheels mesh their teeth and turn opposite ways.', type: 'Gears' },
        { s: 'A strip joins two grooved wheels and carries the turning over a distance.', type: 'Pulley and belt' },
        { s: 'A bar resting on a fixed point lifts a heavy stone.', type: 'Lever' },
        { s: 'A threaded worm drives a toothed wheel with a huge amount of force.', type: 'Worm gear' },
        { s: 'The motor’s turning becomes a back-and-forth movement.', type: 'Crank and rod' },
        { s: 'The wheel turns together with its axle and drags the cart along.', type: 'Wheel and axle' },
        { s: 'The bicycle chainring drives the sprocket of the rear wheel.', type: 'Chain and sprockets' },
        { s: 'The middle gear only gets to change the direction of the turning.', type: 'Idler gear' }
      ],

      classifyTaskDB: [
        { w: 'A small gear driving a big one', gen: 'Reduction: less speed, more force', n: 'Opposite directions', g: 'Force', t: 'The coffee pulper' },
        { w: 'A big gear driving a small one', gen: 'Multiplication: more speed, less force', n: 'Opposite directions', g: 'Speed', t: 'The table fan' },
        { w: 'A train of three equal gears', gen: 'It only changes the direction of the turning', n: 'The 1st and the 3rd turn alike', g: 'Neither force nor speed: they stay the same', t: 'The gate winch' },
        { w: 'Pulleys joined by an open belt', gen: 'It transmits the turning over a distance', n: 'Same direction', g: 'It depends on the size of the pulleys', t: 'The belt of the mill' },
        { w: 'Pulleys joined by a crossed belt', gen: 'It transmits the turning and reverses the direction', n: 'Opposite directions', g: 'It depends on the size of the pulleys', t: 'Workshops and old machines' },
        { w: 'A lever with the fulcrum close to the load', gen: 'It multiplies the person’s force', n: 'The bar goes up and down (back and forth)', g: 'Force', t: 'The bricklayer’s wheelbarrow' },
        { w: 'A worm gear with a toothed wheel', gen: 'A very large reduction; it does not slide back on its own', n: 'It turns the axis of rotation by 90°', g: 'Force', t: 'The corn mill' },
        { w: 'Crank and rod', gen: 'It turns rotation into back-and-forth motion', n: 'The crank turns, the rod goes back and forth', g: 'Neither force nor speed: it changes the kind of movement', t: 'The treadle sewing machine' }
      ],

      completeTaskDB: [
        { s: 'The motor turns electricity into ___ movement.', opts: ['turning', 'smelly', 'sound'], ans: 'turning' },
        { s: 'Two gears in contact turn in ___ directions.', opts: ['opposite', 'identical', 'slow'], ans: 'opposite' },
        { s: 'A small pinion that drives a big wheel gives more ___.', opts: ['force', 'speed', 'light'], ans: 'force' },
        { s: 'A big wheel that drives a small pinion gives more ___.', opts: ['speed', 'force', 'weight'], ans: 'speed' },
        { s: 'The lever turns on its ___.', opts: ['fulcrum', 'wooden board', 'color'], ans: 'fulcrum' },
        { s: 'If the belt goes on crossed, the turning is ___.', opts: ['reversed', 'stopped', 'switched off'], ans: 'reversed' },
        { s: 'The ___ gear gives a lot of force and little speed.', opts: ['worm', 'bench', 'wooden'], ans: 'worm' },
        { s: 'The crank and rod turns rotation into ___.', opts: ['back-and-forth motion', 'heat', 'sound'], ans: 'back-and-forth motion' }
      ],

      explainQuestions: [
        { q: 'Explain in your own words what a motor does and why it almost always needs a mechanism.', ans: 'The motor turns electrical energy into rotation, but it turns very fast and with little force. Mechanisms (gears, pulleys, levers) transmit that turning and change it: they are what gets you the force or the speed the job needs.' },
        { q: 'Draw three gears in a row and mark with arrows which way each one turns. Explain the rule.', ans: 'Each pair in contact turns in opposite directions, so the arrows alternate. That is why the first and the third turn the same way; the middle one is the idler gear and it does not change the speed.' },
        { q: 'What changes on a bicycle when you use a big sprocket instead of a small one? When is each one best?', ans: 'With the big sprocket the wheel turns slower but with more force: that is best for climbing hills. With the small sprocket the wheel turns faster but with less force: that is best on flat ground. It is the force-speed trade.' },
        { q: 'Invent a mechanism that solves a problem in your home or your community and explain why you chose it.', ans: 'Open answer. It must name the mechanism (lever, pulley, gears, belt, worm gear or crank and rod), say whether it needs force or speed and explain the trade: whatever it gains in force it loses in speed.' },
        { q: 'Choose 5 machines from your home or your community and say which mechanism each one uses.', ans: 'Open answer. For example: corn mill (worm gear), bicycle (chain and sprockets), wheelbarrow (lever + wheel and axle), well (pulley), sewing machine (crank and rod), coffee pulper (gears).' }
      ],

      sopaSets: [
        _sopa(10, ['MOTOR', 'GEAR', 'PULLEY', 'LEVER', 'TOOTH', 'CHAIN'], 20260726),
        _sopa(10, ['BELT', 'CRANK', 'WORM', 'FORCE', 'WHEEL', 'FULCRUM'], 51920269)
      ],

      evalTFBank: [
        { q: 'The motor turns electrical energy into rotation.', a: true },
        { q: 'Two gears that mesh their teeth turn in the same direction.', a: false },
        { q: 'A small gear that drives a big one gives it more force.', a: true },
        { q: 'A big gear that drives a small one gives it more speed.', a: true },
        { q: 'With mechanisms you gain force and speed at the same time.', a: false },
        { q: 'In a train of three gears, the first and the third turn alike.', a: true },
        { q: 'If the belt between two pulleys is crossed, the turning is reversed.', a: true },
        { q: 'The servomotor turns nonstop and never stops at an exact angle.', a: false },
        { q: 'The lever needs a fulcrum in order to work.', a: true },
        { q: 'The worm gear is used to gain a huge amount of speed.', a: false },
        { q: 'The crank and rod turns rotation into back-and-forth motion.', a: true },
        { q: 'On a bicycle, a small sprocket makes the wheel turn faster.', a: true },
        { q: 'The corn mill takes advantage of a mechanism that gives a lot of force.', a: true },
        { q: 'Pulleys with a belt are used to transmit the turning over a distance.', a: true },
        { q: 'The lever multiplies the force with no drawback at all.', a: false }
      ],

      evalMCBank: [
        { q: 'What does a robot’s motor do?', o: ['a) It stores the program’s information', 'b) It turns electrical energy into rotation', 'c) It senses the light around it', 'd) It cools the battery down'], a: 1 },
        { q: 'Two gears with their teeth meshed: how do they turn?', o: ['a) In the same direction', 'b) One turns and the other stays still', 'c) In opposite directions', 'd) Both of them upward'], a: 2 },
        { q: 'A 10-tooth gear drives a 30-tooth one. What happens to the 30-tooth one?', o: ['a) It turns slower and with more force', 'b) It turns faster and with more force', 'c) It turns faster and with less force', 'd) It does not turn'], a: 0 },
        { q: 'A 40-tooth wheel drives a 10-tooth pinion. What happens to the pinion?', o: ['a) It turns slower', 'b) It turns faster and with less force', 'c) It turns with more force', 'd) It turns just like the wheel'], a: 1 },
        { q: 'In a train of THREE gears, the first and the third one…', o: ['a) Turn in opposite directions', 'b) Turn in the same direction', 'c) Never turn', 'd) Turn twice as fast'], a: 1 },
        { q: 'Which motor turns to an exact angle and stays there?', o: ['a) The DC motor', 'b) The gearmotor', 'c) The servomotor', 'd) The worm gear'], a: 2 },
        { q: 'What is the belt between two pulleys for?', o: ['a) To carry the turning over a distance', 'b) To store energy', 'c) To brake the motor', 'd) To paint the wheel'], a: 0 },
        { q: 'What happens if the belt is put on crossed?', o: ['a) The belt snaps', 'b) The second shaft turns the other way', 'c) Nothing happens', 'd) The pulley gets bigger'], a: 1 },
        { q: 'What does a lever need in order to work?', o: ['a) An electric motor', 'b) A battery', 'c) A belt', 'd) A fulcrum'], a: 3 },
        { q: 'The lever multiplies the force, but in exchange…', o: ['a) The load side travels a shorter distance', 'b) It always breaks', 'c) It needs electricity', 'd) It turns nonstop'], a: 0 },
        { q: 'Which mechanism turns rotation into back-and-forth motion?', o: ['a) The fixed pulley', 'b) The wheel and axle', 'c) The crank and rod', 'd) The idler gear'], a: 2 },
        { q: 'Which mechanism gives a huge amount of force and very little speed?', o: ['a) The worm gear', 'b) The DC motor on its own', 'c) The fixed pulley', 'd) The idler gear'], a: 0 },
        { q: 'On a bicycle, what is best for climbing a steep hill?', o: ['a) The smallest sprocket', 'b) The biggest sprocket', 'c) Taking the chain off', 'd) A bigger chainring'], a: 1 },
        { q: 'What is the trade every mechanism makes?', o: ['a) Whatever you gain in force you lose in speed', 'b) You gain force and speed at the same time', 'c) You lose everything', 'd) The mechanism creates brand-new energy'], a: 0 },
        { q: 'Which Honduran machine uses a crank and gears to take the husk off the coffee?', o: ['a) The corn mill', 'b) The coffee pulper', 'c) The wheelbarrow', 'd) The gate winch'], a: 1 }
      ],

      evalCPBank: [
        { q: 'The motor turns electrical energy into ___ movement.', a: 'turning' },
        { q: 'The motor is the robot’s ___: the part that carries out the movement.', a: 'actuator' },
        { q: 'The ___ turns to an exact angle and stays there.', a: 'servomotor' },
        { q: 'Two gears in contact turn in ___ directions.', a: 'opposite' },
        { q: 'Each point sticking out of a gear is called a ___.', a: 'tooth' },
        { q: 'If a small gear drives a big one, you gain ___.', a: 'force' },
        { q: 'If a big gear drives a small one, you gain ___.', a: 'speed' },
        { q: 'The belt joins two ___ and transmits the turning over a distance.', a: 'pulleys' },
        { q: 'If the belt is put on ___, the turning is reversed.', a: 'crossed' },
        { q: 'The lever is a bar that turns on its ___.', a: 'fulcrum' },
        { q: 'The ___ gear gives a lot of force and very little speed.', a: 'worm' },
        { q: 'The crank-and-rod mechanism turns rotation into ___.', a: 'back-and-forth motion' },
        { q: 'On a bicycle, the ___ carries the turning from the chainring to the sprocket.', a: 'chain' },
        { q: 'Out of three gears in a row, the first and the third turn in the same ___.', a: 'direction' },
        { q: 'The lever multiplies the force, but it travels a shorter ___.', a: 'distance' }
      ],

      evalPRBank: [
        { term: 'Motor', def: 'It turns electrical energy into rotation' },
        { term: 'Servomotor', def: 'A motor that turns to an exact angle and stops there' },
        { term: 'Gearmotor', def: 'A motor with a gearbox: less speed, more force' },
        { term: 'Gear', def: 'A toothed wheel; two in contact turn opposite ways' },
        { term: 'Tooth', def: 'Each point of the gear that meshes into the other one' },
        { term: 'Idler gear', def: 'The middle one: it only changes the direction of the turning' },
        { term: 'Pulley', def: 'A grooved wheel for the rope or the belt to run through' },
        { term: 'Belt', def: 'A strip that joins two pulleys and carries the turning over a distance' },
        { term: 'Crossed belt', def: 'A setup that reverses the direction of the turning' },
        { term: 'Lever', def: 'A rigid bar that multiplies the force' },
        { term: 'Fulcrum', def: 'The fixed point the lever turns on' },
        { term: 'Wheel and axle', def: 'The wheel turns with the axle and drags the load along' },
        { term: 'Worm gear', def: 'A threaded worm: a huge amount of force, little speed' },
        { term: 'Crank and rod', def: 'It turns rotation into back-and-forth motion' },
        { term: 'Chain and sprockets', def: 'They carry the turning from the chainring to the bicycle sprocket' }
      ],

      critMecBank: [
        { txt: 'At school a bucket of water has to be raised from the well, but the children cannot pull the rope upward.', ans: 'A fixed PULLEY on the well: it changes the direction of the force and lets you pull downward, which is far easier; with a movable pulley you also need less force.' },
        { txt: 'A small motor has to open a very heavy gate, and the gate must not slide back on its own.', ans: 'A WORM GEAR (or a reduction gearbox): it brings the speed right down and multiplies the force; on top of that, a worm gear does not let the load drive it backward.' },
        { txt: 'The motor’s turning has to reach a shaft half a meter away, without the parts touching each other.', ans: 'PULLEYS AND A BELT (or chain and sprockets): they transmit the turning over a distance. If the belt is put on crossed, the second shaft also turns the other way.' },
        { txt: 'A robot has to move a sign from one side to the other, over and over, with the motor always turning the same way.', ans: 'A CRANK AND ROD: it turns the motor’s rotation into back-and-forth motion, like the needle of the sewing machine.' },
        { txt: 'A big stone has to be lifted in the yard and all you have is an iron bar and a block.', ans: 'A LEVER: the bar resting on the block (the fulcrum) close to the stone multiplies the force; in exchange, the end you push travels a longer distance.' },
        { txt: 'The robot car goes incredibly fast, but it gets stuck when it climbs a ramp with a book on top.', ans: 'REDUCTION GEARS (a small pinion driving a big toothed wheel) or a gearmotor: it loses speed, but it gains the force it needs to climb.' }
      ],

      critErrorBank: [
        {
          txt: '"With gears you gain force and speed at the same time."',
          g1: 'False: the mechanism does not create energy, it only shares it out. Whatever you gain in force you lose in speed.',
          g2: 'If the big wheel turns slower, that is exactly because it is delivering more force: you never win everything.'
        },
        {
          txt: '"Two gears that mesh always turn the same way."',
          g1: 'It is the other way round: two gears in contact turn in OPPOSITE DIRECTIONS, because the teeth push each other.',
          g2: 'To get the first and the last one turning alike you need THREE gears; the middle one is the idler gear.'
        },
        {
          txt: '"The motor on its own, with no mechanism at all, is good for lifting heavy things."',
          g1: 'A DC motor turns very fast but with very little force: on its own it hardly lifts anything.',
          g2: 'It needs a reduction (gears or a worm gear) that trades speed for force: that is what a gearmotor is.'
        },
        {
          txt: '"On a bicycle, the biggest sprocket is the one for going faster."',
          g1: 'It is the opposite: with the big sprocket the wheel turns slower, but with more force (that is for climbing hills).',
          g2: 'To go faster on flat ground you use the small sprocket: more speed, less force.'
        },
        {
          txt: '"The lever makes force appear out of nowhere."',
          g1: 'The lever multiplies the force, but in exchange the end you push travels a LONGER distance than the load.',
          g2: 'And with no fulcrum there is no lever: the bar needs a fixed point to turn on.'
        }
      ],

      critTrenQuestions: [
        '1. Which way does the last gear turn? Explain why.',
        '2. Does it turn faster or with more force than the first one? Explain why, using the teeth.',
        '3. What would you change in the setup to get the opposite effect?'
      ],

      critTrenBank: [
        {
          txt: 'A motor drives a 10-tooth pinion and that pinion drives a 30-tooth wheel. The first one turns to the RIGHT (clockwise).',
          p: 'The 30-tooth wheel turns to the LEFT (counterclockwise): two gears in contact always turn in opposite directions.',
          d: 'It turns 3 times slower, but with 3 times more force (30 ÷ 10 = 3): the small one driving the big one gives force.',
          a: 'To gain speed you would have to swap them around: let the 30-tooth wheel be the one driving the 10-tooth pinion.'
        },
        {
          txt: 'A 40-tooth wheel drives a 10-tooth pinion. The big wheel turns to the LEFT.',
          p: 'The pinion turns to the RIGHT: at every contact the direction is reversed.',
          d: 'It turns 4 times faster, but with 4 times less force (40 ÷ 10 = 4): the big one driving the small one gives speed.',
          a: 'If force were needed (to lift weight, for instance), I would put the small pinion driving the big wheel.'
        },
        {
          txt: 'Three gears in a row: 20, 12 and 20 teeth. The first one turns to the RIGHT.',
          p: 'The third one also turns to the RIGHT: with three gears, the first and the third turn in the same direction.',
          d: 'It turns at the SAME speed and with the same force: the middle one is an idler gear and does not change the ratio, because the first and the last have the same number of teeth.',
          a: 'To gain force you would have to swap the last one for a gear with more teeth than the first (or take the idler out to reverse the direction).'
        },
        {
          txt: 'The motor drives a 10-tooth pinion, that one drives a 20-tooth gear and the last one has 40 teeth. The motor turns to the LEFT.',
          p: 'The last one also turns to the LEFT: since there are three gears, the first and the third turn alike.',
          d: 'It turns 4 times slower and with 4 times more force (40 ÷ 10 = 4): only the first and the last count; the middle one does not change the ratio.',
          a: 'To gain speed you would have to finish with a gear that has fewer teeth than the first one.'
        },
        {
          txt: 'A small pulley mounted on the motor drives a big pulley through an open belt (not crossed).',
          p: 'The big pulley turns in the SAME direction: an open belt does not reverse the turning; it is only reversed if the belt is crossed.',
          d: 'It turns slower but with more force: the big pulley makes fewer turns than the small one in the same time.',
          a: 'To reverse the direction it would be enough to cross the belt; to gain speed, make the big pulley the driving one.'
        }
      ],

      critCompareBank: [
        {
          a: 'Two toothed wheels whose teeth mesh and push each other directly.',
          b: 'Two grooved wheels joined by a strip that runs all the way around both of them.',
          ga: 'Gears.',
          gb: 'Pulleys with a belt.',
          gr: 'Similarity: both transmit the turning from one shaft to another and both can trade speed for force. Difference: gears work pressed together, they reverse the direction and they do not slip; pulleys with a belt transmit over a distance, they keep the direction (unless the belt is crossed) and they can slip.'
        },
        {
          a: 'A 10-tooth pinion drives a 40-tooth wheel.',
          b: 'A 40-tooth wheel drives a 10-tooth pinion.',
          ga: 'A reduction: you gain force.',
          gb: 'A multiplication: you gain speed.',
          gr: 'Similarity: in both cases the wheels turn in opposite directions and the ratio is 1 to 4. Difference: the first setup gives 4 times more force and 4 times less speed; the second one, exactly the other way round.'
        },
        {
          a: 'A motor that turns nonstop as long as current reaches it.',
          b: 'A motor that turns to an exact angle and stays there.',
          ga: 'The DC motor.',
          gb: 'The servomotor.',
          gr: 'Similarity: both are actuators and both turn electricity into movement. Difference: the DC motor is for wheels and propellers (continuous turning); the servomotor is for arms, grippers and rudders, because it controls the exact position.'
        },
        {
          a: 'A rigid bar resting on a fixed point that multiplies a person’s force.',
          b: 'A mechanism that turns the motor’s rotation into a back-and-forth movement.',
          ga: 'The lever.',
          gb: 'The crank and rod.',
          gr: 'Similarity: both are mechanisms that change the shape of the movement and both can be built with cardboard and materials from around you. Difference: the lever multiplies the force in a short swing; the crank and rod turns continuous rotation into back-and-forth motion, like the treadle sewing machine.'
        }
      ],

      critDesignBank: [
        'In your community sacks of coffee have to be lifted onto the cart and people are hurting their backs.',
        'The school gate is so heavy that the children cannot open it by themselves.',
        'The corn mill at home is terribly hard to turn: you have to push far too hard on the crank.',
        'A robot for the school fair has to move a sign from one side to the other, nonstop, with a single motor.',
        'The class robot car goes incredibly fast, but it gets stuck when it carries a book on top.'
      ],

      critDesignGuide: 'Rubric with 3 criteria (20 pts total) — ① MECHANISM (7 pts): choose and name a mechanism that suits the problem (lever, pulley, gears, belt, worm gear, wheel and axle or crank and rod). ② RATIO (6 pts): explain whether it needs FORCE or SPEED and how it gets it (which wheel or bar is the big one and which is the small one, where the fulcrum goes). ③ JUSTIFICATION (7 pts): recognize the trade (whatever you gain in force you lose in speed) and propose a realistic solution with materials from around you. Any design counts as long as the mechanism solves the problem and the student explains why.',

      gearCases: [
        { ctx: 'The robot’s motor drives a 10-tooth pinion that drags a 30-tooth wheel along.', gears: [10, 30], dirFirst: 1, keyDir: -1, keyRel: 'fuerza', uso: 'This is how a gearmotor is put together: the robot loses speed, but it gains the force it needs to climb the ramp.' },
        { ctx: 'In the coffee pulper, the big 40-tooth wheel drives a 10-tooth pinion.', gears: [40, 10], dirFirst: 1, keyDir: -1, keyRel: 'velocidad', uso: 'This is used when something has to turn fast, even if it is with less force.' },
        { ctx: 'Three equal 20-tooth gears in a row: the middle one is an idler gear.', gears: [20, 20, 20], dirFirst: -1, keyDir: -1, keyRel: 'igual', uso: 'The idler gear is only there so the first and the last one turn in the same direction.' },
        { ctx: 'The motor drives a 10-tooth pinion, that one drives a 20-tooth gear and the last one has 40 teeth.', gears: [10, 20, 40], dirFirst: 1, keyDir: 1, keyRel: 'fuerza', uso: 'Only the first and the last one count: the middle one changes the direction, not the ratio.' },
        { ctx: 'The gate winch carries two gears of the same size, 24 teeth each.', gears: [24, 24], dirFirst: -1, keyDir: 1, keyRel: 'igual', uso: 'When the two are equal, only the direction of the turning changes: neither force nor speed.' },
        { ctx: 'The bicycle chainring (36 teeth) drives a 12-tooth idler gear and that one drives the 12-tooth sprocket.', gears: [36, 12, 12], dirFirst: 1, keyDir: 1, keyRel: 'velocidad', uso: 'The wheel turns much faster than the pedal: perfect for flat roads.' }
      ],

      GEAR_DIR_OPTS: [
        { v: 1, txt: '↻ To the right (clockwise)' },
        { v: -1, txt: '↺ To the left (counterclockwise)' }
      ],

      GEAR_REL_OPTS: [
        { v: 'velocidad', txt: '⚡ Faster, with less force' },
        { v: 'fuerza', txt: '💪 Slower, with more force' },
        { v: 'igual', txt: '➡️ Same speed and same force' }
      ]
    },

    /* ══════════════════════════════════════════════════════
       3. FRASES EXACTAS (pantalla y pruebas imprimibles)
       ══════════════════════════════════════════════════════ */
    frases: {
      /* — mensaje de WhatsApp: lo propio de esta misión —
         (lo común a todas las misiones vive en js/metas-i18n.js) */
      '_Se te hará prueba escrita y serás excelente estudiante en Robótica: motores, engranajes, poleas y palancas._ ⚙️':
        '_You will take a written test and become an excellent Robotics student: motors, gears, pulleys and levers._ ⚙️',
      /* — pestañas propias de esta misión — */
      'Mecanismos': 'Mechanisms', 'Engranajes': 'Gears',
      /* — laboratorio del tren de engranajes — */
      'MOTOR': 'MOTOR', 'SALIDA': 'OUTPUT', 'LOCO': 'IDLER',
      '⏸️ Pausar el giro': '⏸️ Pause the spin', '▶️ Reanudar el giro': '▶️ Resume the spin',
      '▶ Siguiente caso': '▶ Next case',
      '⚙️ Caso 1: el motor mueve el engranaje azul': '⚙️ Case 1: the motor drives the blue gear',
      /* — mini-quiz de la sección Mecanismos — */
      '¡Correcto! Piensas como todo un ingeniero de mecanismos.': 'Correct! You are thinking like a real mechanism engineer.',
      'Casi. Pregúntate siempre: ¿gana fuerza o gana velocidad?, ¿en qué sentido gira?':
        'Almost. Always ask yourself: does it gain force or does it gain speed? and which way does it turn?',
      /* — flashcards y memorama — */
      '🧠 Memorama de los Mecanismos': '🧠 Mechanism Memory Game',
      /* — clasifica — */
      '💡 Consejo: ¡Usa el botón "Variar grupo" varias veces! Practicar con diferentes categorías te ayudará a dominar el tema.':
        '💡 Tip: use the "Change group" button several times! Practicing with different categories helps you master the topic.',
      /* — widgets — */
      '🔗 Cadena de transmisión: ordena el movimiento': '🔗 Transmission chain: put the movement in order',
      'para ordenar el camino que sigue el movimiento, desde la energía hasta el trabajo final:':
        'arrows to put the path the movement follows in order, from the energy to the final work:',
      'Hay pasos fuera de orden. Recuerda: energía → motor → mecanismo → trabajo final.':
        'Some steps are out of order. Remember: energy → motor → mechanism → final work.',
      '🧰 ¿Qué mecanismo necesita?': '🧰 Which mechanism does it need?',
      'Lee la situación y elige el mecanismo adecuado:': 'Read the situation and choose the right mechanism:',
      '🎉 ¡Eres todo un técnico de mecanismos!': '🎉 You are a true mechanism technician!',
      '🔗 Empareja: Mecanismo → Función': '🔗 Match: Mechanism → Function',
      '¿Cuál es la función de este mecanismo?': 'What does this mechanism do?',
      'Engranaje': 'Gear',
      '💪⚡ ¿Gana fuerza o gana velocidad?': '💪⚡ Does it gain force or speed?',
      'Recuerda: lo que se gana en fuerza se pierde en velocidad. Decide:':
        'Remember: whatever you gain in force you lose in speed. Decide:',
      'Un piñón pequeño mueve una rueda grande': 'A small pinion drives a big wheel',
      /* — reto — */
      '💪 Más fuerza': '💪 More force', '⚡ Más velocidad': '⚡ More speed',
      /* — generador de tareas — */
      '🗂️ Analizar mecanismos': '🗂️ Analyze mechanisms',
      'Copia en tu cuaderno; subraya, colorea o encierra el mecanismo indicado en cada oración. Escribe al lado cómo se llama.':
        'Copy this in your notebook; underline, color or circle the mechanism in each sentence. Next to it, write what it is called.',
      'Una barra apoyada en un punto fijo levanta una piedra. →': 'A bar resting on a fixed point lifts a stone. →',
      'Palanca': 'Lever',
      'Copia la siguiente tabla en tu cuaderno. Para cada montaje responde: ¿qué hace?, ¿en qué sentido gira?, ¿gana fuerza o velocidad? y escribe un ejemplo real.':
        'Copy the table below in your notebook. For each setup answer: what does it do? which way does it turn? does it gain force or speed? and write a real example.',
      'Montaje o mecanismo': 'Setup or mechanism', '¿Qué hace?': 'What does it do?',
      '¿Sentido del giro?': 'Direction of rotation?', '¿Fuerza o velocidad?': 'Force or speed?',
      'Ejemplo real': 'Real example',
      /* — evaluación conceptual: pantalla e impresión — */
      'Evaluación Final · Motores y Mecanismos · Educación Básica · Robótica': 'Final Test · Motors and Mechanisms · Basic Education · Robotics',
      'Evaluación Competencial · Pensamiento Crítico · Motores y Mecanismos · Educación Básica': 'Competency Test · Critical Thinking · Motors and Mechanisms · Basic Education',
      /* la versión impresa añade la materia al final */
      'Evaluación Competencial · Pensamiento Crítico · Motores y Mecanismos · Educación Básica · Robótica': 'Competency Test · Critical Thinking · Motors and Mechanisms · Basic Education · Robotics',
      '🎓 Evaluación Final — Motores y Mecanismos': '🎓 Final Test — Motors and Mechanisms',
      '🧠 Prueba de Pensamiento Crítico — Motores y Mecanismos': '🧠 Critical Thinking Test — Motors and Mechanisms',
      '✅ PAUTA — Evaluación Final · Motores y Mecanismos': '✅ ANSWER KEY — Final Test · Motors and Mechanisms',
      '✅ PAUTA — Pensamiento Crítico · Motores y Mecanismos': '✅ ANSWER KEY — Critical Thinking · Motors and Mechanisms',
      /* — pensamiento crítico: títulos y consignas propias — */
      'I. ¿Qué mecanismo necesita?': 'I. Which mechanism does it need?',
      'III. Analiza el mecanismo': 'III. Analyze the mechanism',
      'V. Diseña y justifica tu mecanismo': 'V. Design and justify your mechanism',
      'V. Diseña tu mecanismo — Rúbrica': 'V. Design your mechanism — Rubric',
      '¿Qué mecanismo necesita esta situación? Justifica tu elección: ¿hace falta FUERZA o VELOCIDAD, y por qué?':
        'Which mechanism does this situation need? Justify your choice: is FORCE or SPEED needed, and why?',
      '¿Qué mecanismo necesita esta situación? Justifica tu elección.':
        'Which mechanism does this situation need? Justify your choice.',
      '. Corrígelos con argumentos, usando lo que sabes del sentido de giro y del intercambio fuerza-velocidad:':
        '. Correct them with arguments, using what you know about the direction of rotation and the force-speed trade:',
      'Esta afirmación tiene dos errores. Corrígelos con argumentos, usando el sentido de giro y la relación fuerza-velocidad:':
        'This statement contains two mistakes. Correct them with arguments, using the direction of rotation and the force-speed ratio:',
      'Inventa un mecanismo que resuelva este problema: dibújalo, nómbralo (palanca, polea, engranajes, correa, tornillo sin fin o biela-manivela), di si necesitas FUERZA o VELOCIDAD y explica cómo la consigues. Señala el punto de apoyo o cuál rueda es la grande.':
        'Invent a mechanism that solves this problem: draw it, name it (lever, pulley, gears, belt, worm gear or crank and rod), say whether you need FORCE or SPEED and explain how you get it. Point out the fulcrum or which wheel is the big one.',
      'Inventa un mecanismo que resuelva este problema: nómbralo, di si necesitas FUERZA o VELOCIDAD y explica cómo la consigues (cuál rueda es la grande, dónde va el punto de apoyo). Dibújalo al reverso de la hoja.':
        'Invent a mechanism that solves this problem: name it, say whether you need FORCE or SPEED and explain how you get it (which wheel is the big one, where the fulcrum goes). Draw it on the back of the sheet.',
      '1. Sentido de giro:': '1. Direction of rotation:',
      '2. Velocidad y fuerza:': '2. Speed and force:',
      '3. Qué cambiar:': '3. What to change:',
      /* — constancia — */
      'Misión Motores y Mecanismos': 'Mission · Motors and Mechanisms',
      '¡Sigue aprendiendo!': 'Keep learning!',
      '¡Muy buen trabajo!': 'Great work!',
      '¡Vas muy bien!': 'You are doing very well!',
      '¡Dominas los mecanismos!': 'You have mastered the mechanisms!',
      '¡Maestro del Movimiento!': 'Master of Movement!',
      /* — etiquetas de accesibilidad (viven en aria-label y title) — */
      'Barra de progreso XP': 'XP progress bar',
      'Compartir misión por WhatsApp': 'Share this mission on WhatsApp',
      'Tarjeta de estudio. Presiona Enter para voltear': 'Study card. Press Enter to flip',
      'Opciones': 'Options',
      'Ir a la siguiente sección': 'Go to the next section',
      'Secciones de la misión': 'Mission sections',
      'Logros desbloqueados': 'Achievements unlocked',
      'Tipo de evaluación': 'Type of test',
      'Error 1 y su corrección': 'Mistake 1 and its correction',
      'Error 2 y su corrección': 'Mistake 2 and its correction',
      'Comparación razonada de los casos A y B': 'Reasoned comparison of cases A and B',
      'Diseño y justificación del mecanismo': 'Mechanism design and justification'
    },

    /* ══════════════════════════════════════════════════════
       4. FRAGMENTOS (textos con números o nombres variables)
       Los comunes a todas las misiones ya viven en el motor:
       aquí solo van los del laboratorio y los que nombran
       «Motores y Mecanismos».
       ══════════════════════════════════════════════════════ */
    fragmentos: [
      /* — WhatsApp: el título de la misión en la constancia — */
      [/¡(.+?) completó la Misión "Motores y Mecanismos"!/g, '$1 completed the mission “Motors and Mechanisms”!'],
      /* — laboratorio: rótulos y datos del tren de engranajes — */
      [/🦷 Dientes: /g, '🦷 Teeth: '],
      [/🎬 El primero gira /g, '🎬 The first one turns '],
      [/⚖️ Relación (\d+) : (\d+)/g, '⚖️ Ratio $1 : $2'],
      /* la etiqueta del SVG nombra todos los dientes de golpe: va antes que la suelta */
      [/Tren de (\d+) engranajes de (.+?) dientes/g, 'A train of $1 gears with $2 teeth'],
      [/(\d+) dientes/g, '$1 teeth'],
      /* la retroalimentación se arma en una sola frase: primero los trozos largos */
      ['. Recuerda las dos reglas: cada contacto invierte el sentido y solo cuentan los dientes del primero y del último.',
        '. Remember the two rules: every contact reverses the direction, and only the teeth of the first and the last one count.'],
      [/💪 (\d+) veces más lento, pero con (\d+) veces más fuerza/g, '💪 $1 times slower, but with $2 times more force'],
      [/⚡ (\d+) veces más rápido, pero con (\d+) veces menos fuerza/g, '⚡ $1 times faster, but with $2 times less force'],
      ['➡️ a la misma velocidad y con la misma fuerza', '➡️ at the same speed and with the same force'],
      ['↻ a la derecha (horario)', '↻ clockwise (to the right)'],
      ['↺ a la izquierda (antihorario)', '↺ counterclockwise (to the left)'],
      [/^¡Correcto! El último engranaje gira /, 'Correct! The last gear turns '],
      [/^Revisa: el último gira /, 'Check again: the last one turns '],
      [/ y (💪|⚡|➡️)/g, ' and $1'],
      /* — widgets: la corrección que explica la regla va antes que la genérica — */
      [/^Correcto: (.+)\. Recuerda: la rueda GRANDE siempre gira más lento y con más fuerza\./,
        'Correct: $1. Remember: the BIG wheel always turns slower and with more force.'],
      [/^Correcto: /, 'Correct: '],
      /* — generador de tareas: la fila de respuestas de la tabla — */
      [/¿Qué hace\?: /g, 'What does it do?: '],
      [/ \| ¿Sentido\?: /g, ' | Direction?: '],
      [/ \| ¿Fuerza o velocidad\?: /g, ' | Force or speed?: '],
      [/ \| Ejemplo: /g, ' | Example: '],
      /* — títulos con número de forma: van antes que la regla suelta «Forma N» — */
      [/🎓 Evaluación Final · Forma (\d+) · Motores y Mecanismos/g, '🎓 Final Test · Form $1 · Motors and Mechanisms'],
      [/🧠 Pensamiento Crítico · Forma (\d+) · Motores y Mecanismos/g, '🧠 Critical Thinking · Form $1 · Motors and Mechanisms'],
      [/Evaluación Motores y Mecanismos/g, 'Test · Motors and Mechanisms'],
      [/Pensamiento Crítico Motores y Mecanismos/g, 'Critical Thinking · Motors and Mechanisms'],
      /* — etiquetas de accesibilidad con número — */
      [/Respuesta pareada (\d+)/g, 'Matching answer $1'],
      [/Mecanismo del caso (\d+) y su justificación/g, 'Mechanism for case $1 and its justification'],
      [/Elegir número de forma exacta \(1 a (\d+)\)/g, 'Choose the exact form number (1 to $1)']
    ],

    /* ══════════════════════════════════════════════════════
       5. TEXTOS QUE VIVEN EN EL CSS (content: '…')
       ══════════════════════════════════════════════════════ */
    css: [
      'body[data-idioma="en"] .hero::before{content:\'ROBOT · SENSOR · CONTROLLER · ACTUATOR · PROGRAM · SENSE · THINK · ACT · MOTOR · DRONE · ROBOTIC ARM · ENERGY · BATTERY · HUMANOID · CYCLE\';}',
      'body[data-idioma="en"] .eval-answer::before{content:\'✓ Answer: \';}',
      'body[data-idioma="en"] .crit-pauta::before{content:\'📋 Answer key: \';}'
    ].join('\n')
  };
})();
