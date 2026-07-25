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
        '<li>A robot senses, thinks and <span class="linea-resp"></span>.</li>' +
        '<li>Sensors are the <span class="linea-resp"></span> of the robot.</li>' +
        '<li>The controller works like the <span class="linea-resp"></span> of the body.</li>' +
        '<li>Actuators work like the <span class="linea-resp"></span> of the body.</li>' +
        '<li>The robot follows the instructions in its <span class="linea-resp"></span>.</li>' +
        '<li>The <span class="linea-resp"></span> is a flying robot that inspects crops.</li>' +
        '<li>The robot gets its power from the <span class="linea-resp"></span>.</li>' +
        '<li>The hammer is not a robot: it is a <span class="linea-resp"></span> machine.</li>' +
        '<li>The robot’s camera is an example of a <span class="linea-resp"></span>.</li>' +
        '<li>The robot cycle is: sense → <span class="linea-resp"></span> → act.</li>' +
        '</ol>' +

        '<h3>II. True or False <span class="val">(Value: 10 points each)</span></h3>' +
        '<ol>' +
        '<li>____ A robot senses, thinks and acts.</li>' +
        '<li>____ The blender is a robot because it moves.</li>' +
        '<li>____ Sensors are the «senses» of the robot.</li>' +
        '<li>____ The robot’s controller works like the brain.</li>' +
        '<li>____ Actuators work like the robot’s senses.</li>' +
        '<li>____ Robots think and feel like people.</li>' +
        '<li>____ A drone can inspect coffee fields from the air.</li>' +
        '<li>____ The hammer has sensors and a controller.</li>' +
        '<li>____ In the garment factories there are robotic arms that sew and cut.</li>' +
        '<li>____ The robot cycle is: act → think → sense.</li>' +
        '</ol>',

      /* ═══════════ PÁGINA 5 ═══════════ */
      p5:
        '<h3>III. Multiple choice <span class="val">(Value: 10 points each)</span> — Circle the correct letter.</h3>' +

        '<div class="preg"><div class="preg-q"><span class="preg-n">1</span>What is a robot?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> any metal machine</span>' +
        '<span class="op"><i>b</i> a machine that senses, thinks and acts</span>' +
        '<span class="op"><i>c</i> a toy with lights</span>' +
        '<span class="op"><i>d</i> a computer with a screen</span>' +
        '</div></div>' +

        '<div class="preg"><div class="preg-q"><span class="preg-n">2</span>Which part of the robot works like its «senses»?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> the actuators</span>' +
        '<span class="op"><i>b</i> the battery</span>' +
        '<span class="op"><i>c</i> the sensors</span>' +
        '<span class="op"><i>d</i> the wheels</span>' +
        '</div></div>' +

        '<div class="preg"><div class="preg-q"><span class="preg-n">3</span>Which of these machines is a robot?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> the hammer</span>' +
        '<span class="op"><i>b</i> the blender</span>' +
        '<span class="op"><i>c</i> the bicycle</span>' +
        '<span class="op"><i>d</i> the vacuum that detects obstacles and picks its own route</span>' +
        '</div></div>' +

        '<div class="preg"><div class="preg-q"><span class="preg-n">4</span>Which part of the robot decides what to do?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> the controller</span>' +
        '<span class="op"><i>b</i> the motor</span>' +
        '<span class="op"><i>c</i> the speaker</span>' +
        '<span class="op"><i>d</i> the wheel</span>' +
        '</div></div>' +

        '<div class="preg"><div class="preg-q"><span class="preg-n">5</span>Which part of the robot are its «muscles»?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> the sensors</span>' +
        '<span class="op"><i>b</i> the actuators</span>' +
        '<span class="op"><i>c</i> the program</span>' +
        '<span class="op"><i>d</i> the antenna</span>' +
        '</div></div>' +

        '<div class="preg"><div class="preg-q"><span class="preg-n">6</span>What is the correct order of the robot cycle?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> act → sense → think</span>' +
        '<span class="op"><i>b</i> think → act → sense</span>' +
        '<span class="op"><i>c</i> sense → think → act</span>' +
        '<span class="op"><i>d</i> sense → act → think</span>' +
        '</div></div>' +

        '<div class="preg"><div class="preg-q"><span class="preg-n">7</span>Why is the blender NOT a robot?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> it acts but neither senses nor decides on its own</span>' +
        '<span class="op"><i>b</i> because it does not spin</span>' +
        '<span class="op"><i>c</i> because it belongs in the kitchen</span>' +
        '<span class="op"><i>d</i> because it uses electricity</span>' +
        '</div></div>' +

        '<div class="preg"><div class="preg-q"><span class="preg-n">8</span>Which sensor does a robot need in order to stop before an obstacle?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> temperature</span>' +
        '<span class="op"><i>b</i> sound</span>' +
        '<span class="op"><i>c</i> moisture</span>' +
        '<span class="op"><i>d</i> distance</span>' +
        '</div></div>' +

        '<div class="preg"><div class="preg-q"><span class="preg-n">9</span>Which robot inspects the coffee fields in Honduras?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> the humanoid</span>' +
        '<span class="op"><i>b</i> the drone</span>' +
        '<span class="op"><i>c</i> the robot vacuum</span>' +
        '<span class="op"><i>d</i> the surgical robot</span>' +
        '</div></div>' +

        '<div class="preg"><div class="preg-q"><span class="preg-n">10</span>How do robots «think»?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> just like people</span>' +
        '<span class="op"><i>b</i> they guess what to do</span>' +
        '<span class="op"><i>c</i> they follow the instructions in their program</span>' +
        '<span class="op"><i>d</i> they dream the answers</span>' +
        '</div></div>',

      /* ═══════════ PÁGINA 6 ═══════════
         La Columna B mantiene el orden del original: la pauta no cambia. */
      p6:
        '<h3>IV. Matching <span class="val">(Value: 10 points each)</span> — Write on the line the letter from Column B that matches.</h3>' +
        '<table>' +
        '<tr><th style="width:42%;">Column A</th><th>Column B</th></tr>' +
        '<tr><td>1. ____ Robot</td><td>A. Flying robot that inspects crops from the air</td></tr>' +
        '<tr><td>2. ____ Sensor</td><td>B. Motor, wheel or arm that carries out the action</td></tr>' +
        '<tr><td>3. ____ Controller</td><td>C. Battery or electricity that keeps the robot running</td></tr>' +
        '<tr><td>4. ____ Actuator</td><td>D. It acts when switched on, but does not decide on its own</td></tr>' +
        '<tr><td>5. ____ Program</td><td>E. Machine that senses, thinks and acts</td></tr>' +
        '<tr><td>6. ____ Power</td><td>F. Tool that neither senses nor decides (hammer)</td></tr>' +
        '<tr><td>7. ____ Drone</td><td>G. Part that picks up light, sound, distance or temperature</td></tr>' +
        '<tr><td>8. ____ Simple machine</td><td>H. List of exact step-by-step instructions</td></tr>' +
        '<tr><td>9. ____ Home appliance</td><td>I. It cleans on its own: it detects obstacles and picks its route</td></tr>' +
        '<tr><td>10. ____ Robot vacuum</td><td>J. The «brain» that decides according to the program</td></tr>' +
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
        '<div><span class="pt">I. Fill in the blanks:</span> 1. acts &nbsp; 2. senses &nbsp; 3. brain &nbsp; 4. muscles &nbsp; 5. program &nbsp; 6. drone &nbsp; 7. battery &nbsp; 8. simple &nbsp; 9. sensor &nbsp; 10. think</div>' +
        '<div><span class="pt">II. True or False:</span> 1T, 2F, 3T, 4T, 5F, 6F, 7T, 8F, 9T, 10F</div>' +
        '<div><span class="pt">III. Multiple choice:</span> 1b, 2c, 3d, 4a, 5b, 6c, 7a, 8d, 9b, 10c</div>' +
        '<div><span class="pt">IV. Matching:</span> 1E, 2G, 3J, 4B, 5H, 6C, 7A, 8F, 9D, 10I</div>' +
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
