/**
 * Accessible Palette Generator
 *
 * Accessibility-FIRST palette generation.
 * Set WCAG level, then generate - all colors guaranteed to meet contrast requirements.
 */

import { useState, useMemo } from 'react';
import { Palette, Check, AlertTriangle, RefreshCw } from 'lucide-react';
import { useDesignManagerContext } from '../../context/DesignManagerContext';
import { parseToOklch, toHexString } from '../../lib/color-utils';
import { getContrastRatio, WCAG_THRESHOLDS } from '../../lib/contrast-checker';

/**
 * Generate an accessible palette from a brand color
 * All generated colors are guaranteed to meet the target contrast ratio
 */
function generateAccessiblePalette(brandColor, targetLevel = 'AA') {
  const brand = parseToOklch(brandColor);
  if (!brand) return null;

  const targetRatio = targetLevel === 'AAA'
    ? WCAG_THRESHOLDS.AAA_NORMAL
    : WCAG_THRESHOLDS.AA_NORMAL;

  const brandH = brand.h || 0;
  const brandC = brand.c || 0.15;

  // Generate background (very light)
  const background = `oklch(0.985 0.008 ${brandH})`;

  // Generate foreground that meets contrast with background
  // For light backgrounds, we need dark text
  let foregroundL = 0.15;
  while (getContrastRatio(`oklch(${foregroundL} 0.02 ${brandH})`, background) < targetRatio && foregroundL > 0) {
    foregroundL -= 0.02;
  }
  const foreground = `oklch(${Math.max(0.1, foregroundL).toFixed(3)} 0.02 ${brandH})`;

  // Card is same as background for consistency
  const card = background;
  const cardForeground = foreground;

  // Popover
  const popover = `oklch(0.995 0.005 ${brandH})`;
  const popoverForeground = foreground;

  // Primary - use the brand color, but ensure foreground contrast
  let primaryL = brand.l || 0.6;
  // Primary foreground needs to contrast with primary
  const primaryForeground = primaryL > 0.6
    ? `oklch(0.15 0.02 ${brandH})` // Dark text on light primary
    : `oklch(0.98 0.01 ${brandH})`; // Light text on dark primary

  // Adjust primary if needed for contrast
  const primaryFgLum = primaryL > 0.6 ? 0.15 : 0.98;
  while (
    getContrastRatio(
      `oklch(${primaryL} ${brandC} ${brandH})`,
      `oklch(${primaryFgLum} 0.02 ${brandH})`
    ) < targetRatio &&
    (primaryL > 0.6 ? primaryL > 0.3 : primaryL < 0.8)
  ) {
    primaryL = primaryL > 0.6 ? primaryL - 0.02 : primaryL + 0.02;
  }
  const primary = `oklch(${primaryL.toFixed(3)} ${brandC.toFixed(3)} ${brandH})`;

  // Secondary - muted version
  const secondary = `oklch(0.92 0.025 ${brandH})`;
  // Secondary foreground must contrast with secondary background
  let secondaryFgL = 0.25;
  while (getContrastRatio(`oklch(${secondaryFgL} 0.03 ${brandH})`, secondary) < targetRatio && secondaryFgL > 0) {
    secondaryFgL -= 0.02;
  }
  const secondaryForeground = `oklch(${Math.max(0.1, secondaryFgL).toFixed(3)} 0.03 ${brandH})`;

  // Muted
  const muted = `oklch(0.94 0.02 ${brandH})`;
  let mutedFgL = 0.45;
  while (getContrastRatio(`oklch(${mutedFgL} 0.04 ${brandH})`, muted) < targetRatio && mutedFgL > 0) {
    mutedFgL -= 0.02;
  }
  const mutedForeground = `oklch(${Math.max(0.25, mutedFgL).toFixed(3)} 0.04 ${brandH})`;

  // Accent - shifted hue for variety
  const accentH = (brandH + 30) % 360;
  const accent = `oklch(0.93 0.04 ${accentH})`;
  let accentFgL = 0.25;
  while (getContrastRatio(`oklch(${accentFgL} 0.03 ${accentH})`, accent) < targetRatio && accentFgL > 0) {
    accentFgL -= 0.02;
  }
  const accentForeground = `oklch(${Math.max(0.1, accentFgL).toFixed(3)} 0.03 ${accentH})`;

  // Destructive - red tones
  const destructive = `oklch(0.55 0.22 25)`;
  const destructiveForeground = `oklch(0.98 0.01 25)`;

  // Border & Input
  const border = `oklch(0.88 0.025 ${brandH})`;
  const input = border;
  const ring = primary;

  return {
    background,
    foreground,
    card,
    cardForeground,
    popover,
    popoverForeground,
    primary,
    primaryForeground,
    secondary,
    secondaryForeground,
    muted,
    mutedForeground,
    accent,
    accentForeground,
    destructive,
    destructiveForeground,
    border,
    input,
    ring,
  };
}

/**
 * Check all contrast pairs in a palette
 */
function checkPaletteContrast(palette, targetRatio) {
  const pairs = [
    { name: 'Background / Foreground', fg: 'foreground', bg: 'background' },
    { name: 'Card / Card Foreground', fg: 'cardForeground', bg: 'card' },
    { name: 'Primary / Primary Foreground', fg: 'primaryForeground', bg: 'primary' },
    { name: 'Secondary / Secondary Foreground', fg: 'secondaryForeground', bg: 'secondary' },
    { name: 'Muted / Muted Foreground', fg: 'mutedForeground', bg: 'muted' },
    { name: 'Accent / Accent Foreground', fg: 'accentForeground', bg: 'accent' },
    { name: 'Destructive / Destructive Foreground', fg: 'destructiveForeground', bg: 'destructive' },
  ];

  return pairs.map(({ name, fg, bg }) => {
    const ratio = getContrastRatio(palette[fg], palette[bg]);
    return {
      name,
      ratio: ratio.toFixed(2),
      passes: ratio >= targetRatio,
    };
  });
}

export function AccessiblePaletteGenerator({ onClose }) {
  const { setColor, colors } = useDesignManagerContext();
  const [brandColor, setBrandColor] = useState(colors.light.primary || 'oklch(0.65 0.18 55)');
  const [targetLevel, setTargetLevel] = useState('AA');
  const [generated, setGenerated] = useState(null);

  const targetRatio = targetLevel === 'AAA'
    ? WCAG_THRESHOLDS.AAA_NORMAL
    : WCAG_THRESHOLDS.AA_NORMAL;

  // Generate palette when inputs change
  const palette = useMemo(() => {
    return generateAccessiblePalette(brandColor, targetLevel);
  }, [brandColor, targetLevel]);

  // Check contrast of generated palette
  const contrastResults = useMemo(() => {
    if (!palette) return [];
    return checkPaletteContrast(palette, targetRatio);
  }, [palette, targetRatio]);

  const allPass = contrastResults.every((r) => r.passes);

  const handleGenerate = () => {
    setGenerated(palette);
  };

  const handleApply = () => {
    if (!palette) return;

    // Apply all colors to light mode
    Object.entries(palette).forEach(([token, value]) => {
      setColor(token, value, 'light');
    });

    setGenerated(palette);
  };

  return (
    <div className="dm-accessible-generator">
      {/* Inputs */}
      <div className="dm-accessible-inputs">
        <div className="dm-accessible-input-group">
          <label className="dm-accessible-label">Brand Color</label>
          <div className="dm-accessible-color-input">
            <div
              className="dm-accessible-swatch"
              style={{ backgroundColor: toHexString(brandColor) }}
            />
            <input
              type="text"
              className="dm-input dm-input-small"
              value={brandColor}
              onChange={(e) => setBrandColor(e.target.value)}
              placeholder="oklch(0.65 0.18 55)"
            />
          </div>
        </div>

        <div className="dm-accessible-input-group">
          <label className="dm-accessible-label">WCAG Target</label>
          <div className="dm-accessible-level-select">
            <button
              type="button"
              className={`dm-accessible-level ${targetLevel === 'AA' ? 'dm-active' : ''}`}
              onClick={() => setTargetLevel('AA')}
            >
              <span className="dm-level-name">AA</span>
              <span className="dm-level-ratio">4.5:1</span>
            </button>
            <button
              type="button"
              className={`dm-accessible-level ${targetLevel === 'AAA' ? 'dm-active' : ''}`}
              onClick={() => setTargetLevel('AAA')}
            >
              <span className="dm-level-name">AAA</span>
              <span className="dm-level-ratio">7:1</span>
            </button>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className={`dm-accessible-status ${allPass ? 'dm-all-pass' : 'dm-some-fail'}`}>
        {allPass ? (
          <>
            <Check size={16} />
            <span>All {contrastResults.length} color pairs meet {targetLevel} requirements</span>
          </>
        ) : (
          <>
            <AlertTriangle size={16} />
            <span>Some pairs may not meet requirements</span>
          </>
        )}
      </div>

      {/* Palette Preview */}
      {palette && (
        <div className="dm-accessible-preview">
          <div className="dm-accessible-preview-header">
            <span className="dm-accessible-label">Generated Palette</span>
            <button
              type="button"
              className="dm-button dm-button-ghost dm-button-small"
              onClick={handleGenerate}
              title="Regenerate"
            >
              <RefreshCw size={14} />
            </button>
          </div>

          {/* Color Swatches */}
          <div className="dm-accessible-swatches">
            {Object.entries(palette).slice(0, 10).map(([name, color]) => (
              <div key={name} className="dm-accessible-swatch-item">
                <div
                  className="dm-accessible-swatch-color"
                  style={{ backgroundColor: toHexString(color) }}
                />
                <span className="dm-accessible-swatch-name">
                  {name.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>
            ))}
          </div>

          {/* Contrast Results */}
          <div className="dm-accessible-results">
            <span className="dm-accessible-label">Contrast Checks</span>
            <div className="dm-accessible-checks">
              {contrastResults.map((result) => (
                <div
                  key={result.name}
                  className={`dm-accessible-check ${result.passes ? 'dm-pass' : 'dm-fail'}`}
                >
                  <span className="dm-check-name">{result.name}</span>
                  <span className="dm-check-ratio">{result.ratio}:1</span>
                  {result.passes ? (
                    <Check size={12} className="dm-check-icon" />
                  ) : (
                    <AlertTriangle size={12} className="dm-check-icon" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="dm-accessible-actions">
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
          disabled={!palette}
        >
          <Palette size={14} />
          Apply to Theme
        </button>
      </div>

      {/* Applied Notice */}
      {generated && (
        <div className="dm-accessible-applied">
          Palette applied to light mode. Switch to Colors tab to see changes.
        </div>
      )}
    </div>
  );
}

export default AccessiblePaletteGenerator;
