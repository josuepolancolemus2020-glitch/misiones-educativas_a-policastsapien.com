# Propuesta — Auditoría de la segunda prueba y evaluación del alumno rezagado

> Fecha: 23 de julio de 2026 · Auditoría multiagente sobre 42 misiones (división de decimales quedó como estándar de referencia, intocable).
> Regla respetada: la **evaluación conceptual estandarizada no se toca** en ninguna misión.
> Detalle completo por misión: [`_dev/AUDITORIA-EVALUACIONES-DETALLE.md`](_dev/AUDITORIA-EVALUACIONES-DETALLE.md).

---

## 1. Resultado global de la auditoría

| Prioridad | Misiones | Situación |
|---|---|---|
| 🔴 **Alta** | **13** | No tienen segunda prueba imprimible (o es inservible). Hay que **crearla**. |
| 🟡 **Media** | **15** | La segunda prueba existe y es buena, pero **incumple la normativa impresa** o tiene vacíos de contenido puntuales. |
| 🟢 **Baja** | **14** | Casi al nivel del estándar; solo ajustes menores de normativa. |

Hallazgo transversal clave: en las 13 misiones sin segunda prueba, **el andamiaje ya está previsto en el código** (`_formaSelInit` comprueba `genEvalOp`/`genEvalCrit` que nunca se implementaron). Es decir: crear la prueba es "enchufar" el generador, no rehacer la misión.

### 🔴 Prioridad ALTA — crear la segunda prueba (13 misiones)

Cada una ya tiene diseño concreto de 5 secciones (100 pts) ligado a su contenido real, en el anexo:

| Misión | Materia | Tipo de prueba a crear |
|---|---|---|
| angulo-bisectriz | Matemáticas | **Operativa** (clasificar, bisectriz, complemento/suplemento, problemas, olimpiada) |
| area-circulo-y-poligonos | Matemáticas | **Operativa** (A=π·r², P·a/2, sectores, inverso, detective del error) |
| sustantivos | Español | **Pensamiento Crítico** (mayúsculas, tabla de análisis, fábrica de palabras, intruso, producción) |
| adjetivos | Español | **Pensamiento Crítico** (concordancia, grados, análisis de texto, juicio, monstruo descriptivo) |
| adverbios | Español | **Pensamiento Crítico** (adjetivo vs adverbio, -mente, detective del error, texto, producción) |
| pronombres | Español | **Pensamiento Crítico** (pronombre vs determinante, reescritura, enclíticos, voseo, detective) |
| verbos | Español | **Pensamiento Crítico** (raíz/desinencia, tiempo y modo, concordancia, transformación, argumentación) |
| bach-uni-adjetivos | Español avanzado | **Pensamiento Crítico NGLE** (sintaxis, gramaticalidad, posición, matriz, miniensayo) |
| eras-geologicas | CC.NN. | **Pensamiento Crítico** (causa-consecuencia, cronología, detective de fósiles, error, argumentación) |
| areas-protegidas-de-honduras | CC.NN. | **Pensamiento Crítico** (causa ecológica, casos, datos y mapa, clasificar y justificar, postura) |
| geografia-coordenadas | CC.SS. | **Pensamiento Crítico** (planisferio, hemisferios/zonas, husos horarios, casos HN, antípodas) |
| continentes-Europa-Asia-África | CC.SS. | **Pensamiento Crítico** (comparar, interpretar datos, causa-consecuencia, Honduras y el mundo, detective) |
| continentes-América-Oceanía-Antártida | CC.SS. | **Pensamiento Crítico** (comparar, interpretar, analizar y justificar, casos HN, detective geográfico) |

Convención de semillas para no colisionar entre pruebas: conceptual = `forma` · operativa = `100000+forma` · pensamiento crítico = `200000+forma`.

### 🟡 Prioridad MEDIA — el mismo defecto se repite (15 misiones)

Las 10 operativas de matemáticas (1ciclo-segundo-grado, ángulos-básicos, área-polígonos, multiplicación-vertical, múltiplos-divisores, teoría-números, valor-posicional, fracciones, números-decimales, acentuación…) comparten **exactamente los incumplimientos que ya se corrigieron en división-decimales** (commit `d852267`):

1. El encabezado impreso no tiene el campo **"Parcial"**.
2. Dice **"Institución"** en vez de "Centro Educativo".
3. Falta el **pie normativo** completo: "Nº de Evaluación temática realizada" + casillas ☐ con valor en el parcial / ☐ solo de repaso.
4. Varias no tienen el ajuste automático `fit()` a página carta (riesgo de desbordar a 2 hojas).

Vacíos de contenido puntuales (detalle en el anexo): 1ciclo no evalúa comparación de números (corazón del tema); múltiplos-divisores tiene 3 secciones genéricas que no nacen del tema; algunas de pensamiento crítico califican por autoevaluación con casillas en vez de clave verificable.

### 🟢 Prioridad BAJA (14 misiones)

Segunda prueba existente, específica del contenido y bien construida (célula, sistema nervioso, endocrino, desastres, Mayas, tipos de textos, etc.). Solo arrastran los mismos detalles de normativa del grupo medio (Parcial / Centro Educativo / pie con casillas).

---

## 2. Propuesta: evaluación del alumno rezagado — la **Forma R (de Apoyo)**

Los 3 enfoques (pedagógico, plataforma e instrumentos) convergieron en el mismo principio rector:

> **Misma competencia, mismo valor (100 pts, cuenta en el parcial), distinta vía.** Se adapta el formato, el volumen y el canal; **nunca** se rebaja el contenido nuclear. Es una *adecuación curricular no significativa*, permitida por el marco del DCNB.

### 2.1 La Forma R: tercera variante imprimible de cada prueba

- **Menos ítems, más puntos por ítem** (≈13 en vez de 20-23), solo niveles básico e intermedio; se eliminan los retos de olimpiada y la sección de mayor carga lectora.
- **Apoyos impresos**: un ejemplo resuelto 🧭 al inicio de cada sección (no vale puntos), banco de palabras en Completar, cuadrícula de cálculo para alinear el punto decimal, tabla Datos → Operación → Respuesta en los problemas, enunciados de ≤2 líneas con palabras clave en negrita.
- **Letra 13pt, un ítem por renglón, una columna** — el `fit()` existente agranda automáticamente la letra al haber menos ítems: la accesibilidad sale gratis.
- **Administración flexible documentada**: lectura en voz alta por el docente, tiempo hasta doble o en dos sesiones, tabla de multiplicar permitida cuando la competencia es el algoritmo (no las tablas), ortografía no penalizada.
- **Qué NO cambia**: las competencias por sección, el total 100, el umbral 70 y los +8 XP, las 30 formas deterministas (semillas reservadas: conceptual-R = `300000+forma`, operativa/crítico-R = `400000+forma`), y la normativa de impresión (1 página + 1 pauta letra grande).
- **Antiestigma**: la hoja se ve idéntica a la de los compañeros a un metro; la única marca es la etiqueta pequeña del pie **"Forma R-N"**. El docente la activa con una casilla discreta "♿ Forma R" junto al selector de forma.
- **Trazabilidad**: la pauta agrega el bloque exclusivo del docente "Apoyos aplicados: ☐ lectura en voz alta ☐ tiempo extendido ☐ tabla de multiplicar ☐ dos sesiones" + observaciones — la adecuación queda documentada ante padres y dirección. En la nube la forma viaja como `100+N` (cabe en la columna `forma INT` sin tocar SQL); el panel docente la muestra como "R-N".
- **Criterio de salida (puente, no etiqueta)**: dos evaluaciones consecutivas con ≥70 en Forma R → el alumno vuelve a la forma estándar, con la ficha didáctica como refuerzo.

### 2.2 Tres instrumentos complementarios (cuando el papel no basta)

El docente elige **uno** por alumno y lo anota en el pie como "Evaluación adecuada":

- **B. Evaluación oral guiada con lista de cotejo** — para dificultad severa de lectoescritura. 10 indicadores × 10 pts (los mismos de las secciones de la prueba estándar, demostrados hablando o con material concreto: tapitas, billetes de lempira de papel). Escala: solo = 10 · con una ayuda = 5 · no lo logra = 0. Dura 10-15 min individuales.
- **C. Rúbrica de desempeño observado en la misión interactiva** — para quien rinde mejor "haciendo": sesión de 30-40 min en tablet/teléfono recorriendo la misión, 5 criterios × 20 pts, anclada a la nota de `Calificar prueba` en pantalla como evidencia objetiva.
- **D. Portafolio de evidencias del parcial** — para ausentismo (cosecha, distancia, salud): 5 evidencias fechadas × 20 pts (ficha didáctica resuelta, 2 tandas del Generador de Tareas, "Explica con tus palabras", un problema inventado por el alumno con datos de su casa, y una Forma R sin límite de tiempo). Se acuerda al inicio del parcial, con portada firmada por docente y familia.

### 2.3 Cómo empezar (sin escribir una línea de código)

El docente puede aplicarlo **mañana**: imprime la forma estándar, resalta solo los 2-3 primeros ítems de cada sección (la progresión básico→desafío ya está declarada), lee en voz alta los problemas, recalifica proporcional y anota "FA" junto a la Forma N del pie. Los instrumentos B, C y D se copian a mano de este documento.

---

## 3. Plan de trabajo propuesto (por tandas, con commit por checkpoint)

| Tanda | Contenido | Alcance |
|---|---|---|
| **0. Piloto Forma R** | Implementar Forma R (conceptual + operativa) en división-decimales, la misión estándar | 1 misión |
| **1. Normativa impresa** | Replicar el arreglo de `d852267` (Parcial, Centro Educativo, pie con casillas, `fit()`) en las ~24 misiones media/baja que lo incumplen | cambio pequeño y repetitivo |
| **2. Crear segunda prueba — Matemáticas y Ciencias** | angulo-bisectriz, area-circulo-poligonos (operativas) + eras-geologicas, areas-protegidas (crítico) | 4 misiones |
| **3. Crear segunda prueba — Español** | sustantivos, adjetivos, adverbios, pronombres, verbos, bach-uni-adjetivos | 6 misiones |
| **4. Crear segunda prueba — Sociales** | geografia-coordenadas, continentes ×2 | 3 misiones |
| **5. Vacíos de contenido del grupo medio** | comparación en 1ciclo, secciones genéricas de múltiplos-divisores, claves verificables donde hay autoevaluación | puntual |
| **6. Generalizar Forma R** | Extenderla a las demás misiones + PLANTILLA-MISIONES.md + MANUAL-MAESTRO.md | por tandas |

Cada prueba nueva nace del diseño ya detallado en el anexo (secciones, valores, ítems ligados al contenido real de cada misión), hereda la máquina de 30 formas deterministas existente y cumple la normativa impresa completa desde el primer día.
