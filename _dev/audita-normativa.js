/* ============================================================
   M.E.T.A.S · La normativa de la vara, pasada por las misiones
   ------------------------------------------------------------
   Uso:  node _dev/audita-normativa.js            (el resumen)
         node _dev/audita-normativa.js --detalle  (misión por misión)

   La primera normativa del proyecto —«esto se hace para ser lo
   mejor que hay»— acaba en cuatro preguntas, y tres de ellas son
   de juicio: a quién le pasa, si seguiría abriéndolo sin medalla,
   si puedo acreditar el dato. Esas no las contesta un programa.

   Pero hay trozos que SÍ se miden, y son justo los que se cuelan
   al copiar una misión ochenta y tres veces. Esto los mide:

   1 · ENGANCHE PROHIBIDO. Rachas que castigan, cuentas atrás que
       presionan, premios al azar, «no pierdas lo que llevas». La
       normativa los prohíbe por escrito: secuestran la atención de
       un niño en vez de ganársela.
   2 · EL ELOGIO DEPENDE DEL RESULTADO. Un «¡Bien hecho!» con 0 de
       8 ya estuvo publicado en 64 misiones. Se arregló; esto
       comprueba que siga arreglado.
   3 · NO SE CORRIGE SOLO CON COLOR. Uno de cada doce niños no
       distingue el rojo del verde. El proyecto ya lo sabe —el quiz
       de los videos lleva ✓ y ✗ por eso— pero cada misión tiene sus
       propias clases de acierto y fallo, y ahí es donde se pierde.
   4 · NINGUNA CIFRA QUE ENVEJEZCA. «Son 57 misiones» envejece en
       una semana. Donde hay JavaScript el número se cuenta.

   ⚠️ Nació como auditoría —una lista de trabajo— y se quedó en la
   tanda de `npm test` en cuanto las 83 misiones pasaron: lo que hoy
   está limpio tiene que SEGUIR limpio, y el día que entre una misión
   nueva con el acierto dicho solo en verde, esto se pone rojo antes
   de que llegue al teléfono de un niño.

   Lo que sale aquí son las cuatro cosas MEDIBLES. Las otras tres
   preguntas de la normativa —a quién le pasa, si seguiría abriéndolo
   sin medalla, si puedo acreditar el dato— son de juicio y las
   contesta una persona; se imprimen al final para que no se olviden.
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const DETALLE = process.argv.includes('--detalle');

/* Los números no se escriben: se cuentan. */
/* Las hojas que TODAS las misiones cargan después de la suya. Lo que
   esté aquí vale para las 83 a la vez: es el mismo permiso que ya
   tienen la barra de secciones y el teclado de las actividades. */
const CSS_COMPARTIDO = ['css/senal-no-color.css', 'css/teclado-actividades.css']
  .filter(f => fs.existsSync(path.join(RAIZ, f)))
  .map(f => fs.readFileSync(path.join(RAIZ, f), 'utf8')).join('\n');

const MISIONES = fs.readdirSync(path.join(RAIZ, 'misiones'))
  .filter(d => fs.statSync(path.join(RAIZ, 'misiones', d)).isDirectory())
  .sort();

/* Se quitan los COMENTARIOS antes de buscar un texto prohibido. Es la
   cuarta lección del archivo y ya mordió cuatro veces: el sitio donde
   se explica por qué algo no se hace es justo donde ese algo está
   escrito. */
function sinComentarios(txt){
  return txt.replace(/\/\*[\s\S]*?\*\//g, ' ')
            .replace(/(^|[^:])\/\/[^\n]*/g, '$1 ')
            .replace(/<!--[\s\S]*?-->/g, ' ');
}
function archivos(dir, ext){
  const r = [];
  (function anda(d){
    for(const f of fs.readdirSync(d)){
      const p = path.join(d, f);
      if(fs.statSync(p).isDirectory()){ anda(p); continue; }
      if(ext.some(e => f.endsWith(e)) && !/html2canvas|\.min\./.test(f)) r.push(p);
    }
  })(dir);
  return r;
}

/* ============================================================
   1 · Enganche prohibido
   ------------------------------------------------------------
   No se busca la palabra «racha»: una racha que celebra está bien
   y la usan los juegos 3D. Lo que la normativa prohíbe es la que
   CASTIGA —la que amenaza con lo que se pierde— y el premio al
   azar, que es la mecánica de la máquina tragamonedas.
   ============================================================ */
const ENGANCHE = [
  {re: /no\s+pierdas\s+(tu|la|el)\s/i,            que:'amenaza con lo que se pierde'},
  {re: /perder[ií]as?\s+(tu|la|el)\s+(racha|progreso)/i, que:'amenaza con lo que se pierde'},
  {re: /racha\s+perdida|perdiste\s+(tu|la)\s+racha/i,    que:'castiga por faltar'},
  {re: /vuelve\s+ma[ñn]ana\s+o\s+pierdes/i,       que:'castiga por faltar'},
  {re: /[úu]ltima\s+oportunidad|solo\s+por\s+hoy/i, que:'urgencia fabricada'},
  {re: /premio\s+sorpresa|recompensa\s+aleatoria/i, que:'premio al azar'}
];

/* ============================================================
   2 · El elogio del Reto depende del resultado
   ------------------------------------------------------------
   ⚠️ La primera versión de esto buscaba «¡Perfecto!» y «¡Excelente!»
   sueltos, y era INSERVIBLE: marcaba «Cuadrado Perfecto» —que es
   contenido de matemáticas, no un elogio— 28 veces en una sola
   misión. Una herramienta que acusa a un archivo sano enseña a no
   mirarla, así que se estrechó a lo único que aquí se puede afirmar
   sin adivinar.

   Lo que se comprueba es lo que ya se arregló una vez en 64
   misiones: que el elogio del Reto salga de un UMBRAL y no a secas.
   El Reto llegó a decir «¡Bien hecho!» en verde con 0 de 8, y ese
   número acaba en la Constancia que el alumno le enseña a su
   familia.
   ============================================================ */
const TIENE_RETO = /reto(Ok|Score|Aciertos|Total)|s-reto/;
const UMBRAL = /(pct|porcentaje|retoOk|aciertos|correctas)\s*(>=|>|<=|<)\s*\d/;

/* ============================================================
   3 · No se corrige solo con color
   ============================================================ */
const ACIERTO = /(^|[-_])(ok|correct[ao]?|bien|good|hallada|acierto)$/i;
/* ⚠️ `no` entra en la lista: las clases de fallo de Clasifica y de la
   evaluación se llaman `cls-no` y `eval-input-no`, y sin esto se
   escapaban las dos —o sea, justo las 145 que había que encontrar—. */
const FALLO   = /(^|[-_])(wrong|mal[ao]?|bad|error|fallo|incorrect[ao]?|no|nok)$/i;
/* Señales que NO son color: un glifo, un subrayado, un grosor, un
   borde distinto, o un símbolo escrito por el JS dentro del elemento. */
/* `animation` cuenta como señal: `.shake-error` avisa MOVIÉNDOSE, y un
   temblor lo ve quien no distingue el rojo del verde. Darlo por color
   era el falso positivo de la primera pasada — y una herramienta que
   acusa a un archivo sano enseña a no mirarla. */
const NO_ES_COLOR = /content\s*:|text-decoration|font-weight|border-style|outline-style|box-shadow|transform|opacity|animation/i;
const GLIFOS = /[✓✔✗✘×√…☑☒]/;

function claseEstado(css, clase){
  /* Todas las reglas donde aparece esa clase, con su cuerpo. */
  const re = new RegExp('\\.' + clase.replace(/[-]/g, '\\-') + '(?![\\w-])[^{}]*\\{([^}]*)\\}', 'g');
  let m, cuerpos = [], sel = [];
  while((m = re.exec(css))){
    cuerpos.push(m[1]);
    sel.push(m[0].slice(0, m[0].indexOf('{')));
  }
  return {cuerpos, sel};
}

/* ============================================================
   4 · Cifras que envejecen
   ------------------------------------------------------------
   Un «son 57 misiones» escrito a mano. Se busca el número pegado a
   la palabra, y se perdona el que va fechado o con el rumbo a la
   vista, que es lo que la normativa del papel permite.
   ============================================================ */
const CIFRA = /\b(\d{2,3})\s+(misiones|rutas|materias)\b/gi;
const FECHADA = /(hoy|en\s+\w+\s+de\s+20\d\d|siguen\s+entrando|y\s+subiendo|por\s+ahora)/i;

/* ============================================================ */
const hallazgos = {enganche:[], elogio:[], color:[], cifra:[]};
let nJS = 0, nCSS = 0, nHTML = 0, nClases = 0;

for(const mis of MISIONES){
  const dir = path.join(RAIZ, 'misiones', mis);
  const js   = archivos(dir, ['.js']);
  const css  = archivos(dir, ['.css']);
  const html = archivos(dir, ['.html']).filter(f => !/juego-.*-3d\.html$/.test(f));
  nJS += js.length; nCSS += css.length; nHTML += html.length;

  const textoVisible = [...js, ...html].map(f => sinComentarios(fs.readFileSync(f, 'utf8'))).join('\n');
  const jsTodo = js.map(f => sinComentarios(fs.readFileSync(f, 'utf8'))).join('\n');
  const jsDeLaMision = () => jsTodo;
  /* ⚠️ La hoja COMPARTIDA cuenta como CSS de la misión. Sin esto, la
     auditoría seguiría acusando a las 75 de algo que ya se arregló en
     un solo archivo — y una herramienta que se pone roja cuando todo
     está bien enseña a no mirarla. */
  const todoCSS = css.map(f => fs.readFileSync(f, 'utf8')).join('\n') + '\n' + CSS_COMPARTIDO;

  /* 1 · enganche */
  for(const e of ENGANCHE){
    const m = textoVisible.match(e.re);
    if(m) hallazgos.enganche.push({mis, que:e.que, texto:m[0].trim().slice(0, 60)});
  }

  /* 2 · el elogio del Reto pasa por un umbral */
  if(TIENE_RETO.test(jsDeLaMision(js)) && !UMBRAL.test(jsDeLaMision(js))){
    hallazgos.elogio.push({mis, arch:'(el Reto)', linea:0,
      texto:'el Reto felicita sin mirar el resultado'});
  }

  /* 3 · corrección solo por color */
  const clases = new Set();
  const reClase = /classList\.(?:add|toggle)\(\s*['"]([\w-]+)['"]/g;
  let mm;
  while((mm = reClase.exec(jsTodo))) clases.add(mm[1]);
  for(const c of clases){
    const esAcierto = ACIERTO.test(c), esFallo = FALLO.test(c);
    if(!esAcierto && !esFallo) continue;
    const {cuerpos} = claseEstado(todoCSS, c);
    if(!cuerpos.length) continue;          // sin CSS propio: no se juzga
    nClases++;
    const junto = cuerpos.join(' ');
    const tieneSenal = NO_ES_COLOR.test(junto) || GLIFOS.test(junto);
    /* o el JS le escribe el símbolo dentro */
    const cercaJS = new RegExp("['\"]" + c + "['\"][\\s\\S]{0,400}?" + GLIFOS.source).test(jsTodo) ||
                    new RegExp(GLIFOS.source + "[\\s\\S]{0,400}?['\"]" + c + "['\"]").test(jsTodo);
    if(!tieneSenal && !cercaJS){
      hallazgos.color.push({mis, clase:c, lado: esAcierto ? 'acierto' : 'fallo',
                            css: junto.replace(/\s+/g,' ').trim().slice(0, 80)});
    }
  }

  /* 4 · cifras que envejecen */
  for(const f of [...js, ...html]){
    const t = sinComentarios(fs.readFileSync(f, 'utf8'));
    let c;
    const re = new RegExp(CIFRA.source, 'gi');
    while((c = re.exec(t))){
      const ctx = t.slice(Math.max(0, c.index-90), c.index + 60).replace(/\s+/g,' ');
      if(FECHADA.test(ctx)) continue;
      hallazgos.cifra.push({mis, arch:path.basename(f), texto:c[0], ctx:ctx.slice(-90)});
    }
  }
}

/* ============================================================ */
function bloque(titulo, lista, pinta){
  const mis = new Set(lista.map(x => x.mis));
  console.log('\n' + titulo);
  console.log('  ' + (lista.length === 0
    ? '✅ nada que mirar'
    : '⚠️  ' + lista.length + ' en ' + mis.size + ' misión(es)'));
  if(lista.length && DETALLE) lista.forEach(x => console.log('     · ' + pinta(x)));
  else if(lista.length) {
    [...mis].slice(0, 12).forEach(m => console.log('     · ' + m +
      ' (' + lista.filter(x => x.mis === m).length + ')'));
    if(mis.size > 12) console.log('     … y ' + (mis.size-12) + ' más (--detalle)');
  }
  return mis.size;
}

console.log('════════════════════════════════════════════════════════');
console.log(' La vara, pasada por ' + MISIONES.length + ' misiones');
console.log(' (' + nHTML + ' páginas, ' + nJS + ' JS, ' + nCSS + ' CSS · ' +
            nClases + ' clases de acierto/fallo con estilo propio)');
console.log('════════════════════════════════════════════════════════');

bloque('1 · Enganche prohibido (castiga, presiona o premia al azar)',
  hallazgos.enganche, x => x.mis + ' · ' + x.que + ': «' + x.texto + '»');
bloque('2 · El Reto felicita sin mirar el resultado',
  hallazgos.elogio, x => x.mis + ' · ' + x.arch + ':' + x.linea + ' «' + x.texto + '»');
bloque('3 · Corrige SOLO con color (uno de cada doce no lo ve)',
  hallazgos.color, x => x.mis + ' · .' + x.clase + ' [' + x.lado + '] → ' + x.css);
bloque('4 · Cifra que envejece, escrita a mano',
  hallazgos.cifra, x => x.mis + ' · ' + x.arch + ' «' + x.texto + '» … ' + x.ctx);

const total = Object.values(hallazgos).reduce((a, l) => a + l.length, 0);
console.log('\n════════════════════════════════════════════════════════');
console.log(total === 0
  ? ' ✅ Las ' + MISIONES.length + ' misiones pasan lo que se puede medir'
  : ' ⚠️  ' + total + ' cosas que mirar en las ' + MISIONES.length + ' misiones');
console.log(' Lo que NO mide esto, y hay que contestar a mano en cada una:');
console.log('   · ¿A quién le pasa esto y qué le cuesta?');
console.log('   · Sin puntaje ni medalla, ¿seguiría queriendo abrirlo?');
console.log('   · ¿Puedo acreditar cada dato que afirma?');
console.log('════════════════════════════════════════════════════════');

/* Sale con error si hay algo que mirar: si no, sería una sonda verde
   que no puede fallar, y eso es peor que no tenerla. */
process.exit(total === 0 ? 0 : 1);
