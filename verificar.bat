@echo off
echo ==========================================
echo   VERIFICACION DEL PROYECTO
echo ==========================================
echo.

echo Verificando estructura del proyecto...
echo.

REM Verificar archivos principales
if exist "pom.xml" (
    echo [OK] pom.xml encontrado
) else (
    echo [ERROR] pom.xml no encontrado
)

if exist "src\main\java\com\proyecto\gastospersonales\GastosPersonalesApplication.java" (
    echo [OK] Aplicacion principal encontrada
) else (
    echo [ERROR] Aplicacion principal no encontrada
)

if exist "src\main\resources\application.properties" (
    echo [OK] Configuracion encontrada
) else (
    echo [ERROR] Configuracion no encontrada
)

if exist "README.md" (
    echo [OK] README.md encontrado
) else (
    echo [ERROR] README.md no encontrado
)

echo.
echo Verificando herramientas necesarias...
echo.

REM Verificar Java
java -version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Java no esta instalado
) else (
    echo [OK] Java esta instalado
    java -version
)

echo.

REM Verificar Git
git --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Git no esta instalado
) else (
    echo [OK] Git esta instalado
    git --version
)

echo.

REM Verificar PostgreSQL (opcional)
psql --version >nul 2>&1
if errorlevel 1 (
    echo [ADVERTENCIA] PostgreSQL no detectado en PATH
    echo              Asegurese de tener PostgreSQL instalado
) else (
    echo [OK] PostgreSQL detectado
    psql --version
)

echo.
echo ==========================================
echo   INSTRUCCIONES DE USO
echo ==========================================
echo.
echo Para configurar Git y conectar con GitHub:
echo   1. Ejecute: configurar-git.bat
echo.
echo Para ejecutar la aplicacion:
echo   1. Configure PostgreSQL segun README.md
echo   2. Ejecute: iniciar.bat
echo.
echo Para modo web (futuro):
echo   mvnw.cmd spring-boot:run -Dspring-boot.run.arguments=web
echo.
echo Repositorio GitHub:
echo   https://github.com/Jecsonrv/gastos-personales-app.git
echo.
pause