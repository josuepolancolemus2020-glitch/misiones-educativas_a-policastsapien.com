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
        '<li>An instruction that makes the robot decide is called a <span class="linea-resp"></span>.</li>' +
        '<li>The yes-or-no question of a conditional is the <span class="linea-resp"></span>.</li>' +
        '<li>The branch that runs when the answer is YES is the <span class="linea-resp"></span> branch.</li>' +
        '<li>The branch that runs when the answer is NO is the <span class="linea-resp"></span> branch.</li>' +
        '<li>In a conditional <span class="linea-resp"></span> one branch runs at a time.</li>' +
        '<li>The part of the robot that answers the question is called the <span class="linea-resp"></span>.</li>' +
        '<li>A condition can only be true or <span class="linea-resp"></span>.</li>' +
        '<li>On a red light and with «ELSE → WAIT», the robot <span class="linea-resp"></span>.</li>' +
        '<li>Swapping the branches of a conditional is a <span class="linea-resp"></span>.</li>' +
        '<li>Several conditionals one after another are <span class="linea-resp"></span> conditionals.</li>' +
        '</ol>' +

        '<h3>II. True or False <span class="val">(Value: 10 points each)</span></h3>' +
        '<ol>' +
        '<li>____ A conditional makes the robot decide according to a condition.</li>' +
        '<li>____ The condition is a yes-or-no question.</li>' +
        '<li>____ In a conditional both branches run at once.</li>' +
        '<li>____ The THEN branch runs when the answer is YES.</li>' +
        '<li>____ «FORWARD» is a condition.</li>' +
        '<li>____ The sensor answers the question of the condition.</li>' +
        '<li>____ With «IF green → FORWARD, ELSE → WAIT», on red the robot waits.</li>' +
        '<li>____ A condition can be «maybe», neither true nor false.</li>' +
        '<li>____ Swapping the branches of a conditional is a bug.</li>' +
        '<li>____ The condition and the action are exactly the same thing.</li>' +
        '</ol>',

      /* ═══════════ PÁGINA 5 ═══════════ */
      p5:
        '<h3>III. Multiple choice <span class="val">(Value: 10 points each)</span> — Circle the correct letter.</h3>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">1</span>What is a conditional?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> a list of steps that are always the same</span>' +
        '<span class="op"><i>b</i> an instruction that makes it decide according to a condition</span>' +
        '<span class="op"><i>c</i> a 90° turn</span>' +
        '<span class="op"><i>d</i> a map of the village</span>' +
        '</div>' +
        '</div>' +
        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">2</span>Which one of these is a CONDITION (a yes/no question)?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> FORWARD one square</span>' +
        '<span class="op"><i>b</i> is there a wall ahead?</span>' +
        '<span class="op"><i>c</i> TURN RIGHT</span>' +
        '<span class="op"><i>d</i> DELIVER the message</span>' +
        '</div>' +
        '</div>' +
        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">3</span>When does the ELSE branch run?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> when the condition is true</span>' +
        '<span class="op"><i>b</i> when the condition is false</span>' +
        '<span class="op"><i>c</i> always</span>' +
        '<span class="op"><i>d</i> never</span>' +
        '</div>' +
        '</div>' +
        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">4</span>IF there is a wall ahead → TURN RIGHT, ELSE → FORWARD. The robot has NO wall ahead. What does it do?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> it turns right</span>' +
        '<span class="op"><i>b</i> it goes forward</span>' +
        '<span class="op"><i>c</i> it stops</span>' +
        '<span class="op"><i>d</i> it turns left</span>' +
        '</div>' +
        '</div>' +
        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">5</span>How many branches run in a conditional?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> both at once</span>' +
        '<span class="op"><i>b</i> none</span>' +
        '<span class="op"><i>c</i> only one: the other is ignored</span>' +
        '<span class="op"><i>d</i> three</span>' +
        '</div>' +
        '</div>' +
        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">6</span>What is a robot sensor?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> the part that answers the question of the condition</span>' +
        '<span class="op"><i>b</i> a square on the map</span>' +
        '<span class="op"><i>c</i> the message</span>' +
        '<span class="op"><i>d</i> a prize</span>' +
        '</div>' +
        '</div>' +
        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">7</span>With «IF green → FORWARD, ELSE → WAIT», on a red light the robot…</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> goes forward anyway</span>' +
        '<span class="op"><i>b</i> turns</span>' +
        '<span class="op"><i>c</i> waits</span>' +
        '<span class="op"><i>d</i> delivers</span>' +
        '</div>' +
        '</div>' +
        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">8</span>Which conditional keeps it from crashing into the wall?</div>' +
        '<div class="preg-ops">' +
        '<span class="op full"><i>a</i> IF there is a wall → FORWARD, ELSE → TURN RIGHT</span>' +
        '<span class="op full"><i>b</i> IF there is a wall → TURN RIGHT, ELSE → FORWARD</span>' +
        '<span class="op full"><i>c</i> FORWARD, FORWARD, FORWARD</span>' +
        '<span class="op full"><i>d</i> TURN, TURN, TURN</span>' +
        '</div>' +
        '</div>' +
        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">9</span>A condition can only be…</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> true or false</span>' +
        '<span class="op"><i>b</i> red or blue</span>' +
        '<span class="op"><i>c</i> long or short</span>' +
        '<span class="op"><i>d</i> maybe</span>' +
        '</div>' +
        '</div>' +
        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">10</span>The THEN branch is…</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> the path when the answer is NO</span>' +
        '<span class="op"><i>b</i> the path when the answer is YES</span>' +
        '<span class="op"><i>c</i> the question</span>' +
        '<span class="op"><i>d</i> the sensor</span>' +
        '</div>' +
        '</div>',

      /* ═══════════ PÁGINA 6 ═══════════ */
      p6:
        '<h3>IV. Matching <span class="val">(Value: 10 points each)</span> — Write on the line the letter from Column B that matches.</h3>' +
        '<table>' +
        '<tr><th style="width:42%;">Column A</th><th>Column B</th></tr>' +
        '<tr><td>1. ____ Conditional</td><td>A. A yes-or-no question that decides the branch</td></tr>' +
        '<tr><td>2. ____ Condition</td><td>B. Branches swapped or the wrong condition</td></tr>' +
        '<tr><td>3. ____ THEN branch</td><td>C. The part of the robot that answers the question</td></tr>' +
        '<tr><td>4. ____ ELSE branch</td><td>D. The only two values a condition can have</td></tr>' +
        '<tr><td>5. ____ Sensor</td><td>E. The path that runs when the answer is YES</td></tr>' +
        '<tr><td>6. ____ Traffic light</td><td>F. Several conditionals, one after another</td></tr>' +
        '<tr><td>7. ____ WAIT</td><td>G. An instruction that makes the robot decide</td></tr>' +
        '<tr><td>8. ____ True or false</td><td>H. A color sensor: green go forward, red wait</td></tr>' +
        '<tr><td>9. ____ Conditional bug</td><td>I. The path that runs when the answer is NO</td></tr>' +
        '<tr><td>10. ____ Chained</td><td>J. The robot stays still and lets time go by</td></tr>' +
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
        '<div><span class="pt">I. Fill in:</span> 1. conditional &nbsp; 2. condition &nbsp; 3. THEN &nbsp; 4. ELSE &nbsp; 5. only &nbsp; 6. sensor &nbsp; 7. false &nbsp; 8. waits &nbsp; 9. bug &nbsp; 10. chained</div>' +
        '<div><span class="pt">II. True or False:</span> 1T, 2T, 3F, 4T, 5F, 6T, 7T, 8F, 9T, 10F</div>' +
        '<div><span class="pt">III. Multiple choice:</span> 1b, 2b, 3b, 4b, 5c, 6a, 7c, 8b, 9a, 10b</div>' +
        '<div><span class="pt">IV. Matching:</span> 1G, 2A, 3E, 4I, 5C, 6H, 7J, 8D, 9B, 10F</div>' +
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
