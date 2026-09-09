# Auditoría integral de M.E.T.A.S. — septiembre de 2026

**Estado auditado:** dos tandas sobre `main`. La primera (5-6 de septiembre de 2026) sobre el
commit `9ce2ac1` (28 de agosto), tal como se servía en metas.policastsapien.com; la segunda (9 de
septiembre) sobre `d940fe0`, 52 commits después, **con las 20 modificaciones de la primera lista ya
aplicadas**.
**Encargo:** cuatro auditorías —técnica, pedagógica, de experiencia de uso y de producto— con la
consigna expresa de **no proteger las decisiones existentes del creador**.
**Resultado:** las 35 lentes del encargo, **414 hallazgos con evidencia, los 414 revisados por un
auditor adversarial** (6 más se cayeron ante él), 26 de ellos ya corregidos entre las dos tandas, y
una lista de 20 modificaciones —la segunda: la primera ya está ejecutada— ordenada por impacto y
esfuerzo.

Este archivo es el índice y el resumen. El detalle está en `_dev/auditoria-2026-09/`.

---

## Por dónde empezar

| si tiene… | lea |
|---|---|
| diez minutos | este resumen, y la tabla de [`5-top-20.md`](_dev/auditoria-2026-09/5-top-20.md) |
| una tarde | las once secciones, en el orden de la tabla de abajo |
| ganas de arreglar algo hoy | las diecisiete «de horas» de [`5-top-20.md`](_dev/auditoria-2026-09/5-top-20.md), empezando por la 1 |
| que decidir si esto se vende | [`4-producto.md`](_dev/auditoria-2026-09/4-producto.md), [`3b`](_dev/auditoria-2026-09/3b-ux-docente-familia-direccion.md) (el maestro, la familia y la dirección) y las modificaciones 11, 13 y 19 de la lista nueva |

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
- **La segunda tanda, con las 20 modificaciones puestas, lo confirmó desde el otro lado:** el
  maestro, la madre, la directora y la alumna de 8º recorrieron la aplicación sin un solo error de
  JavaScript propio; «Pegar lista» mete 43 alumnos en cinco toques; `padres.html` resuelve nueve de
  doce preguntas reales escritas como escribe una madre; en 35 combinaciones página×medida no hay un
  desborde ni un botón fuera de pantalla, y el proyecto Android es publicable en cuanto `www/` se
  reconstruya.

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
visita.

Al lado, la otra mitad del mismo problema: ~~**con el CDN caído la pantalla queda en blanco 12,6
segundos**, medido en cuatro páginas. Abortando los recursos externos, 0,28 s. Y `padres.html`,
que no tiene ninguna dependencia externa, pinta en **52 milisegundos**.~~

**Corregido el 9 de septiembre** (punto 7 del top 20), y al volver a medirlo era peor de lo
escrito: con el CDN **colgado** —que es lo que hace la señal de un pueblo, tragarse los paquetes
sin contestar— la portada y una misión **no pintaron en dos minutos**. Los 12,6 s eran la red que
acaba fallando; la que se queda colgada no tiene ese fondo. Hoy las tipografías viven en
`css/vendor/fuentes/` y Font Awesome se fue de las 65 misiones —usaban **un** icono—: cero hojas
de estilo externas en las 184 páginas, y la portada pinta en **428 ms** con el CDN igual de
colgado.

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
- ~~**El maestro con dos aparatos pierde trabajo hoy, en silencio.** Reproducido: asistencia marcada
  en el teléfono sin señal a las 9:00, nota puesta en la PC a las 20:00, y la asistencia
  desaparece. El botón «Recuperar» no aparece.~~ **Corregido el 9 de septiembre** (punto 5 del top
  20): las dos copias ya no compiten, se **fusionan dato por dato**, y al medirlo salió que
  también perdía al revés —con el reloj del teléfono adelantado se caía la nota de la PC— y que un
  equipo con el reloj muy adelantado se quedaba congelado sin volver a bajar nada. «Recuperar» ya
  sale con el aula llena, y recuperar fusiona en vez de pisar.

  ⚠️ **Y la segunda tanda, ese mismo día, encontró que la fusión abrió tres puertas nuevas**
  (T11-01, T11-02 y T11-03, los tres críticos, reproducidos con la función real y sin sonda que los
  cubra): «Cerrar sesión» borra el aula del equipo sin esperar a que la subida llegue y dice «a
  salvo en tu nube»; la guarda contra la pérdida (`rp*2 < lp`) convierte todo borrado grande
  —eliminar un grupo, «Empezar de nuevo», **Cerrar el año**— en algo que el otro equipo deshace
  solo, y devuelve claves de familia caducadas; y como los alumnos se emparejan por número de
  lista, insertar uno «en su lugar» corre los números y la falta, la nota o el pago del otro equipo
  caen en otro niño, sin ruido, hasta el informe que firma la madre. Están en
  [`1d-tecnica-integridad-movil.md`](_dev/auditoria-2026-09/1d-tecnica-integridad-movil.md).
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

Hay dos listas, y las dos importan: la **primera** (6 de septiembre) ya está ejecutada entera, y la
**segunda** (9 de septiembre) es la que sigue.

### La primera lista, ya ejecutada

La lista completa, con evidencia, con cómo se comprobó cada una y con lo que salió al hacerla
—casi siempre más grande que el hallazgo—, está en
[`5-top-20-septiembre-6.md`](_dev/auditoria-2026-09/5-top-20-septiembre-6.md). El orden era
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

**Diez en días:** ~~cerrar «Ver Pauta»~~ · **hecho el 7 de septiembre** · ~~cerrar la escritura anónima a la nube~~ · **hecho el 7 de septiembre, SQL corrido y comprobado** · ~~una identidad de
alumno que no se funda~~ · **hecho el 7 de septiembre (falta la clave de familia)** · ~~que el maestro no pierda su trabajo~~ · **hecho el 9 de septiembre (los respaldos son
decisión de plan, no de código)** · ~~quitar el CDN del camino crítico~~ · **hecho el 9 de
septiembre** — 81 páginas pedían las letras a Google y 65 bajaban Font Awesome entero por una
flecha; con el CDN colgado no pintaban NUNCA, y ahora la portada pinta en 428 ms ·
~~subir la barra de secciones al principio~~ · **hecho el 7 de septiembre, en las 74 misiones** — y
al medirlas antes salió que el hallazgo se quedaba corto: estaba fuera de la primera pantalla en
74 de 74, y lo que costaba no era la distancia sino que `go()` salta al principio y deja la barra
otra vez al fondo · ~~que la estrella se gane~~ · **hecho el 8 de septiembre** — eran
**125 estrellas de regalo en 34 misiones**, y una sola regla las quita todas: antes del primer
toque del alumno no se gana nada · ~~que Fin de Grado no pierda
las respuestas~~ · **hecho el 7 de septiembre, en los cuatro grados y en las dos pruebas** — y al
tocarlo salió algo peor que perderlas: con un banco de preguntas que cambia, devolvérselas se las
pegaría encima de OTRAS preguntas, y esa nota acaba en el expediente · ~~traer a la boleta las notas ya calculadas~~ · **hecho el 7 de septiembre** · ~~desbloquear el zoom y el teclado~~ ·
**hecho el 7 de septiembre** — el zoom estaba bloqueado en 21 páginas (incluidos los 18 juegos 3D)
y el teclado no llegaba a 2 314 elementos en las 74 misiones, no en 48 de 66; y el patrón que este
informe daba por bueno resultó no responder a Enter.

**Y una en semanas** —~~que la alumna pueda encontrar lo de su grado~~—, que es la primera pantalla
donde cuatro de los cinco recorridos se atascaron. **Hecho el 9 de septiembre**, y no hizo falta
preguntarle el grado: ya lo había escrito al entrar en su primera misión. Ahora lo suyo va primero,
con un «📚 Para 4º grado» encima **y nada encima de lo demás que diga de qué grado es** —se ordena,
nunca se filtra—, y buscar «cuarto» pasó de 0 resultados a las 29 que le tocan. Midiendo salió una
trampa que no estaba en el hallazgo: doce misiones son espirales y están al principio del catálogo,
así que **la primera pantalla de la de 4º seguía siendo la del de 9º** hasta que se puso delante lo
más específico de cada grado. La parte de fondo sigue pendiente y es de meses: 47 misiones sirven el
mismo texto a un niño de 9 años y a uno de 15.

### La segunda lista: las 20 siguientes

Está en [`5-top-20.md`](_dev/auditoria-2026-09/5-top-20.md), con una ficha por modificación —qué
cambiar, con archivo y línea; la evidencia; el esfuerzo; los riesgos; y el choque con `CLAUDE.md`
cuando lo hay—. Salió de tres priorizadores independientes (impacto educativo, viabilidad
comercial, menor esfuerzo), un juez con puntaje explícito y un crítico de completitud; se juzga
contra `d940fe0` con la primera lista puesta, y los 414 hallazgos que la sostienen tienen
revisión adversarial. **El orden es por puntaje, no por urgencia**: de las tres críticas de la
fusión entre equipos, la que se cierra en horas es la 1 y las dos de días son la 20. ⚠️ marca las
seis que chocan con una normativa del creador.

| # | modificación | esfuerzo | puntaje | hallazgos |
|---|---|---|---|---|
| 1 | Cerrar sesión no borra el aula hasta que la nube confirme, y el chip dice cuándo habló con ella por última vez | horas (1 d) | 8,0 | T11-01, T11-11, T11-12 |
| 2 | El service worker llega también por el QR de la ficha, el precache pesa lo que la portada pinta, y el teléfono dice qué versión tiene | horas (1 d) | 7,0 | T7-03, T5-09, T7-02, T5-05… |
| 3 | Al calificar, el resultado sale a la vista; calificar en blanco no da la estrella, y generar el examen no lanza confeti | horas (1 d) | 7,0 | U6-02, P4-12, U8-11 |
| 4 | Estadísticas y sus tres lectores dicen la verdad: la pauta descuenta, «sexto 1» es sexto, y la prueba de Español de Fin de Grado se llama por su nombre ⚠️ | horas (1 d) | 7,0 | U5-02, T11-10, P8-07 |
| 5 | Notas SACE no corrige en silencio: fuera de rango se ve en rojo, «no presentó» existe, y el salto automático no se come cifras | horas (1 d) | 7,0 | U10-01 |
| 6 | El botón «atrás» del teléfono vuelve a la vista anterior en vez de cerrar la aplicación | horas (1 d) | 7,0 | U13-01 |
| 7 | Segunda tanda de erratas y topes: las siete filas de contenido que quedaron, nueve cifras para 4º, la pista que regala la respuesta y la medalla de un solo terreno | horas (1 d) | 6,0 | P10-03, P10-06, P10-08, P10-09… |
| 8 | La puerta del maestro el primer día: tres pasos arriba, el código de aula solo cuando hay alumnos, el kit de 60 minutos a un toque y un botón para recomendar a un colega | horas (1 d) | 6,0 | U10-02, U10-03, U10-08, U10-12… |
| 9 | «Clasifica» se hace con el dedo y con el teclado en las cinco misiones que lo tienen con arrastre HTML5 | horas (1 d) | 6,0 | U7-03 |
| 10 | Textos y botones que mienten o hablan de ratón, corregidos en lote sobre las 74 misiones | horas (1 d) | 6,0 | U6-10, U4-08, U5-12, U8-08… |
| 11 | Asignar una misión al grupo y ver quién la hizo y quién no, con «pedirla por WhatsApp» a los que faltan | días (5 d) | 5,0 | P5-12, P8-08, P9-02, B4-03… |
| 12 | Seguridad de un día: `esc()` donde el texto del maestro va a innerHTML, alta sin fuga de correos, un freno de login que no bloquea al dueño y un freno por clave de familia que no castigue a toda la escuela | horas (1 d) | 5,0 | T4-03, T2-08, T3-10, T4-05… |
| 13 | Eliminar lo muerto, las puertas rotas y las cifras viejas: los 13 QR que faltan, `mision.html`, el enlace a `panel-docente`, 20 MB de PNG, los kits internos, el selector de países y los «57 misiones» ⚠️ | horas (1 d) | 5,0 | U10-07, U12-06, T3-07, P7-10… |
| 14 | La familia no lee «¡Listo, asiento apartado!» si la respuesta no entró, y una clave mal escrita no pisa la buena ni se vuelve un segundo hijo | horas (1 d) | 5,0 | U11-01, U11-11 |
| 15 | Accesibilidad de horas: contraste de marca, foco visible, flechas en la barra de secciones, letra grande que se recuerda y alcanza a las pestañas, y sin confeti para quien lo pide ⚠️ | horas (1 d) | 5,0 | T6-04, T6-05, T6-06, T6-08… |
| 16 | La pestaña 🎬 Videos solo se muestra cuando hay algo que ver, y el catálogo local deja de estar vacío ⚠️ | horas (1 d) | 5,0 | U5-09, U6-04, U7-07 |
| 17 | Comunicados con «Mandar por WhatsApp», un toast que no miente sin señal, y ni una palabra de programador delante del maestro | horas (1 d) | 5,0 | U10-05, U10-06 |
| 18 | La estrella y el XP se ganan también en el Quiz, en la Constancia y en la portada: con 0 de 9 no hay confeti, la Constancia dice qué se dominó, y abrir una misión no regala XP | días (3 d) | 4,5 | U8-01, U8-04, U5-03, P6-11… |
| 19 | Lo que el alumno hace llega entero al maestro —por ítem, con tiempo, con la lectura y el quiz del video— y el proyecto empieza a saber qué se usa y qué se rompe ⚠️ | días (4 d) | 4,5 | P7-04, P7-08, P7-06, T11-09… |
| 20 | La guarda anti-pérdida deja de deshacer los borrados legítimos, la fusión no cambia a un niño por otro, y el almacén lleno avisa en vez de callar ⚠️ | días (3 d) | 4,0 | T11-02, T11-03, T11-05, T2-03… |

Diecisiete se hacen en horas y tres en días. Lo que **no entró** y por qué —las que empatan con la
última, la nube incremental, la portada por rol, la retroalimentación al fallar, el panel de
Dirección con cifras, el III Ciclo de Matemáticas, el motor único— está al final de esa misma
página, cada una con su puntaje.

---

## Las once secciones

| sección | qué cubre | código | hallazgos | revisados |
|---|---|---|---:|---:|
| [`00-metodo.md`](_dev/auditoria-2026-09/00-metodo.md) | cómo se hizo, qué se corrió de verdad y qué no se pudo comprobar | — | — | — |
| [`1a-tecnica-codigo.md`](_dev/auditoria-2026-09/1a-tecnica-codigo.md) | arquitectura, calidad, rendimiento, dependencias, proceso | 28-ago | 60 | 60 |
| [`1b-tecnica-datos.md`](_dev/auditoria-2026-09/1b-tecnica-datos.md) | base de datos, autenticación, seguridad, escalabilidad | 28-ago | 36 | 36 |
| [`1c-tecnica-acceso.md`](_dev/auditoria-2026-09/1c-tecnica-acceso.md) | accesibilidad | 28-ago | 12 | 12 |
| [`1d-tecnica-integridad-movil.md`](_dev/auditoria-2026-09/1d-tecnica-integridad-movil.md) | integridad de datos y sincronización sin conexión; móvil, PWA y Android | **9-sep** | 23 | 23 |
| [`2a-pedagogica-curriculo.md`](_dev/auditoria-2026-09/2a-pedagogica-curriculo.md) | DCNB, coherencia, nivel cognitivo, contenido | 28-ago | 46 | 46 |
| [`2b-pedagogica-aprendizaje.md`](_dev/auditoria-2026-09/2b-pedagogica-aprendizaje.md) | retroalimentación, progresión, gamificación, evidencias | 28-ago | 48 | 48 |
| [`2c-pedagogica-docente.md`](_dev/auditoria-2026-09/2c-pedagogica-docente.md) | ritmos de aprendizaje y utilidad real para el docente | 28-ago | 24 | 24 |
| [`3-ux.md`](_dev/auditoria-2026-09/3-ux.md) | la aplicación probada como alumno de 4º, 5º, 6º, 7º y 9º | 28-ago | 59 | 59 |
| [`3b-ux-docente-familia-direccion.md`](_dev/auditoria-2026-09/3b-ux-docente-familia-direccion.md) | probada como docente, como familia y como dirección; la arquitectura de la información | **9-sep** | 46 | 46 |
| [`3c-ux-octavo-grado.md`](_dev/auditoria-2026-09/3c-ux-octavo-grado.md) | probada como alumna de 8º | **9-sep** | 12 | 12 |
| [`4-producto.md`](_dev/auditoria-2026-09/4-producto.md) | valor, negocio, mercado, qué sobra y qué falta | 28-ago | 48 → 33 | 48 |
| [`5-top-20.md`](_dev/auditoria-2026-09/5-top-20.md) | las 20 modificaciones siguientes, en orden | 9-sep | — | — |
| [`5-top-20-septiembre-6.md`](_dev/auditoria-2026-09/5-top-20-septiembre-6.md) | la primera lista de 20, ya ejecutada, con el «✅ Corregido» de cada una | 28-ago | — | — |

Las secciones del 28 de agosto llevan anotado, debajo de cada hallazgo, qué corrigió la primera
lista (✅), qué se cayó ante el revisor (✗) y qué cambió de severidad (↕); las del 9 de septiembre
juzgan el código con esas correcciones ya puestas.

Los hallazgos en crudo, con su evidencia completa y el veredicto del revisor, están en
`_dev/auditoria-2026-09/crudo/`.

---

## Lo que la segunda tanda añadió

Se corrieron las **siete lentes que faltaban** —integridad de datos sin conexión, móvil y Android,
la alumna de 8º, el docente, la madre, la dirección y la arquitectura de la información—, cuatro de
ellas pedidas por el encargo por su nombre, y los **108 hallazgos** que la primera tanda había
dejado con la lectura de un solo auditor pasaron por un revisor adversarial: uno se cayó, 26 eran
ciertos y ya estaban corregidos, 27 cambiaron de severidad. **Del encargo no queda nada sin
correr.** Lo que las lentes nuevas trajeron, y que las viejas no podían ver:

- **La fusión entre equipos abrió tres críticos** (arriba, en el problema 5): cerrar sesión pierde lo
  pendiente, la guarda anti-pérdida deshace los borrados legítimos y «Cerrar el año» desde el otro
  equipo, y un alumno insertado en la lista manda la falta, la nota y el pago al niño equivocado.
- **La pantalla afirma lo que no pasó, en cuatro sitios donde el dato acaba en un expediente o en
  un bus:** Notas SACE muestra 105 y guarda 100, muestra 0 y guarda 1 (U10-01); `salida.html` dice
  «¡Listo, asiento apartado!» con la respuesta sin mandar (U11-01); una clave de familia mal
  tecleada se vuelve un segundo hijo (U11-11); «Aviso publicado» sale sin señal (U10-05).
- **Una sola puerta para tres personas:** la portada saluda «¡Hola, Estudiante!» a la madre y al
  maestro, la Dirección vive en «Ajustes» y no ve nada de su escuela (U12-01), y el botón «atrás»
  del teléfono cierra la aplicación desde cualquier vista (U13-01). El maestro no puede asignar una
  misión ni saber quién no la hizo (U10-04).
- **La estrella se sigue regalando donde la alumna mira primero:** el Quiz con 0 de 9 da confeti,
  estrella y logro en 34 misiones (U8-01) —la modificación 10 arregló generar y calificar la
  Evaluación y dejó fuera *llegar al final* del quiz—, y a la alumna de 8º se le sirve el contenido
  y el tono de 4º en la misión que la aplicación le rotula «Para 8º grado» (U8-02).
- **Ninguna de las 75 misiones registra el service worker**, así que quien llega por el QR o por
  WhatsApp nunca la tiene sin internet (T7-03); la portada baja 3,3 MB para cada alumno (T7-04); y
  el APK que el manual recomienda lleva 101 commits congelado, con el sincronizador que perdía
  asistencia (T7-05).

`_dev/auditoria-2026-09/ESTADO.md` tiene el inventario exacto, lente por lente, y
`_dev/auditoria-2026-09/maquinaria/RETOMAR.md` cuenta cómo se corrió cada tanda, para la próxima.

## Límites del informe

- El entorno de auditoría **no llega al sitio publicado ni a la nube** (el proxy bloquea el dominio
  y Supabase): todo lo del servidor se comprobó leyendo el SQL y simulando las respuestas. No se
  midió el comportamiento real de Supabase bajo carga.
- **No se probó en teléfonos físicos ni en iOS.** Las medidas móviles son de Chromium emulando
  pantallas táctiles, y las de accesibilidad no incluyen ningún lector de pantalla real.
- **Dos fechas conviven en el informe.** Las secciones del 28 de agosto y las del 9 de septiembre
  miden códigos distintos, y una cifra de las primeras puede haber cambiado; donde se comprobó, la
  nota debajo del hallazgo lo dice.
- **F.A.R.O.**, la aplicación privada del administrador, vive en otro repositorio y no se auditó.
- **No hay telemetría de uso en el producto**, así que ninguna afirmación sobre qué herramientas se
  usan y cuáles no está medida: son juicios a partir del código y del contexto del aula, y están
  marcados como tales.
- Las cifras de mercado y precios son estimaciones con supuestos declarados, no datos verificados.
