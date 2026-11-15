# Rediseño de datos de M.E.T.A.S · Fase 1: diseño

Rama `rediseño-datos`. **Solo documentos.** No se modificó código, no se
ejecutó SQL (ni siquiera en una base local; solo se revisó la sintaxis con un
analizador que lee el texto) y no se tocó Supabase.

## Qué se quiere

Hoy los datos del aula viajan como un blob (`docente_estado`) que se fusiona
entre aparatos (`metas-docente-sync.js`, `metas-fusion-aula.js`), y además se
"reponen" pagos desde `registro_admin_historial`. Ese modelo inventa, revive y
duplica pagos y gastos. Se **elimina entero**, sin parches.

El modelo nuevo, en una frase: **cada dato que el docente escribe es una fila
propia en Supabase, con su id, y se ve igual en todos sus aparatos.** Sin
botones de sincronizar, recuperar ni restaurar; como en Google Drive, una
línea dice «Guardado».

## Documentos

| archivo | punto del pedido |
|---|---|
| `01-INVENTARIO-DE-DATOS.md` | 10: cada dato de `localStorage` y `docente_estado` (incluidos `sace-lista.js`, boletas y cuadros) con su tabla; qué se calcula y nunca se guarda |
| `02-CUENTAS-Y-SEGURIDAD.md` | 4 y regla de cuentas: Supabase Auth sin tocar `docentes`, vinculación transparente (fase aparte), RLS, freno de intentos, nada de contraseñas en el aparato |
| `03-GUARDADO-CONFLICTOS-Y-SIN-CONEXION.md` | 5 y 6: operaciones de una fila, conflictos por `version` campo por campo, cola sin conexión, Realtime |
| `04-CARGA-RAPIDA.md` + `formato-importacion.schema.json` + `ejemplo-importacion.json` | 7: carga desde los papeles con validación y vista previa; formato para escaneos (datos ficticios) |
| `05-ELIMINACION-Y-ANDROID.md` | 8: lista exacta de archivos, funciones, botones, avisos, sondas y SQL que se eliminan o congelan; Android con el mismo código que la web |
| `06-PRUEBAS.md` | 9: 50 escenarios y una prueba al azar, con el criterio «cero inventados, revividos, duplicados o mal asignados» |
| `07-VISTA-DE-PADRES.md` | 11: de dónde lee hoy el portal de padres y cómo leerá las mismas filas con RLS |
| `SUPABASE-V2-ESQUEMA.sql` | 1, 2, 3, 4 y 12: esquema `metas` (38 tablas de datos, más auditoría, rechazos, frenos y contadores de recibos), auditoría, vistas de totales, recibos |
| `SUPABASE-V2-FAMILIAS.sql` | 11: vínculo de familias, rol lector, vistas `vf_*`, aviso inmediato |
| `SUPABASE-V2-VINCULACION.sql` | vinculación de cuentas (**fase aparte**) |
| `SUPABASE-V2-CONGELAR.sql` | 7: congelar lo viejo como archivo de solo lectura |

Los cuatro `.sql` llevan arriba «NO EJECUTAR».

## Decisiones tomadas

1. **Supabase Auth, con la contraseña de siempre.** `public.docentes` sigue
   siendo la única autoridad de la contraseña. Una función de borde
   (`metas-entrar`) la valida como hoy y entrega una sesión de Auth. El usuario
   de Auth se crea solo la primera vez, con un correo interno fijo. No se toca
   ninguna fila de cuentas. Sin esto no hay RLS por dueño ni Realtime.
2. **Esquema aparte (`metas`).** Lo viejo (`public`) queda intacto y congelado;
   lo nuevo no lo lee nunca.
3. **Cada fila** lleva `id` (lo genera el aparato una vez), `owner`,
   `created_at`/`updated_at` (hora del servidor), `updated_by`, `device_id`,
   `deleted_at` y `version`. Un disparador pone todo eso y el aparato no puede
   cambiarlo. Nunca `DELETE`: no hay permiso ni política, y un disparador lo
   rechaza.
4. **Lo borrado no vuelve.** Editar una fila borrada da error; la edición se
   descarta y se avisa en lenguaje del aula.
5. **Conflictos**: `update … where version = n`. Si falla, se lee la fila y se
   vuelve a aplicar solo lo que ese aparato cambió. Si los dos cambiaron el
   mismo campo, queda el que llegó segundo y el otro valor queda en la
   auditoría.
6. **Llaves foráneas compuestas** con `owner` (y `aula_id`): la base impide
   colgar un pago propio de un alumno ajeno y mezclar aulas.
7. **El número de lista no relaciona nada.** Notas, pagos, asistencia,
   familias, equipos, avisos: todo por `alumno_id`. Asignaturas con id propio:
   renombrar no mueve notas.
8. **Unicidades** (solo entre filas activas): alumno por aula + país +
   identidad y por aula + nombre completo normalizado; un pago por alumno y
   colecta; una nota por alumno + asignatura + periodo + componente; una
   asistencia por alumno y día.
9. **Montos `numeric(12,2)`**, notas `numeric(5,2)`. En el aparato los montos
   viajan como texto decimal; nunca pasan por coma flotante.
10. **Todos los totales en vistas** (`security_invoker`): recaudado, gastado,
    saldo, situación de cada alumno, inasistencias por parcial, promedios,
    acumulativos, votos. Boletas y cuadros se calculan desde filas.
11. **Auditoría de solo inserción**: antes, después, campos cambiados, quién,
    cuándo (servidor), aparato y operación. Sin permiso de escritura para la
    app y con disparadores que rechazan `update`, `delete` y `truncate`.
12. **Cola sin conexión en IndexedDB**, de una operación a la vez y en orden,
    idempotente por construcción (reenviar no duplica), sin intervención del
    docente.
13. **Recibos**: número puesto por la base (`RC-27-K7Q-0001`), único en todo el
    sistema, correlativo por docente y año, sin huecos e inmutable;
    `recibo_anterior` para el número viejo `RC-03EX-##`.
14. **Identidad extranjera**: país y tipo de documento; el formato de 13
    dígitos solo se exige para Honduras.
15. **Padres**: sesión anónima + clave de familia → vínculo; leen vistas
    `vf_*` con RLS (rol lector sin privilegios de escritura, solo columnas
    permitidas); aviso por Realtime en menos de un segundo; sin caché en el
    teléfono.
16. **Base nueva vacía**, sin migración. Lo viejo se congela, no se borra.
17. **Android carga el sitio publicado** (`server.url`): el mismo código y la
    misma versión que la web, siempre.

## Riesgos

| riesgo | qué se hace |
|---|---|
| **Empezar en blanco**: durante la transición el docente tiene que volver a cargar su aula desde papel | pantalla de carga rápida; lo viejo queda consultable como archivo (decisión 4 de abajo) |
| **Las familias no ven nada** del aula hasta que el docente la carga en la base nueva | transición por aula (pendiente 4) |
| **Dependencia de una función de borde** para entrar | sin ella nadie entra a la app nueva; se prueba con cuentas ficticias antes del corte; se puede deshacer sin tocar cuentas |
| **Huella de contraseña vieja (SHA-256 rápido)** | no se toca sin tu permiso (pendiente 2); el freno por IP reduce el riesgo |
| **Dos montos distintos para el mismo pago** anotados sin señal en dos aparatos | la base nunca decide sola entre dos montos: queda el primero y el otro va a «no se guardó», con frase clara |
| **Número de recibo sin señal**: no existe hasta que el pago llega a Supabase | la pantalla dice «recibo pendiente»; es el precio de que sea único y sin huecos |
| **Homónimos exactos** en la misma aula | la base lo impide; el docente añade algo que los distinga (pendiente 6) |
| **El dueño del proyecto Supabase** (rol `postgres`) técnicamente puede quitar los disparadores de la auditoría | ningún rol de la app puede; se puede añadir una copia diaria fuera de Supabase si se quiere más |
| **Android con `server.url`**: la primera apertura necesita señal; los datos viejos del APK quedan en otro origen; política de Google Play | se avisa antes de actualizar; alternativa documentada (APK con copia generada en CI) |
| **Realtime pierde mensajes** si se cae | al reconectar se pide lo cambiado desde la última hora vista, incluidas las borradas |
| **Plan gratuito de Supabase**: límites de Realtime y Edge Functions | 43 alumnos por aula está muy por debajo; se mide en las pruebas de estrés |
| **SQL viejo que, si se vuelve a correr, resucita funciones sin contraseña** | se les antepone una línea que aborta (en `SUPABASE-V2-CONGELAR.sql`) |

## Orden propuesto de las fases siguientes

1. **Vinculación de cuentas** (`SUPABASE-V2-VINCULACION.sql` + `metas-entrar`).
   Necesita tu aprobación explícita. No cambia nada para el docente.
2. **Esquema y vista de padres** (`ESQUEMA` + `FAMILIAS`) en un proyecto de
   prueba, con las capas A y B de `06-PRUEBAS.md` en verde.
3. **Código nuevo** (`js/datos/`), herramientas pasadas a filas, carga rápida,
   portal de padres; eliminación de lo de `05`. Pruebas completas en verde.
4. **Corte**: publicar, congelar lo viejo (`CONGELAR`), Android con
   `server.url`.

## Pendiente de tu aprobación

1. **Vinculación a Supabase Auth** (fase aparte), incluida la configuración del
   panel: apagar el alta pública, activar sesiones anónimas para padres
   (recomendado con CAPTCHA), exponer el esquema `metas`.
2. **¿Endurecer la huella vieja de contraseñas** (bcrypt al entrar)? Modifica
   filas de `docentes`; por la regla de cuentas no se hace sin tu sí.
3. **Pagos en conflicto** con montos distintos: ¿te parece la regla «queda el
   primero y el otro se avisa»?
4. **Transición de las familias**: (a) el portal nuevo se activa por aula
   cuando el docente la carga y, mientras tanto, el chatbot sigue leyendo lo
   congelado (solo lectura, sin caché); o (b) corte el mismo día para todos.
5. **¿Las familias ven lo recaudado del grado** (solo la suma) además de lo
   gastado?
6. **Homónimos**: ¿restricción dura por nombre completo, o solo aviso y la
   identidad como única restricción dura?
7. **PIN de convocatorias**: dejar de guardarlo y verificar al dueño por
   sesión; requiere añadir el dueño a `public.convocatorias`.
8. **Directores y roles** (`metas_rol_*`): hoy leen el blob; en el modelo nuevo
   necesitan una política de lectura según `docente_permisos`. Se diseña
   aparte.
9. **«Visto» de avisos por las familias** (`aviso_visto`): hoy apunta a los
   avisos viejos; hay que rehacerlo sobre `metas.avisos`.
10. **Android con `server.url`** (recomendado) o APK con copia generada en CI.
11. **Cambios de reglas en `CLAUDE.md`** (regla 5 de la fusión, regla 4 de las
    llaves de `localStorage`, publicación del APK). No se tocaron en esta fase.
