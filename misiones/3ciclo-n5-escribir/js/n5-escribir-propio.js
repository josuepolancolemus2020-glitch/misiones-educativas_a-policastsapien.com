/* ============================================================
   M.E.T.A.S · Misión Escribir por etapas · lo que es solo de esta misión
   ------------------------------------------------------------
   Lo común a todas las misiones está en js/motor-mision.js y lo que
   esta misión dice y pregunta está en js/contenido.js. Aquí queda el
   código que es de esta misión y de ninguna otra:

   · su laboratorio, la mesa de revisión.

   Por qué el laboratorio es así. Revisar no se aprende leyendo que
   «hay que revisar»: se aprende con un borrador delante. La mesa pone
   tres borradores (los datos están en `mesaRevision`, en contenido.js),
   cada uno con tres fallas de las que pide la programación: una de
   concordancia o de claridad, una de coherencia (la idea que sobra, la
   que se repite o el orden revuelto) y dos oraciones que piden
   coordinarse. El alumno arregla una falla cada vez, eligiendo entre
   tres opciones, y ve cómo el texto va quedando.

   · Todo se hace con botones: nada se arrastra.
   · Una opción equivocada no cierra nada: dice por qué no arregla la
     falla y deja probar otra. Aquí no se pierde XP ni se gana: es un
     banco de trabajo, no una prueba.
   · El acierto y el error llevan ✓ y ✗, no solo color (en el aviso los
     pone la hoja de estilos; en la opción descartada, este archivo), y
     la falla que toca se señala con una flecha y su rótulo, no con rojo.
   ============================================================ */

// ===================== LABORATORIO: LA MESA DE REVISIÓN =====================
let mesaCual=0,mesaPaso=0;

/* El borrador que está en la mesa. */
function mesaBorrador(){return mesaRevision[mesaCual];}
function mesaCorrecta(falla){return falla.opciones.find(function(o){return o.ok;});}

function mesaElige(id){
  const i=mesaRevision.findIndex(function(b){return b.id===id;});
  if(i<0)return;
  mesaCual=i;mesaPaso=0;
  if(typeof sfx==='function')sfx('click');
  mesaPinta();
}
function mesaReinicia(){mesaPaso=0;if(typeof sfx==='function')sfx('click');mesaPinta();}

/* El texto del borrador, trozo por trozo: lo ya arreglado, la falla que
   toca y lo que todavía espera. Cada trozo lleva su marca escrita. */
function mesaTexto(b){
  return b.fallas.map(function(f,i){
    if(i<mesaPaso)return '<span class="mesa-trozo mesa-listo"><span class="mesa-marca" aria-hidden="true">✓</span> '+mesaCorrecta(f).t+'</span>';
    if(i===mesaPaso)return '<span class="mesa-trozo mesa-ahora"><span class="mesa-marca" aria-hidden="true">▶</span> '+f.antes+'</span>';
    return '<span class="mesa-trozo mesa-espera">'+f.antes+'</span>';
  }).join(' ');
}

function mesaPinta(){
  const b=mesaBorrador();
  document.querySelectorAll('.mesa-borr').forEach(function(btn){btn.classList.toggle('active-pri',btn.dataset.borrador===b.id);btn.setAttribute('aria-pressed',btn.dataset.borrador===b.id?'true':'false');});
  /* Va todo dentro de UNA caja: la franja reparte sus hijos en fila, y con
     el título y el contexto sueltos los ponía uno al lado del otro. */
  document.getElementById('lab-sentence').innerHTML='<div>'+b.icono+' <strong>'+b.titulo+'</strong> · '+b.materia+'<div class="mesa-contexto">'+b.contexto+'</div></div>';
  const aviso=document.getElementById('mesa-fb');if(aviso)aviso.classList.remove('show');
  const caja=document.getElementById('lab-display'),falla=document.getElementById('mesa-falla'),ops=document.getElementById('mesa-opciones'),prog=document.getElementById('mesa-prog');
  ops.innerHTML='';
  if(mesaPaso>=b.fallas.length){
    /* Las tres fallas arregladas: se enseña el texto rehecho, entero. */
    caja.innerHTML='<div class="lab-asp-title">📄 Versión final</div><div class="lab-asp-info mesa-final">'+b.final+'</div>';
    falla.innerHTML='<strong>✓ Borrador revisado.</strong> Compara: el texto dice lo mismo que quería decir, pero ahora se entiende a la primera. Prueba con otro borrador.';
    prog.textContent='3 de 3 fallas arregladas';
    return;
  }
  const f=b.fallas[mesaPaso];
  caja.innerHTML='<div class="lab-asp-title">✏️ Borrador</div><div class="lab-asp-info">'+mesaTexto(b)+'</div>';
  falla.innerHTML='<span class="mesa-tipo">Falla '+(mesaPaso+1)+' de '+b.fallas.length+': '+f.tipo+'</span> '+f.pregunta;
  prog.textContent=mesaPaso+' de '+b.fallas.length+' fallas arregladas';
  f.opciones.forEach(function(o,i){
    const btn=document.createElement('button');
    btn.className='lab-btn mesa-op';
    btn.type='button';
    btn.textContent=o.t;
    btn.onclick=function(){mesaResponde(i,btn);};
    ops.appendChild(btn);
  });
}

function mesaResponde(i,btn){
  const f=mesaBorrador().fallas[mesaPaso];
  const o=f.opciones[i];
  if(o.ok){
    if(typeof sfx==='function')sfx('ok');
    mesaPaso++;
    mesaPinta();
    /* La marca ✓ o ✗ del aviso la pone la hoja de estilos (.fb.ok, .fb.err). */
    fb('mesa-fb',o.por,true);
  }else{
    if(typeof sfx==='function')sfx('no');
    /* La opción que no sirve se marca y se apaga: ya se sabe que no es. */
    btn.classList.add('mesa-no');btn.disabled=true;
    btn.textContent='✗ '+o.t;
    fb('mesa-fb','Todavía no. '+o.por,false);
  }
}

MotorMisiones.registrarLaboratorio(function(){
  mesaPinta();
});
