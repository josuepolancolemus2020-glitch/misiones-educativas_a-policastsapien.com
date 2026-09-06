# Auditoría pedagógica (II): retroalimentación, progresión, gamificación y evidencias

Cuatro lentes (P4 retroalimentación, P5 progresión, P6 gamificación, P7 evidencias de
aprendizaje), 48 hallazgos, **los 48 verificados**. Los dos críticos pasaron por un segundo
escéptico. Los auditores recorrieron tres misiones con el navegador respondiendo mal a propósito
en cada tipo de actividad, escanearon las 74 carpetas con guiones y reprodujeron el camino
completo del dato hasta el informe que firma la familia.

## Resumen

Esta es el área donde la evidencia pega más fuerte, porque lo que se rompe no es una función sino
el significado de los números que la plataforma produce.

**La «mejor nota» es una autoevaluación con las respuestas a la vista.** Al calificar, cada ítem
fallado muestra «Revisar. Respuesta esperada: X». El alumno copia, vuelve a pulsar «Calificar» y
saca 100 medio segundo después. Cada pulsación genera un evento nuevo y **todos** los consumidores
usan el máximo: el mapa de rutas, la foto de progreso, Estadísticas y la tarjeta que ve la
familia. Está reproducido de punta a punta: 0/100, copiar, 100/100, y la nube recibió
`dominadas: ["fracciones"]`.

**Dos niños distintos se funden en un mismo informe.** Estadísticas empareja las filas de la nube
por número de lista y los dígitos del grado, **ignorando la sección**: el número 7 de 6º-1 recibe
en su informe firmado la práctica del número 7 de 6º-2. En el otro sentido, «Ana López» y «ana
lopez» son dos alumnos distintos, y el que no escribió su número no aparece nunca en su informe.

**Cuando el alumno falla, en 63 de 74 misiones recibe la misma frase.** «Incorrecto. Revisa la
respuesta correcta.» Sin porqué, sin pista, sin conexión con lo que acaba de leer. Y a los 1,6
segundos la pantalla pasa sola a la pregunta siguiente, así que la respuesta correcta desaparece
antes de poder leerla y el mensaje de error queda colgado debajo de una pregunta que el alumno
todavía no ha contestado.

**La progresión que los manuales prometen no existe en el código.** «Terminas una etapa y se abre
la siguiente» dice el manual del alumno; la sonda encontró 65 etapas, 65 enlaces libres, cero
bloqueadas. Dentro de la misión, las catorce pestañas son un menú plano y la Evaluación con su
botón «Ver Pauta» está disponible desde el primer toque.

**El XP se vuelve a ganar recargando la página.** Tres recargas volteando tarjetas llevaron el
contador de 13 a 56 puntos, desbloquearon dos logros y emitieron una Constancia de Logro del
28 % con «¡Muy buen trabajo!», sin una sola respuesta correcta.

Lo que está bien, y es el modelo que el resto debería copiar: **el Control de lectura dentro de
la misión**. Corrige una pregunta a la vez en letra grande, dice cuál era la correcta, explica en
cada palabra mal cazada por qué no es un adjetivo, marca las dudosas con su motivo, y deja volver
atrás para mirar sin rehacer. Las actividades no cambian entre intentos, a propósito, para que el
alumno note su mejora. Es la única pieza con progresión real por grado.

## Lo crítico

### La autoevaluación con la clave delante se registra como nota

`P7-01 + P4-01 + P7-11` · crítica · error · esfuerzo días · impacto educativo 5/5 · comercial 4/5

Reproducido con Playwright sobre Fracciones: primer panel «Resultado automático: 0/100», la
pantalla lista «Revisar. Respuesta esperada: unitaria» ítem por ítem, se copian las respuestas y
el segundo panel dice «100/100». Se registraron dos eventos con la misma forma, y la llamada a la
nube llevó `dominadas: ["2y3ciclo-fracciones"], best: 100`.

Y **44 de las 66 misiones lo invitan por escrito**: «selecciona Ver Pauta para que te
autoevalúes. Genera nuevas preguntas cuando quieras».

El revisor hizo la precisión que importa para el diagnóstico: el diseño **está documentado como
práctica**. El manual dice «la app es el espacio de práctica, el examen impreso es la evidencia
formal». El problema no es que exista la autoevaluación, es que el sistema la trata como
calificación en todas partes: el informe imprimible que firma la familia dice «N dominada(s) con
70+» calculado con ese mismo máximo.

Dos agravantes que el revisor añadió: el botón «Ver Pauta» es visible al alumno **antes** de
calificar, y cada recalificación por encima de 70 regala ocho puntos de XP en 36 misiones.

- Qué hacer, en orden de coste: (1) registrar el número de intento y mostrar en todas las
  pantallas **primer intento, mejor y número de intentos**, nunca solo el mejor; (2) «dominada»
  solo con el primer intento por encima de 70, o con la nota de papel del Plan de acción;
  (3) tras calificar, bloquear la recalificación de la misma forma y obligar a generar otra
  (ya hay treinta); (4) etiquetar el resultado como «autoevaluación» en pantalla y en el reporte.

### La identidad del alumno funde a dos niños y parte a uno en tres

`P7-05` · crítica · error · esfuerzo días · impacto educativo 5/5 · comercial 4/5

El modal pide nombre, grado y escuela como texto libre, y el número de lista es **opcional**.

- Hacia arriba: Estadísticas compara «6» con «6» y no mira la sección, así que un maestro con
  6º-1 y 6º-2 recibe cruzada la práctica de los dos números 7.
- Hacia abajo: «Ana López» y «ana lopez» son dos alumnos distintos en el registro y en la nube;
  y el niño que no escribió su número nunca aparece en su informe, aunque su fila esté en la nube.
- El revisor precisó que el Plan de acción y el resto del informe **sí** separan sección: el fallo
  está solo en el bloque de misiones que viene de la nube. Y que el servidor ya tiene una función
  de normalización de nombres lista para usarse al emparejar.
- Qué hacer: usar el identificador que el maestro **ya emite**, la clave de familia (número de
  lista más cuatro letras), como campo principal del modal. Fija grupo y alumno sin escribir nada.
  Mientras tanto: normalizar los nombres al emparejar, exigir el número de lista cuando hay
  código de aula, y filtrar por grupo (grado **y** sección), no por dígitos del grado.

## Retroalimentación

### El motor no sabe explicar, aunque veintiuna misiones ya tienen el campo

`P4-02` · alta · incompleto · esfuerzo semanas · impacto educativo 5/5

Quiz, completar, identificar, clasificar y los widgets responden al error con una frase genérica y
como mucho pintan la opción correcta. Ningún ítem dice **por qué**.

Aquí el revisor corrigió al auditor de una forma que **abarata mucho el arreglo**: no es cierto
que el motor no sepa pintarlo ni que solo dos misiones lo hagan. Veintiuna misiones ya usan un
campo `feedback` por ítem, con 124 explicaciones escritas, y seis más usan `exp`. La recomendación
correcta no es inventar un campo nuevo: es **generalizar el que ya existe** a las 63 misiones
restantes, y sacar el motor común a un archivo compartido como ya se hizo con el andamio de los
juegos 3D y con los videos.

La investigación respalda la prioridad: la retroalimentación elaborada tiene un efecto en torno a
0,49; la que solo da la respuesta correcta, 0,32; la de «bien o mal», 0,05.

### La pantalla avanza sola antes de que se pueda leer la corrección

`P4-03` · alta · error · esfuerzo días

Tras fallar, la pregunta cambia a los 1,6 segundos. Un niño de 4º no alcanza a leer la opción
correcta. Y como la función que pinta la pregunta nueva no limpia el mensaje, el «Incorrecto.
Revisa la respuesta correcta» sigue visible **debajo de la pregunta siguiente**, que aún no ha
contestado. Hay capturas de los dos instantes.

El propio autor ya lo corrigió una vez, en la misión de Ángulos, con un botón «Siguiente» y el
comentario «BUG FIX: eliminado setTimeout». No lo llevó al resto. El revisor contó el alcance
real: **64 misiones** en el quiz y 63 en completar; solo dos tienen el botón manual.

Es el arreglo con mejor relación de coste y beneficio de toda esta área: un guion de sustitución
sobre un patrón exacto, y después una sonda que falle si el patrón reaparece.

### No hay pistas, y el único camino tras el error es ver la clave

`P4-11` · media · faltante · esfuerzo semanas

El salto es de cero a respuesta completa, que es la forma que menos hace pensar. El revisor
corrigió la evidencia a favor del proyecto: 35 misiones **sí** tienen una pista de tipo 50/50 que
atenúa dos opciones malas a cambio de dos puntos de XP, y unas 23 llevan textos de pista en
tareas y retos. Lo que falta es la pista **conceptual escalonada** («fíjate en el denominador» →
«¿7 es mayor o menor que 4?» → respuesta), y llevarla a las 39 misiones que no tienen ninguna.

### Otros defectos de corrección

- **El Reto final felicita con confeti con 0 de 8** (`P4-04`, media). Escribe siempre «¡Bien
  hecho!», marca la sección como hecha y da el logro. El revisor rechazó la mitad del hallazgo:
  quitar la penalización de un punto por error volvería el juego granjeable, porque son dos
  botones a contrarreloj. Lo que sí hay que arreglar es el mensaje por tramos, el umbral para
  marcar la sección, y enseñar al final las fichas falladas, que hoy se pierden.
- **Clasificar paga los cinco puntos aunque la mitad esté mal** (`P4-06`, media): el pago ocurre
  antes de comprobar si el grupo está bien. En 31 misiones.
- **Ordenar no marca nada** (`P4-08`, media). Dice «hay fracciones fuera de orden» y ningún
  elemento cambia: el alumno tiene que adivinar cuál mover. Pintar en verde las posiciones
  correctas son cinco líneas.
- **«Identificar» en Fracciones pide reconocer la fracción de una descripción escrita**
  (`P4-10`, media), no de un dibujo, cuando la misión ya tiene la función que dibuja.
- **Calificar en blanco registra un cero** y trata el ítem vacío igual que el errado
  (`P4-12`, baja). Y el panel le dice al niño «este resultado es solo para revisión en pantalla;
  la impresión conserva el formato limpio para papel», una frase para el desarrollador, en 44
  misiones.

## Progresión

### El orden de las etapas es el de llegada

`P5-02` · alta · error · esfuerzo horas · impacto educativo 5/5

Cruzando la etapa de cada misión con el grado que el propio repositorio guarda en su mapa DCNB,
salen inversiones en seis rutas. En la Ruta de la Forma, la bisectriz (6º y 7º) va antes que los
tipos de ángulo (4º), y el área del círculo antes que el perímetro de cuadriláteros. En la del
Número, el mínimo común múltiplo va antes que los múltiplos, y la multiplicación vertical de 4º
es la etapa 11, después de dividir decimales de 6º.

El revisor desinfló el conteo con buen criterio: doce inversiones estaba inflado porque el
criterio marcaba como inversión cosas que no lo son pedagógicamente (célula → reinos →
ecosistemas es orden de escala, no de grado). **Las reales son unas siete.** La severidad se
sostiene no por el número sino por lo que consume ese orden: la sugerencia automática y el
diagnóstico se apoyan en él.

- Qué hacer: renumerar con el primer grado y mes del mapa como criterio. El dato ya está. Y una
  sonda que falle si una etapa tiene grado menor que la anterior.

### El diagnóstico se apoya en ese orden y después se ignora

`P5-03`, `P5-04` y `P5-05` · media · esfuerzo días

Tres problemas encadenados. La regla es «la primera etapa con error es el punto de partida», y
con el orden roto manda al alumno a reforzar «Potencias y Raíces» a quien sacó 60 en Fracciones,
que no es prerrequisito de nada. La cobertura está incompleta: la Ruta del Cuerpo tiene cuatro
preguntas para cinco etapas y ninguna cubre digestivo, respiratorio ni reproducción; cuatro rutas
no tienen diagnóstico y el botón «¿Dónde empiezo?» no aparece. Con cero errores se sugiere la
última etapa de la ruta, que en la Ruta de la Palabra es **una misión de Bachillerato**.

Y lo peor: **el resultado no cambia nada**. La sugerencia usa el diagnóstico solo si el registro
está vacío; con un solo evento se ignora. Un alumno con 13 de 13 sigue viendo «0 de 13 etapas
dominadas». El revisor añadió que el diagnóstico se guarda por dispositivo, no por alumno, así
que en un teléfono compartido el «Sugerido» es el del último niño que lo hizo.

El revisor también rechazó el ejemplo estrella del auditor: fallar solo 23 × 4 y recibir
«Multiplicación Vertical» como punto de partida **es correcto**. Los casos que sí prueban el
defecto son los de la Ruta de la Forma.

### Las etapas no bloquean, y los manuales dicen que sí

`P5-01` · media · error · esfuerzo días

El manual del alumno dice «terminas una y se abre la siguiente»; el del maestro, «cada etapa
supone la anterior». En el código no se abre ni se cierra nada. El revisor bajó la severidad con
un argumento de aula que hay que aceptar: **navegar libre es correcto** cuando hay tres teléfonos
y el maestro necesita saltar. El defecto real es doble: los manuales prometen un bloqueo que no
existe, y en el mapa nada distingue la etapa recomendada. Lo primero se corrige en horas.

### Dentro de la misión tampoco hay secuencia

`P5-09` · alta · error · esfuerzo horas

Las catorce pestañas están todas habilitadas y la Evaluación se abre sin haber hecho Aprende ni
el Quiz, con «Ver Pauta» al lado. El revisor apuntó el arreglo mínimo y por qué no es bloquear:
el texto de la pantalla **invita expresamente** a autoevaluarse con la pauta, así que ponerle
puerta contradice la intención declarada. **Lo urgente es registrar**, no bloquear: envolver la
función que muestra la pauta en pantalla igual que ya se envuelve la de imprimir.

### Las «30 formas» son azar, no dificultad

`P5-07` · media · error · esfuerzo días

Cada sección toma cinco ítems de un banco de quince con un generador sembrado por el número de
forma. **No hay etiqueta de dificultad en ningún banco de ninguna misión.** El revisor fue
honesto sobre el límite de la evidencia: que dos alumnos igual de preparados saquen 60 y 90 según
la forma es plausible pero no está medido. El hecho estructural sí lo está.

- Qué hacer: etiquetar cada ítem con su nivel y que la selección cumpla una cuota fija por forma.
  El generador sembrado se mantiene, así que las formas siguen siendo reproducibles y la pauta
  impresa sigue valiendo.

### El XP de la ruta se gana por abrir la misión

`P5-10` y `P6-03` · media · error · esfuerzo horas

Se suman los 25 a 40 puntos en el primer clic, antes de cargar la página. Recorriendo 27 misiones
se llega al nivel máximo «Sabio» sin contestar nada. Y ese número viaja a la nube y se le muestra
al maestro bajo el rótulo «Progreso por alumno (XP)».

El revisor puso el matiz justo: en la misma fila está la columna «Dominadas», que sí mide nota
por encima de 70, así que el maestro tiene el dato bueno al lado. La corrección es sencilla:
quitar la suma por visita y alimentar el nivel con las dominadas.

### El maestro no puede asignar nada

`P5-12` · media · faltante · esfuerzo días · impacto comercial 4/5

La guía en la aplicación dice «en clase asigna cada misión por su ruta y etapa». No existe la
herramienta: ni en Mi aula, ni en el plan de acción, ni en el perfil. Con un mapa sin bloqueos y
43 alumnos, el único mecanismo de progresión es que el niño recuerde lo que dijo el maestro.

El revisor señaló que la tubería **ya existe a medias**: el alumno escribe el nombre del maestro
y el código de aula, así que «la misión de la semana» podría viajar por esa misma identificación.

Es, en mi lectura, el hallazgo de esta área con mejor relación entre lo que cuesta y lo que
cambia: convierte el catálogo en un plan de trabajo.

## Gamificación

### El XP se vuelve a ganar recargando

`P6-01` · alta · error · esfuerzo días

Cada misión lleva la cuenta de qué ya pagó XP, pero **no la guarda**. Al recargar, el registro
vuelve a vacío y las mismas acciones vuelven a pagar. Medido: 13 puntos, recargar, voltear las
mismas catorce tarjetas, 56 puntos, dos logros y una constancia del 28 %.

El revisor añadió lo que lo saca del teléfono: el XP inflado **se sella en cada evento que sube a
la nube**, así que el maestro lo ve. Pasa en las 64 misiones con XP.

### En un teléfono compartido, el segundo alumno hereda el progreso del primero

`P6-02` · alta · error · esfuerzo días

El progreso de la misión vive en una llave sin nombre de alumno. Al pulsar «Cambiar alumno» solo
cambia el nombre de la constancia. Medido: Ana juega, Bruno entra, y el reporte de WhatsApp de
Bruno lleva el XP, las secciones y el logro de Ana, con su nombre. Es exactamente el caso de uso
que el botón dice atender.

El revisor acotó el daño: **las notas no cruzan de dueño**, porque cada evento se sella con el
alumno actual. Lo que hereda el segundo es el estado de la misión y, por ahí, el campo de XP de
sus propios eventos.

### El XP premia lo que no es aprendizaje

`P6-04`, `P6-05`, `P6-11` · media · esfuerzo días

Pagan: leer una tarjeta al voltearla, clasificar un grupo aunque todas las fichas estén mal, y
pulsar «Calificar» tantas veces como se quiera. Se marcan como completadas con confeti secciones
que solo se generaron: pulsar «Generar» en Tareas sin resolver nada, o pintar la evaluación antes
de calificarla.

Y la **Constancia de Logro** mide XP, no dominio: su porcentaje es el XP sobre 200, se abre sin
condición y el mensaje de WhatsApp anuncia «completó la Misión, Progreso 28 %». El revisor
comprobó de paso que el botón «Reiniciar XP», presente en 72 misiones, ni siquiera funciona bien:
no guarda, así que al recargar el XP vuelve.

### Lo que sí está bien diseñado vive en tres misiones

`P6-12` · media · oportunidad · esfuerzo semanas

Donde la mecánica **es** el aprendizaje, el diseño es bueno: el terreno de malla donde el área
crece con el mismo perímetro, el laberinto de unidades, la apuesta final del Campeonísimo. Las
estrellas se pagan una sola vez por reto, y el código lo explica: «repetir el huerto fácil era una
mina de estrellas». Los distractores son el error real, no números al azar.

Esa calidad vive en tres de 66 misiones. En las otras 63 la gamificación es puntos encima de
flashcards, y ni siquiera respeta la regla que el propio Cercador se dio.

### Detalles medidos

- **La medalla de oro del Cercador sale con un terreno de seis** (`P6-07`, media). La misión mira
  cuántas llaves tiene el objeto, y el juego lo inicializa con seis ceros. El juego ya escribe un
  campo «completado» que la misión ignora. Arreglo de una línea.
- **Unos 19 confetis por misión y sonido encendido por defecto** que pita en cada pestaña
  (`P6-08`, media), en contra de la regla que el propio proyecto se dio para los juegos 3D:
  «sin sonido, a propósito: cuarenta teléfonos pitando en un aula no ayudan a nadie».
- **«Secciones completadas X de Y» nunca llega a Y** en 65 misiones (`P6-06`, media). En
  Fracciones el alumno que hace todo llega a «10 de 15». Una meta inalcanzable deja de ser meta.
- **Siete niveles idénticos calcados en 64 misiones** que se reinician en cada una (`P6-10`,
  baja). El revisor tumbó la mitad del hallazgo: los residuos de plantilla son solo nombres de
  funciones, el alumno no ve nada.
- **Falta la capa social**: no hay meta de aula ni racha (`P6-09`, baja). La propuesta que el
  revisor conservó como aprovechable: una meta de grupo por misión asignada, alimentada por las
  notas que ya están en la nube, proyectable en la pared.

## Evidencias de aprendizaje

Lo que hoy viaja de una misión a la nube es `{tipo, misión, forma, nota, base, alumno, número de
lista opcional, grado, docente}`. Nada más.

### No existe evidencia por ítem, aunque la columna está creada desde la Fase 1

`P7-04` · alta · incompleto · esfuerzo días · impacto educativo 5/5

La función de calificación **ya calcula** el desglose por sección y sabe qué ítem falló y qué
escribió el alumno. El registro solo lee la nota del panel con una expresión regular. La tabla
tiene una columna `detalle` que ninguna función de guardado rellena.

Consecuencia: el maestro no puede saber **qué** no entendió su aula, solo cuánto sacó cada uno.

El revisor abarató la recomendación: 22 misiones ya exponen los datos de la calificación en una
variable global que el registro ignora, y el desglose por sección se puede mandar **hoy** sin
tocar las misiones, leyendo el panel que ya dice «Completar: 0/25 · V/F: 0/25».

### Las actividades formativas no dejan rastro

`P7-07` y `P4-05` · esfuerzo semanas

Quiz, arrastrar, completar, memorama, laboratorio y reto terminan en una marca de «sección
hecha», sin aciertos ni intentos. La sección de quiz se marca al llegar a la última pregunta, sin
importar si acertó cero o nueve.

El revisor mejoró la evidencia: 35 misiones **sí** tienen casillas de texto en la prueba de
pensamiento crítico, con autopuntaje, que no se guardan ni se registran. Eso abarata el modelo
mínimo: donde ya hay casilla, basta con registrar lo escrito y el autopuntaje al finalizar.

- Qué hacer, y es el patrón correcto: un evento DOM que el registro escuche, para no tocar 74
  misiones a mano.

### El antitrampa protege el camino que nadie usa

`P7-02` · alta · error · esfuerzo horas

El registro envuelve las funciones de **imprimir** la pauta y pinta un aviso junto a la nota. Pero
el alumno con un teléfono no imprime: toca «Ver Pauta», presente en las 66 misiones, que muestra
todas las respuestas sin registrar nada.

El revisor añadió que envolver ese botón es necesario pero no suficiente, porque calificar ya
enseña la respuesta esperada de cada ítem fallado sin pasar por la pauta: el aviso tendría que
dispararse también en la segunda calificación de la misma forma.

### La pauta del examen impreso está en el teléfono de cualquier alumno

`P7-03` · alta · riesgo · esfuerzo días · impacto comercial 4/5

La semilla de cada forma es pública, el alumno puede escoger «Forma N» en el selector y ver la
pauta completa. La página de evaluaciones vende como virtud que «la pauta de la Forma 3 seguirá
siendo válida mañana», y el manual recomienda repartir las formas 1, 2 y 3 por fila. El número de
forma va impreso en el pie de la hoja.

El revisor bajó la severidad de crítica a alta con un argumento correcto: exige que el alumno
conozca el mecanismo y no ocurre solo. Con una clase que lo descubra, en esa aula es crítico.
La alternativa mínima, ocultar el selector de forma cuando no hay cuenta docente en el equipo, es
de horas.

### La lectura, los videos y sus quiz no llegan a la nube

`P7-06` · media · incompleto · esfuerzo días

La cola solo admite tres tipos y el servidor rechazaría el resto. Las palabras por minuto del
Control de lectura dentro de la misión, el video abierto y su quiz se quedan en el teléfono del
niño. El código promete «Evidencia para el maestro (registro.html y la nube)» y el manual del
proyecto afirma que «en la Evidencia del maestro queda sin_terminar». No es cierto.

El revisor precisó que el registro local **sí** pinta la lectura con detalle; lo que le falta es
la nube. Y que la medida oficial de fluidez la toma el maestro en Mi aula y esa sí llega al
informe, así que lo que se pierde es la práctica en casa.

### El tiempo no viaja, y la evaluación queda con cero minutos

`P7-08` · media · incompleto · esfuerzo horas

El contador es de tics de quince segundos de la sesión, no del tiempo dedicado a la prueba, y la
fila que sube lo descarta. Un niño que contesta en cuarenta segundos con la pauta delante es
indistinguible del que tardó veinte minutos. El manual promete que «el tiempo de trabajo y los
intentos cuentan una historia que la nota sola no cuenta».

Medir el tiempo entre generar y calificar, y marcar una nota alta en pocos segundos igual que se
marca la pauta vista, es de horas.

### La evaluación de papel y la digital viven en dos silos

`P7-09` · alta · error · esfuerzo semanas

La de papel la escribe el maestro en el Plan de acción, por clave de familia. La digital sube
sola por nombre libre. Estadísticas las muestra en dos bloques y solo las cruza por materia; el
asistente de las familias solo lee la de papel, así que la práctica digital **nunca llega a la
familia por la nube**.

Y las reglas no coinciden entre pantallas: el reporte de WhatsApp manda la **última** nota
mientras el resto del sistema usa la **mejor**. El revisor apuntó que lo de la última está
documentado a propósito, así que la inconsistencia es del resto con el manual.

### El informe da una nota, no evidencia formativa

`P7-12` · media · faltante · esfuerzo semanas

Lo único que se imprime sobre misiones es «N evaluaciones · N dominadas con 70+ · minutos» y una
tabla de intentos y mejor nota. No hay «temas por reforzar», ni evolución entre intentos, ni
«ítems más fallados» para el aula. Con 43 alumnos, el maestro que quiera decidir qué volver a
explicar no lo encuentra, porque el dato por ítem no existe.

## Qué sobra

- **Tres consolas del maestro para el mismo dato** (`P7-10`, media), con dos modelos de
  autenticación distintos, más una cuarta caché dentro de Mi aula. Dos de ellas enlazan a un
  panel donde ningún maestro puede entrar.
- **El botón «Reiniciar XP»**, a la vista del alumno en 72 misiones, que además no funciona.
- **El XP por voltear tarjetas y por la sopa de letras.**
- **El registro del evento «video abierto»**, que nadie va a leer.

## Qué falta

1. **El número de intento en el dato**, y que las pantallas muestren primer intento y mejor. Es
   lo que convierte la nota en información honesta.
2. **La clave de familia como identidad del alumno** en el modal de la misión.
3. **El campo de explicación generalizado** a las 63 misiones que no lo tienen, empezando por
   Matemáticas.
4. **«La misión de la semana» por grupo**, que es la progresión que el aula usa de verdad.
5. **El desglose por ítem en la nube**, que ya se calcula y se tira.
6. **Una casilla de texto que se guarde**, donde ya hay casillas sin guardar.

## Cobertura y límites

Se recorrieron tres misiones con el navegador (Fracciones, Adjetivos, La Célula) y se escanearon
las 74 carpetas con guiones. Los conteos por `grep` son fiables como orden de magnitud; varios
los corrigió el revisor al alza o a la baja, y esas correcciones están recogidas arriba.

Nada se comprobó contra la base de datos real ni contra el sitio publicado. La dispersión de
notas entre formas (`P5-07`) queda como hipótesis no medida: haría falta simular un alumno que
sabe un porcentaje fijo del banco y ver cuánto varía su nota según la forma.
