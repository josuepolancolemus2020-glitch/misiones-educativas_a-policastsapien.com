#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Genera el código QR de la portada de una ficha, a partir del catálogo.

El QR es lo que convierte el papel en puerta de entrada: la ficha se
fotocopia, el alumno la lleva a casa y con el teléfono de un familiar entra
a la misión. Una ficha sin QR es una hoja más, y un QR que apunta a una
dirección equivocada es peor, porque nadie lo comprueba hasta que ya se
repartieron cuarenta copias. Por eso este script hace las dos cosas: lo
genera desde el catálogo (así la dirección no se escribe a mano) y lo vuelve
a leer para comprobar que lleva a donde debe.

Necesita dos paquetes que NO van en el repositorio, igual que Playwright:

    pip install --user segno opencv-python-headless

Uso:
    python3 _dev/genera-qr-mision.py                 # los que falten
    python3 _dev/genera-qr-mision.py 62 63 64        # solo esos ids
    python3 _dev/genera-qr-mision.py --revisa        # solo comprobar
"""
import json
import pathlib
import re
import sys

RAIZ = pathlib.Path(__file__).resolve().parent.parent
SITIO = 'https://metas.policastsapien.com/'
IMG = RAIZ / 'img'


def catalogo():
    """Lee MISSIONS de js/data/misiones.js sin ejecutar JavaScript."""
    txt = (RAIZ / 'js' / 'data' / 'misiones.js').read_text(encoding='utf-8')
    bloque = txt[txt.index('const MISSIONS = ['):]
    bloque = bloque[:bloque.index('\n];') + 3]
    misiones = []
    for linea in bloque.split('\n'):
        m = re.search(r"\{ id: *(\d+),.*?title: '([^']+)'.*?url: '([^']+)'", linea)
        if m:
            misiones.append({'id': int(m.group(1)), 'title': m.group(2), 'url': m.group(3)})
    return misiones


def direccion(url_mision):
    """La dirección tal como tiene que ir dentro del QR.

    ⚠️ Hay una misión cuyo archivo lleva espacios y una tilde
    (`angulos-bisectriz_II y III-Ciclo_Básica.html`). En una dirección eso va
    escapado —`%20` y `%C3%A1`—: un espacio crudo dentro de un QR se lo come
    o se lo parte cualquier lector, y la familia acaba en una página que no
    existe. Su QR ya estaba bien escrito; era esta herramienta la que lo
    comparaba contra la ruta cruda y lo daba por ajeno.
    """
    from urllib.parse import quote
    return SITIO + quote(url_mision, safe='/')


def misma_direccion(a, b):
    """Dos direcciones son la misma aunque una lleve los %XX y la otra no."""
    from urllib.parse import unquote
    return unquote(a) == unquote(b)


def nombre_qr(url):
    """img/qr-mision-<carpeta sin prefijo de ciclo>.png, como los que ya hay.

    Es solo el nombre POR CONVENIO, el que se le pone a una misión nueva. No
    es la verdad de quién tiene QR: quitarle el prefijo del ciclo hace que dos
    misiones distintas caigan en el mismo nombre —`2y3ciclo-adjetivos` y
    `bach-uni-adjetivos` dan las dos `qr-mision-adjetivos.png`—, y la de
    Bachillerato tiene el suyo con otro nombre. Para revisar se usa
    `qr_de_cada_mision`, que lee los QR y no adivina.
    """
    carpeta = url.split('/')[1]
    carpeta = re.sub(r'^(1ciclo|2ciclo|3ciclo|2y3ciclo|mat-2y3ciclo|bach-uni)-', '', carpeta)
    return IMG / ('qr-mision-' + carpeta + '.png')


def qr_de_la_ficha(mision):
    """El archivo de QR que de verdad usa esa misión, siguiendo el hilo
    misión → su ficha → el <img> del QR.

    Es la única forma que no adivina, y las 68 misiones enlazan a su ficha
    desde su sección de Recursos, así que el hilo no se rompe. Deducir el
    nombre de la carpeta falla en los dos sentidos: `bach-uni-adjetivos`
    choca con `2y3ciclo-adjetivos`, y tres fichas llevan años con un QR cuyo
    nombre no se parece al de su carpeta —y por eso la revisión vieja ni
    los abría, y sus tres QR estaban ilegibles sin que nadie lo supiera—.
    """
    html = RAIZ / mision['url']
    if not html.exists():
        return None
    m = re.search(r'fichas/(ficha-[A-Za-z0-9._-]+\.html)', html.read_text(encoding='utf-8', errors='ignore'))
    if not m:
        return None
    ficha = RAIZ / 'fichas' / m.group(1)
    if not ficha.exists():
        return None
    q = re.search(r'(qr-mision-[A-Za-z0-9._-]+\.png)', ficha.read_text(encoding='utf-8', errors='ignore'))
    return IMG / q.group(1) if q else None


def destino_de(mision):
    """Dónde se escribe su QR: el que ya usa su ficha, y si no tiene, el del
    convenio. Escribirlo en el del convenio cuando la ficha enseña otro deja
    un PNG que no mira nadie y la ficha con el QR viejo."""
    return qr_de_la_ficha(mision) or nombre_qr(mision['url'])


def choques(misiones):
    """Misiones que comparten el nombre POR CONVENIO. Escribir las dos ahí
    dejaría a una de ellas con el QR de la otra, y en papel eso manda al
    alumno a la misión que no era."""
    por_nombre = {}
    for m in misiones:
        por_nombre.setdefault(nombre_qr(m['url']).name, []).append(m)
    return {k: v for k, v in por_nombre.items() if len(v) > 1}


def lee_qr(ruta):
    """Lo que lleva dentro un PNG, o '' si no se deja leer."""
    import cv2
    img = cv2.imread(str(ruta))
    if img is None:
        return ''
    leido, _, _ = cv2.QRCodeDetector().detectAndDecode(img)
    return leido or ''


def qr_de_cada_mision(misiones):
    """De qué archivo es el QR de cada misión, MIRÁNDOLOS.

    Es al revés de como se hacía, y por eso no puede dar una falsa alarma: no
    se deduce el nombre del archivo y luego se comprueba a ver si coincide,
    sino que se abren los QR que hay y cada uno se apunta a la misión a la que
    de verdad lleva. Así la de Bachillerato encuentra el suyo aunque no se
    llame como su carpeta —`bach-uni-adjetivos` y `2y3ciclo-adjetivos` dan el
    mismo nombre por convenio, y la vieja acusaba a un archivo correcto—, y un
    QR que apunta a una dirección que ya no existe sale a la luz.

    Se emparejan por dos caminos, y hacen falta los dos:

    1. Se lee con OpenCV. Es lo más parecido a lo que hará el teléfono de la
       familia, así que cuando funciona es la mejor prueba que hay.
    2. ⚠️ Y cuando NO funciona no se da por roto: se compara el dibujo módulo
       a módulo contra el QR que le tocaría a cada dirección. Ese lector falla
       en unos cuantos códigos densos —los que salen de la corrección ALTA que
       pide la normativa— por muy bien escritos que estén, y darlos por rotos
       mandaría a rehacer QR que están perfectos. El porqué, en `revisa`.
    """
    import segno
    esperados = {}
    for m in misiones:
        clave = tuple(tuple(bool(v) for v in f)
                      for f in segno.make(direccion(m['url']), error='h').matrix_iter(border=0))
        esperados[clave] = m['url']

    porUrl = {}
    rotos = []
    for png in sorted(IMG.glob('qr-mision-*.png')):
        leido = lee_qr(png)
        url = None
        if leido.startswith(SITIO):
            from urllib.parse import unquote
            url = unquote(leido[len(SITIO):])
        if url is None:
            mat = modulos_del_png(png)
            url = esperados.get(tuple(tuple(f) for f in mat)) if mat else None
        if url is not None:
            porUrl.setdefault(url, []).append(png)
        elif leido:
            rotos.append((png, 'no lleva al sitio: ' + leido))
        else:
            rotos.append((png, 'no se deja leer y su dibujo no es el de ninguna misión'))

    de = {}
    for m in misiones:
        iguales = porUrl.get(m['url'], [])
        if iguales:
            de[m['id']] = iguales[0]
    return de, rotos, porUrl


def genera(mision, destino):
    import segno
    url = direccion(mision['url'])
    # Corrección de errores alta: la ficha se fotocopia y se dobla, y un QR
    # con una esquina gastada tiene que seguir leyéndose.
    qr = segno.make(url, error='h')
    escribe_png(qr, destino)
    return url


def escribe_png(qr, destino, lado=300):
    """PNG de 300x300 en blanco y negro de 1 bit, como los ya publicados.

    Se escribe a mano en vez de reescalar con una librería de imagen por dos
    razones: un QR reescalado con suavizado deja los cuadritos borrosos y
    algunos lectores baratos fallan, y el PNG de 1 bit pesa 1 KB en vez de 10.
    En un aula que descarga con datos del teléfono, eso se nota.
    """
    import zlib
    import struct

    # Zona de silencio de 4 módulos: es la que pide la norma del QR y la que
    # el teléfono espera encontrar. Iba en 2, la mitad, y con el margen pintado
    # de negro por debajo el código quedaba sin aire por los cuatro costados.
    filas = [list(f) for f in qr.matrix_iter(border=4)]   # 1 = negro
    n = len(filas)
    k = max(1, lado // n)                  # cuántos píxeles mide cada módulo
    sobra = lado - n * k                   # se reparte como margen blanco
    izq = sobra // 2
    der = sobra - izq

    def fila_bits(f):
        # ⚠️ El margen va en BLANCO (1), no en negro. Iba en 0 —o sea negro— y
        # eso dejaba una raya negra de lado a lado en las dos columnas de los
        # extremos: se comía la ZONA DE SILENCIO, que es el blanco que un
        # lector necesita alrededor del código para encontrarlo. Con esa raya,
        # varios QR no se dejaban leer (robots-problemas, geografía, áreas
        # protegidas, círculos y polígonos) y el resto quedaba al filo: el
        # papel se fotocopia y se dobla, así que la tolerancia que sobra es la
        # que salva el QR arrugado.
        px = [1] * izq + [b for v in f for b in [0 if v else 1] * k] + [1] * der
        # 0 = negro y 1 = blanco en escala de grises de 1 bit
        b = bytearray()
        for i in range(0, lado, 8):
            byte = 0
            for j in range(8):
                byte = (byte << 1) | (px[i + j] if i + j < lado else 1)
            b.append(byte)
        return bytes(b)

    cuerpo = bytearray()
    for _ in range(izq):
        cuerpo += b'\x00' + fila_bits([0] * n)
    for f in filas:
        linea = fila_bits(f)
        for _ in range(k):
            cuerpo += b'\x00' + linea
    for _ in range(der):
        cuerpo += b'\x00' + fila_bits([0] * n)

    def chunk(tipo, datos):
        c = tipo + datos
        return struct.pack('>I', len(datos)) + c + struct.pack('>I', zlib.crc32(c) & 0xffffffff)

    png = (b'\x89PNG\r\n\x1a\n'
           + chunk(b'IHDR', struct.pack('>IIBBBBB', lado, lado, 1, 0, 0, 0, 0))
           + chunk(b'IDAT', zlib.compress(bytes(cuerpo), 9))
           + chunk(b'IEND', b''))
    destino.write_bytes(png)


def modulos_del_png(destino):
    """Devuelve la matriz de módulos que hay pintada en el PNG (1 = negro).

    Se lee el dibujo y se deshace la escala: cada módulo son k píxeles y
    alrededor hay margen blanco. No hace falta descifrar nada, solo mirar.
    """
    import cv2
    import numpy as np
    g = cv2.imread(str(destino), cv2.IMREAD_GRAYSCALE)
    if g is None:
        return None
    negro = g < 128
    filas = np.where(negro.any(axis=1))[0]
    cols = np.where(negro.any(axis=0))[0]
    if not len(filas) or not len(cols):
        return None
    y0, y1, x0, x1 = filas[0], filas[-1] + 1, cols[0], cols[-1] + 1
    dentro = negro[y0:y1, x0:x1]
    # el módulo mide lo que mide la racha más corta de la primera fila
    cambios = np.where(np.diff(dentro[0].astype(int)) != 0)[0]
    if not len(cambios):
        return None
    k = int(min(np.diff(np.concatenate(([-1], cambios, [dentro.shape[1] - 1])))))
    if k < 1:
        return None
    n = int(round(dentro.shape[0] / k))
    return [[bool(dentro[min(int((i + 0.5) * k), dentro.shape[0] - 1),
                         min(int((j + 0.5) * k), dentro.shape[1] - 1)])
             for j in range(n)] for i in range(n)]


def revisa(destino, url_esperada):
    """Comprueba que el PNG sea EL QR de esa dirección, y por dos caminos.

    ⚠️ El decodificador de OpenCV no basta, y saberlo costó una tarde: con la
    corrección de errores ALTA que pide la normativa —la ficha se dobla y se
    fotocopia— las direcciones de este sitio dan códigos de versión 9, y ese
    lector falla en unos cuantos por muy bien escritos que estén. Los QR
    viejos que sí leía estaban hechos con menos corrección, que es justo lo
    que no se quiere. Bajar la corrección para complacer al lector habría
    sido cambiar el producto para que pasara la prueba.

    Así que el que manda es el segundo camino: se compara MÓDULO A MÓDULO el
    dibujo del archivo contra el QR que `segno` dice que le toca a esa
    dirección. Eso demuestra que el archivo es exactamente ese código, que es
    más de lo que demuestra leerlo. Cuando OpenCV además lo lee, se dice.
    """
    import segno
    esperada = [[bool(v) for v in f] for f in segno.make(url_esperada, error='h').matrix_iter(border=0)]
    tiene = modulos_del_png(destino)
    if tiene is None:
        return False, 'no se pudo abrir el archivo o no hay QR dentro'
    if len(tiene) != len(esperada):
        return False, 'el dibujo tiene %d módulos y le tocan %d' % (len(tiene), len(esperada))
    for i, (a, b) in enumerate(zip(tiene, esperada)):
        if a != b:
            return False, 'el dibujo no es el de esa dirección (se separa en el renglón %d)' % i

    import cv2
    leido, _, _ = cv2.QRCodeDetector().detectAndDecode(cv2.imread(str(destino)))
    if leido and not misma_direccion(leido, url_esperada):
        return False, 'lleva a ' + leido
    return True, url_esperada + ('' if leido else '  (módulo a módulo; OpenCV no lo lee, los teléfonos sí)')


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    solo_revisa = '--revisa' in sys.argv
    ids = {int(a) for a in args} if args else None

    misiones = catalogo()
    fallos = 0

    # Dos misiones con el mismo nombre por convenio: se avisa SIEMPRE, aunque
    # hoy no estorbe, porque el día que alguien genere la segunda le pisa el QR
    # a la primera y el papel de una lleva a la otra.
    for nombre, cuales in sorted(choques(misiones).items()):
        print('  ⚠️  %s le tocaría por convenio a %d misiones: %s' %
              (nombre, len(cuales), ', '.join('%s (id %d)' % (c['title'], c['id']) for c in cuales)))
        print('      la que no se llame así necesita su propio nombre; se revisan por lo que LLEVAN dentro.')

    # ---------- generar ----------
    for m in misiones:
        if ids is not None and m['id'] not in ids:
            continue
        if solo_revisa:
            continue
        destino = destino_de(m)
        if destino.exists() and ids is None:
            continue               # sin ids solo se generan los que faltan
        genera(m, destino)
        ok, detalle = revisa(destino, direccion(m['url']))
        print('  %s generado · %s → %s' % ('✅' if ok else '❌', destino.name, detalle))
        if not ok:
            fallos += 1

    # ---------- revisar: leyendo los QR, no deduciendo su nombre ----------
    de, rotos, porUrl = qr_de_cada_mision(misiones)

    for png, motivo in rotos:
        print('  ❌ %s → %s' % (png.name, motivo))
        fallos += 1

    for url, pngs in sorted(porUrl.items()):
        if len(pngs) > 1:
            print('  ⚠️  %d QR llevan a la misma misión (%s): %s' %
                  (len(pngs), url, ', '.join(p.name for p in pngs)))

    for m in misiones:
        if ids is not None and m['id'] not in ids:
            continue
        png = de.get(m['id'])
        if png is None:
            print('  ⚠️  sin QR: %s (le tocaría %s)' % (m['title'], destino_de(m).name))
            continue
        print('  ✅ revisado · %s → %s' % (png.name, direccion(m['url'])))

    print('\n%s %d fallo(s)\n' % ('❌' if fallos else '✅', fallos))
    return 1 if fallos else 0


if __name__ == '__main__':
    sys.exit(main())
