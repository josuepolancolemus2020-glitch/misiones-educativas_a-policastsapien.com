#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
generar-audios-prebasica.py
Genera todos los archivos de audio MP3 para la misión:
Prebásica (3.° Grado) · Técnicas Gráficas y No Gráficas — Libro 1
utilizando edge-tts:
- Español: es-MX-DaliaNeural (rate="-6%", pitch="+4Hz") para todas las instrucciones y consignas
- Inglés: en-US-AnaNeural (rate="-4%", pitch="+2Hz") EXCLUSIVAMENTE para vocabulario básico (números, colores, letras, cuerpo)

Genera:
- misiones/prebasica-tecnicas-libro1/audios/*.mp3
- misiones/prebasica-tecnicas-libro1/js/mapa-audios-prebasica.js
- misiones/prebasica-tecnicas-libro1/audios/mapa-audios.json
"""

import os
import re
import json
import asyncio
import sys
import edge_tts

VOICE_ES = "es-MX-DaliaNeural"
RATE_ES = "-6%"
PITCH_ES = "+4Hz"

VOICE_EN = "en-US-AnaNeural"
RATE_EN = "-4%"
PITCH_EN = "+2Hz"

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUDIOS_DIR = os.path.join(BASE_DIR, "misiones", "prebasica-tecnicas-libro1", "audios")
JS_DIR = os.path.join(BASE_DIR, "misiones", "prebasica-tecnicas-libro1", "js")

EMOJI_REGEX = re.compile(
    r"[\U0001F1E0-\U0001F1FF"
    r"\U0001F300-\U0001F5FF"
    r"\U0001F600-\U0001F64F"
    r"\U0001F680-\U0001F6FF"
    r"\U0001F700-\U0001F77F"
    r"\U0001F780-\U0001F7FF"
    r"\U0001F800-\U0001F8FF"
    r"\U0001F900-\U0001F9FF"
    r"\U0001FA00-\U0001FA6F"
    r"\U0001FA70-\U0001FAFF"
    r"\U00002702-\U000027B0"
    r"\U000024C2-\U0001F251"
    r"\U00002600-\U000026FF"
    r"\U00002300-\U000023FF"
    r"\U00002B00-\U00002BFF"
    r"\U0000200D"
    r"\U0000FE0F"
    r"]+",
    flags=re.UNICODE,
)

def limpiar_texto(t: str) -> str:
    if not t:
        return ""
    t = EMOJI_REGEX.sub("", t)
    t = re.sub(r"\s+", " ", t)
    return t.strip()

def normalizar_clave_busqueda(s: str) -> str:
    if not s:
        return ""
    s = EMOJI_REGEX.sub("", s)
    s = re.sub(r"[¡!¿?.,:;\"'«»()_—–\-\[\]{}]", " ", s)
    s = re.sub(r"\s+", " ", s).strip().lower()
    return s

# Lista de todos los audios oficiales
ITEMS = [
    # --- 0. SALUDOS INSTITUCIONALES NEURONALES (Dalia) ---
    {
        "file": "saludo-mariaconsuelo.mp3",
        "lang": "es",
        "text": "¡Hola familia de CEPB María Consuelo!",
    },
    {
        "file": "saludo-coral.mp3",
        "lang": "es",
        "text": "¡Hola familia de Coral Bilingual School!",
    },
    {
        "file": "saludo-rafael.mp3",
        "lang": "es",
        "text": "¡Hola familia de CEPB Rafael Pineda Ponce!",
    },
    {
        "file": "saludo-nimia.mp3",
        "lang": "es",
        "text": "¡Hola familia de CEPB Nimia Baquedano!",
    },
    {
        "file": "saludo-dionisio.mp3",
        "lang": "es",
        "text": "¡Hola familia de CEPB Dionisio de Herrera!",
    },
    {
        "file": "saludo-amigo.mp3",
        "lang": "es",
        "text": "¡Hola familia de CEPB Amigo de los Niños!",
    },
    {
        "file": "saludo-blessing.mp3",
        "lang": "es",
        "text": "¡Hola familia de CEBNG Blessing Bilingual School!",
    },
    {
        "file": "saludo-simiente.mp3",
        "lang": "es",
        "text": "¡Hola familia de CEBNG Simiente Santa!",
    },
    {
        "file": "saludo-marina.mp3",
        "lang": "es",
        "text": "¡Hola familia de CEPB Marina Name!",
    },
    {
        "file": "saludo-johncook.mp3",
        "lang": "es",
        "text": "¡Hola familia de John Cook School!",
    },
    {
        "file": "saludo-panamericano.mp3",
        "lang": "es",
        "text": "¡Hola familia de Liceo Panamericano!",
    },
    {
        "file": "saludo-metas.mp3",
        "lang": "es",
        "text": "¡Hola familia de la Edición Oficial M.E.T.A.S. de la Profesora Evelyn Castellanos!",
    },
    {
        "file": "saludo-generico.mp3",
        "lang": "es",
        "text": "¡Hola querida familia!",
    },

    # --- 1. AVISO PARENTAL IMPERATIVO (ESPAÑOL) ---
    {
        "file": "aviso_adulto.mp3",
        "lang": "es",
        "text": "Esta sección de Prebásica es un complemento exclusivo para trabajar con el padre, madre o encargado sentado junto al niño durante 10 a 15 minutos. No promovemos el uso libre de teléfonos ni tablets. Si no existe supervisión directa de un adulto, utilice únicamente el libro físico.",
        "raw": "Esta sección de Prebásica es un complemento exclusivo para trabajar con el padre, madre o encargado sentado junto al niño durante 10 a 15 minutos. No promovemos el uso libre de teléfonos ni tablets. Si no existe supervisión directa de un adulto, utilice únicamente el libro físico."
    },

    # --- 2. PESTAÑA 1: TRAZOS CON EL DEDO (6 RETOS + FELICITACIÓN) ---
    {
        "file": "trazo_1_verticales.mp3",
        "lang": "es",
        "text": "Reto uno: Líneas verticales. Lleva cada abejita de arriba hacia abajo hasta llegar a la flor.",
    },
    {
        "file": "trazo_2_horizontales.mp3",
        "lang": "es",
        "text": "Reto dos: Líneas horizontales. Desliza tu dedo de izquierda a derecha para llevar el avión hasta la pista.",
    },
    {
        "file": "trazo_3_zigzag.mp3",
        "lang": "es",
        "text": "Reto tres: Líneas quebradas en zig zag. Sube y baja por los picos hasta tocar el tambor.",
    },
    {
        "file": "trazo_4_inclinadas.mp3",
        "lang": "es",
        "text": "Reto cuatro: Líneas inclinadas. Sube por la cuerda diagonal para llevar cada cometa hasta la nube.",
    },
    {
        "file": "trazo_5_onduladas.mp3",
        "lang": "es",
        "text": "Reto cinco: Líneas curvas y onduladas. Nada con el pececito haciendo olas suaves hasta el coral.",
    },
    {
        "file": "trazo_6_arabescos.mp3",
        "lang": "es",
        "text": "Reto seis: Arabescos y espirales. Sigue el vuelo circular de la mariposa hasta llegar al caracol.",
    },
    {
        "file": "trazo_felicitacion.mp3",
        "lang": "es",
        "text": "¡Muy bien! Llegaste a la meta. ¡Excelente trazo!",
    },

    # --- 3. PESTAÑA 2: RODEA Y DESCUBRE - FELICITACIONES GENERALES ---
    {
        "file": "rodea_felicitacion_tablero.mp3",
        "lang": "es",
        "text": "¡Muy bien hecho! Completaste todo el tablero.",
    },
    {
        "file": "dactilo_felicitacion.mp3",
        "lang": "es",
        "text": "¡Qué linda pintura con tus deditos! Lo hiciste excelente.",
    },

    # --- 4. RODEA Y DESCUBRE: LETRAS EN ESPAÑOL (Dalia) ---
    {
        "file": "letra_a_es.mp3",
        "lang": "es",
        "text": "Rodea todas las tarjetas con la vocal A, como Abeja.",
    },
    {
        "file": "letra_e_es.mp3",
        "lang": "es",
        "text": "Rodea todas las tarjetas con la vocal E, como Elefante.",
    },
    {
        "file": "letra_i_es.mp3",
        "lang": "es",
        "text": "Rodea todas las tarjetas con la vocal I, como Iguana.",
    },
    {
        "file": "letra_o_es.mp3",
        "lang": "es",
        "text": "Rodea todas las tarjetas con la vocal O, como Oso.",
    },
    {
        "file": "letra_u_es.mp3",
        "lang": "es",
        "text": "Rodea todas las tarjetas con la vocal U, como Uvas.",
    },
    {
        "file": "letra_b_es.mp3",
        "lang": "es",
        "text": "Rodea todas las letras B, como Barco.",
    },
    {
        "file": "letra_c_es.mp3",
        "lang": "es",
        "text": "Rodea todas las letras C, como Casa.",
    },
    {
        "file": "letra_d_es.mp3",
        "lang": "es",
        "text": "Rodea todas las letras D, como Dado.",
    },
    {
        "file": "letra_f_es.mp3",
        "lang": "es",
        "text": "Rodea todas las letras F, como Foca.",
    },
    {
        "file": "letra_m_es.mp3",
        "lang": "es",
        "text": "Rodea todas las letras M, como Mamá.",
    },
    {
        "file": "letra_p_es.mp3",
        "lang": "es",
        "text": "Rodea todas las letras P, como Pato.",
    },
    {
        "file": "letra_s_es.mp3",
        "lang": "es",
        "text": "Rodea todas las letras S, como Sol.",
    },
    {
        "file": "letra_t_es.mp3",
        "lang": "es",
        "text": "Rodea todas las letras T, como Tortuga.",
    },

    # --- 5. RODEA Y DESCUBRE: NÚMEROS EN ESPAÑOL (Dalia) ---
    {"file": "num_1_es.mp3", "lang": "es", "text": "Rodea todos los números 1, Uno."},
    {"file": "num_2_es.mp3", "lang": "es", "text": "Rodea todos los números 2, Dos."},
    {"file": "num_3_es.mp3", "lang": "es", "text": "Rodea todos los números 3, Tres."},
    {"file": "num_4_es.mp3", "lang": "es", "text": "Rodea todos los números 4, Cuatro."},
    {"file": "num_5_es.mp3", "lang": "es", "text": "Rodea todos los números 5, Cinco."},
    {"file": "num_6_es.mp3", "lang": "es", "text": "Rodea todos los números 6, Seis."},
    {"file": "num_7_es.mp3", "lang": "es", "text": "Rodea todos los números 7, Siete."},
    {"file": "num_8_es.mp3", "lang": "es", "text": "Rodea todos los números 8, Ocho."},
    {"file": "num_9_es.mp3", "lang": "es", "text": "Rodea todos los números 9, Nueve."},
    {"file": "num_10_es.mp3", "lang": "es", "text": "Rodea todos los números 10, Diez."},

    # --- 6. RODEA Y DESCUBRE: NOCIONES ESPACIALES EN ESPAÑOL ---
    {
        "file": "espacial_detras_delante_es.mp3",
        "lang": "es",
        "text": "Rodea el ratón que está DETRÁS del queso y pinta el que está DELANTE",
    },
    {
        "file": "espacial_arriba_abajo_es.mp3",
        "lang": "es",
        "text": "Rodea las mariquitas que están ARRIBA de las flores",
    },
    {
        "file": "espacial_grande_pequeno_es.mp3",
        "lang": "es",
        "text": "Marca con X el objeto GRANDE y rodea el objeto PEQUEÑO en cada pareja",
    },
    {
        "file": "espacial_lleno_vacio_es.mp3",
        "lang": "es",
        "text": "Rodea los recipientes LLENOS y marca con X los que están VACÍOS",
    },

    # Dactilopintura instrucciones en español
    {
        "file": "dactilo_adentro_manzana_es.mp3",
        "lang": "es",
        "text": "Pon huellitas de pintura ADENTRO de la figura: Manzana",
        "raw": "Pon huellitas de pintura ADENTRO de la figura: Manzana 🍎",
    },
    {
        "file": "dactilo_afuera_manzana_es.mp3",
        "lang": "es",
        "text": "Pon huellitas de pintura AFUERA de la figura: Manzana",
        "raw": "Pon huellitas de pintura AFUERA de la figura: Manzana 🍎",
    },
    {
        "file": "dactilo_adentro_uvas_es.mp3",
        "lang": "es",
        "text": "Pon huellitas de pintura ADENTRO de la figura: Racimo de Uvas",
        "raw": "Pon huellitas de pintura ADENTRO de la figura: Racimo de Uvas 🍇",
    },
    {
        "file": "dactilo_afuera_uvas_es.mp3",
        "lang": "es",
        "text": "Pon huellitas de pintura AFUERA de la figura: Racimo de Uvas",
        "raw": "Pon huellitas de pintura AFUERA de la figura: Racimo de Uvas 🍇",
    },
    {
        "file": "dactilo_adentro_caballito_es.mp3",
        "lang": "es",
        "text": "Pon huellitas de pintura ADENTRO de la figura: Caballito de Mar",
        "raw": "Pon huellitas de pintura ADENTRO de la figura: Caballito de Mar 🐴🌊",
    },
    {
        "file": "dactilo_afuera_caballito_es.mp3",
        "lang": "es",
        "text": "Pon huellitas de pintura AFUERA de la figura: Caballito de Mar",
        "raw": "Pon huellitas de pintura AFUERA de la figura: Caballito de Mar 🐴🌊",
    },

    # --- 7. PESTAÑA 3: ROMPECABEZAS (INSTRUCCIONES EN ESPAÑOL Y FELICITACIÓN) ---
    {
        "file": "pz_instruccion_numeros.mp3",
        "lang": "es",
        "text": "Rompecabezas de los números: toca cada ficha numérica y colócala en su silueta contando los dibujos en orden.",
    },
    {
        "file": "pz_instruccion_cuerpo.mp3",
        "lang": "es",
        "text": "Rompecabezas del cuerpo humano, página cincuenta y nueve: coloca en orden vertical la Cabeza, el Tronco, los Brazos y las Piernas.",
    },
    {
        "file": "pz_instruccion_colores.mp3",
        "lang": "es",
        "text": "Estacionamiento de carritos de colores: estaciona cada carrito en su lugar del mismo color. Rojo, Azul, Amarillo, Verde, Naranja y Morado.",
        "force": True
    },
    {
        "file": "pz_instruccion_figuras.mp3",
        "lang": "es",
        "text": "Rompecabezas de figuras geométricas: coloca el círculo, cuadrado, triángulo, rectángulo, óvalo, rombo, estrella y corazón en su silueta.",
    },
    {
        "file": "pz_felicitacion.mp3",
        "lang": "es",
        "text": "¡Bravo! Completaste todo el rompecabezas sin ningún error.",
    },

    # --- 8. VOCABULARIO BÁSICO (100% SEPARADO POR IDIOMA) ---
    # A) NÚMEROS EN ESPAÑOL (Dalia)
    {"file": "pz_num_1_es.mp3", "lang": "es", "text": "Uno"},
    {"file": "pz_num_2_es.mp3", "lang": "es", "text": "Dos"},
    {"file": "pz_num_3_es.mp3", "lang": "es", "text": "Tres"},
    {"file": "pz_num_4_es.mp3", "lang": "es", "text": "Cuatro"},
    {"file": "pz_num_5_es.mp3", "lang": "es", "text": "Cinco"},
    {"file": "pz_num_6_es.mp3", "lang": "es", "text": "Seis"},
    {"file": "pz_num_7_es.mp3", "lang": "es", "text": "Siete"},
    {"file": "pz_num_8_es.mp3", "lang": "es", "text": "Ocho"},
    {"file": "pz_num_9_es.mp3", "lang": "es", "text": "Nueve"},
    {"file": "pz_num_10_es.mp3", "lang": "es", "text": "Diez"},

    # B) NÚMEROS BÁSICOS EN INGLÉS NATIVO (AnaNeural)
    {"file": "pz_num_1_en.mp3", "lang": "en", "text": "One"},
    {"file": "pz_num_2_en.mp3", "lang": "en", "text": "Two"},
    {"file": "pz_num_3_en.mp3", "lang": "en", "text": "Three"},
    {"file": "pz_num_4_en.mp3", "lang": "en", "text": "Four"},
    {"file": "pz_num_5_en.mp3", "lang": "en", "text": "Five"},
    {"file": "pz_num_6_en.mp3", "lang": "en", "text": "Six"},
    {"file": "pz_num_7_en.mp3", "lang": "en", "text": "Seven"},
    {"file": "pz_num_8_en.mp3", "lang": "en", "text": "Eight"},
    {"file": "pz_num_9_en.mp3", "lang": "en", "text": "Nine"},
    {"file": "pz_num_10_en.mp3", "lang": "en", "text": "Ten"},

    # C) PARTES DEL CUERPO EN ESPAÑOL (Dalia)
    {"file": "pz_cuerpo_cabeza_es.mp3", "lang": "es", "text": "Cabeza", "raw": "1. Cabeza"},
    {"file": "pz_cuerpo_tronco_es.mp3", "lang": "es", "text": "Tronco", "raw": "2. Tronco"},
    {"file": "pz_cuerpo_brazos_es.mp3", "lang": "es", "text": "Brazos y Manos", "raw": "3. Brazos y Manos"},
    {"file": "pz_cuerpo_piernas_es.mp3", "lang": "es", "text": "Piernas y Pies", "raw": "4. Piernas y Pies"},

    # D) PARTES DEL CUERPO BÁSICAS EN INGLÉS NATIVO (AnaNeural)
    {"file": "pz_cuerpo_head_en.mp3", "lang": "en", "text": "Head"},
    {"file": "pz_cuerpo_trunk_en.mp3", "lang": "en", "text": "Trunk"},
    {"file": "pz_cuerpo_arms_en.mp3", "lang": "en", "text": "Arms and hands", "raw": "Arms and Hands"},
    {"file": "pz_cuerpo_legs_en.mp3", "lang": "en", "text": "Legs and feet", "raw": "Legs and Feet"},

    # E) COLORES EN ESPAÑOL (Dalia)
    {"file": "pz_color_red_es.mp3", "lang": "es", "text": "Rojo"},
    {"file": "pz_color_blue_es.mp3", "lang": "es", "text": "Azul"},
    {"file": "pz_color_yellow_es.mp3", "lang": "es", "text": "Amarillo"},
    {"file": "pz_color_green_es.mp3", "lang": "es", "text": "Verde"},
    {"file": "pz_color_orange_es.mp3", "lang": "es", "text": "Naranja"},
    {"file": "pz_color_violet_es.mp3", "lang": "es", "text": "Morado"},
    {"file": "pz_color_purple_es.mp3", "lang": "es", "text": "Púrpura"},
    {"file": "pz_color_pink_es.mp3", "lang": "es", "text": "Rosa"},
    {"file": "pz_color_white_es.mp3", "lang": "es", "text": "Blanco"},
    {"file": "pz_color_black_es.mp3", "lang": "es", "text": "Negro"},

    # F) COLORES BÁSICOS EN INGLÉS NATIVO (AnaNeural)
    {"file": "pz_color_red_en.mp3", "lang": "en", "text": "Red"},
    {"file": "pz_color_blue_en.mp3", "lang": "en", "text": "Blue"},
    {"file": "pz_color_yellow_en.mp3", "lang": "en", "text": "Yellow"},
    {"file": "pz_color_green_en.mp3", "lang": "en", "text": "Green"},
    {"file": "pz_color_orange_en.mp3", "lang": "en", "text": "Orange"},
    {"file": "pz_color_violet_en.mp3", "lang": "en", "text": "Violet"},
    {"file": "pz_color_purple_en.mp3", "lang": "en", "text": "Purple"},
    {"file": "pz_color_pink_en.mp3", "lang": "en", "text": "Pink"},
    {"file": "pz_color_white_en.mp3", "lang": "en", "text": "White"},
    {"file": "pz_color_black_en.mp3", "lang": "en", "text": "Black"},

    # G) FIGURAS GEOMÉTRICAS EN ESPAÑOL (Dalia)
    {"file": "pz_fig_circulo_es.mp3", "lang": "es", "text": "Círculo"},
    {"file": "pz_fig_cuadrado_es.mp3", "lang": "es", "text": "Cuadrado"},
    {"file": "pz_fig_triangulo_es.mp3", "lang": "es", "text": "Triángulo"},
    {"file": "pz_fig_rectangulo_es.mp3", "lang": "es", "text": "Rectángulo"},
    {"file": "pz_fig_ovalo_es.mp3", "lang": "es", "text": "Óvalo"},
    {"file": "pz_fig_rombo_es.mp3", "lang": "es", "text": "Rombo"},
    {"file": "pz_fig_estrella_es.mp3", "lang": "es", "text": "Estrella"},
    {"file": "pz_fig_corazon_es.mp3", "lang": "es", "text": "Corazón"},

    # H) FIGURAS GEOMÉTRICAS EN INGLÉS NATIVO (Ana)
    {"file": "pz_fig_circle_en.mp3", "lang": "en", "text": "Circle"},
    {"file": "pz_fig_square_en.mp3", "lang": "en", "text": "Square"},
    {"file": "pz_fig_triangle_en.mp3", "lang": "en", "text": "Triangle"},
    {"file": "pz_fig_rectangle_en.mp3", "lang": "en", "text": "Rectangle"},
    {"file": "pz_fig_oval_en.mp3", "lang": "en", "text": "Oval"},
    {"file": "pz_fig_diamond_en.mp3", "lang": "en", "text": "Diamond"},
    {"file": "pz_fig_star_en.mp3", "lang": "en", "text": "Star"},
    {"file": "pz_fig_heart_en.mp3", "lang": "en", "text": "Heart"},

    # I) VOCALES Y LETRAS BÁSICAS EN INGLÉS NATIVO (AnaNeural)
    # A, E, I, O, U, B, C, D, F, M, P, S, T
    {"file": "letra_a_sola_en.mp3", "lang": "en", "text": "A"},
    {"file": "letra_e_sola_en.mp3", "lang": "en", "text": "E"},
    {"file": "letra_i_sola_en.mp3", "lang": "en", "text": "I"},
    {"file": "letra_o_sola_en.mp3", "lang": "en", "text": "O"},
    {"file": "letra_u_sola_en.mp3", "lang": "en", "text": "U"},
    {"file": "letra_b_sola_en.mp3", "lang": "en", "text": "B"},
    {"file": "letra_c_sola_en.mp3", "lang": "en", "text": "C"},
    {"file": "letra_d_sola_en.mp3", "lang": "en", "text": "D"},
    {"file": "letra_f_sola_en.mp3", "lang": "en", "text": "F"},
    {"file": "letra_m_sola_en.mp3", "lang": "en", "text": "M"},
    {"file": "letra_p_sola_en.mp3", "lang": "en", "text": "P"},
    {"file": "letra_s_sola_en.mp3", "lang": "en", "text": "S"},
    {"file": "letra_t_sola_en.mp3", "lang": "en", "text": "T"},

    # --- J) FIGURAS PLANAS CON MI DEDITO (PÁGS. 25-32) ---
    {
        "file": "fig_instruccion_general.mp3",
        "lang": "es",
        "text": "Bienvenido a Figuras Planas con mi Dedito. Elige una figura, repasa su contorno con tu dedito y descubre sus lados y esquinas.",
    },
    {
        "file": "fig_instruccion_circulo.mp3",
        "lang": "es",
        "text": "Pasa tu dedito por el contorno del círculo rojo. Es una línea curva que rueda y no tiene esquinas.",
    },
    {
        "file": "fig_instruccion_cuadrado.mp3",
        "lang": "es",
        "text": "Pasa tu dedito por el contorno del cuadrado azul y cuenta sus cuatro lados rectos iguales.",
    },
    {
        "file": "fig_instruccion_triangulo.mp3",
        "lang": "es",
        "text": "Recorre con tu dedito los tres lados rectos y las tres puntas del triángulo verde.",
    },
    {
        "file": "fig_instruccion_rectangulo.mp3",
        "lang": "es",
        "text": "Recorre los dos lados largos y los dos lados cortos del rectángulo anaranjado.",
    },
    {
        "file": "fig_instruccion_ovalo.mp3",
        "lang": "es",
        "text": "Pasa tu dedito por la curva alargada del óvalo rosado, parece la forma de un huevito.",
    },
    {
        "file": "fig_instruccion_rombo.mp3",
        "lang": "es",
        "text": "Traza los cuatro lados inclinados del rombo o diamante rojo y toca sus cuatro puntas.",
    },
    {
        "file": "fig_instruccion_estrella.mp3",
        "lang": "es",
        "text": "Recorre las cinco puntas brillantes de la estrella amarilla como en el cielo o en el mar.",
    },
    {
        "file": "fig_instruccion_corazon.mp3",
        "lang": "es",
        "text": "Traza las dos curvas de arriba y la punta de abajo de este lindo corazón fucsia.",
    },
    # Felicitaciones al completar el trazado de figuras
    {
        "file": "fig_felicita_circulo.mp3",
        "lang": "es",
        "text": "¡Excelente! Completaste el círculo. ¡Es una línea curva sin esquinas!",
    },
    {
        "file": "fig_felicita_cuadrado.mp3",
        "lang": "es",
        "text": "¡Bravo! Completaste el cuadrado con sus cuatro lados iguales y cuatro esquinas.",
    },
    {
        "file": "fig_felicita_triangulo.mp3",
        "lang": "es",
        "text": "¡Muy bien! El triángulo tiene tres lados rectos y tres puntas.",
    },
    {
        "file": "fig_felicita_rectangulo.mp3",
        "lang": "es",
        "text": "¡Fantástico! El rectángulo tiene dos lados largos y dos lados cortos.",
    },
    {
        "file": "fig_felicita_ovalo.mp3",
        "lang": "es",
        "text": "¡Genial! El óvalo es una curva alargada como un huevito sin esquinas.",
    },
    {
        "file": "fig_felicita_rombo.mp3",
        "lang": "es",
        "text": "¡Súper! El rombo tiene cuatro lados inclinados y cuatro puntas.",
    },
    {
        "file": "fig_felicita_estrella.mp3",
        "lang": "es",
        "text": "¡Hermoso! Recorriste las cinco puntas de la estrella.",
    },
    {
        "file": "fig_felicita_corazon.mp3",
        "lang": "es",
        "text": "¡Precioso! El corazón tiene dos curvas arriba y una punta abajo.",
    },
    # Consigna de objetos reales
    {
        "file": "fig_reto_objetos.mp3",
        "lang": "es",
        "text": "¡Toca los objetos reales que tienen esta misma forma!",
    },
    # Objetos reales del Libro 1 para cada figura
    {"file": "fig_obj_cd.mp3", "lang": "es", "text": "Disco compacto C D"},
    {"file": "fig_obj_reloj.mp3", "lang": "es", "text": "Reloj de pared"},
    {"file": "fig_obj_pizza.mp3", "lang": "es", "text": "Rebanada de pizza"},
    {"file": "fig_obj_plato.mp3", "lang": "es", "text": "Plato redondo"},
    {"file": "fig_obj_chocolate.mp3", "lang": "es", "text": "Barra de chocolate"},
    {"file": "fig_obj_ventana.mp3", "lang": "es", "text": "Ventana cuadrada"},
    {"file": "fig_obj_fichas.mp3", "lang": "es", "text": "Fichas de letras"},
    {"file": "fig_obj_nota.mp3", "lang": "es", "text": "Nota adhesiva"},
    {"file": "fig_obj_senal_vial.mp3", "lang": "es", "text": "Señal de tránsito"},
    {"file": "fig_obj_queso.mp3", "lang": "es", "text": "Trozo de queso"},
    {"file": "fig_obj_sandwich.mp3", "lang": "es", "text": "Sándwich triangular"},
    {"file": "fig_obj_triangulo_musical.mp3", "lang": "es", "text": "Triángulo musical"},
    {"file": "fig_obj_sobres.mp3", "lang": "es", "text": "Sobres de carta"},
    {"file": "fig_obj_celular.mp3", "lang": "es", "text": "Teléfono celular"},
    {"file": "fig_obj_regla.mp3", "lang": "es", "text": "Regla"},
    {"file": "fig_obj_televisor.mp3", "lang": "es", "text": "Televisor"},
    {"file": "fig_obj_libro.mp3", "lang": "es", "text": "Libro escolar"},
    {"file": "fig_obj_bandeja.mp3", "lang": "es", "text": "Bandeja ovalada"},
    {"file": "fig_obj_balon.mp3", "lang": "es", "text": "Balón de fútbol americano"},
    {"file": "fig_obj_huevo.mp3", "lang": "es", "text": "Huevo"},
    {"file": "fig_obj_sandia.mp3", "lang": "es", "text": "Sandía"},
    {"file": "fig_obj_carta.mp3", "lang": "es", "text": "Carta de diez diamantes"},
    {"file": "fig_obj_senal_amarilla.mp3", "lang": "es", "text": "Señal amarilla"},
    {"file": "fig_obj_estrella_mar.mp3", "lang": "es", "text": "Estrella de mar"},
    {"file": "fig_obj_varita.mp3", "lang": "es", "text": "Varita mágica"},
    {"file": "fig_obj_galletas.mp3", "lang": "es", "text": "Galletas de corazón"},
    {"file": "fig_obj_globos.mp3", "lang": "es", "text": "Globos de corazón"},

    # --- 9. PESTAÑA 5: MANOS A LA OBRA (EN EL AULA Y EN CASA) ---
    {
        "file": "casa_aviso_maestro.mp3",
        "lang": "es",
        "text": "El Libro 1 se trabaja principalmente en el aula de clases: Antes de realizar o adelantar páginas del libro físico en casa, consulte siempre las indicaciones de su maestro o maestra. En esta sección encontrarán tanto las técnicas del libro para practicar en el kínder o en casa según indique el docente, como juegos prácticos en familia que no requieren manchar hojas del libro y fortalecen la motricidad y el aprendizaje de su hijo o hija.",
        "force": True,
    },
    {
        "file": "casa_boleado.mp3",
        "lang": "es",
        "text": "1. Boleado de Papel Crepé y Juego de Encestar. Motricidad Fina, páginas de boleado y contornos. En el aula o según indique tu maestro: Rasgar tiritas de papel crepé y formar bolitas usando exclusivamente la pinza trípode, con dedos pulgar, índice y medio, para pegarlas sobre los contornos indicados del libro. Juego sugerido en casa: ¡A encestar bolitas! Conserven o hagan más bolitas de papel de colores y jueguen en familia a lanzarlas para encestarlas dentro de un vasito o recipiente a corta distancia. Pueden contar en español e inglés cuántas bolitas encestan: One, Two, Three, y clasificarlas por color: Red, Blue, Yellow.",
        "force": True,
    },
    {
        "file": "casa_rasgado.mp3",
        "lang": "es",
        "text": "2. Rasgado, Trozado y Collage Texturizado. Coordinación Bilateral, páginas de rasgado y óvalo del huevo página 29. En el aula o según indique tu maestro: Rasgar papel con ambas manos coordinadas, una tira hacia adelante y otra hacia atrás, para rellenar figuras del libro. Juego sugerido en casa: Caminitos y Texturas de la Naturaleza. En una hoja suelta o cartón reciclado, dibujen un camino ancho o un huevito gigante y rellénenlo juntos con hojas secas del patio, cáscara de huevo limpia triturada o papel periódico rasgado.",
        "force": True,
    },
    {
        "file": "casa_figuras.mp3",
        "lang": "es",
        "text": "3. Exploradores de Figuras Geométricas. Complemento de las páginas 25 a 32 del Libro 1. En el aula o según indique tu maestro: Repasar con el dedo índice los lados y esquinas de las 7 figuras planas del libro: Círculo, Cuadrado, Triángulo, Rectángulo, Óvalo, Diamante o Rombo, Estrella y Corazón, y aplicar las técnicas de cada lámina. Juego sugerido en casa: El Detective de las Formas en Casa y Figuras con Palillos o Plastilina. Primero: caminata de detectives por la casa para buscar objetos reales: Circle, Square, Triangle, Rectangle y Oval. Segundo: armen con plastilina y palillos las figuras planas tocando sus esquinas o vértices.",
        "force": True,
    },
    {
        "file": "casa_dactilopintura.mp3",
        "lang": "es",
        "text": "4. Dactilopintura y Trazos Sensoriales en Bandeja. Grafomotricidad sin Lápiz, páginas de trazos, estrella página 31 y corazón página 32. En el aula o según indique tu maestro: Pintar con la yema del dedo índice respetando los bordes de las figuras y realizar los caminos del libro. Juego sugerido en casa: La Pizarra Mágica de Harina o Azúcar. En un plato plano o bandeja, esparzan una capa delgada de harina, maicena o arena limpia. Pidan al niño que trace con su dedito líneas verticales, zig-zag, círculos, estrellas, vocales y números del 1 al 10. ¡Sacudan suavemente la bandeja para borrar y volver a empezar!",
        "force": True,
    },
    {
        "file": "casa_recorte.mp3",
        "lang": "es",
        "text": "5. Recorte Seguro con Tijera y Rompecabezas. Freno Inhibitorio, páginas de recorte y armado. En el aula o según indique tu maestro: Practicar el uso de tijera escolar de punta redonda sobre las líneas punteadas del libro bajo supervisión directa. Juego sugerido en casa: Peluquería de Papel y Rompecabezas de Revistas. Con tiras de papel reciclado, hagan flequillos cortos cortando el pelito al muñeco de papel y recorten en 3 o 4 partes una figura grande de una caja de cereal para volver a armarla juntos en familia.",
        "force": True,
    },
    {
        "file": "casa_germinacion.mp3",
        "lang": "es",
        "text": "6. Laboratorio Vivo: Germinación y Secuencia de las Plantas. Complemento de la página 111 del Libro 1. En el aula o según indique tu maestro: Seguir con el dedito el camino de las flechas verdes en U de la página 111, recortar las 6 tarjetas del crecimiento de la planta frutal y ordenarlas antes de pegarlas. Experimento sugerido en casa: Mi Primera Semillita en Vaso Transparente. En un vasito transparente con algodón húmedo o tierra fértil, siembren juntos un frijolito o semillas de fruta. Pónganlo cerca de la luz, riéguenlo con poquita agua y observen cada mañana cómo brota la raíz y el tallo igual que en la página 111 del libro: Seed, Plant, Fruit.",
        "force": True,
    },
    {
        "file": "casa_felicitacion.mp3",
        "lang": "es",
        "text": "¡Felicidades familia! Han completado las actividades y juegos de Manos a la Obra, fortaleciendo el aprendizaje tanto en el aula como en casa.",
        "force": True,
    },
    # Vocabulario de la germinación y ciclo de las plantas (en inglés con Ana)
    {"file": "plant_water_en.mp3", "lang": "en", "text": "Water", "force": True},
    {"file": "plant_seed_en.mp3", "lang": "en", "text": "Seed", "force": True},
    {"file": "plant_plant_en.mp3", "lang": "en", "text": "Plant", "force": True},
    {"file": "plant_fruit_en.mp3", "lang": "en", "text": "Fruit", "force": True},
]

async def generar_un_audio(sem, item, total, idx, force=False):
    async with sem:
        outfile = os.path.join(AUDIOS_DIR, item["file"])
        need_gen = force or item.get("force", False)
        if not need_gen and os.path.exists(outfile) and os.path.getsize(outfile) > 1000:
            print(f"[{idx+1}/{total}] Ya existe: {item['file']} ({os.path.getsize(outfile)} bytes)")
            return True

        voice = VOICE_EN if item["lang"] == "en" else VOICE_ES
        rate = RATE_EN if item["lang"] == "en" else RATE_ES
        pitch = PITCH_EN if item["lang"] == "en" else PITCH_ES

        spoken_text = limpiar_texto(item["text"])

        retries = 3
        for r in range(retries):
            try:
                comm = edge_tts.Communicate(spoken_text, voice, rate=rate, pitch=pitch)
                await comm.save(outfile)
                size = os.path.getsize(outfile)
                print(f"[{idx+1}/{total}] OK ({item['lang']}): {item['file']} ({size} bytes)")
                return True
            except Exception as e:
                print(f"[{idx+1}/{total}] Reintento {r+1}/{retries} para {item['file']}: {e}")
                await asyncio.sleep(1.5)

        print(f"[{idx+1}/{total}] ERROR al generar {item['file']}")
        return False

async def main():
    os.makedirs(AUDIOS_DIR, exist_ok=True)
    os.makedirs(JS_DIR, exist_ok=True)

    force_all = "--force" in sys.argv

    # Eliminar archivos obsoletos que tenían instrucciones largas en inglés o híbridos
    obsoletos = [
        "pz_num_1.mp3", "pz_num_2.mp3", "pz_num_3.mp3", "pz_num_4.mp3", "pz_num_5.mp3",
        "pz_num_6.mp3", "pz_num_7.mp3", "pz_num_8.mp3", "pz_num_9.mp3", "pz_num_10.mp3",
        "pz_cuerpo_cabeza.mp3", "pz_cuerpo_tronco.mp3", "pz_cuerpo_brazos.mp3", "pz_cuerpo_piernas.mp3",
        "pz_color_red.mp3", "pz_color_blue.mp3", "pz_color_yellow.mp3", "pz_color_green.mp3",
        "pz_color_orange.mp3", "pz_color_violet.mp3",
        "pz_fig_circulo.mp3", "pz_fig_cuadrado.mp3", "pz_fig_triangulo.mp3", "pz_fig_rectangulo.mp3",
        "pz_fig_ovalo.mp3", "pz_fig_rombo.mp3", "pz_fig_estrella.mp3", "pz_fig_corazon.mp3",
        # Eliminación de instrucciones largas en inglés y archivos obsoletos
        "casa_estrujado.mp3", "casa_punzado.mp3",
        "letra_a_en.mp3", "letra_e_en.mp3", "letra_i_en.mp3", "letra_o_en.mp3", "letra_u_en.mp3",
        "letra_b_en.mp3", "letra_c_en.mp3", "letra_m_en.mp3", "letra_p_en.mp3", "letra_s_en.mp3",
        "num_1_en.mp3", "num_2_en.mp3", "num_3_en.mp3", "num_4_en.mp3", "num_5_en.mp3",
        "num_6_en.mp3", "num_7_en.mp3", "num_8_en.mp3", "num_9_en.mp3", "num_10_en.mp3",
        "espacial_detras_delante_en.mp3", "espacial_arriba_abajo_en.mp3",
        "espacial_grande_pequeno_en.mp3", "espacial_lleno_vacio_en.mp3",
        "dactilo_inside_apple_en.mp3", "dactilo_outside_apple_en.mp3",
        "dactilo_inside_grapes_en.mp3", "dactilo_outside_grapes_en.mp3",
        "dactilo_inside_seahorse_en.mp3", "dactilo_outside_seahorse_en.mp3"
    ]
    for obs in obsoletos:
        p = os.path.join(AUDIOS_DIR, obs)
        if os.path.exists(p):
            try:
                os.remove(p)
                print(f"Eliminado archivo obsoleto: {obs}")
            except Exception as e:
                print(f"No se pudo eliminar {obs}: {e}")

    print(f"=== Generando {len(ITEMS)} audios neuronales para Prebásica (Libro 1) ===")
    sem = asyncio.Semaphore(4)
    tasks = [generar_un_audio(sem, item, len(ITEMS), idx, force=force_all) for idx, item in enumerate(ITEMS)]
    results = await asyncio.gather(*tasks)

    success_count = sum(1 for r in results if r)
    print(f"\nResultado generación: {success_count}/{len(ITEMS)} archivos listos.")

    # Construir mapa de asociación (normalizado, tolerante y raw)
    mapa = {}
    for item in ITEMS:
        filename = item["file"]
        clean_key = limpiar_texto(item["text"])
        mapa[clean_key] = filename
        mapa[clean_key.lower()] = filename
        mapa[normalizar_clave_busqueda(clean_key)] = filename

        if "raw" in item:
            mapa[item["raw"]] = filename
            mapa[limpiar_texto(item["raw"])] = filename
            mapa[normalizar_clave_busqueda(item["raw"])] = filename

    # Aliases adicionales para escuelas, piezas de puzzle, números y vocabulario básico
    aliases = {
        # Saludos por nombre exacto de colegio autorizado
        "CEPB María Consuelo": "saludo-mariaconsuelo.mp3",
        "Coral Bilingual School": "saludo-coral.mp3",
        "CEPB Rafael Pineda Ponce": "saludo-rafael.mp3",
        "CEPB Nimia Baquedano": "saludo-nimia.mp3",
        "CEPB Dionisio de Herrera": "saludo-dionisio.mp3",
        "CEPB Amigo de los Niños": "saludo-amigo.mp3",
        "CEBNG Blessing Bilingual School": "saludo-blessing.mp3",
        "CEBNG Simiente Santa": "saludo-simiente.mp3",
        "CEPB Marina Name": "saludo-marina.mp3",
        "John Cook School": "saludo-johncook.mp3",
        "Liceo Panamericano": "saludo-panamericano.mp3",
        "Edición Oficial M.E.T.A.S. · Evelyn S. Castellanos H.": "saludo-metas.mp3",
        "saludo-mariaconsuelo": "saludo-mariaconsuelo.mp3",
        "saludo-coral": "saludo-coral.mp3",
        "saludo-rafael": "saludo-rafael.mp3",
        "saludo-nimia": "saludo-nimia.mp3",
        "saludo-dionisio": "saludo-dionisio.mp3",
        "saludo-amigo": "saludo-amigo.mp3",
        "saludo-blessing": "saludo-blessing.mp3",
        "saludo-simiente": "saludo-simiente.mp3",
        "saludo-marina": "saludo-marina.mp3",
        "saludo-johncook": "saludo-johncook.mp3",
        "saludo-panamericano": "saludo-panamericano.mp3",
        "saludo-metas": "saludo-metas.mp3",
        "saludo-generico": "saludo-generico.mp3",

        # Aviso adulto y felicitaciones fijas por clave
        "aviso_adulto": "aviso_adulto.mp3",
        "trazo_felicitacion": "trazo_felicitacion.mp3",
        "rodea_felicitacion_tablero": "rodea_felicitacion_tablero.mp3",
        "dactilo_felicitacion": "dactilo_felicitacion.mp3",
        "pz_felicitacion": "pz_felicitacion.mp3",
        "casa_felicitacion": "casa_felicitacion.mp3",

        # Figuras geométricas en español e inglés
        "Círculo": "pz_fig_circulo_es.mp3",
        "Cuadrado": "pz_fig_cuadrado_es.mp3",
        "Triángulo": "pz_fig_triangulo_es.mp3",
        "Rectángulo": "pz_fig_rectangulo_es.mp3",
        "Óvalo": "pz_fig_ovalo_es.mp3",
        "Rombo": "pz_fig_rombo_es.mp3",
        "Estrella": "pz_fig_estrella_es.mp3",
        "Corazón": "pz_fig_corazon_es.mp3",
        "Circle": "pz_fig_circle_en.mp3",
        "Square": "pz_fig_square_en.mp3",
        "Triangle": "pz_fig_triangle_en.mp3",
        "Rectangle": "pz_fig_rectangle_en.mp3",
        "Oval": "pz_fig_oval_en.mp3",
        "Diamond": "pz_fig_diamond_en.mp3",
        "Star": "pz_fig_star_en.mp3",
        "Heart": "pz_fig_heart_en.mp3",

        # Claves directas de figuras y objetos
        "fig_instruccion_general": "fig_instruccion_general.mp3",
        "fig_instruccion_circulo": "fig_instruccion_circulo.mp3",
        "fig_instruccion_cuadrado": "fig_instruccion_cuadrado.mp3",
        "fig_instruccion_triangulo": "fig_instruccion_triangulo.mp3",
        "fig_instruccion_rectangulo": "fig_instruccion_rectangulo.mp3",
        "fig_instruccion_ovalo": "fig_instruccion_ovalo.mp3",
        "fig_instruccion_rombo": "fig_instruccion_rombo.mp3",
        "fig_instruccion_estrella": "fig_instruccion_estrella.mp3",
        "fig_instruccion_corazon": "fig_instruccion_corazon.mp3",
        "fig_felicita_circulo": "fig_felicita_circulo.mp3",
        "fig_felicita_cuadrado": "fig_felicita_cuadrado.mp3",
        "fig_felicita_triangulo": "fig_felicita_triangulo.mp3",
        "fig_felicita_rectangulo": "fig_felicita_rectangulo.mp3",
        "fig_felicita_ovalo": "fig_felicita_ovalo.mp3",
        "fig_felicita_rombo": "fig_felicita_rombo.mp3",
        "fig_felicita_estrella": "fig_felicita_estrella.mp3",
        "fig_felicita_corazon": "fig_felicita_corazon.mp3",
        "fig_reto_objetos": "fig_reto_objetos.mp3",
        "fig_obj_cd": "fig_obj_cd.mp3",
        "fig_obj_reloj": "fig_obj_reloj.mp3",
        "fig_obj_pizza": "fig_obj_pizza.mp3",
        "fig_obj_plato": "fig_obj_plato.mp3",
        "fig_obj_chocolate": "fig_obj_chocolate.mp3",
        "fig_obj_ventana": "fig_obj_ventana.mp3",
        "fig_obj_fichas": "fig_obj_fichas.mp3",
        "fig_obj_nota": "fig_obj_nota.mp3",
        "fig_obj_senal_vial": "fig_obj_senal_vial.mp3",
        "fig_obj_queso": "fig_obj_queso.mp3",
        "fig_obj_sandwich": "fig_obj_sandwich.mp3",
        "fig_obj_triangulo_musical": "fig_obj_triangulo_musical.mp3",
        "fig_obj_sobres": "fig_obj_sobres.mp3",
        "fig_obj_celular": "fig_obj_celular.mp3",
        "fig_obj_regla": "fig_obj_regla.mp3",
        "fig_obj_televisor": "fig_obj_televisor.mp3",
        "fig_obj_libro": "fig_obj_libro.mp3",
        "fig_obj_bandeja": "fig_obj_bandeja.mp3",
        "fig_obj_balon": "fig_obj_balon.mp3",
        "fig_obj_huevo": "fig_obj_huevo.mp3",
        "fig_obj_sandia": "fig_obj_sandia.mp3",
        "fig_obj_carta": "fig_obj_carta.mp3",
        "fig_obj_senal_amarilla": "fig_obj_senal_amarilla.mp3",
        "fig_obj_estrella_mar": "fig_obj_estrella_mar.mp3",
        "fig_obj_varita": "fig_obj_varita.mp3",
        "fig_obj_galletas": "fig_obj_galletas.mp3",
        "fig_obj_globos": "fig_obj_globos.mp3",

        # Variaciones de instrucciones de rompecabezas
        "Estaciona cada carrito en su estacionamiento del mismo color. Rojo, Azul, Amarillo, Verde, Naranja y Morado.": "pz_instruccion_colores.mp3",
        "Estaciona cada carrito en su estacionamiento del mismo color. Rojo, Azul, Amarillo, Verde, Naranja y Morado": "pz_instruccion_colores.mp3",
        "Estacionamiento de carritos de colores: estaciona cada carrito en su lugar del mismo color. Rojo, Azul, Amarillo, Verde, Naranja y Morado.": "pz_instruccion_colores.mp3",
        "Rompecabezas de figuras geométricas: coloca cada figura en su silueta.": "pz_instruccion_figuras.mp3",
        "Rompecabezas de figuras geométricas: coloca cada figura en su silueta": "pz_instruccion_figuras.mp3",
        "Rompecabezas de figuras geométricas: coloca el círculo, cuadrado, triángulo, rectángulo, óvalo, rombo, estrella y corazón en su silueta.": "pz_instruccion_figuras.mp3",
        "Rompecabezas de los números: toca cada ficha numérica y colócala en su silueta contando los dibujos en orden.": "pz_instruccion_numeros.mp3",
        "Rompecabezas del cuerpo humano, página cincuenta y nueve: coloca en orden vertical la Cabeza, el Tronco, los Brazos y las Piernas.": "pz_instruccion_cuerpo.mp3",

        # Nociones espaciales con o sin punto final
        "Rodea el ratón que está DETRÁS del queso y pinta el que está DELANTE.": "espacial_detras_delante_es.mp3",
        "Rodea las mariquitas que están ARRIBA de las flores.": "espacial_arriba_abajo_es.mp3",
        "Marca con X el objeto GRANDE y rodea el objeto PEQUEÑO en cada pareja.": "espacial_grande_pequeno_es.mp3",
        "Rodea los recipientes LLENOS y marca con X los que están VACÍOS.": "espacial_lleno_vacio_es.mp3",

        # Dactilopintura con y sin punto final
        "Pon huellitas de pintura ADENTRO de la figura: Manzana.": "dactilo_adentro_manzana_es.mp3",
        "Pon huellitas de pintura AFUERA de la figura: Manzana.": "dactilo_afuera_manzana_es.mp3",
        "Pon huellitas de pintura ADENTRO de la figura: Racimo de Uvas.": "dactilo_adentro_uvas_es.mp3",
        "Pon huellitas de pintura AFUERA de la figura: Racimo de Uvas.": "dactilo_afuera_uvas_es.mp3",
        "Pon huellitas de pintura ADENTRO de la figura: Caballito de Mar.": "dactilo_adentro_caballito_es.mp3",
        "Pon huellitas de pintura AFUERA de la figura: Caballito de Mar.": "dactilo_afuera_caballito_es.mp3",

        # Técnicas de aula y casa por ID y título corto
        "aviso_maestro": "casa_aviso_maestro.mp3",
        "casa_aviso_maestro": "casa_aviso_maestro.mp3",
        "casa_boleado": "casa_boleado.mp3",
        "casa_rasgado": "casa_rasgado.mp3",
        "casa_figuras": "casa_figuras.mp3",
        "casa_dactilopintura": "casa_dactilopintura.mp3",
        "casa_recorte": "casa_recorte.mp3",
        "casa_germinacion": "casa_germinacion.mp3",
        "casa_felicitacion": "casa_felicitacion.mp3",
        "boleado": "casa_boleado.mp3",
        "rasgado": "casa_rasgado.mp3",
        "figuras": "casa_figuras.mp3",
        "dactilopintura": "casa_dactilopintura.mp3",
        "recorte": "casa_recorte.mp3",
        "germinacion": "casa_germinacion.mp3",
        "1. Boleado de Papel Crepé y Juego de Encestar": "casa_boleado.mp3",
        "2. Rasgado, Trozado y Collage Texturizado": "casa_rasgado.mp3",
        "3. Exploradores de Figuras Geométricas": "casa_figuras.mp3",
        "4. Dactilopintura y Trazos Sensoriales en Bandeja": "casa_dactilopintura.mp3",
        "5. Recorte Seguro con Tijera y Rompecabezas": "casa_recorte.mp3",
        "6. Laboratorio Vivo: Germinación y Secuencia de las Plantas": "casa_germinacion.mp3",
        "Water": "plant_water_en.mp3",
        "Seed": "plant_seed_en.mp3",
        "Plant": "plant_plant_en.mp3",
        "Fruit": "plant_fruit_en.mp3",

        # Números directos en español
        "1": "pz_num_1_es.mp3", "2": "pz_num_2_es.mp3", "3": "pz_num_3_es.mp3", "4": "pz_num_4_es.mp3", "5": "pz_num_5_es.mp3",
        "6": "pz_num_6_es.mp3", "7": "pz_num_7_es.mp3", "8": "pz_num_8_es.mp3", "9": "pz_num_9_es.mp3", "10": "pz_num_10_es.mp3",
        # Números directos en inglés
        "One": "pz_num_1_en.mp3", "Two": "pz_num_2_en.mp3", "Three": "pz_num_3_en.mp3", "Four": "pz_num_4_en.mp3", "Five": "pz_num_5_en.mp3",
        "Six": "pz_num_6_en.mp3", "Seven": "pz_num_7_en.mp3", "Eight": "pz_num_8_en.mp3", "Nine": "pz_num_9_en.mp3", "Ten": "pz_num_10_en.mp3",
        # Partes del cuerpo
        "1. Cabeza": "pz_cuerpo_cabeza_es.mp3",
        "2. Tronco": "pz_cuerpo_tronco_es.mp3",
        "3. Brazos y Manos": "pz_cuerpo_brazos_es.mp3",
        "4. Piernas y Pies": "pz_cuerpo_piernas_es.mp3",
        "Head": "pz_cuerpo_head_en.mp3",
        "Trunk": "pz_cuerpo_trunk_en.mp3",
        "Trunk / Torso": "pz_cuerpo_trunk_en.mp3",
        "Arms and hands": "pz_cuerpo_arms_en.mp3",
        "Arms and Hands": "pz_cuerpo_arms_en.mp3",
        "Arms & Hands": "pz_cuerpo_arms_en.mp3",
        "Legs and feet": "pz_cuerpo_legs_en.mp3",
        "Legs and Feet": "pz_cuerpo_legs_en.mp3",
        "Legs & Feet": "pz_cuerpo_legs_en.mp3",
        # Colores en inglés
        "Red": "pz_color_red_en.mp3",
        "Blue": "pz_color_blue_en.mp3",
        "Yellow": "pz_color_yellow_en.mp3",
        "Green": "pz_color_green_en.mp3",
        "Orange": "pz_color_orange_en.mp3",
        "Purple": "pz_color_purple_en.mp3",
        "Violet": "pz_color_violet_en.mp3",
        "Pink": "pz_color_pink_en.mp3",
        "White": "pz_color_white_en.mp3",
        "Black": "pz_color_black_en.mp3",
        # Letras aisladas en inglés (A, E, I, O, U, B, C, D, F, M, P, S, T)
        "A": "letra_a_sola_en.mp3",
        "E": "letra_e_sola_en.mp3",
        "I": "letra_i_sola_en.mp3",
        "O": "letra_o_sola_en.mp3",
        "U": "letra_u_sola_en.mp3",
        "B": "letra_b_sola_en.mp3",
        "C": "letra_c_sola_en.mp3",
        "D": "letra_d_sola_en.mp3",
        "F": "letra_f_sola_en.mp3",
        "M": "letra_m_sola_en.mp3",
        "P": "letra_p_sola_en.mp3",
        "S": "letra_s_sola_en.mp3",
        "T": "letra_t_sola_en.mp3"
    }
    for k, v in aliases.items():
        mapa[k] = v
        mapa[k.lower()] = v
        mapa[limpiar_texto(k)] = v
        mapa[normalizar_clave_busqueda(k)] = v

    # Guardar en JSON
    json_path = os.path.join(AUDIOS_DIR, "mapa-audios.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(mapa, f, ensure_ascii=False, indent=2)
    print(f"Mapa JSON guardado en: {json_path}")

    # Guardar en archivo JS para inclusión directa
    js_path = os.path.join(JS_DIR, "mapa-audios-prebasica.js")
    with open(js_path, "w", encoding="utf-8") as f:
        f.write("/* Mapa de audios pregrabados neuronales MP3 (Dalia / Ana) para Prebásica */\n")
        f.write("window.MAPA_AUDIOS_PREBASICA = ")
        f.write(json.dumps(mapa, ensure_ascii=False, indent=2))
        f.write(";\n")
    print(f"Mapa JS guardado en: {js_path}")

if __name__ == "__main__":
    asyncio.run(main())
