@echo off
echo ========================================
echo   Gestor de Compras Personales v2.0
echo   Clean Architecture Implementation
echo ========================================
echo.

REM Verificar si Java está disponible
java -version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Java no está instalado o no está en el PATH
    echo Por favor instala Java 17 o superior
    pause
    exit /b 1
)

REM Verificar si el JAR existe
if not exist "target\gastos-personales-1.0.0.jar" (
    echo ERROR: El archivo JAR no existe
    echo Ejecuta primero: compilar.bat
    pause
    exit /b 1
)

REM Mostrar opciones
echo Selecciona el modo de ejecución:
echo.
echo 1. Modo CONSOLA (MVP - Fase 1)
echo 2. Modo WEB (API REST - Fase 2) 
echo 3. Compilar proyecto
echo 4. Limpiar y compilar
echo 5. Ver información del JAR
echo.
set /p choice="Ingresa tu opción (1-5): "

if "%choice%"=="1" (
    echo.
    echo 💻 Iniciando en modo CONSOLA...
    echo 🏗️  Clean Architecture implementada
    echo.
    java -jar target/gastos-personales-1.0.0.jar
) else if "%choice%"=="2" (
    echo.
    echo 🌐 Iniciando en modo WEB...
    echo 🚀 API REST disponible en: http://localhost:8080
    echo.
    java -jar target/gastos-personales-1.0.0.jar web
) else if "%choice%"=="3" (
    echo.
    echo 🔧 Compilando proyecto...
    call mvnw.cmd compile
) else if "%choice%"=="4" (
    echo.
    echo � Limpiando y compilando...
    call mvnw.cmd clean compile package -DskipTests
) else if "%choice%"=="5" (
    echo.
    echo 📦 Información del JAR:
    echo Archivo: target\gastos-personales-1.0.0.jar
    if exist "target\gastos-personales-1.0.0.jar" (
        echo Tamaño: 
        dir "target\gastos-personales-1.0.0.jar" | findstr gastos-personales
        echo.
        echo Para ejecutar:
        echo   Consola: java -jar target/gastos-personales-1.0.0.jar
        echo   Web:     java -jar target/gastos-personales-1.0.0.jar web
    ) else (
        echo ❌ El archivo JAR no existe
    )
) else (
    echo.
    echo ❌ Opción inválida
)

echo.
pause