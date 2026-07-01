/* ============================================================
   CAMPEONÍSIMO — Banco de Preguntas
   Organizadas por materia y misión.
   Para agregar más preguntas: copiar una entrada y añadirla
   al array correspondiente (español / matemáticas / naturales / sociales).
   ============================================================ */

const CAMP_BANK = {

  /* ── ESPAÑOL ─────────────────────────────────────────────── */
  español: [
    // Los Adjetivos
    { q: '¿Para qué sirve el adjetivo calificativo?', o: ['Para nombrar cosas', 'Para expresar una cualidad del sustantivo', 'Para indicar la acción de la oración', 'Para sustituir al nombre'], c: 1, mision: 'Los Adjetivos' },
    { q: '¿En qué grado está el adjetivo en: «Mi perro es muy rápido»?', o: ['Positivo', 'Comparativo de superioridad', 'Superlativo', 'Demostrativo'], c: 2, mision: 'Los Adjetivos' },
    { q: '¿Qué tipo de adjetivo es «nuestro» en «nuestro colegio»?', o: ['Calificativo', 'Demostrativo', 'Indefinido', 'Posesivo'], c: 3, mision: 'Los Adjetivos' },
    { q: 'En la frase «Este libro es interesante», ¿qué es «Este»?', o: ['Adjetivo demostrativo', 'Adjetivo numeral', 'Sustantivo propio', 'Verbo regular'], c: 0, mision: 'Los Adjetivos' },
    { q: '¿Cómo se dice «bueno» en grado superlativo absoluto?', o: ['Más bueno', 'Buenísimo', 'Tan bueno', 'Mejor'], c: 1, mision: 'Los Adjetivos' },
    { q: 'En la frase «Tengo tres gatos», ¿qué tipo de adjetivo es «tres»?', o: ['Posesivo', 'Indefinido', 'Numeral', 'Calificativo'], c: 2, mision: 'Los Adjetivos' },
    { q: '¿Qué adjetivo concuerda con «las montañas»?', o: ['alto', 'altas', 'alta', 'altos'], c: 1, mision: 'Los Adjetivos' },
    { q: 'El grado comparativo de igualdad se forma con las palabras:', o: ['más ... que', 'menos ... que', 'muy ... ísimo', 'tan ... como'], c: 3, mision: 'Los Adjetivos' },
    { q: '¿Cuál es un adjetivo indefinido?', o: ['Aquel', 'Muchos', 'Azul', 'Primer'], c: 1, mision: 'Los Adjetivos' },
    // Los Verbos
    { q: '¿Qué expresa un verbo?', o: ['Una característica del sujeto', 'El nombre de un objeto', 'Una acción, estado o proceso', 'La unión de dos oraciones'], c: 2, mision: 'Los Verbos' },
    { q: '¿Cuáles son las terminaciones del infinitivo?', o: ['-ando, -iendo', '-ar, -er, -ir', '-ado, -ido', '-o, -as, -a'], c: 1, mision: 'Los Verbos' },
    { q: 'Si digo «Yo comeré pizza», ¿en qué tiempo está el verbo?', o: ['Pasado', 'Presente', 'Futuro', 'Infinitivo'], c: 2, mision: 'Los Verbos' },
    { q: '¿Cuál es la raíz del verbo «correr»?', o: ['cor-', 'corr-', '-er', 'corre-'], c: 1, mision: 'Los Verbos' },
    { q: '¿Cuál de estos es un verbo copulativo?', o: ['saltar', 'escribir', 'parecer', 'pensar'], c: 2, mision: 'Los Verbos' },
    { q: 'Un verbo es regular cuando...', o: ['Siempre termina en -ar', 'Mantiene su raíz al conjugarlo', 'Cambia su raíz al conjugarlo', 'Solo tiene tiempo presente'], c: 1, mision: 'Los Verbos' },
    { q: '«Ojalá ganemos el partido». ¿En qué modo está el verbo?', o: ['Indicativo', 'Imperativo', 'Subjuntivo', 'Infinitivo'], c: 2, mision: 'Los Verbos' },
    { q: '¿En qué persona está el verbo en «Tú estudias mucho»?', o: ['Primera persona', 'Segunda persona', 'Tercera persona', 'No tiene persona'], c: 1, mision: 'Los Verbos' },
    { q: '¿Qué verbo está en plural?', o: ['saltó', 'dormimos', 'ríes', 'pinto'], c: 1, mision: 'Los Verbos' },
    // Los Sustantivos
    { q: '¿Qué es un sustantivo?', o: ['Una palabra que indica acción', 'Una palabra que nombra seres, cosas o ideas', 'Una palabra que describe cualidades', 'Una palabra que une oraciones'], c: 1, mision: 'Los Sustantivos' },
    { q: '¿Cuál de estos es un sustantivo propio?', o: ['perro', 'ciudad', 'Honduras', 'alegría'], c: 2, mision: 'Los Sustantivos' },
    { q: '¿Qué tipo de sustantivo es «amor»?', o: ['Concreto', 'Colectivo', 'Propio', 'Abstracto'], c: 3, mision: 'Los Sustantivos' },
    { q: '¿Cuál es un sustantivo colectivo?', o: ['soldado', 'ejército', 'casa', 'libertad'], c: 1, mision: 'Los Sustantivos' },
    { q: '¿Qué sustantivo es incontable?', o: ['libro', 'gato', 'agua', 'mesa'], c: 2, mision: 'Los Sustantivos' },
    { q: '¿Cómo se forma el plural de «lápiz»?', o: ['lápizs', 'lápizes', 'lápices', 'lápizces'], c: 2, mision: 'Los Sustantivos' },
    { q: '¿Cuál de estos sustantivos es concreto?', o: ['valentía', 'tristeza', 'chocolate', 'esperanza'], c: 2, mision: 'Los Sustantivos' },
    { q: '¿Qué tipo de sustantivo es «bosque»?', o: ['Individual', 'Abstracto', 'Propio', 'Colectivo'], c: 3, mision: 'Los Sustantivos' },
    { q: 'Si «pan» es primitivo, ¿cuál es su derivado?', o: ['pantalón', 'panadería', 'pandilla', 'panorama'], c: 1, mision: 'Los Sustantivos' },
    // Los Pronombres
    { q: '¿Cuál es la función principal de un pronombre?', o: ['Describir cómo es un objeto', 'Sustituir al sustantivo para no repetirlo', 'Indicar la acción del sujeto', 'Unir dos oraciones'], c: 1, mision: 'Los Pronombres' },
    { q: '"El lápiz es MÍO". ¿Qué clase de pronombre es "mío"?', o: ['Personal', 'Demostrativo', 'Posesivo', 'Relativo'], c: 2, mision: 'Los Pronombres' },
    { q: '¿Cuál de los siguientes es un pronombre personal TÓNICO?', o: ['Me', 'Lo', 'Nosotros', 'Te'], c: 2, mision: 'Los Pronombres' },
    { q: 'En Honduras, el pronombre equivalente al "tú" de España es:', o: ['Vosotros', 'Vos', 'Ustedes', 'Os'], c: 1, mision: 'Los Pronombres' },
    { q: '"No vino NADIE a la fiesta". "nadie" es un pronombre:', o: ['Relativo', 'Personal', 'Demostrativo', 'Indefinido'], c: 3, mision: 'Los Pronombres' },
    { q: '"El coche QUE compré es azul". "que" es un pronombre:', o: ['Relativo', 'Interrogativo', 'Personal', 'Demostrativo'], c: 0, mision: 'Los Pronombres' },
    { q: '¿Cuál de estos es un pronombre demostrativo?', o: ['Suyo', 'Alguien', 'Aquel', 'Yo'], c: 2, mision: 'Los Pronombres' },
    { q: '"TE lo advertí". El pronombre "te" está funcionando de forma:', o: ['Enclítica', 'Proclítica', 'Posesiva', 'Interrogativa'], c: 1, mision: 'Los Pronombres' },
    { q: '"DÁMELO rápido". El pronombre en esta oración es:', o: ['Personal Tónico', 'Proclítico', 'Enclítico', 'Demostrativo'], c: 2, mision: 'Los Pronombres' },
    // Los Adverbios
    { q: '¿Cuál es la función principal de un adverbio?', o: ['Sustituir al sustantivo', 'Modificar al verbo, a un adjetivo o a otro adverbio', 'Indicar género y número', 'Unir dos oraciones'], c: 1, mision: 'Los Adverbios' },
    { q: '"Juan corre RÁPIDO". ¿Qué clase de adverbio es "rápido"?', o: ['Lugar', 'Tiempo', 'Modo', 'Cantidad'], c: 2, mision: 'Los Adverbios' },
    { q: '"Te veré MAÑANA". ¿Qué clase de adverbio es "mañana"?', o: ['Lugar', 'Tiempo', 'Modo', 'Duda'], c: 1, mision: 'Los Adverbios' },
    { q: '"El gato está AQUÍ". ¿Qué clase de adverbio es "aquí"?', o: ['Lugar', 'Tiempo', 'Cantidad', 'Negación'], c: 0, mision: 'Los Adverbios' },
    { q: '"Como MUCHO los fines de semana". ¿Qué clase de adverbio es "mucho"?', o: ['Modo', 'Cantidad', 'Afirmación', 'Lugar'], c: 1, mision: 'Los Adverbios' },
    { q: '"SÍ, iré contigo". ¿Qué clase de adverbio es "sí"?', o: ['Afirmación', 'Negación', 'Duda', 'Modo'], c: 0, mision: 'Los Adverbios' },
    { q: '"NUNCA lo haré". ¿Qué clase de adverbio es "nunca"?', o: ['Afirmación', 'Negación', 'Tiempo', 'Lugar'], c: 1, mision: 'Los Adverbios' },
    { q: '"QUIZÁS llueva mañana". ¿Qué clase de adverbio es "quizás"?', o: ['Duda', 'Negación', 'Cantidad', 'Modo'], c: 0, mision: 'Los Adverbios' },
    { q: '¿Cuál es el adverbio formado a partir del adjetivo "feliz"?', o: ['Felizamente', 'Felizmente', 'Felizemente', 'Felicidad'], c: 1, mision: 'Los Adverbios' },
    // La Acentuación
    { q: '¿Cuál es la sílaba tónica de la palabra "camino"?', o: ['ca', 'mi', 'no', 'Ninguna'], c: 1, mision: 'La Acentuación' },
    { q: '¿Cuáles son las vocales fuertes?', o: ['i, u', 'a, e, o', 'a, i, u', 'Todas las vocales'], c: 1, mision: 'La Acentuación' },
    { q: '"Piano" tiene un diptongo formado por:', o: ['Dos vocales fuertes', 'Una débil átona + una fuerte', 'Tres vocales', 'Una fuerte tónica sola'], c: 1, mision: 'La Acentuación' },
    { q: '"Buey" es un ejemplo de:', o: ['Diptongo', 'Hiato', 'Triptongo', 'Sílaba átona'], c: 2, mision: 'La Acentuación' },
    { q: '¿Cuándo llevan tilde las palabras agudas?', o: ['Siempre', 'Cuando terminan en n, s o vocal', 'Nunca', 'Cuando terminan en consonante'], c: 1, mision: 'La Acentuación' },
    { q: '¿Cuándo llevan tilde las palabras llanas?', o: ['Cuando terminan en n, s o vocal', 'Cuando NO terminan en n, s o vocal', 'Siempre', 'Nunca'], c: 1, mision: 'La Acentuación' },
    { q: 'Las palabras esdrújulas y sobresdrújulas:', o: ['Nunca llevan tilde', 'Llevan tilde solo a veces', 'Siempre llevan tilde', 'Solo si terminan en vocal'], c: 2, mision: 'La Acentuación' },
    { q: '¿Cuál de estas palabras es esdrújula?', o: ['Camión', 'Árbol', 'Música', 'Compás'], c: 2, mision: 'La Acentuación' },
    { q: 'En "Él no sabe si vendrá", la palabra "Él" lleva tilde porque:', o: ['Es aguda terminada en vocal', 'Es tilde diacrítica (pronombre)', 'Es esdrújula', 'Es un error'], c: 1, mision: 'La Acentuación' },
  ],

  /* ── MATEMÁTICAS ─────────────────────────────────────────── */
  matemáticas: [
    // Ángulos y Bisectriz
    { q: '¿Cuánto mide un ángulo recto?', o: ['45°', '90°', '180°', '360°'], c: 1, mision: 'Ángulos y Bisectriz' },
    { q: 'Un ángulo de 135° es de tipo:', o: ['Agudo', 'Recto', 'Obtuso', 'Llano'], c: 2, mision: 'Ángulos y Bisectriz' },
    { q: '¿Qué hace la bisectriz de un ángulo?', o: ['Lo elimina', 'Lo duplica', 'Lo divide en dos partes iguales', 'Lo convierte en recto'], c: 2, mision: 'Ángulos y Bisectriz' },
    { q: 'Si un ángulo mide 60°, su bisectriz crea dos ángulos de:', o: ['20°', '30°', '45°', '60°'], c: 1, mision: 'Ángulos y Bisectriz' },
    { q: '¿Cuánto suman dos ángulos suplementarios?', o: ['90°', '180°', '270°', '360°'], c: 1, mision: 'Ángulos y Bisectriz' },
    { q: 'Un ángulo de 55° es de tipo:', o: ['Agudo', 'Recto', 'Obtuso', 'Llano'], c: 0, mision: 'Ángulos y Bisectriz' },
    { q: '¿Cuánto suman dos ángulos complementarios?', o: ['45°', '90°', '180°', '360°'], c: 1, mision: 'Ángulos y Bisectriz' },
    { q: 'El complemento de un ángulo de 40° es:', o: ['40°', '50°', '140°', '320°'], c: 1, mision: 'Ángulos y Bisectriz' },
    { q: '¿Cuánto mide un ángulo llano?', o: ['90°', '120°', '180°', '360°'], c: 2, mision: 'Ángulos y Bisectriz' },
    // Números Decimales
    { q: '¿Qué símbolo se usa en Honduras para separar la parte decimal?', o: ['La coma (,)', 'El punto (.)', 'El guion (-)', 'La barra (/)'], c: 1, mision: 'Números Decimales' },
    { q: '¿Cuál es el valor posicional del dígito 5 en 0.05?', o: ['Décimas', 'Unidades', 'Centésimas', 'Milésimas'], c: 2, mision: 'Números Decimales' },
    { q: '¿Cómo se lee correctamente el número 3.7?', o: ['Treinta y siete', 'Tres coma siete', 'Tres enteros siete décimas', 'Tres punto siete centésimas'], c: 2, mision: 'Números Decimales' },
    { q: '¿Cuál de estos números es el mayor?', o: ['0.75', '0.8', '0.079', '0.7'], c: 1, mision: 'Números Decimales' },
    { q: 'Al redondear 4.56 a la décima más cercana, ¿cuál es el resultado?', o: ['4.5', '5.0', '4.6', '4.55'], c: 2, mision: 'Números Decimales' },
    { q: '¿Cuánto es 1.5 + 2.35?', o: ['3.80', '3.85', '3.90', '4.85'], c: 1, mision: 'Números Decimales' },
    { q: 'En el número 7.843, ¿qué dígito está en las milésimas?', o: ['7', '8', '4', '3'], c: 3, mision: 'Números Decimales' },
    { q: '¿Cuál es la fracción equivalente a 0.25?', o: ['2/5', '1/4', '1/2', '25/10'], c: 1, mision: 'Números Decimales' },
    { q: '¿Cuánto es 5.0 − 2.35?', o: ['3.65', '2.75', '2.65', '3.75'], c: 0, mision: 'Números Decimales' },
    { q: 'Al multiplicar 0.3 × 0.2, ¿cuál es el resultado?', o: ['0.6', '0.06', '6.0', '0.006'], c: 1, mision: 'Números Decimales' },
    // División de Decimales
    { q: '¿Qué debes hacer primero si el divisor tiene decimales?', o: ['Dividir normalmente', 'Convertirlo a número entero moviendo el punto', 'Agregar ceros al cociente', 'Borrar el punto'], c: 1, mision: 'División de Decimales' },
    { q: 'Para calcular 3.5 ÷ 0.5, ¿cuál es la división equivalente?', o: ['350 ÷ 5', '35 ÷ 50', '35 ÷ 5', '3 ÷ 5'], c: 2, mision: 'División de Decimales' },
    { q: 'Si mueves el punto 2 veces en el divisor, ¿cuántas veces en el dividendo?', o: ['1 vez', '2 veces', '3 veces', 'Ninguna'], c: 1, mision: 'División de Decimales' },
    { q: 'Si divides 10 ÷ 0.5, ¿qué pasará con el resultado?', o: ['Será MAYOR que 10', 'Será MENOR que 10', 'Será IGUAL a 10', 'Será negativo'], c: 0, mision: 'División de Decimales' },
    { q: 'Calcula: 1.2 ÷ 0.4', o: ['0.3', '30', '3', '12'], c: 2, mision: 'División de Decimales' },
    { q: '¿Cuál es el resultado de 5 ÷ 0.1?', o: ['0.5', '5', '50', '500'], c: 2, mision: 'División de Decimales' },
    { q: 'Si divides 10 ÷ 2.5, ¿qué pasará con el resultado?', o: ['Será MAYOR que 10', 'Será MENOR que 10', 'Será IGUAL a 10', 'Será cero'], c: 1, mision: 'División de Decimales' },
    { q: 'La división 0.45 ÷ 0.09 es igual a:', o: ['4.5 ÷ 9', '45 ÷ 90', '450 ÷ 9', '45 ÷ 9'], c: 3, mision: 'División de Decimales' },
    { q: '¿Qué haces si debes mover el punto en el dividendo pero ya no hay más cifras?', o: ['Pongo un punto en el cociente', 'Agrego ceros a la derecha', 'Dejo la división así', 'Resto los decimales'], c: 1, mision: 'División de Decimales' },
    // Área de Círculos y Polígonos
    { q: '¿Cuál es la fórmula para calcular el área de un círculo?', o: ['A = π · d', 'A = π · r²', 'A = (P · a) / 2', 'A = 2 · π · r'], c: 1, mision: 'Área: Círculos y Polígonos' },
    { q: 'Si el diámetro de un círculo es 10 cm, ¿cuál es su radio?', o: ['5 cm', '10 cm', '20 cm', '3.14 cm'], c: 0, mision: 'Área: Círculos y Polígonos' },
    { q: '¿Qué es la apotema de un polígono regular?', o: ['El lado más largo', 'La distancia de vértice a vértice', 'Distancia del centro al punto medio del lado', 'La suma de todos los lados'], c: 2, mision: 'Área: Círculos y Polígonos' },
    { q: 'Para encontrar el área de un hexágono regular usamos:', o: ['A = l · l', 'A = (b · h) / 2', 'A = π · r²', 'A = (P · a) / 2'], c: 3, mision: 'Área: Círculos y Polígonos' },
    { q: '¿Qué elementos delimitan un "Sector Circular"?', o: ['Dos radios y un arco', 'Tres lados rectos', 'Un diámetro y una cuerda', 'Dos apotemas'], c: 0, mision: 'Área: Círculos y Polígonos' },
    { q: 'Si el radio de un círculo es 3 cm y π ≈ 3, su área aproximada es:', o: ['9 cm²', '18 cm²', '27 cm²', '12 cm²'], c: 2, mision: 'Área: Círculos y Polígonos' },
    { q: '¿Cómo se calcula el perímetro de un pentágono regular con lado l?', o: ['P = l + 5', 'P = 5 · l', 'P = l²', 'P = (l · 5) / 2'], c: 1, mision: 'Área: Círculos y Polígonos' },
    { q: 'Al calcular áreas, ¿en qué unidades se expresa el resultado?', o: ['Unidades cúbicas (cm³)', 'Unidades lineales (cm)', 'Grados (°)', 'Unidades cuadradas (cm²)'], c: 3, mision: 'Área: Círculos y Polígonos' },
    { q: '¿Qué valor aproximado tiene π (pi)?', o: ['2.14', '3.14', '4.14', '3.41'], c: 1, mision: 'Área: Círculos y Polígonos' },
  ],

  /* ── CIENCIAS NATURALES ──────────────────────────────────── */
  naturales: [
    // Las Eras Geológicas
    { q: '¿Cuál es la era geológica más larga de la historia de la Tierra?', o: ['Paleozoica', 'Mesozoica', 'Precámbrica', 'Cuaternaria'], c: 2, mision: 'Las Eras Geológicas' },
    { q: '¿En qué era vivieron los dinosaurios?', o: ['Precámbrica', 'Paleozoica', 'Mesozoica', 'Cenozoica'], c: 2, mision: 'Las Eras Geológicas' },
    { q: '¿Qué fue Pangea?', o: ['Un océano antiguo', 'Un supercontinente', 'Un fósil gigante', 'Una glaciación'], c: 1, mision: 'Las Eras Geológicas' },
    { q: '¿Qué animal es el fósil guía de la era Paleozoica?', o: ['Dinosaurio', 'Mamut', 'Trilobite', 'Tigre dientes de sable'], c: 2, mision: 'Las Eras Geológicas' },
    { q: '¿Qué causó la extinción de los dinosaurios?', o: ['Una glaciación', 'Un terremoto', 'Un meteorito', 'Una erupción volcánica'], c: 2, mision: 'Las Eras Geológicas' },
    { q: '¿En qué era apareció el ser humano (Homo sapiens)?', o: ['Mesozoica', 'Cenozoica', 'Cuaternaria', 'Paleozoica'], c: 2, mision: 'Las Eras Geológicas' },
    { q: '¿Qué tipo de animales dominaron la era Cenozoica?', o: ['Reptiles marinos', 'Mamíferos gigantes', 'Bacterias', 'Dinosaurios'], c: 1, mision: 'Las Eras Geológicas' },
    { q: '¿Qué evento climático caracteriza la era Cuaternaria?', o: ['Erupciones volcánicas', 'Formación de océanos', 'Edad de Hielo', 'Lluvia ácida'], c: 2, mision: 'Las Eras Geológicas' },
    { q: 'La extinción del Pérmico acabó con el ___ de las especies:', o: ['50%', '70%', '90%', '100%'], c: 2, mision: 'Las Eras Geológicas' },
    // Áreas Protegidas de Honduras
    { q: '¿En qué año fue declarada la Reserva Río Plátano Patrimonio de la Humanidad?', o: ['1975', '1982', '1990', '2001'], c: 1, mision: 'Áreas Protegidas de Honduras' },
    { q: '¿Qué porcentaje del agua potable de Tegucigalpa proviene del Parque La Tigra?', o: ['20%', '30%', '40%', '60%'], c: 2, mision: 'Áreas Protegidas de Honduras' },
    { q: '¿Cuál es el punto más alto de Honduras?', o: ['Cerro El Picacho', 'Pico Bonito', 'Cerro Las Minas', 'Montaña El Boquerón'], c: 2, mision: 'Áreas Protegidas de Honduras' },
    { q: '¿Qué siglas identifican al sistema de áreas protegidas de Honduras?', o: ['SERNA', 'SINAPH', 'COHDEFOR', 'ICF'], c: 1, mision: 'Áreas Protegidas de Honduras' },
    { q: '¿Qué corredor une las áreas protegidas desde México hasta Colombia?', o: ['Corredor Verde del Caribe', 'Corredor Andino', 'Corredor Biológico Mesoamericano', 'Reserva Maya'], c: 2, mision: 'Áreas Protegidas de Honduras' },
    { q: '¿Qué ecosistema costero sirve de criadero para peces y protege costas?', o: ['Bosque nublado', 'Manglar', 'Bosque de pino', 'Páramo'], c: 1, mision: 'Áreas Protegidas de Honduras' },
    { q: '¿Cuál fue la primera área protegida declarada en Honduras?', o: ['Parque Nacional Celaque', 'Reserva Río Plátano', 'Parque Nacional La Tigra', 'Lancetilla'], c: 2, mision: 'Áreas Protegidas de Honduras' },
    { q: '¿Qué especie emblemática de los bosques nublados mesoamericanos habita en Honduras?', o: ['Jaguar', 'Manatí', 'Tapir', 'Quetzal'], c: 3, mision: 'Áreas Protegidas de Honduras' },
    { q: '¿Cuáles son las principales causas de la deforestación en Honduras?', o: ['Turismo y minería', 'Ganadería extensiva y tala ilegal', 'Urbanización y pesca', 'Industria textil y tecnología'], c: 1, mision: 'Áreas Protegidas de Honduras' },
    // El Sistema Nervioso
    { q: '¿Qué parte del encéfalo controla el equilibrio y la coordinación de movimientos?', o: ['Cerebro', 'Cerebelo', 'Tronco encefálico', 'Médula espinal'], c: 1, mision: 'El Sistema Nervioso' },
    { q: '¿Cómo se llama la vaina que recubre el axón y acelera el impulso nervioso?', o: ['Dendrita', 'Sinapsis', 'Mielina', 'Soma'], c: 2, mision: 'El Sistema Nervioso' },
    { q: '¿Cuántos pares de nervios craneales tiene el Sistema Nervioso Periférico?', o: ['8 pares', '10 pares', '12 pares', '31 pares'], c: 2, mision: 'El Sistema Nervioso' },
    { q: '¿Qué neurotransmisor relacionado con el placer se pierde en el Parkinson?', o: ['GABA', 'Acetilcolina', 'Serotonina', 'Dopamina'], c: 3, mision: 'El Sistema Nervioso' },
    { q: '¿Qué tipo de neurona lleva información desde los receptores hacia el SNC?', o: ['Motora', 'Interneurona', 'Sensorial', 'Eferente'], c: 2, mision: 'El Sistema Nervioso' },
    { q: '¿Qué enfermedad se caracteriza por pérdida de dopamina y temblores?', o: ['Alzheimer', 'Parkinson', 'Epilepsia', 'Meningitis'], c: 1, mision: 'El Sistema Nervioso' },
    { q: '¿Qué estructura conecta los dos hemisferios del cerebro?', o: ['Tronco encefálico', 'Cuerpo calloso', 'Cerebelo', 'Bulbo raquídeo'], c: 1, mision: 'El Sistema Nervioso' },
    { q: '¿A qué velocidad máxima viaja un impulso nervioso en fibras mielinizadas?', o: ['30 m/s', '60 m/s', '90 m/s', '120 m/s'], c: 3, mision: 'El Sistema Nervioso' },
    { q: '¿Cuántos centímetros mide aproximadamente la médula espinal en un adulto?', o: ['25 cm', '35 cm', '45 cm', '60 cm'], c: 2, mision: 'El Sistema Nervioso' },
  ],

  /* ── CIENCIAS SOCIALES ───────────────────────────────────── */
  sociales: [
    // Geografía y Coordenadas
    { q: '¿Qué mide la latitud?', o: ['La distancia de este a oeste', 'La distancia angular desde el Ecuador hacia los polos', 'El tiempo en cada zona horaria', 'La altura sobre el nivel del mar'], c: 1, mision: 'Geografía y Coordenadas' },
    { q: '¿A cuántos grados de latitud se encuentra el Ecuador?', o: ['90°', '45°', '23°', '0°'], c: 3, mision: 'Geografía y Coordenadas' },
    { q: '¿Qué línea imaginaria divide la Tierra en Hemisferio Norte y Sur?', o: ['Meridiano de Greenwich', 'Trópico de Cáncer', 'El Ecuador', 'Círculo Polar Ártico'], c: 2, mision: 'Geografía y Coordenadas' },
    { q: '¿Cuál es la latitud del Trópico de Capricornio?', o: ["23° 26' Norte", "66° 34' Sur", '0° Sur', "23° 26' Sur"], c: 3, mision: 'Geografía y Coordenadas' },
    { q: '¿Qué es el Meridiano de Greenwich?', o: ['El paralelo de 0° latitud', 'El meridiano de 0° longitud que pasa por el Reino Unido', 'La línea que separa el Ártico', 'Un paralelo de 90°'], c: 1, mision: 'Geografía y Coordenadas' },
    { q: '¿Para qué sirven las coordenadas geográficas?', o: ['Para medir la temperatura', 'Para calcular la altitud', 'Para ubicar cualquier punto exacto en la Tierra', 'Para predecir el clima'], c: 2, mision: 'Geografía y Coordenadas' },
    { q: '¿En cuántas franjas (husos horarios) se divide la Tierra?', o: ['12', '36', '24', '48'], c: 2, mision: 'Geografía y Coordenadas' },
    { q: 'Honduras se encuentra en la zona climática llamada:', o: ['Zona Polar', 'Zona Templada Norte', 'Zona Templada Sur', 'Zona Tórrida'], c: 3, mision: 'Geografía y Coordenadas' },
    { q: '¿Cuál de estos es un paralelo importante de la Tierra?', o: ['Meridiano de Greenwich', 'Trópico de Cáncer', 'Primer Meridiano', 'Meridiano 90°'], c: 1, mision: 'Geografía y Coordenadas' },
    { q: 'La longitud se mide desde:', o: ['El Ecuador', 'El Polo Norte', 'El Meridiano de Greenwich', 'El Trópico de Capricornio'], c: 2, mision: 'Geografía y Coordenadas' },
    // Continentes: Europa, Asia y África
    { q: '¿Cuál es el continente más grande y más poblado del mundo?', o: ['África', 'Europa', 'América', 'Asia'], c: 3, mision: 'Continentes: Europa, Asia y África' },
    { q: '¿Qué río es el más largo del mundo?', o: ['Congo', 'Níger', 'Zambeze', 'Nilo'], c: 3, mision: 'Continentes: Europa, Asia y África' },
    { q: '¿Qué bloque político-económico agrupa 27 países de Europa?', o: ['OTAN', 'G20', 'Unión Europea', 'ONU'], c: 2, mision: 'Continentes: Europa, Asia y África' },
    { q: '¿En qué continente se encuentra el Monte Everest?', o: ['Europa', 'África', 'Asia', 'América'], c: 2, mision: 'Continentes: Europa, Asia y África' },
    { q: '¿Cuál es el desierto caluroso más grande del mundo?', o: ['Gobi', 'Kalahari', 'Atacama', 'Sahara'], c: 3, mision: 'Continentes: Europa, Asia y África' },
    { q: '¿Cuántos países tiene el continente africano?', o: ['35', '44', '54', '62'], c: 2, mision: 'Continentes: Europa, Asia y África' },
    { q: '¿Qué fenómeno climático de Asia trae lluvias estacionales esenciales para la agricultura?', o: ['Tifón', 'Huracán', 'Monzón', 'Tsunami'], c: 2, mision: 'Continentes: Europa, Asia y África' },
    { q: '¿Qué mar separa Europa de África?', o: ['Mar Rojo', 'Mar Negro', 'Mar Mediterráneo', 'Mar Caspio'], c: 2, mision: 'Continentes: Europa, Asia y África' },
    { q: '¿Qué proceso histórico explica la influencia europea en África y Asia?', o: ['Renacimiento', 'Colonialismo', 'Industrialización', 'Globalización'], c: 1, mision: 'Continentes: Europa, Asia y África' },
    // Continentes: América, Oceanía y Antártida
    { q: '¿Cuál es el río más caudaloso del mundo?', o: ['Nilo', 'Congo', 'Amazonas', 'Mississippi'], c: 2, mision: 'Continentes: América, Oceanía y Antártida' },
    { q: '¿En qué región de América se ubica Honduras?', o: ['América del Norte', 'América del Sur', 'América Central', 'El Caribe'], c: 2, mision: 'Continentes: América, Oceanía y Antártida' },
    { q: '¿Cómo se llama el acuerdo de libre comercio entre Honduras y EE.UU.?', o: ['AACUE', 'NAFTA', 'CAFTA-DR', 'MERCOSUR'], c: 2, mision: 'Continentes: América, Oceanía y Antártida' },
    { q: '¿Cuál es el continente más pequeño del mundo?', o: ['Europa', 'Antártida', 'Oceanía', 'América Central'], c: 2, mision: 'Continentes: América, Oceanía y Antártida' },
    { q: '¿Qué país es a la vez el único país-continente del mundo?', o: ['Nueva Zelanda', 'Australia', 'Papúa Nueva Guinea', 'Fiyi'], c: 1, mision: 'Continentes: América, Oceanía y Antártida' },
    { q: '¿Cuál es el arrecife de coral más grande del mundo?', o: ['Barrera de Mesoamérica', 'Barrera del Caribe', 'Gran Barrera de Coral', 'Arrecife de las Maldivas'], c: 2, mision: 'Continentes: América, Oceanía y Antártida' },
    { q: '¿Cuál es el continente más frío del mundo?', o: ['Europa', 'Asia', 'América del Norte', 'Antártida'], c: 3, mision: 'Continentes: América, Oceanía y Antártida' },
    { q: '¿En qué año se firmó el Tratado Antártico?', o: ['1945', '1959', '1972', '1991'], c: 1, mision: 'Continentes: América, Oceanía y Antártida' },
    { q: '¿Cuál es la cordillera más larga del mundo?', o: ['El Himalaya', 'Los Alpes', 'Los Andes', 'Las Rocosas'], c: 2, mision: 'Continentes: América, Oceanía y Antártida' },
    { q: '¿Qué porcentaje del agua dulce del planeta está en la Antártida?', o: ['30%', '50%', '70%', '90%'], c: 2, mision: 'Continentes: América, Oceanía y Antártida' },
    { q: '¿Qué organismo reúne a los 35 países del continente americano?', o: ['ONU', 'OEA', 'CEPAL', 'ALBA'], c: 1, mision: 'Continentes: América, Oceanía y Antártida' },
  ],
};
