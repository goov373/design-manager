/**
 * ContrastBadge Component
 *
 * Displays WCAG contrast ratio and compliance level.
 */

import { checkContrast, getContrastBadge } from '../../lib/contrast-checker';

/**
 * Contrast badge showing ratio and WCAG level
 *
 * @param {Object} props
 * @param {string} props.foreground - Foreground color
 * @param {string} props.background - Background color
 * @param {boolean} props.compact - Use compact display
 */
export function ContrastBadge({ foreground, background, compact = false }) {
  const badge = getContrastBadge(foreground, background);

  if (compact) {
    return (
      <span
        className={`dm-contrast-badge-compact dm-badge-${badge.score}`}
        title={`${badge.ratio}:1 - ${badge.level}`}
      >
        {badge.level}
      </span>
    );
  }

  return (
    <div className={`dm-contrast-badge dm-badge-${badge.score}`}>
      <span className="dm-badge-ratio">{badge.ratio}:1</span>
      <span className="dm-badge-level">{badge.level}</span>
    </div>
  );
}

/**
 * Full contrast details panel
 */
export function ContrastDetails({ foreground, background }) {
  const result = checkContrast(foreground, background);

  return (
    <div className="dm-contrast-details">
      <div className="dm-contrast-header">
        <span className="dm-contrast-ratio">{result.ratio.toFixed(2)}:1</span>
        <ContrastBadge foreground={foreground} background={background} />
      </div>

      <div className="dm-contrast-checks">
        <ContrastCheck
          label="Normal text (AA)"
          passed={result.passes.aa}
          threshold="4.5:1"
        />
        <ContrastCheck
          label="Large text (AA)"
          passed={result.passes.aaLarge}
          threshold="3:1"
        />
        <ContrastCheck
          label="Normal text (AAA)"
          passed={result.passes.aaa}
          threshold="7:1"
        />
        <ContrastCheck
          label="Large text (AAA)"
          passed={result.passes.aaaLarge}
          threshold="4.5:1"
        />
      </div>

      <div className="dm-contrast-preview">
        <div
          className="dm-preview-sample"
          style={{ backgroundColor: background, color: foreground }}
        >
          <span className="dm-preview-normal">Normal text</span>
          <span className="dm-preview-large">Large text</span>
        </div>
      </div>
    </div>
  );
}

function ContrastCheck({ label, passed, threshold }) {
  return (
    <div className={`dm-contrast-check ${passed ? 'dm-passed' : 'dm-failed'}`}>
      <span className="dm-check-icon">{passed ? '✓' : '✕'}</span>
      <span className="dm-check-label">{label}</span>
      <span className="dm-check-threshold">{threshold}</span>
    </div>
  );
}

export default ContrastBadge;
