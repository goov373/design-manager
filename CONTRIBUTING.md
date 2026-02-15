# Contributing to Design Manager

Thank you for your interest in contributing to Design Manager! This guide will help you understand our conventions, code style, and how to add new features.

## Table of Contents

- [Code Style Conventions](#code-style-conventions)
- [File Organization](#file-organization)
- [How to Add a New Tool](#how-to-add-a-new-tool)
- [How to Add a New Export Format](#how-to-add-a-new-export-format)
- [Testing Approach](#testing-approach)
- [Pull Request Checklist](#pull-request-checklist)

---

## Code Style Conventions

### CSS Naming

All CSS classes **must** use the `dm-` prefix to avoid conflicts with host applications:

```css
/* Good */
.dm-button { }
.dm-panel-header { }
.dm-color-picker { }

/* Bad - will conflict with host app styles */
.button { }
.panel-header { }
```

### CSS Variables

Design Manager uses its own internal CSS variables prefixed with `--dm-`:

```css
.dm-panel-container {
  background: var(--dm-bg, #ffffff);
  border: 1px solid var(--dm-border, #e5e5e5);
  color: var(--dm-text, #1a1a1a);
}
```

Always provide fallback values for robustness.

### Color Format

Use **OKLCH** as the primary color format throughout the codebase:

```javascript
// Good - OKLCH format
const primary = 'oklch(0.65 0.17 55)';

// Acceptable - for display/export only
const hex = '#e67e22';
```

OKLCH format: `oklch(L C H)` where:
- **L** (Lightness): 0-1
- **C** (Chroma): 0-0.4 (roughly)
- **H** (Hue): 0-360 degrees

### JavaScript Conventions

- Use **functional components** with hooks
- Use **named exports** for components and utilities
- Keep components focused on a single responsibility
- Use `useCallback` for functions passed to child components
- Use `useMemo` for expensive calculations

```javascript
// Component structure
import { useState, useMemo } from 'react';
import { SomeIcon } from 'lucide-react';
import { useDesignManagerContext } from '../../context/DesignManagerContext';

export function MyComponent({ onClose }) {
  const { colors, setColor } = useDesignManagerContext();

  // Memoize expensive calculations
  const computed = useMemo(() => {
    // ...
  }, [colors]);

  return (
    <div className="dm-my-component">
      {/* Component JSX */}
    </div>
  );
}

export default MyComponent;
```

### Import Order

1. React and React hooks
2. External libraries (lucide-react, etc.)
3. Context
4. Hooks
5. Utilities/lib
6. Components
7. Styles (if any)

```javascript
import { useState, useMemo, useCallback } from 'react';
import { Check, AlertTriangle } from 'lucide-react';
import { useDesignManagerContext } from '../../context/DesignManagerContext';
import { parseToOklch, toHexString } from '../../lib/color-utils';
import { getContrastRatio } from '../../lib/contrast-checker';
```

---

## File Organization

```
design-manager/
├── DesignManager.jsx           # Main component entry point
├── index.js                    # Package exports
├── components/
│   ├── floating-panel/         # Panel UI components
│   │   ├── FloatingPanel.jsx
│   │   └── PanelHeader.jsx
│   ├── controls/               # Reusable UI controls
│   │   ├── ColorPicker.jsx
│   │   ├── ContrastBadge.jsx
│   │   └── ...
│   ├── features/               # Feature-specific components
│   │   ├── PhotoExtractor.jsx
│   │   └── ColorBlindnessSimulator.jsx
│   ├── tools/                  # Tools Tab tools
│   │   ├── ContrastFixer.jsx
│   │   ├── FontPairing.jsx
│   │   └── ...
│   └── ai/                     # AI-related components
│       └── AIChat.jsx
├── tabs/                       # Main tab content
│   ├── ColorsTab.jsx
│   ├── TypographyTab.jsx
│   ├── SurfacesTab.jsx
│   ├── ToolsTab.jsx
│   └── ExportTab.jsx
├── hooks/                      # React hooks
│   ├── useDesignManager.js     # Public API hook
│   ├── usePanelState.js
│   └── useColorExtraction.js
├── context/                    # React context
│   └── DesignManagerContext.jsx
├── lib/                        # Utilities
│   ├── color-utils.js          # Color manipulation
│   ├── contrast-checker.js     # WCAG compliance
│   ├── theme-utils.js          # Theme application
│   ├── constants.js            # Configuration
│   ├── presets.js              # Built-in presets
│   ├── typography-config.js    # Font configuration
│   └── exporters/              # Export format handlers
│       ├── css-exporter.js
│       ├── json-exporter.js
│       ├── tailwind-exporter.js
│       ├── tokens-exporter.js
│       └── rules-exporter.js
├── styles/                     # CSS
│   └── design-manager.css
└── docs/                       # Documentation
```

### Where to Put New Files

| File Type | Location |
|-----------|----------|
| New tool component | `components/tools/` |
| Reusable UI control | `components/controls/` |
| New export format | `lib/exporters/` |
| Utility functions | `lib/` |
| New hook | `hooks/` |
| Tab content | `tabs/` |

---

## How to Add a New Tool

Tools appear in the Tools Tab and provide specialized design utilities.

### Step 1: Create the Tool Component

Create a new file in `components/tools/`:

```javascript
// components/tools/MyNewTool.jsx

import { useState, useMemo } from 'react';
import { Check, X } from 'lucide-react';
import { useDesignManagerContext } from '../../context/DesignManagerContext';
import { parseToOklch, toHexString } from '../../lib/color-utils';

export function MyNewTool({ onClose }) {
  const { colors, darkMode, setColor } = useDesignManagerContext();
  const currentColors = darkMode ? colors.dark : colors.light;

  const [localState, setLocalState] = useState(/* initial state */);

  const handleApply = () => {
    // Apply changes to theme via setColor
    setColor('primary', newValue);
  };

  return (
    <div className="dm-my-new-tool">
      {/* Tool UI */}

      <div className="dm-tool-actions">
        <button
          type="button"
          className="dm-button dm-button-secondary"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="button"
          className="dm-button dm-button-primary"
          onClick={handleApply}
        >
          <Check size={14} />
          Apply
        </button>
      </div>
    </div>
  );
}

export default MyNewTool;
```

### Step 2: Add to ToolsTab

Import and add your tool to `tabs/ToolsTab.jsx`:

```javascript
import { MyNewTool } from '../components/tools/MyNewTool';

// Add to the tools grid
<div className="dm-tool-card">
  <div className="dm-tool-header">
    <div className="dm-tool-icon dm-tool-icon-primary">
      <YourIcon size={20} />
    </div>
    <div className="dm-tool-info">
      <h4 className="dm-tool-title">My New Tool</h4>
      <p className="dm-tool-description">
        Brief description of what the tool does.
      </p>
    </div>
  </div>

  {activeTool === 'myNewTool' ? (
    <div className="dm-tool-content">
      <MyNewTool onClose={closeTool} />
    </div>
  ) : (
    <button
      type="button"
      className="dm-button dm-button-primary dm-tool-launch"
      onClick={() => setActiveTool('myNewTool')}
    >
      Launch Tool
    </button>
  )}
</div>
```

### Step 3: Add Styles

Add CSS for your tool in `styles/design-manager.css`:

```css
/* My New Tool */
.dm-my-new-tool {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dm-my-new-tool .dm-tool-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
```

---

## How to Add a New Export Format

### Step 1: Create the Exporter

Create a new file in `lib/exporters/`:

```javascript
// lib/exporters/my-format-exporter.js

/**
 * My Format Exporter
 *
 * Exports theme in My Format.
 */

import { getCSSVarName } from '../constants';

/**
 * Export theme as My Format
 * @param {Object} theme - Theme state
 * @returns {string} Formatted output string
 */
export function exportAsMyFormat(theme) {
  const { colors, ...tokens } = theme;
  const lightColors = colors?.light || {};
  const darkColors = colors?.dark || {};

  // Build your export format
  let output = '// My Format Export\n';

  Object.entries(lightColors).forEach(([key, value]) => {
    output += `${key}: ${value}\n`;
  });

  return output;
}

export default exportAsMyFormat;
```

### Step 2: Add to useDesignManager Hook

Update `hooks/useDesignManager.js`:

```javascript
import { exportAsMyFormat } from '../lib/exporters/my-format-exporter';

// In exportTheme function:
case 'myFormat':
  return exportAsMyFormat({ ...theme, colors });
```

### Step 3: Add to ExportTab UI

Update `tabs/ExportTab.jsx`:

```javascript
const EXPORT_FORMATS = [
  { id: 'css', name: 'CSS', extension: '.css' },
  { id: 'json', name: 'JSON', extension: '.json' },
  { id: 'myFormat', name: 'My Format', extension: '.myext' },
  // ...
];
```

---

## Testing Approach

### No Standalone Build

Design Manager is designed to run embedded in host applications. There is no standalone development server.

### Testing in a Host App

1. **Symlink the package** into your test application:
   ```bash
   ln -s /path/to/design-manager your-app/src/design-manager
   ```

2. **Import and render** in your test app:
   ```jsx
   import { DesignManager } from './design-manager';
   import './design-manager/styles/design-manager.css';

   function App() {
     return (
       <div>
         <YourAppContent />
         <DesignManager defaultOpen={true} />
       </div>
     );
   }
   ```

3. **Test your changes** by interacting with the panel in the host app.

### Manual Testing Checklist

- [ ] Test in both light and dark modes
- [ ] Test with different color values (OKLCH, hex, rgb)
- [ ] Test keyboard navigation (Tab, Enter, Escape)
- [ ] Test undo/redo (Cmd+Z / Cmd+Shift+Z)
- [ ] Test export formats produce valid output
- [ ] Test with reduced motion preference enabled
- [ ] Verify no CSS conflicts with host app styles

### Color Conversion Testing

When working with color utilities, test edge cases:

```javascript
// Test these scenarios
parseToOklch('oklch(0.5 0.2 120)');  // Valid OKLCH
parseToOklch('#ff5500');              // Hex
parseToOklch('rgb(255, 85, 0)');      // RGB
parseToOklch('invalid');              // Should return null
parseToOklch('');                     // Empty string
parseToOklch(null);                   // Null
```

---

## Pull Request Checklist

Before submitting a PR, ensure:

### Code Quality
- [ ] All CSS classes use `dm-` prefix
- [ ] No imports from outside the design-manager folder
- [ ] Components use `useDesignManagerContext()` for state
- [ ] Colors use OKLCH format internally
- [ ] Fallback values provided for CSS variables

### Functionality
- [ ] Feature works in light and dark modes
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Changes are reflected in undo/redo history
- [ ] Export formats include new data (if applicable)

### Accessibility
- [ ] ARIA labels on interactive elements
- [ ] Focus states are visible
- [ ] Color contrast meets WCAG AA
- [ ] Works with `prefers-reduced-motion`

### Documentation
- [ ] JSDoc comments on exported functions
- [ ] Component file header describing purpose
- [ ] Update README if adding user-facing features

### Package Boundaries
- [ ] No peer dependency changes without discussion
- [ ] No imports using `../` that escape design-manager folder
- [ ] No hardcoded selectors that target host app elements

---

## Questions?

If you have questions about contributing:

1. Check existing code for patterns
2. Review the [Architecture documentation](./docs/ARCHITECTURE.md)
3. Open an issue for discussion before large changes

Thank you for contributing to Design Manager!
