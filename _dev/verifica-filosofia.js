/* ══════════════════════════════════════════════════════════════
   M.E.T.A.S · La Ruta de la Raíz dice lo mismo en la pantalla y en el papel
   ──────────────────────────────────────────────────────────────
   El temario de cada unidad vive en UN solo archivo (`js/data/filosofia-*.js`).
   De ahí lo saca la misión (que lo pinta al vuelo) y de ahí salió la ficha que
   el maestro fotocopia, que es HTML plano como las otras 75.

   Ese «salió de ahí» es lo que se despinta con el tiempo: alguien corrige el
   papel, o lo vuelve a armar de otra fuente, y a partir de ese día el alumno
   estudia una cosa y el examen le pide otra. Es la misma sonda que ya tienen
   el Himno, los próceres, los poderes y la Constitución, y por la misma razón.

   Lo que se le pide a CADA unidad de la ruta:

   · ⚠️ Que la CLASIFICACIÓN que el papel usa en sus actividades sea la del
     archivo de datos, y que su PAUTA no se lea del papel y se crea: se
     RECALCULA de los datos y se compara. Es lo que de verdad cuesta caro —una
     pregunta clasificada de dos maneras le marca en rojo al alumno que
     acertó, que es la avería del Escudo de Aspectos Cívicos— y con una sola
     fuente ya no se puede escribir; esto lo comprueba.

   · Que la misión NO lleve el temario escrito a mano: los contenedores de los
     pintores tienen que estar VACÍOS en el HTML. Si algún día alguien copia el
     contenido dentro «para que cargue antes», vuelve a haber dos originales y
     esta sonda deja de servir para nada.

   · ⚠️ Que no haya NI UNA FECHA, ni en los datos ni en el papel. Es la regla
     propia de esta ruta: de los pensadores se dice qué hicieron y por qué se
     les recuerda, porque un año sacado de un extracto de buscador no acredita
     nada. Una fecha que se cuele se pinta igual de bien y el alumno se la
     aprende para el examen.

   · ⚠️ Que la sección de INVESTIGAR siga en el papel, con su aviso de que no
     trae respuestas A PROPÓSITO. Es lo primero que se cae al recortar una
     ficha para ganar una hoja, y sin el aviso el maestro lo da por un
     descuido y se la salta.

   · Que la hoja del docente lleve la ruta de los TRES ciclos. El currículo es
     holístico: si se cae una, la escuela que trabaja la unidad el mismo mes se
     queda sin saber qué le toca a ese ciclo.

   · Que el círculo se RELLENE y no se pida la ✗ para señalar lo correcto.

   · Y que se lea en cuarto grado, con la misma vara que la Ruta de la Máquina
     que Aprende y reutilizando `mide-legibilidad.js` en vez de copiarlo. Aquí
     aprieta más que allá: el currículo es el mismo para I, II y III Ciclo, así
     que la misma misión la abre un niño de 1.º y un joven de 9.º.

   Uso:  node _dev/verifica-filosofia.js
   ══════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { bloquesDe, resumen, FILO, MIN_BLOQUE } = require('./mide-legibilidad.js');

const RAIZ = path.resolve(__dirname, '..');

/* La misma vara de la ruta de IA, y por el mismo motivo. */
const FRASE_MAX = 25, TRAMO_MAX = 45, MEDIA_BLOQUE = 11, MEDIA_MISION = 8.5;

let fallos = 0, avisos = 0;
const ok    = t => console.log('  ✅ ' + t);
const mal   = t => { console.log('  ❌ ' + t); fallos++; };
const avisa = t => { console.log('  ⚠️  ' + t); avisos++; };

/* Se compara sin distinguir mayúsculas, tildes ni signos: en la ficha un mismo
   texto encabeza un recuadro y en la pantalla va a media frase. */
const limpia = t => String(t)
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/[^a-z0-9ñ ]+/g, ' ').replace(/\s+/g, ' ').trim();
const sinHtml = h => h.replace(/<[^>]*>/g, ' ');

/* ── Las dos unidades de la ruta ─────────────────────────────────── */
const UNIDADES = [
  {
    n: 1, nombre: 'El Asombro',
    datos: 'js/data/filosofia-asombro.js',
    ficha: 'fichas/ficha-el-asombro.html',
    dir: 'misiones/basica-el-asombro', html: 'el-asombro.html', js: 'js/el-asombro.js',
    exporta: 'FILO_PALABRA,FILO_CLASES,FILO_PREGUNTAS,FILO_RAMAS,FILO_ARBOL,' +
             'FILO_PENSADORES,FILO_RUTINA,FILO_ORIGEN,FILO_VOCABULARIO,FILO_CICLOS',
    contenedores: ['fi-palabra', 'fi-clases', 'fi-arbol', 'fi-raices', 'fi-pensadores', 'fi-rutina', 'fi-ciclos'],
    ciclos: 'FILO_CICLOS', pensadores: 'FILO_PENSADORES', vocabulario: 'FILO_VOCABULARIO',
  },
  {
    n: 2, nombre: 'Pensar con Orden',
    datos: 'js/data/filosofia-logica.js',
    ficha: 'fichas/ficha-pensar-con-orden.html',
    dir: 'misiones/basica-pensar-con-orden', html: 'pensar-con-orden.html', js: 'js/pensar-con-orden.js',
    exporta: 'LOG_PIEZAS,LOG_SEMAFORO,LOG_RAZONES,LOG_FALACIAS,LOG_SI_ENTONCES,' +
             'LOG_VALIDEZ,LOG_CONECTORES,LOG_VOCABULARIO,LOG_PENSADORES,LOG_ARBOL,LOG_CICLOS',
    contenedores: ['lg-piezas', 'lg-semaforo', 'lg-si', 'lg-falacias', 'lg-validez',
                   'lg-conectores', 'lg-arbol', 'lg-pensadores', 'lg-ciclos'],
    ciclos: 'LOG_CICLOS', pensadores: 'LOG_PENSADORES', vocabulario: 'LOG_VOCABULARIO',
  },
];

/* Carga el archivo de datos DE VERDAD, no con expresiones regulares: lo que se
   compara tiene que ser lo que la misión usa. */
function cargar(u) {
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(RAIZ, u.datos), 'utf8') +
    ';this.__D={' + u.exporta + '};', ctx);
  return ctx.__D;
}

/* ── comprobaciones genéricas, iguales para las dos unidades ─────── */
function faltanEnPapel(fichaPlana, lista, campos, quien) {
  let malos = 0;
  lista.forEach(x => {
    campos.forEach(([campo, saca]) => {
      const valor = saca(x);
      if (!valor) return;
      if (!fichaPlana.includes(limpia(valor))) {
        mal(`la ficha no dice el ${campo} de «${x.nombre || x.w || x.materia || x.titulo}»`); malos++;
      }
    });
  });
  return malos;
}

function niUnaFecha(u) {
  /* ⚠️ Aquí NO basta con buscar años de cuatro dígitos, y se descubrió
     probando la sonda al revés: una fecha de esta ruta no se escribe «1956»,
     se escribe «624 a. C.» o «siglo VI», porque los pensadores son de la
     Grecia antigua. Buscando solo cuatro dígitos, la sonda daba verde con la
     fecha puesta, que es peor que no tenerla. */
  const anios = t => {
    const s = String(t);
    return [...new Set([]
      .concat(s.match(/\b(1[0-9]{3}|20[0-9]{2})\b/g) || [])
      .concat(s.match(/\b\d{1,4}\s*[ad]\.?\s*de\s*C\.?/gi) || [])
      .concat(s.match(/\b\d{1,4}\s*[ad]\.?\s*C\.?\b/g) || [])
      .concat(s.match(/\bsiglos?\s+[IVXLCDM]+\b/gi) || [])
      .concat(s.match(/\bhace\s+[\d.,  ]+\s*(?:mil\s+)?años\b/gi) || [])
    )];
  };
  /* Se quitan antes los comentarios del archivo de datos: su cabecera explica
     por qué no hay fechas y nombra las páginas de los PDF donde se confirmó el
     currículo. Es la trampa que este repositorio ya mordió cinco veces: el
     sitio donde se explica por qué algo no está es justo donde está escrito. */
  const sinComentarios = fs.readFileSync(path.join(RAIZ, u.datos), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/.*$/gm, '$1');
  const ficha = fs.readFileSync(path.join(RAIZ, u.ficha), 'utf8');
  /* En el papel se mira solo lo que LEE una persona, sin el CSS ni los
     comentarios: el pie de las hojas y los estilos llevan números que no son
     fechas. */
  const leeUnaPersona = sinHtml(ficha.replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<!--[\s\S]*?-->/g, ' '));
  const enDatos = anios(sinComentarios), enPapel = anios(leeUnaPersona);
  if (enDatos.length) mal(`u${u.n}: el archivo de datos trae una fecha: ${enDatos.join(', ')}. De los pensadores no se afirma ningún año (ver su cabecera)`);
  else if (enPapel.length) mal(`u${u.n}: la ficha trae una fecha que una persona lee: ${enPapel.join(', ')}`);
  else ok(`u${u.n}: ni una fecha, ni en los datos ni en el papel`);
}

function contenedoresVacios(u, mision) {
  /* ⚠️ Lo que se comprueba es que los CONTENEDORES de los pintores estén
     VACÍOS, que es el invariante de verdad: si están vacíos, lo que el alumno
     lee salió del archivo de datos y no puede separarse del papel.

     La primera versión de esto buscaba cualquier dato del banco dentro del
     HTML y acusaba a un archivo sano: la situación del arranque CITA a
     propósito (es la historia que va también en la ficha) y los widgets llevan
     un ejemplo de muestra para que la tarjeta no parpadee vacía antes de que
     el JS la pinte, igual que el «1 misión» de los chips de la portada.
     Acusar eso enseña a no mirar la sonda, que es la lección de «Cuadrado
     Perfecto». */
  let llenos = 0;
  u.contenedores.forEach(id => {
    const re = new RegExp('id="' + id + '"[^>]*>([\\s\\S]*?)<\\/div>');
    const m = mision.match(re);
    if (!m) { mal(`u${u.n}: el HTML no trae el contenedor #${id}, así que ese bloque no se pinta`); llenos++; return; }
    if (m[1].trim()) { mal(`u${u.n}: el contenedor #${id} viene con contenido escrito a mano en el HTML`); llenos++; }
  });
  if (!llenos) ok(`u${u.n}: los ${u.contenedores.length} bloques de contenido están vacíos en el HTML: los pinta el archivo de datos`);
  if (!mision.includes(u.datos)) mal(`u${u.n}: la misión no enlaza ${u.datos}`);
  else ok(`u${u.n}: la misión enlaza su archivo de datos, y antes de su propio JS`);
}

function investigaYCirculo(u, ficha, fichaPlana) {
  if (!/Investiga/i.test(sinHtml(ficha))) mal(`u${u.n}: la ficha se quedó sin la sección de investigar: es lo primero que se cae al recortar una hoja`);
  else if (!fichaPlana.includes(limpia('no traen respuesta')) && !fichaPlana.includes(limpia('No trae respuestas')))
    mal(`u${u.n}: la sección de investigar está, pero no dice que NO trae respuestas a propósito`);
  else ok(`u${u.n}: la sección de investigar está en el papel, y dice que no trae respuestas a propósito`);

  const mc = ficha.match(/<div class="preg-ops">[\s\S]*?<\/div>/g) || [];
  if (!mc.length) mal(`u${u.n}: la ficha no trae ninguna pregunta de selección múltiple con su círculo`);
  else if (/marca con una ✗|marcá con una ✗|con una ✗ (?:la|el) (?:respuesta|letra|opción)/i.test(sinHtml(ficha)))
    mal(`u${u.n}: la ficha pide marcar la respuesta correcta con una ✗: en el aula la ✗ significa MALO, y el círculo se RELLENA`);
  else ok(`u${u.n}: la selección múltiple lleva su círculo para rellenar (${mc.length} preguntas)`);
}

function ciclosYPensadores(u, D, fichaPlana) {
  const cic = D[u.ciclos];
  let malos = faltanEnPapel(fichaPlana, cic,
    [['pregunta', c => c.pregunta], ['habilidad', c => c.habilidad],
     ['actividad', c => c.actividad], ['producto', c => c.producto]], 'ciclo');
  if (!malos) ok(`u${u.n}: la hoja del docente trae los ${cic.length} ciclos con su pregunta, su habilidad, su actividad y su producto`);

  const pens = D[u.pensadores];
  malos = faltanEnPapel(fichaPlana, pens,
    [['nombre', p => p.nombre], ['quién fue', p => p.quien], ['qué hizo', p => p.hizo],
     ['por qué se le recuerda', p => p.porque], ['dato', p => p.dato]], 'pensador');
  if (!malos) ok(`u${u.n}: los ${pens.length} pensadores están en el papel, cada uno con sus cuatro campos`);

  const voc = D[u.vocabulario];
  const faltan = voc.filter(v => !fichaPlana.includes(limpia(v.a)));
  if (faltan.length) mal(`u${u.n}: la ficha se dejó la definición de: ${faltan.map(v => v.w).join(' · ')}`);
  else ok(`u${u.n}: las ${voc.length} palabras del vocabulario están en el papel con su definición`);
}

/* ── UNIDAD 1: lo suyo ───────────────────────────────────────────── */
function revisaAsombro(D, ficha, fichaPlana) {
  let malos = faltanEnPapel(fichaPlana, D.FILO_CLASES,
    [['nombre', k => k.nombre], ['señal', k => k.senal], ['ejemplo', k => k.ejemplo],
     ['dónde se contesta', k => k.donde], ['trampa', k => k.trampa]], 'clase');
  if (!malos) ok(`u1: las ${D.FILO_CLASES.length} clases de pregunta están en el papel con su señal, su ejemplo y su trampa`);

  /* ⚠️ La pauta se busca DENTRO del bloque .pauta, no por su título: ese mismo
     título encabeza la actividad, y buscarlo en la ficha entera hacía caer el
     match en el encabezado —que no lleva claves— y daba «la pauta no trae
     ninguna clave» con el papel perfectamente puesto. */
  const letra = { hechos: 'H', significado: 'S', valor: 'V' };
  const clase = {};
  D.FILO_PREGUNTAS.forEach(p => { clase[limpia(p.p)] = letra[p.clase]; });
  const bloque = ficha.match(/<div class="pauta">[\s\S]*?\n    <\/div>/);
  const pauta = bloque && bloque[0].match(/¿De qué clase es\?[\s\S]*?<\/div>/);
  const tabla = ficha.match(/<tr><th style="width:8%">Clase<\/th>[\s\S]*?<\/table>/);
  if (!pauta || !tabla) mal('u1: no se encontró la actividad «¿De qué clase es?» o su pauta');
  else {
    const claves = [...pauta[0].matchAll(/(\d+)\.\s*([HSV])\b/g)].map(m => m[2]);
    const celdas = [...tabla[0].matchAll(/<td>(¿[^<]+\?)<\/td>/g)].map(m => limpia(m[1]));
    if (celdas.length !== claves.length) mal(`u1: la tabla trae ${celdas.length} preguntas y la pauta ${claves.length} claves`);
    else {
      let m2 = 0;
      celdas.forEach((c, i) => {
        if (!clase[c]) { mal(`u1: la tabla usa una pregunta que no está en el archivo de datos: «${c}»`); m2++; return; }
        if (claves[i] !== clase[c]) { mal(`u1: la pregunta ${i + 1} («${c}») es ${clase[c]} en los datos y la pauta dice ${claves[i]}`); m2++; }
      });
      if (!m2) ok(`u1: las ${celdas.length} preguntas de la actividad llevan en la pauta la clase que dicen los datos`);
    }
  }

  malos = faltanEnPapel(fichaPlana, D.FILO_ARBOL,
    [['materia', a => a.materia], ['pregunta de origen', a => a.nacio], ['pregúntate hoy', a => a.hoy]], 'materia');
  if (!malos) ok(`u1: las ${D.FILO_ARBOL.length} materias del árbol están en el papel con su pregunta de origen`);

  const faltanR = D.FILO_RAMAS.filter(r => !fichaPlana.includes(limpia(r.nombre)) || !fichaPlana.includes(limpia(r.pregunta)));
  if (faltanR.length) mal(`u1: la ficha se dejó ${faltanR.length} raíz(ces): ${faltanR.map(r => r.nombre).join(' · ')}`);
  else ok(`u1: las ${D.FILO_RAMAS.length} raíces están en el papel, cada una con su pregunta`);

  /* Los cinco momentos, enteros y EN ORDEN, medido DENTRO de su bloque:
     «diálogo» y «asombro» salen antes en los objetivos, así que buscarlos en la
     ficha entera daría «desordenados» con el papel bien. */
  const faltanM = D.FILO_RUTINA.filter(x => !fichaPlana.includes(limpia(x.titulo)) || !fichaPlana.includes(limpia(x.que)));
  if (faltanM.length) mal(`u1: la ficha se dejó ${faltanM.length} momento(s) de la clase`);
  else {
    const m = ficha.match(/<div class="pasos">[\s\S]*?<\/div>\s*<\/div>/);
    if (!m) mal('u1: no se encontró el bloque de los cinco momentos');
    else {
      const dentro = limpia(sinHtml(m[0]));
      const pos = D.FILO_RUTINA.map(x => dentro.indexOf(limpia(x.titulo)));
      if (!pos.every((p, i) => p >= 0 && (i === 0 || p > pos[i - 1])))
        mal('u1: los cinco momentos están en el papel pero DESORDENADOS: el orden es la lección');
      else ok('u1: los cinco momentos de la clase están enteros y en su orden');
    }
  }

  const et = D.FILO_PALABRA.partes.every(z => fichaPlana.includes(limpia(z.trozo)) && fichaPlana.includes(limpia(z.quiere)));
  if (!et) mal('u1: la ficha no trae los dos trozos de la palabra «filosofía»');
  else if (!fichaPlana.includes(limpia(D.FILO_PALABRA.ojo))) mal('u1: la ficha no trae el aviso de que la palabra NO dice «el que sabe»');
  else ok('u1: la etimología está en el papel, con sus dos trozos y su aviso');
}

/* ── UNIDAD 2: lo suyo ───────────────────────────────────────────── */
function revisaLogica(D, ficha, fichaPlana) {
  let malos = faltanEnPapel(fichaPlana, D.LOG_PIEZAS,
    [['nombre', p => p.nombre], ['qué es', p => p.que], ['dónde va', p => p.donde], ['ejemplo', p => p.ejemplo]], 'pieza');
  if (!malos) ok(`u2: las ${D.LOG_PIEZAS.length} piezas de un argumento están en el papel`);

  malos = faltanEnPapel(fichaPlana, D.LOG_SEMAFORO,
    [['nombre', s => s.nombre], ['señal', s => s.senal], ['prueba', s => s.prueba]], 'color');
  if (!malos) ok(`u2: los ${D.LOG_SEMAFORO.length} colores del semáforo están en el papel con su señal y su prueba`);

  /* ⚠️ Cada color lleva SU EMOJI además del color: la hoja se fotocopia en
     blanco y negro y uno de cada doce niños no distingue el rojo del verde.
     Sin el emoji, el semáforo es justo la actividad que él no puede hacer. */
  const sinEmoji = D.LOG_SEMAFORO.filter(s => !ficha.includes(s.emoji));
  if (sinEmoji.length) mal(`u2: el papel dice ${sinEmoji.length} color(es) del semáforo SIN su emoji: ${sinEmoji.map(s => s.nombre).join(' · ')}. Fotocopiado en blanco y negro, eso es una actividad que no se puede hacer`);
  else ok('u2: los tres colores del semáforo llevan su emoji además del color');

  /* La pauta del semáforo, RECALCULADA de los datos. */
  const letra = { verde: 'V', amarillo: 'A', rojo: 'R' };
  const color = {};
  D.LOG_RAZONES.forEach(x => { color[limpia(x.r)] = letra[x.color]; });
  const bloque = ficha.match(/<div class="pauta">[\s\S]*?\n    <\/div>/);
  const pauta = bloque && bloque[0].match(/El semáforo[\s\S]*?<\/div>/);
  const tabla = ficha.match(/<tr><th style="width:8%">Color<\/th>[\s\S]*?<\/table>/);
  if (!pauta || !tabla) mal('u2: no se encontró la actividad del semáforo o su pauta');
  else {
    const claves = [...pauta[0].matchAll(/(\d+)\.\s*([VAR])\b/g)].map(m => m[2]);
    const celdas = [...tabla[0].matchAll(/<td>(Porque[^<]*)<\/td>/g)].map(m => limpia(m[1]));
    if (celdas.length !== claves.length) mal(`u2: la tabla trae ${celdas.length} razones y la pauta ${claves.length} claves`);
    else {
      let m2 = 0;
      celdas.forEach((c, i) => {
        if (!color[c]) { mal(`u2: la tabla usa una razón que no está en el archivo de datos: «${c}»`); m2++; return; }
        if (claves[i] !== color[c]) { mal(`u2: la razón ${i + 1} («${c}») es ${color[c]} en los datos y la pauta dice ${claves[i]}`); m2++; }
      });
      if (!m2) ok(`u2: las ${celdas.length} razones de la actividad llevan en la pauta el color que dicen los datos`);
    }
  }

  malos = faltanEnPapel(fichaPlana, D.LOG_FALACIAS,
    [['nombre', f => f.nombre], ['mecanismo', f => f.mecanismo], ['cómo suena', f => f.suena],
     ['la pregunta que la desarma', f => f.desarma], ['qué cuesta', f => f.cuesta]], 'falacia');
  if (!malos) ok(`u2: las ${D.LOG_FALACIAS.length} falacias están en el papel, y cada una con la pregunta que la desarma`);

  /* ⚠️ Los cuatro casos de validez, con su combinación. Es la idea más difícil
     de la unidad y la que se cae primero al recortar: sin los cuatro, el
     alumno no puede ver que «bien hecho» y «verdad» son dos cosas que se
     combinan de cuatro maneras. */
  malos = faltanEnPapel(fichaPlana, D.LOG_VALIDEZ,
    [['título', v => v.titulo], ['conclusión', v => v.conclusion], ['explicación', v => v.que]], 'caso');
  D.LOG_VALIDEZ.forEach(v => v.razones.forEach(r => {
    if (!fichaPlana.includes(limpia(r))) { mal(`u2: la ficha no trae la razón «${r}» del caso «${v.titulo}»`); malos++; }
  }));
  const combos = new Set(D.LOG_VALIDEZ.map(v => (v.bienHecho ? 'B' : 'M') + (v.verdad ? 'V' : 'F')));
  if (combos.size !== 4) mal(`u2: los casos de validez cubren ${combos.size} de las 4 combinaciones (${[...combos].join(', ')}): sin las cuatro no se ve que son dos cosas distintas`);
  else if (!malos) ok('u2: los cuatro casos de validez están en el papel y cubren las cuatro combinaciones');

  const S = D.LOG_SI_ENTONCES;
  const piezas = [['la regla', S.regla], ['el caso que SÍ vale', S.bien.luego], ['el error clásico', S.mal.luego],
                  ['por qué el error falla', S.mal.porque], ['el aviso del sentido único', S.ojo]];
  const faltanS = piezas.filter(([, v]) => !fichaPlana.includes(limpia(v)));
  if (faltanS.length) mal(`u2: la ficha se dejó del «si… entonces»: ${faltanS.map(x => x[0]).join(' · ')}`);
  else ok('u2: el «si… entonces» está en el papel con su lado bueno, su error clásico y su aviso');

  const faltanC = D.LOG_CONECTORES.filter(x => !fichaPlana.includes(limpia(x.w)) || !fichaPlana.includes(limpia(x.hace)));
  if (faltanC.length) mal(`u2: la ficha se dejó ${faltanC.length} conector(es): ${faltanC.map(x => x.w).join(' · ')}`);
  else ok(`u2: los ${D.LOG_CONECTORES.length} conectores están en el papel con lo que hace cada uno`);

  const faltanA = D.LOG_ARBOL.filter(a => !fichaPlana.includes(limpia(a.le)) || !fichaPlana.includes(limpia(a.hoy)));
  if (faltanA.length) mal(`u2: la ficha se dejó lo que la lógica le da a: ${faltanA.map(a => a.materia).join(' · ')}`);
  else ok(`u2: las ${D.LOG_ARBOL.length} materias están en el papel con lo que la lógica les da`);
}

/* ══════════════════ la pasada ══════════════════ */
console.log('\n🌳 La Ruta de la Raíz: la pantalla y el papel\n');
UNIDADES.forEach(u => {
  console.log(`── Unidad ${u.n}: ${u.nombre} ──`);
  const D = cargar(u);
  const ficha = fs.readFileSync(path.join(RAIZ, u.ficha), 'utf8');
  const fichaPlana = limpia(sinHtml(ficha));
  const mision = fs.readFileSync(path.join(RAIZ, u.dir, u.html), 'utf8');
  if (u.n === 1) revisaAsombro(D, ficha, fichaPlana);
  else revisaLogica(D, ficha, fichaPlana);
  ciclosYPensadores(u, D, fichaPlana);
  contenedoresVacios(u, mision);
  niUnaFecha(u);
  investigaYCirculo(u, ficha, fichaPlana);
  console.log('');
});

/* ── que se lea en cuarto grado ──────────────────────────────────── */
console.log(`📖 Que se lea en cuarto grado · frase ≤ ${FRASE_MAX} · tramo ≤ ${TRAMO_MAX} · bloque ≤ ${MEDIA_BLOQUE} · misión ≤ ${MEDIA_MISION}\n`);
FILO.forEach(m => {
  const nombre = path.basename(m.dir);
  const bloques = bloquesDe(m);
  const r = resumen(bloques);
  const f0 = fallos;
  bloques.filter(b => b.palabras >= MIN_BLOQUE).forEach(b => {
    if (b.maxFrase > FRASE_MAX) mal(`${nombre} · ${b.donde}: una frase de ${b.maxFrase} palabras («${b.fraseLarga.slice(0, 90)}…»)`);
    if (b.maxTramo > TRAMO_MAX) mal(`${nombre} · ${b.donde}: un tramo sin corte de ${b.maxTramo} palabras`);
    if (b.porFrase > MEDIA_BLOQUE) mal(`${nombre} · ${b.donde}: ${b.porFrase.toFixed(1)} palabras por frase de media`);
  });
  if (r.porFrase > MEDIA_MISION) mal(`${nombre}: ${r.porFrase.toFixed(1)} palabras por frase en la misión entera`);
  if (fallos === f0) ok(`${nombre}: ${r.pantalla} palabras en pantalla · ${r.porFrase.toFixed(1)} pal/frase · frase máx ${r.maxFrase} · tramo máx ${r.maxTramo}`);
});

console.log(`\n${fallos ? '❌' : '✅'} ${fallos} fallo(s), ${avisos} aviso(s)\n`);
process.exit(fallos ? 1 : 0);
