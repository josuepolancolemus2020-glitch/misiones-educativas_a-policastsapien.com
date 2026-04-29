# Guia Editorial

Esta carpeta define como crear, revisar y publicar contenido sin tocar la logica de la app.

## Flujo rapido
- Crear contenido desde `editorial/templates/`.
- Guardar por dominio en `js/data/`.
- Validar con `node editorial/checks/validate-content.js`.
- Pasar estado de `draft` a `review` y luego `published`.
