/**
 * ColorBlindnessSimulator Component
 *
 * Simulates different types of color vision deficiency to test theme accessibility.
 * Applies a CSS filter overlay to the entire page.
 */

import { useState, useEffect, useCallback } from 'react';
import { Eye, EyeOff, AlertTriangle, Check } from 'lucide-react';
import { simulateColorBlindness, analyzePalette, CVD_TYPES } from '../../lib/color-blindness';
import { useDesignManagerContext } from '../../context/DesignManagerContext';

/**
 * Simulation type descriptions
 */
const SIMULATION_INFO = {
  none: {
    name: 'Normal Vision',
    description: 'No simulation applied',
    prevalence: null,
  },
  protanopia: {
    name: 'Protanopia',
    description: 'Red-blind (missing L-cones)',
    prevalence: '~1% of males',
  },
  deuteranopia: {
    name: 'Deuteranopia',
    description: 'Green-blind (missing M-cones)',
    prevalence: '~1% of males',
  },
  tritanopia: {
    name: 'Tritanopia',
    description: 'Blue-blind (missing S-cones)',
    prevalence: '~0.003% of population',
  },
  achromatopsia: {
    name: 'Achromatopsia',
    description: 'Complete color blindness',
    prevalence: '~0.003% of population',
  },
};

/**
 * CSS filter matrices for CVD simulation
 * These are applied as SVG filters to the document
 */
const CVD_FILTERS = {
  protanopia: `
    <filter id="dm-cvd-filter">
      <feColorMatrix type="matrix" values="
        0.567, 0.433, 0,     0, 0
        0.558, 0.442, 0,     0, 0
        0,     0.242, 0.758, 0, 0
        0,     0,     0,     1, 0
      "/>
    </filter>
  `,
  deuteranopia: `
    <filter id="dm-cvd-filter">
      <feColorMatrix type="matrix" values="
        0.625, 0.375, 0,   0, 0
        0.7,   0.3,   0,   0, 0
        0,     0.3,   0.7, 0, 0
        0,     0,     0,   1, 0
      "/>
    </filter>
  `,
  tritanopia: `
    <filter id="dm-cvd-filter">
      <feColorMatrix type="matrix" values="
        0.95, 0.05,  0,     0, 0
        0,    0.433, 0.567, 0, 0
        0,    0.475, 0.525, 0, 0
        0,    0,     0,     1, 0
      "/>
    </filter>
  `,
  achromatopsia: `
    <filter id="dm-cvd-filter">
      <feColorMatrix type="matrix" values="
        0.299, 0.587, 0.114, 0, 0
        0.299, 0.587, 0.114, 0, 0
        0.299, 0.587, 0.114, 0, 0
        0,     0,     0,     1, 0
      "/>
    </filter>
  `,
};

/**
 * Color blindness simulator
 *
 * @param {Object} props
 * @param {boolean} props.compact - Use compact display mode
 * @param {Function} props.onChange - Called when simulation changes
 */
export function ColorBlindnessSimulator({ compact = false, onChange }) {
  const [activeSimulation, setActiveSimulation] = useState('none');
  const [analysis, setAnalysis] = useState(null);
  const { theme } = useDesignManagerContext();

  /**
   * Apply CVD filter to document
   */
  const applyFilter = useCallback((type) => {
    // Remove existing filter
    const existingSvg = document.getElementById('dm-cvd-svg');
    if (existingSvg) {
      existingSvg.remove();
    }
    document.documentElement.style.removeProperty('filter');

    if (type === 'none' || !CVD_FILTERS[type]) {
      return;
    }

    // Create SVG filter element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.id = 'dm-cvd-svg';
    svg.setAttribute('style', 'position: absolute; width: 0; height: 0;');
    svg.innerHTML = CVD_FILTERS[type];
    document.body.appendChild(svg);

    // Apply filter to document
    document.documentElement.style.filter = 'url(#dm-cvd-filter)';
  }, []);

  /**
   * Handle simulation change
   */
  const handleChange = (type) => {
    setActiveSimulation(type);
    applyFilter(type);
    onChange?.(type);
  };

  /**
   * Analyze theme colors for CVD issues
   */
  useEffect(() => {
    if (!theme) return;

    // Extract key colors from theme
    const colors = [
      theme.primary,
      theme.accent,
      theme.background,
      theme.foreground,
      theme.muted,
      theme.destructive,
    ].filter(Boolean);

    if (colors.length < 2) return;

    // Analyze for each CVD type
    const results = {};
    Object.keys(CVD_TYPES).forEach((type) => {
      results[type] = analyzePalette(colors, type);
    });

    setAnalysis(results);
  }, [theme]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      const existingSvg = document.getElementById('dm-cvd-svg');
      if (existingSvg) {
        existingSvg.remove();
      }
      document.documentElement.style.removeProperty('filter');
    };
  }, []);

  /**
   * Get overall accessibility score
   */
  const getOverallScore = () => {
    if (!analysis) return null;

    const scores = Object.values(analysis).map((a) => a.distinguishablePercentage);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

    if (avg >= 90) return { level: 'excellent', label: 'Excellent' };
    if (avg >= 70) return { level: 'good', label: 'Good' };
    if (avg >= 50) return { level: 'fair', label: 'Fair' };
    return { level: 'poor', label: 'Needs Work' };
  };

  const overallScore = getOverallScore();

  // Compact mode (dropdown only)
  if (compact) {
    return (
      <div className="dm-cvd-compact">
        <Eye size={14} className={activeSimulation !== 'none' ? 'dm-active' : ''} />
        <select
          className="dm-select dm-select-small"
          value={activeSimulation}
          onChange={(e) => handleChange(e.target.value)}
        >
          {Object.entries(SIMULATION_INFO).map(([type, info]) => (
            <option key={type} value={type}>
              {info.name}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // Full mode
  return (
    <div className="dm-cvd-simulator">
      <div className="dm-cvd-header">
        <h4 className="dm-section-title">Color Vision Simulation</h4>
        {overallScore && (
          <span className={`dm-cvd-score dm-score-${overallScore.level}`}>
            {overallScore.label}
          </span>
        )}
      </div>

      <p className="dm-cvd-description">
        Test how your theme appears to people with color vision deficiency.
      </p>

      {/* Simulation Buttons */}
      <div className="dm-cvd-options">
        {Object.entries(SIMULATION_INFO).map(([type, info]) => {
          const typeAnalysis = analysis?.[type];
          const isActive = activeSimulation === type;

          return (
            <button
              key={type}
              type="button"
              className={`dm-cvd-option ${isActive ? 'dm-active' : ''}`}
              onClick={() => handleChange(type)}
            >
              <div className="dm-cvd-option-header">
                {isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                <span className="dm-cvd-option-name">{info.name}</span>
              </div>

              {type !== 'none' && (
                <>
                  <span className="dm-cvd-option-desc">{info.description}</span>
                  {info.prevalence && (
                    <span className="dm-cvd-prevalence">{info.prevalence}</span>
                  )}
                  {typeAnalysis && (
                    <div className="dm-cvd-analysis">
                      {typeAnalysis.problematicPairs > 0 ? (
                        <span className="dm-cvd-warning">
                          <AlertTriangle size={10} />
                          {typeAnalysis.problematicPairs} issue{typeAnalysis.problematicPairs !== 1 ? 's' : ''}
                        </span>
                      ) : (
                        <span className="dm-cvd-ok">
                          <Check size={10} />
                          No issues
                        </span>
                      )}
                    </div>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Simulation Indicator */}
      {activeSimulation !== 'none' && (
        <div className="dm-cvd-active-notice">
          <AlertTriangle size={14} />
          <span>
            Viewing as: <strong>{SIMULATION_INFO[activeSimulation].name}</strong>
          </span>
          <button
            type="button"
            className="dm-button dm-button-small"
            onClick={() => handleChange('none')}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}

export default ColorBlindnessSimulator;
