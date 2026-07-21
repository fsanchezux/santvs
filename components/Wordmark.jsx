// Renders the SANTVS logo. Default = the horizontal SVG in public/.
// `variant="text"` falls back to an Archivo Black wordmark for tight spots
// (e.g. the round shutter button on the bottom nav) where the horizontal
// logo doesn't breathe.
const HEIGHTS = {
  sm: 18,
  md: 26,
  lg: 40,
  xl: 64,
};

export default function Wordmark({
  className = '',
  size = 'md',
  variant = 'logo',
}) {
  if (variant === 'text') {
    const textSizes = {
      sm: 'text-lg',
      md: 'text-2xl',
      lg: 'text-4xl',
      xl: 'text-6xl',
    };
    return (
      <span
        className={`wordmark inline-block font-[family-name:var(--font-wordmark)] ${textSizes[size]} ${className}`}
      >
        SANTVS
      </span>
    );
  }

  const h = typeof size === 'number' ? size : (HEIGHTS[size] ?? HEIGHTS.md);
  return (
    <img
      src="/logo-santvs.svg"
      alt="SANTVS"
      height={h}
      style={{ height: `${h}px`, width: 'auto' }}
      className={`wordmark-logo ${className}`}
    />
  );
}
