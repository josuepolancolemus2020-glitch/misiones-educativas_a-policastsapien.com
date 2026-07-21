/* ── Mapa DCNB → Misiones (SOLO Zona Docente) ──────────────────────────
   Relaciona cada misión del catálogo (js/data/misiones.js, por id) con los
   GRADOS del DCNB de Honduras (4º–9º) cuyos estándares cubre, según el
   análisis de las Programaciones Educativas Nacionales (Secretaría de
   Educación / MIDEH) realizado el 21-jul-2026.

   ⚠️ Este dato es EXCLUSIVO del docente: el alumno navega por rutas y
   etapas, nunca por grados, para evitar el sesgo de "esto es de un grado
   inferior". No usar DCNB_MAP en ninguna vista del estudiante.

   Formato: id → { g: { grado: 'momento del año escolar según DCNB' } }
   El momento '' significa que el tema es espiral/recurrente en ese grado
   (se muestra como «todo el año»). */
const DCNB_MAP = {
  /* ── Matemáticas ── */
  6:  { g: { 4: 'feb–mar (refuerzo)' } },                                  // Números Grandes
  24: { g: { 4: 'inicio de año' } },                                       // Valor Posicional
  27: { g: { 4: 'inicio de año' } },                                       // Recta Numérica, Suma y Resta
  30: { g: { 4: 'inicio de año' } },                                       // Multiplicación Vertical
  28: { g: { 5: 'inicio de año' } },                                       // Múltiplos, Divisores y Primos
  26: { g: { 5: 'inicio de año', 6: 'inicio de año' } },                   // Teoría de Números
  25: { g: { 5: '', 7: '' } },                                             // Potencias y Raíces
  23: { g: { 4: '', 5: '', 6: '', 7: 'inicio de año' } },                  // Fracciones
  8:  { g: { 4: '', 5: '', 6: '', 7: 'inicio de año' } },                  // Números Decimales
  15: { g: { 5: '', 6: '' } },                                             // División de Decimales
  29: { g: { 4: '', 5: '' } },                                             // Ángulos: Tipos y Transportador
  7:  { g: { 6: '', 7: '' } },                                             // Ángulos y Bisectriz
  31: { g: { 4: '', 5: '' } },                                             // Perímetro y Área de Cuadriláteros
  16: { g: { 5: '', 6: '' } },                                             // Área de Círculos y Polígonos
  32: { g: { 6: '' } },                                                    // Área de Polígonos Regulares

  /* ── Español (espiral: el DCNB retoma estos ejes cada mes) ── */
  3:  { g: { 4: '', 5: '', 7: '', 8: '', 9: '' } },                        // Sustantivos
  1:  { g: { 4: '', 5: '', 6: '', 7: '', 9: '' } },                        // Adjetivos
  2:  { g: { 4: '', 5: '', 6: '', 7: '', 8: '', 9: '' } },                 // Verbos
  17: { g: { 4: '', 5: '', 7: '', 8: '', 9: '' } },                        // Adverbios
  4:  { g: { 4: '', 6: '', 7: '', 8: '', 9: '' } },                        // Pronombres
  18: { g: { 4: '', 5: '', 6: '', 7: '', 8: '', 9: '' } },                 // Acentuación
  22: { g: { 4: '', 5: '', 6: '', 7: '', 8: '', 9: '' } },                 // Marcadores Textuales
  21: { g: { 4: '', 5: '', 6: '', 7: '', 8: '', 9: '' } },                 // Tipos de Textos

  /* ── Ciencias Naturales (meses según programación DCNB) ── */
  14: { g: { 4: 'mayo', 5: 'mayo', 6: 'mayo', 9: 'mayo' } },               // Sistema Nervioso
  19: { g: { 5: 'mayo', 6: 'mayo' } },                                     // Sistema Endocrino
  9:  { g: { 6: 'abril', 7: 'julio' } },                                   // Eras Geológicas
  20: { g: { 4: 'julio', 6: 'julio', 7: 'junio', 8: 'agosto', 9: 'mayo' } }, // Desastres Naturales y el Mitch (CCNN + CCSS)
  10: { g: { 6: 'abril', 8: 'mayo' } },                                    // Áreas Protegidas de Honduras

  /* ── Ciencias Sociales (meses según programación DCNB) ── */
  11: { g: { 5: 'feb–mar', 6: 'feb–mar', 7: 'feb–mar' } },                 // Geografía y Coordenadas
  13: { g: { 5: 'feb–mar', 6: 'feb–mar', 9: 'abril' } },                   // Continentes: América, Oceanía y Antártida
  12: { g: { 6: 'feb–mar', 9: 'abril' } },                                 // Continentes: Europa, Asia y África
};
