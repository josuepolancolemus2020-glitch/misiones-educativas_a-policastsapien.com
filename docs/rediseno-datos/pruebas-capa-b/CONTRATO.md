# Capa B · contrato de `MetasDatos` (corte 1)

Escrito **antes del código**. Las pruebas de `escenarios.mjs` usan solo lo
que está aquí; la implementación del corte 1 (`js/datos/*.js`, `03`, 3.10)
tiene que cumplirlo. Si algo de aquí resulta mal pensado al implementar, se
cambia primero este archivo y la prueba, y después el código.

## Carga

Scripts clásicos (sin módulos ni compilación, como el resto del sitio), en
este orden: `js/vendor/supabase.min.js`, `js/datos/ids.js`, `montos.js`,
`nube.js`, `almacen.js`, `cola.js`, `tiempo-real.js`, `senal.js`,
`calculos.js`, `datos.js`. Dejan un solo global: `window.MetasDatos`.

La dirección de Supabase va escrita en `nube.js`. Solo en pruebas, y solo si
`location.hostname` es `127.0.0.1` o `localhost`, se toma de
`window.__METAS_NUBE_DE_PRUEBA__ = { url, llavePublica }`. Nunca de
`localStorage` (02, 2.6).

## API

| llamada | qué hace |
|---|---|
| `await MetasDatos.iniciar()` | abre IndexedDB, retoma la sesión guardada y la cola |
| `await d.entrar(correo, clave)` | `metas-entrar`; guarda solo la sesión. `{ ok }` o `{ ok:false, motivo }` |
| `await d.salir()` | si hay señal, termina de enviar y cierra; si no, conserva la cola de esa cuenta |
| `d.crear(tabla, fila)` | encola; devuelve `{ id }` al instante (id de `ids.js`) |
| `d.editar(tabla, id, cambios)` | encola con la `version` que el aparato conoce |
| `d.borrar(tabla, id)` | encola |
| `d.pagar({ colecta_id, alumno_id, monto, fecha, nota? })` | `monto` es lo que escribió el docente (texto) |
| `d.corregirPago(id, { monto, fecha })`, `d.anularPago(id, motivo)` | |
| `d.colecta.crear / editar / cerrar / reabrir(id, motivo?)` | |
| `d.exencion.poner / quitar` | |
| `d.lista(tabla, filtro?)` | copia local **más** la cola; el dinero **siempre texto** |
| `d.escuchar(fn)` | `fn({ tabla, id })` cuando algo cambió (por Realtime o por la cola) |
| `d.preguntas()` | `[{ id, tipo, texto, botones: [{ etiqueta, valor }] }]`, siempre **dos** botones |
| `await d.responder(idPregunta, valor)` | |
| `d.pendientes()` | operaciones en la cola (para las pruebas; la pantalla no lo muestra) |
| `d.noAnotado()` | tarjetas «no quedó anotado» con su razón del aula |
| `await d.esperarCola()` | resuelve cuando la cola quedó vacía o esperando una pregunta (solo pruebas) |
| `MetasDatos.montos.leer(texto)` | `{ ok, valor:'150.00' }` o `{ pregunta }` («1,500» y «1.500» se preguntan) |
| `MetasDatos.montos.sumar([...textos])` | suma en centavos enteros, devuelve texto |
| `MetasDatos.ids.nuevo()` | uuid v4 |

Tipos de pregunta que las pruebas esperan: `otro_pago_sin_ver`,
`pago_cambiado_en_otro_aparato`, `colecta_cerrada`, `misma_persona`,
`monto_ambiguo`. Valores de los botones: `son_dos` / `es_el_mismo`,
`dejar_actual` / `dejar_este`, `reabrir` / `dejarla_cerrada`,
`es_ella` / `son_dos`.

## Reglas que la capa B vigila

- Nunca `Math.random` (el arnés lo convierte en error dentro del aparato).
- El dinero que sale de `lista` es texto; ningún número de JSON se usa para
  dinero (el arnés revisa cada fila).
- Ninguna decisión de dinero sin el docente: cada desacuerdo es una pregunta.
- Al final de cada escenario, los cuatro contadores de `06`, 6.1 en cero y
  cada aparato igual a la base.
