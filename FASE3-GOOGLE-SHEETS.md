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
// v3: + escuela + crearDashboard() (ejecutar una vez desde el editor)
const HOJA = 'Registros';
const COLUMNAS = ['recibido', 'fecha_utc', 'mision', 'alumno', 'grado', 'docente',
  'tipo', 'seccion', 'forma', 'nota', 'base', 'xp', 'min', 'sesion', 'dispositivo',
  'id_evento', 'escuela']; // escuela va al final para no desordenar filas antiguas

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
    else if (h.getLastColumn() < COLUMNAS.length) {
      // hoja creada con una versión anterior: completar el encabezado
      h.getRange(1, 1, 1, COLUMNAS.length).setValues([COLUMNAS]);
    }
    const ahora = new Date();
    const filas = eventos.map(function (ev) {
      return [ahora, ev.t || '', ev.mision || '', ev.alumno || '', ev.grado || '',
        ev.docente || '', ev.tipo || '', ev.seccion || '', ev.forma || '',
        (ev.nota === 0 || ev.nota) ? ev.nota : '', (ev.base === 0 || ev.base) ? ev.base : '',
        (ev.xp === 0 || ev.xp) ? ev.xp : '', (ev.min === 0 || ev.min) ? ev.min : '',
        ev.ses || '', ev.disp || '', ev.id || '', ev.escuela || ''];
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

// ============================================================
// DASHBOARD — ejecutar UNA VEZ desde el editor:
// selecciona "crearDashboard" arriba y presiona ▶ Ejecutar.
// Crea las pestañas "Dashboard" (gráficos) y "DashDatos" (oculta,
// con las fórmulas que alimentan los gráficos). Todo se actualiza
// solo cuando llegan filas nuevas a Registros.
// Se puede volver a ejecutar cuando se quiera: la reconstruye.
// ============================================================
const AZUL = '#1565c0';
const AZUL_CLARO = '#e3f2fd';

function crearDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss.getSheetByName(HOJA)) throw new Error('No existe la pestaña "' + HOJA + '". Envía al menos un evento primero.');

  // recrear pestañas desde cero
  ['Dashboard', 'DashDatos'].forEach(function (n) {
    const viejo = ss.getSheetByName(n);
    if (viejo) ss.deleteSheet(viejo);
  });
  const datos = ss.insertSheet('DashDatos');
  const dash = ss.insertSheet('Dashboard', 0); // primera pestaña

  // Detectar el separador de argumentos de la configuración regional de la
  // hoja (con separador decimal coma, los argumentos van con ";" y una
  // fórmula escrita con "," da #ERROR!). Se prueba con =SUM(1,2):
  const sonda = datos.getRange('Z1');
  sonda.setFormula('=SUM(1,2)');
  SpreadsheetApp.flush();
  const SEP = (sonda.getValue() === 3) ? ',' : ';';
  sonda.clearContent();
  // Las plantillas usan ¦ donde va el separador de argumentos y § donde va
  // el separador de columnas de una matriz {a§b} (en región con ";" es "\").
  // (Las comas DENTRO de los textos de QUERY no cambian con la región.)
  const SEPM = (SEP === ',') ? ',' : '\\';
  const F = function (p) { return p.replace(/¦/g, SEP).replace(/§/g, SEPM); };

  // ---------- DashDatos: tablas que alimentan los gráficos ----------
  const R = HOJA;
  // A:B promedio de nota por misión
  datos.getRange('A1').setFormula(F(
    '=IFERROR(QUERY(' + R + '!A:Q¦"select C, avg(J) where J is not null and C<>\'\' group by C order by avg(J) desc label C \'Misión\', avg(J) \'Promedio\'"¦1)¦"sin datos")'));
  // D:E actividad por día
  datos.getRange('D1').setFormula(F(
    '=IFERROR(QUERY(' + R + '!A:Q¦"select toDate(A), count(P) where A is not null group by toDate(A) label toDate(A) \'Día\', count(P) \'Eventos\'"¦1)¦"sin datos")'));
  // G:H distribución de notas (histograma por rangos)
  datos.getRange('G1:H1').setValues([['Rango de nota', 'Cantidad']]);
  const rangos = [['0-39', 0, 39], ['40-59', 40, 59], ['60-69', 60, 69], ['70-79', 70, 79], ['80-89', 80, 89], ['90-100', 90, 100]];
  rangos.forEach(function (r, i) {
    datos.getRange(i + 2, 7).setValue(r[0]);
    datos.getRange(i + 2, 8).setFormula(F('=COUNTIFS(' + R + '!J:J¦">=' + r[1] + '"¦' + R + '!J:J¦"<=' + r[2] + '")'));
  });
  // J:K alumnos únicos por escuela (pares únicos escuela+alumno)
  datos.getRange('J1').setFormula(F(
    '=IFERROR(QUERY(UNIQUE(FILTER({' + R + '!Q2:Q§' + R + '!D2:D}¦' + R + '!D2:D<>""¦' + R + '!Q2:Q<>""))¦"select Col1, count(Col2) group by Col1 order by count(Col2) desc label Col1 \'Escuela\', count(Col2) \'Alumnos\'"¦0)¦"sin datos")'));
  // M:N misiones más trabajadas (sesiones)
  datos.getRange('M1').setFormula(F(
    '=IFERROR(QUERY(' + R + '!A:Q¦"select C, count(P) where G=\'sesion\' and C<>\'\' group by C order by count(P) desc label C \'Misión\', count(P) \'Sesiones\'"¦1)¦"sin datos")'));
  // S:U auxiliar minutos por sesión → P:Q minutos por misión
  datos.getRange('S1').setFormula(F(
    '=IFERROR(QUERY(' + R + '!A:Q¦"select C, N, max(M) where N<>\'\' and C<>\'\' group by C, N"¦1)¦"sin datos")'));
  datos.getRange('P1').setFormula(F(
    '=IFERROR(QUERY(S1:U10000¦"select Col1, sum(Col3) group by Col1 order by sum(Col3) desc label Col1 \'Misión\', sum(Col3) \'Minutos\'"¦1)¦"sin datos")'));
  // W:X aprobados vs por mejorar (para la dona)
  datos.getRange('W1:X1').setValues([['Estado', 'Pruebas']]);
  datos.getRange('W2').setValue('Aprobadas (≥70)');
  datos.getRange('X2').setFormula(F('=COUNTIF(' + R + '!J:J¦">=70")'));
  datos.getRange('W3').setValue('Por mejorar (<70)');
  datos.getRange('X3').setFormula(F('=COUNTIF(' + R + '!J:J¦"<70")'));
  // fechas legibles en la actividad por día
  datos.getRange('D2:D400').setNumberFormat('dd mmm');

  // ---------- Dashboard: título y tarjetas KPI ----------
  dash.setHiddenGridlines(true);
  dash.getRange('B1').setValue('📊 M.E.T.A.S — Dashboard de aprendizaje')
    .setFontSize(20).setFontWeight('bold').setFontColor(AZUL);
  dash.getRange('B2').setValue('Se actualiza solo con cada dato que llega a "Registros"')
    .setFontSize(10).setFontColor('#636e72');

  const kpis = [
    ['👥 Alumnos', '=IFERROR(COUNTUNIQUE(FILTER(' + R + '!D2:D¦' + R + '!D2:D<>""))¦0)'],
    ['🏫 Escuelas', '=IFERROR(COUNTUNIQUE(FILTER(' + R + '!Q2:Q¦' + R + '!Q2:Q<>""))¦0)'],
    ['🚀 Misiones', '=IFERROR(COUNTUNIQUE(FILTER(' + R + '!C2:C¦' + R + '!C2:C<>""))¦0)'],
    ['📋 Eval. calificadas', '=COUNTIF(' + R + '!G2:G¦"evaluacion")+COUNTIF(' + R + '!G2:G¦"prueba_operativa")'],
    ['📈 Promedio', '=IFERROR(ROUND(AVERAGE(' + R + '!J2:J)¦1)¦"—")'],
    ['✅ Aprobación ≥70', '=IFERROR(ROUND(COUNTIF(' + R + '!J2:J¦">=70")/COUNT(' + R + '!J2:J)*100¦0)&"%"¦"—")'],
    ['⏱️ Minutos totales', '=IFERROR(ROUND(SUM(QUERY(' + R + '!A:Q¦"select max(M) where N<>\'\' group by N label max(M) \'\'"¦1))¦0)¦0)']
  ];
  kpis.forEach(function (k, i) {
    const col = 2 + i * 2; // B, D, F, H, J, L, N
    dash.getRange(4, col).setValue(k[0]).setFontSize(9).setFontColor(AZUL)
      .setBackground(AZUL_CLARO).setFontWeight('bold').setHorizontalAlignment('center');
    dash.getRange(5, col).setFormula(F(k[1])).setFontSize(22).setFontWeight('bold')
      .setFontColor(AZUL).setBackground(AZUL_CLARO).setHorizontalAlignment('center');
  });

  // ---------- gráficos ----------
  function grafico(tipo, rango, titulo, fila, columna, extra) {
    let b = dash.newChart().setChartType(tipo)
      .addRange(datos.getRange(rango))
      .setPosition(fila, columna, 0, 0)
      .setOption('title', titulo)
      .setOption('width', 520).setOption('height', 320)
      .setOption('colors', [AZUL, '#00b894'])
      .setOption('legend', { position: 'none' });
    if (extra) Object.keys(extra).forEach(function (k) { b = b.setOption(k, extra[k]); });
    dash.insertChart(b.build());
  }
  grafico(Charts.ChartType.BAR,    'A1:B30',  '📈 Promedio de nota por misión', 8, 2);
  grafico(Charts.ChartType.COLUMN, 'D1:E120', '📅 Actividad por día (eventos)', 8, 8);
  grafico(Charts.ChartType.COLUMN, 'G1:H7',   '🔔 Distribución de notas', 26, 2);
  grafico(Charts.ChartType.PIE,    'W1:X3',   '✅ Pruebas aprobadas vs por mejorar', 26, 8,
    { pieHole: 0.55, legend: { position: 'right' }, colors: ['#00b894', '#d63031'] });
  grafico(Charts.ChartType.BAR,    'M1:N30',  '🚀 Misiones más trabajadas (sesiones)', 44, 2);
  grafico(Charts.ChartType.BAR,    'P1:Q30',  '⏱️ Minutos de trabajo por misión', 44, 8);
  grafico(Charts.ChartType.BAR,    'J1:K30',  '🏫 Alumnos por escuela', 62, 2);

  datos.hideSheet();
  ss.setActiveSheet(dash);
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

## Paso 5 — Dashboard con gráficos (una sola vez)

Con el código v3 ya pegado y guardado:

1. En el editor de Apps Script, arriba, donde dice el nombre de la función,
   selecciona **crearDashboard** en el menú desplegable.
2. Presiona **▶ Ejecutar** y autoriza los permisos si los pide.
3. Abre tu hoja de cálculo: aparece la pestaña **Dashboard** como primera
   pestaña, con 7 tarjetas resumen (alumnos, escuelas, misiones, evaluaciones,
   promedio, % de aprobación, minutos) y 6 gráficos: promedio por misión,
   actividad por día, distribución de notas, alumnos por escuela, misiones más
   trabajadas y minutos por misión.
4. **No hay que volver a ejecutarlo**: todo son fórmulas y gráficos vivos que
   se recalculan solos con cada fila nueva. (Si algún día quieres regenerarlo
   desde cero, vuelve a ejecutar `crearDashboard` — borra y reconstruye.)
5. La pestaña oculta **DashDatos** contiene las tablas que alimentan los
   gráficos; no la borres (puedes verla con Ver → Hojas ocultas).

## Actualizar el código del Apps Script (cuando cambie la versión)

Guardar el archivo **no basta**: la URL `/exec` sigue sirviendo la versión
publicada. Después de reemplazar el código: **Implementar → Administrar
implementaciones → ✏️ lápiz → Versión: Nueva versión → Implementar**.
La URL no cambia, así que no hay que tocar la app.

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
