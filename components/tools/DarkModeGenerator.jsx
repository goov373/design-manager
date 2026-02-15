/**
 * Enhanced Dark Mode Generator
 *
 * Side-by-side preview with adjustment controls for generating dark mode palettes.
 * Upgrade from the simple button in ColorsTab.
 */

import { useState, useMemo } from 'react';
import { Moon, Sun, RefreshCw, ArrowLeftRight, Bot } from 'lucide-react';
import { useDesignManagerContext } from '../../context/DesignManagerContext';
import { parseToOklch, toHexString } from '../../lib/color-utils';
import { formatDarkModeColors, copyToClipboard } from '../../lib/ai-copy-utils';

/**
 * Generate dark mode color with adjustable parameters
 */
function generateDarkModeColor(color, tokenName, darknessLevel = 0.85, saturationBoost = 1.1) {
  const oklch = parseToOklch(color);
  if (!oklch) return color;

  const l = oklch.l || 0;
  const c = oklch.c || 0;
  const h = oklch.h || 0;

  let newL;
  let newC = c;

  // Background tokens: invert to dark
  if (tokenName === 'background' || tokenName === 'card' || tokenName === 'popover' || tokenName === 'muted') {
    // Adjust based on darkness level (0.5 = lighter dark, 1 = darker)
    const targetL = 0.12 + (1 - darknessLevel) * 0.15;
    newL = Math.max(0.08, Math.min(0.35, targetL));
  }
  // Foreground/text tokens: invert to light
  else if (tokenName.includes('Foreground') || tokenName === 'foreground') {
    newL = Math.max(0.85, Math.min(0.98, 1 - l));
  }
  // Border/input tokens: make them visible on dark backgrounds
  else if (tokenName === 'border' || tokenName === 'input') {
    newL = Math.max(0.25, Math.min(0.45, 1 - l * darknessLevel));
  }
  // Accent colors (primary, secondary, accent, ring): boost for dark mode
  else if (tokenName === 'primary' || tokenName === 'secondary' || tokenName === 'accent' || tokenName === 'ring') {
    newL = Math.min(0.85, l + 0.1);
    newC = Math.min(0.35, c * saturationBoost);
  }
  // Destructive: keep visible
  else if (tokenName === 'destructive') {
    newL = Math.min(0.75, l + 0.12);
    newC = Math.min(0.35, c * saturationBoost * 0.95);
  }
  // Default: simple inversion
  else {
    newL = 1 - l;
  }

  return `oklch(${newL.toFixed(3)} ${newC.toFixed(3)} ${h.toFixed(3)})`;
}

/**
 * Generate light mode from dark mode (reverse)
 */
function generateLightModeColor(color, tokenName) {
  const oklch = parseToOklch(color);
  if (!oklch) return color;

  const l = oklch.l || 0;
  const c = oklch.c || 0;
  const h = oklch.h || 0;

  let newL;
  let newC = c;

  // Background tokens: invert to light
  if (tokenName === 'background' || tokenName === 'card' || tokenName === 'popover' || tokenName === 'muted') {
    newL = Math.max(0.92, Math.min(0.99, 1 - l));
  }
  // Foreground/text tokens: invert to dark
  else if (tokenName.includes('Foreground') || tokenName === 'foreground') {
    newL = Math.max(0.1, Math.min(0.25, 1 - l));
  }
  // Border/input tokens
  else if (tokenName === 'border' || tokenName === 'input') {
    newL = Math.max(0.85, Math.min(0.92, 1 - l));
  }
  // Accent colors: reduce lightness for light mode
  else if (tokenName === 'primary' || tokenName === 'secondary' || tokenName === 'accent' || tokenName === 'ring') {
    newL = Math.max(0.4, l - 0.15);
    newC = Math.max(0.1, c * 0.9);
  }
  // Destructive
  else if (tokenName === 'destructive') {
    newL = Math.max(0.45, l - 0.15);
  }
  // Default
  else {
    newL = 1 - l;
  }

  return `oklch(${newL.toFixed(3)} ${newC.toFixed(3)} ${h.toFixed(3)})`;
}

// Mini preview component
function ModePreview({ colors, label, icon: Icon }) {
  const c = {};
  Object.entries(colors).forEach(([key, value]) => {
    c[key] = toHexString(value);
  });

  return (
    <div className="dm-darkmode-preview">
      <div className="dm-darkmode-label">
        <Icon size={12} />
        {label}
      </div>
      <div
        className="dm-darkmode-preview-box"
        style={{ backgroundColor: c.background }}
      >
        <div
          className="dm-darkmode-preview-card"
          style={{ backgroundColor: c.card, borderColor: c.border }}
        >
          <span style={{ color: c.foreground }}>Heading</span>
          <span style={{ color: c.mutedForeground }}>Body text</span>
          <div className="dm-darkmode-preview-buttons">
            <span
              className="dm-darkmode-btn"
              style={{ backgroundColor: c.primary, color: c.primaryForeground }}
            >
              Primary
            </span>
            <span
              className="dm-darkmode-btn"
              style={{ backgroundColor: c.secondary, color: c.secondaryForeground }}
            >
              Secondary
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DarkModeGenerator({ onClose }) {
  const { colors, setColor } = useDesignManagerContext();
  const [darknessLevel, setDarknessLevel] = useState(0.85);
  const [saturationBoost, setSaturationBoost] = useState(1.1);
  const [direction, setDirection] = useState('lightToDark'); // or 'darkToLight'
  const [applied, setApplied] = useState(false);
  const [copiedForAI, setCopiedForAI] = useState(false);

  // Generate preview
  const generatedColors = useMemo(() => {
    const source = direction === 'lightToDark' ? colors.light : colors.dark;
    const generated = {};

    Object.entries(source).forEach(([token, color]) => {
      if (direction === 'lightToDark') {
        generated[token] = generateDarkModeColor(color, token, darknessLevel, saturationBoost);
      } else {
        generated[token] = generateLightModeColor(color, token);
      }
    });

    return generated;
  }, [colors, direction, darknessLevel, saturationBoost]);

  const handleApply = () => {
    const targetMode = direction === 'lightToDark' ? 'dark' : 'light';

    Object.entries(generatedColors).forEach(([token, color]) => {
      setColor(token, color, targetMode);
    });

    setApplied(true);
    setTimeout(() => setApplied(false), 2000);
  };

  const handleSwapDirection = () => {
    setDirection(direction === 'lightToDark' ? 'darkToLight' : 'lightToDark');
  };

  const handleCopyForAI = async () => {
    const aiText = formatDarkModeColors({
      lightColors: direction === 'lightToDark' ? sourceColors : generatedColors,
      darkColors: direction === 'lightToDark' ? generatedColors : sourceColors,
      algorithm: `Perceptual adjustment (darkness: ${Math.round(darknessLevel * 100)}%, saturation: ${Math.round(saturationBoost * 100)}%)`,
    });

    const success = await copyToClipboard(aiText);
    if (success) {
      setCopiedForAI(true);
      setTimeout(() => setCopiedForAI(false), 2000);
    }
  };

  const sourceColors = direction === 'lightToDark' ? colors.light : colors.dark;

  return (
    <div className="dm-darkmode-generator">
      {/* Direction Toggle */}
      <div className="dm-darkmode-direction">
        <button
          type="button"
          className={`dm-darkmode-dir-btn ${direction === 'lightToDark' ? 'dm-active' : ''}`}
          onClick={() => setDirection('lightToDark')}
        >
          <Sun size={14} />
          Light → Dark
        </button>
        <button
          type="button"
          className="dm-darkmode-swap"
          onClick={handleSwapDirection}
          title="Swap direction"
        >
          <ArrowLeftRight size={14} />
        </button>
        <button
          type="button"
          className={`dm-darkmode-dir-btn ${direction === 'darkToLight' ? 'dm-active' : ''}`}
          onClick={() => setDirection('darkToLight')}
        >
          <Moon size={14} />
          Dark → Light
        </button>
      </div>

      {/* Adjustment Controls (only for light to dark) */}
      {direction === 'lightToDark' && (
        <div className="dm-darkmode-controls">
          <div className="dm-darkmode-control">
            <label className="dm-darkmode-control-label">
              Darkness Level
              <span className="dm-darkmode-control-value">{Math.round(darknessLevel * 100)}%</span>
            </label>
            <input
              type="range"
              className="dm-slider"
              value={darknessLevel}
              onChange={(e) => setDarknessLevel(Number(e.target.value))}
              min={0.5}
              max={1}
              step={0.05}
            />
          </div>

          <div className="dm-darkmode-control">
            <label className="dm-darkmode-control-label">
              Saturation Boost
              <span className="dm-darkmode-control-value">{Math.round(saturationBoost * 100)}%</span>
            </label>
            <input
              type="range"
              className="dm-slider"
              value={saturationBoost}
              onChange={(e) => setSaturationBoost(Number(e.target.value))}
              min={0.8}
              max={1.5}
              step={0.05}
            />
          </div>
        </div>
      )}

      {/* Side-by-side Preview */}
      <div className="dm-darkmode-previews">
        <ModePreview
          colors={sourceColors}
          label={direction === 'lightToDark' ? 'Light (Source)' : 'Dark (Source)'}
          icon={direction === 'lightToDark' ? Sun : Moon}
        />
        <ModePreview
          colors={generatedColors}
          label={direction === 'lightToDark' ? 'Dark (Generated)' : 'Light (Generated)'}
          icon={direction === 'lightToDark' ? Moon : Sun}
        />
      </div>

      {/* Actions */}
      <div className="dm-darkmode-actions">
        <button
          type="button"
          className="dm-button dm-button-secondary"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="button"
          className="dm-button dm-button-ghost"
          onClick={handleCopyForAI}
          title="Copy color mapping for AI tools"
        >
          <Bot size={14} />
          {copiedForAI ? 'Copied!' : 'Copy for AI'}
        </button>
        <button
          type="button"
          className="dm-button dm-button-primary"
          onClick={handleApply}
        >
          <RefreshCw size={14} />
          Apply to {direction === 'lightToDark' ? 'Dark' : 'Light'} Mode
        </button>
      </div>

      {/* Success Message */}
      {applied && (
        <div className="dm-darkmode-success">
          {direction === 'lightToDark' ? 'Dark' : 'Light'} mode generated! Check the Colors tab.
        </div>
      )}
    </div>
  );
}

export default DarkModeGenerator;
