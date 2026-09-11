#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Arma los iconos de la aplicación instalada a partir del logo oficial.

    pip install --user pillow          (no va en el repositorio)
    python3 _dev/genera-iconos-app.py           # escribe los iconos
    python3 _dev/genera-iconos-app.py --revisa  # solo mide, no escribe

POR QUÉ ESTO ES UN GUION Y NO UN RECORTE A MANO
-----------------------------------------------
El icono de la aplicación instalada NO es una imagen que se recorta a ojo: el
teléfono le pone una MÁSCARA encima y se queda con lo de dentro. Un logo pegado
al borde pierde lo de fuera, y aquí lo de fuera es la palabra «EDITORIAL» —o
sea, el nombre de quien publica—. Eso no se ve al subirlo: se ve en la pantalla
de inicio del maestro, después de que instaló la aplicación.

Por eso el tamaño no se escribe: se MIDE. El guion busca la tinta del logo
—todo lo que no es blanco—, calcula el círculo más pequeño que la contiene
entera y lo mete dentro de la zona segura. Así el recorte no depende de la
puntería de nadie, y el día que cambie el logo se corre otra vez y ya está.

LAS DOS FAMILIAS DE ICONO, Y POR QUÉ SON DOS
--------------------------------------------
`any`       — el navegador lo enseña casi entero (pestaña, escritorio, iOS).
              El logo llena el 90 % del lienzo: se ve grande, que es lo suyo.
`maskable`  — Android le aplica su máscara (círculo, cuadrado redondeado, gota;
              cada marca la suya) y SOLO garantiza el círculo central del 80 %.
              El logo entero va dentro de ese círculo.

Ponerle el mismo archivo a las dos —que es lo que había— obliga a elegir: o el
icono sale pequeño en todas partes, o Android le corta el nombre. Son dos
archivos porque son dos trabajos distintos.

EL FONDO ES BLANCO Y OPACO, NUNCA TRANSPARENTE
----------------------------------------------
Dos razones y las dos son de un teléfono de verdad: iOS pone lo transparente
sobre NEGRO —y este logo es azul marino, así que desaparecería—, y una máscara
de Android sobre un fondo transparente deja las esquinas en nada. El logo se
diseñó sobre blanco; se guarda sobre blanco.
"""
import math
import sys
from pathlib import Path

from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
ORIGEN = RAIZ / 'img' / 'logo-oficial.jpg'

# El lienzo se llena de blanco hasta el borde: es lo que la máscara recorta.
FONDO = (255, 255, 255)

# Qué se considera tinta. El original es un JPEG, así que alrededor de cada
# línea deja un halo de píxeles casi blancos; con el umbral en 0 el guion
# tomaría ese halo por logo y encogería el dibujo sin motivo.
UMBRAL_TINTA = 20

# El halo del JPEG se borra: lo que está casi blanco se pone blanco del todo.
# Solo toca el borde exterior del antialiasing, que no se ve, y deja el fondo
# de un solo color —que además es lo que hace que el PNG pese poco—.
BLANCO_DESDE = 246

# `any`: cuánto del ancho ocupa el logo. El 90 % deja un margen que evita que
# el redondeo de esquinas de iOS y de Windows muerda el dibujo.
ANCHO_ANY = 0.90

# `maskable`: la zona segura es el círculo central de diámetro 80 % del lienzo.
# Está en la especificación, no es una elección de este proyecto.
RADIO_SEGURO = 0.40

# Y de ese círculo se deja un colchón, que no es de adorno: el borde de la
# tinta se decide con UMBRAL_TINTA, así que el halo más claro del antialiasing
# queda fuera de la cuenta. Sin colchón el logo sale tangente al recorte y ese
# halo se lo lleva la máscara. Es la misma razón por la que una hoja de papel
# se cierra en 248 mm y no en los 257,4 que deja la carta.
COLCHON = 0.97

MEDIDAS = (192, 512)


def carga_limpia(ruta):
    """El logo sobre blanco, sin el halo que deja el JPEG."""
    im = Image.open(ruta).convert('RGB')
    pix = im.load()
    ancho, alto = im.size
    for y in range(alto):
        for x in range(ancho):
            r, g, b = pix[x, y]
            if min(r, g, b) >= BLANCO_DESDE:
                pix[x, y] = FONDO
    return im


def puntos_de_tinta(im):
    pix = im.load()
    ancho, alto = im.size
    return [(x, y)
            for y in range(alto)
            for x in range(ancho)
            if 255 - min(pix[x, y]) > UMBRAL_TINTA]


def casco(puntos):
    """Casco convexo (cadena monótona). El círculo mínimo solo necesita el
       contorno, y así son 27 puntos en vez de doscientos mil."""
    pts = sorted(set(puntos))
    if len(pts) < 3:
        return pts

    def giro(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])

    abajo = []
    for p in pts:
        while len(abajo) >= 2 and giro(abajo[-2], abajo[-1], p) <= 0:
            abajo.pop()
        abajo.append(p)
    arriba = []
    for p in reversed(pts):
        while len(arriba) >= 2 and giro(arriba[-2], arriba[-1], p) <= 0:
            arriba.pop()
        arriba.append(p)
    return abajo[:-1] + arriba[:-1]


def circulo_minimo(puntos):
    """El círculo más pequeño que contiene toda la tinta (Welzl).

       Es la cuenta que da el icono grande: inscribir la CAJA del logo en la
       zona segura lo dejaría en el 60 % del ancho, porque las esquinas de la
       caja están vacías. Midiendo la tinta de verdad sube al 76 %."""
    import random
    pts = list(puntos)
    random.seed(7)
    random.shuffle(pts)

    def por_dos(a, b):
        return ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2,
                math.hypot(a[0] - b[0], a[1] - b[1]) / 2)

    def por_tres(a, b, c):
        ax, ay = a; bx, by = b; cx, cy = c
        d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by))
        if abs(d) < 1e-9:
            return None
        ux = ((ax * ax + ay * ay) * (by - cy) + (bx * bx + by * by) * (cy - ay)
              + (cx * cx + cy * cy) * (ay - by)) / d
        uy = ((ax * ax + ay * ay) * (cx - bx) + (bx * bx + by * by) * (ax - cx)
              + (cx * cx + cy * cy) * (bx - ax)) / d
        return (ux, uy, math.hypot(ax - ux, ay - uy))

    def dentro(c, p):
        return math.hypot(p[0] - c[0], p[1] - c[1]) <= c[2] + 1e-7

    c = por_dos(pts[0], pts[1])
    for i in range(2, len(pts)):
        if dentro(c, pts[i]):
            continue
        c = por_dos(pts[0], pts[i])
        for j in range(1, i):
            if dentro(c, pts[j]):
                continue
            c = por_dos(pts[j], pts[i])
            for k in range(j):
                if not dentro(c, pts[k]):
                    nuevo = por_tres(pts[j], pts[i], pts[k])
                    if nuevo:
                        c = nuevo
    return c


def pega(logo, caja, lado, escala, centro_origen):
    """Escala el logo y lo pega en un lienzo blanco de `lado` píxeles,
       poniendo `centro_origen` justo en el centro del lienzo."""
    minx, miny, maxx, maxy = caja
    ancho = round((maxx - minx + 1) * escala)
    alto = round((maxy - miny + 1) * escala)
    recorte = logo.crop((minx, miny, maxx + 1, maxy + 1))
    recorte = recorte.resize((ancho, alto), Image.LANCZOS)

    lienzo = Image.new('RGB', (lado, lado), FONDO)
    # Dónde cae el centro pedido dentro del recorte ya escalado.
    cx = (centro_origen[0] - minx) * escala
    cy = (centro_origen[1] - miny) * escala
    lienzo.paste(recorte, (round(lado / 2 - cx), round(lado / 2 - cy)))
    return lienzo


def guarda(im, ruta):
    """PNG de paleta. El logo tiene tres colores y sus mezclas: con paleta pesa
       la cuarta parte, y esto lo baja el teléfono de un pueblo."""
    paleta = im.quantize(colors=128, method=Image.MEDIANCUT, dither=Image.Dither.NONE)
    paleta.save(ruta, 'PNG', optimize=True)


def main():
    revisa = '--revisa' in sys.argv
    if not ORIGEN.exists():
        sys.exit(f'No está el logo oficial: {ORIGEN}')

    logo = carga_limpia(ORIGEN)
    tinta = puntos_de_tinta(logo)
    xs = [p[0] for p in tinta]
    ys = [p[1] for p in tinta]
    caja = (min(xs), min(ys), max(xs), max(ys))
    ancho_caja = caja[2] - caja[0] + 1
    alto_caja = caja[3] - caja[1] + 1
    centro_caja = (caja[0] + (ancho_caja - 1) / 2, caja[1] + (alto_caja - 1) / 2)
    circ = circulo_minimo(casco(tinta))

    print(f'logo oficial   {ORIGEN.name}  {logo.size[0]}x{logo.size[1]}')
    print(f'tinta          caja {ancho_caja}x{alto_caja} '
          f'(razón {ancho_caja / alto_caja:.2f})')
    print(f'círculo mínimo centro ({circ[0]:.0f},{circ[1]:.0f}) radio {circ[2]:.0f}')
    print()

    for lado in MEDIDAS:
        # `any`: la caja centrada, ocupando ANCHO_ANY del lienzo.
        esc = ANCHO_ANY * lado / ancho_caja
        destino = RAIZ / 'img' / f'icon-{lado}.png'
        if not revisa:
            guarda(pega(logo, caja, lado, esc, centro_caja), destino)
        print(f'any      {lado:>3} -> logo {ancho_caja * esc:.0f}x{alto_caja * esc:.0f}'
              f'  ({100 * ANCHO_ANY:.0f}% del ancho)   {destino.name}')

        # `maskable`: la tinta entera dentro del círculo del 80 %.
        esc_m = (RADIO_SEGURO * COLCHON * lado) / circ[2]
        destino_m = RAIZ / 'img' / f'icon-maskable-{lado}.png'
        if not revisa:
            guarda(pega(logo, caja, lado, esc_m, (circ[0], circ[1])), destino_m)
        print(f'maskable {lado:>3} -> logo {ancho_caja * esc_m:.0f}x{alto_caja * esc_m:.0f}'
              f'  ({100 * ancho_caja * esc_m / lado:.0f}% del ancho)   {destino_m.name}')

    if revisa:
        print('\n--revisa: no se escribió nada.')


if __name__ == '__main__':
    main()
