# 7. Vista de padres: las mismas filas, solo lectura

Fase 1: diseño. SQL propuesto en `SUPABASE-V2-FAMILIAS.sql` (sin ejecutar).

## 7.1 De dónde saca hoy el portal de padres las colectas

Medido en el repositorio. El padre **nunca** lee los pagos del docente: lee
copias, y cada copia puede estar vieja, revivida o duplicada.

| paso | dónde | qué pasa |
|---|---|---|
| 1. El aparato del docente arma filas `economia` | `adFilasNube`, `js/tools/registros-admin.js:11998` (pagos en ~:12035) | una fila por familia y colecta, sacada de **su** `METAS_ADMIN_V1` local (ya fusionado): `estado = 'pago'` con el monto que dio, o `'pendiente'` con el **monto sugerido** |
| 2. Sube solo lo que cambió | `adSincronizarNube` :12095 → RPC `metas_guardar_admin` | compara con firmas guardadas en `METAS_ADMIN_SB_V1`. Si la colecta ya no existe en ese aparato, manda una fila `'eliminada'` (`adFilaAnulada` :12056). Si el aparato no se entera de un borrado, la nube **nunca** se entera |
| 3. Queda en la nube | `public.registro_admin` (llave `ADE-<colecta>-<clave>`) + copia en `registro_admin_historial` por disparador | la función de guardado exige *una* cuenta, no *la* dueña (ver 2.1) |
| 4. «Cuentas claras» y recibos | `avFilasNube` :12194 → `metas_guardar_avisos` → `public.mensajes_docente` (`AVC-…` y `AVR-…`, subtipo `cuentas`) | el recibo es un **comunicado de texto** con el folio en el título (`🧾 Recibo RC-…`), armado en el aparato |
| 5. El padre consulta | `padres.html:543-545`: `metas_consultar_plan_padre`, `metas_consultar_admin_padre`, `metas_consultar_avisos_padre` con la clave | `respEconomia` (`padres.html:903`) separa `pago` / `pendiente`; los recibos se reconocen por el título (`padres.html:941-975`) |
| 6. Copia en el teléfono del padre | `METAS_PADRE_CACHE_V1` (`padres.html:223`, `cacheSave` :313) | se guarda la respuesta entera por clave y se muestra **sin señal o si el servidor falla** (`_desdeCache`). Un pago que el docente ya borró puede seguir apareciendo aquí |
| 7. Claves escritas por el padre | `METAS_PADRE_V1` (`padres.html:222`, `js/app.js:1245`) | lista de claves de sus hijos |
| 8. Vista Padre del inicio | `padreConsultarNube`, `js/app.js:1421` | solo plan de acción, con la misma clave |

Lo que esto produce: el padre ve lo que **un** aparato del docente subió la
última vez que tuvo señal; un pago corregido en otro aparato llega cuando ese
otro aparato sincroniza (y antes pasa por la fusión); un pago borrado puede no
llegar nunca; y el teléfono del padre guarda su propia copia.

## 7.2 Cómo será

**El padre lee las mismas filas que escribe el docente**, a través de vistas de
solo lectura. No hay tabla intermedia, ni comunicados armados en el aparato, ni
copia en el teléfono.

```
docente escribe ─▶ metas.pagos (una fila) ─┬─▶ metas.vf_colectas ─▶ padres.html
                                           │      (vista, calculada en cada lectura)
                                           └─▶ disparador: «cambio» en el canal
                                                  privado familia:<id> ─▶ padres.html vuelve a leer
```

### Quién es el padre para la base

1. `padres.html` abre una **sesión anónima** de Supabase Auth
   (`signInAnonymously`). El padre no crea cuenta: escribe la clave de la tira,
   como hoy.
2. `metas.familia_vincular(clave)` guarda el vínculo sesión ↔ familia en
   `metas.familia_accesos`, con freno de intentos. Varios hijos = varias claves.
3. Cada lectura comprueba, en la base: vínculo vigente, familia activa,
   **la misma clave** con la que se vinculó y alumno activo. Si el docente le
   cambia la clave a una familia (tira perdida), los teléfonos vinculados con la
   clave vieja dejan de ver al instante.

### RLS: cada padre solo ve a sus hijos

- Las vistas `metas.vf_*` pertenecen al rol `metas_lector_familias`, que **no**
  salta la RLS. Ese rol tiene políticas de solo `SELECT` en cada tabla, que
  dejan pasar únicamente filas de los alumnos vinculados a `auth.uid()`.
- Ese rol tiene permiso solo sobre **columnas** que una familia puede ver: nada
  de número de identidad, teléfono, aparato, autor, ni la nota interna del pago.
- La sesión del padre (`authenticated`, anónima) no tiene ninguna política
  sobre las tablas de `metas`: si las consulta directo, recibe 0 filas. Solo
  tiene `SELECT` sobre las vistas `vf_*`.
- **No puede escribir**: no hay `INSERT`, `UPDATE` ni `DELETE` para él en
  ninguna tabla ni vista. Las únicas funciones que puede llamar son vincular y
  desvincular su propio teléfono.

### Las vistas

| vista | qué trae | reemplaza |
|---|---|---|
| `vf_hijos` | primer nombre, grado, sección, escuela, nombre del docente (sin su código) | la cabecera del chatbot |
| `vf_colectas` | por colecta: sugerido, pagado, falta, situación (`debe`, `abono`, `pagado`, `no_corresponde`), fecha del pago, **número de recibo** del pago, recibo anterior si lo hay, y fecha de corrección | `registro_admin` tipo `economia` + recibos `AVR` |
| `vf_cuentas_claras` | lo gastado de cada colecta del aula, con su detalle | comunicados `AVC` |
| `vf_notas`, `vf_personalidad` | notas por asignatura y parcial, rasgos | `registro_admin` tipo `nota_final` |
| `vf_asistencia` | ausencias, excusas y tardanzas | `registro_admin` tipo `asistencia` |
| `vf_avisos`, `vf_observaciones`, `vf_preguntas` | avisos vigentes, conducta visible para la familia, preguntas frecuentes | `mensajes_docente` |
| `vf_plan_accion` | resultados enviados del plan de acción | `plan_accion` |

El recibo **es** el pago: su número (`pagos.recibo`, por ejemplo
`RC-27-K7Q-0001`) lo pone la base al crear la fila, es único en todo el
sistema y no cambia nunca. Hoy el folio se arma con el número de lista
(`adReciboFolio`, `js/tools/registros-admin.js:4262`: `'RC-' + 4 del id de la
colecta + '-' + num`), así que reordenar la lista cambiaba el folio. Si el
docente corrige el monto, el recibo conserva su número y muestra el monto
nuevo con la leyenda «corregido el …»; si lo borra, el recibo desaparece. No
hay un recibo guardado aparte que pueda contradecir al pago. El número del
sistema viejo, si el docente lo copió, se muestra como «Recibo anterior».

### «De inmediato»

Los padres no se suscriben a las tablas (recibirían filas completas). Cada
cambio en pagos, colectas, gastos, notas, asistencia, avisos u observaciones
dispara un **toque sin datos** en el canal privado `familia:<id>` (Realtime
Broadcast desde la base, con política sobre `realtime.messages`). El teléfono
del padre, al recibirlo, vuelve a leer las vistas. Además vuelve a leer al
abrir, al volver a la pestaña y al recuperar la señal.

«De inmediato» empieza cuando el cambio **llega a Supabase**. Si el docente lo
hizo sin señal, el padre ve lo de antes hasta que la cola del docente lo envía
(sección 3.6). Nunca ve una mezcla.

### Sin copias en el teléfono del padre

- Se elimina `METAS_PADRE_CACHE_V1`. Sin señal, el chatbot dice: «Ahora no hay
  señal. Los pagos y las notas se muestran con señal, para que siempre sean los
  que tiene el maestro». Mostrar una copia vieja es justo lo que hace que un
  pago borrado siga apareciendo.
- `METAS_PADRE_V1` deja de guardar las claves: el vínculo vive en la base. En el
  teléfono solo queda la sesión anónima de Supabase (un token, no datos) y los
  alias para el selector de hijos se leen de `metas.familia_accesos`.
- Si el padre borra los datos del navegador, vuelve a escribir la clave. Igual
  que hoy.

## 7.3 Qué se elimina del lado de padres (en la fase de implementación)

| pieza | dónde |
|---|---|
| `adFilasNube`, `adFirma`, `adFilaAnulada`, `adSyncProgramar`, `adPendientesTotal`, `adSincronizarNube`, escucha `online` | `js/tools/registros-admin.js:11998-12180` |
| `avFilasNube`, `avFirma`, `avSincronizarNube` (avisos, cuentas `AVC`, recibos `AVR`) | `js/tools/registros-admin.js:12194-12390` |
| `METAS_ADMIN_SB_V1`, `METAS_AVISOS_SB_V1` (firmas de lo subido) | idem |
| chip «⏳ N por subir / ☁️ al día» `#ad-nube-chip` | `js/tools/registros-admin.js:1207`, `adActualizarChipNube` :941 |
| `paSincronizarNube` → `metas_guardar_plan` | `js/tools/plan-accion.js:3217` |
| caché `METAS_PADRE_CACHE_V1`, `_cacheTodo`, `cacheLoad`, `cacheSave`, `_desdeCache` | `padres.html:223`, `:299-318` |
| las tres llamadas `metas_consultar_*_padre` | `padres.html:543-545`, `js/app.js:1436` |
| reconocer recibos por el título (`esRecibo`, `reciboFolio`) | `padres.html:941-950` (el folio viene de la vista) |
| funciones SQL `metas_consultar_admin_padre`, `metas_consultar_avisos_padre`, `metas_consultar_plan_padre`, `metas_guardar_admin`, `metas_guardar_avisos`, `metas_guardar_plan`, `metas_cerrar_familias`, `metas_buzon_docente` | se congelan (ver `SUPABASE-V2-CONGELAR.sql`) |

Lo que **se queda** igual: el buzón de mensajes y excusas que escriben los
padres (`metas_mensaje_padre`, `mensajes_padre`) y el aviso de visto. Son datos
**del padre**, no del docente. La excusa aceptada por el docente sí pasa a ser
una fila: `metas.asistencia` con `estado = 'excusa'` y su `justificacion`.

## 7.4 Pendiente de tu decisión

1. **Activar inicios de sesión anónimos** en Supabase Auth (y, recomendado, el
   CAPTCHA de Turnstile para que nadie cree sesiones anónimas en masa).
2. **¿Las familias ven lo recaudado del grado?** Hoy «cuentas claras» muestra
   lo gastado; lo recaudado se mostraría solo como una suma, nunca quién pagó.
3. **Transición del chatbot**: mientras el docente no cargue su aula en la base
   nueva, sus familias no verían nada en el portal nuevo. Opciones: (a) el
   portal nuevo se activa por aula cuando esta tiene al menos un alumno con
   familia; antes, se sigue leyendo lo congelado (solo lectura, sin caché);
   (b) corte el mismo día para todos.
