/* ============================================================
   Ficha didáctica «Sensores: los Sentidos del Robot» — inglés
   ------------------------------------------------------------
   Misma traducción de autor que la misión (sensor → controller →
   actuator) y en inglés AMERICANO, que es el que enseñan las
   bilingües de Honduras: color, center, catalog, analyze.

   Las 7 páginas se traducen enteras (data-i18n="p1".."p7") para
   que la maquetación impresa no se desarme: cada recuadro cabe
   donde debe y ninguna página queda a medias.

   IMPORTANTE para el docente: la Columna B de los pareados
   conserva EL MISMO ORDEN que en español, así la pauta
   (1E · 2G · 3J · 4B · 5I · 6A · 7D · 8F · 9C · 10H) sigue
   siendo válida en las dos versiones. Lo mismo vale para el
   completar, el V/F y la selección múltiple.
   ============================================================ */
(function () {
  'use strict';

  window.MISION_EN = {

    titulo: 'Study Sheet · Mission: Sensors, The Robot’s Senses',

    html: {

      /* ═══════════ PÁGINA 1 ═══════════ */
      p1:
        '<div class="idline"><span>Name:</span><span class="raya"></span><span>Student No.:</span><span class="raya corta"></span></div>' +

        '<div class="fh">' +
        '<div class="fh-txt">' +
        '<div class="f-badge">📡 Study Sheet: Mission — Sensors, The Robot’s Senses</div>' +
        '<div class="f-meta"><b>Subject:</b> Robotics &nbsp;·&nbsp; <b>Level:</b> Basic Education &nbsp;·&nbsp; <b>Robot Path · Stage 2</b></div>' +
        '<div class="f-meta"><b>Topic:</b> What a sensor is, the main types (light, distance, touch, temperature, sound and moisture), the sensor → controller → actuator chain compared with the human body, the difference between sensor and actuator, and the sensors of everyday life in Honduras (unplugged robotics: no computer needed)</div>' +
        '</div>' +
        '<div class="fh-qr">' +
        '<img src="img/qr-mision-sensores-robot.png" alt="Mission QR code">' +
        '<span>📷 Play the mission on your phone</span>' +
        '</div>' +
        '</div>' +

        '<h2>🎯 Learning Objectives</h2>' +

        '<ol class="objetivos">' +
        '<li>Explain what a <strong>sensor</strong> is: what it picks up and what it turns it into.</li>' +
        '<li>Name the <strong>types of sensors</strong>: light, distance, touch, temperature, sound and moisture.</li>' +
        '<li>Match each sensor with its <strong>human sense</strong> (eye, skin, ear).</li>' +
        '<li>Apply the <strong>sensor → controller → actuator</strong> chain and compare it with <strong>receptor → brain → effector</strong>.</li>' +
        '<li>Tell a <strong>sensor</strong> apart from an <strong>actuator</strong> without mixing them up.</li>' +
        '<li>Recognize <strong>sensors in everyday life in Honduras</strong> and explain what happens when a sensor gives a <strong>wrong reading</strong>.</li>' +
        '</ol>' +

        '<h2>📡 1. What is a sensor?</h2>' +

        '<p>A <strong>sensor</strong> is the part of the robot that <strong>SENSES</strong>. It picks up something from the real world ' +
        '—light, distance, heat, contact, sound or moisture— and <strong>turns it into a signal</strong> that the ' +
        '<strong>controller</strong> understands. With no sensors, the robot would be «blind and deaf».</p>' +

        '<div class="caja truco">💡 <b>Handy trick:</b> the sensor is the robot’s <strong>reporter</strong>: it only reports. ' +
        'It <strong>does not decide</strong> (that is the controller’s job) and it <strong>does not act</strong> (that is the actuator’s job).</div>' +

        '<h3>📡🧠💪 Mini-demo: the robot chain</h3>' +

        '<div class="ilus">' +
        '<div class="ilus-t">Information comes in through the sensor and goes out through the actuator</div>' +
        '<div class="celula">' +
        '<div class="cm"><span class="c-emoji">📡</span><b>1. Sensor</b>IT SENSES: it picks up light, distance, heat, contact, sound or moisture.</div>' +
        '<div class="cc"><span class="c-emoji">🧠</span><b>2. Controller</b>IT DECIDES: it receives the signal and chooses what to do according to its program.</div>' +
        '<div class="cn"><span class="c-emoji">💪</span><b>3. Actuator</b>IT ACTS: the motor, the wheel, the speaker or the light carries out the order.</div>' +
        '</div>' +
        '<p style="font-size:9pt;color:var(--gris);margin:8px 0 0;text-align:center;">✅ In your body it is the same: <strong>receptor → brain → effector</strong>. 🫀</p>' +
        '</div>' +

        '<h2 style="margin-top:0;">🫀 2. The body ↔ robot comparison</h2>' +

        '<p>When somebody talks to you, your <strong>ear</strong> picks up the sound (receptor), your <strong>brain</strong> decides ' +
        'to answer and your <strong>muscles</strong> move your mouth (effector). The robot does exactly the same:</p>',

      /* ═══════════ PÁGINA 2 ═══════════ */
      p2:
        '<table>' +
        '<tr><th>In your body</th><th>In the robot</th><th>What does it do?</th></tr>' +
        '<tr><td class="k">👁️ The eye</td><td>Light sensor (photoresistor)</td><td>IT SENSES whether it is bright or dark</td></tr>' +
        '<tr><td class="k">👂 The ear</td><td>Sound sensor (microphone)</td><td>IT SENSES noises, voices and claps</td></tr>' +
        '<tr><td class="k">🖐️ The skin</td><td>Touch and temperature sensor</td><td>IT SENSES contact, heat and cold</td></tr>' +
        '<tr><td class="k">🧠 The brain</td><td>Controller</td><td>IT DECIDES what to do with the information it received</td></tr>' +
        '<tr><td class="k">💪 The muscle</td><td>Actuator (motor, wheel, speaker)</td><td>IT ACTS: it carries out the controller’s order</td></tr>' +
        '</table>' +

        '<div class="tri">' +
        '<div class="tnuc"><b>⚡ The signal</b>It is the <strong>electric data</strong> that travels from the sensor to the controller. It is the «language» the robot receives information from the world with.</div>' +
        '<div class="torg"><b>🔗 The chain</b><strong>Sensor → controller → actuator</strong>, repeated many times per second: «if the sensor reads X, then do Y».</div>' +
        '</div>' +

        '<h2>⚖️ 3. Sensor ≠ Actuator</h2>' +

        '<p>This is the most common mistake of all. The difference is simple: one <strong>brings information in</strong> and the other ' +
        '<strong>sends action out</strong>.</p>' +

        '<table>' +
        '<tr><th style="width:50%;">📡 SENSOR (input)</th><th>💪 ACTUATOR (output)</th></tr>' +
        '<tr><td>IT SENSES and reports: «there is an obstacle 20 cm away»</td><td>IT ACTS and carries out: it turns, pushes, lights up, sounds</td></tr>' +
        '<tr><td>It moves nothing</td><td>It measures nothing</td></tr>' +
        '<tr><td>It is like the senses 👁️👂🖐️</td><td>It is like the muscles 💪</td></tr>' +
        '<tr><td>Examples: photoresistor, ultrasonic sensor, pushbutton, thermometer, microphone</td><td>Examples: motor, wheel, arm, speaker, LED light, valve</td></tr>' +
        '</table>' +

        '<div class="caja regla">🎯 <b>Golden rule:</b> if it <strong>tells</strong> you something about the world, it is a <strong>sensor</strong>. ' +
        'If it <strong>does</strong> something in the world, it is an <strong>actuator</strong>. The controller always stands between the two.</div>' +

        '<h2>⚠️ 4. What if the sensor gets it wrong?</h2>' +

        '<div class="caja idea">📖 <b>Key fact:</b> a sensor <strong>can give a wrong reading</strong> if it is ' +
        '<strong>dirty, wet, blocked or badly placed</strong>, or if there is very little light. The controller believes that false ' +
        'information and <strong>decides wrong</strong>: that is why the line-following car drifts off the track when its sensor is ' +
        'covered in mud. Before you blame the program, <strong>check the sensors</strong>.</div>',

      /* ═══════════ PÁGINA 3 ═══════════ */
      p3:
        '<h2 style="margin-top:0;">🗺️ 5. The types of sensors</h2>' +

        '<table>' +
        '<tr><th>Sensor</th><th>What does it sense?</th><th>Human sense</th><th>Example</th></tr>' +
        '<tr><td class="k">☀️ Light</td><td>How much light there is: bright or dark</td><td>👁️ Sight</td><td>Line-following car; hallway lamp</td></tr>' +
        '<tr><td class="k">📏 Distance</td><td>How far away an object is (with the echo)</td><td>🦇 The bat’s echo</td><td>Robot that dodges obstacles; automatic door</td></tr>' +
        '<tr><td class="k">🤲 Touch</td><td>Whether something touches it or presses it</td><td>🖐️ The touch of your skin</td><td>Bumper pushbutton; power button</td></tr>' +
        '<tr><td class="k">🌡️ Temperature</td><td>How hot or cold it is</td><td>🖐️ The skin</td><td>Digital thermometer at the health center</td></tr>' +
        '<tr><td class="k">🔊 Sound</td><td>Noises, voices and claps</td><td>👂 Hearing</td><td>Cell phone microphone; robot that starts when you clap</td></tr>' +
        '<tr><td class="k">💧 Moisture</td><td>How much water there is in the soil or the air</td><td>🖐️ Touch (wet soil)</td><td>Watering the coffee field and the school garden</td></tr>' +
        '</table>' +

        '<div class="caja truco">🦇 <b>Fun fact:</b> the <strong>ultrasonic</strong> sensor works like a bat: ' +
        'it sends out a sound we cannot hear, waits for the <strong>echo</strong> and measures how long it takes to come back. The longer ' +
        'it takes, the farther away the obstacle is.</div>' +

        '<h2>🇭🇳 6. Sensors in everyday life in Honduras</h2>' +

        '<table>' +
        '<tr><th>Where?</th><th>Which sensor works there?</th><th>What does it sense?</th></tr>' +
        '<tr><td class="k">🏪 Supermarket</td><td>Distance or motion sensor</td><td>It detects the person and the door opens by itself</td></tr>' +
        '<tr><td class="k">🏠 Hallway at home</td><td>Light sensor</td><td>It notices that it got dark and the lamp turns itself on</td></tr>' +
        '<tr><td class="k">📱 Cell phone</td><td>Proximity sensor</td><td>It notices that the phone is next to your ear and switches the screen off</td></tr>' +
        '<tr><td class="k">☕ Coffee field</td><td>Moisture sensor</td><td>It measures the water in the soil and tells you when to water</td></tr>' +
        '<tr><td class="k">🏥 Health center</td><td>Temperature sensor</td><td>The digital thermometer measures fever in seconds</td></tr>' +
        '</table>' +

        '<h2>🎲 7. Unplugged activities (no computer)</h2>' +

        '<ul>' +
        '<li><strong>🙈 I am the sensor:</strong> blindfolded, walk slowly around the classroom using only your hands. ' +
        'You have just worked as a <strong>touch sensor</strong>: it reports once the obstacle <strong>has already been touched</strong>. ' +
        'Do it again with your eyes open (<strong>light sensor</strong>) and discuss which one warns you sooner.</li>' +
        '<li><strong>👣 Measure like the ultrasonic sensor:</strong> a classmate counts the <strong>steps</strong> it takes to reach the ' +
        'wall and writes down the distance. Then clap loudly and listen for the <strong>echo</strong>. Compare: that is how the robot measures.</li>' +
        '<li><strong>🎁 The mystery bag:</strong> put objects in a bag and guess them <strong>by touch alone</strong>. ' +
        'You will find out that one single sensor gives limited information: that is why the robot carries several.</li>' +
        '<li><strong>🕵️ The dirty sensor:</strong> tape a strip on the floor and follow it while looking through a half-blocked paper tube. ' +
        'That is a <strong>wrong reading</strong>: it reports badly and so you decide badly.</li>' +
        '<li><strong>🎨 The robot of my community:</strong> draw a robot that solves a problem in your village or neighborhood and use arrows ' +
        'to point out <strong>which sensors it carries</strong> and what each one senses.</li>' +
        '</ul>',

      /* ═══════════ PÁGINA 4 ═══════════ */
      p4:
        '<div class="caja hn">🇭🇳 <b>Robotics belongs to you too:</b> you do not need to buy sensors in order to understand them: you already ' +
        'carry them in your own body. Anyone who learns to observe, measure and check what they sense is already thinking like an engineer. ' +
        'Sensors will look after the coffee, the water and the health of Honduras… and they will be run by the very students who are in this ' +
        'classroom today! 💚</div>' +

        '<h2>✍️ 8. Test Yourself! Activities</h2>' +

        '<h3>I. Fill in the blanks <span class="val">(Value: 10 points each)</span></h3>' +

        '<ol>' +
        '<li>The pump was turned on and off by Mr. <span class="linea-resp"></span>.</li>' +
        '<li>The sensor sends an electrical <span class="linea-resp"></span>.</li>' +
        '<li>In the body, the sensor is called the <span class="linea-resp"></span>.</li>' +
        '<li>The ultrasonic sensor works like the <span class="linea-resp"></span>.</li>' +
        '<li>Information always <span class="linea-resp"></span> the robot through the sensor.</li>' +
        '<li>Without sensors, the robot would be blind and <span class="linea-resp"></span>.</li>' +
        '<li>The gate stays open because nobody <span class="linea-resp"></span> when someone comes in.</li>' +
        '<li>On Wednesday there was no water in the school <span class="linea-resp"></span>.</li>' +
        '<li>The digital thermometer at the health center measures <span class="linea-resp"></span> in seconds.</li>' +
        '<li>The supermarket door opens on its own when someone comes <span class="linea-resp"></span>.</li>' +
        '</ol>' +

        '<h3>II. True or False <span class="val">(Value: 10 points each)</span></h3>' +

        '<ol>' +
        '<li>____ The school’s water is pumped up with a pump.</li>' +
        '<li>____ Sensors are never wrong.</li>' +
        '<li>____ The tank overflowed for lack of a warning.</li>' +
        '<li>____ The sensor moves the robot’s wheels.</li>' +
        '<li>____ Without sensors the robot would know nothing about what happens around it.</li>' +
        '<li>____ A sensor cannot fail even when it is very dark.</li>' +
        '<li>____ A sensor measures many times per second without getting tired.</li>' +
        '<li>____ A robot can carry several sensors at once.</li>' +
        '<li>____ A wet sensor may report wrongly.</li>' +
        '<li>____ The body also has its own three-part chain.</li>' +
        '</ol>' +

        '<h3>III. Multiple choice <span class="val">(Value: 10 points each)</span> — Circle the correct letter.</h3>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">1</span>What was the tank pump missing?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> Strength</span>' +
        '<span class="op"><i>b</i> Finding out that the tank was already full</span>' +
        '<span class="op"><i>c</i> Water</span>' +
        '<span class="op"><i>d</i> Paint</span>' +
        '</div></div>',

      /* ═══════════ PÁGINA 5 ═══════════ */
      p5:
        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">2</span>What does the sensor do with what it picks up?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> It turns it into data for whoever decides</span>' +
        '<span class="op"><i>b</i> It erases it</span>' +
        '<span class="op"><i>c</i> It keeps it forever</span>' +
        '<span class="op"><i>d</i> It switches it off</span>' +
        '</div></div>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">3</span>Why is the sensor called the robot’s «reporter»?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> Because it talks a lot</span>' +
        '<span class="op"><i>b</i> Because it writes news</span>' +
        '<span class="op"><i>c</i> Because it only reports: it does not decide or act</span>' +
        '<span class="op"><i>d</i> Because it works at night</span>' +
        '</div></div>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">4</span>What happens if the sensor gives a wrong reading?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> Nothing</span>' +
        '<span class="op"><i>b</i> The robot gets it wrong too</span>' +
        '<span class="op"><i>c</i> The robot fixes itself</span>' +
        '<span class="op"><i>d</i> The robot switches off</span>' +
        '</div></div>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">5</span>What is the robot’s input of information?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> The motor</span>' +
        '<span class="op"><i>b</i> The wheel</span>' +
        '<span class="op"><i>c</i> The sensor</span>' +
        '<span class="op"><i>d</i> The speaker</span>' +
        '</div></div>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">6</span>In the body’s chain, what goes in the middle?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> The foot</span>' +
        '<span class="op"><i>b</i> The brain</span>' +
        '<span class="op"><i>c</i> The hand</span>' +
        '<span class="op"><i>d</i> The skin</span>' +
        '</div></div>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">7</span>How many things does each sensor perceive?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> All of them</span>' +
        '<span class="op"><i>b</i> Only one</span>' +
        '<span class="op"><i>c</i> None</span>' +
        '<span class="op"><i>d</i> Five</span>' +
        '</div></div>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">8</span>What makes the line follower leave the track?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> Having its sensor dirty with mud</span>' +
        '<span class="op"><i>b</i> Going slowly</span>' +
        '<span class="op"><i>c</i> Having a full battery</span>' +
        '<span class="op"><i>d</i> Being in the classroom</span>' +
        '</div></div>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">9</span>Which sense of the body is like the microphone?</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> Sight</span>' +
        '<span class="op"><i>b</i> Taste</span>' +
        '<span class="op"><i>c</i> Smell</span>' +
        '<span class="op"><i>d</i> Hearing</span>' +
        '</div></div>' +

        '<div class="preg">' +
        '<div class="preg-q"><span class="preg-n">10</span>If a part tells you something about the world, it is…</div>' +
        '<div class="preg-ops">' +
        '<span class="op"><i>a</i> A sensor</span>' +
        '<span class="op"><i>b</i> A motor</span>' +
        '<span class="op"><i>c</i> A wheel</span>' +
        '<span class="op"><i>d</i> A speaker</span>' +
        '</div></div>',

      /* ═══════════ PÁGINA 6 ═══════════
         La Columna B conserva el orden del español: la pauta
         1E · 2G · 3J · 4B · 5I · 6A · 7D · 8F · 9C · 10H vale igual. */
      p6:
        '<h3>IV. Matching <span class="val">(Value: 10 points each)</span> — Write on the line the letter from Column B that matches.</h3>' +

        '<table>' +
        '<tr><th style="width:42%;">Column A</th><th>Column B</th></tr>' +
        '<tr><td>1. ____ Light sensor</td><td>A. The robot that starts when you clap</td></tr>' +
        '<tr><td>2. ____ Distance sensor</td><td>B. The speaker that beeps in reverse</td></tr>' +
        '<tr><td>3. ____ Touch sensor</td><td>C. The hallway lamp that turns on by itself</td></tr>' +
        '<tr><td>4. ____ Temperature sensor</td><td>D. It changes with the brightness it receives</td></tr>' +
        '<tr><td>5. ____ Sound sensor</td><td>E. The push button that warns of a crash</td></tr>' +
        '<tr><td>6. ____ Humidity sensor</td><td>F. It is always in the middle of the other two</td></tr>' +
        '<tr><td>7. ____ Proximity sensor</td><td>G. It warns when to water the coffee farm</td></tr>' +
        '<tr><td>8. ____ Actuator</td><td>H. It measures how far away an object is</td></tr>' +
        '<tr><td>9. ____ Controller</td><td>I. It measures how hot or cold it is</td></tr>' +
        '<tr><td>10. ____ Photoresistor</td><td>J. It turns off the phone screen next to your ear</td></tr>' +
        '</table>' +

        '<div class="felic">' +
        '🏅 <b>Congratulations! You have completed the Mission Sensors: The Robot’s Senses.</b> You now know that the sensor ' +
        'senses the world and turns it into a signal; that each sensor is like one of your own senses; that a sensor is not ' +
        'the same as an actuator; and that a dirty or blocked sensor can make the robot decide wrong. Keep moving along the ' +
        'Robot Path! 🤖📡' +
        '</div>' +

        '<h2>📏 Assessment Rubric</h2>' +

        '<table class="rubrica">' +
        '<tr><th>Activity</th><th>Where</th><th>Value</th><th>Grade</th><th>Comments</th></tr>' +
        '<tr><td>Copied the contents of this material into the Robotics notebook.</td><td class="lg">Homework</td><td>100</td><td>&nbsp;</td><td>&nbsp;</td></tr>' +
        '<tr><td>Solved the «Test Yourself» section right on this study sheet.</td><td class="lg">Classwork, the day before the test</td><td>100</td><td>&nbsp;</td><td>&nbsp;</td></tr>' +
        '<tr><td>Did the unplugged activities and drew the robot of their community with its sensors.</td><td class="lg">Homework</td><td>100</td><td>&nbsp;</td><td>&nbsp;</td></tr>' +
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
        '<div><span class="pt">I. Fill in the blanks:</span> 1. Chico &nbsp; 2. signal &nbsp; 3. receptor &nbsp; 4. bat &nbsp; 5. enters &nbsp; 6. deaf &nbsp; 7. notices &nbsp; 8. bathrooms &nbsp; 9. fever &nbsp; 10. near</div>' +
        '<div><span class="pt">II. True or False:</span> 1T, 2F, 3T, 4F, 5T, 6F, 7T, 8T, 9T, 10T</div>' +
        '<div><span class="pt">III. Multiple choice:</span> 1b, 2a, 3c, 4b, 5c, 6b, 7b, 8a, 9d, 10a</div>' +
        '<div><span class="pt">IV. Matching:</span> 1C, 2H, 3E, 4I, 5A, 6G, 7J, 8B, 9F, 10D</div>' +
        '</div>' +

        '<div class="nota-doc">' +
        '<strong>Note for the teacher:</strong> this study sheet is based on the interactive content of the M.E.T.A.S platform, ' +
        '«Mission Sensors: The Robot’s Senses» (Basic Education, Cycles II and III), stage 2 of the Robot Path in the Robotics area, ' +
        'and it follows on from stage 1 («What Is a Robot?»). The approach is <strong>unplugged robotics</strong>: every concept ' +
        '(sensor, signal, types of sensors, the sensor → controller → actuator chain, sensor vs actuator and wrong readings) is worked ' +
        'on with no hardware at all — with paper, games and observation — so the sheet can be used in classrooms with no computers and ' +
        'no internet. The <strong>unplugged activities</strong> on page 3 are the heart of the lesson: blindfolding yourself in order to ' +
        '«be» a touch sensor, measuring distance in steps and comparing it with the echo of a clap (like the ultrasonic sensor), guessing ' +
        'objects inside a bag by touch alone, and simulating a <strong>dirty sensor</strong> by looking through a half-blocked tube. ' +
        'The body ↔ robot comparison (eye = light sensor, skin = touch and temperature, ear = microphone, brain = controller, ' +
        'muscle = actuator) links directly to the <strong>Body Path</strong> and its receptor → brain → effector circuit, so it can be ' +
        'taught together with Natural Sciences. The idea that a sensor <strong>can fail</strong> is the basis of the platform’s critical ' +
        'thinking test: it is worth insisting that students check the sensor (clean, unblocked, properly placed) before blaming the ' +
        'program. The interactive mission (QR code on the cover) lets students practice with instant feedback before solving this sheet. ' +
        '<em>The Spanish and English versions share the same answer key: Column B keeps the same order in both.</em>' +
        '</div>'
    },

    /* Rótulos sueltos: botón de impresión y pies de página */
    frases: {
      '🖨️ Imprimir la ficha': '🖨️ Print the study sheet',
      '· Ficha Didáctica · Sensores: los Sentidos del Robot': '· Study Sheet · Sensors: The Robot’s Senses',
      '· Ficha Didáctica · Sensores: los Sentidos del Robot · Hoja del Docente': '· Study Sheet · Sensors: The Robot’s Senses · Teacher’s Sheet'
    },

    fragmentos: [
      [/Página (\d+)/g, 'Page $1']
    ]
  };
})();
