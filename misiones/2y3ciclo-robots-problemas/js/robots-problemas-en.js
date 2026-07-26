/* ============================================================
   Misión «Robots que Resuelven Problemas»: versión en inglés
   ------------------------------------------------------------
   Traducción de autor (no automática) para escuelas bilingües.
   Es la etapa 6 de 6: la que CIERRA la Ruta de los Robots.

   Criterio de traducción:
   · Inglés AMERICANO estricto: color, center, catalog, analyze,
     practicing, «Student No.».
   · Vocabulario del ciclo de diseño de ingeniería tal como se
     enseña en clase: engineering design cycle · identify · brainstorm
     · design · build · test · improve (iterate) · communicate ·
     prototype · sketch · criterion · constraint · design ethics.
   · Lo cultural se explica, no se calca: aldea → village, vado →
     river crossing, milpa → cornfield, quebrada → creek, patio de
     secado → drying yard, patronato → neighborhood council,
     lempiras se conserva (es la moneda) y se aclara la primera vez.
   · Los NOMBRES de los equipos hondureños se conservan (Keyli,
     Denis, Suyapa…): son de las familias del centro educativo.

   Los bancos son traducción ÍNDICE A ÍNDICE del español: las
   formas deterministas (1–30) sacan las mismas preguntas y la
   misma clave ZipGrade en los dos idiomas.

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

    titulo: 'Mission 🏆 Robots that Solve Problems | policastsapien.com',

    /* ══════════════════════════════════════════════════════
       1. BLOQUES DE CONTENIDO (data-i18n en el HTML)
       ══════════════════════════════════════════════════════ */
    html: {

      hero:
        '<h1>Mission <span>Robots that Solve Problems</span></h1>' +
        '<p class="sub">The final mission of the Robot Path: learn the engineering design cycle and build a robot that solves a real problem in your community. 🔍💡✏️🔧🧪🔁📢</p>' +
        '<div class="badge">🤖 Robot Path · Stage 6 of 6 (the last one!) · Robotics</div>',

      a1:
        '<h2>🏆 A robot is there to solve problems</h2>' +
        '<p>You already know what a robot is, what its <strong>sensors</strong> measure, how it moves with <strong>motors and mechanisms</strong>, ' +
        'where it gets its <strong>electricity</strong> and how a <strong>program</strong> is written for it. Now comes the most important part: ' +
        'using all of that to <strong>solve a real problem</strong> in your village, your neighborhood or your school.</p>' +
        '<p>Engineers do not improvise: they follow the <strong>engineering design cycle</strong>, seven steps that repeat ' +
        'until the solution really works.</p>' +
        '<div class="type-grid">' +
        '<div class="type-chip tc-teal"><div class="t-art">🔍 1. Identify</div><div class="t-info">What is going wrong? who does it affect? why does it matter?</div></div>' +
        '<div class="type-chip tc-gold"><div class="t-art">💡 2. Brainstorm</div><div class="t-info">Lots of ideas without judging them; you pick the best one afterwards</div></div>' +
        '<div class="type-chip tc-amber"><div class="t-art">✏️ 3. Design</div><div class="t-info">The sketch: sensor, mechanism, energy and program</div></div>' +
        '<div class="type-chip tc-jade"><div class="t-art">🔧 4. Build</div><div class="t-info">The prototype, with whatever material you have</div></div>' +
        '<div class="type-chip tc-purple"><div class="t-art">🧪 5. Test</div><div class="t-info">Try it out, measure and write down what fails</div></div>' +
        '<div class="type-chip tc-teal"><div class="t-art">🔁 6. Improve</div><div class="t-info">Fix it and test again: failing is part of the process</div></div>' +
        '<div class="type-chip tc-gold"><div class="t-art">📢 7. Communicate</div><div class="t-info">Present the result to the community</div></div>' +
        '</div>' +
        '<div class="tip">' +
        '<span class="ti">💡</span>' +
        '<div><strong>Think of it this way:</strong> the cycle is a <b>wheel</b>, not a straight line. After improving you test again, ' +
        'and sometimes you even discover that the problem was a different one. That is learning too!</div>' +
        '</div>',

      a2:
        '<h2>🧩 A look back at the path: every part has to be justified</h2>' +
        '<p>In the <strong>sketch</strong> of your design it is not enough to draw: you have to <strong>justify</strong> every decision with what ' +
        'you learned in the earlier stages of the Robot Path.</p>' +
        '<div class="type-grid">' +
        '<div class="type-chip tc-teal"><div class="t-art">📡 Which sensor?</div><div class="t-info">Stage 2: the sensor measures the signal of the problem (moisture, water level, rain, weight)</div></div>' +
        '<div class="type-chip tc-amber"><div class="t-art">⚙️ Which mechanism?</div><div class="t-info">Stage 3: motor, pulley, belt or gear that carries out the action</div></div>' +
        '<div class="type-chip tc-jade"><div class="t-art">🔋 Which energy?</div><div class="t-info">Stage 4: battery, solar panel, a safe low-voltage circuit</div></div>' +
        '<div class="type-chip tc-purple"><div class="t-art">📋 Which program?</div><div class="t-info">Stage 5: «if X happens, then do Y», with repetitions if they are needed</div></div>' +
        '</div>' +
        '<div class="tip">' +
        '<span class="ti">🔤</span>' +
        '<div><strong>The sketch rule:</strong> for every part you draw, write next to it <b>what it is for</b>. If you cannot ' +
        'justify it, it does not belong there.</div>' +
        '</div>',

      a3:
        '<h2>🇭🇳 Five projects for Honduras</h2>' +
        '<p>These are the five problems you will work on in this mission’s <strong>Design Workshop</strong>:</p>' +
        '<div class="vs-grid">' +
        '<div class="vs-box vs-a">' +
        '<h4>☕🌊🌱 From the countryside and the road</h4>' +
        '<p>The <strong>coffee</strong> laid out to dry that gets soaked by a sudden downpour; the <strong>river</strong> that rises in the rainy season ' +
        'and nobody knows whether the crossing is safe; the <strong>school garden</strong> that dries out over the weekend.</p>' +
        '</div>' +
        '<div class="vs-box vs-b">' +
        '<h4>🚨♻️ From the neighborhood and the school</h4>' +
        '<p>The <strong>flood</strong> that gets into the houses at night with no warning; the <strong>trash</strong> that gets mixed together ' +
        'in the schoolyard and can no longer be recycled.</p>' +
        '</div>' +
        '</div>' +
        '<div class="tip">' +
        '<span class="ti">🏁</span>' +
        '<div><strong>Final mission:</strong> this is <b>stage 6 of 6</b> of the Robot Path. When you finish it you will have ' +
        'walked the whole road: what a robot is, its sensors, its motors, its electricity, its program and, now, ' +
        '<b>how to design it so it is useful to people</b>.</div>' +
        '</div>',

      e1:
        '<h2>🎯 Criteria and ⛔ constraints</h2>' +
        '<p>Before designing, the team writes two lists. The <strong>criterion</strong> says <b>what the robot must achieve</b>; ' +
        'the <strong>constraint</strong> says <b>which limit cannot be crossed</b>.</p>' +
        '<div style="overflow-x:auto;">' +
        '<table style="width:100%;border-collapse:collapse;font-size:0.82rem;min-width:480px;">' +
        '<thead>' +
        '<tr style="background:var(--pri-gl);">' +
        '<th style="padding:0.4rem 0.5rem;border:1px solid var(--border);text-align:left;">Project</th>' +
        '<th style="padding:0.4rem 0.5rem;border:1px solid var(--border);">🎯 Success criterion</th>' +
        '<th style="padding:0.4rem 0.5rem;border:1px solid var(--border);">⛔ Constraints</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:700;">🌱 School garden waterer</td><td style="padding:0.4rem;border:1px solid var(--border);">Keep the soil moist for 3 days with nobody there</td><td style="padding:0.4rem;border:1px solid var(--border);">200 lempiras · recycled material · no bare wires</td></tr>' +
        '<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:700;">🌊 River crossing alarm</td><td style="padding:0.4rem;border:1px solid var(--border);">Warn when the water reaches half the safety mark</td><td style="padding:0.4rem;border:1px solid var(--border);">No power outlet · has to stand up to the rain</td></tr>' +
        '<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:700;">♻️ Trash sorter</td><td style="padding:0.4rem;border:1px solid var(--border);">Get 19 out of every 20 containers right</td><td style="padding:0.4rem;border:1px solid var(--border);">3-week deadline · cardboard and a toy motor</td></tr>' +
        '</tbody>' +
        '</table>' +
        '</div>' +
        '<div class="tip">' +
        '<span class="ti">🎯</span>' +
        '<div><strong>Golden rule:</strong> the criterion is <b>measured</b> (seconds, hits, days); the constraint is <b>respected</b> ' +
        '(lempiras, materials, time, safety). If the prototype does not meet the criterion, you improve the design… <b>you never lower the criterion</b>.</div>' +
        '</div>',

      e2:
        '<h2>⚡ Lightning mini-quiz</h2>' +
        '<p style="font-size:0.9rem;margin-bottom:0.5rem;">1) «The robot must not cost more than 200 lempiras». What is that?</p>' +
        '<div class="cmp-opts" role="group" style="margin-bottom:0.4rem;">' +
        '<button class="cmp-opt" onclick="miniQ(this,false,\'fbMq1\')">A success criterion</button>' +
        '<button class="cmp-opt" onclick="miniQ(this,true,\'fbMq1\')">A constraint</button>' +
        '<button class="cmp-opt" onclick="miniQ(this,false,\'fbMq1\')">A prototype</button>' +
        '</div>' +
        '<div id="fbMq1" class="fb" role="alert"></div>' +
        '<p style="font-size:0.9rem;margin:0.9rem 0 0.5rem;">2) The prototype failed all three tests. What does a good team do?</p>' +
        '<div class="cmp-opts" role="group" style="margin-bottom:0.4rem;">' +
        '<button class="cmp-opt" onclick="miniQ(this,true,\'fbMq2\')">Writes down what failed, improves the design and tests again</button>' +
        '<button class="cmp-opt" onclick="miniQ(this,false,\'fbMq2\')">Lowers the criterion so it looks like it worked</button>' +
        '<button class="cmp-opt" onclick="miniQ(this,false,\'fbMq2\')">Gives the project up</button>' +
        '</div>' +
        '<div id="fbMq2" class="fb" role="alert"></div>',

      e3:
        '<h2>⚖️ Ethics, safety and teamwork</h2>' +
        '<p>A robot is not good just because it works: it also has to be <strong>fair and safe</strong> for people.</p>' +
        '<div class="type-grid">' +
        '<div class="type-chip tc-teal"><div class="t-art">🤝 Who does it help?</div><div class="t-info">Robots <strong>help</strong> people with heavy or dangerous jobs</div></div>' +
        '<div class="type-chip tc-amber"><div class="t-art">😟 Who does it affect?</div><div class="t-info">If somebody loses their job or their access, it has to be talked through and solved</div></div>' +
        '<div class="type-chip tc-jade"><div class="t-art">🦺 Safety</div><div class="t-info">Low voltage, insulated wires, no sharp edges and no parts that can trap fingers</div></div>' +
        '<div class="type-chip tc-purple"><div class="t-art">👥 Roles</div><div class="t-info">Designer · Programmer · Builder · Tester: everybody checks and has a say</div></div>' +
        '</div>' +
        '<div class="tip">' +
        '<span class="ti">📢</span>' +
        '<div><strong>The 2-minute presentation:</strong> (1) the problem and who it affects, (2) the design with every part justified, ' +
        '(3) what happened in the test, with data, (4) the improvement, and (5) who it helps. With the sketch or the model in plain sight!</div>' +
        '</div>',

      labh2: '🛠️ Design Workshop',

      labintro: 'Choose one of the five Honduran projects and walk through its <strong>7 stages</strong>. At every decision pick the best option: the workshop explains why. ⭐ +2 XP per right decision.',

      labctl:
        '<div class="lab-group">' +
        '<span class="lab-group-label">🇭🇳 Project:</span>' +
        '<button class="lab-btn lab-cont-btn" data-proj="cafe" onclick="tallerShowProyecto(\'cafe\')">☕ Coffee</button>' +
        '<button class="lab-btn lab-cont-btn" data-proj="rio" onclick="tallerShowProyecto(\'rio\')">🌊 River</button>' +
        '<button class="lab-btn lab-cont-btn" data-proj="huerto" onclick="tallerShowProyecto(\'huerto\')">🌱 Garden</button>' +
        '<button class="lab-btn lab-cont-btn" data-proj="inundacion" onclick="tallerShowProyecto(\'inundacion\')">🚨 Flood</button>' +
        '<button class="lab-btn lab-cont-btn" data-proj="basura" onclick="tallerShowProyecto(\'basura\')">♻️ Trash</button>' +
        '</div>' +
        '<div class="lab-group">' +
        '<span class="lab-group-label">🔁 Stage:</span>' +
        '<button class="lab-btn lab-asp-btn" data-etapa="identificar" onclick="tallerShowEtapa(\'identificar\')">🔍 1. Identify</button>' +
        '<button class="lab-btn lab-asp-btn" data-etapa="idear" onclick="tallerShowEtapa(\'idear\')">💡 2. Brainstorm</button>' +
        '<button class="lab-btn lab-asp-btn" data-etapa="disenar" onclick="tallerShowEtapa(\'disenar\')">✏️ 3. Design</button>' +
        '<button class="lab-btn lab-asp-btn" data-etapa="construir" onclick="tallerShowEtapa(\'construir\')">🔧 4. Build</button>' +
        '<button class="lab-btn lab-asp-btn" data-etapa="probar" onclick="tallerShowEtapa(\'probar\')">🧪 5. Test</button>' +
        '<button class="lab-btn lab-asp-btn" data-etapa="mejorar" onclick="tallerShowEtapa(\'mejorar\')">🔁 6. Improve</button>' +
        '<button class="lab-btn lab-asp-btn" data-etapa="comunicar" onclick="tallerShowEtapa(\'comunicar\')">📢 7. Communicate</button>' +
        '</div>',

      rec:
        '<h2>📁 Topic Resources</h2>' +
        '<div style="border:1.5px solid var(--border,#e2e8f0);border-radius:12px;padding:1rem 1.2rem;margin-bottom:1.2rem;background:rgba(0,0,0,0.02);">' +
        '<p style="font-size:0.98rem;font-weight:800;margin-bottom:0.4rem;">📄 Printable study sheet</p>' +
        '<p style="font-size:0.86rem;margin-bottom:0.85rem;">A 7-page study guide (theory, unplugged activities and a test) to print out or work through before the exam.</p>' +
        '<a href="../../fichas/ficha-robots-problemas.html" target="_blank" rel="noopener noreferrer" class="btn btn-pri" style="display:inline-flex;align-items:center;gap:0.5rem;text-decoration:none;font-size:1rem;padding:0.7rem 1.4rem;">📄 Open / Print the study sheet</a>' +
        '</div>' +
        '<p style="font-size:0.9rem;margin-bottom:1rem;">Here you will find support materials for this mission: slideshows, PDF documents, study guides and more. Your teacher will keep adding resources to this folder.</p>' +
        '<a href="https://drive.google.com/drive/folders/1robots_problemas_recursos" target="_blank" rel="noopener noreferrer" class="btn btn-pri" style="display:inline-flex;align-items:center;gap:0.5rem;text-decoration:none;font-size:1rem;padding:0.7rem 1.4rem;">' +
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
        primer_quiz: { icon: '🏆', label: 'First design-cycle quiz completed' },
        flash_master: { icon: '🃏', label: 'All the design flashcards explored' },
        clasif_pro: { icon: '🗂️', label: 'Expert problem-and-solution sorter' },
        id_master: { icon: '🔍', label: 'Master design-stage spotter' },
        reto_hero: { icon: '⏱️', label: 'Problem vs Solution challenge hero' },
        nivel3: { icon: '✏️', label: 'Junior Designer! Level 3' },
        nivel5: { icon: '🥇', label: 'Project Engineer! Level 6' },
        widgets_master: { icon: '🔁', label: 'Design cycle mastered from start to finish' },
        taller_master: { icon: '🛠️', label: 'Design workshop: Honduran project solved' }
      },

      lvls: [
        { t: 0, n: 'Beginner 🌱' }, { t: 25, n: 'Problem Spotter 🔍' }, { t: 55, n: 'Junior Designer ✏️' },
        { t: 90, n: 'Prototype Builder 🔧' }, { t: 130, n: 'Tireless Tester 🧪' },
        { t: 165, n: 'Project Engineer 🛠️' }, { t: 190, n: 'Master Innovator 🏆' }
      ],

      fcData: [
        { w: 'Design cycle', a: '🔁 The <strong>7 steps</strong> engineers follow: identify → brainstorm → design → build → test → improve → communicate.' },
        { w: 'Identify the problem', a: '🔍 First step: say clearly <strong>what is going wrong, who it affects and why it matters</strong>.' },
        { w: 'Brainstorm', a: '💡 Write down <strong>lots of ideas</strong> without judging them yet; you pick the most realistic one afterwards.' },
        { w: 'Design', a: '✏️ Make the <strong>sketch</strong>: which sensor, which mechanism, which energy and which program the robot will carry.' },
        { w: 'Prototype', a: '🔧 The <strong>first version</strong> of the robot, made with whatever material you have, so you can test it.' },
        { w: 'Test', a: '🧪 Try it out several times and <strong>write down</strong> what works and what fails, comparing against the criterion.' },
        { w: 'Improve (iterate)', a: '🔁 Change what failed and <strong>test again</strong>. Failing is not losing: it is information for the next attempt.' },
        { w: 'Communicate', a: '📢 Present the project: <strong>problem, design, test and improvement</strong>, in plain words and with a drawing.' },
        { w: 'Criterion', a: '🎯 What the robot <strong>must achieve</strong> to count as a success (for example: warning before the river rises).' },
        { w: 'Constraint', a: '⛔ The <strong>limit</strong> that cannot be crossed: cost, available materials, time and safety.' },
        { w: 'Sketch', a: '📐 A quick drawing of the robot with its <strong>parts labeled</strong>: sensors, mechanisms, energy source.' },
        { w: 'Team roles', a: '👥 <strong>Designer, programmer, builder and tester</strong>: everyone contributes and everyone checks.' },
        { w: 'Design ethics', a: '⚖️ Asking <strong>who benefits</strong> from the robot, who it might harm and whether it is safe for whoever uses it.' },
        { w: 'A robot that solves', a: '🏆 A useful robot is not the prettiest one, but the one that <strong>solves a real problem</strong> in its community.' }
      ],

      memoPairs: [
        { id: 'identificar', t: 'Identify', d: '🔍 say what is going wrong and who it affects' },
        { id: 'idear', t: 'Brainstorm', d: '💡 write down lots of possible solutions' },
        { id: 'disenar', t: 'Design', d: '✏️ sketch sensors, mechanisms and program' },
        { id: 'construir', t: 'Build', d: '🔧 put the prototype together with what you have' },
        { id: 'probar', t: 'Test', d: '🧪 try it out and write down what fails' },
        { id: 'mejorar', t: 'Improve', d: '🔁 fix it and test again' }
      ],

      qzData: [
        { q: 'Which is the FIRST step of the design cycle?', o: ['a) Build the prototype', 'b) Identify the problem', 'c) Communicate the result', 'd) Buy materials'], c: 1 },
        { q: 'In the BRAINSTORM stage, what is the right thing to do?', o: ['a) Take the first idea that turns up', 'b) Write down lots of ideas and choose afterwards', 'c) Copy another team’s robot', 'd) Start gluing cardboard'], c: 1 },
        { q: 'What is decided in the design SKETCH?', o: ['a) The color of the box', 'b) Which sensor, which mechanism, which energy and which program', 'c) Who speaks during the presentation', 'd) The team’s grade'], c: 1 },
        { q: 'The garden waterer prototype did not shut the water off in time. What comes next?', o: ['a) Give the project up', 'b) Improve the design and test again', 'c) Say that it did work', 'd) Change topic'], c: 1 },
        { q: '«The robot must not cost more than 200 lempiras» is…', o: ['a) A criterion', 'b) A constraint', 'c) A sketch', 'd) An idea'], c: 1 },
        { q: '«It must warn before the water reaches the crossing» is…', o: ['a) A success criterion', 'b) A cost constraint', 'c) A team role', 'd) A material'], c: 0 },
        { q: 'Which sensor suits the robot that warns about floods?', o: ['a) Sound sensor', 'b) Water level sensor', 'c) Color sensor', 'd) Touch sensor'], c: 1 },
        { q: 'Which one is an ETHICAL question about design?', o: ['a) What color should I paint it?', 'b) Who does it benefit and who might it harm?', 'c) How many screws does it take?', 'd) Who draws best?'], c: 1 },
        { q: 'Which is the LAST stage of the design cycle?', o: ['a) Test', 'b) Communicate the result', 'c) Brainstorm', 'd) Build'], c: 1 }
      ],

      classGroups: [
        {
          label: ['Problem', 'Solution'], headA: '❓ Problem', headB: '💡 Solution', colA: 'pro', colB: 'sol',
          words: [{ w: 'The garden dries out over the weekend', t: 'pro' }, { w: 'A waterer that turns the water on by itself', t: 'sol' }, { w: 'The river rises and nobody knows whether to cross', t: 'pro' }, { w: 'An alarm that measures the water level', t: 'sol' }, { w: 'The school’s trash gets mixed together', t: 'pro' }, { w: 'A belt that separates plastic from paper', t: 'sol' }, { w: 'The coffee laid out to dry gets soaked by the rain', t: 'pro' }, { w: 'A roof that closes when it rains', t: 'sol' }]
        },
        {
          label: ['Criterion', 'Constraint'], headA: '🎯 Criterion (what it must achieve)', headB: '⛔ Constraint (the limit)', colA: 'cri', colB: 'res',
          words: [{ w: 'It must warn before the water rises', t: 'cri' }, { w: 'There are only 200 lempiras', t: 'res' }, { w: 'It must water the whole garden', t: 'cri' }, { w: 'We only have recycled material', t: 'res' }, { w: 'It must separate plastic from paper', t: 'cri' }, { w: 'There are three weeks to do it', t: 'res' }, { w: 'It must switch the alarm on at night', t: 'cri' }, { w: 'No wire may be left bare', t: 'res' }]
        },
        {
          label: ['Design', 'Test'], headA: '✏️ Design stage', headB: '🧪 Testing stage', colA: 'dis', colB: 'pru',
          words: [{ w: 'Draw the labeled sketch', t: 'dis' }, { w: 'Measure whether it warns in time', t: 'pru' }, { w: 'Choose the right sensor', t: 'dis' }, { w: 'Write down what failed', t: 'pru' }, { w: 'Write out the program instructions', t: 'dis' }, { w: 'Repeat the trial three times', t: 'pru' }, { w: 'Decide on the energy source', t: 'dis' }, { w: 'Compare the result against the criterion', t: 'pru' }]
        },
        {
          label: ['Sensor', 'Actuator'], headA: '📡 Sensor (measures)', headB: '💪 Actuator (does)', colA: 'sen', colB: 'act',
          words: [{ w: 'Moisture sensor', t: 'sen' }, { w: 'Water pump', t: 'act' }, { w: 'Water level sensor', t: 'sen' }, { w: 'Alarm horn', t: 'act' }, { w: 'Camera', t: 'sen' }, { w: 'Motor with wheels', t: 'act' }, { w: 'Weight sensor', t: 'sen' }, { w: 'Arm with a belt', t: 'act' }]
        }
      ],

      idData: [
        { s: ['Every', 'project', 'starts', 'by', 'identifying', 'the', 'problem.'], c: 4, art: 'The first stage of the design cycle' },
        { s: ['After', 'brainstorming,', 'the', 'team', 'draws', 'the', 'sketch.'], c: 6, art: 'The labeled drawing of the design' },
        { s: ['The', 'prototype', 'is', 'built', 'from', 'recycled', 'material.'], c: 1, art: 'The first version of the robot' },
        { s: ['During', 'the', 'test', 'we', 'write', 'down', 'everything', 'that', 'fails.'], c: 2, art: 'The stage where the prototype is tried out' },
        { s: ['Failing', 'helps', 'you', 'improve', 'the', 'design.'], c: 3, art: 'The stage of fixing and testing again' },
        { s: ['In', 'the', 'end', 'the', 'team', 'communicates', 'its', 'project.'], c: 5, art: 'The last stage of the cycle' },
        { s: ['Cost', 'is', 'a', 'constraint', 'of', 'the', 'project.'], c: 3, art: 'The limit that cannot be crossed' },
        { s: ['Warning', 'in', 'time', 'is', 'the', 'success', 'criterion.'], c: 5, art: 'What the robot must achieve' }
      ],

      cmpData: [
        { s: 'The design cycle starts by ___ the problem.', opts: ['identifying', 'painting', 'selling'], c: 0 },
        { s: 'In the brainstorming stage we write down lots of ___.', opts: ['conduct reports', 'ideas', 'chores'], c: 1 },
        { s: 'The labeled drawing of the robot is called the ___.', opts: ['sketch', 'receipt', 'poster'], c: 0 },
        { s: 'The first version you can actually test is the ___.', opts: ['prototype', 'diploma', 'manual'], c: 0 },
        { s: 'When testing you have to ___ what fails.', opts: ['hide', 'write down', 'forget'], c: 1 },
        { s: 'If the prototype fails, the right thing is to ___ and test again.', opts: ['give up', 'improve it', 'copy'], c: 1 },
        { s: 'The money available is a ___ of the project.', opts: ['constraint', 'idea', 'test'], c: 0 },
        { s: 'The last stage of the cycle is to ___ the result.', opts: ['communicate', 'hide', 'erase'], c: 0 }
      ],

      routeSets: [
        {
          label: 'The school garden watering robot', steps: [
            'We identify the problem: the garden dries out at weekends',
            'We brainstorm several solutions and pick the most realistic one',
            'We design the sketch: moisture sensor, pump and program',
            'We build the prototype with bottles and recycled material',
            'We test it three times and note that the water never shuts off',
            'We improve the program and present the project to the school']
        },
        {
          label: 'The river crossing alarm in the rainy season', steps: [
            'We identify the problem: nobody knows whether the crossing is safe',
            'We brainstorm ideas: a painted gauge, a float, an alarm',
            'We design the sketch: level sensor, horn and battery',
            'We build the prototype and set it up beside the crossing',
            'We test it with water and see that the horn sounds far too late',
            'We improve the sensor height and let the community know']
        },
        {
          label: 'The school trash sorter', steps: [
            'We identify the problem: plastic and paper get mixed together',
            'We brainstorm solutions and compare cost and time',
            'We design the sketch: weight sensor, belt and motor',
            'We build the belt with cardboard, a pulley and a motor',
            'We test it with 20 containers and two go to the wrong bin',
            'We improve the belt, repeat the test and present the project']
        }
      ],

      neuronPartes: [
        { desc: 'The robot has to warn when the river water starts to rise', ans: 'Water level sensor', opts: ['Water level sensor', 'Sound sensor', 'Color sensor'] },
        { desc: 'The garden waterer has to know when the soil is dry', ans: 'Moisture sensor', opts: ['Moisture sensor', 'Weight sensor', 'Sound sensor'] },
        { desc: 'The sorter needs to move the containers to the bin', ans: 'Belt with a motor', opts: ['Belt with a motor', 'Horn', 'Extra battery'] },
        { desc: 'The roof over the coffee drying yard has to close when it rains', ans: 'Motor with a pulley', opts: ['Motor with a pulley', 'Touch sensor', 'LED light'] },
        { desc: 'The project goes at the river crossing, where there is no power outlet', ans: 'Battery with a solar panel', opts: ['Battery with a solar panel', 'A cable from the nearest house', 'A candle'] },
        { desc: 'The main order of the garden watering robot has to be written', ans: 'If the soil is dry, then turn the water on', opts: ['If the soil is dry, then turn the water on', 'Water nonstop, always', 'Wait for somebody to switch it on'] },
        { desc: 'The team only has three weeks and recycled material', ans: 'A simple, cheap prototype', opts: ['A simple, cheap prototype', 'An imported metal robot', 'Nothing, better not to do it'] },
        { desc: 'The alert robot will be used around children', ans: 'Insulated wires and low voltage', opts: ['Insulated wires and low voltage', 'Bare wires out in the open', 'Power straight from the mains'] }
      ],

      neuroPairs: [
        { trans: 'Identify', func: 'Say what is going wrong, who it affects and why it matters', opts: ['Say what is going wrong, who it affects and why it matters', 'Put the prototype together with cardboard', 'Present the project to the class'] },
        { trans: 'Brainstorm', func: 'Write down lots of possible solutions and pick the best one', opts: ['Write down lots of possible solutions and pick the best one', 'Measure how many times it fails', 'Hand out the certificate'] },
        { trans: 'Design', func: 'Sketch which sensor, which mechanism, which energy and which program it carries', opts: ['Sketch which sensor, which mechanism, which energy and which program it carries', 'Paint the box in bright colors', 'Count the money raised'] },
        { trans: 'Test', func: 'Try it out several times and write down what fails and what works', opts: ['Try it out several times and write down what fails and what works', 'Put the robot away in its box', 'Draw the logo'] },
        { trans: 'Communicate', func: 'Present the problem, the design, the test and the improvement', opts: ['Present the problem, the design, the test and the improvement', 'Buy more materials', 'Erase the team’s notes'] }
      ],

      enfermedadData: [
        { disease: 'A robot that warns the community when the river starts to rise', characteristic: 'It helps people', opts: ['It helps people', 'It needs more thought'] },
        { disease: 'A robot that puts the trash collectors out of work with no warning', characteristic: 'It needs more thought', opts: ['It needs more thought', 'It helps people'] },
        { disease: 'A waterer that saves water and looks after the school garden', characteristic: 'It helps people', opts: ['It helps people', 'It needs more thought'] },
        { disease: 'A prototype with bare wires within reach of the children', characteristic: 'It needs more thought', opts: ['It needs more thought', 'It helps people'] },
        { disease: 'An arm that lifts the coffee sacks and saves people’s backs', characteristic: 'It helps people', opts: ['It helps people', 'It needs more thought'] },
        { disease: 'A robot that dumps the trash in the river to avoid paying for the truck', characteristic: 'It needs more thought', opts: ['It needs more thought', 'It helps people'] }
      ],

      retoPairs: [
        {
          label: ['Problem', 'Solution'], btnA: '❓ Problem', btnB: '💡 Solution', colA: 'pro', colB: 'sol',
          words: [{ w: 'The garden dries out', t: 'pro' }, { w: 'Automatic waterer', t: 'sol' }, { w: 'The river rises at night', t: 'pro' }, { w: 'Water level alarm', t: 'sol' }, { w: 'The trash gets mixed together', t: 'pro' }, { w: 'Sorting belt', t: 'sol' }, { w: 'The coffee gets soaked', t: 'pro' }, { w: 'A roof that closes', t: 'sol' }, { w: 'Nobody can see the river crossing', t: 'pro' }, { w: 'A light with a sensor', t: 'sol' }]
        },
        {
          label: ['Criterion', 'Constraint'], btnA: '🎯 Criterion', btnB: '⛔ Constraint', colA: 'cri', colB: 'res',
          words: [{ w: 'It must warn in time', t: 'cri' }, { w: 'Only 200 lempiras', t: 'res' }, { w: 'It must water the whole garden', t: 'cri' }, { w: 'Only recycled material', t: 'res' }, { w: 'It must separate the plastic', t: 'cri' }, { w: 'A three-week deadline', t: 'res' }, { w: 'It must be visible from far away', t: 'cri' }, { w: 'No bare wires', t: 'res' }, { w: 'It must work at night', t: 'cri' }, { w: 'No power outlet nearby', t: 'res' }]
        },
        {
          label: ['Design', 'Test'], btnA: '✏️ Design', btnB: '🧪 Test', colA: 'dis', colB: 'pru',
          words: [{ w: 'Draw the sketch', t: 'dis' }, { w: 'Write down what failed', t: 'pru' }, { w: 'Choose the sensor', t: 'dis' }, { w: 'Repeat the trial', t: 'pru' }, { w: 'Write the program', t: 'dis' }, { w: 'Measure the warning time', t: 'pru' }, { w: 'Pick the energy source', t: 'dis' }, { w: 'Count the hits', t: 'pru' }, { w: 'List the materials', t: 'dis' }, { w: 'Compare against the criterion', t: 'pru' }]
        }
      ],

      identifyTaskDB: [
        { s: 'The team writes down what is going wrong and who it affects.', type: 'Identify the problem' },
        { s: 'The students write down ten possible solutions without judging them.', type: 'Brainstorm' },
        { s: 'The robot is drawn with its sensors and motors labeled.', type: 'Design (sketch)' },
        { s: 'They put together the first version of the robot with recycled material.', type: 'Build the prototype' },
        { s: 'They run three trials and note how many times it warned in time.', type: 'Test' },
        { s: 'They change the sensor height and repeat the trial.', type: 'Improve' },
        { s: 'They present the project to the class in two minutes.', type: 'Communicate' },
        { s: 'The robot must not cost more than two hundred lempiras.', type: 'Constraint' },
        { s: 'The robot must warn before the water reaches the crossing.', type: 'Criterion' },
        { s: 'The team asks itself who benefits and who might be harmed.', type: 'Design ethics' }
      ],

      classifyTaskDB: [
        { w: 'Coffee harvest robot', gen: 'The coffee laid out to dry gets soaked when it rains suddenly', n: 'Rain or moisture sensor', g: 'Motor with a pulley that closes the roof', t: 'Little money and recycled material only' },
        { w: 'River crossing alert', gen: 'In the rainy season nobody knows whether it is safe to cross', n: 'Water level sensor', g: 'Alarm horn and light', t: 'No power outlet: it has to run on a battery' },
        { w: 'School garden waterer', gen: 'The garden dries out at weekends', n: 'Soil moisture sensor', g: 'Water pump or valve', t: 'It has to save water and be safe' },
        { w: 'Neighborhood flood alert', gen: 'The water gets into the houses at night with no warning', n: 'Level sensor and rain sensor', g: 'Siren and flashing light', t: 'It has to be heard 100 meters away and stand up to the rain' },
        { w: 'School trash sorter', gen: 'Plastic and paper get mixed together in the schoolyard', n: 'Weight or color sensor', g: 'Belt with a motor and a gate', t: 'A three-week deadline and recycled cardboard' },
        { w: 'Lunchroom guide robot', gen: 'The youngest children cannot find their table', n: 'Distance sensor', g: 'Wheels with a motor and a horn', t: 'It must not block the way or have loose wires' },
        { w: 'Robotic scarecrow for the cornfield', gen: 'The birds eat the corn that has just been sown', n: 'Motion sensor', g: 'Rotating arm and horn', t: 'It has to run all day on solar power' },
        { w: 'Smoke alert in the school kitchen', gen: 'Nobody notices when the firewood smokes too much', n: 'Smoke sensor', g: 'Sound alarm and light', t: 'It has to be cheap and not frighten the children' }
      ],

      completeTaskDB: [
        { s: 'The design cycle starts by ___ the problem.', opts: ['identifying', 'painting', 'storing'], ans: 'identifying' },
        { s: 'In the brainstorming stage we write down lots of ___.', opts: ['ideas', 'mistakes', 'notes'], ans: 'ideas' },
        { s: 'The labeled drawing of the robot is called the ___.', opts: ['sketch', 'receipt', 'poster'], ans: 'sketch' },
        { s: 'The first version you can actually test is the ___.', opts: ['prototype', 'diploma', 'manual'], ans: 'prototype' },
        { s: 'When testing you have to ___ what fails.', opts: ['write down', 'hide', 'forget'], ans: 'write down' },
        { s: 'If the prototype fails, you have to ___ and test again.', opts: ['improve it', 'give up', 'copy'], ans: 'improve it' },
        { s: 'The money available is a ___ of the project.', opts: ['constraint', 'idea', 'test'], ans: 'constraint' },
        { s: 'The last stage of the cycle is to ___ the result.', opts: ['communicate', 'erase', 'hide'], ans: 'communicate' }
      ],

      explainQuestions: [
        { q: 'Explain the 7 stages of the design cycle in your own words and give an example of each with a robot from your community.', ans: 'Identify (say what is going wrong and who it affects), brainstorm (lots of solutions), design (a sketch with sensors, mechanisms, energy and program), build the prototype, test and write down the failures, improve and test again, and communicate the result.' },
        { q: 'Choose a problem in your village or neighborhood and write its project sheet: problem, idea, design, test and improvement.', ans: 'Open answer. It must show the problem with the people it affects, one idea chosen out of several, a design with the sensor and the actuator justified, a test with data and a concrete improvement.' },
        { q: 'What is the difference between a criterion and a constraint? Give two examples of each for the school garden waterer.', ans: 'The criterion is what it must achieve (water the whole garden, save water); the constraint is the limit (200 lempiras, three weeks, recycled material, no bare wires).' },
        { q: 'Your prototype failed the test. Explain why that is NOT a failure and what you would do next.', ans: 'Failing gives you information: you write down what failed, change one thing at a time, test again and compare against the criterion. That is how engineers work.' },
        { q: 'Write down who benefits and who could be harmed by the robot you designed, and how you would make it safe.', ans: 'Open answer. It must name real people in the community, recognize who it might harm and propose safety measures (low voltage, insulated wires, no sharp parts, warning the users).' }
      ],

      sopaSets: [
        _sopa(10, ['PROBLEM', 'PROTOTYPE', 'IMPROVE', 'DESIGN', 'TEST', 'IDEA'], 20260729),
        _sopa(10, ['SOLUTION', 'MODEL', 'SKETCH', 'TEAM', 'COST', 'ETHICS'], 51920272)
      ],

      evalTFBank: [
        { q: 'The design cycle starts by identifying the problem.', a: true },
        { q: 'The first thing a good team does is build the robot.', a: false },
        { q: 'In the brainstorming stage it is a good idea to write down lots of solutions.', a: true },
        { q: 'The sketch shows which sensor, which mechanism and which program the robot carries.', a: true },
        { q: 'The prototype is the final version, and it is never changed again.', a: false },
        { q: 'When testing you have to write down what fails.', a: true },
        { q: 'If the prototype fails, the team should give the project up.', a: false },
        { q: 'Improving means fixing what failed and testing again.', a: true },
        { q: 'Cost and time are constraints of the project.', a: true },
        { q: 'A criterion is what the robot must achieve in order to succeed.', a: true },
        { q: 'The safety of whoever uses the robot is not the team’s business.', a: false },
        { q: 'Communicating the result is the last stage of the cycle.', a: true },
        { q: 'A good robot is one that solves a real problem in its community.', a: true },
        { q: 'Robots should replace people without telling them.', a: false },
        { q: 'The team has roles: designer, programmer, builder and tester.', a: true }
      ],

      evalMCBank: [
        { q: 'Which is the first stage of the design cycle?', o: ['a) Build', 'b) Identify the problem', 'c) Communicate', 'd) Test'], a: 1 },
        { q: 'What do you do in the brainstorming stage?', o: ['a) Paint the robot', 'b) Write down lots of possible solutions', 'c) Grade the team', 'd) Put the materials away'], a: 1 },
        { q: 'What does a good design sketch contain?', o: ['a) Only the robot’s name', 'b) Sensors, mechanisms, energy and program', 'c) The attendance list', 'd) The selling price'], a: 1 },
        { q: 'What is a prototype?', o: ['a) The first version you can actually test', 'b) A drawing with no parts', 'c) The team’s certificate', 'd) A factory-made robot'], a: 0 },
        { q: 'During the test, what should the team do?', o: ['a) Hide the failures', 'b) Write down what fails and what works', 'c) Change project', 'd) Hand out prizes'], a: 1 },
        { q: 'The prototype failed three times. What is the right thing to do?', o: ['a) Give up', 'b) Improve the design and test again', 'c) Say that it worked', 'd) Copy another team'], a: 1 },
        { q: '«It must not cost more than 200 lempiras» is an example of…', o: ['a) A criterion', 'b) A constraint', 'c) A sketch', 'd) A prototype'], a: 1 },
        { q: '«It must warn before the water reaches the crossing» is an example of…', o: ['a) A success criterion', 'b) A time constraint', 'c) A team role', 'd) A material'], a: 0 },
        { q: 'Which sensor suits the robot that warns about floods?', o: ['a) Color', 'b) Sound', 'c) Water level', 'd) Touch'], a: 2 },
        { q: 'Which actuator does the school garden waterer need?', o: ['a) A camera', 'b) A water pump or valve', 'c) A moisture sensor', 'd) A battery'], a: 1 },
        { q: 'Which instruction is right for the watering robot?', o: ['a) Water nonstop, always', 'b) If the soil is dry, then turn the water on', 'c) Wait until it rains', 'd) Switch the alarm off'], a: 1 },
        { q: 'The project goes at the river crossing and there is no power outlet. Which energy suits it?', o: ['a) A battery with a solar panel', 'b) A one-kilometer cable', 'c) A candle', 'd) None'], a: 0 },
        { q: 'Which is the last stage of the design cycle?', o: ['a) Test', 'b) Brainstorm', 'c) Communicate the result', 'd) Build'], a: 2 },
        { q: 'Which one is an ethical question about design?', o: ['a) Who does it benefit and who might it harm?', 'b) What color should I paint it?', 'c) How many screws does it take?', 'd) Who draws best?'], a: 0 },
        { q: 'Which team role is in charge of trying the robot out and writing down the failures?', o: ['a) The designer', 'b) The programmer', 'c) The builder', 'd) The tester'], a: 3 }
      ],

      evalCPBank: [
        { q: 'The design cycle starts by ___ the problem.', a: 'identifying' },
        { q: 'In the ___ stage lots of possible solutions are written down.', a: 'brainstorming' },
        { q: 'The labeled drawing of the robot is called the ___.', a: 'sketch' },
        { q: 'The first version you can actually test is the ___.', a: 'prototype' },
        { q: 'When you ___ the prototype you write down what fails and what works.', a: 'test' },
        { q: 'If the prototype fails, you have to ___ the design and test again.', a: 'improve' },
        { q: 'The last stage of the design cycle is to ___ the result.', a: 'communicate' },
        { q: 'The money available is a ___ of the project.', a: 'constraint' },
        { q: 'What the robot must achieve in order to succeed is the ___.', a: 'criterion' },
        { q: 'The watering robot needs a ___ sensor to measure the soil.', a: 'moisture' },
        { q: 'The robot that warns about floods measures the water ___.', a: 'level' },
        { q: 'The team member who tries the robot out and writes down the failures is the ___.', a: 'tester' },
        { q: 'Thinking about who the robot benefits and who it affects is part of design ___.', a: 'ethics' },
        { q: 'A model made of ___ material lets you build a cheap prototype.', a: 'recycled' },
        { q: 'The final presentation lasts two ___ in front of the class.', a: 'minutes' }
      ],

      evalPRBank: [
        { term: 'Design cycle', def: 'The 7 steps engineers follow to solve a problem' },
        { term: 'Identify', def: 'Say what is going wrong, who it affects and why it matters' },
        { term: 'Brainstorm', def: 'Write down lots of possible solutions before choosing' },
        { term: 'Design', def: 'Sketch sensors, mechanisms, energy and program' },
        { term: 'Prototype', def: 'The first version of the robot, made so it can be tested' },
        { term: 'Test', def: 'Try it out several times and write down the failures' },
        { term: 'Improve', def: 'Fix what failed and test it again' },
        { term: 'Communicate', def: 'Present the project clearly to an audience' },
        { term: 'Criterion', def: 'What the robot must achieve in order to succeed' },
        { term: 'Constraint', def: 'A limit of cost, materials, time or safety' },
        { term: 'Sketch', def: 'A quick drawing with the robot’s parts labeled' },
        { term: 'Model', def: 'A version of the robot built out of recycled material' },
        { term: 'Design ethics', def: 'Thinking about who benefits and who might be harmed' },
        { term: 'Tester', def: 'The team role that tries it out and notes what fails' },
        { term: 'Rubric', def: 'A table with the criteria the project is graded by' }
      ],

      critCasoBank: [
        { txt: 'In the village, the coffee laid out to dry in the yard gets soaked when it rains suddenly and the harvest is lost.', ans: 'Problem: sudden rain ruins the coffee laid out to dry and hurts the coffee-growing families. Sensor: rain or moisture. Actuator: a motor with a pulley that closes the sliding roof. Program: if it detects rain, then close the roof.' },
        { txt: 'In the rainy season the river rises and the children do not know whether it is safe to cross to get to school.', ans: 'Problem: nobody knows whether the crossing is safe and there is a risk of an accident. Sensor: water level. Actuator: a horn and a red warning light. Program: if the level goes past the mark, then switch the alarm on.' },
        { txt: 'The school garden dries out at weekends because nobody comes to water it.', ans: 'Problem: with no watering at the weekend the garden plants are lost. Sensor: soil moisture. Actuator: a water pump or valve. Program: if the soil is dry, then turn the water on until it is moist.' },
        { txt: 'In the neighborhood the water gets into the houses at night and nobody manages to move their things.', ans: 'Problem: the night-time flood catches the families by surprise. Sensor: water level and rain. Actuator: a siren and a flashing light. Program: if the water goes past the mark, then sound the siren and switch the light on.' },
        { txt: 'At school the plastic and the paper end up in the same bin.', ans: 'Problem: mixed trash cannot be recycled. Sensor: weight or color. Actuator: a belt with a motor and a gate that diverts. Program: if the container is light, then divert it to the plastic bin.' },
        { txt: 'The birds eat the freshly sown corn in the cornfield when nobody is watching.', ans: 'Problem: the sowing is lost for lack of watching over it. Sensor: motion. Actuator: a rotating arm with ribbons and a horn. Program: if it detects movement in the cornfield, then spin the arm and sound the horn.' }
      ],

      critErrorBank: [
        {
          txt: '"The first thing a good team does is build the robot; the problem gets looked for afterwards."',
          g1: 'That is backwards: the FIRST stage is to IDENTIFY the problem. Say what is going wrong, who it affects and why it matters.',
          g2: 'Building with no problem defined wastes time and materials: there would be no criterion to compare the test against.'
        },
        {
          txt: '"If the prototype fails the test, the project has failed and you have to start on another topic."',
          g1: 'Failing is NOT failure: the test is there precisely to discover what goes wrong and write it down.',
          g2: 'After the test comes IMPROVING: you change what failed and test again (iterate) until it meets the criterion.'
        },
        {
          txt: '"A criterion and a constraint are the same thing: they are both project rules."',
          g1: 'The CRITERION says what the robot MUST ACHIEVE (for example, warning before the water reaches the crossing).',
          g2: 'The CONSTRAINT is the LIMIT that cannot be crossed: cost, available materials, time and safety.'
        },
        {
          txt: '"A pretty, expensive robot is always better than a simple one made of recycled material."',
          g1: 'What makes a robot good is SOLVING the problem and meeting the criterion, not the way it looks.',
          g2: 'An expensive design can break the cost constraint and end up beyond the community’s reach.'
        },
        {
          txt: '"It does not matter who the robot affects: if it works, it is well made."',
          g1: 'Design ETHICS is missing: you have to ask who it benefits and who it might harm.',
          g2: 'The SAFETY of whoever uses it is missing too: low voltage, insulated wires and no sharp parts are part of the design.'
        }
      ],

      critProcesoQuestions: [
        '1. What failed in the test and how did they notice?',
        '2. What concrete change would you make to improve it?',
        '3. How would you communicate the result to your community?'
      ],

      critProcesoBank: [
        {
          txt: 'The garden team tested their waterer three times: the water turned on fine, but it never shut off and the plot ended up waterlogged.',
          f: 'The shutting-off failed: the program turned the water on but had no order to shut it off once the soil was already moist. They noticed because they measured the plot after every trial.',
          m: 'Add to the program: if the soil is already moist, then close the valve; and test three more times measuring the water used.',
          c: 'By showing the community the table of the three tests before and after the improvement, with the sketch and a short demonstration.'
        },
        {
          txt: 'The river crossing alarm went off, but by the time it sounded the water was already over the road and nobody managed to turn back.',
          f: 'The timing of the warning failed: the sensor was mounted too low, so it warned late. They found out by comparing the time of the warning with the time the water covered the crossing.',
          m: 'Raise the sensor and add a second early-warning mark; repeat the test with water and a stopwatch.',
          c: 'By announcing it at the school and at the church, with a poster explaining what each alarm sound means.'
        },
        {
          txt: 'The trash sorter ran 20 containers through: 18 reached the right bin and 2 went to the wrong one.',
          f: 'Separating the lightest containers failed: the gate moved too late. They knew because they counted the hits and misses out of the 20 containers.',
          m: 'Move the gate earlier and slow the belt down; repeat the test with another 20 containers.',
          c: 'By presenting in two minutes the problem, the percentage of hits before and after, and the working model.'
        },
        {
          txt: 'The automatic roof over the coffee drying yard closed properly, but it took so long that the coffee had already got wet.',
          f: 'The response time failed: the motor was far too slow for the size of the roof. They measured it with a stopwatch from the first drop to the roof fully closed.',
          m: 'Use a pulley that gives more speed, or split the roof into two halves that close at the same time; then measure the time again.',
          c: 'By explaining to the coffee-growing families how much coffee is saved for every minute gained in closing it.'
        },
        {
          txt: 'The robotic scarecrow worked on the first day, but by the third day the battery ran out before noon.',
          f: 'The energy source failed: the battery did not last the whole day. They noticed by writing down the time it stopped spinning each day.',
          m: 'Add a small solar panel to recharge the battery and make the arm spin only when the sensor detects movement.',
          c: 'By sharing with the neighbors the table of running hours before and after the solar panel.'
        }
      ],

      critCompareBank: [
        {
          a: 'A statement that says what is going wrong, who it affects and why it matters (for example: the garden dries out at the weekend).',
          b: 'A concrete proposal to solve it (for example: a waterer that turns the water on when the soil is dry).',
          ga: 'The problem.', gb: 'The solution.',
          gr: 'Similarity: both are written on the project sheet and both talk about the same need. Difference: the problem describes the situation and the people affected; the solution proposes the robot and its parts.'
        },
        {
          a: 'What the robot MUST ACHIEVE to count as a success (for example: warning before the water reaches the crossing).',
          b: 'The LIMIT that cannot be crossed (for example: spending no more than 200 lempiras and no more than three weeks).',
          ga: 'The criterion.', gb: 'The constraint.',
          gr: 'Similarity: both are written before designing and both guide the team’s decisions. Difference: the criterion measures success; the constraint limits the cost, the materials, the time or the safety.'
        },
        {
          a: 'The first version, built with whatever is available so it can be tried out and its faults discovered.',
          b: 'The stage in which what failed is changed and it is tried again until it meets the criterion.',
          ga: 'The prototype.', gb: 'Improving (iterating).',
          gr: 'Similarity: both are part of the design cycle and both need tests with the data written down. Difference: the prototype is the object you build; improving is the act of fixing it after the test.'
        },
        {
          a: 'A labeled drawing showing which sensor, which mechanism, which energy and which program the robot will carry.',
          b: 'A two-minute presentation to the class with the problem, the design, the test and the improvement.',
          ga: 'The design sketch.', gb: 'Communicating the project.',
          gr: 'Similarity: both explain the robot to other people and both need to be clear. Difference: the sketch is made before building and guides the team; the communication happens at the end and shows the results obtained.'
        }
      ],

      critDesignBank: [
        'In your community, the coffee harvest is lost when it rains suddenly and the beans are drying out in the yard.',
        'In the rainy season the river rises and the children do not know whether it is safe to cross to get to school.',
        'The school garden dries out because nobody comes to water it at weekends or during the holidays.',
        'The water from the creek floods the houses in the neighborhood at night and the families do not manage to move their things.',
        'At school the trash gets mixed together: plastic, paper and food scraps all go into the same bin.'
      ],

      critDesignGuide: 'Rubric with 4 criteria (20 pts total): ① A WELL-DEFINED PROBLEM (5 pts): says what is going wrong, who it affects and why it matters, with a measurable success criterion. ② JUSTIFIED SENSORS AND MECHANISMS (5 pts): names which sensor measures the signal of the problem, which mechanism or actuator carries out the action and which energy source it uses, explaining WHY each one was chosen. ③ A COHERENT PROGRAM (5 pts): writes the main order in the form «if X happens, then do Y», matching the sensor with the actuator. ④ TEST, IMPROVEMENT AND ETHICS (5 pts): says how it would be tested and measured, proposes an improvement if it does not meet the criterion, and mentions who it benefits, who it might harm and how it is kept safe.',

      /* Los ids (identificar, idear…) NO se traducen: el widget que ordena las
         7 etapas compara por id, no por texto. */
      CICLO_ETAPAS: [
        { id: 'identificar', n: '1. Identify the problem', icon: '🔍', guia: 'What is going wrong? who does it affect? why does it matter? The success criterion is written here too.' },
        { id: 'idear', n: '2. Brainstorm solutions', icon: '💡', guia: 'You write down LOTS of ideas without judging them; then you pick the most realistic one given the cost, the time and the materials.' },
        { id: 'disenar', n: '3. Design', icon: '✏️', guia: 'A labeled sketch: which SENSOR measures, which MECHANISM acts, which ENERGY drives it and which INSTRUCTION the program follows.' },
        { id: 'construir', n: '4. Build the prototype', icon: '🔧', guia: 'You put the first version together with whatever material you have. It has to be testable, not pretty.' },
        { id: 'probar', n: '5. Test', icon: '🧪', guia: 'You try it out several times, you measure and you write down what fails and what works, comparing against the criterion.' },
        { id: 'mejorar', n: '6. Improve', icon: '🔁', guia: 'You change what failed (one thing at a time) and test again. Failing is part of the process.' },
        { id: 'comunicar', n: '7. Communicate', icon: '📢', guia: 'You present the project in two minutes: problem, design, test, improvement and who it benefits.' }
      ],

      /* Los nombres de los equipos se conservan: son de las familias del centro */
      proyectosHN: [
        {
          id: 'cafe', nombre: 'Coffee drying yard robot', icon: '☕', equipo: 'Designer: Keyli · Programmer: Denis · Builder: Alexis · Tester: Yensi',
          etapas: {
            identificar: '☕ In the village, the coffee laid out to dry in the yard gets soaked when it rains suddenly. It affects the coffee-growing families: they lose part of the year’s harvest. <strong>Criterion:</strong> the roof must be shut within one minute of the first raindrop.',
            idear: 'The team’s ideas: (1) somebody keeping watch in shifts, (2) a tarp pulled across with a rope, (3) a sliding roof that closes by itself when it detects rain.',
            disenar: '✏️ Sketch: a rain sensor at the edge of the yard, a sliding roof on rails moved by a motor with a pulley, a battery recharged by a solar panel, and a program with one main order.',
            construir: '🔧 A scale prototype with cardboard, two thread pulleys, a toy motor and a tray of corn kernels standing in for the coffee.',
            probar: '🧪 Test: water is sprayed on the sensor and the time is taken. In three trials the roof closed in 95, 88 and 91 seconds: it does NOT meet the one-minute criterion.',
            mejorar: '🔁 Improvement: split the roof into two panels that close at the same time and use a smaller pulley on the motor. New trials: 42, 39 and 44 seconds. ✅ It meets the criterion.',
            comunicar: '📢 A 2-minute presentation to the class and to the cooperative: problem, sketch, table of times before and after, and how much coffee is saved per harvest.'
          },
          decisiones: [
            { etapa: 'idear', k: 'idea', q: 'Which of the three ideas should be chosen?', opts: ['Somebody keeping watch in shifts, day and night', 'A sliding roof that closes by itself when it detects rain', 'Keeping the coffee in sacks and not laying it out'], a: 1, why: 'It is the only one that solves the problem without depending on somebody being there and without giving up drying in the sun.' },
            { etapa: 'disenar', k: 'sensor', q: 'Which sensor does the robot carry?', opts: ['Rain sensor', 'Sound sensor', 'Weight sensor'], a: 0, why: 'The signal of the problem is the rain: it has to be measured right when it starts.' },
            { etapa: 'disenar', k: 'mecanismo', q: 'Which mechanism moves the roof?', opts: ['A gear that spins a propeller', 'A motor with a pulley on rails', 'A magnet'], a: 1, why: 'The pulley multiplies the motor’s force and lets a heavy roof slide along the rails.' },
            { etapa: 'disenar', k: 'energia', q: 'There is no power outlet near the yard. Which energy does it use?', opts: ['A battery recharged by a solar panel', 'A 300-meter cable from the house', 'A candle'], a: 0, why: 'The drying yard is in the sun all day: the panel recharges the battery and avoids long, dangerous cables.' },
            { etapa: 'disenar', k: 'programa', q: 'What is the main instruction of the program?', opts: ['Close the roof every hour', 'If the sensor detects rain, then close the roof', 'Open the roof when somebody walks past'], a: 1, why: 'The «if X happens, then do Y» structure connects what the sensor measures with what the actuator does.' },
            { etapa: 'mejorar', k: 'mejora', q: 'The roof closed in 91 seconds and the criterion is 60. Which improvement is right?', opts: ['Lower the criterion to 120 seconds', 'Split the roof into two panels and use a smaller pulley', 'Take the sensor off'], a: 1, why: 'You improve the design, not the criterion: two panels travel half the distance and the pulley gives more speed.' }
          ],
          orden: [4, 0, 6, 2, 5, 1, 3]
        },
        {
          id: 'rio', nombre: 'River crossing alert', icon: '🌊', equipo: 'Designer: Marlon · Programmer: Suyapa · Builder: Dania · Tester: Elvin',
          etapas: {
            identificar: '🌊 In the rainy season the river rises and the children do not know whether it is safe to cross on their way to school. It affects the families on the far bank and there is a risk of an accident. <strong>Criterion:</strong> warn when the water reaches half the safety mark, not once it is already past it.',
            idear: 'Ideas: (1) paint a gauge on the rock, (2) send an adult to check, (3) an alarm with a level sensor that sounds and switches a red light on.',
            disenar: '✏️ Sketch: a water level sensor fixed to a post, an alarm horn and a red light, a battery with a solar panel, and a program that compares the level against the mark.',
            construir: '🔧 A prototype with a bottle, a cork float, a bell and a lamp, all mounted on a board beside the crossing.',
            probar: '🧪 Test: a container is filled little by little. The alarm sounded when the water was already covering the whole mark: it warned late in all three trials.',
            mejorar: '🔁 Improvement: raise the sensor to half the mark and add a second early warning. In the new test the alarm sounds with the water halfway. ✅ It meets the criterion.',
            comunicar: '📢 It is explained at the school and at the church what each warning means, and a poster with a drawing of the system is put up beside the crossing.'
          },
          decisiones: [
            { etapa: 'idear', k: 'idea', q: 'Which idea should be chosen?', opts: ['Paint a gauge on the rock', 'An alarm with a level sensor, a horn and a light', 'Send an adult to check every morning'], a: 1, why: 'It warns on its own, day and night, without putting anyone at risk or depending on somebody going to look at the gauge.' },
            { etapa: 'disenar', k: 'sensor', q: 'Which sensor does it need?', opts: ['Water level sensor', 'Color sensor', 'Temperature sensor'], a: 0, why: 'What has to be measured is how far the water rises: that is the signal of the problem.' },
            { etapa: 'disenar', k: 'mecanismo', q: 'Which actuator gives the warning?', opts: ['An arm that lowers a metal barrier', 'A horn and a flashing red light', 'A conveyor belt'], a: 1, why: 'The warning has to be heard and seen from far away, day and night; a heavy barrier would be expensive and unsafe.' },
            { etapa: 'disenar', k: 'energia', q: 'There is no electricity beside the crossing. Which energy does it use?', opts: ['A battery with a solar panel', 'A cable from the street light pole', 'Power straight from the river'], a: 0, why: 'It is safe, it needs no electrical installation and it works even when the storm cuts the power.' },
            { etapa: 'disenar', k: 'programa', q: 'What is the main instruction?', opts: ['Sound the alarm every 10 minutes', 'If the level reaches half the mark, then switch the alarm and the light on', 'Switch the light off if it is sunny'], a: 1, why: 'It links the sensor’s measurement to the actuator’s action and respects the criterion of warning in time.' },
            { etapa: 'mejorar', k: 'mejora', q: 'The alarm warned once the water was already over the mark. Which improvement is right?', opts: ['Raise the sensor to half the mark and add an early warning', 'Make the horn louder', 'Only test when it is not raining'], a: 0, why: 'The problem was not the volume but the timing of the warning: you have to measure earlier, not louder.' }
          ],
          orden: [2, 5, 0, 6, 3, 1, 4]
        },
        {
          id: 'huerto', nombre: 'School garden waterer', icon: '🌱', equipo: 'Designer: Josué · Programmer: Angelly · Builder: Jael · Tester: Kevin',
          etapas: {
            identificar: '🌱 The school garden dries out at weekends and during the holidays because nobody comes to water it. It affects the whole school: the plants and months of work are lost. <strong>Criterion:</strong> keep the soil moist for three days in a row with nobody stepping in.',
            idear: 'Ideas: (1) watering shifts with the families, (2) bottles that drip slowly, (3) a waterer with a moisture sensor that turns the water on and off by itself.',
            disenar: '✏️ Sketch: a moisture sensor buried in the soil, a valve or pump connected to the hose, a battery with a solar panel, and a program with two orders: open and close.',
            construir: '🔧 A prototype with a big bottle as a tank, a thin hose, a toy valve and a sensor made from two nails set apart.',
            probar: '🧪 Three-day test: the water turned on properly every time, but it never shut off and the plot ended up waterlogged. The tank level was measured every morning.',
            mejorar: '🔁 Improvement: add the closing order to the program for when the soil is already moist. New three-day test: the soil stayed moist and there was water left over. ✅ It meets the criterion.',
            comunicar: '📢 A presentation with the table of the three days before and after, the sketch and a short demonstration of the waterer in the schoolyard.'
          },
          decisiones: [
            { etapa: 'idear', k: 'idea', q: 'Which idea meets the criterion of three days with nobody there?', opts: ['Watering shifts with the families', 'A waterer with a moisture sensor that turns the water on and off', 'Watering twice as much on Friday'], a: 1, why: 'It is the only one that works on its own for the three days and does not depend on somebody turning up.' },
            { etapa: 'disenar', k: 'sensor', q: 'Which sensor does it carry?', opts: ['Soil moisture sensor', 'Distance sensor', 'Sound sensor'], a: 0, why: 'The signal of the problem is how dry the soil is: that is what has to be measured.' },
            { etapa: 'disenar', k: 'mecanismo', q: 'Which actuator lets the water through?', opts: ['A horn', 'A water valve or pump', 'A gear with big teeth'], a: 1, why: 'It is the actuator that opens and closes the flow of water, which is the action that solves the problem.' },
            { etapa: 'disenar', k: 'energia', q: 'Which energy source suits the garden?', opts: ['A battery with a solar panel', 'An extension cord from the classroom', 'Batteries changed every day'], a: 0, why: 'The garden is in the sun, there is no outlet nearby and nobody will go and change batteries at the weekend.' },
            { etapa: 'disenar', k: 'programa', q: 'What is the main instruction of the program?', opts: ['Water nonstop, always', 'If the soil is dry, then turn the water on; if it is already moist, then shut it off', 'Turn the water on at 6 in the morning'], a: 1, why: 'It has the condition and the shutting-off too: without that second order the plot gets waterlogged.' },
            { etapa: 'mejorar', k: 'mejora', q: 'The plot ended up waterlogged. Which improvement is right?', opts: ['Plant fewer plants', 'Add the order to shut off once the soil is already moist', 'Take the sensor off and water by hand'], a: 1, why: 'The fault was in the program, not in the plants: the closing order was missing.' }
          ],
          orden: [6, 2, 4, 0, 5, 1, 3]
        },
        {
          id: 'inundacion', nombre: 'Neighborhood flood alert', icon: '🚨', equipo: 'Designer: Evelyn · Programmer: Bryan · Builder: Nelson · Tester: Rosa',
          etapas: {
            identificar: '🚨 The water from the creek gets into the houses at night and the families do not manage to move their things or get out with the children. <strong>Criterion:</strong> warn the whole neighborhood at least 15 minutes before the water reaches the houses.',
            idear: 'Ideas: (1) have a neighbor watch the creek, (2) a phone message group, (3) an automatic siren with a level sensor and a rain sensor.',
            disenar: '✏️ Sketch: a level sensor in the creek and a rain sensor, a siren and a flashing light on the tallest post, a battery with a solar panel and a backup, and a program with two warning levels.',
            construir: '🔧 A prototype with a channel, a float, a loud bell and a flashing lamp, protected from the rain by a plastic box.',
            probar: '🧪 Test with a hose: the siren sounded, but it could only be heard 40 meters away and the criterion asks for the whole neighborhood. Water also got into the box.',
            mejorar: '🔁 Improvement: move the siren up to the tallest post, add a second siren on the next block and seal the box with silicone. New test: it can be heard 120 meters away. ✅ It meets the criterion.',
            comunicar: '📢 A meeting with the neighborhood council: it is explained what each warning means, where the sirens are and what each family should do when they hear them.'
          },
          decisiones: [
            { etapa: 'idear', k: 'idea', q: 'Which idea warns even when everyone is asleep?', opts: ['Have a neighbor watch the creek at night', 'An automatic siren with a level sensor and a rain sensor', 'A phone message group'], a: 1, why: 'It works on its own in the small hours and does not depend on somebody being awake or having credit on their phone.' },
            { etapa: 'disenar', k: 'sensor', q: 'Which sensors does it need?', opts: ['Water level and rain', 'Color and sound', 'Weight and touch'], a: 0, why: 'The rise is anticipated by measuring the water in the creek and the rain that feeds it.' },
            { etapa: 'disenar', k: 'mecanismo', q: 'Which actuator alerts the neighborhood?', opts: ['A conveyor belt', 'A siren and a flashing light on the tall post', 'A mechanical arm'], a: 1, why: 'It has to reach the whole neighborhood: a loud sound and a visible light meet that criterion.' },
            { etapa: 'disenar', k: 'energia', q: 'The storm usually cuts the power. Which energy suits it?', opts: ['A battery with a solar panel and a charged backup', 'Only the power from the house', 'A gasoline generator running all the time'], a: 0, why: 'Just when the alarm is needed most is when the power goes: the battery guarantees the warning.' },
            { etapa: 'disenar', k: 'programa', q: 'What is the main instruction?', opts: ['If the level goes past the first mark, then warn; if it passes the second, then sound the siren', 'Sound the siren every half hour', 'Switch the light on when it gets dark'], a: 0, why: 'Two warning levels give the families time: first an early alert and then evacuation.' },
            { etapa: 'mejorar', k: 'mejora', q: 'The siren could only be heard 40 meters away. Which improvement is right?', opts: ['Move it up to the tallest post and add a second siren', 'Only warn the nearby houses', 'Test without rain so it can be heard better'], a: 0, why: 'The criterion is to warn the WHOLE neighborhood: you increase the reach, you do not lower the goal.' }
          ],
          orden: [3, 6, 1, 5, 0, 4, 2]
        },
        {
          id: 'basura', nombre: 'School trash sorter', icon: '♻️', equipo: 'Designer: Ángel · Programmer: Fanny · Builder: Óscar · Tester: Lucía',
          etapas: {
            identificar: '♻️ At school the plastic, the paper and the food scraps all go into the same bin, so nothing can be recycled. It affects the tidiness of the schoolyard and the community that buys the recyclable material. <strong>Criterion:</strong> sort at least 19 out of every 20 containers correctly.',
            idear: 'Ideas: (1) label the bins and trust people, (2) a student on duty sorting by hand, (3) a belt with a sensor that diverts each container to its own bin.',
            disenar: '✏️ Sketch: a weight sensor at the start of the belt, a cardboard belt moved by a motor with a pulley, a gate that diverts, a rechargeable battery and a program with one condition.',
            construir: '🔧 A prototype with a cardboard belt and ribbons, a toy motor with a pulley, a paddle gate and two labeled boxes.',
            probar: '🧪 Test with 20 containers: 18 reached the right bin and 2 light ones went to the wrong one. It falls short of the 19-out-of-20 criterion.',
            mejorar: '🔁 Improvement: move the gate earlier and slow the belt down. New test with another 20 containers: 20 hits. ✅ It meets the criterion.',
            comunicar: '📢 A 2-minute presentation with the working model and the table of hits before and after, plus an invitation to use the labeled bins.'
          },
          decisiones: [
            { etapa: 'idear', k: 'idea', q: 'Which idea can reach 19 hits out of every 20?', opts: ['Label the bins and trust people', 'A belt with a sensor that diverts each container', 'A student on duty sorting by hand all day'], a: 1, why: 'It is measurable and consistent; labeling guarantees nothing and a student on duty misses class and gets tired.' },
            { etapa: 'disenar', k: 'sensor', q: 'Which sensor tells the containers apart?', opts: ['Weight sensor (or color)', 'Moisture sensor', 'Water level sensor'], a: 0, why: 'Plastic and paper differ clearly in weight and color: that is the useful signal.' },
            { etapa: 'disenar', k: 'mecanismo', q: 'Which mechanism moves and separates the containers?', opts: ['A propeller', 'A belt with a motor and a pulley, plus a gate', 'A horn'], a: 1, why: 'The belt carries them and the gate diverts them: together they perform the action that solves the problem.' },
            { etapa: 'disenar', k: 'energia', q: 'The belt will be inside the workshop classroom. Which energy suits it?', opts: ['A low-voltage rechargeable battery', '110 V power with bare wires', 'A gasoline engine'], a: 0, why: 'Low voltage and insulated wires: the students’ safety is a constraint of the project.' },
            { etapa: 'disenar', k: 'programa', q: 'What is the main instruction?', opts: ['Run the belt nonstop', 'If the container is light, then open the plastic gate', 'Switch the motor off if there is noise'], a: 1, why: 'It turns the sensor’s measurement into the gate’s action, which is what does the sorting.' },
            { etapa: 'mejorar', k: 'mejora', q: 'Two light containers fell into the wrong bin. Which improvement is right?', opts: ['Move the gate earlier and slow the belt down', 'Only count the heavy containers', 'Lower the criterion to 15 out of 20'], a: 0, why: 'You fix the design to meet the criterion; changing the goal or the count would be fooling yourself.' }
          ],
          orden: [1, 4, 6, 2, 0, 3, 5]
        }
      ]
    },

    /* ══════════════════════════════════════════════════════
       3. FRASES EXACTAS (pantalla y pruebas imprimibles)
       ══════════════════════════════════════════════════════ */
    frases: {
      /* mensaje de WhatsApp: lo propio de esta misión
         (lo común a todas las misiones vive en js/metas-i18n.js) */
      'Cierra la *Ruta de los Robots*: aprende el ciclo de diseño de ingeniería y crea un robot que resuelva un problema de tu comunidad. 🛠️':
        'Close the *Robot Path*: learn the engineering design cycle and build a robot that solves a problem in your community. 🛠️',
      '_Se te hará prueba escrita y presentarás tu proyecto en equipo._ 🤖':
        '_You will take a written test and present your project as a team._ 🤖',
      /* pestañas propias de esta misión */
      'Criterios': 'Criteria', 'Taller': 'Workshop',
      /* mini-quiz */
      '¡Correcto! Piensas como todo un robotista.': 'Correct! You are thinking like a real roboticist.',
      'Casi. Pregúntate siempre: ¿a quién beneficia?, ¿a quién podría afectar?, ¿es seguro?':
        'Almost. Always ask yourself: who does it benefit? who might it harm? is it safe?',
      /* taller de diseño */
      '🛠️ Taller de Diseño': '🛠️ Design Workshop',
      '✍️ Anota esta etapa en tu ficha de proyecto: es la que llevarás al cuaderno.':
        '✍️ Write this stage down on your project sheet: it is the one that goes in your notebook.',
      'En esta etapa:': 'In this stage:',
      '✅ ¡Buena decisión!': '✅ Good call!',
      '☕ Robot del patio de café': '☕ Coffee drying yard robot',
      '🔍 1. Identificar el problema': '🔍 1. Identify the problem',
      /* flashcards y memorama */
      '🧠 Memorama del Ciclo de Diseño': '🧠 Design Cycle Memory Game',
      /* clasifica */
      '💡 Consejo: ¡Usa el botón "Variar grupo" varias veces! Practicar con diferentes categorías te ayudará a dominar el tema.':
        '💡 Tip: use the "Change group" button several times! Practicing with different categories helps you master the topic.',
      /* widgets */
      '🔁 Ordena las 7 etapas del ciclo de diseño': '🔁 Put the 7 stages of the design cycle in order',
      '⭐ +5 XP por dejar el ciclo en orden (primera vez por proyecto)': '⭐ +5 XP for getting the cycle in order (first time per project)',
      'hasta dejar las etapas en el orden correcto del ciclo de diseño:': 'arrows to put the stages into the right order of the design cycle:',
      '¡Perfecto! Ese es el ciclo de diseño completo. +5 XP': 'Perfect! That is the complete design cycle. +5 XP',
      'Hay pasos fuera de orden. Recuerda: identificar → idear → diseñar → construir → probar → mejorar → comunicar.':
        'Some steps are out of order. Remember: identify → brainstorm → design → build → test → improve → communicate.',
      '🔁 Ordena el proyecto paso a paso': '🔁 Put the project in order, step by step',
      'para poner los pasos del proyecto en el orden correcto:': 'arrows to put the project steps in the right order:',
      '🧭 ¿Qué decisión de diseño conviene?': '🧭 Which design decision is the right one?',
      'Lee la situación del proyecto y elige la decisión de diseño adecuada:': 'Read the project situation and choose the right design decision:',
      '🎉 ¡Tomas decisiones de diseño como todo un ingeniero!': '🎉 You are making design decisions like a real engineer!',
      '🔗 Empareja: Etapa → ¿Qué se hace?': '🔗 Match: Stage → What is done?',
      '¿Qué se hace en esta etapa del ciclo de diseño?': 'What is done in this stage of the design cycle?',
      '⚖️ ¿Ayuda a las personas o hay que pensarlo mejor?': '⚖️ Does it help people, or does it need more thought?',
      'Pregúntate: ¿a quién beneficia?, ¿a quién podría afectar?, ¿es seguro? Y responde:':
        'Ask yourself: who does it benefit? who might it harm? is it safe? Then answer:',
      'Un robot que avisa de la crecida del río': 'A robot that warns about the river rising',
      /* generador de tareas */
      '🗂️ Fichas de proyecto': '🗂️ Project sheets',
      '💡 Explicar y diseñar proyectos': '💡 Explain and design projects',
      'Copia en tu cuaderno; subraya, colorea o encierra el concepto de robótica indicado en cada oración. Escribe al lado qué parte o tipo de robot es.':
        'Copy this in your notebook; underline, color or circle the robotics concept in each sentence. Next to it, write which part or kind of robot it is.',
      'Copia la siguiente tabla en tu cuaderno. Para cada proyecto responde: ¿qué problema resuelve?, ¿qué sensor lleva?, ¿qué actuador lleva? y ¿qué restricción tiene? Explica con tus palabras.':
        'Copy the table below in your notebook. For each project answer: which problem does it solve? which sensor does it carry? which actuator does it carry? and what constraint does it have? Explain in your own words.',
      'Proyecto': 'Project', '¿Qué problema resuelve?': 'Which problem does it solve?',
      '¿Qué sensor?': 'Which sensor?', '¿Qué actuador?': 'Which actuator?', '¿Qué restricción?': 'Which constraint?',
      /* evaluación conceptual y pensamiento crítico */
      'Robótica · Evaluación Conceptual · Robots que Resuelven Problemas · Educación Básica': 'Robotics · Concept Test · Robots that Solve Problems · Basic Education',
      'Robótica · Prueba de Pensamiento Crítico · Robots que Resuelven Problemas · Educación Básica': 'Robotics · Critical Thinking Test · Robots that Solve Problems · Basic Education',
      '🎓 Evaluación Final · Robots que Resuelven Problemas': '🎓 Final Test · Robots that Solve Problems',
      '🧠 Prueba de Pensamiento Crítico · Robots que Resuelven Problemas': '🧠 Critical Thinking Test · Robots that Solve Problems',
      /* esta misión encabeza la pauta con «Robótica» donde las otras cinco de
         la ruta ponen «Evaluación Final»; la clave copia lo que emite el JS */
      '✅ PAUTA: Robótica · Robots que Resuelven Problemas': '✅ ANSWER KEY: Robotics · Robots that Solve Problems',
      '✅ PAUTA: Pensamiento Crítico · Robots que Resuelven Problemas': '✅ ANSWER KEY: Critical Thinking · Robots that Solve Problems',
      /* pensamiento crítico: títulos y consignas propias */
      'I. Diseña la solución': 'I. Design the solution',
      'II. Corrige el error del proceso': 'II. Correct the mistake in the process',
      'III. Analiza la prueba y la mejora': 'III. Analyze the test and the improvement',
      'V. Proyecto de diseño completo': 'V. Full design project',
      'V. Proyecto de diseño completo · Rúbrica': 'V. Full design project · Rubric',
      /* constancia */
      'Misión 🏆 Robots que Resuelven Problemas · Ruta de los Robots completa':
        'Mission 🏆 Robots that Solve Problems · Robot Path complete',
      '¡Sigue diseñando!': 'Keep designing!',
      '¡Muy buen trabajo de equipo!': 'Great teamwork!',
      '¡Vas muy bien: ya sabes probar y mejorar!': 'You are doing very well: you know how to test and improve now!',
      '¡Dominas el ciclo de diseño completo!': 'You have mastered the whole design cycle!',
      '¡Cerraste la Ruta de los Robots: eres Maestro Innovador!': 'You have completed the Robot Path: you are a Master Innovator!',
      /* etiquetas de accesibilidad (aria-label y title) */
      'Barra de progreso XP': 'XP progress bar',
      'Compartir misión por WhatsApp': 'Share this mission on WhatsApp',
      'Tarjeta de estudio. Presiona Enter para voltear': 'Study card. Press Enter to flip',
      'Opciones': 'Options',
      'Ir a la siguiente sección': 'Go to the next section',
      'Secciones de la misión': 'Mission sections',
      'Logros desbloqueados': 'Achievements unlocked',
      'Tipo de evaluación': 'Type of test'
    },

    /* ══════════════════════════════════════════════════════
       4. FRAGMENTOS (textos con números o nombres variables)
       ══════════════════════════════════════════════════════ */
    fragmentos: [
      /* WhatsApp: el título de la misión en la constancia */
      [/¡(.+?) completó la Misión "Robots que Resuelven Problemas" y cerró la Ruta de los Robots!/g,
        '$1 completed the mission “Robots that Solve Problems” and finished the Robot Path!'],
      /* taller: el rótulo compuesto «Proyecto → Etapa» y sus avisos
         el «¡Proyecto X completo!» va antes que el «Proyecto: » suelto */
      [/🛠️ ¡Proyecto (.+) completo!/g, '🛠️ Project $1 complete!'],
      [/🛠️ Proyecto: /g, '🛠️ Project: '],
      [/🧭 <strong>En esta etapa:<\/strong> /g, '🧭 <strong>In this stage:</strong> '],
      [/^Aún no\. Revisa el paso /, 'Not yet. Look at step '],
      [/^❌ Conviene la otra opción\. /, '❌ The other option is the right one. '],
      [/: recuerda identificar → idear → diseñar → construir → probar → mejorar → comunicar\./g,
        ': remember identify → brainstorm → design → build → test → improve → communicate.'],
      /* widgets: la corrección genérica y la de la ética */
      [/^Correcto: (.+)\. Pregúntate siempre: ¿a quién beneficia\?, ¿a quién podría afectar\?, ¿es seguro\?/,
        'Correct: $1. Always ask yourself: who does it benefit? who might it harm? is it safe?'],
      [/^Correcto: /, 'Correct: '],
      /* generador de tareas: la fila de respuestas de la ficha de proyecto */
      [/Problema: /g, 'Problem: '],
      [/ \| Sensor: /g, ' | Sensor: '],
      [/ \| Actuador: /g, ' | Actuator: '],
      [/ \| Restricción: /g, ' | Constraint: '],
      /* títulos con número de forma: antes que la regla suelta «Forma N» */
      [/🎓 Evaluación Final · Forma (\d+) · Robots que Resuelven Problemas/g, '🎓 Final Test · Form $1 · Robots that Solve Problems'],
      [/🧠 Pensamiento Crítico · Forma (\d+) · Robots que Resuelven Problemas/g, '🧠 Critical Thinking · Form $1 · Robots that Solve Problems'],
      [/Evaluación Robots que Resuelven Problemas/g, 'Test · Robots that Solve Problems'],
      [/Pensamiento Crítico Robots que Resuelven Problemas/g, 'Critical Thinking · Robots that Solve Problems'],
      /* etiquetas de accesibilidad con número */
      [/Problema y diseño del caso (\d+)/g, 'Problem and design for case $1'],
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
