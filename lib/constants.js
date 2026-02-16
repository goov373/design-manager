/**
 * Design Manager Constants
 *
 * Default values and configuration for the design manager package.
 * All values can be overridden via props.
 *
 * @module constants
 */

/**
 * Default localStorage key for persisting theme state.
 * @constant {string}
 */
export const DEFAULT_STORAGE_KEY = 'design-manager-theme';

/**
 * Default localStorage key for persisting custom presets.
 * @constant {string}
 */
export const DEFAULT_PRESETS_KEY = 'design-manager-presets';

/**
 * Default localStorage key for persisting panel position and size.
 * @constant {string}
 */
export const DEFAULT_PANEL_KEY = 'design-manager-panel';

/**
 * Default panel position offset from corner (in pixels).
 * Negative values offset inward from the corner.
 * @constant {{x: number, y: number}}
 */
export const DEFAULT_PANEL_POSITION = { x: -24, y: -24 };

/**
 * Default panel dimensions following ~4:3 aspect ratio.
 * Provides comfortable editing space while fitting most screens.
 * @constant {{width: number, height: number}}
 */
export const DEFAULT_PANEL_SIZE = { width: 600, height: 800 };

/**
 * Minimum allowed panel dimensions for usability.
 * @constant {{width: number, height: number}}
 */
export const MIN_PANEL_SIZE = { width: 320, height: 400 };

/**
 * Maximum allowed panel dimensions (~1.33x default).
 * @constant {{width: number, height: number}}
 */
export const MAX_PANEL_SIZE = { width: 800, height: 1000 };

/**
 * Preset panel positions for common placements.
 * The 'center' position is calculated dynamically based on viewport.
 *
 * @constant {Object.<string, Object>}
 * @property {Object} center - Centered on screen (calculated dynamically)
 * @property {Object} bottom-right - Bottom-right corner with 24px inset
 * @property {Object} bottom-left - Bottom-left corner with 24px inset
 * @property {Object} top-right - Top-right corner with 24px inset
 * @property {Object} top-left - Top-left corner with 24px inset
 */
export const PANEL_POSITIONS = {
  'center': { center: true },
  'bottom-right': { right: 24, bottom: 24 },
  'bottom-left': { left: 24, bottom: 24 },
  'top-right': { right: 24, top: 24 },
  'top-left': { left: 24, top: 24 },
};

/**
 * Maximum number of undo/redo history entries to retain.
 * @constant {number}
 */
export const MAX_HISTORY_SIZE = 50;

/**
 * Debounce delay for localStorage writes (in milliseconds).
 * Prevents excessive writes during rapid changes.
 * @constant {number}
 */
export const STORAGE_DEBOUNCE = 500;

/**
 * Debounce delay for DOM updates (in milliseconds).
 * Set to ~60fps for smooth visual updates.
 * @constant {number}
 */
export const DOM_UPDATE_DEBOUNCE = 16;

/**
 * Tab identifiers for the Design Manager panel navigation.
 *
 * @constant {Object.<string, string>}
 * @property {string} TOOLS - AI tools and utilities tab
 * @property {string} COLORS - Color token editor tab
 * @property {string} TYPOGRAPHY - Font and type scale settings tab
 * @property {string} SURFACES - Surface textures and backgrounds tab
 * @property {string} EXPORT - Theme export options tab
 */
export const TABS = {
  TOOLS: 'tools',
  COLORS: 'colors',
  TYPOGRAPHY: 'typography',
  SURFACES: 'surfaces',
  EXPORT: 'export',
};

/**
 * Default theme configuration values.
 * These serve as the baseline for new themes and reset operations.
 *
 * @constant {Object}
 * @property {boolean} darkMode - Whether dark mode is enabled
 * @property {string} paperWhite - OKLCH color for white paper surface
 * @property {string} paperCream - OKLCH color for cream paper surface
 * @property {string} paperKraft - OKLCH color for kraft paper surface
 * @property {number} radius - Default border radius in rem units
 * @property {number} textureOpacityFaint - Opacity for faint texture overlays
 * @property {string} fontHeading - Font family for headings
 * @property {string} fontBody - Font family for body text
 * @property {number} fontWeightHeading - Font weight for headings (100-900)
 * @property {number} fontWeightBody - Font weight for body text (100-900)
 * @property {string} typeScale - Typography scale preset identifier
 * @property {string} lineHeightPreset - Line height preset identifier
 * @property {string} activePresetId - Currently active theme preset ID
 */
export const DEFAULT_THEME = {
  darkMode: false,

  // Surfaces
  paperWhite: 'oklch(0.98 0.01 90)',
  paperCream: 'oklch(0.96 0.02 85)',
  paperKraft: 'oklch(0.75 0.08 70)',

  // Design tokens
  radius: 0.625,
  textureOpacityFaint: 0.04,

  // Typography
  fontHeading: 'system-ui',
  fontBody: 'system-ui',
  fontWeightHeading: 600,
  fontWeightBody: 400,
  typeScale: 'default',
  lineHeightPreset: 'normal',

  // Active preset
  activePresetId: 'default',
};

/**
 * Default color tokens compatible with shadcn/ui design system.
 * Provides semantic color tokens for both light and dark modes using OKLCH color space.
 *
 * @constant {Object}
 * @property {Object} light - Light mode color tokens
 * @property {Object} dark - Dark mode color tokens
 *
 * @example
 * // Access a specific token
 * const primaryColor = DEFAULT_COLOR_TOKENS.light.primary;
 * // Returns: 'oklch(0.666 0.179 58.318)'
 */
export const DEFAULT_COLOR_TOKENS = {
  light: {
    background: 'oklch(0.987 0.022 95.277)',
    foreground: 'oklch(0.216 0.006 56.043)',
    card: 'oklch(0.998 0.002 106.424)',
    cardForeground: 'oklch(0.216 0.006 56.043)',
    popover: 'oklch(0.998 0.002 106.424)',
    popoverForeground: 'oklch(0.216 0.006 56.043)',
    primary: 'oklch(0.666 0.179 58.318)',
    primaryForeground: 'oklch(0.998 0.002 106.424)',
    secondary: 'oklch(0.906 0.037 92.675)',
    secondaryForeground: 'oklch(0.216 0.006 56.043)',
    muted: 'oklch(0.943 0.024 92.842)',
    mutedForeground: 'oklch(0.553 0.046 58.405)',
    accent: 'oklch(0.705 0.191 47.604)',
    accentForeground: 'oklch(0.998 0.002 106.424)',
    destructive: 'oklch(0.577 0.245 27.325)',
    border: 'oklch(0.885 0.035 92.675)',
    input: 'oklch(0.885 0.035 92.675)',
    ring: 'oklch(0.666 0.179 58.318)',
    // Chart palette colors (for data series)
    chart1: 'oklch(0.646 0.222 41.116)',
    chart2: 'oklch(0.6 0.118 184.704)',
    chart3: 'oklch(0.398 0.07 227.392)',
    chart4: 'oklch(0.828 0.189 84.429)',
    chart5: 'oklch(0.769 0.188 70.08)',
    // Chart structural elements
    chartGrid: 'oklch(0.82 0 0)',
    chartAxis: 'oklch(0.7 0 0)',
    chartAxisLabel: 'oklch(0.553 0.046 58.405)',
    // Chart tooltip
    chartTooltipBg: 'oklch(0.998 0.002 106.424)',
    chartTooltipBorder: 'oklch(0.885 0.035 92.675)',
    chartTooltipText: 'oklch(0.216 0.006 56.043)',
    // Chart text elements
    chartLegendText: 'oklch(0.553 0.046 58.405)',
    chartTitle: 'oklch(0.216 0.006 56.043)',
    chartSubtitle: 'oklch(0.553 0.046 58.405)',
  },
  dark: {
    background: 'oklch(0.216 0.006 56.043)',
    foreground: 'oklch(0.987 0.022 95.277)',
    card: 'oklch(0.268 0.007 56.043)',
    cardForeground: 'oklch(0.987 0.022 95.277)',
    popover: 'oklch(0.268 0.007 56.043)',
    popoverForeground: 'oklch(0.987 0.022 95.277)',
    primary: 'oklch(0.769 0.188 70.08)',
    primaryForeground: 'oklch(0.216 0.006 56.043)',
    secondary: 'oklch(0.371 0.044 58.405)',
    secondaryForeground: 'oklch(0.987 0.022 95.277)',
    muted: 'oklch(0.268 0.007 56.043)',
    mutedForeground: 'oklch(0.709 0.046 58.405)',
    accent: 'oklch(0.705 0.191 47.604)',
    accentForeground: 'oklch(0.216 0.006 56.043)',
    destructive: 'oklch(0.704 0.191 22.216)',
    border: 'oklch(0.371 0.044 58.405)',
    input: 'oklch(0.371 0.044 58.405)',
    ring: 'oklch(0.769 0.188 70.08)',
    // Chart palette colors (for data series)
    chart1: 'oklch(0.488 0.243 264.376)',
    chart2: 'oklch(0.696 0.17 162.48)',
    chart3: 'oklch(0.769 0.188 70.08)',
    chart4: 'oklch(0.627 0.265 303.9)',
    chart5: 'oklch(0.645 0.246 16.439)',
    // Chart structural elements
    chartGrid: 'oklch(1 0 0 / 18%)',
    chartAxis: 'oklch(1 0 0 / 25%)',
    chartAxisLabel: 'oklch(0.709 0.046 58.405)',
    // Chart tooltip
    chartTooltipBg: 'oklch(0.268 0.007 56.043)',
    chartTooltipBorder: 'oklch(0.371 0.044 58.405)',
    chartTooltipText: 'oklch(0.987 0.022 95.277)',
    // Chart text elements
    chartLegendText: 'oklch(0.709 0.046 58.405)',
    chartTitle: 'oklch(0.987 0.022 95.277)',
    chartSubtitle: 'oklch(0.709 0.046 58.405)',
  },
};

/**
 * Color token groups for organizing the color editor UI.
 * Groups related tokens together with descriptions for user guidance.
 *
 * @constant {Array.<{id: string, name: string, description: string, tokens: string[]}>}
 *
 * @example
 * // Find tokens in the 'interactive' group
 * const interactiveGroup = COLOR_TOKEN_GROUPS.find(g => g.id === 'interactive');
 * // Returns: { id: 'interactive', name: 'Interactive', tokens: ['primary', 'primaryForeground', ...] }
 */
export const COLOR_TOKEN_GROUPS = [
  {
    id: 'background',
    name: 'Background',
    description: 'Base page and surface colors',
    tokens: ['background', 'foreground'],
  },
  {
    id: 'cards',
    name: 'Cards & Popovers',
    description: 'Elevated surface colors for cards and overlays',
    tokens: ['card', 'cardForeground', 'popover', 'popoverForeground'],
  },
  {
    id: 'interactive',
    name: 'Interactive',
    description: 'Colors for buttons and interactive elements',
    tokens: ['primary', 'primaryForeground', 'secondary', 'secondaryForeground'],
  },
  {
    id: 'accents',
    name: 'Accents',
    description: 'Highlight and secondary content colors',
    tokens: ['accent', 'accentForeground', 'muted', 'mutedForeground'],
  },
  {
    id: 'forms',
    name: 'Forms & Borders',
    description: 'Input fields, borders, and state indicators',
    tokens: ['border', 'input', 'ring', 'destructive'],
  },
  {
    id: 'chartPalette',
    name: 'Chart Palette',
    description: 'Data series colors for charts and visualizations',
    tokens: ['chart1', 'chart2', 'chart3', 'chart4', 'chart5'],
  },
  {
    id: 'chartElements',
    name: 'Chart Elements',
    description: 'Structural elements: grid, axes, tooltips, legends',
    tokens: [
      'chartGrid',
      'chartAxis',
      'chartAxisLabel',
      'chartTooltipBg',
      'chartTooltipBorder',
      'chartTooltipText',
      'chartLegendText',
      'chartTitle',
      'chartSubtitle',
    ],
  },
];

/**
 * Semantic metadata for AI-friendly theme exports.
 * Provides usage hints, AI context, CSS variable names, and Tailwind class mappings
 * for each color token. Used by the AI rules exporter to generate helpful documentation.
 *
 * @constant {Object.<string, {usage: string, aiHint: string, cssVar: string, tailwind: string}>}
 *
 * @example
 * // Get metadata for the primary token
 * const primaryMeta = SEMANTIC_TOKEN_METADATA.primary;
 * // Returns: {
 * //   usage: 'Main CTAs, primary buttons, active states, links',
 * //   aiHint: 'The most important interactive element on screen...',
 * //   cssVar: '--primary',
 * //   tailwind: 'bg-primary'
 * // }
 */
export const SEMANTIC_TOKEN_METADATA = {
  // Background group
  background: {
    usage: 'Page background, main canvas',
    aiHint: 'The base layer of your interface. Everything else sits on top of this.',
    cssVar: '--background',
    tailwind: 'bg-background',
  },
  foreground: {
    usage: 'Main body text, primary content',
    aiHint: 'Default text color. Use for headings, paragraphs, and primary content.',
    cssVar: '--foreground',
    tailwind: 'text-foreground',
  },

  // Cards group
  card: {
    usage: 'Card backgrounds, elevated surfaces',
    aiHint: 'Elevated containers that hold related content. Sits above background.',
    cssVar: '--card',
    tailwind: 'bg-card',
  },
  cardForeground: {
    usage: 'Text inside cards',
    aiHint: 'Always pair with card background for readable contrast.',
    cssVar: '--card-foreground',
    tailwind: 'text-card-foreground',
  },
  popover: {
    usage: 'Dropdown menus, tooltips, floating panels',
    aiHint: 'Temporary overlays that appear on user action. Usually same as card.',
    cssVar: '--popover',
    tailwind: 'bg-popover',
  },
  popoverForeground: {
    usage: 'Text inside popovers and dropdowns',
    aiHint: 'Always pair with popover background.',
    cssVar: '--popover-foreground',
    tailwind: 'text-popover-foreground',
  },

  // Interactive group
  primary: {
    usage: 'Main CTAs, primary buttons, active states, links',
    aiHint: 'The most important interactive element on screen. Use sparingly for emphasis.',
    cssVar: '--primary',
    tailwind: 'bg-primary',
  },
  primaryForeground: {
    usage: 'Text and icons on primary backgrounds',
    aiHint: 'Always pair with primary. Usually white or very light.',
    cssVar: '--primary-foreground',
    tailwind: 'text-primary-foreground',
  },
  secondary: {
    usage: 'Secondary buttons, less prominent actions',
    aiHint: 'When you need a button but primary is too strong. Cancel buttons, alternative actions.',
    cssVar: '--secondary',
    tailwind: 'bg-secondary',
  },
  secondaryForeground: {
    usage: 'Text on secondary backgrounds',
    aiHint: 'Always pair with secondary background.',
    cssVar: '--secondary-foreground',
    tailwind: 'text-secondary-foreground',
  },

  // Accents group
  accent: {
    usage: 'Highlights, badges, notifications, hover states',
    aiHint: 'Draw attention without implying action. Good for tags, badges, and highlights.',
    cssVar: '--accent',
    tailwind: 'bg-accent',
  },
  accentForeground: {
    usage: 'Text on accent backgrounds',
    aiHint: 'Always pair with accent background.',
    cssVar: '--accent-foreground',
    tailwind: 'text-accent-foreground',
  },
  muted: {
    usage: 'Subtle backgrounds, disabled states, skeleton loaders',
    aiHint: 'Background for less important UI sections. Hover states, disabled elements.',
    cssVar: '--muted',
    tailwind: 'bg-muted',
  },
  mutedForeground: {
    usage: 'Secondary text, placeholders, labels, captions',
    aiHint: 'Text that should be readable but not prominent. Placeholders, help text.',
    cssVar: '--muted-foreground',
    tailwind: 'text-muted-foreground',
  },

  // Forms group
  border: {
    usage: 'Dividers, card borders, separators',
    aiHint: 'Subtle separation between UI sections. Keep it subtle.',
    cssVar: '--border',
    tailwind: 'border-border',
  },
  input: {
    usage: 'Form field borders and backgrounds',
    aiHint: 'Interactive form elements like text inputs, selects, textareas.',
    cssVar: '--input',
    tailwind: 'border-input',
  },
  ring: {
    usage: 'Focus rings, selection indicators',
    aiHint: 'Keyboard focus states and selection. Important for accessibility.',
    cssVar: '--ring',
    tailwind: 'ring-ring',
  },
  destructive: {
    usage: 'Delete buttons, error states, warnings',
    aiHint: 'Dangerous or irreversible actions only. Delete, remove, errors.',
    cssVar: '--destructive',
    tailwind: 'bg-destructive text-destructive-foreground',
  },

  // Chart palette tokens
  chart1: {
    usage: 'Primary data series, first category in charts',
    aiHint: 'The dominant color in your charts. Make it your brand color or a strong, distinguishable hue.',
    cssVar: '--chart-1',
    tailwind: 'fill-chart-1 stroke-chart-1',
  },
  chart2: {
    usage: 'Secondary data series, second category',
    aiHint: 'Should contrast well with chart1. Often a complementary or analogous color.',
    cssVar: '--chart-2',
    tailwind: 'fill-chart-2 stroke-chart-2',
  },
  chart3: {
    usage: 'Tertiary data series, third category',
    aiHint: 'Ensure it remains distinguishable from chart1 and chart2, especially for colorblind users.',
    cssVar: '--chart-3',
    tailwind: 'fill-chart-3 stroke-chart-3',
  },
  chart4: {
    usage: 'Fourth data series category',
    aiHint: 'Consider using a warmer tone if chart1-3 are cool, or vice versa.',
    cssVar: '--chart-4',
    tailwind: 'fill-chart-4 stroke-chart-4',
  },
  chart5: {
    usage: 'Fifth data series category',
    aiHint: 'The last in the palette. Ensure all 5 colors work together and are distinguishable.',
    cssVar: '--chart-5',
    tailwind: 'fill-chart-5 stroke-chart-5',
  },

  // Chart structural elements
  chartGrid: {
    usage: 'Chart gridlines and background guides',
    aiHint: 'Should be subtle - visible but not distracting from the data.',
    cssVar: '--chart-grid',
    tailwind: 'stroke-chart-grid',
  },
  chartAxis: {
    usage: 'Chart axis lines (x and y axes)',
    aiHint: 'Slightly more prominent than gridlines but still subtle.',
    cssVar: '--chart-axis',
    tailwind: 'stroke-chart-axis',
  },
  chartAxisLabel: {
    usage: 'Axis tick labels and values',
    aiHint: 'Text color for numbers/labels along axes. Use muted foreground tones.',
    cssVar: '--chart-axis-label',
    tailwind: 'text-chart-axis-label',
  },
  chartTooltipBg: {
    usage: 'Tooltip background color',
    aiHint: 'Background for hover tooltips. Usually matches card or popover background.',
    cssVar: '--chart-tooltip-bg',
    tailwind: 'bg-chart-tooltip-bg',
  },
  chartTooltipBorder: {
    usage: 'Tooltip border color',
    aiHint: 'Border around tooltips. Subtle separation from chart content.',
    cssVar: '--chart-tooltip-border',
    tailwind: 'border-chart-tooltip-border',
  },
  chartTooltipText: {
    usage: 'Tooltip text color',
    aiHint: 'Text inside tooltips. Ensure good contrast with tooltip background.',
    cssVar: '--chart-tooltip-text',
    tailwind: 'text-chart-tooltip-text',
  },
  chartLegendText: {
    usage: 'Legend labels',
    aiHint: 'Text for chart legend items. Often muted but readable.',
    cssVar: '--chart-legend-text',
    tailwind: 'text-chart-legend-text',
  },
  chartTitle: {
    usage: 'Chart title color',
    aiHint: 'Main chart heading. Should match or complement your foreground color.',
    cssVar: '--chart-title',
    tailwind: 'text-chart-title',
  },
  chartSubtitle: {
    usage: 'Chart subtitle or description',
    aiHint: 'Secondary text under chart title. Use muted tones.',
    cssVar: '--chart-subtitle',
    tailwind: 'text-chart-subtitle',
  },
};

/**
 * Retrieves semantic metadata for a color token.
 * Returns default metadata with auto-generated CSS variable name if token is not found.
 *
 * @param {string} tokenKey - The color token identifier (e.g., 'primary', 'cardForeground')
 * @returns {{usage: string, aiHint: string, cssVar: string, tailwind: string}} Token metadata
 *
 * @example
 * const meta = getTokenMetadata('primary');
 * // Returns: { usage: 'Main CTAs...', aiHint: '...', cssVar: '--primary', tailwind: 'bg-primary' }
 *
 * @example
 * // Unknown token returns auto-generated defaults
 * const meta = getTokenMetadata('customToken');
 * // Returns: { usage: 'customToken color token', aiHint: '', cssVar: '--custom-token', tailwind: 'customToken' }
 */
export function getTokenMetadata(tokenKey) {
  return SEMANTIC_TOKEN_METADATA[tokenKey] || {
    usage: `${tokenKey} color token`,
    aiHint: '',
    cssVar: `--${tokenKey.replace(/([A-Z])/g, '-$1').toLowerCase()}`,
    tailwind: tokenKey,
  };
}

/**
 * Maps camelCase token keys to kebab-case CSS variable names.
 * Only includes tokens that differ from their simple lowercase form.
 *
 * @constant {Object.<string, string>}
 *
 * @example
 * CSS_VAR_MAP['cardForeground'] // Returns: 'card-foreground'
 */
export const CSS_VAR_MAP = {
  cardForeground: 'card-foreground',
  popoverForeground: 'popover-foreground',
  primaryForeground: 'primary-foreground',
  secondaryForeground: 'secondary-foreground',
  mutedForeground: 'muted-foreground',
  accentForeground: 'accent-foreground',
  // Chart tokens
  chart1: 'chart-1',
  chart2: 'chart-2',
  chart3: 'chart-3',
  chart4: 'chart-4',
  chart5: 'chart-5',
  chartGrid: 'chart-grid',
  chartAxis: 'chart-axis',
  chartAxisLabel: 'chart-axis-label',
  chartTooltipBg: 'chart-tooltip-bg',
  chartTooltipBorder: 'chart-tooltip-border',
  chartTooltipText: 'chart-tooltip-text',
  chartLegendText: 'chart-legend-text',
  chartTitle: 'chart-title',
  chartSubtitle: 'chart-subtitle',
};

/**
 * Converts a token key to its CSS variable name.
 * Uses the CSS_VAR_MAP for known compound tokens, otherwise returns the key unchanged.
 *
 * @param {string} tokenKey - The color token identifier (e.g., 'primary', 'cardForeground')
 * @returns {string} The CSS variable name without the '--' prefix
 *
 * @example
 * getCSSVarName('cardForeground'); // Returns: 'card-foreground'
 * getCSSVarName('primary');        // Returns: 'primary'
 */
export function getCSSVarName(tokenKey) {
  return CSS_VAR_MAP[tokenKey] || tokenKey;
}
