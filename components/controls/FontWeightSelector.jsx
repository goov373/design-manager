/**
 * FontWeightSelector Component
 *
 * Weight selector that shows only available weights for selected font.
 */

import { useMemo } from 'react';
import { FONT_CATALOG } from '../../lib/typography-config';

/**
 * Weight name mapping
 */
const WEIGHT_NAMES = {
  100: 'Thin',
  200: 'Extra Light',
  300: 'Light',
  400: 'Regular',
  500: 'Medium',
  600: 'Semibold',
  700: 'Bold',
  800: 'Extra Bold',
  900: 'Black',
};

/**
 * Font weight selector
 *
 * @param {Object} props
 * @param {number} props.value - Current weight value
 * @param {Function} props.onChange - Called with new weight
 * @param {string} props.fontId - Font ID to get available weights
 * @param {string} props.label - Label text
 */
export function FontWeightSelector({
  value,
  onChange,
  fontId,
  label,
  className = '',
}) {
  const availableWeights = useMemo(() => {
    const font = FONT_CATALOG[fontId];
    return font?.weights || [400, 500, 600, 700];
  }, [fontId]);

  // If current weight is not available, use closest
  const effectiveValue = useMemo(() => {
    if (availableWeights.includes(value)) return value;
    // Find closest available weight
    return availableWeights.reduce((prev, curr) =>
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );
  }, [value, availableWeights]);

  return (
    <div className={`dm-form-field ${className}`}>
      {label && <label className="dm-label">{label}</label>}
      <select
        className="dm-select"
        value={effectiveValue}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
      >
        {availableWeights.map((weight) => (
          <option key={weight} value={weight}>
            {WEIGHT_NAMES[weight] || weight} ({weight})
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * Visual weight selector with preview
 */
export function VisualWeightSelector({
  value,
  onChange,
  fontId,
  fontFamily,
  label,
}) {
  const availableWeights = useMemo(() => {
    const font = FONT_CATALOG[fontId];
    return font?.weights || [400, 500, 600, 700];
  }, [fontId]);

  return (
    <div className="dm-weight-selector">
      {label && <label className="dm-label">{label}</label>}
      <div className="dm-weight-options">
        {availableWeights.map((weight) => (
          <button
            key={weight}
            type="button"
            className={`dm-weight-option ${value === weight ? 'dm-selected' : ''}`}
            onClick={() => onChange(weight)}
            style={{ fontWeight: weight, fontFamily }}
          >
            <span className="dm-weight-preview">Aa</span>
            <span className="dm-weight-label">{weight}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default FontWeightSelector;
