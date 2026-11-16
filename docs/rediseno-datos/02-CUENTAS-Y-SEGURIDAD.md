# 2. Cuentas, sesión y seguridad

Fase 1: diseño. Nada de esto está ejecutado. La vinculación de cuentas
(sección 2.3) es una **fase aparte** que necesita aprobación explícita antes
de tocar Supabase.

## 2.1 Cómo es hoy (medido en el repositorio, noviembre de 2026)

| | hoy |
|---|---|
| Entrada del docente | `metas_entrar_docente_v2(correo, clave)` contra `public.docentes` (`_privado/SUPABASE-ROLES.sql:54`, freno en `_privado/SUPABASE-DOCENTES-V2.sql:212-275`) |
| Huella de la contraseña | `sha256(clave)` sin sal o `'v2:' ‖ sha256(clave ‖ codigo)`: rápida, no bcrypt |
| Sesión | **no existe**. Cada llamada vuelve a mandar `p_codigo` + `p_clave` |
| Contraseña en el aparato | **en texto plano** en `localStorage.METAS_DOCENTE_V1 = {codigo, clave, …}` (`js/app.js:1492`, `:1566`, `:2111`, `:2129`; `consulta-nube.html:217`) |
| Freno de intentos | 5 fallos por correo → 10 minutos, **solo** en la entrada. Las ~40 funciones que validan con `_metas_docente_ok` no tienen freno |
| Supabase Auth | solo lo usa `panel-docente.html` (cuentas hechas a mano) |
| Familias | sin cuenta: la clave de familia (`15-K7QM`) es la llave de lectura del chatbot |

Agujeros que el informe del SQL encontró y que este rediseño cierra (o deja
congelados fuera de uso):

1. Una clave de familia devuelve el texto `Nombre · PROF-XXXX` del docente
   (`metas_consultar_admin_padre`), y con el código cualquier función que
   valida contraseña sirve de oráculo sin freno.
2. `metas_recuperar_admin_docente` empareja por **parte del nombre**: quien
   se registre con un nombre contenido en el de otro docente recibe sus filas.
3. `metas_guardar_admin`, `metas_guardar_plan`, `metas_guardar_avisos` y
   `metas_cerrar_familias` exigen *una* cuenta, no *la* dueña: como el alta es
   libre, eso es «cualquiera».
4. Volver a correr `FASE3`, `AVISOS`, `REGISTROS-ADMIN` o los `PLAN-*`
   resucita las versiones de un argumento **sin contraseña**
   (`metas_guardar_admin(jsonb)` y compañía).

## 2.2 Decisión: Supabase Auth con sesión, sin tocar `public.docentes`

Las políticas RLS por dueño necesitan que la base sepa **quién llama**
(`auth.uid()`), y Realtime solo filtra por RLS con una sesión de verdad.
Con el modelo de hoy (código + contraseña en cada llamada) ninguna de las dos
cosas es posible. Por eso la app nueva usa **Supabase Auth**, pero el docente
**no se registra de nuevo** y **su contraseña sigue siendo la misma**.

Regla que guía todo: **`public.docentes` sigue siendo la única autoridad de la
contraseña.** No se copia la contraseña a Auth, no se cambia el formato de la
huella, no se toca ninguna fila de `docentes`. Así no hay dos contraseñas que
se puedan desincronizar, y el cambio y la recuperación de contraseña siguen
funcionando como hoy (`metas_cambiar_clave_docente`, `reset-clave`).

### Cómo entra el docente (lo que ve: lo mismo que hoy)

Escribe su correo y su contraseña. Nada más. Por debajo:

```
aparato                       función de borde «metas-entrar»               Supabase
───────                       ───────────────────────────────               ────────
correo + contraseña  ───────▶ 1. metas_entrar_docente_v2(correo, clave)
                                 (el MISMO freno de hoy: 5 fallos/10 min)
                              2. ¿hay vínculo para ese código?
                                 no → crea el usuario de Auth (fase 2.3)
                              3. admin.generateLink(magiclink) para el
                                 correo interno del vínculo
                              4. verifyOtp(token_hash) → sesión
sesión (access + refresh) ◀── 5. devuelve SOLO la sesión
supabase.auth.setSession()
```

- La función de borde corre con la llave de servicio, que nunca sale del
  servidor.
- El aparato guarda **solo la sesión** (lo hace `supabase-js` en su propia
  llave `sb-<proyecto>-auth-token`): un token de acceso de 1 hora y un token
  de renovación que rota. **Nunca la contraseña.**
- Sin señal, la app abre con la sesión guardada y con la copia local de
  lectura; al volver la señal, `supabase-js` renueva el token solo.
- Si la renovación falla (sesión revocada, o el docente cambió la contraseña
  en otro aparato), se le pide la contraseña una vez con una frase normal:
  «Escribe tu contraseña para seguir guardando». La cola de cambios **no se
  pierde** mientras tanto (sección 3.4).

### Por qué un correo interno y no el correo real

El usuario de Auth se crea con un correo **interno y fijo**:
`prof-xxxxxxxxxx@cuentas.metas.policastsapien.com` (el código del docente en
minúsculas). Nunca se le manda correo a esa dirección.

- Si el docente cambia su correo en su perfil, el vínculo no se rompe.
- No choca con las cuentas de Auth que ya existen para `panel-docente.html`.
- Docentes viejos sin correo (alta por código) también se pueden vincular.

## 2.3 Vinculación transparente (FASE APARTE, necesita aprobación)

Tabla nueva, sin tocar `docentes`:

```sql
metas.cuentas (
  auth_uid       uuid primary key references auth.users(id),
  docente_codigo text not null unique,   -- PROF-XXXXXXXXXX, tal cual
  vinculada_at   timestamptz not null default now()
)
```

La primera vez que un docente entra con su correo y su contraseña actuales:

1. `metas-entrar` valida con `metas_entrar_docente_v2` (si falla, falla igual
   que hoy, con el mismo freno).
2. No encuentra fila en `metas.cuentas` para ese código.
3. Crea el usuario de Auth con
   `admin.createUser({ email: <correo interno>, email_confirm: true,
   password: <32 bytes al azar que nadie guarda>, app_metadata: { docente_codigo } })`.
   La contraseña de Auth es basura a propósito: nadie puede entrar por
   `/auth/v1/token?grant_type=password`; la única puerta es `metas-entrar`.
4. Inserta la fila de `metas.cuentas` y sigue con el paso 3 del diagrama.

Si dos aparatos entran por primera vez al mismo tiempo, el `unique` de
`docente_codigo` deja pasar a uno; el otro reintenta y encuentra el vínculo.

Lo que **no** hace la vinculación: no cambia `clave_hash`, no cambia el
código, no cambia el correo, no borra nada, no toca `docente_estado`. Si se
desvincula (borrar la fila de `metas.cuentas` y el usuario de Auth), el
docente sigue entrando a la app vieja exactamente igual.

Requisitos de configuración en Supabase (todos en el panel, fase aparte):

- Auth → Providers → Email: **desactivar el alta pública** (`Allow new users
  to sign up` apagado). Las cuentas de docente solo las crea `metas-entrar`.
- Auth → Providers: **activar las sesiones anónimas** (las usan los padres,
  sección 2.7).
- Auth → Bot and Abuse Protection: **CAPTCHA Turnstile OBLIGATORIO**. Sin token
  válido, Supabase no abre ninguna sesión anónima.
- Auth → Rate limits: dejar el freno de entradas y verificaciones por IP.
- Edge Functions: desplegar `metas-entrar`, `metas-salir-todos` y
  `familia-vincular` con `SUPABASE_SERVICE_ROLE_KEY` y el secreto de Turnstile.
- API → Exposed schemas: añadir `metas`.

**Deshacer la vinculación solo es seguro antes de que el docente cree datos**
en la base nueva: sus filas guardan `owner = auth_uid`, y un usuario de Auth
nuevo tendría otro `auth_uid` (ver `SUPABASE-V2-VINCULACION.sql`).

## 2.4 RLS: dueño, y además solo cuentas de docente

Corrección importante de la revisión 2. Las sesiones anónimas de los padres
usan el **mismo rol** que los docentes (`authenticated`). Con solo la política
«dueño = `auth.uid()`», una sesión anónima podía **crear** su propia aula, sus
alumnos, familias y pagos (era dueña de lo que creaba) y, al chocar con el
índice único de claves, **averiguar si una clave de familia existe**. Ahora
cada tabla tiene dos capas:

```sql
-- permisivas: solo lo propio
create policy <t>_leer   on metas.<t> for select to authenticated using (owner = (select auth.uid()));
create policy <t>_crear  on metas.<t> for insert to authenticated with check (owner = (select auth.uid()));
create policy <t>_editar on metas.<t> for update to authenticated using (owner = (select auth.uid())) with check (owner = (select auth.uid()));
-- RESTRICTIVA: además, la sesión tiene que ser de un docente vinculado
create policy <t>_solo_docentes on metas.<t> as restrictive for all to authenticated
  using ((select metas.es_docente())) with check ((select metas.es_docente()));
-- sin política de DELETE y sin el permiso
```

`metas.es_docente()` es verdadera solo si la sesión **no** es anónima **y**
tiene fila en `metas.cuentas`. La misma restrictiva está en `auditoria`,
`rechazos`, `recibo_series`, `recibo_contadores` y `avisos_vistos`, y la
numeración de recibos comprueba la cuenta otra vez por su lado.

Además, el **sello** (`t_sellar`, el primer disparador de cada tabla) exige
`es_docente()` antes que nada: una sesión anónima que intente insertar recibe
siempre el mismo error `42501`, exista o no la clave que probó. No hay forma de
averiguar una clave insertando.

- `anon` no tiene **ningún** permiso sobre `metas`. Ni lectura.
- `(select auth.uid())` en las políticas, para que la base lo evalúe una vez
  por consulta y no una vez por fila.
- **Dinero sin escritura directa**: `pagos`, `gastos` y `convocatoria_pagos`
  no tienen permiso de `INSERT` ni `UPDATE` por la API; solo se escriben con
  las funciones `metas.pago_*` y `metas.gasto_*`. Por eso **no puede haber
  «upsert» de pagos**. Los alumnos se crean con `metas.alumno_crear` y se
  editan por la API.
- Ninguna función nueva se puede llamar por defecto
  (`alter default privileges in schema metas revoke execute on functions from
  public`); cada una recibe su permiso a mano.
- No se usa `force row level security`: las funciones `security definer`
  corren como dueño del esquema y filtran por `auth.uid()` por su cuenta.
- Vistas de totales con `security_invoker = true`.
- Llaves foráneas compuestas con `owner` (y `aula_id`): no se puede colgar una
  fila propia de una fila ajena aunque se adivine su id.

## 2.5 Límite de intentos y de dónde sale la IP

**El freno vive en `SUPABASE-V2-VINCULACION.sql`** (`metas.frenos`,
`metas.freno_ok`), que es el primer archivo: `metas-entrar` lo usa desde el
primer día. `service_role` tiene permiso de uso sobre el esquema `metas`
solo para que las funciones de borde puedan llamar a sus funciones.

**La base no lee la IP de cabeceras que el cliente puede escribir**
(`x-forwarded-for`, `cf-connecting-ip` mandados por el aparato). La IP la
obtienen las **funciones de borde** de la cabecera que añade la propia
infraestructura de Supabase (el **último** valor de `x-forwarded-for`, el que
agrega su proxy, nunca el primero), y se la pasan a `metas.freno_ok`, que solo
la llama `service_role`. En la consulta de familias, además, cada intento
exige un token Turnstile, que es lo que de verdad frena a un programa.

| puerta | freno |
|---|---|
| `metas-entrar` (docente) | el de hoy: 5 fallos por correo → 10 minutos (`docente_intentos`, sin tocar) **y** 30 intentos por hora por IP (`freno_ok('entrar-ip:'…)`), implementado en la función de borde **antes** de validar la contraseña |
| Sesión anónima de padres | CAPTCHA Turnstile obligatorio + límites de Auth por IP |
| `familia-vincular` | token Turnstile por intento; 20 por hora por sesión; 60 por hora por IP; 20 claves equivocadas por hora por IP. Más de **2 000 claves equivocadas por hora en total** deja **una alerta** en `metas.alertas` para quien administra, pero **no bloquea** a las familias (un ataque repartido no puede dejar a todas sin entrar) |
| Funciones viejas que validan contraseña | quedan **congeladas** (`SUPABASE-V2-CONGELAR.sql`) |

Al cambiar la contraseña (`metas_cambiar_clave_docente`) y al recuperarla por
correo (`reset-clave` → `metas_reset_confirmar`), se llama a
`metas-salir-todos`: en el primer caso cierra las **otras** sesiones; en el
segundo, **todas**.

## 2.6 Lo que se guarda en el aparato

| llave | qué | ¿secreto? |
|---|---|---|
| `sb-<proyecto>-auth-token` | sesión de Supabase (la maneja `supabase-js`) | token, no contraseña |
| `METAS_APARATO_ID` | uuid de este aparato, para `device_id` | no |
| IndexedDB `metas-datos-v2` | copia de lectura de las filas y la cola de cambios | datos del aula; se borra al cerrar sesión **si la cola está vacía** |

`METAS_DOCENTE_V1` deja de guardar `clave`. Las llaves `METAS_SB_URL` /
`METAS_SB_KEY` que permiten apuntar la app a **otro** servidor se eliminan:
con ellas se podía mandar la sesión a un servidor ajeno.

## 2.7 Familias y claves de familia

Las familias siguen **sin cuenta y sin contraseña**: escriben la clave de la
tira, como hoy. Por debajo, el teléfono abre una sesión **anónima** (con
Turnstile) y la función de borde `familia-vincular` la une con su hijo. El
diseño completo está en `07-VISTA-DE-PADRES.md` y `SUPABASE-V2-FAMILIAS.sql`.

**Las claves las pone la base** (disparador `t_clave_familia`):

- **Nuevas**: 10 símbolos al azar de un alfabeto de 32 sin I, O, 0 ni 1
  (50 bits; las de hoy son el número de lista + 4 símbolos, unos 20 bits).
  Se muestran en dos grupos: `K7QMX-4PA2B`. No dependen del número de lista.
- **Conservadas** (la familia ya tiene la tira): el docente la escribe y la
  base la acepta **solo si aparece en los datos congelados de ese mismo
  docente** (`METAS_CODIGOS_V1` o la lista de `METAS_ADMIN_V1` en
  `docente_estado`, buscadas por el código de docente de su vínculo). Así nadie
  puede "reclamar" la clave de una familia de otro docente.
- **No cambian.** Si una tira se pierde, se reemplaza la familia (se borra la
  fila y se crea otra, con clave nueva); los teléfonos vinculados con la vieja
  dejan de ver al instante.
- **Las conservadas vencen al terminar la transición** (revisión 4, N3,
  decisión de Josué). Son de unos 20 bits, salieron de `Math.random` y nunca
  vencían. Para no dejar a ninguna familia un día sin entrar, la clave
  entregada no se toca:
  1. el docente prepara las tiras nuevas cuando quiera
     (`metas.familias_preparar_claves_nuevas`): la base pone en
     `familias.clave_siguiente` una clave de 10 símbolos, que sirve desde ese
     momento junto con la vieja. Nadie la elige ni la cambia (`MT002`);
  2. al dar el aviso de dos semanas del paso 4 se fija la fecha (hito
     `claves_viejas_vencen`). «Mi aula» le dice al docente, de tú: «N
     familias tienen todavía la clave del año pasado. Imprime sus tiras
     nuevas antes del <fecha>»;
  3. en esa fecha la conservada deja de abrir (`metas._clave_vale`, la única
     regla para vincular, ver, marcar «visto» y escuchar el canal): el
     teléfono que entró con ella deja de ver y el portal pide la tira nueva.
     Las claves nuevas no vencen.
  4. pasada la fecha, el alta de una familia ya no conserva ninguna clave
     vieja, aunque esté en la copia de ese docente: la base pone una nueva
     (rev. 5).
  Pruebas K7 a K11.

## 2.8 Decisiones de la revisión 2 y lo que se pospone

- **bcrypt** para la huella vieja: **pospuesto**. Modifica filas de
  `docentes` y necesitará tu permiso aparte.
- **Directores y roles**: **solo lectura, pospuesto** a un corte posterior
  (política de lectura según `docente_permisos`).
- **PIN de convocatorias**: **pospuesto** al corte de convocatorias.

## 2.9 Boceto de la función de borde `metas-entrar` (fase aparte)

Boceto para revisar, no código final. Corre en Supabase Edge Functions con la
llave de servicio; el aparato solo le manda correo y contraseña por HTTPS y
recibe la sesión.

```ts
// supabase/functions/metas-entrar/index.ts  (BOCETO)
import { createClient } from 'npm:@supabase/supabase-js@2';

const URL = Deno.env.get('SUPABASE_URL')!;
const SERVICIO = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const PUBLICA = Deno.env.get('SUPABASE_ANON_KEY')!;

Deno.serve(async (req) => {
  const { correo, clave } = await req.json();
  const admin = createClient(URL, SERVICIO, { auth: { persistSession: false } });

  // 0. Freno por IP, ANTES de tocar la contraseña. La IP es la que añadió el
  //    proxy de Supabase (último valor de x-forwarded-for), nunca la primera,
  //    que la puede escribir el cliente.
  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',').map(s => s.trim()).filter(Boolean).pop() ?? 'sin-ip';
  const { data: libre } = await admin.schema('metas').rpc('freno_ok',
    { p_llave: 'entrar-ip:' + ip, p_max: 30, p_ventana: '1 hour' });
  if (!libre) return json({ ok: false, motivo: 'espera' }, 429);

  // 1. La contraseña se valida como HOY, con su freno de 5 fallos por correo.
  const { data: r } = await admin.rpc('metas_entrar_docente_v2', { p_correo: correo, p_clave: clave });
  if (!r?.ok) return json({ ok: false, motivo: r?.motivo ?? 'datos' }, 401);

  // 2. ¿Ya está vinculado?
  const codigo: string = r.codigo;
  const interno = codigo.toLowerCase() + '@cuentas.metas.policastsapien.com';
  let { data: v } = await admin.schema('metas').rpc('cuenta_de', { p_codigo: codigo });
  if (!v?.length) {
    // 3. Vinculación transparente: usuario de Auth con contraseña al azar que
    //    nadie guarda (la única puerta es esta función).
    const azar = crypto.getRandomValues(new Uint8Array(32)).join('');
    const { data: u, error } = await admin.auth.admin.createUser({
      email: interno, email_confirm: true, password: azar,
      app_metadata: { docente_codigo: codigo },
    });
    // si falla porque otro aparato lo acaba de crear, se lee el vínculo de nuevo
    if (u?.user) {
      await admin.schema('metas').rpc('cuenta_registrar',
        { p_auth: u.user.id, p_codigo: codigo, p_correo_interno: interno });
    }
    ({ data: v } = await admin.schema('metas').rpc('cuenta_de', { p_codigo: codigo }));
    if (!v?.length) return json({ ok: false, motivo: 'reintentar' }, 503);
  }

  // 4. Sesión sin conocer ninguna contraseña de Auth: enlace mágico generado
  //    en el servidor y canjeado en el servidor (nunca se manda por correo).
  const { data: link } = await admin.auth.admin.generateLink({ type: 'magiclink', email: interno });
  const publico = createClient(URL, PUBLICA, { auth: { persistSession: false } });
  const { data: s, error: e2 } = await publico.auth.verifyOtp({
    token_hash: link.properties.hashed_token, type: 'magiclink',
  });
  if (e2 || !s.session) return json({ ok: false, motivo: 'reintentar' }, 503);

  // 5. Solo la sesión. Ni el código ni la contraseña vuelven al aparato.
  return json({ ok: true, access_token: s.session.access_token,
                refresh_token: s.session.refresh_token,
                nombre: r.nombre, rol: r.rol });
});

const json = (o: unknown, status = 200) =>
  new Response(JSON.stringify(o), { status, headers: { 'content-type': 'application/json' } });
```

`metas-salir-todos` hace `admin.auth.admin.signOut(uid, 'others')` después de
`metas_cambiar_clave_docente` (la llama la app) y `signOut(uid, 'global')`
después de una recuperación por correo (la llama la función `reset-clave`
cuando `metas_reset_confirmar` dice ok). En los dos casos los otros aparatos
piden la contraseña nueva la próxima vez que renuevan; su cola de cambios
espera, no se pierde.
