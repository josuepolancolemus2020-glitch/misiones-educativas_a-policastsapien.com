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
   (`signInAnonymously`) con **CAPTCHA Turnstile obligatorio**. El padre no
   crea cuenta: escribe la clave de la tira, como hoy.
2. La función de borde `familia-vincular` comprueba **otro token Turnstile en
   cada intento**, toma la IP que añadió la infraestructura (nunca una cabecera
   escrita por el cliente) y llama a `metas.familia_vincular`, que **solo
   puede llamar el servidor**. Guarda el vínculo sesión ↔ familia en
   `metas.familia_accesos`, con frenos por sesión, por IP y un tope global de
   claves equivocadas. Varios hijos = varias claves.
3. Cada lectura comprueba, en la base: sesión anónima, vínculo vigente,
   familia activa con **la misma clave** con la que se vinculó y alumno
   activo. Las claves no cambian; si una tira se pierde, el docente
   **reemplaza** la familia (clave nueva) y los teléfonos vinculados con la
   vieja dejan de ver al instante.

### RLS: cada padre solo ve a sus hijos, y no puede escribir nada

- Las vistas `metas.vf_*` pertenecen al rol `metas_lector_familias`, que **no**
  salta la RLS. Ese rol tiene políticas de solo `SELECT` en cada tabla, que
  dejan pasar únicamente filas de los alumnos vinculados a `auth.uid()`.
- Ese rol tiene permiso solo sobre **columnas** que una familia puede ver: nada
  de número de identidad, teléfono, aparato, autor, nota interna del pago ni
  motivo de anulación. Necesita `CREATE` en el esquema solo para quedarse con
  las vistas; se le quita en el mismo archivo.
- La sesión del padre usa el rol `authenticated`, **el mismo que los
  docentes**. Por eso cada tabla del docente tiene además una política
  **restrictiva** que exige una cuenta de docente vinculada
  (`metas.es_docente()`), y el primer disparador de cada tabla lo vuelve a
  exigir antes de tocar nada. Con eso, una sesión anónima:
  - **no lee** ninguna tabla directa (0 filas);
  - **no puede crear** aulas, alumnos, familias, pagos ni nada (error `42501`);
  - **no puede averiguar si una clave existe** insertando una familia: el
    error es el mismo exista o no la clave, porque el rechazo ocurre antes de
    llegar al índice único;
  - no puede llamar a las funciones de dinero ni de alta de alumnos (exigen
    `es_docente()`).
- Solo tiene `SELECT` sobre las vistas `vf_*` y sobre su propio vínculo. Lo
  único que escribe, y siempre por funciones del servidor: su vínculo (por
  `familia-vincular`), quitar un hijo de su teléfono y el «visto» de un aviso.

### Las vistas

| vista | qué trae | reemplaza |
|---|---|---|
| `vf_hijos` | primer nombre, grado, sección, escuela, nombre del docente (sin su código) | la cabecera del chatbot |
| `vf_colectas` | por colecta, lo de **su** hijo: lo que le corresponde (0 si está exento; menos si la exención es parcial), lo pagado (suma de abonos), lo que falta (**0 si está exento**), pago de más, situación | `registro_admin` tipo `economia` |
| `vf_pagos` | cada pago o abono de su hijo con su **número de recibo**, fecha, recibo anterior y, si corrige otro, «corrige al recibo RC-…» | recibos `AVR` |
| `metas.familia_totales_colectas()` | **solo el total** recaudado, gastado y saldo de cada colecta del aula. Nunca los pagos de otros alumnos | — |
| `vf_cuentas_claras` | el detalle de lo gastado de cada colecta del aula | comunicados `AVC` |
| `vf_notas`, `vf_personalidad` | notas por asignatura y parcial, rasgos | `registro_admin` tipo `nota_final` |
| `vf_asistencia` | ausencias, excusas y tardanzas | `registro_admin` tipo `asistencia` |
| `vf_avisos` | avisos de toda el aula y los **individuales** dirigidos a su hijo (se decide por `tipo = 'individual'`, no por si hay destinatarios) | `mensajes_docente` |
| `vf_observaciones` | **solo** llamados, faltas leves y felicitaciones que el docente marcó para la familia y que no han vencido. El **expediente nunca** (la base no deja marcarlo para la familia) | conducta en `mensajes_docente` |
| `vf_preguntas`, `vf_plan_accion` | preguntas frecuentes activas; resultados **enviados** del plan de acción | `mensajes_docente`, `plan_accion` |

El recibo **es** el pago: su número (`pagos.recibo`, por ejemplo
`RC-27-K7QM-0001`) lo pone la base, es único en todo el sistema y no cambia
nunca. Hoy el folio se arma con el número de lista (`adReciboFolio`,
`js/tools/registros-admin.js:4262`: `'RC-' + 4 del id de la colecta + '-' +
num`), así que reordenar la lista cambiaba el folio. El **monto** de un pago
tampoco cambia: si el docente lo corrige, el recibo viejo queda **anulado** y
desaparece de la vista del padre, y aparece uno **nuevo** con «corrige al
recibo RC-…». Si lo anula, desaparece. El número del sistema viejo, si el
docente lo copió, se muestra como «Recibo anterior».

### «Visto» de los avisos

Tabla nueva `metas.avisos_vistos` (una fila por aviso y familia). La familia
la escribe **solo** con `metas.familia_marcar_visto(aviso)`, que comprueba que
ese aviso le llega a uno de sus hijos. El docente la lee con su RLS
(`v_avisos_vistos`: cuántas familias vieron cada aviso). Nadie la edita ni la
borra.

### «De inmediato»

Los padres no se suscriben a las tablas (recibirían filas completas). Cada
cambio en pagos, colectas, gastos, notas, asistencia, avisos u observaciones
dispara un **toque sin datos** en el canal privado `familia:<id>` (Realtime
Broadcast desde la base, con política sobre `realtime.messages`). El teléfono
del padre, al recibirlo, vuelve a leer las vistas. Además vuelve a leer al
abrir, al volver a la pestaña y al recuperar la señal.

«De inmediato» empieza cuando el cambio **llega a Supabase**. Si el docente lo
hizo sin señal, el padre ve lo de antes hasta que la cola del docente lo envía
(sección 3.7). Nunca ve una mezcla.

### Sin copias en el teléfono del padre

- Se elimina `METAS_PADRE_CACHE_V1`. Sin señal, el portal muestra solo el
  **punto gris** de «sin señal» (`09-INTERFAZ.md`) y no inventa nada: mostrar
  una copia vieja es justo lo que hace que un pago borrado siga apareciendo.
  Desaparecen el chip «🔄 Actualizar», «datos guardados el …», «el maestro no
  publica desde el …» y todos los «consultando la nube»: las vistas se leen
  solas al abrir, al volver a la pestaña, al volver la señal y con cada toque
  de Realtime.
- `METAS_PADRE_V1` deja de guardar las claves: el vínculo vive en la base. En el
  teléfono solo queda la sesión anónima de Supabase (un token, no datos).
- Si el padre borra los datos del navegador, vuelve a escribir la clave.

### Más vistas, porque `avFilasNube` desaparece en el corte 1

Lo que antes llegaba al chatbot como mensaje armado en el aparato del docente
ahora se lee de sus filas: `vf_periodos` (fechas de los parciales, antes
`AVP-`), `vf_controles` (controles marcados para la familia, antes `AVB-`),
`vf_bitacora` (novedades de la clase de los últimos 60 días, antes `AVN-`).
Avisos, conducta y preguntas frecuentes ya estaban en `vf_avisos`,
`vf_observaciones` y `vf_preguntas`. Los recibos (`AVR-`) y las cuentas claras
(`AVC-`) salen de `vf_pagos`, `vf_cuentas_claras` y
`familia_totales_colectas()`.

## 7.3 Qué se elimina del lado de padres (en la fase de implementación)

| pieza | dónde |
|---|---|
| `adFilasNube`, `adFirma`, `adFilaAnulada`, `adSyncProgramar`, `adPendientesTotal`, `adSincronizarNube`, escucha `online` | `js/tools/registros-admin.js:11998-12180` |
| `avFilasNube`, `avFirma`, `avSincronizarNube` (avisos, cuentas `AVC`, recibos `AVR`) | `js/tools/registros-admin.js:12194-12390` |
| `METAS_ADMIN_SB_V1`, `METAS_AVISOS_SB_V1` (firmas de lo subido) | idem |
| chip «⏳ N por subir / ☁️ al día» `#ad-nube-chip` | `js/tools/registros-admin.js:1207`, `adActualizarChipNube` :941 |
| `paSincronizarNube` → `metas_guardar_plan` | `js/tools/plan-accion.js:3217` |
| caché `METAS_PADRE_CACHE_V1`, `_cacheTodo`, `cacheLoad`, `cacheSave`, `_desdeCache` | `padres.html:223`, `:299-318` |
| las tres llamadas `metas_consultar_*_padre` | `padres.html:543-545`, `js/app.js:1436` (quedan solo para claves que aún no están en la base nueva, sin dinero, hasta el paso 4) |
| reconocer recibos por el título (`esRecibo`, `reciboFolio`) | `padres.html:941-950` (el folio viene de la vista) |
| funciones SQL de **escritura** del chatbot viejo | `metas_guardar_admin` se cierra en el paso 1; `metas_guardar_plan` en el paso 2; `metas_guardar_avisos` y `metas_cerrar_familias` en el paso 4 (antes, `mensajes_docente` ya rechaza todo lo de docentes vinculados y el cierre de año sigue funcionando) |
| funciones SQL de **lectura** de padres (`metas_consultar_admin_padre`, `metas_consultar_avisos_padre`, `metas_consultar_plan_padre`) y el buzón viejo del docente (`metas_buzon_docente`, `metas_avisos_vistos`) | **siguen abiertas** hasta que la última aula esté en la base nueva y el buzón tenga reemplazo (paso 4) |

Lo que **se queda** igual: el buzón de mensajes y excusas que escriben los
padres (`metas_mensaje_padre`, `mensajes_padre`) y el aviso de visto. Son datos
**del padre**, no del docente. La excusa aceptada por el docente sí pasa a ser
una fila: `metas.asistencia` con `estado = 'excusa'` y su `justificacion`.

## 7.4 Transición aula por aula (decidido)

El portal nuevo no espera a que todos los docentes carguen su aula:

1. El padre escribe su clave. `familia-vincular` la busca en la base nueva.
2. Si está (el docente ya cargó el aula con esa clave conservada), el padre
   queda vinculado y lee **solo** las vistas `vf_*`. Para esa familia, el
   archivo viejo ya no se consulta.
3. Si no está, el portal consulta las funciones de lectura viejas (abiertas
   hasta el paso 4) y muestra **solo notas, asistencia y avisos**, bajo una
   frase de fecha: «Información registrada hasta el <fecha del corte 1>».
   **Ningún dato de dinero sale del archivo**: ni colaboraciones, ni cuentas
   claras, ni recibos. Las familias solo ven recibos de la base nueva (el
   archivo es justo el que inventaba y revivía pagos). Sin caché.
   Para los docentes vinculados lo garantiza **el servidor** desde el paso 1,
   no solo el portal (revisión 4, N2): `metas_consultar_admin_padre` y
   `metas_consultar_avisos_padre` (misma firma, envuelven a las viejas)
   quitan pagos (`economia`), cuentas claras (`AVC-`) y recibos (`AVR-`)
   cuando la clave está en la copia de claves de un docente vinculado **o**
   el texto «docente» de la fila trae su código, sin importar mayúsculas.
   Así, una `padres.html` vieja guardada en un teléfono tampoco los ve. El
   dinero de quien se vincula después deja de verse en ese momento.
4. **Se cierra el archivo a las familias** (paso 4 de `CONGELAR`) cuando todos
   los docentes estén migrados **o** al terminar el **primer parcial de 2027**,
   lo que llegue primero, con **dos semanas de aviso** a docentes y familias.
   La consulta del paso 4 cuenta docentes sin vincular, vinculados sin aula y
   aulas del archivo sin aula nueva.

**Avisos en vivo** (rev. 5): la familia escucha el canal de su hijo solo
mientras el alumno siga activo (`familia_canal_ok`). Si pasa a retirado,
trasladado o desertor, deja de recibir avisos en vivo; lo ya registrado lo
sigue viendo al abrir el portal.

Del lado del servidor, desde el paso 1, `metas_guardar_avisos` reconoce al
docente por el código y la contraseña con que llama (no por el texto libre
«docente» de cada fila) y, si está vinculado, no escribe nada y responde `-2`
(revisión 4, N1). Un disparador en `mensajes_docente` (`MT041`) queda como
respaldo para lo que no pase por la función. Una pestaña vieja o una APK
vieja no pueden seguir publicando recibos (`AVR-`), cuentas (`AVC-`) ni
avisos para esas familias.

**Claves viejas** (revisión 4, N3, decisión de Josué): las conservadas vencen
al terminar la transición (paso 4). Antes, el docente imprime la tira nueva
de cada familia con clave vieja; la nueva sirve desde que se imprime. En la
fecha avisada, la vieja deja de abrir: el teléfono que entró con ella deja de
ver y el portal le dice a la familia, de usted: «Esta clave ya no sirve.
Escriba la clave de la tira nueva que le dio su docente». Detalle en `02`,
2.7.

## 7.5 Decisiones tomadas

- Sesiones anónimas activadas, con **CAPTCHA Turnstile obligatorio**.
- Tope global de claves equivocadas: **alerta** para quien administra (una por
  hora, en `metas.alertas`), **no bloquea** a todas las familias. Siguen los
  frenos por sesión y por IP.
- `vf_colectas`: a un alumno retirado, trasladado o desertor no le corresponde
  nada (mismo cálculo que `v_colecta_alumnos`).
- Las familias ven **solo el total recaudado** de cada colecta
  (`familia_totales_colectas`), nunca los pagos de otros alumnos.
- «Visto» de avisos en tabla nueva, escrita solo por función del servidor.
