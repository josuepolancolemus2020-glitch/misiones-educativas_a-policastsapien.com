/* ============================================================
   Misión «Electricidad para Robots» — versión en inglés
   ------------------------------------------------------------
   Traducción de autor (no automática) para escuelas bilingües.
   Se carga junto a la misión y el motor js/metas-i18n.js la
   activa con el botón 🌐 English de la barra superior.

   Criterio de traducción:
   · Inglés AMERICANO estricto: color, center, catalog, analyze,
     practicing, flashlight (no torch), «Student No.».
   · Vocabulario eléctrico escolar estándar: circuit · source ·
     wires · switch · load · closed/open circuit · series ·
     parallel · conductor · insulator · voltage · current ·
     resistance · short circuit · polarity.
   · Lo cultural se explica, no se calca: pulpería → corner store,
     caserío → small village, apagón → power outage, arbolito →
     Christmas tree.
   · Los bancos son traducción ÍNDICE A ÍNDICE del español: las
     formas deterministas de la evaluación (1–30) sacan las mismas
     preguntas y la misma clave ZipGrade en los dos idiomas.

   Estructura: html (bloques) · data (bancos) · frases y
   fragmentos (textos que el JS arma al vuelo, incluidos el
   laboratorio de circuitos y las pruebas imprimibles).
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

    titulo: 'Mission Electricity for Robots | policastsapien.com',

    /* ══════════════════════════════════════════════════════
       1. BLOQUES DE CONTENIDO (data-i18n en el HTML)
       ══════════════════════════════════════════════════════ */
    html: {

      hero:
        '<h1>Mission <span>Electricity for Robots</span></h1>' +
        '<p class="sub">Build the circuit, close the switch and find out why the LED lights up. With batteries, wires and plenty of safety! 🔋🔌💡</p>' +
        '<div class="badge">🤖 Robot Path · Stage 4 of 6 · Robotics</div>',

      a1:
        '<h2>🔌 The basic circuit</h2>' +
        '<p>An <strong>electric circuit</strong> is a <strong>closed path</strong> that current travels along. ' +
        'If the path is cut at any point, <strong>nothing works</strong>. Every basic circuit has four parts:</p>' +
        '<div class="type-grid">' +
        '<div class="type-chip tc-gold"><div class="t-art">🔋 Source</div><div class="t-info">The battery: it pushes the current. It has a + terminal and a − terminal</div></div>' +
        '<div class="type-chip tc-teal"><div class="t-art">🧵 Wires</div><div class="t-info">The path: copper inside (it conducts), plastic outside (it insulates)</div></div>' +
        '<div class="type-chip tc-amber"><div class="t-art">🔘 Switch</div><div class="t-info">The gate: it opens or closes the way for the current</div></div>' +
        '<div class="type-chip tc-jade"><div class="t-art">💡 Load</div><div class="t-info">Whatever puts the electricity to use: an LED, a motor or a buzzer</div></div>' +
        '</div>' +
        '<div class="tip">' +
        '<span class="ti">💡</span>' +
        '<div><strong>Think of it this way:</strong> current is like the water in an irrigation ditch. The <b>battery</b> is the pump that pushes, ' +
        'the <b>wires</b> are the channel, the <b>switch</b> is the floodgate and the <b>LED</b> is the mill that puts the water to work. ' +
        'If the channel breaks, the mill stops.</div>' +
        '</div>',

      a2:
        '<h2>🟢🔴 Closed circuit and open circuit</h2>' +
        '<p>The <strong>switch</strong> decides whether the path is complete or cut:</p>' +
        '<div class="vs-grid">' +
        '<div class="vs-box vs-a">' +
        '<h4>🟢 Closed</h4>' +
        '<p>The path is <strong>complete</strong>: the current leaves the <strong>+</strong> terminal of the battery, runs along the wire, ' +
        'goes through the load and comes back to the <strong>−</strong>. The LED lights up, the motor spins, the buzzer sounds.</p>' +
        '</div>' +
        '<div class="vs-box vs-b">' +
        '<h4>🔴 Open</h4>' +
        '<p>The path is <strong>cut</strong> (switch turned off, loose wire or a burned-out bulb in series). ' +
        'The current <strong>cannot flow</strong> and nothing works, no matter how good the battery is.</p>' +
        '</div>' +
        '</div>' +
        '<div class="tip">' +
        '<span class="ti">⚡</span>' +
        '<div><strong>Link with the mission «Energy»:</strong> electricity is a <b>form of energy</b>. In the LED it turns into ' +
        '<b>light</b>, in the motor into <b>movement</b> and in the buzzer into <b>sound</b>. Energy is neither created ' +
        'nor destroyed: it is transformed!</div>' +
        '</div>',

      a3:
        '<h2>🦺 Electrical safety: the most important rule</h2>' +
        '<p>Electricity is useful, but it can also do harm. In the classroom and at home these rules are followed:</p>' +
        '<div class="seg-grid">' +
        '<div class="seg-item seg-si"><b>✅ Do this</b>Experiment only with <strong>batteries</strong> (1.5 V or 9 V), with <strong>dry hands</strong> and with properly insulated wires.</div>' +
        '<div class="seg-item seg-no"><b>⛔ Never do this</b>Experiment with the <strong>110 V wall outlet</strong>, or push wires or nails into the sockets.</div>' +
        '<div class="seg-item seg-no"><b>⛔ Never do this</b>Touch appliances, plugs or wires with <strong>wet hands</strong>: water with salts in it <strong>conducts</strong>.</div>' +
        '<div class="seg-item seg-no"><b>⛔ Never do this</b>Join the two terminals of a battery with a wire: that is a <strong>short circuit</strong> and the battery <strong>heats up</strong>.</div>' +
        '<div class="seg-item seg-si"><b>✅ Do this</b>Take <strong>used batteries</strong> to a collection point: they do not go in the regular trash because they pollute the soil and the water.</div>' +
        '<div class="seg-item seg-si"><b>✅ Do this</b>Unplug the <strong>cell phone charger</strong> by pulling on the plug, never on the cord.</div>' +
        '</div>' +
        '<div class="tip">' +
        '<span class="ti">🇭🇳</span>' +
        '<div><strong>In Honduras:</strong> during a <b>power outage</b>, the battery flashlight works because it carries its own ' +
        'closed circuit. In small villages with no power lines, the <b>solar panel</b> charges a battery during the day and at night ' +
        'it lights the LEDs. And the <b>cell phone charger</b> turns the 110 V from the outlet into a small, safe voltage.</div>' +
        '</div>',

      e1:
        '<h2>➖🛣️ Series and parallel</h2>' +
        '<p>When there are <strong>two or more loads</strong>, they can be connected in two different ways:</p>' +
        '<div style="overflow-x:auto;">' +
        '<table style="width:100%;border-collapse:collapse;font-size:0.82rem;min-width:480px;">' +
        '<thead>' +
        '<tr style="background:var(--pri-gl);">' +
        '<th style="padding:0.4rem 0.5rem;border:1px solid var(--border);text-align:left;">Connection</th>' +
        '<th style="padding:0.4rem 0.5rem;border:1px solid var(--border);">🛣️ How many paths?</th>' +
        '<th style="padding:0.4rem 0.5rem;border:1px solid var(--border);">💥 If one burns out…</th>' +
        '<th style="padding:0.4rem 0.5rem;border:1px solid var(--border);">💪 Voltage</th>' +
        '<th style="padding:0.4rem 0.5rem;border:1px solid var(--border);">Example</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:700;">➖ In series</td><td style="padding:0.4rem;border:1px solid var(--border);text-align:center;">Just one</td><td style="padding:0.4rem;border:1px solid var(--border);text-align:center;">They ALL go out</td><td style="padding:0.4rem;border:1px solid var(--border);text-align:center;">They share it (they shine dimly)</td><td style="padding:0.4rem;border:1px solid var(--border);font-weight:600;">Old Christmas tree lights</td></tr>' +
        '<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:700;">🛣️ In parallel</td><td style="padding:0.4rem;border:1px solid var(--border);text-align:center;">One for each load</td><td style="padding:0.4rem;border:1px solid var(--border);text-align:center;">The rest keep going</td><td style="padding:0.4rem;border:1px solid var(--border);text-align:center;">Each one gets all of it</td><td style="padding:0.4rem;border:1px solid var(--border);font-weight:600;">The lights in your house</td></tr>' +
        '</tbody>' +
        '</table>' +
        '</div>' +
        '<div class="tip">' +
        '<span class="ti">🎯</span>' +
        '<div><strong>Golden rule:</strong> the <b>lights in a house are wired in parallel</b>. That is why, when a bulb in the living room ' +
        'burns out, the one in the kitchen stays on.</div>' +
        '</div>',

      e2:
        '<h2>⚡ Lightning mini-quiz</h2>' +
        '<p style="font-size:0.9rem;margin-bottom:0.5rem;">1) You close the switch and the LED <strong>does not light up</strong>. You check and there is a <strong>loose wire</strong>. What happened?</p>' +
        '<div class="cmp-opts" role="group" style="margin-bottom:0.4rem;">' +
        '<button class="cmp-opt" onclick="miniQ(this,false,\'fbMq1\')">The battery ran out</button>' +
        '<button class="cmp-opt" onclick="miniQ(this,true,\'fbMq1\')">The circuit was left open: the path is cut</button>' +
        '<button class="cmp-opt" onclick="miniQ(this,false,\'fbMq1\')">The LED ended up in parallel</button>' +
        '</div>' +
        '<div id="fbMq1" class="fb" role="alert"></div>' +
        '<p style="font-size:0.9rem;margin:0.9rem 0 0.5rem;">2) In a string of bulbs wired <strong>in series</strong> one burns out and <strong>they all go dark</strong>. Why?</p>' +
        '<div class="cmp-opts" role="group" style="margin-bottom:0.4rem;">' +
        '<button class="cmp-opt" onclick="miniQ(this,true,\'fbMq2\')">Because there is a single path and the burned-out bulb opens it</button>' +
        '<button class="cmp-opt" onclick="miniQ(this,false,\'fbMq2\')">Because the battery runs down faster</button>' +
        '<button class="cmp-opt" onclick="miniQ(this,false,\'fbMq2\')">Because copper is an insulator</button>' +
        '</div>' +
        '<div id="fbMq2" class="fb" role="alert"></div>',

      e3:
        '<h2>🟠🚫 Conductors and insulators</h2>' +
        '<p>Not every material lets current through. That is why a wire has <strong>copper inside</strong> and ' +
        '<strong>plastic outside</strong>: one conducts and the other one protects us.</p>' +
        '<div class="type-grid">' +
        '<div class="type-chip tc-gold"><div class="t-art">🟠 Copper</div><div class="t-info">CONDUCTOR: the best path for the current</div></div>' +
        '<div class="type-chip tc-gold"><div class="t-art">🔩 Iron and aluminum</div><div class="t-info">CONDUCTORS: they also let current through</div></div>' +
        '<div class="type-chip tc-teal"><div class="t-art">💧 Water with salts</div><div class="t-info">IT CONDUCTS: that is why never with wet hands</div></div>' +
        '<div class="type-chip tc-purple"><div class="t-art">🚫 Plastic and rubber</div><div class="t-info">INSULATORS: they do not let current through</div></div>' +
        '<div class="type-chip tc-purple"><div class="t-art">🪵 Dry wood and glass</div><div class="t-info">INSULATORS: useful for holding things safely</div></div>' +
        '</div>' +
        '<div class="tip">' +
        '<span class="ti">💧</span>' +
        '<div><strong>Careful:</strong> «pure» water barely conducts, but tap water, river water and <b>sweat</b> ' +
        'carry <b>salts</b> and do conduct. Wet hands + electricity = danger.</div>' +
        '</div>',

      e4:
        '<h2>💪🌊🪨 Voltage, current and resistance</h2>' +
        '<p>Three words that always come together. Comparing them with water makes them easier to understand:</p>' +
        '<div class="type-grid">' +
        '<div class="type-chip tc-teal"><div class="t-art">💪 Voltage (V)</div><div class="t-info">The PUSH the source gives. AA battery = 1.5 V; wall outlet = 110 V</div></div>' +
        '<div class="type-chip tc-gold"><div class="t-art">🌊 Current (A)</div><div class="t-info">The AMOUNT of electricity going through the wire</div></div>' +
        '<div class="type-chip tc-amber"><div class="t-art">🪨 Resistance (Ω)</div><div class="t-info">The OBSTACLE that opposes the flow of current</div></div>' +
        '<div class="type-chip tc-jade"><div class="t-art">💡 LED + resistor</div><div class="t-info">With no resistor too much current goes through and the LED burns out</div></div>' +
        '</div>' +
        '<div class="tip">' +
        '<span class="ti">➕➖</span>' +
        '<div><strong>LED polarity:</strong> an LED only lights up <b>one way round</b>: its <b>long leg</b> goes to the ' +
        '<b>+</b> and its <b>short leg</b> to the <b>−</b>. If you connect the battery backwards, the LED stays dark. A flashlight ' +
        'bulb and a two-wire buzzer do work either way; a motor just changes its direction of rotation.</div>' +
        '</div>',

      labctl:
        '<div class="lab-group">' +
        '<span class="lab-group-label">🧪 Case:</span>' +
        '<button class="lab-btn lab-cont-btn" data-caso="correcto" onclick="labShowCaso(\'correcto\')">✅ Correct</button>' +
        '<button class="lab-btn lab-cont-btn" data-caso="motor" onclick="labShowCaso(\'motor\')">⚙️ With a motor</button>' +
        '<button class="lab-btn lab-cont-btn" data-caso="suelto" onclick="labShowCaso(\'suelto\')">✂️ Loose wire</button>' +
        '<button class="lab-btn lab-cont-btn" data-caso="reves" onclick="labShowCaso(\'reves\')">🔄 Battery backwards</button>' +
        '<button class="lab-btn lab-cont-btn" data-caso="corto" onclick="labShowCaso(\'corto\')">⚠️ Short circuit</button>' +
        '<button class="lab-btn lab-cont-btn" data-caso="serie" onclick="labShowCaso(\'serie\')">➖ Series</button>' +
        '<button class="lab-btn lab-cont-btn" data-caso="serie-quemado" onclick="labShowCaso(\'serie-quemado\')">💥 Series, burned out</button>' +
        '<button class="lab-btn lab-cont-btn" data-caso="paralelo" onclick="labShowCaso(\'paralelo\')">🛣️ Parallel</button>' +
        '</div>',

      rec:
        '<h2>📁 Topic Resources</h2>' +
        '<div style="border:1.5px solid var(--border,#e2e8f0);border-radius:12px;padding:1rem 1.2rem;margin-bottom:1.2rem;background:rgba(0,0,0,0.02);">' +
        '<p style="font-size:0.98rem;font-weight:800;margin-bottom:0.4rem;">📄 Printable study sheet</p>' +
        '<p style="font-size:0.86rem;margin-bottom:0.85rem;">A 7-page study guide (theory, unplugged activities and assessment) to print or solve before the test. <em>It opens in English too — the language you choose here carries over.</em></p>' +
        '<a href="../../fichas/ficha-electricidad-robots.html" target="_blank" rel="noopener noreferrer" class="btn btn-pri" style="display:inline-flex;align-items:center;gap:0.5rem;text-decoration:none;font-size:1rem;padding:0.7rem 1.4rem;">📄 Open / print the study sheet</a>' +
        '</div>' +
        '<p style="font-size:0.9rem;margin-bottom:1rem;">Here you will find support materials for this mission: slide decks, PDF documents, study guides and more. Your teacher keeps adding resources to this folder.</p>' +
        '<a href="https://drive.google.com/drive/folders/1electricidad_robots_recursos" target="_blank" rel="noopener noreferrer" class="btn btn-pri" style="display:inline-flex;align-items:center;gap:0.5rem;text-decoration:none;font-size:1rem;padding:0.7rem 1.4rem;">📂 Open the folder in Google Drive</a>' +
        '<div class="tip" style="margin-top:1.2rem;"><span class="ti">💡</span>' +
        '<div>Files open straight in your browser. You can download them or view them without a Google account.</div></div>'
    },

    /* ══════════════════════════════════════════════════════
       2. BANCOS DE DATOS (los cambia MISION_APLICAR_IDIOMA)
       ══════════════════════════════════════════════════════ */
    data: {

      ACHIEVEMENTS: {
        primer_quiz: { icon: '⚡', label: 'First electricity quiz completed' },
        flash_master: { icon: '🃏', label: 'All circuit flashcards explored' },
        clasif_pro: { icon: '🗂️', label: 'Expert conductor and insulator sorter' },
        id_master: { icon: '🔍', label: 'Master circuit-part spotter' },
        reto_hero: { icon: '🏆', label: 'Conductor vs Insulator challenge hero' },
        nivel3: { icon: '🔌', label: 'Circuit Builder! Level 3' },
        nivel5: { icon: '🥇', label: 'Electrical Engineer! Level 6' },
        widgets_master: { icon: '🧩', label: 'Electric circuit widgets mastered' },
        lab_circuito: { icon: '💡', label: 'Circuit lab: all 8 cases predicted' },
        seguridad_pro: { icon: '🦺', label: 'Electrical troubleshooting and safety technician' }
      },

      lvls: [
        { t: 0, n: 'Beginner 🌱' }, { t: 25, n: 'Curious Spark ⚡' }, { t: 55, n: 'Circuit Builder 🔌' },
        { t: 90, n: 'LED Technician 💡' }, { t: 130, n: 'Fault Hunter 🔧' },
        { t: 165, n: 'Electrical Engineer 🛠️' }, { t: 190, n: 'Master of the Circuit ⚡' }
      ],

      fcData: [
        { w: 'Electric circuit', a: '🔌 A <strong>closed path</strong> that current travels along: source + wires + switch + load.' },
        { w: 'Source (battery)', a: '🔋 The part that <strong>pushes</strong> the current. It has two terminals: <strong>+</strong> and <strong>−</strong>.' },
        { w: 'Wire', a: '🧵 The <strong>path</strong> of the current. It carries <strong>copper</strong> inside (it conducts) and plastic outside (it insulates).' },
        { w: 'Switch', a: '🔘 The «gate» of the circuit: it <strong>closes</strong> it (current flows) or <strong>opens</strong> it (nothing gets through).' },
        { w: 'Load', a: '💡 Whatever <strong>puts</strong> the electricity <strong>to use</strong>: an LED, a motor or a buzzer.' },
        { w: 'Closed circuit', a: '🟢 The path is <strong>complete</strong>: the current leaves the battery, goes through the load and comes back. It works!' },
        { w: 'Open circuit', a: '🔴 The path is <strong>cut</strong> (switch open or loose wire): <strong>nothing works</strong>.' },
        { w: 'Series circuit', a: '➖ A <strong>single path</strong>: the bulbs share the voltage and, if one burns out, <strong>they all go dark</strong>.' },
        { w: 'Parallel circuit', a: '🛣️ <strong>Each load has its own path</strong>: if one fails, the others keep going. That is how the lights in your house are wired.' },
        { w: 'Conductor', a: '🟠 A material that <strong>lets current through</strong>: copper, aluminum, iron, water with salts.' },
        { w: 'Insulator', a: '🚫 A material that <strong>does not let current through</strong>: plastic, dry wood, rubber, glass.' },
        { w: 'Voltage', a: '💪 The <strong>push</strong> the source gives, measured in <strong>volts (V)</strong>. An AA battery gives 1.5 V.' },
        { w: 'Current', a: '🌊 The <strong>amount</strong> of electricity going through the wire, measured in <strong>amperes (A)</strong>.' },
        { w: 'Resistance', a: '🪨 The <strong>obstacle</strong> that opposes the flow of current, measured in <strong>ohms (Ω)</strong>. It protects the LED.' },
        { w: 'LED polarity', a: '➕➖ An LED only lights up <strong>one way round</strong>: its long leg goes to the <strong>+</strong> and its short leg to the <strong>−</strong>.' },
        { w: 'Short circuit', a: '⚠️ A shortcut <strong>with no resistance</strong> between the two terminals: the load stays dark, the battery <strong>heats up</strong> and it is dangerous.' }
      ],

      memoPairs: [
        { id: 'pila', t: 'Battery', d: '🔋 the source that pushes the current' },
        { id: 'cable', t: 'Wire', d: '🧵 the copper path the current runs along' },
        { id: 'interruptor', t: 'Switch', d: '🔘 it opens or closes the path' },
        { id: 'led', t: 'LED', d: '💡 the load that gives light; it needs a resistor' },
        { id: 'conductor', t: 'Conductor', d: '🟠 it lets current through (copper)' },
        { id: 'aislante', t: 'Insulator', d: '🚫 it does not let current through (plastic)' }
      ],

      qzData: [
        { q: 'What does electric current need in order to flow?', o: ['a) A closed, complete path', 'b) Plenty of light', 'c) A magnet', 'd) To be wet'], c: 0 },
        { q: 'What are the four parts of a basic circuit?', o: ['a) Sun, water, air and soil', 'b) Source, wires, switch and load', 'c) Motor, wheel, screw and nail', 'd) Battery, bulb, paper and glue'], c: 1 },
        { q: 'What is the switch for?', o: ['a) To supply voltage', 'b) To heat up the wire', 'c) To open or close the path of the current', 'd) To paint the circuit'], c: 2 },
        { q: 'If a wire comes loose, what happens to the circuit?', o: ['a) It is left open and nothing works', 'b) It works faster', 'c) It becomes parallel', 'd) The battery recharges'], c: 0 },
        { q: 'In a SERIES circuit one bulb burns out. What happens?', o: ['a) The others shine brighter', 'b) They all go dark', 'c) Nothing happens', 'd) The battery explodes'], c: 1 },
        { q: 'Why are the lights in a house wired IN PARALLEL?', o: ['a) Because they use less wire', 'b) Because that way they shine dimmer', 'c) Because if one fails, the rest stay on', 'd) Because parallel needs no switch'], c: 2 },
        { q: 'Which of these materials is an INSULATOR?', o: ['a) Copper', 'b) Aluminum', 'c) Iron', 'd) Dry plastic'], c: 3 },
        { q: 'Why does an LED need a resistor?', o: ['a) So the current does not burn it out', 'b) So it weighs more', 'c) To give it color', 'd) To glue it to the wire'], c: 0 },
        { q: 'Which of these practices is SAFE?', o: ['a) Experimenting with the 110 V wall outlet', 'b) Touching wires with wet hands', 'c) Using only batteries for classroom experiments', 'd) Joining the two battery terminals with a wire'], c: 2 }
      ],

      classGroups: [
        {
          label: ['Conductor', 'Insulator'], headA: '🟠 Conductor (lets it through)', headB: '🚫 Insulator (blocks it)', colA: 'con', colB: 'ais',
          words: [{ w: 'Copper wire', t: 'con' }, { w: 'Plastic ruler', t: 'ais' }, { w: 'Iron nail', t: 'con' }, { w: 'Dry wooden stick', t: 'ais' }, { w: 'Aluminum foil', t: 'con' }, { w: 'Rubber eraser', t: 'ais' }, { w: 'Coin', t: 'con' }, { w: 'Glass', t: 'ais' }, { w: 'Salt water', t: 'con' }, { w: 'Dry cloth', t: 'ais' }]
        },
        {
          label: ['Series', 'Parallel'], headA: '➖ In series', headB: '🛣️ In parallel', colA: 'ser', colB: 'par',
          words: [{ w: 'A single path for the current', t: 'ser' }, { w: 'Each load has its own path', t: 'par' }, { w: 'If one burns out, they all go dark', t: 'ser' }, { w: 'If one burns out, the others keep going', t: 'par' }, { w: 'The bulbs share the voltage', t: 'ser' }, { w: 'Each bulb gets all the voltage', t: 'par' }, { w: 'Old Christmas tree lights', t: 'ser' }, { w: 'The lamps in your house', t: 'par' }]
        },
        {
          label: ['Closed circuit', 'Open circuit'], headA: '🟢 Closed (it works)', headB: '🔴 Open (it does not work)', colA: 'cer', colB: 'abi',
          words: [{ w: 'Switch pushed to ON', t: 'cer' }, { w: 'Wire loose from the battery', t: 'abi' }, { w: 'A complete path from battery to load', t: 'cer' }, { w: 'Switch turned off', t: 'abi' }, { w: 'The LED lit up', t: 'cer' }, { w: 'A wire cut in half', t: 'abi' }, { w: 'The motor spinning', t: 'cer' }, { w: 'The battery out of its holder', t: 'abi' }]
        },
        {
          label: ['Safe', 'Dangerous'], headA: '🦺 Safe practice', headB: '⚠️ Dangerous practice', colA: 'seg', colB: 'pel',
          words: [{ w: 'Experimenting only with batteries', t: 'seg' }, { w: 'Pushing wires into the wall outlet', t: 'pel' }, { w: 'Keeping your hands dry', t: 'seg' }, { w: 'Touching a wire with wet hands', t: 'pel' }, { w: 'Taking used batteries to a collection point', t: 'seg' }, { w: 'Joining the two battery terminals with a wire', t: 'pel' }, { w: 'Using wires with their plastic insulation on', t: 'seg' }, { w: 'Yanking the phone charger out by the cord', t: 'pel' }]
        }
      ],

      idData: [
        { s: ['The', 'battery', 'pushes', 'the', 'current', 'around', 'the', 'circuit.'], c: 1, art: 'the energy source of the circuit' },
        { s: ['The', 'switch', 'opens', 'and', 'closes', 'the', 'path.'], c: 1, art: 'the part that opens or closes the circuit' },
        { s: ['Inside', 'the', 'wire', 'there', 'is', 'copper.'], c: 5, art: 'the conducting metal inside the wire' },
        { s: ['The', 'LED', 'needs', 'a', 'resistor', 'so', 'it', 'does', 'not', 'burn', 'out.'], c: 4, art: 'the part that protects the LED' },
        { s: ['An', 'open', 'circuit', 'does', 'not', 'let', 'the', 'current', 'through.'], c: 1, art: 'the state of the circuit when the path is cut' },
        { s: ['In', 'series', 'all', 'the', 'bulbs', 'go', 'dark.'], c: 1, art: 'the connection with a single path' },
        { s: ['In', 'parallel', 'each', 'bulb', 'has', 'its', 'own', 'path.'], c: 1, art: 'the connection with several paths' },
        { s: ['The', 'plastic', 'around', 'the', 'wire', 'is', 'an', 'insulator.'], c: 7, art: 'the material that does not let current through' }
      ],

      cmpData: [
        { s: 'Current only flows if the path is ___.', opts: ['closed', 'painted', 'wet'], c: 0 },
        { s: 'The battery is the ___ of energy of the circuit.', opts: ['load', 'source', 'resistor'], c: 1 },
        { s: 'The ___ opens or closes the way for the current.', opts: ['wire', 'LED', 'switch'], c: 2 },
        { s: 'Inside the wire there is ___, which is a good conductor.', opts: ['copper', 'glass', 'rubber'], c: 0 },
        { s: 'In a ___ circuit, if one bulb burns out they all go dark.', opts: ['parallel', 'series', 'open'], c: 1 },
        { s: 'The lights in a house are wired in ___.', opts: ['series', 'a short circuit', 'parallel'], c: 2 },
        { s: '___ is the push the battery gives to the current.', opts: ['Voltage', 'Sound', 'Weight'], c: 0 },
        { s: 'For classroom experiments we use only ___.', opts: ['the wall outlet', 'batteries', 'lightning'], c: 1 }
      ],

      routeSets: [
        {
          label: 'The battery flashlight during a power outage', steps: [
            'The current leaves the + terminal of the battery',
            'It travels along the wire up to the switch',
            'The closed switch lets it through',
            'The current reaches the bulb and lights it up',
            'It comes back along the other wire to the − terminal of the battery']
        },
        {
          label: 'The classroom car with a motor', steps: [
            'The battery pushes the current out of its + terminal',
            'The wire carries the current up to the switch',
            'With the switch closed the path is complete',
            'The motor receives the current and makes the wheel spin',
            'The current returns to the battery and the cycle goes on']
        },
        {
          label: 'The solar lamp in the village', steps: [
            'The solar panel takes in sunlight and produces electricity',
            'The electricity is stored in the battery during the day',
            'When night falls, the lamp circuit closes',
            'The LED lights up and brightens the yard',
            'At daybreak the circuit opens and the LED goes out']
        }
      ],

      neuronPartes: [
        { desc: 'You want the light to go on and off without unplugging the wires', ans: 'A switch', opts: ['A switch', 'A resistor', 'An insulator', 'A solar panel'] },
        { desc: 'You need the push (voltage) so the current will flow', ans: 'A battery', opts: ['A battery', 'A wire', 'A switch', 'A buzzer'] },
        { desc: 'You want to turn electricity into movement', ans: 'A motor', opts: ['A motor', 'An LED', 'A wire', 'A resistor'] },
        { desc: 'You want to turn electricity into light using very little energy', ans: 'An LED', opts: ['An LED', 'A motor', 'A switch', 'An insulator'] },
        { desc: 'You want to turn electricity into sound to make a doorbell', ans: 'A buzzer', opts: ['A buzzer', 'An LED', 'A wire', 'A battery'] },
        { desc: 'You must protect the LED so the current does not burn it out', ans: 'A resistor', opts: ['A resistor', 'A motor', 'A switch', 'A solar panel'] },
        { desc: 'You need to join the battery to the load to form the path', ans: 'A copper wire', opts: ['A copper wire', 'A wooden stick', 'A plastic ruler', 'A piece of glass'] },
        { desc: 'You want to cover the joint between two wires so nobody gets a shock', ans: 'Electrical tape', opts: ['Electrical tape', 'Aluminum foil', 'Copper wire', 'Salt water'] }
      ],

      neuroPairs: [
        { trans: 'Battery', func: 'It gives the voltage that pushes the current', opts: ['It gives the voltage that pushes the current', 'It opens and closes the path', 'It turns electricity into light', 'It blocks the flow of current'] },
        { trans: 'Switch', func: 'It opens or closes the path of the current', opts: ['It opens or closes the path of the current', 'It pushes the current', 'It spins the wheel of the car', 'It covers the wire on the outside'] },
        { trans: 'LED', func: 'It turns electricity into light', opts: ['It turns electricity into light', 'It turns electricity into movement', 'It stores the energy of the sun', 'It cuts off the flow of current'] },
        { trans: 'Motor', func: 'It turns electricity into movement', opts: ['It turns electricity into movement', 'It turns electricity into sound', 'It measures the voltage of the battery', 'It insulates the wire'] },
        { trans: 'Resistor', func: 'It gets in the way of the current and protects the LED', opts: ['It gets in the way of the current and protects the LED', 'It raises the voltage of the battery', 'It closes the circuit', 'It conducts better than copper'] }
      ],

      enfermedadData: [
        { disease: 'Building a circuit with an AA battery, wire and a small bulb', characteristic: 'Safe', opts: ['Safe', 'Dangerous'] },
        { disease: 'Pushing a wire into the 110 V wall outlet', characteristic: 'Dangerous', opts: ['Dangerous', 'Safe'] },
        { disease: 'Touching the cell phone charger with wet hands', characteristic: 'Dangerous', opts: ['Dangerous', 'Safe'] },
        { disease: 'Joining the + and − terminals of the battery with a wire', characteristic: 'Dangerous', opts: ['Dangerous', 'Safe'] },
        { disease: 'Taking used batteries to a collection point', characteristic: 'Safe', opts: ['Safe', 'Dangerous'] },
        { disease: 'Using wires whose plastic insulation is in good shape', characteristic: 'Safe', opts: ['Safe', 'Dangerous'] }
      ],

      retoPairs: [
        {
          label: ['Conductor', 'Insulator'], btnA: '🟠 Conductor', btnB: '🚫 Insulator', colA: 'con', colB: 'ais',
          words: [{ w: 'Copper', t: 'con' }, { w: 'Plastic', t: 'ais' }, { w: 'Iron', t: 'con' }, { w: 'Dry wood', t: 'ais' }, { w: 'Aluminum', t: 'con' }, { w: 'Rubber', t: 'ais' }, { w: 'Coin', t: 'con' }, { w: 'Glass', t: 'ais' }, { w: 'Salt water', t: 'con' }, { w: 'Dry cloth', t: 'ais' }]
        },
        {
          label: ['Series', 'Parallel'], btnA: '➖ Series', btnB: '🛣️ Parallel', colA: 'ser', colB: 'par',
          words: [{ w: 'A single path', t: 'ser' }, { w: 'Several paths', t: 'par' }, { w: 'If one fails, they all go dark', t: 'ser' }, { w: 'If one fails, the others keep going', t: 'par' }, { w: 'They share the voltage', t: 'ser' }, { w: 'Each one gets all the voltage', t: 'par' }, { w: 'They shine dimmer', t: 'ser' }, { w: 'The lights in the house', t: 'par' }, { w: 'Old Christmas tree lights', t: 'ser' }, { w: 'The classroom wall outlets', t: 'par' }]
        },
        {
          label: ['Source', 'Load'], btnA: '🔋 Source', btnB: '💡 Load', colA: 'fue', colB: 'car',
          words: [{ w: 'AA battery', t: 'fue' }, { w: 'LED', t: 'car' }, { w: 'Cell phone battery', t: 'fue' }, { w: 'Motor', t: 'car' }, { w: 'Solar panel', t: 'fue' }, { w: 'Buzzer', t: 'car' }, { w: '9 V battery', t: 'fue' }, { w: 'Flashlight bulb', t: 'car' }, { w: 'Wall outlet', t: 'fue' }, { w: 'Fan', t: 'car' }]
        }
      ],

      identifyTaskDB: [
        { s: 'The closed path that current flows along is called a circuit.', type: 'Circuit' },
        { s: 'The battery gives the push, or voltage, that moves the current.', type: 'Source' },
        { s: 'The switch opens or closes the way for the current.', type: 'Switch' },
        { s: 'The copper in the wire lets current through easily.', type: 'Conductor' },
        { s: 'The plastic around the wire does not let current through.', type: 'Insulator' },
        { s: 'The LED turns electricity into light and needs a resistor.', type: 'Load (LED)' },
        { s: 'The motor turns electricity into movement.', type: 'Load (motor)' },
        { s: 'If one bulb burns out and they all go dark, they are wired this way.', type: 'Series circuit' },
        { s: 'If one bulb burns out and the rest stay on, they are wired this way.', type: 'Parallel circuit' },
        { s: 'When the battery heats up because the current found a shortcut with no load.', type: 'Short circuit' }
      ],

      classifyTaskDB: [
        { w: 'Copper wire', gen: 'Yes, very well', n: 'Metal (copper)', g: 'Conductor', t: 'It forms the path of the circuit' },
        { w: 'Plastic ruler', gen: 'No', n: 'Plastic', g: 'Insulator', t: 'It is there to protect us, not to conduct' },
        { w: 'Iron nail', gen: 'Yes', n: 'Metal (iron)', g: 'Conductor', t: 'It can join two points of the circuit' },
        { w: 'Dry wooden stick', gen: 'No', n: 'Dry wood', g: 'Insulator', t: 'It works as a handle or a support' },
        { w: 'Aluminum foil', gen: 'Yes', n: 'Metal (aluminum)', g: 'Conductor', t: 'It can replace a wire in a battery experiment' },
        { w: 'Rubber eraser', gen: 'No', n: 'Rubber', g: 'Insulator', t: 'It insulates and protects your hands' },
        { w: 'Salt water', gen: 'Yes', n: 'Liquid with salts', g: 'Conductor', t: 'That is why you NEVER touch appliances with wet hands' },
        { w: 'Glass', gen: 'No', n: 'Glass', g: 'Insulator', t: 'It is used to hold parts without letting current through' }
      ],

      completeTaskDB: [
        { s: 'Current flows only if the path is ___.', opts: ['closed', 'broken', 'painted'], ans: 'closed' },
        { s: 'The battery is the ___ of energy of the circuit.', opts: ['source', 'load', 'resistor'], ans: 'source' },
        { s: 'The ___ opens or closes the way for the current.', opts: ['switch', 'wire', 'LED'], ans: 'switch' },
        { s: 'Copper is a good ___ of electricity.', opts: ['conductor', 'insulator', 'magnet'], ans: 'conductor' },
        { s: 'Dry plastic is an ___.', opts: ['insulator', 'conductor', 'motor'], ans: 'insulator' },
        { s: 'In series, if one bulb burns out ___ go dark.', opts: ['they all', 'none of them', 'two'], ans: 'they all' },
        { s: 'The lights in a house are wired in ___.', opts: ['parallel', 'series', 'a short circuit'], ans: 'parallel' },
        { s: 'The LED needs a ___ so it does not burn out.', opts: ['resistor', 'battery', 'antenna'], ans: 'resistor' }
      ],

      explainQuestions: [
        { q: 'Draw a basic circuit and name its four parts. Explain the path the current travels.', ans: 'The drawing must show the source (battery), the wires, the switch and the load (LED, motor or buzzer). The current leaves the + terminal of the battery, runs along the wire, goes through the closed switch and the load, and comes back to the − terminal. If the path opens at any point, nothing works.' },
        { q: 'Explain in your own words the difference between a series circuit and a parallel circuit. Which one would you use for the lights in your house, and why?', ans: 'In series there is a single path: the bulbs share the voltage and if one burns out they all go dark. In parallel each bulb has its own path and gets all the voltage: if one burns out the rest stay on. Houses use parallel, because that way one burned-out lamp does not leave the whole home in the dark.' },
        { q: 'Make a list of 5 objects from your home and sort them into conductors and insulators. Explain how you know.', ans: 'Open answer. Metals (copper, iron, aluminum) and water with salts conduct; plastic, dry wood, rubber and glass insulate. You can tell by the material: wires carry copper inside (conductor) and plastic outside (insulator).' },
        { q: 'Write five electrical safety rules for your home and your school.', ans: 'Open answer. It should include: never with wet hands; do not experiment with the 110 V of the wall outlet (batteries only); do not push objects into the sockets; do not join the battery terminals (short circuit: the battery heats up); do not use bare wires; and do not throw used batteries in the regular trash.' },
        { q: 'Electricity is a form of energy. Explain what it turns into in an LED, in a motor and in a buzzer, and connect it with the mission Energy.', ans: 'In the LED, electrical energy turns into light energy; in the motor, into energy of movement (mechanical); in the buzzer, into sound energy. As you studied in the mission Energy, energy is neither created nor destroyed: it is transformed from one form into another.' }
      ],

      sopaSets: [
        _sopa(10, ['CIRCUIT', 'BATTERY', 'WIRE', 'SWITCH', 'MOTOR', 'LED'], 20260726),
        _sopa(12, ['CONDUCTOR', 'INSULATOR', 'PARALLEL', 'VOLTAGE', 'CURRENT', 'COPPER'], 41520268)
      ],

      evalTFBank: [
        { q: 'Electric current needs a closed path in order to flow.', a: true },
        { q: 'The switch is used to open or close the path of the current.', a: true },
        { q: 'Copper is a good conductor of electricity.', a: true },
        { q: 'Plastic and dry wood are good conductors.', a: false },
        { q: 'In a series circuit, if one bulb burns out they all go dark.', a: true },
        { q: 'In a parallel circuit, each load has its own path.', a: true },
        { q: 'The lights in a house are wired in series.', a: false },
        { q: 'An LED can be connected either way round because it has no polarity.', a: false },
        { q: 'An LED needs a resistor so the current does not burn it out.', a: true },
        { q: 'Voltage is the push the source gives to the current.', a: true },
        { q: 'Resistance is the obstacle that opposes the flow of current.', a: true },
        { q: 'To experiment in the classroom we should use the 110-volt wall outlet.', a: false },
        { q: 'We must never touch electrical appliances with wet hands.', a: true },
        { q: 'A short circuit heats up the battery and can be dangerous.', a: true },
        { q: 'Used batteries can be thrown in the regular household trash.', a: false }
      ],

      evalMCBank: [
        { q: 'What is an electric circuit?', o: ['a) A coiled-up wire', 'b) The closed path that current flows along', 'c) A dead battery', 'd) A painted bulb'], a: 1 },
        { q: 'What are the parts of a basic circuit?', o: ['a) Source, wires, switch and load', 'b) Sun, water, air and soil', 'c) Motor, wheel, screw and nail', 'd) Paper, glue, scissors and ruler'], a: 0 },
        { q: 'What is the switch for?', o: ['a) To raise the voltage', 'b) To paint the circuit', 'c) To open or close the path of the current', 'd) To cool the battery down'], a: 2 },
        { q: 'If a wire comes loose, the circuit is left…', o: ['a) In parallel', 'b) In series', 'c) Closed', 'd) Open, and nothing works'], a: 3 },
        { q: 'In a SERIES circuit one bulb burns out. What happens?', o: ['a) They all go dark', 'b) The others shine brighter', 'c) Nothing happens', 'd) The battery recharges'], a: 0 },
        { q: 'Why are the lights in a house wired IN PARALLEL?', o: ['a) Because they use less wire', 'b) Because if one fails, the rest stay on', 'c) Because they shine dimmer', 'd) Because they need no switch'], a: 1 },
        { q: 'Which of these materials is an INSULATOR?', o: ['a) Copper', 'b) Iron', 'c) Dry plastic', 'd) Salt water'], a: 2 },
        { q: 'Which of these materials is a CONDUCTOR?', o: ['a) Dry wood', 'b) Glass', 'c) Rubber', 'd) Copper wire'], a: 3 },
        { q: 'Why does an LED need a resistor?', o: ['a) So the current does not burn it out', 'b) To give it color', 'c) So it weighs more', 'd) To glue it to the wire'], a: 0 },
        { q: 'What does voltage measure?', o: ['a) The weight of the wire', 'b) The push the source gives to the current', 'c) The light of the bulb', 'd) The size of the battery'], a: 1 },
        { q: 'What is a short circuit?', o: ['a) A very short, pretty circuit', 'b) A parallel circuit', 'c) A shortcut with no load that heats up the battery', 'd) A colorful wire'], a: 2 },
        { q: 'Which of these practices is SAFE?', o: ['a) Pushing wires into the wall outlet', 'b) Touching plugs with wet hands', 'c) Joining the two battery terminals with wire', 'd) Experimenting only with batteries and insulated wires'], a: 3 },
        { q: 'In an LED, what does electrical energy turn into?', o: ['a) Light', 'b) Sound', 'c) Water', 'd) Wind'], a: 0 },
        { q: 'In a motor, what does electrical energy turn into?', o: ['a) Light', 'b) Movement', 'c) Cold', 'd) Paper'], a: 1 },
        { q: 'What do you do with used batteries?', o: ['a) Throw them in the regular trash', 'b) Bury them in the garden', 'c) Take them to a collection point or special drop-off', 'd) Throw them in the river'], a: 2 }
      ],

      evalCPBank: [
        { q: 'Current flows only if the path is ___.', a: 'closed' },
        { q: 'The battery is the ___ of energy of the circuit.', a: 'source' },
        { q: 'The ___ opens or closes the way for the current.', a: 'switch' },
        { q: 'Inside the wire there is ___, which is a good conductor.', a: 'copper' },
        { q: 'A material that does not let current through is called an ___.', a: 'insulator' },
        { q: 'A material that lets current through is called a ___.', a: 'conductor' },
        { q: 'In a ___ circuit there is a single path for the current.', a: 'series' },
        { q: 'In a ___ circuit each load has its own path.', a: 'parallel' },
        { q: 'The push the source gives is called ___.', a: 'voltage' },
        { q: 'The obstacle that opposes the flow of current is called ___.', a: 'resistance' },
        { q: 'The LED turns electricity into ___.', a: 'light' },
        { q: 'The motor turns electricity into ___.', a: 'movement' },
        { q: 'When the current finds a shortcut with no load, a ___ happens.', a: 'short circuit' },
        { q: 'To experiment in the classroom we use only ___.', a: 'batteries' },
        { q: 'The LED has ___: it only lights up connected one way round.', a: 'polarity' }
      ],

      evalPRBank: [
        { term: 'Electric circuit', def: 'A closed path that current flows along' },
        { term: 'Source', def: 'Battery that pushes the current' },
        { term: 'Switch', def: 'It opens or closes the path of the current' },
        { term: 'Wire', def: 'A copper path covered with plastic' },
        { term: 'Load', def: 'LED, motor or buzzer that puts the electricity to use' },
        { term: 'Open circuit', def: 'The path is cut and nothing works' },
        { term: 'Series circuit', def: 'A single path: if one burns out they all go dark' },
        { term: 'Parallel circuit', def: 'Each load has its path; that is how house lights are wired' },
        { term: 'Conductor', def: 'A material that lets current through, such as copper' },
        { term: 'Insulator', def: 'A material that blocks current, such as plastic' },
        { term: 'Voltage', def: 'The push of the source, measured in volts' },
        { term: 'Current', def: 'The amount of electricity going through, measured in amperes' },
        { term: 'Resistance', def: 'The obstacle to the flow of current; it protects the LED' },
        { term: 'Short circuit', def: 'A shortcut with no load that heats up the battery; it is dangerous' },
        { term: 'Polarity', def: 'The LED only lights up connected one way round' }
      ],

      critSensorBank: [
        { txt: 'You built the circuit with a battery, wires, a switch and an LED; you close the switch and the LED does NOT light up.', ans: 'Check in this order: ① that the path is complete (wires firmly attached, no loose ends), ② that the battery still has charge, ③ the polarity of the LED (long leg to +, short leg to −) and ④ that it has its resistor. A single open point is enough to stop everything.' },
        { txt: 'The bulb lights up only while you press the wires together with your hand; as soon as you let go it goes out.', ans: 'There is a loose contact: the circuit opens when you let go. The joint must be secured (twist the wire tightly, use electrical tape or a battery holder) so the path stays closed on its own.' },
        { txt: 'The battery gets extremely hot, so does the wire, and the load is still dark.', ans: 'It is a SHORT CIRCUIT: the current found a shortcut from + to − without going through the load. You must disconnect it right away (the battery can burn you or burst) and rebuild the circuit so the current goes through the load.' },
        { txt: 'You have two bulbs wired in series and neither lights up; on checking, one has a broken filament.', ans: 'In SERIES there is a single path: the burned-out bulb opens the circuit and that is why both go dark. Replace the burned-out bulb, or wire them in PARALLEL so each one has its own path.' },
        { txt: 'Of two bulbs in parallel, one does not light up and the other one shines normally.', ans: 'Since they are in PARALLEL, each has its own path: the fault is only in the dark bulb (burned out or badly connected). Check that branch; the other one keeps working because its path is complete.' },
        { txt: 'You connected an LED straight to a 9 V battery, with no resistor, and it burned out instantly.', ans: 'With no resistor too much current goes through the LED and destroys it. Always put a resistor in series with the LED to limit the current; you also have to respect its polarity.' }
      ],

      critErrorBank: [
        {
          txt: '"Current gets through even with the switch open, just more slowly."',
          g1: 'False: with the switch OPEN the path is cut and NO current gets through at all; it is not a matter of speed.',
          g2: 'Current needs a CLOSED, complete path: it leaves one terminal of the battery, goes through the load and returns to the other terminal.'
        },
        {
          txt: '"The lights in a house are wired in series: that is why, when one bulb burns out, the rest stay on."',
          g1: 'That contradicts itself: in SERIES, if one bulb burns out they ALL go dark, because there is a single path.',
          g2: 'House lights are wired in PARALLEL: each lamp has its own path and gets all the voltage, which is why the rest stay on.'
        },
        {
          txt: '"Water never conducts electricity, so it makes no difference if your hands are wet."',
          g1: 'Tap water, river water and sweat carry SALTS and they do conduct electricity.',
          g2: 'That is why you never touch appliances, plugs or wires with wet hands: a wet body becomes part of the circuit.'
        },
        {
          txt: '"To make the LED shine brighter, take off the resistor and connect it straight to the 9 V battery."',
          g1: 'With no resistor too much current gets through and the LED BURNS OUT in an instant: it does not shine brighter, it is destroyed.',
          g2: 'On top of that the LED has POLARITY: connected backwards it does not light up. The resistor always goes in series with it.'
        },
        {
          txt: '"If you join the two terminals of the battery with a wire, the battery recharges itself."',
          g1: 'It does not recharge: you create a SHORT CIRCUIT, the current flows with no load to limit it and the battery HEATS UP.',
          g2: 'It is dangerous: the battery can burn your hand, leak or burst. The current must always go through a load (LED, motor or buzzer).'
        }
      ],

      critCicloQuestions: [
        '1. What path does the current travel? Describe it from the battery until it comes back to it.',
        '2. What would happen if the switch were opened or a wire came loose? Why?',
        '3. What does electrical energy turn into in this circuit?'
      ],

      critCicloBank: [
        {
          txt: 'The battery flashlight your family uses during power outages: when you slide the button, the bulb lights up.',
          p: 'The current leaves the + terminal of the batteries, goes through the spring and the metal strip, reaches the switch and from there the bulb, and comes back to the − terminal.',
          d: 'The circuit would be left OPEN and the bulb would go out, because the current needs a closed, complete path.',
          a: 'The electrical energy of the batteries turns into light energy (and a little heat) in the bulb.'
        },
        {
          txt: 'A toy car with a battery, a switch and a motor that makes the wheels turn.',
          p: 'The current leaves the + of the battery, runs along the wire to the closed switch, goes through the motor and returns to the − of the battery.',
          d: 'With the switch open or a wire loose the motor stops: with no closed path no current flows.',
          a: 'Electrical energy turns into energy of movement (mechanical) in the motor.'
        },
        {
          txt: 'The classroom bell: when you press a button, a buzzer connected to a battery sounds.',
          p: 'The current leaves the battery, goes through the button (which works as a switch) and through the buzzer, and returns to the battery.',
          d: 'When you let go of the button the circuit opens and the sound stops immediately, because the path is interrupted.',
          a: 'Electrical energy turns into sound energy in the buzzer.'
        },
        {
          txt: 'The solar lamp in the village: a solar panel charges a battery during the day and at night it lights an LED.',
          p: 'During the day the current goes from the solar panel to the battery; at night it leaves the battery, goes through the switching circuit and the LED, and returns.',
          d: 'If a wire comes loose, the LED does not light up even with a full battery: the path is open.',
          a: 'The energy of the sun (light) turns into electrical energy, is stored in the battery and turns back into light in the LED.'
        },
        {
          txt: 'The cell phone charger: you plug it into the wall outlet and the phone battery fills up.',
          p: 'The current comes in from the wall outlet to the charger, which turns it into low-voltage current, and travels along the cord to the phone battery.',
          d: 'If the cord is damaged or badly connected, the path opens and the phone does not charge.',
          a: 'Electrical energy turns into chemical energy stored in the battery, and later into light, sound and movement in the phone.'
        }
      ],

      critCompareBank: [
        {
          a: 'A connection with a single path: the bulbs share the voltage and, if one burns out, they all go dark.',
          b: 'A connection in which each bulb has its own path and gets all the voltage; if one burns out, the rest keep going.',
          ga: 'The series circuit.',
          gb: 'The parallel circuit.',
          gr: 'Similarity: both have a source, wires and several loads on a closed path. Difference: in series the path is single (one fault turns everything off and the light is dimmer); in parallel there are several paths (each load is independent). That is why houses are wired in parallel.'
        },
        {
          a: 'A material that lets current through easily, like the copper inside the wire.',
          b: 'A material that does not let current through, like the plastic that covers the wire.',
          ga: 'The conductor.',
          gb: 'The insulator.',
          gr: 'Similarity: both are present in the very same wire and both are needed for it to work safely. Difference: the conductor forms the path of the current; the insulator wraps it and protects us. Careful: water with salts conducts, which is why you do not touch appliances with wet hands.'
        },
        {
          a: 'The state of the circuit in which the path is complete and the load works.',
          b: 'The state of the circuit in which the path is cut and nothing works.',
          ga: 'The closed circuit.',
          gb: 'The open circuit.',
          gr: 'Similarity: both have a source, wires and a load; the switch changes one into the other. Difference: closed lets the current flow (the LED lights up); open stops it (because of the switch, a loose wire or a burned-out bulb in series).'
        },
        {
          a: 'The push the battery gives to the current; it is measured in volts (V).',
          b: 'The obstacle that opposes the flow of current; it is measured in ohms (Ω) and it protects the LED.',
          ga: 'Voltage.',
          gb: 'Resistance.',
          gr: 'Similarity: both decide how much current goes through the circuit. Difference: voltage pushes (more voltage, more current) and resistance holds back (more resistance, less current). That is why an LED on a 9 V battery needs a resistor and on a 1.5 V battery you barely notice.'
        }
      ],

      critDesignBank: [
        'Power outages are frequent at your house and at night nobody can find the candles or the flashlight.',
        'The henhouse is dark and the fox gets in at night without anyone noticing.',
        'There is no bell at school: the teacher has to go out to the yard and shout that it is recess time.',
        'The village has no power lines, but it does get plenty of sun all day long.',
        'At the corner store nobody notices when a customer comes in, because the owner is in the kitchen.'
      ],

      critDesignGuide: 'Rubric with 3 criteria (20 pts total) — ① PARTS OF THE CIRCUIT (7 pts): name the source (batteries or solar panel), the wires, the switch and the load (LED, motor or buzzer) and explain the closed path. ② HOW IT WORKS (6 pts): explain when the circuit closes and when it opens, and what electrical energy turns into (light, movement or sound); if it uses several loads, justify series or parallel. ③ SAFETY (7 pts): use only batteries (never the 110 V), insulated wires and dry hands, avoid a short circuit, and say what will be done with the used batteries. Any design counts as long as the path is closed and the solution is realistic.',

      circuitoCasos: [
        {
          id: 'correcto', nombre: 'Correct circuit', icon: '✅', tipo: 'simple', cable: true, polaridad: true, corto: false, resistencia: true,
          cargas: [{ n: 'LED', emoji: '💡', quemada: false }], clave: [true],
          desc: 'A battery, wires, a switch and an LED with its resistor. Everything is properly connected.',
          pista: 'When you close the switch the path is complete: the current leaves the +, goes through the resistor and the LED, and comes back to the −.'
        },
        {
          id: 'motor', nombre: 'Circuit with a motor', icon: '⚙️', tipo: 'simple', cable: true, polaridad: true, corto: false, resistencia: false,
          cargas: [{ n: 'Motor', emoji: '⚙️', quemada: false }], clave: [true],
          desc: 'The same battery and the same switch, but now the load is a motor (the one from the classroom car).',
          pista: 'The motor needs no resistor: it turns electrical energy into movement. A closed path is still the essential thing.'
        },
        {
          id: 'suelto', nombre: 'Loose wire', icon: '✂️', tipo: 'simple', cable: false, polaridad: true, corto: false, resistencia: true,
          cargas: [{ n: 'LED', emoji: '💡', quemada: false }], clave: [false],
          desc: 'A wire slipped off the battery holder: there is a gap in the return path.',
          pista: 'Even with the switch closed, the circuit is still OPEN at the loose wire: the current cannot complete the loop.'
        },
        {
          id: 'reves', nombre: 'Battery backwards', icon: '🔄', tipo: 'simple', cable: true, polaridad: false, corto: false, resistencia: true,
          cargas: [{ n: 'LED', emoji: '💡', quemada: false }], clave: [false],
          desc: 'The battery ended up backwards: the + where the − should go and the − where the + should go.',
          pista: 'The LED has POLARITY: it only lights up one way round (long leg to +, short leg to −). Backwards it does not let current through.'
        },
        {
          id: 'corto', nombre: 'Short circuit', icon: '⚠️', tipo: 'simple', cable: true, polaridad: true, corto: true, resistencia: true,
          cargas: [{ n: 'LED', emoji: '💡', quemada: false }], clave: [false],
          desc: 'A bare wire joins the two sides of the circuit and gives the current a shortcut.',
          pista: 'The current prefers the shortcut with no resistance: the LED stays dark and the battery HEATS UP. You must disconnect it right away.'
        },
        {
          id: 'serie', nombre: 'Two LEDs in series', icon: '➖', tipo: 'serie', cable: true, polaridad: true, corto: false, resistencia: true,
          cargas: [{ n: 'LED 1', emoji: '💡', quemada: false }, { n: 'LED 2', emoji: '💡', quemada: false }], clave: [true, true],
          desc: 'Two LEDs connected one after the other: a single path for the current.',
          pista: 'Both light up, but they SHARE the voltage of the battery: they shine dimmer than a single one would.'
        },
        {
          id: 'serie-quemado', nombre: 'Series with a burned-out LED', icon: '💥', tipo: 'serie', cable: true, polaridad: true, corto: false, resistencia: true,
          cargas: [{ n: 'LED 1', emoji: '💡', quemada: true }, { n: 'LED 2', emoji: '💡', quemada: false }], clave: [false, false],
          desc: 'The same two LEDs in series, but the first one is burned out.',
          pista: 'In SERIES there is a single path: the burned-out LED opens the circuit and BOTH go dark. That is the great drawback of the series connection.'
        },
        {
          id: 'paralelo', nombre: 'Two LEDs in parallel (one burned out)', icon: '🛣️', tipo: 'paralelo', cable: true, polaridad: true, corto: false, resistencia: true,
          cargas: [{ n: 'LED 1', emoji: '💡', quemada: true }, { n: 'LED 2', emoji: '💡', quemada: false }], clave: [false, true],
          desc: 'Each of the two LEDs has its own path; the first one is burned out.',
          pista: 'In PARALLEL each load is independent: the burned-out one stays dark and the other keeps shining with all the voltage. That is how the lights in your house are wired.'
        }
      ],

      labPredOpts: ['🟢 Yes, everything works', '🟡 Only part of it works', '🔴 Nothing works'],

      diagData: [
        { desc: 'The LED does not light up and the switch is closed. What do you check FIRST?', ans: 'That the path is complete: wires firmly attached and no loose ends', opts: ['That the path is complete: wires firmly attached and no loose ends', 'The color of the wire', 'The size of the LED', 'The brand of the battery'] },
        { desc: 'The LED is still dark, the wires are fine and the battery is new. What do you check now?', ans: 'The polarity of the LED: long leg to + and short leg to −', opts: ['The polarity of the LED: long leg to + and short leg to −', 'Move to another table', 'Blow on the LED', 'Wet the wires'] },
        { desc: 'The battery gets very hot and nothing lights up. What is going on?', ans: 'There is a short circuit: disconnect it right away', opts: ['There is a short circuit: disconnect it right away', 'The battery is happy', 'There is not enough voltage', 'The LED is too big'] },
        { desc: 'The light comes on only when you press the wires together with your hand. What is the fault?', ans: 'A loose contact: the joint has to be secured properly', opts: ['A loose contact: the joint has to be secured properly', 'The switch is unnecessary', 'The copper is tired', 'An insulator is missing'] },
        { desc: 'Two bulbs in series: neither lights up and one has a broken filament. Why did both go dark?', ans: 'In series there is a single path: the burned-out bulb opens it', opts: ['In series there is a single path: the burned-out bulb opens it', 'Because the battery is 1.5 V', 'Because they are in parallel', 'Because the wire is short'] },
        { desc: 'Two bulbs in parallel: one does not light up and the other one does. Where is the fault?', ans: 'Only in the branch of the dark bulb; the other path is fine', opts: ['Only in the branch of the dark bulb; the other path is fine', 'In the whole house', 'In the battery', 'In the main switch'] },
        { desc: 'You connected an LED to a 9 V battery and it burned out instantly. What was missing?', ans: 'The resistor that limits the current through the LED', opts: ['The resistor that limits the current through the LED', 'An insulator', 'More voltage', 'Another switch'] },
        { desc: 'Your classmate wants to try the circuit on the 110 V wall outlet. What do you tell them?', ans: 'No: in the classroom we experiment only with batteries', opts: ['No: in the classroom we experiment only with batteries', 'To do it quickly', 'To use wet hands', 'To strip the insulation off the wires'] }
      ]
    },

    /* ══════════════════════════════════════════════════════
       3. FRASES EXACTAS (pantalla y pruebas imprimibles)
       ══════════════════════════════════════════════════════ */
    frases: {
      /* — barra superior, navegación y pie — */
      'Aprende': 'Learn', 'Partes': 'Parts', 'Lab': 'Lab', 'Flashcards': 'Flashcards', 'Quiz': 'Quiz',
      /* — laboratorio de circuitos — */
      '🔬 Laboratorio de Circuitos': '🔬 Circuit Laboratory',
      'Elige un caso, predice si funcionará y luego cierra el interruptor para comprobarlo. ¡Pruébalos todos!':
        'Choose a case, predict whether it will work and then close the switch to check. Try them all!',
      '🔘 Cerrar el interruptor': '🔘 Close the switch',
      '🔘 Abrir el interruptor': '🔘 Open the switch',
      '🤔 Antes de cerrar el interruptor: ¿qué crees que pasará?': '🤔 Before you close the switch: what do you think will happen?',
      '(+3 XP por acierto)': '(+3 XP for each correct prediction)',
      'Predice el resultado del circuito': 'Predict the result of the circuit',
      'Resultado:': 'Result:',
      /* rótulos del SVG del circuito */
      'resistencia': 'resistor', 'cable suelto': 'loose wire', 'atajo sin carga': 'shortcut with no load',
      '¡la pila se calienta: desconecta ya!': 'the battery is heating up: disconnect it now!',
      'un solo camino: la corriente pasa por las dos': 'a single path: the current goes through both',
      'dos caminos: cada carga es independiente': 'two paths: each load is independent',
      /* motivos que arma circuitoResuelve (el <strong> los parte en varios nodos) */
      'Circuito ABIERTO:': 'OPEN circuit:',
      'el interruptor corta el camino y la corriente no puede pasar. Nada funciona.':
        'the switch cuts the path and the current cannot get through. Nothing works.',
      'Camino cortado:': 'Path cut:',
      'con un cable suelto el circuito sigue abierto aunque el interruptor esté cerrado.':
        'with a loose wire the circuit stays open even with the switch closed.',
      'Pila al revés:': 'Battery backwards:',
      'el LED tiene polaridad y al revés no deja pasar la corriente.':
        'the LED has polarity and backwards it does not let current through.',
      'CORTOCIRCUITO:': 'SHORT CIRCUIT:',
      'la corriente toma el atajo sin carga, el LED no enciende y la pila se calienta. ¡Desconecta ya!':
        'the current takes the shortcut with no load, the LED stays dark and the battery heats up. Disconnect it now!',
      'En SERIE': 'In SERIES',
      'hay un solo camino: si una carga se quema, se apagan TODAS.':
        'there is a single path: if one load burns out, they ALL go dark.',
      'las dos encienden, pero se reparten el voltaje: alumbran más débil.':
        'both light up, but they share the voltage: they shine dimmer.',
      'En PARALELO': 'In PARALLEL',
      'cada carga tiene su camino: la quemada se apaga y la otra sigue con todo el voltaje.':
        'each load has its own path: the burned-out one stays dark and the other keeps all the voltage.',
      'Circuito CERRADO:': 'CLOSED circuit:',
      'la corriente recorre todo el camino y la carga funciona.':
        'the current runs along the whole path and the load works.',
      /* — flashcards y memorama — */
      '🧠 Memorama del Circuito': '🧠 Circuit Memory Game',
      /* — quiz, clasifica, identifica, completa — */
      '¡Correcto! Piensas como todo un electricista.': 'Correct! You are thinking like a real electrician.',
      'Casi. Pregúntate: ¿el camino de la corriente está cerrado y completo?': 'Almost. Ask yourself: is the path of the current closed and complete?',
      '💡 Consejo: ¡Usa el botón "Variar grupo" varias veces! Conductor/aislante, serie/paralelo, cerrado/abierto y seguro/peligroso.':
        '💡 Tip: use the "Change group" button several times! Conductor/insulator, series/parallel, closed/open and safe/dangerous.',
      /* — widgets — */
      '🔁 El camino de la corriente: ordena los pasos': '🔁 The path of the current: put the steps in order',
      /* esta misión redacta los rótulos a su manera; no valen los del motor */
      'Serie/Paralelo': 'Series/Parallel',
      'Usa las flechas ▲ ▼ para ordenar el recorrido de la corriente:': 'Use the ▲ ▼ arrows to put the path of the current in order:',
      'para ordenar el recorrido de la corriente:': 'arrows to put the path of the current in order:',
      '⭐ +3 XP por respuesta correcta (primera vez por caso)': '⭐ +3 XP per correct answer (first time per case)',
      'Lee lo que necesitas y elige la pieza adecuada:': 'Read what you need and choose the right part:',
      'Hay pasos fuera de orden. Recuerda: la corriente sale de la fuente, pasa por el interruptor y la carga, y regresa.':
        'Some steps are out of order. Remember: the current leaves the source, goes through the switch and the load, and comes back.',
      '📦 ¿Qué componente necesitas?': '📦 Which component do you need?',
      'Lee la situación y elige el componente adecuado:': 'Read the situation and choose the right component:',
      '🎉 ¡Ya sabes elegir el componente correcto!': '🎉 You know how to pick the right component now!',
      '🔗 Empareja: Componente → Función': '🔗 Match: Component → Job',
      '¿Cuál es la función de este componente del circuito?': 'What is the job of this circuit component?',
      'Pila': 'Battery',
      '🦺 ¿Seguro o peligroso?': '🦺 Safe or dangerous?',
      'Lee la práctica y decide si es segura o peligrosa:': 'Read the practice and decide whether it is safe or dangerous:',
      'Armar un circuito con una pila AA': 'Building a circuit with an AA battery',
      '🔧 Diagnóstico de fallas': '🔧 Troubleshooting',
      'El circuito no funciona. Piensa como técnico: ¿qué revisas?': 'The circuit does not work. Think like a technician: what do you check?',
      '🎉 ¡Eres todo un técnico en diagnóstico eléctrico!': '🎉 You are a real electrical troubleshooting technician!',
      /* — generador de tareas — */
      '🔍 Identificar': '🔍 Identify', '🗂️ Conductores y aislantes': '🗂️ Conductors and insulators',
      'Copia en tu cuaderno; subraya, colorea o encierra el concepto de electricidad indicado en cada oración. Escribe al lado qué parte del circuito o qué idea es.':
        'Copy this in your notebook; underline, color or circle the electricity concept in each sentence. Next to it, write which circuit part or idea it is.',
      'Copia la siguiente tabla en tu cuaderno. Para cada objeto responde: ¿conduce la corriente?, ¿de qué material es?, ¿es conductor o aislante? y ¿para qué sirve en un circuito?':
        'Copy the table below in your notebook. For each object answer: does it conduct current? what material is it? is it a conductor or an insulator? and what is it good for in a circuit?',
      'Objeto': 'Object', '¿Conduce?': 'Does it conduct?', 'Material': 'Material',
      '¿Conductor o aislante?': 'Conductor or insulator?', 'Uso en el circuito': 'Use in the circuit',
      /* — evaluación conceptual: pantalla — */
      'Evaluación Final · Electricidad para Robots · Educación Básica · Robótica': 'Final Test · Electricity for Robots · Basic Education · Robotics',
      'Evaluación Competencial · Pensamiento Crítico · Electricidad para Robots · Educación Básica': 'Competency Test · Critical Thinking · Electricity for Robots · Basic Education',
      'Evaluación Competencial · Pensamiento Crítico · Electricidad para Robots · Educación Básica · Robótica': 'Competency Test · Critical Thinking · Electricity for Robots · Basic Education · Robotics',
      '🎓 Evaluación Final — Electricidad para Robots': '🎓 Final Test — Electricity for Robots',
      '🧠 Prueba de Pensamiento Crítico — Electricidad para Robots': '🧠 Critical Thinking Test — Electricity for Robots',
      /* títulos de sección: la versión de pantalla y la impresa se escriben distinto */
      'I. Diagnóstico de fallas': 'I. Troubleshooting',
      'III. Analiza el circuito paso a paso': 'III. Analyze the circuit step by step',
      'III. Analiza el circuito': 'III. Analyze the circuit',
      'V. Diseña y justifica tu circuito': 'V. Design and justify your circuit',
      'V. Diseña tu circuito — Rúbrica': 'V. Design your circuit — Rubric',
      '¿Qué revisarías y en qué orden? Explica por qué esa falla deja el circuito sin funcionar.':
        'What would you check, and in what order? Explain why that fault leaves the circuit dead.',
      '¿Qué revisarías y en qué orden? Explica por qué.': 'What would you check, and in what order? Explain why.',
      'Inventa un circuito que resuelva este problema: escribe su nombre, qué FUENTE usa, cómo van los CABLES y el INTERRUPTOR, qué CARGA lleva (LED, motor o zumbador) y en qué se transforma la energía. Explica también cómo lo harás con seguridad.':
        'Invent a circuit that solves this problem: write its name, which SOURCE it uses, how the WIRES and the SWITCH are arranged, which LOAD it carries (LED, motor or buzzer) and what the energy turns into. Explain as well how you will do it safely.',
      'Inventa un circuito que resuelva este problema: escribe su nombre, qué FUENTE usa, cómo van los CABLES y el INTERRUPTOR, qué CARGA lleva y en qué se transforma la energía. Dibújalo con sus símbolos al reverso de la hoja.':
        'Invent a circuit that solves this problem: write its name, which SOURCE it uses, how the WIRES and the SWITCH are arranged, which LOAD it carries and what the energy turns into. Draw it with its symbols on the back of the sheet.',
      /* la pauta reusa los rótulos del ciclo percibir-decidir-actuar */
      'Percibe:': 'Path:', 'Decide:': 'If it opens:', 'Actúa:': 'Transformation:',
      /* — impresión: encabezados, pauta y pie — */
      'Evaluación Electricidad para Robots': 'Test · Electricity for Robots',
      'Pensamiento Crítico Electricidad para Robots': 'Critical Thinking · Electricity for Robots',
      '✅ PAUTA — Evaluación Final · Electricidad para Robots': '✅ ANSWER KEY — Final Test · Electricity for Robots',
      '✅ PAUTA — Pensamiento Crítico · Electricidad para Robots': '✅ ANSWER KEY — Critical Thinking · Electricity for Robots',
      /* — constancia — */
      'Misión Electricidad para Robots': 'Mission · Electricity for Robots',
      /* — trozos sueltos: frases que el <strong> parte en varios nodos — */
      'El cobre deja pasar la corriente. →': 'Copper lets current through. →',
      'Conductor': 'Conductor',
      'Elige un caso,': 'Choose a case,',
      'predice': 'predict',
      'si funcionará y luego': 'whether it will work and then',
      'cierra el interruptor': 'close the switch',
      'para comprobarlo. ¡Pruébalos todos!': 'to check. Try them all!',
      '🤔 Antes de cerrar el interruptor: ¿qué crees que pasará?': '🤔 Before you close the switch: what do you think will happen?',
      /* la sección II de pantalla parte la frase en tres nodos por el <strong> */
      '. Corrígelos con argumentos, usando lo que sabes del circuito eléctrico:':
        '. Correct them with arguments, using what you know about the electric circuit:',
      'Esta afirmación tiene dos errores. Corrígelos con argumentos, usando lo que sabes del circuito eléctrico:':
        'This statement contains two mistakes. Correct them with arguments, using what you know about the electric circuit:'
    },

    /* ══════════════════════════════════════════════════════
       4. FRAGMENTOS (textos con números o nombres variables)
       ══════════════════════════════════════════════════════ */
    fragmentos: [
      /* — WhatsApp: el título de la misión en la constancia — */
      [/¡(.+?) completó la Misión "Electricidad para Robots"!/g, '$1 completed the mission “Electricity for Robots”!'],
      [/Pregunta (\d+) de (\d+)/g, 'Question $1 of $2'],
      [/Oración (\d+) de (\d+)/g, 'Sentence $1 of $2'],
      [/Pista (\d+) de (\d+)/g, 'Clue $1 of $2'],
      [/Falla (\d+) de (\d+)/g, 'Fault $1 of $2'],
      [/Caso (\d+) de (\d+)/g, 'Case $1 of $2'],
      [/Carta de memoria (\d+)/g, 'Memory card $1'],
      [/^(\d+) de (\d+)$/g, '$1 of $2'],
      [/Caso (\d+):/g, 'Case $1:'],
      /* laboratorio de circuitos */
      [/🔬 Probando: /g, '🔬 Testing: '],
      [/interruptor cerrado/g, 'switch closed'],
      [/interruptor abierto/g, 'switch open'],
      [/ ✖ quemado/g, ' ✖ burned out'],
      [/🟢 funciona/g, '🟢 working'],
      [/⚫ apagada/g, '⚫ off'],
      [/pila al revés 🔄/g, 'battery backwards 🔄'],
      [/^pila$/g, 'battery'],
      [/Todavía no\. Cierra el interruptor y observa qué pasa\. /g, 'Not yet. Close the switch and watch what happens. '],
      [/^¡Correcto! (?=[A-Z])/g, 'Correct! '],
      /* juegos */
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
      [/Correcto: (.+)\. Recuerda las reglas de seguridad eléctrica\./g, 'Correct: $1. Remember the electrical safety rules.'],
      [/^Correcto: /g, 'Correct: '],
      [/Busca: /g, 'Look for: '],
      /* evaluaciones */
      [/Forma (\d+)/g, 'Form $1'],
      [/🎓 Evaluación Final · Form (\d+) · Electricidad para Robots/g, '🎓 Final Test · Form $1 · Electricity for Robots'],
      [/🧠 Pensamiento Crítico · Form (\d+) · Electricidad para Robots/g, '🧠 Critical Thinking · Form $1 · Electricity for Robots'],
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
      [/¿Conduce\?: (.+?) \| Material: /g, 'Conducts?: $1 | Material: '],
      [/ \| Tipo: /g, ' | Type: '],
      [/ \| Uso: /g, ' | Use: '],
      [/🎯 Clave rápida estilo ZipGrade · Form (\d+) — respuestas correctas ya rellenadas para digitar la clave en la app/g,
        '🎯 ZipGrade-style quick key · Form $1 — correct answers already filled in so you can type the key into the app'],
      [/Test Version \/ Form:/g, 'Test Version / Form:'],
      /* fecha de la constancia: «25 de julio de 2026» → «July 25, 2026» */
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
