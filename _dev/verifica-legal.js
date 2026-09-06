/* ============================================================
   M.E.T.A.S · Licencia, privacidad y lo que se promete
   ------------------------------------------------------------
   Tres cosas que no le cambian nada al maestro y que bloqueaban
   cualquier trato con un colegio o con la Secretaría:

   · no había archivo LICENSE, y `package.json` declaraba «ISC»
     —que deja a cualquiera copiar la plataforma entera y
     venderla— sin que nadie lo hubiera decidido;
   · no había aviso de privacidad, con nombres, notas, asistencia
     y teléfonos de encargados DE MENORES viajando a la nube;
   · y `registro.html` prometía que «estos datos nunca salen del
     dispositivo por sí solos», que era MENTIRA desde que existe
     la cola a Supabase. Una promesa de privacidad incumplida es
     peor que ninguna, porque la familia decide con ella.

   Lo que vigila esta sonda es que eso no vuelva:

   1. Hay LICENSE y package.json apunta a él (nunca más a ISC).
   2. Existen privacidad.html y terminos.html.
   3. Se llega a ellos DESDE LA PANTALLA, no solo por la URL: se
      abre la portada y la pantalla de la familia y se buscan los
      enlaces pintados.
   4. El aviso dice lo que de verdad pasa: que los resultados del
      alumno SUBEN SOLOS, y con qué datos.
   5. Ninguna pantalla vuelve a prometer que los datos no salen.
   6. `www/` no se publica: es la copia vieja de Capacitor y,
      servida, se instala su propio service worker.

   Uso:  node _dev/servidor-estatico.js   (en otra terminal)
         node _dev/verifica-legal.js
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const { abrir } = require('./lib-navegador');

const RAIZ = path.resolve(__dirname, '..');
const BASE = 'http://localhost:8123';
const leer = f => fs.readFileSync(path.join(RAIZ, f), 'utf8');

let fallos = 0;
const ok = (nombre, cond, extra) => {
  console.log((cond ? '  ✔ ' : '  ✘ ') + nombre + (cond || extra === undefined ? '' : ' → ' + JSON.stringify(extra)));
  if (!cond) fallos++;
};

(async () => {
  console.log('\n════════ LICENCIA, PRIVACIDAD Y LO QUE SE PROMETE ════════\n');

  console.log('1) De quién es esto');
  ok('existe el archivo LICENSE', fs.existsSync(path.join(RAIZ, 'LICENSE')));
  const lic = leer('LICENSE');
  ok('dice de quién es', /Polanco-Castellanos/.test(lic));
  ok('y qué se puede hacer sin pedir permiso', /gratuitamente|sin pedir permiso|fotocopiar/i.test(lic));
  const pkg = JSON.parse(leer('package.json'));
  ok('package.json ya no declara ISC', pkg.license !== 'ISC', pkg.license);
  ok('y apunta al archivo', /SEE LICENSE/i.test(pkg.license || ''), pkg.license);

  console.log('\n2) Los dos documentos');
  ok('existe privacidad.html', fs.existsSync(path.join(RAIZ, 'privacidad.html')));
  ok('existe terminos.html', fs.existsSync(path.join(RAIZ, 'terminos.html')));
  const priv = leer('privacidad.html');

  console.log('\n3) El aviso dice lo que DE VERDAD pasa');
  ok('avisa de que los datos del alumno suben solos', /suben? solos?|sube <strong>sola/i.test(priv));
  ['nombre', 'grado', 'nota', 'escuela'].forEach(d =>
    ok(`enumera que se manda «${d}»`, new RegExp(d, 'i').test(priv)));
  ok('dice dónde se guardan', /Supabase/.test(priv));
  ok('dice cuánto duran', /60 días|24 horas|no caducan/i.test(priv));
  ok('dice cómo se piden borrar', /borrad|borrar/i.test(priv));
  ok('habla de los teléfonos del encargado', /encargado/i.test(priv));
  ok('y de que los pagos no salen del equipo', /no sale del equipo|no salen del equipo/i.test(priv));

  console.log('\n4) Ninguna pantalla promete lo que no cumple');
  /* Se buscan SIN los comentarios: la frase vieja sigue citada dentro del
     comentario que explica por qué se quitó, y eso es documentación, no una
     promesa. Lo que no puede volver es que se le diga a una persona. */
  const sinComentarios = t => String(t).replace(/<!--[\s\S]*?-->/g, '');
  const paginas = fs.readdirSync(RAIZ).filter(f => f.endsWith('.html'));
  const mentira = paginas.filter(f => /nunca salen del dispositivo/i.test(sinComentarios(leer(f))));
  ok('ya nadie dice «nunca salen del dispositivo»', mentira.length === 0, mentira);

  console.log('\n5) Se llega desde la pantalla, no solo por la dirección');
  const nav = await abrir({ args: ['--no-sandbox'] });
  const ctx = await nav.newContext({ viewport: { width: 393, height: 873 }, isMobile: true, hasTouch: true });
  await ctx.route('**/*.supabase.co/**', r => r.abort());
  const pg = await ctx.newPage();

  await pg.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
  await pg.waitForTimeout(500);
  for (const [donde, sel] of [['la portada', 'a[href="privacidad.html"]'], ['la portada', 'a[href="terminos.html"]']]) {
    ok(`${donde} enlaza ${sel.match(/"(.+)"/)[1]}`, await pg.locator(sel).count() > 0);
  }
  ok('la portada lleva el ©', /©/.test(await pg.innerText('#view-inicio')));

  await pg.goto(BASE + '/padres.html', { waitUntil: 'domcontentloaded' });
  await pg.waitForTimeout(400);
  const enlacePadres = pg.locator('a[href="privacidad.html"]');
  ok('la pantalla de la familia enlaza el aviso', await enlacePadres.count() > 0);
  if (await enlacePadres.count()) {
    const c = await enlacePadres.first().boundingBox();
    /* 44 px es lo que un dedo acierta sin mirar; es la misma regla de los
       juegos 3D y vale igual aquí. */
    ok('y se puede tocar (44 px)', c && c.width >= 44 && c.height >= 44,
       c && { w: Math.round(c.width), h: Math.round(c.height) });
  }

  await pg.goto(BASE + '/registro.html', { waitUntil: 'domcontentloaded' });
  await pg.waitForTimeout(300);
  const reg = await pg.innerText('body');
  ok('la pantalla del registro avisa de que SÍ salen', /sí salen de este equipo|suben solos/i.test(reg), reg.slice(0, 120));

  await nav.close();

  console.log('\n6) La copia vieja de www/ no se publica');
  ok('hay _config.yml', fs.existsSync(path.join(RAIZ, '_config.yml')));
  const cfg = fs.existsSync(path.join(RAIZ, '_config.yml')) ? leer('_config.yml') : '';
  ['www/', 'android/', 'node_modules/'].forEach(d => ok(`excluye ${d}`, cfg.includes(d)));
  /* Si algún día www/ se pusiera al día, esta comprobación sobra; mientras
     esté atrás, publicarla es servir la aplicación de hace meses. */
  const vWww = (leer('www/sw.js').match(/meta-app-v(\d+)/) || [])[1];
  const vReal = (leer('sw.js').match(/meta-app-v(\d+)/) || [])[1];
  console.log(`  · www/ va por v${vWww} y el sitio por v${vReal} (${vReal - vWww} versiones de diferencia)`);

  console.log('\n' + '─'.repeat(50));
  if (fallos) { console.log(`✖ ${fallos} problema(s).`); process.exit(1); }
  console.log('✅ TODO EN VERDE: está escrito de quién es y qué se hace con los datos.');
})().catch(e => { console.error('✘ La sonda tropezó:', e.message); process.exit(1); });
