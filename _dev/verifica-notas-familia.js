/* ============================================================
   M.E.T.A.S · Las notas que ve una familia
   ------------------------------------------------------------
   Una clave muestra las notas de SU niño y de nadie más. Aquí se
   comprueban las tres puertas sin base de datos (la base las
   vuelve a comprobar en pruebas-capa-a/10-pruebas.sql, N1 a N3):

     a) una clave con notas las enseña, con el número y con
        palabras, no solo con color;
     b) si la respuesta trae a otro niño, no se pinta nada de
        ninguno (ni el número, ni el nombre, ni un dato de más);
     c) sin filas, o con un error, no sale ningún dato.

   Uso:  node _dev/verifica-notas-familia.js
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const { html } = require('../js/familia-notas.js');

const RAIZ = path.resolve(__dirname, '..');
let fallos = 0;
function ok(nombre, cond, extra) {
  console.log((cond ? '  ✔ ' : '  ✘ ') + nombre + (cond || extra == null ? '' : ' → ' + extra));
  if (!cond) fallos++;
}

const ANA = [
  { nombre: 'Ana', asignatura: 'Matemáticas', periodo: 'I', valor: '85.00', identidad: 'CODIGO-AJENO-99' },
  { nombre: 'Ana', asignatura: 'Español', periodo: 'II', valor: '91.50' },
  { nombre: 'Ana', asignatura: 'Ciencias Naturales', periodo: 'I', valor: '64.00' },
];
const BETO = { nombre: 'Beto', asignatura: 'Matemáticas', periodo: 'I', valor: '41.00', identidad: 'CODIGO-AJENO-99' };

console.log('\n— a) una clave válida muestra las notas de su niño');
const bien = html(ANA, 'ok');
ok('sale el nombre', bien.includes('Notas de Ana'));
ok('sale Matemáticas con 85 y «va bien»', bien.includes('Matemáticas') && /: 85, va bien/.test(bien));
ok('91.50 se lee 91.5', bien.includes(': 91.5, va bien'));
ok('64 se lee con «hay que repasar» y con ✗', bien.includes(': 64, hay que repasar') && bien.includes('✗'));
ok('el parcial va escrito, no solo el número romano', bien.includes('Primer parcial') && bien.includes('Segundo parcial'));
ok('no se cuela el dato de más que venía en la fila', !bien.includes('CODIGO-AJENO') && !bien.includes('identidad'));
ok('un nombre con marcas no se ejecuta', !html([{ nombre: 'Ana', asignatura: '<img src=x onerror=alert(1)>', periodo: 'I', valor: '70.00' }], 'ok').includes('<img'));

console.log('\n— b) una clave no muestra las notas de otro niño');
const mezcla = html(ANA.concat([BETO]), 'ok');
ok('dos niños: no se muestran las notas', mezcla.includes('No se pueden mostrar las notas.'));
['41', '85', '64', '91.5', 'Ana', 'Beto', 'CODIGO-AJENO', 'Matemáticas'].forEach(function (dato) {
  ok('no aparece «' + dato + '»', !mezcla.includes(dato));
});

console.log('\n— c) clave vacía, inválida o sin notas: nada sensible');
const vacio = html([], 'ok');
const error = html(ANA.concat([BETO]), 'error');
const basura = html([{ nombre: 'Beto', asignatura: 'Matemáticas', periodo: 'I', valor: 'no-es-nota', identidad: 'CODIGO-AJENO-99' }], 'ok');
ok('sin notas se dice eso y no hay números', vacio.includes('Todavía no hay notas.') && !/85|41|64/.test(vacio));
ok('si no se pudo leer, no se pintan las filas que hayan llegado', error.includes('Ahora no pude ver las notas.') && !error.includes('41') && !error.includes('Ana') && !error.includes('Beto'));
ok('un valor que no es nota no se muestra', basura.includes('No se pueden mostrar') && !basura.includes('Beto') && !basura.includes('CODIGO-AJENO'));

console.log('\n— el portal le pide las notas a la clave, no a la vista ancha');
const portal = fs.readFileSync(path.join(RAIZ, 'padres.html'), 'utf8');
const sql = fs.readFileSync(path.join(RAIZ, 'docs/rediseno-datos/SUPABASE-V2-FAMILIA-NOTAS.sql'), 'utf8');
ok('el portal llama a familia_notas con la clave', /rpc\/familia_notas/.test(portal) && /p_clave/.test(portal));
ok('no lee vf_notas (esa vista junta a todos los niños del teléfono)', !/vf_notas/.test(portal));
ok('sin clave no pregunta', /if \(!limpia\) return \{ estado: 'vacio'/.test(portal));
ok('la función exige sesión de familia y la clave con la que se vinculó',
  /es_sesion_familia\(\)/.test(sql) && /fa\.clave_usada = metas\.norm_clave\(p_clave\)/.test(sql));
ok('solo la nota final, y no la borrada', /componente = 'final'/.test(sql) && /n\.deleted_at is null/.test(sql));
ok('el valor sale como texto', /n\.valor::text/.test(sql));
ok('el revoke es solo de esta función, no de todo el esquema',
  /revoke all on function metas\.familia_notas\(text\) from public, anon, authenticated/.test(sql)
  && !/revoke execute on all functions in schema metas from public/.test(sql));
ok('la versión del portal está sellada', /familia-notas\.js\?v=566/.test(portal)
  && /CACHE_NAME = 'meta-app-v566'/.test(fs.readFileSync(path.join(RAIZ, 'sw.js'), 'utf8')));

console.log(fallos ? '\n✘ ' + fallos + ' comprobaciones fallaron' : '\n✅ Las notas de la familia se quedan en su clave');
process.exit(fallos ? 1 : 0);
