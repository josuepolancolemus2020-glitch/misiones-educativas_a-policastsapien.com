# Qué falta de Matemáticas para cubrir el año (II y III ciclo)

Revisión hecha el **22 de agosto de 2026**, contra el DCNB y contra el
catálogo de ese día: **61 misiones publicadas, de ellas 15 de Matemáticas**
(y siguen entrando; el número de aquí es una foto, no una meta).

**De dónde sale cada afirmación:**

- el catálogo, de `js/data/misiones.js`;
- **en qué mes toca cada contenido**, de `js/data/dcnb-map.js`, que ya está
  verificado mes a mes contra las Programaciones Educativas Nacionales;
- los contenidos, de `_dev/dcnb/` (Markdown de trabajo) y **confirmados en el
  PDF**, que es el que acredita: `_dev/dcnb-pdf/dcneb-basica-ii-ciclo.pdf`
  (4º págs. 373–382, 5º 383–388, 6º **389–393**) y
  `dcneb-basica-iii-ciclo.pdf` (7º 427–444, 8º 445–455, 9º 456–476).

---

## 1. Lo primero que se ve: los meses en blanco

Cruzando `DCNB_MAP` con el catálogo, el año escolar de un maestro de
Matemáticas queda así:

| grado | meses con misión | **meses sin ninguna misión** |
|---|---|---|
| 4º | feb–ago | **sep, oct, nov** |
| 5º | feb–oct | **nov** |
| **6º** | **feb–jul** | **ago, sep, oct, nov** |
| 7º | feb–may, sep, oct | **jun, jul, ago, nov** |
| 8º | — | **el año entero** |
| 9º | — | **el año entero** |

El hueco de 6º es el que más cuesta: son **los cuatro últimos meses**, y
justo antes de la Prueba de Fin de Grado que la Secretaría aplica al
terminar el año. El maestro que llega a agosto con su 6º no tiene ni una
misión de Matemáticas que asignar hasta que acabe el curso.

---

## 2. Sexto grado, bloque por bloque

Lo que el DCNB manda en 6º (págs. 389–393) contra lo que hay hoy:

### Bloque 1 — Números y operaciones

| contenido del DCNB | hoy | falta |
|---|---|---|
| Divisibilidad, M.C.D., m.c.m. | Teoría de Números (#26) | — |
| Adición y sustracción de fracciones **de distinto denominador** | Las Fracciones (#23) | — |
| **Multiplicación y división de fracciones** (por natural, entre dos, mixtas, tres factores, propiedades) | — | **misión entera** |
| Conversión decimal ↔ fracción hasta milésimos | Números Decimales (#8), de pasada | ampliar |
| **Multiplicación de números decimales** | una tarjeta suelta en #8 | **misión entera** |
| División de números decimales | División de Decimales (#15) | — |
| **Sistema de numeración de los mayas** (símbolos 0–20, valor posicional base 20, sumar y restar) | — | **misión entera** |

### Bloque 2 — Geometría

| contenido del DCNB | hoy | falta |
|---|---|---|
| Bisectriz de un ángulo | Ángulos y Bisectriz (#7) | — |
| **Sólidos geométricos**: prismas, pirámides, conos, cilindros y esferas; construirlos con patrones; representarlos en el plano | — | **el bloque entero** |

### Bloque 3 — Medidas

| contenido del DCNB | hoy | falta |
|---|---|---|
| **El calendario de los mayas** (kin, uinal, tun, katún; tzolkín y haab) | — | **misión entera** |
| Área del círculo y de polígonos regulares | #16 y #32 | — |
| **Volumen**: concepto, unidades oficiales (km³…mm³) y fórmulas de cubos, prismas y cilindros | — | **misión entera** |

### Las misiones que faltan en 6º

1. **Multiplicación y División de Fracciones** — Ruta del Número.
   Es la más urgente y por dos razones. La primera: `dcnb-map.js` ya le
   asigna a *Las Fracciones* (#23) los meses **may, jun y jul de 6º** con la
   nota «suma/mult/div», pero **la misión llega hasta la resta**: el maestro
   que la abre en junio buscando la multiplicación no la encuentra, y el
   mapa le prometió que estaba. La segunda: la Prueba de Fin de Grado de 6º
   la pide expresamente («sumar, restar, multiplicar y dividir fracciones»,
   `_dev/fin-de-grado/6to/contenido.json`).
2. **Multiplicación de Decimales** — Ruta del Número. Hoy existe la
   división (#15) y no la multiplicación, que es la que va antes.
3. **Sólidos Geométricos** — Ruta de la Forma. Cubre el Bloque 2 completo
   de 6º, que hoy no tiene nada más que la bisectriz.
4. **Volumen: cubos, prismas y cilindros** — Ruta de la Forma, pegada a la
   anterior. Se pueden juntar en una sola misión, pero el DCNB las trae en
   bloques distintos y separadas rinden dos etapas de ruta.
5. **Numeración y Calendario Mayas** — Ruta del Número. Los dos temas mayas
   del DCNB de 6º en una sola misión, porque el calendario **es** el sistema
   de base 20 aplicado al tiempo. Ojo: la misión de Sociales *Los Mayas y
   las Culturas Precolombinas* (#43) **no** cubre la numeración vigesimal;
   se revisó y no la menciona.

Las tres últimas caben justo en el hueco de agosto a noviembre.

### Un aviso sobre el promedio

**El DCNB de 6º no tiene Bloque 4 de Estadística.** No es un fallo de la
conversión: se comprobó en el PDF y 6º termina en el Bloque 3 de Medidas
(pág. 393), mientras que 4º, 5º, 7º, 8º y 9º sí traen su bloque de
estadística. Pero **la Prueba de Fin de Grado sí pregunta el promedio**. Así
que la misión de datos que se proponga más abajo se justifica por la prueba
y por los otros cinco grados, no por el bloque de 6º — y conviene escribirlo
así para no citar mal el currículo.

Lo mismo pasa con dos temas que la prueba de 6º incluye y el DCNB de 6º no:
**velocidad, tiempo y distancia** y la **simetría reflexiva** (que en el
DCNB está en 3º grado, I ciclo).

---

## 3. Antes de 6º: lo que falta en 4º y 5º

**Cuarto grado** (págs. 373–382) — es donde están los meses de sep, oct y nov
vacíos:

- **División de números naturales**, todos los casos del DCNB (MCDU ÷ U,
  DM MCDU ÷ U, DU ÷ DU, CDU ÷ DU, MCDU ÷ DU). Hay *Multiplicación Vertical*
  (#30) y no hay su pareja. Es el hueco más grande de 4º.
- **Medidas: longitud, peso, capacidad y tiempo** — el Bloque 3 entero de
  4º, sin una sola misión. Incluye el reloj y el calendario, y las monedas
  centroamericanas con sus equivalencias.
- **Clasificación de triángulos** (equiángulos, acutángulos, rectángulos,
  obtusángulos) — Bloque 2.
- **Coordenadas cartesianas** — Bloque 2. Existe *Geografía y Coordenadas*
  (#11), pero es de Sociales y trabaja latitud y longitud, no el plano.

**Quinto grado** (págs. 383–388):

- **Área de rombo, romboide y trapecio**, más el concepto de área y sus
  unidades oficiales — Bloque 3. `dcnb-map.js` le da a *Perímetro y Área de
  Cuadriláteros* (#31) el mes de agosto de 5º con la nota
  «(rombo/trapecio)», pero **la misión solo trabaja cuadrado y rectángulo**:
  el rombo, el romboide y el trapecio no aparecen. O se amplía #31 o entra
  una misión nueva; hoy el mapa promete de más, igual que con las fracciones.
- **Círculo y circunferencia: elementos, construcción y perímetro** —
  Bloque 2. *Área de Círculos y Polígonos* (#16) va al área y no habla de
  circunferencia.
- **Perímetro y construcción de polígonos** regulares e irregulares —
  Bloque 2, parcialmente cubierto por #32 (que va al área).

**Y una que sirve a cinco grados a la vez:**

- **Datos, Gráficas y Promedio** — el Bloque 4 que traen 4º (gráficas de
  barras), 5º (gráficas lineales y eventos probables), 7º (circulares y de
  faja) y, en su forma dura, 8º y 9º. Con esta misma misión se cubre el
  promedio que pide la Prueba de Fin de Grado de 6º. Una misión, cinco
  grados: es la de mejor rendimiento de toda esta lista.

---

## 4. Tercer ciclo: 7º, 8º y 9º

Aquí no hay huecos, hay ausencia. **8º y 9º no tienen ni una misión de
Matemáticas en todo el año**, y las que el mapa asigna a 7º son misiones de
II ciclo que ese grado retoma.

**Séptimo** (págs. 427–444) — cuatro meses en blanco (jun–ago y nov):

- Números enteros: opuestos, valor absoluto, las cuatro operaciones,
  potencias y operaciones combinadas.
- Números racionales con signo.
- **Razón, proporción y tanto por ciento** (la regla de tres).
- Álgebra: variable, expresión algebraica, término, términos semejantes.
- **Ecuaciones lineales de una variable.**
- Geometría: punto, línea y plano; perpendiculares y mediatriz con regla y
  compás; paralelas cortadas por una transversal. Solo la bisectriz está
  cubierta, por #7.
- Estadística: gráficas circulares y de faja; eventos probables.

**Octavo** (págs. 445–455) — el año entero:

- Tanto por ciento mayor que 100 y menor que 1.
- Raíces cuadradas y cúbicas, irracionales, números reales, intervalos.
  *Potencias y Raíces* (#25) cubre una parte.
- **Notación científica.**
- **Polinomios**: tipos, operaciones y **productos notables**.
- **Factorización.**
- Expresiones racionales algebraicas.
- Triángulos: suma de ángulos, bisectriz/mediana/mediatriz/altura,
  congruencia y semejanza.
- **Teorema de Pitágoras.**
- Cuadriláteros: propiedades y construcción.
- Tablas y polígonos de frecuencia, datos agrupados, histogramas.

**Noveno** (págs. 456–476) — el año entero:

- **Tanto por ciento aplicado**: aumento y descuento, precio de venta,
  comisión, impuesto sobre la venta, **interés simple y compuesto**. Es el
  contenido más útil fuera del aula de todo el ciclo.
- **Ecuación cuadrática**: completando el cuadrado y con la fórmula.
- La recta en el plano: y = mx + b, punto-pendiente, graficarla.
- **Sistemas de dos ecuaciones lineales** (gráfico y algebraico).
- Inecuaciones lineales y cuadráticas.
- Polígonos regulares: apotema, ángulo central, área.
- Círculo: elementos, tangentes, circunferencia que pasa por tres puntos.
- **Áreas laterales y volúmenes** de poliedros, cilindros y esferas — se
  apoya en la misión de Volumen de 6º.
- Probabilidad y medidas de tendencia central y de dispersión.

---

## 5. El orden que yo seguiría

Primero lo que tapa un mes vacío de un maestro que ya usa la plataforma, y
dentro de eso, lo que sirve a más grados:

| # | misión | tapa | grados |
|---|---|---|---|
| 1 | Multiplicación y División de Fracciones | may–jul de 6º (hoy el mapa promete de más) | 6º, 7º |
| 2 | Datos, Gráficas y Promedio | sep–nov de 4º, nov de 5º, el promedio de la prueba de 6º | 4º, 5º, 6º, 7º |
| 3 | Sólidos Geométricos | ago–nov de 6º | 6º, 4º, 5º, 9º |
| 4 | Volumen: cubos, prismas y cilindros | ago–nov de 6º | 6º, 9º |
| 5 | Numeración y Calendario Mayas | ago–nov de 6º | 6º |
| 6 | División de Números Naturales | sep–nov de 4º | 4º |
| 7 | Multiplicación de Decimales | abr de 6º | 4º, 5º, 6º |
| 8 | Medidas: longitud, peso, capacidad y tiempo | Bloque 3 de 4º | 4º, 5º |
| 9 | Razón, Proporción y Porcentaje | jun–ago de 7º | 7º, 8º, 9º |
| 10 | Números Enteros | 7º | 7º |
| 11 | Ecuaciones Lineales de una Variable | 7º | 7º, 8º, 9º |
| 12 | Teorema de Pitágoras | 8º | 8º, 9º |

De la 13 en adelante, el resto de 8º y 9º de la lista de arriba: polinomios
y productos notables, factorización, la recta en el plano, la ecuación
cuadrática, y el porcentaje aplicado al dinero (interés, impuesto,
descuento).

**Dos cosas se pueden arreglar sin escribir una misión nueva**, y valen lo
mismo que una:

- ampliar *Las Fracciones* (#23) con la multiplicación y la división, o
  dejar de prometerlas en el comentario de `dcnb-map.js`;
- ampliar *Perímetro y Área de Cuadriláteros* (#31) con el rombo, el
  romboide y el trapecio, que es lo que el mapa ya dice que trae.
