# 📄 Leyes en PDF, para leerlas de verdad

Aquí se guardan los documentos oficiales con los que se escriben las misiones
del maestro. No es archivo muerto: es la fuente que hay que tener **delante**
antes de citar un artículo.

## Por qué existe esta carpeta

Las misiones del maestro citan artículos, decretos, plazos y números de La
Gaceta. Un maestro los va a usar para pedir un traslado o para contestar un
examen de nombramiento, así que un dato malo le cuesta caro.

Y se aprendió a golpes: al preparar la misión del Estatuto del Docente se
investigó con buscador y **no se pudo verificar nada**, porque el entorno de
desarrollo no alcanza los portales del Estado y porque un extracto de buscador
no acredita un número de artículo. Los resúmenes que circulan (Studocu, Scribd,
SlideShare, apuntes de estudiantes) citan mal los artículos y a veces
reproducen el proyecto de ley en vez del texto aprobado. Está contado entero en
`INVESTIGACION-ESTATUTO-DOCENTE.md`.

La regla que salió de ahí: **buscar no es leer**. Si la misión va a citar
artículos, el documento entra a esta carpeta y se lee.

## Cómo se agrega un documento

Desde la PC, copiando el archivo aquí. Desde una tablet o un teléfono, por la
web de GitHub: entrar a esta carpeta, «Add file», «Upload files», y confirmar.
Con el navegador en modo escritorio va más cómodo; la aplicación de GitHub para
Android no sube archivos.

Nómbrelos sin acentos ni espacios, con el número de la norma, para que se
reconozcan de un vistazo:

```
estatuto-docente-decreto-136-97.pdf
reglamento-estatuto-docente-acuerdo-0760-se-99.pdf
ley-fundamental-educacion-decreto-262-2011.pdf
reglamento-general-lfe-acuerdo-1358-se-2014.pdf
```

## Lo que ya está aquí

- [x] **Estatuto del Docente Hondureño**, Decreto 136-97 (`estatuto-docente-decreto-136-97.pdf`), 101 artículos.
- [x] **Reglamento General del Estatuto del Docente Hondureño**, Acuerdo 0760-SE-99
      (`reglamento-estatuto-docente-acuerdo-0760-se-99.pdf`), 229 artículos.
- [x] **Código de la Niñez y la Adolescencia**, Decreto 73-96
      (`codigo-ninez-adolescencia-decreto-73-96.pdf`), texto con reformas del Poder
      Judicial. Con él se escribió «Derechos de la niñez en la escuela».

Con esos dos se escribió la misión «Estatuto del Docente: sus derechos». El
antes y el después está contado en `INVESTIGACION-ESTATUTO-DOCENTE.md`: leer el
documento corrigió media docena de números de artículo que la búsqueda web daba
por buenos, y destapó un error ya publicado en la primera misión.

## Lo que haría falta después

Para cerrar la vigencia de hoy (régimen económico y carrera docente):

- [ ] Acuerdos de 2014 y de 2022 sobre carrera docente.

Y para el área «Dominar M.E.T.A.S», que compara la plataforma con el sistema
oficial:

- [ ] **Manual de Procesos del SACE**, de la Unidad del Sistema Nacional de
      Información Educativa de Honduras (`manual-procesos-sace.pdf`).

  Se pidió al escribir la misión «M.E.T.A.S y SACE: qué hace cada uno», en
  agosto de 2026. El entorno de desarrollo **no alcanzó los portales del
  Estado** (se.gob.hn, sace.se.gob.hn y tsc.gob.hn contestaron 403 a través del
  proxy), así que esa misión se escribió sin él, y se nota: no cita ni un plazo
  de digitación, ni una pantalla, ni un número de acuerdo. En su lugar le da al
  maestro la lista de lo que tiene que preguntar en su centro.

  **Con ese PDF delante** se le pueden añadir los plazos, la ruta exacta de la
  digitación de notas y el procedimiento del alumno que llega a destiempo, que
  es justo lo que un maestro busca. **Sin él, no se añade nada**: un
  procedimiento mal citado manda al maestro a una oficina que ya no existe.

## Dos advertencias

**Solo documentos públicos.** Aquí van leyes, reglamentos y acuerdos publicados
en La Gaceta. Nunca datos de alumnos, de familias ni del centro: este
repositorio es público y se publica en el sitio.

**Esta carpeta no viaja a la aplicación de Android.** `npm run build:www`
excluye `_dev`, así que los PDF no le pesan al maestro en el teléfono.
