/* Diagnóstico de entrada por ruta de aprendizaje (Fase 3).
   Preguntas tomadas de los bancos de evaluación de las propias misiones
   (evalMCBank), una por etapa en rutas largas y dos en rutas cortas,
   ordenadas de la etapa más básica a la más avanzada.
   Regla de recomendación: la primera etapa con error es el punto de
   partida sugerido; sin errores → la última etapa de la ruta. */
const DIAGNOSTICOS = {
  numero: [
    { etapa: 0, q: '¿Cuántas unidades hay en 1 centena?', o: ['10 unidades', '50 unidades', '100 unidades', '1,000 unidades'], a: 2 },
    { etapa: 1, q: '¿Cuál es el valor del dígito 4 en 573,420?', o: ['4', '400', '4,000', '40,000'], a: 1 },
    { etapa: 2, q: '¿Cuál es el punto medio entre 200 y 300?', o: ['205', '250', '230', '295'], a: 1 },
    { etapa: 3, q: '¿Cuál es el m.c.m. de 4 y 10?', o: ['40', '2', '20', '14'], a: 2 },
    { etapa: 4, q: '¿Cuál de estos números es primo?', o: ['33', '39', '31', '35'], a: 2 },
    { etapa: 5, q: '¿Cuánto es 8²?', o: ['16', '64', '82', '32'], a: 1 },
    { etapa: 6, q: '¿Qué indica el numerador de una fracción?', o: ['En cuántas partes se divide el entero', 'Cuántas partes se toman del entero', 'El resultado de una suma', 'El nombre de la fracción'], a: 1 },
    { etapa: 7, q: '¿Cuál fracción es equivalente a 0.75?', o: ['7/5', '1/4', '7/10', '3/4'], a: 3 },
    { etapa: 8, q: '¿A qué división entera equivale 1.5 ÷ 0.3?', o: ['150 ÷ 3', '15 ÷ 30', '15 ÷ 3'], a: 2 },
  ],
  forma: [
    { etapa: 1, q: '¿Cuánto mide un ángulo recto?', o: ['45°', '90°', '180°', '360°'], a: 1 },
    { etapa: 1, q: '¿Qué hace la bisectriz de un ángulo?', o: ['Lo elimina', 'Lo duplica', 'Lo divide en dos partes iguales', 'Lo convierte en recto'], a: 2 },
    { etapa: 2, q: '¿Cuál es la fórmula para calcular el área de un círculo?', o: ['A = π · d', 'A = π · r²', 'A = (P · a) / 2', 'A = 2 · π · r'], a: 1 },
    { etapa: 2, q: '¿Qué es la apotema de un polígono regular?', o: ['El lado más largo', 'La distancia de vértice a vértice', 'Distancia del centro al punto medio del lado', 'La suma de todos los lados'], a: 2 },
  ],
  palabra: [
    { etapa: 1, q: '¿Qué es un sustantivo?', o: ['Palabra que indica acción', 'Palabra que nombra seres y cosas', 'Palabra que describe cualidades', 'Palabra que une oraciones'], a: 1 },
    { etapa: 2, q: '¿Cuál de las siguientes palabras es un adjetivo calificativo?', o: ['Perro', 'Grande', 'Correr', 'Nosotros'], a: 1 },
    { etapa: 3, q: '¿Cuál de las siguientes palabras es un verbo?', o: ['Feliz', 'Saltar', 'Casa', 'Rápido'], a: 1 },
    { etapa: 4, q: '«Llegó TARDE a la reunión». La palabra en mayúsculas es adverbio de:', o: ['Lugar', 'Modo', 'Tiempo', 'Cantidad'], a: 2 },
    { etapa: 5, q: '«No quiero este, dame AQUEL». La palabra en mayúsculas es un pronombre:', o: ['Personal', 'Demostrativo', 'Indefinido', 'Numeral'], a: 1 },
    { etapa: 6, q: 'Las palabras agudas llevan tilde cuando:', o: ['Terminan en consonante', 'Terminan en n, s o vocal', 'Nunca', 'Siempre'], a: 1 },
    { etapa: 7, q: '«Sin embargo» es un marcador de...', o: ['Adición', 'Causa', 'Contraste', 'Orden'], a: 2 },
    { etapa: 8, q: '¿Cuál es el propósito del texto argumentativo?', o: ['Informar', 'Convencer', 'Describir', 'Contar'], a: 1 },
    { etapa: 9, q: 'Un adjetivo restrictivo se caracteriza por:', o: ['Limitar la referencia del sustantivo al que modifica', 'Ir siempre antepuesto', 'Ser invariable en género', 'Funcionar siempre como atributo'], a: 0 },
  ],
  planeta: [
    { etapa: 1, q: '¿Qué línea imaginaria divide la Tierra en Hemisferio Norte y Hemisferio Sur?', o: ['Meridiano de Greenwich', 'Trópico de Cáncer', 'El Ecuador', 'Círculo Polar Ártico'], a: 2 },
    { etapa: 2, q: '¿Cuál es el continente más pequeño del mundo?', o: ['Europa', 'Antártida', 'Oceanía', 'América Central'], a: 2 },
    { etapa: 3, q: '¿Cuál es el continente más grande y más poblado del mundo?', o: ['África', 'Europa', 'América', 'Asia'], a: 3 },
    { etapa: 4, q: '¿Cuándo un fenómeno natural se convierte en desastre?', o: ['Siempre que ocurre', 'Cuando afecta a una comunidad vulnerable y causa daños', 'Solo si ocurre de noche', 'Cuando lo predice la ciencia'], a: 1 },
    { etapa: 5, q: '¿En qué era geológica vivieron los dinosaurios?', o: ['Precámbrica', 'Paleozoica', 'Mesozoica', 'Cenozoica'], a: 2 },
    { etapa: 6, q: '¿Qué siglas identifican al sistema de áreas protegidas de Honduras?', o: ['SERNA', 'SINAPH', 'COHDEFOR', 'ICF'], a: 1 },
  ],
  cuerpo: [
    { etapa: 1, q: '¿Qué parte del encéfalo controla el equilibrio y la coordinación de movimientos?', o: ['Cerebro', 'Cerebelo', 'Tronco encefálico', 'Médula espinal'], a: 1 },
    { etapa: 1, q: '¿Cómo se llama la vaina que recubre el axón y acelera el impulso nervioso?', o: ['Dendrita', 'Sinapsis', 'Mielina', 'Soma'], a: 2 },
    { etapa: 2, q: '¿Qué mensajero químico usa el sistema endocrino para comunicarse?', o: ['El impulso eléctrico', 'La hormona', 'El neurotransmisor', 'La enzima'], a: 1 },
    { etapa: 2, q: '¿Cuál es la «glándula maestra» que dirige a las demás glándulas?', o: ['La tiroides', 'El páncreas', 'La hipófisis', 'La glándula pineal'], a: 2 },
  ],
};
