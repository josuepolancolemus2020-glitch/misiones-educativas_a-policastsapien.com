# 5. Lo que se elimina, y una sola app para web y Android

Fase 1: diseño. **Nada de esto se borra todavía.** Es la lista exacta para la
fase de implementación. Líneas medidas en `main` v548 (noviembre de 2026).

Criterio: se elimina todo lo que **sube o baja listas enteras, fusiona,
repone, restaura, busca datos "perdidos" o avisa de datos recuperados**. Lo
que solo pinta o calcula se queda y pasa a leer filas.

## 5.1 Archivos que se eliminan enteros

| archivo | qué hacía |
|---|---|
| `js/metas-docente-sync.js` (906 líneas) | espejo del blob en `docente_estado`: subir, bajar, base de tres vías, respaldos locales, «Empezar de nuevo», «Recuperar», «Imponer la copia de este equipo», papelera, historial |
| `js/metas-fusion-aula.js` | la fusión dato por dato. `fusionarValor` (:122, conserva **los dos** cuando dos aparatos añaden algo con la misma fecha: duplica gastos y pagos) y `fusionarCampo` (:188, «editar gana a borrar»: revive) |
| `js/tools/buscar-perdidos.js` | busca pagos, gastos y notas en copias viejas y los **vuelve a insertar** (`devolver` :162) |
| `js/tools/revisa-cruces.js` | detecta datos que se "cruzaron" entre alumnos al fusionar y reescribe celdas |
| `_privado/CONSULTA-PAGOS-PERDIDOS.sql` | consulta de soporte para reponer pagos |

## 5.2 Funciones que se eliminan de archivos que se quedan

### `js/tools/registros-admin.js`

| función (línea) | qué hacía |
|---|---|
| `AD_UNDO_KEY` :157, `adLiberarEspacio` :164, `adUndoLista` :175, `adUndoGuardar` :179 (y sus llamadas), `adUndoNotasPerdidas` :205, `adUndoRestaurar` :232, `adUndoTarjetaHtml` :271, `adUndoEnganchar` :286 | fotos enteras del aula para «Deshacer o restaurar» (`METAS_ADMIN_UNDO_V1`). Con filas y auditoría, deshacer un cambio es otra edición de esa fila |
| `adCrucesTarjetaHtml` :262 | tarjeta de «Revisar cruces» |
| `AD_BORRADOS_MAX` :310, `adFirmaFicha` :311, `adPurgarRevividas` :315, `adMarcarBorrado` :343 | lápidas para quitar lo que la fusión revivía |
| el bloque de fusión dentro de `adSave` :548-559, `_adLeido` :534 | fusionar al guardar |
| `adPagoQuitado` :3717 y la escritura de `c.quitados` / `cc.gastosQuitados` (:5689-5700, :5779, :6835) | marcas de "quitado a propósito" para que la reposición no lo devolviera |
| `adPagosDesdeRegistroNube` :3731 | lee `registro_admin` + `registro_admin_historial` (RPC `metas_recuperar_admin_docente`) |
| `adUnirHallados` :3790, `adRecuperarSoloProgramar` :3795 (corre en **cada** `renderAdmin`, :1144), `adRecuperarSolo` :3800 | **reposición automática de pagos** y el aviso «Pagos recuperados» (:3831-3836) |
| `adCopiasLocales` :3852, `adBuscarPerdidosModal` :3874 | «🔎 Buscar pagos o gastos perdidos» |
| `adCruceValor` :6751, `adRevisarCrucesModal` :6760, oyente `.ad-cruces-btn` :6859 | «Revisar cruces del último mes» |
| `adRecolectarVersionesLocales` :8316, `adRecolectarVersionesHistorial` :8396, `adReconstruirParcialesI_IIISincrono` :8506, `adReconstruirDesdeNubeYRespaldos` :8684, `adModalCambios` :8723, `adRecuperarNotasNube` :8780, `adRevisarNotasPuestasSolas` :8830, `adAbrirHistorialVersionesModal` :8941 (acciones «fusionar» y «restaurar» :9090-9160), `AD_V479_DESDE` :8491, `adVersionTieneAutocompletado` :8495 | reconstrucción de notas desde respaldos e historial, «Copiar notas de mis respaldos», «Ver cambios guardados», «Restaurar versión» |
| `adAnclarClaves` :365, `adAnclarFuera` :408 | reanclar claves, avisos y conducta al número de lista después de una fusión. Con todo enlazado por id **ya no hace falta** |
| `adDocenteCreds` :11975, `adFilasNube` :11998, `adFirma` :12047, `adFilaAnulada` :12056, `adSyncProgramar` :12072, `adPendientesTotal` :12079, `adSincronizarNube` :12095, oyente `online` :12176, `avFilasNube` :12194, `avFirma` :12340, `avSincronizarNube` :12345, `adActualizarChipNube` :941, `ADMIN_SB_KEY` :11947 | copia para el chatbot de padres (`registro_admin`, `mensajes_docente`). Los padres pasan a leer las filas (`07-VISTA-DE-PADRES.md`) |
| todo `localStorage.setItem(ADMIN_KEY, …)` y `adState`/`adLoad`/`adSave` sobre el blob | se reemplazan por `MetasDatos` (sección 3.9) |

### `js/app.js`

| función (línea) | qué hacía |
|---|---|
| llamadas a `dsClaim` en `docenteRecuperar` :1569 y `docenteSuscribir` :1980 | descargar el blob al entrar |
| banner «↩️ Recuperar los datos de mi aula» (`dsTieneRespaldo` / `dsRecuperar`, :1685-1703) | |
| `#doc-sync-status` :1710 | desaparece; solo queda el punto gris de «sin señal» (`09-INTERFAZ.md`) |
| `dsOnProfile()` :1741, `dsLogout()` :2075 | |
| tarjeta «🚑 Rescate de datos» en Ajustes :2410-2426 («🔄 Sincronizar ahora», «🚑 Imponer la copia de ESTE equipo en todos», «🗑️ Empezar de nuevo») | |
| `METAS_DOCENTE_V1.clave` (:1492, :1566, :1977, :2111, :2129) | contraseña en texto plano; la reemplaza la sesión de Supabase |

### Otros

| dónde | qué |
|---|---|
| `js/metas-numeracion.js`: `alinear` :238, `envolver` :271, autoenvoltura :389 | la parte que envolvía a la fusión. El resto (`remapGrupo`, `anclar*`) también sobra cuando nada se enlaza por número de lista; se elimina en el mismo cambio que mueve las herramientas a filas |
| `js/tools/plan-accion.js`: `paRecuperarHistorialNube` :2520, botón «📥 Recuperar…» :982, `paSincronizarNube` :3217 | recuperar el plan desde respaldos; subir copia para padres |
| `padres.html`: `METAS_PADRE_CACHE_V1` y su caché (:223, :299-318) | ver sección 7 |
| `panel-docente.html:365-376` «🔑 Restaurar claves» | **sobrescribe todo `METAS_CODIGOS_V1`** con los grupos viejos y borra los `G:<id>`. Se elimina |
| `METAS_SB_URL` / `METAS_SB_KEY` en todos los archivos | permiten apuntar la app a otro servidor (y mandarle la sesión) |

### Elementos de pantalla que desaparecen

La lista **completa** por pantalla, con archivo:línea, está en
`09-INTERFAZ.md` (regla de interfaz de la revisión 3). Resumen:

«🔄 Sincronizar ahora» (Ajustes y Registros), «☁️ Sincronizar ahora»
`#ad-sb-sync`, «↩️ Recuperar los datos de mi aula», «🚑 Imponer la copia de
ESTE equipo en todos», «🔎 Buscar pagos o gastos perdidos» `#ad-col-perdidos`,
«☁️ Buscar también en el historial de la nube» `#ad-bp-nube`, «↩️ Devolver lo
marcado», «🕵️ Revisar cruces del último mes», «📥 Copiar notas de mis
respaldos» `#ad-lista-recuperar` y `#ad-sace-recuperar`, «🕓 Verificar
historial de versiones» `#ad-lista-versiones`, «🕓 Ver cambios guardados»
`#ad-sace-versiones`, «🛟 Recuperar o revisar notas» `#ad-sace-chip-rescate` y su
ventana `#ad-sace-v-rescate`, «📥 Recuperar I–III», «↩️ Restaurar versión
completa», «🕘 Deshacer o restaurar cambios», el chip «⏳ N por subir / ☁️ al
día», y los avisos «Pagos recuperados», «Datos recuperados», «Trayendo el aula
de TU cuenta», «Todo al día».

«🗑️ Empezar de nuevo» **no** se reemplaza por nada. Un aula, un alumno o una
colecta **con pagos o notas activos no se pueden borrar** (la base lo
rechaza): el alumno pasa a retirado, trasladado o desertor, y la colecta se
cierra. Solo lo que está vacío se borra (lógicamente), con confirmación.

## 5.3 Sondas que se eliminan o reemplazan

`corre-sondas.js` descubre solas todas las sondas de `_dev/`, así que una
sonda que siga pidiendo un archivo borrado pondría la tanda en rojo. Van en el
mismo cambio que borra el código.

| sonda | qué hacer |
|---|---|
| `_dev/prueba-fusion-aula.js`, `_dev/verifica-fusion-sync.js`, `_dev/verifica-copia-vieja.js`, `_dev/verifica-buscar-perdidos.js`, `_dev/verifica-revisa-cruces.js` | eliminar |
| `_dev/verifica-borrar-recarga.js`, `_dev/verifica-sace-recarga.js` | reescribir contra la cola nueva (sus casos pasan a la sección 6) |
| `_dev/sace-prueba/simulador.js` y quienes lo usan (`verifica-claves-identidad.js`, `verifica-notas-color.js`) | reescribir el simulador sobre `MetasDatos` con la nube de prueba de la sección 6 |
| `_dev/verifica-numeracion.js` | reescribir: ya no hay remapeo; comprobar que reordenar **solo** cambia `num_lista` |
| `_dev/verifica-animacion-mision.js:6958, :6976` | quitar la aserción sobre el texto de `metas-docente-sync.js` |
| `_dev/verifica-roles-director.js:201-202` | quitar los simulacros de `metas_docente_estado_*` |
| `_dev/verifica-notas-sin-pedir.js:97, :115, :227-228` | quitar de su lista las funciones de recuperación |

## 5.4 SQL viejo: se congela, no se borra (por pasos, con los cortes)

Archivo propuesto: `SUPABASE-V2-CONGELAR.sql` (sin ejecutar en el proyecto
real; probado en la capa A).

| paso | cuándo | qué hace |
|---|---|---|
| 1 | corte 1 | copia inmutable de las claves de familia (`metas.claves_archivo`); **candado** en `docente_estado` para docentes vinculados (rechaza `METAS_CODIGOS_V1`, `METAS_AVISOS_V1` y `METAS_ADMIN_V1` con secciones del corte 1); `metas_docente_estado_guardar` responde `-2` y lo anota en vez de escribir; blob por sesión para la app nueva (`metas.blob_leer`/`blob_guardar`); `mensajes_docente` no acepta nada de docentes vinculados; `registro_admin` congelado **salvo el borrado del cierre de año**; se cierran `metas_guardar_admin` (todas sus firmas), `metas_recuperar_admin_docente`, `metas_docente_historial`, `metas_docente_historial_listar`, `metas_docente_papelera`, `metas_docente_reset`, `metas_docente_reset_deshacer`, `metas_consultar_progreso(p_clave)` y `metas_restaurar_codigos` |
| 2 | corte de plan de acción, acumulativos, lecturas y equipos | `plan_accion` de solo lectura; se cierran `metas_guardar_plan` y `metas_recuperar_historial`; `METAS_PLANACCION_V1` entra al candado |
| 3 | último corte | `docente_estado`, sus historiales y su papelera de solo lectura; se cierran las funciones del blob y el blob por sesión |
| 4 | todos migrados, o fin del primer parcial de 2027, con dos semanas de aviso | se cierran las lecturas de padres sobre el archivo, `metas_cerrar_familias`, `metas_guardar_avisos` y, si ya tienen reemplazo, `metas_buzon_docente` y `metas_avisos_vistos`; `mensajes_docente` de solo lectura |

**No se cierra en el paso 1 `metas_cerrar_familias`**: «Cerrar el año
escolar» (`js/tools/registros-admin.js:11235-11338`) la usa para borrar del
chatbot los datos de las claves viejas, y estamos en pleno cierre de año.
Sigue abierta hasta que el cierre de año esté reescrito y llegue el paso 4.

**Nunca se cierran:** `metas_guardar` y **`metas_guardar_progreso`** (lado del
alumno, `js/metas-supabase.js:129` y `:267`), las cuentas, las convocatorias
públicas, el Campeonísimo en vivo y lo que escriben los padres.

**Archivos `.sql` de `_privado/` que, si se vuelven a correr, resucitan lo
cerrado** (por ejemplo `SUPABASE-DOCENTE-ESTADO.sql` volvería a crear
`metas_docente_estado_guardar` sin candado): se les antepone una línea que
aborta, en el mismo paso en que se congela lo suyo. No se borran.

## 5.5 Android: exactamente el mismo código que la web

### Cómo es hoy

- `capacitor.config.json`: `webDir: "www"`, **sin** `server.url`: el APK lleva
  dentro una copia de `www/`.
- `www/` está en git y va **muy atrás**: `CACHE_NAME = 'meta-app-v480'` contra
  `v548` en la raíz; le faltan 37 de 94 misiones y muchos `js/`.
- `www/` se arma con `robocopy` (solo Windows, `/E` no borra lo que ya no
  existe) y `_privado/sincronizar-e-instalar.bat` está roto desde que se movió
  a `_privado/` (hace `cd` a esa carpeta).
- **Dentro de `www/` (y por tanto dentro de los APK ya instalados) hay 20
  archivos `SUPABASE-*.sql`**, el `.bat`, el `.cmd`, `CNAME` y `.idea/`,
  copiados antes de la limpieza de noviembre.

### Decidido: el APK carga el sitio publicado (`server.url`)

```json
{
  "appId": "com.policastsapien.metas",
  "appName": "M.E.T.A.S",
  "webDir": "www",
  "server": {
    "url": "https://metas.policastsapien.com",
    "androidScheme": "https",
    "errorPath": "sin-conexion.html"
  }
}
```

- La app Android abre **el mismo sitio** que el navegador: mismo HTML, mismo
  JS, mismo service worker, misma versión el mismo minuto en que GitHub Pages
  publica. No hay copia que se quede atrás, ni hay que sacar un APK por cada
  cambio.
- Sin señal, funciona igual que la web instalada: el service worker sirve el
  armazón y `MetasDatos` sirve la copia de lectura y la cola (IndexedDB, que en
  este diseño es del origen `https://metas.policastsapien.com`, el mismo para
  web y Android).
- `www/` queda con **un solo archivo**: `sin-conexion.html`, la página que se
  ve si la app se abre por primera vez sin señal («Abre M.E.T.A.S una vez con
  señal para empezar»).
- Los plugins de Capacitor (`Filesystem`, `Share`, que usan los diplomas)
  siguen disponibles en páginas remotas cuando el dominio es el de
  `server.url`. Se comprueba en la fase de implementación.
- `www/` sale de git (`.gitignore` + `git rm -r --cached www`). Los SQL que se
  colaron quedan en el historial; no traen secretos (la llave pública ya es
  pública), pero el próximo APK ya no los lleva.
- `build:www` (robocopy) y `_privado/sincronizar-e-instalar.bat` se reemplazan
  por un script de Node que solo escribe `sin-conexion.html` en `www/` y corre
  `npx cap sync`.
- Una sonda nueva falla si `capacitor.config.json` no tiene `server.url` o si
  `www/` tiene algo más que `sin-conexion.html`.

Riesgos de esta opción, para que decidas:

1. **La primera vez necesita señal.** Después, el service worker la deja
   funcionar sin señal como la web.
2. **Los datos viejos de `localStorage` del APK** viven en otro origen
   (`https://localhost`) y la app nueva no los ve. Como la base nueva empieza
   vacía y se carga desde papel, no se pierde nada que la app nueva fuera a
   usar; pero hay que decirlo antes de actualizar: «la app nueva empieza en
   blanco; ten tus papeles a mano».
3. **Política de Google Play** sobre apps que solo envuelven un sitio. Hoy el
   APK se instala directo (versionCode 3, `installDebug`); si se publica en
   Play, hay que revisarlo.

La alternativa (APK con copia generada en CI) queda descartada: un teléfono
que no actualiza el APK se quedaría con código viejo.

## 5.6 Normas de `CLAUDE.md`

**Añadidas en esta revisión** (lo pediste explícitamente): nunca «upsert» en
pagos ni en pagos de convocatoria, y nunca `Math.random()` para generar ids.

**Pendientes de tu aprobación**, para cuando se implemente el primer corte:

- Regla 5, «Datos del maestro se fusionan (`js/metas-fusion-aula.js`)»: pasa
  a «Datos del maestro: una fila por dato en Supabase, por `MetasDatos`. Nunca
  se fusiona, nunca se repone, nunca se guarda un blob».
- Regla 4, «No tocar llaves de `localStorage`»: las llaves de datos del
  docente dejan de existir; las de preferencias siguen.
- Sección «Cómo se publica»: el APK carga el sitio publicado y no lleva copia.
