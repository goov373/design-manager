# Design Manager Architecture

## Package Identity

**Name:** `@gavin/design-manager`
**Purpose:** Standalone, extractable design/theme management tool
**Target:** npm-publishable package usable in any React 18+ application

## Package Boundaries

This package is SELF-CONTAINED. It must not import from:
- `@/components/` (Papercraft components)
- `@/context/` (Papercraft contexts)
- `@/lib/` outside design-manager (Papercraft utilities)
- Any path using `../` that escapes the design-manager folder

## Allowed External Dependencies

### Peer Dependencies (host app provides)
- `react` >= 18
- `react-dom` >= 18
- `lucide-react` >= 0.300.0

### Direct Dependencies (bundled)
- `react-rnd` - Panel dragging/resizing
- `@floating-ui/react` - Tooltip/popover positioning
- `culori` - Color manipulation and conversion

## Folder Structure

```
src/design-manager/
├── index.js                    # Public exports
├── DesignManager.jsx           # Main component
├── .progress.json              # Build progress tracking
├── docs/                       # Documentation
├── context/                    # React context
├── components/                 # React components
│   ├── floating-panel/
│   ├── controls/
│   ├── features/
│   └── ai/
├── tabs/                       # Tab content
├── hooks/                      # React hooks
├── lib/                        # Utilities
│   └── exporters/
└── styles/                     # CSS
```

## State Shape

```javascript
const themeState = {
  darkMode: false,
  colors: { light: {}, dark: {} },
  typography: {
    fontHeading: 'system-ui',
    fontBody: 'system-ui',
    fontWeightHeading: 600,
    fontWeightBody: 400,
    typeScale: 'default',
    lineHeightPreset: 'normal',
  },
  surfaces: {
    paperWhite: 'oklch(0.98 0.01 90)',
    paperCream: 'oklch(0.96 0.02 85)',
    paperKraft: 'oklch(0.75 0.08 70)',
  },
  radius: 0.625,
  textureOpacity: 0.04,
  activeTab: 'colors',
  panelOpen: true,
  history: [],
  historyIndex: -1,
  activePresetId: 'default',
};
```

## Extractability Rules

1. **No Papercraft imports**: All imports must be within design-manager/
2. **No hardcoded selectors**: Use configurable class prefixes
3. **Peer dependencies**: React, ReactDOM, lucide-react provided by host
4. **CSS scoping**: All styles prefixed with `dm-` namespace
5. **Configuration via props**: Storage keys, positions, callbacks configurable
6. **No side effects on import**: Only apply styles when component mounts
