@echo off
rem Respaldo express ante cortes de energia: commit de todo lo pendiente + push.
rem Doble clic y listo. Ver PLAN-CORTES-ENERGIA.md
cd /d "%~dp0"
git add -A
git diff --cached --quiet && echo No hay cambios pendientes: todo ya esta respaldado. && goto push
for /f "tokens=1-3 delims=/ " %%a in ("%date%") do set FECHA=%%a-%%b-%%c
git commit -m "WIP respaldo rapido %FECHA% %time:~0,5% (corte de energia / pausa)"
:push
git push
if errorlevel 1 (
  echo.
  echo AVISO: no se pudo subir a GitHub ^(sin internet?^). El commit local SI quedo guardado.
)
echo.
pause
