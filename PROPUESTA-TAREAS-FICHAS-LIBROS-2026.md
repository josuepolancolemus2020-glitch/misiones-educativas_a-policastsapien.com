# La lógica de las tareas, la iconografía de las fichas y el camino hacia libros de texto por grado

**Auditoría y propuesta pedagógica, iconográfica y editorial para M.E.T.A.S**

*Preparado para la Familia Polanco-Castellanos · Proyecto Educativo M.E.T.A.S · 29 de julio de 2026 · Solo propuestas: no se modificó ningún archivo del proyecto*

---

## Cómo se hizo este reporte

Nueve agentes trabajaron en tres fases. **Fase 1 (auditoría):** cuatro agentes leyeron el Generador de Tareas de las 57 misiones —agrupadas en matemáticas, español/sociales, naturales y programación/robótica— comparando lo que cada tipo de tarea *produce* contra los objetivos declarados en la ficha de esa misión; un quinto agente diseccionó las 57 fichas didácticas (estructura, «Ponte a Prueba», el texto exacto de la rúbrica en todas); un sexto investigó en la web la evidencia pedagógica (18 búsquedas: pictogramas editoriales SEP/ESMATE, codificación dual, práctica de recuperación, rúbricas para primaria, estructura editorial de libros de texto, ISBN hondureño). **Fase 2 (diseño):** un agente con perfil de **pedagogo–neuroeducador–didacta editorial** diseñó el algoritmo de tareas, el sistema iconográfico y la rúbrica; en paralelo, un arquitecto editorial diseñó la base fichas→libros por grado. **Fase 3 (crítica):** un agente de control de calidad buscó contradicciones entre las propuestas y contra las restricciones reales del proyecto (familia sin equipo de ingenieros, impresión carta en blanco y negro, offline-first). **Las contradicciones que encontró son reales y este reporte las presenta ya resueltas**; la sección 8 las documenta con transparencia.

Una precisión de conteo que la auditoría corrigió: son **57 fichas** (`ficha-*.html`), no 59 — los otros dos archivos de `fichas/` son `index.html` y el mapa curricular.

---

## 1. Resumen ejecutivo

1. **Tu intuición es correcta y ahora está demostrada misión por misión.** El Generador de Tareas usa una plantilla única de 4 tipos (Identificar / Clasificar / Completar / Explicar) clonada en la mayoría de misiones: el tipo de tarea no lo decide el objetivo de la misión, lo decide la plantilla. Resultado de la auditoría de las 57: **24 misiones con alineación alta, 28 media y 5 baja** (apéndice A con el veredicto de cada una).

2. **La mejor noticia: el modelo a imitar ya vive en el propio proyecto.** Las misiones con generador *a medida* (múltiplos-divisores, recta numérica, multiplicación vertical, y el cuarteto ejecutar-producir-analizar-depurar de las 7 misiones de la Ruta del Código) son exactamente el «algoritmo preciso» que buscas: datos aleatorios + respuesta calculada con procedimiento + instrucción con truco. Y en casi todas las misiones débiles, **el motor algorítmico que el Generador necesita ya existe ~300 líneas más abajo, en la sección de Evaluación del mismo archivo** (`genPotenciaItems`, `genMcmItems`, `genOpItems`, `_tgPoli`…): la reforma es *reconectar*, no programar desde cero.

3. **Los 5 defectos transversales detectados:** (a) el tipo «Identificar» es **circular/tautológico** en misiones de contenido — la respuesta está impresa en la propia oración («La mitocondria produce ATP…» → *Mitocondria*); (b) la **cantidad prometida es ficticia** — el selector ofrece 15 tareas pero los bancos tienen 5–10 ítems: unas veces entrega menos en silencio (`Math.min`) y otras repite ítems idénticos (`pool[i % len]`); (c) **falta justo el tipo de tarea que el objetivo exige** (mapa mudo en geografía, rotular esquema en biología, ordenar/secuenciar, escribir código en la misión de síntesis, calcular en potencias/teoría de números); (d) **datos incoherentes** (polígonos con lado 2 y apotema 9, imposibles; pautas sin simplificar como 1/3+1/6=3/6); (e) **problemas «de la vida real» predecibles** (la operación alterna par/impar: el alumno acierta por posición sin decidir).

4. **El algoritmo propuesto cabe en una frase: «el verbo del objetivo manda».** Se etiqueta cada objetivo por su verbo (conceptual: *reconocer/nombrar* · procedimental: *calcular/ordenar/rotular/ubicar/escribir código* · aplicación: *explicar/comparar/producir*), y una tabla de decisión por materia dicta qué tipos de tarea sirven a cada clase. Regla madre: **el tipo dominante de tarea = la clase dominante de objetivos**. Secuencia fija por hoja: calentamiento conceptual (2–3 ítems) → bloque procedimental (el corazón) → cierre de aplicación (1–2 retos). Cantidad honesta: nunca prometer más tareas de las que el motor entrega *distintas*. Cada tarea nace etiquetada 🏠 casa o 🏫 aula.

5. **La iconografía pedida existe como sistema completo de 6 iconos**, con evidencia editorial (SEP/ESMATE usan 4–8 pictogramas fijos con leyenda inicial) y neuroeducativa (codificación dual, señalización de Mayer): **🏠 En casa · 🏫 En el aula · 📅 La víspera (un día antes del examen) · 📝 El examen · ✏️ En tu cuaderno · 👁 Revisa con la pauta**. Hoy «un día antes del examen» aparece UNA sola vez por ficha, escondido en una celda de tabla de 9.5 pt en la página 6: la propuesta lo convierte en una **banda «🧭 Mi ruta de estudio» en la página 1** (①🏠→②🏫→③📅→④📝) que anuncia el flujo *antes* de empezar, más el icono 📅 anclado al título de «Ponte a Prueba». Todo icono va siempre con su palabra, en el margen izquierdo, probado en fotocopia B/N.

6. **La rúbrica final se rediseña como «Mi Ruta de Estudio»**: mismas 4 filas y el mismo promedio (compatible con la práctica SEDUC), pero en orden cronológico real, en primera persona y presente («Copié…», «Practiqué…»), con autoevaluación de 3 niveles (casillas ☐ Lo logré / ☐ Casi / ☐ A repasar — trazo simple, seguro en B/N), la columna del docente separada, la aritmética de «Ponte a Prueba» explicada (400 pts brutos → promedio /100), y el criterio en positivo («Gano mis 100 puntos cuando…») en vez de la amenaza «perderá puntos». Variante simplificada para I ciclo con estrellas en lugar de porcentaje.

7. **«Ponte a Prueba» la víspera del examen tiene respaldo científico sólido** (efecto del examen práctico / *testing effect*, Roediger & Karpicke 2006; replicado en primaria real en 2025): es el último ciclo de práctica de recuperación con corrección inmediata. La secuencia completa que la rúbrica ya contenía sin nombrarla (copiar en casa → practicar en aula → ponerse a prueba la víspera → examen) es *successive relearning* de manual; la propuesta solo la hace visible y deliberada.

8. **Las fichas ya son casi un libro.** Las 57 tienen exactamente 7 páginas carta «armadas a mano» (verificado por barrido), encabezado estructurado (Asignatura/Nivel/Tema), pie con «Página N» y pauta del docente en hoja suelta. Eso permite un camino editorial inusualmente barato: un compilador Node **sin dependencias** que corta por las anclas `<!-- PÁGINA N -->`, calcula folios por aritmética (sin motor de paginación), genera índice real y produce el PDF con Chrome — las mismas herramientas que la familia ya usa. Falta un solo eslabón: la **tabla puente ficha↔misión** (`FICHAS_MAP`, 57 entradas) y sembrar `data-mision-id`/`data-materia` en cada ficha; el grado NO se imprime en la ficha (se respeta la política anti-sesgo): el compilador lo resuelve contra `dcnb-map.js`.

9. **Libro piloto recomendado: 5º grado** (el más denso del mapa curricular: 31 lecciones — 9 Matemáticas, 7 Español, 11 CCNN, 4 CCSS ≈ 200 páginas), como tomo integrado con bloques por materia y unidades = parciales del año hondureño, más un **Libro del Docente** separado que concentra las páginas 7 (pautas), la dosificación por grado y la guía de la rúbrica. **La edición blanco y negro se diseña primero** (tramas por materia, no solo color): la fotocopiadora será la imprenta real. Tecnología/Robótica (13 fichas) e Inglés van en un volumen aparte por ciclo; los tomos de 1º–3º no se compilan, se *producen* (hoy I ciclo tiene 1 misión y 0 fichas) con una variante de plantilla para lectores incipientes.

10. **Orden de ejecución sugerido** (sección 9): primero pilotar rúbrica+iconos en UNA ficha y medir que la página 6 no desborde; luego reconectar generadores por tandas empezando por las 5 misiones de alineación baja (una constante `TG_MENU` por misión define su menú de tareas — sin backend); en paralelo, `FICHAS_MAP` + `data-*` + validador; y solo después, el compilador y el piloto de 5º.

---

## 2. Auditoría: la lógica de las tareas en las 57 misiones

### 2.1 El diagnóstico general: dos generaciones de generadores

La auditoría confirmó que en el proyecto conviven **dos generaciones** de Generador de Tareas:

| Generación | Cómo funciona | Misiones | Alineación |
|---|---|---|---|
| **A medida (algorítmica)** | Datos aleatorios → respuesta calculada con procedimiento → instrucción con truco. Variedad casi infinita. | 7 de matemáticas (múltiplos-divisores, recta numérica, multiplicación vertical, ángulos, perímetro, áreas de polígonos, números grandes) + 7 de la Ruta del Código (bucles, mi-primer-programa, robot-mensajero, robot-decide, variables-cajitas, detective-bugs, pensamiento-computacional) | **Alta** en las 14 |
| **Plantilla estándar** | 4 tipos fijos (🔍 Identificar / 🗂️ Clasificar / ✏️ Completar / 💡 Explicar) sobre bancos fijos de 5–10 ítems, clonados con distinto contenido | Las otras ~43 (toda CCNN, casi toda CCSS y español de contenido, robótica-hardware, y 7 de matemáticas) | Media o baja |

El contenido de los bancos casi siempre está bien adaptado al tema (las tablas de Clasificar llevan cabeceras a medida; los contextos hondureños —café, milpa, vado del río, baleadas— son excelentes). **El problema no es de contenido: es de lógica.** El tipo de tarea lo impone la plantilla, no el objetivo.

### 2.2 Los cinco defectos transversales

1. **«Identificar» circular.** En las misiones de contenido, la oración-estímulo contiene su propia respuesta: «Copán fue la gran ciudad maya…» → *Copán*; «El volumen es el lugar que ocupa un cuerpo» → *el volumen*. No hay identificación real: es copiar la palabra clave. Demanda cognitiva casi nula y banco memorizable tras un solo uso. En cambio, en las misiones de **gramática** el mismo tipo funciona bien porque opera sobre oraciones de uso real («subraya los adjetivos en…») — la distinción es exactamente la que el algoritmo propuesto formaliza.

2. **Cantidad ficticia.** El selector ofrece 5/8/10/15 tareas, pero: `identify`/`classify` recortan en silencio al tamaño del banco (elegir «15» entrega 10, o **5** en geografía de Honduras y mayas), mientras `complete`/`explain` rellenan **repitiendo ítems idénticos** en la misma hoja (`pool[i % len]`: un banco de Explicar de 3 preguntas imprime cada una 3–4 veces al pedir 10). El niño cree que generó 15 tareas distintas y no es cierto.

3. **Falta el tipo que el objetivo exige.** Objetivos que dicen «calcular potencias» servidos solo con vocabulario (potencias-raíces, teoría de números, área del círculo); «identificar partes/órganos» —que en el DCNB significa **rotular un esquema**— servidos con texto, nunca con un diagrama mudo (las 6 misiones de cuerpo humano ya tienen laboratorios SVG que el generador ignora); «ubicar/localizar» sin una sola tarea de **mapa** (continentes ×2, geografía de Honduras, coordenadas, mayas); «ordenar/secuenciar» sin ningún tipo que ordene nada (eras geológicas, etapas de la digestión, desarrollo humano, fases de la Luna); y la anomalía mayor: **programando-robot**, la misión de *síntesis* de la Ruta del Código, quedó con el esqueleto declarativo cuando sus hermanas ya tienen los motores exactos que necesita (escribir programa, trazar, cazar el bug).

4. **Datos incoherentes.** El generador de polígonos produce figuras geométricamente imposibles (lado 2 con apotema 9, porque ambos valores se generan por separado); la pauta de fracciones muestra respuestas sin simplificar (1/3+1/6=3/6). El «algoritmo preciso» que pides exige también **coherencia de datos**, no solo variedad.

5. **Problemas predecibles.** En los problemas «de la vida real», la operación correcta alterna en orden fijo (par/impar): el alumno puede acertar por posición sin decidir qué operación aplicar — que es justamente el objetivo declarado.

### 2.3 Lo que ya se hace bien (y debe normarse en la plantilla)

La auditoría también encontró prácticas ejemplares que conviene elevar a norma de `PLANTILLA-MISIONES.md`: el bloque de instrucción con fórmula/truco por tipo de tarea; la respuesta oculta tras «👁 Respuestas» **con procedimiento completo** (productos parciales, prueba de la resta, pasos del área), no solo el resultado; los pools de números didácticamente ricos; el tipo extra «🧠 Pensamiento matemático» (existe en 11 de 14 misiones de matemáticas); el cuarteto de programación **ejecutar-predecir → producir → analizar/trazar → depurar**; las tareas comunicativas de inglés-saludos (diálogos con registro formal/informal); y el carácter «cuaderno-céntrico» de todas las tareas («copia/resuelve en tu cuaderno»), que encaja con la rúbrica de las fichas y con el offline-first — lo único que le falta es la etiqueta 🏠/🏫.

---

## 3. El algoritmo de tareas: «El verbo manda»

### 3.1 Taxonomía simple de objetivos (3 clases)

Se lee el **verbo** con que empieza cada objetivo de la ficha y se etiqueta:

| Clase | «En llano» | Verbos típicos | Nivel cognitivo |
|---|---|---|---|
| **1. Conceptual** | Saber QUÉ es | reconocer, nombrar, definir, distinguir | Recordar/comprender |
| **2. Procedimental** | Saber HACERLO paso a paso | calcular, resolver, ordenar, rotular, construir, transformar, conjugar, localizar/ubicar, escribir/depurar código, medir/dibujar | Aplicar — **el corazón de casi todas las misiones y el peor servido hoy** |
| **3. Aplicación** | Saber USARLO y explicar POR QUÉ | explicar, comparar, argumentar, decidir, producir (párrafo, diálogo, proyecto) | Analizar/evaluar/crear |

**Regla madre (alineación constructiva de Biggs):** el tipo de tarea DOMINANTE de la misión debe coincidir con la clase dominante de sus objetivos. Una misión cuyos objetivos dicen «calcular» cinco de seis veces no puede tener un generador cuyo tipo dominante sea «identificar vocabulario» — el defecto exacto de potencias-raíces, teoría de números y área del círculo.

### 3.2 Tabla de decisión objetivo→tarea, por materia

*Notación: [E] = tipo existente que se conserva · [N] = tipo nuevo mínimo · (motor) = de dónde sale el algoritmo sin programar de cero.*

| Materia | Conceptual | Procedimental | Aplicación | Se retira |
|---|---|---|---|---|
| **Matemáticas** (azul) | 🗂️ Clasificar[E] · 🔍 Identificar[E] solo sobre ejemplos, no definiciones | 🧮 **Resolver/Calcular[N]** paramétrico (motores `gen*Items` ya presentes en la Evaluación del mismo js) · 🔢 Ordenar[N] | 🧠 Pensamiento[E] (normalizar: falta en 3 misiones) · Problemas con operación barajada y distractores | Identificar circular · Completar con la respuesta entre 3 opciones visibles |
| **Español** (ámbar) | 🔍 Identificar[E] sobre oraciones reales · 🗂️ Clasificar[E] | ✍️ **Producir/Transformar[N]**: sustituir por pronombres, comparativos, derivar «-mente», conjugar **con VOS** (voseo hondureño: hoy ausente de TODOS los bancos del generador pese a ser identitario), enclíticos (dámelo→da+me+lo) | ✍️ Producir texto[N] (párrafo con conectores; diálogos) · 🗂️ Clasificar TEXTOS reales leyéndolos · 💡 Explicar[E] | Identificar circular (tipos-de-textos, marcadores) · Completar de conocimiento del mundo («La capital de Francia es __») |
| **CC. Naturales** (verde) | 🗂️ Clasificar[E] — aquí es el tipo IDEAL (taxonomía, organelo↔función, glándula↔hormona) · ✏️ Completar[E] breve | 🏷️ **Rotular diagrama mudo[N]** (célula, neurona, corazón, aparatos — los SVG ya existen en las misiones) · 🔢 Ordenar/Secuenciar[N] (eras, digestión, desarrollo, fases de la Luna) | ➡️ **Proceso/Flujo[N]** con flechas (cadena alimenticia, intercambio de gases, arco reflejo, homeostasis) · 🔬 Observar/Experimentar[N] (hielo→agua→vapor, pila+LED, bitácora del cielo) · 💡 Explicar[E] | Identificar tautológico (presente en TODAS las biológicas) |
| **CC. Sociales** (rojo) | 🗂️ Clasificar[E] · 🔍 Identificar[E] no circular | 🗺️ **Localizar en mapa mudo[N]** (Honduras: ríos/vertientes/departamentos; Mesoamérica; continentes; cuadrícula de coordenadas) · emparejar departamento↔cabecera, país↔capital | 🗂️ Tabla comparativa (Maya/Azteca/Inca) · 🔢 Línea de tiempo · 💡 Explicar[E] · husos horarios | Identificar circular de geografía/mayas |
| **Programación** (teal) | — (el cuarteto cubre todo) | ▶️ Ejecutar/Predecir[E] · ⌨️ Escribir código[E] · 🗂️ Analizar/Trazar[E] | 🐞 Depurar[E] | El esqueleto declarativo donde los objetivos son «usar/escribir/depurar» (programando-robot) |
| **Robótica** (teal) | 🗂️ Clasificar[E] (contextos hondureños: conservar) · 🔍 Identificar[E] | 🧮 Calcular[N] (relación de engranajes, voltaje) · ➡️ Proceso/Flujo[N] (tren de engranajes, circuito serie/paralelo) | 🧩 Elegir el componente[N] (¿servo o motorreductor?) · 🔬 Mini-experimento[N] (pila+LED con tabla de registro) · 💡 Explicar[E] | — |
| **Inglés** (rosa) | 🔍 Identificar[E] (vocabulario en contexto) | ✍️ Completar/transformar diálogos[E] | ✍️ **Producir diálogos con registro** formal/informal y escenarios reales — el modelo ya existe en ingles-saludos y se eleva a norma de la materia | — |

### 3.3 Secuencia, cantidad y dificultad

- **Orden dentro de una hoja** (activación→consolidación): ① calentamiento conceptual, 2–3 ítems → ② bloque procedimental, el más numeroso → ③ cierre de aplicación, 1–2 retos. «Primero fácil, luego el reto».
- **Cantidad honesta** (corrige el defecto transversal n.º 2): el número que el niño elige = número de tareas **distintas** que recibe. Si el tipo es paramétrico, 5/8/10/15 reales; si depende de banco fijo, el selector **no puede ofrecer más que el banco**. Preferencia del algoritmo: convertir bancos en generadores paramétricos donde sea trivial (divisibilidad, comparar decimales, ángulos, husos horarios).
- **Dificultad progresiva y coherencia de datos**: los motores generan por niveles (división con divisor exacto → con ceros en el cociente; fracciones de igual → distinto denominador); prohibido generar figuras imposibles o pautas sin simplificar. Toda respuesta se muestra tras 👁 **con su procedimiento**.
- **Etiqueta 🏠/🏫 por tarea** (conexión directa con la iconografía): 🏠 CASA = recuperación autocorregible con la ficha a mano (reconocimiento, práctica guiada, observación/experimento, proyectos); 🏫 AULA = procedimiento nuevo que puede requerir docente, o material/instrumento (transportador, mapa mudo, corrección guiada).

### 3.4 La regla de la víspera

«Ponte a Prueba» **no es una tarea más**: es el último ciclo de práctica de recuperación antes del examen. Sus 4 formatos (Completa, V/F, Selección, Pareados) son un examen de práctica con corrección próxima (la pauta). El generador alimenta los ciclos *anteriores*; «Ponte a Prueba» cierra la secuencia **un día antes del examen**, cuando aún queda una noche para repasar las lagunas que revele. La ruta completa — ①🏠 copiar en casa (recuperación temprana) → ②🏫 practicar en el aula (intermedia) → ③📅 ponerse a prueba la víspera (final) → ④📝 examen — ya estaba implícita en la rúbrica actual; la propuesta la nombra y la señaliza.

### 3.5 El motor paso a paso (aplicable a cualquier misión, presente o futura)

> **PASO 0** Lee los objetivos de la ficha. **PASO 1** Etiqueta cada objetivo por su verbo (conceptual/procedimental/aplicación). **PASO 2** Toma de la tabla de su materia los tipos válidos. **PASO 3** Prefiere el tipo que GENERA (dato aleatorio → respuesta calculada); si la Evaluación del mismo js o la misión hermana ya tiene el motor, reutilízalo. **PASO 4** Retira los tipos circulares y los que evalúan otra cosa. **PASO 5** Ordena fácil→reto y fija cantidades reales. **PASO 6** Etiqueta cada tarea 🏠/🏫 y reserva los 4 formatos de «Ponte a Prueba» para la víspera. **PASO 7** Respuesta oculta 👁 con procedimiento; datos coherentes; voseo donde el tema lo pida.

### 3.6 Mecánica de implementación (cuando decidan ejecutar — hoy solo propuesta)

- **Menú por misión sin backend**: una constante en el js de cada misión — p. ej. `TG_MENU = ['resolver','ordenar','explicar']` — filtra las opciones de `#tgType`. Una línea por misión, ejecutable directamente desde la tabla del apéndice A.
- **Tareas gráficas sin maquinaria nueva**: «Rotular» y «Proceso/Flujo» se formulan como *«dibuja en tu cuaderno y rotula»*, con la lista de rótulos generada en pantalla y el SVG existente como referencia visual — cero infraestructura de impresión nueva, mismo objetivo pedagógico.
- **Tareas abiertas con mini-rúbrica**: toda tarea de producir/explicar/experimentar lleva 2–3 criterios de autoevaluación con casillas (el patrón ya existe en la sección de escritura de la misión de sustantivos: «usa las clases pedidas · mayúsculas · concordancia») — así el padre o el propio alumno pueden valorarlas sin docente.
- **Las 5 misiones de alineación baja primero**: potencias-raíces y teoría de números (conectar `genPotenciaItems`/`genRaizItems`/`genMcmItems`/`genMcdItems` ya presentes), área del círculo (heredar `_tgPoli` de su misión hermana + `genAreaCircItems` propio, con apotemas plausibles), y los dos continentes (mapa mudo + país↔capital). El apéndice A trae la receta de las 57.

---

## 4. Propuesta iconográfica: «Un icono, un significado, siempre en el mismo lugar»

### 4.1 Los 3 iconos núcleo + 3 de apoyo

*Principio (ARASAAC + señalización de Mayer): pocos iconos, alto significado, posición fija; el MISMO icono = el MISMO significado en las 57 fichas y 57 misiones. Nunca solo color (el color por materia ya ocupa ese canal y las fotocopias son B/N): siempre icono + palabra + forma distinta.*

| # | Icono | Significado fijo | Texto de refuerzo | Dónde se usa |
|---|---|---|---|---|
| 1 | **🏠** | Esto lo hago en mi CASA | «En casa» | Fila ① de la rúbrica; etiqueta de tareas del Generador marcadas para el hogar |
| 2 | **🏫** | Esto lo hago en el AULA | «En el aula» | Fila ② de la rúbrica; tareas de aula del Generador. (Se elige 🏫 porque casa↔escuela es el par de siluetas más reconocible para un lector incipiente) |
| 3 | **📅** | Se resuelve UN DÍA ANTES del examen | «La víspera · un día antes del examen» (obligatorio: el calendario solo no dice «víspera») | Junto al título «✍️ ¡Ponte a Prueba!» y en la fila ③ de la rúbrica — **acompañado de 🏫** («En el aula · la víspera»), para no perder el *dónde* |
| 4 | **📝** | El examen | «El examen» | Fila ④. Unifica los dos nombres actuales del mismo evento («Prueba impresa» / «Evaluación en el aula») |
| 5 | **✏️** | Se copia/resuelve en el cuaderno | «En tu cuaderno» | Secciones de contenido que se copian; tareas del Generador |
| 6 | **👁** | Revisa tus respuestas con la pauta | «Revisa con la pauta» | Ya es el botón de respuestas del Generador; se reutiliza junto a la Pauta |

**Tope: 6 iconos de flujo.** Todo significado adicional se resuelve con estos seis + palabra (principio de coherencia de Mayer: cada icono que no aporta, resta). Nota de honestidad que dejó el agente crítico: 🏠✏️👁📝 ya circulan en el lenguaje emoji de las fichas, pero **🏫 y 📅 son nuevos** (hoy no aparecen con función de señalética en ninguna) — son incorporaciones, no reutilizaciones, y por eso la leyenda de la página 1 es imprescindible.

**Reglas de forma:** posición fija en el **margen izquierdo** del título o celda (etiquetado directo = menos carga cognitiva que una leyenda lejana); tamaño ~1.5× el texto contiguo; cada icono dentro de un cuadrito de borde fino gris (figura reconocible en fotocopia; el color de materia solo tiñe el borde); **ningún icono aparece jamás sin su palabra**.

### 4.2 La banda «🧭 Mi ruta de estudio» (página 1)

Hoy el flujo de trabajo solo se descubre **al final** (rúbrica, página 6), en pretérito y en voz de docente. La propuesta lo anuncia **al inicio**, hablándole de tú, justo debajo de «🎯 Objetivos de Aprendizaje»:

> **🧭 MI RUTA DE ESTUDIO:** ① 🏠 **En casa:** copio los contenidos en mi cuaderno → ② 🏫 **En el aula:** practico en mi cuaderno → ③ 📅 **La víspera** (un día antes del examen): resuelvo «Ponte a Prueba» en esta ficha y reviso con la pauta 👁 → ④ 📝 **El examen:** hago la prueba impresa.
>
> *Simbología: 🏠 en casa · 🏫 en el aula · 📅 la víspera del examen · 📝 el examen · ✏️ en tu cuaderno · 👁 revisa tus respuestas.*

La banda es **idéntica en las 57 fichas** (misma redacción, mismo orden): tras las primeras fichas el niño la reconoce de memoria — el mismo patrón «Conoce tu libro» de los libros SEP y ESMATE. En la ficha, además: el título «✍️ ¡Ponte a Prueba!» lleva 📅 a su izquierda (ancla estable, porque su número de sección varía hoy entre 5. y 8.), y en el Generador cada tarea nace con su etiqueta en el encabezado: «🏠 Tarea 3 — En casa» / «🏫 Tarea 5 — En el aula».

---

## 5. La rúbrica rediseñada: «📏 Mi Ruta de Estudio y Evaluación»

### 5.1 Qué corrige (las 12 debilidades detectadas en la rúbrica actual)

La auditoría de las 57 fichas encontró que la rúbrica actual: está al final y en pretérito con voz de docente («Copió», «Resolvió»); esconde «un día antes del examen» en una celda de 9.5 pt una sola vez por ficha; no tiene ni un icono de lugar/momento; no explica cómo los 400 puntos brutos de «Ponte a Prueba» se convierten en una nota /100; codifica «divídalo entre cuatro» en duro (ya falló con la ficha de 5 filas); amenaza («perderá puntos si…») sin decir cuántos; deja «Nota obtenida» y «Observación» sin dueño; no trae fecha ni casillas de hecho; su orden no es cronológico (la práctica aparece *después* de Ponte a Prueba); y las secciones I y II de Ponte a Prueba ni siquiera tienen instrucción. Además, la fila 3 personalizable demuestra que la plantilla ya empezó a romperse orgánicamente (4 fichas con «lugares» únicos y una con 5 filas): la rúbrica nueva absorbe esa flexibilidad por diseño.

### 5.2 Tabla modelo (II–III ciclo) — lista para maquetar

**Encabezado (una línea):** *«Sigue los 4 pasos EN ORDEN. En cada uno marca tu casilla; tu maestra o maestro anota tus puntos.»*

| Paso | ¿Qué hago y dónde? | ¿Cómo me fue? *(yo lo marco)* | Puntos *(los anota el docente)* |
|---|---|---|---|
| ① 🏠 En casa | «Copié TODOS los contenidos de esta ficha en mi cuaderno, con buena letra y sin faltas.» | ☐ Lo logré ☐ Casi ☐ A repasar | ____ /100 |
| ② 🏫 En el aula | «Practiqué los ejercicios en mi cuaderno mostrando TODOS los pasos.» *(fila personalizable por misión, como hoy: Fracciones «Resolví sumas, restas y simplificaciones…»; La Célula «Dibujé y rotulé la célula animal y vegetal»)* | ☐ Lo logré ☐ Casi ☐ A repasar | ____ /100 |
| ③ 🏫📅 En el aula · la víspera | «Resolví "Ponte a Prueba" en esta ficha, un día antes del examen, y corregí mis errores con la pauta 👁.» | ☐ Lo logré ☐ Casi ☐ A repasar | ____ /100 |
| ④ 📝 El examen | «Hice la prueba impresa en el aula.» *(esta fila y la nota final las completa el docente al calificar, porque la ficha se entrega antes del examen)* | *(la marca el docente)* | ____ /100 |
| | **Mi nota final = la suma de los 4 puntos ÷ el número de pasos** | | **____ %** |

**Cajas bajo la tabla** (sustituyen al párrafo gris amenazante):

- 🌟 **Criterio de calidad** (en positivo, accionable): «Gano los 100 puntos de cada paso cuando lo hago COMPLETO, con LETRA que se lee y SIN faltas de ortografía.»
- 🧮 **Cómo vale «Ponte a Prueba»**: «Tu paso ③ vale 100 puntos: es el PROMEDIO de sus 4 partes — Completa, Verdadero/Falso, Selección y Pareados.»
- ✍️ **Para el docente**: Observación: ________ · Fecha del examen: ____ · Fecha en que entregué la ficha: ____

**Decisiones de diseño que integran la crítica de calidad:** las casillas **☐ + palabra** sustituyen a las caritas emoji (😃 vs 🙂 son casi idénticas en fotocopia B/N dentro de una celda compacta — violaban la propia regla del sistema; si se quieren caritas, que sean de trazo lineal SVG, dibujables incluso por el alumno); la fila ③ conserva el **dónde** (🏫) además del **cuándo** (📅); la fila ④ y la nota final quedan explícitamente a cargo del docente (el alumno no puede autoevaluar un examen que aún no ocurre sobre una ficha ya entregada); y el divisor del promedio se expresa como «÷ el número de pasos», no «entre cuatro» en duro (la ficha de robots-problemas, con 5 filas y exposición oral, deja de ser una excepción reescrita a mano).

**Niveles de logro:** ☐ **Lo logré** = completo y bien · ☐ **Casi** = lo hice con dudas o incompleto · ☐ **A repasar** = todavía no lo entiendo. El alumno marca (el mismo gesto que ya usa en la selección múltiple); el docente califica aparte: autoevaluación y calificación conviven sin mezclarse — formato *single-point rubric*, la mejor práctica documentada para primaria.

### 5.3 Variante para I ciclo (1º–3º, lectores incipientes)

Iconos grandes, texto mínimo en presente, sin porcentaje:

> **MI RUTA · marco mi casilla en cada paso**
> ① 🏠 «Copio en mi cuaderno.» ☐☐☐ · ② 🏫 «Practico en mi cuaderno.» ☐☐☐ · ③ 📅 «Me pongo a prueba (un día antes del examen).» ☐☐☐ · ④ 📝 «Hago el examen.» ☐☐☐
> **Mis estrellas de hoy: ⭐ ⭐ ⭐** *(las pinta el docente; sin promedio numérico)*
> 🌟 «Gano mi estrella cuando termino todo, con letra bonita.» *(una sola idea de calidad; sin ortografía en 1º)*

En I ciclo, cada consigna lleva su pictograma al lado: para un lector incipiente la imagen no es adorno, es codificación dual.

### 5.4 Fundamento (resumen con fuentes)

**Alineación constructiva** (Biggs): la tarea debe activar el mismo proceso cognitivo que el objetivo evalúa. **Práctica de recuperación** (Roediger & Karpicke 2006: 61% de retención a la semana contra 40% de releer; replicación en aulas reales de primaria, *Frontiers in Psychology* 2025): valida el generador paramétrico (generar la respuesta, no reconocerla) y «Ponte a Prueba» la víspera con pauta a mano. **Codificación dual** (Paivio) y **señalización/coherencia** (Mayer, revisión sistemática 2022): iconos pocos, significativos, fijos. **Accesibilidad** (ARASAAC, pautas UDL de CAST): icono + texto + forma, nunca solo color, probado en B/N — y argumento citable ante docentes: es diseño universal, no infantilización. **Single-point rubric** (Fluckiger 2010): autoevaluación en primera persona con criterio de logro único. **Marco SEDUC** (Instructivo del Acuerdo 0700-SE-2013): los criterios de evaluación deben *socializarse al inicio* — la banda de la página 1 es exactamente esa socialización — y la ficha resuelta funciona como evidencia de portafolio. **Precedente regional**: ESMATE (El Salvador–JICA) señaliza «Resuelve en casa» como sección fija; los libros SEP abren con «Conoce tu libro»; los cuadernos SEDUC–JICA hondureños siguen el patrón. La propuesta no innova en el riesgo: adopta un estándar centroamericano probado.

---

## 6. De fichas a libros de texto por grado: base y estructura

### 6.1 El hallazgo que lo abarata todo

Las 57 fichas tienen **exactamente 7 páginas carta cada una** (verificado por barrido: `.pagina` con `min-height 253mm` y salto de página, «armadas a mano: ningún recuadro queda a medias»), con anclas de comentario `<!-- PÁGINA N -->`, encabezado estructurado (`Asignatura / Nivel / Tema`), pie «Página N» y la pauta del docente siempre en la hoja 7 suelta. Con páginas físicas fijas, **el folio de cada lección dentro de un libro es pura aritmética**: un compilador puede generar el índice con números de página reales, renumerar pies y armar el solucionario **sin ningún motor de paginación** — ni WeasyPrint ni paged.js — imprimiendo el PDF final con Chrome, la herramienta que la familia ya usa en su harness de impresión. Esa es la base: barata, sin dependencias y con cada pieza ya dominada.

### 6.2 Lo que hay que sembrar DESDE YA (aunque los libros lleguen después)

1. **`fichas/js/fichas-map.js`** — la tabla puente de 57 entradas `'ficha-fracciones': 23, …` que resuelve el eslabón hoy inexistente: los slugs de ficha **no** coinciden con los directorios de misión (`ficha-continentes-aoa` ↔ `misiones/2y3ciclo-los-continentes-america-oceania-antartida`; `ficha-numeros-grandes` ↔ `misiones/1ciclo-segundo-grado`). Generación semiautomática por el título del `.f-badge` contra el catálogo (`misiones.js`), con ~5 casos curados a mano. Ampliación recomendada por la crítica: guardar en la misma entrada el **bloque del tomo** (mat/esp/cnat/csoc/tec/ing/bach) y la **línea personalizada de la fila ② de la rúbrica** — una única fuente de verdad para fichas y compilador.
2. **Retro-etiquetado de una línea por ficha**: atributos en el `<body>` — `data-mision-id`, `data-slug`, `data-materia` (los 7 valores exactos de «Asignatura»), `data-color`, `data-ruta`/`data-etapa`, `data-paginas="7"`, `data-version`. **Deliberadamente SIN `data-grado` ni `data-mes`**: la política anti-sesgo del proyecto se respeta — el grado vive solo en `js/data/dcnb-map.js` y lo resuelve el compilador por join; el interior de cada lección nunca menciona grado (lo que además permite reutilizar el mismo pliego en dos tomos).
3. **Anclas declaradas contrato**: los comentarios `<!-- PÁGINA N -->` no se renombran jamás; la página 7 es siempre la hoja del docente.
4. **Alias de color único**: añadir `--materia: <hex>` en el `:root` de cada ficha (sin borrar `--mat`/`--nat`/`--esp`…, que hoy cambian de nombre por materia) para que el libro tematice y genere la variante B/N tocando UNA variable. Aprovechar para decidir la paleta canónica: tres materias divergen hoy de la normativa de `PLANTILLA-MISIONES.md` (CCNN teal vs verde, Español #b45309 vs #c49000, CCSS #dc2626 vs #c0392b).
5. **`PLANTILLA-FICHAS.md`** — no existe una plantilla de fichas equivalente a la de misiones (la normativa vive como comentario CSS dentro de cada archivo): formalizarla con los metadatos obligatorios, las 7 páginas contractuales, el ancla estable de «Ponte a Prueba» y la checklist, para que las fichas de 1º–3º y 8º–9º nazcan compilables.
6. **Validador en `_dev/`** (junto a los checks existentes): 7 `.pagina` por ficha, `data-mision-id` válido contra el catálogo, pies 1–7, Asignatura entre los 7 valores. Ninguna ficha nueva se publica sin pasarlo.

### 6.3 Arquitectura del tomo por grado

**Tomo integrado por grado** (no un libro por materia: CCSS de 4º tiene 2 fichas — la densidad no da), con el color por materia como color de **bloque**:

1. **Pliego preliminar**: portada (grado, año escolar), página legal (© Familia Polanco-Castellanos, versión y fecha de compilación), presentación al alumno **en segunda persona**, doble página **«Conoce tu libro»** con la tabla de iconos de la sección 4, «Plan del año» (dosificación parcial×mes×lección generada desde `dcnb-map.js`) e índice con folios reales.
2. **Bloques por materia** en orden fijo (Español ámbar · Matemáticas azul · CCNN verde · CCSS rojo), cada uno con portadilla — **banda de color dentro de márgenes** (no a sangre: las impresoras domésticas no imprimen a sangre) **+ trama distinguible en B/N** (rayas=Español, puntos=Matemáticas…): doble codificación color+forma, fotocopiable.
3. **Unidades = parciales** del año hondureño (I: feb–abr · II: may–jun · III: jul–ago · IV: sep–nov; confirmar el corte con el calendario vigente). Cada unidad abre con portadilla: «Qué aprenderé» (síntesis de los objetivos de sus lecciones), la línea de tiempo 🏠→🏫→📅→📝, y el acceso a las misiones — **código corto impreso** (p. ej. «Misión M23») en lugar de QR como canal principal: funciona sin internet con el sitio local del aula y sin librerías; los QR quedan para la edición digital.
4. **Lección = ficha** (páginas 1–6 renumeradas; la página 7 **nunca** se encuaderna en el tomo del alumno). Para que la autocorrección de la víspera no muera en el formato libro (contradicción que detectó la crítica): **mini-solucionario de «Ponte a Prueba» al final del tomo en letra pequeña** (práctica editorial SEP) — la pauta completa con procedimientos sigue siendo exclusiva del Libro del Docente.
5. **Cierre de unidad** (contenido nuevo, 1–2 pp): repaso acumulativo de 8–10 ítems que mezclan las lecciones de la unidad + tabla de registro de notas del parcial.
6. **Pliego final**: glosario por materia (corrige el «vocabulario adulto sin glosario»), registro anual de notas, índice de misiones, contraportada.

**Libro del Docente por grado** (tomo separado, delgado): dosificación completa grado/mes (aquí SÍ se imprime el grado — es la herramienta que el propio `dcnb-map.js` anuncia como pendiente), las páginas 7 en el orden del tomo, guía de la rúbrica (quién llena qué; conversión 400→100) y la tabla de iconos comentada.

**Casos especiales**: Tecnología (13 fichas de Programación/Robótica) e Inglés no tienen grado en `dcnb-map` → **volumen aparte «Tecnología y Robótica» por ciclo**, ordenado por ruta/etapa. La ficha de Bachillerato queda fuera de los tomos 1º–9º. **I ciclo: los tomos de 1º–3º no se compilan, se producen** — hoy hay 1 misión y 0 fichas de I ciclo; requieren la variante de plantilla para lectores incipientes (menos texto, cuerpo mayor, consignas con pictograma) definida con criterio pedagógico *antes* de fabricar en serie.

### 6.4 El pipeline recomendado (y por qué se descartaron los otros)

| Opción | Veredicto |
|---|---|
| Unir PDFs de fichas sueltas | Sin índice, sin folios corridos — descartada |
| WeasyPrint (Python) | Mete Python a una familia que trabaja en Node; débil justo en emojis — descartada |
| paged.js | Sin instalación y offline, pero **repagina todo** y puede romper el armado artesanal — plan B |
| **Compilador Node sin dependencias + Chrome** | **Recomendada**: corta por las anclas, calcula folios por aritmética, renumera, ensambla plantillas de páginas de servicio, y Chrome imprime el PDF (`--headless --print-to-pdf`) |

**Flujo humano completo**: `node _dev/valida-fichas.js` → `node _dev/compila-libro.js --grado=5` → imprimir en Chrome → revisar el PDF → fotocopiadora o imprenta. **Validación obligatoria en cada compilación**: contar las páginas del PDF contra el total calculado; si difieren, una ficha desbordó — **se corrige la ficha, nunca el libro** (el libro es un artefacto generado: se borra y regenera, jamás se edita a mano). Dos requisitos que la crítica exigió documentar: la máquina de compilación necesita **fuente emoji de color instalada** (en Linux, Noto Color Emoji; si falta, los emojis salen como cuadros vacíos sin aviso), y el compilador debe poder emitir además **fascículos por parcial** — que es como realmente se fotocopia en Honduras — no solo el tomo de ~200 páginas.

### 6.5 Piloto y fases

- **Piloto: Libro de 5º grado** — el más denso del mapa curricular (31 lecciones: 9 Matemáticas, 7 Español, 11 CCNN, 4 CCSS ≈ 200 pp, contra 27 de 4º y 6º, 25 de 7º, 15 de 8º y 14 de 9º) y el centro del público real actual. Imprimir 1–2 ejemplares y usarlos un parcial completo antes de escalar.
- **Fase 0** (decisiones + tabla puente): tomo integrado ✓; regla de **«grado principal»** para el contenido espiral (propuesta concreta, que la crítica pidió no dejar abierta: *el grado donde el DCNB trabaja el tema más meses; empate → el grado menor; los demás tomos llevan referencia cruzada «ver Libro de Nº»*); destino de Tecnología/Inglés; calendario de parciales. Entregables: `fichas-map.js` + `PLANTILLA-FICHAS.md`.
- **Fase 1**: retro-etiquetado `data-*` + alias `--materia` + validador; de paso, normalizaciones baratas (numeración estable de «Ponte a Prueba», guiones largos fuera según la normativa vigente, paleta canónica).
- **Fase 2**: compilador + piloto de 5º (color y B/N; libro del alumno y del docente).
- **Fase 3**: iteración del piloto en uso real; integración de iconografía y rúbrica nuevas; repasos acumulativos y glosario.
- **Fase 4**: 4º y 6º (reutilizando pliegos del piloto); volumen Tecnología; decidir 8º–9º (tomo combinado o producir las fichas faltantes — el mapa docente ya reconoce 104 misiones potenciales contra 31 existentes en rutas).
- **Fase 5**: producción de I ciclo (1º–3º) con la variante de plantilla para lectores incipientes.
- **Fase 6** (solo si se comercializa): ISBN (gratuito vía la agencia hondureña en la Biblioteca Nacional) y depósito legal; y **atención a licencias**: los pictogramas ARASAAC son CC BY-NC-SA — su cláusula *no comercial* obliga a iconografía propia (o emoji del sistema, que no tienen esa restricción) en una edición vendible. Decidir el destino comercial **antes** de casarse con ARASAAC en la señalética.

### 6.6 Riesgos principales

(1) El **contenido espiral** multi-grado (Fracciones aparece en 4º–7º; el Español espiral en casi todos) exige la regla de grado principal — es decisión editorial previa, no problema técnico. (2) La **paginación determinista depende del armado a mano**: una edición que desborde una página descuadra todos los folios posteriores sin aviso visual — de ahí el validador que cuenta páginas en cada compilación. (3) La **promesa «1º a 9º»** no es compilable hoy: I ciclo vacío y 8º–9º delgados; anunciar la colección completa y entregar tres tomos sería el error — comunicar por tomos disponibles. (4) **Doble fuente de verdad**: en cuanto exista `libro-5.html`, la tentación de corregir erratas ahí (y no en la ficha origen) crea divergencia permanente — regla dura en la plantilla. (5) La edición **B/N es la principal**, no un extra: si el código de color por materia es el único canal, desaparece en la fotocopiadora — tramas y formas desde el día uno.

---

## 7. Hallazgos del agente crítico (y cómo quedaron resueltos)

Para que puedan auditar el proceso, estas fueron las contradicciones reales que la fase de crítica encontró entre las propuestas de diseño — todas incorporadas ya en las secciones anteriores:

| Contradicción detectada | Resolución adoptada en este reporte |
|---|---|
| La rúbrica pedía «corregí con la pauta 👁» pero el plan editorial saca la página 7 del tomo del alumno | Mini-solucionario de «Ponte a Prueba» al final del tomo (letra pequeña, práctica SEP); pauta completa solo en el Libro del Docente (§6.3.4) |
| Las caritas emoji 😃🙂 son indistinguibles en fotocopia B/N y elevaban el inventario real de símbolos por encima del tope declarado | Casillas ☐ + palabra (o caritas de trazo lineal SVG); el tope de 6 se aplica a los iconos de flujo (§5.2) |
| La fila ③ perdía el «dónde» (solo 📅) cuando la familia pidió distinguir casa/aula de un vistazo | Icono compuesto 🏫📅 «En el aula · la víspera» (§5.2) |
| El alumno no puede autoevaluar la fila ④ (el examen ocurre después de entregar la ficha) | Fila ④ y nota final explícitamente a cargo del docente; se añade «Fecha en que entregué la ficha» (§5.2) |
| 🏫 y 📅 se presentaban como «ya presentes en las fichas» — son nuevos | Se declara honestamente y se refuerza la leyenda de página 1 (§4.1) |
| Portadillas «a sangre» y QR contradicen impresión doméstica B/N y offline | Bandas dentro de márgenes + tramas; código corto en lugar de QR como canal principal (§6.3) |
| El pipeline «sin dependencias» ocultaba el requisito de fuente emoji en la máquina de compilación | Requisito documentado como contrato (§6.4) |
| Discrepancia 57 vs 59 fichas | Son 57; `FICHAS_MAP` nace con 57 entradas |
| La rúbrica nueva «cabe en el mismo espacio» era una afirmación sin medir, y toda la paginación del libro depende de la página 6 | Plan de pilotaje: aplicar la rúbrica en UNA ficha y medir la altura de la página 6 con el harness de impresión antes de replicar en 57 (§9) |
| Robótica, Inglés y CCSS quedaban sin reglas completas de tarea y ~14 fichas sin lugar en el libro | Tabla de decisión extendida a las 7 materias (§3.2) y volumen «Tecnología y Robótica» por ciclo + Inglés (§6.3) |
| Tareas abiertas nuevas (producir texto, experimentar) sin criterio de corrección | Mini-rúbrica de 2–3 criterios por tarea abierta, con el patrón que ya existe en la misión de sustantivos (§3.6) |
| El menú de tareas por misión no tenía mecanismo concreto | Constante `TG_MENU` por misión, una línea, sin backend (§3.6) |

---

## 8. Qué NO cambiar

La auditoría es igual de clara en lo que debe quedar intacto: la **gamificación completa** (XP, logros, constancias, Campeonísimo); el **offline-first** y el carácter «cuaderno-céntrico» de las tareas; las **formas deterministas** de las evaluaciones y la pauta como hoja suelta; los **contextos hondureños** de los bancos (café, milpa, vado, baleadas — son una joya didáctica); el bloque de instrucción con truco y el botón 👁 con procedimiento; el color por materia; y las 7 páginas contractuales de la ficha. Nada de LMS genérico, nada de forks por colegio, nada de rehacer misiones que ya alinean alto.

---

## 9. Plan de ejecución sugerido (cuando decidan implementar)

**Tanda 1 — Rúbrica e iconos (1 ficha piloto):** aplicar la banda «🧭 Mi ruta de estudio», el icono 📅 en «Ponte a Prueba» y la rúbrica nueva en UNA ficha (propuesta: ficha-fracciones, la más representativa); **medir la altura de la página 6** con el harness de impresión (presupuesto de milímetros por escrito); ajustar; replicar en las 57 por tandas con commit por checkpoint, según la disciplina de trabajo del proyecto.

**Tanda 2 — Generadores (las 5 bajas primero):** potencias-raíces, teoría de números, área del círculo, continentes ×2 — en todas, el motor ya existe (Evaluación del mismo js o misión hermana); definir `TG_MENU` por misión; luego las 28 medias por materia (la receta misión por misión está en el apéndice A); al final, normalizar cantidad honesta y 🧠 Pensamiento en matemáticas.

**Tanda 3 — Base editorial:** `fichas-map.js` + `data-*` + `--materia` + validador + `PLANTILLA-FICHAS.md`.

**Tanda 4 — Libro piloto de 5º:** compilador + plantillas de páginas de servicio + PDF color y B/N + Libro del Docente; un parcial de uso real antes de escalar.

Cada tanda es independiente: pueden ejecutar la 1 sin la 2, o la 3 sin ninguna de las anteriores. Lo único con orden obligatorio es 3 → 4.

---

## Apéndice A. Veredicto misión por misión (57)

*Alineación del Generador de Tareas con los objetivos de la ficha: ✔ alta (conservar) · ◐ media (ajustar) · ✖ baja (rehacer con motores existentes). La columna «Qué hacer» resume la receta de la auditoría.*

| Misión | Alin. | Qué hacer |
|---|---|---|
| **CIENCIAS NATURALES (ANATOMÍA / DESARROLLO HUMANO)** | | |
| reproduccion-desarrollo | ◐ media | Rotular diagramas mudos de los sistemas reproductores masculino y femenino. Ordenar en línea de tiempo las etapas del desarrollo humano. Secuenciar los pasos de la fecundación. Clasificar cambios de la pubertad (físicos/emocionales, masculino/femenino) manteniendo classify. |
| **CIENCIAS NATURALES (ANATOMÍA Y FISIOLOGÍA)** | | |
| respiratorio-circulatorio | ◐ media | Rotular un diagrama del corazón y del árbol respiratorio. Diagrama de flujo del intercambio de gases en el alvéolo (entra O2 / sale CO2). Trazar la circulación mayor y menor con flechas. Clasificar arterias/venas/capilares y los componentes de la sangre (mantener classify). Comparativa de hábitos saludables/dañinos. |
| sistema-digestivo | ◐ media | Ordenar el recorrido del alimento por los órganos del tubo digestivo (secuencia). Ordenar las cuatro etapas de la digestión. Rotular un diagrama del aparato digestivo señalando glándulas anexas. Clasificar alimentos en los cinco grupos de nutrientes. Mantener la tabla órgano↔función. |
| sistema-endocrino | ◐ media | Mantener y potenciar classify (glándula↔hormona↔función), que es exactamente el objetivo. Añadir tarea de bucle de retroalimentación negativa (ordenar los pasos glucosa/insulina/glucagón). Rotular en el cuerpo la ubicación de las glándulas. Tabla comparativa endocrino vs nervioso. Caso clínico simple sobre la diabetes. |
| sistema-nervioso | ◐ media | Rotular un diagrama de la neurona y del encéfalo. Ordenar los pasos del arco reflejo (estímulo→respuesta). Secuenciar la sinapsis con el papel de los neurotransmisores. Clasificar estructuras en SNC vs SNP (mantener classify). Emparejar enfermedad neurológica↔síntoma. |
| **CIENCIAS NATURALES (ASTRONOMÍA)** | | |
| universo-sistema-solar | ◐ media | Ordenar las fases de la Luna en su ciclo. Ordenar los planetas por cercanía al Sol / rotular el Sistema Solar. Emparejar movimiento terrestre↔efecto (rotación→día y noche; traslación→estaciones). Clasificar astros en estrella/planeta/satélite (mantener classify). Bitácora de observación del cielo. |
| **CIENCIAS NATURALES (BIOLOGÍA / CLASIFICACIÓN DE LOS SERES VIVOS)** | | |
| cinco-reinos | ◐ media | Clave dicotómica interactiva: dar un ser vivo (foto/nombre) y hacer responder las 3 preguntas clave para deducir el reino. Tarea de clasificación inversa (rasgos dados → nombrar reino). Emparejar ser vivo↔nombre científico. Mantener classify (tabla) y explain (buenos), pero convertir identify en 'clasifica este organismo aplicando las 3 preguntas'. |
| **CIENCIAS NATURALES (CITOLOGÍA)** | | |
| la-celula | ◐ media | Rotular un diagrama mudo de célula animal y vegetal (arrastrar/escribir nombres de organelos). Emparejar organelo↔función (mantener la tabla classify, que es ideal). Tabla de doble entrada animal/vegetal marcando presencia de cada organelo. Ordenar/enunciar los 3 postulados. Diagrama de flujo de la fotosíntesis. |
| **CIENCIAS NATURALES (ECOLOGÍA)** | | |
| ecosistemas | ◐ media | Constructor de cadena alimenticia (arrastrar/dibujar flechas entre organismos y marcar el sentido del flujo de energía). Ordenar los niveles de organización de menor a mayor. Clasificar un organismo hondureño como productor/consumidor/descomponedor (mantener classify). Observación de campo de un ecosistema local con registro de factores bióticos y abióticos. |
| **CIENCIAS NATURALES (FÍSICA / QUÍMICA BÁSICA)** | | |
| la-materia | ◐ media | Diagrama de cambios de estado con flechas nombradas y sentido del calor (gana/pierde). Mini-experimento guiado de observación (derretir hielo, hervir agua) con registro. Clasificar ejemplos en mezcla vs sustancia pura. Distinguir masa/volumen con casos medibles. Mantener la tabla de estados. |
| **CIENCIAS NATURALES (FÍSICA)** | | |
| la-energia | ◐ media | Trazar cadenas de transformación de energía en aparatos cotidianos (nombrar energía de entrada y de salida). Clasificar fuentes renovables/no renovables de Honduras (mantener classify). Auditoría de ahorro: listar aparatos del hogar y proponer una medida de ahorro para cada uno. Identificar la forma de energía en una foto/situación. |
| **CIENCIAS NATURALES (GEOLOGÍA / HISTORIA DE LA VIDA)** | | |
| eras-geologicas | ◐ media | Línea de tiempo para ordenar las cinco eras y ubicar en ellas fósiles guía y grandes extinciones. Emparejar fósil guía↔era. Reconstruir la fragmentación de Pangea por pasos. Mantener classify (fósil→era) e identify (que aquí funciona). |
| **CIENCIAS NATURALES / ESTUDIOS SOCIALES (GESTIÓN DEL RIESGO)** | | |
| desastres-naturales | ◐ media | Tarea de escenario/simulacro: dado un evento (Mitch, sismo, inundación), ordenar acciones antes/durante/después. Tarea causa-efecto: dado un nivel de amenaza y de vulnerabilidad, deducir el riesgo y proponer una medida de prevención vs mitigación. Mapa de amenazas de la comunidad. Conservar classify (geológicas/hidrometeorológicas). |
| **CIENCIAS SOCIALES** | | |
| geografia-coordenadas | ◐ media | Generador de puntos aleatorios sobre cuadrícula imprimible (SVG) para escribir su latitud/longitud; el inverso: dado '14°N, 87°O', marcar el punto; cálculos de husos horarios con horas aleatorias; conservar classify (bien estructurada para los referentes 0°). |
| geografia-de-honduras | ◐ media | Mapa mudo imprimible de Honduras con numeración para rotular ríos, lagos, islas y departamentos; tabla de clasificación de ríos por vertiente (Caribe vs Pacífico); asociar departamento↔cabecera; ampliar classify a 10-15 lugares; conservar explain. |
| mayas-precolombinas | ◐ media | Tabla comparativa Maya/Azteca/Inca (ubicación, capital, logro principal, escritura) para completar — es el algoritmo que el objetivo 6 exige; mapa de Mesoamérica para situar Copán, Tikal, Tenochtitlan y Cusco; línea de tiempo para ordenar sucesos; ampliar el banco de classify; conservar explain y complete. |
| **CIENCIAS SOCIALES / CIENCIAS NATURALES** | | |
| areas-protegidas-de-honduras | ✔ alta | Es el generador mejor alineado del bloque CCSS: conservar classify y explain tal cual; convertir identify en '¿de qué bosque/área se habla?' con banco cerrado de opciones; añadir mapa de Honduras para situar las 5… |
| **ESPAÑOL** | | |
| marcadores-textuales | ◐ media | Conservar complete (la tarea mejor alineada); reconstruir identify con párrafos breves reales donde subrayar TODOS los marcadores y clasificar cada uno; redacción guiada: párrafo de 4 oraciones con 1 marcador de orden + 1 de contraste + 1 de cierre; sustituir marcadores repetidos por equivalentes de la misma relación. |
| pronombres | ◐ media | Reescritura sustituyendo sustantivos repetidos por pronombres (incl. átonos lo/la/le); pares determinante/pronombre para etiquetar; oraciones con vos para conjugar y clasificar; descomponer enclíticos ('dámelo' → da+me+lo); conservar classify con su columna Posición. |
| sustantivos | ◐ media | Rehacer complete con lógica gramatical: colectivos ('una ___ de lobos' → manada), formación de plurales -s/-es, femeninos, derivados (pan→panadería) y diminutivos; conservar identify y classify (bien alineados y con banco amplio). |
| tipos-de-textos | ◐ media | Banco de mini-textos reales de 2-4 líneas (receta, noticia, poema, diálogo, anuncio) para leer, clasificar y justificar por propósito y marcas lingüísticas; segmentar un cuento breve en inicio/nudo/desenlace; conservar classify (formatos) y explain. |
| acentuacion | ✔ alta | Consigna por ítem que indique la clase a buscar; tabla Palabra→Sílabas→Sílaba tónica→Clase→¿Tilde? ¿Por qué regla?; completar con pares diacríticos (él/el, sí/si); corregir un texto breve con tildes… |
| adjetivos | ✔ alta | Conservar identify/classify/complete (la concordancia en complete es la mejor tarea del bloque Español); añadir transformación a los 3 grados y a comparativos de igualdad/inferioridad; reescribir sintagmas cambiando… |
| adverbios | ✔ alta | Tabla de derivación adjetivo→femenino→adverbio-mente; pares mínimos adjetivo/adverbio para etiquetar cuál es cuál; complete con distractores de la misma clase; corregir oraciones que violan la regla de los dos -mente. |
| verbos | ✔ alta | Añadir columnas Modo y Regular/Irregular a la tabla de classify; huecos con subjuntivo e imperativo ('Ojalá ___ pronto', '___ la puerta'); separar raíz-desinencia (cant-amos); conservar el complete temporal actual,… |
| **ESPAÑOL (BACHILLERATO-UNIVERSIDAD)** | | |
| bach-adjetivos | ✔ alta | Análisis con pauta completa clase+función+valor posicional; transformación anteposición↔posposición explicando el cambio semántico ('un pobre hombre' vs 'un hombre pobre'); ejercicios reales de apócope (grande→gran)… |
| **ESTUDIOS SOCIALES / GEOGRAFÍA (MISIÓN DE CCSS AGRUPADA AQUÍ COMO 'NATURALES')** | | |
| los-Continentes-Europa-Asia-y-Africa | ✖ baja | Localizar en un mapa mudo de Asia/Europa/África los accidentes clave (Everest, Himalaya, Nilo, Sahara, Mediterráneo). Emparejar país↔capital / continente↔dato. Rotular un mapa con relieves, ríos y desiertos. Tarea de escala/tamaño comparando extensiones. Mantener explain para colonialismo y relaciones Honduras-UE/KOICA. |
| los-continentes-america-oceania-antartida | ✖ baja | Localizar en un mapa mudo de América/Oceanía/Antártida los elementos clave (Amazonas, Andes, Gran Barrera, Australia, polo sur) y marcar Honduras en América Central. Emparejar cultura originaria↔región (maya/aborigen/maorí). Rotular mapas con países y relieves. Tarea de rutas comerciales (CAFTA-DR, remesas). Mantener explain para lo socioeconómico y cultural. |
| **INGLÉS** | | |
| ingles-saludos | ✔ alta | Mantener el enfoque comunicativo; generar mini-role-plays parametrizados (situación + hora del día + registro → escribir y actuar); emparejar pregunta-respuesta (How are you? ↔ Fine, thanks); marcar explícitamente… |
| **MATEMÁTICAS** | | |
| area-circulo-y-poligonos-regulares | ✖ baja | 'Área del círculo' (radio o diámetro aleatorio, respuesta con π≈3.1416 calculada), 'Sector circular' (ángulo y radio aleatorios), 'Área y perímetro de polígonos regulares' (reutilizar el _tgPoli de la misión hermana con apotemas plausibles), 'Dato faltante' (dada A, hallar r) y 'Problemas mixtos'; conservar un único tipo conceptual breve para fórmulas y unidades. |
| potencias-raices | ✖ baja | Tipos 'Calcular potencias' (base aleatoria → n²), 'Calcular raíces' (cuadrado perfecto aleatorio → √), '¿Cuadrado perfecto?' (sí/no + entre qué dos cuadrados está), 'Operaciones combinadas' generadas con orden de operaciones y 'Problemas' — reutilizando los motores que ya existen en el propio archivo para la evaluación. |
| teoria-numeros | ✖ baja | 'Aplicar reglas de divisibilidad' (número aleatorio → tabla 2/3/5/9/10/11 con respuesta calculada), 'Calcular m.c.m.' y 'Calcular M.C.D.' con pares aleatorios pequeños (reutilizando genMcmItems/genMcdItems), 'Problemas de coincidencia y reparto' (semáforos, buses, bolsas) y '¿Primo, compuesto o primos entre sí?' generado. |
| division-decimales | ◐ media | 'Transformar la división' (par decimal aleatorio → escribir su equivalente entera), 'Resolver divisiones' generadas por niveles (divisor decimal exacto → con ceros al cociente), 'Predecir el cociente' (¿mayor, menor o igual? antes de calcular, luego comprobar) — reutilizando los motores de la evaluación. El diseño de la tabla classify actual es bueno: solo necesita datos generados en vez de 5 filas fijas. |
| fracciones | ◐ media | 'Sumar/restar con igual denominador' y 'con distinto denominador' generadas (denominadores 2-12 compatibles, respuesta simplificada calculada con MCD), 'Simplificar' (fracción reducible aleatoria), 'Clasificar' fracciones generadas en la tabla actual, y 'Leer/representar' (escribir el nombre o pintar las partes de una fracción generada). |
| numeros-decimales | ◐ media | 'Sumar y restar decimales' en columna generadas, 'Comparar' pares/tríos aleatorios con <, >, =, 'Redondear' a la posición pedida, 'Mover el punto' (×/÷ 10, 100, 1,000) y 'Fracción ↔ decimal' con el repertorio usual — reutilizando los motores de la evaluación ya presentes en decimales.js. |
| valor-posicional | ◐ media | Portar los 5 tipos algorítmicos de la misión Números Grandes (misma familia de contenido, mismo _fmtNum/numToWords) y añadir 'sumas en columna con acarreo' generadas y 'comparar pares o tríos con <, >' aleatorios. |
| angulos-basicos | ✔ alta | Mantener los 4 tipos de cálculo (ya algorítmicos y correctos). Añadir: 'dibuja con transportador' (genera N° aleatorio, pide trazarlo y clasificarlo), clasificación desde mini-figuras SVG con el arco dibujado (la… |
| area-poligonos-regulares | ✔ alta | Incluir triángulo y cuadrado en el pool; derivar la apotema del lado con pares plausibles precalculados; barajar aleatoriamente qué pide cada problema y ampliar plantillas; añadir un tipo visual 'identifica la figura… |
| multiplicacion-vertical | ✔ alta | Añadir tipo 'casos especiales' (mezcla generada de ×0/×1/×10/×100 para automatizar los atajos); diversificar plantillas de problemas incluyendo alguno que se resuelva con suma para obligar a decidir la operación;… |
| multiplos-divisores-primos | ✔ alta | Es la misión modelo del grupo: pools curados didácticamente + cálculo real + justificación exigida. Solo falta un tipo 'criterios del 2 y 5' (número aleatorio → ¿divisible entre 2/5/10 sin dividir? explica con la… |
| perimetro-cuadrilateros | ✔ alta | Barajar aleatoriamente si cada problema pide P o A y ampliar verbos/contextos; añadir tipo rápido de decisión '¿perímetro o área?' sin calcular (solo elegir y justificar); conservar los generadores de cálculo, que… |
| recta-numerica | ✔ alta | Añadir 'punto medio' generado (extremos aleatorios amigables); pedir en algunas operaciones su representación en la recta con saltos; mini-tipo de nombrar los términos de una operación generada. escondido y piramide… |
| segundo-grado | ✔ alta | Los 5 tipos algorítmicos actuales son el modelo a imitar en todo el proyecto (número aleatorio + respuesta calculada + instrucción con truco). Ajustes: selector de nivel que limite el rango de cifras según… |
| **MATEMÁTICAS (GEOMETRÍA, AZUL)** | | |
| angulo-bisectriz | ◐ media | Generador numérico aleatorio: (1) calcular complemento/suplemento de un ángulo aleatorio (evitando triviales); (2) bisectriz: dado el ángulo hallar la mitad y a la inversa; (3) clasificar un ángulo aleatorio 1°-360° (fusionando identify+classify); (4) dibujar/medir con transportador un ángulo dado y trazar su bisectriz (tarea de cuaderno verificable con la pauta); (5) problemas combinados de dos pasos. Todo con… |
| **PROGRAMACIÓN (RUTA DEL CÓDIGO)** | | |
| bucles-repetir | ✔ alta | Los 4 tipos actuales son exactamente los que los objetivos exigen (compactar↔expandir, ahorro, figura del rastro); solo faltaría un 5º tipo «encuentra el bug del bucle» (N errada o instrucción del cuerpo cambiada,… |
| detective-bugs | ✔ alta | La secuencia actual caza→tipo→predice→corrige reproduce fielmente el método del detective de la ficha y cubre todos los objetivos operativos; es de las mejores alineaciones de la plataforma. Lo único no cubierto… |
| mi-primer-programa | ✔ alta | El cuarteto ejecutar/traza/pseudo/bug es el correcto para una misión de síntesis; para redondear: ampliar los bancos de pseudo/bug o parametrizarlos, y un tipo «descompón el proyecto en 3 partes» reutilizando el… |
| pensamiento-computacional | ✔ alta | Mantener los 4 tipos (muy bien alineados y contextualizados) y añadir un 5º tipo «abstracción»: dada una situación con 6-8 datos, subrayar los 3 que importan para el objetivo dado y tachar los irrelevantes; ampliar… |
| robot-decide | ✔ alta | Los 4 tipos mapean uno a uno los objetivos (evaluar la condición, producir el condicional, ejecutarlo dentro de un programa, depurarlo): alineación modelo. Solo ampliar/parametrizar los bancos de condicional y bug… |
| robot-mensajero | ✔ alta | programa/predice/bug con simulador es exactamente lo que exigen los objetivos de ejecución y depuración, y algoritmo cubre la secuencia cotidiana. Faltaría un tipo ligero «exacta o ambigua» (marcar y corregir la… |
| variables-cajitas | ✔ alta | Los 4 tipos calzan uno a uno con los objetivos (trazar, producir, clasificar, depurar) y son paramétricos con respuesta ejecutada: alineación modelo. Único matiz posible: una variante de traza con MUESTRA intercalado… |
| **ROBÓTICA / CCNN (VERDE)** | | |
| electricidad-robots | ◐ media | Conservar classify (excelente para conductores/aislantes) y añadir: (1) tarea de esquema — dibujo o descripción de un circuito generado al azar (interruptor abierto/cerrado, serie/paralelo, foco quemado) y predecir qué enciende; (2) mini-experimento de casa con pila+LED+objetos, con tabla de registro; (3) parametrizar completes con valores (¿cuántas pilas de 1.5 V para 3 V?). |
| motores-mecanismos | ◐ media | Un tipo «regla de los dientes» paramétrico (dientes y vueltas aleatorios, respuesta calculada: relación, fuerza/velocidad); un tipo «tren de engranajes» (N aleatorio de ruedas, marcar sentido de cada una); un tipo «elige el motor/mecanismo» dada una necesidad (ángulo exacto→servo, más fuerza→motorreductor); conservar classify y explain. |
| que-es-un-robot | ✔ alta | Para una misión conceptual introductoria el esquema actual funciona: classify robot/no-robot es la tarea estrella y explain exige transferencia real. Añadiría un tipo «elige el sensor» (situación aleatoria → cuál de… |
| robots-problemas | ✔ alta | classify (ficha de proyecto) y explain (diseñar) son las tareas correctas para una misión de proyecto y están muy bien contextualizadas. Completar con: ordenar las 7 etapas desordenadas, y un clasificador… |
| sensores-robot | ✔ alta | La tabla classify (componente → percibe/sentido/ejemplo) es exactamente el objetivo central y explain fuerza la transferencia. Sumar un tipo paramétrico «situación → sensor» (combinando situaciones del banco con… |
| **ROBÓTICA / PROGRAMACIÓN (VERDE)** | | |
| programando-robot | ◐ media | Esta misión debería heredar los motores de sus hermanas: (1) escribir el programa completo (cuadrícula con obstáculos, exige bucle+condicional, como genProgramaTask de robot-mensajero); (2) trazar programa con bucle/condicional/variable y dar casilla final + valor del contador (como genEjecutarTask de mi-primer-programa); (3) cazar el bug (como genBugTask); (4) conservar classify de bloques como tipo de análisis.… |

---

## Fuentes principales

**Del propio proyecto (verificadas en el repositorio):** los generadores `genTask`/`gen*Task` y bancos `*TaskDB` de las 57 misiones · las 57 fichas `ficha-*.html` (estructura de 7 páginas, rúbrica, pauta) · `js/data/misiones.js`, `js/data/dcnb-map.js`, `js/data/diagnosticos.js` · `PLANTILLA-MISIONES.md` · `fichas/mapa-curricular-metas-dcnb.html` · `PROPUESTA-EVALUACIONES-2026.md` y `_dev/`.

**Iconografía editorial:** iconos de campos formativos NEM/SEP (docentesaldia.com) · ESMATE, MINEDUCYT El Salvador–JICA (mined.gob.sv) · criterios de accesibilidad de iconos (a11y-collective.com, continualengine.com) · ARASAAC y accesibilidad cognitiva (aulaabierta.arasaac.org; licencia CC BY-NC-SA).

**Neuroeducación:** codificación dual (Paivio; Clark & Paivio 1991) · principios de señalización y coherencia de Mayer (revisión sistemática, *Smart Learning Environments* 2022) · pautas UDL de CAST (udlguidelines.cast.org) · efecto del examen práctico (Roediger & Karpicke 2006; replicación en primaria, *Frontiers in Psychology* 2025) · práctica espaciada y *successive relearning* (Rawson & Dunlosky; Dunlosky et al. 2013).

**Rúbricas:** *single-point rubric* (Fluckiger 2010; cultofpedagogy.com) · autoevaluación en primaria (gwaea.org) · Instructivo del Acuerdo 0700-SE-2013, SEDUC (se.gob.hn) · DCNB/CNB de Honduras.

**Editorial y libros:** secuencias didácticas inicio-desarrollo-cierre (Díaz-Barriga) · anatomía editorial del libro (solareditores.com) · agencia ISBN de Honduras, CERLALC (cerlalc.org) y depósito legal en la Biblioteca Nacional · paged.js (github.com/pagedjs) y comparativa de pipelines HTML→PDF.

---

*Reporte elaborado el 29 de julio de 2026 mediante flujo multi-agente (9 agentes: 4 auditores de misiones, 1 auditor de fichas, 1 investigador web, 1 pedagogo-neuroeducador-didacta, 1 arquitecto editorial, 1 crítico de calidad). Todas las contradicciones detectadas por el crítico están integradas y documentadas en la sección 7. Solo propuestas: ningún archivo del proyecto fue modificado.*
