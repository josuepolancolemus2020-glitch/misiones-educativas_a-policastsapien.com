# Auditoría integral de M.E.T.A.S. — estado del trabajo

**Rescatado el 6 de septiembre de 2026.** Los hallazgos de todos los auditores que llegaron a
terminar están en `crudo/`, un archivo por área. Cada hallazgo lleva su severidad, su tipo, su
evidencia (archivo y línea, medición o captura), su recomendación y, cuando pasó revisión
adversarial, el veredicto del revisor en el campo `verificado`.

Lo que sigue es el inventario exacto de lo hecho y de lo que falta, para poder retomarlo sin
repetir nada de lo que ya se pagó.

## Lentes completadas

| área | lentes | hallazgos | revisados |
|---|---|---:|---:|
| `tecnica-codigo` | T1 Arquitectura completa<br>T2 Calidad del código HTML/CSS/JS y redundancia<br>T5 Rendimiento<br>T8 Dependencias y vulnerabilidades<br>T10 Pruebas, CI y proceso de entrega | 60 | 12 |
| `tecnica-datos` | T3 Base de datos y autenticación<br>T4 Seguridad<br>T9 Escalabilidad a miles de estudiantes | 36 | 36 |
| `tecnica-acceso` | T6 Accesibilidad | 12 | 0 |
| `pedagogica-curriculo` | P1 Correspondencia con el DCNB<br>P2 Coherencia competencia → contenido → misión → actividad → evaluación<br>P3 Nivel cognitivo y pensamiento crítico<br>P10 Calidad y corrección del contenido | 48 | 48 |
| `pedagogica-aprendizaje` | P4 Retroalimentación al estudiante<br>P5 Progresión de dificultad<br>P6 Gamificación<br>P7 Evidencias de aprendizaje | 48 | 48 |
| `pedagogica-docente` | P8 Adaptación a distintos ritmos<br>P9 Utilidad real para el docente | 24 | 24 |
| `ux` | U4 Alumna de 4º grado<br>U5 Alumno de 5º grado<br>U6 Alumna de 6º grado<br>U7 Alumno de 7º grado | 48 | 12 |
| `ux-b` | U9 Alumno de 9º grado | 12 | 0 |
| `producto` | B1 Propuesta de valor y diferenciación<br>B2 Modelo de negocio, precios y costos<br>B3 Mercado: Honduras y Centroamérica<br>B4 Qué sobra y qué falta | 48 | 48 |
| **total** | **28 lentes** | **336** | **228** |

Los hallazgos con `verificado: true` sobrevivieron a un revisor adversarial independiente que
intentó tumbarlos con el código delante. Los demás son la lectura de un solo auditor y hay que
tratarlos como tales hasta que se revisen.

## Lentes que faltan

Son siete, y cuatro las pidió el encargo por su nombre: probar la aplicación como docente, como
madre o padre de familia, como administración y como alumna de 8º grado.

| área | lente pendiente |
|---|---|
| `tecnica-acceso` | T11 Integridad de datos y sincronización sin conexión |
| `tecnica-acceso` | T7 Compatibilidad móvil, PWA y Android |
| `ux` | U8 Alumna de 8º grado |
| `ux-b` | U10 Docente |
| `ux-b` | U11 Madre o padre de familia |
| `ux-b` | U12 Administrador y dirección |
| `ux-b` | U13 Arquitectura de la información y consistencia visual |

## Lo que falta después de eso

1. Revisión adversarial de las lentes que no la tienen: 108 hallazgos sin verificar.
2. La síntesis por área. Hoy solo está escrita la de producto, en `4-producto.md`.
3. La lista priorizada de las 20 modificaciones de mayor impacto y menor esfuerzo.
4. El informe integral y su publicación.

## Archivos

| archivo | qué es |
|---|---|
| `00-metodo.md` | cómo se hizo la auditoría y qué no se pudo comprobar |
| `4-producto.md` | la sección de producto, ya redactada y deduplicada |
| `crudo/<área>-hallazgos.json` | los hallazgos de esa área, con evidencia y veredicto |
| `crudo/<área>-resumenes.json` | el resumen ejecutivo de cada auditor y lo que encontró bien |
| `crudo/producto-sintetizado.json` | los 33 hallazgos de producto tras fundir duplicados |
