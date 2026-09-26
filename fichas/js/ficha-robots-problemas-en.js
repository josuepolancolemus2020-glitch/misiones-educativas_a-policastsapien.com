/* ============================================================
   Ficha didáctica «Robots que Resuelven Problemas» — en inglés
   ------------------------------------------------------------
   Es la etapa 6 de 6: la que CIERRA la Ruta de los Robots.

   Misma traducción de autor que la misión (engineering design
   cycle · identify · brainstorm · design · build · test ·
   improve · communicate · prototype · sketch · criterion ·
   constraint · design ethics) y en inglés AMERICANO, que es el
   que enseñan las bilingües de Honduras: color, center,
   «Student No.».

   Lo cultural se explica, no se calca: aldea → village, vado →
   river crossing, quebrada → creek, patio de secado → drying
   yard. «Lempiras» se conserva: es la moneda del país.

   Las 7 páginas se traducen enteras (data-i18n="p1".."p7") para
   que la maquetación impresa no se desarme.

   IMPORTANTE para el docente: la Columna B de los pareados
   conserva EL MISMO ORDEN que en español, así la pauta
   (1F · 2I · 3A · 4J · 5C · 6H · 7B · 8E · 9G · 10D) sigue
   siendo válida en las dos versiones. Lo mismo vale para el
   completar, el V/F y la selección múltiple.
   ============================================================ */
(function () {
  'use strict';

  window.MISION_EN = {

    titulo: 'Study Sheet · Mission: Robots that Solve Problems',

    html: {

      /* ═══════════ PÁGINA 1 ═══════════ */
      p1:
        '<div class="idline"><span>Name:</span><span class="raya"></span><span>Student No.:</span><span class="raya corta"></span></div>' +

        '<div class="fh">' +
        '<div class="fh-txt">' +
        '<div class="f-badge">📄 Study Sheet: Mission 🏆 Robots that Solve Problems</div>' +
        '<div class="f-meta"><b>Subject:</b> Robotics &nbsp;·&nbsp; <b>Level:</b> Basic Education &nbsp;·&nbsp; <b>Robot Path · Stage 6 of 6 (final mission)</b></div>' +
        '<div class="f-meta"><b>Topic:</b> The engineering design cycle (identify, brainstorm, design, build, test, improve and communicate), criteria and constraints, ethics and safety, teamwork and five Honduran projects: coffee, river, school garden, floods and trash</div>' +
        '</div>' +
        '<div class="fh-qr">' +
        '<img src="img/qr-mision-robots-problemas.png" alt="Mission QR code">' +
        '<span>📷 Play the mission on your phone</span>' +
        '</div>' +
        '</div>' +

        '<h2>🎯 Learning Objectives</h2>' +

        '<ol class="objetivos">' +
        '<li>Name and put in order the <strong>7 stages of the engineering design cycle</strong>.</li>' +
        '<li>Write out a <strong>problem</strong>, saying what is going wrong, who it affects and why it matters.</li>' +
        '<li>Tell a <strong>success criterion</strong> apart from a <strong>constraint</strong> (cost, materials, time, safety).</li>' +
        '<li>Justify in the <strong>sketch</strong> which sensor, which mechanism, which energy and which program the robot carries.</li>' +
        '<li>Explain why <strong>failing the test</strong> is part of the process, and propose an improvement.</li>' +
        '<li>Value the <strong>ethics and safety</strong> of the design and work as a team with defined roles.</li>' +
        '</ol>' +

        '<h2>🏆 1. A robot is there to solve problems</h2>' +

        '<p>You already know what a robot is, what its <strong>sensors</strong> measure, how it moves with <strong>motors and ' +
        'mechanisms</strong>, where it gets its <strong>electricity</strong> and how a <strong>program</strong> is written for it. ' +
        'Now comes the most important part: using all of that to <strong>solve a real problem</strong> in your community. ' +
        'Engineers do not improvise: they follow the <strong>engineering design cycle</strong>.</p>' +

        '<div class="ciclo">' +
        '<div>🔍 <b>1. Identify</b></div>' +
        '<div>💡 <b>2. Brainstorm</b></div>' +
        '<div>✏️ <b>3. Design</b></div>' +
        '<div>🔧 <b>4. Build</b></div>' +
        '<div>🧪 <b>5. Test</b></div>' +
        '<div>🔁 <b>6. Improve</b></div>' +
        '<div>📢 <b>7. Communicate</b></div>' +
        '</div>' +

        '<div class="caja truco">💡 <b>Trick:</b> the cycle is a <strong>wheel</strong>, not a straight line. After ' +
        'improving you test again, and sometimes you find out the real problem was a different one. That is learning too!</div>' +

        '<h3>🔍✏️🧪 Mini-demonstration: from the problem to the improved robot</h3>' +

        '<div class="ilus">' +
        '<div class="ilus-t">The school garden waterer, step by step</div>' +
        '<div class="celula">' +
        '<div class="cm"><span class="c-emoji">🔍</span><b>Problem</b>The garden dries out at the weekend: nobody comes to water it.</div>' +
        '<div class="cc"><span class="c-emoji">✏️</span><b>Design</b>Moisture sensor + water valve + solar battery + program.</div>' +
        '<div class="cn"><span class="c-emoji">🧪</span><b>Test and improvement</b>The water turned on but never off: the closing order is added.</div>' +
        '</div>' +
        '<p style="font-size:9pt;color:var(--gris);margin:8px 0 0;text-align:center;">✅ And in the end the result is <strong>communicated</strong> to the class and to the community. 📢</p>' +
        '</div>',

      /* ═══════════ PÁGINA 2 ═══════════ */
      p2:
        '<h2 style="margin-top:0;">🔁 2. The 7 stages of the design cycle</h2>' +

        '<table>' +
        '<tr><th>Stage</th><th>What is done?</th><th>Example: the river crossing alert</th></tr>' +
        '<tr><td class="k">🔍 1. Identify</td><td>Say what is going wrong, who it affects and why it matters; write the success criterion</td><td>In the rainy season nobody knows whether the crossing is safe</td></tr>' +
        '<tr><td class="k">💡 2. Brainstorm</td><td>Write down lots of solutions without judging them, then pick the most realistic one</td><td>A painted gauge, somebody keeping watch, or an automatic alarm</td></tr>' +
        '<tr><td class="k">✏️ 3. Design</td><td>Sketch it out: which sensor, which mechanism, which energy and which program</td><td>Level sensor + horn and light + solar battery</td></tr>' +
        '<tr><td class="k">🔧 4. Build</td><td>Put the prototype together with whatever material you have</td><td>A bottle, a cork float, a bell and a lamp on a board</td></tr>' +
        '<tr><td class="k">🧪 5. Test</td><td>Try it out several times, measure and write down what fails</td><td>The alarm sounded late: the water was already over the mark</td></tr>' +
        '<tr><td class="k">🔁 6. Improve</td><td>Fix what failed and test again</td><td>Raise the sensor and add an early warning</td></tr>' +
        '<tr><td class="k">📢 7. Communicate</td><td>Present the project: problem, design, test, improvement</td><td>Explain it at the school and put a poster up by the crossing</td></tr>' +
        '</table>' +

        '<div class="caja idea">📖 <b>Key fact:</b> no prototype comes out right the first time. What separates a good ' +
        'team from one that gives up is <strong>writing the fault down, changing one thing at a time and testing again</strong>.</div>' +

        '<h2>🎯 3. Criteria and ⛔ constraints</h2>' +

        '<p>Before designing, the team writes two lists: the <strong>criterion</strong> says <strong>what the robot must achieve</strong> ' +
        'and it is <strong>measured</strong>; the <strong>constraint</strong> says <strong>which limit cannot be crossed</strong> ' +
        'and it is <strong>respected</strong>.</p>' +

        '<table>' +
        '<tr><th>Project</th><th>🎯 Success criterion (measured)</th><th>⛔ Constraints (respected)</th></tr>' +
        '<tr><td class="k">🌱 School garden waterer</td><td>Soil moist 3 days in a row with nobody turning up</td><td>200 lempiras · recycled material · no bare wires</td></tr>' +
        '<tr><td class="k">🌊 River crossing alert</td><td>Warn with the water at half the mark</td><td>No power outlet nearby · has to stand up to the rain</td></tr>' +
        '<tr><td class="k">♻️ Trash sorter</td><td>Get 19 out of every 20 containers right</td><td>3-week deadline · cardboard and a toy motor</td></tr>' +
        '</table>' +

        '<div class="caja regla">🎯 <b>Golden rule:</b> if the prototype does not meet the criterion, you <strong>improve the ' +
        'design</strong>… <strong>you never lower the criterion</strong> to make it look as if it worked.</div>',

      /* ═══════════ PÁGINA 3 ═══════════ */
      p3:
        '<h2 style="margin-top:0;">🧩 4. In the sketch, every part has to be justified</h2>' +

        '<table>' +
        '<tr><th>Question for the sketch</th><th>From the Robot Path</th><th>Example</th></tr>' +
        '<tr><td class="k">📡 Which sensor?</td><td>Stage 2: it measures the signal of the problem</td><td>Moisture, water level, rain, weight, movement</td></tr>' +
        '<tr><td class="k">⚙️ Which mechanism?</td><td>Stage 3: it carries out the action</td><td>Motor with a pulley, belt, gear, valve</td></tr>' +
        '<tr><td class="k">🔋 Which energy?</td><td>Stage 4: a safe, low-voltage circuit</td><td>Rechargeable battery, solar panel, insulated wires</td></tr>' +
        '<tr><td class="k">📋 Which program?</td><td>Stage 5: exact instructions</td><td>«If the soil is dry, then turn the water on»</td></tr>' +
        '</table>' +

        '<div class="tri">' +
        '<div class="tnuc"><b>👥 Team roles</b><strong>Designer</strong> (the sketch), <strong>programmer</strong> (the instructions), <strong>builder</strong> (the prototype) and <strong>tester</strong> (the trials and the data). Everybody checks and has a say.</div>' +
        '<div class="torg"><b>⚖️ Ethics and safety</b>Asking <strong>who the robot benefits</strong> and <strong>who it might harm</strong>. Robots help people, they do not simply replace them. Low voltage and no sharp parts.</div>' +
        '</div>' +

        '<h2>🇭🇳 5. Five projects for Honduras</h2>' +

        '<table>' +
        '<tr><th>Project</th><th>Problem</th><th>Sensor and actuator</th></tr>' +
        '<tr><td class="k">☕ Coffee drying yard</td><td>The coffee laid out to dry gets soaked by sudden rain</td><td>Rain sensor · motor with a pulley that closes the roof</td></tr>' +
        '<tr><td class="k">🌊 River crossing</td><td>Nobody knows whether it is safe to cross in the rainy season</td><td>Water level sensor · alarm horn and light</td></tr>' +
        '<tr><td class="k">🌱 School garden</td><td>The garden dries out at weekends</td><td>Moisture sensor · water pump or valve</td></tr>' +
        '<tr><td class="k">🚨 Floods</td><td>The water gets into the houses at night with no warning</td><td>Level and rain sensor · siren and flashing light</td></tr>' +
        '<tr><td class="k">♻️ School trash</td><td>Plastic and paper get mixed together in the schoolyard</td><td>Weight or color sensor · belt with a motor and a gate</td></tr>' +
        '</table>' +

        '<h2>🎲 6. Unplugged activities (no computer)</h2>' +

        '<ul>' +
        '<li><strong>📐 A sketch on paper:</strong> draw your robot on a sheet and <strong>label its parts with arrows</strong>: ' +
        'sensor, mechanism, energy source and the main instruction of the program. Next to each part write ' +
        '<strong>what it is for</strong>: if you cannot justify it, it does not belong there.</li>' +
        '<li><strong>📋 A team project sheet:</strong> with your team fill in the five boxes: <strong>problem · ' +
        'idea · design · test · improvement</strong>, and write down who takes each role (designer, programmer, builder, tester).</li>' +
        '<li><strong>🧱 A model out of recycled material:</strong> build the prototype with cardboard, bottles, caps, string and sticks. ' +
        'It does not have to look pretty: it has to be <strong>testable</strong>.</li>' +
        '<li><strong>📢 A 2-minute presentation:</strong> present it to the class: (1) the problem and who it affects, ' +
        '(2) the design with every part justified, (3) what happened in the test, with data, (4) the improvement and (5) who it benefits.</li>' +
        '</ul>',

      /* ═══════════ PÁGINA 4 ═══════════ */
      p4:
        '<div class="caja hn">🇭🇳 <b>Engineering with what you have:</b> you do not need an expensive laboratory to solve problems. ' +
        'With <strong>cardboard, a battery, a toy motor and a good design cycle</strong> you can already look after the garden, ' +
        'warn about a rising river or sort the trash at your school. The engineers Honduras needs start ' +
        'today, with paper and a pencil! 💚</div>' +

        '<h2>✍️ 7. Test Yourself! Activities</h2>' +

        '<h3>I. Fill in the blanks <span class="val">(Value: 10 points each)</span></h3>' +

        '<ol>' +
        '<li>At the fair, the robot from Kenia’s group <span class="linea-resp"></span> very well.</li>' +
        '<li>The box that warns when the tank fills up was made in one <span class="linea-resp"></span>.</li>' +
        '<li>The design cycle is a <span class="linea-resp"></span>, not a straight line.</li>' +
        '<li>In the coffee yard, the <span class="linea-resp"></span> sensor warns that the roof has to close.</li>' +
        '<li>The coffee yard roof is closed by a motor with a <span class="linea-resp"></span>.</li>' +
        '<li>The ford alarm uses a water <span class="linea-resp"></span> sensor.</li>' +
        '<li>The trash sorter must get <span class="linea-resp"></span> out of every 20 containers right.</li>' +
        '<li>The garden sprinkler cannot cost more than <span class="linea-resp"></span> lempiras.</li>' +
        '<li>The presentation to the class lasts two <span class="linea-resp"></span>.</li>' +
        '<li>For safety, the robot works with low <span class="linea-resp"></span>.</li>' +
        '</ol>' +

        '<h3>II. True or False <span class="val">(Value: 10 points each)</span></h3>' +

        '<ol>' +
        '<li>____ At the fair, the judges asked both groups the same question.</li>' +
        '<li>____ The tank group used more parts than Kenia’s group.</li>' +
        '<li>____ After a failure, it is best to change one single thing before trying again.</li>' +
        '<li>____ A good prototype works the first time.</li>' +
        '<li>____ Robots help people; they do not just replace them.</li>' +
        '<li>____ If the robot does not meet the goal, you can ask for less so it looks like it worked.</li>' +
        '<li>____ Sometimes, while trying it out, you find the real problem was a different one.</li>' +
        '<li>____ The model has to look pretty to be tested.</li>' +
        '<li>____ In the team, everybody checks and gives an opinion, not only the one who draws.</li>' +
        '<li>____ To solve a problem in your community you need an expensive laboratory.</li>' +
        '</ol>' +

        '<h3>III. Multiple choice <span class="val">(Value: 10 points each)</span> — Circle the correct letter.</h3>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">1</span>The ford alert goes where there is no socket. What power source is best?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> A one-kilometer cable</span>' +
        '<span class="op"><i>b</i> A candle</span>' +
        '<span class="op"><i>c</i> A battery with a solar panel</span>' +
        '<span class="op"><i>d</i> None</span>' +
        '</div>' +
        '</div>',

      /* ═══════════ PÁGINA 5 ═══════════ */
      p5:
        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">2</span>Why does the school garden dry out?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> Because salt falls on it</span>' +
        '<span class="op"><i>b</i> Because on days off nobody comes to water it</span>' +
        '<span class="op"><i>c</i> Because birds eat it</span>' +
        '<span class="op"><i>d</i> Because it fills with trash</span>' +
        '</div>' +
        '</div>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">3</span>What wakes the families when water gets into the houses at night?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> A siren and a flashing light</span>' +
        '<span class="op"><i>b</i> A poster on the wall</span>' +
        '<span class="op"><i>c</i> A clock</span>' +
        '<span class="op"><i>d</i> A fan</span>' +
        '</div>' +
        '</div>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">4</span>What actuator does the school garden sprinkler need?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> A camera</span>' +
        '<span class="op"><i>b</i> A water pump or valve</span>' +
        '<span class="op"><i>c</i> A horn</span>' +
        '<span class="op"><i>d</i> A mirror</span>' +
        '</div>' +
        '</div>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">5</span>Which team role writes the robot’s instructions?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> The designer</span>' +
        '<span class="op"><i>b</i> The builder</span>' +
        '<span class="op"><i>c</i> The programmer</span>' +
        '<span class="op"><i>d</i> The audience</span>' +
        '</div>' +
        '</div>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">6</span>Which sensor does the cornfield scarecrow need so it spins only when the birds arrive?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> Moisture</span>' +
        '<span class="op"><i>b</i> Motion</span>' +
        '<span class="op"><i>c</i> Temperature</span>' +
        '<span class="op"><i>d</i> Sound</span>' +
        '</div>' +
        '</div>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">7</span>Next to each drawn part of the robot you write…</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> its price</span>' +
        '<span class="op"><i>b</i> its color</span>' +
        '<span class="op"><i>c</i> its weight</span>' +
        '<span class="op"><i>d</i> what it is for</span>' +
        '</div>' +
        '</div>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">8</span>What happens to the coffee spread out in the yard?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> Birds eat it</span>' +
        '<span class="op"><i>b</i> It gets mixed with plastic</span>' +
        '<span class="op"><i>c</i> It burns in the sun</span>' +
        '<span class="op"><i>d</i> A sudden downpour soaks it</span>' +
        '</div>' +
        '</div>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">9</span>In the garden sprinkler trial, what failed?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> The water opened but did not close</span>' +
        '<span class="op"><i>b</i> The battery exploded</span>' +
        '<span class="op"><i>c</i> No water came out</span>' +
        '<span class="op"><i>d</i> The soil turned to stone</span>' +
        '</div>' +
        '</div>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">10</span>For the ford, which of these ideas is an automatic alarm?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> A painted ruler</span>' +
        '<span class="op"><i>b</i> A watchman</span>' +
        '<span class="op"><i>c</i> A float that rings a bell</span>' +
        '<span class="op"><i>d</i> Asking the neighbor</span>' +
        '</div>' +
        '</div>',

      /* ═══════════ PÁGINA 6 ═══════════ */
      p6:
        '<h3>IV. Matching <span class="val">(Value: 10 points each)</span> — Write on the line the letter from Column B that matches.</h3>' +

        '<table>' +
        '<tr><th style="width:42%;">Column A</th><th>Column B</th></tr>' +
        '<tr><td>1. ____ Identify</td><td>A. Try it several times, measure and write down what fails</td></tr>' +
        '<tr><td>2. ____ Brainstorm</td><td>B. What the robot must achieve, and it is measured</td></tr>' +
        '<tr><td>3. ____ Design</td><td>C. Say what is wrong, who it affects and why it matters</td></tr>' +
        '<tr><td>4. ____ Build</td><td>D. Thinking about who the robot helps and who it could affect</td></tr>' +
        '<tr><td>5. ____ Test</td><td>E. Sketch which sensor, which mechanism, which power and which program</td></tr>' +
        '<tr><td>6. ____ Improve</td><td>F. The limit you cannot go past, and it is respected</td></tr>' +
        '<tr><td>7. ____ Communicate</td><td>G. Fix what failed and test again</td></tr>' +
        '<tr><td>8. ____ Criterion</td><td>H. Write down lots of solutions without judging them, then choose</td></tr>' +
        '<tr><td>9. ____ Constraint</td><td>I. Put the prototype together with the materials available</td></tr>' +
        '<tr><td>10. ____ Design ethics</td><td>J. Present the problem, the design, the test and the improvement</td></tr>' +
        '</table>' +

        '<div class="felic">' +
        '🏅 <b>Congratulations! You have completed the Mission Robots that Solve Problems… and with it the whole Robot ' +
        'Path.</b> Now you know how to identify a problem, brainstorm solutions, design while justifying every part, build a ' +
        'prototype, test it with data, improve it when it fails and communicate the result to your community. You are thinking like ' +
        'an engineer now! 🏆🤖' +
        '</div>' +

        '<h2>📏 Assessment Rubric</h2>' +

        '<table class="rubrica">' +
        '<tr><th>Activity</th><th>Where</th><th>Value</th><th>Grade earned</th><th>Comment</th></tr>' +
        '<tr><td>Copied the contents of this material into their Robotics notebook.</td><td class="lg">Homework</td><td>100</td><td>&nbsp;</td><td>&nbsp;</td></tr>' +
        '<tr><td>Solved the «Test Yourself» section directly on this sheet.</td><td class="lg">Classwork, the day before the exam</td><td>100</td><td>&nbsp;</td><td>&nbsp;</td></tr>' +
        '<tr><td>Handed in the labeled sketch, the team project sheet and the model made of recycled material.</td><td class="lg">Homework, in teams</td><td>100</td><td>&nbsp;</td><td>&nbsp;</td></tr>' +
        '<tr><td>Presented their project to the class in two minutes.</td><td class="lg">Classroom presentation</td><td>100</td><td>&nbsp;</td><td>&nbsp;</td></tr>' +
        '<tr><td>Printed test taken in class.</td><td class="lg">Classroom assessment</td><td>100</td><td>&nbsp;</td><td>&nbsp;</td></tr>' +
        '<tr><td colspan="3" style="text-align:right;font-weight:700;">Final grade average →</td><td colspan="2">&nbsp; %</td></tr>' +
        '</table>' +

        '<p style="font-size:9pt;color:var(--gris);">Add up the total value earned and divide it by five: the result will be your final grade. ' +
        'You will lose points if you do not finish the work, if your handwriting is not readable or if you write with spelling mistakes.</p>',

      /* ═══════════ PÁGINA 7 · HOJA SUELTA DEL DOCENTE ═══════════ */
      p7:
        '<h2>✅ Answer Key — Teacher’s Sheet</h2>' +

        '<p style="font-size:10pt;color:var(--gris);">This sheet is printed <strong>separately</strong>: it is only for the teacher or for guided self-assessment.</p>' +

        '<div class="pauta">' +
        '<div><span class="pt">I. Fill in:</span> 1. danced &nbsp; 2. week &nbsp; 3. wheel &nbsp; 4. rain &nbsp; 5. pulley &nbsp; 6. level &nbsp; 7. 19 &nbsp; 8. 200 &nbsp; 9. minutes &nbsp; 10. voltage</div>' +
        '<div><span class="pt">II. True or False:</span> 1T, 2F, 3T, 4F, 5T, 6F, 7T, 8F, 9T, 10F</div>' +
        '<div><span class="pt">III. Multiple choice:</span> 1c, 2b, 3a, 4b, 5c, 6b, 7d, 8d, 9a, 10c</div>' +
        '<div><span class="pt">IV. Matching:</span> 1. C &nbsp; 2. H &nbsp; 3. E &nbsp; 4. I &nbsp; 5. A &nbsp; 6. G &nbsp; 7. J &nbsp; 8. B &nbsp; 9. F &nbsp; 10. D</div>' +
        '</div>' +

        '<div class="pauta" style="margin-top:10px;">' +
        '<div><span class="pt">Rubric for the design project (20 pts):</span></div>' +
        '<div>① <strong>A well-defined problem (5 pts):</strong> says what is going wrong, who it affects and why it matters, with a measurable success criterion.</div>' +
        '<div>② <strong>Justified sensors and mechanisms (5 pts):</strong> names which sensor measures the signal, which mechanism or actuator carries out the action and which energy source it uses, explaining why each one was chosen.</div>' +
        '<div>③ <strong>A coherent program (5 pts):</strong> writes the main instruction as «if X happens, then do Y» and respects the constraints of cost, materials, time and safety.</div>' +
        '<div>④ <strong>Improvement after the test (5 pts):</strong> describes how the prototype would be tested (what would be measured and how many times) and what would be improved if it fails.</div>' +
        '</div>' +

        '<div class="nota-doc">' +
        '<strong>Note for the teacher:</strong> this study sheet is based on the interactive content of the M.E.T.A.S platform, ' +
        '«Mission Robots that Solve Problems» (Basic Education, Cycles II and III), <strong>stage 6 of 6 and the closing of the ' +
        'Robot Path</strong> in the Robotics area. The approach is still <strong>unplugged robotics</strong>: ' +
        'the engineering design cycle is worked on with paper, cardboard, recycled material and teamwork, so it ' +
        'can be used in classrooms with no computers and no connectivity. The mission brings together everything learned in the earlier stages ' +
        '(sensors, motors and mechanisms, electricity and programming the robot): in the sketch the student has to justify ' +
        'which sensor measures the signal of the problem, which mechanism carries out the action, which energy source is safe and which ' +
        'instruction the program follows. The unplugged activities on page 3 (the labeled sketch, the team project sheet ' +
        'with roles, the model made of recycled material and the two-minute presentation) make up the <strong>final project ' +
        'of the path</strong> and are graded with the four-criteria rubric on this sheet, the same one used by ' +
        'section V of the platform’s critical thinking test. It is worth insisting on two ideas: that ' +
        '<strong>failing the test is part of the process</strong> (you write the fault down, change one thing at a time and ' +
        'test again) and that <strong>you never lower the criterion</strong> to make it look as if the prototype worked. The ' +
        'QR code on the cover leads to the interactive mission, whose Design Workshop walks through the five Honduran ' +
        'projects (coffee, river, school garden, floods and trash) with instant feedback. ' +
        '<em>The Spanish and English versions share the same answer key: Column B keeps the same order in both.</em>' +
        '</div>'
    },

    /* Rótulos sueltos: botón de impresión y pies de página */
    frases: {
      '🖨️ Imprimir la ficha': '🖨️ Print the study sheet',
      '· Ficha Didáctica · Robots que Resuelven Problemas': '· Study Sheet · Robots that Solve Problems',
      '· Ficha Didáctica · Robots que Resuelven Problemas · Hoja del Docente': '· Study Sheet · Robots that Solve Problems · Teacher’s Sheet'
    },

    fragmentos: [
      [/Página (\d+)/g, 'Page $1']
    ]
  };
})();
