@echo off
REM ============================================================
REM  Sincroniza las misiones e instala la app en el telefono.
REM  Uso: conecta el telefono (depuracion USB autorizada) y
REM  haz doble clic en este archivo, o ejecutalo en la terminal.
REM ============================================================
setlocal
cd /d "%~dp0"

echo.
echo [1/3] Reconstruyendo www con todas las misiones...
call npm run build:www
if errorlevel 1 goto :error

echo.
echo [2/3] Sincronizando con el proyecto Android (Capacitor)...
call npx cap sync
if errorlevel 1 goto :error

echo.
echo [3/3] Compilando e instalando el APK en el telefono...
cd android
REM El JDK ya esta fijado en android\gradle.properties (org.gradle.java.home)
call gradlew.bat installDebug
if errorlevel 1 goto :error

echo.
echo ============================================================
echo   LISTO: la app se instalo en el telefono con exito.
echo   Abrela desde el icono en el telefono (funciona sin internet).
echo ============================================================
goto :fin

:error
echo.
echo ============================================================
echo   ERROR: algo fallo. Revisa el mensaje de arriba.
echo   - Telefono conectado y con "Depuracion USB" autorizada?
echo     (ejecuta:  adb devices  y debe salir "device")
echo   - Android Studio instalado en la ruta esperada?
echo ============================================================

:fin
endlocal
pause
