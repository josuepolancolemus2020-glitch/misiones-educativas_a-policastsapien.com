# Formas de examen congeladas

Aquí está cómo sale cada forma de examen el día que se congeló. Hay claves
impresas en las escuelas: la Forma 7 de una misión tiene que seguir siendo la
misma Forma 7 después de construir el motor compartido
(`docs/PLAN-MOTOR-COMPARTIDO.md`).

## Qué hay

- `<carpeta-de-la-misión>.json`: una referencia por misión del alcance.
  - Examen conceptual y prueba operativa, formas 1 a 30.
  - En Fin de grado, formas 1 a 20 de `conceptual-mat`, `conceptual-esp` y
    `operativa`.
  - De cada forma se guarda el `dato` entero (las preguntas, su orden y sus
    respuestas, tal como lo deja la misión), la huella del `texto` que se lee
    en la hoja impresa y la huella de la `hoja` completa.
  - `bancos` lleva el tamaño y la huella de cada banco. Solo sirve para
    explicar un fallo: si un banco cambió, por eso cambian las formas.
- `_critica-pendiente.json`: la prueba de pensamiento crítico **no** se congela
  porque se rehace entera. Este archivo cuenta qué misiones repiten formas hoy
  en esa prueba, para que la sonda distinga lo ya sabido de lo nuevo.

Fuera del alcance: las misiones de docentes, Prebásica y Fracciones
heterogéneas.

## Quién lo usa

- `node _dev/verifica-formas-oro.js` (va en `npm test`): genera las formas con
  el código vigente y las compara con estas.
- `node _dev/genera-formas-oro.js`: escribe la referencia. Se niega a tocar una
  que ya existe.

## Si la sonda se pone roja

No se arregla volviendo a congelar. Se deshace el cambio que alteró la forma.
Volver a congelar (`--sobrescribir <carpeta>`) es decirle al maestro que su
clave impresa ya no vale, y eso lo decide Josué.

La única excepción es un cambio hecho a propósito en cómo se ve la hoja (un
margen, un color) que no cambia lo que dice: `--resellar-hoja <carpeta>`.

Estos archivos no se editan a mano.
