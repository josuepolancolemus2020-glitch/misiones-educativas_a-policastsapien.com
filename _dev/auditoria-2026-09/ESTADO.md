# Auditoría integral de M.E.T.A.S. — estado del trabajo

**Cerrada el 9 de septiembre de 2026.** La primera corrida (5-6 de septiembre) dejó 28 de las 35 lentes hechas y 108 hallazgos sin revisor; la segunda corrió las siete que faltaban y la revisión adversarial de esos 108, todo contra el código de ese día (`d940fe0`, con las 20 modificaciones de la primera lista ya aplicadas). Los hallazgos de todos los auditores están en `crudo/`, un archivo por área, con su severidad, tipo, evidencia, recomendación y el veredicto del revisor.

## Las 35 lentes

| área | lentes | hallazgos | revisados | de ellos, ya corregidos | descartados | sección |
|---|---|---:|---:|---:|---:|---|
| `tecnica-codigo` | T1 Arquitectura completa<br>T2 Calidad del código HTML/CSS/JS y redundancia<br>T5 Rendimiento<br>T8 Dependencias y vulnerabilidades<br>T10 Pruebas, CI y proceso de entrega | 60 | 60 | 13 | 0 | 1a-tecnica-codigo.md |
| `tecnica-datos` | T3 Base de datos y autenticación<br>T4 Seguridad<br>T9 Escalabilidad a miles de estudiantes | 36 | 36 | 6 | 0 | 1b-tecnica-datos.md |
| `tecnica-acceso` | T6 Accesibilidad<br>T11 Integridad de datos y sincronización sin conexión<br>T7 Compatibilidad móvil, PWA y Android | 35 | 35 | 2 | 1 | 1c-tecnica-acceso.md · 1d-tecnica-integridad-movil.md |
| `pedagogica-curriculo` | P1 Correspondencia con el DCNB<br>P2 Coherencia competencia → contenido → misión → actividad → evaluación<br>P3 Nivel cognitivo y pensamiento crítico<br>P10 Calidad y corrección del contenido | 46 | 46 | 4 | 2 | 2a-pedagogica-curriculo.md |
| `pedagogica-aprendizaje` | P4 Retroalimentación al estudiante<br>P5 Progresión de dificultad<br>P6 Gamificación<br>P7 Evidencias de aprendizaje | 48 | 48 | 8 | 0 | 2b-pedagogica-aprendizaje.md |
| `pedagogica-docente` | P8 Adaptación a distintos ritmos<br>P9 Utilidad real para el docente | 24 | 24 | 1 | 0 | 2c-pedagogica-docente.md |
| `ux` | U4 Alumna de 4º grado<br>U5 Alumno de 5º grado<br>U6 Alumna de 6º grado<br>U7 Alumno de 7º grado<br>U8 Alumna de 8º grado | 60 | 60 | 12 | 0 | 3-ux.md · 3c-ux-octavo-grado.md |
| `ux-b` | U9 Alumno de 9º grado<br>U10 Docente<br>U11 Madre o padre de familia<br>U12 Administrador y dirección<br>U13 Arquitectura de la información y consistencia visual | 57 | 57 | 3 | 3 | 3-ux.md (9º) · 3b-ux-docente-familia-direccion.md |
| `producto` | B1 Propuesta de valor y diferenciación<br>B2 Modelo de negocio, precios y costos<br>B3 Mercado: Honduras y Centroamérica<br>B4 Qué sobra y qué falta | 48 | 48 | 4 | 0 | 4-producto.md |
| **total** | **35 lentes** | **414** | **414** | **53** | **6** | |

«Hallazgos» son los que siguen en pie: los que un revisor tumbó no se cuentan aquí, pero no se borran —quedan en `crudo/<área>-hallazgos.json` con `refutado: true` y su motivo, o en `crudo/<área>-descartados.json` los de la segunda corrida— para que el creador vea qué se consideró y por qué se cayó. «Revisados» son los que pasaron por un revisor adversarial que intentó tumbarlos con el código delante. «Ya corregidos» son hallazgos ciertos que el código de hoy corrige (`resuelto: true`, con `motivo_resolucion` que dice qué lo corrige): los que el revisor del 9 de septiembre encontró corregidos al releerlos, y los que sostenían la primera lista de 20 —ya revisados el 6— y que su fila cerró del todo (`resuelto_por` apunta a la fila). Los que una fila cerró solo en parte siguen en pie.

## Lo que queda

1. **Del encargo, nada.** Las 35 lentes corrieron y los 414 hallazgos en pie tienen veredicto de revisor. Lo que sí queda, y lo señaló el crítico de completitud: **306 conservan el veredicto de la primera tanda, sobre `9ce2ac1`**, y en una muestra de 15 cinco estaban desfasados. Releerlos contra el código de hoy —los que toquen un archivo cambiado desde `9ce2ac1`, con `git diff --stat`— es lo primero de la siguiente tanda; hasta entonces, la columna «ya corregidos» es un piso, no una cuenta cerrada.
2. La lista de las 20 modificaciones siguientes está en `5-top-20.md`; la anterior, ya ejecutada, en `5-top-20-septiembre-6.md`.
3. Lo que los revisores echaron en falta —problemas que vieron mientras revisaban y que ningún auditor había escrito— está en `crudo/<área>-echados-en-falta.json`; no son hallazgos con evidencia completa y no entran en los conteos.

## Archivos

| archivo | qué es |
|---|---|
| `../../AUDITORIA-INTEGRAL-2026-09.md` | el informe integral, en la raíz del repositorio: resumen y índice |
| `00-metodo.md` | cómo se hizo la auditoría, qué se corrió de verdad y qué no se pudo comprobar |
| `1a-tecnica-codigo.md` | arquitectura, calidad, rendimiento, dependencias y proceso |
| `1b-tecnica-datos.md` | base de datos, autenticación, seguridad y escalabilidad |
| `1c-tecnica-acceso.md` | accesibilidad |
| `1d-tecnica-integridad-movil.md` | integridad de datos y sincronización sin conexión; móvil, PWA y Android |
| `2a-pedagogica-curriculo.md` | DCNB, coherencia curricular, nivel cognitivo y contenido |
| `2b-pedagogica-aprendizaje.md` | retroalimentación, progresión, gamificación y evidencias |
| `2c-pedagogica-docente.md` | ritmos de aprendizaje y utilidad real para el docente |
| `3-ux.md` | la aplicación probada como alumno de 4º, 5º, 6º, 7º y 9º |
| `3b-ux-docente-familia-direccion.md` | la aplicación probada como docente, familia y dirección; arquitectura de la información |
| `3c-ux-octavo-grado.md` | la aplicación probada como alumna de 8º |
| `4-producto.md` | valor, negocio, mercado, qué sobra y qué falta |
| `5-top-20.md` | las 20 modificaciones siguientes, con evidencia y cómo comprobar cada una |
| `5-top-20-septiembre-6.md` | la primera lista de 20, ya ejecutada, con el bloque «✅ Corregido» de cada una |
| `crudo/<área>-hallazgos.json` | los hallazgos de esa área, con evidencia y veredicto |
| `crudo/<área>-resumenes.json` | el resumen ejecutivo de cada auditor y lo que encontró bien |
| `crudo/<área>-descartados.json` | lo que el revisor tumbó en la segunda corrida, con su motivo |
| `crudo/<área>-echados-en-falta.json` | lo que los revisores vieron y ningún auditor había escrito |
| `maquinaria/` | los flujos, el contexto que leyó cada agente y cómo se retomó |
