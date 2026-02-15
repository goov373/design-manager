/**
 * PanelHeader Component
 *
 * Header bar with drag handle and control buttons.
 */

import { Sun, Moon, Minus, Maximize2, X, Undo2, Redo2 } from 'lucide-react';

/**
 * Panel header with drag handle and controls
 *
 * @param {Object} props
 * @param {string} props.title - Panel title
 * @param {boolean} props.darkMode - Current dark mode state
 * @param {boolean} props.isMinimized - Whether panel is minimized
 * @param {boolean} props.canUndo - Whether undo is available
 * @param {boolean} props.canRedo - Whether redo is available
 * @param {Function} props.onDarkModeToggle - Toggle dark mode
 * @param {Function} props.onMinimize - Minimize/maximize panel
 * @param {Function} props.onClose - Close panel
 * @param {Function} props.onUndo - Undo action
 * @param {Function} props.onRedo - Redo action
 */
export function PanelHeader({
  title = 'Design Manager',
  darkMode,
  isMinimized,
  canUndo,
  canRedo,
  onDarkModeToggle,
  onMinimize,
  onClose,
  onUndo,
  onRedo,
}) {
  return (
    <div className="dm-panel-header dm-drag-handle">
      <div className="dm-header-left">
        <span className="dm-header-title">{title}</span>
      </div>

      <div className="dm-header-controls">
        {/* Undo/Redo */}
        <button
          type="button"
          className="dm-header-button"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Cmd+Z)"
          aria-label="Undo"
        >
          <Undo2 size={14} />
        </button>

        <button
          type="button"
          className="dm-header-button"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Cmd+Shift+Z)"
          aria-label="Redo"
        >
          <Redo2 size={14} />
        </button>

        <div className="dm-header-divider" />

        {/* Dark mode toggle */}
        <button
          type="button"
          className="dm-header-button"
          onClick={onDarkModeToggle}
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        {/* Minimize/Maximize */}
        <button
          type="button"
          className="dm-header-button"
          onClick={onMinimize}
          title={isMinimized ? 'Maximize' : 'Minimize'}
          aria-label={isMinimized ? 'Maximize' : 'Minimize'}
        >
          {isMinimized ? <Maximize2 size={14} /> : <Minus size={14} />}
        </button>

        {/* Close */}
        <button
          type="button"
          className="dm-header-button dm-header-button-close"
          onClick={onClose}
          title="Close (Esc)"
          aria-label="Close"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

export default PanelHeader;
