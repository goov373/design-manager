/**
 * AIChat Components
 *
 * Chat interface and message components for AI theme generation.
 */

import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Send, Check, Loader2, AlertCircle } from 'lucide-react';

/**
 * Chat input component
 */
export function AIChatInput({
  onSubmit,
  disabled = false,
  placeholder = 'Describe your ideal theme...',
}) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!input.trim() || disabled) return;
    onSubmit(input);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form className="dm-ai-input-form" onSubmit={handleSubmit}>
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="dm-ai-textarea"
        rows={2}
      />
      <button
        type="submit"
        className="dm-ai-send-btn"
        disabled={!input.trim() || disabled}
      >
        {disabled ? (
          <Loader2 size={16} className="dm-spin" />
        ) : (
          <Send size={16} />
        )}
      </button>
    </form>
  );
}

/**
 * Single chat message
 */
export function AIChatMessage({ message, onApplyTheme }) {
  const isUser = message.role === 'user';
  const isError = message.error;

  return (
    <div className={`dm-ai-message ${isUser ? 'dm-user' : 'dm-assistant'} ${isError ? 'dm-error' : ''}`}>
      {/* Text content */}
      {!message.theme && (
        <div className="dm-message-content">
          {isError ? (
            <div className="dm-message-error">
              <AlertCircle size={14} />
              <span>{message.content}</span>
            </div>
          ) : (
            <p>{message.content}</p>
          )}
        </div>
      )}

      {/* Theme preview */}
      {message.theme && (
        <ThemePreview theme={message.theme} onApply={onApplyTheme} />
      )}
    </div>
  );
}

/**
 * Theme preview card with apply button
 */
export function ThemePreview({ theme, onApply }) {
  if (!theme?.light || !theme?.dark) {
    return null;
  }

  // Key colors to preview
  const previewColors = [
    'background',
    'foreground',
    'primary',
    'secondary',
    'accent',
    'muted',
    'destructive',
    'border',
  ];

  return (
    <div className="dm-theme-preview">
      <div className="dm-preview-header">
        <span className="dm-preview-icon">✨</span>
        <div className="dm-preview-title-wrap">
          <h4 className="dm-preview-title">{theme.title || 'Generated Theme'}</h4>
          {theme.concept && (
            <p className="dm-preview-concept">{theme.concept}</p>
          )}
        </div>
      </div>

      {/* Color swatches */}
      <div className="dm-preview-modes">
        {/* Light mode */}
        <div className="dm-preview-mode">
          <span className="dm-mode-label">Light</span>
          <div className="dm-color-grid">
            {previewColors.map((key) => (
              theme.light[key] && (
                <div
                  key={key}
                  className="dm-preview-swatch"
                  style={{ backgroundColor: theme.light[key] }}
                  title={`${key}: ${theme.light[key]}`}
                />
              )
            ))}
          </div>
        </div>

        {/* Dark mode */}
        <div className="dm-preview-mode">
          <span className="dm-mode-label">Dark</span>
          <div className="dm-color-grid">
            {previewColors.map((key) => (
              theme.dark[key] && (
                <div
                  key={key}
                  className="dm-preview-swatch"
                  style={{ backgroundColor: theme.dark[key] }}
                  title={`${key}: ${theme.dark[key]}`}
                />
              )
            ))}
          </div>
        </div>
      </div>

      {/* Apply button */}
      <button
        type="button"
        className="dm-apply-theme-btn"
        onClick={() => onApply?.(theme)}
      >
        <Check size={14} />
        Apply Theme
      </button>
    </div>
  );
}

/**
 * Main chat container
 */
export function AIChat({
  messages,
  onSend,
  onApplyTheme,
  isLoading,
  placeholder,
}) {
  const messagesEndRef = useRef(null);
  const prevMessagesLengthRef = useRef(messages.length);

  // Scroll to bottom only when new messages are added (not on initial mount)
  useLayoutEffect(() => {
    const prevLength = prevMessagesLengthRef.current;
    const currentLength = messages.length;
    prevMessagesLengthRef.current = currentLength;

    // Only scroll if messages were added (not on mount or when clearing)
    if (currentLength > prevLength && currentLength > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  return (
    <div className="dm-ai-chat-container">
      <div className="dm-ai-messages">
        {messages.length === 0 ? (
          <div className="dm-ai-empty">
            <span className="dm-ai-empty-icon">✨</span>
            <p>Describe your ideal theme and AI will generate it.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <AIChatMessage
              key={msg.id}
              message={msg}
              onApplyTheme={onApplyTheme}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <AIChatInput
        onSubmit={onSend}
        disabled={isLoading}
        placeholder={placeholder}
      />
    </div>
  );
}

export default AIChat;
