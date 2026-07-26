# 🧩 PLANTILLA DE MISIONES · Guía rápida (M.E.T.A.S)

Receta para crear una **misión nueva** rápido y **ahorrando tokens**.
En una sesión nueva basta con decir: **"Sigue PLANTILLA-MISIONES para una misión de [materia], tema [X]"**.

---

## ⭐ Prompt de arranque (copia y pega en una sesión NUEVA)

```
Sigue PLANTILLA-MISIONES.

Nueva misión:
- Materia: (español / matemáticas / naturales / sociales)
- Tema: ______
- Grado: II y III Ciclo (o el que sea)
- Debe incluir: juegos lúdicos interactivos (+ lo que quieras agregar)

Reglas de ahorro y calidad:
- Usa como plantilla la misión MÚLTIPLOS, DIVISORES Y PRIMOS
  (misiones/2ciclo-multiplos-divisores-primos, id 28): ya trae TODOS los
  estándares de UX aprobados (incluye memorama y evaluación conceptual
  calificable en línea). NO releas misiones más viejas.
- Aplica completo el checklist "Estándares de UX aprobados" de esta plantilla.
- Varía los widgets (2 del Lab + 3 de la sección Widgets): crea 5 nuevos
  adecuados al contenido de la misión.
- Sin capturas de pantalla (solo validación automática).
- NO revises el despliegue en vivo; solo haz push a main.
- Al final NO instales en el teléfono (lo haré yo por lotes con el .bat).
```

> Ajusta las reglas si quieres capturas o instalación; por defecto, así es lo más económico.

---

## 🎨 Estándares de UX aprobados (obligatorios en TODA misión nueva)

1. **⚠️ NORMATIVA DE COLORES POR MATERIA (obligatoria e inviolable)**: el
   maestro debe saber de qué materia es el examen CON SOLO VER EL COLOR.
   Códigos oficiales únicos (auditados y normalizados en las 28 misiones el
   11 jul 2026: se corrigieron 10 misiones desviadas que usaban morado,
   rosa, turquesa, naranja…):

   | Materia | Acento (títulos, líneas, «Obtenido», números) | Fondo claro (franjas, cajas) |
   |---|---|---|
   | **Español** | `#c49000` (dorado / amarillo oscuro) | `#fef9e7` |
   | **Matemáticas** | `#1565c0` (azul) | `#e3f2fd` (+ borde pauta `#cce0ff`) |
   | **Ciencias Naturales** | `#27ae60` (verde) | `#e8f8f5` |
   | **Ciencias Sociales** | `#c0392b` (rojo) | `#fbe9e7` |
   | **Robótica y Programación** | `#0e7490` (cian) | `#ecfeff` |
   | **Inglés** | `#be185d` (rosa) | `#fff1f5` |

   Reglas duras:
   - Aplica a TODOS los documentos imprimibles: `printEval` (evaluación
     conceptual), `printEvalOp` (prueba operativa) y `printEvalCrit`
     (pensamiento crítico). Un solo acento por documento, sin variantes
     oscuras ni paletas "del tema de la misión".
   - Las respuestas de la pauta (clase `.pa`) van SIEMPRE en verde `#007a00`
     ("respuesta correcta"), independiente de la materia.
   - PROHIBIDO inventar paletas por misión en los imprimibles: nada de
     morados, rosas, turquesas o naranjas aunque la misión los use en
     pantalla. El ROJO es exclusivo de Sociales: nada de acentos rojos en
     mate, tampoco al imprimir.
   - Al crear una misión nueva, copiar la paleta EXACTA de la tabla según la
     materia declarada en el encabezado de la evaluación.

1-bis. **⚠️ NORMATIVA DE REDACCIÓN: SIN GUIONES LARGOS (obligatoria, jul 2026)**:
   ningún texto del proyecto lleva guion largo (`—`). Tampoco el guion medio como
   signo de puntuación. Aplica a **todo**: pantallas de la misión, flashcards,
   quizzes, retos, bancos de evaluación, textos de la pauta, fichas didácticas
   imprimibles, guías y manuales.

   - **Por qué:** el guion largo se lee como firma de texto escrito por IA. El
     proyecto declara cuándo hay IA en el proceso, pero la redacción debe leerse
     como la de una persona: lo leen colegas y académicos, y la forma no debe
     invitar a descartar el contenido.
   - **Con qué se sustituye,** según lo que pida la frase: **dos puntos** cuando
     lo que sigue explica («no fue una insurrección sofocada: fue un
     exterminio»); **paréntesis** cuando la raya abría y cerraba una aclaración
     («las condiciones materiales (económicas, biológicas) que…»); **coma** en las
     aposiciones; **punto y seguido** cuando son dos ideas.
   - Si el paréntesis cae dentro de otro paréntesis, se usan **corchetes**
     (criterio de la RAE) o comas. Nunca paréntesis anidados.
   - **Sí se conserva el guion medio (`–`) en rangos numéricos**: «0–5 min»,
     «1821–2025», «Formas 1–30». Eso es tipografía normal.
   - ⚠️ **Al corregir una misión ya traducida, cambiar los DOS lados a la vez.**
     El diccionario de frases de `js/metas-i18n.js` usa el texto español exacto
     como clave (por ejemplo `'🃏 Flashcards — Toca para voltear'`). Si se corrige
     la misión y no la clave (o al revés), ese rótulo deja de traducirse y se queda
     en español al pasar la misión a inglés. Después de tocar una misión bilingüe,
     comprobar con el verificador de bancos traducidos.
   - Excepción única: **los títulos citados en bibliografías se reproducen tal
     como se publicaron**, aunque traigan guion largo. Cambiar un título es
     alterar la cita.

1-ter. **⚠️ NORMATIVA DE RESPUESTAS REPARTIDAS (obligatoria, jul 2026)**:
   en los bancos de opción múltiple, **ninguna letra puede concentrar más del
   40%** de las respuestas correctas. Aplica a los tres bancos que el motor
   pinta en **orden fijo** (los widgets no cuentan porque el motor los baraja
   al pintarlos):

   - `qzData` (quiz de comprensión, clave `c`),
   - `evalMCBank` (selección múltiple de la evaluación final, clave `a`),
   - `cmpData` (completa la oración, clave `c`).

   - **Por qué:** si la correcta está casi siempre en la misma letra, el alumno
     aprueba sin leer y la misión deja de medir lo que dice medir. El defecto se
     detectó el 26-jul-2026: **54 de las 57 misiones** tenían al menos un banco
     por encima del 40%, con la «b» dominando en 36 quizzes y casos extremos del
     93% y del 100%.
   - **Cómo se mide:** `node _dev/mide-reparto-respuestas.js` (solo informa;
     `--detalle` lista las 57). Ninguna misión nueva se publica sin pasarlo.
   - **Cómo se escribe un banco nuevo:** repartir a mano las correctas entre a,
     b, c y d mientras se redacta. Es más barato que corregirlo después.
   - ⚠️ **Al reordenar opciones de una misión traducida, mover los DOS lados a
     la vez.** Los bancos del `-en.js` van **índice a índice** con el español: si
     se cambia el orden en uno y no en el otro, la respuesta correcta en inglés
     apunta a otra opción. Después, pasar el verificador de bancos traducidos.
   - ⚠️ **Reordenar cambia las pruebas impresas de aquí en adelante.** Las 30
     formas deterministas se arman del banco, así que la pauta siempre sale
     coherente con lo que se imprime ese día, pero **una pauta ya fotocopiada o
     una clave de ZipGrade ya registrada deja de coincidir**. Igual que con el
     cambio de formas del 23-jul: se corta por fecha y lo ya impreso se termina
     con su pauta vieja.

2. **Predice** (primera impresión, debe encantar): cada predicción lleva su
   explorador interactivo ("🔍 Explorar la pista") que induce a la respuesta
   jugando: medir distancias, animaciones, tocar y descubrir.
3. **Flashcards**: reverso en minúscula PERO con **mayúscula inicial**
   (ortografía: todo texto comienza en mayúscula) y **letra grande sin
   desbordes**. ⚠️ CAUSA RAÍZ del bug histórico: NUNCA usar `class="fa"` en el
   div del reverso, porque Font Awesome 6 mapea las letras a-z y los dígitos 0-9 a
   ICONOS con forma de MAYÚSCULA e impone su fuente (ninguna regla
   `text-transform` puede arreglarlo porque el glifo mismo es mayúsculo; las
   tildes ú/á delatan el bug al caer a la fuente normal). La clase correcta es
   `fca` y el CSS blindado obligatorio:
   `#fcA{font-family:'Nunito','Fredoka',sans-serif !important;font-weight:600 !important;font-style:normal !important;text-transform:lowercase !important;}`
   (corregido en las 28 misiones el 2026-07-05, commit c8e995f) + el ajuste de
   legibilidad jul-2026 (aplicado a las 28):
   `.fc-back{overflow-y:auto;} #fcA{font-size:1.28rem;line-height:1.5;} #fcA::first-letter{text-transform:uppercase !important;}`
4. **Clasifica**: seleccionar y colocar (SIN arrastre). Si hay un elemento
   seleccionado y se toca uno ya colocado, se INSERTA el seleccionado en esa
   caja (no se saca el tocado); solo sin selección el toque devuelve al banco.
5. **Reto final**: botón "🔀 Variar pareja" con varios pools de ejercicios
   (`retoPairs`) + etiqueta `retoPairLbl`; resultados verificados por script.
   En el TEXTO de los ejercicios usar solo caracteres seguros: **"vs"** para
   comparar (NUNCA ⚖ u otros emojis exóticos: en varios teléfonos se ven como
   símbolos rotos/incomprensibles).
6. **Sopa de letras**: palabras en 8 direcciones (incluidas inversas),
   generadas y validadas con script Node; botón "🔦 Linterna (-2 XP)" que
   ilumina 3 s las palabras pendientes y avisa que usarla cuesta puntos.
7. **Tareas**: generadores ALEATORIOS e infinitos (no bancos fijos) con
   instrucción clara por tipo, para que el alumno se autoasigne práctica en
   casa o el docente las copie en el pizarrón. Tipos probados: ubicar en la
   recta / operaciones en columna / problemas con ruta de 4 pasos / número
   escondido ▢ / pirámides numéricas / pensamiento matemático (adaptar al tema).
8. **Prueba operativa**: ejercicios tipo olimpiada matemática (problemas
   breves, cadenas de operaciones, número escondido, pirámides…); el examen
   cabe en UNA página y la pauta va en la siguiente (`page-break-before`).
   En rectas o figuras impresas, las marcas sin número llevan "•" (nunca
   espacios en blanco).
9. **Pautas de todas las pruebas**: letra grande (tablas ≈11pt, título ≈13pt)
   para docentes con problemas de vista; solo se amplía la pauta, el examen no.
   ⚠️ **NORMATIVA DE IMPRESIÓN DE EVALUACIÓN (jul 2026, obligatoria, misma
   jerarquía que la regla de colores)**: al imprimir `printEval()` el documento
   sale SIEMPRE en exactamente **2 páginas carta**: página 1 = examen del alumno,
   página 2 = pauta del docente (con clave ZipGrade). Nunca 3 ni 4 páginas,
   sin importar cuánto contenido tenga la evaluación. Se logra con el
   **auto-ajuste de escala** incluido en el documento impreso: el examen vive en
   `<div id="evalPage">` y la pauta en `#pautaPage`; un script hace búsqueda
   binaria del mayor `zoom` cuya altura quepa en la página (252mm útiles):
   si el contenido es poco AGRANDA la letra hasta llenar la hoja (máx 1.45×);
   si es mucho la REDUCE hasta que quepa (mín 0.55×). Requisitos técnicos que
   NO deben romperse al crear/editar misiones:
   - `body{width:201.9mm;margin:0 auto;}` (ancho imprimible carta con márgenes
     mínimos; hace que la medición en pantalla coincida con la impresión).
   - `@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}`
     (impresión: carta, 100 %, márgenes mínimos).
   - Usar SOLO `zoom` para escalar (Chrome reajusta las líneas al ancho
     completo automáticamente y lo respeta al imprimir). PROHIBIDO
     `transform:scale` (la impresión lo ignora para paginar) y PROHIBIDO
     compensar con `width:(100/z)%` (la medición miente y desborda).
   - La búsqueda debe ser BINARIA, no multiplicativa: la altura salta de golpe
     en los reacomodos de línea y una iteración proporcional oscila sin converger.
   - Probar con el harness (Node extrae `printEval()`, la ejecuta con datos
     cortos Y largos, Chrome headless imprime a PDF y se cuentan las páginas:
     deben ser exactamente 2 en ambos casos).
9-bis. **⚠️ NORMATIVA DE FORMAS DETERMINISTAS · «bucle exacto» (jul 2026,
   obligatoria en TODA prueba imprimible)**: hay **30 formas** (`EVAL_FORMAS = 30`)
   y la **Forma N genera SIEMPRE exactamente el mismo examen y la misma pauta**,
   en cualquier navegador y aunque se cierre el programa. Caso de uso que la
   motiva: el docente imprimió la Forma 15, perdió la pauta o se fue la luz:
   al volver a la misión elige «Forma 15» en el selector y obtiene tal cual
   el examen y la pauta que repartió. Piezas del estándar (bloque «Formas
   deterministas v1» antes de `genEval`):
   - `_evalRng(forma)`: PRNG **mulberry32** sembrado con el número de forma
     (aritmética entera exacta → misma secuencia en todo motor JS).
   - `_shuffleF(arr, rng)` (**Fisher-Yates**) y `_pickF(arr, n, rng)`.
     🚫 PROHIBIDO barajar con `sort(() => rng() - 0.5)`: el resultado depende
     del motor del navegador y rompe el bucle exacto.
   - `_injectFormaSel(fnName, selId, actual, onPick)`: selector visible
     «📋 Forma N» junto al botón de generar, para pedir una forma EXACTA.
   - Semillas por tipo de prueba: conceptual `_evalRng(cf)` · operativa
     `_evalRng(100000 + cf)` con `_opRnd` · pensamiento crítico
     `_evalRng(200000 + cf)`, así la Forma 5 conceptual ≠ Forma 5 operativa.
   - **Forma R (adaptada, piloto en división-decimales)**: semillas reservadas
     conceptual-R `_evalRng(300000 + cf)` · operativa/crítico-R
     `_evalRng(400000 + cf)`. Misma competencia y mismos 100 pts con menos
     ítems y apoyos (banco de palabras, ejemplo resuelto, planteo armado,
     letra 13pt, sin olimpiada ni selección múltiple). La activa el docente
     con la casilla «♿ Forma R» (estado `evalReducida` persistido); al
     registro y a la nube la forma viaja como `100 + N` (entero, sin tocar
     SQL) y se muestra como «R-N». La pauta R agrega el bloque «Apoyos
     aplicados» con casillas; el pie imprime «Forma R-N».
   - Ciclo: `evalFormNum = (evalFormNum % EVAL_FORMAS) + 1` (ídem
     `evalOpFormNum`, `evalCritFormNum`).
   - El orden de consumo del rng dentro del generador es parte del contrato:
     NO reordenar secciones sin asumir que cambian todas las formas. Editar
     los BANCOS de preguntas también cambia el contenido de las formas.
   - Lo que NO se siembra: memorama, clasificador, reto, sopa y tareas
     autogeneradas siguen con `Math.random` (la variedad ahí es deseable).
   - Prueba obligatoria (harness `test-determinismo.js`): misma forma en dos
     ejecuciones independientes → JSON idéntico; formas distintas → distinto;
     tras la Forma 30 sigue la 1.
10. **Juego de memoria (memorama)**: OBLIGATORIO en la sección Flashcards, como
    segunda tarjeta. Parejas concepto↔pista/ejemplo (6 pares), +1 XP por pareja
    (primera vez) y +2 XP al completar, con confeti. Copiar el patrón `memoPairs`
    / `buildMemo` / `flipMemo` + CSS `.memo-*` de la misión id 28.
11. **Evaluación conceptual TAMBIÉN interactiva**: además de imprimir, debe
    poder resolverse EN LÍNEA y calificarse igual que la operativa: inputs de
    texto en Completar (con lista `acc` de respuestas aceptadas y normalización
    sin tildes), radios con `value` en V/F y Selección, `<select>` de letras en
    Pareados, botón "🧮 Calificar prueba" (`gradeEval()`) y panel de resultado
    /100 con desglose. Referencia: misión id 28.
12. **Juegos lúdicos en TODAS las secciones**: cada sección debe sentirse como
    juego (exploradores en Predice, mini-quiz en cada bloque de Aprende,
    widgets con racha/puntaje/confeti, memorama, reto contra reloj, sopa con
    linterna). El estudiante debe sentir "placer de aprender": feedback
    inmediato, animaciones y recompensas visibles.
13. **Contraste legible en los feedback y el memorama** (ajuste jul-2026,
    aplicado a las 28): NUNCA texto jade sobre fondo jade translúcido. El
    feedback correcto usa verde oscuro `#075e44` (claro) / `#7dedc9` (oscuro)
    y el incorrecto rojo oscuro `#8f1d1d` / `#ffb3b3`, en `.predice-fb` y
    `.mq-fb`, con `font-weight:700`. El memorama lleva reverso con fondo
    SÓLIDO: pista en `#fff` con texto `#1b2838` a `0.9rem`, término en blanco
    sobre azul `#1565c0`, y pareja lograda en `#d9f5ec` con `#075e44`
    (overrides `[data-theme="dark"]` incluidos). El bloque estándar está al
    final de cualquier CSS parchado bajo el marcador
    «Ajustes de legibilidad jul-2026».

> Implementación de referencia completa: `misiones/2ciclo-multiplos-divisores-primos/`
> (id 28, incluye TODOS los estándares 1-12). La id 27 (recta numérica) es la
> referencia anterior y NO trae memorama ni evaluación conceptual calificable.

---

## 🔁 Qué hace el asistente (pasos internos)

1. **Carpeta**: `misiones/2y3ciclo-<slug-del-tema>/` con `js/` y `css/`.
2. **Copiar assets** desde `misiones/2ciclo-recta-numerica/`: `html2canvas.min.js`
   y el `.css` (ya incluye los estilos de los estándares: clasifica por selección,
   linterna de sopa, exploradores de predice, rectas y pirámides).
3. **Re-tematizar CSS** (solo 4-5 ediciones): `--bg`, `--border`, `--pri`, `--sec`,
   los dos overrides de `--pri-gl/--sec-gl` en modo oscuro, el gradiente del `.hero`
   y la marquesina `.hero::before`.
4. **Escribir el JS** (`<slug>.js`): misma lógica; solo cambian los **bancos de datos**
   (fcData, qzData, classGroups, idData, cmpData, widgets, retoPairs, sopaSets, eval*,
   task*, crit*, parteData del Lab) + títulos, niveles, logros y `SAVE_KEY`.
5. **Escribir el HTML** (`<slug>.html`): mismas 13 secciones e IDs; solo cambia el
   contenido de Aprende / Tipos / Lab y los textos visibles. **Los IDs y las funciones
   onclick NO se cambian** (el JS depende de ellos). Incluir SIEMPRE, después de los
   scripts propios de la misión:
   `<script src="../../js/metas-registro.js"></script>`
   (capa de registro local de evidencia: sesiones, secciones y notas de gradeEval /
   gradeEvalOp quedan en localStorage y el docente las exporta desde `registro.html`.
   No requiere ningún cambio en el JS de la misión: se engancha solo a las funciones
   estándar `fin`, `gradeEval` y `gradeEvalOp`, y lee la nota del panel
   `#evalAutoResult` / `#evalOpAutoResult`, por eso el texto "Resultado: X/100 pts"
   de esos paneles NO debe cambiar de formato. Además inyecta solo: el modal de
   identificación del alumno (nombre/código + grado + código del maestro, 1 sola vez
   por dispositivo) y los botones "📤 Enviar resultados" y "👤 Cambiar alumno"
   (para dispositivos compartidos) dentro de `.diploma-actions` de la constancia:
   por eso ese div y el input `.diploma-input` deben conservar sus clases estándar).
   E inmediatamente antes de esa línea, incluir también:
   `<script src="../../js/metas-presentacion.js"></script>`
   (accesibilidad de aula compartida: letra grande predeterminada (el botón
   "🔎 Letra" la vuelve pequeña), botón "📽️ Presentación" con proporciones para
   proyector + escala A−/A+, y modo 📖 Libro por tarjetas. Se engancha solo: usa
   `.cred-tools` del pie, `.main`, las secciones `.sec` con tarjetas `.card` hijas
   directas y la función `go()`, por eso esas clases y esa función deben conservar
   sus nombres estándar).
6. **Registrar** en `js/data/misiones.js` con el **siguiente id libre** (revisar el
   archivo; NO asumir count+1) y con su **Ruta de Aprendizaje**: campos `ruta`
   (numero | forma | palabra | planeta | cuerpo) y `etapa` (posición en la
   secuencia de esa ruta). El alumno nunca ve "Ciclo/Grado": eso queda solo como
   metadato docente en `grade`/`cycle` y en los encabezados imprimibles de las
   evaluaciones. Integración completa con las 3 fases de rutas:
   - **Badge del héroe** de la misión: `EMOJI-RUTA Ruta … · Etapa n de N · Materia`
     (ej. `🧭 Ruta del Número · Etapa 4 de 8 · Matemática`; la etapa 0 se escribe
     "Punto de partida"). Emojis de ruta: 🧭 Número, 📐 Forma, ✍️ Palabra,
     🌎 Planeta, 🧠 Cuerpo.
   - Si la misión se inserta **entre** etapas existentes, renumerar `etapa` en las
     misiones siguientes de esa ruta y actualizar el "de N" en los badges de TODA
     la ruta (el catálogo y el mapa se actualizan solos porque usan `rutaLabel()`).
   - **Diagnóstico**: añadir 1 pregunta representativa del `evalMCBank` nuevo a
     `js/data/diagnosticos.js` en la ruta correspondiente, con su campo `etapa`,
     manteniendo el orden de básico → avanzado.
   - Si nace una **ruta nueva**, añadirla a `RUTAS` en `js/data/misiones.js` y a
     `RUTAS_ORDEN` en `js/app.js`. (El mapa, "Tu siguiente paso" e insignias no
     necesitan más cambios: todo se deriva de `ruta`/`etapa` y del registro.)
   - **Campeonísimo**: toda misión nueva DEBE alimentar el torneo. El botón
     «🔄 Actualizar banco» del Campeonísimo lee automáticamente el `evalMCBank`
     de las misiones registradas en `js/data/misiones.js` (también soporta
     `QUIZ_QS` con `{q, opts, ans}`), así que basta con que la misión tenga su
     `evalMCBank` estándar. Requisito: mantener el nombre `evalMCBank` y el
     formato `{q, o:[...], a: índice}`. Opcionalmente, copiar 8-9 preguntas
     curadas a `js/data/campeonismo-bank.js` (formato `{q, o, c, mision:
     'Título EXACTO del registro'}`) para que estén disponibles sin pulsar el
     botón; el título debe coincidir con el del catálogo para la cobertura.
7. **Validar** (barato y confiable):
   - `node --check js/<slug>.js`
   - sopas: que cada palabra coincida con su grid
   - que todas las funciones `onclick` e `id` del HTML existan en el JS
8. **Propagar** a `www/`, `android/app/src/main/assets/public/` y
   `android/app/build/intermediates/assets/debug/mergeDebugAssets/public/`
   (la carpeta de la misión + `js/data/misiones.js`).
9. **Commit** en rama nueva → `git checkout main` → `git merge --ff-only` → `git push origin main`.

---

## ✅ Checklist de la misión (13 secciones, "tier completo")

- [ ] Aprende (3 tarjetas: intro + comparativa + mapa de tipos)
- [ ] Sección de detalle (estructura / tabla comparativa / chips)
- [ ] Lab interactivo (4 "partes" × 4 "aspectos")
- [ ] Flashcards (14) · Quiz (9)
- [ ] Clasifica (4 grupos) · Identifica (8) · Completa (8)
- [ ] Widgets (Ordena, Identifica, Empareja, Situación→respuesta)
- [ ] Reto (3 parejas) · Sopa (2 grids válidos)
- [ ] Generador de Tareas (identify/classify/complete/explain)
- [ ] Evaluación Conceptual (TF15/MC15/CP15/PR15) + Pensamiento Crítico (5×20)
- [ ] Constancia + Recursos + footer estándar
- [ ] `<script src="../../js/metas-presentacion.js"></script>` al final del HTML (letra grande predeterminada + modo presentación + modo libro)
- [ ] `<script src="../../js/metas-registro.js"></script>` al final del HTML (registro de evidencia)
- [ ] Registrada en `misiones.js` con id libre · propagada · commit/push a main

---

## 📱 Instalar en el teléfono (hazlo por LOTES, no por misión)

1. Conecta el teléfono por USB con **Depuración USB autorizada**
   (verifica: `adb devices` debe mostrar `device`, no `unauthorized`).
2. Doble clic en **`sincronizar-e-instalar.bat`** (raíz del proyecto)
   o en terminal: `npm run install:android`.
3. Espera **"LISTO: la app se instaló en el teléfono"**.

Notas:
- El `java` del sistema es Java 8 (insuficiente). Ya está fijado el JDK 21 de
  Android Studio en `android/gradle.properties` (`org.gradle.java.home`).
- Si aparece `AccessDeniedException` en `mergeDebugAssets`: borra
  `android/app/build/intermediates/assets` y reintenta.

---

## 🌐 Despliegue web (GitHub Pages)

- El sitio se publica desde `main`:
  https://metas.policastsapien.com/
- Tras el `push` tarda **~1-15 min** (a veces la cola de Pages va lenta).
- Para confirmar sin gastar en la sesión: revisa el sitio tú mismo y **recarga
  forzada** (el service worker es "red primero", así que una recarga normal basta).
- El código correcto se puede verificar en el contenido crudo (no depende del build):
  `raw.githubusercontent.com/.../main/js/data/misiones.js`.

---

## 💸 Consejos para que rindan los tokens

1. **Sesión nueva por misión (o cada 2-3).** Un chat largo re-cobra todo el historial
   en cada mensaje: arrancar fresco es el mayor ahorro.
2. **No revisar el despliegue en vivo dentro de la sesión.**
3. **Sin capturas** salvo que dudes del diseño.
4. **Especificación completa en el primer mensaje** (materia, tema, grado, incluir X).
5. **Instalar en Android por lotes**, no tras cada misión.
6. **Modelo:** para misiones de patrón repetido, `/model` a **Sonnet** (más económico);
   reserva **Opus** para temas difíciles o contenido delicado.
```
