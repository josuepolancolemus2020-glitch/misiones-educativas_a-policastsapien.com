# Auditoría del chatbot de padres

> Auditoría multi-agente (14 jul 2026): 5 dimensiones en paralelo (lenguaje natural,
> cobertura de datos, flujo docente, UX del padre, seguridad) + crítico de completitud
> + síntesis. Objetivo del dueño: que el padre canalice TODA duda por el chat y no
> necesite preguntarle al maestro ni ir a administración.

## Diagnóstico en una página

**Lo que ya funciona bien.** La tubería técnica maestro→nube→bot es sólida: sync diferencial offline-first por clave de familia (`registros-admin.js:1583-1701`), dos RPC de lectura (`metas_consultar_plan_padre`, `metas_consultar_admin_padre`) y un bot de reglas sin costo que hoy responde con solvencia el núcleo académico: notas por evaluación con mensaje del maestro, notas finales por parcial/materia, conducta S/MB/B, faltas, y colaboraciones pago/pendiente (`padres.html:373-636`). La conversación es cálida, con chips, caché de datos offline y clave que se guarda sola.

**Lo que cojea.** Tres cosas:

1. **El bot no entiende cómo escriben los padres.** En una simulación de 25 preguntas reales, 12 caen en «No entendí» (48%) y 3 se enrutan mal. Causa raíz: `norm()` (`padres.html:179-183`) solo quita tildes; no hay expansión de chat-speak («q», «xq», «devo», «ba», «ijo») ni sinónimos naturales. La regex de economía (`padres.html:688`) no reconoce «pago», «debe» ni «deuda» — justo el vocabulario del objetivo número 1. «Cuánto le debo al maestro» responde quién es el maestro (`padres.html:696`).

2. **No existe la ventana del maestro.** Todo lo que sube a la nube es una fila por alumno atada a un registro; el CHECK de `registro_admin` solo admite `asistencia|nota_final|economia` (`SUPABASE-REGISTROS-ADMIN.sql:27`). No hay dónde publicar «reunión el viernes», «traer L 20», la lista de útiles ni el horario de salida. Peor: hay datos que el maestro **ya captura y no se publican** — gastos y saldo de colectas (`registros-admin.js:776-785` vs `1617-1626`) y fechas de parciales (`registros-admin.js:1267-1268`).

3. **El bot afirma con confianza cosas que no sabe.** «¡Asistencia al día!» cuando el maestro simplemente no ha publicado (`padres.html:545-548`), errores de servidor disfrazados de «clave equivocada» (`padres.html:317-321, 349-353`), y ninguna fecha de corte visible en línea. La RPC ya devuelve `actualizado_en` (`SUPABASE-REGISTROS-ADMIN.sql:101`) y no se usa.

**La brecha frente al objetivo.** De 15 preguntas típicas de un padre hondureño, hoy el bot responde ~6. Otras 3 se resuelven con datos que ya existen (conducta, gastos de colecta, fechas de parciales) y 6 requieren el canal de avisos/FAQ que no existe. Varias respuestas actuales terminan en «pregunte al maestro» (`padres.html:405, 483, 698`), exactamente lo que se quiere evitar. Además hay dos riesgos que ninguna dimensión cubría y que hay que atender antes de noviembre: el **ciclo de vida anual** (los `evento_id` no llevan año — `registros-admin.js:1594, 1610` — y al reciclar el grupo las notas nuevas sobreescriben las viejas, y una lista reordenada le muestra al padre datos de OTRO niño) y la **seguridad de la clave** (RPC anónimas sin rate limit con claves enumerables por script; sin forma de revocar una clave robada).

---

## Hallazgos por dimensión

| # | Hallazgo | Severidad | Evidencia |
|---|---|---|---|
| **Lenguaje natural** | | | |
| 1 | 48% de preguntas reales caen en «No entendí»; cero tolerancia a typos y abreviaturas (q, xq, k, devo, ba) | Alta | `padres.html:179-183, 672-729` |
| 2 | Economía no reconoce pago/debe/deuda/dinero/pisto; «le debo al maestro» se desvía a respMaestro | Alta | `padres.html:688, 696` |
| 3 | Sin intents para reunión/avisos/horarios/materiales/tareas | Alta | `padres.html:672-729` |
| 4 | Conducta: los datos llegan pero ninguna palabra clave los dispara; la letra S/MB/B no se explica | Media | `padres.html:597-603, 686-696`; `registros-admin.js:28-30` |
| 5 | «porque saco nsp» colisiona con la subcadena «que saco»; «aplazó» (hondureñismo) no existe | Media | `padres.html:690, 693, 697` |
| 6 | Reporte de ausencia del padre se interpreta como consulta de faltas | Media | `padres.html:686` |
| 7 | Fallback de materia consulta la nube antes de decir «No entendí» (datos gastados + mensajes contradictorios) | Baja | `padres.html:717-721, 519-523` |
| **Cobertura de datos** | | | |
| 8 | Ningún canal de avisos del grupo (hueco número 1 del objetivo) | Alta | `SUPABASE-REGISTROS-ADMIN.sql:27`; `registros-admin.js:1583-1629` |
| 9 | Gastos/saldo de colectas se capturan pero no se publican (sin rendición de cuentas) | Alta | `registros-admin.js:628, 776-785` vs `1617-1626` |
| 10 | Fechas de parciales ya guardadas (`boleta.parcialFechas`) pero no llegan al bot | Media | `registros-admin.js:1267-1268` |
| 11 | `limit 150` puede truncar faltas a fin de año → «asistencia al día» falso | Baja→Alta a fin de año | `SUPABASE-REGISTROS-ADMIN.sql:110-111` |
| 12 | «pendiente» siempre desvía a economía; la escuela no viaja (maestros con 2 colegios) | Baja | `padres.html:688`; `registros-admin.js:1587` |
| **Flujo docente** | | | |
| 13 | Editar un mensaje en Plan de Acción no lo publica (sin debounce de sync) | Media | `plan-accion.js:546-556, 1011, 1097-1098` |
| 14 | Estado de nube solo visible en la pestaña Alumnos; en SACE/Economía se publica a ciegas | Baja | `registros-admin.js:307-313` |
| 15 | Sin indicador de lectura («visto por X familias») | Baja | `padres.html:317-331` |
| **UX del padre** | | | |
| 16 | La tira obliga a teclear 38 caracteres de URL; sin QR ni enlace | Alta | `plan-accion.js:924`; `registros-admin.js:507, 606` |
| 17 | padres.html no es PWA: sin manifest ni service worker, la página no abre sin señal | Alta | `padres.html:13-14`; `sw.js`; cf. `index.html:8, 986-988` |
| 18 | Solo un hijo por teléfono (clave y caché únicos); caso común en Honduras | Alta | `padres.html:213-216, 646-651` |
| 19 | Sin fecha de corte en línea ni umbral de obsolescencia; errores 500 culpan a la clave | Alta | `padres.html:290-294, 317-321, 545-548` |
| 20 | Zoom bloqueado (`user-scalable=no`); barrera para abuelos | Media | `padres.html:5` |
| 21 | Sin resumen de novedades al volver otro día (el caché ya tiene lo necesario para el diff) | Media | `padres.html:213-215, 743-766` |
| **Transversales (detectados en la crítica)** | | | |
| 22 | Ciclo anual: `evento_id` sin año; reciclar grupo = sobreescritura y posible fuga de datos a otra familia | Alta | `registros-admin.js:1589, 1594, 1610` |
| 23 | Claves enumerables por script, RPC sin rate limit, sin revocación por familia, clave en localStorage sin PIN | Alta | `SUPABASE-REGISTROS-ADMIN.sql:96-114`; `plan-accion.js:831` |
| 24 | Las preguntas «No entendí» se pierden: sin telemetría ni buzón padre→maestro | Media | `padres.html:723-728` |
| 25 | Sin recuperación si el padre cambia de teléfono o pierde la tira (conecta con el pendiente «respaldo de claves en nube») | Media | `padres.html:204-216` |

---

## La ventana del maestro (diseño recomendado)

Las cuatro auditorías propusieron lo mismo con nombres distintos; esta es la fusión, tomando como base el diseño de tabla separada (evita el `limit 150` y el CHECK de `registro_admin` — meter avisos ahí aceleraría el truncamiento de faltas que la propia auditoría denunció).

**Dónde vive en la UI.** Quinto tab «Comunicados» en `renderAdmin` (`js/tools/registros-admin.js:217-222`), dentro de Mi aula, porque ahí ya están el grupo activo, la lista y las claves de familia. Cinco tipos: aviso general, aviso individual, evento con fecha (reunión/examen/acto cívico), lista de materiales, y FAQ (la «ficha del aula»: horario y hora de salida, uniforme, útiles del año, matrícula/traslado, horario de atención, cómo reponer un NSP).

**Modelo local** (nueva llave, coherente con el repo):

```json
METAS_AVISOS_V1 = { "v":1, "grupos": { "<gid>": {
  "avisos": [{ "id":"AV<ts36>", "tipo":"aviso|evento|material|individual",
    "prioridad":"urgente|normal", "titulo":"", "texto":"",
    "fechaEvento":"YYYY-MM-DD|null", "hasta":"YYYY-MM-DD",
    "alumnos":null, "mod":"ISO" }],
  "faqs": [{ "id":"", "pregunta":"", "claves":"palabras clave",
    "respuesta":"", "activa":true }]
} } }
```

**Gobernanza obligatoria** (faltaba en las 4 propuestas): `hasta` con vencimiento obligatorio (por defecto 14 días), tope de 10 avisos activos por grupo, y campo `prioridad` para que el bot ordene urgente primero. Sin esto el canal se satura y el padre deja de leerlo.

**Nube: `SUPABASE-AVISOS.sql` nuevo, sin tocar `registro_admin`.** Tabla `mensajes_docente(evento_id unique, codigo, subtipo, titulo, texto, pregunta, fecha_evento, vigente_hasta, grado, seccion, docente, anio_lectivo, actualizado_en)` con RLS, más dos RPC al estilo de las existentes: `metas_guardar_avisos(filas jsonb)` (upsert por `evento_id`, tope 300) y `metas_consultar_avisos_padre(p_codigo)` filtrando `vigente_hasta >= current_date`. La app hace fan-out por clave de familia (`evento_id 'AVI-<id>-<clave>'`), reutilizando intacto el patrón diferencial de `adFilasNube`/firmas (`registros-admin.js:1583-1642`) con su propia llave `METAS_AVISOS_SB_V1`. Cada guardado llama `adSyncProgramar()` para heredar el auto-publish de 4 s.

**Plantillas de 1 toque** (fila de botones que abren `metasPrompt` prellenado, patrón de `metas-dialogos.js`): «Mañana no hay clases», «Reunión de padres» (pide día/hora), «Traer materiales», «Recordatorio de aporte» (se prellena con la colecta activa de `d.colectas`, `registros-admin.js:671-675`). Dos toques = aviso publicado.

**Automáticos, sin captura nueva:** al sincronizar, emitir como eventos los rangos de `d.boleta.parcialFechas` («Parcial II del X al Y», `registros-admin.js:1267-1268`) y por cada colecta una fila de rendición de cuentas: recaudado / gastado (con detalle) / saldo — el informe con firmas ya lo calcula todo (`registros-admin.js:628, 831-833`).

**Consumo en el bot** (`padres.html`): tercer `pide()` en el `Promise.all` de `consultar()` (317-331), guardado también en el caché offline. Intents nuevos: `/aviso|comunicado|reunion|junta|evento|acto/` → respAvisos (próximos por fecha), `/material|utiles|traer|llevar/` → respMateriales, `/horario|hora de salida|entrada/`, `/uniforme/`, `/matricul|traslado/`, `/reponer|reposicion/` → respuestas de la ficha FAQ. Matching de FAQ **antes** del fallback: solapamiento de ≥2 palabras de ≥4 letras entre la pregunta del padre y `norm(pregunta+claves)`. Chip «Avisos» en `CHIPS_MENU` (265-268), nudge «Tiene N avisos del maestro» en respResumen, y respMaestro (473-485) ofrece Avisos en vez del callejón «búsquelo en horario de atención». Las respuestas NSP (698) y horario de atención (483) pasan a usar la ficha en lugar del genérico «pregunte al maestro».

---

## Plan priorizado

### Fase 1 — Una o dos tardes: que el bot entienda y no mienta (máxima reducción de preguntas por lempira)

| Ítem | Archivo | Impacto / Esfuerzo |
|---|---|---|
| 1. Función `expand(t)` tras `norm()`: diccionario q/k→que, xq/pq→porque, devo→debo, ba→va, ijo→hijo, ay→hay, tmb, dnd… (~20 líneas). Arregla de golpe la mitad de los fallos | `padres.html:179, 676` | Alto / Bajo |
| 2. Una sola revisión de la regla de economía (688): `+ pago|pagar|pague|debo|debe|deuda|dinero|pisto|lempira|cobr` y `/cuanto (debo|debe|es|hay que pagar)/` — **no** «cuanto» suelto, porque rompería «cuánto sacó» (regla 690, que hoy funciona). Quitar «pendiente» ambiguo o anteponer chequeo `/tarea/` | `padres.html:688` | Alto / Bajo |
| 3. Intent de conducta (fusionado): `/conducta|comporta|se porta|disciplin|puntualidad/` **antes** de la regla «notas» → respConducta() extraída de respFinales (597-603), con la escala traducida copiando `AD_PERS_SIGNIF` («S = Sobresaliente…») + chip | `padres.html:686-692`; mapa de `registros-admin.js:28-30` | Alto / Bajo |
| 4. Afinar colisiones: `\bque saco\b` en la regla 690 (para que «porque sacó NSP» llegue a la explicación); aprobó += `aproband|aplaz` y «pasa **de grado** / va a pasar **el año**» con contexto (nunca `\bpasa\b` suelto: capturaría «¿qué pasa si falta?») | `padres.html:690, 693` | Medio / Bajo |
| 5. Sello de frescura sin SQL nuevo: usar `max(actualizado_en)` que la RPC **ya devuelve** en cada respuesta («Datos del maestro al 14/07»); si supera ~21 días, aviso de obsolescencia: «El maestro no actualiza desde el DD/MM; confirme en la escuela». Cambiar «¡asistencia al día!» por «No tengo faltas registradas hasta el [fecha]». Distinguir error de servidor de vacío (revisar `r.ok`) para no culpar a la clave | `padres.html:290-294, 317-321, 545-548, 617-619` | Alto / Bajo |
| 6. Fallback útil + telemetría: menú numerado 1-8 (aceptar «1»…«8»), pistas parciales («pag», «falt» → chip sugerido), y guardar cada pregunta no entendida en localStorage (`METAS_PADRE_NOENT_V1`) — la materia prima para saber qué FAQ crear, sin adivinar | `padres.html:723-728` | Medio / Bajo |
| 7. Micro-arreglos: comprobar `materiaEn()` antes de `respMateria` en el reintento (evita fetch + «consultando…» seguido de «No entendí»); quitar `user-scalable=no` del viewport; renombrar chips «Colaboraciones»→«Pagos y colectas», «Notas finales»→«Boleta del parcial», fila deslizable | `padres.html:717-721, 5, 100-104, 265-268` | Medio / Bajo |

### Fase 2 — 1-2 semanas: la ventana del maestro y el recorrido del padre

| Ítem | Archivo | Impacto / Esfuerzo |
|---|---|---|
| 8. Pestaña Comunicados completa (diseño de la sección anterior): tab + SQL nuevo + fan-out + plantillas + intents + FAQ + parciales y colectas automáticos | `registros-admin.js:217-222`; `SUPABASE-AVISOS.sql` (nuevo); `padres.html` | Alto / Medio |
| 9. QR en las tres tiras: la URL es la misma para todos — basta **un PNG estático** `img/qr-padres.png` en el repo, sin CDN. Texto: «Apunte la cámara a este cuadro» | `plan-accion.js:897-929`; `registros-admin.js:~500, 588-610` | Alto / Bajo |
| 10. PWA de padres: `manifest-padres.json` («Notas de mi hijo/a», standalone) + `padres.html` en el precache de `sw.js` + registro del SW + mensaje «Agregar a pantalla de inicio» tras la primera consulta | `padres.html:13`; `sw.js` | Alto / Medio |
| 11. Multi-hijo (fusionado): `cfg.codigos=[{codigo,alias}]` migrando `cfg.codigo`, **caché indexado por código** (conserva el respaldo offline de cada hijo), chip «Cambiar de hijo», conmutación por alias en el texto. Nota: también resuelve al niño con dos maestros (dos claves del mismo hijo con alias «inglés») | `padres.html:204-216, 646-669` | Alto / Medio |
| 12. Confirmación de identidad al guardar clave («alumno número 15 de 4º A, maestro J. Polanco — ¿es su hijo/a?») + pistas de casi-clave («nunca usamos 0, 1, I, L, O») | `padres.html:653-669, 219-222` | Medio / Bajo |
| 13. Resumen proactivo al volver: diff contra el caché anterior → «Desde su última visita: 1 nota nueva en Español, 1 falta, 2 avisos» | `padres.html:743-766` | Alto / Medio |
| 14. Fricción docente: debounce de sync al editar mensaje en Plan de Acción (mismo patrón que `adSyncProgramar`); chip de estado de nube visible junto a los tabs de Mi aula; subir el `limit 150` a 400 o priorizar tipos en la RPC | `plan-accion.js:546-556`; `registros-admin.js:212-223`; `SUPABASE-REGISTROS-ADMIN.sql:110-111` | Medio / Bajo |

### Fase 3 — Antes de noviembre: robustez y cierre del círculo

| Ítem | Archivo | Impacto / Esfuerzo |
|---|---|---|
| 15. **Ciclo de vida anual** (crítico, ya anotado en pendientes): columna `anio_lectivo` en `registro_admin` y en los `evento_id` (`ADA-2026-…`), flujo «Cerrar el año» en Mi aula que archiva/limpia la nube y **regenera las claves de familia** — evita que la clave del niño 15 del año pasado muestre al niño 15 nuevo | `registros-admin.js:1589-1610`; `SUPABASE-REGISTROS-ADMIN.sql` | Alto / Medio |
| 16. **Seguridad de la clave**: rate limit simple en las RPC (tabla de intentos por IP/hora), botón «Regenerar clave de esta familia» en el chip de clave de Mi aula, y respaldo de claves en la nube (pendiente ya anotado) para recuperación si el padre pierde tira o teléfono | `SUPABASE-*.sql`; `registros-admin.js` (chip clave) | Alto / Medio |
| 17. **Buzón padre→maestro**: RPC de escritura acotada `metas_mensaje_padre(p_codigo, p_texto)` (tope de largo y de mensajes/día); toda pregunta sin respuesta ofrece «¿Se la dejo anotada al maestro?»; incluye el reporte de ausencia con excusa (detectar el patrón de reporte **antes** de la regla de faltas) y bandeja en Comunicados | SQL nuevo; `padres.html:686, 723-728`; `registros-admin.js` | Alto / Medio |
| 18. «Visto por N de M familias» por aviso (tabla `aviso_visto` + RPC fire-and-forget) — le da al maestro la confianza de que el chat sustituye la nota en el cuaderno | `SUPABASE-AVISOS.sql`; `padres.html` | Medio / Medio |
| 19. Accesibilidad: botón «escuchar» por burbuja con `speechSynthesis` del navegador (gratis, local, sin IA) y modo de respuestas cortas para padres que leen con dificultad | `padres.html` | Medio / Bajo |

**Descartado por inviable:** avisos dentro de `registro_admin` (choca con el limit 150 y con cómo `respFinales`/`respEconomia` interpretan `estado`); fila «meta» para la fecha de corte (el CHECK la rechaza y `actualizado_en` ya viene); enlace wa.me al número del maestro (no existe el campo y contradice el objetivo de contención); «cuanto» y «pasa/paso» como tokens sueltos (romperían casos que hoy funcionan).

---

## Preguntas de padres: antes y después

| Pregunta natural | Hoy | Con las mejoras |
|---|---|---|
| «q debe mi ijo» | «No entendí» | «Tiene 1 aporte pendiente: Rifa escolar, L 20. Datos del maestro al 14/07.» |
| «cuanto le debo al maestro» | Responde quién es el docente | Lista de colaboraciones pendientes con montos y total |
| «como se porta en clase» | «No entendí» (el dato ya llega) | «Conducta del parcial II: Puntualidad MB, Espíritu de trabajo S… (S = Sobresaliente, MB = Muy Bueno, B = Bueno)» |
| «cuando es la reunion» | «No entendí» | «Reunión de padres: viernes 18/07, 3:00 pm en el aula.» (evento de Comunicados) |
| «q lleva mañana» | «No entendí» | «Aviso del maestro (12/07): traer regla y colores para Matemáticas.» |
| «porque saco nsp» | Responde la última nota (colisión «que saco») | «NSP = No Se Presentó. Para reponerla: [texto de la ficha del aula]. Fecha de reposición: …» |
| «como ba mi ijo» | «No entendí» («ba» rompe la regla) | Resumen de avance con promedio y última nota |
| «el niño falto ayer xq estaba enfermo» | Responde con el historial de faltas | «Entiendo. ¿Le dejo anotada la excusa al maestro?» (fase 3: queda en su bandeja de Mi aula) |
| «en que se gasto el dinero de la colecta» | Nada (dato capturado pero no publicado) | «Cuentas claras — Rifa: recaudado L 600, gastado L 450 (pelotas L 300, trofeos L 150), saldo L 150.» |
| «a q hora sale» | «No entendí» | «Horario: entrada 7:00 am, salida 12:30 pm.» (ficha del aula, se escribe una sola vez) |

Con la Fase 1, esas 25 preguntas simuladas pasan de 10 entendidas a ~19; con la Fase 2 (ventana del maestro), las 6 preguntas de logística que hoy obligan a ir a la escuela quedan dentro del chat, que es exactamente el objetivo.
