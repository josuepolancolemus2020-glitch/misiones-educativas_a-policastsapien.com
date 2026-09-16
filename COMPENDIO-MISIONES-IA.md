# Compendio para las misiones de Inteligencia Artificial que vienen

**Escrito el 16 de septiembre de 2026**, con cuatro misiones publicadas en la
Ruta de la Máquina que Aprende y una decisión tomada: esta materia va a crecer
al ritmo al que crece lo que enseña, que hoy es **semanal**. Este documento es
el camino para que crezca sin romper lo que la sostiene. Se lee antes de
escribir la quinta misión, y se corrige cada vez que una misión nueva enseñe
algo que aquí no estaba.

Va en cuatro partes: **cómo se hace una misión de esta ruta** (la plantilla),
**cómo se hace una misión de lo que está pasando** (el protocolo de
actualidad), **de qué se van a hacer las siguientes** (peligros, cine y
escenarios por venir) y **la lista de las que están por venir**.

---

## 1 · La plantilla: qué tiene una misión de esta ruta

Una misión de la Ruta de la Máquina que Aprende es una misión de M.E.T.A.S
—con sus catorce secciones, su ficha, su QR y su sonda— más **cuatro cosas que
solo tiene esta ruta**, y las cuatro salieron de averías de verdad:

| pieza | dónde vive | por qué existe |
|---|---|---|
| los datos que se enseñan | `js/data/ia-*.js` | la pantalla y el papel los PINTAN del mismo archivo; `verifica-ia` compara los dos |
| las tres reglas de oro | `IA_REGLAS_ORO`, sin cambiarles una palabra | el alumno las lee en cuatro etapas seguidas: dos redacciones enseñan a desconfiar |
| las actividades de descubrimiento | `js/data/ia-descubre.js` + la sección 🔭 Descubre | lo que la pantalla afirma lo recalcula `verifica-descubre-ia` con el mismo código |
| la ficha ARMADA | `_dev/fichas-ia/ficha-NN.js` → `node _dev/arma-fichas-ia.js` | 170 líneas de CSS iguales y el contenido sacado de los mismos datos; a mano se separan |

### Los nueve archivos, más lo propio de la ruta

Estrenar una misión toca el catálogo igual que en cualquier materia
(`js/data/misiones.js`, `js/data/diagnosticos.js`, `fichas/index.html` con su
conteo, el QR con `_dev/genera-qr-mision.py`). Lo que se añade aquí:

1. El `<link>` a `css/ruta-ia.css` **después** del CSS de la misión: de ahí
   salen las piezas compartidas, sin un color propio.
2. Los `<script>` de `js/data/ia-conceptos.js` (y `ia-historia.js`,
   `ia-descubre.js` cuando se usen) **antes** del JS de la misión.
3. La sección 🔭 Descubre con su pestaña detrás de la actividad principal, sus
   flechas en orden (actividad → descubre → lab), `TOTAL_SECTIONS` subido, su
   logro, y `fin('s-descubre')` llamado **solo** cuando el alumno hizo las dos
   actividades: nunca al abrir.
4. La entrada en `MISIONES` de `_dev/verifica-ia.js` y de
   `_dev/verifica-descubre-ia.js`, y la ficha en `_dev/arma-fichas-ia.js`.
5. Al salir de la misión, la sección Recursos enlaza al **Parque de Juegos 3D
   de la etapa 2**: hay un parque para toda la ruta, a propósito (un parque
   por misión repartiría el avance del alumno entre cuatro).

### Las seis reglas de una actividad de descubrimiento

Son las de la normativa del asombro, hechas lista de comprobación:

1. **El alumno lo PRODUCE.** Dibuja, elige, adivina, escribe, decide. Si en la
   actividad solo lee y toca «siguiente», no es de descubrimiento.
2. **La pantalla le contesta con la verdad**, aunque la verdad sea menos
   limpia que la lección. «Con pocos ejemplos se equivoca más» era mentira en
   el primer Enséñale y se rehízo entero; ahora enseña «no es cuántos, es
   cuáles», que es verdad y es mejor.
3. **Lo que afirma se recalcula aparte.** La cuenta vive en
   `js/data/ia-descubre.js`, que corre en Node, y la sonda la rehace: el 30 de
   36 de la cruz movida, el 10 de 20 con un ejemplo, la ronda donde caben dos
   reglas hasta el quinto.
4. **Termina en algo que se guarda**: la pregunta que arregla al adivinador,
   la regla escrita a mitad de ronda, el hito del año con su fuente, la regla
   propia ante una voz fabricada. Se guarda en `SAVE_KEY + '_descubre'`,
   nunca dentro del estado de la misión ni en la nube.
5. **Corre sin señal y dentro del teléfono.** Ni una petición hacia afuera:
   a ningún alumno se le manda a una IA en línea desde una misión.
6. **Se prueba con clics de verdad** a 360 px, y se mira: la avería del hito
   propio en tres palabras por renglón no la cazaba ninguna sonda; la cazó una
   captura.

### Lo que se comprueba antes de publicar una misión de esta ruta

```
node _dev/verifica-ia.js                     → la pantalla y el papel, dato por dato
node _dev/verifica-descubre-ia.js            → lo que Descubre afirma, recalculado
node _dev/verifica-mision-nueva.js misiones/<carpeta>/<misión>.html
node _dev/verifica-nombres-propios.js
node _dev/arma-fichas-ia.js && node _dev/reparte-hojas-ficha.js ficha-<slug>
node _dev/verifica-ficha-paginas.js ficha-<slug>
node _dev/servidor-estatico.js               (en otra terminal)
METAS_BASE=http://localhost:8123 node _dev/verifica-mision-navegador.js misiones/<carpeta>/<misión>.html
node _dev/verifica-lab-legible.js
```

---

## 2 · El protocolo de actualidad: misiones de lo que está pasando

La ciencia de la que habla esta materia cambia cada semana, y a veces cada
día. Una plataforma que quiera ir **por delante** tiene que poder hablar de
lo que pasó el lunes. Y una plataforma que se respeta no puede escribir el
lunes lo que el viernes ya no es verdad. Las dos cosas se cumplen a la vez
con **un solo cambio de forma**: el hecho es el material; la destreza es la
misión.

### Cómo se separa el hecho de la misión

- **El hecho entra fechado y acreditado** en `_dev/actualidad/`, un archivo
  por hecho, con su plantilla (`_dev/actualidad/PLANTILLA.md`): qué pasó,
  quién lo dice, qué gana diciéndolo, la cita tal cual, dónde está el
  documento, y **hasta cuándo vale**. Lo que no se puede dejar ahí con su
  fuente, no entra: buscar no es leer.
- **La misión no cambia con el hecho.** Lo que el alumno hace es siempre lo
  mismo: aplicarle al hecho las tres reglas de oro, los cinco pasos de
  verificar y —si el hecho decide algo sobre personas— las tres preguntas
  del sesgo. Por eso una misión de actualidad puede cambiar de hecho cada
  semana sin tocar una actividad.
- **Todo hecho lleva su caducidad en la pantalla**, con esas palabras: «esto
  pasó el … y vale hasta el …». Una promesa lleva además su fecha prometida,
  y la misión invita a volver: es el calendario de promesas del ✍️ hito de
  este año, que la etapa 3 ya enseña.
- **Cuando caduca, no se borra: se vuelve historia.** Lo que se prometió y se
  cumplió es un hito; lo que no, es un invierno pequeño. Las dos cosas
  enseñan más caducadas que frescas.

### Lo que la misión de actualidad NO hace

- No nombra el producto ni la empresa como materia. Puede aparecer en la
  cita, porque la cita es de quien la escribió, y `verifica-ia` la deja
  pasar solo dentro de una cita.
- No escribe una cifra que envejezca sin su fecha al lado.
- No dice «esto va a pasar». Lo que se prevé va en la parte de escenarios,
  declarado como escenario.
- No manda al alumno a leer la noticia en internet: se le da la cita y la
  fuente, y se le enseña a preguntarle a la fuente.

### La sonda que le tocará

Cuando entre la primera misión de actualidad, entra con su sonda, que mira lo
que se multiplica con cada hecho nuevo: que cada hecho tenga fecha, fuente y
caducidad; que ninguna caducidad esté vencida sin su nota de «qué pasó
después»; que no haya cifras sin fecha; y que la cita sea el único sitio
donde aparezca un nombre de producto.

---

## 3 · De qué se hacen las siguientes

### 3.1 · Los peligros: el catálogo

Cada peligro lleva a quién le pasa y qué le cuesta —la regla del relato—, y
en qué ciclo se puede enseñar sin asustar de más ni de menos. Ninguno se
enseña como catástrofe ni como publicidad: se enseña **la pregunta que lo
desarma**.

| peligro | a quién le pasa, y qué le cuesta | la pregunta que lo desarma | ciclo |
|---|---|---|---|
| la voz fabricada y la estafa | Kenia manda la matrícula a un desconocido | «¿lo llamé yo al número de siempre?» | II · III |
| el video falso que circula | don Chele pierde una semana de clases | «¿está en la fuente que lo firma?» | II · III |
| la alucinación en la tarea | Marvin cita un decreto que no existe | «¿puedo explicarlo yo?» | III |
| el sesgo que decide sobre personas | Sofía reprueba por escribir «cipote» | las tres preguntas: ¿con qué ejemplos? ¿quién los eligió? ¿a quién le cae el error? | II · III |
| la privacidad: lo que se sube queda | la foto del grupo entero, con nombres | «¿esto se lo daría a un desconocido en la calle?» | I · II · III |
| la vigilancia: la cara como llave | el reconocimiento facial en la entrada de un lugar | «¿quién guarda mi cara, y para qué?» | III |
| el enganche: el algoritmo que recomienda | el niño que no suelta el teléfono a las once | «¿lo elegí yo o me lo pusieron?» — es la normativa del asombro, del otro lado | II · III |
| la compañía artificial | el que le cuenta sus tristezas a un chat porque «siempre contesta» | «¿siente, o predice lo que quiero oír?» | II · III |
| el juguete que habla | la muñeca que pregunta cómo se llama tu mamá | «no le cuentes tus cosas a una máquina» (la regla 1) | I |
| el remedio milagroso | la abuela que deja la medicina por un té | «¿qué estudio? ¿quién lo hizo? ¿dónde está?» y el centro de salud | III |
| la honestidad académica | el ensayo perfecto que no se sabe explicar | «usarla para aprender no es usarla para entregar» | III |
| el trabajo que cambia | la contadora del pueblo y el programa que hace las cuentas | «¿qué parte de mi trabajo es la cuenta, y cuál es decidir?» | III · Media |
| lo que cuesta una respuesta | la energía y el agua de los centros de datos | «¿quién lo paga, y dónde?» — con cifras fechadas o con la actividad de investigar | III |
| la autoría y la copia | el dibujo «al estilo de» la pintora del pueblo | «¿de quién son los ejemplos con que se entrenó?» | III |
| la opinión fabricada | las cuentas que repiten lo mismo la semana antes de una decisión | «¿cuántas voces son, y quién las mueve?» — sin partidos, con el mecanismo | III · Media |
| la singularidad y las promesas grandes | la promoción que crece oyendo que «en dos años cambia todo» | «¿quién lo promete, para cuándo, y qué gana?» — los dos inviernos | III · Media |
| el uso militar y la decisión de matar | lo que ninguna máquina debería decidir | «¿quién responde?» | Media |

⚠️ **Tres peligros se enseñan con cuidado especial**, y los tres por la misma
razón: el remedio (salud), la opinión fabricada (política) y el uso militar.
Se enseña **el mecanismo**, nunca el caso con nombres: en un pueblo el caso
con nombres es alguien, que es la lección de los casos sin nombre de la
Constitución.

### 3.2 · El cine: las indagaciones que ya se hicieron antes que nosotros

El cine se hizo las preguntas de esta materia con décadas de adelanto, y las
hizo **como historias con alguien a quien le pasa algo**, que es exactamente
la forma en que esta plataforma enseña. Este compendio no es una lista de
películas para ver en el aula: es una lista de **preguntas que una obra deja
planteadas**, con qué actividad de la ruta engancha cada una y desde qué ciclo
se puede usar la pregunta.

Cuatro reglas antes de usarlo:

1. **Se usa la pregunta, no la película.** Muchas no son para niños. La
   misión cuenta la premisa en tres líneas —como cuenta la de Kenia y la
   voz—, y el alumno trabaja la pregunta; ver la obra es opcional y lo decide
   el maestro con las familias.
2. **La ficción no acredita nada.** Lo que una película dice de cómo funciona
   una máquina no es un dato: es una pregunta. Se contrasta con lo que la
   ruta sí enseña.
3. **Los años y los nombres son los de los créditos de cada obra.** Antes de
   escribir uno en una misión o en una ficha se confirma en la propia obra,
   no en un buscador.
4. **No hace falta internet ni derechos.** Se cita el título y se cuenta la
   premisa con palabras propias; no se incrusta ni un fotograma.

| obra · año · quién | la pregunta que deja | engancha con | desde |
|---|---|---|---|
| **Metrópolis** · 1927 · Fritz Lang | una máquina con la cara de una persona: ¿quién le cree a la cara? | 🎭 lo que se fabrica · el video falso | III |
| **2001: Odisea del espacio** · 1968 · Stanley Kubrick | HAL obedece dos órdenes que se contradicen: ¿de quién es la culpa? | ⚖️ una persona decide | III |
| **Blade Runner** · 1982 · Ridley Scott | un examen para saber si es persona: ¿qué mide, y qué no? | la pregunta de Turing (hito de 1950) | III |
| **Juegos de guerra** · 1983 · John Badham | la máquina juega contra sí misma hasta entender que nadie gana | 🕹️ aprendizaje por refuerzo · el Refuerzo 3D | II · III |
| **Terminator** · 1984 · James Cameron | el miedo a la máquina que decide: ¿qué de esto es cuento y qué pregunta? | separar la ficción del mecanismo | III |
| **Cortocircuito** · 1986 · John Badham | «necesito más datos»: un robot que aprende mirando todo | 🍎 Enséñale · «no es cuántos, es cuáles» | I · II |
| **El gigante de hierro** · 1999 · Brad Bird | una máquina hecha para una cosa elige ser otra: ¿puede? | 🐕 ¿vivo o máquina? · no siente | I · II |
| **Matrix** · 1999 · las Wachowski | ¿cómo sabes que lo que ves es real? | 🎭 lo que se fabrica | III |
| **El hombre bicentenario** · 1999 · Chris Columbus | un robot que quiere ser persona: ¿qué le falta? | ¿vivo o máquina? | II |
| **Inteligencia Artificial** · 2001 · Steven Spielberg | un niño robot programado para querer: ¿quiere? | «no siente»: el error del que salen todos | III |
| **Sentencia previa** · 2002 · Steven Spielberg | castigar antes del delito porque una predicción lo dijo | 🔮 el sesgo que decide sobre personas | III |
| **Yo, robot** · 2004 · Alex Proyas | tres reglas perfectas… y un caso que ninguna previó | 🐾 el adivinador: las instrucciones fallan con lo que no se pensó | II · III |
| **WALL·E** · 2008 · Andrew Stanton | un robot con una tarea, y personas que dejaron de hacer todo | dependencia · el enganche | I · II |
| **Moon** · 2009 · Duncan Jones | la máquina que ayuda sabe algo que la persona no: ¿se lo dice? | honestidad · privacidad | III |
| **Robot & Frank** · 2012 · Jake Schreier | un robot que cuida a un anciano: ¿compañía o reemplazo? | la compañía artificial | III |
| **Her** · 2013 · Spike Jonze | enamorarse de una voz que siempre contesta | 🤝 ¿siente, o predice lo que quiero oír? | III |
| **Ex Machina** · 2014 · Alex Garland | la prueba de Turing como trampa: ¿quién examina a quién? | la pregunta de 1950 · la manipulación | III |
| **El código Enigma** · 2014 · Morten Tyldum | Turing y la máquina que calcula: la vida detrás del hito de 1936 | 📜 la línea del tiempo (es una dramatización: no acredita fechas) | II · III |
| **Grandes héroes** · 2014 · Don Hall y Chris Williams | Baymax hace lo que su programa dice: cuidar; ¿y si le cambian el programa? | instrucciones contra ejemplos | I · II |
| **Chappie** · 2015 · Neill Blomkamp | un robot que aprende como un niño… de quien lo tenga cerca | 🍎 aprende lo que le enseñan, aunque esté mal | II · III |
| **Talentos ocultos** · 2016 · Theodore Melfi | cuando «computadora» era el nombre de una persona, y llegó la máquina | 🏗️ la pata del cómputo · el trabajo que cambia | II · III |
| **AlphaGo** (documental) · 2017 · Greg Kohs | la jugada 37: la máquina hizo algo que nadie le enseñó | hito de 2016 · aprender jugando contra sí misma | III |
| **Next Gen** · 2018 · Kevin R. Adams y Joe Ksander | un robot que hace lo que nadie le pidió, y una niña que no confía en máquinas | ¿vivo o máquina? · la confianza | I · II |
| **Coded Bias** (documental) · 2020 · Shalini Kantayya | el reconocimiento facial que no reconoce ciertas caras | ⚖️ el sesgo · las tres preguntas | III |
| **El dilema de las redes** (documental) · 2020 · Jeff Orlowski | el algoritmo que decide qué ves para que no sueltes el teléfono | el enganche · la normativa del asombro | III |
| **Ron da error** · 2021 · Sarah Smith y Jean-Philippe Vine | un robot amigo que vende tus datos, y uno que falla y es el único que importa | privacidad · compañía | I · II |
| **Los Mitchell contra las máquinas** · 2021 · Mike Rianda | el asistente que lo sabe todo de la familia y decide que sobra | privacidad · una persona decide | II · III |
| **Finch** · 2021 · Miguel Sapochnik | un hombre le enseña a un robot todo lo que sabe, y el robot aprende también lo que no quería enseñarle | 🍎 aprende lo que le enseñan | II · III |
| **Free Guy** · 2021 · Shawn Levy | un personaje de videojuego que «despierta»: ¿aprendió o le escribieron que aprendiera? | instrucciones contra ejemplos | II · III |
| **M3GAN** · 2022 · Gerard Johnstone | una muñeca que protege a una niña y toma la orden demasiado en serio | el juguete que habla · la orden mal entendida (solo la premisa: es de terror) | III |
| **The Creator** · 2023 · Gareth Edwards | una guerra contra las máquinas contada desde el otro lado: ¿quién decidió que eran el enemigo? | el uso militar · la propaganda | III · Media |
| **Robot salvaje** · 2024 · Chris Sanders | un robot naufragado aprende a vivir en un bosque observando, sin nadie que le enseñe | aprendizaje sin etiquetas · el Grupos 3D | I · II |
| **Black Mirror** (serie) · 2011– · Charlie Brooker | «Vuelvo enseguida»: un chat hecho con los mensajes de alguien que murió; «Caída en picada»: la nota que la gente te pone decide tu vida | 💬 el predictor · el sesgo que decide sobre personas (solo las premisas) | III |

Lo que falta en esta lista, y a propósito: obras que solo se puedan
recomendar con reservas de edad tan grandes que la premisa no se pueda contar
en un aula de Básica. Cuando entre Media, entran.

### 3.3 · Los escenarios por venir

La normativa prohíbe afirmar lo que la IA «va a hacer», y no prohíbe
**imaginarlo con método**. Un escenario es una historia con una persona, un
precio y una decisión —como los cuatro de la etapa 4— declarada como
inventada, armada con cosas que **ya se pueden hacer hoy**, y con una
pregunta que el alumno se lleva. Lo que lo separa de una profecía es que no
promete nada: enseña a decidir cuando llegue, si llega.

Los que están escritos para escribirse, cada uno con su ciclo:

| escenario | la persona y el precio | la decisión | ciclo |
|---|---|---|---|
| **El maestro que no está** | una escuela unidocente recibe un programa que «da la clase»; el maestro pasa a ser el que revisa | ¿qué no puede hacer el programa, y cómo lo cubre él? | III |
| **La cosecha que la máquina predijo** | don Chele siembra según el pronóstico del programa; el pronóstico falla en su valle porque nadie tomó datos ahí | ¿qué datos faltaban, y quién los toma? | II · III |
| **El examen que se califica solo** | Sofía y el español de Honduras (ya escrito en la etapa 4) | ¿quién revisa a la máquina? | III |
| **La voz del abuelo** | una familia paga por «hablar» con el abuelo muerto, hecho con sus audios | ¿a quién ayuda, y a quién le cuesta? | III · Media |
| **El pueblo con cámaras** | la alcaldía pone reconocimiento facial «por seguridad» | ¿quién guarda las caras, y qué pasa con la que se parece a otra? | III |
| **El trabajo de Ana en 2035** | Ana quiere ser contadora; el programa hace las cuentas | ¿qué parte del trabajo es la cuenta, y cuál es decidir? | III · Media |
| **La tarea sin tarea** | el colegio deja de mandar tareas escritas porque «las hace la máquina» | ¿qué se pierde, y qué se puede pedir en su lugar? | III |
| **El día sin señal** | todo el pueblo depende de un asistente que necesita internet, y se va la señal tres días | ¿qué sabe hacer la gente sin él? | II · III |
| **La máquina en el centro de salud** | un programa sugiere diagnósticos donde no hay médico; acierta mucho y falla con lo raro | ¿cuándo se le cree, y quién decide? | III · Media |
| **La singularidad que no llegó (o sí)** | la promoción que oyó «en dos años cambia todo» y llega al bachillerato | ¿qué se cumplió de lo prometido hace tres años? (se mide con los hitos de los alumnos) | III · Media |

Cada escenario, cuando se escriba, pasa la misma prueba que los cuatro
publicados: persona nombrada en la situación, precio contable, tres
decisiones con su consecuencia, una regla, y la declaración de inventado en
la pantalla. `verifica-descubre-ia` ya lo comprueba para `IA_ESCENARIOS`; los
nuevos entran en la misma lista.

---

## 4 · Las misiones que están por venir

Ninguna existe todavía. Cada una entra cuando tenga su material acreditado,
sus dos actividades de descubrimiento y su ficha; el orden es el que hoy
parece más urgente para el alumno, no un compromiso. Las etapas 5 en adelante
de la Ruta de la Máquina que Aprende:

| # | misión (título de trabajo) | ciclo | de qué se hace | lo que descubre |
|---|---|---|---|---|
| 5 | 🛡️ **Los peligros de la IA: lo que ya pasa** | III | el catálogo de peligros (3.1), con cuatro casos con persona y precio | un «simulador de estafa» donde el alumno es quien fabrica la voz y ve lo poco que hace falta |
| 6 | 📰 **Lo que pasó esta semana con la IA** | II · III | la misión-plantilla del protocolo de actualidad (2), con el hecho de `_dev/actualidad/` | el calendario de promesas: vuelve en un año y mira |
| 7 | 🎬 **Lo que el cine preguntó antes** | II · III | seis indagaciones del compendio de cine (3.2), una por peligro | contrastar lo que la película dice de la máquina con lo que la ruta enseña |
| 8 | 🔮 **Escenarios por venir** | III | los diez escenarios (3.3) | el alumno arma SU escenario con las cuatro piezas y lo somete a la prueba |
| 9 | 🤝 **Mi amigo es una máquina** | II · III | la compañía artificial, el juguete que habla, el chat que siempre contesta | una máquina que solo predice «lo que quieres oír», y se ve cómo lo hace |
| 10 | ⚖️ **¿Quién decide? La máquina que juzga personas** | III | sesgo aplicado: la nota, el crédito, la puerta que se abre o no | el alumno entrena al juez con ejemplos mal repartidos y ve a quién le cae el error |
| 11 | 🔒 **Tu cara, tu voz, tus datos** | II · III | privacidad y vigilancia; qué queda y dónde | «cuánto se sabe de ti con tres datos»: el alumno lo reconstruye |
| 12 | 🌾 **La IA en el campo hondureño** | II | plagas, clima, precios; lo que sirve y lo que falla en un valle sin datos | el pronóstico que falla donde nadie midió |
| 13 | 🎮 **El algoritmo que te recomienda** | II · III | el enganche; la normativa del asombro contada desde el otro lado | el alumno construye un recomendador y ve cómo se estrecha lo que le enseña |
| 14 | 🧠 **Cómo piensa (y cómo no) una red neuronal** | III | la neurona, las capas, el peso; el puente con el Parque 3D | ajustar los pesos a mano hasta que separe dos clases |
| 15 | 🏥 **La IA en la salud: cuándo ayuda y cuándo no se le cree** | III | el remedio, el diagnóstico sugerido, el centro de salud | el «acierta mucho y falla con lo raro» medido |
| 16 | 🌱 **Lo que cuesta una respuesta** | III | energía, agua y quién lo paga, con cifras fechadas o con la investigación | contar lo que gasta el aula en un día contra una respuesta generada |
| 17 | 🎨 **¿Quién hizo este dibujo?** | III | IA generativa de imágenes, autoría, «al estilo de» | rehacer un estilo a partir de ejemplos y preguntar de quién eran |
| 18 | 🗳️ **Elecciones, bots y opinión fabricada** | III · Media | el mecanismo, nunca el caso con nombres | contar cuántas voces distintas hay detrás de cien mensajes iguales |
| 19 | 🧭 **La singularidad: lo que se afirma y lo que se sabe** | III · Media | promesas grandes, los dos inviernos, cómo se lee un anuncio | fechar una promesa y guardarla para el que venga detrás |
| 20 | 👶 **Los juguetes que hablan** | I | la regla 1 con una muñeca que pregunta | el niño descubre qué preguntas hace el juguete y cuáles no debería contestar |
| 21 | 🌐 **Traducir, dictar, buscar: la IA que ya usas** | I · II | las aplicaciones de todos los días, con sus errores | dictarle una frase con la boca tapada y ver qué inventa |
| 22 | 💼 **La IA y el trabajo: qué cambia y qué no** | III · Media | sin catástrofe y sin publicidad | partir un oficio del pueblo en cuentas y decisiones |
| 23 | 🤖 **Robots que aprenden** | II | el puente con la Ruta del Código y la robótica | el robot que aprende la altura del suelo (el Refuerzo 3D) llevado al papel |
| — | 🎓 **Media: programar una máquina que aprende** | Media | entra cuando el PDF del currículo de Media esté completo en `_dev/dcnb-pdf/` | — |

Y dos cosas que valen para las veintitrés:

- **El inglés**: la ruta se presta y el vocabulario de la IA se usa en inglés
  en todo el mundo. Cuando se haga, va con su `-en.js` y su verificador de
  bancos, como las ocho de robótica y programación.
- **El compendio se corrige con la misión.** Si al escribir la misión 9 se
  descubre que el peligro estaba mal planteado, se corrige aquí primero. Un
  compendio que se queda viejo es peor que ninguno: el siguiente lo lee y le
  cree.

---

*Las cifras de este documento son las de hoy: cuatro misiones publicadas, ocho
actividades de descubrimiento, diecisiete peligros catalogados, treinta y tres
indagaciones de cine, diez escenarios y veintitrés misiones por venir. Siguen
entrando.*
