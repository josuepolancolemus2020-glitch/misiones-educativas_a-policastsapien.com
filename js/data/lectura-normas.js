/* ══════════════════════════════════════════════════════════════
   📖 NORMAS DE LECTURA — velocidad, precisión y comprensión

   La ciencia del Control de lectura (js/tools/lectura-fluidez.js) vive
   AQUÍ, en un solo archivo de datos: si mañana la Secretaría de
   Educación de Honduras publica su propia tabla de palabras por
   minuto, se cambia este archivo y nada más.

   ── De dónde salen las cifras (y de dónde NO) ──
   El DCNB de Honduras pide velocidad lectora y fluidez como
   competencia de Comunicación/Español, pero NO publica una tabla
   numérica de palabras por minuto (revisado en _dev/dcnb, agosto de
   2026). Por eso la banda por grado usa la referencia latinoamericana
   más difundida y estable:

     «Estándares Nacionales de Habilidad Lectora», Secretaría de
     Educación Pública (SEP), México, 2010 — palabras leídas por
     minuto EN VOZ ALTA al TERMINAR cada grado:
       1º: 35–59 · 2º: 60–84 · 3º: 85–99 · 4º: 100–114 · 5º: 115–124
       6º: 125–134 · 7º: 135–144 · 8º: 145–154 · 9º: 155–160
     (7º–9º equivalen a 1º–3º de secundaria en México.)

   ── Dónde se nombra la fuente y dónde NO ──
   La regla del proyecto es que un número impreso diga de dónde viene y
   cuándo. Para esta cifra, el maestro la afinó en dos pasos (agosto de
   2026), y el criterio que quedó es de QUIÉN LEE EL PAPEL:

   · EN LAS PANTALLAS DEL MAESTRO (pestaña 📖 Lectura, resultado de la
     toma) la fuente va nombrada y fechada, siempre. El maestro es
     quien tiene que poder defender la cifra si se la discuten.
   · EN LO QUE SALE DE SUS MANOS —el informe del alumno que firman la
     Dirección y la familia, y la ficha que contestan los alumnos— va
     la BANDA sola, sin la fuente. Ahí «referencia SEP México, 2010»
     no ayuda a nadie: al padre le abre una discusión que no es la de
     su hijo, y en la hoja del alumno solo mete ruido.

   La BANDA, en cambio, se escribe siempre, en pantalla y en papel: el
   nivel («Requiere apoyo») sin los números que lo sostienen es una
   etiqueta puesta encima de un niño, y eso sí que no puede salir en un
   papel que lee su madre.

   La PRECISIÓN usa el criterio clásico de los inventarios informales
   de lectura (Betts): ≥98 % palabras correctas = nivel independiente;
   95–97 % = instruccional (con acompañamiento); <95 % = frustración
   (el texto queda grande; se baja de nivel y se vuelve a intentar).

   La banda es de FIN de grado: a inicio de año es normal estar
   debajo. El veredicto lo recuerda para no alarmar en febrero.
══════════════════════════════════════════════════════════════ */

const LECTURA_NORMAS = {
  fuente: 'Estándares Nacionales de Habilidad Lectora, SEP México, 2010',
  fuenteCorta: 'referencia SEP México, 2010',
  /* [mínimo, máximo] de la banda «estándar» al terminar el grado */
  bandas: {
    1: [35, 59],
    2: [60, 84],
    3: [85, 99],
    4: [100, 114],
    5: [115, 124],
    6: [125, 134],
    7: [135, 144],
    8: [145, 154],
    9: [155, 160],
  },
};

/* Colores: el mismo idioma de la plataforma (verde avanza, turquesa va
   bien, ocre pide ojo, rojo pide apoyo) — el color siempre acompaña a
   la etiqueta escrita, nunca habla solo. */
const LEC_NIVEL_COLORES = {
  avanzado: '#16a34a',
  estandar: '#0891b2',
  acerca: '#a16207',
  apoyo: '#dc2626',
};

/* Nivel de VELOCIDAD para un grado: la banda del grado es el estándar;
   por encima es avanzado; la banda del grado anterior es «se acerca»;
   más abajo, requiere apoyo. */
function lecNivelVelocidad(grado, ppm) {
  const g = Math.max(1, Math.min(9, Number(grado) || 2));
  const banda = LECTURA_NORMAS.bandas[g];
  const bandaPrev = LECTURA_NORMAS.bandas[g - 1] || [Math.max(10, banda[0] - 25), banda[0] - 1];
  const v = Number(ppm) || 0;
  if (v > banda[1]) return { clave: 'avanzado', etiqueta: 'Avanzado', color: LEC_NIVEL_COLORES.avanzado, banda };
  if (v >= banda[0]) return { clave: 'estandar', etiqueta: 'Estándar', color: LEC_NIVEL_COLORES.estandar, banda };
  if (v >= bandaPrev[0]) return { clave: 'acerca', etiqueta: 'Se acerca al estándar', color: LEC_NIVEL_COLORES.acerca, banda };
  return { clave: 'apoyo', etiqueta: 'Requiere apoyo', color: LEC_NIVEL_COLORES.apoyo, banda };
}

/* PRECISIÓN: palabras leídas correctamente ÷ palabras leídas.
   Criterio clásico de los inventarios informales de lectura. */
function lecNivelPrecision(palabrasLeidas, errores) {
  const p = Number(palabrasLeidas) || 0;
  const e = Math.max(0, Number(errores) || 0);
  if (!p) return null;
  const pct = Math.max(0, Math.round(((p - e) / p) * 1000) / 10);
  if (pct >= 98) return { clave: 'independiente', etiqueta: 'Independiente', color: LEC_NIVEL_COLORES.avanzado, pct };
  if (pct >= 95) return { clave: 'instruccional', etiqueta: 'Instruccional', color: LEC_NIVEL_COLORES.estandar, pct };
  return { clave: 'frustracion', etiqueta: 'Frustración', color: LEC_NIVEL_COLORES.apoyo, pct };
}

/* COMPRENSIÓN sobre las preguntas orales (normalmente 5) */
function lecNivelComprension(correctas, de) {
  const d = Number(de) || 0;
  if (!d) return null;
  const c = Math.max(0, Math.min(d, Number(correctas) || 0));
  const pct = Math.round((c / d) * 100);
  const r = { correctas: c, de: d, pct };
  if (pct >= 100) return Object.assign(r, { clave: 'profunda', etiqueta: 'Comprensión profunda', color: LEC_NIVEL_COLORES.avanzado });
  if (pct >= 80) return Object.assign(r, { clave: 'satisfactoria', etiqueta: 'Satisfactoria', color: LEC_NIVEL_COLORES.estandar });
  if (pct >= 60) return Object.assign(r, { clave: 'basica', etiqueta: 'Básica', color: LEC_NIVEL_COLORES.acerca });
  return Object.assign(r, { clave: 'apoyo', etiqueta: 'Requiere apoyo', color: LEC_NIVEL_COLORES.apoyo });
}

/* ── El VEREDICTO del doctor en lenguaje ──
   Une velocidad, precisión y comprensión en UNA lectura honesta.
   La regla de oro de la psicolingüística de la lectura: la velocidad
   sin comprensión no es fluidez, es descifrado veloz; y la
   comprensión lenta no es un fracaso, es una etapa. */
function lecVeredicto(grado, ppm, palabrasLeidas, errores, compCorrectas, compDe) {
  const vel = lecNivelVelocidad(grado, ppm);
  const prec = lecNivelPrecision(palabrasLeidas, errores);
  const comp = lecNivelComprension(compCorrectas, compDe);

  let txt;
  if (prec && prec.clave === 'frustracion') {
    txt = 'El texto le quedó grande esta vez (precisión bajo el 95 %): no es señal de alarma, es señal de nivel. ' +
      'Conviene repetir con un texto de un grado menor y volver a subir cuando lo lea cómodo.';
  } else if (comp && comp.pct < 60 && (vel.clave === 'avanzado' || vel.clave === 'estandar')) {
    txt = 'Lee veloz pero comprende poco: eso es descifrado, no fluidez. Conviene pedirle que baje la marcha, ' +
      'que lea «para contarlo después», y volver a preguntar. La velocidad ya la tiene; ahora toca ponerla al servicio de entender.';
  } else if (comp && comp.pct >= 80 && (vel.clave === 'apoyo' || vel.clave === 'acerca')) {
    txt = 'Comprende muy bien aunque todavía lee despacio: va por el camino correcto, porque la comprensión es lo difícil. ' +
      'La velocidad sube sola con lectura diaria en voz alta; no hay que sacrificar la comprensión por el cronómetro.';
  } else if (vel.clave === 'avanzado' && (!comp || comp.pct >= 80) && (!prec || prec.clave === 'independiente')) {
    txt = 'Lector independiente y por encima del estándar de su grado: está listo para textos de un grado mayor y para leerle a otros.';
  } else if (vel.clave === 'estandar' && (!comp || comp.pct >= 80) && (!prec || prec.clave === 'independiente')) {
    txt = 'Va dentro del estándar de su grado, con precisión y comprensión sanas. Sostener la lectura diaria en voz alta lo deja listo para cerrar el año arriba de la banda.';
  } else if (vel.clave === 'avanzado' || vel.clave === 'estandar') {
    /* velocidad lograda, pero comprensión o precisión a medio camino: el
       veredicto viejo caía aquí al texto de «por debajo de la banda» y
       mentía — la velocidad YA está */
    const flancos = [];
    if (comp && comp.pct < 80) flancos.push('la comprensión (releer y contar con sus palabras)');
    if (prec && prec.clave !== 'independiente') flancos.push('la precisión (leer un pelín más despacio, sin saltarse palabras)');
    txt = 'La velocidad va ' + (vel.clave === 'avanzado' ? 'sobrada' : 'dentro del estándar') + ' para su grado; ahora toca pulir ' +
      (flancos.join(' y ') || 'los detalles') + '. La fluidez completa es velocidad, precisión y comprensión juntas.';
  } else {
    txt = 'Aún está por debajo de la banda de su grado. La receta probada: diez minutos diarios de lectura en voz alta ' +
      'con un texto de su nivel, releyendo el mismo texto dos o tres días — la relectura es el ejercicio que más sube la fluidez.';
  }
  return { velocidad: vel, precision: prec, comprension: comp, texto: txt };
}
