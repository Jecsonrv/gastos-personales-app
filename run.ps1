#!/usr/bin/env pwsh
# Script de ejecución para Sistema de Gastos Personales
# Equivalente a run.py - Ejecuta este script para iniciar toda la aplicación

Write-Host "============================================================" -ForegroundColor Green
Write-Host "🚀 SISTEMA DE GASTOS PERSONALES" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""

$JAR_PATH = "target/gastos-personales-1.0.0.jar"
$MAVEN_CMD = ".\mvnw.cmd"

function Show-Menu {
    Write-Host "Selecciona el modo de ejecución:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. 🌐 Modo Web (Recomendado)" -ForegroundColor Cyan
    Write-Host "   - Servidor web en http://localhost:8080" -ForegroundColor Gray
    Write-Host "   - Frontend React en http://localhost:5173" -ForegroundColor Gray
    Write-Host "   - API REST completa" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. 💻 Modo Consola" -ForegroundColor Cyan
    Write-Host "   - Interfaz de línea de comandos" -ForegroundColor Gray
    Write-Host "   - Funcionalidad básica" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. 🔧 Recompilar y ejecutar" -ForegroundColor Cyan
    Write-Host "   - Limpia y recompila todo el proyecto" -ForegroundColor Gray
    Write-Host ""
    Write-Host "4. 🎯 Ejecutar completo (Backend + Frontend)" -ForegroundColor Cyan
    Write-Host "   - Inicia automáticamente backend y frontend" -ForegroundColor Gray
    Write-Host ""
    $opcion = Read-Host "Ingresa tu opción (1-4) o presiona Enter para modo web"
    return $opcion
}

function Compile-Application {
    Write-Host "📦 Compilando la aplicación..." -ForegroundColor Yellow
    Write-Host "Ejecutando: $MAVEN_CMD clean package -DskipTests" -ForegroundColor Gray
    
    & $MAVEN_CMD clean package -DskipTests
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error en la compilación" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Compilación completada exitosamente" -ForegroundColor Green
    Write-Host ""
}

function Start-WebMode {
    Write-Host "🌐 Iniciando en Modo Web..." -ForegroundColor Green
    Write-Host ""
    Write-Host "🔗 URLs disponibles:" -ForegroundColor Yellow
    Write-Host "   Backend:  http://localhost:8080" -ForegroundColor Cyan
    Write-Host "   Frontend: http://localhost:5173" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📝 Para iniciar el frontend, ejecuta en otra terminal:" -ForegroundColor Yellow
    Write-Host "   cd frontend && npm run dev" -ForegroundColor Gray
    Write-Host ""
    Write-Host "⚡ Iniciando servidor backend..." -ForegroundColor Green
    Write-Host "   Presiona Ctrl+C para detener" -ForegroundColor Red
    Write-Host "----------------------------------------------------"
    
    java -jar $JAR_PATH web
}

function Start-ConsoleMode {
    Write-Host "💻 Iniciando en Modo Consola..." -ForegroundColor Green
    Write-Host "----------------------------------------------------"
    
    java -jar $JAR_PATH consola
}

function Start-FullStackMode {
    Write-Host "🎯 Iniciando aplicación completa (Backend + Frontend)..." -ForegroundColor Green
    Write-Host ""
    
    # Iniciar backend en background
    Write-Host "⚡ Iniciando servidor backend..." -ForegroundColor Yellow
    Start-Job -ScriptBlock { 
        Set-Location "C:\Users\Noe Portillo\Documents\GitHub\gastos-personales-app"
        java -jar target/gastos-personales-1.0.0.jar web 
    } -Name "BackendServer"
    
    # Esperar un poco para que el backend se inicie
    Start-Sleep -Seconds 5
    
    # Verificar que el backend esté corriendo
    $backendRunning = $false
    for ($i = 0; $i -lt 10; $i++) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:8080" -TimeoutSec 2 -ErrorAction SilentlyContinue
            $backendRunning = $true
            break
        }
        catch {
            Start-Sleep -Seconds 2
        }
    }
    
    if ($backendRunning) {
        Write-Host "✅ Backend iniciado correctamente" -ForegroundColor Green
        
        # Iniciar frontend
        Write-Host "🎨 Iniciando frontend..." -ForegroundColor Yellow
        Set-Location "frontend"
        
        # Verificar si node_modules existe
        if (-not (Test-Path "node_modules")) {
            Write-Host "📦 Instalando dependencias del frontend..." -ForegroundColor Yellow
            npm install
        }
        
        Write-Host ""
        Write-Host "🔗 Aplicación disponible en:" -ForegroundColor Green
        Write-Host "   🌐 Frontend: http://localhost:5173" -ForegroundColor Cyan
        Write-Host "   ⚙️  Backend:  http://localhost:8080" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "   Presiona Ctrl+C para detener ambos servidores" -ForegroundColor Red
        Write-Host "----------------------------------------------------"
        
        npm run dev
    } else {
        Write-Host "❌ Error: No se pudo iniciar el backend" -ForegroundColor Red
        Write-Host "Verifica que el puerto 8080 esté disponible" -ForegroundColor Yellow
    }
}

function Recompile-And-Run {
    Write-Host "🔧 Recompilando toda la aplicación..." -ForegroundColor Yellow
    
    Compile-Application
    
    Write-Host "Compilación terminada. ¿Qué modo deseas ejecutar ahora?" -ForegroundColor Yellow
    $opcion = Show-Menu
    
    Execute-Option $opcion
}

function Execute-Option($opcion) {
    switch ($opcion.ToLower()) {
        "1" { Start-WebMode }
        "web" { Start-WebMode }
        "" { Start-WebMode }
        "2" { Start-ConsoleMode }
        "consola" { Start-ConsoleMode }
        "3" { Recompile-And-Run }
        "recompilar" { Recompile-And-Run }
        "4" { Start-FullStackMode }
        "full" { Start-FullStackMode }
        "completo" { Start-FullStackMode }
        default {
            Write-Host "❌ Opción no válida. Ejecutando modo web por defecto..." -ForegroundColor Red
            Start-WebMode
        }
    }
}

# Función principal
try {
    # Verificar si el JAR existe, si no, compilar
    if (-not (Test-Path $JAR_PATH)) {
        Compile-Application
    }
    
    # Mostrar menú y ejecutar
    $opcion = Show-Menu
    Execute-Option $opcion
    
} catch {
    Write-Host "❌ Error al ejecutar la aplicación: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host $_.ScriptStackTrace -ForegroundColor Gray
}