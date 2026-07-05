# 📊 Fase 3 — Sincronización automática a Google Sheets

Con esto, los resultados de los alumnos llegan **solos** a una hoja de cálculo
central cada vez que su dispositivo tiene internet. La app sigue funcionando
100% offline: los eventos se guardan localmente y se envían cuando se puede.

Costo: **cero**. Solo necesitas una cuenta de Google.

---

## Paso 1 — Crear la hoja

1. Entra a [sheets.google.com](https://sheets.google.com) y crea una hoja nueva.
2. Ponle nombre, por ejemplo: `M.E.T.A.S — Registro Central`.

## Paso 2 — Pegar el código del servidor

1. En la hoja: menú **Extensiones → Apps Script**.
2. Borra lo que aparezca en `Código.gs` y pega **todo** este código:

```javascript
// M.E.T.A.S — Receptor de eventos de aprendizaje → Google Sheets
const HOJA = 'Registros';
const COLUMNAS = ['recibido', 'fecha_utc', 'mision', 'alumno', 'grado', 'docente',
  'tipo', 'seccion', 'forma', 'nota', 'base', 'xp', 'min', 'sesion', 'dispositivo', 'id_evento'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const datos = JSON.parse(e.postData.contents);
    const eventos = (datos && datos.eventos) || [];
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let h = ss.getSheetByName(HOJA);
    if (!h) h = ss.insertSheet(HOJA);
    if (h.getLastRow() === 0) h.appendRow(COLUMNAS);
    const ahora = new Date();
    const filas = eventos.map(function (ev) {
      return [ahora, ev.t || '', ev.mision || '', ev.alumno || '', ev.grado || '',
        ev.docente || '', ev.tipo || '', ev.seccion || '', ev.forma || '',
        (ev.nota === 0 || ev.nota) ? ev.nota : '', (ev.base === 0 || ev.base) ? ev.base : '',
        (ev.xp === 0 || ev.xp) ? ev.xp : '', (ev.min === 0 || ev.min) ? ev.min : '',
        ev.ses || '', ev.disp || '', ev.id || ''];
    });
    if (filas.length) {
      h.getRange(h.getLastRow() + 1, 1, filas.length, COLUMNAS.length).setValues(filas);
    }
    return ContentService.createTextOutput(JSON.stringify({ ok: true, recibidos: filas.length }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Para probar en el navegador que el servicio está vivo
function doGet() {
  return ContentService.createTextOutput(JSON.stringify({ ok: true, servicio: 'M.E.T.A.S registro' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Guarda (💾 o Ctrl+S).

## Paso 3 — Publicar como aplicación web

1. Botón azul **Implementar → Nueva implementación**.
2. Tipo: **Aplicación web**.
3. Configuración:
   - *Ejecutar como*: **Yo** (tu cuenta).
   - *Quién tiene acceso*: **Cualquier usuario** ← importante, si no los
     dispositivos de los alumnos no podrán enviar.
4. **Implementar** → autoriza los permisos → copia la **URL de la aplicación
   web** (termina en `/exec`).
5. Prueba: pega esa URL en el navegador; debe responder
   `{"ok":true,"servicio":"M.E.T.A.S registro"}`.

## Paso 4 — Conectar la app

1. Abre `js/metas-registro.js` y busca la línea:
   ```javascript
   var URL_SINCRONIZACION = '';
   ```
2. Pega la URL entre las comillas:
   ```javascript
   var URL_SINCRONIZACION = 'https://script.google.com/macros/s/XXXXX/exec';
   ```
3. Propaga y publica como siempre (`npm run build:www`, commit, push, y el
   `.bat` para los teléfonos).

## ¿Cómo funciona después?

- Cada dispositivo envía sus eventos pendientes: al abrir una misión (a los
  4 segundos), cuando recupera internet, unos segundos después de cada prueba
  calificada, y al cerrar la misión (ahí viaja la duración de la sesión).
- En el panel **Registro Docente** aparece la tarjeta "Por sincronizar" y el
  botón **☁️ Sincronizar ahora** para forzar el envío manualmente.
- Cada fila de la hoja trae `id_evento` único. Si alguna vez ves una fila
  repetida (pasa raras veces, cuando el alumno cierra justo al enviar),
  filtra duplicados con: `Datos → Limpieza de datos → Quitar duplicados`
  usando la columna `id_evento`.
- Para probar sin tocar el código: en el navegador, consola del panel
  Registro Docente, ejecuta
  `localStorage.setItem('METAS_SYNC_URL','https://...tu url.../exec')`
  y recarga. Para quitarla: `localStorage.removeItem('METAS_SYNC_URL')`.

## Consejos para el estudio (tesis)

- Crea una hoja por año escolar; Google Sheets aguanta ~10 millones de celdas
  (≈600,000 eventos con estas 16 columnas) — de sobra para el estudio.
- La columna `docente` te permite filtrar por maestro participante; `grado`
  por sección experimental/control.
- Comparte la hoja con Evelyn en modo lector para el análisis.
