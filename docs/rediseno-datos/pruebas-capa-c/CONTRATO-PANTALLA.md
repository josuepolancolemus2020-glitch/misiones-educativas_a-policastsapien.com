# Capa C · contrato de la pantalla (corte 1)

Escrito **antes del código**. `capa-c.mjs` solo toca elementos con
`data-metas="…"`; así la prueba no se rompe por un cambio de diseño y la
pantalla no depende de la prueba para nada más.

| `data-metas` | dónde | qué es |
|---|---|---|
| `entrar-correo`, `entrar-clave`, `entrar-boton` | `index.html` | entrada del docente (`metas-entrar`) |
| `aviso-primera-vez` | `index.html` | «Para entrar la primera vez se necesita señal» (09, 9.4) |
| `ir-mi-aula`, `mi-aula` | `index.html` | botón y vista de Mi aula |
| `ir-<pantalla>`, `pantalla-<pantalla>` | Mi aula | `lista`, `notas`, `asistencia`, `colectas`, `controles`, `avisos`, `conducta`, `gastos`, `carga-rapida` |
| `senal` | barra de arriba | el punto gris; `aria-label="Sin señal"`; sin texto; oculto con señal |
| `pregunta`, `pregunta-texto`, `pregunta-boton` | tarjeta | preguntas de dos botones (09, 9.1) |
| `no-anotado` | tarjeta | «no quedó anotado», con la razón del aula |
| `colecta` (`data-estado="abierta|cerrada"`), `pago-alumno`, `monto`, `anotar` | colectas | |
| `alumno` | lista | una fila por alumno |
| `carga-pegar`, `carga-vista-previa`, `carga-fila`, `carga-guardar` | carga rápida | `04` |
| `familia-clave`, `familia-entrar`, `familia-aviso` | `padres.html` | entrada de la familia y su aviso |

Textos fijos que la capa C compara palabra por palabra:

- «Para entrar la primera vez se necesita señal»
- «Esta colecta está cerrada. ¿Reabrirla?», botones «Reabrir» y «Dejarla cerrada»
- «Esta clave ya no sirve. Escriba la clave de la tira nueva que le dio su docente.»

En pruebas, y solo si la página corre en `localhost` o `127.0.0.1`, la app
toma la dirección de Supabase de `window.__METAS_NUBE_DE_PRUEBA__` (nunca de
`localStorage`).
