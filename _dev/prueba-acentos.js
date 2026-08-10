/* ═══════════════════════════════════════════════════════════════
   🔤 ¿SEPARA BIEN LAS SÍLABAS Y CLASIFICA BIEN EL ACENTO?

   js/data/lectura-acentos.js es el que le dice al alumno POR QUÉ
   «canción» lleva tilde. Si se equivoca, no falla una pantalla: le
   enseña mal la regla, y esa se la lleva puesta.

   Por eso tiene prueba propia, como el lector de numerales. Aquí van
   los casos que de verdad cuestan: diptongos contra hiatos, grupos de
   consonantes que no se parten, dígrafos, palabras sin tilde que hay
   que clasificar igual, y los monosílabos.

   Uso:
     node _dev/prueba-acentos.js
═══════════════════════════════════════════════════════════════ */
const A = require('../js/data/lectura-acentos.js');

let fallos = 0;
const ok = m => console.log('  ✅ ' + m);
const mal = m => { fallos++; console.log('  ❌ ' + m); };

function sil(palabra, esperado) {
  const s = A.silabas(palabra).join('-');
  if (s === esperado) ok(`${palabra} → ${s}`);
  else mal(`${palabra} → ${s} (se esperaba ${esperado})`);
}
function clase(palabra, esperada, tilde) {
  const c = A.clasificar(palabra);
  const bien = c.clase === esperada && (tilde === undefined || c.tilde === tilde);
  if (bien) ok(`${palabra} es ${c.clase}${c.tilde ? ' con tilde' : ''} · ${c.silabas.join('-')}`);
  else mal(`${palabra} salió ${c.clase} (se esperaba ${esperada}) · ${c.silabas.join('-')}`);
}

console.log('🔤 SÍLABAS Y ACENTO — comprobación del lector\n');

console.log('═══ Separación simple ═══');
sil('casa', 'ca-sa');
sil('mesa', 'me-sa');
sil('canción', 'can-ción');
sil('árbol', 'ár-bol');
sil('lápiz', 'lá-piz');
sil('pared', 'pa-red');

console.log('\n═══ Grupos de consonantes que NO se parten ═══');
sil('padre', 'pa-dre');
sil('libro', 'li-bro');
sil('problema', 'pro-ble-ma');
sil('cumpleaños', 'cum-ple-a-ños');
sil('instante', 'ins-tan-te');
sil('transporte', 'trans-por-te');
sil('abstracto', 'abs-trac-to');

console.log('\n═══ Dígrafos: ch, ll, rr ═══');
sil('muchacho', 'mu-cha-cho');
sil('caballo', 'ca-ba-llo');
sil('carro', 'ca-rro');
sil('chocolate', 'cho-co-la-te');

console.log('\n═══ Diptongo: una sola sílaba ═══');
sil('causa', 'cau-sa');
sil('peine', 'pei-ne');
sil('ciudad', 'ciu-dad');
sil('cuida', 'cui-da');
sil('tierra', 'tie-rra');
sil('agua', 'a-gua');

console.log('\n═══ Hiato: se parte ═══');
sil('leer', 'le-er');
sil('caos', 'ca-os');
sil('poeta', 'po-e-ta');
sil('día', 'dí-a');
sil('raíz', 'ra-íz');
sil('oído', 'o-í-do');
sil('maíz', 'ma-íz');
sil('baúl', 'ba-úl');

console.log('\n═══ Clasificación según el acento ═══');
clase('canción', 'aguda', true);
clase('pared', 'aguda', false);
clase('café', 'aguda', true);
clase('casa', 'llana', false);
clase('árbol', 'llana', true);
clase('lápiz', 'llana', true);
clase('examen', 'llana', false);
clase('médico', 'esdrújula', true);
clase('pájaro', 'esdrújula', true);
clase('rápidamente', 'sobresdrújula', true);

console.log('\n═══ Monosílabos y tilde diacrítica ═══');
const dia = ['él', 'tú', 'mí', 'sí', 'sé', 'más', 'qué', 'cómo', 'dónde', 'aún'];
dia.forEach(p => {
  const c = A.clasificar(p);
  if (c.diacritica && c.tilde) ok(`«${p}» se reconoce como tilde diacrítica`);
  else mal(`«${p}» NO se reconoció como diacrítica`);
});
['el', 'tu', 'mi', 'si', 'se', 'mas', 'que', 'como', 'donde', 'aun'].forEach(p => {
  const c = A.clasificar(p);
  if (!c.tilde && !c.diacritica) ok(`«${p}» sin tilde, como debe ser`);
  else mal(`«${p}» salió marcada con tilde o como diacrítica`);
});

console.log('\n═══ La regla que se le muestra al alumno ═══');
[['canción', /aguda/], ['árbol', /llana/], ['médico', /esdrújula/], ['él', /diacrítica/i]]
  .forEach(([p, re]) => {
    const r = A.clasificar(p).regla;
    if (re.test(r)) ok(`${p}: «${r}»`);
    else mal(`${p}: la explicación no menciona lo esperado — «${r}»`);
  });

console.log('\n═══ Ida y vuelta: toda palabra tildada se clasifica ═══');
/* Ninguna palabra con tilde puede quedarse sin clase: si eso pasara, el
   alumno la caza en el texto y la pantalla no sabría qué decirle. */
const muestra = ['máquina', 'después', 'también', 'jamás', 'música', 'príncipe', 'ángel',
  'útil', 'fácil', 'césped', 'sábado', 'línea', 'río', 'país', 'oír', 'reúne', 'período'];
let sinClase = 0;
muestra.forEach(p => {
  const c = A.clasificar(p);
  if (!c || !c.clase || !c.tilde) { sinClase++; console.log(`     ✘ ${p} → ${c && c.clase}`); }
});
if (!sinClase) ok(`las ${muestra.length} palabras con tilde salieron clasificadas`);
else mal(`${sinClase} palabra(s) con tilde se quedaron sin clase`);

console.log(`\n${fallos ? '❌ ' + fallos + ' fallo(s)' : '✅ el lector de sílabas y acentos está bien'}`);
process.exit(fallos ? 1 : 0);
