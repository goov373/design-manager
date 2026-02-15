/**
 * PhotoExtractor Component
 *
 * Extracts colors from uploaded photos and applies them to the theme.
 */

import { useRef } from 'react';
import { Upload, X, Check, RefreshCw, ImageIcon } from 'lucide-react';
import { useColorExtraction } from '../../hooks/useColorExtraction';
import { useDesignManagerContext } from '../../context/DesignManagerContext';

/**
 * Role to token mapping
 */
const ROLE_TOKEN_MAP = {
  primary: 'primary',
  accent: 'accent',
  background: 'background',
  foreground: 'foreground',
  muted: 'muted',
  secondary: 'secondary',
};

/**
 * Photo color extractor
 *
 * @param {Object} props
 * @param {Function} props.onClose - Called when closing/done
 */
export function PhotoExtractor({ onClose }) {
  const fileInputRef = useRef(null);
  const { setToken } = useDesignManagerContext();

  const {
    state,
    isLoading,
    isSuccess,
    palette,
    error,
    previewUrl,
    extractFromFile,
    clear,
  } = useColorExtraction();

  /**
   * Handle file selection
   */
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      extractFromFile(file);
    }
  };

  /**
   * Handle drag and drop
   */
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer?.files?.[0];
    if (file) {
      extractFromFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  /**
   * Apply extracted color to a theme token
   */
  const applyColor = (color, role) => {
    const token = ROLE_TOKEN_MAP[role] || role;
    setToken(token, color.oklch);
  };

  /**
   * Apply all extracted colors
   */
  const applyAllColors = () => {
    palette.forEach((color) => {
      if (ROLE_TOKEN_MAP[color.role]) {
        applyColor(color, color.role);
      }
    });
  };

  return (
    <div className="dm-photo-extractor">
      {/* Header */}
      <div className="dm-extractor-header">
        <h4 className="dm-extractor-title">Extract Colors from Photo</h4>
        {onClose && (
          <button
            type="button"
            className="dm-header-button"
            onClick={onClose}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Upload Zone */}
      {!isSuccess && (
        <div
          className={`dm-upload-zone ${isLoading ? 'dm-loading' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {isLoading ? (
            <>
              <RefreshCw size={24} className="dm-spin" />
              <p>Extracting colors...</p>
            </>
          ) : (
            <>
              <ImageIcon size={24} />
              <p>Drop an image or click to upload</p>
              <span className="dm-upload-hint">JPG, PNG, WebP supported</span>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="dm-file-input"
            onChange={handleFileSelect}
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="dm-extractor-error">
          <p>{error}</p>
          <button
            type="button"
            className="dm-button dm-button-secondary dm-button-small"
            onClick={clear}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Results */}
      {isSuccess && (
        <div className="dm-extractor-results">
          {/* Image Preview */}
          <div className="dm-image-preview">
            <img src={previewUrl} alt="Uploaded" />
          </div>

          {/* Extracted Palette */}
          <div className="dm-extracted-palette">
            <div className="dm-palette-header">
              <span>Extracted Colors</span>
              <button
                type="button"
                className="dm-button dm-button-secondary dm-button-small"
                onClick={clear}
              >
                <RefreshCw size={12} />
                New Image
              </button>
            </div>

            <div className="dm-palette-colors">
              {palette.map((color, i) => (
                <div key={i} className="dm-palette-color">
                  <div
                    className="dm-palette-swatch"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="dm-palette-info">
                    <span className="dm-palette-hex">{color.hex}</span>
                    <span className="dm-palette-role">{color.role}</span>
                  </div>
                  <button
                    type="button"
                    className="dm-apply-color"
                    onClick={() => applyColor(color, color.role)}
                    title={`Apply as ${color.role}`}
                  >
                    <Check size={12} />
                  </button>
                </div>
              ))}
            </div>

            {/* Apply All Button */}
            <button
              type="button"
              className="dm-button dm-button-primary dm-apply-all"
              onClick={applyAllColors}
            >
              <Check size={14} />
              Apply All Colors to Theme
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PhotoExtractor;
