/**
 * useDesignManager Hook
 *
 * Public API hook for accessing theme state from any component
 * inside the DesignManagerProvider.
 */

import { useDesignManagerContext } from '../context/DesignManagerContext';
import { exportAsCSS } from '../lib/exporters/css-exporter';
import { exportAsJSON, importFromJSON } from '../lib/exporters/json-exporter';
import { exportAsTailwind } from '../lib/exporters/tailwind-exporter';
import { exportAsTokens } from '../lib/exporters/tokens-exporter';

/**
 * Access theme state and actions from any component inside the provider.
 *
 * @example
 * ```jsx
 * function MyComponent() {
 *   const { theme, darkMode, setDarkMode, setToken } = useDesignManager();
 *
 *   return (
 *     <button onClick={() => setDarkMode(!darkMode)}>
 *       Toggle Dark Mode
 *     </button>
 *   );
 * }
 * ```
 *
 * @returns {Object} Design Manager API
 */
export function useDesignManager() {
  const context = useDesignManagerContext();

  /**
   * Export the current theme in the specified format
   * @param {'css' | 'json' | 'tailwind' | 'tokens'} format
   * @returns {string} Exported theme string
   */
  function exportTheme(format) {
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
      default:
        throw new Error(`Unknown export format: ${format}`);
    }
  }

  /**
   * Import a theme from a string
   * @param {string} data - Theme data string
   * @param {'css' | 'json' | 'tailwind' | 'tokens'} format
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
    // State
    theme: context.theme,
    darkMode: context.darkMode,
    activeTab: context.activeTab,
    colors: context.colors,

    // History
    canUndo: context.canUndo,
    canRedo: context.canRedo,

    // Basic actions
    setToken: context.setToken,
    setColor: context.setColor,
    setDarkMode: context.setDarkMode,
    setActiveTab: context.setActiveTab,
    applyPreset: context.applyPreset,
    undo: context.undo,
    redo: context.redo,
    resetToDefaults: context.resetToDefaults,

    // Export/Import
    exportTheme,
    importTheme: importThemeFromString,
  };
}

export default useDesignManager;
