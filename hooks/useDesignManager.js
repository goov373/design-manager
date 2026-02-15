/**
 * useDesignManager Hook
 *
 * Public API hook for accessing theme state from any component
 * inside the DesignManagerProvider.
 *
 * @module hooks/useDesignManager
 */

import { useDesignManagerContext } from '../context/DesignManagerContext';
import { exportAsCSS } from '../lib/exporters/css-exporter';
import { exportAsJSON, importFromJSON } from '../lib/exporters/json-exporter';
import { exportAsTailwind } from '../lib/exporters/tailwind-exporter';
import { exportAsTokens } from '../lib/exporters/tokens-exporter';
import { exportAsAIRules } from '../lib/exporters/rules-exporter';

/**
 * @typedef {Object} DesignManagerAPI
 * @property {Object} theme - Current theme configuration (typography, spacing, surfaces, etc.)
 * @property {boolean} darkMode - Whether dark mode is currently enabled
 * @property {string} activeTab - Currently active panel tab identifier
 * @property {Object} colors - Color tokens object with light and dark mode values
 * @property {Object.<string, string>} colors.light - Light mode color tokens
 * @property {Object.<string, string>} colors.dark - Dark mode color tokens
 * @property {boolean} canUndo - Whether undo is available in history
 * @property {boolean} canRedo - Whether redo is available in history
 * @property {function(string, any): void} setToken - Update a theme token value
 * @property {function(string, string, string): void} setColor - Update a color token (tokenKey, value, mode)
 * @property {function(boolean): void} setDarkMode - Toggle dark mode on/off
 * @property {function(string): void} setActiveTab - Change the active panel tab
 * @property {function(Object): void} applyPreset - Apply a theme preset
 * @property {function(): void} undo - Undo the last change
 * @property {function(): void} redo - Redo the last undone change
 * @property {function(): void} resetToDefaults - Reset theme to default values
 * @property {function(string, Object=): string} exportTheme - Export theme in specified format
 * @property {function(string, string): void} importTheme - Import theme from string data
 */

/**
 * Access theme state and actions from any component inside the DesignManagerProvider.
 * Provides a complete API for reading and modifying the design system.
 *
 * @returns {DesignManagerAPI} Design Manager API with state and actions
 *
 * @example
 * // Basic usage - toggle dark mode
 * function MyComponent() {
 *   const { theme, darkMode, setDarkMode, setToken } = useDesignManager();
 *
 *   return (
 *     <button onClick={() => setDarkMode(!darkMode)}>
 *       Toggle Dark Mode
 *     </button>
 *   );
 * }
 *
 * @example
 * // Update a color token
 * function ColorPicker() {
 *   const { colors, setColor } = useDesignManager();
 *
 *   const handleColorChange = (newColor) => {
 *     setColor('primary', newColor, 'light');
 *   };
 *
 *   return <input type="color" onChange={(e) => handleColorChange(e.target.value)} />;
 * }
 *
 * @example
 * // Export theme as CSS
 * function ExportButton() {
 *   const { exportTheme } = useDesignManager();
 *
 *   const handleExport = () => {
 *     const css = exportTheme('css');
 *     navigator.clipboard.writeText(css);
 *   };
 *
 *   return <button onClick={handleExport}>Copy CSS</button>;
 * }
 */
export function useDesignManager() {
  const context = useDesignManagerContext();

  /**
   * Exports the current theme in the specified format.
   * Supports CSS variables, JSON, Tailwind config, design tokens, and AI rules.
   *
   * @param {'css' | 'json' | 'tailwind' | 'tokens' | 'rules'} format - Export format
   * @param {Object} [options={}] - Export options (used for 'rules' format)
   * @param {string} [options.format] - AI rules format: 'markdown', 'cursor', or 'claude'
   * @param {string} [options.scope] - AI rules scope: 'full', 'colors', or 'typography'
   * @returns {string} Exported theme as a formatted string
   * @throws {Error} If an unknown format is specified
   *
   * @example
   * // Export as CSS variables
   * const css = exportTheme('css');
   * // Returns: ':root { --background: oklch(...); ... }'
   *
   * @example
   * // Export as AI rules for Cursor
   * const cursorRules = exportTheme('rules', { format: 'cursor' });
   */
  function exportTheme(format, options = {}) {
    const { theme, colors, darkMode } = context;

    switch (format) {
      case 'css':
        return exportAsCSS({ ...theme, colors });
      case 'json':
        return exportAsJSON({ ...theme, colors });
      case 'tailwind':
        return exportAsTailwind({ ...theme, colors });
      case 'tokens':
        return exportAsTokens({ ...theme, colors });
      case 'rules':
        return exportAsAIRules(theme, colors, options);
      default:
        throw new Error(`Unknown export format: ${format}`);
    }
  }

  /**
   * Imports a theme from a string in the specified format.
   * Currently supports JSON format; other formats show a warning.
   *
   * @param {string} data - Theme data string to import
   * @param {'css' | 'json' | 'tailwind' | 'tokens'} format - Import format
   * @returns {void}
   *
   * @example
   * // Import from JSON string
   * const jsonData = '{"theme": {...}, "colors": {...}}';
   * importThemeFromString(jsonData, 'json');
   */
  function importThemeFromString(data, format) {
    switch (format) {
      case 'json': {
        const parsed = importFromJSON(data);
        if (parsed) {
          context.importTheme(parsed);
        }
        break;
      }
      default:
        console.warn(`Import from ${format} not yet implemented`);
    }
  }

  return {
    // State - Read-only access to current theme values
    /** @type {Object} Current theme configuration */
    theme: context.theme,
    /** @type {boolean} Whether dark mode is enabled */
    darkMode: context.darkMode,
    /** @type {string} Currently active panel tab */
    activeTab: context.activeTab,
    /** @type {{light: Object, dark: Object}} Color tokens for both modes */
    colors: context.colors,

    // History - Undo/redo state
    /** @type {boolean} Whether undo is available */
    canUndo: context.canUndo,
    /** @type {boolean} Whether redo is available */
    canRedo: context.canRedo,

    // Basic actions - Modify theme state
    /** @type {function(string, any): void} Update a theme token */
    setToken: context.setToken,
    /** @type {function(string, string, string): void} Update a color (key, value, mode) */
    setColor: context.setColor,
    /** @type {function(boolean): void} Toggle dark mode */
    setDarkMode: context.setDarkMode,
    /** @type {function(string): void} Change active tab */
    setActiveTab: context.setActiveTab,
    /** @type {function(Object): void} Apply a preset */
    applyPreset: context.applyPreset,
    /** @type {function(): void} Undo last change */
    undo: context.undo,
    /** @type {function(): void} Redo last undone change */
    redo: context.redo,
    /** @type {function(): void} Reset to defaults */
    resetToDefaults: context.resetToDefaults,

    // Export/Import - Theme serialization
    /** @type {function(string, Object=): string} Export theme in format */
    exportTheme,
    /** @type {function(string, string): void} Import theme from string */
    importTheme: importThemeFromString,
  };
}

export default useDesignManager;
