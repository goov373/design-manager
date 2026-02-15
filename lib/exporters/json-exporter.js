/**
 * JSON Exporter
 *
 * Exports theme as structured JSON with metadata.
 */

/**
 * Export theme as JSON
 * @param {Object} theme - Theme state
 * @returns {string} JSON string
 */
export function exportAsJSON(theme) {
  const { colors, history, historyIndex, activeTab, panelOpen, ...tokens } = theme;

  const exportData = {
    $schema: 'https://design-manager.dev/schema/v1.json',
    name: 'Design Manager Theme',
    version: '1.0.0',
    exportedAt: new Date().toISOString(),

    colors: {
      light: colors?.light || {},
      dark: colors?.dark || {},
    },

    typography: {
      fontHeading: tokens.fontHeading || 'system-ui',
      fontBody: tokens.fontBody || 'system-ui',
      fontWeightHeading: tokens.fontWeightHeading || 600,
      fontWeightBody: tokens.fontWeightBody || 400,
      typeScale: tokens.typeScale || 'default',
      lineHeightPreset: tokens.lineHeightPreset || 'normal',
    },

    surfaces: {
      paperWhite: tokens.paperWhite,
      paperCream: tokens.paperCream,
      paperKraft: tokens.paperKraft,
    },

    tokens: {
      radius: tokens.radius,
      textureOpacity: tokens.textureOpacityFaint,
    },

    preferences: {
      darkMode: tokens.darkMode || false,
      activePresetId: tokens.activePresetId || 'default',
    },
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Import theme from JSON string
 * @param {string} jsonString - JSON string
 * @returns {Object|null} Parsed theme or null if invalid
 */
export function importFromJSON(jsonString) {
  try {
    const data = JSON.parse(jsonString);

    // Validate basic structure
    if (!data.colors || !data.typography) {
      console.warn('Invalid theme JSON: missing required fields');
      return null;
    }

    return {
      colors: data.colors,
      fontHeading: data.typography.fontHeading,
      fontBody: data.typography.fontBody,
      fontWeightHeading: data.typography.fontWeightHeading,
      fontWeightBody: data.typography.fontWeightBody,
      typeScale: data.typography.typeScale,
      lineHeightPreset: data.typography.lineHeightPreset,
      paperWhite: data.surfaces?.paperWhite,
      paperCream: data.surfaces?.paperCream,
      paperKraft: data.surfaces?.paperKraft,
      radius: data.tokens?.radius,
      textureOpacityFaint: data.tokens?.textureOpacity,
      darkMode: data.preferences?.darkMode,
      activePresetId: data.preferences?.activePresetId,
    };
  } catch (e) {
    console.error('Failed to parse theme JSON:', e);
    return null;
  }
}

export default exportAsJSON;
