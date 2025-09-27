@echo off
echo ========================================
echo   Compilando Gestor de Compras v2.0
echo   Clean Architecture
echo ========================================
echo.

REM Limpiar y compilar
echo 🧹 Limpiando proyecto...
call mvnw.cmd clean

echo.
echo 🔧 Compilando proyecto...
call mvnw.cmd compile

if %errorlevel% neq 0 (
    echo.
    echo ❌ ERROR: Falló la compilación
    pause
    exit /b 1
)

echo.
echo ✅ Compilación exitosa!
echo.
echo 📦 Empaquetando JAR...
call mvnw.cmd package -DskipTests

if %errorlevel% neq 0 (
    echo.
    echo ❌ ERROR: Falló el empaquetado
    pause
    exit /b 1
)

echo.
echo 🎉 Proyecto compilado y empaquetado exitosamente!
echo.
echo 🚀 Para ejecutar:
echo    - Consola: java -jar target/gastos-personales-1.0.0.jar
echo    - Web API: java -jar target/gastos-personales-1.0.0.jar web
echo.
pause