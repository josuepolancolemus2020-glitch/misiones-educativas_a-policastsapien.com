# 3. Guardado, conflictos y trabajo sin conexión

Fase 1: diseño (revisión 2). Nada de esto está programado.

## 3.1 Las reglas

1. **Supabase es la única fuente de verdad.** Lo que hay en el aparato es una
   **copia de lectura** para abrir sin señal. La copia nunca se sube, no se
   compara con la nube y no se "fusiona": con conexión se **reemplaza** por lo
   que dice Supabase.
2. **Del aparato a la nube solo viajan operaciones sobre UNA fila**,
   identificada por su `id`: crear, editar, borrar (o, en dinero, crear,
   corregir, anular). Nunca una lista ni un blob.
3. **El `id` se genera una sola vez**, en el aparato, al crear el dato, con
   `crypto.randomUUID()`. Si ese método no existe (navegadores viejos), se
   arma un uuid v4 con `crypto.getRandomValues()`. **Nunca `Math.random()`**
   (no es aleatorio de verdad y repite en aparatos baratos). La fila guarda
   además `op_creacion`, el id de la operación que la creó.
4. **Borrar es poner `deleted_at`** (hora del servidor). Una fila borrada **no
   vuelve**. Un alumno o una colecta con pagos o notas activos **no se pueden
   borrar**: el alumno pasa a `retirado`, `trasladado` o `desertor`; la
   colecta, a `cerrada`.
5. **El dinero nunca se decide solo.** Si dos aparatos no coinciden en un
   monto o una fecha de un pago, un gasto o un reembolso, se le pregunta al docente con los
   dos valores a la vista (3.5). Fuera del dinero, se aplica campo por campo.
6. **Nada se adivina.** No hay "pagos recuperados", ni búsqueda en copias
   viejas. Si un dato no está en Supabase, no existe.

## 3.2 Forma de una operación de la cola

```json
{
  "op_id":   "6f1c…",            // uuid (crypto.randomUUID) de la operación
  "seq":     1042,               // orden en este aparato, creciente
  "owner":   "a3b9…",            // auth.uid() del docente que la hizo
  "tipo":    "editar",           // crear | editar | borrar | pago_crear | pago_corregir | pago_anular | pago_editar | gasto_crear | gasto_editar | gasto_anular | alumno_crear
  "tabla":   "notas",
  "id":      "c0de…",            // id de la fila
  "base_version": 3,             // editar: versión que el aparato veía
  "base":    { "valor": "78" },  // editar: valor anterior de cada campo tocado
  "cambios": { "valor": "85" },  // crear: todos los campos; editar: solo los tocados
  "conocidos": [],               // pago_crear / gasto_crear: ids que el aparato tenía a la vista (3.5)
  "hecho_en": "2026-11-15T14:03:11.120Z"   // hora del aparato, solo informativa
}
```

- Campos que la base pone sola y el aparato **no puede mandar**: `owner`,
  `created_at`, `updated_at`, `updated_by`, `version`, `deleted_at`, el
  `recibo` de un pago y la `clave` nueva de una familia.
- `device_id` va en la cabecera `x-metas-aparato`; el `op_id`, en
  `x-metas-op` y como `op_creacion` de la fila creada.
- **Montos y notas viajan como texto** (`"150.50"`, `"85"`), en la cola, en la
  copia local y en las respuestas. Nunca como número de JSON: un `numeric`
  leído como número de coma flotante puede cambiar de valor. Al leer de la
  API, las columnas de dinero se piden convertidas (`select=monto::text,…`) y
  las funciones de dinero ya devuelven texto. Las sumas en el aparato se hacen
  en **centavos enteros**.
- Dos ediciones pendientes de la misma fila (no dinero), todavía sin enviar,
  se pueden juntar en una. Es lo único que se junta.

## 3.3 Cómo se aplica cada operación (y por qué reenviar no duplica)

| tipo | cómo | si se reenvía después de un corte |
|---|---|---|
| crear (no dinero) | `insert` por la API con el `id` y el `op_creacion` del aparato | choca la llave primaria → se lee la fila: si su `op_creacion` es **esta** operación, ya estaba hecha; si es **otra**, es un choque de id (no debería pasar nunca) y va a rechazos **sin pisar nada** |
| editar (no dinero) | `update cambios where id and version = base_version and deleted_at is null` | la versión ya subió → camino de 3.4 → los campos ya valen lo pedido → no se escribe nada |
| borrar | `update set deleted_at` (lo pone la base) | ya borrada → hecho. Si es un alumno o una colecta con pagos o notas, la base lo rechaza (`MT007`) |
| `alumno_crear` | función del servidor | misma operación → `ya_estaba` |
| `pago_crear`, `gasto_crear` | función del servidor | misma operación → `ya_estaba`; nunca un segundo pago |
| `pago_corregir` | función: anula el pago y crea su reemplazo en una sola transacción | misma operación → `ya_estaba` |
| `pago_anular`, `gasto_anular` | función | ya anulado → hecho |
| `pago_editar` (solo nota y recibo anterior), `gasto_editar` | función; los gastos comparan con la base | los campos ya valen lo pedido → no cambia nada |

**Nunca «upsert» en pagos ni en pagos de convocatoria.** La base no da
permiso de `INSERT` ni `UPDATE` directos sobre esas tablas, y una sonda rápida
busca `.upsert(` en el código.

## 3.4 Conflictos fuera del dinero: campo por campo

Ejemplo: el teléfono y la PC tienen la nota de Ana en `version = 3`.

1. La PC corrige la nota de 78 a 80 → la base acepta, `version = 4`.
2. El teléfono cambia la **personalidad** de Ana (otra tabla): no hay choque.
3. Si el teléfono también corrigió la nota (78 → 85) con `base_version = 3`,
   el `update … where version = 3` afecta **0 filas**.
4. El teléfono **lee la fila actual** (`version = 4`, valor 80).
5. Si está borrada → la operación se descarta (no se revive) y va a la lista
   de «no se guardó» (3.7).
6. Si no, **vuelve a aplicar su cambio campo por campo** sobre lo actual
   (`where version = 4`). Resultado: 85, `version = 5`. El 80 queda en la
   auditoría con su aparato y su hora.

Vale para notas, asistencia, controles, observaciones, nombres, números de
lista, avisos… Todo lo que **no** es dinero.

## 3.5 El dinero: siempre se pregunta

Pagos, gastos de colecta, gastos del docente, reembolsos y actas de
inventario se escriben **solo** con funciones del servidor, que nunca
eligen entre dos valores de dinero. Cuando otro aparato tocó lo mismo,
responden `{ok:false, pregunta:…}` con **los dos valores**, y el aparato le
muestra al docente una tarjeta con **dos botones** que dicen exactamente qué
queda. La operación espera la respuesta; el resto de la cola sigue saliendo.

### Varios pagos por alumno (abonos)

Un alumno puede tener **varios pagos** en la misma colecta. Cada uno es una
fila con **su propio recibo**. Lo pagado es la suma.

### Monto inmutable

El monto de un pago **no se edita**. Corregirlo es **anular** ese pago (con
motivo) y crear **otro** que lo reemplaza (`reemplaza_a`), en una sola
transacción (`pago_corregir`). La familia ve el recibo nuevo con «corrige al
recibo RC-…». Un pago se puede reemplazar **una sola vez**; la base lo
garantiza con un `unique` sobre `reemplaza_a`.

### Las preguntas

| caso | cuándo | tarjeta que ve el docente |
|---|---|---|
| **Pago creado que el aparato no sabía que existía** | `pago_crear` encuentra otro pago activo de ese alumno en esa colecta que no estaba en `conocidos` (lo anotó otro aparato, quizá sin señal) | 1.º «En otro aparato se anotó **L 50.00** de Ana para Excursión (3 de marzo). Aquí anotaste **L 60.00**. ¿Es el mismo dinero?» → **[Son dos pagos distintos]** guarda este también · **[Es el mismo dinero]** pasa a: 2.º «¿Cuál es el monto correcto?» → **[Dejar L 50.00]** (se descarta este) · **[Dejar L 60.00]** (se corrige el otro a 60 con `pago_corregir`). Con montos iguales se pregunta igual: dos abonos de L 50 son posibles |
| **Corregir un pago que otro aparato ya cambió** | `pago_corregir` encuentra el pago anulado, reemplazado, o con **otro monto u otra fecha** que la base que el aparato veía. Un cambio en la nota o en el recibo anterior **no** hace preguntar | «En otro aparato el pago de Ana quedó en **L 55.00**. Tú lo corriges a **L 60.00**.» → **[Dejar L 55.00]** · **[Dejar L 60.00]** |
| **Anular un pago que otro aparato corrigió** | `pago_anular` encuentra que ya fue reemplazado | «En otro aparato este pago se corrigió a **L 60.00**.» → **[Anular también el de L 60.00]** · **[Dejar L 60.00]** |
| **Fecha de un pago**: es inmutable una vez numerado (como el monto). Cambiarla es corregir: `pago_corregir` | `pago_corregir` | «Pago de Ana: ¿3 de marzo o 5 de marzo?» → dos botones con las dos fechas |
| **Gasto creado sin saber del otro** | `gasto_crear` encuentra otro gasto de esa colecta el mismo día con el mismo monto o concepto | «¿Es el mismo gasto?» → **[Son dos gastos]** · **[Es el mismo]** (y si los montos difieren, segunda tarjeta con los dos montos) |
| **Editar monto o fecha de un gasto** que otro aparato cambió | `gasto_editar`, `gasto_docente_editar` | dos botones con los dos montos (o fechas). El concepto, la categoría y a quién cobrar se aplican campo por campo sin preguntar |
| **Reembolso de un gasto del docente** anotado en dos aparatos, corregido o anulado a la vez | `reembolso_crear`, `reembolso_corregir`, `reembolso_anular` | las mismas tarjetas que para los pagos: «¿Es el mismo dinero?», y si lo es, dos botones con los dos montos |

Nada de esto es técnico: son las preguntas que haría un tesorero.

## 3.6 Alumnos creados sin señal: solo la identidad une

`alumno_crear` es una función del servidor:

| situación | qué pasa |
|---|---|
| ya hay un alumno activo con la **misma identidad** (mismo país y documento) en el aula | es la misma persona: el aparato **cambia su id local por el existente** en esta operación y en todas las que siguen en la cola (los pagos y notas anotados sin señal pasan al alumno correcto), y lo que este aparato escribió de su ficha se aplica como edición campo por campo |
| mismo **nombre** completo y a uno de los dos le falta identidad | se **pregunta**: «Ya tienes a **Ana María López Cruz** (n.º 12, sin identidad). ¿Es la misma persona?» → **[Es la misma]** (une como arriba) · **[Son dos alumnos distintos]** (se crea; se reenvía con `p_no_es`) |
| mismo nombre y **las dos identidades distintas** | se crea (son homónimos) y se muestra un aviso discreto: «Hay dos alumnos con el mismo nombre en tu lista» |
| nombre parecido o repetido al **editar** | solo un aviso discreto; nunca bloquea |

La única regla dura de la base es la identidad (`unique` por aula, país y
documento). El nombre repetido **no** es una restricción.

### Notas, asistencia y demás con llave natural

Una nota (alumno + asignatura + periodo + componente), una asistencia (alumno
+ día), un valor de control (control + alumno): si dos aparatos la crean sin
señal, el segundo `crear` choca con el `unique`, el aparato busca la fila
activa que ya ocupa esa llave, **cambia su id local por el de esa fila** y
convierte el `crear` en un `editar` campo por campo (3.4). No es dinero, así
que no se pregunta.

## 3.7 La cola sin conexión

**Dónde vive.** IndexedDB, base `metas-datos-v2`, almacén `cola`, llave `seq`.

**Cuándo se envía.** Sola, sin botón: al guardar cualquier dato; al volver la
señal (`online`), al volver a la app (`visibilitychange`) y al abrirla; con
reintentos de 2, 4, 8, 16, 32 y 60 segundos mientras haya algo pendiente.

**En qué orden.** Por `seq`, **de a una**. Un pago nunca llega antes que el
alumno que lo recibe. Una operación que espera la respuesta del docente
(3.5) se aparta al almacén `preguntas` y la cola sigue con las siguientes que
no dependen de ella; las que sí dependen (un pago para un alumno cuya alta
espera respuesta) esperan con ella.

| respuesta | qué pasa |
|---|---|
| éxito | se saca de la cola; la fila devuelta reemplaza a la de la copia local |
| sin red, 5xx, tiempo agotado | se reintenta igual (es idempotente) |
| 401 | se renueva la sesión; si no se puede, la cola **se pausa** y se pide la contraseña («Escribe tu contraseña»), sin explicar por qué |
| `{pregunta:…}` | al almacén `preguntas`; tarjeta con dos botones (3.5, 3.6) |
| choque de llave natural (no dinero) | camino de 3.6 |
| error permanente (alumno borrado en otro aparato, colecta cerrada, alumno con pagos que se quiso borrar) | sale de la cola y se muestra la tarjeta «no quedó anotado», con la razón del aula |

**Lo que no se pudo anotar.** Pocas veces pasa, porque la pantalla valida
antes de encolar. Cuando pasa, se dice **la razón del aula**, nunca una razón
técnica: «El pago de Ana para Excursión no quedó anotado: esa colecta ya está
cerrada». Un solo botón: «Entendido». Se manda también a `metas.rechazos` (con
tope de tamaño y de frecuencia) para soporte. Sin botón de reintentar,
recuperar ni restaurar.

**Una cola por cuenta.** Cada operación lleva su `owner`. Si en el aparato
entra otra cuenta, las operaciones de la anterior no se envían con la sesión
nueva. Al cerrar sesión: si hay señal, la app termina de enviar lo pendiente
antes de cerrar (el botón muestra su espera normal, sin texto); si no hay
señal, lo conserva para esa cuenta en ese aparato y lo envía cuando esa cuenta
vuelva a entrar. **Sin mensaje** (regla de interfaz, `09-INTERFAZ.md`).

## 3.8 Lectura: lo que muestra la pantalla

**Al abrir con señal**: se pinta con la copia local; se piden las filas
**activas** del aula (montos como texto); la copia de esa aula se
**reemplaza**; encima se dibujan las operaciones de la cola (como si ya
estuvieran guardadas: el docente no ve diferencia) y las preguntas de dos
botones que esperan respuesta.

**Mientras está abierta**: Realtime en un canal por aula, filtrado por
`aula_id`. En tablas de dinero, el evento solo avisa: el aparato vuelve a
pedir esa fila con los montos como texto (no usa el número que trae el
evento). En el resto, si la `version` es mayor se reemplaza; si trae
`deleted_at`, se quita.

**Al reconectar**: lo cambiado desde la última hora de servidor vista,
**incluidas las borradas**: `updated_at > cursor − 2 minutos`; lo repetido se
descarta por `version`.

**Sin señal**: copia local + cola. Boletas, cuadros y totales se calculan con
lo mismo que se ve. El número del recibo de un pago anotado sin señal
todavía no aparece (lo pone la base) y el botón de imprimir ese recibo espera
sin decir nada; aparece solo cuando vuelve la señal.

## 3.9 Lo que ve el docente

Nada técnico (`09-INTERFAZ.md`). Escribe y queda. Lo único:

- **sin señal**, un punto gris con un ícono de señal tachada en la barra de
  arriba (con `aria-label="Sin señal"`), que desaparece solo al volver la
  señal. Con señal no se muestra nada: ni «Guardado» ni «Guardando…»;
- las **preguntas de dinero** de dos botones («¿L 50 o L 60?») y la de
  «¿es la misma persona?»;
- la tarjeta «no quedó anotado» con la razón del aula, rara vez.

Desaparecen todos los botones, avisos e indicadores de sincronizar, estar al
día, recuperar, restaurar, papelera, versiones, copias en la nube, usar este
equipo, empezar de nuevo y «pagos recuperados» (lista exacta, con
archivo:línea, en `09-INTERFAZ.md`).

## 3.10 Módulos nuevos del lado del aparato

| archivo | responsabilidad |
|---|---|
| `js/vendor/supabase.min.js` | `supabase-js` alojado en el sitio (sin CDN) |
| `js/datos/ids.js` | `nuevoId()`: `crypto.randomUUID`, respaldo `crypto.getRandomValues`, **nunca** `Math.random` |
| `js/datos/montos.js` | leer lo que el docente escribe (3.11), centavos enteros, texto canónico |
| `js/datos/nube.js` | cliente, sesión, cabeceras `x-metas-aparato` y `x-metas-op`, entrada por `metas-entrar` |
| `js/datos/almacen.js` | IndexedDB: copia de lectura, `cola`, `preguntas`, `rechazos`, cursores |
| `js/datos/cola.js` | envío en orden, reintentos, conflictos (3.4), preguntas de dinero (3.5), identidad (3.6) |
| `js/datos/tiempo-real.js` | canal por aula, reconexión, cursor |
| `js/datos/senal.js` | el punto gris de «sin señal»: lo único que la app dice de la conexión |
| `js/datos/datos.js` | la única API de las herramientas: `crear`, `editar`, `borrar`, `lista`, `escuchar`, y `pagar`, `corregirPago`, `anularPago`, `gasto…`, `gastoDocente…`, `reembolso…`, `actaInventario` |
| `js/datos/calculos.js` | totales, boletas, cuadros y promedios **calculados** desde filas, con las mismas fórmulas que las vistas |

## 3.11 Cómo se leen los montos que escribe el docente

| escrito | se entiende | por qué |
|---|---|---|
| `150`, `150.00`, `L 150`, `L. 150` | 150.00 | |
| `150.5`, `150,5`, `150.50`, `150,50` | 150.50 | coma o punto seguidos de **1 o 2** cifras = centavos |
| `1500`, `1 500` | 1500.00 | |
| `1,500` o `1.500` | **se pregunta**: «¿Quisiste decir **mil quinientos** (L 1,500.00) o **uno con cincuenta** (L 1.50)?» → dos botones | coma o punto seguidos de **exactamente 3** cifras es ambiguo |
| `1,500.50` | 1500.50 | separador de miles y centavos, sin ambigüedad |
| `150.555`, `-5`, `abc` | no se acepta | |

El resultado se guarda como texto canónico (`"1500.00"`), nunca como número.
