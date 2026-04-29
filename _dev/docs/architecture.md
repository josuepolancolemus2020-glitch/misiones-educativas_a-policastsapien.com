# Arquitectura (Fase de Transicion)

La aplicacion sigue ejecutando la logica principal desde `js/app.js`.

Se agrego una arquitectura modular paralela para migracion gradual:
- `js/core` para estado, rutas y eventos.
- `js/services` para datos, almacenamiento y progreso.
- `js/render` para vistas.
- `js/ui` para componentes de interfaz.
- `js/data` para contenido editorial desacoplado.
