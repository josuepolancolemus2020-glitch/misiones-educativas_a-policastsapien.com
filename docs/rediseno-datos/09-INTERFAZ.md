# 9. Regla de interfaz: el docente no ve nada técnico

Fase 1: diseño (revisión 3). Regla obligatoria para **toda la app**: docente,
padres y Android (que, con `server.url`, muestra exactamente las mismas
páginas que la web).

## 9.1 La regla

Se elimina **cualquier** botón, aviso, indicador o texto sobre: sincronizar,
«estar al día», subir o bajar, pendientes por subir, recuperar, restaurar,
deshacer por copias, papelera, versiones o historial de versiones, copias o
respaldos en la nube, «usar este equipo», «empezar de nuevo», «pagos
recuperados», «datos recuperados».

**Lo único que queda:**

1. **Sin señal**: un indicador mínimo y discreto en la barra de arriba, que
   aparece al perder la señal y desaparece solo al volver. Un punto gris con
   un pequeño ícono de señal tachada (para no decirlo solo con color, regla 6
   de `CLAUDE.md`), con `aria-label="Sin señal"` para lectores de pantalla.
   Sin texto visible, sin toast, sin alerta. No se muestra nada cuando hay
   señal: ni «Guardado», ni «Guardando…», ni «al día».
2. **Preguntas de dinero**, con dos botones y en lenguaje simple. Ejemplos:
   - «Ana, Excursión: ¿L 50 o L 60?» → **[L 50]** **[L 60]**
   - Si puede ser un abono: «Ana, Excursión: ¿son dos pagos (L 50 y L 60) o es
     uno solo?» → **[Son dos]** **[Es uno]** y, si es uno, «¿L 50 o L 60?».
   - Fechas: «Pago de Ana: ¿3 de marzo o 5 de marzo?» → dos botones.
   - Gasto que baja de lo devuelto: «Te devolvieron L 250 y ahora el gasto
     dice L 200. ¿Dejar L 200?» → **[Sí]** **[No, dejar L 300]**.
3. **¿La misma persona?**: «¿Ana María López Cruz es la misma alumna que ya
   tienes con el n.º 12?» → **[Sí, es ella]** **[No, son dos]**.
4. **Cuando algo no se pudo anotar** por una razón del aula (no técnica), se
   dice la razón del aula: «El pago de Ana para Excursión no quedó anotado:
   esa colecta ya está cerrada». Un botón: «Entendido». Nunca «no se
   sincronizó», «error», «servidor» ni «nube».

**Lo que cambia respecto de la revisión 2:** desaparecen la línea
«Guardado / Guardando…», el «recibo pendiente» (sin señal, el número del
recibo simplemente no aparece todavía y el botón de imprimir recibo espera
sin decir nada) y el aviso al cerrar sesión con datos pendientes (si hay
señal, la app termina de enviar antes de cerrar; si no, los conserva para esa
cuenta en ese aparato y los envía cuando vuelva a entrar).

**Respaldo a Google Drive u otro servidor**: fuera de esta fase.

## 9.2 Lista de lo que se elimina, por pantalla

Medido en `main` v548 con búsqueda y número de línea comprobado. Solo texto que
se ve (no comentarios de código). Las páginas de la carpeta `www/` no cuentan:
dejan de usarse con `server.url`.

### Docente · Zona Docente (tarjeta del perfil, `renderProfile`)

| elemento (texto visible) | id / clase | archivo:línea |
|---|---|---|
| «✅ Tus datos se guardan y sincronizan solos en todos tus equipos» | `#doc-sync-status` | `js/app.js:1710` |
| «📴 Datos del aula: esperando internet.» | `#doc-sync-status` | `js/metas-docente-sync.js:504` |
| «⏳ Guardando N cambio(s) en la nube…» | `#doc-sync-status` | `js/metas-docente-sync.js:507` |
| «✅ Datos del aula sincronizados en todos tus equipos.» | `#doc-sync-status` | `js/metas-docente-sync.js:508` |
| «☁️ Sincronizando con la nube…» | `#doc-sync-status` | `js/metas-docente-sync.js:524` |
| Botón «↩️ Recuperar los datos de mi aula» y «Tu aula está vacía… restáuralo aquí» | `.doc-recuperar-banner`, `.doc-rec-s` | `js/app.js:1696-1700` |
| Diálogo y avisos de «Recuperar lo que borré» («No hay nada que recuperar», «Se restaurarán…», «Sí, recuperar», «↩️ Datos recuperados…», «Recuperado aquí; se subirá al reconectar», «No se pudo recuperar…») | `metasConfirm`, toasts | `js/metas-docente-sync.js:653, 662-663, 676, 707, 708, 712` |
| «☁️ Trayendo el aula de TU cuenta…», «⏳ Sincronizando…», «✅ Todo al día» / «⚠️ No se pudo ahora» | toasts, `.doc-sync-now` | `js/metas-docente-sync.js:520, 523, 534` |
| «Empezar de nuevo»: confirmación, «escribe BORRAR», «🗑️ Aula vacía…», «🗑️ Borrado. Se archivará y limpiará la nube…», «No se puede borrar ahora» | `metasConfirm`, `metasPrompt`, toasts | `js/metas-docente-sync.js:561, 564-565, 570-572, 602, 606` |
| «Usar los datos de este equipo»: confirmación, «Sí, usar este», «Este equipo no tenía un aula de TU cuenta…», «✅ Listo: este equipo es ahora la copia buena…» | `metasConfirm`, toasts | `js/metas-docente-sync.js:729, 736-737, 742` |
| «Primero entra a tu cuenta docente» (de esas acciones) | toast | `js/metas-docente-sync.js:515, 558, 722` |
| Cerrar sesión: «…Tranquilo: todo está guardado en la nube de tu cuenta…» y «Sesión cerrada · datos del aula a salvo en tu nube» | `metasConfirm`, toast | `js/app.js:2070-2071, 2080` |
| «📴 Entrar necesita internet», «📴 Crear la cuenta necesita internet (solo esta vez)», «Solo este paso necesita internet.», «📴 Cambiar la contraseña necesita internet», «⚠️ Sin conexión con la nube» | toasts, `.doc-registro-pie` | `js/app.js:1551, 1960, 1671, 2090, 3007, 2134` → ver 9.4 |

### Docente · Ajustes

| elemento | id / clase | archivo:línea |
|---|---|---|
| Sección completa «🚑 Rescate de datos (casi nunca se necesita)» con su texto de ayuda | `details.doc-mant`, `.doc-mant-hint` | `js/app.js:2413-2417` |
| Botón «🔄 Sincronizar ahora» y su explicación | `.doc-sync-now`, `.doc-mant-exp` | `js/app.js:2418-2419` |
| Enlace «🚑 Imponer la copia de ESTE equipo en todos» y su explicación | `.doc-usar-este-link` | `js/app.js:2420-2421` |
| Enlace «🗑️ Empezar de nuevo (borrar mis datos del aula)» y su explicación | `.doc-reset-link` | `js/app.js:2422-2423` |
| «📴 Guardar el perfil necesita internet» / «⏳ Guardando…» | toasts | `js/app.js:2482, 2495` |
| «📴 Ver los permisos necesita internet. Se revisará al volver la señal.», «La nube todavía no tiene esta parte instalada.» | `.padre-hint` | `js/app.js:2828, 2834` |
| «📴 Ver los registros / las altas / Enviar el mensaje / El buzón necesita internet» | toasts | `js/app.js:2549, 2917, 3080, 3110` |

### Docente · Mi aula (todas las pestañas)

| elemento | id / clase | archivo:línea |
|---|---|---|
| Chip «⏳ N por subir» / «☁️ al día» y su ayuda «Nube del chatbot de padres: toca para sincronizar ahora» | `#ad-nube-chip` | `js/tools/registros-admin.js:1207-1209` (se refresca en `:945`) |

### Docente · Mi aula › Alumnos

| elemento | id / clase | archivo:línea |
|---|---|---|
| Tarjeta «☁️ Nube del chatbot de padres y recuperación» con su ayuda | `.pa-card-title` | `js/tools/registros-admin.js:1365-1368` |
| Botones «☁️ Sincronizar ahora», «📥 Copiar notas de mis respaldos», «🕓 Verificar historial de versiones», «🔎 Revisar notas que la aplicación puso sola» | `#ad-sb-sync`, `#ad-lista-recuperar`, `#ad-lista-versiones`, `#ad-lista-revisar-solas` | `js/tools/registros-admin.js:1370-1373` |
| Estados «☁️ Nube del chatbot: al día», «📴 N cambio(s) esperando internet», «🔒 Entra a tu cuenta… para publicar», «⏳ Subiendo N cambio(s)…», «✅ Nube del chatbot al día (hora)», «⚠️ No se pudo subir ahora…» | `#ad-sb-status` | `js/tools/registros-admin.js:12109, 12114, 12119, 12124, 12161, 12171` |
| Toasts «☁️ Registros sincronizados», «☁️ Parcial X subido a la nube…», «☁️ Notas subidas a la nube…» | toasts | `js/tools/registros-admin.js:12162, 12167, 12168` |
| Tarjeta «🕵️ Revisar cruces entre equipos» y botón «🕵️ Revisar cruces del último mes» | `.ad-cruces-btn` | `js/tools/registros-admin.js:265-268` |
| Tarjeta «🕘 Deshacer o restaurar cambios», «Antes de: …», botón «↩️ Restaurar» | `.ad-undo-card`, `.ad-undo-btn` | `js/tools/registros-admin.js:276-282` |
| Confirmación y aviso de restaurar («Se restaurará todo Mi aula…», «Sí, restaurar», «🕘 Restaurado: …») | `metasConfirm`, toast | `js/tools/registros-admin.js:240-246, 258` |
| «Borrar esta fila (puedes restaurarla en 🕘 Deshacer)», «Si necesitas recuperarla después…», «🗑️ Fila borrada… Puedes restaurarla en «🕘 Deshacer»» | `.ad-al-del`, `metasConfirm`, toast | `js/tools/registros-admin.js:1332, 1858, 1943` |
| «…al sincronizar, la vieja deja de funcionar…» (cambiar clave de familia) | `metasPrompt` | `js/tools/registros-admin.js:1572` |
| «…no viajan al asistente de padres, solo a tus equipos.» | `.pa-optional-hint` | `js/tools/registros-admin.js:2492` |
| Cierre de año: «…la nube del chatbot se borra…», «Para cerrar el año se necesita internet (hay que limpiar la nube del chatbot)…», «• La nube del chatbot se limpia…», «⚠️ No pude limpiar la nube… ¿Cerrar el año de todos modos?», «🎓 Año X cerrado y nube limpia / (nube pendiente)» | ayuda, `metasAlert`, `metasConfirm` | `js/tools/registros-admin.js:1391, 11299, 11304, 11343-11344, 11397` (se reescribe el cierre de año, `08`) |
| «…con su lista… y notas de este equipo…» (eliminar grupo) | `metasConfirm` | `js/tools/registros-admin.js:1487` |

### Docente · Mi aula › Economía, Controles, Asistencia, Estadísticas, Acumulativos

| elemento | id / clase | archivo:línea |
|---|---|---|
| Botón «🔎 Buscar pagos o gastos perdidos» | `#ad-col-perdidos` | `js/tools/registros-admin.js:5661` |
| «Ese gasto ya cambió en otro equipo: revisa la lista» | toast | `js/tools/registros-admin.js:5776` (lo reemplaza la pregunta de dos botones) |
| «🗑 Colecta eliminada — si fue un error, restaura en 🕘…» | toast | `js/tools/registros-admin.js:5792` |
| **«Pagos recuperados»**: «Encontré N dato(s) de colecta que ya estaban anotados y se habían perdido. Ya están de vuelta… O usa 🕘 Deshacer» | `metasAlert` | `js/tools/registros-admin.js:3832-3836` |
| «🗑 Control eliminado — si fue un error, restaura en 🕘…» | toast | `js/tools/registros-admin.js:7857` |
| «♊ N fecha(s) quedaron repetidas al sincronizar…» y botón «Unir las fechas repetidas» | `#ad-rf-unir` | `js/tools/registros-admin.js:6946-6947` |
| «📥 Días pegados desde un respaldo… vinieron de una copia vieja…» | `.ad-rf-grupo` | `js/tools/registros-admin.js:6964` |
| «…Antes se guarda una copia en «🕘 Deshacer».» | `metasConfirm` | `js/tools/registros-admin.js:6998` |
| «📴 Sin internet: las excusas se revisan con conexión…» | `.pa-optional-hint` | `js/tools/registros-admin.js:7209` |
| Estadísticas: «🚀 Práctica de misiones (lo que sube a la nube…)», botón «🔄 Consultar la nube ahora», «📴 Sin conexión: se muestra la última consulta guardada», «⚠️ No se pudo consultar la nube…», «☁️ Nube consultada: … al día», «Aún no se ha consultado la nube en este equipo…», «No hay práctica registrada… en la nube…», «Nube sin consultar en este equipo» | `.est-sub`, `#est-nube-btn`, toasts | `js/tools/estadisticas-alumno.js:872, 875, 989-993, 1029, 1043, 1127` (se trae sola al abrir; sin hablar de la nube) |
| «…la 🕘 papelera de la pestaña 👥 Alumnos la devuelve», «🗑 Toma quitada — si fue un error, restaura en 🕘…» | `metasConfirm`, toast, ayuda | `js/tools/estadisticas-alumno.js:941, 947, 1024` |
| «Se borran las notas… en este equipo y en los demás donde abras Mi aula.» | `metasConfirm` | `js/tools/acumulativos.js:426` |

### Docente · Mi aula › Notas SACE y ventanas de recuperación

| elemento | id / clase | archivo:línea |
|---|---|---|
| Botones «🛟 Recuperar o revisar notas» y «🕓 Ver cambios guardados» | `#ad-sace-chip-rescate`, `#ad-sace-versiones` | `js/tools/registros-admin.js:9581-9582` |
| Ventana «🛟 Recuperar o revisar notas» con «📥 Recuperar notas que faltan», «🔎 Buscar notas perdidas», «🔎 Revisar notas puestas solas» y su pie | `#ad-sace-v-rescate`, `#ad-sace-recuperar`, `#ad-sace-perdidos`, `#ad-sace-revisar-solas` | `js/tools/registros-admin.js:9653-9668` |
| «…Se guardan y sincronizan con tus equipos.» | `.pa-optional-hint` | `js/tools/registros-admin.js:9643` |
| «✅ Nada que llenar… (quizá se llenaron desde tu otro equipo).» | estado | `js/tools/registros-admin.js:10156` |
| «Copiar notas de mis respaldos»: «⏳ Buscando en tus respaldos…», «⏳ Buscando en tus copias de este equipo y en la nube…», «Encontré N dato(s)… en otra copia…», «No encontré ninguna nota en tus respaldos…», título y botones, «✅ Copiados N dato(s)…», «⚠️ No se pudo buscar…» | diálogo, toasts | `js/tools/registros-admin.js:8686, 8783, 8788, 8798-8808, 8817, 8819` |
| «Notas que la aplicación puso sola»: «⏳ Buscando la copia de antes…», título, «…ni en tu nube una copia de antes…», «Comparo… con la copia…», «Hoy dice / En la copia de antes», «Borrar las marcadas…», confirmación, «🗑️ Borradas N nota(s); puedes deshacerlo…» | diálogo, toasts | `js/tools/registros-admin.js:8833, 8837, 8855-8858, 8905-8916, 8932` |
| Ventana «🕓 Historial de versiones y respaldos», su ayuda y «⏳ Consultando versiones locales, papelera, espejo docente y nube de padres…» | `#ad-ver-tit`, `.ad-gen-hint`, `.ad-ver-loading` | `js/tools/registros-admin.js:8953-8961` |
| Etiquetas «🕘 Papelera local», «🛡️ Respaldo pre-sincronización», «⚓ Base de sincronización», «☁️ Estado actual en la nube docente», «🗑️ Papelera de sincronización en la nube», «📜 Historial en la nube (versión #N)», «☁️ Espejo docente en la nube», «☁️ Historial de la nube de familias», «⚠️ Trae notas que la aplicación puso sola», «📥 Lo de hoy + lo que falta…» | `.ad-ver-badge` | `js/tools/registros-admin.js:8352-8353, 8368-8369, 8383-8384, 8439-8445, 8459-8460, 8641, 8986, 9009` |
| Botones «👁️ Previsualizar notas», «📥 Recuperar I–III», «↩️ Restaurar versión completa», sus confirmaciones y avisos | `.ad-ver-btn`, `metasConfirm`, toasts | `js/tools/registros-admin.js:9024-9026, 9097-9100, 9138, 9144-9146, 9163, 9169` |
| Ventana «🔎 Buscar datos perdidos»: «↩️ Devolver lo marcado», «Revisé N copia(s)…», «✓ No encontré nada…», «· visto en la copia del …», «☑ Marcar todo», «☁️ Buscar también en el historial de la nube», sus estados y «↩️ Devueltos N dato(s)…» | `#ad-bp-*` | `js/tools/registros-admin.js:3883-3925, 3959` |
| Ventana «🕵️ Revisar cruces entre equipos»: «⏳ Reuniendo las copias…», «↩️ Devolver a cada quien lo suyo», «Revisé N copia(s)…», confirmación, avisos e impresión | `#ad-rc-*`, `.rc-arreglar` | `js/tools/registros-admin.js:6767-6854` |

### Docente · Mi aula › Comunicados

| elemento | id / clase | archivo:línea |
|---|---|---|
| Tarjeta «🤖 Se publican solos / Al sincronizar, el asistente también recibe…» | `.pa-card-title` | `js/tools/registros-admin.js:11625-11626` |
| Estados «☁️ Comunicados: al día», «📴 N comunicado(s) esperando internet», «🔒 Entra a tu cuenta… para publicar», «⏳ Publicando N…», «✅ Comunicados al día (hora)», «⚠️ No se pudieron publicar…», toast «📣 Comunicados publicados» | `#av-sb-status` | `js/tools/registros-admin.js:12362, 12366, 12371, 12375, 12400, 12401, 12403` |
| «📴 Sin internet: el buzón se revisa con conexión.» | `.pa-optional-hint` | `js/tools/registros-admin.js:11854` |

### Docente · Plan de Acción (sale en su corte; hasta entonces se quita solo lo de «nube»)

| elemento | id / clase | archivo:línea |
|---|---|---|
| Botón «Traer las notas de la nube» y sus mensajes («⏳ Trayendo…», «No hay nada traído de la nube…», «…traídas… de la nube (en azul)…») y ayuda «Traída de la nube» | `#pa-nube-btn`, `#pa-nube-msg`, `.pa-de-nube` | `index.html:944-947`; `js/tools/plan-accion.js:3381, 3387, 3434, 3444-3451` (pasa a «Traer las notas de las misiones», sin hablar de la nube) |
| «☁️ Listo: guardado y camino al asistente de padres» / «⚠️ Guardado, pero las familias todavía NO lo pueden ver», «⏳ Enviando…» | `#pa-listo`, `#pa-listo-estado` | `js/tools/plan-accion.js:151-156, 165` |
| «…Todo viaja además a la nube de padres…» | `.pa-optional-hint` | `js/tools/plan-accion.js:669` |
| Ayuda «…suben solos al asistente de padres ☁️…» | `#pa-historial-card` | `index.html:963-967` |
| Chips «☁️ N por subir» / «☁️ En el asistente de padres ✅», botón «☁️ Subir ahora» / «⏳ Subiendo…» | `.pa-hist-nube`, `.pa-hist-subir` | `js/tools/plan-accion.js:1040-1041, 1067, 1167` |
| Botón «📥 Recuperar análisis de la nube», su confirmación y avisos | `.pa-hist-recuperar` | `js/tools/plan-accion.js:982, 2522-2523, 2532, 2774, 2929-2936, 2938` |
| Tarjeta «🔑 Nube de padres» y todos sus estados | `#pa-sync-card`, `#pa-sb-status` | `index.html:973-980`; `js/tools/plan-accion.js:3223-3293` |
| Laboratorio: «🔄 Cruzar nube de misiones», «⏳ Trayendo prácticas de la nube…», «✅ Prácticas… sincronizadas desde la nube», «⚠️ No se pudo refrescar la nube…», «☁️ Sin caché local…», «⚪ Sin práctica registrada en nube» | `#pa-lab-sync-nube` | `js/tools/plan-accion.js:1705, 1910, 1936, 2419-2424` |

### Docente · Convocatoria (sale en su corte)

| elemento | id / clase | archivo:línea |
|---|---|---|
| Botón «🔄 Traer las respuestas», «Última vez que se trajeron: …», «Todavía no has traído las respuestas…», «⏳ Trayendo las respuestas…», «⚠️ No se pudieron traer (sin internet)…» | `#cv-refrescar`, `#cv-refresco` | `js/tools/convocatoria.js:891, 895-897, 3264, 3268-3269` (se traen solas al abrir) |
| «💾 Guardado y actualizado para los padres» / «💾 Guardado aquí · sin internet, súbelo luego», «⚠️ Sin internet: se aplicará cuando haya señal», «🗑️ Quitada de tu lista · sin señal para el enlace, se reintenta solo», «No pude publicarla. Puede ser que no haya internet…» | toasts, `metasAlert` | `js/tools/convocatoria.js:372, 2805, 2828-2829, 2871` |
| «…Las respuestas… se quedan en la nube…» | `metasConfirm` | `js/tools/convocatoria.js:3014` |

### Padres

| elemento | id / clase | archivo:línea |
|---|---|---|
| Zona Padres del inicio: «🔑 Notas desde cualquier lugar» + «Consultar», «📴 La consulta necesita internet…», «⏳ Consultando la nube…», «…espere a que él suba las notas», «⚠️ No se pudo consultar…», «⚠️ El resumen de arriba vive en el teléfono…» | `.padre-nube`, `#padre-nube-out`, `.padre-aviso` | `js/app.js:1382-1389, 1403-1404, 1430, 1433, 1445-1446, 1470` (pasa a abrir `padres.html`) |
| Chip «🔄 Actualizar» | chip del menú | `padres.html:425` (manejador `:1557`) |
| «📴 (datos guardados el <fecha> — toque «🔄 Actualizar» con internet)» | small | `padres.html:453` |
| «⚠️ El maestro no publica desde el …», «🕐 Datos del maestro al …» | small | `padres.html:474-475` |
| «⏳ Un momento, consulto las notas…», «Aún no hay notas guardadas… el maestro todavía no las suba…», «📴 Ahorita no hay internet y todavía no tengo notas guardadas…», «⚠️ No pude consultar la nube…» | `botSay` | `padres.html:571, 575-578, 582-583, 586` |
| «…él lo marca recibido y aquí se actualiza.» | small | `padres.html:923` |
| «⚠️ No encontré ese recibo. Toque «🔄 Actualizar»…» | `botSay` | `padres.html:1060` |
| «📴 Ahorita no hay internet, así que no puedo entregar el recado…» | `botSay` | `padres.html:1260` (el recado espera solo y sale con señal) |
| «🔑 Clave … guardada. Consultando la nube…», «La clave quedó guardada, pero aún no hay notas… Toque «🔄 Actualizar» más tarde», «📴 No hay internet en este momento…», «⚠️ No pude consultar la nube…» | `botSay` | `padres.html:1421, 1439-1444, 1447, 1759` |
| «Consultando las notas…», «Aún no hay notas para esa clave. Toque «🔄 Actualizar»…», «📴 No hay internet ahorita…», «👀 Desde su última visita…» | `botSay` | `padres.html:1697, 1745, 1753, 1756` |
| `salida.html`: «No se pudo mandar por internet…», «🔄 Probar otra vez con internet», «Parece que no hay internet…» | `.aviso`, `#g-reintentar` | `salida.html:857, 862, 1077` (la respuesta se guarda en el teléfono y sale sola; queda el botón de WhatsApp `:861`) |

### Android

Sin texto propio: `android/app/src/main/res/values/strings.xml` solo tiene
`app_name` y `title_activity_main`, y `MainActivity.java` está vacío. Todo lo
que ve el usuario en el APK sale de las páginas web de arriba. Además:

| elemento | archivo:línea | qué se hace |
|---|---|---|
| `android:allowBackup="true"` (respaldo del sistema, sin texto) | `android/app/src/main/AndroidManifest.xml:5` | se pone en `false`: la app ya no guarda datos del aula en el teléfono que valga la pena respaldar, y un respaldo del sistema podría devolver una cola o una sesión vieja |
| Página sin señal del service worker: «M.E.T.A.S. · Sin señal suficiente», «No hay señal suficiente para abrir M.E.T.A.S por primera vez.», «Reintentar» | `sw.js:311, 332-333` | ver 9.4 |

### Otras páginas del docente

| elemento | id / clase | archivo:línea |
|---|---|---|
| `consulta-nube.html`: título «☁️ Consulta en la Nube», «…sincronizados a Supabase», «☁️ Subir pendientes de este dispositivo», alertas «La capa de nube aún no carga…» / «N resultados subidos a la nube…», «Por subir (este equipo)», «…hayan tenido internet para sincronizar», «📭 Aún no hay fotos de progreso en la nube…», estados «📴 Sin conexión…», «⏳ Consultando la nube…», «✅ … recibidos de la nube», «🗑 Quitar esta fila de la nube» | varios | `consulta-nube.html:6, 74, 75, 113, 123, 135-136, 193, 242, 245, 266, 286, 307, 375, 391, 433, 435` (la página pasa a «Resultados de mis alumnos», sin nube ni pendientes) |
| `panel-docente.html`: «☁️ Consulta rápida con clave», «🔑 Restaurar claves de familia» y sus estados («⏳ Consultando nube…», «⚠️ Sin claves en la nube aún», «✅ N claves restauradas») | `#btnRestaurar` | `panel-docente.html:71, 111, 351, 361, 377` |
| `registro.html`: «☁️ Consulta en la nube (todos los dispositivos)» | `.btn-blanco` | `registro.html:71` |
| `privacidad.html`: «…lo que guarda en Mi aula se sincroniza con su cuenta…», «El maestro puede vaciar su nube… se archiva y se limpia…», «Su clave… no se sincroniza nunca…» | párrafos | `privacidad.html:82, 88-89, 91` (se reescribe para el modelo nuevo; es el aviso legal) |
| `kit-auto-1.html`, `kit-auto-2.html`: «offline-first… la nube es una copia», «☁️ NUBE · Supabase», «copia local → abre SIN internet», «…cliente de nube, sincronización docente…» | tablas y diagrama | `kit-auto-1.html:139-143, 170, 180, 186`; `kit-auto-2.html:144` (material de capacitación técnica: se actualiza en su corte) |

### Lado del alumno (fuera de la regla, propuesta)

La regla nombra docente, padres y Android. En las misiones del alumno hay
cuatro textos del mismo tipo; propongo tratarlos igual (indicador sin texto):
«📴 Sin internet: se confirmará al reconectar.» (`js/metas-registro.js:536`,
`js/metas-i18n.js:100`), «📴 Ahora mismo no hay internet. La lista se ve…»
(`js/videos-mision.js:1062`), «☁️ Lista actualizada por el equipo…» /
«💾 Última lista guardada en este aparato» (`js/videos-mision.js:1090-1091`).
Pendiente de tu decisión.

### No se tocan (otro significado)

«Recuperar contraseña» (`js/app.js:2014-2060`), «🚪 Entrar a mi aula» (la
función se llama `docenteRecuperar`, `js/app.js:1619`), la nota de
**recuperación** del SACE (`js/tools/registros-admin.js:3349-3459, 9215,
9554-9555`), «Ya recuperado» de un gasto que le devolvieron al docente
(`js/tools/registros-admin.js:4123, 4550, 4604, 4835, 4849`; pasa a
«reembolsado», `v_gastos_docente`), «Documento de respaldo del trabajo del
aula» en el expediente impreso (`:4209`), «📅 Días perdidos» (inasistencias,
`:9021`, desaparece con la ventana de versiones), «Faltan por subir N
personas» al bus (`js/tools/convocatoria.js:1306, 1321`), el botón de
actualizar la app (`index.html:123`), los diálogos de «Guardar / Compartir»
de Android (exportar, no sincronizar) y «Empezar la misión de cero» del
alumno (`js/metas-registro.js:601`).

`buzon.html` es del buzón de lectores (otro proyecto, F.A.R.O): su aviso
«Le quedó algo sin mandar…» (`buzon.html:490-494, 1064-1075`) queda fuera de
esta regla salvo que digas lo contrario.

## 9.3 Dónde va el indicador sin señal

Una sola pieza compartida (`js/datos/senal.js`) que escucha `online` /
`offline` y la respuesta real de la última petición (un `navigator.onLine`
verdadero no garantiza señal). La pintan la barra de arriba del inicio, de
Mi aula y de `padres.html`. Nada más en la app habla de la conexión.

## 9.4 Pendiente de tu decisión

1. **Primera vez sin señal** (entrar, crear la cuenta, abrir la app por
   primera vez en Android): no hay datos que mostrar y el punto gris solo no
   explica qué hacer. Propuesta: una sola frase neutra en esa pantalla, «Para
   entrar la primera vez se necesita señal», sin íconos de alarma.
2. **Lado del alumno**: ¿aplicar la misma regla?
3. **`buzon.html`** (lectores): ¿aplicar la misma regla?
