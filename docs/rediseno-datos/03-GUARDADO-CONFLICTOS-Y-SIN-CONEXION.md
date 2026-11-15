# 3. Guardado, conflictos y trabajo sin conexión

Fase 1: diseño. Nada de esto está programado.

## 3.1 Las cinco reglas

1. **Supabase es la única fuente de verdad.** Lo que hay en el aparato es una
   **copia de lectura** para poder abrir sin señal. La copia nunca se sube, no
   se compara con la nube y no se "fusiona": cuando hay conexión, se
   **reemplaza** por lo que dice Supabase.
2. **Lo único que viaja del aparato a la nube son operaciones sobre UNA fila**,
   identificada por su `id`: crear, editar o borrar. Nunca una lista, nunca un
   blob, nunca "el aula entera".
3. **El `id` se genera una sola vez**, en el aparato, en el momento en que el
   docente crea el dato (`crypto.randomUUID()`), y ya no cambia. Por eso crear
   sin señal funciona y por eso reenviar no duplica.
4. **Borrar es poner `deleted_at`** (con la hora del servidor). Una fila
   borrada **no vuelve**: la base rechaza cualquier edición sobre ella.
5. **Nada se adivina.** No hay "pagos recuperados", ni "datos que faltaban", ni
   búsqueda en copias viejas. Si un dato no está en Supabase, no existe.

## 3.2 Forma de una operación de la cola

```json
{
  "op_id":   "6f1c…",            // uuid de la operación (rastro en auditoría)
  "seq":     1042,               // orden en este aparato, creciente
  "owner":   "a3b9…",            // auth.uid() del docente que la hizo
  "tipo":    "editar",           // crear | editar | borrar
  "tabla":   "pagos",
  "id":      "c0de…",            // id de la fila
  "base_version": 3,             // solo editar: versión que el aparato veía
  "base":    { "monto": "50.00" },        // solo editar: valor anterior de cada campo tocado
  "cambios": { "monto": "60.00" },        // crear: todos los campos; editar: solo los tocados
  "hecho_en": "2026-11-15T14:03:11.120Z"  // hora del aparato, solo informativa
}
```

- `crear` lleva la fila completa con su `id` ya generado.
- `editar` lleva **solo los campos que el docente tocó**, con su valor anterior.
- `borrar` no lleva campos.
- Campos que la base pone sola y el aparato **no puede mandar**: `owner`,
  `created_at`, `updated_at`, `updated_by`, `version`, `deleted_at` (lo pone la
  base cuando la operación es `borrar`) y `recibo` de un pago (lo numera la
  base; sin señal, la pantalla muestra «recibo pendiente» hasta que llega). El disparador los sobrescribe aunque
  vengan.
- `device_id` va en la cabecera `x-metas-aparato` de cada petición (se fija una
  vez en `supabase-js`) y el disparador lo copia a la fila.

Dos ediciones pendientes de **la misma fila**, todavía sin enviar, se pueden
juntar en una (se conserva la `base` de la primera y los `cambios` de la
última). Es lo único que se junta, y es una sola fila.

## 3.3 Cómo se aplica cada operación (y por qué reenviar no duplica)

| tipo | petición | si se reenvía después de un corte |
|---|---|---|
| crear | `insert` con el `id` del aparato | choca con la llave primaria → se lee la fila por `id`; si existe y es mía, la operación **ya estaba hecha** |
| editar | `update cambios where id = :id and version = :base_version and deleted_at is null` | la versión ya subió → camino de conflicto (3.4) → los campos ya valen lo pedido → no se escribe nada |
| borrar | `update set deleted_at = now() where id = :id and deleted_at is null` | 0 filas → se lee la fila → ya está borrada → hecho |

No hace falta una tabla de "operaciones ya aplicadas": cada operación es
idempotente por construcción. El `op_id` va igual a la auditoría para poder
seguir el rastro de un cambio hasta el aparato y el momento.

## 3.4 Conflictos: dos aparatos editan la misma fila

Ejemplo: el teléfono y la PC tienen el pago de Ana en `version = 3`.

1. La PC cambia la **fecha** y guarda → la base lo acepta, `version = 4`.
2. El teléfono cambia el **monto** con `base_version = 3` → `update … where
   version = 3` afecta **0 filas**.
3. El teléfono **lee la fila actual** (`version = 4`, fecha nueva, monto viejo).
4. Si la fila está borrada → la operación **se descarta** (regla 4: nada se
   revive) y va a la lista de rechazos (3.6).
5. Si no, **vuelve a aplicar su cambio campo por campo** sobre lo actual: solo
   `monto`, con `where version = 4`. Resultado: fecha de la PC **y** monto del
   teléfono, `version = 5`.
6. Si en ese instante otro aparato vuelve a ganar, se repite desde 3 (máximo 5
   vueltas; después, la operación espera al siguiente intento de la cola).

Cuando los dos tocaron **el mismo campo**, queda el del que llegó segundo, que
es el que el docente escribió último en llegar. El valor que se pisó **no se
pierde**: está en la auditoría con su aparato y su hora.

Lo que **no** se hace nunca: unir listas, comparar copias enteras, elegir "la
copia más llena", usar el reloj del aparato para decidir.

## 3.5 Choques de identidad (crear dos veces lo mismo sin señal)

Las restricciones `unique` de la base (alumno por identidad y por nombre, un
pago activo por alumno y colecta, una nota activa por alumno + asignatura +
periodo + componente, una asistencia por alumno y día) hacen que el segundo
`crear` falle con el error `23505`. Para cada tabla con llave natural, la cola
hace esto:

1. Busca la fila **activa** que ya ocupa esa llave natural.
2. **Cambia el `id` local por el de la fila existente** en esta operación y en
   todas las que siguen en la cola (un pago que apuntaba al alumno creado sin
   señal pasa a apuntar al alumno que ya estaba).
3. Convierte el `crear` en un `editar` de esa fila, con los campos que el
   docente escribió, y lo aplica con la regla de 3.4.

Excepción **pagos**: el `editar` resultante solo se aplica si el monto es el
mismo (es el mismo pago anotado dos veces → no cambia nada, y queda **un solo**
número de recibo: el de la fila que llegó primero; el segundo `crear` nunca
llegó a existir, así que no gastó número). Si el monto es
**distinto**, no se pisa: queda el pago que llegó primero y el otro va a la
lista de rechazos con una frase como «El pago de Ana para Excursión ya estaba
anotado desde otro aparato con L 50.00. No se anotó el de L 60.00». Con dinero,
la base nunca decide sola entre dos montos distintos.

## 3.6 La cola sin conexión

**Dónde vive.** IndexedDB, base `metas-datos-v2`, almacén `cola`, con llave
`seq`. No en `localStorage`: IndexedDB aguanta más, no bloquea la pantalla y
sobrevive igual a cerrar la app.

**Cuándo se envía.** Sola, sin botón:

- al guardar cualquier dato (si hay señal, sale en el momento);
- al volver la señal (`online`), al volver a la app (`visibilitychange`) y al
  abrirla;
- con reintentos de 2, 4, 8, 16, 32 y 60 segundos mientras haya algo pendiente.

**En qué orden.** Estrictamente por `seq`, **de a una**: la siguiente sale
cuando la anterior está confirmada. Así un pago nunca llega antes que el
alumno que lo recibe.

**Qué hace con cada respuesta.**

| respuesta | qué pasa |
|---|---|
| éxito | se saca de la cola; la fila que devolvió la base reemplaza a la de la copia local |
| sin red, 5xx, tiempo agotado | se queda; se reintenta igual (es idempotente) |
| 401 (sesión vencida) | se renueva la sesión; si no se puede, la cola **se pausa** y se le pide la contraseña al docente con una frase normal |
| 23505 (llave natural) | camino de 3.5 |
| otro error permanente (monto negativo, alumno borrado en otro aparato, dato de otra cuenta) | se saca de la cola y pasa a la **lista de rechazos** |

**Lista de rechazos.** Pocas veces tendría que pasar, porque la pantalla valida
antes de encolar (montos, fechas, campos obligatorios). Cuando pasa:

- se guarda en el almacén `rechazos` de IndexedDB y también se manda a
  `metas.rechazos` (solo inserción) para poder dar soporte;
- en la pantalla del dato afectado aparece una tarjeta discreta, en lenguaje
  del aula: «No se guardó: el pago de Ana para Excursión, porque Ana fue
  quitada de la lista en otro aparato». Un solo botón: «Entendido».
- **No** hay botón de reintentar, recuperar ni restaurar.

**Una cola por cuenta.** Cada operación lleva su `owner`. Si en el aparato
entra otra cuenta, las operaciones de la anterior **no se envían** con la
sesión nueva: esperan a que su dueño vuelva a entrar. Al cerrar sesión con
operaciones pendientes, se le dice: «Hay 3 datos que todavía no llegan a tu
cuenta. Si cierras ahora, se enviarán la próxima vez que entres en este
aparato».

## 3.7 Lectura: lo que muestra la pantalla

**Al abrir con señal.**

1. Se pinta al instante con la copia local (para que no haya pantalla en
   blanco).
2. Se piden a Supabase las filas **activas** del aula (`deleted_at is null`).
3. La copia local de esa aula se **reemplaza** entera por lo recibido.
4. Encima se dibujan las operaciones que siguen en la cola (lo que el docente
   escribió y todavía no llega), para que no "desaparezca" lo que acaba de
   escribir.

**Mientras está abierta.** Se escucha Realtime (`postgres_changes`) en un canal
por aula, filtrado por `aula_id`. Cada evento trae la fila completa:

- si su `version` es mayor que la que hay en la copia → se reemplaza;
- si trae `deleted_at` → se quita de la vista;
- si es menor o igual → se ignora (ya se tenía).

**Al reconectar** (Realtime no garantiza entregar lo que pasó mientras estaba
caído), se pide lo cambiado desde la última hora de servidor vista, **incluidas
las borradas**: `updated_at > cursor − 2 minutos`. El margen cubre
transacciones que confirmaron un poco después de su `now()`; lo repetido se
descarta por `version`.

**Sin señal.** Se trabaja contra la copia local + la cola. Las boletas, los
cuadros y los totales se calculan con lo mismo que se ve.

## 3.8 Lo que ve el docente

Nada técnico. Como en Google Drive, una sola línea pequeña cerca del título:

| estado | texto |
|---|---|
| todo enviado | «Guardado» |
| enviando | «Guardando…» |
| sin señal con pendientes | «Sin señal. Lo que escribas se guarda en cuanto vuelva» |

Desaparecen: «Sincronizar ahora», «Recuperar los datos de mi aula», «Imponer la
copia de este equipo», «Buscar pagos o gastos perdidos», «Revisar cruces»,
«Copiar notas de mis respaldos», «Ver cambios guardados», «Restaurar versión»,
«Deshacer o restaurar cambios», el aviso «Pagos recuperados» y el chip «N por
subir». La lista exacta está en `05-ELIMINACION-Y-ANDROID.md`.

## 3.9 Módulos nuevos del lado del aparato (para la fase de implementación)

| archivo | responsabilidad |
|---|---|
| `js/vendor/supabase.min.js` | `supabase-js` alojado en el sitio (sin CDN, para que funcione sin señal y desde el service worker) |
| `js/datos/nube.js` | cliente, sesión, cabecera `x-metas-aparato`, entrada por `metas-entrar` |
| `js/datos/almacen.js` | IndexedDB: copia de lectura por tabla, `cola`, `rechazos`, cursores |
| `js/datos/cola.js` | envío en orden, reintentos, conflictos (3.4), choques de identidad (3.5) |
| `js/datos/tiempo-real.js` | canal por aula, reconexión, cursor |
| `js/datos/datos.js` | la única API que usan las herramientas: `crear(tabla, campos)`, `editar(tabla, id, cambios)`, `borrar(tabla, id)`, `lista(tabla, filtro)`, `escuchar(tabla, fn)` |
| `js/datos/calculos.js` | totales, boletas, cuadros y promedios **calculados** desde las filas (las mismas fórmulas que las vistas SQL, para el modo sin señal) |

Las herramientas (`registros-admin.js`, `sace-lista.js`, `cuadros-sace.js`…)
dejan de leer y escribir `localStorage` para datos del docente: solo hablan con
`MetasDatos`.
