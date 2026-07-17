// SVG shapes for the map pins. Each returns markup filling a 40x40 viewBox.
// Polygons use a same-colour stroke with round line joins so the corners are
// rounded (there's no white outline — the fill is the whole pin).

// Rounded-corner polygon: fill + matching stroke with round joins.
function poly(points, color) {
  return `<polygon points="${points}" fill="${color}" stroke="${color}" stroke-width="5" stroke-linejoin="round" />`;
}

const SHAPES = {
  circle: color => `<circle cx="20" cy="20" r="17" fill="${color}" />`,
  square: color => `<rect x="4" y="4" width="32" height="32" rx="10" fill="${color}" />`,
  diamond: color =>
    `<rect x="8" y="8" width="24" height="24" rx="7" fill="${color}" transform="rotate(45 20 20)" />`,
  triangle: color => poly('20,7 34,32 6,32', color),
  pentagon: color => poly('20,5 34.3,15.4 28.8,32.1 11.2,32.1 5.7,15.4', color),
  hexagon: color => poly('34,20 27,32 13,32 6,20 13,8 27,8', color),
  star: color =>
    poly(
      '20,5 23.8,14.9 34.5,15.2 26.1,22.1 29.2,32.5 20,26.4 10.8,32.5 13.9,22.1 5.5,15.2 16.2,14.9',
      color
    ),
};

export function shapeSvg(shape, color) {
  const draw = SHAPES[shape] || SHAPES.circle;
  return `<svg class="santes-pin-shape" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">${draw(color)}</svg>`;
}
