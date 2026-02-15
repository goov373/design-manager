# Design Manager - AI Agent Context

> React design token management tool with floating panel UI, OKLCH colors, 7 design tools, and 5 export formats.

## Quick Start

```jsx
import { DesignManager } from './design-manager';
import './design-manager/styles/design-manager.css';

<DesignManager defaultOpen={false} />
```

## Testing

No build step required - runs directly in host React app. Import and use.

## Architecture

```
design-manager/
├── DesignManager.jsx           # Main entry point
├── index.js                    # Public exports
├── components/
│   ├── floating-panel/         # Panel container (react-rnd)
│   ├── controls/               # ColorPicker, FontSelector, etc.
│   ├── features/               # PhotoExtractor, ColorBlindnessSimulator
│   ├── tools/                  # 7 design tools (AI, fonts, contrast, etc.)
│   └── ai/                     # AI chat components
├── tabs/                       # ColorsTab, TypographyTab, SurfacesTab, ToolsTab, ExportTab
├── hooks/                      # useDesignManager, usePanelState, useColorExtraction, useAIChat
├── context/                    # DesignManagerContext (theme state)
├── lib/
│   ├── exporters/              # css, json, tailwind, tokens, rules exporters
│   ├── color-utils.js          # OKLCH manipulation (culori)
│   ├── contrast-checker.js     # WCAG compliance
│   ├── color-blindness.js      # CVD simulation
│   └── constants.js            # Defaults, token definitions
└── styles/
    └── design-manager.css      # All styles (dm- prefix)
```

## Conventions

- **Colors**: OKLCH format (`oklch(0.65 0.17 55)`)
- **CSS Prefix**: All classes use `dm-` namespace
- **State**: `useDesignManagerContext()` for theme state
- **Tokens**: shadcn/ui compatible (background, foreground, primary, etc.)
- **Self-contained**: No imports outside design-manager folder

## Key Files

| Purpose | File |
|---------|------|
| Main Component | `DesignManager.jsx` |
| Theme State | `context/DesignManagerContext.jsx` |
| Color Tokens | `lib/constants.js` (DEFAULT_COLOR_TOKENS) |
| Styles | `styles/design-manager.css` |
| Public API | `index.js` |

## Common Tasks

### Add a Design Tool

1. Create component in `components/tools/NewTool.jsx`
2. Import in `tabs/ToolsTab.jsx`
3. Add card in the tools grid with icon, title, description
4. Handle `activeTool` state for expand/collapse

### Add an Export Format

1. Create `lib/exporters/format-exporter.js` with `exportAsFormat(theme)` function
2. Export from `index.js`
3. Add tab in `tabs/ExportTab.jsx` with format name and handler

### Add a Color Token

1. Add to `DEFAULT_COLOR_TOKENS` in `lib/constants.js` (both light and dark)
2. Add to appropriate group in `COLOR_TOKEN_GROUPS`
3. Add semantic metadata in `SEMANTIC_TOKEN_METADATA`
4. Update exporters if needed

### Modify Theme State

Use context methods:
```jsx
const { setColor, setToken, theme } = useDesignManagerContext();
setColor('primary', 'oklch(0.6 0.2 250)', 'light');
setToken('fontHeading', 'inter');
```

## Dependencies

- **Peer**: react >=18, react-dom >=18, lucide-react >=0.300
- **Bundled**: react-rnd, culori

## Documentation

- `docs/API_REFERENCE.md` - Full API documentation
- `docs/COLOR_SYSTEM.md` - OKLCH and contrast checking
- `docs/ARCHITECTURE.md` - Package boundaries
