# 1. Inventario: cada dato que el docente digita, y su tabla

Fase 1: diseño. Medido en el repositorio (rama `main`, v548). Las tablas son
las de `SUPABASE-V2-ESQUEMA.sql`.

## 1.1 Dónde vive hoy

No hay IndexedDB ni base local: **todo es `localStorage` con JSON entero**.
Ocho llaves viajan enteras a `public.docente_estado` (una fila por llave, el
texto tal cual en `valor.raw`): `METAS_ADMIN_V1`, `METAS_AVISOS_V1`,
`METAS_PLANACCION_V1`, `METAS_CODIGOS_V1`, `METAS_CAMP_V1`,
`METAS_CAMP_BANK_EXTRA_V1`, `METAS_CAMP_USED_V1`, `meta_ge_v2`
(`DS_KEYS`, `js/metas-docente-sync.js:41`).

Dos llaves con datos del docente **ni siquiera se sincronizan** (solo existen
en un aparato): `METAS_INSTRUMENTOS_V1` y `METAS_TESIS_CFG_V1`.

### Por qué se mueven pagos y notas de alumno

Hoy **el número de lista es la llave foránea** de casi todo. Dentro de un grupo:
`notas[parcial][campo][num]`, `recuperacion[materia][num]`,
`inasisOficial[num]`, `asistencia[].aus[num]`, `colectas[].pagos[num]` y
`pagosF[num]`, `noCuentan[num]`, `controles[].datos[num]`,
`acumulativos[].notas[num]`, `lectura[].num`, los repartos de equipos
(`"1,5,9|2,6,10"`), las claves de familia (`METAS_CODIGOS_V1['G:id'][num]`),
avisos (`alumnos:[num]`), conducta (`num`) y plan de acción (`students[].num`).

Reordenar o quitar un alumno reescribe todo eso con
`MetasNumeracion.remapGrupo` (`js/metas-numeracion.js:43-71`). Dos fallos
medidos en ese remapeo:

- `acumulativos[].notas` **no** está en la lista de campos que se remapean:
  al reordenar, los puntos de los acumulativos quedan en el número viejo.
- Se remapea `c.noCuenta`, pero el código guarda `c.noCuentan`
  (`js/tools/registros-admin.js:5733`): la lista de exentos nunca se remapea.

En el modelo nuevo **nada** usa el número de lista: todo apunta a
`alumnos.id`. `num_lista` es una columna visual, sin `unique`, que se edita
sin tocar ninguna otra tabla.

## 1.2 Mi aula (`METAS_ADMIN_V1`)

| hoy (campo) | qué es | tabla nueva | llave natural (unique activo) |
|---|---|---|---|
| `grupos[]`: `id, escuela, grado, seccion` | el aula | `aulas` | dueño + escuela + grado + sección + año |
| `boleta.{director, docente, lugar, municipio, departamento, anio, codigoCentro, modalidad, jornada, aldea, escalaPers}` | encabezado de boleta | columnas de `aulas` | |
| `boleta.parcialFechas.{I..IV}.{desde,hasta}` | fechas de cada parcial | `periodos` | aula + periodo |
| `boleta.sugerirIVAuth`, `autoRecI…` y otras banderas | preferencias del aula | `aulas.ajustes` (jsonb) | |
| `logo`, `logoSec` (base64) | logos de la boleta | Storage `metas-imagenes` + `aulas.logo_path` | |
| `materias:['Español',…]` | asignaturas | `asignaturas` (con id: renombrar no mueve notas) | aula + nombre |
| `lista[]`: `num, nombre, idn, sexo, fnac, estado, estadoF, sace, saceNum, edadSace, noCopiarSace, alta, uid` | alumno | `alumnos` (`identidad` normalizada + `documento_pais` + `documento_tipo`: acepta documentos extranjeros; `estado` suma `retirado`) | aula + país + identidad (**única regla dura**); el nombre repetido es solo aviso |
| `lista[].prueba` | marca de alumno de prueba | se descarta (la base nueva empieza vacía, sin datos de prueba) | |
| `lista[].{tel, enc, encId, encTel}` | contacto y encargado | `familias` | una por alumno |
| `lista[].clave` y `METAS_CODIGOS_V1['G:id'][num]` | clave de familia | `familias.clave`, puesta por la base: nueva de 10 símbolos, o la ya entregada **solo si está en los datos congelados de ese docente** | única en todo el sistema |
| `notas[p][materia][num]` (1 a 100) | nota SACE del parcial | `notas` (`componente = 'final'`) | alumno + asignatura + periodo + componente |
| `notas[p][rasgo][num]` (S/MB/B) | personalidad | `notas_personalidad` | alumno + periodo + rasgo |
| `notas[p]['Inasistencias'][num]` | inasistencias del parcial para el SACE | `inasistencias_oficiales` (solo si el docente escribe un número distinto del contado) | alumno + periodo |
| `inasisOficial[num]` | inasistencias del año para el SACE | `inasistencias_oficiales` (`periodo = 'ANUAL'`) | alumno + periodo |
| `recuperacion[materia][num]` | nota de recuperación | `notas` (`periodo = 'REC'`) | alumno + asignatura + REC + final |
| `asistencia[].f` | día en que se pasó lista | `asistencia_dias` | aula + fecha |
| `asistencia[].aus[num] = 'A'/'E'` | ausente / con excusa | `asistencia` (`estado`) | alumno + fecha |
| excusa aceptada desde el buzón (hoy solo cambia `'A'` por `'E'` y **pierde el motivo**) | justificación | `asistencia.justificacion` (misma fila) | |
| `colectas[]`: `id, concepto, montoAlumno, fecha` | colecta | `colectas` | |
| `colectas[].pagos[num]` + `pagosF[num]` | lo que dio cada alumno y cuándo (hoy UN monto que se sobrescribe con cada abono) | `pagos`: **una fila por pago o abono**, cada una con su recibo; monto inmutable (corregir = anular + reemplazo) | ninguna: un alumno puede tener varios pagos en una colecta |
| folio del recibo, hoy **calculado con el número de lista** (`adReciboFolio`, `registros-admin.js:4262`: `RC-<4 del id de la colecta>-<num>`) | número de recibo | `pagos.recibo`: lo pone la base, único en todo el sistema e inmutable (`RC-27-K7QM-0001`); `pagos.recibo_anterior` guarda el viejo si el docente lo copia | recibo |
| `colectas[].noCuentan[num]` | a quién no le corresponde | `colecta_exenciones` (con `monto_aplicable` opcional para exenciones parciales) | colecta + alumno |
| `colectas[].gastos[]`: `id, d, m, f` | gasto de la colecta | `gastos` (solo gastos de colecta) | |
| `colectas[].quitados`, `gastosQuitados`, `esperados` | marcas de la fusión y la reposición | **se eliminan**: borrar es `deleted_at`, y los esperados se calculan | |
| `st.gastos[]`: `fecha, cat, concepto, monto, cobrarA, factura, escuela, estado, fechaCobro` | gasto del docente que se cobra después (hoy con un estado escrito a mano y **una sola** fecha de cobro) | `gastos_docente` (fecha, tipo, concepto, a quién se cobra, si tiene recibo, monto, escuela) + `reembolsos` (**una fila por cada reembolso**, con su fecha y monto inmutable). El estado, lo que falta y los días de espera **se calculan** | |
| `st.inventario[]`: `fecha, nombre, dueno ('mio'/'escuela'/'donado'), cat, cant, valor, nota, donante, factura, escuela, pagadoPor, fechaPago` | bien del aula | `bienes` (fecha desde, cantidad, descripción, nota, tipo, si tiene recibo, valor, propietario `docente`/`centro` —este último bajo custodia del docente—, origen, donante). Si el centro le reembolsa un bien al docente: `reembolso_fecha` y pasa a `centro` en la **misma fila**; su historia queda en la auditoría (`v_bien_historia`) | |
| `st.invActas[]`: `t, fecha, quien, nMio, nEsc, vMio` (las últimas 12) | acta de inventario | `actas_inventario`: **versiones fechadas** y numeradas por centro (la primera al empezar, las siguientes cada 3 meses); la foto de los bienes la toma el servidor; un acta no se edita (se anula y se reemplaza) | centro + número |
| `controles[]`: `id, icono, nombre, tipo, fecha, fam, acum, misionId, verbo` | control o registro | `controles` | |
| `controles[].datos[num]` | marca, número o texto por alumno | `control_valores` | control + alumno |
| `acumulativos[]`: `id, titulo, icono, materia, parcial, fecha, tipo, calculo, criterios` | evaluación acumulativa | `evaluaciones` (criterios = definición en jsonb) | |
| `acumulativos[].notas[num][criterio]` | puntos por alumno y criterio | `evaluacion_puntos` | evaluación + alumno + criterio |
| `bitacora[]` | bitácora de clase | `bitacora` | |
| `lectura[]`: `f, num, textoId, gradoTexto, titulo, seg, palabras, total, errores, comp, compDe` | toma de lectura | `lecturas` (con id propio; `ppm` se calcula) | |
| `equipos.{conf, reparto, coord, separar, fuera}` | reparto de equipos | `repartos` + `reparto_miembros` (por id de alumno) | un reparto vigente por aula |
| `equipos.antes`, `tAntes` | reparto anterior | el reparto anterior es la fila con `vigente = false` | |
| `convocatorias[]` (datos del evento) | convocatoria | `convocatorias.datos` | código público |
| `convocatorias[].manual[]` | familias anotadas a mano | `convocatoria_inscritos` | convocatoria + huella |
| `convocatorias[].pagos[huella]`, `abordo[huella]` | dinero cobrado y quién subió al bus | `convocatoria_pagos` | convocatoria + huella |
| `convocatorias[].resp[]` | respuestas de las familias | **no se copia**: se lee de `public.convocatoria_respuestas` (es dato de las familias) | |
| `convocatorias[].pin` | PIN del evento, **hoy en texto plano dentro del blob que sube a la nube** | pendiente: ver 1.7 | |
| `edadCorte`, `resumenPeriodo`, `obsGrado` | ajustes del aula y observación del grado | `aulas.edad_corte`, `aulas.ajustes`, `aulas.observacion_grado` | |
| `saceImport` | lo último que se pegó del SACE | **no se guarda**: es un paso de la carga rápida | |
| `borrados[]`, `ordenT`, `grOrden` | lápidas y relojes de la fusión | **se eliminan** | |

## 1.3 Avisos y conducta (`METAS_AVISOS_V1`)

| hoy | tabla nueva | nota |
|---|---|---|
| `grupos[g].avisos[]`: `id, tipo, prioridad, titulo, texto, fechaEvento, hasta, mod` | `avisos` | |
| `avisos[].alumnos:[num]`, `alumnosId:[{uid,nombre}]` | `aviso_destinatarios` (por id de alumno) | sin filas = toda el aula |
| `grupos[g].faqs[]` | `preguntas_frecuentes` | |
| `grupos[g].conducta[]`: `num, uid, nombre, tipo, texto, fecha, hasta` | `observaciones` (tipos `llamado`, `leve`, `felicitacion`, más `expediente` para notas del expediente que no ve la familia) | `para_familia` decide si la ve el padre |

## 1.4 Plan de acción (`METAS_PLANACCION_V1`)

| hoy | tabla nueva |
|---|---|
| `analisis[]`: `id, grado, seccion, evaluacion, misionId, materia, forma, tipoEval, parcial, fechaPrueba, grupoId` | `analisis` |
| `analisis[].students[]`: `num, nombre, nota/'NSP', categoria, sugerencia, msg, msgEdit, env` | `analisis_alumnos` (`no_se_presento` en vez de `'NSP'`) |
| `histFiltros` | preferencia de vista: llave local propia, no va a la base |
| `METAS_TESIS_CFG_V1` | `ajustes_docente` (clave `tesis`) |

## 1.5 Otras herramientas

| llave | qué | tabla nueva |
|---|---|---|
| `METAS_INSTRUMENTOS_V1` (rúbricas, cotejo, actividades) | instrumentos de evaluación | `instrumentos` |
| `METAS_CAMP_V1.historial[]` | resultados del Campeonísimo | `campeonatos` |
| `METAS_CAMP_BANK_EXTRA_V1`, `METAS_CAMP_USED_V1` | preguntas traídas de misiones y ya usadas | **caché local**, no es dato digitado: no va a la base |
| `meta_ge_v2` (`mode, p1, p2, votes, usedCodes`, imágenes base64) | votación del Gobierno Escolar | `elecciones` + `eleccion_votos` (un voto = una fila; el conteo se calcula) + imágenes en Storage |
| `parte-mensual.js` | formulario que solo calcula | nada que guardar |
| `METAS_DOCENTE_V1.{nombre, correo, escuela, telefono, …}` | perfil de la cuenta | se queda en `public.docentes` (no se toca, regla de cuentas) |
| `METAS_DOCENTE_V1.clave` | **contraseña en texto plano** | se elimina (ver `02-CUENTAS-Y-SEGURIDAD.md`) |
| `METAS_DOCENTE_V1.{gradoImparte, progFiltros}` | preferencias | llave local de preferencias |

## 1.5b Lista oficial del SACE, cuadros y boletas

`js/tools/sace-lista.js` no escribe `localStorage` por su cuenta: recibe el
grupo, empareja el CSV del SACE con la lista y **escribe dentro de cada
alumno** del blob. `js/tools/cuadros-sace.js` (`ResumenSace`) y las boletas
leen el grupo entero (`adLoad()`) y calculan.

| hoy | qué es | en el modelo nuevo |
|---|---|---|
| `a.sace` (true/false), `a.saceNum`, `a.edadSace`, `a.fnac` (la del SACE gana), `a.estado`, `a.estadoF` | marca de matrícula oficial y datos traídos del SACE | columnas de `alumnos`: `en_sace`, `sace_num`, `edad_sace`, `fecha_nacimiento`, `estado`, `estado_fecha`. Importar el CSV = una **vista previa** (como en `04-CARGA-RAPIDA.md`) que al confirmarse manda un `editar` por alumno emparejado y un `crear` por alumno nuevo |
| emparejar CSV ↔ lista por identidad, nombre o `num` | `sace-lista.js` | por identidad (con país) y, si no hay, por nombre completo normalizado. **Nunca por número de lista** |
| `d.saceImport = {f, filas}` | cuándo se importó y cuántas filas | no se guarda: la fecha está en la auditoría de las filas editadas |
| `ResumenSace` (cuadros SACE, cuadro estadístico, ingresos y egresos, matrícula final, edades al corte) | cálculo | se queda como cálculo, pero recibe **filas** (`alumnos`, `notas`, `asistencia`, `periodos`, `inasistencias_oficiales`) en vez del blob |
| boletas I a IV y final, resumen final, expediente impreso | cálculo + encabezado de la boleta | encabezado: columnas de `aulas`; todo lo demás calculado desde filas. **No hay tabla de boletas** |
| `notas[p]['Inasistencias']` autollenado desde la asistencia del rango del parcial (`registros-admin.js:10039-10043`) | cálculo que hoy se **guarda** como si fuera nota | `v_inasistencias_periodo` lo calcula; solo se guarda `inasistencias_oficiales` si el docente escribe un número distinto |

## 1.6 Lo que se CALCULA y nunca se guarda

| resultado | se calcula desde | dónde |
|---|---|---|
| total recaudado, gastado, saldo, meta, **falta total** (suma de lo que le falta a cada alumno que sigue y no está exento), pago de más, cuántos pagaron | `pagos`, `gastos`, `colectas`, `colecta_exenciones`, `alumnos` | `v_colectas_resumen` |
| por alumno: lo que le corresponde (sugerido; 0 si exento; `monto_aplicable` si exento parcial; 0 si ya no está), lo pagado (suma de abonos), lo que falta (**0 si está exento**, nunca negativo), pago de más, situación | `pagos`, `colectas`, `colecta_exenciones`, `alumnos` | `v_colecta_alumnos` |
| gastos del docente: reembolsado, lo que falta, **estado** (por cobrar, reembolsado parcial o total) y **días de espera**; totales por a quién se cobra | `gastos_docente`, `reembolsos` | `v_gastos_docente`, `v_gastos_docente_resumen` |
| inventario: renglones, unidades y valor por centro y propietario; cuándo toca la próxima acta | `bienes`, `actas_inventario` | `v_inventario_resumen`, `v_proxima_acta` |
| ausencias, excusas y tardanzas por parcial; número para el SACE | `asistencia`, `periodos`, `inasistencias_oficiales` | `v_inasistencias_periodo` |
| promedio anual, parciales con nota, recuperación | `notas` | `v_notas_alumno` |
| resultado de cada acumulativo | `evaluacion_puntos`, `evaluaciones.criterios` | `v_evaluacion_resultado` |
| conteo de votos | `eleccion_votos` | `v_eleccion_conteo` |
| palabras por minuto | `lecturas` | en pantalla |
| **boletas** (I a IV, final), **cuadros SACE**, **cuadros estadísticos**, resumen final, ingresos y egresos, expediente impreso | todas las anteriores | `js/datos/calculos.js` con las mismas fórmulas que las vistas, para que funcione sin señal. `ResumenSace` de `js/tools/cuadros-sace.js` pasa a leer filas en vez del blob |
| recibo impreso de un pago | `pagos` (su número es `pagos.recibo`, que sí se guarda porque es un identificador, no un cálculo) | `vf_colectas` / en pantalla |

Regla para la implementación: si alguien propone una columna `total`,
`promedio`, `saldo`, `recaudado` o `inasistencias_calculadas`, se rechaza. Lo
único "tipo total" que se guarda son las inasistencias **oficiales** que el
docente copia al SACE cuando difieren de lo contado, porque es un dato que él
escribe, no un cálculo.

## 1.7 Pendientes del inventario

1. **PIN de la convocatoria.** Hoy viaja en texto plano dentro del blob. En
   la base nueva, el docente ve las respuestas de **sus** convocatorias por
   RLS y no necesitaría el PIN; pero las funciones públicas
   (`metas_conv_respuestas`, `metas_conv_quitar`) todavía lo piden. Propuesta:
   una función nueva que verifique dueño por `auth.uid()` y dejar de guardar
   el PIN. Necesita tocar `public.convocatorias` (añadir el dueño): decisión
   tuya.
2. **Homónimos.** La restricción `unique` por nombre completo dentro del aula
   impide registrar a dos alumnos con nombre y apellidos idénticos. Con cuatro
   nombres hondureños es rarísimo; si pasa, el docente añade algo que los
   distinga. Alternativa: que el nombre sea solo un aviso y la identidad la
   única restricción dura.
3. **Alumnos extranjeros**: resuelto. `documento_pais` (HN, GT, SV…) y
   `documento_tipo` (identidad, CUI, partida, pasaporte, otro). Solo para
   Honduras se exige el formato de 13 dígitos; el resto acepta de 4 a 25
   letras y números. La identidad es única por aula **y país**.
4. **Un alumno que cambia de sección** dentro de la misma escuela: en este
   diseño `alumnos.aula_id` no se cambia (sus pagos y notas son de esa aula).
   Se registra como `trasladado` en una y se crea en la otra.
