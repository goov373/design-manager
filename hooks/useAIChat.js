/**
 * useAIChat Hook
 *
 * Handles AI chat for theme generation.
 * Works with custom API endpoints or direct OpenAI integration.
 */

import { useState, useCallback, useRef } from 'react';

/**
 * Chat message states
 */
export const MESSAGE_STATES = {
  IDLE: 'idle',
  SENDING: 'sending',
  STREAMING: 'streaming',
  COMPLETE: 'complete',
  ERROR: 'error',
};

/**
 * Default system prompt for theme generation
 */
const SYSTEM_PROMPT = `You are a design system expert that generates color themes for web applications.

When the user describes a theme, generate a complete color palette with both light and dark mode variants.

Your response MUST be valid JSON with this exact structure:
{
  "title": "Theme Name",
  "concept": "Brief description of the theme concept",
  "light": {
    "background": "#ffffff",
    "foreground": "#1a1a1a",
    "card": "#ffffff",
    "cardForeground": "#1a1a1a",
    "popover": "#ffffff",
    "popoverForeground": "#1a1a1a",
    "primary": "#...",
    "primaryForeground": "#...",
    "secondary": "#...",
    "secondaryForeground": "#...",
    "muted": "#...",
    "mutedForeground": "#...",
    "accent": "#...",
    "accentForeground": "#...",
    "destructive": "#...",
    "destructiveForeground": "#...",
    "border": "#...",
    "input": "#...",
    "ring": "#..."
  },
  "dark": {
    // Same structure but with dark mode colors
  }
}

Rules:
- Use hex colors only (e.g., #ffffff)
- Ensure sufficient contrast (4.5:1 minimum for text)
- Make foreground colors readable on their base color
- The light mode should be actually light, dark mode actually dark
- Be creative but maintain usability`;

/**
 * Hook for AI theme generation chat
 *
 * @param {Object} options
 * @param {string} options.apiKey - OpenAI API key (optional if using endpoint)
 * @param {string} options.apiEndpoint - Custom API endpoint (optional)
 * @param {Function} options.onThemeGenerated - Called when a theme is generated
 */
export function useAIChat({
  apiKey,
  apiEndpoint,
  onThemeGenerated,
} = {}) {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState(MESSAGE_STATES.IDLE);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  /**
   * Parse theme from AI response
   */
  const parseThemeResponse = useCallback((text) => {
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    try {
      const theme = JSON.parse(jsonMatch[0]);

      // Validate required fields
      if (!theme.light || !theme.dark) {
        console.warn('Invalid theme: missing light or dark mode');
        return null;
      }

      return theme;
    } catch (e) {
      console.error('Failed to parse theme JSON:', e);
      return null;
    }
  }, []);

  /**
   * Send a message to the AI
   */
  const sendMessage = useCallback(async (userMessage) => {
    if (!userMessage.trim()) return;

    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    // Add user message
    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: userMessage,
    };

    setMessages((prev) => [...prev, userMsg]);
    setStatus(MESSAGE_STATES.SENDING);
    setError(null);

    try {
      let response;

      if (apiEndpoint) {
        // Use custom endpoint
        response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userMessage,
            history: messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
          signal: abortControllerRef.current.signal,
        });
      } else if (apiKey) {
        // Use OpenAI directly
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              ...messages.map((m) => ({
                role: m.role,
                content: m.content,
              })),
              { role: 'user', content: userMessage },
            ],
            temperature: 0.7,
          }),
          signal: abortControllerRef.current.signal,
        });
      } else {
        throw new Error('No API key or endpoint configured');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();

      // Extract assistant message
      let assistantContent;
      if (apiEndpoint) {
        // Custom endpoint format
        assistantContent = data.message || data.content || data.response;
      } else {
        // OpenAI format
        assistantContent = data.choices?.[0]?.message?.content;
      }

      if (!assistantContent) {
        throw new Error('No response from AI');
      }

      // Parse theme from response
      const theme = parseThemeResponse(assistantContent);

      const assistantMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: assistantContent,
        theme,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setStatus(MESSAGE_STATES.COMPLETE);

      // Notify parent if theme was generated
      if (theme && onThemeGenerated) {
        onThemeGenerated(theme);
      }
    } catch (e) {
      if (e.name === 'AbortError') {
        return;
      }

      console.error('AI chat error:', e);
      setError(e.message);
      setStatus(MESSAGE_STATES.ERROR);

      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: `Error: ${e.message}`,
          error: true,
        },
      ]);
    }
  }, [messages, apiKey, apiEndpoint, parseThemeResponse, onThemeGenerated]);

  /**
   * Clear chat history
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
    setStatus(MESSAGE_STATES.IDLE);
    setError(null);
  }, []);

  /**
   * Cancel pending request
   */
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setStatus(MESSAGE_STATES.IDLE);
  }, []);

  return {
    messages,
    status,
    isLoading: status === MESSAGE_STATES.SENDING || status === MESSAGE_STATES.STREAMING,
    error,
    sendMessage,
    clearMessages,
    cancel,
    hasApiKey: !!apiKey || !!apiEndpoint,
  };
}

export default useAIChat;
