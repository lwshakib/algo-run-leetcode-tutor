import useSessionStorage from "@/hooks/useSessionStorage";
import { getGoogleModel } from "@/lib/model";
import { SYSTEM_PROMPT } from "@/lib/prompt";
import { Message, MessagePart } from "@/lib/types";
import { extractCode } from "@/lib/utils";
import { XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { convertToModelMessages, streamText } from "ai";
  
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
  
    const sendMessage = async () => {
      if (input.trim() === "") return;
      setInput("");
      setIsStreaming(true);
  
  
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
  
      for await (const part of result.fullStream) {
        if (part.type === "reasoning-delta") {
          // Add reasoning part
          const currentMessages = [...messagesWithAssistant];
          const assistantMsg = currentMessages.find(
            (msg) => msg.id === assistantMessage.id
          );
          if (assistantMsg) {
            assistantMsg.parts = assistantMsg.parts || [];
            let reasoningPart = assistantMsg.parts.find(
              (p) => p?.type === "reasoning"
            );
            if (!reasoningPart) {
              reasoningPart = { type: "reasoning", text: "" };
              assistantMsg.parts.push(reasoningPart);
            }
            reasoningPart.text += part.text;
            setMessages(currentMessages);
          }
        } else if (part.type === "text-delta") {
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
            textPart.text += part.text;
            setMessages(currentMessages);
          }
        }
      }
      setIsStreaming(false);
    };
  
    return (
      <div className="absolute bottom-16 right-0 w-[500px] h-[600px] bg-white/10 backdrop-blur-md rounded-xl p-0 border border-white/20 flex flex-col transition-all duration-300 text-white shadow-2xl">
        <div className="flex items-center justify-between p-4">
          <div className="flex justify-center items-center">
            <img
              src={chrome.runtime.getURL("logo.svg")}
              alt=""
              className="w-[25px] h-[25px]"
            />
            <h2 className="text-lg font-semibold ml-2">
              Algorun - Leetcode Tutor
            </h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto overflow-x-hidden p-4 scrollbar-hide"
        >
          {messages.map((message: Message) => (
            <div
              key={message.id}
              className={`mb-4 ${
                message.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block p-3 rounded-lg max-w-full break-words ${
                  message.role === "user" ? "text-white" : "text-white"
                }`}
              >
                {message.role === "user" ? (
                  <p className="text-sm">{message.parts?.[0]?.text || ""}</p>
                ) : (
                  <div className="text-sm">
                    {message.parts && message.parts.length > 0
                      ? message.parts.map((part: MessagePart, index: number) => {
                          if (part.type === "text") {
                            return <p key={`${message.id}-${index}`}>{part.text}</p>;
                          }
                        })
                      : null}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 p-2 border border-white/20 rounded-md focus:outline-none focus:border-white/40 bg-white/10 text-white placeholder-white/60"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
          </div>
        </div>
      </div>
    );
  }
  