/* ============================================================
   M.E.T.A.S · Los topes de la nube, escritos como se pidieron
   ------------------------------------------------------------
   _privado/SUPABASE-TOPES-Y-PAGINAS.sql lo pega Josué a mano en el
   SQL Editor. Esta sonda no corre SQL (eso lo hace, en un Postgres
   local, _dev/topes-sql-local/corre.sh): solo LEE archivos y
   comprueba lo que no se puede romper sin que nadie lo note:

   1. Están los cuatro disparadores, cada uno en su tabla y su
      momento, y el archivo se puede pegar dos veces.
   2. NO redefine ninguna función que ya vive en la nube (ni
      metas_guardar ni metas_guardar_progreso, ni las demás).
   3. Toda función nueva lleva security definer y set search_path.
   4. Las consultas por páginas copian la regla EXACTA de las de
      siempre (el WHERE de PUERTA-ANONIMA y de DOCENTES-V2).
   5. El tope del resumen de progreso sigue siendo al menos 3 veces
      el resumen más grande que la app puede armar HOY (se arma con
      el catálogo del día: si crecen las misiones, se pone roja).
   6. Un aula de 10 grupos cabe en el tope de 3 MB, por el blob de
      hoy y por el espejo viejo.

   Uso:  node _dev/verifica-topes-sql.js
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const leer = r => fs.readFileSync(path.join(RAIZ, r), 'utf8');
const SQL = leer('_privado/SUPABASE-TOPES-Y-PAGINAS.sql');
// Sin comentarios: la cabecera NOMBRA las funciones que no se tocan.
const CODIGO = SQL.replace(/--[^\n]*/g, '');
const plano = s => s.replace(/\s+/g, ' ').trim();

let fallos = 0;
const ok = (nombre, cond, extra) => {
  console.log((cond ? '  ✔ ' : '  ✘ ') + nombre + (cond || extra === undefined ? '' : ' → ' + JSON.stringify(extra).slice(0, 300)));
  if (!cond) fallos++;
};

console.log('\n════════ LOS TOPES DE LA NUBE ════════\n');

console.log('1) Los cuatro disparadores');
[
  ['progreso_topes', 'before insert on public.progreso'],
  ['resultados_topes', 'before insert on public.resultados'],
  ['docentes_topes', 'before insert on public.docentes'],
  ['docente_estado_topes', 'before insert or update on public.docente_estado'],
].forEach(([n, cuando]) => {
  const re = new RegExp('create trigger ' + n + '\\s+' + cuando.replace(/ /g, '\\s+') + '\\s+for each row', 'i');
  ok(n + ' (' + cuando + ')', re.test(CODIGO));
  ok('  …con «drop trigger if exists» antes (se puede pegar dos veces)',
    new RegExp('drop trigger if exists ' + n + ' on').test(CODIGO));
});
ok('no toca los disparadores de historial ni el candado',
  !/(drop|create|alter)[^;]*trigger[^;]*(hist|candado)/i.test(CODIGO));
ok('tabla e índices con «if not exists»',
  !/create table (?!if not exists)/i.test(CODIGO) && !/create index (?!if not exists)/i.test(CODIGO));
ok('el contador: RLS encendida y ninguna política',
  /alter table public\.metas_topes_dia enable row level security/.test(CODIGO) && !/create policy/i.test(CODIGO));

console.log('\n2) No redefine nada de lo que ya vive en la nube');
['metas_guardar', 'metas_guardar_progreso', 'metas_docente_alta_v2', 'metas_docente_estado_guardar',
  'metas_consultar_docente', 'metas_consultar_progreso_docente', 'blob_guardar', '_metas_docente_ok', 'metas_rate_ok']
  .forEach(f => ok('no define ' + f, !new RegExp('create\\s+(or\\s+replace\\s+)?function\\s+[a-z_.]*\\b' + f + '\\s*\\(', 'i').test(CODIGO)));
ok('no hace «drop function» de nada', !/drop function/i.test(CODIGO));

console.log('\n3) Toda función nueva: security definer y set search_path');
const funciones = [...CODIGO.matchAll(/create\s+or\s+replace\s+function\s+([a-z_.]+)\s*\(([\s\S]*?)\$\$/gi)];
ok('hay 8 funciones nuevas', funciones.length === 8, funciones.map(f => f[1]));
funciones.forEach(f => {
  const cab = f[2];
  ok(f[1] + ': security definer y set search_path = public',
    /security definer/i.test(cab) && /set search_path\s*=\s*public/i.test(cab));
});
['_metas_ip_peticion()', '_metas_tope_sumar(text, text)', '_metas_topes_progreso()', '_metas_topes_resultados()',
  '_metas_topes_docentes()', '_metas_topes_docente_estado()'].forEach(f =>
  ok('nadie de fuera puede llamar ' + f,
    CODIGO.indexOf('revoke all on function public.' + f + ' from public, anon, authenticated') >= 0));

console.log('\n4) Las páginas usan la regla EXACTA de las consultas de siempre');
const cuerpoDe = (texto, firma) => {
  const i = texto.indexOf(firma);
  if (i < 0) return '';
  const a = texto.indexOf('$$', i), b = texto.indexOf('$$', a + 2);
  return texto.slice(a + 2, b);
};
const puerta = cuerpoDe(leer('_privado/SUPABASE-PUERTA-ANONIMA.sql').replace(/--[^\n]*/g, ''),
  'function public.metas_consultar_docente(');
const pagRes = cuerpoDe(CODIGO, 'function public.metas_consultar_docente_pag(');
// El WHERE de la consulta que devuelve las filas (el que va después de
// «return query»), sin la palabra «where»: en la _pag va entre paréntesis
// para sumarle el cursor con «and».
const qRes = puerta.slice(puerta.indexOf('return query'));
const reglaRes = plano(qRes.slice(qRes.indexOf('where') + 5, qRes.indexOf('order by')));
ok('el WHERE de metas_consultar_docente (PUERTA-ANONIMA) está entero en la _pag',
  reglaRes.length > 100 && plano(pagRes).indexOf(reglaRes) >= 0, reglaRes.slice(0, 120));
ok('…y también el cálculo de los «rivales»',
  plano(pagRes).indexOf(plano(puerta.slice(puerta.indexOf('v_rivales :='), puerta.indexOf('return query')))) >= 0);
const v2 = cuerpoDe(leer('_privado/SUPABASE-DOCENTES-V2.sql').replace(/--[^\n]*/g, ''),
  'function public.metas_consultar_progreso_docente(');
const pagProg = plano(cuerpoDe(CODIGO, 'function public.metas_consultar_progreso_docente_pag('));
const reglasProg = [...v2.matchAll(/where ([\s\S]*?)order by/g)].map(m => plano(m[1]));
ok('las dos ramas del WHERE de metas_consultar_progreso_docente (DOCENTES-V2) están en la _pag',
  reglasProg.length === 2 && reglasProg.every(r => pagProg.indexOf(r) >= 0), reglasProg);
ok('cursor (fecha, id), no offset',
  /\(r\.creado_en, r\.id\) < \(p_antes_fecha/.test(pagRes) && /\(p\.actualizado_en, p\.id\) < \(p_antes_fecha/.test(pagProg)
  && !/offset/i.test(CODIGO));
ok('máximo 1 000 por página', (CODIGO.match(/least\(greatest\(coalesce\(p_limite, 500\), 1\), 1000\)/g) || []).length === 2);
ok('índices para el cursor', /resultados_docente_cursor_idx/.test(CODIGO) && /progreso_cursor_idx/.test(CODIGO));

console.log('\n5) Los números de los topes');
const tiene = (q, re) => ok(q, re.test(CODIGO));
tiene('2 000 sin verificar por IP y día', /'resultado_sin_verificar', v_ip\) > 2000/);
tiene('lo verificado pasa siempre', /if new\.verificado is true then\s+return new;/);
tiene('60 alumnos por dispositivo', /limit 60\) x\) >= 60/);
tiene('40 dispositivos nuevos por IP y día', /'dispositivo_nuevo', v_ip\) > 40/);
tiene('5 altas por IP y día → tope_altas_ip', /'alta_docente', v_ip\) > 5 then\s+raise exception 'tope_altas_ip'/);
tiene('200 altas al día → tope_altas_dia', /'alta_docente', '\*'\) > 200 then\s+raise exception 'tope_altas_dia'/);
tiene('valor de 3 MB → valor_demasiado_grande', /octet_length\(new\.valor::text\) > 3145728 then\s+raise exception 'valor_demasiado_grande'/);
tiene('nombre de clave nueva ^[A-Za-z0-9_]{1,40}$', /new\.k !~ '\^\[A-Za-z0-9_\]\{1,40\}\$'/);
tiene('16 claves por maestro', /limit 16\) x\) >= 16/);
tiene('IP de cf-connecting-ip, si no x-forwarded-for', /cf-connecting-ip[\s\S]*x-forwarded-for/);
ok('dice cómo comprobarlo y cómo deshacerlo', /CÓMO SE COMPRUEBA/.test(SQL) && /CÓMO SE DESHACE/.test(SQL));

/* El resumen más grande posible, armado como lo arma js/metas-supabase.js
   (snapshotProgreso) con TODO hecho: cada carpeta de misiones/, cada ruta
   diagnosticada, 40 insignias largas y contadores enormes. Se mide como lo
   mide la base: el texto del jsonb, con «": "» y «", "». */
const carpetas = fs.readdirSync(path.join(RAIZ, 'misiones'), { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
const catalogo = leer('js/data/misiones.js');
const iRutas = catalogo.indexOf('const RUTAS = {');
const rutas = [...catalogo.slice(iRutas, catalogo.indexOf('\n};', iRutas)).matchAll(/^\s+([a-z_]+):\s*\{/gm)].map(m => m[1]);
const misiones = {};
carpetas.forEach(f => { misiones[f] = { sec: 999, best: 100, intentos: 9999 }; });
const diag = {};
rutas.forEach(r => { diag[r] = { t: '2026-11-21T23:59:59.999Z', etapa: 99, aciertos: 99, total: 99 }; });
const resumen = {
  xp_index: 9999999, visitadas: 999, secciones: 99999, minutos: 999999, dominadas: carpetas.slice().sort(),
  misiones, diag,
  camp: { torneos: 9999, insignias: Array.from({ length: 40 }, (_, i) => '🏅 Insignia de nombre bastante largo ' + String(i).padStart(4, '0')) },
};
const jt = v => Array.isArray(v) ? '[' + v.map(jt).join(', ') + ']'
  : (v && typeof v === 'object') ? '{' + Object.keys(v).map(k => JSON.stringify(k) + ': ' + jt(v[k])).join(', ') + '}'
  : JSON.stringify(v);
const mayor = Buffer.byteLength(jt(resumen));
const m = CODIGO.match(/octet_length\(new\.resumen::text\) > (\d+)/);
const topeRes = m ? Number(m[1]) : 0;
console.log('     resumen más grande posible hoy: ' + mayor + ' bytes (' + carpetas.length + ' misiones, ' +
  rutas.length + ' rutas); 3× = ' + 3 * mayor + '; tope en el SQL: ' + topeRes);
ok('el tope del resumen es al menos 3× el más grande posible', topeRes >= 3 * mayor, { topeRes, mayor });
ok('y nunca menos de 20 KB', topeRes >= 20 * 1024);

console.log('\n6) Un aula de 10 grupos cabe en los 3 MB');
/* Un aula de 10 grupos de 45 con el año entero. «exagerada» pone de más en
   todo (12 materias, 6 faltas al día, 12 colectas, 200 notas de bitácora…);
   «realista» es un año lleno de verdad. El blob de hoy no lleva lo que ya
   pasó a filas (js/metas-blob-sesion.js, CORTE1). */
function aula(exagerada) {
  const N = 45, X = (a, b) => exagerada ? b : a, txt = n => 'x'.repeat(n);
  const logo = 'data:image/jpeg;base64,' + 'A'.repeat(X(24000, 40000));
  const grupo = gi => {
    const lista = [], notas = {}, asistencia = [], colectas = [], controles = [], bitacora = [], lectura = [], acumulativos = [];
    for (let i = 1; i <= N; i++) lista.push({ id: 'A' + gi + '-' + i + txt(30), num: i, nombre: 'Nombre Apellido Apellido Segundo ' + i,
      sexo: 'F', identidad: '0801201500001', nac: '2015-03-04', encargado: 'Nombre del encargado completo ' + i,
      tel: '9999-9999', dir: txt(80), obs: txt(60) });
    ['I', 'II', 'III', 'IV'].forEach(p => {
      notas[p] = {};
      const col = v => { const o = {}; for (let i = 1; i <= N; i++) o[i] = v; return o; };
      for (let k = 0; k < X(10, 12); k++) notas[p]['Materia larga ' + k] = col(87);
      for (let r = 0; r < 10; r++) notas[p]['Rasgo ' + r] = col('MS');
      notas[p].Inasistencias = col(3);
    });
    for (let d = 0; d < 200; d++) { const aus = {}; for (let k = 0; k < X(3, 6); k++) aus[(d * 7 + k) % N + 1] = 'A';
      asistencia.push({ f: '2026-02-' + String(d % 28 + 1).padStart(2, '0'), aus, nota: txt(20) }); }
    for (let c = 0; c < X(6, 12); c++) { const pagos = []; for (let i = 1; i <= N; i++) pagos.push({ num: i, monto: '150.00', f: '2026-03-01', id: txt(36) });
      colectas.push({ id: txt(36), nombre: 'Colecta ' + c, monto: '150.00', pagos }); }
    for (let c = 0; c < X(10, 25); c++) { const mm = {}; for (let i = 1; i <= N; i++) mm[i] = '✓'; controles.push({ id: txt(12), nombre: 'Control ' + c, f: '2026-04-01', marcas: mm }); }
    for (let b = 0; b < X(60, 200); b++) bitacora.push({ f: '2026-05-01', t: txt(X(120, 200)) });
    for (let i = 1; i <= N; i++) for (let t = 0; t < X(4, 10); t++) lectura.push({ f: '2026-06-01', num: i, ppm: 80, palabras: 100, errores: 3, texto: txt(30) });
    for (let a = 0; a < X(24, 40); a++) { const n = {}; for (let i = 1; i <= N; i++) n[i] = 9.5; acumulativos.push({ id: txt(12), nombre: 'Actividad ' + a, valor: 10, notas: n }); }
    return { id: 'G' + gi, escuela: 'Centro de Educación Básica de nombre largo', grado: '6', seccion: '1', logo, logoSec: logo,
      boleta: { director: txt(40), docente: txt(40) }, materias: [], lista, notas, asistencia, colectas, controles, bitacora, lectura, acumulativos, convocatorias: [] };
  };
  return { v: 2, activo: 'G0', grupos: Array.from({ length: 10 }, (_, i) => grupo(i)) };
}
const CORTE1 = ['lista', 'notas', 'recuperacion', 'inasisOficial', 'asistencia', 'colectas', 'controles', 'bitacora',
  'boleta', 'materias', 'logo', 'logoSec', 'edadCorte', 'obsGrado'];
const sinCorte1 = st => Object.assign({}, st, { grupos: st.grupos.map(g => {
  const x = {}; Object.keys(g).forEach(k => { if (CORTE1.indexOf(k) < 0) x[k] = g[k]; }); return x; }) });
const peso = st => Buffer.byteLength(JSON.stringify({ raw: JSON.stringify(st) })) + 1;   // +1: el espacio de «"raw": »
const TRES_MB = 3145728, mb = n => (n / 1048576).toFixed(2) + ' MB';
const realBlob = peso(sinCorte1(aula(false))), exagBlob = peso(sinCorte1(aula(true))), realViejo = peso(aula(false));
console.log('     blob de hoy: realista ' + mb(realBlob) + ', exagerada ' + mb(exagBlob) + ' · espejo viejo, realista ' + mb(realViejo));
ok('por el blob de hoy, hasta un aula exagerada de 10 grupos cabe con holgura (menos de la mitad)', exagBlob < TRES_MB / 2, mb(exagBlob));
ok('por el espejo viejo, un aula realista de 10 grupos cabe', realViejo < TRES_MB, mb(realViejo));
ok('la app mide el mismo tope antes de mandar (blob y espejo viejo)',
  /var TOPE_VALOR = 3 \* 1024 \* 1024;/.test(leer('js/metas-blob-sesion.js')) &&
  /DS_TOPE_AQUI = 3 \* 1024 \* 1024 - 16 \* 1024/.test(leer('js/metas-docente-sync.js')));

console.log('\n' + (fallos ? '✘ ' + fallos + ' fallo(s)' : '✔ Todo en verde') + '\n');
process.exit(fallos ? 1 : 0);
