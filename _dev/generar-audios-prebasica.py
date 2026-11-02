#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
generar-audios-prebasica.py
Genera todos los archivos de audio MP3 para la misión:
Prebásica (3.° Grado) · Técnicas Gráficas y No Gráficas — Libro 1
utilizando edge-tts:
- Español: es-MX-DaliaNeural (rate="-6%", pitch="+4Hz")
- Inglés: en-US-AnaNeural (rate="-4%", pitch="+2Hz")

Genera:
- misiones/prebasica-tecnicas-libro1/audios/*.mp3
- misiones/prebasica-tecnicas-libro1/js/mapa-audios-prebasica.js
- misiones/prebasica-tecnicas-libro1/audios/mapa-audios.json
"""

import os
import re
import json
import asyncio
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

# Lista de todos los audios a generar
ITEMS = [
    # --- 1. AVISO PARENTAL IMPERATIVO ---
    {
        "file": "aviso_adulto.mp3",
        "lang": "es",
        "text": "Atención familia: Uso exclusivo con apoyo de un adulto. Esta sección de Prebásica está diseñada para que el padre, madre o encargado trabaje sentado junto al niño. Nunca deje al niño solo con el teléfono o la tablet.",
        "raw": "Atención familia: Uso exclusivo con apoyo de un adulto. Esta sección de Prebásica está diseñada para que el padre, madre o encargado trabaje sentado junto al niño. Nunca deje al niño solo con el teléfono o la tablet."
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

    # --- 4. RODEA Y DESCUBRE: LETRAS (A, E, I, O, U, B, C, M, P, S) ---
    {
        "file": "letra_a_es.mp3",
        "lang": "es",
        "text": "Rodea todas las tarjetas con la vocal A, como Abeja.",
    },
    {
        "file": "letra_a_en.mp3",
        "lang": "en",
        "text": "Circle all the letter A cards! A is for Apple.",
    },
    {
        "file": "letra_e_es.mp3",
        "lang": "es",
        "text": "Rodea todas las tarjetas con la vocal E, como Elefante.",
    },
    {
        "file": "letra_e_en.mp3",
        "lang": "en",
        "text": "Circle all the letter E cards! E is for Elephant.",
    },
    {
        "file": "letra_i_es.mp3",
        "lang": "es",
        "text": "Rodea todas las tarjetas con la vocal I, como Iguana.",
    },
    {
        "file": "letra_i_en.mp3",
        "lang": "en",
        "text": "Circle all the letter I cards! I is for Igloo.",
    },
    {
        "file": "letra_o_es.mp3",
        "lang": "es",
        "text": "Rodea todas las tarjetas con la vocal O, como Oso.",
    },
    {
        "file": "letra_o_en.mp3",
        "lang": "en",
        "text": "Circle all the letter O cards! O is for Octopus.",
    },
    {
        "file": "letra_u_es.mp3",
        "lang": "es",
        "text": "Rodea todas las tarjetas con la vocal U, como Uvas.",
    },
    {
        "file": "letra_u_en.mp3",
        "lang": "en",
        "text": "Circle all the letter U cards! U is for Umbrella.",
    },
    {
        "file": "letra_b_es.mp3",
        "lang": "es",
        "text": "Rodea todas las letras B, como Barco.",
    },
    {
        "file": "letra_b_en.mp3",
        "lang": "en",
        "text": "Circle every letter B! B is for Ball.",
    },
    {
        "file": "letra_c_es.mp3",
        "lang": "es",
        "text": "Rodea todas las letras C, como Casa.",
    },
    {
        "file": "letra_c_en.mp3",
        "lang": "en",
        "text": "Circle every letter C! C is for Cat.",
    },
    {
        "file": "letra_m_es.mp3",
        "lang": "es",
        "text": "Rodea todas las letras M, como Mamá.",
    },
    {
        "file": "letra_m_en.mp3",
        "lang": "en",
        "text": "Circle every letter M! M is for Moon.",
    },
    {
        "file": "letra_p_es.mp3",
        "lang": "es",
        "text": "Rodea todas las letras P, como Pato.",
    },
    {
        "file": "letra_p_en.mp3",
        "lang": "en",
        "text": "Circle every letter P! P is for Pig.",
    },
    {
        "file": "letra_s_es.mp3",
        "lang": "es",
        "text": "Rodea todas las letras S, como Sol.",
    },
    {
        "file": "letra_s_en.mp3",
        "lang": "en",
        "text": "Circle every letter S! S is for Star.",
    },

    # --- 5. RODEA Y DESCUBRE: NÚMEROS (1 al 10 en ES y EN) ---
    {"file": "num_1_es.mp3", "lang": "es", "text": "Rodea todos los números 1, Uno."},
    {"file": "num_1_en.mp3", "lang": "en", "text": "Circle every number 1, One!"},
    {"file": "num_2_es.mp3", "lang": "es", "text": "Rodea todos los números 2, Dos."},
    {"file": "num_2_en.mp3", "lang": "en", "text": "Circle every number 2, Two!"},
    {"file": "num_3_es.mp3", "lang": "es", "text": "Rodea todos los números 3, Tres."},
    {"file": "num_3_en.mp3", "lang": "en", "text": "Circle every number 3, Three!"},
    {"file": "num_4_es.mp3", "lang": "es", "text": "Rodea todos los números 4, Cuatro."},
    {"file": "num_4_en.mp3", "lang": "en", "text": "Circle every number 4, Four!"},
    {"file": "num_5_es.mp3", "lang": "es", "text": "Rodea todos los números 5, Cinco."},
    {"file": "num_5_en.mp3", "lang": "en", "text": "Circle every number 5, Five!"},
    {"file": "num_6_es.mp3", "lang": "es", "text": "Rodea todos los números 6, Seis."},
    {"file": "num_6_en.mp3", "lang": "en", "text": "Circle every number 6, Six!"},
    {"file": "num_7_es.mp3", "lang": "es", "text": "Rodea todos los números 7, Siete."},
    {"file": "num_7_en.mp3", "lang": "en", "text": "Circle every number 7, Seven!"},
    {"file": "num_8_es.mp3", "lang": "es", "text": "Rodea todos los números 8, Ocho."},
    {"file": "num_8_en.mp3", "lang": "en", "text": "Circle every number 8, Eight!"},
    {"file": "num_9_es.mp3", "lang": "es", "text": "Rodea todos los números 9, Nueve."},
    {"file": "num_9_en.mp3", "lang": "en", "text": "Circle every number 9, Nine!"},
    {"file": "num_10_es.mp3", "lang": "es", "text": "Rodea todos los números 10, Diez."},
    {"file": "num_10_en.mp3", "lang": "en", "text": "Circle every number 10, Ten!"},

    # --- 6. RODEA Y DESCUBRE: NOCIONES ESPACIALES ---
    {
        "file": "espacial_detras_delante_es.mp3",
        "lang": "es",
        "text": "Rodea el ratón que está DETRÁS del queso y pinta el que está DELANTE",
    },
    {
        "file": "espacial_detras_delante_en.mp3",
        "lang": "en",
        "text": "Circle the mouse BEHIND the cheese and paint the mouse IN FRONT of the cheese!",
    },
    {
        "file": "espacial_arriba_abajo_es.mp3",
        "lang": "es",
        "text": "Rodea las mariquitas que están ARRIBA de las flores",
    },
    {
        "file": "espacial_arriba_abajo_en.mp3",
        "lang": "en",
        "text": "Circle the ladybugs that are ABOVE the flowers!",
    },
    {
        "file": "espacial_grande_pequeno_es.mp3",
        "lang": "es",
        "text": "Marca con X el objeto GRANDE y rodea el objeto PEQUEÑO en cada pareja",
    },
    {
        "file": "espacial_grande_pequeno_en.mp3",
        "lang": "en",
        "text": "Mark the BIG object with an X and circle the SMALL object!",
    },
    {
        "file": "espacial_lleno_vacio_es.mp3",
        "lang": "es",
        "text": "Rodea los recipientes LLENOS y marca con X los que están VACÍOS",
    },
    {
        "file": "espacial_lleno_vacio_en.mp3",
        "lang": "en",
        "text": "Circle the FULL containers and mark the EMPTY ones with an X!",
    },

    # Dactilopintura instrucciones (Adentro / Afuera)
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
    {
        "file": "dactilo_inside_apple_en.mp3",
        "lang": "en",
        "text": "Stamp colorful fingerprints INSIDE the Apple!",
    },
    {
        "file": "dactilo_outside_apple_en.mp3",
        "lang": "en",
        "text": "Stamp colorful fingerprints OUTSIDE the Apple!",
    },
    {
        "file": "dactilo_inside_grapes_en.mp3",
        "lang": "en",
        "text": "Stamp colorful fingerprints INSIDE the Grapes!",
    },
    {
        "file": "dactilo_outside_grapes_en.mp3",
        "lang": "en",
        "text": "Stamp colorful fingerprints OUTSIDE the Grapes!",
    },
    {
        "file": "dactilo_inside_seahorse_en.mp3",
        "lang": "en",
        "text": "Stamp colorful fingerprints INSIDE the Seahorse!",
    },
    {
        "file": "dactilo_outside_seahorse_en.mp3",
        "lang": "en",
        "text": "Stamp colorful fingerprints OUTSIDE the Seahorse!",
    },

    # --- 7. PESTAÑA 3: ROMPECABEZAS (INSTRUCCIONES Y FELICITACIÓN) ---
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
        "text": "Color Matching Car Park: estaciona cada carrito en su color en español e inglés. Red Rojo, Blue Azul, Yellow Amarillo, Green Verde, Orange Naranja, Violet Morado.",
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

    # --- 8. ROMPECABEZAS: FICHAS INDIVIDUALES AL TOCARLAS ---
    # Números 1 al 10 (es + en)
    {"file": "pz_num_1.mp3", "lang": "es", "text": "Uno. One"},
    {"file": "pz_num_2.mp3", "lang": "es", "text": "Dos. Two"},
    {"file": "pz_num_3.mp3", "lang": "es", "text": "Tres. Three"},
    {"file": "pz_num_4.mp3", "lang": "es", "text": "Cuatro. Four"},
    {"file": "pz_num_5.mp3", "lang": "es", "text": "Cinco. Five"},
    {"file": "pz_num_6.mp3", "lang": "es", "text": "Seis. Six"},
    {"file": "pz_num_7.mp3", "lang": "es", "text": "Siete. Seven"},
    {"file": "pz_num_8.mp3", "lang": "es", "text": "Ocho. Eight"},
    {"file": "pz_num_9.mp3", "lang": "es", "text": "Nueve. Nine"},
    {"file": "pz_num_10.mp3", "lang": "es", "text": "Diez. Ten"},

    # Cuerpo humano (Pág. 59)
    {"file": "pz_cuerpo_cabeza.mp3", "lang": "es", "text": "1. Cabeza. Head"},
    {"file": "pz_cuerpo_tronco.mp3", "lang": "es", "text": "2. Tronco. Trunk / Torso"},
    {"file": "pz_cuerpo_brazos.mp3", "lang": "es", "text": "3. Brazos y Manos. Arms & Hands"},
    {"file": "pz_cuerpo_piernas.mp3", "lang": "es", "text": "4. Piernas y Pies. Legs & Feet"},

    # Car Park Colores
    {"file": "pz_color_red.mp3", "lang": "es", "text": "Rojo, Red"},
    {"file": "pz_color_blue.mp3", "lang": "es", "text": "Azul, Blue"},
    {"file": "pz_color_yellow.mp3", "lang": "es", "text": "Amarillo, Yellow"},
    {"file": "pz_color_green.mp3", "lang": "es", "text": "Verde, Green"},
    {"file": "pz_color_orange.mp3", "lang": "es", "text": "Naranja, Orange"},
    {"file": "pz_color_violet.mp3", "lang": "es", "text": "Morado, Violet"},

    # Figuras Geométricas
    {"file": "pz_fig_circulo.mp3", "lang": "es", "text": "Círculo, Circle"},
    {"file": "pz_fig_cuadrado.mp3", "lang": "es", "text": "Cuadrado, Square"},
    {"file": "pz_fig_triangulo.mp3", "lang": "es", "text": "Triángulo, Triangle"},
    {"file": "pz_fig_rectangulo.mp3", "lang": "es", "text": "Rectángulo, Rectangle"},
    {"file": "pz_fig_ovalo.mp3", "lang": "es", "text": "Óvalo, Oval"},
    {"file": "pz_fig_rombo.mp3", "lang": "es", "text": "Rombo, Diamond"},
    {"file": "pz_fig_estrella.mp3", "lang": "es", "text": "Estrella, Star"},
    {"file": "pz_fig_corazon.mp3", "lang": "es", "text": "Corazón, Heart"},

    # --- 9. PESTAÑA 4: MANOS A LA OBRA EN CASA (6 TÉCNICAS FÍSICAS + FELICITACIÓN) ---
    {
        "file": "casa_estrujado.mp3",
        "lang": "es",
        "text": "1. Estrujado y Arrugado de Papel. Beneficio: Fuerza palmar y tono muscular de la mano. Materiales: Papel periódico, papel reciclado, papel bond o papel china.. Pasos: Entregue al niño media hoja de papel periódico o reciclado. Pídale que la apriete con ambas manos y luego con una sola mano hasta formar una pelota bien compacta. Jueguen a encestar las pelotas de papel arrugado dentro de una caja o cesto.. Supervise que el niño no se lleve trocitos de papel a la boca.",
        "raw": "1. Estrujado y Arrugado de Papel. Beneficio: 💪 Fuerza palmar y tono muscular de la mano. Materiales: Papel periódico, papel reciclado, papel bond o papel china.. Pasos: Entregue al niño media hoja de papel periódico o reciclado. Pídale que la apriete con ambas manos y luego con una sola mano hasta formar una pelota bien compacta. Jueguen a encestar las pelotas de papel arrugado dentro de una caja o cesto.. Supervise que el niño no se lleve trocitos de papel a la boca."
    },
    {
        "file": "casa_rasgado.mp3",
        "lang": "es",
        "text": "2. Rasgado de Papel (Adentro y Afuera). Beneficio: Coordinación bimanual y freno inhibitorio. Materiales: Papel lustre, revista o papel construcción y pegamento escolar en barra.. Pasos: Enseñe al niño a tomar el papel con los dedos pulgar e índice de ambas manos (pinza digital). Una mano tira hacia adelante y la otra hacia atrás para rasgar tiras y luego cuadritos pequeños. Peguen los papelitos rasgados ADENTRO o AFUERA de una figura dibujada en una hoja, tal como indica el Libro 1.. Use pegamento escolar no tóxico y lávense las manos al terminar.",
        "raw": "2. Rasgado de Papel (Adentro y Afuera). Beneficio: 🤲 Coordinación bimanual y freno inhibitorio. Materiales: Papel lustre, revista o papel construcción y pegamento escolar en barra.. Pasos: Enseñe al niño a tomar el papel con los dedos pulgar e índice de ambas manos (pinza digital). Una mano tira hacia adelante y la otra hacia atrás para rasgar tiras y luego cuadritos pequeños. Peguen los papelitos rasgados ADENTRO o AFUERA de una figura dibujada en una hoja, tal como indica el Libro 1.. Use pegamento escolar no tóxico y lávense las manos al terminar."
    },
    {
        "file": "casa_boleado.mp3",
        "lang": "es",
        "text": "3. Boleado con Índice y Pulgar. Beneficio: Pinza fina digital previa a tomar el lápiz. Materiales: Cuadritos pequeños de papel china (papel seda) o papel crepé y pegamento.. Pasos: Corte cuadritos de papel china de unos 3×3 cm. Pídale al niño que forme pelotitas chiquitas girando el papel EXCLUSIVAMENTE con las yemas del dedo índice y el pulgar (sin frotar con las palmas). Peguen las bolitas siguiendo el contorno de una letra, número o dibujo.. Cuide que el niño use solo índice y pulgar; si se cansa, hagan pausas cortas.",
        "raw": "3. Boleado con Índice y Pulgar. Beneficio: 🤏 Pinza fina digital previa a tomar el lápiz. Materiales: Cuadritos pequeños de papel china (papel seda) o papel crepé y pegamento.. Pasos: Corte cuadritos de papel china de unos 3×3 cm. Pídale al niño que forme pelotitas chiquitas girando el papel EXCLUSIVAMENTE con las yemas del dedo índice y el pulgar (sin frotar con las palmas). Peguen las bolitas siguiendo el contorno de una letra, número o dibujo.. Cuide que el niño use solo índice y pulgar; si se cansa, hagan pausas cortas."
    },
    {
        "file": "casa_dactilopintura.mp3",
        "lang": "es",
        "text": "4. Dactilopintura con Témpera Real. Beneficio: Sensopercepción táctil y control del espacio gráfico. Materiales: Témperas lavables no tóxicas, plato plástico, hoja blanca y trapito húmedo.. Pasos: Coloque poquita témpera de colores primarios (rojo, azul, amarillo) en un platito. Pídale al niño que moje solo la yema de su dedo índice y estampe huellitas dentro de una manzana, uvas o caballito de mar dibujado en papel. Descubran juntos qué pasa al mezclar amarillo + azul (verde) o rojo + amarillo (naranja).. Utilice únicamente pintura lavable infantil no tóxica.",
        "raw": "4. Dactilopintura con Témpera Real. Beneficio: 🎨 Sensopercepción táctil y control del espacio gráfico. Materiales: Témperas lavables no tóxicas, plato plástico, hoja blanca y trapito húmedo.. Pasos: Coloque poquita témpera de colores primarios (rojo, azul, amarillo) en un platito. Pídale al niño que moje solo la yema de su dedo índice y estampe huellitas dentro de una manzana, uvas o caballito de mar dibujado en papel. Descubran juntos qué pasa al mezclar amarillo + azul (verde) o rojo + amarillo (naranja).. Utilice únicamente pintura lavable infantil no tóxica."
    },
    {
        "file": "casa_punzado.mp3",
        "lang": "es",
        "text": "5. Punzado Seguro con Foamy Debajo. Beneficio: Prensión trípode y precisión óculo-manual. Materiales: Hoja con dibujo, una lámina de foamy grueso (o cartón/toalla doblada) debajo y punzón plástico infantil o lápiz de punta gruesa.. Pasos: Coloque el foamy o cartón debajo de la hoja de papel sobre la mesa. El niño sujeta el punzón plástico como si fuera un lápiz (con pulgar, índice y cordial) y hace piquitos seguidos sobre la línea del dibujo. Al terminar, levanten la hoja contra la luz para ver cómo brilla la silueta perforada.. SUPERVISIÓN DIRECTA OBLIGATORIA: Nunca use agujas ni objetos metálicos filosos. Use punzón escolar plástico de punta roma.",
        "raw": "5. Punzado Seguro con Foamy Debajo. Beneficio: 📌 Prensión trípode y precisión óculo-manual. Materiales: Hoja con dibujo, una lámina de foamy grueso (o cartón/toalla doblada) debajo y punzón plástico infantil o lápiz de punta gruesa.. Pasos: Coloque el foamy o cartón debajo de la hoja de papel sobre la mesa. El niño sujeta el punzón plástico como si fuera un lápiz (con pulgar, índice y cordial) y hace piquitos seguidos sobre la línea del dibujo. Al terminar, levanten la hoja contra la luz para ver cómo brilla la silueta perforada.. ⚠️ SUPERVISIÓN DIRECTA OBLIGATORIA: Nunca use agujas ni objetos metálicos filosos. Use punzón escolar plástico de punta roma."
    },
    {
        "file": "casa_recorte.mp3",
        "lang": "es",
        "text": "6. Recorte con Tijeras de Punta Redonda. Beneficio: Coordinación visomotriz y fuerza disociada de dedos. Materiales: Tijera escolar infantil de punta redonda y tiras de papel con líneas rectas, zig-zag y curvas.. Pasos: Verifique la postura: dedo pulgar arriba mirando al techo («el pulgar siempre mira al sol»). Empiecen practicando pequeños flecos en el borde de una tira de papel. Luego recorten siguiendo líneas rectas, después líneas quebradas (zig-zag) y finalmente líneas curvas.. Uso exclusivo de tijeras escolares de punta redonda con el adulto sentado al lado.",
        "raw": "6. Recorte con Tijeras de Punta Redonda. Beneficio: ✂️ Coordinación visomotriz y fuerza disociada de dedos. Materiales: Tijera escolar infantil de punta redonda y tiras de papel con líneas rectas, zig-zag y curvas.. Pasos: Verifique la postura: dedo pulgar arriba mirando al techo («el pulgar siempre mira al sol»). Empiecen practicando pequeños flecos en el borde de una tira de papel. Luego recorten siguiendo líneas rectas, después líneas quebradas (zig-zag) y finalmente líneas curvas.. ⚠️ Uso exclusivo de tijeras escolares de punta redonda con el adulto sentado al lado."
    },
    {
        "file": "casa_felicitacion.mp3",
        "lang": "es",
        "text": "¡Felicidades familia! Una técnica más del libro realizada en casa con papel y manos creativas.",
    }
]

async def generar_un_audio(sem, item, total, idx):
    async with sem:
        outfile = os.path.join(AUDIOS_DIR, item["file"])
        if os.path.exists(outfile) and os.path.getsize(outfile) > 1000:
            print(f"[{idx+1}/{total}] Ya existe: {item['file']} ({os.path.getsize(outfile)} bytes)")
            return True

        voice = VOICE_EN if item["lang"] == "en" else VOICE_ES
        rate = RATE_EN if item["lang"] == "en" else RATE_ES
        pitch = PITCH_EN if item["lang"] == "en" else PITCH_ES

        # Texto a vocalizar (sin emojis)
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

    print(f"=== Generando {len(ITEMS)} audios neuronales para Prebásica (Libro 1) ===")
    sem = asyncio.Semaphore(4)  # Concurrencia controlada
    tasks = [generar_un_audio(sem, item, len(ITEMS), idx) for idx, item in enumerate(ITEMS)]
    results = await asyncio.gather(*tasks)

    success_count = sum(1 for r in results if r)
    print(f"\nResultado generación: {success_count}/{len(ITEMS)} archivos listos.")

    # Construir mapa de asociación (normalizado y raw)
    mapa = {}
    for item in ITEMS:
        filename = item["file"]
        # Clave limpia normalizada
        clean_key = limpiar_texto(item["text"])
        mapa[clean_key] = filename

        # Si había texto raw con emojis o pequeñas variaciones, registrarlo también
        if "raw" in item:
            mapa[item["raw"]] = filename
            mapa[limpiar_texto(item["raw"])] = filename

        # Registrar también en minúsculas por si acaso
        mapa[clean_key.lower()] = filename

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
