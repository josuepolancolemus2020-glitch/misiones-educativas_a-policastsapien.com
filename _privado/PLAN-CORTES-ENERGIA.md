# Plan para cortes de energía (Honduras) ⚡

Los cortes de luz son frecuentes y ya nos costaron una sesión de trabajo.
Este plan tiene dos partes: **qué hacer cuando vuelve la luz** y **hábitos para
que un corte nunca vuelva a costar trabajo**.

---

## 1. Cuando vuelve la luz: recuperar la sesión de Claude Code

Claude Code guarda la conversación en disco de forma continua. Aunque el
PowerShell se cierre de golpe, la sesión NO se pierde.

1. Abrir PowerShell en la carpeta del proyecto:
   `cd C:\Desarrollo\misiones-educativas_a-policastsapien.com`
2. Escribir: **`claude --continue`** (retoma la última sesión con todo su contexto).
   - Si quieres elegir entre varias sesiones: `claude --resume`.
3. Primer mensaje recomendado al retomar:
   > «Se fue la luz. Revisa `git status` y `git log -5`, dime qué quedó a medias y continúa.»

Los archivos que Claude ya había editado **sí quedan guardados en disco**;
lo único que se pierde es el paso que estaba a medio ejecutar. Con
`git status` se ve exactamente dónde quedó todo.

## 2. Hábitos que blindan el trabajo

- **Commits pequeños y frecuentes**: pedir a Claude que haga commit al terminar
  cada paso (ya es el estilo de este repo). Un corte solo puede costar el paso
  actual, nunca la mañana entera.
- **`git push` al final de cada bloque de trabajo**: un corte también puede
  dañar el disco. Lo que está en GitHub es indestructible desde aquí.
- **Respaldo exprés antes de levantarse de la silla**: doble clic a
  `respaldo-rapido.cmd` (en la raíz del repo). Hace commit de TODO lo pendiente
  con fecha y hora, y lo sube a GitHub. Tarda segundos.

## 3. Para trabajos largos: que el corte no detenga a Claude

- **Claude Code en la web** ([claude.ai/code](https://claude.ai/code)): la sesión
  corre en la nube, no en tu computadora. Si se va la luz, el trabajo **sigue
  avanzando** y lo revisas desde el teléfono con datos móviles. Ideal para
  réplicas masivas en las 28 misiones o tareas de más de 15 minutos.
- **`/remote-control`** en una sesión local permite seguirla desde el teléfono,
  pero ojo: si se apaga la computadora, la sesión local se detiene igual.
  Para inmunidad total al corte, usar la versión web.

## 4. Hardware (inversión única recomendada)

- **UPS / batería de respaldo** (~L.1,500–2,500): da 10–20 minutos para guardar,
  hacer `respaldo-rapido.cmd` y apagar bien. También protege el disco de los
  picos de voltaje al regresar la luz, que son los que realmente dañan equipos.
- Si es laptop: trabajar con la batería puesta ya cumple esta función.
- Regleta con protector de picos como mínimo absoluto.

## 5. Resumen en una línea

> Volvió la luz → `claude --continue` → «revisa git status y retoma».
> Antes de pararte → doble clic a `respaldo-rapido.cmd`.
