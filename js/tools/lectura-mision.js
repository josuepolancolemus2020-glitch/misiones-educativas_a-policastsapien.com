/* ══════════════════════════════════════════════════════════════
   📖 CONTROL DE LECTURA DENTRO DE UNA MISIÓN — motor

   La pestaña 📖 Lectura de Mi aula la maneja el MAESTRO: elige al
   alumno, escucha, cuenta los errores y marca las respuestas. Sirve
   para tomar la fluidez de 43 niños uno por uno.

   Esto es lo otro: el ALUMNO solo, con el teléfono en la mano. Lee un
   minuto en voz alta y después TRABAJA ese mismo texto en cuatro
   actividades. La lectura no es la meta: es la materia prima.

   ── Durante el minuto no se toca NADA ──
   Se llegó aquí quitando dos cosas, las dos por el mismo motivo: el
   maestro las probó en el aula y distraían de leer, que es justo lo
   que se está midiendo.

   1. Un selector de modo de marcado («marco yo» / «se marca sola»)
      puesto antes de arrancar. El niño se ponía a probar los dos
      modos y llegaba al minuto sin haber leído nada.
   2. El marcado con el dedo mientras leía, con el texto pintándose
      detrás. Acababa pendiente de que el dedo no se le adelantara.

   Lo que queda es la toma clásica, la misma que el maestro hace en
   papel: se lee en voz alta y ya. Cuando suena el minuto —y solo
   entonces— el texto se vuelve tocable y se marca de UN SOLO TOQUE la
   última palabra leída.

   ── Qué cambia por no haber maestro delante ──
   · NO se cuentan errores de lectura. Un niño no puede escucharse y
     contarse los tropiezos a la vez, y un dato inventado es peor que
     ningún dato. Se mide VELOCIDAD y COMPRENSIÓN, y la pantalla lo
     dice: la precisión se toma con el maestro, en Mi aula.
   · El veredicto le habla a ÉL, de tú, y nunca lo etiqueta: dice qué
     hacer esta semana, no lo que es.

   ── El taller lo pone CADA MISIÓN ──
   Este archivo no sabe de adjetivos ni de números: ofrece cinco FORMAS
   de actividad y cada misión declara cuáles usa y con qué datos.

     comprension  — las cinco preguntas del texto, una a la vez
     cazar        — tocar sobre el texto las palabras que cumplen algo
     dosGrupos    — clasificar algo en una de dos clases
     tresOpciones — elegir entre tres
     ordenar      — tocar varias fichas en el orden correcto

   Así, la misión de los adjetivos caza adjetivos y la de los números
   caza números grandes, con el mismo motor y sin tocarlo. Cuando una
   forma nueva haga falta de verdad, se añade aquí y la heredan todas.

   Las NORMAS (banda de palabras por minuto por grado) viven en
   js/data/lectura-normas.js. Aquí no se escribe ninguna cifra de
   velocidad.

   Uso desde una misión:
     <script src="../../js/data/lectura-normas.js"></script>
     <script src="js/lectura-<tema>.js"></script>
     <script src="../../js/tools/lectura-mision.js"></script>
     LecturaMision.montar({
       contenedor: 'lm-root', corpus: LECTURA_X, actividades: LECTURA_X_TALLER,
       mision: 'x', tema: 'los adjetivos', resumen: {...},
       alTerminar: function (r) { ... }   // XP y logros de la misión
     });
══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var CLAVE = 'METAS_LECTURA_MISION_V1';   /* resultados por misión y texto */
  var CLAVE_PREF = 'METAS_LECTURA_MISION_PREF';  /* grado elegido */
  var SEGUNDOS = 60;

  /* ── utilidades ── */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function palabras(texto) { return String(texto || '').trim().split(/\s+/); }

  /* ── El texto impreso, cortado en renglones con el conteo ACUMULADO ──
     En el papel el maestro marca la última palabra leída y toma el número
     del final de ese renglón, como en las tomas clásicas de fluidez. Por
     eso el renglón tiene que caber ENTERO de un lado a otro de la hoja:
     si se parte en dos, el número queda descolgado y la hoja ya no sirve
     para medir. De ahí que el tamaño de letra y las palabras por renglón
     vayan siempre en pareja (LM_FZ y LM_PORLINEA). */
  function lineasDe(texto, porLinea) {
    var ps = palabras(texto), out = [];
    for (var i = 0; i < ps.length; i += porLinea) {
      out.push({ ps: ps.slice(i, i + porLinea), acumulado: Math.min(i + porLinea, ps.length) });
    }
    return out;
  }

  /* Tamaño de letra del texto en la hoja y palabras por renglón, por
     grado. Son los MÁS GRANDES que caben, medidos con
     _dev/verifica-impresion-lectura.js sobre las lecturas de las dos
     misiones. Bajan al subir de grado porque los textos se alargan —58
     palabras en 2º, hasta 200 en 9º— y la hoja es la misma.

     Van más grandes que los de la ficha de Mi aula (LEC_FICHA_FZ) porque
     esta primera hoja carga el texto y una sola actividad, no las cinco
     preguntas: el sitio que sobra se gasta en letra, que es lo que
     agradece el niño que lee. Cambiar un número de aquí obliga a volver
     a medir. */
  var LM_FZ = { 2: 27, 3: 25, 4: 22.5, 5: 20, 6: 18.5, 7: 17.5, 8: 16, 9: 15 };
  var LM_PORLINEA = { 2: 7, 3: 8, 4: 8, 5: 9, 6: 9, 7: 10, 8: 11, 9: 12 };
  /* Quita puntuación para comparar palabras. \b de JavaScript no sirve con
     acentos («ú» no es carácter de palabra para el motor), así que se
     compara palabra contra palabra, ya limpias. Esta expresión tiene que
     ser IDÉNTICA a la de _dev/valida-lectura-mision.js. */
  var LIMPIA = /[.,;:()¿?¡!«»"“”'’…—–]/g;
  function clave(p) { return String(p).replace(LIMPIA, '').toLowerCase(); }
  /* Marca del hueco de las actividades de completar: un carácter que no
     puede aparecer en una lectura, para poder sustituirlo sin miedo. */
  var HUECO = '\uE000';
  function leerJSON(k, porDefecto) {
    try { var o = JSON.parse(localStorage.getItem(k)); return o && typeof o === 'object' ? o : porDefecto; }
    catch (e) { return porDefecto; }
  }
  function guardarJSON(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function hoy() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function suena(t) { if (typeof window.sfx === 'function') { try { window.sfx(t); } catch (e) {} } }
  function vibra(p) { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) {} }

  /* Barajado con semilla: el MISMO texto da SIEMPRE las mismas
     actividades. La misión le pide al alumno que relea el texto dos o
     tres días —es lo que más sube la fluidez—, y con actividades que
     cambian cada vez no podría notar que va mejorando. */
  function semilla(txt) {
    var h = 2166136261;
    for (var i = 0; i < txt.length; i++) { h ^= txt.charCodeAt(i); h = Math.imul(h, 16777619); }
    return function () {
      h += 0x6D2B79F5; var t = h;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function barajaCon(arr, rnd) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)); var x = a[i]; a[i] = a[j]; a[j] = x; }
    return a;
  }

  /* Grado del alumno, si ya se identificó en la misión. Viene escrito a
     mano («6to», «6º-1», «sexto»), así que se sacan los dígitos y si no
     hay ninguno se deja sin elegir: preguntarle es mejor que adivinarle
     el grado y medirlo contra la banda equivocada. */
  function gradoIdentificado(grados) {
    var id = leerJSON('METAS_ALUMNO_V1', null);
    if (!id || !id.grado) return null;
    var m = String(id.grado).match(/\d+/);
    if (!m) return null;
    var g = parseInt(m[0], 10);
    return grados.indexOf(g) >= 0 ? g : null;
  }

  /* Oraciones como rangos de índices de palabra: las necesitan las
     actividades que dan contexto o que tapan una palabra. */
  function oraciones(ps) {
    var out = [], ini = 0;
    ps.forEach(function (p, i) {
      if (/[.:;!?»]$/.test(p) || /[.!?]»$/.test(p)) {
        if (i - ini >= 3) out.push({ ini: ini, fin: i });
        ini = i + 1;
      }
    });
    if (ps.length - ini >= 3) out.push({ ini: ini, fin: ps.length - 1 });
    return out;
  }

  /* ══════════════ LA LECTURA EN EL PROYECTOR ══════════════
     En el aula hay un proyector y tres teléfonos. El maestro proyecta
     la lectura en la pared y sus 43 alumnos la copian en el cuaderno:
     sin fotocopiadora, es la única forma de que un texto le llegue a
     todos el mismo día.

     Y ahí la pantalla ya no es un teléfono en la mano: es una pared a
     cinco metros. Lo que sirve es lo contrario de lo que sirve en el
     teléfono —letra grande, renglones juntos y el texto ENTERO a la
     vista—, porque el que copia desde su pupitre no puede hacer
     scroll: lo que se queda fuera de la pared, para él no existe.

     Por eso el tamaño no se escribe aquí: se BUSCA. Se prueban de
     mayor a menor y se queda con el más grande con el que el texto
     cabe entero, cronómetro incluido. El mismo texto sale enorme en el
     proyector del aula y del tamaño de siempre en el teléfono del
     alumno —donde ningún tamaño grande cabe—, sin que nadie elija
     nada. El maestro solo retoca con A− y A+ si quiere. */
  var LM_TAMS = [16, 17, 18, 19, 20.5, 22, 24, 26, 28, 30.5, 33, 36, 39, 42, 46, 50, 54, 59, 64, 70];
  var CLAVE_VISTA = 'METAS_LECTURA_MISION_VISTA';   /* letra y proyector, por aparato */

  /* El interlineado va PEGADO al tamaño de la letra, no fijo. Un
     renglón grande necesita menos aire que uno pequeño para que el ojo
     no se pierda al saltar de línea, y en la pared ese aire de más son
     renglones enteros que se quedan fuera de la pantalla — que es
     justo lo que el maestro pidió arreglar. */
  function altoDe(px) { return Math.max(1.25, 1.58 - (px - 19) * 0.02); }

  /* ══════════════ CSS ══════════════
     Va aquí y no en el CSS de la misión a propósito: así una misión
     nueva estrena la sección con un solo <script>. Usa las variables
     de color de la misión, con respaldo por si alguna no las define.

     La LETRA DE LAS ACTIVIDADES es deliberadamente grande. Lo pidió el
     maestro y tiene razón: esto lo lee un niño en un teléfono, muchas
     veces con poca luz, y una pregunta que no se lee cómoda se
     contesta a la ligera. */
  var CSS = [
    '.lm-wrap{--lm-pri:var(--pri,#419b88);--lm-sec:var(--sec,#c49000);--lm-card:var(--card,#fff);',
    '--lm-borde:var(--border,#e2ddd4);--lm-txt:var(--dark,#1b2838);--lm-gris:var(--gray,#636e72);',
    '--lm-ok:var(--jade,#00b894);--lm-no:var(--red,#d63031);--lm-b:var(--purple,#6c5ce7);',
    /* El tamaño del texto que se lee y su interlineado son variables
       porque los mueve el ajuste al proyector (ver LM_TAMS). Aquí
       queda el de siempre, que es el que ve el alumno en su teléfono. */
    '--lm-tam:1.18rem;--lm-alto:1.58;}',
    '.lm-grados{display:flex;flex-wrap:wrap;gap:0.4rem;margin:0.6rem 0;}',
    '.lm-grado{font-family:"Fredoka",sans-serif;font-size:1rem;font-weight:600;min-width:58px;padding:0.55rem 0.85rem;',
    'border:2px solid var(--lm-borde);border-radius:12px;background:var(--lm-card);color:var(--lm-txt);cursor:pointer;transition:all 0.15s;}',
    '.lm-grado:hover{transform:translateY(-2px);}',
    '.lm-grado.on{background:linear-gradient(135deg,var(--lm-pri),var(--lm-sec));color:#fff;border-color:transparent;}',
    '.lm-pista{font-size:calc(0.88rem * var(--lm-esc,1));color:var(--lm-gris);line-height:1.6;margin:0.4rem 0;}',
    '.lm-lista{display:flex;flex-direction:column;gap:0.45rem;margin:0.6rem 0;}',
    '.lm-txt-row{display:block;width:100%;text-align:left;padding:0.65rem 0.8rem;border:2px solid var(--lm-borde);',
    'border-radius:12px;background:var(--lm-card);color:var(--lm-txt);cursor:pointer;font-family:inherit;transition:all 0.15s;}',
    '.lm-txt-row.on{border-color:var(--lm-pri);background:var(--pri-gl,rgba(65,155,136,0.12));}',
    '.lm-txt-tit{display:block;font-family:"Fredoka",sans-serif;font-size:1.02rem;font-weight:600;}',
    '.lm-txt-meta{display:block;font-size:0.8rem;color:var(--lm-gris);margin-top:0.15rem;}',
    '.lm-pasos{display:flex;gap:0.35rem;align-items:center;font-size:calc(0.8rem * var(--lm-esc,1));color:var(--lm-gris);margin-bottom:0.5rem;flex-wrap:wrap;}',
    '.lm-paso{width:26px;height:26px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;',
    'border:2px solid var(--lm-borde);font-size:0.8rem;background:var(--lm-card);}',
    '.lm-paso.on{border-color:var(--lm-pri);background:var(--lm-pri);color:#fff;font-weight:700;}',
    '.lm-paso.ya{border-color:var(--lm-ok);color:var(--lm-ok);}',
    /* ── El cronómetro grande ya no existe ──
       Eran un número de dos dedos de alto y una barra de lado a lado, y
       entre los dos se llevaban el tercio de abajo de la pantalla. Al
       cumplirse el minuto lo que quedaba era un «0» rojo enorme y una
       barra vacía, que no le dicen nada a nadie y siguen tapando.

       El minuto se mide ahora con el reloj de arena de la esquina, y en
       las DOS pantallas: proyectando y en el teléfono. Lo que queda de
       la franja es lo que hace falta —qué hay que hacer, el aviso y los
       botones—, que sin el cronómetro cabe en la mitad de alto. */
    '.lm-crono-sub{font-size:0.85rem;color:var(--lm-gris);width:100%;}',
    /* ── El panel del minuto va ABAJO, debajo del texto ──
       Estuvo arriba, encima del texto, y el maestro lo probó en el aula:
       al sonar el minuto el niño acaba de leer la ÚLTIMA línea y tiene
       los ojos en el final del texto, pero la orden («toca la última
       palabra que alcanzaste a leer») y el botón de seguir estaban
       arriba del todo — fuera de la pantalla en cuanto el texto pasa de
       diez renglones. Se quedaba quieto con el minuto ya cumplido,
       creyendo que la pantalla se había trabado.

       Abajo, la orden cae justo donde termina de mirar. `sticky` lo
       mantiene a la vista aunque el texto de 9º no quepa de una vez;
       donde el navegador no lo sostenga, se queda al final del texto,
       que es exactamente donde tiene que estar. */
    '.lm-panel{position:sticky;bottom:0;z-index:6;margin:-0.4rem 0 1.2rem;padding:0.75rem 0.9rem 0.9rem;',
    'background:var(--lm-card);border:2px solid var(--lm-borde);border-radius:16px;',
    'box-shadow:0 -6px 20px var(--shadow,rgba(0,0,0,0.13));}',
    '.lm-panel .lm-btns{margin-top:0.55rem;}',
    /* Un aviso vacío no puede ocupar sitio: en el proyector cada hueco
       del mando es un renglón de lectura que se cae de la pared. */
    '#lm-avisos:empty{display:none;}',
    /* ── En pantalla ancha el mando se aprieta en una fila ──
       La tableta del maestro va en horizontal y enchufada al proyector.
       Ahí el mando estaba en cuatro renglones —cronómetro, instrucción,
       aviso y botones—, y entre los cuatro se comían el tercio de abajo
       de la pared: el maestro lo dijo con estas palabras, «ese número
       del minuto me tapa bastante». */
    '@media (min-width:700px){',
    '.lm-panel{display:flex;flex-wrap:wrap;align-items:center;gap:0.3rem 0.9rem;}',
    '.lm-panel .lm-crono-sub{width:auto;flex:1 1 200px;}',
    '.lm-panel .lm-vista{flex:0 0 auto;}',
    '.lm-panel .lm-btns{margin-top:0;flex:0 0 auto;}',
    '.lm-panel #lm-avisos{flex:1 1 100%;order:9;}',
    '}',
    /* ── Los mandos de la vista (A−, A+, proyector) ──
       Van con el cronómetro, a la derecha, y DESAPARECEN al arrancar el
       minuto. Mientras se lee, la pantalla no pide nada: ya se quitó un
       selector de modos de aquí porque el niño se ponía a probarlo y
       llegaba al minuto sin haber leído. El tamaño se deja puesto
       antes, que es como se proyecta de verdad. */
    '.lm-vista{display:flex;gap:0.3rem;align-items:center;margin-left:auto;}',
    '.lm-vbtn{min-width:46px;padding:0.45rem 0.5rem;border:2px solid var(--lm-borde);border-radius:11px;',
    'background:var(--lm-card);color:var(--lm-txt);cursor:pointer;font-family:"Fredoka",sans-serif;',
    'font-size:1.02rem;font-weight:600;line-height:1.15;}',
    '.lm-vbtn:hover{border-color:var(--lm-pri);}',
    '.lm-vbtn.on{background:var(--lm-pri);color:#fff;border-color:transparent;}',
    /* ── El minuto se mide con un reloj de arena chiquito ──
       En la esquina de abajo, discreto, y en las dos pantallas: el que
       copia de la pared no puede tener la cuenta atrás gritándole, y el
       niño con el teléfono en la mano tampoco la necesita del tamaño de
       su cara. Al maestro le basta un vistazo para saber cuánto falta.

       Va FIJO a la pantalla y fuera de la franja a propósito: cuando se
       proyecta, la franja entera desaparece mientras se lee, y un reloj
       metido dentro se iría con ella. JS lo sube por encima de la franja
       cuando la hay. Desaparece al cumplirse el minuto: entonces manda
       la franja, que es donde se marca y se sigue. */
    '.lm-reloj{display:flex;align-items:center;gap:0.4rem;}',
    /* Fijo a la esquina SOLO proyectando. En el teléfono la franja no está
       pegada al pie de la pantalla —debajo sigue el resto de la misión—,
       así que un reloj clavado abajo se iba a caer encima de las pestañas,
       a media pantalla de su franja. Ahí vive DENTRO de ella. */
    '.lm-proy .lm-reloj{position:fixed;right:0.7rem;bottom:0.7rem;z-index:99010;}',
    '.lm-reloj b{display:inline-flex;align-items:center;gap:0.3rem;padding:0.3rem 0.7rem;border-radius:999px;',
    'background:var(--lm-card);border:2px solid var(--lm-borde);color:var(--lm-gris);opacity:0.72;',
    'font-family:"Fredoka",sans-serif;font-size:1rem;font-weight:600;font-variant-numeric:tabular-nums;}',
    /* El modo «letra grande» de la misión infla los <span> un 25 % con
       !important, y los segundos son un <span>: sin esto el reloj deja
       de ser pequeño, que es lo único que se le pide. */
    '.lm-reloj b span{font-size:inherit!important;line-height:inherit!important;}',
    '.lm-reloj.lm-poco b{color:var(--lm-sec);border-color:var(--lm-sec);opacity:1;}',
    /* El «terminé» solo hace falta proyectando: en el teléfono ese botón
       sigue estando en la franja, que no se esconde. */
    '.lm-reloj .lm-vbtn{display:none;min-width:auto;padding:0.3rem 0.55rem;font-size:0.95rem;opacity:0.72;}',
    '.lm-proy .lm-reloj .lm-vbtn{display:inline-flex;}',
    '.lm-reloj .lm-vbtn:hover{opacity:1;}',
    /* ── El proyector: la lectura se queda con la pantalla entera ──
       La cabecera de la misión, las pestañas y el marco de la tarjeta se
       llevan como 200 px de alto; en una pantalla de aula eso es un
       tercio del texto. Aquí se recuperan todos, y con ellos la letra
       sube dos o tres tamaños sin que el texto deje de caber entero.
       Se pide además la pantalla completa del navegador, que quita su
       barra; si el aparato no deja, esta capa sola ya tapa la página.
       Nada de `inset`: hay teléfonos en el aula que no lo entienden. */
    /* Por encima de TODO lo de la misión. La barra de XP se queda pegada
       arriba con z-index 1000 y el encabezado con el nombre de la misión
       va detrás: con la capa por debajo, los primeros renglones de la
       lectura salían tapados en la pared y el alumno copiaba desde la
       mitad. Se sube muy por encima de lo que usa cualquier misión. */
    '.lm-proy{position:fixed;top:0;left:0;right:0;bottom:0;z-index:99000;overflow:auto;',
    'background:var(--lm-card);padding:0.4rem 1rem 0;}',
    '.lm-proy>.card{margin:0;padding:0.3rem 0 0;border:0;border-radius:0;box-shadow:none;background:transparent;}',
    /* El título va pequeño y con !important: pequeño porque en la pared es
       una etiqueta, no lo que se copia —cada milímetro suyo es texto que
       se cae de la pantalla—, y con !important porque el modo «letra
       grande» de la misión también infla los h2 y se lo comía. */
    '.lm-proy>.card>h2{font-size:1.05rem!important;margin:0 0 0.25rem;}',
    '.lm-proy .lm-texto{margin:0.25rem 0 0;}',
    '.lm-proy .lm-panel{margin:0;}',
    /* El botón de salir se repone en cada repintado: sin él, el maestro
       que entra a pantalla completa y sigue a las actividades se queda
       encerrado. */
    '.lm-salir{position:fixed;top:0.45rem;right:0.6rem;z-index:99010;}',
    /* En la lectura solo el ✕: A− y A+ ya están abajo, en la franja. */
    '.lm-salir.lm-solo-salir .lm-vbtn{display:none;}',
    '.lm-salir.lm-solo-salir #lm-salir{display:inline-flex;}',
    /* el texto que se lee y sobre el que se caza */
    /* text-align a la izquierda SIEMPRE, aunque la misión justifique sus
       párrafos: el texto justificado abre huecos desiguales entre palabras
       y el lector que va despacio pierde el renglón justo en esos huecos. */
    '.lm-texto{margin:0.7rem 0;font-size:var(--lm-tam,1.18rem);line-height:var(--lm-alto,1.58);text-align:left;',
    'user-select:none;-webkit-user-select:none;touch-action:pan-y;}',
    '.lm-p{padding:0.08em 0.06em;border-radius:5px;transition:background 0.12s,color 0.12s;}',
    /* ── Aquí manda el ajuste, no el modo «letra grande» de la misión ──
       Varias misiones traen puesto `body.letra-grande`, que infla TODOS
       los <span> un 25 % con !important. Cada palabra del texto es un
       <span>, así que ese 25 % se colaba por debajo: el texto salía de
       un tamaño que el ajuste no había medido y con el interlineado del
       modo, no con el suyo. Con dos sitios mandando, ninguno acierta.
       El tamaño de partida SÍ lo hereda —se mide antes de poner esta
       clase—, así que nadie lee más pequeño que antes; a partir de ahí
       manda el ajuste, y quien quiera más letra la pide con A+. */
    '.lm-texto.lm-manda .lm-p{font-size:inherit!important;line-height:inherit!important;}',
    '.lm-viva .lm-p{cursor:pointer;}',
    '.lm-p.lm-leida{background:var(--pri-gl,rgba(65,155,136,0.18));}',
    '.lm-p.lm-aqui{background:var(--lm-pri);color:#fff;font-weight:700;box-shadow:0 0 0 2px var(--lm-pri);}',
    /* dos resaltados con nombre neutro: cada misión decide qué es «a» y
       qué es «b» (calificativo/determinativo, número grande/pequeño…) */
    '.lm-p.lm-a{background:var(--sec-gl,rgba(196,144,0,0.22));color:var(--lm-txt);font-weight:700;',
    'box-shadow:inset 0 -0.18em 0 var(--lm-sec);}',
    '.lm-p.lm-b{background:var(--purple-gl,rgba(108,92,231,0.18));color:var(--lm-txt);font-weight:700;',
    'box-shadow:inset 0 -0.18em 0 var(--lm-b);}',
    '.lm-p.lm-hallada{background:var(--jade-gl,rgba(0,184,148,0.22));color:var(--lm-txt);font-weight:700;',
    'box-shadow:inset 0 -0.18em 0 var(--lm-ok);}',
    '.lm-p.lm-fallo{background:var(--red-gl,rgba(214,48,49,0.16));animation:lm-tiembla 0.3s;}',
    '@keyframes lm-tiembla{0%,100%{transform:translateX(0)}25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}',
    '.lm-aviso{margin:0.5rem 0;padding:0.6rem 0.85rem;border-radius:10px;font-size:calc(0.95rem * var(--lm-esc,1));line-height:1.55;',
    'background:var(--sec-gl,rgba(196,144,0,0.12));border-left:4px solid var(--lm-sec);color:var(--lm-txt);}',
    '.lm-aviso.lm-av-ok{background:var(--jade-gl,rgba(0,184,148,0.14));border-left-color:var(--lm-ok);}',
    '.lm-aviso.lm-av-no{background:var(--red-gl,rgba(214,48,49,0.10));border-left-color:var(--lm-no);}',
    /* ── La franja NO crece con la letra, y es a propósito ──
       Es el mando del maestro, no lo que lee la clase: proyectando
       desaparece en cuanto se arranca. Y si creciera, se mordería la
       cola: el ajuste mide el sitio que deja la franja, así que una
       franja más alta le hace elegir una letra más chica —y A+ se
       quedaba sin efecto, compensado por su propio crecimiento—. */
    '.lm-panel .lm-aviso{font-size:0.95rem;}',
    /* ── Preguntas y actividades: crecen con el texto ──
       Letra grande a propósito, y desde que la lectura se proyecta,
       PROPORCIONAL a ella (`--lm-esc`). Si no, pasa lo que el maestro
       vio en la pared: el texto enorme y, al pasar a las preguntas, unas
       opciones que desde el pupitre no se leen. Se conservan las
       proporciones de siempre, solo se multiplican todas por lo mismo,
       así que en el teléfono —donde la escala es 1— nada cambia. */
    '.lm-preg-q{font-size:calc(1.18rem * var(--lm-esc,1));font-weight:700;line-height:1.5;margin:0.5rem 0 0.7rem;color:var(--lm-txt);}',
    '.lm-ops{display:flex;flex-direction:column;gap:0.5rem;}',
    '.lm-op{text-align:left;padding:0.7rem 0.85rem;border:2px solid var(--lm-borde);border-radius:12px;',
    'background:var(--lm-card);color:var(--lm-txt);cursor:pointer;font-family:inherit;font-size:calc(1.05rem * var(--lm-esc,1));line-height:1.5;}',
    '.lm-op:hover{border-color:var(--lm-pri);}',
    '.lm-op b{color:var(--lm-pri);margin-right:0.3rem;}',
    '.lm-op.lm-ok{border-color:var(--lm-ok);background:var(--jade-gl,rgba(0,184,148,0.14));}',
    '.lm-op.lm-no{border-color:var(--lm-no);background:var(--red-gl,rgba(214,48,49,0.10));}',
    '.lm-op[disabled]{cursor:default;opacity:0.95;}',
    '.lm-guia{margin-top:0.5rem;font-size:calc(0.95rem * var(--lm-esc,1));line-height:1.55;color:var(--lm-txt);',
    'background:var(--pri-gl,rgba(65,155,136,0.10));border-radius:10px;padding:0.55rem 0.75rem;}',
    '.lm-marcador{display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;font-family:"Fredoka",sans-serif;',
    'font-size:calc(1.05rem * var(--lm-esc,1));font-weight:600;color:var(--lm-txt);margin:0.4rem 0;}',
    '.lm-marcador em{font-style:normal;color:var(--lm-gris);font-size:0.85rem;font-weight:400;}',
    '.lm-frase{font-size:calc(1.15rem * var(--lm-esc,1));line-height:1.8;margin:0.6rem 0;color:var(--lm-txt);}',
    '.lm-frase u{text-decoration:none;background:var(--sec-gl,rgba(196,144,0,0.28));border-radius:5px;',
    'padding:0.06em 0.25em;font-weight:700;box-shadow:inset 0 -0.18em 0 var(--lm-sec);}',
    '.lm-hueco{display:inline-block;min-width:5.5em;border-bottom:3px solid var(--lm-sec);text-align:center;',
    'font-weight:700;color:var(--lm-sec);}',
    '.lm-dosbtn{display:flex;gap:0.6rem;flex-wrap:wrap;margin-top:0.5rem;}',
    '.lm-dosbtn button{flex:1;min-width:150px;padding:0.8rem 0.7rem;border-radius:14px;border:2px solid var(--lm-borde);',
    'background:var(--lm-card);color:var(--lm-txt);cursor:pointer;font-family:inherit;font-size:calc(1.02rem * var(--lm-esc,1));line-height:1.4;text-align:center;}',
    '.lm-dosbtn button b{display:block;font-family:"Fredoka",sans-serif;font-size:calc(1.1rem * var(--lm-esc,1));}',
    '.lm-dosbtn button small{display:block;color:var(--lm-gris);font-size:0.85rem;margin-top:0.15rem;}',
    '.lm-dosbtn button.lm-g0:hover{border-color:var(--lm-sec);}',
    '.lm-dosbtn button.lm-g1:hover{border-color:var(--lm-b);}',
    '.lm-dosbtn button.lm-ok{border-color:var(--lm-ok);background:var(--jade-gl,rgba(0,184,148,0.14));}',
    '.lm-dosbtn button.lm-no{border-color:var(--lm-no);background:var(--red-gl,rgba(214,48,49,0.10));}',
    /* fichas de ordenar */
    '.lm-fichas{display:flex;flex-wrap:wrap;gap:0.55rem;margin:0.7rem 0;}',
    '.lm-ficha{flex:1;min-width:110px;padding:0.85rem 0.6rem;border-radius:14px;border:2px solid var(--lm-borde);',
    'background:var(--lm-card);color:var(--lm-txt);cursor:pointer;font-family:"Fredoka",sans-serif;',
    'font-size:calc(1.25rem * var(--lm-esc,1));font-weight:700;text-align:center;font-variant-numeric:tabular-nums;}',
    '.lm-ficha:hover{border-color:var(--lm-pri);}',
    '.lm-ficha.lm-larga{font-size:0.95rem;line-height:1.35;}',
    '.lm-ficha.lm-puesta{border-color:var(--lm-ok);background:var(--jade-gl,rgba(0,184,148,0.16));cursor:default;}',
    '.lm-ficha.lm-puesta i{display:block;font-style:normal;font-size:0.72rem;font-weight:400;color:var(--lm-gris);}',
    '.lm-ficha.lm-fallo{border-color:var(--lm-no);background:var(--red-gl,rgba(214,48,49,0.12));animation:lm-tiembla 0.3s;}',
    '.lm-escalera{display:flex;flex-wrap:wrap;gap:0.4rem;align-items:center;font-family:"Fredoka",sans-serif;',
    'font-size:calc(1.05rem * var(--lm-esc,1));color:var(--lm-gris);margin:0.4rem 0;min-height:1.6em;}',
    '.lm-escalera b{color:var(--lm-txt);}',
    /* resultado */
    '.lm-hero{text-align:center;margin:0.4rem 0 0.7rem;}',
    '.lm-hero b{display:block;font-family:"Fredoka",sans-serif;font-size:3.2rem;line-height:1;color:var(--lm-pri);}',
    '.lm-hero span{display:block;font-size:0.9rem;color:var(--lm-gris);margin-top:0.2rem;}',
    '.lm-chips{display:flex;flex-wrap:wrap;gap:0.45rem;margin:0.6rem 0;}',
    '.lm-chip{flex:1;min-width:136px;border:2px solid var(--lm-borde);border-radius:12px;padding:0.5rem 0.65rem;background:var(--lm-card);}',
    '.lm-chip span{display:block;font-size:0.75rem;color:var(--lm-gris);text-transform:uppercase;letter-spacing:0.4px;}',
    '.lm-chip b{display:block;font-family:"Fredoka",sans-serif;font-size:calc(1.02rem * var(--lm-esc,1));margin-top:0.1rem;}',
    '.lm-veredicto{margin:0.6rem 0;padding:0.75rem 0.9rem;border-radius:12px;font-size:calc(1rem * var(--lm-esc,1));line-height:1.65;',
    'background:var(--pri-gl,rgba(65,155,136,0.12));border-left:4px solid var(--lm-pri);}',
    '.lm-leyenda{display:flex;flex-wrap:wrap;gap:0.8rem;font-size:0.85rem;color:var(--lm-gris);margin:0.4rem 0;}',
    '.lm-leyenda i{font-style:normal;padding:0.05em 0.35em;border-radius:5px;font-weight:700;}',
    '.lm-btns{display:flex;flex-wrap:wrap;gap:0.55rem;margin-top:0.8rem;}',
    '@media (max-width:520px){.lm-wrap{--lm-tam:1.1rem;}.lm-hero b{font-size:2.6rem;}',
    '.lm-preg-q{font-size:1.1rem;}.lm-op{font-size:1rem;}}'
  ].join('');

  /* ══════════════ CSS DE LA HOJA IMPRESA ══════════════
     Nada de las variables de color de la misión: esto sale por una
     impresora de escuela, muchas veces en blanco y negro y con el tóner
     justo. Colores oscuros, líneas finas y ni un fondo grande.

     Los márgenes de 10 mm del @page dejan 259,4 mm de alto útil; la hoja
     se planta en 248 mm a propósito. Ese colchón es el que salva cuando
     el navegador ignora el @page y pone los suyos (Firefox usa 12,7 mm),
     porque entonces la hoja SIGUE cabiendo en vez de partirse en dos. */
  var PAPEL_CSS = [
    '@page{size:letter portrait;margin:10mm;}',
    '*{box-sizing:border-box;margin:0;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;}',
    'body{color:#12203c;font-family:Arial,Helvetica,sans-serif;}',
    '.hoja{page-break-after:always;min-height:248mm;display:flex;flex-direction:column;}',
    '.hoja:last-child{page-break-after:auto;}',
    '.lp-head{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;',
    'border-bottom:2.5px solid #1e3a7c;padding-bottom:6px;}',
    '.lp-head>div:first-child{min-width:0;}',
    '.lp-tit{font-family:Georgia,serif;font-size:15px;font-weight:700;color:#1e3a7c;}',
    '.lp-sub{font-size:11px;color:#55637d;margin-top:2px;}',
    /* la banda no se parte: «125–134 ppm» en dos renglones se lee como
       dos datos distintos */
    '.lp-banda{text-align:right;font-size:11px;color:#333;flex:0 0 auto;white-space:nowrap;}',
    '.lp-reg{display:flex;gap:6px;margin:9px 0;}',
    '.lp-reg>div{flex:1;}',
    '.lp-reg-ancho{flex:2.2;}',
    '.lp-reg span{display:block;font-size:8.5px;text-transform:uppercase;letter-spacing:.4px;color:#7286a8;}',
    '.lp-reg i{display:block;border-bottom:1.2px solid #55637d;height:16px;}',
    '.lp-titulo{font-family:Georgia,serif;font-size:20px;text-align:center;margin:6px 0;}',
    /* El renglón es una fila con el conteo a la derecha: si el texto se
       le desbordara, el número dejaría de corresponderle. */
    '.lp-texto{line-height:1.9;}',
    '.lp-linea{display:flex;align-items:baseline;gap:8px;}',
    '.lp-linea span{flex:1;}',
    '.lp-linea em{font-style:normal;font-size:10px;color:#9aa8c0;min-width:26px;text-align:right;}',
    '.lp-nota{font-size:10px;line-height:1.5;color:#55637d;margin:7px 0 9px;}',
    '.lp-act{font-family:Georgia,serif;font-size:14px;font-weight:700;color:#1e3a7c;',
    'border-bottom:1px solid #d4dbe6;padding-bottom:3px;margin:9px 0 5px;',
    'break-after:avoid;page-break-after:avoid;}',
    '.lp-ins{font-size:11px;line-height:1.5;color:#55637d;margin-bottom:6px;}',
    /* Un ítem nunca se parte: su pregunta en una hoja y sus opciones en
       la siguiente no se puede contestar. */
    '.lp-item{margin-bottom:8px;break-inside:avoid;page-break-inside:avoid;}',
    '.lp-q{font-size:12.5px;line-height:1.45;font-weight:700;color:#16305f;}',
    '.lp-q b{color:#1e3a7c;}',
    '.lp-q u{text-decoration:none;border-bottom:2px solid #1e3a7c;padding:0 1px;}',
    /* Las opciones van en fila, como en la ficha de Mi aula: en columna
       se comían la hoja y obligaban a una tercera. */
    '.lp-ops{display:flex;flex-wrap:wrap;gap:2px 14px;margin:3px 0 0 16px;}',
    '.lp-op{font-size:11.5px;line-height:1.4;display:inline-flex;align-items:baseline;gap:5px;}',
    '.lp-op i{display:inline-block;width:11px;height:11px;border:1.3px solid #333;border-radius:50%;',
    'flex-shrink:0;align-self:center;}',
    '.lp-op b{color:#1e3a7c;}',
    '.lp-hueco{display:inline-block;min-width:80px;border-bottom:1.5px solid #1e3a7c;}',
    '.lp-dos{column-count:2;column-gap:16px;}',
    '.lp-fichas{display:flex;flex-wrap:wrap;gap:6px 12px;margin:4px 0 0 16px;}',
    '.lp-ficha{font-size:12.5px;font-weight:700;display:inline-flex;align-items:center;gap:5px;',
    'border:1.2px solid #b9c4d6;border-radius:6px;padding:3px 7px;}',
    '.lp-ficha i{display:inline-block;width:15px;height:15px;border:1.3px solid #333;border-radius:3px;flex-shrink:0;}',
    /* la clave se consulta de reojo, con el alumno enfrente: letra mayor */
    '.lp-aviso{font-size:12px;color:#8a1f1f;border:1.5px solid #8a1f1f;border-radius:6px;',
    'padding:5px 8px;margin:9px 0;}',
    '.lp-cl{margin-bottom:9px;break-inside:avoid;page-break-inside:avoid;}',
    '.lp-cl-t{font-family:Georgia,serif;font-size:13.5px;font-weight:700;color:#1e3a7c;}',
    '.lp-cl-r{font-size:12.5px;line-height:1.55;margin-top:2px;}',
    '.lp-foot{margin-top:auto;padding-top:10px;font-size:9px;color:#7286a8;text-align:center;}'
  ].join('');

  function inyectaCSS() {
    if (document.getElementById('lm-css')) return;
    var s = document.createElement('style');
    s.id = 'lm-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ══════════════ una instancia por misión ══════════════ */
  function montar(op) {
    var raiz = typeof op.contenedor === 'string' ? document.getElementById(op.contenedor) : op.contenedor;
    if (!raiz || !op.corpus || !op.actividades || !op.actividades.length) return null;
    if (typeof LECTURA_NORMAS === 'undefined' || typeof lecNivelVelocidad !== 'function') {
      raiz.innerHTML = '<div class="card"><p>📖 Las normas de lectura no cargaron en este equipo. ' +
        'Abre la misión una vez con internet y quedarán guardadas.</p></div>';
      return null;
    }
    inyectaCSS();
    raiz.classList.add('lm-wrap');

    var corpus = op.corpus;
    var mision = op.mision || 'mision';
    var tema = op.tema || 'el tema de esta misión';
    var ACTOS = op.actividades;
    var grados = Object.keys(corpus).map(Number)
      .filter(function (g) { return Number.isInteger(g) && corpus[g] && corpus[g].length; })
      .sort(function (a, b) { return a - b; });

    var pref = leerJSON(CLAVE_PREF, {}) || {};
    var st = null;
    function limpio(fase) {
      return {
        fase: fase || 'elegir',
        grado: st ? st.grado : null,
        textoId: st ? st.textoId : null,
        ini: 0, seg: 0, idx: null, congelado: false,
        acto: 0,
        est: ACTOS.map(estadoInicial),
        guardado: null, timer: null
      };
    }
    function estadoInicial(a) {
      if (a.forma === 'cazar') return { hallados: [], fallos: 0, rendido: false };
      /* Una ficha de estado POR RONDA, no una sola para la de turno: con
         el botón de atrás el alumno puede volver a una ronda ya resuelta,
         y con el estado compartido se le borraba —y al rehacerla sumaba
         otra vez—. Guardada por ronda, lo hecho queda hecho y visible. */
      if (a.forma === 'ordenar') return { i: 0, fallos: 0, rondas: [] };
      return { i: 0, resp: [] };
    }
    st = limpio('elegir');
    st.grado = (grados.indexOf(pref.grado) >= 0 ? pref.grado : null) || gradoIdentificado(grados);

    /* ── resultados guardados ── */
    function historial() {
      var todo = leerJSON(CLAVE, {}) || {};
      return todo[mision] || {};
    }
    function guardarResultado(textoId, dato) {
      var todo = leerJSON(CLAVE, {}) || {};
      todo[mision] = todo[mision] || {};
      var ant = todo[mision][textoId] || { intentos: 0, mejorPpm: 0 };
      todo[mision][textoId] = {
        intentos: (ant.intentos || 0) + 1,
        mejorPpm: Math.max(ant.mejorPpm || 0, dato.ppm),
        ppm: dato.ppm, comp: dato.comp, compDe: dato.compDe, puntos: dato.puntos, f: hoy()
      };
      guardarJSON(CLAVE, todo);
      return todo[mision][textoId];
    }

    function textos() { return (st.grado && corpus[st.grado]) || []; }
    function porId(id) {
      if (!id) return actual();
      var l = textos();
      for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i];
      return null;
    }
    function actual() {
      var l = textos();
      for (var i = 0; i < l.length; i++) if (l[i].id === st.textoId) return l[i];
      return null;
    }
    function pararTimer() { if (st.timer) { clearInterval(st.timer); st.timer = null; } }
    function reiniciar() { pararTimer(); var g = st.grado; st = limpio('elegir'); st.grado = g; }

    /* ══════════════ LA VISTA: letra y proyector ══════════════
       `off` no es un tamaño, es un RETOQUE sobre el que se ajusta solo.
       Guardar el tamaño en sí no serviría: la lectura de 2º tiene 58
       palabras y la de 9º doscientas, así que el tamaño que llena la
       pared con una deja a la otra a medias. Guardando el retoque, cada
       texto sale con la letra más grande que le cabe y el maestro que
       la quiere un punto mayor lo dice una vez, no en cada lectura. */
    var vista = leerJSON(CLAVE_VISTA, {}) || {};
    var refrescoVista = null;   /* la fase de turno dice cómo re-ajustarse */
    var btnSalir = null;
    function guardaVista() { guardarJSON(CLAVE_VISTA, vista); }
    /* `--lm-esc` es cuánto ha crecido el texto respecto a lo que la misión
       pintaba: con ella crecen también las preguntas y las actividades, en
       la misma proporción. Nunca baja de 1, ni siquiera cuando el ajuste
       achica el texto para que quepa entero en el proyector: una pregunta
       más pequeña que la de siempre no la quiere nadie. */
    function ponLetra(px, suelo) {
      raiz.style.setProperty('--lm-tam', px + 'px');
      raiz.style.setProperty('--lm-alto', altoDe(px).toFixed(2));
      raiz.style.setProperty('--lm-esc', Math.max(1, px / (suelo || px)).toFixed(3));
    }
    /* Lo que midió la última lectura. Las actividades no tienen texto que
       medir —cada una trae lo suyo— pero A− y A+ tienen que seguir
       moviéndose por la MISMA escala, o el maestro que agranda la pregunta
       se encuentra la lectura siguiente de otro tamaño. */
    var ultimoAjuste = null;
    function aplicaOffset() {
      if (!ultimoAjuste) return;
      var i = Math.max(0, Math.min(ultimoAjuste.escala.length - 1, ultimoAjuste.auto + (vista.off || 0)));
      ponLetra(ultimoAjuste.escala[i], ultimoAjuste.suelo);
    }
    function cambiaLetra(d) {
      vista.off = Math.max(-4, Math.min(9, (vista.off || 0) + d));
      guardaVista();
      /* En la lectura se vuelve a medir —el texto puede caber de otra
         forma—; en las actividades se aplica sobre lo ya medido. */
      if (refrescoVista) refrescoVista(); else aplicaOffset();
    }
    /* ── Que la capa quede de verdad ENCIMA de la misión ──
       Ponerle un z-index gigante no basta: la misión mete su contenido
       en un `.main` con `position:relative` y `z-index:1`, y eso abre un
       contexto de apilamiento. Dentro de él, NINGÚN número gana a la
       barra de XP, que va por fuera. El resultado en la pared era que
       los primeros renglones de la lectura salían tapados por la barra
       y por el encabezado de la misión, y el alumno copiaba desde la
       mitad del texto sin saber que le faltaba el principio.

       Así que se le quita el z-index a los padres mientras se proyecta
       —solo el z-index: siguen siendo `relative`, que es lo que sostiene
       lo que tengan colocado dentro— y se les devuelve al salir. No se
       esconde ni se mueve nada: si el alumno cambia de pestaña, la
       misión sigue entera y la capa se va con su sección. */
    var apilados = [];
    function apila(on) {
      if (!on) {
        apilados.forEach(function (o) { o.el.style.zIndex = o.antes; });
        apilados = [];
        return;
      }
      if (apilados.length) return;
      for (var el = raiz.parentNode; el && el.nodeType === 1 && el !== document.body; el = el.parentNode) {
        if (window.getComputedStyle(el).zIndex === 'auto') continue;
        apilados.push({ el: el, antes: el.style.zIndex });
        el.style.zIndex = 'auto';
      }
    }
    /* Los mandos de la esquina, mientras se proyecta. El ✕ siempre —sin él
       el maestro se queda encerrado en la pantalla completa—, y A− y A+
       solo FUERA de la lectura: en la lectura ya están en la franja, y
       durante el minuto no puede haber nada que toquetear.

       En las actividades hacen falta de verdad: el maestro proyecta la
       pregunta para toda la clase y hasta ahora, si se leía pequeña desde
       el fondo del aula, tenía que volverse a la lectura para agrandarla. */
    function aplicaVista() {
      raiz.classList.toggle('lm-proy', !!vista.proy);
      apila(!!vista.proy);
      if (!vista.proy) {
        if (btnSalir && btnSalir.parentNode) btnSalir.parentNode.removeChild(btnSalir);
        return;
      }
      if (!btnSalir) {
        btnSalir = document.createElement('div');
        btnSalir.className = 'lm-vista lm-salir';
        btnSalir.innerHTML =
          '<button class="lm-vbtn" id="lm-p-menos" aria-label="Letra más pequeña" title="Letra más pequeña">A−</button>' +
          '<button class="lm-vbtn" id="lm-p-mas" aria-label="Letra más grande" title="Letra más grande">A+</button>' +
          '<button class="lm-vbtn" id="lm-salir" aria-label="Salir de la pantalla completa" title="Salir de la pantalla completa">✕</button>';
        btnSalir.querySelector('#lm-p-menos').onclick = function () { suena('click'); cambiaLetra(-1); };
        btnSalir.querySelector('#lm-p-mas').onclick = function () { suena('click'); cambiaLetra(1); };
        btnSalir.querySelector('#lm-salir').onclick = function () { suena('click'); proyector(false); };
      }
      btnSalir.classList.toggle('lm-solo-salir', st.fase === 'leer');
      raiz.appendChild(btnSalir);
    }
    /* Entrar y salir no repintan la fase: si el minuto está corriendo,
       repintar lo mataría y el alumno perdería la toma a medias. Cada
       fase deja dicho en `refrescoVista` cómo recolocarse sin eso. */
    function proyector(on) {
      vista.proy = !!on;
      guardaVista();
      aplicaVista();
      try {
        var d = document.documentElement;
        var p = (on && !document.fullscreenElement && d.requestFullscreen) ? d.requestFullscreen()
          : (!on && document.fullscreenElement && document.exitFullscreen) ? document.exitFullscreen() : null;
        if (p && p.catch) p.catch(function () {});   /* si el aparato no deja, la capa sola basta */
      } catch (e) {}
      if (refrescoVista) refrescoVista();
    }
    /* Salir con Escape saca del pantalla completa del navegador. Si la
       capa se quedara puesta, el maestro tendría media cosa de cada. */
    document.addEventListener('fullscreenchange', function () {
      if (document.fullscreenElement || !vista.proy) return;
      vista.proy = false;
      guardaVista();
      aplicaVista();
      if (refrescoVista) refrescoVista();
    });
    /* Un solo oyente para toda la sección, y no uno por repintado: al
       girar la tableta hay que volver a medir, pero doce medidas sobre
       pantallas que ya no existen solo gastan batería. */
    window.addEventListener('resize', function () { if (refrescoVista) refrescoVista(); });

    /* ══════════════ utilidades que recibe cada misión ══════════════
       Con esto la misión construye sus ítems sin saber nada del motor.
       `rnd` va sembrada con el id del texto y el de la actividad: los
       mismos ítems siempre para el mismo texto. */
    function utiles(t, actoId) {
      var ps = palabras(t.texto);
      var rnd = semilla(t.id + '·' + actoId);
      return {
        ps: ps, esc: esc, clave: clave, HUECO: HUECO,
        rnd: rnd,
        baraja: function (arr) { return barajaCon(arr, rnd); },
        oraciones: function () { return oraciones(ps); },
        /* Un pedazo de la oración con la palabra subrayada: clasificar
           «bajas» sin contexto es adivinar («las nubes bajas» o «las
           casas bajas»). */
        contexto: function (ini, fin) {
          var a = Math.max(0, ini - 4), b = Math.min(ps.length - 1, (fin == null ? ini : fin) + 4);
          return (a > 0 ? '… ' : '') + ps.slice(a, b + 1).map(function (p, j) {
            var k = a + j;
            return (k >= ini && k <= (fin == null ? ini : fin)) ? '<u>' + esc(p) + '</u>' : esc(p);
          }).join(' ') + (b < ps.length - 1 ? ' …' : '');
        },
        contextoDe: function (palabra) {
          var k = clave(palabra);
          for (var i = 0; i < ps.length; i++) if (clave(ps[i]) === k) return this.contexto(i, i);
          return '';
        }
      };
    }
    /* Los ítems se calculan muchas veces (cada repintado y el resultado);
       se guardan por texto y actividad para no rehacerlos. */
    var cacheItems = {};
    function itemsDe(t, ai) {
      var a = ACTOS[ai];
      var k = t.id + '·' + ai;
      if (!cacheItems[k]) cacheItems[k] = (a.forma === 'comprension') ? t.preguntas.slice()
        : (a.forma === 'cazar') ? []          /* la caza no tiene ítems: tiene objetivos */
          : (a.items(t, utiles(t, a.id)) || []);
      return cacheItems[k];
    }

    /* ══════════════ FASE 1 · elegir grado y lectura ══════════════ */
    function pintaElegir() {
      var hist = historial();
      var lista = textos();
      var banda = st.grado ? LECTURA_NORMAS.bandas[st.grado] : null;

      raiz.innerHTML =
        '<div class="card ac-teal">' +
          '<h2>📖 Control de lectura</h2>' +
          '<p class="lm-pista">Lees <strong>un minuto en voz alta</strong>, sin tocar nada. Cuando suene el minuto marcas ' +
            'hasta dónde llegaste, y después trabajas ese mismo texto en <strong>' + ACTOS.length + ' actividades</strong>: ' +
            ACTOS.map(function (a) { return a.icono + ' ' + a.titulo.toLowerCase(); }).join(', ') + '.</p>' +
          '<p class="lm-pista"><strong>' + (st.grado ? 'Tu grado:' : '👇 Toca tu grado para ver tus cinco lecturas:') + '</strong></p>' +
          '<div class="lm-grados" role="group" aria-label="Elegir grado">' +
            grados.map(function (g) {
              return '<button class="lm-grado' + (g === st.grado ? ' on' : '') + '" data-lm-grado="' + g + '">' + g + 'º</button>';
            }).join('') +
          '</div>' +
          (banda ? '<p class="lm-pista">Al terminar ' + st.grado + 'º se espera leer entre <strong>' + banda[0] + ' y ' +
            banda[1] + ' palabras por minuto</strong> (' + esc(LECTURA_NORMAS.fuenteCorta) + '). Es la meta de <em>fin de año</em>: ' +
            'a mitad del curso es normal ir por debajo.</p>' : '') +
        '</div>' +
        (!st.grado ? '' :
        '<div class="card ac-gold">' +
          '<h2>📚 Tus cinco lecturas de ' + st.grado + 'º</h2>' +
          '<p class="lm-pista">Todas son de Honduras y de ' + esc(tema) + '.</p>' +
          '<div class="lm-lista">' +
            lista.map(function (t) {
              var n = palabras(t.texto).length;
              var h = hist[t.id];
              return '<button class="lm-txt-row' + (t.id === st.textoId ? ' on' : '') + '" data-lm-texto="' + esc(t.id) + '">' +
                '<span class="lm-txt-tit">' + esc(t.titulo) + '</span>' +
                '<span class="lm-txt-meta">' + esc(t.genero) + ' · ' + n + ' palabras' +
                (h ? ' · ✅ tu mejor marca: ' + h.mejorPpm + ' ppm' : '') + '</span></button>';
            }).join('') +
          '</div>' +
          '<div class="lm-btns">' +
            '<button class="btn btn-pri" id="lm-empezar"' + (st.textoId ? '' : ' disabled') + '>⏱️ Empezar el minuto</button>' +
            '<button class="btn btn-g" id="lm-papel"' + (st.textoId ? '' : ' disabled') + '>🖨️ Imprimir en papel</button>' +
          '</div>' +
          '<p class="lm-pista">🖨️ En papel salen <strong>tres hojas</strong>: dos con la lectura y sus actividades para el ' +
            'alumno, y la clave para el maestro. En un aula de 43 no hay un teléfono por niño, y la lectura se toma igual.</p>' +
          /* Al maestro, de tú, y contándole lo que gana: sin esta línea el
             botón 📽️ del minuto no lo encuentra nadie. */
          '<p class="lm-pista">📽️ <strong>¿La estás proyectando?</strong> Dentro de la lectura, el botón 📽️ la pone a ' +
            'pantalla completa y agranda la letra hasta llenarla, con el texto entero a la vista para que tus alumnos ' +
            'lo copien desde su pupitre. Con <strong>A−</strong> y <strong>A+</strong> la dejas a tu gusto y así se queda.</p>' +
        '</div>');

      cada('[data-lm-grado]', function (b) {
        b.onclick = function () {
          suena('click');
          st.grado = +b.dataset.lmGrado; st.textoId = null;
          guardarJSON(CLAVE_PREF, { grado: st.grado });
          pinta();
        };
      });
      cada('[data-lm-texto]', function (b) {
        b.onclick = function () { suena('click'); st.textoId = b.dataset.lmTexto; pinta(); };
      });
      var pa = document.getElementById('lm-papel');
      if (pa) pa.onclick = function () { suena('click'); imprimir(actual()); };
      var e = document.getElementById('lm-empezar');
      if (e) e.onclick = function () {
        if (!actual()) return;
        suena('click');
        var g = st.grado, id = st.textoId;
        st = limpio('leer'); st.grado = g; st.textoId = id;
        pinta();
      };
    }

    /* ══════════════ FASE 2 · el minuto ══════════════ */
    function pintaLeer() {
      var t = actual();
      if (!t) { reiniciar(); pinta(); return; }
      var ps = palabras(t.texto);

      /* El texto arriba y el mando abajo: qué hay que hacer y los botones.
         Antes iban encima del texto y el alumno terminaba el minuto
         mirando el final de la lectura, con la orden y el botón fuera de
         la pantalla. El cronómetro ya no está aquí: se mide con el reloj
         de arena de la esquina. */
      raiz.innerHTML =
        '<div class="card ac-teal">' +
          '<h2>⏱️ ' + esc(t.titulo) + '</h2>' +
          '<div class="lm-texto lm-manda" id="lm-texto" aria-label="Texto para leer en voz alta">' +
            ps.map(function (p, i) { return '<span class="lm-p" data-i="' + i + '">' + esc(p) + '</span>'; }).join(' ') +
          '</div>' +
        '</div>' +
        '<div class="lm-panel" id="lm-panel">' +
          /* La instrucción se dice en dos renglones y no en cuatro: este
             panel se queda encima del texto, así que cada renglón suyo es
             un renglón de lectura tapado. Lo de «Terminé el texto» se
             cuenta al arrancar, que es cuando ese botón existe. */
          '<div class="lm-crono-sub" id="lm-sub">Al arrancar, <strong>lee en voz alta</strong>. ' +
            'No toques nada: al cumplirse el minuto te pregunto hasta dónde llegaste.</div>' +
          /* Para el maestro que proyecta. Se van al arrancar el minuto:
             mientras se lee, la pantalla no pide nada. */
          '<div class="lm-vista" id="lm-vista">' +
            '<button class="lm-vbtn" id="lm-menos" aria-label="Letra más pequeña" title="Letra más pequeña">A−</button>' +
            '<button class="lm-vbtn" id="lm-mas" aria-label="Letra más grande" title="Letra más grande">A+</button>' +
            '<button class="lm-vbtn' + (vista.proy ? ' on' : '') + '" id="lm-proyector" ' +
              'aria-label="Ver a pantalla completa, para el proyector" title="Pantalla completa (proyector)">📽️</button>' +
          '</div>' +
          '<div id="lm-avisos"></div>' +
          '<div class="lm-btns">' +
            '<button class="btn btn-pri" id="lm-arrancar">▶️ Arrancar</button>' +
            '<button class="btn btn-g" id="lm-termine" style="display:none">✅ Terminé el texto</button>' +
            '<button class="btn btn-g" id="lm-seguir" style="display:none">👉 Seguir a las actividades</button>' +
            '<button class="btn btn-d" id="lm-cancelar">Cancelar</button>' +
          '</div>' +
        '</div>' +
        /* El reloj de la esquina: sale mientras corre el minuto, aquí y en
           el teléfono. Lleva al lado el «terminé» para cuando se proyecta,
           porque entonces la franja donde vive ese botón se esconde y sin
           él quien acabe antes de los 60 s no tendría cómo decirlo. */
        '<div class="lm-reloj" id="lm-reloj" style="display:none" role="timer" aria-live="off">' +
          '<b>⏳<span id="lm-reloj-n">' + SEGUNDOS + '</span></b>' +
          '<button class="lm-vbtn" id="lm-reloj-fin" aria-label="Terminé el texto" title="Terminé el texto">✅</button>' +
        '</div>';

      var sub = document.getElementById('lm-sub');
      var avisos = document.getElementById('lm-avisos');
      var caja = document.getElementById('lm-texto');
      var btnArr = document.getElementById('lm-arrancar');
      var btnFin = document.getElementById('lm-termine');
      var btnSeguir = document.getElementById('lm-seguir');
      var spans = caja.querySelectorAll('.lm-p');
      var panel = document.getElementById('lm-panel');
      var reloj = document.getElementById('lm-reloj');
      var relojN = document.getElementById('lm-reloj-n');

      /* El panel se queda pegado abajo y TAPA lo que pase por debajo. Sin
         este hueco, el último renglón de la lectura queda partido detrás
         de él y el alumno no puede ni leerlo ni tocarlo al marcar. Se mide
         el panel en vez de dejar un hueco a ojo, porque su alto cambia con
         el aviso que tenga puesto y con el tamaño de letra del teléfono. */
      function ajustaHueco() {
        /* Proyectando y con el minuto en marcha no hay franja: el hueco lo
           marca el reloj de la esquina, que también tapa lo que pase por
           debajo, aunque sea mucho menos. */
        var franja = panel.style.display === 'none' ? 0 : panel.offsetHeight;
        var esfera = (franja || reloj.style.display === 'none') ? 0 : reloj.offsetHeight + 8;
        caja.style.paddingBottom = (franja + esfera + 14) + 'px';
      }

      /* ── La letra más grande con la que el texto cabe ENTERO ──
         Se prueban de mayor a menor y se para en la primera que quepa
         por encima del mando. El suelo es el tamaño que manda el CSS
         —el de siempre—: en el teléfono no cabe ninguno de los grandes,
         así que el alumno ve exactamente lo que veía, y solo la pantalla
         del aula se lleva la letra grande.

         No se ajusta a media lectura: cambiar el tamaño mientras el niño
         lee le mueve todos los renglones y le hace perder la línea, que
         es la forma más tonta de estropear una toma de fluidez. El
         maestro lo deja puesto antes de arrancar. */
      function ajustaLetra() {
        var hueco = caja.style.paddingBottom;
        caja.style.paddingBottom = '0px';
        raiz.style.removeProperty('--lm-tam');
        raiz.style.removeProperty('--lm-alto');
        /* El suelo se mide sobre una PALABRA y con el ajuste apartado: así
           sale el tamaño con el que la misión pintaba este texto antes de
           que existiera nada de esto —modo «letra grande» incluido— y
           nadie acaba leyendo más pequeño que ayer. */
        caja.classList.remove('lm-manda');
        var una = caja.querySelector('.lm-p');
        var suelo = parseFloat(window.getComputedStyle(una || caja).fontSize) || 19;
        caja.classList.add('lm-manda');
        /* EN EL PROYECTOR se prueban todos los tamaños, también los más
           pequeños que el de siempre: la pared ya agranda, y allí lo que
           no se puede perder es el final del texto —el alumno que copia
           desde su pupitre no hace scroll—. En el TELÉFONO, en cambio, el
           de siempre es el suelo: nadie tiene que leer más pequeño que
           ayer para ganar un renglón que igual no cabe. */
        var escala = LM_TAMS.filter(function (v) {
          return vista.proy ? Math.abs(v - suelo) > 0.5 : v > suelo + 0.5;
        });
        escala.push(suelo);
        escala.sort(function (a, b) { return a - b; });
        /* El sitio libre se vuelve a medir CON CADA tamaño probado, no una
           vez al principio. Lo que va encima del texto —el título— crece
           con él, así que un hueco medido antes miente; y peor: al pedir
           A+ el título crecía, el hueco menguaba, el ajuste bajaba un
           escalón y la letra se quedaba igual. */
        var auto = -1;
        for (var i = escala.length - 1; i >= 0; i--) {
          ponLetra(escala[i], suelo);
          var libre = window.innerHeight - Math.max(0, caja.getBoundingClientRect().top) - panel.offsetHeight - 16;
          if (caja.scrollHeight <= libre) { auto = i; break; }
        }
        if (auto < 0) auto = escala.indexOf(suelo);   /* no cabe ni el más pequeño: el de siempre */
        /* Se guarda lo medido: en las actividades no hay texto que medir,
           pero A− y A+ tienen que seguir moviéndose por esta misma escala. */
        ultimoAjuste = { escala: escala, auto: auto, suelo: suelo };
        aplicaOffset();
        caja.style.paddingBottom = hueco;
      }
      /* ── Primero, subir a donde empieza el texto ──
         Repintar no mueve la página. El maestro toca «Empezar el minuto»
         con la lista de las cinco lecturas desplazada, la pantalla se
         cambia por el texto… y el texto nace medio metro más arriba de
         lo que se ve: el alumno arranca a leer por la mitad. Y de paso
         el ajuste de la letra mediría contra un hueco que nadie mira.
         Se deja sitio arriba por si la misión lleva barra pegada. */
      function subeAlTexto() {
        var r = raiz.getBoundingClientRect();
        if (r.top >= 0 && r.top < window.innerHeight * 0.35) return;   /* ya se ve bien */
        var y = (window.pageYOffset || document.documentElement.scrollTop || 0) + r.top - 56;
        window.scrollTo(0, Math.max(0, y));
      }
      function ajusta(letra) {
        if (!vista.proy) subeAlTexto();
        if (letra && !st.ini) ajustaLetra();
        ajustaHueco();
      }
      /* Entrar o salir de presentación a mitad del minuto tiene que dejar
         el mando donde corresponda. Salir con la franja escondida dejaba
         al alumno sin cronómetro y sin botones, mirando un texto quieto. */
      refrescoVista = function () {
        presenta(!!st.ini && !st.congelado);
        ajusta(true);
      };
      ajusta(true);

      var vst = document.getElementById('lm-vista');
      document.getElementById('lm-menos').onclick = function () { suena('click'); cambiaLetra(-1); };
      document.getElementById('lm-mas').onclick = function () { suena('click'); cambiaLetra(1); };
      document.getElementById('lm-proyector').onclick = function () { suena('click'); proyector(!vista.proy); };

      function marca(i) {
        if (i == null || i < 0 || i >= spans.length) return;
        st.idx = i;
        for (var k = 0; k < spans.length; k++) {
          spans[k].classList.toggle('lm-leida', k < i);
          spans[k].classList.toggle('lm-aqui', k === i);
        }
      }
      function aviso(html, cls) {
        avisos.innerHTML = '<div class="lm-aviso ' + (cls || '') + '">' + html + '</div>';
        ajustaHueco();
      }

      /* ── MIENTRAS SE LEE NO SE TOCA NADA ──
         Hubo una versión en la que el alumno iba pasando el dedo por
         encima de lo que leía y el texto se pintaba detrás. Se quitó por
         lo mismo que el selector de modos: el maestro reportó que
         distraía muchísimo de la lectura. El niño acababa pendiente de
         que el dedo no se le adelantara en vez de leer, que es justo lo
         que se está midiendo.

         Queda el gesto de la toma clásica, la que el maestro hace en
         papel: se lee y ya; cuando suena el minuto, se marca de UN SOLO
         TOQUE la última palabra leída. */
      caja.addEventListener('click', function (ev) {
        if (!st.congelado) return;   /* durante el minuto, el texto es solo texto */
        var el = ev.target.closest ? ev.target.closest('.lm-p') : null;
        if (!el) return;
        var primera = st.idx == null;
        marca(+el.dataset.i);
        suena('click');
        if (primera) {
          btnSeguir.style.display = '';
          aviso('✅ <strong>Marcaste ' + (st.idx + 1) + ' palabra' + (st.idx ? 's' : '') + '.</strong> ' +
            'Si te equivocaste, toca otra; si está bien, sigue a las actividades.', 'lm-av-ok');
        }
      });
      /* Teclado: en la computadora del aula o con el proyector no hay
         dedo. Las flechas mueven la marca, también solo al final. */
      caja.setAttribute('tabindex', '0');
      caja.addEventListener('keydown', function (ev) {
        if (!st.congelado) return;
        var paso = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[ev.key];
        var antes = st.idx;
        if (paso) { marca(Math.max(0, Math.min(spans.length - 1, (st.idx == null ? -1 : st.idx) + paso))); ev.preventDefault(); }
        else if (ev.key === 'Home') { marca(0); ev.preventDefault(); }
        else if (ev.key === 'End') { marca(spans.length - 1); ev.preventDefault(); }
        if (antes == null && st.idx != null) btnSeguir.style.display = '';
      });

      function alTaller() {
        if (st.idx == null) { aviso('👆 Antes marca <strong>hasta dónde llegaste a leer</strong>: toca esa palabra.', 'lm-av-no'); return; }
        pararTimer();
        st.fase = 'taller'; st.acto = 0;
        pinta();
      }

      /* El mando del minuto, según se esté leyendo o no.
         El reloj de la esquina sale mientras corre el minuto en las dos
         pantallas. La franja, en cambio, solo se esconde PROYECTANDO: en
         el teléfono es lo único que hay, y quitarla dejaría al alumno sin
         saber qué hacer. */
      function presenta(leyendo) {
        reloj.style.display = leyendo ? '' : 'none';
        panel.style.display = (leyendo && vista.proy) ? 'none' : '';
        /* El reloj se muda: vive DENTRO de la franja cuando la hay —así va
           donde vaya ella— y se sale a la esquina de la pantalla cuando se
           proyecta, porque entonces la franja se esconde y se lo llevaría
           con ella. Es el mismo botón de siempre, solo cambia de sitio. */
        var sitio = vista.proy ? raiz : panel;
        if (reloj.parentNode !== sitio) {
          sitio.insertBefore(reloj, sitio === panel ? panel.firstChild : null);
        }
        ajustaHueco();
      }

      function terminarMinuto(porTiempo) {
        pararTimer();
        st.congelado = true;
        /* Vuelve la franja: se acabó el minuto y ahora toca marcar hasta
           dónde llegó y seguir, y esos botones viven ahí. */
        presenta(false);
        st.seg = porTiempo ? SEGUNDOS : Math.max(1, Math.round((Date.now() - st.ini) / 100) / 10);
        btnFin.style.display = 'none';
        suena('up'); vibra([180, 90, 180]);
        if (porTiempo) {
          /* Solo AQUÍ el texto se vuelve tocable, y el botón de seguir no
             aparece hasta que haya marcado: sin la marca no hay palabras
             por minuto que calcular, y un botón visible antes de tiempo
             invita a saltarse el único paso que hace falta. */
          caja.classList.add('lm-viva');
          sub.innerHTML = 'Se acabó el minuto.';
          aviso('⏰ <strong>¡Minuto cumplido!</strong> Ahora toca la <strong>última palabra que alcanzaste a leer</strong>.');
        } else {
          marca(spans.length - 1);
          btnSeguir.style.display = '';
          sub.innerHTML = 'Leíste el texto completo.';
          aviso('✅ <strong>Leíste todo el texto en ' + st.seg + ' segundos.</strong> Vamos a las actividades.', 'lm-av-ok');
        }
      }

      btnArr.onclick = function () {
        if (st.ini) return;
        suena('click');
        st.ini = Date.now();
        btnArr.style.display = 'none';
        btnFin.style.display = '';
        /* Mientras corre el minuto no queda NADA que toquetear: ni el
           tamaño de la letra ni el proyector. Ya se quitó de aquí un
           selector de modos por esto mismo — el niño se ponía a probarlo
           y llegaba al minuto sin haber leído una línea. */
        if (vst) vst.style.display = 'none';
        sub.innerHTML = 'Lee en voz alta, sin prisa. Si acabas antes, toca <strong>«Terminé el texto»</strong>.';
        /* Proyectando, la franja entera se va y deja el muro para el
           texto: el que copia desde su pupitre necesita renglones, no
           una cuenta atrás de dos dedos de alto. */
        presenta(true);
        ajustaHueco();
        st.timer = setInterval(function () {
          var ms = Date.now() - st.ini;
          var quedan = Math.max(0, SEGUNDOS - ms / 1000);
          relojN.textContent = Math.ceil(quedan);
          reloj.classList.toggle('lm-poco', quedan <= 10 && quedan > 0);
          if (ms >= SEGUNDOS * 1000) terminarMinuto(true);
        }, 250);
      };
      btnFin.onclick = function () {
        if (!st.ini || st.congelado) return;
        terminarMinuto(false);   /* él ya marca la última palabra */
      };
      document.getElementById('lm-reloj-fin').onclick = btnFin.onclick;
      btnSeguir.onclick = alTaller;
      document.getElementById('lm-cancelar').onclick = function () { suena('click'); reiniciar(); pinta(); };
    }

    /* ══════════════ FASE 3 · el taller ══════════════ */
    function cabecera(t) {
      return '<div class="lm-pasos">' +
        ACTOS.map(function (a, i) {
          return '<span class="lm-paso ' + (i === st.acto ? 'on' : (i < st.acto ? 'ya' : '')) + '">' +
            (i < st.acto ? '✓' : (i + 1)) + '</span>';
        }).join('') +
        '<span>Actividad ' + (st.acto + 1) + ' de ' + ACTOS.length + ' · «' + esc(t.titulo) + '»</span></div>';
    }
    function siguienteActo() {
      st.acto++;
      if (st.acto >= ACTOS.length) st.fase = 'resultado';
      pinta();
    }
    function rotuloSiguiente(esUltima, propio) {
      if (!esUltima) return propio || 'Siguiente ▶';
      var sig = ACTOS[st.acto + 1];
      return sig ? sig.icono + ' Seguir: ' + sig.titulo.toLowerCase() : '📊 Ver mi resultado';
    }

    function pintaTaller() {
      var t = actual();
      if (!t) { reiniciar(); pinta(); return; }
      var a = ACTOS[st.acto];
      var items = itemsDe(t, st.acto);
      if (!items.length && a.forma !== 'cazar') { siguienteActo(); return; }
      if (a.forma === 'comprension') formaComprension(t, a, items);
      else if (a.forma === 'cazar') formaCazar(t, a);
      else if (a.forma === 'dosGrupos') formaDosGrupos(t, a, items);
      else if (a.forma === 'ordenar') formaOrdenar(t, a, items);
      else formaTresOpciones(t, a, items);
    }

    /* ── FORMA · comprensión: UNA pregunta a la vez y en letra grande ── */
    function formaComprension(t, a, items) {
      var e = st.est[st.acto];
      var i = Math.min(e.i, items.length - 1);
      var p = items[i];
      var dada = e.resp[i];
      var LETRA = ['a', 'b', 'c'];
      var esUltima = i === items.length - 1;

      raiz.innerHTML =
        '<div class="card ac-gold">' + cabecera(t) +
          '<h2>' + a.icono + ' ' + esc(a.titulo) + '</h2>' +
          '<p class="lm-pista">Pregunta ' + (i + 1) + ' de ' + items.length + ' · contesta sin volver a mirar el texto.</p>' +
          '<div class="lm-preg-q">' + esc(p.q) + '</div>' +
          opciones(p.o, dada, p.c) +
          (dada == null ? '' :
            '<div class="lm-guia">' +
              (dada === p.c ? '✅ <strong>¡Correcto!</strong> ' : '💡 <strong>La respuesta era la ' + LETRA[p.c] + ').</strong> ') +
              esc(p.r) +
              (p.tipo === 'critica' ? '<br><br>🗣️ En las preguntas de <strong>opinión</strong> también vale otra respuesta si la ' +
                'defiendes con un buen porqué. Cuéntasela a tu maestro.' : '') +
            '</div>') +
          barraNav(dada == null ? null : rotuloSiguiente(esUltima)) +
        '</div>';

      enlazaOpciones(function (j) { e.resp[i] = j; suena(j === p.c ? 'ok' : 'no'); pinta(); }, dada != null);
      enlazaSiguiente(function () { if (esUltima) siguienteActo(); else { e.i = i + 1; pinta(); } });
    }

    /* ── FORMA · cazar: se toca sobre el texto ── */
    function formaCazar(t, a) {
      var u = utiles(t, a.id);
      var ps = u.ps;
      var e = st.est[st.acto];
      var objetivos = a.objetivos(t, u) || [];
      var neutros = (a.neutros ? a.neutros(t, u) : []) || [];
      var meta = Math.min(a.meta || 10, objetivos.length);
      var hallados = e.hallados.length;
      var cumplida = hallados >= meta || e.rendido;
      /* Índice de palabra → rango objetivo, para que tocar cualquier
         palabra de «cuarenta y dos mil» encienda el número entero. */
      var mapa = {}, mapaNeutro = {};
      objetivos.forEach(function (o, k) { for (var i = o.ini; i <= o.fin; i++) mapa[i] = k; });
      neutros.forEach(function (o, k) { for (var i = o.ini; i <= o.fin; i++) if (mapa[i] == null) mapaNeutro[i] = k; });

      function claseDe(i) {
        for (var k = 0; k < e.hallados.length; k++) {
          var o = objetivos[e.hallados[k]];
          if (i >= o.ini && i <= o.fin) return 'lm-hallada';
        }
        if (e.rendido && mapa[i] != null) return objetivos[mapa[i]].clase === 'b' ? 'lm-b' : 'lm-a';
        return '';
      }

      raiz.innerHTML =
        '<div class="card ac-jade">' + cabecera(t) +
          '<h2>' + a.icono + ' ' + esc(a.titulo) + '</h2>' +
          '<p class="lm-pista">' + a.instruccion(t, u, { total: objetivos.length, meta: meta }) + '</p>' +
          '<div class="lm-marcador">🎯 ' + Math.min(hallados, meta) + ' de ' + meta + ' encontrados' +
            (hallados > meta ? ' <em>(¡y llevas ' + hallados + ' en total!)</em>' : '') +
            /* El contador de fallos se actualiza SIN repintar: repintar
               borraría el temblor de la palabra y el mensaje que explica
               por qué no era, que es lo único que enseña. */
            '<em id="lm-fallos">' + (e.fallos ? ' · ' + e.fallos + ' intento(s) fallido(s)' : '') + '</em></div>' +
          '<div id="lm-avisos">' + (cumplida
            ? '<div class="lm-aviso lm-av-ok">🎉 <strong>' + (e.rendido ? 'Aquí los tienes todos.' : '¡Meta cumplida!') + '</strong> ' +
              (e.rendido ? 'Los que te faltaban quedaron marcados.' : 'Puedes seguir cazando o pasar a la siguiente actividad.') + '</div>'
            : '') + '</div>' +
          '<div class="lm-texto lm-viva lm-manda" id="lm-texto">' +
            ps.map(function (p, i) {
              return '<span class="lm-p ' + claseDe(i) + '" data-i="' + i + '">' + esc(p) + '</span>';
            }).join(' ') +
          '</div>' +
          '<div class="lm-btns">' + botonAtras() +
            (cumplida ? '<button class="btn btn-pri" id="lm-sig">' + rotuloSiguiente(true) + '</button>' : '') +
            (!e.rendido ? '<button class="btn btn-d" id="lm-rindo">😕 No encuentro más</button>' : '') +
          '</div>' +
        '</div>';

      var caja = document.getElementById('lm-texto');
      var avisos = document.getElementById('lm-avisos');
      caja.addEventListener('click', function (ev) {
        var el = ev.target.closest ? ev.target.closest('.lm-p') : null;
        if (!el || e.rendido) return;
        var i = +el.dataset.i;
        if (mapa[i] != null) {
          if (e.hallados.indexOf(mapa[i]) >= 0) return;
          e.hallados.push(mapa[i]);
          suena('ok');
          pinta();
          return;
        }
        if (mapaNeutro[i] != null) {
          avisos.innerHTML = '<div class="lm-aviso">🤝 ' + neutros[mapaNeutro[i]].motivo + '</div>';
          return;
        }
        e.fallos++;
        var cf = document.getElementById('lm-fallos');
        if (cf) cf.textContent = ' · ' + e.fallos + ' intento(s) fallido(s)';
        suena('no');
        el.classList.add('lm-fallo');
        setTimeout(function () { el.classList.remove('lm-fallo'); }, 320);
        avisos.innerHTML = '<div class="lm-aviso lm-av-no">' + a.fallo(ps[i].replace(LIMPIA, ''), u) + '</div>';
      });
      var atr = document.getElementById('lm-atras');
      if (atr) atr.onclick = function () { suena('click'); irAtras(); };
      var sig = document.getElementById('lm-sig');
      if (sig) sig.onclick = function () { suena('click'); siguienteActo(); };
      var rindo = document.getElementById('lm-rindo');
      if (rindo) rindo.onclick = function () { suena('click'); e.rendido = true; pinta(); };
    }

    /* ── FORMA · dos grupos ── */
    function formaDosGrupos(t, a, items) {
      var e = st.est[st.acto];
      var i = Math.min(e.i, items.length - 1);
      var it = items[i];
      var dada = e.resp[i];
      var esUltima = i === items.length - 1;

      raiz.innerHTML =
        '<div class="card ac-purple">' + cabecera(t) +
          '<h2>' + a.icono + ' ' + esc(a.titulo) + '</h2>' +
          '<p class="lm-pista">' + (a.pista || ('Ítem ' + (i + 1) + ' de ' + items.length)) + ' · ' +
            (i + 1) + ' de ' + items.length + '</p>' +
          '<div class="lm-frase">' + it.contexto + '</div>' +
          '<div class="lm-dosbtn">' +
            a.grupos.map(function (g, gi) {
              var cls = 'lm-g' + gi;
              if (dada) { if (it.grupo === g.clave) cls += ' lm-ok'; else if (dada === g.clave) cls += ' lm-no'; }
              return '<button class="' + cls + '" data-lm-grupo="' + g.clave + '"' + (dada ? ' disabled' : '') + '>' +
                '<b>' + g.titulo + '</b><small>' + g.pista + '</small></button>';
            }).join('') +
          '</div>' +
          (!dada ? '' :
            '<div class="lm-guia">' +
              (dada === it.grupo ? '✅ <strong>¡Correcto!</strong> ' : '💡 <strong>Era ' + esc(nombreGrupo(a, it.grupo)) + '.</strong> ') +
              it.explica + '</div>') +
          barraNav(dada ? rotuloSiguiente(esUltima, a.siguiente) : null) +
        '</div>';

      cada('[data-lm-grupo]', function (b) {
        b.onclick = function () {
          if (e.resp[i]) return;
          e.resp[i] = b.dataset.lmGrupo;
          suena(e.resp[i] === it.grupo ? 'ok' : 'no');
          pinta();
        };
      });
      enlazaSiguiente(function () { if (esUltima) siguienteActo(); else { e.i = i + 1; pinta(); } });
    }
    function nombreGrupo(a, clave) {
      for (var i = 0; i < a.grupos.length; i++) if (a.grupos[i].clave === clave) return a.grupos[i].nombre || a.grupos[i].titulo;
      return clave;
    }

    /* ── FORMA · tres opciones ── */
    function formaTresOpciones(t, a, items) {
      var e = st.est[st.acto];
      var i = Math.min(e.i, items.length - 1);
      var it = items[i];
      var dada = e.resp[i];
      var esUltima = i === items.length - 1;

      raiz.innerHTML =
        '<div class="card ac-amber">' + cabecera(t) +
          '<h2>' + a.icono + ' ' + esc(a.titulo) + '</h2>' +
          '<p class="lm-pista">' + (a.pista || '') + (a.pista ? ' · ' : '') + (i + 1) + ' de ' + items.length + '</p>' +
          (it.frase ? '<div class="lm-frase">' + it.frase.replace(HUECO, dada != null
            ? '<u>' + esc(it.ops[it.c]) + '</u>' : '<span class="lm-hueco">?</span>') + '</div>' : '') +
          (it.enunciado ? '<div class="lm-preg-q">' + it.enunciado + '</div>' : '') +
          opciones(it.ops, dada, it.c) +
          (dada == null ? '' :
            '<div class="lm-guia">' + (dada === it.c ? '✅ <strong>¡Así es!</strong> ' : '💡 ') +
              (dada === it.c ? (it.bien || '') : (it.mal || '')) + '</div>') +
          barraNav(dada == null ? null : rotuloSiguiente(esUltima, a.siguiente)) +
        '</div>';

      enlazaOpciones(function (j) { e.resp[i] = j; suena(j === it.c ? 'ok' : 'no'); pinta(); }, dada != null);
      enlazaSiguiente(function () { if (esUltima) siguienteActo(); else { e.i = i + 1; pinta(); } });
    }

    /* ── FORMA · ordenar: se tocan las fichas en el orden correcto ── */
    function formaOrdenar(t, a, items) {
      var e = st.est[st.acto];
      var i = Math.min(e.i, items.length - 1);
      var it = items[i];
      var esUltima = i === items.length - 1;
      var r = e.rondas[i] || (e.rondas[i] = { puestos: [], fallo: false });
      var listo = r.puestos.length === it.fichas.length;
      /* El orden correcto se calcula del valor, no se escribe: así una
         misión no puede equivocarse al declararlo. */
      var orden = it.fichas.map(function (f, k) { return k; })
        .sort(function (x, y) { return it.fichas[x].v - it.fichas[y].v; });

      raiz.innerHTML =
        '<div class="card ac-teal">' + cabecera(t) +
          '<h2>' + a.icono + ' ' + esc(a.titulo) + '</h2>' +
          '<p class="lm-pista">' + (a.pista || '') + (a.pista ? ' · ' : '') + 'Ronda ' + (i + 1) + ' de ' + items.length + '</p>' +
          (it.enunciado ? '<div class="lm-preg-q">' + it.enunciado + '</div>' : '') +
          '<div class="lm-escalera" id="lm-escalera">' +
            (r.puestos.length
              ? r.puestos.map(function (k, n) { return (n ? '<span>&lt;</span>' : '') + '<b>' + esc(it.fichas[k].txt) + '</b>'; }).join(' ')
              : '<span>Toca primero el más pequeño…</span>') +
          '</div>' +
          '<div class="lm-fichas">' +
            it.fichas.map(function (f, k) {
              var puesto = r.puestos.indexOf(k);
              /* «cuatrocientos veinticinco mil» no cabe con la letra de
                 «425,000»: la ficha larga baja de tamaño para que se lea
                 entera en un teléfono. */
              return '<button class="lm-ficha' + (f.txt.length > 14 ? ' lm-larga' : '') +
                (puesto >= 0 ? ' lm-puesta' : '') + '" data-lm-ficha="' + k + '"' +
                (puesto >= 0 ? ' disabled' : '') + '>' + esc(f.txt) +
                (puesto >= 0 ? '<i>' + (puesto + 1) + 'º</i>' : '') + '</button>';
            }).join('') +
          '</div>' +
          '<div id="lm-avisos"></div>' +
          (listo ? '<div class="lm-guia">' + (r.fallo
            ? '💡 ' + (it.mal || 'Ya está en orden. Fíjate en la cantidad de cifras: el que tiene más cifras es siempre mayor.')
            : '✅ <strong>¡En orden, de una!</strong> ' + (it.bien || '')) + '</div>' : '') +
          barraNav(listo ? rotuloSiguiente(esUltima, a.siguiente) : null) +
        '</div>';

      var avisos = document.getElementById('lm-avisos');
      cada('[data-lm-ficha]', function (b) {
        b.onclick = function () {
          var k = +b.dataset.lmFicha;
          if (r.puestos.indexOf(k) >= 0) return;
          var toca = orden[r.puestos.length];
          if (k === toca) {
            r.puestos.push(k);
            suena('ok');
            pinta();
          } else {
            e.fallos++; r.fallo = true;
            suena('no');
            b.classList.add('lm-fallo');
            setTimeout(function () { b.classList.remove('lm-fallo'); }, 320);
            avisos.innerHTML = '<div class="lm-aviso lm-av-no">❌ Ese no es el más pequeño de los que quedan. ' +
              'Mira cuántas cifras tiene cada uno: <strong>más cifras, más grande</strong>. Si tienen las mismas, ' +
              'compara la primera cifra de la izquierda.</div>';
          }
        };
      });
      enlazaSiguiente(function () {
        if (esUltima) siguienteActo();
        else { e.i = i + 1; pinta(); }
      });
    }

    /* ── piezas compartidas de las formas ── */
    function opciones(ops, dada, correcta) {
      var LETRA = ['a', 'b', 'c'];
      return '<div class="lm-ops" role="group">' + ops.map(function (o, j) {
        var cls = 'lm-op';
        if (dada != null) {
          if (j === correcta) cls += ' lm-ok';
          else if (dada === j) cls += ' lm-no';
        }
        return '<button class="' + cls + '" data-lm-op="' + j + '"' + (dada != null ? ' disabled' : '') + '>' +
          '<b>' + LETRA[j] + ')</b> ' + esc(o) + '</button>';
      }).join('') + '</div>';
    }
    function enlazaOpciones(fn, yaHecho) {
      cada('[data-lm-op]', function (b) { b.onclick = function () { if (yaHecho) return; fn(+b.dataset.lmOp); }; });
    }
    /* ── VOLVER A LO ANTERIOR ──
       Lo pidió el maestro viéndolo en el aula: el niño contesta de
       prisa, quiere releer la pregunta de antes o mirar otra vez el
       adjetivo que acaba de clasificar, y no había por dónde. Se
       quedaba con la duda o abandonaba la actividad entera.

       Volver deja MIRAR, no rehacer: lo contestado sigue contestado,
       con su corrección puesta y los botones desactivados, igual que
       cuando lo dejó. Por eso desde aquí no se puede tocar el puntaje.

       No hay atrás en el primer ítem de la primera actividad: ahí
       «atrás» sería volver al texto, y el minuto ya se tomó. */
    function actoConItems(ai) { return ACTOS[ai].forma !== 'cazar'; }
    function hayAtras() {
      if (st.acto > 0) return true;
      return actoConItems(st.acto) && st.est[st.acto].i > 0;
    }
    function irAtras() {
      var t = actual();
      if (!t) return;
      var e = st.est[st.acto];
      if (actoConItems(st.acto) && e.i > 0) { e.i--; pinta(); return; }
      /* Una actividad sin ítems se salta sola hacia adelante; al volver
         hay que saltarla también, o el alumno rebota entre las dos. */
      var ai = st.acto - 1;
      while (ai >= 0 && actoConItems(ai) && !itemsDe(t, ai).length) ai--;
      if (ai < 0) return;
      st.acto = ai;
      if (actoConItems(ai)) st.est[ai].i = Math.max(0, itemsDe(t, ai).length - 1);
      pinta();
    }
    function botonAtras() {
      return hayAtras() ? '<button class="btn btn-d" id="lm-atras">◀ Atrás</button>' : '';
    }
    /* La barra de abajo de cada actividad: atrás siempre que haya sitio
       a dónde volver, y seguir solo cuando ya contestó. */
    function barraNav(rotulo) {
      var izq = botonAtras();
      if (!izq && !rotulo) return '';
      return '<div class="lm-btns">' + izq +
        (rotulo ? '<button class="btn btn-pri" id="lm-sig">' + rotulo + '</button>' : '') + '</div>';
    }
    function enlazaSiguiente(fn) {
      var a = document.getElementById('lm-atras');
      if (a) a.onclick = function () { suena('click'); irAtras(); };
      var b = document.getElementById('lm-sig');
      if (b) b.onclick = function () { suena('click'); fn(); };
    }

    /* ── puntaje de cada actividad ── */
    function puntosDe(t, ai) {
      var a = ACTOS[ai], e = st.est[ai], items = itemsDe(t, ai);
      if (a.forma === 'cazar') {
        var u = utiles(t, a.id);
        var total = (a.objetivos(t, u) || []).length;
        var meta = Math.min(a.meta || 10, total);
        return { puntos: Math.min(e.hallados.length, meta), de: meta, extra: e.hallados.length + ' de ' + total };
      }
      if (a.forma === 'ordenar') {
        /* Ronda ganada = ordenada entera y sin un solo fallo. Se cuenta de
           las rondas guardadas y no de un contador que se va sumando: así
           volver atrás y mirar una ronda no puede inflar el puntaje. */
        return { puntos: (e.rondas || []).reduce(function (s, r, k) {
          return s + (r && items[k] && r.puestos.length === items[k].fichas.length && !r.fallo ? 1 : 0);
        }, 0), de: items.length };
      }
      if (a.forma === 'dosGrupos') {
        return { puntos: items.reduce(function (s, it, i) { return s + (e.resp[i] === it.grupo ? 1 : 0); }, 0), de: items.length };
      }
      return { puntos: items.reduce(function (s, it, i) { return s + (e.resp[i] === it.c ? 1 : 0); }, 0), de: items.length };
    }
    function indiceComprension() {
      for (var i = 0; i < ACTOS.length; i++) if (ACTOS[i].forma === 'comprension') return i;
      return -1;
    }

    /* ══════════════ FASE 4 · resultado ══════════════ */
    function pintaResultado() {
      var t = actual();
      if (!t) { reiniciar(); pinta(); return; }
      var ps = palabras(t.texto);
      var leidas = st.idx + 1;
      var ppm = st.seg > 0 ? Math.round((leidas / st.seg) * 60) : 0;
      var ic = indiceComprension();
      var pc = ic >= 0 ? puntosDe(t, ic) : { puntos: 0, de: 0 };
      var comp = pc.puntos, compDe = pc.de;
      var vel = lecNivelVelocidad(st.grado, ppm);
      var nc = compDe ? lecNivelComprension(comp, compDe) : null;
      var marcas = ACTOS.map(function (a, i) {
        var p = puntosDe(t, i);
        return { id: a.id, icono: a.icono, titulo: a.titulo, puntos: p.puntos, de: p.de, extra: p.extra };
      });
      var puntos = marcas.reduce(function (s, m) { return s + m.puntos; }, 0);
      var deTotal = marcas.reduce(function (s, m) { return s + m.de; }, 0);

      /* Se guarda UNA sola vez por toma: si algo repintara esta fase, la
         toma se contaría dos veces en el expediente del alumno. */
      if (!st.guardado) {
        st.guardado = guardarResultado(t.id, { ppm: ppm, comp: comp, compDe: compDe, puntos: puntos });
        registra(t, ppm, leidas, ps.length, comp, compDe, puntos, deTotal);
        if (typeof op.alTerminar === 'function') {
          try {
            var porActividad = {};
            marcas.forEach(function (m) { porActividad[m.id] = { puntos: m.puntos, de: m.de }; });
            op.alTerminar({
              textoId: t.id, titulo: t.titulo, grado: st.grado, ppm: ppm, seg: st.seg,
              palabras: leidas, total: ps.length, comp: comp, compDe: compDe,
              puntos: puntos, puntosDe: deTotal, porActividad: porActividad,
              nivelVelocidad: vel.clave, intentos: st.guardado.intentos
            });
          } catch (e) {}
        }
      }

      raiz.innerHTML =
        '<div class="card ac-jade">' +
          '<h2>📊 Tu minuto de lectura</h2>' +
          '<div class="lm-hero"><b>' + ppm + '</b><span>palabras por minuto</span></div>' +
          '<div class="lm-chips">' +
            chip('Velocidad · ' + st.grado + 'º: ' + vel.banda[0] + '–' + vel.banda[1], vel.etiqueta, vel.color) +
            (nc ? chip('Comprensión · ' + comp + ' de ' + compDe, nc.etiqueta, nc.color) : '') +
            chip('Lo que leíste', leidas + ' de ' + ps.length + ' palabras en ' + st.seg + ' s', '') +
          '</div>' +
          '<div class="lm-veredicto">🩺 ' + veredicto(vel, nc) + '</div>' +
          '<p class="lm-pista">La banda de ' + st.grado + 'º es de <strong>fin de grado</strong> (' + esc(LECTURA_NORMAS.fuenteCorta) + '): ' +
            'si estamos a mitad del año, es normal ir por debajo. Aquí no se mide la <em>precisión</em> —cuántas palabras se ' +
            'cambian o se saltan—, porque para eso alguien tiene que escucharte: esa parte la toma tu maestro en Mi aula.</p>' +
        '</div>' +

        '<div class="card ac-purple">' +
          '<h2>🏅 Tu trabajo con el texto</h2>' +
          '<div class="lm-hero"><b>' + puntos + '</b><span>de ' + deTotal + ' puntos en las ' + ACTOS.length + ' actividades</span></div>' +
          '<div class="lm-chips">' +
            marcas.map(function (m) {
              return chip(m.icono + ' ' + m.titulo, m.puntos + ' de ' + m.de, '');
            }).join('') +
          '</div>' +
        '</div>' +

        (op.resumen ? tarjetaResumen(t) : '') +

        '<div class="card">' +
          '<div class="lm-btns">' +
            '<button class="btn btn-pri" id="lm-otra">📚 Otra lectura</button>' +
            '<button class="btn btn-g" id="lm-repetir">🔁 Repetir esta</button>' +
            '<button class="btn btn-g" id="lm-papel">🖨️ Imprimir en papel</button>' +
          '</div>' +
          '<p class="lm-pista">Repetir <strong>el mismo texto</strong> dos o tres días seguidos es el ejercicio que más sube la ' +
            'fluidez, y las actividades son las mismas para que notes cuánto mejoraste. No es trampa: es entrenamiento.</p>' +
        '</div>';

      document.getElementById('lm-papel').onclick = function () { suena('click'); imprimir(t); };
      document.getElementById('lm-otra').onclick = function () { suena('click'); reiniciar(); pinta(); };
      document.getElementById('lm-repetir').onclick = function () {
        suena('click');
        var g = st.grado, id = st.textoId;
        pararTimer();
        st = limpio('leer'); st.grado = g; st.textoId = id;
        pinta();
      };
    }

    /* La hoja de respuestas del final: el texto entero con lo que la
       misión enseña, pintado encima de lo que el alumno acaba de leer.
       Es el remate de la sección, y por eso lo pone cada misión. */
    function tarjetaResumen(t) {
      var r = op.resumen, u = utiles(t, 'resumen'), ps = u.ps;
      var marcar = r.marcar(t, u) || [];
      var clases = {}, cuenta = { a: 0, b: 0 };
      marcar.forEach(function (m) {
        cuenta[m.clase === 'b' ? 'b' : 'a']++;
        for (var i = m.ini; i <= m.fin; i++) clases[i] = m.clase === 'b' ? 'lm-b' : 'lm-a';
      });
      return '<div class="card ac-amber">' +
        '<h2>' + r.titulo + '</h2>' +
        '<p class="lm-pista">' + r.intro(t, u, cuenta, marcar) + '</p>' +
        '<div class="lm-leyenda">' + r.leyenda.map(function (l) {
          return '<span><i class="lm-p lm-' + l.clase + '">' + esc(l.txt) + '</i> ' + esc(l.dice) + '</span>';
        }).join('') + '</div>' +
        '<div class="lm-texto">' + ps.map(function (p, i) {
          return '<span class="lm-p ' + (clases[i] || '') + '">' + esc(p) + '</span>';
        }).join(' ') + '</div>' +
      '</div>';
    }

    function chip(etq, valor, color) {
      return '<div class="lm-chip"><span>' + esc(etq) + '</span><b' + (color ? ' style="color:' + color + '"' : '') + '>' +
        esc(valor) + '</b></div>';
    }

    /* El veredicto le habla al ALUMNO, y nunca lo etiqueta: dice qué
       hacer esta semana. Mismo criterio que el de Mi aula (la velocidad
       sin comprensión no es fluidez), pero sin el dato de precisión,
       que aquí no se toma. */
    function veredicto(vel, nc) {
      var lento = vel.clave === 'apoyo' || vel.clave === 'acerca';
      var pctC = nc ? nc.pct : 100;
      if (pctC < 60 && !lento) {
        return 'Vas rápido, pero se te está escapando lo que dice el texto. Eso todavía no es leer: es descifrar de prisa. ' +
          'Prueba a bajar la marcha y leer «para contárselo a alguien» — la velocidad ya la tienes.';
      }
      if (pctC >= 80 && lento) {
        return 'Entendiste muy bien aunque todavía leas despacio, y ese es el camino difícil, que es el bueno. ' +
          'La velocidad sube sola con diez minutos diarios en voz alta; no la apures.';
      }
      if (vel.clave === 'avanzado' && pctC >= 80) {
        return '¡Vas por encima de lo que se espera en ' + st.grado + 'º y además entendiste! Estás listo para textos de un grado ' +
          'mayor, y para leerle en voz alta a alguien más pequeño: es el mejor ejercicio que existe.';
      }
      if (vel.clave === 'estandar' && pctC >= 80) {
        return 'Vas dentro de lo que se espera en ' + st.grado + 'º y entendiste el texto. Sostén diez minutos diarios de lectura ' +
          'en voz alta y cierras el año por arriba de la banda.';
      }
      if (!lento) {
        return 'La velocidad ya la tienes para ' + st.grado + 'º; lo que falta afinar es la comprensión. Relee este mismo texto ' +
          'y cuéntalo con tus palabras antes de contestar: verás cuánto cambia.';
      }
      return 'Todavía vas por debajo de la banda de ' + st.grado + 'º, y eso tiene remedio conocido: diez minutos diarios en voz ' +
        'alta, releyendo el mismo texto dos o tres días. La relectura es lo que más sube la fluidez.';
    }

    /* ══════════════ LA LECTURA EN PAPEL ══════════════
       En un aula de 43 alumnos hay tres o cuatro teléfonos. La sección
       entera —el minuto y sus actividades— tenía que poder salir en
       papel o se quedaba fuera la mayoría de la clase, que es justo la
       que más lo necesita.

       ── TRES HOJAS, y ni una más ──
       El maestro fotocopia por grupo: cada hoja de más son 43 hojas de
       más y una fotocopiadora de escuela pública. El reparto es fijo:

         1ª · la lectura, con el conteo acumulado por renglón, y la
              actividad que se hace SOBRE ese mismo texto (subrayar);
         2ª · las demás actividades de la misión;
         3ª · la clave del maestro — esta NO se fotocopia.

       Así el alumno se lleva dos hojas y el maestro guarda la tercera.
       Que de verdad quepan en tres se comprueba midiendo, no a ojo:
       node _dev/verifica-impresion-lectura.js.

       ── Lo que la máquina no sabe ──
       El motor no conoce el tema de la misión, así que tampoco sabe
       decir en papel «subraya los adjetivos». Cada actividad de cazar
       puede traer su `enPapel`; si no la trae, se usa su instrucción de
       pantalla, que dirá «tócalos» — se entiende, pero está peor. */
    var LETRA = ['a', 'b', 'c', 'd'];
    /* ── NUNCA «marca con una ✗» ──
       En el aula la ✗ significa MALO: es lo que el maestro pone sobre lo
       que está mal. Pedirla para señalar la respuesta CORRECTA enseña dos
       cosas contrarias con el mismo signo, y el niño que ya sabe leer una
       hoja corregida duda. Las opciones se imprimen con su círculo: se
       rellena, como en cualquier hoja de respuestas. */
    var RELLENA = 'Rellena el círculo de la letra de la respuesta correcta.';

    function papelOpciones(ops) {
      return '<div class="lp-ops">' + ops.map(function (o, j) {
        return '<span class="lp-op"><i></i><b>' + LETRA[j] + ')</b> ' + esc(o) + '</span>';
      }).join('') + '</div>';
    }
    function papelItem(n, cuerpo, extra) {
      return '<div class="lp-item"><div class="lp-q"><b>' + n + '.</b> ' + cuerpo + '</div>' + (extra || '') + '</div>';
    }

    /* Una actividad de la misión, pasada a papel. Devuelve el bloque y
       la línea de la clave del maestro, que se arman de lo mismo para
       que no se puedan desfasar. */
    function papelActo(t, ai) {
      var a = ACTOS[ai], u = utiles(t, a.id), items = itemsDe(t, ai);
      var cab = '<div class="lp-act">' + a.icono + ' ' + esc(a.titulo) + '</div>';
      var clave = '';

      if (a.forma === 'cazar') {
        var objetivos = a.objetivos(t, u) || [];
        var meta = Math.min(a.meta || 10, objetivos.length);
        var info = { total: objetivos.length, meta: meta };
        var ins = a.enPapel ? a.enPapel(t, u, info) : a.instruccion(t, u, info);
        clave = objetivos.map(function (o) {
          return esc(u.ps.slice(o.ini, o.fin + 1).join(' ').replace(LIMPIA, ''));
        }).join(' · ');
        return { html: cab + '<p class="lp-ins">' + ins + '</p>', clave: clave, corta: true };
      }

      if (a.forma === 'comprension') {
        return {
          html: cab + '<p class="lp-ins">' + RELLENA + ' Contesta <strong>sin volver a mirar el texto</strong>.</p>' +
            items.map(function (p, i) { return papelItem(i + 1, esc(p.q), papelOpciones(p.o)); }).join(''),
          clave: items.map(function (p, i) { return (i + 1) + ') ' + LETRA[p.c]; }).join(' · ')
        };
      }

      if (a.forma === 'dosGrupos') {
        return {
          html: cab + '<p class="lp-ins">' + (a.pista ? esc(a.pista) + '. ' : '') + 'Rellena el círculo del grupo al que pertenece la palabra subrayada.</p>' +
            '<div class="lp-dos">' + items.map(function (it, i) {
              return papelItem(i + 1, it.contexto, '<div class="lp-ops">' + a.grupos.map(function (g) {
                return '<span class="lp-op"><i></i>' + g.titulo + '</span>';
              }).join('') + '</div>');
            }).join('') + '</div>',
          clave: items.map(function (it, i) { return (i + 1) + ') ' + nombreGrupo(a, it.grupo); }).join(' · ')
        };
      }

      if (a.forma === 'ordenar') {
        return {
          html: cab + '<p class="lp-ins">' + (a.pista ? esc(a.pista) + '. ' : '') +
            'Escribe <strong>1, 2, 3…</strong> en el cuadro de cada ficha, del más pequeño al más grande.</p>' +
            items.map(function (it, i) {
              return papelItem(i + 1, it.enunciado || '', '<div class="lp-fichas">' + it.fichas.map(function (f) {
                return '<span class="lp-ficha"><i></i>' + esc(f.txt) + '</span>';
              }).join('') + '</div>');
            }).join(''),
          clave: items.map(function (it, i) {
            return (i + 1) + ') ' + it.fichas.slice().sort(function (x, y) { return x.v - y.v; })
              .map(function (f) { return esc(f.txt); }).join(' < ');
          }).join(' · ')
        };
      }

      /* tresOpciones */
      return {
        html: cab + '<p class="lp-ins">' + (a.pista ? esc(a.pista) + '. ' : '') + RELLENA + '</p>' +
          items.map(function (it, i) {
            var cuerpo = it.frase ? it.frase.replace(HUECO, '<span class="lp-hueco"></span>') : (it.enunciado || '');
            return papelItem(i + 1, cuerpo, papelOpciones(it.ops));
          }).join(''),
        clave: items.map(function (it, i) { return (i + 1) + ') ' + LETRA[it.c]; }).join(' · ')
      };
    }

    function papelHTML(t) {
      var grado = st.grado;
      var banda = LECTURA_NORMAS.bandas[grado];
      var porLinea = LM_PORLINEA[grado] || 12;
      var fz = LM_FZ[grado] || 15;
      var ps = palabras(t.texto);
      var actos = ACTOS.map(function (a, i) { return papelActo(t, i); });
      /* La que se hace SOBRE el texto va con el texto, en la primera
         hoja; las demás, en la segunda. Si no hubiera ninguna de esas,
         la primera actividad sube a acompañar al texto para que la hoja
         no salga medio vacía. */
      var enHoja1 = [], enHoja2 = [];
      actos.forEach(function (b) { (b.corta ? enHoja1 : enHoja2).push(b); });
      if (!enHoja1.length && enHoja2.length > 1) enHoja1.push(enHoja2.shift());

      var cabecera =
        '<header class="lp-head">' +
          '<div><div class="lp-tit">📖 Control de lectura · ' + grado + 'º grado</div>' +
          '<div class="lp-sub">Misión de ' + esc(tema) + ' · M.E.T.A.S</div></div>' +
          (banda ? '<div class="lp-banda">Banda de ' + grado + 'º: <b>' + banda[0] + '–' + banda[1] + ' ppm</b></div>' : '') +
        '</header>';
      var registro =
        '<div class="lp-reg">' +
          ['Alumno/a', 'Fecha', 'Tiempo', 'Palabras leídas', 'PPM'].map(function (x, i) {
            return '<div' + (i ? '' : ' class="lp-reg-ancho"') + '><span>' + x + '</span><i></i></div>';
          }).join('') +
        '</div>';

      var hoja1 =
        '<section class="hoja">' + cabecera + registro +
          '<h2 class="lp-titulo">' + esc(t.titulo) + '</h2>' +
          '<div class="lp-texto" style="font-size:' + fz + 'px">' +
            lineasDe(t.texto, porLinea).map(function (l) {
              return '<div class="lp-linea"><span>' + l.ps.map(esc).join(' ') + '</span><em>' + l.acumulado + '</em></div>';
            }).join('') +
          '</div>' +
          '<p class="lp-nota"><strong>' + ps.length + ' palabras en total.</strong> El número del final de cada renglón es el ' +
            'conteo acumulado: al cumplirse el minuto se marca la última palabra leída y se toma el número de su renglón. ' +
            'Palabras leídas ÷ segundos × 60 = <strong>palabras por minuto</strong>.</p>' +
          enHoja1.map(function (b) { return b.html; }).join('') +
          '<footer class="lp-foot">M.E.T.A.S · ' + esc(t.titulo) + ' · hoja 1 de 2</footer>' +
        '</section>';

      var hoja2 =
        '<section class="hoja">' +
          '<header class="lp-head"><div><div class="lp-tit">✍️ Trabaja el texto que leíste</div>' +
          '<div class="lp-sub">' + esc(t.titulo) + ' · ' + grado + 'º grado</div></div>' +
          '<div class="lp-banda">Alumno/a: <b>&nbsp;</b></div></header>' +
          enHoja2.map(function (b) { return b.html; }).join('') +
          '<footer class="lp-foot">M.E.T.A.S · ' + esc(t.titulo) + ' · hoja 2 de 2</footer>' +
        '</section>';

      /* La clave se queda con el maestro: por eso va en su propia hoja y
         lo dice en grande. Fotocopiada por error, se acabó el ejercicio. */
      var clave =
        '<section class="hoja lp-clave">' +
          '<header class="lp-head"><div><div class="lp-tit">🔑 Clave · para el maestro</div>' +
          '<div class="lp-sub">' + esc(t.titulo) + ' · ' + grado + 'º grado</div></div></header>' +
          '<p class="lp-aviso">Esta hoja <strong>no se fotocopia</strong>: es la del maestro.</p>' +
          ACTOS.map(function (a, i) {
            return '<div class="lp-cl"><div class="lp-cl-t">' + a.icono + ' ' + esc(a.titulo) + '</div>' +
              '<div class="lp-cl-r">' + (actos[i].clave || '—') + '</div></div>';
          }).join('') +
          '<div class="lp-cl"><div class="lp-cl-t">🩺 Cómo se lee el resultado</div><div class="lp-cl-r">' +
            (banda ? 'En ' + grado + 'º se espera de <b>' + banda[0] + ' a ' + banda[1] + ' palabras por minuto</b> ' +
              '(' + esc(LECTURA_NORMAS.fuenteCorta) + '), y es meta de <b>fin de grado</b>: a mitad de año es normal ir por debajo. ' : '') +
            'En las preguntas <b>críticas</b> la letra marca la opinión mejor razonada; si el alumno defiende otra con un buen ' +
            'porqué, <b>también vale</b>. Aquí no se mide la precisión —cuántas palabras cambia o se salta—: para eso hay que ' +
            'escucharlo, y esa toma se hace en 📖 Lectura de Mi aula.</div></div>' +
          '<footer class="lp-foot">M.E.T.A.S · clave de ' + esc(t.titulo) + '</footer>' +
        '</section>';

      return '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">' +
        '<title>' + esc(t.titulo) + ' (' + grado + 'º)</title><style>' + PAPEL_CSS + '</style></head><body>' +
        hoja1 + hoja2 + clave +
        '<script>window.onload=function(){setTimeout(function(){window.print();},300);}<\/script>' +
        '</body></html>';
    }

    function imprimir(t) {
      t = t || actual();
      if (!t) return null;
      var html = papelHTML(t);
      window.LecturaMision.abrirImpresion(html);
      return html;
    }

    /* Evidencia para el maestro (registro.html y la nube). Si la misión
       no cargó la capa de registro, esto simplemente no ocurre. */
    function registra(t, ppm, leidas, total, comp, compDe, puntos, puntosDe) {
      if (!window.METAS || typeof window.METAS.registrar !== 'function') return;
      try {
        window.METAS.registrar('lectura', {
          textoId: t.id, titulo: t.titulo, gradoTexto: st.grado,
          ppm: ppm, seg: st.seg, palabras: leidas, total: total,
          comp: comp, compDe: compDe, puntos: puntos, puntosDe: puntosDe
        });
      } catch (e) {}
    }

    function cada(sel, fn) { Array.prototype.forEach.call(raiz.querySelectorAll(sel), fn); }

    function pinta() {
      pararTimer();
      /* La capa del proyector va puesta ANTES de pintar: el sitio libre
         que mide el ajuste de la letra depende de ella. Y el botón de
         salir, DESPUÉS, porque el repintado se lo lleva por delante. */
      refrescoVista = null;
      raiz.classList.toggle('lm-proy', !!vista.proy);
      if (st.fase === 'leer') pintaLeer();
      else if (st.fase === 'taller') pintaTaller();
      else if (st.fase === 'resultado') pintaResultado();
      else pintaElegir();
      aplicaVista();
    }

    pinta();
    /* La última montada queda a mano en LecturaMision.ultima: las
       herramientas de _dev la necesitan para pedirle la hoja impresa y
       medirla, y la misión guarda su propia referencia en su variable. */
    var api = {
      repintar: pinta,
      /* La hoja impresa, para la misión y para _dev/verifica-impresion-lectura.js */
      imprimir: function (textoId) { return imprimir(porId(textoId)); },
      lecturas: function (grado) {
        return ((grado && corpus[grado]) || []).map(function (t) { return t.id; });
      },
      papel: function (textoId, grado) {
        if (grado) st.grado = grado;
        var t = porId(textoId);
        return t ? papelHTML(t) : null;
      },
      /* Si el alumno se cambia de pestaña a media toma, el cronómetro no
         puede seguir corriendo a sus espaldas: se cancela y vuelve a la
         lista. Un minuto medido a medias no es un minuto. El taller, en
         cambio, no tiene reloj: ahí se puede ir y volver sin perder nada. */
      soltar: function () { if (st.fase === 'leer' && st.ini) { reiniciar(); pinta(); } else pararTimer(); },
      estado: function () { return st.fase; }
    };
    window.LecturaMision.ultima = api;
    return api;
  }

  /* La hoja se abre en otra ventana para no perder la misión de vista.
     Es un punto de entrada CON NOMBRE a propósito: las herramientas de
     _dev lo sustituyen para quedarse con el HTML y medir las hojas sin
     abrir nada ni gastar papel. */
  function abrirImpresion(html) {
    var w = window.open('', '_blank', '');
    if (!w) {
      var avisa = window.showToast || window.toast;
      if (typeof avisa === 'function') avisa('⚠️ Activa las ventanas emergentes para imprimir');
      return null;
    }
    w.document.write(html);
    w.document.close();
    return w;
  }

  window.LecturaMision = { montar: montar, abrirImpresion: abrirImpresion, version: 4 };
})();
