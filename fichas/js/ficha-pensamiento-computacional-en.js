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
        '<li>The ordered steps for getting something done make up an <span class="linea-resp"></span>.</li>' +
        '<li>An instruction that everyone carries out the same way is an <span class="linea-resp"></span> instruction.</li>' +
        '<li>«Put in a little» is an <span class="linea-resp"></span> instruction.</li>' +
        '<li>Splitting a big problem into small parts is called <span class="linea-resp"></span>.</li>' +
        '<li>Something that repeats over and over is a <span class="linea-resp"></span>.</li>' +
        '<li>Keeping only what matters, like a map, is called <span class="linea-resp"></span>.</li>' +
        '<li>In an algorithm the <span class="linea-resp"></span> of the steps matters a lot.</li>' +
        '<li>Every step of an algorithm starts with a clear <span class="linea-resp"></span>.</li>' +
        '<li>The computer does <span class="linea-resp"></span> what it is told.</li>' +
        '<li>A big problem is beaten by splitting it into small <span class="linea-resp"></span>.</li>' +
        '</ol>' +
        '<h3>II. True or False <span class="val">(Value: 10 points each)</span></h3>' +
        '<ol>' +
        '<li>____ An algorithm is a list of ordered steps for getting something done.</li>' +
        '<li>____ «Put in a little salt» is an exact instruction.</li>' +
        '<li>____ «Add 2 spoonfuls of sugar» is an exact instruction.</li>' +
        '<li>____ The computer guesses what we mean.</li>' +
        '<li>____ Decomposing means splitting a big problem into small parts.</li>' +
        '<li>____ A pattern is something that repeats.</li>' +
        '<li>____ Abstraction is keeping only what matters, like a map.</li>' +
        '<li>____ The order of the steps of an algorithm does not matter.</li>' +
        '<li>____ The recipe for baleadas is an algorithm.</li>' +
        '<li>____ Every step of an algorithm must start with a clear verb.</li>' +
        '</ol>',

      /* ═══════════ PÁGINA 5 ═══════════ */
      p5:
        '<h3>III. Multiple choice <span class="val">(Value: 10 points each)</span> — Circle the correct letter.</h3>' +
        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">1</span>What is an algorithm?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> a pretty drawing</span>' +
        '<span class="op"><i>b</i> ordered steps for getting something done</span>' +
        '<span class="op"><i>c</i> a kind of computer</span>' +
        '<span class="op"><i>d</i> a very big number</span>' +
        '</div></div>' +
        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">2</span>Which one of these instructions is EXACT?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> walk over there</span>' +
        '<span class="op"><i>b</i> take 3 steps forward</span>' +
        '<span class="op"><i>c</i> move a little</span>' +
        '<span class="op"><i>d</i> go fast</span>' +
        '</div></div>' +
        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">3</span>Why does the instruction «put in a little» fail?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> everyone understands a different amount</span>' +
        '<span class="op"><i>b</i> because it is very long</span>' +
        '<span class="op"><i>c</i> because it is in English</span>' +
        '<span class="op"><i>d</i> because it has numbers</span>' +
        '</div></div>' +
        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">4</span>What does a computer do with instructions?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> it guesses what we want</span>' +
        '<span class="op"><i>b</i> it picks the one it likes</span>' +
        '<span class="op"><i>c</i> it changes their order</span>' +
        '<span class="op"><i>d</i> it runs exactly what it is told</span>' +
        '</div></div>' +
        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">5</span>Decomposing a problem means…</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> erasing it</span>' +
        '<span class="op"><i>b</i> splitting it into small parts</span>' +
        '<span class="op"><i>c</i> making it bigger</span>' +
        '<span class="op"><i>d</i> hiding it</span>' +
        '</div></div>' +
        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">6</span>What is a pattern?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> something that repeats</span>' +
        '<span class="op"><i>b</i> a bug in the program</span>' +
        '<span class="op"><i>c</i> a map</span>' +
        '<span class="op"><i>d</i> a prize</span>' +
        '</div></div>' +
        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">7</span>Abstraction means…</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> writing everything in detail</span>' +
        '<span class="op"><i>b</i> repeating the steps</span>' +
        '<span class="op"><i>c</i> keeping only what matters</span>' +
        '<span class="op"><i>d</i> making a realistic drawing</span>' +
        '</div></div>' +
        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">8</span>Which one is an algorithm from your everyday life?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> the color blue</span>' +
        '<span class="op"><i>b</i> a stone</span>' +
        '<span class="op"><i>c</i> a number</span>' +
        '<span class="op"><i>d</i> brushing your teeth step by step</span>' +
        '</div></div>' +
        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">9</span>To organize the school fair it is best to…</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> split it into parts: food, games, invitations</span>' +
        '<span class="op"><i>b</i> do everything at once with no plan</span>' +
        '<span class="op"><i>c</i> wait for it to organize itself</span>' +
        '<span class="op"><i>d</i> cancel it</span>' +
        '</div></div>' +
        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">10</span>A good algorithm step starts with…</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> a joke</span>' +
        '<span class="op"><i>b</i> a clear verb (wash, cut, glue)</span>' +
        '<span class="op"><i>c</i> a greeting</span>' +
        '<span class="op"><i>d</i> a riddle</span>' +
        '</div></div>',

      /* ═══════════ PÁGINA 6 ═══════════
         La Columna B conserva el orden del original: la pauta
         1D · 2F · 3H · 4A · 5I · 6J · 7E · 8B · 9G · 10C vale igual. */
      p6:
        '<h3>IV. Matching <span class="val">(Value: 10 points each)</span> — Write on the line the letter from Column B that matches.</h3>' +
        '<table>' +
        '<tr><th style="width:42%;">Column A</th><th>Column B</th></tr>' +
        '<tr><td>1. ____ Algorithm</td><td>A. A list of steps in order</td></tr>' +
        '<tr><td>2. ____ Exact instruction</td><td>B. Each action of the algorithm; it starts with a verb</td></tr>' +
        '<tr><td>3. ____ Ambiguous instruction</td><td>C. A machine that does exactly what it is told</td></tr>' +
        '<tr><td>4. ____ Sequence</td><td>D. Ordered steps for getting a task done</td></tr>' +
        '<tr><td>5. ____ Decompose</td><td>E. Keeping only what matters, like a map</td></tr>' +
        '<tr><td>6. ____ Pattern</td><td>F. A command that everyone carries out the same way</td></tr>' +
        '<tr><td>7. ____ Abstraction</td><td>G. A huge task that is beaten part by part</td></tr>' +
        '<tr><td>8. ____ Step</td><td>H. A confusing command that everyone understands differently</td></tr>' +
        '<tr><td>9. ____ Big problem</td><td>I. Split a big problem into small parts</td></tr>' +
        '<tr><td>10. ____ Computer</td><td>J. Something that repeats over and over</td></tr>' +
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
        '<div><span class="pt">I. Fill in:</span> 1. algorithm &nbsp; 2. exact &nbsp; 3. ambiguous &nbsp; 4. decomposing &nbsp; 5. pattern &nbsp; 6. abstraction &nbsp; 7. order &nbsp; 8. verb &nbsp; 9. exactly &nbsp; 10. parts</div>' +
        '<div><span class="pt">II. True or False:</span> 1T, 2F, 3T, 4F, 5T, 6T, 7T, 8F, 9T, 10T</div>' +
        '<div><span class="pt">III. Multiple choice:</span> 1b, 2b, 3a, 4d, 5b, 6a, 7c, 8d, 9a, 10b</div>' +
        '<div><span class="pt">IV. Matching:</span> 1D, 2F, 3H, 4A, 5I, 6J, 7E, 8B, 9G, 10C</div>' +
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
