/**
 * ColorPicker Component
 *
 * OKLCH color picker with hex input and contrast badge.
 */

import { useState, useEffect, useCallback } from 'react';
import { toHexString, toOklchString, parseToOklch } from '../../lib/color-utils';
import { getContrastBadge } from '../../lib/contrast-checker';

/**
 * Color picker with OKLCH support
 *
 * @param {Object} props
 * @param {string} props.value - Current color value (OKLCH or hex)
 * @param {Function} props.onChange - Called with new OKLCH color
 * @param {string} props.contrastWith - Color to check contrast against
 * @param {string} props.label - Label text
 * @param {boolean} props.showBadge - Whether to show contrast badge
 */
export function ColorPicker({
  value,
  onChange,
  contrastWith,
  label,
  showBadge = true,
  className = '',
}) {
  const [hexValue, setHexValue] = useState(() => toHexString(value));
  const [isEditing, setIsEditing] = useState(false);

  // Sync hex value when prop changes
  useEffect(() => {
    if (!isEditing) {
      setHexValue(toHexString(value));
    }
  }, [value, isEditing]);

  const handleColorChange = useCallback(
    (e) => {
      const newHex = e.target.value;
      setHexValue(newHex);

      // Convert to OKLCH and update
      const oklch = toOklchString(newHex);
      onChange(oklch);
    },
    [onChange]
  );

  const handleHexInput = useCallback(
    (e) => {
      const newHex = e.target.value;
      setHexValue(newHex);

      // Only update if valid hex
      if (/^#[0-9a-fA-F]{6}$/.test(newHex)) {
        const oklch = toOklchString(newHex);
        onChange(oklch);
      }
    },
    [onChange]
  );

  const handleHexBlur = useCallback(() => {
    setIsEditing(false);
    // Normalize hex value
    setHexValue(toHexString(value));
  }, [value]);

  // Calculate contrast badge if needed
  const badge = showBadge && contrastWith
    ? getContrastBadge(value, contrastWith)
    : null;

  return (
    <div className={`dm-color-picker ${className}`}>
      {label && <label className="dm-color-label">{label}</label>}

      <div className="dm-color-controls">
        {/* Native color input */}
        <div className="dm-color-swatch-wrapper">
          <input
            type="color"
            className="dm-color-input"
            value={hexValue}
            onChange={handleColorChange}
          />
          <div
            className="dm-color-swatch-overlay"
            style={{ backgroundColor: value }}
          />
        </div>

        {/* Hex input */}
        <input
          type="text"
          className="dm-hex-input"
          value={hexValue}
          onChange={handleHexInput}
          onFocus={() => setIsEditing(true)}
          onBlur={handleHexBlur}
          placeholder="#000000"
          maxLength={7}
        />

        {/* Contrast badge */}
        {badge && (
          <div
            className={`dm-contrast-badge dm-badge-${badge.score}`}
            title={`Contrast: ${badge.ratio}:1 (${badge.level})`}
          >
            <span className="dm-badge-ratio">{badge.ratio}</span>
            <span className="dm-badge-level">{badge.level}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Inline color swatch (no picker)
 */
export function ColorSwatch({ color, size = 24, onClick, className = '' }) {
  return (
    <button
      type="button"
      className={`dm-inline-swatch ${className}`}
      style={{
        backgroundColor: color,
        width: size,
        height: size,
      }}
      onClick={onClick}
      title={toHexString(color)}
    />
  );
}

export default ColorPicker;
