# 8. Plan de implementación por cortes

Fase 1: diseño (revisión 2). Cada corte es un cambio que se publica entero,
con sus pruebas en verde, y que deja la app funcionando. Ningún corte se
empieza sin tu aprobación.

## 8.0 Antes del primer corte: la vinculación de cuentas (fase aparte)

- `SUPABASE-V2-VINCULACION.sql`, función de borde `metas-entrar` (con el
  freno por IP), `metas-salir-todos` (llamada también desde `reset-clave`),
  configuración del panel (alta pública apagada, sesiones anónimas con
  Turnstile obligatorio, esquema `metas` expuesto).
- El docente no ve ningún cambio: entra con su correo y su contraseña. Por
  debajo ya tiene sesión de Supabase.
- Se prueba con cuentas ficticias (T6 de `06-PRUEBAS.md`).
- Se puede deshacer **mientras nadie haya creado datos** en la base nueva.

## 8.1 Corte 1: dinero, alumnos, notas, asistencia y controles

**Tablas** (de `SUPABASE-V2-ESQUEMA.sql`): `aulas`, `periodos`, `asignaturas`
(son la base de todo lo demás), `alumnos`, `familias` (la ficha del alumno y
su clave: la vista de padres la necesita para mostrar el dinero y las notas),
`colectas`, `colecta_exenciones`, `pagos`, `gastos` (de colecta),
`gastos_docente`, `reembolsos`, `notas`, `notas_personalidad`,
`inasistencias_oficiales`, `asistencia_dias`, `asistencia`, `controles`,
`control_valores`; más auditoría, rechazos, recibos y frenos. Y de
`SUPABASE-V2-FAMILIAS.sql`, lo que lee esos datos (vínculo, vistas `vf_hijos`,
`vf_colectas`, `vf_pagos`, `vf_cuentas_claras`, `vf_notas`,
`vf_personalidad`, `vf_asistencia`, totales por colecta, aviso por Realtime).

**Código nuevo**: `js/datos/` entero (ids, montos, nube, almacén, cola,
tiempo real, cálculos), la carga rápida (aula, alumnos, notas, colectas),
las tarjetas de pregunta de dinero y de «¿es la misma persona?», la línea
«Guardado / Guardando… / Sin señal», y en `padres.html` la sesión anónima
con Turnstile, `familia-vincular` y las vistas.

**Herramientas que pasan a filas**: Mi aula (lista, ficha, familias), colectas
y pagos, gastos de colecta, gastos del docente, Notas SACE (notas,
personalidad, recuperación, inasistencias oficiales), asistencia diaria y
justificaciones, controles y registros. Boletas, cuadros SACE, cuadros
estadísticos, lista oficial del SACE (`sace-lista.js`) y `ResumenSace`
**leen filas**.

**Se elimina en este corte** (de `05-ELIMINACION-Y-ANDROID.md`): la
reposición de pagos (`adPagosDesdeRegistroNube`, `adRecuperarSolo`, el aviso
«Pagos recuperados»), `buscar-perdidos.js`, `revisa-cruces.js`, el deshacer
por fotos (`METAS_ADMIN_UNDO_V1`), las lápidas, la reconstrucción de notas
desde respaldos e historial, todos los botones de recuperar, restaurar y
sincronizar, la copia al chatbot de pagos, notas y asistencia
(`adFilasNube`, `adSincronizarNube`, chip «N por subir»), la caché del padre
(`METAS_PADRE_CACHE_V1`), la contraseña en `METAS_DOCENTE_V1`, las llaves
`METAS_SB_URL`/`METAS_SB_KEY`, y las sondas que probaban todo eso.

**SQL**: esquema y familias (corte 1), y el **paso 1** de
`SUPABASE-V2-CONGELAR.sql`.

**Android**: `server.url` desde este corte, para que web y Android corran lo
mismo desde el primer día del modelo nuevo.

**Normas**: se reescriben las reglas 4 y 5 de `CLAUDE.md` (pendiente de tu
aprobación, ver `05`, sección 5.6).

### Cómo conviven el corte 1 y lo que todavía no pasa a filas

- Lo que aún no pasa a filas (avisos, conducta, preguntas frecuentes, plan de
  acción, acumulativos, instrumentos, lecturas, equipos, bitácora, inventario,
  convocatorias, Campeonísimo, gobierno escolar) **sigue guardándose como
  hoy**, en su llave local y en el blob, hasta su corte. El espejo y la fusión
  siguen vivos **solo para esas llaves**, y la app nueva **quita** del blob
  todo lo del corte 1 antes de subirlo (no se sube ni se lee ningún pago,
  nota, asistencia ni alumno por ese camino).
- Esas herramientas nombran alumnos (avisos individuales, conducta, plan de
  acción, acumulativos, lecturas, equipos). Desde el corte 1 los toman de la
  lista nueva y **guardan el id del alumno (uuid), no su número de lista**.
  Lo que tenían guardado con los números de la lista vieja **no se traslada**
  (la base nueva empieza vacía; queda en el archivo). Pendiente de tu
  aprobación: es una pérdida de comodidad para el docente en esas
  herramientas hasta su corte.
- Avisos y conducta para las familias siguen saliendo por el canal viejo
  (`mensajes_docente`, con la clave de familia) hasta el corte 2. Para que le
  lleguen a una familia de un aula ya cargada, su clave tiene que ser la
  **conservada**. Riesgo: una familia con clave **nueva** no recibe avisos
  hasta el corte 2. Por eso se recomienda que el corte 2 siga pronto.

## 8.2 Corte 2: avisos, conducta, preguntas, plan de acción, evaluaciones

Tablas `avisos`, `aviso_destinatarios`, `preguntas_frecuentes`,
`observaciones` (conducta y expediente), `avisos_vistos`, `analisis`,
`analisis_alumnos`, `evaluaciones`, `evaluacion_puntos`, `instrumentos`; vistas
`vf_avisos`, `vf_observaciones`, `vf_preguntas`, `vf_plan_accion`; buzón nuevo
del docente sobre `metas` (reemplazo de `metas_buzon_docente`). **Paso 2** de
`CONGELAR`.

## 8.3 Corte 3: aula del día a día

`bitacora`, `lecturas`, `repartos`, `reparto_miembros`, `bienes` y
`actas_inventario` (con su acta inicial y el aviso de «toca acta» cada 3
meses).

## 8.4 Corte 4: el resto, y cierre del modelo viejo

`convocatorias`, `convocatoria_inscritos`, `convocatoria_pagos` (con sus
funciones de dinero y la decisión del PIN), `campeonatos`, `elecciones`,
`eleccion_votos`, `ajustes_docente`. Directores en **solo lectura** (política
según `docente_permisos`).

Con este corte ya nada vive en el blob: se borran del código
`metas-docente-sync.js`, `metas-fusion-aula.js` y el resto de
`metas-numeracion.js`, y se corre el **paso 3** de `CONGELAR`.

## 8.5 Después: cerrar el archivo para las familias

Cuando la consulta de soporte diga que ya no quedan claves sin aula nueva (o
tú decidas cerrar), **paso 4** de `CONGELAR`: el portal deja de consultar el
archivo.

## 8.6 Lo que exige cada corte antes de publicarse

1. `npm test` y `npm run test:datos` en verde, y las pruebas de su sección de
   `06-PRUEBAS.md` escritas **antes** del código.
2. Los cuatro contadores de 6.1 en cero en la prueba de estrés de esa noche.
3. Sellar la versión (`?v=` y `CACHE_NAME`) como siempre.
4. Confirmar la publicación con el `head_sha` en `completed / success`.
5. El SQL del corte va completo en la respuesta del chat, con orden, qué
   comprobar y cómo deshacerlo, y lo pegas tú en el SQL Editor.
