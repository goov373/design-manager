/**
 * Live Preview Color Tester
 *
 * See your color palette on a realistic UI mockup before committing.
 * Shows how colors look in context, not just as swatches.
 */

import { useState } from 'react';
import { Eye, Moon, Sun, EyeOff } from 'lucide-react';
import { useDesignManagerContext } from '../../context/DesignManagerContext';
import { toHexString } from '../../lib/color-utils';
import { simulateColorBlindness, CVD_TYPES } from '../../lib/color-blindness';

// Apply CVD simulation to a color
function applySimulation(color, cvdMode) {
  if (!cvdMode) return color;
  return simulateColorBlindness(color, cvdMode);
}

// Mini UI Mockup Component
function UIMockup({ colors, cvdMode, label }) {
  // Apply CVD simulation to all colors
  const c = {};
  Object.entries(colors).forEach(([key, value]) => {
    c[key] = toHexString(applySimulation(value, cvdMode));
  });

  return (
    <div className="dm-preview-mockup">
      <div className="dm-preview-label">{label}</div>

      {/* Mini Page Layout */}
      <div
        className="dm-preview-page"
        style={{ backgroundColor: c.background, color: c.foreground }}
      >
        {/* Nav Bar */}
        <div
          className="dm-preview-nav"
          style={{ backgroundColor: c.card, borderColor: c.border }}
        >
          <div className="dm-preview-logo" style={{ color: c.primary }}>
            Logo
          </div>
          <div className="dm-preview-nav-links">
            <span style={{ color: c.foreground }}>Home</span>
            <span style={{ color: c.mutedForeground }}>About</span>
            <span style={{ color: c.mutedForeground }}>Contact</span>
          </div>
        </div>

        {/* Card */}
        <div
          className="dm-preview-card"
          style={{
            backgroundColor: c.card,
            borderColor: c.border,
            color: c.cardForeground,
          }}
        >
          <h3 className="dm-preview-card-title">Card Title</h3>
          <p className="dm-preview-card-text" style={{ color: c.mutedForeground }}>
            This is sample body text to show how your typography colors look.
          </p>

          {/* Buttons */}
          <div className="dm-preview-buttons">
            <button
              className="dm-preview-btn-primary"
              style={{
                backgroundColor: c.primary,
                color: c.primaryForeground,
              }}
            >
              Primary
            </button>
            <button
              className="dm-preview-btn-secondary"
              style={{
                backgroundColor: c.secondary,
                color: c.secondaryForeground,
              }}
            >
              Secondary
            </button>
          </div>
        </div>

        {/* Form Input */}
        <div className="dm-preview-form">
          <input
            type="text"
            placeholder="Input field..."
            className="dm-preview-input"
            style={{
              backgroundColor: c.background,
              borderColor: c.input,
              color: c.foreground,
            }}
            readOnly
          />
        </div>

        {/* Accent & Destructive */}
        <div className="dm-preview-tags">
          <span
            className="dm-preview-tag"
            style={{ backgroundColor: c.accent, color: c.accentForeground }}
          >
            Accent
          </span>
          <span
            className="dm-preview-tag"
            style={{ backgroundColor: c.muted, color: c.mutedForeground }}
          >
            Muted
          </span>
          <span
            className="dm-preview-tag dm-preview-tag-destructive"
            style={{ backgroundColor: c.destructive, color: '#fff' }}
          >
            Delete
          </span>
        </div>
      </div>
    </div>
  );
}

export function LivePreview({ onClose }) {
  const { colors } = useDesignManagerContext();
  const [cvdMode, setCvdMode] = useState(null);
  const [showBothModes, setShowBothModes] = useState(true);

  return (
    <div className="dm-live-preview">
      {/* Controls */}
      <div className="dm-preview-controls">
        <div className="dm-preview-control">
          <label className="dm-preview-control-label">View Mode</label>
          <div className="dm-preview-toggle-group">
            <button
              type="button"
              className={`dm-preview-toggle ${showBothModes ? 'dm-active' : ''}`}
              onClick={() => setShowBothModes(true)}
            >
              Both
            </button>
            <button
              type="button"
              className={`dm-preview-toggle ${!showBothModes ? 'dm-active' : ''}`}
              onClick={() => setShowBothModes(false)}
            >
              Single
            </button>
          </div>
        </div>

        <div className="dm-preview-control">
          <label className="dm-preview-control-label">Vision Simulation</label>
          <select
            className="dm-select dm-select-small"
            value={cvdMode || ''}
            onChange={(e) => setCvdMode(e.target.value || null)}
          >
            <option value="">Normal vision</option>
            <option value={CVD_TYPES.PROTANOPIA}>Protanopia (red-blind)</option>
            <option value={CVD_TYPES.DEUTERANOPIA}>Deuteranopia (green-blind)</option>
            <option value={CVD_TYPES.TRITANOPIA}>Tritanopia (blue-blind)</option>
          </select>
          {cvdMode ? (
            <Eye size={14} className="dm-preview-cvd-icon dm-active" />
          ) : (
            <EyeOff size={14} className="dm-preview-cvd-icon" />
          )}
        </div>
      </div>

      {/* CVD Warning */}
      {cvdMode && (
        <div className="dm-preview-cvd-notice">
          <Eye size={14} />
          Simulating {cvdMode} color vision
        </div>
      )}

      {/* Mockups */}
      <div className={`dm-preview-mockups ${showBothModes ? 'dm-both' : 'dm-single'}`}>
        <UIMockup
          colors={colors.light}
          cvdMode={cvdMode}
          label={
            <span className="dm-preview-mode-label">
              <Sun size={12} /> Light
            </span>
          }
        />
        {showBothModes && (
          <UIMockup
            colors={colors.dark}
            cvdMode={cvdMode}
            label={
              <span className="dm-preview-mode-label">
                <Moon size={12} /> Dark
              </span>
            }
          />
        )}
      </div>

      {/* Info */}
      <p className="dm-preview-info">
        This preview shows your current theme colors. Changes in the Colors tab will reflect here in real-time.
      </p>

      {/* Actions */}
      <div className="dm-preview-actions">
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

export default LivePreview;
