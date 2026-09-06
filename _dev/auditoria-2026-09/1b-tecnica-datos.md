# Auditoría técnica (II): base de datos, autenticación, seguridad y escalabilidad

Tres lentes independientes (T3 base de datos y autenticación, T4 seguridad, T9 escalabilidad),
36 hallazgos, **los 36 verificados** por un revisor adversarial que reabrió el código e intentó
tumbarlos. Los dos críticos pasaron además por un segundo escéptico. Es el área con la evidencia
más sólida de toda la auditoría.

## Resumen

M.E.T.A.S. habla con la nube por unas 70 funciones RPC `security definer` sobre 21 tablas, todas
con RLS activada y sin políticas anónimas. Esa arquitectura es correcta y está bien ejecutada en
lo básico: nada toca las tablas directamente, los PIN se guardan hasheados, el login tiene freno
contra fuerza bruta, el reset por correo vence a los quince minutos y nunca revela si un correo
existe, y la deduplicación por `evento_id` hace que un reintento tras un corte no duplique nada.
El historial de git está limpio: cero claves `service_role`, cero JWT, cero contraseñas.

Lo que está mal es estructural, y se resume en tres frases.

**Cualquier persona en internet puede inventar notas a nombre de cualquier maestro.** La función
que recibe los resultados de los alumnos no pide cuenta, ni código de aula válido, ni tiene tope
de velocidad: acepta 500 filas por llamada con el nombre del niño y la nota que se quiera. Y no
existe ninguna función para borrar una fila. Es el hallazgo más grave del informe entero.

**El maestro con dos aparatos pierde trabajo hoy, en silencio.** Todo el aula (los doce grupos,
su asistencia, sus notas, las identidades y los teléfonos de las familias) viaja como un único
texto que se sobrescribe entero, y gana el que tenga el reloj más adelantado. Está reproducido:
la asistencia marcada en el teléfono y la nota puesta en la computadora no se fusionan, la
segunda borra a la primera, y el botón de recuperar no aparece.

**Nada de esto impide usar la plataforma hoy con pocos maestros; todo impide venderla.** No
existe la escuela como entidad, ni cuenta de alumno, ni sesión revocable, ni respaldo, ni
política de retención, ni aviso de privacidad. Un colegio que pregunte dónde están los datos de
sus alumnos, quién los respalda y cómo se borran al final del año no tiene respuesta.

## Lo crítico

### Cualquiera puede inyectar notas falsas, y no se pueden borrar

`T3-03 + T4-01` · crítica · error · esfuerzo días · impacto educativo 5/5 · comercial 5/5

`metas_guardar(filas)` se ejecuta con la clave pública y acepta `alumno`, `docente`, `grado` y
`nota` como texto libre, hasta 500 filas por llamada. No pasa por `_metas_docente_ok` ni por
`metas_rate_ok`. Empareja al maestro por el **texto** de su nombre, con `like '%…%'`, así que
basta que el campo lo contenga. Y `metas_aula_resolver` devuelve el nombre exacto del maestro a
partir de un código de cinco letras, sin freno alguno, de modo que los dos caminos se refuerzan.

Las filas inventadas aparecen en «Mis alumnos en la nube», en Estadísticas, y de ahí salen los
informes que firma la familia. En ningún archivo SQL existe un `delete from resultados`: la fila
falsa es permanente. La misma puerta sirve para llenar los 500 MB del plan gratuito con basura.

- Evidencia: `SUPABASE-AULA.sql:101-135` (sin cuenta, sin freno, `grant execute … to anon`),
  `SUPABASE-DOCENTES-V2.sql:344-383` (el emparejamiento por `like`),
  `SUPABASE-AULA.sql:83-100` (`metas_aula_resolver` sin freno),
  `js/metas-supabase.js:112-126`. Además `SUPABASE-FASE1.md` dejó una política
  `resultados_insertar … with check (true)` que ningún archivo posterior elimina.
- Precisión del revisor: las notas oficiales del SACE no salen de esta tabla, así que una fila
  falsa no cambia el expediente administrativo. Sí entra en el informe impreso que firma la
  madre. Se mantiene crítica por la combinación de falsificación, relleno de la cuota gratuita e
  imposibilidad de borrar.
- Qué hacer: convertir el código de aula en credencial. `metas_aula_entrar(codigo)` devuelve un
  token revocable ligado al docente; `metas_guardar` lo exige y escribe el código del maestro
  resuelto en el servidor, ignorando el texto libre. Eliminar la política heredada. Pasar por
  `metas_rate_ok` con tope por aula y día. Y añadir `metas_resultados_borrar` para que el maestro
  pueda quitar filas, que además es un derecho de supresión.

### Con dos aparatos, una edición se pierde y el respaldo es inalcanzable

`T3-04 + T9-01` · crítica · riesgo · esfuerzo días · impacto educativo 4/5 · comercial 4/5

`METAS_ADMIN_V1` guarda los doce grupos, su asistencia, notas, colectas, bitácora y lecturas en
un único texto, y se sincroniza como **una sola fila** con versión igual a `Date.now()` del
aparato. No hay fusión por grupo ni por celda. Si el teléfono marca asistencia del 6º-1 y la
computadora pone una nota en el 6º-2, la copia que llegue segunda pisa entera a la otra. La
guarda anti-pérdida solo actúa si la copia entrante pesa menos de la mitad, cosa que no ocurre
entre dos copias casi iguales. Y la versión depende del reloj de cada teléfono: uno adelantado
gana siempre.

- Evidencia: `js/metas-docente-sync.js:40-49` (una sola llave), `:199-235` (el pull pisa),
  `:150-170` (toda edición local se re-estampa con la hora actual),
  `SUPABASE-DOCENTE-ESTADO.sql:73`. Reproducido con dos contextos de navegador: la nota de la
  computadora quedó pisada, `botonRecuperarVisible: false`.
- Precisión del revisor: la copia pisada **sí** se guarda en `METAS_AULA_RESPALDO_V1`. Lo que
  falla es que «Recuperar» solo se ofrece si el aula está vacía (`:668-687`), así que la copia
  existe y el maestro no puede alcanzarla. Y recuperarla intercambiaría la pérdida, porque
  devuelve el blob viejo completo. La papelera del servidor nunca se llena al pisar por versión.
- Qué hacer: partir la llave por grupo (`METAS_ADMIN_V1/G:<id>`) y, dentro del grupo,
  sincronizar por entidad con marca propia: asistencia por fecha, nota por parcial y materia y
  alumno, colecta por identificador. Gana la celda más nueva, no el documento entero. Usar la
  hora del servidor como versión, no la del teléfono. Guardar siempre la versión pisada y
  ofrecer «Recuperar» aunque el aula tenga datos.

## Autenticación

### La contraseña del maestro se guarda y se envía en claro, y no hay sesión que revocar

`T3-01 + T4-02` · alta · riesgo · esfuerzo días · impacto educativo 3/5 · comercial 5/5

No existe el concepto de sesión. `METAS_DOCENTE_V1` guarda la contraseña tal cual y el
sincronizador la manda en el cuerpo de cada RPC: se midieron nueve envíos en cuatro segundos
después de entrar. La única revocación posible es cambiar la contraseña, lo que cierra todos los
aparatos del maestro a la vez.

El revisor bajó esto de crítica a alta con dos argumentos justos: el transporte va por HTTPS, y
un teléfono perdido entrega igual una sesión que una contraseña. Lo que de verdad cuesta es que
esa contraseña es la que el maestro reutiliza en su correo, y que no hay forma de cerrar un
aparato perdido. El código `PROF-XXXXXXXXXX` es un secreto de diez caracteres generado en el
servidor y nunca mostrado, así que la fuerza bruta contra él no es practicable.

- Evidencia: `js/app.js:1397`, `js/metas-docente-sync.js:80-86` y `:197-223`,
  `consulta-nube.html:203`. Ninguna tabla de sesiones en los 21 archivos SQL.
- Qué hacer: `metas_entrar_docente_v2` devuelve un token opaco del que solo se guarda el hash, en
  una tabla `docente_sesiones` con aparato, último uso y vencimiento. `_metas_docente_ok` valida
  el token en lugar de la contraseña: es el único punto que hay que tocar del lado servidor.
  Añadir «cerrar sesión en todos mis equipos». El cliente deja de guardar la contraseña.

### El hash es rápido y el formato viejo sin sal se acepta para siempre

`T3-02` · media · riesgo · esfuerzo horas

Se guarda `sha256(clave || codigo)`. El código actúa de sal, pero SHA-256 no tiene factor de
coste: una fuga de la tabla permite probar miles de millones de candidatos por segundo contra
contraseñas de mínimo seis caracteres, que es lo que la propia pantalla pide («elige una
contraseña fácil de recordar»). El login acepta además el formato heredado sin sal y no lo
reescribe al acertar.

El revisor lo bajó a media: solo hace daño después de una fuga, y sin fuga el freno de cinco
intentos por diez minutos hace irrelevante la velocidad del hash. Corrigió también que el formato
viejo sí se reescribe al cambiar contraseña o al usar el reset; solo la cuenta que nunca cambia
su contraseña se queda sin sal.

- Qué hacer: `crypt(clave, gen_salt('bf', 10))` con pgcrypto, que ya está instalada, y reescritura
  transparente en el login. Subir el mínimo a ocho caracteres, en el servidor y en las cuatro
  validaciones del cliente (`js/app.js:1790, 1873, 1924, 2839`).

### El freno de login deja fuera al dueño de la cuenta

`T3-10` · media · riesgo · esfuerzo horas

El freno cuenta fallos **por correo**, no por IP ni por la pareja. Un alumno que conozca el correo
del maestro lo deja sin entrar indefinidamente repitiendo cinco intentos cada diez minutos desde
el aula. Y el alta responde `motivo: 'correo'` o `'nombre'` cuando ya existen, lo que permite
enumerar qué maestros están registrados, en contradicción con la regla que el propio proyecto se
puso para el reset. Como el nombre completo es una llave única global, la respuesta `'nombre'`
confirma con certeza que ese maestro existe.

- Qué hacer: frenar por la pareja (IP, correo) con ventana creciente, y responder un motivo
  genérico en el alta, mandando la pista precisa por correo al dueño.

### Dos sistemas de autenticación conviven, y uno lleva a una puerta muerta

`T3-07 + T4-11` · media · eliminar · esfuerzo horas

La Fase 3 montó un panel con Supabase Auth (tabla `maestros`, políticas para `authenticated`).
Después se construyó la cuenta propia, que es la que usa todo el producto, pero las políticas
viejas se siguen redefiniendo y `panel-docente.html` sigue enlazado desde **tres pantallas** que
el maestro ve: la Zona Docente (`js/app.js:1503`, «¿Administrador del proyecto?»),
`consulta-nube.html:71` y `registro.html:72` («Panel docente con cuenta»). Ese panel llama a
`metas_restaurar_codigos`, que no está definida en ningún archivo SQL del repositorio. El maestro
que lo toca acaba en un login que no acepta su cuenta y lee «tu cuenta existe pero aún no está
autorizada».

- Qué hacer: decidir un solo sistema. Si se queda la cuenta propia, borrar `panel-docente.html`,
  el enlace de `app.js:1503`, las políticas `*_maestros_leen` y la tabla `maestros`.

## Seguridad

### XSS almacenado en el Campeonísimo y el Gobierno Escolar

`T4-03` · media · error · esfuerzo horas

Los nombres de grupo, mascota e insignia y la planilla se pintan con `innerHTML` sin escapar. La
sonda ejecutó el payload en cuatro puntos del Campeonísimo y uno del Gobierno Escolar, con
capturas. Como esos datos se sincronizan entre los aparatos del maestro, un texto envenenado en
uno llega a los demás, y el código ejecutado puede leer `METAS_DOCENTE_V1` con la contraseña.

El revisor lo bajó a media porque el punto de inyección no es remoto: esos nombres los escribe
quien maneja Mi aula. Todo lo que sí llega de fuera está escapado, y lo comprobó: los 22 renders
de nombres de alumno en la convocatoria, las filas de la nube en Estadísticas y en
`consulta-nube.html`. El vector realista es un alumno con el teléfono desbloqueado. Contó además
**trece** copias distintas de la función de escape en el proyecto, que es por lo que a estas dos
herramientas no les tocó ninguna.

- Qué hacer: una sola función compartida en `js/metas-esc.js` usada por las trece; `textContent`
  para los nombres; y un caso con `<img onerror>` en cada campo de texto libre dentro de las
  sondas que ya existen.

### Con el enlace público se reescribe la respuesta de otra familia

`T4-04` · media · incompleto · esfuerzo días

La huella de la convocatoria es nombre más grado más sección, predecible para quien conozca el
grupo, y `metas_conv_responder` no pide ningún secreto por familia. El revisor acotó el daño: sí
pasa por el freno de 300 por hora, las familias inventadas salen con nombre en la pantalla del
maestro, que tiene «Quitar» y el cobro contra boleto para corregir, y pisar la respuesta de otra
familia exige saber su nombre exacto y mala fe dirigida. En el Campeonísimo la pregunta se
transmite sin la respuesta correcta y el jurado valida en vivo, así que robar el turno es una
trampa de juego, no una nota falsa.

- Qué hacer: al responder por primera vez, el servidor devuelve un secreto que se guarda con el
  boleto, y solo con él se corrige la fila.

### La clave de familia es corta y el buzón funciona como oráculo

`T3-08 + T4-08` · alta · riesgo · esfuerzo días

La clave es número de lista más una letra de 23 y tres caracteres de 31: 685 193 combinaciones
por alumno. Las tres consultas del padre comparten un freno de 300 por hora **por IP**, sin freno
por código. El revisor encontró el camino barato que el auditor no vio: `metas_buzon_docente`
acepta cien claves por llamada **sin freno alguno**, así que unas 6 900 llamadas recorren todas
las combinaciones de un número de lista y delatan las que tienen mensajes. Con la clave hallada,
las consultas del padre abren notas, faltas y conducta.

- Qué hacer, sin invalidar las tiras ya entregadas: las claves nuevas con seis caracteres de
  sufijo, aceptando las viejas mientras existan; freno por código además del de IP; y exigir
  cuenta docente en `metas_buzon_docente`.

### El freno por IP castiga a las familias reales

`T9-11` · alta · riesgo · esfuerzo horas

El mismo contador de 300 por hora lo comparten todas las consultas del padre, y una sola pregunta
del asistente son tres llamadas más una por cada aviso mostrado. Con cinco avisos vigentes son
ocho llamadas por familia: **37 familias agotan el cupo en una hora**. Las operadoras móviles
hondureñas usan CGNAT, así que cientos de clientes comparten una IP pública sin estar en la misma
escuela.

Lo que el revisor añadió es lo que convierte esto en un problema de confianza: cuando el freno
salta, la función devuelve un conjunto vacío con HTTP 200, y `padres.html` lo interpreta como
«sin datos». La pantalla le dice a la madre «aún no hay notas guardadas para la clave …»,
culpando a la clave o al maestro. No es una falta de explicación: es una explicación falsa. Y el
escenario donde ocurre es la reunión de padres en la que el maestro presenta el asistente por
primera vez, con el wifi de la escuela.

- Qué hacer: frenar por la pareja (IP, clave) con cupo alto por IP y bajo por clave; fusionar las
  tres consultas en una sola y marcar los avisos vistos en lote, de ocho llamadas a dos.

### Sin aviso de privacidad ni consentimiento, con datos de menores

`T4-06` · alta · faltante · esfuerzo semanas

Por alumno se guardan número de identidad, teléfono, encargado y su teléfono, notas, asistencia y
observaciones, en `localStorage` y replicados en la nube como texto plano. No hay aviso de
privacidad, política de retención ni consentimiento en ninguna pantalla: cero coincidencias en
la portada, `padres.html`, `salida.html` y `buzon.html`. Existe un candado con PIN para Mi aula,
pero es una puerta de interfaz: los datos siguen en claro debajo.

Honduras no tiene ley general de datos personales vigente, pero el Código de la Niñez protege la
intimidad del menor, y cualquier colegio o Dirección Distrital lo pedirá antes de adoptar la
plataforma.

- Qué hacer: aviso y pantalla de consentimiento con versión y fecha; no pedir el número de
  identidad salvo que haga falta; cifrar el blob con una clave derivada del PIN antes de
  escribirlo; botón de borrado por familia y al cierre del año.

### Sin CSP ni SRI, y el service worker cachea errores

`T4-09` y `T4-10` · baja · esfuerzo horas

Three.js y MathJax se cargan de CDN sin `integrity`. El revisor acotó bien el riesgo: una copia
envenenada no dura «indefinidamente» porque el service worker borra las cachés viejas en cada
despliegue, y un intermediario en la red del aula no puede alterar un archivo servido por HTTPS
sin romper TLS. El único vector real es un compromiso del CDN, que SRI sí cubre. Una CSP en
`<meta>` tendría que llevar `unsafe-inline` porque todo el JavaScript del proyecto es inline, así
que apenas mitigaría el XSS. Lo que sí vale, y es de horas: vendorizar Three.js y MathJax como ya
se hizo con Font Awesome, lo que además mejora el funcionamiento sin internet.

Aparte, el service worker hace `cache.put` sin mirar `response.ok`, así que un error transitorio
queda guardado y se sirve sin conexión en lugar de la versión buena.

### El override de la nube en localStorage

`T4-12` · baja · eliminar · esfuerzo horas

Catorce archivos leen de `localStorage` la URL y la clave de Supabase, «para que otro maestro
apunte a su propio proyecto». Nadie lo usa. Quien pueda escribir esas dos llaves redirige a un
servidor ajeno los resultados, el correo y la contraseña del maestro y el espejo del aula, de
forma persistente y muda, sobreviviendo incluso a un cambio de contraseña.

## Escalabilidad

Los números vienen con supuestos declarados y fueron corregidos por el revisor donde hacía falta.

| qué | medida | efecto |
|---|---|---|
| Espejo del maestro, 2 grupos | 101 KB cada 20 s | 2 a 4 MB/hora comprimido |
| Espejo del maestro, 12 grupos | 604 KB cada 20 s | 10 a 20 MB/hora comprimido |
| Portada del alumno | 3,23 MB en 39 peticiones | 1,19 MB comprimida |
| De eso, código solo del maestro | más de 1,6 MB | corpus de lectura: 980 KB |
| Despliegues medidos en agosto | 37 en 16 días | 2,3 al día |
| Consulta del maestro | `limit 2000`, sin paginar | PostgREST corta a 1 000 |

### El maestro baja su estado completo cada veinte segundos

`T9-02` · alta · sobrediseño · esfuerzo días

El sondeo es cada 20 segundos mientras la pestaña está visible, y la función devuelve todas las
filas con su contenido entero: no hay «desde qué versión», ni ETag, ni condicional. Con el plan
gratuito de Supabase el egreso lo agotan entre 3 y 25 maestros. El revisor corrigió el titular
del auditor: las cifras sin comprimir exageran, porque Supabase sirve detrás de Cloudflare con
gzip y un JSON de asistencias repetidas comprime entre cinco y diez veces.

- Qué hacer, y es barato: que la función acepte `{k: version}` y devuelva solo lo que cambió, o
  incluso solo `(k, version)` y que el cliente baje el contenido únicamente si difiere. Subir el
  intervalo a dos o cinco minutos y disparar por eventos, no por reloj.

### Cada despliegue obliga a todos a bajarlo todo

`T9-03` · alta · riesgo · esfuerzo días

La normativa obliga a subir `?v=NN` en todos los archivos y `CACHE_NAME` en cada cambio, así que
corregir una errata cuesta una descarga completa a cada usuario. A 2,3 despliegues diarios y
1 000 alumnos activos, son unos 108 GB al mes: el techo blando de GitHub Pages se toca alrededor
de 900 alumnos diarios. Con 30 000 alumnos serían unos 3 TB mensuales, imposible en Pages, cuyos
términos además excluyen servicios comerciales y no ofrecen SLA.

El revisor corrigió dos evidencias falsas del auditor: `.assetsignore` sí existe y Cloudflare no
publica `node_modules` ni `_dev`; y en Pages, sin `.nojekyll`, Jekyll ya excluye los directorios
con guion bajo. Lo que sí queda publicado es `www/`, 55 MB con una copia vieja de la aplicación
accesible en `/www/index.html`.

- Qué hacer: versionar por archivo con hash de contenido, de modo que un cambio en una misión no
  invalide el catálogo ni el corpus de lectura. Un guion de treinta líneas. Con eso, una visita
  sin cambios pasa de 39 peticiones a una.

### La portada del alumno carga las herramientas del maestro

`T9-04` · alta · sobrediseño · esfuerzo días

Más de la mitad del peso de la portada es código que el alumno nunca ejecuta: el corpus de
lectura del maestro (980 KB), Mi aula (340 KB), la convocatoria (182 KB), el Campeonísimo, las
estadísticas, el plan de acción y html2canvas. El revisor apuntó el matiz que hay que respetar:
`js/app.js` usa tres funciones de Mi aula, así que ese archivo necesita que primero se saquen
esas utilidades a un módulo pequeño; los demás se pueden cargar al entrar a la Zona Docente sin
tocar nada más.

- Objetivo medible: portada del alumno por debajo de 1 MB y de quince peticiones, vigilado por una
  sonda.

### La consulta del maestro se recorta en silencio

`T9-05` · alta · incompleto · esfuerzo días

Las funciones devuelven `limit 2000` y PostgREST corta a 1 000 por defecto; el cliente nunca pide
páginas ni avisa del recorte. Un grupo de 43 alumnos con veinte misiones al año produce unas
1 720 filas. El revisor señaló que es **más grave** de lo escrito: esa misma consulta alimenta
Estadísticas, de donde sale el informe que se imprime y firma la familia. Un maestro de tres
grupos imprime a mitad de año informes sin las evaluaciones del primer parcial, y nada se lo dice.

### El service worker espera a la red aunque tenga la copia

`T9-08` · alta · error · esfuerzo horas

Para todo lo propio se pide siempre a la red y solo se cae a la caché si la red **falla**. Con
señal mala (la que no falla pero no contesta) cada uno de los 39 archivos espera el tiempo de
espera del navegador antes de servirse. La promesa de funcionar sin internet se cumple cuando no
hay red, no cuando la red está mala, que es el caso normal del aula. El revisor lo subió a alta:
una aplicación que abre en dos segundos sin señal y se cuelga con una raya es exactamente el
momento en que el usuario la abandona.

- Qué hacer: los archivos con versión en la URL son inmutables, así que se sirven desde la caché;
  para el HTML, una carrera de tres o cuatro segundos contra la red.

### Riesgos de plataforma

- **El proyecto gratuito se pausa a los siete días sin tráfico** (`T9-09`, media). Las vacaciones
  escolares hondureñas duran ocho o diez semanas. Un solo maestro que abra la aplicación lo
  evita, así que el riesgo es probabilístico, pero el arreglo cuesta una acción programada
  semanal que llame a una función trivial.
- **El Campeonísimo en vivo sondea cada dos segundos** desde cada teléfono (`T9-10`, media). El
  revisor acotó: la pantalla se detiene si la pestaña se oculta, así que las 270 llamadas por
  minuto son el pico de una pregunta, no la media. La solución mínima es una columna de versión.
- **El plan gratuito da para unos 15 000 alumnos-año** (`T9-07`, media), con la salvedad de que
  el tamaño por fila es estimado y puede variar la mitad en cualquier dirección.
- **El maestro de doce grupos se acerca al tope de `localStorage`** (`T9-06`, media). El revisor
  desinfló el cálculo: la semilla asumía nueve materias en los doce grupos, pero un maestro con
  tantos grupos es de secundaria y dicta una o dos. El quiebre está más allá de doce grupos en
  uso realista. Lo que sí queda y merece arreglo: cuando el guardado falla se traga el error en
  silencio, y la cola de resultados se recorta sola tirando las 200 filas más viejas.

## Deuda de esquema

### No hay fuente de verdad del esquema

`T3-05 + T4-07` · alta · deuda · esfuerzo días

Veintiún archivos SQL que se pegan a mano, sin migraciones numeradas ni tabla de versiones
aplicadas ni volcado del esquema vigente. `metas_guardar_plan` está definida en cinco archivos
con dos firmas distintas; `metas_consultar_plan_padre`, en cinco. Solo dos archivos avisan de que
están superados. El proyecto **ya sufrió esto**: `PLAN-FECHA-DEDUP.sql` nace porque otro archivo
recreó una función sin dos columnas y las subidas perdieron la fecha durante días, y
`SEGURIDAD-RLS.sql` existe porque Supabase avisó por correo de una tabla sin RLS que el
repositorio no puede identificar.

Lo peligroso es la combinación con la normativa del proyecto, que anima a volver a pegar los
archivos completos porque «son idempotentes»: como Postgres sobrecarga por firma, re-pegar un
archivo viejo deja vivas **las dos versiones**, y una de ellas no verifica al maestro. El revisor
añadió un caso más: re-pegar `SUPABASE-DOCENTES.sql` después de la versión 2 degradaría cada
cambio de contraseña al formato sin sal, sin que nada avise.

- Qué hacer: migraciones numeradas aplicadas desde el repositorio, un `schema.sql` versionado
  generado con `pg_dump --schema-only` como única verdad, y los archivos actuales a
  `_dev/sql-historico/` con cabecera de obsoleto.

### Funciones heredadas nunca retiradas

`T3-06` · alta · eliminar · esfuerzo horas

Ningún archivo hace `drop` de las funciones de fases anteriores, así que salvo borrado manual
siguen ejecutables con la clave pública: `metas_consultar(p_clave)` devuelve **todos** los
resultados del proyecto a quien conozca una clave única que el script trae por defecto como
`'CAMBIA-ESTA-CLAVE'`; `metas_suscribir_docente` crea cuentas con código elegido por el cliente y
sin correo. El revisor apuntó la consecuencia concreta de esta última: como el nombre normalizado
es único, sirve para **bloquearle el registro al maestro real** con ese nombre.

La severidad real oscila entre crítica y baja según algo que el repositorio no puede responder:
si esas funciones siguen vivas y si la clave por defecto se cambió. Eso se resuelve en dos
minutos con una consulta contra la base.

## Qué falta

- **La escuela como entidad** (`T3-11`, alta, meses). Hoy `docentes.escuela` es texto que cada
  maestro escribe, y **es la frontera de seguridad**: un docente que escriba «Escuela República
  de Honduras» sin municipio entra en la vista de cualquier director con ese nombre de escuela.
  No hay tabla de escuelas, ni afiliación aprobada, ni año lectivo, ni cuenta de alumno, ni
  multi-rol. Sin eso no se puede firmar con una institución ni trasladar a un alumno de grado con
  su historial.
- **Respaldos y retención** (`T3-12`, alta, días). Plan gratuito sin copias ni recuperación a un
  punto en el tiempo, ningún procedimiento de respaldo en el repositorio, ninguna función que
  borre por alumno o por maestro que cierra su cuenta, y `metas_cerrar_familias` no toca
  resultados ni progreso. La única exportación es un CSV manual por maestro.
- **Emparejar alumno y maestro por identificador** (`T3-09`, alta, días). Hoy es por nombre libre
  con `like '%…%'`: el alumno que escribe «Profe Carlos» desaparece del informe que firma su
  madre. `resultados` ni siquiera tiene una columna con el código del docente por la que
  consultar con igualdad e índice.

## Qué sobra

| qué | por qué | esfuerzo |
|---|---|---|
| `panel-docente.html`, la tabla `maestros` y sus políticas | segundo sistema de login, enlazado desde tres pantallas, que llama a una función inexistente | horas |
| El override `METAS_SB_URL` / `METAS_SB_KEY` | nadie lo usa y convierte cualquier XSS en redirección persistente de la nube | horas |
| Las funciones heredadas de la Fase 1 | volcado completo de resultados con una clave por defecto | horas |
| Doce de las trece copias de la función de escape | por eso a dos herramientas no les tocó ninguna | horas |
| `www/` del árbol publicado | 55 MB con una segunda aplicación vieja accesible en `/www/` | horas |

## Cobertura y límites

El proxy del entorno bloquea `supabase.co`, así que **no se pudo comprobar el estado real de la
base**: todo lo que dice este capítulo sobre las funciones desplegadas se infiere de los archivos
SQL del repositorio. Tres cosas concretas quedan sin verificar y se resuelven en minutos con
acceso al panel de Supabase:

```sql
-- ¿Qué funciones existen hoy y con qué firmas? (¿quedan sobrecargas sin cuenta?)
select proname, pg_get_function_identity_arguments(oid)
  from pg_proc where pronamespace = 'public'::regnamespace order by 1;

-- ¿Sigue viva la política que permite insertar resultados a cualquiera?
select policyname from pg_policies where tablename = 'resultados';

-- ¿Queda alguna tabla sin RLS?
select relname from pg_class where relrowsecurity = false and relnamespace = 'public'::regnamespace;
```

Tampoco se midió el comportamiento de Supabase bajo carga real: las cifras de escalabilidad son
cálculos con supuestos declarados, no mediciones en producción.
