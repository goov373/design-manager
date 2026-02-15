/**
 * Design Tokens Exporter
 *
 * Exports theme as W3C Design Tokens format.
 * https://design-tokens.github.io/community-group/format/
 */

import { oklchToHex } from '../theme-utils';
import { TYPE_SCALES, LINE_HEIGHTS } from '../typography-config';
import { getTokenMetadata } from '../constants';

/**
 * Build a token object with optional description from metadata
 * @param {string} value - Token value
 * @param {string} tokenKey - Token key for metadata lookup
 * @returns {Object} Token object with $value and optional $description
 */
function buildToken(value, tokenKey) {
  const meta = getTokenMetadata(tokenKey);
  const token = { $value: value };

  if (meta.usage) {
    token.$description = meta.usage;
  }

  return token;
}

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
        background: buildToken(lightColors.background, 'background'),
        foreground: buildToken(lightColors.foreground, 'foreground'),
        card: {
          default: buildToken(lightColors.card, 'card'),
          foreground: buildToken(lightColors.cardForeground, 'cardForeground'),
        },
        popover: {
          default: buildToken(lightColors.popover, 'popover'),
          foreground: buildToken(lightColors.popoverForeground, 'popoverForeground'),
        },
        primary: {
          default: buildToken(lightColors.primary, 'primary'),
          foreground: buildToken(lightColors.primaryForeground, 'primaryForeground'),
        },
        secondary: {
          default: buildToken(lightColors.secondary, 'secondary'),
          foreground: buildToken(lightColors.secondaryForeground, 'secondaryForeground'),
        },
        muted: {
          default: buildToken(lightColors.muted, 'muted'),
          foreground: buildToken(lightColors.mutedForeground, 'mutedForeground'),
        },
        accent: {
          default: buildToken(lightColors.accent, 'accent'),
          foreground: buildToken(lightColors.accentForeground, 'accentForeground'),
        },
        destructive: buildToken(lightColors.destructive, 'destructive'),
        border: buildToken(lightColors.border, 'border'),
        input: buildToken(lightColors.input, 'input'),
        ring: buildToken(lightColors.ring, 'ring'),
      },

      // Dark mode
      dark: {
        background: buildToken(darkColors.background, 'background'),
        foreground: buildToken(darkColors.foreground, 'foreground'),
        card: {
          default: buildToken(darkColors.card, 'card'),
          foreground: buildToken(darkColors.cardForeground, 'cardForeground'),
        },
        popover: {
          default: buildToken(darkColors.popover, 'popover'),
          foreground: buildToken(darkColors.popoverForeground, 'popoverForeground'),
        },
        primary: {
          default: buildToken(darkColors.primary, 'primary'),
          foreground: buildToken(darkColors.primaryForeground, 'primaryForeground'),
        },
        secondary: {
          default: buildToken(darkColors.secondary, 'secondary'),
          foreground: buildToken(darkColors.secondaryForeground, 'secondaryForeground'),
        },
        muted: {
          default: buildToken(darkColors.muted, 'muted'),
          foreground: buildToken(darkColors.mutedForeground, 'mutedForeground'),
        },
        accent: {
          default: buildToken(darkColors.accent, 'accent'),
          foreground: buildToken(darkColors.accentForeground, 'accentForeground'),
        },
        destructive: buildToken(darkColors.destructive, 'destructive'),
        border: buildToken(darkColors.border, 'border'),
        input: buildToken(darkColors.input, 'input'),
        ring: buildToken(darkColors.ring, 'ring'),
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
        heading: {
          $value: tokens.fontHeading || 'system-ui',
          $description: 'Font for headings, titles, and display text',
        },
        body: {
          $value: tokens.fontBody || 'system-ui',
          $description: 'Font for body text, paragraphs, and UI elements',
        },
      },

      fontWeight: {
        $type: 'fontWeight',
        heading: {
          $value: tokens.fontWeightHeading || 600,
          $description: 'Weight for heading text',
        },
        body: {
          $value: tokens.fontWeightBody || 400,
          $description: 'Weight for body text',
        },
      },

      fontSize: {
        $type: 'dimension',
        base: {
          $value: `${scale.baseFontSize}px`,
          $description: 'Base font size for body text',
        },
        xs: {
          $value: `${(scale.baseFontSize / scale.ratio / scale.ratio).toFixed(2)}px`,
          $description: 'Extra small text, captions',
        },
        sm: {
          $value: `${(scale.baseFontSize / scale.ratio).toFixed(2)}px`,
          $description: 'Small text, labels',
        },
        lg: {
          $value: `${(scale.baseFontSize * scale.ratio).toFixed(2)}px`,
          $description: 'Large text, subheadings',
        },
        xl: {
          $value: `${(scale.baseFontSize * scale.ratio * scale.ratio).toFixed(2)}px`,
          $description: 'H3 headings',
        },
        '2xl': {
          $value: `${(scale.baseFontSize * Math.pow(scale.ratio, 3)).toFixed(2)}px`,
          $description: 'H2 headings',
        },
        '3xl': {
          $value: `${(scale.baseFontSize * Math.pow(scale.ratio, 4)).toFixed(2)}px`,
          $description: 'H1 headings',
        },
        '4xl': {
          $value: `${(scale.baseFontSize * Math.pow(scale.ratio, 5)).toFixed(2)}px`,
          $description: 'Display text, hero headings',
        },
      },

      lineHeight: {
        $type: 'number',
        heading: {
          $value: lineHeights.heading,
          $description: 'Line height for headings (tighter)',
        },
        body: {
          $value: lineHeights.body,
          $description: 'Line height for body text (readable)',
        },
      },

      typeScale: {
        $type: 'number',
        ratio: {
          $value: scale.ratio,
          $description: 'Multiplier between font size steps',
        },
      },
    },

    spacing: {
      $type: 'dimension',
      radius: {
        $value: `${tokens.radius || 0.625}rem`,
        $description: 'Border radius for cards, buttons, and inputs',
      },
    },

    opacity: {
      $type: 'number',
      'texture-faint': { $value: tokens.textureOpacityFaint || 0.04 },
    },
  };

  return JSON.stringify(designTokens, null, 2);
}

export default exportAsTokens;
