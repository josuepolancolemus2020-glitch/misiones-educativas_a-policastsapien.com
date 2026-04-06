# 📚 Biblioteca de Código - Misiones Educativas

Esta biblioteca centraliza los fragmentos de código (snippets), soluciones lógicas y mejoras de interfaz (UX/UI) desarrolladas para reutilizarlas y mantener el control sobre las futuras misiones interactivas.

---

## 1. Cambio de Colores (Banner de Sustantivos)

**Descripción:** Modificación de la paleta de colores del encabezado (hero/banner) principal para personalizar visualmente la misión de los Sustantivos.

**Ubicación:** En la etiqueta `<style>`, dentro de las variables raíz (`:root`) en las líneas 26 y 27.

**El Código Modificado (Diff):**
```diff
/* Valores anteriores (Rojo/Rosa) */
/* --pri: #e84393; */
/* --sec: #0984e3; */

/* Nuevos valores aplicados (Tonos Verdes) */
:root {
    --pri: #419b88;
    --sec: #d99f2a;
}
``` 

## 1.1. Ajuste Inteligente del Gradiente

**Descripción:** Reemplazo de colores fijos por variables CSS para que el gradiente cambie automáticamente si se modifica la paleta principal.

**Ubicación:** En la etiqueta `<style>`, clase `.hero`.

**El Código Modificado (Diff):**
```diff
/* Lo que se quitó (Colores fijos): */
- background: linear-gradient(135deg, #e84393 0%, #0984e3 55%, #6c5ce7 100%);

/* Lo que se agregó (Variables dinámicas): */
+ ↓//AGREGAR DESDE AQUÍ ↓ BUSCAR LÍNEA APROXIMADA 
 background: linear-gradient(135deg, var(--pri) 0%, var(--sec) 100%);
+ ↑//HASTA AQUÍ
```

---
## 2. Corrección de Coordenadas y Matrices (Sopa de Letras) cambia según contenido, este corresponde a los sustantivos

**Descripción:** Reparación profunda del motor de la sopa de letras. Se reconstruyeron las matrices de letras (grid) y se recalcularon las coordenadas [fila, columna] del "juez" para validar las palabras.

**Ubicación:** Matriz `sopaSets` y variables globales en `<script>`.

**Código Modificado (Diff):**
```diff
  // 1. RECONSTRUCCIÓN DE LA CUADRÍCULA (Sopa 2)
    grid:[
      ['C','O','L','E','C','T','I','V','O','M'],
-     ['P','J','E','M','E','N','I','N','O','A'],
-     ['K','A','R','E','B','A','Ñ','O','W','S'],
-     ['Q','U','Z','O','V','E','J','A','A','C'],
-     ['Y','R','H','G','J','D','S','J','P','U'],
-     ['M','I','N','B','V','E','V','Z','K','L'],
-     ['L','A','P','O','I','O','Y','T','R','I'],
+     ['P','J','E','M','K','N','I','Z','W','A'],
+     ['K','A','R','E','B','A','Ñ','O','F','S'],
+     ['Q','U','Z','O','V','Y','T','D','A','C'],
+     ['Y','R','H','G','J','W','S','J','P','U'],
+     ['M','I','N','B','P','K','E','Z','K','L'],
+     ['L','A','P','O','I','V','Y','T','R','I'],
      ['W','K','E','S','O','F','G','H','J','N'],
      ['X','C','V','B','N','M','K','L','P','O'],
      ['I','N','D','I','V','I','D','U','A','L']
    ]
  }
];

  // 2. INICIALIZACIÓN DE VARIABLES DE ESTADO
+ let currentSopaSetIdx=0, sopaFoundWords=new Set();
+ let sopaFirstClickCell=null, sopaPointerStartCell=null, sopaPointerMoved=false, sopaSelectedCells=[];

  // 3. LIMPIEZA DE CÓDIGO EN toggleSopaWords()
  function toggleSopaWords(){
    sfx('click');
    const set=sopaSets[currentSopaSetIdx];
    const btn=document.getElementById('sopaWordsBtn');
-   // Resaltar celdas ocultas (no encontradas aún) durante 2 s
    const revealCells=[];
    set.words.forEach(wObj=>{
      if(sopaFoundWords.has(wObj.w)) return;
```

---

## 3. Sistema Completo de Accesibilidad (Letra Grande)

**Descripción:** Implementación de un sistema para aumentar el tamaño del texto, incluyendo diseño CSS, botón en HTML y lógica JS con `localStorage`.

**Ubicación:** Bloque `<style>` (aprox. línea 370) y final del `<footer>` / inicio de `<script>` (aprox. línea 800).

**Código Modificado (Diff):**
```diff
  @media print{
    body *{display:none!important;}
  }
+ ↓//AGREGAR DESDE AQUÍ ↓ BUSCAR LÍNEA APROXIMADA 373
 /* ================= ACCESIBILIDAD: LETRA GRANDE ================= */
 body.letra-grande p, 
 body.letra-grande span, 
 body.letra-grande li, 
 body.letra-grande h2, 
 body.letra-grande h3,
 body.letra-grande .sopa-cell { 
     font-size: 115% !important;
     line-height: 1.6; 
 }
+ ↑//HASTA AQUÍ
 body.letra-grande button {
     font-size: initial;
 }

  </style>
  </head>
  <body>

<button class="cred-btn" id="sndBtn" onclick="toggleSnd()">🔊 Sonido</button>
    <button class="cred-btn" id="themeBtn" onclick="toggleTheme()">🌙 Tema</button>
    <button class="cred-btn" id="achBtn" onclick="toggleAchPanel()">🏅 Logros</button>
+ ↓//AGREGAR DESDE AQUÍ ↓ BUSCAR LÍNEA APROXIMADA 700-800
   <button class="cred-btn" onclick="toggleLetra()">🔎 Letra</button>
+ ↑//HASTA AQUÍ
    <button class="cred-btn" onclick="resetXP()">🔄 Reiniciar XP</button>
  </div>
</footer>

<script>
+ ↓//REEMPLAZAR DESDE AQUÍ ↓ BUSCAR LÍNEA APROXIMADA 700-800
 // Función para hacer la letra más grande (Accesibilidad)
 function toggleLetra() {
     document.body.classList.toggle('letra-grande');
     
     // Si tienes activados los sonidos, que suene al hacer clic
     if(typeof sfx === 'function') sfx('click'); 
     
     // Guardar la preferencia para que no se borre al cambiar de página
     const estaActivado = document.body.classList.contains('letra-grande');
     localStorage.setItem('preferenciaLetra', estaActivado);
 }
 
 // Revisar la memoria al cargar la página
 window.addEventListener('DOMContentLoaded', () => {
     if(localStorage.getItem('preferenciaLetra') === 'true') {
         document.body.classList.add('letra-grande');
     }
 });
+ ↑//HASTA AQUÍ
  // ===================== UTILIDADES =====================
  const _pick = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
  const _shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
``` 

---

## 4. Candado Inteligente de UX (Juego de Clasificación)

**Descripción:** Implementación de lógica condicional para evitar que los elementos sean removidos accidentalmente de las cajas de clasificación al intentar soltar un nuevo elemento.

**Ubicación:** Dentro de la función `buildClass()` (aprox. línea 1112).

**Código Modificado (Diff):**
```diff
      const item = document.createElement('div'); item.className='drop-item';
      item.textContent=clsSelectedWord.textContent; item.dataset.t=clsSelectedWord.dataset.t;
      const original=clsSelectedWord;
-     item.onclick=(ev)=>{ ev.stopPropagation(); document.getElementById('clsBank').appendChild(original); original.classList.remove('sel-word'); item.remove(); sfx('click'); };

+ ↓//REEMPLAZAR DESDE AQUÍ ↓ BUSCAR LÍNEA APROXIMADA 111
``` item.onclick = (ev) => {
         ev.stopPropagation(); // Evita que el clic se pase a la caja de atrás
         
         // El Candado Inteligente
         if (clsSelectedWord !== null) {
             // Manos llenas: En lugar de sacar la palabra, hacemos clic en la caja contenedora
             // para que la nueva palabra seleccionada caiga aquí adentro.
             col.click(); 
         } else {
             // Manos vacías: Devolvemos la palabra al banco
             document.getElementById('clsBank').appendChild(original);
             original.classList.remove('sel-word');
             item.remove();
             if(typeof sfx === 'function') sfx('click');
         }
     };
+ ↑//HASTA AQUÍ 
      wordsCol.appendChild(item); clsSelectedWord.remove(); clsSelectedWord=null; sfx('click');
    };
  });
```

## 5. Función de Pistas "Ver Palabras" (Sopa de Letras)

     Descripción: Lógica y diseño para revelar temporalmente las palabras ocultas en la sopa de letras. Genera una animación intermitente amarilla sobre las celdas de las palabras que el usuario aún no ha encontrado y deshabilita el botón por 2 segundos.

     Ubicación:

     HTML: Botón <button id="sopaWordsBtn"> (Aprox. línea 926).
     CSS: Etiqueta <style> (Aprox. línea 360).
     JS: Dentro de la etiqueta <script> (Aprox. línea 1585).
     <!-- HTML -->

     <!-- HTML -->

```diff
+ ↓//COPIAR DESDE AQUÍ ↓ BUSCAR LÍNEA APROXIMADA 926
<button class="btn btn-sec" id="sopaWordsBtn" onclick="toggleSopaWords()"> 🔦 Ver palabras</button>
+ ↑//HASTA AQUÍ

/* CSS */
+ ↓//COPIAR DESDE AQUÍ ↓ BUSCAR LÍNEA APROXIMADA 360
.sopa-cell.sopa-reveal {
    background: var(--yellow);
    color: #111;
    animation: sopaRevealPulse 0.5s ease infinite alternate;
}
@keyframes sopaRevealPulse {
    from { opacity: 0.5; }
    to { opacity: 1; }
}
.sopa-hint {
    font-size: 0.78rem;
    color: var(--gray);
    text-align: center;
    margin-bottom: 0.4rem;
}
+ ↑//HASTA AQUÍ

/* JAVASCRIPT */
+ ↓//COPIAR DESDE AQUÍ ↓ BUSCAR LÍNEA APROXIMADA 1585
let _sopaRevealTimer=null;

function toggleSopaWords(){
  sfx('click');
  const set=sopaSets[currentSopaSetIdx];
  const btn=document.getElementById('sopaWordsBtn');
  const revealCells=[];
  
  set.words.forEach(wObj=>{
    if(sopaFoundWords.has(wObj.w)) return;
    wObj.cells.forEach(([r,c])=>{
      const cell=document.querySelector(`#sopaGrid [data-row="${r}"][data-col="${c}"]`);
      if(cell){ cell.classList.add('sopa-reveal'); revealCells.push(cell); }
    });
  });
  
  btn.disabled=true;
  clearTimeout(_sopaRevealTimer);
  _sopaRevealTimer=setTimeout(()=>{
    revealCells.forEach(c=>c.classList.remove('sopa-reveal'));
    btn.disabled=false;
  },2000);
}
+ ↑//HASTA AQUÍ