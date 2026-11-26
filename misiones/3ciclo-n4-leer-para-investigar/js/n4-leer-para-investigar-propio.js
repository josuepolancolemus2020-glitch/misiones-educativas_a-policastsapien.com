/* ============================================================
   M.E.T.A.S · Misión Leer para investigar · lo que es solo suyo
   ------------------------------------------------------------
   Lo común a todas las misiones está en js/motor-mision.js y lo que
   esta misión dice y pregunta está en js/contenido.js. Aquí queda el
   código que es de esta misión y de ninguna otra:

   · su laboratorio, «el libro desarmado».

   Un libro inventado para la misión (los datos están en
   `libroDesarmado`, en contenido.js) se abre en seis partes: portada,
   índice, prólogo, un capítulo, glosario y bibliografía. Con él se
   hacen las tres cosas que pide el plan, una por paso:

   1. BUSCAR. Sale una pregunta («¿quién escribió este libro?») y el
      alumno abre la parte donde cree que está la respuesta. Puede
      abrirlas todas y leerlas: lo que cuenta es en cuál dice «aquí
      está».
   2. ARMAR LA FICHA. Los cinco datos de la ficha bibliográfica salen de
      la portada; en cada uno se elige entre tres.
   3. RESUMIR. El alumno escribe su resumen del capítulo y el
      laboratorio le señala si copió frases enteras, si le quedó tan
      largo como el texto y si dejó fuera lo fundamental.

   Por qué es así y no un juego de aciertos: investigar no es saberse
   una definición, es saber dónde se busca cada cosa y decirla después
   con palabras propias. Por eso una respuesta equivocada no cierra
   nada (dice para qué sirve la parte que se abrió y deja probar otra)
   y el laboratorio no da XP ni lo quita.

   Lo que el laboratorio NO sabe hacer, y lo dice en la pantalla: no
   entiende el resumen. Ve si hay frases copiadas y si faltan palabras
   clave, pero no si lo escrito dice la verdad. Eso lo revisa el alumno
   releyendo, y su docente.

   Todo se hace tocando o escribiendo: no hay nada que arrastrar. Y el
   resultado no se dice solo con color: cada renglón lleva su marca
   (✓, ◐ o ✗) y su palabra.
   ============================================================ */

// ===================== LABORATORIO: EL LIBRO DESARMADO =====================
let ldPaso='busca';
let ldCual=0,ldAbierta=null,ldResueltas={},ldAviso=null;
let ldFichaElegida={};
const LD_PASOS={busca:'1. Buscar en el libro',ficha:'2. Armar su ficha',resumen:'3. Resumir un capítulo'};

function ldLibro(){return typeof libroDesarmado!=='undefined'?libroDesarmado:null;}
function ldParte(id){const L=ldLibro();return L?L.partes.find(function(p){return p.id===id;})||null:null;}
function ldSuena(n){if(typeof sfx==='function')sfx(n);}

/* Un renglón de resultado: la marca y su palabra van escritas, y la clase
   solo añade el borde. */
const LD_MARCA={si:{signo:'✓',palabra:'Bien',clase:'ld-si'},medio:{signo:'◐',palabra:'A medias',clase:'ld-medio'},no:{signo:'✗',palabra:'Falta',clase:'ld-no'}};
function ldRenglon(v,txt,palabra){const m=LD_MARCA[v];return '<li class="'+m.clase+'"><span class="ld-marca">'+m.signo+' '+(palabra||m.palabra)+'.</span> '+txt+'</li>';}

function ldVe(paso){
  if(!LD_PASOS[paso])return;
  ldPaso=paso;ldAviso=null;
  ldSuena('click');
  ldPinta();
}

function ldReinicia(){
  ldPaso='busca';ldCual=0;ldAbierta=null;ldResueltas={};ldAviso=null;ldFichaElegida={};
  ldSuena('click');
  ldPinta();
}

function ldPinta(){
  const L=ldLibro(),zona=document.getElementById('ld-zona'),caja=document.getElementById('lab-display'),frase=document.getElementById('lab-sentence');
  if(!L||!zona||!caja)return;
  document.querySelectorAll('[data-ld-paso]').forEach(function(b){
    const suyo=b.dataset.ldPaso===ldPaso;
    b.classList.toggle('active-pri',suyo);
    b.setAttribute('aria-pressed',suyo?'true':'false');
  });
  /* En un solo <span>: la franja es flexible y partiría el rótulo y el aviso en columnas. */
  if(frase)frase.innerHTML='<span>📕 <strong>«Un mundo que no se ve».</strong> '+L.aviso+'</span>';
  if(ldPaso==='ficha')ldPintaFicha(L,zona,caja);
  else if(ldPaso==='resumen')ldPintaResumen(L,zona,caja);
  else ldPintaBusca(L,zona,caja);
}

/* ── Paso 1: buscar en la parte correcta ── */
function ldPintaBusca(L,zona,caja){
  const total=L.busquedas.length,hechas=Object.keys(ldResueltas).length;
  if(ldCual>=total){
    zona.innerHTML='<div class="ld-pregunta">✓ Encontraste las '+total+' respuestas, cada una en su parte.</div>'
      +'<div class="ld-pie"><button type="button" class="btn btn-pri" onclick="ldVe(\'ficha\')">▶ Ahora arma la ficha del libro</button></div>';
    caja.innerHTML='<div class="lab-asp-title">Lo que aprendiste a buscar</div><ul class="ld-res">'
      +L.partes.map(function(p){return ldRenglon('si','<strong>'+p.emoji+' '+p.nombre+':</strong> '+p.sirve);}).join('')+'</ul>';
    return;
  }
  const b=L.busquedas[ldCual],abierta=ldParte(ldAbierta);
  let h='<div class="ld-prog">Búsqueda '+(ldCual+1)+' de '+total+'</div>'
    +'<div class="ld-pregunta">❓ '+b.q+'</div>'
    +'<div class="ld-paso-t">Abre la parte del libro donde crees que está la respuesta:</div>'
    +'<div class="ld-partes" role="group" aria-label="Partes del libro">'
    +L.partes.map(function(p){return '<button type="button" class="lab-btn ld-parte'+(p.id===ldAbierta?' active-pri':'')+'" aria-pressed="'+(p.id===ldAbierta?'true':'false')+'" onclick="ldAbre(\''+p.id+'\')">'+p.emoji+' '+p.nombre+'</button>';}).join('')
    +'</div>';
  if(abierta){
    h+='<div class="ld-hoja" aria-label="'+abierta.nombre+'">'+abierta.pagina+'</div>'
      +'<div class="ld-pie"><button type="button" class="btn btn-g" onclick="ldAqui()">✅ La respuesta está aquí</button></div>';
  }
  if(ldAviso)h+='<div class="ld-aviso '+(ldAviso.ok?'ld-si':'ld-no')+'" role="alert"><span class="ld-marca">'+(ldAviso.ok?'✓ Aquí está.':'✗ Aquí no está.')+'</span> '+ldAviso.txt+'</div>';
  if(ldAviso&&ldAviso.ok)h+='<div class="ld-pie"><button type="button" class="btn btn-pri" onclick="ldSigue()">▶ Siguiente búsqueda</button></div>';
  zona.innerHTML=h;
  caja.innerHTML='<div class="lab-asp-title">Llevas '+hechas+' de '+total+' búsquedas</div>'
    +'<div class="lab-asp-info">'+(abierta?'<strong>'+abierta.emoji+' '+abierta.nombre+'.</strong> '+abierta.sirve:'Todavía no abres ninguna parte. Puedes abrirlas todas y leerlas antes de decidir.')+'</div>';
}

function ldAbre(id){
  /* Ya contestada: se puede seguir hojeando, pero el aviso de acierto se queda. */
  if(!(ldAviso&&ldAviso.ok))ldAviso=null;
  ldAbierta=id;
  ldSuena('click');
  ldPinta();
}

function ldAqui(){
  const L=ldLibro(),b=L.busquedas[ldCual],parte=ldParte(ldAbierta);
  if(!b||!parte||(ldAviso&&ldAviso.ok))return;
  if(parte.id===b.parte){
    ldResueltas[ldCual]=true;
    ldAviso={ok:true,txt:b.por};
    ldSuena('ok');
  }else{
    /* No se dice dónde está: se dice para qué sirve la parte que abrió. */
    ldAviso={ok:false,txt:'<strong>'+parte.nombre+':</strong> '+parte.sirve+' Prueba con otra parte.'};
    ldSuena('no');
  }
  ldPinta();
}

function ldSigue(){
  ldCual++;ldAbierta=null;ldAviso=null;
  ldSuena('click');
  ldPinta();
}

/* ── Paso 2: armar la ficha bibliográfica ── */
function ldPintaFicha(L,zona,caja){
  const portada=ldParte('portada');
  let h='<div class="ld-paso-t">Los datos de la ficha salen de la portada. Mírala y elige cada dato:</div>'
    +'<div class="ld-hoja" aria-label="Portada">'+portada.pagina+'</div>';
  L.ficha.forEach(function(d){
    h+='<div class="ld-dato"><div class="ld-paso-t">'+d.dato+'</div><div class="ld-ops" role="group" aria-label="'+d.dato+'">'
      +d.opciones.map(function(o,i){const suya=ldFichaElegida[d.id]===o;return '<button type="button" class="ld-op" aria-pressed="'+(suya?'true':'false')+'" onclick="ldDato(\''+d.id+'\','+i+')">'+o+'</button>';}).join('')
      +'</div></div>';
  });
  zona.innerHTML=h;
  const faltan=L.ficha.filter(function(d){return !ldFichaElegida[d.id];});
  let bien=0;
  const filas=L.ficha.map(function(d){
    const v=ldFichaElegida[d.id];
    if(!v)return '<li class="ld-medio"><span class="ld-marca">… '+d.dato+':</span> todavía no eliges.</li>';
    const ok=v===d.ok;if(ok)bien++;
    return ldRenglon(ok?'si':'no','<strong>'+d.dato+':</strong> '+v+'. '+(ok?d.por:'Ese no es el dato que va aquí. '+d.por),ok?'Bien':'No es');
  }).join('');
  let cabeza='<div class="lab-asp-title">🗃️ Ficha bibliográfica</div>';
  if(!faltan.length&&bien===L.ficha.length){
    cabeza+='<div class="ld-ficha">'+L.ficha.map(function(d){return d.ok;}).join('. ')+'.</div>'
      +'<div class="ld-veredicto">✓ <strong>Ficha completa.</strong> Con ella puedes decir de dónde salió cada dato y armar la bibliografía de tu trabajo. El orden y los signos entre un dato y otro los fija tu docente.</div>';
  }
  caja.innerHTML=cabeza+'<ul class="ld-res">'+filas+'</ul>'
    +(!faltan.length&&bien===L.ficha.length?'<div class="ld-pie"><button type="button" class="btn btn-pri" onclick="ldVe(\'resumen\')">▶ Ahora resume un capítulo</button></div>':'');
}

function ldDato(id,i){
  const d=ldLibro().ficha.find(function(x){return x.id===id;});
  if(!d)return;
  ldFichaElegida[id]=d.opciones[i];
  ldSuena(d.opciones[i]===d.ok?'ok':'no');
  ldPinta();
}

/* ── Paso 3: resumir sin copiar ── */
function ldPintaResumen(L,zona,caja){
  const r=L.resumen,previo=(document.getElementById('ld-texto')||{}).value||'';
  zona.innerHTML='<div class="ld-paso-t">Lee este trozo del capítulo 1 y resúmelo con tus propias palabras, en pocas líneas:</div>'
    +'<div class="ld-hoja" aria-label="'+r.titulo+'"><p><strong>'+r.titulo+'</strong></p><p>'+r.texto+'</p></div>'
    +'<label class="ld-paso-t" for="ld-texto">✍️ Tu resumen:</label>'
    +'<textarea id="ld-texto" class="ld-texto" rows="5" placeholder="Escribe aquí tu resumen…"></textarea>'
    +'<div class="ld-pie"><button type="button" class="btn btn-g" onclick="ldRevisa()">🔎 Revisar mi resumen</button></div>';
  document.getElementById('ld-texto').value=previo;
  caja.innerHTML='<div class="lab-asp-title">Revisión del resumen</div><div class="lab-asp-info">Escribe tu resumen y toca «Revisar». El laboratorio mira tres cosas: que no copies frases enteras, que te quede más corto que el texto y que no falte lo fundamental.</div>';
}

/* Las palabras de un texto, sin tildes ni signos, para poder compararlas. */
function ldPalabras(t){
  return String(t||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9ñ\s]/g,' ').split(/\s+/).filter(Boolean);
}

/* El tramo más largo de palabras seguidas que el resumen comparte con el
   texto. Seis palabras iguales y en el mismo orden ya no son casualidad:
   son una frase copiada. */
function ldCopia(suyo,fuente){
  let mejor=0,donde=0;
  for(let i=0;i<suyo.length;i++){
    for(let j=0;j<fuente.length;j++){
      let n=0;
      while(i+n<suyo.length&&j+n<fuente.length&&suyo[i+n]===fuente[j+n])n++;
      if(n>mejor){mejor=n;donde=i;}
    }
  }
  return {largo:mejor,trozo:suyo.slice(donde,donde+mejor).join(' ')};
}

function ldRevisa(){
  const L=ldLibro(),caja=document.getElementById('lab-display'),area=document.getElementById('ld-texto');
  if(!L||!caja||!area)return;
  const r=L.resumen,escrito=area.value;
  /* Lo que va entre comillas es una cita textual, no una copia: se aparta
     antes de buscar frases copiadas. */
  const citas=(escrito.match(/«[^»]*»|"[^"]*"|“[^”]*”/g)||[]);
  const sinCitas=escrito.replace(/«[^»]*»|"[^"]*"|“[^”]*”/g,' ');
  const suyo=ldPalabras(sinCitas),todo=ldPalabras(escrito),fuente=ldPalabras(r.texto);
  if(todo.length<3){
    caja.innerHTML='<div class="lab-asp-title">Revisión del resumen</div><div class="lab-asp-info">Todavía no hay nada que revisar: escribe tu resumen en el recuadro.</div>';
    ldSuena('no');
    return;
  }
  const filas=[];let peor='si';
  const baja=function(v){if(v==='no')peor='no';else if(v==='medio'&&peor!=='no')peor='medio';};
  const copia=ldCopia(suyo,fuente);
  if(copia.largo>=6){filas.push(ldRenglon('no','Hay una frase tomada tal cual del texto: «'+copia.trozo.split(' ').slice(0,10).join(' ')+'…». Dila con tus palabras o, si la necesitas tal cual, ponla entre comillas como cita textual.','Copiado'));baja('no');}
  else filas.push(ldRenglon('si','No copiaste frases enteras: lo dijiste a tu manera.'));
  if(citas.length){
    const soloCitas=suyo.length<5;
    filas.push(ldRenglon(soloCitas?'medio':'si',soloCitas?'Casi todo lo que escribiste va entre comillas: eso es citar, no resumir. Añade tus propias palabras.':'Pusiste entre comillas lo que tomaste tal cual: eso es una cita textual.'));
    if(soloCitas)baja('medio');
  }
  const mitad=Math.round(fuente.length*0.6);
  if(todo.length<8){filas.push(ldRenglon('no','Es muy corto ('+todo.length+' palabras): todavía no alcanza a decir lo fundamental.'));baja('no');}
  else if(todo.length>mitad){filas.push(ldRenglon('medio','Te quedó casi tan largo como el texto ('+todo.length+' palabras; el texto tiene '+fuente.length+'). Un resumen deja solo lo fundamental.'));baja('medio');}
  else filas.push(ldRenglon('si','Te quedó más corto que el texto ('+todo.length+' palabras; el texto tiene '+fuente.length+').'));
  r.claves.forEach(function(c){
    const esta=c.palabras.some(function(p){return todo.indexOf(p)>=0;});
    if(esta)filas.push(ldRenglon('si','Dices '+c.idea+'.'));
    else{filas.push(ldRenglon('no','No dices '+c.idea+'.'));baja('no');}
  });
  const veredicto=peor==='si'
    ?'✓ <strong>Buen resumen.</strong> Es corto, es tuyo y dice lo fundamental.'
    :peor==='medio'
      ?'◐ <strong>Vas bien, pero se puede ajustar.</strong> Cambia lo que está marcado con ◐ y vuelve a revisar.'
      :'✗ <strong>Todavía no.</strong> Arregla lo que está marcado con ✗ y vuelve a revisar.';
  caja.innerHTML='<div class="lab-asp-title">Revisión del resumen</div><ul class="ld-res">'+filas.join('')+'</ul>'
    +'<div class="ld-veredicto">'+veredicto+'</div>'
    +'<div class="lab-asp-info ld-nota">El laboratorio no sabe si tu resumen dice la verdad: solo cuenta palabras y busca frases copiadas. Vuelve a leer el capítulo y compara.</div>';
  ldSuena(peor==='si'?'ok':'click');
}

MotorMisiones.registrarLaboratorio(function(){
  ldPinta();
});
