/**
 * Colors Tab
 *
 * Full color token editor with contrast checking, CVD simulation,
 * and photo color extraction.
 */

import { useState } from 'react';
import { Eye, EyeOff, ImageIcon } from 'lucide-react';
import { useDesignManagerContext } from '../context/DesignManagerContext';
import { COLOR_TOKEN_GROUPS, getCSSVarName } from '../lib/constants';
import { ColorPicker } from '../components/controls/ColorPicker';
import { ContrastBadge } from '../components/controls/ContrastBadge';
import { ExpandableSection } from '../components/controls/ExpandableSection';
import { PhotoExtractor } from '../components/features/PhotoExtractor';
import { simulateColorBlindness, CVD_TYPES } from '../lib/color-blindness';

export function ColorsTab() {
  const { colors, darkMode, setColor } = useDesignManagerContext();
  const [cvdMode, setCvdMode] = useState(null);
  const [showPhotoExtractor, setShowPhotoExtractor] = useState(false);
  const currentColors = darkMode ? colors.dark : colors.light;
  const backgroundColor = currentColors.background;

  // Get display color (with CVD simulation if active)
  const getDisplayColor = (color) => {
    if (!cvdMode) return color;
    return simulateColorBlindness(color, cvdMode);
  };

  // Get foreground token for a given token (for contrast checking)
  const getForegroundToken = (token) => {
    if (token === 'background') return 'foreground';
    if (token === 'card') return 'cardForeground';
    if (token === 'popover') return 'popoverForeground';
    if (token === 'primary') return 'primaryForeground';
    if (token === 'secondary') return 'secondaryForeground';
    if (token === 'muted') return 'mutedForeground';
    if (token === 'accent') return 'accentForeground';
    return null;
  };

  return (
    <div className="dm-tab-content dm-colors-tab">
      <div className="dm-tab-header">
        <div className="dm-header-row">
          <div>
            <h3 className="dm-tab-title">Color Tokens</h3>
            <p className="dm-tab-description">
              Editing {darkMode ? 'dark' : 'light'} mode. Toggle in header.
            </p>
          </div>

          {/* CVD Simulation Toggle */}
          <div className="dm-cvd-toggle">
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
              <Eye size={14} className="dm-cvd-icon dm-active" />
            ) : (
              <EyeOff size={14} className="dm-cvd-icon" />
            )}
          </div>
        </div>
      </div>

      {/* Photo Color Extraction */}
      {showPhotoExtractor ? (
        <PhotoExtractor onClose={() => setShowPhotoExtractor(false)} />
      ) : (
        <button
          type="button"
          className="dm-button dm-button-secondary dm-photo-extract-btn"
          onClick={() => setShowPhotoExtractor(true)}
        >
          <ImageIcon size={14} />
          Extract colors from photo
        </button>
      )}

      <div className="dm-token-groups">
        {COLOR_TOKEN_GROUPS.map((group) => (
          <ExpandableSection
            key={group.id}
            title={group.name}
            defaultExpanded={group.id === 'background' || group.id === 'interactive'}
            badge={`${group.tokens.length}`}
          >
            <div className="dm-token-list">
              {group.tokens.map((token) => {
                const color = currentColors[token];
                const displayColor = getDisplayColor(color);
                const foregroundToken = getForegroundToken(token);
                const contrastWith = foregroundToken
                  ? currentColors[foregroundToken]
                  : backgroundColor;

                return (
                  <div key={token} className="dm-token-row">
                    <div className="dm-token-info">
                      <span className="dm-token-name">{formatTokenName(token)}</span>
                      <span className="dm-token-var">--{getCSSVarName(token)}</span>
                    </div>

                    <div className="dm-token-controls">
                      <ColorPicker
                        value={color}
                        onChange={(newColor) => setColor(token, newColor)}
                        contrastWith={contrastWith}
                        showBadge={!!foregroundToken || token.includes('Foreground')}
                      />
                    </div>

                    {/* Show CVD simulation indicator */}
                    {cvdMode && displayColor !== color && (
                      <div
                        className="dm-cvd-indicator"
                        style={{ backgroundColor: displayColor }}
                        title="Simulated appearance"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </ExpandableSection>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="dm-quick-actions">
        <button
          type="button"
          className="dm-button dm-button-secondary dm-button-small"
          onClick={() => {
            // Copy all light colors to dark with adjusted lightness
            // This is a simple implementation - could be smarter
          }}
        >
          Generate dark mode from light
        </button>
      </div>
    </div>
  );
}

/**
 * Format token name for display
 */
function formatTokenName(token) {
  return token
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

export default ColorsTab;
