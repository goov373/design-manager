/**
 * usePanelState Hook
 *
 * Manages floating panel position, size, and state persistence.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  DEFAULT_PANEL_KEY,
  DEFAULT_PANEL_SIZE,
  DEFAULT_PANEL_POSITION,
  MIN_PANEL_SIZE,
  MAX_PANEL_SIZE,
  PANEL_POSITIONS,
  STORAGE_DEBOUNCE,
} from '../lib/constants';

// Version key to detect fresh integrations
const PANEL_STATE_VERSION = 'dm-panel-v8'; // Bumped to v8 - fixed positioning

// Edge snapping configuration
const SNAP_THRESHOLD = 20; // Distance in pixels to trigger snap
const SNAP_MARGIN = 24;    // Margin from edge when snapped

/**
 * Apply magnetic snap-to-edge behavior
 * Snaps panel to edges when within threshold distance
 */
function snapToEdges(pos, windowWidth, windowHeight, panelWidth, panelHeight) {
  let { x, y } = pos;

  // Snap to left edge
  if (x < SNAP_THRESHOLD + SNAP_MARGIN) {
    x = SNAP_MARGIN;
  }
  // Snap to right edge
  else if (x > windowWidth - panelWidth - SNAP_THRESHOLD - SNAP_MARGIN) {
    x = windowWidth - panelWidth - SNAP_MARGIN;
  }

  // Snap to top edge
  if (y < SNAP_THRESHOLD + SNAP_MARGIN) {
    y = SNAP_MARGIN;
  }
  // Snap to bottom edge
  else if (y > windowHeight - panelHeight - SNAP_THRESHOLD - SNAP_MARGIN) {
    y = windowHeight - panelHeight - SNAP_MARGIN;
  }

  return { x, y };
}

/**
 * Hook for managing floating panel state
 *
 * @param {Object} options
 * @param {string} options.storageKey - localStorage key for persistence
 * @param {string} options.position - Initial position ('bottom-right', etc.)
 * @param {boolean} options.defaultOpen - Whether panel starts open
 * @returns {Object} Panel state and actions
 */
export function usePanelState({
  storageKey = DEFAULT_PANEL_KEY,
  position = 'center',  // Default to center of screen
  defaultOpen = false,
} = {}) {
  // Load initial state from localStorage or use defaults
  const getInitialState = () => {
    try {
      const storedVersion = localStorage.getItem('design-manager-version');
      const storedState = localStorage.getItem(storageKey);

      // Update version if needed - reset to defaults (clean slate for new features)
      if (storedVersion !== PANEL_STATE_VERSION) {
        localStorage.setItem('design-manager-version', PANEL_STATE_VERSION);
        // Clear old stored state on version change for clean UX
        localStorage.removeItem(storageKey);
        return {
          isOpen: defaultOpen,
          isMinimized: false,
          position: calculateInitialPosition(position),
          size: DEFAULT_PANEL_SIZE,
        };
      }

      if (storedState) {
        const parsed = JSON.parse(storedState);
        return {
          isOpen: parsed.isOpen ?? defaultOpen,
          isMinimized: parsed.isMinimized ?? false,
          position: validatePosition(parsed.position) || calculateInitialPosition(position),
          size: validateSize(parsed.size) || DEFAULT_PANEL_SIZE,
        };
      }
    } catch (e) {
      console.warn('Failed to load panel state:', e);
    }

    return {
      isOpen: defaultOpen,
      isMinimized: false,
      position: calculateInitialPosition(position),
      size: DEFAULT_PANEL_SIZE,
    };
  };

  const [state, setState] = useState(getInitialState);
  const saveTimeoutRef = useRef(null);
  const resizeTimeoutRef = useRef(null);
  const hasInitialized = useRef(false);

  // Ensure position is correctly calculated on client-side after mount
  // This handles SSR/hydration mismatch where window dimensions may differ
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      // Recalculate center position with actual window dimensions
      setState((prev) => ({
        ...prev,
        position: calculateCenterPosition(prev.size),
      }));
    }
  }, []);

  // Calculate initial position based on named position
  function calculateInitialPosition(positionName) {
    const pos = PANEL_POSITIONS[positionName] || PANEL_POSITIONS['center'];
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

    let x, y;

    // Center position - calculate dynamically
    if (pos.center) {
      x = Math.max(24, (windowWidth - DEFAULT_PANEL_SIZE.width) / 2);
      y = Math.max(24, (windowHeight - DEFAULT_PANEL_SIZE.height) / 2);
      return { x, y };
    }

    if (pos.right !== undefined) {
      x = windowWidth - DEFAULT_PANEL_SIZE.width - pos.right;
    } else {
      x = pos.left;
    }

    if (pos.bottom !== undefined) {
      y = windowHeight - DEFAULT_PANEL_SIZE.height - pos.bottom;
    } else {
      y = pos.top;
    }

    return { x, y };
  }

  // Validate position is within viewport bounds
  function validatePosition(pos) {
    if (!pos || typeof pos.x !== 'number' || typeof pos.y !== 'number') {
      return null;
    }

    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

    // Ensure panel is at least partially visible
    const x = Math.max(-200, Math.min(pos.x, windowWidth - 100));
    const y = Math.max(0, Math.min(pos.y, windowHeight - 100));

    return { x, y };
  }

  // Validate size is within bounds
  function validateSize(size) {
    if (!size || typeof size.width !== 'number' || typeof size.height !== 'number') {
      return null;
    }

    return {
      width: Math.max(MIN_PANEL_SIZE.width, Math.min(size.width, MAX_PANEL_SIZE.width)),
      height: Math.max(MIN_PANEL_SIZE.height, Math.min(size.height, MAX_PANEL_SIZE.height)),
    };
  }

  // Calculate center position for current viewport
  function calculateCenterPosition(panelSize) {
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

    return {
      x: Math.max(24, (windowWidth - panelSize.width) / 2),
      y: Math.max(24, (windowHeight - panelSize.height) / 2),
    };
  }

  // Save state to localStorage (debounced)
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(state));
      } catch (e) {
        console.warn('Failed to save panel state:', e);
      }
    }, STORAGE_DEBOUNCE);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [state, storageKey]);

  // Handle window resize to keep panel in bounds (debounced for performance)
  useEffect(() => {
    function handleResize() {
      // Debounce resize events to prevent jank
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      resizeTimeoutRef.current = setTimeout(() => {
        setState((prev) => ({
          ...prev,
          position: validatePosition(prev.position) || prev.position,
        }));
      }, 100); // 100ms debounce
    }

    window.addEventListener('resize', handleResize);
    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Helper to immediately persist state (for critical changes like open/close)
  const persistImmediately = useCallback((newState) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(newState));
    } catch (e) {
      console.warn('Failed to persist panel state:', e);
    }
  }, [storageKey]);

  // Actions - open/close immediately persist to avoid race conditions
  const open = useCallback(() => {
    setState((prev) => {
      // Always center panel when opening for predictable UX
      const centeredPosition = calculateCenterPosition(prev.size);
      const newState = {
        ...prev,
        isOpen: true,
        position: centeredPosition,
      };
      persistImmediately(newState); // Flush immediately, don't wait for debounce
      return newState;
    });
  }, [persistImmediately]);

  const close = useCallback(() => {
    setState((prev) => {
      const newState = { ...prev, isOpen: false };
      persistImmediately(newState); // Flush immediately
      return newState;
    });
  }, [persistImmediately]);

  const toggle = useCallback(() => {
    setState((prev) => {
      const isOpening = !prev.isOpen;
      const newState = {
        ...prev,
        isOpen: isOpening,
        // Center panel when opening (not when closing)
        ...(isOpening && { position: calculateCenterPosition(prev.size) }),
      };
      persistImmediately(newState); // Flush immediately
      return newState;
    });
  }, [persistImmediately]);

  const minimize = useCallback(() => {
    setState((prev) => ({ ...prev, isMinimized: true }));
  }, []);

  const maximize = useCallback(() => {
    setState((prev) => ({ ...prev, isMinimized: false }));
  }, []);

  const toggleMinimize = useCallback(() => {
    setState((prev) => ({ ...prev, isMinimized: !prev.isMinimized }));
  }, []);

  const setPosition = useCallback((newPosition) => {
    setState((prev) => {
      const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
      const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

      // Apply edge snapping
      const snapped = snapToEdges(
        newPosition,
        windowWidth,
        windowHeight,
        prev.size.width,
        prev.size.height
      );

      return {
        ...prev,
        position: validatePosition(snapped) || prev.position,
      };
    });
  }, []);

  const setSize = useCallback((newSize) => {
    setState((prev) => ({
      ...prev,
      size: validateSize(newSize) || prev.size,
    }));
  }, []);

  const onDragStop = useCallback((e, data) => {
    setPosition({ x: data.x, y: data.y });
  }, [setPosition]);

  const onResizeStop = useCallback((e, direction, ref, delta, position) => {
    setSize({
      width: parseInt(ref.style.width, 10),
      height: parseInt(ref.style.height, 10),
    });
    setPosition(position);
  }, [setSize, setPosition]);

  return {
    // State
    isOpen: state.isOpen,
    isMinimized: state.isMinimized,
    position: state.position,
    size: state.size,

    // Actions
    open,
    close,
    toggle,
    minimize,
    maximize,
    toggleMinimize,
    setPosition,
    setSize,

    // react-rnd handlers
    onDragStop,
    onResizeStop,
  };
}

export default usePanelState;
