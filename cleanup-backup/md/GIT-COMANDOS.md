# 🔧 Comandos Git Útiles - Gestor de Compras Personales

## 📋 Configuración Inicial

### Conectar proyecto existente con GitHub

```bash
# Inicializar Git
git init

# Agregar repositorio remoto
git remote add origin https://github.com/Jecsonrv/gastos-personales-app.git

# Verificar conexión
git remote -v

# Subir código inicial
git add .
git commit -m "feat: Implementación inicial del proyecto"
git branch -M main
git push -u origin main
```

## 🚀 Comandos Diarios

### Verificar estado del repositorio

```bash
git status
git log --oneline -10
```

### Agregar cambios

```bash
# Agregar todos los archivos modificados
git add .

# Agregar archivo específico
git add src/main/java/com/proyecto/gastospersonales/modelo/Categoria.java

# Ver diferencias antes de commit
git diff
```

### Realizar commits

```bash
# Commit con mensaje descriptivo
git commit -m "feat: Agregar validación de montos negativos"

# Commit más detallado
git commit -m "fix: Corregir cálculo de balance mensual

- Solucionado problema con fechas del mes actual
- Agregada validación de rangos de fecha
- Mejorado rendimiento de consultas"
```

### Sincronizar con GitHub

```bash
# Subir cambios
git push

# Bajar cambios del repositorio
git pull

# Ver ramas remotas
git branch -r
```

## 🌟 Convenciones de Commits

### Tipos de commits

-   `feat:` Nueva funcionalidad
-   `fix:` Corrección de bugs
-   `docs:` Cambios en documentación
-   `style:` Formato, espacios, etc.
-   `refactor:` Refactorización de código
-   `test:` Agregar o modificar tests
-   `chore:` Tareas de mantenimiento

### Ejemplos

```bash
git commit -m "feat: Implementar sistema de categorías personalizadas"
git commit -m "fix: Corregir validación de fechas futuras"
git commit -m "docs: Actualizar README con instrucciones de instalación"
git commit -m "refactor: Optimizar consultas de base de datos"
git commit -m "test: Agregar tests unitarios para MovimientoServicio"
```

## 🔄 Trabajo con Ramas

### Crear y cambiar ramas

```bash
# Crear rama para nueva funcionalidad
git checkout -b feature/interfaz-web

# Cambiar a rama existente
git checkout main

# Ver todas las ramas
git branch -a
```

### Fusionar ramas

```bash
# Cambiar a main
git checkout main

# Fusionar rama de funcionalidad
git merge feature/interfaz-web

# Eliminar rama fusionada
git branch -d feature/interfaz-web
```

## 🛠️ Comandos de Utilidad

### Ver historial

```bash
# Log detallado
git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cd) %C(bold blue)<%an>%Creset' --abbrev-commit --date=short

# Cambios en un archivo específico
git log -p src/main/java/com/proyecto/gastospersonales/servicio/MovimientoServicio.java
```

### Deshacer cambios

```bash
# Deshacer cambios no guardados
git checkout -- src/main/java/com/proyecto/gastospersonales/modelo/Movimiento.java

# Deshacer último commit (mantener cambios)
git reset --soft HEAD~1

# Deshacer último commit (eliminar cambios)
git reset --hard HEAD~1
```

### Tags para versiones

```bash
# Crear tag para versión
git tag -a v1.0.0 -m "Versión 1.0.0 - Implementación completa de consola"

# Subir tags
git push origin --tags

# Ver tags
git tag -l
```

## 📂 Ignorar Archivos

El archivo `.gitignore` ya está configurado para ignorar:

-   Archivos compilados (_.class, _.jar)
-   Directorio target/ de Maven
-   Configuraciones de IDE (.idea/, .vscode/)
-   Logs y archivos temporales
-   Archivos de base de datos locales

## 🚨 Resolución de Conflictos

### Si hay conflictos al hacer pull

```bash
# Ver archivos en conflicto
git status

# Editar manualmente los archivos en conflicto
# Buscar marcadores: <<<<<<< HEAD, =======, >>>>>>>

# Después de resolver conflictos
git add .
git commit -m "resolve: Resolver conflictos de merge"
```

## 📈 Mejores Prácticas

1. **Commits frecuentes**: Hacer commits pequeños y frecuentes
2. **Mensajes descriptivos**: Usar mensajes claros y específicos
3. **Revisar antes de commit**: Usar `git status` y `git diff`
4. **Mantener main limpio**: Trabajar en ramas para nuevas funcionalidades
5. **Sincronizar regularmente**: Hacer `git pull` antes de trabajar

## 🔗 Enlaces Útiles

-   **Repositorio**: https://github.com/Jecsonrv/gastos-personales-app
-   **GitHub Issues**: https://github.com/Jecsonrv/gastos-personales-app/issues
-   **Git Documentation**: https://git-scm.com/doc
