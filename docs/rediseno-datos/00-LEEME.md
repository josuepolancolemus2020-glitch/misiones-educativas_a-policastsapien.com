# Rediseño de datos de M.E.T.A.S · Fase 1: diseño (revisión 5)

Rama `rediseño-datos`. **Solo diseño**: no se modificó código de la app, no se
tocó Supabase ni ninguna fila de docentes, y no hubo merge. Los `.sql` se
**probaron de verdad** en un PostgreSQL 16 local y desechable con un Supabase
simulado (capa A, `pruebas-capa-a/`), nunca en el proyecto real. Fuera de
`docs/rediseno-datos/` solo cambió `CLAUDE.md`: reglas 15 a 18 (revisión 3)
y reglas 4 y 5 (revisión 4, con el texto que aprobaste).

## Qué se quiere

El modelo actual (blob en `docente_estado` + fusiones + reposición de pagos
desde `registro_admin_historial`) inventa, revive y duplica pagos y gastos. Se
**elimina entero**. En su lugar: **cada dato que el docente escribe es una
fila propia en Supabase, con su id, y se ve igual en todos sus aparatos.** Sin
botones de sincronizar, recuperar ni restaurar, y sin ningún indicador de
«guardado»: el docente escribe y queda. Solo sin señal aparece un punto gris.

## Documentos

| archivo | qué tiene |
|---|---|
| `01-INVENTARIO-DE-DATOS.md` | cada dato de `localStorage` y `docente_estado` y su tabla; qué se calcula y nunca se guarda |
| `02-CUENTAS-Y-SEGURIDAD.md` | Supabase Auth sin tocar `docentes`; vinculación (fase aparte); RLS dueño + restrictiva de cuentas; IP solo desde la infraestructura; claves de familia |
| `03-GUARDADO-CONFLICTOS-Y-SIN-CONEXION.md` | operaciones de una fila, ids, montos como texto, conflictos, preguntas de dinero, identidad, cola sin conexión |
| `04-CARGA-RAPIDA.md` + `formato-importacion.schema.json` + `ejemplo-importacion.json` | carga desde papel y formato para escaneos (datos ficticios) |
| `05-ELIMINACION-Y-ANDROID.md` | qué se elimina; congelado por pasos; Android con `server.url` |
| `06-PRUEBAS.md` | escenarios (dinero, seguridad, convivencia…) y el estado de la capa A |
| `07-VISTA-DE-PADRES.md` | de dónde lee hoy el portal; cómo leerá las mismas filas; transición aula por aula |
| `08-PLAN-POR-CORTES.md` | cortes; el primero con dinero, alumnos, notas, asistencia, controles, avisos y conducta; retiro de la APK v480 |
| `09-INTERFAZ.md` | **regla de interfaz** y la lista de cada pantalla y elemento que se elimina, con archivo:línea |
| `SUPABASE-V2-VINCULACION.sql` | primer archivo: esquema, freno, vínculo, copia inmutable de claves (**fase aparte**) |
| `SUPABASE-V2-ESQUEMA.sql` | 40 tablas de datos, auditoría, recibos, funciones de dinero y de alta, vistas de totales |
| `SUPABASE-V2-FAMILIAS.sql` | vínculo de familias, rol lector, vistas `vf_*`, totales, «visto», aviso inmediato |
| `SUPABASE-V2-CONGELAR.sql` | candado y congelado por pasos |
| `pruebas-capa-a/` | `corre.sh` + Supabase simulado (con los permisos de fábrica de `public`) + datos ficticios + **236 pruebas en verde** |

## Cambios de la revisión 5, por punto

**R4-1. Pasado el paso 4, ninguna clave vieja se conserva.** Con las viejas
vencidas, el alta de una familia ignora la clave pedida (aunque esté en la
copia de ese docente) y la base pone una nueva. Prueba K11.

**R4-2 y R4-4. Una colecta cerrada queda cerrada de verdad** (regla de
Josué). `colectas` y `colecta_exenciones` dejan de escribirse directo: solo
por `colecta_crear`, `colecta_editar`, `colecta_cerrar`, `colecta_reabrir`,
`colecta_borrar`, `exencion_poner` y `exencion_quitar`. En una colecta
cerrada responden `colecta_cerrada`: `pago_crear`, `pago_corregir`,
`pago_anular`, `pago_editar` (ni la nota), `gasto_crear`, `gasto_editar`,
`gasto_anular`, el monto sugerido, el concepto y la fecha, las exenciones y
el borrado. Un disparador lo frena también a mano (`MT050`). Un reenvío de
algo hecho antes del cierre responde «ya estaba». Reabrir solo con
`colecta_reabrir`, que queda en la auditoría con quién, cuándo y el motivo
opcional (`colectas.motivo_reapertura`). Todas toman la colecta antes que el
pago o el gasto, y cerrar la toma exclusiva: no se cierra a media anotación.
En la interfaz, «Esta colecta está cerrada. ¿Reabrirla?» → [Reabrir]
[Dejarla cerrada] (`09`, `03`). De paso, `gasto_editar` sin base ahora
pregunta en vez de fallar, como `gasto_docente_editar`. Pruebas CC0 a CC12.

**R4-5. Canal en vivo solo con el alumno activo**: `familia_canal_ok` exige
alumno `activo` o `ingreso`; retirado, trasladado o desertor dejan de
recibir avisos en vivo. Prueba K12.

**R4-6. `_metas_cerrar_funciones` cierra también a `service_role`**, y se
niega (`MT042`) si se le pide cerrar una de las que usa una función de borde
(`metas_entrar_docente_v2`, `metas_reset_confirmar`,
`metas_cambiar_clave_docente`). Prueba V15.

**Resultado**: 236 pruebas de la capa A en verde (eran 194). Quitando una a
una las correcciones en una copia, caen 15. `npm test`: 77 sondas en verde.

**Dato verificado por Josué**: las firmas y tipos de retorno de
`metas_docente_estado_guardar`, `metas_guardar_avisos`,
`metas_consultar_admin_padre` y `metas_consultar_avisos_padre` en el proyecto
real coinciden con lo que supone `CONGELAR`.

**Propuesta para tu aprobación**: la regla 18 de `CLAUDE.md` nombra los
pagos, gastos y reembolsos; con esta revisión debería nombrar también
colectas y exenciones (texto en la respuesta del chat; no se tocó).

## Cambios de la revisión 4, por punto

**N1. Candado de `metas_guardar_avisos`.** El de la revisión 3 reconocía al
docente por la columna `docente`, texto libre: con «Ana López» o con el código
en minúsculas, un `AVR-` viejo entraba. Y peor: la función vieja se traga el
error de cada fila y devuelve un número no negativo, así que la app vieja lo
daba por publicado. Ahora `metas_guardar_avisos` (misma firma, envuelve a la
vieja) valida `p_prof`/`p_clave` contra `public.docentes` y busca el código
**normalizado** en `metas.cuentas`: si está vinculado no escribe nada, anota el
intento en `metas.blob_rechazos` y responde `-2`, como el candado del blob
(la app vieja lo deja pendiente, `js/tools/registros-admin.js:12393`).
Primero la contraseña (`-1` como siempre), para que nadie averigüe quién está
vinculado. El disparador `MT041` queda de respaldo, ahora sin importar
mayúsculas. Pruebas N1, V10.

**N2. Sin dinero del archivo desde el paso 1.** `metas_consultar_admin_padre`
y `metas_consultar_avisos_padre` (misma firma y columnas, envuelven a las
viejas, que quedan cerradas) quitan pagos, cuentas claras y recibos cuando la
clave está en la copia de claves de un docente vinculado **o** el texto
«docente» trae su código. El dinero de quien se vincula después deja de verse
en ese momento. Prueba N2.

**N3. Claves viejas de familia: vencen al terminar la transición** (tu
decisión). Sin cambiar ninguna clave entregada: el docente imprime la tira
nueva (`familias_preparar_claves_nuevas`; la base pone `clave_siguiente`, de
10 símbolos), que sirve desde ese momento; en la fecha del hito
`claves_viejas_vencen` (paso 4, dos semanas de aviso) la vieja deja de abrir
en vincular, ver, «visto» y canal. Regla 4 de `CLAUDE.md` ajustada. Pruebas
K7 a K10.

**N4. El candado del blob cubre el aula entera**: `boleta`, `materias`,
`logo`, `logoSec`, `edadCorte` y `obsGrado`, en cada aula y también en la raíz
(formato v1 de una app muy vieja). Un texto vacío no cuenta como dato. Cada
rechazo dice qué sección lo frenó. Prueba V14.

**N5. Detalles.**
- `gasto_docente_editar` sin monto base (o con una fecha base ilegible):
  pregunta `gasto_sin_base` con las dos cifras y dos botones, sin error. G9.
- `pago_corregir` respeta una colecta cerrada (toma la colecta antes que el
  pago, en el mismo orden que `pago_crear`). M16.
- Quitado el comentario de «recibo pendiente» del esquema.
- V10 ya no es `prueba.ok(true, …)`: comprueba que el rechazo no deja fila y
  que la fila del docente sin vincular quedó con su texto. De paso se
  corrigió V1, cuya comprobación «el blob no cambió» era siempre verdadera.
- `CONGELAR` se puede correr dos veces: disparadores `create or replace`,
  renombres solo la primera vez (si no, la envoltura se llamaría a sí misma),
  copia de claves una sola vez. `corre.sh` lo corre dos veces; prueba C5.

**N6. Permisos de fábrica de Supabase en el simulador** (`grant all` en
`public` a `anon`, `authenticated` y `service_role` sobre tablas, funciones y
secuencias) y RLS sin políticas en las tablas viejas, como en el proyecto. Con
eso, la revisión 3 dejaba las funciones de disparador ejecutables por `anon`
(no se pueden llamar fuera de un disparador, no era una puerta) y
`_metas_cerrar_funciones` y la guardadora vieja `_v1` ejecutables por
`service_role`. Todo lo interno de `public` se cierra ahora a los cuatro
roles. Prueba V13.

**Resultado**: 194 pruebas de la capa A en verde (eran 130). Con el
`CONGELAR` y el esquema de la revisión 3, 27 de las nuevas fallan y G9 rompe
la corrida: las pruebas distinguen lo corregido. `npm test`: 77 sondas en
verde.

**Tus decisiones sobre los siete pendientes** quedan en `08` (1, 2, 7), `09`
(3, 4, 5) y `CLAUDE.md` (6).

## Cambios de la revisión 3, por punto

**Bloqueantes**

1. **Candado del blob (paso 1).** Disparador en `public.docente_estado`: para
   docentes con cuenta vinculada rechaza (`MT040`, «actualiza la app») toda
   escritura de `METAS_CODIGOS_V1`, de `METAS_AVISOS_V1` y de `METAS_ADMIN_V1`
   con secciones del corte 1 no vacías (`lista`, `notas`, `recuperacion`,
   `inasisOficial`, `asistencia`, `colectas`, `controles`, `bitacora`,
   `gastos`) o con `raw` inválido. `metas_docente_estado_guardar` (misma firma)
   responde `-2` y lo anota en `metas.blob_rechazos`: la app vieja lo deja
   pendiente y no lo marca como subido (`js/metas-docente-sync.js:281`). La app
   nueva usa el blob por sesión (`metas.blob_leer`/`blob_guardar`) con el mismo
   candado. Pruebas V1 a V9. Plan de retiro de la APK v480 en `08`, 8.6.
2. **Paso 1** cierra también `metas_docente_historial`, `_historial_listar`,
   `_papelera`, `_reset` y `_reset_deshacer`. **`metas_cerrar_familias` sigue
   abierta** (cierre de año), y `registro_admin` deja pasar justo su borrado y
   el archivo de lo borrado. Prueba V11.
3. **Avisos y conducta al corte 1**, y con ellos preguntas frecuentes y
   bitácora: `avFilasNube` desaparece entero, incluidos los `AVC-` y `AVR-`
   (`js/tools/registros-admin.js:12286-12330`). `mensajes_docente` rechaza todo
   lo de docentes vinculados (`MT041`). Las familias solo ven recibos de la
   base nueva; el archivo ya no les muestra dinero. Vistas nuevas
   `vf_periodos`, `vf_controles`, `vf_bitacora`. Prueba V10.
4. **Claves de familia:** `_clave_era_mia` lee `metas.claves_archivo`, copia
   **inmutable** tomada en el paso 1 (y al vincularse, para quien llegue
   después), que tolera `raw` inválido y guarda el nombre del niño. La carga
   rápida maneja el `23505` de una clave ya ocupada. Pruebas K0 a K6.

**No bloqueantes**

5. `vf_colectas`: retirado, trasladado o desertor → le corresponde 0 (F6).
6. Borrar un aula exige que no tenga alumnos, colectas ni gastos activos; el
   borrado toma primero la fila `FOR UPDATE`, lo que cierra la carrera con un
   pago o una nota que se están creando (B2, B4 en los dos órdenes con dos
   sesiones de verdad).
7. La consulta del paso 4 cuenta docentes sin vincular, vinculados sin aula y
   aulas del archivo sin aula nueva.
8. `metas.frenos`/`freno_ok` viven en `VINCULACION` (primer archivo).
   Turnstile **obligatorio**.
9. `pago_corregir` recibe la base (`monto`, `fecha`) y solo pregunta si cambió
   el monto, la fecha o si el pago ya no está vivo; una nota cambiada no hace
   preguntar (P9). La **fecha de un pago numerado es inmutable**:
   `pago_editar` solo cambia nota y recibo anterior.
10. Actas: fecha no futura; `bienes.gasto_docente_id`; dos actas a la vez →
    números 2 y 3, y solo pregunta si ya hay una del mismo centro y fecha.
11. `gasto_docente_editar` pregunta si el monto queda por debajo de lo ya
    reembolsado. Estado calculado y `no_se_cobrara`: aprobados.
12. Tope global de vinculación: **alerta** (una por hora en `metas.alertas`),
    no bloquea (P12).
13. `CLAUDE.md`: reglas 17 (toda tabla pasa por `_preparar`; toda función de
    `metas` sin EXECUTE para PUBLIC) y 18 (el dinero solo por funciones del
    servidor).
14. **Capa A en verde**: 130 pruebas, incluidas S1 a S4, M1 a M15, F1 a F6, B4
    y convivencia. Encontró **tres fallos reales**, ya corregidos: 50 funciones
    abiertas a PUBLIC (el `alter default privileges … in schema` no quita un
    permiso global), `FOR SHARE` sin permiso de UPDATE en tablas de dinero, y
    una variable que chocaba con la columna `k` en `blob_guardar`.

**Regla de interfaz** (mensaje aparte): `09-INTERFAZ.md`. Fuera «Guardado /
Guardando…», «recibo pendiente» y el aviso al cerrar sesión; solo queda el
punto gris sin señal (con `aria-label`), las preguntas de dos botones
(«¿L 50 o L 60?») y «no quedó anotado» con la razón del aula. Lista de cada
pantalla y elemento con archivo:línea. Respaldo a Drive: fase futura.

## Cambios de la revisión 2, por punto (historial)

1. **[Crítico] Sesiones anónimas.** `_preparar` añade a cada tabla una política
   **restrictiva** que exige `metas.es_docente()` (sesión no anónima **y**
   fila en `metas.cuentas`); también en `auditoria`, `rechazos`,
   `recibo_series`, `recibo_contadores` y `avisos_vistos`, y la numeración lo
   comprueba aparte. El sello (`t_sellar`, primer disparador) lo exige antes de
   tocar índices: no se puede averiguar una clave insertando. Corregidas las
   afirmaciones de `02`, `07` y `FAMILIAS`. Pruebas S1 a S4 y P2.
2. **Claves de familia** las pone la base: nuevas de 10 símbolos (50 bits);
   conservadas solo si están en los datos congelados de **ese** docente
   (`_clave_era_mia`). Turnstile obligatorio. Pruebas K1 a K4.
3. **IP**: la base ya no lee cabeceras del cliente (`ip_cliente()` eliminada);
   las funciones de borde pasan la IP que añade la infraestructura. Freno por
   IP implementado en `metas-entrar` antes de validar la contraseña.
   `metas-salir-todos` también desde `reset-clave` (cierra todas). T1 a T5.
4. **Recibos**: tope de 20 intentos, serie de 4 símbolos, solo cuentas reales.
   Sin `INSERT`/`UPDATE` directos en `pagos` y `convocatoria_pagos`: **no hay
   upsert posible**. Pruebas M1, R5, R6.
5. **Monto inmutable**: corregir = `pago_corregir` (anula + nuevo con
   `reemplaza_a`, una sola vez). M2, M3.
6. **Abonos**: varios pagos por alumno y colecta, cada uno con su recibo;
   eliminada la restricción de un pago activo. M4.
7. **Lo que falta**: exento → falta 0; exención parcial con
   `monto_aplicable`; `falta_total` y `pago_de_mas_total` en
   `v_colectas_resumen`; trasladados no cuentan como esperados. F1 a F6.
8. **Borrado protegido**: no se borra un alumno ni un aula con pagos o notas,
   ni una colecta con pagos o gastos; estado `retirado` añadido; colecta
   `cerrada`. B1 a B4.
9. **Dinero con pregunta**: crear, corregir, anular o cambiar fecha de pagos,
   gastos y reembolsos, con otro aparato de por medio, devuelve una pregunta
   con los dos valores y dos botones. Nunca «gana el segundo». M5 a M12.
10. **Alumnos**: solo la identidad une sola; mismo nombre sin identidad
    pregunta; el nombre repetido es solo aviso (quitado el `unique` por
    nombre). A1 a A9, homónimos en A3.
11. **Ids**: `crypto.randomUUID`, respaldo `getRandomValues`, nunca
    `Math.random`; `op_creacion` en cada fila para comparar choques de llave
    primaria; la importación nunca reutiliza ids. I1 a I5.
12. **Montos como texto** o centavos, nunca número de JSON; `1,500` y `1.500`
    se preguntan. D1 a D3, M15.
13. **Congelar**: no se cierra `metas_guardar_progreso` (lado del alumno), ni
    el buzón sin reemplazo, ni las lecturas de padres hasta la última aula;
    ahora va por pasos alineados con los cortes. C1 a C4.
14. **Familias**: `vf_avisos` por `tipo = 'individual'`; observaciones solo
    llamados, faltas leves y felicitaciones (el expediente ni se puede marcar
    para la familia); `CREATE` del rol lector quitado al terminar; solo totales
    recaudados por colecta (`familia_totales_colectas`); «visto» en tabla
    nueva escrita solo por función. P4 a P7.
15. **Varios**: `alter default privileges … revoke execute on functions from
    public`; `(select auth.uid())` en las políticas; llave foránea en
    `gastos.aula_id`; tope de tamaño y frecuencia en `rechazos`; el
    «deshacer» de la vinculación documentado como seguro solo antes de crear
    datos. S8, S9.
16. **Decisiones registradas**: Android con `server.url`; directores solo
    lectura (pospuesto); PIN de convocatorias pospuesto; bcrypt pospuesto
    (permiso aparte). Reglas nuevas en `CLAUDE.md`: nunca upsert en pagos,
    nunca `Math.random` para ids.
17. **Plan por cortes**: `08-PLAN-POR-CORTES.md`.
18. **Gastos del docente**: `gastos_docente` + `reembolsos` (filas aparte,
    monto inmutable); estado, lo que falta y días de espera calculados en
    `v_gastos_docente`. Los gastos de colecta quedan solos en `gastos`.
    G1 a G8.
19. **Inventario**: `bienes` (propietario docente o centro bajo custodia; paso
    a centro con fecha de reembolso en la misma fila, historia en la
    auditoría) y `actas_inventario` (versiones fechadas y numeradas, foto
    tomada por el servidor, aviso de «toca acta» cada 3 meses). N1 a N9.

## Decisiones tomadas (vigentes)

1. Supabase Auth con la contraseña de siempre; `public.docentes` sigue siendo
   la única autoridad; `metas-entrar` entrega la sesión.
2. Esquema aparte `metas`; lo viejo intacto, con candado y congelado por pasos.
3. Cada fila: `id`, `owner`, horas del servidor, `updated_by`, `device_id`,
   `deleted_at`, `version`, `op_creacion`. Nunca `DELETE`.
4. Políticas: dueño **y** cuenta de docente (restrictiva). Familias solo por
   vistas `vf_*` de un rol lector sin escritura.
5. Dinero solo por funciones del servidor; monto y fecha de un pago numerado
   inmutables; **ninguna decisión de dinero sin el docente**.
6. La identidad (país + documento) es la única regla dura del alumno.
7. Totales, estados de cobro, días de espera, boletas y cuadros: calculados.
8. Auditoría de solo inserción.
9. Base nueva vacía; carga rápida; claves conservadas solo si estaban en la
   copia inmutable de ese docente.
10. **Android con `server.url`** (aprobado).
11. **Plan de acción, acumulativos, lecturas y equipos empiezan en blanco** en
    su corte, con una frase clara para el docente (aprobado).
12. **El archivo se cierra a las familias** cuando todos estén migrados o al
    terminar el primer parcial de 2027, con dos semanas de aviso (aprobado).
13. Estado calculado de los gastos del docente y `no_se_cobrara` (aprobado).
14. Directores (solo lectura), PIN de convocatorias y bcrypt: pospuestos; bcrypt
    con permiso aparte.
15. **Interfaz sin nada técnico** (`09-INTERFAZ.md`).
16. **Vinculación con Supabase Auth**: sí, primero con `supabase start` y
    cuentas ficticias (revisión 4).
17. **Corte 1**: empieza en la rama; se publica solo con N1 y N2 resueltos y
    la capa A en verde contra `supabase start`.
18. **Primera vez sin señal**: «Para entrar la primera vez se necesita señal».
19. **Lado del alumno**: se quitan solo los textos técnicos de guardado; toda
    la interactividad se conserva. `buzon.html` queda fuera.
20. **`android:allowBackup="false"`**.
21. **Reglas 4 y 5 de `CLAUDE.md`** reescritas (texto aprobado).
22. **Plan de acción no publica a las familias** hasta su corte.
23. **Claves viejas de familia vencen** al terminar la transición (paso 4);
    cada familia recibe una clave nueva.
24. **Ningún dato de dinero del archivo** para familias de docentes
    vinculados desde el paso 1, garantizado por el servidor.
25. **Una colecta cerrada queda cerrada de verdad**: nada de dinero ni de
    exenciones cambia hasta `colecta_reabrir`, que queda en la auditoría
    (revisión 5).

## Riesgos

| riesgo | qué se hace |
|---|---|
| **Empezar en blanco** | carga rápida; las familias ven notas, asistencia y avisos del archivo (sin dinero, garantizado por el servidor para docentes vinculados) hasta el paso 4 |
| **Familias que no reciben la tira nueva** antes de que venza la vieja | la tira nueva sirve desde que se imprime; dos semanas de aviso; «Mi aula» cuenta cuántas faltan |
| **APK v480 y pestañas viejas** siguen abiertas en algunos teléfonos | candado + `-2` + funciones cerradas: no pierden ni inventan nada; `blob_rechazos` dice quién falta; mensaje y página «Actualiza la app» (`08`, 8.6). La app vieja no puede mostrar nuestro aviso |
| **Llave de firma de la APK**: vive fuera del repositorio (`C:\Users\Dell\.metas-android-key.properties`) | si se perdió, la APK nueva no instala encima: hay que desinstalar la vieja |
| **Cierre de año en curso** | `metas_cerrar_familias` sigue abierta; el corte 1 no se publica en medio de un cierre |
| **Herramientas que quedan en el blob** entre cortes (plan, acumulativos, lecturas, equipos…) siguen con la fusión vieja para sus llaves | el candado impide que cualquier dato del corte 1 vuelva por ahí; plan de acción no publica a las familias hasta su corte |
| **Supabase simulado ≠ Supabase real** | la capa A prueba SQL, permisos (con los de fábrica de `public`), RLS y concurrencia; Realtime, Auth y la exposición del esquema se confirman con `supabase start`, requisito para publicar el corte 1 |
| **Muchas preguntas** si dos aparatos anotan a la vez | solo cuando un aparato no había visto el otro dato |
| **Dependencia de funciones de borde** | se prueban con cuentas ficticias; se deshacen sin tocar cuentas (antes de crear datos) |
| **Huella de contraseña vieja (SHA-256 rápido)** | pospuesto con permiso aparte |
| **Dueño del proyecto Supabase** puede quitar disparadores | ningún rol de la app puede |

## Pendiente

1. El texto de la regla 18 de `CLAUDE.md` (colectas y exenciones solo por
   funciones).
2. Correr la capa A contra `supabase start` (plan en `06`, 6.6) y empezar el
   corte 1 en la rama, sin publicar.
