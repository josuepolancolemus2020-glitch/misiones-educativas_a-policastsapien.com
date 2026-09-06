# Auditoría pedagógica (I): DCNB, coherencia curricular, nivel cognitivo y contenido

Cuatro lentes (P1 correspondencia con el DCNB, P2 coherencia de la cadena, P3 nivel cognitivo,
P10 calidad del contenido), 48 hallazgos, **46 verificados** y dos tumbados por el revisor. El
crítico pasó además por un segundo escéptico.

## Resumen

Los auditores contrastaron doce misiones contra el DCNB troceado que el propio repositorio trae,
trazaron la cadena completa en seis misiones, contaron los bancos de siete con un script, y
recalcularon en Node las respuestas de 1 220 ítems generados. Ese último dato conviene decirlo
primero: **cero errores de cálculo** en las 20 formas de la Prueba de Fin de Grado de 6º y en las
30 de Fracciones, y las pautas impresas coinciden ítem por ítem con sus claves. La aritmética del
proyecto es sólida.

El corpus de lectura (400 textos hondureños, bien escritos, con humor y dignidad, con preguntas
tipificadas) es, en palabras del auditor de contenido, «probablemente el mejor activo de
contenido de la plataforma». El inglés de la misión de saludos y la traducción de autor de
Robótica son naturales, no calcadas. No hay lenguaje sexista ni estereotipos. Y tener el DCNB
completo troceado con índice dentro del repositorio es un activo raro que casi ninguna plataforma
tiene.

Dicho eso, hay cuatro problemas de fondo.

**Un alumno se pone él mismo 30 de los 100 puntos, y esa nota llega al maestro.** En siete
misiones de Programación y Robótica, la sección «Problemas de la vida real» de la prueba
operativa son casillas numéricas que rellena el propio alumno, y el total se registra como nota
calificada. Está comprobado con el navegador: sin contestar nada, escribiendo diez en cada
casilla, la pantalla dice «Resultado: 30/100» y el maestro lo recibe como si el programa lo
hubiera corregido.

**La promesa «alineadas al DCNB» no la sostiene el catálogo.** Matemáticas tiene **cero misiones
en 8º y 9º**; no hay ni una de estadística, gráficas, promedio o probabilidad en ningún grado de
4º a 9º, aunque el DCNB dedica un bloque a Estadística en todos; ni una de medidas de longitud,
peso, tiempo o moneda; ni de enteros, álgebra o ecuaciones. Español cubre uno de sus cuatro
bloques. Sociales tiene cinco misiones para cuatro bloques y seis grados, con la historia de
Honduras (independencia, reforma liberal, siglo XX) ausente por completo.

**El 70 % del catálogo sirve el mismo texto a un niño de 9 años y a uno de 15.** Cuarenta y seis
misiones son «II y III Ciclo» y por dentro no distinguen grados. La Célula enseña ADN,
ribosomas, procariotas y mitosis, y el mapa la programa para 4º, donde el DCNB solo pide
reconocer que las células existen.

**Es una plataforma de memorización gamificada, muy bien hecha.** De los trece tipos de
actividad del motor, nueve son cerrados y de recordar o comprender. En pantalla, **ninguna
respuesta abierta del alumno se guarda, se lee ni se corrige**.

## Lo crítico

### Treinta de cien puntos los escribe el alumno y llegan al maestro como nota

`P2-02` · crítica · error · esfuerzo horas · impacto educativo 5/5 · comercial 4/5

La sección «Problemas de la vida real» de la prueba operativa no se califica: son tres casillas
numéricas de 0 a 10 que el alumno rellena, y la función de calificación las suma al total sin
comprobar nada. Ese total se pinta como «Resultado: N/100 pts», que es exactamente el texto que
`js/metas-registro.js` lee para anotar la nota de la prueba operativa y mandarla al maestro.

- Comprobado con Playwright: sin contestar una sola pregunta y escribiendo diez en las tres
  casillas, la pantalla muestra «Resultado: 30/100 pts · Vida real: 30/30» y salta el aviso
  «Prueba operativa: 30/100».
- **El revisor amplió el alcance**: el mismo bloque existe en **siete** misiones, no en una.
  Bucles, Detective de Bugs, Mi Primer Programa, Pensamiento Computacional, Robot Mensajero,
  Variables y Robot Decide.
- Evidencia: `misiones/2y3ciclo-robot-decide/js/robot-decide.js:898` y `:942`;
  `js/metas-registro.js:131-138` y `:175-176`.
- Qué hacer: que la parte autopuntuada no entre en el «Resultado» que lee el registro. O se
  califica de verdad (los problemas pueden pedir la acción o la rama como opción cerrada, igual
  que las secciones anteriores), o el panel registra solo lo calificado por máquina («Resultado
  automático: N/70») y la rúbrica se anota aparte. Un `grep` de `parseInt(inp.value)` dentro de
  cualquier función de calificación encuentra el resto de los casos.

## Cobertura curricular

Cobertura estimada por unidades del DCNB con al menos una misión:

| área | 4º a 6º | 7º a 9º |
|---|---|---|
| Matemáticas | ~50 % (Estadística 0 %, Medidas ~25 %) | ~8 % (8º y 9º: cero misiones) |
| Español | ~25 % (solo gramática y ortografía) | ~15 % |
| Ciencias Naturales | ~45 % | ~25 %, con textos de nivel II ciclo |
| Ciencias Sociales | ~15 % | ~10 % |
| Inglés | ~3 % | 0 % |
| Educación Física y Artística | 0 % | 0 % |
| Tecnología | — | 0 % |

### El III Ciclo de Matemáticas está casi vacío

`P1-01` · alta · faltante · esfuerzo meses · impacto educativo 5/5 · comercial 5/5

Según el propio mapa del proyecto, 8º y 9º tienen cero misiones de Matemáticas, y las cinco de 7º
son las mismas de II ciclo. El DCNB de 7º a 9º dedica un bloque entero al Álgebra y otro a
Estadística en todos los grados. La plataforma se anuncia para 4º a 9º y en la mitad alta del
rango un maestro de Matemáticas no encuentra nada suyo.

El revisor corrigió dos conteos del auditor y añadió un matiz justo: el maestro de 7º **sí**
encuentra algo, la Prueba de Fin de Grado de 7º, que trae laboratorios de enteros, ecuaciones y
regla de tres, aunque sea repaso y no enseñanza. Y señaló que la tabla de cobertura honesta que
el auditor pedía **ya está escrita** en `PROPUESTA-MATEMATICAS-DCNB-2026.md`: lo que falta es
publicarla y consumirla, no redactarla.

### Español cubre un bloque de cuatro; Sociales deja fuera la historia de Honduras

`P1-11` y `P1-12` · media · faltante · esfuerzo semanas

Las ocho misiones de Español son siete de «Reflexión sobre la lengua» y una de lectura. El DCNB
organiza cada grado en Lengua oral, Lectura, Escritura y Reflexión sobre la lengua, y en III
ciclo añade literatura y textos argumentativos. Además el mapa marca las ocho como «espiral, todo
el año» para todos los grados sin evidencia: el DCNB de 6º no menciona «adverbio» ni una vez.

En Sociales, cuatro misiones son de geografía y una de historia precolombina. No hay conquista,
colonia, independencia, reforma liberal ni siglo XX hondureño; tampoco los bloques de ciudadanía
y economía. El revisor añadió que la misión del Mitch, mapeada como de Sociales y Naturales, está
etiquetada como «naturales», así que el maestro de Sociales tampoco la ve al filtrar: la
cobertura efectiva es aún menor que la contada.

### Cuarenta y seis misiones para dos ciclos a la vez

`P1-02` · alta · error · esfuerzo semanas · impacto educativo 5/5

El 70 % del catálogo lleva grado «II y III Ciclo» y el mapa asigna la misma misión a hasta cinco
grados, pero dentro no hay capas: cero menciones de grado en el HTML y el JS de las misiones
revisadas. El único contenido diferenciado por grado en todo el catálogo es el corpus de lectura
de dos misiones.

En los dos sentidos: La Célula tiene 95 menciones de ADN, ribosomas, procariotas, lisosomas y
mitosis, y el mapa la programa para 4º en abril. Fracciones se programa para 7º y no contiene ni
una fracción negativa, que es justo lo que el DCNB de 7º pide.

- Qué hacer: decidir un nivel de escritura por misión y declararlo; para las que el mapa reparte
  entre dos ciclos, partirlas (como ya se hizo con Fracciones y con Multiplicación de Fracciones)
  o añadir una capa de III Ciclo al Aprende y a la evaluación.

### El mapa DCNB cita una fuente que no está y contradice al DCNB que sí está

`P1-03` · media · error · esfuerzo días

El encabezado del mapa dice que se verificó contra las Programaciones Educativas Nacionales «mes
a mes el 21 de julio de 2026». Esas Programaciones **no están en el repositorio**, así que nadie
puede recomprobarlas: es exactamente el «buscar no es leer» que el propio proyecto documentó como
error caro. Cruzado con el DCNB que sí está, el mapa falla en al menos seis entradas (Sistema
Nervioso a 5º y 6º, donde no aparece ni una vez; Endocrino a 6º; Coordenadas a 5º) y omite grados
donde el DCNB sí lo trabaja (Continentes en 8º, con 26 menciones).

No existe ninguna sonda que valide el mapa, a diferencia de casi todo lo demás del proyecto. El
revisor bajó la severidad a media con un argumento correcto: las Programaciones **sí** reordenan
contenidos por mes, así que una diferencia no es automáticamente un error. Pero en los casos de
contenido que no existe en ese grado, la Programación no puede inventarlo.

### El mapa curricular publicado está congelado en julio

`P1-08` · baja · deuda · esfuerzo horas

La página que el manual ofrece al maestro para comprobar la alineación dice «Matemáticas, 15
existentes» cuando hay 20, «Naturales, 5» cuando hay 14, y anuncia dos rutas que no existen. No
lee el catálogo: cero referencias. El revisor corrigió el marco (la página se declara plan, va
fechada y es solo para el docente, así que cumple la norma del propio proyecto), pero el defecto
real queda: los «existentes» se congelaron mientras entraban catorce misiones.

## La cadena está rota en el primer eslabón y en el último

### Ninguna misión declara qué expectativa del DCNB cubre

`P2-01 + P1-09` · alta · faltante · esfuerzo semanas · impacto educativo 4/5 · comercial 4/5

Las misiones abren con un eslogan y pasan directo a Aprende. Ni el alumno ni el maestro ven qué
expectativa de logro se trabaja ni qué debería poder hacer el alumno al terminar. De 66 misiones
del alumno, cero mencionan «expectativa de logro» y cero nombran bloque o grado del currículo.
Las fichas traen «Objetivos de aprendizaje», pero redactados por el autor, sin referencia al
currículo. La plantilla de misiones nuevas tampoco lo exige.

Sin ese eslabón el maestro no puede planificar («¿esta misión cubre mi Bloque 3?»), ni juzgar si
la evaluación mide lo que el currículo pide, ni defender ante su director por qué la usa.

El revisor matizó dos cosas: la Zona Docente **sí** consume el mapa y le muestra al maestro grado
y meses, así que lo que falta es la expectativa, no todo vínculo curricular. Y el esfuerzo estaba
subestimado: escribir expectativa y página del PDF para 66 misiones, confirmándola en el PDF como
manda la norma del proyecto, es de semanas. Las veinte de Matemáticas sí caben en días.

### La evaluación repite el quiz y los verdaderos ganan dos a uno

`P2-06` · alta · error · esfuerzo días · impacto educativo 4/5

La prueba final mide memoria de la pantalla anterior. En Geografía las **nueve** preguntas del
quiz están copiadas palabra por palabra en el banco del examen; en La Célula, siete de las ocho
de «Completa». Como cada forma saca cinco de quince, más de la mitad de los ítems que el alumno
recibe los acaba de contestar con retroalimentación.

Y los bancos de verdadero o falso están descompensados: diez verdaderas y cinco falsas en
Fracciones, Célula y Geografía. **Marcar «verdadero» en todo da unos 17 de 25 puntos.** Esa nota
va al expediente.

El revisor añadió que en Perímetro es peor por otra vía: los bancos tienen ocho ítems y se sacan
cinco por forma, con treinta formas declaradas, así que «las 30 formas» son casi la misma prueba.

### La Célula no tiene ni un dibujo de célula; Geografía de Honduras, ni un mapa

`P2-04` · alta · incompleto · esfuerzo días · impacto educativo 5/5

El DCNB de 5º pide observar el esquema de una célula y distinguir sus orgánulos, y elaborar un
recortable. El de Sociales repite «elaboran mapas», «ubican en un mapa» en casi cada actividad.
Las dos misiones son cien por ciento texto: el laboratorio es un combinador de tarjetas que
produce párrafos, y «¿Caribe o Pacífico?» se responde de memoria sin ver un río.

Un alumno puede sacar 100 en Geografía sin saber dónde queda el Golfo de Fonseca, y en Célula sin
haber visto una célula. La propia ficha admite el hueco: le pide al docente que complete
«dibujando el mapa de Honduras».

- Qué hacer: un SVG del mapa con los 18 departamentos como trazados tocables (pesa unos pocos KB
  e imprime siempre, que es la regla del propio proyecto), y un SVG de célula con orgánulos
  tocables, que es literalmente el recortable que pide el DCNB. El generador de SVG de la
  operativa de Fracciones ya existe como patrón.

### Las actividades «gráficas» de Fracciones describen el dibujo con palabras

`P2-08` · alta · incompleto · esfuerzo días

Las dos actividades pensadas para leer representaciones no muestran nada: describen «un círculo
dividido en 4 partes iguales, con 3 partes sombreadas» y ofrecen 1/4, 2/4, 3/4, 4/4. El alumno
lee «4 partes, 3 sombreadas» y copia la respuesta. Es comprensión lectora, no representación de
fracciones. La operativa ya se corrigió con SVG, pero la corrección no se llevó a la práctica que
la precede.

### Perímetro y Área de Cuadriláteros solo enseña dos de los cinco

`P2-05` · alta · incompleto · esfuerzo semanas

El título promete cuadriláteros y el DCNB de 5º exige las fórmulas de cuadrado, rectángulo,
rombo, romboide y trapecio. La misión lo dice ella misma: «en esta misión trabajamos dos».
Aprende, las flashcards, la evaluación conceptual y la operativa no mencionan rombo ni trapecio.
Mientras tanto **los seis juegos 3D sí trabajan las cuatro fórmulas**, y ese aprendizaje nunca se
mide.

El revisor añadió que la misión tampoco cubre 4º completo, porque el DCNB de 4º pide los mismos
cinco. Y ofreció el arreglo inmediato: renombrarla «Perímetro y área del cuadrado y el
rectángulo» cabe en horas, mientras se completa la versión buena.

### Se evalúa contenido que Aprende nunca enseña

`P2-09` · media · error · esfuerzo días

En La Célula se pide ordenar las fases de la mitosis, clasificar el aparato de Golgi y los
lisosomas, y la sopa incluye ENZIMA y MITOSIS: ninguno de esos términos aparece en el HTML de la
misión. Lo roto no es preguntarlo (el DCNB de 5º incluye reproducción celular) sino no enseñarlo.
En Adjetivos, las formas irregulares mejor, peor y pésimo aparecen en el quiz, en selección
múltiple y en completar, con cero menciones en Aprende.

El revisor corrigió una parte: el epíteto **sí** se enseña, en la flashcard 14. Lo demás se
sostiene.

- Qué hacer: una regla de cierre, todo término que se evalúa tiene que estar en Aprende, con una
  sonda que extraiga los términos de los bancos y los busque en el HTML.

### El puntaje no pondera la competencia

`P2-11` · media · error · esfuerzo días

El máximo es 200 XP. Voltear las catorce flashcards da 14 XP sin contestar nada; la sopa de
letras da 12; «Identifica» da 40; el quiz da 45. La evaluación, lo único sumativo, da **8 XP
planos** si se pasa de 70.

La «Constancia de logro» que el alumno comparte por WhatsApp muestra un porcentaje que es
simplemente el XP sobre 200: **se llega al 100 % de logro sin aprobar ningún examen**, y el
diploma se puede descargar con 0 %. El revisor apuntó el arreglo mínimo, de horas: dejar de
llamarla «logro», o condicionar el botón a haber calificado una evaluación.

## Nivel cognitivo

Estimación del tiempo del alumno en una misión típica de unos 100 minutos:

| nivel de Bloom | tiempo estimado |
|---|---|
| Recordar | ~30 % |
| Comprender | ~30 % |
| Aplicar | 25 a 35 %, si hay prueba operativa |
| Analizar | 5 a 10 % |
| Evaluar y crear | menos del 5 %, y solo si el maestro imprime |

### La única producción abierta se autocalifica y no llega al maestro

`P3-01` · alta · incompleto · esfuerzo días · impacto educativo 5/5

En 35 misiones con prueba de Pensamiento Crítico el alumno escribe en trece casillas de texto y
después **se pone él mismo la nota** en cinco casillas numéricas. Ese resultado no se registra: ni
el texto escrito ni la nota aparecen en la Evidencia del maestro. El manual promete que «la app
califica sola, ítem por ítem» para las dos pruebas, lo que para esta no es cierto.

Comprobado: con las trece casillas de texto vacías y un 20 en cada casilla de puntaje, la pantalla
muestra «Puntaje total autoevaluado: 100/100».

El revisor añadió tres cosas que lo agravan: la sección se marca como completada **al generar la
forma**, así que la Evidencia del maestro enseña «✅ Sección evaluación» aunque no se haya escrito
una letra; los XP con las casillas vacías inflan el porcentaje de la constancia; y el aviso
antitrampa no salta al imprimir la pauta de esta prueba.

### «Explica con tus palabras» no tiene dónde escribir

`P3-03` · media · error · esfuerzo días

La sección pinta tres rayas decorativas en vez de una casilla de texto: el alumno no puede
escribir nada en el teléfono. El único botón, «Ver pauta», muestra la respuesta completa y da
+2 XP la primera vez. El revisor precisó que la sección se completa con «Siguiente» cinco veces
sin tocar siquiera la pauta, y que las casillas de la rúbrica son inertes, no las lee ningún
código. Vale para las veinte misiones que tienen esta sección.

Es la actividad de mayor nivel cognitivo de la misión convertida en la más barata de saltar.

### La pregunta «crítica» de lectura se corrige por máquina

`P3-05` · media · error · esfuerzo días

El corpus trae 450 preguntas de tipo crítico («¿Qué te pareció? ¿Por qué?») y cada una lleva
marcada «la opinión mejor razonada». El alumno toca una opción y recibe un ✅ o un «la respuesta
era la c)» **sobre una opinión**. Se enseña que opinar tiene una respuesta correcta, y el dato
entra en la Evidencia como acierto o error. El revisor acotó: la ficha impresa y la toma oral de
Mi aula ya tienen la válvula («se le pone correcta y se felicita el argumento»); el problema es
la corrección automática en pantalla, y es un punto de cinco por lectura.

### La prueba de Pensamiento Crítico no discrimina

`P2-12` y `P3-10` · media · esfuerzo días

En La Célula los seis casos de análisis describen **la misma célula** y la primera pregunta es
siempre «¿animal o vegetal?»; las cinco decisiones son la misma planta a oscuras con una sola
guía. Las treinta formas son la misma prueba con otro párrafo. En Geografía los cinco dilemas se
escriben «conviene X, o Y» y X es la correcta las cinco veces. El revisor amplió: **17 de las 35
misiones** con esta prueba aplican la misma lista de cuatro preguntas a todos sus casos.

### Sin transferencia, sin proyecto, sin producto

`P3-08` · media · faltante · esfuerzo semanas · impacto educativo 5/5

El motor no tiene forma de que el alumno produzca algo y lo muestre: ni texto largo, ni foto, ni
exposición. La misión «Robots que resuelven problemas» manda por WhatsApp «presentarás tu
proyecto en equipo» y pide identificar un problema de la comunidad, pero no hay dónde registrar
el problema elegido ni el boceto. En las herramientas del maestro, «Rúbricas de evaluación» está
marcado «próximamente».

### Las tres actividades nuevas de mayor rendimiento

El auditor de nivel cognitivo propuso tres, y son las que mejor relación de valor por esfuerzo
tienen de todo el informe:

1. **Casilla de texto con autoevaluación por rúbrica y registro en Evidencia.** Convierte
   «Explica» y Pensamiento Crítico en datos reales para el maestro. El camino de registro ya
   existe.
2. **«¿Quién tiene razón?»**: dos respuestas de alumnos ficticios, elegir y justificar.
3. **«Llévalo a tu comunidad»**: consigna de transferencia con entrega corta que el maestro ve.

Y una cuarta, casi gratis: rehacer «Errores comunes» (hoy cinco errores ya resueltos, lectura
pasiva, en veinte misiones) como «encuentra y corrige el error». El banco ya está escrito y es
corregible por máquina (`P3-12`).

## Errores de contenido

Ordenados por lo que le cuesta al alumno.

| qué | dónde | severidad |
|---|---|---|
| Río Plátano «salió de la Lista en Peligro en 2018»: sigue en ella | Áreas Protegidas, texto y banco crítico | alta |
| «1/2» se marca mal en `3/4 − 1/4`, y la nota llega al maestro | Fracciones, conceptual | alta |
| El Cerro Las Minas mide 2 870 m en una misión y 2 849 m en otra | Geografía y Áreas Protegidas, 28 líneas | media |
| 31 misiones enlazan a carpetas de Drive que no existen | sección Recursos | media |
| La Forma 20 imprime «3/3 − 0/6 =» | Fin de Grado 6º, 4 puntos | media |
| «ZENK yu» debajo de la regla que dice que la th no es «senk» | Inglés, misión y ficha | media |
| El cloroplasto «exclusivo de la célula vegetal», y luego algas con cloroplastos | La Célula, V/F calificado | baja |
| COPECO es Comisión, no Comité | Desastres Naturales y su ficha | baja |
| «coche» donde el resto dice «carro» | Adjetivos, Pronombres y sus fichas | baja |
| Actividades de Inglés puntuadas con expresiones nunca enseñadas | Saludos, reto cronometrado | baja |

Dos merecen comentario. El de **Río Plátano** no es un dato suelto: el caso crítico le pide al
alumno argumentar «qué medidas ayudaron a que la Reserva fuera retirada de la lista», es decir,
razonar sobre un logro que no ocurrió. El revisor comprobó que la ficha impresa no arrastra el
error, solo la pantalla.

El de **Fracciones** es una contradicción interna: la misión enseña a simplificar en la sección
«✂️ Simplificar» y luego castiga con cinco puntos al alumno que simplifica. La prueba operativa
de la misma misión sí acepta equivalentes. El revisor señaló que el patrón de arreglo **ya existe
en el repositorio**: Multiplicación de Fracciones califica con una lista de respuestas aceptadas.
Afecta a nueve de las treinta formas.

Y una incoherencia de plantilla que se ve: detrás del título de **doce misiones** corre la
marquesina «NEURONA · CEREBRO · SINAPSIS · AXÓN», heredada del CSS del Sistema Nervioso
(`P2-10`). Se arregla en una hora.

## Qué sobra

- **La sopa de letras en las ocho misiones del docente.** El maestro estudia la Ley Fundamental
  con una sopa de letras, y la constancia docente premia eso mientras la única actividad de juicio
  profesional de la misión, los casos, no cuenta para nada (`P3-07`, `P3-09`).
- **Las actividades de relleno con XP**: «¿es fracción o es pizza?», «Fracción o Decimal»
  (distinguir la barra del punto), «De programación / De otra materia». Ocupan pestañas, tiempo
  de un aula con tres teléfonos y XP, y no miden ninguna expectativa (`P2-10`).
- **«Identifica el concepto» tal como está en ciencias**: la respuesta está siempre en la segunda
  palabra (ocho de ocho en La Célula, siete de ocho en Perímetro) y la pista repite la respuesta.
  Da 40 XP, un quinto del «logro» que la familia ve por WhatsApp (`P2-07`).
- **El bloque de Google Drive de las 31 misiones con enlace falso.** La ficha didáctica ya cumple
  esa función (`P10-04`).

## Qué falta

1. **Matemáticas de 8º y 9º, y estadística en todos los grados.** Es el vacío más grande y el que
   más contradice la promesa comercial.
2. **La expectativa de logro en cada misión**, visible para el maestro en la ficha y en la Zona
   Docente. Empezando por las veinte de Matemáticas, que ya tienen el bloque mapeado.
3. **Dibujos donde el currículo pide dibujos**: el mapa de Honduras y el esquema de la célula.
4. **Una casilla de texto que se registre.** Sin ella, todo lo que la plataforma tiene de
   pensamiento crítico es papel.
5. **Español más allá de la gramática**: producción escrita con rúbrica, literatura hondureña y
   lengua oral, que además son los bloques que la Prueba de Fin de Grado sí examina.
6. **La historia de Honduras en Sociales**, con las fuentes que el repositorio ya tiene.

## Descartados en la revisión adversarial

| id | título | motivo |
|---|---|---|
| `P1-04` | La Ruta de la Meta examina temas que ninguna misión enseña | La prueba de fin de grado trae su propio Aprende y sus laboratorios de los temas que examina; el hallazgo describía mal el objeto |
| `P10-07` | El Corredor Biológico no llega «hasta Colombia» ni son ocho países | La afirmación de la misión resultó defendible según las fuentes consultadas |

Además, cinco hallazgos bajaron de severidad tras la revisión: el mapa DCNB con fuente ausente
(de alta a media), la etiqueta del I Ciclo, las áreas del DCNB sin misiones, el anclaje de
Programación y Robótica, y el mapa curricular congelado (los cuatro a baja).

## Cobertura y límites

Se contrastaron doce misiones contra el DCNB, se trazó la cadena completa en seis y se contaron
los bancos de siete. **No se revisaron las 66**: las conclusiones sobre el catálogo entero salen
de conteos automáticos (`grep`) y son fiables como orden de magnitud, no como censo. La cobertura
por área es una estimación por unidades del DCNB con al menos una misión, no una medición de
profundidad.

Las Programaciones Educativas Nacionales que el mapa cita no están en el repositorio, así que la
contradicción entre el mapa y el DCNB no se pudo arbitrar: se documenta la discrepancia, no se
declara quién tiene razón.
