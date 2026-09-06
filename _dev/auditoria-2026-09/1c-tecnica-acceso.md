# Auditoría técnica (III): accesibilidad

Una lente (T6), 12 hallazgos, **ninguno revisado**: el revisor adversarial de esta área no llegó
a correr. Léase como la lectura de un solo auditor, con la evidencia que dejó puesta —que es
mucha y es reproducible—, no como veredicto confirmado.

El auditor corrió **axe-core sobre ocho pantallas** en pantalla de teléfono (393×873): inicio,
Misiones, Mi aula con datos sembrados, Fracciones, Adjetivos, `padres.html`, `fichas/index.html`
y el Constructor de Cubitos 3D. Y completó lo que axe no ve con medidas propias en Playwright:
recorrido de teclado, dónde queda el foco, alto real de cada blanco táctil y contraste calculado
con la fórmula WCAG.

## Resumen

**Ninguna de las ocho pantallas salió limpia.** Por impacto, en nodos: 8 críticos, 26 serios, 65
moderados, 3 menores. Pero lo que de verdad pesa es lo que axe no puede ver, y son tres cosas.

**El zoom está bloqueado** en `index.html` y en 20 archivos más, en una plataforma cuyo único
remedio de letra grande vive *dentro* de cada misión —y no en la app del maestro, que es la
pantalla con más texto chico del producto. Quien no ve bien no puede pellizcar para agrandar Mi
aula.

**En 48 de 66 misiones las actividades no existen para el teclado.** Clasifica, Identifica y la
sopa se arman con `<div>` y `onclick`: no reciben foco, no responden a Enter, un lector de
pantalla no las anuncia. Un alumno con discapacidad motora que use conmutador, o un alumno
ciego, puede leer la teoría y no puede hacer una sola actividad. **El patrón correcto ya existe
en el repositorio**: 18 misiones lo hacen bien.

**No hay lectura en voz alta para el alumno.** El único 🔊 del producto está en el asistente de
padres, que funciona bien, y en la misión de saludos en inglés. Las misiones son texto largo a
12-15 px, y el texto es la puerta a todo lo demás. Hoy la plataforma es para quien lee bien en
una pantalla.

Y una observación de proceso que explica por qué esto creció sin freno: **ninguna sonda de
`_dev/` mira accesibilidad.** Hay 3 menciones de `aria-` en todo `_dev/`, y ningún archivo carga
axe. El proyecto tiene sondas que cuentan las páginas de un PDF y que persiguen un lienzo 3D
derramado; no tiene ninguna que pregunte si el alumno puede llegar al botón con el dedo o con el
teclado.

### Lo que está bien, y hay que decirlo

Esto no es una plataforma descuidada en accesibilidad; es una plataforma que atendió lo que se
ve y no lo que no se ve.

- **La corrección nunca depende solo del color.** Las 66 misiones de alumno ponen ✓ y ✗ por
  `::before` además del verde y el rojo. Uno de cada doce niños no distingue esos dos colores, y
  aquí no le hace falta.
- **Cero botones de solo emoji sin etiqueta** en las ocho pantallas: todos llevan texto o
  `aria-label`.
- **El idioma se declara bien** al cambiar a inglés (`metas-i18n.js:666` pone
  `documentElement.lang`), que es lo que hace que un lector de pantalla no lea el inglés con
  fonética española.
- **Los diálogos de `metas-dialogos.js`** tienen `role=dialog`, cierran con Escape y devuelven
  el foco.
- **La sopa de letras acepta toque-toque** además del arrastre, y la lectura de la misión acepta
  flechas y Home/End para marcar la última palabra leída.
- **Los chips y sub-pestañas de Mi aula son `<button>` de verdad.**
- **El asistente de padres ofrece 🔊 con `aria-label` y `aria-live`.** Es la pieza más accesible
  del producto, y está en la pantalla de la familia.

## Lo que impide usar la aplicación

### El zoom está bloqueado en 21 archivos, y el maestro no tiene letra grande

`T6-01` · alta · error · esfuerzo horas · impacto educativo 4/5 · comercial 3/5

`index.html:5` lleva `maximum-scale=1.0, user-scalable=no`. Android Chrome lo respeta. Lo mismo
en `mision.html`, `camp-vivo.html` y los 18 juegos 3D: 21 archivos en total. Es la única
violación que axe marca como **critical** en cuatro de las ocho páginas.

La incoherencia es lo llamativo: las misiones tienen «🔤 Letra», los juegos 3D tienen «Aa», y la
SPA del maestro —14 vistas, rótulos de 11-12 px, listas, notas SACE, asistencia— no tiene ni una
cosa ni la otra. El maestro que no ve bien no puede agrandar ni pellizcar.

Y no hay comentario en `index.html`, en `app.js` ni en el CLAUDE.md que explique por qué se
bloqueó. En un repositorio donde cada decisión rara está anotada con su motivo, eso sugiere que
se copió de una plantilla y nadie lo decidió.

- Qué hacer: quitar `maximum-scale` y `user-scalable` de los 21 archivos. Si el motivo era el
  zoom accidental por doble toque, eso se resuelve con `touch-action: manipulation` en el body,
  que **no** impide el pellizco. Y añadir en Ajustes un control de tamaño de letra que escale
  `html{font-size}`, guardado en la misma llave `preferenciaLetra` que ya usan las misiones.

### Las actividades no se pueden hacer con teclado en 48 de 66 misiones

`T6-02` · alta · error · esfuerzo días · impacto educativo 5/5 · comercial 3/5

La sonda de teclado sobre Fracciones encontró **17 elementos clicables que no reciben foco**:
Clasifica 12 de 16 (`div.wb-item`, `div.drop-col`), Identifica 4 de 7 (`span.id-word`), la sopa
1 de 3. El código:

```
misiones/2y3ciclo-fracciones/js/fracciones.js:127
const el = document.createElement('div');
el.className = 'wb-item';
… el.onclick = …
```

66 de 74 misiones crean divs clicables por JavaScript; **solo 18 les ponen `role` y
`tabindex`**. `misiones/1ciclo-segundo-grado/js/centena.js` lo hace bien. En el HTML estático
hay además 99 `<div … onclick>`.

Esto no es un detalle de norma: es media plataforma inalcanzable para un alumno con
discapacidad motora, y es exactamente el tipo de barrera que una institución privada —o la
Secretaría— pregunta antes de firmar.

- Qué hacer: cambiar `createElement('div')` por `createElement('button')` en `wb-item`,
  `drop-item`, `id-word` y las celdas de la sopa; o copiar el patrón de `centena.js` (role,
  tabindex, keydown Enter/Espacio → click) a las 48 misiones **con un guion**, como ya se hizo
  con el montaje de los videos. Meterlo en `PLANTILLA-MISIONES.md` y añadir a una sonda la
  comprobación «todo lo que tiene onclick es enfocable».

### No hay voz para el alumno

`T6-09` · alta · faltante · esfuerzo días · impacto educativo 5/5 · comercial 3/5

`grep -rln speechSynthesis` en todo el repositorio (sin `www/`) devuelve **dos archivos**:
`misiones/2y3ciclo-ingles-saludos/js/saludos-ingles.js` y `padres.html`. Cero en
`lectura-mision.js`, en `metas-registro.js`, en `app.js`, en `parque-3d.js`.

Un alumno de 4º con dislexia severa, con baja visión o ciego no tiene forma de oír la teoría, la
pregunta ni las opciones. Y `padres.html:356` demuestra que la pieza ya está escrita y funciona:
`<button class="bub-oir" aria-label="Escuchar este mensaje">🔊</button>`.

- Qué hacer: un botón «🔊 Escuchar» en la barra que `metas-registro.js` ya inyecta en las 66
  misiones, que lea la sección activa y, en el quiz, la pregunta y sus opciones al recibir foco.
  Voz es-HN o es-MX si existe, es-ES si no. **Funciona sin internet en Android**, que es la
  condición de este producto. Reutilizar `leerBurbuja` de `padres.html`.

> El auditor dejó anotado un límite honesto: no pudo verificar el artículo de la Ley Fundamental
> de Educación sobre inclusión, porque su texto **no está en `_dev/leyes/`** (solo Estatuto,
> Código de la Niñez y SACE). La obligación legal queda como afirmación del CLAUDE.md, no
> comprobada.

## Lo que hace la aplicación difícil de usar

### El foco no se mueve al cambiar de vista, y faltan las piezas básicas de navegación

`T6-03` · media · incompleto · esfuerzo horas · impacto educativo 3/5

`js/app.js:2014-2035` — `switchView()` cambia clases y repinta, pero **el foco se queda en
`<body>`**. La sonda lo midió: tras tocar «Misiones» en el menú, `activeElement = BODY` y
`aria-live` = 0. Un usuario de lector de pantalla toca una vista y no oye nada; tiene que volver
a explorar la página desde arriba.

Alrededor de eso falta todo el andamiaje: cero `<main>` en `index.html`, `padres.html` y
`fichas/index.html`; ningún enlace «Saltar al contenido»; la hamburguesa sin `aria-expanded` ni
`aria-controls` y sin llevar el foco al menú que abre. axe lo marca como `landmark-one-main` y
18 nodos de `region` fuera de landmark en inicio, 10 en admin.

Dentro de la misión pasa lo mismo: `go()` hace `scrollTo(0)` pero no enfoca la sección. Y el
modal «¡Hola, explorador!» que se abre al cargar tiene `role=dialog` correcto pero solo enfoca
cuando falla la validación, y no cierra con Escape —cuando `metas-dialogos.js`, en el mismo
repositorio, ya hace las dos cosas bien.

### Contraste: el verde de C. Naturales y el naranja del XP

`T6-04` · media · error · esfuerzo horas · impacto educativo 3/5

Calculado con la fórmula WCAG, sobre blanco:

| color | uso | contraste | mínimo |
|---|---|---:|---:|
| `--cnat` #0d9488 | «C. Naturales», encabezados de fichas | **3,74:1** | 4,5 |
| `--accent` #f59e0b | el «+25 XP» de cada tarjeta, a 11 px | **2,15:1** | 4,5 |
| `--faint` #94a3b8 | texto secundario | **2,56:1** | 4,5 |
| `--brand-light` #3b82f6 | borde de foco de los campos | **3,68:1** | 3,0 (no texto) |

axe marca 25 nodos de contraste como *serious*: 7 en Misiones (contadores de pastilla a 11 px,
3,08 y 3,99), 8 en fichas, 4 en Adjetivos (la barra de identidad a 2,67 y sus botones a 3,34), 2
en Fracciones, y uno en padres, inicio y el juego 3D.

En un aula con luz de ventana y la pantalla de un teléfono, texto de 11-13 px con esos
contrastes no se lee. Es la misma razón por la que el chip de grupo activo va relleno y no solo
con el borde de otro color —una regla que el proyecto ya aprendió en Mi aula y no aplicó al
resto.

- Qué hacer: subir `--cnat` a #0f766e; usar `--accent` solo como fondo o icono, nunca como texto
  sobre blanco (para el XP, #b45309); contadores de pastilla a ≥12 px y color oscuro. Y meter
  `axe color-contrast` en una sonda para que no vuelva a entrar.

### Las pestañas de la misión miden 39 px, y «letra grande» no las toca

`T6-05` · media · error · esfuerzo días · impacto educativo 3/5

La barra de secciones —lo que el alumno más toca— es `.nav-t{font-size:0.75rem;padding:0.35rem
0.7rem}`: **39 px de alto, 12 px de texto**. El propio CLAUDE.md fija 44 px como mínimo para los
juegos 3D («es lo que un dedo acierta sin mirar»); la regla no cruzó a las misiones.

La sonda contó, en cada pantalla, cuántos interactivos visibles miden menos de 44 px:

| pantalla | por debajo de 44 px |
|---|---|
| Fracciones | 35 de 36 |
| Adjetivos | 34 de 35 |
| Mi aula | 18 de 35 |
| Inicio | 9 de 38 |

Y con `body.letra-grande` activada a 360×640, el cuerpo sube a 20 px y **la pestaña sigue en 12
px**, porque la regla solo infla `p, span, li, h2, h3`. La barra de identidad de la misión tiene
botones de 26 px de alto; en Mi aula, sub-pestañas y chips de 37 px y botones de icono de 32-38.

### El reto de 30 segundos no se puede alargar, y castiga el error

`T6-07` · media · incompleto · esfuerzo días · impacto educativo 3/5

`retoSec = 30` está escrito fijo en las 66 misiones, y cada fallo resta XP (`pts(-1)`). WCAG
2.2.1 pide poder ajustar cualquier límite de tiempo que no sea esencial.

El auditor hizo bien la distinción, y conviene conservarla: **el minuto de la lectura de fluidez
sí es esencial** —mide velocidad, es la prueba— y no se objeta. El reto es un juego de repaso y
su cronómetro no mide nada. Para el alumno con dislexia, con baja visión o con discapacidad
motora —el mismo que ya sufre la letra de 12 px— la única salida hoy es no jugarlo, y de paso
perder el XP.

- Qué hacer: un modo «sin prisa» (tiempo ×2 o sin cronómetro) guardado con la misma preferencia
  que la letra grande, con el mismo XP y sin penalización por error.

### El tablist está mal formado y promete flechas que no existen

`T6-06` · media · error · esfuerzo horas

`<nav class="nav" role="tablist">` contiene un hijo con `role="button"` —el botón Constancia—,
lo que rompe el contrato ARIA del patrón de pestañas. axe lo marca **critical** en las dos
misiones probadas y, por plantilla, está en las 66.

Y el patrón está a medias: hay `aria-selected` y `aria-controls`, pero `ArrowRight` desde
«Aprende» deja el foco en «Aprende», y no hay roving tabindex, así que con teclado hay que
tabular las 16 pestañas una a una. **Un rol declarado que promete un comportamiento que no
existe es peor que no declararlo**: el usuario de lector de pantalla confía en la promesa.

- Qué hacer, y la alternativa barata es la honesta: quitar `role=tablist/tab` y usar botones
  normales con `aria-current`, que es lo que hoy realmente funciona. O implementar las flechas
  de verdad. Lo que no puede quedarse es el estado intermedio.

## Lo que sobra

### «Letra grande» está sobrediseñada por misión, y falta en 11

`T6-11` · media · **sobrediseño** · esfuerzo días

Cada misión implementa su propio `body.letra-grande` inflando `p, span, li, h2, h3` un 125 % con
`!important`. Eso trae tres consecuencias, y las tres están medidas:

1. **Choca con lo demás.** El CLAUDE.md documenta dos choques que esta implementación causó: los
   spans de la lectura proyectada y las fracciones apiladas necesitan contra-reglas
   (`fracciones.css:461` `.fr{font-size:0.86em!important}`). Con dos sitios mandando sobre el
   tamaño, no acierta ninguno.
2. **No escala lo que hay que tocar**: pestañas, botones e inputs se quedan igual.
3. **Falta en 11 misiones** (las 8 del maestro, ángulo-bisectriz, bach-uni-adjetivos,
   área-círculo) y no existe en la SPA del maestro.

Es exactamente la duplicación que el proyecto ya reconoció como error con el andamio de los
juegos 3D y con los videos de misión —«un aparato copiado a todas las misiones se arregla en una
y se queda roto en las demás»— y que aquí no se ha resuelto.

- Qué hacer: `html.letra-grande{font-size:125%}` en un CSS compartido cargado por
  `metas-registro.js` y por `index.html`. Todo lo que esté en rem o em crece solo, sin
  `!important` y sin lista de etiquetas. Se retiran las contra-reglas `.fr` y las notas del
  CLAUDE.md sobre el choque con `.lm-manda`, que dejan de hacer falta.

## Deuda menor, barata de pagar

### Animaciones sin `prefers-reduced-motion` en 71 de 74 misiones

`T6-08` · baja · incompleto · esfuerzo horas

El inicio arranca con 8 animaciones corriendo (`document.getAnimations().length` = 8 tras
cargar) y las 66 misiones disparan confeti en cada acierto. Solo 3 hojas de estilo de misión
consultan `prefers-reduced-motion` —electricidad-robots, motores-mecanismos, sustantivos—;
`app.css` sí lo hace en tres bloques.

Para alumnos con trastornos vestibulares, epilepsia fotosensible o TDAH, el ajuste del sistema
que ellos ya activaron se ignora. Y para el maestro que proyecta en la pared, el movimiento
constante compite con lo que 43 alumnos están copiando.

- Un bloque compartido de tres líneas y un `if` en la función de confeti, también en
  `parque-3d.js`. Es de las cosas más baratas de toda la auditoría.

### Semántica básica rota

`T6-10` · baja · error · esfuerzo horas

Errores que axe encuentra en treinta segundos:

| qué | dónde | impacto axe |
|---|---|---|
| `<select id="country-select">` sin nombre accesible | `index.html` | **critical** |
| Sin `<h1>` | inicio y `padres.html` | moderate |
| Salto de h2 a h4 (×3) | Adjetivos | moderate |
| `.cmp-table-wrap` se desplaza pero no recibe foco | Fracciones | serious |
| `<aside role="navigation">` | `index.html` | minor |

Con teclado, la tabla comparativa de Fracciones no deja llegar a las columnas de la derecha: el
contenido existe y es inalcanzable.

### El indicador de foco se elimina en los campos del maestro

`T6-12` · baja · error · esfuerzo horas

80 ocurrencias de `outline: none` entre `css/app.css` y los CSS de misión. En los campos de Mi
aula, Plan de Acción, Gobierno Escolar y el modal de identidad, la única señal de foco que queda
es un borde de 1-1,5 px que cambia a `--brand-light` (#3b82f6, **3,68:1**).

El maestro que pasa 43 notas con Tab —o al que el navegador Android le mueve el foco al abrir el
teclado— no ve en qué casilla está. Los **botones** sí conservan `:focus-visible` con anillo de
3 px; el problema está solo en los campos, que es justo donde se escriben las notas.

- `:focus-visible{outline:3px solid var(--brand);outline-offset:2px}` global y un `sed` que
  borre los `outline:none`. Si se prefiere el borde, que sea ≥2 px y con `--brand` (#1e3a7c,
  10:1).

## Qué falta

1. **Una sonda de accesibilidad** (`_dev/verifica-accesibilidad.js`) que corra axe sobre las
   ocho pantallas y falle con cualquier *critical* o *serious*. Sin eso, todo lo demás se vuelve
   a acumular; es la lección que el proyecto ya aprendió con las páginas de las fichas y con el
   lienzo derramado de los juegos 3D.
2. **Voz para el alumno**, reutilizando lo que ya funciona en `padres.html`.
3. **Un solo ajuste de letra**, de raíz, para toda la plataforma incluida la app del maestro.
4. **Teclado en las actividades**, propagando con guion el patrón que 18 misiones ya tienen.
5. **La comprobación de blanco táctil ≥44 px** extendida de `lib-sonda-3d.js` a las misiones,
   que es donde el alumno pasa el tiempo.

## Cobertura y límites

- **Ninguno de estos 12 hallazgos pasó revisión adversarial.** El revisor de esta área no llegó
  a correr. La evidencia es reproducible —los JSON de axe y las medidas de Playwright quedaron
  escritos— pero nadie intentó tumbarla con el código delante, que es lo que sí tienen las áreas
  de datos, currículo, aprendizaje, docente y producto.
- Se probaron **ocho pantallas de las decenas** que tiene el producto, y dos misiones de 66. Los
  conteos que se extienden al total (48 de 66, 71 de 74, 21 archivos) salen de `grep`, no de
  abrir cada misión.
- **No se probó con un lector de pantalla real** (TalkBack, NVDA) ni con una persona con
  discapacidad. axe encuentra lo que se puede automatizar, que es aproximadamente un tercio de
  las barreras reales; el recorrido de teclado se hizo con Playwright, que no es lo mismo que un
  conmutador.
- **No se probó en un teléfono físico** ni con la letra del sistema agrandada, que es la
  configuración de quien no ve bien y la que ya causó problemas documentados en los juegos 3D.
- La referencia a la obligación legal de inclusión **no está verificada**: el texto de la Ley
  Fundamental de Educación no está en el repositorio.
