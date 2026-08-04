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

# Adornos del diseño del DCNB: la orla de circulitos que bordea cada página.
# En el segundo ciclo son 36 líneas de «○» por hoja — 493 páginas × 36 son unos
# 10.000 tokens de pura decoración.
# OJO con «•» y «·»: esos NO son adorno, son las viñetas de las listas de
# contenidos («• La conversación espontánea»), y sin ellas la lista se lee como
# un párrafo corrido. Van fuera de este juego a propósito.
ADORNOS = re.compile(r'^[\s○●◦▪▫—–\-_=~*]{0,4}$')
# La orla también deja circulitos sueltos pegados al texto al juntar renglones.
ORLA_SUELTA = re.compile(r'[○◦]+')

# Membrete que se repite en TODAS las páginas del DCNB. Se quita por patrón y
# no por «línea que se repite» porque lleva el número de página pegado, así que
# cada página tiene una versión distinta y la detección por repetición la deja
# pasar entera.
MEMBRETE = [
    re.compile(r'Dise[ñn]o Curricular Nacional para la Educaci[óo]n B[áa]sica', re.I),
    re.compile(r'Curr[íi]culo Nacional B[áa]sico', re.I),
    re.compile(r'Secretar[íi]a de Educaci[óo]n', re.I),
    re.compile(r'\b(?:I{1,3}|IV)\s+CICLO\b'),
]

# El membrete de cada página dice de qué ÁREA es, y en las páginas de
# programación también el GRADO. Es la mejor guía para trocear: el maestro
# busca «qué dice de 5º en Matemáticas», no «el capítulo 4».
#
# Las áreas van en LISTA CERRADA y no con una expresión general. Se probó lo
# general y salió mal de las dos maneras: «Área de Ciencias Sociales» se
# quedaba en «Ciencias» (Naturales y Sociales caían en el mismo saco), y
# cualquier frase del cuerpo que dijera «el área de comunicación considera
# las…» se colaba como si fuera un encabezado. La lista es corta y el DCNB no
# inventa áreas nuevas a mitad del documento.
AREAS = [
    'Ciencias Naturales', 'Ciencias Sociales', 'Matemáticas', 'Matematicas',
    'Educación Física y Deportes', 'Educación Física', 'Tecnología',
    'Comunicación / Español', 'Comunicación / Inglés',
    'Comunicación / Educ. Artística', 'Comunicación / Educación Artística',
    'Comunicación', 'Español', 'Inglés',
    # Prebásica llama distinto a las suyas.
    'Desarrollo Personal y Social',
    'Desarrollo de la Comunicación y Representación',
    'Relación con el Entorno',
]


def _sin_tildes(s):
    for a, b in (('á', 'a'), ('é', 'e'), ('í', 'i'), ('ó', 'o'), ('ú', 'u'),
                 ('ñ', 'n'), ('Á', 'A'), ('É', 'E'), ('Í', 'I'), ('Ó', 'O'),
                 ('Ú', 'U'), ('Ñ', 'N')):
        s = s.replace(a, b)
    return s


# Se comparan sin tildes y sin distinguir mayúsculas: el DCNB escribe «Área» y
# «Area» en la misma página, y «Matemáticas» a veces sin tilde.
AREAS_BUSCA = sorted(
    [(re.compile(r'[ÁA]rea\s+de\s+' + re.escape(_sin_tildes(a)).replace(r'\ ', r'\s+')
                 .replace('/', r'\s*/\s*'), re.I), a) for a in AREAS],
    key=lambda x: -len(x[1]))   # la más larga primero: «/ Español» antes que sola
RE_GRADO = re.compile(r'\b(PRIMER|SEGUNDO|TERCER|CUARTO|QUINTO|SEXTO|'
                      r'S[ÉE]PTIMO|OCTAVO|NOVENO)\s+GRADO\b')
# Educación Media se organiza distinto que Básica: no tiene «áreas» con
# expectativas de logro, sino ESPACIOS CURRICULARES por grado (décimo a
# duodécimo), cada uno con sus competencias y criterios de evaluación. Se
# trocea por esa pareja, que es su equivalente de «área + grado».
RE_ESPACIO = re.compile(r'Espacio\s+[Cc]urricular:?\s+([A-ZÁÉÍÓÚÑ][A-Za-zÁÉÍÓÚÑáéíóúñ\s]{2,34}?)'
                        r'(?=\s+(?:Grado|GRADO|D[EÉ]CIMO|Horas|Duraci[óo]n|Nivel|\d)|\s*$)')
RE_GRADO_MEDIA = re.compile(r'\b(D[ÉE]CIMO|UND[ÉE]CIMO|DUOD[ÉE]CIMO)\s+GRADO\b', re.I)
RE_BLOQUE = re.compile(r'\bBloque\s+(\d+)', re.I)

# Encabezados de sección para documentos SIN estructura de área/grado (las
# leyes de `_dev/leyes/`). El orden importa: de lo específico a lo general.
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
    # El número de página cambia en cada hoja: se comparan las líneas con los
    # dígitos neutralizados, o «… 64» y «… 123» pasarían por líneas distintas
    # y el membrete sobreviviría entero.
    clave = lambda l: re.sub(r'\d+', '#', l.strip())
    cuenta = Counter()
    for p in paginas:
        # Solo se miran las primeras y últimas líneas: ahí viven membrete y pie.
        lineas = [l.strip() for l in p.split('\n') if l.strip()]
        for l in lineas[:4] + lineas[-4:]:
            if 8 < len(l) < 120:
                cuenta[clave(l)] += 1
    umbral = len(paginas) * 0.5
    basura = {k for k, n in cuenta.items() if n >= umbral}
    if not basura:
        return paginas
    limpias = []
    for p in paginas:
        limpias.append('\n'.join(
            l for l in p.split('\n') if clave(l) not in basura))
    return limpias


def solo_membrete(linea):
    """
    ¿Esta línea es SOLO membrete, o es texto de verdad que lo menciona?

    La diferencia no es un detalle: al principio esto borraba el patrón en toda
    la página y dejó «E l , marca el inicio del proceso» donde el documento
    decía «El Currículo Nacional Básico, marca el inicio del proceso». Un
    corpus con frases mutiladas es peor que no tenerlo, porque el destrozo no
    se ve hasta que alguien cita esa línea.

    Regla: se quita el membrete solo si, después de quitarlo, no queda nada que
    valga la pena. Si queda frase, la línea se respeta entera.
    """
    l = linea.strip()
    if not l:
        return False
    resto = l
    for patron in MEMBRETE:
        resto = patron.sub(' ', resto)
    resto = re.sub(r'[\s\d.,:;|/·—–\-]+', '', resto)
    return len(resto) < 4 and resto != l


def limpia(txt):
    """Junta lo que el PDF partió y quita el aire sobrante."""
    # Adornos y membrete: se van ANTES de juntar renglones, porque después
    # quedan pegados dentro del primer párrafo y ya no hay línea que borrar.
    txt = '\n'.join(l for l in txt.split('\n') if not ADORNOS.match(l))
    txt = ORLA_SUELTA.sub(' ', txt)
    txt = '\n'.join(l for l in txt.split('\n') if not solo_membrete(l))
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


def cabecera_dcnb(cruda):
    """
    Saca (área, grado) del membrete de la página del DCNB.

    Se lee del TEXTO CRUDO —antes de quitar el membrete— porque justamente ahí
    es donde el documento repite en cada hoja de qué área y grado está
    hablando. Es la guía de troceo que le sirve al maestro: él busca «qué dice
    de 5º en Matemáticas», no «el capítulo 4».
    """
    # La orla de circulitos ocupa las primeras ~36 líneas: si se cortara por
    # caracteres crudos, el «encabezado» serían puros adornos y la búsqueda se
    # metería en el cuerpo del texto, que es de donde salían los grados falsos.
    lineas = [l for l in cruda.split('\n') if not ADORNOS.match(l)]
    cab = _sin_tildes(re.sub(r'[\s○●]+', ' ', ' '.join(lineas[:14])))
    area = ''
    for patron, nombre in AREAS_BUSCA:
        if patron.search(cab):
            area = nombre
            break
    # Media: el «área» es el espacio curricular, y el grado va de décimo a
    # duodécimo. Se prueba después de las áreas de Básica porque un documento
    # es de un nivel o del otro, nunca de los dos.
    if not area:
        e = RE_ESPACIO.search(cab)
        if e:
            area = re.sub(r'\s+', ' ', e.group(1)).strip().title()
    g = RE_GRADO.search(cab) or RE_GRADO_MEDIA.search(cab)
    return area, (g.group(0).title() if g else '')


def secciones_dcnb(paginas, crudas):
    """
    Trocea el DCNB por (área, grado), que es como se consulta.

    El área viene del membrete de cada página; el grado aparece cuando empieza
    la programación de ese grado y vale hasta que aparezca otro. Se agrupan
    páginas consecutivas con la misma pareja.
    """
    metas, area, grado = [], '', ''
    for c in crudas:
        a, g = cabecera_dcnb(c)
        if a:
            # Área nueva: el grado anterior ya no aplica.
            if a != area:
                grado = ''
            area = a
        if g:
            grado = g
        metas.append((area, grado))

    if not any(a for a, _ in metas):
        return None            # no es un DCNB: que lo trocee el modo general

    trozos, actual = [], None
    for n, (pag, meta) in enumerate(zip(paginas, metas), 1):
        if actual is None or meta != actual['meta']:
            if actual:
                trozos.append(actual)
            titulo = ' — '.join(x for x in meta if x) or 'Presentación'
            actual = {'titulo': titulo, 'clase': 'dcnb', 'meta': meta,
                      'desde': n, 'texto': []}
        actual['texto'].append(pag)
        actual['hasta'] = n
    if actual:
        trozos.append(actual)
    return trozos


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
    return trozos


def parte_por_tamano(trozos):
    """
    Un trozo enorme (un área de 80 páginas) se vuelve a partir por tamaño.

    El corte por estructura manda, pero no puede dejar un archivo que cueste
    más abrir que el documento entero, que es justo lo que se quería evitar.
    """
    finales = []
    for t in trozos:
        entero = '\n\n'.join(t['texto']) if isinstance(t['texto'], list) else t['texto']
        if len(entero) <= MAX_CHARS_TROZO:
            finales.append({**t, 'texto': entero})
            continue
        paginas = t['texto'] if isinstance(t['texto'], list) else [entero]
        partes, buf, desde = [], [], t['desde']
        for i, pag in enumerate(paginas):
            buf.append(pag)
            if len('\n\n'.join(buf)) >= MAX_CHARS_TROZO:
                partes.append((desde, t['desde'] + i, '\n\n'.join(buf)))
                buf, desde = [], t['desde'] + i + 1
        if buf:
            partes.append((desde, t.get('hasta', t['desde']), '\n\n'.join(buf)))
        for i, (d, h, txt) in enumerate(partes, 1):
            finales.append({'titulo': f"{t['titulo']} ({i} de {len(partes)})",
                            'clase': t['clase'], 'desde': d, 'hasta': h,
                            'texto': txt})
    return finales


def nombre_archivo(base, i, titulo):
    """Sin acentos ni espacios, como el resto del repositorio."""
    # El «(3 de 6)» se aparta ANTES de recortar: pegado al título se lo comía
    # el límite de largo y quedaban nombres como «…-sexto-3-de-», que no dicen
    # ni de qué parte son.
    m = re.search(r'\((\d+) de (\d+)\)\s*$', titulo)
    parte = f'-{m.group(1)}de{m.group(2)}' if m else ''
    t = (titulo[:m.start()] if m else titulo).lower()
    for a, b in (('á', 'a'), ('é', 'e'), ('í', 'i'), ('ó', 'o'), ('ú', 'u'),
                 ('ñ', 'n'), ('ü', 'u')):
        t = t.replace(a, b)
    t = re.sub(r'[^a-z0-9]+', '-', t).strip('-')[:42] or 'seccion'
    return f'{base}-{i:02d}-{t}{parte}.md'


def convierte(ruta, salida, prueba=None):
    doc = fitz.open(ruta)
    # Las tildes se quitan ANTES de limpiar, o cada una se vuelve un guión y
    # «SISTEMATIZACIÓN INFORMÁTICA.pdf» sale como «sistematizaci-n-inform-tica»:
    # ilegible, y encima irrastreable si alguien busca el archivo por su nombre.
    base = re.sub(r'[^a-z0-9]+', '-', _sin_tildes(os.path.splitext(
        os.path.basename(ruta))[0]).lower()).strip('-')

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
    # El DCNB dice en cada página de qué área y grado es: si está esa guía se
    # usa, porque es como el maestro consulta. Si no (las leyes), se cae al
    # troceo por encabezados de capítulo.
    trozos = parte_por_tamano(secciones_dcnb(paginas, crudas) or secciones(paginas))

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
