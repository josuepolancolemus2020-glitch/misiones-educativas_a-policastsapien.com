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
- **Cola vacía**, ninguna pregunta sin responder, y «No se guardó» solo con lo
  que el escenario espera.

## 6.2 Andamio

| capa | con qué | qué prueba |
|---|---|---|
| **A. Base** | Supabase local (`supabase start`, Docker) con los cuatro `.sql`; usuarios de Auth ficticios: 2 docentes vinculados, 1 usuario de Auth **sin** vínculo, 3 sesiones anónimas; datos congelados ficticios en `public.docente_estado` | restricciones, disparadores, RLS (permisiva y restrictiva), auditoría, recibos, funciones de dinero, vistas, familias |
| **B. Cola y conflictos** | Node + `fake-indexeddb`; N instancias de `MetasDatos` con su almacén y su `device_id`; un **proxy de red** que corta, demora, y **pierde la respuesta después de que la base aplicó**; un «docente simulado» que responde las preguntas según el guion | sin conexión, orden, idempotencia, conflictos, preguntas de dinero, identidad, Realtime |
| **C. Navegador** | Playwright con 3 contextos (teléfono 390 px, tablet 800 px, PC 1366 px), `context.setOffline` | la pantalla: «Guardado / Guardando… / Sin señal», tarjetas de dos botones, carga rápida, ningún botón de recuperar ni de sincronizar |

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
| M8 | PC cambia la **fecha** de un pago; el teléfono, sin señal, cambia la fecha a otra | pregunta con las dos fechas |
| M9 | PC corrige un pago; el teléfono, sin señal, lo anula | pregunta «se corrigió a L 60: ¿anular también?» |
| M10 | Gasto de L 40: PC lo cambia a 45, tablet a 48 | pregunta con 45 y 48. Si la tablet solo cambió el concepto → se aplica sin preguntar |
| M11 | Dos aparatos sin señal anotan el mismo gasto (mismo día y monto) | pregunta «¿Es el mismo gasto?» |
| M12 | Anular un gasto mientras otro aparato, sin señal, lo edita | la edición vuelve como «No se guardó: el gasto fue anulado» |
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
| I4 | Un `crear` cuyo id ya existe con **otro** `op_creacion` (se fuerza) | va a «No se guardó»; la fila existente **no se toca** |
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
| T2 | El cliente manda `x-forwarded-for` y `cf-connecting-ip` inventados en cada intento | el freno no se reinicia (cuenta la IP que añade la infraestructura) |
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
