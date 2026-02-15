/**
 * Design Tokens Exporter
 *
 * Exports theme as W3C Design Tokens format.
 * https://design-tokens.github.io/community-group/format/
 */

import { oklchToHex } from '../theme-utils';
import { TYPE_SCALES, LINE_HEIGHTS } from '../typography-config';

/**
 * Export theme as W3C Design Tokens format
 * @param {Object} theme - Theme state
 * @returns {string} JSON string in Design Tokens format
 */
export function exportAsTokens(theme) {
  const { colors, ...tokens } = theme;
  const lightColors = colors?.light || {};
  const darkColors = colors?.dark || {};

  const scale = TYPE_SCALES[tokens.typeScale] || TYPE_SCALES.default;
  const lineHeights = LINE_HEIGHTS[tokens.lineHeightPreset] || LINE_HEIGHTS.normal;

  const designTokens = {
    $schema: 'https://design-tokens.github.io/community-group/format/',

    color: {
      $type: 'color',

      // Light mode
      light: {
        background: { $value: lightColors.background },
        foreground: { $value: lightColors.foreground },
        card: {
          default: { $value: lightColors.card },
          foreground: { $value: lightColors.cardForeground },
        },
        popover: {
          default: { $value: lightColors.popover },
          foreground: { $value: lightColors.popoverForeground },
        },
        primary: {
          default: { $value: lightColors.primary },
          foreground: { $value: lightColors.primaryForeground },
        },
        secondary: {
          default: { $value: lightColors.secondary },
          foreground: { $value: lightColors.secondaryForeground },
        },
        muted: {
          default: { $value: lightColors.muted },
          foreground: { $value: lightColors.mutedForeground },
        },
        accent: {
          default: { $value: lightColors.accent },
          foreground: { $value: lightColors.accentForeground },
        },
        destructive: { $value: lightColors.destructive },
        border: { $value: lightColors.border },
        input: { $value: lightColors.input },
        ring: { $value: lightColors.ring },
      },

      // Dark mode
      dark: {
        background: { $value: darkColors.background },
        foreground: { $value: darkColors.foreground },
        card: {
          default: { $value: darkColors.card },
          foreground: { $value: darkColors.cardForeground },
        },
        popover: {
          default: { $value: darkColors.popover },
          foreground: { $value: darkColors.popoverForeground },
        },
        primary: {
          default: { $value: darkColors.primary },
          foreground: { $value: darkColors.primaryForeground },
        },
        secondary: {
          default: { $value: darkColors.secondary },
          foreground: { $value: darkColors.secondaryForeground },
        },
        muted: {
          default: { $value: darkColors.muted },
          foreground: { $value: darkColors.mutedForeground },
        },
        accent: {
          default: { $value: darkColors.accent },
          foreground: { $value: darkColors.accentForeground },
        },
        destructive: { $value: darkColors.destructive },
        border: { $value: darkColors.border },
        input: { $value: darkColors.input },
        ring: { $value: darkColors.ring },
      },

      // Surfaces
      surface: {
        'paper-white': { $value: tokens.paperWhite },
        'paper-cream': { $value: tokens.paperCream },
        'paper-kraft': { $value: tokens.paperKraft },
      },
    },

    typography: {
      fontFamily: {
        $type: 'fontFamily',
        heading: { $value: tokens.fontHeading || 'system-ui' },
        body: { $value: tokens.fontBody || 'system-ui' },
      },

      fontWeight: {
        $type: 'fontWeight',
        heading: { $value: tokens.fontWeightHeading || 600 },
        body: { $value: tokens.fontWeightBody || 400 },
      },

      fontSize: {
        $type: 'dimension',
        base: { $value: `${scale.baseFontSize}px` },
        xs: { $value: `${(scale.baseFontSize / scale.ratio / scale.ratio).toFixed(2)}px` },
        sm: { $value: `${(scale.baseFontSize / scale.ratio).toFixed(2)}px` },
        lg: { $value: `${(scale.baseFontSize * scale.ratio).toFixed(2)}px` },
        xl: { $value: `${(scale.baseFontSize * scale.ratio * scale.ratio).toFixed(2)}px` },
        '2xl': { $value: `${(scale.baseFontSize * Math.pow(scale.ratio, 3)).toFixed(2)}px` },
        '3xl': { $value: `${(scale.baseFontSize * Math.pow(scale.ratio, 4)).toFixed(2)}px` },
        '4xl': { $value: `${(scale.baseFontSize * Math.pow(scale.ratio, 5)).toFixed(2)}px` },
      },

      lineHeight: {
        $type: 'number',
        heading: { $value: lineHeights.heading },
        body: { $value: lineHeights.body },
      },

      typeScale: {
        $type: 'number',
        ratio: { $value: scale.ratio },
      },
    },

    spacing: {
      $type: 'dimension',
      radius: { $value: `${tokens.radius || 0.625}rem` },
    },

    opacity: {
      $type: 'number',
      'texture-faint': { $value: tokens.textureOpacityFaint || 0.04 },
    },
  };

  return JSON.stringify(designTokens, null, 2);
}

export default exportAsTokens;
