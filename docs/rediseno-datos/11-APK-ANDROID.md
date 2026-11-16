# 11. La APK nueva (versionCode 4) con la misma llave

Revisión 11. Va con el corte 1 (`08-PLAN-POR-CORTES.md`, 8.6). Lo que ya está
en la rama: `capacitor.config.json` con `server.url` y
`android/app/build.gradle` con `versionCode 4` (`versionName "1.3"`). **La
APK no está armada ni firmada**: se arma en tu computadora, con tu llave.

## 11.1 Qué cambia y por qué

La APK instalada hoy (versionCode 3, con la web v480 adentro, en `www/`) no se
actualiza sola: el maestro ve para siempre la app de ese día. La nueva abre el
sitio publicado (`https://metas.policastsapien.com`), así que cada publicación
le llega como al navegador, con el mismo service worker. `www/` sigue en la
APK solo porque Capacitor lo pide; no se usa.

Sin señal: si el teléfono ya abrió la app una vez con señal, el service worker
tiene el armazón y Mi aula abre igual. La primerísima vez se necesita señal
(como para entrar).

## 11.2 Lo que hay que tener ANTES (y no se puede reponer)

- `C:\Users\Dell\.metas-android-key.properties` con cuatro líneas:
  `storeFile`, `storePassword`, `keyAlias`, `keyPassword`.
- El archivo `.keystore` al que apunta `storeFile`.

Los dos viven **fuera del repositorio** (`android/app/build.gradle:3-12`) y
son la identidad de la app. Con la MISMA llave, la APK nueva se instala
**encima** de la v480 sin desinstalar. Si la llave se perdió, Android no deja
instalarla encima (`INSTALL_FAILED_UPDATE_INCOMPATIBLE`): el maestro tendría
que desinstalar la vieja primero. Sus datos locales viejos no se usan en la
base nueva, pero desinstalar igual asusta: en ese caso, avisar antes.

## 11.3 Armarla (Windows, en la carpeta del repositorio)

1. Rama al día y la web sellada (la misma que se publica):

   ```bash
   git checkout main
   ```

   ```bash
   git pull
   ```

2. Comprobar que la llave es la de la v480 (las dos huellas SHA-256 tienen
   que ser idénticas). Con la APK vieja a mano (`metas-v480.apk`):

   ```bash
   apksigner verify --print-certs metas-v480.apk
   ```

   ```bash
   keytool -list -v -keystore RUTA\DEL\ARCHIVO.keystore -alias TU_ALIAS
   ```

   Si no coinciden: **parar**. No repartir nada hasta resolverlo.

3. Copiar la web a `www/` y pasarle la configuración a Android:

   ```bash
   npm run build:www
   ```

   ```bash
   npx cap sync android
   ```

   Comprobar que el `server.url` llegó:
   `android\app\src\main\assets\capacitor.config.json` debe tener
   `"url": "https://metas.policastsapien.com"`.

4. Armar la de release (sale firmada sola si existe el `.properties`; si no
   existe, sale SIN firmar y no instala en ningún teléfono):

   ```bash
   cd android && gradlew.bat assembleRelease
   ```

   Queda en `android\app\build\outputs\apk\release\app-release.apk`. Si el
   archivo se llama `app-release-unsigned.apk`, no encontró la llave: volver
   al paso 2.

5. Comprobar la APK armada:

   ```bash
   apksigner verify --print-certs android\app\build\outputs\apk\release\app-release.apk
   ```

   (misma huella SHA-256 que la v480)

   ```bash
   aapt dump badging android\app\build\outputs\apk\release\app-release.apk
   ```

   (la primera línea dice `versionCode='4' versionName='1.3'`)

6. Probarla ENCIMA de la v480 en un teléfono de prueba (con la v480 instalada
   y una cuenta ficticia):

   ```bash
   adb install -r android\app\build\outputs\apk\release\app-release.apk
   ```

   Tiene que decir `Success` sin desinstalar nada. Abrirla: sale la portada
   del sitio publicado; Zona Docente → entrar → Mi aula. Con el modo avión
   después de haberla abierto una vez: vuelve a abrir.

## 11.4 Repartirla

Por el mismo camino de siempre (enlace directo), con la página corta del sitio
«Actualiza la app de M.E.T.A.S» y el mensaje a los docentes dos semanas antes
del corte 1 (8.6). La v480 que alguien no actualice ya no puede hacer daño
desde el paso 1 de CONGELAR: lo del corte 1 que intente subir lo rechaza el
candado con `-2` y queda anotado en `metas.blob_rechazos`.

## 11.5 Volver atrás

- Antes de repartir: no hay nada que deshacer (la v480 sigue instalada).
- Ya repartida: Android no deja bajar de versionCode. Si la app nueva fallara,
  la salida es otra APK con `versionCode 5`. Con `server.url`, casi todo se
  arregla publicando el sitio: la APK solo abre la dirección.
