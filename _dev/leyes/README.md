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
- [x] **Manuales de usuario del SACE**, de la Unidad del Sistema Nacional de
      Información Educativa de Honduras (USINIEH), Secretaría de Educación:
      `Manual_de_usuario_SACE_Docente.pdf` (34 páginas, versión 2.0, junio de
      2019) y `sace_manual_de_usuario_director.pdf` (185 páginas, versión 2.0,
      septiembre de 2017). Con ellos se reescribió «M.E.T.A.S y SACE: qué hace
      cada uno».

      ⚠️ **Ojo con la fecha.** No son leyes: son manuales de un sistema vivo, y
      tienen entre siete y nueve años. De ahí se puede tomar el **flujo** (qué
      módulo, en qué orden, qué produce), que aguanta; **no** los plazos ni la
      certeza de que un botón siga llamándose igual. La misión lo dice en cada
      sitio donde nombra una pantalla, y le recuerda al maestro la línea de
      soporte del SACE: **104**.

Con esos dos se escribió la misión «Estatuto del Docente: sus derechos». El
antes y el después está contado en `INVESTIGACION-ESTATUTO-DOCENTE.md`: leer el
documento corrigió media docena de números de artículo que la búsqueda web daba
por buenos, y destapó un error ya publicado en la primera misión.

## Lo que haría falta después

Para cerrar la vigencia de hoy (régimen económico y carrera docente):

- [ ] Acuerdos de 2014 y de 2022 sobre carrera docente.

Y para el área «Dominar M.E.T.A.S», ahora que los manuales del SACE ya están:

- [ ] **Calendario oficial del año lectivo** (el acuerdo o la circular que fija
      las fechas de matrícula y de subida de notas por parcial).

  Es lo único que a la misión «M.E.T.A.S y SACE» le sigue faltando, y lo sabe:
  esas fechas no están en los manuales porque no salen de ahí, las fija la
  Secretaría de Educación cada año. Por eso la misión no da ninguna, y en su
  lugar le deja al maestro cuatro preguntas para hacer en su centro. Si algún
  día entra ese documento aquí, **hay que volver a mirar la fecha cada año**: un
  plazo derogado es peor que ningún plazo.

### Cómo se consiguieron los manuales del SACE, por si vuelve a pasar

El entorno de desarrollo **no alcanza los portales del Estado**: se.gob.hn,
sace.se.gob.hn y tsc.gob.hn contestan 403 a través del proxy, y así quedó
también la primera versión de esa misión, escrita sin citar nada. Los PDF los
subió el autor a mano, desde su equipo, por la web de GitHub. **Esa es la vía
cuando el entorno no alcanza una fuente**: no buscar más, sino pedir el
documento. La diferencia entre las dos versiones de esa misión está a la vista.

## Dos advertencias

**Solo documentos públicos.** Aquí van leyes, reglamentos y acuerdos publicados
en La Gaceta. Nunca datos de alumnos, de familias ni del centro: este
repositorio es público y se publica en el sitio.

**Esta carpeta no viaja a la aplicación de Android.** `npm run build:www`
excluye `_dev`, así que los PDF no le pesan al maestro en el teléfono.
