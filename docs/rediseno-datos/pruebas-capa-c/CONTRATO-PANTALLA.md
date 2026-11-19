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
| `alumno-clave` (`data-estado="sin"` si aún no tiene ficha) | Alumnos, en cada fila | la clave de familia, solo para leer (`15-K7QM`, `K7QMX-4PA2B`); «sin clave de familia» si no tiene ficha |
| `claves-preparar` → `claves`, `claves-vista-previa`, `claves-guardar`, `claves-listo`, `claves-aviso` | Alumnos | «Preparar claves de familia»: una línea, «Se crearán N claves nuevas · M ya tenían la suya» (o «Todos tus alumnos ya tienen su clave», con `claves-guardar` apagado), y Guardar / Cancelar; nada se anota hasta `claves-guardar`, que se apaga al tocarlo. Sin señal, `claves-aviso` y no arma nada |
| `tiras-claves`; `tira-alumno` (en la fila abierta de un alumno) | Alumnos | «🖨️ Tiras de claves (QR)» de todo el aula y «🖨️ Su tira»: las tiras de main (`adTirasTodas`, `adTiraUno`) con la clave de `metas.familias`; sin ficha no hay tira. Imprimen sin señal |
| `clave-copiar`, `clave-whatsapp` (en la fila abierta de un alumno CON clave) | Alumnos | «📋 Copiar» copia el mensaje de la clave y avisa «Copiado»; el ícono de WhatsApp (`aria-label` «Enviar por WhatsApp») abre `https://wa.me/?text=…`. Sin clave no aparecen |
| `lista-sace-abrir` → `lista-sace`, `lista-sace-elegir`, `lista-sace-vista-previa`, `lista-sace-par` (`data-estado="seguro|confirmar"`), `lista-sace-confirmar` (`aria-pressed`), `lista-sace-sin-ficha`, `lista-sace-fuera`, `lista-sace-guardar`, `lista-sace-listo`; `lista-sace-cuenta` | Alumnos | «📥 Importar lista del SACE»: lee el CSV en el aparato y empareja con `SaceLista.emparejarFilas` (identidad de Honduras y, si no, nombre; nunca el número de lista). Vista previa con ✓ (misma identidad o mismo nombre), ⚠ (nombre parecido: «Es la misma persona», sin marcar) y ✗ (del SACE sin alumno en Mi aula, se puede elegir su ficha). Nada se anota hasta `lista-sace-guardar`, que se apaga al tocarlo y manda un `editar` por alumno con solo lo que cambia (`en_sace`, `sace_num`, `edad_sace`, `fecha_nacimiento`, `estado`/`estado_fecha` si el SACE dice Traslado). Quien no está en el archivo queda `en_sace = false`; nadie se borra y ninguna nota cambia. `lista-sace-cuenta`: «En la lista oficial del SACE: N de M» (C21) |
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
| `familia-turnstile` | `padres.html` | el cuadro de Turnstile, sobre la barra de escribir; solo a la vista mientras se revisa una clave |

Textos fijos que la capa C compara palabra por palabra:

- «Para entrar la primera vez se necesita señal»
- «Esta colecta está cerrada. ¿Reabrirla?», botones «Reabrir» y «Dejarla cerrada»
- «Esta clave ya no sirve. Escriba la clave de la tira nueva que le dio su docente.»

Todo lo que se toca dentro de `#mi-aula` y de la tarjeta mide al menos 44 px
(C1 lo mide en cada sección y en los tres tamaños).

En pruebas, y solo si la página corre en `localhost` o `127.0.0.1`, la app
toma la dirección de Supabase de `window.__METAS_NUBE_DE_PRUEBA__` (nunca de
`localStorage`).
