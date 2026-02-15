# Troubleshooting Guide

This guide covers common issues you may encounter when using or developing Design Manager, along with their solutions.

## Table of Contents

1. [Color Conversion Issues](#1-color-conversion-issues)
2. [Integration Issues](#2-integration-issues)
3. [Export Format Problems](#3-export-format-problems)
4. [CSS Variable Conflicts](#4-css-variable-conflicts)
5. [Context and State Issues](#5-context-and-state-issues)
6. [Panel Behavior Issues](#6-panel-behavior-issues)
7. [Typography Issues](#7-typography-issues)

---

## 1. Color Conversion Issues

### Problem: OKLCH color not parsing correctly

**Symptoms:**
- Color appears gray or incorrect
- `parseToOklch()` returns `null`
- Console warning: "Failed to parse color"

**Causes and Solutions:**

#### Invalid OKLCH Format

The OKLCH format must be: `oklch(L C H)` with spaces between values.

```javascript
// Valid formats
'oklch(0.65 0.17 55)'
'oklch(0.65 0.17 55 / 0.5)'  // With alpha

// Invalid formats
'oklch(0.65, 0.17, 55)'      // Commas not allowed
'oklch(65% 0.17 55)'         // L should be 0-1, not percentage
'oklch(0.65 17% 55)'         // C should be decimal, not percentage
```

#### Out of Range Values

OKLCH has specific value ranges:

| Component | Valid Range | Common Mistake |
|-----------|-------------|----------------|
| L (Lightness) | 0-1 | Using 0-100 |
| C (Chroma) | 0-0.4 (approx) | Using 0-100 or 0-1 |
| H (Hue) | 0-360 | Correct range |

```javascript
// Fix: Convert from percentage if needed
const l = 65 / 100;  // Convert 65% to 0.65
const c = 17 / 100;  // Convert 17% to 0.17
const color = `oklch(${l} ${c} ${h})`;
```

#### Null or Undefined Input

Always check for null/undefined before parsing:

```javascript
import { parseToOklch } from './lib/color-utils';

function safeParseColor(color) {
  if (!color || typeof color !== 'string') {
    return null;
  }
  return parseToOklch(color);
}
```

### Problem: Hex conversion produces wrong color

**Symptoms:**
- `toHexString()` returns `#888888` (fallback gray)
- Converted hex looks different from original OKLCH

**Solutions:**

1. **Check input validity:**
   ```javascript
   import { toHexString, parseToOklch } from './lib/color-utils';

   // Verify OKLCH parses first
   const oklch = parseToOklch(myColor);
   if (!oklch) {
     console.error('Invalid color:', myColor);
     return;
   }

   const hex = toHexString(myColor);
   ```

2. **Understand gamut limitations:**
   OKLCH can represent colors outside sRGB gamut. When converting to hex, these colors are clamped, which may cause visible differences.

   ```javascript
   // This OKLCH color is outside sRGB gamut
   'oklch(0.8 0.35 150)'  // Very saturated green

   // Will be clamped when converted to hex
   ```

3. **Use the culori library directly for advanced needs:**
   ```javascript
   import { oklch, formatHex, clampChroma } from 'culori';

   // Clamp to sRGB gamut before conversion
   const clamped = clampChroma(oklch(myColor), 'rgb');
   const hex = formatHex(clamped);
   ```

---

## 2. Integration Issues

### Problem: Design Manager doesn't render

**Symptoms:**
- Nothing appears on screen
- No errors in console

**Solutions:**

1. **Verify CSS is imported:**
   ```jsx
   // Must import the CSS file
   import './design-manager/styles/design-manager.css';
   ```

2. **Check component is rendered:**
   ```jsx
   function App() {
     return (
       <div>
         <YourApp />
         {/* Design Manager should be at the end, inside a parent */}
         <DesignManager defaultOpen={true} />
       </div>
     );
   }
   ```

3. **Check z-index conflicts:**
   Design Manager uses `z-index: 10000`. If your app has higher z-index elements, the panel may be hidden.

### Problem: Panel opens but is empty/broken

**Symptoms:**
- Panel container visible but content missing
- JavaScript errors in console

**Solutions:**

1. **Check peer dependencies:**
   ```bash
   npm install react-rnd lucide-react
   ```

2. **Verify React version:**
   ```json
   {
     "dependencies": {
       "react": "^18.0.0 || ^19.0.0",
       "react-dom": "^18.0.0 || ^19.0.0"
     }
   }
   ```

3. **Check for import path issues:**
   ```javascript
   // If using symlink, ensure path is correct
   import { DesignManager } from './design-manager';  // Not '../design-manager'
   ```

### Problem: Cannot open panel programmatically

**Symptoms:**
- Custom event doesn't open the panel
- `window.dispatchEvent()` has no effect

**Solutions:**

1. **Use correct event name:**
   ```javascript
   // Correct
   window.dispatchEvent(new CustomEvent('design-manager:open'));

   // Wrong event names
   window.dispatchEvent(new CustomEvent('designmanager:open'));
   window.dispatchEvent(new CustomEvent('design-manager-open'));
   ```

2. **Ensure Design Manager is mounted:**
   Events only work after the component has mounted and registered listeners.

3. **Check for multiple instances:**
   Only one Design Manager should be mounted at a time.

---

## 3. Export Format Problems

### Problem: Copy to clipboard fails

**Symptoms:**
- "Copy" button doesn't work
- No feedback after clicking copy
- Console error about clipboard

**Causes and Solutions:**

1. **HTTPS required:**
   Clipboard API requires secure context (HTTPS) in production. Use HTTPS or localhost for development.

2. **User gesture required:**
   Clipboard writes must be triggered by user interaction (click, tap).

3. **Permissions denied:**
   Some browsers require explicit permission:
   ```javascript
   // Check permission status
   const permission = await navigator.permissions.query({
     name: 'clipboard-write'
   });
   console.log(permission.state);  // 'granted', 'denied', or 'prompt'
   ```

4. **Fallback for older browsers:**
   ```javascript
   async function copyToClipboard(text) {
     try {
       await navigator.clipboard.writeText(text);
       return true;
     } catch (e) {
       // Fallback for older browsers
       const textarea = document.createElement('textarea');
       textarea.value = text;
       document.body.appendChild(textarea);
       textarea.select();
       document.execCommand('copy');
       document.body.removeChild(textarea);
       return true;
     }
   }
   ```

### Problem: Downloaded file is corrupted or empty

**Symptoms:**
- File downloads but won't open
- File is 0 bytes
- Content is truncated

**Solutions:**

1. **Check blob creation:**
   ```javascript
   const content = exportTheme('css');
   console.log('Export length:', content.length);  // Should be > 0

   const blob = new Blob([content], { type: 'text/plain' });
   console.log('Blob size:', blob.size);  // Should match content length
   ```

2. **Verify export function returns data:**
   ```javascript
   import { exportAsCSS } from './lib/exporters/css-exporter';

   const result = exportAsCSS(theme);
   if (!result || result.length === 0) {
     console.error('Export returned empty result');
   }
   ```

### Problem: Import fails with "Invalid theme format"

**Symptoms:**
- Import error displayed
- Theme not applied after import

**Solutions:**

1. **Verify JSON structure:**
   ```json
   {
     "colors": {
       "light": { ... },
       "dark": { ... }
     },
     "typography": {
       "fontHeading": "system-ui",
       "fontBody": "system-ui"
     }
   }
   ```

2. **Check for JSON syntax errors:**
   ```javascript
   try {
     JSON.parse(fileContent);
   } catch (e) {
     console.error('JSON parse error:', e.message);
   }
   ```

3. **Required fields:**
   The importer requires `colors` and `typography` objects to be present.

---

## 4. CSS Variable Conflicts

### Problem: Design Manager styles affecting host app

**Symptoms:**
- Host app elements styled incorrectly
- Buttons, inputs look different after adding Design Manager

**Solutions:**

1. **Verify dm- prefix usage:**
   All Design Manager styles should use the `dm-` prefix. Check for any unprefixed selectors in your modifications.

2. **Scope CSS variables:**
   Design Manager internal variables use `--dm-` prefix:
   ```css
   /* Internal to Design Manager */
   --dm-bg: #ffffff;
   --dm-border: #e5e5e5;
   --dm-text: #1a1a1a;
   ```

3. **Check for global resets:**
   Design Manager doesn't include CSS resets. If you see conflicts, check if Design Manager styles are being affected by your app's CSS reset.

### Problem: Host app styles breaking Design Manager

**Symptoms:**
- Panel looks wrong (fonts, colors, spacing)
- Icons not displaying correctly
- Buttons unstyled

**Solutions:**

1. **Check CSS specificity:**
   If your app uses very specific selectors or `!important`, they may override Design Manager styles.

2. **Isolate with container class:**
   ```css
   /* Your app styles - won't affect dm- classes */
   .your-app button { ... }

   /* This WILL affect Design Manager */
   button { ... }  /* Global selector - avoid */
   ```

3. **Check for box-sizing issues:**
   Design Manager expects standard box-sizing. If your app uses `box-sizing: border-box` globally, this should be fine. Issues may arise with unusual box-sizing values.

### Problem: Theme CSS variables not applying to host app

**Symptoms:**
- Colors in Design Manager change, but app doesn't update
- CSS variables exist in :root but elements don't use them

**Solutions:**

1. **Verify your app uses the CSS variables:**
   ```css
   /* Your app CSS should reference the variables */
   .my-button {
     background: var(--primary);
     color: var(--primary-foreground);
   }
   ```

2. **Check variable names match:**
   Design Manager uses kebab-case for CSS variables:
   ```css
   /* Correct variable names */
   --background
   --foreground
   --primary
   --primary-foreground
   --card-foreground  /* Note: camelCase token becomes kebab-case */
   ```

3. **Dark mode class:**
   Dark mode variables are applied under `.dark` class:
   ```css
   :root { --background: oklch(0.98 0.01 90); }
   .dark { --background: oklch(0.12 0.01 90); }
   ```
   Ensure your app has a parent element with the `dark` class when dark mode is enabled.

---

## 5. Context and State Issues

### Problem: "useDesignManagerContext must be used within a DesignManagerProvider"

**Symptoms:**
- Error thrown when component mounts
- App crashes with context error

**Solutions:**

1. **Ensure component is inside provider:**
   ```jsx
   // Wrong - component outside provider
   function App() {
     return (
       <>
         <MyComponentUsingContext />  {/* Error! */}
         <DesignManager />
       </>
     );
   }

   // Correct - use the hook inside Design Manager's children
   // or use the useDesignManager hook which handles this
   ```

2. **Use the public hook:**
   For external components, use `useDesignManager()` instead of `useDesignManagerContext()`:
   ```javascript
   // For components INSIDE DesignManager's provider tree
   import { useDesignManagerContext } from './context/DesignManagerContext';

   // For general use - handles the provider check
   import { useDesignManager } from './hooks/useDesignManager';
   ```

### Problem: Theme changes not persisting after reload

**Symptoms:**
- Changes lost on page refresh
- Theme reverts to defaults

**Solutions:**

1. **Check localStorage:**
   ```javascript
   // Default key
   localStorage.getItem('design-manager-theme');

   // Or custom key if you provided one
   localStorage.getItem(yourStorageKey);
   ```

2. **Verify storageKey prop:**
   ```jsx
   <DesignManager
     storageKey="my-app-theme"  // Custom key
   />
   ```

3. **Check for localStorage errors:**
   ```javascript
   // localStorage can fail in private browsing or if quota exceeded
   try {
     localStorage.setItem('test', 'test');
     localStorage.removeItem('test');
   } catch (e) {
     console.error('localStorage not available:', e);
   }
   ```

4. **Incognito/Private mode:**
   Some browsers restrict localStorage in private mode.

### Problem: Undo/Redo not working

**Symptoms:**
- Cmd+Z / Ctrl+Z does nothing
- Undo button stays disabled

**Solutions:**

1. **Check focus:**
   Keyboard shortcuts only work when the page (not an iframe or other element) has focus.

2. **Verify history is being recorded:**
   ```javascript
   const { canUndo, canRedo } = useDesignManager();
   console.log('Can undo:', canUndo);  // Should be true after making changes
   ```

3. **Check for event conflicts:**
   If your app also listens for Cmd+Z, there may be a conflict. Design Manager uses `e.preventDefault()` when handling undo.

---

## 6. Panel Behavior Issues

### Problem: Panel position not saved

**Symptoms:**
- Panel always opens in default position
- Dragged position lost on reload

**Solutions:**

1. **Check panel storage key:**
   ```jsx
   <DesignManager
     panelStorageKey="my-app-panel"  // Separate from theme storage
   />
   ```

2. **Verify localStorage has panel state:**
   ```javascript
   localStorage.getItem('design-manager-panel');  // Default key
   ```

### Problem: Panel not snapping to edges

**Symptoms:**
- Panel doesn't snap when dragged near screen edge
- Snap threshold seems wrong

**Solutions:**

Edge snapping uses these defaults:
- **Threshold:** 20px from edge triggers snap
- **Margin:** Panel snaps to 24px from edge

This behavior is built-in and shouldn't require configuration. If it's not working:

1. Check if the panel position is being overridden
2. Verify `usePanelState` hook is being used correctly

### Problem: Panel stays behind other elements

**Symptoms:**
- Panel hidden behind modals or overlays
- Can't access panel controls

**Solutions:**

1. **Check z-index:**
   Design Manager uses `z-index: 10000`. Increase if your app has higher values:
   ```css
   .dm-fixed-wrapper {
     z-index: 20000 !important;  /* Override if needed */
   }
   ```

2. **Check for stacking context issues:**
   Elements with `transform`, `filter`, or `will-change` create new stacking contexts.

---

## 7. Typography Issues

### Problem: Google Fonts not loading

**Symptoms:**
- Selected font doesn't apply
- Text shows fallback system font

**Solutions:**

1. **Check network requests:**
   Open DevTools Network tab and filter for "fonts.googleapis.com"

2. **Content Security Policy:**
   If using CSP, allow Google Fonts:
   ```html
   <meta http-equiv="Content-Security-Policy"
     content="font-src 'self' fonts.gstatic.com;">
   ```

3. **Verify font ID is valid:**
   ```javascript
   import { FONT_CATALOG } from './lib/typography-config';
   console.log(Object.keys(FONT_CATALOG));  // List valid font IDs
   ```

### Problem: Font sizes not applying

**Symptoms:**
- Type scale changes don't affect app
- Font sizes stay the same

**Solutions:**

1. **Use the CSS variables in your app:**
   ```css
   h1 { font-size: var(--font-size-4xl); }
   h2 { font-size: var(--font-size-3xl); }
   p { font-size: var(--font-size-base); }
   ```

2. **Check type scale is applied:**
   ```javascript
   // Verify CSS variables exist
   getComputedStyle(document.documentElement)
     .getPropertyValue('--font-size-base');  // Should return value
   ```

---

## Getting More Help

If you're still experiencing issues:

1. **Check the browser console** for JavaScript errors
2. **Inspect the DOM** to verify elements and styles are applied
3. **Review the source code** - the lib/ folder contains well-documented utilities
4. **Check existing issues** on the repository
5. **Create a minimal reproduction** if reporting a bug

Remember: Design Manager is designed to be embedded in host applications. Many issues stem from interactions between Design Manager and host app code, CSS, or configuration.
