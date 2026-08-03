# 🚧 Estatuto del Docente: investigación abierta, misión NO escrita

**Fecha:** agosto de 2026.
**Estado:** la misión `docente-estatuto-derechos` **no se escribió**, a propósito.

> ## ⛔ NADA DE ESTE ARCHIVO ESTÁ VERIFICADO
>
> Los números de artículo, los plazos, los días y las cifras que aparecen más
> abajo son **pistas para ir a comprobar**, no datos. **No se copian a una
> misión, a una ficha ni a un mensaje.** Están escritos aquí precisamente para
> que la próxima sesión no tenga que volver a buscarlos, y con la advertencia
> pegada para que nadie los confunda con hechos.

---

## Por qué no se escribió la misión

Se investigó a fondo: seis frentes en paralelo (identificación y vigencia,
ingreso y concurso, escalafón, traslados y permutas, permisos y licencias,
disciplina y derechos), y detrás de cada uno un revisor con el encargo expreso
de **refutar** lo que el primero había encontrado.

El resultado fue este: **ninguna afirmación sobre el Estatuto sobrevivió la
comprobación**, porque la comprobación no se pudo hacer.

Dos cosas se juntaron:

1. **El presupuesto de búsquedas web de la sesión se agotó** (200 de 200)
   mientras investigaban los primeros frentes. Los seis revisores que venían
   detrás no pudieron lanzar ni una consulta: sus veredictos dicen «no
   concluyente», que aquí no significa «dato dudoso» sino **«no hubo
   verificación»**.
2. **Los portales del Estado están bloqueados en este entorno.** `se.gob.hn`,
   `tsc.gob.hn`, `oas.org`, `siteal.iiep.unesco.org` y La Gaceta devuelven 403
   del proxy de salida. Nadie llegó a abrir el Decreto 136-97 ni el Acuerdo
   0760-SE-99: **todo lo que se recogió son extractos que el buscador sacó de
   los PDF, no lectura de los PDF.**

Y una tercera, más incómoda: buena parte de lo que devolvió el buscador venía de
Studocu, Scribd, SlideShare, Quizlet y presentaciones de estudiantes. Ese
material **cita mal los artículos con frecuencia** y a veces reproduce el
proyecto de ley en vez del texto aprobado. Además, dos «fuentes independientes»
resultaron ser la misma: `oas.org` y `siteal.iiep.unesco.org` alojan el mismo
documento, así que las dobles corroboraciones estaban infladas.

La plantilla de las misiones del maestro lo dice sin adornos: *lo que no se pudo
verificar, no se afirma*. Aplicada al pie de la letra, la lista de lo afirmable
quedó **vacía**.

Esta misión, además, es la peor candidata posible para «publicar y corregir
después». Un maestro va a usarla para pedir un traslado, una permuta o un
permiso, o para contestar un examen de nombramiento. **Un plazo mal citado se
vence y no se recupera; un artículo mal citado le tumba el escrito.** Aquí sí
cuesta más corregir que esperar.

---

## Lo único que se sostiene hoy, y sin un solo número

Enunciados tan generales que ninguna de las contradicciones los toca. No dan
para una misión de estudio, y por eso no se escribió:

- Existe un **Estatuto del Docente Hondureño**, decreto del Congreso Nacional, y
  un **Reglamento General**, acuerdo ejecutivo de la Secretaría de Educación.
  Son dos documentos distintos y se citan por separado.
- El Estatuto ordena la **carrera docente**: ingreso, movimientos de personal,
  evaluación, derechos, deberes y régimen disciplinario.
- El **ingreso es por concurso**, administrado por **juntas de selección** con
  participación de la Secretaría de Educación y de las organizaciones
  magisteriales.
- El Estatuto reconoce **licencias, permisos, vacaciones y libertad de
  cátedra**, y distingue la **licencia** (ausencia larga) del **permiso**
  (ausencia corta).
- Contempla **permuta** (intercambio voluntario) y **traslado** (movimiento a
  otro puesto), y el Reglamento detalla su tramitación.
- Las faltas se clasifican por gravedad y las sanciones son escalonadas.
- Después del Estatuto vinieron la **Ley Fundamental de Educación** y sus
  reglamentos, y hubo cambios reglamentarios posteriores: antes de un trámite,
  el docente debe mirar qué norma le está aplicando la convocatoria vigente.

---

## Lo que hace falta para desbloquearlo

Una sola cosa, y es barata: **tener los dos documentos a la vista**.

Como este entorno no alcanza los portales del Estado, la vía práctica es
**meter los PDF (o su texto) al repositorio**, por ejemplo en `_dev/leyes/`:

- `Estatuto del Docente Hondureño`, Decreto 136-97.
- `Reglamento General del Estatuto del Docente Hondureño`, Acuerdo 0760-SE-99.

Con esos dos archivos, casi todo lo de abajo se resuelve en una tarde de lectura,
empezando por lo único que de verdad importa: **cuál es el artículo que enumera
los derechos del docente**.

La otra vía, si se prefiere seguir con búsqueda web, es subir el tope de
consultas de la sesión (`CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION`). Sirve, pero
es peor: seguiría siendo buscador y no documento.

---

## Lista de comprobación, en orden de daño al maestro

Cuando haya documento, se comprueba esto, por este orden:

1. **El artículo que enumera los derechos del docente.** Es el eje de la misión
   y la pregunta más probable de un examen. Las pistas apuntan a **13** y a
   **28**, y se contradicen entre sí.
2. **Licencia por maternidad.** Circula «6 semanas antes y 6 después en lo
   urbano, 4 y 8 en lo rural». Cifra rara y con dos vías de error: puede venir
   del proyecto, y en la práctica puede estar desplazada por el Código del
   Trabajo y el IHSS.
3. **Los plazos que precluyen**, que son los que hacen perder un derecho: días
   para pedir revisión de la evaluación, y los recursos de reposición y
   apelación. Ojo: la fuente que apareció para los plazos administrativos era un
   **diccionario jurídico**, que no acredita plazos del derecho hondureño.
4. **Los meses de interinato que dan derecho a propiedad.** De esa cifra depende
   que un maestro reclame o no una plaza. Las pistas dan seis meses, y ni
   siquiera coinciden en el artículo.
5. **El orden de prelación en los traslados**: decide quién se queda con la
   plaza, y choca con el criterio de resultados de la evaluación.
6. **El 75 % de nota mínima del concurso.** Aparece atribuido a dos artículos a
   la vez. Puede ser real y repetido, o puede ser un solo dato mal duplicado.
7. **El artículo de la Constitución que fundamenta el Estatuto.** Los números de
   artículo constitucional se citan mal muchísimo.
8. **Los números de La Gaceta** del Estatuto y del Reglamento, y la fecha del
   Reglamento (hay dos fechas de noviembre de 1999 circulando).

---

## Materia que ni siquiera se llegó a investigar

Hay que cubrirla entera antes de escribir:

- **Régimen disciplinario completo**: clasificación de faltas, sanciones,
  procedimiento (quién instruye, audiencia, descargos, quién resuelve),
  recursos y prescripción.
- **Estabilidad y pérdida del cargo**: causales de despido o cancelación.
- **Deberes y prohibiciones** del docente.
- **Renuncia, retiro y jubilación**, e **INPREMA**.
- **Colegiación magisterial**: en qué norma consta la obligatoriedad.
- **Vacaciones**: hoy hay tres versiones incompatibles.
- **Permiso de paternidad**: no se sabe si existe.
- **El escalafón como sistema de categorías** y los plazos de ascenso.
- **Las ponderaciones del concurso**: cuánto pesa cada componente. Es de lo
  primero que pregunta quien se prepara.

---

## Contradicciones abiertas

Cada una es una trampa de examen, así que conviene resolverlas y luego usarlas
como pregunta:

- **13 contra 28**: derechos y libertad de cátedra.
- **18 contra 19**: periodicidad del concurso y validez del resultado.
- **Permutas**: el mismo régimen aparece atribuido al Estatuto y al Reglamento,
  y con reglas distintas de cuándo se vuelve definitiva (por vencer el plazo, o
  por no reintegrarse).
- **Traslado de «igual nivel» o de «igual o menor nivel»**. Cuidado: puede que
  se esté confundiendo el **traslado** con el **descenso**, que es otra cosa.
- **Cinco o seis causales de traslado**: la sexta aparece «en algunas
  versiones», que es la huella típica de un proyecto circulando junto al texto
  aprobado.
- **Recursos al revés**: una fuente pone la reposición ante el superior y la
  apelación ante quien sancionó, invertido respecto de la regla general.
- **Niveles de las juntas de selección**: nacional, departamental, distrital,
  municipal. La palabra «municipal» aparece y desaparece según el año del
  reglamento que se mire.
- **Integración de la Junta Nacional**: la aritmética de sus miembros no cierra.
- **Vigencia**, que es la contradicción mayor: el Reglamento de la Carrera
  Docente de 2014 aparece a la vez como derogado en 2022 y como marco vigente en
  documentos de la propia Secretaría. **Nadie determinó qué rige hoy los
  concursos, los traslados y las permutas.** Hasta que eso se aclare, el resto
  es papel mojado.

---

## Dos avisos para quien retome

**No «corrija» la fecha de la Ley Fundamental de Educación.** La investigación
tropezó con tres fechas (29 de enero de 2012, 19 de enero de 2012, 22 de febrero
de 2012) y podría parecer que lo publicado está mal. No lo está: una cosa es la
**aprobación** en el Congreso y otra la **publicación** en La Gaceta, y lo que el
sitio publica es la publicación, que es la que da vigencia. Se queda como está
salvo que aparezca documento en contra.

**Si alguna vez se desmiente el par «Decreto 136-97 del 11 de septiembre de 1997
y Acuerdo 0760-SE-99», hay que corregir cuatro archivos ya publicados**, no solo
la misión nueva:

- `misiones/docente-historia-leyes-educativas/js/historia-leyes-educativas.js`
- `fichas/ficha-docente-historia-leyes-educativas.html`
- `misiones/docente-ley-fundamental-aula/js/ley-fundamental-aula.js`
- `fichas/ficha-docente-ley-fundamental-aula.html`

Que el sitio ya lo diga **no es verificación**: es el proyecto citándose a sí
mismo.

---

## Lo que sí quedó hecho

`misiones/docente-estatuto-derechos/css/estatuto-derechos.css`, la hoja de la
misión, ya está escrita y no depende de ningún dato legal. Es el violeta de la
serie, con dos piezas nuevas pensadas para este tema:

- `.tr-pasos`, los pasos de un trámite numerados en vertical, para seguirlos con
  el dedo mientras se llenan los papeles;
- `.tr-papeles`, la caja de «qué papeles hay que llevar», aparte del resto,
  porque es lo que se olvida y lo que hace volver otro día a la misma oficina.

La forma pensada para la sección explorable era **un recorrido por trámites**
(concursar, trasladarse, permutar, pedir permiso, defenderse de una sanción), no
por artículos: es lo que distingue esta misión de las dos anteriores y lo que la
haría útil el lunes. La estructura está lista; le falta el contenido comprobado.

El tema sigue marcado **«Pronto»** en el temario (`js/tools/formacion-docente.js`).
Se le pondrá `url:` el día que la misión exista de verdad.
