/* ══════════════════════════════════════════════════════════════════════════════
   M.E.T.A.S. — Misión: Suma y Resta de Fracciones Heterogéneas
   Flujo pedagógico en 3 pasos interactivos, representaciones visuales
   (círculos y barras fraccionarias iluminadas), Web Speech API y guardado
   offline-first hacia el Plan de Acción y la nube.
   ══════════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const MISION_ID = 'mate-fracciones-heterogeneas';
  const META_EJERCICIOS = 5;

  /* ── Estado de la misión ─────────────────────────────────────────────────── */
  let ejerciciosCompletados = 0;
  let numeroEjercicioActual = 1;
  let evaluacionDisparada = false;
  let pasoActual = 1;
  let modoVisual = 'ambos'; // 'ambos' | 'circulos' | 'barras'
  let ejercicio = null;
  let estadoPaso2 = { num1Listo: false, num2Listo: false };

  /* ── Banco base y generador aleatorio de fracciones heterogéneas ─────────── */
  const PARES_DENOMINADORES = [
    [2, 3], [2, 4], [3, 4], [2, 6], [3, 6], [4, 6],
    [2, 5], [2, 8], [4, 8], [2, 10], [5, 10], [3, 12], [4, 12], [6, 12]
  ];

  function mcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a || 1;
  }

  function mcm(a, b) {
    return Math.abs(a * b) / mcd(a, b);
  }

  function mezclarArreglo(arr) {
    const copia = arr.slice();
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = copia[i];
      copia[i] = copia[j];
      copia[j] = tmp;
    }
    return copia;
  }

  function generarOpcionesNumericas(correcto, minVal, candidatosExtra) {
    const set = new Set([correcto]);
    if (Array.isArray(candidatosExtra)) {
      for (let i = 0; i < candidatosExtra.length; i++) {
        const c = candidatosExtra[i];
        if (c >= minVal && c !== correcto) {
          set.add(c);
        }
        if (set.size >= 4) break;
      }
    }
    let delta = 1;
    while (set.size < 4) {
      const arriba = correcto + delta;
      const abajo = correcto - delta;
      if (abajo >= minVal) set.add(abajo);
      if (set.size < 4) set.add(arriba);
      delta++;
    }
    return mezclarArreglo(Array.from(set).slice(0, 4));
  }

  function generarEjercicioAleatorio() {
    let intentos = 0;
    while (intentos < 60) {
      intentos++;
      const par = PARES_DENOMINADORES[Math.floor(Math.random() * PARES_DENOMINADORES.length)];
      const invertir = Math.random() < 0.5;
      const d1 = invertir ? par[1] : par[0];
      const d2 = invertir ? par[0] : par[1];
      if (d1 === d2) continue;

      const denComun = mcm(d1, d2);
      const op = Math.random() < 0.55 ? '+' : '-';

      const n1 = 1 + Math.floor(Math.random() * (d1 - 1));
      const n2 = 1 + Math.floor(Math.random() * (d2 - 1));

      const factor1 = denComun / d1;
      const factor2 = denComun / d2;
      const eqNum1 = n1 * factor1;
      const eqNum2 = n2 * factor2;

      const resNumSinSimplificar = op === '+' ? (eqNum1 + eqNum2) : (eqNum1 - eqNum2);

      // Mantener resultado positivo y menor o igual al denominador común
      // para que las representaciones visuales sean claras y directas
      if (resNumSinSimplificar <= 0 || resNumSinSimplificar > denComun) {
        continue;
      }

      // Evitar repetir exactamente el mismo ejercicio seguido
      if (
        ejercicio &&
        ejercicio.n1 === n1 &&
        ejercicio.d1 === d1 &&
        ejercicio.n2 === n2 &&
        ejercicio.d2 === d2 &&
        ejercicio.op === op
      ) {
        continue;
      }

      const divisorSimplificar = mcd(resNumSinSimplificar, denComun);
      const esSimplificable = divisorSimplificar > 1;
      const simNum = resNumSinSimplificar / divisorSimplificar;
      const simDen = denComun / divisorSimplificar;

      return {
        n1: n1,
        d1: d1,
        n2: n2,
        d2: d2,
        op: op,
        mcm: denComun,
        factor1: factor1,
        factor2: factor2,
        eqNum1: eqNum1,
        eqNum2: eqNum2,
        resNum: resNumSinSimplificar,
        resDen: denComun,
        divisorSimplificar: divisorSimplificar,
        esSimplificable: esSimplificable,
        simNum: simNum,
        simDen: simDen
      };
    }

    // Respaldo clásico garantizado: 1/2 + 1/3 = 5/6
    return {
      n1: 1,
      d1: 2,
      n2: 1,
      d2: 3,
      op: '+',
      mcm: 6,
      factor1: 3,
      factor2: 2,
      eqNum1: 3,
      eqNum2: 2,
      resNum: 5,
      resDen: 6,
      divisorSimplificar: 1,
      esSimplificable: false,
      simNum: 5,
      simDen: 6
    };
  }

  /* ── Representaciones Visuales: Círculos y Barras Fraccionarias ──────────── */
  function crearSVGCirculoFraccion(numerador, denominador, colorLuz, colorFondo, subDivisiones) {
    const size = 110;
    const cx = size / 2;
    const cy = size / 2;
    const r = 46;

    let svg = `<svg class="svg-circulo-frac" viewBox="0 0 ${size} ${size}" role="img" aria-label="Círculo fraccionario: ${numerador} de ${denominador} partes iluminadas">`;

    if (!denominador || denominador <= 0) {
      svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#F1F5F9" stroke="#94A3B8" stroke-width="2.5" stroke-dasharray="5,4" />`;
      svg += `<text x="${cx}" y="${cy + 6}" text-anchor="middle" font-size="22" font-weight="800" fill="#64748B">?</text>`;
      svg += `</svg>`;
      return svg;
    }

    if (denominador === 1) {
      const fill = numerador >= 1 ? colorLuz : colorFondo;
      svg += `<circle class="porcion-circulo ${numerador >= 1 ? 'iluminada' : ''}" cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="#334155" stroke-width="2.5" />`;
      svg += `</svg>`;
      return svg;
    }

    for (let i = 0; i < denominador; i++) {
      const angInicio = (i * 2 * Math.PI) / denominador - Math.PI / 2;
      const angFin = ((i + 1) * 2 * Math.PI) / denominador - Math.PI / 2;

      const x1 = cx + r * Math.cos(angInicio);
      const y1 = cy + r * Math.sin(angInicio);
      const x2 = cx + r * Math.cos(angFin);
      const y2 = cy + r * Math.sin(angFin);

      const largeArc = (angFin - angInicio) > Math.PI ? 1 : 0;
      const iluminada = i < numerador;
      const fill = iluminada ? colorLuz : colorFondo;
      const claseExtra = iluminada ? 'iluminada' : '';

      const dPath = [
        `M ${cx} ${cy}`,
        `L ${x1.toFixed(2)} ${y1.toFixed(2)}`,
        `A ${r} ${r} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`,
        'Z'
      ].join(' ');

      svg += `<path class="porcion-circulo ${claseExtra}" d="${dPath}" fill="${fill}" stroke="#334155" stroke-width="2" />`;
    }

    // Si hay subdivisiones del MCM, mostrar líneas punteadas sutiles
    if (subDivisiones && subDivisiones > denominador && subDivisiones <= 16) {
      for (let j = 0; j < subDivisiones; j++) {
        const ang = (j * 2 * Math.PI) / subDivisiones - Math.PI / 2;
        const xEnd = cx + r * Math.cos(ang);
        const yEnd = cy + r * Math.sin(ang);
        svg += `<line x1="${cx}" y1="${cy}" x2="${xEnd.toFixed(2)}" y2="${yEnd.toFixed(2)}" stroke="rgba(30,41,59,0.35)" stroke-width="1" stroke-dasharray="3,2" />`;
      }
    }

    svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#1E293B" stroke-width="2.5" />`;
    svg += `</svg>`;
    return svg;
  }

  function crearHTMLBarraFraccion(numerador, denominador, claseLuz) {
    if (!denominador || denominador <= 0) {
      return `<div class="barra-fraccionaria" aria-label="Barra fraccionaria pendiente">
        <div class="segmento-barra"></div>
      </div>`;
    }
    let html = `<div class="barra-fraccionaria" role="img" aria-label="Barra fraccionaria: ${numerador} de ${denominador} segmentos iluminados">`;
    for (let i = 0; i < denominador; i++) {
      const iluminado = i < numerador ? claseLuz : '';
      html += `<div class="segmento-barra ${iluminado}"></div>`;
    }
    html += `</div>`;
    return html;
  }

  function actualizarVisuales(etapaVisual) {
    if (!ejercicio) return;

    const wrapCirculoA = document.getElementById('wrapCirculoA');
    const wrapBarraA = document.getElementById('wrapBarraA');
    const visTextoA = document.getElementById('visTextoA');
    const visDetalleA = document.getElementById('visDetalleA');

    const wrapCirculoB = document.getElementById('wrapCirculoB');
    const wrapBarraB = document.getElementById('wrapBarraB');
    const visTextoB = document.getElementById('visTextoB');
    const visDetalleB = document.getElementById('visDetalleB');

    const wrapCirculoRes = document.getElementById('wrapCirculoRes');
    const wrapBarraRes = document.getElementById('wrapBarraRes');
    const visTextoRes = document.getElementById('visTextoRes');
    const visDetalleRes = document.getElementById('visDetalleRes');

    // Fracción A
    if (etapaVisual >= 2 && estadoPaso2.num1Listo) {
      visTextoA.textContent = `${ejercicio.n1}/${ejercicio.d1} = ${ejercicio.eqNum1}/${ejercicio.mcm}`;
      wrapCirculoA.innerHTML = crearSVGCirculoFraccion(ejercicio.eqNum1, ejercicio.mcm, '#7C5CFC', '#EFEAFF', null);
      wrapBarraA.innerHTML = crearHTMLBarraFraccion(ejercicio.eqNum1, ejercicio.mcm, 'iluminado-a');
      visDetalleA.textContent = `${ejercicio.eqNum1} de ${ejercicio.mcm} partes iguales iluminadas`;
    } else {
      const subDiv = etapaVisual >= 1 ? ejercicio.mcm : null;
      visTextoA.textContent = `${ejercicio.n1}/${ejercicio.d1}`;
      wrapCirculoA.innerHTML = crearSVGCirculoFraccion(ejercicio.n1, ejercicio.d1, '#7C5CFC', '#EFEAFF', subDiv);
      wrapBarraA.innerHTML = crearHTMLBarraFraccion(ejercicio.n1, ejercicio.d1, 'iluminado-a');
      visDetalleA.textContent = etapaVisual >= 1
        ? `${ejercicio.n1} de ${ejercicio.d1} partes (dividiendo en ${ejercicio.mcm} partes)`
        : `${ejercicio.n1} de ${ejercicio.d1} partes iluminadas`;
    }

    // Fracción B
    if (etapaVisual >= 2 && estadoPaso2.num2Listo) {
      visTextoB.textContent = `${ejercicio.n2}/${ejercicio.d2} = ${ejercicio.eqNum2}/${ejercicio.mcm}`;
      wrapCirculoB.innerHTML = crearSVGCirculoFraccion(ejercicio.eqNum2, ejercicio.mcm, '#F97316', '#FFF1E6', null);
      wrapBarraB.innerHTML = crearHTMLBarraFraccion(ejercicio.eqNum2, ejercicio.mcm, 'iluminado-b');
      visDetalleB.textContent = `${ejercicio.eqNum2} de ${ejercicio.mcm} partes iguales iluminadas`;
    } else {
      const subDiv = etapaVisual >= 1 ? ejercicio.mcm : null;
      visTextoB.textContent = `${ejercicio.n2}/${ejercicio.d2}`;
      wrapCirculoB.innerHTML = crearSVGCirculoFraccion(ejercicio.n2, ejercicio.d2, '#F97316', '#FFF1E6', subDiv);
      wrapBarraB.innerHTML = crearHTMLBarraFraccion(ejercicio.n2, ejercicio.d2, 'iluminado-b');
      visDetalleB.textContent = etapaVisual >= 1
        ? `${ejercicio.n2} de ${ejercicio.d2} partes (dividiendo en ${ejercicio.mcm} partes)`
        : `${ejercicio.n2} de ${ejercicio.d2} partes iluminadas`;
    }

    // Resultado
    if (etapaVisual === 3) {
      visTextoRes.textContent = `${ejercicio.resNum}/${ejercicio.resDen}`;
      wrapCirculoRes.innerHTML = crearSVGCirculoFraccion(ejercicio.resNum, ejercicio.resDen, '#10B981', '#E6FBF2', null);
      wrapBarraRes.innerHTML = crearHTMLBarraFraccion(ejercicio.resNum, ejercicio.resDen, 'iluminado-res');
      visDetalleRes.textContent = `${ejercicio.resNum} de ${ejercicio.resDen} partes iluminadas`;
    } else if (etapaVisual === 4) {
      const etiquetaRes = ejercicio.esSimplificable
        ? `${ejercicio.resNum}/${ejercicio.resDen} = ${ejercicio.simNum}/${ejercicio.simDen}`
        : `${ejercicio.simNum}/${ejercicio.simDen}`;
      visTextoRes.textContent = etiquetaRes;
      wrapCirculoRes.innerHTML = crearSVGCirculoFraccion(ejercicio.simNum, ejercicio.simDen, '#10B981', '#E6FBF2', null);
      wrapBarraRes.innerHTML = crearHTMLBarraFraccion(ejercicio.simNum, ejercicio.simDen, 'iluminado-res');
      visDetalleRes.textContent = `${ejercicio.simNum} de ${ejercicio.simDen} partes iluminadas (¡Simplificada!)`;
    } else {
      visTextoRes.textContent = '?/?';
      wrapCirculoRes.innerHTML = crearSVGCirculoFraccion(0, 0, '#10B981', '#E6FBF2', null);
      wrapBarraRes.innerHTML = crearHTMLBarraFraccion(0, 0, 'iluminado-res');
      visDetalleRes.textContent = 'Resuelve los 3 pasos para iluminar';
    }
  }

  /* ── Renderizado de los 3 Pasos Interactivos ─────────────────────────────── */
  function iniciarEjercicio() {
    ejercicio = generarEjercicioAleatorio();
    pasoActual = 1;
    estadoPaso2 = { num1Listo: false, num2Listo: false };

    // Actualizar cabecera del ejercicio
    document.getElementById('tituloEjercicioActual').textContent = `Ejercicio #${numeroEjercicioActual}`;
    const chipOp = document.getElementById('chipOperacion');
    if (ejercicio.op === '+') {
      chipOp.textContent = '➕ Suma de fracciones';
    } else {
      chipOp.textContent = '➖ Resta de fracciones';
    }

    // Pizarra de ecuación
    document.getElementById('eqNum1').textContent = ejercicio.n1;
    document.getElementById('eqDen1').textContent = ejercicio.d1;
    document.getElementById('eqOperador').textContent = ejercicio.op;
    document.getElementById('eqOperador2').textContent = ejercicio.op;
    document.getElementById('eqNum2').textContent = ejercicio.n2;
    document.getElementById('eqDen2').textContent = ejercicio.d2;
    document.getElementById('visOperadorCentral').textContent = ejercicio.op;

    document.getElementById('eqNumEq1').textContent = '?';
    document.getElementById('eqDenComun1').textContent = '?';
    document.getElementById('eqNumEq2').textContent = '?';
    document.getElementById('eqDenComun2').textContent = '?';
    document.getElementById('eqNumRes').textContent = '?';
    document.getElementById('eqDenRes').textContent = '?';

    const bloquesEq = document.querySelectorAll('.frac-eq, .frac-res');
    bloquesEq.forEach(function (b) { b.classList.remove('completado'); });

    // Reiniciar indicadores de pasos
    actualizarBarraPasos(1);

    // Configurar Paneles
    configurarPaso1();
    configurarPaso2();
    configurarPaso3();

    // Dibujar figuras iniciales
    actualizarVisuales(0);
  }

  function actualizarBarraPasos(paso) {
    pasoActual = paso;
    const ind1 = document.getElementById('indPaso1');
    const ind2 = document.getElementById('indPaso2');
    const ind3 = document.getElementById('indPaso3');
    const con1 = document.getElementById('conector1');
    const con2 = document.getElementById('conector2');

    const panel1 = document.getElementById('panelPaso1');
    const panel2 = document.getElementById('panelPaso2');
    const panel3 = document.getElementById('panelPaso3');

    // Resetear clases
    [ind1, ind2, ind3].forEach(function (el) {
      el.classList.remove('activo', 'completado');
    });
    [con1, con2].forEach(function (el) {
      el.classList.remove('completado');
    });
    [panel1, panel2, panel3].forEach(function (el) {
      el.classList.remove('paso-activo', 'paso-completado', 'paso-bloqueado');
    });

    if (paso === 1) {
      ind1.classList.add('activo');
      panel1.classList.add('paso-activo');
      panel2.classList.add('paso-bloqueado');
      panel3.classList.add('paso-bloqueado');
    } else if (paso === 2) {
      ind1.classList.add('completado');
      con1.classList.add('completado');
      ind2.classList.add('activo');
      panel1.classList.add('paso-completado');
      panel2.classList.add('paso-activo');
      panel3.classList.add('paso-bloqueado');
    } else if (paso === 3) {
      ind1.classList.add('completado');
      con1.classList.add('completado');
      ind2.classList.add('completado');
      con2.classList.add('completado');
      ind3.classList.add('activo');
      panel1.classList.add('paso-completado');
      panel2.classList.add('paso-completado');
      panel3.classList.add('paso-activo');
    } else if (paso === 4) {
      ind1.classList.add('completado');
      con1.classList.add('completado');
      ind2.classList.add('completado');
      con2.classList.add('completado');
      ind3.classList.add('completado');
      panel1.classList.add('paso-completado');
      panel2.classList.add('paso-completado');
      panel3.classList.add('paso-completado');
    }
  }

  /* ── PASO 1: Encontrar el denominador común (MCM) ────────────────────────── */
  function configurarPaso1() {
    const d1 = ejercicio.d1;
    const d2 = ejercicio.d2;
    const correcto = ejercicio.mcm;

    const inst = document.getElementById('instruccionPaso1');
    inst.innerHTML = `Los denominadores son <strong>${d1}</strong> y <strong>${d2}</strong>. Encuentra su <strong>Mínimo Común Múltiplo (MCM)</strong> para que las dos fracciones tengan partes del mismo tamaño.`;

    // Mostrar múltiplos de apoyo visual
    const pista = document.getElementById('pistaMultiplosPaso1');
    let mults1 = '';
    let mults2 = '';
    for (let i = 1; i <= 5; i++) {
      const m1 = d1 * i;
      const m2 = d2 * i;
      mults1 += `<span class="chip-mult ${m1 === correcto ? 'comun' : ''}">${m1}</span>`;
      mults2 += `<span class="chip-mult ${m2 === correcto ? 'comun' : ''}">${m2}</span>`;
    }
    pista.innerHTML = `
      <div class="fila-multiplos"><strong>Múltiplos de ${d1}:</strong> ${mults1}</div>
      <div class="fila-multiplos"><strong>Múltiplos de ${d2}:</strong> ${mults2}</div>
    `;

    // Opciones de botones
    const contOpciones = document.getElementById('opcionesPaso1');
    contOpciones.innerHTML = '';
    const feedback = document.getElementById('feedbackPaso1');
    feedback.className = 'feedback-paso';
    feedback.textContent = '';

    const candidatos = [
      d1 + d2,
      d1 * d2,
      Math.max(d1, d2) * 2,
      Math.abs(d1 - d2) + 2,
      correcto + d1
    ];
    const opciones = generarOpcionesNumericas(correcto, 2, candidatos);

    opciones.forEach(function (valor) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion';
      btn.textContent = `MCM = ${valor}`;
      btn.addEventListener('click', function () {
        if (valor === correcto) {
          btn.classList.add('correcta');
          btn.textContent = `✓ MCM = ${valor}`;
          deshabilitarBotones(contOpciones);
          feedback.className = 'feedback-paso ok';
          feedback.textContent = `✓ ¡Excelente! El mínimo común múltiplo de ${d1} y ${d2} es ${correcto}. Ahora dividimos las figuras en ${correcto} partes iguales.`;

          document.getElementById('eqDenComun1').textContent = correcto;
          document.getElementById('eqDenComun2').textContent = correcto;

          actualizarVisuales(1);
          actualizarBarraPasos(2);
        } else {
          btn.classList.add('incorrecta');
          btn.textContent = `✗ ${valor}`;
          btn.disabled = true;
          feedback.className = 'feedback-paso err';
          feedback.textContent = `✗ ${valor} no es el mínimo común múltiplo de ${d1} y ${d2}. Observa el número resaltado que se repite en ambas filas de múltiplos.`;
        }
      });
      contOpciones.appendChild(btn);
    });
  }

  /* ── PASO 2: Convertir a fracciones equivalentes ─────────────────────────── */
  function configurarPaso2() {
    const inst = document.getElementById('instruccionPaso2');
    inst.innerHTML = `Convierte <strong>${ejercicio.n1}/${ejercicio.d1}</strong> y <strong>${ejercicio.n2}/${ejercicio.d2}</strong> a denominador <strong>${ejercicio.mcm}</strong> multiplicando cada numerador por el mismo factor.`;

    // Fracción 1
    document.getElementById('p2NumOrig1').textContent = ejercicio.n1;
    document.getElementById('p2DenOrig1').textContent = ejercicio.d1;
    document.getElementById('p2Factor1').textContent = `× ${ejercicio.factor1}`;
    document.getElementById('p2NumNuevo1').textContent = '?';
    document.getElementById('p2DenComun1').textContent = ejercicio.mcm;
    document.getElementById('p2Pregunta1').textContent = `¿Cuánto es ${ejercicio.n1} × ${ejercicio.factor1}?`;

    // Fracción 2
    document.getElementById('p2NumOrig2').textContent = ejercicio.n2;
    document.getElementById('p2DenOrig2').textContent = ejercicio.d2;
    document.getElementById('p2Factor2').textContent = `× ${ejercicio.factor2}`;
    document.getElementById('p2NumNuevo2').textContent = '?';
    document.getElementById('p2DenComun2').textContent = ejercicio.mcm;
    document.getElementById('p2Pregunta2').textContent = `¿Cuánto es ${ejercicio.n2} × ${ejercicio.factor2}?`;

    const feedback = document.getElementById('feedbackPaso2');
    feedback.className = 'feedback-paso';
    feedback.textContent = '';

    renderizarOpcionesNumeradorPaso2(
      'opcionesNum1Paso2',
      ejercicio.eqNum1,
      [ejercicio.n1, ejercicio.n1 + ejercicio.factor1, ejercicio.eqNum1 + 1, ejercicio.mcm],
      function () {
        estadoPaso2.num1Listo = true;
        document.getElementById('p2NumNuevo1').textContent = ejercicio.eqNum1;
        document.getElementById('eqNumEq1').textContent = ejercicio.eqNum1;
        actualizarVisuales(2);
        verificarFinPaso2();
      },
      function (valErr) {
        feedback.className = 'feedback-paso err';
        feedback.textContent = `✗ En la primera fracción, multiplica el numerador ${ejercicio.n1} por ${ejercicio.factor1} (${valErr} no es correcto).`;
      }
    );

    renderizarOpcionesNumeradorPaso2(
      'opcionesNum2Paso2',
      ejercicio.eqNum2,
      [ejercicio.n2, ejercicio.n2 + ejercicio.factor2, ejercicio.eqNum2 + 1, ejercicio.mcm],
      function () {
        estadoPaso2.num2Listo = true;
        document.getElementById('p2NumNuevo2').textContent = ejercicio.eqNum2;
        document.getElementById('eqNumEq2').textContent = ejercicio.eqNum2;
        actualizarVisuales(2);
        verificarFinPaso2();
      },
      function (valErr) {
        feedback.className = 'feedback-paso err';
        feedback.textContent = `✗ En la segunda fracción, multiplica el numerador ${ejercicio.n2} por ${ejercicio.factor2} (${valErr} no es correcto).`;
      }
    );
  }

  function renderizarOpcionesNumeradorPaso2(idContenedor, correcto, extras, onAcierto, onError) {
    const cont = document.getElementById(idContenedor);
    cont.innerHTML = '';
    const opciones = generarOpcionesNumericas(correcto, 1, extras);

    opciones.forEach(function (val) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion-mini';
      btn.textContent = String(val);
      btn.addEventListener('click', function () {
        if (val === correcto) {
          btn.classList.add('correcta');
          btn.textContent = `✓ ${val}`;
          deshabilitarBotones(cont);
          onAcierto();
        } else {
          btn.classList.add('incorrecta');
          btn.textContent = `✗ ${val}`;
          btn.disabled = true;
          onError(val);
        }
      });
      cont.appendChild(btn);
    });
  }

  function verificarFinPaso2() {
    if (estadoPaso2.num1Listo && estadoPaso2.num2Listo) {
      const feedback = document.getElementById('feedbackPaso2');
      feedback.className = 'feedback-paso ok';
      feedback.textContent = `✓ ¡Genial! Las fracciones equivalentes son ${ejercicio.eqNum1}/${ejercicio.mcm} y ${ejercicio.eqNum2}/${ejercicio.mcm}. Observa cómo se iluminan en las figuras.`;

      document.querySelectorAll('.frac-eq').forEach(function (el) {
        el.classList.add('completado');
      });

      actualizarBarraPasos(3);
    }
  }

  /* ── PASO 3: Realizar la suma o resta final y simplificar si es posible ──── */
  function configurarPaso3() {
    const verbo = ejercicio.op === '+' ? 'Suma' : 'Resta';
    const inst = document.getElementById('instruccionPaso3');
    inst.innerHTML = `${verbo} los numeradores <strong>${ejercicio.eqNum1} ${ejercicio.op} ${ejercicio.eqNum2}</strong> conservando el denominador común <strong>${ejercicio.mcm}</strong> y simplifica si es posible.`;

    const resumen = document.getElementById('resumenEcuacionPaso3');
    resumen.innerHTML = `
      <span>${ejercicio.eqNum1}/${ejercicio.mcm}</span>
      <span>${ejercicio.op}</span>
      <span>${ejercicio.eqNum2}/${ejercicio.mcm}</span>
      <span>=</span>
      <span>(${ejercicio.eqNum1} ${ejercicio.op} ${ejercicio.eqNum2}) / ${ejercicio.mcm}</span>
    `;

    const subSimplificar = document.getElementById('subpaso3Simplificar');
    subSimplificar.classList.add('oculto');

    const accionesFin = document.getElementById('accionesFinEjercicio');
    accionesFin.classList.add('oculto');

    const feedback = document.getElementById('feedbackPaso3');
    feedback.className = 'feedback-paso';
    feedback.textContent = '';

    // Generar opciones de fracción resultante (antes de simplificar)
    const contOperar = document.getElementById('opcionesPaso3Operar');
    contOperar.innerHTML = '';

    const numCorrecto = ejercicio.resNum;
    const denCorrecto = ejercicio.resDen;

    const numsDistractores = generarOpcionesNumericas(numCorrecto, 1, [
      ejercicio.n1 + ejercicio.n2,
      Math.abs(ejercicio.eqNum1 - ejercicio.eqNum2) || 1,
      numCorrecto + 1,
      numCorrecto + 2
    ]);

    const opcionesFrac = numsDistractores.map(function (n) {
      return { num: n, den: denCorrecto, correcta: n === numCorrecto };
    });

    opcionesFrac.forEach(function (item) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion';
      btn.textContent = `${item.num}/${item.den}`;
      btn.addEventListener('click', function () {
        if (item.correcta) {
          btn.classList.add('correcta');
          btn.textContent = `✓ ${item.num}/${item.den}`;
          deshabilitarBotones(contOperar);

          document.getElementById('eqNumRes').textContent = item.num;
          document.getElementById('eqDenRes').textContent = item.den;
          document.getElementById('bloqueEqResultado').classList.add('completado');

          actualizarVisuales(3);

          if (ejercicio.esSimplificable) {
            feedback.className = 'feedback-paso ok';
            feedback.textContent = `✓ ¡Muy bien! ${ejercicio.eqNum1} ${ejercicio.op} ${ejercicio.eqNum2} = ${item.num}, así que obtenemos ${item.num}/${item.den}. ¡Ahora simplifiquemos la fracción!`;
            activarSubpasoSimplificar();
          } else {
            feedback.className = 'feedback-paso ok';
            feedback.textContent = `✓ ¡Correcto! El resultado final es ${item.num}/${item.den} y ya es una fracción irreducible (no se puede simplificar más).`;
            concluirEjercicioExitoso();
          }
        } else {
          btn.classList.add('incorrecta');
          btn.textContent = `✗ ${item.num}/${item.den}`;
          btn.disabled = true;
          feedback.className = 'feedback-paso err';
          feedback.textContent = `✗ Revisa el numerador: calcula ${ejercicio.eqNum1} ${ejercicio.op} ${ejercicio.eqNum2} y mantén el denominador ${denCorrecto}.`;
        }
      });
      contOperar.appendChild(btn);
    });
  }

  function activarSubpasoSimplificar() {
    const subSimplificar = document.getElementById('subpaso3Simplificar');
    subSimplificar.classList.remove('oculto');

    const textoExp = document.getElementById('textoExplicacionSimplificar');
    textoExp.innerHTML = `La fracción <strong>${ejercicio.resNum}/${ejercicio.resDen}</strong> se puede simplificar dividiendo numerador y denominador entre <strong>${ejercicio.divisorSimplificar}</strong>. ¿Cuál es la fracción simplificada?`;

    const contSimp = document.getElementById('opcionesPaso3Simplificar');
    contSimp.innerHTML = '';

    const correctaStr = `${ejercicio.simNum}/${ejercicio.simDen}`;
    const candidatas = [
      { txt: correctaStr, ok: true },
      { txt: `${ejercicio.simNum}/${ejercicio.resDen}`, ok: false },
      { txt: `${ejercicio.resNum}/${ejercicio.simDen}`, ok: false },
      { txt: `${ejercicio.simNum + 1}/${ejercicio.simDen + 1}`, ok: false },
      { txt: `1/${ejercicio.simDen + 1}`, ok: false }
    ];

    const vistas = new Set();
    const filtradas = [];
    for (let i = 0; i < candidatas.length; i++) {
      if (!vistas.has(candidatas[i].txt)) {
        vistas.add(candidatas[i].txt);
        filtradas.push(candidatas[i]);
      }
      if (filtradas.length === 4) break;
    }

    const mezcladas = mezclarArreglo(filtradas);
    const feedback = document.getElementById('feedbackPaso3');

    mezcladas.forEach(function (op) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion';
      btn.textContent = op.txt;
      btn.addEventListener('click', function () {
        if (op.ok) {
          btn.classList.add('correcta');
          btn.textContent = `✓ ${op.txt}`;
          deshabilitarBotones(contSimp);

          document.getElementById('eqNumRes').textContent = ejercicio.simNum;
          document.getElementById('eqDenRes').textContent = ejercicio.simDen;
          actualizarVisuales(4);

          feedback.className = 'feedback-paso ok';
          feedback.textContent = `✓ ¡Excelente simplificación! ${ejercicio.resNum}/${ejercicio.resDen} = ${ejercicio.simNum}/${ejercicio.simDen}.`;
          concluirEjercicioExitoso();
        } else {
          btn.classList.add('incorrecta');
          btn.textContent = `✗ ${op.txt}`;
          btn.disabled = true;
          feedback.className = 'feedback-paso err';
          feedback.textContent = `✗ Divide ${ejercicio.resNum} ÷ ${ejercicio.divisorSimplificar} y ${ejercicio.resDen} ÷ ${ejercicio.divisorSimplificar}.`;
        }
      });
      contSimp.appendChild(btn);
    });
  }

  function deshabilitarBotones(contenedor) {
    const botones = contenedor.querySelectorAll('button');
    botones.forEach(function (b) {
      b.disabled = true;
    });
  }

  /* ── Conclusión de Ejercicio e Integración Offline-First con M.E.T.A.S. ──── */
  function concluirEjercicioExitoso() {
    actualizarBarraPasos(4);
    ejerciciosCompletados++;

    // Actualizar marcador y estrellas
    const contadorEl = document.getElementById('contadorEjercicios');
    contadorEl.textContent = `${ejerciciosCompletados} / ${META_EJERCICIOS}`;

    const estrellas = document.querySelectorAll('#estrellasMeta .estrella');
    estrellas.forEach(function (est, idx) {
      if (idx < ejerciciosCompletados) {
        est.classList.add('ganada');
      }
    });

    const accionesFin = document.getElementById('accionesFinEjercicio');
    accionesFin.classList.remove('oculto');

    // Al completar 5 ejercicios correctos, disparar el evento de guardado local
    if (ejerciciosCompletados >= META_EJERCICIOS && !evaluacionDisparada) {
      evaluacionDisparada = true;
      registrarEvaluacionMetas();
      mostrarModalMisionCompletada();
    }
  }

  function registrarEvaluacionMetas() {
    // Disparador exacto requerido por la arquitectura offline-first de M.E.T.A.S.
    document.dispatchEvent(new CustomEvent('metas:registro', { detail: { id: 'frac-het-' + Date.now(), tipo: 'evaluacion', mision: MISION_ID, nota: 100, base: 100, t: new Date().toISOString() } }));

    // Respaldo adicional en localStorage (METAS_REGISTRO_V1) para reportes docentes locales
    try {
      const clave = 'METAS_REGISTRO_V1';
      const lista = JSON.parse(localStorage.getItem(clave) || '[]');
      const alumno = (window.METAS && typeof window.METAS.getAlumno === 'function')
        ? window.METAS.getAlumno()
        : {};
      lista.push({
        id: 'frac-het-local-' + Date.now(),
        tipo: 'evaluacion',
        mision: MISION_ID,
        titulo: 'Suma y Resta de Fracciones Heterogéneas',
        nota: 100,
        base: 100,
        pct: 100,
        nombre: alumno.nombre || '',
        grado: alumno.grado || '',
        seccion: alumno.seccion || '',
        centro: alumno.centro || '',
        t: new Date().toISOString()
      });
      localStorage.setItem(clave, JSON.stringify(lista));
    } catch (_) {}
  }

  function mostrarModalMisionCompletada() {
    const modal = document.getElementById('modalMisionCompletada');
    if (modal) {
      modal.classList.remove('oculto');
    }
  }

  /* ── Síntesis de Voz con Web Speech API (🔊 Escuchar) ────────────────────── */
  function obtenerTextoVozPaso(paso) {
    if (!ejercicio) return 'Bienvenido a la misión de suma y resta de fracciones heterogéneas.';
    const verboOp = ejercicio.op === '+' ? 'más' : 'menos';
    const accionOp = ejercicio.op === '+' ? 'Suma' : 'Resta';

    if (paso === 1) {
      return `Paso 1: Encuentra el denominador común. Tenemos ${ejercicio.n1} sobre ${ejercicio.d1}, ${verboOp} ${ejercicio.n2} sobre ${ejercicio.d2}. Como los denominadores ${ejercicio.d1} y ${ejercicio.d2} son diferentes, elige su mínimo común múltiplo en los botones.`;
    }
    if (paso === 2) {
      return `Paso 2: Convierte a fracciones equivalentes con denominador ${ejercicio.mcm}. En la primera fracción, multiplica ${ejercicio.n1} por ${ejercicio.factor1}. En la segunda fracción, multiplica ${ejercicio.n2} por ${ejercicio.factor2}.`;
    }
    if (paso === 3) {
      let txt = `Paso 3: Realiza la operación final. ${accionOp} los numeradores ${ejercicio.eqNum1} y ${ejercicio.eqNum2} dejando el denominador común ${ejercicio.mcm}.`;
      if (ejercicio.esSimplificable) {
        txt += ` Después, simplifica el resultado dividiendo numerador y denominador entre ${ejercicio.divisorSimplificar}.`;
      }
      return txt;
    }
    return `¡Excelente trabajo! Has completado este ejercicio. Pulsa siguiente ejercicio para continuar.`;
  }

  function hablarTexto(texto, botonOrigen) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'es-HN';
      utterance.rate = 0.96;
      utterance.pitch = 1.05;

      const voces = window.speechSynthesis.getVoices();
      if (voces && voces.length > 0) {
        const vozEs = voces.find(function (v) {
          return v.lang && v.lang.toLowerCase().indexOf('es') === 0;
        });
        if (vozEs) utterance.voice = vozEs;
      }

      if (botonOrigen) {
        botonOrigen.classList.add('hablando');
        utterance.onend = function () {
          botonOrigen.classList.remove('hablando');
        };
        utterance.onerror = function () {
          botonOrigen.classList.remove('hablando');
        };
      }

      window.speechSynthesis.speak(utterance);
    } catch (_) {}
  }

  /* ── Eventos de Interfaz ─────────────────────────────────────────────────── */
  function configurarEventosUI() {
    // Botón de voz general (lee el paso activo)
    const btnVozGeneral = document.getElementById('btnVozGeneral');
    if (btnVozGeneral) {
      btnVozGeneral.addEventListener('click', function () {
        hablarTexto(obtenerTextoVozPaso(pasoActual), btnVozGeneral);
      });
    }

    // Botones de voz de cada paso
    const botonesVozPaso = document.querySelectorAll('.btn-voz-paso');
    botonesVozPaso.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const numPaso = parseInt(btn.getAttribute('data-paso'), 10) || pasoActual;
        hablarTexto(obtenerTextoVozPaso(numPaso), btn);
      });
    });

    // Selector de modo visual (Círculos / Barras / Ambos)
    const botonesModo = document.querySelectorAll('.btn-modo-vis');
    const galeria = document.getElementById('galeriaVisual');
    botonesModo.forEach(function (btn) {
      btn.addEventListener('click', function () {
        botonesModo.forEach(function (b) { b.classList.remove('activo'); });
        btn.classList.add('activo');
        modoVisual = btn.getAttribute('data-modo') || 'ambos';
        galeria.classList.remove('modo-circulos', 'modo-barras');
        if (modoVisual === 'circulos') galeria.classList.add('modo-circulos');
        if (modoVisual === 'barras') galeria.classList.add('modo-barras');
      });
    });

    // Botón de nuevo ejercicio aleatorio
    const btnNuevo = document.getElementById('btnNuevoEjercicio');
    if (btnNuevo) {
      btnNuevo.addEventListener('click', function () {
        iniciarEjercicio();
      });
    }

    // Botón siguiente ejercicio al terminar el Paso 3
    const btnSiguiente = document.getElementById('btnSiguienteEjercicio');
    if (btnSiguiente) {
      btnSiguiente.addEventListener('click', function () {
        numeroEjercicioActual++;
        iniciarEjercicio();
      });
    }

    // Botón seguir practicando en modal
    const btnSeguir = document.getElementById('btnSeguirPracticando');
    if (btnSeguir) {
      btnSeguir.addEventListener('click', function () {
        document.getElementById('modalMisionCompletada').classList.add('oculto');
        numeroEjercicioActual++;
        iniciarEjercicio();
      });
    }
  }

  /* ── Inicialización ──────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    configurarEventosUI();
    iniciarEjercicio();
  });
})();
