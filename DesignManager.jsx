/**
 * DesignManager Component
 *
 * Main component that renders the floating design panel with tabs.
 */

import { useState, useEffect, useCallback } from 'react';
import { Palette, Type, Layers, Sparkles, Download } from 'lucide-react';
import { DesignManagerProvider, useDesignManagerContext } from './context/DesignManagerContext';
import { usePanelState } from './hooks/usePanelState';
import { FloatingPanel } from './components/floating-panel/FloatingPanel';
import { PanelHeader } from './components/floating-panel/PanelHeader';
import { ColorsTab } from './tabs/ColorsTab';
import { TypographyTab } from './tabs/TypographyTab';
import { SurfacesTab } from './tabs/SurfacesTab';
import { AITab } from './tabs/AITab';
import { ExportTab } from './tabs/ExportTab';
import { TABS, DEFAULT_STORAGE_KEY, DEFAULT_PANEL_KEY } from './lib/constants';

// Import styles
import './styles/design-manager.css';

const TAB_CONFIG = [
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
        <>
          <div
            className="dm-tabs"
            role="tablist"
            aria-label="Design Manager tabs"
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
                className={`dm-tab ${activeTab === id ? 'dm-active' : ''}`}
                onClick={() => setActiveTab(id)}
                onKeyDown={(e) => handleTabKeyDown(e, index)}
                title={label}
              >
                <Icon size={16} aria-hidden="true" />
                <span className="dm-tab-label">{label}</span>
              </button>
            ))}
          </div>

          <div
            className="dm-tab-container"
            role="tabpanel"
            id={`dm-panel-${activeTab}`}
            aria-labelledby={`dm-tab-${activeTab}`}
            tabIndex={0}
          >
            {renderTabContent()}
          </div>
        </>
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
  position = 'bottom-right',
  defaultOpen = true,
  apiKey,
  apiEndpoint = '/api/design-manager/chat',
}) {
  const panelState = usePanelState({
    storageKey: panelStorageKey,
    position,
    defaultOpen,
  });

  return (
    <DesignManagerProvider
      initialTheme={initialTheme}
      onChange={onChange}
      storageKey={storageKey}
    >
      <DesignManagerPanel
        apiKey={apiKey}
        apiEndpoint={apiEndpoint}
        onClose={panelState.close}
        panelState={panelState}
      />
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
