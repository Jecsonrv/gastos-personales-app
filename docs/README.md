Generar diagramas PlantUML

Este directorio contiene los archivos PlantUML (.puml) para los diagramas del proyecto.

Archivos:

-   diagrama_clases.puml
-   casos_uso.puml
-   secuencia_crear_movimiento.puml
-   actividad_eliminar_categoria.puml

Opciones para generar imágenes (Windows):

1. Usando la extensión de VSCode (recomendada si trabajas en VSCode):

    - Instala la extensión "PlantUML" y Graphviz si no está instalado.
    - Abre un archivo `.puml` y usa la opción "Preview" o "Export PNG/SVG".

2. Usando PlantUML jar (requiere Java):
    - Descargar PlantUML: https://plantuml.com/download
    - Descargar Graphviz (para diagramas que lo requieran): https://graphviz.org/download/
    - Generar PNG:

```powershell
# desde la raíz del proyecto en PowerShell
cd docs
java -jar path\to\plantuml.jar diagrama_clases.puml
# Esto generará diagrama_clases.png en el mismo directorio
```

3. Usando Docker:

```powershell
# requiere docker
cd docs
docker run --rm -v %cd%:/workspace plantuml/plantuml:latest diagrama_clases.puml
```

Consejos:

-   Si el diagrama usa fuentes especiales o incluye UML avanzado, asegúrate de tener Graphviz instalado y en PATH.
-   Puedes exportar directamente a SVG cambiando la extensión objetivo: `java -jar plantuml.jar -tsvg archivo.puml`

Siguiente paso recomendado:

-   Ejecutar alguno de los comandos anteriores para generar PNG/SVG en `docs/` y luego mover esos archivos a `docs/images/` y referenciarlos desde `DOCUMENTACION_PROYECTO.md`.
