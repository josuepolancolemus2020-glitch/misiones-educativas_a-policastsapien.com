# 📘 DCNB en PDF — súbalos aquí

Esta carpeta es el buzón: aquí entran los PDF del **Diseño Curricular Nacional
Básico** y de las Programaciones Educativas Nacionales, tal como los publica la
Secretaría de Educación. De aquí salen, convertidos, a `_dev/dcnb/`.

## Cómo subirlos

Desde la PC, copiando los archivos aquí. Desde tablet o teléfono, por la web de
GitHub: entrar a esta carpeta, «Add file» → «Upload files», y confirmar. Con el
navegador en modo escritorio va más cómodo; la aplicación de GitHub para
Android no sube archivos.

**Se pueden subir varios de una vez.** No hace falta esperar a tenerlos todos:
lo que vaya llegando se va convirtiendo.

## El nombre del archivo importa

De él salen los nombres de los trozos convertidos, así que un PDF llamado
`documento (1).pdf` produce diez archivos ilegibles. Sin acentos ni espacios, y
que se entienda de un vistazo **de qué nivel, ciclo y área** es:

```
dcnb-prebasica.pdf
dcnb-basica-i-ciclo.pdf
dcnb-basica-ii-ciclo-matematicas.pdf
dcnb-basica-iii-ciclo-espanol.pdf
programacion-ciencias-naturales-5.pdf
cnb-media-bachillerato-humanidades.pdf
```

Si el archivo oficial viene con otro nombre, se puede renombrar al subirlo.

## Qué pasa después

```
python3 _dev/dcnb-a-markdown.py _dev/dcnb-pdf/*.pdf
```

Convierte a Markdown **troceado** en `_dev/dcnb/`, con un `INDICE.md` que dice
qué hay en cada archivo.

Se trocea porque el DCNB completo son miles de páginas y no se pueden leer de
una sentada. Con el índice, una consulta concreta —«¿qué dice de fracciones en
5º?»— abre el índice y **un** archivo de unos 3.000 tokens, en vez del
documento entero. Medido con los PDF de `_dev/leyes/`: consultarlos como PDF
cuesta 816.000 tokens; troceados en Markdown, lo que de verdad se abre son
2.000 o 3.000.

**Antes de convertir un lote nuevo, se prueba una página:**

```
python3 _dev/dcnb-a-markdown.py _dev/dcnb-pdf/dcnb-basica-ii-ciclo.pdf --prueba 40
```

Si las tablas de esa página salen ilegibles, no vale la pena convertir mil.

## Los PDF se quedan, no se borran

El Markdown es para **trabajar**; el PDF es el que **acredita**. Igual que con
`_dev/leyes/`: si una misión va a citar una expectativa de logro o un bloque de
contenido, el número se confirma en el PDF. La conversión es automática y puede
equivocarse; el documento oficial, no.

Hay un caso en que el Markdown directamente no sirve: las páginas cuyo
contenido es una **imagen** (un esquema, una malla curricular dibujada, una hoja
escaneada). Ahí no hay texto que extraer. El conversor las detecta, las cuenta
y las anota en el índice; esas se ven en el PDF.

## Dos advertencias, las mismas de siempre

**Solo documentos públicos.** Currículo, programaciones y acuerdos publicados.
Nunca datos de alumnos, de familias ni del centro: este repositorio es público.

**Esta carpeta no viaja a la aplicación de Android.** `npm run build:www`
excluye `_dev`, así que ni los PDF ni el Markdown le pesan al maestro en el
teléfono.
