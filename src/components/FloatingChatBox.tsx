import useSessionStorage from '@/hooks/useSessionStorage';
import { getGoogleModel } from '@/lib/model';
import { SYSTEM_PROMPT } from '@/lib/prompt';
import { Message, MessagePart } from '@/lib/types';
import { extractCode } from '@/lib/utils';
import { decrypt } from '@/lib/encryption';
import { convertToModelMessages, streamText } from 'ai';
import { BotMessageSquare, Github, Loader2, Send, Trash2, User, XIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import './FloatingChatBox.css';

interface FloatingChatBoxProps {
  onClose: () => void;
  context: string;
}

/**
 * FloatingChatBox Component
 * This is the main UI for the AI tutoring interface. It handles message history (via sessionStorage),
 * user input, extraction of page context (code and problem statement), and streaming responses from Gemini.
 */
export default function FloatingChatBox({ onClose, context }: FloatingChatBoxProps) {
  // Use custom hook to manage message persistence in sessionStorage
  const { messages, setMessages } = useSessionStorage();
  // Local state for the current user input in the text field
  const [input, setInput] = useState('');
  // State to track if the AI is currently streaming a response
  const [isStreaming, setIsStreaming] = useState(false);
  // Reference to the scrollable container for auto-scrolling to new messages
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // Track if the user is near the bottom of the chat to decide if we should auto-scroll
  const isUserNearBottomRef = useRef(true);
  // State to show a 'thinking' indicator while waiting for the first chunk of AI response
  const [isThinking, setIsThinking] = useState(false);

  /**
   * Automatically scroll the chat container to the bottom.
   */
  const scrollToBottom = (behavior: ScrollBehavior = 'auto') => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior });
  };

  /**
   * Monitor scroll events to determine if the user has scrolled up away from the bottom.
   */
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const distanceFromBottom =
      container.scrollHeight - (container.scrollTop + container.clientHeight);
    // Threshold of 96px to consider the user "at the bottom"
    isUserNearBottomRef.current = distanceFromBottom < 96;
  };

  /**
   * Effect: Trigger auto-scroll whenever the message array changes, if the user is at the bottom.
   */
  useEffect(() => {
    if (isUserNearBottomRef.current) {
      requestAnimationFrame(() => scrollToBottom('auto'));
    }
  }, [messages]);

  /**
   * Effect: Do a smooth scroll to bottom when streaming finishes.
   */
  useEffect(() => {
    if (!isStreaming) {
      requestAnimationFrame(() => scrollToBottom('smooth'));
    }
  }, [isStreaming]);

  /**
   * Clears the current chat session after user confirmation.
   */
  const clearSession = () => {
    if (messages.length === 0) return;

    const confirmed = window.confirm(
      'Are you sure you want to clear this chat session? This action cannot be undone.',
    );

    if (confirmed) {
      setMessages([]);
      sessionStorage.removeItem('leetcode-tutor-messages');
      setIsStreaming(false);
      setIsThinking(false);
      setInput('');
    }
  };

  /**
   * Main function to handle sending a user message to the AI.
   * It gathers page context, validates the API key, and initiates the streaming process.
   */
  const sendMessage = async () => {
    if (input.trim() === '') return;
    const userMessageText = input;
    setInput('');
    setIsStreaming(true);
    setIsThinking(true);

    // 1. Create and add the user's message to the state
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      parts: [{ type: 'text', text: userMessageText }],
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    // 2. Prepare an empty assistant message to be filled by the stream
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      parts: [],
    };

    const messagesWithAssistant = [...updatedMessages, assistantMessage];
    setMessages(messagesWithAssistant);
    requestAnimationFrame(() => scrollToBottom('auto'));

    // 3. Extract context from the LeetCode environment
    // Detect the selected programming language from the UI button
    let programmingLanguage = 'UNKNOWN';
    const changeLanguageButton = document.querySelector(
      'button.rounded.items-center.whitespace-nowrap.inline-flex.bg-transparent.dark\\:bg-dark-transparent.text-text-secondary.group',
    );
    if (changeLanguageButton?.textContent) {
      programmingLanguage = changeLanguageButton.textContent;
    }

    // Extract the user's current code from the Monaco editor lines
    const userCurrentCodeContainer = document.querySelectorAll('.view-line');
    const extractedCode = extractCode(userCurrentCodeContainer);

    // 4. Construct the prompt by injecting context into the template
    const prompt = SYSTEM_PROMPT.replace(/{{problem_statement}}/gi, () => context || '')
      .replace(/{{programming_language}}/g, () => programmingLanguage || 'UNKNOWN')
      .replace(/{{user_code}}/g, () => extractedCode || '');

    // 5. Retrieve and decrypt the Gemini API key from Chrome's local storage
    const storage = await chrome.storage.local.get(['gemini_api_key']);
    const encryptedKey = storage.gemini_api_key;

    if (!encryptedKey) {
      setIsStreaming(false);
      setIsThinking(false);
      // Inform the user if the API key is missing
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        parts: [
          {
            type: 'text',
            text: '⚠️ **Gemini API Key not found.**\n\nPlease click on the extension icon in your toolbar to set up your Gemini API key.',
          },
        ],
      };
      setMessages([...updatedMessages, errorMessage]);
      return;
    }

    const apiKey = await decrypt(String(encryptedKey));
    if (!apiKey) {
      setIsStreaming(false);
      setIsThinking(false);
      return;
    }

    // 6. Initiate the AI stream using the 'ai' SDK and the Gemini model
    const result = streamText({
      model: getGoogleModel(apiKey),
      messages: convertToModelMessages(
        updatedMessages.map((msg) => ({
          ...msg,
          parts: msg.parts || [],
        })),
      ),
      system: prompt,
      temperature: 1,
    });

    try {
      // 7. Iterate through the stream and update the assistant's message in real-time
      for await (const part of result.textStream) {
        if (part && part.trim()) {
          const currentMessages = [...messagesWithAssistant];
          const assistantMsg = currentMessages.find((msg) => msg.id === assistantMessage.id);
          if (assistantMsg) {
            assistantMsg.parts = assistantMsg.parts || [];
            let textPart = assistantMsg.parts.find((p) => p?.type === 'text');
            if (!textPart) {
              textPart = { type: 'text', text: '' };
              assistantMsg.parts.push(textPart);
            }
            textPart.text += part;
            // First chunk received, stop showing the thinking dot animation
            setIsThinking(false);
            setMessages(currentMessages);
          }
        }
      }
    } catch (error) {
      console.error('Error streaming response:', error);
      setIsThinking(false);
      // Handle errors during streaming by notifying the user in the chat
      const currentMessages = [...messagesWithAssistant];
      const assistantMsg = currentMessages.find((msg) => msg.id === assistantMessage.id);
      if (assistantMsg) {
        assistantMsg.parts = [
          {
            type: 'text',
            text: 'Sorry, I encountered an error while generating a response. Please check your API key or try again.',
          },
        ];
        setMessages(currentMessages);
      }
    } finally {
      setIsStreaming(false);
      setIsThinking(false);
    }
  };

  return (
    <div className="floating-chat-box">
      {/* Header section with logo, title, and action buttons */}
      <div className="chat-header">
        <div className="header-left">
          <div className="logo-container">
            <img src={chrome.runtime.getURL('logo.svg')} alt="Algorun Logo" className="logo-img" />
            <div className="logo-glow" />
          </div>
          <div>
            <h2 className="header-title">Algorun - Leetcode Tutor</h2>
            <p className="header-subtitle">AI-powered coding tutor</p>
          </div>
        </div>
        <div className="header-right">
          {/* GitHub Link */}
          <a
            href="https://github.com/lwshakib/algo-run-leetcode-tutor"
            target="_blank"
            rel="noopener noreferrer"
            className="header-action-button"
            aria-label="View on GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
          {/* Clear Session Button */}
          <button
            onClick={clearSession}
            disabled={messages.length === 0 || isStreaming}
            className="header-action-button"
            aria-label="Clear chat session"
            title="Clear chat session"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          {/* Close Chat Button */}
          <button onClick={onClose} className="header-action-button" aria-label="Close chat">
            <XIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Messages Container with custom scrollbar */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="messages-container custom-scrollbar"
      >
        {/* Welcome message shown when no messages exist */}
        {messages.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon-wrapper">
              <BotMessageSquare className="empty-icon" />
            </div>
            <h3 className="empty-title">Welcome to Algorun!</h3>
            <p className="empty-text">
              Ask me anything about the problem. I can help explain concepts, suggest approaches, or
              review your code.
            </p>
          </div>
        )}

        {/* Render individual messages */}
        {messages.map((message: Message) => {
          // Optimization: Don't render empty assistant bubbles while they are still initializing
          if (
            message.role === 'assistant' &&
            (!message.parts ||
              message.parts.length === 0 ||
              (message.parts.length === 1 &&
                message.parts[0]?.type === 'text' &&
                !message.parts[0]?.text))
          ) {
            return null;
          }

          return (
            <div
              key={message.id}
              className={`message-row ${message.role === 'user' ? 'user' : 'assistant'}`}
            >
              {message.role === 'assistant' && (
                <div className="avatar-wrapper assistant">
                  <BotMessageSquare className="avatar-icon assistant" />
                </div>
              )}

              <div className={`message-bubble ${message.role === 'user' ? 'user' : 'assistant'}`}>
                {message.role === 'user' ? (
                  <p className="user-message-text">{message.parts?.[0]?.text || ''}</p>
                ) : (
                  <div className="assistant-message-content">
                    {/* Render assistant message parts, using MarkdownRenderer for text */}
                    {message.parts && message.parts.length > 0
                      ? message.parts.map((part: MessagePart, idx: number) => {
                          if (part.type === 'text') {
                            return <MarkdownRenderer key={idx}>{part.text}</MarkdownRenderer>;
                          }
                          return null;
                        })
                      : null}
                  </div>
                )}
              </div>

              {message.role === 'user' && (
                <div className="avatar-wrapper user">
                  <User className="avatar-icon user" />
                </div>
              )}
            </div>
          );
        })}

        {/* Thinking Indicator (Loading Dots) */}
        {isThinking && (
          <div className="message-row assistant">
            <div className="avatar-wrapper assistant">
              <BotMessageSquare className="avatar-icon assistant" />
            </div>
            <div className="message-bubble assistant">
              <div className="thinking-container">
                <div className="thinking-dot" style={{ animationDelay: '0ms' }} />
                <div className="thinking-dot" style={{ animationDelay: '150ms' }} />
                <div className="thinking-dot" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Input Area */}
      <div className="input-area">
        <div className="input-container">
          <input
            type="text"
            placeholder="Ask a question..."
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              // Handle Enter to send, Shift+Enter for new line
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            disabled={isStreaming}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isStreaming}
            className="send-button"
            aria-label="Send message"
          >
            {/* Show loading spinner while streaming, else send icon */}
            {isStreaming ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
