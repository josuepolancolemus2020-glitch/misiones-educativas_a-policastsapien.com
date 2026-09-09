# Auditoría UX/UI (I-b): la aplicación probada como alumna de 8º grado

Una persona recorrió la aplicación con un Chromium controlado paso a paso, en 393×873 y en
360×640 (el teléfono barato), con la nube apagada (`supabase.co` abortado): Valeria, alumna de
8º de un colegio privado, con teléfono propio y sin maestro dentro de la aplicación, que entra a
estudiar para su examen de Ciencias Naturales. Es la lente U8, la que completa la serie de 4º a 9º
que `3-ux.md` dejó pendiente. Los 12 hallazgos que salieron pasaron todos la revisión adversarial;
cuatro bajaron de severidad y cinco corrigieron una cifra o una afirmación. Los revisores echaron
en falta cuatro cosas, y tres de ellas amplían un hallazgo de aquí. Lo que ya está contado para
las lentes U4–U7 y U9 —barra de secciones, buscador sin tildes, cinco campos, autoavance del
quiz, estrellas regaladas al abrir— no se repite: se juzga el código con esas modificaciones ya
puestas.

## Resumen

**Veredicto.** Con las 20 modificaciones de la primera corrida aplicadas, Valeria no se pierde: llega a su misión en cuatro toques, la barra de pestañas está arriba, «Continúa donde quedaste» la reconoce al volver, y con la nube apagada no salió un solo error de JavaScript propio. Lo que la echa es otra cosa, y son dos cosas: **la misión que la aplicación le rotula «Para 8º grado» le enseña al nivel y con el tono de 4º**, y **el puntaje que le devuelve no mide nada**. Para una alumna que estudia sola, con su propio teléfono y YouTube a un toque, eso es el momento de abandono.

Los cuatro problemas de fondo:

1. **La estrella se sigue regalando donde la alumna mira primero.** El Quiz con 0 de 9 da confeti, estrella y el logro «Primera prueba… superada» en 34 misiones; calificar la Evaluación en blanco da la estrella por `estrella-ganada.js:209`; «¡Misión completada! Ver mi Constancia» brilla con 0 XP; y el WhatsApp de la Constancia manda «completó la Misión… Progreso: 3 %». La modificación 10 arregló generar y calificar; dejó fuera llegar al final (U8-01, U8-04).
2. **El contenido es de 4º y el error no explica nada.** El Sistema Digestivo no contiene «enzima», «amilasa», «pepsina» ni «peristaltismo», que es lo que el DCNB de 8º pide; el tono es «¡Hola, explorador!» y «Aprendiz 🌱». Y al fallar, en el Quiz y en la Evaluación, solo se lee «Incorrecto. Revisa la respuesta correcta.» (U8-02, U8-06).
3. **Tres cuentas que no se hablan.** La misión dice «⭐ 59 · Naturalista»; la portada dice «35 XP · Explorador», que son los XP que regala ABRIR la misión; el nombre que Valeria escribió no llega ni al saludo de la portada ni a la Constancia; el 🏅 la manda a la Ruta del Número de Matemáticas (U8-03, U8-05).
4. **La misión está pensada para el aula de 43 con maestro, no para quien estudia sola.** La Evaluación dice «copia el examen en tu cuaderno» al lado de 30 radios, con el selector de 30 Formas y el botón Imprimir delante; 14 pestañas más la Constancia sin un «por dónde empiezo»; y en el teléfono barato la cabecera se come el 35 % de la pantalla en reposo (U8-11, U8-12, U8-10).

**Lo que está bien, y es verdad:** todo funciona sin nube y sin errores; la barra de pestañas va pegada arriba, se desliza y trae el chip activo a la vista, también en 360×640; los chips «Mi grado» ordenan sin esconder (16 suyas arriba, las 51 restantes debajo, sin rótulo de grado ajeno) y el buscador encuentra por grado; el quiz no deja avanzar sin verificar y marca elegida y correcta; 💬 Sugerencias guarda en cola sin señal (`METAS_SUG_OUTBOX_V1`) y promete no publicarse; y Cinco Reinos sí llega al nivel de 8º (taxonomía, Linneo, Whittaker, filo, género, especie), con un quiz que pregunta por categorías.

## Hallazgos por tema

### El puntaje: lo que se gana sin aprender

**[U8-01] El Quiz con 0 de 9 —y la Evaluación calificada en blanco— dan confeti, estrella de sección y logro «superada»** — alta · error · dias · impacto educativo 5/5 · impacto comercial 4/5

- **Qué pasa.** Contestando siempre la opción a) —nunca es la correcta en las nueve preguntas de `qzData`— Valeria termina con 0/9. Al llegar a la última, la misión llama `fin('s-quiz')` y `unlockAchievement('primer_quiz')` sin mirar los aciertos: 120 piezas de confeti, «🎉 ¡Quiz completado!» sin puntaje y la cinta «¡Logro desbloqueado! Primera prueba del sistema digestivo superada». Ese logro sale después en la Constancia con 0 %. El revisor reprodujo lo mismo en la sección que CLAUDE.md da por arreglada: generar la Evaluación y tocar «Calificar» sin contestar nada da «Resultado automático: 0/100», `done = ['s-evaluacion']` y el chip marcado. La regla del primer toque no cubre esto porque el quiz sí se toca; el agujero es que la estrella se da por LLEGAR al final, no por acertar.
- **Evidencia.** `misiones/2y3ciclo-sistema-digestivo/js/sistema-digestivo.js:99` (`if(qzIdx>=qzData.length){…fin('s-quiz');unlockAchievement('primer_quiz');return;}`) y `:36` (etiqueta del logro). `grep -l "fin('s-quiz');unlockAchievement('primer_quiz')" misiones/*/js/*.js | wc -l` → 34; «Quiz completado» sin nota en 65 archivos JS. `js/estrella-ganada.js:56` (`CON_ACTIVIDAD = {'s-evaluacion':1,'s-tareas':1}`: el quiz no está en la lista) y `:209` (`fin('s-evaluacion')` tras `gradeEval`, sin mirar la nota). Reproducido con Playwright: `done=['s-quiz']`, `unlockedAch=['primer_quiz']`, `xp=0`; capturas `ux/U8/16-quiz-final.png` y `ux/U8-revision/quiz-0de9.png`.
- **Por qué importa.** Es el primer puntaje que la alumna ve en la misión, y con cero aciertos le dicen «superada». CLAUDE.md lo escribe con sus palabras —«un puntaje que se consigue sin aprender enseña que el puntaje no significa nada»— y la modificación 10 lo aplicó a generar y calificar la Evaluación, pero dejó fuera el Quiz, que es la actividad que se hace primero, y la calificación en blanco.
- **Recomendación.** En `showQz`, al terminar: «N de 9 correctas», y llamar `fin('s-quiz')` y `unlockAchievement('primer_quiz')` solo con ≥ 70 % (la regla 90/70/40 que ya usa el Reto). En `estrella-ganada.js`, condicionar el `fin('s-evaluacion')` de la línea 209 a que haya al menos una respuesta contestada o a una nota mínima. Guion sobre las 34 misiones, y dos casos nuevos en `_dev/verifica-estrella-ganada.js`: quiz jugado mal → ni estrella ni logro; evaluación calificada en blanco → ni estrella. Ofrecer «Repetir solo las que fallé».

**[U8-03] Mi Progreso y 🏅 no dicen qué domina: dos XP que se contradicen** — media · error · semanas · impacto educativo 4/5 · impacto comercial 4/5

- **Qué pasa.** Tras sacar 9/9 en el quiz y voltear 14 flashcards, la misión dice «⭐ 59 · Naturalista 🧫». En la portada, Mi Progreso dice «Nivel 1 · Explorador · 35 XP»: son los 35 XP que `visitMission` regala por ABRIR la misión, sin relación con lo hecho dentro; la portada nunca lee el progreso de la misión. La lista dice «Visitada», sin el 9/9 ni qué sección falta. «Premios por notas de evaluación» está vacío hasta que se califique un examen. El 🏅 de la cabecera lleva a Rutas, a la Ruta del Número de Matemáticas con «0 de 13» e insignias vacías, aunque Valeria solo tocó Ciencias. «Naturalista» y «Explorador» son dos escalas de nivel distintas.
- **Evidencia.** Capturas `ux/U8/22-mi-progreso.png` (35 XP, Explorador, C. Naturales 1/14, «Visitada») y `ux/U8/21-portada-medalla.png` (Ruta del Número, 0 %, «Tus insignias» vacío); salida de `p14-flujo-real.js`: «XP mision ⭐ 59 Naturalista» frente a «MI PROGRESO … 35 / PUNTOS XP». `js/app.js:2116-2124` (`s.xp += m.xp` al visitar); `grep 'doneSections|_v1' js/app.js` → nada, solo lee `METAS_REGISTRO_V1` para el resumen semanal (`app.js:706`, `:1282`); insignias solo por nota de evaluación (`app.js:1132-1145`); `#notif-btn` (`app.js:3381`) hace `switchView('view-rutas')`; escalas: `sistema-digestivo.js:52` frente a la de la portada.
- **Por qué importa.** No impide usar nada ni pierde datos: es credibilidad. Pero la pregunta de quien estudia sola es «¿qué domino y qué no?», y ninguna pantalla la contesta; lo que sí contesta —35 XP por abrir— le enseña que el número no significa nada.
- **Recomendación.** Un solo XP: que la portada lea el XP y `doneSections` de cada `<slug>_v1` (o que la misión escriba en `METAS_REGISTRO_V1` un resumen por sección) y deje de regalar `m.xp` por abrir. En Mi Progreso, por misión: secciones dominadas y pendientes con su última nota (Quiz 9/9, Evaluación —, Reto —) y un «Te falta: Evaluación» tocable. Que 🏅 abra un panel de premios propio, no la primera ruta de Matemáticas.

**[U8-04] «¡Misión completada! Ver mi Constancia» brilla con 0 XP; la Constancia dice «24 %» sin decir de qué, y el WhatsApp dice «completó» con 3 %** — media · error · horas · impacto educativo 3/5 · impacto comercial 3/5

- **Qué pasa.** Al entrar en Evaluación sin haber hecho nada, debajo de los botones hay un botón verde grande «🏅 ¡Misión completada! · Ver mi Constancia»: es el «siguiente sección» de la barra, con texto fijo. La Constancia sale con el porcentaje (24 % tras el quiz 9/9; 0 % con el quiz a 0/9), «¡Sigue aprendiendo!» y «Sigue completando secciones para desbloquear logros», sin listar cuáles; y con el quiz a cero lista como logro «🔬 Primera prueba del sistema digestivo superada». Ofrece «📤 Enviar resultados», «📲 WhatsApp», «📷 Guardar foto», «👤 Cambiar alumno» aunque no haya maestro ni código de aula. Y el WhatsApp manda «🔬 ¡Estudiante completó la Misión "El Sistema Digestivo"! 🏅 Progreso: 3 %»: «completó» con 3 %, y «Estudiante» aunque `METAS_ALUMNO_V1` tenga el nombre.
- **Evidencia.** `misiones/2y3ciclo-sistema-digestivo/sistema-digestivo.html:542` (`nsb-hint` «¡Misión completada!» fijo); `sistema-digestivo.js:693` (`openDiploma`: mensajes por tramos de `pct`, sin desglose) y `:696` (`shareWA`: «completó… Progreso: ${pct}%»). Capturas `ux/U8/11-evaluacion.png` (⭐ 0 y el botón «¡Misión completada!») y `ux/U8/18-constancia.png` (24 %, «Sigue aprendiendo», sin lista). Botones del diploma medidos por el revisor.
- **Por qué importa.** La promesa («completada») y el dato (24 %) se contradicen en la misma pantalla, y la contradicción sale del teléfono por WhatsApp hacia la familia. Es la Constancia que la alumna enseña en casa.
- **Recomendación.** `nsb-hint` = «Última sección» hasta que `_diplPct()` llegue a 100, y entonces «¡Misión completada!». En la Constancia, bajo el porcentaje, las secciones con ✅/⬜ y la nota de cada una; el mensaje de WhatsApp dice «avanzó un N %» mientras N < 100 y lee el nombre de `METAS_ALUMNO_V1`; ocultar «Cambiar alumno» y «Enviar resultados» cuando no hay `docente` ni `codigo_aula`.

### El contenido: lo que una alumna de 8º encuentra

**[U8-02] A la alumna de 8º se le sirve el contenido y el tono de 4º: lo que su examen pide no está en la misión** — alta · incompleto · meses · impacto educativo 5/5 · impacto comercial 4/5

- **Qué pasa.** `dcnb-map` pone El Sistema Digestivo en 8º (feb-mar, jun) y la aplicación la rotula «Para 8º grado». El rótulo no es falso: el DCNB de 8º sí «repasa la estructura y la función del sistema digestivo». Lo que falla es la profundidad. El DCNB de 8º pide comparar los sistemas digestivos de humano, sapo, ratón y grillo, las glándulas anexas con los microorganismos, y experimentos con la amilasa salival, el jugo gástrico y la bilis. La misión no contiene «enzima», «amilasa», «pepsina» ni «peristaltismo»; enseña «metemos el alimento por la boca», «Sale lo que sobra», con emojis 1️⃣2️⃣ y un quiz de «¿Qué sistema transforma los alimentos?». El tono («¡Hola, explorador!», «Aprendiz 🌱») y el nivel de lectura (256 palabras, 14,1 por frase) son de II ciclo. Lo mismo en Español: Los Sustantivos enseña «si puedes decir el o la antes, ¡es un sustantivo!» donde el DCNB de 8º pide morfosintaxis, concordancia y oración simple y compuesta.
- **Evidencia.** `grep -o -i "enzima|amilasa|pepsina|peristal" misiones/2y3ciclo-sistema-digestivo/sistema-digestivo.html` → 0 (solo «quimo» ×2 y «vellosidad» ×1). `_dev/dcnb/dcneb-basica-iii-ciclo-89-ciencias-naturales-octavo-grado-1de2.md:21-22` y `:114-115`; `_dev/dcnb/dcneb-basica-iii-ciclo-30-comunicacion-octavo-grado-4de4.md:63-86`. `js/data/dcnb-map.js:68` (36 → 8: [2,3,6]); `js/data/misiones.js:69` («II y III Ciclo»). Medición de `p4-mision-mapa.js`. Capturas `ux/U8/07-dig-tras-ahora-no.png`, `ux/U8/08-quiz.png`, `ux/U8/07-sust-tras-ahora-no.png`. CLAUDE.md lo reconoce como «el problema de fondo».
- **Por qué importa.** Para una alumna con su propio teléfono y examen la semana que viene, esto es el momento de abandono: la misión que le dicen suya no le sirve para SU examen, y se lee en tres minutos. Es el mismo hallazgo que salió en 7º y en 9º, visto ahora con el DCNB de 8º al lado.
- **Recomendación.** No quitar el rótulo «Para 8º grado» (el DCNB lo respalda), sino decir en la tarjeta o en la cabecera qué cubre y qué falta: «Base del tema · Para 8º te falta: enzimas, bilis, sistemas comparados». A medio plazo, un bloque «Nivel III ciclo» dentro de la misión (texto + 5 preguntas de quiz + 1 sección de la evaluación) que se active por el grado guardado en `METAS_ALUMNO_V1`, empezando por las 7 de C. Naturales que el mapa marca para 8º. Retirar «explorador» y «Aprendiz 🌱» cuando el grado sea ≥ 7º.

**[U8-06] Al fallar solo se lee «Incorrecto. Revisa la respuesta correcta.», y la opción elegida se pinta en verde antes de verificar** — media · incompleto · semanas (el color: minutos) · impacto educativo 4/5 · impacto comercial 2/5

- **Qué pasa.** En el Quiz, al verificar una respuesta mal aparece «Incorrecto. Revisa la respuesta correcta.» y se pinta la buena; nada de por qué. Antes de verificar, la opción elegida se resalta en verde (`.sel`, el `--pri` de la misión), y después la correcta se pinta en otro verde (`--jade`): dos verdes para «elegida» y «correcta». En la Evaluación calificada: «Revisar. Respuesta esperada: saliva» ×15 y «Pareados: 0/5. Clave: 16→A…», sin una línea de explicación. El banco `qzData` no tiene campo de porqué.
- **Evidencia.** `misiones/2y3ciclo-sistema-digestivo/css/sistema-digestivo.css:19` y `:177` (`.qz-opt.sel` borde rgb(22,163,74)); `:15` y `:178` (`.qz-opt.correct` borde rgb(0,184,148)), medido tras la transición. `sistema-digestivo.js:104` (`checkQz` solo pinta la buena y escribe el texto fijo) y `:454` (`gradeEval`). Capturas `ux/U8/09-quiz-mal.png`, `ux/U8/15-quiz-verificar-mal.png`, `ux/U8/11h-calificado-full.png`, `ux/U8-revision/quiz-sel-vs-correct.png`; salida de `p19`: 16 mensajes «Revisar. Respuesta esperada: …».
- **Por qué importa.** Para estudiar sola antes del examen, el error es justo el momento en que la alumna necesita el porqué, y no lo hay. Y uno de cada doce niños no distingue bien los dos verdes.
- **Recomendación.** Un campo `por` en cada pregunta del banco («La bilis emulsiona las grasas, por eso la fabrica el hígado») que se muestre al fallar; `.sel` en azul o gris, nunca verde (una regla CSS por misión: minutos). Al terminar el quiz, «Repasar las que fallé» que reenvíe a la tarjeta de Aprende correspondiente. El esfuerzo de «semanas» es escribir los porqués de las 74.

### Dentro de la misión: la Evaluación, las pestañas y el teléfono barato

**[U8-11] La Evaluación en pantalla contradice sus propias instrucciones y está pensada para el maestro, no para quien estudia sola** — media · sobrediseno · dias · impacto educativo 3/5 · impacto comercial 2/5

- **Qué pasa.** El texto dice «Copia el examen en tu cuaderno y responde… después selecciona Ver Pauta», y debajo la pantalla ofrece 30 radios, 5 cajas de texto y 5 selectores para contestar en el teléfono. Delante de la alumna hay un selector de 30 «Formas» (la herramienta del maestro para imprimir a 43), el botón «Imprimir» y, al calificar, «Este resultado es solo para revisión en pantalla; la impresión conserva el formato limpio para papel». Y al tocar «Nueva Evaluación» salta confeti (117 piezas) antes de contestar nada: `fin('s-evaluacion')` al final de `genEval` lanza `launchConfetti()` ANTES de que el envoltorio de estrella-ganada desmarque la sección; la estrella se retira, el festejo ya salió.
- **Evidencia.** `misiones/2y3ciclo-sistema-digestivo/sistema-digestivo.html:510` (instrucción); `sistema-digestivo.js:449` (`genEval`, selector `evalFormaSel`) y `:454` (texto de «solo para revisión en pantalla»). Capturas `ux/U8/11d-eval-generada.png`, `ux/U8/11e-calificar-vacio.png`, `ux/U8-revision/eval-generada.png`; salida de `p17`: radios 30, texts 5.
- **Por qué importa.** Quien estudia sola no sabe si debe contestar en el teléfono o en el cuaderno, y lo que ve es el tablero del maestro. El aviso de «esto cuenta como práctica, no como nota» al abrir la Pauta está bien pensado, pero llega como un párrafo largo dentro de un toast.
- **Recomendación.** Dos modos explícitos: «Practicar en el teléfono» (sin Formas, sin Imprimir, instrucción «Contesta aquí y toca Calificar») y «Para el maestro» (Formas, Imprimir, Pauta) plegado. Sin confeti al generar: `fin('s-evaluacion', false)` en `genEval` de las 74. El resultado como tarjeta con desglose y «Repasar lo fallado», no como toast de tres frases.

**[U8-12] Catorce pestañas más la Constancia, sin un «por dónde empiezo para el examen»; varias son la misma actividad con otro nombre** — media · sobrediseno · semanas (el bloque «para tu examen»: horas con guion) · impacto educativo 3/5 · impacto comercial 2/5

- **Qué pasa.** Aprende · Órganos · Lab · Flashcards · Quiz · Clasifica · Identifica · Completa · Widgets · Reto · Sopa · Tareas · Evaluación · Recursos, más el botón Constancia (`role=button`). Widgets contiene «Ordena la secuencia» e «Identifica el Concepto», que ya existen como pestañas; Clasifica, Identifica, Completa y Reto trabajan los mismos 10 términos (Clasifica y Reto sí difieren en mecánica); «Sopa» lleva un 🤍 como icono. Una alumna que entra a estudiar para un examen no sabe cuál es el camino corto (Aprende → Quiz → Evaluación) y la flecha «→» de cada sección la lleva por las quince en orden. Lo mismo, con las mismas pestañas, en Cinco Reinos.
- **Evidencia.** Salida de `p4-mision-mapa.js` (pestañas, idénticas en Cinco Reinos); `sistema-digestivo.html:360` («🔗 Ordena la secuencia» dentro de Widgets), `:372` («🔬 Identifica el Concepto» dentro de Widgets), `:441` y `:449` (icono 🤍 de Sopa). Capturas `ux/U8/42-clasifica.png`, `ux/U8/43-identifica.png`, `ux/U8/45-widgets.png`, `ux/U8/46-reto.png`.
- **Por qué importa.** El momento de duda del recorrido fue este: quince chips y nadie dice por dónde empezar. Quien estudia sola no tiene al maestro diciendo «abran Predice».
- **Recomendación.** Sin tocar el contenido: un bloque «Para tu examen en 20 min: Aprende → Quiz → Evaluación» al abrir la misión (horas por misión, con guion). Agrupar las pestañas de práctica bajo «Practica» con submenú; fusionar Widgets con Identifica y Completa (mismo banco; esto es lo que cuesta semanas); darle a Sopa un icono real. La sonda mide que la primera fila de pestañas quepa en 360 px.

**[U8-10] En 360×640 la cabecera de la misión se come el 35 % de la pantalla en reposo** — media · sobrediseno · dias · impacto educativo 2/5 · impacto comercial 2/5

- **Qué pasa.** Barra superior con logo, XP, WhatsApp y estrella (0-85 px, con «Aprendiz 🌱» saltando a una segunda línea de 36 px), franja del título con la tira de palabras (85-161), barra de pestañas (161-227): el contenido empieza a 251 px de 640. En el Quiz caben la pregunta y dos opciones; en Aprende, un párrafo. Matiz: solo la barra de pestañas es pegajosa —al deslizar quedan 66 px—, lo demás se va; y dentro del Quiz cambiar de pregunta no vuelve arriba. Lo que sí vuelve arriba es cada cambio de sección, porque `go()` hace `scrollTo(0)`.
- **Evidencia.** Medición del revisor en 360×640 (227/640 = 35 %); salida de `p10`: «alto cabecera+nav (px) 227». Capturas `ux/U8/33-360-aprende.png` («Aprendiz 🌱» en segunda línea), `ux/U8/34-360-quiz.png` (dos opciones visibles), `ux/U8-revision/mision-360-aprende.png`.
- **Por qué importa.** Es el teléfono de la alumna sin colegio privado, y cada sección arranca con un tercio de la pantalla de adorno.
- **Recomendación.** Por debajo de 400 px de ancho: una sola barra superior de 48 px (flecha, título de la misión, ⭐ XP) y las pestañas; el nivel «Aprendiz», el WhatsApp y la franja morada van al panel de logros o al pie. Comprobarlo en la sonda con 360×640: cabecera + nav ≤ 120 px en reposo.

### La entrada: la identidad y la lista de Misiones

**[U8-05] Identidad partida: la portada no lee el nombre que la misión guardó, y el grado del chip no llega al modal** — baja · incompleto · dias · impacto educativo 2/5 · impacto comercial 3/5

- **Qué pasa.** Valeria eligió «8º» en la portada (`METAS_GRADO_VISTA_V1`). La misión abre, la primera vez en ese teléfono, un modal que pide nombre, número de lista, escuela, «Grado y sección» otra vez y «Código de aula (te lo da tu maestro)». Escribe «Valeria Mejía, 8vo A», guarda, y al volver la portada sigue con «¡Hola, Estudiante!»; la Constancia también dice «Estudiante». Lo que la revisión corrigió: el código de aula NO bloquea guardar, y el modal NO sale en cada misión (solo si no hay identificación guardada ni se omitió en la sesión); en la prueba del revisor, con la identidad ya guardada, no apareció.
- **Evidencia.** `localStorage` tras guardar: `METAS_ALUMNO_V1 = {"nombre":"Valeria Mejía",…,"grado":"8vo A"}` (salida de `p12`). `js/app.js:109` (`s.name.trim() || 'Estudiante'`, sobre el estado propio `blank()` de `:72`); `js/metas-registro.js:524` (el modal precarga el grado solo desde `id.grado`, nunca desde `METAS_GRADO_VISTA_V1`), `:497-498` (texto del modal), `:508` (el rótulo del código de aula dice «te lo da tu maestro», sin «opcional»; el «(opcional)» de `:501` es del número de lista), `:855` (cuándo se abre). Capturas `ux/U8/06-mision-primera.png`, `ux/U8/20-portada-vuelta.png`.
- **Por qué importa.** Escribe su grado dos veces y su nombre no aparece en ningún sitio que ella vea. Es fricción de la primera vez, no abandono.
- **Recomendación.** Una sola identidad de alumno: la portada lee `METAS_ALUMNO_V1` para el saludo, la Constancia lee el nombre de ahí, y el modal precarga el grado del chip (y al revés). El código de aula, plegado bajo «¿Tienes código de tu maestro?»; el modal, de dos campos para quien estudia sola.

**[U8-09] En Misiones, los filtros ocupan la primera pantalla del teléfono barato, y el chip «Todos» queda cortado sin pista** — baja · sobrediseno · dias · impacto educativo 2/5 · impacto comercial 3/5

- **Qué pasa.** Buscador, fila «Mi grado», diez píldoras de materia en cinco filas (seis en 360) y la tarjeta «Rutas de Aprendizaje» van antes de la primera misión. En 393×873 la primera tarjeta empieza a 557 px y se ve una y media (el auditor había escrito 1 113 px; la revisión lo corrigió). En 360×640 empieza a 619 px: la alumna toca Misiones y ve solo botones. El chip «Todos» de «Mi grado» tiene su borde derecho a 439 px con un viewport de 393: `.grado-chips` esconde la barra de desplazamiento y no lleva sombras de extremo ni pista alguna de que se desliza —la regla que CLAUDE.md exige para la barra de secciones («hay que decir que se desliza»)—. Las píldoras de materia repiten las nueve puertas de la portada.
- **Evidencia.** `css/app.css:5424-5429` (`overflow-x:auto; scrollbar-width:none; ::-webkit-scrollbar{display:none}`). Capturas `ux/U8-revision/misiones-393.png`, `ux/U8-revision/misiones-360.png`, `ux/U8/31-360-misiones.png`; salida de `p10`: «360 primera tarjeta y= 619, chip Todos visible? false».
- **Por qué importa.** En 640 px de alto hay que deslizar una pantalla entera para descubrir que hay misiones; y «Todos» —el chip que devuelve el catálogo completo— no se sabe que existe.
- **Recomendación.** Píldoras de materia en UNA fila deslizable, como los chips de grado, con sombras de extremo en las dos filas; la tarjeta de Rutas fuera de la lista (ya tiene su puerta en la portada). Objetivo medible: primera tarjeta por debajo de 500 px en 393 y de 400 px en 360.

### La sensación de producto

**[U8-07] Portada y misión parecen dos productos: tipografías, paleta, tamaños y una tira de palabras detrás del título** — baja · deuda · semanas · impacto educativo 1/5 · impacto comercial 2/5

- **Qué pasa.** Portada: Outfit, azul sobre gris, párrafos de 12 px. Misión: Fredoka + Nunito, cabecera con degradado morado→azul sobre página verde menta, párrafos de 20 px, pestañas de 12 px. Detrás del título corre una tira animada de palabras al 15 % de opacidad («BOCA · ESÓFAGO · ESTÓMAGO · INTESTINO DELGADO…») que se cruza con el icono y el título. La transición portada→misión cambia todo el lenguaje visual de golpe, y cada misión trae otra paleta.
- **Evidencia.** `misiones/2y3ciclo-sistema-digestivo/css/sistema-digestivo.css:62` (`.hero::before`); salida de `p18-coherencia.js` (INDEX body Outfit, p 12 px; MISION body Nunito, h2 Fredoka 20 px, p 20 px). Capturas `ux/U8/01-portada.png` frente a `ux/U8/07-dig-tras-ahora-no.png`, `07-reinos-tras-ahora-no.png`, `07-sust-tras-ahora-no.png`; `ux/U8-revision/mision-360-aprende.png`.
- **Por qué importa.** La consecuencia para la tarea es nula: el título se lee por encima de la tira y nada se hace peor por el cambio de letra. Es deuda estética; Fredoka es «la cara de las misiones» a propósito. Lo que pesa es comercial y modesto: a una alumna de colegio privado le parece casero.
- **Recomendación.** Lo único barato: apagar la tira de `.hero::before` por debajo de 400 px (una regla CSS). Unificar tokens (letra de títulos y de texto, escala, radios, alto de cabecera) en un CSS común es un rediseño de 74 archivos, no un arreglo; va cuando se toque la cabecera por otra razón.

**[U8-08] Pie casero en las 74 misiones: nombres con guion bajo, Gmail personal y «Reiniciar XP» sin confirmación** — baja · eliminar · horas · impacto educativo 1/5 · impacto comercial 3/5

- **Qué pasa.** Al final de cada misión: «Desarrolladores: Josué E. Polanco_Evelyn Castellanos_Jael & Angelly Polanco», `josuepolancolemus2020@gmail.com`, la frase «Limita el uso del teléfono móvil solo como herramienta de aprendizaje de lo contrario puede ser perjudicial» y seis botones (Sonido, Tema, Logros, Letra, Reiniciar XP, Presentación). `resetXP` pone `xp = 0` sin confirmación; no toca `done` ni `unlockedAch`, así que borra la barra, no las secciones ni los logros.
- **Evidencia.** `grep -l josuepolancolemus2020@gmail.com misiones/*/*.html | wc -l` → 74; `grep -l "Reiniciar XP" misiones/*/*.html | wc -l` → 73. `sistema-digestivo.js:55` (`resetXP`). Captura `ux/U8/23-sugerencias.png` (pie visible bajo el diálogo), `ux/U8/24-reiniciar-xp.png`.
- **Por qué importa.** Para una alumna de 14 años es la firma de un proyecto escolar, no de un producto; y un botón que borra el XP a un toque vive al lado de Sonido y Tema.
- **Recomendación.** Pie de una línea: «M.E.T.A.S · policastsapien.com · Sugerencias», sin correo personal ni nombres con guion bajo (los créditos, en una página «Acerca de»). Sonido, Tema y Letra a Ajustes de la misión; «Reiniciar XP» detrás de una confirmación en esa pantalla. Guion sobre los 74 archivos.

## Qué sobra o debería eliminarse

- El pie de las 74 misiones tal como está: nombres con guion bajo, Gmail personal, la frase del teléfono y «Reiniciar XP» sin confirmación al lado de Sonido y Tema (U8-08; `grep` → 74 y 73).
- Los 35 XP por ABRIR la misión (`visitMission`, `js/app.js:2122`): es el único dato que Mi Progreso enseña y no mide nada (U8-03).
- El confeti y el logro al LLEGAR al final del quiz con cero aciertos, en 34 misiones (U8-01), y el confeti de `fin('s-evaluacion')` al generar la Evaluación (U8-11).
- Delante de la alumna que practica en el teléfono: el selector de 30 «Formas», el botón «Imprimir» y el aviso «solo para revisión en pantalla» (U8-11).
- «Cambiar alumno» y «Enviar resultados» en la Constancia cuando no hay `docente` ni `codigo_aula` (U8-04).
- En Widgets, «Ordena la secuencia» e «Identifica el Concepto», que ya existen como pestañas (`sistema-digestivo.html:360`, `:372`) (U8-12).
- La tira animada de palabras de `.hero::before` en el teléfono (`sistema-digestivo.css:62`) (U8-07).
- Las diez píldoras de materia de Misiones en cinco filas, que repiten las puertas de la portada, y la tarjeta de Rutas dentro de la lista (U8-09).
- La pista de ratón en la sopa —«🖱️ Arrastra o haz clic en la primera letra, luego en la última»— en 65 misiones (`grep -l` sobre `misiones/*/*.html`), cuando el uso real y la sonda de teclado son con el dedo (señalado por los revisores).

## Qué falta

- Un bloque «Nivel III ciclo» en las misiones que el mapa marca para 8º (enzimas, bilis, glándulas anexas, sistemas digestivos comparados), activado por el grado guardado; y en la tarjeta, qué cubre y qué falta (U8-02).
- Una nota del quiz al terminar («N de 9») y la condición de ≥ 70 % para la estrella y el logro; la misma condición para calificar la Evaluación en blanco (U8-01).
- Dos casos en `_dev/verifica-estrella-ganada.js`: quiz jugado mal → sin estrella ni logro; evaluación calificada en blanco → sin estrella (U8-01).
- El porqué de cada respuesta en el banco (`por`) y un «Repasar las que fallé» al final del quiz (U8-06).
- Una vista de «qué domino» por misión: secciones dominadas y pendientes con su última nota, y un solo XP entre misión y portada (U8-03).
- Un camino corto al abrir la misión: «Para tu examen en 20 min: Aprende → Quiz → Evaluación» (U8-12).
- Un modo «Practicar en el teléfono» en la Evaluación, separado del tablero del maestro (U8-11).
- Una sola identidad de alumno entre la portada, el modal y la Constancia (U8-05).
- Sombras de extremo en `.grado-chips`, para que se sepa que «Todos» está a la derecha (U8-09).
- Un mensaje de WhatsApp de la Constancia que diga «avanzó un N %» mientras N < 100 y lleve el nombre (U8-04).

### Señalado por los revisores, sin hallazgo propio

Cuatro cosas que los revisores echaron en falta; tres se fundieron en el hallazgo que amplían y una queda aquí como aviso:

- Calificar la Evaluación EN BLANCO da la estrella (`js/estrella-ganada.js:209`; reproducido: «Resultado automático: 0/100», `done=['s-evaluacion']`) — fundido en **U8-01**.
- El WhatsApp de la Constancia dice «completó» con 3 % y «Estudiante» con el nombre guardado (`sistema-digestivo.js:696`; `diplName` no lee `METAS_ALUMNO_V1`) — fundido en **U8-04**.
- El chip «Todos» queda fuera del ancho sin pista (`css/app.css:5429`; borde derecho a 439 px en 393) — fundido en **U8-09**.
- La pista de la sopa habla de ratón en 65 misiones — en «Qué sobra»; no se abrió hallazgo porque el recorrido de Valeria no jugó la sopa.

## Descartados en la revisión adversarial

Ninguno: los 12 hallazgos se reprodujeron. Lo que sí cambió, para que se vea qué se consideró:

| ID | título | qué cambió en la revisión |
|---|---|---|
| U8-03 | Mi Progreso y 🏅 no dicen qué domina | alta → **media**: contradicción real, pero no impide usar nada ni pierde datos |
| U8-05 | Identidad partida | media → **baja**: el código de aula es opcional y el modal sale una sola vez por teléfono, no «en cada misión»; queda el saludo y el grado del chip |
| U8-07 | Portada y misión parecen dos productos | media → **baja**, impacto comercial 4 → 2: el título se lee y ninguna tarea se hace peor |
| U8-09 | Los filtros de Misiones | media → **baja**: en 393×873 la primera tarjeta está a 557 px (se ve una y media), no a 1 113; el problema queda en 640 px de alto y en el chip «Todos» |
| U8-02 | Contenido de 4º para 8º | la recomendación de quitar el rótulo «Para 8º grado» era errónea: el DCNB de 8º sí incluye el tema; lo que falta es la profundidad |
| U8-08 | Pie casero | «Reiniciar XP» borra solo la barra de XP, no las secciones ni los logros |
| U8-10 | La cabecera en 360×640 | 227 px solo en reposo; al deslizar quedan 66 px; «desliza en cada pregunta» no es literal (sí en cada cambio de sección) |
| U8-11 | La Evaluación | la estrella ya no se da al generar (estrella-ganada funciona); lo que queda es el confeti de `fin` |
| U8-12 | Quince pestañas | son 14 pestañas más el botón Constancia; «seis son la misma actividad» es en parte apreciación |

## Cobertura y límites

- **Código auditado:** `main` en `d940fe0` (9 de septiembre de 2026), con las 20 modificaciones de `_dev/auditoria-2026-09/5-top-20.md` ya aplicadas —entre ellas la barra de secciones arriba y pegajosa, el quiz sin autoavance, las estrellas que se ganan (`js/estrella-ganada.js`), el buscador sin tildes, la lista de Misiones ordenada por el grado de la alumna (`js/grado-alumno.js`), el service worker que no borra lo guardado, el CDN fuera del camino crítico y el zoom desbloqueado—. Las reproducciones del revisor dicen `d7eb557`: son dos commits después, y solo tocan `_dev/auditoria-2026-09/` (`git diff --stat d940fe0..d7eb557`: 12 archivos, todos ahí), así que el producto es el mismo.
- **Una persona, una misión a fondo.** El Sistema Digestivo se recorrió entero (las 14 pestañas, el quiz mal y bien, la Evaluación generada, calificada en blanco y calificada, la Constancia, Sugerencias). Cinco Reinos y Los Sustantivos se abrieron hasta la primera pantalla tras «Ahora no» y para el tono. Las cifras de 34, 65, 73 y 74 misiones son lecturas de archivo con `grep`, no recorridos: el comportamiento en las otras 33 con el patrón del quiz se infiere del código, no se reprodujo.
- **Chromium emulando pantallas táctiles** (393×873 y 360×640), no teléfonos físicos; nada en iOS ni en el navegador de Android. El proxy del entorno bloquea el dominio del sitio: todo se midió contra `localhost:8123`.
- **Sin nube.** `supabase.co` abortado en todo el recorrido. Lo que necesita la nube —que los resultados lleguen a un maestro, que la sugerencia salga de la cola hacia F.A.R.O— se comprobó hasta la cola local (`METAS_SUG_OUTBOX_V1`) y no más allá. El envío por WhatsApp se juzgó por el texto que arma `shareWA`, no por mandarlo.
- **El nivel de lectura** (256 palabras, 14,1 por frase) lo midió el guion del auditor (`p4-mision-mapa.js`); el revisor no lo recalculó. **El DCNB** se consultó en el Markdown troceado de `_dev/dcnb/`, no en el PDF, que es el que acredita; las expectativas citadas de 8º se leyeron ahí.
- **No se probó:** Educación Media (no hay DCNB en el repositorio), los juegos 3D, los videos (YouTube bloqueado por el proxy), la evaluación impresa (solo la pantalla), «Guardar foto» de la Constancia, el Control de lectura, la sopa de letras, ni el lado del maestro que recibe los resultados.
