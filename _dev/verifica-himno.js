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
     crítico en que una alumna copia la séptima estrofa MAL, con el primer verso
     repetido. Ese error está escrito a propósito y es lo que se le pide
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

  /* Las animaciones de la misión tampoco llevan letra escrita a mano. La que
     va tras la historia (el coro escrito y el cantado) saca los versos de
     himno.js y CALCULA la repetición; las tres que explican el contenido (el
     mapa de los viajes, la película de las estrofas y el Escudo) citan los
     versos sacándolos de himno.js por estrofa, verso y palabra. Un pedazo de
     letra escrito en una de ellas sería un segundo original. Se busca en sus
     cadenas, sin los comentarios, cualquier tirada de cuatro palabras del
     Himno; y se cuentan leyendo la carpeta, no escritas aquí. */
  const DIRJS = path.join(RAIZ, 'misiones', '2y3ciclo-himno-nacional', 'js');
  const anims = fs.readdirSync(DIRJS).filter(f => /^animacion-.*\.js$/.test(f)).sort();
  anims.forEach(f => {
    const a = fs.readFileSync(path.join(DIRJS, f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    const cadenas = (a.match(/'(?:[^'\\\n]|\\.)*'/g) || []).map(t => t.slice(1, -1));
    const conLetra = cadenas.filter(t => {
      const p = limpia(t).split(' ');
      for (let i = 0; i + 4 <= p.length; i++) if (letraPlana.includes(p.slice(i, i + 4).join(' '))) return true;
      return false;
    });
    const usa = /\bHIMNO\b/.test(a) && (f !== 'animacion-coro.js' || /HIMNO_CORO_CANTADO/.test(a));
    if (!conLetra.length && usa) ok(f + ' no escribe la letra: la saca de js/data/himno.js');
    else mal(f + ' escribe letra a mano: «' + (conLetra[0] || 'no usa HIMNO') + '»');
  });
  if (anims.length < 4) mal('la misión lleva ' + anims.length + ' animaciones y se esperaban al menos 4 (el coro, el Escudo, la película y los viajes)');
}

/* ── Los años de cada estrofa (el campo «cuando») ─────────────────────────
   La película del Himno pone cada estrofa en su año, y esos años no se
   escriben en la animación: salen de aquí. Así que cada año tiene que seguir
   escrito en la explicación o en el dato de su estrofa, que es lo que lo
   acredita en la pantalla; y entre sí tienen que cuadrar, porque la película
   enseña que la segunda cae con la primera y que la colonia termina el año
   de la Independencia. Si dejan de cuadrar, la animación no se monta: se
   prefiere a que enseñe una línea de años que contradice la explicación. */
console.log('\n🎬 Los años de cada estrofa (campo «cuando» de himno.js)');
{
  const C = {};
  HIMNO.forEach(e => { C[e.clave] = e; });
  const escrito = (e, anio) => (e.explicacion + ' ' + (e.dato || '')).includes(String(anio));
  const faltan = [];
  ['e1', 'e2', 'e3', 'e4', 'e5', 'e6'].forEach(k => {
    const c = C[k].cuando;
    if (!c || typeof c.anio !== 'number') return faltan.push(k + ': no trae su año');
    const fuente = c.comoLa ? C[c.comoLa] : C[k];
    if (!escrito(fuente, c.anio)) faltan.push(k + ': ' + c.anio + ' no está escrito en su explicación ni en su dato');
    if (c.hasta && !escrito(C[k], c.hasta)) faltan.push(k + ': ' + c.hasta + ' no está escrito en su explicación ni en su dato');
  });
  if (faltan.length) faltan.forEach(t => mal(t));
  else ok('cada año de las seis primeras está escrito en su explicación o en su dato');
  const cu = k => C[k].cuando || {};
  if (C.e7.cuando === null && /promete/.test(C.e7.explicacion)) ok('la séptima no tiene año: su explicación dice que promete');
  else mal('la séptima no puede tener año (no cuenta el pasado), y su explicación tiene que decirlo');
  if (cu('e2').comoLa === 'e1' && cu('e2').anio === cu('e1').anio) ok('la segunda cuenta la misma llegada que la primera, y cae en su mismo año');
  else mal('la segunda tiene que caer en el año de la primera (cuentan la misma llegada)');
  if (cu('e4').anio === cu('e1').anio && cu('e4').hasta === cu('e6').anio) ok('la colonia empieza con la llegada y termina el año de la Independencia (' + cu('e4').anio + ' a ' + cu('e4').hasta + ')');
  else mal('la colonia tiene que ir del año de la primera estrofa al de la sexta');
  if (cu('e3').hacia === true && /hacia/.test(C.e3.explicacion)) ok('el año de Lempira va como «hacia», igual que en su explicación');
  else mal('el año de Lempira no es exacto: tiene que ir con «hacia», en el dato y en la explicación');
  const orden = ['e1', 'e3', 'e5', 'e6'].map(k => cu(k).anio);
  if (orden.every((a, i) => i === 0 || a > orden[i - 1])) ok('los años van en el orden de las estrofas');
  else mal('los años no van en el orden de las estrofas: ' + orden.join(', '));
}

/* ── Los viajes de Colón (js/data/viajes-colon.js) ───────────────────────
   El mapa de la primera y la segunda estrofa sale de ese archivo, y dos cosas
   se comprueban aquí, sin abrir el navegador:
   · que diga lo mismo que la explicación de la primera estrofa (Colón llegó a
     Honduras en su cuarto viaje, en el año que ella dice), y
   · ⚠️ que el cuarto viaje NO cruce tierra: la cámara baja al Caribe para
     verlo de cerca, y ahí se dibuja la costa fina de contornos-mundo.js. Una
     ruta que pasa por encima de una isla o de la costa enseña un viaje que no
     se pudo hacer. Pasó al escribirla: el tramo que bajaba de las islas a la
     costa atravesaba Guanaja, y en la captura no se notaba. */
console.log('\n⛵ Los viajes de Colón');
{
  const cx = {};
  vm.createContext(cx);
  vm.runInContext(fs.readFileSync(path.join(RAIZ, 'js', 'data', 'viajes-colon.js'), 'utf8'), cx);
  vm.runInContext(fs.readFileSync(path.join(RAIZ, 'js', 'data', 'contornos-mundo.js'), 'utf8'), cx);
  const V = cx.VIAJES_COLON, M = cx.CONTORNOS_MUNDO;
  const e1 = HIMNO.find(e => e.clave === 'e1');
  const cuarto = V.find(v => v.honduras);
  if (V.length === 4 && V.every((v, i) => v.n === i + 1 && (i === 0 || v.anio > V[i - 1].anio)) && V.filter(v => v.honduras).length === 1 && cuarto.n === 4)
    ok('cuatro viajes en orden, y solo el cuarto llega a Honduras');
  else mal('los viajes tienen que ser cuatro, en orden, y llegar a Honduras solo el cuarto');
  if (cuarto && e1.explicacion.includes(String(cuarto.anio)) && /cuarto viaje/.test(e1.explicacion) && e1.cuando && e1.cuando.anio === cuarto.anio)
    ok('el mapa y la primera estrofa dicen lo mismo: Honduras, en ' + cuarto.anio + ', en el cuarto viaje');
  else mal('viajes-colon.js y la explicación de la primera estrofa no dicen lo mismo del viaje que llegó a Honduras');
  /* un punto está en tierra si cae dentro de un anillo (regla par-impar) */
  const dentro = (q, a) => {
    let si = false;
    for (let i = 0, j = a.length - 2; i < a.length; j = i, i += 2) {
      const xi = a[i], yi = a[i + 1], xj = a[j], yj = a[j + 1];
      if ((yi > q[1]) !== (yj > q[1]) && q[0] < (xj - xi) * (q[1] - yi) / (yj - yi) + xi) si = !si;
    }
    return si;
  };
  const tierra = [M.detalle.centroamerica.tierra, M.detalle.centroamerica.honduras].concat(M.detalle.islas.map(i => i.anillo));
  const nombre = k => k === 0 ? 'la costa' : k === 1 ? 'Honduras' : M.detalle.islas[k - 2].nombre;
  const ruta = cuarto.ruta.concat(cuarto.sigue ? [cuarto.sigue] : []);
  const choques = [];
  for (let t = 1; t < ruta.length; t++) {
    for (let j = 1; j < 50; j++) {
      const f = j / 50, q = [ruta[t - 1][0] + (ruta[t][0] - ruta[t - 1][0]) * f, ruta[t - 1][1] + (ruta[t][1] - ruta[t - 1][1]) * f];
      const k = tierra.findIndex(a => dentro(q, a));
      if (k >= 0) { choques.push('tramo ' + t + ' (' + nombre(k) + ')'); break; }
    }
  }
  if (!choques.length) ok('el cuarto viaje no cruza tierra: ni la costa fina de Centroamérica, ni Honduras, ni una isla');
  else mal('el cuarto viaje cruza tierra: ' + choques.join(', '));
}

/* ⚠️ El Himno no se enseña solo en su misión. Aspectos Cívicos —la etapa 1 de
   la misma ruta— resume en una tarjeta y en su ficha de qué habla cada estrofa,
   y el 25 de septiembre de 2026 se encontró que tenía la tercera y la cuarta AL
   REVÉS: la colonia donde va Lempira. Y el coro, describiendo solo la Bandera.
   El alumno abre las dos misiones seguidas, así que estudiaba un orden en la
   etapa 1 y el contrario en la etapa 2, y el diagnóstico de la ruta le pregunta
   el bueno. No lo cazaba nada: era texto bien escrito, en el sitio de siempre.

   No se exige la misma frase —«la llegada de Cristóbal Colón a la costa del
   Caribe» resume igual de bien la primera—: se exige que el resumen de cada
   estrofa se parezca MÁS a su propio tema de himno.js que al de cualquier otra.
   Es lo que un par de estrofas cambiadas de sitio no puede cumplir. */
console.log('\n🇭🇳 De qué habla cada estrofa, en Aspectos Cívicos');
{
  const CIVICOS = path.join(RAIZ, 'misiones', '2y3ciclo-aspectos-civicos', 'aspectos-civicos.html');
  const CIVJS = path.join(RAIZ, 'misiones', '2y3ciclo-aspectos-civicos', 'js', 'aspectos-civicos.js');
  const CIVFICHA = path.join(RAIZ, 'fichas', 'ficha-aspectos-civicos.html');
  const PARADA = new Set('el la los las de del y a al en que su sus un una por para con se lo le'.split(' '));
  /* Cinco letras bastan para juntar «colonia» con «colonial» y «Francia» con
     «Francesa», que es como se dice lo mismo con otras palabras. */
  const raices = (t) => new Set(pelar(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .split(/[^a-z0-9]+/).filter(p => p.length >= 3 && !PARADA.has(p)).map(p => p.slice(0, 5)));
  const parecido = (a, b) => { const B = raices(b); return [...raices(a)].filter(r => B.has(r)).length; };
  const estrofas = HIMNO.filter(e => e.clave !== 'coro').sort((a, b) => a.n - b.n);
  const coro = HIMNO.find(e => e.clave === 'coro');

  const revisaResumenes = (donde, resumenes) => {
    if (resumenes.length !== estrofas.length) { mal(donde + ': se leyeron ' + resumenes.length + ' resúmenes de estrofa y el Himno tiene ' + estrofas.length); return; }
    const malos = [];
    resumenes.forEach((txt, i) => {
      const puntos = estrofas.map(e => parecido(txt, e.tema));
      const mejor = Math.max(...puntos);
      if (!mejor) malos.push((i + 1) + 'ª dice «' + pelar(txt) + '», que no se parece al tema de ninguna estrofa (la suya es «' + estrofas[i].tema + '»)');
      else if (puntos[i] < mejor) malos.push((i + 1) + 'ª dice «' + pelar(txt) + '», que es «' + estrofas[puntos.indexOf(mejor)].tema + '» (' + estrofas[puntos.indexOf(mejor)].titulo.toLowerCase() + ')');
    });
    if (malos.length) malos.forEach(m => mal(donde + ', la ' + m));
    else ok(donde + ': las ' + resumenes.length + ' estrofas, cada una con su tema y en su orden');
  };

  const html = fs.readFileSync(CIVICOS, 'utf8');
  revisaResumenes('la pantalla', [...html.matchAll(/<div class="t-art">\S+\s+(?:Primera|Segunda|Tercera|Cuarta|Quinta|Sexta|Séptima)<\/div><div class="t-info">([\s\S]*?)<\/div>/g)].map(m => m[1]));
  const ficha = fs.readFileSync(CIVFICHA, 'utf8');
  revisaResumenes('la ficha', [...ficha.matchAll(/<tr><td class="k">[1-7]ª<\/td><td>([\s\S]*?)<\/td><\/tr>/g)].map(m => m[1]));

  /* El coro PINTA dos símbolos, la Bandera y el Escudo, y decir solo uno es
     enseñar la mitad de la respuesta que el diagnóstico de la ruta pide. */
  const hace = raices(coro.tema);
  const dichos = [
    ['la pantalla', (html.match(/El coro<\/div><div class="t-info">([\s\S]*?)<\/div>/) || [])[1]],
    ['el Laboratorio', (fs.readFileSync(CIVJS, 'utf8').match(/coro describe ([^:<]*)/) || [])[1]],
    ['la ficha', (ficha.match(/El coro<\/b>([\s\S]*?):/) || [])[1]]
  ];
  dichos.forEach(([donde, t]) => {
    if (!t) return mal(donde + ' de Aspectos Cívicos ya no dice qué describe el coro: ¿cambió la forma del texto?');
    const faltan = [...hace].filter(r => !raices(t).has(r));
    if (faltan.length) mal(donde + ' de Aspectos Cívicos dice que el coro describe «' + pelar(t).replace(/^describe\s+/i, '') + '» y el Himno dice «' + coro.tema + '»');
    else ok(donde + ' de Aspectos Cívicos: el coro describe ' + coro.tema.toLowerCase());
  });
}

console.log('\n' + (fallos
  ? '❌ ' + fallos + ' fallo(s)' + (avisos ? ', ' + avisos + ' aviso(s)' : '')
  : '✅ la pantalla y el papel dicen el mismo Himno' + (avisos ? ' (' + avisos + ' aviso)' : '')) + '\n');
process.exit(fallos ? 1 : 0);
