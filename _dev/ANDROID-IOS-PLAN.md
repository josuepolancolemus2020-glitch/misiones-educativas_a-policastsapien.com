# App de Android e iOS: lo que se retiró y el plan para enero de 2027

Nota de noviembre de 2026. Solo es un plan: no se instaló nada.

## 1. Qué había y por qué se retiró

La copia vieja de Capacitor estaba en el repositorio y nadie la usaba:

| qué | estado | qué se hizo |
|---|---|---|
| `www/` | copia de la web en **v480** (el sitio iba por v577), con 537 archivos, 56 MB; llevaba además 20 `SUPABASE-*.sql`, `sincronizar-e-instalar.bat`, `respaldo-rapido.cmd` y `CNAME` | borrada |
| `android/` | proyecto de Capacitor 8 (60 archivos) | borrado |
| `capacitor.config.json` | `appId com.policastsapien.metas`, `appName METAS`, `webDir www`, `server.url https://metas.policastsapien.com` | borrado |
| `package.json` | `@capacitor/android`, `core`, `filesystem`, `share`, `cli` (todas ^8) y los scripts `build:www` (robocopy, solo Windows), `sync`, `install:android` | quitados; quedan `test` y `test:navegador` |
| `node_modules/` versionado | 2.426 archivos, todos del árbol de dependencias de Capacitor | borrado; ahora está en `.gitignore` |
| `_privado/sincronizar-e-instalar.bat` | armaba e instalaba el APK por USB (ya estaba roto) | borrado |

Se ajustaron dos sondas que leían `www/` (`verifica-legal`, `verifica-barra-xp`).
`_config.yml` y `.assetsignore` **siguen excluyendo** `www/`, `android/` y
`node_modules/`, para que una copia nueva nunca se publique como parte del sitio.

Todo esto sigue en el historial de git (último commit con la copia: `7e95ae3`).

### Lo que se queda a propósito

- **El código de la web que busca Capacitor** (`window.Capacitor`, en 88
  archivos: 82 de misiones, `padres.html`, `js/motor-mision.js`,
  `js/metas-registro.js`, `js/tools/collage-maker.js`, `plan-accion.js` y
  `registros-admin.js`). Usa
  `Filesystem` y `Share` para guardar y compartir diplomas e informes y, si no
  hay Capacitor, toma el camino del navegador. Servirá tal cual en enero.
- **Los documentos históricos**: `docs/rediseno-datos/05-ELIMINACION-Y-ANDROID.md`
  y `11-APK-ANDROID.md`, la auditoría de `_dev/auditoria-2026-09/`,
  `_privado/PLANTILLA-MISIONES.md` (sección «Instalar en el teléfono») y los
  README de `_dev/leyes/` y `_dev/dcnb-pdf/`. Mencionan `npm run build:www` y
  `www/`: **esos pasos ya no existen**.

### Pendiente aparte (no se tocó hoy)

- **`kit-auto-1.html` quedó desactualizada.** Es una página publicada que
  explica el APK con `npm run sync`, `www/`, `capacitor.config.json` con
  `webDir: www` y «4 dependencias, todas Capacitor». Hay que corregirla en un
  cambio propio (es interfaz, lleva sello de versión).

## 2. La llave de firma (no está en el repositorio)

No hay ningún `.jks`, `.keystore`, `key.properties` ni contraseña en el
repositorio ni en su historial. Según el `build.gradle` retirado, la llave
vive en la computadora del autor:

- `C:\Users\Dell\.metas-android-key.properties` (`storeFile`,
  `storePassword`, `keyAlias`, `keyPassword`)
- el archivo `.keystore` al que apunta `storeFile`

Esa llave firmó la app `com.policastsapien.metas` (versionCode 3, la v480).
**Hay que guardar los dos archivos fuera de esa computadora** (gestor de
contraseñas y una copia sin conexión). Si se pierden, ningún teléfono que
tenga la app vieja puede actualizarla encima.

En enero:

- Si la app de Google Play usa el **mismo `applicationId`**
  (`com.policastsapien.metas`), conviene subir esta misma llave a Play App
  Signing como llave de la app; así la versión de Play se instala encima de
  la vieja. El `versionCode` tiene que ser **mayor que 4** (el 4 ya se
  reservó en `11-APK-ANDROID.md`).
- Para la subida, Play pide además una llave de carga, que puede ser nueva y
  también se guarda fuera del repositorio.
- Nunca se versiona ninguna llave: `*.jks`, `*.keystore`, `key.properties`,
  `*.p8` (iOS) y `*.mobileprovision` van al `.gitignore` desde el primer día.

## 3. El plan para enero

1. **Capacitor nuevo, con Android e iOS desde el inicio.** Se instala la
   versión estable de ese momento (`@capacitor/core`, `cli`, `android`, `ios`,
   y los plugins que de verdad se usan: `filesystem` y `share`). Las
   dependencias van en `package.json`, pero `node_modules/` **no** se
   versiona.
2. **Dónde vive.** Propuesta: una carpeta propia (por ejemplo `app/`, con su
   `package.json`, `capacitor.config.json`, `android/` e `ios/`), excluida en
   `_config.yml` y `.assetsignore`, para que el sitio siga sin compilación y
   sin dependencias.
3. **Un script que copia la app desde `main` en cada compilación.** Es la
   pieza que evita que la copia vuelva a atrasarse:
   - Escrito en Node (que corra igual en Windows, Mac y Linux; nada de
     robocopy).
   - Toma lo publicado de `main` (`git archive origin/main` o un clon limpio),
     **no** el árbol de trabajo, para no empaquetar cambios a medias.
   - Copia solo lo que es el sitio, con **la misma lista** de exclusiones que
     `_config.yml` y `.assetsignore` (sin `_dev/`, `_privado/`, `docs/`,
     `.md`, `.sql`). Mejor si lee esa lista de un solo lugar.
   - Borra la carpeta destino antes de copiar (lo que ya no existe en `main`
     no se queda en la app) y no se versiona: va al `.gitignore`.
   - Compara el `CACHE_NAME` de `sw.js` de la copia con el de `main` y
     **falla** si no coinciden. Después corre `npx cap sync`.
   - Una sonda rápida comprueba que la carpeta de la copia no esté en git y
     que el script exista.
4. **Decidir antes de armar: copia dentro de la app o `server.url`.** La app
   retirada abría el sitio publicado (`server.url`) y llevaba `www/` solo
   porque Capacitor lo pide. Con la copia fresca de cada compilación, la app
   puede abrir sin señal desde la primera vez, que es lo que pide el maestro
   sin señal. Hay que revisar también las reglas de Google Play y, sobre
   todo, de la App Store (directriz 4.2 de Apple) sobre apps que solo
   envuelven un sitio web.
5. **Datos.** Lo que se guarda en el teléfono depende del origen: con la
   copia dentro de la app el origen es el de Capacitor, no
   `https://metas.policastsapien.com`. Los datos del maestro ya viven en
   filas de Supabase (`MetasDatos`), pero hay que comprobar con una cuenta de
   prueba que la cola sin conexión y las preferencias funcionan en la app
   antes de publicarla.
6. **Antes de publicar**: probar en un Android real y en un iPhone que abran
   sin señal, que guardar o compartir un diploma funcione (Filesystem y
   Share) y que los enlaces a WhatsApp salgan de la app
   (`js/tools/mi-aula.js`). Corregir `kit-auto-1.html` en ese mismo momento.
