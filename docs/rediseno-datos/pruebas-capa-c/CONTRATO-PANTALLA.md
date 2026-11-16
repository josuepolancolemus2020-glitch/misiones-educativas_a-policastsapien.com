# Capa C · contrato de la pantalla (corte 1)

Escrito **antes del código** (rev. 6) y ajustado en la **revisión 10** a la
forma de trabajar de la Mi aula de siempre (decidido por Josué: grupos y
secciones como pastillas y cuadrícula de un toque). `capa-c.mjs` solo toca
elementos con `data-metas="…"`; así la prueba no se rompe por un cambio de
diseño y la pantalla no depende de la prueba para nada más.

| `data-metas` | dónde | qué es |
|---|---|---|
| `ir-zona-docente` | `index.html`, portada | botón «Zona Docente» de la portada; la entrada vive allí, no en la portada del alumno (rev. 9, decidido por Josué) |
| `entrar-correo`, `entrar-clave`, `entrar-boton` | `index.html`, Zona Docente | entrada del docente (`metas-entrar`) |
| `aviso-primera-vez` | `index.html` | «Para entrar la primera vez se necesita señal» (09, 9.4) |
| `ir-mi-aula`, `mi-aula` | `index.html` | botón y vista de Mi aula |
| `grupo` (`title` = «6º-1 · escuela»), `otro-grupo`, `form-grupo` | Mi aula, arriba | los grupos como pastillas y «+ Otro grupo» |
| `ir-<sección>`, `pantalla-<sección>` | Mi aula | las que viven en filas: `alumnos`, `economia`, `asistencia`, `controles`, `notas`, `comunicados`. `ir-equipos`, `ir-acumulativos`, `ir-estadisticas` e `ir-lectura` abren la pantalla de antes hasta su corte (08, 8.2) |
| `alumno`; `ir-carga-rapida` → `pantalla-carga-rapida` | Alumnos | una fila por alumno; «Pegar una lista» |
| `carga-pegar`, `carga-vista-previa`, `carga-fila`, `carga-guardar` | carga rápida | `04`. Anotada la lista, `carga-guardar` queda apagado |
| `ir-gastos-bolsillo`, `ir-inventario` | Economía | las dos puertas; abren la pantalla de antes |
| `nueva-colecta`, `colecta` (`data-estado="abierta|cerrada"`) | Economía | «Nueva colecta o acuerdo» y «Mis colectas» |
| `pantalla-colecta`, `faltan`, `faltan-n` | una colecta | la colecta abierta y «Faltan por dar: N · ver quiénes» |
| `pago-alumno` (`data-alumno`, `data-estado="debe|dio|abono|exento|aclarar"`) | una colecta | casilla de UN toque: el aporte completo |
| `otro-monto` (`aria-pressed`) | una colecta | el próximo toque abre la cajita en vez de anotar el aporte completo |
| `hoja-pago`, `monto`, `anotar`, `quitar-pago` | tarjeta de abajo | la cajita de un pago (monto distinto, o lo que ya dio); quitar pregunta con dos botones |
| `gastos`, `nuevo-gasto` | una colecta | gastos de esa colecta |
| `asistencia-alumno` (`data-alumno`, `data-estado="presente|ausente|excusa|tarde"`) | Asistencia | casilla de UN toque: presente → falta → excusa → presente |
| `asis-cuenta`, `todos-presentes`, `excusas` | Asistencia | la cuenta del día, «Todos presentes este día» y las excusas de las familias |
| `nuevo-control`, `control` | Controles | crear un control y la lista de controles |
| `control-alumno` (`data-alumno`, `aria-pressed`), `control-cuenta`, `marcar-todos`, `quitar-marcas` | un control | toque pone ✓, otro la quita; «Anotados N/M · Faltan N» |
| `parcial`, `sace-aprov`, `sace-pers`, `sace-inasis`, `sace-recup` | Notas SACE | parcial y sección como interruptores grandes (`aria-pressed`) |
| `ir-avisos` → `pantalla-avisos`, `ir-conducta` → `pantalla-conducta` | Comunicados | avisos a las familias y conducta |
| `senal` | barra de arriba | el punto gris; `aria-label="Sin señal"`; sin texto; oculto con señal |
| `pregunta`, `pregunta-texto`, `pregunta-boton` | tarjeta | preguntas de dos botones (09, 9.1), del motor o de la pantalla (reabrir, quitar un pago, todos presentes, quitar las marcas) |
| `no-anotado` | tarjeta | «no quedó anotado», con la razón del aula |
| `familia-clave`, `familia-entrar`, `familia-aviso` | `padres.html` | entrada de la familia y su aviso |

Textos fijos que la capa C compara palabra por palabra:

- «Para entrar la primera vez se necesita señal»
- «Esta colecta está cerrada. ¿Reabrirla?», botones «Reabrir» y «Dejarla cerrada»
- «Esta clave ya no sirve. Escriba la clave de la tira nueva que le dio su docente.»

Todo lo que se toca dentro de `#mi-aula` y de la tarjeta mide al menos 44 px
(C1 lo mide en cada sección y en los tres tamaños).

En pruebas, y solo si la página corre en `localhost` o `127.0.0.1`, la app
toma la dirección de Supabase de `window.__METAS_NUBE_DE_PRUEBA__` (nunca de
`localStorage`).
