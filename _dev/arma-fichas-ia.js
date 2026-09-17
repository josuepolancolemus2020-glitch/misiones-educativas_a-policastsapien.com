/* ══════════════════════════════════════════════════════════════════════════
   M.E.T.A.S · Arma las cuatro fichas de la Ruta de la Máquina que Aprende
   ──────────────────────────────────────────────────────────────────────────
   POR QUÉ HAY UN ARMADOR Y NO CUATRO ARCHIVOS ESCRITOS A MANO, y son dos
   razones distintas:

   1. **El CSS.** Son 170 líneas idénticas en las cuatro fichas. Copiadas a
      mano es como la ficha de la Constitución acabó heredando de la de
      próceres el `.pf-p` naranja —el cuerpo del texto pintado sobre naranja—
      con su comentario explicando algo que ahí no pasaba. Aquí se escribe una
      vez.

   2. ⚠️ **Los datos.** El vocabulario, los mitos, las reglas de oro, los pasos
      de verificar y los quince hitos con sus fechas viven en
      `js/data/ia-conceptos.js` y `js/data/ia-historia.js`, y la PANTALLA los
      pinta de ahí. Si la ficha los llevara escritos a mano, un día dirían
      cosas distintas: el alumno estudiaría una y el maestro corregiría por la
      otra. Este armador los lee del mismo archivo, así que nacen iguales, y
      `node _dev/verifica-ia.js` comprueba después que sigan iguales.

   Lo que se publica es el HTML resultante: plano, editable a mano y sin una
   sola línea de JavaScript, como las otras 75 fichas del proyecto.

   ⚠️ Y CORRERLO DEVUELVE LAS SIETE FICHAS A SU REPARTO DE PARTIDA, no solo la
   que se estaba tocando. Después de correrlo hay que repartir otra vez TODA
   ficha que salga modificada en `git status fichas/`, o se publica una con las
   hojas partidas — y eso son 43 fotocopias torcidas por grado.

   ⚠️ EL CORTE DE LAS HOJAS NO LO DECIDE ESTE GUION. Aquí las páginas salen con
   un reparto de partida cualquiera; quien las reparte de verdad es
   `node _dev/reparte-hojas-ficha.js`, que mide en el navegador con el ancho
   del papel. Después, SIEMPRE: `node _dev/verifica-ficha-paginas.js`.

   Uso:  node _dev/arma-fichas-ia.js
   ══════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const RAIZ = path.resolve(__dirname, '..');

const { IA_CONCEPTOS, IA_MITOS, IA_REGLAS_ORO, IA_APLICACIONES, IA_VERIFICA, IA_PIEZAS_PETICION } =
  require(path.join(RAIZ, 'js/data/ia-conceptos.js'));
const { IA_EPOCAS, IA_HITOS, IA_TRES_PATAS, IA_LECCION_INVIERNOS } =
  require(path.join(RAIZ, 'js/data/ia-historia.js'));
const { IA_SENALES, IA_FAMILIAS, IA_PELIGROS, IA_DEFENSAS, IA_MENSAJES } =
  require(path.join(RAIZ, 'js/data/ia-peligros.js'));
const { IA_HOY_FECHA, IA_HOY_MES, IA_HOY, IA_SINGULARIDAD, IA_TERMOMETRO, IA_TERMOMETRO_TRAMOS,
        IA_FRASES, iaFraseCuenta, iaFraseTramo, IA_INFLEXION } =
  require(path.join(RAIZ, 'js/data/ia-actualidad.js'));
const { IA_FUT_FECHA, IA_CAPACIDADES, IA_CUENTA, IA_OFI_TIPOS, IA_OFICIOS,
        IA_ESCUDOS, IA_TAREAS_CLASE, IA_ESTUDIO, IA_FUT_PIEZAS, iaFutAl,
        iaOfiCuenta, iaOfiPorTipo, iaOfiTotalTareas, iaClaseCuenta,
        iaFutJuzga, iaFutCuenta, iaFutEsEscenario, iaFutLeFalta } =
  require(path.join(RAIZ, 'js/data/ia-futuros.js'));

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const con = c => IA_CONCEPTOS.find(x => x.clave === c);

// ───────────────────────────────────────────────────────────── el armazón ──
const CABEZA = titulo => `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Ficha Didáctica · Misión ${titulo}</title>
<meta name="robots" content="noindex">
<style>
  /* ═══ NORMATIVA DE FICHAS M.E.T.A.S ═══
     · Fuente comercial estándar de texto escolar: Arial 11pt
     · Código de color por materia: INTELIGENCIA ARTIFICIAL = MAGENTA (#86198f).
       No se eligió a ojo: se midió la distancia de color contra las nueve
       materias que ya existían y la familia magenta es el hueco más ancho que
       quedaba. El maestro tiene que saber de qué materia es la hoja SIN leerla.
     · Selección múltiple: círculo para RELLENAR, nunca la ✗ (en el aula la ✗
       significa MALO, y pedirla para señalar lo correcto enseña dos cosas
       contrarias con el mismo signo)
     · El corte de las hojas lo reparte \`node _dev/reparte-hojas-ficha.js\`, que
       mide en el navegador con el ancho del papel. A ojo se acierta hasta que
       se corrige una errata y el párrafo crece dos renglones.
     · La pauta + nota del docente SIEMPRE en hoja suelta (última página)
     · Esta ficha la ARMA \`node _dev/arma-fichas-ia.js\` desde los mismos
       archivos de datos que pinta la misión, para que las dos no se separen. */
  :root {
    --ia: #86198f; --ia-osc: #701a75; --ia-claro: #fdf4ff; --linea: #eccef2;
    --tinta: #1a2733; --gris: #5b6773;
    --may: #4338ca; --oro: #b45309; --verde: #15803d;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 11pt; color: var(--tinta); background: #f7eefa; line-height: 1.42; }
  .doc { max-width: 8.5in; margin: 0 auto; }

  .pagina { background: #fff; padding: 0 0 34px; margin: 0 auto 14px; position: relative; min-height: 253mm; }
  .pagina .contenido { padding: 26px 40px 0; }
  .pag-pie {
    position: absolute; bottom: 10px; left: 40px; right: 40px;
    display: flex; justify-content: space-between; align-items: center;
    font-size: 8.5pt; color: var(--gris); border-top: 1px solid var(--linea); padding-top: 5px;
  }
  .pag-pie b { color: var(--ia-osc); }

  .idline { display: flex; align-items: flex-end; gap: 8px; font-size: 11pt; font-weight: 700; margin-bottom: 9px; }
  .idline .raya { flex: 1; border-bottom: 1.3px solid var(--tinta); min-height: 1.15em; }
  .idline .raya.corta { flex: 0 0 70px; }

  .fh { display: flex; gap: 14px; border-left: 6px solid var(--ia); background: var(--ia-claro); border-radius: 8px; padding: 9px 14px; margin-bottom: 9px; align-items: center; }
  .fh-txt { flex: 1; }
  .fh .f-badge { font-size: 14pt; font-weight: 900; color: var(--ia-osc); }
  .fh .f-meta { font-size: 9.5pt; margin-top: 3px; }
  .fh .f-meta b { color: var(--ia-osc); }
  .fh-qr { flex: 0 0 86px; text-align: center; }
  .fh-qr img { width: 82px; height: 82px; background: #fff; border-radius: 8px; padding: 3px; border: 1px solid var(--linea); }
  .fh-qr span { display: block; font-size: 6.8pt; color: var(--gris); line-height: 1.25; margin-top: 2px; }

  h2 { font-size: 12pt; color: #fff; background: var(--ia); padding: 6px 12px; border-radius: 7px; margin: 8px 0 6px; }
  h3 { font-size: 11pt; color: var(--ia-osc); margin: 9px 0 5px; }
  p { font-size: 11pt; margin-bottom: 5px; text-align: justify; }
  ul, ol { margin: 4px 0 6px 26px; font-size: 11pt; }
  li { margin-bottom: 2px; }

  ol.objetivos { list-style: decimal outside; margin-left: 26px; }
  ol.objetivos li { margin-bottom: 3px; padding-left: 2px; }

  .caja { border-radius: 8px; padding: 7px 12px; margin: 6px 0; font-size: 10.5pt; break-inside: avoid; }
  .idea { background: #fff8e6; border: 1px solid #f0dca6; }
  .idea b { color: #b07d00; }
  .regla { background: var(--ia-claro); border: 1px solid var(--linea); }
  .regla b { color: var(--ia-osc); }
  .aviso { background: #fdeaea; border: 1px solid #f3bcbc; }
  .aviso b { color: #b91c1c; }
  .truco { background: #e8f0fe; border: 1px solid #c6d8f5; }
  .truco b { color: var(--may); }

  table { width: 100%; border-collapse: collapse; margin: 5px 0; font-size: 10pt; break-inside: avoid; }
  th { background: var(--ia); color: #fff; text-align: left; padding: 3px 8px; font-size: 9.5pt; }
  td { border: 1px solid var(--linea); padding: 2px 8px; vertical-align: top; }
  tr:nth-child(even) td { background: #fdf7fe; }
  td.k { font-weight: 700; color: var(--ia-osc); white-space: nowrap; }

  .ilus { border: 1.5px dashed var(--linea); border-radius: 9px; padding: 8px; margin: 7px 0; background: #fefcff; break-inside: avoid; }
  .ilus-t { font-size: 9.5pt; font-weight: 700; color: var(--ia-osc); margin-bottom: 6px; }

  /* Dos columnas enfrentadas. Se usa donde la ficha compara DOS cosas que el
     alumno confunde (ser vivo y máquina, instrucción y ejemplo, predecir y
     saber). Puestas una al lado de la otra, la diferencia se ve sin párrafo. */
  .dos { display: flex; gap: 8px; margin: 7px 0; break-inside: avoid; }
  .dos > div { flex: 1; border-radius: 8px; padding: 7px 10px; font-size: 9.5pt; }
  .dos .dA { background: #eafaf1; border: 1px solid #b7e4cb; }
  .dos .dB { background: #fdf4ff; border: 1px solid var(--linea); }
  .dos b { display: block; font-size: 10pt; margin-bottom: 2px; }
  .dos .dA b { color: var(--verde); }
  .dos .dB b { color: var(--ia-osc); }
  .dos ul { margin: 2px 0 0 18px; font-size: 9.5pt; }

  /* La ficha de un concepto: el término, su definición y su ejemplo. Es el
     recuadro que más se repite en estas cuatro, porque aquí el vocabulario ES
     la materia: el alumno lo copia al cuaderno tal cual. */
  .cficha { border: 1.5px solid var(--linea); border-left: 5px solid var(--ia); border-radius: 8px;
            padding: 6px 12px; margin: 6px 0; break-inside: avoid; }
  .cf-tit { font-size: 11.5pt; font-weight: 800; color: var(--ia-osc); }
  .cf-def { font-size: 10.5pt; margin: 2px 0; text-align: justify; }
  .cf-ej { font-size: 9.5pt; color: var(--gris); font-style: italic; }

  /* La línea del tiempo de la etapa 3, en tarjetas. Cada una con su año en
     grande: es el dato que el alumno busca al recorrer la hoja, y si baila de
     sitio hay que leer el renglón entero para encontrarlo. */
  .linea-t { display: flex; gap: 5px; margin: 7px 0; break-inside: avoid; flex-wrap: wrap; }
  .linea-t > div { flex: 1 1 30%; border: 1px solid var(--linea); border-radius: 7px; padding: 5px 8px;
                   font-size: 9pt; background: #fefcff; }
  .linea-t b { display: block; font-size: 9.5pt; color: var(--ia-osc); }

  .acts h3 { border-bottom: 2px solid var(--ia-claro); padding-bottom: 3px; }
  /* Las cuadrículas de «La máquina ve puntitos» (etapa 1): casillas cuadradas
     y el relleno con ■, que se imprime aunque el navegador quite los fondos. */
  .rejs { display: flex; gap: 12px; align-items: flex-start; flex-wrap: wrap; margin: 4px 0; }
  .rejs > div { flex: 1 1 120px; font-size: 9.5pt; }
  .rejs b { display: block; margin-bottom: 3px; color: var(--ia-osc); }
  table.rej { border-collapse: collapse; width: auto; margin: 0; }
  table.rej td { width: 14px; height: 14px; padding: 0; border: 1px solid #9aa7b5; text-align: center; font-size: 10pt; line-height: 14px; background: #fff; }
  .acts .val { font-size: 8.5pt; font-weight: 400; color: var(--gris); }
  .acts ol { margin-left: 24px; }
  .acts ol li { margin-bottom: 5px; padding-left: 3px; }
  .acts ol li::marker { font-weight: 800; color: var(--ia); }
  .linea-resp { display: inline-block; min-width: 95px; border-bottom: 1px solid #9aa7b5; }

  .preg { padding: 4px 0; border-bottom: 1px dashed var(--linea); break-inside: avoid; }
  .preg:last-child { border-bottom: none; }
  .preg-q { font-weight: 700; color: var(--tinta); margin-bottom: 3px; display: flex; gap: 8px; align-items: baseline; }
  .preg-n {
    display: inline-block; flex: 0 0 22px; width: 22px; height: 22px;
    background: var(--ia); color: #fff; border-radius: 6px;
    text-align: center; line-height: 22px; font-size: 10.5pt; font-weight: 900;
  }
  .preg-ops { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 16px; padding-left: 30px; }
  .preg-ops .op { font-size: 10pt; font-weight: 400; color: var(--tinta); display: flex; align-items: baseline; gap: 7px; }
  /* El círculo que el alumno RELLENA. Nunca una ✗: en el aula la ✗ es la marca
     de lo que está mal, y pedirla para señalar lo correcto confunde a quien ya
     sabe leer una hoja corregida. */
  .preg-ops .op i {
    font-style: normal; flex: 0 0 auto; display: inline-block;
    width: 11px; height: 11px; border: 1.3px solid #333; border-radius: 50%;
    position: relative; top: 1px;
  }
  .preg-ops .op b { font-weight: 800; color: var(--ia-osc); font-size: 10.5pt; }
  .preg-ops .op.full { grid-column: 1 / -1; }

  .felic { background: linear-gradient(180deg, var(--ia-claro), #fff); border: 1px solid var(--linea); border-radius: 9px; padding: 9px 14px; margin: 8px 0; break-inside: avoid; font-size: 10.5pt; }
  .felic b { color: var(--ia-osc); }

  .pauta { background: #fdf7fe; border: 1px solid var(--linea); border-radius: 9px; padding: 10px 15px; margin-top: 8px; font-size: 10.5pt; break-inside: avoid; }
  .pauta .pt { font-weight: 800; color: var(--ia-osc); }
  .pauta > div { margin-bottom: 4px; }
  .nota-doc { font-size: 10pt; color: var(--gris); border-top: 1.5px solid var(--linea); margin-top: 11px; padding-top: 7px; text-align: justify; }

  .imprimir-btn { position: fixed; right: 18px; bottom: 18px; z-index: 5; border: none; cursor: pointer; padding: 13px 20px; border-radius: 999px; font-size: 0.95rem; font-weight: 800; color: #fff; background: var(--ia); box-shadow: 0 6px 18px rgba(134,25,143,.35); }
  .imprimir-btn:active { transform: scale(.97); }

  @page { size: letter; margin: 11mm 11mm; }
  @media print {
    body { background: #fff; }
    .doc { max-width: none; }
    .pagina { margin: 0; page-break-after: always; min-height: 253mm; padding-bottom: 22px; }
    .pagina:last-child { page-break-after: auto; }
    .pagina .contenido { padding: 0 2px; }
    .pag-pie { left: 2px; right: 2px; bottom: 0; }
    .imprimir-btn { display: none; }
    h2, th, .fh, .caja, .dos > div, .ilus, .felic, .pauta, .cficha, .linea-t > div
      { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
</style>
</head>
<body>
<button class="imprimir-btn" onclick="window.print()">🖨️ Imprimir la ficha</button>

<div class="doc">
`;

function arma(destino, titulo, paginas) {
  const partes = [CABEZA(titulo)];
  paginas.forEach((cuerpo, i) => {
    const n = i + 1;
    const extra = n === paginas.length ? ' · Hoja del Docente' : '';
    partes.push(`
<!-- ═══════════ PÁGINA ${n} ═══════════ -->
<section class="pagina">
  <div class="contenido">
${cuerpo.replace(/\s+$/, '')}
  </div>
  <div class="pag-pie"><span><b>M.E.T.A.S</b> · Ficha Didáctica · ${titulo}${extra}</span><span>Página ${n}</span></div>
</section>
`);
  });
  partes.push('\n</div>\n\n</body>\n</html>\n');
  fs.writeFileSync(path.join(RAIZ, destino), partes.join(''));
  console.log('  ✓', destino, '·', paginas.length, 'páginas de partida');
}

const portada = (titulo, tema, qr, objetivos) => `
    <div class="idline"><span>Nombre:</span><span class="raya"></span><span>Nº-Lista:</span><span class="raya corta"></span></div>

    <div class="fh">
      <div class="fh-txt">
        <div class="f-badge">📄 Ficha Didáctica: Misión ${titulo}</div>
        <div class="f-meta"><b>Asignatura:</b> Inteligencia Artificial &nbsp;·&nbsp; <b>Ruta:</b> La Máquina que Aprende</div>
        <div class="f-meta"><b>Tema:</b> ${tema}</div>
      </div>
      <div class="fh-qr">
        <img src="../img/${qr}" alt="QR de la misión">
        <span>📷 Juega la misión en tu teléfono</span>
      </div>
    </div>

    <h2>🎯 Objetivos de Aprendizaje</h2>

    <ol class="objetivos">
${objetivos.map(o => '      <li>' + o + '</li>').join('\n')}
    </ol>
`;

/* Selección múltiple. El círculo se RELLENA; nunca la ✗. */
const preguntas = (items, desde = 1) => items.map((it, k) => {
  const ops = it.o.map((o, j) =>
    `        <div class="op${o.length > 34 ? ' full' : ''}"><i></i><b>${'abcd'[j]})</b> ${esc(o)}</div>`).join('\n');
  return `    <div class="preg">
      <div class="preg-q"><span class="preg-n">${desde + k}</span><span>${esc(it.q)}</span></div>
      <div class="preg-ops">
${ops}
      </div>
    </div>`;
}).join('\n');

const clave = (items, desde = 1) =>
  items.map((it, k) => `${desde + k}-${'abcd'[it.a]}`).join(' · ');

const fichaConcepto = c => `    <div class="cficha">
      <div class="cf-tit">${c.emoji} ${esc(c.palabra)}</div>
      <div class="cf-def">${esc(c.definicion)}</div>
      <div class="cf-ej">Ejemplo: ${esc(c.ejemplo)}</div>
    </div>`;

const tablaReglas = () => `    <table>
      <tr><th style="width:52%">La regla</th><th>Por qué</th></tr>
${IA_REGLAS_ORO.map(r => `      <tr><td class="k">${r.emoji} ${esc(r.regla)}</td><td>${esc(r.porque)}</td></tr>`).join('\n')}
    </table>`;

const tablaMitos = () => `    <table>
      <tr><th style="width:44%">Lo que mucha gente cree</th><th>Lo que de verdad pasa</th></tr>
${IA_MITOS.map(m => `      <tr><td>❌ «${esc(m.mito)}»</td><td>✅ ${esc(m.verdad)}</td></tr>`).join('\n')}
    </table>`;

module.exports = { RAIZ, esc, con, arma, portada, preguntas, clave, fichaConcepto, tablaReglas, tablaMitos,
                   IA_CONCEPTOS, IA_MITOS, IA_REGLAS_ORO, IA_APLICACIONES, IA_VERIFICA, IA_PIEZAS_PETICION,
                   IA_EPOCAS, IA_HITOS, IA_TRES_PATAS, IA_LECCION_INVIERNOS,
                   IA_SENALES, IA_FAMILIAS, IA_PELIGROS, IA_DEFENSAS, IA_MENSAJES,
                   IA_HOY_FECHA, IA_HOY_MES, IA_HOY, IA_SINGULARIDAD, IA_TERMOMETRO, IA_TERMOMETRO_TRAMOS,
                   IA_FRASES, iaFraseCuenta, iaFraseTramo, IA_INFLEXION,
                   IA_FUT_FECHA, IA_CAPACIDADES, IA_CUENTA, IA_OFI_TIPOS, IA_OFICIOS,
                   IA_ESCUDOS, IA_TAREAS_CLASE, IA_ESTUDIO, IA_FUT_PIEZAS, iaFutAl,
                   iaOfiCuenta, iaOfiPorTipo, iaOfiTotalTareas, iaClaseCuenta,
                   iaFutJuzga, iaFutCuenta, iaFutEsEscenario, iaFutLeFalta };

if (require.main === module) {
  console.log('\n📄 Armando las fichas de la Ruta de la Máquina que Aprende\n');
  require('./fichas-ia/ficha-72.js');
  require('./fichas-ia/ficha-73.js');
  require('./fichas-ia/ficha-74.js');
  require('./fichas-ia/ficha-75.js');
  require('./fichas-ia/ficha-76.js');
  require('./fichas-ia/ficha-77.js');
  require('./fichas-ia/ficha-78.js');
  console.log('\n⚠️  Ahora, SIEMPRE, en este orden:');
  console.log('    node _dev/reparte-hojas-ficha.js ficha-que-es-la-ia');
  console.log('    node _dev/reparte-hojas-ficha.js ficha-como-aprende-una-maquina');
  console.log('    node _dev/reparte-hojas-ficha.js ficha-historia-ia');
  console.log('    node _dev/reparte-hojas-ficha.js ficha-ia-generativa');
  console.log('    node _dev/reparte-hojas-ficha.js ficha-peligros-ia');
  console.log('    node _dev/reparte-hojas-ficha.js ficha-albores-singularidad');
  console.log('    node _dev/reparte-hojas-ficha.js ficha-escenarios-porvenir');
  console.log('    node _dev/verifica-ficha-paginas.js\n');
}
