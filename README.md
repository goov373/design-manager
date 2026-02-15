# @gavin/design-manager

A standalone, extractable design/theme management tool for React applications. Features a floating panel UI with real-time theme editing, color management, typography controls, AI theme generation, and multi-format export.

## Features

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
- **Dark Mode**: Built-in dark mode toggle
- **Accessible**: ARIA labels, keyboard navigation, reduced motion support

## Installation

```bash
npm install @gavin/design-manager
```

## Quick Start

```jsx
import { DesignManager } from '@gavin/design-manager';
import '@gavin/design-manager/styles';

function App() {
  return (
    <div>
      <YourApp />
      <DesignManager />
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
| `position` | `string` | `'bottom-right'` | Initial position: `'bottom-right'`, `'bottom-left'`, `'top-right'`, `'top-left'` |
| `defaultOpen` | `boolean` | `true` | Whether panel starts open |
| `apiKey` | `string` | - | OpenAI API key for AI features |
| `apiEndpoint` | `string` | `'/api/design-manager/chat'` | Custom API endpoint for AI chat |

## Hooks

### `useDesignManager()`

Access theme state from any component inside the provider.

```jsx
import { useDesignManager } from '@gavin/design-manager';

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
  } = useDesignManager();

  return (
    <button onClick={() => setDarkMode(!darkMode)}>
      Toggle Dark Mode
    </button>
  );
}
```

### `useColorExtraction()`

Extract colors from images.

```jsx
import { useColorExtraction } from '@gavin/design-manager';

function PhotoUploader() {
  const {
    extractFromFile,
    palette,
    isLoading,
    previewUrl
  } = useColorExtraction();

  const handleFile = (e) => {
    extractFromFile(e.target.files[0]);
  };

  return (
    <div>
      <input type="file" onChange={handleFile} />
      {palette.map((color) => (
        <div
          key={color.hex}
          style={{ background: color.hex }}
        />
      ))}
    </div>
  );
}
```

## Utilities

### Color Utilities

```jsx
import {
  parseToOklch,
  toHexString,
  adjustLightness,
  generatePalette,
  getContrastRatio,
  simulateColorBlindness,
} from '@gavin/design-manager';

// Convert to OKLCH
const oklch = parseToOklch('#3b82f6');

// Generate harmonious palette
const palette = generateHarmony('#3b82f6', 'triadic');

// Check contrast
const ratio = getContrastRatio('#000000', '#ffffff'); // 21

// Simulate color blindness
const simulated = simulateColorBlindness('#ff0000', 'protanopia');
```

### Export Utilities

```jsx
import {
  exportAsCSS,
  exportAsJSON,
  exportAsTailwind,
  exportAsTokens,
} from '@gavin/design-manager';

const css = exportAsCSS(theme);
const json = exportAsJSON(theme);
const tailwind = exportAsTailwind(theme);
const tokens = exportAsTokens(theme);
```

## Customization

### Using Individual Components

```jsx
import {
  ColorPicker,
  ContrastBadge,
  FontSelector,
  PhotoExtractor,
  ColorBlindnessSimulator,
} from '@gavin/design-manager';

function CustomEditor() {
  return (
    <div>
      <ColorPicker
        value="#3b82f6"
        onChange={setColor}
        showBadge
      />
      <ContrastBadge
        foreground="#000"
        background="#fff"
      />
      <FontSelector
        value="inter"
        onChange={setFont}
        filter="body"
      />
    </div>
  );
}
```

### Theme Structure

```javascript
{
  // Colors (light and dark mode)
  colors: {
    light: {
      background: '#ffffff',
      foreground: '#1a1a1a',
      primary: '#3b82f6',
      // ... other tokens
    },
    dark: {
      background: '#1a1a1a',
      foreground: '#ffffff',
      primary: '#60a5fa',
      // ... other tokens
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

## Browser Support

- Chrome/Edge 90+
- Firefox 90+
- Safari 15+

## License

MIT
