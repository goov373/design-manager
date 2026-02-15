/**
 * Surfaces Tab
 *
 * Paper surface colors, radius, and texture controls with visual preview.
 */

import { useDesignManagerContext } from '../context/DesignManagerContext';
import { ColorPicker } from '../components/controls/ColorPicker';

export function SurfacesTab() {
  const { theme, setToken } = useDesignManagerContext();

  const {
    paperWhite = 'oklch(0.98 0.01 90)',
    paperCream = 'oklch(0.96 0.02 85)',
    paperKraft = 'oklch(0.75 0.08 70)',
    radius = 0.625,
    textureOpacityFaint = 0.04,
  } = theme;

  return (
    <div className="dm-tab-content dm-surfaces-tab">
      <div className="dm-tab-header">
        <h3 className="dm-tab-title">Surfaces</h3>
        <p className="dm-tab-description">
          Configure paper textures, corners, and depth.
        </p>
      </div>

      {/* Paper Colors */}
      <div className="dm-surfaces-section">
        <h4 className="dm-section-title">Paper Colors</h4>

        <div className="dm-surface-row">
          <div className="dm-surface-info">
            <span className="dm-surface-name">Paper White</span>
            <span className="dm-surface-var">--paper-white</span>
          </div>
          <ColorPicker
            value={paperWhite}
            onChange={(color) => setToken('paperWhite', color)}
            showBadge={false}
          />
          <div
            className="dm-surface-swatch-large"
            style={{ backgroundColor: paperWhite }}
          />
        </div>

        <div className="dm-surface-row">
          <div className="dm-surface-info">
            <span className="dm-surface-name">Paper Cream</span>
            <span className="dm-surface-var">--paper-cream</span>
          </div>
          <ColorPicker
            value={paperCream}
            onChange={(color) => setToken('paperCream', color)}
            showBadge={false}
          />
          <div
            className="dm-surface-swatch-large"
            style={{ backgroundColor: paperCream }}
          />
        </div>

        <div className="dm-surface-row">
          <div className="dm-surface-info">
            <span className="dm-surface-name">Paper Kraft</span>
            <span className="dm-surface-var">--paper-kraft</span>
          </div>
          <ColorPicker
            value={paperKraft}
            onChange={(color) => setToken('paperKraft', color)}
            showBadge={false}
          />
          <div
            className="dm-surface-swatch-large"
            style={{ backgroundColor: paperKraft }}
          />
        </div>
      </div>

      {/* Border Radius */}
      <div className="dm-surfaces-section">
        <h4 className="dm-section-title">Border Radius</h4>

        <div className="dm-radius-control">
          <input
            type="range"
            className="dm-slider dm-slider-large"
            min="0"
            max="2"
            step="0.125"
            value={radius}
            onChange={(e) => setToken('radius', parseFloat(e.target.value))}
          />
          <span className="dm-slider-value">{radius}rem</span>
        </div>

        <div className="dm-radius-presets">
          {[0, 0.25, 0.5, 0.75, 1, 1.5].map((r) => (
            <button
              key={r}
              type="button"
              className={`dm-radius-preset ${radius === r ? 'dm-selected' : ''}`}
              onClick={() => setToken('radius', r)}
            >
              <div
                className="dm-preset-shape"
                style={{ borderRadius: `${r}rem` }}
              />
              <span>{r}</span>
            </button>
          ))}
        </div>

        <div className="dm-radius-preview">
          <div
            className="dm-radius-card"
            style={{ borderRadius: `${radius}rem` }}
          >
            <div className="dm-card-content">
              <div className="dm-card-title">Card Preview</div>
              <div className="dm-card-text">
                This card shows the current border radius setting.
              </div>
              <button
                className="dm-card-button"
                style={{ borderRadius: `calc(${radius}rem - 4px)` }}
              >
                Button
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Texture Opacity */}
      <div className="dm-surfaces-section">
        <h4 className="dm-section-title">Paper Texture</h4>

        <div className="dm-texture-control">
          <label className="dm-label">Texture Opacity</label>
          <div className="dm-slider-row">
            <input
              type="range"
              className="dm-slider"
              min="0"
              max="0.2"
              step="0.01"
              value={textureOpacityFaint}
              onChange={(e) => setToken('textureOpacityFaint', parseFloat(e.target.value))}
            />
            <span className="dm-slider-value">
              {(textureOpacityFaint * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        <div className="dm-texture-preview">
          <div
            className="dm-texture-sample"
            style={{
              backgroundColor: paperCream,
              '--texture-opacity': textureOpacityFaint,
            }}
          >
            <span>Paper texture preview</span>
          </div>
        </div>
      </div>

      {/* Elevation Preview */}
      <div className="dm-surfaces-section">
        <h4 className="dm-section-title">Elevation</h4>

        <div className="dm-elevation-preview">
          {[0, 1, 2, 3].map((level) => (
            <div
              key={level}
              className={`dm-elevation-sample dm-elevation-${level}`}
              style={{
                borderRadius: `${radius}rem`,
                backgroundColor: paperWhite,
              }}
            >
              <span>Level {level}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SurfacesTab;
