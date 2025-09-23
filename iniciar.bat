@echo off
echo ==========================================
echo   GESTOR DE COMPRAS PERSONALES
echo ==========================================
echo.
echo Iniciando aplicacion...
echo.

REM Verificar si Java esta instalado
java -version >nul 2>&1
if errorlevel 1 (
    echo Error: Java no esta instalado o no esta en el PATH.
    echo Por favor instale Java JDK 17 o superior.
    pause
    exit /b 1
)

REM Ejecutar la aplicacion usando Maven wrapper
echo Ejecutando aplicacion de consola...
echo.
call mvnw.cmd spring-boot:run

pause