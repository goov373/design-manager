/**
 * Theme Utilities
 *
 * CSS variable management and color conversion utilities.
 * Adapted for the standalone Design Manager package.
 */

import { FONT_CATALOG, TYPE_SCALES, LINE_HEIGHTS } from './typography-config';
import { DEFAULT_THEME, DEFAULT_STORAGE_KEY, DEFAULT_PRESETS_KEY } from './constants';

/**
 * Set a CSS custom property on :root
 */
export function setCSSVariable(name, value) {
  document.documentElement.style.setProperty(name, value);
}

/**
 * Get a CSS custom property value from :root
 */
export function getCSSVariable(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/**
 * Apply theme state to DOM via CSS custom properties
 */
export function applyThemeToDOM(themeState) {
  // Dark mode
  if (themeState.darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // Paper surfaces
  if (themeState.paperWhite) {
    setCSSVariable('--paper-white', themeState.paperWhite);
  }
  if (themeState.paperCream) {
    setCSSVariable('--paper-cream', themeState.paperCream);
  }
  if (themeState.paperKraft) {
    setCSSVariable('--paper-kraft', themeState.paperKraft);
  }

  // Radius
  if (themeState.radius !== undefined) {
    setCSSVariable('--radius', `${themeState.radius}rem`);
  }

  // Texture opacity
  if (themeState.textureOpacityFaint !== undefined) {
    setCSSVariable('--texture-opacity-faint', themeState.textureOpacityFaint);
  }

  // Typography
  applyTypographyToDOM(themeState);
}

// Track which fonts have been loaded to avoid duplicate requests
const loadedFonts = new Set();

/**
 * Load a Google Font dynamically
 * @param {string} fontId - The font ID from FONT_CATALOG
 * @returns {boolean} Whether the font was loaded (or already loaded)
 */
export function loadGoogleFont(fontId) {
  const font = FONT_CATALOG[fontId];
  if (!font?.googleFont) return false;

  // Already loaded
  if (loadedFonts.has(fontId)) return true;

  // Create and append the link element
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${font.googleFont}&display=swap`;
  document.head.appendChild(link);

  loadedFonts.add(fontId);
  return true;
}

/**
 * Get the CSS font-family value for a font ID
 * @param {string} fontId - The font ID from FONT_CATALOG
 * @returns {string} CSS font-family value
 */
export function getFontFamily(fontId) {
  const font = FONT_CATALOG[fontId];
  if (!font) return 'system-ui, sans-serif';

  if (fontId === 'system-ui') {
    return font.fallback;
  }

  return `"${font.name}", ${font.fallback}`;
}

/**
 * Apply typography state to DOM via CSS custom properties
 * @param {Object} themeState - The theme state containing typography settings
 */
export function applyTypographyToDOM(themeState) {
  const {
    fontHeading = 'system-ui',
    fontBody = 'system-ui',
    fontWeightHeading = 600,
    fontWeightBody = 400,
    typeScale = 'default',
    lineHeightPreset = 'normal',
  } = themeState;

  // Load fonts if needed
  loadGoogleFont(fontHeading);
  loadGoogleFont(fontBody);

  // Get font families
  const headingFamily = getFontFamily(fontHeading);
  const bodyFamily = getFontFamily(fontBody);

  // Get type scale values
  const scale = TYPE_SCALES[typeScale] || TYPE_SCALES.default;

  // Get line height values
  const lineHeights = LINE_HEIGHTS[lineHeightPreset] || LINE_HEIGHTS.normal;

  // Apply CSS custom properties
  setCSSVariable('--font-family-heading', headingFamily);
  setCSSVariable('--font-family-body', bodyFamily);
  setCSSVariable('--font-weight-heading', fontWeightHeading);
  setCSSVariable('--font-weight-body', fontWeightBody);
  setCSSVariable('--font-size-base', `${scale.baseFontSize}px`);
  setCSSVariable('--type-scale-ratio', scale.ratio);
  setCSSVariable('--line-height-heading', lineHeights.heading);
  setCSSVariable('--line-height-body', lineHeights.body);

  // Compute and set derived font sizes
  const ratio = scale.ratio;
  const base = scale.baseFontSize;

  // Font size variables
  const sizeXs = `${(base / ratio / ratio).toFixed(2)}px`;
  const sizeSm = `${(base / ratio).toFixed(2)}px`;
  const sizeBase = `${base}px`;
  const sizeLg = `${(base * ratio).toFixed(2)}px`;
  const sizeXl = `${(base * ratio * ratio).toFixed(2)}px`;
  const size2xl = `${(base * ratio * ratio * ratio).toFixed(2)}px`;
  const size3xl = `${(base * ratio * ratio * ratio * ratio).toFixed(2)}px`;
  const size4xl = `${(base * ratio * ratio * ratio * ratio * ratio).toFixed(2)}px`;

  // Set --font-size-* variables
  setCSSVariable('--font-size-xs', sizeXs);
  setCSSVariable('--font-size-sm', sizeSm);
  setCSSVariable('--font-size-lg', sizeLg);
  setCSSVariable('--font-size-xl', sizeXl);
  setCSSVariable('--font-size-2xl', size2xl);
  setCSSVariable('--font-size-3xl', size3xl);
  setCSSVariable('--font-size-4xl', size4xl);

  // Set --text-* variables (Tailwind naming)
  setCSSVariable('--text-xs', sizeXs);
  setCSSVariable('--text-sm', sizeSm);
  setCSSVariable('--text-base', sizeBase);
  setCSSVariable('--text-lg', sizeLg);
  setCSSVariable('--text-xl', sizeXl);
  setCSSVariable('--text-2xl', size2xl);
  setCSSVariable('--text-3xl', size3xl);
  setCSSVariable('--text-4xl', size4xl);

  // Set line height utilities
  setCSSVariable('--leading-heading', lineHeights.heading);
  setCSSVariable('--leading-body', lineHeights.body);
}

/**
 * Generate Google Fonts import URL for typography state
 * @param {Object} themeState - The theme state
 * @returns {string|null} Google Fonts import URL or null if using system fonts
 */
export function generateGoogleFontsImport(themeState) {
  const { fontHeading = 'system-ui', fontBody = 'system-ui' } = themeState;
  const fonts = [];

  const headingFont = FONT_CATALOG[fontHeading];
  const bodyFont = FONT_CATALOG[fontBody];

  if (headingFont?.googleFont) {
    fonts.push(headingFont.googleFont);
  }

  if (bodyFont?.googleFont && bodyFont.googleFont !== headingFont?.googleFont) {
    fonts.push(bodyFont.googleFont);
  }

  if (fonts.length === 0) return null;

  return `@import url('https://fonts.googleapis.com/css2?${fonts.map((f) => `family=${f}`).join('&')}&display=swap');`;
}

/**
 * Export typography as CSS
 * @param {Object} themeState - The theme state
 * @returns {string} CSS string with typography variables
 */
export function exportTypographyAsCSS(themeState) {
  const {
    fontHeading = 'system-ui',
    fontBody = 'system-ui',
    fontWeightHeading = 600,
    fontWeightBody = 400,
    typeScale = 'default',
    lineHeightPreset = 'normal',
  } = themeState;

  const headingFamily = getFontFamily(fontHeading);
  const bodyFamily = getFontFamily(fontBody);
  const scale = TYPE_SCALES[typeScale] || TYPE_SCALES.default;
  const lineHeights = LINE_HEIGHTS[lineHeightPreset] || LINE_HEIGHTS.normal;

  const ratio = scale.ratio;
  const base = scale.baseFontSize;

  const googleImport = generateGoogleFontsImport(themeState);

  let css = '';

  if (googleImport) {
    css += `/* Google Fonts */\n${googleImport}\n\n`;
  }

  css += `:root {
  /* Typography */
  --font-family-heading: ${headingFamily};
  --font-family-body: ${bodyFamily};
  --font-weight-heading: ${fontWeightHeading};
  --font-weight-body: ${fontWeightBody};
  --font-size-base: ${base}px;
  --type-scale-ratio: ${ratio};
  --line-height-heading: ${lineHeights.heading};
  --line-height-body: ${lineHeights.body};

  /* Computed Sizes */
  --font-size-xs: ${(base / ratio / ratio).toFixed(2)}px;
  --font-size-sm: ${(base / ratio).toFixed(2)}px;
  --font-size-lg: ${(base * ratio).toFixed(2)}px;
  --font-size-xl: ${(base * ratio * ratio).toFixed(2)}px;
  --font-size-2xl: ${(base * ratio * ratio * ratio).toFixed(2)}px;
  --font-size-3xl: ${(base * ratio * ratio * ratio * ratio).toFixed(2)}px;
  --font-size-4xl: ${(base * ratio * ratio * ratio * ratio * ratio).toFixed(2)}px;
}`;

  return css;
}

/**
 * Get default theme values
 */
export function getDefaultTheme() {
  return { ...DEFAULT_THEME };
}

/**
 * Convert hex color to oklch (approximate)
 * Note: For production, consider using culori library for accuracy
 */
export function hexToOklch(hex) {
  // Remove # if present
  hex = hex.replace(/^#/, '');

  // Parse RGB values
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  // Convert to linear RGB
  const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);

  // Convert to XYZ (D65)
  const x = 0.4124564 * lr + 0.3575761 * lg + 0.1804375 * lb;
  const y = 0.2126729 * lr + 0.7151522 * lg + 0.072175 * lb;
  const z = 0.0193339 * lr + 0.119192 * lg + 0.9503041 * lb;

  // Convert to Lab
  const xn = 0.95047;
  const yn = 1.0;
  const zn = 1.08883;

  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);

  const L = 116 * f(y / yn) - 16;
  const a = 500 * (f(x / xn) - f(y / yn));
  const bVal = 200 * (f(y / yn) - f(z / zn));

  // Convert Lab to oklch (approximate)
  const C = Math.sqrt(a * a + bVal * bVal);
  let H = Math.atan2(bVal, a) * (180 / Math.PI);
  if (H < 0) H += 360;

  // Normalize L to 0-1 range for oklch
  const oklchL = L / 100;

  return `oklch(${oklchL.toFixed(3)} ${(C / 100).toFixed(3)} ${H.toFixed(0)})`;
}

/**
 * Convert oklch to hex (approximate)
 */
export function oklchToHex(oklchStr) {
  // Parse oklch string: oklch(L C H) or oklch(L C H / alpha)
  const match = oklchStr.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
  if (!match) return '#888888';

  const L = parseFloat(match[1]) * 100; // Scale back to 0-100
  const C = parseFloat(match[2]) * 100;
  const H = parseFloat(match[3]);

  // Convert to Lab
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  // Convert Lab to XYZ
  const xn = 0.95047;
  const yn = 1.0;
  const zn = 1.08883;

  const fy = (L + 16) / 116;
  const fx = a / 500 + fy;
  const fz = fy - b / 200;

  const f3 = (t) => (t > 0.206893 ? t * t * t : (t - 16 / 116) / 7.787);

  const x = xn * f3(fx);
  const y = yn * f3(fy);
  const z = zn * f3(fz);

  // Convert XYZ to linear RGB
  let lr = 3.2404542 * x - 1.5371385 * y - 0.4985314 * z;
  let lg = -0.969266 * x + 1.8760108 * y + 0.041556 * z;
  let lb = 0.0556434 * x - 0.2040259 * y + 1.0572252 * z;

  // Convert to sRGB
  const toSRGB = (c) =>
    c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;

  const rVal = Math.round(Math.max(0, Math.min(1, toSRGB(lr))) * 255);
  const gVal = Math.round(Math.max(0, Math.min(1, toSRGB(lg))) * 255);
  const bComp = Math.round(Math.max(0, Math.min(1, toSRGB(lb))) * 255);

  return `#${rVal.toString(16).padStart(2, '0')}${gVal.toString(16).padStart(2, '0')}${bComp.toString(16).padStart(2, '0')}`;
}

/**
 * Load theme from localStorage
 * @param {string} storageKey - The localStorage key to use
 */
export function loadThemeFromStorage(storageKey = DEFAULT_STORAGE_KEY) {
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      return { ...DEFAULT_THEME, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.warn('Failed to load theme from storage:', e);
  }
  return getDefaultTheme();
}

/**
 * Save theme to localStorage
 * @param {Object} themeState - The theme state to save
 * @param {string} storageKey - The localStorage key to use
 */
export function saveThemeToStorage(themeState, storageKey = DEFAULT_STORAGE_KEY) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(themeState));
  } catch (e) {
    console.warn('Failed to save theme to storage:', e);
  }
}

/**
 * Load presets from localStorage
 * @param {string} presetsKey - The localStorage key to use
 */
export function loadPresetsFromStorage(presetsKey = DEFAULT_PRESETS_KEY) {
  try {
    const stored = localStorage.getItem(presetsKey);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to load presets from storage:', e);
  }
  return [];
}

/**
 * Save presets to localStorage
 * @param {Array} presets - The presets array to save
 * @param {string} presetsKey - The localStorage key to use
 */
export function savePresetsToStorage(presets, presetsKey = DEFAULT_PRESETS_KEY) {
  try {
    localStorage.setItem(presetsKey, JSON.stringify(presets));
  } catch (e) {
    console.warn('Failed to save presets to storage:', e);
  }
}
