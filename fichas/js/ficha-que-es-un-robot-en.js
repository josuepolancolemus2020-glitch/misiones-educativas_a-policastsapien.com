/* ============================================================
   Ficha didáctica «¿Qué es un Robot?» — versión en inglés
   ------------------------------------------------------------
   Misma traducción de autor que la misión (sense → think → act,
   sensors · controller · actuators) y en inglés americano, que es
   el que enseñan las bilingües de Honduras.

   Las 7 páginas se traducen enteras (data-i18n="p1".."p7") para
   que la maquetación impresa no se desarme: cada recuadro cabe
   donde debe y ninguna página queda a medias.

   IMPORTANTE para el docente: la Columna B de los pareados
   conserva EL MISMO ORDEN que en español, así la pauta
   (1E · 2G · 3J · 4B · 5H · 6C · 7A · 8F · 9D · 10I) sigue
   siendo válida en las dos versiones.
   ============================================================ */
(function () {
  'use strict';

  var PIE = '<div class="pag-pie"><span><b>M.E.T.A.S</b> · Study Sheet · What Is a Robot?</span>';

  window.MISION_EN = {

    titulo: 'Study Sheet · Mission: What Is a Robot?',

    html: {

      /* ═══════════ PÁGINA 1 ═══════════ */
      p1:
        '<div class="idline"><span>Name:</span><span class="raya"></span><span>Student No.:</span><span class="raya corta"></span></div>' +
        '<div class="fh">' +
        '<div class="fh-txt">' +
        '<div class="f-badge">📄 Study Sheet: Mission — What Is a Robot?</div>' +
        '<div class="f-meta"><b>Subject:</b> Robotics &nbsp;·&nbsp; <b>Level:</b> Basic Education &nbsp;·&nbsp; <b>Robot Path · Stage 1</b></div>' +
        '<div class="f-meta"><b>Topic:</b> The sense → think → act cycle, the 3 parts of a robot (sensors, controller, actuators), robot vs simple machine vs home appliance, and robots in real life in Honduras (unplugged robotics: no computer needed)</div>' +
        '</div>' +
        '<div class="fh-qr">' +
        '<img src="../img/qr-mision-que-es-un-robot.png" alt="Mission QR code">' +
        '<span>📷 Play the mission on your phone</span>' +
        '</div></div>' +

        '<h2>🎯 Learning Objectives</h2>' +
        '<ol class="objetivos">' +
        '<li>Explain what a <strong>robot</strong> is using the <strong>sense → think → act</strong> cycle.</li>' +
        '<li>Name the <strong>3 parts of a robot</strong>: sensors, controller and actuators.</li>' +
        '<li>Use the <strong>body ↔ robot</strong> comparison: senses, brain and muscles.</li>' +
        '<li>Tell a robot apart from a <strong>simple machine</strong> and from a <strong>home appliance</strong>.</li>' +
        '<li>Choose the <strong>right sensor</strong> for a situation (light, distance, touch, temperature, sound, moisture).</li>' +
        '<li>Recognize robots in real life in <strong>Honduras</strong>: garment factories, farming and medicine.</li>' +
        '</ol>' +

        '<h2>🤖 1. What is a robot?</h2>' +
        '<p>A <strong>robot</strong> is a machine that <strong>SENSES</strong> its surroundings with sensors, ' +
        '<strong>DECIDES</strong> what to do with its controller (following a <strong>program</strong>) and ' +
        '<strong>ACTS</strong> with motors, wheels or arms. That cycle repeats over and over: ' +
        '<strong>sense → think → act</strong>.</p>' +
        '<div class="caja truco">💡 <b>Handy trick:</b> in front of any machine, ask yourself three things: does it sense? does it decide? does it act? Only the machine that does <strong>all three</strong> is a robot.</div>' +

        '<h3>📡🧠💪 Mini-demo: the 3 parts of a robot</h3>' +
        '<div class="ilus">' +
        '<div class="ilus-t">The three parts work as a team, just like your own body</div>' +
        '<div class="celula">' +
        '<div class="cm"><span class="c-emoji">📡</span><b>Sensors</b>The SENSES: they pick up light, sound, distance, touch.</div>' +
        '<div class="cc"><span class="c-emoji">🧠</span><b>Controller</b>The BRAIN: it decides according to its program.</div>' +
        '<div class="cn"><span class="c-emoji">💪</span><b>Actuators</b>The MUSCLES: motors, wheels and arms.</div>' +
        '</div>' +
        '<p style="font-size:9pt;color:var(--gris);margin:8px 0 0;text-align:center;">✅ And everything runs thanks to the <strong>power</strong> in its battery, just like your body with food. 🔋</p>' +
        '</div>',

      /* ═══════════ PÁGINA 2 ═══════════ */
      p2:
        '<h2 style="margin-top:0;">🧩 2. The body ↔ robot comparison</h2>' +
        '<p>When you dodge a ball, your <strong>eyes</strong> see it (receptor), your <strong>brain</strong> decides to move ' +
        'and your <strong>muscles</strong> get you out of the way (effector). A robot does exactly the same with its parts:</p>' +
        '<table>' +
        '<tr><th>Robot part</th><th>In your body</th><th>What does it do?</th></tr>' +
        '<tr><td class="k">📡 Sensors</td><td>Eyes, ears, skin</td><td>They SENSE: light, sound, distance, touch, temperature</td></tr>' +
        '<tr><td class="k">🧠 Controller</td><td>The brain</td><td>It DECIDES according to the instructions in its program</td></tr>' +
        '<tr><td class="k">💪 Actuators</td><td>The muscles</td><td>They ACT: motors, wheels, arms, lights, speakers</td></tr>' +
        '<tr><td class="k">🔋 Power</td><td>Food</td><td>It gives strength to every part (battery or electricity)</td></tr>' +
        '</table>' +
        '<div class="tri">' +
        '<div class="tnuc"><b>📋 The program</b>It is the list of <strong>exact instructions</strong> the robot obeys step by step. With no program, the controller does not know what to decide.</div>' +
        '<div class="torg"><b>🔁 The cycle</b>Sense → think → act, repeated many times per second. Example: «if there is an obstacle, <strong>then</strong> turn».</div>' +
        '</div>' +
        '<div class="caja idea">📖 <b>Key fact:</b> robots <strong>do not think or feel</strong> the way people do: they follow their program, written by people. What looks «smart» in a robot is the work of whoever programmed it.</div>' +

        '<h2>⚖️ 3. Robot, simple machine or home appliance?</h2>' +
        '<table>' +
        '<tr><th>Machine</th><th>Senses?</th><th>Decides?</th><th>Acts?</th><th>Verdict</th></tr>' +
        '<tr><td class="k">🔨 Hammer</td><td>No</td><td>No</td><td>No (you move it)</td><td>Simple machine</td></tr>' +
        '<tr><td class="k">🥤 Blender</td><td>No</td><td>No (you switch it on)</td><td>Yes</td><td>Home appliance</td></tr>' +
        '<tr><td class="k">🤖 Robot vacuum</td><td>Yes: obstacles</td><td>Yes: it picks its route</td><td>Yes: wheels and brushes</td><td>A ROBOT!</td></tr>' +
        '</table>' +
        '<div class="caja regla">🎯 <b>Golden rule:</b> moving is not enough. The blender <strong>acts</strong> but neither senses nor decides on its own; the hammer does not even act on its own. A robot completes <strong>the whole cycle</strong>.</div>',

      /* ═══════════ PÁGINA 3 ═══════════ */
      p3:
        '<h2 style="margin-top:0;">🗺️ 4. Types of robots</h2>' +
        '<table>' +
        '<tr><th>Type</th><th>What is it like?</th><th>Example</th></tr>' +
        '<tr><td class="k">🏭 Industrial</td><td>A fixed arm in the factory</td><td>An arm that sews and cuts in the garment factory</td></tr>' +
        '<tr><td class="k">🛞 Mobile</td><td>It travels on wheels</td><td>Robot vacuum; line-following car</td></tr>' +
        '<tr><td class="k">🚁 Drone</td><td>It flies with propellers</td><td>A drone that inspects the coffee fields</td></tr>' +
        '<tr><td class="k">🦿 Humanoid</td><td>Shaped like a person</td><td>Robots that walk and move their arms</td></tr>' +
        '<tr><td class="k">🦾 Robotic arm</td><td>Very high precision</td><td>Robot-assisted surgery in hospitals</td></tr>' +
        '</table>' +

        '<h2>🇭🇳 5. Robots in real life in Honduras</h2>' +
        '<table>' +
        '<tr><th>Where?</th><th>Which robot works there?</th><th>What does it do?</th></tr>' +
        '<tr><td class="k">🏭 Garment factory</td><td>Robotic arms</td><td>They sew and cut fabric by following their program</td></tr>' +
        '<tr><td class="k">☕ Farming (coffee)</td><td>Drones</td><td>They inspect the coffee fields from the air and spot diseased areas</td></tr>' +
        '<tr><td class="k">🏥 Medicine</td><td>Surgical robots</td><td>They help the doctor with very precise movements</td></tr>' +
        '<tr><td class="k">🏠 Home</td><td>Robot vacuum</td><td>It cleans on its own: it detects obstacles and picks its route</td></tr>' +
        '</table>' +

        '<h2>🎲 6. Unplugged activities (no computer needed)</h2>' +
        '<ul>' +
        '<li><strong>🗣️ The robot partner:</strong> one student is the «robot» and another one is the «programmer». The programmer may only give <strong>exact instructions</strong> («move forward 2 steps», «turn right») to take the robot from one spot in the classroom to another. If the instruction is unclear, the robot stays put! Then they swap roles.</li>' +
        '<li><strong>🗂️ Robot hunters:</strong> make a list of 5 machines in your classroom or home and sort each one: robot or not a robot? Justify it with the three questions: does it sense? does it decide? does it act?</li>' +
        '<li><strong>🎨 The robot of my town:</strong> draw a robot that solves a problem in your community and label with arrows its <strong>sensors</strong>, its <strong>controller</strong> and its <strong>actuators</strong>.</li>' +
        '</ul>' +

        '<div class="caja hn">🇭🇳 <b>Robotics belongs to you too:</b> you do not need a computer to start: robotics is born from <strong>thinking in exact steps</strong>. Whoever learns to give and follow precise instructions is already programming. The future engineers who will look after the coffee, the factories and the hospitals of Honduras can start today… with paper and pencil! 💚</div>',

      /* ═══════════ PÁGINA 4 ═══════════ */
      p4:
        '<h2>✍️ 7. Test Yourself! Activities</h2>' +

        '<h3>I. Fill in the blanks <span class="val">(Value: 10 points each)</span></h3>' +
        '<ol>' +
        '<li>They asked Marvin <span class="linea-resp"></span> it was not a robot, and he said nothing.</li>' +
        '<li>The puppet waved the same way by day and by <span class="linea-resp"></span>.</li>' +
        '<li>The robot’s motors work like the <span class="linea-resp"></span> of your body.</li>' +
        '<li>The robot cycle repeats many times per <span class="linea-resp"></span>.</li>' +
        '<li>Robots follow instructions written by <span class="linea-resp"></span>.</li>' +
        '<li>Only a machine that completes the <span class="linea-resp"></span> parts of the cycle is a robot.</li>' +
        '<li>A mobile robot moves around on <span class="linea-resp"></span>.</li>' +
        '<li>In this mission you learn with logic, paper and <span class="linea-resp"></span>.</li>' +
        '<li>The robot that helps in surgery works with great <span class="linea-resp"></span>.</li>' +
        '<li>Receptor → brain → <span class="linea-resp"></span>, like in your body.</li>' +
        '</ol>' +

        '<h3>II. True or False <span class="val">(Value: 10 points each)</span></h3>' +
        '<ol>' +
        '<li>____ A robot can be shaped like an animal or a little cart.</li>' +
        '<li>____ A machine that only acts is already a robot.</li>' +
        '<li>____ Without written instructions, a robot does not know what to do.</li>' +
        '<li>____ Marvin was able to explain why the puppet was not a robot.</li>' +
        '<li>____ In hospitals there is surgery assisted by robots.</li>' +
        '<li>____ Robots think and feel just like people.</li>' +
        '<li>____ A door that opens on its own when you come near is a simple robot.</li>' +
        '<li>____ The iron that heats up when you plug it in is a robot.</li>' +
        '<li>____ The little cart that follows a line on the floor is a robot.</li>' +
        '<li>____ All robots look like the ones in the movies.</li>' +
        '</ol>',

      /* ═══════════ PÁGINA 5 ═══════════ */
      p5:
        '<h3>III. Multiple choice <span class="val">(Value: 10 points each)</span> — Circle the correct letter.</h3>' +

        '<div class="preg"><div class="preg-q"><span class="preg-n">1</span>What is a robot?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> Any metal machine</span>' +
        '<span class="op"><i>b</i> A toy with lights</span>' +
        '<span class="op"><i>c</i> A machine that senses, decides and acts</span>' +
        '<span class="op"><i>d</i> A computer with a screen</span>' +
        '</div></div>' +

        '<div class="preg"><div class="preg-q"><span class="preg-n">2</span>What is the order of the robot cycle?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> Act → sense → decide</span>' +
        '<span class="op"><i>b</i> Sense → decide → act</span>' +
        '<span class="op"><i>c</i> Decide → act → sense</span>' +
        '<span class="op"><i>d</i> Sense → act → decide</span>' +
        '</div></div>' +

        '<div class="preg"><div class="preg-q"><span class="preg-n">3</span>Why is the puppet at the fair not a robot?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> Because it does not notice anything or decide anything</span>' +
        '<span class="op"><i>b</i> Because it is small</span>' +
        '<span class="op"><i>c</i> Because it is made of plastic</span>' +
        '<span class="op"><i>d</i> Because it has no lights</span>' +
        '</div></div>' +

        '<div class="preg"><div class="preg-q"><span class="preg-n">4</span>Which part of your body is like the robot’s camera?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> The stomach</span>' +
        '<span class="op"><i>b</i> The bones</span>' +
        '<span class="op"><i>c</i> The eyes</span>' +
        '<span class="op"><i>d</i> The nails</span>' +
        '</div></div>' +

        '<div class="preg"><div class="preg-q"><span class="preg-n">5</span>What do robotic arms do in the maquila?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> They think for the workers</span>' +
        '<span class="op"><i>b</i> They sell the clothes</span>' +
        '<span class="op"><i>c</i> They design fashion</span>' +
        '<span class="op"><i>d</i> They sew and cut cloth</span>' +
        '</div></div>' +

        '<div class="preg"><div class="preg-q"><span class="preg-n">6</span>Which robot cleans the house and chooses where to go?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> The blender</span>' +
        '<span class="op"><i>b</i> The robot vacuum</span>' +
        '<span class="op"><i>c</i> The hammer</span>' +
        '<span class="op"><i>d</i> The iron</span>' +
        '</div></div>' +

        '<div class="preg"><div class="preg-q"><span class="preg-n">7</span>What did the puppet at the fair move?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> Its head</span>' +
        '<span class="op"><i>b</i> Its arm</span>' +
        '<span class="op"><i>c</i> Its wheels</span>' +
        '<span class="op"><i>d</i> Its eyes</span>' +
        '</div></div>' +

        '<div class="preg"><div class="preg-q"><span class="preg-n">8</span>Where did you learn the comparison with the body before?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> In the Route of the Body</span>' +
        '<span class="op"><i>b</i> In the Route of the Homeland</span>' +
        '<span class="op"><i>c</i> In the Numbers route</span>' +
        '<span class="op"><i>d</i> Nowhere</span>' +
        '</div></div>' +

        '<div class="preg"><div class="preg-q"><span class="preg-n">9</span>Which one is NOT a type of robot?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> Mobile</span>' +
        '<span class="op"><i>b</i> Industrial</span>' +
        '<span class="op"><i>c</i> Humanoid</span>' +
        '<span class="op"><i>d</i> Blender</span>' +
        '</div></div>' +

        '<div class="preg"><div class="preg-q"><span class="preg-n">10</span>What does the robot do in the first step of its cycle?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> It finds out what is happening around it</span>' +
        '<span class="op"><i>b</i> It moves the wheels</span>' +
        '<span class="op"><i>c</i> It switches off</span>' +
        '<span class="op"><i>d</i> It saves the battery</span>' +
        '</div></div>',

      /* ═══════════ PÁGINA 6 ═══════════
         La Columna B mantiene el orden del original: la pauta no cambia. */
      p6:
        '<h3>IV. Matching <span class="val">(Value: 10 points each)</span> — Write on the line the letter from Column B that matches.</h3>' +
        '<table>' +
        '<tr><th style="width:42%;">Column A</th><th>Column B</th></tr>' +
        '<tr><td>1. ____ Sensor</td><td>A. It flies with propellers over the coffee farm</td></tr>' +
        '<tr><td>2. ____ Controller</td><td>B. It acts when switched on, but does not decide</td></tr>' +
        '<tr><td>3. ____ Actuator</td><td>C. It picks up light, sound or distance</td></tr>' +
        '<tr><td>4. ____ Battery</td><td>D. Learning robotics with no computer or cables</td></tr>' +
        '<tr><td>5. ____ Drone</td><td>E. A motor or wheel that carries out the action</td></tr>' +
        '<tr><td>6. ____ Humanoid</td><td>F. A fixed arm that works in a factory</td></tr>' +
        '<tr><td>7. ____ Simple machine</td><td>G. A robot shaped like a person</td></tr>' +
        '<tr><td>8. ____ Home appliance</td><td>H. It receives the information and chooses what to do</td></tr>' +
        '<tr><td>9. ____ Industrial robot</td><td>I. The robot’s «food»</td></tr>' +
        '<tr><td>10. ____ Unplugged robotics</td><td>J. It does not sense, does not decide and you move it</td></tr>' +
        '</table>' +

        '<div class="felic">🏅 <b>Congratulations! You have completed the Mission «What Is a Robot?»</b> Now you know that a robot senses, thinks and acts; that its sensors are like your senses, its controller like your brain and its actuators like your muscles; and that robots already work in the garment factory, the coffee field and the hospital. Keep moving along the Robot Path! 🤖📡</div>' +

        '<h2>📏 Assessment Rubric</h2>' +
        '<table class="rubrica">' +
        '<tr><th>Activity</th><th>Where</th><th>Value</th><th>Grade earned</th><th>Comments</th></tr>' +
        '<tr><td>Copied the contents of this material into their Robotics notebook.</td><td class="lg">Homework</td><td>100</td><td>&nbsp;</td><td>&nbsp;</td></tr>' +
        '<tr><td>Solved the «Test Yourself» section directly on this study sheet.</td><td class="lg">Classwork, the day before the test</td><td>100</td><td>&nbsp;</td><td>&nbsp;</td></tr>' +
        '<tr><td>Drew the robot of their town labeling sensors, controller and actuators, and played «the robot partner».</td><td class="lg">Homework</td><td>100</td><td>&nbsp;</td><td>&nbsp;</td></tr>' +
        '<tr><td>Printed test taken in class.</td><td class="lg">Classroom assessment</td><td>100</td><td>&nbsp;</td><td>&nbsp;</td></tr>' +
        '<tr><td colspan="3" style="text-align:right;font-weight:700;">Final grade average →</td><td colspan="2">&nbsp; %</td></tr>' +
        '</table>' +
        '<p style="font-size:9pt;color:var(--gris);">Remember that you already learned how to work out an average: add up the total value earned and divide it by four. The result is your final grade. Points are lost for incomplete work, unreadable handwriting or spelling mistakes.</p>',

      /* ═══════════ PÁGINA 7 · HOJA DEL DOCENTE ═══════════ */
      p7:
        '<h2>✅ Answer Key — Teacher’s Sheet</h2>' +
        '<p style="font-size:10pt;color:var(--gris);">This sheet is printed <strong>separately</strong>: it is only for the teacher or for guided self-assessment.</p>' +

        '<div class="pauta">' +
        '<div><span class="pt">I. Fill in the blanks:</span> 1. why &nbsp; 2. night &nbsp; 3. muscles &nbsp; 4. second &nbsp; 5. people &nbsp; 6. three &nbsp; 7. wheels &nbsp; 8. games &nbsp; 9. precision &nbsp; 10. effector</div>' +
        '<div><span class="pt">II. True or False:</span> 1T, 2F, 3T, 4F, 5T, 6F, 7T, 8F, 9T, 10F</div>' +
        '<div><span class="pt">III. Multiple choice:</span> 1c, 2b, 3a, 4c, 5d, 6b, 7b, 8a, 9d, 10a</div>' +
        '<div><span class="pt">IV. Matching:</span> 1C, 2H, 3E, 4I, 5A, 6G, 7J, 8B, 9F, 10D</div>' +
        '</div>' +

        '<div class="nota-doc">' +
        '<strong>Note for the teacher:</strong> this study sheet is based on the interactive content of the M.E.T.A.S platform, ' +
        '«Mission: What Is a Robot?» (Basic Education, Cycles II and III), stage 1 of the Robot Path in the Robotics area. ' +
        'The approach is <strong>unplugged robotics</strong>: every concept (the sense → think → act cycle, sensors, controller, ' +
        'actuators, power and program) is taught with no hardware, using paper, games and logic, so the sheet can be used in ' +
        'classrooms with no computers and no internet. It works as a printed or digital study guide before the final test. ' +
        'It covers every concept assessed on the platform (fill in the blanks, true/false, multiple choice, matching) and the ' +
        'unplugged activities on page 3: the «robot partner» game (giving exact instructions), sorting machines from the ' +
        'classroom or home (robot vs not a robot, using the questions does it sense? does it decide? does it act?) and drawing ' +
        'the robot of their town labeling its three parts. The body ↔ robot comparison (sensors = senses, controller = brain, ' +
        'actuators = muscles) links back to the Body Path (receptor → brain → effector). The interactive mission (QR code on ' +
        'the cover) lets students practice with instant feedback before solving this sheet. ' +
        '<em>The Spanish and English versions share the same answer key: Column B keeps the same order in both.</em>' +
        '</div>'
    },

    /* Rótulos sueltos: botón de impresión y pies de página */
    frases: {
      '🖨️ Imprimir la ficha': '🖨️ Print the study sheet',
      '· Ficha Didáctica · ¿Qué es un Robot?': '· Study Sheet · What Is a Robot?',
      '· Ficha Didáctica · ¿Qué es un Robot? · Hoja del Docente': '· Study Sheet · What Is a Robot? · Teacher’s Sheet'
    },

    fragmentos: [
      [/Página (\d+)/g, 'Page $1']
    ]
  };

  // El pie de las páginas no cambia de estructura; se deja documentado por si
  // alguna ficha futura lo arma distinto.
  void PIE;
})();
