/**
 * ExpandableSection Component
 *
 * Collapsible section with animation.
 */

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

/**
 * Expandable/collapsible section
 *
 * @param {Object} props
 * @param {string} props.title - Section title
 * @param {boolean} props.defaultExpanded - Initial expanded state
 * @param {React.ReactNode} props.children - Section content
 * @param {string} props.badge - Optional badge text
 */
export function ExpandableSection({
  title,
  defaultExpanded = false,
  children,
  badge,
  className = '',
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`dm-expandable-section ${isExpanded ? 'dm-expanded' : ''} ${className}`}>
      <button
        type="button"
        className="dm-section-header"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <span className="dm-section-icon">
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </span>
        <span className="dm-section-title">{title}</span>
        {badge && <span className="dm-section-badge">{badge}</span>}
      </button>

      <div
        className="dm-section-content"
        style={{
          maxHeight: isExpanded ? '2000px' : '0',
          opacity: isExpanded ? 1 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.3s ease, opacity 0.2s ease',
        }}
      >
        <div className="dm-section-inner">{children}</div>
      </div>
    </div>
  );
}

export default ExpandableSection;
