#!/usr/bin/env python3
"""
Archivo de ejecución simple para el Sistema de Gastos Personales
Equivalente a run.py - Solo ejecuta este archivo para iniciar toda la aplicación

Uso:
    python run.py
    
Opciones:
    python run.py web      - Modo web (por defecto)
    python run.py consola  - Modo consola
    python run.py full     - Modo completo (backend + frontend)
    python run.py compile  - Solo compilar
"""

import os
import sys
import subprocess
import time
import platform
from pathlib import Path

# Configuración
JAR_PATH = "target/gastos-personales-1.0.0.jar"
MAVEN_CMD = "mvnw.cmd" if platform.system() == "Windows" else "./mvnw"

def print_header():
    print("=" * 60)
    print("🚀 SISTEMA DE GASTOS PERSONALES")
    print("=" * 60)
    print()

def show_menu():
    print("Selecciona el modo de ejecución:")
    print()
    print("1. 🌐 Modo Web (Recomendado)")
    print("   - Servidor web en http://localhost:8080")
    print("   - Frontend React en http://localhost:5173")
    print("   - API REST completa")
    print()
    print("2. 💻 Modo Consola")
    print("   - Interfaz de línea de comandos")
    print("   - Funcionalidad básica")
    print()
    print("3. 🔧 Recompilar y ejecutar")
    print("   - Limpia y recompila todo el proyecto")
    print()
    print("4. 🎯 Ejecutar completo (Backend + Frontend)")
    print("   - Inicia automáticamente backend y frontend")
    print()
    
    try:
        opcion = input("Ingresa tu opción (1-4) o presiona Enter para modo web: ").strip()
        return opcion
    except KeyboardInterrupt:
        print("\n👋 ¡Hasta luego!")
        sys.exit(0)

def compile_application():
    """Compila la aplicación usando Maven"""
    print("📦 Compilando la aplicación...")
    print(f"Ejecutando: {MAVEN_CMD} clean package -DskipTests")
    
    try:
        result = subprocess.run(
            [MAVEN_CMD, "clean", "package", "-DskipTests"],
            cwd=".",
            check=True
        )
        print("✅ Compilación completada exitosamente")
        print()
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error en la compilación. Código de salida: {e.returncode}")
        return False
    except FileNotFoundError:
        print("❌ Error: No se encontró Maven. Asegúrate de que esté instalado.")
        return False

def check_jar_exists():
    """Verifica si el JAR existe, si no, compila"""
    if not os.path.exists(JAR_PATH):
        print("📦 El archivo JAR no existe. Compilando...")
        return compile_application()
    return True

def start_web_mode():
    """Inicia la aplicación en modo web"""
    if not check_jar_exists():
        return
        
    print("🌐 Iniciando en Modo Web...")
    print()
    print("🔗 URLs disponibles:")
    print("   Backend:  http://localhost:8080")
    print("   Frontend: http://localhost:5173")
    print()
    print("📝 Para iniciar el frontend, ejecuta en otra terminal:")
    print("   cd frontend && npm run dev")
    print()
    print("⚡ Iniciando servidor backend...")
    print("   Presiona Ctrl+C para detener")
    print("-" * 50)
    
    try:
        subprocess.run(["java", "-jar", JAR_PATH, "web"], check=True)
    except KeyboardInterrupt:
        print("\n👋 Servidor detenido")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error al ejecutar el servidor: {e.returncode}")

def start_console_mode():
    """Inicia la aplicación en modo consola"""
    if not check_jar_exists():
        return
        
    print("💻 Iniciando en Modo Consola...")
    print("-" * 50)
    
    try:
        subprocess.run(["java", "-jar", JAR_PATH, "consola"], check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Error al ejecutar la aplicación: {e.returncode}")

def start_full_mode():
    """Inicia backend y frontend automáticamente"""
    if not check_jar_exists():
        return
        
    print("🎯 Iniciando aplicación completa (Backend + Frontend)...")
    print()
    
    # Iniciar backend en proceso separado
    print("⚡ Iniciando servidor backend...")
    backend_process = None
    
    try:
        backend_process = subprocess.Popen(
            ["java", "-jar", JAR_PATH, "web"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
        
        # Esperar a que el backend se inicie
        print("Esperando a que el backend se inicie...")
        time.sleep(8)
        
        # Verificar que el backend esté corriendo
        if backend_process.poll() is None:
            print("✅ Backend iniciado correctamente")
            
            # Cambiar al directorio frontend
            frontend_dir = Path("frontend")
            if frontend_dir.exists():
                print("🎨 Iniciando frontend...")
                
                # Verificar si node_modules existe
                if not (frontend_dir / "node_modules").exists():
                    print("📦 Instalando dependencias del frontend...")
                    subprocess.run(["npm", "install"], cwd=frontend_dir, check=True)
                
                print()
                print("🔗 Aplicación disponible en:")
                print("   🌐 Frontend: http://localhost:5173")
                print("   ⚙️  Backend:  http://localhost:8080")
                print()
                print("   Presiona Ctrl+C para detener ambos servidores")
                print("-" * 50)
                
                # Iniciar frontend (esto bloquea hasta que se termina)
                try:
                    subprocess.run(["npm", "run", "dev"], cwd=frontend_dir, check=True)
                except KeyboardInterrupt:
                    print("\n👋 Deteniendo servidores...")
                
            else:
                print("❌ Error: No se encontró el directorio frontend")
                
        else:
            print("❌ Error: No se pudo iniciar el backend")
            
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        # Asegurarse de terminar el proceso backend
        if backend_process and backend_process.poll() is None:
            print("🛑 Deteniendo servidor backend...")
            backend_process.terminate()
            backend_process.wait()

def recompile_and_run():
    """Recompila y permite elegir modo de ejecución"""
    print("🔧 Recompilando toda la aplicación...")
    
    if compile_application():
        print("Compilación terminada. ¿Qué modo deseas ejecutar ahora?")
        opcion = show_menu()
        execute_option(opcion)
    else:
        print("❌ La recompilación falló")

def execute_option(opcion):
    """Ejecuta la opción seleccionada"""
    opcion = opcion.lower().strip()
    
    if opcion in ["1", "web", ""]:
        start_web_mode()
    elif opcion in ["2", "consola"]:
        start_console_mode()
    elif opcion in ["3", "recompilar", "compile"]:
        recompile_and_run()
    elif opcion in ["4", "full", "completo"]:
        start_full_mode()
    else:
        print("❌ Opción no válida. Ejecutando modo web por defecto...")
        start_web_mode()

def main():
    """Función principal"""
    print_header()
    
    try:
        # Si se pasan argumentos de línea de comandos
        if len(sys.argv) > 1:
            mode = sys.argv[1].lower()
            execute_option(mode)
        else:
            # Mostrar menú interactivo
            opcion = show_menu()
            execute_option(opcion)
            
    except KeyboardInterrupt:
        print("\n👋 ¡Hasta luego!")
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()