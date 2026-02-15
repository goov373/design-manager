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
  position = 'bottom-right',
  defaultOpen = true,
} = {}) {
  // Load initial state from localStorage or use defaults
  const getInitialState = () => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
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

  // Calculate initial position based on named position
  function calculateInitialPosition(positionName) {
    const pos = PANEL_POSITIONS[positionName] || PANEL_POSITIONS['bottom-right'];
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

    let x, y;

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

  // Handle window resize to keep panel in bounds
  useEffect(() => {
    function handleResize() {
      setState((prev) => ({
        ...prev,
        position: validatePosition(prev.position) || prev.position,
      }));
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Actions
  const open = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: true }));
  }, []);

  const close = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const toggle = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: !prev.isOpen }));
  }, []);

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
    setState((prev) => ({
      ...prev,
      position: validatePosition(newPosition) || prev.position,
    }));
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
