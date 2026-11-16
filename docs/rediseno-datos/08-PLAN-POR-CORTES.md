# 8. Plan de implementación por cortes

Fase 1: diseño (revisión 4). Cada corte se publica entero, con sus pruebas en
verde, y deja la app funcionando. Ningún corte se empieza sin tu aprobación.

**Decisiones de Josué (revisión 4)**: la vinculación con Supabase Auth va,
primero con `supabase start` y cuentas ficticias; el corte 1 **empieza en la
rama** y **se publica solo** con N1 y N2 resueltos y la capa A en verde
contra `supabase start`; el plan de acción no publica a las familias hasta su
corte (pausa aceptada).

## 8.0 Antes del primer corte: vinculación de cuentas (fase aparte)

- `SUPABASE-V2-VINCULACION.sql` (crea `metas`, el freno de intentos, el
  vínculo y la copia de claves), funciones de borde `metas-entrar` (con el
  freno por IP antes de validar la contraseña), `metas-salir-todos` (llamada
  también desde `reset-clave`) y `familia-vincular`; panel: alta pública
  apagada, sesiones anónimas con **Turnstile obligatorio**, esquema `metas`
  expuesto.
- El docente no ve ningún cambio. Se prueba **primero en `supabase start`**
  con cuentas ficticias (aprobado), y solo después en el proyecto real.
- Se puede deshacer **mientras nadie haya creado datos** en la base nueva.

## 8.1 Corte 1: dinero, alumnos, notas, asistencia, controles, avisos y conducta

**Empezar** (aprobado): en la rama, con la capa A en verde
(`pruebas-capa-a/corre.sh`, hoy 271 pruebas). Preparación hecha (rev. 6):
`_dev/supabase-local/` con la CLI fija y `corre-supabase.sh`, las tres
funciones de borde con su capa A+, y las capas B y C escritas antes del
código (`06`, 6.6 y 6.7). Lo siguiente es el código: `js/datos/` hasta poner
en verde la capa B, y la pantalla hasta poner en verde la capa C.

**La IP de los frenos, confirmada** (rev. 8): en un proyecto de prueba aparte
`cf-connecting-ip` trae la IP real y no se puede inventar (`06`, 6.8): los
frenos por IP se quedan en el corte 1. `true-client-ip` y `x-forwarded-for`
no se usan nunca. **Antes de fijar la fecha del paso 4**: activar pg_cron, y
fijarla cuando falten menos de 11 meses (más lejos se rechaza, `MT044`).

**Corte 1, parte 1 (rev. 8)**: `js/datos/` escrito, capa B en verde.

**Corte 1, parte 2 (rev. 9)**: Mi aula del corte 1 (`js/tools/mi-aula.js`)
sobre filas, la entrada por `metas-entrar`, la entrada nueva de las familias
en `padres.html` (solo con la base de prueba o con Turnstile configurado) y
la capa C en verde. Lo que todavía no pasó a filas se abre desde «Más del
aula» con la pantalla de antes. Lo que falta de 09 está en `09`, 9.5.
Antes de publicar: la llave de Turnstile del sitio (`padres.html`,
`TURNSTILE_SITEKEY`), el blob por sesión para las herramientas que quedan, y
quitar la sesión vieja.

**Corte 1, parte 3 (rev. 11)**: listo para publicar, con su guía
`10-PUBLICAR.md`.
- Blob por sesión: Equipos, Acumulativos, Estadísticas, Lectura e Inventario
  guardan con `metas.blob_leer` / `metas.blob_guardar`
  (`js/metas-blob-sesion.js`, reemplaza a `js/metas-docente-sync.js`, que ya
  no carga). La pantalla de antes se arma desde las filas
  (`js/tools/mi-aula-puente.js`). «Gastos de mi bolsillo» va a filas
  (`gastos_docente`, `reembolsos`): el candado del paso 1 no lo deja volver
  al blob. La observación del grado va a `metas.aulas`. Capa C, C12 a C15.
- Importar un archivo (4.4): `js/datos/importar.js`, formato exacto en
  `04-FORMATO-IMPORTACION.md`. Capa B, B13; capa C, C16.
- `SUPABASE-V2-DESCONGELAR.sql`, probado de ida y vuelta (capa A, 20 y 21).
- Android: `server.url` y `versionCode 4`, sin firmar (`11-APK-ANDROID.md`).
- Sigue pendiente: la contraseña en `METAS_DOCENTE_V1` para lo de la cuenta
  que no tiene versión por sesión (10, 7), Turnstile del portal de familias
  y el cierre de año.

**Publicar**: solo con N1 y N2 resueltos (lo están en la revisión 4) y la
misma capa A en verde **contra `supabase start`**.

**Tablas**: `aulas`, `periodos`, `asignaturas`, `alumnos`, `familias`,
`colectas`, `colecta_exenciones`, `pagos`, `gastos`, `gastos_docente`,
`reembolsos`, `notas`, `notas_personalidad`, `inasistencias_oficiales`,
`asistencia_dias`, `asistencia`, `controles`, `control_valores`, **`avisos`,
`aviso_destinatarios`, `observaciones` (conducta y expediente),
`preguntas_frecuentes`, `avisos_vistos` y `bitacora`** (adelantados: ver
abajo). Y de `SUPABASE-V2-FAMILIAS.sql`, todo lo que lee esos datos.

**Por qué avisos, conducta, preguntas y bitácora entran ya**: todo eso le
llegaba a las familias por `avFilasNube` → `metas_guardar_avisos`, que pide
la contraseña del docente en cada llamada. La app nueva ya no la guarda, así
que no podría seguir publicando por ese camino. Con estas tablas en el corte
1, `avFilasNube` desaparece entero (incluidos los `AVC-` y `AVR-` de cuentas
y recibos, `js/tools/registros-admin.js:12286-12330`) y las familias leen todo
de la base nueva.

**Código nuevo**: `js/datos/` entero; carga rápida (aula, alumnos, familias
con su clave, notas, colectas, gastos del docente); tarjetas de pregunta;
el punto gris de «sin señal»; en `padres.html`, sesión anónima con Turnstile,
`familia-vincular`, las vistas y la transición aula por aula.

**Herramientas que pasan a filas**: Mi aula (lista, ficha, familias),
colectas, pagos, gastos de colecta, gastos del docente, Notas SACE,
asistencia y justificaciones, controles, comunicados (avisos, conducta,
preguntas frecuentes, bitácora). Boletas, cuadros, `sace-lista.js` y
`ResumenSace` leen filas.

**«Cerrar el año escolar» se reescribe** (`js/tools/registros-admin.js:11235-11338`)
para la base nueva: el aula del año que termina queda de solo consulta, sus
familias se dan de baja (los teléfonos vinculados dejan de ver) y el año
nuevo es un aula nueva. Mientras haya datos en el archivo, la versión nueva
también llama a `metas_cerrar_familias` para borrar las claves viejas del
chatbot; por eso esa función **sigue abierta** hasta el paso 4. Como estamos
en pleno cierre de año, el corte 1 no se publica en medio de un cierre: o
antes de que empiece, o cuando el docente ya cerró.

**Se elimina** (lista con archivo:línea en `05` y `09`): sincronizar,
recuperar, restaurar, papelera, versiones, copias, «usar este equipo»,
«empezar de nuevo», «pagos recuperados», `buscar-perdidos.js`,
`revisa-cruces.js`, la reposición de pagos, el deshacer por fotos,
`avFilasNube`, `adFilasNube`, la caché del padre, la contraseña en
`METAS_DOCENTE_V1`, `METAS_SB_URL`/`METAS_SB_KEY`.

**SQL**: esquema, familias y el **paso 1** de `SUPABASE-V2-CONGELAR.sql`
(copia de claves, candado del blob, `-2` para apps viejas, blob por sesión,
`mensajes_docente` cerrado para docentes vinculados, `registro_admin`
congelado salvo el borrado del cierre de año, funciones cerradas).

**Android**: `server.url` (aprobado) desde este corte, y retiro de la APK
v480 (8.6).

### Cómo convive el corte 1 con lo que todavía no pasa a filas

- **Siguen en el blob** hasta su corte: plan de acción, acumulativos e
  instrumentos, lecturas, equipos, inventario, convocatorias, Campeonísimo,
  gobierno escolar. La app nueva los guarda con `metas.blob_guardar` y los lee
  con `metas.blob_leer` (por sesión, sin contraseña). El **candado** del
  servidor impide que por ese camino vuelva al blob cualquier cosa del corte 1
  (`MT040`), aunque la mande una app vieja, una pestaña vieja o un SQL a mano.
- **Plan de acción, acumulativos, lecturas y equipos empiezan en blanco en
  su corte** (decidido). Hasta entonces funcionan como hoy en el aparato. El
  día de su corte, la herramienta le dice al docente, una sola vez y en
  lenguaje claro: «Desde hoy, el plan de acción se guarda de otra forma y
  empieza vacío. Lo que tenías antes queda en tus papeles impresos». Nada
  técnico.
- Mientras plan de acción siga en el blob, **no publica a las familias**
  (`metas_guardar_plan` también pide la contraseña). Vuelve a publicar en su
  corte. **Pausa aprobada** (revisión 4).

## 8.2 Corte 2: plan de acción, acumulativos, instrumentos, lecturas y equipos

`analisis`, `analisis_alumnos`, `evaluaciones`, `evaluacion_puntos`,
`instrumentos`, `lecturas`, `repartos`, `reparto_miembros`; vista
`vf_plan_accion`. Empiezan en blanco (8.1). **Paso 2** de `CONGELAR`.

## 8.3 Corte 3: inventario, convocatorias, Campeonísimo, gobierno escolar

`bienes` y `actas_inventario` (acta inicial; aviso de «toca acta» cada 3
meses), `convocatorias`, `convocatoria_inscritos`, `convocatoria_pagos` (con
sus funciones de dinero y la decisión del PIN), `campeonatos`, `elecciones`,
`eleccion_votos`, `ajustes_docente`. Directores en **solo lectura**. Con este
corte ya nada vive en el blob: se borran `metas-docente-sync.js`,
`metas-fusion-aula.js` y el resto de `metas-numeracion.js`, y se corre el
**paso 3** de `CONGELAR`.

## 8.4 Cierre del archivo para las familias (paso 4)

Cuando todos los docentes estén migrados **o** al terminar el **primer parcial
de 2027**, lo que llegue primero, con **dos semanas de aviso** a docentes y
familias (decidido). La consulta del paso 4 dice cuántos docentes faltan por
vincular, cuántos vinculados no tienen aula y cuántas aulas del archivo no
tienen aula nueva. Con el paso 4 se cierran también `metas_cerrar_familias`,
`metas_guardar_avisos` y, si ya tienen reemplazo, el buzón y los «vistos»
viejos.

En esa misma fecha **vencen las claves viejas de familia** (N3, decisión de
Josué). Con el aviso de dos semanas se fija la fecha (hito
`claves_viejas_vencen`) y «Mi aula» le pide al docente imprimir las tiras
nuevas; la tira nueva sirve desde que se imprime, la vieja hasta la fecha.

## 8.5 Lo que exige cada corte antes de publicarse

1. Capa A en verde; capas B y C de su sección de `06-PRUEBAS.md`, escritas
   **antes** del código.
2. Los cuatro contadores de 6.1 en cero en la prueba de estrés de esa noche.
3. Ninguno de los textos de `09-INTERFAZ.md` en ninguna pantalla.
4. Sellar la versión (`?v=` y `CACHE_NAME`) como siempre.
5. Confirmar la publicación con el `head_sha` en `completed / success`.
6. El SQL del corte, completo en la respuesta del chat, con orden, qué
   comprobar y cómo deshacerlo; lo pegas tú en el SQL Editor.

## 8.6 Retiro de las APK v480

La APK instalada hoy lleva dentro una copia vieja de la web (`www/`, v480) y
no se actualiza sola. Plan:

1. **Antes del corte 1**: se arma la APK nueva (`server.url`,
   `versionCode` 4) firmada con **la misma llave de release** que la v480
   (`android/app/build.gradle:3-6`: el keystore vive fuera del repositorio).
   Con la misma llave, instala **encima** de la v480 sin desinstalar. Si la
   llave se perdió, hay que desinstalar la vieja primero (y con ella sus datos
   locales, que de todas formas no se usan en la base nueva).
2. **Se reparte por el mismo camino de siempre** (enlace directo), con una
   página corta en el sitio, «Actualiza la app de M.E.T.A.S», y un mensaje a
   los docentes dos semanas antes del corte 1.
3. **Desde el corte 1, la v480 ya no puede hacer daño**:
   - lo del corte 1 que intente subir lo rechaza el candado con `-2`; la app
     vieja lo deja pendiente (no lo marca como subido, `js/metas-docente-sync.js:281`);
   - no puede restaurar versiones ni papelera (funciones cerradas);
   - no puede publicar recibos ni avisos para familias de un docente
     vinculado: `metas_guardar_avisos` lo reconoce por el código con que
     entra y responde `-2` (lo deja pendiente), y el disparador `MT041` es el
     respaldo;
   - no puede subir el encabezado de boleta, las asignaturas, los logos, la
     fecha de corte de edad ni la observación del grado (`-2`);
   - las familias de un docente vinculado ya no leen nada que venga de ella.
4. **Seguimiento**: cada intento de una app vieja queda en
   `metas.blob_rechazos` (código de docente, llave, aparato, motivo). Una
   consulta semanal dice qué docentes siguen usando una APK o una pestaña
   vieja, para escribirles directamente.
5. **La app vieja no puede mostrar nuestro mensaje** «actualiza la app»: su
   código es el de hace meses y solo enseña sus propios textos. Por eso el
   aviso real va por el mensaje a los docentes y la página del sitio; el
   servidor solo garantiza que no se pierda ni se invente nada.
