/**
 * Typography Tab
 *
 * Full typography controls with font selection, weights, scale, and preview.
 */

import { useDesignManagerContext } from '../context/DesignManagerContext';
import { SimpleFontSelector } from '../components/controls/FontSelector';
import { FontWeightSelector } from '../components/controls/FontWeightSelector';
import { TYPE_SCALES, LINE_HEIGHTS, FONT_CATALOG } from '../lib/typography-config';
import { getFontFamily } from '../lib/theme-utils';

export function TypographyTab() {
  const { theme, setToken } = useDesignManagerContext();

  const {
    fontHeading = 'system-ui',
    fontBody = 'system-ui',
    fontWeightHeading = 600,
    fontWeightBody = 400,
    typeScale = 'default',
    lineHeightPreset = 'normal',
  } = theme;

  const headingFont = FONT_CATALOG[fontHeading] || FONT_CATALOG['system-ui'];
  const bodyFont = FONT_CATALOG[fontBody] || FONT_CATALOG['system-ui'];
  const scale = TYPE_SCALES[typeScale] || TYPE_SCALES.default;
  const lineHeight = LINE_HEIGHTS[lineHeightPreset] || LINE_HEIGHTS.normal;

  return (
    <div className="dm-tab-content dm-typography-tab">
      <div className="dm-tab-header">
        <h3 className="dm-tab-title">Typography</h3>
        <p className="dm-tab-description">
          Configure fonts, weights, and spacing.
        </p>
      </div>

      {/* Font Selection */}
      <div className="dm-typography-section">
        <h4 className="dm-section-title">Fonts</h4>

        <SimpleFontSelector
          value={fontHeading}
          onChange={(id) => setToken('fontHeading', id)}
          label="Heading Font"
          filter="headings"
        />

        <FontWeightSelector
          value={fontWeightHeading}
          onChange={(weight) => setToken('fontWeightHeading', weight)}
          fontId={fontHeading}
          label="Heading Weight"
        />

        <div className="dm-spacer" />

        <SimpleFontSelector
          value={fontBody}
          onChange={(id) => setToken('fontBody', id)}
          label="Body Font"
          filter="body"
        />

        <FontWeightSelector
          value={fontWeightBody}
          onChange={(weight) => setToken('fontWeightBody', weight)}
          fontId={fontBody}
          label="Body Weight"
        />
      </div>

      {/* Scale & Rhythm */}
      <div className="dm-typography-section">
        <h4 className="dm-section-title">Scale & Rhythm</h4>

        <div className="dm-scale-options">
          {Object.entries(TYPE_SCALES).map(([id, scaleOption]) => (
            <button
              key={id}
              type="button"
              className={`dm-scale-option ${typeScale === id ? 'dm-selected' : ''}`}
              onClick={() => setToken('typeScale', id)}
            >
              <span className="dm-scale-name">{scaleOption.name}</span>
              <span className="dm-scale-ratio">{scaleOption.ratio}</span>
              <span className="dm-scale-desc">{scaleOption.description}</span>
            </button>
          ))}
        </div>

        <div className="dm-spacer" />

        <div className="dm-line-height-options">
          <label className="dm-label">Line Height</label>
          <div className="dm-lh-buttons">
            {Object.entries(LINE_HEIGHTS).map(([id, lh]) => (
              <button
                key={id}
                type="button"
                className={`dm-lh-option ${lineHeightPreset === id ? 'dm-selected' : ''}`}
                onClick={() => setToken('lineHeightPreset', id)}
                title={lh.description}
              >
                {lh.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="dm-typography-section">
        <h4 className="dm-section-title">Preview</h4>

        <div className="dm-typography-preview-card">
          <h1
            className="dm-preview-h1"
            style={{
              fontFamily: getFontFamily(fontHeading),
              fontWeight: fontWeightHeading,
              lineHeight: lineHeight.heading,
              fontSize: `${scale.baseFontSize * Math.pow(scale.ratio, 4)}px`,
            }}
          >
            The Quick Brown Fox
          </h1>

          <h2
            className="dm-preview-h2"
            style={{
              fontFamily: getFontFamily(fontHeading),
              fontWeight: fontWeightHeading,
              lineHeight: lineHeight.heading,
              fontSize: `${scale.baseFontSize * Math.pow(scale.ratio, 2)}px`,
            }}
          >
            Jumps Over the Lazy Dog
          </h2>

          <p
            className="dm-preview-body"
            style={{
              fontFamily: getFontFamily(fontBody),
              fontWeight: fontWeightBody,
              lineHeight: lineHeight.body,
              fontSize: `${scale.baseFontSize}px`,
            }}
          >
            Typography is the art and technique of arranging type to make written
            language legible, readable, and appealing when displayed. Good typography
            enhances the reading experience and conveys the tone of content.
          </p>

          <p
            className="dm-preview-small"
            style={{
              fontFamily: getFontFamily(fontBody),
              fontWeight: fontWeightBody,
              lineHeight: lineHeight.body,
              fontSize: `${scale.baseFontSize / scale.ratio}px`,
            }}
          >
            Small text for captions and secondary content.
          </p>
        </div>

        {/* Font size scale display */}
        <div className="dm-size-scale">
          <div className="dm-scale-label">Size Scale ({scale.ratio})</div>
          <div className="dm-scale-sizes">
            {['4xl', '3xl', '2xl', 'xl', 'lg', 'base', 'sm', 'xs'].map((size, i) => {
              const power = 4 - i;
              const px = scale.baseFontSize * Math.pow(scale.ratio, power);
              return (
                <div key={size} className="dm-scale-size">
                  <span className="dm-size-name">{size}</span>
                  <span className="dm-size-value">{px.toFixed(1)}px</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TypographyTab;
