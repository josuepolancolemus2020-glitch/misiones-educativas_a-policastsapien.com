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
  - La prueba de pensamiento crítico (`critica`, formas 1 a 50) solo en las
    misiones que ya reparten sus formas sin repetir y cuyo banco aprobó Josué.
    La referencia lleva entonces `criticaCongelada` y `criticaDesde`.
  - En las once misiones de estructura propia (Adjetivos, Adverbios, Áreas
    protegidas, Eras geológicas, Coordenadas, los dos de Continentes,
    Pronombres, Sustantivos, Verbos y Adjetivos de bachillerato) las formas
    1 a 30 de la crítica NO se repartieron de nuevo: están congeladas tal
    como salían con su sorteo, y la referencia lo dice con `criticaDeAntes`.
    Sus formas 31 a 50 son nuevas y se añaden aparte (`criticaAmpliada`).
- `_critica-pendiente.json`: la prueba de pensamiento crítico se rehízo entera
  y pasa al reparto sin repetir por tandas. Este archivo cuenta qué misiones
  siguen sacando los casos al azar y repiten formas, para que la sonda
  distinga lo ya sabido de lo nuevo. Una misión sale de aquí cuando reparte.

Fuera del alcance: las misiones de docentes, Prebásica y Fracciones
heterogéneas.

## Quién lo usa

- `node _dev/verifica-formas-oro.js` (va en `npm test`): genera las formas con
  el código vigente y las compara con estas.
- `node _dev/genera-formas-oro.js`: escribe la referencia. Se niega a tocar una
  que ya existe.
- `node _dev/genera-formas-oro.js --critica <carpeta>`: añade a una referencia
  que ya existe las formas de la prueba de pensamiento crítico, sin tocar lo
  demás. Solo cuando Josué aprobó el banco de esa misión: desde ese momento su
  pauta impresa queda fija.
- `node _dev/genera-formas-oro.js --critica-de-antes <carpeta>`: congela la
  crítica de una misión de estructura propia tal como sale hoy con su sorteo
  (formas 1 a 30), ANTES de tocarla.
- `node _dev/genera-formas-oro.js --critica-ampliar <carpeta>`: añade después
  las formas nuevas (31 a 50), cuando Josué las aprobó. Se niega si alguna de
  las de antes ya no sale idéntica.
- `node _dev/verifica-critica-sin-repetir.js` (va en `npm test`): ninguna forma
  crítica repite el conjunto de casos de otra y todo sale del banco de su misión.

## Si la sonda se pone roja

No se arregla volviendo a congelar. Se deshace el cambio que alteró la forma.
Volver a congelar (`--sobrescribir <carpeta>`) es decirle al maestro que su
clave impresa ya no vale, y eso lo decide Josué.

La única excepción es un cambio hecho a propósito en cómo se ve la hoja (un
margen, un color) que no cambia lo que dice: `--resellar-hoja <carpeta>`.

Estos archivos no se editan a mano.
