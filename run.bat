@echo off
setlocal enabledelayedexpansion

echo ============================================================
echo ^🚀 SISTEMA DE GASTOS PERSONALES
echo ============================================================
echo.

set JAR_PATH=target\gastos-personales-1.0.0.jar
set MAVEN_CMD=mvnw.cmd

:MENU
echo Selecciona el modo de ejecución:
echo.
echo 1. ^🌐 Modo Web ^(Recomendado^)
echo    - Servidor web en http://localhost:8080
echo    - Frontend React en http://localhost:5173
echo    - API REST completa
echo.
echo 2. ^💻 Modo Consola
echo    - Interfaz de línea de comandos
echo    - Funcionalidad básica
echo.
echo 3. ^🔧 Recompilar y ejecutar
echo    - Limpia y recompila todo el proyecto
echo.
echo 4. ^🎯 Ejecutar completo ^(Backend + Frontend^)
echo    - Inicia automáticamente backend y frontend
echo.
echo 5. ^❌ Salir
echo.
set /p opcion=Ingresa tu opción (1-5) o presiona Enter para modo web: 

if "%opcion%"=="" set opcion=1
if "%opcion%"=="1" goto WEB_MODE
if "%opcion%"=="web" goto WEB_MODE
if "%opcion%"=="2" goto CONSOLE_MODE
if "%opcion%"=="consola" goto CONSOLE_MODE
if "%opcion%"=="3" goto RECOMPILE
if "%opcion%"=="recompilar" goto RECOMPILE
if "%opcion%"=="4" goto FULL_MODE
if "%opcion%"=="full" goto FULL_MODE
if "%opcion%"=="completo" goto FULL_MODE
if "%opcion%"=="5" goto END
if "%opcion%"=="salir" goto END

echo ^❌ Opción no válida. Ejecutando modo web por defecto...
goto WEB_MODE

:CHECK_JAR
if not exist "%JAR_PATH%" (
    echo ^📦 El archivo JAR no existe. Compilando la aplicación...
    call :COMPILE_APP
    if errorlevel 1 (
        echo ^❌ Error en la compilación
        pause
        exit /b 1
    )
)
goto :EOF

:COMPILE_APP
echo Ejecutando: %MAVEN_CMD% clean package -DskipTests
call %MAVEN_CMD% clean package -DskipTests
if errorlevel 1 (
    echo ^❌ Error en la compilación
    exit /b 1
)
echo ^✅ Compilación completada exitosamente
echo.
goto :EOF

:WEB_MODE
call :CHECK_JAR
echo ^🌐 Iniciando en Modo Web...
echo.
echo ^🔗 URLs disponibles:
echo    Backend:  http://localhost:8080
echo    Frontend: http://localhost:5173
echo.
echo ^📝 Para iniciar el frontend, ejecuta en otra terminal:
echo    cd frontend ^&^& npm run dev
echo.
echo ^⚡ Iniciando servidor backend...
echo    Presiona Ctrl+C para detener
echo ----------------------------------------------------
java -jar %JAR_PATH% web
goto END

:CONSOLE_MODE
call :CHECK_JAR
echo ^💻 Iniciando en Modo Consola...
echo ----------------------------------------------------
java -jar %JAR_PATH% consola
goto END

:FULL_MODE
call :CHECK_JAR
echo ^🎯 Iniciando aplicación completa ^(Backend + Frontend^)...
echo.

REM Iniciar backend en segundo plano
echo ^⚡ Iniciando servidor backend...
start /B "Backend" java -jar %JAR_PATH% web

REM Esperar a que el backend se inicie
echo Esperando a que el backend se inicie...
timeout /t 5 /nobreak >nul

REM Verificar si el backend está corriendo (simplificado)
echo ^✅ Backend iniciado

REM Cambiar al directorio frontend
cd frontend

REM Verificar si node_modules existe
if not exist "node_modules" (
    echo ^📦 Instalando dependencias del frontend...
    npm install
)

echo.
echo ^🔗 Aplicación disponible en:
echo    ^🌐 Frontend: http://localhost:5173
echo    ^⚙️  Backend:  http://localhost:8080
echo.
echo    Presiona Ctrl+C para detener ambos servidores
echo ----------------------------------------------------

REM Iniciar frontend
npm run dev
goto END

:RECOMPILE
echo ^🔧 Recompilando toda la aplicación...
call :COMPILE_APP
if errorlevel 1 goto END
echo.
echo Compilación terminada. ¿Qué modo deseas ejecutar ahora?
goto MENU

:END
echo.
echo ^👋 ¡Gracias por usar el Sistema de Gastos Personales!
pause