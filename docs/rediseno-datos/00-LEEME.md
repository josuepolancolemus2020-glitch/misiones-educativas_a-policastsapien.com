# Rediseño de datos de M.E.T.A.S · Fase 1: diseño (revisión 2)

Rama `rediseño-datos`. **Solo documentos.** No se modificó código de la app,
no se ejecutó SQL (ni en una base local: la sintaxis se revisó con un
analizador que solo lee el texto), no se tocó Supabase ni ninguna fila de
docentes. Lo único fuera de `docs/rediseno-datos/` son dos reglas nuevas en
`CLAUDE.md`, que pediste.

## Qué se quiere

El modelo actual (blob en `docente_estado` + fusiones + reposición de pagos
desde `registro_admin_historial`) inventa, revive y duplica pagos y gastos. Se
**elimina entero**. En su lugar: **cada dato que el docente escribe es una
fila propia en Supabase, con su id, y se ve igual en todos sus aparatos.** Sin
botones de sincronizar, recuperar ni restaurar: una línea dice «Guardado».

## Documentos

| archivo | qué tiene |
|---|---|
| `01-INVENTARIO-DE-DATOS.md` | cada dato de `localStorage` y `docente_estado` (con `sace-lista.js`, boletas, cuadros, gastos del docente e inventario) y su tabla; qué se calcula y nunca se guarda |
| `02-CUENTAS-Y-SEGURIDAD.md` | Supabase Auth sin tocar `docentes`; vinculación (fase aparte); RLS por dueño **más restrictiva de cuentas**; IP solo desde la infraestructura; claves de familia |
| `03-GUARDADO-CONFLICTOS-Y-SIN-CONEXION.md` | operaciones de una fila, ids, montos como texto, conflictos, **preguntas de dinero con dos botones**, identidad, cola sin conexión |
| `04-CARGA-RAPIDA.md` + `formato-importacion.schema.json` + `ejemplo-importacion.json` | carga desde los papeles y formato para escaneos (datos ficticios) |
| `05-ELIMINACION-Y-ANDROID.md` | lista exacta de lo que se elimina; congelado por pasos; Android con `server.url` |
| `06-PRUEBAS.md` | 107 escenarios y la prueba de estrés; criterio «cero inventados, revividos, duplicados o mal asignados» |
| `07-VISTA-DE-PADRES.md` | de dónde lee hoy el portal; cómo leerá las mismas filas con RLS; transición aula por aula |
| `08-PLAN-POR-CORTES.md` | implementación por cortes; el primero: dinero, alumnos, notas, asistencia y controles |
| `SUPABASE-V2-ESQUEMA.sql` | esquema `metas`: 40 tablas de datos, auditoría, recibos, funciones de dinero y de alta de alumnos, vistas de totales |
| `SUPABASE-V2-FAMILIAS.sql` | vínculo de familias, rol lector, vistas `vf_*`, totales por colecta, «visto» de avisos, aviso inmediato |
| `SUPABASE-V2-VINCULACION.sql` | vinculación de cuentas (**fase aparte**) |
| `SUPABASE-V2-CONGELAR.sql` | congelar lo viejo por pasos, alineados con los cortes |

## Cambios de la revisión 2, por punto

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

1. Supabase Auth con la contraseña de siempre: `public.docentes` sigue siendo
   la única autoridad; `metas-entrar` entrega la sesión.
2. Esquema aparte `metas`; lo viejo intacto y congelado por pasos.
3. Cada fila: `id`, `owner`, `created_at`/`updated_at` del servidor,
   `updated_by`, `device_id`, `deleted_at`, `version`, `op_creacion`. Nunca
   `DELETE`.
4. Políticas: dueño **y** cuenta de docente (restrictiva). Las familias, solo
   por vistas `vf_*` de un rol lector sin escritura.
5. Dinero solo por funciones del servidor, montos inmutables donde hay
   recibo, y **nunca** una decisión de dinero sin el docente.
6. La identidad es la única regla dura del alumno; el número de lista no
   relaciona nada.
7. Todos los totales, estados de cobro, días de espera, boletas y cuadros se
   calculan.
8. Auditoría de solo inserción.
9. Base nueva vacía; carga rápida desde papel; claves de familia conservadas
   solo si eran del docente.
10. Android carga el sitio publicado.
11. Directores, PIN de convocatorias y bcrypt: pospuestos.

## Riesgos

| riesgo | qué se hace |
|---|---|
| **Empezar en blanco** | carga rápida; el archivo queda consultable para las familias hasta el paso 4 |
| **Convivencia de cortes**: entre el corte 1 y el último, el blob y la fusión siguen vivos para las herramientas que aún no pasan a filas | la app nueva quita del blob todo lo del corte 1; los cortes siguientes deben venir pronto |
| **Herramientas que nombran alumnos** (avisos, conducta, plan, acumulativos, lecturas, equipos) pierden lo guardado con números de la lista vieja al pasar al id nuevo | pendiente 3 de abajo |
| **Familias con clave nueva** no reciben avisos hasta el corte 2 | conservar claves en la carga rápida; corte 2 pronto |
| **Muchas preguntas** si dos aparatos anotan a la vez | solo aparecen cuando un aparato no había visto el otro dato; con señal y Realtime son raras |
| **Dependencia de funciones de borde** para entrar y para vincular familias | se prueban con cuentas ficticias antes; se pueden deshacer sin tocar cuentas (antes de crear datos) |
| **Huella de contraseña vieja (SHA-256 rápido)** | pospuesto con permiso aparte; el freno por IP reduce el riesgo |
| **Recibo sin señal** no existe hasta que llega | «recibo pendiente» |
| **Dueño del proyecto Supabase** puede quitar disparadores de auditoría | ningún rol de la app puede |
| **Android**: primera apertura con señal; datos viejos del APK en otro origen; política de Google Play | se avisa antes de actualizar |
| **Realtime pierde mensajes** si se cae | cursor al reconectar, incluidas las borradas |

## Pendiente de tu aprobación

1. **La vinculación a Supabase Auth** (fase aparte) y su configuración del
   panel (alta pública apagada, sesiones anónimas, Turnstile obligatorio,
   esquema `metas` expuesto, tres funciones de borde).
2. **Empezar el corte 1** tal como está en `08`, incluidos `familias` y la
   vista de padres de esos datos (los añadí al corte 1 porque sin ellos los
   padres no verían pagos ni notas).
3. **Herramientas que todavía no pasan a filas y nombran alumnos**: desde el
   corte 1 guardan el id del alumno y no traen lo que tenían con la lista
   vieja. Alternativa: adelantar avisos y conducta al corte 1.
4. **Cambios a las reglas 4 y 5 de `CLAUDE.md`** (fusión y llaves de
   `localStorage`) y a «Cómo se publica» (APK), para el corte 1.
5. **Gastos del docente**: el estado se calcula de los reembolsos (no es un
   campo); añadí `no_se_cobrara` como decisión del docente. Confirmar que así
   lo quieres.
6. **Actas de inventario**: dos aparatos que crean el acta del mismo centro a
   la vez obtienen los números 2 y 3. ¿Prefieres que el segundo pregunte?
7. Cuándo correr el **paso 4** de `CONGELAR` (cerrar el archivo para las
   familias).
