/* ══════════════════════════════════════════════════════════════
   M.E.T.A.S · Una misión no puede darse dos respuestas contrarias
   ──────────────────────────────────────────────────────────────
   Las misiones traen ejercicios de clasificar: un montón de
   fichas y dos columnas donde dejarlas. Y traen DOS bancos que
   hacen eso — `classGroups`, el de la pestaña 🗂️ Clasifica, y
   `retoPairs`, el del Reto final contrarreloj—. Los dos se
   escriben a mano, uno debajo del otro, y muchas veces repiten
   las mismas fichas con la misma pregunta.

   Ahí es donde se tuerce, y se torció de verdad: en la misión de
   Aspectos Cívicos, «El Escudo» estaba como símbolo MENOR en
   Clasifica y como símbolo MAYOR en el Reto. La misión enseñaba
   en once sitios —la teoría, la tarjeta, el quiz, el V/F, la
   evaluación, el Laboratorio— que los mayores son tres: la
   Bandera, el Escudo y el Himno. Y luego le marcaba en rojo al
   alumno que lo ponía donde su propia teoría decía.

   Eso es lo peor que puede hacer una pantalla que califica: no
   es que enseñe un dato malo —eso al menos es coherente y se
   corrige de una vez—, es que le dice que se equivocó CUANDO
   ACERTÓ. El niño que estudió y contestó bien aprende a
   desconfiar de lo que acaba de leer; el que no estudió no nota
   nada. Y esa nota entra en la Evidencia del maestro.

   No lo cazaba NADA: el archivo compila, la pantalla se pinta,
   no hay un solo error en la consola. Solo se ve jugando, y se
   vio porque el autor lo jugó.

   Lo que se compara NO es el código interno del grupo (`t:'si'`,
   `t:'no'`), que es lo primero que sale y da falsos positivos a
   montones: dos ejercicios distintos usan `si`/`no` para
   preguntas distintas —«6 × 6 ¿da 24?» y «¿da 36?»— y las dos
   respuestas contrarias son las dos correctas. Se compara por
   **la pregunta que lee el alumno**, o sea el par de rótulos de
   `label`, y dentro de esa pregunta por qué LADO le toca. Con
   eso, las 63 misiones que clasifican salen limpias y el fallo
   del Escudo se caza solo.

   Uso:  node _dev/verifica-clasificar-coherente.js
   ══════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const MISIONES = path.join(RAIZ, 'misiones');

let fallos = 0;
const ok = (t) => console.log('  ✅ ' + t);
const mal = (t) => { console.log('  ❌ ' + t); fallos++; };

/* Los comentarios se quitan ANTES de buscar. Es la lección que en este
   repositorio ya ha mordido cuatro veces: el sitio donde se explica un
   problema es justo donde ese problema sigue escrito, y una sonda que se
   acusa a sí misma enseña a no mirarla. Aquí muerde igual: un comentario
   que ponga de ejemplo {w:'El Escudo',t:'menor'} no es un ejercicio. */
function sinComentarios(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^[ \t]*\/\/.*$/gm, ' ');
}

/* Cada ejercicio es: unos rótulos (label), un eje (colA/colB) y sus fichas
   (words). Se recorren en ese orden porque así están escritos; el `words:[…]`
   se cierra contando corchetes y no con una expresión regular, porque dentro
   hay comillas y llaves y una regex se come el bloque siguiente. */
function ejerciciosDe(src) {
  const out = [];
  for (const m of src.matchAll(/label:\s*\[([^\]]*)\]/g)) {
    const rot = [...m[1].matchAll(/'([^']*)'/g)].map(x => x[1]);
    if (rot.length < 2) continue;
    const re = /colA:\s*'([^']+)'\s*,\s*colB:\s*'([^']+)'/g;
    re.lastIndex = m.index;
    const eje = re.exec(src);
    if (!eje) continue;
    const iw = src.indexOf('words:', eje.index);
    if (iw < 0) continue;
    const ini = src.indexOf('[', iw);
    let prof = 0, fin = -1;
    for (let i = ini; i < src.length; i++) {
      if (src[i] === '[') prof++;
      else if (src[i] === ']' && --prof === 0) { fin = i; break; }
    }
    if (fin < 0) continue;
    const fichas = [...src.slice(ini, fin).matchAll(/\{\s*w:\s*'([^']+)'\s*,\s*t:\s*'([^']+)'\s*\}/g)]
      .map(x => ({
        w: x[1],
        /* el lado se normaliza al eje de ESE ejercicio: así «mayor» y «pro»
           se comparan como A y B aunque cada banco use sus propios códigos */
        lado: x[2] === eje[1] ? 0 : x[2] === eje[2] ? 1 : -1
      }));
    out.push({ pregunta: rot.slice(0, 2).join(' / '), rot, fichas });
  }
  return out;
}

console.log('\n🗂️  ¿Alguna misión se contradice a sí misma al clasificar?\n');

let conEjercicios = 0, fichasMiradas = 0, sueltas = 0;
const rotas = [];

for (const dir of fs.readdirSync(MISIONES).sort()) {
  const js = path.join(MISIONES, dir, 'js');
  if (!fs.existsSync(js) || !fs.statSync(js).isDirectory()) continue;
  for (const f of fs.readdirSync(js)) {
    /* el -en.js entra también, y no hace falta tratarlo aparte: sus rótulos
       están en inglés, así que forma sus propias preguntas y se comprueba
       solo, contra sí mismo. Así se caza la edición traducida que se
       contradice sin que un rótulo español choque nunca con uno inglés. */
    if (!f.endsWith('.js')) continue;
    const src = sinComentarios(fs.readFileSync(path.join(js, f), 'utf8'));
    const ejs = ejerciciosDe(src);
    if (!ejs.length) continue;
    conEjercicios++;

    const vistas = new Map();
    for (const e of ejs) for (const fi of e.fichas) {
      fichasMiradas++;
      if (fi.lado < 0) { sueltas++; continue; }
      const clave = e.pregunta + '\u0000' + fi.w;
      if (!vistas.has(clave)) vistas.set(clave, { lados: new Set(), rot: e.rot });
      vistas.get(clave).lados.add(fi.lado);
    }
    for (const [clave, v] of vistas) {
      if (v.lados.size < 2) continue;
      const [pregunta, ficha] = clave.split('\u0000');
      rotas.push({ archivo: dir + '/js/' + f, ficha, pregunta,
                   dice: [...v.lados].sort().map(l => v.rot[l]) });
    }
  }
}

/* Los números se cuentan, no se escriben: una sonda con la cifra dentro se
   pone roja el día que entre una misión, sin que nada esté roto. */
if (!conEjercicios) mal('no se encontró ni un ejercicio de clasificar: ¿cambió la forma de los bancos?');
else ok(conEjercicios + ' misiones con ejercicios de clasificar · ' + fichasMiradas + ' fichas miradas');

if (sueltas) {
  /* una ficha con un `t` que no es ni colA ni colB no se puede colocar bien
     NUNCA: caiga donde caiga, la pantalla la marca en rojo */
  mal(sueltas + ' ficha(s) con un grupo que no es ninguna de las dos columnas de su ejercicio');
}

if (!rotas.length) {
  ok('ninguna misión se contradice: la misma ficha, la misma pregunta, la misma respuesta');
} else {
  mal(rotas.length + ' ficha(s) con dos respuestas contrarias a la misma pregunta:');
  for (const r of rotas) {
    console.log('       ' + r.archivo);
    console.log('       «' + r.ficha + '» · pregunta «' + r.pregunta + '»');
    console.log('         la misión dice «' + r.dice[0] + '» Y TAMBIÉN «' + r.dice[1] + '»');
  }
}

console.log('\n' + (fallos
  ? '❌ ' + fallos + ' fallo(s)'
  : '✅ ninguna misión le marca en rojo al alumno lo que ella misma le enseñó') + '\n');
process.exit(fallos ? 1 : 0);
