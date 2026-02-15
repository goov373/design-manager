/**
 * Tools Tab
 *
 * AI-powered design utilities and mini tools.
 * Photo color extraction, and more tools to come.
 */

import { useState } from 'react';
import { Hammer, Sparkles } from 'lucide-react';
import { PhotoExtractor } from '../components/features/PhotoExtractor';

export function ToolsTab() {
  const [activeExtractor, setActiveExtractor] = useState(null);

  return (
    <div className="dm-tab-content dm-tools-tab">
      <div className="dm-tab-header">
        <h3 className="dm-tab-title">
          <Hammer size={18} />
          Design Tools
        </h3>
        <p className="dm-tab-description">
          AI-powered utilities to speed up your design workflow.
        </p>
      </div>

      <div className="dm-tools-grid">
        {/* Photo Color Extractor */}
        <div className="dm-tool-card">
          <div className="dm-tool-header">
            <div className="dm-tool-icon dm-tool-icon-photo">
              <Sparkles size={20} />
            </div>
            <div className="dm-tool-info">
              <h4 className="dm-tool-title">Extract Colors from Photo</h4>
              <p className="dm-tool-description">
                Upload an image and automatically extract a harmonious color palette to apply to your theme.
              </p>
            </div>
          </div>

          {activeExtractor === 'photo' ? (
            <div className="dm-tool-content">
              <PhotoExtractor onClose={() => setActiveExtractor(null)} />
            </div>
          ) : (
            <button
              type="button"
              className="dm-button dm-button-primary dm-tool-launch"
              onClick={() => setActiveExtractor('photo')}
            >
              Launch Tool
            </button>
          )}
        </div>

        {/* Placeholder for future tools */}
        <div className="dm-tool-card dm-tool-coming-soon">
          <div className="dm-tool-header">
            <div className="dm-tool-icon dm-tool-icon-muted">
              <Sparkles size={20} />
            </div>
            <div className="dm-tool-info">
              <h4 className="dm-tool-title">More Tools Coming Soon</h4>
              <p className="dm-tool-description">
                Palette generators, contrast fixers, and more AI-powered design utilities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ToolsTab;
