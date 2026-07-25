/* ============================================================
   Misión «¿Qué es un Robot?» — versión en inglés
   ------------------------------------------------------------
   Traducción de autor (no automática) para escuelas bilingües.
   Se carga junto a la misión y el motor js/metas-i18n.js la
   activa con el botón 🇺🇸 English de la barra superior.

   Criterio de traducción:
   · Vocabulario técnico estándar de robótica escolar:
     sense → think → act · sensors · controller · actuators.
   · Lo cultural se explica, no se calca: «maquila» se traduce
     como garment factory (maquila), «pulpería» como corner store.
   · Se conserva el tuteo cercano del original con el «you» directo
     y el mismo tono de juego.

   Estructura: html (bloques) · data (bancos) · frases y
   fragmentos (textos que el JS arma al vuelo, incluidas las
   pruebas imprimibles y su pauta).
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

    titulo: 'Mission What Is a Robot? | policastsapien.com',

    /* Cinta decorativa del encabezado: vive en content: '…' del CSS */
    css: 'body[data-idioma="en"] .hero::before{content:"ROBOT · SENSOR · CONTROLLER · ACTUATOR · ' +
      'PROGRAM · SENSE · THINK · ACT · MOTOR · DRONE · ROBOTIC ARM · POWER · BATTERY · HUMANOID · CYCLE";}',

    /* ══════════════════════════════════════════════════════
       1. BLOQUES DE CONTENIDO (data-i18n en el HTML)
       ══════════════════════════════════════════════════════ */
    html: {

      hero:
        '<h1>Mission <span>What Is a Robot?</span></h1>' +
        '<p class="sub">Discover the sense → think → act cycle and the 3 parts every robot has. No cables and no computer needed! 📡🧠💪</p>' +
        '<div class="badge">🤖 Robot Path · Stage 1 of 6 · Robotics</div>',

      a1:
        '<h2>🤖 What is a robot?</h2>' +
        '<p>A <strong>robot</strong> is a machine that <strong>SENSES</strong> its surroundings with <strong>sensors</strong>, ' +
        '<strong>THINKS</strong> about what to do with its <strong>controller</strong> (following a <strong>program</strong>) and ' +
        '<strong>ACTS</strong> with its <strong>actuators</strong> (motors, wheels, arms). That is the famous ' +
        '<strong>robot cycle</strong>: sense → think → act, over and over again.</p>' +
        '<div class="type-grid">' +
        '<div class="type-chip tc-teal"><div class="t-art">👀 It senses</div><div class="t-info">Its sensors pick up light, sound, distance, touch or temperature</div></div>' +
        '<div class="type-chip tc-gold"><div class="t-art">🧠 It thinks</div><div class="t-info">Its controller chooses what to do according to the program</div></div>' +
        '<div class="type-chip tc-amber"><div class="t-art">⚙️ It acts</div><div class="t-info">Its motors, wheels and arms carry out the action</div></div>' +
        '<div class="type-chip tc-jade"><div class="t-art">🔁 It repeats</div><div class="t-info">The cycle runs again many times per second</div></div>' +
        '</div>' +
        '<div class="tip"><span class="ti">💡</span>' +
        '<div><strong>Think of it this way:</strong> a <b>hammer</b> neither senses nor decides (simple machine); a <b>blender</b> acts but does not decide (home appliance); a <b>robot vacuum</b> does all three: now <em>that</em> is a robot!</div>' +
        '</div>',

      a2:
        '<h2>🧩 The robot’s 3 parts and your own body</h2>' +
        '<p>Every robot has three parts that work as a team, just like your body when you dodge a ball ' +
        '(<strong>receptor → brain → effector</strong>, as you learned in the Body Path):</p>' +
        '<div class="type-grid">' +
        '<div class="type-chip tc-teal"><div class="t-art">📡 Sensors</div><div class="t-info">They are the SENSES: like your eyes, ears and skin</div></div>' +
        '<div class="type-chip tc-gold"><div class="t-art">🧠 Controller</div><div class="t-info">It is the BRAIN: it receives the information and decides</div></div>' +
        '<div class="type-chip tc-amber"><div class="t-art">💪 Actuators</div><div class="t-info">They are the MUSCLES: motors and wheels that move</div></div>' +
        '<div class="type-chip tc-jade"><div class="t-art">🔋 Power</div><div class="t-info">It is the FOOD: the battery that brings everything to life</div></div>' +
        '</div>' +
        '<div class="tip"><span class="ti">🔤</span>' +
        '<div><strong>Remember:</strong> sensors = senses · controller = brain · actuators = muscles. With that comparison you will never forget it!</div>' +
        '</div>',

      a3:
        '<h2>🇭🇳 Robots in real life and in Honduras</h2>' +
        '<p>Robots already work close to you, even if they do not look like «movie robots»:</p>' +
        '<div class="vs-grid">' +
        '<div class="vs-box vs-a"><h4>🏭 Factories and farming</h4>' +
        '<p>In the <strong>maquilas</strong> (garment factories), robotic arms <strong>sew and cut</strong> fabric by following their program. Out in the countryside, <strong>drones</strong> inspect the <strong>coffee fields</strong> from the air and spot diseased areas.</p></div>' +
        '<div class="vs-box vs-b"><h4>🏥 Medicine and home</h4>' +
        '<p>Hospitals use <strong>robot-assisted surgery</strong> with great precision. At home, the <strong>robot vacuum</strong> cleans on its own: it detects obstacles and chooses its route.</p></div>' +
        '</div>' +
        '<div class="tip"><span class="ti">⚠️</span>' +
        '<div><strong>Myth vs reality:</strong> robots <b>do not «think» like people</b>: they follow the instructions in their <b>program</b>, written by people. With no program, a robot does not know what to do.</div>' +
        '</div>',

      e1:
        '<h2>⚖️ Robot vs simple machine vs home appliance</h2>' +
        '<p>The key question is always the same: <strong>does it sense? does it decide? does it act?</strong></p>' +
        '<div style="overflow-x:auto;">' +
        '<table style="width:100%;border-collapse:collapse;font-size:0.82rem;min-width:480px;">' +
        '<thead><tr style="background:var(--pri-gl);">' +
        '<th style="padding:0.4rem 0.5rem;border:1px solid var(--border);text-align:left;">Machine</th>' +
        '<th style="padding:0.4rem 0.5rem;border:1px solid var(--border);">👀 Senses?</th>' +
        '<th style="padding:0.4rem 0.5rem;border:1px solid var(--border);">🧠 Decides?</th>' +
        '<th style="padding:0.4rem 0.5rem;border:1px solid var(--border);">⚙️ Acts?</th>' +
        '<th style="padding:0.4rem 0.5rem;border:1px solid var(--border);">Verdict</th>' +
        '</tr></thead><tbody>' +
        '<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:700;">🔨 Hammer</td><td style="padding:0.4rem;border:1px solid var(--border);text-align:center;">❌</td><td style="padding:0.4rem;border:1px solid var(--border);text-align:center;">❌</td><td style="padding:0.4rem;border:1px solid var(--border);text-align:center;">❌ (you move it)</td><td style="padding:0.4rem;border:1px solid var(--border);font-weight:600;">Simple machine</td></tr>' +
        '<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:700;">🥤 Blender</td><td style="padding:0.4rem;border:1px solid var(--border);text-align:center;">❌</td><td style="padding:0.4rem;border:1px solid var(--border);text-align:center;">❌</td><td style="padding:0.4rem;border:1px solid var(--border);text-align:center;">✅</td><td style="padding:0.4rem;border:1px solid var(--border);font-weight:600;">Home appliance</td></tr>' +
        '<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:700;">🤖 Robot vacuum</td><td style="padding:0.4rem;border:1px solid var(--border);text-align:center;">✅</td><td style="padding:0.4rem;border:1px solid var(--border);text-align:center;">✅</td><td style="padding:0.4rem;border:1px solid var(--border);text-align:center;">✅</td><td style="padding:0.4rem;border:1px solid var(--border);font-weight:600;">A ROBOT!</td></tr>' +
        '</tbody></table></div>' +
        '<div class="tip"><span class="ti">🎯</span>' +
        '<div><strong>Golden rule:</strong> a machine is a robot only when it does <b>all three</b>: sense, think and act.</div>' +
        '</div>',

      e2:
        '<h2>⚡ Lightning mini-quiz</h2>' +
        '<p style="font-size:0.9rem;margin-bottom:0.5rem;">1) An <strong>iron</strong> heats your clothes when you plug it in. What is it?</p>' +
        '<div class="cmp-opts" role="group" style="margin-bottom:0.4rem;">' +
        '<button class="cmp-opt" onclick="miniQ(this,false,\'fbMq1\')">A robot</button>' +
        '<button class="cmp-opt" onclick="miniQ(this,true,\'fbMq1\')">A home appliance</button>' +
        '<button class="cmp-opt" onclick="miniQ(this,false,\'fbMq1\')">A simple machine</button>' +
        '</div><div id="fbMq1" class="fb" role="alert"></div>' +
        '<p style="font-size:0.9rem;margin:0.9rem 0 0.5rem;">2) A <strong>door that opens by itself</strong> when you walk up to it. What is it?</p>' +
        '<div class="cmp-opts" role="group" style="margin-bottom:0.4rem;">' +
        '<button class="cmp-opt" onclick="miniQ(this,true,\'fbMq2\')">A simple robot: it senses, thinks and acts</button>' +
        '<button class="cmp-opt" onclick="miniQ(this,false,\'fbMq2\')">A simple machine</button>' +
        '<button class="cmp-opt" onclick="miniQ(this,false,\'fbMq2\')">Magic</button>' +
        '</div><div id="fbMq2" class="fb" role="alert"></div>',

      e3:
        '<h2>🗺️ Types of robots</h2>' +
        '<p>Robots come in many shapes; what matters is that all of them complete the cycle:</p>' +
        '<div class="type-grid">' +
        '<div class="type-chip tc-teal"><div class="t-art">🏭 Industrial</div><div class="t-info">A fixed arm that welds, cuts or sews (garment factory)</div></div>' +
        '<div class="type-chip tc-gold"><div class="t-art">🛞 Mobile</div><div class="t-info">It moves on wheels: robot vacuum, line-following car</div></div>' +
        '<div class="type-chip tc-amber"><div class="t-art">🚁 Drone</div><div class="t-info">It flies with propellers: it inspects coffee fields</div></div>' +
        '<div class="type-chip tc-purple"><div class="t-art">🦿 Humanoid</div><div class="t-info">Shaped like a person: it walks and moves its arms</div></div>' +
        '<div class="type-chip tc-jade"><div class="t-art">🦾 Robotic arm</div><div class="t-info">It assists in high-precision surgery</div></div>' +
        '</div>' +
        '<div class="tip"><span class="ti">✏️</span>' +
        '<div><strong>Unplugged robotics:</strong> in this mission you learn robotics <b>with no computer and no cables</b>: with logic, paper and games. That is how engineers train too!</div>' +
        '</div>',

      labctl:
        '<div class="lab-group">' +
        '<span class="lab-group-label">🤖 Part:</span>' +
        '<button class="lab-btn lab-cont-btn" data-parte="sensores" onclick="labShowParte(\'sensores\')">📡 Sensors</button>' +
        '<button class="lab-btn lab-cont-btn" data-parte="controlador" onclick="labShowParte(\'controlador\')">🧠 Controller</button>' +
        '<button class="lab-btn lab-cont-btn" data-parte="actuadores" onclick="labShowParte(\'actuadores\')">💪 Actuators</button>' +
        '<button class="lab-btn lab-cont-btn" data-parte="energia" onclick="labShowParte(\'energia\')">🔋 Power</button>' +
        '</div>' +
        '<div class="lab-group">' +
        '<span class="lab-group-label">📌 Aspect:</span>' +
        '<button class="lab-btn lab-asp-btn" data-aspecto="estructura" onclick="labShowAspecto(\'estructura\')">🔎 What is it?</button>' +
        '<button class="lab-btn lab-asp-btn" data-aspecto="funcion" onclick="labShowAspecto(\'funcion\')">🫀 Body comparison</button>' +
        '<button class="lab-btn lab-asp-btn" data-aspecto="ubicacion" onclick="labShowAspecto(\'ubicacion\')">🌍 Examples</button>' +
        '<button class="lab-btn lab-asp-btn" data-aspecto="dato" onclick="labShowAspecto(\'dato\')">⚠️ What if it fails?</button>' +
        '</div>',

      rec:
        '<h2>📁 Topic Resources</h2>' +
        '<div style="border:1.5px solid var(--border,#e2e8f0);border-radius:12px;padding:1rem 1.2rem;margin-bottom:1.2rem;background:rgba(0,0,0,0.02);">' +
        '<p style="font-size:0.98rem;font-weight:800;margin-bottom:0.4rem;">📄 Printable study sheet</p>' +
        '<p style="font-size:0.86rem;margin-bottom:0.85rem;">A 7-page study guide (theory, unplugged activities and assessment) to print or solve before the test. <em>It opens in English too — the language you choose here carries over.</em></p>' +
        '<a href="../../fichas/ficha-que-es-un-robot.html" target="_blank" rel="noopener noreferrer" class="btn btn-pri" style="display:inline-flex;align-items:center;gap:0.5rem;text-decoration:none;font-size:1rem;padding:0.7rem 1.4rem;">📄 Open / print the study sheet</a>' +
        '</div>' +
        '<p style="font-size:0.9rem;margin-bottom:1rem;">Here you will find support materials for this mission: slide decks, PDF documents, study guides and more. Your teacher keeps adding resources to this folder.</p>' +
        '<a href="https://drive.google.com/drive/folders/1que_es_un_robot_recursos" target="_blank" rel="noopener noreferrer" class="btn btn-pri" style="display:inline-flex;align-items:center;gap:0.5rem;text-decoration:none;font-size:1rem;padding:0.7rem 1.4rem;">📂 Open the folder in Google Drive</a>' +
        '<div class="tip" style="margin-top:1.2rem;"><span class="ti">💡</span>' +
        '<div>Files open straight in your browser. You can download them or view them without a Google account.</div></div>'
    },

    /* ══════════════════════════════════════════════════════
       2. BANCOS DE DATOS (los cambia MISION_APLICAR_IDIOMA)
       ══════════════════════════════════════════════════════ */
    data: {

      ACHIEVEMENTS: {
        primer_quiz: { icon: '🤖', label: 'First robotics quiz completed' },
        flash_master: { icon: '🃏', label: 'All robot flashcards explored' },
        clasif_pro: { icon: '🗂️', label: 'Expert sensor and actuator sorter' },
        id_master: { icon: '🔍', label: 'Master robot-part spotter' },
        reto_hero: { icon: '🏆', label: 'Sensor vs Actuator challenge hero' },
        nivel3: { icon: '🧭', label: 'Robotics Explorer! Level 3' },
        nivel5: { icon: '🥇', label: 'Robotics Engineer! Level 6' },
        widgets_master: { icon: '🧩', label: 'Robot-cycle widgets mastered' }
      },

      lvls: [
        { t: 0, n: 'Beginner 🌱' }, { t: 25, n: 'Tech Explorer 🔋' }, { t: 55, n: 'Robotics Explorer 🧭' },
        { t: 90, n: 'Sensor Technician 📡' }, { t: 130, n: 'Junior Programmer 💻' },
        { t: 165, n: 'Robotics Engineer 🛠️' }, { t: 190, n: 'Master Builder 🤖' }
      ],

      fcData: [
        { w: 'Robot', a: '🤖 A machine that <strong>senses</strong> with sensors, <strong>decides</strong> with its program and <strong>acts</strong> with motors.' },
        { w: 'Sensor', a: '📡 The part that <strong>senses</strong>: it picks up light, sound, distance, touch or temperature.' },
        { w: 'Controller', a: '🧠 The robot’s «brain»: it receives the information from the sensors and <strong>decides</strong> what to do according to its program.' },
        { w: 'Actuator', a: '💪 The part that <strong>acts</strong>: motors, wheels, arms, lights or speakers.' },
        { w: 'Program', a: '📋 The <strong>list of exact instructions</strong> the robot obeys step by step.' },
        { w: 'Robot cycle', a: '🔁 <strong>Sense → think → act</strong>, repeated over and over.' },
        { w: 'Power', a: '🔋 The <strong>battery or electricity</strong> that keeps sensors, controller and actuators running.' },
        { w: 'Simple machine', a: '🔨 A tool <strong>with no sensors and no program</strong> (hammer, lever): it neither senses nor decides.' },
        { w: 'Home appliance', a: '🔌 It acts when we switch it on, but it <strong>does not decide on its own</strong> (blender, iron).' },
        { w: 'Industrial robot', a: '🏭 A robotic arm that <strong>welds, cuts or sews</strong> in factories and maquilas.' },
        { w: 'Drone', a: '🚁 A <strong>flying</strong> robot; in Honduras it inspects coffee fields from the air.' },
        { w: 'Mobile robot', a: '🛞 A robot with <strong>wheels</strong> that travels around, like the robot vacuum.' },
        { w: 'Humanoid', a: '🦿 A robot <strong>shaped like a person</strong>: it walks and moves its arms and head.' },
        { w: 'Unplugged robotics', a: '✏️ Learning robotics with <strong>paper, games and logic</strong>, with no computer needed.' }
      ],

      memoPairs: [
        { id: 'robot', t: 'Robot', d: '🤖 it senses, thinks and acts' },
        { id: 'sensor', t: 'Sensor', d: '📡 the «eyes and ears»: light, touch, distance' },
        { id: 'controlador', t: 'Controller', d: '🧠 the brain: it decides using the program' },
        { id: 'actuador', t: 'Actuator', d: '💪 the muscles: motors and wheels that act' },
        { id: 'programa', t: 'Program', d: '📋 exact step-by-step instructions' },
        { id: 'energia', t: 'Power', d: '🔋 the battery that brings the robot to life' }
      ],

      qzData: [
        { q: 'What does a robot do that a simple machine does NOT?', o: ['a) Weigh a lot', 'b) Sense and decide on its own', 'c) Be made of metal', 'd) Need a person to push it'], c: 1 },
        { q: 'Which part of the robot works like its senses?', o: ['a) The actuators', 'b) The battery', 'c) The sensors', 'd) The wheels'], c: 2 },
        { q: 'Which part of the robot decides what to do?', o: ['a) The controller', 'b) The motor', 'c) The speaker', 'd) The outer shell'], c: 0 },
        { q: 'Which part of the robot acts (moves, turns, switches lights on)?', o: ['a) The sensors', 'b) The actuators', 'c) The program', 'd) The antenna'], c: 1 },
        { q: 'What is the correct order of the robot cycle?', o: ['a) Act → sense → think', 'b) Think → act → sense', 'c) Sense → think → act', 'd) Sense → act → think'], c: 2 },
        { q: 'Which of these machines is a robot?', o: ['a) The hammer', 'b) The blender', 'c) The bicycle', 'd) The vacuum that detects obstacles and chooses its own route'], c: 3 },
        { q: 'Why is a blender NOT a robot?', o: ['a) Because it is small', 'b) Because it acts but does not sense or decide on its own', 'c) Because it uses no electricity', 'd) Because it has no wheels'], c: 1 },
        { q: 'Which robot inspects the coffee fields in Honduras?', o: ['a) The humanoid', 'b) The robot vacuum', 'c) The drone', 'd) The factory arm'], c: 2 },
        { q: 'Do robots «think» the way people do?', o: ['a) Yes, exactly like us', 'b) No: they follow the instructions in their program', 'c) Yes, but only at night', 'd) No: they guess what to do'], c: 1 }
      ],

      classGroups: [
        {
          label: ['Sensor', 'Actuator'], headA: '📡 Sensor (senses)', headB: '💪 Actuator (acts)', colA: 'sen', colB: 'act',
          words: [{ w: 'Camera', t: 'sen' }, { w: 'Motor', t: 'act' }, { w: 'Microphone', t: 'sen' }, { w: 'Wheel', t: 'act' }, { w: 'Touch sensor', t: 'sen' }, { w: 'Speaker', t: 'act' }, { w: 'Robot thermometer', t: 'sen' }, { w: 'Mechanical arm', t: 'act' }, { w: 'Distance sensor', t: 'sen' }, { w: 'LED light', t: 'act' }]
        },
        {
          label: ['It is a robot', 'Not a robot'], headA: '🤖 It is a robot', headB: '🚫 Not a robot', colA: 'rob', colB: 'no',
          words: [{ w: 'Robot vacuum', t: 'rob' }, { w: 'Hammer', t: 'no' }, { w: 'Farming drone', t: 'rob' }, { w: 'Blender', t: 'no' }, { w: 'Factory arm', t: 'rob' }, { w: 'Bicycle', t: 'no' }, { w: 'Line-following car', t: 'rob' }, { w: 'Scissors', t: 'no' }, { w: 'Surgical robot', t: 'rob' }, { w: 'Iron', t: 'no' }]
        },
        {
          label: ['Sense', 'Act'], headA: '👀 Sense', headB: '⚙️ Act', colA: 'per', colB: 'act',
          words: [{ w: 'See an obstacle', t: 'per' }, { w: 'Turn the wheels', t: 'act' }, { w: 'Measure the temperature', t: 'per' }, { w: 'Switch the light on', t: 'act' }, { w: 'Hear a clap', t: 'per' }, { w: 'Move the arm', t: 'act' }, { w: 'Detect the black line', t: 'per' }, { w: 'Sound the horn', t: 'act' }]
        },
        {
          label: ['Simple machine', 'Home appliance'], headA: '🔨 Simple machine', headB: '🔌 Home appliance', colA: 'sim', colB: 'ele',
          words: [{ w: 'Hammer', t: 'sim' }, { w: 'Blender', t: 'ele' }, { w: 'Lever', t: 'sim' }, { w: 'Television', t: 'ele' }, { w: 'Scissors', t: 'sim' }, { w: 'Iron', t: 'ele' }, { w: 'Wheelbarrow', t: 'sim' }, { w: 'Fan', t: 'ele' }, { w: 'Ramp', t: 'sim' }, { w: 'Refrigerator', t: 'ele' }]
        }
      ],

      idData: [
        { s: ['A', 'robot', 'senses,', 'thinks', 'and', 'acts.'], c: 1, art: 'the machine that completes the whole cycle' },
        { s: ['Sensors', 'are', 'the', 'senses', 'of', 'the', 'robot.'], c: 0, art: 'the part of the robot that senses' },
        { s: ['The', 'controller', 'is', 'the', 'brain', 'of', 'the', 'robot.'], c: 1, art: 'the part of the robot that decides' },
        { s: ['Actuators', 'are', 'the', 'muscles', 'of', 'the', 'robot.'], c: 0, art: 'the part of the robot that acts' },
        { s: ['The', 'robot', 'obeys', 'its', 'program', 'step', 'by', 'step.'], c: 4, art: 'the robot’s list of instructions' },
        { s: ['The', 'drone', 'inspects', 'the', 'coffee', 'fields.'], c: 1, art: 'the flying robot of the coffee farms' },
        { s: ['The', 'battery', 'gives', 'power', 'to', 'the', 'robot.'], c: 1, art: 'the source that brings the robot to life' },
        { s: ['The', 'robot', 'vacuum', 'detects', 'obstacles', 'with', 'sensors.'], c: 6, art: 'the part the vacuum senses with' }
      ],

      cmpData: [
        { s: 'A robot is a machine that senses, ___ and acts.', opts: ['thinks', 'sleeps', 'eats'], c: 0 },
        { s: 'The robot’s sensors work like the ___ of the body.', opts: ['bones', 'senses', 'teeth'], c: 1 },
        { s: 'The robot’s controller is like the human ___.', opts: ['foot', 'heart', 'brain'], c: 2 },
        { s: 'The robot’s actuators are like the ___ of the body.', opts: ['muscles', 'eyes', 'ears'], c: 0 },
        { s: 'The robot follows the instructions in its ___.', opts: ['notebook', 'program', 'teacher'], c: 1 },
        { s: 'The ___ is not a robot because it does not decide on its own.', opts: ['blender', 'robot vacuum', 'automatic door'], c: 0 },
        { s: 'The ___ is a flying robot that inspects crops.', opts: ['hammer', 'television', 'drone'], c: 2 },
        { s: 'The robot gets its power from its ___.', opts: ['battery', 'shadow', 'antenna'], c: 0 }
      ],

      routeSets: [
        {
          label: 'The robot vacuum cleans the living room', steps: [
            'The sensor detects an obstacle ahead',
            'The controller decides to turn right',
            'The motors turn the wheels toward the clear side',
            'The vacuum keeps cleaning along the clear path']
        },
        {
          label: 'The robot that waters the garden', steps: [
            'The moisture sensor measures that the soil is dry',
            'The controller decides to turn the water on',
            'The actuator opens the valve and waters',
            'The sensor detects moist soil and the controller shuts the water off']
        },
        {
          label: 'The line-following car', steps: [
            'The light sensor sees the black line on the floor',
            'The controller compares: am I on the line?',
            'It decides to correct its course to the left',
            'The motors move the wheels',
            'The car keeps moving along the line']
        }
      ],

      neuronPartes: [
        { desc: 'A robot that stops before crashing into a wall', ans: 'Distance sensor', opts: ['Distance sensor', 'Light sensor', 'Sound sensor', 'Temperature sensor'] },
        { desc: 'A robot that turns the lamp on when it gets dark', ans: 'Light sensor', opts: ['Light sensor', 'Touch sensor', 'Distance sensor', 'Moisture sensor'] },
        { desc: 'A toy robot that starts up when you clap', ans: 'Sound sensor', opts: ['Sound sensor', 'Light sensor', 'Temperature sensor', 'Distance sensor'] },
        { desc: 'A robot that warns you if the chick incubator gets cold', ans: 'Temperature sensor', opts: ['Temperature sensor', 'Sound sensor', 'Touch sensor', 'Light sensor'] },
        { desc: 'A robot that knows when somebody presses its button', ans: 'Touch sensor', opts: ['Touch sensor', 'Distance sensor', 'Moisture sensor', 'Sound sensor'] },
        { desc: 'A robot that waters the garden when the soil is dry', ans: 'Moisture sensor', opts: ['Moisture sensor', 'Sound sensor', 'Touch sensor', 'Light sensor'] },
        { desc: 'A car that follows the black line painted on the floor', ans: 'Light sensor', opts: ['Light sensor', 'Temperature sensor', 'Sound sensor', 'Moisture sensor'] },
        { desc: 'A drone that dodges the trees in the coffee field', ans: 'Distance sensor', opts: ['Distance sensor', 'Moisture sensor', 'Touch sensor', 'Sound sensor'] }
      ],

      neuroPairs: [
        { trans: 'Sensor', func: 'It picks up information: light, sound, distance, touch', opts: ['It picks up information: light, sound, distance, touch', 'It carries out the action with motors', 'It stores the robot’s battery', 'It is the list of instructions'] },
        { trans: 'Controller', func: 'It receives the information and decides using the program', opts: ['It receives the information and decides using the program', 'It picks up light and sound', 'It moves the robot’s wheels', 'It gives the robot its color'] },
        { trans: 'Actuator', func: 'It carries out the action: motors, wheels, arms, lights', opts: ['It carries out the action: motors, wheels, arms, lights', 'It decides what to do', 'It measures the temperature', 'It writes the program'] },
        { trans: 'Program', func: 'A list of exact step-by-step instructions', opts: ['A list of exact step-by-step instructions', 'The robot’s battery', 'The mechanical arm', 'The light sensor'] },
        { trans: 'Battery', func: 'It provides the power that keeps the whole robot running', opts: ['It provides the power that keeps the whole robot running', 'It senses the obstacles', 'It decides the route', 'It sews fabric in the factory'] }
      ],

      enfermedadData: [
        { disease: 'The vacuum that detects obstacles and chooses its route', characteristic: 'It is a robot', opts: ['It is a robot', 'Not a robot'] },
        { disease: 'The hammer', characteristic: 'Not a robot', opts: ['Not a robot', 'It is a robot'] },
        { disease: 'The drone that inspects the coffee field and dodges the trees', characteristic: 'It is a robot', opts: ['It is a robot', 'Not a robot'] },
        { disease: 'The blender', characteristic: 'Not a robot', opts: ['Not a robot', 'It is a robot'] },
        { disease: 'The factory arm that sews by following its program', characteristic: 'It is a robot', opts: ['It is a robot', 'Not a robot'] },
        { disease: 'The iron', characteristic: 'Not a robot', opts: ['Not a robot', 'It is a robot'] }
      ],

      retoPairs: [
        {
          label: ['Sensor', 'Actuator'], btnA: '📡 Sensor', btnB: '💪 Actuator', colA: 'sen', colB: 'act',
          words: [{ w: 'Camera', t: 'sen' }, { w: 'Motor', t: 'act' }, { w: 'Microphone', t: 'sen' }, { w: 'Wheel', t: 'act' }, { w: 'Touch sensor', t: 'sen' }, { w: 'Speaker', t: 'act' }, { w: 'Thermometer', t: 'sen' }, { w: 'Mechanical arm', t: 'act' }, { w: 'Light sensor', t: 'sen' }, { w: 'LED light', t: 'act' }]
        },
        {
          label: ['It is a robot', 'Not a robot'], btnA: '🤖 It is a robot', btnB: '🚫 Not a robot', colA: 'rob', colB: 'no',
          words: [{ w: 'Robot vacuum', t: 'rob' }, { w: 'Hammer', t: 'no' }, { w: 'Drone', t: 'rob' }, { w: 'Blender', t: 'no' }, { w: 'Factory arm', t: 'rob' }, { w: 'Scissors', t: 'no' }, { w: 'Humanoid', t: 'rob' }, { w: 'Bicycle', t: 'no' }, { w: 'Surgical robot', t: 'rob' }, { w: 'Iron', t: 'no' }]
        },
        {
          label: ['Senses', 'Acts'], btnA: '👀 Senses', btnB: '⚙️ Acts', colA: 'per', colB: 'act',
          words: [{ w: 'See the line', t: 'per' }, { w: 'Turn the wheel', t: 'act' }, { w: 'Measure the heat', t: 'per' }, { w: 'Switch the light on', t: 'act' }, { w: 'Hear a clap', t: 'per' }, { w: 'Move the arm', t: 'act' }, { w: 'Detect an obstacle', t: 'per' }, { w: 'Sound the horn', t: 'act' }, { w: 'Measure the moisture', t: 'per' }, { w: 'Open the valve', t: 'act' }]
        }
      ],

      identifyTaskDB: [
        { s: 'A robot is a machine that senses, thinks and acts.', type: 'Robot' },
        { s: 'Sensors pick up light, sound, distance or temperature.', type: 'Sensors' },
        { s: 'The controller is the brain that decides using the program.', type: 'Controller' },
        { s: 'Actuators are the motors and wheels that carry out the action.', type: 'Actuators' },
        { s: 'The program is the robot’s list of exact instructions.', type: 'Program' },
        { s: 'The battery provides the power that keeps the robot running.', type: 'Power' },
        { s: 'The drone inspects the coffee fields from the air.', type: 'Drone' },
        { s: 'The robot vacuum detects obstacles and chooses its own route.', type: 'Robot vacuum' },
        { s: 'The factory robotic arm sews by following its program.', type: 'Industrial robot' },
        { s: 'The hammer neither senses nor decides: it is a simple machine.', type: 'Simple machine' }
      ],

      classifyTaskDB: [
        { w: 'Robot vacuum', gen: 'Yes, it is a robot', n: 'Yes: it detects obstacles and dirt', g: 'Yes: it chooses its own route', t: 'Yes: it moves wheels and brushes' },
        { w: 'Blender', gen: 'Not a robot', n: 'No: it picks up nothing from its surroundings', g: 'No: a person switches it on', t: 'Yes: it spins its blades' },
        { w: 'Hammer', gen: 'Not a robot (simple machine)', n: 'It senses nothing', g: 'It decides nothing', t: 'No: the person’s hand moves it' },
        { w: 'Farming drone', gen: 'Yes, it is a robot', n: 'Yes: camera and GPS', g: 'Yes: it follows its flight plan and dodges obstacles', t: 'Yes: it flies with its propellers' },
        { w: 'Factory arm', gen: 'Yes, it is a robot', n: 'Yes: position sensors', g: 'Yes: it follows its sewing or cutting program', t: 'Yes: it moves the arm and the tool' },
        { w: 'Iron', gen: 'Not a robot', n: 'Only temperature (thermostat)', g: 'No: a person uses it and moves it', t: 'Yes: it heats the clothes' },
        { w: 'Television', gen: 'Not a robot', n: 'Only the remote control commands', g: 'No: it obeys the person', t: 'Yes: it shows picture and sound' },
        { w: 'Automatic door', gen: 'Yes, it is a simple robot', n: 'Yes: motion sensor', g: 'Yes: it decides to open when somebody arrives', t: 'Yes: its motor slides the door' }
      ],

      completeTaskDB: [
        { s: 'A robot senses, ___ and acts.', opts: ['thinks', 'sleeps', 'paints'], ans: 'thinks' },
        { s: 'Sensors are the ___ of the robot.', opts: ['senses', 'muscles', 'shoes'], ans: 'senses' },
        { s: 'The controller works like the ___ of the body.', opts: ['brain', 'foot', 'elbow'], ans: 'brain' },
        { s: 'Actuators work like the ___ of the body.', opts: ['muscles', 'eyes', 'teeth'], ans: 'muscles' },
        { s: 'The robot obeys its ___ step by step.', opts: ['program', 'notebook', 'hat'], ans: 'program' },
        { s: 'The ___ is a flying robot.', opts: ['drone', 'hammer', 'fan'], ans: 'drone' },
        { s: 'The robot gets its power from the ___.', opts: ['battery', 'rain', 'sand'], ans: 'battery' },
        { s: 'The blender is not a robot because it does not ___ on its own.', opts: ['decide', 'spin', 'sound'], ans: 'decide' }
      ],

      explainQuestions: [
        { q: 'What is a robot? Explain the sense → think → act cycle with an example from your home or community.', ans: 'A robot is a machine that senses with sensors, decides with its controller (following a program) and acts with actuators. Example: the robot vacuum senses an obstacle, decides to turn and acts by moving its wheels.' },
        { q: 'Write the body ↔ robot comparison: what are the sensors, the controller and the actuators like?', ans: 'Sensors are like the senses (eyes, ears, skin), the controller is like the brain that decides, and actuators are like the muscles that carry out the movement. Just like in your body: receptor → brain → effector.' },
        { q: 'Invent a robot for a problem in your town or village: draw it in your notebook and name its 3 parts.', ans: 'Open answer. It must name sensors (what it senses), controller (what it decides: «if X happens, it does Y») and actuators (how it acts), joined together in the sense → think → act cycle.' },
        { q: 'Why is the blender NOT a robot while the robot vacuum IS one?', ans: 'The blender only acts when a person switches it on: it does not sense its surroundings and decides nothing on its own. The robot vacuum completes the whole cycle: it senses obstacles with sensors, decides its route with its controller and acts with its motors.' },
        { q: 'Choose 5 machines from your home and sort them: robot or not a robot? Explain each one.', ans: 'Open answer. For each machine ask: does it sense with sensors? does it decide on its own? does it act? Only the machine that does all three is a robot (most home appliances only act).' }
      ],

      sopaSets: [
        _sopa(10, ['ROBOT', 'SENSOR', 'MOTOR', 'BRAIN', 'DRONE', 'ARM'], 20260724),
        _sopa(10, ['ACTUATOR', 'PROGRAM', 'SENSE', 'DECIDE', 'POWER', 'MACHINE'], 76543210)
      ],

      evalTFBank: [
        { q: 'A robot senses, thinks and acts.', a: true },
        { q: 'The hammer is a robot because it acts.', a: false },
        { q: 'Sensors are the «senses» of the robot.', a: true },
        { q: 'The robot’s controller works like the brain.', a: true },
        { q: 'The robot’s actuators work like the senses.', a: false },
        { q: 'The blender is a robot because it moves.', a: false },
        { q: 'The robot vacuum senses, thinks and acts.', a: true },
        { q: 'Robots think and feel just like people.', a: false },
        { q: 'The program is the list of instructions the robot follows.', a: true },
        { q: 'A drone can inspect the coffee fields from the air.', a: true },
        { q: 'A robot’s power can come from a battery.', a: true },
        { q: 'A simple machine, such as a lever, has sensors.', a: false },
        { q: 'In the maquilas there are robotic arms that sew and cut.', a: true },
        { q: 'The robot cycle is: act → think → sense.', a: false },
        { q: 'With no program, the controller does not know what to decide.', a: true }
      ],

      evalMCBank: [
        { q: 'What is a robot?', o: ['a) Any metal machine', 'b) A machine that senses, thinks and acts', 'c) A toy with lights', 'd) A computer with a screen'], a: 1 },
        { q: 'Which part of the robot works like its «senses»?', o: ['a) The actuators', 'b) The sensors', 'c) The wheels', 'd) The battery'], a: 1 },
        { q: 'Which of these machines is a robot?', o: ['a) The hammer', 'b) The blender', 'c) The vacuum that detects obstacles and chooses its own route', 'd) The bicycle'], a: 2 },
        { q: 'Which part of the robot decides what to do?', o: ['a) The controller', 'b) The motor', 'c) The speaker', 'd) The wheel'], a: 0 },
        { q: 'Which part of the robot are its «muscles»?', o: ['a) The sensors', 'b) The program', 'c) The antenna', 'd) The actuators'], a: 3 },
        { q: 'What is the order of the robot cycle?', o: ['a) Act → sense → think', 'b) Sense → think → act', 'c) Think → act → sense', 'd) Sense → act → think'], a: 1 },
        { q: 'Why is the hammer NOT a robot?', o: ['a) Because it is small', 'b) Because it is made of metal', 'c) Because it neither senses nor decides', 'd) Because it has no lights'], a: 2 },
        { q: 'Why is the blender NOT a robot?', o: ['a) Because it acts but does not decide on its own', 'b) Because it does not spin', 'c) Because it belongs in the kitchen', 'd) Because it uses electricity'], a: 0 },
        { q: 'Which sensor does a robot need in order to stop before an obstacle?', o: ['a) Temperature', 'b) Moisture', 'c) Sound', 'd) Distance'], a: 3 },
        { q: 'Which robot inspects the coffee fields in Honduras?', o: ['a) The drone', 'b) The humanoid', 'c) The robot vacuum', 'd) The surgical robot'], a: 0 },
        { q: 'What do robotic arms do in the maquila?', o: ['a) They think for the workers', 'b) They sew and cut by following a program', 'c) They sell the clothes', 'd) They design the fashion'], a: 1 },
        { q: 'What is a robot’s program?', o: ['a) A television channel', 'b) Its internal battery', 'c) The list of instructions it obeys step by step', 'd) Its metal case'], a: 2 },
        { q: 'How do robots «think»?', o: ['a) Just like people', 'b) They follow the instructions in their program', 'c) They guess what to do', 'd) They dream the answers'], a: 1 },
        { q: 'Which one is a robot shaped like a person?', o: ['a) The drone', 'b) The industrial arm', 'c) The robot vacuum', 'd) The humanoid'], a: 3 },
        { q: 'Where does a robot get its power from?', o: ['a) From the battery or the electricity', 'b) From food', 'c) From the water it drinks', 'd) From the air'], a: 0 }
      ],

      evalCPBank: [
        { q: 'A robot senses, ___ and acts.', a: 'thinks' },
        { q: 'Sensors are the ___ of the robot.', a: 'senses' },
        { q: 'The controller works like the ___ of the body.', a: 'brain' },
        { q: 'Actuators work like the ___ of the body.', a: 'muscles' },
        { q: 'The robot follows the instructions in its ___.', a: 'program' },
        { q: 'The robot cycle is sense, think and ___.', a: 'act' },
        { q: 'The ___ is a flying robot that inspects crops.', a: 'drone' },
        { q: 'The robot gets its power from the ___.', a: 'battery' },
        { q: 'The motor and the wheel are examples of ___.', a: 'actuators' },
        { q: 'The robot’s camera is an example of a ___.', a: 'sensor' },
        { q: 'In the maquilas, ___ arms sew and cut.', a: 'robotic' },
        { q: 'The hammer is not a robot: it is a ___ machine.', a: 'simple' },
        { q: 'A robot shaped like a person is a ___.', a: 'humanoid' },
        { q: 'The ___ sensor measures whether the soil is dry.', a: 'moisture' },
        { q: 'The robot that cleans the floor and avoids obstacles is the robot ___.', a: 'vacuum' }
      ],

      evalPRBank: [
        { term: 'Robot', def: 'A machine that senses, thinks and acts' },
        { term: 'Sensor', def: 'It picks up light, sound, distance or temperature' },
        { term: 'Controller', def: 'The «brain» that decides using the program' },
        { term: 'Actuator', def: 'Motor, wheel or arm that carries out the action' },
        { term: 'Program', def: 'A list of step-by-step instructions' },
        { term: 'Power', def: 'Battery or electricity that brings the robot to life' },
        { term: 'Drone', def: 'A flying robot; it inspects crops from the air' },
        { term: 'Humanoid', def: 'A robot shaped like a person' },
        { term: 'Simple machine', def: 'It neither senses nor decides, like the hammer' },
        { term: 'Home appliance', def: 'It acts when switched on, but does not decide alone' },
        { term: 'Robot cycle', def: 'Sense → think → act' },
        { term: 'Industrial robot', def: 'An arm that sews or cuts in the garment factory' },
        { term: 'Distance sensor', def: 'It keeps the robot from crashing into obstacles' },
        { term: 'Robot vacuum', def: 'It cleans on its own: it detects and picks its route' },
        { term: 'Robotics', def: 'The science that studies and builds robots' }
      ],

      critSensorBank: [
        { txt: 'A robot waters the school garden only when the soil is dry.', ans: 'Moisture sensor: it measures the water in the soil; if it is dry, the controller decides to turn the irrigation on.' },
        { txt: 'A delivery robot stops before crashing into a wall or a person.', ans: 'Distance sensor: it measures how close the obstacle is; if it is too close, the controller decides to brake.' },
        { txt: 'A robotic lamp switches itself on when night falls.', ans: 'Light sensor: it detects that it got dark; the controller decides to switch the lamp on.' },
        { txt: 'A robot looks after the chick incubator and warns if it gets cold.', ans: 'Temperature sensor: it measures the heat; if it drops too low, the controller decides to switch on the alarm or the bulb.' },
        { txt: 'A toy robot starts up when the child claps twice.', ans: 'Sound sensor: it picks up the claps; the controller decides to start the motors.' },
        { txt: 'A robotic car follows a black line painted on the classroom floor.', ans: 'Light sensor: it tells black apart from light on the floor; the controller decides to correct the course so it does not drift off.' }
      ],

      critErrorBank: [
        {
          txt: '"The blender is a robot because it moves."',
          g1: 'Moving (acting) is not enough to be a robot: the blender DOES NOT SENSE its surroundings with sensors.',
          g2: 'It does not DECIDE on its own either: a person switches it on and off. A robot completes the whole sense → think → act cycle.'
        },
        {
          txt: '"Sensors are the robot’s muscles and actuators are its senses."',
          g1: 'It is the other way round: SENSORS are the robot’s «senses» (they pick up light, sound, distance, temperature).',
          g2: 'ACTUATORS are the «muscles» (motors, wheels, arms) that carry out the action.'
        },
        {
          txt: '"Robots think and feel just like people."',
          g1: 'Robots DO NOT think like people: they follow the instructions in their PROGRAM.',
          g2: 'They do not feel emotions either: their sensors only measure data (light, distance, heat) and the controller decides according to what was programmed.'
        },
        {
          txt: '"The hammer is a robot because it is a machine and it works hard."',
          g1: 'The hammer is a SIMPLE MACHINE: it has no sensors and no program, it senses nothing.',
          g2: 'It neither decides nor acts on its own: all the force and all the decisions come from the person using it.'
        },
        {
          txt: '"A robot needs no program: it just knows what to do."',
          g1: 'With no PROGRAM the controller does not know what to decide: the program is its list of exact instructions.',
          g2: 'What looks like the robot «knowing» is the work of the people who programmed it step by step.'
        }
      ],

      critCicloQuestions: [
        '1. What does the robot SENSE and with which sensor?',
        '2. What does its controller DECIDE?',
        '3. How does it ACT and with which actuator?'
      ],

      critCicloBank: [
        {
          txt: 'The robot vacuum cleans the house: when it meets a chair it goes around it, and when its battery runs low it returns to the charger on its own.',
          p: 'It senses the obstacles (distance or touch sensor) and the level of its own battery.',
          d: 'It decides to go around the chair and, if the battery is low, it decides to head back to the charger.',
          a: 'It acts with its motors and wheels: it turns, changes route and travels to the charger.'
        },
        {
          txt: 'The supermarket automatic door opens when a person walks up and closes when nobody else is coming through.',
          p: 'It senses the person with a motion or distance sensor.',
          d: 'It decides to open when it detects somebody nearby and to close when there is nobody left.',
          a: 'It acts with a motor (actuator) that slides the door.'
        },
        {
          txt: 'A drone flies over the coffee field: it takes photos of the plants and, if it spots a diseased area, it alerts the farmer.',
          p: 'It senses the crop with its camera (sensor) and its position with GPS.',
          d: 'It decides which area to inspect and recognizes when an area looks diseased.',
          a: 'It acts with its propellers (motors) to fly and sends the alert to the farmer’s phone.'
        },
        {
          txt: 'The garden robot measures the soil every morning; if it is dry it turns the water on and, once the soil is moist, it turns it off.',
          p: 'It senses the moisture of the soil with its moisture sensor.',
          d: 'It decides to turn the water on if the soil is dry and to turn it off once it is moist.',
          a: 'It acts with a valve or pump (actuator) that lets the water through.'
        },
        {
          txt: 'In the garment factory, a robotic arm sews pockets: it picks up the fabric, places it in the exact spot and sews the whole seam.',
          p: 'It senses the position of the fabric with its sensors.',
          d: 'It decides where to place the fabric and when to start and finish the seam, according to its program.',
          a: 'It acts by moving the arm and the needle (actuators) to sew.'
        }
      ],

      critCompareBank: [
        {
          a: 'A machine that acts when you switch it on, but chooses nothing on its own (example: the blender).',
          b: 'A machine that senses with sensors, decides with its program and acts on its own (example: the robot vacuum).',
          ga: 'The home appliance.', gb: 'The robot.',
          gr: 'Similarity: both use electric power and both act. Difference: only the robot senses and decides; the home appliance is controlled by a person.'
        },
        {
          a: 'The part of the robot that picks up information: light, sound, distance, temperature.',
          b: 'The part of the robot that carries out the action: motors, wheels, arms, lights.',
          ga: 'The sensor.', gb: 'The actuator.',
          gr: 'Similarity: both are robot parts connected to the controller. Difference: the sensor brings information in (it senses) and the actuator sends action out (it acts), like the senses and the muscles of the body.'
        },
        {
          a: 'A tool with no motor and no sensors: the person provides all the force (example: the hammer).',
          b: 'A machine that completes the sense → think → act cycle (example: the drone).',
          ga: 'The simple machine.', gb: 'The robot.',
          gr: 'Similarity: both help us get work done. Difference: the simple machine senses nothing and decides nothing; the robot works on its own by following its program.'
        },
        {
          a: 'A flying robot with a camera that inspects the coffee fields from the air.',
          b: 'A fixed factory robot that sews and cuts fabric by following its program.',
          ga: 'The drone.', gb: 'The robotic arm (industrial robot).',
          gr: 'Similarity: both are robots: they sense, decide and act. Difference: the drone is mobile and flies over the fields; the industrial arm works in a fixed spot inside the factory.'
        }
      ],

      critDesignBank: [
        'In your community, the coffee harvest is lost when it rains all of a sudden while the beans are drying in the yard.',
        'During the rainy season the river rises and the children cannot tell whether it is safe to cross the ford on their way to school.',
        'The corner store needs to be watched at night, when nobody is around.',
        'In the dry season the school garden dries out because nobody comes to water it at weekends.',
        'Birds eat the corn in the field when nobody is guarding it.'
      ],

      critDesignGuide: 'Rubric with 3 criteria (20 pts total) — ① SENSORS (7 pts): choose sensors that suit the problem and explain what they sense. ② CONTROLLER (6 pts): write a clear decision of the type «if X happens, then the robot does Y». ③ ACTUATORS (7 pts): name what the robot acts with, and make the solution realistic for the problem. Any design counts as long as the three parts work together in the sense → think → act cycle.',

      parteData: {
        sensores: {
          nombre: 'The sensors', icon: '📡',
          estructura: { title: 'What is it?', info: '• The part of the robot that <strong>SENSES</strong> the world<br>• It picks up <strong>light, sound, distance, touch or temperature</strong><br>• It turns what it picks up into signals for the controller' },
          funcion: { title: 'Body comparison', info: '• They are like your <strong>senses</strong>: eyes, ears and skin<br>• Your eye picks up light → so does the robot’s camera<br>• Just like in your body: <strong>receptor → brain → effector</strong>' },
          ubicacion: { title: 'Examples', info: '• <strong>Camera</strong> (it sees) and <strong>microphone</strong> (it hears)<br>• <strong>Distance</strong> sensor: it avoids crashes<br>• <strong>Touch, temperature and moisture</strong> sensors' },
          dato: { title: 'What if it fails?', info: '• The robot is left <strong>«blind and deaf»</strong><br>• The vacuum would crash into the chairs<br>• The controller would decide <strong>with no information</strong>: nothing but mistakes' }
        },
        controlador: {
          nombre: 'The controller', icon: '🧠',
          estructura: { title: 'What is it?', info: '• The robot’s <strong>«brain»</strong>: a small computer<br>• It receives the signals from the sensors<br>• It <strong>DECIDES</strong> what to do by following its <strong>program</strong>' },
          funcion: { title: 'Body comparison', info: '• It is like your <strong>brain</strong><br>• Your brain receives what your eyes see and decides to run or stop<br>• The controller receives the data and chooses the action' },
          ubicacion: { title: 'Examples', info: '• The <strong>circuit board</strong> inside the robot vacuum<br>• The <strong>chip</strong> in the drone that follows the flight plan<br>• Decisions such as: <strong>«if there is an obstacle, then turn»</strong>' },
          dato: { title: 'What if it fails?', info: '• The robot senses but <strong>does not know what to do</strong><br>• The motors receive no order at all<br>• With no program loaded, the controller <strong>decides nothing</strong>' }
        },
        actuadores: {
          nombre: 'The actuators', icon: '💪',
          estructura: { title: 'What is it?', info: '• The part of the robot that <strong>ACTS</strong><br>• <strong>Motors, wheels, arms, lights and speakers</strong><br>• They carry out the order sent by the controller' },
          funcion: { title: 'Body comparison', info: '• They are like your <strong>muscles</strong><br>• Your brain gives the order and your legs run<br>• The controller gives the order and the <strong>motors turn</strong>' },
          ubicacion: { title: 'Examples', info: '• The <strong>wheels</strong> of the robot vacuum<br>• The <strong>propellers</strong> of the drone<br>• The <strong>arm</strong> that sews in the garment factory' },
          dato: { title: 'What if it fails?', info: '• The robot senses and decides… but <strong>it does not move</strong><br>• It is like trying to walk with your muscles asleep<br>• With no actuators, the decision <strong>stays a mere idea</strong>' }
        },
        energia: {
          nombre: 'The power', icon: '🔋',
          estructura: { title: 'What is it?', info: '• The robot’s <strong>power source</strong><br>• Almost always a <strong>battery</strong> or the electric current<br>• It feeds sensors, controller and actuators alike' },
          funcion: { title: 'Body comparison', info: '• It is like your <strong>food</strong>: meals give you strength<br>• With no breakfast you cannot perform; with no battery the robot will not start<br>• Some robots «eat» from the sun with <strong>solar panels</strong>' },
          ubicacion: { title: 'Examples', info: '• The <strong>rechargeable battery</strong> of the robot vacuum<br>• The <strong>batteries</strong> in a toy robot<br>• The <strong>solar panel</strong> of an explorer robot' },
          dato: { title: 'What if it fails?', info: '• <strong>The whole robot shuts down</strong>: nothing senses, nothing decides, nothing acts<br>• That is why the robot vacuum <strong>goes back to its charger on its own</strong><br>• A good robot watches its own battery with a sensor' }
        }
      }
    },

    /* ══════════════════════════════════════════════════════
       3. FRASES EXACTAS (pantalla y pruebas imprimibles)
       ══════════════════════════════════════════════════════ */
    frases: {
      /* — barra superior, navegación y pie — */
      'Aprende': 'Learn', 'Tipos': 'Types', 'Lab': 'Lab', 'Flashcards': 'Flashcards', 'Quiz': 'Quiz',
      /* — laboratorio (rótulos del robot en SVG) — */
      'ENERGÍA': 'POWER', 'SENSORES': 'SENSORS', 'ACTUADORES': 'ACTUATORS', 'CONTROLADOR 🧠': 'CONTROLLER 🧠',
      '🔬 Laboratorio de las Partes del Robot': '🔬 Robot Parts Laboratory',
      'Toca una parte del robot (en el dibujo o en los botones) y un aspecto para explorarlo. ¡Combínalos todos!':
        'Tap a robot part (on the drawing or on the buttons) and an aspect to explore it. Try every combination!',
      /* — flashcards y memorama — */
      '🧠 Memorama del Robot': '🧠 Robot Memory Game',
      /* — quiz, clasifica, identifica, completa — */
      '¡Correcto! Piensas como todo un robotista.': 'Correct! You are thinking like a real roboticist.',
      'Casi. Pregúntate: ¿percibe?, ¿decide?, ¿actúa?': 'Almost. Ask yourself: does it sense? does it decide? does it act?',
      '💡 Consejo: ¡Usa el botón "Variar grupo" varias veces! Practicar con diferentes categorías te ayudará a dominar el tema.':
        '💡 Tip: use the "Change group" button several times! Practicing with different categories helps you master the topic.',
      /* — widgets — */
      '🔁 Percibe → Decide → Actúa: ordena el ciclo': '🔁 Sense → Think → Act: put the cycle in order',
      'Usa las flechas ▲ ▼ para poner los pasos del robot en el orden correcto:': 'Use the ▲ ▼ arrows to put the robot steps in the right order:',
      'Hay pasos fuera de orden. Recuerda: percibir → decidir → actuar.': 'Some steps are out of order. Remember: sense → think → act.',
      '📡 ¿Qué sensor necesita?': '📡 Which sensor does it need?',
      'Lee la situación y elige el sensor adecuado:': 'Read the situation and choose the right sensor:',
      '🎉 ¡Eres todo un técnico de sensores!': '🎉 You are a true sensor technician!',
      '🔗 Empareja: Parte → Función': '🔗 Match: Part → Function',
      '¿Cuál es la función de esta parte del robot?': 'What is the job of this robot part?',
      '🤖 ¿Robot o no es robot?': '🤖 Robot or not a robot?',
      'Pregúntate: ¿percibe?, ¿decide?, ¿actúa? Y responde:': 'Ask yourself: does it sense? does it decide? does it act? Then answer:',
      'La aspiradora robot': 'The robot vacuum',
      /* — generador de tareas — */
      '🔍 Identificar': '🔍 Identify', '🗂️ Clasificar máquinas': '🗂️ Sort machines',
      'Copia en tu cuaderno; subraya, colorea o encierra el concepto de robótica indicado en cada oración. Escribe al lado qué parte o tipo de robot es.':
        'Copy this in your notebook; underline, color or circle the robotics concept in each sentence. Next to it, write which robot part or type it is.',
      'Copia la siguiente tabla en tu cuaderno. Para cada máquina responde: ¿es robot?, ¿percibe?, ¿decide?, ¿actúa? Explica con tus palabras.':
        'Copy the table below in your notebook. For each machine answer: is it a robot? does it sense? does it decide? does it act? Explain in your own words.',
      'Máquina': 'Machine', '¿Es robot?': 'Is it a robot?', '¿Percibe?': 'Does it sense?',
      '¿Decide?': 'Does it decide?', '¿Actúa?': 'Does it act?',
      /* — evaluación conceptual: pantalla — */
      'Evaluación Final · ¿Qué es un Robot? · Educación Básica · Robótica': 'Final Test · What Is a Robot? · Basic Education · Robotics',
      'Evaluación Competencial · Pensamiento Crítico · ¿Qué es un Robot? · Educación Básica': 'Competency Test · Critical Thinking · What Is a Robot? · Basic Education',
      'Evaluación Competencial · Pensamiento Crítico · ¿Qué es un Robot? · Educación Básica · Robótica': 'Competency Test · Critical Thinking · What Is a Robot? · Basic Education · Robotics',
      '🎓 Evaluación Final — ¿Qué es un Robot?': '🎓 Final Test — What Is a Robot?',
      '🧠 Prueba de Pensamiento Crítico — ¿Qué es un Robot?': '🧠 Critical Thinking Test — What Is a Robot?',
      /* — pensamiento crítico — */
      'I. ¿Qué sensor necesita?': 'I. Which sensor does it need?',
      'III. Analiza el ciclo: percibe → decide → actúa': 'III. Analyze the cycle: sense → think → act',
      'V. Diseña y justifica tu robot': 'V. Design and justify your robot',
      '¿Qué sensor necesita este robot? Justifica tu elección: ¿qué percibe y para qué le sirve?':
        'Which sensor does this robot need? Justify your choice: what does it sense and what for?',
      '¿Qué sensor necesita este robot? Justifica tu elección.': 'Which sensor does this robot need? Justify your choice.',
      'Esta afirmación tiene dos errores. Corrígelos con argumentos, usando el ciclo percibir → decidir → actuar:':
        'This statement contains two mistakes. Correct them with arguments, using the sense → think → act cycle:',
      'Inventa un robot que resuelva este problema: escribe su nombre, qué SENSORES usa (¿qué percibe?), qué DECIDE su controlador («si pasa X, entonces hace Y») y con qué ACTUADORES actúa. Puedes dibujarlo en tu cuaderno.':
        'Invent a robot that solves this problem: write its name, which SENSORS it uses (what does it sense?), what its controller DECIDES («if X happens, then it does Y») and which ACTUATORS it acts with. You may draw it in your notebook.',
      'Inventa un robot que resuelva este problema: escribe su nombre, qué SENSORES usa, qué DECIDE su controlador («si pasa X, entonces hace Y») y con qué ACTUADORES actúa. Dibújalo al reverso de la hoja.':
        'Invent a robot that solves this problem: write its name, which SENSORS it uses, what its controller DECIDES («if X happens, then it does Y») and which ACTUATORS it acts with. Draw it on the back of the sheet.',
      'I. Corrige el error': 'I. Correct the mistake', 'II. Corrige el error': 'II. Correct the mistake',
      'III. Analiza el ciclo': 'III. Analyze the cycle', 'IV. Comparación': 'IV. Comparison',
      'V. Diseña tu robot — Rúbrica': 'V. Design your robot — Rubric',
      'Percibe:': 'Senses:', 'Decide:': 'Decides:', 'Actúa:': 'Acts:',
      /* — impresión: encabezados, pauta y pie — */
      'Evaluación ¿Qué es un Robot?': 'Test · What Is a Robot?',
      'Pensamiento Crítico ¿Qué es un Robot?': 'Critical Thinking · What Is a Robot?',
      '✅ PAUTA — Evaluación Final · ¿Qué es un Robot?': '✅ ANSWER KEY — Final Test · What Is a Robot?',
      '✅ PAUTA — Pensamiento Crítico · ¿Qué es un Robot?': '✅ ANSWER KEY — Critical Thinking · What Is a Robot?',
      /* — constancia — */
      'Misión ¿Qué es un Robot?': 'Mission · What Is a Robot?',
      '¡Sigue adelante!': 'Keep going!', '¡Sigue aprendiendo!': 'Keep learning!',
      '¡Muy buen trabajo!': 'Great work!', '¡Vas muy bien!': 'You are doing very well!',
      '¡Dominas las partes del robot!': 'You have mastered the robot parts!',
      '¡Maestro Constructor de Robots!': 'Master Robot Builder!',
      /* — trozos sueltos: frases que el <strong> parte en varios nodos — */
      'para poner los pasos del robot en el orden correcto:': 'arrows to put the robot steps in the right order:',
      'Los sensores captan luz y distancia. →': 'Sensors pick up light and distance. →',
      'Sensores': 'Sensors',
      '. Corrígelos con argumentos, usando el ciclo percibir → decidir → actuar:': '. Correct them with arguments, using the sense → think → act cycle:'
    },

    /* ══════════════════════════════════════════════════════
       4. FRAGMENTOS (textos con números o nombres variables)
       ══════════════════════════════════════════════════════ */
    fragmentos: [
      [/Pregunta (\d+) de (\d+)/g, 'Question $1 of $2'],
      [/Oración (\d+) de (\d+)/g, 'Sentence $1 of $2'],
      [/Pista (\d+) de (\d+)/g, 'Clue $1 of $2'],
      [/Caso (\d+):/g, 'Case $1:'],
      [/🃏 Parejas: (\d+) de (\d+) · Intentos: (\d+)/g, '🃏 Pairs: $1 of $2 · Tries: $3'],
      [/✅ (\d+) correctas \| ❌ (\d+) errores/g, '✅ $1 correct | ❌ $2 wrong'],
      [/¡Memoria completada en (\d+) intentos! \+2 XP extra/g, 'Memory game finished in $1 tries! +2 XP bonus'],
      [/Resultado: (\d+)\/(\d+) \((\d+)%\) ¡Bien hecho!/g, 'Result: $1/$2 ($3%) Well done!'],
      [/✅ ¡Encontraste: ([A-ZÑ]+)!/g, '✅ You found $1!'],
      [/🔄 Grupo: (.+?) vs (.+)/g, '🔄 Group: $1 vs $2'],
      [/🔄 Pareja: (.+?) vs (.+)/g, '🔄 Pair: $1 vs $2'],
      [/🔄 Caso: /g, '🔄 Case: '],
      [/🏅 ¡Logro desbloqueado! /g, '🏅 Achievement unlocked! '],
      [/La respuesta correcta es: /g, 'The correct answer is: '],
      /* la corrección larga va ANTES que la genérica, o esta se la come y el
         «Pregúntate…» del final se queda en español */
      [/Correcto: (.+)\. Pregúntate: ¿percibe\?, ¿decide\?, ¿actúa\?/g, 'Correct: $1. Ask yourself: does it sense? does it decide? does it act?'],
      [/^Correcto: /g, 'Correct: '],
      [/Busca: /g, 'Look for: '],
      [/🔬 Explorando: /g, '🔬 Exploring: '],
      [/Forma (\d+)/g, 'Form $1'],
      [/🎓 Evaluación Final · Form (\d+) · ¿Qué es un Robot\?/g, '🎓 Final Test · Form $1 · What Is a Robot?'],
      [/🧠 Pensamiento Crítico · Form (\d+) · ¿Qué es un Robot\?/g, '🧠 Critical Thinking · Form $1 · What Is a Robot?'],
      [/Revisar\. Respuesta esperada: /g, 'Check again. Expected answer: '],
      [/Pareados: (\d+)\/5 correctos\. Excelente\. \+25 pts/g, 'Matching: $1/5 correct. Excellent. +25 pts'],
      [/Pareados: (\d+)\/5 correctos\. Clave: /g, 'Matching: $1/5 correct. Key: '],
      [/Resultado automático: (\d+)\/100 puntos/g, 'Automatic result: $1/100 points'],
      [/Completar: (\d+)\/25 · V\/F: (\d+)\/25 · Selección: (\d+)\/25 · Pareados: (\d+)\/25/g,
        'Fill in: $1/25 · T/F: $2/25 · Multiple choice: $3/25 · Matching: $4/25'],
      [/Puntaje total autoevaluado: (\d+)\/100/g, 'Self-assessed total score: $1/100'],
      [/🎯 Evaluación calificada: (\d+)\/100/g, '🎯 Test graded: $1/100'],
      [/🧮 Evaluación calificada: (\d+)\/100\. Revisa las respuestas marcadas\./g, '🧮 Test graded: $1/100. Check the marked answers.'],
      [/🎯 Pensamiento crítico: (\d+)\/100/g, '🎯 Critical thinking: $1/100'],
      [/🧮 Puntaje registrado: (\d+)\/100\. ¡Sigue practicando!/g, '🧮 Score saved: $1/100. Keep practicing!'],
      [/📝 Opciones: /g, '📝 Options: '],
      [/✅ Respuestas:/g, '✅ Answers:'],
      [/🎯 Clave rápida estilo ZipGrade · Form (\d+) — respuestas correctas ya rellenadas para digitar la clave en la app/g,
        '🎯 ZipGrade-style quick key · Form $1 — correct answers already filled in so you can type the key into the app'],
      [/Test Version \/ Form:/g, 'Test Version / Form:'],
      /* fecha de la constancia: «24 de julio de 2026» → «July 24, 2026» */
      [/(\d+) de enero de (\d+)/g, 'January $1, $2'], [/(\d+) de febrero de (\d+)/g, 'February $1, $2'],
      [/(\d+) de marzo de (\d+)/g, 'March $1, $2'], [/(\d+) de abril de (\d+)/g, 'April $1, $2'],
      [/(\d+) de mayo de (\d+)/g, 'May $1, $2'], [/(\d+) de junio de (\d+)/g, 'June $1, $2'],
      [/(\d+) de julio de (\d+)/g, 'July $1, $2'], [/(\d+) de agosto de (\d+)/g, 'August $1, $2'],
      [/(\d+) de septiembre de (\d+)/g, 'September $1, $2'], [/(\d+) de octubre de (\d+)/g, 'October $1, $2'],
      [/(\d+) de noviembre de (\d+)/g, 'November $1, $2'], [/(\d+) de diciembre de (\d+)/g, 'December $1, $2'],
      [/^Fecha: /g, 'Date: ']
    ]
  };
})();
