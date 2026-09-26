/* ============================================================
   Ficha didáctica «Motores y Mecanismos» — versión en inglés
   ------------------------------------------------------------
   Misma traducción de autor que la misión (motor · actuator ·
   gear · pinion · teeth · idler gear · gear ratio · pulley ·
   belt · lever · fulcrum · wheel and axle · worm gear · crank
   and rod · chain and sprockets) y en inglés AMERICANO, que es
   el que enseñan las bilingües de Honduras: color, center,
   «Student No.».

   Las 7 páginas se traducen enteras (data-i18n="p1".."p7") para
   que la maquetación impresa no se desarme: cada recuadro cabe
   donde debe y ninguna página queda a medias.

   IMPORTANTE para el docente: la Columna B de los pareados
   conserva EL MISMO ORDEN que en español, así la pauta
   (1F · 2I · 3A · 4J · 5C · 6H · 7B · 8E · 9D · 10G) sigue
   siendo válida en las dos versiones. Lo mismo vale para el
   completar, el V/F y la selección múltiple.
   ============================================================ */
(function () {
  'use strict';

  window.MISION_EN = {

    titulo: 'Study Sheet · Mission: Motors and Mechanisms',

    html: {

      /* ═══════════ PÁGINA 1 ═══════════ */
      p1:
        '<div class="idline"><span>Name:</span><span class="raya"></span><span>Student No.:</span><span class="raya corta"></span></div>' +

        '<div class="fh">' +
        '<div class="fh-txt">' +
        '<div class="f-badge">📄 Study Sheet: Mission — Motors and Mechanisms</div>' +
        '<div class="f-meta"><b>Subject:</b> Robotics &nbsp;·&nbsp; <b>Level:</b> Basic Education &nbsp;·&nbsp; <b>Robot Path · Stage 3</b></div>' +
        '<div class="f-meta"><b>Topic:</b> How a robot moves: the motor as an actuator (DC motor and servomotor), gears and direction of rotation, the force-speed ratio, pulleys and belts, levers, wheel and axle, worm gear and crank and rod, with the mechanisms of real life in Honduras</div>' +
        '</div>' +
        '<div class="fh-qr">' +
        '<img src="img/qr-mision-motores-mecanismos.png" alt="Mission QR code">' +
        '<span>📷 Play the mission on your phone</span>' +
        '</div>' +
        '</div>' +

        '<h2>🎯 Learning Objectives</h2>' +

        '<ol class="objetivos">' +
        '<li>Explain that the <strong>motor</strong> is the actuator that turns electrical energy into <strong>rotation</strong>.</li>' +
        '<li>Tell the <strong>DC motor</strong>, the <strong>servomotor</strong> and the <strong>gearmotor</strong> apart.</li>' +
        '<li>Apply the two rules of <strong>gears</strong>: direction of rotation and tooth ratio.</li>' +
        '<li>Decide whether a setup gives more <strong>force</strong> or more <strong>speed</strong>, and explain the trade.</li>' +
        '<li>Recognize <strong>pulleys and belts</strong>, <strong>levers</strong>, <strong>wheel and axle</strong>, <strong>worm gear</strong> and <strong>crank and rod</strong>.</li>' +
        '<li>Spot mechanisms in real life in <strong>Honduras</strong>: mill, bicycle, coffee pulper, wheelbarrow and gate.</li>' +
        '</ol>' +

        '<h2>⚙️ 1. The motor: the actuator that provides movement</h2>' +

        '<p>The <strong>motor</strong> is the most important <strong>actuator</strong> in a robot: it turns the battery’s ' +
        '<strong>electrical energy</strong> into <strong>rotation</strong>. But that turning comes out ' +
        '<strong>very fast and with little force</strong>, and it is almost never useful that way. That is why the motor is connected to ' +
        '<strong>mechanisms</strong> (gears, pulleys, levers) that <strong>transmit</strong> the movement to wherever it ' +
        'is needed and <strong>transform</strong> it into the one required.</p>' +

        '<div class="caja truco">💡 <b>Trick:</b> the motor is the <strong>muscle</strong> and the mechanisms are the ' +
        '<strong>bones and joints</strong>. A muscle on its own lifts nothing: it needs something to push against.</div>' +

        '<h3>🔌📐🧰 The three motors you should know</h3>' +

        '<div class="ilus">' +
        '<div class="ilus-t">From the battery to the job: energy always follows the same path</div>' +
        '<div class="celula">' +
        '<div class="cm"><span class="c-emoji">🔌</span><b>DC motor</b>It turns nonstop as long as there is current: lots of speed, little force.</div>' +
        '<div class="cc"><span class="c-emoji">📐</span><b>Servomotor</b>It turns to an exact angle (90°, 180°) and stays there.</div>' +
        '<div class="cn"><span class="c-emoji">🧰</span><b>Gearmotor</b>Motor + gears: it turns slower, but with far more force.</div>' +
        '</div>' +
        '<p style="font-size:9pt;color:var(--gris);margin:8px 0 0;text-align:center;">✅ The path of the energy: 🔋 battery → ⚙️ motor → 🦷 mechanism → 💪 final work.</p>' +
        '</div>' +

        '<h2 style="margin-top:0;">🦷 2. Gears: teeth that shake hands</h2>' +

        '<p>A <strong>gear</strong> (or pinion) is a wheel with <strong>teeth</strong>. When the teeth of two ' +
        'gears <strong>mesh</strong>, one drags the other along without slipping. There are <strong>two rules</strong> that never ' +
        'fail and that you must learn by heart:</p>',

      /* ═══════════ PÁGINA 2 ═══════════ */
      p2:
        '<div class="tri">' +
        '<div class="tnuc"><b>🔄 Rule 1: the direction</b>Two gears in contact turn in <strong>opposite directions</strong>. With <strong>three</strong> gears, the first and the third turn <strong>alike</strong>: the middle one is the <strong>idler gear</strong>.</div>' +
        '<div class="torg"><b>⚖️ Rule 2: the ratio</b><strong>Small drives big</strong> = more <strong>force</strong> and less speed. <strong>Big drives small</strong> = more <strong>speed</strong> and less force.</div>' +
        '</div>' +

        '<div class="ilus">' +
        '<div class="ilus-t">A train of three gears: the direction is reversed at every contact</div>' +
        '<div class="tren">' +
        '<div class="eng"><span class="giro">↻</span><span class="dts">10 teeth</span><span class="dts">MOTOR</span></div>' +
        '<span class="flecha">→</span>' +
        '<div class="eng med"><span class="giro">↺</span><span class="dts">20 teeth</span><span class="dts">IDLER</span></div>' +
        '<span class="flecha">→</span>' +
        '<div class="eng gra"><span class="giro">↻</span><span class="dts">40 teeth</span><span class="dts">OUTPUT</span></div>' +
        '</div>' +
        '<p style="font-size:9pt;color:var(--gris);margin:6px 0 0;text-align:center;">The first and the third turn the same way (↻). Since the last one has 40 teeth and the first one has 10, the output turns <strong>4 times slower and with 4 times more force</strong>. The middle gear does not change the ratio!</p>' +
        '</div>' +

        '<table>' +
        '<tr><th>Setup</th><th>Direction</th><th>Speed</th><th>Force</th><th>What is it good for?</th></tr>' +
        '<tr><td class="k">⚙️ Small → big</td><td>Opposite</td><td>Down</td><td>Up</td><td>Lifting and dragging weight</td></tr>' +
        '<tr><td class="k">⚙️ Big → small</td><td>Opposite</td><td>Up</td><td>Down</td><td>Running fast, fans</td></tr>' +
        '<tr><td class="k">⚙️ Equal (or with an idler)</td><td>Opposite / 1st and 3rd alike</td><td>Same</td><td>Same</td><td>Only changing the direction</td></tr>' +
        '<tr><td class="k">🌀 Worm gear</td><td>It turns the axis 90°</td><td>Very low</td><td>Very high</td><td>Corn mill, gates</td></tr>' +
        '</table>' +

        '<div class="caja regla">🎯 <b>Golden rule:</b> a mechanism <strong>does not create energy</strong>: it only shares it out. More ' +
        'force always costs speed, and more speed always costs force. <strong>You never win everything.</strong></div>' +

        '<h2>🎡 3. Pulleys and belts: the turning that travels far</h2>' +

        '<p>A <strong>pulley</strong> is a wheel with a <strong>groove</strong> for a rope or a ' +
        '<strong>belt</strong> to run through. With two pulleys and a belt, the turning <strong>travels a distance</strong>, without the parts ' +
        'touching each other.</p>' +

        '<table>' +
        '<tr><th>Setup</th><th>What does it do?</th><th>Example</th></tr>' +
        '<tr><td class="k">Open belt</td><td>Both pulleys turn in the <strong>same direction</strong></td><td>The belt of the mill</td></tr>' +
        '<tr><td class="k">Crossed belt</td><td>It <strong>reverses</strong> the direction of the turning</td><td>Workshop machines</td></tr>' +
        '<tr><td class="k">Fixed pulley</td><td>It changes the <strong>direction</strong> of the force: you pull downward</td><td>The bucket in the well</td></tr>' +
        '<tr><td class="k">Movable pulley</td><td>It helps you lift: <strong>less force</strong> is needed</td><td>The crane, the block and tackle</td></tr>' +
        '</table>' +

        '<h2 style="margin-top:0;">🪝 4. Levers and the other mechanisms</h2>' +

        '<p>A <strong>lever</strong> is a <strong>rigid bar</strong> that turns on a <strong>fulcrum</strong>. ' +
        'It multiplies a person’s force, but there is a deal: the end you push ' +
        '<strong>travels a longer distance</strong> than the load you lift.</p>',

      /* ═══════════ PÁGINA 3 ═══════════ */
      p3:
        '<table>' +
        '<tr><th>Mechanism</th><th>What does it do?</th><th>Examples</th></tr>' +
        '<tr><td class="k">🪝 Lever</td><td>It multiplies the force by turning on the fulcrum</td><td>Seesaw, wheelbarrow, tongs, scissors</td></tr>' +
        '<tr><td class="k">🛞 Wheel and axle</td><td>The wheel turns with the axle and drags the load along with little effort</td><td>Wheelbarrow, cart, robot car</td></tr>' +
        '<tr><td class="k">🌀 Worm gear</td><td>A threaded «worm» drives a toothed wheel: a huge amount of force</td><td>Corn mill, gate motor</td></tr>' +
        '<tr><td class="k">🔁 Crank and rod</td><td>It turns <strong>rotation</strong> into <strong>back-and-forth</strong> motion</td><td>Sewing machine, saw, piston</td></tr>' +
        '<tr><td class="k">🚲 Chain and sprockets</td><td>They carry the turning over a distance without slipping</td><td>Bicycle: chainring and sprocket</td></tr>' +
        '</table>' +

        '<div class="caja idea">📖 <b>Key fact:</b> the <strong>fulcrum</strong> is what makes a bar into a lever. ' +
        'If you place it <strong>close to the load</strong>, you lift more weight with less force.</div>' +

        '<h2>🇭🇳 5. Mechanisms in real life in Honduras</h2>' +

        '<table>' +
        '<tr><th>Where?</th><th>Which mechanism does it use?</th><th>Force or speed?</th></tr>' +
        '<tr><td class="k">🌽 Corn mill</td><td>Crank and worm gear</td><td>Force: it turns slowly and crushes the grain</td></tr>' +
        '<tr><td class="k">🚲 Bicycle</td><td>Chainring, chain and sprockets</td><td>Small sprocket = speed; big sprocket = force</td></tr>' +
        '<tr><td class="k">☕ Coffee pulper</td><td>Crank and gears</td><td>Force to tear the husk off</td></tr>' +
        '<tr><td class="k">🧱 The bricklayer’s wheelbarrow</td><td>Lever + wheel and axle</td><td>Force: a lot of weight is moved with little effort</td></tr>' +
        '<tr><td class="k">🚪 Gate winch</td><td>Gears and worm gear</td><td>Force: a small motor moves a heavy gate</td></tr>' +
        '</table>' +

        '<h2>🎲 6. Unplugged activities (no computer)</h2>' +

        '<ul>' +
        '<li><strong>⚙️ Cardboard gears:</strong> cut out <strong>two cardboard wheels</strong>, a small one and a ' +
        'big one, and give them teeth of the same size with scissors (8 and 16, for example). Pin them onto a board so that ' +
        'the teeth mesh. Mark one tooth with a colored pencil and count: <strong>how many turns does the small one make while ' +
        'the big one makes one?</strong> Write down which wheel turns slower and which one needs more force.</li>' +
        '<li><strong>🪝 A lever with a ruler and a pencil:</strong> put a <strong>pencil</strong> under a <strong>ruler</strong> ' +
        '(that is the fulcrum) and place a small stone at one end. Move the pencil closer to and farther from the stone and ' +
        'write down <strong>when it takes the least effort to lift it</strong> and how far each end goes up or down.</li>' +
        '<li><strong>🎡 A pulley with a thread spool:</strong> push a pencil through a <strong>thread spool</strong>, ' +
        'hold it between two chairs and run a cord through the groove. Tie on a little bag of stones and pull downward: ' +
        '<strong>is it easier than lifting it by hand?</strong> Write down what changed: the force or the direction.</li>' +
        '<li><strong>➰ Draw the direction of rotation:</strong> in your notebook draw <strong>three gears in a row</strong> and ' +
        'paint <strong>arrows</strong> showing which way each one turns (↻ ↺ ↻). Do it again with two pulleys and an ' +
        '<strong>open</strong> belt, and then with the belt <strong>crossed</strong>. Explain in one line what changed.</li>' +
        '</ul>',

      /* ═══════════ PÁGINA 4 ═══════════ */
      p4:
        '<div class="caja hn">🇭🇳 <b>Engineering belongs to you too:</b> mechanisms were not invented in some faraway ' +
        'laboratory: they are in grandmother’s mill, in the bricklayer’s wheelbarrow and in the bicycle you ride to ' +
        'school. Anyone who learns to look for <strong>where the fulcrum is</strong> and <strong>which wheel is the big one</strong> ' +
        'is already thinking like an engineer. Cardboard and string are all you need to start! 💚</div>' +

        '<h2>✍️ 7. Test Yourself! Activities</h2>' +

        '<h3>I. Fill in the blanks <span class="val">(Value: 10 points each)</span></h3>' +

        '<ol>' +
        '<li>Marvin attached the motor <span class="linea-resp"></span> to the wheels.</li>' +
        '<li>The motor was fine and the <span class="linea-resp"></span> was full.</li>' +
        '<li>Mechanisms can be built with cardboard and materials from your <span class="linea-resp"></span>.</li>' +
        '<li>A 10-tooth gear driving a 40-tooth gear gives <span class="linea-resp"></span> times more force.</li>' +
        '<li>The pulper takes the <span class="linea-resp"></span> off the coffee.</li>' +
        '<li>The winch helps open a very <span class="linea-resp"></span> gate.</li>' +
        '<li>Two gears drag each other without <span class="linea-resp"></span>.</li>' +
        '<li>For the fair, Marvin put a small <span class="linea-resp"></span> on top of the car.</li>' +
        '<li>The motor is the muscle; the mechanisms are the bones and the <span class="linea-resp"></span>.</li>' +
        '<li>The pulper is turned by <span class="linea-resp"></span>.</li>' +
        '</ol>' +

        '<h3>II. True or False <span class="val">(Value: 10 points each)</span></h3>' +

        '<ol>' +
        '<li>____ Marvin’s little car did not start on the floor.</li>' +
        '<li>____ Marvin’s motor was broken.</li>' +
        '<li>____ The motor turns electrical energy into spin.</li>' +
        '<li>____ With the motor alone, with nothing else, you gain a lot of force.</li>' +
        '<li>____ Mechanisms are also found at home and in the yard.</li>' +
        '<li>____ A mechanism gives the robot brand-new energy.</li>' +
        '<li>____ The corn mill is made to give a lot of force.</li>' +
        '<li>____ A robot can have several motors.</li>' +
        '<li>____ Marvin’s little car spun super fast in the air.</li>' +
        '<li>____ The motor is the robot’s most important actuator.</li>' +
        '</ol>' +

        '<h3>III. Multiple choice <span class="val">(Value: 10 points each)</span> — Circle the correct letter.</h3>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">1</span>A 10-tooth gear drives a 30-tooth gear. What happens to the 30-tooth gear?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> It turns faster and with more force</span>' +
        '<span class="op"><i>b</i> It turns faster and with less force</span>' +
        '<span class="op"><i>c</i> It turns slower and with more force</span>' +
        '<span class="op"><i>d</i> It does not turn</span>' +
        '</div>' +
        '</div>',

      /* ═══════════ PÁGINA 5 ═══════════ */
      p5:
        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">2</span>What was Marvin’s little car missing to start with weight on top?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> A bigger battery</span>' +
        '<span class="op"><i>b</i> Something that traded speed for force</span>' +
        '<span class="op"><i>c</i> More lights</span>' +
        '<span class="op"><i>d</i> Paint</span>' +
        '</div>' +
        '</div>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">3</span>In a train of three gears, how do the first and the third turn?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> In opposite directions</span>' +
        '<span class="op"><i>b</i> They do not turn</span>' +
        '<span class="op"><i>c</i> In the same direction</span>' +
        '<span class="op"><i>d</i> At double speed</span>' +
        '</div>' +
        '</div>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">4</span>What does the winch turn to open the gate?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> Gears</span>' +
        '<span class="op"><i>b</i> Water</span>' +
        '<span class="op"><i>c</i> Air</span>' +
        '<span class="op"><i>d</i> Light</span>' +
        '</div>' +
        '</div>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">5</span>What comes out of a motor, just as it comes out?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> Slow, strong spin</span>' +
        '<span class="op"><i>b</i> Fast, weak spin</span>' +
        '<span class="op"><i>c</i> Light</span>' +
        '<span class="op"><i>d</i> Heat</span>' +
        '</div>' +
        '</div>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">6</span>What question should you ask before choosing a mechanism?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> What color is it?</span>' +
        '<span class="op"><i>b</i> How much does it cost?</span>' +
        '<span class="op"><i>c</i> Do I need force or speed?</span>' +
        '<span class="op"><i>d</i> Who made it?</span>' +
        '</div>' +
        '</div>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">7</span>If the first of two meshed gears turns to the right, which way does the second turn?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> To the left</span>' +
        '<span class="op"><i>b</i> To the right</span>' +
        '<span class="op"><i>c</i> It does not turn</span>' +
        '<span class="op"><i>d</i> Upward</span>' +
        '</div>' +
        '</div>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">8</span>What do a robot’s mechanisms need in order to work?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> A motor that drives them</span>' +
        '<span class="op"><i>b</i> Water</span>' +
        '<span class="op"><i>c</i> A screen</span>' +
        '<span class="op"><i>d</i> A sound sensor</span>' +
        '</div>' +
        '</div>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">9</span>What is always lost when a mechanism gives more force?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> Nothing</span>' +
        '<span class="op"><i>b</i> Color</span>' +
        '<span class="op"><i>c</i> Speed</span>' +
        '<span class="op"><i>d</i> Weight</span>' +
        '</div>' +
        '</div>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">10</span>What are the parts that carry the motor’s movement to where it is needed called?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> Sensors</span>' +
        '<span class="op"><i>b</i> Batteries</span>' +
        '<span class="op"><i>c</i> Programs</span>' +
        '<span class="op"><i>d</i> Mechanisms</span>' +
        '</div>' +
        '</div>',

      /* ═══════════ PÁGINA 6 ═══════════ */
      p6:
        '<h3>IV. Matching <span class="val">(Value: 10 points each)</span> — Write on the line the letter from Column B that matches.</h3>' +

        '<table>' +
        '<tr><th style="width:42%;">Column A</th><th>Column B</th></tr>' +
        '<tr><td>1. ____ Servomotor</td><td>A. The builder’s wheelbarrow is one</td></tr>' +
        '<tr><td>2. ____ Gear motor</td><td>B. It joins the chainring to the bicycle’s back wheel</td></tr>' +
        '<tr><td>3. ____ Fan</td><td>C. It turns to an exact angle and stays there</td></tr>' +
        '<tr><td>4. ____ Pulley</td><td>D. It spins nonstop as long as there is current</td></tr>' +
        '<tr><td>5. ____ Lever</td><td>E. It needs speed more than force</td></tr>' +
        '<tr><td>6. ____ Worm gear</td><td>F. It makes the spin come out reversed</td></tr>' +
        '<tr><td>7. ____ Crank and connecting rod</td><td>G. A threaded «worm»</td></tr>' +
        '<tr><td>8. ____ Chain</td><td>H. A motor with its own gearbox</td></tr>' +
        '<tr><td>9. ____ Crossed belt</td><td>I. A wheel with a groove the rope runs through</td></tr>' +
        '<tr><td>10. ____ DC motor</td><td>J. It turns spin into back-and-forth motion</td></tr>' +
        '</table>' +

        '<div class="felic">' +
        '🏅 <b>Congratulations! You have completed the Mission Motors and Mechanisms.</b> Now you know that the motor turns ' +
        'electricity into rotation; that two gears in contact turn opposite ways and that with three the first and the third turn ' +
        'alike; that a small gear driving a big one gives force and a big one driving a small one gives speed; and that ' +
        'every mechanism makes the same deal: <b>whatever you gain in force you lose in speed</b>. Keep going along the ' +
        'Robot Path! ⚙️🤖' +
        '</div>' +

        '<h2>📏 Assessment Rubric</h2>' +

        '<table class="rubrica">' +
        '<tr><th>Activity</th><th>Where</th><th>Value</th><th>Grade earned</th><th>Comment</th></tr>' +
        '<tr><td>Copied the contents of this material into their Robotics notebook.</td><td class="lg">Homework</td><td>100</td><td>&nbsp;</td><td>&nbsp;</td></tr>' +
        '<tr><td>Solved the «Test Yourself» section directly on this sheet.</td><td class="lg">Classwork, the day before the exam</td><td>100</td><td>&nbsp;</td><td>&nbsp;</td></tr>' +
        '<tr><td>Built the cardboard gears, the lever with a ruler and a pencil and the pulley with a spool, and drew the direction of rotation with arrows.</td><td class="lg">Homework</td><td>100</td><td>&nbsp;</td><td>&nbsp;</td></tr>' +
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
        '<div><span class="pt">I. Fill in:</span> 1. directly &nbsp; 2. battery &nbsp; 3. surroundings &nbsp; 4. four &nbsp; 5. husk &nbsp; 6. heavy &nbsp; 7. slipping &nbsp; 8. book &nbsp; 9. joints &nbsp; 10. hand</div>' +
        '<div><span class="pt">II. True or False:</span> 1T, 2F, 3T, 4F, 5T, 6F, 7T, 8T, 9T, 10T</div>' +
        '<div><span class="pt">III. Multiple choice:</span> 1c, 2b, 3c, 4a, 5b, 6c, 7a, 8a, 9c, 10d</div>' +
        '<div><span class="pt">IV. Matching:</span> 1C &nbsp; 2H &nbsp; 3E &nbsp; 4I &nbsp; 5A &nbsp; 6G &nbsp; 7J &nbsp; 8B &nbsp; 9F &nbsp; 10D</div>' +
        '</div>' +

        '<div class="nota-doc">' +
        '<strong>Note for the teacher:</strong> this study sheet is based on the interactive content of the M.E.T.A.S platform, ' +
        '«Mission Motors and Mechanisms» (Basic Education, Cycles II and III), stage 3 of the Robot Path in the ' +
        'Robotics area. The approach is <strong>unplugged robotics</strong>: every concept (the motor as an actuator, the DC ' +
        'motor, the servomotor and the gearmotor, gears, direction of rotation, the force-speed ratio, pulleys and belts, levers ' +
        'and the fulcrum, wheel and axle, worm gear and crank and rod) is worked on with no hardware at all — cardboard, string, ' +
        'a ruler and a pencil — so the sheet can be used in classrooms with no computers and no connectivity. The idea running ' +
        'through it all, and the one that must come across clearly, is the <strong>trade</strong>: every mechanism swaps force for speed and you never win ' +
        'everything; that is why, before choosing a mechanism, the student must always ask «do I need force or do I need ' +
        'speed?». It covers every concept assessed on the platform (fill in the blank, true/false, multiple choice and matching) ' +
        'and the unplugged activities on page 3: the cut-out cardboard gears (counting turns and comparing ' +
        'speed and force), the lever with a ruler and a pencil (moving the fulcrum), the pulley with a thread spool (changing ' +
        'the direction of the force) and drawing the direction of rotation with arrows on gear trains and on pulleys with an ' +
        'open belt and with a crossed one. The Honduran examples (corn mill, bicycle, coffee pulper, bricklayer’s ' +
        'wheelbarrow and gate winch) make it possible to take the class out into the yard or back home. The interactive mission (QR code on ' +
        'the cover) includes a <strong>gear train laboratory</strong> where the student predicts the direction of ' +
        'rotation and the speed-force ratio with instant feedback: it is worth using before solving this sheet. ' +
        '<em>The Spanish and English versions share the same answer key: Column B keeps the same order in both.</em>' +
        '</div>'
    },

    /* Rótulos sueltos: botón de impresión y pies de página */
    frases: {
      '🖨️ Imprimir la ficha': '🖨️ Print the study sheet',
      '· Ficha Didáctica · Motores y Mecanismos': '· Study Sheet · Motors and Mechanisms',
      '· Ficha Didáctica · Motores y Mecanismos · Hoja del Docente': '· Study Sheet · Motors and Mechanisms · Teacher’s Sheet'
    },

    fragmentos: [
      [/Página (\d+)/g, 'Page $1']
    ]
  };
})();
