import useSessionStorage from "@/hooks/useSessionStorage";
import { getGoogleModel } from "@/lib/model";
import { SYSTEM_PROMPT } from "@/lib/prompt";
import { Message, MessagePart } from "@/lib/types";
import { extractCode } from "@/lib/utils";
import { decrypt } from "@/lib/encryption";
import { convertToModelMessages, streamText } from "ai";
import {
  BotMessageSquare,
  Github,
  Loader2,
  Send,
  Trash2,
  User,
  XIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import MarkdownRenderer from "./MarkdownRenderer";
import "./FloatingChatBox.css";

interface FloatingChatBoxProps {
  onClose: () => void;
  context: string;
}

export default function FloatingChatBox({
  onClose,
  context,
}: FloatingChatBoxProps) {
  const { messages, setMessages } = useSessionStorage();
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isUserNearBottomRef = useRef(true);
  const [isThinking, setIsThinking] = useState(false);

  const scrollToBottom = (behavior: ScrollBehavior = "auto") => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior });
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const distanceFromBottom =
      container.scrollHeight - (container.scrollTop + container.clientHeight);
    isUserNearBottomRef.current = distanceFromBottom < 96; // px threshold
  };

  useEffect(() => {
    if (isUserNearBottomRef.current) {
      requestAnimationFrame(() => scrollToBottom("auto"));
    }
  }, [messages]);

  useEffect(() => {
    if (!isStreaming) {
      requestAnimationFrame(() => scrollToBottom("smooth"));
    }
  }, [isStreaming]);

  const clearSession = () => {
    if (messages.length === 0) return;

    const confirmed = window.confirm(
      "Are you sure you want to clear this chat session? This action cannot be undone."
    );

    if (confirmed) {
      setMessages([]);
      sessionStorage.removeItem("leetcode-tutor-messages");
      setIsStreaming(false);
      setIsThinking(false);
      setInput("");
    }
  };

  const sendMessage = async () => {
    if (input.trim() === "") return;
    setInput("");
    setIsStreaming(true);
    setIsThinking(true);

    // Create user message
    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      parts: [{ type: "text", text: input }],
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    // Create assistant message with parts array
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      parts: [],
    };

    const messagesWithAssistant = [...updatedMessages, assistantMessage];
    setMessages(messagesWithAssistant);
    requestAnimationFrame(() => scrollToBottom("auto"));

    // Collect code and context information
    let programmingLanguage = "UNKNOWN";
    const changeLanguageButton = document.querySelector(
      "button.rounded.items-center.whitespace-nowrap.inline-flex.bg-transparent.dark\\:bg-dark-transparent.text-text-secondary.group"
    );
    if (changeLanguageButton) {
      if (changeLanguageButton.textContent)
        programmingLanguage = changeLanguageButton.textContent;
    }

    const userCurrentCodeContainer = document.querySelectorAll(".view-line");
    const extractedCode = extractCode(userCurrentCodeContainer);

    // For now, just echo back the user's message as a mock response
    // In a real implementation, this would be replaced with AI logic
    const prompt = SYSTEM_PROMPT.replace(
      /{{problem_statement}}/gi,
      () => context || ""
    )
      .replace(
        /{{programming_language}}/g,
        () => programmingLanguage || "UNKNOWN"
      )
      .replace(/{{user_code}}/g, () => extractedCode || "");

    console.log("context", context);
    console.log("programmingLanguage", programmingLanguage);
    console.log("extractedCode", extractedCode);

    // 0. Fetch API key from storage
    const storage = await chrome.storage.local.get(["gemini_api_key"]);
    const encryptedKey = storage.gemini_api_key;

    if (!encryptedKey) {
      setIsStreaming(false);
      setIsThinking(false);
      // Add error message to chat
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "⚠️ **Gemini API Key not found.**\n\nPlease click on the extension icon in your toolbar to set up your Gemini API key.",
          },
        ],
      };
      setMessages([...messages, newMessage, errorMessage]);
      return;
    }

    const apiKey = await decrypt(String(encryptedKey));
    if (!apiKey) {
      setIsStreaming(false);
      setIsThinking(false);
      return;
    }

    const result = streamText({
      model: getGoogleModel(apiKey),
      messages: convertToModelMessages(
        updatedMessages.map((msg) => ({
          ...msg,
          parts: msg.parts || [],
        }))
      ),
      system: prompt,
      temperature: 1,
    });

    try {
      for await (const part of result.textStream) {
        if (part && part.trim()) {
          // Add text part
          const currentMessages = [...messagesWithAssistant];
          const assistantMsg = currentMessages.find(
            (msg) => msg.id === assistantMessage.id
          );
          if (assistantMsg) {
            assistantMsg.parts = assistantMsg.parts || [];
            let textPart = assistantMsg.parts.find((p) => p?.type === "text");
            if (!textPart) {
              textPart = { type: "text", text: "" };
              assistantMsg.parts.push(textPart);
            }
            textPart.text += part;
            setIsThinking(false); // Stop thinking once we start receiving content
            setMessages(currentMessages);
          }
        }
      }
    } catch (error) {
      console.error("Error streaming response:", error);
      setIsThinking(false);
      // Optionally add an error message to the assistant message
      const currentMessages = [...messagesWithAssistant];
      const assistantMsg = currentMessages.find(
        (msg) => msg.id === assistantMessage.id
      );
      if (assistantMsg) {
        assistantMsg.parts = [
          {
            type: "text",
            text: "Sorry, I encountered an error. Please try again.",
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
      {/* Header */}
      <div className="chat-header">
        <div className="header-left">
          <div className="logo-container">
            <img
              src={chrome.runtime.getURL("logo.svg")}
              alt="Algorun Logo"
              className="logo-img"
            />
            <div className="logo-glow" />
          </div>
          <div>
            <h2 className="header-title">Algorun - Leetcode Tutor</h2>
            <p className="header-subtitle">AI-powered coding tutor</p>
          </div>
        </div>
        <div className="header-right">
          <a
            href="https://github.com/lwshakib/algo-run-leetcode-tutor"
            target="_blank"
            rel="noopener noreferrer"
            className="header-action-button"
            aria-label="View on GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
          <button
            onClick={clearSession}
            disabled={messages.length === 0 || isStreaming}
            className="header-action-button"
            aria-label="Clear chat session"
            title="Clear chat session"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="header-action-button"
            aria-label="Close chat"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="messages-container custom-scrollbar"
      >
        {messages.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon-wrapper">
              <BotMessageSquare className="empty-icon" />
            </div>
            <h3 className="empty-title">Welcome to Algorun!</h3>
            <p className="empty-text">
              Ask me anything about the problem. I can help explain concepts,
              suggest approaches, or review your code.
            </p>
          </div>
        )}

        {messages.map((message: Message) => {
          // Skip rendering assistant messages that have no content yet (they're being streamed)
          // The thinking indicator will handle showing the loading state
          if (
            message.role === "assistant" &&
            (!message.parts ||
              message.parts.length === 0 ||
              (message.parts.length === 1 &&
                message.parts[0]?.type === "text" &&
                !message.parts[0]?.text))
          ) {
            return null;
          }

          return (
            <div
              key={message.id}
              className={`message-row ${
                message.role === "user" ? "user" : "assistant"
              }`}
            >
              {message.role === "assistant" && (
                <div className="avatar-wrapper assistant">
                  <BotMessageSquare className="avatar-icon assistant" />
                </div>
              )}

              <div
                className={`message-bubble ${
                  message.role === "user" ? "user" : "assistant"
                }`}
              >
                {message.role === "user" ? (
                  <p className="user-message-text">
                    {message.parts?.[0]?.text || ""}
                  </p>
                ) : (
                  <div className="assistant-message-content">
                    {message.parts && message.parts.length > 0
                      ? message.parts.map((part: MessagePart, idx: number) => {
                          if (part.type === "text") {
                            return (
                              <MarkdownRenderer key={idx}>
                                {part.text}
                              </MarkdownRenderer>
                            );
                          }
                          return null;
                        })
                      : null}
                  </div>
                )}
              </div>

              {message.role === "user" && (
                <div className="avatar-wrapper user">
                  <User className="avatar-icon user" />
                </div>
              )}
            </div>
          );
        })}

        {isThinking && (
          <div className="message-row assistant">
            <div className="avatar-wrapper assistant">
              <BotMessageSquare className="avatar-icon assistant" />
            </div>
            <div className="message-bubble assistant">
              <div className="thinking-container">
                <div
                  className="thinking-dot"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="thinking-dot"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="thinking-dot"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="input-area">
        <div className="input-container">
          <input
            type="text"
            placeholder="Ask a question..."
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
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
