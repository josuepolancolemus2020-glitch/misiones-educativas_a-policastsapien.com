# Auditoría UX/UI: la aplicación probada como alumno de 4º, 5º, 6º, 7º y 9º grado

Cinco personas recorrieron la aplicación de verdad, con un navegador Chromium controlado paso a
paso, en pantallas de 393×873 y 360×640 (el teléfono barato), y en 1280×720 para el laboratorio
de cómputo. **Siempre sin internet**, con Supabase, YouTube y el CDN cortados, porque ese es el
caso normal del aula. Cada persona llevó un diario en primera persona, con captura en cada paso.
Son 60 hallazgos, 12 verificados por el revisor adversarial y el resto sin revisar.

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

Al fallar: «Incorrecto. Revisa la respuesta correcta», y a los 1,6 segundos ya está la pregunta
siguiente. Ninguna de las personas alcanzó a leer cuál era la buena.

El contraste está dentro del propio producto: «Predice» explica el porqué y **espera**. Las
personas lo notaron sin que se les dijera.

### 5. Las estrellas se regalan

`U5-06 + U6-05 + U7-04` · esfuerzo horas

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
- **El letrero animado del encabezado es de otra misión** (`U5-08`, `U6-07`, `U4-09`): detrás del
  título de Sólidos Geométricos, de Múltiplos y de otras cinco desfila «RECTA NUMÉRICA · ORIGEN ·
  ESCALA · PUNTO MEDIO · SUSTRAENDO». Se arregla en una hora.
- **«Reiniciar XP» está en el pie de cada misión, sin confirmación** (`U4-08`, `U6-10`). El
  revisor descubrió que además **miente y luego no miente**: al recargar el XP vuelve, pero si el
  alumno completa una sección nueva, ahí sí se escribe el cero.
- **El generador de tareas le enseña al alumno las respuestas de su propia tarea** con un toque
  (`U9-12`).
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

## Lo que falta probar

Esta es la parte del encargo que quedó sin cubrir cuando se agotó el límite de uso, y son
**cuatro de las nueve personas que se pidieron**:

| persona | por qué importa |
|---|---|
| **Alumna de 8º grado** | Completa la serie de 4º a 9º |
| **Docente** | Es el usuario que decide si la plataforma entra al aula |
| **Madre o padre de familia** | Es quien recibe el enlace por WhatsApp y la clave de familia |
| **Administración y dirección** | Es quien firmaría una compra institucional |
| **Arquitectura de la información** | El mapa de navegación por rol, y la consistencia visual entre las 17 páginas |

Las tres lentes pedagógicas y la de producto tocan de refilón lo que verían el docente y la
familia, y sus hallazgos están en esos capítulos. Pero **nadie recorrió la aplicación como
maestro, como madre ni como director**, y eso es exactamente lo que el encargo pedía. Está
preparado para retomarlo: los guiones y la lista de tareas quedan en `maquinaria/RETOMAR.md`.

## Cobertura y límites

Se probaron doce misiones de las 66. Chromium emulando pantallas táctiles, no teléfonos físicos,
y nada en iOS. Los tiempos de carga bajo red lenta son con estrangulamiento emulado, no con la
red de un pueblo real. Las mediciones de palabras por frase y de nivel de lectura las hizo el
propio auditor con guiones, y el revisor no las recalculó en todos los casos.
