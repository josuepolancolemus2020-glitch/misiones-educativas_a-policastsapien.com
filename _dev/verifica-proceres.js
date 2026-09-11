/* ══════════════════════════════════════════════════════════════
   M.E.T.A.S · Los próceres dicen lo mismo en la pantalla y en el papel
   ──────────────────────────────────────────────────────────────
   Quién fue cada héroe y cada prócer vive en UN solo archivo,
   `js/data/proceres-honduras.js`. De ahí lo saca la misión (que lo
   pinta al vuelo) y de ahí salió la ficha que el maestro fotocopia
   (`fichas/ficha-proceres-heroes.html`), que es HTML plano como
   todas las demás del proyecto.

   Ese «salió de ahí» es justo lo que se despinta con el tiempo:
   alguien corrige una fecha en la ficha, o la vuelve a armar de
   otra fuente, y a partir de ese día el alumno estudia «1792» y el
   maestro le corrige con «1782». Aquí lo que se pregunta son datos
   duros —el año, el lugar, el apodo, el día del calendario cívico—,
   así que una diferencia de un dígito no es un matiz: es la
   pregunta del examen de septiembre contestada mal.

   Por eso esta sonda compara la ficha contra el archivo de datos
   DATO POR DATO, de los ocho. No lee páginas ni mide hojas —de eso
   ya se encargan verifica-ficha-paginas.js y reparte-hojas-ficha.js—:
   solo comprueba que las dos copias digan exactamente lo mismo.

   Y mira tres cosas más que cuestan igual de caro:

   · Que la misión NO lleve los datos escritos a mano. Si algún día
     alguien los copia dentro del HTML «para que cargue antes»,
     vuelve a haber dos originales y esta sonda deja de servir.
   · Que estén TODOS los que el DCNB nombra por su nombre. La lista
     no se escribe aquí: se lee de la expectativa que el propio
     archivo de datos cita en su cabecera, así que la sonda no puede
     quedarse vieja por su cuenta.
   · Que la definición de héroe y de prócer sea la MISMA que ya
     enseña la misión de Aspectos Cívicos (id 67). Las dos son de la
     Ruta de la Patria y un alumno las abre seguidas: no puede leer
     dos definiciones distintas de lo mismo.

   Uso:  node _dev/verifica-proceres.js
   ══════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RAIZ = path.resolve(__dirname, '..');
const DATOS = path.join(RAIZ, 'js', 'data', 'proceres-honduras.js');
const FICHA = path.join(RAIZ, 'fichas', 'ficha-proceres-heroes.html');
const MISION = path.join(RAIZ, 'misiones', '2y3ciclo-proceres-heroes', 'proceres-heroes.html');
const CIVICOS = path.join(RAIZ, 'misiones', '2y3ciclo-aspectos-civicos', 'aspectos-civicos.html');

let fallos = 0, avisos = 0;
const ok = (t) => console.log('  ✅ ' + t);
const mal = (t) => { fallos++; console.log('  ❌ ' + t); };
const avisa = (t) => { avisos++; console.log('  ⚠️  ' + t); };

/* ---------- el original ---------- */
const fuente = fs.readFileSync(DATOS, 'utf8');
const ctx = {};
vm.createContext(ctx);
vm.runInContext(fuente +
  '\nthis.X = { PROCERES, PROCERES_QUIENES_FALTAN, PROCERES_DIFERENCIA };', ctx);
const { PROCERES, PROCERES_QUIENES_FALTAN, PROCERES_DIFERENCIA } = ctx.X;

/* Lo que se compara es el texto PELADO: sin etiquetas, sin las entidades del
   HTML y con los espacios apretados. Lo que tiene que coincidir son las
   palabras, no cómo esté maquetado el papel. */
function pelar(html) {
  return String(html)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/\s+/g, ' ')
    .trim();
}
/* Para comparar frases entre dos redacciones distintas: sin mayúsculas, sin
   signos y sin tildes. Es la misma normalización que usa la sonda del Himno
   para juzgar sus citas. */
const limpia = (s) => String(s).toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[«».,;:¡!¿?…—–-]/g, ' ')
  .replace(/\s+/g, ' ').trim();

console.log('\n🏅 El archivo de datos');
if (!PROCERES.length) mal('no hay ni un prócer en el archivo');
else ok(PROCERES.length + ' personajes en js/data/proceres-honduras.js');

/* Los campos que la ficha imprime de cada uno: si falta uno, lo que sale en
   el papel es un hueco y nadie lo nota hasta tener las fotocopias hechas. */
const OBLIGATORIOS = ['clave', 'nombre', 'apodo', 'emoji', 'clase', 'epoca', 'papel', 'hizo', 'porque', 'dato'];
const incompletos = PROCERES.filter(p => OBLIGATORIOS.some(c => !p[c] || (Array.isArray(p[c]) && !p[c].length)));
if (!incompletos.length) ok('los ' + PROCERES.length + ' traen sus ' + OBLIGATORIOS.length + ' campos');
else mal('les falta algún campo: ' + incompletos.map(p => p.nombre).join(', '));

const claves = PROCERES.map(p => p.clave);
if (new Set(claves).size === claves.length) ok('ninguna clave repetida');
else mal('hay claves repetidas: el Laboratorio enseñaría dos veces al mismo');

/* A QUIÉNES hay que nombrar no lo decide esta sonda ni el gusto de nadie: lo
   dice el DCNB, y la expectativa está citada en la cabecera del archivo de
   datos. Se lee de ahí para que la lista no envejezca por su cuenta. */
const cita = /«Identifican la participación de algunos personajes como:([\s\S]*?),?\s*en la\s+historia de Honduras»/.exec(
  fuente.replace(/\n\s*/g, ' '));
if (!cita) {
  avisa('no se encontró en la cabecera la expectativa del DCNB que dice a quiénes hay que nombrar');
} else {
  const pedidos = cita[1].split(',').map(s => s.trim()).filter(Boolean);
  const faltan = pedidos.filter(n => !PROCERES.some(p => limpia(p.nombre) === limpia(n)));
  if (!faltan.length) ok('están los ' + pedidos.length + ' que el DCNB nombra por su nombre');
  else mal('el DCNB los nombra y no están: ' + faltan.join(', '));
}

/* ---------- la ficha ---------- */
console.log('\n📄 La ficha que se fotocopia');
if (!fs.existsSync(FICHA)) {
  mal('no existe fichas/ficha-proceres-heroes.html');
} else {
  const ficha = fs.readFileSync(FICHA, 'utf8');
  /* El recuadro de cada personaje lleva <div> dentro, así que su cierre no se
     puede buscar con una expresión regular: la primera </div> que encuentra es
     la de su título y el recuadro sale partido. Se cuenta la profundidad, que
     es la única forma de saber dónde acaba de verdad. */
  const bloques = [];
  const ABRE = '<div class="pficha">';
  for (let i = ficha.indexOf(ABRE); i >= 0; i = ficha.indexOf(ABRE, i + 1)) {
    let prof = 0, j = i;
    const et = /<(\/?)div\b[^>]*>/g;
    et.lastIndex = i;
    let m;
    while ((m = et.exec(ficha)) !== null) {
      prof += m[1] ? -1 : 1;
      if (prof === 0) { j = et.lastIndex; break; }
    }
    bloques.push(ficha.slice(i, j > i ? j : undefined));
  }

  if (bloques.length === PROCERES.length) {
    ok('la ficha imprime ' + bloques.length + ' fichas de personaje, las mismas que trae el archivo');
  } else {
    mal('la ficha imprime ' + bloques.length + ' fichas de personaje y el archivo tiene ' + PROCERES.length);
  }

  /* Dato por dato. Se busca cada valor DENTRO del bloque de su personaje: así
     un dato que se cuele en el recuadro del vecino —que es lo que pasa al
     copiar y pegar un bloque— sale como fallo y no pasa desapercibido. */
  let distintos = 0;
  const n = Math.min(bloques.length, PROCERES.length);
  for (let i = 0; i < n; i++) {
    const texto = pelar(bloques[i]);
    const p = PROCERES[i];
    const esperado = [
      ['nombre', p.nombre], ['apodo', p.apodo], ['clase', p.clase],
      ['época', p.epoca], ['papel', p.papel], ['por qué se le recuerda', p.porque],
      ['dato curioso', p.dato]
    ];
    p.hizo.forEach((h, k) => esperado.push(['qué hizo (' + (k + 1) + ')', h]));
    if (p.nacio) esperado.push(['nació', p.nacio]);
    if (p.fecha) esperado.push(['fecha cívica', p.fecha.dia], ['fecha cívica', p.fecha.que]);
    for (const [que, valor] of esperado) {
      if (texto.includes(pelar(valor))) continue;
      distintos++;
      if (distintos <= 6) {
        mal(p.nombre + ' · ' + que + ':');
        console.log('       archivo: «' + valor + '»');
        console.log('       la ficha no lo imprime en su recuadro');
      }
    }
  }
  if (distintos > 6) mal('…y ' + (distintos - 6) + ' dato(s) más que no coinciden');
  if (!distintos && n) ok('los datos de los ' + n + ' dicen lo mismo, palabra por palabra');

  /* Lo que el DCNB pide además de los nombres, y que es lo primero que se cae
     al recortar una ficha para ganar una hoja. */
  const plana = pelar(ficha);
  const aparte = [
    ['el texto de «los que casi nunca salen en la lista»', PROCERES_QUIENES_FALTAN.texto],
    ['la pregunta para investigar en su municipio', PROCERES_QUIENES_FALTAN.pregunta],
    ['la expectativa del DCNB que la sostiene', PROCERES_QUIENES_FALTAN.fuente]
  ];
  const sinEllo = aparte.filter(([, v]) => !plana.includes(pelar(v)));
  if (!sinEllo.length) ok('la ficha lleva la sección de los que casi nunca salen en la lista');
  else sinEllo.forEach(([q]) => mal('la ficha no imprime ' + q));

  /* El QR de la portada: sin él, el papel no lleva a la misión. */
  if (/qr-mision-proceres-heroes\.png/.test(ficha)) ok('la portada lleva su código QR');
  else mal('la portada no lleva el QR de la misión');

  /* La normativa del papel: el círculo se RELLENA, la ✗ es para lo que está
     mal. Se quitan antes los comentarios, que es donde se explica la regla. */
  const sinComentarios = ficha.replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
  if (/marca con una ✗|marca con ✗|con una ✗/i.test(sinComentarios)) mal('alguna actividad pide marcar con ✗ en vez de rellenar el círculo');
  else ok('la selección múltiple pide rellenar el círculo, no la ✗');

  /* ⚠️ Y lo que de verdad se corrige mal: Morazán. A quien lleva `nota` se le
     llama de las dos formas y las dos son defendibles, así que la hoja del
     docente tiene que decirle al maestro que NO lo marque en rojo. Sin ese
     aviso, la ficha pregunta algo con dos respuestas buenas y solo acepta
     una. */
  const conNota = PROCERES.filter(p => p.nota);
  if (!conNota.length) ok('ningún personaje se llama de las dos formas: no hace falta aviso al corregir');
  else {
    const sinAviso = conNota.filter(p => !new RegExp('corregir[\\s\\S]{0,200}' + p.nombre).test(ficha));
    if (!sinAviso.length) ok('la hoja del docente avisa de cómo corregir a ' + conNota.map(p => p.nombre).join(', '));
    else mal('la hoja del docente no avisa de cómo corregir a ' + sinAviso.map(p => p.nombre).join(', '));
  }
}

/* ---------- la misión ---------- */
console.log('\n📱 La misión');
if (!fs.existsSync(MISION)) {
  mal('no existe la misión de los próceres');
} else {
  const html = fs.readFileSync(MISION, 'utf8');
  if (/<script src="\.\.\/\.\.\/js\/data\/proceres-honduras\.js"><\/script>/.test(html)) ok('carga js/data/proceres-honduras.js');
  else mal('la misión no carga js/data/proceres-honduras.js');

  /* Que el archivo de datos vaya ANTES del JS de la misión: ese lo usa para
     armar el Laboratorio y las tarjetas nada más cargar. */
  const iDatos = html.indexOf('js/data/proceres-honduras.js');
  const iMision = html.indexOf('js/proceres-heroes.js');
  if (iDatos >= 0 && iMision >= 0 && iDatos < iMision) ok('los datos van antes del JS de la misión');
  else mal('js/data/proceres-honduras.js tiene que ir ANTES de js/proceres-heroes.js');

  /* Los huecos que rellenan pintarProceresMapa/Lista/Diferencia. */
  for (const id of ['pro-mapa', 'pro-lista', 'pro-dif-heroe', 'pro-dif-procer', 'pro-faltan']) {
    if (html.includes('id="' + id + '"')) ok('el hueco #' + id + ' está en la página');
    else mal('falta el hueco #' + id);
  }

  /* Y lo que de verdad vigila esta parte: que NADIE haya copiado los datos
     dentro del HTML. Con dos originales, esta sonda deja de servir. */
  const sinComentarios = html.replace(/<!--[\s\S]*?-->/g, '');
  const copiados = PROCERES.flatMap(p => [p.porque, p.dato, p.papel].concat(p.hizo))
    .filter(v => sinComentarios.includes(v));
  if (!copiados.length) ok('ningún dato está escrito a mano en el HTML de la misión');
  else mal(copiados.length + ' dato(s) copiados en el HTML; el primero: «' + copiados[0] + '»');
}

/* ---------- la misión hermana ---------- */
console.log('\n🇭🇳 La misma definición que en Aspectos Cívicos');
if (!fs.existsSync(CIVICOS)) {
  avisa('no está la misión de Aspectos Cívicos: no se pudo comparar la definición');
} else {
  /* No se compara letra por letra —son dos redacciones, una larga y otra de
     una línea—: se busca la TIRADA DE PALABRAS más larga que las dos
     comparten. Si alguien cambia «defiende a su pueblo» por otra cosa en un
     solo sitio, la tirada se cae y esto se pone rojo. Es la misma técnica que
     usa la sonda del Himno para juzgar una cita. */
  const suyo = limpia(pelar(fs.readFileSync(CIVICOS, 'utf8')));
  const MINIMO = 4;
  for (const [que, texto] of [['héroe', PROCERES_DIFERENCIA.heroe], ['prócer', PROCERES_DIFERENCIA.procer]]) {
    const pal = limpia(texto).split(' ');
    let mejor = 0, cual = '';
    for (let i = 0; i < pal.length; i++) {
      for (let j = i + 1; j <= pal.length; j++) {
        const t = pal.slice(i, j).join(' ');
        if (!suyo.includes(t)) break;
        if (j - i > mejor) { mejor = j - i; cual = t; }
      }
    }
    if (mejor >= MINIMO) ok('la definición de ' + que + ' coincide con la de Aspectos Cívicos: «' + cual + '»');
    else mal('la definición de ' + que + ' ya no coincide con la de Aspectos Cívicos (comparten ' + mejor
      + ' palabra(s) seguidas y hacen falta ' + MINIMO + '): el alumno leería dos definiciones distintas');
  }
}

console.log('\n' + (fallos
  ? '❌ ' + fallos + ' fallo(s)' + (avisos ? ', ' + avisos + ' aviso(s)' : '')
  : '✅ la pantalla y el papel dicen los mismos próceres' + (avisos ? ' (' + avisos + ' aviso)' : '')) + '\n');
process.exit(fallos ? 1 : 0);
