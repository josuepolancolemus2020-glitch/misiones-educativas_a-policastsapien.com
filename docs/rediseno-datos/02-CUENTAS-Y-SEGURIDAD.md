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
  to sign up` apagado). Las cuentas solo las crea `metas-entrar`.
- Auth → Rate limits: dejar el freno de entradas y verificaciones por IP.
- Edge Functions: desplegar `metas-entrar` con `SUPABASE_SERVICE_ROLE_KEY`.
- API → Exposed schemas: añadir `metas`.

## 2.4 RLS por dueño

Cada tabla de `metas` tiene la misma forma (ver `SUPABASE-V2-ESQUEMA.sql`):

```sql
alter table metas.<t> enable row level security;
create policy <t>_leer     on metas.<t> for select to authenticated using (owner = auth.uid());
create policy <t>_crear    on metas.<t> for insert to authenticated with check (owner = auth.uid());
create policy <t>_editar   on metas.<t> for update to authenticated using (owner = auth.uid()) with check (owner = auth.uid());
-- sin política de DELETE, y además: revoke delete, truncate ... from anon, authenticated;
```

- `anon` no tiene **ningún** permiso sobre `metas`. Ni lectura.
- No se usa `force row level security`: las pocas funciones `security
  definer` (vinculación de familias, freno de intentos) corren como dueño del
  esquema y necesitan leer sin la política del docente. Cada una filtra por
  `auth.uid()` por su cuenta.
- Las vistas de totales se crean con `security_invoker = true`, así respetan
  la RLS de quien consulta.
- Las relaciones (pago → alumno → aula) llevan además una **comprobación de
  dueño cruzada** en el disparador: no se puede colgar un pago propio de un
  alumno ajeno aunque se adivine su id.

## 2.5 Límite de intentos

| puerta | freno |
|---|---|
| `metas-entrar` (docente) | el de hoy: 5 fallos por correo → 10 minutos (`docente_intentos`). **Se añade** un freno por IP: 30 intentos por hora (`metas_rate_ok`, que ya existe y lee `cf-connecting-ip`) para cortar el rociado de contraseñas sobre muchos correos |
| Auth de Supabase | sus propios límites por IP (panel → Auth → Rate limits) |
| Vinculación de familias | 60 por hora por IP, 20 por hora por sesión **y** 20 claves equivocadas por hora por IP |
| Funciones viejas que validan contraseña | quedan **congeladas** (`05-ELIMINACION-Y-ANDROID.md`): se les quita `execute` a `anon` y `authenticated`, así dejan de servir de oráculo |

## 2.6 Lo que se guarda en el aparato

| llave | qué | ¿secreto? |
|---|---|---|
| `sb-<proyecto>-auth-token` | sesión de Supabase (la maneja `supabase-js`) | token, no contraseña |
| `METAS_APARATO_ID` | uuid de este aparato, para `device_id` | no |
| IndexedDB `metas-datos-v2` | copia de lectura de las filas y la cola de cambios | datos del aula; se borra al cerrar sesión **si la cola está vacía** |

`METAS_DOCENTE_V1` deja de guardar `clave` (pendiente de la fase de
implementación: hoy la usan las funciones viejas). Las llaves
`METAS_SB_URL` / `METAS_SB_KEY` que permiten apuntar la app a **otro**
servidor se eliminan: con ellas se podía mandar la sesión a un servidor ajeno.

## 2.7 Familias

Las familias siguen **sin cuenta y sin contraseña**: escriben la clave de la
tira, como hoy. Por debajo, el teléfono abre una sesión **anónima** de
Supabase Auth y la clave la vincula con su hijo, para que la RLS sepa qué
filas puede leer. El diseño completo está en `07-VISTA-DE-PADRES.md` y
`SUPABASE-V2-FAMILIAS.sql`.

Las claves ya entregadas en papel se conservan: en la carga rápida el docente
puede escribir la clave que ya tiene la familia; si la deja vacía, la app le
genera una nueva (más larga que las de hoy). Ver `04-CARGA-RAPIDA.md`.

## 2.8 Pendiente de decidir (no bloquea el diseño)

- **Endurecer la huella vieja** (pasar `clave_hash` a bcrypt la próxima vez
  que el docente entra). Mejora la seguridad pero **modifica** filas de
  `docentes`: por la regla de cuentas, no se hace sin tu permiso.
- **Directores y roles** (`metas_rol_*`) hoy leen el blob con una lista de
  campos. En el modelo nuevo se haría con una política RLS extra de lectura
  para quien tenga permiso concedido en `docente_permisos`. Se diseña cuando
  se apruebe lo básico.

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

  // 1. La contraseña se valida como HOY, con su freno de 5 fallos por correo.
  //    (más el freno por IP: metas.freno_ok('entrar:' || ip, 30, '1 hour'))
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

Al cambiar la contraseña (`metas_cambiar_clave_docente`, que no cambia), el
aparato llama además a una función `metas-salir-todos` que hace
`admin.auth.admin.signOut(uid, 'others')`, para que los otros aparatos pidan la
contraseña nueva la próxima vez que renueven.
