/**
 * Typography Configuration
 *
 * Font catalog, type scale presets, and line height configurations
 * for the Design Manager typography controls.
 */

/**
 * Font Catalog
 *
 * 12 curated Google Fonts + system default:
 * - 4 Handwritten/Craft fonts
 * - 4 Warm Serif fonts
 * - 2 Display fonts
 * - 2 Sans-Serif fonts
 * - 1 System default
 */
export const FONT_CATALOG = {
  // === System Default ===
  'system-ui': {
    name: 'System Default',
    category: 'system',
    googleFont: null,
    weights: [400, 500, 600, 700],
    preview: 'Native System Font',
    recommended: 'both',
    fallback: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
  },

  // === Handwritten/Craft Fonts ===
  'shadows-into-light': {
    name: 'Shadows Into Light',
    category: 'handwritten',
    googleFont: 'Shadows+Into+Light',
    weights: [400],
    preview: 'Warm & Personal',
    recommended: 'headings',
    fallback: 'cursive',
  },
  'patrick-hand': {
    name: 'Patrick Hand',
    category: 'handwritten',
    googleFont: 'Patrick+Hand',
    weights: [400],
    preview: 'Casual & Approachable',
    recommended: 'both',
    fallback: 'cursive',
  },
  caveat: {
    name: 'Caveat',
    category: 'handwritten',
    googleFont: 'Caveat:wght@400;500;600;700',
    weights: [400, 500, 600, 700],
    preview: 'Elegant Script',
    recommended: 'headings',
    fallback: 'cursive',
  },
  kalam: {
    name: 'Kalam',
    category: 'handwritten',
    googleFont: 'Kalam:wght@400;700',
    weights: [400, 700],
    preview: 'Natural Handwriting',
    recommended: 'body',
    fallback: 'cursive',
  },

  // === Warm Serif Fonts ===
  lora: {
    name: 'Lora',
    category: 'serif',
    googleFont: 'Lora:wght@400;500;600;700',
    weights: [400, 500, 600, 700],
    preview: 'Friendly & Welcoming',
    recommended: 'both',
    fallback: 'Georgia, serif',
  },
  merriweather: {
    name: 'Merriweather',
    category: 'serif',
    googleFont: 'Merriweather:wght@400;700;900',
    weights: [400, 700, 900],
    preview: 'Readable & Warm',
    recommended: 'body',
    fallback: 'Georgia, serif',
  },
  'crimson-text': {
    name: 'Crimson Text',
    category: 'serif',
    googleFont: 'Crimson+Text:wght@400;600;700',
    weights: [400, 600, 700],
    preview: 'Classic & Comfortable',
    recommended: 'body',
    fallback: 'Georgia, serif',
  },
  alegreya: {
    name: 'Alegreya',
    category: 'serif',
    googleFont: 'Alegreya:wght@400;500;700;800',
    weights: [400, 500, 700, 800],
    preview: 'Rhythmic & Lively',
    recommended: 'both',
    fallback: 'Georgia, serif',
  },

  // === Display/Headline Fonts ===
  'playfair-display': {
    name: 'Playfair Display',
    category: 'display',
    googleFont: 'Playfair+Display:wght@400;500;600;700;800;900',
    weights: [400, 500, 600, 700, 800, 900],
    preview: 'Elegant & Vintage',
    recommended: 'headings',
    fallback: 'Georgia, serif',
  },
  'young-serif': {
    name: 'Young Serif',
    category: 'display',
    googleFont: 'Young+Serif',
    weights: [400],
    preview: 'Subtle Vintage Charm',
    recommended: 'headings',
    fallback: 'Georgia, serif',
  },

  // === Sans-Serif Fonts ===
  'source-sans-3': {
    name: 'Source Sans 3',
    category: 'sans',
    googleFont: 'Source+Sans+3:wght@400;500;600;700',
    weights: [400, 500, 600, 700],
    preview: 'Clean & Professional',
    recommended: 'body',
    fallback: 'system-ui, sans-serif',
  },
  nunito: {
    name: 'Nunito',
    category: 'sans',
    googleFont: 'Nunito:wght@400;500;600;700;800',
    weights: [400, 500, 600, 700, 800],
    preview: 'Rounded & Friendly',
    recommended: 'both',
    fallback: 'system-ui, sans-serif',
  },
};

/**
 * Font Categories for UI grouping
 */
export const FONT_CATEGORIES = {
  system: {
    label: 'System',
    description: 'Native system fonts',
  },
  handwritten: {
    label: 'Handwritten',
    description: 'Craft & script fonts',
  },
  serif: {
    label: 'Warm Serifs',
    description: 'Classic readable fonts',
  },
  display: {
    label: 'Display',
    description: 'Headlines & titles',
  },
  sans: {
    label: 'Sans-Serif',
    description: 'Clean modern fonts',
  },
};

/**
 * Type Scale Presets
 *
 * Based on musical intervals:
 * - Compact: Major Second (1.125)
 * - Default: Minor Third (1.2)
 * - Spacious: Major Third (1.25)
 */
export const TYPE_SCALES = {
  compact: {
    id: 'compact',
    name: 'Compact',
    description: 'Tighter spacing for dense content',
    ratio: 1.125,
    baseFontSize: 15,
  },
  default: {
    id: 'default',
    name: 'Default',
    description: 'Balanced and comfortable',
    ratio: 1.2,
    baseFontSize: 16,
  },
  spacious: {
    id: 'spacious',
    name: 'Spacious',
    description: 'More generous spacing',
    ratio: 1.25,
    baseFontSize: 17,
  },
};

/**
 * Line Height Presets
 *
 * Different line height configurations for headings and body text
 */
export const LINE_HEIGHTS = {
  tight: {
    id: 'tight',
    name: 'Tight',
    description: 'Condensed vertical rhythm',
    heading: 1.2,
    body: 1.4,
  },
  normal: {
    id: 'normal',
    name: 'Normal',
    description: 'Standard comfortable reading',
    heading: 1.3,
    body: 1.5,
  },
  relaxed: {
    id: 'relaxed',
    name: 'Relaxed',
    description: 'Airy and spacious',
    heading: 1.4,
    body: 1.7,
  },
};

/**
 * Get fonts grouped by category
 * @returns {Object} Fonts organized by category
 */
export function getFontsByCategory() {
  return Object.entries(FONT_CATALOG).reduce((acc, [id, font]) => {
    if (!acc[font.category]) {
      acc[font.category] = [];
    }
    acc[font.category].push({ id, ...font });
    return acc;
  }, {});
}

/**
 * Get font by ID
 * @param {string} fontId - Font ID
 * @returns {Object|null} Font configuration or null
 */
export function getFont(fontId) {
  return FONT_CATALOG[fontId] || null;
}

/**
 * Get recommended fonts for a specific use
 * @param {"headings"|"body"|"both"} use - Intended use
 * @returns {Array} Array of font objects
 */
export function getRecommendedFonts(use) {
  return Object.entries(FONT_CATALOG)
    .filter(([, font]) => font.recommended === use || font.recommended === 'both')
    .map(([id, font]) => ({ id, ...font }));
}

/**
 * Font Pairing Recommendations
 *
 * Curated pairings based on design principles:
 * - Contrast: Pair different styles (serif + sans, display + clean)
 * - Harmony: Similar x-height and proportions
 * - Hierarchy: Clear visual distinction between heading and body
 */
export const FONT_PAIRINGS = {
  // Handwritten headings pair with clean, readable body fonts
  'shadows-into-light': {
    pairings: ['source-sans-3', 'nunito', 'lora'],
    reasoning: 'Clean fonts balance the expressive handwritten style',
  },
  'patrick-hand': {
    pairings: ['source-sans-3', 'merriweather', 'nunito'],
    reasoning: 'Professional body fonts complement the casual heading',
  },
  caveat: {
    pairings: ['lora', 'source-sans-3', 'crimson-text'],
    reasoning: 'Elegant script pairs with classic, readable fonts',
  },
  kalam: {
    pairings: ['nunito', 'source-sans-3', 'lora'],
    reasoning: 'Natural handwriting works with friendly, rounded fonts',
  },

  // Warm serifs pair with contrasting sans or similar serifs
  lora: {
    pairings: ['source-sans-3', 'nunito', 'alegreya'],
    reasoning: 'Clean sans-serif body provides contrast, or matching serif for cohesion',
  },
  merriweather: {
    pairings: ['source-sans-3', 'nunito', 'lora'],
    reasoning: 'Best as body font; pairs with lighter heading or clean sans',
  },
  'crimson-text': {
    pairings: ['source-sans-3', 'nunito', 'lora'],
    reasoning: 'Classic serif pairs beautifully with modern sans or warm serif',
  },
  alegreya: {
    pairings: ['source-sans-3', 'nunito', 'lora'],
    reasoning: 'Lively serif contrasts well with clean, neutral body fonts',
  },

  // Display fonts need highly readable body fonts
  'playfair-display': {
    pairings: ['source-sans-3', 'lora', 'nunito'],
    reasoning: 'Elegant display needs readable, unobtrusive body font',
  },
  'young-serif': {
    pairings: ['source-sans-3', 'nunito', 'lora'],
    reasoning: 'Vintage charm pairs with clean modern or classic body fonts',
  },

  // Sans-serif headings pair with serifs for contrast or matching sans
  'source-sans-3': {
    pairings: ['lora', 'merriweather', 'nunito'],
    reasoning: 'Clean sans heading with warm serif body creates classic contrast',
  },
  nunito: {
    pairings: ['lora', 'source-sans-3', 'merriweather'],
    reasoning: 'Rounded sans pairs with warm serifs or cleaner sans',
  },

  // System default is versatile
  'system-ui': {
    pairings: ['lora', 'merriweather', 'source-sans-3'],
    reasoning: 'System font is neutral; pair with characterful fonts for personality',
  },
};

/**
 * Get recommended body fonts for a heading font
 * @param {string} headingFontId - The selected heading font ID
 * @returns {Array} Array of recommended body fonts with reasoning
 */
export function getBodyPairings(headingFontId) {
  const pairing = FONT_PAIRINGS[headingFontId];
  if (!pairing) return [];

  return pairing.pairings.map((bodyId) => ({
    id: bodyId,
    ...FONT_CATALOG[bodyId],
    reasoning: pairing.reasoning,
  }));
}
