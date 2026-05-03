/* ─────────────────────────────────────────────
   COLLAGE DE EVIDENCIAS
───────────────────────────────────────────── */

/* ── Estado ───────────────────────────────── */
let _coPhotos   = [];   // File[]
let _coLogoFile = null; // File | null

// Cache de render (se rellena en coGenerate, se usa en _coRedraw)
let _coImgCache  = [];   // HTMLImageElement[]  — fotos ya cargadas
let _coLogoCache = null; // HTMLImageElement | null
let _coSlots     = [];   // { x,y,w,h }[] — layout calculado
let _coOffsets   = [];   // { dx,dy }[]   — desplazamiento por foto (px canvas)
let _coMeta      = null; // { W,H,bannerH,text,format }

// Estado de arrastre
let _coDragging  = null; // { idx, startX, startY, startDx, startDy }

/* Llamada desde switchView() */
function initCollage() {}

/* ══════════════════════════════════════════
   HELPERS CANVAS
══════════════════════════════════════════ */

/**
 * Dibuja `img` con object-fit:cover en el rect (x,y,w,h).
 * dx/dy son desplazamientos en px del canvas:
 *   dx > 0  → la imagen se mueve a la derecha (vemos más de su lado izquierdo)
 *   dy > 0  → la imagen se mueve hacia abajo  (vemos más de su parte superior)
 */
function _coCover(ctx, img, x, y, w, h, dx = 0, dy = 0) {
  const iA = img.naturalWidth / img.naturalHeight;
  const sA = w / h;
  let sx, sy, sw, sh;

  if (iA > sA) {
    // Imagen más ancha → desbordamiento horizontal
    sh = img.naturalHeight;
    sw = sh * sA;
    const maxSlide = img.naturalWidth - sw;
    const srcPxPerCanvasPx = sw / w;          // cuántos px fuente por px canvas
    sx = maxSlide / 2 - dx * srcPxPerCanvasPx;
    sx = Math.max(0, Math.min(maxSlide, sx));
    sy = 0;
  } else {
    // Imagen más alta → desbordamiento vertical
    sw = img.naturalWidth;
    sh = sw / sA;
    const maxSlide = img.naturalHeight - sh;
    const srcPxPerCanvasPx = sh / h;
    sy = maxSlide / 2 - dy * srcPxPerCanvasPx;
    sy = Math.max(0, Math.min(maxSlide, sy));
    sx = 0;
  }

  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  ctx.restore();
}

// Rectángulo redondeado compatible con todos los navegadores
function _coRR(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function _coLoadImg(file) {
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload  = () => { URL.revokeObjectURL(url); res(img); };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('Imagen inválida')); };
    img.src = url;
  });
}

/* ══════════════════════════════════════════
   LAYOUT
══════════════════════════════════════════ */

function _coLayout(n, W, H) {
  const G = 6;
  const f = v => Math.floor(v);

  if (n === 1) return [{ x: 0, y: 0, w: W, h: H }];

  if (n === 2) {
    const w = f((W - G) / 2);
    return [
      { x: 0,     y: 0, w,           h: H },
      { x: w + G, y: 0, w: W - w - G, h: H },
    ];
  }

  if (n === 3) {
    const tH = f(H * 0.58), bH = H - tH - G;
    const w  = f((W - G) / 2);
    return [
      { x: 0,     y: 0,      w: W,         h: tH },
      { x: 0,     y: tH + G, w,            h: bH },
      { x: w + G, y: tH + G, w: W - w - G, h: bH },
    ];
  }

  if (n === 4) {
    const w = f((W - G) / 2), h = f((H - G) / 2);
    return [
      { x: 0,     y: 0,     w,           h           },
      { x: w + G, y: 0,     w: W - w - G, h           },
      { x: 0,     y: h + G, w,           h: H - h - G },
      { x: w + G, y: h + G, w: W - w - G, h: H - h - G },
    ];
  }

  if (n === 5) {
    const h1 = f(H / 2), h2 = H - h1 - G;
    const w2 = f((W - G) / 2);
    const w3 = f((W - 2 * G) / 3);
    return [
      { x: 0,            y: 0,      w: w2,           h: h1 },
      { x: w2 + G,       y: 0,      w: W - w2 - G,   h: h1 },
      { x: 0,            y: h1 + G, w: w3,           h: h2 },
      { x: w3 + G,       y: h1 + G, w: w3,           h: h2 },
      { x: (w3 + G) * 2, y: h1 + G, w: W-(w3+G)*2,  h: h2 },
    ];
  }

  if (n === 6) {
    const w = f((W - 2 * G) / 3), h = f((H - G) / 2);
    const slots = [];
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 3; c++) {
        slots.push({
          x: c === 2 ? W - w : c * (w + G),
          y: r === 1 ? H - h : r * (h + G),
          w, h,
        });
      }
    }
    return slots;
  }
  return [];
}

/* ══════════════════════════════════════════
   RENDER
══════════════════════════════════════════ */

// Dibuja banner, logo circular (dentro del cintillo) y marca de agua
function _coDrawOverlays(ctx, W, H) {
  if (!_coMeta) return;
  const { bannerH, text, format } = _coMeta;
  const bannerY  = H - bannerH;
  const isVert   = format === 'vertical';

  // ── Cintillo oscuro ────────────────────────────────────────────────
  ctx.fillStyle = 'rgba(10,18,40,0.87)';
  ctx.fillRect(0, bannerY, W, bannerH);

  // Línea de acento superior
  ctx.fillStyle = '#1e3a7c';
  ctx.fillRect(0, bannerY, W, 5);

  // ── Logo circular (dentro del banner, no tapa fotos) ───────────────
  const LOGO_D  = isVert ? 120 : 96;   // diámetro del círculo
  const LOGO_R  = LOGO_D / 2;
  const PAD     = 22;
  const logoCX  = PAD + LOGO_R;
  const logoCY  = bannerY + bannerH / 2;

  if (_coLogoCache) {
    ctx.save();

    // Borde blanco alrededor del círculo
    ctx.beginPath();
    ctx.arc(logoCX, logoCY, LOGO_R + 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.fill();

    // Recortar al círculo e insertar imagen
    ctx.beginPath();
    ctx.arc(logoCX, logoCY, LOGO_R, 0, Math.PI * 2);
    ctx.clip();

    const lA    = _coLogoCache.naturalWidth / _coLogoCache.naturalHeight;
    const inner = LOGO_D * 0.82;   // imagen ligeramente más pequeña que el círculo
    const lW    = lA >= 1 ? inner       : inner * lA;
    const lH    = lA >= 1 ? inner / lA  : inner;
    ctx.drawImage(_coLogoCache, logoCX - lW / 2, logoCY - lH / 2, lW, lH);

    ctx.restore();
  }

  // ── Texto de evidencia ─────────────────────────────────────────────
  if (text) {
    // Si hay logo, el texto ocupa la zona a su derecha; si no, todo el ancho
    const textLeft  = _coLogoCache ? logoCX + LOGO_R + 20 : PAD;
    const textRight = W - PAD;
    const textCX    = (textLeft + textRight) / 2;
    const maxW      = textRight - textLeft;

    let fs = isVert ? 70 : 56;
    ctx.fillStyle    = '#ffffff';
    ctx.font         = `700 ${fs}px Arial, sans-serif`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';

    // Reducir tamaño hasta que quepa en el ancho disponible
    while (ctx.measureText(text).width > maxW && fs > 22) {
      fs -= 2;
      ctx.font = `700 ${fs}px Arial, sans-serif`;
    }
    ctx.fillText(text, textCX, bannerY + bannerH / 2, maxW);
  }

  // ── Marca de agua discreta ─────────────────────────────────────────
  ctx.fillStyle    = 'rgba(255,255,255,0.25)';
  ctx.font         = `500 ${isVert ? 22 : 18}px Arial, sans-serif`;
  ctx.textAlign    = 'right';
  ctx.textBaseline = 'bottom';
  ctx.fillText('M.E.T.A.S.', W - 16, H - 10);
}

// Redibujo rápido usando imágenes ya cargadas (sin I/O)
function _coRedraw() {
  if (!_coImgCache.length || !_coMeta) return;
  const canvas = document.getElementById('collage-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const { W, H } = _coMeta;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);

  _coSlots.forEach((s, i) => {
    if (_coImgCache[i]) {
      const { dx, dy } = _coOffsets[i] || { dx: 0, dy: 0 };
      _coCover(ctx, _coImgCache[i], s.x, s.y, s.w, s.h, dx, dy);
    }
  });

  _coDrawOverlays(ctx, W, H);
}

/* ══════════════════════════════════════════
   DRAG-TO-PAN
══════════════════════════════════════════ */

function _coInitDrag(canvas) {

  // ─ Identificar slot bajo un punto (en coords canvas) ─
  const slotAt = (cx, cy) =>
    _coSlots.findIndex(s =>
      cx >= s.x && cx <= s.x + s.w &&
      cy >= s.y && cy <= s.y + s.h
    );

  // ─ Convertir coords del evento a coords del canvas interno ─
  const toCanvas = e => {
    const rect  = canvas.getBoundingClientRect();
    const scale = canvas.width / rect.width;   // px-canvas por px-pantalla
    return {
      cx: (e.clientX - rect.left) * scale,
      cy: (e.clientY - rect.top)  * scale,
    };
  };

  canvas.addEventListener('pointerdown', e => {
    const { cx, cy } = toCanvas(e);
    const idx = slotAt(cx, cy);
    if (idx === -1) return;

    canvas.setPointerCapture(e.pointerId);
    _coDragging = {
      idx,
      startX:  e.clientX,
      startY:  e.clientY,
      startDx: (_coOffsets[idx] || { dx: 0 }).dx,
      startDy: (_coOffsets[idx] || { dy: 0 }).dy,
    };
    canvas.style.cursor = 'grabbing';
    e.preventDefault();
  });

  canvas.addEventListener('pointermove', e => {
    if (!_coDragging) {
      // Cambiar cursor según posición
      const { cx, cy } = toCanvas(e);
      canvas.style.cursor = slotAt(cx, cy) !== -1 ? 'grab' : 'default';
      return;
    }

    e.preventDefault();

    const rect   = canvas.getBoundingClientRect();
    const scale  = canvas.width / rect.width;
    const ddx    = (e.clientX - _coDragging.startX) * scale;
    const ddy    = (e.clientY - _coDragging.startY) * scale;

    _coOffsets[_coDragging.idx] = {
      dx: _coDragging.startDx + ddx,
      dy: _coDragging.startDy + ddy,
    };

    _coRedraw();
  }, { passive: false });

  const stopDrag = () => {
    if (!_coDragging) return;
    _coDragging = null;
    canvas.style.cursor = 'grab';
  };

  canvas.addEventListener('pointerup',     stopDrag);
  canvas.addEventListener('pointercancel', stopDrag);
}

/* ══════════════════════════════════════════
   GENERAR (entrada principal)
══════════════════════════════════════════ */

async function coGenerate() {
  if (!_coPhotos.length) { toast('Selecciona al menos 1 fotografía'); return; }

  const btn = document.getElementById('co-generate-btn');
  if (btn) {
    btn.disabled    = true;
    btn.innerHTML   = '<i class="fa-solid fa-spinner fa-spin"></i> Generando…';
  }

  try {
    const format   = document.querySelector('input[name="co-format"]:checked')?.value || 'square';
    const text     = (document.getElementById('co-text')?.value || '').trim();
    const canvas   = document.getElementById('collage-canvas');
    const ctx      = canvas.getContext('2d');

    const CW      = 1080;
    const CH      = format === 'vertical' ? 1920 : 1080;
    const BANNER_H = format === 'vertical' ? 160  : 130;
    const PHOTO_H  = CH - BANNER_H;

    canvas.width  = CW;
    canvas.height = CH;

    // Cargar imágenes
    const photoImgs = await Promise.all(_coPhotos.slice(0, 6).map(_coLoadImg));
    const logoImg   = _coLogoFile
      ? await _coLoadImg(_coLogoFile).catch(() => null)
      : null;

    // Guardar en cache para redibujos sin I/O
    _coImgCache  = photoImgs;
    _coLogoCache = logoImg;
    _coSlots     = _coLayout(photoImgs.length, CW, PHOTO_H);
    _coOffsets   = photoImgs.map(() => ({ dx: 0, dy: 0 }));
    _coMeta      = { W: CW, H: CH, bannerH: BANNER_H, text, format };

    // Primer render
    _coRedraw();

    // Registrar drag (solo una vez por canvas)
    if (!canvas._coDragReady) {
      _coInitDrag(canvas);
      canvas._coDragReady = true;
    }
    canvas.style.cursor = 'grab';

    // Mostrar sección de vista previa
    const wrap = document.getElementById('co-preview-wrap');
    if (wrap) {
      wrap.style.display = '';
      wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    toast('Arrastra cada foto para ajustar el encuadre 📐');

  } catch (err) {
    toast('Error al procesar imágenes. Intenta de nuevo.');
    console.error('[Collage]', err);
  } finally {
    if (btn) {
      btn.disabled  = false;
      btn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Generar Collage';
    }
  }
}

/* ══════════════════════════════════════════
   MINIATURAS
══════════════════════════════════════════ */

function _coRenderThumbs() {
  const grid  = document.getElementById('co-photos-thumbs');
  const count = document.getElementById('co-photo-count');
  if (!grid) return;
  if (count) count.textContent = `${_coPhotos.length} / 6`;

  // Liberar Object URLs previas
  grid.querySelectorAll('img[data-obj]').forEach(img => URL.revokeObjectURL(img.dataset.obj));
  grid.innerHTML = '';

  _coPhotos.forEach((file, i) => {
    const url  = URL.createObjectURL(file);
    const item = document.createElement('div');
    item.className = 'co-thumb';
    item.innerHTML = `
      <img src="${url}" data-obj="${url}" alt="Foto ${i + 1}">
      <button class="co-thumb-remove" aria-label="Quitar foto ${i + 1}">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <span class="co-thumb-num">${i + 1}</span>`;

    item.querySelector('.co-thumb-remove').addEventListener('click', () => {
      URL.revokeObjectURL(url);
      _coPhotos.splice(i, 1);
      _coRenderThumbs();
      // Invalidar cache y ocultar preview
      _coImgCache = []; _coSlots = []; _coOffsets = []; _coMeta = null;
      const wrap = document.getElementById('co-preview-wrap');
      if (wrap) wrap.style.display = 'none';
    });

    grid.appendChild(item);
  });
}

/* ══════════════════════════════════════════
   EVENT LISTENERS
══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Navegación ──────────────────────────
  document.getElementById('goto-collage-btn')
    ?.addEventListener('click', () => switchView('view-collage'));
  document.getElementById('collage-back-btn')
    ?.addEventListener('click', () => switchView('view-perfil'));

  // ── Logo ────────────────────────────────
  document.getElementById('co-logo-input')?.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    _coLogoFile = file;
    const url  = URL.createObjectURL(file);
    const img  = document.getElementById('co-logo-img');
    const prev = document.getElementById('co-logo-preview');
    if (img)  img.src = url;
    if (prev) prev.style.display = '';
  });

  document.getElementById('co-logo-remove')?.addEventListener('click', () => {
    _coLogoFile = null;
    const el = id => document.getElementById(id);
    if (el('co-logo-img'))   el('co-logo-img').src = '';
    if (el('co-logo-preview')) el('co-logo-preview').style.display = 'none';
    if (el('co-logo-input')) el('co-logo-input').value = '';
  });

  // ── Fotos ────────────────────────────────
  document.getElementById('co-photos-input')?.addEventListener('change', e => {
    const files = Array.from(e.target.files);
    const spare = 6 - _coPhotos.length;
    if (spare <= 0) { toast('Ya tienes 6 fotos. Elimina alguna para agregar más.'); return; }
    if (files.length > spare) toast(`Solo se añaden ${spare} foto(s) (límite 6)`);
    _coPhotos.push(...files.slice(0, spare));
    e.target.value = ''; // permite re-seleccionar los mismos archivos
    _coRenderThumbs();
    // Ocultar preview anterior al cambiar el set de fotos
    _coImgCache = []; _coSlots = []; _coOffsets = []; _coMeta = null;
    const wrap = document.getElementById('co-preview-wrap');
    if (wrap) wrap.style.display = 'none';
  });

  // ── Generar ──────────────────────────────
  document.getElementById('co-generate-btn')
    ?.addEventListener('click', coGenerate);

  // ── Descargar ────────────────────────────
  document.getElementById('co-download-btn')?.addEventListener('click', () => {
    const canvas = document.getElementById('collage-canvas');
    if (!canvas || !_coMeta) return;

    const btn = document.getElementById('co-download-btn');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Preparando…'; }

    // toBlob es asíncrono y más eficiente en memoria que toDataURL
    canvas.toBlob(blob => {
      if (!blob) {
        toast('No se pudo exportar la imagen. Intenta de nuevo.');
        if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-download"></i> Descargar / Guardar Imagen'; }
        return;
      }
      const url = URL.createObjectURL(blob);
      const a   = document.createElement('a');
      a.href     = url;
      a.download = `collage-metas-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // Liberar el Blob URL después de que el navegador lo procese
      setTimeout(() => URL.revokeObjectURL(url), 500);
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-download"></i> Descargar / Guardar Imagen'; }
    }, 'image/jpeg', 0.9);
  });
});

window.initCollage = initCollage;
