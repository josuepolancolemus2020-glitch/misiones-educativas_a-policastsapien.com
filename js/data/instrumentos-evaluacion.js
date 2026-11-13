/* ════════════════════════════════════════════════════════════════════
   📏 HERRAMIENTAS DE EVALUACIÓN · las plantillas
   ────────────────────────────────────────────────────────────────────
   Las hojas con que el maestro califica una actividad: el punto de
   partida, que él cambia a su gusto antes de imprimir. Viven aquí y no en
   js/tools/herramientas-evaluacion.js porque son DATOS que se pintan en
   pantalla y en papel, y un dato se escribe en un solo sitio.

   Tres formas, porque se califican tres cosas distintas:

   · `actividades`: cada actividad lleva su nota a mano. Si `calculo` es
     'promedio', cada una vale 100 % y la final es el promedio (así
     califica el maestro que pidió la herramienta: el Himno de 6º-1). Si
     es 'suma', cada una vale sus puntos y la final es la suma.
   · `rubrica`: cada criterio se califica de 4 a 1 y cada nivel dice lo
     que se VE. Una rúbrica con «excelente, bueno, regular» no dice nada:
     dos maestros califican distinto al mismo niño y el niño no sabe qué
     le faltó.
   · `cotejo`: sí o no por criterio. Para lo que se cumple o no se cumple.

   Ninguna plantilla afirma porcentajes de la norma: el Reglamento de
   Evaluación no está en _dev/leyes/, y lo que no se puede acreditar no
   se imprime como si fuera oficial.
   ════════════════════════════════════════════════════════════════════ */

/* Los cuatro niveles de una rúbrica. En palabras que el niño entiende,
   porque la rúbrica también se le devuelve a él. */
const HE_NIVELES = [
  { pts: 4, nombre: 'Lo logra muy bien' },
  { pts: 3, nombre: 'Lo logra' },
  { pts: 2, nombre: 'Lo logra en parte' },
  { pts: 1, nombre: 'Todavía no' }
];

const HE_PLANTILLAS = [
  {
    clave: 'himno', icono: '🇭🇳', nombre: 'Himno Nacional',
    tipo: 'actividades', calculo: 'promedio',
    titulo: 'Evaluación del Himno Nacional', materia: 'Ciencias Sociales',
    criterios: [
      { t: 'Recitar una estrofa al azar del Himno Nacional' },
      { t: 'Prueba escrita de las que están en la plataforma' },
      { t: 'Cantar el Himno Nacional completo' },
      { t: 'Escribir el coro verso a verso y la séptima estrofa (la que se canta a diario)' },
      { t: 'Explicar qué tema trata cada estrofa y qué significa lo que declamó' }
    ]
  },
  {
    clave: 'exposicion', icono: '🎤', nombre: 'Exposición oral',
    tipo: 'rubrica', titulo: 'Exposición oral', materia: '',
    criterios: [
      { t: 'Dominio del tema', d: [
        'Explica con sus palabras y responde las preguntas',
        'Explica el tema y responde casi todas las preguntas',
        'Lee buena parte o se le olvidan ideas importantes',
        'Solo lee o no logra explicar el tema'] },
      { t: 'Voz y claridad', d: [
        'Se le oye desde el fondo y pronuncia claro',
        'Se le oye bien casi todo el tiempo',
        'Hay que pedirle que hable más alto',
        'Casi no se le oye ni se le entiende'] },
      { t: 'Orden de las ideas', d: [
        'Tiene inicio, desarrollo y cierre',
        'Sigue un orden con algún salto',
        'Las ideas van sueltas',
        'No se entiende el orden'] },
      { t: 'Material de apoyo', d: [
        'Su cartel o lámina ayuda a entender',
        'Usa material y lo señala alguna vez',
        'Trae material pero no lo usa',
        'No trae material'] },
      { t: 'Tiempo y respeto', d: [
        'Termina a tiempo y escucha a los demás',
        'Se pasa un poco o se distrae un poco',
        'Se pasa mucho o interrumpe',
        'No termina o no deja exponer a otros'] }
    ]
  },
  {
    clave: 'lectura', icono: '📖', nombre: 'Lectura en voz alta',
    tipo: 'rubrica', titulo: 'Lectura en voz alta', materia: 'Español',
    criterios: [
      { t: 'Fluidez', d: [
        'Lee de corrido, sin silabear',
        'Lee de corrido con pocas paradas',
        'Lee palabra por palabra',
        'Silabea casi todo el texto'] },
      { t: 'Pronunciación', d: [
        'Pronuncia bien todas las palabras',
        'Se equivoca en pocas palabras',
        'Se equivoca en varias palabras',
        'Cambia o salta muchas palabras'] },
      { t: 'Pausas y entonación', d: [
        'Respeta comas, puntos, preguntas y exclamaciones',
        'Respeta casi todos los signos',
        'Respeta solo los puntos',
        'Lee sin pausas ni entonación'] },
      { t: 'Volumen', d: [
        'Se le oye desde el fondo',
        'Se le oye bien casi siempre',
        'Hay que pedirle más volumen',
        'Casi no se le oye'] },
      { t: 'Comprensión', d: [
        'Cuenta lo leído y responde todas las preguntas',
        'Responde la mayoría de las preguntas',
        'Responde alguna pregunta',
        'No logra contar lo que leyó'] }
    ]
  },
  {
    clave: 'maqueta', icono: '🏗️', nombre: 'Maqueta o cartel',
    tipo: 'rubrica', titulo: 'Maqueta o cartel', materia: '',
    criterios: [
      { t: 'Contenido', d: [
        'Todo lo que muestra es correcto y está completo',
        'Es correcto con algún detalle que falta',
        'Tiene errores o faltan partes importantes',
        'No muestra el tema pedido'] },
      { t: 'Explica su trabajo', d: [
        'Explica cada parte y responde preguntas',
        'Explica casi todas las partes',
        'Explica poco',
        'No logra explicarlo'] },
      { t: 'Creatividad', d: [
        'Usa materiales o ideas propias que ayudan a entender',
        'Tiene alguna idea propia',
        'Copia un modelo sin cambios',
        'Está hecho sin cuidado'] },
      { t: 'Orden y limpieza', d: [
        'Limpio, con letra clara y rótulos',
        'Limpio con algún detalle',
        'Con manchas o letra difícil de leer',
        'Desordenado y sin rótulos'] },
      { t: 'Entrega', d: [
        'Lo entrega el día acordado',
        'Lo entrega un día después',
        'Lo entrega varios días después',
        'No lo entrega'] }
    ]
  },
  {
    clave: 'equipo', icono: '🤝', nombre: 'Trabajo en equipo',
    tipo: 'cotejo', titulo: 'Trabajo en equipo', materia: '',
    criterios: [
      { t: 'Cumple la tarea que le tocó' },
      { t: 'Escucha a sus compañeros' },
      { t: 'Aporta ideas' },
      { t: 'Respeta los turnos' },
      { t: 'Ayuda a terminar a tiempo' }
    ]
  },
  {
    clave: 'cuaderno', icono: '📒', nombre: 'Revisión de cuaderno',
    tipo: 'cotejo', titulo: 'Revisión de cuaderno', materia: '',
    criterios: [
      { t: 'Clases completas' },
      { t: 'Fecha y título en cada clase' },
      { t: 'Tareas resueltas' },
      { t: 'Letra que se lee' },
      { t: 'Ordenado y limpio' }
    ]
  },
  {
    clave: 'blanco', icono: '✏️', nombre: 'Hoja en blanco',
    tipo: 'actividades', calculo: 'promedio',
    titulo: 'Evaluación', materia: '',
    criterios: [
      { t: 'Actividad 1' },
      { t: 'Actividad 2' },
      { t: 'Actividad 3' }
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) module.exports = { HE_PLANTILLAS, HE_NIVELES };
