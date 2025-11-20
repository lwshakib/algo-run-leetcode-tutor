import useSessionStorage from "@/hooks/useSessionStorage";
import { getGoogleModel } from "@/lib/model";
import { SYSTEM_PROMPT } from "@/lib/prompt";
import { Message, MessagePart } from "@/lib/types";
import { extractCode } from "@/lib/utils";
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
    const prompt = SYSTEM_PROMPT.replace(/{{problem_statement}}/gi, context)
      .replace(/{{programming_language}}/g, programmingLanguage)
      .replace(/{{user_code}}/g, extractedCode);

    const result = streamText({
      model: getGoogleModel(),
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
    <div className="absolute bottom-16 right-0 w-[500px] h-[600px] bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-0 border border-white/20 flex flex-col transition-all duration-300 text-white shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="flex justify-center items-center gap-2">
          <div className="relative">
            <img
              src={chrome.runtime.getURL("logo.svg")}
              alt="Algorun Logo"
              className="w-7 h-7 rounded-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-lg blur-sm -z-10" />
          </div>
          <div>
            <h2 className="text-base font-semibold leading-tight">
              Algorun - Leetcode Tutor
            </h2>
            <p className="text-xs text-white/60 leading-tight">
              AI-powered coding tutor
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/lwshakib/algo-run-leetcode-tutor"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
            aria-label="View on GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
          <button
            onClick={clearSession}
            disabled={messages.length === 0 || isStreaming}
            className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Clear chat session"
            title="Clear chat session"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
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
        className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 custom-scrollbar backdrop-blur-sm bg-white/5"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4">
              <BotMessageSquare className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Welcome to Algorun!</h3>
            <p className="text-sm text-white/70 max-w-sm">
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
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                  <BotMessageSquare className="w-4 h-4 text-blue-300" />
                </div>
              )}

              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 break-words transition-all duration-200 ${
                  message.role === "user"
                    ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg rounded-br-sm"
                    : "bg-white/10 text-white border border-white/10 rounded-bl-sm backdrop-blur-sm"
                }`}
              >
                {message.role === "user" ? (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.parts?.[0]?.text || ""}
                  </p>
                ) : (
                  <div className="text-sm leading-relaxed prose prose-invert prose-sm max-w-none">
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
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-4 h-4 text-indigo-300" />
                </div>
              )}
            </div>
          );
        })}

        {isThinking && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center flex-shrink-0 mt-1">
              <BotMessageSquare className="w-4 h-4 text-blue-300" />
            </div>
            <div className="max-w-[75%] rounded-2xl rounded-bl-sm px-4 py-3 bg-white/10 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full bg-white/60 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-white/60 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-white/60 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ask a question..."
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 text-white placeholder-white/50 transition-all duration-200 backdrop-blur-sm"
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
            className="px-4 py-3 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center min-w-[48px]"
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
