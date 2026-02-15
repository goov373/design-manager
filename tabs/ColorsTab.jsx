/**
 * Colors Tab
 *
 * Full color token editor with contrast checking, CVD simulation,
 * and photo color extraction.
 */

import { useState } from 'react';
import { Eye, EyeOff, Wand2 } from 'lucide-react';
import { useDesignManagerContext } from '../context/DesignManagerContext';
import { COLOR_TOKEN_GROUPS, getCSSVarName } from '../lib/constants';
import { ColorPicker } from '../components/controls/ColorPicker';
import { ExpandableSection } from '../components/controls/ExpandableSection';
import { simulateColorBlindness, CVD_TYPES } from '../lib/color-blindness';
import { parseToOklch } from '../lib/color-utils';

/**
 * Generate dark mode color from a light mode color
 * Inverts lightness intelligently based on the token type
 */
function generateDarkModeColor(color, tokenName) {
  const oklch = parseToOklch(color);
  if (!oklch) return color;

  const l = oklch.l || 0;
  const c = oklch.c || 0;
  const h = oklch.h || 0;

  let newL;
  let newC = c;

  // Background tokens: invert to dark
  if (tokenName === 'background' || tokenName === 'card' || tokenName === 'popover' || tokenName === 'muted') {
    // Light backgrounds (0.9+) become dark (0.15-0.30)
    newL = Math.max(0.12, Math.min(0.35, 1 - l));
  }
  // Foreground/text tokens: invert to light
  else if (tokenName.includes('Foreground') || tokenName === 'foreground') {
    // Dark text becomes light text
    newL = Math.max(0.85, Math.min(0.98, 1 - l));
  }
  // Border/input tokens: make them visible on dark backgrounds
  else if (tokenName === 'border' || tokenName === 'input') {
    newL = Math.max(0.30, Math.min(0.45, 1 - l));
  }
  // Accent colors (primary, secondary, accent, ring): boost lightness slightly for dark mode
  else if (tokenName === 'primary' || tokenName === 'secondary' || tokenName === 'accent' || tokenName === 'ring') {
    // Increase lightness slightly and boost saturation for vibrancy on dark
    newL = Math.min(0.85, l + 0.1);
    newC = Math.min(0.35, c * 1.1); // Slight saturation boost
  }
  // Destructive: keep visible but adjust for dark
  else if (tokenName === 'destructive') {
    newL = Math.min(0.75, l + 0.12);
    newC = Math.min(0.35, c * 1.05);
  }
  // Default: simple inversion
  else {
    newL = 1 - l;
  }

  return `oklch(${newL.toFixed(3)} ${newC.toFixed(3)} ${h.toFixed(3)})`;
}

export function ColorsTab() {
  const { colors, darkMode, setColor } = useDesignManagerContext();
  const [cvdMode, setCvdMode] = useState(null);
  const currentColors = darkMode ? colors.dark : colors.light;
  const backgroundColor = currentColors.background;

  /**
   * Generate all dark mode colors from current light mode colors
   */
  const handleGenerateDarkMode = () => {
    const lightColors = colors.light;

    // Generate dark mode version of each light color
    Object.entries(lightColors).forEach(([token, color]) => {
      const darkColor = generateDarkModeColor(color, token);
      setColor(token, darkColor, 'dark');
    });
  };

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
          onClick={handleGenerateDarkMode}
        >
          <Wand2 size={14} />
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
