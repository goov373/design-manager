# Color System Documentation

## Overview

The Design Manager uses OKLCH as its primary color space for maximum perceptual uniformity and browser compatibility. OKLCH is supported natively in modern browsers and provides intuitive controls for lightness, chroma, and hue.

## OKLCH Color Space

### Format

```
oklch(L C H)
oklch(L C H / alpha)
```

- **L** (Lightness): 0-1, where 0 is black and 1 is white
- **C** (Chroma): 0-0.4, where 0 is gray and higher values are more saturated
- **H** (Hue): 0-360 degrees, the color wheel position

### Why OKLCH?

1. **Perceptually uniform**: Equal steps in values produce equal perceived changes
2. **Native browser support**: No transpilation needed
3. **Intuitive controls**: Lightness, saturation, and hue are independent
4. **Wide gamut**: Supports P3 and Rec.2020 color spaces

## Color Utilities

### `lib/color-utils.js`

Primary color manipulation functions using the `culori` library.

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
} from '../lib/color-utils';

// Parse any color format to OKLCH
const oklch = parseToOklch('#d97706'); // { l: 0.666, c: 0.179, h: 58.318 }

// Convert to different formats
const oklchStr = toOklchString('#d97706'); // 'oklch(0.666 0.179 58.318)'
const hex = toHexString('oklch(0.666 0.179 58)'); // '#d97706'

// Adjust colors
const lighter = adjustLightness('oklch(0.5 0.1 60)', 0.2); // Increase lightness
const muted = adjustChroma('oklch(0.5 0.2 60)', -0.1); // Reduce saturation
const shifted = shiftHue('oklch(0.5 0.1 60)', 180); // Complementary hue

// Generate palettes
const palette = generatePalette('oklch(0.5 0.15 60)', 5); // 5 evenly spaced hues
const harmony = generateHarmony('oklch(0.5 0.15 60)');
// { complementary, triadic, analogous, splitComplementary }
```

## Contrast Checking

### `lib/contrast-checker.js`

WCAG 2.1 contrast ratio calculations.

```javascript
import {
  getContrastRatio,
  checkContrast,
  getContrastBadge,
  suggestAccessibleColor,
} from '../lib/contrast-checker';

// Calculate contrast ratio
const ratio = getContrastRatio('#ffffff', '#000000'); // 21

// Full compliance check
const result = checkContrast('#ffffff', '#666666');
// {
//   ratio: 5.74,
//   passes: { aa: true, aaLarge: true, aaa: false, aaaLarge: true },
//   level: 'AA',
//   score: 'good'
// }

// Get badge data for UI
const badge = getContrastBadge('#333', '#fff');
// { ratio: '12.6', level: 'AAA', score: 'excellent', color: 'green' }

// Suggest accessible alternative
const suggested = suggestAccessibleColor('#888', '#fff', 4.5);
```

### WCAG Thresholds

| Level | Normal Text | Large Text |
|-------|-------------|------------|
| AA    | 4.5:1       | 3:1        |
| AAA   | 7:1         | 4.5:1      |

Large text = 18pt+ or 14pt+ bold

## Color Blindness Simulation

### `lib/color-blindness.js`

Brettel algorithm implementation for CVD simulation.

```javascript
import {
  CVD_TYPES,
  simulateColorBlindness,
  simulateAllTypes,
  areDistinguishable,
  analyzePalette,
} from '../lib/color-blindness';

// Available CVD types
// CVD_TYPES.PROTANOPIA - Red-blind (~1% of males)
// CVD_TYPES.DEUTERANOPIA - Green-blind (~1% of males)
// CVD_TYPES.TRITANOPIA - Blue-blind (~0.003%)
// CVD_TYPES.ACHROMATOPSIA - Complete color blindness (~0.003%)

// Simulate single color
const simulated = simulateColorBlindness('#ff0000', 'protanopia');

// Simulate all types
const all = simulateAllTypes('#ff0000');
// { normal, protanopia, deuteranopia, tritanopia, achromatopsia }

// Check if colors are distinguishable
const distinguishable = areDistinguishable('#ff0000', '#00ff00', 'deuteranopia');

// Analyze entire palette
const analysis = analyzePalette(['#ff0000', '#00ff00', '#0000ff']);
// { protanopia: { issues: [...], accessible: false }, ... }
```

## Token Structure

### Color Token Groups

```javascript
const COLOR_TOKEN_GROUPS = [
  {
    id: 'background',
    name: 'Background',
    tokens: ['background', 'foreground'],
  },
  {
    id: 'cards',
    name: 'Cards & Popovers',
    tokens: ['card', 'cardForeground', 'popover', 'popoverForeground'],
  },
  {
    id: 'interactive',
    name: 'Interactive',
    tokens: ['primary', 'primaryForeground', 'secondary', 'secondaryForeground'],
  },
  {
    id: 'accents',
    name: 'Accents',
    tokens: ['accent', 'accentForeground', 'muted', 'mutedForeground'],
  },
  {
    id: 'forms',
    name: 'Forms & Borders',
    tokens: ['border', 'input', 'ring', 'destructive'],
  },
];
```

### CSS Variable Mapping

Token names map to CSS custom properties:

| Token | CSS Variable |
|-------|--------------|
| `background` | `--background` |
| `foreground` | `--foreground` |
| `cardForeground` | `--card-foreground` |
| `primaryForeground` | `--primary-foreground` |
| ... | ... |

## Best Practices

### 1. Always check contrast

```javascript
const { level, passes } = checkContrast(foreground, background);
if (!passes.aa) {
  // Warn user about accessibility issue
}
```

### 2. Test with CVD simulation

```javascript
const analysis = analyzePalette(Object.values(colors.light));
if (!analysis.protanopia.accessible) {
  // Flag potential issues for colorblind users
}
```

### 3. Provide contrast badges in UI

Display AA/AAA badges next to color pickers so users can see accessibility status in real-time.

### 4. Use semantic token names

Instead of hardcoding colors, always reference tokens:

```css
/* Good */
color: var(--primary);
background: var(--card);

/* Avoid */
color: #d97706;
background: #ffffff;
```

## Export Formats

The color system exports to multiple formats:

- **CSS**: Native CSS custom properties
- **JSON**: Structured with light/dark modes
- **Tailwind**: Compatible with tailwind.config.js
- **Design Tokens**: W3C Design Tokens format
