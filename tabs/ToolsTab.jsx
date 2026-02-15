/**
 * Tools Tab
 *
 * AI-powered design utilities and mini tools.
 * Photo color extraction, font pairing, and more.
 */

import { useState } from 'react';
import { Hammer, Sparkles, Type, ImageIcon, Contrast } from 'lucide-react';
import { PhotoExtractor } from '../components/features/PhotoExtractor';
import { FontPairing } from '../components/tools/FontPairing';
import { ContrastFixer } from '../components/tools/ContrastFixer';

export function ToolsTab() {
  const [activeTool, setActiveTool] = useState(null);

  const closeTool = () => setActiveTool(null);

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
        {/* Smart Font Pairing */}
        <div className="dm-tool-card">
          <div className="dm-tool-header">
            <div className="dm-tool-icon dm-tool-icon-typography">
              <Type size={20} />
            </div>
            <div className="dm-tool-info">
              <h4 className="dm-tool-title">Smart Font Pairing</h4>
              <p className="dm-tool-description">
                Select your heading font and get AI-recommended body font pairings with live preview.
              </p>
            </div>
          </div>

          {activeTool === 'fontPairing' ? (
            <div className="dm-tool-content">
              <FontPairing onClose={closeTool} />
            </div>
          ) : (
            <button
              type="button"
              className="dm-button dm-button-primary dm-tool-launch"
              onClick={() => setActiveTool('fontPairing')}
            >
              Launch Tool
            </button>
          )}
        </div>

        {/* Contrast Fixer */}
        <div className="dm-tool-card">
          <div className="dm-tool-header">
            <div className="dm-tool-icon dm-tool-icon-contrast">
              <Contrast size={20} />
            </div>
            <div className="dm-tool-info">
              <h4 className="dm-tool-title">Contrast Fixer</h4>
              <p className="dm-tool-description">
                Fix failing color pairs with minimal adjustment. Preserves your brand colors while meeting WCAG requirements.
              </p>
            </div>
          </div>

          {activeTool === 'contrast' ? (
            <div className="dm-tool-content">
              <ContrastFixer onClose={closeTool} />
            </div>
          ) : (
            <button
              type="button"
              className="dm-button dm-button-primary dm-tool-launch"
              onClick={() => setActiveTool('contrast')}
            >
              Launch Tool
            </button>
          )}
        </div>

        {/* Photo Color Extractor */}
        <div className="dm-tool-card">
          <div className="dm-tool-header">
            <div className="dm-tool-icon dm-tool-icon-photo">
              <ImageIcon size={20} />
            </div>
            <div className="dm-tool-info">
              <h4 className="dm-tool-title">Extract Colors from Photo</h4>
              <p className="dm-tool-description">
                Upload an image and automatically extract a harmonious color palette to apply to your theme.
              </p>
            </div>
          </div>

          {activeTool === 'photo' ? (
            <div className="dm-tool-content">
              <PhotoExtractor onClose={closeTool} />
            </div>
          ) : (
            <button
              type="button"
              className="dm-button dm-button-primary dm-tool-launch"
              onClick={() => setActiveTool('photo')}
            >
              Launch Tool
            </button>
          )}
        </div>

        {/* Coming Soon Placeholder */}
        <div className="dm-tool-card dm-tool-coming-soon">
          <div className="dm-tool-header">
            <div className="dm-tool-icon dm-tool-icon-muted">
              <Sparkles size={20} />
            </div>
            <div className="dm-tool-info">
              <h4 className="dm-tool-title">More Tools Coming Soon</h4>
              <p className="dm-tool-description">
                Contrast fixer, accessible palette generator, design token scales, and more.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ToolsTab;
