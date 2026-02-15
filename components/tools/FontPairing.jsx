/**
 * Font Pairing Tool
 *
 * AI-recommended body fonts for your heading choice.
 * Shows live preview with real sentences, not abstract samples.
 */

import { useState, useEffect } from 'react';
import { Check, Type } from 'lucide-react';
import { useDesignManagerContext } from '../../context/DesignManagerContext';
import {
  FONT_CATALOG,
  FONT_CATEGORIES,
  getFontsByCategory,
  getBodyPairings,
} from '../../lib/typography-config';

// Google Fonts loader
function loadGoogleFont(fontId) {
  const font = FONT_CATALOG[fontId];
  if (!font || !font.googleFont) return;

  const linkId = `google-font-${fontId}`;
  if (document.getElementById(linkId)) return;

  const link = document.createElement('link');
  link.id = linkId;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${font.googleFont}&display=swap`;
  document.head.appendChild(link);
}

// Get font-family CSS value
function getFontFamily(fontId) {
  const font = FONT_CATALOG[fontId];
  if (!font) return 'system-ui, sans-serif';
  const name = font.name.includes(' ') ? `"${font.name}"` : font.name;
  return `${name}, ${font.fallback}`;
}

export function FontPairing({ onClose }) {
  const { setToken, theme } = useDesignManagerContext();
  const [selectedHeading, setSelectedHeading] = useState(theme?.fontHeading || 'playfair-display');
  const [selectedBody, setSelectedBody] = useState(null);
  const [appliedPairing, setAppliedPairing] = useState(null);

  const fontsByCategory = getFontsByCategory();
  const bodyPairings = getBodyPairings(selectedHeading);

  // Load fonts when selected
  useEffect(() => {
    loadGoogleFont(selectedHeading);
    bodyPairings.forEach((font) => loadGoogleFont(font.id));
  }, [selectedHeading, bodyPairings]);

  useEffect(() => {
    if (selectedBody) {
      loadGoogleFont(selectedBody);
    }
  }, [selectedBody]);

  const handleApply = () => {
    if (selectedBody) {
      setToken('fontHeading', selectedHeading);
      setToken('fontBody', selectedBody);
      setAppliedPairing({ heading: selectedHeading, body: selectedBody });
    }
  };

  const headingFont = FONT_CATALOG[selectedHeading];
  const currentBodyFont = selectedBody ? FONT_CATALOG[selectedBody] : null;

  return (
    <div className="dm-font-pairing">
      {/* Heading Font Selection */}
      <div className="dm-pairing-section">
        <label className="dm-pairing-label">Select Heading Font</label>
        <select
          className="dm-select"
          value={selectedHeading}
          onChange={(e) => {
            setSelectedHeading(e.target.value);
            setSelectedBody(null);
          }}
        >
          {Object.entries(FONT_CATEGORIES).map(([catId, category]) => (
            <optgroup key={catId} label={category.label}>
              {(fontsByCategory[catId] || []).map((font) => (
                <option key={font.id} value={font.id}>
                  {font.name} — {font.preview}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Recommended Pairings */}
      <div className="dm-pairing-section">
        <label className="dm-pairing-label">
          Recommended Body Fonts
          <span className="dm-pairing-hint">{bodyPairings.length} options</span>
        </label>

        {bodyPairings.length > 0 && (
          <p className="dm-pairing-reasoning">{bodyPairings[0].reasoning}</p>
        )}

        <div className="dm-pairing-options">
          {bodyPairings.map((font) => (
            <button
              key={font.id}
              type="button"
              className={`dm-pairing-option ${selectedBody === font.id ? 'dm-selected' : ''}`}
              onClick={() => setSelectedBody(font.id)}
            >
              <span
                className="dm-pairing-option-name"
                style={{ fontFamily: getFontFamily(font.id) }}
              >
                {font.name}
              </span>
              <span className="dm-pairing-option-category">
                {FONT_CATEGORIES[font.category]?.label}
              </span>
              {selectedBody === font.id && (
                <Check size={14} className="dm-pairing-check" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Live Preview */}
      <div className="dm-pairing-section">
        <label className="dm-pairing-label">Live Preview</label>
        <div className="dm-pairing-preview">
          <h2
            className="dm-preview-heading"
            style={{ fontFamily: getFontFamily(selectedHeading) }}
          >
            The quick brown fox jumps over the lazy dog
          </h2>
          <p
            className="dm-preview-body"
            style={{
              fontFamily: selectedBody
                ? getFontFamily(selectedBody)
                : 'var(--font-family-body, system-ui)',
            }}
          >
            Typography is the art and technique of arranging type to make written
            language legible, readable and appealing when displayed. Good typography
            enhances the user experience and helps communicate your message effectively.
          </p>
          <p
            className="dm-preview-small"
            style={{
              fontFamily: selectedBody
                ? getFontFamily(selectedBody)
                : 'var(--font-family-body, system-ui)',
            }}
          >
            Caption text: {headingFont?.name} + {currentBodyFont?.name || 'Select a body font'}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="dm-pairing-actions">
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
          disabled={!selectedBody}
        >
          <Type size={14} />
          Apply Pairing
        </button>
      </div>

      {/* Success Message */}
      {appliedPairing && (
        <div className="dm-pairing-success">
          Applied: {FONT_CATALOG[appliedPairing.heading]?.name} +{' '}
          {FONT_CATALOG[appliedPairing.body]?.name}
        </div>
      )}
    </div>
  );
}

export default FontPairing;
