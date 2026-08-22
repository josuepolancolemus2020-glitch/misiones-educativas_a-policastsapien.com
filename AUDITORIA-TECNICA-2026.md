# Auditoría Técnica de M.E.T.A.S. — 22 de agosto de 2026

> Plataforma educativa (sitio estático HTML/CSS/JS + Supabase RLS/RPC, PWA) con datos de menores de escuelas de Honduras. Producción: metas.policastsapien.com

**Versión navegable (recomendada):** informe interactivo con filtros por severidad, roadmap y checklist en el Artifact publicado. Este `.md` es la copia versionada en el repositorio.

## Balance

**68 hallazgos verificados** — 0 refutados por la verificación adversarial, 9 con severidad ajustada.

| 🔴 Crítico | 🟠 Alto | 🟡 Medio | ⚪ Bajo |
|:-:|:-:|:-:|:-:|
| 0 | 3 | 35 | 30 |

## Resumen ejecutivo

M.E.T.A.S. es un sitio **100% estático** (HTML/CSS/JS planos, sin framework ni build) servido por Cloudflare Workers con GitHub Pages de respaldo, respaldado por **Supabase** (Postgres con RLS y funciones RPC `SECURITY DEFINER`). La clave `anon/publishable` es pública por diseño, así que **la única frontera de seguridad real son las políticas RLS y las funciones RPC**. Esa capa está, en conjunto, **bien pensada**: todas las tablas con RLS activada y sin políticas anónimas, sin `USING (true)` ni inyección SQL, login con freno anti-fuerza-bruta, reset por correo correctamente diseñado, y consultas del padre tras un candado de velocidad. No se encontró ninguna `service_role key` ni contraseña real filtrada.

El patrón dominante no es el agujero abierto sino **la contención media**: mitigaciones reales que se pueden saltar. Los tres **ALTO**: (1) sobrecargas RPC de escritura *sin autenticación* —incluida una de **borrado masivo** de datos de menores— que el blindaje elimina pero que *reviven* si se re-corre un archivo SQL que el propio proyecto invita a re-correr; (2) la **clave de familia**, identidad permanente del niño impresa en papel, con entropía modesta protegida solo por un rate-limit por-IP evadible; (3) el estado del aula se sincroniza como **un solo blob con last-write-wins**, y dos equipos del mismo maestro pueden pisarse las notas en silencio. Se suman debilidades de credenciales (SHA-256 en vez de bcrypt; contraseña docente en claro en `localStorage`) y de privacidad.

El veredicto es de **plataforma madura con deuda de endurecimiento concreta y acotada**, no de reescritura. Todo se corrige *dentro del mismo stack*. En operaciones, las prioridades son **respaldo de la base de datos** (hoy solo se respalda el código) y un **CI mínimo** que corra las sondas `_dev/verifica-*.js` que ya existen.

## ⚠️ Acción inmediata — comprobar en tu base de datos HOY

El hallazgo #1 es explotable o no **según el orden** en que corriste por última vez los archivos SQL — algo que solo se ve desde tu proyecto Supabase. Corre en el **SQL Editor**:

```sql
select proname, pg_get_function_identity_arguments(oid) as args
from pg_proc
where proname in ('metas_guardar_plan','metas_guardar_admin','metas_guardar_avisos','metas_cerrar_familias')
order by proname;
```

Si para cualquiera de esas cuatro aparece una fila cuyos `args` son **solo `jsonb`** (sin `text, text` delante), la versión **sin contraseña** está viva y concedida a `anon`: cualquiera con la clave pública puede escribir o —con `metas_cerrar_familias`— **borrar en lote** datos de las familias. Corrección en el hallazgo #1.

## Top 10 hallazgos por riesgo

1. **[ALTO]** Escritores SIN autenticación (anon) coexisten y pueden resucitarse al re-correr archivos idempotentes — _Seguridad · Base de datos (RLS + RPC)_ · `SUPABASE-PLAN-PARCIAL.sql:15-64`
2. **[ALTO]** La clave de familia —identidad permanente del niño e impresa en papel— tiene entropía modesta y su único freno es un rate-limit por-IP evadible — _Privacidad · Datos de menores_ · `js/tools/registros-admin.js:212-236, 54`
3. **[ALTO]** El aula entera se sincroniza como un solo blob con last-write-wins: ediciones concurrentes entre equipos se pierden en silencio — _Arquitectura y código_ · `js/metas-docente-sync.js:38-50, 243-252`
4. **[MEDIO]** Los escritores endurecidos no atan las filas al que llama; el registro docente es abierto — _Seguridad · Base de datos (RLS + RPC)_ · `SUPABASE-SEGURIDAD.sql:82-132 y 198-249`
5. **[MEDIO]** metas_buzon_docente lee mensajes privados de familias sin autenticación ni freno de velocidad — _Seguridad · Base de datos (RLS + RPC)_ · `SUPABASE-FASE3.sql:267-287`
6. **[MEDIO]** Contraseñas de docentes con SHA-256 rápido (no bcrypt/argon2); hashes v1 sin sal — _Seguridad · Base de datos (RLS + RPC)_ · `SUPABASE-DOCENTES-V2.sql:177,259-260,295-296`
7. **[MEDIO]** La contraseña del maestro (que abre notas, conducta, pagos y claves de familia de todos sus alumnos) es forzable sin candado por las RPC de datos, saltándose el bloqueo del login — _Privacidad · Datos de menores_ · `SUPABASE-DOCENTES-V2.sql:344-384, 288-301`
8. **[MEDIO]** Los nombres de niños y teléfonos de familias de toda la escuela se leen con un PIN de 4 caracteres sin candado de velocidad — _Privacidad · Datos de menores_ · `SUPABASE-CONVOCATORIA.sql:82, 205-221`
9. **[MEDIO]** La contraseña del docente se guarda en claro en localStorage y se reenvía en cada llamada — _Seguridad · Frontend_ · `js/app.js:1323, js/app.js:1808`
10. **[MEDIO]** El sitio no envía ninguna cabecera de seguridad (sin CSP, X-Frame-Options ni Referrer-Policy) — _Seguridad · Frontend_ · `wrangler.jsonc:9-13 (assets sin cabeceras)`

## Roadmap de corrección

**Fase 0 · Contención (esta semana)** — cerrar lo explotable con la clave pública y lo que expone datos de menores: consolidar el estado final del SQL para que ninguna re-ejecución reabra una función anónima (dejar solo firmas `(text,text,jsonb)`); poner candado de velocidad en `metas_buzon_docente`, `metas_consultar_docente/_progreso`, `metas_conv_respuestas` y `metas_guardar`; añadir cabeceras de seguridad con un `_headers` de Cloudflare (CSP, X-Frame-Options, Referrer-Policy, HSTS).

**Fase 1 · Credenciales e identidad (este mes)** — migrar contraseñas a **bcrypt** (`crypt()`+`gen_salt('bf')`) con migración perezosa y caducar el formato v1 sin sal; atar cada escritura al dueño de los datos y cerrar/validar el auto-registro docente; subir entropía de la clave de familia y endurecer el rate-limit contra spoofing de `x-forwarded-for`; dejar de guardar la contraseña docente en `localStorage`.

**Fase 2 · Integridad y resiliencia (este mes)** — sync por deltas / con detección de conflicto en vez de blob last-write-wins, con tope de tamaño; poda del outbox y de `resultados` sin descartar en silencio, avisando al truncar a 2000; **respaldos automáticos de la base de datos**; telemetría mínima de errores.

**Fase 3 · Higiene (backlog)** — `.gitignore` y sacar `node_modules/`/`www/` del árbol; CI que corra las sondas y automatice el sellado `?v=NN`/`CACHE_NAME`; centralizar la config de Supabase (hoy en 14 archivos), deduplicar `html2canvas` (67 copias) y el motor de Formas (66); accesibilidad y carga diferida por rol.

## Hallazgos completos por área

### 1. Seguridad · Base de datos (RLS + RPC)

_La capa está, en general, bien pensada: TODAS las tablas activan RLS y ninguna tiene políticas anónimas ni `USING (true)` (SEGURIDAD-RLS.sql barre las que falten); el acceso pasa siempre por funciones SECURITY DEFINER con `set search_path = public`, sin EXECUTE dinámico concatenando entrada del usuario (no hay inyección SQL). La autenticación docente V2 (correo+contraseña, freno anti-fuerza-bruta por correo), los roles/permisos (director/rector/admin, con lista blanca campo a campo y emparejamiento escuela+municipio) y el aislamiento del padre por conteos en la convocatoria están sólidamente construidos. Los problemas reales son: (1) los escritores 1-argumento SIN autenticación (`metas_guardar_plan/admin/avisos`, `metas_cerrar_familias`) siguen presentes en varios archivos y el flujo «re-correr archivos idempotentes» puede resucitarlos como sobrecarga convivente; (2) incluso los escritores endurecidos solo comprueban que quien llama es UN docente válido, no el dueño de las filas, y el registro es abierto; (3) `metas_buzon_docente` lee mensajes privados de familias sin autenticación ni freno; (4) las contraseñas usan SHA-256 rápido en vez de bcrypt; (5) el expediente del menor se sirve con una clave-portadora de entropía media y freno solo por IP. Las políticas SELECT del panel docente referencian `auth.uid()`/`public.maestros` (Supabase Auth), que la app no usa, por lo que son inertes (no abren nada; el acceso real es por RPC)._

#### 🟠 ALTO — control-de-acceso: Escritores SIN autenticación (anon) coexisten y pueden resucitarse al re-correr archivos idempotentes

- **Ubicación:** `SUPABASE-PLAN-PARCIAL.sql:15-64; SUPABASE-PLAN-FECHA.sql:17-68; SUPABASE-REGISTROS-ADMIN.sql:44-93; SUPABASE-AVISOS.sql:57-109; SUPABASE-FASE3.sql:27-115` _(verificado: confirmado)_
- **Problema:** Varios archivos definen las funciones de escritura en su versión de UN argumento SIN comprobación de identidad (no llaman a _metas_docente_ok) y las conceden a anon: metas_guardar_plan(jsonb), metas_guardar_admin(jsonb), metas_guardar_avisos(jsonb) y metas_cerrar_familias(jsonb). El endurecimiento (SUPABASE-SEGURIDAD.sql y SUPABASE-PLAN-FECHA-DEDUP.sql) las reemplaza por versiones de 3 argumentos con contraseña y hace 'drop function ... (jsonb)'. Pero Postgres distingue por firma: como el CLAUDE.md ordena 're-correr los archivos idempotentes' cuando hace falta (p. ej. AVISOS avisa 'si ya lo corriste no lo vuelvas a correr'), volver a pegar PLAN-PARCIAL/PLAN-FECHA/REGISTROS-ADMIN/AVISOS/FASE3 después del blindaje RECREA la sobrecarga anónima, que convive con la endurecida y queda accesible con solo la clave publishable.
- **Impacto:** Con solo la clave anon (pública), cualquiera podría insertar/sobrescribir notas, mensajes del maestro a la familia y registros de asistencia/economía de menores por cualquier clave de familia, o —vía metas_cerrar_familias(jsonb)— BORRAR en lote plan_accion, registro_admin, mensajes_docente, mensajes_padre y aviso_visto de las claves que indique. Manipulación y destrucción de datos académicos de menores sin credencial alguna.
- **Evidencia:**
```
-- SUPABASE-PLAN-PARCIAL.sql
create or replace function public.metas_guardar_plan(filas jsonb)
... (sin _metas_docente_ok) ...
revoke all on function public.metas_guardar_plan(jsonb) from public;
grant execute on function public.metas_guardar_plan(jsonb) to anon, authenticated;

-- SUPABASE-FASE3.sql
create or replace function public.metas_cerrar_familias(p_codigos jsonb)
... delete from public.plan_accion where codigo = any(cods); ...
grant execute on function public.metas_cerrar_familias(jsonb) to anon, authenticated;
```
- **Solución:** Consolidar en UN solo archivo el estado final: eliminar de PLAN-PARCIAL/PLAN-FECHA/REGISTROS-ADMIN/AVISOS/FASE3 las definiciones 1-arg anónimas (o marcarlas 'NO CORRER') y añadir al inicio del blindaje un 'drop function if exists' explícito de TODAS las firmas jsonb, corriéndolo al final. Verificar en vivo con: select proname, pg_get_function_identity_arguments(oid) from pg_proc where proname in ('metas_guardar_plan','metas_guardar_admin','metas_guardar_avisos','metas_cerrar_familias'); no debe quedar ninguna firma sin (text,text,...). Idealmente, que la comprobación de identidad la haga siempre la misma función y que re-correr un archivo viejo no pueda re-otorgar anon.
- **Prioridad:** inmediata

#### 🟡 MEDIO — aislamiento-multi-inquilino: Los escritores endurecidos no atan las filas al que llama; el registro docente es abierto

- **Ubicación:** `SUPABASE-SEGURIDAD.sql:82-132 y 198-249; SUPABASE-DOCENTES-V2.sql:119-202`
- **Problema:** metas_guardar_plan/admin/avisos (versión 3-arg) solo validan que la pareja p_prof+p_clave sea de ALGÚN docente (_metas_docente_ok); después insertan filas con el 'docente', 'codigo', 'alumno', 'nota' y 'mensaje' que vengan en el payload, sin comprobar que esa clave de familia o ese nombre de docente pertenezcan a quien llama. El conflicto es por evento_id, así que un evento_id conocido/adivinado se SOBRESCRIBE. Y como metas_docente_alta_v2 permite que cualquiera (anon) se registre como docente con cualquier correo, la barrera es solo 'ser una cuenta docente', no 'ser el dueño de los datos'.
- **Impacto:** Un usuario que se auto-registre como docente puede escribir/sobrescribir notas y registros de los alumnos de OTRO maestro (por cualquier clave de familia), o inyectar mensajes 'del maestro' hacia las familias bajo el nombre de otro docente. La contraseña es un tope de velocidad, no una autorización por inquilino.
- **Evidencia:**
```
if not public._metas_docente_ok(p_prof, p_clave) then return -1; end if;
... insert into public.plan_accion (evento_id, codigo, ... docente, ...)
   values ( f->>'evento_id', ... , f->>'docente', ... )
 on conflict (evento_id) do update set ... docente = excluded.docente, mensaje = excluded.mensaje ...;
```
- **Solución:** Atar la escritura al que llama: resolver el código interno del docente autenticado y forzar que 'docente' se guarde con SU nombre (como ya hace metas_guardar con codigo_aula → nombre exacto), y/o verificar que la clave de familia pertenezca a un grupo de ese docente (p. ej. contra docente_estado/METAS_ADMIN_V1). Como mínimo, rechazar filas cuyo 'docente' normalizado no coincida con el nombre del que autentica.
- **Prioridad:** esta semana

#### 🟡 MEDIO — exposicion-de-datos: metas_buzon_docente lee mensajes privados de familias sin autenticación ni freno de velocidad

- **Ubicación:** `SUPABASE-FASE3.sql:267-287`
- **Problema:** metas_buzon_docente(p_codigos jsonb) está concedida a anon, NO llama a _metas_docente_ok (a diferencia de las funciones del espejo docente) y tampoco llama a metas_rate_ok (a diferencia de las otras consultas del padre). Acepta hasta 100 claves de familia por llamada y devuelve el texto de los mensajes que las familias enviaron al maestro (tabla mensajes_padre). El maestro que la usa SÍ está autenticado en su Zona Docente, así que podría exigir contraseña.
- **Impacto:** Cualquiera con la clave anon puede leer mensajes privados de padres (posible información sensible de la familia) sondeando claves de familia en lotes de 100, sin ningún límite de velocidad —es la lectura menos protegida de todo el sistema del padre.
- **Evidencia:**
```
create or replace function public.metas_buzon_docente(p_codigos jsonb)
returns table (codigo text, texto text, creado_en timestamptz)
... begin
  if jsonb_typeof(p_codigos) <> 'array' or jsonb_array_length(p_codigos) > 100 then
    return;
  end if;
  return query select m.codigo, m.texto, m.creado_en from public.mensajes_padre m
  where m.codigo in ( ... ) ...
grant execute on function public.metas_buzon_docente(jsonb) to anon, authenticated;
```
- **Solución:** Convertirla a firma con cuenta docente (p_prof, p_clave, p_codigos) y comprobar _metas_docente_ok antes de leer, como docente_estado_leer; además añadir la guarda metas_rate_ok. El maestro ya está autenticado al abrir Comunicados, así que no rompe el flujo.
- **Prioridad:** esta semana

#### 🟡 MEDIO — criptografia: Contraseñas de docentes con SHA-256 rápido (no bcrypt/argon2); hashes v1 sin sal

- **Ubicación:** `SUPABASE-DOCENTES-V2.sql:177,259-260,295-296; SUPABASE-DOCENTES.sql:46,66`
- **Problema:** Las contraseñas se guardan como 'v2:' || sha256(clave || codigo) —salado con el código interno de 10 caracteres, pero con una función hash de propósito general, rapidísima (miles de millones/seg en GPU)— y el formato viejo v1 es sha256(clave) SIN sal, aún aceptado en login y _metas_docente_ok. El mínimo de contraseña es 6.
- **Impacto:** Si la tabla docentes se expusiera alguna vez (respaldo, error de configuración, otra vulnerabilidad), las contraseñas de 6 caracteres se recuperarían casi al instante; las v1 sin sal, además, son vulnerables a tablas rainbow. Aunque hoy la tabla está tras RLS, es una debilidad de defensa en profundidad para credenciales.
- **Evidencia:**
```
'v2:' || encode(extensions.digest(v_clave || v_cod, 'sha256'), 'hex')
... v_ok := (d.clave_hash = encode(extensions.digest(v_clave, 'sha256'), 'hex'))
     or (d.clave_hash = 'v2:' || encode(extensions.digest(v_clave || d.codigo, 'sha256'), 'hex'));
```
- **Solución:** pgcrypto ya está instalado: usar crypt(clave, gen_salt('bf', 10)) (bcrypt) para guardar y crypt(clave, clave_hash) para verificar. Migrar de forma transparente al próximo login/cambio de clave (si el hash es sha256 y valida, re-guardar en bcrypt). Subir el mínimo de contraseña.
- **Prioridad:** este mes

#### 🟡 MEDIO — control-de-acceso: El expediente del menor se sirve con una clave-portadora de entropía media y freno solo por IP

- **Ubicación:** `SUPABASE-PLAN-FECHA-DEDUP.sql:101-143; SUPABASE-REGISTROS-ADMIN.sql:98-116; js/tools/registros-admin.js:213-236`
- **Problema:** metas_consultar_plan_padre/admin_padre/avisos_padre devuelven nombre del alumno, grado, sección, notas, mensajes del maestro y montos de economía a quien presente la clave de familia (sin PIN, por diseño). Esa clave es 'nº de lista' + sufijo de 4 caracteres generado por adSufijoClave (1 letra de 23 + 3 de 30 ≈ 6,2e5 combinaciones por alumno). La única defensa contra enumeración es metas_rate_ok: 300 consultas por hora POR IP, con ventana que se reinicia cada hora en punto, sin tope global.
- **Impacto:** Un ataque dirigido a un menor conocido (su nº de lista) necesita ~2000 IP-hora; pero un atacante distribuido (botnet) o el crecimiento del catálogo a miles de alumnos elevan la probabilidad de encontrar claves válidas y exponer datos de menores (nombres, notas, mensajes privados del maestro, deudas). El freno por IP no acota a un adversario repartido.
- **Evidencia:**
```
where length(regexp_replace(coalesce(p_codigo,''), '\s', '', 'g')) >= 2
  and p.codigo = upper(regexp_replace(coalesce(p_codigo,''), '\s', '', 'g'))
-- adSufijoClave():
let suf = AD_ID_LETRAS[...]; for (let i=0;i<3;i++) suf += AD_ID_ALFA[...]; // 23 * 30^3
```
- **Solución:** Sin romper el diseño sin-PIN: (a) añadir un tope GLOBAL por ventana además del de por IP; (b) alargar el sufijo de la clave de familia (p. ej. a 6 caracteres) en las claves NUEVAS —sin invalidar las impresas— para subir la entropía; (c) registrar/alertar picos de consultas fallidas. Documentar el riesgo residual.
- **Prioridad:** este mes

#### ⚪ BAJO — fuerza-bruta: El reset de contraseña por correo se apoya solo en 'intentos>=5' por fila (reiniciable) y sin freno por IP

- **Ubicación:** `SUPABASE-RESET-CORREO.sql:34-74`
- **Problema:** metas_reset_confirmar verifica un código de 6 dígitos y limita a 5 intentos por fila, pero NO llama a metas_rate_ok y el límite se reinicia cada vez que se pide un código nuevo (la fila se re-crea). El único freno de la frecuencia de PETICIONES vive en la Edge Function reset-clave (campo 'enviados'), que no está en el repositorio y no se puede auditar aquí.
- **Impacto:** Si la Edge Function no acota bien los reenvíos, un atacante que conozca el correo de un maestro podría pedir códigos repetidos y, en cada uno, gastar 5 intentos contra un espacio de 10^6, acumulando adivinanzas para tomar la cuenta. Riesgo condicionado a un componente no auditable.
- **Evidencia:**
```
if not found or fila.expira < now() or fila.intentos >= 5 then ... 'vencido' end if;
if fila.codigo_hash <> encode(extensions.digest(v_codigo, 'sha256'), 'hex') then
  update public.docente_reset set intentos = intentos + 1 where correo = v_correo;
```
- **Solución:** Añadir metas_rate_ok() al inicio de metas_reset_confirmar; considerar código de 8 dígitos o alfanumérico; confirmar (y documentar en el repo) el tope diario de reenvíos de la Edge Function y un cooldown entre peticiones.
- **Prioridad:** backlog

#### ⚪ BAJO — exposicion-de-datos: metas_conv_ver expone el 'datos' público completo (WhatsApp del maestro y número de arranque) sin PIN

- **Ubicación:** `SUPABASE-CONVOCATORIA.sql:132-148; js/tools/convocatoria.js:211-224`
- **Problema:** metas_conv_ver(codigo) devuelve la columna datos jsonb entera a cualquiera con el código (que circula en grupos de WhatsApp de cientos). convDatosPublicos incluye 'wa' (WhatsApp del maestro) y 'arranque' (el número de relleno con que el maestro evita que la lista arranque en cero). El diseño solo pretende mostrar al padre el TOTAL combinado (nube + arranque), no el arranque crudo.
- **Impacto:** Un padre curioso que lea la respuesta cruda del RPC ve 'arranque: N' y descubre que la lista fue inflada, socavando justo la confianza que la función quiere proteger; y queda expuesto el teléfono del maestro (PII, aunque semi-público en el grupo). No hay fuga de datos de menores.
- **Evidencia:**
```
return { ... maestro: c.maestro || '', wa: String(c.wa || '').replace(/\D/g, ''), ... arranque: Math.max(0, Number(c.arranque) || 0), cerrada: c.cerrada ? '1' : '0' };
```
- **Solución:** No incluir 'arranque' en convDatosPublicos: aplicar el relleno solo en el conteo que devuelve el servidor (sumarlo a 'personas'/'familias' en metas_conv_ver) y no publicarlo como campo. Evaluar si 'wa' debe viajar en datos o entregarse por otra vía.
- **Prioridad:** backlog

#### ⚪ BAJO — integridad-de-datos: Ingesta de resultados y respuestas de convocatoria sin autenticación permite envenenar/inflar datos

- **Ubicación:** `SUPABASE-PAUTA.sql:17-46; SUPABASE-AULA.sql:103-135; SUPABASE-CONVOCATORIA.sql:153-202`
- **Problema:** metas_guardar (resultados de alumnos) acepta de anon hasta 500 filas con 'docente', 'alumno', 'nota', 'xp', 'escuela' arbitrarios sin credencial (por diseño: el alumno no se autentica). metas_conv_responder deja a anon crear respuestas: cada 'huella' distinta es una fila nueva y suma personas al conteo del bus (tope 300/hora por IP).
- **Impacto:** Cualquiera con la clave anon puede inyectar resultados falsos atribuidos a cualquier maestro/alumno (ensuciando 'Mis alumnos en la nube') o cadenas ofensivas en 'alumno'; y un miembro del grupo de WhatsApp puede inflar el conteo de una convocatoria (hasta ~300 falsos/hora) para forzar la contratación de buses de más. El teléfono del maestro es la fuente de verdad y existe 'quitar', lo que reduce el impacto.
- **Evidencia:**
```
insert into public.resultados (evento_id, tipo, mision, forma, nota, base, alumno, ... docente, escuela, ...)
  select f.evento_id, f.tipo, ... f.docente, f.escuela, ... where f.evento_id is not null and f.tipo in (...);
```
- **Solución:** Aceptar el compromiso documentado, pero acotar el daño: validar/normalizar longitudes y caracteres de 'alumno'/'docente', reforzar el freno por IP para metas_conv_responder, y considerar atar la ingesta de resultados al codigo_aula (ya resuelto a nombre exacto) para dificultar la suplantación de maestro.
- **Prioridad:** backlog

### 2. Seguridad · Frontend

_El escape de HTML está sorprendentemente bien resuelto y es consistente: existen funciones de escape dedicadas (esc, _pEsc, adEsc, paEsc, mfEsc, _esc de metas-dialogos) y TODO dato de usuario/nube/localStorage que se pinta con innerHTML pasa por ellas — nombres de alumnos, mensajes del maestro, respuestas de padres, envíos del buzón, listados de dirección, panel-docente y consulta-nube. El nombre de alumno con <img onerror> (el vector clave) se neutraliza en cada punto de render que revisé. toast() usa textContent; linkify() escapa antes de enlazar; _fmt() de los diálogos escapa antes de aplicar negritas. No hay eval, document.write con datos crudos, ni postMessage inseguro. La única excepción de escape es js/tools/campeonismo.js (self-XSS, bajo). Los problemas reales no son de XSS sino de gestión de credenciales y defensa en profundidad: la contraseña del docente se guarda EN CLARO en localStorage y se reenvía en cada RPC; la clave de familia (única barrera de las notas de menores) tiene baja entropía y usa Math.random; y no hay ninguna cabecera de seguridad (CSP, X-Frame-Options). La clave publishable de Supabase NO se reporta como fuga: es pública por diseño y las RPC del padre sí pasan por rate-limit (metas_rate_ok, 300/h/IP), lo que rebaja el riesgo de enumeración de claves._

#### 🟡 MEDIO — credenciales-en-cliente: La contraseña del docente se guarda en claro en localStorage y se reenvía en cada llamada

- **Ubicación:** `js/app.js:1323, js/app.js:1808; consulta-nube.html:203-206; reenvío en js/app.js:1746,2271,2316,2361,2398,2750,2804,2849,2913,2943,2983`
- **Problema:** La cuenta del maestro no usa un token de sesión: guarda el par código+contraseña en texto plano en METAS_DOCENTE_V1 dentro de localStorage y reenvía la contraseña (p_clave) como campo en cada RPC. La plataforma está diseñada para teléfonos COMPARTIDOS (el propio CLAUDE.md habla de 'tres teléfonos prestados' por aula). localStorage es de origen mismo pero persiste indefinidamente y es legible por cualquier script del mismo origen o por quien tome el teléfono desbloqueado y abra la consola o un marcador. Esa contraseña da acceso a las notas de todos sus alumnos y, si el rol es director/rector, a cambiar roles y resetear contraseñas de otros maestros.
- **Impacto:** Un alumno que toma prestado el teléfono del maestro (escenario cotidiano según la propia normativa) puede leer METAS_DOCENTE_V1.clave y suplantar al docente desde cualquier equipo, viendo o alterando datos académicos de menores. El reenvío en texto plano en cada RPC (aunque sea sobre HTTPS) amplía la superficie: cualquier XSS residual exfiltra una credencial reutilizable, no un token revocable.
- **Evidencia:**
```
_docenteSave({ codigo: resp.codigo, clave, nombre, correo, escuela, tipo: _docTipo, telefono,
```
- **Solución:** Que el servidor emita un token de sesión opaco y de vida limitada tras el login (metas_entrar_docente_v2), guardar ese token en vez de la contraseña, y que las RPC lo acepten en lugar de p_clave. Si por el modo offline hay que conservar algo, guardar el token (revocable) y nunca la contraseña. Como mínimo, no persistir 'clave' más allá de la sesión activa.
- **Prioridad:** este mes

#### 🟡 MEDIO — control-de-acceso: La clave de familia (única barrera de las notas del menor) tiene baja entropía y usa Math.random

- **Ubicación:** `js/tools/plan-accion.js:1075-1077; js/tools/registros-admin.js:213-216`
- **Problema:** La clave de familia es la identidad del niño ante la nube y protege sus notas. Su formato es 'número de lista' + sufijo de 4 caracteres. El prefijo NO es secreto: es el número de lista visible (1..45). El sufijo son 4 caracteres de un alfabeto de ~23-31 símbolos generados con Math.floor(Math.random()*...): en registros-admin son 23*31^3 ≈ 6,85x10^5 combinaciones (~20 bits) y en plan-accion 31^4 ≈ 9,2x10^5. Math.random NO es criptográficamente seguro. Así, adivinar la clave de un niño concreto se reduce a fuerza bruta sobre ~20 bits con prefijo conocido.
- **Impacto:** Con el grado/sección (públicos en una escuela) un atacante puede intentar enumerar las claves de un aula y leer las notas y el nombre completo de menores en padres.html/consulta. Riesgo REAL pero acotado por el freno del servidor: metas_rate_ok limita a 300 intentos por IP y hora (SUPABASE-FASE3.sql:147), lo que hace inviable el barrido casual desde una sola IP; por eso MEDIO y no ALTO. La debilidad persiste si el atacante distribuye peticiones entre varias IP.
- **Evidencia:**
```
let suf = AD_ID_LETRAS[Math.floor(Math.random() * AD_ID_LETRAS.length)];
  for (let i = 0; i < 3; i++) suf += AD_ID_ALFA[Math.floor(Math.random() * AD_ID_ALFA.length)];
```
- **Solución:** Generar el sufijo con crypto.getRandomValues en vez de Math.random y alargarlo a 5-6 caracteres (>=30 bits). No cambia el flujo del maestro (la clave se sigue imprimiendo en tiras) pero encarece la enumeración varios órdenes de magnitud. Mantener el freno por IP en el servidor y considerar un tope por-código.
- **Prioridad:** este mes

#### 🟡 MEDIO — cabeceras-http: El sitio no envía ninguna cabecera de seguridad (sin CSP, X-Frame-Options ni Referrer-Policy)

- **Ubicación:** `wrangler.jsonc:9-13 (assets sin cabeceras); no existe archivo _headers; ningún <meta http-equiv> en index.html, padres.html, salida.html, buzon.html, consulta-nube.html`
- **Problema:** El worker de Cloudflare sirve los archivos tal cual sin añadir cabeceras. No hay Content-Security-Policy (nada contiene un XSS residual, p.ej. el de campeonismo o un futuro descuido), no hay X-Frame-Options/frame-ancestors (las páginas se pueden incrustar en un iframe de un tercero → clickjacking sobre la Zona Docente logueada o sobre la pantalla del padre) ni Referrer-Policy.
- **Impacto:** Clickjacking: un atacante enmarca index.html (maestro con sesión) y engaña para pulsar botones de cambio de rol o borrado. Sin CSP, cualquier inyección que se cuele tiene capacidad total (exfiltración de la contraseña en claro del hallazgo anterior). Es defensa en profundidad barata que hoy falta por completo.
- **Evidencia:**
```
"assets": {
    "directory": "./"
  }
```
- **Solución:** Añadir un archivo _headers (Cloudflare) o configurar el worker para emitir: 'Content-Security-Policy: default-src \'self\'; script-src \'self\' \'unsafe-inline\'; connect-src \'self\' https://uljjgrikyigdrkbikcxo.supabase.co; img-src \'self\' data: blob:; frame-ancestors \'none\'', además de 'X-Frame-Options: DENY', 'Referrer-Policy: no-referrer' y 'X-Content-Type-Options: nosniff'. Ajustar script-src al inline existente (hay muchos onclick y <script> embebidos; se puede endurecer luego con nonces).
- **Prioridad:** esta semana

#### ⚪ BAJO — xss: campeonismo.js pinta nombres de equipo y lugar con innerHTML sin escapar (única brecha de escape del proyecto)

- **Ubicación:** `js/tools/campeonismo.js:1748, 1772, 1774, 1854 (y ~35 interpolaciones .name/.grupo/.lugar/.detalle en innerHTML); el archivo no define ninguna función de escape`
- **Problema:** A diferencia del resto del código, campeonismo.js no tiene función de escape y vuelca directamente en innerHTML el nombre del grupo (g.name), la mascota, el lugar (T.cfg.lugar) y el detalle de insignias. Esos valores los teclea el maestro en su propio equipo (camp-gi-N, camp-lugar), así que el vector realista es self-XSS. La ruta hacia la nube (camp-vivo.html, pantalla pública del proyector) SÍ escapa con esc(), por lo que un nombre malicioso no daña a los alumnos que se conectan.
- **Impacto:** Bajo: ejecución de script limitada al propio dispositivo del maestro que escribió el nombre. No hay canal donde un tercero inyecte ese nombre y llegue a la víctima sin pasar por camp-vivo (que escapa). Se reporta por consistencia: es el único punto del proyecto que rompe la disciplina de escape y podría convertirse en un problema real si mañana esos nombres pasan a alimentarse desde la nube o desde el registro de equipos por los alumnos.
- **Evidencia:**
```
${T.cfg.lugar ? `<p class="camp-podio-lugar">📍 ${T.cfg.lugar}</p>` : ''}
```
- **Solución:** Definir una función de escape local (idéntica a adEsc) y aplicarla a g.name, g.mascota, T.cfg.lugar, i.grupo, i.detalle en todas las plantillas de innerHTML de campeonismo.js, igual que ya hace camp-vivo.html.
- **Prioridad:** backlog

#### ⚪ BAJO — ejecucion-de-codigo: Uso de new Function para parsear bancos de preguntas de las misiones

- **Ubicación:** `js/tools/campeonismo.js:251 (llamado desde la carga en :299-307)`
- **Problema:** Para importar bancos de opción múltiple, campeonismo descarga el JS de una misión (fetch same-origin sobre m.url del catálogo MISSIONS) y evalúa el literal de array con new Function('return '+...). La fuente es un archivo estático del mismo origen y m.url no es controlable por el usuario, así que no es un vector de inyección explotable hoy; pero new Function ejecuta código arbitrario del literal (una llamada a función dentro del array se ejecutaría) y es un primitivo de ejecución que conviene evitar.
- **Impacto:** Bajo en el estado actual (assets estáticos versionados). Se vuelve peligroso si algún día esos ficheros de misión pudieran servirse desde una fuente no confiable o editarse por terceros. Además una CSP con script-src estricto podría romperlo (new Function requiere 'unsafe-eval').
- **Evidencia:**
```
try { arr = new Function('return ' + txt.slice(start, i + 1))(); }
```
- **Solución:** Sustituir new Function por un parseo seguro del literal (JSON.parse tras normalizar, o un parser acotado a objetos {q,o,a}). Elimina el primitivo de ejecución y permite una CSP sin 'unsafe-eval'.
- **Prioridad:** backlog

#### ⚪ BAJO — aleatoriedad-debil: Códigos y PIN de convocatoria generados con Math.random (RNG no criptográfico)

- **Ubicación:** `js/tools/convocatoria.js:131-133 (convAzar), usado en :2821 (codigo=convAzar(4), pin=convAzar(6)); mismo patrón en js/tools/campeonismo.js:2150 y js/tools/registros-admin.js:67`
- **Problema:** El PIN de la convocatoria (6 caracteres, ~29 bits) protege los datos personales de las familias que responden (nombres y teléfonos, que según la normativa 'no salen sin el PIN'). Se genera con Math.random, no criptográfico. El código de 4 caracteres viaja público en el enlace; el PIN es el único secreto que separa 'ver el evento' de 'ver la lista de personas y teléfonos'. Con Math.random y 6 caracteres, un atacante que tenga el enlace público podría intentar fuerza bruta del PIN contra la RPC de respuestas si el servidor no la frena por intento.
- **Impacto:** Bajo-medio según el freno del servidor (fuera del alcance de esta auditoría de cliente). En el cliente, el defecto es usar un RNG no seguro para un secreto que protege datos de contacto de familias. El PIN no se sincroniza (se queda en el equipo), lo que limita su exposición.
- **Evidencia:**
```
for (let i = 0; i < n; i++) s += CONV_ALFA[Math.floor(Math.random() * CONV_ALFA.length)];
```
- **Solución:** Usar crypto.getRandomValues en convAzar (y en los generadores equivalentes de campeonismo/registros-admin). Verificar que la RPC metas_conv_respuestas aplique metas_rate_ok o un tope por código+PIN.
- **Prioridad:** backlog

#### ⚪ BAJO — politica-de-contrasenas: Contraseña de docente admitida con solo 6 caracteres y sin requisitos de fuerza

- **Ubicación:** `js/app.js:1790 (validación de alta); repetido como motivo servidor en :1826-1827`
- **Problema:** La única validación de fuerza es longitud >= 6, sin comprobar variedad ni contra contraseñas comunes. La cuenta guarda datos académicos de menores y, para director/rector, permite gestionar otras cuentas. Es una decisión de diseño coherente con el público (maestros con teléfonos básicos), y el login sí tiene freno de 5 fallos → 10 min (SUPABASE-DOCENTES-V2.sql:243-247), lo que mitiga la fuerza bruta en línea; por eso severidad baja.
- **Impacto:** Contraseñas débiles ('123456') son fáciles de adivinar por alguien del entorno de la escuela. El freno del servidor reduce el riesgo de barrido automatizado pero no el de un puñado de intentos dirigidos.
- **Evidencia:**
```
if (clave.length < 6) { toast('La contraseña debe tener al menos 6 letras o números'); return; }
```
- **Solución:** Subir el mínimo a 8, rechazar contraseñas obviamente débiles (secuencias, el propio correo/nombre) y mantener el freno de intentos del servidor. Mantener el mensaje sencillo para el público objetivo.
- **Prioridad:** backlog

### 3. Privacidad · Datos de menores

_La arquitectura tiene decisiones de privacidad sólidas y deliberadas: metas_conv_ver devuelve SOLO conteos (nunca nombres/teléfonos), todo el tráfico va por HTTPS (no hay ningún fetch a http://), las fotos del buzón se re-codifican en un canvas antes de subir (lo que elimina el EXIF/GPS del menor), y las tablas resultados/progreso/plan_accion/registro_admin tienen RLS que solo permite INSERT y obliga a pasar por RPC. El riesgo real NO es la clave publishable, sino la fortaleza de las credenciales que protegen los datos de los niños. Hay tres huecos de gravedad ALTA, todos por la misma causa: las RPC que LEEN datos sensibles de menores son llamables por anon y NO tienen candado de velocidad, mientras el PIN/clave que las protege es débil. La lectura de respuestas de la convocatoria (nombres de niños + teléfonos de familias de toda la escuela) se abre con un PIN de mínimo 4 caracteres sin ningún rate-limit; las consultas del maestro (notas, conducta, pagos y claves de familia de TODOS sus alumnos) permiten fuerza bruta de contraseña sin candado, saltándose el bloqueo de 10 min que sí tiene el login; y la clave de familia (identidad permanente del niño ante la nube, impresa en papel) tiene entropía modesta con un rate-limit por-IP que un atacante con varias IP evade. Además faltan un mecanismo de borrado a iniciativa de la familia para los datos METAS (el buzón sí lo tiene) y un consentimiento parental cuando quien escribe en el buzón es un menor._

#### 🟠 ALTO — enumeracion-identificadores: La clave de familia —identidad permanente del niño e impresa en papel— tiene entropía modesta y su único freno es un rate-limit por-IP evadible

- **Ubicación:** `js/tools/registros-admin.js:212-236, 54; SUPABASE-FASE3.sql:126-180` _(verificado: confirmado)_
- **Problema:** La clave de familia se forma con el número de lista + un sufijo de 1 letra (de 23) + 3 caracteres (de 31): unos 23*31^3 ≈ 685.000 sufijos por número de lista, y el número de lista (1-45) es adivinable. metas_consultar_plan_padre y metas_consultar_admin_padre aceptan cualquier código con solo 'length >= 2' (FASE3.sql:173,198) y devuelven notas, categoría/mensaje de conducta y monto de pagos del niño. El único freno es metas_rate_ok: 300 consultas/hora POR IP (FASE3.sql:147). Un atacante con un puñado de IP/proxies (baratos) paraleliza y evade ese límite; y como toda la escuela puebla el espacio de códigos, un ataque de 'cosechar cualquier niño' acierta con densidad alta. La clave no caduca y va impresa en tiras de papel que se guardan por años.
- **Impacto:** Fuerza bruta distribuida permite enumerar códigos válidos y extraer, por cada acierto, el expediente completo de un menor: calificaciones, anotaciones de conducta (mensaje libre del maestro) y deudas/pagos de la familia. Es el dato más sensible del sistema y su credencial es débil y permanente.
- **Evidencia:**
```
function adSufijoClave() {
  let suf = AD_ID_LETRAS[Math.floor(Math.random() * AD_ID_LETRAS.length)];
  for (let i = 0; i < 3; i++) suf += AD_ID_ALFA[Math.floor(Math.random() * AD_ID_ALFA.length)];
  return suf;
}   [registros-admin.js:213-217; AD_ID_ALFA de 31 chars en :54]
```
- **Solución:** Sin invalidar las tiras ya repartidas (regla 'Lo que NO se toca'): alargar el sufijo para las claves NUEVAS (p.ej. 5-6 caracteres aleatorios) para subir la entropía a futuro; endurecer metas_rate_ok con un límite global por código además del por-IP y bajar el techo horario; y rechazar en las RPC del padre los códigos que no cumplan la forma esperada (hoy basta length>=2). A medio plazo, permitir rotar la clave de una familia comprometida.
- **Prioridad:** esta semana

#### 🟡 MEDIO — control-acceso-fuerza-bruta: Los nombres de niños y teléfonos de familias de toda la escuela se leen con un PIN de 4 caracteres sin candado de velocidad

- **Ubicación:** `SUPABASE-CONVOCATORIA.sql:82, 205-221` _(verificado: ajustado de ALTO a MEDIO)_
- **Problema:** metas_conv_respuestas devuelve alumno (nombre del niño), tel (teléfono de la familia), grado y sección de TODAS las respuestas de una convocatoria. Está concedida a anon y, a diferencia de metas_conv_responder (que en la línea 168 sí llama a metas_rate_ok), esta función NO tiene ningún candado de velocidad. El código de la convocatoria circula suelto en un grupo de WhatsApp de cientos de personas (es semipúblico por diseño) y el PIN que la protege exige apenas 4 caracteres (línea 82). Un PIN de 4 dígitos son 10.000 combinaciones; sin rate-limit se prueban en segundos contra la RPC, recomputando el hash en el servidor en cada intento. metas_conv_quitar (241-263) tiene el mismo hueco: brute-force del PIN permite borrar respuestas (sabotaje de asientos).
- **Impacto:** Un extraño que ve el enlace en WhatsApp puede cosechar el nombre de cada niño anotado y el teléfono de cada familia de la escuela entera para ese evento, y saber a qué grado va cada uno — justo los datos que la cabecera del archivo promete que 'no salen nunca sin el PIN'. Es una fuga masiva de datos de contacto de menores y familias.
- **Evidencia:**
```
if length(cod) < 4 or length(cod) > 8 or length(coalesce(p_pin,'')) < 4 then
    return false;   [linea 82]
...
create or replace function public.metas_conv_respuestas(p_codigo text, p_pin text)
returns table (va boolean, alumno text, grado text, seccion text,
               personas integer, tel text, nota text, actualizado_en timestamptz)   [205-207, sin metas_rate_ok en el cuerpo]
```
- **Solución:** Añadir 'if not public.metas_rate_ok() then return; end if;' al inicio de metas_conv_respuestas y metas_conv_quitar (mismo patrón que metas_conv_responder). Subir el mínimo del PIN a 6 y contar los fallos por (codigo) con un bloqueo temporal tras N intentos, igual que docente_intentos hace en el login. El código y el PIN juntos deben tener suficiente entropía porque el código es semipúblico.
- **Prioridad:** inmediata

#### 🟡 MEDIO — control-acceso-fuerza-bruta: La contraseña del maestro (que abre notas, conducta, pagos y claves de familia de todos sus alumnos) es forzable sin candado por las RPC de datos, saltándose el bloqueo del login

- **Ubicación:** `SUPABASE-DOCENTES-V2.sql:344-384, 288-301; SUPABASE-DOCENTE-ESTADO.sql:89-108` _(verificado: ajustado de ALTO a MEDIO)_
- **Problema:** El login metas_entrar_docente_v2 sí tiene bloqueo: tras fallos cuenta docente_intentos y obliga a esperar 10 minutos (líneas 269-274). Pero metas_consultar_docente(p_codigo,p_clave), metas_consultar_progreso_docente y metas_docente_estado_leer(p_codigo,p_clave) aceptan el MISMO par código+clave, están concedidas a anon, y NO pasan por docente_intentos NI por metas_rate_ok. Un atacante ignora el login y prueba contraseñas directamente contra metas_consultar_docente sin ningún límite. El hash es sha256 rápido (sin sal en el formato viejo, aún aceptado en 259-260/295-296), así que el coste por intento es solo la latencia de red.
- **Impacto:** Adivinada la contraseña de un maestro, se leen las notas, avisos y progreso de todos sus alumnos (metas_consultar_docente/progreso) y, vía metas_docente_estado_leer, el estado completo del aula: las CLAVES DE FAMILIA de cada niño (que a su vez abren el expediente del padre), los registros administrativos (conducta, pagos) y el Plan de Acción. El candado de 10 minutos del login da una falsa sensación de protección que estas RPC anulan.
- **Evidencia:**
```
create or replace function public.metas_consultar_docente(p_codigo text, p_clave text)
returns setof public.resultados
language plpgsql security definer stable set search_path = public
as $$
...
  if not public._metas_docente_ok(v_cod, p_clave) then
    return;                                   -- clave incorrecta -> vacio   [354-356, sin rate-limit ni conteo de fallos]
```
- **Solución:** Enrutar TODAS las RPC que reciben código+clave del maestro por el mismo contador de fallos que el login (docente_intentos) o por metas_rate_ok, para que el bloqueo de 10 min no se pueda saltar. Migrar por completo al hash salado v2 y retirar la aceptación del sha256 sin sal. Considerar exigir longitud mínima de contraseña también a las cuentas antiguas.
- **Prioridad:** inmediata

#### 🟡 MEDIO — derecho-al-olvido: La familia no tiene forma de borrar los datos del menor en METAS; el borrado depende solo del maestro

- **Ubicación:** `padres.html:511-539; SUPABASE-FASE3.sql:83-115`
- **Problema:** padres.html solo consulta (metas_consultar_plan_padre/admin/avisos); no ofrece ninguna acción de borrado. El único borrado real de datos del menor es metas_cerrar_familias, que borra al cerrar el año y lo invoca 'Mi aula' con las claves del grupo — es decir, lo ejecuta el MAESTRO, no la familia. A diferencia del buzón, que sí da al lector una puerta propia para retirar lo suyo (buzon.html:1456-1460, faro_buzon_retirar), aquí el padre depende por completo de que el maestro decida borrar.
- **Impacto:** No existe un derecho de supresión ejercitable por el titular/su familia sobre las notas, conducta y pagos del niño. Si una familia quiere que se elimine el expediente de su hijo, no tiene mecanismo; queda a discreción y disponibilidad del maestro.
- **Evidencia:**
```
const [plan, admin, avisos] = await Promise.all([
      seguro(pide('metas_consultar_plan_padre')),
      seguro(pide('metas_consultar_admin_padre')),
      seguro(pide('metas_consultar_avisos_padre')),   /* si aun no existe en la nube, se tolera */
    ]);   [padres.html:527-531 — solo lectura, ninguna RPC de borrado]
```
- **Solución:** Exponer en padres.html una acción de 'retirar los datos de mi hijo' que llame a una RPC de borrado por código de familia (análoga a faro_buzon_retirar del buzón), y/o documentar y garantizar un canal por el que la familia solicite la supresión. La infraestructura de borrado por código ya existe (metas_cerrar_familias borra por códigos); falta el punto de entrada para la familia.
- **Prioridad:** este mes

#### 🟡 MEDIO — consentimiento-menores: El buzón recoge nombre y teléfono de cualquiera —incluido un menor— sin verificación de edad ni consentimiento parental del propio remitente

- **Ubicación:** `buzon.html:254, 864-916, 943-950`
- **Problema:** La pantalla de ética cubre a TERCEROS menores en el contenido ('No mande fotos de menores sin permiso… ni el nombre de un menor dentro de una denuncia', línea 883-885), pero no contempla que quien rellena el formulario sea a su vez un menor entregando su propio nombre + teléfono. No hay comprobación de edad ni casilla de consentimiento parental para el remitente. ETICA_VERSION ('2026-08', línea 254) versiona lo que se acepta, lo cual es correcto, pero el texto aceptado no incluye nada sobre la edad del remitente.
- **Impacto:** Un menor puede entregar sus datos de contacto (nombre real + WhatsApp) que quedan en el proyecto de la revista (F.A.R.O) para 'llamar y confirmar', sin que medie consentimiento de su familia. Frente al principio de consentimiento para datos de niños, es un hueco.
- **Evidencia:**
```
<li><span class="etica-ic">🧒</span><span><b>Cuidado con los niños.</b>
            No mande fotos de menores sin permiso de su familia, ni el nombre de un menor
            dentro de una denuncia. Tampoco direcciones de casa ni telefonos de nadie.</span></li>   [buzon.html:883-885 — habla de terceros, no del remitente menor]
```
- **Solución:** Añadir a la pantalla de ética una línea/casilla explícita: si eres menor de edad, hazlo con permiso de tu familia. Subir ETICA_VERSION al cambiar el texto (como manda la normativa). No requiere backend nuevo; es una casilla y una versión.
- **Prioridad:** este mes

#### 🟡 MEDIO — minimizacion: El nombre completo del niño se sube a la nube por defecto, pese a que la propia página recomienda usar el número de lista

- **Ubicación:** `js/metas-supabase.js:57-75; consulta-nube.html:132-136; js/metas-registro.js:384`
- **Problema:** fila() copia alumno (nombre) a la tabla resultados y snapshotProgreso() lo copia a progreso; se envía tal cual salvo que el alumno haya tecleado un código en vez de su nombre. consulta-nube.html:133-135 aconseja 'identificar a los estudiantes con su número de lista o código en lugar del nombre completo', y el campo de identificación admite 'Tu nombre o código de alumno' (registro.js:384), pero nada MINIMIZA por defecto: el comportamiento normal es subir el nombre real del menor a la nube.
- **Impacto:** Se acumulan en la nube nombres reales de menores de forma innecesaria para la función (que se puede cumplir con el número de lista), ampliando la superficie de exposición de cualquiera de las fugas anteriores. Contradice el principio de minimización que la propia página predica.
- **Evidencia:**
```
function fila(ev) {
    return {
      evento_id: ev.id,
      ...
      alumno: ev.alumno || '',
      codigo_lista: ev.num || '',   [metas-supabase.js:57-66]
```
- **Solución:** Ofrecer/por defecto un modo 'solo número de lista' que no envíe el nombre a la nube (dejando el nombre solo en el dispositivo del maestro), o truncar/omitir el nombre en fila()/snapshotProgreso cuando exista codigo_lista. Es cambio de cliente, dentro del stack estático.
- **Prioridad:** este mes

#### ⚪ BAJO — datos-en-reposo: Las claves de familia de todos los niños viven en claro en localStorage y se replican a la nube del maestro

- **Ubicación:** `js/metas-docente-sync.js:42; js/tools/registros-admin.js:225-236`
- **Problema:** METAS_CODIGOS_V1 (todas las claves de familia del aula, bajo 'G:<id>') se guarda en claro en el dispositivo del maestro y se sincroniza a docente_estado. Cada clave es la identidad permanente de un niño ante la nube. No es un defecto de diseño en sí (deben calzar entre equipos), pero concentra un secreto muy sensible en el teléfono del maestro, sin cifrado en reposo, y su compromiso (teléfono perdido/compartido, o la fuga del hallazgo ALTO del maestro) expone a TODOS los niños del aula.
- **Impacto:** La pérdida o acceso no autorizado al dispositivo del maestro, o a su cuenta en la nube, entrega de una vez las claves de todas las familias y con ellas los expedientes de todos los niños.
- **Evidencia:**
```
'METAS_CODIGOS_V1',          // claves de familia (deben calzar entre equipos)   [metas-docente-sync.js:42]
```
- **Solución:** Mitigar principalmente cerrando el hallazgo de fuerza bruta del maestro (el vector remoto). Para el dispositivo, reforzar en el manual el bloqueo de pantalla y no compartir el teléfono del maestro; valorar no exponer las claves completas en pantallas que no las necesiten. Riesgo aceptable si las cuentas docentes quedan bien protegidas.
- **Prioridad:** backlog

#### ⚪ BAJO — almacenamiento-credenciales: Se siguen aceptando contraseñas de maestro con sha256 sin sal (formato heredado)

- **Ubicación:** `SUPABASE-DOCENTES-V2.sql:259-260, 295-296`
- **Problema:** Tanto el login como _metas_docente_ok aceptan el formato viejo 'sha256(clave)' sin sal además del v2 salado. Un hash rápido y sin sal facilita ataques offline si alguna vez se filtrara la tabla docentes, y no fuerza la migración de las cuentas antiguas a un esquema mejor.
- **Impacto:** Ante una hipotética exposición de la tabla docentes, las contraseñas heredadas caen con tablas rainbow/GPU triviales, y con ellas los datos de los alumnos de esos maestros.
- **Evidencia:**
```
v_ok := (d.clave_hash = encode(extensions.digest(v_clave, 'sha256'), 'hex'))
         or (d.clave_hash = 'v2:' || encode(extensions.digest(v_clave || d.codigo, 'sha256'), 'hex'));   [DOCENTES-V2.sql:259-260]
```
- **Solución:** Al iniciar sesión con éxito por el formato viejo, re-hashear y guardar en v2 (upgrade transparente) y, pasado un plazo, retirar la aceptación del formato sin sal. Idealmente migrar a un hash con coste (bcrypt/pgcrypto crypt) para las contraseñas.
- **Prioridad:** backlog

### 4. Arquitectura y código

_El patrón es correcto y bien ajustado al contexto: sitio 100% estático (HTML/CSS/JS planos, sin build ni framework) servido por Cloudflare Workers, con Supabase como único backend y la frontera de seguridad puesta donde debe estar — RLS activado en todas las tablas SIN políticas anónimas y todo el acceso encapsulado en funciones RPC SECURITY DEFINER con `set search_path` fijo, que validan credenciales antes de tocar datos (patrón verificado en DOCENTE-ESTADO, CONVOCATORIA, AULA). Para un aula de Honduras con poca señal, teléfonos compartidos y despliegue por copiar-pegar, es una arquitectura adecuada y defendible; el modelo offline-first (localStorage como fuente de verdad + colas con dedup por evento_id + LWW) está pensado con cuidado y con guardas anti-pérdida reales. Los riesgos estructurales que sí importan son otros: (1) la sincronización es de grano grueso — el aula entera viaja como un único blob con last-write-wins, lo que puede perder ediciones concurrentes entre equipos en silencio; (2) la mayor superficie de escritura anónima (resultados de menores) no tiene rate-limit ni autenticidad; (3) hay deuda de versiones (un .sql OBSOLETO destructivo conviviendo con los vigentes en la misma carpeta) y (4) duplicación estructural de reglas críticas (folio del boleto, grado-sección) cuyo invariante 'si cambia una, cambian todas' está garantizado solo por comentarios, sin sonda que lo verifique. Los archivos monolíticos (registros-admin.js 6120 líneas) son un riesgo de mantenimiento real pero mitigado por convenciones. El manejo de errores tiende a tragar fallos en silencio, sin telemetría. No se detectó fuga de mensajes crudos de Supabase al usuario ni RLS mal cerrada._

#### 🟠 ALTO — manejo-de-estado: El aula entera se sincroniza como un solo blob con last-write-wins: ediciones concurrentes entre equipos se pierden en silencio

- **Ubicación:** `js/metas-docente-sync.js:38-50, 243-252; SUPABASE-DOCENTE-ESTADO.sql:76` _(verificado: confirmado)_
- **Problema:** Cada clave de localStorage (p.ej. METAS_ADMIN_V1, que contiene roster + economía + asistencia + notas SACE de todo un grupo) es UNA fila (codigo, k) que se sube y baja completa. La resolución de conflicto es last-write-wins por timestamp de equipo. La guarda anti-pérdida (`peso`) solo protege contra que una copia casi vacía pise a una llena (rp*2 < lp), NO contra dos ediciones reales de peso similar a partes distintas del mismo blob. Ejemplo: el maestro edita notas de 6º-1 en el teléfono y economía de 6º-1 en la PC sin sincronizar entremedio; al converger, el blob con timestamp más nuevo gana entero y las ediciones del otro equipo desaparecen. Queda un respaldo local en el equipo pisado (backupLocal), pero la pérdida es silenciosa: el maestro no se entera hasta que falta un dato.
- **Impacto:** Pérdida silenciosa de datos de gestión del aula (notas, cobros, asistencia) — justo el escenario multi-equipo que esta capa existe para resolver. En un aula con 'tres teléfonos prestados' (patrón que CLAUDE.md cita repetidamente) la edición concurrente no es rara.
- **Evidencia:**
```
if (!force && lp >= 300 && rp * 2 < lp) {
  var winV = Math.max(remota, local, ahora()) + 1;
  m[row.k] = { v: winV, h: hash(localRaw), sv: 0 };   // pendiente, con versión que gana
  protegido = true;
  return;
}
// aplicar la nube solo si es más nueva (o si aquí no hay nada)
if (!force && remota <= local && lp > 0) return;
```
- **Solución:** Dentro del mismo modelo: (a) partir METAS_ADMIN_V1 por grupo en claves independientes ('METAS_ADMIN_G:<id>') para que dos grupos distintos ya no compitan por el mismo blob; y/o (b) hacer el merge a nivel de sub-objeto (notas vs economía vs asistencia son campos disjuntos que se pueden fusionar por campo con su propio timestamp) en lugar de reemplazar el blob completo. Como mínimo, avisar en pantalla cuando `protegido`/backupLocal se dispara, para que el maestro sepa que hubo un conflicto y pueda usar 'Usar los datos de este equipo'.
- **Prioridad:** este mes

#### 🟡 MEDIO — seguridad-integridad: La ingesta de resultados de menores (metas_guardar) no tiene rate-limit ni autenticidad de escritor

- **Ubicación:** `SUPABASE-AULA.sql:103-135; js/metas-supabase.js:35,129`
- **Problema:** metas_guardar acepta hasta 500 filas anónimas con alumno/docente/escuela/nota/codigo_aula arbitrarios y NO llama a metas_rate_ok(), a diferencia de metas_conv_responder que sí lo hace. Con la clave publishable (pública por diseño) cualquiera puede inyectar o inflar filas fabricadas atribuidas a cualquier maestro o escuela. La dedup por evento_id evita duplicados exactos de un reintento, pero no impide crear filas nuevas con evento_id inventados.
- **Impacto:** Contaminación de la tabla `resultados` (datos de aprendizaje de menores que el maestro consulta y que alimentan informes que firma la familia) y posible abuso de escritura sin freno. No es una fuga de datos (RLS está bien cerrada para lectura), pero sí un riesgo de integridad y de coste.
- **Evidencia:**
```
if filas is null or jsonb_typeof(filas) <> 'array' or jsonb_array_length(filas) > 500 then
    return 0;
  end if;
  insert into public.resultados
    (evento_id, tipo, mision, forma, nota, base, alumno, codigo_lista,
     grado, docente, escuela, dispositivo, xp, fecha)
```
- **Solución:** Aplicar el mismo candado que ya existe y que la convocatoria usa: envolver el insert con `if not public.metas_rate_ok() then return 0; end if;` (con el guard `exception when undefined_function`). Es una función ya escrita en SUPABASE-FASE3.sql; extenderla a metas_guardar y metas_guardar_progreso cierra la superficie de escritura anónima más grande sin cambiar el modelo.
- **Prioridad:** esta semana

#### 🟡 MEDIO — deuda-de-versiones: Archivo SQL OBSOLETO y destructivo conviviendo en la misma carpeta que los vigentes, con despliegue manual desde tableta

- **Ubicación:** `SUPABASE-DOCENTES.sql:1-9 (frente a SUPABASE-DOCENTES-V2.sql)`
- **Problema:** SUPABASE-DOCENTES.sql está marcado OBSOLETO y su propia cabecera advierte que correrlo después de V2 'ROMPE las cuentas nuevas' (revierte _metas_docente_ok, metas_consultar_docente, metas_consultar_progreso_docente y metas_cambiar_clave_docente al modelo viejo). Pero sigue en la raíz junto a los 20 SUPABASE-*.sql vigentes. El modelo de despliegue documentado en CLAUDE.md es 'se abre, se copia entero y se pega a mano en el SQL Editor desde el teléfono o la tableta, casi siempre sin el repositorio delante'. Elegir el archivo equivocado de una lista larga es un error operativo real y aquí es destructivo e irreversible en caliente. (ROLES vs ROLES-V2, en cambio, NO son duplicados: V2 es aditivo y requiere V1 corrido antes — eso está bien, solo el nombre 'V2' confunde.)
- **Impacto:** Un solo copiar-pegar equivocado tumba el login y la consulta de todos los maestros. La única barrera es leer una cabecera de comentarios en el momento correcto.
- **Evidencia:**
```
-- ⚠️⚠️ OBSOLETO — NO VOLVER A CORRER ESTE ARCHIVO ⚠️⚠️
-- Reemplazado por SUPABASE-DOCENTES-V2.sql (cuenta con correo +
-- contraseña y emparejamiento por NOMBRE del maestro).
-- Correr esto DESPUÉS de V2 ROMPE las cuentas nuevas: revierte
-- _metas_docente_ok, metas_consultar_docente, metas_consultar_
-- progreso_docente y metas_cambiar_clave_docente al modelo viejo.
```
- **Solución:** Mover los .sql históricos/obsoletos a una subcarpeta clara (p.ej. supabase-obsoletos/) o renombrarlos con prefijo z-OBSOLETO-NO-CORRER-DOCENTES.sql para que en cualquier lista queden lejos de los vigentes y sean inconfundibles desde una tableta. No borrar (se conserva como referencia), solo separar.
- **Prioridad:** esta semana

#### 🟡 MEDIO — duplicacion-estructural: El folio del boleto está duplicado byte a byte en dos archivos y ninguna sonda verifica que ambos coincidan

- **Ubicación:** `js/tools/convocatoria.js:48,671-689 y salida.html:310-334; sonda en _dev/verifica-convocatoria.js:488-492`
- **Problema:** convFolio/convHuella (convocatoria.js, lado maestro) y folioDe/huellaDe (salida.html, lado familia) DEBEN producir el mismo folio para el mismo alumno, pero son copias independientes que dependen de constantes con nombres distintos (CONV_ALFA vs FOLIO_ALFA) y de funciones de normalización distintas (convNorm vs norm). Hoy los cuerpos coinciden exactamente, así que no hay divergencia viva. El problema es estructural: el invariante 'si cambia una, cambia la otra' (que CLAUDE.md declara como regla) está garantizado SOLO por comentarios en prosa. La sonda verifica-convocatoria.js calcula el folio con convFolio en el contexto del maestro y valida su formato, pero NO ejecuta folioDe de salida.html ni compara ambas salidas. Un cambio en un solo lado (o en CONV_ALFA sin tocar FOLIO_ALFA) pasaría todas las pruebas y entregaría folios que no casan.
- **Impacto:** Divergencia silenciosa: el boleto que imprime el maestro y el que la familia lleva en el teléfono dejan de ser el mismo número, y el niño se queda discutiendo en el portón el día de la salida. Alto impacto, baja probabilidad hoy, pero sin red de seguridad automatizada.
- **Evidencia:**
```
// convocatoria.js
let n = h % 923521, out = '';           /* 31⁴: cuatro letras del alfabeto sin 0/O/1/I/L */
for (let i = 0; i < 4; i++) { out = CONV_ALFA[n % 31] + out; n = Math.floor(n / 31); }
// salida.html
let n = h % 923521, out = '';           /* 31⁴ */
for (let i = 0; i < 4; i++) { out = FOLIO_ALFA[n % 31] + out; n = Math.floor(n / 31); }
```
- **Solución:** Añadir a verifica-convocatoria.js una comprobación cruzada real: cargar salida.html en la página, calcular folioDe(codigo, huellaDe(alumno,grado,seccion)) y compararlo === contra convFolio(codigo, convHuella(...)) para varios alumnos de prueba (incluyendo nombres con acentos y secciones raras). Así el invariante deja de vivir solo en un comentario. Alternativa estructural: extraer folio+huella a un js/data/folio-boleto.js que carguen los dos (salida.html no carga los tools, pero sí puede cargar un archivo de datos pequeño).
- **Prioridad:** esta semana

#### 🟡 MEDIO — separacion-de-concerns: Archivos monolíticos con presentación, persistencia, red y lógica de negocio entremezcladas y expuestas por globals

- **Ubicación:** `js/tools/registros-admin.js (6120 líneas, 139 funciones top-level, 24 window.*); adRenderLista:666-990 (~324 líneas); adPrintExpediente:1393-1597 (~204 líneas)`
- **Problema:** registros-admin.js reúne en un solo IIFE 139 funciones que mezclan render con innerHTML (26 ocurrencias), persistencia directa a localStorage (42), red a Supabase (6) y reglas de negocio (claves de familia, migración v1→v2, arrastre de chips). Todo el API se expone por window.* (sin módulos ES ni build). Hay funciones muy grandes (adRenderLista ~324 líneas, adPrintExpediente ~204) que hacen a la vez lógica, formateo de datos y generación de HTML/CSS impreso. Lo mismo aplica a convocatoria.js (3415) y campeonismo.js (2337).
- **Impacto:** Riesgo de mantenimiento real: colisión de nombres en el espacio global, imposibilidad de testear una regla en aislamiento sin arrastrar el DOM, y curva de entrada alta para quien retome el proyecto. Mitigado —no anulado— por el prefijo namespacing consistente (ad*, conv*, camp*), la ausencia de build que obligaría a tocar todo, y una batería de sondas de integración amplia.
- **Evidencia:**
```
=== line counts ===
  6120 js/tools/registros-admin.js
  3415 js/tools/convocatoria.js
  2337 js/tools/campeonismo.js
=== registros-admin.js: innerHTML=26  localStorage=42  fetch=6 ===
=== 139 funciones top-level, 24 window.* ===
```
- **Solución:** Sin reescribir: separar por concern dentro del mismo estilo plano — extraer la capa de datos/persistencia (adState/adSave/adLoad/adClaveFamilia y migración) a un js/tools/registros-datos.js, y la generación de HTML impreso (adPrintExpediente, adExpTabla) a un registros-print.js, cargados con <script> como hoy. No cambia el runtime, reduce cada archivo a algo revisable y aísla la lógica testeable de la de render.
- **Prioridad:** backlog

#### 🟡 MEDIO — manejo-de-estado: Tope de eventos y recorte por cuota llena descartan evidencia de aprendizaje de menores en silencio

- **Ubicación:** `js/metas-registro.js:21,28-35,106`
- **Problema:** El registro local (METAS_REGISTRO_V1) es un único array en localStorage con tope MAX_EVENTOS=4000; al superarlo se recortan los eventos más antiguos, y si localStorage se llena, escribir() descarta los 500 más viejos y reintenta. En un equipo compartido de aula (varios alumnos por teléfono, patrón central del producto) la evidencia más antigua desaparece sin ninguna marca ni aviso. Como el snapshot de progreso y la cola a la nube se derivan de este array, lo recortado que aún no se hubiera subido se pierde para siempre.
- **Impacto:** Pérdida silenciosa de datos de aprendizaje de menores. La cola outbox mitiga (sube antes de que se recorte, normalmente), pero un equipo mucho tiempo sin señal — el caso 'el aula está en un pueblo' que CLAUDE.md invoca — puede acumular y recortar antes de subir.
- **Evidencia:**
```
var MAX_EVENTOS = 4000; // tope de seguridad para no llenar localStorage
...
catch (e) {
  // localStorage lleno: descartar los 500 más antiguos y reintentar
  try { localStorage.setItem(CLAVE, JSON.stringify(eventos.slice(500))); return true; }
  catch (e2) { return false; }
}
...
if (eventos.length > MAX_EVENTOS) eventos = eventos.slice(eventos.length - MAX_EVENTOS);
```
- **Solución:** Antes de recortar, forzar un flush de la outbox a la nube (metas-supabase ya deduplica por evento_id) para no perder lo no subido. Y registrar en un contador local ('eventos_recortados') que el panel docente pueda mostrar, para que el recorte deje de ser invisible.
- **Prioridad:** este mes

#### ⚪ BAJO — duplicacion-estructural: La regla grado-sección tiene tres copias que normalizan el grado de forma diferente, sin sonda que las compare

- **Ubicación:** `js/tools/registros-admin.js:416-421; padres.html:236-241; salida.html:294-301`
- **Problema:** adGradoSeccion (registros-admin.js), grupoTxt (padres.html) y grupoTxt (salida.html) comparten la misma lógica de longitud para elegir '6º-1' vs '6º 1', pero normalizan el grado con tres implementaciones distintas: adGradoOrdinal(grado) vs regex `^(\d{1,2})\s*[ºo°]?$` vs `/^\d+$/.test(g)?g+'º':g`. Para una entrada numérica limpia ('6') las tres coinciden; para entradas no numéricas o ya decoradas ('6to', '6°') pueden producir salidas distintas. CLAUDE.md asume la duplicación ('si cambia una, cambian las tres'), pero no hay ninguna verificación automática que compruebe que las tres dan lo mismo.
- **Impacto:** La madre en el chatbot (padres.html) y el maestro (registros-admin) podrían ver el grupo escrito distinto para el mismo niño, y en salida.html eso alimenta la huella del boleto. Impacto moderado, mitigado por que el grado suele entrarse como dígito pelado.
- **Evidencia:**
```
// registros-admin.js
const g = adGradoOrdinal(grado);
...
return (g.length <= 4 && s.length <= 3) ? g + '-' + s : g + ' ' + s;
// salida.html
const go = /^\d+$/.test(g) ? g + 'º' : g;
...
return (go.length <= 4 && s.length <= 3) ? go + '-' + s : go + ' ' + s;
```
- **Solución:** Añadir un caso de prueba que ejecute las tres funciones sobre el mismo conjunto de entradas (incluyendo '6', '6º', '6to', ' 6 ') y verifique salida idéntica. Si se acepta seguir con tres copias por autonomía de las páginas, al menos alinear las tres normalizaciones a la misma (adGradoOrdinal es la más completa) y que la sonda lo custodie.
- **Prioridad:** este mes

#### ⚪ BAJO — manejo-de-errores: Fallos de red y de lógica se tragan sin telemetría: un fallo sistemático de sync es invisible hasta que un maestro se queja

- **Ubicación:** `js/metas-docente-sync.js:209,268,315; SUPABASE-CONVOCATORIA.sql:200 (exception when others then return false)`
- **Problema:** El proyecto envuelve correctamente localStorage en try/catch (patrón documentado y adecuado, no es hallazgo). Pero además, toda la capa de sync captura los errores de red/servidor con `.catch(function(){ return false; })` y las RPC de escritura usan `exception when others then return false/null`, sin ningún canal que registre QUÉ falló ni cuántas veces. No hay fuga de mensajes crudos al usuario (bien), pero tampoco hay observabilidad: si metas_docente_estado_guardar empieza a rechazar por un cambio de esquema, o si una RPC lanza siempre, el sistema 'converge en silencio' hacia el estado equivocado y nadie lo sabe. Sumado a la ausencia de CI/CD, el único detector de un fallo sistemático es el reporte de un maestro.
- **Impacto:** Los fallos degradan en silencio. Bajo en probabilidad puntual, pero estructural: el proyecto no tiene forma de enterarse de un problema de sync a escala.
- **Evidencia:**
```
// metas-docente-sync.js push()
}).catch(function () { return false; });
// metas-docente-sync.js sync()
.catch(function () { _busy = false; return false; });
// SUPABASE-CONVOCATORIA.sql metas_conv_responder
exception when others then
  return false;   -- un dato raro no revienta la pantalla del padre
```
- **Solución:** Añadir un contador local de fallos por operación (p.ej. METAS_SYNC_ERRORES con {op, ultimo, n}) que el panel del maestro pueda mostrar discretamente ('⚠️ La nube rechazó 12 veces') y que dé una pista al mantenedor sin exponer stack traces. Barato, dentro del stack, y convierte el fallo silencioso en observable.
- **Prioridad:** backlog

### 5. UX, accesibilidad y offline

_El sitio es estático y la separación de roles descansa correctamente en Supabase (RLS/RPC), tal como documenta CLAUDE.md: las páginas de familia (padres.html, salida.html, buzon.html) consultan por clave de familia/código y las de docente por correo+contraseña, siempre contra RPC que el servidor filtra. No encontré fuga real de datos de un rol a otro en el cliente. Los problemas de peso están en dos áreas prácticas para el público objetivo (maestro/familia con teléfono de gama baja, poca señal, a veces baja visión): (1) accesibilidad — el zoom está bloqueado en la app principal y hay controles cuyo estado activo solo se comunica por color/relleno o inputs sin etiqueta; y (2) rendimiento — index.html descarga ~2.38 MB de JavaScript síncrono sin carga diferida, incluyendo un corpus de lectura de casi 1 MB y herramientas exclusivas del docente, que se bajan también para alumnos y visitantes anónimos. La estrategia offline (SW network-first) es correcta en concepto pero no tiene tiempo de espera y cachea respuestas de error, lo que degrada la experiencia justo en la red lenta/intermitente para la que se diseñó._

#### 🟡 MEDIO — accesibilidad: El zoom (pinch-to-zoom) está bloqueado en la app principal y en las misiones/campeonato

- **Ubicación:** `index.html:5 · mision.html:5 · camp-vivo.html:5` _(verificado: ajustado de ALTO a MEDIO)_
- **Problema:** El viewport incluye maximum-scale=1.0 y user-scalable=no, lo que impide al usuario ampliar la pantalla con los dedos. Es un fallo de WCAG 1.4.4 (Resize Text) y contradice directamente la prioridad de legibilidad que repite CLAUDE.md ('a veces con mala luz', 'el informe se lee en una reunión con la familia', letra grande). El público incluye maestros mayores y familias con baja visión que dependen del zoom del sistema para leer notas, claves y avisos.
- **Impacto:** Un maestro o padre con baja visión no puede ampliar el texto de la Zona Docente, las notas, las claves de familia ni el campeonato en vivo. En un teléfono al sol o con poca luz esto deja contenido efectivamente inaccesible. Las páginas de misión individuales SÍ permiten zoom (0 de 74 lo bloquean), así que el bloqueo es una inconsistencia, no una necesidad técnica.
- **Evidencia:**
```
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```
- **Solución:** Quitar 'maximum-scale=1.0, user-scalable=no' de las tres páginas y dejar 'width=device-width, initial-scale=1.0', como ya hacen padres.html, salida.html, buzon.html, registro.html y las 74 misiones. Si el bloqueo se puso para evitar el doble-tap-zoom accidental, se resuelve con 'touch-action: manipulation' en CSS sobre los botones, sin sacrificar el zoom de accesibilidad.
- **Prioridad:** esta semana

#### 🟡 MEDIO — rendimiento: index.html descarga ~2.38 MB de JavaScript síncrono sin carga diferida ni división por rol

- **Ubicación:** `index.html:1049-1082 (esp. 1064 lectura-textos.js, 1060 registros-admin.js, 1061 convocatoria.js, 1050 html2canvas.min.js)` _(verificado: ajustado de ALTO a MEDIO)_
- **Problema:** En la carga inicial de index.html se enlazan 25 scripts, todos síncronos (0 con defer/async, verificado), que suman ~2.38 MB sin comprimir. Incluye lectura-textos.js (980 KB, corpus de lectura de Mi aula), registros-admin.js (340 KB), convocatoria.js (182 KB), html2canvas.min.js (198 KB), campeonismo.js (105 KB) y estadisticas-alumno.js (96 KB). Son herramientas EXCLUSIVAS del docente (y html2canvas solo se usa bajo demanda al generar una imagen), pero se bajan y se parsean también para un alumno que solo abre una misión o un visitante anónimo. El público objetivo es explícitamente 'un maestro con 43 alumnos y un teléfono, muchas veces sin señal', es decir gama baja y datos limitados.
- **Impacto:** Primera carga (antes de que el service worker tenga caché) muy pesada en datos y en tiempo de parse/ejecución en un teléfono barato; consume el saldo de datos del maestro y retrasa la interactividad. html2canvas (198 KB) y lectura-textos.js (980 KB) por sí solos son casi la mitad del bundle y no hacen falta para el arranque.
- **Evidencia:**
```
<script src="js/data/lectura-textos.js?v=151"></script>
<script src="js/tools/registros-admin.js?v=151"></script>
<script src="js/tools/convocatoria.js?v=151"></script>
<script src="js/html2canvas.min.js?v=151"></script>
```
- **Solución:** Sin framework ni build: (a) añadir 'defer' a los <script> para no bloquear el parseo del DOM; (b) cargar bajo demanda las herramientas pesadas del docente con un import dinámico o inyección de <script> al abrir cada tile (goto-admin, goto-camp, etc.), en lugar de enlazarlas todas en index.html; (c) cargar html2canvas.min.js solo al pulsar 'compartir imagen' (ya hay guarda 'if (typeof html2canvas === undefined)' en plan-accion.js:506, así que el patrón ya lo soporta); (d) cargar lectura-textos.js (980 KB) solo dentro de la herramienta de Lectura de Mi aula. Verificar que el servidor (Cloudflare) sirva estos .js con gzip/brotli.
- **Prioridad:** este mes

#### 🟡 MEDIO — offline: El service worker es network-first sin tiempo de espera: en red lenta/intermitente la app cuelga

- **Ubicación:** `sw.js:76-84`
- **Problema:** Para todos los archivos propios (HTML/CSS/JS) el SW hace fetch a la red primero y solo cae a la caché en el .catch(), es decir cuando la petición FALLA. En 'sin señal' total el fetch falla rápido y funciona bien; pero en la red lenta o intermitente de un pueblo (hay señal pero la petición no resuelve ni falla) no hay timeout: el usuario se queda esperando la red aunque el archivo esté en caché. Es justo el escenario para el que se diseñó la PWA.
- **Impacto:** Con conexión degradada la app tarda o se queda en blanco pese a tener todo cacheado, cuando podría responder al instante desde la caché. Afecta el arranque de la Zona Docente y de las páginas de familia.
- **Evidencia:**
```
event.respondWith(
      fetch(event.request, { cache: 'no-cache' })
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
```
- **Solución:** Envolver el fetch en una carrera con un timeout (p. ej. Promise.race entre fetch y un setTimeout de ~3-4 s que resuelva desde caches.match). Así se mantiene 'red primero' para no servir versiones viejas (regla de CLAUDE.md), pero si la red no responde en unos segundos se sirve la caché y luego se revalida en segundo plano (stale-while-revalidate). Mantener el network-first solo para navegaciones/HTML si se quiere ser conservador con el versionado.
- **Prioridad:** este mes

#### 🟡 MEDIO — offline: El SW cachea la respuesta sin comprobar response.ok: un 404/500 transitorio queda guardado y se sirve offline

- **Ubicación:** `sw.js:78-82`
- **Problema:** El .then() clona y hace cache.put de CUALQUIER respuesta, sin verificar response.ok ni el status. Si durante un despliegue el servidor devuelve momentáneamente un 404 (archivo renombrado, propagación) o un 500, esa respuesta de error se cachea con la clave del recurso y luego se sirve desde caché cuando el usuario esté offline.
- **Impacto:** Un error puntual de red o de despliegue puede 'envenenar' la caché con una página o script roto que persiste offline hasta el siguiente arreglo online, dejando al maestro sin esa herramienta sin motivo visible.
- **Evidencia:**
```
.then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
```
- **Solución:** Cachear solo respuestas válidas: 'if (response && response.ok && response.status === 200) { const clone = response.clone(); caches.open(...).then(c => c.put(event.request, clone)); }'. No cachear errores ni respuestas opacas.
- **Prioridad:** este mes

#### 🟡 MEDIO — accesibilidad: El chip del grupo activo en la barra de Mi aula solo se distingue por color/relleno, sin estado ARIA

- **Ubicación:** `js/tools/registros-admin.js:596-597`
- **Problema:** El grupo seleccionado se marca únicamente con la clase visual 'ad-gr-on' (relleno de color, tal como pide CLAUDE.md para el sol). El botón lleva aria-label con el nombre del grupo, pero no expone aria-pressed ni aria-current, así que un lector de pantalla (TalkBack/VoiceOver) no anuncia CUÁL de los diez o doce grupos está activo. Equivocarse de grupo es 'pasar lista en el aula que no era', y un maestro con baja visión que usa lector no tiene forma auditiva de saber en qué grupo está.
- **Impacto:** Usuarios de lector de pantalla no perciben el estado seleccionado de la barra de grupos; el relleno de color no llega por audio. Barrera de accesibilidad en el control que el maestro usa 'cuarenta veces al día'.
- **Evidencia:**
```
<button class="ad-gr-chip ${g.id === st.activo ? 'ad-gr-on' : ''}" data-gid="${g.id}"
            title="${adEsc(adGrupoTitulo(g))}" aria-label="${adEsc(adGrupoTitulo(g))}">
```
- **Solución:** Añadir aria-pressed (o aria-current='true') según g.id === st.activo, igual que ya se hace correctamente con las pills de materia en app.js:520 (p.setAttribute('aria-pressed', on ? 'true' : 'false')). Mismo patrón para los chips de pago/asistencia (registros-admin.js:2458, 2670) que también dependen de clase de color.
- **Prioridad:** backlog

#### 🟡 MEDIO — accesibilidad: El input del chat del asistente de padres no tiene etiqueta accesible (solo placeholder)

- **Ubicación:** `padres.html:192`
- **Problema:** El campo principal de interacción del asistente de familias tiene solo placeholder y ningún <label for> ni aria-label. El placeholder no es nombre accesible (desaparece al escribir y suele tener bajo contraste). Es la puerta por la que la familia escribe su clave de familia y sus preguntas. WCAG 3.3.2 (Labels or Instructions) y 4.1.2 (Name, Role, Value). Nota positiva: el contenedor #chat sí usa aria-live='polite' y el botón enviar tiene aria-label.
- **Impacto:** Un padre o madre con baja visión usando lector de pantalla llega al input y no oye para qué sirve; solo 'campo de edición'. En la página pública de familia, que es de uso masivo y sin capacitación previa.
- **Evidencia:**
```
<input id="inp" type="text" autocomplete="off" placeholder="Escriba su pregunta o la clave…">
```
- **Solución:** Añadir aria-label="Escriba su pregunta o su clave de familia" al input (o un <label for="inp"> visualmente oculto). El texto del placeholder puede quedarse como pista.
- **Prioridad:** esta semana

#### ⚪ BAJO — accesibilidad: El input del código en salida.html depende solo del placeholder como etiqueta

- **Ubicación:** `salida.html:428`
- **Problema:** El campo del código de convocatoria tiene solo placeholder 'R4TP'. El <h2>¿Cuál es el código?</h2> da contexto visual pero no está asociado programáticamente al input. Menos grave que padres.html porque el encabezado adyacente ayuda, pero sigue sin nombre accesible propio.
- **Impacto:** Ligera barrera para lectores de pantalla y para autocompletado; el usuario oye 'campo de edición, R4TP' sin saber que R4TP es un ejemplo, no un valor.
- **Evidencia:**
```
<input class="cod-inp" id="c-inp" maxlength="8" placeholder="R4TP" autocomplete="off" autocapitalize="characters">
```
- **Solución:** Añadir aria-label="Código de la convocatoria" al input, o un <label for="c-inp"> asociado al <h2>.
- **Prioridad:** backlog

#### ⚪ BAJO — accesibilidad: Imágenes de candidatos del Gobierno Escolar sin atributo alt

- **Ubicación:** `index.html:495, 499, 536, 542 (también previews 473, 485)`
- **Problema:** Las imágenes de foto de candidato para votar (ge-big-preview-1/2, ge-vote-img-1/2) se declaran sin alt. Su src se llena por JS; no verifiqué que el JS asigne .alt dinámicamente. Sin alt, el lector de pantalla no identifica al candidato de cada opción de voto.
- **Impacto:** En la herramienta de elecciones estudiantiles, un usuario con lector de pantalla no distingue a los candidatos por su foto. Uso acotado (docente), por eso severidad baja.
- **Evidencia:**
```
<img id="ge-big-preview-1" class="ge-big-preview" src="">
<img id="ge-vote-img-1" class="ge-vote-img" src="" hidden>
```
- **Solución:** Poner alt descriptivo (o asignarlo por JS cuando se fija el src, p. ej. img.alt = 'Foto de ' + nombreCandidato). Para las previews puramente decorativas basta alt="".
- **Prioridad:** backlog

#### ⚪ BAJO — separacion-de-roles: Todo el markup y el JS de las herramientas del docente se entrega a cualquier visitante de index.html

- **Ubicación:** `index.html:362 (teacher-tools-group con display:none) + index.html:1058-1070 (scripts de tools)`
- **Problema:** Los tiles de las herramientas del aula viven en el DOM ocultos con style='display:none;' y renderProfile los muestra según METAS_DOCENTE_V1; además el JS de esas herramientas (registros-admin, convocatoria, campeonismo, plan-accion, estadisticas-alumno, etc.) se enlaza siempre. Es un modelo cliente-primero DOCUMENTADO en CLAUDE.md y app.js:2044-2048 ('TODA la verificación real la hace el servidor'), y NO constituye fuga de datos: los tiles están vacíos y los datos sensibles (alumnos, claves de familia, pagos) llegan por RPC de Supabase filtrada por RLS. El punto es de superficie/rendimiento, no de seguridad: un alumno o visitante recibe la lógica completa de administración del aula (código y estructura), lo que amplía la superficie inspeccionable y coincide con el hallazgo de rendimiento.
- **Impacto:** No hay exposición de datos de otro rol en el cliente (la frontera es RLS server-side, verificado en el patrón de padres.html/consulta-nube.html/convocatoria). El efecto real es peso descargado de más (ver hallazgo de rendimiento) y mayor superficie de código visible.
- **Evidencia:**
```
<div class="setting-group teacher-panel-group" id="teacher-tools-group" style="display:none;">
```
- **Solución:** No es un defecto de seguridad y no exige cambios por ese motivo. Si se aplica la carga diferida por herramienta (hallazgo de rendimiento), este código deja de entregarse a quien no ha iniciado sesión docente, resolviendo de paso la superficie. Mantener toda decisión de acceso a datos en RLS/RPC, como está.
- **Prioridad:** backlog

### 6. Rendimiento y escalabilidad

_El diseño es sólido en lo esencial: cola offline con tope (MAX_EVENTOS=4000, MAX_OUTBOX=1000), deduplicación por evento_id con ON CONFLICT, índices trigrama GIN sobre metas_norm(docente) que sí aceleran los LIKE '%…%' de las consultas del maestro, límites LIMIT en todas las RPC, e índice en convocatoria_respuestas(codigo). No se detectan patrones N+1 clásicos (padres.html usa Promise.all). Los riesgos reales son de escala a mediano plazo: (1) duplicación de FontAwesome CDN+local en 68 páginas que rompe el objetivo offline-first y bloquea el render en conexiones malas; (2) el estado del maestro se sincroniza como blob completo (no deltas) y sin tope de tamaño por valor en el servidor; (3) el LIMIT 2000 de consulta-nube truncará resultados antiguos de un aula activa en un trimestre; (4) la tabla resultados crece sin poda hacia el límite del plan gratuito. Ninguno es crítico hoy, pero varios se rozan cuando una escuela entera usa el enlace o pasa un curso completo._

#### 🟡 MEDIO — caching-recursos: FontAwesome se carga DOS veces (local + CDN) en 68 páginas, rompiendo el offline-first

- **Ubicación:** `index.html:11-12 (y mision.html:11-12 y 66 misiones más)`
- **Problema:** Cada página incluye la hoja de estilos de FontAwesome local Y la misma desde cdnjs. La versión CDN es un recurso externo que bloquea el render y, al declarar sus propias @font-face, hace que el navegador descargue TAMBIÉN los webfonts desde cdnjs, duplicando los .woff2 que sw.js ya precachea localmente. El sitio se sirve por Cloudflare Workers con la copia local ya presente y cacheada por el service worker; la línea del CDN es puro peso muerto.
- **Impacto:** En el internet de un pueblo (el usuario objetivo declarado) un recurso externo render-blocking puede tardar segundos o fallar; mientras carga, los iconos y a veces el layout quedan a medias. Si cdnjs está lento/bloqueado, la primera pintura se retrasa aunque la copia local esté en caché. Contradice el objetivo PWA offline: la app promete funcionar sin señal pero pide un CSS+fuentes remotos en 68 pantallas.
- **Evidencia:**
```
  <link rel="stylesheet" href="css/vendor/fontawesome/css/all.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
```
- **Solución:** Eliminar la línea del CDN (la segunda) en las 68 páginas y en el precache de sw.js (línea 38). La copia local en css/vendor/fontawesome ya cubre todos los iconos y ya está en la lista de precache (líneas 34-36). Es una sustitución mecánica; conviene sellar la versión (?v=NN y CACHE_NAME) como exige el proyecto.
- **Prioridad:** esta semana

#### 🟡 MEDIO — tamano-respuesta-sync: El estado del maestro se sube como blob completo (no deltas) y el servidor no limita su tamaño

- **Ubicación:** `js/metas-docente-sync.js:192 y SUPABASE-DOCENTE-ESTADO.sql:63-76`
- **Problema:** push() sube el valor RAW completo de cada clave cambiada (p.ej. METAS_ADMIN_V1, que contiene TODO el aula: lista de 10-12 grupos x 43 alumnos, economía, asistencia acumulada del curso y notas SACE) como un solo jsonb, no un delta. Cualquier edición mínima reenvía el blob entero. Peor: la RPC de guardado NO valida el tamaño de cada valor (a diferencia de metas_guardar_progreso, que rechaza pg_column_size(fila) > 100000). El pull de fondo cada ~20 s (setInterval en línea 602) descarga de nuevo todos los blobs para comparar hashes en el cliente.
- **Impacto:** A lo largo de un curso, con asistencia y notas acumulándose, METAS_ADMIN_V1 puede llegar a cientos de KB. Re-subirlo en cada cambio y re-bajarlo cada 20 s consume datos móviles del maestro (que muchas veces paga por MB) y satura la conexión lenta. Sin tope de servidor, un estado corrupto o inflado puede engordar la fila indefinidamente. El freno AUTO_MIN (15 s) y el guardado por hash mitigan la frecuencia pero no el volumen por transferencia.
- **Evidencia:**
```
      entradas.push({ k: k, valor: { raw: cur }, version: version, dispositivo: deviceId() });
```
- **Solución:** Añadir en metas_docente_estado_guardar una guarda de tamaño por entrada (p.ej. if pg_column_size(e->'valor') > 500000 then continue) como ya hace progreso. A mediano plazo, considerar comprimir el raw antes de subir o separar METAS_ADMIN_V1 en subclaves por grupo para no reenviar el aula entera al editar un solo grupo. Mantener el freno de 20 s pero condicionar el pull a un HEAD/version-check ligero en vez de traer todos los blobs.
- **Prioridad:** este mes

#### 🟡 MEDIO — paginacion-truncado: consulta-nube trunca a 2000 resultados sin avisar; un aula activa lo supera en un trimestre

- **Ubicación:** `SUPABASE-DOCENTES-V2.sql:372-373 (metas_consultar_docente) y :414 (progreso, limit 1000)`
- **Problema:** La RPC del maestro devuelve 'order by r.creado_en desc limit 2000'. Con 42 alumnos x ~57 misiones, cada una con múltiples formas de evaluación + prueba operativa + eventos pauta_vista, la tabla resultados por docente supera 2000 filas dentro de un periodo escolar. El LIMIT descarta silenciosamente lo MÁS ANTIGUO y el frontend (consulta-nube.html) no indica que hubo corte.
- **Impacto:** El maestro deja de ver resultados viejos del curso sin ninguna señal; los promedios y conteos de consulta-nube.html se calculan solo sobre las últimas 2000 filas y quedan sesgados. Como es descendente por fecha, lo que desaparece es justo el historial de comparación (avance en el tiempo).
- **Evidencia:**
```
      order by r.creado_en desc
      limit 2000;
```
- **Solución:** Subir el límite y/o paginar por rango de fechas (parámetros p_desde/p_hasta) o por misión, y mostrar en consulta-nube.html un aviso de 'mostrando las 2000 más recientes' cuando el resultado llegue tope. Requiere un índice de apoyo para el ORDER BY por docente+fecha (ver hallazgo de índice).
- **Prioridad:** este mes

#### ⚪ BAJO — indice-orden: El ORDER BY de la consulta del maestro es por creado_en pero el índice de fecha está sobre 'fecha'

- **Ubicación:** `SUPABASE-FASE1.md:97-98 (índices) vs SUPABASE-DOCENTES-V2.sql:372`
- **Problema:** Las consultas del maestro ordenan por r.creado_en desc, pero el único índice de tiempo declarado es resultados_fecha_idx sobre (fecha desc). El índice trigrama filtra primero a las filas de ese docente (bien), así que el sort posterior es sobre un conjunto acotado; aun así no hay índice que cubra creado_en para ese orden.
- **Impacto:** Mientras las filas por docente sean cientos, el sort en memoria es barato y no se nota. Solo se vuelve relevante si un docente acumula decenas de miles de filas. Riesgo bajo pero conviene registrarlo junto con la paginación.
- **Evidencia:**
```
create index if not exists resultados_fecha_idx on public.resultados (fecha desc);
```
- **Solución:** Si se implementa paginación por fecha, crear un índice compuesto que ayude al patrón real, p.ej. sobre (metas_norm(docente), creado_en desc) o al menos (creado_en desc), y confirmar con EXPLAIN ANALYZE que no cae en sort caro a escala.
- **Prioridad:** backlog

#### ⚪ BAJO — cliente-reflow: pintar() en consulta-nube hace una búsqueda anidada O(n·p) sobre hasta 2000 filas al renderizar

- **Ubicación:** `consulta-nube.html:289-300 (pintar) y :297`
- **Problema:** Por cada fila de resultado renderizada se ejecuta pautas.find(...) recorriendo el array de aperturas de pauta para detectar trampa. Es un bucle anidado O(n·p): hasta 2000 filas por el número de eventos pauta_vista, todo dentro del forEach que además hace createElement+appendChild fila por fila a un tbody ya vivo.
- **Impacto:** Con datasets grandes (cerca del tope de 2000) la re-pintada al aplicar un filtro puede congelar la UI un instante en un teléfono modesto. No hay corrupción de datos; es una molestia de fluidez proporcional al volumen.
- **Evidencia:**
```
        const vio=pautas.find(p=>p.mision===r.mision && p.dispositivo===r.dispositivo &&
          (p.fecha||p.creado_en)<tEv && fmtF(p.fecha||p.creado_en).f===f);
```
- **Solución:** Pre-indexar las pautas una sola vez en un Map por clave (mision+'|'+dispositivo) antes del forEach y consultar el Map en O(1); construir las filas en un DocumentFragment y hacer un solo appendChild al final para evitar reflows repetidos.
- **Prioridad:** backlog

#### ⚪ BAJO — escalabilidad-backend: La tabla resultados crece sin poda hacia el límite del plan gratuito de Supabase

- **Ubicación:** `SUPABASE-FASE1.md:70 (create table resultados) — sin borrado en ningún SQL`
- **Problema:** resultados guarda una fila por cada evaluación de cada alumno de todas las escuelas, para siempre. No hay proceso de poda ni archivado. El plan gratuito de Supabase ronda 500 MB de base; a ~300 bytes por fila son ~1.7M filas, alcanzables con varias escuelas a lo largo de cursos (la meta declarada es crecer a todo el currículo y a Latinoamérica).
- **Impacto:** A gran escala la base puede acercarse al tope del plan y degradar inserciones/consultas. Hoy con pocos usuarios no es problema; es un riesgo de la trayectoria de crecimiento que el propio proyecto plantea.
- **Evidencia:**
```
create table if not exists public.resultados (
  id bigint generated always as identity primary key,
  evento_id text not null unique,
```
- **Solución:** Definir una política de retención (p.ej. archivar/borrar resultados de cursos cerrados a una tabla fría o exportarlos vía el CSV que ya existe) y monitorear el tamaño. No urge, pero conviene decidirlo antes de sumar escuelas.
- **Prioridad:** backlog

#### ⚪ BAJO — perdida-datos-escala: El outbox descarta las filas MÁS ANTIGUAS al llegar a 1000, perdiéndolas de la nube

- **Ubicación:** `js/metas-supabase.js:43 (escribirCola)`
- **Problema:** MAX_OUTBOX=1000 es un tope razonable, pero al superarlo se conserva el final del array (las 1000 más nuevas) y se descartan las más antiguas. Como backfill() solo corre una vez (marca METAS_SB_BACKFILL_V1), una fila descartada del outbox no vuelve a encolarse: queda en METAS_REGISTRO_V1 local pero nunca llega a resultados.
- **Impacto:** Solo se materializa con uso sostenido offline y alto volumen (un equipo compartido de aula sin señal durante mucho tiempo mientras 42 alumnos evalúan). En ese caso las evaluaciones más viejas no sincronizadas se pierden en la nube en silencio. Escenario poco frecuente pero es pérdida de datos de menores.
- **Evidencia:**
```
    if (filas.length > MAX_OUTBOX) filas = filas.slice(filas.length - MAX_OUTBOX);
```
- **Solución:** Subir el tope o, mejor, al recortar el outbox emitir un aviso visible / registrar el corte; y considerar un backfill idempotente que compare METAS_REGISTRO_V1 contra lo confirmado en nube en vez de correr una sola vez, para poder recuperar lo descartado cuando vuelva la señal.
- **Prioridad:** backlog

#### ⚪ BAJO — latencia-red: consulta-nube hace dos RPC secuenciales en vez de en paralelo

- **Ubicación:** `consulta-nube.html:236-243 y :246-251`
- **Problema:** consultar() espera (await) el fetch de metas_consultar_docente y solo después lanza metas_consultar_progreso_docente. padres.html sí paraleliza con Promise.all; aquí las dos llamadas independientes van en serie.
- **Impacto:** Suma la latencia de las dos redondas de red en lugar de solaparlas; en una conexión lenta duplica la espera percibida al entrar. Sin impacto de correctitud.
- **Evidencia:**
```
    DATOS = await r.json();
    if (!Array.isArray(DATOS)) DATOS = [];
    let PROG = [];
    try {
      const rp = await fetch(SB_URL + '/rest/v1/rpc/' + rpc2, {
```
- **Solución:** Lanzar ambos fetch a la vez con Promise.all (como en padres.html) y pintar cuando resuelvan, tolerando que progreso falle por separado.
- **Prioridad:** backlog

#### ⚪ BAJO — cliente-cpu: snapshotProgreso recorre y serializa hasta 4000 eventos en cada cambio de registro

- **Ubicación:** `js/metas-supabase.js:165-220 (snapshotProgreso) y :174`
- **Problema:** Cada evento 'metas:registro' programa (debounce 12 s) un snapshotProgreso que hace un forEach sobre METAS_REGISTRO_V1 completo (tope 4000) más un JSON.stringify para comparar con el último enviado. Es O(n) por foto.
- **Impacto:** 4000 elementos es pequeño para un móvil moderno; el debounce evita repetirlo por ráfaga. Riesgo mínimo, se anota por completitud: si algún día sube MAX_EVENTOS o se añaden campos pesados, este recálculo total por cambio empieza a notarse en equipos muy modestos.
- **Evidencia:**
```
    eventos.forEach(function (ev) {
      if (!ev || !ev.mision) return;
      // en dispositivos compartidos, cuenta solo lo del alumno actual
      if (ev.alumno && nombre && ev.alumno !== nombre) return;
```
- **Solución:** Suficiente por ahora. Si crece, calcular el resumen de forma incremental al encolar cada evento en vez de rehacer el barrido completo, o cachear el snapshot y actualizar solo el delta del alumno actual.
- **Prioridad:** backlog

### 7. DevOps y despliegue

_El proyecto es un sitio estático servido por dos tejados (Cloudflare Workers + GitHub Pages) sin ninguna automatización: no existe .github/, npm test es un stub que falla, y las 41 sondas _dev/verifica-*.js / test-*.js se corren a mano, sin nada que impida publicar un cambio roto en producción con datos de menores. Los mayores riesgos operativos son la ausencia total de CI/CD, la falta de una estrategia de respaldo de la base de datos Supabase (respaldo-rapido.cmd solo respalda código), la divergencia posible entre los dos tejados (GitHub Pages publica solo al hacer push; Cloudflare exige `npx wrangler deploy` a mano), y node_modules versionado (2600 de 4439 archivos) sin .gitignore. No se hallaron secretos reales filtrados: la clave publishable de Supabase es pública por diseño y no aparece ninguna service_role ni credencial privada._

#### 🟡 MEDIO — deployment: www/ versionado y muy desfasado (SW v48 frente a v151 en la raíz): riesgo de servir la app vieja

- **Ubicación:** `www/sw.js:1 (meta-app-v48) vs sw.js:1 (meta-app-v151) ; www/ (536 archivos rastreados)`
- **Problema:** La copia www/ (que Capacitor usa para Android) está versionada en git y hoy va 103 versiones por detrás: su service worker es meta-app-v48 y su index.html sella ?v=48, mientras la raíz está en v151. CLAUDE.md dice que este desfase es 'a propósito' hasta recompilar la app, y .assetsignore excluye www/ de Cloudflare —correcto—. Pero GitHub Pages NO sabe ignorar (lo dice el propio .assetsignore) y sirve www/ en metas.policastsapien.com/www/.
- **Impacto:** Cualquier enlace, marcador o registro accidental hacia /www/ (o /www/sw.js) sirve una app 103 versiones vieja con su propio service worker, que podría reclamar el control del scope si algún cliente lo registra. El desfase es deliberado para el APK, pero exponerlo por GitHub Pages es un pie de más que no aporta nada al sitio web y sí puede confundir cachés.
- **Evidencia:**
```
sw.js:1:const CACHE_NAME = 'meta-app-v151';
www/sw.js:1:const CACHE_NAME = 'meta-app-v48';
```
- **Solución:** Impedir que GitHub Pages sirva www/: publicar GitHub Pages desde una carpeta/branch que no incluya www/, o dejar de versionar www/ (regenerándolo con build:www solo cuando se compila el APK). El desfase para Android puede vivir fuera de git o en una rama de build, no en el árbol que dos tejados publican.
- **Prioridad:** este mes

#### 🟡 MEDIO — disponibilidad: 68 páginas cargan Font Awesome desde CDN externo (cdnjs) sin SRI, en una app pensada para funcionar sin señal

- **Ubicación:** `index.html:12 ; mision.html:12 ; sw.js:36 (68 archivos HTML en total)`
- **Problema:** 68 archivos HTML enlazan Font Awesome desde https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css, sin atributo integrity (SRI). El service worker además pre-cachea esa URL externa y la de Google Fonts. Existe una copia local vendorizada (css/vendor/fontawesome/), lo que hace la dependencia del CDN redundante y evitable. En la primera visita sin caché, la app depende de un tercero para pintar sus iconos.
- **Impacto:** En un pueblo 'sin señal y a veces sin luz' (CLAUDE.md), un maestro que abre la app por primera vez con conexión intermitente puede quedarse sin iconos si cdnjs no responde o está bloqueado por el proveedor. Sin SRI, además, si el recurso del CDN se altera, se ejecuta/aplica CSS de terceros sin verificación. Contradice el principio de 'HTML/CSS/JS servidos tal cual' del propio proyecto.
- **Evidencia:**
```
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
```
- **Solución:** Usar la copia local ya presente en css/vendor/fontawesome/ y eliminar el enlace a cdnjs en las 68 páginas (y de STATIC_ASSETS del sw.js), o, si se mantiene el CDN, añadirle integrity + crossorigin. Reduce la superficie de fallo offline y de supply-chain sin salir del stack.
- **Prioridad:** este mes

#### 🟡 MEDIO — monitoreo: Sin telemetría ni alertas de errores en producción: se vuela a ciegas con datos de menores

- **Ubicación:** `todo el frontend (no hay Sentry/logging: búsqueda sin resultados) ; SUPABASE-*.sql`
- **Problema:** No hay ninguna integración de monitoreo de errores en el cliente (Sentry u similar no aparece en el código) ni un canal donde aterricen los fallos de las RPC de Supabase o de la sincronización (js/metas-docente-sync.js). El único 'reporte de fallos' es humano: el maestro que nota algo en el aula, o las Sugerencias que ahora sí salen. Los errores de red hacia Supabase se tragan silenciosamente (patrón .catch en el sw y en las colas).
- **Impacto:** Si la sincronización del maestro empieza a fallar, si una RPC devuelve error para un subconjunto de usuarios, o si una tabla RLS rechaza escrituras tras un cambio de SQL, nadie se entera hasta que un maestro reporta pérdida de datos. Con información de menores en juego, no tener señal de que algo se está rompiendo alarga el tiempo entre el fallo y la corrección.
- **Evidencia:**
```
Búsqueda de 'service_role|Sentry|monitoring' y de sistemas de alertas: sin coincidencias en el código de la aplicación.
```
- **Solución:** Añadir un capturador de errores ligero en el frontend (un window.onerror + envío a una tabla Supabase de logs con RLS de solo-inserción, o Sentry con su clave pública) para al menos contar y fechar fallos. Y revisar los paneles/alertas de Supabase (logs de RPC, errores de auth) para tener un tablero de salud, aunque sea manual.
- **Prioridad:** este mes

#### 🟡 MEDIO — portabilidad-build: build:www usa robocopy: el pipeline de www/ y del APK solo funciona en Windows

- **Ubicación:** `package.json:7-9`
- **Problema:** El script build:www invoca `robocopy`, comando exclusivo de Windows, y los scripts de instalación (sincronizar-e-instalar.bat, install:android con gradlew.bat) son .bat/.cmd de Windows. No hay alternativa multiplataforma. Toda la regeneración de www/ y la compilación del APK está atada a una única máquina Windows.
- **Impacto:** Si el mantenedor cambia de equipo, o si algún día se quiere automatizar el build de www/ o del APK en CI (que corre Linux), nada de esto funciona sin reescribirlo. Combinado con www/ versionado y desfasado, refuerza el riesgo de que la copia www/ se quede vieja porque solo una persona en un solo SO puede regenerarla.
- **Evidencia:**
```
"build:www": "robocopy . www /E /XD android node_modules .git .claude www _dev /XF *.md package.json package-lock.json capacitor.config.json .gitignore /NFL /NDL /NJH /NJS /NC /NS & exit 0"
```
- **Solución:** Sustituir robocopy por una copia multiplataforma (un pequeño script Node con fs/cpSync respetando las mismas exclusiones, o herramientas como cpy/rsync) para que build:www corra en Linux/macOS y en CI. No cambia el resultado, solo desata el build de un único SO.
- **Prioridad:** backlog

#### 🟡 MEDIO — versionado-assets: Sellado de versión manual (?v=NN en 5 HTML + CACHE_NAME en sw.js): fácil de olvidar, y el propio CLAUDE.md lo admite frágil

- **Ubicación:** `sw.js:1 (CACHE_NAME) ; index.html (26 ocurrencias de ?v=151) ; mision.html, consulta-nube.html, evaluaciones.html, registro.html`
- **Problema:** Cada cambio de HTML/CSS/JS obliga a subir a mano el número en dos sitios: las etiquetas ?v=NN de cinco HTML y CACHE_NAME en sw.js. Es un paso puramente humano sin verificación automática. CLAUDE.md lo reconoce: 'Si no se sella, el despliegue existe pero nadie lo ve'. No hay sonda que compruebe que la versión subió ni que ?v y CACHE_NAME estén sincronizados.
- **Impacto:** Un olvido publica el cambio pero el teléfono del maestro sigue sirviendo la versión cacheada: el arreglo existe en el servidor y nadie lo recibe. Es un fallo silencioso —el peor tipo— porque la publicación 'tuvo éxito'. La consistencia entre los 6 sitios queda librada a no equivocarse.
- **Evidencia:**
```
const CACHE_NAME = 'meta-app-v151';   // sw.js:1
$ grep -oE '\?v=[0-9]+' index.html | sort | uniq -c
     26 ?v=151
```
- **Solución:** Añadir una sonda a la batería (o un paso de CI) que verifique que CACHE_NAME y todos los ?v=NN de los HTML coinciden y que subieron respecto al commit anterior. Mejor aún: derivar el número de una sola fuente y escribirlo con un script de 'sellar versión' en vez de a mano en 6 lugares.
- **Prioridad:** este mes

#### ⚪ BAJO — ci-cd: No hay CI/CD y `npm test` es un stub que falla: nada impide publicar un cambio roto

- **Ubicación:** `package.json:10 ; ausencia de .github/` _(verificado: ajustado de ALTO a BAJO)_
- **Problema:** No existe carpeta .github/ (verificado: 'NO .github'), así que ningún pipeline corre las sondas antes de publicar. Y el único gancho estándar, `npm test`, está deshabilitado: devuelve error a propósito. Las 41 sondas (_dev/verifica-*.js y _dev/test-*.js) existen y son buenas, pero solo protegen si alguien se acuerda de correrlas a mano, una por una, contra un servidor local con Playwright instalado aparte. La política de CLAUDE.md ('cada cambio terminado se commitea y se sube a main, de donde se publica') significa que un push equivale a publicar sin ninguna barrera automática.
- **Impacto:** Un cambio que rompe la convocatoria (buses/dinero), la lectura (palabras por minuto que van al expediente del niño) o la sincronización del maestro llega a producción sin que nada lo detenga. La verificación queda a la disciplina humana; el día que se olvide una sonda, el maestro lo descubre en el aula. En una plataforma con datos de menores, volar sin red de pruebas automática es el riesgo operativo de fondo del que cuelgan casi todos los demás.
- **Evidencia:**
```
"test": "echo \"Error: no test specified\" && exit 1"
```
- **Solución:** Añadir un workflow en .github/workflows/ que en cada push a main levante `node _dev/servidor-estatico.js`, instale Playwright y corra las sondas relevantes (verifica-convocatoria, verifica-buzon, verifica-una-hoja, verifica-lectura-mision, los test-determinismo, verifica-nombres-propios) fallando el build si alguna falla. Alternativamente, cablear `npm test` para que ejecute ese lote y usarlo como pre-push hook. No cambia el stack estático: solo mueve las sondas de 'a mano' a 'obligatorias'.
- **Prioridad:** esta semana

#### ⚪ BAJO — backups: No hay respaldo de la base de datos: respaldo-rapido.cmd solo salva el código, no los datos de las familias

- **Ubicación:** `respaldo-rapido.cmd:1-16` _(verificado: ajustado de ALTO a BAJO)_
- **Problema:** El único mecanismo de respaldo del proyecto hace `git add -A` + `git commit` + `git push`: respalda el CÓDIGO fuente a GitHub. Los datos reales —maestros, alumnos, claves de familia, notas, conducta, pagos de convocatoria, respuestas del buzón de menores— viven en Supabase (Postgres) y NO se respaldan en ningún sitio del repositorio ni con ningún script. No hay pg_dump, ni exportación programada, ni mención de la política de backups del plan de Supabase.
- **Impacto:** Un borrado accidental por una RPC, una migración SQL mal pegada (los SUPABASE-*.sql se copian a mano en el editor desde una tableta, según CLAUDE.md) o un incidente en Supabase se lleva por delante datos de menores sin punto de restauración conocido. El nombre del script ('respaldo rapido ante cortes de energia') puede dar falsa sensación de que 'ya hay backup', cuando lo que salva es lo único que además está en GitHub.
- **Evidencia:**
```
rem Respaldo express ante cortes de energia: commit de todo lo pendiente + push.
git add -A
git diff --cached --quiet && echo No hay cambios pendientes: todo ya esta respaldado. && goto push
```
- **Solución:** Documentar y automatizar un pg_dump periódico de Supabase (cron externo, GitHub Action programada con `supabase db dump`, o los Point-in-Time/backups del plan de pago de Supabase) guardado fuera del propio Supabase. Renombrar/aclarar en el script que respalda código, no datos, para no confundir. Verificar y anotar qué retención de backups ofrece el plan Supabase actual.
- **Prioridad:** esta semana

#### ⚪ BAJO — deployment: Los dos tejados pueden divergir: GitHub Pages publica al hacer push, pero Cloudflare exige `wrangler deploy` a mano

- **Ubicación:** `wrangler.jsonc:1-16 ; CNAME:1 ; ausencia de .github/` _(verificado: ajustado de ALTO a BAJO)_
- **Problema:** GitHub Pages (custom domain vía CNAME) republica automáticamente en cada push a main. Cloudflare Workers, en cambio, solo se actualiza cuando alguien ejecuta `npx wrangler deploy` a mano —no hay Action que lo dispare, porque no existe .github/. CLAUDE.md afirma que 'publicar es el final del trabajo' y que un push equivale a publicar; eso es cierto para GitHub Pages pero FALSO para Cloudflare. Según a cuál de los dos apunte el DNS de metas.policastsapien.com (no verificable desde el repo), un push puede dejar Cloudflare sirviendo la versión vieja indefinidamente.
- **Impacto:** El maestro puede recibir la versión anterior aunque el commit diga 'publicado'. Con el esquema de caché agresivo (network-first + service worker), una divergencia entre tejados hace que unos usuarios vean el arreglo y otros no, y el que hizo el cambio no tiene forma de saberlo sin comprobar ambos orígenes. Es exactamente el tipo de fallo silencioso que CLAUDE.md quiere evitar con 'sellar la versión'.
- **Evidencia:**
```
Cloudflare publica desde aquí con «npx wrangler deploy» (el comando por defecto de su panel);
   GitHub Pages sigue funcionando igual como respaldo
```
- **Solución:** Automatizar `wrangler deploy` en una GitHub Action disparada por push a main (usando un CLOUDFLARE_API_TOKEN en Secrets), para que los dos tejados se publiquen del mismo commit. Documentar cuál origen es el primario en DNS. Así 'push = publicado' vuelve a ser verdad en ambos.
- **Prioridad:** esta semana

#### ⚪ BAJO — gestion-dependencias: node_modules versionado (2600 de 4439 archivos) y sin ningún .gitignore en el repo

- **Ubicación:** `raíz del repo (no existe .gitignore) ; node_modules/ (2600 archivos rastreados por git)` _(verificado: ajustado de ALTO a BAJO)_
- **Problema:** `git ls-files node_modules` devuelve 2600 archivos: el árbol de dependencias de Capacitor está commiteado. Además NO existe .gitignore en la raíz (`ls .gitignore` → No such file or directory). node_modules supone el 59% de los 4439 archivos rastreados. Sin .gitignore, cualquier instalación temporal (CLAUDE.md pide instalar Playwright con `npm install --no-save` y borrarlo 'porque node_modules va versionado') o cualquier basura de build puede colarse a un commit sin aviso.
- **Impacto:** Repositorio inflado y lento; las versiones de dependencias quedan congeladas en git en vez de en package-lock, dificultando parches de seguridad; GitHub Pages sirve /node_modules/ públicamente (queda expuesto el árbol y versiones exactas de dependencias a cualquiera). Y la ausencia de .gitignore convierte 'borrar Playwright al terminar' en un paso manual frágil: el primer olvido mete cientos de archivos al repo.
- **Evidencia:**
```
$ git ls-files node_modules | wc -l
2600
$ ls -la .gitignore
ls: cannot access '.gitignore': No such file or directory
```
- **Solución:** Crear un .gitignore que excluya node_modules/, y (si Capacitor lo permite en el flujo Windows) dejar de versionar node_modules confiando en package-lock.json + `npm ci`. Añadir también a .assetsignore ya cubre Cloudflare, pero GitHub Pages seguirá sirviéndolo mientras esté en git. Si por el flujo offline de Windows se decide mantenerlo, al menos fijarlo conscientemente y documentar por qué, y añadir .gitignore para el resto de artefactos temporales.
- **Prioridad:** esta semana

#### ⚪ BAJO — configuracion: Clave publishable de Supabase duplicada en 14 archivos: rotarla obliga a tocar 14 sitios

- **Ubicación:** `js/metas-supabase.js, js/app.js, js/metas-registro.js, js/metas-docente-sync.js, js/tools/{estadisticas-alumno,plan-accion,campeonismo,convocatoria,registros-admin}.js, salida.html, camp-vivo.html, consulta-nube.html, panel-docente.html, padres.html (14 archivos)`
- **Problema:** La clave publishable (sb_publishable_...) y la URL de Supabase están repetidas literalmente en 14 archivos. Esto NO es un secreto filtrado —la publishable es pública por diseño y la frontera real de seguridad son las RLS/RPC, fuera del alcance de esta auditoría DevOps— pero la duplicación es un problema operativo: no hay una única fuente de configuración. No se halló ninguna service_role ni credencial privada (búsqueda de service_role/secret_key/BEGIN sin resultados).
- **Impacto:** Si Supabase obliga a rotar la clave publishable (o se migra de proyecto), hay que editar 14 archivos sin fallar ninguno, con la copia www/ además desfasada. Un archivo que se olvide queda apuntando a la clave/proyecto viejo y esa pantalla deja de sincronizar en silencio.
- **Evidencia:**
```
$ grep -rl 'sb_publishable_VGj7He4XL8AGscsY3RsxGg' --include=*.html --include=*.js . | grep -v node_modules | grep -v www/ | wc -l
14
```
- **Solución:** Centralizar URL y clave publishable en un único js/metas-config.js que cargue el resto de páginas (una línea <script>), para que rotar la clave sea cambiar un solo lugar. Es una decisión de diseño mejorable, no un fallo de seguridad.
- **Prioridad:** backlog

#### ⚪ BAJO — ssl-tls: HSTS y cabeceras de seguridad no controlables desde el repo estático (anotado)

- **Ubicación:** `wrangler.jsonc:1-16 (assets estáticos, sin sección de headers) ; CNAME:1`
- **Problema:** No se cargó ningún recurso por http:// (verificado: búsqueda de src/href/fetch http:// sin coincidencias, bien). Pero al ser un despliegue de solo-assets (Cloudflare Workers con assets y GitHub Pages), no hay forma en el repo de fijar HSTS, CSP ni otras cabeceras de seguridad; dependen de la configuración del panel de Cloudflare/GitHub, no versionable aquí. Se anota como recordatorio, no como defecto del código.
- **Impacto:** Sin HSTS, una primera visita por http podría degradarse antes del redirect a https; sin CSP se pierde una capa de defensa ante inyección. En una app usada por familias en redes públicas, conviene tener HSTS activo. El repo no puede garantizarlo ni comprobarlo.
- **Evidencia:**
```
wrangler.jsonc: "assets": { "directory": "./" }  (no hay bloque de headers/_headers ni configuración de seguridad de transporte)
```
- **Solución:** Confirmar en el panel de Cloudflare que HSTS (con preload) y 'Always Use HTTPS' están activos, y valorar añadir un archivo de cabeceras (Cloudflare soporta reglas/_headers) con CSP básica y HSTS, versionado, para que la política deje de vivir solo en un panel. Es configuración de plataforma, fuera del código.
- **Prioridad:** backlog

### 8. Deuda técnica

_El proyecto es un sitio estático sin build, con misiones autónomas que se copian entre sí; muchas "duplicaciones" son deliberadas y están justificadas en CLAUDE.md (grupoTxt, convFolio/folioDe, framework por misión). No hay marcadores TODO/FIXME reales (solo 2 "PENDIENTE" y la palabra española "todo"). La deuda objetiva real es de HIGIENE DE REPOSITORIO y CENTRALIZACIÓN: node_modules está versionado con Playwright dentro (que CLAUDE.md manda borrar), la configuración de Supabase (URL+clave anon) se redeclara localmente en ~12 módulos js en vez de reusar el único SB_URL existente, el motor de evaluación y html2canvas viven copiados 66-67 veces, y varios .sql superados no llevan el banner OBSOLETO que sí tiene SUPABASE-DOCENTES.sql. Las colisiones de id detectadas están en ramas de plantilla mutuamente excluyentes, no vivas como el bug cv-wa. La raíz mezcla 10+ documentos de propuesta/investigación (incl. 2 PDF pesados) con el código._

#### 🟡 MEDIO — dependencias: Playwright (19 MB) quedó versionado dentro de node_modules, contra la propia norma de CLAUDE.md

- **Ubicación:** `node_modules/playwright/ y node_modules/playwright-core/ (2600 archivos de node_modules trackeados en git)` _(verificado: ajustado de ALTO a MEDIO)_
- **Problema:** CLAUDE.md dice literalmente que Playwright «se instala aparte (npm install --no-save playwright) y se borra al terminar, porque node_modules va versionado en este repositorio y si no queda el árbol sucio». Sin embargo Playwright 1.62.1 y playwright-core están COMMITEADOS en git (git ls-files los lista), no solo presentes en disco. El árbol sucio que la norma quiere evitar ya está subido.
- **Impacto:** El repositorio pesa de más: .git ocupa 90 MB y node_modules trackeado son 2600 archivos (52 MB en disco, 19 MB solo de playwright+playwright-core). Clonar y sincronizar la app Android (que copia el repo) arrastra binarios de test que no son de aula. Cada actualización de Playwright genera diffs enormes de dependencias que nadie revisa.
- **Evidencia:**
```
$ git ls-files node_modules/playwright | head
node_modules/playwright/LICENSE
node_modules/playwright/NOTICE
$ cat node_modules/playwright/package.json → "version": "1.62.1"
$ du -sh node_modules/playwright node_modules/playwright-core → 5.1M + 14M
```
- **Solución:** git rm -r --cached node_modules/playwright node_modules/playwright-core (y sus dependencias exclusivas de test), añadirlos a .gitignore, y confirmar que las @capacitor/* siguen versionadas si esa es la decisión. Alternativamente dejar de versionar node_modules por completo y documentar `npm ci` en el arranque; hoy .assetsignore ya lo excluye del hosting, así que solo pesa en git.
- **Prioridad:** esta semana

#### 🟡 MEDIO — duplicacion-no-deliberada: La configuración de Supabase (URL + clave anon) se redeclara a mano en ~12 módulos js en vez de reusar el SB_URL que ya existe

- **Ubicación:** `js/metas-supabase.js:22 (SB_URL), y redeclarada en js/app.js:1243, js/metas-registro.js:420, js/tools/estadisticas-alumno.js:79, js/tools/plan-accion.js:1027, js/tools/campeonismo.js:2155, js/tools/convocatoria.js:137, js/tools/registros-admin.js:5026/5494/5812/6051, js/metas-docente-sync.js:56`
- **Problema:** Existe una única fuente lógica (js/metas-supabase.js define var SB_URL). Pese a ello, cada módulo del MISMO bundle de la app del maestro vuelve a escribir su propia copia local del endpoint y de la clave. No es el caso de las páginas autónomas del padre (salida/padres/buzon), que sí necesitan su copia por diseño: estos son módulos js que se cargan todos juntos y podrían compartir la constante. La clave anon es pública por diseño (correcto, NO es fuga de secreto), pero su repetición es deuda de mantenimiento igual.
- **Impacto:** El día que se rote la clave o se migre de proyecto Supabase hay que editar ~12 puntos en 7 archivos; olvidar uno deja un módulo apuntando al proyecto viejo y fallando en silencio (justo el tipo de error que en producción se descubre en el aula). El grep confirma 15 archivos con la URL y 12 apariciones de la clave solo en js/.
- **Evidencia:**
```
js/app.js:1243  let url = 'https://uljjgrikyigdrkbikcxo.supabase.co';
js/metas-registro.js:420  var url = 'https://uljjgrikyigdrkbikcxo.supabase.co';
js/metas-supabase.js:22  var SB_URL = 'https://uljjgrikyigdrkbikcxo.supabase.co';
js/tools/registros-admin.js:5026/5494/5812/6051  let url = 'https://uljjgrikyigdrkbikcxo.supabase.co';
```
- **Solución:** Exponer SB_URL y SB_KEY desde js/metas-supabase.js (p.ej. window.METAS_SB = {url,key}) y que app.js y los tools/*.js lo lean en vez de redeclarar. Las páginas autónomas del padre siguen con su copia propia (patrón deliberado). No requiere build: es un global compartido.
- **Prioridad:** este mes

#### 🟡 MEDIO — duplicacion-arquitectonica: El motor de evaluación por Formas y html2canvas viven copiados 66-67 veces, uno por misión, con divergencias ya visibles

- **Ubicación:** `66 archivos js/ de misiones contienen _evalRng/_evalFormaSelector; 67 copias de html2canvas.min.js (una por misión + js/html2canvas.min.js)`
- **Problema:** Cada misión es autónoma (diseño deliberado del framework gamificado, sin build), pero eso multiplica el mismo motor de barajado de exámenes y la misma librería vendorizada por decenas de archivos. Ya hay divergencia real en el código inline: unas misiones escriben `sfx('click'); _evalFormaSelector();...`, otras `_evalFormaSelector(); const _selF=...` sin el sfx, otras pegan el bloque en una sola línea sin saltos. Un arreglo del motor (un sesgo en el reparto de la respuesta correcta, un bug de semilla) hay que aplicarlo 66 veces a mano.
- **Impacto:** Riesgo de divergencia: corregir un fallo del motor o parchear una CVE de html2canvas obliga a tocar 66-67 archivos, y es fácil que unas misiones queden parcheadas y otras no. La duplicación de html2canvas.min.js (1.4.1) también infla el repo.
- **Evidencia:**
```
$ grep -rln _evalRng misiones/ | wc -l → 66
$ find . -name html2canvas.min.js -not -path '*/www/*' -not -path '*/node_modules/*' | wc -l → 67
misiones/2y3ciclo-los-continentes-america-oceania-antartida/js/continentes-aoa.js:805 (bloque en una línea, sin sfx) vs misiones/2y3ciclo-angulo-bisectriz/js/angulos.js:531 (con sfx('click') al inicio)
```
- **Solución:** Es una tensión conocida del diseño sin build: donde sea posible, extraer el motor de evaluación y html2canvas a un único js/ compartido cargado por <script src> desde las misiones (como ya se hace con js/data/misiones.js), en vez de copiarlo en cada carpeta. Si se mantiene la copia por autonomía, al menos centralizar html2canvas en un solo archivo referenciado por ruta relativa.
- **Prioridad:** backlog

#### 🟡 MEDIO — codigo-muerto: SQL superados conviven en la raíz sin el banner OBSOLETO que sí lleva SUPABASE-DOCENTES.sql

- **Ubicación:** `SUPABASE-ROLES.sql, SUPABASE-PLAN-FECHA.sql, SUPABASE-PLAN-PARCIAL.sql (comparar con SUPABASE-DOCENTES.sql:2)`
- **Problema:** SUPABASE-DOCENTES.sql SÍ avisa en su cabecera «⚠️⚠️ OBSOLETO — NO VOLVER A CORRER ESTE ARCHIVO ⚠️⚠️ Reemplazado por SUPABASE-DOCENTES-V2.sql». En cambio SUPABASE-PLAN-FECHA.sql (superado por SUPABASE-PLAN-FECHA-DEDUP.sql, cuya cabecera dice «FECHA DE LA PRUEBA restaurada + SIN duplicados») y SUPABASE-ROLES.sql (junto a ROLES-V2) no llevan ninguna marca de estado. El propio flujo documentado es que el autor copia el .sql desde una tableta sin el repo delante.
- **Impacto:** El riesgo es exactamente el que DOCENTES.sql advierte: pegar en el SQL Editor la versión vieja después de la nueva revierte funciones. Con PLAN-FECHA, correr el antiguo sobre el DEDUP puede reintroducir duplicados/perder columnas. Al no estar rotulado, desde la tableta no hay forma de saber cuál es el vigente sin leer los dos enteros.
- **Evidencia:**
```
SUPABASE-DOCENTES.sql:2  -- ⚠️⚠️ OBSOLETO — NO VOLVER A CORRER ESTE ARCHIVO ⚠️⚠️
SUPABASE-PLAN-FECHA-DEDUP.sql:2  -- M.E.T.A.S — Supabase: FECHA DE LA PRUEBA restaurada + SIN duplicados
(SUPABASE-PLAN-FECHA.sql y SUPABASE-ROLES.sql: grep de 'obsolet|reemplaz|no correr' → sin resultados)
```
- **Solución:** Añadir la misma cabecera de estado (OBSOLETO / reemplazado por X / correr solo si...) a los .sql superados, o moverlos a una carpeta _sql-historico/. Es coherente con la norma de CLAUDE.md de que el SQL se copia a mano desde una tableta: la marca tiene que verse al abrir el archivo.
- **Prioridad:** este mes

#### ⚪ BAJO — consistencia: Mezcla de var/let/const para la misma variable de configuración entre módulos

- **Ubicación:** `js/metas-registro.js:420 (var url), js/app.js:1243 (let url), js/metas-supabase.js:22 (var SB_URL), js/tools/*.js (let url)`
- **Problema:** No hay convención uniforme: unos módulos usan `var url`, otros `let url`, otros `var SB_URL`, para el mismo endpoint. También conviven español/inglés en identificadores (url/key vs SB_URL). Es coherente que el proyecto sea plano sin linter, pero la inconsistencia dificulta leer y buscar.
- **Impacto:** Bajo: no hay bug funcional. Solo fricción de mantenimiento y de búsqueda (grep por 'let url' no encuentra las 'var url').
- **Evidencia:**
```
js/metas-registro.js:420  var url = 'https://uljjgrikyigdrkbikcxo.supabase.co';
js/app.js:1243  let url = 'https://uljjgrikyigdrkbikcxo.supabase.co';
```
- **Solución:** Al centralizar la config (hallazgo de duplicación), el problema desaparece solo. Como norma ligera, preferir const para lo que no se reasigna.
- **Prioridad:** backlog

#### ⚪ BAJO — consistencia: Ids de DOM repetidos dentro de un mismo archivo (en ramas de plantilla, no colisión viva como cv-wa)

- **Ubicación:** `salida.html:887 y 891 (id="g-compartir"); buzon.html:830/911 (id="e-enviar"), 823/904 (id="e-ok"), 1420/1431 (id="m-retirar"), y e-err/e-ok/e-volver/m-volver`
- **Problema:** A diferencia del bug cv-wa que documenta CLAUDE.md (dos elementos VIVOS con el mismo id a la vez), estos ids repetidos están en ramas de plantilla mutuamente excluyentes: en salida.html es un ternario (respondió → botón A / si no → botón B), y en buzon.html son funciones de render distintas según la puerta elegida. Verificado leyendo el contexto: solo una rama entra al DOM cada vez, así que getElementById acierta. Pero el patrón es frágil: si algún día las dos ramas llegaran a renderizarse juntas (p.ej. reutilizando una plantilla), reaparece exactamente el fallo de cv-wa (el listener se ata al primero y el segundo queda mudo).
- **Impacto:** Hoy no hay bug. Riesgo latente de que una refactorización futura convierta estas ramas en simultáneas y un botón deje de responder sin error visible.
- **Evidencia:**
```
salida.html:887  <button ... id="g-compartir">↗️ Avisarle a otro papá o mamá</button>
salida.html:891  <button ... id="g-compartir">↗️ Pasarle el enlace a otro papá o mamá</button>  (rama else del ternario)
buzon.html:830  <button ... id="e-enviar">🎓 Mandarlo</button>
buzon.html:911  <button ... id="e-enviar">📤 Mandarlo a la revista</button>
```
- **Solución:** Dar ids distintos por rama (g-compartir-si / g-compartir-no, e-enviar-metas / e-enviar-revista) aunque hoy no colisionen, para blindar contra el fallo cv-wa si las plantillas se fusionan. Coste mínimo.
- **Prioridad:** backlog

#### ⚪ BAJO — codigo-muerto: Dos funcionalidades marcadas PENDIENTE en el código (únicos marcadores de trabajo sin terminar)

- **Ubicación:** `js/app.js:1586, js/data/dcnb-map.js:19`
- **Problema:** El grep de marcadores reales (TODO:/FIXME/HACK/XXX) no encontró ninguno; casi todos los 'TODO' del repo son la palabra española «todo». Sí hay dos «PENDIENTE» que marcan andamiaje construido pero no usado: en app.js una función que separa misiones «del mes» y «espirales» para herramientas docentes que aún no existen, y en dcnb-map.js un filtro pendiente de conectar. Es código de soporte que hoy no alimenta ninguna pantalla.
- **Impacto:** Bajo: no rompe nada, pero es superficie que se carga y mantiene sin dar valor todavía. Conviene rastrear que no quede olvidado.
- **Evidencia:**
```
js/app.js:1586  PENDIENTE: construir esas herramientas sobre esta función. */
js/data/dcnb-map.js:19  en js/app.js, que ya filtra por grado + mes + materia. PENDIENTE. */
```
- **Solución:** Dejarlos como están si el plan sigue vigente, o retirarlos si se abandonó la idea. Anotarlos en un issue para que no se pierdan; son los únicos dos puntos declarados como trabajo incompleto en todo el código.
- **Prioridad:** backlog

#### ⚪ BAJO — organizacion-repositorio: La raíz mezcla 10+ documentos de propuesta/investigación (incl. 2 PDF pesados) con el código servido

- **Ubicación:** `raíz del repo: PROPUESTA-*.md (8), INVESTIGACION-*.md/.pdf, AUDITORIA-CHATBOT-PADRES.md, y PDFs (INVESTIGACION-HOMESCHOOL-2026.pdf 130 KB, PROPUESTA-TAREAS-FICHAS-LIBROS-2026.pdf 643 KB)`
- **Problema:** Conviven en la raíz 10 documentos de propuesta/investigación más manuales y planes, junto a los .html/.js que se publican. .assetsignore no excluye los .md/.pdf sueltos de la raíz (solo ignora .git/_dev/www/node_modules/android), así que estos documentos SÍ se sirven en Cloudflare y GitHub Pages salvo que un patrón adicional los frene.
- **Impacto:** Ruido: cuesta distinguir de un vistazo qué es código vivo y qué es material de taller. Los .md/.pdf de propuesta quedan públicamente accesibles por URL en el sitio (no es dato sensible de menores, pero es material interno de trabajo publicado sin querer).
- **Evidencia:**
```
$ ls PROPUESTA-*.md INVESTIGACION-*.md AUDITORIA-*.md | wc -l → 10
.assetsignore contiene: .git / _dev / www / node_modules / android  (no menciona *.md ni *.pdf de la raíz)
PROPUESTA-TAREAS-FICHAS-LIBROS-2026.pdf → 658635 bytes
```
- **Solución:** Mover las propuestas/investigaciones a _dev/ (que ya está en .assetsignore y es donde vive el material de taller según CLAUDE.md), o añadir *.md y *.pdf de raíz a .assetsignore dejando fuera README/CNAME. Mantener en la raíz solo lo que de verdad se publica.
- **Prioridad:** backlog

## Checklist de verificación

**Base de datos (Supabase)**
- [ ] La consulta `pg_get_function_identity_arguments` no devuelve ninguna firma `(jsonb)` sola para los cuatro escritores.
- [ ] `metas_buzon_docente`, `metas_consultar_docente/_progreso`, `metas_conv_respuestas` y `metas_guardar` llaman a un candado de velocidad.
- [ ] Las contraseñas nuevas se guardan con `bcrypt`; ninguna cuenta conserva un hash SHA-256 sin sal.
- [ ] Una escritura con cuenta docente ajena a una clave de familia es rechazada (filas atadas al dueño).
- [ ] Respaldos automáticos de la base de datos activados y probados con una restauración.

**Frontend y cliente**
- [ ] El sitio responde con CSP, X-Frame-Options, Referrer-Policy y HSTS.
- [ ] La contraseña del docente ya no aparece en `localStorage`.
- [ ] La clave de familia se genera con más entropía y/o el padre aporta un segundo dato.
- [ ] `campeonismo.js` escapa los nombres antes de pintarlos con `innerHTML`.

**Datos y resiliencia**
- [ ] Editar el mismo grupo desde dos equipos ya no pierde datos en silencio.
- [ ] El outbox y `resultados` tienen poda y avisan antes de descartar/truncar.
- [ ] Existe un contador o alerta de fallos de sincronización.

**Operaciones y repositorio**
- [ ] Existe `.gitignore` y `node_modules/` ya no está rastreado.
- [ ] `www/` está al día o se dejó de versionar.
- [ ] Un CI corre las sondas `_dev/verifica-*.js` y bloquea el merge si fallan.
- [ ] La config de Supabase vive en un solo módulo.

---
_Cómo se hizo:_ revisión del repositorio completo (~33.000 líneas JS, ~50 archivos `SUPABASE-*.sql`, 68 páginas HTML) con 8 auditores especializados en paralelo y una pasada de verificación adversarial que reabrió el código citado de cada hallazgo Alto/Crítico para intentar refutarlo. La capa RLS+RPC se leyó además de forma independiente. Ningún hallazgo propone cambiar de tecnología ni tocar las claves ya impresas y repartidas a las familias.