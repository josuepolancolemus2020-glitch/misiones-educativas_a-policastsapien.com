# Faltantes del banco de pensamiento crítico

Lista de las 13 misiones cuyo banco de la prueba de pensamiento crítico es
demasiado chico para dar 50 formas distintas. Medido el 15 de noviembre de
2026 sobre `main` en `b774eda`. Acompaña a `docs/PLAN-MOTOR-COMPARTIDO.md`
(decisión 9 de Josué).

**Aquí no hay preguntas nuevas.** Solo se cuenta qué hay, qué falta y qué
temas cubre ya cada banco, para que quien las escriba no repita ni se salga
de la misión.

## Cómo leer las cifras

- **Banco → saca**: cuántos casos tiene el banco y cuántos entran en cada forma.
  «2 → 2» o «1 → 1» significa que **todas las formas llevan exactamente esos
  mismos casos**: ese apartado no aporta ninguna variedad.
- **Conjuntos posibles**: cuántas combinaciones distintas de casos permite el
  banco (producto de las combinaciones de cada apartado, sin contar el orden).
  Para 50 formas sin repetir conjunto hacen falta al menos 50.
- **Mínimo para 50**: la menor cantidad de casos nuevos con la que el banco
  llega a 50 conjuntos. Exige que el motor reparta las formas sin repetir
  (no al azar), porque queda muy justo.
- **Con holgura**: la menor cantidad para pasar de 200 conjuntos. Es lo que
  recomiendo: las formas se parecen menos entre sí y el reparto no queda al límite.
- Una **variante** de un caso existente (mismo concepto, otros datos, nombres
  o ejemplo) cuenta igual que un caso nuevo para estas cuentas.
- Los apartados y la cantidad que se saca de cada uno son los de hoy. Como la
  crítica se rehace (decisión 1), también se puede cambiar cuántos se sacan;
  estas cuentas suponen que no cambia.

## Resumen

| misión | conjuntos hoy | distintas hoy (1 a 30) | mínimo para 50 | con holgura |
|---|---|---|---|---|
| `2y3ciclo-robots-problemas` | **resuelta: 240** | 30 | — | — |
| `3ciclo-peligros-ia` | **resuelta: 240** | 27 | — | — |
| `2ciclo-como-aprende-una-maquina` | **resuelta: 240** | 28 | — | — |
| `3ciclo-albores-singularidad` | **resuelta: 240** | 28 | — | — |
| `3ciclo-escenarios-porvenir` | **resuelta: 240** | 28 | — | — |
| `3ciclo-ia-generativa` | **resuelta: 240** | 28 | — | — |
| `2y3ciclo-programando-robot` | **resuelta: 288** | 27 | — | — |
| `basica-de-que-esta-hecho-el-mundo` | **resuelta: 240** | 26 | — | — |
| `2y3ciclo-electricidad-robots` | **resuelta: 384** | 30 | — | — |
| `basica-como-se-que-se` | **resuelta: 300** | 29 | — | — |
| `basica-palabras-que-piensan` | **resuelta: 300** | 29 | — | — |
| `2y3ciclo-historia-ia` | **resuelta: 360** | 30 | — | — |
| `2y3ciclo-mayas-precolombinas` | **resuelta: 288** | 29 | — | — |
| **Total** | **las 13 resueltas** | | | |

Las cifras de «distintas» de las misiones resueltas cuentan conjuntos de
casos, sin el orden: es la misma cuenta que `_dev/formas-oro/_critica-pendiente.json`
(`genera-formas-oro.js --pendiente-critica`). Donde no llegan a 30, las que
se repiten chocan por azar: se arreglan con el reparto sin repetición, sin
escribir contenido.

El mínimo matemático deja varios apartados con un solo caso, que seguiría
saliendo en las 50 formas. Al final de cada misión se anota cuáles son, por
si se quiere dar variedad también ahí.

---

## 1. `2y3ciclo-robots-problemas` · resuelta

**Resuelta el 15 de noviembre de 2026** con los 6 casos de holgura que aprobó
Josué: Caso +3 (gallinero que queda abierto de noche, pila de la escuela que
se rebalsa, frijol que se enmohece en la bodega), Comparación +1 (boceto
frente a prototipo) y Diseño +2 (niños de primer grado que cruzan frente a la
escuela, vacunas del centro de salud cuando se va la luz). Ahora son
**240 conjuntos** (10 × 2 × 2 × 2 × 3) y las formas 1 a 30 salen las 30
distintas. No cambió cuántos casos saca cada apartado ni el generador; las
formas conceptual y operativa congeladas siguen idénticas.

Cuatro textos se retocaron para no dejar pistas cruzadas
(`_dev/verifica-examen-sin-pistas.js`): la comparación ya no nombra «boceto»
ni «prototipo» ni dice «para qué sirve» cada parte, que es la corrección del
error del boceto; la pila ya no dice que «nadie cierra el chorro», que se
parecía a la respuesta del regador; y la bodega ya no repite palabras de otro
caso. Las pautas quedaron como se aprobaron.

Lo que había antes:

Banco en `misiones/2y3ciclo-robots-problemas/js/robots-problemas.js` (la prueba se arma en la línea 842).

| apartado | banco → saca | qué cubre ya |
|---|---|---|
| Caso (del problema al robot) | 2 → 2 | Basura mezclada en el centro educativo (sensor de peso o color, banda y compuerta); pájaros en la milpa (sensor de movimiento, brazo con cintas) |
| Error conceptual | 2 → 1 | «Si el prototipo falla a la primera, el proyecto fracasó»; «en el boceto no importa para qué sirve cada parte» |
| Proceso (qué falló en la prueba) | 2 → 1 | Regador del huerto que no cierra el agua; techo del secado de café demasiado lento |
| Comparación | 1 → 1 | Criterio de éxito frente a restricción (límite) |
| Diseño | 1 → 1 | Quebrada que inunda el barrio de noche |

- Conjuntos hoy: 4. Es la más corta: solo 8 formas distintas.
- **Mínimo para 50: 4 casos** (Caso +2, Comparación +1, Diseño +1), da 96.
- **Con holgura: 6 casos** (Caso +3, Comparación +1, Diseño +2), da 240.

## 2. `3ciclo-peligros-ia` · resuelta

**Resuelta el 15 de noviembre de 2026** con los 5 casos de holgura que aprobó
Josué, todos sacados de peligros que ya están en `js/data/ia-peligros.js`:
Causa +2 (el programa de becas que aprendió de años anteriores, la cara que no
se cambia como una contraseña) y Efecto +3 (la abuela y el remedio del video,
el juguete que hace preguntas, el comedor y las reseñas fabricadas). El
remedio y la opinión fabricada siguen sin nombres, como pide ese archivo.
Ahora son **240 conjuntos** (2 × 6 × 20) y las formas 1 a 30 dan 27
distintas: las tres que se repiten chocan por azar y se arreglan con el
reparto sin repetición, como las 9 de «Lo que esta lista no cubre». No cambió
cuántos casos saca cada apartado ni el generador; las formas conceptual y
operativa congeladas siguen idénticas.

Un retoque para no dejar pistas cruzadas (`_dev/verifica-examen-sin-pistas.js`):
en la pauta del remedio, «nadie buscó quién lo firma» pasa a «nadie averiguó
quién lo firma», porque el caso de los videos dice «videos que no buscó».

Lo que había antes:

Banco en `misiones/3ciclo-peligros-ia/js/peligros-ia.js` (línea 1726).

| apartado | banco → saca | qué cubre ya |
|---|---|---|
| Caso | 2 → 1 | Dos horas viendo videos que no buscó (atención); video del director que no está en cuenta oficial (falsificación) |
| Error conceptual | 1 → 1 | «Como hay estafas, no le creo a ningún mensaje» |
| Decisión | 1 → 1 | Compañero que entrega un ensayo hecho por un chat y no lo puede explicar |
| Comparación | 1 → 1 | Alucinación frente a estafa con voz fabricada |
| Causa | 2 → 2 | Las tres señales del engaño; un chat está hecho para seguir la conversación |
| Efecto | 3 → 3 | Foto de compañeros publicada con nombre; fotos del viaje y casa sola; aparato que escucha en casa |

- Conjuntos hoy: 2.
- **Mínimo para 50: 3 casos** (Causa +1, Efecto +2), da 60.
- **Con holgura: 5 casos** (Causa +2, Efecto +3), da 240.
- Seguirían con un solo caso: Error, Decisión y Comparación.
- Los peligros de esta misión viven en `js/data/ia-peligros.js`: un caso nuevo
  tiene que salir de los que ya están ahí.

## 3. `2ciclo-como-aprende-una-maquina` · resuelta

**Resuelta el 15 de noviembre de 2026** con los 4 casos de holgura que aprobó
Josué: Causa +1 (fotos de gatos etiquetadas «perro») y Efecto +3 (el filtro de
correos y el engaño nuevo, mil fotos más, el teclado que adivina la palabra).
Ahora son **240 conjuntos** (2 × 2 × 3 × 20) y las formas 1 a 30 dan 28
distintas: las dos que se repiten chocan por azar y se arreglan con el
reparto sin repetición. No cambió cuántos casos saca cada apartado ni el
generador; las formas conceptual y operativa congeladas siguen idénticas.

Un retoque para no dejar pistas cruzadas (`_dev/verifica-examen-sin-pistas.js`):
en la pauta del teclado, «qué palabra suele venir después» pasa a «qué
palabra suele seguir», porque el efecto de las mil fotos empieza con
«Después de ver mil fotos más».

Lo que había antes:

Banco en `misiones/2ciclo-como-aprende-una-maquina/js/como-aprende-una-maquina.js` (línea 1504).

| apartado | banco → saca | qué cubre ya |
|---|---|---|
| Caso | 2 → 1 | Programa de voz a letras entrenado solo con adultos; clasificador de recibos que acierta 95 de 100 y ya nadie revisa |
| Error conceptual | 2 → 1 | «Las etiquetas se pueden poner al azar»; «con más ejemplos iguales siempre aprende más» |
| Decisión | 1 → 1 | Probar con ejemplos ya vistos o con nuevos |
| Comparación | 1 → 1 | El dato (la foto de la hoja) frente a la etiqueta («sana») |
| Causa | 2 → 2 | Ejemplos de una sola zona; ejemplos de los cuatro cultivos |
| Efecto | 3 → 3 | Grupos sin nombre (aprendizaje sin etiquetas); la máquina de ajedrez que aprende probando; no sabe explicar por qué dijo «plaga» |

- Conjuntos hoy: 4.
- **Mínimo para 50: 3 casos** (Causa +1, Efecto +2), da 120.
- **Con holgura: 4 casos** (Causa +1, Efecto +3), da 240.
- Seguirían con un solo caso: Decisión y Comparación.

## 4. `3ciclo-albores-singularidad` · resuelta

**Resuelta el 15 de noviembre de 2026** con los 4 casos de holgura que aprobó
Josué: Causa +1 (el producto anunciado sin decir cómo se midió) y Efecto +3 (el
municipio que compra y deja de usar, los expertos que no se ponen de acuerdo,
la misma noticia en tres medios). Ninguno cita un hecho fechado.
Ahora son **240 conjuntos** (2 × 2 × 3 × 20) y las formas 1 a 30 dan 28
distintas: las dos que se repiten chocan por azar y se arreglan con el
reparto sin repetición. No cambió cuántos casos saca cada apartado ni el
generador; las formas conceptual y operativa congeladas siguen idénticas.

Lo que había antes:

Banco en `misiones/3ciclo-albores-singularidad/js/albores-singularidad.js` (línea 1081).

| apartado | banco → saca | qué cubre ya |
|---|---|---|
| Caso | 2 → 1 | Estudio de un organismo internacional con fecha y método; investigador de seguridad que renuncia y lo explica por escrito |
| Error conceptual | 2 → 1 | «La IA entiende lo que lee y nunca inventa»; «la noticia es de septiembre, así que el hecho es de septiembre» |
| Decisión | 1 → 1 | Promesa de la industria sin plazo: discutirla o apuntarla con fecha |
| Comparación | 1 → 1 | Punto de inflexión frente a noticia grande |
| Causa | 2 → 2 | Los dos inviernos de la IA (se prometió de más); el titular con la palabra más fuerte |
| Efecto | 3 → 3 | Dos noticias contrarias y ciertas; becas descartadas por venir como anuncio patrocinado; promedio alto que esconde a quién le falla |

- Conjuntos hoy: 4.
- **Mínimo para 50: 3 casos** (Causa +1, Efecto +2), da 120.
- **Con holgura: 4 casos** (Causa +1, Efecto +3), da 240.
- Seguirían con un solo caso: Decisión y Comparación.
- Ojo: esta misión pinta un dossier fechado (`js/data/ia-actualidad.js`). Un
  caso nuevo que cite un hecho debe llevar su fecha y su fuente en `_dev/`.

## 5. `3ciclo-escenarios-porvenir` · resuelta

**Resuelta el 15 de noviembre de 2026** con los 4 casos de holgura que aprobó
Josué: Causa +1 (el traductor que no conoce las palabras garífunas) y Efecto +3 (el
taller de carpintería que contrata otro aprendiz, la cajera que aprende a
revisar las cajas automáticas, la estudiante que conversa con un turista en
Copán).
Ahora son **240 conjuntos** (2 × 2 × 3 × 20) y las formas 1 a 30 dan 28
distintas: las dos que se repiten chocan por azar y se arreglan con el
reparto sin repetición. No cambió cuántos casos saca cada apartado ni el
generador; las formas conceptual y operativa congeladas siguen idénticas.

Lo que había antes:

Banco en `misiones/3ciclo-escenarios-porvenir/js/escenarios-porvenir.js` (línea 1357).

| apartado | banco → saca | qué cubre ya |
|---|---|---|
| Caso | 2 → 1 | La señorita Lesly y el correo que contesta el programa; la enfermera Sandra y las radiografías |
| Error conceptual | 2 → 1 | «Ordenar una lista ya es IA»; «al albañil le queda la mitad del día libre» (tareas, no horas) |
| Decisión | 1 → 1 | Exponer leyendo la hoja de la máquina o preparar respuestas |
| Comparación | 1 → 1 | Resumen de la Independencia frente a medir tu propio patio |
| Causa | 2 → 2 | Nadie midió la lluvia en la ladera de don Chele; la tarea pedía un dato del propio barrio |
| Efecto | 3 → 3 | Buenas notas en tareas y mala en examen; padre enojado atendido por una persona; dato inventado entregado con el nombre del alumno |

- Conjuntos hoy: 4.
- **Mínimo para 50: 3 casos** (Causa +1, Efecto +2), da 120.
- **Con holgura: 4 casos** (Causa +1, Efecto +3), da 240.
- Seguirían con un solo caso: Decisión y Comparación.

## 6. `3ciclo-ia-generativa` · resuelta

**Resuelta el 15 de noviembre de 2026** con los 4 casos de holgura que aprobó
Josué: Causa +1 (el modelo que aprendió prediciendo la palabra siguiente) y Efecto +3
(la imagen falsa del huracán sobre San Pedro Sula, dos respuestas distintas a
la misma petición, la fecha de la Independencia equivocada en un resumen).
Ahora son **240 conjuntos** (2 × 2 × 3 × 20) y las formas 1 a 30 dan 28
distintas: las dos que se repiten chocan por azar y se arreglan con el
reparto sin repetición. No cambió cuántos casos saca cada apartado ni el
generador; las formas conceptual y operativa congeladas siguen idénticas.

Lo que había antes:

Banco en `misiones/3ciclo-ia-generativa/js/ia-generativa.js` (línea 1503).

| apartado | banco → saca | qué cubre ya |
|---|---|---|
| Caso | 2 → 1 | Audio con la voz del director; maestro que pide una explicación a la IA y luego la comprueba |
| Error conceptual | 2 → 1 | «Para verificar le pregunto otra vez a la misma IA»; «si el libro citado suena perfecto, existe» |
| Decisión | 1 → 1 | Decir o callar que se usó IA para ordenar el ensayo |
| Comparación | 1 → 1 | Buscador frente a modelo de lenguaje |
| Causa | 2 → 2 | Programa que califica redacciones entrenado con textos de otros países; lo que se escribe queda guardado |
| Efecto | 3 → 3 | Aviso con «dicen que...» que nadie puede comprobar; petición con sus cuatro piezas; noticia falsa en cien grupos |

- Conjuntos hoy: 4.
- **Mínimo para 50: 3 casos** (Causa +1, Efecto +2), da 120.
- **Con holgura: 4 casos** (Causa +1, Efecto +3), da 240.
- Seguirían con un solo caso: Decisión y Comparación.

## 7. `2y3ciclo-programando-robot` · resuelta

**Resuelta el 15 de noviembre de 2026** con los casos de holgura que aprobó
Josué: Qué le falta +2 (el robot que se detiene al primer paso porque falta REPITE, y
el que se sale en la primera curva porque no revisa el sensor), con su par en
`programando-robot-en.js`.
Ahora son **288 conjuntos** (6 × 2 × 4 × 2 × 3) y las formas 1 a 30 dan **27 distintas**
(antes 23, contando conjuntos). No cambió cuántos casos saca cada apartado ni
el generador; las formas conceptual y operativa congeladas siguen idénticas.

Un retoque para no dejar pistas cruzadas (`_dev/verifica-examen-sin-pistas.js`):
en el caso del REPITE, «se detiene después de un solo paso» pasa a «se
detiene al primer paso» (y en inglés, «stops after a single step» a «stops at
the first step»), porque la pauta del contador dice «después de RECOGE».

Lo que había antes:

Banco en `misiones/2y3ciclo-programando-robot/js/programando-robot.js` (línea 987).

| apartado | banco → saca | qué cubre ya |
|---|---|---|
| Qué le falta al programa | 2 → 2 | Robot recogedor que siempre cuenta 0 (falta el contador); regador que abre y nunca cierra (falta la orden de cerrar) |
| Error conceptual | 2 → 1 | «Girar también hace avanzar»; «el pseudocódigo es perder el tiempo, mejor probar al azar» |
| Seguir el programa paso a paso | 4 → 1 | Cuatro arranques en la cuadrícula: cajón en A3, pasillo con línea negra, cajón en C5, línea que dobla a la izquierda |
| Comparación de programas | 2 → 1 | Repetir hasta la meta frente a repetir para siempre; esperar la señal frente a salir sin esperar |
| Diseño | 3 → 1 | Llevar la lista por el pasillo; espantar pájaros en la milpa; revisar la puerta de la pulpería |

- Conjuntos hoy: 48. Casi alcanza.
- **Mínimo para 50: 1 caso** (Qué le falta +1), da 144.
- **Con holgura: 2 casos** (Qué le falta +2), da 288.
- Es bilingüe: cada caso nuevo necesita su par en `programando-robot-en.js`.

## 8. `basica-de-que-esta-hecho-el-mundo` · resuelta

**Resuelta el 15 de noviembre de 2026** con los casos de holgura que aprobó
Josué: Causa +1 (el agua de la quebrada nunca es la misma) y Efecto +2 (el machete
del abuelo con cabo y hoja nuevos, el ternero que creció). Salen de lo que ya
enseña `js/data/filosofia-mundo.js`: Heráclito y el machete al que le
cambian el mango.
Ahora son **240 conjuntos** (4 × 2 × 3 × 10) y las formas 1 a 30 dan **26 distintas**
(antes 8, contando conjuntos). No cambió cuántos casos saca cada apartado ni
el generador; las formas conceptual y operativa congeladas siguen idénticas.

Lo que había antes:

Banco en `misiones/basica-de-que-esta-hecho-el-mundo/js/de-que-esta-hecho-el-mundo.js` (línea 1152).

| apartado | banco → saca | qué cubre ya |
|---|---|---|
| Caso | 4 → 1 | La leche cortada de doña Lidia; la sal mojada de doña Nely; el rastrojo quemado y la ceniza; la escuela a la que le cambian el nombre (qué cambia y qué permanece) |
| Error conceptual | 1 → 1 | «La palabra átomo quiere decir que ya se comprobó que no se parte» |
| Decisión | 1 → 1 | Si el número 7 existe aunque nadie lo pueda tocar |
| Comparación | 2 → 1 | Pregunta que pasó a la ciencia frente a pregunta que sigue abierta; Heráclito frente a Parménides |
| Causa | 2 → 2 | La cosmovisión se aprende oyendo en la casa; en Honduras hay varias maneras de explicar el mundo |
| Efecto | 3 → 3 | El reflejo del cerro en la laguna; el globo inflado pesa más; el alambre doblado pesa igual |

- Conjuntos hoy: 8.
- **Mínimo para 50: 2 casos** (Causa +1, Efecto +1), da 96.
- **Con holgura: 3 casos** (Causa +1, Efecto +2), da 240.
- Seguirían con un solo caso: Error y Decisión.
- Los datos de esta misión viven en `js/data/filosofia-mundo.js` y su ficha se
  arma con `_dev/arma-ficha-mundo.js`: un caso nuevo tiene que salir de ahí.

## 9. `2y3ciclo-electricidad-robots` · resuelta

**Resuelta el 15 de noviembre de 2026** con los casos de holgura que aprobó
Josué: Diagnóstico +1 (el timbre que suena cada día más débil: la pila) y
Comparación +1 (la pila frente al tomacorriente), con su par en
`electricidad-robots-en.js`. Ya no queda ningún apartado que salga igual en
todas las formas.
Ahora son **384 conjuntos** (3 × 4 × 4 × 2 × 4) y las formas 1 a 30 dan **30 distintas**
(antes 22, contando conjuntos). No cambió cuántos casos saca cada apartado ni
el generador; las formas conceptual y operativa congeladas siguen idénticas.

Lo que había antes:

Banco en `misiones/2y3ciclo-electricidad-robots/js/electricidad-robots.js` (línea 852).

| apartado | banco → saca | qué cubre ya |
|---|---|---|
| Diagnóstico del circuito | 2 → 2 | LED que no enciende con uniones firmes (está al revés); dos foquitos en serie con un filamento roto |
| Error conceptual | 4 → 1 | Voltaje confundido con corriente; «el agua nunca conduce»; quitar la resistencia al LED; unir los dos polos «recarga» la pila |
| Recorrido de la corriente | 4 → 1 | Linterna de pilas; foco del baño de la escuela; timbre del aula; cargador del celular |
| Comparación | 1 → 1 | Conductor frente a aislante |
| Diseño | 4 → 1 | Apagones y no encontrar la linterna; corral oscuro y el zorro; caserío sin tendido pero con sol; pulpería que no nota al cliente |

- Conjuntos hoy: 64. **El banco ya alcanza para 50.** Hoy solo salen 26
  distintas en las primeras 30 porque el azar repite; con un reparto sin
  repetición no hace falta escribir nada.
- **Mínimo para 50: 0 casos.**
- **Con holgura: 2 casos** (Diagnóstico +1, Comparación +1), da 384. Además
  quita los dos apartados que hoy salen iguales en todas las formas.
- Es bilingüe: cada caso nuevo necesita su par en `electricidad-robots-en.js`.

## 10. `basica-como-se-que-se` · resuelta

**Resuelta el 15 de noviembre de 2026** con los casos de holgura que aprobó
Josué: Causa +1 (lo que otro cuenta pasa por su memoria) y Efecto +2 (los vecinos que
miden el solar con cinta, la niña que sabe que 7 + 5 son 12 razonando).
Ahora son **300 conjuntos** (5 × 2 × 3 × 10) y las formas 1 a 30 dan **29 distintas**
(antes 10, contando conjuntos). No cambió cuántos casos saca cada apartado ni
el generador; las formas conceptual y operativa congeladas siguen idénticas.

Lo que había antes:

Banco en `misiones/basica-como-se-que-se/js/como-se-que-se.js` (línea 1154).

| apartado | banco → saca | qué cubre ya |
|---|---|---|
| Caso | 5 → 1 | El bus de Mauro que «siempre» pasa a las seis; la semilla que «rinde el doble» sin que nadie diga quién contó; los hermanos y el ancho de la puerta; el muchacho que no le cree a nadie; el agua de la pila caliente o fría |
| Error conceptual | 1 → 1 | «"Esta canción es fea" está mal dicho porque no se puede comprobar» (opinión frente a hecho) |
| Decisión | 1 → 1 | Dato en una hoja suelta sin autor para el trabajo de Ciencias |
| Comparación | 2 → 1 | El lápiz que se ve quebrado frente al que se toca; «2 + 2 son 4» frente a «el techo es de lámina» (razón y experiencia) |
| Causa | 2 → 2 | Si solo buscas lo que te da la razón, lo encuentras; la memoria se acomoda sola |
| Efecto | 3 → 3 | Cambiar de idea ante una medida; la moneda que aparece al echar agua; dos cuadritos del mismo lápiz que se ven distintos |

- Conjuntos hoy: 10.
- **Mínimo para 50: 2 casos** (Causa +1, Efecto +1), da 120.
- **Con holgura: 3 casos** (Causa +1, Efecto +2), da 300.
- Seguirían con un solo caso: Error y Decisión.
- Datos en `js/data/filosofia-saber.js`; ficha armada con `_dev/arma-ficha-saber.js`.

## 11. `basica-palabras-que-piensan` · resuelta

**Resuelta el 15 de noviembre de 2026** con los casos de holgura que aprobó
Josué: Causa +1 (la definición demasiado ancha) y Efecto +2 (la banca del parque y el
banco del centro, la noticia que llama «invasores» a unas familias).
Ahora son **300 conjuntos** (5 × 2 × 3 × 10) y las formas 1 a 30 dan **29 distintas**
(antes 10, contando conjuntos). No cambió cuántos casos saca cada apartado ni
el generador; las formas conceptual y operativa congeladas siguen idénticas.

Lo que había antes:

Banco en `misiones/basica-palabras-que-piensan/js/palabras-que-piensan.js` (línea 1248).

| apartado | banco → saca | qué cubre ya |
|---|---|---|
| Caso | 5 → 1 | Doña Marta y «a las siete» (ambigüedad); doña Chepa y «de mejor calidad» (palabra vaga); Wilmer y la pregunta que da por cierto lo que pregunta; la mamá de Selvin y «regalo» que era préstamo; Kenia y la definición de ave |
| Error conceptual | 2 → 1 | «Elegir una palabra suave es mentir»; «toda palabra fuerte es una trampa» |
| Decisión | 1 → 1 | Aviso de la alcaldía: fijarse solo en lo que dice o también en lo que busca |
| Comparación | 1 → 1 | «¿Me pasás la sal?» frente a «¿Cuánto cuesta la sal?» (pedir frente a preguntar) |
| Causa | 2 → 2 | Cada palabra arrastra la vida de quien la usa; una frase puede estar bien escrita y no decir nada claro |
| Efecto | 3 → 3 | La ironía por escrito; «ya son las seis» tomado como dato; dos libros que nombran distinto el mismo hecho |

- Conjuntos hoy: 10.
- **Mínimo para 50: 2 casos** (Causa +1, Efecto +1), da 120.
- **Con holgura: 3 casos** (Causa +1, Efecto +2), da 300.
- Seguirían con un solo caso: Decisión y Comparación.
- Datos en `js/data/filosofia-lenguaje.js`; ficha armada con `_dev/arma-ficha-lenguaje.js`.

## 12. `2y3ciclo-historia-ia` · resuelta

**Resuelta el 15 de noviembre de 2026** con los casos de holgura que aprobó
Josué: Causa +1 (el invierno de los años setenta) y Efecto +2 (el programa de damas de
1959, el transformador de 2017). Los tres hitos están en `js/data/ia-historia.js`.
Ahora son **360 conjuntos** (2 × 2 × 3 × 3 × 10) y las formas 1 a 30 dan **30 distintas**
(antes 12, contando conjuntos). No cambió cuántos casos saca cada apartado ni
el generador; las formas conceptual y operativa congeladas siguen idénticas.

Un retoque para no dejar pistas cruzadas (`_dev/verifica-examen-sin-pistas.js`):
en la pauta de las damas, «Arthur Samuel le puso nombre a eso: aprendizaje de
máquina» pasa a «Arthur Samuel lo llamó aprendizaje de máquina», porque la
causa de Dartmouth dice «le puso nombre».

Lo que había antes:

Banco en `misiones/2y3ciclo-historia-ia/js/historia-ia.js` (línea 1686).

| apartado | banco → saca | qué cubre ya |
|---|---|---|
| Caso | 2 → 1 | Noticia que promete que en dos años las máquinas harán todo; compañero que dice que aprendieron solas el día del go |
| Error conceptual | 2 → 1 | «Deep Blue pensó mejor que el campeón»; «ELIZA entendía a la gente» |
| Decisión | 3 → 1 | Citar una fecha diciendo de dónde salió; libro sin el dato: copiar o buscar la fuente; duda entre dos años: escribir la década |
| Comparación | 1 → 1 | Sistema experto de los ochenta frente a red entrenada con ejemplos |
| Causa | 2 → 2 | Dartmouth 1956 le puso nombre; las tarjetas gráficas de los videojuegos y 2012 |
| Efecto | 3 → 3 | Cuesta saber si una voz o un video son de verdad (desde 2023); la jugada de AlphaGo; el maestro que corrige textos de origen dudoso |

- Conjuntos hoy: 12.
- **Mínimo para 50: 2 casos** (Causa +1, Efecto +1), da 144.
- **Con holgura: 3 casos** (Causa +1, Efecto +2), da 360.
- Seguiría con un solo caso: Comparación.
- Las fechas de esta misión viven en `js/data/ia-historia.js`. Un caso nuevo
  solo puede usar hitos que ya están ahí.

## 13. `2y3ciclo-mayas-precolombinas` · resuelta

**Resuelta el 15 de noviembre de 2026** con los casos de holgura que aprobó
Josué: Causa +1 (observaban el cielo, y por eso su calendario era muy exacto) y Efecto +1 (los glifos
de las gradas de Copán).
Ahora son **288 conjuntos** (4 × 3 × 2 × 3 × 4) y las formas 1 a 30 dan **29 distintas**
(antes 19, contando conjuntos). No cambió cuántos casos saca cada apartado ni
el generador; las formas conceptual y operativa congeladas siguen idénticas.

Un retoque para no dejar pistas cruzadas (`_dev/verifica-examen-sin-pistas.js`):
el efecto «En Copán hay una escalinata con miles de glifos tallados en sus
gradas» pasa a «En Copán hay unas gradas de piedra con miles de glifos»,
porque la comparación pide reconocer la Escalinata Jeroglífica de Copán y el
caso le dejaba escrito el nombre.

Lo que había antes:

Banco en `misiones/2y3ciclo-mayas-precolombinas/js/mayas-precolombinas.js` (línea 808).

| apartado | banco → saca | qué cubre ya |
|---|---|---|
| Caso | 4 → 1 | Familia lenca de La Esperanza y la alfarería; la milpa de maíz, frijol y calabaza; el turista que pregunta por el abandono de Copán; el Popol Vuh en la feria escolar |
| Error conceptual | 3 → 1 | Incas y aztecas con el lugar cambiado; «los garífunas ya estaban antes de Colón»; «en la sociedad maya todos eran iguales» |
| Decisión | 2 → 1 | Pieza antigua de barro encontrada en el campo; cartel con mayas a caballo |
| Comparación | 1 → 1 | Estela frente a Escalinata de los Jeroglíficos |
| Causa | 2 → 2 | Tenochtitlan sobre un lago (chinampas); declaratoria de la UNESCO |
| Efecto | 3 → 3 | Pirámides, templos y cancha de pelota; números muy grandes (base 20 y cero); templos bajo templos (Rosalila) |

- Conjuntos hoy: 24.
- **Mínimo para 50: 1 caso** (Efecto +1), da 96.
- **Con holgura: 2 casos** (Causa +1, Efecto +1), da 288.
- Seguiría con un solo caso: Comparación.

---

## Notas para quien escriba los casos

1. **Solo lo que la misión enseña.** Cada caso nuevo debe poder señalar la
   pantalla, el laboratorio o la actividad de su misión donde está ese dato.
   Es el campo `fuente` del formato propuesto en el plan (sección 6.3).
2. **Un dato, una pregunta.** Ningún caso nuevo debe dar la respuesta de otro
   ni de una pregunta del examen conceptual. Lo vigila
   `_dev/verifica-examen-sin-pistas.js`.
3. **Nada que conteste la historia o la animación de la misión.** Es la regla
   escrita en `la-celula.js:352` a `:369`, y vale para todas.
4. **Hechos con fuente.** Fechas, cifras y nombres propios se acreditan con
   lo que hay en `_dev/` o en el archivo de `js/data/` de esa misión.
5. **Bilingües.** Programando un robot y Electricidad para robots tienen
   versión en inglés.
6. **Aviso a los docentes.** Al rehacerse la crítica, las claves impresas de
   la prueba de pensamiento crítico dejan de valer en las 53 misiones que la
   tienen, no solo en estas 13.

## Lo que esta lista no cubre

Otras 9 misiones tampoco dan hoy 50 formas críticas distintas, pero su banco
sí alcanza y solo chocan por azar: La Materia, La Energía, Constitución,
Ecosistemas, La Célula, Motores y mecanismos, Sensores del robot, El asombro
y Pensar con orden. Se resuelven con el reparto sin repetición, sin escribir
contenido. Están en la tabla de la sección 5.2 del plan.
