/**
 * FloatingPanel Component
 *
 * Draggable, resizable panel container using react-rnd.
 */

import { useState, useEffect, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import { MIN_PANEL_SIZE, MAX_PANEL_SIZE } from '../../lib/constants';

/**
 * Floating panel wrapper with drag and resize functionality
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether panel is visible
 * @param {boolean} props.isMinimized - Whether panel is minimized
 * @param {Object} props.position - { x, y } position
 * @param {Object} props.size - { width, height } size
 * @param {Function} props.onDragStop - Called when drag ends
 * @param {Function} props.onResizeStop - Called when resize ends
 * @param {Function} props.onClose - Called when panel should close
 * @param {React.ReactNode} props.children - Panel content
 */
export function FloatingPanel({
  isOpen,
  isMinimized,
  position,
  size,
  onDragStop,
  onResizeStop,
  onClose,
  children,
  className = '',
  'aria-label': ariaLabel,
  role,
  'aria-modal': ariaModal,
}) {
  const [isDragging, setIsDragging] = useState(false);

  // Handle escape key to close
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) {
    return null;
  }

  const panelHeight = isMinimized ? 48 : size.height;

  return (
    <div className="dm-fixed-wrapper">
      <Rnd
        position={position}
        size={{ width: size.width, height: panelHeight }}
        minWidth={MIN_PANEL_SIZE.width}
        minHeight={isMinimized ? 48 : MIN_PANEL_SIZE.height}
        maxWidth={MAX_PANEL_SIZE.width}
        maxHeight={MAX_PANEL_SIZE.height}
        onDragStart={() => setIsDragging(true)}
        onDragStop={(e, data) => {
          setIsDragging(false);
          onDragStop(e, data);
        }}
        onResizeStop={onResizeStop}
        enableResizing={!isMinimized}
        dragHandleClassName="dm-drag-handle"
        bounds="parent"
        className={`dm-floating-panel ${isMinimized ? 'dm-minimized' : ''} ${isDragging ? 'dm-dragging' : ''} ${className}`}
        style={{
          zIndex: 10000,  /* High enough to be above all page content */
        }}
      >
        <div
          className="dm-panel-container"
          role={role}
          aria-label={ariaLabel}
          aria-modal={ariaModal}
        >
          {children}
        </div>
        {/* Visible resize handle indicator */}
        {!isMinimized && <div className="dm-resize-handle" aria-hidden="true" />}
      </Rnd>
    </div>
  );
}

export default FloatingPanel;
