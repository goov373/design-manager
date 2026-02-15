/**
 * DesignManager Component
 *
 * Main component that renders the floating design panel with tabs.
 */

import { useState, useEffect, useCallback, useRef, Component } from 'react';
import { Hammer, Palette, Type, Layers, Sparkles, Download, AlertTriangle, RefreshCw } from 'lucide-react';
import { DesignManagerProvider, useDesignManagerContext } from './context/DesignManagerContext';
import { usePanelState } from './hooks/usePanelState';
import { FloatingPanel } from './components/floating-panel/FloatingPanel';
import { PanelHeader } from './components/floating-panel/PanelHeader';
import { ToolsTab } from './tabs/ToolsTab';
import { ColorsTab } from './tabs/ColorsTab';
import { TypographyTab } from './tabs/TypographyTab';
import { SurfacesTab } from './tabs/SurfacesTab';
import { AITab } from './tabs/AITab';
import { ExportTab } from './tabs/ExportTab';
import { TABS, DEFAULT_STORAGE_KEY, DEFAULT_PANEL_KEY } from './lib/constants';

/**
 * Error Boundary for DesignManager panel
 */
class PanelErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('DesignManager error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="dm-error-fallback">
          <AlertTriangle size={24} />
          <p>Something went wrong.</p>
          <div className="dm-error-buttons">
            <button
              className="dm-error-retry"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              <RefreshCw size={14} />
              Try Again
            </button>
            <button
              className="dm-error-close"
              onClick={() => this.props.onClose?.()}
            >
              Close Panel
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Import styles
import './styles/design-manager.css';

const TAB_CONFIG = [
  { id: TABS.TOOLS, label: 'Tools', icon: Hammer },
  { id: TABS.COLORS, label: 'Colors', icon: Palette },
  { id: TABS.TYPOGRAPHY, label: 'Type', icon: Type },
  { id: TABS.SURFACES, label: 'Surfaces', icon: Layers },
  { id: TABS.AI, label: 'AI', icon: Sparkles },
  { id: TABS.EXPORT, label: 'Export', icon: Download },
];

/**
 * Inner panel content (uses context)
 */
function DesignManagerPanel({ apiKey, apiEndpoint, onClose, panelState }) {
  const {
    darkMode,
    activeTab,
    setDarkMode,
    setActiveTab,
    canUndo,
    canRedo,
    undo,
    redo,
  } = useDesignManagerContext();

  const [isKeyboardNav, setIsKeyboardNav] = useState(false);

  // Detect keyboard vs mouse navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        setIsKeyboardNav(true);
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardNav(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  // Handle tab navigation with arrow keys
  const handleTabKeyDown = useCallback((e, currentIndex) => {
    const tabIds = TAB_CONFIG.map((t) => t.id);

    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : tabIds.length - 1;
      setActiveTab(tabIds[prevIndex]);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = currentIndex < tabIds.length - 1 ? currentIndex + 1 : 0;
      setActiveTab(tabIds[nextIndex]);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveTab(tabIds[0]);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveTab(tabIds[tabIds.length - 1]);
    }
  }, [setActiveTab]);

  const renderTabContent = () => {
    switch (activeTab) {
      case TABS.TOOLS:
        return <ToolsTab />;
      case TABS.COLORS:
        return <ColorsTab />;
      case TABS.TYPOGRAPHY:
        return <TypographyTab />;
      case TABS.SURFACES:
        return <SurfacesTab />;
      case TABS.AI:
        return <AITab apiKey={apiKey} apiEndpoint={apiEndpoint} />;
      case TABS.EXPORT:
        return <ExportTab />;
      default:
        return <ColorsTab />;
    }
  };

  return (
    <FloatingPanel
      isOpen={panelState.isOpen}
      isMinimized={panelState.isMinimized}
      position={panelState.position}
      size={panelState.size}
      onDragStop={panelState.onDragStop}
      onResizeStop={panelState.onResizeStop}
      onClose={onClose}
      className={isKeyboardNav ? 'dm-keyboard-nav' : ''}
      aria-label="Design Manager Panel"
      role="dialog"
      aria-modal="true"
    >
      <PanelHeader
        title="Design Manager"
        darkMode={darkMode}
        isMinimized={panelState.isMinimized}
        canUndo={canUndo}
        canRedo={canRedo}
        onDarkModeToggle={() => setDarkMode(!darkMode)}
        onMinimize={panelState.toggleMinimize}
        onClose={onClose}
        onUndo={undo}
        onRedo={redo}
      />

      {!panelState.isMinimized && (
        <div className="dm-body">
          <nav
            className="dm-sidebar"
            role="tablist"
            aria-label="Design Manager tabs"
            aria-orientation="vertical"
          >
            {TAB_CONFIG.map(({ id, label, icon: Icon }, index) => (
              <button
                key={id}
                type="button"
                role="tab"
                id={`dm-tab-${id}`}
                aria-selected={activeTab === id}
                aria-controls={`dm-panel-${id}`}
                tabIndex={activeTab === id ? 0 : -1}
                className={`dm-sidebar-tab ${activeTab === id ? 'dm-active' : ''}`}
                onClick={() => setActiveTab(id)}
                onKeyDown={(e) => handleTabKeyDown(e, index)}
                title={label}
                aria-label={label}
              >
                <Icon size={18} aria-hidden="true" />
              </button>
            ))}
          </nav>

          <div
            className="dm-tab-container"
            role="tabpanel"
            id={`dm-panel-${activeTab}`}
            aria-labelledby={`dm-tab-${activeTab}`}
            tabIndex={0}
          >
            {renderTabContent()}
          </div>
        </div>
      )}
    </FloatingPanel>
  );
}

/**
 * Design Manager
 *
 * Main component that renders the floating design panel.
 *
 * @param {Object} props
 * @param {Object} props.initialTheme - Initial theme values
 * @param {Function} props.onChange - Callback on theme change
 * @param {string} props.storageKey - localStorage key for theme
 * @param {string} props.panelStorageKey - localStorage key for panel state
 * @param {string} props.position - Initial panel position
 * @param {boolean} props.defaultOpen - Whether panel starts open
 * @param {string} props.apiKey - OpenAI API key for AI features
 * @param {string} props.apiEndpoint - Custom API endpoint for AI chat
 */
export function DesignManager({
  initialTheme,
  onChange,
  storageKey = DEFAULT_STORAGE_KEY,
  panelStorageKey = DEFAULT_PANEL_KEY,
  position = 'center',  // Default to center for predictable UX
  defaultOpen = false,  // Default to false so trigger shows first
  apiKey,
  apiEndpoint = '/api/design-manager/chat',
}) {
  const panelState = usePanelState({
    storageKey: panelStorageKey,
    position,
    defaultOpen,
  });

  // Use refs to avoid dependency on panelState object (which changes every render)
  const openRef = useRef(panelState.open);
  const closeRef = useRef(panelState.close);
  const toggleRef = useRef(panelState.toggle);

  // Keep refs updated with latest functions
  useEffect(() => {
    openRef.current = panelState.open;
    closeRef.current = panelState.close;
    toggleRef.current = panelState.toggle;
  });

  // Listen for global events to open/close panel from external components
  // Empty dependency array = stable listeners that don't re-register
  useEffect(() => {
    const handleOpen = () => openRef.current();
    const handleClose = () => closeRef.current();
    const handleToggle = () => toggleRef.current();

    window.addEventListener('design-manager:open', handleOpen);
    window.addEventListener('design-manager:close', handleClose);
    window.addEventListener('design-manager:toggle', handleToggle);

    return () => {
      window.removeEventListener('design-manager:open', handleOpen);
      window.removeEventListener('design-manager:close', handleClose);
      window.removeEventListener('design-manager:toggle', handleToggle);
    };
  }, []); // Empty deps - listeners are stable

  return (
    <DesignManagerProvider
      initialTheme={initialTheme}
      onChange={onChange}
      storageKey={storageKey}
    >
      {panelState.isOpen ? (
        <PanelErrorBoundary onClose={panelState.close}>
          <DesignManagerPanel
            apiKey={apiKey}
            apiEndpoint={apiEndpoint}
            onClose={panelState.close}
            panelState={panelState}
          />
        </PanelErrorBoundary>
      ) : (
        <DesignManagerTrigger onClick={panelState.open} />
      )}
    </DesignManagerProvider>
  );
}

/**
 * Design Manager Trigger Button
 *
 * Optional trigger button to open the panel when closed.
 */
export function DesignManagerTrigger({ onClick, className = '' }) {
  return (
    <button
      type="button"
      className={`dm-trigger-button ${className}`}
      onClick={onClick}
      title="Open Design Manager"
      aria-label="Open Design Manager"
    >
      <Palette size={20} />
    </button>
  );
}

export default DesignManager;
