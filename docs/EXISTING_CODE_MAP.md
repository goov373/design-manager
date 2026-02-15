> **DEPRECATED** (February 2026)
>
> This document was a **planning document** used during the initial extraction of Design Manager
> from the Papercraft codebase. The paths listed here reference the SOURCE project, not Design Manager itself.
>
> For current documentation, see:
> - **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Current package structure and design principles
> - **[API_REFERENCE.md](./API_REFERENCE.md)** - Public API documentation
> - **[README.md](../README.md)** - Usage and installation

---

# Source Code Extraction Map

## Files to Copy & Adapt

| Source | Destination | Changes Needed |
|--------|-------------|----------------|
| `src/lib/theme-utils.js` | `lib/theme-utils.js` | Remove BUILT_IN_PRESETS (move to presets.js), make storage keys configurable |
| `src/lib/typography-config.js` | `lib/typography-config.js` | None - already generic |
| `src/components/theme-manager/controls/color-picker.jsx` | `components/controls/ColorPicker.jsx` | Update imports to local paths |
| `src/components/theme-manager/controls/font-selector.jsx` | `components/controls/FontSelector.jsx` | Update imports to local paths |
| `src/components/theme-manager/controls/font-weight-selector.jsx` | `components/controls/FontWeightSelector.jsx` | Update imports to local paths |
| `src/components/theme-manager/controls/line-height-control.jsx` | `components/controls/LineHeightControl.jsx` | Update imports to local paths |
| `src/components/theme-manager/controls/type-scale-selector.jsx` | `components/controls/TypeScaleSelector.jsx` | Update imports to local paths |
| `src/components/theme-manager/controls/token-slider.jsx` | `components/controls/TokenSlider.jsx` | Update imports to local paths |
| `src/components/theme-manager/controls/shadow-preview.jsx` | `components/controls/ShadowPreview.jsx` | Update imports to local paths |
| `src/components/theme-manager/controls/typography-preview.jsx` | `components/controls/TypographyPreview.jsx` | Update imports to local paths |
| `src/components/theme-manager/typography-tab.jsx` | `tabs/TypographyTab.jsx` | Update imports, remove Papercraft refs |
| `src/components/theme-manager/papercraft-tab.jsx` | `tabs/SurfacesTab.jsx` | Rename, update imports |
| `src/components/theme-manager/presets-tab.jsx` | `tabs/PresetsSection.jsx` | Convert to section within Export tab |
| `src/components/tinte-editor.jsx` | `components/ai/AIChat.jsx` | Extract chat components ONLY, remove tinte.dev refs |

## Files to Create New

| File | Purpose |
|------|---------|
| `index.js` | Public exports |
| `DesignManager.jsx` | Main component with FloatingPanel + tabs |
| `context/DesignManagerContext.jsx` | Theme state management |
| `hooks/useDesignManager.js` | Public API hook |
| `hooks/usePanelState.js` | Panel position/size persistence |
| `hooks/useThemeHistory.js` | Undo/redo functionality |
| `hooks/useColorExtraction.js` | Photo color extraction |
| `lib/constants.js` | Default values and configuration |
| `lib/presets.js` | Built-in theme presets (extracted from theme-utils) |
| `lib/color-utils.js` | Culori-based color manipulation |
| `lib/contrast-checker.js` | WCAG contrast calculation |
| `lib/color-blindness.js` | CVD simulation (Brettel algorithm) |
| `lib/exporters/css-exporter.js` | Export theme as CSS variables |
| `lib/exporters/json-exporter.js` | Export theme as JSON |
| `lib/exporters/tailwind-exporter.js` | Export as Tailwind config |
| `lib/exporters/tokens-exporter.js` | Export as W3C Design Tokens |
| `components/floating-panel/FloatingPanel.jsx` | react-rnd wrapper |
| `components/floating-panel/PanelHeader.jsx` | Drag handle, controls |
| `components/controls/ContrastBadge.jsx` | WCAG badge display |
| `components/controls/ExpandableSection.jsx` | Collapsible sections |
| `components/features/PhotoExtractor.jsx` | Image upload + extraction |
| `components/features/ColorBlindnessSimulator.jsx` | CVD simulation toggle |
| `components/ai/ThemePreview.jsx` | Preview AI-generated themes |
| `tabs/ColorsTab.jsx` | Color token editor |
| `tabs/AITab.jsx` | AI chat interface |
| `tabs/ExportTab.jsx` | Multi-format export |
| `styles/design-manager.css` | Scoped component styles |

## Import Path Mapping

When adapting files, replace these import patterns:

| Original | New |
|----------|-----|
| `@/lib/theme-utils` | `../lib/theme-utils` |
| `@/lib/typography-config` | `../lib/typography-config` |
| `@/lib/utils` | `../lib/utils` |
| `@/components/ui/*` | Keep as peer dependency OR inline |
| `@/context/ThemeContext` | `../context/DesignManagerContext` |

## shadcn/ui Components Used

These components from Papercraft need to be handled:

1. **Keep as peer dependency**: Button, Input, Label, Slider, Select, Tabs
2. **Inline simple ones**: Badge (too simple to depend)
3. **Create custom**: FloatingPanel (uses react-rnd instead of Dialog)

## Tinte Editor Extraction

From `src/components/tinte-editor.jsx`, extract ONLY:
- Chat message rendering logic
- Chat input component
- Message state management

DO NOT extract:
- Tinte.dev browsing/fetching
- Community themes listing
- Any `tinte.dev` API calls
