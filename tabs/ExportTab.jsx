/**
 * Export Tab
 *
 * Multi-format theme export and import with preset management.
 */

import { useState, useRef } from 'react';
import { Copy, Download, Upload, Check, AlertCircle } from 'lucide-react';
import { useDesignManager } from '../hooks/useDesignManager';
import { BUILT_IN_PRESETS } from '../lib/presets';

const EXPORT_FORMATS = [
  { id: 'css', name: 'CSS', extension: '.css' },
  { id: 'json', name: 'JSON', extension: '.json' },
  { id: 'tailwind', name: 'Tailwind', extension: '.js' },
  { id: 'tokens', name: 'Design Tokens', extension: '.tokens.json' },
];

export function ExportTab() {
  const { theme, exportTheme, applyPreset, importTheme } = useDesignManager();
  const [activeFormat, setActiveFormat] = useState('css');
  const [copied, setCopied] = useState(false);
  const [importError, setImportError] = useState(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const exportedCode = exportTheme(activeFormat);

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
    a.download = `theme${format.extension}`;
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
              {format.name}
            </button>
          ))}
        </div>

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
