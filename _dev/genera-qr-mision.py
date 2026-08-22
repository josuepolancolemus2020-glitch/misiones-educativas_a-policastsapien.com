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


def nombre_qr(url):
    """img/qr-mision-<carpeta sin prefijo de ciclo>.png, como los que ya hay."""
    carpeta = url.split('/')[1]
    carpeta = re.sub(r'^(1ciclo|2ciclo|3ciclo|2y3ciclo|mat-2y3ciclo|bach-uni)-', '', carpeta)
    return IMG / ('qr-mision-' + carpeta + '.png')


def genera(mision, destino):
    import segno
    url = SITIO + mision['url']
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

    filas = [list(f) for f in qr.matrix_iter(border=2)]   # 1 = negro
    n = len(filas)
    k = max(1, lado // n)                  # cuántos píxeles mide cada módulo
    sobra = lado - n * k                   # se reparte como margen blanco
    izq = sobra // 2
    der = sobra - izq

    def fila_bits(f):
        px = [0] * izq + [b for v in f for b in [0 if v else 1] * k] + [0] * der
        # 0 = negro y 1 = blanco en escala de grises de 1 bit
        px = [1 if p else 0 for p in px]
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


def revisa(destino, url_esperada):
    import cv2
    img = cv2.imread(str(destino))
    if img is None:
        return False, 'no se pudo abrir el archivo'
    leido, _, _ = cv2.QRCodeDetector().detectAndDecode(img)
    if not leido:
        return False, 'el QR no se deja leer'
    if leido != url_esperada:
        return False, 'lleva a ' + leido
    return True, leido


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    solo_revisa = '--revisa' in sys.argv
    ids = {int(a) for a in args} if args else None

    fallos = 0
    for m in catalogo():
        if ids is not None and m['id'] not in ids:
            continue
        destino = nombre_qr(m['url'])
        url = SITIO + m['url']
        if not destino.exists() and solo_revisa:
            print('  ⚠️  sin QR: %s (%s)' % (m['title'], destino.name))
            continue
        if not destino.exists() or (ids is not None and not solo_revisa):
            genera(m, destino)
            accion = 'generado'
        elif solo_revisa:
            accion = 'revisado'
        else:
            continue
        ok, detalle = revisa(destino, url)
        print('  %s %s · %s → %s' % ('✅' if ok else '❌', accion, destino.name, detalle))
        if not ok:
            fallos += 1

    print('\n%s %d fallo(s)\n' % ('❌' if fallos else '✅', fallos))
    return 1 if fallos else 0


if __name__ == '__main__':
    sys.exit(main())
