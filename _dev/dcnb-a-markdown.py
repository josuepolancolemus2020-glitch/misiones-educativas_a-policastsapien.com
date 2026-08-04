#!/usr/bin/env python3
"""
Convierte un PDF del DCNB (o cualquier documento largo) a Markdown troceado.

POR QUÉ EXISTE
--------------
Un PDF no se lee solo como texto: cada página viaja además dibujada como
imagen, y eso multiplica por cinco lo que cuesta consultarlo. Medido con los
PDF de `_dev/leyes/`: 403 páginas cuestan 816.000 tokens como PDF y 171.000
como texto.

Pero con el DCNB completo el formato no alcanza: son miles de páginas y no
caben de una sentada ni en Markdown. Por eso esta herramienta no solo
convierte, TROCEA: deja un archivo por sección, con nombres predecibles y un
índice. Así una consulta («¿qué dice de fracciones en 5º?») abre el índice y
UN archivo, no el documento entero.

QUÉ NO PUEDE HACER
------------------
Si el contenido de una página vive en una imagen (captura de pantalla, hoja
escaneada), aquí no sale nada: el texto no está en el archivo, está dibujado.
La herramienta las cuenta y avisa al final. Esas páginas hay que consultarlas
en el PDF original, que por eso se conserva.

USO
---
    python3 _dev/dcnb-a-markdown.py _dev/dcnb-pdf/documento.pdf
    python3 _dev/dcnb-a-markdown.py _dev/dcnb-pdf/documento.pdf --prueba 12
    python3 _dev/dcnb-a-markdown.py _dev/dcnb-pdf/*.pdf --salida _dev/dcnb

`--prueba N` convierte SOLO la página N y la imprime. Es el paso que se hace
primero, siempre: si las tablas de esa página salen ilegibles, no vale la pena
convertir cuatro mil.

Necesita `pip install pymupdf`.
"""
import argparse
import os
import re
import sys
from collections import Counter

try:
    import fitz  # pymupdf
except ImportError:
    sys.exit('Falta la librería: pip install pymupdf')

# Una página con menos de esto es, casi seguro, una imagen con un pie de foto.
MIN_CHARS_PAGINA = 200
# Tope de un trozo. Por encima, la consulta vuelve a costar de más.
MAX_CHARS_TROZO = 24000

# Encabezados de sección del DCNB y de las leyes. El orden importa: se prueba
# de lo más específico a lo más general.
CORTES = [
    (re.compile(r'^\s*(CAP[IÍ]TULO|CAPITULO)\s+([IVXLC\d]+)', re.I), 'capitulo'),
    (re.compile(r'^\s*(T[IÍ]TULO|TITULO)\s+([IVXLC\d]+)', re.I), 'titulo'),
    (re.compile(r'^\s*(BLOQUE)\s+([IVXLC\d]+)', re.I), 'bloque'),
    (re.compile(r'^\s*(UNIDAD)\s+([IVXLC\d]+)', re.I), 'unidad'),
    (re.compile(r'^\s*(ÁREA|AREA)\s+(CURRICULAR|DE)\b', re.I), 'area'),
]


def tokens(txt):
    """Aproximación suficiente para decidir: ~3,5 caracteres por token."""
    return round(len(txt) / 3.5)


def sin_repetidos(paginas):
    """
    Quita el encabezado y el pie que se repiten en cada página.

    En el manual del SACE, «UNIDAD DEL SISTEMA NACIONAL DE INFORMACIÓN
    EDUCATIVA…» sale 185 veces: son 12.000 tokens de puro membrete. Se detecta
    solo lo que aparece en más de la mitad de las páginas, para no borrar una
    línea de contenido que casualmente se repita dos o tres veces.
    """
    if len(paginas) < 4:
        return paginas
    cuenta = Counter()
    for p in paginas:
        # Solo se miran las primeras y últimas líneas: ahí viven membrete y pie.
        lineas = [l.strip() for l in p.split('\n') if l.strip()]
        for l in lineas[:3] + lineas[-3:]:
            if 8 < len(l) < 120:
                cuenta[l] += 1
    umbral = len(paginas) * 0.5
    # El número de página cambia en cada hoja: se normaliza antes de comparar.
    basura = {l for l, n in cuenta.items() if n >= umbral}
    if not basura:
        return paginas
    limpias = []
    for p in paginas:
        limpias.append('\n'.join(
            l for l in p.split('\n') if l.strip() not in basura))
    return limpias


def limpia(txt):
    """Junta lo que el PDF partió y quita el aire sobrante."""
    # Renglones de solo espacios: el extractor deja uno por cada línea en
    # blanco del diseño, y en un documento largo son miles de tokens de nada.
    # Van PRIMERO, porque si no, «\n \n \n» no se reconoce como línea vacía.
    txt = re.sub(r'\n[ \t]+(?=\n)', '\n', txt)
    # Palabras cortadas con guión al final de renglón: «re-\nquisito» → «requisito»
    txt = re.sub(r'(\w)-\n(\w)', r'\1\2', txt)
    # El extractor deja un salto por renglón impreso; una frase queda picada en
    # cinco líneas. Se pegan salvo cuando el renglón termina en punto o dos
    # puntos, o cuando el siguiente empieza numerado (una lista de verdad).
    txt = re.sub(r'(?<![.:;)\d])\n(?![\s\d]*[)\-•]|\n)', ' ', txt)
    txt = re.sub(r'[ \t]+', ' ', txt)
    txt = re.sub(r'\n{3,}', '\n\n', txt)
    return txt.strip()


def secciones(paginas):
    """
    Parte el documento por sus propios encabezados (CAPÍTULO, BLOQUE, ÁREA…).

    Se corta por la estructura del documento y no cada N páginas porque un
    trozo que empieza a media frase no sirve para citar: hay que poder abrir
    un archivo y saber de qué capítulo se está hablando.
    """
    trozos = []
    actual = {'titulo': 'Inicio', 'clase': 'portada', 'desde': 1, 'texto': []}
    for n, pag in enumerate(paginas, 1):
        cabecera = None
        for linea in pag.split('\n')[:6]:
            for patron, clase in CORTES:
                if patron.match(linea):
                    cabecera = (linea.strip()[:80], clase)
                    break
            if cabecera:
                break
        if cabecera and actual['texto']:
            trozos.append(actual)
            actual = {'titulo': cabecera[0], 'clase': cabecera[1],
                      'desde': n, 'texto': []}
        elif cabecera:
            actual['titulo'], actual['clase'] = cabecera
        actual['texto'].append(pag)
        actual['hasta'] = n
    if actual['texto']:
        trozos.append(actual)

    # Un trozo enorme (un capítulo de 80 páginas) se vuelve a partir por tamaño:
    # el corte por estructura manda, pero no puede dejar un archivo inconsultable.
    finales = []
    for t in trozos:
        entero = '\n\n'.join(t['texto'])
        if len(entero) <= MAX_CHARS_TROZO:
            finales.append({**t, 'texto': entero})
            continue
        partes, buf, desde = [], [], t['desde']
        for i, pag in enumerate(t['texto']):
            buf.append(pag)
            if len('\n\n'.join(buf)) >= MAX_CHARS_TROZO:
                partes.append((desde, t['desde'] + i, '\n\n'.join(buf)))
                buf, desde = [], t['desde'] + i + 1
        if buf:
            partes.append((desde, t['hasta'], '\n\n'.join(buf)))
        for i, (d, h, txt) in enumerate(partes, 1):
            finales.append({'titulo': f"{t['titulo']} ({i} de {len(partes)})",
                            'clase': t['clase'], 'desde': d, 'hasta': h,
                            'texto': txt})
    return finales


def nombre_archivo(base, i, titulo):
    """Sin acentos ni espacios, como el resto del repositorio."""
    t = titulo.lower()
    for a, b in (('á', 'a'), ('é', 'e'), ('í', 'i'), ('ó', 'o'), ('ú', 'u'),
                 ('ñ', 'n'), ('ü', 'u')):
        t = t.replace(a, b)
    t = re.sub(r'[^a-z0-9]+', '-', t).strip('-')[:45] or 'seccion'
    return f'{base}-{i:02d}-{t}.md'


def convierte(ruta, salida, prueba=None):
    doc = fitz.open(ruta)
    base = re.sub(r'[^a-z0-9]+', '-', os.path.splitext(
        os.path.basename(ruta))[0].lower()).strip('-')

    if prueba:
        pag = doc[prueba - 1].get_text()
        print(f'── {os.path.basename(ruta)}, página {prueba} '
              f'({len(pag)} caracteres) ──\n')
        print(limpia(pag) or '(sin texto: esta página es una imagen)')
        return None

    crudas = [p.get_text() for p in doc]
    paginas = [limpia(p) for p in sin_repetidos(crudas)]
    # Se cuenta DESPUÉS de quitar membretes: una página que solo trae el
    # encabezado del manual y una captura de pantalla pasa de largo si se mide
    # antes, y es justo la que hay que ir a ver al PDF.
    imagenes = [i + 1 for i, p in enumerate(paginas) if len(p.strip()) < MIN_CHARS_PAGINA]
    trozos = secciones(paginas)

    os.makedirs(salida, exist_ok=True)
    escritos = []
    for i, t in enumerate(trozos, 1):
        arch = nombre_archivo(base, i, t['titulo'])
        cuerpo = (
            f"# {t['titulo']}\n\n"
            f"> Fuente: `{os.path.basename(ruta)}`, páginas "
            f"{t['desde']}–{t.get('hasta', t['desde'])}. "
            f"Convertido automáticamente: para **citar** un número de artículo, "
            f"confirmarlo en el PDF.\n\n"
            f"{t['texto']}\n")
        with open(os.path.join(salida, arch), 'w', encoding='utf-8') as f:
            f.write(cuerpo)
        escritos.append((arch, t['titulo'], t['desde'], t.get('hasta', t['desde']),
                         tokens(cuerpo)))

    total = sum(e[4] for e in escritos)
    print(f'\n📄 {os.path.basename(ruta)} — {len(doc)} páginas')
    print(f'   {len(escritos)} archivo(s) · {total:,} tokens en total · '
          f'{round(total / max(len(escritos), 1)):,} por archivo')
    if imagenes:
        print(f'   ⚠️  {len(imagenes)} página(s) sin texto (son imágenes): '
              f'{", ".join(map(str, imagenes[:12]))}'
              f'{"…" if len(imagenes) > 12 else ""}')
        print('       Ese contenido NO está en el Markdown: consultarlo en el PDF.')
    return {'pdf': os.path.basename(ruta), 'paginas': len(doc),
            'archivos': escritos, 'tokens': total, 'imagenes': len(imagenes)}


def escribe_indice(salida, informes):
    """
    El índice es lo que hace barata la consulta: se abre PRIMERO, se ve qué
    archivo sirve, y se abre solo ese.
    """
    L = ['# Índice del DCNB convertido\n',
         'Lo generó `_dev/dcnb-a-markdown.py`. **Se abre este archivo primero**: '
         'dice qué hay en cada trozo, para no cargar el documento entero.\n',
         'Los PDF originales siguen en `_dev/dcnb-pdf/` y son los que acreditan '
         'una cita: el Markdown es para trabajar, el PDF para verificar.\n']
    gran_total = 0
    for inf in informes:
        L.append(f"\n## {inf['pdf']} ({inf['paginas']} páginas)\n")
        if inf['imagenes']:
            L.append(f"> ⚠️ {inf['imagenes']} página(s) son imágenes y no tienen "
                     f"texto aquí: hay que verlas en el PDF.\n")
        L.append('| Archivo | Sección | Páginas | Tokens |')
        L.append('|---|---|---:|---:|')
        for arch, tit, d, h, tk in inf['archivos']:
            L.append(f'| [`{arch}`]({arch}) | {tit} | {d}–{h} | {tk:,} |')
        gran_total += inf['tokens']
    L.append(f'\n---\n\n**Total: {gran_total:,} tokens** repartidos en trozos '
             f'consultables por separado.\n')
    ruta = os.path.join(salida, 'INDICE.md')
    with open(ruta, 'w', encoding='utf-8') as f:
        f.write('\n'.join(L))
    print(f'\n📇 Índice en {ruta}')


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('pdfs', nargs='+', help='PDF a convertir')
    ap.add_argument('--salida', default='_dev/dcnb', help='carpeta de destino')
    ap.add_argument('--prueba', type=int, metavar='N',
                    help='convertir SOLO la página N y mostrarla (hágase esto primero)')
    a = ap.parse_args()

    informes = []
    for p in a.pdfs:
        if not os.path.exists(p):
            print(f'⚠️  no existe: {p}')
            continue
        inf = convierte(p, a.salida, a.prueba)
        if inf:
            informes.append(inf)
    if informes:
        escribe_indice(a.salida, informes)


if __name__ == '__main__':
    main()
