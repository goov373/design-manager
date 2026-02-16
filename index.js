/**
 * @gavin/design-manager
 *
 * Standalone design/theme management tool for React applications.
 *
 * @example
 * ```jsx
 * import { DesignManager, useDesignManager } from '@gavin/design-manager';
 *
 * function App() {
 *   return (
 *     <div>
 *       <YourApp />
 *       <DesignManager />
 *     </div>
 *   );
 * }
 * ```
 */

// Main component
export { DesignManager, DesignManagerTrigger } from './DesignManager.jsx';
export { default } from './DesignManager.jsx';

// Context & Provider
export {
  DesignManagerProvider,
  useDesignManagerContext,
  DesignManagerContext,
} from './context/DesignManagerContext.jsx';

// Hooks
export { useDesignManager } from './hooks/useDesignManager.jsx';
export { usePanelState } from './hooks/usePanelState.jsx';
export { useColorExtraction } from './hooks/useColorExtraction.jsx';
export { useAIChat, MESSAGE_STATES } from './hooks/useAIChat.jsx';

// Lib utilities
export {
  setCSSVariable,
  getCSSVariable,
  applyThemeToDOM,
  applyTypographyToDOM,
  loadGoogleFont,
  getFontFamily,
  hexToOklch,
  oklchToHex,
  loadThemeFromStorage,
  saveThemeToStorage,
  getDefaultTheme,
  generateGoogleFontsImport,
  exportTypographyAsCSS,
} from './lib/theme-utils.js';

// Typography config
export {
  FONT_CATALOG,
  FONT_CATEGORIES,
  TYPE_SCALES,
  LINE_HEIGHTS,
  getFontsByCategory,
  getFont,
  getRecommendedFonts,
} from './lib/typography-config.js';

// Presets
export {
  BUILT_IN_PRESETS,
  getPresetById,
  applyBuiltInPreset,
  removePresetStyles,
} from './lib/presets.js';

// Constants
export {
  DEFAULT_STORAGE_KEY,
  DEFAULT_PANEL_KEY,
  DEFAULT_THEME,
  DEFAULT_COLOR_TOKENS,
  COLOR_TOKEN_GROUPS,
  TABS,
  getCSSVarName,
} from './lib/constants.js';

// Exporters
export { exportAsCSS } from './lib/exporters/css-exporter.js';
export { exportAsJSON, importFromJSON } from './lib/exporters/json-exporter.js';
export { exportAsTailwind, exportAsTailwindStatic } from './lib/exporters/tailwind-exporter.js';
export { exportAsTokens } from './lib/exporters/tokens-exporter.js';

// Color utilities
export {
  parseToOklch,
  toOklchString,
  toHexString,
  adjustLightness,
  adjustChroma,
  shiftHue,
  generatePalette,
  generateHarmony,
  mixColors,
  isLightColor,
  getContrastingTextColor,
} from './lib/color-utils.js';

// Contrast checking
export {
  WCAG_THRESHOLDS,
  getContrastRatio,
  checkContrast,
  getComplianceLevel,
  getContrastScore,
  suggestAccessibleColor,
  getAccessiblePairs,
  getContrastBadge,
} from './lib/contrast-checker.js';

// Color blindness simulation
export {
  CVD_TYPES,
  simulateColorBlindness,
  simulateAllTypes,
  areDistinguishable,
  analyzePalette,
  getCVDDescription,
} from './lib/color-blindness.js';

// Components (for advanced customization)
export { FloatingPanel } from './components/floating-panel/FloatingPanel.jsx';
export { PanelHeader } from './components/floating-panel/PanelHeader.jsx';

// Tabs (for advanced customization)
export { ColorsTab } from './tabs/ColorsTab.jsx';
export { TypographyTab } from './tabs/TypographyTab.jsx';
export { SurfacesTab } from './tabs/SurfacesTab.jsx';
export { ToolsTab } from './tabs/ToolsTab.jsx';
export { ExportTab } from './tabs/ExportTab.jsx';

// Control components
export { ColorPicker, ColorSwatch } from './components/controls/ColorPicker.jsx';
export { ContrastBadge, ContrastDetails } from './components/controls/ContrastBadge.jsx';
export { ExpandableSection } from './components/controls/ExpandableSection.jsx';
export { FontSelector, SimpleFontSelector } from './components/controls/FontSelector.jsx';
export { FontWeightSelector, VisualWeightSelector } from './components/controls/FontWeightSelector.jsx';

// Feature components
export { PhotoExtractor } from './components/features/PhotoExtractor.jsx';
export { ColorBlindnessSimulator } from './components/features/ColorBlindnessSimulator.jsx';

// AI components
export { AIChat, AIChatInput, AIChatMessage, ThemePreview } from './components/ai/AIChat.jsx';
