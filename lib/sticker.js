// Composes the SANTVS sticker onto a captured frame.
// Draws the video source and paints the logo + day + act info in the
// bottom-left. Also builds the BeReal-style layout (back camera as the main
// photo, front camera as a small inset).

function pad(n) {
  return String(n).padStart(2, '0');
}

export function formatClock(date = new Date()) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

let logoPromise = null;
function loadLogo() {
  if (logoPromise) return logoPromise;
  logoPromise = new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = '/logo-santvs.svg';
  });
  return logoPromise;
}

function truncate(str, n) {
  if (!str) return '';
  return str.length > n ? str.slice(0, n - 1) + '…' : str;
}

function roundRectPath(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

// Draws the (bigger) sticker onto the given canvas context, bottom-left.
// Layout, bottom → top: [Acte value | Hora value] · Day · Logo.
export async function drawSticker(ctx, { width, height, actTitle, actTime, dayLabel }) {
  const base = Math.min(width, height);
  const padX = Math.round(base * 0.05);
  const logoHeight = Math.round(base * 0.11);
  const labelPx = Math.round(base * 0.032);
  const valuePx = Math.round(base * 0.052);
  const dayPx = Math.round(base * 0.066);
  const rowGap = Math.round(base * 0.02);
  const labelValueGap = Math.round(base * 0.008);

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.7)';
  ctx.shadowBlur = Math.round(base * 0.016);
  ctx.shadowOffsetY = Math.round(base * 0.005);
  ctx.fillStyle = '#ffffff';
  ctx.textBaseline = 'alphabetic';

  const x = padX;
  const y = height - Math.round(base * 0.055);

  // Bottom row: "Acte: <title>" and "Hora: <time>"
  ctx.font = `600 ${labelPx}px system-ui, sans-serif`;
  ctx.fillText('Acte:', x, y - valuePx - labelValueGap);
  ctx.font = `700 ${valuePx}px system-ui, sans-serif`;
  ctx.fillText(truncate(actTitle || 'Les Santes', 24), x, y);

  const horaX = Math.round(width * 0.58);
  ctx.font = `600 ${labelPx}px system-ui, sans-serif`;
  ctx.fillText('Hora:', horaX, y - valuePx - labelValueGap);
  ctx.font = `700 ${valuePx}px system-ui, sans-serif`;
  ctx.fillText(actTime || '--:--:--', horaX, y);

  // Day (big) above the act row
  const dayY = y - valuePx - labelValueGap - labelPx - rowGap;
  if (dayLabel) {
    ctx.font = `800 ${dayPx}px system-ui, sans-serif`;
    ctx.fillText(dayLabel.toUpperCase(), x, dayY);
  }

  // Logo sits above the day line
  const logoY = (dayLabel ? dayY - dayPx : dayY) - rowGap - logoHeight;
  try {
    const logo = await loadLogo();
    const naturalW = logo.naturalWidth || logo.width || 1091;
    const naturalH = logo.naturalHeight || logo.height || 327;
    const logoWidth = Math.round((logoHeight * naturalW) / naturalH);
    ctx.drawImage(logo, x, logoY, logoWidth, logoHeight);
  } catch {
    ctx.font = `700 ${logoHeight}px system-ui, sans-serif`;
    ctx.fillText('SANTVS', x, logoY + logoHeight);
  }

  ctx.restore();
}

// Fixed 9:16 portrait output. The camera preview uses object-cover on a
// portrait screen, so a centered 9:16 crop of the source matches what the
// user sees.
const TARGET_RATIO = 9 / 16;
const MAX_OUTPUT_HEIGHT = 1920;

function pickCropRect(srcW, srcH) {
  const srcRatio = srcW / srcH;
  if (srcRatio > TARGET_RATIO) {
    const cropW = srcH * TARGET_RATIO;
    return { cropX: (srcW - cropW) / 2, cropY: 0, cropW, cropH: srcH };
  }
  const cropH = srcW / TARGET_RATIO;
  return { cropX: 0, cropY: (srcH - cropH) / 2, cropW: srcW, cropH };
}

function sourceSize(source) {
  return {
    w: source.videoWidth || source.naturalWidth || source.width,
    h: source.videoHeight || source.naturalHeight || source.height,
  };
}

// Grabs a still frame from a live <video> into an offscreen canvas so it can
// be composed later, after the camera has switched to the other lens.
export function snapshotFrame(source) {
  const { w, h } = sourceSize(source);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d').drawImage(source, 0, 0, w, h);
  return canvas;
}

// Draws the front-camera inset (BeReal style) in the top-left corner.
function drawInset(ctx, front, outputW, outputH) {
  const { w: fw, h: fh } = sourceSize(front);
  const { cropX, cropY, cropW, cropH } = pickCropRect(fw, fh);

  const insetW = Math.round(outputW * 0.3);
  const insetH = Math.round(insetW / TARGET_RATIO);
  const margin = Math.round(outputW * 0.04);
  const marginTop = Math.round(outputH * 0.035);
  const radius = Math.round(outputW * 0.04);
  const border = Math.max(2, Math.round(outputW * 0.008));
  const x = margin;
  const y = marginTop;

  ctx.save();
  // Drop shadow behind the inset card
  ctx.shadowColor = 'rgba(0,0,0,0.45)';
  ctx.shadowBlur = Math.round(outputW * 0.03);
  ctx.shadowOffsetY = Math.round(outputW * 0.01);
  roundRectPath(ctx, x, y, insetW, insetH, radius);
  ctx.fillStyle = '#000';
  ctx.fill();
  ctx.restore();

  ctx.save();
  // White frame
  roundRectPath(ctx, x, y, insetW, insetH, radius);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = border;
  ctx.stroke();
  // Clip to rounded rect and draw the (cropped) selfie
  roundRectPath(ctx, x, y, insetW, insetH, radius);
  ctx.clip();
  ctx.drawImage(front, cropX, cropY, cropW, cropH, x, y, insetW, insetH);
  ctx.restore();
}

// Composes the BeReal-style photo: back camera as the main frame, front
// camera as a small inset, plus the SANTVS sticker. `front` may be null to
// fall back to a plain single-camera shot.
export async function composeBeRealBlob({ back, front, actTitle, actTime, dayLabel }) {
  const { w: srcW, h: srcH } = sourceSize(back);
  const { cropX, cropY, cropW, cropH } = pickCropRect(srcW, srcH);

  const outputH = Math.min(MAX_OUTPUT_HEIGHT, Math.round(cropH));
  const outputW = Math.round(outputH * TARGET_RATIO);

  const canvas = document.createElement('canvas');
  canvas.width = outputW;
  canvas.height = outputH;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(back, cropX, cropY, cropW, cropH, 0, 0, outputW, outputH);
  if (front) drawInset(ctx, front, outputW, outputH);
  await drawSticker(ctx, { width: outputW, height: outputH, actTitle, actTime, dayLabel });
  return await new Promise(resolve =>
    canvas.toBlob(b => resolve(b), 'image/jpeg', 0.92)
  );
}

// Backwards-compatible single-camera compose (no inset).
export async function composeStickerBlob({ source, actTitle, actTime, dayLabel }) {
  return composeBeRealBlob({ back: source, front: null, actTitle, actTime, dayLabel });
}
