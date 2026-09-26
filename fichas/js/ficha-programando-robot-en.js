/* ============================================================
   Ficha didáctica «Programando un Robot» — versión en inglés
   ------------------------------------------------------------
   Misma traducción de autor que la misión (program · instruction
   · conditional IF…THEN…ELSE · loop · variable · counter ·
   pseudocode · debug · bug · sensor · actuator) y en inglés
   AMERICANO, que es el que enseñan las bilingües de Honduras:
   color, center, «Student No.».

   El lenguaje del simulador SÍ se traduce aquí, porque en la
   ficha es texto impreso y no un identificador que el programa
   compare: AVANZA → FORWARD, GIRA DERECHA → TURN RIGHT,
   ESPERA → WAIT, DETENTE → STOP, SI…ENTONCES…SINO →
   IF…THEN…ELSE, REPITE N VECES → REPEAT N TIMES.

   Las 7 páginas se traducen enteras (data-i18n="p1".."p7") para
   que la maquetación impresa no se desarme.

   IMPORTANTE para el docente: la Columna B de los pareados
   conserva EL MISMO ORDEN que en español, así la pauta
   (1D · 2G · 3A · 4I · 5B · 6J · 7C · 8E · 9F · 10H) sigue
   siendo válida en las dos versiones. Lo mismo vale para el
   completar, el V/F y la selección múltiple.
   ============================================================ */
(function () {
  'use strict';

  window.MISION_EN = {

    titulo: 'Study Sheet · Mission: Programming a Robot',

    html: {

      /* ═══════════ PÁGINA 1 ═══════════ */
      p1:
        '<div class="idline"><span>Name:</span><span class="raya"></span><span>Student No.:</span><span class="raya corta"></span></div>' +

        '<div class="fh">' +
        '<div class="fh-txt">' +
        '<div class="f-badge">📄 Study Sheet: Mission — Programming a Robot</div>' +
        '<div class="f-meta"><b>Subject:</b> Robotics &nbsp;·&nbsp; <b>Level:</b> Basic Education &nbsp;·&nbsp; <b>Robot Path · Stage 5</b></div>' +
        '<div class="f-meta"><b>Topic:</b> The cycle read the sensors → decide → move the actuators → repeat; movement and waiting instructions; conditionals with sensors; loops; variables; pseudocode and debugging (unplugged robotics: no computer needed)</div>' +
        '</div>' +
        '<div class="fh-qr">' +
        '<img src="img/qr-mision-programando-robot.png" alt="Mission QR code">' +
        '<span>📷 Play the mission on your phone</span>' +
        '</div>' +
        '</div>' +

        '<h2>🎯 Learning Objectives</h2>' +

        '<ol class="objetivos">' +
        '<li>Explain the <strong>robot cycle</strong>: read the sensors → decide → move the actuators → repeat.</li>' +
        '<li>Use the <strong>movement instructions</strong> (forward, turn) and the <strong>waiting</strong> one.</li>' +
        '<li>Write <strong>conditionals with sensors</strong>: IF… THEN… ELSE…</li>' +
        '<li>Use <strong>loops</strong> («repeat N times», «repeat until…», «repeat while…»).</li>' +
        '<li>Use <strong>variables</strong> to count (turns, objects collected).</li>' +
        '<li>Write the program in <strong>pseudocode</strong> and <strong>debug</strong> it step by step.</li>' +
        '</ol>' +

        '<h2>🔁 1. The robot cycle: a loop that never stops</h2>' +

        '<p>For as long as a robot is switched on it repeats <strong>the same thing over and over</strong>: it <strong>reads its sensors</strong>, ' +
        'it <strong>decides</strong> with its program, it <strong>moves its actuators</strong> and it <strong>starts again</strong>. ' +
        'That cycle is an <strong>infinite loop</strong> that repeats many times per second.</p>' +

        '<div class="caja truco">💡 <b>Trick:</b> faced with any robot program, ask yourself three things: what does it <strong>read</strong>? ' +
        'what does it <strong>decide</strong>? and what does it <strong>do</strong>? If any of them is missing, the robot is going to fail.</div>' +

        '<h3>📡🧠⚙️ Mini-demonstration: the three steps of the cycle</h3>' +

        '<div class="ilus">' +
        '<div class="ilus-t">The program joins the three steps together and then repeats them</div>' +
        '<div class="celula">' +
        '<div class="cm"><span class="c-emoji">📡</span><b>1. Read the sensors</b>Is there a wall ahead? Can I see the black line? Is the soil dry?</div>' +
        '<div class="cc"><span class="c-emoji">🧠</span><b>2. Decide</b>IF this happens, THEN do that, ELSE do the other thing.</div>' +
        '<div class="cn"><span class="c-emoji">⚙️</span><b>3. Move the actuators</b>Go forward, turn, pick things up, open the water.</div>' +
        '</div>' +
        '<p style="font-size:9pt;color:var(--gris);margin:8px 0 0;text-align:center;">🔄 And back to step 1: <strong>repeating</strong> is the invisible fourth step of the cycle.</p>' +
        '</div>' +

        '<h2 style="margin-top:0;">👣 2. The instructions of the program</h2>' +

        '<p>The program is built out of <strong>exact instructions</strong>, one per line. These are the ones the simulator robot uses:</p>',

      /* ═══════════ PÁGINA 2 ═══════════ */
      p2:
        '<table>' +
        '<tr><th>Instruction</th><th>What does it do?</th><th>Common mistake</th></tr>' +
        '<tr><td class="k">👣 FORWARD</td><td>It moves the robot ONE square in the direction it is facing</td><td>Miscounting the squares</td></tr>' +
        '<tr><td class="k">↪️ TURN RIGHT</td><td>It changes the direction; it does NOT change square</td><td>Believing it also moves forward</td></tr>' +
        '<tr><td class="k">↩️ TURN LEFT</td><td>It changes the direction the other way</td><td>Turning to the wrong side</td></tr>' +
        '<tr><td class="k">⏳ WAIT</td><td>It lets time go by without moving</td><td>Forgetting it when a signal has to be waited for</td></tr>' +
        '<tr><td class="k">🎯 STOP</td><td>The final instruction: the robot stays still on the goal</td><td>Forgetting it: the robot goes straight past</td></tr>' +
        '</table>' +

        '<div class="caja idea">📖 <b>Key fact:</b> turning four times in a row leaves the robot <strong>exactly where it was</strong>, ' +
        'only dizzy. <strong>Turning is not moving forward.</strong></div>' +

        '<h2>❓ 3. Conditionals with sensors</h2>' +

        '<p>A <strong>conditional</strong> is the <strong>IF… THEN… ELSE…</strong> block. The robot <strong>reads a sensor</strong> ' +
        'and chooses one of the two branches. That way the same program still works even when things move around:</p>' +

        '<div class="pseudo"># Wall (obstacle) sensor\n' +
        '<b>IF</b> there is a wall ahead <b>THEN</b> TURN RIGHT\n' +
        '<b>ELSE</b> FORWARD\n' +
        '\n' +
        '# Line sensor (floor color)\n' +
        '<b>IF</b> there is a black line ahead <b>THEN</b> FORWARD\n' +
        '<b>ELSE</b> TURN RIGHT</div>' +

        '<div class="tri">' +
        '<div class="tnuc"><b>🧱 Wall / obstacle sensor</b>It looks at the square <strong>ahead</strong>: if there is a crate or the edge of the schoolyard, it answers YES. It is used to dodge without crashing.</div>' +
        '<div class="torg"><b>⬛ Line / color sensor</b>It tells the <strong>black</strong> of the painted line apart from the light floor. It is used to follow the path down the hallway.</div>' +
        '</div>' +

        '<div class="caja regla">🎯 <b>Golden rule:</b> every conditional must also say what to do when the answer is <strong>NO</strong> ' +
        '(the ELSE branch). If it is missing, the robot is left «thinking» or it does something unexpected.</div>' +

        '<h2 style="margin-top:0;">🔄 4. Loops and 📦 variables</h2>' +

        '<table>' +
        '<tr><th>Block</th><th>What is it for?</th><th>Example in the robot</th></tr>' +
        '<tr><td class="k">🔄 REPEAT N TIMES</td><td>Doing the same thing an exact number of times</td><td>REPEAT 6 TIMES: FORWARD</td></tr>' +
        '<tr><td class="k">🔄 REPEAT UNTIL…</td><td>Repeating until something comes true</td><td>REPEAT UNTIL you reach the goal</td></tr>' +
        '<tr><td class="k">🔄 REPEAT WHILE…</td><td>Repeating while the sensor keeps saying yes</td><td>REPEAT WHILE there is no obstacle: FORWARD</td></tr>' +
        '<tr><td class="k">📦 VARIABLE</td><td>Storing a number under a name</td><td>objects = objects + 1</td></tr>' +
        '</table>',

      /* ═══════════ PÁGINA 3 ═══════════ */
      p3:
        '<div class="caja idea">🐞 <b>Watch out for the infinite loop!</b> Every loop needs a <strong>way to end</strong>. ' +
        '«REPEAT FOREVER: FORWARD» sends the robot straight off the schoolyard.</div>' +

        '<h2>📝 5. Pseudocode and 🐞 debugging</h2>' +

        '<p><strong>Pseudocode</strong> is the program written in <strong>plain, numbered language</strong>, before loading it ' +
        'into the robot. <strong>Debugging</strong> is testing the program step by step, finding the wrong instruction (the <strong>bug</strong>) ' +
        'and fixing it. Remember: <strong>the robot does what the program says, not what you meant to say.</strong></p>' +

        '<div class="pseudo"># Watering robot for the school garden 🌱\n' +
        '1. plants = 0\n' +
        '2. <b>REPEAT</b> 10 <b>TIMES</b>:\n' +
        '3.    FORWARD\n' +
        '4.    <b>IF</b> the moisture sensor says «dry soil» <b>THEN</b> open the valve\n' +
        '5.    <b>ELSE</b> keep going\n' +
        '6.    plants = plants + 1\n' +
        '7. STOP and report how many plants it watered</div>' +

        '<h2>🎲 6. Unplugged activities (no computer)</h2>' +

        '<ul>' +
        '<li><strong>🧵 The masking-tape maze:</strong> with masking tape, mark a 5×5 grid on the classroom floor ' +
        'and lay down a <strong>black line</strong> and a few <strong>crates</strong> (boxes or backpacks). One classmate plays the ' +
        '<strong>robot</strong> (obeying nothing but exact instructions!) and another one the <strong>programmer</strong>. Then they swap roles.</li>' +
        '<li><strong>🃏 Arrow cards:</strong> cut out cards with ▲ FORWARD, ↪ TURN RIGHT, ↩ TURN LEFT, ⏳ WAIT and 🎯 STOP. ' +
        'Build the <strong>whole program on the table before running it</strong>: the «robot» only moves when the ' +
        'programmer holds up one card at a time, in order.</li>' +
        '<li><strong>✏️ Trace the route on paper:</strong> use the grid below. Mark with an X the square the robot ends up on ' +
        'after each instruction and write the coordinate (A1…E5). Compare it with what the human «robot» did: ' +
        'the first difference is the <strong>bug</strong>.</li>' +
        '<li><strong>💧 The watering robot’s pseudocode:</strong> write out in your notebook, numbered, the program of a robot that ' +
        'waters the school garden. It must carry a <strong>loop</strong>, a <strong>conditional with a sensor</strong>, a counter ' +
        '<strong>variable</strong> and end with <strong>STOP</strong>.</li>' +
        '</ul>' +

        '<div class="ilus">' +
        '<div class="ilus-t">Paper grid for tracing the route (📦 = crate · gray = black line)</div>' +
        '<table class="malla">' +
        '<tr><td class="cab"></td><td class="cab">A</td><td class="cab">B</td><td class="cab">C</td><td class="cab">D</td><td class="cab">E</td></tr>' +
        '<tr><td class="cab">1</td><td></td><td></td><td class="lin"></td><td></td><td>🎯</td></tr>' +
        '<tr><td class="cab">2</td><td class="obst">📦</td><td></td><td class="lin"></td><td class="obst">📦</td><td></td></tr>' +
        '<tr><td class="cab">3</td><td></td><td class="lin"></td><td class="lin"></td><td></td><td></td></tr>' +
        '<tr><td class="cab">4</td><td></td><td class="obst">📦</td><td></td><td class="obst">📦</td><td></td></tr>' +
        '<tr><td class="cab">5</td><td>🤖</td><td></td><td></td><td></td><td></td></tr>' +
        '</table>' +
        '<p style="font-size:9pt;color:var(--gris);margin:6px 0 0;text-align:center;">The robot 🤖 starts on A5 facing North. Which program takes it to the goal 🎯 on E1?</p>' +
        '</div>',

      /* ═══════════ PÁGINA 4 ═══════════ */
      p4:
        '<div class="caja hn">🇭🇳 <b>Robotics belongs to you too:</b> a robot that <strong>follows the hallway line</strong> at ' +
        'school, another one that <strong>picks up the trash in the schoolyard</strong> and another one that <strong>waters the school garden</strong> are programmed ' +
        'in exactly the same way: sensors, conditionals, loops and variables. You do not need a computer to start: you need ' +
        '<strong>to think in exact steps</strong>. 💚</div>' +

        '<h2>✍️ 7. Test Yourself! Activities</h2>' +

        '<h3>I. Fill in the blanks <span class="val">(Value: 10 points each)</span></h3>' +

        '<ol>' +
        '<li>In the story, the robot crashed on the <span class="linea-resp"></span> step.</li>' +
        '<li>The robot was useless for the <span class="linea-resp"></span> the next day.</li>' +
        '<li>To go from A5 to A1 in a straight line, the robot needs <span class="linea-resp"></span> FORWARD instructions.</li>' +
        '<li>The watering robot reads the <span class="linea-resp"></span> sensor to know whether the soil is dry.</li>' +
        '<li>If the soil is dry, the watering robot opens the <span class="linea-resp"></span>.</li>' +
        '<li>The color sensor tells the <span class="linea-resp"></span> line apart from the light floor.</li>' +
        '<li>In the notebook, each written step goes on its own line and is <span class="linea-resp"></span>.</li>' +
        '<li>The robot’s cycle keeps going as long as it has <span class="linea-resp"></span>.</li>' +
        '<li>TURN changes the robot’s direction, but it does not move it to another <span class="linea-resp"></span>.</li>' +
        '<li>To count bottles, the robot writes objects = objects + <span class="linea-resp"></span>.</li>' +
        '</ol>' +

        '<h3>II. True or False <span class="val">(Value: 10 points each)</span></h3>' +

        '<ol>' +
        '<li>____ When the robot crashes, the mistake is almost always in the program and not in the machine.</li>' +
        '<li>____ The robot guesses what the programmer meant to say.</li>' +
        '<li>____ A program with sensors still works if the obstacles are moved around.</li>' +
        '<li>____ Written steps are fine even if another person has to ask you what you meant.</li>' +
        '<li>____ In the watering robot’s written steps, the plant count starts at zero.</li>' +
        '<li>____ The motors and wheels are the ones that read the sensors.</li>' +
        '<li>____ The robot moves toward the way it is facing.</li>' +
        '<li>____ The simulator robot can move diagonally.</li>' +
        '<li>____ In the simulator, the robot shows ✔ when the sensor answers yes.</li>' +
        '<li>____ A robot with a full battery no longer needs a program.</li>' +
        '</ol>' +

        '<h3>III. Multiple choice <span class="val">(Value: 10 points each)</span> — Circle the correct letter.</h3>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">1</span>The robot has to move forward seven times in a row. What is best to write?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> Seven sensors</span>' +
        '<span class="op"><i>b</i> FORWARD just once</span>' +
        '<span class="op"><i>c</i> REPEAT 7 TIMES: FORWARD</span>' +
        '<span class="op"><i>d</i> TURN seven times</span>' +
        '</div>' +
        '</div>',

      /* ═══════════ PÁGINA 5 ═══════════ */
      p5:
        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">2</span>What is the first step of a robot’s cycle?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> Reading its sensors</span>' +
        '<span class="op"><i>b</i> Moving the wheels</span>' +
        '<span class="op"><i>c</i> Switching off</span>' +
        '<span class="op"><i>d</i> Erasing the program</span>' +
        '</div>' +
        '</div>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">3</span>There is a crate right ahead. With «IF there is a wall ahead THEN TURN RIGHT, ELSE FORWARD», what does the robot do?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> It moves forward and crashes</span>' +
        '<span class="op"><i>b</i> It jumps over the crate</span>' +
        '<span class="op"><i>c</i> It stops forever</span>' +
        '<span class="op"><i>d</i> It turns without touching the crate</span>' +
        '</div>' +
        '</div>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">4</span>When you look for the mistake, how much should you change in each test?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> The whole program</span>' +
        '<span class="op"><i>b</i> One single instruction</span>' +
        '<span class="op"><i>c</i> Nothing</span>' +
        '<span class="op"><i>d</i> The robot</span>' +
        '</div>' +
        '</div>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">5</span>In the watering robot’s steps, what does the robot do if the soil is NOT dry?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> It waters the plant</span>' +
        '<span class="op"><i>b</i> It switches off</span>' +
        '<span class="op"><i>c</i> It continues on its way</span>' +
        '<span class="op"><i>d</i> It goes back to the start</span>' +
        '</div>' +
        '</div>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">6</span>A line follower with «REPEAT FOREVER» reaches the goal. What happens?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> It goes straight past and off the table</span>' +
        '<span class="op"><i>b</i> It stops by itself</span>' +
        '<span class="op"><i>c</i> It goes back to the start</span>' +
        '<span class="op"><i>d</i> It switches off</span>' +
        '</div>' +
        '</div>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">7</span>In the story of the robot that crashed, what was the mistake?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> The order was badly written</span>' +
        '<span class="op"><i>b</i> It looked just once and went on blindly</span>' +
        '<span class="op"><i>c</i> The battery was flat</span>' +
        '<span class="op"><i>d</i> The sensor was backwards</span>' +
        '</div>' +
        '</div>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">8</span>With «REPEAT WHILE there is no obstacle: FORWARD», when does the robot stop moving forward?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> Never</span>' +
        '<span class="op"><i>b</i> On the second step</span>' +
        '<span class="op"><i>c</i> When it runs out of paper</span>' +
        '<span class="op"><i>d</i> When something appears ahead</span>' +
        '</div>' +
        '</div>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">9</span>The robot has to wait for the teacher’s signal before leaving. Which instruction goes first?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> FORWARD</span>' +
        '<span class="op"><i>b</i> WAIT</span>' +
        '<span class="op"><i>c</i> STOP</span>' +
        '<span class="op"><i>d</i> TURN LEFT</span>' +
        '</div>' +
        '</div>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">10</span>The robot is facing North and gets TURN RIGHT. Which way is it facing now?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> South</span>' +
        '<span class="op"><i>b</i> West</span>' +
        '<span class="op"><i>c</i> East</span>' +
        '<span class="op"><i>d</i> North</span>' +
        '</div>' +
        '</div>',

      /* ═══════════ PÁGINA 6 ═══════════ */
      p6:
        '<h3>IV. Matching <span class="val">(Value: 10 points each)</span> — Write on the line the letter from Column B that matches.</h3>' +

        '<table>' +
        '<tr><th style="width:40%;">Column A</th><th>Column B</th></tr>' +
        '<tr><td>1. ____ Program</td><td>A. The steps in plain language, before loading them into the robot</td></tr>' +
        '<tr><td>2. ____ Loop</td><td>B. Motor or wheel that carries out the order</td></tr>' +
        '<tr><td>3. ____ Branch</td><td>C. List of exact instructions the robot carries out step by step</td></tr>' +
        '<tr><td>4. ____ Variable</td><td>D. A number that goes up every time the robot picks something up</td></tr>' +
        '<tr><td>5. ____ Pseudocode</td><td>E. Each of the two paths of an IF… ELSE</td></tr>' +
        '<tr><td>6. ____ Debug</td><td>F. Final instruction: the robot stays still on the goal</td></tr>' +
        '<tr><td>7. ____ Bug</td><td>G. Find and fix the mistakes in the program</td></tr>' +
        '<tr><td>8. ____ Actuator</td><td>H. Repeats a block of instructions several times</td></tr>' +
        '<tr><td>9. ____ STOP</td><td>I. A labeled little box where a number is kept</td></tr>' +
        '<tr><td>10. ____ Counter</td><td>J. A wrong or out-of-order instruction that makes the robot fail</td></tr>' +
        '</table>' +

        '<div class="felic">' +
        '🏅 <b>Congratulations! You have completed the Mission Programming a Robot.</b> Now you know that a robot repeats the cycle ' +
        'read the sensors → decide → move the actuators → repeat; that conditionals let it decide on its own, that loops ' +
        'save it instructions and that variables are what it counts with; and that when something goes wrong, the mistake is almost always ' +
        'in the program: it has to be debugged. Keep going along the Robot Path! 🤖🕹️' +
        '</div>' +

        '<h2>📏 Assessment Rubric</h2>' +

        '<table class="rubrica">' +
        '<tr><th>Activity</th><th>Where</th><th>Value</th><th>Grade earned</th><th>Comment</th></tr>' +
        '<tr><td>Copied the contents of this material into their Robotics notebook.</td><td class="lg">Homework</td><td>100</td><td>&nbsp;</td><td>&nbsp;</td></tr>' +
        '<tr><td>Solved the «Test Yourself» section directly on this sheet.</td><td class="lg">Classwork, the day before the exam</td><td>100</td><td>&nbsp;</td><td>&nbsp;</td></tr>' +
        '<tr><td>Played the masking-tape maze with the arrow cards, traced the route on the grid and wrote the watering robot’s pseudocode.</td><td class="lg">Homework</td><td>100</td><td>&nbsp;</td><td>&nbsp;</td></tr>' +
        '<tr><td>Printed test taken in class.</td><td class="lg">Classroom assessment</td><td>100</td><td>&nbsp;</td><td>&nbsp;</td></tr>' +
        '<tr><td colspan="3" style="text-align:right;font-weight:700;">Final grade average →</td><td colspan="2">&nbsp; %</td></tr>' +
        '</table>' +

        '<p style="font-size:9pt;color:var(--gris);">Remember that you have already learned how to work out an average: add up the total value earned and divide it by four. ' +
        'The result will be your final grade. You will lose points if you do not finish the work, if your handwriting is not readable or if you write with spelling mistakes.</p>',

      /* ═══════════ PÁGINA 7 · HOJA SUELTA DEL DOCENTE ═══════════ */
      p7:
        '<h2>✅ Answer Key — Teacher’s Sheet</h2>' +

        '<p style="font-size:10pt;color:var(--gris);">This sheet is printed <strong>separately</strong>: it is only for the teacher or for guided self-assessment.</p>' +

        '<div class="pauta">' +
        '<div><span class="pt">I. Fill in:</span> 1. third &nbsp; 2. fair &nbsp; 3. four &nbsp; 4. moisture &nbsp; 5. valve &nbsp; 6. black &nbsp; 7. numbered &nbsp; 8. battery &nbsp; 9. square &nbsp; 10. 1</div>' +
        '<div><span class="pt">II. True or False:</span> 1T, 2F, 3T, 4F, 5T, 6F, 7T, 8F, 9T, 10F</div>' +
        '<div><span class="pt">III. Multiple choice:</span> 1c, 2a, 3d, 4b, 5c, 6a, 7b, 8d, 9b, 10c</div>' +
        '<div><span class="pt">IV. Matching:</span> 1C, 2H, 3E, 4I, 5A, 6G, 7J, 8B, 9F, 10D</div>' +
        '<div><span class="pt">Grid on page 3 (one valid solution):</span> from A5 facing North — ' +
        '1) IF THERE IS A WALL AHEAD → TURN RIGHT, ELSE → FORWARD · 2) the same block · 3) the same block (here the sensor detects the crate on A2 and it turns East) · ' +
        '4) IF THERE IS A LINE → FORWARD, ELSE → TURN RIGHT · 5) the same block · 6) IF THERE IS A LINE → FORWARD, ELSE → TURN LEFT · ' +
        '7) and 8) the same block (it goes up the line on C2 and C1) · 9) IF THERE IS A LINE → FORWARD, ELSE → TURN RIGHT · 10) FORWARD · 11) FORWARD · 12) STOP on E1. ' +
        'Any program that reaches E1 without stepping on the crates 📦 is accepted.</div>' +
        '</div>' +

        '<div class="nota-doc">' +
        '<strong>Note for the teacher:</strong> this study sheet is based on the interactive content of the M.E.T.A.S platform, ' +
        '«Mission Programming a Robot» (Basic Education, Cycles II and III), stage 5 of the Robot Path in the ' +
        'Robotics area. It is the mission that <strong>brings the Code Path and the Robot Path together</strong>: everything learned ' +
        'about instructions, conditionals, loops and variables is now applied to a robot that <strong>reads sensors</strong> ' +
        '(a wall/obstacle one and a line/color one). The approach is still <strong>unplugged robotics</strong>: the ' +
        'concepts are worked on with paper, masking tape, arrow cards and logic, so the sheet can be used ' +
        'in classrooms with no computers and no connectivity. The activities on page 3 (the masking-tape maze with a classmate ' +
        'playing the robot, arrow cards to «program» them, tracing the route on the paper grid and ' +
        'writing the watering robot’s pseudocode) are the heart of the lesson: they give the physical experience that ' +
        '<strong>the robot does what the program says, not what you meant to say</strong>, and that debugging means comparing ' +
        'step by step what was planned against what actually happened. The interactive mission (QR code on the cover) includes a ' +
        '<strong>grid simulator with 6 levels</strong> where the student builds the program out of blocks and watches the ' +
        'robot run it, with instant feedback on every sensor reading. It can be used as a printed or digital study guide ' +
        'before the final assessment, and it covers every concept assessed on the platform ' +
        '(fill in the blank, true/false, multiple choice and matching). ' +
        '<em>The Spanish and English versions share the same answer key: Column B keeps the same order in both.</em>' +
        '</div>'
    },

    /* Rótulos sueltos: botón de impresión y pies de página */
    frases: {
      '🖨️ Imprimir la ficha': '🖨️ Print the study sheet',
      '· Ficha Didáctica · Programando un Robot': '· Study Sheet · Programming a Robot',
      '· Ficha Didáctica · Programando un Robot · Hoja del Docente': '· Study Sheet · Programming a Robot · Teacher’s Sheet'
    },

    fragmentos: [
      [/Página (\d+)/g, 'Page $1']
    ]
  };
})();
