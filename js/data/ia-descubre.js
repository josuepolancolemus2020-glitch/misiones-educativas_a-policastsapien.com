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
  { a: '1943', b: '2012', por: 'La neurona de papel y la red que aprendió a ver son la MISMA idea. Faltaban datos y cómputo.' },
  { a: '1958', b: '2012', por: 'El perceptrón es el abuelo de la red que ganó ImageNet. Una idea buena puede esperar medio siglo.' },
  { a: '1950', b: '1956', por: 'De la pregunta de Turing al nombre «Inteligencia Artificial» pasó poco. La idea ya estaba madura.' },
  { a: '1966', b: '2022', por: 'ELIZA parecía escuchar con unas pocas reglas. El chat de hoy es su tataranieto.' },
  { a: '1997', b: '2016', por: 'Del ajedrez al Go. La primera ganó a fuerza de cálculo. La segunda ganó aprendiendo de ejemplos.' },
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
    { t: 'La escuela de El Carrizal abrió en 1952.', c: true,  por: 'Trae lugar y año. Se pregunta en la escuela.' },
    { t: 'Hoy es una de las mejores del país.',                         c: false, por: '«Una de las mejores» no dice quién lo midió.' },
    { t: 'Tiene 212 alumnos este año, según la dirección.',             c: true,  por: 'Dice el número y quién lo dice. Se pide la lista.' },
    { t: 'Todos los que estudiaron ahí salieron adelante.',             c: false, por: '«Todos» y «salieron adelante» no se pueden contar.' },
  ] },
  { k: 'remedio', e: '🍵', titulo: 'El remedio', trozos: [
    { t: 'Un estudio científico demostró que el té de guanábana cura la diabetes.', c: false, por: '¿Qué estudio? ¿Quién lo hizo? Sin eso no hay fuente. Con la salud no se prueba en casa: se pregunta en el centro de salud.' },
    { t: 'Miles de personas ya lo han confirmado.',                      c: false, por: '¿Cuáles miles? ¿Dónde están sus nombres?' },
    { t: 'Los médicos no quieren que esto se sepa.',                     c: false, por: '«Los médicos» no es nadie. Nadie lo puede desmentir.' },
  ] },
  { k: 'puente', e: '📻', titulo: 'La noticia del puente', trozos: [
    { t: 'El 12 de marzo la alcaldía anunció en su cuenta oficial: el puente cierra el lunes.', c: true,  por: 'Quién, cuándo y dónde. Se abre esa cuenta y se mira.' },
    { t: 'Dicen que está a punto de caerse.',                         c: false, por: '«Dicen» no es nadie. No hay a quién preguntarle.' },
    { t: 'La reparación durará dos semanas, según el mismo anuncio.',  c: true,  por: 'Sale del mismo anuncio. Se lee y se comprueba.' },
    { t: 'Todo el pueblo lo sabe.',                                    c: false, por: 'Que muchos lo repitan no lo hace comprobable.' },
  ] },
  { k: 'tarea', e: '📚', titulo: 'El dato de la tarea', trozos: [
    { t: 'Honduras tiene 18 departamentos.',                   c: true,  por: 'Se comprueba en el mapa del aula.' },
    { t: 'El de mayor extensión es Olancho.',                  c: true,  por: 'Cualquier atlas trae la extensión de cada departamento.' },
    { t: 'Y es el país con más ríos de toda Centroamérica.',   c: false, por: '¿Quién los contó? Nadie dice de dónde sale ese dato.' },
    { t: 'Lo dijo un maestro muy respetado.',                  c: false, por: 'No dice cuál maestro ni dónde lo dijo.' },
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
  { k: 'voz', e: '📞', titulo: 'La voz de su mamá', quien: 'Kenia', cuesta: 'los L 1 500 de la matrícula',
    situacion: 'A Kenia le llega un audio con la voz de su mamá, que trabaja lejos: «Mándame ya los L 1 500 a este número, es urgente». La voz es igualita.',
    ops: [
      { t: 'Mandar el dinero: es su mamá.',
        pasa: 'El número era de un desconocido. Una voz se fabrica con unos segundos de video. El dinero no vuelve.' },
      { t: 'Colgar y llamarla al número de siempre.',
        pasa: 'Su mamá contesta desde el trabajo: no mandó nada. Kenia perdió dos minutos y nada más.' },
      { t: 'Preguntarle algo que solo su mamá sabe.',
        pasa: 'Sirve. Pero si quien fabricó la voz leyó los mensajes de la familia, también sabe la respuesta.' },
    ], regla: 'Una voz ya no es una prueba. La prueba es llamar al número de siempre.' },
  { k: 'ensayo', e: '📝', titulo: 'El ensayo que escribió la máquina', quien: 'Marvin', cuesta: 'la nota del bimestre',
    situacion: 'Marvin le pide a un chat de IA su ensayo sobre la Reforma Liberal. Lo entrega tal cual. La maestra le pide explicarlo delante de la clase.',
    ops: [
      { t: 'Inventar una explicación en el momento.',
        pasa: 'Citaba un decreto que no existe. La máquina lo inventó y Marvin no lo leyó. Perdió la nota.' },
      { t: 'Decir la verdad: lo escribió una máquina.',
        pasa: 'La maestra le da otra oportunidad: escribirlo él. Le cuesta una tarde. Le queda algo que sí sabe explicar.' },
      { t: 'Usarla para entender y escribirlo él.',
        pasa: 'Le pide que le explique la Reforma Liberal. Comprueba las fechas en el libro. El ensayo es suyo.' },
    ], regla: 'Lo que entregas tiene que poder explicarlo. Si no puedes, no es tuyo.' },
  { k: 'noticia', e: '📺', titulo: 'La noticia que cierra la escuela', quien: 'don Chele, el maestro', cuesta: 'una semana de clases y cuarenta familias asustadas',
    situacion: 'Un domingo a don Chele le llega un video por el grupo de la comunidad. Un presentador con el logo de un canal dice que la escuela cierra el lunes. Medio pueblo ya lo compartió.',
    ops: [
      { t: 'Compartirlo al grupo de padres.',
        pasa: 'El lunes llegan doce alumnos de cuarenta. El video estaba fabricado. Recuperar la asistencia costó una semana. Y la siguiente noticia de verdad ya no la creyó nadie.' },
      { t: 'Llamar a la dirección distrital.',
        pasa: 'La distrital no sabe de ningún cierre. Don Chele avisa al grupo y la noticia falsa muere ahí.' },
      { t: 'Buscarla en la cuenta del canal.',
        pasa: 'No está. Un video que solo vive en un grupo de mensajes no es una noticia.' },
    ], regla: 'Cuanto más urgente y más increíble, más se verifica antes de compartir.' },
  { k: 'califica', e: '🏫', titulo: 'La máquina que califica', quien: 'Sofía', cuesta: 'reprobar Español con una respuesta buena',
    situacion: 'Imagina un programa que califica solo los exámenes de redacción. A Sofía le marca mal un párrafo: escribió «chucho», «cipote» y «pisto». Ese programa aprendió con textos de otros países.',
    ops: [
      { t: 'Aceptar la nota. La máquina no falla.',
        pasa: 'Sofía reprueba por escribir como se habla en su país. Le cae a todos los que escriben así. Es un sesgo.' },
      { t: 'Pedir que una persona revise la nota.',
        pasa: 'La maestra lee el párrafo, reconoce el español de Honduras y corrige la nota.' },
      { t: 'Preguntar con qué ejemplos se entrenó.',
        pasa: 'Son las tres preguntas de la etapa 2: con qué ejemplos, quién los eligió, a quién le cae el error. La respuesta explica el fallo y obliga a cambiar el programa.' },
    ], regla: 'Una máquina puede proponer. La decisión sobre una persona la toma una persona.' },
];

/* ── Etapa 5 · 🎙️ ¿Cuánto hace falta para una estafa? ─────────────────────
   El alumno se pone del otro lado: arma el mensaje con el que se estafa a una
   familia. No se le enseña a fabricar una voz —ni se puede, ni haría falta—:
   se le enseña **de qué está hecho el engaño**, que es información que la
   propia familia publicó. Es educación de defensa, la misma que se hace con
   el correo falso en cualquier oficina, y por eso termina siempre en la otra
   mitad: qué lo hubiera parado.

   ⚠️ Lo que la actividad AFIRMA, y la sonda recalcula: que las tres señales
   (urgencia, secreto y canal nuevo) están en el mensaje **con piezas y sin
   piezas**, porque sin ellas la estafa no funciona; y que ninguna de las seis
   piezas se robó: las seis salen de algo que se publicó. */
const IA_ESTAFA_PIEZAS = [
  { k: 'voz', emoji: '🎂', que: 'El video del cumpleaños',
    publico: 'Una tía lo subió al grupo',
    aporta: 'La voz. Con unos segundos basta para fabricarla.',
    texto: '' },
  { k: 'nombre', emoji: '📛', que: 'El nombre de la hija',
    publico: '«¡Feliz cumple, Yoselin!», en una foto pública',
    aporta: 'Te llama por tu nombre. Suena a alguien conocido.',
    texto: 'Yoselin, ' },
  { k: 'donde', emoji: '🏙️', que: 'Que la mamá trabaja fuera',
    publico: 'La mamá publicó: «primer día en San Pedro»',
    aporta: 'Explica por qué no puede hablar.',
    texto: 'Estoy en San Pedro, no puedo hablar. ' },
  { k: 'motivo', emoji: '💸', que: 'Que la matrícula vence esta semana',
    publico: 'El aviso de la escuela, reenviado al grupo',
    aporta: 'Es verdad. Eso es lo que más convence.',
    texto: 'La matrícula de tu hermano vence hoy. ' },
  { k: 'detalle', emoji: '🏫', que: 'El nombre de la escuela y de la tienda',
    publico: 'En las fotos del uniforme y en los comentarios',
    aporta: 'Parece un detalle que solo la familia sabe.',
    texto: 'Dejáselo en la tienda del portón. ' },
  { k: 'canal', emoji: '📵', que: 'Un número nuevo, no el de la mamá',
    publico: 'Esta no se publicó: la pone quien engaña',
    aporta: 'El dinero llega a otro lado.',
    texto: 'A este número, el mío se dañó. ' },
];
/* El mensaje se ARMA con las piezas elegidas. Las tres señales van siempre,
   con piezas o sin ellas: son el esqueleto del engaño, no un adorno. */
const IA_ESTAFA_BASE = {
  saludo: 'Hola, soy tu mamá. ',
  urgencia: 'Es urgente. ',            /* señal 1 */
  canal: 'Al número que te paso. ', /* señal 3, en genérico */
  secreto: 'No le digás a nadie todavía.', /* señal 2 */
};
function iaEstafaMensaje(elegidas) {
  const hay = k => elegidas.indexOf(k) >= 0;
  const pieza = k => IA_ESTAFA_PIEZAS.find(p => p.k === k).texto;
  let m = hay('nombre') ? pieza('nombre') + 'soy tu mamá. ' : IA_ESTAFA_BASE.saludo;
  m += IA_ESTAFA_BASE.urgencia;
  ['donde', 'motivo'].forEach(k => { if (hay(k)) m += pieza(k); });
  m += hay('motivo') ? 'Mandame los dos mil. ' : 'Mandame dinero. ';
  if (hay('detalle')) m += pieza('detalle');
  /* El canal nuevo va SIEMPRE: sin él el dinero llegaría a la persona de
     verdad y no habría estafa. La pieza solo lo vuelve concreto y creíble. */
  m += hay('canal') ? pieza('canal') : IA_ESTAFA_BASE.canal;
  /* ⚠️ Frases cortas a propósito, como escribe alguien apurado en un chat:
     el mensaje entero, con las seis piezas, cabe en 45 palabras y ninguna
     frase pasa de 12. Iba en una sola frase de 59 palabras con comas, y era
     el único tramo de la ruta que un niño de cuarto no terminaba de leer. */
  m = m.replace(/\s+/g, ' ');
  if (!/[.!?]\s*$/.test(m)) m += '. ';
  return m + IA_ESTAFA_BASE.secreto;
}
/* Las tres señales, con sus palabras dentro del mensaje armado: es lo que la
   pantalla resalta y lo que la sonda comprueba que esté SIEMPRE. */
const IA_ESTAFA_SENALES = [
  { k: 'urgencia', emoji: '⏰', busca: 'Es urgente' },
  { k: 'canal', emoji: '📵', busca: 'número' },
  { k: 'secreto', emoji: '🤫', busca: 'No le digás a nadie' },
];
/* Qué lo hubiera parado, y qué no. Las verdades a medias van marcadas: una
   defensa que se vende como buena para todo es peor que ninguna. */
const IA_ESTAFA_DEFENSAS = [
  { k: 'llamar', emoji: '📞', que: 'Colgar y llamar yo al número de siempre', vale: 'si',
    porque: 'No depende de nada publicado: del otro lado está su mamá de verdad.' },
  { k: 'palabra', emoji: '🔑', que: 'Una palabra que acordamos en persona', vale: 'si',
    porque: 'Solo si no se escribió nunca en un grupo. Escrita, la lee quien engaña.' },
  { k: 'voz', emoji: '🎧', que: 'Reconocer la voz de mi mamá', vale: 'no',
    porque: 'La voz es lo que se fabrica. Con el video del cumpleaños ya la tienen.' },
  { k: 'dato', emoji: '❓', que: 'Preguntarle algo que solo ella sabe', vale: 'medias',
    porque: 'Si está publicado, lo sabe cualquiera: la escuela, dónde trabaja, el cumpleaños.' },
  { k: 'esperar', emoji: '⏳', que: 'Esperar diez minutos y contárselo a alguien', vale: 'si',
    porque: 'El mensaje trae urgencia y secreto para que no hagas ninguna de las dos.' },
];

/* ── Etapa 5 · ⚖️ El promedio que esconde ─────────────────────────────────
   La idea más importante del catálogo de peligros, y la que no se ve en un
   párrafo: **el porcentaje de aciertos no dice a quién le cae el error**. El
   alumno reparte los ejemplos del entrenamiento y mira la exactitud por
   grupo; descubre que un sistema con nueve aciertos de cada diez puede ser
   una moneda al aire para el grupo pequeño.

   La cuenta es determinista y sin azar a propósito: así la sonda la rehace
   exactamente, y dos alumnos con el mismo reparto ven lo mismo. La curva es
   la misma forma que midió la etapa 2: sube rápido con los primeros ejemplos
   y se aplana; sin ejemplos de un grupo, sobre ese grupo es como una moneda. */
const IA_EJEMPLOS_TOTAL = 80;
function iaAciertoGrupo(n) {
  if (n <= 0) return 50;
  return Math.round(50 + 45 * (1 - Math.exp(-n / 10)));
}
const IA_REPARTOS = [
  { k: 'solo_grande', nombre: 'Solo del grupo grande', reparto: g => (g === 0 ? IA_EJEMPLOS_TOTAL : 0) },
  { k: 'poblacion', nombre: 'Como son en la población', reparto: null },
  { k: 'mitad', nombre: 'Mitad y mitad', reparto: g => IA_EJEMPLOS_TOTAL / 2 },
  { k: 'solo_chico', nombre: 'Solo del grupo pequeño', reparto: g => (g === 1 ? IA_EJEMPLOS_TOTAL : 0) },
];
const IA_SISTEMAS = [
  { k: 'beca', emoji: '📄', nombre: 'El que descarta solicitudes de beca',
    decide: 'si una persona llega a leer tu solicitud',
    cuesta: 'el año de estudio de alguien que cumplía los requisitos',
    grupos: [{ nombre: 'Alumnos de escuelas grandes', cuantos: 180 }, { nombre: 'Alumnos de escuelas de aldea', cuantos: 20 }] },
  { k: 'voz', emoji: '🗣️', nombre: 'El que entiende lo que decís por teléfono',
    decide: 'si el trámite te atiende o te cuelga',
    cuesta: 'viajar a la ciudad por algo que se arreglaba hablando',
    grupos: [{ nombre: 'Los que hablan como en la capital', cuantos: 170 }, { nombre: 'Los que hablan como en su pueblo', cuantos: 30 }] },
  { k: 'cara', emoji: '👁️', nombre: 'El que abre la puerta con la cara',
    decide: 'si entrás a tu trabajo o esperás afuera',
    cuesta: 'llegar tarde cada día, y que parezca culpa tuya',
    grupos: [{ nombre: 'Caras como las del entrenamiento', cuantos: 185 }, { nombre: 'Las demás caras', cuantos: 15 }] },
];
/* Cuántos ejemplos de cada grupo, según el reparto elegido. */
function iaRepartoEjemplos(sistema, repartoK) {
  const r = IA_REPARTOS.find(x => x.k === repartoK) || IA_REPARTOS[0];
  const total = sistema.grupos.reduce((a, g) => a + g.cuantos, 0);
  return sistema.grupos.map((g, i) =>
    r.reparto ? Math.round(r.reparto(i)) : Math.round(IA_EJEMPLOS_TOTAL * g.cuantos / total));
}
/* La exactitud por grupo y la del conjunto, que es la que se presume. */
function iaExactitud(sistema, repartoK) {
  const ej = iaRepartoEjemplos(sistema, repartoK);
  const porGrupo = sistema.grupos.map((g, i) => ({ nombre: g.nombre, cuantos: g.cuantos, ejemplos: ej[i], pct: iaAciertoGrupo(ej[i]) }));
  const total = sistema.grupos.reduce((a, g) => a + g.cuantos, 0);
  const media = porGrupo.reduce((a, g) => a + g.pct * g.cuantos, 0) / total;
  const fallan = porGrupo.map(g => Math.round(g.cuantos * (100 - g.pct) / 100));
  return { porGrupo: porGrupo, media: Math.round(media * 10) / 10, fallan: fallan, total: total };
}

/* Se exporta para las sondas, que corren en Node. En el navegador no estorba. */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    IA_PIX_LADO, IA_PIX_RECUERDOS, iaPixDeFilas, iaPixParecido, iaPixAdivina, iaPixMover,
    IA_ADIV_PREGUNTAS, IA_ADIV_ARBOL, IA_ADIV_ANIMALES, IA_ADIV_NOMBRES, iaAdivRecorrer, iaAdivTrampas,
    IA_REGLAS_OCULTAS, IA_REGLAS_MEDIO,
    IA_CURVA_SEMILLA, IA_CURVA_CLASES, IA_CURVA_N, iaCurvaRng, iaCurvaDatos, iaCurvaVecino, iaCurvaExactitud,
    IA_TIEMPO_PARES, IA_COMPROBAR, IA_ESCENARIOS,
    IA_ESTAFA_PIEZAS, IA_ESTAFA_BASE, IA_ESTAFA_SENALES, iaEstafaMensaje, IA_ESTAFA_DEFENSAS,
    IA_EJEMPLOS_TOTAL, iaAciertoGrupo, IA_REPARTOS, IA_SISTEMAS, iaRepartoEjemplos, iaExactitud,
  };
}
