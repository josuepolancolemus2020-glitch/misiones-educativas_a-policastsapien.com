/* ============================================================
   Misión «Sensores: los Sentidos del Robot»: versión en inglés
   ------------------------------------------------------------
   Traducción de autor (no automática) para escuelas bilingües.
   Se carga junto a la misión y el motor js/metas-i18n.js la
   activa con el botón 🌐 English de la barra superior.

   Criterio de traducción:
   · Inglés AMERICANO estricto: color, center, catalog, analyze,
     practicing, toward, «Student No.».
   · Vocabulario técnico estándar de robótica escolar:
     sensor → controller → actuator · sense → think → act.
     La fotorresistencia es photoresistor; el ultrasónico,
     ultrasonic; el pulsador, pushbutton.
   · Lo cultural se explica, no se calca: cafetal → coffee field,
     pulpería → corner store, centro de salud → health center,
     beneficio de café → coffee mill.
   · Los bancos son traducción ÍNDICE A ÍNDICE del español: las
     formas deterministas de la evaluación (1–30) sacan las mismas
     preguntas y la misma clave ZipGrade en los dos idiomas.

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

    titulo: 'Mission Sensors: The Robot’s Senses | policastsapien.com',

    /* ══════════════════════════════════════════════════════
       1. BLOQUES DE CONTENIDO (data-i18n en el HTML)
       ══════════════════════════════════════════════════════ */
    html: {

      hero:
        '<h1>Mission <span>Sensors: The Robot’s Senses</span></h1>' +
        '<p class="sub">Find out how a robot sees, hears, touches and measures the world… and what happens when a sensor gets it wrong! 👁️📏🌡️</p>' +
        '<div class="badge">🤖 Robot Path · Stage 2 of 6 · Robotics</div>',

      a1:
        '<h2>📡 What is a sensor?</h2>' +
        '<p>A <strong>sensor</strong> is the part of the robot that <strong>SENSES</strong>: it turns something from the real world ' +
        '(<strong>light, distance, heat, contact, sound or moisture</strong>) into a <strong>signal</strong> that the ' +
        '<strong>controller</strong> understands. With no sensors the robot would be «blind and deaf»: it would know nothing about what ' +
        'is going on around it.</p>' +
        '<div class="type-grid">' +
        '<div class="type-chip tc-teal"><div class="t-art">🌍 It picks up</div><div class="t-info">Something from the real world: light, distance, heat, contact, sound or moisture</div></div>' +
        '<div class="type-chip tc-gold"><div class="t-art">🔄 It converts</div><div class="t-info">It turns what it picked up into an electric signal: a piece of data, a number</div></div>' +
        '<div class="type-chip tc-amber"><div class="t-art">🧠 It reports</div><div class="t-info">It sends that data to the controller, which is the one that decides</div></div>' +
        '<div class="type-chip tc-jade"><div class="t-art">🔁 It repeats</div><div class="t-info">It measures again many times per second, and it never gets tired</div></div>' +
        '</div>' +
        '<div class="tip">' +
        '<span class="ti">💡</span>' +
        '<div><strong>Think of it this way:</strong> the sensor is the robot’s <b>reporter</b>. It only reports what it sees or measures; ' +
        'it <b>does not decide</b> (that is the controller’s job) and it <b>does not act</b> (that is the actuator’s job).</div>' +
        '</div>',

      a2:
        '<h2>🫀 Sensor → Controller → Actuator (just like your body!)</h2>' +
        '<p>In the <strong>Body Path</strong> you learned the route the nervous system follows: ' +
        '<strong>receptor → brain → effector</strong>. In robotics it is exactly the same, only the names change:</p>' +
        '<div class="type-grid">' +
        '<div class="type-chip tc-teal"><div class="t-art">👁️ Eye = light sensor</div><div class="t-info">Your eye picks up light; so does the robot’s photoresistor</div></div>' +
        '<div class="type-chip tc-gold"><div class="t-art">🖐️ Skin = touch sensor</div><div class="t-info">Your skin feels contact and heat; so does the robot’s pushbutton</div></div>' +
        '<div class="type-chip tc-amber"><div class="t-art">👂 Ear = microphone</div><div class="t-info">Your ear picks up sound; the microphone turns it into a signal</div></div>' +
        '<div class="type-chip tc-jade"><div class="t-art">🧠 Brain = controller</div><div class="t-info">It receives the information from the sensor and decides what to do</div></div>' +
        '</div>' +
        '<div class="tip">' +
        '<span class="ti">🔤</span>' +
        '<div><strong>Remember the chain:</strong> <b>receptor → brain → effector</b> is the same as ' +
        '<b>sensor → controller → actuator</b>. Information always comes in through the sensor and goes out through the actuator!</div>' +
        '</div>',

      a3:
        '<h2>🇭🇳 Sensors in your everyday life (Honduras)</h2>' +
        '<p>Even if you never notice them, you already live with sensors every single day:</p>' +
        '<div class="vs-grid">' +
        '<div class="vs-box vs-a">' +
        '<h4>🏪 On the street and at home</h4>' +
        '<p>The supermarket’s <strong>automatic door</strong> detects you with a motion or distance sensor. ' +
        'The <strong>hallway light</strong> turns itself on with a light sensor. Your <strong>cell phone</strong> switches ' +
        'the screen off when you hold it up to your ear: that is a proximity sensor.</p>' +
        '</div>' +
        '<div class="vs-box vs-b">' +
        '<h4>☕ On the farm and in health care</h4>' +
        '<p>On a <strong>coffee farm</strong>, a <strong>moisture</strong> sensor tells you when to water and saves ' +
        'water. At the <strong>health center</strong>, the <strong>digital thermometer</strong> is a temperature sensor ' +
        'that measures your fever in seconds.</p>' +
        '</div>' +
        '</div>' +
        '<div class="tip">' +
        '<span class="ti">⚠️</span>' +
        '<div><strong>Careful:</strong> a sensor <b>can fail or give a wrong reading</b> (if it is dirty, wet, blocked or if there is ' +
        'very little light). And if the sensor gets it wrong, the robot <b>decides wrong</b>!</div>' +
        '</div>',

      e1:
        '<h2>🗺️ The most widely used types of sensors</h2>' +
        '<p>Each sensor senses <strong>one single thing</strong>. That is why a robot usually carries several of them:</p>' +
        '<div style="overflow-x:auto;">' +
        '<table style="width:100%;border-collapse:collapse;font-size:0.82rem;min-width:520px;">' +
        '<thead>' +
        '<tr style="background:var(--pri-gl);">' +
        '<th style="padding:0.4rem 0.5rem;border:1px solid var(--border);text-align:left;">Sensor</th>' +
        '<th style="padding:0.4rem 0.5rem;border:1px solid var(--border);">What does it sense?</th>' +
        '<th style="padding:0.4rem 0.5rem;border:1px solid var(--border);">Human sense</th>' +
        '<th style="padding:0.4rem 0.5rem;border:1px solid var(--border);">Example</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:700;">☀️ Light</td><td style="padding:0.4rem;border:1px solid var(--border);">How much light there is: bright or dark</td><td style="padding:0.4rem;border:1px solid var(--border);text-align:center;">👁️ Sight</td><td style="padding:0.4rem;border:1px solid var(--border);">Line-following car; lamp that turns on at night</td></tr>' +
        '<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:700;">📏 Distance</td><td style="padding:0.4rem;border:1px solid var(--border);">How far away an object is</td><td style="padding:0.4rem;border:1px solid var(--border);text-align:center;">🦇 The bat’s echo</td><td style="padding:0.4rem;border:1px solid var(--border);">Robot that dodges obstacles; automatic door</td></tr>' +
        '<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:700;">🤲 Touch</td><td style="padding:0.4rem;border:1px solid var(--border);">Whether something touches or presses it</td><td style="padding:0.4rem;border:1px solid var(--border);text-align:center;">🖐️ The touch of your skin</td><td style="padding:0.4rem;border:1px solid var(--border);">Bumper pushbutton; power button</td></tr>' +
        '<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:700;">🌡️ Temperature</td><td style="padding:0.4rem;border:1px solid var(--border);">How hot or cold it is</td><td style="padding:0.4rem;border:1px solid var(--border);text-align:center;">🖐️ Your skin</td><td style="padding:0.4rem;border:1px solid var(--border);">Digital thermometer at the health center</td></tr>' +
        '<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:700;">🔊 Sound</td><td style="padding:0.4rem;border:1px solid var(--border);">Noises, voices, claps</td><td style="padding:0.4rem;border:1px solid var(--border);text-align:center;">👂 Hearing</td><td style="padding:0.4rem;border:1px solid var(--border);">Cell phone microphone; robot that starts when you clap</td></tr>' +
        '<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:700;">💧 Moisture</td><td style="padding:0.4rem;border:1px solid var(--border);">How much water there is in the soil or the air</td><td style="padding:0.4rem;border:1px solid var(--border);text-align:center;">🖐️ Touch (wet soil)</td><td style="padding:0.4rem;border:1px solid var(--border);">Watering the coffee field and the school garden</td></tr>' +
        '</tbody>' +
        '</table>' +
        '</div>' +
        '<div class="tip">' +
        '<span class="ti">🦇</span>' +
        '<div><strong>Fun fact:</strong> the <b>ultrasonic</b> distance sensor works like a <b>bat</b>: it sends out a sound ' +
        'we cannot hear, waits for the <b>echo</b> and measures how long it takes to come back. ' +
        'The longer it takes, the farther away the obstacle is!</div>' +
        '</div>',

      e2:
        '<h2>⚖️ Sensor ≠ Actuator (the most common mistake!)</h2>' +
        '<p>Many people mix up these two parts. The difference is simple: one <strong>brings information in</strong> and the other ' +
        '<strong>sends action out</strong>.</p>' +
        '<div class="vs-grid">' +
        '<div class="vs-box vs-a">' +
        '<h4>📡 The SENSOR senses</h4>' +
        '<p>It is the robot’s <strong>input</strong>. It measures and reports: «there is an obstacle 20 cm away», «the soil is dry». ' +
        '<strong>It moves nothing.</strong> Examples: photoresistor, ultrasonic sensor, pushbutton, thermometer, microphone.</p>' +
        '</div>' +
        '<div class="vs-box vs-b">' +
        '<h4>💪 The ACTUATOR acts</h4>' +
        '<p>It is the robot’s <strong>output</strong>. It carries out the controller’s order: it turns, pushes, lights up, sounds. ' +
        '<strong>It measures nothing.</strong> Examples: motor, wheel, arm, speaker, LED light, valve.</p>' +
        '</div>' +
        '</div>' +
        '<div class="tip">' +
        '<span class="ti">🎯</span>' +
        '<div><strong>Golden rule:</strong> if it <b>tells</b> you something about the world, it is a <b>sensor</b>. If it <b>does</b> ' +
        'something in the world, it is an <b>actuator</b>. The controller always stands between the two.</div>' +
        '</div>',

      e3:
        '<h2>⚡ Lightning mini-quiz</h2>' +
        '<p style="font-size:0.9rem;margin-bottom:0.5rem;">1) The <strong>beeper</strong> that sounds when the robot backs up. What is it?</p>' +
        '<div class="cmp-opts" role="group" style="margin-bottom:0.4rem;">' +
        '<button class="cmp-opt" onclick="miniQ(this,false,\'fbMq1\')">A sound sensor</button>' +
        '<button class="cmp-opt" onclick="miniQ(this,true,\'fbMq1\')">An actuator</button>' +
        '<button class="cmp-opt" onclick="miniQ(this,false,\'fbMq1\')">A controller</button>' +
        '</div>' +
        '<div id="fbMq1" class="fb" role="alert"></div>' +
        '<p style="font-size:0.9rem;margin:0.9rem 0 0.5rem;">2) The <strong>line-following</strong> robot tells the black line apart from the light-colored floor. Which sensor does it use?</p>' +
        '<div class="cmp-opts" role="group" style="margin-bottom:0.4rem;">' +
        '<button class="cmp-opt" onclick="miniQ(this,true,\'fbMq2\')">Light</button>' +
        '<button class="cmp-opt" onclick="miniQ(this,false,\'fbMq2\')">Temperature</button>' +
        '<button class="cmp-opt" onclick="miniQ(this,false,\'fbMq2\')">Moisture</button>' +
        '</div>' +
        '<div id="fbMq2" class="fb" role="alert"></div>' +
        '<p style="font-size:0.9rem;margin:0.9rem 0 0.5rem;">3) The light sensor of the line follower is <strong>covered in mud</strong>. What happens?</p>' +
        '<div class="cmp-opts" role="group" style="margin-bottom:0.4rem;">' +
        '<button class="cmp-opt" onclick="miniQ(this,false,\'fbMq3\')">Nothing: sensors never fail</button>' +
        '<button class="cmp-opt" onclick="miniQ(this,true,\'fbMq3\')">It gives a wrong reading and the robot drifts off the line</button>' +
        '<button class="cmp-opt" onclick="miniQ(this,false,\'fbMq3\')">The robot cleans itself</button>' +
        '</div>' +
        '<div id="fbMq3" class="fb" role="alert"></div>',

      e4:
        '<h2>🧪 What if the sensor gets it wrong?</h2>' +
        '<p>A sensor can give a <strong>wrong reading</strong>. The controller believes it… and decides wrong:</p>' +
        '<div class="type-grid">' +
        '<div class="type-chip tc-teal"><div class="t-art">🟤 Dirty</div><div class="t-info">Covered in dust or mud: the sensor «sees» dark where it is really bright</div></div>' +
        '<div class="type-chip tc-gold"><div class="t-art">🌑 Low light</div><div class="t-info">At night the light sensor mistakes the bright floor for the black line</div></div>' +
        '<div class="type-chip tc-amber"><div class="t-art">💦 Wet</div><div class="t-info">A wet sensor may report «wet soil» even though the soil is dry</div></div>' +
        '<div class="type-chip tc-purple"><div class="t-art">🧱 Blocked</div><div class="t-info">If something covers the ultrasonic sensor, the echo never comes back and the robot crashes</div></div>' +
        '</div>' +
        '<div class="tip">' +
        '<span class="ti">🕵️</span>' +
        '<div><strong>Think like an engineer:</strong> before you blame the program, <b>check the sensors</b>. Many ' +
        '«robot errors» are really <b>dirty, blocked or badly placed sensors</b>.</div>' +
        '</div>',

      labctl:
        '<div class="lab-group">' +
        '<span class="lab-group-label">📡 Sensor:</span>' +
        '<button class="lab-btn lab-cont-btn" data-sensor="luz" onclick="labShowSensor(\'luz\')">☀️ Light</button>' +
        '<button class="lab-btn lab-cont-btn" data-sensor="distancia" onclick="labShowSensor(\'distancia\')">📏 Distance</button>' +
        '<button class="lab-btn lab-cont-btn" data-sensor="tacto" onclick="labShowSensor(\'tacto\')">🤲 Touch</button>' +
        '<button class="lab-btn lab-cont-btn" data-sensor="temperatura" onclick="labShowSensor(\'temperatura\')">🌡️ Temperature</button>' +
        '<button class="lab-btn lab-cont-btn" data-sensor="humedad" onclick="labShowSensor(\'humedad\')">💧 Moisture</button>' +
        '</div>' +
        '<div class="lab-group">' +
        '<span class="lab-group-label">📌 Aspect:</span>' +
        '<button class="lab-btn lab-asp-btn" data-aspecto="percibe" onclick="labShowAspecto(\'percibe\')">🔎 What does it sense?</button>' +
        '<button class="lab-btn lab-asp-btn" data-aspecto="sentido" onclick="labShowAspecto(\'sentido\')">🫀 Which sense is it like?</button>' +
        '<button class="lab-btn lab-asp-btn" data-aspecto="honduras" onclick="labShowAspecto(\'honduras\')">🇭🇳 Honduran example</button>' +
        '<button class="lab-btn lab-asp-btn" data-aspecto="falla" onclick="labShowAspecto(\'falla\')">⚠️ What if it fails?</button>' +
        '</div>',

      rec:
        '<h2>📁 Topic Resources</h2>' +
        '<div style="border:1.5px solid var(--border,#e2e8f0);border-radius:12px;padding:1rem 1.2rem;margin-bottom:1.2rem;background:rgba(0,0,0,0.02);">' +
        '<p style="font-size:0.98rem;font-weight:800;margin-bottom:0.4rem;">📄 Printable study sheet</p>' +
        '<p style="font-size:0.86rem;margin-bottom:0.85rem;">A 7-page study guide (theory, unplugged activities and assessment) to print or solve before the test. <em>It opens in English too: the language you choose here carries over.</em></p>' +
        '<a href="../../fichas/ficha-sensores-robot.html" target="_blank" rel="noopener noreferrer" class="btn btn-pri" style="display:inline-flex;align-items:center;gap:0.5rem;text-decoration:none;font-size:1rem;padding:0.7rem 1.4rem;">📄 Open / print the study sheet</a>' +
        '</div>' +
        '<p style="font-size:0.9rem;margin-bottom:0;">This mission does not have an online materials folder yet. What is ready is the <strong>printable study sheet</strong> above: it carries the theory, the activities and the test on paper, to work without a phone and without internet.</p></div>'
    },

    /* ══════════════════════════════════════════════════════
       2. BANCOS DE DATOS (los cambia MISION_APLICAR_IDIOMA)
       ══════════════════════════════════════════════════════ */
    data: {

      ACHIEVEMENTS: {
        primer_quiz: { icon: '📡', label: 'First sensor quiz completed' },
        flash_master: { icon: '🃏', label: 'All sensor flashcards explored' },
        clasif_pro: { icon: '🗂️', label: 'Expert sensor vs actuator sorter' },
        id_master: { icon: '🔍', label: 'Master sensor spotter' },
        reto_hero: { icon: '🏆', label: 'Sensor vs Actuator challenge hero' },
        nivel3: { icon: '🧭', label: 'Signal Watcher! Level 3' },
        nivel5: { icon: '🥇', label: 'Sensor Engineer! Level 6' },
        widgets_master: { icon: '🧩', label: 'Sensor → controller → actuator chain mastered' }
      },

      lvls: [
        { t: 0, n: 'Beginner 🌱' }, { t: 25, n: 'Tech Explorer 🔋' }, { t: 55, n: 'Signal Watcher 🧭' },
        { t: 90, n: 'Sensor Reader 👀' }, { t: 130, n: 'Sensor Technician 📡' },
        { t: 165, n: 'Sensor Engineer 🛠️' }, { t: 190, n: 'Master of the Robot’s Senses 🤖' }
      ],

      fcData: [
        { w: 'Sensor', a: '📡 The part of the robot that <strong>senses</strong>: it turns something from the world (light, distance, heat, contact, sound, moisture) into a <strong>signal</strong> for the controller.' },
        { w: 'Light sensor', a: '☀️ It measures <strong>how much light there is</strong>: it tells bright from dark. It is the <strong>photoresistor</strong> in the line-following car.' },
        { w: 'Distance sensor', a: '📏 It measures <strong>how far away</strong> an object is. The <strong>ultrasonic</strong> one works like a bat: it sends out sound and waits for the echo.' },
        { w: 'Touch sensor', a: '🤲 A <strong>pushbutton</strong> that reports when something <strong>touches or presses</strong> it: it is used to detect crashes.' },
        { w: 'Temperature sensor', a: '🌡️ It measures <strong>how hot or cold</strong> it is. It is the digital thermometer at the health center.' },
        { w: 'Sound sensor', a: '🔊 A <strong>microphone</strong>: it picks up noises, voices or claps and turns them into a signal.' },
        { w: 'Moisture sensor', a: '💧 It measures <strong>how much water</strong> there is in the soil or in the air. Very useful on the coffee farm and in the school garden.' },
        { w: 'Signal', a: '⚡ The <strong>electric data</strong> the sensor sends to the controller; it is the «language» the robot understands.' },
        { w: 'Actuator', a: '💪 The part that <strong>acts</strong>: motor, wheel, arm, speaker or light. <strong>It senses nothing</strong>: it does, it does not measure.' },
        { w: 'Controller', a: '🧠 The «brain»: it receives the signal from the sensor and <strong>decides</strong> what the actuator must do.' },
        { w: 'Sensor → controller → actuator', a: '🔗 The <strong>robot’s chain</strong>. In your body it is the same: <strong>receptor → brain → effector</strong>.' },
        { w: 'Photoresistor', a: '🔆 The component inside the <strong>light sensor</strong>: it changes with the light it receives, like the pupil of your eye.' },
        { w: 'Wrong reading', a: '⚠️ When the sensor is <strong>dirty, wet or blocked</strong> it reports badly… and the controller <strong>decides badly</strong>.' },
        { w: 'Proximity sensor', a: '📱 The one in your <strong>cell phone</strong>: it switches the screen off when you hold the phone up to your ear.' }
      ],

      memoPairs: [
        { id: 'luz', t: 'Light sensor', d: '☀️ tells bright from dark (line follower)' },
        { id: 'distancia', t: 'Distance sensor', d: '📏 measures how far away the obstacle is' },
        { id: 'tacto', t: 'Touch sensor', d: '🤲 reports when something touches or presses it' },
        { id: 'temperatura', t: 'Temperature sensor', d: '🌡️ measures the heat or the cold around it' },
        { id: 'sonido', t: 'Sound sensor', d: '🔊 picks up noises, voices and claps' },
        { id: 'humedad', t: 'Moisture sensor', d: '💧 measures the water in the soil or the air' }
      ],

      qzData: [
        { q: 'What exactly does a sensor do?', o: ['a) It turns the robot’s wheels', 'b) It turns something from the world into a signal for the controller', 'c) It decides what to do', 'd) It stores the robot’s power'], c: 1 },
        { q: 'Which body part is the light sensor like?', o: ['a) The eye', 'b) The ear', 'c) The muscle', 'd) The bone'], c: 0 },
        { q: 'Which sensor does a robot use to stop before crashing?', o: ['a) Moisture', 'b) Temperature', 'c) Distance', 'd) Sound'], c: 2 },
        { q: 'The ultrasonic sensor works like…', o: ['a) An ant', 'b) A bat that sends out sound and waits for the echo', 'c) A fish', 'd) A plant'], c: 1 },
        { q: 'Which one of these is NOT a sensor?', o: ['a) The microphone', 'b) The touch pushbutton', 'c) The motor', 'd) The thermometer'], c: 2 },
        { q: 'What is the correct chain inside the robot?', o: ['a) Actuator → sensor → controller', 'b) Controller → sensor → actuator', 'c) Sensor → controller → actuator', 'd) Sensor → actuator → controller'], c: 2 },
        { q: 'Which sensor tells you whether the coffee field needs watering?', o: ['a) Moisture', 'b) Light', 'c) Sound', 'd) Touch'], c: 0 },
        { q: 'The cell phone screen switches off next to your ear thanks to…', o: ['a) A heat actuator', 'b) A proximity sensor', 'c) The battery', 'd) The speaker'], c: 1 },
        { q: 'If the light sensor is covered in mud, what happens?', o: ['a) Nothing: sensors are never wrong', 'b) The robot cleans itself', 'c) It gives a wrong reading and the robot decides wrong', 'd) The robot shuts down forever'], c: 2 }
      ],

      classGroups: [
        {
          label: ['Sensor', 'Actuator'], headA: '📡 Sensor (it senses)', headB: '💪 Actuator (it acts)', colA: 'sen', colB: 'act',
          words: [{ w: 'Photoresistor', t: 'sen' }, { w: 'Motor', t: 'act' }, { w: 'Microphone', t: 'sen' }, { w: 'Wheel', t: 'act' }, { w: 'Touch pushbutton', t: 'sen' }, { w: 'Speaker', t: 'act' }, { w: 'Thermometer', t: 'sen' }, { w: 'Mechanical arm', t: 'act' }, { w: 'Ultrasonic sensor', t: 'sen' }, { w: 'LED light', t: 'act' }]
        },
        {
          label: ['Light sensor', 'Distance sensor'], headA: '☀️ Needs a light sensor', headB: '📏 Needs a distance sensor', colA: 'luz', colB: 'dis',
          words: [{ w: 'Follow the black line on the floor', t: 'luz' }, { w: 'Brake before the wall', t: 'dis' }, { w: 'Turn the lamp on at nightfall', t: 'luz' }, { w: 'Open the door when somebody arrives', t: 'dis' }, { w: 'Know whether the room is dark', t: 'luz' }, { w: 'Dodge the trees in the coffee field', t: 'dis' }, { w: 'Detect the shadow of a hand', t: 'luz' }, { w: 'Measure how many centimeters are left', t: 'dis' }]
        },
        {
          label: ['With contact', 'Without contact'], headA: '🤝 It senses by TOUCHING', headB: '📡 It senses WITHOUT touching', colA: 'con', colB: 'sin',
          words: [{ w: 'Bumper pushbutton', t: 'con' }, { w: 'Light sensor', t: 'sin' }, { w: 'Power button', t: 'con' }, { w: 'Ultrasonic distance sensor', t: 'sin' }, { w: 'Moisture sensor in the soil', t: 'con' }, { w: 'Microphone', t: 'sin' }, { w: 'Robot bumper', t: 'con' }, { w: 'Cell phone proximity sensor', t: 'sin' }]
        },
        {
          label: ['Temperature', 'Moisture'], headA: '🌡️ Temperature sensor', headB: '💧 Moisture sensor', colA: 'tem', colB: 'hum',
          words: [{ w: 'Measure a patient’s fever', t: 'tem' }, { w: 'Know whether the soil is dry', t: 'hum' }, { w: 'Look after the chick incubator', t: 'tem' }, { w: 'Tell when to water the coffee field', t: 'hum' }, { w: 'Detect that the motor is heating up', t: 'tem' }, { w: 'Measure the water in the air of the nursery', t: 'hum' }, { w: 'Control the baker’s oven', t: 'tem' }, { w: 'Shut the irrigation off after the rain', t: 'hum' }]
        }
      ],

      idData: [
        { s: ['The', 'sensor', 'senses', 'the', 'robot’s', 'world.'], c: 1, art: 'the part of the robot that senses' },
        { s: ['The', 'controller', 'decides', 'with', 'the', 'sensor’s', 'signal.'], c: 1, art: 'the part of the robot that decides' },
        { s: ['The', 'actuator', 'carries', 'out', 'the', 'order', 'it', 'received.'], c: 1, art: 'the part of the robot that acts' },
        { s: ['The', 'photoresistor', 'measures', 'how', 'much', 'light', 'there', 'is.'], c: 1, art: 'the component inside the light sensor' },
        { s: ['The', 'ultrasonic', 'sensor', 'measures', 'distance', 'with', 'the', 'echo.'], c: 1, art: 'the sensor that works like a bat' },
        { s: ['The', 'microphone', 'picks', 'up', 'the', 'sound', 'of', 'the', 'clap.'], c: 1, art: 'the sensor that picks up sound' },
        { s: ['The', 'moisture', 'sensor', 'reports', 'that', 'the', 'soil', 'is', 'dry.'], c: 1, art: 'what the coffee farm sensor measures' },
        { s: ['The', 'sensor', 'sends', 'a', 'signal', 'to', 'the', 'controller.'], c: 4, art: 'the electric data that travels from the sensor to the controller' }
      ],

      cmpData: [
        { s: 'The sensor turns something from the world into a ___ for the controller.', opts: ['signal', 'wheel', 'battery'], c: 0 },
        { s: 'The light sensor is like your ___.', opts: ['ear', 'eye', 'elbow'], c: 1 },
        { s: 'The distance sensor works like the ___, with the echo.', opts: ['bat', 'horse', 'fish'], c: 0 },
        { s: 'The touch sensor reports when something ___ it.', opts: ['watches', 'touches', 'hears'], c: 1 },
        { s: 'The ___ sensor measures whether the soil is dry.', opts: ['sound', 'light', 'moisture'], c: 2 },
        { s: 'The microphone is a ___ sensor.', opts: ['sound', 'heat', 'distance'], c: 0 },
        { s: 'The motor is not a sensor: it is an ___.', opts: ['controller', 'actuator', 'program'], c: 1 },
        { s: 'If the sensor is dirty it gives a ___ reading.', opts: ['wrong', 'perfect', 'double'], c: 0 }
      ],

      routeSets: [
        {
          label: 'The supermarket automatic door', steps: [
            'The distance sensor detects a person nearby',
            'The signal travels from the sensor to the controller',
            'The controller decides: «if somebody is there, open»',
            'The motor (actuator) slides the door open']
        },
        {
          label: 'Watering the coffee field', steps: [
            'The moisture sensor measures that the soil is dry',
            'The controller receives the data and decides to turn the water on',
            'The valve (actuator) lets the water through',
            'The sensor measures again and reports that the soil is moist now']
        },
        {
          label: 'The classroom line-following car', steps: [
            'The light sensor sees that the floor turned bright',
            'The controller compares: «I drifted off the black line»',
            'It decides to correct its course to the left',
            'The motors (actuators) move the wheels',
            'The sensor confirms that the car is back on the line']
        },
        {
          label: 'The chick incubator robot', steps: [
            'The temperature sensor measures that it is far too cold',
            'The controller decides to switch the heat lamp on',
            'The lamp (actuator) warms the incubator up',
            'The sensor measures again and the controller switches the lamp off']
        }
      ],

      neuronPartes: [
        { desc: 'A robot that stops before crashing into the wall', ans: 'Distance sensor', opts: ['Distance sensor', 'Light sensor', 'Sound sensor', 'Temperature sensor'] },
        { desc: 'A robot that turns the hallway lamp on when it gets dark', ans: 'Light sensor', opts: ['Light sensor', 'Touch sensor', 'Distance sensor', 'Moisture sensor'] },
        { desc: 'A toy robot that starts up when you clap', ans: 'Sound sensor', opts: ['Sound sensor', 'Light sensor', 'Temperature sensor', 'Distance sensor'] },
        { desc: 'A robot that warns you if the chick incubator gets cold', ans: 'Temperature sensor', opts: ['Temperature sensor', 'Sound sensor', 'Touch sensor', 'Light sensor'] },
        { desc: 'A robot that knows when somebody presses its button', ans: 'Touch sensor', opts: ['Touch sensor', 'Distance sensor', 'Moisture sensor', 'Sound sensor'] },
        { desc: 'A robot that waters the coffee field only when the soil is dry', ans: 'Moisture sensor', opts: ['Moisture sensor', 'Sound sensor', 'Touch sensor', 'Light sensor'] },
        { desc: 'A car that follows the black line painted on the classroom floor', ans: 'Light sensor', opts: ['Light sensor', 'Temperature sensor', 'Sound sensor', 'Moisture sensor'] },
        { desc: 'The supermarket door that opens when you walk up to it', ans: 'Distance sensor', opts: ['Distance sensor', 'Moisture sensor', 'Touch sensor', 'Sound sensor'] }
      ],

      neuroPairs: [
        { trans: 'Light sensor', func: 'The eye: it picks up light and tells bright from dark', opts: ['The eye: it picks up light and tells bright from dark', 'The ear: it picks up sounds', 'The muscle: it moves the body', 'The bone: it holds the body up'] },
        { trans: 'Sound sensor', func: 'The ear: it picks up noises, voices and claps', opts: ['The ear: it picks up noises, voices and claps', 'The eye: it picks up light', 'The tongue: it picks up flavors', 'The muscle: it carries out the movement'] },
        { trans: 'Touch sensor', func: 'The skin: it feels when something touches or presses it', opts: ['The skin: it feels when something touches or presses it', 'The eye: it picks up light', 'The heart: it pumps the blood', 'The lung: it takes in the air'] },
        { trans: 'Temperature sensor', func: 'The skin: it feels whether something is hot or cold', opts: ['The skin: it feels whether something is hot or cold', 'The ear: it picks up sound', 'The hand: it grabs objects', 'The foot: it holds the weight'] },
        { trans: 'Distance sensor', func: 'The bat’s echo: it measures how far away something is', opts: ['The bat’s echo: it measures how far away something is', 'The stomach: it digests the food', 'The muscle: it pushes and pulls', 'The blood: it carries oxygen'] }
      ],

      enfermedadData: [
        { disease: 'The microphone', characteristic: 'It is a sensor', opts: ['It is a sensor', 'It is an actuator'] },
        { disease: 'The wheel motor', characteristic: 'It is an actuator', opts: ['It is an actuator', 'It is a sensor'] },
        { disease: 'The photoresistor', characteristic: 'It is a sensor', opts: ['It is a sensor', 'It is an actuator'] },
        { disease: 'The speaker that sounds', characteristic: 'It is an actuator', opts: ['It is an actuator', 'It is a sensor'] },
        { disease: 'The bumper pushbutton', characteristic: 'It is a sensor', opts: ['It is a sensor', 'It is an actuator'] },
        { disease: 'The valve that opens the irrigation', characteristic: 'It is an actuator', opts: ['It is an actuator', 'It is a sensor'] }
      ],

      retoPairs: [
        {
          label: ['Sensor', 'Actuator'], btnA: '📡 Sensor', btnB: '💪 Actuator', colA: 'sen', colB: 'act',
          words: [{ w: 'Photoresistor', t: 'sen' }, { w: 'Motor', t: 'act' }, { w: 'Microphone', t: 'sen' }, { w: 'Wheel', t: 'act' }, { w: 'Pushbutton', t: 'sen' }, { w: 'Speaker', t: 'act' }, { w: 'Thermometer', t: 'sen' }, { w: 'Mechanical arm', t: 'act' }, { w: 'Ultrasonic sensor', t: 'sen' }, { w: 'LED light', t: 'act' }]
        },
        {
          label: ['Light sensor', 'Distance sensor'], btnA: '☀️ Light', btnB: '📏 Distance', colA: 'luz', colB: 'dis',
          words: [{ w: 'Follow the black line', t: 'luz' }, { w: 'Brake before the wall', t: 'dis' }, { w: 'Turn the lamp on at night', t: 'luz' }, { w: 'Open the automatic door', t: 'dis' }, { w: 'Know whether it is dark', t: 'luz' }, { w: 'Dodge a tree', t: 'dis' }, { w: 'Detect a shadow', t: 'luz' }, { w: 'Measure centimeters with the echo', t: 'dis' }]
        },
        {
          label: ['With contact', 'Without contact'], btnA: '🤝 Touching', btnB: '📡 Not touching', colA: 'con', colB: 'sin',
          words: [{ w: 'Bumper pushbutton', t: 'con' }, { w: 'Light sensor', t: 'sin' }, { w: 'Power button', t: 'con' }, { w: 'Ultrasonic sensor', t: 'sin' }, { w: 'Moisture sensor in the soil', t: 'con' }, { w: 'Microphone', t: 'sin' }, { w: 'Bumper', t: 'con' }, { w: 'Proximity sensor', t: 'sin' }]
        }
      ],

      identifyTaskDB: [
        { s: 'The sensor turns light, sound or distance into a signal.', type: 'Sensor' },
        { s: 'The photoresistor tells the bright floor from the black line.', type: 'Light sensor' },
        { s: 'The ultrasonic sensor measures distance with the echo, like a bat.', type: 'Distance sensor' },
        { s: 'The pushbutton reports when the robot crashes into something.', type: 'Touch sensor' },
        { s: 'The digital thermometer measures fever at the health center.', type: 'Temperature sensor' },
        { s: 'The microphone picks up claps and voices.', type: 'Sound sensor' },
        { s: 'This sensor tells you when to water the coffee field.', type: 'Moisture sensor' },
        { s: 'The motor turns the wheels when the controller orders it to.', type: 'Actuator' },
        { s: 'It receives the sensor’s signal and decides what to do.', type: 'Controller' },
        { s: 'The dirty sensor reported badly and the robot drifted off the line.', type: 'Wrong reading' }
      ],

      classifyTaskDB: [
        { w: 'Light sensor', gen: 'Sensor', n: 'How much light there is: bright or dark', g: '👁️ The eye', t: 'Line-following car; hallway lamp' },
        { w: 'Distance sensor', gen: 'Sensor', n: 'How far away an object is (by echo)', g: '🦇 The bat’s echo', t: 'Supermarket automatic door' },
        { w: 'Touch sensor', gen: 'Sensor', n: 'Whether something touches or presses it', g: '🖐️ The skin', t: 'Robot bumper; power button' },
        { w: 'Temperature sensor', gen: 'Sensor', n: 'The heat or the cold', g: '🖐️ The skin', t: 'Thermometer at the health center' },
        { w: 'Sound sensor', gen: 'Sensor', n: 'Noises, voices and claps', g: '👂 Hearing', t: 'Cell phone microphone' },
        { w: 'Moisture sensor', gen: 'Sensor', n: 'The water in the soil or the air', g: '🖐️ Touch (wet soil)', t: 'Watering the coffee field and the school garden' },
        { w: 'Motor', gen: 'Actuator', n: 'It senses nothing: it carries out the order', g: '💪 The muscle', t: 'Wheels of the robotic car' },
        { w: 'Speaker', gen: 'Actuator', n: 'It senses nothing: it produces sound', g: '🗣️ The voice', t: 'Robot alarm when it backs up' }
      ],

      completeTaskDB: [
        { s: 'The sensor turns something from the world into a ___.', opts: ['signal', 'wheel', 'shadow'], ans: 'signal' },
        { s: 'The light sensor is like the human ___.', opts: ['eye', 'elbow', 'tooth'], ans: 'eye' },
        { s: 'The ultrasonic sensor measures ___ with the echo.', opts: ['distance', 'fever', 'moisture'], ans: 'distance' },
        { s: 'The microphone is the ___ sensor.', opts: ['sound', 'heat', 'light'], ans: 'sound' },
        { s: 'The ___ sensor tells you when to water the coffee field.', opts: ['moisture', 'sound', 'touch'], ans: 'moisture' },
        { s: 'The robot chain is sensor → controller → ___.', opts: ['actuator', 'battery', 'antenna'], ans: 'actuator' },
        { s: 'The motor does not sense: it is an ___.', opts: ['actuator', 'sensor', 'program'], ans: 'actuator' },
        { s: 'A dirty sensor gives a ___ reading.', opts: ['wrong', 'exact', 'double'], ans: 'wrong' }
      ],

      explainQuestions: [
        { q: 'What is a sensor? Explain in your own words what it picks up and what it turns it into.', ans: 'A sensor is the part of the robot that senses: it picks up something from the real world (light, distance, heat, contact, sound or moisture) and turns it into an electric signal the controller can understand.' },
        { q: 'Explain the sensor → controller → actuator chain and compare it with your body.', ans: 'The sensor senses and sends the signal (like the receptor: eye, ear or skin), the controller decides (like the brain) and the actuator carries out the action (like the muscle). In the body it is receptor → brain → effector.' },
        { q: 'How is a sensor different from an actuator? Give two examples of each.', ans: 'The sensor brings information into the robot (it senses): photoresistor, ultrasonic sensor, microphone, thermometer. The actuator sends action out (it does something): motor, wheel, speaker, LED light, valve. The sensor moves nothing and the actuator measures nothing.' },
        { q: 'Name five sensors you use or see in your community and say what each one senses.', ans: 'Open answer. For example: automatic door (distance), hallway light (light), cell phone next to your ear (proximity), thermometer at the health center (temperature), watering the coffee field (moisture).' },
        { q: 'What happens if a sensor gives a wrong reading? Write an example and how you would check it.', ans: 'If the sensor is dirty, wet, blocked or there is little light, it reports badly and the controller decides badly: for example, the line follower drifts off the line. You check it by cleaning the sensor, removing whatever is blocking it and testing it in good light before you blame the program.' },
        { q: 'Design a robot for a problem in your community: which sensors does it carry and what does each one sense?', ans: 'Open answer. It must name at least two sensors that suit the problem, say what each one senses, the controller’s decision («if X happens, then Y») and which actuator it responds with.' }
      ],

      sopaSets: [
        _sopa(10, ['SENSOR', 'LIGHT', 'TOUCH', 'SOUND', 'MOISTURE', 'DISTANCE'], 20260725),
        _sopa(12, ['TEMPERATURE', 'CONTROLLER', 'ULTRASONIC', 'ACTUATOR', 'SIGNAL', 'ECHO'], 51920268)
      ],

      evalTFBank: [
        { q: 'The sensor turns something from the world into a signal for the controller.', a: true },
        { q: 'The sensor is the one that decides what the robot will do.', a: false },
        { q: 'The light sensor is like the human eye.', a: true },
        { q: 'The wheel motor is a sensor.', a: false },
        { q: 'The ultrasonic sensor measures distance with the echo, like a bat.', a: true },
        { q: 'The microphone is the robot’s sound sensor.', a: true },
        { q: 'The touch sensor needs something to touch it or press it.', a: true },
        { q: 'The moisture sensor is used to know whether the soil is dry.', a: true },
        { q: 'Sensors are never wrong.', a: false },
        { q: 'The robot chain is: sensor → controller → actuator.', a: true },
        { q: 'The robot’s speaker is a sound sensor.', a: false },
        { q: 'The supermarket automatic door uses a sensor to detect you.', a: true },
        { q: 'A dirty or blocked sensor can give a wrong reading.', a: true },
        { q: 'The temperature sensor measures how much light there is in the room.', a: false },
        { q: 'In the human body the chain is receptor → brain → effector.', a: true }
      ],

      evalMCBank: [
        { q: 'What is a sensor?', o: ['a) The part that moves the robot', 'b) The part that senses and turns the world into a signal', 'c) The robot’s battery', 'd) The list of instructions'], a: 1 },
        { q: 'Which human sense is the light sensor like?', o: ['a) Hearing', 'b) Taste', 'c) Sight', 'd) Smell'], a: 2 },
        { q: 'Which sensor does a robot need so it does not crash into the wall?', o: ['a) Moisture', 'b) Distance', 'c) Temperature', 'd) Sound'], a: 1 },
        { q: 'The ultrasonic sensor works like…', o: ['a) The bat, with the echo', 'b) The ant, with its legs', 'c) The flower, with the sun', 'd) The fish, with its fins'], a: 0 },
        { q: 'Which one of these is NOT a sensor?', o: ['a) The microphone', 'b) The thermometer', 'c) The pushbutton', 'd) The motor'], a: 3 },
        { q: 'What is the correct chain inside the robot?', o: ['a) Sensor → controller → actuator', 'b) Actuator → controller → sensor', 'c) Controller → sensor → actuator', 'd) Sensor → actuator → controller'], a: 0 },
        { q: 'Which sensor tells you when to water the coffee field?', o: ['a) Light', 'b) Sound', 'c) Moisture', 'd) Touch'], a: 2 },
        { q: 'Which sensor does the line-following car use?', o: ['a) Light', 'b) Temperature', 'c) Moisture', 'd) Sound'], a: 0 },
        { q: 'The cell phone screen switches off next to your ear thanks to…', o: ['a) The speaker', 'b) A proximity sensor', 'c) The battery', 'd) The vibration motor'], a: 1 },
        { q: 'Which sensor does the digital thermometer at the health center have?', o: ['a) Sound', 'b) Moisture', 'c) Temperature', 'd) Light'], a: 2 },
        { q: 'What happens if the light sensor is covered in mud?', o: ['a) Nothing, sensors never fail', 'b) The robot cleans itself', 'c) It gives a wrong reading and the robot decides wrong', 'd) The robot gains more speed'], a: 2 },
        { q: 'What is the difference between a sensor and an actuator?', o: ['a) The sensor senses and the actuator carries out the action', 'b) The sensor acts and the actuator senses', 'c) They both do the same thing', 'd) The actuator decides and the sensor obeys'], a: 0 },
        { q: 'Which sensor detects that the robot crashed?', o: ['a) Touch', 'b) Light', 'c) Moisture', 'd) Temperature'], a: 0 },
        { q: 'Which body part is the controller compared to?', o: ['a) The skin', 'b) The ear', 'c) The muscle', 'd) The brain'], a: 3 },
        { q: 'The component inside the light sensor is called…', o: ['a) Valve', 'b) Photoresistor', 'c) Propeller', 'd) Gear'], a: 1 }
      ],

      evalCPBank: [
        { q: 'The sensor turns something from the world into a ___ for the controller.', a: 'signal' },
        { q: 'The light sensor is like the human ___.', a: 'eye' },
        { q: 'The robot’s sound sensor is the ___.', a: 'microphone' },
        { q: 'The distance sensor measures with the ___, just like a bat.', a: 'echo' },
        { q: 'The ___ sensor reports whether the soil of the coffee field is dry.', a: 'moisture' },
        { q: 'The touch sensor is a ___ that gets pressed in a crash.', a: 'pushbutton' },
        { q: 'The robot chain is sensor → controller → ___.', a: 'actuator' },
        { q: 'In the body the chain is receptor → brain → ___.', a: 'effector' },
        { q: 'The motor and the speaker do not sense: they are ___.', a: 'actuators' },
        { q: 'The component inside the light sensor is called a ___.', a: 'photoresistor' },
        { q: 'A dirty or blocked sensor gives a ___ reading.', a: 'wrong' },
        { q: 'The digital thermometer is a ___ sensor.', a: 'temperature' },
        { q: 'The ___ door of the supermarket opens thanks to a sensor.', a: 'automatic' },
        { q: 'The distance sensor that uses ultrasound is called ___.', a: 'ultrasonic' },
        { q: 'The sensor does not decide: the one that decides is the ___.', a: 'controller' }
      ],

      evalPRBank: [
        { term: 'Sensor', def: 'It senses the world and turns it into a signal' },
        { term: 'Light sensor', def: 'It tells bright from dark; it serves the line follower' },
        { term: 'Distance sensor', def: 'It measures how far away an object is with the echo' },
        { term: 'Touch sensor', def: 'A pushbutton that reports when something presses it' },
        { term: 'Temperature sensor', def: 'It measures heat or cold: the digital thermometer' },
        { term: 'Sound sensor', def: 'Microphone: it picks up noises, voices and claps' },
        { term: 'Moisture sensor', def: 'It measures the water in the soil: it tells you when to water' },
        { term: 'Actuator', def: 'It carries out the action: motor, wheel, speaker or light' },
        { term: 'Controller', def: 'It receives the signal and decides what will be done' },
        { term: 'Signal', def: 'Electric data the sensor sends to the controller' },
        { term: 'Photoresistor', def: 'A component that changes with the light it receives' },
        { term: 'Ultrasonic sensor', def: 'A sensor that sends out sound and waits for the echo' },
        { term: 'Wrong reading', def: 'What a dirty, wet or blocked sensor reports' },
        { term: 'Proximity sensor', def: 'It switches the cell phone screen off next to your ear' },
        { term: 'Receptor', def: 'The name of the sensor in the human body' }
      ],

      critSensorBank: [
        { txt: 'A robot waters the school garden only when the soil is dry.', ans: 'Moisture sensor: it measures the water in the soil; if the soil is dry, the controller decides to turn the irrigation on. If the sensor gets wet on the outside it may report «moist» and the garden is left without water.' },
        { txt: 'A delivery robot stops before crashing into a wall or a person.', ans: 'Distance sensor (ultrasonic): it uses the echo to measure how close the obstacle is; if it is too close, the controller decides to brake. If something blocks the sensor, the echo never comes back and the robot crashes.' },
        { txt: 'A robotic hallway lamp turns itself on when night falls.', ans: 'Light sensor: it detects that there is little light; the controller decides to turn the lamp on. If the sensor is dirty, it may «see» darkness at noon and turn the lamp on for no reason.' },
        { txt: 'A robot looks after the chick incubator and warns if it gets cold.', ans: 'Temperature sensor: it measures the heat; if it drops too low, the controller decides to switch on the lamp or the alarm. If the sensor sits far from the chicks, the reading is useless.' },
        { txt: 'A toy robot starts up when the child claps twice.', ans: 'Sound sensor (microphone): it picks up the claps; the controller decides to start the motors. In a noisy place the sensor can get confused and start up on its own.' },
        { txt: 'A robotic car follows a black line painted on the classroom floor.', ans: 'Light sensor: it tells black apart from the bright floor; the controller decides to correct the course. With a dirty lens or in low light it gives wrong readings and the car drifts off.' },
        { txt: 'The supermarket door opens when a person walks up to it.', ans: 'Distance or motion sensor: it detects the person nearby; the controller decides to open and the motor slides the door. If the sensor points the wrong way, the door opens when nobody is coming through.' },
        { txt: 'The robot detects that somebody pressed its emergency button.', ans: 'Touch sensor (pushbutton): it is triggered by contact; the controller decides to stop everything. It is a sensor that needs to be touched: it does not work from a distance.' }
      ],

      critErrorBank: [
        {
          txt: '"The sensor moves the robot: that is why the car goes forward."',
          g1: 'The sensor MOVES NOTHING: it only senses and sends a signal to the controller.',
          g2: 'The one that moves the car is the ACTUATOR (the motor), after the controller has decided. The chain is sensor → controller → actuator.'
        },
        {
          txt: '"Sensors are the robot’s muscles and actuators are its senses."',
          g1: 'It is the other way round: SENSORS are the «senses» (they sense light, sound, distance, heat, moisture).',
          g2: 'ACTUATORS are the «muscles» (motors, wheels, arms, speakers) that carry out the action.'
        },
        {
          txt: '"A sensor is never wrong: it always tells the truth."',
          g1: 'A sensor CAN give a wrong reading if it is dirty, wet, blocked or badly placed.',
          g2: 'And if the sensor reports badly, the controller decides badly: that is why the line follower drifts off the line when the sensor is muddy.'
        },
        {
          txt: '"With one single light sensor the robot can already measure distance and temperature."',
          g1: 'Each sensor senses ONE single thing: the light sensor only measures how much light there is.',
          g2: 'To measure distance you need a distance sensor (ultrasonic) and for heat a temperature sensor. That is why robots carry several sensors.'
        },
        {
          txt: '"The touch sensor can warn about the obstacle before reaching it."',
          g1: 'The touch sensor needs CONTACT: it reports once the robot has already crashed into something or pressed it.',
          g2: 'To know BEFORE that happens you need a sensor that senses without touching, such as the ultrasonic distance sensor.'
        },
        {
          txt: '"Sensors think and decide what the robot must do."',
          g1: 'Sensors DO NOT think and DO NOT decide: they only measure and turn what they measured into a signal.',
          g2: 'The one that decides is the CONTROLLER, following its program: «if the sensor reads X, then do Y».'
        }
      ],

      critCicloQuestions: [
        '1. Which SENSOR does it use and what exactly does it sense?',
        '2. What does the controller DECIDE with that signal?',
        '3. Which ACTUATOR does the robot respond with?'
      ],

      critCicloBank: [
        {
          txt: 'The supermarket automatic door opens when a person walks up and closes when nobody else is coming through.',
          p: 'A distance or motion sensor senses that somebody is near the door.',
          d: 'The controller decides to open when it detects somebody and to close when there is nobody left.',
          a: 'A motor (actuator) slides the door to one side and then brings it back.'
        },
        {
          txt: 'The school garden robot measures the soil every morning; if it is dry it turns the water on and, once the soil is moist, it turns it off.',
          p: 'The moisture sensor senses how much water the soil holds.',
          d: 'The controller decides to turn the irrigation on if the soil is dry and to shut it off once the soil is moist.',
          a: 'A valve or pump (actuator) lets the water through and then cuts it off.'
        },
        {
          txt: 'The lamp in the school hallway turns itself on at nightfall and off at daybreak.',
          p: 'The light sensor senses how much light there is in the hallway.',
          d: 'The controller decides to turn it on when there is little light and to turn it off when daylight comes back.',
          a: 'The lamp or bulb (actuator) turns on and off.'
        },
        {
          txt: 'The classroom line-following car travels along a black track painted on the floor without drifting off.',
          p: 'The light sensor senses whether the floor under the car is dark (the line) or bright (off the line).',
          d: 'The controller decides to correct the course toward the side where it finds the line again.',
          a: 'The wheel motors (actuators) spin more on one side than on the other in order to turn.'
        },
        {
          txt: 'The chick incubator robot watches over the heat all night long.',
          p: 'The temperature sensor senses how many degrees there are inside the incubator.',
          d: 'The controller decides to switch the lamp on if it is cold and to switch it off once there is enough heat.',
          a: 'The heat lamp (actuator) turns on; an alarm may sound if the problem goes on.'
        }
      ],

      critCompareBank: [
        {
          a: 'The part of the robot that picks up information from the world: light, sound, distance, heat or moisture.',
          b: 'The part of the robot that carries out the action: motors, wheels, arms, speakers or lights.',
          ga: 'The sensor.',
          gb: 'The actuator.',
          gr: 'Similarity: both are robot parts connected to the controller and both need power. Difference: the sensor brings information in (it senses) and the actuator sends action out (it does), like the senses and the muscles of the body.'
        },
        {
          a: 'A sensor that tells whether the floor is bright or dark so the robot does not drift off the track.',
          b: 'A sensor that uses the echo to measure how many centimeters are left before a crash.',
          ga: 'The light sensor.',
          gb: 'The distance sensor (ultrasonic).',
          gr: 'Similarity: both sense WITHOUT touching and both report to the controller. Difference: the light one measures brightness and the distance one measures how far away an object is; one serves the line follower and the other one is used to dodge obstacles.'
        },
        {
          a: 'A sensor that is triggered only when something touches it or presses it.',
          b: 'A sensor that senses objects even when they are several centimeters away.',
          ga: 'The touch sensor (pushbutton).',
          gb: 'The distance sensor (ultrasonic) or the proximity sensor.',
          gr: 'Similarity: both detect obstacles. Difference: the touch one reports once the crash HAS ALREADY happened and the distance one reports BEFORE, which is why it is used to brake in time.'
        },
        {
          a: 'The organ of the human body that picks up light and sends it to the brain.',
          b: 'The robot component that changes with the light it receives and reports to the controller.',
          ga: 'The eye (receptor).',
          gb: 'The light sensor or photoresistor.',
          gr: 'Similarity: both sense light and send the information to whoever decides (brain or controller). Difference: the eye is a living organ of the body and the sensor is a manufactured electronic component.'
        },
        {
          a: 'A sensor that measures how hot or cold a place is.',
          b: 'A sensor that measures how much water there is in the soil or in the air.',
          ga: 'The temperature sensor.',
          gb: 'The moisture sensor.',
          gr: 'Similarity: both keep watch over the environment and both are very useful in Honduran farming. Difference: the temperature one serves the incubator or the thermometer at the health center, and the moisture one helps decide when to water the coffee field.'
        }
      ],

      critDesignBank: [
        'In the school garden water gets wasted: sometimes they water when the soil is still wet and other times they forget for days.',
        'In the school hallway the light is left on all day long and the power bill is sky-high.',
        'At the coffee mill the beans dry in the sun out in the yard and nobody gives the warning in time when it starts to rain.',
        'The school gate is left open because nobody notices when somebody comes in or goes out.',
        'In the grain storehouse the corn spoils because of the moisture and nobody notices until it is already ruined.',
        'The youngest children get too close to the cookfire in the school kitchen and nobody sees them in time.'
      ],

      critDesignGuide: 'Rubric with 3 criteria (20 pts total): ① SENSORS (8 pts): choose at least two sensors that suit the problem and explain WHAT EACH ONE SENSES. ② CONTROLLER (6 pts): write a clear decision of the type «if the sensor reads X, then the robot does Y». ③ ACTUATOR AND FAILURES (6 pts): name what the robot acts with and mention what could make a sensor give a wrong reading (dirty, wet, blocked, low light). Any design counts as long as the sensor → controller → actuator chain is complete and realistic.',

      sensorData: {
        luz: {
          nombre: 'The light sensor', icon: '☀️',
          percibe: { title: 'What does it sense?', info: '• It measures <strong>how much light</strong> there is: it tells <strong>bright from dark</strong><br>• Its component is called a <strong>photoresistor</strong><br>• It turns the light into a <strong>signal</strong> for the controller' },
          sentido: { title: 'Which sense is it like?', info: '• It is like your <strong>eye</strong> 👁️: the sense of <strong>sight</strong><br>• Your eye picks up light and reports to the brain; the sensor reports to the controller<br>• It is the <strong>receptor</strong> of the chain, just like in your body' },
          honduras: { title: 'Honduran example', info: '• The <strong>line-following car</strong> the Robotics class builds<br>• The <strong>hallway light</strong> that turns itself on at nightfall<br>• The <strong>solar lampposts</strong> in the park that wake up at night' },
          falla: { title: 'What if it fails?', info: '• With a <strong>mud-covered lens</strong> it «sees» dark where it is bright<br>• The car <strong>drifts off the line</strong> because the data is false<br>• In very <strong>low light</strong> it can no longer tell the bright floor from the black one' }
        },
        distancia: {
          nombre: 'The distance sensor', icon: '📏',
          percibe: { title: 'What does it sense?', info: '• It measures <strong>how far away</strong> an object is, in centimeters<br>• The <strong>ultrasonic</strong> one sends out a sound and waits for the <strong>echo</strong><br>• It senses <strong>without touching</strong>: it warns before the crash' },
          sentido: { title: 'Which sense is it like?', info: '• It is like the <strong>bat’s echo</strong> 🦇, which «sees» with its hearing<br>• It is also like your <strong>sight</strong> when you work out whether something is close<br>• The signal reaches the controller just as it reaches the brain in your body' },
          honduras: { title: 'Honduran example', info: '• The supermarket <strong>automatic door</strong><br>• The <strong>drone</strong> that dodges the trees in the coffee field<br>• The car’s <strong>backup sensor</strong> that beeps as you get close to a wall' },
          falla: { title: 'What if it fails?', info: '• If something <strong>blocks</strong> it, the echo never comes back and the robot <strong>crashes</strong><br>• Against soft fabric the echo gets lost: it <strong>measures the distance wrong</strong><br>• Badly aimed, the automatic door opens <strong>when nobody is coming through</strong>' }
        },
        tacto: {
          nombre: 'The touch sensor', icon: '🤲',
          percibe: { title: 'What does it sense?', info: '• It detects <strong>contact</strong>: whether something touches it or presses it<br>• It is usually a <strong>pushbutton</strong> on the bumper<br>• It has only two answers: <strong>pressed or released</strong>' },
          sentido: { title: 'Which sense is it like?', info: '• It is like your <strong>skin</strong> 🖐️: the sense of <strong>touch</strong><br>• You feel it when you touch the wall; so does the robot<br>• It needs <strong>contact</strong>: it senses nothing from a distance' },
          honduras: { title: 'Honduran example', info: '• The <strong>power button</strong> of any appliance at home<br>• The <strong>bumper</strong> of the classroom robotic car<br>• The school <strong>bell</strong> when somebody presses it' },
          falla: { title: 'What if it fails?', info: '• If it gets <strong>stuck</strong>, the robot believes it is crashing all the time<br>• If it does not respond, the robot <strong>keeps pushing</strong> against the wall<br>• Even when it works, it reports <strong>late</strong>: once the bump has already happened' }
        },
        temperatura: {
          nombre: 'The temperature sensor', icon: '🌡️',
          percibe: { title: 'What does it sense?', info: '• It measures <strong>how hot or cold</strong> it is, in degrees<br>• It turns those degrees into a <strong>signal</strong> with numbers<br>• It allows decisions such as <strong>«if it drops below 30°, turn the lamp on»</strong>' },
          sentido: { title: 'Which sense is it like?', info: '• It is like your <strong>skin</strong> 🖐️ when it feels cold or heat<br>• You pull your hand back from the hot griddle; the robot shuts the motor off<br>• It is a <strong>receptor</strong> that reports to the «brain» of the system' },
          honduras: { title: 'Honduran example', info: '• The <strong>digital thermometer</strong> at the health center<br>• The <strong>chick incubator</strong> that watches over the heat all night<br>• The baker’s <strong>oven</strong> that signals when the bread is ready' },
          falla: { title: 'What if it fails?', info: '• If it sits <strong>far away</strong> from what it should measure, the reading is useless<br>• In direct sunlight it reads <strong>more heat</strong> than there really is in the shade<br>• With a false reading, the incubator <strong>gets cold or overheats</strong>' }
        },
        humedad: {
          nombre: 'The moisture sensor', icon: '💧',
          percibe: { title: 'What does it sense?', info: '• It measures <strong>how much water</strong> there is in the soil or in the air<br>• Its tip goes into the ground and senses whether the soil is <strong>dry or wet</strong><br>• It reports to the controller so it can decide <strong>when to water</strong>' },
          sentido: { title: 'Which sense is it like?', info: '• It is like your <strong>touch</strong> 🖐️ when you feel the soil and know whether it is wet<br>• It is also like the feeling of <strong>heavy air</strong> before it rains<br>• Like every receptor, it only reports: <strong>it neither decides nor waters</strong>' },
          honduras: { title: 'Honduran example', info: '• <strong>Watering the coffee field</strong>: it saves water and protects the harvest<br>• The <strong>school garden</strong> that waters itself over the weekend<br>• The <strong>grain storehouse</strong> that watches over the moisture of the corn' },
          falla: { title: 'What if it fails?', info: '• If it stays <strong>wet on the outside</strong>, it reads «moist» and the plant never gets watered<br>• If it goes into the ground <strong>too shallow</strong>, it measures the dust on top and not the root<br>• With a wrong reading, <strong>water gets wasted</strong> or the crop is lost' }
        }
      }
    },

    /* ══════════════════════════════════════════════════════
       3. FRASES EXACTAS (pantalla y pruebas imprimibles)
       ══════════════════════════════════════════════════════ */
    frases: {
      /* mensaje de WhatsApp: lo propio de esta misión
         (lo común a todas las misiones vive en js/metas-i18n.js) */
      'Aprende cómo el robot VE, OYE, TOCA y MIDE el mundo con sus sensores. 🤖':
        'Learn how the robot SEES, HEARS, TOUCHES and MEASURES the world with its sensors. 🤖',
      /* barra superior, navegación y pie */
      'Aprende': 'Learn', 'Tipos': 'Types', 'Lab': 'Lab', 'Flashcards': 'Flashcards', 'Quiz': 'Quiz',
      /* laboratorio (rótulos del robot en SVG) */
      'CONTROLADOR': 'CONTROLLER', 'LUZ': 'LIGHT', 'DISTANCIA': 'DISTANCE',
      'TEMPERATURA': 'TEMPERATURE', 'HUMEDAD': 'MOISTURE', 'TACTO 🤲': 'TOUCH 🤲',
      '🔬 Laboratorio de Sensores': '🔬 Sensor Laboratory',
      'Toca un sensor del robot (en el dibujo o en los botones) y luego un aspecto para explorarlo. ¡Combínalos todos!':
        'Tap a robot sensor (on the drawing or on the buttons) and then an aspect to explore it. Try every combination!',
      'Explorar el sensor de luz': 'Explore the light sensor',
      'Explorar el sensor de distancia': 'Explore the distance sensor',
      'Explorar el sensor de temperatura': 'Explore the temperature sensor',
      'Explorar el sensor de humedad': 'Explore the moisture sensor',
      'Explorar el sensor de tacto': 'Explore the touch sensor',
      'Robot con cinco sensores: toca cada sensor para explorarlo': 'A robot with five sensors: tap each sensor to explore it',
      /* flashcards y memorama */
      '🧠 Memorama de los Sensores': '🧠 Sensor Memory Game',
      /* quiz, clasifica, identifica, completa */
      '¡Correcto! Piensas como todo un técnico de sensores.': 'Correct! You are thinking like a real sensor technician.',
      'Casi. Pregúntate: ¿percibe algo del mundo o hace algo en el mundo?': 'Almost. Ask yourself: does it sense something in the world, or does it do something in the world?',
      '💡 Consejo: ¡Usa el botón "Variar grupo" varias veces! Practicar con diferentes categorías te ayudará a dominar el tema.':
        '💡 Tip: use the "Change group" button several times! Practicing with different categories helps you master the topic.',
      /* widgets */
      '🔗 Sensor → Controlador → Actuador: ordena la cadena': '🔗 Sensor → Controller → Actuator: put the chain in order',
      'Hay pasos fuera de orden. Recuerda: sensor → controlador → actuador.': 'Some steps are out of order. Remember: sensor → controller → actuator.',
      '📡 ¿Qué sensor necesita?': '📡 Which sensor does it need?',
      'Lee la situación y elige el sensor adecuado:': 'Read the situation and choose the right sensor:',
      '🎉 ¡Eres todo un técnico de sensores!': '🎉 You are a true sensor technician!',
      '🫀 Empareja: Sensor → Sentido humano': '🫀 Match: Sensor → Human sense',
      '¿A qué parte del cuerpo humano se parece este sensor?': 'Which part of the human body is this sensor like?',
      'Sensor de luz': 'Light sensor',
      '📡💪 ¿Sensor o actuador?': '📡💪 Sensor or actuator?',
      'Pregúntate: ¿me informa algo del mundo o hace algo en el mundo?': 'Ask yourself: does it tell me something about the world, or does it do something in the world?',
      'El micrófono': 'The microphone',
      /* reto */
      '📡 Sensor': '📡 Sensor', '💪 Actuador': '💪 Actuator',
      /* generador de tareas */
      '🔍 Identificar': '🔍 Identify', '🗂️ Analizar sensores': '🗂️ Analyze sensors',
      'Copia en tu cuaderno; subraya, colorea o encierra el concepto de robótica indicado en cada oración. Escribe al lado de qué sensor o parte se trata.':
        'Copy this in your notebook; underline, color or circle the robotics concept in each sentence. Next to it, write which sensor or part it is.',
      'Copia la siguiente tabla en tu cuaderno. Para cada componente responde: ¿es sensor o actuador?, ¿qué percibe?, ¿a qué sentido humano se parece? y escribe un ejemplo real.':
        'Copy the table below in your notebook. For each component answer: is it a sensor or an actuator? what does it sense? which human sense is it like? and write a real example.',
      'Componente': 'Component', '¿Sensor o actuador?': 'Sensor or actuator?', '¿Qué percibe?': 'What does it sense?',
      'Sentido humano': 'Human sense', 'Ejemplo': 'Example',
      /* evaluación conceptual: pantalla */
      'Evaluación Final · Sensores: los Sentidos del Robot · Educación Básica · Robótica': 'Final Test · Sensors: The Robot’s Senses · Basic Education · Robotics',
      'Evaluación Competencial · Pensamiento Crítico · Sensores: los Sentidos del Robot · Educación Básica': 'Competency Test · Critical Thinking · Sensors: The Robot’s Senses · Basic Education',
      /* la versión impresa añade la materia al final */
      'Evaluación Competencial · Pensamiento Crítico · Sensores: los Sentidos del Robot · Educación Básica · Robótica': 'Competency Test · Critical Thinking · Sensors: The Robot’s Senses · Basic Education · Robotics',
      '🎓 Evaluación Final · Sensores: los Sentidos del Robot': '🎓 Final Test · Sensors: The Robot’s Senses',
      '🧠 Prueba de Pensamiento Crítico · Sensores: los Sentidos del Robot': '🧠 Critical Thinking Test · Sensors: The Robot’s Senses',
      /* pensamiento crítico */
      'I. Elige el sensor y justifica': 'I. Choose the sensor and justify it',
      'III. Analiza la cadena: sensor → controlador → actuador': 'III. Analyze the chain: sensor → controller → actuator',
      'V. Diseña el sistema de sensores de tu robot': 'V. Design your robot’s sensor system',
      '¿Qué sensor necesita este robot? Justifica: ¿qué percibe y qué podría hacer que se equivoque?':
        'Which sensor does this robot need? Justify your choice: what does it sense and what could make it get things wrong?',
      '¿Qué sensor necesita este robot? Justifica tu elección.': 'Which sensor does this robot need? Justify your choice.',
      'Esta afirmación tiene dos errores. Corrígelos con argumentos, usando la cadena sensor → controlador → actuador:':
        'This statement contains two mistakes. Correct them with arguments, using the sensor → controller → actuator chain:',
      'Inventa un robot que resuelva este problema: escribe su nombre, qué SENSORES lleva y qué percibe cada uno, qué DECIDE su controlador («si el sensor marca X, entonces hace Y»), con qué ACTUADOR responde y qué podría hacer fallar a un sensor. Puedes dibujarlo en tu cuaderno.':
        'Invent a robot that solves this problem: write its name, which SENSORS it carries and what each one senses, what its controller DECIDES («if the sensor reads X, then it does Y»), which ACTUATOR it responds with, and what could make a sensor fail. You may draw it in your notebook.',
      'Inventa un robot que resuelva este problema: escribe su nombre, qué SENSORES lleva y qué percibe cada uno, qué DECIDE su controlador («si el sensor marca X, entonces hace Y»), con qué ACTUADOR responde y qué podría hacer fallar a un sensor. Dibújalo al reverso de la hoja.':
        'Invent a robot that solves this problem: write its name, which SENSORS it carries and what each one senses, what its controller DECIDES («if the sensor reads X, then it does Y»), which ACTUATOR it responds with, and what could make a sensor fail. Draw it on the back of the sheet.',
      'I. Elige el sensor': 'I. Choose the sensor', 'II. Corrige el error': 'II. Correct the mistake',
      'III. Analiza la cadena': 'III. Analyze the chain', 'IV. Comparación': 'IV. Comparison',
      'V. Diseña tu sistema de sensores · Rúbrica': 'V. Design your sensor system · Rubric',
      'Sensor:': 'Sensor:', 'Controlador:': 'Controller:', 'Actuador:': 'Actuator:',
      /* impresión: encabezados, pauta y pie */
      'Evaluación Sensores: los Sentidos del Robot': 'Test · Sensors: The Robot’s Senses',
      'Pensamiento Crítico Sensores: los Sentidos del Robot': 'Critical Thinking · Sensors: The Robot’s Senses',
      '✅ PAUTA: Evaluación Final · Sensores: los Sentidos del Robot': '✅ ANSWER KEY: Final Test · Sensors: The Robot’s Senses',
      '✅ PAUTA: Pensamiento Crítico · Sensores: los Sentidos del Robot': '✅ ANSWER KEY: Critical Thinking · Sensors: The Robot’s Senses',
      /* constancia */
      'Misión Sensores: los Sentidos del Robot': 'Mission · Sensors: The Robot’s Senses',
      '¡Sigue explorando los sensores!': 'Keep exploring the sensors!',
      '¡Muy buen trabajo, observador!': 'Great work, observer!',
      '¡Vas muy bien: ya lees las señales!': 'You are doing very well: you can read the signals now!',
      '¡Dominas los sentidos del robot!': 'You have mastered the robot’s senses!',
      '¡Maestro de los Sentidos del Robot!': 'Master of the Robot’s Senses!',
      /* trozos sueltos: frases que el <strong> parte en varios nodos */
      'El micrófono capta los aplausos. →': 'The microphone picks up claps. →',
      'Sensor de sonido': 'Sound sensor',
      /* la versión de pantalla nombra la cadena; va antes que la corta, que es su prefijo */
      '. Corrígelos con argumentos, usando la cadena sensor → controlador → actuador:':
        '. Correct them with arguments, using the sensor → controller → actuator chain:',
      '. Corrígelos con argumentos:': '. Correct them with arguments:'
    },

    /* ══════════════════════════════════════════════════════
       4. FRAGMENTOS (textos con números o nombres variables)
       ══════════════════════════════════════════════════════ */
    fragmentos: [
      /* WhatsApp: el título de la misión en la constancia */
      [/¡(.+?) completó la Misión "Sensores: los Sentidos del Robot"!/g, '$1 completed the mission “Sensors: The Robot’s Senses”!'],
      [/Pregunta (\d+) de (\d+)/g, 'Question $1 of $2'],
      [/Oración (\d+) de (\d+)/g, 'Sentence $1 of $2'],
      [/Pista (\d+) de (\d+)/g, 'Clue $1 of $2'],
      [/Carta de memoria (\d+)/g, 'Memory card $1'],
      [/^(\d+) de (\d+)$/g, '$1 of $2'],
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
      [/Correcto: (.+)\. Pregúntate: ¿informa algo o hace algo\?/g, 'Correct: $1. Ask yourself: does it report something, or does it do something?'],
      [/^Correcto: /g, 'Correct: '],
      [/Busca: /g, 'Look for: '],
      [/🔬 Explorando: /g, '🔬 Exploring: '],
      [/Forma (\d+)/g, 'Form $1'],
      [/🎓 Evaluación Final · Form (\d+) · Sensores: los Sentidos del Robot/g, '🎓 Final Test · Form $1 · Sensors: The Robot’s Senses'],
      [/🧠 Pensamiento Crítico · Form (\d+) · Sensores: los Sentidos del Robot/g, '🧠 Critical Thinking · Form $1 · Sensors: The Robot’s Senses'],
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
      [/Percibe: (.+?) \| Sentido: /g, 'Senses: $1 | Sense: '],
      [/ \| Ejemplo: /g, ' | Example: '],
      /* dice «Form» y no «Forma» porque el fragmento de arriba ya tradujo el
         número de forma cuando le toca el turno a este */
      [/🎯 Clave rápida estilo ZipGrade · Form (\d+): respuestas correctas ya rellenadas para digitar la clave en la app/g,
        '🎯 ZipGrade-style quick key · Form $1: correct answers already filled in so you can type the key into the app'],
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
