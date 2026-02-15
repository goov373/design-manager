/**
 * Design Manager Constants
 *
 * Default values and configuration for the design manager package.
 * All values can be overridden via props.
 */

// Storage
export const DEFAULT_STORAGE_KEY = 'design-manager-theme';
export const DEFAULT_PRESETS_KEY = 'design-manager-presets';
export const DEFAULT_PANEL_KEY = 'design-manager-panel';

// Panel positioning
export const DEFAULT_PANEL_POSITION = { x: -24, y: -24 }; // Offset from corner
// Panel sizes follow ~4:3 aspect ratio for optimal content display
// Default is generous for comfortable editing, max allows expansion on larger screens
export const DEFAULT_PANEL_SIZE = { width: 600, height: 800 };
export const MIN_PANEL_SIZE = { width: 320, height: 400 };
export const MAX_PANEL_SIZE = { width: 800, height: 1000 };  // ~1.33x default

// Panel positions
export const PANEL_POSITIONS = {
  'center': { center: true },  // Special case - calculated dynamically
  'bottom-right': { right: 24, bottom: 24 },
  'bottom-left': { left: 24, bottom: 24 },
  'top-right': { right: 24, top: 24 },
  'top-left': { left: 24, top: 24 },
};

// History
export const MAX_HISTORY_SIZE = 50;

// Debounce timings (ms)
export const STORAGE_DEBOUNCE = 500;
export const DOM_UPDATE_DEBOUNCE = 16; // ~60fps

// Tab IDs
export const TABS = {
  TOOLS: 'tools',
  COLORS: 'colors',
  TYPOGRAPHY: 'typography',
  SURFACES: 'surfaces',
  AI: 'ai',
  EXPORT: 'export',
};

// Default theme values
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

// Default color tokens (shadcn/ui compatible)
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
  },
};

// Color token groups for UI organization
export const COLOR_TOKEN_GROUPS = [
  {
    id: 'background',
    name: 'Background',
    tokens: ['background', 'foreground'],
  },
  {
    id: 'cards',
    name: 'Cards & Popovers',
    tokens: ['card', 'cardForeground', 'popover', 'popoverForeground'],
  },
  {
    id: 'interactive',
    name: 'Interactive',
    tokens: ['primary', 'primaryForeground', 'secondary', 'secondaryForeground'],
  },
  {
    id: 'accents',
    name: 'Accents',
    tokens: ['accent', 'accentForeground', 'muted', 'mutedForeground'],
  },
  {
    id: 'forms',
    name: 'Forms & Borders',
    tokens: ['border', 'input', 'ring', 'destructive'],
  },
];

// CSS variable name mapping
export const CSS_VAR_MAP = {
  cardForeground: 'card-foreground',
  popoverForeground: 'popover-foreground',
  primaryForeground: 'primary-foreground',
  secondaryForeground: 'secondary-foreground',
  mutedForeground: 'muted-foreground',
  accentForeground: 'accent-foreground',
};

// Get CSS variable name from token key
export function getCSSVarName(tokenKey) {
  return CSS_VAR_MAP[tokenKey] || tokenKey;
}
