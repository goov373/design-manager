/**
 * FontSelector Component
 *
 * Font selection dropdown with preview and category grouping.
 */

import { useState, useMemo } from 'react';
import { FONT_CATALOG, FONT_CATEGORIES, getFontsByCategory } from '../../lib/typography-config';
import { loadGoogleFont, getFontFamily } from '../../lib/theme-utils';

/**
 * Font selector with live preview
 *
 * @param {Object} props
 * @param {string} props.value - Current font ID
 * @param {Function} props.onChange - Called with new font ID
 * @param {string} props.label - Label text
 * @param {'headings' | 'body' | 'both'} props.filter - Filter by recommended use
 */
export function FontSelector({
  value,
  onChange,
  label,
  filter,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const fontsByCategory = useMemo(() => getFontsByCategory(), []);

  const currentFont = FONT_CATALOG[value] || FONT_CATALOG['system-ui'];

  // Load font for preview on hover
  const handleFontHover = (fontId) => {
    loadGoogleFont(fontId);
  };

  // Filter fonts if needed
  const shouldShowFont = (font) => {
    if (!filter) return true;
    return font.recommended === filter || font.recommended === 'both';
  };

  return (
    <div className={`dm-font-selector ${className}`}>
      {label && <label className="dm-label">{label}</label>}

      <div className="dm-font-select-wrapper">
        <button
          type="button"
          className="dm-font-select-button"
          onClick={() => setIsOpen(!isOpen)}
          style={{ fontFamily: getFontFamily(value) }}
        >
          <span className="dm-font-name">{currentFont.name}</span>
          <span className="dm-font-preview">{currentFont.preview}</span>
        </button>

        {isOpen && (
          <div className="dm-font-dropdown">
            {Object.entries(FONT_CATEGORIES).map(([categoryId, category]) => {
              const fonts = fontsByCategory[categoryId]?.filter(shouldShowFont) || [];
              if (fonts.length === 0) return null;

              return (
                <div key={categoryId} className="dm-font-category">
                  <div className="dm-category-header">
                    <span className="dm-category-label">{category.label}</span>
                    <span className="dm-category-description">
                      {category.description}
                    </span>
                  </div>

                  <div className="dm-font-options">
                    {fonts.map((font) => (
                      <button
                        key={font.id}
                        type="button"
                        className={`dm-font-option ${value === font.id ? 'dm-selected' : ''}`}
                        onClick={() => {
                          loadGoogleFont(font.id);
                          onChange(font.id);
                          setIsOpen(false);
                        }}
                        onMouseEnter={() => handleFontHover(font.id)}
                        style={{ fontFamily: getFontFamily(font.id) }}
                      >
                        <span className="dm-option-name">{font.name}</span>
                        <span className="dm-option-preview">{font.preview}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Simple font select dropdown (no fancy styling)
 */
export function SimpleFontSelector({ value, onChange, label, filter }) {
  const fontsByCategory = useMemo(() => getFontsByCategory(), []);

  const shouldShowFont = (font) => {
    if (!filter) return true;
    return font.recommended === filter || font.recommended === 'both';
  };

  return (
    <div className="dm-form-field">
      {label && <label className="dm-label">{label}</label>}
      <select
        className="dm-select"
        value={value}
        onChange={(e) => {
          loadGoogleFont(e.target.value);
          onChange(e.target.value);
        }}
      >
        {Object.entries(FONT_CATEGORIES).map(([categoryId, category]) => {
          const fonts = fontsByCategory[categoryId]?.filter(shouldShowFont) || [];
          if (fonts.length === 0) return null;

          return (
            <optgroup key={categoryId} label={category.label}>
              {fonts.map((font) => (
                <option key={font.id} value={font.id}>
                  {font.name}
                </option>
              ))}
            </optgroup>
          );
        })}
      </select>
    </div>
  );
}

export default FontSelector;
