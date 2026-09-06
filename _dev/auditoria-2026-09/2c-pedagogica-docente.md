# Auditoría pedagógica (III): ritmos de aprendizaje y utilidad real para el docente

Dos lentes (P8 adaptación a distintos ritmos, P9 utilidad real para el docente), 24 hallazgos,
**los 24 verificados**. El auditor de la lente docente cronometró tres flujos reales con el
navegador: pasar asistencia, meter las notas de un parcial y ver la evidencia de un alumno.

## Resumen

**Pasar lista cuesta seis toques y menos de dos segundos, sin señal.** Eso está bien hecho y hay
que decirlo primero, porque es lo que el maestro hace todos los días. Un toque marca ausente, dos
marcan excusa. La lista alimenta todo lo demás, y al insertar un alumno nuevo las claves de
familia ya entregadas se conservan.

A partir de ahí, tres problemas de fondo.

**El circuito misión a nota está roto.** Cada misión califica en pantalla y sube el resultado a
la nube, pero ninguna herramienta del maestro trae esas notas a donde se anotan. El Plan de
Acción no consulta la nube. «Sugerir notas» solo lee lo que el maestro ya escribió a mano. El
maestro corrige 43 exámenes que la máquina ya corrigió.

**El maestro no puede asignar nada.** No existe «esta semana, Fracciones» para su 6º-1, ni una
pantalla de «qué hizo mi aula hoy». Y el emparejamiento con su lista depende de un campo que el
modal marca como **opcional**: si el niño no escribe su número, el maestro lee «no hay práctica
registrada» aunque la fila esté en la nube.

**La adaptación a distintos ritmos existe en una sola misión.** La Forma R de División de
Decimales es una adecuación curricular no significativa bien diseñada: misma competencia, 100
puntos, 13 ítems, banco de palabras, ejemplo resuelto, letra de 13 puntos, apoyos documentados en
la pauta, y la hoja se ve igual que la de los compañeros para no señalar a nadie. Un año después
del piloto sigue en 1 de 66 misiones.

Y alrededor del núcleo creció un anillo. La Convocatoria son unas 7 000 líneas contando su
página, su SQL y sus sondas, para un evento de una vez al año. Asistencia, notas y lista juntas
son unas 1 500.

## Lo que le falta al maestro para usar las misiones

### El circuito misión a nota está roto

`P9-01` · alta · incompleto · esfuerzo días · impacto educativo 4/5 · comercial 5/5

Las notas que la aplicación calcula no llegan a la boleta. El maestro las vuelve a teclear.

El revisor corrigió un punto importante a favor del proyecto: **sí existe** un sitio donde el
maestro ve cada nota con su tipo sin volver a entrar, `consulta-nube.html`, que abre con la
sesión de la Zona Docente y lista fecha, alumno, número, grado, misión, tipo y nota. Pero es una
tabla para mirar: tampoco ahí hay «llevar esto a la boleta». El retecleo sigue siendo real.

- Qué hacer, y es barato porque la consulta ya existe: un botón «Traer de la nube» en el Plan de
  Acción que, para la misión y forma elegidas, precargue la nota de cada número de lista y marque
  el origen. Y separar en Estadísticas la conceptual de la operativa, que hoy se mezclan en una
  sola «mejor nota» mostrada bajo el nombre de la carpeta (`2y3ciclo-fracciones`) en vez del
  título de la misión.

### No hay asignación ni vista de aula

`P9-02 + P8-08` · alta · faltante · esfuerzo semanas · impacto educativo 5/5 · comercial 5/5

Lo que hay hoy para «asignar»: enlazar una misión a un control de **todo** el grupo, o el botón
de compartir de cada misión, que manda a WhatsApp un texto genérico igual para todos, o una nota
en pantalla que le dice al maestro que lo diga en voz alta.

El maestro con 43 alumnos a tres velocidades tiene que dictar tres direcciones web.

El revisor precisó dónde está el límite real: «qué hizo mi aula» **sí** existe como tabla cruda
en la consulta de la nube. Lo que falta es el cruce con la lista de Mi aula (grupo por misión con
su estado), el emparejador de los resultados huérfanos, y la asignación.

- El mecanismo viable sin cuentas de alumno ya tiene todas las piezas: el alumno **ya teclea** el
  código de aula del maestro y su número de lista. Con eso, «Tarea de la semana» por grupo se
  guarda con el resto de datos del maestro, se publica por una consulta de solo lectura, y la
  portada del alumno pinta «Tu maestro te asignó…». El evento de evaluación lleva el
  identificador de la tarea, y entonces la Evidencia puede decir «hizo lo asignado».

### El número de lista es opcional y de él depende todo

`P9-02` · alta

El campo dice «(opcional)». Si el niño lo deja vacío, su trabajo existe en la nube y para el
maestro no existe. Comprobado: una fila sin número para el alumno número 8 produce «No hay
práctica registrada de este alumno en la nube todavía».

Hacerlo obligatorio cuando el alumno escribe un código de aula es un cambio de una línea.

## Adaptación a distintos ritmos

### El mismo texto para el niño de 9 años y el de 15

`P8-01` · alta · faltante · esfuerzo meses · impacto educativo 5/5

Ninguna misión ofrece dos niveles de texto. El grado que el alumno declara solo lo usa el Control
de lectura. El auditor midió el nivel de lectura del Aprende con un índice de legibilidad: el
promedio de las misiones de dos ciclos da «normal», propio de secundaria, y cinco están en «algo
difícil»: Adjetivos, Sistema Nervioso, Endocrino, Desastres Naturales y Eras Geológicas.

El revisor puso dos límites honestos: el índice es una aproximación gruesa que sirve para ordenar
misiones, no para afirmar el nivel con precisión; y escribir dos redacciones para 46 misiones es
de **meses**, no de semanas. Para las once priorizadas sí caben en semanas.

- El mecanismo ya existe y no hay que inventarlo: el motor de idioma que cambia bloques HTML
  enteros para el inglés sirve tal cual como niveles de lectura.

### Ninguna misión lee en voz alta en español

`P8-04` · alta · faltante · esfuerzo días · impacto educativo 5/5

La plataforma exige leer para todo: teoría, consignas, quiz, reto de treinta segundos. La
síntesis de voz del navegador funciona sin internet en Android y **solo se usa en la misión de
inglés** y en la página de las familias. No hay glosario en ninguna misión. Cero.

El niño de 4º que no lee bien no tiene puerta de entrada, y es exactamente el niño para el que la
plataforma dice existir.

El revisor añadió dos avisos técnicos que hay que respetar: en Android la voz en español sin
internet depende de que el paquete esté descargado en ese teléfono, así que hace falta un aviso
honesto cuando no lo esté; y el módulo tiene que convivir con el modo de letra grande y con el
ajuste de la lectura proyectada.

### La única adecuación real sigue en una misión

`P8-06` · alta · incompleto · esfuerzo semanas

La Forma R es lo mejor que la plataforma tiene para el alumno rezagado, y el propio manual la
presenta como estándar a copiar «por tandas grandes» tras una semana de piloto. Un año después,
el maestro que la conoce por el manual la busca en Fracciones y no existe.

El revisor corrigió un punto: la Forma R **sí** se refleja en la pantalla de Evaluación, no solo
en el papel. Lo que no tiene es efecto en el Quiz ni en el resto de actividades. Y encontró un
defecto de aula: la marca de Forma R se guarda en la llave del teléfono, así que en un aparato
compartido **queda marcada para el siguiente alumno**.

### Una colisión de convenciones que inventa adecuaciones

`P8-07` · media · error · esfuerzo horas

La Forma R viaja como forma 100 más N, y el panel del maestro pinta cualquier forma mayor que 100
como «R-N ♿». Las cuatro Pruebas de Fin de Grado usan **exactamente el mismo desplazamiento**
para distinguir la conceptual de Español de la de Matemáticas.

Resultado: toda prueba de Español de Fin de Grado aparece al maestro como una evaluación con
adecuación curricular, y en el mensaje de WhatsApp que va a casa dice «Forma R-3». Un maestro que
use ese dato para documentar adecuaciones ante la dirección registra adecuaciones que no
existieron.

El revisor bajó la severidad porque la **nota** que llega al expediente es correcta: lo que se
tuerce es la etiqueta. Se arregla mandando la materia en un campo propio.

### Otros límites de ritmo

- **«Letra grande» está en 43 de 66 misiones** y no en el portal (`P8-05`, media). La preferencia
  no se comparte entre misiones, así que el alumno que la activa en una la pierde en la
  siguiente. El revisor apuntó lo que agrava: las 23 sin botón son **las más recientes**, o sea
  que la deuda crece con cada misión nueva mientras no salga a un archivo común.
- **No se retoma un quiz a la mitad, no hay «repasar lo que fallé» ni repaso espaciado**
  (`P8-11`, media). Y «dominada» es para siempre: una nota de 70 hace un año sigue contando hoy.
  Las tres cosas son pequeñas y ninguna toca la nube.
- **La pista cuesta XP y solo existe en 21 misiones** (`P8-09`, baja). El revisor lo bajó de
  severidad y corrigió el cuadro: hay tres modelos conviviendo, 21 con costo, 2 gratis y 43 sin
  pista. Lo que falta es unificar hacia el gratis que ya existe.
- **El reto va a treinta segundos fijos en las 66 misiones** (`P8-10`, baja), sin modo sin reloj,
  cuando el propio manual recomienda «tiempo extendido, hasta el doble» como apoyo.
- **El diagnóstico no cambia nada de lo que se ofrece** (`P8-03`, media). El revisor tumbó una
  frase del auditor: el resultado **sí** llega al maestro, viaja en el resumen y se pinta en una
  columna. Lo que no hace es cambiar nada en la misión ni en el quiz. Y en la Ruta de la Meta, que
  es una prueba de fin de grado por grado, el alumno de 4º que acierta todo es enviado a la
  prueba de 7º.

## Fricción en las herramientas diarias

### Meter las notas de un parcial cuesta 43 toques

`P9-05` · media · error · esfuerzo horas

La tabla está pensada para llenar la boleta a lo ancho, todas las materias de un alumno, pero el
maestro cierra parciales **materia por materia** en fechas distintas. En una pantalla de 393
píxeles se ven dos columnas, y al escribir una nota el cursor salta a la materia siguiente.
Medido: 43 valores tecleados seguidos se repartieron en seis filas por ocho materias.

La flecha abajo sí funciona, pero en el teclado de un teléfono no existe.

- Qué hacer: un conmutador visible «↓ por materia / → por alumno», con la primera por defecto en
  pantallas angostas.

### La primera pantalla de Mi aula mide casi cinco pantallas

`P9-09` · media · sobrediseño · esfuerzo días

La pestaña Alumnos, que es la puerta de todo, mide 4 100 píxeles, trae **318 palabras de ayuda**
y 96 botones. Estadísticas, Comunicados y Notas repiten el patrón: cada bloque se explica con un
párrafo antes de dejar actuar. Un maestro con 43 alumnos y un recreo no lee párrafos: los salta,
y después no encuentra lo que el párrafo decía.

- Qué hacer, con la misma sonda para medirlo: un solo renglón de ayuda por tarjeta, el resto
  detrás de un signo de interrogación. Meta de dos pantallas y ochenta palabras por pestaña.

### Sin cuenta no hay Mi aula, y la cuenta exige internet

`P9-04` · media · error · esfuerzo días · impacto comercial 5/5

Todo Mi aula funciona sin nube, pero el mosaico entero se oculta si no hay cuenta, y el alta se
aborta si el navegador dice que no hay conexión.

El revisor moderó el titular con razón: para tener la aplicación en el teléfono hace falta señal
al menos una vez, y ese es el momento natural de crear la cuenta. El caso real es la señal
intermitente. Y avisó del riesgo de la solución: un modo local sin cuenta deja los datos de 43
alumnos **sin ningún respaldo**, porque la cuenta es lo que dispara la sincronización. La
recomendación tiene que incluir reclamar esos datos al crear la cuenta después.

### Parte Mensual no lee el pase de lista

`P9-06` · media · incompleto · esfuerzo horas

Pide trece números a mano (matrícula por sexo, ingresos, desertores, traslados, inasistencias)
aunque Mi aula ya tiene la lista con sexo y la asistencia diaria por alumno. El maestro cuenta
faltas a mano de un cuaderno digital que ya las tiene. Y ofrece solo secciones A, B, C y D cuando
la propia normativa del proyecto escribe los grupos como «6º-1».

### El Gobierno Escolar excluye a 7º, 8º y 9º

`P9-07` · media · error · esfuerzo horas

El código de votación se valida con una expresión que acepta grados del 1 al 6 y secciones A o B.
Un Centro de Educación Básica con III Ciclo, que es la mitad del público declarado, no puede
votar. Y una escuela con secciones numéricas, que es el formato de la propia normativa, tampoco.

Una urna que no acepta a la mitad de los grados es peor que ninguna urna.

## Qué sobra

Este es el apartado donde el revisor más corrigió al auditor, y las correcciones son justas.

| qué | veredicto |
|---|---|
| **La Convocatoria** (7 000 líneas con su página, su SQL y sus sondas) | Sacarla a página propia con carga diferida, como ya hacen la página de las familias y la de salida. El revisor rechazó «retirarla a otra app»: no hay telemetría de uso que lo sostenga |
| **Gastos de bolsillo e inventario del aula** | **No sobran.** El revisor lo defendió y tiene razón: un maestro hondureño paga material de su bolsillo y entrega el aula con inventario firmado a fin de año. No son hobby del creador |
| **Los kits de autocapacitación** en la raíz del sitio | Sobran ahí. Son material de estudio para el autor («explicar M.E.T.A.S. ante un ingeniero que te interpele»), publicados en la raíz. Van a `_dev/` |
| **Las cinco tarjetas «Pronto»** de Formación Docente, y las 33 de 42 sin contenido | Una promesa en pantalla es deuda a la vista del maestro |
| **Las misiones del maestro sobre leyes** (11 782 líneas) | Es el temario de un concurso de plaza, con memorama y sopa de letras. Dejar visibles las dos que explican el producto y mover el resto a «Prepárate para el concurso» |
| **html2canvas y el corpus de lectura en la portada** | El revisor midió el peso real comprimido: los 25 scripts son unos 695 KB en el cable, no 2,38 MB. Sigue valiendo cargarlos bajo demanda, pero es deuda baja |

## Qué falta

1. **Asignar una misión al grupo**, con la vista de quién la hizo. Es lo que convierte el
   catálogo en un plan de trabajo, y todas las piezas existen.
2. **Traer las notas de la nube a la boleta.** El maestro está corrigiendo lo ya corregido.
3. **Voz en español y glosario**, para el niño que no lee bien.
4. **La Forma R en veinte misiones**, no en una.
5. **El número de lista obligatorio** cuando hay código de aula.

## Sobre el manual

`P9-10` · baja · deuda

El manual del maestro no menciona Mi aula **ni una vez**: describe 57 misiones, siete materias y
once rutas (hoy son 66, ocho y doce), y una «hoja de cálculo central del proyecto» que no existe.
No dice una palabra de la lista, la asistencia, las notas, las claves de familia ni la boleta, es
decir, de las 6 120 líneas que sostienen el uso diario.

El revisor moderó el impacto: el manual **no está enlazado desde ningún sitio de la aplicación**,
así que el maestro nunca llega a él; lo lee quien entra al repositorio. Lo que el maestro sí
recibe es el kit de capacitación, que está al día. Sigue siendo deuda documental que hay que
reescribir o retirar.

## Cobertura y límites

Los tres flujos se cronometraron con la nube caída y datos sembrados (43 alumnos, ocho materias).
No se probó con un maestro real ni en un teléfono físico. El índice de legibilidad del Aprende es
una aproximación que sirve para ordenar misiones entre sí, no para clasificar su nivel con
precisión. No hay telemetría de uso en el producto, así que **ninguna afirmación sobre qué
herramientas se usan y cuáles no está medida**: son juicios de producto a partir del código y del
contexto del aula, y están marcados como tales.
