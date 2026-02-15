/**
 * Export Tab
 *
 * Multi-format theme export and import with preset management.
 */

import { useState, useRef } from 'react';
import { Copy, Download, Upload, Check, AlertCircle, Bot } from 'lucide-react';
import { useDesignManager } from '../hooks/useDesignManager';
import { BUILT_IN_PRESETS } from '../lib/presets';

const EXPORT_FORMATS = [
  { id: 'css', name: 'CSS', extension: '.css' },
  { id: 'json', name: 'JSON', extension: '.json' },
  { id: 'tailwind', name: 'Tailwind', extension: '.js' },
  { id: 'tokens', name: 'Design Tokens', extension: '.tokens.json' },
  { id: 'rules', name: 'AI Rules', extension: '.md', icon: Bot },
];

const AI_RULES_FORMATS = [
  { id: 'markdown', name: 'Markdown', description: 'For Claude/ChatGPT chat' },
  { id: 'cursor', name: 'Cursor Rules', description: '.mdc format for .cursor/rules/' },
  { id: 'claude', name: 'Claude Instructions', description: 'XML-structured format' },
];

const AI_RULES_SCOPES = [
  { id: 'full', name: 'Full System', description: 'Colors, typography, spacing, patterns' },
  { id: 'colors', name: 'Colors Only', description: 'Color tokens and accessibility' },
  { id: 'typography', name: 'Typography Only', description: 'Fonts, sizes, line heights' },
];

export function ExportTab() {
  const { theme, exportTheme, applyPreset, importTheme } = useDesignManager();
  const [activeFormat, setActiveFormat] = useState('css');
  const [copied, setCopied] = useState(false);
  const [importError, setImportError] = useState(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // AI Rules sub-options
  const [rulesFormat, setRulesFormat] = useState('markdown');
  const [rulesScope, setRulesScope] = useState('full');

  // Build export options for rules format
  const exportOptions = activeFormat === 'rules'
    ? { format: rulesFormat, scope: rulesScope }
    : {};

  const exportedCode = exportTheme(activeFormat, exportOptions);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy:', e);
    }
  };

  const handleDownload = () => {
    const format = EXPORT_FORMATS.find((f) => f.id === activeFormat);
    const blob = new Blob([exportedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    // Handle AI Rules file extensions based on sub-format
    let extension = format.extension;
    let filename = 'theme';
    if (activeFormat === 'rules') {
      if (rulesFormat === 'cursor') {
        extension = '.mdc';
        filename = 'design-system';
      } else if (rulesFormat === 'claude') {
        extension = '.md';
        filename = 'claude-instructions';
      } else {
        extension = '.md';
        filename = 'design-system-rules';
      }
    }

    a.download = `${filename}${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (file) => {
    setImportError(null);
    setImportSuccess(false);

    if (!file) return;

    try {
      const text = await file.text();

      // Validate JSON syntax
      const parsed = JSON.parse(text);
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Invalid theme format');
      }

      // Import the theme (pass raw string, json-exporter parses it)
      importTheme(text, 'json');
      setImportSuccess(true);
      setTimeout(() => setImportSuccess(false), 3000);
    } catch (e) {
      setImportError(e.message || 'Failed to import theme');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImport(file);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      handleImport(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="dm-tab-content dm-export-tab">
      <div className="dm-tab-header">
        <h3 className="dm-tab-title">Export & Presets</h3>
        <p className="dm-tab-description">
          Export your theme or apply presets.
        </p>
      </div>

      {/* Presets Section */}
      <div className="dm-export-section">
        <h4 className="dm-section-title">Built-in Presets</h4>
        <div className="dm-presets-grid">
          {BUILT_IN_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={`dm-preset-card ${theme.activePresetId === preset.id ? 'dm-active' : ''}`}
              onClick={() => applyPreset(preset.id)}
            >
              <div className="dm-preset-colors">
                <div
                  className="dm-preset-swatch"
                  style={{ backgroundColor: preset.colors.primary }}
                />
                <div
                  className="dm-preset-swatch"
                  style={{ backgroundColor: preset.colors.accent }}
                />
                <div
                  className="dm-preset-swatch"
                  style={{ backgroundColor: preset.colors.background }}
                />
              </div>
              <span className="dm-preset-name">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Export Section */}
      <div className="dm-export-section">
        <h4 className="dm-section-title">Export Theme</h4>

        <div className="dm-format-tabs">
          {EXPORT_FORMATS.map((format) => (
            <button
              key={format.id}
              type="button"
              className={`dm-format-tab ${activeFormat === format.id ? 'dm-active' : ''}`}
              onClick={() => setActiveFormat(format.id)}
            >
              {format.icon && <format.icon size={14} />}
              {format.name}
            </button>
          ))}
        </div>

        {/* AI Rules Sub-options */}
        {activeFormat === 'rules' && (
          <div className="dm-rules-options">
            <div className="dm-rules-option-group">
              <label className="dm-rules-label">Format</label>
              <div className="dm-rules-select-group">
                {AI_RULES_FORMATS.map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    className={`dm-rules-option ${rulesFormat === fmt.id ? 'dm-active' : ''}`}
                    onClick={() => setRulesFormat(fmt.id)}
                    title={fmt.description}
                  >
                    {fmt.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="dm-rules-option-group">
              <label className="dm-rules-label">Scope</label>
              <div className="dm-rules-select-group">
                {AI_RULES_SCOPES.map((scope) => (
                  <button
                    key={scope.id}
                    type="button"
                    className={`dm-rules-option ${rulesScope === scope.id ? 'dm-active' : ''}`}
                    onClick={() => setRulesScope(scope.id)}
                    title={scope.description}
                  >
                    {scope.name}
                  </button>
                ))}
              </div>
            </div>
            <p className="dm-rules-hint">
              {rulesFormat === 'cursor' && 'Place in .cursor/rules/ for automatic context'}
              {rulesFormat === 'claude' && 'Add to Claude project instructions'}
              {rulesFormat === 'markdown' && 'Paste into any AI chat for design context'}
            </p>
          </div>
        )}

        <div className="dm-code-preview">
          <pre className="dm-code-block">
            <code>{exportedCode.slice(0, 500)}...</code>
          </pre>
        </div>

        <div className="dm-export-actions">
          <button
            type="button"
            className="dm-button dm-button-secondary"
            onClick={handleCopy}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>

          <button
            type="button"
            className="dm-button dm-button-primary"
            onClick={handleDownload}
          >
            <Download size={14} />
            Download
          </button>
        </div>
      </div>

      {/* Import Section */}
      <div className="dm-export-section">
        <h4 className="dm-section-title">Import Theme</h4>

        {importError && (
          <div className="dm-import-error">
            <AlertCircle size={14} />
            <span>{importError}</span>
          </div>
        )}

        {importSuccess && (
          <div className="dm-import-success">
            <Check size={14} />
            <span>Theme imported successfully!</span>
          </div>
        )}

        <div
          className="dm-import-zone"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <Upload size={24} />
          <p>Drop a JSON file or click to upload</p>
          <span className="dm-import-hint">Supports Design Manager JSON exports</span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.tokens.json"
            className="dm-file-input"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
}

export default ExportTab;
