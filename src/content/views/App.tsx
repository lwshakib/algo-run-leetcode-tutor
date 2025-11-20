import FloatingChatBox from "@/components/FloatingChatBox";
import { BotMessageSquare, X } from "lucide-react";
import { useState } from "react";
import "./App.css";

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const metaDescriptionEl = document.querySelector("meta[name=description]");
  const problemStatement = metaDescriptionEl?.getAttribute("content") as string;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        className={`
          group relative w-16 h-16 rounded-full flex items-center justify-center
          bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600
          text-white shadow-xl hover:shadow-2xl
          transition-all duration-300 ease-out
          hover:scale-110 active:scale-95
          focus:outline-none focus:ring-4 focus:ring-purple-500/50
          border border-white/20 backdrop-blur-sm
          ${isChatOpen ? "rotate-90 opacity-80" : "hover:rotate-3"}
        `}
        aria-label={isChatOpen ? "Close Chat" : "Chat with Tutor"}
        onClick={() => setIsChatOpen((open) => !open)}
      >
        {/* Animated background glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 via-purple-400 to-indigo-400 opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300 -z-10" />

        {/* Icon with smooth transition */}
        <div className="transition-transform duration-300 group-hover:scale-110">
          {isChatOpen ? (
            <X size={28} className="transition-transform duration-300" />
          ) : (
            <BotMessageSquare
              size={28}
              className="transition-transform duration-300"
            />
          )}
        </div>

        {/* Pulse animation when closed */}
        {!isChatOpen && (
          <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping opacity-75" />
        )}
      </button>

      {isChatOpen && (
        <div className="animate-[fadeIn_0.3s_ease-out,slideUp_0.3s_ease-out]">
          <FloatingChatBox
            onClose={() => setIsChatOpen(false)}
            context={problemStatement}
          />
        </div>
      )}
    </div>
  );
}

export default App;
