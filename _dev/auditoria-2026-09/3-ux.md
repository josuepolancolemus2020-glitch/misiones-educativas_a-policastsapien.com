# Auditoría UX/UI: la aplicación probada como alumno de 4º, 5º, 6º, 7º y 9º grado

Cinco personas recorrieron la aplicación de verdad, con un navegador Chromium controlado paso a
paso, en pantallas de 393×873 y 360×640 (el teléfono barato), y en 1280×720 para el laboratorio
de cómputo. **Siempre sin internet**, con Supabase, YouTube y el CDN cortados, porque ese es el
caso normal del aula. Cada persona llevó un diario en primera persona, con captura en cada paso.
Son 60 hallazgos —48 de las lentes U4 a U7 y 12 de la U9— y **hoy los 60 tienen revisión
adversarial**: los 12 de U4 la tuvieron en la primera corrida, y los otros 48 pasaron por un revisor
el 9 de septiembre contra el código de ese día (`d940fe0`, con las 20 modificaciones ya aplicadas).
De esos 48, **12 eran ciertos y ya están corregidos**, 13 cambiaron de severidad, **uno se cayó**
(U9-12) y el resto se confirmó tal cual. Cada hallazgo lleva debajo su veredicto; las tablas del
final resumen la revisión. La alumna de 8º, que faltaba en la serie, tiene su propia sección en
`3c-ux-octavo-grado.md`.

## Lo primero, porque es importante

**Sin internet, todo funciona.** Las cinco personas recorrieron la portada, el catálogo, doce
misiones, el quiz, la lectura de un minuto, los juegos 3D y las pruebas de fin de grado **sin un
solo error de JavaScript propio**. Solo fallan las peticiones externas, que es lo esperado. Para
una plataforma que promete funcionar en un aula sin señal, eso es el cimiento, y está puesto.

Y hay tres piezas que las personas señalaron como bien hechas, sin que se les preguntara:

- **El aviso de los juegos 3D sin internet.** Sale en un segundo, en lenguaje de niño, con
  «Reintentar» y «Volver a la misión», y cabe entero en un teléfono de 360 píxeles.
- **«Predice»**, la actividad con la que arrancan veinte misiones. Explica en una frase por qué
  fallaste. Las tres personas que la encontraron la nombraron como la mejor retroalimentación de
  su recorrido.
- **La traducción al inglés.** El alumno de 9º comprobó que tras tocar el botón quedaron **cero
  líneas en español** en toda la página, pestañas y pie incluidos. «Es lo mejor que vi.»

## Lo crítico

### «Ver Pauta» enseña las respuestas y la nota copiada llega al maestro

`U5-02` · crítica · error · esfuerzo días · impacto educativo 5/5 · comercial 4/5

> ↕ **Severidad ajustada por el revisor del 9 de septiembre** (`U5-02`: critica → alta): Aplicar en estadisticas-alumno.js:352 la misma regla `conPauta` de plan-accion.js:1330-1340 (mismo dispositivo, mismo día, pauta anterior) antes de calcular `mejor`/`conceptual`/`operativa`, o mejor: que metas-registro.js escriba `pauta_previa:true` en el…

Kevin, de 5º grado, lo hizo sin proponérselo: junto a «Calificar prueba» hay un botón «Ver
Pauta». Lo tocó, aparecieron las 16 respuestas debajo de cada pregunta, las copió, calificó, y la
pantalla dijo 100/100. Ese evento quedó en el registro con nota 100, y en Rutas la misión pasó a
«Dominada · 100».

Es el mismo hallazgo que la lente de evidencias encontró por su cuenta, y aquí está reproducido
por un alumno que solo estaba usando la aplicación.

- Qué hacer: separar dos modos. «Practicar», con la pauta visible y sin registrar. «Evaluación»,
  con la pauta oculta hasta después de calificar, que registra una vez por forma y marca si la
  pauta se abrió antes.

## Dónde se pierde cada persona

Este es el resultado que el encargo pedía. Cada fila es un momento anotado en un diario, con su
captura.

| persona | momento | qué pasa |
|---|---|---|
| **4º** | Buscar su misión | Escribe «numeros» sin tilde: «Sin resultados» |
| **4º** | Al abrir la misión | Cinco campos, entre ellos «código de aula», antes de ver nada |
| **4º** | Tras la primera actividad | Las 20 pestañas están al final, a 1 496 píxeles |
| **4º** | En el Laboratorio | Le piden formar «doscientos doce millones setecientos noventa y cuatro mil noventa y seis» en una misión que se llama «del Cien al Millón» |
| **5º** | Buscar la misión que le mandó la maestra | «multiplos» sin tilde: «Sin resultados» |
| **5º** | Tras sacar 100 en la evaluación | La constancia dice «6 % · ¡ÁNIMO! Comienza tu misión» |
| **6º** | Al abrir Fracciones | 351 palabras en 3,9 pantallas, sin nada que tocar hasta el pie |
| **6º** | En la pestaña de videos | «Todavía no hay videos» en las 20 misiones de Matemáticas |
| **6º** | Al calificar la Prueba de Fin de Grado | El resultado aparece cinco pantallas más abajo; parece que el botón no hizo nada |
| **6º** | Al volver de la prueba de Español | **Sus veinte minutos de respuestas se borraron** |
| **7º** | En el Quiz | «¿Cuánto mide un ángulo recto?». Eso lo vio en 4º |
| **7º** | Al buscar «enteros», «ecuaciones», «negativos» | Cero resultados |
| **7º** | En «Clasifica» de Decimales | Le piden arrastrar y **con el dedo no se mueve nada** |
| **9º** | En el catálogo | Busca «9º», «noveno», «bachillerato»: «Sin resultados» |
| **9º** | En Recursos | ✅ «Abrir carpeta en Google Drive» apunta a una carpeta que no existe · *corregido el 6 de septiembre: el botón se quitó de las 31 misiones y en su lugar se dice que el recurso listo es la ficha imprimible* |
| **9º** | En la Ruta de la Meta | Termina en 7º y se presenta como «Etapa 4 de 4», sin decir que 8º y 9º vienen |

## Los cinco problemas que salieron en todas las personas

Cuando cinco recorridos independientes tropiezan con lo mismo, deja de ser una opinión.

### 1. La barra de secciones está al final de la página

`U4-03 + U5-05 + U6-03 + U7-02 + U9-08` · alta · esfuerzo horas para el síntoma

> ↕ **Severidad ajustada por el revisor del 9 de septiembre** (`U5-05`: alta → media): Quitar del hallazgo la parte de «barra al pie tras 1.466 px» (ya no es así) y dejar la de nombres opacos y falta de camino. Severidad media: navegar ya funciona; lo que falta es que el niño sepa cuáles de las 19 cuentan. Esfuerzo sigue siendo semanas porque…

> ✅ **Corregido antes de esta revisión** (`U6-03`, comprobado el 9 de septiembre contra `d940fe0`): La consecuencia del hallazgo —no encontrar la barra ni saber dónde se está— ya no ocurre. css/barra-secciones.css:36 y :85 (.bs-marco position:sticky; top:0; z-index:60) y js/barra-secciones.js enganchados en fracciones.html:18/653, solidos-geometricos.html:18/922, fin-de-grado-6to.html:18/696. Medido hoy en Fracciones: la…

> ✅ **Corregido antes de esta revisión** (`U7-02`, comprobado el 9 de septiembre contra `d940fe0`): Top-20 #9. Las tres misiones citadas cargan css/barra-secciones.css y js/barra-secciones.js (2 referencias cada una). Medido hoy en 360×640 al abrir Ángulos: nav top=124 px, una sola fila (h=65), `.bs-marco` position:sticky (css/barra-secciones.css:85); tras desplazar 2 500 px sigue en top=0 y visible. Ya no está al final ni a…

> ✅ **Corregido antes de esta revisión** (`U9-08`, comprobado el 9 de septiembre contra `d940fe0`): Corregido en las 74 misiones por `css/barra-secciones.css` + `js/barra-secciones.js` (modificación 9 de la lista; normativa «la barra de secciones va ARRIBA, y no se va» en CLAUDE.md). Medido hoy en La Célula a 360×640 (pw1.js): al abrir, la barra está en `top: 161 px` —dentro de la primera pantalla, antes eran 4 156 px—, y…

| misión | pestañas | distancia hasta la barra |
|---|---|---|
| Fracciones | 16 | 2 765 px |
| La Célula | 15 | 4,6 pantallas (6,5 en 360 px) |
| Múltiplos | 19 | 1 466 px |
| Ángulos (360 px) | 13 en 5 filas | 5 375 px |
| Fin de Grado 7º | 18 en 7 filas | tras 14 pantallas de Aprende |

El alumno aterriza en un texto largo y **no ve que la misión tenga quiz, juegos o reto** hasta
llegar al pie. El único camino visible es un botón que en Fracciones es solo un emoji y una
flecha, sin decir a dónde lleva.

El revisor separó bien las dos cosas: el rediseño lineal que proponía el auditor es de semanas,
pero **hacer que la barra sea alcanzable** (fija arriba, o un botón «Secciones» en la cabecera) y
que el botón siguiente lleve el nombre de la sección, es de **horas**. Es el cambio con mejor
relación coste-beneficio de todo el capítulo.

### 2. El buscador no entiende las palabras sin tilde

`U4-02 + U5-01` · alta · error · esfuerzo horas

> ✅ **Corregido antes de esta revisión** (`U5-01`, comprobado el 9 de septiembre contra `d940fe0`): Era cierto en 9ce2ac1 y hoy está corregido: js/app.js:536-543 define `sinTildes` (NFD + quita diacríticos + normaliza º/°) y js/app.js:637-645 la aplica a los dos lados y palabra por palabra (título + materia + ruta + grado). Medido hoy en el navegador con renderMissions('all', q): «multiplos» → 1 tarjeta, «matematicas» → 20,…

> ✅ **Corregido el 6 de septiembre de 2026.** Los dos lados se comparan sin tildes y **palabra
> por palabra**, así que «numeros» encuentra las mismas 3 que «números» y «grandes numeros»
> también da con «Números Grandes». De paso salió **un segundo buscador con el mismo defecto**:
> el de maestros del director (`aj-buscar`), donde pesa más —«cortes» tenía que encontrar Cortés
> y «jose», José—. Los dos usan ahora un solo ayudante, `sinTildes`. Lo vigila
> `_dev/verifica-buscador.js`, que escribe como escribe un niño.

«numeros», «multiplos», «matematicas», «millon», «angulos», «numero»: todas devuelven cero
resultados. La comparación se hace sin quitar los diacríticos.

Dos de las cinco personas se perdieron exactamente aquí, y una de ellas buscaba **la misión que
le había mandado su maestra**. La función que normaliza tildes ya existe dentro de las misiones;
el buscador no la usa. Es un arreglo de una línea.

### 3. Cinco campos antes de ver nada

`U4-04 + U5-04 + U7-10 + U9-07` · esfuerzo horas

> ↕ **Severidad ajustada por el revisor del 9 de septiembre** (`U5-04`: alta → media): Las líneas 410-445/476-481 del hallazgo hoy son 535-560 / 612 / 677 / 855. Severidad media, no alta: «Ahora no» es un toque y la misión se lee igual; lo que sigue mal es el silencio sin señal (mensaje vacío) y el modal cada sesión. Arreglo de horas: en el…

> ✓ **Confirmado el 9 de septiembre** (`U7-10`). Matiz del revisor: Quitar de la evidencia el «deslizar 8 pantallas» (la barra ya está arriba). Mantener: modal de 5 campos + casilla antes de leer una línea, y franja repetida. La recomendación coincide con el pendiente B4-02 (un campo: la clave de

> ✓ **Confirmado el 9 de septiembre** (`U9-07`). Matiz del revisor: Severidad media se mantiene. Corrección de evidencia: hoy son 641 px / 640 (no 587). La parte de tono («explorador») es de minutos; la de no bloquear la lectura es de horas, porque la puerta perezosa ya existe en

Al abrir cualquier misión aparece una ventana que tapa todo: nombre, número de lista, escuela,
grado y sección, código de aula. Ocupa 587 de los 640 píxeles del teléfono barato.

Las cinco personas tocaron «Ahora no». La de 4º lo resumió así: «no sé qué es eso; lo que haga no
será de nadie».

El revisor corrigió un punto del auditor: es **falso** que «Ahora no» deje los resultados sin
dueño para siempre, porque la omisión se guarda solo para esa pestaña. Pero el efecto en el
recorrido queda: el alumno de 7º ve después, al pie de cada sección, la franja «Aún no te has
identificado».

Y hay un detalle que agrava: **sin señal, la casilla del código de aula no dice nada**. El error
se traga y el dato se guarda sin maestro.

### 4. El quiz avanza solo en 1,6 segundos

`U6-06 + U9-11 + U7-11` · esfuerzo horas

> ✅ **Corregido antes de esta revisión** (`U6-06`, comprobado el 9 de septiembre contra `d940fe0`): Top-20 #14 (6 de septiembre). En fracciones.js ya no existe el setTimeout(…,1600) (grep vacío); showQz (:111) limpia #fbQz al pintar la siguiente y se avanza con «▶ Siguiente» (:118). Reproducido hoy: contesto mal la pregunta 1, espero 2,2 s y sigue «¿Qué indica el numerador de una fracción?» (qzIdx 0) con el botón «▶…

> ↕ **Severidad ajustada por el revisor del 9 de septiembre** (`U9-11`: media → baja): Baja, no media: el alumno ya ve cuál era la correcta y el tiempo que quiera; lo que falta es el porqué, que es escribir contenido para las 66 misiones (semanas, no días). El esfuerzo del hallazgo estaba

> ✓ **Confirmado el 9 de septiembre** (`U7-11`). Matiz del revisor: Dejar solo: la pista cuesta 2 XP y se niega a quien tiene 0 (decimales.js:170-171), que es justo quien más la necesita. Recomendación: pista gratis con tope por

Al fallar: «Incorrecto. Revisa la respuesta correcta», y a los 1,6 segundos ya está la pregunta
siguiente. Ninguna de las personas alcanzó a leer cuál era la buena.

El contraste está dentro del propio producto: «Predice» explica el porqué y **espera**. Las
personas lo notaron sin que se les dijera.

### 5. Las estrellas se regalan

`U5-06 + U6-05 + U7-04` · esfuerzo horas

> ✅ **Corregido antes de esta revisión** (`U5-06`, comprobado el 9 de septiembre contra `d940fe0`): Era cierto y hoy no pasa: js/estrella-ganada.js (cargado en el <head>, verificado en la misión) envuelve fin/genEval/gradeEval: nada se marca antes del primer gesto del alumno, genEval ya no da la estrella (líneas 186-190 la deshacen) y la da gradeEval. Medido hoy al cargar Múltiplos: `.nav-t.done` = [] con XP ⭐0 (captura…

> ↕ **Severidad ajustada por el revisor del 9 de septiembre** (`U6-05`: media → baja): Condicionar el botón de la Constancia a un umbral (p. ej. ≥60 % de secciones o prueba ≥70) o cambiar el rótulo a «Ver mi avance» cuando no se cumpla; y en estrella-ganada.js dar la estrella de Evaluación solo si la nota ≥ un mínimo (o al menos si hay alguna…

> ✅ **Corregido antes de esta revisión** (`U7-04`, comprobado el 9 de septiembre contra `d940fe0`): Top-20 #10. js/estrella-ganada.js va en el `<head>` de las tres misiones citadas (Ángulos línea 48, Decimales 30, FG7 27, antes de `</head>`) y envuelve `fin`/`genEval`. Medido hoy con localStorage limpio: Ángulos `done:[] xp:0`, chips con clase done 0/13; Decimales `[]`; Fin de Grado 7º `[]`. Ninguna sección aparece hecha al…

Al **cargar** la misión, tres o cuatro secciones ya aparecen marcadas como hechas, porque se
marcan al pintarse. La Evaluación se marca al generarse el examen, o sea al abrir la pestaña.

El alumno de 7º, que tiene trece años, lo leyó como corresponde: «para un chico de mi edad es la
prueba de que el sistema no mide nada».

Y al pie de la Evaluación hay un cartel fijo que dice «¡Misión completada! Ver mi Constancia»,
visible **con cero puntos**. El de 9º lo dijo claro: un alumno lee «completada» y cierra la
misión creyendo que terminó.

## Lo que le pasa a cada edad

### La alumna de 4º: el contenido se le va de las manos

`U4-05` · alta · error · esfuerzo días

La misión «del Cien al Millón», que el mapa asigna a 4º, le pide formar números de **nueve
cifras**. El currículo de 4º llega a un millón.

El revisor localizó mejor el problema: no está en el Laboratorio, como decía el auditor, sino en
el **generador de tareas**, que pasa del millón en cuatro de cada siete tareas.

Y hay texto que no es para ella. En la portada, una cita de José Cecilio del Valle. Entre los
botones principales, «Zona Docente» y una tarjeta para madres y padres: **de lo que ve al abrir,
buena parte no es suyo**. En la sección de Lectura, antes de leer, hay dos párrafos escritos para
la maestra: «En un aula de 43…», «¿La estás proyectando?».

### El alumno de 7º: nada de su nivel, y una actividad que no funciona

`U7-01` · alta · faltante · esfuerzo meses · impacto educativo 5/5 · comercial 5/5

> ✓ **Confirmado el 9 de septiembre** (`U7-01`). Matiz del revisor: Reescribir la evidencia: quitar el «sin mensaje» (existía) y el «no se muestra el grado» (resuelto en js/grado-alumno.js). Dejar el hallazgo como faltante de CONTENIDO: 0/47 misiones exclusivas de III Ciclo en dcnb-map.js; las 27 que el chip de 7º le ofrece…

Buscó «enteros», «ecuaciones», «negativos», «séptimo». Cero resultados. Las dos misiones que le
tocaban preguntan «¿cuánto mide un ángulo recto?» y «¿qué símbolo separa la parte entera?».

El dato duro: el propio mapa del proyecto **no tiene ninguna misión mapeada solo a 7º, 8º o 9º**.
La única de su nivel es la Prueba de Fin de Grado de 7º, y esa sí le pareció suya: enteros, valor
absoluto, regla de tres, contextos de lempiras y el comal de doña Fina.

Y encontró una actividad rota: **«Clasifica» de Números Decimales solo funciona con ratón**. Está
hecha con arrastre de HTML5, que en Chrome de Android no se dispara con el dedo. La propia
normativa del proyecto lo dice, para otra pantalla.

Sobre el tono: mascota «Deci», «¡Hola, explorador!», rango «Novato ✏️». A los trece años eso es
una señal de que la aplicación no es para él.

### El alumno de 9º: nada suyo que no sea también de 4º

`U9-01`, `U9-02`, `U9-04` · alta

Midió con el mapa del propio proyecto: de 66 misiones, **14 tocan 9º**, 33 no lo tocan, y 19 no
tienen grado. La aplicación no le enseña nada de eso: ve las mismas 66 tarjetas que un niño de
4º, con el selector de grado **oculto en el código**.

La Ruta de la Meta, que es donde buscaría su repaso de fin de Básica, acaba en 7º y se presenta
como «Etapa 4 de 4»: se lee como terminada. Y él es el que más lo necesita, porque está saliendo
de Básica.

La única misión de inglés es «Good morning, my name is», nivel Pre-A1, que el currículo sitúa en
7º. Para 9º pide renarrar y opinar.

Y el diagnóstico, contestado todo bien, lo mandó a «El Adjetivo Avanzado», que abre hablando del
«núcleo del Sintagma Adjetival» y del Acuerdo de la Nueva Gramática. **Es la única misión de
Bachillerato del catálogo, y ni la tarjeta ni el diagnóstico lo dicen.**

## Detalles medidos que valen su arreglo

- **Los blancos de toque son pequeños** (`U4-10`): las opciones de Predice miden 34 píxeles, las
  pestañas 39, los botones del pie 27, las celdas de la sopa de letras 27. La regla que el propio
  proyecto se dio para los juegos 3D es 44.
- **Instrucciones de ratón en una aplicación de teléfono** (`U5-12`, `U7-12`): «haz clic»,
  «Arrastra», «Enter para voltear», con icono de ratón.
- **En horizontal el encabezado se come la pantalla** (`U6-12`, `U7-12`): en 873×393 la barra y el
  hero ocupan 375 de 393 píxeles y del quiz solo asoma el título. En la portada acostada, el botón
  «Misiones» queda fuera de pantalla.
- **El letrero animado del encabezado es de otra misión** (`U5-08` ✅ corregido, `U6-07` ✅ corregido, `U4-09`): detrás del
  título de Sólidos Geométricos, de Múltiplos y de otras cinco desfila «RECTA NUMÉRICA · ORIGEN ·
  ESCALA · PUNTO MEDIO · SUSTRAENDO». Se arregla en una hora.
- **«Reiniciar XP» está en el pie de cada misión, sin confirmación** (`U4-08`, `U6-10`). El
  revisor descubrió que además **miente y luego no miente**: al recargar el XP vuelve, pero si el
  alumno completa una sección nueva, ahí sí se escribe el cero.
- **El generador de tareas le enseña al alumno las respuestas de su propia tarea** con un toque
  (`U9-12` ✗ descartado el 9-sep).
- **Las cabeceras «Etapa N de M» están escritas a mano** y contradicen al catálogo en diez
  misiones (`U9-05`): Saludos dice «1 de 8» y la ruta tiene una. Es justo lo que la normativa del
  proyecto prohíbe.
- **La pestaña de videos está vacía en 19 de las 20 misiones de Matemáticas** (`U5-09`, `U6-04`,
  `U7-07`): «Vuelve a entrar en unos días». Tres personas la tocaron y las tres lo anotaron como
  decepción.

## En el escritorio

El alumno de 9º probó en 1280×720, que es el laboratorio de cómputo. Funciona sin romperse:
columna centrada de 960 píxeles, dos tarjetas por fila, el ratón responde, el tabulador llega a
las pestañas. Pero **es un teléfono estirado**: no aprovecha el ancho. Ninguna de las pantallas
usa el espacio que hay.

## Lo que faltaba probar, y ya está probado

Esta parte del encargo quedó sin cubrir el 6 de septiembre, cuando se agotó el límite de uso: eran
**cuatro de las nueve personas que se pidieron** y una lente transversal. El 9 de septiembre se
corrieron todas, sobre el código de ese día, y cada una tiene su sección:

| persona | por qué importa | dónde está |
|---|---|---|
| **Alumna de 8º grado** (U8) | Completa la serie de 4º a 9º | `3c-ux-octavo-grado.md` |
| **Docente** (U10) | Es el usuario que decide si la plataforma entra al aula | `3b-ux-docente-familia-direccion.md` |
| **Madre o padre de familia** (U11) | Es quien recibe el enlace por WhatsApp y la clave de familia | `3b-ux-docente-familia-direccion.md` |
| **Administración y dirección** (U12) | Es quien firmaría una compra institucional | `3b-ux-docente-familia-direccion.md` |
| **Arquitectura de la información** (U13) | El mapa de navegación por rol, y la consistencia visual entre las páginas | `3b-ux-docente-familia-direccion.md` |

Lo que aquí se leía de refilón en las lentes pedagógicas y de producto —lo que verían el docente y
la familia— ahora tiene su recorrido propio, con diario y capturas, y es donde salieron los
hallazgos de más peso de esa segunda corrida: la nota que se guarda distinta de la que se muestra,
el «asiento apartado» que no se mandó, la directora que no ve nada.

## Cobertura y límites

Se probaron doce misiones de las 66. Chromium emulando pantallas táctiles, no teléfonos físicos,
y nada en iOS. Los tiempos de carga bajo red lenta son con estrangulamiento emulado, no con la
red de un pueblo real. Las mediciones de palabras por frase y de nivel de lectura las hizo el
propio auditor con guiones, y el revisor no las recalculó en todos los casos.

## Revisión adversarial del 9 de septiembre de 2026 (ux)

Las notas «top-20 #N» de los veredictos apuntan a la lista del 6 de septiembre, ya ejecutada (`5-top-20-septiembre-6.md`); la lista vigente es `5-top-20.md`.

Los 36 hallazgos de esta área que se quedaron sin revisor en la primera corrida pasaron el 9 de septiembre por un revisor adversarial, contra el código de ese día (`d940fe0`, con las 20 modificaciones ya aplicadas). Resultado: **27 siguen en pie** (8 con la severidad ajustada), **9 eran ciertos y ya están corregidos**, y **0 se cayeron**.

### Confirmados y ya corregidos

| ID | título | qué lo corrige |
|---|---|---|
| U5-01 | El buscador no encuentra «multiplos» sin tilde (ni «matematicas», ni «numero») | Era cierto en 9ce2ac1 y hoy está corregido: js/app.js:536-543 define `sinTildes` (NFD + quita diacríticos + normaliza º/°) y js/app.js:637-645 la aplica a los dos lados y palabra por palabra (título + materia + ruta + grado). Medido hoy en el navegador con renderMissions('all', q): «multiplos» → 1 tarjeta, «matematicas» → 20, «numero» → 13, «primos» → 1, «quinto»/«5to» → 34. Lo vigila _dev/verifica-buscador.js. |
| U5-06 | Cuatro pestañas ya aparecen «hechas» (⭐) al abrir la misión sin haber hecho nada | Era cierto y hoy no pasa: js/estrella-ganada.js (cargado en el <head>, verificado en la misión) envuelve fin/genEval/gradeEval: nada se marca antes del primer gesto del alumno, genEval ya no da la estrella (líneas 186-190 la deshacen) y la da gradeEval. Medido hoy al cargar Múltiplos: `.nav-t.done` = [] con XP ⭐0 (captura revision/U5/02-carga.png). Lo vigila _dev/verifica-estrella-ganada.js. Queda un flanco nuevo que anoto aparte: calificar en blanco (0/100) también da la estrella. |
| U5-08 | El letrero animado del encabezado muestra términos de OTRA misión en 6 misiones de matemáticas | Era cierto en 9ce2ac1 y lo corrigió el commit b0d0473 (6 de septiembre). Verificado hoy en las 6 carpetas citadas: `.hero::before{content:…}` lleva el vocabulario propio (Múltiplos: «MÚLTIPLO · DIVISOR · NÚMERO PRIMO · NÚMERO COMPUESTO · CRIBA DE ERATÓSTENES…»; maya: «NUMERACIÓN MAYA · PUNTO · BARRA · CARACOL…»; sólidos: «SÓLIDO · CARA · ARISTA…»; volumen: «VOLUMEN · CUBO · PRISMA…»; decimales: «MULTIPLICACIÓN · DECIMAL · PUNTO DECIMAL…»; fracciones ×÷: «MULTIPLICAR FRACCIONES · DIVIDIR FRACCIONES…»), y el computed content medido en el navegador coincide. Queda solo lo estético: en 393 px el letrero se dibuja detrás del título y lo ensucia (captura revision/U5/02-carga.png), pero eso no es lo que el hallazgo denunciaba. |
| U6-01 | Las respuestas de la Prueba de Fin de Grado se pierden al cambiar de materia o recargar | Era cierto en 9ce2ac1 y hoy está corregido (top-20 #13, 7 de septiembre). misiones/fin-de-grado-6to/js/fin-de-grado-6to.js:1348 (EVAL_RESP_KEY = SAVE_KEY+'_resp'), :1376-1391 (se guarda forma + huella + respuestas y solo se devuelven si la huella coincide), :1420 evalNueva() pregunta antes de borrar, :1447 lo mismo para la operativa. Reproducido hoy con Playwright (scratchpad/revision/U6/salida.json): 1 respuesta marcada → cambiar a Español y volver → 1 → recargar → 1. Lo vigila _dev/verifica-fin-de-grado-respuestas.js. Queda fuera del hallazgo, pero conste: las otras 62 misiones siguen perdiendo las respuestas al recargar (fracciones.js:43 saveProgress no guarda respuestas). |
| U6-03 | 16-20 pestañas en una nube al final del documento: la alumna no sabe dónde está ni cuánto falta | La consecuencia del hallazgo —no encontrar la barra ni saber dónde se está— ya no ocurre. css/barra-secciones.css:36 y :85 (.bs-marco position:sticky; top:0; z-index:60) y js/barra-secciones.js enganchados en fracciones.html:18/653, solidos-geometricos.html:18/922, fin-de-grado-6to.html:18/696. Medido hoy en Fracciones: la barra arranca a 124 px del borde superior, visible sin deslizar, 16 chips en UNA fila que se desliza, chip activo resaltado (captura frac-apaisado-quiz.png). Lo que no se hizo —agrupar en 5-6 bloques, «Paso 3 de N», renombrar «Widgets»/«Lab»— es contenido misión por misión y sin la barra al fondo ya no tiene la consecuencia de «se pierde»: queda como pulido (baja), no como el hallazgo alta que era. |
| U6-06 | El quiz castiga sin explicar y avanza solo a los 1,6 s | Top-20 #14 (6 de septiembre). En fracciones.js ya no existe el setTimeout(…,1600) (grep vacío); showQz (:111) limpia #fbQz al pintar la siguiente y se avanza con «▶ Siguiente» (:118). Reproducido hoy: contesto mal la pregunta 1, espero 2,2 s y sigue «¿Qué indica el numerador de una fracción?» (qzIdx 0) con el botón «▶ Siguiente» en pantalla (captura frac-quiz-fallo.png). Lo vigila _dev/verifica-sin-autoavance.js en las 74. La segunda parte del hallazgo —una frase de explicación por pregunta— es contenido a escribir en 66 bancos y, sin el autoavance, la niña ya alcanza a leer cuál era la buena; queda como mejora de contenido, no como error. |
| U6-07 | El encabezado de Sólidos Geométricos desfila palabras de otra misión (Recta Numérica) | Era cierto en 9ce2ac1 (git show 9ce2ac1:…/solidos-geometricos.css → hero::before{content:'RECTA NUMÉRICA · ORIGEN…'}) y lo corrigió el commit b0d0473 (top-20 #11). Hoy solidos-geometricos.css:65 dice 'SÓLIDO · CARA · ARISTA · VÉRTICE · POLIEDRO…', y los otros cinco citados llevan sus propias palabras (volumen-cuerpos.css 'VOLUMEN · CUBO · PRISMA…', multiplos-divisores-primos.css 'MÚLTIPLO · DIVISOR…', numeracion-maya.css 'NUMERACIÓN MAYA · PUNTO · BARRA…', multiplicacion-decimales.css 'MULTIPLICACIÓN · DECIMAL…', fracciones-multiplicar-dividir.css 'MULTIPLICAR FRACCIONES…'). El grep de «RECTA NUMÉRICA» que aún da 13 archivos son comentarios de sección (/* ===== RECTA NUMÉRICA (prueba operativa) ===== */, línea 516/518) y el hero legítimo de 2ciclo-recta-numerica. Recorrí los 75 hero::before y ninguno lleva palabras de otro tema. |
| U7-02 | La barra de pestañas de la misión está al FINAL de la página, a 8–14 pantallas de distancia | Top-20 #9. Las tres misiones citadas cargan css/barra-secciones.css y js/barra-secciones.js (2 referencias cada una). Medido hoy en 360×640 al abrir Ángulos: nav top=124 px, una sola fila (h=65), `.bs-marco` position:sticky (css/barra-secciones.css:85); tras desplazar 2 500 px sigue en top=0 y visible. Ya no está al final ni a 5 375 px. |
| U7-04 | Cuatro secciones aparecen «hechas» (⭐) al abrir la misión sin haber tocado nada | Top-20 #10. js/estrella-ganada.js va en el `<head>` de las tres misiones citadas (Ángulos línea 48, Decimales 30, FG7 27, antes de `</head>`) y envuelve `fin`/`genEval`. Medido hoy con localStorage limpio: Ángulos `done:[] xp:0`, chips con clase done 0/13; Decimales `[]`; Fin de Grado 7º `[]`. Ninguna sección aparece hecha al abrir. |

## Revisión adversarial del 9 de septiembre de 2026 (ux-b)

Los 12 hallazgos de esta área que se quedaron sin revisor en la primera corrida pasaron el 9 de septiembre por un revisor adversarial, contra el código de ese día (`d940fe0`, con las 20 modificaciones ya aplicadas). Resultado: **8 siguen en pie** (5 con la severidad ajustada), **3 eran ciertos y ya están corregidos**, y **1 se cayeron**.

### Confirmados y ya corregidos

| ID | título | qué lo corrige |
|---|---|---|
| U9-01 | El alumno no puede saber qué misiones son de su grado: la app oculta el grado a propósito y no lo pregunta | Era cierto en 9ce2ac1 y hoy está corregido por `js/grado-alumno.js` (144 líneas) enganchado en `index.html` (`#grado-chips`) y en el buscador (`js/app.js:640-644`, `GradoAlumno.textoBusqueda`). Reproducido hoy con un alumno que escribió «9no B» en `METAS_ALUMNO_V1` (pw3.js): la vista Misiones sale con los rótulos «📚 Para 9º grado 14» y «También puedes con estas 53» (14+53 = 67, no se filtra nada), el chip 9º marcado solo, y buscar «noveno», «9º» y «9no» devuelve 14 misiones (antes 0). `node _dev/prueba-grado-alumno.js` en verde (4º=29 · 5º=34 · 6º=33 · 7º=27 · 8º=16 · 9º=14). El `<div class="selector-group" hidden>` de `index.html:234` sigue ahí como código muerto, sin consecuencia. |
| U9-03 | «Abrir carpeta en Google Drive» apunta a carpetas inexistentes (ID de relleno) en 31 misiones, incluidas las tres del recorrido | Era cierto y hoy no queda ni un identificador de relleno: `grep -lE 'folders/1[a-z_]+_recursos' misiones/*/*.html` da 0 (antes 31). En La Célula (`misiones/2y3ciclo-la-celula/la-celula.html:552`) el botón se sustituyó por el texto «Esta misión todavía no tiene carpeta de materiales en línea. Lo que sí está listo es la ficha imprimible de aquí arriba», que es exactamente lo que pedía la recomendación. Los 33 enlaces que quedan tienen forma de carpeta real (20 comparten `1vUVVqFSWv-…`, 3 `1eQSt36l…`, 10 propios). La sonda pedida existe y pasa: `node _dev/verifica-enlaces-drive.js` → «✓ ningún botón lleva a una carpeta que no existe». Lo que la sonda no puede ver, y lo dice, es si las carpetas reales siguen compartidas. |
| U9-08 | La barra de secciones está al final de la página: 4,6 pantallas de scroll en 393 px y 6,5 en 360 px antes de poder saltar al Quiz | Corregido en las 74 misiones por `css/barra-secciones.css` + `js/barra-secciones.js` (modificación 9 de la lista; normativa «la barra de secciones va ARRIBA, y no se va» en CLAUDE.md). Medido hoy en La Célula a 360×640 (pw1.js): al abrir, la barra está en `top: 161 px` —dentro de la primera pantalla, antes eran 4 156 px—, y tras desplazar 2 000 px sigue pegada en `top: 0` (captura 02-nav-scrolled-360.png: una sola fila deslizable con Aprende·Tipos·Lab·Flashcards…). Los 15 chips van en una fila. Lo vigila `_dev/verifica-barra-secciones.js`. |

### Descartados en la revisión adversarial

| ID | título | motivo |
|---|---|---|
| U9-12 | El «Generador de Tareas» le enseña al alumno las respuestas de su propia tarea con un toque | El hecho es cierto y sigue (`la-celula.html:482` «👁 Respuestas» → `toggleAns()` en `la-celula.js:298`; reproducido: las respuestas se muestran con un toque), pero la consecuencia no se sostiene. La sección se presenta como ejercicios para el cuaderno sin calificación ni nota que llegue a ningún expediente (CLAUDE.md: «la sección de tareas no tiene calificación»), así que enseñar la clave es autocorrección, el mismo patrón que el proyecto decidió a propósito para la Evaluación en la modificación 2 («la pauta ES el modo»: practicar con la clave delante está bien; lo que no puede es contar como nota). No hay evidencia de que sea «una herramienta del maestro»: el maestro tiene su ficha imprimible y su pauta aparte. Y quitarla no arregla nada medible para el alumno de 9º. |
