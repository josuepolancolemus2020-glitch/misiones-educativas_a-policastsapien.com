/* ═══════════════════════════════════════════════════════════════════════════
   M.E.T.A.S · Las actividades de DESCUBRIMIENTO de la Ruta de la Máquina que
   Aprende: los datos y las cuentas que las sostienen.

   POR QUÉ ESTÁN AQUÍ Y NO DENTRO DE CADA MISIÓN: cada una de estas
   actividades AFIRMA algo («muévela un puntito y dice otra cosa», «con un
   solo ejemplo acierta la mitad», «hasta el quinto ejemplo caben dos
   reglas»), y una afirmación que la pantalla no cumple enseña a no creerle a
   la pantalla —es lo que costó rehacer entero el «Enséñale a la máquina»—.
   Por eso las cuentas viven en un archivo que también corre en Node, como
   `js/3d/nube-ia.js`: la sonda `_dev/verifica-descubre-ia.js` las recalcula
   con ESTE mismo código y comprueba que lo que la misión promete sea lo que
   pasa. Ninguna de estas funciones toca el DOM, a propósito.

   Y ninguna necesita señal: todo corre dentro del teléfono. Aquí no se manda
   a ningún alumno a una IA en línea (la normativa de la materia).

   Lo que hay, etapa por etapa:

   · Etapa 1 · 👀 La máquina ve puntitos — un dibujo de 6 × 6 comparado
     puntito a puntito con tres recuerdos (vecino más cercano sobre píxeles).
   · Etapa 1 · 🐾 El adivinador de animales — un árbol de preguntas escrito
     por una persona, y tres animales en los que esa persona no pensó.
   · Etapa 2 · 🎯 Tú eres la máquina — reglas ocultas que el alumno saca de
     los ejemplos, y una ronda donde caben dos reglas hasta el quinto.
   · Etapa 2 · 📈 ¿Cuántos ejemplos hacen falta? — la exactitud del vecino
     más cercano con 1, 2, 5, 10, 20 y 50 ejemplos, sobre datos sembrados.
   · Etapa 3 · 🗓️ ¿Cuánto tardó? — pares de hitos de `ia-historia.js`; los
     años salen de allí, aquí solo se dice cuáles se emparejan.
   · Etapa 4 · 🕵️ ¿Se puede comprobar? — textos escritos PARA el ejercicio,
     afirmación por afirmación: cuál trae con qué comprobarse y cuál no.
   · Etapa 4 · 🔮 Escenarios por venir — cuatro situaciones inventadas para
     pensar, con una persona, un precio y lo que pasa con cada decisión.

   Lo que NO hay, y a propósito: ni un nombre de producto, ni una cifra que
   envejezca, ni una afirmación sobre el mundo que no se pueda acreditar. Los
   escenarios y los textos van declarados como inventados en la propia
   pantalla, igual que los porcentajes del predictor de la etapa 4.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Etapa 1 · 👀 La máquina ve puntitos ──────────────────────────────────
   Tres recuerdos de 6 × 6. La máquina compara el dibujo del niño con cada
   uno CONTANDO LOS PUNTITOS IGUALES —también los vacíos— y se queda con el
   que más coincide. Eso es lo que hace el vecino más cercano sobre píxeles,
   y de ahí salen las dos sorpresas que la actividad enseña: que un dibujo
   movido UNA casilla deja de parecerse (compara posición por posición), y
   que una cuadrícula vacía se parece muchísimo a la raya (coinciden todos
   los vacíos). Las dos son verdad y la sonda las recalcula. */
const IA_PIX_LADO = 6;
const IA_PIX_RECUERDOS = [
  { k: 'cruz', e: '✚', n: 'una cruz', filas: ['..#...', '..#...', '######', '..#...', '..#...', '..#...'] },
  { k: 'aro',  e: '◯', n: 'un aro',   filas: ['......', '.####.', '.#..#.', '.#..#.', '.####.', '......'] },
  { k: 'raya', e: '▬', n: 'una raya', filas: ['......', '......', '######', '......', '......', '......'] },
];
/* De las seis filas escritas a mano a la lista de 36 unos y ceros. */
function iaPixDeFilas(filas) {
  const out = [];
  filas.forEach(f => { for (let i = 0; i < IA_PIX_LADO; i++) out.push(f[i] === '#' ? 1 : 0); });
  return out;
}
/* Cuántos puntitos son iguales entre dos dibujos (de 0 a 36). */
function iaPixParecido(a, b) {
  let n = 0;
  for (let i = 0; i < a.length; i++) if ((a[i] ? 1 : 0) === (b[i] ? 1 : 0)) n++;
  return n;
}
/* La respuesta de la máquina: el recuerdo que más coincide, y todos con su
   cuenta, de mayor a menor. Contesta SIEMPRE, aunque no se parezca a nada:
   esa es la lección. En empate gana el primero de la lista. */
function iaPixAdivina(dibujo) {
  const todos = IA_PIX_RECUERDOS.map(r => ({ k: r.k, e: r.e, n: r.n, coincide: iaPixParecido(dibujo, iaPixDeFilas(r.filas)) }));
  const orden = todos.slice().sort((x, y) => y.coincide - x.coincide);
  return { mejor: orden[0], todos: orden, total: IA_PIX_LADO * IA_PIX_LADO };
}
/* El mismo dibujo, una casilla a la derecha (lo que se sale, se pierde). */
function iaPixMover(dibujo) {
  const out = dibujo.map(() => 0);
  for (let f = 0; f < IA_PIX_LADO; f++)
    for (let c = 0; c < IA_PIX_LADO - 1; c++) out[f * IA_PIX_LADO + c + 1] = dibujo[f * IA_PIX_LADO + c] ? 1 : 0;
  return out;
}

/* ── Etapa 1 · 🐾 El adivinador de animales ───────────────────────────────
   Un árbol de preguntas ESCRITO POR UNA PERSONA pensando en cinco animales.
   No aprende nada: sigue la lista. Los tres últimos animales no estaban en
   la cabeza de quien lo escribió, y con ellos se equivoca —el pato porque el
   árbol pregunta por la concha y nunca llega a preguntar por las plumas; el
   delfín y el murciélago porque no hay ninguna rama para un mamífero que
   nada o que vuela—. Es «con instrucciones» contra «con ejemplos», la
   distinción que sostiene la ruta, vista desde I Ciclo. */
const IA_ADIV_PREGUNTAS = {
  agua: '¿Vive en el agua?', concha: '¿Tiene concha?', plumas: '¿Tiene plumas?', patas4: '¿Tiene cuatro patas?',
};
const IA_ADIV_ARBOL = {
  p: 'agua',
  si: { p: 'concha', si: { hoja: 'tortuga' }, no: { hoja: 'pez' } },
  no: { p: 'plumas', si: { hoja: 'gallina' }, no: { p: 'patas4', si: { hoja: 'perro' }, no: { hoja: 'culebra' } } },
};
const IA_ADIV_ANIMALES = [
  { k: 'gallina',    e: '🐔', n: 'la gallina',        agua: false, concha: false, plumas: true,  patas4: false },
  { k: 'pez',        e: '🐟', n: 'el pez',            agua: true,  concha: false, plumas: false, patas4: false },
  { k: 'tortuga',    e: '🐢', n: 'la tortuga de río', agua: true,  concha: true,  plumas: false, patas4: true },
  { k: 'perro',      e: '🐕', n: 'el perro',          agua: false, concha: false, plumas: false, patas4: true },
  { k: 'culebra',    e: '🐍', n: 'la culebra',        agua: false, concha: false, plumas: false, patas4: false },
  /* Los tres en los que la persona que escribió las preguntas no pensó. */
  { k: 'pato',       e: '🦆', n: 'el pato',           agua: true,  concha: false, plumas: true,  patas4: false,
    es: 'un ave: tiene plumas, pero el árbol nunca llegó a preguntarlo porque antes preguntó por la concha' },
  { k: 'delfin',     e: '🐬', n: 'el delfín',         agua: true,  concha: false, plumas: false, patas4: false,
    es: 'un mamífero que respira aire y toma leche de su mamá, no un pez' },
  { k: 'murcielago', e: '🦇', n: 'el murciélago',     agua: false, concha: false, plumas: false, patas4: false,
    es: 'un mamífero que vuela con alas de piel, no una culebra' },
];
const IA_ADIV_NOMBRES = { tortuga: 'una tortuga', pez: 'un pez', gallina: 'una gallina', perro: 'un perro', culebra: 'una culebra' };
/* Recorre el árbol con las respuestas dadas ({agua:true,…}) y devuelve la
   hoja y el camino de preguntas que hizo. Si falta una respuesta, se para
   ahí (la pantalla la pide). */
function iaAdivRecorrer(resp) {
  const camino = [];
  let nodo = IA_ADIV_ARBOL;
  while (nodo && !nodo.hoja) {
    if (!(nodo.p in resp)) return { pendiente: nodo.p, camino: camino };
    camino.push({ p: nodo.p, r: !!resp[nodo.p] });
    nodo = resp[nodo.p] ? nodo.si : nodo.no;
  }
  return { hoja: nodo.hoja, camino: camino };
}
/* Lo que el árbol contesta para cada animal con sus rasgos DE VERDAD, y si
   se equivoca. De aquí sale cuáles son «trampa», sin escribirlo a mano. */
function iaAdivTrampas() {
  return IA_ADIV_ANIMALES.filter(a => iaAdivRecorrer(a).hoja !== a.k).map(a => a.k);
}

/* ── Etapa 2 · 🎯 Tú eres la máquina ──────────────────────────────────────
   Cuatro rondas. En cada una el alumno ve un ejemplo, dice si ENTRA o NO
   ENTRA, y solo después ve la etiqueta de verdad: eso que hace —sacar la
   regla de los ejemplos sin que nadie se la diga— es lo que hace una máquina
   al aprender. La cuarta ronda es la que más enseña: hasta el quinto ejemplo
   encajan DOS reglas («los pares» y «menor que 8»), y la que uno eligió falla
   con el sexto. Con pocos ejemplos caben varias reglas, y la máquina se queda
   con una: por eso hacen falta ejemplos variados. La sonda comprueba que las
   etiquetas salgan de la regla y que en la cuarta las dos reglas coincidan
   exactamente hasta donde se dice. */
const IA_REGLAS_OCULTAS = [
  { k: 'pares', tipo: 'número', ejemplos: [4, 7, 10, 3, 8, 15, 22, 9, 16, 5],
    regla: x => x % 2 === 0, nombre: 'los números pares', pista: 'Mira en qué dígito termina.' },
  { k: 'cinco', tipo: 'número', ejemplos: [10, 12, 25, 7, 40, 33, 5, 18, 55, 26],
    regla: x => x % 5 === 0, nombre: 'los que terminan en 0 o en 5 (múltiplos de 5)', pista: 'Otra vez el último dígito.' },
  { k: 'letra_a', tipo: 'palabra', ejemplos: ['casa', 'perro', 'mango', 'libro', 'sandía', 'pez', 'mesa', 'sol', 'ventana', 'tren'],
    regla: w => /a/.test(w), nombre: 'las palabras que llevan la letra «a»', pista: 'No es cuántas letras: es cuáles.' },
  /* La trampa. La regla verdadera es «menor que 8»; hasta el quinto ejemplo
     «los pares» da exactamente las mismas etiquetas. */
  { k: 'menor8', tipo: 'número', ejemplos: [2, 4, 6, 9, 11, 10, 3, 12, 7, 14],
    regla: x => x < 8, nombre: 'los menores que 8', pista: 'Si dijiste «los pares», hasta el quinto ejemplo tenías razón… y la máquina también.',
    trampa: { otra: x => x % 2 === 0, otraNombre: 'los números pares', hasta: 5 } },
];
const IA_REGLAS_MEDIO = 5; /* después de este ejemplo se le pide la regla */

/* ── Etapa 2 · 📈 ¿Cuántos ejemplos hacen falta? ───────────────────────────
   Dos clases de semilla de frijol —rojo y negro— por largo y ancho. Las
   medidas se SORTEAN con una semilla, y por eso son las mismas cada vez y
   la sonda puede recalcular lo que la pantalla afirma; y van declaradas
   como inventadas en la propia pantalla. El modelo es el vecino más cercano
   de la etapa 1, entrenado con los primeros n ejemplos (van alternando de
   clase para que con dos ya conozca las dos), y probado con 20 que nunca
   vio, 10 de cada clase. */
function iaCurvaRng(semilla) {
  let s = semilla >>> 0;
  return function () {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
/* Semilla y ruido afinados el 16 de septiembre de 2026 para que la curva haga lo
   que la pantalla dice: 10 → 13 → 14 → 15 → 17 → 17 aciertos de 20. Con menos
   ruido dos ejemplos ya daban 16 y la curva no enseñaba nada. */
const IA_CURVA_SEMILLA = 20260927;
const IA_CURVA_CLASES = { rojo: { e: '🔴', n: 'frijol rojo', largo: 11, ancho: 6.2 }, negro: { e: '⚫', n: 'frijol negro', largo: 8.8, ancho: 5.2 } };
const IA_CURVA_N = [1, 2, 5, 10, 20, 50];
function iaCurvaDatos(semilla) {
  const rng = iaCurvaRng(semilla === undefined ? IA_CURVA_SEMILLA : semilla);
  /* Ruido gaussiano aproximado con la suma de tres uniformes: basta y no
     necesita nada fuera de este archivo. */
  const ruido = () => (rng() + rng() + rng() - 1.5) * 3.0;
  const uno = c => ({ c: c, largo: +(IA_CURVA_CLASES[c].largo + ruido()).toFixed(1), ancho: +(IA_CURVA_CLASES[c].ancho + ruido() * 0.6).toFixed(1) });
  const entrena = [], prueba = [];
  for (let i = 0; i < 50; i++) entrena.push(uno(i % 2 ? 'negro' : 'rojo'));
  for (let i = 0; i < 20; i++) prueba.push(uno(i % 2 ? 'negro' : 'rojo'));
  return { entrena: entrena, prueba: prueba };
}
function iaCurvaVecino(p, ejemplos) {
  let mejor = null, dm = Infinity;
  ejemplos.forEach(x => { const d = Math.hypot(p.largo - x.largo, p.ancho - x.ancho); if (d < dm) { dm = d; mejor = x; } });
  return mejor ? mejor.c : null;
}
/* Aciertos de 20 con los primeros n ejemplos. */
function iaCurvaExactitud(n, datos) {
  const d = datos || iaCurvaDatos();
  const ej = d.entrena.slice(0, n);
  return d.prueba.filter(p => iaCurvaVecino(p, ej) === p.c).length;
}

/* ── Etapa 3 · 🗓️ ¿Cuánto tardó? ──────────────────────────────────────────
   Pares de hitos. Los años y los títulos NO están aquí: salen de
   `IA_HITOS` (ia-historia.js), que es el único sitio donde vive una fecha.
   Aquí solo se dice qué dos se emparejan y por qué vale la pena mirar la
   distancia entre ellos. La sonda comprueba que los dos años existan allí. */
const IA_TIEMPO_PARES = [
  { a: '1943', b: '2012', por: 'La neurona de papel y la red que aprendió a ver son la MISMA idea. Lo que faltó todo ese tiempo no fue la idea: fueron los datos y el cómputo, las patas de arriba.' },
  { a: '1958', b: '2012', por: 'El perceptrón es el abuelo directo de la red que ganó ImageNet. Una idea puede estar bien y esperar medio siglo a que llegue con qué hacerla.' },
  { a: '1950', b: '1956', por: 'De la pregunta de Turing al nombre «Inteligencia Artificial» pasó muy poco: cuando la idea está madura, el nombre llega rápido.' },
  { a: '1966', b: '2022', por: 'ELIZA parecía escuchar con unas cuantas reglas; el chat que llegó al teléfono de todos es su tataranieto. Lo que pareció nuevo tenía décadas.' },
  { a: '1997', b: '2016', por: 'Del ajedrez al Go. La primera victoria se hizo probando jugadas a fuerza de cálculo; la segunda, aprendiendo de ejemplos: el mismo tipo de victoria, con otra pata debajo.' },
];

/* ── Etapa 4 · 🕵️ ¿Se puede comprobar? ────────────────────────────────────
   Textos escritos PARA el ejercicio, imitando las dos formas de escribir.
   No se pide adivinar si los escribió una máquina —eso no lo aciertan ni
   los expertos, y una pantalla que lo prometiera mentiría—: se pide lo que
   sí se puede hacer, mirar afirmación por afirmación si trae con qué
   comprobarse (quién, cuándo, dónde, qué documento). `c:true` es que SÍ
   trae; lo que el alumno marca es lo que NO. La sorpresa está en el
   segundo: el mejor escrito de los cuatro no trae ni una. */
const IA_COMPROBAR = [
  { k: 'escuela', e: '🏫', titulo: 'La escuela de la aldea', trozos: [
    { t: 'La escuela de la aldea El Carrizal abrió en 1952 con una sola maestra.', c: true,  por: 'Trae lugar y año: se pregunta en la escuela o en la alcaldía y se sabe.' },
    { t: 'Hoy es una de las mejores de todo el país.',                               c: false, por: '«Una de las mejores» no dice quién lo midió, con qué ni cuándo.' },
    { t: 'Tiene 212 alumnos matriculados este año, según la dirección.',              c: true,  por: 'Trae el número, el año y quién lo dice: se puede pedir la lista.' },
    { t: 'Todos los que estudiaron ahí salieron adelante.',                           c: false, por: '«Todos» y «salieron adelante» no se pueden contar ni medir.' },
  ] },
  { k: 'remedio', e: '🍵', titulo: 'El remedio', trozos: [
    { t: 'Un estudio científico demostró que el té de hoja de guanábana cura la diabetes en treinta días.', c: false, por: '¿Qué estudio? ¿Quién lo hizo, dónde se publicó? Sin eso, «un estudio» es una frase, no una fuente. Y con la salud, lo que no se puede comprobar no se prueba en casa: se pregunta en el centro de salud.' },
    { t: 'Miles de personas ya lo han confirmado.',                                                        c: false, por: '¿Cuáles miles? ¿Dónde están sus nombres? Nadie los puede buscar.' },
    { t: 'Los médicos no quieren que esto se sepa.',                                                       c: false, por: '«Los médicos» no es nadie en concreto. Una afirmación que no nombra a nadie no se puede comprobar ni desmentir: por eso convence tanto.' },
  ] },
  { k: 'puente', e: '📻', titulo: 'La noticia del puente', trozos: [
    { t: 'La alcaldía anunció en su cuenta oficial, el 12 de marzo, que el puente de la entrada cierra el lunes por reparaciones.', c: true, por: 'Quién, cuándo y dónde: se abre la cuenta oficial de la alcaldía y se mira si está.' },
    { t: 'Dicen que está a punto de caerse.',                                                                                      c: false, por: '«Dicen» no es nadie. Sin quién lo dijo no hay a quién preguntarle.' },
    { t: 'La reparación durará dos semanas, según el mismo anuncio.',                                                              c: true, por: 'Remite al anuncio: se lee el anuncio y se comprueba.' },
    { t: 'Todo el pueblo lo sabe.',                                                                                                c: false, por: 'Que muchos lo repitan no lo hace comprobable: hay que llegar a la fuente, no a la cantidad.' },
  ] },
  { k: 'tarea', e: '📚', titulo: 'El dato de la tarea', trozos: [
    { t: 'Honduras tiene 18 departamentos.',                                          c: true,  por: 'Se comprueba en el libro de Ciencias Sociales o en el mapa del aula.' },
    { t: 'El de mayor extensión es Olancho.',                                          c: true,  por: 'Es un dato con fuente: cualquier atlas trae la extensión de cada departamento.' },
    { t: 'Y es el país con más ríos de toda Centroamérica.',                           c: false, por: '¿Quién los contó y cómo? Sin la fuente que cuente los ríos, es una frase redonda que no se puede comprobar.' },
    { t: 'Lo dijo un maestro muy respetado.',                                          c: false, por: 'No dice cuál maestro ni dónde lo dijo. Respetado no es lo mismo que comprobable.' },
  ] },
];

/* ── Etapa 4 · 🔮 Escenarios por venir ────────────────────────────────────
   Cuatro situaciones INVENTADAS para pensar, armadas con cosas que ya se
   pueden hacer —una voz se puede fabricar, un texto se puede generar, un
   video se puede falsear y hay programas que califican solos—. Cada una
   tiene una persona con nombre y un precio que se puede contar, como pide la
   normativa del relato; ninguna afirma que algo haya pasado de verdad, y la
   pantalla lo dice. No hay UNA respuesta buena: hay consecuencias, y el
   alumno escribe su propia regla al final. */
const IA_ESCENARIOS = [
  { k: 'voz', e: '📞', titulo: 'La voz de su mamá', quien: 'Kenia', cuesta: 'los L 1 500 que la familia guarda para la matrícula',
    situacion: 'Kenia recibe un audio con la voz de su mamá, que está trabajando en San Pedro Sula: «Mándame ya los L 1 500 al número que te paso, es urgente, después te explico». La voz es igualita.',
    ops: [
      { t: 'Mandar el dinero ya: es la voz de su mamá.',
        pasa: 'El número era de un desconocido. Una voz se puede fabricar con unos segundos de audio sacados de cualquier video. El dinero de la matrícula se fue, y no vuelve.' },
      { t: 'Colgar y llamarla ella misma al número de siempre.',
        pasa: 'Su mamá contesta desde el trabajo: no mandó nada. Kenia perdió dos minutos y no perdió nada más. Esa llamada es la única prueba que una voz fabricada no puede falsear.' },
      { t: 'Preguntarle por audio algo que solo su mamá sabe.',
        pasa: 'Sirve, y muchas familias acuerdan una palabra clave. Pero si quien fabricó la voz también leyó los mensajes de la familia, puede saberla. Llamar de vuelta sigue siendo lo más seguro.' },
    ], regla: 'Una voz ya no es una prueba. La prueba es llamar de vuelta al número de siempre.' },
  { k: 'ensayo', e: '📝', titulo: 'El ensayo que escribió la máquina', quien: 'Marvin', cuesta: 'la nota del bimestre y lo que iba a aprender',
    situacion: 'Marvin le pide a un chat de IA el ensayo de Ciencias Sociales sobre la Reforma Liberal, lo copia y lo entrega. Le queda perfecto. Al leerlo, la maestra le pide que explique el segundo párrafo delante de la clase.',
    ops: [
      { t: 'Inventar una explicación en el momento.',
        pasa: 'El párrafo citaba un decreto con un número que no existe: la máquina lo inventó, y Marvin no lo sabía porque no lo leyó. La nota se fue, y con ella la confianza de la maestra, que cuesta más recuperar.' },
      { t: 'Decir la verdad: lo escribió una máquina y no lo revisó.',
        pasa: 'La maestra le da otra oportunidad con una condición: escribirlo él, y usar la máquina solo para preguntar lo que no entienda. Le cuesta una tarde. Le queda algo que sí sabe explicar.' },
      { t: 'Usarla para entender, escribirlo él y comprobar cada dato.',
        pasa: 'Es la forma en que sirve: le pide que le explique la Reforma Liberal como a alguien de séptimo, comprueba las fechas en el libro y escribe con sus palabras. El ensayo es suyo y lo puede defender.' },
    ], regla: 'Lo que entregas tiene que poder explicarlo. Si no puedes, no es tuyo.' },
  { k: 'noticia', e: '📺', titulo: 'La noticia que cierra la escuela', quien: 'don Chele, el maestro', cuesta: 'una semana de clases y la tranquilidad de cuarenta familias',
    situacion: 'Un domingo por la noche, a don Chele le llega por el grupo de la comunidad un video: un presentador de noticias, con el logo de un canal, dice que la escuela de la aldea cierra el lunes por orden de la Secretaría. El video se ve real. La mitad del pueblo ya lo compartió, y a él le preguntan qué hacer.',
    ops: [
      { t: 'Compartirlo al grupo de padres para que se preparen.',
        pasa: 'El lunes llegan doce alumnos de cuarenta. El video estaba fabricado: ese presentador nunca dijo eso. Recuperar la asistencia costó una semana, y la próxima noticia de verdad ya no la creyó nadie.' },
      { t: 'Llamar a la dirección distrital antes de compartir nada.',
        pasa: 'La distrital no sabe de ningún cierre. Don Chele manda un audio propio al grupo: «la escuela abre el lunes, lo confirmé». La noticia falsa muere ahí.' },
      { t: 'Buscar la noticia en la cuenta oficial del canal.',
        pasa: 'No está. Un video que solo existe en un grupo de mensajes y no en la fuente que lo firma no es una noticia: es un archivo que alguien fabricó.' },
    ], regla: 'Cuanto más urgente y más increíble, más se verifica antes de compartir.' },
  { k: 'califica', e: '🏫', titulo: 'La máquina que califica', quien: 'Sofía', cuesta: 'reprobar Español con una respuesta que estaba bien',
    situacion: 'Imagina que el colegio usa un programa que califica solo los exámenes de redacción. A Sofía le marca mal un párrafo por «errores de vocabulario»: escribió «chucho», «cipote» y «pisto». El programa se entrenó con textos de otros países.',
    ops: [
      { t: 'Aceptar la nota: la máquina no se equivoca.',
        pasa: 'Sofía reprueba por escribir como se habla en su país. El error de la máquina cayó sobre ella y sobre todos los que escriben así: eso es un sesgo, el mismo de la etapa 2.' },
      { t: 'Pedir que una persona revise la calificación.',
        pasa: 'La maestra lee el párrafo, reconoce el español de Honduras y corrige la nota. Una decisión que afecta a una persona la revisa una persona.' },
      { t: 'Preguntar con qué ejemplos se entrenó el programa.',
        pasa: 'Son las tres preguntas de la etapa 2: con qué ejemplos, quién los eligió y a quién le cae el error. La respuesta explica el fallo y obliga a cambiar el programa o a no dejarlo decidir solo.' },
    ], regla: 'Una máquina puede proponer; la decisión sobre una persona la toma una persona.' },
];

/* Se exporta para las sondas, que corren en Node. En el navegador no estorba. */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    IA_PIX_LADO, IA_PIX_RECUERDOS, iaPixDeFilas, iaPixParecido, iaPixAdivina, iaPixMover,
    IA_ADIV_PREGUNTAS, IA_ADIV_ARBOL, IA_ADIV_ANIMALES, IA_ADIV_NOMBRES, iaAdivRecorrer, iaAdivTrampas,
    IA_REGLAS_OCULTAS, IA_REGLAS_MEDIO,
    IA_CURVA_SEMILLA, IA_CURVA_CLASES, IA_CURVA_N, iaCurvaRng, iaCurvaDatos, iaCurvaVecino, iaCurvaExactitud,
    IA_TIEMPO_PARES, IA_COMPROBAR, IA_ESCENARIOS,
  };
}
