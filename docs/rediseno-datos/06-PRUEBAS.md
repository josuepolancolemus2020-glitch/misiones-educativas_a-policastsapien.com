# 6. Plan de pruebas automáticas

Fase 1: diseño. Las pruebas se escriben en la fase de implementación, **antes**
del código que prueban, y se corren siempre con **datos ficticios** contra una
base **de prueba**, nunca contra el proyecto de producción.

## 6.1 Criterio de aceptación

Después de cada escenario y al final de cada corrida, el informe cuenta cuatro
cosas, y las cuatro tienen que ser **cero**:

| contador | qué cuenta | cómo se mide |
|---|---|---|
| **inventados** | pagos, gastos, notas o asistencias activos que ninguna acción del docente simulado creó | cada fila activa tiene en `metas.auditoria` un `crear` cuyo `op_id` está en el registro de acciones del escenario |
| **revividos** | filas que estuvieron borradas y volvieron a estar activas | ninguna fila de auditoría con `antes.deleted_at` no nulo; ninguna edición posterior a un `borrar` de la misma fila |
| **duplicados** | dos filas activas para lo mismo | por llave natural: pago (colecta, alumno), nota (alumno, asignatura, periodo, componente), asistencia (alumno, fecha), alumno (aula, país, identidad) y (aula, nombre) |
| **mal asignados** | un pago, nota o asistencia en un alumno distinto del que el docente tocó | se compara `alumno_id` de cada fila con el id del alumno que el escenario tocó, sin importar su nombre ni su número de lista en ese momento |

Además, sin excepción:

- **Convergencia**: al terminar, con señal y tras unos segundos quietos, lo que
  muestra cada aparato es exactamente lo que hay en la base.
- **Totales**: `v_colectas_resumen` coincide con la suma calculada por el
  oráculo (6.3), centavo por centavo.
- **Cola vacía** en todos los aparatos, y la lista de rechazos tiene solo los
  que el escenario espera, con su frase.

## 6.2 Andamio

| capa | con qué | qué prueba |
|---|---|---|
| **A. Base** | Supabase local (`supabase start`, Docker) con los cuatro `.sql` aplicados; usuarios de Auth ficticios; cliente `pg` desde Node | restricciones, disparadores, RLS, auditoría, recibos, vistas, vista de padres |
| **B. Cola y conflictos** | Node + `fake-indexeddb`; N instancias de `MetasDatos`, cada una con su almacén y su `device_id`; entre ellas y la base, un **proxy de red** que se puede cortar, demorar, y **perder la respuesta después de que la base ya aplicó** | sin conexión, orden, idempotencia, conflictos por `version`, choques de identidad, Realtime y reconexión |
| **C. Navegador** | Playwright con 3 contextos (teléfono 390 px, tablet 800 px, PC 1366 px), `context.setOffline`, misma base local | la pantalla: «Guardado / Guardando… / Sin señal», carga rápida, vista previa, que no aparezca ningún botón de recuperar ni de sincronizar |

Datos ficticios con semilla fija (`_dev/datos-ficticios.js`): escuela «Escuela
Ficticia Las Flores», 43 alumnos «Alumna Ficticia 01»…, identidades
`0000200000001`…, claves de familia `1-PRBA`…, colectas «Excursión
(ficticia)». Nunca un nombre, identidad ni teléfono reales.

### El oráculo

Cada escenario escribe un **registro de lo que el docente hizo** («en el
teléfono, a las 9:00, tocó a la alumna con id X y anotó L 50»). El oráculo
aplica ese registro **en el orden en que las operaciones llegan a la base**,
con las reglas de la sección 3 (campo por campo, lo borrado no vuelve, mismo
pago dos veces = uno), y produce el estado esperado. La prueba compara la base
con el oráculo fila por fila.

## 6.3 Escenarios

Todos con dos o más aparatos salvo donde se dice.

### Varios aparatos a la vez

| # | escenario | se espera |
|---|---|---|
| E1 | Teléfono cambia la **fecha** de un pago, PC cambia el **monto** del mismo pago, a la vez | quedan las dos cosas; `version` subió dos veces; dos filas de auditoría |
| E2 | Los dos cambian el **monto** | queda el que llegó segundo; el primero está en la auditoría |
| E3 | Tres aparatos: el teléfono pasa lista **sin señal** a las 9:00 (43 alumnos, 5 ausencias); la PC pone notas a las 20:00; vuelve la señal en el teléfono | están las 5 ausencias **y** las notas (es el caso que perdía la asistencia en septiembre de 2026) |
| E4 | Tablet y PC anotan pagos de colectas distintas durante 10 minutos con señal | todo en los tres aparatos en menos de 2 s por Realtime |

### Sin conexión

| # | escenario | se espera |
|---|---|---|
| E5 | Sin señal: crear alumno nuevo, anotarle 3 pagos y 2 notas, cerrar la app, abrirla al día siguiente con señal | la cola sale sola y en orden; el alumno llega antes que sus pagos |
| E6 | Dos aparatos sin señal crean **al mismo alumno** (misma identidad) y le anotan el pago de la misma colecta con el **mismo** monto | un alumno, un pago, un número de recibo; los ids locales del segundo se cambiaron por los del primero |
| E7 | Igual que E6 pero con montos **distintos** (L 50 y L 60) | un pago (el que llegó primero); el otro, en la lista de rechazos con la frase «ya estaba anotado desde otro aparato con L 50.00…» |
| E8 | La red se cae **después** de que la base aplicó el `crear`, el `editar` y el `borrar` (respuesta perdida) | al reintentar, ninguno se duplica ni se aplica dos veces |
| E9 | Reloj del teléfono adelantado dos años; reloj de la tablet atrasado un mes | nada cambia: todas las horas son del servidor |
| E10 | La sesión vence con 20 operaciones en cola | la cola se pausa, se pide la contraseña, sigue en el mismo orden; nada se pierde |
| E11 | Entra otra cuenta en el mismo aparato con la cola llena | las operaciones de la primera cuenta no se envían con la segunda; se envían cuando vuelve la primera |
| E12 | Realtime se cae 5 minutos mientras otro aparato edita y borra | al volver, el cursor trae las editadas **y las borradas**; la pantalla queda igual a la base |

### Borrar y volver a abrir

| # | escenario | se espera |
|---|---|---|
| E13 | Borrar un pago en la PC; recargar la PC; borrar la caché de la PC; abrir la app en el teléfono que tenía la copia vieja **sin** operaciones pendientes | el pago no vuelve en ningún aparato |
| E14 | Borrar un pago en la PC mientras el teléfono, sin señal, le corrige el monto | el pago sigue borrado; la corrección del teléfono va a rechazos («el pago fue quitado en otro aparato») |
| E15 | Borrar a un alumno con pagos (confirmando) y crear después otro con el mismo nombre | el nuevo tiene otro id; los pagos del borrado no aparecen en el nuevo ni en los totales |
| E16 | Borrar una colecta y volver a crear una con el mismo concepto | colecta nueva vacía; nada de la vieja vuelve |
| E17 | Cerrar la app a la mitad de enviar la cola (se mata el proceso) y abrirla | sigue desde la operación pendiente, sin repetir las confirmadas |

### Corregir el nombre y cambiar el número de lista

| # | escenario | se espera |
|---|---|---|
| E18 | El teléfono corrige «Alumna Ficticia 07» a «Alumna Ficticia Siete» mientras la PC le anota un pago | un solo alumno, mismo id; el pago está en él; no se creó otro alumno |
| E19 | Corregir el nombre a uno que **ya tiene** otro alumno del aula | la base lo rechaza; la pantalla lo dice antes de guardar |
| E20 | Reordenar los 43 alumnos en la tablet (orden alfabético) mientras la PC anota notas tocando filas | cada nota está en el alumno que se tocó; solo cambió `num_lista`; cero pagos movidos |
| E21 | Intercambiar los números 1 y 2 sin señal en el teléfono; la PC, con señal, le anota un pago «al n.º 1» (que para ella sigue siendo la alumna original) | el pago queda en la alumna que la PC tocó (por id), aunque al llegar el cambio del teléfono ella pase a ser la n.º 2 |
| E22 | Dos alumnos con el mismo número de lista (error de digitación) | se permite, con aviso; ninguna relación se confunde |

### Corregir un gasto

| # | escenario | se espera |
|---|---|---|
| E23 | Gasto de L 40.00; la PC lo corrige a L 45.00 y la tablet cambia el concepto | L 45.00 con el concepto nuevo; `gastado` y `saldo` recalculados |
| E24 | La tablet borra el gasto mientras el teléfono, sin señal, lo corrige | sigue borrado; la corrección va a rechazos |
| E25 | Montos con coma, con «L», con 3 decimales, negativos, 0 | se aceptan los válidos como `numeric` exacto; los demás no llegan a la cola |
| E26 | 1 000 pagos de L 0.10 | el total es L 100.00 exacto (ningún error de coma flotante) |

### Notas

| # | escenario | se espera |
|---|---|---|
| E27 | Corregir una nota de 78 a 85 | la misma fila, `version` +1; la auditoría guarda 78 |
| E28 | Dos aparatos sin señal escriben la nota del mismo alumno, asignatura y parcial | una sola fila activa |
| E29 | Renombrar la asignatura «Ciencias» a «Ciencias Naturales» | todas sus notas siguen en ella |
| E30 | Las boletas y los cuadros salen de las filas: se compara la boleta calculada sin señal (`calculos.js`) con la calculada con las vistas | idénticas |

### Recibos e identidad

| # | escenario | se espera |
|---|---|---|
| E31 | 300 pagos creados a la vez desde 3 aparatos | 300 números distintos, correlativos del 0001 al 0300 sin huecos, todos con la serie del docente |
| E32 | Corregir el monto de un pago con recibo | el número de recibo no cambia; un `update` que intente cambiarlo falla |
| E33 | Un pago rechazado por duplicado | no gasta número (sin huecos) |
| E34 | Dos docentes de prueba | sus números nunca chocan (series distintas) |
| E35 | `recibo_anterior` `RC-03EX-12` en dos pagos del mismo docente | el segundo se rechaza |
| E36 | Identidad hondureña de 12 dígitos; CUI de Guatemala de 13 dígitos; pasaporte con letras | rechazada; aceptado; aceptado |

### Seguridad, auditoría y padres

| # | escenario | se espera |
|---|---|---|
| E37 | El docente B intenta leer, editar o colgar un pago de un alumno de A conociendo los uuid | 0 filas al leer; error al escribir (RLS y llave compuesta) |
| E38 | `delete` físico de cualquier fila de `metas`, con `authenticated` y con `service_role` | rechazado |
| E39 | `update`, `delete` y `truncate` sobre `metas.auditoria` | rechazados para todos los roles de la app |
| E40 | Una sesión sin cuenta (`anon`) | no ve ni una fila de `metas` |
| E41 | Dos padres con hijos distintos | cada uno ve solo a su hijo en las vistas `vf_*`; 0 filas en las tablas directas |
| E42 | Un padre intenta `insert`/`update` en cualquier tabla o vista | permiso denegado |
| E43 | El docente borra y luego corrige pagos | el padre lo ve igual en menos de 2 s (canal `familia:<id>`), sin recargar |
| E44 | El docente cambia la clave de una familia | el teléfono vinculado con la clave vieja deja de ver al instante |
| E45 | 25 claves equivocadas seguidas desde una IP | a partir de la 21 responde «espere» |
| E46 | Cuentas: vincular un docente ficticio por primera vez y volver a entrar | `public.docentes.clave_hash` idéntico antes y después; una sola fila en `metas.cuentas`; la contraseña de siempre sigue sirviendo en la app vieja |

### Carga rápida e importación

| # | escenario | se espera |
|---|---|---|
| E47 | Pegar 43 alumnos, tocar «Guardar» dos veces y cortar la señal a la mitad | 43 alumnos, ni uno más |
| E48 | Pegar 44 notas para 43 alumnos | no se guarda nada; la frase lo explica |
| E49 | Abrir `ejemplo-importacion.json` | la vista previa marca exactamente lo de la tabla de 4.4; no se guarda nada sin confirmar |
| E50 | Importar un archivo cuyos alumnos ya existen | se emparejan por identidad y nombre, nunca por número de lista; los cambios a datos guardados vienen sin marcar |

### Prueba de estrés al azar (nocturna)

**F1.** Tres aparatos, 2 000 operaciones al azar (crear, editar, borrar en
alumnos, pagos, gastos, notas y asistencia; reordenar y renombrar), cortes de
red al azar, respuestas perdidas al azar, relojes desajustados. 50 semillas
por noche; la semilla que falle se guarda para repetirla. Se miden los cuatro
contadores de 6.1.

## 6.4 Dónde corren

| tanda | qué | cuándo |
|---|---|---|
| `npm test` (rápidas, sin red) | sondas que leen archivos: ninguna tabla de `metas` sin `_preparar`; ningún `float`, `real` ni `double precision` en el esquema; ningún `delete from metas.` en el código; ninguna llave `localStorage` con datos del docente; ningún botón con «Recuperar», «Restaurar» ni «Sincronizar»; `capacitor.config.json` con `server.url`; `www/` solo con `sin-conexion.html` | cada empujón |
| `npm run test:datos` (nueva) | capas A y B contra Supabase local en Docker | cada empujón que toque `js/datos/` o los `.sql`, y de noche |
| `npm run test:navegador` | capa C y F1 | de noche (como hoy) |

El flujo `.github/workflows/sondas.yml` suma un trabajo con
`supabase/setup-cli` y `supabase start` para la tanda de datos.
