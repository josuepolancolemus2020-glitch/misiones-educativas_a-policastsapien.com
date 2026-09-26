/* ============================================================
   Ficha didáctica «Condicionales: el Robot Decide» — en inglés
   ------------------------------------------------------------
   Misma traducción de autor que la misión (conditional ·
   condition · IF…THEN…ELSE · THEN branch · ELSE branch · sensor
   · true/false · chained · bug) y en inglés AMERICANO, que es el
   que enseñan las bilingües de Honduras: color, center,
   «Student No.».

   El lenguaje del simulador SÍ se traduce aquí en el texto,
   porque en la ficha es papel y nadie compara nada: AVANZA →
   FORWARD, GIRA DERECHA → TURN RIGHT, ESPERA → WAIT, ENTREGA →
   DELIVER, SI…ENTONCES…SINO → IF…THEN…ELSE.

   Las 7 páginas se traducen enteras (data-i18n="p1".."p7") para
   que la maquetación impresa no se desarme.

   IMPORTANTE para el docente: la Columna B de los pareados
   conserva EL MISMO ORDEN que en español, así la pauta
   (1G · 2A · 3E · 4I · 5C · 6H · 7J · 8D · 9B · 10F) sigue
   siendo válida en las dos versiones. Lo mismo vale para el
   completar, el V/F y la selección múltiple.
   ============================================================ */
(function () {
  'use strict';

  window.MISION_EN = {

    titulo: 'Study Sheet · Mission: Conditionals — the Robot Decides',

    html: {

      /* ═══════════ PÁGINA 1 ═══════════ */
      p1:
        '<div class="idline"><span>Name:</span><span class="raya"></span><span>Student No.:</span><span class="raya corta"></span></div>' +

        '<div class="fh">' +
        '<div class="fh-txt">' +
        '<div class="f-badge">📄 Study Sheet: Mission — Conditionals: the Robot Decides</div>' +
        '<div class="f-meta"><b>Subject:</b> Programming &nbsp;·&nbsp; <b>Level:</b> Basic Education</div>' +
        '<div class="f-meta"><b>Topic:</b> IF… THEN… ELSE conditionals in plain-language pseudocode: the condition as a yes/no question, the robot’s sensors (is there a wall ahead? is the traffic light green?), which branch runs and which one is ignored, chained conditionals and the common mistakes — with and without a computer</div>' +
        '</div>' +
        '<div class="fh-qr">' +
        '<img src="img/qr-mision-robot-decide.png" alt="Mission QR code">' +
        '<span>📷 Play the mission on your phone</span>' +
        '</div>' +
        '</div>' +

        '<h2>🎯 Learning Objectives</h2>' +
        '<ol class="objetivos">' +
        '<li>Explain what a <strong>conditional</strong> is and spot one in everyday decisions.</li>' +
        '<li>Identify the <strong>condition</strong> as a <strong>yes-or-no question</strong>.</li>' +
        '<li>Tell the <strong>THEN branch</strong> (answer yes) apart from the <strong>ELSE branch</strong> (answer no).</li>' +
        '<li>Understand that in every conditional <strong>one single branch</strong> runs and the other is ignored.</li>' +
        '<li>Use the robot’s <strong>sensors</strong> (wall, traffic light) to decide on the right action.</li>' +
        '<li><strong>Spot bugs</strong> in conditionals: swapped branches or the wrong condition.</li>' +
        '</ol>' +

        '<h2>🔀 1. What is a conditional?</h2>' +
        '<p>A <strong>conditional</strong> is an instruction that makes you <strong>decide</strong>: <strong>IF</strong> a ' +
        'condition is true <strong>THEN</strong> the robot does one thing, <strong>ELSE</strong> it does another. The ' +
        '<strong>condition</strong> is always a <strong>yes-or-no question</strong>. You already decide with conditionals ' +
        'every day: <em>IF it is raining THEN I take an umbrella ELSE I take a cap</em>.</p>' +
        '<div class="caja truco">💡 <b>Trick:</b> the condition is answered with <strong>YES</strong> or <strong>NO</strong> only ' +
        '(never «maybe»). Depending on the answer one branch runs and the other <strong>is ignored</strong>: the robot never ' +
        'does both things at once.</div>' +

        '<h3>❓👉👈 Mini-demonstration: the three parts of a conditional</h3>' +
        '<div class="ilus">' +
        '<div class="ilus-t">This is how a robot decides (and how you do too!)</div>' +
        '<div class="celula">' +
        '<div class="cm"><span class="c-emoji">❓</span><b>Condition</b>The yes/no question: «is it raining?».</div>' +
        '<div class="cc"><span class="c-emoji">👉</span><b>THEN branch</b>If the answer is YES: «I take an umbrella».</div>' +
        '<div class="cn"><span class="c-emoji">👈</span><b>ELSE branch</b>If the answer is NO: «I take a cap».</div>' +
        '</div>' +
        '<p style="font-size:9pt;color:var(--gris);margin:8px 0 0;text-align:center;">🔀 IF (condition) THEN (the yes branch) ELSE (the no branch) — only ONE branch runs!</p>' +
        '</div>',

      /* ═══════════ PÁGINA 2 ═══════════ */
      p2:
        '<h2 style="margin-top:0;">🤖 2. IF-THEN-ELSE in the robot</h2>' +
        '<p>The <strong>sensors</strong> are the robot’s questions: they tell it whether <strong>there is a wall ahead</strong> ' +
        'or whether <strong>the traffic light is green</strong>. With that answer the robot decides which branch to run. With ' +
        '<strong>IF-THEN</strong> (no ELSE) it only does something when the answer is yes; with ' +
        '<strong>IF-THEN-ELSE</strong> it always does one of the two things.</p>' +
        '<div class="tri">' +
        '<div class="tnuc"><b>🌳 Wall sensor</b>«IF THERE IS A WALL AHEAD → TURN RIGHT, ELSE → FORWARD». If there is a tree in front of it the robot turns; if the way is clear, it goes forward.</div>' +
        '<div class="torg"><b>🚦 Traffic-light sensor</b>«IF THE TRAFFIC LIGHT IS GREEN → FORWARD, ELSE → WAIT». On a green light it crosses; on a red one it waits until it changes.</div>' +
        '</div>' +

        '<h3>📋 The 4 ideas behind conditionals</h3>' +
        '<table>' +
        '<tr><th>Idea</th><th>What is it?</th><th>Example</th></tr>' +
        '<tr><td class="k">🔀 Conditional</td><td>An instruction that makes it decide according to a condition</td><td>IF it rains THEN umbrella ELSE cap</td></tr>' +
        '<tr><td class="k">❓ Condition</td><td>The yes-or-no question that decides the branch</td><td>«Is there a wall ahead?»</td></tr>' +
        '<tr><td class="k">👉 THEN branch</td><td>What it does if the answer is YES</td><td>TURN RIGHT</td></tr>' +
        '<tr><td class="k">👈 ELSE branch</td><td>What it does if the answer is NO</td><td>FORWARD</td></tr>' +
        '</table>' +
        '<div class="caja regla">📡 <b>The sensor does not guess:</b> it measures something in the world (a wall, a color) and answers ' +
        '<strong>yes or no</strong>. If you choose the wrong condition (asking about the traffic light when the problem is ' +
        'a tree), the robot will decide badly.</div>' +

        '<h3>💾 Example of a program with a conditional (read it and run it in your head)</h3>' +
        '<div class="prog-ej">Program: crossing the street 🚦<br>' +
        '1. FORWARD &nbsp; 2. FORWARD up to the corner<br>' +
        '3. IF THE TRAFFIC LIGHT IS GREEN → FORWARD (I cross) &nbsp; ELSE → WAIT<br>' +
        '→ On a 🟢 green light the robot crosses; on a 🔴 red one it waits and asks again. ✅</div>' +
        '<div class="caja idea">🧠 <b>Careful:</b> in every conditional <strong>ONE single</strong> branch runs. If the ' +
        'answer is YES, the ELSE branch is not even looked at. Thinking about both questions at once is the most common mistake!</div>',

      /* ═══════════ PÁGINA 3 ═══════════ */
      p3:
        '<h2 style="margin-top:0;">🔗 3. Chained conditionals and common mistakes</h2>' +
        '<p>Sometimes the robot needs <strong>several questions in a row</strong>: first «is there a wall?», then «is the ' +
        'traffic light green?». Those are <strong>chained conditionals</strong>, and the <strong>order</strong> of the ' +
        'questions can change the final decision.</p>' +

        '<h3>⚠️ Common mistakes — do not fall for them!</h3>' +
        '<table>' +
        '<tr><th>Mistake</th><th>Why it is wrong</th><th>The right way</th></tr>' +
        '<tr><td class="k" style="white-space:normal;">Thinking both branches run</td><td>In a conditional only one branch runs.</td><td>Choosing the branch that matches the answer ✔</td></tr>' +
        '<tr><td class="k" style="white-space:normal;">Mixing up condition and action</td><td>«Is there a wall?» is a question; «FORWARD» is an order.</td><td>The condition asks; the action orders ✔</td></tr>' +
        '<tr><td class="k" style="white-space:normal;">Swapping the branches</td><td>«IF there is a wall → FORWARD» makes the robot crash.</td><td>IF there is a wall → TURN RIGHT ✔</td></tr>' +
        '<tr><td class="k" style="white-space:normal;">The wrong condition</td><td>Asking about the traffic light when what is in the way is a tree.</td><td>Letting the sensor measure the right thing ✔</td></tr>' +
        '<tr><td class="k" style="white-space:normal;">Forgetting WAIT on a red light</td><td>The robot crosses on red and «crashes».</td><td>ELSE → WAIT until it changes ✔</td></tr>' +
        '</table>' +

        '<h2>🎲 4. Unplugged activities (no computer)</h2>' +
        '<div class="caja regla">🚦 <b>The human traffic light:</b> in groups of three. One student is the <strong>traffic light</strong> ' +
        'and holds two cards: a 🟢 green one and a 🔴 red one, switching between them. Another student is the <strong>robot</strong> ' +
        'and says the conditional out loud: «IF the traffic light is green THEN I go forward, ELSE I wait». Every time ' +
        'the traffic light shows a card, the robot decides and either takes a step or stays still. The third one checks that the robot ' +
        'runs <strong>only one branch</strong>. Then they swap roles.</div>' +
        '<div class="caja regla">🧵 <b>Masking-tape maze:</b> with masking tape on the floor, mark out a path with a ' +
        '«tree» 🌳 (a chair) blocking the way. The «robot» moves along with its eyes on the floor, saying its conditional ' +
        'out loud: «IF there is a wall ahead THEN I turn right, ELSE I go forward». At every step it says the condition and its ' +
        'answer (yes/no) so the class can hear how it <strong>decides</strong> and goes around the obstacle without crashing.</div>' +
        '<div class="caja hn">🇭🇳 <b>Conditionals in your life:</b> when you decide whether to cross the swollen river, whether to take in ' +
        'the washing because it is going to rain or whether to cook on the cookfire depending on whether it is lit, you are already using conditionals: ' +
        'a yes-or-no question and two paths. Whoever decides well, programs well! 💚</div>',

      /* ═══════════ PÁGINA 4 ═══════════ */
      p4:
        '<h2>✍️ 5. Test Yourself! Activities</h2>' +

        '<h3>I. Fill in the blanks <span class="val">(Value: 10 points each)</span></h3>' +
        '<ol>' +
        '<li>The teacher said: if it rains, the class is held <span class="linea-resp"></span>.</li>' +
        '<li>«Cloudy» is not «<span class="linea-resp"></span>».</li>' +
        '<li>On a green light, the robot <span class="linea-resp"></span> the street.</li>' +
        '<li>IF it is raining → I take an umbrella, ELSE → I take a <span class="linea-resp"></span>.</li>' +
        '<li>On Monday it dawned cloudy and <span class="linea-resp"></span>.</li>' +
        '<li>A condition is true or <span class="linea-resp"></span>, with no middle ground.</li>' +
        '<li>Half of the class went out to the <span class="linea-resp"></span>.</li>' +
        '<li>The whole class was lost <span class="linea-resp"></span> about who had understood.</li>' +
        '<li>The question of the conditional never moves the robot: it only <span class="linea-resp"></span>.</li>' +
        '<li>A robot does not interpret: it <span class="linea-resp"></span>.</li>' +
        '</ol>' +

        '<h3>II. True or False <span class="val">(Value: 10 points each)</span></h3>' +
        '<ol>' +
        '<li>____ Rain is an example of an everyday condition.</li>' +
        '<li>____ It rained on the cloudy Monday.</li>' +
        '<li>____ The same question can have different answers on different days.</li>' +
        '<li>____ The whole class understood the teacher’s notice the same way.</li>' +
        '<li>____ Everyday decisions also depend on yes-or-no questions.</li>' +
        '<li>____ The robot guesses which branch suits it.</li>' +
        '<li>____ A conditional may have no branch for the «no».</li>' +
        '<li>____ In daily life we do not use conditionals.</li>' +
        '<li>____ The order of several questions in a row can change the decision.</li>' +
        '<li>____ Forty-three people interpret; a robot obeys.</li>' +
        '</ol>',

      /* ═══════════ PÁGINA 5 ═══════════ */
      p5:
        '<h3>III. Multiple choice <span class="val">(Value: 10 points each)</span> — Circle the correct letter.</h3>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">1</span>IF there is a wall ahead THEN turn right, ELSE go forward. The robot has NO wall ahead. What does it do?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> It turns right</span>' +
        '<span class="op"><i>b</i> It goes forward</span>' +
        '<span class="op"><i>c</i> It stops</span>' +
        '<span class="op"><i>d</i> It turns left</span>' +
        '</div>' +
        '</div>' +
        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">2</span>What is a conditional?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> A list of steps that are always the same</span>' +
        '<span class="op"><i>b</i> A 90° turn</span>' +
        '<span class="op"><i>c</i> An instruction that makes it decide according to a condition</span>' +
        '<span class="op"><i>d</i> A map of the village</span>' +
        '</div>' +
        '</div>' +
        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">3</span>What was missing from the teacher’s notice?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> An exact time</span>' +
        '<span class="op"><i>b</i> A place</span>' +
        '<span class="op"><i>c</i> More students</span>' +
        '<span class="op"><i>d</i> Saying what to do if it was only cloudy</span>' +
        '</div>' +
        '</div>' +
        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">4</span>What does the robot read to know which branch to take?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> The robot’s color</span>' +
        '<span class="op"><i>b</i> The final square</span>' +
        '<span class="op"><i>c</i> The answer to the question</span>' +
        '<span class="op"><i>d</i> The name of the program</span>' +
        '</div>' +
        '</div>' +
        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">5</span>«IF green → go, ELSE → stay still». On a red light, the robot…</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> Goes anyway</span>' +
        '<span class="op"><i>b</i> Stays still</span>' +
        '<span class="op"><i>c</i> Turns</span>' +
        '<span class="op"><i>d</i> Delivers</span>' +
        '</div>' +
        '</div>' +
        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">6</span>Which one of these is a yes-or-no question?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> «Turn right»</span>' +
        '<span class="op"><i>b</i> «Is it raining?»</span>' +
        '<span class="op"><i>c</i> «Deliver the message»</span>' +
        '<span class="op"><i>d</i> «Walk three steps»</span>' +
        '</div>' +
        '</div>' +
        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">7</span>Which class was lost on Monday?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> Math</span>' +
        '<span class="op"><i>b</i> Physical Education</span>' +
        '<span class="op"><i>c</i> Spanish</span>' +
        '<span class="op"><i>d</i> Science</span>' +
        '</div>' +
        '</div>' +
        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">8</span>«IF it reached the house → DELIVER, ELSE → …». What does it do if it has not arrived yet?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> It keeps walking</span>' +
        '<span class="op"><i>b</i> It delivers anyway</span>' +
        '<span class="op"><i>c</i> It switches off</span>' +
        '<span class="op"><i>d</i> It goes back to the start</span>' +
        '</div>' +
        '</div>' +
        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">9</span>In the robot, who answers the question of the condition?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> The programmer, out loud</span>' +
        '<span class="op"><i>b</i> The battery</span>' +
        '<span class="op"><i>c</i> The map</span>' +
        '<span class="op"><i>d</i> A part that measures what is around it</span>' +
        '</div>' +
        '</div>' +
        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">10</span>What does the robot do with the branch that does not apply?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> It does not run it</span>' +
        '<span class="op"><i>b</i> It runs it later</span>' +
        '<span class="op"><i>c</i> It runs it first</span>' +
        '<span class="op"><i>d</i> It deletes it</span>' +
        '</div>' +
        '</div>',

      /* ═══════════ PÁGINA 6 ═══════════ */
      p6:
        '<h3>IV. Matching <span class="val">(Value: 10 points each)</span> — Write on the line the letter from Column B that matches.</h3>' +
        '<table>' +
        '<tr><th style="width:42%;">Column A</th><th>Column B</th></tr>' +
        '<tr><td>1. ____ Maybe</td><td>A. An instruction for not crossing on red</td></tr>' +
        '<tr><td>2. ____ Sensor</td><td>B. What you wear IF it is cold</td></tr>' +
        '<tr><td>3. ____ Chained</td><td>C. An answer a condition cannot have</td></tr>' +
        '<tr><td>4. ____ Action</td><td>D. Putting the «yes» where the «no» went</td></tr>' +
        '<tr><td>5. ____ WAIT</td><td>E. Several questions in a row</td></tr>' +
        '<tr><td>6. ____ Traffic light</td><td>F. It works as a wall in the simulator</td></tr>' +
        '<tr><td>7. ____ Wood stove</td><td>G. A street light that says go or not</td></tr>' +
        '<tr><td>8. ____ Sweater</td><td>H. The robot’s «questions»</td></tr>' +
        '<tr><td>9. ____ Tree</td><td>I. An order that moves the robot</td></tr>' +
        '<tr><td>10. ____ Swapping the branches</td><td>J. IF it is lit, you cook</td></tr>' +
        '</table>' +

        '<div class="felic">' +
        '🏅 <b>Congratulations! You have completed the Mission Conditionals: the Robot Decides.</b> Now you know that a conditional ' +
        'makes the robot decide with a yes-or-no question, that only one branch runs (THEN or ELSE), that the sensors ' +
        'answer the condition, and how to hunt down conditional bugs. Keep going along the Code Path! 🚦🤖' +
        '</div>' +

        '<h2>📏 Assessment Rubric</h2>' +
        '<table class="rubrica">' +
        '<tr><th>Activity</th><th>Where</th><th>Value</th><th>Grade earned</th><th>Comment</th></tr>' +
        '<tr><td>Copied the contents of this material into their Programming notebook.</td><td class="lg">Homework</td><td>100</td><td>&nbsp;</td><td>&nbsp;</td></tr>' +
        '<tr><td>Solved the «Test Yourself» section directly on this sheet.</td><td class="lg">Classwork, the day before the exam</td><td>100</td><td>&nbsp;</td><td>&nbsp;</td></tr>' +
        '<tr><td>Wrote three conditionals from home in their notebook (IF… THEN… ELSE) and played «the human traffic light» with a classmate.</td><td class="lg">Homework</td><td>100</td><td>&nbsp;</td><td>&nbsp;</td></tr>' +
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
        '<div><span class="pt">I. Fill in:</span> 1. inside &nbsp; 2. raining &nbsp; 3. crosses &nbsp; 4. cap &nbsp; 5. windy &nbsp; 6. false &nbsp; 7. yard &nbsp; 8. arguing &nbsp; 9. decides &nbsp; 10. obeys</div>' +
        '<div><span class="pt">II. True or False:</span> 1T, 2F, 3T, 4F, 5T, 6F, 7T, 8F, 9T, 10T</div>' +
        '<div><span class="pt">III. Multiple choice:</span> 1b, 2c, 3d, 4c, 5b, 6b, 7b, 8a, 9d, 10a</div>' +
        '<div><span class="pt">IV. Matching:</span> 1C, 2H, 3E, 4I, 5A, 6G, 7J, 8B, 9F, 10D</div>' +
        '</div>' +

        '<div class="nota-doc">' +
        '<strong>Note for the teacher:</strong> this study sheet is based on the interactive content of the M.E.T.A.S platform, ' +
        '«Mission Conditionals: the Robot Decides» (Basic Education), stage 3 of the Code Path (Programming), reachable ' +
        'from 4th grade onward. It works on IF… THEN… ELSE conditionals in plain-language pseudocode: the condition as a ' +
        'yes/no question, the robot’s sensors (is there a wall ahead? is the traffic light green?), the fact that a single branch runs, and ' +
        'spotting bugs (swapped branches or the wrong condition). The interactive mission (QR code on the cover) ' +
        'includes the <strong>simulator with decisions</strong>: a 5×5 grid with walls 🌳 and traffic lights 🚦 where the robot ' +
        'only reaches the house by using the conditional, with 4 maps of increasing difficulty and step-by-step animation showing ' +
        'the evaluation of every condition (✔ yes / ✘ no). The unplugged activities on page 3 («The human traffic light» and ' +
        '«The masking-tape maze») make it possible to work on the same concepts with no device at all: the students say the ' +
        'conditional out loud and decide according to the card or the obstacle. The «Test Yourself» section mirrors the formats of ' +
        'the platform’s printable assessment (fill in the blank, true/false, multiple choice and matching). In the online test, ' +
        'Column B of the matching section is shuffled deterministically (with no fixed points) in each of the 30 forms. ' +
        '<em>The Spanish and English versions share the same answer key: Column B keeps the same order in both.</em>' +
        '</div>'
    },

    /* Rótulos sueltos: botón de impresión y pies de página */
    frases: {
      '🖨️ Imprimir la ficha': '🖨️ Print the study sheet',
      '· Ficha Didáctica · Condicionales: el Robot Decide': '· Study Sheet · Conditionals: the Robot Decides',
      '· Ficha Didáctica · Condicionales: el Robot Decide · Hoja del Docente': '· Study Sheet · Conditionals: the Robot Decides · Teacher’s Sheet'
    },

    fragmentos: [
      [/Página (\d+)/g, 'Page $1']
    ]
  };
})();
