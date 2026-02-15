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
- **Multi-Format Export**: CSS, JSON, Tailwind, Design Tokens
- **Undo/Redo**: Full history with keyboard shortcuts (Cmd+Z)
- **Dark Mode**: Built-in dark mode toggle with auto-generation
- **Accessible**: ARIA labels, keyboard navigation, reduced motion support

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

## File Structure

```
design-manager/
├── DesignManager.jsx           # Main component entry point
├── index.js                    # Package exports
├── components/
│   ├── floating-panel/
│   │   ├── FloatingPanel.jsx   # Draggable/resizable container
│   │   └── PanelHeader.jsx     # Header with controls
│   ├── colors/
│   │   ├── ColorPicker.jsx     # OKLCH color picker
│   │   ├── ContrastBadge.jsx   # WCAG compliance indicator
│   │   └── ...
│   └── ai/
│       └── AIChat.jsx          # AI chat interface
├── tabs/
│   ├── ColorsTab.jsx           # Color token management
│   ├── TypographyTab.jsx       # Font controls
│   ├── SurfacesTab.jsx         # Paper/texture controls
│   ├── AITab.jsx               # AI theme generation
│   └── ExportTab.jsx           # Export functionality
├── hooks/
│   ├── usePanelState.js        # Panel position/size/state
│   └── useColorExtraction.js   # Photo color extraction
├── context/
│   └── DesignManagerContext.jsx # Theme state provider
├── lib/
│   ├── constants.js            # Configuration constants
│   ├── color-utils.js          # Color manipulation
│   └── export-utils.js         # Export formatters
└── styles/
    └── design-manager.css      # All component styles
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
