# Rediseño de datos de M.E.T.A.S · revisión 10 · corte 1, parte 3

Rama `rediseño-datos`. Hasta la revisión 7, **solo diseño**. Desde la
revisión 8 existe el **motor de datos del corte 1** (`js/datos/`) y desde la
revisión 9 **su pantalla**: Mi aula del corte 1 (`js/tools/mi-aula.js`), la
entrada por `metas-entrar` y la entrada nueva de las familias. No se tocó
Supabase real ni ninguna fila de docentes, y no hubo merge. Los `.sql` se
**probaron de verdad** en un PostgreSQL 16 local y desechable con un Supabase
simulado (capa A, `pruebas-capa-a/`), nunca en el proyecto real. Fuera de
`docs/rediseno-datos/` cambiaron `CLAUDE.md` (reglas 15 a 18 en la revisión 3,
4 y 5 en la revisión 4, 18 ampliada y 19 nueva en la revisión 6, todas con
tu aprobación) y `_dev/supabase-local/` (revisión 6: pruebas contra
`supabase start` y las funciones de borde; no se publica).

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
| `pruebas-capa-a/` | `corre.sh` + plataforma Supabase simulada + modelo viejo + datos ficticios + **291 pruebas en verde** |
| `pruebas-capa-b/`, `pruebas-capa-c/` | capas B (cola y conflictos) y C (navegador) del corte 1, con su contrato, escritas antes del código. **B 12/12 y C 13/13 en verde (revisión 10)** |
| `_dev/supabase-local/` | CLI fija, `corre-supabase.sh` (capas A, A+, B y C contra `supabase start`), funciones de borde, capa A+ y `arma-supabase-js.sh` |
| `js/datos/` (fuera de esta carpeta) | el motor de datos del corte 1 (`03`, 3.10). `js/vendor/supabase.min.js`: Realtime de supabase-js 2.45.4 |
| `js/tools/mi-aula.js`, `css/mi-aula.css` (fuera de esta carpeta) | Mi aula del corte 1, la pantalla del motor (rev. 9); desde la rev. 10, con la forma de trabajar de la Mi aula de siempre |
| `js/tools/mi-aula-papel.js` (fuera de esta carpeta) | arma con las filas los datos de las hojas impresas de main, sin tocarlas (rev. 10) |

## Cambios de la revisión 10 (corte 1, parte 3): el diseño de Mi aula

**Verificado aquí** con `corre-supabase.sh --todo` desde cero (Supabase
local, CLI 3.1.0, Node 22, datos ficticios): capa A **291**, A+ **26**,
B **12** y C **13**, todo en verde en una sola corrida; `npm test` **78**
en verde. Antes de tocar nada, la misma corrida con el código de la
revisión 9: A 291, A+ 26, B 12, C 10.

**Decisión de Josué**: la pantalla de la revisión 9 (listas con cajitas
para escribir montos) era un paso atrás. Se conserva entera la forma de
trabajar de la Mi aula de siempre y se supera en lo visual. Detalle en
`09`, 9.6.

- **Mi aula** (`js/tools/mi-aula.js`, `css/mi-aula.css`): grupos como
  pastillas y las diez secciones con su ícono; cuadrícula de un toque en
  Asistencia, colectas y Controles; Economía con sus puertas, «Mis
  colectas» con barra y saldo; Notas SACE con parcial y sección como
  interruptores, tabla con la columna de alumnos fija y notas por color de
  nivel. Tarjetas con aire, un color por sección (todos AA), botones de 44
  px o más, transiciones cortas que se apagan con `prefers-reduced-motion`,
  sin corrimiento lateral en 390, 800 y 1366 px salvo dentro de la tabla de
  notas. Lo único que dice de la conexión sigue siendo el punto gris.
- **Lo que todavía vive en el blob** (Equipos, Acumulativos, Estadísticas,
  Lectura, Gastos de mi bolsillo, Inventario) se abre desde su pastilla en
  la pantalla de antes, con su candado, y la flecha vuelve a Mi aula.
- **Lo impreso no se tocó**: `js/tools/mi-aula-papel.js` arma el objeto que
  leían las hojas de main y las llama tal cual. Boletas, Cuadro final,
  resumen final, ingresos, egresos y talonario: mismo HTML letra por letra y
  misma imagen impresa con un aula ficticia (blob en main, filas en la
  rama). `registros-admin.js` no cambió en esta revisión.
- **El motor y las reglas del dinero, sin cambios** (`js/datos/` igual que
  en la revisión 9). El monto de un toque es el `monto_sugerido` de la
  colecta, tal como lo da la base («50.00»).
- **La tarjeta de abajo solo se repinta si cambió**: antes se volvía a
  dibujar con cada aviso del motor y borraba lo que el docente escribía en
  la cajita (lo destapó C3, que fallaba de vez en cuando).
- **Capa C** ajustada a estas pantallas (contrato en
  `pruebas-capa-c/CONTRATO-PANTALLA.md`): C1 recorre las seis secciones en
  filas y mide que todo lo que se toca tenga 44 px; C3 anota de un toque en
  el teléfono y con «Otro monto» en la PC; nuevas **C9** (colectas: un
  toque, «Faltan por dar», quitar con dos botones, «Otro monto»), **C10**
  (asistencia: todos presentes de entrada, un toque, «Todos presentes este
  día») y **C11** (controles: ✓ y quitarla, «Anotados N/M», marcar a todos
  y quitar las marcas). `METAS_SOLO=C9` corre una sola.
- **Falta** (09, 9.6): la clave de familia en el talonario (una línea de una
  hoja impresa, espera tu aprobación), los logos de la boleta y poner
  exenciones desde la pantalla.

## Cambios de la revisión 9 (corte 1, parte 2), por punto

**Verificado aquí** con `corre-supabase.sh --todo` desde cero (Supabase local,
CLI 3.1.0, Node 22, datos ficticios): capa A **291**, A+ **26**, B **12** y C
**10**, todo en verde en una sola corrida; `npm test` en verde.

**A. Arreglos de la parte 1**

1. **Dos pestañas (H1).** Una sola cola por aparato: una pestaña líder
   (`navigator.locks`) escribe la cola, envía, renueva la sesión y escucha
   Realtime; las demás anotan en `entrantes` (llave `op_id`) y le avisan por
   `BroadcastChannel`; la líder reparte el estado y la sesión nueva. Sin
   ningún aviso visible. **B11** (dos pestañas sin señal anotan a la vez y se
   cierran): con el código de la revisión 8 quedaban 3 pagos de 6.
2. **Renovar la sesión (H2):** 429 y 408 son falta de red; no cierran la
   sesión.
3. **Canal `metas-filas` (H3):** elegí que el aviso de Realtime **solo
   provoque releer la fila por la API** (con sesión y RLS) y nunca se guarde
   tal como llega. No cambia el SQL, y aunque el canal llevara algo de más,
   nada se guarda sin pasar por la vía normal. Los avisos de un mismo momento
   se juntan en una lectura por tabla.
4. **B4** pierde solo la respuesta de `pago_crear`, y además comprueba que
   no salga «no quedó anotado» y que el aparato tenga su pago con el mismo id
   y el recibo de la base. Falla si cada reenvío usa otra operación
   (comprobado con una mutación).
5. **`calculos.js`** tiene su prueba (**B12**) contra las vistas de la base.
   La diferencia que había: con un monto sugerido por aclarar, el aparato
   contaba 0 y decía «no le corresponde»; ahora lo que depende de ese monto
   queda sin dato (`por_aclarar`).
6. **Sonda de la regla 19**: detecta también `+x`, `x*1`, `1*x`, `x/1`,
   `x|0`, `~~x` y `x-0` (cada una comprobada con una mutación).
7. **`corre-supabase.sh`** espera a que la API responda 200 y a que una
   función de `metas` ya se vea, después de `db reset` y antes de A+.
8. **K20**: `metas.freno_devolver` da `permission denied` a anon y a una
   sesión.

**B. La pantalla**

- **Mi aula del corte 1** (`js/tools/mi-aula.js`, `css/mi-aula.css`), cargada
  en `index.html` con el motor, sellada (`?v=549`) y en el armazón de
  `sw.js` (`meta-app-v549`). Nueve partes; dibuja solo lo que el motor
  ofrece: el punto gris sin señal (`aria-label="Sin señal"`), las preguntas
  de dos botones de 44 px, «no quedó anotado» con «Entendido» y «Escribe tu
  contraseña». Al tocar algo de una colecta cerrada, antes de nada,
  «¿Reabrirla?» y el «¿Por qué?» opcional de 09, 9.1.
- **La entrada** de la Zona Docente entra por `metas-entrar`. Mientras haya
  herramientas en el blob, abre además la sesión vieja para ellas, si puede;
  esas herramientas se abren desde «Más del aula».
- **Gastos de colecta** en el motor (`d.gasto`), solo por funciones, con su
  pregunta de dos botones.
- **Frases para el docente**: los errores de `datos.js` que pueden llegar a
  la pantalla son frases del aula (`paraElDocente`); ningún otro se muestra.
- **Familias** (`padres.html`): la entrada nueva por `familia-vincular`, la
  frase de la clave vencida y los recibos en «L 150.00». En el sitio
  publicado sigue como hoy hasta que haya llave de Turnstile.
- **09**: lo quitado y lo que falta, en `09`, 9.5.
- **Capa C**, dos cambios en la prueba (con su porqué escrito): la entrada se
  alcanza tocando «Zona Docente» (decidido por Josué) y C6 cuenta solo los
  nombres que pega. La capa A deja, al final, la Rifa cerrada para C4.

## Cambios de la revisión 8 (corte 1, parte 1), por punto

**Verificado aquí** (Supabase local real, CLI 3.1.0, Node 22, datos
ficticios): capa A 288/288 en PG16 y contra `supabase start`; capa A+ 26/26;
capa B 10/10; `npm test` 78/78. Capa C: pendiente de la pantalla (parte 2).

**A. La IP de los frenos, CONFIRMADA** (prueba 6.8, hecha por Josué el
15/11/2026 en un proyecto alojado aparte, con una función temporal que solo
repetía cabeceras): `cf-connecting-ip` trae la IP pública real; si el
aparato manda la suya, Cloudflare rechaza la petición (403, error 1000);
un `x-forwarded-for` del aparato se descarta y se reemplaza; y
`true-client-ip` enviado por el aparato **pasa tal cual**, así que nunca se
usa (regla de `02`, 2.5, junto a `x-forwarded-for`). Los frenos por IP se
quedan en el corte 1. Anotado en `02`, `06` (6.8), `08` y en
`_compartido/comun.ts`.

**B1. El freno por correo cuenta solo los fallos** (H2). Antes contaba
también las entradas buenas: quien supiera el correo de un docente lo dejaba
una hora afuera entrando bien veinte veces (o el propio docente, con tres
aparatos). Ahora cada intento se cuenta **al llegar** (veinte a la vez no
pasan todos) y, si la contraseña era la buena, **se devuelve**
(`metas.freno_devolver`, nuevo en `SUPABASE-V2-VINCULACION.sql`). Lo que
frena: veinte contraseñas equivocadas en la hora. No abre la puerta a
adivinar: los fallos siguen contando igual, y una entrada buena no borra los
fallos anteriores, solo no suma el suyo. Capa A+: E6 en dos pruebas
(veinticinco entradas buenas seguidas no frenan; veinte malas sí, y la 21.ª
espera aunque sea la buena). Con la función de antes, la primera falla en la
entrada 21.

**B2. La fecha del paso 4 y pg_cron** (H3, H4). La tarea de pg_cron no
guarda el año: una fecha a 13 meses habría corrido el mes siguiente, sin
cerrar nada, y se habría borrado sola. Ahora anotar una fecha a **más de 11
meses** se rechaza con un error claro (`MT044`, «anótala cuando falten menos
de 11 meses»), y **mover la fecha borra siempre la tarea anterior**, también
cuando la nueva ya pasó. Capa A: K18 (tres pruebas) y K19; K16 usa ahora
una fecha a 60 días. Con `SUPABASE-V2-FAMILIAS.sql` de la revisión 7 fallan
esas cuatro y pasan las demás (comprobado).

**B3. El «0.00» de lo reembolsado**, con su propia prueba (G10): un gasto
del docente sin reembolsos dice «0.00» (texto), vuelve a «0.00» si su único
reembolso se anula, y la pregunta «menos que lo reembolsado» trae «250.00».

**C. El motor de datos** (`js/datos/`, nueve archivos en el orden del
contrato, un solo global `window.MetasDatos`). Sin pantalla, sin tocar
`padres.html`, el código viejo ni la APK. Lo que hace:

- **Cola por cuenta** en IndexedDB (`metas-datos-v2`): cada cosa anotada es
  una operación con su `op_id`; sale sola, en orden, de a una, con
  reintentos de 2 a 60 s y al volver la señal o la app. Reenviar nunca
  duplica (B3, B4).
- **Dinero solo por funciones** y **siempre como texto**: `montos.js` lee lo
  que escribe el docente (3.11; «1,500» se pregunta), suma en centavos
  enteros con `BigInt`, y nada usa `Number()` ni `parseFloat()`.
- **Ninguna decisión de dinero sola**: cada desacuerdo es una pregunta de dos
  botones (otro pago sin ver, pago corregido en otro aparato, colecta
  cerrada, monto ambiguo, exención o monto sugerido cambiado). La operación
  espera; la cola sigue con lo que no depende de ella.
- **Identidad**: la misma identidad une sola (el id local pasa al alumno que
  ya estaba, también en los pagos anotados sin señal); el mismo nombre sin
  identidad pregunta (B7).
- **Fuera del dinero, campo por campo** con `version` (3.4); la llave
  natural (nota, asistencia, valor de control…) convierte el segundo
  «crear» en edición (3.6).
- **Lo de otro aparato al momento**: Realtime para lo que no es dinero; para
  el dinero, el toque sin datos del canal `docente:<uid>` y la fila se vuelve
  a leer en `vd_<tabla>` (B8). Al entrar y al volver la señal, «ponerse al
  día» con lo borrado incluido (B10), de a mil filas por `(updated_at, id)`.
- **Totales calculados** en el aparato con las mismas fórmulas que las vistas
  (`calculos.js`), comprobados contra la base.

`js/vendor/supabase.min.js` lleva **solo Realtime** de supabase-js 2.45.4
(realtime-js 2.10.2), armado con `_dev/supabase-local/arma-supabase-js.sh`:
el resto de supabase-js no se usa (se entra por `metas-entrar` y la API se
llama con `fetch`), y su módulo de Auth, solo con cargarse, escribe en
`localStorage` una llave hecha con `Math.random` (regla 16). El `dist/umd`
del paquete tampoco sirve tal cual: webpack busca etiquetas `<script>` al
cargar. Sonda rápida nueva: `_dev/verifica-datos-reglas.js` (reglas 15, 16
y 19, textos prohibidos, el armado fijo del vendor).

**No se cambió el contrato ni el SQL para que la B pasara.** El único cambio
de SQL es el de los puntos B1 y B2.

## Cambios de la revisión 7, por punto

**Verificado por Josué** (Supabase local real, CLI 3.1.0, Node 24, datos
ficticios): capa A 271/271 en PG16, PG17 y Supabase local; `npm test` 77/77;
capas B y C «pendiente»; las funciones de borde pasan con su contenedor vivo.
La regla 19 ya estaba en la rama (commit `5a4fcfc8`).

**`_dev/supabase-local` funciona tal como viene** (sus cuatro arreglos, ya
probados por él): migración que crea el esquema `metas` vacío; `dblink` a
`supabase_db_<project_id>:5432`; D3 con los parámetros reales y 401;
borrar el contenedor de funciones de `supabase start` y esperar «Serving
functions on» antes de probar. De las dos salidas del punto 4 tomé esa y dejé
`edge_runtime` encendido, porque no tengo cómo comprobar aquí que
`functions serve` arranque con él apagado.

**5. La IP de los frenos (era un error).** La revisión 6 tomaba el último
valor de `x-forwarded-for`. Según la documentación oficial: Supabase dice que
su plataforma pone `cf-connecting-ip` en cada petición, y Cloudflare dice que
trae una sola IP y que a `x-forwarded-for` le **agrega** lo suyo a lo que
mandó el aparato. Ahora: solo `cf-connecting-ip`; sin IP válida, **sin
freno por IP** (nunca un balde común para todos). Frenos nuevos que no
dependen de la IP: **20 entradas por hora por correo** (desde la revisión 8,
solo las fallidas) y **20 vínculos por hora por familia**. Función
`metas-diagnostico-ip` (apagada salvo `METAS_DIAGNOSTICO=1`) y procedimiento
para confirmarlo en un proyecto de prueba aparte (`06`, 6.8): **confirmado**
en la revisión 8. Pruebas K17, E6, IP1, IP2.

**6. Cierre de canales a la hora del vencimiento.** Anotar la fecha del paso 4
la **programa con pg_cron** para ese minuto (UTC, al minuto siguiente); la
tarea cierra los canales de las claves vencidas y se borra sola. Si la fecha
ya pasó, cierra en el acto; sin pg_cron, anotarla falla (`MT043`). Mover la
fecha la reprograma. El simulador trae un pg_cron mínimo. Prueba K16.

**7.** El acta de un centro sin bienes dice «0.00», no «0» (también el
reembolsado de una pregunta). Prueba N10.

**Resultado**: capa A, 280 en verde; capa A+, 25 pruebas (corren en tu
entorno); `npm test`, 77 en verde.

## Cambios de la revisión 6, por punto

**Verificado por Josué** en un Supabase local real (CLI 3.1.0, PG 17.11, solo
datos ficticios): capa A 236 en verde con CONGELAR dos veces; `postgres` con
`rolbypassrls` y las tablas de `metas` suyas sin FORCE RLS (las funciones de
dinero escriben); por la API, insertar directo en pagos o colectas → 403,
padre anónimo con `pago_crear` → 403, sin sesión → 401; Realtime: el padre
vinculado recibe, otra familia «Unauthorized», un alumno trasladado ya no se
une. Las firmas de las 4 funciones que CONGELAR renombra coinciden.

**Decisiones**: `pago_editar` bloqueado en colecta cerrada, sí. Regla 18 de
`CLAUDE.md` con el texto propuesto: agregada.

**R5-1. El dinero sale como texto, siempre.** Las columnas de dinero de las
ocho tablas que lo tienen ya **no se pueden leer** con la sesión; la fila
completa sale de `vd_<tabla>` con el dinero en texto («150.00»). Los totales
(`v_colecta_alumnos`, `v_colectas_resumen`, `v_gastos_docente`,
`v_gastos_docente_resumen`, `v_inventario_resumen`) pasan a texto sobre
vistas internas de cálculo (`_calc_*`) que nadie de la app lee; también las
`vf_*` del portal y la auditoría. Las tablas de dinero salen de la
publicación de Realtime (su evento traería el número) y en su lugar llega un
toque sin datos por el canal privado `docente:<uid>`. Regla escrita en `03`,
3.8. Pruebas D1 a D6 (y A+ R5-1).

**R5-2. Canal por teléfono.** `acceso:<id del vínculo>` en vez de
`familia:<id>`: la base decide en cada toque a qué vínculos manda, así que un
teléfono cuya clave venció o cuyo alumno se trasladó deja de recibir al
instante aunque siga conectado, y recibe una vez `cerrar`. Lo disparan el
cambio de estado o el borrado del alumno, el borrado de la familia, la
desvinculación y el hito de vencimiento; una tarea horaria opcional cubre la
hora exacta (paso 4). Pruebas K13 a K15 (y A+ R5-2).
De paso apareció un fallo real: volver a entrar con la tira nueva en un
teléfono ya vinculado respondía «ok» pero dejaba el vínculo con la clave
vencida (`on conflict do nothing`); ahora el vínculo pasa a la clave nueva.

**R5-3. El año del recibo sale de la fecha del pago.** Prueba R7.

**Preparación del corte 1.**
1. `_dev/supabase-local/`: CLI fija 3.1.0, `config.toml`, `corre-supabase.sh`
   (se niega fuera de `127.0.0.1`/`localhost` o con `supabase link`; cuentas
   ficticias por la API de Auth; CONGELAR dos veces). Para que el mismo
   `10-pruebas.sql` corra en los dos lados, el simulador se partió en
   plataforma (solo Postgres suelto) y modelo viejo (los dos), y
   `realtime.messages` usa las columnas reales (`inserted_at`).
2. Las tres funciones de borde, completas, y la capa A+ (24 pruebas en Node
   contra la API, Auth y Realtime reales).
3. Capas B (10 escenarios) y C (8 pruebas; la primera en tres tamaños) del corte 1, con
   sus contratos, escritas antes del código.
Aquí no hay Docker: la capa A+ y la corrida contra `supabase start` quedan
listas para correr en tu entorno (`06`, 6.6).

**Resultado**: capa A, 271 en verde (eran 236); quitando una a una las
correcciones en una copia, caen 16. `npm test`: 77 sondas en verde.

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

1. Correr en tu entorno `bash _dev/supabase-local/corre-supabase.sh --todo`.
2. Lo que falta de 09 (`09`, 9.5) y aprobar el texto nuevo de
   `privacidad.html`.
3. Las herramientas que siguen en el blob, al blob por sesión; después,
   quitar la sesión vieja y «Más del aula».
4. La llave de Turnstile del sitio para la entrada nueva de las familias.
5. Antes de fijar la fecha del paso 4: activar pg_cron, y fijarla cuando
   falten menos de 11 meses.
