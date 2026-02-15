/**
 * Tools Tab
 *
 * AI-powered design utilities and mini tools.
 * Photo color extraction, font pairing, and more.
 */

import { useState } from 'react';
import { Hammer, Sparkles, Type, ImageIcon, Contrast, Ruler, Eye, Palette, Moon } from 'lucide-react';
import { PhotoExtractor } from '../components/features/PhotoExtractor';
import { FontPairing } from '../components/tools/FontPairing';
import { ContrastFixer } from '../components/tools/ContrastFixer';
import { TokenScaleGenerator } from '../components/tools/TokenScaleGenerator';
import { LivePreview } from '../components/tools/LivePreview';
import { AccessiblePaletteGenerator } from '../components/tools/AccessiblePaletteGenerator';
import { DarkModeGenerator } from '../components/tools/DarkModeGenerator';
import { AIThemeGenerator } from '../components/tools/AIThemeGenerator';

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
        {/* AI Theme Generator - Featured */}
        <div className="dm-tool-card dm-tool-featured">
          <div className="dm-tool-header">
            <div className="dm-tool-icon dm-tool-icon-ai">
              <Sparkles size={20} />
            </div>
            <div className="dm-tool-info">
              <h4 className="dm-tool-title">AI Theme Generator</h4>
              <p className="dm-tool-description">
                Describe your ideal theme in plain language and AI will generate a complete color palette for light and dark modes.
              </p>
            </div>
          </div>

          {activeTool === 'ai' ? (
            <div className="dm-tool-content">
              <AIThemeGenerator onClose={closeTool} />
            </div>
          ) : (
            <button
              type="button"
              className="dm-button dm-button-primary dm-tool-launch"
              onClick={() => setActiveTool('ai')}
            >
              Launch Tool
            </button>
          )}
        </div>

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

        {/* Accessible Palette Generator */}
        <div className="dm-tool-card">
          <div className="dm-tool-header">
            <div className="dm-tool-icon dm-tool-icon-accessible">
              <Palette size={20} />
            </div>
            <div className="dm-tool-info">
              <h4 className="dm-tool-title">Accessible Palette</h4>
              <p className="dm-tool-description">
                Generate complete palettes that meet WCAG requirements from the start. Accessibility-first design.
              </p>
            </div>
          </div>

          {activeTool === 'accessible' ? (
            <div className="dm-tool-content">
              <AccessiblePaletteGenerator onClose={closeTool} />
            </div>
          ) : (
            <button
              type="button"
              className="dm-button dm-button-primary dm-tool-launch"
              onClick={() => setActiveTool('accessible')}
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

        {/* Live Preview Color Tester */}
        <div className="dm-tool-card">
          <div className="dm-tool-header">
            <div className="dm-tool-icon dm-tool-icon-preview">
              <Eye size={20} />
            </div>
            <div className="dm-tool-info">
              <h4 className="dm-tool-title">Live Preview Tester</h4>
              <p className="dm-tool-description">
                See your colors on a realistic UI mockup. Side-by-side light/dark mode with CVD simulation.
              </p>
            </div>
          </div>

          {activeTool === 'preview' ? (
            <div className="dm-tool-content">
              <LivePreview onClose={closeTool} />
            </div>
          ) : (
            <button
              type="button"
              className="dm-button dm-button-primary dm-tool-launch"
              onClick={() => setActiveTool('preview')}
            >
              Launch Tool
            </button>
          )}
        </div>

        {/* Enhanced Dark Mode Generator */}
        <div className="dm-tool-card">
          <div className="dm-tool-header">
            <div className="dm-tool-icon dm-tool-icon-darkmode">
              <Moon size={20} />
            </div>
            <div className="dm-tool-info">
              <h4 className="dm-tool-title">Dark Mode Generator</h4>
              <p className="dm-tool-description">
                Generate dark mode palettes with live preview and fine-tuning controls. Works both ways—light to dark or dark to light.
              </p>
            </div>
          </div>

          {activeTool === 'darkmode' ? (
            <div className="dm-tool-content">
              <DarkModeGenerator onClose={closeTool} />
            </div>
          ) : (
            <button
              type="button"
              className="dm-button dm-button-primary dm-tool-launch"
              onClick={() => setActiveTool('darkmode')}
            >
              Launch Tool
            </button>
          )}
        </div>

        {/* Design Token Scale Generator */}
        <div className="dm-tool-card">
          <div className="dm-tool-header">
            <div className="dm-tool-icon dm-tool-icon-scale">
              <Ruler size={20} />
            </div>
            <div className="dm-tool-info">
              <h4 className="dm-tool-title">Design Token Scales</h4>
              <p className="dm-tool-description">
                Generate harmonious spacing, border-radius, and shadow scales using mathematical ratios.
              </p>
            </div>
          </div>

          {activeTool === 'scales' ? (
            <div className="dm-tool-content">
              <TokenScaleGenerator onClose={closeTool} />
            </div>
          ) : (
            <button
              type="button"
              className="dm-button dm-button-primary dm-tool-launch"
              onClick={() => setActiveTool('scales')}
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
              <h4 className="dm-tool-title">More Coming Soon</h4>
              <p className="dm-tool-description">
                Color harmony wheel, OKLCH gradient generator, and more design utilities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ToolsTab;
