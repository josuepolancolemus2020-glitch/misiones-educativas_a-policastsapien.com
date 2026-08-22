/* ── Mapa DCNB → Misiones (SOLO Zona Docente) ──────────────────────────
   Relaciona cada misión del catálogo (js/data/misiones.js, por id) con los
   GRADOS del DCNB de Honduras (4º–9º) y los MESES del año escolar en que
   la programación oficial trabaja ese contenido, según las Programaciones
   Educativas Nacionales (Secretaría de Educación / MIDEH), verificado
   mes a mes el 21-jul-2026.

   ⚠️ Este dato es EXCLUSIVO del docente: el alumno navega por rutas y
   etapas, nunca por grados, para evitar el sesgo de "esto es de un grado
   inferior". No usar DCNB_MAP en ninguna vista del estudiante.

   Formato: id → { g: { grado: [meses] } }
   Meses: números 2–11 (2=febrero … 11=noviembre, año escolar hondureño).
   Array VACÍO [] = contenido ESPIRAL: el DCNB lo retoma todos los meses
   (típico de gramática, ortografía y léxico en Español).

   ► Base para futuras herramientas docentes (planificación mensual,
     rúbricas de evaluación): consumir estos datos vía docenteProgDatos()
     en js/app.js, que ya filtra por grado + mes + materia. PENDIENTE. */
const DCNB_MAP = {
  /* ── Matemáticas (meses verificados en la programación) ── */
  6:  { g: { 4: [2] } },                                  // Números Grandes — feb: números hasta 1 000 000
  24: { g: { 4: [2] } },                                  // Valor Posicional — feb: sistema de valor posicional
  27: { g: { 4: [3] } },                                  // Recta Numérica, Suma y Resta — mar: recta, adición, sustracción
  30: { g: { 4: [4, 5] } },                               // Multiplicación Vertical — abr-may: cálculo vertical
  29: { g: { 4: [3], 5: [2] } },                          // Ángulos: Tipos y Transportador — 4º mar; 5º feb (compl./supl.)
  28: { g: { 5: [3] } },                                  // Múltiplos, Divisores y Primos — mar
  26: { g: { 5: [3], 6: [2] } },                          // Teoría de Números: m.c.m./M.C.D. — 5º mar; 6º feb
  25: { g: { 5: [2], 7: [5, 10] } },                      // Potencias y Raíces — 5º feb; 7º may (leyes exp.) y oct (raíces)
  23: { g: { 4: [8], 5: [5], 6: [5], 7: [2, 3, 4] } },   // Las Fracciones — concepto, comparar, sumar y restar (la mult/div va en la 62)
  62: { g: { 6: [5, 6, 7], 7: [2, 3, 4] } },              // Mult. y División de Fracciones — 6º may-jul; 7º dentro de racionales
  8:  { g: { 4: [6, 7], 5: [6, 7], 6: [3, 4], 7: [2, 3, 4] } }, // Números Decimales
  63: { g: { 5: [6, 7], 6: [3, 4] } },                    // Multiplicación de Decimales — 5º jun-jul (por natural); 6º mar-abr (decimal por decimal)
  15: { g: { 5: [7], 6: [4] } },                          // División de Decimales — 5º entre natural; 6º entre decimal
  7:  { g: { 6: [2], 7: [9, 10] } },                      // Ángulos y Bisectriz — 6º feb; 7º sep-oct (geometría formal)
  31: { g: { 4: [6], 5: [4, 8] } },                       // Perímetro y Área de Cuadriláteros — 5º abr (cuadrados/rect.) y ago (rombo/trapecio)
  16: { g: { 5: [9, 10], 6: [4] } },                      // Área de Círculos y Polígonos — 5º sep-oct; 6º abr
  32: { g: { 6: [4] } },                                  // Área de Polígonos Regulares — abr (apotema)

  /* ── Español (espiral: el DCNB retoma estos ejes cada mes) ── */
  3:  { g: { 4: [], 5: [], 7: [], 8: [], 9: [] } },       // Sustantivos
  1:  { g: { 4: [], 5: [], 6: [], 7: [], 9: [] } },       // Adjetivos
  2:  { g: { 4: [], 5: [], 6: [], 7: [], 8: [], 9: [] } },// Verbos
  17: { g: { 4: [], 5: [], 7: [], 8: [], 9: [] } },       // Adverbios
  4:  { g: { 4: [], 6: [], 7: [], 8: [], 9: [] } },       // Pronombres
  18: { g: { 4: [], 5: [], 6: [], 7: [], 8: [], 9: [] } },// Acentuación
  22: { g: { 4: [], 5: [], 6: [], 7: [], 8: [], 9: [] } },// Marcadores Textuales
  21: { g: { 4: [], 5: [], 6: [], 7: [], 8: [], 9: [] } },// Tipos de Textos

  /* ── Ciencias Naturales (meses de la programación) ── */
  33: { g: { 4: [4], 5: [2, 3], 6: [2, 3], 7: [2, 3], 9: [2, 3, 4] } }, // La Célula — 4º abr; 5º/6º/7º feb-mar; 9º feb-abr (VERIFICADO CCNN)
  34: { g: { 5: [2, 3], 7: [4], 8: [2, 3] } },            // Los Cinco Reinos / clasificación de los seres vivos — 5º feb-mar; 7º abr (reino vegetal); 8º feb-mar (VERIFICADO CCNN)
  35: { g: { 4: [4], 5: [4], 6: [4], 7: [5], 8: [5] } },  // Los Ecosistemas — 4º/5º/6º abr; 7º/8º may (VERIFICADO CCNN)
  36: { g: { 4: [6, 8], 5: [7], 8: [2, 3, 6] } },         // El Sistema Digestivo y la Nutrición — 4º jun+ago; 5º jul; 8º feb-mar+jun (VERIFICADO CCNN)
  37: { g: { 4: [6], 5: [7], 7: [5], 8: [4] } },          // Respiratorio y Circulatorio — 4º jun; 5º jul (enfermedades vía circulatorio); 7º may (IRA); 8º abr (VERIFICADO CCNN)
  38: { g: { 5: [6], 6: [5, 7], 7: [5], 9: [5] } },       // Reproducción y Desarrollo Humano — 5º jun (pubertad/fecundación); 6º may (sist. reproductores, embarazo) + jul (etapas del desarrollo); 7º may; 9º may (VERIFICADO CCNN)
  39: { g: { 4: [8], 5: [8], 6: [8], 7: [7] } },          // El Universo y el Sistema Solar — 4º/5º/6º ago; 7º jul (teorías sobre el universo y el sistema solar) (VERIFICADO CCNN)
  40: { g: { 4: [9], 5: [9], 6: [8], 7: [8] } },          // La Materia — 4º/5º sep (estados y cambios de estado); 6º/7º ago (propiedades, componentes, mezclas, cambios físicos/químicos) (VERIFICADO CCNN)
  41: { g: { 4: [10, 11], 5: [10, 11], 6: [9], 7: [10, 11], 8: [10, 11] } }, // La Energía — 4º oct-nov (tipos y fuentes, no renovables); 5º oct-nov (fuentes, formas, usos y transformaciones); 6º sep (manifestaciones, fuentes, crisis energética, ahorro); 7º oct-nov (alternativas, transformaciones, ahorro); 8º oct-nov (propiedades, conservación, degradación, térmica) (VERIFICADO CCNN)
  42: { g: { 4: [2, 3], 5: [2, 3], 7: [4, 5], 8: [2, 3] } }, // Geografía de Honduras — 4º feb-mar (Honduras en el espacio centroamericano; orografía, hidrografía, clima); 5º feb-mar (Honduras en el Continente Americano); 7º abr-may (comunidad local + Honduras y su espacio geográfico: ubicación, extensión, límites + estudio regional); 8º feb-mar (importancia de la ubicación de Honduras en América) (VERIFICADO CCSS)
  43: { g: { 4: [7], 5: [7], 7: [6], 8: [6] } }, // Los Mayas y las Culturas Precolombinas — 4º jul (población precolombina de CA, los mayas, legado maya); 5º jul (culturas prehispánicas de América: maya, azteca e inca); 7º jun (población prehispánica de Honduras); 8º jun (pueblos indígenas de América antes del «descubrimiento») (VERIFICADO CCSS)
  14: { g: { 4: [5], 5: [5], 6: [5], 9: [5] } },          // Sistema Nervioso — mayo en los 4 grados
  19: { g: { 5: [5], 6: [5] } },                          // Sistema Endocrino — mayo
  9:  { g: { 6: [4], 7: [7] } },                          // Eras Geológicas
  20: { g: { 4: [7], 6: [5, 7], 7: [6], 8: [8], 9: [5] } }, // Desastres Naturales y el Mitch (CCNN + CCSS)
  10: { g: { 6: [4], 8: [5] } },                          // Áreas Protegidas de Honduras

  /* ── Ciencias Sociales (meses de la programación) ── */
  11: { g: { 5: [2, 3], 6: [2, 3], 7: [2, 3] } },         // Geografía y Coordenadas — feb-mar
  13: { g: { 5: [2, 3], 6: [2, 3], 9: [4] } },            // Continentes: América, Oceanía y Antártida
  12: { g: { 6: [2, 3], 9: [4] } },                       // Continentes: Europa, Asia y África
};
