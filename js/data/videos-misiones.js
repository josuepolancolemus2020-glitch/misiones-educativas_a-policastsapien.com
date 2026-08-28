/* =====================================================================
   M.E.T.A.S — js/data/videos-misiones.js
   EL CATÁLOGO DE VIDEOS: la capa permanente, la que vive en el
   repositorio.

   POR QUÉ HAY CATÁLOGO SI YA HAY NUBE
   -----------------------------------
   Los videos de una misión se pegan desde F.A.R.O y viajan por la nube:
   eso es lo que permite añadir uno de noche, desde la tableta, y que
   aparezca en el teléfono del alumno a la mañana siguiente sin
   desplegar nada.

   Pero la nube pone los videos HOY. El catálogo los deja ESCRITOS, y
   eso es otra cosa:

     · funcionan sin haber corrido el SQL —o sea, desde el primer día—;
     · funcionan si el proyecto de Supabase cambia, se agota o se cae;
     · quedan en el historial de git, así que se sabe quién puso qué y
       cuándo, y se puede volver atrás;
     · los ve quien clona el repositorio y nunca toca la nube.

   Es el mismo reparto que ya tiene la repisa de enlaces de F.A.R.O
   (regla 4 de su normativa): la nube para lo de hoy, el catálogo para
   lo permanente. El ascenso de uno a otro lo hace el botón 📋 de la
   herramienta 🎬 Videos M.E.T.A.S de F.A.R.O, que escupe el bloque ya
   escrito para pegarlo aquí. No se teclea a mano.

   CÓMO SE FUSIONAN LAS DOS CAPAS
   ------------------------------
   Manda la nube: si un video está en los dos sitios con el mismo `id`,
   se usa el de la nube. Así se corrige un título o se recorta un trozo
   desde la tableta sin esperar a un despliegue. Lo que solo está aquí,
   se ve igual. Lo hace `js/videos-mision.js`.

   LA FORMA DE CADA VIDEO
   ----------------------
     {
       id:     'v-frac-01',   identificador nuestro, estable y único
                              DENTRO de la misión. Es la llave con la
                              que la nube pisa a esta lista, así que no
                              se reutiliza ni se recicla.
       yt:     'dQw4w9WgXcQ', los ONCE caracteres de YouTube. Ni la
                              dirección entera, ni el enlace de
                              compartir: ver la nota de abajo, que es la
                              regla más importante de todo esto.
       titulo: 'Qué es una fracción',
       nota:   'Mira del minuto 2 al 5.',   lo que le dice el maestro.
                                            Puede ir vacío.
       dura:   '6:12',        para que el alumno sepa en qué se mete
                              antes de tocar. Puede ir vacío.
       canal:  'Smile and Learn',   de quién es. Puede ir vacío.
       ini:    0,             segundo en el que empieza (0 = desde el
                              principio). Recortar es la defensa más
                              barata contra los anuncios y la paja.
       fin:    0,             segundo en el que para (0 = hasta el
                              final).

       preguntas: [           OPCIONAL. El quiz del propio video: salen
         { p: '¿Cuál es el denominador?',   al terminarlo, en vez de
           ops: ['El de abajo',             mandar al alumno al Quiz de
                 'El de arriba'],           la misión —que pregunta por
           ok: 0 }                          el tema entero y se lo lleva
       ]                                    de la sección sin comprobar
                              nada—. Máximo tres, y `ok` es el ÍNDICE de
                              la correcta, NUNCA su texto: si fuera el
                              texto, corregirle una tilde a la opción
                              dejaría la pregunta sin respuesta buena y
                              nadie se enteraría hasta que un niño la
                              fallara.
     }

   ⚠️ LA REGLA QUE NO SE PUEDE SALTAR: EN `yt` VAN ONCE CARACTERES
   ---------------------------------------------------------------
   No una dirección. Nunca una dirección.

   Ese dato acaba DENTRO del `src` de un `<iframe>`, que es el peor
   sitio del HTML donde puede acabar algo escrito por una persona: una
   comilla cierra el atributo y lo que siga se convierte en un atributo
   de verdad. La normativa de la casa dice que ningún dato de estas
   tablas se interpola dentro de un atributo, y aquí no hay forma de
   evitarlo... salvo quitándole al dato la capacidad de hacer daño.

   De eso se trata: el identificador de YouTube son once caracteres del
   alfabeto [A-Za-z0-9_-]. Ahí dentro no hay comillas, ni espacios, ni
   dos puntos, ni barras. `javascript:` NO SE PUEDE ESCRIBIR. La
   inyección deja de ser algo contra lo que uno se defiende y pasa a ser
   algo que no se puede expresar.

   Lo comprueban tres sitios y los tres hacen falta: este archivo por
   convenio, `vmId()` en `js/videos-mision.js` antes de pintar, y el
   `check` de la columna `yt_id` en el SQL de F.A.R.O. La pantalla no
   puede fiarse de la base y la base no puede fiarse de la pantalla.

   CÓMO SE SACAN LOS ONCE CARACTERES
   ---------------------------------
     https://www.youtube.com/watch?v=dQw4w9WgXcQ   → dQw4w9WgXcQ
     https://youtu.be/dQw4w9WgXcQ                  → dQw4w9WgXcQ
     https://www.youtube.com/shorts/dQw4w9WgXcQ    → dQw4w9WgXcQ
   Y lo hace sola la herramienta de F.A.R.O al pegar el enlace: también
   saca los segundos del `&t=` y los pone en `ini`.

   ⚠️ NO SE INVENTAN IDENTIFICADORES. Un identificador escrito de
   memoria o «que suena bien» no da un error: da OTRO VIDEO, y ese otro
   video se lo pone delante a un niño de sexto sin que nadie lo revise.
   Cada uno se pega desde el enlace real y se mira con el botón
   «Comprobar» de F.A.R.O antes de publicarlo.
   ===================================================================== */

var VIDEOS_MISIONES = {

  /* ── CÓMO SE LEE ESTA LISTA ───────────────────────────────────────
     La clave es la CARPETA de la misión, igual que en las Sugerencias.

     Las listas van vacías a propósito: los videos los pega el
     administrador desde F.A.R.O y los sube aquí con el botón 📋 cuando
     ya los ha visto enteros. Mientras tanto la sección se ve, dice la
     verdad («todavía no hay videos puestos») y no enseña nada sin
     revisar.

     Un ejemplo de cómo queda una vez llena, para no tener que buscarlo:

       '2y3ciclo-fracciones': [
         { id: 'v-frac-01', yt: 'dQw4w9WgXcQ',
           titulo: '¿Qué es una fracción?',
           nota:   'Míralo antes del Quiz. Del minuto 0 al 4.',
           dura:   '4:05', canal: 'Smile and Learn', ini: 0, fin: 245,
           preguntas: [
             { p: '¿Qué indica el denominador?',
               ops: ['En cuántas partes se dividió', 'Cuántas se tomaron'], ok: 0 }
           ] }
       ],
  */
  /* ── MATEMÁTICAS ──────────────────────────────────────────────────
     Las veinte misiones de la materia, todas con su pestaña 🎬 Videos
     montada. Estar aquí con la lista vacía NO es un olvido: es lo que
     dice que la sección está puesta y esperando video, y le da al
     administrador el renglón donde pegar lo que le escupe el botón 📋
     de F.A.R.O.

     Y la clave es la CARPETA de cada misión, una por una. Es la trampa
     de la regla 8: al copiar el bloque de una misión a otra se hereda
     la clave, y dos misiones acabarían enseñando los mismos videos —el
     alumno de Ángulos viendo la explicación de las fracciones—. Aquí se
     ven las veinte juntas, que es donde una repetida se nota. */
  '1ciclo-segundo-grado':                            [],   /* Números Grandes: del Cien al Millón */
  '2y3ciclo-angulo-bisectriz':                       [],   /* Ángulos y Bisectriz */
  '2y3ciclo-numeros-decimales':                      [],   /* Números Decimales */
  '2y3ciclo-division-decimales':                     [],   /* División de Decimales */
  'mat-2y3ciclo-area-circulo-y-poligonos-regulares': [],   /* Área de Círculos y Polígonos */
  '2y3ciclo-fracciones':                             [],   /* Las Fracciones */
  '2ciclo-valor-posicional':                         [],   /* Valor Posicional hasta el Millón */
  '2ciclo-potencias-raices':                         [],   /* Potencias y Raíces Cuadradas */
  '2ciclo-teoria-numeros':                           [],   /* Teoría de Números: Divisibilidad, m.c.m. y M.C.D. */
  '2ciclo-recta-numerica':                           [],   /* Recta Numérica, Suma y Resta */
  '2ciclo-multiplos-divisores-primos':               [],   /* Múltiplos, Divisores y Primos */
  '2ciclo-angulos-basicos':                          [],   /* Ángulos: Tipos y Transportador */
  '2ciclo-multiplicacion-vertical':                  [],   /* Multiplicación Vertical */
  '2ciclo-perimetro-cuadrilateros':                  [],   /* Perímetro y Área de Cuadriláteros */
  '2ciclo-area-poligonos-regulares':                 [],   /* Área de Polígonos Regulares */
  '2ciclo-fracciones-multiplicar-dividir':           [],   /* Multiplicación y División de Fracciones */
  '2ciclo-multiplicacion-decimales':                 [],   /* Multiplicación de Decimales */
  '2ciclo-solidos-geometricos':                      [],   /* Sólidos Geométricos */
  '2ciclo-volumen-cuerpos':                          [],   /* Volumen de Cuerpos: cubos, prismas y cilindros */
  '2ciclo-numeracion-maya':                          []   /* Numeración y Calendario Mayas */

};

/* Que funcione tal cual dentro de una página y también cargado por una
   sonda de node, igual que hace js/data/misiones.js. */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { VIDEOS_MISIONES: VIDEOS_MISIONES };
}
