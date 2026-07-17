// Day/night theming for Les Santes.
// "Day" (light theme) runs 07:00–20:59 local time; the rest is "night" (dark).
// The map, chrome and gallery follow this; the camera stays dark on purpose.

const DAY_START = 7; // inclusive
const DAY_END = 21; // exclusive

export function isDaytime(date = new Date()) {
  const h = date.getHours();
  return h >= DAY_START && h < DAY_END;
}

// 'light' during the day, 'dark' at night.
export function currentTheme(date = new Date()) {
  return isDaytime(date) ? 'light' : 'dark';
}

// Meta theme-color that matches the body background per theme.
export const THEME_COLOR = {
  light: '#fafafa',
  dark: '#0a0a0a',
};
