/**
 * Design Token Scale Generator
 *
 * Generate harmonious spacing, border-radius, and shadow scales.
 * Based on mathematical ratios like type scales.
 */

import { useState, useMemo } from 'react';
import { Copy, Check, Download } from 'lucide-react';

// Scale ratio presets
const SCALE_RATIOS = {
  'minor-second': { name: 'Minor Second', ratio: 1.067 },
  'major-second': { name: 'Major Second', ratio: 1.125 },
  'minor-third': { name: 'Minor Third', ratio: 1.2 },
  'major-third': { name: 'Major Third', ratio: 1.25 },
  'perfect-fourth': { name: 'Perfect Fourth', ratio: 1.333 },
  'golden': { name: 'Golden Ratio', ratio: 1.618 },
};

// Generate spacing scale
function generateSpacingScale(base, ratio, steps = 10) {
  const scale = {};
  const names = ['3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];

  for (let i = 0; i < steps; i++) {
    const value = Math.round(base * Math.pow(ratio, i - 4)); // Center on 'md'
    scale[names[i]] = Math.max(1, value);
  }

  return scale;
}

// Generate radius scale
function generateRadiusScale(base) {
  return {
    none: 0,
    sm: Math.round(base * 0.5),
    md: base,
    lg: Math.round(base * 1.5),
    xl: Math.round(base * 2),
    '2xl': Math.round(base * 3),
    full: 9999,
  };
}

// Generate shadow scale
function generateShadowScale(intensity = 1) {
  const base = intensity;
  return {
    none: 'none',
    sm: `0 1px 2px 0 rgb(0 0 0 / ${(0.05 * base).toFixed(2)})`,
    md: `0 4px 6px -1px rgb(0 0 0 / ${(0.1 * base).toFixed(2)}), 0 2px 4px -2px rgb(0 0 0 / ${(0.1 * base).toFixed(2)})`,
    lg: `0 10px 15px -3px rgb(0 0 0 / ${(0.1 * base).toFixed(2)}), 0 4px 6px -4px rgb(0 0 0 / ${(0.1 * base).toFixed(2)})`,
    xl: `0 20px 25px -5px rgb(0 0 0 / ${(0.1 * base).toFixed(2)}), 0 8px 10px -6px rgb(0 0 0 / ${(0.1 * base).toFixed(2)})`,
    '2xl': `0 25px 50px -12px rgb(0 0 0 / ${(0.25 * base).toFixed(2)})`,
  };
}

// Format as CSS variables
function formatAsCSS(spacing, radius, shadows) {
  let css = '/* Spacing Scale */\n';
  Object.entries(spacing).forEach(([key, value]) => {
    css += `--space-${key}: ${value}px;\n`;
  });

  css += '\n/* Border Radius Scale */\n';
  Object.entries(radius).forEach(([key, value]) => {
    css += `--radius-${key}: ${typeof value === 'number' ? `${value}px` : value};\n`;
  });

  css += '\n/* Shadow Scale */\n';
  Object.entries(shadows).forEach(([key, value]) => {
    css += `--shadow-${key}: ${value};\n`;
  });

  return css;
}

// Format as Tailwind config
function formatAsTailwind(spacing, radius, shadows) {
  return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      spacing: ${JSON.stringify(
        Object.fromEntries(
          Object.entries(spacing).map(([k, v]) => [k, `${v}px`])
        ),
        null,
        8
      ).replace(/"(\d+px)"/g, "'$1'")},
      borderRadius: ${JSON.stringify(
        Object.fromEntries(
          Object.entries(radius).map(([k, v]) =>
            [k, typeof v === 'number' ? `${v}px` : `${v}px`]
          )
        ),
        null,
        8
      ).replace(/"(\d+px)"/g, "'$1'").replace(/"9999px"/g, "'9999px'")},
      boxShadow: ${JSON.stringify(shadows, null, 8).replace(/"/g, "'")},
    },
  },
};`;
}

export function TokenScaleGenerator({ onClose }) {
  const [baseSpacing, setBaseSpacing] = useState(4);
  const [spacingRatio, setSpacingRatio] = useState('minor-third');
  const [baseRadius, setBaseRadius] = useState(8);
  const [shadowIntensity, setShadowIntensity] = useState(1);
  const [exportFormat, setExportFormat] = useState('css');
  const [copied, setCopied] = useState(false);

  const scales = useMemo(() => {
    const ratio = SCALE_RATIOS[spacingRatio].ratio;
    return {
      spacing: generateSpacingScale(baseSpacing, ratio),
      radius: generateRadiusScale(baseRadius),
      shadows: generateShadowScale(shadowIntensity),
    };
  }, [baseSpacing, spacingRatio, baseRadius, shadowIntensity]);

  const exportCode = useMemo(() => {
    if (exportFormat === 'css') {
      return formatAsCSS(scales.spacing, scales.radius, scales.shadows);
    }
    return formatAsTailwind(scales.spacing, scales.radius, scales.shadows);
  }, [scales, exportFormat]);

  const handleCopy = () => {
    navigator.clipboard.writeText(exportCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="dm-token-generator">
      {/* Configuration */}
      <div className="dm-token-config">
        <div className="dm-token-config-row">
          <div className="dm-token-config-item">
            <label className="dm-token-label">Base Spacing</label>
            <div className="dm-token-input-row">
              <input
                type="number"
                className="dm-input dm-input-small"
                value={baseSpacing}
                onChange={(e) => setBaseSpacing(Number(e.target.value))}
                min={1}
                max={16}
              />
              <span className="dm-token-unit">px</span>
            </div>
          </div>

          <div className="dm-token-config-item">
            <label className="dm-token-label">Scale Ratio</label>
            <select
              className="dm-select dm-select-small"
              value={spacingRatio}
              onChange={(e) => setSpacingRatio(e.target.value)}
            >
              {Object.entries(SCALE_RATIOS).map(([key, { name, ratio }]) => (
                <option key={key} value={key}>
                  {name} ({ratio})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="dm-token-config-row">
          <div className="dm-token-config-item">
            <label className="dm-token-label">Base Radius</label>
            <div className="dm-token-input-row">
              <input
                type="number"
                className="dm-input dm-input-small"
                value={baseRadius}
                onChange={(e) => setBaseRadius(Number(e.target.value))}
                min={0}
                max={32}
              />
              <span className="dm-token-unit">px</span>
            </div>
          </div>

          <div className="dm-token-config-item">
            <label className="dm-token-label">Shadow Intensity</label>
            <input
              type="range"
              className="dm-slider"
              value={shadowIntensity}
              onChange={(e) => setShadowIntensity(Number(e.target.value))}
              min={0.5}
              max={2}
              step={0.1}
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="dm-token-preview">
        <div className="dm-token-section">
          <h4 className="dm-token-section-title">Spacing</h4>
          <div className="dm-token-scale-preview dm-spacing-preview">
            {Object.entries(scales.spacing).map(([key, value]) => (
              <div key={key} className="dm-token-scale-item">
                <div
                  className="dm-spacing-box"
                  style={{ width: `${Math.min(value, 64)}px`, height: '20px' }}
                />
                <span className="dm-token-name">{key}</span>
                <span className="dm-token-value">{value}px</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dm-token-section">
          <h4 className="dm-token-section-title">Border Radius</h4>
          <div className="dm-token-scale-preview dm-radius-preview">
            {Object.entries(scales.radius).slice(1, -1).map(([key, value]) => (
              <div key={key} className="dm-token-scale-item">
                <div
                  className="dm-radius-box"
                  style={{ borderRadius: `${value}px` }}
                />
                <span className="dm-token-name">{key}</span>
                <span className="dm-token-value">{value}px</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dm-token-section">
          <h4 className="dm-token-section-title">Shadows</h4>
          <div className="dm-token-scale-preview dm-shadow-preview">
            {Object.entries(scales.shadows).slice(1).map(([key, value]) => (
              <div key={key} className="dm-token-scale-item">
                <div
                  className="dm-shadow-box"
                  style={{ boxShadow: value }}
                />
                <span className="dm-token-name">{key}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export */}
      <div className="dm-token-export">
        <div className="dm-token-export-header">
          <select
            className="dm-select dm-select-small"
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
          >
            <option value="css">CSS Variables</option>
            <option value="tailwind">Tailwind Config</option>
          </select>

          <button
            type="button"
            className="dm-button dm-button-secondary dm-button-small"
            onClick={handleCopy}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <pre className="dm-token-code">
          <code>{exportCode}</code>
        </pre>
      </div>

      {/* Actions */}
      <div className="dm-token-actions">
        <button
          type="button"
          className="dm-button dm-button-secondary"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default TokenScaleGenerator;
