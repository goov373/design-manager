/**
 * Color Utilities
 *
 * Advanced color manipulation using the culori library.
 * Provides OKLCH conversion, manipulation, and analysis functions.
 */

import { oklch, formatHex, parse, converter } from 'culori';

// Converters
const toOklch = converter('oklch');
const toRgb = converter('rgb');

/**
 * Parse any color format to OKLCH
 * @param {string} color - Color in any format (hex, rgb, oklch, etc.)
 * @returns {Object|null} OKLCH color object or null if invalid
 */
export function parseToOklch(color) {
  try {
    if (!color) return null;

    // If already in oklch format string, parse it
    if (typeof color === 'string' && color.startsWith('oklch')) {
      const match = color.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
      if (match) {
        return {
          mode: 'oklch',
          l: parseFloat(match[1]),
          c: parseFloat(match[2]),
          h: parseFloat(match[3]),
        };
      }
    }

    const parsed = parse(color);
    if (!parsed) return null;

    return toOklch(parsed);
  } catch (e) {
    console.warn('Failed to parse color:', color, e);
    return null;
  }
}

/**
 * Convert any color to OKLCH string
 * @param {string} color - Color in any format
 * @returns {string} OKLCH string or original color if conversion fails
 */
export function toOklchString(color) {
  const oklchColor = parseToOklch(color);
  if (!oklchColor) return color;

  const l = (oklchColor.l || 0).toFixed(4);
  const c = (oklchColor.c || 0).toFixed(4);
  const h = (oklchColor.h || 0).toFixed(4);

  return `oklch(${l} ${c} ${h})`;
}

/**
 * Convert any color to hex
 * @param {string} color - Color in any format
 * @returns {string} Hex color string
 */
export function toHexString(color) {
  try {
    const parsed = parseToOklch(color);
    if (!parsed) return '#888888';

    const rgb = toRgb(parsed);
    return formatHex(rgb) || '#888888';
  } catch (e) {
    return '#888888';
  }
}

/**
 * Adjust lightness of an OKLCH color
 * @param {string} color - OKLCH color string
 * @param {number} amount - Amount to adjust (-1 to 1)
 * @returns {string} Adjusted OKLCH color string
 */
export function adjustLightness(color, amount) {
  const oklchColor = parseToOklch(color);
  if (!oklchColor) return color;

  const newL = Math.max(0, Math.min(1, (oklchColor.l || 0) + amount));
  return `oklch(${newL.toFixed(4)} ${(oklchColor.c || 0).toFixed(4)} ${(oklchColor.h || 0).toFixed(4)})`;
}

/**
 * Adjust chroma (saturation) of an OKLCH color
 * @param {string} color - OKLCH color string
 * @param {number} amount - Amount to adjust (-0.4 to 0.4)
 * @returns {string} Adjusted OKLCH color string
 */
export function adjustChroma(color, amount) {
  const oklchColor = parseToOklch(color);
  if (!oklchColor) return color;

  const newC = Math.max(0, Math.min(0.4, (oklchColor.c || 0) + amount));
  return `oklch(${(oklchColor.l || 0).toFixed(4)} ${newC.toFixed(4)} ${(oklchColor.h || 0).toFixed(4)})`;
}

/**
 * Shift hue of an OKLCH color
 * @param {string} color - OKLCH color string
 * @param {number} degrees - Degrees to shift
 * @returns {string} Shifted OKLCH color string
 */
export function shiftHue(color, degrees) {
  const oklchColor = parseToOklch(color);
  if (!oklchColor) return color;

  let newH = ((oklchColor.h || 0) + degrees) % 360;
  if (newH < 0) newH += 360;

  return `oklch(${(oklchColor.l || 0).toFixed(4)} ${(oklchColor.c || 0).toFixed(4)} ${newH.toFixed(4)})`;
}

/**
 * Generate a color palette from a base color
 * @param {string} baseColor - Base OKLCH color string
 * @param {number} count - Number of colors to generate
 * @returns {string[]} Array of OKLCH color strings
 */
export function generatePalette(baseColor, count = 5) {
  const oklchColor = parseToOklch(baseColor);
  if (!oklchColor) return [baseColor];

  const palette = [];
  const hueStep = 360 / count;

  for (let i = 0; i < count; i++) {
    const h = ((oklchColor.h || 0) + i * hueStep) % 360;
    palette.push(`oklch(${(oklchColor.l || 0).toFixed(4)} ${(oklchColor.c || 0).toFixed(4)} ${h.toFixed(4)})`);
  }

  return palette;
}

/**
 * Generate complementary colors
 * @param {string} color - Base OKLCH color string
 * @returns {Object} Object with complementary, triadic, and analogous colors
 */
export function generateHarmony(color) {
  const oklchColor = parseToOklch(color);
  if (!oklchColor) {
    return {
      complementary: color,
      triadic: [color, color],
      analogous: [color, color],
      splitComplementary: [color, color],
    };
  }

  const h = oklchColor.h || 0;
  const l = oklchColor.l || 0;
  const c = oklchColor.c || 0;

  const formatOklch = (hue) =>
    `oklch(${l.toFixed(4)} ${c.toFixed(4)} ${((hue % 360) + 360) % 360})`;

  return {
    complementary: formatOklch(h + 180),
    triadic: [formatOklch(h + 120), formatOklch(h + 240)],
    analogous: [formatOklch(h - 30), formatOklch(h + 30)],
    splitComplementary: [formatOklch(h + 150), formatOklch(h + 210)],
  };
}

/**
 * Mix two colors
 * @param {string} color1 - First OKLCH color string
 * @param {string} color2 - Second OKLCH color string
 * @param {number} ratio - Mix ratio (0 = color1, 1 = color2)
 * @returns {string} Mixed OKLCH color string
 */
export function mixColors(color1, color2, ratio = 0.5) {
  const c1 = parseToOklch(color1);
  const c2 = parseToOklch(color2);

  if (!c1 || !c2) return color1;

  const l = (c1.l || 0) * (1 - ratio) + (c2.l || 0) * ratio;
  const c = (c1.c || 0) * (1 - ratio) + (c2.c || 0) * ratio;

  // Handle hue interpolation (shortest path)
  let h1 = c1.h || 0;
  let h2 = c2.h || 0;
  let diff = h2 - h1;

  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;

  let h = h1 + diff * ratio;
  if (h < 0) h += 360;
  if (h >= 360) h -= 360;

  return `oklch(${l.toFixed(4)} ${c.toFixed(4)} ${h.toFixed(4)})`;
}

/**
 * Get relative luminance of a color (for contrast calculations)
 * @param {string} color - Color in any format
 * @returns {number} Relative luminance (0-1)
 */
export function getRelativeLuminance(color) {
  const rgb = toRgb(parseToOklch(color));
  if (!rgb) return 0;

  const { r = 0, g = 0, b = 0 } = rgb;

  const toLinear = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));

  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);

  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

/**
 * Check if a color is considered "light"
 * @param {string} color - Color in any format
 * @returns {boolean} True if color is light
 */
export function isLightColor(color) {
  const oklchColor = parseToOklch(color);
  if (!oklchColor) return true;

  return (oklchColor.l || 0) > 0.6;
}

/**
 * Get a contrasting text color (black or white)
 * @param {string} backgroundColor - Background color
 * @returns {string} 'black' or 'white'
 */
export function getContrastingTextColor(backgroundColor) {
  return isLightColor(backgroundColor) ? 'black' : 'white';
}

export default {
  parseToOklch,
  toOklchString,
  toHexString,
  adjustLightness,
  adjustChroma,
  shiftHue,
  generatePalette,
  generateHarmony,
  mixColors,
  getRelativeLuminance,
  isLightColor,
  getContrastingTextColor,
};
