/**
 * Tailwind Exporter
 *
 * Exports theme as Tailwind CSS configuration.
 */

import { oklchToHex } from '../theme-utils';

/**
 * Convert OKLCH color to Tailwind-compatible format
 * @param {string} oklchColor - OKLCH color string
 * @returns {string} Hex color or CSS variable reference
 */
function toTailwindColor(oklchColor) {
  if (!oklchColor || !oklchColor.startsWith('oklch')) {
    return oklchColor;
  }
  // Return the oklch value directly - Tailwind v4 supports oklch
  return oklchColor;
}

/**
 * Export theme as Tailwind configuration
 * @param {Object} theme - Theme state
 * @returns {string} JavaScript configuration string
 */
export function exportAsTailwind(theme) {
  const { colors, ...tokens } = theme;
  const lightColors = colors?.light || {};

  let config = `/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
`;

  // Add paper surfaces
  if (tokens.paperWhite || tokens.paperCream || tokens.paperKraft) {
    config += `        paper: {
          white: 'var(--paper-white)',
          cream: 'var(--paper-cream)',
          kraft: 'var(--paper-kraft)',
        },
`;
  }

  config += `      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        heading: 'var(--font-family-heading)',
        body: 'var(--font-family-body)',
      },
      fontSize: {
        xs: 'var(--font-size-xs)',
        sm: 'var(--font-size-sm)',
        base: 'var(--font-size-base)',
        lg: 'var(--font-size-lg)',
        xl: 'var(--font-size-xl)',
        '2xl': 'var(--font-size-2xl)',
        '3xl': 'var(--font-size-3xl)',
        '4xl': 'var(--font-size-4xl)',
      },
      lineHeight: {
        heading: 'var(--line-height-heading)',
        body: 'var(--line-height-body)',
      },
    },
  },
  plugins: [],
};
`;

  return config;
}

/**
 * Export theme colors as static Tailwind palette
 * (alternative format without CSS variables)
 * @param {Object} theme - Theme state
 * @returns {string} JavaScript configuration string
 */
export function exportAsTailwindStatic(theme) {
  const { colors } = theme;
  const lightColors = colors?.light || {};
  const darkColors = colors?.dark || {};

  const formatColor = (color) => {
    if (color?.startsWith('oklch')) {
      return oklchToHex(color);
    }
    return color;
  };

  let config = `/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode colors (use with light: prefix or default)
        background: '${formatColor(lightColors.background)}',
        foreground: '${formatColor(lightColors.foreground)}',
        primary: {
          DEFAULT: '${formatColor(lightColors.primary)}',
          foreground: '${formatColor(lightColors.primaryForeground)}',
        },
        secondary: {
          DEFAULT: '${formatColor(lightColors.secondary)}',
          foreground: '${formatColor(lightColors.secondaryForeground)}',
        },
        muted: {
          DEFAULT: '${formatColor(lightColors.muted)}',
          foreground: '${formatColor(lightColors.mutedForeground)}',
        },
        accent: {
          DEFAULT: '${formatColor(lightColors.accent)}',
          foreground: '${formatColor(lightColors.accentForeground)}',
        },
        destructive: {
          DEFAULT: '${formatColor(lightColors.destructive)}',
        },
        border: '${formatColor(lightColors.border)}',
        input: '${formatColor(lightColors.input)}',
        ring: '${formatColor(lightColors.ring)}',
      },
    },
  },
  plugins: [],
};
`;

  return config;
}

export default exportAsTailwind;
