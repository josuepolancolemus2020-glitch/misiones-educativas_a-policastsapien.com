# Auditoría técnica (III-b): integridad de datos y sincronización sin conexión, y compatibilidad móvil, PWA y Android

Dos lentes (T11 integridad de datos y sincronización sin conexión; T7 compatibilidad móvil,
PWA y Android), 24 hallazgos levantados, **23 confirmados** por un revisor adversarial que
reabrió el código de hoy y volvió a correr las reproducciones, 1 descartado. Los tres críticos
pasaron además por una segunda verificación independiente. La lente T6 (accesibilidad) tiene su
propia sección (`1c-tecnica-acceso.md`) y no se repite aquí.

Todo se juzgó contra `main` en `d940fe0` (9 de septiembre de 2026), con las 20 modificaciones
de `5-top-20-septiembre-6.md` ya aplicadas: entre ellas la fusión dato por dato entre equipos
(`js/metas-fusion-aula.js`) y el service worker con dos cachés (`sw.js`, `CACHE_NAME` v197 +
`CACHE_DATOS`). Las reproducciones de T11 se hicieron con una nube simulada compartida entre dos
contextos de Playwright (`scratchpad/tecnica-acceso/T11/nube-falsa.js`); las de T7 con un
espejo del repositorio en otro puerto para publicar «versiones» con la red retrasada
(`scratchpad/tecnica-acceso/T7/sonda-sw.js`, `T7-revision/sonda-sw-rev.js`).

## Resumen

**La fusión que entró hoy resuelve el caso para el que se escribió —asistencia en el teléfono, nota en la PC— y deja tres puertas por las que el maestro sigue perdiendo datos, o los recibe en el niño equivocado.** «Cerrar sesión» borra el aula sin esperar a que la subida llegue y dice «a salvo en tu nube» aunque no haya salido nada (T11-01). La guarda `rp*2 < lp` convierte todo borrado grande —eliminar un grupo, «Empezar de nuevo», **Cerrar el año**— en algo que el otro equipo deshace solo, y con Cerrar el año devuelve además las claves de familia caducadas (T11-02). Y como la fusión empareja alumnos por número de lista, insertar un alumno «en su lugar» corre los números y la falta, la nota o el pago del otro equipo caen en otro niño, sin ruido, hasta el informe que firma la madre (T11-03). Los tres están reproducidos con la función real y ninguna sonda los cubre.

Alrededor, la sincronización cuesta más de lo que debería y se calla cuando falla: baja el aula entera cada 20 s (86 MB/hora con tres grupos), guarda hasta siete copias en un almacén de 5 MB y traga cada `setItem` fallido, no tiene exportación a archivo, y su ✅ no sabe cuándo habló con la nube por última vez. Del lado del alumno, la lectura de la misión y el quiz del video nunca llegan al maestro, y el resultado depende de cómo el niño escribe «sexto 1».

En móvil la maquetación está limpia; lo que falla es la entrega: ninguna de las 75 misiones registra el service worker, así que quien llega por el QR o por WhatsApp nunca la tiene sin internet (T7-03); publicar con la señal del aula mezcla el HTML nuevo con el `app.js` viejo sin aviso (T7-01); la portada baja 3,3 MB y 28 scripts sin `defer` para cada alumno (T7-04); y el APK que el manual recomienda lleva 101 commits congelado con el sincronizador que perdía asistencia (T7-05).

Lo que está bien, y es verdad: la fusión de tres versiones con base tiene prueba propia y funciona; la cola del alumno deduplica por `evento_id` y usa `keepalive`; el candado de propiedad impide sembrar el aula en la nube de otra cuenta. En 35 combinaciones página×medida no hay un desborde ni un botón fuera de pantalla; un Chrome 90 en un Android de 80 USD usa todo el sitio; y el proyecto Android es publicable (targetSdk 36 / minSdk 24, un permiso) en cuanto `www/` se reconstruya.

## Hallazgos por tema

### Datos del maestro: lo que se pierde o cae en el niño equivocado (T11)

**[T11-01] «Cerrar sesión» borra el aula del equipo aunque la subida no haya llegado, y la pantalla dice que está a salvo** — crítica · error · horas · impacto educativo 4/5 · impacto comercial 5/5

Qué pasa. `dsLogout()` lanza `push(false)` sin esperar la respuesta y llama a `dsWipeLocal()`
en la línea siguiente; con `navigator.onLine === false` ni siquiera intenta subir (`push`
devuelve `false` antes del `fetch`). `dsWipeLocal` borra también `META`, `BASE` y `RESPALDO`,
así que no queda rastro de qué estaba pendiente. El diálogo previo promete «todo está guardado
en la nube de tu cuenta» y el toast final dice «datos del aula a salvo en tu nube», sin mirar
si hay cambios sin subir; la tarjeta de encima del botón dice «✅ Tus datos se guardan y
sincronizan solos» con texto fijo.

Evidencia. `js/metas-docente-sync.js:746-749` (dsLogout), `:703-709` (dsWipeLocal), `:228-229`
(push sin red); `js/app.js:2044` (confirm), `:2054` (toast), `:1684` (tarjeta fija).
Reproducido dos veces: (a) señal que se traga paquetes, `onLine=true`, RPC `guardar` abortada
(`scratchpad/tecnica-acceso/T11/escenarios2.js`): tras `docenteCerrarSesion()` quedan solo
`{METAS_STATS_NUBE_V1, METAS_ADMIN_UNDO_V1}`, la nube NO tiene la asistencia del 9 y el toast
dice «a salvo»; (b) equipo sin internet (`criticos/T11-01-offline.js`): `guardar` llamado 0
veces, `localStorage` queda `[]`, mismo toast. Con buena señal el vigía sube pendientes en ≤12 s
(`:682-690`, `:402-405`), así que la ventana es corta; sin señal es el trabajo del día entero.

Por qué importa. Cerrar sesión existe precisamente para el equipo compartido —la PC de la
dirección, el teléfono prestado—, que en un pueblo está sin señal o con señal que cuelga. Un día
de asistencia son 43 nombres que no se reconstruyen. `app.js` frena por `onLine` con toast en
más de diez acciones (entrar, crear cuenta, cambiar clave…) y no en la única que destruye datos
locales; la fusión se escribió para «que no se pierda una asistencia» y el logout la tira por
otra puerta. Y como `METAS_ADMIN_UNDO_V1` sobrevive (T11-11), la única copia que queda es la foto
de «Deshacer un accidente», que solo existe si ese día el maestro borró algo.

Recomendación. Hacer `dsLogout` asíncrono con plazo: esperar el push; si hay pendientes y no
confirma, NO borrar y decirlo («Tienes N cambios sin subir —la asistencia de hoy—. Conéctate e
inténtalo de nuevo, o cierra sin borrar el aula de este equipo»), con «Guardar copia en archivo»
ahí mismo (T11-06). Añadir el caso a `_dev/verifica-fusion-sync.js`.

**[T11-02] La guarda anti-pérdida revierte los borrados legítimos y deshace «Empezar de nuevo» y «Cerrar el año» desde cualquier otro equipo** — crítica · error · días · impacto educativo 3/5 · impacto comercial 4/5

Qué pasa. En `pull()`, si la copia de la nube pesa menos de la mitad que la local
(`!force && lp >= 300 && rp * 2 < lp`) se conserva lo local, se le pone versión
`max(remota, local, ahora)+1` y se marca pendiente para re-subir. Se evalúa ANTES de mirar si
este equipo tiene pendientes y sin mirar la base ni la versión: contradice la normativa del
mismo día («un equipo sin cambios pendientes SIEMPRE baja lo de la nube») y el comentario de las
líneas 322-327. Resultado: eliminar un grupo, quitar más de la mitad de una lista, «Empezar de
nuevo» (que deja `raw:null`, exactamente lo que hace `metas_docente_reset`) y **Cerrar el año**
se deshacen en cuanto el otro equipo sincroniza, sin tocar nada. «Imponer la copia de ESTE
equipo» no sirve: la guarda no mira la versión. El único escape (cerrar sesión en el teléfono
antes) no está escrito en ningún sitio.

Evidencia. `js/metas-docente-sync.js:287-292`; `SUPABASE-DOCENTE-PAPELERA.sql:58-61`; el
diálogo de reset (`sync.js:473`) promete «También se borran de la nube y de tus otros equipos».
Reproducido con `scratchpad/tecnica-acceso/T11/escenarios.js` y `s2b.js`: S1 PC borra el grupo
de 43 y deja el de 20 → la nube vuelve a `GA:43,GB:20` y la PC recupera el grupo (true); S1b
borrar 30 de 43 → vuelven los 43; S2 reset → el teléfono re-sube `GA:43` y la PC que borró los
recibe de vuelta. Y con 🎓 Cerrar el año (`registros-admin.js:4992-5100`,
`criticos/t11-02-cerrar-anio.js`): peso 170 374 → 68 818 con grupo nuevo (dispara la guarda); el
teléfono al día devuelve a la nube los 43 alumnos viejos, 130 días de asistencia, 4 parciales,
la boleta 2026 y `METAS_CODIGOS_V1` con las claves de familia viejas (`1ABCD` en vez de borradas).
`grep` de `rp * 2`, reset o borrar grupo en `_dev/*.js` → 0: ninguna sonda lo cubre.

Por qué importa. Cerrar el año existe para que la clave del niño #15 del año pasado no abra los
datos del #15 nuevo; con esto las tiras del año pasado vuelven a valer en cuanto el maestro
publique algo del grupo nuevo. Y el maestro que «cerró el año» ve volver el año viejo y deja de
fiarse del espejo. Lo que la guarda protegía ya lo cubren `scanLocal` (lo visto por primera vez
no se sube), la fusión con base y la red «no menos de la mitad» de la línea 309.

Recomendación. Aplicar la guarda solo cuando este equipo SÍ tiene pendientes y la base local no
coincide con lo local; un valor más nuevo que coincide con lo que la base ya reconocía como
borrado es un borrado. Para el reset, una marca explícita en la fila («vaciado el <fecha>») que
los equipos respeten. Sonda con los tres casos (borrar grupo, cerrar año con grupo nuevo, reset)
en `verifica-fusion-sync.js`.

**[T11-03] La fusión empareja alumnos por número de lista, pero insertar un alumno corre los números: asistencia, notas y pagos del otro equipo caen en el niño equivocado** — crítica · error · semanas (mitigación en días) · impacto educativo 5/5 · impacto comercial 4/5

Qué pasa. `metas-fusion-aula.js` usa `num` como identidad del alumno (`LLAVES = ['id','f','num',
…]`) y `aus`, `notas`, pagos y lectura van indexados por ese número. «Alumno nuevo en su lugar»
(`adShiftNums` + `adInsertarAlumno`) renumera lista, asistencia, notas, colectas, lectura y
claves, y no comprueba antes si hay pendientes ni si la nube está al día. Si mientras tanto el
teléfono, sin señal, pasó lista o puso una nota con la numeración vieja, la fusión pega ese dato
al número —que ahora es otro niño— y la copia fusionada sube ganando versión a los dos equipos.

Evidencia. `js/metas-fusion-aula.js:58`; `js/tools/registros-admin.js:1047-1100`;
`js/metas-docente-sync.js:305-318` (la fusionada sube). Reproducido con la propia
`MetasFusion.fusionar` (`scratchpad/tecnica-acceso/T11/fusion-num.js`): base de 4 alumnos; la
PC inserta «Beto» como #2; el teléfono anota falta de Sara (#3) y nota 75 de Luis (#2) → «la
falta del 9/9 queda en #3 = Luis», «la nota 75 de Matemáticas queda en #2 = Beto».
`criticos/T11-03-nombre-y-pago.js`: un pago de L 250 anotado a Sara cae en Luis; y si el
teléfono además corrigió el apellido de Sara con el reloj adelantado, la lista fusionada queda
«2:Beto 3:Sara Mejía 4:Sara 5:Tomás»: Luis desaparece y Sara sale dos veces.
`_dev/prueba-fusion-aula.js` no tiene ningún caso de renumeración.

Por qué importa. Antes de hoy el mismo choque perdía la asistencia (visible, recuperable); ahora
la nota o el pago caen en otro niño (invisible, firmado por la familia). La frecuencia es baja
—traslados a mitad de curso, con el otro equipo con algo sin subir—, pero el teléfono del aula
sin señal todo el día es exactamente ese equipo.

Recomendación. Un `id` estable por alumno (el grupo ya lo tiene) y llevar asistencia, notas,
pagos y lectura por ese id; `num` pasa a ser un atributo mostrable. Mientras tanto, en días: si
el mapa `num→nombre` cambió entre la base y uno de los lados, `fusionar()` devuelve `null` (se
cae a «gana la más nueva» con respaldo y aviso); y `adInsertarAlumno` exige estar sincronizado
(sin pendientes y con la nube recién leída).

### La sincronización: coste, almacén y lo que la pantalla dice (T11)

**[T11-04] La app baja el aula entera de la nube cada 20 segundos mientras está abierta, y cada lectura fallida la sube entera** — alta · sobrediseño · días · impacto educativo 2/5 · impacto comercial 5/5

Qué pasa. El latido llama a `autoSync` cada 20 s con la pestaña visible (`AUTO_MIN = 15000`) y
`metas_docente_estado_leer` devuelve TODAS las filas con su `valor` completo, sin versiones ni
condicionales; el vigía además hashea todas las claves cada 8 s. Y cuando la lectura falla
rápido (5xx, DNS), `pull()` resuelve `{ok:false, cloudKeys: new Set()}`, `sync()` pasa ese Set
vacío a `push()`, y `semilla = !cloudKeys.has(k)` es `true` para todas las claves: cada fallo
de lectura provoca además una subida de hasta 1,5 MB, y `syncNow` dice «✅ Todo al día».

Evidencia. `js/metas-docente-sync.js:65`, `:682-693`, `:259-267`, `:223`, `:334-336`, `:386`,
`:445`; `SUPABASE-DOCENTE-ESTADO.sql:89-102`; `sw.js:207` no cachea POST, así que cada lectura
viaja. Medido con `scratchpad/tecnica-acceso/T11/trafico.js` (`out-trafico.txt`): aula de 3
grupos (373 KB), equipo quieto, 90 s → 5 lecturas, 2 202 KB, intervalos 20-20-20-20 s → 86
MB/hora. Con 12 grupos (1 492 KB, `tamano.js`) serían ~270 MB/hora. Ya señalado en agosto como
`T9-02` (sección II); sigue igual en el código de hoy.

Por qué importa. En un plan prepago hondureño, la app abierta durante la clase es dinero del
maestro; y una nube que se cae cinco minutos multiplica el tráfico en vez de reducirlo.

Recomendación. RPC ligera `metas_docente_estado_versiones` (k, version, hash) y bajar solo las
claves cuya versión cambió; quitar el latido de 20 s y sincronizar en foco, al volver la red,
tras un cambio propio y a pedido; con lectura fallida, no subir nada como semilla. Mostrar
cuántos datos bajó la sesión hasta que esté hecho.

**[T11-05] localStorage guarda hasta siete copias del aula; con 6 grupos el respaldo anti-pisado ya no cabe y falla en silencio, y con 12 se agota la cuota** — alta · riesgo · semanas · impacto educativo 3/5 · impacto comercial 4/5

Qué pasa. `METAS_ADMIN_V1` se duplica en `METAS_DOCSYNC_BASE_V1` (base de la fusión),
`METAS_AULA_RESPALDO_V1` (copia antes de pisar) y hasta 4 fotos completas en
`METAS_ADMIN_UNDO_V1`, todas con los logos de cada grupo en base64 dentro. La cuota medida de
Chromium es ~5 MB. Cada `setItem` fallido se traga con `catch (_) {}`: el respaldo que existe
para recuperar una sincronización que pisó datos es lo primero que deja de escribirse, sin
aviso; y si la base no cabe, `baseSet` tira la clave y la fusión pasa a UNIR, que revive lo
borrado.

Evidencia. `js/metas-docente-sync.js:147` (backupLocal), `:163-170` (baseSet);
`js/tools/registros-admin.js:119-141` (4 fotos), `:4197-4211` (logo a 260 px dentro del
estado, por grupo). `scratchpad/tecnica-acceso/T11/tamano.js` (`out-tamano.txt`): cuota 5 100
KB; 1 grupo×43 con un año de datos = 124 KB; 3 grupos = 373 KB / 3 014 KB con copias; 6 grupos
= 746 KB → «respaldo: false, copias undo: 3»; 12 grupos = 1 492 KB → 5 013 KB, «respaldo:
false, copias undo: 1». El revisor comprobó el reventón a 5 242 876 caracteres.

Por qué importa. Con la fusión dato por dato el pisado es más raro que en agosto, pero cuando
ocurre, el único deshacer no está y nadie lo dijo. Precisión del revisor: el caso de 6 grupos
exige logos en los seis y un año de lectura y convocatorias —plausible en un maestro de 7º-9º con
seis secciones, no el típico de primaria—; lo general es el fallo silencioso. Peor aún es el que
faltó (ver «Qué falta»): con el almacén lleno, `adStateSave` tampoco guarda la asistencia misma.

Recomendación. Sacar base, respaldo y fotos de deshacer a IndexedDB; una sola copia de deshacer
o diferencias; los logos fuera del estado sincronizado. Y cuando una copia de seguridad no quepa,
decirlo en el chip de estado.

**[T11-06] No existe exportación ni restauración del aula a un archivo: el único respaldo del maestro es un Supabase gratuito sin copias** — alta · faltante · días · impacto educativo 3/5 · impacto comercial 4/5

Qué pasa. No hay «Guardar copia de mi aula» ni «Restaurar desde archivo». Lo que existe: el
Expediente del aula (HTML para imprimir vía `adPrintAbrir`, no restaurable), el CSV de eventos
del alumno en `registro.html`, y `respaldo-rapido.cmd`, que es un `git add/commit/push` para el
desarrollador. La papelera de la nube guarda solo el último «Empezar de nuevo».

Evidencia. `grep` de Blob/download/JSON en `js/app.js` y `js/tools/*.js` → solo cabeceras HTTP
y CSV; `js/tools/registros-admin.js:1552-1573`; `registro.html:94`; `respaldo-rapido.cmd:1-16`;
`SUPABASE-DOCENTE-PAPELERA.sql`; `CLAUDE.md` («El plan gratuito no trae copias y esto no se
arregla con código»).

Por qué importa. Con T11-01 y T11-02 abiertos, sin copias en la nube y con la cuenta como único
acceso, no hay camino de vuelta si la nube se pierde, la cuenta se bloquea o el maestro cambia de
teléfono sin señal.

Recomendación. Botón en el perfil: «💾 Guardar copia de mi aula» (JSON con las `DS_KEYS`, fecha
y `PROF`) y «Restaurar desde archivo», que fusione con lo que haya —`MetasFusion.fusionar(null,
actual, archivo)` ya sirve para eso—. Recordatorio mensual. Es también la salida de T11-01 y de
la migración de teléfono sin señal.

**[T11-11] Tras «Cerrar sesión» quedan copias completas del aula en el equipo, y quien entre después con cualquier cuenta docente puede llevárselas con un toque** — media · riesgo · horas · impacto educativo 1/5 · impacto comercial 3/5

Qué pasa. `dsWipeLocal` borra `DS_KEYS` + META, RESPALDO, RESET_PEND, OWNER y BASE, y nada más:
sobreviven `METAS_ADMIN_UNDO_V1` (hasta 4 fotos con lista, claves de familia, avisos y plan),
`METAS_STATS_NUBE_V1` (notas de alumnos bajadas), `METAS_ADMIN_SB_V1` y `METAS_AVISOS_SB_V1`
(firmas, menores). Con la subida OK, `push().then → baseSet` vuelve a escribir la base con el
aula entera DESPUÉS del borrado. `adUndoRestaurar` repone admin+códigos+avisos+plan sin mirar
dueño ni cuenta. El diálogo promete «si alguien más usa este equipo, no verá tu información».

Evidencia. `js/metas-docente-sync.js:703-709`, `:246-251`; `js/tools/registros-admin.js:145-165`,
`:783-796`. `scratchpad/tecnica-acceso/T11/escenarios2.js`: con red buena quedan
`{STATS_NUBE, DOCSYNC, UNDO, BASE}`, «¿BASE guarda la lista?» true; `undo-shot.js`: tras tocar
Restaurar, `METAS_ADMIN_V1 = GA:43`; captura `T11/logout-papelera-visible.png`.

Por qué importa. Precisión del revisor: sin sesión, Mi aula no se alcanza por la interfaz
(`registros-admin.js:6097-6103` exige `METAS_DOCENTE_V1`); la exposición real es que quien entre
después con CUALQUIER cuenta docente —crear una es gratis— ve «Deshacer un accidente» del
maestro anterior y con un toque se lleva su aula a su propia nube (captura
`T11/e5-undo-de-otro-maestro.png`).

Recomendación. Incluir en `dsWipeLocal` las llaves UNDO, STATS_NUBE, ADMIN_SB y AVISOS_SB; en
`push().then`, no escribir base ni meta si ya no hay dueño; no pintar la papelera de accidentes
de otra cuenta.

**[T11-12] El ✅ «Datos del aula sincronizados en todos tus equipos» solo mira si hay cambios locales pendientes: no sabe cuándo habló con la nube por última vez** — baja · incompleto · horas · impacto educativo 1/5 · impacto comercial 2/5

Qué pasa. `estado()` muestra el ✅ siempre que no haya claves con `v≠sv` y `navigator.onLine`
no sea `false`; `pull()` devuelve `{ok:false}` en el `catch` sin guardar nada ni repintar. No hay
marca de tiempo de la última lectura buena en ningún sitio. Y `syncNow()` muestra «✅ Todo al
día» si el push resolvió `true` aunque el pull haya fallado, porque tras un pull fallido el push
sube todo como semilla y devuelve `true`.

Evidencia. `js/metas-docente-sync.js:409-418`, `:334-336`, `:435-448`.

Por qué importa. Es pulido, pero es la pantalla que tapa T11-01, T11-04 y los fallos que los
revisores echaron en falta (petición colgada, reloj adelantado): en todos ellos el maestro lee ✅.

Recomendación. Guardar la hora del último pull y del último push con éxito y mostrarla («Al
día con la nube hace 2 min» / «Última vez al día: hace 3 días»); ⚠️ si la última lectura falló
aunque no haya pendientes.

### Los datos del alumno (T11)

**[T11-10] Que el resultado llegue al niño correcto depende de cómo escribe «grado y sección»: «sexto 1» se lee como primer grado** — media · error · días (horas la parte del mapa) · impacto educativo 4/5 · impacto comercial 2/5

Qué pasa. El código de aula es por MAESTRO, no por grupo, así que el grupo se deduce del texto
libre que el niño teclea en la misión (campo de 30 caracteres, sin validar, placeholder «6to
A»). `estParteGrupo` interpreta mal formas comunes; si el grado no calza el resultado se descarta
en silencio, y «sexto 1» → grado 1 no entra ni en el aviso de `sinSeccion`. `js/grado-alumno.js`
ya tiene el mapa «sexto: '6', septimo: '7'…» para la portada y `estParteGrupo` no lo reutiliza:
la misma palabra se entiende en una pantalla y no en la otra.

Evidencia. `scratchpad/tecnica-acceso/T11/parte.js` (ejecuta la función real): «sexto 1» →
`{grado:"1"}`, «Sexto grado sección 1» → `{grado:"1"}`, «6A» → `{seccion:""}`, «6to seccion A»
→ `{seccion:""}`. `js/tools/estadisticas-alumno.js:273`, `:342-350`, `:1021`;
`js/metas-registro.js:507`, `:642`; `SUPABASE-AULA.sql:25`; `js/grado-alumno.js:50-51`.

Por qué importa. El maestro lee «no hay práctica» de un niño que sí practicó.

Recomendación. Código de aula por GRUPO (el grupo ya tiene id): el niño escribe código + número
y grado/sección salen del grupo del maestro. Mientras tanto —horas—: selector de grado y sección
en vez de texto libre, y `estParteGrupo` reutilizando el mapa de `grado-alumno.js`.

**[T11-07] Si el navegador limpia el almacén, el maestro recupera solo sus llaves de aula y el alumno no recupera nada; nadie pide almacenamiento persistente** — media · incompleto · días · impacto educativo 4/5 · impacto comercial 3/5

Qué pasa. Tras una limpieza de datos (liberar espacio en Android, cambiar de navegador) el
maestro vuelve a entrar y `dsClaimFor` baja las `DS_KEYS`; se pierden sin vuelta la cola de
resultados pendientes del alumno (`METAS_SB_OUTBOX_V1`), el registro local con la lectura de la
misión y los quiz de video (que no suben, T11-09), el progreso y XP de todas las misiones y el
mapa del chatbot. La única RPC que lee progreso es `metas_consultar_progreso_docente`, para el
maestro. Y ningún archivo llama a `navigator.storage.persist()`: ni localStorage ni la Cache
Storage del service worker («ábrela una vez con señal») están protegidas del desalojo bajo
presión de espacio —lo señalaron los dos revisores, T11 y T7—.

Evidencia. `grep storage.persist|navigator.storage` en `js/`, `index.html`, `padres.html`,
`sw.js`, `js/tools/pwa-install.js` → 0; `grep metas_leer_progreso|progreso_leer` en `js/` → 0
(solo se sube, `js/metas-supabase.js:186-243`); `js/metas-docente-sync.js:721-744`;
`SUPABASE-DOCENTES-V2.sql:386`.

Por qué importa. Precisión del revisor: el desalojo «best-effort» solo ocurre bajo presión de
espacio y Chrome concede persistencia sola a una PWA instalada con uso; la parte más real es la
cola sin subir (T11-08). Por eso baja de alta a media.

Recomendación. `navigator.storage.persist()` al instalar la PWA y en la Zona Docente (una línea,
vale la pena sola). Reponer el XP del alumno desde la nube es otra cosa —requiere identidad por
código de aula + número— y no debería bloquear lo primero.

**[T11-09] La lectura dentro de la misión y el quiz del video nunca llegan al maestro: se quedan en el teléfono del niño** — media · incompleto · días · impacto educativo 3/5 · impacto comercial 2/5

Qué pasa. Solo `evaluacion`, `prueba_operativa` y `pauta_vista` entran a la cola y al servidor;
`encolar()` descarta el resto. Los eventos `lectura` (palabras por minuto de la misión) y
`video_quiz` se registran localmente y se leen solo en `registro.html` abierto en el mismo
aparato. `CLAUDE.md` afirma que ese número «acaba en su expediente y en el informe que firma su
madre» y `videos-mision` promete «Evidencia del maestro»: las dos promesas son falsas fuera del
teléfono del niño.

Evidencia. `js/metas-supabase.js:35`, `:78`; `SUPABASE-AULA.sql:128` y
`SUPABASE-PUERTA-ANONIMA.sql:119` (mismo filtro en el servidor);
`js/tools/lectura-mision.js:1866`; `js/videos-mision.js:937`;
`js/tools/estadisticas-alumno.js:352`; `CLAUDE.md` («acaba en su expediente…»).

Por qué importa. Precisión del revisor: la toma que sí llega al informe es la del maestro (📖
Lectura de Mi aula); lo que se pierde es el dato del trabajo autónomo del alumno, útil pero no el
del expediente. Por eso 3/5 y no 4/5.

Recomendación. Añadir `lectura` y `video_quiz` a `TIPOS` y al filtro SQL (o un `extra` jsonb con
ppm, comprensión, `sin_terminar`) y pintarlos en Estadísticas junto a las tomas del maestro.
Corregir `CLAUDE.md` y la pantalla mientras tanto.

**[T11-08] La cola de resultados del alumno tira los más viejos sin avisar y nadie ve cuántos hay pendientes** — media · incompleto · horas · impacto educativo 3/5 · impacto comercial 2/5

Qué pasa. `MAX_OUTBOX = 1000`: al pasar el tope se descartan los 200 más viejos, y otros 200 si
el almacén no cabe; el `backfill` corre una sola vez, así que lo tirado no vuelve a la cola.
`METAS_SB.pendientes()` existe y ninguna pantalla lo usa: ni la misión ni `registro.html` dicen
«N resultados sin subir».

Evidencia. `js/metas-supabase.js:32`, `:42-49`, `:88-105`; `grep pendientes()` en
`index.html`, `registro.html`, `js/app.js`, `js/tools` → sin uso.
`scratchpad/tecnica-acceso/T11/cola.js` (re-corrido por el revisor): 1 200 evaluaciones sin red
→ `{cola:1000, primeraForma:20, registro:1201}`: las 200 primeras no subirán nunca aunque vuelva
la señal, y la misión no avisa.

Por qué importa. Los eventos siguen en `METAS_REGISTRO_V1` (CSV), así que no es pérdida total.
43 alumnos × 23 pruebas en un teléfono sin señal es raro; que nadie vea la cola es cotidiano.

Recomendación. Indicador «☁️ N resultados sin subir» en la barra del alumno y en
`registro.html`; al acercarse al tope, avisar y ofrecer el CSV antes de descartar; subir el tope
o mover la cola a IndexedDB.

### Service worker: qué versión se sirve y a quién (T7)

**[T7-03] Ninguna misión registra el service worker: quien llega por el QR de la ficha o por WhatsApp nunca la tiene sin internet** — alta · incompleto · horas · impacto educativo 4/5 · impacto comercial 3/5

Qué pasa. Solo `index.html` y `padres.html` llaman a `navigator.serviceWorker.register`. El QR
impreso apunta directo a la misión, y el manual documenta como vía principal el enlace de cada
misión por WhatsApp: los dos caminos previstos para que el alumno llegue a una misión saltan la
portada. Un teléfono que nunca abrió la portada navega sin SW: nada se guarda. La promesa
«Ábrelas una vez con señal y después trabajan sin internet» (`index.html:92-93`,
`manifest.json:4`) no la ve nunca ni se le cumple.

Evidencia. `grep -l serviceWorker misiones/*/*.html fichas/*.html mision.html` → 0;
`index.html:1175`, `padres.html:1705`; `_dev/genera-qr-mision.py:52-54`;
`MANUAL-MAESTRO.md:39-41`. Matiz: el SW registrado desde la portada tiene ámbito raíz y controla
todo el sitio; el hueco es exactamente el teléfono que sigue el QR o el WhatsApp.

Por qué importa. El camino previsto para 43 alumnos con 3 teléfonos es ese papel.

Recomendación. Registrar el SW con ámbito raíz desde un script que ya cargan las 75 misiones
(`js/metas-registro.js`), `mision.html` y las fichas; que la sonda de fuente lo exija como exige
la barra de secciones. Una línea.

**[T7-01] Publicar con la red lenta deja index.html nuevo con app.js viejo, sin aviso, mientras el SW nuevo instala —y de forma permanente si el armazón quedó con hueco—** — media · error · horas · impacto educativo 4/5 · impacto comercial 4/5

Qué pasa. El SW sirve lo propio «red primero» con plazo de 3 s (`PLAZO_RED`) y, si la red no
llega, `buscarCopia` mira PRIMERO el armazón precacheado del SW que MANDA —que sigue siendo el
viejo hasta que el nuevo termina de instalar 56 archivos—. Cuando el HTML llega en <3 s y los JS
en >3 s, la página se arma con el sello nuevo y el `app.js` anterior, sin aviso. Se cura sola al
activar el SW nuevo (~40-80 s en la sonda, hasta ~2 min si varios archivos rozan los 12 s). Pero
si un archivo del ARMAZON supera `PLAZO_INSTALA` (12 s) el precache queda con hueco —el código lo
tolera a propósito— y `buscarCopia` cae a `CACHE_DATOS` con `ignoreSearch`, donde está el
`app.js` viejo: entonces la mezcla NO se cura al activar y persiste hasta una carga con `app.js`
en <3 s. Ese caso no se midió (la sonda retrasa 4 s < 12 s) y ninguna sonda del repositorio lo
produce (`verifica-service-worker` no retrasa la red).

Evidencia. `sw.js:151` (PLAZO_INSTALA), `:153-169` («se sigue sin él»), `:164` (skipWaiting),
`:188` (PLAZO_RED), `:199-204` (buscarCopia, CACHE_APP antes que CACHE_DATOS, ignoreSearch),
`:266-278`. `grep controllerchange|updatefound` en `index.html`, `js/` → 0. Reproducido dos
veces con espejo propio (`T7/sonda-sw.js` en :8124, `T7-revision/sonda-sw-rev.js` en :8125):
paso2 tras publicar v198 con JS a 4 s → `selloHtml ?v=198` y `window.__APPV=197`; paso3
siguiente recarga → 197; a los 9 s coexisten `meta-app-v197` y `meta-app-v198`; paso3b a los 82
s → solo `meta-app-v198`, `APPV=198`, y sin internet abre con 198.

Por qué importa. Con cuatro publicaciones al día y la señal del aula, la ventana se abre a
diario; un HTML que llama a funciones que su `app.js` no tiene es una portada muda.

Recomendación. Que el plazo no devuelva una copia de OTRA versión: si la petición lleva
`?v=NNN` y la copia guardada es de otro sello, seguir esperando a la red (o servir también
`index.html` de la copia). Eso es horas. Que el precache nuevo copie del viejo lo que no cambió
(T7-02) para que active en segundos. Y una sonda que retrase la red por encima de 12 s.

**[T7-10] Nadie puede saber qué versión tiene un teléfono: ni en Ajustes ni en el pie hay número de versión** — baja · incompleto · horas · impacto educativo 2/5 · impacto comercial 3/5

Qué pasa. `install` hace `skipWaiting` y `activate` `clients.claim`, sin oyente de
`controllerchange` ni `updatefound`, y ninguna pantalla muestra `CACHE_NAME` ni el sello. Cuando
un maestro reporta «se ve distinto» no hay forma de saber qué tiene; el manual ya reconoce el
síntoma. Precisión del revisor: la «mezcla» portada vieja en pantalla + misiones nuevas al
navegar no es un defecto (cada carga es coherente por dentro; la dañina es T7-01), y quitar
`skipWaiting` sería contraproducente en un teléfono compartido donde la PWA no se cierra nunca:
los arreglos no llegarían.

Evidencia. `sw.js:164`, `:181`; `grep versión index.html` → 0 (el sello solo va en los `src`);
`MANUAL-MAESTRO.md:479-481`.

Recomendación. Mostrar `CACHE_NAME`/sello en Ajustes y en el pie de la portada (minutos).
Mantener `skipWaiting`+`claim`; la tira «Hay una versión nueva · Recargar» es opcional y no cura
nada por sí sola.

### Lo que baja el teléfono: precache, portada y copias repetidas (T7)

**[T7-04] La portada pesa 3,3 MB y 28 scripts sin defer: las herramientas del maestro se bajan y se compilan en el teléfono de cada alumno antes de pintar la lista de misiones** — alta · deuda · días · impacto educativo 4/5 · impacto comercial 3/5

Qué pasa. En frío `index.html` trae 44 peticiones y 2 438 KB de JavaScript en 28 etiquetas sin
`defer` ni `async`: el corpus de lectura (957 KB), `registros-admin` (333 KB), `convocatoria`
(178 KB), `html2canvas` (194 KB), `campeonismo` (103 KB). `js/app.js` es el script 25 de 28 y
arranca en `DOMContentLoaded`, así que la lista de misiones no se pinta hasta haber bajado y
compilado los 24 anteriores (≈2,2 MB de herramientas del maestro). El propio `sw.js:26-30` lo
reconoce («los 25 scripts de la portada (2,8 MB)»). Las visitas siguientes salen de
`CACHE_DATOS`; el coste es la primera visita y cada archivo cambiado tras cada publicación.

Evidencia. `T7/sonda-peso.js`: html 56 KB, total 3 277 KB, 44 peticiones, script 28×2 438 KB,
css 2×178 KB; `grep -c '<script[^>]*defer' index.html` → 0; `index.html:1131-1148`;
`js/app.js:3186`. Ya señalado en agosto como `T9-04` (sección II).

Por qué importa. A 1 Mbps son ~30 s de descarga y varios segundos de análisis en un Android de
80 USD antes de poder tocar «Misiones», para un alumno o una madre que no usan nada de eso. Es lo
contrario de lo que se cuidó con las hojas de estilo.

Recomendación. Cargar las herramientas del maestro bajo demanda al entrar a Zona Docente
(inserción de `<script>` con promesa, como ya hace el cargador de Three.js), `lectura-textos.js`
solo al abrir 📖 Lectura, `html2canvas` solo al pedir la Constancia. Incluso sin partir nada:
`app.js` antes y `defer` en las herramientas ya adelanta el primer pintado útil. Meta: portada <
700 KB en frío.

**[T7-02] Cada publicación (cuatro al día) rehace el precache desde cero: 56 viajes a la red por teléfono y ~850 KB en la lista que la portada no necesita** — media · sobrediseño · días · impacto educativo 3/5 · impacto comercial 4/5

Qué pasa. La caché nueva nace vacía y nada copia de la vieja lo que no cambió; el precache es
ARMAZON (17 entradas, ≈658 KB) + STATIC_ASSETS (40, ≈1 852 KB). `CACHE_NAME` subió 60 veces en
27 días (27 en los últimos 7). Precisión del revisor: `cache.add` usa la caché HTTP del navegador
y GitHub Pages manda ETag, así que lo que no cambió se revalida con 304 (cabeceras, no cuerpo):
el coste normal de cada publicación es lo que cambió + 56 idas y vueltas —que en la señal del
aula son TIEMPO de instalación (la ventana de T7-01), no megas—; los 2,45 MB enteros solo se
re-bajan si la caché HTTP fue desalojada. Y Font Awesome SÍ lo pinta la portada (52 clases
`fa-` en `index.html`), así que no sobra. Lo que sí sobra: 16 diccionarios `-en.js` de robótica
(816 KB) para misiones que ese teléfono quizá nunca abra, y `salida.html`/`buzon.html`, que sin
nube solo enseñan «no hay internet».

Evidencia. `sw.js:31-151`, `:163-169`; `T7/sonda-peso.js`; `git log --since=2026-08-13 -p --
sw.js | grep -c '^+const CACHE_NAME'` = 60; `sw.js:147-149`; captura
`T7/capturas/salida@360x640.png`. Ya señalado en agosto como `T9-03` (sección II).

Recomendación. En `install`, copiar de la caché anterior cada entrada cuyo ETag/Content-Length
coincida (o nombrar por hash y cachear cache-first para siempre). Podar STATIC_ASSETS a lo que
`index.html` pinta sin señal. Sellar por archivo cambiado, no todo el armazón en cada commit.

**[T7-09] html2canvas.min.js está copiado 67 veces idéntico: 13 MB en el repositorio y 67 entradas de 194 KB en la caché del teléfono** — media · eliminar · horas · impacto educativo 2/5 · impacto comercial 2/5

Qué pasa. Cada misión trae su copia de `html2canvas` (198 689 bytes, mismo md5
`d7530aa0b7587e627484c49fdf8f13f2` en las 67 y en `js/html2canvas.min.js`). `sw.js:288-294`
guarda cada URL distinta en `CACHE_DATOS`: el alumno que abre diez misiones baja y guarda diez
veces el mismo archivo. Es la misma deuda que ya se sacó del andamio 3D y de los videos.

Evidencia. `find misiones -name html2canvas.min.js | wc -l` = 67; `du -ch` = 13 MB;
`T7/sonda-peso.js`: en `fracciones.html` es el recurso más pesado (194 de 957 KB).

Recomendación. Borrar las 67 copias y enlazar `../../js/html2canvas.min.js` (una `sed` sobre
los 67 HTML, subir el sello); una sonda de fuente que falle si vuelve a aparecer un vendor
duplicado en `misiones/`.

### Android: el APK (T7)

**[T7-05] El APK (www/) está congelado en la v48 del 13 de agosto —101 commits atrás, sin la fusión de datos y sin 18 misiones— y el manual lo recomienda para las tabletas del aula** — media · riesgo · días · impacto educativo 4/5 · impacto comercial 4/5

Qué pasa. `www/` es lo que envuelve Capacitor. Lleva `sw.js` v48 (una sola caché que borraba lo
guardado en cada versión), le faltan 18 carpetas de misiones (fin de grado 4º-7º, cívica,
sólidos, volumen, 8 del maestro), 22 archivos JS (`metas-fusion-aula.js`, `estrella-ganada.js`,
`barra-secciones.js`, `teclado-actividades.js`, `grado-alumno.js`…) y 4 páginas. Su
`metas-docente-sync.js` sigue con «gana la copia más nueva», el caso documentado de asistencia
perdida. Nada lo reconstruye: `build:www` es un `robocopy` de Windows que ningún workflow corre.
Precisión del revisor: el APK NO se distribuye por ningún lado (ni `.apk` versionado, ni enlace
en el sitio ni en los manuales, ni releases; solo `install:android` = carga lateral local), y
`_config.yml` saca `www/` de Pages. El daño de hoy es que el manual recomienda algo que el
maestro no puede conseguir y que, si existe en alguna tableta del autor, va con el sync que
perdía asistencia.

Evidencia. `www/sw.js:1` vs `sw.js:18`; `git log -1 -- www` = 1a49e51 (2026-08-13);
`git rev-list --count 1a49e51..HEAD` = 101; `comm` misiones/js; `grep -c MetasFusion
www/js/metas-docente-sync.js` = 0 (raíz: 4); `package.json:7`; `.github/workflows/*.yml` sin
`build:www`; `MANUAL-MAESTRO.md:37`, `:480`; `android/app/build.gradle` versionCode 3 /
versionName 1.2.

Recomendación. Decidir: o el APK vive (`build:www` portable en Node y corrido en el CI en cada
empujón, `versionCode` automático, aviso dentro del APK cuando el sitio va por delante) o se
retira de los manuales hasta tener ese conducto. Mientras no haya decisión, quitar la
recomendación de `MANUAL-MAESTRO.md:37`: minutos.

**[T7-06] Dentro del APK «Imprimir» no hace nada: window.print no tiene puente nativo (las descargas sí lo tienen)** — baja · incompleto · días · impacto educativo 3/5 · impacto comercial 3/5

Qué pasa. En un WebView de Android `window.print()` no hace nada sin un `PrintDocumentAdapter`;
`MainActivity.java` es un `BridgeActivity` vacío sin `PrintManager`, y Capacitor Android no lo
trae. Así, en la app instalada las fichas, informes, boletos y listados (91 archivos con
`window.print`) son botones mudos. Corrección del revisor: la mitad de la evidencia original era
falsa. Las tres descargas reales del proyecto YA llevan el puente nativo (`Filesystem.writeFile`
+ `Share.share` cuando existe `window.Capacitor`), y «11 descargas en registros-admin» no
existen (su CSV va al portapapeles). No verificado en un dispositivo; depende de que el APK
exista en alguna tableta (T7-05).

Evidencia. `js/metas-registro.js:313-318`, `js/tools/collage-maker.js:872-873`,
`js/tools/plan-accion.js:524-525` (descargas con puente); `grep -c window.print` → 91 archivos;
`android/app/src/main/java/.../MainActivity.java`; `js/tools/registros-admin.js:4884`.

Recomendación. Si el APK sigue: un plugin de impresión, o generar el PDF y pasarlo por `Share`.
Si no sigue: decir en el manual que imprimir es desde el navegador.

### Manifest e iOS (T7)

**[T7-07] manifest.json bloquea la orientación a vertical mientras 18 juegos 3D traen reglas para el teléfono acostado** — baja · error · horas · impacto educativo 3/5 · impacto comercial 2/5

Qué pasa. `"orientation": "portrait"` aplica a toda la PWA instalada, y los juegos 3D viven en
el mismo ámbito. `css/parque-3d.css` trae reglas para pantalla corta (`max-height:430px`) y
cuatro juegos más tienen reglas de acostado; ningún juego llama a `screen.orientation.lock`. En
el navegador sí gira; en la app instalada no. Precisión del revisor: los juegos funcionan en
vertical (es su caso principal) y el modo 📽️ se proyecta desde una PC: se pierde una opción, no
una función.

Evidencia. `manifest.json:9`, `manifest-padres.json:8`; `css/parque-3d.css:184`; `grep
screen.orientation` → 0; `AndroidManifest.xml` sin `screenOrientation` (APK y PWA se comportan
distinto); captura `T7/capturas/juego3d-640x360.png` (cabe acostado).

Recomendación. Quitar `orientation` (o `any`) de los dos manifests y subir el sello; que cada
juego decida con `screen.orientation.lock` si hace falta.

**[T7-08] Los dos manifests comparten un ícono recortado e ilegible, «Notas» abre la aplicación entera dentro de su ventana, y el theme_color no coincide** — baja · incompleto · horas · impacto educativo 2/5 · impacto comercial 3/5

Qué pasa. `manifest.json` y `manifest-padres.json` usan el mismo `img/icon-512.png`: un logo
circular con el aro pegado al borde y el texto «PoliCastSapien EDITORIAL», declarado `maskable`
(Android lo recorta al 80 %) e ilegible a 48 px. `manifest-padres.json` tiene `scope: ./` y
`padres.html:201` enlaza a `index.html`, así que la app «Notas» abre la aplicación entera de
alumnos y maestro dentro de la ventana de la familia. `theme_color` `#114494` vs `<meta>`
`#1e3a7c`. Precisión del revisor: sin `id`, Chrome deriva el id del `start_url`, así que las dos
apps ya son distintas; ese punto no es problema y se quita.

Evidencia. `manifest.json`, `manifest-padres.json:5-6`; `img/icon-512.png`; `index.html:6`;
`padres.html:201`.

Recomendación. Íconos distintos con margen del 20 % para `maskable` y el nombre M.E.T.A.S. en
el de alumnos; `padres.html` en `/padres/` para darle `scope` propio (o quitar el segundo
manifest); alinear `theme_color`.

**[T7-12] En iPhone/iPad hay pulido pendiente: backdrop-filter sin prefijo en 68 archivos e iPad sin pista de instalación** — baja · deuda · horas · impacto educativo 1/5 · impacto comercial 2/5

Qué pasa. `backdrop-filter` en 68 archivos, ninguno con `-webkit-backdrop-filter`, que Safari
exigió hasta iOS 18 (iOS 16/17 siguen en uso): barras y velos translúcidos sin desenfoque.
`pwa-install.js` detecta iOS por `/iphone|ipad|ipod/` en el UA, e iPadOS se presenta como Mac
desde 2019: en iPad no sale «Compartir → Agregar a inicio». En
`juego-fabrica-geometrica.html:123` una lista de selectores con `:focus-visible` se descarta
entera en Safari < 15.4. Nada bloquea; iOS es minoritario en las aulas hondureñas.

Evidencia. `grep -rl backdrop-filter` = 68, `grep -rl -webkit-backdrop-filter` = 0;
`css/app.css:994`; `js/tools/pwa-install.js:17-18`.

Recomendación. `sed` que añada `-webkit-backdrop-filter` junto a cada `backdrop-filter`;
detectar iPad con `navigator.maxTouchPoints > 1 && /Mac/.test(ua)`; separar las reglas
`:focus-visible`.

## Qué sobra o debería eliminarse

| qué | por qué | hallazgo | esfuerzo |
|---|---|---|---|
| La guarda `rp*2 < lp` tal como está (`js/metas-docente-sync.js:287-292`) | revierte borrados legítimos, «Empezar de nuevo» y «Cerrar el año» desde el otro equipo; lo que protegía ya lo cubren `scanLocal`, la base y la red de la línea 309 | T11-02 | días |
| El latido de 20 s (`:690-693`) y el hash de todas las claves cada 8 s | 86 MB/hora con tres grupos, sin comparar versiones | T11-04 | días |
| El toast «datos del aula a salvo en tu nube» y la tarjeta fija «✅ Tus datos se guardan y sincronizan solos» (`js/app.js:2054`, `:1684`) | afirman lo que no se comprobó | T11-01 | horas |
| Tres de las cuatro fotos completas de deshacer y los logos en base64 dentro del estado sincronizado | son lo que llena la cuota de 5 MB y deja sin respaldo | T11-05 | días |
| Las 67 copias de `html2canvas.min.js` en `misiones/` (13 MB) | un solo md5; el teléfono las guarda 67 veces | T7-09 | horas |
| Los 16 diccionarios `-en.js` de robótica (816 KB), `salida.html` y `buzon.html` de `STATIC_ASSETS` | la portada no los pinta y sin nube esas dos páginas no sirven | T7-02 | horas |
| `"orientation": "portrait"` en los dos manifests | quita el acostado a 18 juegos sin ganar nada | T7-07 | minutos |
| La recomendación del APK en `MANUAL-MAESTRO.md:37` mientras no haya conducto de construcción | recomienda algo que el maestro no puede conseguir y que, donde exista, pierde asistencia | T7-05 | minutos |
| Las herramientas del maestro del camino crítico de la portada (24 scripts antes de `app.js`) | 2,2 MB que el alumno no ejecuta, antes de pintar la lista | T7-04 | días |

## Qué falta

Lo que el producto no tiene y estos hallazgos piden:

1. **Exportación y restauración del aula a un archivo** (T11-06), que es también la salida de
   T11-01 y del cambio de teléfono sin señal.
2. **Un cierre de sesión que espere la subida y se niegue a borrar si no confirmó** (T11-01).
3. **Identidad estable del alumno** (`id`, no `num`) y **código de aula por grupo**
   (T11-03, T11-10).
4. **Registro del service worker desde las 75 misiones, `mision.html` y las fichas** (T7-03).
5. **`navigator.storage.persist()`** para localStorage y para la Cache Storage (T11-07).
6. **Un indicador de «N resultados sin subir»** para el alumno (T11-08) y **la hora del último
   contacto con la nube** para el maestro (T11-12).
7. **El número de versión visible** en Ajustes y en el pie (T7-10).
8. **`lectura` y `video_quiz` en la nube** o, mientras no, corregir las promesas de `CLAUDE.md`
   y de la pantalla (T11-09).
9. **Un conducto de construcción del APK en el CI** o su retirada del manual (T7-05), y un
   puente de impresión si sigue (T7-06).
10. **Sondas que hoy no existen**: borrado de grupo, reset y Cerrar el año con dos equipos en
    `verifica-fusion-sync.js` (T11-02); renumeración en `prueba-fusion-aula.js` (T11-03);
    logout con pendientes (T11-01); service worker con red retrasada por encima de 12 s (T7-01);
    un vendor duplicado en `misiones/` (T7-09).

Lo que los auditores no vieron y los revisores sí. No entran en el conteo de 23 ni en el JSON:
son problemas que el revisor levantó con evidencia propia al intentar tumbar los otros, y quedan
para que el creador los mire con el mismo cuidado.

- **Reloj adelantado en la PC = pérdida silenciosa en el teléfono.**
  `SUPABASE-DOCENTE-ESTADO.sql:63-79` hace `n := n + 1` aunque el `where excluded.version >= …`
  rechace la fila, y `js/metas-docente-sync.js:236-243` marca `sv=v` al recibir ese `n`.
  Reproducido (`T11-revision/extra.js` X1): PC 10 min adelantada ya subió; el teléfono marca una
  falta, la sube con versión «vieja», la nube la rechaza contestando 1, el teléfono la da por
  subida y en el siguiente pull la borra. Solo queda un «Recuperar» que nadie sabe que hay que
  tocar. Es la fusión funcionando bien y el servidor mintiendo.
- **Una sola petición colgada bloquea la sincronización hasta recargar.** `pull()`/`push()` usan
  `fetch` sin `AbortController` ni plazo, y `sync()` toma `_busy` (`:382-390`) que solo se
  suelta al resolver. Reproducido (X2, `x2.txt`): con la lectura colgada, 30 s después una falta
  pendiente lleva 0 subidas, `dsSync()` devuelve `false`, y ni el vigía (`schedulePush` exige
  `!_busy`) ni el latido vuelven a pasar. El chip sigue en ✅.
- **Con el almacén lleno, pasar lista no guarda nada y nadie lo dice.**
  `js/tools/registros-admin.js:189-192` `adStateSave` hace `try { setItem } catch (_) {}`.
  Reproducido (X3): aula de 3 grupos + localStorage a 5 242 876 caracteres → asistencia del 9/9:
  guardado=false, sin excepción, sin toast, y al repintar la falta ya no está. Es peor que
  T11-05: se pierde el dato de hoy mismo.
- **«↩️ Recuperar» tras un pisado restaura la papelera de la NUBE antes que el respaldo local.**
  `recuperar()` (`js/metas-docente-sync.js:565-575`) llama siempre `metas_docente_reset_deshacer`
  primero, y esa RPC (`SUPABASE-DOCENTE-PAPELERA.sql:100-135`) vuelve a poner en el estado vivo,
  para todos los equipos, lo archivado en el ÚLTIMO «Empezar de nuevo» —que en un reset a
  propósito nadie consumió—; `aplicarRows` lo aplica sin fusión y `limpiarRespaldos` tira la
  copia local. Además el botón sale cada vez que el OTRO equipo borra alumnos legítimamente,
  porque `pull()` hace `backupLocal` antes de aplicar. No reproducido en navegador; el camino es
  directo en el código.
- **`padres.html:1705` registra el MISMO `sw.js`:** el teléfono de una madre que solo abre
  «Notas» baja en segundo plano los ~2,5 MB del precache (diccionarios de robótica, Font
  Awesome, `salida.html`, `buzon.html`) por una página que pinta en 88 ms y no usa nada de eso.
- **Las imágenes propias van cache-first para siempre y sin sello:** `sw.js:217` (destination
  image) y `:280-296` sirven la copia sin revalidar, `CACHE_DATOS` no se limpia nunca y ninguna
  `<img>` lleva `?v=` (0 en `index.html` y en `fracciones.html`). Un diagrama o un QR corregido
  no llega jamás a un teléfono que ya vio el viejo.

Dos observaciones más de los revisores ya están fundidas en su hallazgo: el hueco del ARMAZON
que hace permanente la mezcla (en T7-01) y la subida del aula entera tras una lectura fallida
(en T11-04).

## Descartados en la revisión adversarial

| ID | título | motivo |
|---|---|---|
| T7-11 | La instalación en la señal del aula deja el precache con huecos y el SW viejo mandando durante minutos | Duplica T7-01 y T7-02 con la evidencia menos precisa de los tres: lo único medido (dos cachés coexistiendo a los 9 s; APPV 197 tras recargar) es el efecto que T7-01 ya documenta y que se resuelve al activar (82 s). Los «huecos» nunca se produjeron —la sonda retrasa 4 s, por debajo de los 12 s de `PLAZO_INSTALA`— y la cuenta «~40 s con 6 conexiones» es aritmética, no medición. Su único punto propio (un hueco en el ARMAZON hace persistir la mezcla) se incorporó a T7-01. |

## Cobertura y límites

- **Código auditado:** `main` en `d940fe0` (9 de septiembre de 2026), con las 20 modificaciones
  de `5-top-20-septiembre-6.md` ya aplicadas —la fusión dato por dato (`js/metas-fusion-aula.js`), el service
  worker con `CACHE_NAME` v197 y `CACHE_DATOS`, las letras alojadas—. Todo se juzgó contra ese
  código; los tres hallazgos críticos de T11 son consecuencias de la fusión que entró hoy y de la
  guarda que la precede, no restos de agosto.
- **La nube no se tocó ni se pudo tocar:** el proxy del entorno bloquea `supabase.co` y el
  dominio del sitio. Supabase se simuló con `page.route` (`T11/nube-falsa.js`, compartida entre
  dos contextos). Lo que afirma el simulador sobre el servidor sale de los archivos
  `SUPABASE-*.sql` del repositorio: el `n := n + 1` del reloj adelantado, el `raw:null` del
  reset y el filtro de tipos son lecturas del SQL, no del proyecto desplegado. Las cifras de
  tráfico (86 MB/hora) miden los cuerpos de las RPC simuladas, no una red real.
- **Lo que el revisor no volvió a correr:** `tamano.js` (T11-05) y `trafico.js` (T11-04); dio
  por buenas las salidas guardadas porque coinciden con el código. El «Recuperar» que restaura
  la papelera de la nube no se reprodujo en navegador.
- **El service worker se probó con un espejo del repositorio** en :8124 y :8125 y retrasos
  artificiales de 4 s. El caso del hueco en el ARMAZON (>12 s) no se produjo; queda como
  consecuencia leída del código. Las sondas del repositorio no retrasan la red.
- **El APK no se ejecutó:** no hay dispositivo ni emulador aquí, y no existe `.apk` en el
  repositorio. T7-05 sale de comparar `www/` con la raíz; T7-06 es lectura de `MainActivity.java`
  y del comportamiento documentado del WebView.
- **No se probó en un teléfono físico ni en iOS.** Las 35 combinaciones página×medida son
  Playwright/Chromium con emulación táctil; T7-12 es lectura de código.
- **Maquetación: 7 páginas, no 75.** Los conteos que se extienden al total (67 copias, 68
  archivos con `backdrop-filter`, 91 con `window.print`, 0 misiones con SW) salen de `grep`, `find`
  y `md5sum`, no de abrir cada misión.
- **Solapamiento con la sección II:** T11-04, T7-02 y T7-04 tocan lo que `T9-02`, `T9-03` y
  `T9-04` ya señalaron en agosto. Se conservan aquí porque se volvieron a medir con el código de
  hoy y siguen abiertos; los IDs de agosto se citan en cada uno.
- **La accesibilidad (T6) no está aquí:** tiene su sección propia y ninguno de sus hallazgos se
  reproduce ni se cita como propio.
