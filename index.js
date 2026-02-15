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
export { DesignManager, DesignManagerTrigger } from './DesignManager';
export { default } from './DesignManager';

// Context & Provider
export {
  DesignManagerProvider,
  useDesignManagerContext,
  DesignManagerContext,
} from './context/DesignManagerContext';

// Hooks
export { useDesignManager } from './hooks/useDesignManager';
export { usePanelState } from './hooks/usePanelState';
export { useColorExtraction } from './hooks/useColorExtraction';
export { useAIChat, MESSAGE_STATES } from './hooks/useAIChat';

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
} from './lib/theme-utils';

// Typography config
export {
  FONT_CATALOG,
  FONT_CATEGORIES,
  TYPE_SCALES,
  LINE_HEIGHTS,
  getFontsByCategory,
  getFont,
  getRecommendedFonts,
} from './lib/typography-config';

// Presets
export {
  BUILT_IN_PRESETS,
  getPresetById,
  applyBuiltInPreset,
  removePresetStyles,
} from './lib/presets';

// Constants
export {
  DEFAULT_STORAGE_KEY,
  DEFAULT_PANEL_KEY,
  DEFAULT_THEME,
  DEFAULT_COLOR_TOKENS,
  COLOR_TOKEN_GROUPS,
  TABS,
  getCSSVarName,
} from './lib/constants';

// Exporters
export { exportAsCSS } from './lib/exporters/css-exporter';
export { exportAsJSON, importFromJSON } from './lib/exporters/json-exporter';
export { exportAsTailwind, exportAsTailwindStatic } from './lib/exporters/tailwind-exporter';
export { exportAsTokens } from './lib/exporters/tokens-exporter';

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
} from './lib/color-utils';

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
} from './lib/contrast-checker';

// Color blindness simulation
export {
  CVD_TYPES,
  simulateColorBlindness,
  simulateAllTypes,
  areDistinguishable,
  analyzePalette,
  getCVDDescription,
} from './lib/color-blindness';

// Components (for advanced customization)
export { FloatingPanel } from './components/floating-panel/FloatingPanel';
export { PanelHeader } from './components/floating-panel/PanelHeader';

// Tabs (for advanced customization)
export { ColorsTab } from './tabs/ColorsTab';
export { TypographyTab } from './tabs/TypographyTab';
export { SurfacesTab } from './tabs/SurfacesTab';
export { AITab } from './tabs/AITab';
export { ExportTab } from './tabs/ExportTab';

// Control components
export { ColorPicker, ColorSwatch } from './components/controls/ColorPicker';
export { ContrastBadge, ContrastDetails } from './components/controls/ContrastBadge';
export { ExpandableSection } from './components/controls/ExpandableSection';
export { FontSelector, SimpleFontSelector } from './components/controls/FontSelector';
export { FontWeightSelector, VisualWeightSelector } from './components/controls/FontWeightSelector';

// Feature components
export { PhotoExtractor } from './components/features/PhotoExtractor';
export { ColorBlindnessSimulator } from './components/features/ColorBlindnessSimulator';

// AI components
export { AIChat, AIChatInput, AIChatMessage, ThemePreview } from './components/ai/AIChat';
