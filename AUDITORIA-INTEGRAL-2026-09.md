# Auditoría integral de M.E.T.A.S. — septiembre de 2026

**Estado auditado:** el commit `9ce2ac1` de `main` (28 de agosto de 2026), tal como se sirve en
metas.policastsapien.com.
**Encargo:** cuatro auditorías —técnica, pedagógica, de experiencia de uso y de producto— con la
consigna expresa de **no proteger las decisiones existentes del creador**.
**Resultado:** 336 hallazgos con evidencia, 228 de ellos revisados por un auditor adversarial, y
una lista de 20 modificaciones ordenada por impacto y esfuerzo.

Este archivo es el índice y el resumen. El detalle está en `_dev/auditoria-2026-09/`.

---

## Por dónde empezar

| si tiene… | lea |
|---|---|
| diez minutos | este resumen, y la tabla de [`5-top-20.md`](_dev/auditoria-2026-09/5-top-20.md) |
| una tarde | las ocho secciones, en el orden de la tabla de abajo |
| ganas de arreglar algo hoy | los ocho puntos «de horas» del top 20 |
| que decidir si esto se vende | [`4-producto.md`](_dev/auditoria-2026-09/4-producto.md) y los puntos 15, 17 y 18 |

---

## Lo primero, porque es verdad

Un informe que solo enumera fallos miente por omisión. Esto es lo que los auditores encontraron
bien hecho, y lo dicen ellos, no la cortesía:

- **Sin internet, todo funciona.** Cinco alumnos recorrieron la portada, el catálogo, doce
  misiones, el quiz, la lectura de un minuto, los juegos 3D y las pruebas de fin de grado con
  Supabase, YouTube y el CDN cortados, **sin un solo error de JavaScript propio**. Para una
  plataforma que promete funcionar en un aula sin señal, ese es el cimiento, y está puesto.
- **La aritmética es sólida.** Se recalcularon en Node las respuestas de 1 220 ítems generados —
  las 20 formas de la Prueba de Fin de Grado de 6º y las 30 de Fracciones— con **cero errores de
  cálculo**, y las pautas impresas coinciden ítem por ítem con sus claves.
- **El corpus de lectura** (400 textos hondureños, con humor y con dignidad, con preguntas
  tipificadas) es, según el auditor de contenido, «probablemente el mejor activo de contenido de
  la plataforma».
- **Los 341 archivos JavaScript pasan `node --check` sin un fallo**, sin `console.log` olvidados,
  sin identificadores duplicados, sin colisiones entre los 776 nombres globales de la portada, y
  `npm audit` no encuentra ninguna vulnerabilidad en producción.
- **Pasar lista cuesta seis toques y menos de dos segundos, sin señal.** Es lo que el maestro hace
  todos los días, y está bien hecho.
- **La arquitectura de la nube es correcta en lo básico:** unas 70 funciones RPC sobre 21 tablas,
  todas con RLS activada, nada toca las tablas directamente, los PIN hasheados, el reset por
  correo que no revela si un correo existe, y deduplicación por `evento_id`. **El historial de
  git está limpio:** cero claves de servicio, cero JWT, cero contraseñas.
- **Las decisiones de contexto están bien tomadas y hay que defenderlas:** la clave de familia sin
  cuenta, el código de aula sin contraseña, el papel medido en páginas de PDF, la ✗ que no se usa
  para señalar lo correcto, el símbolo patrio completo. Ninguna sale de un manual de buenas
  prácticas; salen de un aula.
- **Y el camino para arreglar lo que sigue ya está probado dentro del propio proyecto:** el
  andamio de los juegos 3D, el aparato de videos y el registro de evidencia son tres extracciones
  de código común que funcionaron.

---

## Los cinco problemas de fondo

### 1. La nota que el maestro recibe no mide aprendizaje

Es el hallazgo que más se repite, encontrado por separado por cuatro auditores que no se hablaban:
la lente de evidencias, la de coherencia curricular, el alumno de 5º grado y el de 6º.

- El botón **«👁 Ver Pauta»** está junto a «Calificar», antes de calificar, en las **66 misiones**.
  Reproducido de punta a punta: calificar en blanco da 0/100; ver la pauta, copiar y calificar da
  100/100; **las dos notas entran al registro**, y todos los consumidores —rutas, progreso,
  Estadísticas, la tarjeta que ve la familia— usan la mejor.
- El anti-trampa `pauta_vista` **solo se dispara al imprimir**: ver la pauta en pantalla no deja
  rastro.
- ~~En **siete misiones de Robótica**, 30 de los 100 puntos los escribe el alumno en una casilla
  numérica y el total se registra como nota calificada.~~ **Corregido el 6 de septiembre**: el
  panel registra solo lo que califica la máquina y lo dice; ver el punto 1 del top 20.
- El XP se vuelve a ganar recargando la página: tres recargas volteando tarjetas llevaron el
  contador de 13 a 56 puntos y emitieron una Constancia de Logro **sin una sola respuesta
  correcta**.

Y en el otro extremo del circuito, **el maestro vuelve a teclear a mano** las notas que la
aplicación ya calculó: el Plan de Acción no consulta la nube ni una vez.

### 2. Dos niños distintos se funden en un mismo informe

`estadisticas-alumno.js:274-283` empareja las filas de la nube por número de lista y los dígitos
del grado, **sin mirar nunca la sección**: el número 7 de 6º-1 recibe en su informe firmado la
práctica del número 7 de 6º-2. En el otro sentido, «Ana López» y «ana lopez» son dos alumnos
distintos, y el que no escribió su número —que es opcional— no aparece nunca.

Ese informe lo firma la familia.

### 3. La promesa de funcionar sin internet se rompe en cada despliegue

~~El service worker **no precachea el armazón** (ni `index.html`, ni `app.js`, ni `app.css`): hace
falta una segunda visita en línea. Y al activarse **borra toda la caché**, incluidas las misiones
que el alumno había abierto con señal justamente para usarlas sin ella. `sw.js` cambió 37 veces
entre el 13 y el 28 de agosto.~~

**Corregido el 6 de septiembre** (punto 6 del top 20): dos cachés —una para el armazón, que se
renueva, y otra para lo visitado, que no se toca— y el armazón precacheado desde la primera
visita. La otra mitad, la del CDN, sigue pendiente.

Al lado, la otra mitad del mismo problema: **con el CDN caído la pantalla queda en blanco 12,6
segundos**, medido en cuatro páginas. Abortando los recursos externos, 0,28 s. Y `padres.html`,
que no tiene ninguna dependencia externa, pinta en **52 milisegundos**.

### 4. La promesa «alineado al DCNB» no la sostiene el catálogo

Matemáticas tiene **cero misiones en 8º y 9º**. No hay ni una de estadística, gráficas, promedio o
probabilidad en ningún grado de 4º a 9º, aunque el DCNB dedica un bloque a Estadística en todos.
Ni una de medidas, ni de enteros, ni de álgebra. Español cubre uno de sus cuatro bloques. Sociales
tiene cinco misiones para cuatro bloques y seis grados, con la historia de Honduras ausente.

Y el 70 % del catálogo —46 de 66 misiones— sirve **el mismo texto** a un niño de 9 años y a uno de
15. La Célula enseña ADN, ribosomas y mitosis, y el mapa la programa para 4º, donde el DCNB solo
pide reconocer que las células existen.

Detrás está el techo real: **el motor está copiado 66 veces y las copias ya divergieron**. La
función que corrige el quiz tiene cinco versiones distintas; la que califica la evaluación, ocho.
Veintiuna misiones dan retroalimentación pedagógica y tres segundos y medio para leerla; treinta y
una no. Con este molde, doscientas misiones son 330 000 líneas duplicadas.

### 5. Nada de esto impide usar la plataforma hoy; todo impide venderla

- **Cualquier anónimo puede escribir 500 notas falsas** a nombre de cualquier maestro cuyo nombre
  adivine parcialmente, y no existe ninguna función para borrarlas.
- **El maestro con dos aparatos pierde trabajo hoy, en silencio.** Reproducido: asistencia marcada
  en el teléfono sin señal a las 9:00, nota puesta en la PC a las 20:00, y la asistencia
  desaparece. El botón «Recuperar» no aparece.
- **No existe la escuela como entidad**, ni cuenta de alumno, ni sesión revocable, ni respaldo, ni
  política de retención, ni aviso de privacidad —con datos de menores en la nube—. La licencia es
  ambigua (ISC declarado, sin `LICENSE` ni ©) y el alojamiento prohíbe en sus términos el software
  comercial.
- **Y el producto no dice qué es ni para quién:** la portada no contiene «DCNB», ni «sin
  internet», ni «gratis», y no hay `<meta name="description">`.

---

## Lo que sobra

El encargo pedía buscar también lo sobrediseñado. Lo hay, y no es poco:

| qué | cuánto | veredicto |
|---|---|---|
| La Convocatoria de buses | ~7 000 líneas con su página, su SQL y sus sondas | Para un evento anual. No se retira —está bien hecha y resuelve un problema real—, pero se saca a carga diferida |
| Las misiones del maestro sobre leyes | 11 782 líneas | Es el temario de un concurso de plaza. Va a «Prepárate para el concurso», no al catálogo del alumno |
| «Letra grande» reimplementada en cada misión | 74 copias con `!important` | Se sustituye por una regla de raíz. Ya causó dos choques documentados |
| Las cinco tarjetas «Pronto» y 33 de 42 sin contenido | — | Una promesa en pantalla es deuda a la vista del maestro |
| Los kits de autocapacitación en la raíz del sitio | — | Son material de estudio del autor. Van a `_dev/` |
| El selector de siete países | con cero contenido de esos países | Promete lo que no hay |

Y una cosa que **no** sobra, aunque lo pareciera: los gastos de bolsillo y el inventario del aula.
Un maestro hondureño paga material de su bolsillo y entrega el aula con inventario firmado a fin
de año. El revisor lo defendió y tiene razón.

---

## Las 20 modificaciones

La lista completa, con evidencia y con cómo comprobar cada una, está en
[`5-top-20.md`](_dev/auditoria-2026-09/5-top-20.md). El orden es
`(impacto educativo + impacto comercial) / esfuerzo`, con dos ajustes declarados allí.

**Nueve se hacen en horas:**

1. ~~Quitar del «Resultado» los 30 puntos que el alumno se pone solo~~ · **hecho el 6 de septiembre**
6. ~~El service worker: precachear el armazón y dejar de borrar la caché~~ · **hecho el 6 de septiembre**
8. ~~Buscar sin tildes~~ · **hecho el 6 de septiembre**
11. ~~Corregir los cuatro errores de contenido ya localizados~~ · **hecho el 6 de septiembre**
12. ~~Los 31 enlaces de Drive que no llevan a ninguna parte~~ · **hecho el 6 de septiembre**
14. ~~Quitar el autoavance de 1,6 s del quiz y del completar~~ · **hecho el 6 de septiembre**
16. ~~Una acción de CI que corra las sondas~~ · **hecho el 6 de septiembre** — eran **tres** rojas, no dos,
    y una de ellas llevaba 58 fallos que no eran averías: la sonda pedía cosas que este repositorio
    no puede cumplir a propósito
17. ~~Escribir en la portada qué es esto y para quién~~ · **hecho el 7 de septiembre** — y al
    comprobar la frase salió que «66 misiones alineadas al DCNB» era falso: 19 no tienen mapa
18. ~~Licencia, aviso de privacidad~~ · **hecho el 7 de septiembre** — y lo peor no era la falta de
    aviso: el que había prometía que los datos «nunca salen del dispositivo», y es falso. Del
    alojamiento queda pendiente lo que es decisión del autor: mover el DNS fuera de GitHub Pages

**Diez en días:** cerrar «Ver Pauta» · cerrar la escritura anónima a la nube · una identidad de
alumno que no se funda · que el maestro no pierda su trabajo · quitar el CDN del camino crítico ·
subir la barra de secciones al principio · que la estrella se gane · que Fin de Grado no pierda
las respuestas · traer a la boleta las notas ya calculadas · desbloquear el zoom y el teclado.

**Y una en semanas** —que la alumna pueda encontrar lo de su grado—, que es la primera pantalla
donde cuatro de los cinco recorridos se atascaron.

Lo que **no entró** por costar meses, y por qué, está al final de esa misma página: el III Ciclo de
Matemáticas vacío, el motor copiado 66 veces, el maestro sin poder asignar, y la contraseña que
viaja en claro.

---

## Las ocho secciones

| sección | qué cubre | hallazgos | revisados |
|---|---|---:|---:|
| [`00-metodo.md`](_dev/auditoria-2026-09/00-metodo.md) | cómo se hizo y qué no se pudo comprobar | — | — |
| [`1a-tecnica-codigo.md`](_dev/auditoria-2026-09/1a-tecnica-codigo.md) | arquitectura, calidad, rendimiento, dependencias, proceso | 60 | 12 |
| [`1b-tecnica-datos.md`](_dev/auditoria-2026-09/1b-tecnica-datos.md) | base de datos, autenticación, seguridad, escalabilidad | 36 | 36 |
| [`1c-tecnica-acceso.md`](_dev/auditoria-2026-09/1c-tecnica-acceso.md) | accesibilidad | 12 | 0 |
| [`2a-pedagogica-curriculo.md`](_dev/auditoria-2026-09/2a-pedagogica-curriculo.md) | DCNB, coherencia, nivel cognitivo, contenido | 48 | 46 |
| [`2b-pedagogica-aprendizaje.md`](_dev/auditoria-2026-09/2b-pedagogica-aprendizaje.md) | retroalimentación, progresión, gamificación, evidencias | 48 | 48 |
| [`2c-pedagogica-docente.md`](_dev/auditoria-2026-09/2c-pedagogica-docente.md) | ritmos de aprendizaje y utilidad real para el docente | 24 | 24 |
| [`3-ux.md`](_dev/auditoria-2026-09/3-ux.md) | la aplicación probada como alumno de 4º, 5º, 6º, 7º y 9º | 60 | 12 |
| [`4-producto.md`](_dev/auditoria-2026-09/4-producto.md) | valor, negocio, mercado, qué sobra y qué falta | 48 → 33 | 48 |
| [`5-top-20.md`](_dev/auditoria-2026-09/5-top-20.md) | las 20 modificaciones, en orden | — | — |

Los hallazgos en crudo, con su evidencia completa y el veredicto del revisor, están en
`_dev/auditoria-2026-09/crudo/`.

---

## Qué falta de esta auditoría

Se completaron **28 de las 35 lentes** del encargo. Faltan siete, y cuatro las pidió el encargo por
su nombre:

| área | lente pendiente |
|---|---|
| técnica | T11 integridad de datos y sincronización sin conexión |
| técnica | T7 compatibilidad móvil, PWA y Android |
| UX | U8 alumna de 8º grado |
| UX | **U10 docente** |
| UX | **U11 madre o padre de familia** |
| UX | **U12 administrador y dirección** |
| UX | U13 arquitectura de la información y consistencia visual |

Y quedan **108 hallazgos sin revisión adversarial** (accesibilidad entera, el alumno de 9º y tres
cuartas partes de las lentes de UX de alumno). Van marcados como tales en cada sección: la
evidencia es reproducible, pero nadie intentó tumbarla.

`_dev/auditoria-2026-09/ESTADO.md` tiene el inventario exacto y
`_dev/auditoria-2026-09/maquinaria/RETOMAR.md` los comandos para continuar sin repetir nada de lo
ya pagado.

## Límites del informe

- El entorno de auditoría **no llega al sitio publicado ni a la nube** (el proxy bloquea el dominio
  y Supabase): todo lo del servidor se comprobó leyendo el SQL y simulando las respuestas. No se
  midió el comportamiento real de Supabase bajo carga.
- **No se probó en teléfonos físicos ni en iOS.** Las medidas móviles son de Chromium emulando
  pantallas táctiles, y las de accesibilidad no incluyen ningún lector de pantalla real.
- **F.A.R.O.**, la aplicación privada del administrador, vive en otro repositorio y no se auditó.
- **No hay telemetría de uso en el producto**, así que ninguna afirmación sobre qué herramientas se
  usan y cuáles no está medida: son juicios a partir del código y del contexto del aula, y están
  marcados como tales.
- Las cifras de mercado y precios son estimaciones con supuestos declarados, no datos verificados.
