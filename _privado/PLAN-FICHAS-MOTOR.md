# Plan: las fichas como motor compartido

Empezó el 25 de noviembre de 2026. Aprobado por Josué el 26 de noviembre.
La forma del bloque y las reglas están en `_privado/PLANTILLA-FICHAS.md`.

## Por qué

- Las 94 fichas eran HTML plano; 80 escritas a mano, con su CSS copiado dentro.
- En 70 fichas la práctica («Ponte a Prueba») era el examen: 2,518 de sus
  preguntas estaban en el banco de su misión, palabra por palabra o casi. La
  rúbrica manda resolverla la víspera del examen, y las formas 1 a 30 salen
  solo de esas preguntas.
- Ninguna sonda comparaba la ficha con el examen.

## Decisiones (Josué, 26 de noviembre de 2026)

1. La ficha se arma en `_dev/`, no en el teléfono. La regla de la copia va en
   una sonda de `npm test`. No se toca `js/motor-misiones.js`.
2. El bloque `FICHA` va en `misiones/<carpeta>/js/ficha.js`, que el alumno no
   descarga.
3. El primer PR lleva el armador, la sonda con sus pendientes, el lector
   compartido, el CSS único, la plantilla, la ficha piloto (Los Tipos de
   Textos) y los datos dudosos del PR 53. El resto, en tandas de seis.
4. Los datos sin fuente se suavizan o se quitan. No se inventan fuentes. Las
   preguntas congeladas con clave impresa no se cambian: se anotan aquí.
5. Los trece datos que pide `js/motor-mision.js` se resuelven en el primer
   commit de la tanda 1 de Español, no aquí.

## Hecho después, en la tanda 1 de Español (26 de noviembre)

- La decisión 5: `js/motor-mision.js` ya no pide los trece datos (ver
  `_privado/PLAN-ESPANOL-PRIMER-PARCIAL.md`, «Hecho en la tanda 1»).
- `_dev/arma-ficha.js` arma en la memoria, sin escribir y sin pedir el QR, la
  ficha de una misión nacida (`enMemoria`). Con eso las dos sondas de fichas
  vigilan la práctica de N5 y N1 desde su bloque, antes de que la ficha esté
  impresa. El armador comprueba además que `qr` tenga la forma
  `qr-mision-<slug>.png`.
- Las fichas de N5 y N1 nacieron con bloque y sin copiar: 40 preguntas de
  práctica cada una, ninguna del examen.
- Tanda 2 de Español (26 de noviembre): las fichas de N4 y N3 nacieron igual,
  con bloque y sin copiar (40 preguntas de práctica cada una, que ensayan una
  por una las 40 del banco de las formas 1 a 30). Armadas en la memoria salen
  en 7 hojas; se vuelven a medir cuando tengan su QR.

## Hecho en el primer PR

- `_dev/lib-ficha.js`: el lector que estaba dentro de
  `verifica-examen-sin-pistas.js`, trasladado sin cambiar (la salida de esa
  sonda es idéntica antes y después), más la regla de la copia.
- `_dev/verifica-ficha-no-copia-examen.js` y `_dev/fichas-copia-pendientes.json`.
- `_dev/arma-ficha.js` y `_dev/fichas-motor/ficha.css`.
- Piloto: `misiones/2y3ciclo-tipos-de-textos/js/ficha.js`. Pasó de 40 copias a
  0. Las hojas 1, 3 y 6 de la ficha armada salen idénticas, píxel por píxel, a
  las de la ficha hecha a mano; la 2 cambia en dos frases (los datos dudosos);
  la 4 y la 5 son la práctica nueva.

## Cómo va la cuenta

`node _dev/verifica-ficha-no-copia-examen.js` la da al día. El 26 de noviembre
de 2026, después del piloto: 72 fichas leídas, 3 limpias, **69 pendientes con
2,478 preguntas copiadas**, y 12 que el lector no entiende (las 7 de
Inteligencia Artificial y las 5 de Filosofía, que tienen otra forma y casi no
copian: están nombradas en `sinLeer`).

## Tandas que siguen (seis fichas cada una, un PR por tanda)

Orden propuesto, por dónde pesa más:

1. Las otras cinco del PR 53 (Himno, Aspectos Cívicos, Héroes y Próceres,
   Mayas, Ecosistemas) y La Célula, que ya tiene su contenido separado.
2. Las demás con banco grande (Áreas Protegidas, Cinco Reinos, Desastres
   Naturales, Continentes América, Sistema Endocrino, Sistema Nervioso).
3. Español (Acentuación, Adjetivos, Adverbios, Marcadores, Pronombres,
   Sustantivos, Verbos, Adjetivo Avanzado).
4. Matemáticas, Ciencias Naturales y Sociales que faltan.
5. Programación y, al final, Robótica: sus ocho fichas tienen edición en
   inglés y cada pregunta nueva hay que traducirla.

Cada tanda: escribir el bloque leyendo, armar, medir las hojas, bajar las
pendientes, y que Josué lea las preguntas antes de fusionar.

Las seis fichas nuevas de Español del primer parcial nacen con bloque
(`_privado/PLAN-ESPANOL-PRIMER-PARCIAL.md`, tanda 4): ya no hace falta el
plan B de un armador aparte.

## Pendientes: datos dudosos que están en preguntas congeladas

No se cambiaron. Sus formas tienen clave impresa (`_dev/formas-oro/`): cambiar
el texto de la pregunta cambia hojas que los maestros ya tienen. Cada una
necesita una decisión de Josué y, si se cambia, volver a congelar la misión.

### Las tres que Josué nombró

| misión | pregunta congelada | qué tiene |
|---|---|---|
| Aspectos Cívicos | Completar `escudo-aljabas`: «En la parte de arriba del Escudo hay herramientas de minería y aljabas con ___.» | En qué parte del Escudo va cada cosa no está acreditado: en `_dev/leyes/` no hay decreto del Escudo. La misión ya no dice «arriba» en Aprende ni en el Laboratorio; la pregunta se sigue pudiendo contestar porque «aljabas con flechas» se enseña |
| Héroes y Próceres | Completar `valle-1777`: «José Cecilio del Valle nació en el año ___.» | Hay fuentes que dan 1780. **Dentro del repositorio sí está acreditado 1777**: `_dev/dcnb/dcnb-prebasica-2015-07-comunicacion-3de7.md:280` («Nació el 22 de Noviembre de 1777»). Se puede dar por cerrada si Josué acepta esa fuente |
| Los Tres Poderes | Selección: «¿Cuántos diputados integran el Congreso Nacional de Honduras?» (128) | El archivo de datos de la misión dice que ese número no se puede acreditar. Falta la Constitución en `_dev/leyes/` |

### Otras que aparecieron al suavizar (mismo motivo: están congeladas)

| misión | dónde | qué dice |
|---|---|---|
| Aspectos Cívicos | guía de `critCompareBank` | cuenta «el mapa» entre los símbolos menores |
| Aspectos Cívicos | guía de `critCauseBank` (`k: 'arbol'`) | «Honduras tiene el mayor bosque de pino de Centroamérica» |
| Mayas | guía crítica `cau-lago` | las chinampas como «islas flotantes» |
| Mayas | banco de antes | «la escritura más desarrollada de la América antigua», «el pueblo más numeroso», «el rey más famoso». Por eso tampoco se suavizaron en Aprende, Tarjetas ni en la ficha: el alumno estudiaría otra cosa que la que el examen le pide |
| Los Ecosistemas | banco de antes | «El medio físico de un ecosistema se llama ___» y «¿Qué forma el medio físico…?» pueden caer en la misma hoja (pasa en su Forma 40) |
| Aspectos Cívicos | banco nuevo y ficha | los años 1928, 1969 y 1993 y la rosa (1946 a 1969): usados sin fuente en el repositorio. Josué los aceptó en el PR 53 como los del cuestionario cívico |

### Vistos de paso, fuera de este trabajo

- `misiones/fin-de-grado-4to/js/fin-de-grado-4to.js`: «El Patuca es uno de los
  ríos más largos del país» (la ficha de Geografía de Honduras dice que el más
  largo es el Coco o Segovia; «uno de los más largos» no la contradice).
- La actividad Ordena de Los Tipos de Textos enseña cinco pasos (inicio, nudo,
  clímax, desenlace, final) y el DCNB nombra tres partes (exposición, nudo y
  desenlace). Ya no se contradice con la ficha, que dejó de llamar al nudo
  «el momento de mayor tensión»; el clímax sigue sin fuente en `_dev/`.
- Para hacer bien Aspectos Cívicos y Los Tres Poderes hacen falta el decreto
  de los símbolos patrios y la Constitución en `_dev/leyes/`.
