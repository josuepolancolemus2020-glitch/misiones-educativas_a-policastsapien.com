/* ============================================================
   Ficha didáctica «Electricidad para Robots» — versión en inglés
   ------------------------------------------------------------
   Misma traducción de autor que la misión (circuit · source ·
   switch · load · series · parallel · conductor · insulator) y en
   inglés AMERICANO, que es el que enseñan las bilingües de
   Honduras: color, center, aluminum, flashlight.

   Las 7 páginas se traducen enteras (data-i18n="p1".."p7") para
   que la maquetación impresa no se desarme: cada recuadro cabe
   donde debe y ninguna página queda a medias.

   IMPORTANTE para el docente: la Columna B de los pareados
   conserva EL MISMO ORDEN que en español, así la pauta
   (1C · 2E · 3A · 4I · 5G · 6H · 7B · 8J · 9D · 10F) sigue
   siendo válida en las dos versiones. Lo mismo vale para el
   completar, el V/F y la selección múltiple.
   ============================================================ */
(function () {
  'use strict';

  window.MISION_EN = {

    titulo: 'Study Sheet · Mission: Electricity for Robots',

    html: {

      /* ═══════════ PÁGINA 1 ═══════════ */
      p1:
        '<div class="idline"><span>Name:</span><span class="raya"></span><span>Student No.:</span><span class="raya corta"></span></div>' +

        '<div class="fh">' +
        '<div class="fh-txt">' +
        '<div class="f-badge">📄 Study Sheet: Mission — Electricity for Robots</div>' +
        '<div class="f-meta"><b>Subject:</b> Robotics &nbsp;·&nbsp; <b>Level:</b> Basic Education &nbsp;·&nbsp; <b>Robot Path · Stage 4</b></div>' +
        '<div class="f-meta"><b>Topic:</b> The basic circuit (source, wires, switch and load), open and closed circuits, series and parallel, conductors and insulators, voltage, current and resistance, and electrical safety</div>' +
        '</div>' +
        '<div class="fh-qr">' +
        '<img src="img/qr-mision-electricidad-robots.png" alt="Mission QR code">' +
        '<span>📷 Play the mission on your phone</span>' +
        '</div>' +
        '</div>' +

        '<h2>🎯 Learning Objectives</h2>' +

        '<ol class="objetivos">' +
        '<li>Identify the <strong>parts of the basic circuit</strong>: source, wires, switch and load.</li>' +
        '<li>Explain why current needs a <strong>closed path</strong> and what an open circuit is.</li>' +
        '<li>Tell a <strong>series</strong> circuit apart from a <strong>parallel</strong> circuit, and know what each one means in practice.</li>' +
        '<li>Sort materials into <strong>conductors</strong> and <strong>insulators</strong>.</li>' +
        '<li>Use the ideas of <strong>voltage, current and resistance</strong> in your own words, and explain LED polarity.</li>' +
        '<li>Apply the <strong>electrical safety rules</strong> in the classroom and at home.</li>' +
        '<li>Connect electricity with the mission <strong>Energy</strong>: it turns into light, movement and sound.</li>' +
        '</ol>' +

        '<h2>🔌 1. The basic circuit</h2>' +

        '<p>An <strong>electric circuit</strong> is a <strong>closed path</strong> that current travels along. The current ' +
        'leaves one terminal of the battery, runs along the wires, goes through the load and <strong>comes back</strong> to the ' +
        'other terminal. If the path is cut at any point, <strong>nothing works</strong>.</p>' +

        '<div class="ilus">' +
        '<div class="ilus-t">The four parts work together: if one is missing, the circuit does not work</div>' +
        '<div class="celula">' +
        '<div class="cf"><span class="c-emoji">🔋</span><b>Source</b>The battery: it pushes the current. It has a + terminal and a − terminal.</div>' +
        '<div class="cb"><span class="c-emoji">🧵</span><b>Wires</b>The path: copper inside, plastic outside.</div>' +
        '<div class="ci"><span class="c-emoji">🔘</span><b>Switch</b>The gate: it opens or closes the way for the current.</div>' +
        '<div class="cc"><span class="c-emoji">💡</span><b>Load</b>Whatever puts the electricity to use: LED, motor or buzzer.</div>' +
        '</div>' +
        '</div>' +

        '<div class="caja truco">💡 <b>The water trick:</b> the <strong>battery</strong> is the pump that pushes, the <strong>wires</strong> ' +
        'are the channel, the <strong>switch</strong> is the floodgate and the <strong>LED</strong> is the mill that puts the water to work. ' +
        'If the channel breaks, the mill stops.</div>' +

        '<div class="caja idea">📖 <b>Key fact:</b> electricity is a <strong>form of energy</strong>, as you learned in ' +
        'the mission <strong>Energy</strong>. In the LED it turns into <strong>light</strong>, in the motor into ' +
        '<strong>movement</strong> and in the buzzer into <strong>sound</strong>.</div>',

      /* ═══════════ PÁGINA 2 ═══════════ */
      p2:
        '<h2 style="margin-top:0;">🟢🔴 2. Closed circuit and open circuit</h2>' +

        '<div class="tri">' +
        '<div class="tnuc"><b>🟢 Closed — it works</b>The path is <strong>complete</strong>: the current leaves the <strong>+</strong>, goes through the load and comes back to the <strong>−</strong>. The LED lights up, the motor spins, the buzzer sounds.</div>' +
        '<div class="torg"><b>🔴 Open — it does not work</b>The path is <strong>cut</strong>: switch turned off, loose wire or a burned-out bulb in series. No current flows even with a brand-new battery.</div>' +
        '</div>' +

        '<h3>✏️ The symbols for drawing circuits</h3>' +

        '<div class="ilus">' +
        '<div class="ilus-t">This is how a basic circuit is drawn: battery, switch, resistor and LED</div>' +
        '<svg viewBox="0 0 460 150" width="430" role="img" aria-label="Basic circuit drawn with symbols">' +
        '<g fill="none" stroke="#0e7490" stroke-width="3" stroke-linecap="round">' +
        '<path d="M40 30 H150"/><path d="M195 30 H420"/>' +
        '<path d="M40 30 V60"/><path d="M40 90 V120"/><path d="M40 120 H420"/>' +
        '<path d="M420 30 V55"/><path d="M420 85 V120"/>' +
        '</g>' +
        '<g stroke="#b45309" stroke-width="3"><path d="M22 60 H58"/><path d="M32 70 H48"/><path d="M22 80 H58"/><path d="M32 90 H48"/></g>' +
        '<text x="64" y="66" font-size="12" font-weight="bold" fill="#b45309">+</text>' +
        '<text x="64" y="94" font-size="12" font-weight="bold" fill="#b45309">–</text>' +
        '<text x="40" y="140" font-size="10" text-anchor="middle" fill="#5b6773">battery (source)</text>' +
        '<circle cx="150" cy="30" r="4" fill="#c2410c"/><circle cx="195" cy="30" r="4" fill="#c2410c"/>' +
        '<path d="M150 30 L190 10" stroke="#c2410c" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
        '<text x="172" y="52" font-size="10" text-anchor="middle" fill="#5b6773">switch (open)</text>' +
        '<rect x="255" y="20" width="46" height="20" fill="#fff" stroke="#0e7490" stroke-width="3"/>' +
        '<text x="278" y="56" font-size="10" text-anchor="middle" fill="#5b6773">resistor</text>' +
        '<circle cx="420" cy="70" r="15" fill="#fff8e1" stroke="#1c7c43" stroke-width="3"/>' +
        '<path d="M413 63 L413 77 L428 70 Z" fill="#1c7c43"/><path d="M428 62 V78" stroke="#1c7c43" stroke-width="3"/>' +
        '<path d="M437 58 l8 -8 M441 66 l8 -8" stroke="#1c7c43" stroke-width="2" fill="none"/>' +
        '<text x="420" y="105" font-size="10" text-anchor="middle" fill="#5b6773">LED (load)</text>' +
        '</svg>' +
        '</div>' +

        '<h2>➖🛣️ 3. Series circuit and parallel circuit</h2>' +

        '<table>' +
        '<tr><th>Connection</th><th>How many paths?</th><th>If one burns out…</th><th>Voltage</th><th>Example</th></tr>' +
        '<tr><td class="k">➖ In series</td><td>Just one</td><td class="no">They ALL go dark</td><td>They share it: they shine dimmer</td><td>Old Christmas tree lights</td></tr>' +
        '<tr><td class="k">🛣️ In parallel</td><td>One for each load</td><td class="si">The rest stay on</td><td>Each load gets all the voltage</td><td>The lights in your house</td></tr>' +
        '</table>' +

        '<div class="caja regla">🎯 <b>Golden rule:</b> the <strong>lights in a house are wired in parallel</strong>. That is why, when the ' +
        'living room bulb burns out, the kitchen one stays on.</div>' +

        '<h2>💪🌊🪨 4. Voltage, current and resistance</h2>' +

        '<table>' +
        '<tr><th>Word</th><th>What is it?</th><th>Measured in</th><th>Example</th></tr>' +
        '<tr><td class="k">💪 Voltage</td><td>The PUSH the source gives</td><td>volts (V)</td><td>AA battery = 1.5 V; wall outlet = 110 V</td></tr>' +
        '<tr><td class="k">🌊 Current</td><td>The AMOUNT of electricity going through</td><td>amperes (A)</td><td>More voltage, more current</td></tr>' +
        '<tr><td class="k">🪨 Resistance</td><td>The OBSTACLE to the flow of current</td><td>ohms (Ω)</td><td>The resistor that protects the LED</td></tr>' +
        '</table>' +

        '<div class="caja idea">➕➖ <b>LED polarity:</b> an LED only lights up <strong>one way round</strong>: its ' +
        '<strong>long leg</strong> goes to the <strong>+</strong> and its <strong>short leg</strong> to the <strong>−</strong>. And it always ' +
        'carries a <strong>resistor</strong>: without one, too much current gets through and it burns out instantly.</div>' +

        '<h2 style="margin-top:0;">🟠🚫 5. Conductors and insulators</h2>' +

        '<p>A wire carries <strong>copper inside</strong> and <strong>plastic outside</strong>: one conducts the current and the ' +
        'other one protects us. This is how materials are sorted:</p>',

      /* ═══════════ PÁGINA 3 ═══════════ */
      p3:
        '<table>' +
        '<tr><th>Type</th><th>Does it let current through?</th><th>Examples</th><th>What is it used for?</th></tr>' +
        '<tr><td class="k">🟠 Conductor</td><td class="si">Yes</td><td>Copper, aluminum, iron, coins, water with salts</td><td>It forms the path of the circuit</td></tr>' +
        '<tr><td class="k">🚫 Insulator</td><td class="no">No</td><td>Plastic, rubber, dry wood, glass, dry cloth</td><td>It covers the wires and protects us</td></tr>' +
        '</table>' +

        '<div class="caja alerta">💧 <b>Careful with water!</b> Tap water, river water and even <strong>sweat</strong> ' +
        'carry <strong>salts</strong> and they do conduct electricity. That is why you <strong>never</strong> touch plugs, wires or ' +
        'appliances with <strong>wet hands</strong>.</div>' +

        '<h2>🦺 6. Electrical safety</h2>' +

        '<table>' +
        '<tr><th>✅ Do this</th><th>⛔ Never do this</th></tr>' +
        '<tr><td>Experiment only with <strong>batteries</strong> (1.5 V or 9 V)</td><td>Experiment with the <strong>110 V wall outlet</strong></td></tr>' +
        '<tr><td>Work with <strong>dry hands</strong></td><td>Touch appliances with <strong>wet hands</strong></td></tr>' +
        '<tr><td>Use wires whose <strong>plastic insulation</strong> is in good shape</td><td>Push wires or nails into the <strong>sockets</strong></td></tr>' +
        '<tr><td>Unplug the charger <strong>by pulling on the plug</strong></td><td>Join the two battery terminals: that is a <strong>short circuit</strong> and the battery heats up</td></tr>' +
        '<tr><td>Take <strong>used batteries</strong> to a collection point</td><td>Throw used batteries in the <strong>regular trash</strong></td></tr>' +
        '</table>' +

        '<h2>🎲 7. Unplugged activities (no computer)</h2>' +

        '<ul>' +
        '<li><strong>✏️ Draw the circuit:</strong> in your notebook, draw a basic circuit using the <strong>symbols</strong> ' +
        'from page 2 (battery, switch, resistor and LED) and mark the <strong>path of the current</strong> with arrows. ' +
        'Then draw the same circuit with the switch <strong>open</strong> and explain what happens.</li>' +
        '<li><strong>🔋 Build a real circuit:</strong> with an <strong>AA battery</strong>, two pieces of <strong>wire</strong> ' +
        'and a <strong>flashlight bulb</strong>, form the closed path and light it up. Then let one wire go and watch. ' +
        'Batteries only, never the wall outlet!</li>' +
        '<li><strong>🔎 Conductor hunters:</strong> use your circuit to test 6 objects from the classroom (nail, ruler, coin, ' +
        'eraser, key, stick) by touching them with the two wire ends. Fill in this table:</li>' +
        '</ul>' +

        '<table>' +
        '<tr><th style="width:34%;">Object tested</th><th>Did the bulb light up?</th><th>Conductor or insulator?</th></tr>' +
        '<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>' +
        '<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>' +
        '<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>' +
        '<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>' +
        '<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>' +
        '<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>' +
        '</table>',

      /* ═══════════ PÁGINA 4 ═══════════ */
      p4:
        '<ul>' +
        '<li><strong>🦺 Safety detective:</strong> walk around your home and write down <strong>3 safe practices</strong> and ' +
        '<strong>3 dangerous ones</strong> that you see with electricity. Next to each dangerous one, write how it should be fixed.</li>' +
        '</ul>' +

        '<div class="caja hn">🇭🇳 <b>Electricity in your community:</b> during a <strong>power outage</strong>, the battery flashlight ' +
        'works because it carries its own closed circuit. In small villages with no power lines, the <strong>solar panel</strong> ' +
        'charges a battery during the day and at night it lights the LEDs. And the <strong>cell phone charger</strong> turns the 110 V from the ' +
        'outlet into a small, safe voltage. Electricity, properly understood, changes the life of a community! 💚</div>' +

        '<h2>✍️ 8. Test Yourself! Activities</h2>' +

        '<h3>I. Fill in the blanks <span class="val">(Value: 10 points each)</span></h3>' +

        '<ol>' +
        '<li>Current flows only if the path is <span class="linea-resp"></span>.</li>' +
        '<li>The battery is the <span class="linea-resp"></span> of energy of the circuit.</li>' +
        '<li>The <span class="linea-resp"></span> opens or closes the way for the current.</li>' +
        '<li>Inside the wire there is <span class="linea-resp"></span>, which is a good conductor.</li>' +
        '<li>Dry plastic is an <span class="linea-resp"></span>.</li>' +
        '<li>In a <span class="linea-resp"></span> circuit all the bulbs go dark if one burns out.</li>' +
        '<li>The lights in a house are wired in <span class="linea-resp"></span>.</li>' +
        '<li>The LED carries a <span class="linea-resp"></span> so the current does not burn it out.</li>' +
        '<li>The push the source gives is called <span class="linea-resp"></span>.</li>' +
        '<li>To experiment in the classroom we use only <span class="linea-resp"></span>.</li>' +
        '</ol>' +

        '<h3>II. True or False <span class="val">(Value: 10 points each)</span></h3>' +

        '<ol>' +
        '<li>____ Electric current needs a closed path in order to flow.</li>' +
        '<li>____ Dry plastic and dry wood are conductors.</li>' +
        '<li>____ The switch is used to open or close the path of the current.</li>' +
        '<li>____ The lights in a house are wired in series.</li>' +
        '<li>____ In a series circuit, if one bulb burns out they all go dark.</li>' +
        '<li>____ The LED has polarity: it only lights up connected one way round.</li>' +
        '<li>____ It is safe to experiment with the 110-volt wall outlet.</li>' +
        '<li>____ Water with salts conducts electricity.</li>' +
        '<li>____ Used batteries go in the regular household trash.</li>' +
        '<li>____ A short circuit heats up the battery and can be dangerous.</li>' +
        '</ol>',

      /* ═══════════ PÁGINA 5 ═══════════ */
      p5:
        '<h3>III. Multiple choice <span class="val">(Value: 10 points each)</span> — Circle the correct letter.</h3>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">1</span>What is an electric circuit?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> a coiled-up wire</span>' +
        '<span class="op"><i>b</i> the closed path that current flows along</span>' +
        '<span class="op"><i>c</i> a dead battery</span>' +
        '<span class="op"><i>d</i> a painted bulb</span>' +
        '</div></div>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">2</span>What are the parts of a basic circuit?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> sun, water, air and soil</span>' +
        '<span class="op"><i>b</i> motor, wheel, screw and nail</span>' +
        '<span class="op"><i>c</i> source, wires, switch and load</span>' +
        '<span class="op"><i>d</i> paper, glue, scissors and ruler</span>' +
        '</div></div>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">3</span>What is the switch for?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> to open or close the path of the current</span>' +
        '<span class="op"><i>b</i> to raise the voltage</span>' +
        '<span class="op"><i>c</i> to cool the battery down</span>' +
        '<span class="op"><i>d</i> to paint the circuit</span>' +
        '</div></div>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">4</span>If a wire comes loose, the circuit is left…</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> in parallel</span>' +
        '<span class="op"><i>b</i> in series</span>' +
        '<span class="op"><i>c</i> closed</span>' +
        '<span class="op"><i>d</i> open, and nothing works</span>' +
        '</div></div>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">5</span>In a SERIES circuit one bulb burns out. What happens?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> the others shine brighter</span>' +
        '<span class="op"><i>b</i> they all go dark</span>' +
        '<span class="op"><i>c</i> nothing happens</span>' +
        '<span class="op"><i>d</i> the battery recharges</span>' +
        '</div></div>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">6</span>Which of these materials is an INSULATOR?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> copper</span>' +
        '<span class="op"><i>b</i> iron</span>' +
        '<span class="op"><i>c</i> dry plastic</span>' +
        '<span class="op"><i>d</i> salt water</span>' +
        '</div></div>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">7</span>Why does an LED carry a resistor?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> so the current does not burn it out</span>' +
        '<span class="op"><i>b</i> to give it color</span>' +
        '<span class="op"><i>c</i> so it weighs more</span>' +
        '<span class="op"><i>d</i> to glue it to the wire</span>' +
        '</div></div>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">8</span>What is a short circuit?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> a parallel circuit</span>' +
        '<span class="op"><i>b</i> a colorful wire</span>' +
        '<span class="op"><i>c</i> a very short, pretty circuit</span>' +
        '<span class="op full"><i>d</i> a shortcut with no load that heats up the battery</span>' +
        '</div></div>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">9</span>Which of these practices is SAFE?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> pushing wires into the wall outlet</span>' +
        '<span class="op full"><i>b</i> experimenting only with batteries and insulated wires</span>' +
        '<span class="op"><i>c</i> touching plugs with wet hands</span>' +
        '<span class="op"><i>d</i> joining the two battery terminals with wire</span>' +
        '</div></div>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">10</span>In a motor, what does electrical energy turn into?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> light</span>' +
        '<span class="op"><i>b</i> cold</span>' +
        '<span class="op"><i>c</i> movement</span>' +
        '<span class="op"><i>d</i> water</span>' +
        '</div></div>',

      /* ═══════════ PÁGINA 6 ═══════════
         La Columna B conserva el orden del español: la pauta
         1C · 2E · 3A · 4I · 5G · 6H · 7B · 8J · 9D · 10F vale igual. */
      p6:
        '<h3>IV. Matching <span class="val">(Value: 10 points each)</span> — Write on the line the letter from Column B that matches.</h3>' +

        '<table>' +
        '<tr><th style="width:40%;">Column A</th><th>Column B</th></tr>' +
        '<tr><td>1. ____ Electric circuit</td><td>A. It opens or closes the way for the current</td></tr>' +
        '<tr><td>2. ____ Source (battery)</td><td>B. Each load has its own path; that is how house lights are wired</td></tr>' +
        '<tr><td>3. ____ Switch</td><td>C. A closed path that current flows along</td></tr>' +
        '<tr><td>4. ____ Conductor</td><td>D. The obstacle that opposes the flow of current; it protects the LED</td></tr>' +
        '<tr><td>5. ____ Insulator</td><td>E. It pushes the current; it has a + terminal and a − terminal</td></tr>' +
        '<tr><td>6. ____ Series circuit</td><td>F. A shortcut with no load that heats up the battery; it is dangerous</td></tr>' +
        '<tr><td>7. ____ Parallel circuit</td><td>G. A material that does not let current through, such as plastic</td></tr>' +
        '<tr><td>8. ____ Voltage</td><td>H. A single path: if one bulb burns out, they all go dark</td></tr>' +
        '<tr><td>9. ____ Resistance</td><td>I. A material that lets current through, such as copper</td></tr>' +
        '<tr><td>10. ____ Short circuit</td><td>J. The push of the source, measured in volts</td></tr>' +
        '</table>' +

        '<div class="felic">' +
        '🏅 <b>Congratulations! You have completed the Mission Electricity for Robots.</b> You now know that current needs a ' +
        'closed path; that the switch opens and closes that path; that in series they all go dark while in parallel each load ' +
        'keeps going on its own; that copper conducts and plastic insulates; and that electrical safety is always respected. ' +
        'Keep moving along the Robot Path! ⚡🤖' +
        '</div>' +

        '<h2>📏 Assessment Rubric</h2>' +

        '<table class="rubrica">' +
        '<tr><th>Activity</th><th>Where</th><th>Value</th><th>Grade</th><th>Comments</th></tr>' +
        '<tr><td>Copied the contents of this material into the Robotics notebook.</td><td class="lg">Homework</td><td>100</td><td>&nbsp;</td><td>&nbsp;</td></tr>' +
        '<tr><td>Solved the «Test Yourself» section right on this study sheet.</td><td class="lg">Classwork, the day before the test</td><td>100</td><td>&nbsp;</td><td>&nbsp;</td></tr>' +
        '<tr><td>Drew the circuit with symbols, built the circuit with an AA battery and filled in the conductor and insulator table.</td><td class="lg">Homework</td><td>100</td><td>&nbsp;</td><td>&nbsp;</td></tr>' +
        '<tr><td>Printed test taken in class.</td><td class="lg">Classroom assessment</td><td>100</td><td>&nbsp;</td><td>&nbsp;</td></tr>' +
        '<tr><td colspan="3" style="text-align:right;font-weight:700;">Final grade average →</td><td colspan="2">&nbsp; %</td></tr>' +
        '</table>' +

        '<p style="font-size:9pt;color:var(--gris);">Remember that you have already learned how to work out an average: add up the total value obtained and divide it by four. ' +
        'The result is your final grade. You will lose points if you do not finish the work, if your handwriting is not readable or if you write with spelling mistakes.</p>',

      /* ═══════════ PÁGINA 7 · HOJA SUELTA DEL DOCENTE ═══════════ */
      p7:
        '<h2>✅ Answer Key — Teacher’s Sheet</h2>' +

        '<p style="font-size:10pt;color:var(--gris);">This page prints on a <strong>separate sheet</strong>: it is only for the teacher or for guided self-assessment.</p>' +

        '<div class="pauta">' +
        '<div><span class="pt">I. Fill in the blanks:</span> 1. closed &nbsp; 2. source &nbsp; 3. switch &nbsp; 4. copper &nbsp; 5. insulator &nbsp; 6. series &nbsp; 7. parallel &nbsp; 8. resistor &nbsp; 9. voltage &nbsp; 10. batteries</div>' +
        '<div><span class="pt">II. True or False:</span> 1T, 2F, 3T, 4F, 5T, 6T, 7F, 8T, 9F, 10T</div>' +
        '<div><span class="pt">III. Multiple choice:</span> 1b, 2c, 3a, 4d, 5b, 6c, 7a, 8d, 9b, 10c</div>' +
        '<div><span class="pt">IV. Matching:</span> 1C, 2E, 3A, 4I, 5G, 6H, 7B, 8J, 9D, 10F</div>' +
        '</div>' +

        '<div class="caja regla" style="margin-top:12px;">🔎 <b>Answers for the conductor and insulator table (page 3):</b> ' +
        'the ones that light the bulb (CONDUCTORS) are the nail, the coin and the key; the ones that do not (INSULATORS) are the plastic ruler, ' +
        'the rubber eraser and the dry wooden stick. If the bulb does not light up with a metal object, check first that the ' +
        'circuit is properly closed before concluding that it is an insulator.</div>' +

        '<div class="nota-doc">' +
        '<strong>Note for the teacher:</strong> this study sheet is based on the interactive content of the M.E.T.A.S platform, ' +
        '«Mission Electricity for Robots» (Basic Education, Cycles II and III), stage 4 of the Robot Path in the Robotics area. ' +
        'The concepts are taught with simple, low-cost material: <strong>AA or 9 V batteries, wire, a flashlight bulb, ' +
        'an LED with its resistor and a homemade switch</strong>; never with power from the wall outlet ' +
        '(110 V), which is excluded from every school activity. The sheet includes the unplugged activities on page 3: ' +
        'drawing the circuit with symbols, building a real circuit with an AA battery, testing conductors and insulators ' +
        'with classroom objects, and the safety-detective walk around the home. The topic links to the mission ' +
        '<strong>Energy</strong> in Natural Sciences: electricity is a form of energy that turns into light ' +
        '(LED), movement (motor) and sound (buzzer). It also prepares the next stage of the Robot Path, where ' +
        'these circuits power sensors and actuators. It is a good idea to supervise the building of circuits, check that the ' +
        'batteries are never left in a short circuit (they heat up) and organize the collection of used batteries with the class. The interactive ' +
        'mission (QR code on the cover) lets students practice in the <strong>Circuit Laboratory</strong> ' +
        '—opening and closing the switch, seeing the loose wire, the battery backwards, the short circuit, series and parallel— ' +
        'with instant feedback before solving this sheet. ' +
        '<em>The Spanish and English versions share the same answer key: Column B keeps the same order in both.</em>' +
        '</div>'
    },

    /* Rótulos sueltos: botón de impresión y pies de página */
    frases: {
      '🖨️ Imprimir la ficha': '🖨️ Print the study sheet',
      '· Ficha Didáctica · Electricidad para Robots': '· Study Sheet · Electricity for Robots',
      '· Ficha Didáctica · Electricidad para Robots · Hoja del Docente': '· Study Sheet · Electricity for Robots · Teacher’s Sheet'
    },

    fragmentos: [
      [/Página (\d+)/g, 'Page $1']
    ]
  };
})();
