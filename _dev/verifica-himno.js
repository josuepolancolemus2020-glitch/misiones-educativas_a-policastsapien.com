/* ══════════════════════════════════════════════════════════════
   M.E.T.A.S · El Himno dice lo mismo en la pantalla y en el papel
   ──────────────────────────────────────────────────────────────
   La letra del Himno Nacional vive en UN solo archivo,
   `js/data/himno.js`. De ahí la saca la misión (que la pinta al
   vuelo) y de ahí salió la ficha que el maestro fotocopia
   (`fichas/ficha-himno-nacional.html`), que es HTML plano como
   todas las demás del proyecto.

   Ese «salió de ahí» es justo lo que se despinta con el tiempo:
   alguien corrige una coma en la ficha, o la vuelve a armar de
   otra fuente, y a partir de ese día el alumno estudia una letra
   y el examen le pide la otra. En sexto y en noveno se le pide
   ESCRIBIR una estrofa; una coma de más se la corrigen en rojo.

   Por eso esta sonda compara la ficha contra el archivo de datos
   VERSO POR VERSO, con los 64 versos del Himno más los ocho del
   coro cantado. No lee páginas ni mide hojas —de eso ya se
   encargan verifica-ficha-paginas.js y reparte-hojas-ficha.js—:
   solo comprueba que las dos copias digan exactamente lo mismo.

   Y mira una segunda cosa que cuesta igual de caro: que la misión
   NO lleve la letra escrita a mano. Si algún día alguien la copia
   dentro del HTML de la misión «para que cargue antes», vuelve a
   haber dos originales y esta sonda deja de servir para nada.

   Uso:  node _dev/verifica-himno.js
   ══════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RAIZ = path.resolve(__dirname, '..');
const FICHA = path.join(RAIZ, 'fichas', 'ficha-himno-nacional.html');
const MISION = path.join(RAIZ, 'misiones', '2y3ciclo-himno-nacional', 'himno-nacional.html');
const JSMISION = path.join(RAIZ, 'misiones', '2y3ciclo-himno-nacional', 'js', 'himno-nacional.js');

let fallos = 0, avisos = 0;
const ok = (t) => console.log('  ✅ ' + t);
const mal = (t) => { fallos++; console.log('  ❌ ' + t); };
const avisa = (t) => { avisos++; console.log('  ⚠️  ' + t); };

// ---------- el original ----------
const ctx = {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(RAIZ, 'js', 'data', 'himno.js'), 'utf8') +
  '\nthis.X = { HIMNO, HIMNO_AUTORES, HIMNO_CORO_CANTADO };', ctx);
const { HIMNO, HIMNO_CORO_CANTADO } = ctx.X;

/* Los versos se comparan con el texto PELADO: sin etiquetas, sin las entidades
   del HTML y con los espacios apretados. Lo que tiene que coincidir son las
   palabras y la puntuación, no cómo esté maquetado el papel. */
function pelar(html) {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/\s+/g, ' ')
    .trim();
}

console.log('\n📖 El Himno, del archivo de datos');
/* En el ORDEN en que la ficha los imprime: el coro, en seguida el coro
   cantado —que va pegado a él, para que se vea la diferencia de un vistazo—
   y después las siete estrofas. */
const esperados = [];
HIMNO.forEach(e => {
  e.versos.forEach((v, i) => esperados.push({ de: e.titulo, n: i + 1, v }));
  if (e.clave === 'coro') HIMNO_CORO_CANTADO.forEach((v, i) => esperados.push({ de: 'Coro cantado', n: i + 1, v }));
});
if (HIMNO.length === 8) ok('8 partes: el coro y las siete estrofas');
else mal('el Himno tiene ' + HIMNO.length + ' partes y deberían ser 8');
const raros = HIMNO.filter(e => e.versos.length !== 8);
if (!raros.length) ok('las 8 partes traen 8 versos cada una (' + (HIMNO.length * 8) + ' versos)');
else mal('no llevan 8 versos: ' + raros.map(e => e.titulo + ' (' + e.versos.length + ')').join(', '));

// ---------- la ficha ----------
console.log('\n📄 La ficha que se fotocopia');
if (!fs.existsSync(FICHA)) {
  mal('no existe fichas/ficha-himno-nacional.html');
} else {
  const ficha = fs.readFileSync(FICHA, 'utf8');
  /* Cada verso de la ficha va en su propio <span class="v">, con su número
     dentro en un <i>. Se pela el número junto con la etiqueta. */
  const enFicha = (ficha.match(/<span class="v">[\s\S]*?<\/span>/g) || [])
    .map(s => pelar(s.replace(/<i>\d+<\/i>/, '')));

  if (enFicha.length === esperados.length) {
    ok(enFicha.length + ' versos impresos, los mismos que trae el archivo');
  } else {
    mal('la ficha imprime ' + enFicha.length + ' versos y el archivo tiene ' + esperados.length);
  }

  let distintos = 0;
  const n = Math.min(enFicha.length, esperados.length);
  for (let i = 0; i < n; i++) {
    if (enFicha[i] !== esperados[i].v) {
      distintos++;
      if (distintos <= 5) {
        mal(esperados[i].de + ', verso ' + esperados[i].n + ':');
        console.log('       archivo: «' + esperados[i].v + '»');
        console.log('       ficha:   «' + enFicha[i] + '»');
      }
    }
  }
  if (distintos > 5) mal('…y ' + (distintos - 5) + ' verso(s) más que no coinciden');
  if (!distintos && n) ok('los ' + n + ' versos dicen lo mismo, palabra por palabra');

  /* El QR de la portada: sin él, el papel no lleva a la misión. */
  if (/qr-mision-himno-nacional\.png/.test(ficha)) ok('la portada lleva su código QR');
  else mal('la portada no lleva el QR de la misión');

  /* La normativa del papel: el círculo se RELLENA, la ✗ es para lo que está
     mal. Se quitan antes los comentarios, que es donde se explica la regla. */
  const sinComentarios = ficha.replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
  if (/marca con una ✗|marca con ✗|con una ✗/i.test(sinComentarios)) mal('alguna actividad pide marcar con ✗ en vez de rellenar el círculo');
  else ok('la selección múltiple pide rellenar el círculo, no la ✗');
}

// ---------- la misión ----------
console.log('\n📱 La misión');
if (!fs.existsSync(MISION)) {
  mal('no existe la misión del Himno');
} else {
  const html = fs.readFileSync(MISION, 'utf8');
  if (/<script src="\.\.\/\.\.\/js\/data\/himno\.js"><\/script>/.test(html)) ok('carga js/data/himno.js');
  else mal('la misión no carga js/data/himno.js');

  /* Que el archivo de datos vaya ANTES del JS de la misión: ese lo usa para
     armar el Laboratorio y el texto de las estrofas nada más cargar. */
  const iDatos = html.indexOf('js/data/himno.js');
  const iMision = html.indexOf('js/himno-nacional.js');
  if (iDatos >= 0 && iMision >= 0 && iDatos < iMision) ok('los datos van antes del JS de la misión');
  else mal('js/data/himno.js tiene que ir ANTES de js/himno-nacional.js');

  /* Los huecos que rellena pintarHimnoMapa/pintarHimnoLista. */
  for (const id of ['himno-mapa', 'himno-lista']) {
    if (html.includes('id="' + id + '"')) ok('el hueco #' + id + ' está en la página');
    else mal('falta el hueco #' + id);
  }

  /* Y lo que de verdad vigila esta parte: que NADIE haya copiado la letra
     dentro del HTML. Con dos originales, esta sonda deja de servir. */
  const sinComentarios = html.replace(/<!--[\s\S]*?-->/g, '');
  const copiados = HIMNO.flatMap(e => e.versos).filter(v => sinComentarios.includes(v));
  if (!copiados.length) ok('ningún verso está escrito a mano en el HTML de la misión');
  else mal(copiados.length + ' verso(s) copiados en el HTML; el primero: «' + copiados[0] + '»');

  /* En el JS de la misión SÍ se citan versos a propósito: las actividades
     preguntan por ellos («¿de qué parte es este verso?»). Prohibirlo no
     serviría de nada; lo que hay que vigilar es otra cosa, y es la que de
     verdad enseña mal: que un verso CITADO no diga lo que dice el Himno. Un
     «marcharemos a la muerte» recortado se le queda grabado al alumno, y así
     lo escribe en el examen, donde se lo corrigen en rojo.

     Se juzga solo lo que de verdad pretende ser una cita del Himno: lo que
     comparte con él una tirada de CUATRO palabras seguidas. Con eso quedan
     fuera solas las felicitaciones, los títulos y los rótulos de la pantalla,
     sin tener que ir nombrándolos uno por uno. Y se compara sin distinguir
     mayúsculas ni signos: «Infame eslabón» es el mismo verso que «infame
     eslabón», porque en la tarjeta encabeza y en el Himno va a media frase. */
  const js = fs.readFileSync(JSMISION, 'utf8');
  const limpia = (s) => s.toLowerCase()
    .replace(/[«».,;:¡!¿?…—–-]/g, ' ')
    .replace(/\s+/g, ' ').trim();
  const letraPlana = limpia(HIMNO.flatMap(e => e.versos).concat(HIMNO_CORO_CANTADO).join(' '));

  /* La única excepción, y va nombrada con su motivo: el caso de pensamiento
     crítico en que una alumna copia el coro MAL, con las repeticiones que se
     cantan. Ese error está escrito a propósito y es lo que se le pide
     detectar; si coincidiera con el Himno, el caso no tendría gracia. */
  const APROPOSITO = [
    'Por guardar ese emblema divino, por guardar ese emblema divino, marcharemos, oh patria, a la muerte…'
  ];

  const citas = [...new Set((js.match(/«[^»]{12,}»/g) || []).map(c => c.slice(1, -1).trim()))]
    .filter(c => !APROPOSITO.includes(c));
  const pretende = citas.filter(c => {
    const p = limpia(c).split(' ');
    for (let i = 0; i + 4 <= p.length; i++) {
      if (letraPlana.includes(p.slice(i, i + 4).join(' '))) return true;
    }
    return false;
  });
  const inventadas = pretende.filter(c => !letraPlana.includes(limpia(c)));
  if (!pretende.length) avisa('el JS no cita ningún verso: ¿se quedaron las actividades sin texto del Himno?');
  else if (!inventadas.length) ok('las ' + pretende.length + ' citas del JS dicen lo que dice el Himno');
  else {
    mal(inventadas.length + ' cita(s) del JS no coinciden con el Himno:');
    inventadas.slice(0, 6).forEach(c => console.log('       «' + c + '»'));
  }
}

console.log('\n' + (fallos
  ? '❌ ' + fallos + ' fallo(s)' + (avisos ? ', ' + avisos + ' aviso(s)' : '')
  : '✅ la pantalla y el papel dicen el mismo Himno' + (avisos ? ' (' + avisos + ' aviso)' : '')) + '\n');
process.exit(fallos ? 1 : 0);
