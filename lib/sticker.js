// Composes the SANTVS sticker onto a captured frame.
// Draws the video source and paints the logo + act info in the bottom-left.

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

// Draws the sticker onto the given canvas context.
export async function drawSticker(ctx, { width, height, actTitle, actTime }) {
  const base = Math.min(width, height);
  const pad = Math.round(base * 0.045);
  const logoHeight = Math.round(base * 0.09);
  const labelPx = Math.round(base * 0.028);
  const valuePx = Math.round(base * 0.04);
  const rowGap = Math.round(base * 0.012);
  const labelValueGap = Math.round(base * 0.008);

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.65)';
  ctx.shadowBlur = Math.round(base * 0.012);
  ctx.shadowOffsetY = Math.round(base * 0.004);
  ctx.fillStyle = '#ffffff';
  ctx.textBaseline = 'alphabetic';

  const x = pad;
  const y = height - pad;

  // Bottom row: "Acte: <title>" and "Hora: <time>"
  ctx.font = `600 ${labelPx}px system-ui, sans-serif`;
  ctx.fillText('Acte:', x, y - valuePx - labelValueGap);
  ctx.font = `700 ${valuePx}px system-ui, sans-serif`;
  ctx.fillText(truncate(actTitle || 'Les Santes', 26), x, y);

  const horaX = Math.round(width * 0.55);
  ctx.font = `600 ${labelPx}px system-ui, sans-serif`;
  ctx.fillText('Hora:', horaX, y - valuePx - labelValueGap);
  ctx.font = `700 ${valuePx}px system-ui, sans-serif`;
  ctx.fillText(actTime || '--:--:--', horaX, y);

  // Logo sits above the info block
  try {
    const logo = await loadLogo();
    const naturalW = logo.naturalWidth || logo.width || 1091;
    const naturalH = logo.naturalHeight || logo.height || 327;
    const logoWidth = Math.round((logoHeight * naturalW) / naturalH);
    const logoY = y - valuePx - labelValueGap - labelPx - rowGap - logoHeight;
    ctx.drawImage(logo, x, logoY, logoWidth, logoHeight);
  } catch {
    // fall back to plain text if the SVG doesn't load
    ctx.font = `700 ${logoHeight}px system-ui, sans-serif`;
    ctx.fillText(
      'SANTVS',
      x,
      y - valuePx - labelValueGap - labelPx - rowGap
    );
  }

  ctx.restore();
}

// Composes video frame + sticker into an offscreen canvas and returns a Blob.
export async function composeStickerBlob({ source, actTitle, actTime }) {
  const width = source.videoWidth || source.naturalWidth || source.width;
  const height = source.videoHeight || source.naturalHeight || source.height;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(source, 0, 0, width, height);
  await drawSticker(ctx, { width, height, actTitle, actTime });
  return await new Promise(resolve =>
    canvas.toBlob(b => resolve(b), 'image/jpeg', 0.92)
  );
}
