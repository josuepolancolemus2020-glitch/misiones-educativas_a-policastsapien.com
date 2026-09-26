/* ============================================================
   Ficha didáctica «El Pensamiento Computacional» — en inglés
   ------------------------------------------------------------
   Misma traducción de autor que la misión (algorithm · step ·
   instruction · exact vs. ambiguous · sequence · decompose ·
   pattern · abstraction · big problem / small part) y en inglés
   AMERICANO, que es el que enseñan las bilingües de Honduras:
   color, center, «Student No.».

   Lo cultural se explica, no se calca: baleada conserva su
   nombre y se explica en la portada; comal → griddle, nance →
   nance, fresco → cool drink, guacal → gourd bowl, lunes cívico
   → Monday flag ceremony, feria escolar → school fair.

   Las 7 páginas se traducen enteras (data-i18n="p1".."p7") para
   que la maquetación impresa no se desarme.

   IMPORTANTE para el docente: la Columna B de los pareados
   conserva EL MISMO ORDEN que en español, así la pauta
   (1D · 2F · 3H · 4A · 5I · 6J · 7E · 8B · 9G · 10C) sigue
   siendo válida en las dos versiones. Lo mismo vale para el
   completar, el V/F y la selección múltiple.
   ============================================================ */
(function () {
  'use strict';

  window.MISION_EN = {

    titulo: 'Study Sheet · Mission: Computational Thinking',

    html: {

      /* ═══════════ PÁGINA 1 ═══════════ */
      p1:
        '<div class="idline"><span>Name:</span><span class="raya"></span><span>Student No.:</span><span class="raya corta"></span></div>' +
        '<div class="fh">' +
        '<div class="fh-txt">' +
        '<div class="f-badge">📄 Study Sheet: Mission Computational Thinking</div>' +
        '<div class="f-meta"><b>Subject:</b> Programming &nbsp;·&nbsp; <b>Level:</b> Basic Education</div>' +
        '<div class="f-meta"><b>Topic:</b> Thinking before programming: what an algorithm is (the recipe for baleadas), exact vs. ambiguous instructions, breaking big problems into small parts, patterns and abstraction — all with no computer</div>' +
        '</div>' +
        '<div class="fh-qr">' +
        '<img src="img/qr-mision-pensamiento-computacional.png" alt="Mission QR code">' +
        '<span>📷 Play the mission on your phone</span>' +
        '</div>' +
        '</div>' +
        '<h2>🎯 Learning Objectives</h2>' +
        '<ol class="objetivos">' +
        '<li>Explain what an <strong>algorithm</strong> is and recognize one in everyday tasks.</li>' +
        '<li>Tell an <strong>exact instruction</strong> apart from an <strong>ambiguous instruction</strong>.</li>' +
        '<li>Understand that the computer does <strong>exactly</strong> what it is told: it does not guess.</li>' +
        '<li><strong>Decompose</strong> a big problem into manageable small parts.</li>' +
        '<li>Spot <strong>patterns</strong> (what repeats) in order to save work.</li>' +
        '<li>Apply <strong>abstraction</strong>: keep only what matters, the way a map does.</li>' +
        '</ol>' +
        '<h2>🫓 1. What is an algorithm?</h2>' +
        '<p>An <strong>algorithm</strong> is the <strong>ordered steps</strong> for getting something done. The ' +
        '<strong>recipe for baleadas</strong> (the Honduran folded flour tortilla) is an algorithm: knead the flour, shape the tortilla, cook it on the ' +
        'griddle, spread the beans and fold it. You already use algorithms without knowing it: brushing your teeth, raising the flag at the ' +
        'Monday ceremony or packing your backpack are steps <strong>in order</strong> that you repeat every day.</p>' +
        '<div class="caja truco">💡 <b>Trick:</b> every step of an algorithm starts with a <strong>clear verb</strong> ' +
        '(wash, knead, fold) and goes in its place. If you change the order, the result changes: nobody folds the baleada ' +
        'before making the tortilla.</div>' +
        '<h3>🧠🌫️🧩 Mini-demo: the three key ideas</h3>' +
        '<div class="ilus">' +
        '<div class="ilus-t">This is how a programmer thinks (with no computer!)</div>' +
        '<div class="celula">' +
        '<div class="cm"><span class="c-emoji">✅</span><b>Exact instruction</b>«Add 2 spoonfuls»: anyone carries it out the same way.</div>' +
        '<div class="cc"><span class="c-emoji">🌫️</span><b>Ambiguous instruction</b>«Put in a little»: everyone understands something else.</div>' +
        '<div class="cn"><span class="c-emoji">🧩</span><b>Decompose</b>The school fair is split into food, games and invitations.</div>' +
        '</div>' +
        '<p style="font-size:9pt;color:var(--gris);margin:8px 0 0;text-align:center;">✅ Algorithm = <strong>exact</strong> steps + in the right <strong>order</strong>.</p>' +
        '</div>',

      /* ═══════════ PÁGINA 2 ═══════════ */
      p2:
        '<h2 style="margin-top:0;">🌫️ 2. Exact vs. ambiguous instructions</h2>' +
        '<p>A computer (or a human robot!) carries out instructions <strong>exactly as they are written</strong>: ' +
        'it <strong>does not guess</strong> what you meant. That is why «put in a little» fails: everyone puts in a ' +
        'different amount. «Add 2 spoonfuls», on the other hand, works: <strong>everyone does the same thing</strong>.</p>' +
        '<div class="tri">' +
        '<div class="tnuc"><b>✅ Exact</b>It has clear amounts, places and times: «take 3 steps», «read pages 12 to 15». Everyone carries it out the same way.</div>' +
        '<div class="torg"><b>🌫️ Ambiguous</b>It leaves doubts: «a little», «over there», «nice», «quickly». Everyone understands something else and the task fails.</div>' +
        '</div>' +
        '<h3>📋 The 4 ideas of computational thinking</h3>' +
        '<table>' +
        '<tr><th>Idea</th><th>What is it?</th><th>Honduran example</th></tr>' +
        '<tr><td class="k">🫓 Algorithm</td><td>Ordered steps for getting something done</td><td>The recipe for baleadas</td></tr>' +
        '<tr><td class="k">🗣️ Instruction</td><td>Each command; it must be exact, not ambiguous</td><td>«Add 2 spoonfuls» ✅ vs. «put in a little» 🌫️</td></tr>' +
        '<tr><td class="k">🧩 Decomposition</td><td>Splitting a big problem into small parts</td><td>The school fair: food, games, invitations</td></tr>' +
        '<tr><td class="k">🔁 Pattern</td><td>What repeats; spotting it saves work</td><td>Every tortilla is patted and cooked the same way</td></tr>' +
        '</table>' +
        '<div class="caja regla">🗺️ <b>And as a bonus, abstraction:</b> keeping only what matters. A map does not draw ' +
        'every stone on the road: it draws only what you need to get there. For the nance drink the color of the ' +
        'gourd bowl does not matter: the nances, the sugar and the ice are what count.</div>' +
        '<h3>💾 Sample algorithm (read it and run it in your head)</h3>' +
        '<div class="prog-ej">Algorithm: making a nance drink 🥤<br>' +
        '1. Wash the nances well &nbsp; 2. Mash them in a cup of water &nbsp; 3. Strain the mixture<br>' +
        '4. Add 4 cups of water and 6 spoonfuls of sugar &nbsp; 5. Serve with ice<br>' +
        '→ Every step is EXACT and goes in ORDER: that is why anyone can make it the same way. ✅</div>' +
        '<div class="caja idea">🧠 <b>Watch out:</b> when a program fails it is almost never the computer’s fault: it only ' +
        'obeyed an ambiguous or out-of-order instruction. The thinking happens BEFORE the programming!</div>',

      /* ═══════════ PÁGINA 3 ═══════════ */
      p3:
        '<h2 style="margin-top:0;">🧩 3. Decomposing, patterns and common mistakes</h2>' +
        '<p>A <strong>big problem</strong> (organizing the school fair) is scary as a whole, but it is beaten once it is ' +
        '<strong>decomposed</strong>: one committee prepares the food, another the games and another invites the families. ' +
        'Then you look for the <strong>pattern</strong>: what repeats is always done the same way and saves work.</p>' +
        '<h3>⚠️ Common mistakes — do not fall for them!</h3>' +
        '<table>' +
        '<tr><th>Mistake</th><th>Why it is wrong</th><th>The right way</th></tr>' +
        '<tr><td class="k" style="white-space:normal;">Believing the computer «guesses»</td><td>It runs exactly what is written, even if it is wrong.</td><td>Write exact instructions ✔</td></tr>' +
        '<tr><td class="k" style="white-space:normal;">Giving ambiguous commands</td><td>«A little», «over there»: everyone understands something else.</td><td>Clear amounts and places ✔</td></tr>' +
        '<tr><td class="k" style="white-space:normal;">Changing the order of the steps</td><td>The algorithm runs in order.</td><td>Number the steps from 1 to the end ✔</td></tr>' +
        '<tr><td class="k" style="white-space:normal;">Taking on the whole problem at once</td><td>It wears you out and messes up the work.</td><td>Decompose and divide up the parts ✔</td></tr>' +
        '<tr><td class="k" style="white-space:normal;">Ignoring what repeats</td><td>You waste time reinventing it every time.</td><td>Spot the pattern and repeat it ✔</td></tr>' +
        '</table>' +
        '<h2>🎲 4. Unplugged activities (no computer)</h2>' +
        '<div class="caja regla">🤖 <b>The human robot:</b> in pairs. One student writes the instructions for a simple ' +
        'task (drawing a house, making a paper airplane, putting a book in the backpack) and the other is the «robot»: ' +
        'they carry out each instruction <strong>to the letter</strong>, exaggerating every ambiguity — if it says «put in a ' +
        'window», the robot may draw it as big as the house! When the task fails, together they find the ambiguous ' +
        'instruction and correct it with exact amounts and places. Then they switch roles.</div>' +
        '<div class="caja regla">🎪 <b>Decompose the fair:</b> the teacher writes the big problem «organize the school ' +
        'fair» on the board. Each team gets one part (food, games, invitations, cleanup) and writes the algorithm for ' +
        'THEIR part in 4 to 6 exact steps. At the end the teams read their algorithms in order and check that, together, ' +
        'the small parts solve the huge problem. The team with no ambiguous steps wins.</div>' +
        '<div class="caja hn">🇭🇳 <b>Computational thinking in your life:</b> when you follow the recipe for baleadas, ' +
        'raise the flag at the Monday ceremony or divide up the chores at home, you are already thinking like a programmer: ' +
        'steps in order, small parts and patterns. Whoever masters this has the hardest part of programming… without even ' +
        'touching a computer! 💚</div>',

      /* ═══════════ PÁGINA 4 ═══════════ */
      p4:
        '<h2>✍️ 5. Test Yourself! Activities</h2>' +
        '<h3>I. Fill in the blanks <span class="val">(Value: 10 points each)</span></h3>' +
        '<ol>' +
        '<li>Kenia was left making the baleadas while her mom went to the <span class="linea-resp"></span>.</li>' +
        '<li>That day there was no <span class="linea-resp"></span> at Kenia’s house.</li>' +
        '<li>Kenia’s beans <span class="linea-resp"></span> on the griddle.</li>' +
        '<li>Finding what repeats saves <span class="linea-resp"></span>.</li>' +
        '<li>Writing a plan step by step is «programming» with pencil and <span class="linea-resp"></span>.</li>' +
        '<li>The machine does not <span class="linea-resp"></span>: it obeys.</li>' +
        '<li>If you already know how to make one baleada, you know how to make <span class="linea-resp"></span>.</li>' +
        '<li>To raise the flag, first you have to <span class="linea-resp"></span> up.</li>' +
        '<li>Kenia put the tortilla on the griddle <span class="linea-resp"></span> spreading the beans.</li>' +
        '<li>To plant beans: cotton, a bean, light and <span class="linea-resp"></span> every day.</li>' +
        '</ol>' +
        '<h3>II. True or False <span class="val">(Value: 10 points each)</span></h3>' +
        '<ol>' +
        '<li>____ Kenia was left alone making the baleadas.</li>' +
        '<li>____ Putting on your shoes before your socks turns out fine.</li>' +
        '<li>____ «Add 2 spoonfuls of sugar» is an order everyone carries out the same way.</li>' +
        '<li>____ A stone from the river is a plan of steps.</li>' +
        '<li>____ Raising the flag on civic Monday follows steps in order.</li>' +
        '<li>____ A good plan writes down every detail, even the useless ones.</li>' +
        '<li>____ Planting beans can also be written as steps.</li>' +
        '<li>____ When a program fails, it is always the machine’s fault.</li>' +
        '<li>____ Folding the baleada before making the tortilla turns out fine.</li>' +
        '<li>____ A huge problem is best tackled all in one go.</li>' +
        '</ol>',

      /* ═══════════ PÁGINA 5 ═══════════ */
      p5:
        '<h3>III. Multiple choice <span class="val">(Value: 10 points each)</span> — Circle the correct letter.</h3>' +
        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">1</span>Which of these instructions is EXACT?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> Walk around over there</span>' +
        '<span class="op"><i>b</i> Take 3 steps forward</span>' +
        '<span class="op"><i>c</i> Move a little</span>' +
        '<span class="op"><i>d</i> Go fast</span>' +
        '</div></div>' +
        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">2</span>What went wrong for Kenia with the baleadas?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> She spread the beans before cooking the tortilla</span>' +
        '<span class="op"><i>b</i> She forgot to buy flour</span>' +
        '<span class="op"><i>c</i> She did not light the griddle</span>' +
        '<span class="op"><i>d</i> She ate the dough</span>' +
        '</div></div>' +
        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">3</span>What does a machine do with instructions?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> It picks what it wants</span>' +
        '<span class="op"><i>b</i> It deletes them</span>' +
        '<span class="op"><i>c</i> It does exactly what they say</span>' +
        '<span class="op"><i>d</i> It changes their order</span>' +
        '</div></div>' +
        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">4</span>To organize the school fair, it is best to…</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> Do everything at once with no plan</span>' +
        '<span class="op"><i>b</i> Wait for it to organize itself</span>' +
        '<span class="op"><i>c</i> Cancel it</span>' +
        '<span class="op"><i>d</i> Split it into parts: food, games, invitations</span>' +
        '</div></div>' +
        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">5</span>Why does the order «add a little» fail?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> Because it is too long</span>' +
        '<span class="op"><i>b</i> Because everyone understands a different amount</span>' +
        '<span class="op"><i>c</i> Because it is in Spanish</span>' +
        '<span class="op"><i>d</i> Because it has numbers</span>' +
        '</div></div>' +
        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">6</span>A good step starts with…</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> A riddle</span>' +
        '<span class="op"><i>b</i> A greeting</span>' +
        '<span class="op"><i>c</i> An action word, such as «wash» or «cut»</span>' +
        '<span class="op"><i>d</i> A joke</span>' +
        '</div></div>' +
        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">7</span>Which small part belongs to «setting up the school garden»?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> Buying a TV</span>' +
        '<span class="op"><i>b</i> Painting the flag</span>' +
        '<span class="op"><i>c</i> Making a fruit drink</span>' +
        '<span class="op"><i>d</i> Preparing the soil</span>' +
        '</div></div>' +
        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">8</span>What is computational thinking?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> Using the computer all day</span>' +
        '<span class="op"><i>b</i> Thinking in steps, parts and what repeats before acting</span>' +
        '<span class="op"><i>c</i> Memorizing numbers</span>' +
        '<span class="op"><i>d</i> Writing fast</span>' +
        '</div></div>' +
        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">9</span>What matters to sell nance drinks at the fair?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> The color of the bowl</span>' +
        '<span class="op"><i>b</i> The time of day</span>' +
        '<span class="op"><i>c</i> The nances, the sugar and the ice</span>' +
        '<span class="op"><i>d</i> The name of the cup</span>' +
        '</div></div>' +
        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">10</span>What repeats when making tortillas?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> Each tortilla is patted and cooked the same way</span>' +
        '<span class="op"><i>b</i> Nothing, each one is different</span>' +
        '<span class="op"><i>c</i> Only the first one is cooked</span>' +
        '<span class="op"><i>d</i> The dough changes every time</span>' +
        '</div></div>',

      /* ═══════════ PÁGINA 6 ═══════════
         La Columna B conserva el orden del original: la pauta
         1D · 2F · 3H · 4A · 5I · 6J · 7E · 8B · 9G · 10C vale igual. */
      p6:
        '<h3>IV. Matching <span class="val">(Value: 10 points each)</span> — Write on the line the letter from Column B that matches.</h3>' +
        '<table>' +
        '<tr><th style="width:42%;">Column A</th><th>Column B</th></tr>' +
        '<tr><td>1. ____ Algorithm</td><td>A. Keeping only what matters</td></tr>' +
        '<tr><td>2. ____ Ambiguity</td><td>B. A group in charge of one part of the fair</td></tr>' +
        '<tr><td>3. ____ Decompose</td><td>C. Ordered steps to achieve something</td></tr>' +
        '<tr><td>4. ____ Pattern</td><td>D. It is packed with steps in order</td></tr>' +
        '<tr><td>5. ____ Abstraction</td><td>E. What you do to a huge problem before sharing it out</td></tr>' +
        '<tr><td>6. ____ Verb</td><td>F. It does not draw every stone on the road</td></tr>' +
        '<tr><td>7. ____ Recipe</td><td>G. «Wash», «knead», «fold»</td></tr>' +
        '<tr><td>8. ____ Committee</td><td>H. «Make it pretty»</td></tr>' +
        '<tr><td>9. ____ Map</td><td>I. What repeats</td></tr>' +
        '<tr><td>10. ____ Backpack</td><td>J. A cooking algorithm</td></tr>' +
        '</table>' +
        '<div class="felic">' +
        '🏅 <b>Congratulations! You have completed the Mission Computational Thinking.</b> Now you know how to write ' +
        'algorithms with exact steps in the right order, hunt down ambiguous instructions, break big problems into small ' +
        'parts and spot patterns like a real programmer. This is the first step of the Code Path! 🧠💻' +
        '</div>' +
        '<h2>📏 Assessment Rubric</h2>' +
        '<table class="rubrica">' +
        '<tr><th>Activity</th><th>Where</th><th>Value</th><th>Score</th><th>Comments</th></tr>' +
        '<tr><td>Copied the contents of this material into their Programming notebook.</td><td class="lg">Homework</td><td>100</td><td>&nbsp;</td><td>&nbsp;</td></tr>' +
        '<tr><td>Completed the «Test Yourself» section right on this study sheet.</td><td class="lg">Classwork, the day before the exam</td><td>100</td><td>&nbsp;</td><td>&nbsp;</td></tr>' +
        '<tr><td>Wrote in their notebook the algorithm for a chore at home (4 to 6 exact steps) and a classmate ran it as a «human robot».</td><td class="lg">Homework</td><td>100</td><td>&nbsp;</td><td>&nbsp;</td></tr>' +
        '<tr><td>Printed test taken in class.</td><td class="lg">Classroom test</td><td>100</td><td>&nbsp;</td><td>&nbsp;</td></tr>' +
        '<tr><td colspan="3" style="text-align:right;font-weight:700;">Final grade average →</td><td colspan="2">&nbsp; %</td></tr>' +
        '</table>' +
        '<p style="font-size:9pt;color:var(--gris);">Remember that you already learned how to work out an average: add up the total score obtained and divide it by four. ' +
        'The result is your final grade. You will lose points if you do not finish the work, if your handwriting is not legible or if you write with spelling mistakes.</p>',

      /* ═══════════ PÁGINA 7 · HOJA DEL DOCENTE ═══════════ */
      p7:
        '<h2>✅ Answer Key — Teacher’s Sheet</h2>' +
        '<p style="font-size:10pt;color:var(--gris);">This sheet is printed <strong>separately</strong>: it is only for the teacher or for guided self-assessment.</p>' +
        '<div class="pauta">' +
        '<div><span class="pt">I. Fill in:</span> 1. corner store &nbsp; 2. lunch &nbsp; 3. burned &nbsp; 4. work &nbsp; 5. paper &nbsp; 6. guess &nbsp; 7. fifty &nbsp; 8. line &nbsp; 9. after &nbsp; 10. water</div>' +
        '<div><span class="pt">II. True or False:</span> 1T, 2F, 3T, 4F, 5T, 6F, 7T, 8F, 9F, 10F</div>' +
        '<div><span class="pt">III. Multiple choice:</span> 1b, 2a, 3c, 4d, 5b, 6c, 7d, 8b, 9c, 10a</div>' +
        '<div><span class="pt">IV. Matching:</span> 1C, 2H, 3E, 4I, 5A, 6G, 7J, 8B, 9F, 10D</div>' +
        '</div>' +
        '<div class="nota-doc">' +
        '<strong>Note for the teacher:</strong> this study sheet is based on the interactive content of the M.E.T.A.S platform, ' +
        '«Mission Computational Thinking» (Basic Education), stage 1 of the Code Path (Programming) and suitable from 4th grade on. ' +
        'It works on computational thinking with a fully unplugged approach — this stage does not use any simulator yet —: ' +
        'algorithms from everyday Honduran life (the recipe for baleadas, raising the flag, planting a bean, the nance drink), ' +
        'exact vs. ambiguous instructions, decomposition of big problems, patterns and abstraction. The interactive mission ' +
        '(QR code on the cover) includes the «robot teacher» lab with 4 scenarios and 4 challenges per scenario; the unplugged ' +
        'activities on page 3 («The human robot» and «Decompose the fair») cover the same concepts with no device at all: in the ' +
        'first one, a student literally carries out another student’s ambiguous instructions so the failure becomes obvious; in the ' +
        'second one, the teams decompose the school fair together. The «Test Yourself» section mirrors the formats of the ' +
        'platform’s printable test (fill in, true/false, multiple choice and matching).' +
        '</div>'
    },

    /* Rótulos sueltos: botón de impresión y pies de página */
    frases: {
      '🖨️ Imprimir la ficha': '🖨️ Print the study sheet',
      '· Ficha Didáctica · El Pensamiento Computacional': '· Study Sheet · Computational Thinking',
      '· Ficha Didáctica · El Pensamiento Computacional · Hoja del Docente': '· Study Sheet · Computational Thinking · Teacher’s Sheet'
    },

    fragmentos: [
      [/Página (\d+)/g, 'Page $1']
    ]
  };
})();
