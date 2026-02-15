/**
 * AI Copy Utilities
 *
 * Formats Design Manager tool outputs for AI consumption.
 * Adds context that helps AI tools generate consistent code.
 *
 * @module ai-copy-utils
 */

/**
 * Formats a contrast fix recommendation as AI-readable Markdown.
 * Includes the issue description, fix, and implementation guidance.
 *
 * @param {Object} data - Contrast fix data from the contrast checker tool
 * @param {string} data.original - Original color value that failed contrast check
 * @param {string} data.fixed - Adjusted color value that passes contrast requirements
 * @param {string} data.background - Background color used in the contrast check
 * @param {string} data.ratio - Contrast ratio achieved (e.g., '4.5')
 * @param {string} data.level - WCAG compliance level ('AA', 'AAA', or 'Fail')
 * @returns {string} AI-readable Markdown documentation
 *
 * @example
 * const md = formatContrastFix({
 *   original: 'oklch(0.7 0.1 50)',
 *   fixed: 'oklch(0.4 0.1 50)',
 *   background: 'oklch(0.98 0.01 90)',
 *   ratio: '4.52',
 *   level: 'AA'
 * });
 */
export function formatContrastFix(data) {
  const { original, fixed, background, ratio, level } = data;
  return `## Color Adjustment for Accessibility

**Issue:** The color \`${original}\` on background \`${background}\` does not meet WCAG contrast requirements.

**Fix:** Replace with \`${fixed}\`

| Property | Value |
|----------|-------|
| Original | \`${original}\` |
| Fixed | \`${fixed}\` |
| Background | \`${background}\` |
| Contrast Ratio | ${ratio}:1 |
| WCAG Level | ${level} |

**Usage:**
- CSS: \`color: ${fixed};\`
- Tailwind: Use the semantic token that maps to this color
- Always test the final implementation for accessibility`;
}

/**
 * Formats an accessible color palette as AI-readable Markdown.
 * Includes the color scale with usage hints and accessibility notes.
 *
 * @param {Object} data - Palette data from the palette generator tool
 * @param {string} data.baseColor - The base color used to generate the palette
 * @param {Array.<{value: string}>} data.palette - Array of color objects in the palette
 * @param {string} data.mode - Color mode used for generation ('light' or 'dark')
 * @returns {string} AI-readable Markdown documentation
 *
 * @example
 * const md = formatAccessiblePalette({
 *   baseColor: 'oklch(0.6 0.15 250)',
 *   palette: [{ value: 'oklch(0.95 0.02 250)' }, { value: 'oklch(0.6 0.15 250)' }],
 *   mode: 'light'
 * });
 */
export function formatAccessiblePalette(data) {
  const { baseColor, palette, mode } = data;

  let md = `## Accessible Color Palette

Generated from base color: \`${baseColor}\`
Mode: ${mode}

### Color Scale

| Step | Color | Usage |
|------|-------|-------|
`;

  if (palette && Array.isArray(palette)) {
    palette.forEach((color, index) => {
      const usage = getColorUsageHint(index, palette.length);
      md += `| ${index + 1} | \`${color.value}\` | ${usage} |\n`;
    });
  }

  md += `
### Accessibility Notes
- All colors in this palette are designed to work together
- Lighter shades work best as backgrounds
- Darker shades work best as text on light backgrounds
- Test combinations before use in production

### Apply to Theme
To use this palette, apply the primary color as your theme's primary token.`;

  return md;
}

/**
 * Formats a font pairing recommendation as AI-readable Markdown.
 * Includes CSS variables, Tailwind classes, and usage guidelines.
 *
 * @param {Object} data - Font pairing data from the typography tool
 * @param {string} data.heading - Font family name for headings
 * @param {string} data.body - Font family name for body text
 * @param {string} [data.reasoning] - Explanation of why this pairing works
 * @param {number} [data.headingWeight=600] - Font weight for headings (100-900)
 * @param {number} [data.bodyWeight=400] - Font weight for body text (100-900)
 * @returns {string} AI-readable Markdown documentation
 *
 * @example
 * const md = formatFontPairing({
 *   heading: 'Inter',
 *   body: 'Source Sans Pro',
 *   reasoning: 'Both are humanist sans-serifs with complementary x-heights.',
 *   headingWeight: 700,
 *   bodyWeight: 400
 * });
 */
export function formatFontPairing(data) {
  const { heading, body, reasoning, headingWeight, bodyWeight } = data;

  return `## Typography Pairing

### Fonts
- **Heading Font:** ${heading}
- **Body Font:** ${body}

### Weights
- Heading weight: ${headingWeight || 600}
- Body weight: ${bodyWeight || 400}

### Why This Works
${reasoning || 'This pairing creates visual hierarchy while maintaining readability.'}

### CSS Variables
\`\`\`css
:root {
  --font-heading: "${heading}", system-ui, sans-serif;
  --font-body: "${body}", system-ui, sans-serif;
  --font-weight-heading: ${headingWeight || 600};
  --font-weight-body: ${bodyWeight || 400};
}
\`\`\`

### Tailwind Classes
- Headings: \`font-heading font-semibold\`
- Body: \`font-body font-normal\`

### Usage Guidelines
- Use the heading font for h1-h6, titles, and display text
- Use the body font for paragraphs, labels, and UI text
- Maintain consistent weights throughout your design`;
}

/**
 * Formats dark mode color mappings as AI-readable Markdown.
 * Shows light/dark token pairs with implementation examples.
 *
 * @param {Object} data - Dark mode color data from the theme generator
 * @param {Object.<string, string>} data.lightColors - Light mode color tokens
 * @param {Object.<string, string>} data.darkColors - Dark mode color tokens
 * @param {string} [data.algorithm] - Algorithm used for dark mode generation
 * @returns {string} AI-readable Markdown documentation
 *
 * @example
 * const md = formatDarkModeColors({
 *   lightColors: { background: 'oklch(0.98 0.01 90)', foreground: 'oklch(0.2 0.01 90)' },
 *   darkColors: { background: 'oklch(0.15 0.01 90)', foreground: 'oklch(0.9 0.01 90)' },
 *   algorithm: 'Perceptual adjustment'
 * });
 */
export function formatDarkModeColors(data) {
  const { lightColors, darkColors, algorithm } = data;

  let md = `## Dark Mode Color System

Generated using: ${algorithm || 'Perceptual adjustment'} algorithm

### Color Token Mapping

| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
`;

  if (lightColors && darkColors) {
    Object.keys(lightColors).forEach((token) => {
      const light = lightColors[token];
      const dark = darkColors[token];
      if (light && dark) {
        md += `| ${token} | \`${light}\` | \`${dark}\` |\n`;
      }
    });
  }

  md += `
### Implementation

**CSS Variables (recommended):**
\`\`\`css
:root {
  /* Light mode (default) */
  --background: /* light value */;
  --foreground: /* light value */;
}

.dark {
  /* Dark mode */
  --background: /* dark value */;
  --foreground: /* dark value */;
}
\`\`\`

**Tailwind:**
Add \`dark:\` prefix for dark mode variants:
\`\`\`html
<div class="bg-background dark:bg-background">
\`\`\`

### Best Practices
1. Use CSS variables so dark mode switches automatically
2. Test all text/background combinations for contrast
3. Avoid pure black (#000) - use dark grays for softer appearance
4. Reduce saturation slightly in dark mode for eye comfort`;

  return md;
}

/**
 * Formats a typography scale as AI-readable Markdown.
 * Includes font sizes, CSS variables, and usage recommendations.
 *
 * @param {Object} data - Typography scale data
 * @param {number} data.baseSize - Base font size in pixels
 * @param {number} data.ratio - Scale ratio between steps (e.g., 1.25 for Major Third)
 * @param {Array.<{name: string, size: number, usage?: string}>} [data.scale] - Named scale steps
 * @param {string} [data.name] - Name of the scale preset (e.g., 'Major Third')
 * @returns {string} AI-readable Markdown documentation
 *
 * @example
 * const md = formatTokenScale({
 *   baseSize: 16,
 *   ratio: 1.25,
 *   name: 'Major Third',
 *   scale: [
 *     { name: 'sm', size: 12.8, usage: 'Captions, labels' },
 *     { name: 'base', size: 16, usage: 'Body text' },
 *     { name: 'lg', size: 20, usage: 'Subheadings' }
 *   ]
 * });
 */
export function formatTokenScale(data) {
  const { baseSize, ratio, scale, name } = data;

  let md = `## Typography Scale

**Scale:** ${name || 'Custom'}
**Base size:** ${baseSize}px
**Ratio:** ${ratio}

### Font Sizes

| Token | Size | Use For |
|-------|------|---------|
`;

  if (scale && Array.isArray(scale)) {
    scale.forEach((step) => {
      md += `| ${step.name} | ${step.size}px | ${step.usage || ''} |\n`;
    });
  }

  md += `
### CSS Variables
\`\`\`css
:root {
  --font-size-xs: ${(baseSize / ratio / ratio).toFixed(1)}px;
  --font-size-sm: ${(baseSize / ratio).toFixed(1)}px;
  --font-size-base: ${baseSize}px;
  --font-size-lg: ${(baseSize * ratio).toFixed(1)}px;
  --font-size-xl: ${(baseSize * ratio * ratio).toFixed(1)}px;
  --font-size-2xl: ${(baseSize * Math.pow(ratio, 3)).toFixed(1)}px;
}
\`\`\`

### Usage
- Use semantic size tokens, not pixel values
- The scale creates natural visual hierarchy
- Larger ratios create more dramatic contrast between sizes`;

  return md;
}

/**
 * Determines a usage hint based on the color's position in a palette.
 * Lighter colors (lower index) are suggested for backgrounds,
 * darker colors (higher index) for text.
 *
 * @param {number} index - Zero-based index of the color in the palette
 * @param {number} total - Total number of colors in the palette
 * @returns {string} Usage recommendation for the color
 *
 * @example
 * getColorUsageHint(0, 10); // Returns: 'Background, subtle fills'
 * getColorUsageHint(5, 10); // Returns: 'Primary actions, buttons'
 * getColorUsageHint(9, 10); // Returns: 'Headings, high contrast text'
 */
function getColorUsageHint(index, total) {
  const position = index / (total - 1);
  if (position <= 0.2) return 'Background, subtle fills';
  if (position <= 0.4) return 'Borders, dividers, hover states';
  if (position <= 0.6) return 'Primary actions, buttons';
  if (position <= 0.8) return 'Text on light backgrounds';
  return 'Headings, high contrast text';
}

/**
 * Copies text to the clipboard with fallback for older browsers.
 * Uses the modern Clipboard API when available, falls back to
 * creating a temporary textarea element for legacy support.
 *
 * @param {string} text - Text content to copy to clipboard
 * @returns {Promise<boolean>} True if copy succeeded, false otherwise
 *
 * @example
 * // Copy formatted AI rules to clipboard
 * const success = await copyToClipboard(formatContrastFix(data));
 * if (success) {
 *   console.log('Copied to clipboard!');
 * }
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      return true;
    } catch (err) {
      console.error('Copy failed:', err);
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
}

export default {
  formatContrastFix,
  formatAccessiblePalette,
  formatFontPairing,
  formatDarkModeColors,
  formatTokenScale,
  copyToClipboard,
};
