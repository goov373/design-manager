/**
 * Design Manager Context
 *
 * EXTRACTABILITY RULE: This context must work with zero external dependencies
 * except React itself. All configuration is passed via props.
 */

import { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import {
  DEFAULT_THEME,
  DEFAULT_COLOR_TOKENS,
  DEFAULT_STORAGE_KEY,
  MAX_HISTORY_SIZE,
  STORAGE_DEBOUNCE,
  TABS,
} from '../lib/constants';
import {
  applyThemeToDOM,
  loadThemeFromStorage,
  saveThemeToStorage,
} from '../lib/theme-utils';
import { applyBuiltInPreset, removePresetStyles } from '../lib/presets';

// Action types
const ACTIONS = {
  SET_THEME: 'SET_THEME',
  SET_TOKEN: 'SET_TOKEN',
  SET_COLOR: 'SET_COLOR',
  SET_DARK_MODE: 'SET_DARK_MODE',
  SET_ACTIVE_TAB: 'SET_ACTIVE_TAB',
  APPLY_PRESET: 'APPLY_PRESET',
  UNDO: 'UNDO',
  REDO: 'REDO',
  RESET: 'RESET',
  IMPORT_THEME: 'IMPORT_THEME',
};

// Initial state factory
function createInitialState(initialTheme, storageKey) {
  const loadedTheme = loadThemeFromStorage(storageKey);
  const mergedTheme = { ...DEFAULT_THEME, ...loadedTheme, ...initialTheme };

  return {
    // Theme tokens
    ...mergedTheme,

    // Color tokens
    colors: {
      light: { ...DEFAULT_COLOR_TOKENS.light, ...loadedTheme.colors?.light },
      dark: { ...DEFAULT_COLOR_TOKENS.dark, ...loadedTheme.colors?.dark },
    },

    // UI state
    activeTab: TABS.COLORS,
    panelOpen: true,

    // History for undo/redo
    history: [],
    historyIndex: -1,
  };
}

// Reducer
function themeReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_THEME: {
      return {
        ...state,
        ...action.payload,
        history: [...state.history.slice(0, state.historyIndex + 1), state].slice(-MAX_HISTORY_SIZE),
        historyIndex: Math.min(state.historyIndex + 1, MAX_HISTORY_SIZE - 1),
      };
    }

    case ACTIONS.SET_TOKEN: {
      const { key, value } = action.payload;
      const newState = { ...state, [key]: value };

      return {
        ...newState,
        history: [...state.history.slice(0, state.historyIndex + 1), state].slice(-MAX_HISTORY_SIZE),
        historyIndex: Math.min(state.historyIndex + 1, MAX_HISTORY_SIZE - 1),
      };
    }

    case ACTIONS.SET_COLOR: {
      const { token, value, mode } = action.payload;
      const targetMode = mode || (state.darkMode ? 'dark' : 'light');

      return {
        ...state,
        colors: {
          ...state.colors,
          [targetMode]: {
            ...state.colors[targetMode],
            [token]: value,
          },
        },
        history: [...state.history.slice(0, state.historyIndex + 1), state].slice(-MAX_HISTORY_SIZE),
        historyIndex: Math.min(state.historyIndex + 1, MAX_HISTORY_SIZE - 1),
      };
    }

    case ACTIONS.SET_DARK_MODE: {
      return {
        ...state,
        darkMode: action.payload,
      };
    }

    case ACTIONS.SET_ACTIVE_TAB: {
      return {
        ...state,
        activeTab: action.payload,
      };
    }

    case ACTIONS.APPLY_PRESET: {
      return {
        ...state,
        activePresetId: action.payload,
        history: [...state.history.slice(0, state.historyIndex + 1), state].slice(-MAX_HISTORY_SIZE),
        historyIndex: Math.min(state.historyIndex + 1, MAX_HISTORY_SIZE - 1),
      };
    }

    case ACTIONS.UNDO: {
      if (state.historyIndex < 0) return state;

      const previousState = state.history[state.historyIndex];
      return {
        ...previousState,
        history: state.history,
        historyIndex: state.historyIndex - 1,
        activeTab: state.activeTab, // Preserve UI state
        panelOpen: state.panelOpen,
      };
    }

    case ACTIONS.REDO: {
      if (state.historyIndex >= state.history.length - 1) return state;

      const nextState = state.history[state.historyIndex + 2];
      if (!nextState) return state;

      return {
        ...nextState,
        history: state.history,
        historyIndex: state.historyIndex + 1,
        activeTab: state.activeTab,
        panelOpen: state.panelOpen,
      };
    }

    case ACTIONS.RESET: {
      return {
        ...createInitialState({}, action.payload.storageKey),
        history: [...state.history.slice(0, state.historyIndex + 1), state].slice(-MAX_HISTORY_SIZE),
        historyIndex: Math.min(state.historyIndex + 1, MAX_HISTORY_SIZE - 1),
      };
    }

    case ACTIONS.IMPORT_THEME: {
      return {
        ...state,
        ...action.payload,
        history: [...state.history.slice(0, state.historyIndex + 1), state].slice(-MAX_HISTORY_SIZE),
        historyIndex: Math.min(state.historyIndex + 1, MAX_HISTORY_SIZE - 1),
      };
    }

    default:
      return state;
  }
}

// Context
const DesignManagerContext = createContext(null);

/**
 * Design Manager Provider
 *
 * @param {Object} props
 * @param {Object} props.initialTheme - Initial theme values
 * @param {Function} props.onChange - Callback on theme change
 * @param {string} props.storageKey - localStorage key
 * @param {string} props.apiKey - OpenAI API key for AI features
 * @param {string} props.apiEndpoint - Custom API endpoint for AI chat
 * @param {React.ReactNode} props.children - Child components
 */
export function DesignManagerProvider({
  initialTheme,
  onChange,
  storageKey = DEFAULT_STORAGE_KEY,
  apiKey,
  apiEndpoint,
  children,
}) {
  const [state, dispatch] = useReducer(
    themeReducer,
    { initialTheme, storageKey },
    ({ initialTheme: init, storageKey: key }) => createInitialState(init, key)
  );

  const saveTimeoutRef = useRef(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Apply theme to DOM when state changes
  useEffect(() => {
    applyThemeToDOM(state);

    // Apply preset if one is active
    if (state.activePresetId && state.activePresetId !== 'default') {
      applyBuiltInPreset(state.activePresetId);
    } else {
      removePresetStyles();
    }

    // Debounced save to localStorage
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveThemeToStorage(state, storageKey);
    }, STORAGE_DEBOUNCE);

    // Notify parent of changes
    if (onChangeRef.current) {
      onChangeRef.current(state);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [state, storageKey]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          dispatch({ type: ACTIONS.REDO });
        } else {
          dispatch({ type: ACTIONS.UNDO });
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Action creators
  const setToken = useCallback((key, value) => {
    dispatch({ type: ACTIONS.SET_TOKEN, payload: { key, value } });
  }, []);

  const setColor = useCallback((token, value, mode) => {
    dispatch({ type: ACTIONS.SET_COLOR, payload: { token, value, mode } });
  }, []);

  const setDarkMode = useCallback((dark) => {
    dispatch({ type: ACTIONS.SET_DARK_MODE, payload: dark });
  }, []);

  const setActiveTab = useCallback((tab) => {
    dispatch({ type: ACTIONS.SET_ACTIVE_TAB, payload: tab });
  }, []);

  const applyPreset = useCallback((presetId) => {
    dispatch({ type: ACTIONS.APPLY_PRESET, payload: presetId });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: ACTIONS.UNDO });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: ACTIONS.REDO });
  }, []);

  const resetToDefaults = useCallback(() => {
    dispatch({ type: ACTIONS.RESET, payload: { storageKey } });
  }, [storageKey]);

  const importTheme = useCallback((themeData) => {
    dispatch({ type: ACTIONS.IMPORT_THEME, payload: themeData });
  }, []);

  const value = {
    // State
    theme: state,
    darkMode: state.darkMode,
    activeTab: state.activeTab,
    colors: state.colors,

    // API configuration (for AI features)
    apiKey,
    apiEndpoint,

    // History state
    canUndo: state.historyIndex >= 0,
    canRedo: state.historyIndex < state.history.length - 1,

    // Actions
    setToken,
    setColor,
    setDarkMode,
    setActiveTab,
    applyPreset,
    undo,
    redo,
    resetToDefaults,
    importTheme,
  };

  return (
    <DesignManagerContext.Provider value={value}>
      {children}
    </DesignManagerContext.Provider>
  );
}

/**
 * Hook to access the Design Manager context
 * @returns {Object} Design Manager context value
 */
export function useDesignManagerContext() {
  const context = useContext(DesignManagerContext);
  if (!context) {
    throw new Error('useDesignManagerContext must be used within a DesignManagerProvider');
  }
  return context;
}

export { DesignManagerContext };
