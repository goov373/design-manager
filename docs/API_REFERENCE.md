# Design Manager API Reference

## Components

### `<DesignManager />`

Main component that renders the floating design panel.

```jsx
import { DesignManager } from '@gavin/design-manager';

<DesignManager
  initialTheme={themeState}
  onChange={(theme) => console.log(theme)}
  storageKey="my-app-theme"
  position="bottom-right"
  defaultOpen={true}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialTheme` | `ThemeState` | `undefined` | Initial theme values. If not provided, loads from localStorage or uses defaults. |
| `onChange` | `(theme: ThemeState) => void` | `undefined` | Callback fired on any theme change. |
| `storageKey` | `string` | `'design-manager-theme'` | localStorage key for persistence. |
| `position` | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'` | Initial panel position. |
| `defaultOpen` | `boolean` | `true` | Whether panel starts open. |
| `apiKey` | `string` | `undefined` | OpenAI API key for AI features. If not provided, AI tab shows setup instructions. |
| `apiEndpoint` | `string` | `'/api/design-manager/chat'` | Custom API endpoint for AI chat. |

### `<DesignManagerProvider />`

Context provider for accessing theme state from anywhere in your app.

```jsx
import { DesignManagerProvider } from '@gavin/design-manager';

<DesignManagerProvider storageKey="my-theme">
  <App />
  <DesignManager />
</DesignManagerProvider>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `storageKey` | `string` | `'design-manager-theme'` | localStorage key. |
| `initialTheme` | `ThemeState` | `undefined` | Initial theme state. |
| `children` | `ReactNode` | required | Child components. |

---

## Hooks

### `useDesignManager()`

Access theme state and actions from any component inside the provider.

```jsx
import { useDesignManager } from '@gavin/design-manager';

function MyComponent() {
  const {
    theme,
    darkMode,
    setDarkMode,
    setToken,
    setColor,
    undo,
    redo,
    canUndo,
    canRedo,
    exportTheme,
    importTheme,
  } = useDesignManager();

  return (
    <button onClick={() => setDarkMode(!darkMode)}>
      Toggle Dark Mode
    </button>
  );
}
```

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `theme` | `ThemeState` | Current theme state. |
| `darkMode` | `boolean` | Current dark mode state. |
| `setDarkMode` | `(dark: boolean) => void` | Toggle dark mode. |
| `setToken` | `(key: string, value: any) => void` | Set any theme token. |
| `setColor` | `(token: string, value: string, mode?: 'light' \| 'dark') => void` | Set a color token. |
| `undo` | `() => void` | Undo last change. |
| `redo` | `() => void` | Redo undone change. |
| `canUndo` | `boolean` | Whether undo is available. |
| `canRedo` | `boolean` | Whether redo is available. |
| `exportTheme` | `(format: ExportFormat) => string` | Export theme in specified format. |
| `importTheme` | `(data: string, format: ExportFormat) => void` | Import theme from string. |
| `applyPreset` | `(presetId: string) => void` | Apply a built-in preset. |
| `resetToDefaults` | `() => void` | Reset theme to defaults. |

---

## Types

### `ThemeState`

```typescript
interface ThemeState {
  darkMode: boolean;

  colors: {
    light: ColorTokens;
    dark: ColorTokens;
  };

  typography: {
    fontHeading: string;
    fontBody: string;
    fontWeightHeading: number;
    fontWeightBody: number;
    typeScale: 'compact' | 'default' | 'spacious';
    lineHeightPreset: 'tight' | 'normal' | 'relaxed';
  };

  surfaces: {
    paperWhite: string;
    paperCream: string;
    paperKraft: string;
  };

  radius: number;
  textureOpacity: number;
  activePresetId: string;
}
```

### `ColorTokens`

```typescript
interface ColorTokens {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  border: string;
  input: string;
  ring: string;
}
```

### `ExportFormat`

```typescript
type ExportFormat = 'css' | 'json' | 'tailwind' | 'tokens';
```

---

## Utility Functions

### Color Utilities

```javascript
import {
  hexToOklch,
  oklchToHex,
  getContrastRatio,
  checkContrast,
  simulateColorBlindness,
} from '@gavin/design-manager';

// Convert colors
const oklch = hexToOklch('#d97706'); // 'oklch(0.65 0.17 55)'
const hex = oklchToHex('oklch(0.65 0.17 55)'); // '#d97706'

// Check contrast
const ratio = getContrastRatio('#ffffff', '#000000'); // 21
const result = checkContrast('#ffffff', '#666666');
// { ratio: 5.74, level: 'AA', passes: { aa: true, aaa: false } }

// Simulate color blindness
const simulated = simulateColorBlindness('#ff0000', 'protanopia');
```

### Export Functions

```javascript
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

---

## CSS Custom Properties

When the Design Manager is active, it sets these CSS custom properties on `:root`:

### Colors
```css
--background, --foreground
--card, --card-foreground
--popover, --popover-foreground
--primary, --primary-foreground
--secondary, --secondary-foreground
--muted, --muted-foreground
--accent, --accent-foreground
--destructive
--border, --input, --ring
```

### Typography
```css
--font-family-heading
--font-family-body
--font-weight-heading
--font-weight-body
--font-size-base
--type-scale-ratio
--font-size-xs, --font-size-sm, --font-size-lg, --font-size-xl
--font-size-2xl, --font-size-3xl, --font-size-4xl
--line-height-heading
--line-height-body
```

### Surfaces
```css
--paper-white
--paper-cream
--paper-kraft
--radius
--texture-opacity-faint
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + Z` | Undo |
| `Cmd/Ctrl + Shift + Z` | Redo |
| `Escape` | Close panel |
| `Arrow Left/Right` | Navigate tabs |
| `Home/End` | Jump to first/last tab |

---

## Additional Hooks

### `useColorExtraction()`

Extract dominant colors from images using median cut algorithm.

```jsx
import { useColorExtraction } from '@gavin/design-manager';

function PhotoUploader() {
  const {
    state,
    isLoading,
    isSuccess,
    palette,
    previewUrl,
    extractFromFile,
    extractFromUrl,
    clear,
  } = useColorExtraction();

  return (
    <input
      type="file"
      onChange={(e) => extractFromFile(e.target.files[0])}
    />
  );
}
```

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `state` | `'idle' \| 'loading' \| 'success' \| 'error'` | Current state |
| `isLoading` | `boolean` | Loading state |
| `isSuccess` | `boolean` | Success state |
| `isError` | `boolean` | Error state |
| `palette` | `ExtractedColor[]` | Array of extracted colors |
| `previewUrl` | `string \| null` | Object URL for image preview |
| `error` | `string \| null` | Error message |
| `extractFromFile` | `(file: File) => Promise` | Extract from file |
| `extractFromUrl` | `(url: string) => Promise` | Extract from URL |
| `clear` | `() => void` | Clear results |

### `useAIChat(options)`

AI-powered theme generation chat interface.

```jsx
import { useAIChat } from '@gavin/design-manager';

function AIChat() {
  const {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    hasApiKey,
  } = useAIChat({
    apiKey: 'sk-...',
    onThemeGenerated: (theme) => applyTheme(theme),
  });

  return (
    <button onClick={() => sendMessage('Create a warm theme')}>
      Generate
    </button>
  );
}
```

**Options:**

| Option | Type | Description |
|--------|------|-------------|
| `apiKey` | `string` | OpenAI API key |
| `apiEndpoint` | `string` | Custom API endpoint |
| `onThemeGenerated` | `(theme) => void` | Callback when theme is generated |

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `messages` | `ChatMessage[]` | Chat history |
| `status` | `string` | Current chat status |
| `isLoading` | `boolean` | Loading state |
| `error` | `string \| null` | Error message |
| `sendMessage` | `(text: string) => Promise` | Send message |
| `clearMessages` | `() => void` | Clear chat |
| `cancel` | `() => void` | Cancel pending request |
| `hasApiKey` | `boolean` | Whether API is configured |

---

## Additional Components

### `<ColorPicker />`

Color input with swatch and hex display.

```jsx
<ColorPicker
  value="#3b82f6"
  onChange={(color) => setColor(color)}
  label="Primary"
  contrastWith="#ffffff"
  showBadge={true}
/>
```

### `<ContrastBadge />`

WCAG contrast compliance badge.

```jsx
<ContrastBadge
  foreground="#000000"
  background="#ffffff"
  compact={false}
/>
```

### `<FontSelector />`

Font dropdown with category grouping and preview.

```jsx
<FontSelector
  value="inter"
  onChange={(fontId) => setFont(fontId)}
  label="Body Font"
  filter="body"
/>
```

### `<PhotoExtractor />`

Photo upload and color extraction UI.

```jsx
<PhotoExtractor onClose={() => setShowExtractor(false)} />
```

### `<ColorBlindnessSimulator />`

CVD simulation controls and preview.

```jsx
<ColorBlindnessSimulator
  compact={false}
  onChange={(type) => setSimulation(type)}
/>
```

### `<AIChat />`

Complete chat interface for AI theme generation.

```jsx
<AIChat
  messages={messages}
  onSend={sendMessage}
  onApplyTheme={applyTheme}
  isLoading={isLoading}
/>
```

---

## Extended Color Utilities

```javascript
import {
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
} from '@gavin/design-manager';

// Parse to OKLCH object
const oklch = parseToOklch('#3b82f6');

// Adjust colors
const lighter = adjustLightness('#3b82f6', 0.1);
const saturated = adjustChroma('#3b82f6', 0.05);
const rotated = shiftHue('#3b82f6', 30);

// Generate harmonies
const triadic = generateHarmony('#3b82f6', 'triadic');
// Types: 'complementary', 'analogous', 'triadic', 'tetradic', 'split'

// Mix colors
const purple = mixColors('#ff0000', '#0000ff', 0.5);

// Text color helper
const textColor = getContrastingTextColor('#3b82f6');
```

---

## Color Blindness Simulation

```javascript
import {
  simulateColorBlindness,
  simulateAllTypes,
  areDistinguishable,
  analyzePalette,
  CVD_TYPES,
} from '@gavin/design-manager';

// Simulate for one type
const simulated = simulateColorBlindness('#ff0000', CVD_TYPES.PROTANOPIA);

// Simulate all types
const all = simulateAllTypes('#ff0000');
// => { protanopia: '...', deuteranopia: '...', ... }

// Check distinguishability
const canDistinguish = areDistinguishable('#ff0000', '#00ff00', 'deuteranopia');

// Analyze palette
const analysis = analyzePalette(colors, 'protanopia');
// => { pairs: [...], distinguishablePercentage: 66.67, problematicPairs: 1 }
```
