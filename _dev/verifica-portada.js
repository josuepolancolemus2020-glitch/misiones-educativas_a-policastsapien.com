/* ============================================================
   M.E.T.A.S · La portada dice qué es esto y para quién
   ------------------------------------------------------------
   El enlace de M.E.T.A.S. circula REENVIADO POR WHATSAPP. Llega
   pelado —sin vista previa— y quien lo abre suele ser el que
   decide: un maestro, una directora. Hasta el 6 de septiembre de
   2026 la portada no contenía «DCNB», ni «sin internet», ni
   «gratis», ni «imprimir», y no había `meta description`: en dos
   pantallas no había forma de saber qué se gana con esto.

   Lo que vigila esta sonda, y por qué cada cosa:

   1. La frase está EN LA PANTALLA, no solo en el código: se lee
      del texto pintado.
   2. Está ARRIBA, sin desplazar. Una frase de valor a la que hay
      que bajar no la lee quien todavía no sabe si le interesa.
   3. El número de misiones se CUENTA del catálogo. Es la
      normativa del proyecto, y aquí pesa doble: una cifra vieja
      le enseña al director un producto más pequeño del que hay.
      Se comprueba que NO quede el marcador a la vista y que el
      número sea el de MISSIONS.
   4. La frase dice que la lista CRECE. Una cifra sola se lee
      como el final del catálogo.
   5. La misma frase está en `meta description`, en el manifest y
      en el README. Si se cambia una, se cambian las cuatro.
   6. Nada de lo que afirma es mentira: las misiones que dice que
      llevan bloque del DCNB lo llevan, y todas enlazan su ficha.

   Uso:  node _dev/servidor-estatico.js   (en otra terminal)
         node _dev/verifica-portada.js
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { abrir } = require('./lib-navegador');

const RAIZ = path.resolve(__dirname, '..');
const BASE = 'http://localhost:8123';

let fallos = 0;
const ok = (nombre, cond, extra) => {
  console.log((cond ? '  ✔ ' : '  ✘ ') + nombre + (cond || extra === undefined ? '' : ' → ' + JSON.stringify(extra)));
  if (!cond) fallos++;
};

/* El catálogo, leído como dato: es contra esto contra lo que se compara. */
function catalogo() {
  const ctx = { window: {}, document: {}, console };
  vm.createContext(ctx);
  for (const f of ['js/data/misiones.js', 'js/data/dcnb-map.js']) {
    vm.runInContext(fs.readFileSync(path.join(RAIZ, f), 'utf8'), ctx, { filename: f });
  }
  return { M: vm.runInContext('MISSIONS', ctx), DM: vm.runInContext('DCNB_MAP', ctx) };
}

(async () => {
  const { M, DM } = catalogo();
  console.log(`\n════════ LA PORTADA · ${M.length} misiones en el catálogo ════════\n`);

  const nav = await abrir({ args: ['--no-sandbox'] });
  /* Medidas de teléfono: es donde llega el enlace de WhatsApp. */
  const ctx = await nav.newContext({ viewport: { width: 393, height: 873 }, isMobile: true, hasTouch: true, locale: 'es-HN' });
  await ctx.route('**/*.supabase.co/**', r => r.abort());
  const pg = await ctx.newPage();
  const errores = [];
  pg.on('pageerror', e => errores.push(String(e)));
  await pg.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
  await pg.waitForSelector('.valor-card');
  await pg.waitForTimeout(400);

  console.log('1) Lo que se lee en la pantalla');
  ok('la portada carga sin errores', errores.length === 0, errores[0]);
  const txt = await pg.innerText('.valor-card');
  for (const k of ['DCNB', 'sin internet', 'gratis', 'fotocopiar', 'maestro']) {
    ok(`dice «${k}»`, new RegExp(k, 'i').test(txt));
  }

  console.log('\n2) Se lee sin tener que desplazar');
  const caja = await pg.locator('.valor-card').boundingBox();
  ok('la tarjeta está dentro de la primera pantalla', caja && caja.y + caja.height <= 873,
     caja && Math.round(caja.y + caja.height));
  const desplazado = await pg.evaluate(() => document.querySelector('.view-scroll').scrollTop);
  ok('y sin haber desplazado nada', desplazado === 0, desplazado);

  console.log('\n3) El número se cuenta, no se escribe');
  ok('no queda ningún marcador a la vista', !/\{\{/.test(txt), txt.slice(0, 80));
  ok(`dice ${M.length} misiones, que es lo que hay`, txt.includes(String(M.length)), txt);
  const fuente = fs.readFileSync(path.join(RAIZ, 'index.html'), 'utf8');
  ok('y en el HTML sigue siendo un marcador, no una cifra pegada',
     /\{\{MISIONES\}\}\s*<\/b>|\{\{MISIONES\}\}/.test(fuente));
  ok('la frase avisa de que el catálogo crece', /siguen entrando|y creciendo|hoy/i.test(txt), txt);

  console.log('\n4) La misma frase en los cuatro sitios');
  const meta = await pg.$eval('meta[name=description]', m => m.content).catch(() => '');
  const manifest = JSON.parse(fs.readFileSync(path.join(RAIZ, 'manifest.json'), 'utf8')).description;
  const paquete = JSON.parse(fs.readFileSync(path.join(RAIZ, 'package.json'), 'utf8')).description;
  const readme = fs.readFileSync(path.join(RAIZ, 'README.md'), 'utf8');
  ok('hay meta description', !!meta);
  ok('el manifest dice lo mismo que la meta', manifest === meta, { manifest, meta });
  ok('package.json también', paquete === meta);
  /* En el README la frase va partida en varias líneas: se comparan las
     palabras, no los saltos de línea. */
  const aplana = s => String(s).replace(/\s+/g, ' ').trim();
  ok('el README también', aplana(readme).includes(aplana(meta)));
  ok('el README ya no vende «enseñar gramática»', !/enseñar gramática/i.test(readme));

  console.log('\n5) Lo que afirma es verdad');
  const conMapa = M.filter(m => DM[m.id]).map(m => m.subject);
  const CUATRO = ['español', 'matemáticas', 'naturales', 'sociales'];
  CUATRO.forEach(mat => {
    const total = M.filter(m => m.subject === mat).length;
    const mapeadas = conMapa.filter(s => s === mat).length;
    /* Español tiene una de Bachillerato, que el mapa del DCNB de Básica no
       cubre a propósito: por eso se admite que falte una. */
    ok(`las de ${mat} llevan su bloque del DCNB (${mapeadas}/${total})`, total - mapeadas <= 1);
  });
  let sinFicha = 0;
  M.forEach(m => {
    const html = fs.readFileSync(path.join(RAIZ, m.url), 'utf8');
    if (!/fichas\/ficha-[^"']+\.html/.test(html)) sinFicha++;
  });
  ok(`las ${M.length} enlazan su ficha imprimible`, sinFicha === 0, sinFicha);

  await nav.close();
  console.log('\n' + '─'.repeat(50));
  if (fallos) { console.log(`✖ ${fallos} problema(s): la portada no dice qué es esto o dice algo que no es.`); process.exit(1); }
  console.log('✅ TODO EN VERDE: la portada dice qué es, para quién, y es verdad.');
})().catch(e => { console.error('✘ La sonda tropezó:', e.message); process.exit(1); });
