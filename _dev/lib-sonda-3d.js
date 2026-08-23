/* ============================================================
   M.E.T.A.S · Los guardianes que comparten las sondas 3D
   ------------------------------------------------------------
   Cada parque de juegos 3D tiene su sonda, porque las CUENTAS de
   cada juego son suyas y no las puede comprobar nadie más. Pero
   los guardianes —que lo que se ve se pueda tocar, que la señal
   mala no lo rompa, que el panel quepa, que el botón responda al
   ratón de verdad— son los mismos para todos, y estuvieron
   copiados en dos archivos de mil líneas. Cada parque nuevo era
   una tercera copia y una ocasión más de que uno se quedara sin
   la comprobación que otro sí tenía.

   Con esto, la sonda de un parque nuevo son veinte líneas:

     const lib = require('./lib-sonda-3d');
     const M = lib.marcador();
     const G = lib.parque({ raiz:RAIZ, dir:DIR, base:BASE, juegos:JUEGOS,
                            toques:TOQUES, vuelta:'perimetro-cuadrilateros.html',
                            ok:M.ok });
     G.revisarAndamio();          // el archivo, antes de abrirlo
     …lo suyo, con G.abrir(nav, juego, true)…
     await G.guardianes(nav);     // los seis de siempre
     M.resumen();

   Lo que NO puede mirar ninguno de estos: el dibujo en 3D. Se
   pone un Three.js de mentira para poder correr sin tarjeta
   gráfica ni internet. Que la pantalla se vea bien hay que
   mirarlo con los ojos, una vez, en el teléfono.
   ============================================================ */
const fs = require('fs');
const path = require('path');

const RAIZ_PROY = path.resolve(__dirname, '..');
const STUB = require('./three-de-mentira');

/* Piezas de Three.js r128 que los juegos tienen permitido usar.
   Escribir mal un nombre (CylinderBufferGeometry, que ya no está)
   no falla al cargar: falla al abrir el juego, delante del niño. */
const R128 = new Set(['AmbientLight','BoxGeometry','BufferAttribute','BufferGeometry','CircleGeometry',
  'Clock','Color','ConeGeometry','CylinderGeometry','DirectionalLight','DoubleSide','EdgesGeometry','Fog',
  'GridHelper','Group','LatheGeometry','Line','LineBasicMaterial','LineSegments','Mesh','MeshBasicMaterial',
  'MeshLambertMaterial','MeshPhongMaterial','MeshStandardMaterial','Object3D','PerspectiveCamera',
  'PlaneGeometry','PointLight','Points','PointsMaterial','Raycaster','RingGeometry','Scene','Shape',
  'ShapeGeometry','SphereGeometry','TorusGeometry','Vector2','Vector3','WebGLRenderer']);

/* El andamio que comparten los doce juegos. Las comprobaciones de
   fuente miran AQUÍ, no dentro del juego: el telón, el cargador y
   los velos dejaron de estar copiados en cada archivo. */
const MOTOR_JS  = fs.readFileSync(path.join(RAIZ_PROY, 'js/3d/parque-3d.js'), 'utf8');
const MOTOR_CSS = fs.readFileSync(path.join(RAIZ_PROY, 'css/parque-3d.css'), 'utf8');

/* ============================================================
   El marcador
   ============================================================ */
function marcador(){
  let fallos = 0, pruebas = 0;
  function ok(cond, txt, extra){
    pruebas++;
    if(cond) console.log('  ✅ ' + txt);
    else { fallos++; console.log('  ❌ ' + txt + (extra !== undefined ? '  → ' + JSON.stringify(extra) : '')); }
  }
  function casi(a, b, tol){ return Math.abs(a-b) <= (tol === undefined ? 0.01 : tol); }
  function resumen(){
    console.log('\n════════════════════════════════════════════');
    console.log(fallos === 0
      ? ' ✅ '+pruebas+' comprobaciones, ninguna falla'
      : ' ❌ '+fallos+' fallas de '+pruebas+' comprobaciones');
    console.log('════════════════════════════════════════════');
    process.exit(fallos === 0 ? 0 : 1);
  }
  return { ok, casi, resumen, cuenta: () => ({fallos, pruebas}) };
}

/* ============================================================
   Los guardianes de un parque
   ------------------------------------------------------------
   cfg = {raiz, dir, base, juegos, toques, vuelta, ok}
     toques = [[archivo, selectorDeEmpezar, [selectores…], preparar?], …]
   ============================================================ */
function parque(cfg){
  const { dir, base, juegos, toques, vuelta, ok } = cfg;
  const raiz = cfg.raiz || RAIZ_PROY;
  const nombre = j => j.replace('juego-','').replace('-3d.html','').replace('.html','');
  const fuente = j => fs.readFileSync(path.join(raiz, dir, j), 'utf8');

  async function abrir(navegador, archivo, conStub){
    const pag = await navegador.newPage({ viewport:{width:412, height:820} });
    const errores = [];
    pag.on('pageerror', e => errores.push(String(e.message)));
    if(conStub) await pag.addInitScript(STUB);
    // la red se corta a propósito: en el aula tampoco hay
    await pag.route('**cdnjs.cloudflare.com/**', r => r.abort());
    await pag.goto(base + archivo, { waitUntil:'domcontentloaded' });
    await pag.waitForTimeout(320);
    /* Con `limpiar`, el juego arranca sin avance guardado: si no, la
       partida anterior de la sonda deja al juego por el nivel 4 y las
       comprobaciones miran otra cosa de la que dicen. */
    if(cfg.limpiar){
      await pag.evaluate(() => localStorage.clear());
      await pag.reload({ waitUntil:'domcontentloaded' });
      await pag.waitForTimeout(320);
    }
    pag.__errores = errores;
    return pag;
  }

  /* ============================================================
     El andamio, leído del archivo antes de abrirlo
     ------------------------------------------------------------
     Siete comprobaciones por juego. Las dos primeras miran el
     andamio compartido, pero exigen que ESTE juego lo cargue: un
     juego que se olvide del <script> no hereda nada y se queda
     negro delante del niño.
     ============================================================ */
  function revisarAndamio(){
    for(const j of juegos){
      const src = fuente(j), nom = nombre(j);
      const carga = /<script src="\.\.\/\.\.\/js\/3d\/parque-3d\.js/.test(src) &&
                    /<link rel="stylesheet" href="\.\.\/\.\.\/css\/parque-3d\.css/.test(src);
      ok(carga && /cdnjs\.cloudflare\.com\/ajax\/libs\/three\.js\/r128\/three\.min\.js/.test(MOTOR_JS),
         nom+': carga el andamio, y el andamio baja Three.js r128 del CDN');
      ok(carga && MOTOR_JS.includes('if (window.THREE) return listo()'),
         nom+': si la pieza de 3D ya está puesta, la usa (funciona sin red y se puede probar)');
      ok(/Hace falta internet la primera vez/.test(src),
         nom+': sin red avisa en vez de quedarse en negro');
      /* La vuelta cae en el Parque de Juegos 3D, no al principio de la
         misión: el que sale de un juego quiere abrir el siguiente, y
         buscar el Parque entre dieciocho pestañas es donde se abandona. */
      ok(new RegExp('href="'+vuelta.replace('.','\\.')+'#s-juegos3d"').test(src),
         nom+': la vuelta cae en el Parque de Juegos 3D');
      /* `touch-action: none` en el BODY le quita al navegador el toque
         por defecto en toda la página. Encima del dibujo hace falta —para
         arrastrar y girar sin que la página se deslice—, pero puesto en el
         body se lleva por delante los botones: en una tableta con Android
         el alumno se quedaba con la pregunta en pantalla y sin poder
         contestarla. Va en `#lienzo`, y en ningún otro sitio. Se mira en
         el andamio Y en lo que el juego le añada encima. */
      const cuerpo = (MOTOR_CSS.match(/\nbody\{[^}]*\}/) || [''])[0] +
                     (src.match(/\nbody\{[^}]*\}/) || [''])[0];
      ok(!/touch-action:\s*none/.test(cuerpo),
         nom+': el body no le quita el toque a toda la página', cuerpo.slice(0,120));
      const lienzoCss = (MOTOR_CSS.match(/#lienzo\{[^}]*\}/) || [''])[0] +
                        (src.match(/#lienzo\{[^}]*\}/) || [''])[0];
      const arrastra = /pointermove/.test(src);
      ok(!arrastra || /touch-action:\s*none/.test(lienzoCss),
         nom+': y si se gira con el dedo, el lienzo sí lo pide');
      const malos = [...src.matchAll(/THREE\.([A-Za-z0-9_]+)/g)].map(m=>m[1]).filter(n=>!R128.has(n));
      ok(malos.length===0, nom+': solo usa piezas que existen en r128', [...new Set(malos)]);
    }
  }

  /* ============================================================
     Que lo que se ve, se pueda tocar
     ------------------------------------------------------------
     Este bloque existe por un fallo que llegó a un teléfono de
     verdad: el lienzo 3D se salía 133 px por debajo de su hueco y
     quedaba encima de los botones de responder. Se veían perfectos
     y el dedo no los tocaba nunca. El alumno se queda con la
     pregunta en pantalla y sin forma de contestarla, y lo que hace
     es cerrar la aplicación.

     No bastaba con probar «este botón responde»: hay que preguntar,
     control por control y en CADA momento de la partida, si el
     elemento que recibiría el toque es ese control o hay algo
     encima. Y hay que hacerlo con las medidas de un teléfono, que
     es donde el reparto de la pantalla aprieta.
     ============================================================ */
  async function nadaTapado(p){
    return await p.evaluate(() => {
      const malos = [];
      const sel = 'button, input, a[href], [onclick], [onpointerdown]';
      document.querySelectorAll(sel).forEach(el => {
        const r = el.getBoundingClientRect();
        if(r.width < 4 || r.height < 4) return;
        const cs = getComputedStyle(el);
        if(cs.visibility === 'hidden' || cs.display === 'none' || cs.pointerEvents === 'none') return;
        if(el.disabled) return;
        let cx = r.left + r.width/2, cy = r.top + r.height/2;
        /* Que un control quede debajo del borde en una ventana corta no
           es un fallo SI el alumno puede llegar a él deslizando. Se
           intenta, y si aun así no aparece, entonces sí es un botón que
           no existe. */
        /* Con margen de 2 px: un centro clavado en el borde cuenta como
           fuera. `elementFromPoint` en el borde exacto devuelve nulo, y
           el botón está medio cortado de todos modos. */
        const fueraDe = (x, y) => x < 2 || y < 2 || x > window.innerWidth - 2 || y > window.innerHeight - 2;
        if(fueraDe(cx, cy)){
          try{ el.scrollIntoView({block:'center', inline:'center'}); }catch(e){}
          const r2 = el.getBoundingClientRect();
          cx = r2.left + r2.width/2; cy = r2.top + r2.height/2;
          if(fueraDe(cx, cy)){
            malos.push({txt:(el.textContent||el.id||'').trim().slice(0,20), tapa:'FUERA DE LA VENTANA, ni deslizando'});
            return;
          }
        }
        const arriba = document.elementFromPoint(cx, cy);
        if(arriba === el || el.contains(arriba)) return;
        /* Que una ventana abierta tape lo de detrás es lo que tiene que
           hacer: es un modal, y el alumno tiene que atenderlo antes de
           seguir. Lo que NO puede pasar es que tape el DIBUJO, o
           cualquier cosa que no sea una ventana. */
        const veloArriba = arriba && arriba.closest ? arriba.closest('.velo.ver') : null;
        if(veloArriba && !veloArriba.contains(el)) return;
        malos.push({txt:(el.textContent||el.id||'').trim().slice(0,20),
          tapa: arriba ? (arriba.tagName + (arriba.id?'#'+arriba.id:'') + (arriba.className && typeof arriba.className === 'string' ? '.'+arriba.className.split(' ')[0] : '')) : 'nada'});
      });
      return malos;
    });
  }

  /* Se recorre el juego entero con medidas de teléfono y se comprueba
     en cada momento. Las paradas van en `toques`: el mismo recorrido
     que ya se toca con el ratón. */
  async function todoAlcanzable(nav){
    console.log('\n🖐️ Que lo que se ve, se pueda tocar (medidas de teléfono)');
    for(const medida of [{width:393,height:873,n:'teléfono 393×873'},
                         {width:360,height:640,n:'pantalla chica 360×640'},
                         {width:740,height:360,n:'acostado con letra grande', letra:22}]){
      for(const [j, arranque, botones, preparar] of toques){
        const ctx = await nav.newContext({viewport:{width:medida.width, height:medida.height},
          deviceScaleFactor:2.75, isMobile:true, hasTouch:true});
        const p = await ctx.newPage();
        await p.addInitScript(STUB);
        await p.route('**cdnjs.cloudflare.com/**', r => r.abort());
        await p.goto(base + j, { waitUntil:'domcontentloaded' });
        if(medida.letra) await p.addStyleTag({ content: 'html{font-size:'+medida.letra+'px;}' });
        // se le da tiempo al juego a apretar el panel si no cabe
        await p.waitForTimeout(700);
        const nom = nombre(j);

        let malos = await nadaTapado(p);
        ok(malos.length === 0, nom+' · '+medida.n+': al abrir, nada tapado', malos);

        if(arranque){
          const b = p.locator(arranque).first();
          if(await b.count()) { await b.tap({timeout:5000}).catch(()=>{}); await p.waitForTimeout(500); }
        }
        malos = await nadaTapado(p);
        ok(malos.length === 0, nom+' · '+medida.n+': ya jugando, nada tapado', malos);

        if(preparar){ await p.evaluate(preparar); await p.waitForTimeout(150); }
        // se actúa una vez y se vuelve a mirar: los paneles de resultado
        // cambian el reparto de la pantalla, que es cuando se torcía
        for(const s of botones){
          const loc = p.locator(s).first();
          if(await loc.count() && await loc.isVisible()){
            await loc.tap({timeout:5000}).catch(()=>{});
            await p.waitForTimeout(700);
            break;
          }
        }
        malos = await nadaTapado(p);
        ok(malos.length === 0, nom+' · '+medida.n+': después de responder, nada tapado', malos);

        await ctx.close();
      }
    }
  }

  /* ============================================================
     Pantalla corta: el panel entero tiene que poder alcanzarse
     ------------------------------------------------------------
     Centrar con `align-items:center` y desplazar con `overflow-y:auto`
     es una trampa conocida: lo que se sale POR ARRIBA no se recupera
     nunca, porque el desplazamiento no llega a números negativos. Se
     perdían el título y hasta la pregunta, y en el constructor se
     perdía «No sé, muéstrame», que es la ÚNICA salida del alumno que
     no sabe multiplicar. Pasa con la letra del teléfono agrandada
     —una opción de accesibilidad, no una rareza— y con el teléfono
     acostado.
     ============================================================ */
  async function pantallaCorta(nav){
    console.log('\n📐 Con la pantalla corta (letra grande o teléfono acostado)');
    /* La tercera medida es la letra del teléfono agrandada al 150 %, que
       es una opción de accesibilidad de Android y la usa quien no ve
       bien. Ahí es donde los paneles se salían y donde «Siguiente →» se
       iba por la derecha, dejando al alumno encallado. */
    for(const medida of [{width:393,height:330,n:'corta 393×330'},
                         {width:640,height:360,n:'acostado 640×360'},
                         {width:360,height:640,n:'letra grande 150 %', letra:24}]){
      for(const j of juegos){
        const p = await nav.newPage({ viewport:{width:medida.width, height:medida.height} });
        await p.addInitScript(STUB);
        await p.route('**cdnjs.cloudflare.com/**', r => r.abort());
        await p.goto(base + j, { waitUntil:'domcontentloaded' });
        if(medida.letra) await p.addStyleTag({ content: 'html{font-size:'+medida.letra+'px;}' });
        await p.waitForTimeout(400);
        const malos = await p.evaluate(() => {
          const fuera = [];
          /* nada se puede salir por la DERECHA: ahí no hay desplazamiento
             que valga, y lo que se sale suele ser el botón de seguir */
          document.querySelectorAll('.velo.ver .panel, .mandos, .botones, .ataques').forEach(el => {
            if(el.scrollWidth > el.clientWidth + 2 || el.getBoundingClientRect().right > window.innerWidth + 2)
              fuera.push({velo:(el.id||el.className), problema:'se sale por la derecha',
                px: Math.round(Math.max(el.scrollWidth - el.clientWidth, el.getBoundingClientRect().right - window.innerWidth))});
          });
          document.querySelectorAll('.velo.ver').forEach(v => {
            const panel = v.querySelector('.panel');
            if(!panel) return;
            const antes = v.scrollTop;
            v.scrollTop = 0;
            const arriba = panel.getBoundingClientRect().top;
            v.scrollTop = v.scrollHeight;
            const abajo = panel.getBoundingClientRect().bottom;
            v.scrollTop = antes;
            if(arriba < -2) fuera.push({velo:v.id, problema:'se corta por arriba y no se alcanza', px:Math.round(arriba)});
            if(abajo > window.innerHeight + 2) fuera.push({velo:v.id, problema:'se corta por abajo y no se alcanza', px:Math.round(abajo - window.innerHeight)});
          });
          return fuera;
        });
        ok(malos.length === 0, nombre(j)+' · '+medida.n+': el panel se alcanza entero, arriba y abajo', malos);
        await p.close();
      }
    }
  }

  /* ============================================================
     La señal MALA, que es la del aula
     ------------------------------------------------------------
     Este bloque nació de un fallo que se escapó a producción: la
     sonda inyectaba Three.js ya puesto, así que el motor estaba
     listo antes del primer cuadro y la carrera no existía. En el
     sitio real el motor llega de un CDN, y el alumno impaciente
     toca «Empezar» antes. El juego reventaba por dentro y se
     quedaba en una pantalla muerta: ni pregunta, ni botones, ni
     aviso —«no funciona», y sin nada que mirar—.

     Aquí se retrasa el CDN a propósito y se toca todo lo que hay
     en pantalla durante la espera. Después tiene que quedar un
     juego jugable, no un cadáver.
     ============================================================ */
  async function señalMala(nav){
    console.log('\n📶 Con la señal de un pueblo (el motor 3D tarda en llegar)');
    for(const j of juegos){
      const p = await nav.newPage({ viewport:{width:412, height:820} });
      const errores = [];
      p.on('pageerror', e => errores.push(String(e.message).split('\n')[0]));
      await p.route('**cdnjs.cloudflare.com/**', async route => {
        await new Promise(r => setTimeout(r, 1500));
        await route.fulfill({status:200, contentType:'text/javascript', body: STUB});
      });
      await p.goto(base + j, { waitUntil:'domcontentloaded' });
      await p.waitForTimeout(300);
      const nom = nombre(j);

      // mientras carga, el telón tapa: no hay nada que tocar
      ok(await p.locator('#velo-carga').isVisible(), nom+': mientras baja el motor, avisa y no deja tocar nada');
      let tocables = 0;
      for(const b of await p.locator('button:visible, input:visible').all()){
        const caja = await b.boundingBox();
        if(!caja) continue;
        const dentro = await p.evaluate(c => {
          const el = document.elementFromPoint(c.x + c.w/2, c.y + c.h/2);
          return !!(el && el.closest('#velo-carga'));
        }, {x:caja.x, y:caja.y, w:caja.width, h:caja.height});
        if(!dentro) tocables++;
      }
      ok(tocables === 0, nom+': ni un botón alcanzable por debajo del telón', tocables);

      await p.waitForTimeout(1900);                       // ya llegó el motor
      ok(!(await p.locator('#velo-carga').isVisible()), nom+': al llegar el motor, el telón se va');
      ok(errores.length === 0, nom+': y llegó entero, sin reventar por el camino', errores.slice(0,2));
      await p.close();
    }
  }

  /* ============================================================
     Tocar de verdad, no llamar a la función
     ------------------------------------------------------------
     La sonda llamaba a los manejadores por dentro. Así pasa una
     pantalla en la que el botón está tapado, o desplazado fuera, o
     con otro elemento encima: la lógica contesta y el dedo no. Aquí
     se toca con el ratón, sobre las coordenadas de verdad.
     ============================================================ */
  async function tocarDeVerdad(nav){
    console.log('\n👆 Tocando los botones de verdad, con el ratón');
    for(const [j, arranque, botones, preparar] of toques){
      const p = await abrir(nav, j, true);
      const nom = nombre(j);
      if(arranque){
        const b = p.locator(arranque);
        ok(await b.count() > 0 && await b.first().isVisible(), nom+': el botón de empezar se ve');
        await b.first().click({timeout:5000});
        await p.waitForTimeout(450);
      }
      if(preparar){ await p.evaluate(preparar); await p.waitForTimeout(120); }
      for(const sel of botones){
        const loc = p.locator(sel).first();
        const hay = await loc.count() > 0 && await loc.isVisible();
        if(!hay){ ok(false, nom+': no aparece '+sel); continue; }
        /* «Responder» no siempre es cambiar de estado: decirle al alumno
           «te faltan tres» también es responder, y es lo que hace el
           botón de contar cuando todavía no ha contado todo. Así que se
           mira TODO lo que ve él: el estado, los velos y los avisos. */
        const foto = () => p.evaluate(() => {
          const t = [];
          document.querySelectorAll('#aviso,#globo,.aviso,.dif,#pt-cast,#preg,#chapa,#consigna,#que,#cuenta')
            .forEach(e => t.push(e.textContent));
          document.querySelectorAll('#ops .op').forEach(e => t.push(e.className));
          return JSON.stringify({e:window.__j3d.estado(), t:t, v:document.querySelectorAll('.velo.ver').length});
        });
        const antes = await foto();
        let movio = false;
        try{
          await loc.click({timeout:5000});
          await p.waitForTimeout(700);
          movio = (await foto()) !== antes;
        }catch(e){ movio = false; }
        ok(movio, nom+': al tocar '+sel+' con el ratón, el juego responde');
      }
      await p.close();
    }
  }

  /* Un CDN que se queda colgado —ni contesta ni falla— es lo normal con
     mala señal. Sin plazo, el telón se quedaba puesto para siempre. */
  async function cdnColgado(nav){
    console.log('\n⏰ Cuando el CDN no contesta ni falla');
    const p = await nav.newPage({ viewport:{width:393, height:873} });
    await p.route('**cdnjs.cloudflare.com/**', async () => { await new Promise(r => setTimeout(r, 120000)); });
    await p.goto(base + juegos[0], { waitUntil:'domcontentloaded' });
    await p.waitForTimeout(600);
    ok(await p.evaluate(() => document.getElementById('velo-carga').classList.contains('ver')),
       'al principio el telón está puesto, esperando');
    /* El plazo se lee del andamio: esperar veinte segundos de verdad en
       cada corrida haría que la sonda no la corriera nadie. */
    const m = MOTOR_JS.match(/var PLAZO = (\d+);/);
    const plazo = m ? parseInt(m[1], 10) : 0;
    ok(plazo > 0 && plazo <= 30000, 'y tiene plazo para rendirse ('+(plazo/1000)+' s), no espera para siempre', plazo);
    await p.close();
  }

  /* ============================================================
     Sin internet: la pantalla lo dice y no se queda negra
     ============================================================ */
  async function sinRed(nav){
    console.log('\n🌐 Sin internet (que es como está el aula la mitad del tiempo)');
    for(const j of juegos){
      const p = await nav.newPage({ viewport:{width:412, height:820} });
      await p.route('**cdnjs.cloudflare.com/**', r => r.abort());
      await p.goto(base + j, { waitUntil:'domcontentloaded' });
      await p.waitForTimeout(650);
      ok(await p.locator('#velo-red').isVisible(),
         nombre(j)+': avisa que hace falta señal la primera vez');
      await p.close();
    }
  }

  /* Los seis de siempre, en el orden en que se corrían. */
  async function guardianes(nav){
    await todoAlcanzable(nav);
    await pantallaCorta(nav);
    await señalMala(nav);
    await tocarDeVerdad(nav);
    await cdnColgado(nav);
    await sinRed(nav);
  }

  return { abrir, nombre, fuente, revisarAndamio, nadaTapado, todoAlcanzable,
           pantallaCorta, señalMala, tocarDeVerdad, cdnColgado, sinRed, guardianes };
}

module.exports = { R128, STUB, MOTOR_JS, MOTOR_CSS, marcador, parque };
