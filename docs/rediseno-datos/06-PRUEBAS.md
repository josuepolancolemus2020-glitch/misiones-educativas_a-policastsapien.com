# 6. Plan de pruebas automáticas

Fase 1: diseño (revisión 2). Las pruebas se escriben en la fase de
implementación, **antes** del código que prueban, y se corren siempre con
**datos ficticios** contra una base **de prueba**, nunca contra producción.

## 6.1 Criterio de aceptación

Después de cada escenario y al final de cada corrida, el informe cuenta cuatro
cosas, y las cuatro tienen que ser **cero**:

| contador | qué cuenta | cómo se mide |
|---|---|---|
| **inventados** | pagos, gastos, notas o asistencias activos que ninguna acción del docente simulado creó | cada fila activa tiene en `metas.auditoria` un `crear` cuyo `op_creacion` está en el registro de acciones del escenario |
| **revividos** | filas que estuvieron borradas o anuladas y volvieron a estar activas | ninguna fila de auditoría con `antes.deleted_at` no nulo; ninguna edición posterior a un `borrar` de la misma fila |
| **duplicados** | dos filas activas para lo mismo | por llave natural (nota, asistencia, valor de control, alumno por identidad) y, en pagos y gastos, ninguna fila que el oráculo no tenga: un pago anotado en dos aparatos queda **uno** salvo que el docente simulado haya respondido «son dos pagos» |
| **mal asignados** | un pago, nota o asistencia en un alumno distinto del que el docente tocó | se compara `alumno_id` con el id del alumno que el escenario tocó, sin importar su nombre ni su número de lista |

Además, sin excepción:

- **Ninguna decisión de dinero sin el docente**: cada vez que dos aparatos no
  coinciden en un monto o una fecha, el registro muestra una pregunta con los
  dos valores y la respuesta simulada; nunca «ganó el segundo».
- **Convergencia**: al final, cada aparato muestra exactamente lo de la base.
- **Totales** (`v_colectas_resumen`, `v_colecta_alumnos`) iguales a los del
  oráculo, centavo por centavo.
- **Cola vacía**, ninguna pregunta sin responder, y «no quedó anotado» solo con lo
  que el escenario espera.

## 6.2 Andamio

| capa | con qué | qué prueba |
|---|---|---|
| **A. Base** | **Ya escrita y en verde**: Postgres 16 local desechable con un Supabase simulado (`pruebas-capa-a/`, ver 6.5); más adelante también contra `supabase start` (Docker) para probar Realtime y Auth reales. Los cuatro `.sql`; usuarios de Auth ficticios: 2 docentes vinculados, 1 usuario de Auth **sin** vínculo, 3 sesiones anónimas; datos congelados ficticios en `public.docente_estado` | restricciones, disparadores, RLS (permisiva y restrictiva), auditoría, recibos, funciones de dinero, vistas, familias |
| **B. Cola y conflictos** | Node + `fake-indexeddb`; N instancias de `MetasDatos` con su almacén y su `device_id`; un **proxy de red** que corta, demora, y **pierde la respuesta después de que la base aplicó**; un «docente simulado» que responde las preguntas según el guion | sin conexión, orden, idempotencia, conflictos, preguntas de dinero, identidad, Realtime |
| **C. Navegador** | Playwright con 3 contextos (teléfono 390 px, tablet 800 px, PC 1366 px), `context.setOffline` | la pantalla: con señal no hay ningún indicador; sin señal, solo el punto gris (con su `aria-label`); tarjetas de dos botones; carga rápida; **ninguno** de los textos de `09-INTERFAZ.md` aparece en ninguna pantalla |

Datos ficticios con semilla fija (`_dev/datos-ficticios.js`): «Escuela
Ficticia Las Flores», 43 alumnos «Alumna Ficticia 01»…, identidades
`0000200000001`…, colectas «Excursión (ficticia)». Nunca datos reales.

**El oráculo.** Cada escenario escribe lo que el docente hizo y lo que
respondió a cada pregunta. El oráculo aplica eso en el orden en que llega a la
base, con las reglas de `03`, y produce el estado esperado.

## 6.3 Escenarios

### Seguridad de las sesiones (corrección 1 de la revisión 2)

| # | escenario | se espera |
|---|---|---|
| S1 | **Sesión anónima intenta crear** un aula, un alumno (`alumno_crear` y `insert` directo), una familia y un pago (`pago_crear`) | **todos rechazados** con `42501`; 0 filas nuevas; 0 filas en auditoría |
| S2 | **No se puede descubrir si una clave existe insertando**: una sesión anónima inserta una familia con una clave que **existe** y con otra que **no existe** | el mismo error, el mismo código, sin diferencia medible de tiempo (se compara la mediana de 50 intentos) |
| S3 | Usuario de Auth **sin** fila en `metas.cuentas` (por ejemplo, uno de `panel-docente`) | igual que S1: no lee ni escribe nada de `metas` |
| S4 | Sesión anónima lee directo `metas.pagos`, `alumnos`, `auditoria`, `rechazos`, `recibo_series` | 0 filas en todas |
| S5 | Docente B intenta leer, editar o colgar un pago de un alumno de A conociendo los uuid | 0 filas al leer; error al escribir (RLS y llave compuesta) |
| S6 | `delete` físico en cualquier tabla de `metas`, con `authenticated` y con `service_role` | rechazado |
| S7 | `update`, `delete`, `truncate` sobre `metas.auditoria` | rechazados para todos los roles de la app |
| S8 | `rechazos`: una operación de 20 KB; 250 rechazos en una hora | la de 20 KB no entra; de los 250 quedan 200 |
| S9 | Ninguna función de `metas` ejecutable por `public` (consulta del catálogo) | 0 |

### Dinero: sin upsert, monto inmutable, abonos

| # | escenario | se espera |
|---|---|---|
| M1 | **`upsert` en `pagos`** y en `convocatoria_pagos` por la API (`Prefer: resolution=merge-duplicates` y `ignore-duplicates`) | **permiso denegado** (no hay `INSERT` ni `UPDATE`); además, la sonda rápida no encuentra `.upsert(` sobre esas tablas en el código |
| M2 | `update metas.pagos set monto = …` por la API, y por SQL como docente | denegado; por función, `pago_editar` con `monto` → `campo_no_editable` |
| M3 | Corregir un pago de L 50 a L 60 | el de 50 queda anulado con motivo; nace uno nuevo de 60 con `reemplaza_a` y **otro recibo**; la familia ve el nuevo con «corrige al recibo …» |
| M4 | Tres abonos de L 20 al mismo alumno en la misma colecta | tres pagos, tres recibos, pagado = 60 |
| M5 | Dos aparatos sin señal anotan el pago de Ana para Excursión: **L 50** y **L 60** | al llegar el segundo, **pregunta** «¿Es el mismo dinero?»; guion 1: «son dos» → dos pagos (110); guion 2: «es el mismo» + «Dejar L 60» → el de 50 corregido a 60 (un pago activo, recibo nuevo); guion 3: «es el mismo» + «Dejar L 50» → un pago de 50 |
| M6 | Igual que M5 con **montos iguales** | se pregunta igual; nunca se une solo |
| M7 | PC corrige un pago a L 55 mientras el teléfono, sin señal, lo corrige a L 60 | pregunta con **L 55** y **L 60**, dos botones; nunca «gana el segundo» |
| M8 | PC corrige la **fecha** de un pago; el teléfono, sin señal, la corrige a otra | pregunta con las dos fechas (la fecha de un pago numerado solo cambia con `pago_corregir`) |
| M9 | PC corrige un pago; el teléfono, sin señal, lo anula | pregunta «se corrigió a L 60: ¿anular también?» |
| M10 | Gasto de L 40: PC lo cambia a 45, tablet a 48 | pregunta con 45 y 48. Si la tablet solo cambió el concepto → se aplica sin preguntar |
| M11 | Dos aparatos sin señal anotan el mismo gasto (mismo día y monto) | pregunta «¿Es el mismo gasto?» |
| M12 | Anular un gasto mientras otro aparato, sin señal, lo edita | la edición vuelve como «no quedó anotado: el gasto fue anulado» |
| M13 | La red se pierde **después** de que `pago_crear`, `pago_corregir` y `pago_anular` se aplicaron | al reintentar: `ya_estaba`; ni un pago ni un recibo de más |
| M14 | 1 000 pagos de L 0.10 | recaudado = L 100.00 exacto |
| M15 | La API devuelve los montos; el aparato los lee | siempre como texto (`"100.00"`); la sonda rápida falla si algún módulo de `js/datos/` hace `Number(`/`parseFloat(` sobre un monto |

### Lo que falta por recaudar

| # | escenario | se espera |
|---|---|---|
| F1 | **Exento** total, sin pagos | `aplicable = 0`, `falta = 0`, situación `no_corresponde`; no suma a `falta_total` ni a `meta` |
| F2 | **Exento parcial**: sugerido 50, `monto_aplicable` 25, pagó 10 | `falta = 15`; `falta_total` suma 15 |
| F3 | **Pago de más**: sugerido 50, pagó 70 | `falta = 0`, `pago_de_mas = 20`, situación `pago_de_mas`; `falta_total` no baja por eso |
| F4 | **Trasladado** que había pagado 30 de 50 | sus 30 **sí** cuentan en recaudado; `falta = 0`; situación `ya_no_esta`; no cuenta en `esperados` |
| F5 | Exento total que igual pagó 20 | `falta = 0`, `pago_de_mas = 20` |
| F6 | La familia (vista `vf_colectas`) en F1 a F5 | ve lo mismo que el docente para su hijo; `familia_totales_colectas` trae solo sumas |

### Gastos del docente y reembolsos

| # | escenario | se espera |
|---|---|---|
| G1 | Gasto de L 300 a la dirección, sin reembolsos | estado `por_cobrar`, falta 300, días de espera = hoy − fecha |
| G2 | Reembolsos de 100 y 150 | estado `reembolsado_parcial`, falta 50; dos filas de reembolso |
| G3 | Tercer reembolso de 50 | `reembolsado_total`; días de espera = fecha del último reembolso − fecha del gasto (ya no crece) |
| G4 | Corregir un reembolso de 150 a 120 | el de 150 anulado con motivo, uno nuevo de 120 con `reemplaza_a`; estado y falta recalculados |
| G5 | Dos aparatos sin señal anotan el mismo reembolso | pregunta «¿Es el mismo dinero?» con los dos montos |
| G6 | Anular un gasto que ya tiene reembolsos activos | rechazado: primero se anulan los reembolsos |
| G7 | Marcar «no se cobrará» con falta 50 | estado `no_se_cobrara`; no suma a «por cobrar» en el resumen |
| G8 | Ninguna columna de estado, total ni días guardada (sonda sobre el `.sql`) | solo en vistas |

### Inventario y actas

| # | escenario | se espera |
|---|---|---|
| N1 | Bien del docente que el centro le reembolsa (fecha y monto) | la **misma fila** pasa a `centro`, con `pasa_al_centro_at`; `v_bien_historia` muestra que antes era del docente y su valor |
| N2 | Pasar un bien de docente a centro **sin** fecha de reembolso ni «donado» | rechazado (`MT030`) |
| N3 | Pasar un bien de centro a docente | rechazado |
| N4 | Primera acta de un centro con 12 bienes | número 1; `contenido` con los 12 tal como estaban; totales por propietario |
| N5 | Se edita un bien después del acta 1 | el acta 1 **no cambia** (es un documento) |
| N6 | `v_proxima_acta` sin actas; con un acta de hace 2 meses; de hace 4 | toca ya; dentro de un mes; toca ya |
| N7 | Corregir el acta 2 | la 2 queda anulada con motivo; nace otra 2 con `reemplaza_a`; no hay dos actas 2 activas |
| N8 | Crear o editar un acta por la API (sin la función) | denegado |
| N9 | Dos aparatos crean el acta del mismo centro a la vez | números 2 y 3, nunca dos con el mismo número |

### Borrado protegido

| # | escenario | se espera |
|---|---|---|
| B1 | Borrar un alumno con un pago activo; con una nota activa | rechazado (`MT007`); la pantalla ofrece «retirado / trasladado» |
| B2 | Borrar una colecta con pagos o gastos activos; un aula con pagos o notas | rechazado |
| B3 | Borrar un alumno sin pagos ni notas | se borra; no vuelve en ningún aparato |
| B4 | Borrar un alumno en la PC **en el mismo instante** en que la tablet le anota una nota | o se borra y la nota se rechaza («el alumno fue quitado»), o la nota entra y el borrado se rechaza. Nunca los dos |

### Alumnos e identidad

| # | escenario | se espera |
|---|---|---|
| A1 | Dos aparatos sin señal crean al mismo alumno con **la misma identidad** y le anotan notas | un alumno; las notas del segundo pasan al id del primero |
| A2 | Mismo nombre, uno **sin** identidad | **pregunta** «¿Es la misma persona?»; «sí» → un alumno; «no» → dos |
| A3 | **Homónimos**: dos «Alumna Ficticia Iguales» con identidades distintas | se crean los dos; aviso discreto; ningún pago ni nota se confunde entre ellos |
| A4 | Corregir el nombre de un alumno al de otro que ya existe | se permite con aviso (el nombre no es regla dura) |
| A5 | Identidad repetida al **editar** | rechazada por la base |
| A6 | Hondureña de 12 dígitos; CUI de Guatemala de 13; pasaporte con letras | rechazada; aceptada; aceptada |
| A7 | Corregir el nombre en el teléfono mientras la PC le anota un pago | un solo alumno, mismo id; el pago está en él |
| A8 | Reordenar los 43 alumnos en la tablet mientras la PC anota notas | cada nota en el alumno tocado; solo cambió `num_lista` |
| A9 | Intercambiar los números 1 y 2 sin señal; otro aparato anota un pago «al n.º 1» | el pago queda en la alumna que se tocó (por id) |

### Ids, idempotencia y orden

| # | escenario | se espera |
|---|---|---|
| I1 | **Nunca `Math.random` para ids**: sonda rápida sobre `js/` | ninguna llamada a `Math.random` en `js/datos/` ni en ningún generador de ids |
| I2 | `nuevoId()` con `crypto.randomUUID` presente; sin él (se borra en la prueba) | uuid v4 válido en los dos casos; con `getRandomValues` en el segundo; 1 000 000 de ids sin repetir |
| I3 | Reenviar un `crear` cuyo id ya existe **con el mismo** `op_creacion` | `ya_estaba`, nada cambia |
| I4 | Un `crear` cuyo id ya existe con **otro** `op_creacion` (se fuerza) | va a «no quedó anotado»; la fila existente **no se toca** |
| I5 | Importar un archivo que trae un campo `id` | se ignora; las filas nuevas tienen ids nuevos |
| I6 | Sin señal: crear alumno, 3 pagos y 2 notas; cerrar; abrir con señal | sale en orden; el alumno antes que sus pagos |
| I7 | Matar la app a mitad de la cola | sigue desde la pendiente, sin repetir |
| I8 | Una pregunta de dinero sin responder | la cola sigue con lo que no depende de ella; lo que depende espera |
| I9 | Sesión vencida con 20 operaciones en cola | pausa, pide contraseña, sigue en el mismo orden |
| I10 | Otra cuenta entra en el mismo aparato | la cola de la primera no se envía con la segunda |
| I11 | Reloj del aparato adelantado 2 años | nada cambia |
| I12 | Realtime caído 5 minutos | al volver, el cursor trae editadas y borradas |

### Montos escritos por el docente

| # | escenario | se espera |
|---|---|---|
| D1 | `150`, `150,5`, `150.50`, `L 150`, `1 500`, `1,500.50` | 150.00, 150.50, 150.50, 150.00, 1500.00, 1500.50 |
| D2 | **`1,500`** y `1.500` | **se pregunta** (mil quinientos o uno con cincuenta); nunca se interpreta solo |
| D3 | `150.555`, `-5`, `abc`, `0` | no se aceptan (`0` = no dio) |

### Recibos

| # | escenario | se espera |
|---|---|---|
| R1 | 300 pagos a la vez desde 3 aparatos | 300 números distintos, correlativos 0001 a 0300 sin huecos, con la serie de 4 símbolos del docente |
| R2 | Un pago rechazado (colecta cerrada, alumno quitado) | no gasta número |
| R7 | Un pago con fecha del 20 de diciembre de 2026 y otro de 2028, con el servidor en otro año (R5-3) | `RC-26-…-0001` y `RC-28-…-0001`: el año sale de la fecha del pago; los de 2027 siguen en `RC-27` |
| D1-D6 | El dinero como texto (R5-1): leer `monto` (o `select *`) de pagos, gastos, gastos del docente, reembolsos, pagos de convocatoria, colectas, exenciones y bienes; leer `_calc_*`; el JSON de `vd_pagos`, `v_colectas_resumen`, `vf_pagos`, `vf_colectas`; la auditoría; el catálogo de vistas y funciones; la publicación de Realtime; el canal del docente | `42501` al leer directo; texto con dos decimales en todo lo que lee la app o el portal («0.00» incluido); ninguna vista ni función con dinero numérico; las tablas de dinero fuera de Realtime y un toque sin monto por `docente:<uid>`, que solo escucha ese docente |
| R3 | Dos docentes | series distintas, números que nunca chocan |
| R4 | `recibo_anterior` `RC-03EX-12` repetido en el mismo docente | el segundo se rechaza |
| R5 | Se fuerza que la serie choque 25 veces seguidas (prueba con generador falso) | se detiene en el intento 20 con error claro; no se queda en un bucle |
| R6 | Un usuario sin cuenta de docente llega a la numeración (se fuerza por SQL) | rechazado |

### Claves de familia

| # | escenario | se espera |
|---|---|---|
| K1 | Familia sin clave | la base genera 10 símbolos del alfabeto sin I, O, 0, 1 |
| K2 | Clave conservada que **está** en los datos congelados de ese docente | aceptada, `clave_origen = conservada` |
| K3 | Clave conservada que está en los datos congelados de **otro** docente, o en ninguno | rechazada (`MT020`) |
| K4 | Cambiar la clave de una familia por la API | rechazado; reemplazar la familia corta a los teléfonos vinculados con la vieja |

### Frenos e IP

| # | escenario | se espera |
|---|---|---|
| T1 | 40 intentos de entrar desde una IP con correos distintos | a partir del 31, `espera`, **antes** de validar contraseñas |
| T2 | El cliente manda `x-forwarded-for`, `true-client-ip` y `cf-connecting-ip` inventados en cada intento | `x-forwarded-for` y `true-client-ip` no se usan nunca (A+ IP1); `cf-connecting-ip` inventada la rechaza Cloudflare (403, confirmado en 6.8); sin IP válida, frenos por correo, sesión y familia (A+ E6, capa A K17) |
| T3 | `familia-vincular` sin token Turnstile, o con uno ya usado | rechazado |
| T4 | 25 claves equivocadas desde una IP; 2 100 repartidas en 200 IP en una hora | `espera` desde la 21 en la primera; desde la 2 001 en total en la segunda |
| T5 | Cambiar la contraseña; recuperarla por correo (`reset-clave`) | se llama `metas-salir-todos`: otras sesiones cerradas en el primer caso, **todas** en el segundo; su cola espera, no se pierde |
| T6 | Vincular un docente ficticio por primera vez y volver a entrar | `public.docentes.clave_hash` idéntico antes y después; una fila en `metas.cuentas` |

### Padres

| # | escenario | se espera |
|---|---|---|
| P1 | Dos padres con hijos distintos | cada uno ve solo a su hijo en `vf_*`; 0 filas en tablas directas |
| P2 | Un padre intenta escribir en cualquier tabla o vista, o llamar `familia_vincular` directo | denegado |
| P3 | El docente anula y corrige pagos | el padre lo ve en menos de 2 s, sin recargar |
| P4 | Aviso `individual` para otro alumno del aula; aviso general | el padre no ve el individual ajeno; sí el general |
| P5 | Observación tipo `expediente`; felicitación marcada para la familia; llamado vencido | solo ve la felicitación; el expediente ni siquiera se puede marcar para la familia |
| P6 | `familia_totales_colectas` | solo sumas por colecta; ningún nombre ni pago ajeno |
| P7 | Marcar visto un aviso que no le llega | `false`, nada se escribe |
| P8 | Transición: clave que aún no está en la base nueva | se muestran los datos congelados «hasta el <fecha>», sin caché |

### Congelar

| # | escenario | se espera |
|---|---|---|
| C1 | Después del paso 1: `metas_guardar` y `metas_guardar_progreso` | siguen funcionando (lado del alumno) |
| C2 | Después del paso 1: `metas_buzon_docente`, las lecturas de padres y `metas_docente_estado_guardar` (herramientas que aún no pasan a filas) | siguen abiertas |
| C3 | Después del paso 1: `metas_guardar_admin` (todas sus firmas), `metas_recuperar_admin_docente` | sin permiso; `registro_admin` no acepta escrituras |
| C4 | Después del paso 3: `metas_docente_estado_guardar`; y crear una familia con clave conservada | sin permiso; la clave conservada **se sigue aceptando** (`_clave_era_mia` lee el archivo congelado) |

### Carga rápida e importación

| # | escenario | se espera |
|---|---|---|
| Q1 | Pegar 43 alumnos, tocar «Guardar» dos veces, cortar la señal a la mitad | 43 alumnos, ni uno más |
| Q2 | Pegar 44 notas para 43 alumnos | no se guarda nada |
| Q3 | Abrir `ejemplo-importacion.json` | la vista previa marca exactamente lo de `04`; nada guardado sin confirmar |
| Q4 | Pago en la carga para un alumno que ya tiene pagos | entra como **abono nuevo** con su recibo; el guardado no cambia |

### Convivencia con el modelo viejo (paso 1 de `CONGELAR`)

| # | escenario | se espera |
|---|---|---|
| V1 | **APK v480** de una docente ya vinculada sube su `METAS_ADMIN_V1` con la lista | la función responde `-2`; la app vieja lo deja pendiente (no lo marca como subido); queda una fila en `metas.blob_rechazos`; el blob no cambia |
| V2 | La misma APK sube una llave que aún vive en el blob (`METAS_PLANACCION_V1`) | se guarda |
| V3 | **Pestaña vieja abierta** (código anterior al corte) sube `METAS_CODIGOS_V1` o `METAS_AVISOS_V1` | `-2` |
| V4 | Un docente **sin vincular** con la app vieja | todo como hoy |
| V5 | **Restaurar una versión vieja**: «Recuperar lo que borré» (`metas_docente_reset_deshacer`) y una escritura directa de una lista vieja en `docente_estado` | la función está cerrada; la escritura directa la frena el candado (`MT040`) |
| V6 | Pestaña vieja llama a `metas_guardar_admin` (las dos firmas), al historial, a la papelera o a la reposición de pagos | cerradas |
| V7 | `raw` inválido de un docente vinculado | no se acepta |
| V8 | `METAS_ADMIN_V1` sin secciones del corte 1 (equipos, lecturas…) | se guarda |
| V9 | La app nueva usa `metas.blob_guardar` (sesión, sin contraseña) para lo que aún vive en el blob; intenta mandar algo del corte 1; una sesión de padre lo intenta | se guarda; `MT040`; `42501` |
| V10 | Un recibo `AVR-` o un aviso de un docente vinculado llega a `mensajes_docente` por un SQL a mano (con su código en el texto, también en minúsculas, o cambiando el texto de una fila vieja) | el disparador de respaldo lo rechaza (`MT041`) y no queda ninguna fila; un docente sin vincular sigue mandando avisos y **la fila queda con su texto** |
| V11 | **Cierre de año** con `metas_cerrar_familias` después del paso 1 | sigue borrando las claves viejas y archivando lo borrado; `registro_admin` no acepta escrituras |
| V12 | Después del paso 1 siguen abiertas: `metas_guardar`, `metas_guardar_progreso`, lecturas de padres, buzón | sí |
| V13 | Con los permisos **de fábrica** de Supabase (GRANT ALL en `public` a `anon`, `authenticated` y `service_role`): `anon` escribe directo en `mensajes_docente` o `docente_estado`, o llama a una función interna (`_v1`, disparadores, `_metas_cerrar_funciones`) | `42501` en todo; ninguna función interna ejecutable por los tres roles |
| V14 | APK vieja de una docente vinculada sube `boleta`, `materias`, `logo`, `logoSec`, `edadCorte` u `obsGrado`; o el formato v1 (lista y materias en la raíz); o varias aulas y solo una con datos del corte 1 | `-2` en cada caso, anotado con la sección que lo frenó; un `logo` u `obsGrado` **vacíos** no son datos y se guardan |
| N1 | `metas_guardar_avisos` de una docente vinculada con «Ana López» en la fila, con su código en minúsculas o con espacios, o un recibo sin texto «docente» | `-2`, nada escrito, cada intento anotado en `metas.blob_rechazos` con el código normalizado; con contraseña equivocada `-1` (no revela si está vinculada); un docente sin vincular, como hoy |
| N2 | La familia de una docente vinculada consulta el archivo con `metas_consultar_admin_padre` o `metas_consultar_avisos_padre` (clave en minúsculas o con espacios incluida), con filas cuyo texto «docente» no trae el código | sin pagos, cuentas claras ni recibos; sí sus notas, asistencia y avisos; la familia de un docente sin vincular ve todo; el dinero de quien se vincula después deja de verse **en el momento** en que se vincula |
| V15 | `service_role` llama a las funciones viejas cerradas en el paso 1; se pide cerrar una que usa una función de borde | `42501` en todas; pedir cerrar `metas_entrar_docente_v2` es un error (`MT042`) |
| C5 | `SUPABASE-V2-CONGELAR.sql` se corre dos veces | sin error; cada disparador una sola vez; el hito una vez; ninguna envoltura renombrada sobre sí misma; la copia de claves no se amplía |
| K5 | Clave conservada que ya ocupa otra familia | `23505`; la carga rápida ofrece una clave nueva y avisa que hay que entregar tira nueva |
| K6 | Docente que se vincula **después** del paso 1 | su copia de claves se toma al vincularse |
| K7 | La docente prepara las tiras nuevas (`familias_preparar_claves_nuevas`) | solo las familias con clave conservada reciben `clave_siguiente` (10 símbolos, puesta por la base); la clave entregada no cambia; repetir no cambia nada; nadie elige ni cambia la siguiente (`MT002`) |
| K8 | Antes de la fecha del hito `claves_viejas_vencen` | la vieja y la nueva sirven |
| K9 | Pasa la fecha | el teléfono que entró con la vieja deja de ver y de escuchar su canal; la vieja ya no vincula (`clave_vencida`); con la tira nueva se vuelve a entrar |
| K10 | Familias con clave nueva | no vencen |
| K11 | Pasada la fecha, el docente da de alta una familia pidiendo conservar una clave de su copia | la base pone una clave nueva; la vieja no abre a nadie |
| K12 | Familia de un alumno trasladado o retirado | deja de escuchar el canal en vivo; la de un alumno activo lo escucha |
| K13 | Vence la clave vieja con el teléfono conectado (R5-2) | recibe «cerrar» una sola vez; ningún toque más; el teléfono con la tira nueva sí; al volver a entrar con la tira nueva, el mismo vínculo pasa a la clave nueva y ve de nuevo |
| K14 | Retiran al alumno con el teléfono conectado | «cerrar» al momento y ningún toque más |
| K15 | El padre se desvincula | «cerrar» a ese teléfono |
| G9 | `gasto_docente_editar` sin monto base (o con una fecha base que no se entiende) | **pregunta** `gasto_sin_base` con las dos cifras, sin error y sin cambiar nada; el segundo botón (base = lo que vio) guarda; pedir el mismo monto no pregunta |
| M16 | `pago_corregir` de un pago en una colecta cerrada | «esa colecta ya está cerrada»; el pago no se anula ni se reemplaza |
| CC1 | Escribir directo en `colectas` o `colecta_exenciones` | `42501`: solo por funciones |
| CC2-CC6 | En una colecta cerrada: `pago_crear`, `pago_anular`, `pago_editar`, `gasto_crear`, `gasto_editar`, `gasto_anular`, `colecta_editar` (monto sugerido o concepto), `exencion_poner` (nueva o cambiada), `exencion_quitar`, `colecta_borrar` | `colecta_cerrada` en cada una |
| CC7 | Reenvío de algo que ya estaba hecho | «ya estaba», no «cerrada» |
| CC8 | Después de todos los intentos | la colecta, su pago, su gasto y su exención exactamente como se cerraron |
| CC9 | SQL a mano sobre una colecta cerrada, un pago o una exención suya | `MT050` (disparador de respaldo) |
| CC10-CC11 | `colecta_reabrir` con y sin motivo; anular después; cerrar otra vez y reenviar la anulación | se abre; se anula; «ya estaba»; cada reapertura en la auditoría con actor, hora, estado antes y después, y el motivo |
| CC12 | Colecta abierta: monto sugerido cambiado en otro aparato, sin base, o una exención que el aparato no sabía que existía | pregunta con las dos cifras |

### Prueba de estrés al azar (nocturna)

Tres aparatos, 2 000 operaciones al azar (crear, editar, borrar; pagar, abonar,
corregir, anular; reordenar y renombrar), cortes de red y respuestas perdidas
al azar, relojes desajustados, y un docente simulado que responde las
preguntas al azar **y lo anota**. 50 semillas por noche. Se miden los cuatro
contadores de 6.1.

## 6.4 Dónde corren

| tanda | qué | cuándo |
|---|---|---|
| `npm test` (rápidas, sin red) | sondas que leen archivos: toda tabla de `metas` pasa por `_preparar`; ningún `float`, `real` ni `double precision`; ningún `.upsert(` sobre `pagos` o `convocatoria_pagos`; ningún `Math.random` en generadores de ids; ningún `Number(`/`parseFloat(` sobre montos en `js/datos/`; ningún `delete from metas.`; ningún botón «Recuperar», «Restaurar» ni «Sincronizar»; `capacitor.config.json` con `server.url` | cada empujón |
| `npm run test:datos` (nueva) | capas A y B contra Supabase local en Docker | cada empujón que toque `js/datos/` o los `.sql`, y de noche |
| `npm run test:navegador` | capa C y la prueba de estrés | de noche |

## 6.5 Capa A: lo que ya corre (revisión 7)

```
bash docs/rediseno-datos/pruebas-capa-a/corre.sh
```

Arma un PostgreSQL 16 **local y desechable** (nunca el proyecto real), le pone
un Supabase simulado (`00-supabase-simulado.sql`: roles `anon`,
`authenticated`, `service_role`; `auth.uid()` y `auth.jwt()` leídos de los
«claims» como en Supabase; `realtime.send`; publicación; `pgcrypto`) y una
copia mínima del modelo viejo con datos ficticios. Aplica los cuatro `.sql` en
el orden real (vinculación → esquema → familias → paso 1), **corre el paso 1
una segunda vez** y corre `10-pruebas.sql`.

Desde la revisión 4 el simulador trae los **permisos de fábrica de Supabase en
`public`** (`alter default privileges … grant all on tables, functions,
sequences to anon, authenticated, service_role`), la RLS sin políticas de las
tablas viejas como en el proyecto real, y copias fieles de
`metas_guardar_avisos`, `metas_consultar_admin_padre` y
`metas_consultar_avisos_padre`.

**Resultado: 280 pruebas en verde**: S1 a S9, M1 a M16, CC0 a CC12, F1 a
F6, B4 en los dos órdenes con **dos sesiones de verdad** (`dblink`), K0 a
K17, A1 a A8, G (con G9), N (con N10), P, R7, D1 a D6, la convivencia V1 a
V15, N1, N2 y C5. Josué corrió las 271 de la revisión 6 en verde en PG16, en
PG17 y contra `supabase start` (CLI 3.1.0).

La plataforma simulada trae un **pg_cron mínimo** (`cron.job`,
`cron.schedule`, `cron.unschedule`); contra `supabase start`, el corredor
activa el de verdad.

El simulador va en dos archivos: `00-plataforma-simulada.sql` (lo que
Supabase trae de fábrica; solo para el Postgres suelto) y
`00-modelo-viejo.sql` (para los dos). Los usuarios de Auth del Postgres
suelto van aparte (`01-usuarios-auth-simulados.sql`): contra Supabase los
crea la API de Auth.

Con los permisos de fábrica, la revisión 3 dejaba en `public` las funciones
de disparador ejecutables por `anon` y `authenticated` (PostgreSQL no deja
llamarlas fuera de un disparador, así que no era una puerta) y
`_metas_cerrar_funciones` y la guardadora vieja `_v1` ejecutables por
`service_role`. Ahora se cierran a los cuatro roles y V13 lo comprueba.

La capa A **encontró tres fallos reales del diseño**, ya corregidos en los
`.sql`:

1. `alter default privileges … in schema metas revoke execute … from public`
   no quita nada (PostgreSQL no deja quitar por esquema un permiso global):
   **50 funciones quedaban abiertas a PUBLIC**. Ahora cada archivo termina con
   `revoke execute on all functions in schema metas from public`.
2. La comprobación de «padre activo» usaba `FOR SHARE`, que exige permiso de
   UPDATE: crear un bien enlazado a un gasto del docente habría fallado
   siempre. Ahora corre como dueño del esquema y comprueba el dueño ella misma.
3. `metas.blob_guardar` tenía una variable con el mismo nombre que la columna
   `k`: habría fallado en la primera escritura.

**Antes de publicar el corte 1** (decisión de Josué, rev. 4): N1 y N2
resueltos (lo están) y esta capa en verde **contra `supabase start`**, con
cuentas ficticias, para confirmar los permisos, Realtime y Auth reales. Lo
mismo vale para la vinculación con Supabase Auth: primero en `supabase start`
con cuentas ficticias.

## 6.6 Contra `supabase start`: capas A y A+ (revisión 7)

Listo en `_dev/supabase-local/` (no se publica):

| archivo | qué es |
|---|---|
| `version-cli.txt` | la CLI fija: **3.1.0** (`npx supabase@3.1.0`) |
| `supabase/config.toml` | esquema `metas` expuesto, sesiones anónimas sí, alta por correo no, funciones sin verificación automática del JWT. Turnstile apagado solo en local |
| `corre-supabase.sh` | se niega si la base o la API no están en `127.0.0.1`/`localhost` o si la carpeta está vinculada (`supabase link`); `db reset`; modelo viejo y datos ficticios; cuentas ficticias **por la API de Auth** con ids fijos; los cuatro `.sql` (CONGELAR dos veces); capa A; las funciones con `functions serve`; capa A+ |
| `supabase/migrations/00000000000000_esquema_metas.sql` | solo `create schema if not exists metas`: la API no arranca si el esquema expuesto no existe |
| `supabase/functions/*` | `metas-entrar`, `metas-salir-todos`, `familia-vincular` (02, 2.9) y `metas-diagnostico-ip` (6.8; responde 404 si no está encendida) |
| `capa-a-mas.mjs` | capa A+ en Node contra la API real (abajo) |

```
bash _dev/supabase-local/corre-supabase.sh
```

(`--solo-sql` para la capa A sola; `--capa-b`, `--capa-c` o `--todo` para
sumar las capas B y C.) Necesita Docker corriendo, Node 22 y `psql`.

**Capa A+** (`capa-a-mas.mjs`, `@supabase/supabase-js` 2.45.4 instalado con
`--no-save`): E1 a E5 (`metas-entrar`: contraseña mala, sesión sola sin
código ni clave, vinculación transparente una sola vez, la contraseña de Auth
no sirve, freno de 5 fallos), D1 a D4 (aula, alumnos, colecta y pago por las
funciones; el dinero llega a JavaScript como `"150.00"`; leer la tabla o
insertar directo, rechazado; sin sesión, 401; la app vieja recibe `-2`), P1 a
P4 (sesión anónima real, `familia-vincular`, el padre ve solo a su hija, no
puede llamar `pago_crear`), T1 a T3 (Realtime: su canal sí, el de otra
familia «Unauthorized», el toque llega sin dinero; el canal del docente) y
R5-2 (trasladan al alumno con el padre conectado: «cerrar», ningún toque
más, no se vuelve a unir), S1 a S3 (`metas-salir-todos`).

**Arreglos de la revisión 7**, encontrados y probados por Josué (22 de 22 en
cuatro corridas seguidas): la migración `00000000000000_esquema_metas.sql`
crea el esquema vacío (la API no arranca si el esquema expuesto no existe);
`dblink` corre DENTRO del contenedor de la base, así que la carrera B4 se
conecta a `supabase_db_<project_id>:5432`; D3 manda los parámetros reales
(con `{}` la API respondía 404 y no probaba el permiso); y antes de
`functions serve` se borra el contenedor de funciones que levantó
`supabase start` y se espera a que el nuevo diga «Serving functions on»
(antes, la mitad de las veces respondía el viejo mientras moría: 502/500).
Más tres pruebas nuevas: E6 (freno por correo) e IP1, IP2 (la IP de los
frenos). Total de la capa A+: 25.

**Revisión 8**: E6 pasa a dos pruebas, porque el freno por correo cuenta
ahora solo los FALLOS: veinticinco entradas buenas seguidas no frenan; veinte
contraseñas equivocadas en la hora sí, y la 21.ª espera aunque sea la buena
(entre fallo y fallo se borra `docente_intentos`, para ver el freno de la
hora solo). Total de la capa A+: 26. En la capa A: K16 con una fecha a 60
días, K18 (más de 11 meses se rechaza, `MT044`), K19 (mover la fecha borra
la tarea anterior aunque la nueva ya pasó) y G10 (lo reembolsado en cero
dice «0.00»). Total de la capa A: 288.

**Revisión 8: corrido aquí** con Docker y `supabase start` (CLI 3.1.0):
capa A 288/288, A+ 26/26, B 10/10. Diferencias de este entorno, que no
cambian nada del repositorio: las imágenes se bajaron de Docker Hub
(`SUPABASE_INTERNAL_IMAGE_REGISTRY=docker.io`) y el contenedor de funciones
bajó sus paquetes por un espejo local de npm.

## 6.7 Capas B y C del corte 1 (escritas antes del código, revisión 6)

- **B** (`pruebas-capa-b/`): `CONTRATO.md` fija la API de `MetasDatos`;
  `arnes.mjs` arma varios aparatos aislados (IndexedDB propio con
  `fake-indexeddb`, red que se corta, se demora o **pierde la respuesta
  después de guardar**, `Math.random` prohibido) y mide en la base los
  contadores de 6.1; `escenarios.mjs`: B1 ids, B2 montos en centavos, B3 sin
  señal, B4 respuesta perdida sin duplicar, B5 dos aparatos sin señal (las
  dos respuestas), B6 colecta cerrada (las dos respuestas), B7 identidad y
  homónimos, B8 Realtime con el dinero como texto, B9 una cola por cuenta,
  B10 lo borrado al reconectar.
- **C** (`pruebas-capa-c/`): `CONTRATO-PANTALLA.md` fija los `data-metas`;
  `capa-c.mjs` con Playwright en 390, 800 y 1366 px: C1 ninguna palabra
  técnica ni indicador con señal y sin corrimiento lateral en las ocho
  pantallas, C2 el punto gris sin señal, C3 pregunta de dinero entre dos
  aparatos (dos botones de 44 px), C4 «¿Reabrirla?», C5 primera vez sin
  señal, C6 carga rápida de 43, C7 accesibilidad, C8 la clave vencida en el
  portal.

**Revisión 8**: `js/datos/` existe y la **capa B está en verde, 10 de 10**,
sin cambiar el contrato, el arnés ni los escenarios. La C sigue esperando la
pantalla (parte 2 del corte 1).

Mientras `js/datos/` y la pantalla nueva no existan, las dos salen con código
2 («pendiente del corte 1») y `corre-supabase.sh` lo dice sin fallar.

## 6.8 La IP de los frenos en una función ALOJADA (antes del corte 1)

**Hecha y CONFIRMADA** (Josué, 15/11/2026, en un proyecto alojado aparte,
con una función temporal que solo repetía cabeceras):

| qué se probó | resultado |
|---|---|
| `cf-connecting-ip` sin cabeceras raras | trae la IP pública real de quien llama |
| el aparato manda su propia `cf-connecting-ip` | Cloudflare **rechaza** la petición (403, error 1000): no se puede inventar |
| el aparato manda `x-forwarded-for` | se **descarta y se reemplaza** (igual no se usa) |
| el aparato manda `true-client-ip` | **pasa tal cual**: lo inventa cualquiera. **Nunca se usa** (regla de `02`, 2.5, junto a `x-forwarded-for`) |

Los frenos por IP se quedan en el corte 1. El procedimiento, por si hay que
repetirlo (por ejemplo, si Supabase cambia de proveedor):

En `supabase start` no hay Cloudflare: lo que importa se mide en un proyecto
**de prueba aparte**, nunca en el de producción.

1. Crear un proyecto de Supabase de prueba (gratuito), sin datos.
2. Desde `_dev/supabase-local/`, desplegar solo el diagnóstico y encenderlo:

   ```
   npx supabase@3.1.0 functions deploy metas-diagnostico-ip --project-ref <proyecto-de-prueba> --no-verify-jwt
   npx supabase@3.1.0 secrets set METAS_DIAGNOSTICO=1 --project-ref <proyecto-de-prueba>
   ```

   (`functions deploy` con `--project-ref` no vincula la carpeta; aun así,
   si apareciera `supabase/.temp/project-ref`, borrarlo: `corre-supabase.sh`
   se niega a correr con él.)
3. Desde un teléfono con datos y desde una computadora con otra red, sin
   cabeceras raras:

   ```
   curl -s -X POST https://<proyecto-de-prueba>.supabase.co/functions/v1/metas-diagnostico-ip
   ```

   **Se espera**: `ip_para_frenos` igual a la IP pública de cada aparato
   (la que da `curl -s https://ifconfig.me`), y distinta entre los dos.
4. Ahora inventando las cabeceras:

   ```
   curl -s -X POST -H 'cf-connecting-ip: 1.2.3.4' -H 'x-forwarded-for: 5.6.7.8' -H 'x-real-ip: 9.9.9.9' https://<proyecto-de-prueba>.supabase.co/functions/v1/metas-diagnostico-ip
   ```

   **Se espera**: `ip_para_frenos` sigue siendo la IP real, **no** `1.2.3.4`.
   Anotar también qué trae `x-forwarded-for` (para saber qué valor hubiera
   usado la revisión 6).
5. Si el paso 3 o el 4 no dan lo esperado, el corte 1 **no se publica** con
   frenos por IP: `metas-entrar` y `familia-vincular` se quedan con los
   frenos por correo, sesión y familia (ya están) hasta resolverlo.
6. Borrar la función del proyecto de prueba
   (`npx supabase@3.1.0 functions delete metas-diagnostico-ip --project-ref <proyecto-de-prueba>`).
