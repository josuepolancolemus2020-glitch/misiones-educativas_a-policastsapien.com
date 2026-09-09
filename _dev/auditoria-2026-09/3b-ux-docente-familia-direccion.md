# Auditoría UX/UI (II): la aplicación probada como docente, como familia y como dirección, y la arquitectura de la información

Cuatro personas recorrieron la aplicación con un Chromium controlado paso a paso, en 393×873 y en
360×640 (el teléfono barato), con la nube simulada o apagada: Marlon, maestro de 6º-1 con 43
alumnos (U10); la mamá de Kevin, de 5º-1, con su tira «15-K7QM» (U11); Marta, directora de una
escuela con 12 maestros (U12); y una cuarta lente que miró el mapa entero —portada, menú, listados,
barra de la misión, páginas sueltas— con los ojos de una niña de 4º y de un maestro (U13). Los
46 hallazgos que sobrevivieron a la revisión adversarial se funden aquí en 44; dos se descartaron.
La lente del alumno (U4–U9) tiene su propia sección en `3-ux.md` y no se repite.

## Resumen

**Veredicto.** Con las 20 modificaciones de la primera corrida ya aplicadas, la aplicación aguanta el aula: sin internet todo pinta, no salió un solo error de JavaScript propio en los cuatro recorridos, y las tareas diarias del maestro —pegar la lista, pasar asistencia, imprimir el informe— están bien resueltas. Lo que falla está en los bordes: **la aplicación no sabe quién la está usando**, así que cada uno de los tres públicos entra por la puerta del otro; y **la pantalla dice cosas que no pasaron** en cuatro sitios donde el dato acaba en un expediente, en un bus o en la pizarra.

Los cinco problemas de fondo:

1. **Una sola puerta para tres personas.** La portada saluda «¡Hola, Estudiante!» a la madre y al maestro con cuenta, vende el producto al maestro delante de la niña y deja la tarjeta de padres fuera de la primera pantalla del teléfono barato; el menú mezcla los tres roles; la Dirección vive en «Ajustes», tercera tarjeta; y el botón «atrás» del teléfono cierra la aplicación desde cualquier vista (U13-02+U11-12, U13-12, U12-02, U13-01).
2. **La pantalla afirma lo que no pasó.** Notas SACE muestra 105 y guarda 100, muestra 0 y guarda 1; salida.html dice «¡Listo, asiento apartado!» —y al reabrir, «Usted ya contestó»— con la respuesta sin mandar; una clave de familia mal tecleada se guarda y se vuelve un segundo hijo; «Aviso publicado» sale sin señal (U10-01, U11-01, U11-11, U10-05).
3. **La primera hora del maestro es donde se abandona.** Tras el alta la pantalla queda al pie mirando un código vacío; el formulario dice «escribirán tu nombre» y la app «dales tu código»; diez mosaicos con nombres que no dicen qué se gana; ningún «paso 1» (U10-02, U10-03, U10-08, U13-07).
4. **Lo que se busca a diario no existe, y lo que existe está repartido en páginas sueltas.** No hay «quién hizo la misión», ni aviso por WhatsApp, ni «cómo va mi escuela», ni exportar; para «cómo van mis alumnos» hay tres puertas, y panel-docente.html —la única con cifras y CSV— no acepta la cuenta de la app (U10-04, U10-05, U12-01, U12-03, U12-07, U13-09, U10-07+U12-06).
5. **La madre que lee poco tiene la puerta buena, pero se le esconde.** padres.html entiende cómo escribe, y aun así tras la clave lo que ve son 15 chips de 31 px y un consejo técnico; el 🔊 que le leería la respuesta mide 27×22 px; y sin la tira —el caso común— no hay camino (U11-02, U11-07, U11-04).

**Lo que está bien, y es verdad:** «Pegar lista» mete 43 alumnos en cinco toques y el pase de lista es un toque por ausente; el informe del alumno sale a una hoja sin internet; padres.html habla de usted, resuelve nueve de doce preguntas reales escritas como escribe una madre, fecha cada dato y funciona sin señal con lo guardado; la convocatoria da boleto con folio y, si cae la señal, saca la respuesta por WhatsApp ya escrita; la frontera de privacidad del SQL de la Dirección es cuidadosa (la lista viaja como nº + nombre + sexo, el PIN no sale nunca, revocar revoca); y la barra de secciones de la misión ya va arriba y pegajosa, con 66 px de cromo fijo.

## Hallazgos por tema

### La familia: la convocatoria (`salida.html`)

**[U11-01] «¡Listo, asiento apartado!» —y al reabrir, «Usted ya contestó»— aunque la respuesta NO se mandó** — alta · error · horas · impacto educativo 1/5 · impacto comercial 4/5

- **Qué pasa.** Si la señal se va al tocar «Apartar mi asiento», la pantalla de resultado reutiliza el título de éxito: 🎉 «¡Listo, asiento apartado!», «Su respuesta ya está en la lista de Prof. Josué Polanco», el resumen verde «✅ Van 1 persona · aporte de L 250», y solo después una caja amarilla «No se pudo mandar por internet». Y es peor de lo que vio la auditora: la respuesta se guarda con `subida:0`, y al reabrir el enlace la portada dice «✅ Usted ya contestó — Kevin Martínez (5º-1): sí va» con «🎟️ Ver mi boleto», que vuelve a decir «Listo».
- **Evidencia.** `salida.html:833-846` (`verGracias(ok)`: el h2, el párrafo y `.resumen` dependen de `YO.va`, nunca de `ok`); `salida.html:783` (`subida:0`) y `583-592` (la portada no mira `YO.subida`). Reproducido con la nube abortada en `metas_conv_responder`, en 360×640: capturas `ux-b/U11/cap/sg-09-cayo-al-mandar.png`, `s-cayo-360.png`, `s-reabrir-tras-fallo.png`. Contradice el comentario del propio código (`salida.html:805-809`). No hay confeti animado: es el emoji 🎉 (`grep confeti` → 0).
- **Por qué importa.** CLAUDE.md lo escribe: «un padre que cree que contestó y no, es un asiento pagado de más». Una madre que lee poco lee el título y se va; el sábado no hay asiento, y el respaldo por WhatsApp —que existe y está bien hecho— no se usa porque nadie le dijo que hacía falta.
- **Recomendación.** Con `ok` falso: icono ⚠️, título «Falta un paso: mándela por WhatsApp», párrafo «Su respuesta todavía NO le llegó al maestro», el botón verde de WhatsApp como único protagonista y sin resumen verde. En la portada, si `YO.subida` es 0, «Su respuesta está pendiente de mandar» en vez de «Usted ya contestó», con el botón llevando al reenvío. Añadir el caso a `_dev/verifica-convocatoria.js`: ni la pantalla de gracias ni la portada dicen «Listo» / «ya contestó» con `subida:0`.

**[U11-10] El botón «Sí, mi hijo va» está a dos pantallas, debajo de 199 palabras — y con el evento mínimo sigue fuera de la primera** — media · sobrediseno · horas · impacto educativo 1/5 · impacto comercial 3/5

- **Qué pasa.** `verPortada` pinta título, fecha, «Lo que su hijo se lleva», seis datos, prueba social y el reloj antes de los dos botones de respuesta. En 360×640 «Sí va» empieza a 1 341 px (2,1 pantallas); en 393×873 a 1 244 (1,4). Con un evento MÍNIMO (sin «gana», sin nota, sin prueba social): 722 px en 360×640 (1,13 pantallas) y 701 en 393×873 (0,80). En el teléfono barato queda fuera de la primera pantalla escriba lo que escriba el maestro.
- **Evidencia.** `salida.html:510-632`; medidas de `mide-cta.js` y `rev-salida.js`; portada de 1 019 caracteres / 199 palabras; captura `sg-01-portada.png` (el primer pantallazo termina en «Aporte por persona»).
- **Por qué importa.** La pregunta es «¿va o no va?». Con datos escasos y prisa, la madre no llega a la pregunta.
- **Recomendación.** Barra fija abajo con «✅ Sí va» y «No puede ir», como el mando de la lectura (`sticky`), visible desde el primer momento; el resto de la portada se queda. No hace falta tocar el reloj ni sus segundos: su comportamiento tiene motivo (CLAUDE.md, «El reloj cierra de verdad»).

### La familia: el asistente (`padres.html`)

**[U11-04] Sin la tira no hay camino: «no tengo la clave» termina en «pídala al maestro en privado» (hallazgo 25 de julio, sigue abierto)** — media · incompleto · horas · impacto educativo 3/5 · impacto comercial 4/5

- **Qué pasa.** El caso más frecuente —la tira se perdió, se mojó, llegó a otro teléfono— tiene una sola respuesta: qué es la clave y «pídala al maestro en privado». No hay mensaje ya escrito, no hay un solo `wa.me` en padres.html (grep → 0), y no se dice que la tira se reimprime.
- **Evidencia.** `padres.html:1366-1373` (`respQueEsClave`) y `1564` (la regex que la dispara); capturas `g-23-no-tengo-clave.png`, `x-02-sin-clave-perdida.png` (teléfono nuevo: la única salida es el chip «¿Qué es la clave?»); `AUDITORIA-CHATBOT-PADRES.md`, hallazgo 25 y fase 3 ítem 16, sin implementar. El maestro sí reimprime la tira de UN alumno con un toque desde Mi aula (`js/tools/registros-admin.js:942-979`): el camino existe, pero fuera de la pantalla de la madre.
- **Por qué importa.** Sin tira el asistente no sirve para nada, y la madre cierra y no vuelve.
- **Recomendación.** Ante «no tengo / perdí la clave»: «📲 Pedírsela al maestro» con el texto ya escrito para copiar o compartir («Buenas, soy la mamá de ___ de 5º-1, ¿me reimprime la clave de la familia?») y decir que la tira se reimprime en un toque. **No** recuperar por nombre + grado + teléfono ni reenviar la clave por RPC al teléfono: choca con el modelo de privacidad (la clave existe para que no viajen nombres, y el maestro no sube teléfonos a la nube); el informe de julio ya descartó el `wa.me` directo «porque no existe el campo».

**[U11-02] En el teléfono barato, tras la clave se ven 15 chips de 31 px y un consejo técnico; la respuesta hay que ir a buscarla** — media · sobrediseno · horas · impacto educativo 3/5 · impacto comercial 4/5

- **Qué pasa.** Tras la clave el bot manda 6-7 burbujas seguidas y la última es «Agregar a pantalla de inicio»; debajo se pintan 15 chips que en 360×640 ocupan 7 filas (267 px) y dejan 242 px de conversación (38 %). Del resumen del hijo asoman 96 px; del consejo de instalar, 118. Los chips miden 31 px de alto. En 393×873: 5 filas, 193 px, y el resumen sí se ve (326 px).
- **Evidencia.** `mide-chips.js` / `rev-padres.js`; capturas `c-03-clave-ok.png`, `p-360-clave-ok.png`; `padres.html:157-163` (`.chip` padding 7px 10px, 13 px), `1435` (orden `respResumen(); sugerirInstalar()`). Mitigación que ya existe: los chips se recogen al primer gesto hacia arriba (`#chips.recogido`, `padres.html:148` y `399-418`; el chat pasa de 242 a 509 px). Por eso es fricción y no abandono.
- **Por qué importa.** Lo primero que ve la madre al terminar de escribir la clave es un consejo técnico y una pared de botones, no cómo va su hijo. Y 31 px incumplen el blanco de toque que el proyecto aplica en todas partes.
- **Recomendación.** Horas: chips a 44 px y el consejo de instalar fuera de «justo después de la respuesta» (segunda o tercera visita). Días: una fila deslizable con 5-6 acciones («¿Cómo va?», «Avisos», «¿Faltó?», «Pagos», «Ayudar en casa», «Más…»), y que la primera pantalla tras la clave sea UNA burbuja con el veredicto y la última nota.

**[U11-11] Una clave mal escrita se guarda, pisa la buena, se vuelve un «segundo hijo» y el mensaje culpa al maestro — por las dos puertas** — media · riesgo · horas · impacto educativo 2/5 · impacto comercial 3/5

- **Qué pasa.** Con «15-K7QN» (una letra distinta), `usarClave` guarda `c.codigo` y lo añade a `c.codigos` ANTES de consultar; el mensaje dice «Clave guardada… Puede ser que el maestro no las haya subido todavía»; al reabrir arranca con la mala y «Aún no hay notas para esa clave»; y como `codigos` tiene dos entradas, aparece el chip «👧 Cambiar de hijo» con una entrada sin alias: la madre ve dos hijos donde tiene uno. La buena no se pierde («🔑 Cambiar clave» reactiva la primera, `1375-1380`), pero nadie se lo dice. La vista Padre de index.html hace lo mismo (`padreConsultarNube`, `js/app.js:1401-1403`), y esa clave es la que padres.html abre al arrancar: un solo arreglo no lo cierra.
- **Evidencia.** `padres.html:1414-1420`, `1437-1442`, `1754-1757`, `427-428`; captura `g-20-clave-mal-letra.png`; cfg medido: `codigo=15K7QN, codigos=[15K7QM «#15 de 5º-1», 15K7QN «»]`.
- **Por qué importa.** La madre concluye que el maestro no ha subido nada. Lo que NO se sostiene del hallazgo original: que las claves sean enumerables por guion; `metas_rate_ok` se evalúa antes de la consulta en las tres RPC (`SUPABASE-FASE3.sql:167, 193`) y el espacio por número de lista es 31⁴ ≈ 923 000.
- **Recomendación.** Guardar la clave solo cuando la nube devuelva algo (o cuando la familia confirme «#15 de 5º-1»); si viene vacía, no pisar la anterior ni añadirla a `codigos`, y decir primero «revise la tira: ¿es una Q o una O?» y después «o el maestro aún no sube nada». Mismo arreglo en `padreConsultarNube`.

**[U11-08] Un recado o una excusa que no entra se pierde: sin cola, sin reintento — y el reintento a mano puede duplicar** — media · incompleto · horas · impacto educativo 2/5 · impacto comercial 3/5

- **Qué pasa.** Si `metas_mensaje_padre` falla, `buzonEnviar` pone `_buzonPendiente = null` antes de mirar el resultado y dice «Inténtelo de nuevo en unos minutos»; la excusa guiada (día + razón, 3 toques) y el recado escrito desaparecen. Es lo contrario de salida.html (WhatsApp ya escrito) y de `js/metas-sugerencias.js` (cola con reintento). Y la RPC recibe solo `{p_codigo, p_texto}`, sin id de evento: un reintento tras una respuesta perdida (el servidor guardó, la señal se fue) duplica el recado en la bandeja del maestro.
- **Evidencia.** `padres.html:1248-1283`, `1268`; corrida de `excusa-y-sin-clave.js` con respuesta distinta de `ok`: «⚠️ No pude entregar el recado en este momento…», y `[EXCUSA 2026-09-09] Enfermedad` no queda en ningún sitio (localStorage sin llave de cola).
- **Por qué importa.** En el aula de un pueblo el fallo de envío es el caso normal, no el raro.
- **Recomendación.** Cola en localStorage (`METAS_PADRE_BUZON_COLA_V1`) con un `evento_id` como el de las sugerencias, reenvío al abrir el asistente y chip «Reintentar»; la RPC acepta el id y CORRIGE en vez de duplicar (el SQL va en el chat). No prometer WhatsApp: del lado del padre no existe el número del maestro.

**[U11-07] El 🔊 que le leería la respuesta —lo más útil para quien lee poco— mide 27×22 px, al 55 %, sin palabra** — media · incompleto · horas · impacto educativo 3/5 · impacto comercial 2/5

- **Qué pasa.** Cada burbuja lleva un altavoz con `speechSynthesis` (funciona: probado), pero es un icono gris translúcido de 26,7×22 px al final del párrafo, sin rótulo. Es la única ayuda de lectura de la pantalla y no cumple ni el blanco de 44 px ni se explica.
- **Evidencia.** `padres.html:150-155` (font 15 px, padding 2px 4px, opacity .55), `1345-1354` (`leerBurbuja`); medido en 360 y 393 (`mide-cta.js`); captura `g-01-llegada.png`. `AUDITORIA-CHATBOT-PADRES.md` fase 3 ítem 19 lo pedía: se puso, pero escondido.
- **Por qué importa.** La madre que lee con dificultad ni lo descubre ni lo acierta con el dedo.
- **Recomendación.** Botón «🔊 Escuchar» de 44 px en cada burbuja del bot, o un interruptor en la cabecera «Leer en voz alta» que lea cada respuesta al llegar; decirlo en la primera burbuja («Toque 🔊 y se lo leo»).

**[U11-06] Tecnicismos en lo que la madre lee: «Forma 3», «Parcial III», «evaluación(es) registrada(s)», «la nube», «menú del navegador (⋮)»** — media · error · horas · impacto educativo 2/5 · impacto comercial 2/5

- **Qué pasa.** Cada tarjeta dice «Forma 3 · Parcial III · Prueba operativa · Prof. …»; el resumen, «Tengo 4 evaluación(es) registrada(s). Promedio: 79/100. Aprobadas: 2 de 3 · NSP: 1» (16 líneas con plural entre paréntesis; NSP sin explicar en la primera pantalla); «la nube» en 4 mensajes; sin internet en un teléfono nuevo, «No pude consultar la nube» en vez de «no hay internet». «Forma N» también se pinta en la vista Padre de index.html.
- **Evidencia.** `padres.html:437-438`, `600-620`, `586/1421/1447/1759`, `1720`; `js/app.js:1320-1325`, `1424`; capturas `g-04-q-saco-mi-hijo.png`, `g-03-clave-ok.png`, `g-26-sin-internet-nuevo.png`.
- **Por qué importa.** «Forma» es el número de versión del examen y no le dice nada a nadie fuera del aula; la norma del proyecto pide hablar de lo que la persona gana y sin tecnicismos.
- **Recomendación.** Quitar «Forma N» de las dos pantallas de padres (queda en la Evidencia del maestro); «4 pruebas: 2 aprobadas, 1 reprobada y 1 que no hizo (NSP)»; «los datos del maestro» por «la nube»; «No hay internet o la señal está mal»; en el consejo de instalar, «para tenerlo como una aplicación más», sin nombrar el navegador.

**[U11-03] El «No entendí» ofrece 25 salidas a la vez: menú numerado 1-9 más 16 chips, con «Dejársela al maestro» primero** — baja · sobrediseno · horas · impacto educativo 2/5 · impacto comercial 3/5

- **Qué pasa.** Ante «que dia juega honduras» (o «K7QM») el bot pinta `MENU_TXT` del 1 al 9 en la burbuja y debajo 16 chips que dicen lo mismo; en 360×640 la burbuja se corta a la mitad y los chips llenan el resto.
- **Evidencia.** `padres.html:1453-1460` (`MENU_NUM`/`MENU_TXT`), `1646-1660`; capturas `g-09-que-dia-juega-honduras.png` (16 chips, 6 filas), `c-09-que-dia-juega-honduras.png` (burbuja cortada, 7 filas).
- **Lo que no se sostiene.** El «basurero» de la bandeja: nada entra sin que la madre toque el botón (`_buzonPendiente`, `1650`), hay tope de 5 mensajes/día (`1276`), y «tiene tareas para mañana?» SÍ es una pregunta que el maestro quiere recibir.
- **Recomendación.** Quitar el menú numerado (los chips ya se tocan); «No entendí. ¿Es sobre notas, faltas, pagos o avisos?» con 4 chips y «Otra cosa → dejársela al maestro» al final, no al principio.

**[U11-09] «se me perdió el papel» contesta si aprobó; «K7QM» sin número no dice qué falta** — baja · error · horas · impacto educativo 1/5 · impacto comercial 2/5

- **Qué pasa.** La regla de «¿aprobó?» incluye la palabra suelta «perdio»: «se me perdio el papel» devuelve «❌ La última nota con calificación fue 62/100 y se aprueba con 70…». «K7QM» → «No entendí esa pregunta», porque `pareceClave` exige `\d{1,3}` delante y no hay rama que reconozca las cuatro letras solas.
- **Evidencia.** `padres.html:1609` (regex) y `335-338`; capturas `g-24-perdi-papel.png`, `g-25-clave-sin-numero.png`.
- **Recomendación.** «perdio (el ano|el grado)» y, antes, una regla `/perd(i|io).*(papel|tira|clave|codigo)/` → respuesta de clave perdida (U11-04); con 4-6 letras válidas sin número, «Parece la mitad de la clave: falta el número de lista que va delante (ej. 15-K7QM)».

**[U11-05] La vista «Para madres y padres» de index.html repite peor lo que padres.html ya hace: el bloque «Notas desde cualquier lugar» sobra** — baja · eliminar · horas · impacto educativo 2/5 · impacto comercial 3/5

- **Qué pasa.** `padreConsultarNube` llama solo a `metas_consultar_plan_padre`: 4-8 notas con «Forma 3», sin faltas, avisos, pagos, conducta ni fecha de corte —todo lo que el asistente da con la misma clave—. Ya divergen: el asistente muestra avisos, esta no.
- **Lo que no se sostiene.** «El resumen semanal está siempre vacío en el teléfono de la madre»: en el caso común del aula el teléfono de la familia ES el del niño, y ahí el resumen lee `METAS_REGISTRO_V1` local (`js/app.js:1284-1296`); es lo único de padres que funciona sin internet, y no se toca. `consulta-nube.html` solo se enlaza desde la Zona Docente (`js/app.js:1702`), no desde ningún camino de padres.
- **Evidencia.** `js/app.js:1273-1440` (`renderPadre`), `1352-1372` (el bloque), `1395-1447`; salida de `index-padre.js`: «¿menciona reunión/faltas/pagos? false» con los mismos datos que el asistente sí mostró; capturas `ig-03-view-padre.png`, `ig-04-view-padre-consulta.png`.
- **Recomendación.** Quitar solo el bloque «Notas desde cualquier lugar» (`js/app.js:1352-1372`); el botón «Pregúntele al asistente» ya está debajo con la misma clave. El menú, en U13-12.

### El maestro: la primera hora (U10)

**[U10-02] Tras crear la cuenta la pantalla se queda al pie, mirando «Tu código de aula · · · · ·» y 22 chips del DCNB; las herramientas quedan arriba y no hay «paso 1»** — alta · incompleto · horas · impacto educativo 3/5 · impacto comercial 4/5

- **Qué pasa.** `docenteSuscribir` llama a `renderProfile()` y un toast, sin `scrollTop = 0` (solo lo hace `showView`, `js/app.js:2180-2181`, que aquí no se invoca) y sin ningún bloque de primeros pasos (`grep «primer día|primeros pasos|3 pasos»` en app.js e index.html: nada). El maestro ve «Ver el avance de mis alumnos» de alumnos que no existen y los filtros de grado/mes/materia; los diez mosaicos quedan fuera de la vista. El bloque del código y «Ver el avance» se pintan sin condición aunque no haya ni un grupo (`js/app.js:1695-1702`), y ese botón lleva a consulta-nube.html, que sin señal falla con «Failed to fetch» (`consulta-nube.html:273`).
- **Evidencia.** `js/app.js:1950-1962`; capturas `04-tras-registro.png` (el viewport justo después del alta), `04b-tras-registro-entera.png`. Matiz: el código vacío de la captura se debe a que la sonda abortó `metas_aula_mi_codigo`; en el alta real hay internet y `renderProfile` lo pide en el acto (`js/app.js:1716`, `1880-1900`). Lo firme es el scroll y la ausencia de guía.
- **Por qué importa.** Es el punto de abandono de la primera hora: la cuenta salió en dos minutos y el siguiente paso no está en la pantalla.
- **Recomendación.** Al crear la cuenta, subir al inicio de la vista y pintar «Tu primer día en 3 pasos: 1) arma tu lista, 2) pasa asistencia, 3) imprime las claves de familia», con el mosaico Mi aula primero; ocultar el código y «Ver el avance» mientras no haya alumnos; enlazar el kit de 60 minutos (U10-12).

**[U10-03] Dos identidades contradictorias: el formulario dice «escribirán tu nombre», la app y la misión piden un «código de aula» que sin señal no se puede confirmar** — alta · error · dias · impacto educativo 4/5 · impacto comercial 3/5

- **Qué pasa.** El formulario de alta: «Tus alumnos escribirán tu nombre al empezar una misión» (`js/app.js:1608`, `1612`); la pantalla siguiente: «Dale a tus alumnos tu código de aula» (`1695-1697`); el modal del alumno solo tiene «Código de aula (te lo da tu maestro)» (`js/metas-registro.js:508`), sin campo para el nombre del maestro. La RPC de alta no genera el código (grep en `SUPABASE-DOCENTES-V2.sql`: nada); sale aparte de `metas_aula_mi_codigo` (`SUPABASE-AULA.sql:57-68`), y sin internet es «· · · · ·» («Aún no hay código; conéctate a internet», `js/app.js:1908`).
- **Evidencia.** Capturas `03b-registro-form-entero.png`, `22-modal-identidad-lleno.png`; recorrido `p7b.js`: `ALUMNO_V1 = {codigo_aula:"K2M9P", docente:""}`. Precisiones del revisor: con `navigator.onLine === false` el modal SÍ dice «📴 Sin internet: se confirmará al reconectar» (`metas-registro.js:537-541`); el mensaje queda vacío solo cuando hay señal aparente y el fetch falla (`catch` en `559`). Y `docente:''` no pierde el avance: `metas_guardar` resuelve el código al maestro en el servidor (`SUPABASE-AULA.sql:100-126`).
- **Por qué importa.** El maestro que sigue el texto del formulario manda a los niños a escribir un nombre que no tienen dónde poner. El daño es la instrucción contradictoria y la falta de confirmación, no la pérdida del dato.
- **Recomendación.** Una sola identidad dicha igual en los tres sitios. Que la RPC de alta devuelva también el código de aula para tenerlo sin señal (SQL en el chat) y mostrarlo grande con «escríbelo en la pizarra»; en la misión, cuando el fetch falla con señal aparente, el mismo mensaje que sin señal («se comprobará cuando haya internet; tu avance se guarda»). Quitar del formulario la frase del nombre.

**[U10-08] La Zona Docente y Mi aula abren con todo a la vez: 10 mosaicos, 22 chips del DCNB, 9 pestañas y 575-611 caracteres de cajas amarillas antes del primer dato** — media · sobrediseno · horas · impacto educativo 2/5 · impacto comercial 4/5

- **Qué pasa.** Diez mosaicos con nombres que no dicen qué se gana (Plan de Acción, Parte Mensual, Campeonísimo, Collage, Gobierno Escolar, Evidencia de misiones, Misiones del maestro), más el código de aula, «Ver el avance» y los filtros del DCNB. En Mi aula, 9 pestañas y tres cajas amarillas: la primera fila de alumno cae a 864 px y la primera celda de notas a 726 px (ventana de 873), con 611 caracteres de instrucciones encima; en 360×640 las cajas llenan la pantalla antes de la tabla. La persona solo tocaría Mi aula, Evaluaciones y Fichas.
- **Evidencia.** `index.html:443-484` (10 mosaicos); medidas de `p8.js` («SACE: tabla a 726 px · 611 caracteres antes»; «ALUMNOS: primera fila a 864 px · 575 antes»); capturas `04b-tras-registro-entera.png`, `05b-mi-aula-vacia-entera.png`, `10-tab-sace.png`, `29-sace-360.png`. Mitigaciones que ya existen: los mosaicos se reordenan solos por uso (`zdUsoOrdenar`, `js/app.js:3454-3463`, `METAS_ZD_USO_V1`) y hay botón Aa (`letra-maestro.js`). El problema es el primer día.
- **Recomendación.** Horas: colapsar cada caja amarilla a una línea con «¿cómo funciona?» desplegable. Días: tres mosaicos grandes (Mi aula, Evaluaciones para imprimir, Fichas) y el resto bajo «Más herramientas», renombrados por lo que ganan («Calificar una prueba», «Informe del mes», «Torneo de preguntas»). Va con U13-07.

**[U10-09] «Plan de Acción» se anuncia como «Notas y avisos para los padres» y es la pantalla de calificar una prueba; las notas viven en dos sitios** — media · sobrediseno · dias · impacto educativo 2/5 · impacto comercial 3/5

- **Qué pasa.** El mosaico lleva `title="Notas y avisos para los padres"` (`index.html:447`); dentro hay «📋 Datos de la Evaluación», Grado/Sección/Docente, «Forma impresa», «Tipo Conceptual/P. Operativa», «Generar Análisis» (`index.html:682-700`). Las notas de una prueba entran aquí y las del parcial en Notas SACE, con «Sugerir notas del Parcial» que promedia las de allá (`js/tools/registros-admin.js:3772`, `4094`). Matiz: dentro sí hay pestaña «👨‍👩‍👧 Padres» con «WhatsApp al padre» por alumno (`js/tools/plan-accion.js:188`, `663-667`): el subtítulo describe la salida, no la entrada.
- **Evidencia.** Capturas `17b-plan-accion-entero.png`, `10-tab-sace.png` («Toma las evaluaciones que guardaste en el 📊 Plan de acción…»).
- **Recomendación.** Renombrar el mosaico a «Calificar una prueba» con subtítulo «y avisar a la familia», o mover la captura de notas de una prueba dentro de Mi aula → Notas como paso «Nueva prueba», para que haya un solo sitio de notas.

**[U10-12] El Kit de capacitación de 60 minutos no se puede alcanzar desde la aplicación** — baja · incompleto · horas · impacto educativo 2/5 · impacto comercial 3/5

- **Qué pasa.** `kit-capacitacion.html` es lo que un maestro nuevo necesitaría (sesión de 60 minutos, paso a paso) y ningún archivo de la app lo enlaza: en `index.html`, `js/app.js`, `js/tools/*.js` y el HTML de la misión de bienvenida, 0 enlaces; solo aparece dentro de un comentario (`misiones/docente-bienvenida-metas/js/bienvenida-metas.js:42`, comprobado por el editor) y en dos `.md`. Solo se llega escribiendo la URL.
- **Lo que no se sostiene.** Que prometa una «comunicación con las familias por WhatsApp» que la app no tiene: sí hay WhatsApp al padre por alumno (`plan-accion.js:663-667`, `698`), en gastos (`registros-admin.js:1887`) y el aviso en lote de la Convocatoria. Lo que falta es el aviso general (U10-05).
- **Recomendación.** Enlazarlo desde la Zona Docente sin sesión («¿Primera vez? Guía de 60 minutos») y desde el «paso siguiente» tras el alta (U10-02).

### El maestro: las notas, el avance de los alumnos y los avisos (U10)

**[U10-01] Notas SACE guarda una nota distinta de la que el maestro ve escrita: 0→1, 105→100, y «150» se parte en dos materias, todo en silencio** — alta · error · horas · impacto educativo 4/5 · impacto comercial 3/5

- **Qué pasa.** Al teclear en la celda de aprovechamiento el valor se recorta por dentro con `Math.max(1, Math.min(100, v))`, pero la celda sigue mostrando lo tecleado (`inp.value = raw`) hasta que se repinta la pestaña. Un «0» (no hizo la prueba, o error) se guarda como 1; un «105», como 100; sin aviso. El salto automático de celda (salta con 2 cifras > 10) parte «150» en 15 en Español y el 0 cae en Inglés y se guarda como 1: dos notas equivocadas en dos materias. Y no hay forma de marcar «no presentó»: la pista dice «Escribe la nota (1-100)» y el único NSP posible es dejar la celda vacía, cosa que nadie dice.
- **Evidencia.** `js/tools/registros-admin.js:3898` (`inp.value = raw`), `3901-3903` (clamp 1-100 sin aviso), `3947-3948` (salto), `3744` (pista). Reproducido en `p8.js`/`p9.js` y por el revisor en `r1.js` sobre d940fe0: tecleado `['105','0']` → en pantalla `['105','0']`, al volver a la pestaña `['100','1']`; localStorage `{"I":{"Español":{"1":100,"2":7,"3":1}}}`. Capturas `25-sace-105.png`, `31-sace-al-volver.png`. Lo que no es defecto: el «7» cuando se quería 70; 7 es nota válida en la escala 1-100 que la propia pantalla anuncia.
- **Por qué importa.** La nota va a la boleta y al informe que firma la madre. Alta y no crítica porque el 105 es un error de tecleo poco frecuente y el 1 se ve al volver a la pestaña; sigue siendo una nota alterada en el expediente.
- **Recomendación.** No corregir en silencio: si la nota sale del rango, celda en rojo, visible, y no guardar hasta que se corrija; NSP explícito («no hizo la prueba») en vez de convertir 0 en 1; el salto automático no debe consumir cifras (saltar solo con Enter/Tab, o con 3 cifras); tras guardar, escribir en la celda el valor realmente guardado.

**[U10-04] No existe «asignar una misión» ni «quién NO la hizo»: para ver quién trabajó hay que ir alumno por alumno (43 toques) o a una página aparte que habla de Supabase** — alta · faltante · dias · impacto educativo 5/5 · impacto comercial 4/5

- **Qué pasa.** El maestro manda a los 43 a hacer Los Sustantivos de viva voz. Al día siguiente, en Estadísticas la práctica se ve un alumno a la vez (`estMisiones` empareja por alumno, `js/tools/estadisticas-alumno.js:332-349`; `adRenderEstadisticas` pinta uno con selector, `763-800`); `estDatosGrado` cuenta cuántos practican (`1393-1395`) pero no dice quiénes ni quiénes no. «📊 Ver el avance de mis alumnos» salta a consulta-nube.html: otro diseño, «sincronizados a Supabase» (`75`), solo los que SÍ mandaron resultado, 🗑 en cada fila (`375`), y filtra el grado con el texto crudo que escribió el alumno («6to 1» y «6º-1» son dos grados, `323-333`). El mosaico «Evidencia de misiones» va a registro.html, que es solo este equipo (`index.html:472`). Los 40 que no la hicieron no aparecen en ningún sitio.
- **Evidencia.** Recorrido `p10.js` con 3 resultados en la nube simulada; capturas `33-est-practica-ada.png`, `34-consulta-nube-con-datos.png`, `34b-…-entera.png`, `18-ver-avance.png` («Failed to fetch» sin señal); `js/app.js:1702`.
- **Por qué importa.** Es la pregunta que el maestro se hace cada mañana, y la que justifica que los niños escriban un código de aula. La auditoría de producto ya lo pidió (B4-03); aquí se midió en toques.
- **Recomendación.** Días, no semanas: la caché de la nube (`estNubeCache`) y el emparejamiento por nº de lista y grupo (`estParteGrupo`) ya existen. Una vista «Misiones» en Mi aula: elegir la misión y ver la lista de los 43 con ✅/— (hecha / sin hacer), con «pedirla por WhatsApp» a los que faltan. consulta-nube.html y registro.html pasan a ser redirecciones (U13-09).

**[U10-05] El maestro busca «mandar un aviso por WhatsApp» y no existe: Comunicados publica en el chatbot, y el toast dice «llega en unos segundos» sin señal** — media · faltante · horas · impacto educativo 3/5 · impacto comercial 4/5

- **Qué pasa.** 📣 Comunicados publica avisos que «responde el asistente de padres» (un chatbot que las familias no han abierto en la primera semana). No hay botón de copiar ni de WhatsApp para un aviso (ids `av-*`: publicar, cancelar, buzón, faq; nada de wa/copiar). El toast «📣 Aviso publicado: llega al asistente en unos segundos» se dispara tras `avGrupoSave` sin mirar la nube. El aviso NO se pierde: queda en cola y `#av-sb-status` dice «📴 N comunicado(s) esperando internet» en la misma pantalla tras el repintado; el toast contradice a la pantalla, y la pantalla es la que dice la verdad.
- **Evidencia.** `js/tools/registros-admin.js:5405-5408`, `6041`; recorrido `p6.js` (`TOASTS AVISO = ['📣 Aviso publicado…']` con todas las peticiones a supabase.co abortadas); capturas `13-aviso-reunion.png`, `32b-convocatoria-entera.png`. Los únicos `wa.me` del aula: gastos (`1887`), Plan de Acción por alumno (`plan-accion.js:698`) y la Convocatoria.
- **Por qué importa.** El maestro escribe el aviso dos veces (aquí y en WhatsApp) y aprende que el toast no es de fiar.
- **Recomendación.** En cada aviso, «Copiar / Mandar por WhatsApp» con el texto ya armado (`wa.me` sin número para el grupo, y con número para las familias que lo tengan en Identidad y contactos); condicionar el toast: sin señal, «se publicará cuando vuelva el internet».

**[U10-10] En 360×640 la boleta de notas enseña 2 de 7 materias y las pestañas de Mi aula miden 37 px** — media · error · dias · impacto educativo 2/5 · impacto comercial 2/5

- **Qué pasa.** La tabla de Notas SACE mide 726 px en un hueco de 280: se ven Nº·Alumno y dos celdas de nota. Las 9 pestañas, los chips de grupo y el chip de nube miden 37 px (`.ad-tabs .pa-otab`, padding 9 px / 11,5 px bajo 640 px; `css/app.css:4207-4231`), por debajo de los 44 px que CLAUDE.md fija como regla para chips. Lo que no es exacto del hallazgo original: la columna del alumno YA es fija (`.ad-mx-sticky`, `css/app.css:4774-4780`), así que se desliza la zona de materias con el nombre a la vista; y los ◀ ▶ de la cabecera REORDENAN materias (`registros-admin.js:3792-3794`, `4151`), no pasan de página.
- **Evidencia.** `p8.js` / `r1.js` a 360×640 («anchoTabla 726, anchoVisible 280, celdasVisibles 2»; `min44: [6º-1:37, 👥 Alumnos:37, … ☁️ al día:37]`); capturas `29-sace-360.png`, `28-aula-360.png`.
- **Recomendación.** Pestañas y chips a 44 px; bajo 400 px, una materia a la vez con ◀ ▶ de página (nuevos, no los de reordenar); instrucciones colapsadas a una línea (U10-08).

### La Dirección y la administración (U12)

**[U12-01] El director no puede ver cómo va su escuela: solo matrícula y nombres — la hoja fotocopiada le dice más que la pantalla** — alta · faltante · semanas · impacto educativo 4/5 · impacto comercial 5/5

- **Qué pasa.** Por docente, la Dirección obtiene escuela, fecha de registro, grupos con conteo (♀/♂), «último movimiento de su aula», la lista de nombres del grupo y el permiso de convocatorias. Ni asistencia, ni notas, ni misiones hechas, ni alumnos en riesgo, ni un total de la escuela. El maestro ya imprime «🏫 Informe del grado (1 hoja, para la Dirección)»; el servidor YA abre el JSON entero de `METAS_ADMIN_V1` (`_metas_aula_de`, `SUPABASE-ROLES-V2.sql:626-640`): el dato está, y la pantalla digital enseña menos que la hoja que llega fotocopiada.
- **Evidencia.** `SUPABASE-ROLES-V2.sql:690-777` (`metas_rol_grupos`: id/grado/seccion/escuela/matricula/ninas/varones), `781-850` (`metas_rol_alumnos`: num + nombre + sexo); `js/tools/estadisticas-alumno.js:815`; capturas `s1-04-docente-abierto.png` («🏫 Escuela · 🗓️ Se registró · 👥 1º-1 · 34 alumnos · 🕓 Último movimiento · 📣 Convocatorias») y `r-dir-lista.png`; diario S1-8 «asistencia=false notas=false».
- **Por qué importa.** Para saber si su escuela va bien, el director sigue pidiendo papel o capturas a 30 maestros. Es lo primero que una institución que pague va a pedir, y es el momento de abandono de la directora.
- **Recomendación.** Agregados por grupo sin nombres en `metas_rol_grupos` (asistencia % del mes, promedio por parcial, nº de alumnos con menos de 70, misiones con evidencia en la nube) y una tarjeta «🏫 Mi escuela hoy» arriba de la lista con los totales. Es el contenido del informe en papel: no abre ningún dato nuevo. Aviso al implementar: cada llamada ya reparsea el espejo completo de cada docente tres veces por grupo (`SQL:717-729`), hasta 500 docentes por llamada; sumar agregados multiplica ese costo, así que va en una sola pasada o materializado al guardar el espejo.

**[U12-03] No hay forma de dar de alta a los 30 maestros de una escuela ni de nombrar a su director desde la escuela; el campo del que cuelga todo es opcional y de texto libre** — alta · incompleto · semanas · impacto educativo 2/5 · impacto comercial 5/5

- **Qué pasa.** Cada maestro se autorregistra con 9 campos; `docenteSuscribir` fija `rol: 'docente'` (`js/app.js:1947`) y valida solo nombre, correo y clave: la escuela es opcional y sin autocompletar (`1932-1935`). El rol director lo asigna solo el admin (`metas_rol_cambiar` devuelve motivo `rol` a todo el que no sea admin, `SUPABASE-ROLES-V2.sql:224-268`) y el único camino es «Escríbele al creador» y esperar. No hay RPC de invitación, código de escuela ni aceptación; el emparejamiento es `_metas_misma_escuela` sobre texto normalizado (`SQL:127-137`): «Esc. J. A. Cook» y «Escuela John Arnold Cook» nunca se emparejan.
- **Evidencia.** Captura `s0-04-zona-docente-registro.png` (campos doc-nombre… doc-telefono; «ofrece elegir director: false»); `js/app.js:1921-1947`, `2274`.
- **Por qué importa.** El arranque de una institución depende de que 30 personas tecleen exactamente lo mismo y de que el creador promueva persona por persona.
- **Recomendación.** Un «código de escuela» (mismo patrón que el código de aula) que reparte el director: el maestro lo escribe al registrarse y queda alineado sin texto libre; el director ve «pendientes de aceptar» y acepta o rechaza; el admin nombra al primer director con una verificación mínima (teléfono de la escuela). Mientras tanto: escuela obligatoria en el alta, con autocompletado de las ya registradas.

**[U12-02] La Dirección está escondida en «Ajustes», debajo del buzón al creador; la Zona Docente no distingue a un director de un maestro, y el ascenso es invisible** — alta · error · dias · impacto educativo 2/5 · impacto comercial 4/5

- **Qué pasa.** Con sesión de directora la app abre la Zona Docente idéntica a la de un maestro; ni el menú (`index.html:1097-1124`) ni la portada dicen «escuela» o «director». La tarjeta «Docentes de mi escuela» es la tercera de Ajustes, tras «Mi perfil» y «Escríbele al creador del proyecto», y empieza a 834 px en 393 de ancho / 849 px en 360: fuera de la primera pantalla. `ajRefrescarPerfil` solo se llama desde `renderAjustes` (`js/app.js:2401`), sin toast ni aviso: un maestro con sesión abierta al que promueven a director sigue viendo su app de maestro hasta que, por casualidad, abre Ajustes. Los textos usan jerga: «Los casos delegables (como las convocatorias) se abren solo con el permiso…» (`js/app.js:2350`, frase de 19 palabras).
- **Evidencia.** Capturas `s1-01-portada-directora.png`, `s0-02-menu.png`, `s1-02b-ajustes-directora-full.png`; `js/app.js:2296-2313` (tarjeta del creador) antes de `2340-2354` (tarjeta de Dirección), `2401-2434`.
- **Por qué importa.** Nadie busca su escuela en «Ajustes»; desde abrir la app hasta ver una lista de grupo son 5 toques más un desplazamiento, y el primero exige adivinar.
- **Recomendación.** Con rol director/asistencia/rector: entrada «🏫 Mi escuela» en el menú y primera tarjeta en la Zona Docente que abra directamente la lista; refrescar el perfil al abrir la app y avisar del ascenso con un toast; «Escríbele al creador» al final de Ajustes; «Ves los grupos de tus maestros. Sus convocatorias, solo si te dan permiso».

**[U12-04] Callejón sin salida: a la directora sin escuela se le pide escribirla en un campo bloqueado, y el admin la promueve sin fijársela** — alta · error · horas · impacto educativo 1/5 · impacto comercial 3/5

- **Qué pasa.** Una cuenta que se registró sin escuela (campo opcional) y luego fue promovida toca «Cargar la lista» y lee «🏫 Primero escribe el nombre de tu escuela en «Editar mi perfil»»; abre el perfil y el campo de escuela es un `<input disabled>` vacío, sin placeholder, con el aviso «los ajusta tu administrador, no tú». `ajCambiarRol` promueve sin pedir ni fijar escuela (`js/app.js:2933-2967`) y el admin no tiene botón que llame a `metas_rol_escuela_corregir` (0 llamadas en js/html).
- **Evidencia.** `js/app.js:2526` y `2549` (mismo mensaje para rol de Dirección) frente a `2272-2276` (campo deshabilitado para `_ajEsDireccion(rol)`); `1932-1935`; capturas `s4-01-sin-escuela.png`, `s4-02-perfil-sin-escuela.png`.
- **Recomendación.** Con rol de Dirección y sin escuela: «Tu administrador todavía no fijó tu escuela. Escríbele desde aquí», con el cuadro de mensaje ya abierto y prellenado; placeholder «(la fija tu administrador)» en la caja bloqueada; y que `ajCambiarRol` avise al admin y le ofrezca fijarla al promover una cuenta sin escuela (U12-05).

**[U12-05] El administrador no puede administrar desde la app: solo roles y contraseñas; y la guía de instalación tiene un hueco (la tabla `maestros` no la crea ningún .sql)** — media · incompleto · dias · impacto educativo 1/5 · impacto comercial 4/5

- **Qué pasa.** En Ajustes el admin ve los registros (correo, teléfono), un selector de rol, «🔑 Nueva contraseña», un resumen de altas y el buzón de sugerencias. No puede crear ni borrar una cuenta (de prueba, por ejemplo), ver el aula de nadie ni corregir la escuela mal escrita de un maestro, aunque `metas_rol_escuela_corregir` existe (`SUPABASE-ROLES-V2.sql:283-326`) y nadie la llama. Instalar la nube son 22 archivos SQL pegados a mano en orden (ROLES-V2 exige 5 previos, `SQL:36-41`), y la tabla `maestros` la exigen políticas RLS de `SUPABASE-SEGURIDAD.sql:304-328`, `SUPABASE-PLAN-ACCION.sql:121`, `SUPABASE-REGISTROS-ADMIN.sql:124` y `SUPABASE-AVISOS.sql:141`, pero solo aparece en `SUPABASE-FASE1.md:259`: quien instale desde cero se topa con políticas que apuntan a una tabla inexistente. Videos, sugerencias de alumnos y buzón viven en F.A.R.O., otro repositorio.
- **Evidencia.** Captura `a1-02-admin-registros.png`; RPC del admin: `metas_perfil_leer`, `metas_rol_listar`, `metas_registros_resumen`, `metas_sugerencias_listar`; `grep -rl metas_rol_escuela_corregir --include=*.js --include=*.html` → 0; `ls SUPABASE-*.sql | wc -l` → 22.
- **Recomendación.** En la fila del registro: «Escuela · municipio» con botón que llame a `metas_rol_escuela_corregir`, y «🗑 Borrar cuenta» (con confirmación y respaldo) para las de prueba; una guía única de instalación con el orden de los SQL y la creación de `maestros` (o su retirada: U10-07+U12-06); que Ajustes diga que los videos y las sugerencias se administran en F.A.R.O.

**[U12-07] No se puede exportar a Excel desde Mi aula ni desde el panel del director** — media · faltante · dias · impacto educativo 2/5 · impacto comercial 4/5

- **Qué pasa.** Mi aula guarda asistencia y notas por parcial y solo las saca en papel: `grep` de `text/csv`, `createObjectURL` y `download=` en `registros-admin.js`, `estadisticas-alumno.js`, `plan-accion.js` y `parte-mensual.js` → 0 líneas. La lista del grupo que ve la Dirección (`ajVerAlumnos`, `js/app.js:2688-2711`) no tiene imprimir ni exportar. Lo que no se sostiene del hallazgo original: «el único CSV del proyecto está en panel-docente» (`js/metas-registro.js:309` exporta la evidencia de misiones desde registro.html) y la carga al SACE, que no consta que exista del lado del maestro.
- **Evidencia.** Diario S1-5c «botones dentro de la lista del grupo (imprimir/exportar): 0» (`s1-05-lista-alumnos.png`); S1-8 «exportar|Excel|SACE: false»; `panel-docente.html:387` (`exportarCSV()` sobre `resultados`).
- **Por qué importa.** El director no puede consolidar la escuela en una hoja de cálculo, y el maestro no tiene respaldo de lo que tecleó.
- **Recomendación.** «📊 Descargar en Excel» por grupo (CSV con BOM UTF-8: grado, sección, nº, nombre, asistencia por día, nota por materia y parcial) en Mi aula y en la lista del director; un CSV de la escuela entera en el panel de Dirección. Sin librerías: un `Blob` basta. Sin prometer importación al SACE.

**[U12-09] La lista de docentes del director: sin buscador, ordenada por fecha de registro, con los grupos escondidos en cada fila, y cortada a 200 sin avisar** — media · incompleto · horas · impacto educativo 1/5 · impacto comercial 3/5

- **Qué pasa.** `#aj-buscar` solo existe en la tarjeta del admin (`js/app.js:2325`); `order by d.creado_en desc` (`SUPABASE-ROLES-V2.sql:764`) y `limit` 200 para Dirección / 500 para rector-admin (`765`) —`metas_rol_listar` 1 000/500 (`174`, `188`, `205`)—; `ajPintarLista` imprime «N registros» sin ningún «hay más» (`2596`), así que los docentes más antiguos desaparecen sin aviso al pasar el tope. Las filas van contraídas y en la línea solo sale nombre + chip «🧑‍🏫 Docente» repetido (`2604-2609`): para encontrar «el de 6º-2» hay que abrir los registros uno por uno.
- **Evidencia.** Captura `s1-04-docente-abierto.png` (13 filas, todas con el mismo chip, sin buscador); reproducción del revisor: «13 registros · toca un nombre para ver el detalle».
- **Recomendación.** Buscador para todos los roles; ordenar por grado-sección del primer grupo (los sin grupos al final, «📭 sin grupos») y mostrar los grupos en la línea; chip de rol solo cuando no es Docente; totales arriba («12 docentes · 19 grupos · 640 alumnos»); «hay más» cuando se toca el tope.

**[U12-08] Sin señal el director no ve nada: la lista de su escuela no se guarda en el equipo y no se carga sola** — media · incompleto · horas · impacto educativo 1/5 · impacto comercial 3/5

- **Qué pasa.** `_ajLista` vive solo en memoria (`js/app.js:2207`, «se limpia al salir»); sin red, «Cargar la lista» → «⚠️ No se pudo conectar. Intenta de nuevo en un momento.» y «Permisos sobre mi aula» → «⚠️ No se pudo revisar…»; `Object.keys(localStorage)` no contiene ninguna llave de la lista. Y no se carga sola al entrar en Ajustes: solo con el botón (`2348`), así que con señal intermitente el director toca y espera cada vez. El aula del maestro sí funciona sin señal; la del director, no.
- **Evidencia.** Capturas `s2-01-sin-senal.png`, `s2-02-modo-avion.png`; `js/app.js:2207`, `2348`, `2512-2528`.
- **Recomendación.** Guardar la última respuesta de `metas_rol_grupos` en `METAS_ROL_LISTA_V1` con fecha, pintarla al abrir con «Visto el 8 sept · sin señal ahora» y refrescar sola cuando vuelva la señal.

**[U12-10] Los botones del panel de Dirección miden 28 px de alto** — baja · error · horas · impacto educativo 0/5 · impacto comercial 1/5

- **Qué pasa.** «👀 Ver la lista» 96×28, «🙏 Pedir permiso» 114×28, «📣 Abrir sus convocatorias» 167×28: `.aj-mini-btn` lleva `padding: 4px 10px`, letra 0.74rem y ningún `min-height` (`css/app.css:4963-4968`). La regla de 44 px está escrita en CLAUDE.md para chips, juegos 3D y barra de secciones; en `app.css` solo hay 3 reglas `min-height: 44`, así que no es norma global del CSS, pero aplica igual a un botón que el director toca en el portón.
- **Evidencia.** Medido en 360×640 con la lista cargada (`s3-02-docente-360.png`, `rev.js`).
- **Recomendación.** `min-height: 44px; padding: 0 14px` en `.aj-mini-btn`; ya bajan de línea en 360.

**[U12-12] El rol «Rector/a» se llama como la autoridad de una universidad; la supervisión de básica se llama Dirección Distrital** — baja · sobrediseno · horas · impacto educativo 1/5 · impacto comercial 3/5

- **Qué pasa.** «🎓 Rector/a · Verificas lo que hacen todos: los grupos y la matrícula de todas las escuelas» (`js/app.js:2198`) describe una supervisión entre escuelas que en Honduras es la Dirección Distrital/Municipal/Departamental —el propio repositorio lo nombra así en `INVESTIGACION-ESTATUTO-DOCENTE.md:73`—; «rector» es de universidad. Quien busque su cargo no se reconoce.
- **Lo que se cayó del hallazgo original.** Que el sistema de permisos delegables (tabla `docente_permisos`, cuatro estados, ocho RPC y una sonda de 416 líneas para un solo permiso, `_metas_permiso_valido … in ('convocatorias')`, `SQL:358-361`) sea un problema para el usuario: es costo de mantenimiento del creador, y el diseño (el PIN no viaja, revocar revoca; `SQL:829-835`) es correcto para el aula.
- **Recomendación.** Renombrar la etiqueta y su descripción a «Dirección distrital»; el valor `rector` puede quedarse.

### Las páginas sueltas del maestro y la jerga (U10, U12, U13)

**[U10-07+U12-06] panel-docente.html: otra puerta con otra cuenta, otra letra y un mensaje que contradice la app — y se ofrece desde el formulario de alta y a dos toques de la Zona Docente** — alta · eliminar · dias · impacto educativo 2/5 · impacto comercial 4/5

- **Qué pasa.** Entra con Supabase Auth (`/auth/v1/token?grant_type=password`, `panel-docente.html:139-144`, `172`) y exige una fila en la tabla `maestros` (`246-252`) que el admin inserta por SQL; no existe signup de Supabase Auth en el repositorio (`grep auth/v1/signup` → nada), así que la cuenta RPC de la app no abre ahí. Dice «Las cuentas de maestro las crea el administrador del proyecto; no hay auto-registro» (`82-85`) mientras index.html registra a cualquiera; su cabecera dice «Acceso con cuenta de maestro» (`65-67`); letra Segoe UI (`16`) contra la normativa de Outfit; habla de «seguridad a nivel de fila (RLS)» (`67`). Es la única pantalla con seis cifras agregadas y «📥 Exportar CSV». Está enlazada desde `js/app.js:1646` («¿Administrador del proyecto?», al pie del formulario de alta), `registro.html:72` y `consulta-nube.html:80` como «🔐 Panel docente (con cuenta)» —que un maestro con cuenta de la app lee como la suya—, a dos toques de la Zona Docente (`js/app.js:1702` → consulta-nube; `index.html:476` → registro).
- **Evidencia.** Capturas `24-panel-docente.png`, `p1-01-panel-docente.png`, `p2-01-no-autorizada.png` («🚫 Tu cuenta existe pero aún no está autorizada como maestro. Pide al administrador que te agregue a la tabla "maestros"»), `p3-01-panel-con-datos.png` (stats y CSV; tabla de 782 px en 359 px de ancho). La tabla `maestros` solo en `SUPABASE-FASE1.md:277`, en ningún `.sql`.
- **Por qué importa.** Para el maestro es media: sigue con sesión abierta y no pierde nada; lo engañoso es el rótulo. Para un director que la encuentre buscando cifras es alta: la única pantalla con datos agregados tiene un login que no reconoce su cuenta.
- **Recomendación.** Llevar las seis cifras y el CSV al panel de Dirección de Ajustes (con la cuenta de la app y `_ajRpc`) y retirar panel-docente.html, el flujo de Supabase Auth y —con cuidado— la tabla `maestros`: la usan políticas RLS de `SUPABASE-SEGURIDAD.sql:304-328`, `SUPABASE-PLAN-ACCION.sql:121`, `SUPABASE-REGISTROS-ADMIN.sql:124` y `SUPABASE-AVISOS.sql:141`, que hay que reescribir a la vez (SQL en el chat). Mientras tanto, hoy mismo: quitar el enlace del formulario y los botones «Panel docente (con cuenta)».

**[U13-09] Tres puertas del maestro para «cómo van mis alumnos», dos fuera de la aplicación y con otro diseño** — media · sobrediseno · semanas · impacto educativo 2/5 · impacto comercial 4/5

- **Qué pasa.** Zona Docente → Mi aula → 📈 Estadísticas (dentro de la app); «Evidencia de misiones» → registro.html («lo que se registró en este equipo»); «📊 Ver el avance de mis alumnos» → consulta-nube.html («consulta rápida con clave»). Tres tiles de la Zona Docente (Evaluaciones, Fichas, Evidencia) son `<a href>` que sacan del SPA a páginas con otro diseño y sin conservar la vista al volver. Lo que se corrigió: panel-docente.html no es una cuarta puerta del maestro (es «¿Administrador del proyecto?» y habla de «tu alcance (tu escuela, tus grados)»); son tres.
- **Evidencia.** `index.html:452-476`; `js/app.js:1702`; `c2-maestro-ui.js` (TILES: evaluaciones.html, fichas/index.html, registro.html, consulta-nube.html).
- **Recomendación.** Una sola respuesta: Mi aula → Estadísticas absorbe la evidencia local y la de la nube (ya llama a `metas_consultar_docente` vía `estNubeRefrescar`, `js/tools/estadisticas-alumno.js:93-112`); registro.html y consulta-nube.html pasan a ser redirecciones a `index.html?view=admin&tab=est`; evaluaciones.html y fichas/index.html se abren con la misma cabecera y flecha (U13-08). Con U10-04 es la misma obra.

**[U13-08] Cuatro familias de diseño para un producto: cada página suelta tiene su letra, su color y su cabecera** — media · deuda · semanas · impacto educativo 2/5 · impacto comercial 4/5

- **Qué pasa.** Medido con `getComputedStyle`: index, Outfit; la misión, Nunito (alojada, `document.fonts.check` true); padres, salida, buzon y camp-vivo, la letra del sistema (`-apple-system`); fichas/index, Arial; evaluaciones, registro, panel-docente, consulta-nube y privacidad, «Segoe UI». Radios de botón de 0 px (padres) a 999 px (fichas), pasando por 10, 12, 14, 15 y 20. salida.html no contiene «M.E.T.A.S» en el cuerpo. Las cinco páginas del maestro sí comparten diseño entre sí y llevan «— M.E.T.A.S» y volver: se cambia de aspecto, no de marca.
- **Evidencia.** `r3-fuentes.js`, `e.log` (fuentes y fondos por página); compuesta `G01-lado-a-lado.png`.
- **Recomendación.** Un `css/base.css` con los tokens de la app (Outfit alojada, colores, radio 14 px, botón primario, cabecera con flecha de volver y marca) que carguen las 16 páginas de la raíz y `fichas/index.html`; salida.html y buzon.html conservan su acento sobre esa base.

**[U10-06] Jerga de programador delante del maestro: «¿ya corriste SUPABASE-FASE3.sql?», «sincronizados a Supabase», «Failed to fetch», «RLS»** — media · error · horas · impacto educativo 2/5 · impacto comercial 3/5

- **Qué pasa.** Sin señal —el caso normal— Comunicados dice «No se pudo revisar el buzón (¿ya corriste SUPABASE-FASE3.sql?)» (`js/tools/registros-admin.js:5546`); consulta-nube.html concatena `err.message` («Revisa tu internet (Failed to fetch)», `231` y `273`) y dice «sincronizados a Supabase»; `panel-docente.html:67` «seguridad a nivel de fila (RLS)»; `js/tools/convocatoria.js:2828` nombra `SUPABASE-CONVOCATORIA.sql` en un alert; `registros-admin.js:5041` en un confirm de cierre de año. Lo que no es exacto del hallazgo original: la pestaña Asistencia no muestra el .sql (su rama `red` dice «⚠️ No se pudo revisar el buzón. Toca «🔄 Revisar buzón»», `2811`); de las 5 apariciones en `registros-admin.js`, solo 2 llegan a la pantalla.
- **Evidencia.** Capturas `10b-tab-com-entera.png`, `18-ver-avance.png`, `24-panel-docente.png`; salida de `p6.js`.
- **Por qué importa.** El maestro lee que algo está roto y que la culpa es suya.
- **Recomendación.** Un solo mensaje: «Sin señal ahora: lo verás cuando vuelva el internet». Los avisos de instalación (`.sql`) van a la consola o al panel del administrador, nunca a la pantalla del maestro.

**[U13-10] Páginas muertas en la raíz: mision.html carga un motor que no existe; kit-auto-1 y kit-capacitacion-2 sin ningún enlace** — baja · eliminar · horas · impacto educativo 1/5 · impacto comercial 2/5

- **Qué pasa.** `mision.html:307` pide `js/motor-misiones.js?v=197`, que no existe ni existió (`ls` → No such file; `git log --all` → nunca); ningún HTML/JS del sitio la enlaza y se sella en cada despliegue (está en la lista de CLAUDE.md). `kit-auto-1.html` y `kit-capacitacion-2.html`: 0 enlaces entrantes fuera de `_dev/`; `kit-auto-2` solo desde `kit-auto-1`. Ya estaba en `4-producto.md` (B1-12+B4-05) y sigue sin hacerse. Nota del editor: `kit-capacitacion.html` (sin «-2») tampoco está enlazado —solo en un comentario de `bienvenida-metas.js:42`—, pero ese sí se usa; es U10-12.
- **Evidencia.** `e.log`: «requestfailed: …/js/motor-misiones.js?v=197»; grep de enlaces entrantes.
- **Recomendación.** Borrar `mision.html` y su línea del sellado en CLAUDE.md; mover los kits sueltos a `_dev/docs/`.

### La arquitectura de la información: un solo mapa para tres personas (U13)

**[U13-01] El botón «atrás» del teléfono cierra la aplicación desde cualquier vista** — alta · error · horas · impacto educativo 3/5 · impacto comercial 4/5

- **Qué pasa.** index.html cambia de vista con clases (`switchView`, `js/app.js:2157-2183`, que solo cambia clases y llama `metasSaveNav`) sin tocar el historial: `grep -rn 'pushState|popstate|backButton|replaceState' js index.html android` → nada. En el envoltorio Android `MainActivity` es un `BridgeActivity` vacío y `package.json` no trae `@capacitor/app`: el atrás del sistema usa el comportamiento por defecto y, sin historial, cierra la actividad. Aplica igual a la PWA instalada (standalone); en el navegador normal el gesto vuelve a la página anterior (la misión de la que se regresó), que tampoco es lo que el alumno espera.
- **Evidencia.** `i-atras.js` / `r1-portada.js`: Misiones → Rutas → `page.goBack()` → url `about:blank`, vista `undefined`.
- **Por qué importa.** Es el gesto más usado para volver en Android, y las 8 vistas del maestro solo tienen la flecha dibujada.
- **Recomendación.** En `switchView`, `history.pushState({view:id}, '', '?view=' + id.replace('view-',''))` (ya se lee `?view=` al cargar) y un `popstate` que llame a `switchView(state.view)` sin volver a empujar; en Capacitor, escuchar `App.backButton` y devolver a `view-inicio` antes de salir.

**[U13-02+U11-12] La portada es una sola para tres públicos y no reconoce a ninguno: saluda «¡Hola, Estudiante!» a la madre y al maestro con cuenta, vende el producto al maestro delante de la niña y esconde la tarjeta de padres** — alta · sobrediseno · dias · impacto educativo 4/5 · impacto comercial 3/5

- **Qué pasa.** Orden real de bloques en 393×873: saludo → tarjeta «Para el maestro hondureño · y es gratis… bloque del DCNB» (top 186, 153 px de alto) → cuatro botones, uno «Zona Docente» → cita de José Cecilio del Valle → tarjeta de padres → chips de materia → … → misión destacada a 1 695 px; «Explora tu país» ocupa 683 px; documento de 2 939 px. La tarjeta «Para madres y padres» empieza a 774 px en 393 (asoman 99) y a **795 px en 360×640: fuera entera** de la primera pantalla, pese al comentario de `index.html:135-137` («va AQUÍ ARRIBA a propósito… la familia no lo encontraba»); ninguna sonda mide esa posición. `renderHome` no mira `METAS_DOCENTE_V1`: con cuenta de maestro sembrada la portada es idéntica (saludo por defecto en `js/app.js:109`). Y `padres.html:201` manda con «Inicio» a esa misma portada de estudiante.
- **Evidencia.** Capturas `A01-inicio-fold.png`, `F01-inicio-360.png`, `R-portada-393.png`, `ig-01-portada.png`, `i-360.png`; `a-alumna.js`, `r1-portada.js`, `r4-admin.js`, `rev-salida.js`; `index.html:59` («¡Hola,» Estudiante), `135-148`.
- **Por qué importa.** Un alumno lee primero un texto de venta para maestros y no encuentra dónde empezar; la madre que llega por el enlace general —la tira y el QR sí apuntan a padres.html— ve tuteo de alumno y no ve su tarjeta; el maestro con cuenta recibe su propio anuncio. Es la mitad del hallazgo B1-01 de producto que quedó sin resolver al escribir la frase de valor.
- **Recomendación.** Portada por rol detectado: con `METAS_ALUMNO_V1` o sin nada, primer bloque «Sigue donde ibas» / «Empieza aquí» con UNA misión y los chips de materia; la tarjeta del maestro, la cita y el bloque de padres bajan a un pie «¿Eres maestro? · ¿Eres madre o padre?»; con `METAS_DOCENTE_V1`, la portada es la Zona Docente; con `METAS_PADRE_V1` con clave, la tarjeta de padres arriba. Quitar «Inicio» de la cabecera de padres.html (o que vuelva al comienzo del chat). Una sonda que mida la posición de la tarjeta de padres en 360×640.

**[U13-12] El menú mezcla los tres roles y rotula mal lo que es de cada uno** — media · sobrediseno · dias · impacto educativo 3/5 · impacto comercial 3/5

- **Qué pasa.** Ocho entradas en cuatro grupos («Para estudiantes / Para docentes / Para la familia / Cuenta») para una persona que solo es una de tres cosas. «Campeonísimo» va bajo «Para docentes» y su pantalla ofrece «Modo Práctica · Entrena con los temas que quieras, a tu ritmo», que es del alumno. «Ajustes» para un alumno solo dice «Inicia sesión en la Zona Docente para verlo». «Avance de mi hijo/a» abre view-padre, que pide la clave y enlaza a padres.html, mientras la portada enlaza padres.html («Abrir el asistente», `index.html:135-143`) y «Ver el avance guardado en este teléfono» (`147`) abre view-padre. En la portada, «Zona Docente» tiene el mismo tamaño que Misiones (96 px cada botón).
- **Evidencia.** `index.html:1096-1131`; capturas `A02-menu.png`, `I01-ajustes-sin-cuenta.png`, `I02-campeonismo.png`, `C05-vista-padre.png`.
- **Recomendación.** Mapa por rol. Sin cuenta (alumno): Inicio · Misiones · Mi progreso · Campeonísimo (práctica) · pie «Soy maestro» / «Soy madre o padre». Con cuenta (maestro): Mi aula · Misiones y fichas · Campeonísimo · Comunicados · Ajustes; las herramientas de la Zona Docente caben en esas cinco. Familia: padres.html como puerta única; de view-padre se conserva el resumen local —funciona sin internet cuando el teléfono es el del niño— y se quita solo «Notas desde cualquier lugar» (U11-05).

**[U13-03] «Misiones» y «Rutas» son dos listados de las mismas 67 misiones, y los premios viven en un tercer sitio** — media · sobrediseno · dias · impacto educativo 4/5 · impacto comercial 3/5

- **Qué pasa.** Misiones: 67 tarjetas, 7 987 px (9,1 pantallas); la primera cae a 503 px (393) / 564 px (360) tras el buscador, 7 chips de grado, 10 píldoras de materia y el banner «Rutas de Aprendizaje». Rutas: 12 caminos, 7 911 px, dos tarjetas de texto antes de la primera ruta (463 px). El 🏅 «Mis premios» de la cabecera (`notif-btn`, `js/app.js:3380-3384`) abre Rutas y hace scroll a `.insignias-strip`, mientras Mi Progreso tiene su propio «🎖️ Premios por notas de evaluación». Lo que se corrigió: Rutas no es solo otro listado —lleva etapas, nota mínima, insignias y el diagnóstico «¿Dónde empiezo?», que Misiones no tiene—; es duplicación de superficie, no de función. Y son 12 caminos y 66 etapas porque la Ruta de las Primeras Palabras no está en `RUTAS_ORDEN` (ver «Qué falta»).
- **Evidencia.** Capturas `A03-misiones.png`, `A04-rutas.png`, `A04b-rutas-full.png`, `F02-misiones-360.png`; `j-rutas.js`, `b-mision.js`.
- **Recomendación.** Un solo listado con dos órdenes («por materia» / «por ruta») como toggle dentro de Misiones; Rutas sale del menú; 🏅 abre Mi Progreso y las insignias se muestran ahí; buscador y filtros plegados en una fila (grado + materia) para que la primera tarjeta se vea sin deslizar.

**[U13-07] Los estados vacíos no dicen qué hacer: nueve barras en cero para el alumno nuevo, nueve pestañas y 21 botones para el maestro sin grupos** — media · incompleto · dias · impacto educativo 3/5 · impacto comercial 3/5

- **Qué pasa.** Mi Progreso de un alumno nuevo: tarjeta de 0 XP, «Premios por notas de evaluación» vacío y nueve filas «0 / N» (Inglés 0/1, E. Cívica 0/1); el único mensaje útil («🚀 ¡Empieza tu viaje! Las misiones que visites aparecerán aquí») está al final y sin botón (el único `<button>` de la vista es «Aa»). Mi aula del maestro recién creado: 9 pestañas, un chip «Nuevo grupo» ya creado, 21 botones visibles y dos avisos amarillos de 40-60 palabras en la primera pantalla, sin «paso 1: escribe tu grado, paso 2: pega tu lista». Plan de Acción vacío: formulario con «Forma impresa (1-30)» (`js/tools/plan-accion.js:940`).
- **Evidencia.** Capturas `A05-progreso-vacio.png`, `A05b-progreso-full.png`, `C06-mi-aula-sin-grupos.png`, `R-admin-vacio.png`, `C07-plan-vacio.png`; `r1-portada.js`, `r4-admin.js`, `c2-maestro-ui.js`.
- **Recomendación.** Estado vacío con UNA acción: en Mi Progreso, «Aún no tienes estrellas → Empieza con [misión de tu grado]» arriba, y las barras por materia solo cuando haya algo; en Mi aula sin alumnos, ocultar las pestañas que dependen de la lista y un asistente de tres pasos (grado y sección → pegar lista → imprimir claves). Es la misma obra que U10-02 y U10-08.

### Dentro de la misión (U13)

**[U13-05] Antes de leer una línea, la misión pide cinco datos al niño — sigue igual tras la primera corrida** — media · sobrediseno · dias · impacto educativo 4/5 · impacto comercial 3/5

- **Qué pasa.** Al cargar sin identidad sale `#metasIdModal` («¡Hola, explorador!», `abrirIdentificacion`, `js/metas-registro.js:855`) con nombre, nº de lista, escuela, grado y sección, y código de aula: 5 campos de texto (6 `<input>` contando el checkbox de reinicio), 55 palabras. Desde abrir la app hasta contestar la primera pregunta: 12 toques y 4 textos escritos. Lo que se corrigió del hallazgo original: «Ahora no» no anula el registro —`enviarResultados` (`425`) reabre el modal al calificar y `METAS_ID_OMITIDA` es de sesión—, y `metas_aula_resolver` solo devuelve el nombre del maestro (`545-560`), no escuela ni grado.
- **Ya estaba.** `3-ux.md` («3. Cinco campos antes de ver nada», U4-04+U5-04+U7-10+U9-07) y `5-top-20-septiembre-6.md` n.º 4, donde la parte de «un campo en vez de cinco» quedó expresamente pendiente («la clave de familia como campo único sigue pendiente»). Se vuelve a medir aquí sobre d940fe0 porque sigue siendo la primera pantalla de toda misión.
- **Evidencia.** Capturas `B01-mision-modal-identidad.png`, `R-modal-360.png`; `b2-mision.js`, `r2-mision.js`.
- **Recomendación.** Pedir solo código de aula y nombre (o la clave de familia, que ya fija grupo y alumno); escuela, grado y sección los resuelve el maestro por su código, lo que exige ampliar `metas_aula_resolver` para que devuelva escuela y grado (SQL en el chat); y pedirlo al terminar la primera actividad, no antes de leer: «¿Quieres que tu maestro vea esta estrella? Escribe el código».

**[U13-04] La barra de secciones no tiene vocabulario: 12-20 pestañas, 85 rótulos, el mismo emoji para dos cosas, anglicismos, y la flecha de volver de 50×32 px** — media · error · dias · impacto educativo 4/5 · impacto comercial 2/5

- **Qué pasa.** Sobre las 67 misiones con `<nav class="nav">`: mínimo 12 pestañas, máximo 20, mediana 15; 85 rótulos distintos; 🎓 es «Evaluación» en 36, «Constancia» en 30 y «Certificado» en 1; «Sopa» va con 🔤 (29) o 🤍 (35); «Widgets» con 🎮 (21) o 🧩 (33); «Tipos» con 6 emojis distintos; Flashcards ×66, Lab 🧪 ×50, Quiz 🧠 ×66. En 360×640 se ven 3 de 15 sin deslizar. Las pestañas sí miden 44 px (`css/barra-secciones.css:70`); la flecha `.xp-back-btn` mide 50×32.
- **Evidencia.** Conteo en `node` sobre `misiones/*/*.html`, reproducido por el revisor; captura `F03-mision-360.png`; `j-rutas.js`, `r2-mision.js`.
- **Por qué importa.** Desde la primera corrida la barra va arriba, pegajosa y deslizable, así que navegar funciona; lo que queda es que un niño de 9 años lea Flashcards, Lab, Widgets y Quiz, y que el mismo dibujo signifique dos cosas: fricción, no bloqueo.
- **Recomendación.** Diccionario único de secciones (nombre + emoji) en un archivo compartido que las misiones usen por `data-s`; Flashcards→Tarjetas, Lab→Laboratorio, Widgets→Juegos, Quiz→Preguntas; flecha a 44×44 (días). La agrupación en 4 pestañas madre (Aprende · Practica · Juega · Evalúa) va contra el uso real del aula («abran Predice», el maestro nombra la sección en voz alta) y CLAUDE.md ya la descartó con ese argumento: decisión aparte, no parte de este arreglo.

**[U13-06] Al fallar, el quiz solo dice «Incorrecto» y la corrección queda debajo de tres botones** — media · incompleto · semanas · impacto educativo 4/5 · impacto comercial 2/5

- **Qué pasa.** En Los Adjetivos (360×640), tras elegir a) y «Verificar», «Incorrecto. Revisa la respuesta correcta.» aparece DESPUÉS de «✅ Verificar» (y=298), «▶ Siguiente» (y=301, al lado) y «🔄 Reiniciar Quiz» (y=349, destructivo); la opción buena solo se marca con la clase `correct`, sin explicación; flota un «🗂️ →» sin rótulo (y=504) que salta a otra sección. Los tres botones están visibles desde antes de contestar. La cadena vive en 64 archivos `misiones/*/js/*.js`; los 16 archivos con `porque:` son texto de preguntas, no campos de explicación: ningún banco trae `porque`/`explicacion`.
- **Evidencia.** Captura `F05-quiz-feedback-mal-360.png`; `b3-feedback-360.js`, `r2-mision.js`.
- **Por qué importa.** Es el momento en que se aprende; hoy el niño solo ve que se equivocó, no por qué. «Predice» —la otra actividad— sí lo explica, y las personas de la primera corrida la nombraron como la mejor retroalimentación.
- **Recomendación.** Días: un solo botón visible por estado (Verificar → Siguiente), «Reiniciar» al final del quiz y el flotante con texto («Siguiente: Clasifica»), en un envoltorio compartido como `js/estrella-ganada.js`, sin tocar cada misión. Semanas: `porque:` de una frase en las ~600 preguntas de los 66 bancos, mostrado al fallar.

**[U13-11] Los textos del alumno están escritos para adultos: el subtítulo institucional en la cabecera y párrafos de 32 palabras** — media · incompleto · horas · impacto educativo 4/5 · impacto comercial 2/5

- **Qué pasa.** La cabecera dedica dos líneas en mayúsculas a «MISIONES EDUCATIVAS TECNOLÓGICAS ASINCRÓNICAS Y SINCRÓNICAS» (82 px). Rutas abre con «Domina una etapa con nota de 70 o más, y asegura las anteriores cuando lo necesites: repasar también es avanzar» y «Toca “📍 ¿Dónde empiezo?” en una ruta para hacer un diagnóstico rápido» (primera ruta a 463 px). Aprende de Los Adjetivos: 256 palabras, 20 frases, media 13, máximo 32 palabras por frase, 3 068 px en 360×640 antes de la primera actividad.
- **Evidencia.** Capturas `A01-inicio-fold.png`, `A04-rutas.png`; `b2-mision.js`, `r2-mision.js` (el revisor recontó: máximo 32, no 33).
- **Recomendación.** Horas: quitar el subtítulo de la cabecera (a Ajustes → Acerca de y a las páginas del maestro) y dejar en Rutas y Progreso un renglón de ≤12 palabras («Termina una misión con 70 y ganas tu primera estrella»). Semanas y aparte: partir «Aprende» en tarjetas de ≤60 palabras con «Siguiente», que ya es el patrón de Flashcards; es contenido misión por misión, 66 archivos.

## Qué sobra o debería eliminarse

Solo lo que tiene evidencia en los hallazgos de arriba:

- **`panel-docente.html`**, su flujo de Supabase Auth y —tras reescribir las cuatro políticas RLS que la nombran— la tabla `maestros`. Hoy mismo: el enlace «¿Administrador del proyecto?» del formulario de alta (`js/app.js:1646`) y los botones «🔐 Panel docente (con cuenta)» de `registro.html:72` y `consulta-nube.html:80`. [U10-07+U12-06]
- **`consulta-nube.html` y `registro.html` como puertas aparte**: redirecciones a Mi aula → Estadísticas. [U13-09, U10-04]
- **`mision.html`** (carga `js/motor-misiones.js`, inexistente) y su línea en el sellado de CLAUDE.md; **`kit-auto-1.html`, `kit-auto-2.html`, `kit-capacitacion-2.html`** fuera de la raíz pública. [U13-10]
- **El bloque «Notas desde cualquier lugar»** de la vista Padre (`js/app.js:1352-1372`). NO el resumen semanal local, que es lo único de padres que funciona sin internet. [U11-05]
- **El menú numerado 1-9 del «No entendí»** (`padres.html:1453-1460`): los chips ya lo ofrecen. [U11-03]
- **El consejo «Agregar a pantalla de inicio» justo detrás de la respuesta a la clave** (`padres.html:1435`): a la segunda visita. [U11-02]
- **«Forma N» en las tarjetas de padres** (`padres.html:437`, `js/app.js:1320-1325`, `1424`). [U11-06]
- **Los nombres de archivos `.sql` y los `err.message` en pantallas del maestro** (`registros-admin.js:5041`, `5546`; `consulta-nube.html:231`, `273`; `convocatoria.js:2828`; `panel-docente.html:67`). [U10-06]
- **El enlace «Inicio» de `padres.html:201`** a la portada del estudiante. [U13-02+U11-12]
- **El código de aula y «Ver el avance de mis alumnos» pintados sin un solo grupo** (`js/app.js:1695-1702`). [U10-02]
- **La frase «Tus alumnos escribirán tu nombre al empezar una misión»** del formulario de alta (`js/app.js:1608`, `1612`). [U10-03]
- **El toast «📣 Aviso publicado: llega al asistente en unos segundos» sin condición de red** (`registros-admin.js:5405-5408`). [U10-05]
- **El título de éxito de `salida.html` con `ok = false`** y el «Usted ya contestó» con `subida: 0`. [U11-01]
- **El subtítulo institucional de la cabecera del alumno y las dos tarjetas de texto que abren Rutas.** [U13-11]
- **La vista Rutas como entrada aparte del menú** (no su contenido): se funde en Misiones como orden «por ruta». [U13-03]
- **«Rector/a» como etiqueta** (`js/app.js:2198`): pasa a «Dirección distrital». [U12-12]

## Qué falta

- **«Quién hizo / quién no» por misión y grupo** en Mi aula, con «pedirla por WhatsApp» a los que faltan. [U10-04]
- **Un aviso general por WhatsApp** desde Comunicados (copiar / `wa.me`), y un toast que diga la verdad sin señal. [U10-05]
- **Los primeros pasos tras el alta** (tres pasos, scroll arriba) y el kit de 60 minutos enlazado. [U10-02, U10-12]
- **Una sola identidad para que el avance llegue al maestro**: el código de aula devuelto por la RPC de alta, y el mismo texto en formulario, Zona Docente y misión. [U10-03]
- **NSP explícito y validación visible en Notas SACE**; un salto automático que no consuma cifras. [U10-01]
- **Historial de navegación** (`pushState`/`popstate`) y `App.backButton` en Capacitor. [U13-01]
- **Portada y menú por rol.** [U13-02+U11-12, U13-12]
- **Un camino para la clave perdida** con el mensaje al maestro ya escrito. [U11-04]
- **Cola con id de evento para recados y excusas**, y una RPC que corrija en vez de duplicar. [U11-08]
- **Una pantalla de «no se mandó» en `salida.html`**, también al reabrir; y una barra fija con «Sí va / No puede ir». [U11-01, U11-10]
- **«🔊 Escuchar» a 44 px, explicado en la primera burbuja.** [U11-07]
- **«🏫 Mi escuela hoy»**: agregados por grupo sin nombres en `metas_rol_grupos`. [U12-01]
- **Código de escuela, invitaciones, pendientes de aceptar, y escuela obligatoria con autocompletado en el alta.** [U12-03]
- **Entrada «Mi escuela» en el menú y en la Zona Docente; aviso del ascenso de rol.** [U12-02]
- **Botones del admin**: corregir escuela (`metas_rol_escuela_corregir`), borrar cuenta; una guía de instalación única con la creación (o retirada) de `maestros`. [U12-05, U12-04]
- **«Descargar en Excel»** por grupo y por escuela. [U12-07]
- **Caché local de la lista de la Dirección; buscador, orden por grupo, totales y «hay más».** [U12-08, U12-09]
- **Diccionario compartido de secciones y flecha de volver a 44 px.** [U13-04]
- **`porque:` en los bancos de preguntas; un botón por estado en el quiz.** [U13-06]
- **`css/base.css`** para las 16 páginas de la raíz y `fichas/index.html`. [U13-08]
- **Estados vacíos con una acción.** [U13-07]
- **Un modal de identidad de dos campos, después de la primera actividad.** [U13-05]
- **Una sonda que mida la posición de la tarjeta de padres en 360×640.** [U13-02+U11-12]

### Señalado por los revisores, sin hallazgo propio

No pasaron revisión adversarial —los encontraron los propios revisores al comprobar otros—; llevan evidencia y quedan para la siguiente corrida:

- **La Ruta de las Primeras Palabras (Inglés) está fuera del mapa de rutas.** `RUTAS` en `js/data/misiones.js` tiene 13 rutas y la misión 57 («Hello! Saludos y Presentarme») lleva `ruta: 'primeras'`; `RUTAS_ORDEN` (`js/app.js:707`) tiene 12 entradas y no la incluye, así que no se pinta en Rutas, no da insignias (`js/app.js:1024`, `1137`), no entra en «Tu siguiente paso» (`843`) y no tiene diagnóstico (`grep -ci primeras js/data/diagnosticos.js` → 0). La única misión de Inglés queda fuera del mapa sin ningún error. Comprobado por el editor sobre d940fe0. Horas. [U13]
- **El Quiz deja avanzar sin contestar.** «✅ Verificar», «▶ Siguiente» y «🔄 Reiniciar Quiz» están visibles y activos antes de responder (`r2-mision.js`), así que se pueden saltar las 9 preguntas. Es de la misma familia que U13-06. [U13]
- **«📋 Código de aula copiado» aunque el portapapeles falle.** `docenteCopiarCodigo` (`js/app.js:1909-1911`) no espera `navigator.clipboard.writeText`; si el navegador lo deniega, la promesa se rechaza en silencio y el toast sale igual: el maestro pega vacío. [U10]
- **Dos nubes, dos indicadores, y el maestro no puede distinguirlas.** El chip «☁️ al día» y `#ad-sb-status` hablan de la nube del chatbot de padres (`registros-admin.js:617`, `5788`); el espejo de sus propios datos entre equipos (`js/metas-docente-sync.js:413`) informa aparte con «📴 Datos del aula: esperando internet». Un «al día» puede convivir con la asistencia del día sin subir al espejo del aula. Es lo que sobrevive del descartado U10-11. [U10]
- **Costo de `metas_rol_grupos`.** Por cada docente abre el espejo completo con `(valor->>'raw')::jsonb` (`SUPABASE-ROLES-V2.sql:626-640`) y lo recorre en tres subconsultas por grupo (`717-729`), hasta 500 docentes por llamada. No se midió con datos reales; es la RPC con más probabilidad de agotar el statement timeout del plan gratuito conforme crezca. Va anotado en U12-01. [U12]

## Descartados en la revisión adversarial

Dos hallazgos se cayeron enteros:

| ID | Título | Motivo |
|---|---|---|
| U10-11 | El estado de la nube miente sin señal: «☁️ al día» con todas las peticiones fallando y «Aviso publicado» cuando nada salió | El chip cuenta lo pendiente (`adPendientesTotal`, `registros-admin.js:5758-5770`): con el aula vacía no hay nada que subir y «al día» es cierto; tras editar pasa a «⏳ 43 por subir». El estado de red que pedía ya existe en la misma pantalla: `#ad-sb-status` dice «📴 N cambio(s) esperando internet» sin señal (`5791-5792`) y «⚠️ No se pudo subir ahora; se reintenta solo» cuando el fetch falla (`5846`); en Comunicados, `#av-sb-status` (`6041`). La mitad del «Aviso publicado» es el toast de U10-05. Lo que sobrevive (el chip no distingue «al día» de «sin señal», y hay dos nubes con dos indicadores) está en «Señalado por los revisores». |
| U12-11 | Cualquiera se registra como docente de la escuela del director y nadie puede quitarlo ni verificarlo; y el emparejamiento de escuela es distinto según qué RPC conteste | Duplicado sin consecuencia propia. Lo primero lo resuelven la aceptación de pendientes de U12-03 y el «borrar cuenta» de U12-05; el intruso no gana nada (no ve a nadie: solo el admin promueve, `SQL:224-268`) y el único daño es ruido en la lista. Lo segundo: el emparejamiento sin municipio de `metas_rol_listar` (`SQL:203`) solo corre cuando `metas_rol_grupos` da 404 (`js/app.js:2523-2534`), es decir, cuando ROLES-V2 NO está instalado, y por ese camino salen nombres de docentes, nunca listas de niños; las listas de alumnos y las convocatorias siempre pasan por el emparejamiento con municipio (`SQL:805`, `891`, `952`). |

Y dentro de hallazgos confirmados se cayeron **afirmaciones**, que conviene que el creador vea:

| ID | Afirmación que se cayó | Motivo |
|---|---|---|
| U11-01 | Confeti | Es el emoji 🎉; `grep confeti` en salida.html → 0. El hallazgo, en cambio, es peor: la portada también dice «Usted ya contestó». |
| U11-02 | Severidad alta; «la respuesta queda perdida» | Los chips se recogen al primer gesto hacia arriba (`#chips.recogido`): fricción, no abandono. |
| U11-03 | Severidad media; «convierte la bandeja del maestro en basurero» | Nada entra sin tocar el botón, hay tope de 5/día, y «tiene tareas para mañana?» es pregunta de escuela. |
| U11-04 | Severidad alta; recuperar por nombre + grado + teléfono; RPC que reenvíe la clave; esfuerzo días | El maestro ya reimprime la tira de un alumno con un toque; la recuperación por teléfono choca con el modelo de privacidad; el mínimo viable es de horas. |
| U11-05 | Severidad media; «el resumen semanal está siempre vacío en el teléfono de la madre»; consulta-nube.html despista a padres | El teléfono de la familia suele ser el del niño y ahí el resumen funciona sin internet; consulta-nube.html solo se enlaza desde la Zona Docente. Sobra solo el bloque de notas. |
| U11-10 | «Quitar los segundos del reloj» | Es opinión y contradice una decisión razonada (CLAUDE.md, «El reloj cierra de verdad»); el arreglo no la necesita. |
| U11-11 | «Las claves siguen enumerables por guion»; «aplicar `metas_rate_ok` también a claves que no existen» | Ya se aplica antes de la consulta en las tres RPC (`SUPABASE-FASE3.sql:167`, `193`); 300 llamadas/hora/IP ≈ 100 claves/hora sobre 31⁴ ≈ 923 000 por número de lista. |
| U11-12 | Enlace en `padres.html:186`; «asoma 18 px» | Es `padres.html:201`; en 360×640 la tarjeta no asoma nada (top 795). Fundido en U13-02. |
| U10-01 | Severidad crítica; «un 7 (quise poner 70) entra callado» | 7 es nota válida en la escala 1-100 que la pantalla anuncia; el 105 es raro y el 1 se ve al volver. Alta. |
| U10-02 | «El código está vacío porque sin señal no existe» | La sonda abortó `metas_aula_mi_codigo`; en el alta real `renderProfile` lo pide en el acto. Lo firme es el scroll y la falta de guía. |
| U10-03 | «Sin señal el mensaje queda vacío»; «se guarda con `docente:''` y el avance no llega» | Con `onLine === false` el modal sí avisa; queda vacío solo si el fetch falla con señal aparente. `metas_guardar` resuelve el código en el servidor. |
| U10-04 | Esfuerzo semanas | Días: caché de la nube y emparejamiento por nº y grupo ya existen. |
| U10-05 | Severidad alta; «el aviso se pierde» | Queda en cola y `#av-sb-status` lo dice en la misma pantalla; es fricción y un toast inexacto. Horas. |
| U10-06 | «La pestaña de Asistencia muestra el .sql»; «5 veces en registros-admin.js» | Asistencia dice «Toca 🔄 Revisar buzón»; solo 2 de las 5 llegan a la pantalla. |
| U10-07 | Severidad alta | El maestro conserva la sesión y no pierde nada; lo engañoso es el rótulo. Fundido con U12-06, que la mantiene alta por el director. |
| U10-08 | Omite dos mitigaciones; esfuerzo días | Los mosaicos se reordenan por uso (`zdUsoOrdenar`) y hay botón Aa; colapsar las cajas es de horas. |
| U10-10 | «Para llenar a lo ancho hay que deslizar en cada fila»; «hacer los ◀ ▶ el modo por defecto» | La columna del alumno ya es fija (`.ad-mx-sticky`); los ◀ ▶ reordenan materias, no pasan de página. |
| U10-12 | «Promete WhatsApp que la app no tiene» | Hay WhatsApp al padre por alumno, en gastos y en la Convocatoria; falta el aviso general (U10-05). |
| U12-06 | «No está enlazada desde index.html» | Está en `js/app.js:1646` y a dos toques de la Zona Docente. Retirar `maestros` exige reescribir cuatro políticas RLS. |
| U12-07 | «El único CSV está en panel-docente»; exportar «al SACE» | `js/metas-registro.js:309` exporta la evidencia de misiones; no consta carga masiva al SACE. |
| U12-12 | Severidad media; «congelar el sistema de permisos»; la sonda de 416 líneas como argumento | Es costo del creador, no problema del usuario; el diseño es correcto. Queda el renombrado. |
| U13-02 | Documento de 2 963 px | 2 939 px. Se añade que la portada no cambia con la cuenta del maestro. |
| U13-03 | Severidad alta; «9 píldoras»; «Rutas es solo otro listado» | Media; son 10 píldoras; Rutas lleva etapas, insignias y diagnóstico. Son 66 etapas porque falta la ruta de Inglés en `RUTAS_ORDEN`. |
| U13-04 | Severidad alta; esfuerzo semanas; agrupar en 4 pestañas madre | La barra ya funciona; diccionario y flecha son de días; la agrupación va contra «abran Predice». |
| U13-05 | Severidad alta; 63 palabras; «con Ahora no el maestro no recibe nada» | Media; 55 palabras; «Ahora no» aplaza al momento de calificar. Ya anotado en 3-ux.md y en top-20 n.º 4 como pendiente. |
| U13-06 | «El aviso aparece debajo de tres botones apilados» | Verificar y Siguiente van lado a lado y los tres están visibles desde antes de contestar. |
| U13-08 | Severidad alta; «ocho productos» | Son cuatro familias de diseño; las páginas del maestro conservan marca y volver. |
| U13-09 | Severidad alta; «cuatro puertas» | Tres del maestro; panel-docente es de otro rol y redirigirlo rompería el panel del director. |
| U13-10 | Severidad media; «kit-capacitacion.html sí está enlazado desde la bienvenida» (nota del revisor) | Baja: nadie llega. Y el editor comprobó que `kit-capacitacion.html` solo aparece en un comentario (`bienvenida-metas.js:42`): U10-12 sigue en pie. |
| U13-11 | Máximo 33 palabras; esfuerzo días | 32; quitar el subtítulo y acortar Rutas es de horas; partir Aprende es de semanas y aparte. |

## Cobertura y límites

- **Código auditado:** `main` en `d940fe0` (9 de septiembre de 2026), con las 20 modificaciones de `_dev/auditoria-2026-09/5-top-20-septiembre-6.md` ya aplicadas. Todo se juzgó contra ese código, no contra el de agosto; donde un hallazgo ya estaba escrito en la primera corrida (U13-05, U13-10) se dice y se vuelve a medir.
- **Lentes:** U10 docente, U11 familia, U12 dirección y administración, U13 arquitectura de la información. La lente del alumno (U4–U9) está en `3-ux.md` y no se repite aquí. 46 hallazgos confirmados por revisión adversarial y 2 descartados; fundidos en 44.
- **Entorno:** Chromium emulando pantallas táctiles de 393×873 y 360×640 (y 1280×720), no teléfonos físicos; nada en iOS. El envoltorio Android no se ejecutó en dispositivo: el comportamiento del «atrás» del APK se infiere de `MainActivity` y de `package.json`, y el de la PWA instalada, del modo standalone.
- **La nube no se tocó.** Supabase se simuló con `page.route`, con respuestas armadas a partir de los `SUPABASE-*.sql`; lo que hace de verdad cada RPC (límite de llamadas, truncado a 200/500, emparejamiento de escuela, costo de `metas_rol_grupos`) se leyó del SQL y no se ejecutó. Las sondas de la Dirección y del asistente corrieron sin service worker (`SIN_SW`), como pide CLAUDE.md para poder interceptar.
- **No se comprobó:** los `wa.me` no se siguieron (WhatsApp); de `speechSynthesis` solo se comprobó que existe y se dispara; el envío real de `metas_mensaje_padre`; el login real de `panel-docente.html` con Supabase Auth; la carga masiva al SACE (no consta que exista); F.A.R.O. (otro repositorio, sin acceso); los tiempos bajo red lenta no se midieron en esta corrida.
- **Las medidas** de palabras, frases y píxeles las hicieron los guiones de cada auditor (`scratchpad/ux-b/U10`…`U13`); el revisor las recontó en los casos que se citan con corrección (55 palabras y no 63; 32 y no 33; 2 939 px y no 2 963; 849 px en 360 frente a 834 en 393).
- **Los cinco puntos de «Señalado por los revisores»** no pasaron revisión adversarial; el editor comprobó solo el de la Ruta de Inglés y el enlace del kit.
