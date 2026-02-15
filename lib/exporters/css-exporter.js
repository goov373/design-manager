/**
 * CSS Exporter
 *
 * Exports theme as CSS custom properties.
 */

import { getCSSVarName } from '../constants';
import { generateGoogleFontsImport, getFontFamily } from '../theme-utils';
import { TYPE_SCALES, LINE_HEIGHTS } from '../typography-config';

/**
 * Export theme as CSS custom properties
 * @param {Object} theme - Theme state
 * @returns {string} CSS string
 */
export function exportAsCSS(theme) {
  const { colors, darkMode, ...tokens } = theme;
  const lightColors = colors?.light || {};
  const darkColors = colors?.dark || {};

  let css = '';

  // Google Fonts import
  const googleImport = generateGoogleFontsImport(tokens);
  if (googleImport) {
    css += `/* Google Fonts */\n${googleImport}\n\n`;
  }

  // Light mode variables
  css += ':root {\n';
  css += '  /* Colors - Light Mode */\n';

  Object.entries(lightColors).forEach(([key, value]) => {
    const varName = getCSSVarName(key);
    css += `  --${varName}: ${value};\n`;
  });

  css += '\n';

  // Typography
  css += '  /* Typography */\n';
  const headingFamily = getFontFamily(tokens.fontHeading || 'system-ui');
  const bodyFamily = getFontFamily(tokens.fontBody || 'system-ui');
  const scale = TYPE_SCALES[tokens.typeScale] || TYPE_SCALES.default;
  const lineHeights = LINE_HEIGHTS[tokens.lineHeightPreset] || LINE_HEIGHTS.normal;

  css += `  --font-family-heading: ${headingFamily};\n`;
  css += `  --font-family-body: ${bodyFamily};\n`;
  css += `  --font-weight-heading: ${tokens.fontWeightHeading || 600};\n`;
  css += `  --font-weight-body: ${tokens.fontWeightBody || 400};\n`;
  css += `  --font-size-base: ${scale.baseFontSize}px;\n`;
  css += `  --type-scale-ratio: ${scale.ratio};\n`;
  css += `  --line-height-heading: ${lineHeights.heading};\n`;
  css += `  --line-height-body: ${lineHeights.body};\n`;

  css += '\n';

  // Computed font sizes
  const ratio = scale.ratio;
  const base = scale.baseFontSize;

  css += '  /* Computed Font Sizes */\n';
  css += `  --font-size-xs: ${(base / ratio / ratio).toFixed(2)}px;\n`;
  css += `  --font-size-sm: ${(base / ratio).toFixed(2)}px;\n`;
  css += `  --font-size-lg: ${(base * ratio).toFixed(2)}px;\n`;
  css += `  --font-size-xl: ${(base * ratio * ratio).toFixed(2)}px;\n`;
  css += `  --font-size-2xl: ${(base * ratio * ratio * ratio).toFixed(2)}px;\n`;
  css += `  --font-size-3xl: ${(base * ratio * ratio * ratio * ratio).toFixed(2)}px;\n`;
  css += `  --font-size-4xl: ${(base * ratio * ratio * ratio * ratio * ratio).toFixed(2)}px;\n`;

  css += '\n';

  // Surfaces
  css += '  /* Surfaces */\n';
  if (tokens.paperWhite) css += `  --paper-white: ${tokens.paperWhite};\n`;
  if (tokens.paperCream) css += `  --paper-cream: ${tokens.paperCream};\n`;
  if (tokens.paperKraft) css += `  --paper-kraft: ${tokens.paperKraft};\n`;

  css += '\n';

  // Design tokens
  css += '  /* Design Tokens */\n';
  if (tokens.radius !== undefined) css += `  --radius: ${tokens.radius}rem;\n`;
  if (tokens.textureOpacityFaint !== undefined) {
    css += `  --texture-opacity-faint: ${tokens.textureOpacityFaint};\n`;
  }

  css += '}\n\n';

  // Dark mode variables
  css += '.dark {\n';
  css += '  /* Colors - Dark Mode */\n';

  Object.entries(darkColors).forEach(([key, value]) => {
    const varName = getCSSVarName(key);
    css += `  --${varName}: ${value};\n`;
  });

  css += '}\n';

  return css;
}

export default exportAsCSS;
