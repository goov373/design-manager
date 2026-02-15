# @gavin/design-manager

A standalone, extractable design/theme management tool for React applications. Features a floating panel UI with real-time theme editing, color management, typography controls, AI theme generation, and multi-format export.

## Features

### Core Features
- **Floating Panel UI**: Draggable, resizable panel with minimize/maximize
- **Color Management**: Full color token editor with OKLCH support
- **Contrast Checking**: WCAG 2.1 compliance badges
- **Color Blindness Simulation**: Test accessibility with CVD filters
- **Photo Color Extraction**: Extract palettes from images
- **Typography Controls**: Font selection, weights, type scale, line height
- **Surface Controls**: Paper colors, border radius, texture
- **AI Theme Generation**: Chat-based theme generation (requires API key)
- **Multi-Format Export**: CSS, JSON, Tailwind, W3C Design Tokens, AI Rules
- **Undo/Redo**: Full history with keyboard shortcuts (Cmd+Z)
- **Dark Mode**: Built-in dark mode toggle with auto-generation
- **Accessible**: ARIA labels, keyboard navigation, reduced motion support

### AI Integration (Phase 1)
- **AI Rules Export**: Export your design system as AI-readable rules for Claude, Cursor, and ChatGPT
- **"Copy for AI" Buttons**: One-click copy of tool outputs formatted for AI consumption
- **Semantic Token Metadata**: Each color token includes usage descriptions and AI hints for context-aware code generation

### Panel UX (v1.1.0)
- **Centered Opening**: Panel always opens centered in viewport for predictable UX
- **Edge Snapping**: Magnetic snap to screen edges (20px threshold, 24px margin)
- **Visual Drag Feedback**: Shadow lift and cursor states during drag
- **Visible Resize Handle**: Corner indicator shows panel is resizable
- **Fixed Viewport Position**: Panel stays fixed while page content scrolls
- **GPU Acceleration**: Smooth 60fps animations with `will-change: transform`

## Installation

### As npm Package (coming soon)

```bash
npm install @gavin/design-manager
```

### As Local Symlink

For development or project-specific customization:

```bash
# Clone the repo
git clone https://github.com/goov373/design-manager.git

# In your project, create a symlink
ln -s /path/to/design-manager src/design-manager

# Install peer dependencies
npm install react-rnd lucide-react
```

## Quick Start

```jsx
import { DesignManager } from './design-manager';
import './design-manager/styles/design-manager.css';

function App() {
  return (
    <div>
      <YourApp />
      <DesignManager defaultOpen={false} />
    </div>
  );
}
```

## Props

### `<DesignManager />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialTheme` | `object` | `{}` | Initial theme values |
| `onChange` | `function` | - | Callback on theme change |
| `storageKey` | `string` | `'design-manager-theme'` | localStorage key for theme |
| `panelStorageKey` | `string` | `'design-manager-panel'` | localStorage key for panel state |
| `position` | `string` | `'center'` | Initial position: `'center'`, `'bottom-right'`, `'bottom-left'`, `'top-right'`, `'top-left'` |
| `defaultOpen` | `boolean` | `false` | Whether panel starts open |
| `apiKey` | `string` | - | OpenAI API key for AI features |
| `apiEndpoint` | `string` | `'/api/design-manager/chat'` | Custom API endpoint for AI chat |

## Opening the Panel Programmatically

The Design Manager listens for custom events to open/close/toggle the panel:

```jsx
// Open the panel
window.dispatchEvent(new CustomEvent('design-manager:open'));

// Close the panel
window.dispatchEvent(new CustomEvent('design-manager:close'));

// Toggle the panel
window.dispatchEvent(new CustomEvent('design-manager:toggle'));
```

### Example: Button to Open Panel

```jsx
function OpenDesignManagerButton() {
  const openPanel = () => {
    window.dispatchEvent(new CustomEvent('design-manager:open'));
  };

  return (
    <button onClick={openPanel}>
      Open Design Manager
    </button>
  );
}
```

## Hooks

### `useDesignManager()`

Access theme state from any component inside the provider.

```jsx
import { useDesignManagerContext } from './design-manager/context/DesignManagerContext';

function MyComponent() {
  const {
    theme,
    darkMode,
    setDarkMode,
    setToken,
    setColor,
    exportTheme,
    importTheme,
    canUndo,
    canRedo,
    undo,
    redo,
  } = useDesignManagerContext();

  return (
    <button onClick={() => setDarkMode(!darkMode)}>
      Toggle Dark Mode
    </button>
  );
}
```

### `usePanelState()`

Manage floating panel state independently.

```jsx
import { usePanelState } from './design-manager/hooks/usePanelState';

function CustomPanel() {
  const {
    isOpen,
    isMinimized,
    position,
    size,
    open,
    close,
    toggle,
    toggleMinimize,
    onDragStop,
    onResizeStop,
  } = usePanelState({
    storageKey: 'my-panel-state',
    position: 'center',
    defaultOpen: false,
  });

  // Use with FloatingPanel component
}
```

## Design Tools

The Tools tab provides 8 AI-powered design utilities:

| Tool | Description |
|------|-------------|
| **AI Theme Generator** | Describe your ideal theme in plain language and generate complete light/dark palettes |
| **Smart Font Pairing** | Select a heading font and get AI-recommended body font pairings with live preview |
| **Accessible Palette** | Generate complete color palettes that meet WCAG requirements from the start |
| **Contrast Fixer** | Fix failing color pairs with minimal adjustment while preserving brand colors |
| **Live Preview Tester** | See your colors on a realistic UI mockup with side-by-side light/dark mode and CVD simulation |
| **Dark Mode Generator** | Generate dark mode palettes with live preview and fine-tuning controls (works both ways) |
| **Design Token Scales** | Generate harmonious spacing, border-radius, and shadow scales using mathematical ratios |
| **Photo Color Extractor** | Upload an image and automatically extract a harmonious color palette |

## Export Formats

Export your design system in 5 formats:

| Format | Extension | Use Case |
|--------|-----------|----------|
| **CSS Variables** | `.css` | Direct use in any CSS project with `:root` variables |
| **JSON** | `.json` | Import/export themes, use with build tools or APIs |
| **Tailwind Config** | `.js` | Drop into `tailwind.config.js` for full Tailwind integration |
| **W3C Design Tokens** | `.tokens.json` | Standard format for design tool interoperability (Figma, Tokens Studio) |
| **AI Rules** | `.md` / `.mdc` | Machine-readable rules for Claude, Cursor, and ChatGPT |

### AI Rules Export Options

The AI Rules format includes sub-options for different AI tools:

- **Markdown**: General format for Claude/ChatGPT chat - paste directly into conversations
- **Cursor Rules**: `.mdc` format for `.cursor/rules/` - provides automatic context in Cursor IDE
- **Claude Instructions**: XML-structured format optimized for Claude project instructions

Each format can be scoped to Full System, Colors Only, or Typography Only.

## File Structure

```
design-manager/
├── DesignManager.jsx              # Main component entry point
├── index.js                       # Package exports
├── package.json
├── components/
│   ├── ai/
│   │   └── AIChat.jsx             # AI chat interface
│   ├── controls/
│   │   ├── ColorPicker.jsx        # OKLCH color picker
│   │   ├── ContrastBadge.jsx      # WCAG compliance indicator
│   │   ├── ExpandableSection.jsx  # Collapsible section component
│   │   ├── FontSelector.jsx       # Font family selector
│   │   └── FontWeightSelector.jsx # Font weight selector
│   ├── features/
│   │   ├── ColorBlindnessSimulator.jsx # CVD simulation filters
│   │   └── PhotoExtractor.jsx     # Image color extraction
│   ├── floating-panel/
│   │   ├── FloatingPanel.jsx      # Draggable/resizable container
│   │   └── PanelHeader.jsx        # Header with controls
│   └── tools/
│       ├── AccessiblePaletteGenerator.jsx # WCAG-compliant palette generator
│       ├── AIThemeGenerator.jsx   # AI-powered theme generation
│       ├── ContrastFixer.jsx      # Fix failing color contrasts
│       ├── DarkModeGenerator.jsx  # Light/dark mode conversion
│       ├── FontPairing.jsx        # Font pairing suggestions
│       ├── LivePreview.jsx        # Real-time UI mockup preview
│       └── TokenScaleGenerator.jsx # Mathematical scale generator
├── context/
│   └── DesignManagerContext.jsx   # Theme state provider
├── hooks/
│   ├── useAIChat.js               # AI chat state management
│   ├── useColorExtraction.js      # Photo color extraction
│   ├── useDesignManager.js        # Main design manager hook
│   └── usePanelState.js           # Panel position/size/state
├── lib/
│   ├── ai-copy-utils.js           # AI-friendly output formatters
│   ├── color-blindness.js         # CVD simulation algorithms
│   ├── color-utils.js             # Color manipulation (OKLCH)
│   ├── constants.js               # Configuration & semantic token metadata
│   ├── contrast-checker.js        # WCAG contrast calculations
│   ├── exporters/
│   │   ├── css-exporter.js        # CSS variables export
│   │   ├── json-exporter.js       # JSON theme export
│   │   ├── rules-exporter.js      # AI rules export (Claude, Cursor, ChatGPT)
│   │   ├── tailwind-exporter.js   # Tailwind config export
│   │   └── tokens-exporter.js     # W3C Design Tokens export
│   ├── presets.js                 # Built-in theme presets
│   ├── theme-utils.js             # Theme manipulation utilities
│   └── typography-config.js       # Type scales and line heights
├── styles/
│   └── design-manager.css         # All component styles
└── tabs/
    ├── ColorsTab.jsx              # Color token management
    ├── ExportTab.jsx              # Export & presets
    ├── SurfacesTab.jsx            # Paper/texture controls
    ├── ToolsTab.jsx               # Design tools hub
    └── TypographyTab.jsx          # Font controls
```

## Theme Structure

```javascript
{
  // Colors (light and dark mode)
  colors: {
    light: {
      background: 'oklch(0.99 0.005 90)',
      foreground: 'oklch(0.20 0.02 90)',
      card: 'oklch(0.99 0.005 90)',
      cardForeground: 'oklch(0.20 0.02 90)',
      primary: 'oklch(0.65 0.17 55)',
      primaryForeground: 'oklch(0.99 0.005 90)',
      secondary: 'oklch(0.94 0.03 90)',
      secondaryForeground: 'oklch(0.30 0.02 90)',
      muted: 'oklch(0.94 0.03 90)',
      mutedForeground: 'oklch(0.50 0.03 90)',
      accent: 'oklch(0.94 0.03 90)',
      accentForeground: 'oklch(0.30 0.02 90)',
      destructive: 'oklch(0.55 0.22 25)',
      destructiveForeground: 'oklch(0.99 0.005 90)',
      border: 'oklch(0.88 0.03 90)',
      input: 'oklch(0.88 0.03 90)',
      ring: 'oklch(0.65 0.17 55)',
    },
    dark: {
      // Inverted colors for dark mode
    }
  },

  // Typography
  fontHeading: 'inter',
  fontBody: 'system-ui',
  fontWeightHeading: 600,
  fontWeightBody: 400,
  typeScale: 'default', // 'compact' | 'default' | 'spacious'
  lineHeightPreset: 'normal', // 'tight' | 'normal' | 'relaxed'

  // Surfaces
  paperWhite: 'oklch(0.98 0.01 90)',
  paperCream: 'oklch(0.96 0.02 85)',
  paperKraft: 'oklch(0.75 0.08 70)',
  radius: 0.625,
  textureOpacityFaint: 0.04,

  // UI State
  darkMode: false,
}
```

## Key Features Explained

### Generate Dark Mode from Light

The Colors tab includes a "Generate dark mode from light" button that intelligently inverts your light mode colors using OKLCH color space:

- **Backgrounds**: Inverted to dark (L: 0.12-0.35)
- **Foregrounds**: Inverted to light (L: 0.85-0.98)
- **Borders/Inputs**: Adjusted for dark mode visibility
- **Primary colors**: Lightness boosted for dark backgrounds
- **Destructive colors**: Maintains recognizability

### Edge Snapping

When dragging the panel near screen edges, it magnetically snaps to a comfortable margin:

- **Threshold**: 20px from edge triggers snap
- **Margin**: Panel snaps to 24px from edge
- Works on all four edges (top, right, bottom, left)

### Fixed Viewport Positioning

The panel uses a fixed wrapper pattern to stay in place while the page scrolls:

```css
.dm-fixed-wrapper {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 10000;
}
```

## AI Integration

To enable AI theme generation, provide an OpenAI API key:

```jsx
<DesignManager apiKey="sk-..." />
```

Or use a custom API endpoint:

```jsx
<DesignManager apiEndpoint="/api/theme-chat" />
```

### Custom Endpoint Format

Your endpoint should accept POST requests with:

```json
{
  "message": "User's theme request",
  "history": [{ "role": "user", "content": "..." }, ...]
}
```

And return:

```json
{
  "message": "JSON theme object or explanation"
}
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + Z` | Undo |
| `Cmd/Ctrl + Shift + Z` | Redo |
| `Escape` | Close panel |
| `Arrow keys` | Navigate tabs |
| `Tab` | Navigate controls |

## Peer Dependencies

```json
{
  "react": "^18.0.0 || ^19.0.0",
  "react-dom": "^18.0.0 || ^19.0.0",
  "react-rnd": "^10.4.0",
  "lucide-react": "^0.400.0"
}
```

## Browser Support

- Chrome/Edge 90+
- Firefox 90+
- Safari 15+

## Changelog

### v1.2.0 (2026-02-15) - AI Integration Phase 1
- **AI Rules Export**: New export format for Claude, Cursor, and ChatGPT
  - Markdown format for chat-based AI tools
  - Cursor Rules (.mdc) format for automatic IDE context
  - Claude Instructions (XML) format for project instructions
- **Semantic Token Metadata**: Color tokens now include usage descriptions and AI hints
- **"Copy for AI" Utilities**: Tool outputs formatted for AI consumption
- **8 Design Tools**: AI Theme Generator, Font Pairing, Accessible Palette, Contrast Fixer, Live Preview, Dark Mode Generator, Token Scales, Photo Extractor
- **W3C Design Tokens Export**: Added tokens-exporter for standard interoperability

### v1.1.0 (2026-02-15)
- Panel now opens centered in viewport
- Added edge snapping (20px threshold, 24px margin)
- Visual drag feedback with shadow lift
- Visible resize handle indicator
- Panel stays fixed during page scroll
- Implemented "Generate dark mode from light" feature
- Fixed AI tab scroll jump on mount
- Increased default panel size to 600x800
- GPU-accelerated transitions

### v1.0.0 (Initial Release)
- Core floating panel with drag/resize
- Color token management with OKLCH
- Typography controls
- Surface/paper controls
- AI chat integration
- Multi-format export
- Undo/redo history

## License

MIT
