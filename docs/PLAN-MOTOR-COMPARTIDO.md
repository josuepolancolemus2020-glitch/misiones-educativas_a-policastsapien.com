# Plan del motor compartido de misiones

Diagnóstico hecho el 15 de noviembre de 2026 sobre `main` en `b774eda` (v524).
Sesión de solo lectura: no se tocó ningún archivo salvo este informe, no hay
ramas ni commits nuevos. Las sondas rápidas (`npm test`) estaban en verde antes
y después: 69 de 69.

Las cifras de este informe se midieron, no se estimaron. Cómo se midió cada una
está en la sección 8.

---

## 1. Resumen para decidir

1. **`mision.html` está rota desde el 27 de abril de 2026 y nadie la enlaza.**
   Pide `js/motor-misiones.js?v=462` (`mision.html:307`), que no existe en el
   repositorio. Se queda en «Cargando misión...» para siempre.
2. **El motor de `4496fa5` no sirve de base.** Era un cuestionario de 285
   líneas, sin pantallas, sin laboratorio, sin examen por formas. Vivió 21
   minutos. Se recomienda empezar de cero, extrayendo el código que las
   misiones ya comparten.
3. **`mision.html` no está en Latin-1: es UTF-8 válido con el daño ya
   escrito adentro.** Tiene 29 caracteres de reemplazo (U+FFFD) y 6 signos
   `?` donde había ✓, ✗, ⭐ y ⏳. `iconv` no lo arregla; hay que recuperar el
   texto del historial (`57926309`). Otras tres páginas tienen el mismo daño.
4. **El 29,7 % del JavaScript de las misiones es código idéntico copiado**
   (3,49 MB de 11,74 MB), más 85 copias iguales de `html2canvas` (16,9 MB).
5. **El examen conceptual ya da 50 formas distintas en las 85 misiones que
   tienen examen**, con el mismo método y sin tocar los bancos. Las formas 1
   a 30 salen idénticas al subir el tope a 50.
6. **La prueba de pensamiento crítico no llega a 50 en 22 de 53 misiones**, y
   en 18 de ellas ya hay formas repetidas dentro de las 30 de hoy. Ahí chocan
   dos de tus reglas y necesito que decidas (pregunta 1).

---

## 2. Historia del motor

### 2.1 Qué traía `4496fa5` («montar estructura», 27 abr 2026, 10:11)

Cuatro archivos, 789 líneas añadidas:

| archivo | qué era |
|---|---|
| `js/motor-misiones.js` (285 líneas) | El motor |
| `data/misiones_db.json` (210 líneas) | Una sola base con las misiones y sus preguntas |
| `mision.html` (292 líneas) | La página que el motor rellena |
| `js/app.js` (2 líneas) | Las misiones 1 y 2 (Adjetivos y Verbos) pasaban a `mision.html?id=1` y `?id=2` |

El motor hacía esto y nada más:

- Leía `?id=` como número entero y bajaba `data/misiones_db.json` completo.
- Pintaba una tarjeta de encabezado y un cuestionario de opción múltiple, una
  pregunta a la vez: Verificar, Siguiente, Reiniciar, pantalla de resultado.
- Daba +5 XP por acierto la primera vez, sumándolo directo a `meta_v2` (la
  misma llave que usa la portada, `js/app.js:72`) y guardando lo ya premiado
  en una llave propia, `meta_motor_progress_v1`.

No tenía pantallas de Aprende, laboratorio, actividades, sopa, reto, tareas,
diploma, examen imprimible ni formas. El orden de las preguntas era fijo.

### 2.2 Por qué se revirtió (`415c34c`, 10:32, 21 minutos después)

El revert es exacto: borra los tres archivos nuevos y devuelve las dos líneas
de `app.js`. El mensaje no explica el motivo. Lo que se ve en el código:

- Adjetivos y Verbos dejaban de abrir su misión completa y abrían un
  cuestionario de 9 preguntas. Era una pérdida visible para el alumno.
- El motor no leía el progreso propio de cada misión, así que el XP ya ganado
  en esas dos misiones no aparecía.
- La página nacía con `user-scalable=no` y Font Awesome desde un CDN, dos
  cosas que hoy la normativa prohíbe.

### 2.3 Por qué `mision.html` sigue ahí

18 minutos después del revert, `5747647e` («Boton regresar misiones
Educativas») volvió a añadir `mision.html` entera, pero no el motor ni la
base de datos. Desde entonces la página se sella en cada despliegue (está en
la lista del `CLAUDE.md`) y nunca ha funcionado. La auditoría de septiembre ya
lo había anotado y proponía borrarla (`_dev/auditoria-2026-09/4-producto.md:274`).

---

## 3. Estado actual de `mision.html`

### 3.1 Carga un archivo que no existe

- `mision.html:307`: `<script src="js/motor-misiones.js?v=462"></script>`.
- `js/motor-misiones.js` no existe, ni `data/`. Tampoco en `www/`.
- **No pude comprobar el 404 en vivo**: el contenedor no tiene salida a
  `metas.policastsapien.com` (el proxy la rechaza). Como Pages sirve `main` y
  el archivo no está en `main`, el 404 es seguro, y la auditoría de septiembre
  lo midió con `curl`.

### 3.2 La codificación

`file mision.html` dice «UTF-8», y es cierto: el archivo es UTF-8 válido. El
problema es que el daño ya está guardado dentro como texto.

| fecha | commit | qué le pasó |
|---|---|---|
| 2 nov, 00:17 | `57926309` | Última versión sana: UTF-8 con ✓ ✗ ⭐ ⏳ y `──` |
| 2 nov, 01:38 | `5dc321a9` | Se guardó en Windows-1252. Las tildes sobrevivieron; ✓ ✗ ⭐ ⏳ pasaron a `?` y `──` a `--` |
| 3 nov, 01:34 | `c31510cf` | Se leyó ese Windows-1252 como si fuera UTF-8 y se volvió a guardar. Cada tilde, ñ y raya pasó a U+FFFD |

Hoy quedan 29 U+FFFD y 6 `?` de símbolo:

- `mision.html:7` título: «Misi�n � M.E.T.A.S.» (lo ve el maestro en la pestaña).
- `mision.html:172` y `:174`, `:232` y `:234`: el acierto y el error se marcan
  con `'? '` en vez de ✓ y ✗. Rompe la regla 6 (nada dicho solo con color).
- `mision.html:296` «? 0 XP» y `:302` «?» donde iban ⭐ y ⏳.
- `mision.html:303` «Cargando misi�n...».

**Qué hace falta para arreglarlo.** No sirve `iconv`: la información se
perdió. Hay dos caminos y recomiendo el primero.

1. Partir de `git show 57926309:mision.html` (sana) y volver a aplicarle lo
   que cambió después y sí se quiere conservar: los sellos `?v=`, las letras
   alojadas, `letra-maestro.js` y la flecha en SVG. Son 5 cambios pequeños.
2. Corregir a mano los 35 puntos mirando la versión sana.

En los dos casos: guardar en UTF-8 sin BOM con finales de línea LF, y dejar
una sonda que lo vigile (sección 7.2). La causa casi segura es una
herramienta de Windows que reescribe archivos sin declarar UTF-8 (el
repositorio se trabaja desde Windows: `package.json` usa `robocopy`).

**El mismo daño está en otras tres páginas**, con las mismas fechas:
`consulta-nube.html` (107 U+FFFD), `registro.html` (61) y `evaluaciones.html`
(48; por ejemplo `evaluaciones.html:47`, «evaluaci�n imprimible»). Estas sí
las ve el maestro. Quedan fuera de este plan salvo que digas lo contrario
(pregunta 6).

### 3.3 Quién enlaza a `mision.html`

Nadie.

| lugar | resultado |
|---|---|
| `index.html`, `js/app.js` | Ningún enlace. La portada abre cada misión por su `url` (`js/app.js:425`, `:685`, `:1088`, `:1220`, `:1827`, `:2154`) |
| `js/data/misiones.js` | 86 misiones, todas con `url: 'misiones/<carpeta>/<archivo>.html'` (desde `:50`) |
| `js/catalogo-misiones.js` | Añade Prebásica (id 85) y Fracciones heterogéneas (id 150) si faltan; mismas URL directas |
| `sw.js` | No la precachea ni la nombra |
| `www/` | Hay una copia vieja de `mision.html` (v480, distinta de la raíz), también sin motor |
| `_dev/` | Solo menciones en comentarios y en la auditoría |

Borrarla o cambiarla no rompe ningún enlace existente.

---

## 4. Patrones de las misiones

### 4.1 El inventario

- 94 carpetas en `misiones/`. 86 están en el catálogo; las 8 `docente-*` se
  abren desde la zona del maestro.
- 11,74 MB en los 94 archivos principales de JavaScript, 4,18 MB en 94 hojas
  de estilo (40 a 48 KB cada una), y 32,5 MB sumando todo el JS de misiones.

### 4.2 Muestra revisada

| misión | secciones | scripts propios | examen |
|---|---|---|---|
| `2ciclo-recta-numerica` | 18 | principal + 5 `interaccion_*.js` + animación | conceptual + operativa |
| `1ciclo-que-es-la-ia` | 15 | principal + animación; datos en `js/data/ia-*.js` | conceptual + crítica |
| `2y3ciclo-fracciones` | 15 | principal + animación; usa `js/metas-fracciones.js` | conceptual + operativa |
| `2y3ciclo-la-celula` | 14 | principal + animación | conceptual + crítica |
| `3ciclo-ia-generativa` | 15 | principal + animación; datos en `js/data/ia-*.js` | conceptual + crítica |

### 4.3 Piezas que se repiten

Todas siguen la misma plantilla. En `misiones/2y3ciclo-la-celula/js/la-celula.js`:

| pieza | dónde | en cuántas misiones |
|---|---|---|
| Estado, XP, niveles, logros, `SAVE_KEY` | `:13` a `:57` | 84 a 93 |
| Sonido, tema oscuro, letra grande | `:4`, `:20` a `:28` | 93 |
| Navegación entre secciones (`go`, `fin`) | `:56`, `:60` | 93 |
| Tarjetas (`fcData`, `flipCard`) | `:62` a `:83` | 83 |
| Quiz (`qzData`) | `:85` a `:109` | 83 |
| Clasifica, Identifica, Completa | `:111` a `:163` | 83 a 84 |
| Reto contra reloj | `:223` a `:249` | 84 |
| Generador de tareas | `:251` a `:298` | 84 |
| Sopa de letras | `:300` a `:350` | 82 |
| Examen conceptual por formas | `:352` a `:484` | 85 |
| Prueba de pensamiento crítico | `:486` a `:640` | 53 |
| Prueba operativa (Matemáticas y Código) | por ejemplo `recta-numerica.js:1099` | 32 |
| Laboratorio propio | `:642` a `:676` | casi todas, cada uno distinto |
| Diploma con `html2canvas` y WhatsApp | `:678` a `:684` | 84 |
| Compartir la misión | `:2` a `:3` | 85 |

En el HTML se repiten las secciones `s-aprende`, `s-estructura`, `s-lab`,
`s-flash`, `s-quiz`, `s-clasifica`, `s-identifica`, `s-completa`, `s-widgets`,
`s-reto`, `s-sopa`, `s-tareas`, `s-evaluacion`, `s-recursos`, con 82 a 91
`onclick=` por página que llaman a funciones globales.

Lo que ya es compartido (y marca el camino): `estrella-ganada.js`,
`barra-secciones.js`, `teclado-actividades.js`, `animacion-mision.js`,
`videos-mision.js`, `metas-presentacion.js`, `metas-registro.js`. Todos
funcionan envolviendo las funciones globales de la misión sin tocarla.

### 4.4 Código duplicado, medido

- **71 funciones** con el mismo nombre están en 80 misiones o más; 102 en 40 o más.
- **3 487 791 bytes** son cuerpos de función idénticos repetidos: el 29,7 % del
  JS principal. Las que más pesan:

| función | copias idénticas | variantes en total |
|---|---|---|
| `_evalRng` | 84 | 1 |
| `_injectFormaSel` | 80 | 2 |
| `sfx` | 49 | 7 |
| `captureDiploma` | 48 | 6 |
| `setupSopaEvents`, `buildSopa`, `checkSopaSelection` | 48 | 6 a 7 |
| `buildClass`, `showQz`, `showCmp` | 47 | 10 a 16 |
| `gradeEval` | 44 | 17 |
| `printEval` | 40 | 24 |
| `saveProgress`, `loadProgress` | 41 | 12 y 15 |
| `genEval` | 11 | 72 |
| `openDiploma` | 4 | 82 |

  `genEval` y `openDiploma` tienen casi una variante por misión porque llevan
  el título escrito dentro; la lógica es la misma.
- **`html2canvas.min.js`: 85 copias byte a byte iguales, 16,9 MB**, además de
  la que ya está en `js/html2canvas.min.js`.

### 4.5 Qué guarda cada misión

- Una llave propia `SAVE_KEY` (92 misiones, ninguna repetida; por ejemplo
  `la_celula_v1`) con `{doneSections, unlockedAch, evalFormNum, evalCritFormNum, xp}`
  (`la-celula.js:31`).
- `SAVE_KEY + '_theme'` y `preferenciaLetra`.
- `mate-fracciones-heterogeneas` y `prebasica-tecnicas-libro1` usan su propio esquema.

---

## 5. Exámenes: cómo funcionan hoy y cuántas formas dan

### 5.1 El método actual

En `la-celula.js:420` a `:432`:

- `EVAL_FORMAS = 30`.
- `_evalRng(forma)`: generador sembrado con `forma * 2654435761 + 909090909`.
  **El mismo, byte a byte, en las 84 misiones que lo tienen.**
- `_pickF(banco, 5, rng)`: baraja el banco (Fisher-Yates) y toma 5.
- `genEval` (`:449`) saca en este orden: Completar, V/F, Selección, Pareados
  (y vuelve a barajar las definiciones de los pareados). 20 preguntas, 100 puntos.
- La crítica siembra con `_evalRng(200000 + forma)`; la operativa con
  `_evalRng(100000 + forma)`.

Las opciones de selección múltiple llevan la letra escrita en el texto
(`'a) El telescopio'`, `la-celula.js:383`) en al menos 66 misiones. Hoy el
orden de las opciones **no** cambia entre formas: la letra correcta de cada
pregunta es siempre la misma.

Excepciones:

| caso | misiones | diferencia |
|---|---|---|
| Fin de grado | 4 | `EVAL_FORMAS = 20`, dos materias, siembra `M.semilla + cf` (`fin-de-grado-6to.js:1205`, `:1274`) |
| Fracciones heterogéneas | 1 | Generador propio `crearPRNG` y la primera forma se elige con `Math.random` (`mision.js:1893`, `:1902`); sí baraja las opciones |
| Docentes y Prebásica | 9 | No tienen examen por formas |

### 5.2 Medición: formas 1 a 50

Cargué cada misión en Node, generé las formas con el código actual, subí el
tope a 50 y volví a generar.

**Examen conceptual (85 misiones):**

| comprobación | resultado |
|---|---|
| Formas 1 a 30 idénticas con el tope en 50 | 85 de 85 |
| Mismo número de forma da el mismo examen dos veces | 85 de 85 |
| Conjuntos de preguntas distintos entre las 50 | **50 de 50 en las 85** |

Los bancos son de 10 por tipo en casi todas (15 en Himno y Aspectos cívicos,
12 en Próceres, 12/10/11/14 en Inglés números). Con 10 y sacando 5 hay 252
combinaciones por sección y unos 4 000 millones por examen. **Ninguna misión
necesita más preguntas para llegar a 50 formas conceptuales distintas.**

**Prueba operativa (32 misiones):** 50 distintas en las 32 y 1 a 30 idénticas.
Los datos numéricos ya se generan con la semilla.

**Fin de grado (4):** Español, Matemáticas y operativa dan 50 distintas; las
formas 1 a 20 quedan idénticas. Aquí las «nuevas» serían de la 21 a la 50.

**Prueba de pensamiento crítico (53 misiones):** 31 llegan a 50 distintas; 22 no.

| misión | distintas en 1 a 30 | distintas en 1 a 50 | conjuntos posibles con su banco |
|---|---|---|---|
| `2y3ciclo-robots-problemas` | 8 | 8 | 4 |
| `3ciclo-peligros-ia` | 18 | 20 | 2 |
| `2ciclo-como-aprende-una-maquina` | 24 | 31 | 4 |
| `3ciclo-albores-singularidad` | 24 | 31 | 4 |
| `3ciclo-escenarios-porvenir` | 24 | 31 | 4 |
| `3ciclo-ia-generativa` | 24 | 31 | 4 |
| `2y3ciclo-programando-robot` | 23 | 35 | 48 |
| `basica-de-que-esta-hecho-el-mundo` | 27 | 37 | 8 |
| `2y3ciclo-electricidad-robots` | 26 | 40 | 64 |
| `basica-como-se-que-se` | 28 | 42 | 10 |
| `basica-palabras-que-piensan` | 28 | 42 | 10 |
| `2y3ciclo-historia-ia` | 29 | 43 | 12 |
| `2y3ciclo-mayas-precolombinas` | 29 | 46 | 24 |
| `2y3ciclo-la-materia` | 29 | 47 | 54 |
| `2y3ciclo-la-energia` | 30 | 48 | 75 |
| `2y3ciclo-constitucion` | 29 | 49 | 80 |
| `2y3ciclo-ecosistemas` | 30 | 49 | 180 |
| `2y3ciclo-la-celula` | 30 | 49 | 120 |
| `2y3ciclo-motores-mecanismos` | 29 | 49 | 360 |
| `2y3ciclo-sensores-robot` | 30 | 49 | 240 |
| `basica-el-asombro` | 29 | 49 | 90 |
| `basica-pensar-con-orden` | 29 | 49 | 180 |

«Distintas» aquí compara la forma entera (preguntas y orden). La última
columna es el producto de combinaciones de cada banco, sin contar el orden.

Lectura:

- Las primeras 13 filas tienen bancos demasiado chicos (1 o 2 casos por tipo).
  En las cuatro de IA solo existen 4 conjuntos posibles: las 24 formas
  «distintas» de hoy son las mismas preguntas en otro orden. **Estas necesitan
  más casos o variantes sí o sí.**
- Las últimas 9 tienen banco suficiente y solo chocan una a tres veces por
  azar. Se arreglan sin escribir contenido (sección 6.4).
- En las 31 que sí dan 50 formas distintas no comprobé que los *conjuntos* de
  preguntas (sin contar el orden) sean distintos. Esa comprobación va en la
  sonda nueva.

---

## 6. Propuesta de motor

### 6.1 ¿Rescatar `4496fa5` o empezar de cero?

**Empezar de cero.** Razones:

1. Cubre una pieza de quince (el quiz) y ni siquiera la del examen.
2. Identifica misiones por número y las mete todas en un solo JSON: bajar una
   misión obligaría a bajar las 94.
3. Suma XP directo a `meta_v2` con una llave de progreso nueva. Usarlo
   rompería la regla de conservar el progreso guardado.
4. Sin semilla, sin formas, sin impresión.
5. Inserta texto con `innerHTML` sin escapar.

Lo único rescatable es la idea (una página, datos aparte) y los nombres de
clase de `mision.html`. El código bueno ya existe: está copiado entre 40 y 84
veces dentro de las misiones. El motor se construye **extrayéndolo**, no
inventándolo.

### 6.2 Qué hace `js/motor-misiones.js`

Un solo objeto global, `MotorMisiones`, en módulos pequeños. Sin framework ni
compilación.

```js
MotorMisiones.iniciar({ slug, contenido, raiz })   // arranca una misión
MotorMisiones.estado      // XP, niveles, logros, secciones hechas (lee y escribe la SAVE_KEY de siempre)
MotorMisiones.nav         // go(), fin(), barra de secciones
MotorMisiones.actividades // tarjetas, quiz, clasifica, identifica, completa, reto, sopa, tareas
MotorMisiones.examen      // rng(forma), elegir(), generar(tipo, forma), imprimir(), calificar()
MotorMisiones.diploma     // abrir, capturar (una sola copia de html2canvas, bajo demanda)
MotorMisiones.registrarLaboratorio(id, { montar(el, api), desmontar() })
```

Reglas de diseño:

- **El generador v1 queda congelado.** `examen.rng` es `_evalRng` copiado tal
  cual, con sus constantes, y el orden de extracción (Completar, V/F,
  Selección, Pareados, barajar definiciones) no se cambia nunca. Va con un
  comentario que dice por qué: hay claves de ZipGrade impresas.
- **Compatibilidad con los `onclick`.** En la primera fase el motor publica
  las funciones globales de siempre (`go`, `genEval`, `flipCard`...), así el
  HTML de la misión no cambia y los envoltorios (`estrella-ganada.js`,
  `barra-secciones.js`, `teclado-actividades.js`) siguen funcionando.
- **Laboratorios y simulaciones** siguen siendo archivos propios de la misión
  (`interaccion_*.js`, `animacion-*.js`). El motor los carga bajo demanda la
  primera vez que se abre su sección.
- **Sin pensar en modo sin internet**: se piden por red cuando hacen falta.

### 6.3 Formato de `misiones/<carpeta>/contenido.json`

```json
{
  "slug": "la-celula",
  "claveGuardado": "la_celula_v1",
  "titulo": "La Célula",
  "materia": "cnat",
  "xpMaximo": 200,
  "niveles": [{ "desde": 0, "nombre": "Aprendiz 🌱" }],
  "logros": { "primera_tarjeta": { "icono": "🃏", "texto": "..." } },
  "secciones": [
    { "id": "s-aprende", "tipo": "lectura" },
    { "id": "s-lab", "tipo": "laboratorio", "script": "js/lab-celula.js" },
    { "id": "s-flash", "tipo": "tarjetas", "datos": "tarjetas" },
    { "id": "s-evaluacion", "tipo": "examen" }
  ],
  "tarjetas": [{ "w": "Núcleo", "d": "..." }],
  "examen": {
    "metodo": 1,
    "formas": 50,
    "conceptual": {
      "orden": ["cp", "tf", "mc", "pr"],
      "porSeccion": 5,
      "bancos": {
        "tf": [{ "id": "tf-hooke", "q": "...", "a": true, "fuente": "s-aprende" }],
        "mc": [{ "id": "mc-microscopio", "q": "...", "o": ["a) ...", "b) ..."], "a": 1, "fuente": "s-aprende" }]
      }
    },
    "critica": { "semilla": 200000, "bancos": {} }
  }
}
```

- `claveGuardado` es la `SAVE_KEY` actual, sin cambios: el progreso se conserva.
- El **orden de cada banco es el orden actual del arreglo**. Si se reordena,
  cambian las formas 1 a 30. Las preguntas nuevas van siempre al final, y
  aun así una pregunta añadida a un banco cambia las formas viejas (ver 6.4).
- `fuente` nombra la sección de la misión donde se enseña ese dato. Es lo que
  permite comprobar que la pregunta no se sale de la misión.
- En la primera fase el texto de las pantallas se queda en el HTML. Pasarlo al
  JSON es una fase posterior y opcional.

### 6.4 Pregunta con variantes y formas 31 a 50

Barajar un banco con la misma semilla da un resultado distinto si el banco
cambia de tamaño. Por eso **no se puede añadir una pregunta a un banco sin
alterar las formas 1 a 30**. La solución es separar dos conjuntos:

```json
{
  "id": "mc-micrometros",
  "q": "¿En qué unidad se mide el tamaño de una célula?",
  "o": ["a) En metros", "b) En micrómetros", "c) En kilogramos", "d) En litros"],
  "a": 1,
  "fuente": "s-aprende",
  "variantes": [
    { "q": "El tamaño de una célula se mide en...", "o": ["En kilómetros", "En micrómetros", "En gramos", "En mililitros"], "a": 1 },
    { "q": "Una célula mide unos {n} {unidad}. ¿Qué unidad es esa?", "datos": [{ "n": 10, "unidad": "micrómetros" }, { "n": 30, "unidad": "micrómetros" }], "o": ["..."], "a": 0 }
  ]
}
```

y, aparte, un banco que solo ven las formas nuevas:

```json
"bancosNuevos": { "mc": [{ "id": "mc-pared", "q": "...", "desdeForma": 31 }] }
```

Cómo se arma cada forma:

| formas | selección de preguntas | texto de la pregunta | orden de opciones |
|---|---|---|---|
| 1 a 30 | generador v1 sobre el banco original | el original (`q`, `o`) | el original |
| 31 a 50 | generador v1 sobre el banco original + `bancosNuevos` | una variante elegida con un segundo generador (`rng(500000 + forma)`) | barajado con ese segundo generador |

El segundo generador es independiente, así la selección sigue «el mismo
método» y lo nuevo (variantes, datos, orden de opciones) no desordena nada.
Para barajar opciones hay que guardar las opciones nuevas sin la letra
escrita y dejar que el motor ponga `a)`, `b)`... Al barajar se respeta la
regla 11: ninguna letra correcta por encima del 40 % en la forma.

Si una forma nueva repite el conjunto de preguntas de otra anterior, el motor
no la arregla en silencio: la sonda falla y se corrige el banco. Así cada
forma publicada queda fija para siempre.

Para la prueba crítica, las 13 misiones con banco chico necesitan casos
nuevos (en `bancosNuevos`) o variantes de dato; las otras 9 se resuelven con
el segundo generador.

### 6.5 Plan por fases

Todo en una rama aparte, con sondas en verde, sin merge a `main` hasta tu visto bueno.

**Fase 0. Red de seguridad (no cambia nada para el maestro).**
- Generar los «exámenes de oro»: por cada misión y cada prueba, las formas 1 a
  30 (1 a 20 en fin de grado) tal como salen hoy, con el dato y el documento
  impreso. Se guardan en `_dev/formas-oro/<slug>.json`.
- Sondas nuevas de la sección 7.2.
- Sonda de codificación.

**Fase 1. `mision.html` vuelve a funcionar.**
- Recuperar el texto sano (sección 3.2).
- `js/motor-misiones.js` mínimo: lee `?m=<slug>`, busca la misión en
  `MISSIONS` y la abre; sin parámetro o con uno desconocido, muestra un
  mensaje claro y el botón de volver. Nada de «Cargando» eterno.
- Ninguna misión cambia. Sellar versión.

**Fase 2. Extraer sin migrar.**
- Sacar al motor las funciones idénticas (examen, sopa, diploma, sonido, XP),
  empezando por `_evalRng`, `_pickF`, `_injectFormaSel` (84 copias iguales).
- Una sola copia de `html2canvas`.
- Las misiones siguen con su HTML y su JS; todavía no usan el motor.

**Fase 3. UNA misión piloto.**
- Propongo `2y3ciclo-la-celula`: plantilla estándar, laboratorio sencillo,
  conceptual y crítica, sin datos externos.
- Se crea su `contenido.json`; su HTML conserva **la misma URL** (el QR
  impreso y la ficha siguen valiendo) y pasa a cargar el motor en vez de
  `la-celula.js`. La `SAVE_KEY` no cambia.
- Criterio de salida: formas 1 a 30 idénticas al oro, mismo XP y mismas
  estrellas con un `localStorage` de antes, misma pantalla (comparación de
  capturas), impresión en una hoja carta.

**Fase 4. Formas 31 a 50 en el piloto**, con variantes, y revisión tuya del papel.

**Fase 5. Migración por tandas** de misiones con la misma plantilla (las 42
con 13 secciones primero), siempre con el oro como juez. Fin de grado,
Fracciones heterogéneas, Docentes y Prebásica van al final o se quedan como están.

### 6.6 Riesgos

| riesgo | por qué | qué se hace |
|---|---|---|
| **Caché del service worker** | `sw.js` guarda en `CACHE_DATOS` todo lo visitado y lo sirve si la red tarda más de 3 s (`sw.js:20`, `PLAZO_RED`). Un teléfono puede mezclar HTML nuevo con JS viejo de la misión | Como ya no se promete uso sin internet: service worker mínimo (instalar y armazón, sin guardar contenido). El `contenido.json` y el motor se piden siempre con `?v=`. Decidir qué pasa con lo ya guardado en `CACHE_DATOS` (pregunta 5) |
| **Sellado** | El motor y los JSON son archivos nuevos que hay que sellar | Añadirlos a la lista del `CLAUDE.md` y a la sonda de sellado |
| **Capacitor y `www/`** | `www/` está en v480, tiene 57 misiones de 94 y su propia `mision.html` vieja. No se edita a mano | No tocarla en la rama. Tras el merge, `npm run sync` desde Windows. El motor usa rutas relativas y `fetch` de JSON local, que en Capacitor funciona |
| **`localStorage`** | 92 llaves `SAVE_KEY` con XP, estrellas y número de forma | El motor lee y escribe la misma llave con la misma forma del objeto. Sonda con un guardado real de antes. Nunca se migra ni se renombra |
| **Envoltorios** | `estrella-ganada.js` y otros envuelven `fin`, `go`, etc. | El motor publica esas globales antes de `DOMContentLoaded`, en el mismo orden de carga |
| **Claves impresas** | Un banco reordenado cambia todas las formas | Oro en `_dev/formas-oro/`, sonda en `npm test` |
| **Codificación** | Ya dañó 4 páginas | Sonda de codificación y `.editorconfig` con `charset = utf-8` |
| **Bilingües** | 8 misiones con `-en.js` y `metas-i18n.js` | El piloto no es bilingüe. El formato reserva `contenido.en.json` |

---

## 7. Pruebas

### 7.1 Lo que hay hoy

- `npm test` corre `_dev/corre-sondas.js`: 69 sondas rápidas que solo leen
  archivos. **Hoy: 69 en verde.**
- `npm run test:navegador`: las de Playwright, con su propio servidor. No las
  corrí en esta sesión.
- El CI (`.github/workflows/sondas.yml`) corre las rápidas en cada push.
- 118 archivos `verifica-*`, `prueba-*` y `test-*` en `_dev/`. Las que tocan
  al motor:

| sonda | qué mira |
|---|---|
| `test-determinismo-<misión>.js` (17) | Misma forma, mismo examen; tras la 30 vuelve la 1. Solo cubren 17 misiones |
| `verifica-examen-sin-pistas.js` | Ninguna pregunta regala la respuesta de otra |
| `mide-reparto-respuestas.js` | Ninguna letra correcta sobre el 40 % |
| `verifica-fin-de-grado.js`, `verifica-fin-de-grado-respuestas.js` | Examen de fin de grado |
| `verifica-mision-navegador.js`, `verifica-mision-nueva.js` | La misión abre; ficha, QR y enlaces |
| `verifica-estrella-ganada.js`, `verifica-barra-xp.js`, `verifica-barra-secciones.js` | XP y estrellas |
| `verifica-service-worker.js`, `verifica-cdn-fuera.js`, `verifica-sintaxis.js` | Infraestructura |

Ninguna compara hoy una forma con su versión anterior: un cambio que altere
la Forma 7 de una misión pasaría en verde.

### 7.2 Sondas que propongo

1. **`verifica-formas-oro.js`** (rápida, en `npm test`). La que pediste. Por
   cada misión con examen y cada prueba:
   - Genera las formas 1 a 50 con el código vigente.
   - **Formas 1 a 30 idénticas al oro** (dato completo y documento impreso).
     En fin de grado, 1 a 20.
   - **Ninguna forma repite el conjunto de preguntas de otra** (se compara el
     conjunto de `id`, sin orden) ni es idéntica a otra.
   - **Toda pregunta pertenece al banco de su misión**: cada `id` existe en su
     `contenido.json`, ningún `id` aparece en dos misiones, y su `fuente`
     apunta a una sección que existe en el HTML de esa misión.
   - Las variantes de una pregunta comparten `id` y `fuente` con la original.
   - Cuando falla dice misión, prueba y número de forma.
2. **`genera-formas-oro.js`** (a mano, una vez). Escribe el oro. Si el oro ya
   existe se niega a sobrescribirlo sin una bandera explícita.
3. **`verifica-codificacion.js`** (rápida). Ningún archivo publicado con
   U+FFFD, BOM o bytes que no sean UTF-8.
4. **`verifica-motor-progreso.js`** (navegador). Siembra un `localStorage`
   real de antes, abre la misión piloto y comprueba mismo XP, mismas estrellas
   y mismo número de forma siguiente.
5. **`verifica-motor-igual.js`** (navegador). Capturas de la misión piloto
   antes y después, sección por sección, y el examen impreso en una hoja carta.
6. **`verifica-mision-html.js`** (rápida). `mision.html` no pide ningún
   archivo que no exista.

Lo que **no** puede comprobar una máquina: que una pregunta trate de verdad
de lo que la misión enseña. El campo `fuente` obliga a declararlo y la sonda
comprueba que la sección exista, pero el juicio sobre el contenido es una
lectura humana, misión por misión, antes de publicar las formas 31 a 50.

---

## 8. Cómo se midió

- Historia: `git fetch --unshallow` (el clon traía 83 commits; ahora 1 363).
  `git show` de `4496fa5`, `415c34c`, `5747647e`, `57926309`, `5dc321a9`, `c31510cf`.
- Formas: cada misión cargada en un `vm` de Node con un DOM de mentira (la
  misma técnica de `_dev/test-determinismo-*.js`), llamando a `genEval`,
  `genEvalCrit` y `genEvalOp` de verdad y leyendo `window._evalPrintData`,
  `_evalCritData` y `_evalOpData`. El tope se subió a 50 reemplazando la
  constante en memoria, sin tocar archivos.
- Duplicados: cuerpo de cada función de nivel superior del JS principal de
  cada misión, normalizando espacios, comparado por huella.
- Los guiones de medición quedaron fuera del repositorio (carpeta temporal de
  la sesión). Conviene que la Fase 0 los rehaga como sondas.

Límites: no hay acceso al sitio en vivo desde este contenedor; no se corrieron
las sondas de navegador; no se leyó el contenido de las preguntas para juzgar
si se salen de su misión.

---

## 9. Preguntas que necesito que decidas

1. **Prueba de pensamiento crítico: ¿también es intocable de la 1 a la 30?**
   En 18 misiones ya hay formas repetidas dentro de las 30 de hoy (Robots y
   problemas tiene solo 8 distintas). No se puede cumplir a la vez «1 a 30
   exactamente iguales» y «ninguna forma repite a otra». Recomiendo: congelar
   solo el examen conceptual y la operativa (los que llevan clave), y permitir
   que la crítica, que se corrige con pauta, se rehaga del todo.
2. **Orden de las opciones en las formas 31 a 50.** Hoy no cambia. ¿Lo
   barajamos solo en las nuevas (recomendado) o lo dejamos fijo para que sea
   literalmente el mismo método?
3. **Fin de grado tiene 20 formas, no 30.** ¿Llevarlo a 50 con 21 a 50 nuevas?
4. **Las 9 sin examen por formas** (8 de docentes y Prebásica) y Fracciones
   heterogéneas, que usa otro generador: ¿quedan fuera del alcance de las 50
   formas? Recomiendo que sí.
5. **Service worker mínimo:** ¿se borra `CACHE_DATOS` de los teléfonos al
   activarse el nuevo, o se deja y solo se deja de usar? Borrarlo evita mezclas
   de versiones; es caché, no datos del maestro, pero el `CLAUDE.md` dice que
   `CACHE_DATOS` no se toca y quiero tu permiso expreso.
6. **Las otras tres páginas con la codificación dañada** (`consulta-nube.html`,
   `registro.html`, `evaluaciones.html`): ¿las arreglo en la misma rama o en
   una aparte antes?
7. **`mision.html` en la Fase 1:** ¿puerta de entrada con `?m=<slug>` como
   propongo, o prefieres borrarla y que el motor solo viva dentro de cada misión?
8. **Misión piloto:** ¿`2y3ciclo-la-celula` te parece bien?
9. **Quién escribe las preguntas y variantes nuevas** de las 13 misiones con
   banco crítico chico: ¿las propongo yo desde el contenido de cada misión
   para que las revises, o las escribes tú?

---

## 10. Decisiones de Josué

Tomadas el 15 de noviembre de 2026, en respuesta a las preguntas de la
sección 9. Mandan sobre cualquier recomendación anterior de este informe.

1. **Pensamiento crítico.** Se congelan solo el examen conceptual y la prueba
   operativa: sus formas 1 a 30 quedan exactamente iguales. La prueba de
   pensamiento crítico se rehace entera.
   **Pendiente obligado:** avisar a los docentes que sus claves impresas de la
   prueba de pensamiento crítico dejan de valer. Afecta a las 53 misiones que
   tienen esa prueba. El aviso tiene que salir antes o junto con la
   publicación, no después.
2. **Orden de las opciones.** Se baraja solo en las formas 31 a 50. En las
   formas 1 a 30 las opciones quedan como están.
3. **Fin de grado.** Se lleva a 50 formas. Las formas 1 a 20 quedan iguales;
   las 21 a 50 son nuevas.
4. **Fuera de alcance.** Las misiones de docentes, Prebásica y Fracciones
   heterogéneas quedan sin 50 formas.
5. **`CACHE_DATOS`.** Solo se deja de usar. No se borra de los teléfonos en
   esta etapa.
6. **Codificación** de `consulta-nube.html`, `registro.html` y
   `evaluaciones.html`: en una rama aparte, antes del motor.
7. **`mision.html`:** puerta de entrada con `?m=<slug>`.
8. **Misión piloto:** `2y3ciclo-la-celula`.
9. **Preguntas nuevas.** No las escribe Claude. La lista de lo que falta por
   misión (cuántos casos o variantes y qué temas cubre ya cada banco) está en
   `docs/FALTANTES-BANCO-CRITICO.md`.

### Qué cambia en el plan con estas decisiones

- **Orden de trabajo:** primero la rama de codificación (decisión 6), después
  la rama del motor con las fases de la sección 6.5.
- **Oro (Fase 0):** se guarda para el examen conceptual y la operativa, y
  para fin de grado de la forma 1 a la 20. La crítica no lleva oro de las
  formas de hoy; su oro se genera cuando el banco nuevo esté aprobado.
- **Sonda `verifica-formas-oro.js`:** «1 a 30 idénticas» aplica a conceptual
  y operativa (1 a 20 en fin de grado). «Ninguna forma repite a otra» y
  «toda pregunta es del banco de su misión» aplican a las tres pruebas.
- **Crítica nueva:** como se rehace, puede repartir las formas sin repetir
  conjunto en vez de sacarlas al azar. Con eso, 9 misiones llegan a 50 sin
  contenido nuevo y Electricidad para robots también (su banco da 64
  conjuntos). Las otras 12 de la lista necesitan casos nuevos.
- **Service worker (decisión 5):** el nuevo no escribe ni lee `CACHE_DATOS`,
  y tampoco la borra. Lo ya guardado queda en el teléfono sin usarse.
- **No se ha empezado código.** Lo siguiente es tu visto bueno para abrir la
  rama de codificación.

---

## 11. Red de seguridad: hecha

Hecha el 15 de noviembre de 2026 en la rama `claude/adoring-meitner-fqrqo2`,
sin tocar ninguna misión ni nada de lo que se publica. Es la «Fase 0» de la
sección 6.5.

- **Referencia:** `_dev/formas-oro/<carpeta>.json`, una por misión del alcance.
  Qué guarda y cómo se usa está en `_dev/formas-oro/LEEME.md`.
- **Sonda:** `_dev/verifica-formas-oro.js`, dentro de `npm test`. Comprueba
  formas congeladas idénticas, ninguna forma repetida y toda pregunta en el
  banco de su misión.
- **Generador:** `_dev/genera-formas-oro.js`. Se niega a sobrescribir.

Diferencias con lo que proponía la sección 7.2, y por qué:

- De la hoja impresa se guarda la huella y no el documento entero: entero
  pesaba unas siete veces más que el dato y casi todo era estilo repetido.
  La sonda distingue tres casos: cambió una pregunta, cambió lo que se lee en
  la hoja, o cambió solo cómo se ve.
- «Toda pregunta es del banco» se comprueba hoy contra los bancos que ya
  están en el JavaScript de cada misión. La parte de `id` y `fuente` espera a
  que exista `contenido.json`.
- La prueba operativa no tiene banco: sus números salen de la semilla. La
  protege la comparación con la referencia.
- La crítica no lleva referencia (decisión 1). Sus repeticiones de hoy están
  contadas en `_dev/formas-oro/_critica-pendiente.json` y no ponen la sonda en
  rojo; una repetición nueva, sí. La cuenta da 24 misiones y no 18 porque
  aquí también cuentan las formas con las mismas preguntas en otro orden.
- Quedan para después la sonda de codificación (va con la rama de la
  decisión 6) y las de navegador del piloto.

---

## 12. `mision.html` vuelve a funcionar: hecho

Hecho el 15 de noviembre de 2026 en la rama `claude/puerta-mision-fqrqo2`
(sale de la de la red de seguridad e incorpora la de codificación). Es la
«Fase 1» de la sección 6.5. Ninguna misión cambió.

- `mision.html?m=<carpeta>` lleva a la misión en su dirección de siempre. La
  carpeta es la de `misiones/` (por ejemplo `2y3ciclo-la-celula`) y sale de la
  `url` del catálogo; no hay un dato nuevo que mantener.
- Si la carpeta no existe o falta, un aviso y un solo botón a `index.html`.
  `?id=N` no se atiende.
- No hay pantalla intermedia: quien trae un enlace bueno entra directo y el
  botón de atrás no lo devuelve a la puerta.
- `js/motor-misiones.js` existe y hoy solo hace eso.
- Sonda: `_dev/verifica-puerta-mision.js`, dentro de `npm test`. Prueba las
  86 misiones del catálogo, no una de muestra.

---

## 13. Extraer al motor, primera tanda: hecho

Hecho el 15 de noviembre de 2026 en la rama `claude/motor-examen-fqrqo2`
(sale de la de la puerta). Es el principio de la «Fase 2» de la sección 6.5.

- **Qué pasó al motor:** `_evalRng`, `_shuffleF`, `_pickF` y
  `_injectFormaSel`. Estaban idénticas en 84 misiones (83 byte a byte y la de
  Inglés números con otra sangría).
- **Qué cambió en cada misión:** su página carga `js/motor-misiones.js` antes
  que su archivo, y su archivo ya no trae esas cuatro. Nada más: mismas
  direcciones, misma `SAVE_KEY`, mismo XP.
- **Guarda:** cada misión pide el motor por su cuenta si la página que la
  cargó es una copia guardada de antes, que no lo pide. Es el riesgo de caché
  de la sección 6.6.
- **Cómo se publican:** con el mismo nombre global de siempre, colgadas de
  `window` con una asignación. Una misión que aún trajera su copia la declara
  encima sin chocar.
- **Sonda:** `_dev/verifica-misiones-motor.js`, en `npm test`.
- **Comprobado en navegador:** las 84 misiones, antes y después, con un
  guardado de antes: mismo XP, mismas llaves de `localStorage`, mismo texto en
  pantalla y mismos exámenes generados.

Para la siguiente tanda: añadir los nombres a `EN_EL_MOTOR` en esa sonda.

Dos ajustes posteriores en la misma rama (v528):

- Las 84 páginas de misión piden el motor con `?v=NN`, el mismo que
  `mision.html`. La sonda `verifica-misiones-motor.js` exige que coincidan:
  al sellar, se sube en `mision.html` y en las 84.
- La puerta lee también `js/tools/formacion-docente.js`, así
  `mision.html?m=docente-…` abre las 8 misiones del maestro. El slug es
  siempre el nombre completo de la carpeta, sin forma corta.

---

## 14. Segunda tanda: una sola copia de `html2canvas`

Hecha el 15 de noviembre de 2026 en la rama `claude/motor-html2canvas-fqrqo2`
(sale de la de la primera tanda).

- Se borraron las 85 copias de `misiones/<carpeta>/js/html2canvas.min.js`.
  Eran idénticas byte a byte entre sí y a `js/html2canvas.min.js`.
- La copia única es `js/html2canvas.min.js`, la que ya usaba la portada. No se
  movió a `js/vendor/` para no tocar la portada ni la copia de Android.
- Las 85 páginas la piden como `../../js/html2canvas.min.js?v=462`, la misma
  dirección exacta que la portada: el teléfono que ya la bajó no la vuelve a
  bajar en cada misión.
- Sigue cargándose al abrir la página. Cargarla solo al pedir el diploma
  (sección 6.2) queda para cuando el diploma pase al motor.
- Sonda: `_dev/verifica-html2canvas.js`, en `npm test`.

---

## 15. El piloto: La Célula usa el motor

Hecho el 15 de noviembre de 2026 en la rama `claude/piloto-la-celula-fqrqo2`
(sale de la de `html2canvas`). Es la «Fase 3» de la sección 6.5.

Misma dirección (`misiones/2y3ciclo-la-celula/la-celula.html`), misma llave
de guardado (`la_celula_v1`), mismo XP, misma apariencia y las 30 formas del
examen conceptual idénticas a la referencia, hoja impresa incluida.

### Cómo quedó repartida

| archivo | qué es | tamaño |
|---|---|---|
| `js/motor-mision.js` | Lo que toda misión de la plantilla hace. Compartido | 67 KB |
| `misiones/2y3ciclo-la-celula/js/contenido.js` | Lo que La Célula dice y pregunta. Solo datos | 42 KB |
| `misiones/2y3ciclo-la-celula/js/la-celula-propio.js` | Lo que es solo de La Célula | 18 KB |

Antes era un solo archivo, `js/la-celula.js`, de 122 KB. Ese archivo ya no
existe.

**Datos (`contenido.js`), 36 declaraciones:** llave de guardado, XP máximo y
número de secciones; logros y niveles; tarjetas, quiz, clasifica, identifica
y completa; los cuatro widgets; el reto; los cuatro bancos del generador de
tareas; las dos sopas de letras; los cuatro bancos del examen conceptual y el
tope de formas; los bancos, preguntas y pautas de la prueba crítica; las
partes del laboratorio; y `TEXTOS`, lo que el motor escribe con el nombre, la
materia o el color de la misión.

**Motor (`motor-mision.js`):** compartir y letra grande, sonido, tema,
guardado, logros, XP y niveles, navegación, tarjetas, quiz, clasifica,
identifica, completa, widgets, reto, generador de tareas, sopa de letras,
examen conceptual (generar, calificar, imprimir con clave), cambio de prueba,
pauta y puntaje de la crítica, diploma y arranque.

**Código propio (`la-celula-propio.js`):** el laboratorio (4 piezas) y armar
e imprimir la prueba de pensamiento crítico.

**Sigue en el HTML:** el texto de todas las pantallas (Aprende, Estructura,
el laboratorio, los recursos) y los `onclick`. Y siguen aparte, sin tocar, la
animación `js/animacion-herida.js` y la hoja de estilo.

### Cuatro cosas que no salieron como decía la sección 6

1. **No es `contenido.json`, es `contenido.js`.** Dos razones medidas:
   - Los guiones compartidos de la página (`estrella-ganada.js`,
     `metas-registro.js`) leen `SAVE_KEY`, `xp` y `done` en cuanto carga. Un
     `.json` llega después por la red; para entonces ya leyeron vacío.
   - Campeonísimo («Actualizar banco») lee el banco de selección múltiple de
     cada misión buscando su declaración en los archivos de `js/` de la
     misión. Con un `.json`, La Célula se quedaba sin preguntas ahí.
   El archivo es solo datos y la sonda comprueba que cada declaración se puede
   escribir como JSON: pasarlo a `.json` es mecánico el día que esos dos
   lectores cambien.
2. **El motor no es un objeto cerrado.** Sus funciones y variables son
   globales, como en la misión, porque el HTML las llama por nombre y los
   guiones compartidos las envuelven. `MotorMisiones` solo lleva lo nuevo.
3. **La prueba crítica no pasó al motor.** Se rehace entera (decisión 1): sus
   bancos sí quedaron como datos; armarla e imprimirla sigue como código propio.
4. **El archivo propio tiene otro nombre.** Un teléfono con la página guardada
   de antes pide `la-celula.js`, no lo encuentra en la red y usa su copia
   guardada completa. Así la página vieja nunca se mezcla con el código nuevo.

### Cómo se comprobó

- **Formas:** `verifica-formas-oro.js` en verde en las 84; las 30 de La Célula
  idénticas en dato, texto de la hoja y hoja completa.
- **Navegador, antes y después:** 70 pasos recorriendo la misión entera, sin
  guardado y con un guardado de antes (XP 61, tres secciones, dos logros, tema
  oscuro, letra grande). Coinciden en todos el texto en pantalla, lo guardado,
  la evidencia registrada, el XP, las secciones hechas, los logros, los avisos
  y los ocho documentos impresos o enlaces; la estructura de la página en 66,
  y el diploma sale idéntico byte a byte.
- **Las 4 diferencias de estructura** son la altura que reserva la animación
  de don Tulio según si la letra ya cargó. Pasa igual en la versión de antes
  (5 de 14 cargas) y en la nueva (3 de 14), y 1,5 s después las dos quedan
  iguales. No lo trae el piloto.
- **Sondas que dejaron de ver La Célula sin ponerse rojas** al partir el
  archivo, y se corrigieron: `verifica-bancos-tareas`,
  `verifica-examen-sin-pistas`, `mide-reparto-respuestas` y
  `verifica-html2canvas`. Es lo que hay que repetir en cada tanda: comparar la
  salida de las sondas antes y después, no solo que sigan en verde.

### Para la siguiente misión

El motor salió de La Célula y se comparó función por función con siete
hermanas (La Energía, La Materia, Ecosistemas, Sistema Nervioso, Mayas,
Tipos de textos y Geografía de Honduras): salvo los textos que ahora van en
`TEXTOS`, eran idénticas. Las que difieren de verdad entre misiones son la
prueba crítica y el laboratorio.


---

## 16. La prueba de pensamiento crítico reparte sin repetir: el piloto

Hecho el 15 de noviembre de 2026 en la rama `feat/critica-sin-repetir`
(v538), sobre los 13 bancos ya completos de `docs/FALTANTES-BANCO-CRITICO.md`.
Se aplicó primero solo a La Célula y a Robots que Resuelven Problemas; las
demás van por tandas, cada una con el visto bueno de Josué.

### El diseño

- **Una sola vez, en `js/motor-misiones.js`:** `_repartoCritica(forma, apartados)`.
  La misión declara sus apartados en `critApartados()`, con el banco de cada
  uno y cuántos casos saca (`[[critCaseBank, 1], [critCauseBank, 2]]`), y en
  `genEvalCrit` llama a `_turnoCritica`, que le devuelve la forma que toca y
  sus casos. Ninguna misión elige casos por su cuenta.
- **Cómo reparte:** cada apartado es una rueda con todas las maneras de sacar
  sus casos. Con cada forma todas las ruedas avanzan un paso, y cada vez que
  las ruedas de antes completan su vuelta la siguiente se adelanta un paso
  más. Con ese adelanto ninguna forma repite el conjunto de otra hasta agotar
  todas las combinaciones del banco. No es azar: está demostrado y la sonda lo
  recorre entero, banco por banco.
- **Depende de** el número de forma, el tamaño de cada banco y cuántos se
  sacan. No del texto: la Forma 7 en inglés lleva los mismos casos.
- **Hasta dónde llega:** `_formasCritica` da 50, o los conjuntos que permita
  el banco si son menos. El desplegable de la crítica usa ese tope; el del
  examen conceptual sigue en `EVAL_FORMAS` (30) y no se tocó.
- **Congelado como el generador:** añadir o quitar un caso de un banco cambia
  todas las formas críticas de esa misión.

### Antes y después (conjuntos de casos distintos)

| misión | conjuntos posibles | formas 1 a 30, antes | formas 1 a 50, antes | formas 1 a 50, ahora |
|---|---|---|---|---|
| `2y3ciclo-la-celula` | 120 | 26 | 42 | 50 |
| `2y3ciclo-robots-problemas` | 240 | 30 | 47 | 50 |

Las 53 misiones tienen banco para 50 conjuntos. La más justa es La Materia,
con 54.

### Cómo se vigila

- `_dev/verifica-critica-sin-repetir.js` (en `npm test`): el reparto con
  bancos de todos los tamaños, y cada misión que ya reparte, de la Forma 1 a
  la 50, con su código de verdad. Roja si dos formas traen los mismos casos,
  si algo no sale del banco de su misión o si el banco no llega a 50.
- `_dev/verifica-critica-navegador.js` (tanda de navegador): lo mismo en la
  página, eligiendo en el desplegable; la hoja impresa; un guardado de antes;
  el inglés.
- `_dev/verifica-formas-oro.js`: conceptual y operativa idénticas a la
  referencia. La crítica se congela misión por misión, cuando Josué aprueba:
  `node _dev/genera-formas-oro.js --critica <carpeta>`.
- `_dev/verifica-examen-sin-pistas.js` arma ahora las formas críticas con el
  reparto del motor. De paso volvió a armar las formas de las demás: desde
  que el generador se sacó de las misiones (sección 13) no lo encontraba y se
  saltaba esa comprobación sin ponerse roja.

### Tanda 1: las 33 con los mismos apartados que La Célula

Josué aprobó el piloto el 15 de noviembre de 2026. La crítica de La Célula y
de Robots que Resuelven Problemas quedó congelada en `_dev/formas-oro/`
(formas 1 a 50), y la rama se puso al día con `main` (sello v538).

Pasaron al reparto las 33 misiones que sacan Caso, Error, Decisión,
Comparación, 2 Causas y 3 Efectos. El cambio es el mismo en todas: declarar
`critApartados()` y llamar a `_turnoCritica`. Las 33 dan 50 conjuntos
distintos en las formas 1 a 50. Antes, 13 de las 33 llegaban a 50 y las más
cortas eran La Energía y La Materia (33) y El Asombro (35).

Josué aprobó la tanda y su crítica quedó congelada.

### Tanda 2: las 7 de la familia de los robots

Electricidad para Robots, Motores y Mecanismos, Programando un Robot, ¿Qué es
un Robot?, Sensores, Numbers and My Age y Hello! Saludos. Sacan 2 casos de
diagnóstico, 1 error, 1 de proceso, 1 comparación y 1 diseño. Las 7 dan 50
conjuntos distintos; antes solo dos llegaban. Las cinco con versión en inglés
reparten igual en los dos idiomas, porque el reparto va por posición en el
banco. Su crítica quedó congelada al terminar.

Van 42 de 53, las 42 con la crítica congelada.

### Lo que queda

- **Las otras 11**, con estructura propia: Adjetivos, Adverbios, Áreas
  protegidas, Eras geológicas, Coordenadas, los dos de Continentes,
  Pronombres, Sustantivos, Verbos y Adjetivos de bachillerato. En siete de
  ellas la prueba, además de sacar casos, baraja opciones o calcula datos con
  la semilla: se miran una por una.
- **El aviso a los docentes** (decisión 1): las pautas impresas de la prueba
  de pensamiento crítico dejan de corresponder a la forma del mismo número,
  de la 1 a la 30, en las 42 misiones que ya reparten.
- **Visto al probar la tanda 2, sin tocar:** `verifica-mision-navegador` se
  cae con Numbers and My Age porque espera tarjetas (`#fcW`) que esa misión
  no tiene. Viene de antes y no es de la prueba crítica.
- **Visto al probar, sin tocar:** al recargar la página, los dos
  desplegables (conceptual y crítica) enseñan «Forma 1» aunque la forma
  guardada sea otra; al generar sale la guardada. Pasa en todas las misiones
  y viene de antes.
