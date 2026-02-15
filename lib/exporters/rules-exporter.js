/**
 * AI Rules Exporter
 *
 * Exports theme as AI-readable rules for Claude, Cursor, ChatGPT, etc.
 * Helps AI tools generate code that matches your design system.
 *
 * @module exporters/rules-exporter
 */

import { getCSSVarName, SEMANTIC_TOKEN_METADATA, getTokenMetadata } from '../constants';
import { getContrastRatio } from '../contrast-checker';
import { TYPE_SCALES, LINE_HEIGHTS } from '../typography-config';
import { getFontFamily } from '../theme-utils';

/**
 * Generates color table rows with semantic hints for documentation.
 * Each row includes the token name, CSS variable, value, usage description, and Tailwind class.
 *
 * @param {Object.<string, string>} colors - Color token map (e.g., { primary: 'oklch(...)' })
 * @param {string} [mode='light'] - Color mode identifier ('light' or 'dark')
 * @returns {Array.<{token: string, cssVar: string, value: string, usage: string, tailwind: string}>} Array of color table row objects
 *
 * @example
 * const rows = generateColorTable({ primary: 'oklch(0.666 0.179 58.318)' });
 * // Returns: [{ token: 'primary', cssVar: '--primary', value: 'oklch(...)', usage: '...', tailwind: 'bg-primary' }]
 */
function generateColorTable(colors, mode = 'light') {
  const rows = [];

  Object.entries(colors).forEach(([token, value]) => {
    const meta = getTokenMetadata(token);
    const cssVar = getCSSVarName(token);
    rows.push({
      token,
      cssVar: `--${cssVar}`,
      value,
      usage: meta.usage,
      tailwind: meta.tailwind,
    });
  });

  return rows;
}

/**
 * Generates accessibility rules by checking contrast ratios for common color pairs.
 * Tests foreground/background combinations against WCAG guidelines.
 *
 * @param {Object.<string, string>} colors - Color token map with both foreground and background tokens
 * @returns {Array.<{label: string, foreground: string, background: string, ratio: string, passes: boolean, level: string}>} Array of contrast check results
 *
 * @example
 * const rules = generateAccessibilityRules(lightColors);
 * // Returns: [{ label: 'Text on background', ratio: '12.45', passes: true, level: 'AAA' }, ...]
 */
function generateAccessibilityRules(colors) {
  const pairs = [
    { fg: 'foreground', bg: 'background', label: 'Text on background' },
    { fg: 'primaryForeground', bg: 'primary', label: 'Text on primary' },
    { fg: 'secondaryForeground', bg: 'secondary', label: 'Text on secondary' },
    { fg: 'cardForeground', bg: 'card', label: 'Text on card' },
    { fg: 'mutedForeground', bg: 'muted', label: 'Text on muted' },
    { fg: 'accentForeground', bg: 'accent', label: 'Text on accent' },
  ];

  return pairs.map(({ fg, bg, label }) => {
    const ratio = getContrastRatio(colors[fg], colors[bg]);
    const passes = ratio >= 4.5;
    return {
      label,
      foreground: fg,
      background: bg,
      ratio: ratio.toFixed(2),
      passes,
      level: ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'Fail',
    };
  });
}

/**
 * Generates Tailwind CSS class patterns for common UI components.
 * Patterns use the theme's border radius and semantic color tokens.
 *
 * @param {Object} theme - Theme configuration object
 * @param {number} [theme.radius=0.625] - Border radius in rem units
 * @returns {Object} Component patterns with Tailwind class strings
 * @returns {Object} returns.button - Button variant patterns (primary, secondary, destructive, ghost, outline)
 * @returns {string} returns.card - Card component classes
 * @returns {string} returns.input - Input field classes
 * @returns {string} returns.badge - Badge component classes
 * @returns {string} returns.alert - Alert component classes
 */
function generateComponentPatterns(theme) {
  const radius = theme.radius || 0.625;

  return {
    button: {
      primary: `bg-primary text-primary-foreground hover:bg-primary/90 rounded-[${radius}rem] px-4 py-2 font-medium`,
      secondary: `bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-[${radius}rem] px-4 py-2 font-medium`,
      destructive: `bg-destructive text-white hover:bg-destructive/90 rounded-[${radius}rem] px-4 py-2 font-medium`,
      ghost: `hover:bg-accent hover:text-accent-foreground rounded-[${radius}rem] px-4 py-2 font-medium`,
      outline: `border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-[${radius}rem] px-4 py-2 font-medium`,
    },
    card: `bg-card text-card-foreground rounded-[${radius}rem] border border-border p-4 shadow-sm`,
    input: `bg-background border border-input rounded-[${radius}rem] px-3 py-2 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring`,
    badge: `bg-primary text-primary-foreground rounded-full px-2.5 py-0.5 text-xs font-medium`,
    alert: `bg-muted text-muted-foreground rounded-[${radius}rem] border border-border p-4`,
  };
}

/**
 * Generates design system rules as Markdown documentation.
 * Suitable for pasting into Claude, ChatGPT, or other AI chat interfaces.
 * Includes color tokens, typography, spacing, accessibility rules, and component patterns.
 *
 * @param {Object} theme - Theme configuration object
 * @param {Object} colors - Color tokens object with light and dark mode values
 * @param {Object.<string, string>} colors.light - Light mode color tokens
 * @param {Object.<string, string>} [colors.dark] - Dark mode color tokens
 * @param {Object} [options={}] - Export options
 * @param {string} [options.scope='full'] - Content scope: 'full', 'colors', or 'typography'
 * @returns {string} Markdown-formatted design system documentation
 *
 * @example
 * const markdown = generateMarkdownRules(theme, colors, { scope: 'colors' });
 * // Returns markdown with only color-related sections
 */
function generateMarkdownRules(theme, colors, options = {}) {
  const { scope = 'full' } = options;
  const lightColors = colors.light || {};
  const darkColors = colors.dark || {};
  const colorTable = generateColorTable(lightColors);
  const accessibilityRules = generateAccessibilityRules(lightColors);
  const patterns = generateComponentPatterns(theme);

  const scale = TYPE_SCALES[theme.typeScale] || TYPE_SCALES.default;
  const lineHeights = LINE_HEIGHTS[theme.lineHeightPreset] || LINE_HEIGHTS.normal;

  let md = `# Design System Rules

You are working with a design system. Follow these rules exactly when generating UI code.

`;

  // Colors section
  if (scope === 'full' || scope === 'colors') {
    md += `## Color Tokens

Use CSS variables, never raw color values. Reference these tokens by their CSS variable name.

| Token | CSS Variable | Value | Usage |
|-------|--------------|-------|-------|
`;
    colorTable.forEach((row) => {
      md += `| ${row.token} | \`${row.cssVar}\` | \`${row.value}\` | ${row.usage} |\n`;
    });

    md += `
### Tailwind Classes
`;
    colorTable.forEach((row) => {
      if (row.tailwind) {
        md += `- \`${row.tailwind}\` → ${row.usage}\n`;
      }
    });

    md += `
### Dark Mode
Dark mode is activated by adding \`.dark\` class to a parent element. The same CSS variables automatically update.

`;
  }

  // Typography section
  if (scope === 'full' || scope === 'typography') {
    md += `## Typography

- **Headings**: ${getFontFamily(theme.fontHeading || 'system-ui')}, weight ${theme.fontWeightHeading || 600}
- **Body**: ${getFontFamily(theme.fontBody || 'system-ui')}, weight ${theme.fontWeightBody || 400}
- **Scale ratio**: ${scale.ratio} (${scale.name || 'Custom'})
- **Base font size**: ${scale.baseFontSize}px
- **Line height (headings)**: ${lineHeights.heading}
- **Line height (body)**: ${lineHeights.body}

### Font Size Scale
- \`--font-size-xs\`: ${(scale.baseFontSize / scale.ratio / scale.ratio).toFixed(1)}px
- \`--font-size-sm\`: ${(scale.baseFontSize / scale.ratio).toFixed(1)}px
- \`--font-size-base\`: ${scale.baseFontSize}px
- \`--font-size-lg\`: ${(scale.baseFontSize * scale.ratio).toFixed(1)}px
- \`--font-size-xl\`: ${(scale.baseFontSize * scale.ratio * scale.ratio).toFixed(1)}px
- \`--font-size-2xl\`: ${(scale.baseFontSize * Math.pow(scale.ratio, 3)).toFixed(1)}px

`;
  }

  // Spacing section
  if (scope === 'full') {
    md += `## Spacing & Radius

- **Border radius**: ${theme.radius || 0.625}rem
  - Use \`rounded-lg\` for cards and larger containers
  - Use \`rounded-md\` for buttons and inputs
  - Use \`rounded-sm\` for small elements

`;
  }

  // Accessibility section
  if (scope === 'full' || scope === 'colors') {
    md += `## Accessibility Rules

All color combinations must meet WCAG AA contrast requirements (4.5:1 for normal text).

| Combination | Contrast | Status |
|-------------|----------|--------|
`;
    accessibilityRules.forEach((rule) => {
      const status = rule.passes ? `${rule.level}` : 'Fail';
      md += `| ${rule.label} | ${rule.ratio}:1 | ${status} |\n`;
    });

    md += `
**Rules:**
1. Never use colors that fail WCAG AA (4.5:1 for normal text)
2. Always pair foreground tokens with their matching background tokens
3. Test color combinations before using them

`;
  }

  // Component patterns section
  if (scope === 'full') {
    md += `## Component Patterns

When generating components, use these exact class patterns:

### Buttons
\`\`\`
Primary: ${patterns.button.primary}
Secondary: ${patterns.button.secondary}
Destructive: ${patterns.button.destructive}
Ghost: ${patterns.button.ghost}
Outline: ${patterns.button.outline}
\`\`\`

### Card
\`\`\`
${patterns.card}
\`\`\`

### Input
\`\`\`
${patterns.input}
\`\`\`

### Badge
\`\`\`
${patterns.badge}
\`\`\`

`;
  }

  md += `## Important Rules

1. **Never use raw color values** - Always use CSS variables (\`var(--primary)\`) or Tailwind classes (\`bg-primary\`)
2. **Follow the token hierarchy** - Use semantic tokens (primary, secondary) not primitive values
3. **Maintain consistency** - Use the same patterns throughout the codebase
4. **Test accessibility** - Verify contrast ratios meet WCAG AA standards
`;

  return md;
}

/**
 * Generates design system rules in Cursor Rules format (.mdc).
 * Includes YAML frontmatter for Cursor IDE integration with glob patterns
 * and automatic application settings.
 *
 * @param {Object} theme - Theme configuration object
 * @param {Object} colors - Color tokens object with light and dark mode values
 * @param {Object} [options={}] - Export options
 * @param {string} [options.scope='full'] - Content scope: 'full', 'colors', or 'typography'
 * @returns {string} Cursor Rules formatted content with YAML frontmatter
 *
 * @example
 * const cursorRules = generateCursorRules(theme, colors);
 * // Returns: '---\ndescription: Design system tokens...\nglobs: ["*.tsx"...]\n---\n...'
 */
function generateCursorRules(theme, colors, options = {}) {
  const content = generateMarkdownRules(theme, colors, options);

  return `---
description: Design system tokens and rules for consistent UI generation
globs: ["*.tsx", "*.jsx", "*.css", "*.html", "*.vue"]
alwaysApply: true
---

${content}`;
}

/**
 * Generates design system rules in Claude Instructions format (XML-structured).
 * Uses XML tags for structured data that Claude can parse effectively.
 * Includes color tokens, typography settings, spacing, and component patterns.
 *
 * @param {Object} theme - Theme configuration object
 * @param {Object} colors - Color tokens object with light and dark mode values
 * @param {Object.<string, string>} colors.light - Light mode color tokens
 * @param {Object} [options={}] - Export options (currently unused but reserved for future)
 * @returns {string} XML-structured design system documentation
 *
 * @example
 * const claudeInstructions = generateClaudeInstructions(theme, colors);
 * // Returns: '<design-system>\n<colors>\n  <token name="primary"...'
 */
function generateClaudeInstructions(theme, colors, options = {}) {
  const lightColors = colors.light || {};
  const patterns = generateComponentPatterns(theme);

  // Build XML-style tokens
  let tokenXml = '';
  Object.entries(lightColors).forEach(([token, value]) => {
    const meta = getTokenMetadata(token);
    tokenXml += `  <token name="${token}" value="${value}" usage="${meta.usage}" />\n`;
  });

  return `<design-system>
<colors>
${tokenXml}</colors>

<typography>
  <font-heading family="${getFontFamily(theme.fontHeading || 'system-ui')}" weight="${theme.fontWeightHeading || 600}" />
  <font-body family="${getFontFamily(theme.fontBody || 'system-ui')}" weight="${theme.fontWeightBody || 400}" />
</typography>

<spacing>
  <radius value="${theme.radius || 0.625}rem" />
</spacing>

<patterns>
  <button-primary classes="${patterns.button.primary}" />
  <button-secondary classes="${patterns.button.secondary}" />
  <card classes="${patterns.card}" />
  <input classes="${patterns.input}" />
</patterns>
</design-system>

<rules>
1. Always use CSS variables from the design system above
2. Never hardcode colors - reference tokens by name
3. Follow the component patterns provided exactly
4. Ensure all text meets WCAG AA contrast requirements (4.5:1)
5. Use semantic token names (primary, secondary) not color names (blue, red)
</rules>`;
}

/**
 * Exports the theme as AI-readable rules in various formats.
 * This is the main entry point for generating AI instructions from your design system.
 *
 * @param {Object} theme - Theme state containing typography, spacing, and other design tokens
 * @param {Object} colors - Color tokens object
 * @param {Object.<string, string>} colors.light - Light mode color tokens
 * @param {Object.<string, string>} [colors.dark] - Dark mode color tokens
 * @param {Object} [options={}] - Export options
 * @param {string} [options.format='markdown'] - Output format: 'markdown', 'cursor', or 'claude'
 * @param {string} [options.scope='full'] - Content scope: 'full', 'colors', or 'typography'
 * @returns {string} AI rules content in the specified format
 *
 * @example
 * // Export as Markdown for ChatGPT
 * const markdown = exportAsAIRules(theme, colors, { format: 'markdown' });
 *
 * @example
 * // Export as Cursor Rules file
 * const cursorRules = exportAsAIRules(theme, colors, { format: 'cursor' });
 *
 * @example
 * // Export only color tokens for Claude
 * const claudeColors = exportAsAIRules(theme, colors, { format: 'claude', scope: 'colors' });
 */
export function exportAsAIRules(theme, colors, options = {}) {
  const { format = 'markdown', scope = 'full' } = options;

  switch (format) {
    case 'cursor':
      return generateCursorRules(theme, colors, { scope });
    case 'claude':
      return generateClaudeInstructions(theme, colors, { scope });
    default:
      return generateMarkdownRules(theme, colors, { scope });
  }
}

export default exportAsAIRules;
