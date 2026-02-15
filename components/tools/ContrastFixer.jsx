/**
 * Contrast Fixer Tool
 *
 * Fix failing color pairs with minimal visual change.
 * Uses binary search to find the smallest lightness adjustment needed.
 */

import { useState, useMemo } from 'react';
import { Check, AlertTriangle, ArrowRight } from 'lucide-react';
import { useDesignManagerContext } from '../../context/DesignManagerContext';
import { parseToOklch, toHexString } from '../../lib/color-utils';
import {
  getContrastRatio,
  checkContrast,
  WCAG_THRESHOLDS,
} from '../../lib/contrast-checker';

/**
 * Find the minimum lightness adjustment to meet target contrast
 * Uses binary search for efficiency
 */
function findMinimalFix(foreground, background, targetRatio, adjustForeground = true) {
  const fgOklch = parseToOklch(foreground);
  const bgOklch = parseToOklch(background);

  if (!fgOklch || !bgOklch) return null;

  const currentRatio = getContrastRatio(foreground, background);
  if (currentRatio >= targetRatio) {
    return { color: foreground, adjustment: 0, alreadyPasses: true };
  }

  const colorToAdjust = adjustForeground ? fgOklch : bgOklch;
  const fixedColor = adjustForeground ? bgOklch : fgOklch;
  const bgLuminance = bgOklch.l || 0;

  // Determine direction: lighten or darken
  // If foreground is on light background, darken it; otherwise lighten it
  const shouldLighten = adjustForeground
    ? bgLuminance < 0.5
    : bgLuminance > 0.5;

  // Binary search for minimum adjustment
  let low = 0;
  let high = 1;
  let bestL = shouldLighten ? 1 : 0;
  let iterations = 0;
  const maxIterations = 20;

  while (high - low > 0.005 && iterations < maxIterations) {
    const mid = (low + high) / 2;
    const testL = shouldLighten
      ? Math.min(1, (colorToAdjust.l || 0) + mid)
      : Math.max(0, (colorToAdjust.l || 0) - mid);

    const testColor = `oklch(${testL.toFixed(4)} ${(colorToAdjust.c || 0).toFixed(4)} ${(colorToAdjust.h || 0).toFixed(4)})`;

    let testFg, testBg;
    if (adjustForeground) {
      testFg = testColor;
      testBg = `oklch(${(fixedColor.l || 0).toFixed(4)} ${(fixedColor.c || 0).toFixed(4)} ${(fixedColor.h || 0).toFixed(4)})`;
    } else {
      testFg = `oklch(${(fixedColor.l || 0).toFixed(4)} ${(fixedColor.c || 0).toFixed(4)} ${(fixedColor.h || 0).toFixed(4)})`;
      testBg = testColor;
    }

    const testRatio = getContrastRatio(testFg, testBg);

    if (testRatio >= targetRatio) {
      bestL = testL;
      high = mid;
    } else {
      low = mid;
    }
    iterations++;
  }

  const adjustment = Math.abs(bestL - (colorToAdjust.l || 0));
  const fixedColorStr = `oklch(${bestL.toFixed(4)} ${(colorToAdjust.c || 0).toFixed(4)} ${(colorToAdjust.h || 0).toFixed(4)})`;

  return {
    color: fixedColorStr,
    adjustment: adjustment,
    direction: shouldLighten ? 'lightened' : 'darkened',
    alreadyPasses: false,
  };
}

export function ContrastFixer({ onClose }) {
  const { colors, darkMode, setColor } = useDesignManagerContext();
  const currentColors = darkMode ? colors.dark : colors.light;

  const [foreground, setForeground] = useState(currentColors.foreground || '#333333');
  const [background, setBackground] = useState(currentColors.background || '#ffffff');
  const [targetLevel, setTargetLevel] = useState('AA');
  const [adjustWhich, setAdjustWhich] = useState('foreground');

  const targetRatio = targetLevel === 'AAA'
    ? WCAG_THRESHOLDS.AAA_NORMAL
    : WCAG_THRESHOLDS.AA_NORMAL;

  // Calculate current contrast and fix
  const analysis = useMemo(() => {
    const current = checkContrast(foreground, background);
    const fix = findMinimalFix(
      foreground,
      background,
      targetRatio,
      adjustWhich === 'foreground'
    );

    let fixedContrast = null;
    if (fix && !fix.alreadyPasses) {
      if (adjustWhich === 'foreground') {
        fixedContrast = checkContrast(fix.color, background);
      } else {
        fixedContrast = checkContrast(foreground, fix.color);
      }
    }

    return { current, fix, fixedContrast };
  }, [foreground, background, targetRatio, adjustWhich]);

  const handleApply = () => {
    if (analysis.fix && !analysis.fix.alreadyPasses) {
      if (adjustWhich === 'foreground') {
        // Find which token this foreground color belongs to
        const token = Object.entries(currentColors).find(
          ([, value]) => value === foreground
        )?.[0];
        if (token) {
          setColor(token, analysis.fix.color);
        }
        setForeground(analysis.fix.color);
      } else {
        const token = Object.entries(currentColors).find(
          ([, value]) => value === background
        )?.[0];
        if (token) {
          setColor(token, analysis.fix.color);
        }
        setBackground(analysis.fix.color);
      }
    }
  };

  const passes = analysis.current.passes.aa || (targetLevel === 'AA Large' && analysis.current.passes.aaLarge);

  return (
    <div className="dm-contrast-fixer">
      {/* Color Inputs */}
      <div className="dm-fixer-inputs">
        <div className="dm-fixer-color-input">
          <label className="dm-fixer-label">Foreground</label>
          <div className="dm-fixer-color-row">
            <div
              className="dm-fixer-swatch"
              style={{ backgroundColor: toHexString(foreground) }}
            />
            <input
              type="text"
              className="dm-input dm-input-small"
              value={foreground}
              onChange={(e) => setForeground(e.target.value)}
              placeholder="oklch(0.2 0 0)"
            />
          </div>
        </div>

        <div className="dm-fixer-color-input">
          <label className="dm-fixer-label">Background</label>
          <div className="dm-fixer-color-row">
            <div
              className="dm-fixer-swatch"
              style={{ backgroundColor: toHexString(background) }}
            />
            <input
              type="text"
              className="dm-input dm-input-small"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              placeholder="oklch(0.98 0.01 90)"
            />
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="dm-fixer-options">
        <div className="dm-fixer-option">
          <label className="dm-fixer-label">Target Level</label>
          <select
            className="dm-select dm-select-small"
            value={targetLevel}
            onChange={(e) => setTargetLevel(e.target.value)}
          >
            <option value="AA">AA (4.5:1)</option>
            <option value="AAA">AAA (7:1)</option>
          </select>
        </div>

        <div className="dm-fixer-option">
          <label className="dm-fixer-label">Adjust</label>
          <select
            className="dm-select dm-select-small"
            value={adjustWhich}
            onChange={(e) => setAdjustWhich(e.target.value)}
          >
            <option value="foreground">Foreground</option>
            <option value="background">Background</option>
          </select>
        </div>
      </div>

      {/* Current Status */}
      <div className={`dm-fixer-status ${passes ? 'dm-passes' : 'dm-fails'}`}>
        {passes ? (
          <>
            <Check size={16} />
            <span>Already passes {targetLevel}!</span>
          </>
        ) : (
          <>
            <AlertTriangle size={16} />
            <span>
              Fails {targetLevel} — Current ratio: {analysis.current.ratio.toFixed(2)}:1
            </span>
          </>
        )}
      </div>

      {/* Fix Preview */}
      {!passes && analysis.fix && (
        <div className="dm-fixer-preview">
          <label className="dm-fixer-label">Suggested Fix</label>

          <div className="dm-fixer-comparison">
            {/* Before */}
            <div className="dm-fixer-before">
              <div
                className="dm-fixer-preview-box"
                style={{ backgroundColor: toHexString(background) }}
              >
                <span style={{ color: toHexString(foreground) }}>
                  Sample Text
                </span>
              </div>
              <div className="dm-fixer-meta">
                <span className="dm-fixer-ratio">{analysis.current.ratio.toFixed(2)}:1</span>
                <span className="dm-fixer-badge dm-fail">Fails</span>
              </div>
            </div>

            <ArrowRight size={20} className="dm-fixer-arrow" />

            {/* After */}
            <div className="dm-fixer-after">
              <div
                className="dm-fixer-preview-box"
                style={{
                  backgroundColor: toHexString(
                    adjustWhich === 'background' ? analysis.fix.color : background
                  ),
                }}
              >
                <span
                  style={{
                    color: toHexString(
                      adjustWhich === 'foreground' ? analysis.fix.color : foreground
                    ),
                  }}
                >
                  Sample Text
                </span>
              </div>
              <div className="dm-fixer-meta">
                <span className="dm-fixer-ratio">
                  {analysis.fixedContrast?.ratio.toFixed(2)}:1
                </span>
                <span className="dm-fixer-badge dm-pass">Passes</span>
              </div>
            </div>
          </div>

          <p className="dm-fixer-adjustment-info">
            {adjustWhich === 'foreground' ? 'Foreground' : 'Background'}{' '}
            {analysis.fix.direction} by {(analysis.fix.adjustment * 100).toFixed(1)}%
          </p>

          <div className="dm-fixer-suggested-color">
            <span className="dm-fixer-label">New {adjustWhich}:</span>
            <code>{analysis.fix.color}</code>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="dm-fixer-actions">
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
          disabled={passes}
        >
          <Check size={14} />
          Apply Fix
        </button>
      </div>
    </div>
  );
}

export default ContrastFixer;
