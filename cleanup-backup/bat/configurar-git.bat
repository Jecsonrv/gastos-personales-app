@echo off
echo ==========================================
echo   CONFIGURACION GIT - GASTOS PERSONALES
echo ==========================================
echo.

REM Verificar si Git esta instalado
git --version >nul 2>&1
if errorlevel 1 (
    echo Error: Git no esta instalado.
    echo Por favor descargue e instale Git desde: https://git-scm.com/
    pause
    exit /b 1
)

echo Git detectado correctamente.
echo.

REM Inicializar repositorio Git si no existe
if not exist ".git" (
    echo Inicializando repositorio Git...
    git init
    echo.
)

REM Crear archivo .gitignore
echo Creando archivo .gitignore...
(
echo # Compiled class file
echo *.class
echo.
echo # Log file
echo *.log
echo.
echo # BlueJ files
echo *.ctxt
echo.
echo # Mobile Tools for Java ^(J2ME^)
echo .mtj.tmp/
echo.
echo # Package Files
echo *.jar
echo *.war
echo *.nar
echo *.ear
echo *.zip
echo *.tar.gz
echo *.rar
echo.
echo # Maven
echo target/
echo pom.xml.tag
echo pom.xml.releaseBackup
echo pom.xml.versionsBackup
echo pom.xml.next
echo release.properties
echo dependency-reduced-pom.xml
echo buildNumber.properties
echo .mvn/timing.properties
echo .mvn/wrapper/maven-wrapper.jar
echo.
echo # Eclipse
echo .metadata
echo bin/
echo tmp/
echo *.tmp
echo *.bak
echo *.swp
echo *~.nib
echo local.properties
echo .settings/
echo .loadpath
echo .recommenders
echo.
echo # IntelliJ IDEA
echo .idea/
echo *.iws
echo *.iml
echo *.ipr
echo out/
echo.
echo # NetBeans
echo /nbproject/private/
echo /nbbuild/
echo /dist/
echo /nbdist/
echo /.nb-gradle/
echo build/
echo !**/src/main/**/build/
echo !**/src/test/**/build/
echo.
echo # VS Code
echo .vscode/
echo.
echo # Spring Boot
echo *.pid
echo spring.log
echo.
echo # Database
echo *.db
echo *.sqlite
echo *.sqlite3
echo.
echo # OS
echo .DS_Store
echo Thumbs.db
echo.
echo # Logs
echo logs/
echo *.log.*
echo.
echo # Temporary files
echo *.tmp
echo *.temp
) > .gitignore

echo.
echo Configurando informacion del usuario Git...
echo Por favor ingrese su informacion:
echo.

set /p nombre="Ingrese su nombre completo: "
set /p email="Ingrese su email: "

git config user.name "%nombre%"
git config user.email "%email%"

echo.
echo Agregando archivos al repositorio...
git add .

echo.
echo Realizando commit inicial...
git commit -m "feat: Implementacion inicial del Gestor de Compras Personales

- Implementacion completa de la version de consola
- Entidades JPA: Categoria, Movimiento, TipoMovimiento
- Repositorios con consultas personalizadas
- Servicios con logica de negocio y validaciones
- Interfaz de consola interactiva con menu completo
- Sistema de categorias predefinidas y personalizadas
- Reportes financieros y estadisticas
- Configuracion de base de datos PostgreSQL
- Documentacion completa en README.md
- Preparado para futura implementacion web"

echo.
echo Conectando con el repositorio remoto de GitHub...
git remote add origin https://github.com/Jecsonrv/gastos-personales-app.git

echo.
echo Verificando conexion remota...
git remote -v

echo.
echo Enviando codigo al repositorio de GitHub...
git branch -M main
git push -u origin main

echo.
echo ==========================================
echo   CONFIGURACION COMPLETADA EXITOSAMENTE
echo ==========================================
echo.
echo Su proyecto ha sido conectado con GitHub.
echo Repositorio: https://github.com/Jecsonrv/gastos-personales-app.git
echo.
echo Para futuros cambios use:
echo   git add .
echo   git commit -m "descripcion del cambio"
echo   git push
echo.
pause